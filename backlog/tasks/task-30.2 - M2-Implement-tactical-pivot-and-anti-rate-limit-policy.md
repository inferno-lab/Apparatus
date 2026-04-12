---
id: TASK-30.2
title: 'M2: Implement tactical pivot and anti-rate-limit policy'
status: Done
assignee:
  - codex
created_date: '2026-02-22 23:53'
updated_date: '2026-02-23 00:24'
labels:
  - feature
  - ai
  - autopilot
  - redteam
milestone: m-7
dependencies:
  - TASK-30.1
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/test/redteam.decision.test.ts
  - apps/apparatus/test/autopilot.test.ts
parent_task_id: TASK-30
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add deterministic evasion policy that pivots off blocked vectors, increases backoff under likely rate limits, and avoids repeated ineffective actions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Decision logic classifies block/rate-limit/tarpit conditions and chooses a policy-driven maneuver before generic fallback.
- [x] #2 Policy enforces safe allowed-tools behavior and prevents disallowed pivots.
- [x] #3 Pivot and backoff reasons are emitted in autopilot thought/action logs.
- [x] #4 Regression tests cover pivot selection for representative 403/429/high-latency scenarios.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add a deterministic evasion policy function in `apps/apparatus/src/ai/redteam.ts` that maps recent defense signals to safe pivot actions before generic fallback.
2. Thread policy selection into `decideNextAction` and emit explicit evasion/backoff reasoning into autopilot thought logs.
3. Implement anti-rate-limit behavior by increasing mission `intervalMs` when rate-limit signals recur, within existing clamp bounds.
4. Add focused regression tests for 429, 403/404 block, and high-latency tarpit scenarios plus safe allowed-tools fallback behavior.
5. Run targeted redteam/autopilot tests and server type-check, then capture evidence in task notes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
M2 complete: policy selection now executes before fallback, emits explicit evasion maneuver thought logs, enforces allowlisted tool behavior, and applies bounded anti-rate-limit interval backoff.

Implemented deterministic policy-first maneuver selection in `apps/apparatus/src/ai/redteam.ts` for `rate_limited`, `waf_blocked`, `mtd_hidden_route`, `tarpit_suspected`, and `probe_failed` signals before generic fallback.

Kept guardrail compliance via `sanitizeDecision` tool allowlist enforcement and anti-rate-limit interval backoff bounded by existing clamps.

Added focused policy tests in `apps/apparatus/test/redteam.evasion-policy.test.ts` and validated planner/memory integration and runtime behavior via focused autopilot/redteam suite.
<!-- SECTION:NOTES:END -->
