---
id: TASK-3
title: Implement Breach Protocol M2 scenarios and richer predicates
status: Done
assignee:
  - codex
created_date: '2026-02-19 04:45'
updated_date: '2026-02-19 04:52'
labels:
  - feature
  - apparatus
  - drill
  - m2
dependencies: []
references:
  - apps/apparatus/src/drills.ts
  - apps/apparatus/src/cluster.ts
  - apps/apparatus/src/ghosting.ts
  - apps/apparatus/docs/plans/breach-protocol-drill.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Extend the drill engine with two additional built-in scenarios (traffic spike and SQLi exfil), richer win/fail predicates, and expanded hint ladders. Ensure lifecycle cleanup and test coverage are updated for M2 behavior.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Drill catalog includes CPU, traffic spike, and SQLi scenarios with difficulty metadata and hint ladders
- [x] #2 Engine supports additional condition primitives needed for M2 scenario logic (including SQLi effectiveness)
- [x] #3 Engine supports additional stressor primitives needed for M2 scenarios and executes cleanup for active stressors
- [x] #4 Traffic spike and SQLi scenarios can be started and reach expected non-error lifecycle behavior (active/cancel/debrief)
- [x] #5 Automated tests cover M2 scenario presence and at least one richer condition/stressor lifecycle path
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1) Extend backend primitives: add cluster attack activity introspection and ghost traffic control exports for drill orchestration and cleanup.
2) Expand `src/drills.ts` to support new stressor kinds (`ghost.start`, `ghost.stop`, `seed.sqli`) and new condition kind (`blocked_sqli_ratio`), including per-run SQLi attempt/block accounting.
3) Add two built-in scenarios: `drill-ddos-sr` and `drill-sqli-principal`, each with richer win/fail conditions and hint ladders.
4) Update terminal cleanup to stop ghost traffic and any active SQLi seed loops in addition to existing experiment cleanup.
5) Update and expand tests in `apps/apparatus/test/drills.test.ts` to verify scenario catalog contents and M2 lifecycle behavior for traffic + SQLi runs (including cancel/debrief path).
6) Run targeted tests and type-checks, then attempt specialist review per agent-loops and remediate P0/P1 findings if any.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
User approved proceeding with M2 via message: "yes".

Extended core primitives for M2 orchestration: exported cluster attack state via `isClusterAttackActive()` in `apps/apparatus/src/cluster.ts`, and extracted reusable ghost controls (`startGhostTraffic`, `stopGhostTraffic`, `getGhostStatus`) in `apps/apparatus/src/ghosting.ts`.

Updated MTD skip routes to include `/drills` in `apps/apparatus/src/mtd.ts` so drill APIs remain reachable when route prefixing is enabled.

Expanded `apps/apparatus/src/drills.ts` with richer condition kinds (`blocked_sqli_ratio`, `ghost_traffic_active`) and stressor kinds (`ghost.start`, `ghost.stop`, `seed.sqli`), including per-run SQLi seeding/accounting and extended terminal cleanup.

Added built-in scenarios `drill-ddos-sr` and `drill-sqli-principal` with dedicated hint ladders and richer win/fail logic; retained `drill-cpu-leak-jr`.

Updated dashboard drill UI/hook typing for new snapshot fields and visibility in `apps/apparatus/src/dashboard/components/dashboard/DrillConsole.tsx` and `apps/apparatus/src/dashboard/hooks/useDrills.ts`.

Expanded lifecycle tests in `apps/apparatus/test/drills.test.ts` to validate full M2 catalog and traffic/SQLi run behavior (active/cancel/debrief and SQLi ratio metric presence).

Verification: `pnpm --filter @apparatus/server test -- test/drills.test.ts` passed (4 tests).

Verification: `pnpm --filter @apparatus/server exec tsc --noEmit` passed.

Verification: `pnpm --filter @apparatus/dashboard type-check` passed.

Attempted specialist review script with writable output path `/tmp/agent-reviews`; process timed out (exit 124) and produced an empty review file, so no findings were returned.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed M2 expansion for Breach Protocol drills. Added two new built-in scenarios (traffic spike and SQLi exfil), richer condition primitives (including SQLi block effectiveness and ghost activity), and richer stressor primitives (ghost start/stop and SQLi seeding). Implemented orchestration helpers in cluster/ghost modules, kept drill APIs reachable under MTD, and expanded terminal cleanup to stop all active drill-induced stressors. Updated dashboard drill views to surface new metrics and added automated tests validating M2 catalog and lifecycle behavior for traffic and SQLi scenarios. All targeted tests and type-checks pass.
<!-- SECTION:FINAL_SUMMARY:END -->
