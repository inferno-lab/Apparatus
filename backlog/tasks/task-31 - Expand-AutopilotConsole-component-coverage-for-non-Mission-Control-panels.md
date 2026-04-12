---
id: TASK-31
title: Expand AutopilotConsole component coverage for non-Mission-Control panels
status: To Do
assignee: []
created_date: '2026-02-23 00:58'
labels:
  - testing
  - dashboard
  - autopilot
milestone: m-10
dependencies:
  - TASK-30.4
references:
  - apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.tsx
  - >-
    apps/apparatus/src/dashboard/components/dashboard/AutopilotConsole.component.test.tsx
  - .agents/reviews/test-audit-20260222-195506.md
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Follow-up coverage expansion for AutopilotConsole display-heavy panels and state fallbacks identified by test-review audit after M4 delivery. Scope focuses on Thought Stream, Action Log, Report Card, Defense Telemetry, Acquired Assets, and Relation Strip rendering with empty/loading/populated states.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Add component tests for Thought Stream and Action Log populated + empty states, including maneuver sub-line rendering.
- [ ] #2 Add component tests for Report Card fallback chain (verification notes -> failure reason -> default) and breaking-point formatting.
- [ ] #3 Add component tests for Defense Telemetry empty/loading/populated states and blocked-signal cap behavior.
- [ ] #4 Add component tests for Acquired Assets and Relation Strip populated + empty/fallback states.
- [ ] #5 Keep dashboard build and targeted component/logic tests green.
<!-- AC:END -->
