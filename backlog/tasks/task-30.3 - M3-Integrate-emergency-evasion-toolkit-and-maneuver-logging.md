---
id: TASK-30.3
title: 'M3: Integrate emergency evasion toolkit and maneuver logging'
status: Done
assignee: []
created_date: '2026-02-22 23:53'
updated_date: '2026-02-23 00:24'
labels:
  - feature
  - ai
  - autopilot
  - redteam
milestone: m-8
dependencies:
  - TASK-30.1
  - TASK-30.2
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/src/tool-executor.ts
  - apps/apparatus/test/redteam.memory-extraction.test.ts
  - apps/apparatus/test/autopilot.test.ts
parent_task_id: TASK-30
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Wire reactive evasion tools (starting with safe MTD rotation flow) into autopilot maneuver selection and produce explicit maneuver audit records for operators.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Emergency maneuver path supports safe `mtd.rotate` integration under block-classified conditions.
- [x] #2 Maneuver records capture trigger signal, chosen countermeasure, and expected rationale.
- [x] #3 Tool execution remains guardrail-compliant (no unintended crash/default-risk regressions).
- [x] #4 Tests validate maneuver logging shape and emergency-tool invocation boundaries.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
M3 complete: emergency maneuver path and maneuver audit metadata are integrated with guardrail-safe execution and test coverage for logging/invocation boundaries.

Integrated maneuver audit records into policy-driven decisions/actions/findings: trigger signal, chosen countermeasure, and rationale.

Extended `apps/apparatus/src/ai/report-store.ts` decision/action record types with optional `maneuver` metadata and threaded metadata from `apps/apparatus/src/ai/redteam.ts` execution path.

Strengthened tests: `apps/apparatus/test/autopilot.test.ts` now validates maneuver logging shape for rate-limit countermeasures; `apps/apparatus/test/redteam.evasion-policy.test.ts` validates maneuver metadata and pivot boundaries (rotate available vs disallowed fallback).
<!-- SECTION:NOTES:END -->
