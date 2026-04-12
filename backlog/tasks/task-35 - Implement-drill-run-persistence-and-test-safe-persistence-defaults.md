---
id: TASK-35
title: Implement drill run persistence and test-safe persistence defaults
status: Done
assignee: []
created_date: '2026-02-23 02:22'
updated_date: '2026-02-23 02:22'
labels:
  - apparatus
  - backend
  - persistence
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Persist drill run history/latest pointers to disk and make persistence auto-disable in NODE_ENV=test unless explicit paths are provided, preventing cross-test state leakage.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Drill run state hydrates from disk and new runs flush state updates.
- [x] #2 In-flight drill statuses from persisted state are recovered safely on restart.
- [x] #3 Persistence paths auto-disable by default in test environment unless env vars explicitly set.
- [x] #4 Focused persistence tests cover drill hydrate, flush, and unwritable-path fallback.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added `cfg.drillRunsPath` and introduced `resolvePersistencePath` helper in config so persistence defaults are disabled during tests unless explicit env vars are set. Added `src/persistence/drill-runs.ts` with validated load/write behavior and graceful fallback. Updated `src/drills.ts` to hydrate persisted runs, recover live statuses to failed on restart, persist run creation/terminal transitions/score updates through a queued writer, and keep API behavior available when writes fail. Updated existing persistence modules to short-circuit when persistence path is empty.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Drill run persistence is now implemented with restart-safe recovery and queued disk flushes. Persistence defaults are now test-safe across scenario/webhook/deception/drill stores by auto-disabling paths under NODE_ENV=test unless explicitly configured. Compile and focused regression/persistence suites passed.
<!-- SECTION:FINAL_SUMMARY:END -->
