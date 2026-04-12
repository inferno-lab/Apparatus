---
id: TASK-19.3
title: 'M3: Inject memory summary into autopilot planner prompts'
status: Done
assignee: []
created_date: '2026-02-22 19:43'
updated_date: '2026-02-22 19:56'
labels:
  - feature
  - ai
  - autopilot
  - redteam
  - backend
milestone: m-4
dependencies:
  - TASK-19.1
  - TASK-19.2
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/src/ai/report-store.ts
documentation:
  - apps/apparatus/docs/development/plans/AI-kill-chain-memory.md
parent_task_id: TASK-19
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Augment planner prompts with a bounded memory summary so prior findings influence tool selection and objective progression.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Planner payload includes compact memory summary after evidence is captured.
- [x] #2 Token budget/size guardrails prevent unbounded prompt growth.
- [x] #3 Objective-progress checks consult SessionContext before selecting next actions.
- [x] #4 Tests cover prompt payload composition with and without memory entries.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented bounded planner memory summary and payload composition in `apps/apparatus/src/ai/redteam.ts` (`buildPlannerMemorySummary`, `composePlannerPayload`).

Planner prompt now includes `memory` context (totals, recent assets/observations/relations, objective progress) on every decision.

Added objective-progress gating in planner decision flow: when session memory includes break signals, autopilot pauses with a short delay/none action instead of escalating blindly.

Added tests in `apps/apparatus/test/redteam.planner-payload.test.ts` covering payload composition with empty memory, populated memory, truncation bounds, and break-signal gating behavior.

Verification: `pnpm --filter @apparatus/server test -- test/redteam.planner-payload.test.ts test/redteam.memory-extraction.test.ts test/report-store.memory.test.ts test/redteam.decision.test.ts test/autopilot.test.ts` (passed: 5 files, 14 tests).

Type-check: `pnpm --filter @apparatus/server exec tsc --noEmit` (passed).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed M3 by injecting bounded session memory into autopilot planner prompts and adding objective-progress guard checks before action selection. Prompt composition now carries compact prior evidence and progress signals without unbounded growth, with tests validating empty/populated payload behavior and break-signal pause logic.
<!-- SECTION:FINAL_SUMMARY:END -->
