---
id: TASK-19.4
title: 'M4: Surface acquired assets in Autopilot Console'
status: Done
assignee: []
created_date: '2026-02-22 19:43'
updated_date: '2026-02-22 20:19'
labels:
  - feature
  - ai
  - autopilot
  - redteam
  - ui
milestone: m-4
dependencies:
  - TASK-19.1
  - TASK-19.2
references:
  - apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.tsx
documentation:
  - apps/apparatus/docs/development/plans/AI-kill-chain-memory.md
parent_task_id: TASK-19
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add an operator-facing memory panel that shows acquired assets and key relationships with source attribution and recency.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Console shows acquired assets with type/source/recency metadata.
- [x] #2 A lightweight relation strip/list is visible before full graph visualization.
- [x] #3 UI uses shared component-library primitives and existing dashboard styling tokens.
- [x] #4 Frontend tests or component-level assertions cover empty and populated states.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented first-pass UI surfacing in `apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.tsx`: new `Acquired Assets` panel and `Relation Strip` with break/opened-path/precondition indicators.

Updated dashboard session typings in `apps/apparatus/src/dashboard/hooks/useAutopilot.ts` to include `sessionContext` structures from backend responses.

Verification: `pnpm --filter @apparatus/dashboard build` (passed).

Pending before close: add explicit frontend component assertions or dedicated UI test harness coverage for empty/populated memory states.

Added `apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.logic.ts` to centralize memory-panel view-model derivation and formatting helpers.

Added `apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.logic.test.ts` with explicit empty-state and populated-state assertions (sorting, caps, progress signal passthrough, label/timestamp formatting).

Refactored `AutopilotConsole.tsx` to consume tested logic helpers for acquired assets and relation strip presentation.

Verification: `pnpm --filter @apparatus/server test -- src/dashboard/components/dashboard/AutopilotConsole.logic.test.ts test/redteam.planner-payload.test.ts test/redteam.memory-extraction.test.ts test/report-store.memory.test.ts test/redteam.decision.test.ts test/autopilot.test.ts` (passed: 6 files, 17 tests).

Type-check: `pnpm --filter @apparatus/server exec tsc --noEmit` (passed).

Dashboard build: `pnpm --filter @apparatus/dashboard build` (passed).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed M4 by surfacing session memory in Autopilot Console with a dedicated Acquired Assets panel and Relation Strip, then adding explicit frontend logic assertions for empty and populated states. Component presentation now relies on tested derivation helpers, and all targeted backend/frontend verification commands pass.
<!-- SECTION:FINAL_SUMMARY:END -->
