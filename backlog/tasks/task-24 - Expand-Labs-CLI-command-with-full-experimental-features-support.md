---
id: TASK-24
title: Expand Labs CLI command with full experimental features support
status: Done
assignee: []
created_date: '2026-02-22 21:09'
updated_date: '2026-02-22 21:19'
labels:
  - cli
  - feature
  - labs
dependencies: []
references:
  - apps/cli/src/commands/labs.ts
  - libs/client/src/categories/labs-api.ts
  - apps/apparatus/src/labs.ts
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Labs command exists but has partial coverage of experimental features. This task expands `apps/cli/src/commands/labs.ts` to fully expose all lab endpoints including container escape detection, cloud credential spoofing, and advanced infrastructure probes.

The expansion should add new subcommands for escape artist, cloud imposter, and infrastructure analysis while maintaining backward compatibility with existing lab commands.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Add `apparatus labs escape scan --payload <type>` command for container escape detection
- [x] #2 Add `apparatus labs imposter aws` and `apparatus labs imposter gcp` commands for credential spoofing
- [x] #3 Add `apparatus labs infra status` command for infrastructure probing
- [x] #4 Add `apparatus labs infra imposter` command for infrastructure spoofing
- [x] #5 All new commands support `--json` flag for JSON output
- [x] #6 All commands integrate with existing labs command structure
- [x] #7 Help text and examples are provided for each new subcommand
- [x] #8 Backward compatibility with existing lab commands is maintained
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Complete

✓ Added `apparatus labs escape scan --payload <type>` command for container escape detection
✓ Added `apparatus labs imposter aws|gcp` subcommands for credential spoofing
✓ Added `apparatus labs infra status [--port|--protocol]` command for infrastructure probing
✓ Added `apparatus labs infra imposter` command for infrastructure imposter status
✓ Added `apparatus labs infra sidecar` command for sidecar infrastructure status
✓ All new commands support --json output (via CLI framework)
✓ All commands properly integrated with existing labs structure
✓ Help text and examples provided for each subcommand
✓ Backward compatibility maintained - all existing commands still functional

### New Command Groups:
- `apparatus labs infra` - Infrastructure status/checking (status, imposter, sidecar)
- `apparatus labs imposter` - Cloud credential simulation (aws, gcp)
- `apparatus labs escape` - Container escape testing (scan)

### Backward Compatibility:
- Old commands preserved: escape-scan, imposter-creds, imposter-status, sidecar-status, sidecar-inject, etc.
- New commands are additive, not replacements
- Existing users can continue using old command names
<!-- SECTION:NOTES:END -->
