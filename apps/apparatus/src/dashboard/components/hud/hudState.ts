export const HUD_PREFERENCES_KEY = 'apparatus-dashboard-hud:v1';
export const HUD_VISIBILITY_KEY = 'apparatus-dashboard-hud:hidden';
export const HUD_STATE_CHANGED_EVENT = 'hud-state-changed';

export interface HudStateChangedDetail {
  hidden: boolean;
  statsVisible: boolean;
  thoughtsVisible: boolean;
}

type HudPreferenceRecord = Record<string, unknown> & {
  stats?: Record<string, unknown> & { visible?: boolean };
  thoughts?: Record<string, unknown> & { visible?: boolean };
};

function toRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null
    ? value as Record<string, unknown>
    : {};
}

function loadPreferenceRecord(): HudPreferenceRecord {
  try {
    const raw = localStorage.getItem(HUD_PREFERENCES_KEY);
    if (!raw) return {};
    return toRecord(JSON.parse(raw)) as HudPreferenceRecord;
  } catch {
    return {};
  }
}

export function loadHudHiddenPreference(): boolean {
  try {
    const raw = localStorage.getItem(HUD_VISIBILITY_KEY);
    return raw === null ? true : raw === '1';
  } catch {
    return true;
  }
}

export function loadHudWidgetVisibilityPreference(): Pick<HudStateChangedDetail, 'statsVisible' | 'thoughtsVisible'> {
  const record = loadPreferenceRecord();
  return {
    statsVisible: record.stats?.visible === true,
    thoughtsVisible: record.thoughts?.visible === true,
  };
}

export function persistHudVisibilityState(detail: HudStateChangedDetail): void {
  try {
    localStorage.setItem(HUD_VISIBILITY_KEY, detail.hidden ? '1' : '0');
    const existing = loadPreferenceRecord();
    const statsExisting = toRecord(existing.stats);
    const thoughtsExisting = toRecord(existing.thoughts);
    const next: HudPreferenceRecord = {
      ...existing,
      stats: {
        ...statsExisting,
        visible: detail.statsVisible,
      },
      thoughts: {
        ...thoughtsExisting,
        visible: detail.thoughtsVisible,
      },
    };
    localStorage.setItem(HUD_PREFERENCES_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable
  }
}
