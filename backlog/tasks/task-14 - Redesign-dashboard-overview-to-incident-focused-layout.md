---
id: TASK-14
title: Redesign dashboard overview to incident-focused layout
status: Done
assignee: []
created_date: '2026-02-22 11:48'
updated_date: '2026-02-22 12:09'
labels:
  - dashboard
  - ui
  - overview
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update the dashboard overview page to match the provided reference layout using component-library patterns (no inline styles). Replace telemetry log with an incident-only feed including module source tags, compress Defense and Chaos into bottom status strips, remove charts from overview (protocol shown as thin breakdown bar only), and remove Manual Overrides from overview.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Overview page no longer renders PerformanceVisualizer or any chart component.
- [x] #2 Overview page replaces Telemetry Logs with an incident-only feed that emphasizes triggered/detected/failed events and includes a module/source tag per row.
- [x] #3 Defense and Chaos are shown as compact bottom status strips rather than full list panels.
- [x] #4 Manual Overrides section is removed from overview.
- [x] #5 Implementation uses existing component library + Tailwind classes; no inline style objects are introduced in Overview.
- [x] #6 Dashboard builds successfully after the change.
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rebuilt the dashboard overview in an incident-first layout aligned to the latest v2 reference styling while staying within the component library. Key outcomes: removed performance chart and manual overrides from overview, replaced telemetry log with actionable incident feed (source tags included), switched protocol display to a thin breakdown strip with legend, compressed Defense and Chaos to bottom status strips, added `GET /chaos/status` backend endpoint for accurate chaos-running state, and restyled the page with electric-blue high-contrast depth treatment (layered surfaces/glows) without inline styles. Verification: `pnpm --filter @apparatus/dashboard build`, `pnpm --filter @apparatus/server exec tsc --noEmit`, and `pnpm --filter @apparatus/server test -- incident-timeline-model` passed. Audit artifacts generated: `.agents/reviews/review-20260222-065617.md`, `.agents/reviews/review-20260222-070258.md`, `.agents/reviews/test-audit-20260222-070553.md`.
<!-- SECTION:FINAL_SUMMARY:END -->
