---
id: TASK-15
title: Move HUD and AI Thought toggles into sidebar with hidden-by-default widgets
status: Done
assignee: []
created_date: '2026-02-22 15:29'
updated_date: '2026-02-22 15:51'
labels:
  - dashboard
  - hud
  - ui
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add separate sidebar controls for HUD stats and AI Thought widgets, default both widgets to hidden, and remove HUD widget toggle controls from the overlay header area. Update header/controls wiring accordingly.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Sidebar includes separate toggles for HUD stats and AI Thought visibility.
- [x] #2 Both HUD stats and AI Thought widgets are hidden by default on first load.
- [x] #3 HUD overlay top toolbar controls are removed; control comes from sidebar.
- [x] #4 Existing HUD visibility persistence via localStorage remains functional.
- [x] #5 Dashboard builds successfully after changes.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented separate sidebar toggle buttons for HUD Stats and AI Thought; removed header widget controls from HUD overlay; default hidden behavior enforced through shared hudState helpers and overlay defaults; persistence maintained through shared localStorage contract and state-change events. Verified with `pnpm --filter @apparatus/dashboard build`.
<!-- SECTION:NOTES:END -->
