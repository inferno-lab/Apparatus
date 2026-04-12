---
id: TASK-39
title: >-
  Integrate new Recursive typography system into dashboard component library and
  apply across pages
status: Done
assignee: []
created_date: '2026-02-23 07:29'
updated_date: '2026-02-23 07:35'
labels:
  - dashboard
  - design-system
  - typography
dependencies: []
references:
  - apps/apparatus/assets/typography/TYPOGRAPHY.md
  - apps/apparatus/assets/typography/type-system.js
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Adopt the new typography system defined in apps/apparatus/assets/typography by adding role-based typography primitives to the dashboard component library and applying them globally across dashboard pages.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 UI library exposes reusable typography role primitives aligned with assets/typography spec
- [x] #2 Global dashboard styles load the new Recursive role definitions and preserve compatibility for existing font utility classes
- [x] #3 Shared layout/components use the new typography roles so all pages inherit the system
- [x] #4 Dashboard type-check and build pass after integration
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added `components/ui/typography.ts` as the component-library source of truth for typography roles mapped to the new Recursive type system. Updated global dashboard styles to define role axis tokens (`--type-*-axes`), role utility classes (`type-*`), and compatibility mappings for existing helpers (`font-*`, `rec-*`) so legacy page markup inherits the new system. Applied role utilities in shared UI/layout primitives (`Card`, `Badge`, `Button`, `Input`, `Select`, `Table`, `StatCard`, `Sidebar`, `Header`) and enabled app-wide inheritance via `type-body` on the shell. Switched dashboard entry stylesheet import to `styles/globals.css`, narrowed font loading in `index.html` to Recursive only, and aligned Tailwind font stacks to Recursive-first fallbacks. Verified with dashboard type-check and build.
<!-- SECTION:NOTES:END -->
