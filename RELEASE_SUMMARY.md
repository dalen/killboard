# Local release review summary

Status: prepared locally for review on 2026-11-26. No commit, push, merge, or deployment has occurred. Review the two tracks independently before approving any release.

## Track A — dependency security

- Scope: compatible dependency updates in `package-lock.json`; root `package.json` is unchanged.
- Reviewed baseline: 38 Dependabot alerts (1 critical, 19 high, 16 moderate, 2 low) across 18 package families. Critical/high findings and other safely patchable findings were resolved with in-range updates.
- Verification: `npm audit --omit=dev` reports zero findings. Three moderate findings remain in the development-only `minimatch` path (`graphql-config@5.1.8` → Codegen); no unsafe override or major downgrade was applied. See `DEPENDABOT_REVIEW.md` for package paths, severity, exposure, and recommended upstream follow-up.
- This track does not include Phase II UI work.

## Track B — Phase II player-facing improvements

- Scope includes existing local creature/quest location heatmap links and the new `/zone-comparison` feature, with navigation from the existing Kills area and zone heatmaps.
- The comparison requests two selected zone counts in one bounded GraphQL operation using the same UTC window (24 hours, 7 days, or 30 days). It displays exact date coverage, recorded player-kill event counts, and links to each zone heatmap.
- Live sample reviewed: Ekrund (#6) and Praag (#105), last seven days. Their comparison totals matched the corresponding bounded zone heatmaps when queried. Counts represent recorded player-kill events, not unique players or faction strength.
- Limitation: public API does not expose canonical campaign-pairing membership or campaign outcomes. The page compares only the zones the player selects. It makes no campaign-result claim.
- Verification: in-chat browser showed populated data. Headless Playwright checked 1440×900, 768×1024, and 390×844; route navigation, URL-backed controls, date period changes, heatmap links, page errors and horizontal overflow. TypeScript, production Vite build, Oxlint, and `git diff --check` passed. Existing Sass deprecations, large bundle notice, and baseline lint warnings remain.
- This track does not change the dependency finding disposition.

## Review disposition

Both tracks remain uncommitted and local. The development server remains available on port 3002. Three moderate development-tooling findings are intentionally retained pending a compatible upstream dependency update or separately validated Codegen migration. No release action is authorized by this summary.
