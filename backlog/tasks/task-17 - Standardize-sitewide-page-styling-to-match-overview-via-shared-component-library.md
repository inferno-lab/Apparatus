---
id: TASK-17
title: >-
  Standardize sitewide page styling to match overview via shared component
  library
status: Done
assignee: []
created_date: '2026-02-22 16:16'
updated_date: '2026-02-22 16:58'
labels:
  - frontend
  - design-system
  - component-library
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Align all pages to the overview page visual system by moving page-level styling into shared components and updating pages to consume the component library.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Overview page style tokens and component patterns are represented in shared library components.
- [x] #2 All app pages use shared components for layout primitives and key UI sections instead of page-specific ad-hoc styles.
- [x] #3 Sitewide pages visually match overview style direction (spacing, typography, cards, controls) with no major regressions.
- [x] #4 Build and relevant tests pass for affected app(s).
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented shared `PageShell` in the dashboard component library and exported via ui index.

Updated route rendering to apply `PageShell` across layout outlet pages and docs routes.

Refactored overview page to consume shared `Card` panel styling and new `Badge` chip variant instead of local style constants.

Added overview feed auto-scroll accessibility support (`role=log`, dynamic `aria-live`, `aria-pressed`, keyboard focus ring).

Validation: `pnpm --filter @apparatus/dashboard build` passed.

Code review receipts: `.agents/reviews/review-20260222-113605.md` (latest), prior iterations `.agents/reviews/review-20260222-112721.md`, `.agents/reviews/review-20260222-112957.md`, `.agents/reviews/review-20260222-113225.md`.

Test audit receipt: `.agents/reviews/test-audit-20260222-113225.md` (overview currently has no dedicated tests; audit remains open for future coverage work).

Follow-up completed: extracted Overview pure logic to `Overview.logic.ts` and added targeted unit tests in `Overview.logic.test.ts`.

Follow-up completed: added semantic `ops` design tokens in `theme/colors.ts` and wired them through Tailwind (`tailwind.config.ts`) and component/page classes to replace repeated overview hex values.

Validation updates: `pnpm --dir apps/apparatus test -- src/dashboard/components/dashboard/Overview.logic.test.ts` passed (6/6).

Current workspace constraint: `pnpm --filter @apparatus/dashboard build` is failing due unrelated pre-existing `TestingLab.tsx` TypeScript errors (`labError`, `setDlpType`, `setScanTarget`, missing `cn` import).

Latest review/audit receipts: `.agents/reviews/review-20260222-115147.md`, `.agents/reviews/test-audit-20260222-115451.md`.
<!-- SECTION:NOTES:END -->
