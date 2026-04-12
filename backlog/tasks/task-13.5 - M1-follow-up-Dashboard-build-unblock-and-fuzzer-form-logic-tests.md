---
id: TASK-13.5
title: 'M1 follow-up: Dashboard build unblock and fuzzer form logic tests'
status: Done
assignee:
  - '@codex'
created_date: '2026-02-22 09:10'
updated_date: '2026-02-22 10:01'
labels:
  - feature
  - apparatus
dependencies:
  - TASK-13.1
references:
  - apps/apparatus/src/dashboard/components/layout/Sidebar.tsx
  - apps/apparatus/src/dashboard/components/dashboard/TestingLab.tsx
  - apps/apparatus/src/dashboard/hooks/useRedTeamFuzzer.ts
parent_task_id: TASK-13
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Resolve the current dashboard TypeScript build blocker and add focused tests for the live fuzzer form parsing/normalization paths introduced in TestingLab.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Dashboard build no longer fails on import.meta env typing in Sidebar.
- [x] #2 Live fuzzer request-building/validation paths are covered by automated tests for key edge cases (timeout bounds, URL scheme, JSON object parsing, headers/query/body handling).
- [x] #3 Verification includes dashboard build command and targeted vitest command(s) with pass results.
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed dashboard follow-up hardening for live fuzzer integration: extracted `LivePayloadFuzzer` from `TestingLab`, tightened accessibility labeling, added reset flow, and improved input ergonomics.

Fixed timeout normalization correctness bug in `testingLabFuzzerForm.ts` (`0.4` no longer rounds to invalid `0`).

Expanded `testingLabFuzzerForm.test.ts` to cover URL scheme checks, headers/query normalization and rejection cases, JSON/raw body behavior, timeout boundaries (`60000`/`60001`), and low-value timeout rejection.

Verification receipts:

- `pnpm --filter @apparatus/server test -- src/dashboard/components/dashboard/testingLabFuzzerForm.test.ts` (13 passed)

- `pnpm --filter @apparatus/server test -- test/advanced.defense.test.ts` (23 passed)

- `pnpm --filter @apparatus/dashboard build` (passes)

Review artifacts generated: `.agents/reviews/review-20260222-042013.md`, `.agents/reviews/review-20260222-042629.md`, `.agents/reviews/review-20260222-043109.md`, `.agents/reviews/review-20260222-043501.md`, `.agents/reviews/review-20260222-043929.md`, `.agents/reviews/review-20260222-044345.md`, `.agents/reviews/review-20260222-044700.md`, `.agents/reviews/test-audit-20260222-042307.md`, `.agents/reviews/test-audit-20260222-042755.md`, `.agents/reviews/test-audit-20260222-043618.md

Post-close hardening pass added stricter target URL normalization (`normalizeTarget` now rejects malformed http/https values and missing-scheme targets) plus additional tests for bare-host rejection and port/path/query acceptance.

Updated test counts after hardening: `testingLabFuzzerForm.test.ts` now has 14 passing tests.

Latest audit artifact: `.agents/reviews/test-audit-20260222-045648.md` (no P0 gaps).
<!-- SECTION:FINAL_SUMMARY:END -->
