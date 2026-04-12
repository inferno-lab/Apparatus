---
id: TASK-19.2
title: 'M2: Build memory extraction pipeline in mission loop'
status: Done
assignee: []
created_date: '2026-02-22 19:43'
updated_date: '2026-02-22 19:52'
labels:
  - feature
  - ai
  - autopilot
  - redteam
  - backend
milestone: m-4
dependencies:
  - TASK-19.1
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/src/tool-executor.ts
  - apps/apparatus/src/ai/report-store.ts
documentation:
  - apps/apparatus/docs/development/plans/AI-kill-chain-memory.md
parent_task_id: TASK-19
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Capture structured memory candidates from action and verification phases and persist them into SessionContext each iteration.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Mission loop writes normalized observations/entities after each iteration.
- [x] #2 Extraction logic preserves raw evidence and stores normalized memory entries.
- [x] #3 Memory updates are resilient to malformed tool output and do not break mission execution.
- [x] #4 Tests validate extraction for success/failure action paths and verification notes.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented memory extraction in `apps/apparatus/src/ai/redteam.ts` for action and verification phases via `captureActionMemory` and `captureVerificationMemory`.

Mission loop now records normalized observations, asset candidates, relations, and objective-progress signals after action execution and verification.

Added resilience guard `safeCaptureMemory(...)` so malformed/edge memory extraction errors are logged and do not terminate missions.

Added focused tests in `apps/apparatus/test/redteam.memory-extraction.test.ts` for successful action extraction, failed action extraction, and verification evidence mapping.

Verification: `pnpm --filter @apparatus/server test -- test/redteam.memory-extraction.test.ts test/report-store.memory.test.ts test/redteam.decision.test.ts test/autopilot.test.ts` (passed: 4 files, 12 tests).

Type-check: `pnpm --filter @apparatus/server exec tsc --noEmit` (passed).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed M2 by wiring structured memory extraction into the autopilot mission loop. Each iteration now captures action and verification evidence into session context (observations/assets/relations/progress signals), including failure-path signals, with protective error isolation to avoid mission disruption. Added dedicated extraction tests and verified full targeted autopilot suite + type-check.
<!-- SECTION:FINAL_SUMMARY:END -->
