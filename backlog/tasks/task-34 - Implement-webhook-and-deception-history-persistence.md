---
id: TASK-34
title: Implement webhook and deception history persistence
status: Done
assignee: []
created_date: '2026-02-23 02:15'
updated_date: '2026-02-23 02:18'
labels:
  - apparatus
  - backend
  - persistence
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Persist webhook inspect buffers and deception history events to disk so these stores survive restarts, while preserving in-memory behavior when persistence is unavailable.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Webhook buffers hydrate from disk and flush on new webhook receives.
- [x] #2 Deception history hydrates from disk and flushes on new deception events and clear operations.
- [x] #3 Persistence read/write failures do not break API handlers and continue serving from memory.
- [x] #4 Focused tests cover hydrate, flush, and unwritable-path fallback for webhook and deception stores.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added file-backed persistence for webhook inspect buffers and deception history events with graceful in-memory fallback. Extended cfg with WEBHOOK_STORE_PATH and DECEPTION_HISTORY_PATH defaults. Added persistence modules `src/persistence/webhook-store.ts` and `src/persistence/deception-history.ts` for validated load/write flows. Updated `src/webhook.ts` to hydrate on first access, persist after receives through a queued writer, and keep serving on persist failures. Updated `src/deception.ts` to hydrate on first access, queue writes on recorded events, persist clear operations, and continue serving if writes fail.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Webhook and deception persistence phase completed. Both stores now hydrate from disk and flush updates while preserving in-memory availability when persistence paths are missing or unwritable. Focused tests and compile checks passed.
<!-- SECTION:FINAL_SUMMARY:END -->
