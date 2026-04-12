---
id: TASK-33
title: Implement scenario catalog persistence layer
status: Done
assignee: []
created_date: '2026-02-23 02:02'
updated_date: '2026-02-23 02:07'
labels:
  - apparatus
  - backend
  - persistence
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a file-backed persistence adapter for scenario definitions so scenario catalog survives process restarts. Keep runtime run-state in memory for now.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Scenario definitions hydrate from disk at startup when data file exists.
- [x] #2 Scenario create/update/delete operations flush catalog to disk.
- [x] #3 Persistence errors degrade gracefully to in-memory behavior without crashing handlers.
- [x] #4 Focused tests cover hydrate success, flush success, and write failure fallback.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented file-backed scenario catalog persistence for scenario definitions only. Added cfg.scenarioCatalogPath env binding (`SCENARIO_CATALOG_PATH`, default `data/scenarios.json`). Added `src/persistence/scenario-catalog.ts` with validated load/write helpers and graceful fallback to in-memory behavior on read/write errors. Updated `src/scenarios.ts` to hydrate catalog on first handler access, sanitize/normalize hydrated scenarios, and queue persistence writes on save operations while preserving run-state maps in memory. Added `test/scenario-persistence.test.ts` for hydrate, flush, and unwritable-path fallback behavior.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Scenario catalog persistence layer implemented and verified. Scenario definitions now survive restarts via JSON catalog file, and write/read failures degrade safely to in-memory mode without breaking scenario APIs. Focused regression tests passed for existing scenario engine tests and new persistence behaviors.
<!-- SECTION:FINAL_SUMMARY:END -->
