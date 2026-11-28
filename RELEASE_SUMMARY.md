# Latest deployed batch — shared debounced search

Status: deployed to Dalen's `main` in `2c76841e4e4a1544293a7e34dde93f9b139d9006` (`feat: debounce shared search`). GitHub Actions Build and Deploy run [46097367467](https://github.com/dalen/killboard/actions/runs/46097367467) succeeded.

## Scope

- Updated the shared search box so typed searches apply after 300ms, while Enter applies immediately. Search terms are URL-encoded.
- Kept the character and guild search fields mounted while results load, and restored keyboard focus when a homepage search navigates to its results route. Character search continues to query characters only.
- Creature name filtering now uses the same debounce while preserving its URL parameter. The character result count uses concise player-facing wording.
- No dependency or asset changes. The separate Dressing Room remains excluded; all 29 untracked `public/gear-preview/ui/` texture extracts remain untouched and excluded.

## Verification

- `npm test` passed (TypeScript, production Vite build and type-aware Oxlint); existing Sass deprecation, bundle-size and repository lint warnings remain. `git diff --check` passed.
- One headless Playwright instance verified the 300ms delay, retained focus, populated character search (`Mrak`, 115 substring matches), populated guild search (`Kingsmen`), Creature URL-filter synchronization, and browser back/forward behavior. Populated character results rendered without horizontal overflow at 1440×900, 768×1024 and 390×844. Screenshots: `%TEMP%\killboard-search-{desktop,tablet,phone}.png`.
- Production headless Chromium verified homepage debounce and focus transfer, populated Mrak character and Kingsmen guild results, browser back/forward, Creature URL-filter synchronization, and populated character search at 1440, 768 and 390px without horizontal overflow or page errors.
- The browser closed in `finally`; no personal desktop browser was used. The in-chat browser is unavailable in this session.

## Release state

The deployment contains four application/localization files plus these two checkpoint documents. Commit `2c76841` is on `origin/main`; the 29 untracked texture extracts remain preserved and excluded, and the Dressing Room remains excluded.

---

# Latest deployed batch — Live Event Calendar and Database menu

Status: deployed in commit `2b69023ea10b2de85755d980040bd4139d0388f7`; Build and Deploy run [46095228779](https://github.com/dalen/killboard/actions/runs/46095228779) succeeded. The calendar was introduced in `f41d9b7c574106ef7e7eeca9a5d3c29b0de122da`; copy refinement followed in `be034945f837d742b05cabbe0f576e756fd019a9`.

## Candidate scope

- Added `/events` using the existing Warhammer framed panel, Altdorf time formatter and Database navigation menu. The view shows active and upcoming events with local and server start/end times and a concise count. Error and empty states use plain player-facing wording.
- Alphabetized the Database menu and added the player-facing content standard to `AGENTS.md`; future copy should avoid developer-facing terms and redundant explanations.
- No dependency changes, new MYP assets or Dressing Room functionality are included. The 29 untracked `public/gear-preview/ui/` texture extracts remain excluded and preserved.
- Deployed source changes: `src/App.tsx`, `src/components/global/MainNav.tsx`, `src/i18n/en/pages.json`, `src/pages/Events.tsx`, and `src/pages/Events.scss`. Checkpoint documentation changes are in `CONTINUOUS_IMPROVEMENT.md` and this file.

## Verification

- `npm test` passed: TypeScript, Vite production build and type-aware Oxlint. Existing Sass deprecation and repository lint warnings remain; there were no errors.
- `git diff --check` passed.
- Production headless Chromium checks at 1440, 768 and 390px confirmed the alphabetical menu, 8 populated event rows, player-facing count, no horizontal overflow and no page errors. A cache-busted rerun was needed after one request returned a stale menu response. A simulated event-data failure showed a friendly retry message without exposing raw error details. Screenshot: `%TEMP%\\event-calendar-production-menu.png`.
- After a later user screenshot showed a fetch error, a targeted production recheck on 2026-11-27 loaded all 8 events with no failed requests or page errors; the reported failure did not reproduce.
- The known Playwright configuration was reused with one browser and sequential viewport checks; the browser closed in `finally`. The in-chat browser is unavailable in this chat, so no personal desktop browser was opened or controlled.

## Release state

The user-approved calendar and menu follow-up is deployed and production-verified. The 29 untracked `public/gear-preview/ui/` texture extracts remain excluded and untouched; no Dressing Room functionality or dependencies were included. Resume the queue with shared debounced search as a separate small batch.

---

# Latest deployed batch — Armory tooltips and Skirmish filters

Status: deployed after explicit approval in commit `8d0988dfbb1962477305a738d759abef90b834de` (`feat: refine Armory tooltips and skirmish filters`). GitHub Actions Build and Deploy run [46092546941](https://github.com/dalen/killboard/actions/runs/46092546941) succeeded.

## Candidate scope

- Armory equipment tooltips: 312px maximum width (304px at a 320px viewport), 68vh height cap, opaque black background, tighter readable spacing, viewport-clamped placement and no redundant native slot `title`. The shared authentic chain scrollbar appears when content overflows; in a constrained 320×568 headless render, the tooltip was 304×386px, content scrollHeight was 473px versus a 374px client area, the actual chain track/thumb textures rendered, and wheel scrolling moved the content 98px. Tooltip edges stayed within the viewport and the native scrollbar was hidden. Desktop and phone screenshots were captured in `%TEMP%`.
- Skirmish filters: replaced the generic controls with existing Warhammer filter/select components while retaining query behavior and URL state. On populated Mrak (#3207915), `type=rvr&minPlayers=12` returned 19 rows; selection updated the URL, browser back/forward restored the prior states, and refresh restored the selected labels and parameters. At desktop 1440×900, tablet 768×1024 and phone 390×844, all 19 records remained visible and document width matched viewport width; no client errors occurred.
- Guild Members production verification: Goblin Workers Union (#3936) rendered 470/470 members, 12 career composition entries and 25 table rows at 1440, 768 and 390px with no horizontal overflow or client errors. Career selection wrote `career=CHOSEN`; clearing returned to the base URL. This code is already deployed and is not a source change in this candidate.
- `AGENTS.md` records the known-working Windows Playwright import, browser binary and launch arguments for reuse after context compaction.
- No dependencies or production assets change in this candidate. The 29 untracked `public/gear-preview/ui/` texture extracts are preserved and excluded. The separate Gear Preview/Dressing Room remains excluded.

## Final checks

- `npm test` passed: TypeScript, production Vite build and type-aware Oxlint. Existing Sass deprecation notices, existing lint warnings and the large-bundle warning remain.
- `npm audit` still reports three Moderate development/transitive records for minimatch alert #175 through GraphQL Codegen. The suggested forced Codegen change is breaking; no override or forced dependency change was made. `npm audit --omit=dev` passed with zero production vulnerabilities.
- `git diff --check` passed. Production Playwright verification rendered the deployed Armory tooltip at 320×568 with visible chain textures and confirmed all seven scrollbar texture/arrow assets returned HTTP 200. The deployed Skirmish route rendered 19 populated filtered rows at 1440, 768 and 390px, with no page errors or horizontal overflow. Direct route document requests return HTTP 404 before the existing SPA fallback hydrates the app; the populated page works normally after hydration.
- Headless screenshots and checks used the existing Playwright installation and one browser at a time; every script closes the browser in `finally`. No personal desktop browser was used. The in-chat browser is unavailable in this session.

## Release state

The approved six-file source/documentation batch is committed and deployed. The current local branch `codex/database-page-fixes` and `origin/main` are synchronized at `8d0988dfbb1962477305a738d759abef90b834de`. Exactly 29 untracked texture extracts remain untouched and excluded. The local Vite server remains available on port 3002. Resume the next queue item, the assessed compact live-event calendar, as a separate small batch.

---

# Latest deployed release checkpoint — Guild Members

Status: `ca8f8e77a68587dbd84ead3165a22321a8b7c316` (`feat: style guild member roster with Warhammer controls`) is deployed to Dalen's `main`. GitHub Actions Build and Deploy run [46089078017](https://github.com/dalen/killboard/actions/runs/46089078017) succeeded. Production Guild Members verification is recorded in the candidate section above. The 29 untracked texture extracts remain local and preserved.

---

# Previous deployed release checkpoint — Kills section

Status: deployed to Dalen's `main` in `3199ad7348fd3d52909a47bb36e1846a039a6b37`; GitHub Actions Build and Deploy run [46084829887](https://github.com/dalen/killboard/actions/runs/46084829887) succeeded. The shared Scenarios form controls and approved button fix are already deployed in `0a0b452d2c3198bb2a5611deb1ef8d7f77a535f1` and are not being retested here. This approval applied only to this batch.

## Included in the deployed batch

- Shared Warhammer tabs across Kills, Recent Activity and Zone Comparison; compact filters and framed panels reuse approved components.
- Kills: reduced activity chart, compact career selector, thousands-formatted totals, realm-aware table entries and phone cards.
- Recent Activity: compact combat log with the approved heading typography and Details buttons, narrower Activity Type column, accessible activity and killer/victim career icons, clear selected counter state, deduplicated skirmish location, and consistent panel padding.
- Zone Comparison: zone labels without internal IDs, existing map thumbnails, common-scale themed bars, formatted combined/difference values and preserved API-backed date coverage and heatmap links.

## Verification and production state

- `npm test` passed on this source batch (TypeScript, production Vite build and Oxlint); existing Sass deprecation, generated-code lint and large-bundle notices remain. `git diff --check` passed.
- Local populated headless Playwright checks at 1440, 768 and 390px verified all three routes and shared tabs, responsive widths, Activity's 10-per-type display and 30 combined rows, 20 career icons, 30 compact Details actions, counter URL state across refresh/back/forward, Kills phone cards, populated Zone Comparison values, and no page errors or horizontal overflow.
- Production headless Playwright then checked all three live routes sequentially at 1440px. Kills showed 10 rows; Activity showed 30 rows and current counters; Zone Comparison showed Ekrund 1,635 and Kadrin Valley 1,784 (combined 3,419, difference 149, 9%). Each route showed the three shared tabs with the correct active state; there were no client errors or horizontal overflow. GitHub Pages returns HTTP 404 for direct routes before the existing SPA fallback hydrates the app and renders live data.
- Recent Activity desktop rows measure about 50px. The in-chat browser was unavailable in this chat after reset; required rendered checks were completed with headless Playwright without opening the personal desktop browser.
- No dependency files changed in this batch. The separate Gear Preview/Dressing Room remains excluded and untouched; the untracked `public/gear-preview/ui/` crop files remain excluded from any release staging.
- Next batch checkpoint: Guild Members Warhammer styling for Goblin Workers Union (#3936) is complete and verified locally. It is not committed or deployed and needs its own release approval. The live-event calendar assessment is queued as a separate batch after that release.

## Next queue assessment — Live event calendar

The current schema exposes `Query.events` without arguments and returns the common Event fields. A live read returned 8 events, 5 upcoming. The query works without selecting the historical problematic LiveEvent `id`. Recommendation: build a compact upcoming schedule with event types and server/local times, linked from the existing Database menu. The API offers no pagination, so display a coverage caveat if the response grows. Assessment only; no calendar code is included in the Guild Members batch.

---

# Previous follow-up release — shared Warhammer controls

Status: release candidate verified locally; approved for push and deployment. Previous production release and its evidence are preserved below. No dependency files changed in this follow-up.

## Included

- Shared Warhammer form controls, starting with Scenarios: authentic MYP combobox fields/arrows and menus, text/date entries, checkboxes/radios, and compact filter framing. Custom dates appear only for Custom range; Apply remains on the desktop filter row. Filtering and URL state are retained.
- Shared action-button rendering uses one complete MYP state image with the original fixed end caps and scalable center. The user visually approved the button design.
- Shared scroll pane focusability adjustment needed by the accessible filter menu.
- Updated AGENTS.md permanent MYP compositing and design-acceptance rules; updated the continuous-improvement queue.
- New production assets are isolated to public/images/warhammer/controls/.

## Explicitly excluded

- Separate Gear Preview / Dressing Room route, renderer, models, textures, features and dependencies. No experimental route or application code is part of this follow-up.
- Untracked `public/gear-preview/ui/` extraction/crop files are excluded from staging. The existing Armory's already approved shared UI assets are untouched.
- No dependency upgrades or package-lock changes.

## Verification

- `npm test` passed: TypeScript, production build and type-aware Oxlint. Existing Sass deprecation, generated-file lint and bundle-size warnings remain.
- `npm audit` reports the previously documented three Moderate development/transitive records for minimatch alert #175; the safe path remains deferred because the proposed forced Codegen downgrade is breaking. No override or forced upgrade was introduced. `npm audit --omit=dev` reports zero vulnerabilities.
- `git diff --check` passed; all ten new Warhammer control assets appear in the production build with matching filename case.
- Headless Playwright verified populated Mrak Scenarios (114 matches), custom date bounds, URL-backed type/tier filters, keyboard selection, compact expanded menu, and preset/custom date visibility. The guild Premade Only checkbox adds/removes its URL parameter. Desktop 1440x1000, tablet 768x1024 and phone 390x844 layouts show no horizontal overflow; the phone option menu fits its viewport.
- The user has accepted the action-button design. The earlier Armory scrollbar interaction is user-confirmed and was not modified by this batch.

## Deployment

Deployed to Dalen's `main` as `0a0b452d2c3198bb2a5611deb1ef8d7f77a535f1`. GitHub Actions Build and Deploy run [46080764607](https://github.com/dalen/killboard/actions/runs/46080764607) succeeded. Production headless verification loaded the deployed bundle and 114 populated Mrak matches, confirmed preset dates hidden/custom dates revealed, no page errors, and no horizontal overflow at desktop (1440px), tablet (768px) or phone (390px). The production SPA fallback returns HTTP 404 for a direct route document request while the app hydrates and works normally; record this existing hosting behavior as a routing caveat, not an application failure.

---

# Current release — deployed

Status: deployed to Dalen's `main` after explicit approval on 2026-11-27. Application release commit: `c60f0b14bef6cd8235d44341e0604c6cf169e3d9` (`feat: release compact Warhammer profile and Armory updates`). GitHub Actions Build and Deploy run [46076658075](https://github.com/dalen/killboard/actions/runs/46076658075) completed successfully with the expected head SHA. A documentation-only follow-up records completed production verification and release status.

## Candidate contents

### Included — Killboard and shared Warhammer UI

- Shared compact character identity and framed tab navigation across Kills, Scenarios, Skirmishes and Armory; complete MYP tab-state textures eliminate the black seams at 75%, 80%, 100%, 125%, 150%, 175% and 200% browser zoom.
- Compact guild identity and framed tabs; Kingsmen overview, kills, members, scenarios and skirmishes show populated data. Header alignment remains stable, the emblem stays anchored while the description expands, and desktop/tablet/phone layouts have no horizontal overflow.
- Expanded full-width Armory paper doll with authentic empty-slot art, rarity-colored item names, bounded equipment tooltips and reusable MYP chain scrolling. The visible scrollbar was captured at top/middle/bottom; the user confirms its Armory interaction works.
- Shared MYP action buttons, including complete normal, hover, pressed and disabled artwork; compact table actions and Browse Guilds fit their labels.
- Equipment Compare improvements, API-backed Players result count, character-only search and 25-row defaults for the relevant character lists and Recent Kills.
- Item-to-creature/quest related links and Warhammer scroll panes for long item relation lists.
- Approved compatible `react-i18next` 17.0.16 and Prettier 3.9.10 updates, with `package-lock.json` refreshed against this codebase.
- Localization fixes, render-key warning fixes, `AGENTS.md` release workflow rules and updated queue/security documentation.

### Explicitly excluded — separate Gear Preview / Dressing Room feature

- The separate checkout is `C:\Users\Trevor\.codex\worktrees\gear-preview-emissaryx\killboard-emissaryx` (HEAD `a23660cc5d761563ab87a446632703328cb0b8f7`); this candidate checkout is `C:\Users\Trevor\Documents\Codex\2026-11-24\killboard\work\dalen-killboard-release` on `codex/database-page-fixes`.
- Excluded are its `/character/:id/gear-preview` route and navigation/tab entry, 3D renderer and models, Gear Preview components/materials/dyes, model assets, and `three`, `@react-three/fiber` and `@react-three/drei` dependencies. These changes remain in the separate checkout untouched.
- The only `public/gear-preview/` content staged for this release is 49 PNG UI assets referenced by the existing Killboard Armory, authentic window/tab/button/chain artwork, and empty equipment slots. They are shared UI resources, not character-model assets. The 29 unreferenced MYP extraction/crop files remain unstaged and local. The production build contains no Gear Preview route or feature component, and this candidate adds no Gear Preview dependencies.
- Some files also changed in both checkouts (`Character.tsx`, `CharacterItemPopup.tsx`, `enums.json`, package manifests/lockfiles and the asset directory). The candidate contains only its own profile/Armory/tooltip/translation changes and two approved dependency updates; no route, renderer or 3D dependency was copied over. Keep the other checkout's implementation intact.

## Release verification

- `npm test`: passed on the exact candidate after the final render-key fix (TypeScript, production Vite build and type-aware Oxlint). Existing Sass deprecation, generated-type/lint warning and large-chunk notices remain.
- `npm audit`: three Moderate records, all the same development-only `minimatch` #175 advisory. The dependency path is Codegen → `graphql-config` → `minimatch`; npm's suggested fix is a breaking Codegen downgrade. No override or forced change was made.
- `npm audit --omit=dev`: passed, zero production vulnerabilities.
- `git diff --check`: passed. Asset filename/path casing and build-copy checks passed for the Killboard's shared UI assets. No unfinished Dressing Room route or renderer was found in this candidate's source/build.
- Populated routes were checked with headless Playwright: character Kills, Scenarios, Skirmishes and Armory; all five Kingsmen guild tabs; Players, Recent Kills, Browse Guilds, Item Compare and related item pages. Guild/character responsive checks covered desktop, tablet and phone. Character and guild tab artwork also passed the actual zoom levels listed above. There were no application page errors or horizontal overflows.
- Gear bonus values were independently recomputed from the live Armory GraphQL result by summing equipped-item stats, talismans and active ItemStat set bonuses. The computed values matched every displayed stat. `Critical Damage Taken Reduction` is translated.
- The local Vite server remains available on port 3002. No authenticated or personal desktop browser was used.

## Production deployment verification

- GitHub Actions run 46076658075 completed with `conclusion: success`; deployed SHA matches `c60f0b14bef6cd8235d44341e0604c6cf169e3d9`.
- Headless Chromium verified populated live character Kills (50 rows), Scenarios (25), Skirmishes (25), and Armory (23 equipment slots); all five Kingsmen guild tabs loaded, including Kills (20), Scenarios (15) and Skirmishes (15). Tablet and phone passes confirmed the requested tabs and populated records with no horizontal overflow. No application page errors or failed shared UI asset requests were reported.
- The initial broad route sweep observed `/guild-register` during a transient GraphQL error and `/search/Emissary` before results settled. A focused retry waited for live data: Guild Register rendered 25 populated guild rows, and Players search rendered 8 matching characters returned by the API. Both completed without browser errors.
- PR #1081 (`react-i18next` 17.0.16) and #1077 (Prettier 3.9.10) were incorporated in the release, passed candidate verification, and were closed with explanatory comments after deployment verification. Alert #175 remains documented development-only maintenance.

## Release size and repository state

- 91 release files: 36 modified tracked files and 55 new files (49 referenced PNG UI assets and 6 source/style files). The 29 unreferenced PNGs are preserved locally and excluded from the release.
- Text changes: 2,440 insertions and 537 deletions; binary asset bytes are excluded from line counts.
- At application deployment, local `codex/database-page-fixes` and `origin/main` both resolved to `c60f0b14bef6cd8235d44341e0604c6cf169e3d9` (0 ahead / 0 behind). The 29 unreferenced extracted/cropped PNGs remain untracked and preserved locally; they were not included or staged. A documentation-only follow-up records this release verification.
- Known maintenance item: development-only Moderate Dependabot alert #175. The site-wide Warhammer filters/forms work remains deferred to the next batch. Other pending independent queue items and API-specific blockers remain listed in `CONTINUOUS_IMPROVEMENT.md`.

## Next batch

The site-wide Warhammer filter/form redesign is the next feature batch, starting from Scenarios. It is not part of this deployed release. Keep future changes local until a new release approval. The separate Gear Preview checkout and experimental feature remain excluded and untouched.

---

# Previously deployed release review summary

Status: released to `main` on 2026-11-27 after explicit user approval. Release commit: `986dcef96ca8977a1602b88597602f5d15c3af66`. GitHub Pages deployment succeeded in [run 45933054161](https://github.com/dalen/killboard/actions/runs/45933054161).

## Track A — dependency security

### Current Dependabot reconciliation (2026-11-27)

- GitHub Dependabot has reconciled the deployed updates: open alerts fell from 38 to 1. Alert #175 is the remaining Moderate, Development, Transitive `minimatch` globparts-amplification denial-of-service alert.
- `npm explain minimatch` confirms `@graphql-codegen/cli@7.4.6` → `graphql-config@5.1.8` → `minimatch@10.2.6`; `graphql-config` requires `^10.0.0`. Patched `minimatch` 11.0.1 is outside that range. npm's proposed Codegen 5.0.2 remedy is a major downgrade. No overrides or forced dependency changes were introduced.
- `npm audit --omit=dev` reports zero vulnerabilities. Reconciliation is complete; retain #175 as a maintenance item pending compatible upstream support or a separately tested Codegen migration.

- Scope: compatible dependency updates in `package-lock.json`; root `package.json` is unchanged.
- Reviewed baseline: 38 Dependabot alerts (1 critical, 19 high, 16 moderate, 2 low) across 18 package families. Critical/high findings and other safely patchable findings were resolved with in-range updates.
- Verification: `npm audit --omit=dev` reports zero findings. Alert #175 remains in the development-only `minimatch` path (`graphql-config@5.1.8` → Codegen); no unsafe override or major downgrade was applied. See `DEPENDABOT_REVIEW.md` for severity, exposure and follow-up.
- Historical note: GitHub temporarily continued to show 38 records open after the first deployment; after the later approved scenario release it reported one open alert. The latest Dependabot reconciliation confirms the 37 patched alerts are now closed and only #175 remains.
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

Both tracks were included in the approved release. The local development server remains available on port 3002. Dependabot reconciliation is complete: only alert #175 remains, intentionally retained pending a compatible upstream dependency update or separately validated Codegen migration. No further release action is authorized by this summary.
