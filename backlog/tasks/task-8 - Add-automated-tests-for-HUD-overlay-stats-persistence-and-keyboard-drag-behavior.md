---
id: TASK-8
title: >-
  Add automated tests for HUD overlay stats, persistence, and keyboard drag
  behavior
status: To Do
assignee: []
created_date: '2026-02-21 06:29'
labels:
  - dashboard
  - hud
  - tests
dependencies: []
references:
  - apps/apparatus/src/dashboard/components/hud/HudOverlayLayer.tsx
  - .agents/reviews/test-audit-20260221-012737.md
  - .agents/reviews/review-20260221-012356.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create unit/component tests for HudOverlayLayer and extracted pure helpers to cover threat classification, RPS calculation, localStorage hydration/persistence, HUD visibility toggles, and keyboard repositioning.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Test suite covers stats classification and RPS math for recent and fallback samples.
- [ ] #2 Test suite covers load/save localStorage behavior and hidden/visible persistence.
- [ ] #3 Test suite covers widget visibility toggles and master hide/show behavior.
- [ ] #4 Test suite covers keyboard-based movement and viewport clamping.
<!-- AC:END -->
