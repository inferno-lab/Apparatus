import type { ActionEntry, SessionContext, SessionContextAsset, SessionContextRelation } from '../../hooks/useAutopilot';

const ACQUIRED_ASSETS_LIMIT = 14;
const RELATION_STRIP_LIMIT = 16;

function timestampOrZero(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export interface AutopilotMemoryPanelModel {
  acquiredAssets: SessionContextAsset[];
  relationStrip: SessionContextRelation[];
  breakSignals: string[];
  openedPaths: string[];
  preconditions: string[];
}

export interface EvasionManeuverEntry {
  id: string;
  at: string;
  ok: boolean;
  tool: string;
  triggerSignal: string;
  countermeasure: string | null;
  rationale: string;
}

export interface AutopilotEvasionTelemetryModel {
  blockedSignals: string[];
  blockedSignalEvents: number;
  evasionManeuvers: EvasionManeuverEntry[];
  successfulEvasions: number;
  stalledEvasions: number;
}

export function statusVariant(status?: string): 'neutral' | 'warning' | 'danger' | 'success' | 'primary' {
  if (!status) return 'neutral';
  if (status === 'running') return 'primary';
  if (status === 'stopping') return 'warning';
  if (status === 'failed') return 'danger';
  if (status === 'completed') return 'success';
  if (status === 'stopped') return 'warning';
  return 'neutral';
}

export function toggleAllowedTool(current: string[], tool: string): string[] {
  if (current.includes(tool)) {
    const next = current.filter((item) => item !== tool);
    return next.length > 0 ? next : current;
  }
  return [...current, tool];
}

export function clampMaxIterations(value: number): number {
  return Math.max(1, Math.min(30, Number(value) || 1));
}

export function clampIntervalMs(value: number): number {
  return Math.max(0, Math.min(30000, Number(value) || 0));
}

export function isMissionStartDisabled(active: boolean, objective: string): boolean {
  return active || !objective.trim();
}

export function deriveAutopilotMemoryPanelModel(
  sessionContext?: SessionContext | null
): AutopilotMemoryPanelModel {
  const assets = sessionContext?.assets || [];
  const relations = sessionContext?.relations || [];
  const objectiveProgress = sessionContext?.objectiveProgress;

  return {
    acquiredAssets: [...assets]
      .sort((left, right) => timestampOrZero(right.lastSeenAt) - timestampOrZero(left.lastSeenAt))
      .slice(0, ACQUIRED_ASSETS_LIMIT),
    relationStrip: [...relations]
      .sort((left, right) => timestampOrZero(right.lastSeenAt) - timestampOrZero(left.lastSeenAt))
      .slice(0, RELATION_STRIP_LIMIT),
    breakSignals: objectiveProgress?.breakSignals || [],
    openedPaths: objectiveProgress?.openedPaths || [],
    preconditions: objectiveProgress?.preconditionsMet || [],
  };
}

function mapBreakSignalToDefenseSignal(value: string) {
  const normalized = value.trim();
  if (!normalized.startsWith('defense-signal:')) return null;
  const signal = normalized.slice('defense-signal:'.length).trim();
  return signal ? signal : null;
}

export function deriveAutopilotEvasionTelemetryModel(input: {
  breakSignals?: string[] | null;
  actions?: ActionEntry[] | null;
}): AutopilotEvasionTelemetryModel {
  const breakSignals = input.breakSignals || [];
  const actions = input.actions || [];

  const blockedSignalEvents = breakSignals
    .map(mapBreakSignalToDefenseSignal)
    .filter((signal): signal is string => Boolean(signal))
    .length;

  const blockedSignals = Array.from(
    new Set(
      breakSignals
        .map(mapBreakSignalToDefenseSignal)
        .filter((signal): signal is string => Boolean(signal))
    )
  );

  const evasionManeuvers = [...actions]
    .filter((entry) => Boolean(entry.maneuver))
    .map((entry) => ({
      countermeasure: typeof entry.maneuver?.countermeasure === 'string' && entry.maneuver.countermeasure.trim()
        ? entry.maneuver.countermeasure.trim()
        : null,
      id: entry.id,
      at: entry.at,
      ok: entry.ok,
      tool: entry.tool,
      triggerSignal: entry.maneuver?.triggerSignal || 'unknown',
      rationale: entry.maneuver?.rationale || 'No rationale provided.',
    }))
    .sort((left, right) => timestampOrZero(right.at) - timestampOrZero(left.at));

  const successfulEvasions = evasionManeuvers.filter((entry) => entry.countermeasure !== null && entry.ok).length;
  const stalledEvasions = evasionManeuvers.filter((entry) => entry.countermeasure === null || !entry.ok).length;

  return {
    blockedSignals,
    blockedSignalEvents,
    evasionManeuvers,
    successfulEvasions,
    stalledEvasions,
  };
}

export function formatSeenAt(value?: string) {
  if (!value) return 'n/a';
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return 'n/a';
  return new Date(timestamp).toLocaleTimeString();
}

export function compactAssetLabel(value: string) {
  const cleaned = value.replace(/^asset:/, '');
  if (cleaned.length <= 52) return cleaned;
  return `${cleaned.slice(0, 49)}...`;
}
