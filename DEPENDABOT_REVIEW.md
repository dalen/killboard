# Dependabot alert review and local remediation

Reviewed 2026-11-26 against the 38 open Dependabot alerts reported for `dalen/killboard`, the repository lockfile, npm's current advisory database, package paths, and the app source. The original 38 alerts covered 18 package families: 1 critical, 19 high, 16 moderate, and 2 low. Severity below is the highest severity among that package's alerts.

## Current reconciliation — 2026-11-27

GitHub Dependabot now reports 1 open alert, down from 38. Alert #175 is the only remaining record: Moderate, Development, Transitive, for `minimatch` potential denial of service via globparts amplification. No dependency files were changed for this reconciliation. The local lockfile still resolves the same documented path and semver conflict below; `npm audit --omit=dev` currently reports zero production vulnerabilities. This reconciliation is complete; retain #175 as a development-tooling maintenance item.

### Open Dependabot pull requests — reviewed 2026-11-27

The five remaining open PRs were compared with the current checkout's `package.json` and `package-lock.json`, their proposed lockfiles, and their failed GitHub Actions build logs. None was modified or merged. The PR lockfiles were generated from older base revisions and would replace newer locked versions, so do not merge them as submitted.

| PR | Proposed update and current lock | CI failure | Recommendation |
|---|---|---|---|
| [#1081](https://github.com/dalen/killboard/pull/1081) | `react-i18next` 17.0.8 → 17.0.16; transitive `html-parse-stringify` 3.0.1 → 4.0.1. Used by app runtime imports (`useTranslation`, `initReactI18next`). The proposed branch lock also carries older Codegen/Vite/minimatch entries than the current lock. | Oxlint rejects three existing default-value rules in `ZoneHeatmap.tsx:9`, `SkirmishList.tsx:16`, and `KillsList.tsx:16`; TypeScript/build pass before lint in the `npm test` sequence. | Approved local update: manifest range now starts at `^17.0.16`, lockfile resolves 17.0.16 and html-parse-stringify 4.0.1. Keep PR open until the local update is released and production-verified, then reconcile/close it. |
| [#1080](https://github.com/dalen/killboard/pull/1080) | GraphQL Codegen CLI 7.4.6 → 8.0.0, client preset 6.2.3 → 7.0.0, TypeScript plugin 6.1.2 → 7.0.1, and `graphql-config` 5.1.8 → 6.0.0. All are development tooling. The PR lock still resolves `minimatch` 10.2.6, exactly the version in the current vulnerable path; it does not fix #175. | Oxlint reports the same unused `isMobile` in `InstanceRun.tsx:205` as #1075. | Closed with comment by user approval on 2026-11-27; Codegen 8 remains deferred maintenance, not a security fix. Current GraphQL 16.14.1 satisfies its GraphQL peer, but Codegen 8 drops GraphQL 14/15, requires Node >=22.18, changes generated-output behavior, and workflow specifies floating `22.x`. Review/pin Node and generated output before a future migration. |
| [#1079](https://github.com/dalen/killboard/pull/1079) | Vite 8.0.16 → 8.3.4. Current lock already has Vite 8.4.0; the proposal is superseded, and its branch lock would downgrade Vite. Development/build only. | Oxlint reports the same three existing default-value errors as #1081. | Closed with comment by user approval on 2026-11-27; already superseded, no dependency change. |
| [#1077](https://github.com/dalen/killboard/pull/1077) | Prettier 3.8.3 → 3.9.10; development-only. | Oxlint reports the same three existing default-value errors as #1081. | Approved local update: manifest remains on `^3`, lockfile resolves 3.9.10. Keep PR open until release/production verification, then reconcile/close. |
| [#1075](https://github.com/dalen/killboard/pull/1075) | Testing Library: `jest-dom` 6.9.1 → 8.0.0, React 16.3.2 → 16.3.3, and `user-event` 14.6.1 → 14.6.13. The manifest currently declares these in `dependencies`, but no application source imports them and `npm test` does not run a Testing Library suite. `jest-dom` 8 requires Node >=22 and adds an optional Vitest 5 peer. | Oxlint reports the unused `isMobile` in `InstanceRun.tsx:205`, unrelated to these packages. | Closed with comment by user approval on 2026-11-27; test-suite dependency upgrades remain unnecessary until the repository adopts them. |

The observed PR build failures are lint findings in source at those PR revisions, not failures caused by the package updates. Netlify deploy-preview checks were neutral/successful and do not establish that the GitHub build passed. No dependency update has been proposed for merge. Alert #175 remains open; Codegen 8's proposed lock confirms it remains at minimatch 10.2.6.

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

## Remaining maintenance item — no safe in-range fix

Alert #175 concerns `minimatch` 10.2.6 (Moderate, development-only, transitive) through `graphql-config@5.1.8` → `@graphql-codegen/cli@7.4.6`. `npm explain minimatch` confirms the installed path; the parent declares `minimatch@^10.0.0`. Current npm advisory data identifies the globparts amplification DoS and a patched `minimatch` version beginning at 11.0.1, outside that supported range. `npm audit` offers `@graphql-codegen/cli@5.0.2` as a major downgrade, not a safe in-range remediation. No override, forced update or downgrade was applied. This package is not on the app runtime dependency path.

Recommended next step: wait for a compatible `graphql-config`/Codegen dependency update, or evaluate a supported Codegen major migration and its schema/code-generation behavior in a separate change. Revisit only with a compatible upstream range or a tested compatibility plan.

## Verification and scope

- The user-approved local `react-i18next` 17.0.16 and Prettier 3.9.10 updates are now in both `package.json` and the refreshed lockfile. No unrelated direct dependency updates, Codegen override, forced upgrade, or downgrade was introduced.
- Current `npm audit` reports three moderate package entries that all represent the same remaining development-only `minimatch` #175 advisory through `graphql-config`/Codegen; `npm audit --omit=dev` reports 0 findings. The recommended npm fix is a breaking Codegen downgrade and was not applied.
- `npm test` passed: TypeScript, Vite production build, and type-aware Oxlint. Existing Sass deprecation notices and the large JS chunk warning remain.
- Headless Chromium exercised `/`, `/search/Emissary`, `/guild-register`, and `/item-compare` at 1440, 768, and 390 pixels with no page exceptions or horizontal document overflow. `/creature/3` and `/quest/2` showed the new links at those same widths with the expected returned zone IDs and no overflow. The in-chat browser showed Wogghamouth in Ekrund and the populated Ekrund heatmap. Altdorf's linked heatmap correctly showed its no-recorded-kills state. An earlier exploratory `/zone_heatmap/1` smoke used an unverified ID and is not evidence of data completeness.
- Historical reconciliation: after release commit `986dcef96ca8977a1602b88597602f5d15c3af66` and deployment run 45933054161, GitHub temporarily still showed all 38 records open. After the later approved push of `becd0eb5bbc9ba9f858628962d70da18bf33f698`, GitHub reported only alert #175. Current count is 1 open alert; the previously patched records have since reconciled/closed. The remaining alert matches the same `minimatch` path and range conflict described above.
