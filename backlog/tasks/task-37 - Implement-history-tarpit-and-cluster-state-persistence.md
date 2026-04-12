---
id: TASK-37
title: 'Implement history, tarpit, and cluster state persistence'
status: Done
assignee: []
created_date: '2026-02-23 02:50'
updated_date: '2026-02-23 02:53'
labels:
  - apparatus
  - backend
  - persistence
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Persist request history, tarpit trapped IP state, and cluster member state to disk with graceful in-memory fallback while preserving existing API handler signatures.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Request history hydrates from disk and flushes on add/clear operations.
- [x] #2 Tarpit trapped IP state hydrates from disk and flushes on trap/release/clear operations.
- [x] #3 Cluster member state hydrates from disk and flushes on membership updates.
- [x] #4 Persistence failures do not break existing APIs and focused tests cover hydrate, flush, and unwritable fallback.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added persistence config paths for request history, tarpit state, and cluster state. Implemented persistence modules `src/persistence/request-history.ts`, `src/persistence/tarpit-state.ts`, and `src/persistence/cluster-state.ts` with safe load/write behavior and graceful in-memory fallback. Updated `src/history.ts` to hydrate at module load and queue writes on add/clear. Updated `src/tarpit.ts` to hydrate trapped IP state at module load and queue writes on trap/release/clear flows (including middleware-triggered traps). Updated `src/cluster.ts` to hydrate peer members at module load and queue writes on beacon updates and stale-member pruning. Added `test/state-persistence.test.ts` covering hydrate, flush, and unwritable fallback for history/tarpit/cluster. Kept existing API handler signatures unchanged.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Request history, tarpit, and cluster member stores now persist to disk and recover across restarts, with graceful fallback to in-memory behavior when paths are missing/unwritable. Focused regressions plus all persistence suites and type-checks passed.
<!-- SECTION:FINAL_SUMMARY:END -->
