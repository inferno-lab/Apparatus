---
id: TASK-11.3
title: 'M3: Implement action-specific node configuration'
status: Done
assignee: []
created_date: '2026-02-22 02:42'
updated_date: '2026-02-22 05:02'
labels:
  - feature
  - apparatus-dashboard
  - scenarios
milestone: m-2
dependencies:
  - TASK-11.2
documentation:
  - apps/apparatus/docs/development/plans/drag-and-drop-scenario-builder.md
  - apps/apparatus/src/scenarios.ts
parent_task_id: TASK-11
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add dedicated parameter editing experiences per action type with safer defaults and validation so users can configure scenarios without raw JSON edits.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Selecting a node shows an action-specific parameter panel with editable fields.
- [x] #2 Node configuration enforces required fields and type constraints before save.
- [x] #3 JSON preview reflects parameter edits in real time.
- [x] #4 Autosave or guarded-save behavior prevents silent data loss and reports save failures to users.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented action-specific selected-node configuration UI for chaos.cpu, chaos.memory, cluster.attack, mtd.rotate, and delay in the scenario builder config panel.

Added node-level parameter validation and scenario-level parameter aggregation gates so invalid step config blocks save with explicit error messaging.

Added normalization + legacy migration hardening (chaos.memory mb->amount, mtd.rotate prefix trimming/clearing, fallback defaults) and shared parameter bounds constants used by both validator and UI controls.

Verification receipts: `pnpm --filter @apparatus/dashboard type-check`, `pnpm --filter @apparatus/server test -- scenario-builder-mapping.test.ts` (29 passing), `pnpm --filter @apparatus/dashboard build`.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
M3 delivered action-specific node configuration with validation-first save gating, real-time JSON preview coupling, and guarded unsaved-change handling. Shared bounds constants and expanded mapping/normalization tests now provide stronger guarantees around scenario payload correctness and legacy shape migration.
<!-- SECTION:FINAL_SUMMARY:END -->
