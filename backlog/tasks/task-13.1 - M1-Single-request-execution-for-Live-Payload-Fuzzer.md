---
id: TASK-13.1
title: 'M1: Single-request execution for Live Payload Fuzzer'
status: Done
assignee:
  - '@codex'
created_date: '2026-02-22 06:49'
updated_date: '2026-02-22 07:43'
labels:
  - feature
  - apparatus
dependencies: []
parent_task_id: TASK-13
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the first working slice of the Fuzzing Lab: request builder inputs execute one request and return a normalized response view suitable for dashboard rendering.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A backend endpoint accepts one fuzzer request payload (target, method, path, headers, body) and executes it with input validation.
- [x] #2 Response includes normalized execution metadata (resolved URL, duration, status code, blocked classification, and bounded response preview).
- [x] #3 Dashboard can invoke the endpoint for a single run and show request/response output for operator inspection.
- [x] #4 Automated tests cover request validation and success-path response shape for this endpoint.
- [x] #5 Development plan documentation is updated to reflect M1 API and UX behavior.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented M1 backend slice: added POST /api/redteam/fuzzer/run with validation, timeout clamping, bounded body/preview sizes, host allowlist enforcement, and normalized error responses.

Hardened existing /redteam/validate path by applying securityGate and shared target/path/method validation constraints.

Added changelog and plan documentation updates including explicit Breaking Changes note for validate endpoint host restriction/security gate.

Expanded integration tests in apps/apparatus/test/advanced.defense.test.ts to 21 Red Team assertions covering validation failures, SSRF edge cases, env allowlist behavior, upstream failure normalization, and large-response truncation behavior.

Verification executed: pnpm --filter @apparatus/server exec tsc --noEmit; pnpm --filter @apparatus/server test -- test/advanced.defense.test.ts.

Audit artifacts: .agents/reviews/review-20260222-021512.md (latest successful specialist review) and .agents/reviews/test-audit-20260222-021050.md (latest test-gap audit).

Addressed final specialist-review follow-ups: preserved upstream status when preview capture fails, added env-allowlist integration test path, added timeout clamping coverage, and added string-body passthrough coverage.

Latest verification rerun: pnpm --filter @apparatus/server exec tsc --noEmit; pnpm --filter @apparatus/server test -- test/advanced.defense.test.ts (23 tests passed).

Latest specialist-review artifact: .agents/reviews/review-20260222-022516.md (Approve with minor follow-ups).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed M1 single-request execution slice for Live Payload Fuzzer end-to-end.

Delivered:
- Backend endpoint `POST /api/redteam/fuzzer/run` with validation, timeout normalization, host restrictions, body/preview guardrails, and normalized response/error contract.
- Route wiring + security hardening for `/redteam/validate` (securityGate + target/path/method validation).
- Updated plan doc to implementation-grade spec and added changelog breaking-change notes.
- Dashboard integration in `TestingLab` with live request builder + execution/results panel.
- New dashboard hook `useRedTeamFuzzer` for API interaction.
- Expanded integration tests (`advanced.defense.test.ts`) to 23 passing tests covering validation, SSRF edge cases, env allowlist behavior, timeout bounds, upstream error handling, truncation behavior, and validate route restrictions.

Verification:
- `pnpm --filter @apparatus/server exec tsc --noEmit` passed.
- `pnpm --filter @apparatus/server test -- test/advanced.defense.test.ts` passed (23/23).
- `pnpm --filter @apparatus/dashboard build` currently fails on pre-existing unrelated TypeScript issue in `components/layout/Sidebar.tsx` (`import.meta.env` typing), unchanged by this task.

Review artifacts:
- Backend specialist reviews: `.agents/reviews/review-20260222-022516.md`, `.agents/reviews/review-20260222-021512.md`.
- Frontend specialist review: `.agents/reviews/review-20260222-024117.md`.
- Test audits: `.agents/reviews/test-audit-20260222-021050.md`, `.agents/reviews/test-audit-20260222-024157.md`.
<!-- SECTION:FINAL_SUMMARY:END -->
