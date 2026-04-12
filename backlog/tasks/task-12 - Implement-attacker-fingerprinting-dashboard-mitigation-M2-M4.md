---
id: TASK-12
title: Implement attacker fingerprinting dashboard + mitigation (M2-M4)
status: Done
assignee: []
created_date: '2026-02-22 03:27'
updated_date: '2026-02-22 05:35'
labels:
  - apparatus
  - dashboard
  - security
  - frontend
  - backend
milestone: Attacker Fingerprinting
dependencies:
  - TASK-10
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Deliver attacker registry and heatmap UI in dashboard, plus one-click mitigation actions (tarpit/blackhole) backed by server APIs and early middleware enforcement.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Add attacker fingerprinting dashboard console with searchable/sortable attacker registry consuming `/api/attackers`.
- [x] #2 Add interactive heatmap visualization of attacker IPs vs protocol activity from tracker data.
- [x] #3 Add per-attacker mitigation controls in UI (tarpit + blackhole) with visible status feedback.
- [x] #4 Expose server mitigation API endpoints and enforce blackhole blocking in middleware path before regular handlers.
- [x] #5 Add/extend tests for mitigation APIs and core behavior contracts; run dashboard build and targeted server tests.
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented attacker fingerprinting M2-M4 end-to-end.

Delivered:
- New dashboard Attacker Fingerprinting console with searchable registry, risk badges, per-attacker timeline, and protocol heatmap.
- One-click mitigation controls (tarpit/blackhole) with live state refresh.
- New blackhole module with list/add/release handlers and early middleware hard-drop enforcement.
- Tarpit hardening and explicit trap control route with IP validation.
- Shared IP normalization/validation utilities and red-team prefix guardrail updates.
- Command palette navigation for Attacker Fingerprints.

Validation:
- Added comprehensive mitigation tests (24 total in mitigation suite) covering lifecycle, edge cases, fail-closed behavior, management-bypass protections, normalization symmetry, SSE behavior, and logging-level assertions.
- Verified with:
  - pnpm --filter @apparatus/server test -- test/mitigation.test.ts
  - pnpm --filter @apparatus/server test -- test/attacker-tracker.test.ts
  - pnpm --filter @apparatus/server test -- test/redteam.decision.test.ts
  - pnpm --filter @apparatus/server exec tsc --noEmit
  - pnpm --filter @apparatus/dashboard build

Related commits:
- 9277acb feat(apparatus): add attacker fingerprinting controls and blackhole hardening
- ca9c18d test(apparatus): expand blackhole near-match bypass coverage
- c4b2b15 test(apparatus): close blackhole audit polish gaps
<!-- SECTION:FINAL_SUMMARY:END -->
