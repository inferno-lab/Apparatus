---
id: TASK-6
title: Implement Ghost API Mocker virtual service endpoints and dashboard console
status: Done
assignee: []
created_date: '2026-02-19 18:17'
updated_date: '2026-02-19 18:51'
labels:
  - feature
  - ghosts
  - dashboard
dependencies: []
references:
  - apps/apparatus/docs/plans/ghost-api-mocker.md
  - .agents/reviews/review-20260219-134739.md
  - .agents/reviews/review-20260219-134410.md
  - .agents/reviews/review-20260219-134019.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement plan in `apps/apparatus/docs/plans/ghost-api-mocker.md`: dynamic virtual ghost endpoints with configurable latency/error behavior, CRUD APIs, and a dashboard module for creating/monitoring/removing ghosts.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Backend supports virtual ghost CRUD: list, create, delete via `/ghosts` APIs while preserving existing ghost traffic controls.
- [x] #2 Dynamic ghost middleware intercepts matching method+route before standard routes and applies latency/error behavior with hit counters.
- [x] #3 Dashboard includes a Ghost console route to create/delete ghosts and monitor active ghost request counts.
- [x] #4 Automated tests cover ghost CRUD and middleware behavior (success, injected error, deletion).
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented virtual ghost API mocker backend in `src/ghosting.ts` with in-memory CRUD, latency/error behaviors, and per-ghost hit counters.

Added `ghostMockMiddleware` integration in `app.ts` before standard routes, with protected-route shadow prevention and concurrency guardrail (`MAX_INFLIGHT_GHOST_REQUESTS`).

Preserved legacy ghost traffic controls and added REST traffic controls: `POST /ghosts/start`, `POST /ghosts/stop`; `GET /ghosts` now returns `{ status, ghosts }` for backward compatibility.

Added dashboard Ghost module: `GhostConsole.tsx`, `useGhosts.ts`, route wiring in `App.tsx`, and sidebar navigation entry.

Added tests: `test/ghosting.test.ts` (CRUD, intercept, injected error, delete behavior, protected-route rejection, IPv4-mapped IPv6 target handling, restricted-port rejection) and `test/demo-mode-config.test.ts` (numeric clamp and rooted path validation).

Security hardening updates: ghost mutation endpoints behind `securityGate`, stricter loopback-IP-literal target validation, allowed-port allowlist with optional `GHOST_ALLOWED_PORTS`, demo-mode warning log, and finite/clamped demo config updates.

Documentation updated in `docs/reference/feature-reference.md` for new ghost endpoints, localhost security-gate behavior, and breaking behavior notes (HOST default, cluster/ghost gating, deprecated GET action controls).

Verification passed: server tests (ghosting + advanced defense + demo config), server `tsc --noEmit`, dashboard type-check.

Completed multiple specialist-review remediation cycles; final implementation adds: widened protected ghost route prefixes, explicit no-redirect traffic request option, max virtual ghost cap (500), and container startup warning when HOST remains loopback.

Latest verification re-run passed after final remediation: server tests (`ghosting`, `advanced.defense`, `demo-mode-config`), server type-check, dashboard type-check.
<!-- SECTION:NOTES:END -->
