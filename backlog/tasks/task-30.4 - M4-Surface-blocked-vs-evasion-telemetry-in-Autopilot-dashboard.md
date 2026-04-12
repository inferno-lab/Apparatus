---
id: TASK-30.4
title: 'M4: Surface blocked-vs-evasion telemetry in Autopilot dashboard'
status: Done
assignee: []
created_date: '2026-02-22 23:53'
updated_date: '2026-02-23 00:58'
labels:
  - feature
  - ai
  - autopilot
  - dashboard
milestone: m-9
dependencies:
  - TASK-30.1
  - TASK-30.2
  - TASK-30.3
references:
  - apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.tsx
  - apps/apparatus/src/dashboard/hooks/useAutopilot.ts
  - apps/apparatus/src/ai/report-store.ts
parent_task_id: TASK-30
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Expose backend evasion signals in dashboard Autopilot views so operators can distinguish blocked actions from successful pivots and understand maneuver context.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Autopilot UI shows evasion maneuver entries with signal type and selected countermeasure.
- [x] #2 Blocked-vs-evaded indicators render from session data with resilient empty/loading states.
- [x] #3 UI changes preserve existing autopilot console behavior and state transitions.
- [x] #4 UI-focused tests cover evasion telemetry rendering and fallback behavior.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
M4 complete: dashboard now renders evasion maneuver entries with trigger signal + countermeasure, blocked-vs-evaded indicators, and safe fallback states while preserving Mission Control state transitions and controls.

Implemented blocked-vs-evaded telemetry surfacing in `apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.tsx` with new Defense Telemetry panel, maneuver-aware action log lines, and resilient loading/empty states.

Extended client-side autopilot session types in `apps/apparatus/src/dashboard/hooks/useAutopilot.ts` and added telemetry derivation helpers in `apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.logic.ts`.

Added/expanded UI-focused tests in `apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.logic.test.ts` and `apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.component.test.tsx` (objective gating, crash interlock, active-state controls, payload clamping).
<!-- SECTION:NOTES:END -->
