# Killboard

A killboard and statistics frontend for [Return of Reckoning](https://www.returnofreckoning.com/), the Warhammer Online: Age of Reckoning private server. The app is a read-only SPA that visualizes kills, scenarios, skirmishes, guilds, characters, items, quests, instance runs, storylines and zone heatmaps by querying the public RoR GraphQL API.

Live API: `https://production-api.waremu.com/graphql`

## Tech stack

- [Vite](https://vitejs.dev/) + React 19 + TypeScript
- [Apollo Client 4](https://www.apollographql.com/docs/react/) against the RoR GraphQL endpoint
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) (`client-preset`) for typed queries
- [react-router](https://reactrouter.com/) v7
- [Bulma](https://bulma.io/) + SCSS, [FontAwesome](https://fontawesome.com/) icons
- [react-i18next](https://react.i18next.com/) for translations
- [simpleheat](https://github.com/mourner/simpleheat) for zone heatmaps
- [oxlint](https://oxc.rs/docs/guide/usage/linter.html) for linting

## Getting started

```sh
npm install
npm start          # dev server on http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Vite dev server with HMR on port 3000 |
| `npm run build` | Production build to `./build` |
| `npm run lint` | Run oxlint with `--type-aware` over `src` |
| `npm run lint:fix` | Same, auto-fixing where possible |
| `npm test` | Full gate: `tsc -p .` typecheck → `vite build` → oxlint |
| `npm run codegen` | Regenerate `src/__generated__/` from the live remote schema |
| `npm run codegen-watch` | Same, in watch mode |

Run `npm run codegen` after adding or editing any `gql` template — generated types live under `src/__generated__/` and are committed.

## Project layout

```
src/
  App.tsx              Route table (react-router v7)
  index.tsx            Entry point: Apollo client + providers
  pages/               Route-level components (one per entity, tabs via prop)
  components/
    <entity>/          Per-entity widgets (kill, guild, character, …)
    global/            Cross-cutting widgets (ErrorMessage, QueryPagination, SearchBox)
    styles/            Per-component SCSS
  hooks/               Reusable React hooks
  i18n/                react-i18next config and English resources
  __generated__/       Generated GraphQL types (do not edit)
  style.scss           SCSS entrypoint
```

The path alias `@/*` maps to `src/*` (see `tsconfig.json`).

## Conventions

- GraphQL fragments are co-located with the component that consumes them and composed into the page-level query — see `src/components/kill/Attacker.tsx` and `src/pages/Kill.tsx` for the pattern.
- Import the React Apollo bindings from the subpath: `import { useQuery } from '@apollo/client/react'`.
- Import lodash per-function (`import sortBy from 'lodash/sortBy'`) to keep bundles small.
- Use `useTranslation()` from react-i18next rather than hard-coding strings; add new keys under `src/i18n/en/`.

## Notes

- This project was migrated from Create React App to Vite.
- There is no backend in this repository — all data comes from the public RoR GraphQL API.
- Page views are sent to Google Analytics via `gtag` if the script is present on the page.
