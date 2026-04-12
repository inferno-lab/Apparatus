---
id: TASK-30.1
title: 'M1: Add structured defense feedback signals to autopilot planner context'
status: Done
assignee:
  - codex
created_date: '2026-02-22 23:52'
updated_date: '2026-02-23 00:09'
labels:
  - feature
  - ai
  - autopilot
  - redteam
milestone: m-6
dependencies: []
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/src/ai/report-store.ts
  - apps/apparatus/test/redteam.planner-payload.test.ts
  - apps/apparatus/test/redteam.memory-extraction.test.ts
parent_task_id: TASK-30
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Capture previous-iteration defensive feedback (status/body/latency/signal classification) and inject it into planner payload and session memory for decision-time use.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Autopilot loop captures a typed previous-defense feedback object each iteration with bounded text fields.
- [x] #2 Planner payload includes defense feedback without breaking existing payload contracts.
- [x] #3 Session context/memory stores relevant feedback signals for downstream decisions and UI.
- [x] #4 Targeted tests cover feedback capture, payload composition, and null/edge-case behavior.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add a typed defense-feedback model in `apps/apparatus/src/ai/redteam.ts` for previous-iteration response signals (status/body/latency/signal code).
2. Capture bounded feedback from a post-action objective probe and thread it through the mission loop as prior decision context.
3. Inject the feedback object into planner payload composition while preserving existing payload fields.
4. Persist feedback-derived observations/progress signals so downstream pivot logic and UI can consume them.
5. Add/adjust targeted tests in `test/redteam.planner-payload.test.ts` and `test/redteam.memory-extraction.test.ts`, then run focused autopilot/redteam test commands.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented M1 backend slice in `apps/apparatus/src/ai/redteam.ts`: added `DefenseFeedback` model, objective probe capture, defense-signal classification, planner payload injection (`recentDefenseFeedback`), and session-memory persistence for defense signals.

Updated tests: `test/redteam.planner-payload.test.ts` now validates `recentDefenseFeedback` contract; `test/redteam.memory-extraction.test.ts` validates defense-signal observation/asset/relation persistence.

Verification: `pnpm --filter @apparatus/server test -- test/redteam.planner-payload.test.ts test/redteam.memory-extraction.test.ts test/redteam.decision.test.ts` ✅ (8 tests).

Verification: `pnpm --filter @apparatus/server test -- test/autopilot.memory-states.test.ts` ✅ (3 tests).

Verification: `pnpm --filter @apparatus/server exec tsc --noEmit` ✅.

Applied review-driven hardening: removed identifying probe header, parallelized defense probe with health check, added timeout-aware fallback classification, moved 5xx precedence ahead of latency, and limited probe body reads to 4KB before snippet truncation.

Added dedicated classifier coverage in `test/redteam.defense-signal.test.ts` (priority matrix and boundary cases) and added no-defense-feedback verification path test in `test/redteam.memory-extraction.test.ts`.

Audit artifacts generated: `.agents/reviews/review-20260222-185710.md`, `.agents/reviews/test-audit-20260222-185710.md`, `.agents/reviews/review-20260222-190019.md`, `.agents/reviews/test-audit-20260222-190019.md`, `.agents/reviews/review-20260222-190329.md`.

Addressed final specialist-review important finding by wrapping `readBodySnippet` stream consumption in `try/finally` to guarantee stream cleanup on mid-stream errors.

Post-fix verification rerun: `pnpm --filter @apparatus/server test -- test/redteam.defense-signal.test.ts test/redteam.planner-payload.test.ts test/redteam.memory-extraction.test.ts test/redteam.decision.test.ts test/autopilot.memory-states.test.ts` ✅ (20 tests), plus `pnpm --filter @apparatus/server exec tsc --noEmit` ✅.

Latest specialist review artifact: `.agents/reviews/review-20260222-190700.md` (important cleanup finding resolved in subsequent patch).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
M1 completed: Autopilot now captures structured previous-iteration defense feedback (status/body/latency/signal) and injects it into planner payload while persisting defense-signal memory for downstream decisioning/UI. Targeted redteam/autopilot tests and server type-check pass.

Follow-up hardening addressed major review findings around timeout classification robustness, probe fingerprinting, and bounded probe-body reads; added direct classifier tests to lock branch-priority behavior.
<!-- SECTION:FINAL_SUMMARY:END -->
