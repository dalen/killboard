# Killboard Project Instructions

## Browser verification

- Use headless Chromium and Playwright for routine automated browser verification. The user does not need to watch routine testing.
- Run no more than one project-owned headless browser instance at a time, and keep viewport cases sequential inside that instance. Playwright scripts must close the browser in `finally`, including failed assertions and timeouts. Before terminating a Chrome for Testing process, confirm its executable, profile, parent and owning project; never terminate the user's Chrome or another development session.
- Do not force SwiftShader for visual checks by default. Inspect Chromium's GPU/WebGL capabilities and use hardware acceleration when available; if the environment requires software rendering, record that fact and preserve screenshot fidelity. Disable continuous character animation only for static captures where animation is not under test.
- When a task requires an authenticated route, first check whether an authorized browser session can be reused securely.
- If manual authentication is required, use the in-chat browser. Never launch, control, resize, or interfere with the user's desktop browser; if in-chat authentication is unavailable, explain that and continue independent work.
- Reuse authenticated sessions where supported to avoid repeatedly requesting login.
- Never expose credentials, authentication tokens, or session cookies in logs, source code, screenshots, or project documentation.
- Never commit browser authentication state to the repository.
- If authentication blocks one task, continue other independent tasks where practical. Treat authentication as a project-wide blocker only when it prevents all remaining work.
- Known working headless Playwright setup for this Windows checkout (verified 2026-11-27): from a `.cjs` script, load `chromium` with `require('C:/Users/Trevor/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core')`; launch with `headless: true`, `executablePath: 'C:/Users/Trevor/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe'`, and `args: ['--enable-gpu', '--use-gl=angle']`. Keep one browser instance, run viewport checks sequentially, and close it in `finally`. Reuse this exact setup instead of importing `playwright` from the project or searching other package directories. If the recorded path is no longer present, inspect recent successful Killboard scripts for the updated path before changing the setup.

## Player-facing feature review

- For newly implemented player-facing features, open each populated local route in the in-chat browser so the user can review and interact while development continues. Do not wait for approval between features unless a decision is required; apply visual feedback as steering and follow the current checkpoint.
- Keep the local development server running throughout development so the user can independently review changes. Continue headless Playwright for automated behavior, screenshots, responsive and regression checks. Never commit browser auth state or expose credentials.
- Never open, control, resize, or interfere with the user's personal desktop browser during development. Use the in-chat browser for interactive previews; if it is unavailable, use headless Playwright screenshots/checks and state that limitation.
## Change verification

- Verify the rendered route and populated behavior; a passing build alone does not establish that a UI change works.
- Include phone and tablet viewport checks in the implementation task for responsive UI work.
- Do not push, merge, or deploy without fresh explicit user approval.

## Small, frequent releases

- Prepare a release after one substantial feature or two to three related smaller improvements.
- Reevaluate release readiness every 30–45 minutes of active implementation; do not accumulate hours of unrelated uncommitted work.
- Complete functional, visual, desktop, tablet and mobile verification as each feature is implemented.
- Maintain `RELEASE_SUMMARY.md` incrementally and keep a running inventory of verified changes and outstanding defects.
- Reuse valid verification evidence when later changes have not affected the tested behavior. Run the final required release pipeline against the exact release candidate.
- Keep major experimental features, including the Dressing Room, isolated in separate branches and checkouts. Do not let an unfinished feature indefinitely delay independently verified improvements; preserve unfinished work safely for a later release.
- Request explicit approval before pushing to `main` or deploying. After deployment, verify production and immediately resume the development queue.
- Aim for smaller, safer and faster releases, less repeated testing, lower context use and easier rollback.

## Player-facing design preference

- Prioritize usable screen space. Keep character headers, navigation and decoration compact so they do not unnecessarily push primary content down the page.
- When recreating the original Warhammer interface, prioritize authentic MYP textures and UI definitions over approximations.
- Keep the homepage compact and data-focused. Do not add duplicate navigation sections, unnecessary introductions, or oversized low-value cards that push player data down the page.
- Put new features in a logical existing navigation item or dropdown. Do not add duplicate links or a second navigation menu when the top-level navigation or a feature's existing page already provides access.
- Treat “Explore the Killboard” homepage shortcuts as a rejected design; do not reintroduce them. Keep newly added routes accessible through the existing navigation hierarchy.
- For character Armory and dressing-room paper dolls, reuse the local game slot art in `public/gear-preview/ui/empty/` and `slot-frame.png`; do not substitute unrelated item icons for empty slots. Keep the equipment view narrow, show equipped item names in their rarity/set colors, and center the gear-stat panel between the slot columns.
- Use one shared horizontal character identity header on Kills, Scenarios, Skirmishes and Armory. Keep it about 70–90px high on desktop and responsive on smaller screens; preserve the character emblem, career icon, level, renown, and guild link. Keep the framed character tabs directly below it in the same position on every tab, and remove duplicate identity blocks inside Armory.
- Let character pages use their available width. Keep filters, cards, vertical margins and padding compact so identity/navigation do not push primary records down the page.
- Keep Armory item hover details anchored beside the hovered slot. Prefer the side with room, flip at viewport edges, and clamp position/size so the card stays visible; do not move it to a remote column solely to avoid covering the center.
- Keep equipment tooltip text and icons at their normal readable sizes. Let the tooltip use the available viewport height and a compact wider width, clamped to screen edges, so long item details fit without a scrollbar when possible. Keep the chain scroll control as a fallback only when content exceeds the full available viewport; do not scale text or icons down to fit.
- Use the reusable `WarhammerScrollPane` for the Armory stats panel and every scrollable equipment tooltip. Its visuals must use the exact `EA_ScrollBar_DefaultVerticalChain` slices from `E:\Warhammer Things\gitlab\Data\INTERFACE.MYP\interface\default\eatemplate_defaultwindowskin\textures\EA_Shared01_32b.dds`, as defined in `defaultskintextures.xml` and `source\defaultscrollbar.xml`: 22px chain gutter, 14px segmented thumb offset 5px, 5×20 nubs and 26px directional buttons with normal/hover/pressed states. Preserve wheel, drag, arrow, keyboard and touch scrolling; hide the custom control when content fits and hide the browser scrollbar. Avoid utility class names such as Bulma `is-hidden` for its visibility state because global `display:none` collapses geometry needed for overflow measurement. Compare rendered screenshots with the original MYP slices; an asset URL alone does not prove the chain is visible.
- Use the same MYP's `EA_Window_DefaultFrame` nine-slice for the Armory paper-doll and stats boxes, with the in-game black translucent fill. Draw only its frame edges; the atlas area inside the frame contains unrelated controls and must not be stretched into the panel. Prefer source game textures for other Armory box chrome over hand-drawn CSS borders.
- For site-wide action buttons, use `EA_Button_DefaultResizeable` and its normal/rollover/pressed/disabled states from `EA_Shared01_32b.dds`, mapped by `eatemplate_defaultwindowskin/textures/defaultskintextures.xml` and `source/defaultbutton.xml`. Preserve the original 27px left/right caps and 39px height; resize only the 76px center span as `HorizontalResizeImage` does. Never center/repeat the middle slice over the caps. `EA_Button_DefaultPregameResizeable` is a large pregame control and `EA_Button_Tab` is navigation chrome; neither replaces the standard action template. Keep table actions compact, retain semantic button/link behavior and visible keyboard focus, and do not style ordinary text links as buttons. Use the original dark inset, metal frame and gold text rather than generic gradients or flat fills. Before implementation, compare full native-size states and resized output against MYP sources; after implementation, visually inspect the rendered result.
- Prevent seams in all MYP controls at fractional browser zoom: reconstruct each interaction state into one complete, seamless PNG from the original atlas/template slices, then paint it as a single CSS `border-image` using the source's fixed cap/slice dimensions and resize behavior. This is the proven navigation-tab fix. Do not independently position neighboring background slices or layer separate pieces whose fractional rounding can reveal a black gap. Keep labels in their own foreground layer above the artwork. Inspect both source-state PNGs and rendered controls at 75%, 80%, 100%, 125%, 150%, 175% and 200% zoom; compilation and a 100% screenshot alone are not evidence of seam-free rendering.

## Site-wide Warhammer filters and form controls

- Inspect the actual INTERFACE.MYP Lua/XML templates and atlas coordinates before styling. Build shared controls for selects and menus, text/search fields, dates/calendars, checkboxes/radios and filter panels; preserve browser keyboard, focus, touch and semantic behavior.
- Use MYP artwork only where a matching game control exists. Style web-only controls such as calendar pickers in a complementary Warhammer treatment without claiming an authentic game asset. Keep filters compact, place Apply beside controls on desktop when it fits, and avoid showing custom date fields when a preset makes them redundant.
- Verify normal, hover, focus, expanded/selected and disabled states at desktop, tablet and phone widths. Compare rendered output with source atlases to catch seams, clipping and incorrect stretching.
- Once the user has visually approved a design and its required functional and responsive checks pass, consider it accepted. Do not repeatedly inspect, redesign or retest accepted visual work without new evidence of a defect.

## Continuous improvement and handoff

- For continuing Killboard work, read `CONTINUOUS_IMPROVEMENT.md` and the original comparative audit ledger before acting. Treat user steering as additive unless the user explicitly cancels/replaces the goal. Checkpoint the active task and resume point before switching; after urgent interruptions, resume automatically.
- The current objective is the broader Phase II player-experience program recorded in the current sections of `CONTINUOUS_IMPROVEMENT.md`. The original comparative audit is evidence and a source of opportunities, not the scope limit. Historical handoffs that paused work pending an API update are superseded; an individual API limitation never stops independent queue work.
- Maintain the task queue and audit ledger through interruptions and compaction. Progress summaries are checkpoints, not completion. Pause only when requested, when the goal is complete, or when only documented external blockers remain.
- Conserve context: rely on the persistent ledger, avoid repeating completed research or tests on unchanged code, inspect only relevant files, and continue independent work when one item is blocked. Keep progress updates concise.
- Every UI change includes populated desktop, phone, and tablet rendering in the implementation pass, plus a check that desktop behavior remains sound. A passing build alone is insufficient. Localize new strings using project conventions.
- Browser resource discipline is part of verification: avoid parallel browser runs, retain the local development server, and close each test session immediately after its evidence is captured.
- Require fresh explicit user approval for each commit/push/merge/deployment. Approval for one release does not authorize another.
