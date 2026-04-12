---
id: TASK-13.3
title: 'M3: Defense telemetry and WAF action visibility'
status: To Do
assignee: []
created_date: '2026-02-22 06:49'
labels:
  - feature
  - apparatus
dependencies:
  - TASK-13.2
parent_task_id: TASK-13
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Integrate Active Shield and other defense signals into fuzzer results so operators can understand why requests were blocked or passed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Per-result records include defense action classification beyond status code heuristics when shield evidence exists.
- [ ] #2 Live UI surfaces defense outcomes (blocked/passed/errored) with clear operator-readable context.
- [ ] #3 Defense telemetry mapping handles missing or partial metadata without crashing.
- [ ] #4 Tests cover defense classification logic and representative blocked/pass scenarios.
- [ ] #5 Plan and docs capture telemetry data contract and known caveats.
<!-- AC:END -->
