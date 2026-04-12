---
id: TASK-9
title: >-
  Refactor HUD overlay into smaller hooks/components and reduce hardcoded
  geometry
status: To Do
assignee: []
created_date: '2026-02-21 06:29'
labels:
  - dashboard
  - hud
  - refactor
dependencies: []
references:
  - apps/apparatus/src/dashboard/components/hud/HudOverlayLayer.tsx
  - .agents/reviews/review-20260221-012356.md
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Split HudOverlayLayer into focused pieces (preferences persistence, drag mechanics, stats aggregation, widget views) and replace hardcoded sizing assumptions with measured or clearly centralized constants.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Drag listeners and state flow are encapsulated in reusable logic with stable event subscriptions.
- [ ] #2 Widget sizing/clamping strategy is explicit and resilient to content changes.
- [ ] #3 HUD layer component size/complexity is reduced via extracted subcomponents/hooks.
<!-- AC:END -->
