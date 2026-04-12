---
id: TASK-16
title: Add stop auto-scrolling controls to dashboard live feeds
status: Done
assignee: []
created_date: '2026-02-22 16:15'
updated_date: '2026-02-22 16:17'
labels:
  - dashboard
  - ui
  - feeds
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add explicit controls to disable/enable auto-scrolling on live feed panels so users can inspect older entries without the view jumping.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Autopilot Live Thought Stream provides a Stop Auto-Scrolling / Resume Auto-Scrolling control.
- [x] #2 Autopilot Action Log provides a Stop Auto-Scrolling / Resume Auto-Scrolling control.
- [x] #3 When auto-scrolling is disabled, new entries do not force feed viewport position.
- [x] #4 When auto-scrolling is re-enabled, feed viewport snaps to latest content.
- [x] #5 Dashboard build succeeds after changes.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added per-feed auto-scroll controls in AutopilotConsole for Live Thought Stream and Action Log. Each feed now has independent `Stop Auto-Scrolling` / `Resume Auto-Scrolling` toggles. Auto-scroll defaults to enabled, freezes viewport when disabled, and snaps to latest on resume. Verified with `pnpm --filter @apparatus/dashboard build`.
<!-- SECTION:NOTES:END -->
