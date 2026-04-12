---
id: TASK-10
title: Implement attacker fingerprinting backend foundation (M1)
status: Done
assignee: []
created_date: '2026-02-22 02:36'
updated_date: '2026-02-22 02:40'
labels:
  - apparatus
  - security
  - dashboard
  - backend
milestone: Attacker Fingerprinting
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build backend attacker identity tracker to aggregate request/deception/tarpit activity by source IP with weighted risk scoring and expose read APIs for dashboard consumption.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Server maintains in-memory attacker profiles keyed by source IP with activity counters, timeline entries, and computed risk score.
- [x] #2 Tracker ingests at least request/deception/tarpit events with configurable scoring weights (default: request +1, WAF/block +10, honeypot/tarpit +50).
- [x] #3 New API endpoint returns attacker profile list sorted by risk score and supports optional search/filter params.
- [x] #4 New API endpoint returns single attacker profile timeline/details by IP.
- [x] #5 Automated tests cover scoring, aggregation, and API response contracts.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented `src/attacker-tracker.ts` as in-memory attacker identity store keyed by IP with weighted scoring, timeline aggregation, protocol hit buckets, and geo categorization.

Integrated ingestion at event fan-out layer by wiring `broadcastRequest`, `broadcastDeception`, and `broadcastTarpit` in `src/sse-broadcast.ts` to record tracker signals.

Added API endpoints in `src/app.ts`:
- `GET /api/attackers` (supports `q`, `minRisk`, `category`, `limit`)
- `GET /api/attackers/:ip`

Added tests in `test/attacker-tracker.test.ts` covering scoring math, identity aggregation, and API contracts.

Validation run:
- `pnpm --filter @apparatus/server exec tsc --noEmit`
- `pnpm --filter @apparatus/server test -- test/attacker-tracker.test.ts`
<!-- SECTION:NOTES:END -->
