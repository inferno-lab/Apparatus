---
id: TASK-11
title: Deliver drag-and-drop scenario builder initiative
status: Done
assignee: []
created_date: '2026-02-22 02:42'
updated_date: '2026-02-22 05:07'
labels:
  - feature
  - apparatus-dashboard
  - scenarios
dependencies: []
documentation:
  - apps/apparatus/docs/development/plans/drag-and-drop-scenario-builder.md
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement a visual scenario authoring experience in the Apparatus dashboard that replaces JSON-first creation with a node-based builder while preserving compatibility with the existing Scenario backend schema and run endpoints.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Dashboard provides a visual builder flow for creating scenario steps without manual JSON editing.
- [x] #2 Generated visual scenarios save and run through existing /scenarios endpoints without backend contract changes.
- [x] #3 Implementation is delivered in milestone-gated phases M1 through M4 with explicit dependencies.
- [x] #4 User-visible docs or plan artifacts reflect delivered behavior and remaining milestones.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Kickoff complete: technical plan expanded, milestones/tasks created, and M1 implementation started in dashboard Scenario Console with ReactFlow canvas foundation.

Progress update: M1 completed and marked Done. M2 is now In Progress with initial graph-mapping test coverage added and passing.

Progress update: M2 completed and marked Done (ordering + validation + graph validation tests). Next milestone in queue is M3 node configuration panels.

Progress update: M3 completed and marked Done (action-specific node editors, validation gates, normalization hardening, expanded mapping tests). Remaining milestone: M4 execution graph monitoring + run-time visualization polish.

Final update: M4 completed and initiative closed. Scenario builder now supports end-to-end visual authoring, graph validation, action-specific configuration, and execution monitoring without backend contract changes.

Final verification receipts collected during M3/M4 closeout: dashboard type-check/build and scenario-builder mapping tests passing.
<!-- SECTION:NOTES:END -->
