---
id: TASK-7
title: Implement dashboard HUD overlays (global stats + autopilot thought stream)
status: Done
assignee: []
created_date: '2026-02-21 05:41'
updated_date: '2026-02-21 06:29'
labels:
  - dashboard
  - ui
  - hud
  - autopilot
dependencies: []
references:
  - apps/apparatus/docs/development/plans/UI-hud-overlays.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement UI-HUD-Overlays plan in dashboard with floating HUD widgets across views. Include top-right global stats HUD, bottom-left AI thought stream HUD, portal rendering, z-index layering, and user customization for drag/toggle persistence.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 HUD widgets render via portal and persist across dashboard routes.
- [x] #2 Top-right HUD shows throughput, active threats, and system health from live app context.
- [x] #3 Bottom-left HUD shows latest autopilot thought entries from live autopilot status.
- [x] #4 Users can drag HUD widgets and toggle visibility; preferences persist in localStorage.
- [x] #5 HUD layering remains below modals/command palette and above main content.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented portal-based HUD overlay with persistent stats/thought widgets, drag-and-drop repositioning, keyboard repositioning, and localStorage-backed visibility/position preferences.

Added master HUD hide/show control and toolbar toggles for individual widgets.

Validated in browser via Playwright on /dashboard and /dashboard/docs routes.

Follow-up tasks created for test coverage and further refactor hardening: TASK-8, TASK-9.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented UI-HUD-Overlays core feature set in dashboard with persistent floating widgets. Added new `HudOverlayLayer` portal component wired from app shell, including top-right global stats HUD (throughput, threat signals, health), bottom-left AI thought stream HUD, drag + keyboard reposition controls, widget toggle controls, and localStorage persistence for position/visibility. Added global hide/show HUD control and ARIA semantics for overlay/toolbar/drag handles. Verified behavior with `pnpm --filter @apparatus/dashboard type-check` and Playwright screenshots/interactions. Logged follow-up tasks for automated test coverage and deeper refactor improvements (TASK-8, TASK-9).
<!-- SECTION:FINAL_SUMMARY:END -->
