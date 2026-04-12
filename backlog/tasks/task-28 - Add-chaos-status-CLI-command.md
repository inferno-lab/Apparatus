---
id: TASK-28
title: Add chaos status CLI command
status: Done
assignee: []
created_date: '2026-02-22 23:44'
updated_date: '2026-02-22 23:45'
labels:
  - cli
  - feature
  - chaos
  - gap-closure
dependencies: []
references:
  - 'apps/apparatus/src/app.ts:~400-410'
  - apps/cli/src/commands/chaos.ts
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a status command to the chaos command group to display all active chaos experiments. The server endpoint GET /chaos/status exists but has no CLI command.

This command should list:
- Currently active experiments
- Duration/remaining time
- Configuration details
- Impact metrics

Complements existing `apparatus chaos cpu|memory|crash` commands by providing visibility into active experiments.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Add `apparatus chaos status` command to chaos.ts
- [x] #2 Command displays all active chaos experiments
- [x] #3 Shows duration, configuration, and impact metrics
- [x] #4 Properly formats output (table or JSON)
- [x] #5 Handles no-experiments case gracefully
- [x] #6 Help text provided
- [x] #7 Integrates with existing chaos command structure
<!-- AC:END -->
