import { describe, expect, it } from 'vitest';
import type { SessionContext } from '../../hooks/useAutopilot';
import {
  clampIntervalMs,
  clampMaxIterations,
  compactAssetLabel,
  deriveAutopilotEvasionTelemetryModel,
  deriveAutopilotMemoryPanelModel,
  formatSeenAt,
  isMissionStartDisabled,
  statusVariant,
  toggleAllowedTool,
} from './AutopilotConsole.logic';

function makeSessionContext(overrides: Partial<SessionContext> = {}): SessionContext {
  return {
    assets: [],
    observations: [],
    relations: [],
    objectiveProgress: {
      preconditionsMet: [],
      openedPaths: [],
      breakSignals: [],
      lastUpdatedAt: '2026-02-22T00:00:00.000Z',
    },
    ...overrides,
  };
}

describe('AutopilotConsole.logic', () => {
  it('derives empty model safely when session context is missing', () => {
    const model = deriveAutopilotMemoryPanelModel(undefined);
    expect(model.acquiredAssets).toEqual([]);
    expect(model.relationStrip).toEqual([]);
    expect(model.breakSignals).toEqual([]);
    expect(model.openedPaths).toEqual([]);
    expect(model.preconditions).toEqual([]);
  });

  it('derives sorted and bounded memory model for populated context', () => {
    const model = deriveAutopilotMemoryPanelModel(
      makeSessionContext({
        assets: Array.from({ length: 18 }).map((_, index) => ({
          id: `asset-${index}`,
          type: 'endpoint',
          value: `/path-${index}`,
          source: 'verification',
          confidence: 0.8,
          firstSeenAt: `2026-02-22T00:00:${String(index).padStart(2, '0')}.000Z`,
          lastSeenAt: `2026-02-22T00:00:${String(index).padStart(2, '0')}.000Z`,
          occurrences: 1,
        })),
        relations: Array.from({ length: 19 }).map((_, index) => ({
          id: `rel-${index}`,
          type: 'targets',
          fromAssetId: `asset:endpoint:/path-${index}`,
          toAssetId: `asset:vuln:new-5xx-errors:${index}`,
          source: 'verification',
          confidence: 0.9,
          firstSeenAt: `2026-02-22T00:01:${String(index).padStart(2, '0')}.000Z`,
          lastSeenAt: `2026-02-22T00:01:${String(index).padStart(2, '0')}.000Z`,
          occurrences: 1,
        })),
        objectiveProgress: {
          preconditionsMet: ['no-break-detected'],
          openedPaths: ['/checkout'],
          breakSignals: ['new-5xx-errors:4'],
          lastUpdatedAt: '2026-02-22T00:01:59.000Z',
        },
      })
    );

    expect(model.acquiredAssets).toHaveLength(14);
    expect(model.acquiredAssets[0]?.id).toBe('asset-17');
    expect(model.relationStrip).toHaveLength(16);
    expect(model.relationStrip[0]?.id).toBe('rel-18');
    expect(model.breakSignals).toEqual(['new-5xx-errors:4']);
    expect(model.openedPaths).toEqual(['/checkout']);
    expect(model.preconditions).toEqual(['no-break-detected']);
  });

  it('formats timestamps and compacts long labels', () => {
    expect(formatSeenAt(undefined)).toBe('n/a');
    expect(formatSeenAt('not-a-date')).toBe('n/a');
    expect(formatSeenAt('2026-02-22T00:00:00.000Z')).not.toBe('n/a');

    const long = `asset:endpoint:${'x'.repeat(100)}`;
    expect(compactAssetLabel(long).length).toBeLessThanOrEqual(52);
    expect(compactAssetLabel('asset:endpoint:/checkout')).toBe('endpoint:/checkout');
  });

  it('derives blocked-vs-evasion telemetry with maneuver details', () => {
    const telemetry = deriveAutopilotEvasionTelemetryModel({
      breakSignals: [
        'defense-signal:rate_limited',
        'defense-signal:rate_limited',
        'defense-signal:waf_blocked',
        'new-5xx-errors:2',
      ],
      actions: [
        {
          id: 'act-1',
          at: '2026-02-22T00:01:00.000Z',
          tool: 'delay',
          params: { duration: 1500 },
          ok: true,
          message: 'Delayed for 1500ms',
          maneuver: {
            triggerSignal: 'rate_limited',
            countermeasure: 'delay',
            rationale: 'Backoff after 429',
          },
        },
        {
          id: 'act-2',
          at: '2026-02-22T00:01:05.000Z',
          tool: 'mtd.rotate',
          params: { prefix: 'rt12aa' },
          ok: false,
          message: 'Rotate failed',
          maneuver: {
            triggerSignal: 'waf_blocked',
            countermeasure: 'mtd.rotate',
            rationale: 'Pivot route after block',
          },
        },
        {
          id: 'act-3',
          at: '2026-02-22T00:01:10.000Z',
          tool: 'delay',
          params: { duration: 900 },
          ok: true,
          message: 'Delayed for 900ms',
        },
      ],
    });

    expect(telemetry.blockedSignalEvents).toBe(3);
    expect(telemetry.blockedSignals).toEqual(['rate_limited', 'waf_blocked']);
    expect(telemetry.evasionManeuvers).toHaveLength(2);
    expect(telemetry.evasionManeuvers[0]?.id).toBe('act-2');
    expect(telemetry.successfulEvasions).toBe(1);
    expect(telemetry.stalledEvasions).toBe(1);
  });

  it('treats empty countermeasures as stalled without magic-string coupling', () => {
    const telemetry = deriveAutopilotEvasionTelemetryModel({
      breakSignals: ['defense-signal:rate_limited'],
      actions: [
        {
          id: 'act-x',
          at: '2026-02-22T00:01:00.000Z',
          tool: 'delay',
          params: { duration: 1500 },
          ok: true,
          message: 'Delayed for 1500ms',
          maneuver: {
            triggerSignal: 'rate_limited',
            countermeasure: '',
            rationale: '',
          },
        },
      ],
    });

    expect(telemetry.evasionManeuvers).toHaveLength(1);
    expect(telemetry.evasionManeuvers[0]?.countermeasure).toBeNull();
    expect(telemetry.successfulEvasions).toBe(0);
    expect(telemetry.stalledEvasions).toBe(1);
  });

  it('handles empty telemetry inputs safely', () => {
    const telemetry = deriveAutopilotEvasionTelemetryModel({
      breakSignals: null,
      actions: undefined,
    });

    expect(telemetry.blockedSignals).toEqual([]);
    expect(telemetry.blockedSignalEvents).toBe(0);
    expect(telemetry.evasionManeuvers).toEqual([]);
    expect(telemetry.successfulEvasions).toBe(0);
    expect(telemetry.stalledEvasions).toBe(0);
  });

  it('exposes mission control guardrail helpers', () => {
    expect(statusVariant()).toBe('neutral');
    expect(statusVariant('running')).toBe('primary');
    expect(statusVariant('stopping')).toBe('warning');
    expect(statusVariant('failed')).toBe('danger');
    expect(statusVariant('completed')).toBe('success');
    expect(statusVariant('stopped')).toBe('warning');
    expect(statusVariant('unexpected')).toBe('neutral');

    expect(clampMaxIterations(0)).toBe(1);
    expect(clampMaxIterations(31)).toBe(30);
    expect(clampMaxIterations(12)).toBe(12);

    expect(clampIntervalMs(-1)).toBe(0);
    expect(clampIntervalMs(45000)).toBe(30000);
    expect(clampIntervalMs(1500)).toBe(1500);

    expect(toggleAllowedTool(['delay', 'chaos.cpu'], 'chaos.cpu')).toEqual(['delay']);
    expect(toggleAllowedTool(['delay'], 'delay')).toEqual(['delay']);
    expect(toggleAllowedTool(['delay'], 'mtd.rotate')).toEqual(['delay', 'mtd.rotate']);

    expect(isMissionStartDisabled(true, 'Find break')).toBe(true);
    expect(isMissionStartDisabled(false, '   ')).toBe(true);
    expect(isMissionStartDisabled(false, 'Find break')).toBe(false);
  });
});
