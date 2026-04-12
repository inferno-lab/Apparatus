---
id: TASK-5
title: Close P0/P1 cluster test gaps from test-review audit
status: To Do
assignee: []
created_date: '2026-02-19 05:51'
labels:
  - security
  - testing
  - cluster
dependencies: []
references:
  - .agents/reviews/test-audit-20260219-004838.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
`test-review-request` flagged critical/important missing coverage around no-secret authorization paths and validation boundaries in `cluster.ts`. Add focused tests (and small refactors if needed) to cover the highest-risk cases.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 No-secret mode is tested for loopback-bind accept behavior and non-loopback-bind reject behavior.
- [ ] #2 Validation tests cover non-http(s) protocol rejection, malformed/public IP target rejection, and future timestamp rejection.
- [ ] #3 Rate validation tests cover clamping/truncation and invalid values (0, negative, NaN, Infinity).
<!-- AC:END -->
