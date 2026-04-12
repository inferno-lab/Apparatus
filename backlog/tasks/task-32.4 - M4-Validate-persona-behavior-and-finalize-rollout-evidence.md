---
id: TASK-32.4
title: 'M4: Validate persona behavior and finalize rollout evidence'
status: Done
assignee: []
created_date: '2026-02-23 01:45'
updated_date: '2026-02-23 02:22'
labels:
  - feature
  - ai
  - autopilot
  - redteam
  - verification
milestone: m-15
dependencies:
  - TASK-32.2
  - TASK-32.3
references:
  - apps/apparatus/test/autopilot.test.ts
  - apps/apparatus/test/redteam.decision.test.ts
  - >-
    apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.component.test.tsx
documentation:
  - apps/apparatus/docs/development/plans/AI-persona-profiles.md
parent_task_id: TASK-32
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Run focused backend and dashboard verification to confirm persona contract stability and observable behavior deltas, then document residual risk and rollout readiness.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Focused test bundle passes for persona-aware backend planner and autopilot contract tests.
- [x] #2 Dashboard persona selector/component tests pass and build remains green.
- [x] #3 Review artifacts are captured (specialist review and test-gap audit) or blocking environment constraints are explicitly documented.
- [x] #4 Parent initiative task is updated with completion evidence and any residual risks.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Focused verification completed:
- `pnpm --filter @apparatus/server test -- test/autopilot.test.ts test/redteam.planner-payload.test.ts test/redteam.persona.test.ts src/dashboard/components/dashboard/AutopilotConsole.component.test.tsx` (pass)
- `pnpm --filter @apparatus/server exec tsc --noEmit` (pass)
- `pnpm --dir apps/apparatus/src/dashboard exec tsc --noEmit` (pass)

Review artifact constraint:
- Attempted `scripts/specialist-review.sh` and `scripts/test-review-request.sh`, but these scripts are not present in this repository (`no such file or directory`). Constraint documented per acceptance criterion.

Parent initiative `TASK-32` updated with implementation evidence and completion summary.

agent-loops review loop executed using global skill scripts:

- specialist review: `.agents/reviews/review-20260222-210251.md`

- specialist review: `.agents/reviews/review-20260222-210529.md`

- specialist review: `.agents/reviews/review-20260222-210823.md`

- specialist review: `.agents/reviews/review-20260222-211149.md`

- specialist review: `.agents/reviews/review-20260222-211441.md`

- specialist review: `.agents/reviews/review-20260222-211740.md`

- quick test audit: `.agents/reviews/test-audit-20260222-212023.md`

Applied follow-up remediations from review findings in `redteam.ts` and `redteam.persona.test.ts`: weighted-selection boundary hardening, prompt fragment sanitization hardening, policy-bias invariants/tests, and shared test session-control factory for wrapper deduplication.

Full-scope test-audit attempt (`test-audit-20260222-205836.md`) exceeded budget cap; quick-mode audit completed successfully.
<!-- SECTION:NOTES:END -->
