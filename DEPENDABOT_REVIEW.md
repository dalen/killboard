# Dependabot alert review and local remediation

Reviewed 2026-11-26 against the 38 open Dependabot alerts reported for `dalen/killboard`, the repository lockfile, npm's current advisory database, package paths, and the app source. The original 38 alerts covered 18 package families: 1 critical, 19 high, 16 moderate, and 2 low. Severity below is the highest severity among that package's alerts.

## Findings and disposition

| Package (alerts) | Highest severity | Path and exposure | Local disposition |
|---|---:|---|---|
| `shell-quote` (#126, #134) | Critical | `@graphql-codegen/cli` development tree only; not imported by app source or shipped in the static bundle. The critical command-injection case requires attacker-influenced object tokens passed through `quote()` and then to a shell. | Updated to 1.12.0, patched. Do not defer this merely because it is development-only. [GHSA-w7jw-789q-3m8p](https://github.com/ljharb/shell-quote/security/advisories/GHSA-w7jw-789q-3m8p) |
| `react-router` (#138–#141, #149) | High | Direct browser runtime dependency. App uses declarative `<Routes>`; it does not enable Framework Mode, SSR hydration, or unstable RSC APIs. | Updated to 7.18.7, patched. The mode-specific SSR/RSC issues were not reachable here; the in-range update also closes the broader open-redirect finding. |
| `i18next` (#177) | Moderate | Direct browser runtime dependency. Source search found no `addResourceBundle` calls. Advisory requires deep merge with overwrite enabled and attacker-controlled bundle data. | Updated to 26.7.2, patched. [GHSA-6jcc-5g8w-32mx](https://github.com/i18next/i18next/security/advisories/GHSA-6jcc-5g8w-32mx) |
| `immutable` (#135, #136) | High | Pulled through Sass during build and Relay/codegen in development; not application runtime code. | Updated to 5.2.1, patched. |
| `source-map-js` (#166) | High | Pulled through PostCSS/Vite and Sass during build; not shipped as app runtime code. | Updated to 1.2.4, patched. |
| `ws` (#129) | High | Installed as an optional WebSocket peer of GraphQL tooling/Apollo. Source search found no WebSocket transport use; the static browser app uses the HTTP GraphQL link. | Updated to 8.23.0, patched. |
| `@graphql-tools/utils` (#164, #172) | High | GraphQL Code Generator development tree. | Updated to 12.1.0 with its compatible Codegen toolchain, patched. |
| `@graphql-tools/executor-legacy-ws` (#173, #174) | High | GraphQL Code Generator development tree only. | Updated to 1.1.39, patched. |
| `@fastify/busboy` (#160, #163) | High | GraphQL Code Generator's `@whatwg-node` fetch dependency, development only. | Updated to 3.2.6, patched. |
| `js-yaml` (#132, #137, #148, #156) | High | GraphQL configuration/cosmiconfig development path. | Updated to 4.3.2, patched. |
| `brace-expansion` (#133, #159) | High | Development glob matching through `minimatch`. | Updated to 5.1.0, patched. |
| `postcss` (#142, #147) | High | Vite build/development tooling; no production server is deployed. | Updated to 8.5.33, patched. |
| `vite` (#167–#171) | High | Development server and CI build only; GitHub Pages deploys static `build/` output. | Updated to 8.4.0, patched. |
| `picomatch` (#116, #117) | Moderate | Build/development glob tooling (`@parcel/watcher`, Vite, test and codegen paths). | Updated instances to 2.3.2 / 4.0.7, patched. |
| `minimatch` (#175) | Moderate | `graphql-config` under GraphQL Code Generator, development only. | Remains at 10.2.6. See unresolved finding below. |
| `browserslist` (#153) | High | Babel/CSS browser target calculation during build, development tooling. | Updated to 4.29.6, patched. |
| `baseline-browser-mapping` (#155) | Moderate | Browserslist development/build metadata. | Updated to 2.11.40, patched. |
| `@babel/core` (#130) | Low | GraphQL tag plucking/codegen development tree. | Updated to 7.29.13, patched. |

## Unresolved safely

The remaining finding is `minimatch` 10.2.6 (moderate, development-only) through `graphql-config@5.1.8` → `@graphql-codegen/cli@7.4.6`. The patched `minimatch` line is 11.x, outside the parent package's `^10.0.0` range. `npm audit fix` proposes replacing the current Codegen 7.x line with `@graphql-codegen/cli@5.0.2`, a major downgrade; using `--force` would create that breaking change. No override or downgrade was applied. The app has no runtime path to this package.

Recommended next step: wait for a compatible `graphql-config`/Codegen dependency update, or evaluate a supported Codegen major migration and its schema/code-generation behavior in a separate change. Revisit only with a compatible upstream range or a tested compatibility plan.

## Verification and scope

- Applied only lockfile updates within the existing root dependency ranges; `package.json` is unchanged. No `--force` was used.
- Current `npm audit` reports 3 moderate findings, 0 high, 0 critical. `npm audit --omit=dev` reports 0 findings.
- `npm test` passed: TypeScript, Vite production build, and type-aware Oxlint. Existing Sass deprecation notices and the large JS chunk warning remain.
- Headless Chromium exercised `/`, `/search/Emissary`, `/guild-register`, and `/item-compare` at 1440, 768, and 390 pixels with no page exceptions or horizontal document overflow. `/creature/3` and `/quest/2` showed the new links at those same widths with the expected returned zone IDs and no overflow. The in-chat browser showed Wogghamouth in Ekrund and the populated Ekrund heatmap. Altdorf's linked heatmap correctly showed its no-recorded-kills state. An earlier exploratory `/zone_heatmap/1` smoke used an unverified ID and is not evidence of data completeness.
- Release commit `986dcef96ca8977a1602b88597602f5d15c3af66` was pushed to `main` and deployed successfully in [run 45933054161](https://github.com/dalen/killboard/actions/runs/45933054161). After the push, GitHub's Dependabot API still reported all 38 alert records open, including alerts whose vulnerable ranges no longer include the package versions in the deployed lockfile. Treat the remote alert state as pending alert/graph refresh and reconcile it before claiming those records are closed. The three moderate `minimatch` findings remain open and are documented above.
- After the subsequent approved push of `becd0eb5bbc9ba9f858628962d70da18bf33f698`, GitHub's push notice reported one remaining moderate alert. A fresh read of alert #175 confirms it is the development-only `minimatch` 10.2.6 dependency through `graphql-config@5.1.8` → Codegen, with patched `minimatch` 11.0.1 outside the parent's `^10.0.0` range. The three npm findings in the earlier audit correspond to a reduced remote alert state; retain the no-override/no-major-downgrade disposition and wait for a compatible upstream package update or separately validated migration.
