---
id: TASK-27
title: 'Add ghost traffic CLI commands (list, create, delete, start, stop)'
status: Done
assignee: []
created_date: '2026-02-22 23:44'
updated_date: '2026-02-22 23:46'
labels:
  - cli
  - feature
  - traffic
  - deception
  - gap-closure
dependencies: []
references:
  - 'apps/apparatus/src/app.ts:~440-460'
  - apps/cli/src/commands/traffic.ts
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Expose the virtual ghost (traffic mimicry) API endpoints through CLI. Ghosts simulate realistic traffic and test detection systems. Create `apparatus traffic ghosts` command group with five subcommands:

- ghosts list - Show active ghost instances
- ghosts create [options] - Create new ghost instance
- ghosts delete <id> - Delete ghost instance
- ghosts start [id] - Start ghost traffic generation
- ghosts stop [id] - Stop ghost traffic generation

These endpoints exist at GET/POST/DELETE /ghosts but have no CLI exposure.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Create ghosts subcommand group under traffic command
- [x] #2 Command `apparatus traffic ghosts list` shows all ghost instances with status
- [x] #3 Command `apparatus traffic ghosts create` can create new ghost with options
- [x] #4 Command `apparatus traffic ghosts delete <id>` removes ghost
- [x] #5 Command `apparatus traffic ghosts start [id]` starts traffic generation
- [x] #6 Command `apparatus traffic ghosts stop [id]` stops traffic generation
- [x] #7 All commands support --json output
- [x] #8 Help text with examples provided
<!-- AC:END -->
