---
id: TASK-32.2
title: 'M2: Implement persona-driven deterministic tool weighting in planner decisions'
status: Done
assignee: []
created_date: '2026-02-23 01:45'
updated_date: '2026-02-23 01:52'
labels:
  - feature
  - ai
  - autopilot
  - redteam
milestone: m-13
dependencies:
  - TASK-32.1
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/src/ai/personas.ts
  - apps/apparatus/test/redteam.decision.test.ts
documentation:
  - apps/apparatus/docs/development/plans/AI-persona-profiles.md
parent_task_id: TASK-32
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Introduce persona bias weightings and deterministic weighted selection that influences tool choice while respecting allowed tool scope and existing safety guardrails.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Persona profiles define per-tool weights for supported autopilot tools.
- [x] #2 Planner applies persona bias deterministically (testable) after sanitization and before execution.
- [x] #3 Biasing never chooses tools outside allowed scope and degrades gracefully when preferred tools are unavailable.
- [x] #4 Backend tests validate distinct bias behavior across Script Kiddie, Researcher, and APT personas.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented deterministic persona weighting in `apps/apparatus/src/ai/redteam.ts` via `pickPersonaWeightedTool`, stable hash rolls, and `applyPersonaBias`.

Biasing is filtered by allowed tools and safety guardrails because tool selection is sanitized before execution and weighted picks only use `allowedTools`.

Coverage added in `apps/apparatus/test/redteam.persona.test.ts` validates deterministic differences between Script Kiddie and APT weighting tendencies.
<!-- SECTION:NOTES:END -->
