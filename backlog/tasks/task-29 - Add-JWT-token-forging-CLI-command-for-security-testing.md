---
id: TASK-29
title: Add JWT token forging CLI command for security testing
status: Done
assignee: []
created_date: '2026-02-22 23:44'
updated_date: '2026-02-22 23:46'
labels:
  - cli
  - feature
  - identity
  - auth-testing
  - gap-closure
dependencies: []
references:
  - 'apps/apparatus/src/app.ts:~390-395'
  - apps/cli/src/commands/identity.ts
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Expose the JWT token forging API endpoint (POST /auth/forge) through CLI. This allows testers to create malicious JWT tokens for vulnerability testing without needing to use curl or external tools.

Create `apparatus identity forge` command that accepts:
- Subject (sub) claim
- Audience (aud) claim
- Expiration time
- Custom claims
- Algorithm (default: HS256)

This endpoint is security-gated but important for authorized testing scenarios.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Add `apparatus identity forge` command to identity.ts
- [x] #2 Command accepts sub, aud, exp, and custom claims as options
- [x] #3 Generates valid JWT token output
- [x] #4 Supports different algorithms
- [x] #5 Displays decoded token for verification
- [x] #6 Help text with examples provided
- [x] #7 Security gating respected
<!-- AC:END -->
