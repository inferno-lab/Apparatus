---
id: TASK-25
title: Implement UI terminal immersion boot sequence and CRT effects
status: Done
assignee:
  - codex
created_date: '2026-02-22 21:14'
updated_date: '2026-02-22 23:55'
labels:
  - dashboard
  - ui
  - immersion
dependencies: []
references:
  - apps/apparatus/docs/development/plans/UI-terminal-immersion.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the UI-terminal-immersion plan for the Apparatus dashboard: add cinematic boot preloader gating, enhanced CRT/noise/chromatic overlays, and subtle terminal typography flicker while preserving accessibility and reduced-motion behavior.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Dashboard shows a terminal-style boot sequence before main layout mounts.
- [x] #2 Boot preloader gates reveal until Apparatus provider has completed an initial health cycle and a ~2s timeline has completed.
- [x] #3 Global CRT visuals use SVG filters/noise/chromatic/scanline layers with subtle flicker and pointer-events disabled.
- [x] #4 Critical status text has subtle terminal flicker without harming readability.
- [x] #5 `pnpm --filter @apparatus/dashboard type-check` and `pnpm --filter @apparatus/dashboard build` pass.
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-02-22: Completed implementation + verification (`pnpm --filter @apparatus/dashboard type-check`, `pnpm --filter @apparatus/dashboard build`).

Ran specialist-review cycles: review-20260222-161906.md, review-20260222-162301.md, review-20260222-162656.md.

After 3rd cycle, specialist-review verdict is REQUEST CHANGES with unresolved blocking concerns: (1) SVG turbulence filter performance on animated overlays; (2) boot-gate escape/skip behavior under slow or unreachable backend; (3) reduced-motion should fully hide chromatic layer.

Circuit breaker reached per agent-loops skill (max 3 specialist-review cycles). Awaiting user direction before cycle 4 remediation.

2026-02-22 (continued): Added boot-gate logic extraction (`terminalBootGateLogic.ts`) and initial coverage (`TerminalBootGate.logic.test.ts`) to validate timing/state predicates and progress math.

Latest verify commands all passing: `pnpm --filter @apparatus/dashboard exec vitest run components/layout/TerminalBootGate.logic.test.ts`, `pnpm --filter @apparatus/dashboard type-check`, `pnpm --filter @apparatus/dashboard build`.

Latest specialist review artifact: `.agents/reviews/review-20260222-171440.md` (approve with changes; no critical blockers).

Latest test audit artifact: `.agents/reviews/test-audit-20260222-171135.md` (coverage improved but still substantial missing component-level tests).

Correction: acceptance criterion #3 remains partially met in spirit (noise/chromatic/scanline overlays delivered) but current implementation intentionally removed runtime SVG turbulence filters during performance hardening; revisit if strict SVG-filter requirement is mandatory.

2026-02-22 (final pass): Reintroduced lightweight SVG filter usage via `CrtFilterDefs.tsx` (`#crt-noise-filter-lite`, `#crt-chromatic-filter-lite`) and wired it into `App.tsx` to satisfy the SVG-filter criterion without turbulence-heavy runtime filters.

Added jsdom component interaction coverage for TerminalBootGate (`TerminalBootGate.component.test.tsx`) covering skip click, Escape dismissal, focus handoff, timeout-to-dismiss, and no re-show after exit.

Expanded logic coverage (`TerminalBootGate.logic.test.ts`) including no-re-show latch behavior and timing/progress helpers.

Latest verify bundle: `pnpm --filter @apparatus/dashboard exec vitest run components/layout/TerminalBootGate.logic.test.ts components/layout/TerminalBootGate.component.test.tsx`, `pnpm --filter @apparatus/dashboard type-check`, `pnpm --filter @apparatus/dashboard build` all pass.

Latest specialist review artifact: `.agents/reviews/review-20260222-184945.md` (approve with changes, no critical blockers).

Latest test audit artifact: `.agents/reviews/test-audit-20260222-185257.md` (coverage improved to ~65%, remaining gaps mostly edge/boundary and additional a11y semantics assertions).
<!-- SECTION:NOTES:END -->
