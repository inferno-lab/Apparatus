---
id: TASK-32
title: AI persona profiles initiative (autopilot sophistication levels)
status: Done
assignee: []
created_date: '2026-02-23 01:45'
updated_date: '2026-02-23 01:52'
labels:
  - feature
  - ai
  - autopilot
  - redteam
milestone: m-11
dependencies: []
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/src/ai/personas.ts
  - apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.tsx
  - apps/apparatus/src/dashboard/hooks/useAutopilot.ts
documentation:
  - apps/apparatus/docs/development/plans/AI-persona-profiles.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement selectable autopilot personas that materially change planner behavior and operator visibility: Script Kiddie (loud/noisy), Researcher (methodical/low impact), and APT (stealth/evasive).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A milestone-backed task graph exists for M1–M4 with explicit dependencies and file references.
- [x] #2 Autopilot start/config contracts support persona selection and publish supported personas.
- [x] #3 Planner behavior changes by persona via prompt guidance and deterministic tool-bias weighting.
- [x] #4 Dashboard Mission Control allows persona selection and displays persona behavior tags.
- [x] #5 Focused backend + dashboard tests validate persona plumbing and behavior differences before closure.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Execute TASK-32.1 (M1) to add persona registry, start/config contract fields, and prompt directive wiring.
2. Execute TASK-32.2 (M2) to introduce deterministic persona bias weighting in planner decisions.
3. Execute TASK-32.3 (M3) to add Mission Control persona selector + behavior tags and payload propagation.
4. Execute TASK-32.4 (M4) to run focused validation, reviews, and finalize residual-risk evidence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Expanded `apps/apparatus/docs/development/plans/AI-persona-profiles.md` into a full implementation blueprint with scope, workstreams, milestones, verification gates, and risk controls.

Completed M1-M3 implementation:
- Persona registry + start/config/session contract wiring
- Persona-directed planner prompt composition
- Deterministic persona tool weighting with allowed-tool safety
- Mission Control persona selector + behavior tags + payload propagation

Validation evidence:
- `pnpm --filter @apparatus/server test -- test/autopilot.test.ts test/redteam.planner-payload.test.ts test/redteam.persona.test.ts src/dashboard/components/dashboard/AutopilotConsole.component.test.tsx`
- `pnpm --filter @apparatus/server exec tsc --noEmit`
- `pnpm --dir apps/apparatus/src/dashboard exec tsc --noEmit`

Review tooling availability constraint documented in TASK-32.4 (scripts absent in repo).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
AI persona profiles initiative is implemented end-to-end for Script Kiddie, Researcher, and APT profiles. Autopilot now accepts/persists persona selection, publishes persona metadata via config, injects persona directives into planner prompts, applies deterministic persona-weighted tool biasing under existing guardrails, and exposes selector/tag UX in Mission Control. Focused backend + dashboard tests and type-checks pass; review-script availability constraint is documented.
<!-- SECTION:FINAL_SUMMARY:END -->
