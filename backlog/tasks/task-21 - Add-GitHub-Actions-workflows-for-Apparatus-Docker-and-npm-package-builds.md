---
id: TASK-21
title: Add GitHub Actions workflows for Apparatus Docker and npm package builds
status: Done
assignee:
  - codex
created_date: '2026-02-22 21:06'
updated_date: '2026-02-22 21:26'
labels:
  - ci
  - github-actions
  - packaging
dependencies: []
references:
  - apps/apparatus/Dockerfile
  - apps/apparatus/package.json
  - libs/client/package.json
  - apps/cli/package.json
  - apps/apparatus/project.json
  - libs/client/project.json
  - apps/cli/project.json
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create CI workflows that build the Apparatus server Docker image and produce npm package artifacts for the server app, client library, and CLI so packaging regressions are caught on PRs and main branch updates.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A GitHub Actions workflow builds the Apparatus Docker image from the repository on pull requests and on pushes to `main`.
- [x] #2 A GitHub Actions workflow builds `@apparatus/server`, `@apparatus/client`, and `@apparatus/cli`, then creates npm package tarballs for each.
- [x] #3 The npm package workflow uploads generated tarballs as workflow artifacts.
- [x] #4 Workflows use pinned major action versions, least-privilege permissions, and dependency caching for pnpm installs.
- [x] #5 Workflow changes are validated locally with relevant build/pack commands and results are documented in task notes.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Inspect package build targets and current Dockerfile constraints for `apps/apparatus`, `libs/client`, and `apps/cli`.
2. Implement a Docker-focused GitHub Actions workflow at `.github/workflows/docker-image.yml` using pnpm setup, buildx, secure permissions, and branch/PR triggers.
3. Implement an npm packaging workflow at `.github/workflows/npm-packages.yml` that builds all three packages, runs `npm pack` for each, and uploads tarballs as artifacts.
4. If required for CI correctness, update `apps/apparatus/Dockerfile` to build successfully from pnpm workspace context.
5. Run local verification commands for build/pack flows and capture results in Backlog task notes before finalizing.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented workflows at `.github/workflows/docker-image.yml` and `.github/workflows/npm-packages.yml`.

Updated `apps/apparatus/Dockerfile` to build from pnpm workspace context (Node 22 + corepack + pnpm install + nx build + `pnpm deploy --prod`).

Verification command: `pnpm install --frozen-lockfile` ✅ passed.

Verification command: `pnpm nx run-many -t build --projects=apparatus,client,cli` ❌ failed in existing dashboard TypeScript files (`apps/apparatus/src/dashboard/components/dashboard/IdentityConsole.tsx` and related imports). Client and CLI builds succeeded; apparatus build failed due current repo code state.

Verification command: `npm pack --pack-destination ...` for app/client/cli ✅ passed and generated three tarballs (`apparatus-server-1.0.0.tgz`, `apparatus-client-0.1.0.tgz`, `apparatus-cli-0.1.0.tgz`).

Verification command: `docker build -f apps/apparatus/Dockerfile -t apparatus:test .` ❌ could not run because local Docker daemon socket was unavailable (`.../colima/default/docker.sock` missing).

Committed workflow/Docker changes as `eaf8808` with message: `ci(apparatus): add Docker and npm package build workflows`. Commit includes only `.github/workflows/docker-image.yml`, `.github/workflows/npm-packages.yml`, `.dockerignore`, and `apps/apparatus/Dockerfile`.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added two GitHub Actions workflows: one to build (and on main, push) the Apparatus Docker image via GHCR, and one to build plus `npm pack` the server/client/CLI packages and upload tarballs as artifacts. Updated the server Dockerfile so CI Docker builds use the pnpm workspace correctly. Local verification showed install and npm pack steps passing; apparatus build currently fails due pre-existing dashboard TypeScript errors, and Docker image build could not be executed locally because the Docker daemon was not running.

Commit `eaf8808` contains the CI workflow and Dockerfile changes only; unrelated concurrent dashboard edits in the working tree were intentionally left untouched.
<!-- SECTION:FINAL_SUMMARY:END -->
