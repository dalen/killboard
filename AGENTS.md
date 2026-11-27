# Killboard Project Instructions

## Browser verification

- Use headless Chromium and Playwright for routine automated browser verification. The user does not need to watch routine testing.
- When a task requires an authenticated route, first check whether an authorized browser session can be reused securely.
- If manual authentication is required, use the in-chat browser or launch a visible Chromium window for the user. Tell the user when the login page is ready, wait for authentication, then resume automated testing.
- Reuse authenticated sessions where supported to avoid repeatedly requesting login.
- Never expose credentials, authentication tokens, or session cookies in logs, source code, screenshots, or project documentation.
- Never commit browser authentication state to the repository.
- If authentication blocks one task, continue other independent tasks where practical. Treat authentication as a project-wide blocker only when it prevents all remaining work.

## Player-facing feature review

- For newly implemented player-facing features, open each populated local route in the in-chat browser so the user can review and interact while development continues. Do not wait for approval between features unless a decision is required; apply visual feedback as steering and follow the current checkpoint.
- Keep the local development server running during user review. Continue headless Playwright for automated behavior, responsive and regression checks. Never commit browser auth state or expose credentials.
## Change verification

- Verify the rendered route and populated behavior; a passing build alone does not establish that a UI change works.
- Include phone and tablet viewport checks in the implementation task for responsive UI work.
- Do not push, merge, or deploy without fresh explicit user approval.

## Player-facing design preference

- Keep the homepage compact and data-focused. Do not add duplicate navigation sections, unnecessary introductions, or oversized low-value cards that push player data down the page.
- Put new features in a logical existing navigation item or dropdown. Do not add duplicate links or a second navigation menu when the top-level navigation or a feature's existing page already provides access.
- Treat “Explore the Killboard” homepage shortcuts as a rejected design; do not reintroduce them. Keep newly added routes accessible through the existing navigation hierarchy.

## Continuous improvement and handoff

- For continuing Killboard work, read `CONTINUOUS_IMPROVEMENT.md` and the original comparative audit ledger before acting. Treat user steering as additive unless the user explicitly cancels/replaces the goal. Checkpoint the active task and resume point before switching; after urgent interruptions, resume automatically.
- The current objective is the broader Phase II player-experience program recorded in the current sections of `CONTINUOUS_IMPROVEMENT.md`. The original comparative audit is evidence and a source of opportunities, not the scope limit. Historical handoffs that paused work pending an API update are superseded; an individual API limitation never stops independent queue work.
- Maintain the task queue and audit ledger through interruptions and compaction. Progress summaries are checkpoints, not completion. Pause only when requested, when the goal is complete, or when only documented external blockers remain.
- Conserve context: rely on the persistent ledger, avoid repeating completed research or tests on unchanged code, inspect only relevant files, and continue independent work when one item is blocked. Keep progress updates concise.
- Every UI change includes populated desktop, phone, and tablet rendering in the implementation pass, plus a check that desktop behavior remains sound. A passing build alone is insufficient. Localize new strings using project conventions.
- Require fresh explicit user approval for each commit/push/merge/deployment. Approval for one release does not authorize another.
