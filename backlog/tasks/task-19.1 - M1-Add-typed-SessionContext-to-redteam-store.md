---
id: TASK-19.1
title: 'M1: Add typed SessionContext to redteam store'
status: Done
assignee: []
created_date: '2026-02-22 19:43'
updated_date: '2026-02-22 19:46'
labels:
  - feature
  - ai
  - autopilot
  - redteam
  - backend
milestone: m-4
dependencies: []
references:
  - apps/apparatus/src/ai/report-store.ts
documentation:
  - apps/apparatus/docs/development/plans/AI-kill-chain-memory.md
parent_task_id: TASK-19
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Introduce persistent, bounded session memory structures to capture assets, observations, and relations per autopilot session.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 `RedTeamSession` includes a typed `sessionContext` structure for memory entities and relations.
- [x] #2 Store helpers support deterministic upsert/dedupe and bounded pruning for memory entries.
- [x] #3 Existing session creation/status APIs remain backward compatible for current consumers.
- [x] #4 Unit tests cover initialization, dedupe behavior, and pruning limits.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add `SessionContext` domain types to `report-store.ts` (assets, observations, relations, objective progress).
2. Extend `RedTeamSession` and `createSession` defaults with bounded empty context.
3. Add deterministic upsert helpers for assets/relations and bounded append for observations.
4. Export pure helper utilities for dedupe/pruning tests.
5. Add targeted unit tests for initialization, dedupe, and pruning behavior.
6. Run focused test command(s) and attach results in notes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented session-memory domain model and helpers in `apps/apparatus/src/ai/report-store.ts`: `SessionContext` types, bounded limits, and upsert utilities for assets/observations/relations plus objective-progress signals.

Added unit tests in `apps/apparatus/test/report-store.memory.test.ts` covering context initialization, deterministic dedupe, and pruning bounds.

Verification: `pnpm --filter @apparatus/server test -- test/report-store.memory.test.ts test/redteam.decision.test.ts` (passed: 2 files, 6 tests).

Type-check verification: `pnpm --filter @apparatus/server exec tsc --noEmit` (passed).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed M1 by introducing typed `sessionContext` storage to RedTeam sessions, deterministic upsert/dedupe behavior for assets/relations/observations, bounded pruning guards, and objective-progress signal tracking. Added focused tests to validate initialization, dedupe semantics, and limit enforcement; all targeted backend tests pass.
<!-- SECTION:FINAL_SUMMARY:END -->
