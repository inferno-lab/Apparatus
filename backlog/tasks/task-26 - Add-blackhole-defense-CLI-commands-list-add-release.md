---
id: TASK-26
title: 'Add blackhole defense CLI commands (list, add, release)'
status: Done
assignee: []
created_date: '2026-02-22 23:44'
updated_date: '2026-02-22 23:45'
labels:
  - cli
  - feature
  - defense
  - gap-closure
dependencies: []
references:
  - 'apps/apparatus/src/app.ts:~380-390'
  - apps/cli/src/commands/defense.ts
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Expose the blackhole defense API endpoints through CLI commands. Blackhole is a hard-drop defense mechanism that prevents all traffic from specified IPs (higher priority than tarpit). Create three subcommands under `apparatus defense blackhole`:

- blackhole list - Show IPs in blackhole
- blackhole add <ip> - Add IP to blackhole (drop all traffic)
- blackhole release [ip] - Release specific IP or all IPs from blackhole

These endpoints exist at GET/POST /blackhole but have no CLI exposure.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Create blackhole subcommand group under defense command
- [x] #2 Command `apparatus defense blackhole list` shows all blocked IPs with timestamps
- [x] #3 Command `apparatus defense blackhole add <ip>` adds IP to blackhole
- [x] #4 Command `apparatus defense blackhole release [ip]` releases IPs
- [x] #5 All commands handle errors gracefully
- [x] #6 Help text with examples provided
- [x] #7 Backward compatible with existing defense commands
<!-- AC:END -->
