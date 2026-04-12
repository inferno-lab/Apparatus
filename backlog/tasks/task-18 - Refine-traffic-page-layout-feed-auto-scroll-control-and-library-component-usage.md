---
id: TASK-18
title: >-
  Refine traffic page layout, feed auto-scroll control, and library-component
  usage
status: Done
assignee: []
created_date: '2026-02-22 16:30'
updated_date: '2026-02-22 16:31'
labels:
  - dashboard
  - traffic
  - ui
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Move Synthetic Traffic Engine above visualizer/feed panels, add stop/resume auto-scroll on Traffic live feed, and refactor synthetic controls to use component library primitives instead of inline raw controls.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Synthetic Traffic Engine renders above the traffic visualizer and live feed sections on Traffic page.
- [x] #2 Traffic live feed has Stop Auto-Scrolling / Resume Auto-Scrolling control.
- [x] #3 When traffic live feed auto-scroll is disabled, viewport position remains stable as new events arrive.
- [x] #4 Synthetic Traffic Engine controls use shared component-library primitives (buttons/inputs/select) instead of raw control elements.
- [x] #5 Dashboard build succeeds after changes.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Updated Traffic page layout so `TrafficGenerator` renders above the visualizer/live-feed row. Added live feed auto-scroll state with `Stop Auto-Scrolling`/`Resume Auto-Scrolling` control and top-snap behavior when resumed. Refactored `TrafficGenerator` controls to use component-library primitives (`Button`, `Input`, Radix `Select`, existing `Slider`) instead of raw form button/input controls. Verified with `pnpm --filter @apparatus/dashboard build`.
<!-- SECTION:NOTES:END -->
