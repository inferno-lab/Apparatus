---
id: TASK-32.3
title: 'M3: Add persona selector and behavior tags to Autopilot Console'
status: Done
assignee: []
created_date: '2026-02-23 01:45'
updated_date: '2026-02-23 01:52'
labels:
  - feature
  - ai
  - autopilot
  - redteam
  - dashboard
milestone: m-14
dependencies:
  - TASK-32.1
references:
  - apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.tsx
  - apps/apparatus/src/dashboard/hooks/useAutopilot.ts
  - >-
    apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.component.test.tsx
documentation:
  - apps/apparatus/docs/development/plans/AI-persona-profiles.md
parent_task_id: TASK-32
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Expose persona options in Mission Control, pass selected persona in start payload, and render persona behavior tags so operators can understand expected aggressiveness/stealth posture.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Mission Control includes a persona selector populated from backend-supported persona metadata or safe local defaults.
- [x] #2 Selected persona is included in `start(...)` payload and reflected in local session view model.
- [x] #3 Behavior tags (for example LOW_STEALTH/HIGH_INTELLIGENCE) render for the selected persona with empty-state fallback.
- [x] #4 Component tests verify selector behavior and persona payload propagation.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added mission-control persona selector and behavior tags in `apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.tsx` with backend-config fallback defaults.

Extended `apps/apparatus/src/dashboard/hooks/useAutopilot.ts` to fetch/store autopilot config metadata and include `persona` in start payload contract.

Updated `apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.component.test.tsx` to verify default persona payload, selector-driven persona payload, and tag rendering.
<!-- SECTION:NOTES:END -->
