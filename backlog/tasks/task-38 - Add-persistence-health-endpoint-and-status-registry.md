---
id: TASK-38
title: Add persistence health endpoint and status registry
status: Done
assignee: []
created_date: '2026-02-23 03:05'
updated_date: '2026-02-23 03:05'
labels:
  - apparatus
  - backend
  - persistence
  - observability
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Expose `/admin/persistence/health` with per-store persistence status (enabled/hydrated/last write result) backed by a shared registry that store modules update.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Shared persistence status registry tracks store registration, hydration, and write outcomes.
- [x] #2 Endpoint `/admin/persistence/health` returns summary and per-store status.
- [x] #3 Admin endpoint bypasses deception honeypot routing so health data remains reachable.
- [x] #4 Focused tests cover endpoint shape, enabled/hydrated reporting, and degraded write status.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added shared registry `src/persistence/status.ts` and wired all persisted stores (scenario, webhook, deception, drill runs, request history, tarpit state, cluster state) to register path-enabled status, hydration completion, and write outcomes. Added `/admin/persistence/health` endpoint in `src/app.ts` behind `securityGate`. Added deception bypass prefix for `/admin/persistence/*` so honeypot route interception does not shadow admin persistence health responses. Added focused tests in `test/persistence-health.test.ts` and updated persistence tests for async write timing resilience where needed.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Persistence observability is now exposed via `/admin/persistence/health` with store-level status and summary counts. Endpoint is reachable under existing security controls and verified through focused tests, with full persistence/regression suites passing.
<!-- SECTION:FINAL_SUMMARY:END -->
