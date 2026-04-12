---
id: TASK-36
title: >-
  Harden autopilot persona planner security and test coverage from agent-loops
  audit
status: To Do
assignee: []
created_date: '2026-02-23 02:22'
labels:
  - remediation
  - ai
  - autopilot
  - security
  - tests
milestone: m-15
dependencies: []
references:
  - apps/apparatus/src/ai/redteam.ts
  - apps/apparatus/test/redteam.persona.test.ts
  - .agents/reviews/review-20260222-211740.md
  - .agents/reviews/test-audit-20260222-212023.md
documentation:
  - apps/apparatus/docs/development/plans/AI-persona-profiles.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Address remaining high-signal findings from agent-loops specialist/test-audit reviews around semantic prompt-injection resilience and sanitizeDecision boundary coverage for persona-aware planner flows.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 sanitizeDecision tests cover disallowed tool values, undefined/null params, negative/zero/NaN rate clamping, and URL bypass/path traversal attempts.
- [ ] #2 Prompt composition introduces stronger structural isolation for persona directives and documents semantic-injection trust boundaries.
- [ ] #3 Planner payload/config contract tests verify persona metadata shape and safe rendering assumptions.
- [ ] #4 Focused verification bundle passes and task notes include linked review evidence.
<!-- AC:END -->
