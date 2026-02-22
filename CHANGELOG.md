# Changelog

All notable changes to this project are documented in this file.

## [Unreleased] - 2026-02-21

### Added
- Live Payload Fuzzer M1 backend surface:
  - `POST /api/redteam/fuzzer/run` for single-request execution with normalized telemetry output
  - request validation for target/method/path/headers/query/body and bounded timeout controls
  - response preview capture with truncation metadata for large upstream responses
- Ghost API Mocker virtual service system:
  - `POST /ghosts` to create method+route virtual endpoints
  - `DELETE /ghosts/:id` to remove virtual endpoints
  - Ghost middleware interception with configurable fixed/jitter latency and injected error rates
  - Per-ghost request counters and hit timestamps
- Dashboard Ghost module:
  - `GhostConsole` UI for creating/deleting/monitoring ghosts
  - `useGhosts` hook for ghost CRUD/list refresh flows
  - New `/dashboard/ghosts` route and sidebar navigation entry
- Dashboard documentation hub:
  - New full-page docs experience at `/dashboard/docs` and `/dashboard/docs/:docId`
  - Dedicated document sidebar with search and grouped categories
  - In-page outline navigation for large markdown files
  - Docs hub entry points in both sidebar nav and command palette
- New tests:
  - `apps/apparatus/test/ghosting.test.ts`
  - `apps/apparatus/test/demo-mode-config.test.ts`
  - Expanded `apps/apparatus/test/advanced.defense.test.ts` coverage for fuzzer validation, SSRF guardrails, upstream error normalization, large-response truncation, and validate-route host restriction.

### Changed
- Rewrote `apps/apparatus/docs/development/plans/live-payload-fuzzer.md` into an implementation-ready engineering plan with contracts, phased milestones, and safety constraints.
- `GET /ghosts` now returns ghost system state and virtual mock list in the shape `{ status, ghosts }`.
- Added REST controls for ghost traffic:
  - `POST /ghosts/start`
  - `POST /ghosts/stop`
- Legacy query-action controls remain for compatibility:
  - `GET /ghosts?action=start|stop`
  - Deprecated with server warning logs.
- Reconciled `apps/apparatus/docs/plans/ai-red-team-plan.md` with current implementation:
  - documents Autopilot as canonical red-team AI surface
  - maps implemented vs pending scope from the original plan
- Dashboard readability/contrast pass:
  - improved opaque backgrounds and hover contrast for key console lists
  - updated modal/interactive element visibility to avoid transparent blending
- Command/help modal hardening:
  - added hidden dialog title/description metadata for Radix accessibility compliance
  - increased command dialog surface opacity and border contrast

### Security
- Hardened red-team request execution surfaces:
  - loopback-only target policy by default for fuzzer and validate endpoints
  - optional host allowlist via `APPARATUS_FUZZER_ALLOWED_TARGETS`
  - absolute/protocol-relative path rejection to prevent origin override
  - bounded outbound body and upstream response capture limits
- Ghost mutation and traffic-control routes are now protected by `securityGate` (localhost-only unless `DEMO_MODE=true`):
  - `GET /ghosts`
  - `POST /ghosts`
  - `DELETE /ghosts/:id`
  - `POST /ghosts/start`
  - `POST /ghosts/stop`
- Ghost target validation hardened:
  - Requires loopback IP literals (IPv4/IPv6 forms)
  - Port allowlist enforced (plus optional `GHOST_ALLOWED_PORTS`)
  - Redirect-following disabled for generated ghost traffic requests
- Added guardrails:
  - Max concurrent in-flight ghost responses
  - Max virtual ghost count (`500`)
  - Reserved route prefix protections to avoid shadowing critical endpoints
- Demo mode startup warning now logs when CORS is permissive.
- Added startup warning for containerized environments when `HOST=127.0.0.1`.

### Breaking Changes
- `GET /redteam/validate` is now protected by `securityGate` and host-restricted by default.
  - Non-loopback targets are rejected unless explicitly allowlisted via `APPARATUS_FUZZER_ALLOWED_TARGETS`.
- Default bind host is `127.0.0.1` (not `0.0.0.0`).
  - Set `HOST=0.0.0.0` explicitly for Docker/Kubernetes/remote access.
- Cluster attack controls are localhost-gated by default:
  - `POST /cluster/attack`
  - `POST /cluster/attack/stop`
- Ghost endpoints are localhost-gated by default (see Security section).
