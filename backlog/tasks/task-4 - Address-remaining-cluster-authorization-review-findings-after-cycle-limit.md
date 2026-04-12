---
id: TASK-4
title: Address remaining cluster authorization review findings after cycle limit
status: Done
assignee: []
created_date: '2026-02-19 05:48'
updated_date: '2026-02-19 18:05'
labels:
  - security
  - testing
  - breach-protocol
dependencies: []
references:
  - .agents/reviews/review-20260219-004444.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Post-review follow-up from agent-loops circuit breaker: differentiate validation vs. network failures in `clusterAttackHandler`, and add missing boundary tests flagged as IMPORTANT in specialist review.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 `clusterAttackHandler` returns 400 for validation errors and 5xx for broadcast/network failures.
- [x] #2 Cluster tests verify attack rate clamping/truncation behavior in `validateAttackCommand`.
- [x] #3 Cluster tests verify no-secret + non-loopback bind rejects unsigned gossip commands.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Started implementation for TASK-4: split cluster attack handler validation vs network error statuses and add missing rate clamp/truncation tests.

Implemented typed validation errors in cluster attack validation path and split `clusterAttackHandler` responses: validation -> 400, broadcast/network failures -> 500.

Added tests for: handler 500 on broadcast failure, rate clamp to 2000, rate truncation for fractional values, and unsigned command rejection when no secret + non-loopback bind.

Added security-boundary comments on cluster handlers (mounted behind `securityGate` in app.ts) and elevated startup logging to `error` when host is non-loopback and shared secret is unset.

Verification: `pnpm --filter @apparatus/server test -- test/cluster.test.ts` and `pnpm --filter @apparatus/server exec tsc --noEmit` passed.
<!-- SECTION:NOTES:END -->
