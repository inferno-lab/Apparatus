---
id: TASK-19.5
title: 'M5: Validate memory behavior and mission outcomes'
status: Done
assignee: []
created_date: '2026-02-22 19:43'
updated_date: '2026-02-22 20:22'
labels:
  - feature
  - ai
  - autopilot
  - redteam
  - testing
milestone: m-4
dependencies:
  - TASK-19.1
  - TASK-19.2
  - TASK-19.3
  - TASK-19.4
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/src/ai/report-store.ts
  - apps/apparatus/test
documentation:
  - apps/apparatus/docs/development/plans/AI-kill-chain-memory.md
parent_task_id: TASK-19
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add regression coverage and verification commands for memory growth limits, dedupe correctness, and mission-state compatibility.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Automated tests cover memory growth, dedupe, and pruning edge cases.
- [x] #2 Autopilot mission flow remains stable across running/stopping/completed/failed states with memory enabled.
- [x] #3 Verification commands and results are documented in task notes/final summary.
- [x] #4 Any residual risk or follow-up gaps are explicitly documented.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add a dedicated autopilot memory-state compatibility test file for completed/stopped/failed terminal states.
2. Use an isolated undici request mock in the new test to force a deterministic mission failure path.
3. Verify session memory presence/shape across terminal states.
4. Re-run focused backend + dashboard logic tests and type-check/build checks.
5. Document command receipts and residual risk notes, then mark task Done.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Confirmed memory growth/dedupe/pruning coverage remains in `apps/apparatus/test/report-store.memory.test.ts` (assets/observations/progress limits and deterministic dedupe).

Added `apps/apparatus/test/autopilot.memory-states.test.ts` to validate memory-enabled mission compatibility across terminal states: `completed`, `stopped`, and `failed` (with deterministic `/metrics` failure mock).

Retained extraction/prompt coverage in `test/redteam.memory-extraction.test.ts` and `test/redteam.planner-payload.test.ts`; retained frontend memory-view assertions in `src/dashboard/components/dashboard/AutopilotConsole.logic.test.ts`.

Verification command: `pnpm --filter @apparatus/server test -- test/autopilot.memory-states.test.ts test/autopilot.test.ts test/redteam.planner-payload.test.ts test/redteam.memory-extraction.test.ts test/report-store.memory.test.ts test/redteam.decision.test.ts src/dashboard/components/dashboard/AutopilotConsole.logic.test.ts` (passed: 7 files, 20 tests).

Type-check: `pnpm --filter @apparatus/server exec tsc --noEmit` (passed).

Dashboard build: `pnpm --filter @apparatus/dashboard build` (passed).

Residual risk: failed-state mission compatibility is validated through a controlled undici mock for `/metrics` failure, which is deterministic for CI but does not emulate every production outage mode. Follow-up could add chaos-style integration checks against real transient network failures in a dedicated environment.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed M5 validation by confirming memory growth/dedupe/pruning tests, adding mission-state compatibility coverage for completed/stopped/failed with memory enabled, and running full targeted verification receipts (tests, server type-check, dashboard build). Documented remaining risk around synthetic failure-mode simulation versus full production-network fault modeling.
<!-- SECTION:FINAL_SUMMARY:END -->
