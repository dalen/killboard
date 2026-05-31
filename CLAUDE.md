# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A killboard / statistics frontend for the Return of Reckoning (Warhammer Online private server). It is a Vite + React 19 + TypeScript SPA that talks to a remote GraphQL API at `https://production-api.waremu.com/graphql` (configured in `src/index.tsx` and `codegen.ts`). There is no backend in this repo — everything is read-only queries against the production API.

## Commands

- `npm start` — Vite dev server on http://localhost:3000
- `npm run build` — production build to `./build`
- `npm run lint` / `npm run lint:fix` — oxlint with `--type-aware` over `src`
- `npm test` — full verification: `tsc -p .` (typecheck), then `vite build`, then `oxlint --type-aware src`. There is no unit test runner wired up despite the `@testing-library/*` deps — `npm test` is the typecheck+build+lint gate.
- `npm run codegen` — regenerate `src/__generated__/` from the live remote schema. Run this after editing any `gql` template in `src/**/*.{ts,tsx}`. `npm run codegen-watch` watches.

Path alias: `@/*` → `src/*` (see `tsconfig.json` and `vite.config.ts` `tsconfigPaths`).

## Architecture

**Routing.** `src/App.tsx` is the entire route table (`react-router` v7). Routes follow `/<entity>/:id[/<tab>]`; a single page component typically renders multiple tabs by accepting a `tab` prop (e.g. `<Character tab="kills" />`, `<Scenario tab="map" />`). When adding a tab, add a `<Route>` and extend the page's `tab` union — there is no nested-route layout.

**Data layer.** Apollo Client 4 (`@apollo/client`) with `InMemoryCache` and an `HttpLink` to the production GraphQL endpoint, wrapped in `<ApolloProvider>` in `src/index.tsx`. Pages and components import `gql` from `@apollo/client` and `useQuery` from `@apollo/client/react` (note the subpath). Query result types come from `@/__generated__/graphql` — never hand-write these; run `npm run codegen`.

**Codegen.** `codegen.ts` uses `@graphql-codegen/client-preset` with `fragmentMasking: false` and `gqlTagName: 'gql'`. It scans every `src/**/*.{ts,tsx}` for `gql` documents, so co-locating fragments next to the component that consumes them is the convention (e.g. `KILL_ATTACKER_FRAGMENT` exported from `src/components/kill/Attacker.tsx` and composed into the page query in `src/pages/Kill.tsx`). The generated `src/__generated__/` directory is committed.

**Component layout.** `src/pages/` are route-level components; `src/components/<entity>/` holds per-entity widgets (kill, guild, character, scenario, skirmish, instance_run, instance_statistics, storylineEntry, item, creature). `src/components/global/` has cross-cutting widgets (`ErrorMessage`, `QueryPagination`, `SearchBox`). Map rendering uses `simpleheat` via `src/components/Map.tsx` / `MapPositions.tsx` / `ZoneHeatmap.tsx`.

**Styling.** SCSS entrypoint `src/style.scss` (loaded from `src/index.tsx`), Bulma as the CSS framework, FontAwesome icons, plus per-component styles under `src/components/styles/`. `clsx` for class composition.

**i18n.** `react-i18next` configured in `src/i18n/config.ts`, with English resources in `src/i18n/en/{common,components,enums,pages}.json`. Use `useTranslation()` in components rather than inline strings.

**Analytics.** `src/App.tsx` declares a global `gtag` and fires `pageview` events on every `useLocation` change. The `gtag` script itself is injected elsewhere (likely `index.html`); the code is a no-op if `globalThis.gtag` is missing.

## Conventions worth knowing

- Always import `useQuery` / `useMutation` from `@apollo/client/react`, not `@apollo/client` directly — Apollo 4 split the React bindings into a subpath.
- The GraphQL `defaultScalarType` is `any` (see `codegen.ts`) and enums use native TS enums. Be defensive when consuming scalar fields whose runtime shape isn't obvious from the type.
- `lodash` is imported per-function (`import sortBy from 'lodash/sortBy'`) — keep that style so tree-shaking works.
- `date-fns` v4 for date formatting; prefer `format` / `formatISO` over ad-hoc string math.
- The project was migrated from Create React App to Vite (per README); if you see CRA-era artifacts, they are legacy.
