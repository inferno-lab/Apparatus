---
id: TASK-11.2
title: 'M2: Add edge ordering and visual validation'
status: Done
assignee: []
created_date: '2026-02-22 02:42'
updated_date: '2026-02-22 04:20'
labels:
  - feature
  - apparatus-dashboard
  - scenarios
milestone: m-1
dependencies:
  - TASK-11.1
documentation:
  - apps/apparatus/docs/development/plans/drag-and-drop-scenario-builder.md
parent_task_id: TASK-11
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement explicit connection logic and deterministic sequential ordering rules so graph structure reliably maps to step execution order with actionable validation feedback.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Users can connect nodes with edges to represent execution order.
- [x] #2 Graph-to-scenario mapping uses deterministic ordering and surfaces validation errors for ambiguous/invalid flows.
- [x] #3 Invalid graph states are highlighted in the UI and block save with clear messages.
- [x] #4 Round-trip mapping tests cover graph->scenario and scenario->graph behavior for sequential flows.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Started M2 with deterministic mapping tests in `apps/apparatus/test/scenario-builder-mapping.test.ts` covering edge-driven ordering, position fallback ordering, disconnected-node determinism, and scenario->graph sequential edge generation.

Current implementation already serializes step order using edge topology with deterministic fallback in `graphToScenarioPayload`; remaining M2 work focuses on explicit in-UI validation/error signaling for ambiguous graph states and save blocking semantics.

Post-refactor scoped review against commit diff (`df58de3`) recorded in `.agents/reviews/review-20260221-225432.md`: Critical=None, Important=None, verdict `APPROVE WITH CHANGES`.

Implemented `validateScenarioGraph` in `scenarioBuilder.ts` to enforce sequential constraints: single start, fan-in/fan-out guards, cycle detection, disconnected graph detection, and invalid-edge reference detection.

Wired graph validation into `ScenarioConsole` so save is blocked when flow validation fails and errors are surfaced in Config panel; canvas now highlights invalid flow state with ring + alert text and `aria-invalid`/`aria-errormessage`.

Expanded mapping/validation tests in `apps/apparatus/test/scenario-builder-mapping.test.ts` to 13 cases including positive chain, branching/fan-in, disconnected graph, cycles, invalid-edge references, self-loop, single-node, and empty-graph handling.

Post-commit review receipt for validation commit: `.agents/reviews/review-20260221-231923.md` with Critical=None and Important=None (verdict: APPROVE WITH CHANGES minor-only).

Verification receipts after final validation changes: `pnpm --filter @apparatus/dashboard type-check`, `pnpm --filter @apparatus/server test -- scenario-builder-mapping.test.ts`, `pnpm --filter @apparatus/dashboard build` all passing.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
M2 ordering and validation is complete. Edge connections now drive deterministic step serialization with robust graph validation rules, invalid graph states are visibly highlighted and save-blocked, and dedicated unit coverage verifies both graph-to-scenario ordering and validation behavior across valid and invalid topologies.
<!-- SECTION:FINAL_SUMMARY:END -->
