---
id: TASK-30
title: AI blue-team evasion initiative (tactical switching)
status: Done
assignee: []
created_date: '2026-02-22 23:52'
updated_date: '2026-02-23 00:58'
labels:
  - feature
  - ai
  - autopilot
  - redteam
milestone: m-5
dependencies: []
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/src/ai/report-store.ts
  - apps/apparatus/src/tool-executor.ts
  - apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.tsx
documentation:
  - apps/apparatus/docs/development/plans/AI-blue-team-evasion.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement Autopilot tactical switching so defensive responses (block/rate-limit/tarpit patterns) are detected and converted into safe, auditable evasion maneuvers, with planner-context integration and dashboard visibility.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A complete milestone-based task graph exists for M1-M5 with dependencies and file references.
- [x] #2 Autopilot can ingest recent defense feedback and use it in planner decisions.
- [x] #3 Tactical pivots and emergency maneuvers are logged with operator-visible reasoning.
- [x] #4 Dashboard surfaces blocked vs evasion signals from autopilot sessions.
- [x] #5 Validation commands and review artifacts are captured before initiative closure.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Execute TASK-30.1 to add structured prior-defense feedback into autopilot planner context and session memory.
2. Execute TASK-30.2 to implement deterministic pivot/backoff policy driven by defense signal classification.
3. Execute TASK-30.3 to wire emergency evasion maneuvers (`mtd.rotate` first) with explicit maneuver logging.
4. Execute TASK-30.4 to expose blocked/evasion telemetry and maneuver context in Autopilot dashboard views.
5. Execute TASK-30.5 to run focused regression plus specialist/test-gap audits and finalize rollout evidence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Created milestone set m-5 through m-10 and subtasks TASK-30.1 through TASK-30.5 with dependencies mapped to M1→M5 execution order.

Expanded `apps/apparatus/docs/development/plans/AI-blue-team-evasion.md` into a full implementation blueprint and created milestone/task structure m-5..m-10 with TASK-30.1..TASK-30.5.

Started execution and completed TASK-30.1 (M1 feedback plumbing) with passing focused tests and type-check evidence.

Completed TASK-30.2 and TASK-30.3 with passing focused verification: `pnpm --filter @apparatus/server test -- test/redteam.evasion-policy.test.ts test/redteam.defense-signal.test.ts test/redteam.decision.test.ts test/redteam.planner-payload.test.ts test/redteam.memory-extraction.test.ts test/autopilot.test.ts test/autopilot.memory-states.test.ts` and `pnpm --filter @apparatus/server exec tsc --noEmit`.

Completed TASK-30.4 and TASK-30.5 with final receipts and reviews. Dashboard now surfaces blocked-vs-evaded telemetry and maneuver context; initiative verification artifacts captured.

Residual coverage expansion for non-Mission-Control display panels is tracked in `TASK-31` as non-blocking follow-up.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
AI blue-team evasion initiative complete. Delivered signal ingestion, tactical policy pivots, emergency maneuver audit records, dashboard telemetry surfacing, and full verification/review evidence. No critical blockers remain; additional component breadth tests are tracked separately in TASK-31.
<!-- SECTION:FINAL_SUMMARY:END -->
