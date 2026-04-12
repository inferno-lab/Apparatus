---
id: TASK-11.1
title: 'M1: Build visual scenario canvas foundation'
status: Done
assignee: []
created_date: '2026-02-22 02:42'
updated_date: '2026-02-22 03:53'
labels:
  - feature
  - apparatus-dashboard
  - scenarios
milestone: m-0
dependencies: []
documentation:
  - apps/apparatus/docs/development/plans/drag-and-drop-scenario-builder.md
  - apps/apparatus/src/dashboard/components/dashboard/ScenarioConsole.tsx
  - apps/apparatus/src/dashboard/hooks/useScenarios.ts
parent_task_id: TASK-11
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Establish the first shippable version of the scenario builder with a canvas-first authoring surface, draggable tool blocks, and live JSON preview tied to the existing save flow.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Dashboard scenario console includes a visual builder canvas and palette for adding supported tool blocks.
- [x] #2 Users can add at least chaos.cpu, chaos.memory, cluster.attack, mtd.rotate, and delay blocks with default params.
- [x] #3 Builder state maps to valid Scenario JSON and is displayed in a live preview panel.
- [x] #4 Save action persists builder-produced scenarios through existing useScenarios.saveScenario flow.
- [x] #5 Dashboard type-check/build passes for modified dashboard files.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Started implementation on 2026-02-22: replaced JSON-first ScenarioConsole experience with React Flow canvas shell, drag-from-palette tool blocks, and live JSON preview generated from node graph.

Added dashboard dependency on reactflow and introduced scenario builder helper module for action blueprints and graph<->scenario mapping.

Verification run: `pnpm --filter @apparatus/dashboard type-check` and `pnpm --filter @apparatus/dashboard build` both passed.

Implemented canvas-first Scenario Console with ReactFlow, draggable palette blocks, keyboard-add fallback, live JSON preview, unsaved-change guard, and save/run integration against existing scenarios hook.

Added graph ordering that uses edge topology with deterministic position fallback so connected flow affects serialized step order.

Addressed review-driven hardening: validated dropped action values, associated form labels, keyboard focus/activation for saved-scenario list rows, and alert semantics on success/error messaging.

Latest scoped review artifact: `.agents/reviews/review-20260221-220119.md` (no critical findings; remaining important items are structural decomposition and deeper keyboard affordances for full canvas manipulation).

Verification receipts: `pnpm --filter @apparatus/dashboard type-check` and `pnpm --filter @apparatus/dashboard build` pass after final changes.

Completed decomposition pass: split ScenarioConsole UI into ScenarioBuilderPalette, ScenarioBuilderCanvas, and ScenarioBuilderConfigPanel while keeping orchestration state in ScenarioConsole.

Added scenario snapshot + edge signature helpers in scenarioBuilder module and reused them for dirty-state tracking to reduce duplicated state-reset logic.

Added deletion discoverability hint in canvas footer and retained keyboard-accessible palette/list interactions.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
M1 canvas foundation is complete. Scenario authoring now uses a ReactFlow canvas with draggable/keyboard-add palette blocks, side-by-side JSON preview, and save/run integration. The implementation includes unsaved-change guarding, deterministic graph-to-payload mapping, and accessibility-focused controls for palette/list interactions. Verification passed via dashboard type-check/build and targeted scenario builder mapping tests.
<!-- SECTION:FINAL_SUMMARY:END -->
