# Local release review summary

Status: released to `main` on 2026-11-27 after explicit user approval. Release commit: `986dcef96ca8977a1602b88597602f5d15c3af66`. GitHub Pages deployment succeeded in [run 45933054161](https://github.com/dalen/killboard/actions/runs/45933054161).

## Track A — dependency security

- Scope: compatible dependency updates in `package-lock.json`; root `package.json` is unchanged.
- Reviewed baseline: 38 Dependabot alerts (1 critical, 19 high, 16 moderate, 2 low) across 18 package families. Critical/high findings and other safely patchable findings were resolved with in-range updates.
- Verification: `npm audit --omit=dev` reports zero findings. Three moderate findings remain in the development-only `minimatch` path (`graphql-config@5.1.8` → Codegen); no unsafe override or major downgrade was applied. See `DEPENDABOT_REVIEW.md` for package paths, severity, exposure, and recommended upstream follow-up.
- After deployment, GitHub's Dependabot API still reported the 38 alert records as open. The pushed `package-lock.json` contains patched versions for the addressed packages, while GitHub's alert records still identify their older vulnerable ranges. Treat remote alert state as pending refresh/reconciliation; do not report those records cleared. Continue to preserve the three moderate development-only findings as described in the audit.
- This track does not include Phase II UI work.

## Track B — Phase II player-facing improvements

- Scope includes existing local creature/quest location heatmap links and the new `/zone-comparison` feature, with navigation from the existing Kills area and zone heatmaps.
- The comparison requests two selected zone counts in one bounded GraphQL operation using the same UTC window (24 hours, 7 days, or 30 days). It displays exact date coverage, recorded player-kill event counts, and links to each zone heatmap.
- Live sample reviewed: Ekrund (#6) and Praag (#105), last seven days. Their comparison totals matched the corresponding bounded zone heatmaps when queried. Counts represent recorded player-kill events, not unique players or faction strength.
- Limitation: public API does not expose canonical campaign-pairing membership or campaign outcomes. The page compares only the zones the player selects. It makes no campaign-result claim.
- Verification: in-chat browser showed populated data. Headless Playwright checked 1440×900, 768×1024, and 390×844; route navigation, URL-backed controls, date period changes, heatmap links, page errors and horizontal overflow. TypeScript, production Vite build, Oxlint, and `git diff --check` passed. Existing Sass deprecations, large bundle notice, and baseline lint warnings remain.
- Production verification: opened the existing Kills navigation, then Zone Comparison. The deployed page rendered the UTC coverage and populated counts (Ekrund 1,791; Praag 19,288 at verification time), plus both heatmap links and the campaign-data limitation.
- This track does not change the dependency finding disposition.

## Review disposition

Both tracks were included in the approved release. The local development server remains available on port 3002. Three moderate development-tooling findings are intentionally retained pending a compatible upstream dependency update or separately validated Codegen migration. The remote Dependabot records still need reconciliation after their refresh; no further release action is currently authorized.
