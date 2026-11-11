# AGENTS.md

This file provides guidance to AI Agents when working with code in this repository.

## Overview

Enduro Time Card: a Svelte 5 + TypeScript + Vite + Tailwind 4 app that scores Time Keeping (AMA National, NETRA Brand X) and Sprint enduros. It ships as a GitHub Pages web app, a PWA, and Capacitor iOS/Android apps from one codebase. Targets Node 26.

## Commands

```
npm run dev              # vite dev server (https://localhost:5173 if cert.key/cert.crt exist, see `npm run cert`)
npm test                 # vitest (watch mode); specs live in test/specs
npx vitest run test/specs/test.db.ts   # single spec file
npx vitest run -t "name"               # single test by name
npm run test:coverage
npm run build            # GitHub Pages build (--base=/timecard/)
npm run build:cap        # Capacitor build + `cap sync`
npx cypress run          # e2e (cypress/e2e); needs the dev server already running
npx cypress run --spec cypress/e2e/home.cy.ts
```

- Cypress `baseUrl` is `https://localhost:5173`. Run it against the dev server that's already running; don't start a second one.
- `svelte-check` isn't available; verify UI changes with Cypress.
- CI (`.github/workflows`) runs `npm run test` and `npm run build`, then deploys `dist` to GitHub Pages. Cypress is not run in CI.

## Architecture

- **App shell (`src/App.svelte`)**: no router library. It holds the race list and picks between `HomePage` and `EditPage` using `window.history` and `#/edit/<id>` hashes. Leaving the edit page goes through a `popstate` handler with an unsaved-changes (`editDirty`) guard. `src/lib/backButton.ts` routes the Android hardware Back button through `history.back()` so it hits the same guard.
- **Models (`src/models`)**: `race.ts` defines the `Race` discriminated union, keyed on `raceType` (`'sprint' | 'time_keeper'`). Use the `never` exhaustiveness checks when adding a race type.
- **View models (`src/viewModels`)**: Svelte 5 rune classes (`*.svelte.ts`) wrap a race for editing. `createViewModel` in `viewModels.svelte.ts` is the single race-to-view-model mapping. Components in `src/components` are per-type (`TimeKeeper*`, `Sprint*`).
- **Scoring (`src/lib/scoring`)**: `timekeeper.scoring.ts` has `ScoreKeeper`, which dispatches per checkpoint to format modules (`.ama`, `.brandx`) built on `timekeeper.scoring.base`. Invalid minutes/seconds yield score 0 with `invalid=true` rather than throwing. Sprint logic is in `SprintUtil.ts`.
- **Persistence (`src/db`)**: `store.ts` is the raw load/save interface, with a Capacitor `Filesystem` store (`races.json`) on native and `localStorage` on web. `database.ts` owns the schema. The file is wrapped as `{schemaVersion, data: {races}}`, with `CURRENT_SCHEMA_VERSION` and a `migrations` map (v→v+1). On load, `unwrapDB` runs the migrations and revives `Date`s. JSON can't store `NaN`, so it is saved as `null`, and the `revive*` functions turn `null` back into `NaN` for blank number inputs. When you change the stored shape, bump the version and add a migration.
- **Platform (`src/platform.ts`)**: `getRunMode()` returns `native`, `pwa` or `browser`.

## Tests

- `test/specs`: vitest unit tests for scoring, db migrations, sprint and view models.
- `cypress/e2e`: UI flows. `app_util.ts` and `timekeeper_util.ts` hold shared helpers.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`troysandal/timecard`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
