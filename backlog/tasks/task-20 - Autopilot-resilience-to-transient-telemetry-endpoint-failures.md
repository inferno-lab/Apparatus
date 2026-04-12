---
id: TASK-20
title: Autopilot resilience to transient telemetry endpoint failures
status: Done
assignee: []
created_date: '2026-02-22 20:39'
updated_date: '2026-02-22 20:41'
labels:
  - feature
  - ai
  - autopilot
  - redteam
  - testing
  - remediation
dependencies: []
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/test/autopilot.memory-states.test.ts
documentation:
  - apps/apparatus/docs/development/plans/AI-kill-chain-memory.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Reduce false mission failures by handling brief metrics/sysinfo/health endpoint outages with bounded retry and recovery logging, while preserving failure behavior when outages persist.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Autopilot snapshot capture retries transient endpoint failures with bounded attempts and short backoff.
- [x] #2 A single transient telemetry failure does not force mission state to `failed` if a retry succeeds.
- [x] #3 Persistent telemetry failures still terminate the mission with clear failure reason.
- [x] #4 Automated tests cover transient success-after-retry and persistent failure paths.
- [x] #5 Verification command receipts are recorded in task notes.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented bounded telemetry snapshot retry in `apps/apparatus/src/ai/redteam.ts` with `captureRuntimeSnapshotWithRetry` (`maxAttempts=3`, incremental short backoff).

Mission loop now emits explicit retry/recovery thought entries during analyze and verify phases so operators can see transient telemetry instability.

Transient outage behavior: a single metrics failure now retries and mission proceeds; persistent metrics failure still transitions to `failed` with explicit message (`Telemetry capture failed after ... attempts`).

Updated `apps/apparatus/test/autopilot.memory-states.test.ts` mock controls to simulate transient (`metricsFailuresRemaining`) and persistent (`metricsAlwaysFail`) telemetry endpoint failures.

Verification command: `pnpm --filter @apparatus/server test -- test/autopilot.memory-states.test.ts test/autopilot.test.ts test/redteam.planner-payload.test.ts test/redteam.memory-extraction.test.ts test/report-store.memory.test.ts test/redteam.decision.test.ts src/dashboard/components/dashboard/AutopilotConsole.logic.test.ts` (passed: 7 files, 20 tests).

Type-check: `pnpm --filter @apparatus/server exec tsc --noEmit` (passed).

Dashboard build: `pnpm --filter @apparatus/dashboard build` (passed).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented telemetry snapshot retry resilience for autopilot so brief endpoint outages no longer cause immediate mission failure. Added operator-visible retry/recovery thought logging, preserved deterministic failure behavior for persistent outages, and validated both paths through the autopilot state-compatibility suite and full targeted verification commands.
<!-- SECTION:FINAL_SUMMARY:END -->
