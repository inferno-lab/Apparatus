---
id: TASK-32.1
title: 'M1: Wire persona registry into autopilot contracts and planner prompt context'
status: Done
assignee: []
created_date: '2026-02-23 01:45'
updated_date: '2026-02-23 01:52'
labels:
  - feature
  - ai
  - autopilot
  - redteam
milestone: m-12
dependencies: []
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/src/ai/personas.ts
  - apps/apparatus/test/autopilot.test.ts
  - apps/apparatus/test/redteam.planner-payload.test.ts
documentation:
  - apps/apparatus/docs/development/plans/AI-persona-profiles.md
parent_task_id: TASK-32
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Define supported personas, parse persona from autopilot start payload, persist persona on session control, and include persona prompt guidance in planner system prompt construction.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Supported persona definitions exist in a dedicated AI persona registry with behavior tags and prompt directives.
- [x] #2 `/api/redteam/autopilot/start` accepts an optional persona and defaults safely when missing/invalid.
- [x] #3 `/api/redteam/autopilot/config` returns supported persona metadata and default persona.
- [x] #4 Planner system prompt includes persona-specific directives while preserving existing JSON/allowed-tools constraints.
- [x] #5 Contract tests cover start/config persona fields and prompt persona injection behavior.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Replace/expand `apps/apparatus/src/ai/personas.ts` to define autopilot personas (id, label, tags, prompt directives, tool weights).
2. Update `apps/apparatus/src/ai/redteam.ts` contracts to parse and carry persona through session control and autopilot config/start handlers.
3. Build system prompt from base instructions + persona directives while preserving strict JSON output/allowed tools constraints.
4. Add/adjust tests in `apps/apparatus/test/autopilot.test.ts` and `apps/apparatus/test/redteam.planner-payload.test.ts` for persona config/start/prompt coverage.
5. Run focused test slice for M1 and capture receipts in task notes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented persona registry + contract wiring across `apps/apparatus/src/ai/personas.ts`, `apps/apparatus/src/ai/redteam.ts`, and `apps/apparatus/src/ai/report-store.ts`.

Added persona parsing/default fallback, persona metadata in `/api/redteam/autopilot/config`, persona persistence on sessions, and persona directives in planner system prompt.

Added targeted coverage in `apps/apparatus/test/autopilot.test.ts`, `apps/apparatus/test/redteam.planner-payload.test.ts`, and `apps/apparatus/test/redteam.persona.test.ts`.
<!-- SECTION:NOTES:END -->
