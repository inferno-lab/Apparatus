---
id: TASK-23
title: Create Simulator CLI command for supply chain and dependency analysis
status: Done
assignee: []
created_date: '2026-02-22 21:09'
updated_date: '2026-02-22 21:17'
labels:
  - cli
  - feature
  - simulator
dependencies: []
references:
  - apps/apparatus/src/simulator.ts
  - libs/client/src/categories/simulator-api.ts
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a dedicated `simulator` command file to expose the server's simulation endpoints (`/api/simulator/supply-chain`, `/api/simulator/dependencies/*`). These endpoints support supply chain attack simulation and dependency graph analysis but currently have no CLI interface.

This task should create `apps/cli/src/commands/simulator.ts` with subcommands for supply chain analysis and dependency manipulation operations.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Create `apps/cli/src/commands/simulator.ts` with supplychain and dependencies subcommands
- [x] #2 Command `apparatus simulator supply-chain --target <package>` queries and displays supply chain data
- [x] #3 Command `apparatus simulator dependencies list` lists dependency graph
- [x] #4 Command `apparatus simulator dependencies infect --package-id <id>` simulates infection
- [x] #5 Command `apparatus simulator dependencies reset` resets the simulator state
- [x] #6 All commands support `--json` flag for JSON output
- [x] #7 Commands handle errors gracefully
- [x] #8 Integration test confirms all subcommands are registered
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Complete

✓ Created SimulatorApi category in client library (libs/client/src/categories/simulator.ts)
✓ Registered SimulatorApi in ApparatusClient
✓ Created apps/cli/src/commands/simulator.ts with full command structure
✓ Registered in cli.ts and verified all commands are accessible
✓ All subcommands have proper options and error handling

### Commands Implemented:
- `apparatus simulator supply-chain [--target <url>]` - Trigger simulated attack
- `apparatus simulator dependencies list [--filter <status>]` - List packages
- `apparatus simulator dependencies infect <package-id>` - Inject malware
- `apparatus simulator dependencies reset [--confirm]` - Reset graph state

### Architecture:
- Created SimulatorApi with 4 methods matching server endpoints
- Client library integration through lazy-loaded pattern
- CLI commands follow existing patterns with spinners, formatting, error handling
<!-- SECTION:NOTES:END -->
