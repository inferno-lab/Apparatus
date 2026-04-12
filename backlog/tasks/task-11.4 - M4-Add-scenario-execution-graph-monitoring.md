---
id: TASK-11.4
title: 'M4: Add scenario execution graph monitoring'
status: Done
assignee: []
created_date: '2026-02-22 02:43'
updated_date: '2026-02-22 05:07'
labels:
  - feature
  - apparatus-dashboard
  - scenarios
milestone: m-3
dependencies:
  - TASK-11.3
documentation:
  - apps/apparatus/docs/development/plans/drag-and-drop-scenario-builder.md
  - apps/apparatus/src/scenarios.ts
parent_task_id: TASK-11
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Visualize runtime execution state directly on the node graph by polling run status and highlighting active/terminal nodes.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Running a scenario from the builder tracks executionId and polls run status until terminal state.
- [x] #2 The active node is highlighted using backend currentStepId while status is running.
- [x] #3 Terminal status (completed/failed) is reflected in a user-visible summary with error details on failures.
- [x] #4 Polling lifecycle is cleaned up on completion/unmount to prevent background leaks.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Started M4 implementation: wiring run execution status polling (`executionId` + `/scenarios/:id/status`) into Scenario Console and projecting currentStepId/terminal state onto canvas UI.

Extended `useScenarios` to return scenario run start payloads (`executionId`) and fetch `/scenarios/:id/status` for active execution polling.

Scenario Console now tracks active run state, polls status on an interval while running, projects `currentStepId` onto canvas node highlighting, and surfaces terminal summaries (including failure error details).

Polling lifecycle uses effect cleanup on dependency change/unmount and automatically stops when run status transitions out of `running`.

Verification receipts: `pnpm --filter @apparatus/dashboard type-check`, `pnpm --filter @apparatus/dashboard build`, `pnpm --filter @apparatus/server test -- scenario-builder-mapping.test.ts` (29 passing).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
M4 delivered live execution monitoring in the scenario builder: run starts now capture execution IDs, status polling tracks backend progress, active/terminal steps are visually highlighted on the graph, and terminal completion/failure details are surfaced to users with cleanup-safe polling lifecycle management.
<!-- SECTION:FINAL_SUMMARY:END -->
