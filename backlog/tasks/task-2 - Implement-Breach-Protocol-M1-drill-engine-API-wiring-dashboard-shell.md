---
id: TASK-2
title: Implement Breach Protocol M1 (drill engine + API wiring + dashboard shell)
status: Done
assignee:
  - codex
created_date: '2026-02-19 04:20'
updated_date: '2026-02-19 04:32'
labels:
  - feature
  - apparatus
  - drill
  - m1
dependencies: []
references:
  - apps/apparatus/docs/plans/breach-protocol-drill.md
  - apps/apparatus/src/scenarios.ts
  - apps/apparatus/src/tool-executor.ts
  - apps/apparatus/src/dashboard/components/dashboard/ScenarioConsole.tsx
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build M1 for Breach Protocol based on the approved plan: backend drill engine with one functional built-in scenario, route wiring, and dashboard shell with start/status/cancel/debrief flow.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Backend exposes /drills endpoints (list, run, status, mark-detected, cancel, debrief) behind security gate
- [x] #2 Drill engine supports lifecycle transitions and condition polling for at least one built-in scenario
- [x] #3 Run cleanup stops active experiments on terminal states
- [x] #4 Dashboard includes a Breach Protocol route and a functional Drill console shell
- [x] #5 User can start a drill, view status/timeline, mark detected, cancel, and view debrief from UI
- [x] #6 At least one automated test covers core drill run lifecycle
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1) Implement `apps/apparatus/src/drills.ts` with one built-in CPU containment drill, run state machine, polling evaluator, timeline recording, scoring/debrief, and cleanup via existing experiment stop functions.
2) Wire backend endpoints in `apps/apparatus/src/app.ts` under existing `securityGate`: GET /drills, POST /drills/:id/run, GET /drills/:id/status, POST /drills/:id/mark-detected, POST /drills/:id/cancel, GET /drills/:id/debrief.
3) Add frontend shell: new `useDrills` hook and `DrillConsole` component; wire route in `apps/apparatus/src/dashboard/App.tsx` and sidebar nav in `apps/apparatus/src/dashboard/components/layout/Sidebar.tsx`.
4) Add backend lifecycle test in `apps/apparatus/test/drills.test.ts` that starts a drill and validates terminal state plus debrief fields.
5) Run targeted tests and remediate failures; then request specialist review per agent-loops and fix P0/P1 findings.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
User approved starting implementation with message: "yes begin".

Implemented backend drill engine in apps/apparatus/src/drills.ts with built-in CPU containment drill, lifecycle state machine, evaluator loop, timeline, cleanup, and debrief scoring.

Wired drill endpoints in apps/apparatus/src/app.ts behind securityGate: GET /drills, POST /drills/:id/run, GET /drills/:id/status, POST /drills/:id/mark-detected, POST /drills/:id/cancel, GET /drills/:id/debrief.

Added dashboard integration via apps/apparatus/src/dashboard/components/dashboard/DrillConsole.tsx, apps/apparatus/src/dashboard/hooks/useDrills.ts, route wiring in App.tsx, and sidebar nav item in Sidebar.tsx.

Added backend lifecycle test apps/apparatus/test/drills.test.ts.

Verification: `pnpm --filter @apparatus/server test -- test/drills.test.ts` passed.

Verification: `pnpm --filter @apparatus/server exec tsc --noEmit` passed.

Verification: `pnpm --filter @apparatus/dashboard type-check` passed.

Attempted specialist review via agent-loops script. First run failed due output path permissions in `.agents/reviews`; second run with `--output /tmp/agent-reviews` timed out (exit 124) and produced no findings file.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed Breach Protocol M1 implementation with end-to-end backend + dashboard shell. Added new drill engine (`src/drills.ts`) with one built-in scenario, run lifecycle states, condition polling, timeline events, cleanup on terminal states, and debrief scoring. Exposed drill APIs behind security gate and integrated dashboard route/navigation (`/dashboard/drill`) with a functional console for start/status/mark-detected/cancel/debrief flows. Added and passed lifecycle test coverage in `test/drills.test.ts`, and validated server/dashboard type-checks.
<!-- SECTION:FINAL_SUMMARY:END -->
