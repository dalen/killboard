# Killboard Project Instructions

## Browser verification

- Use headless Chromium and Playwright for routine automated browser verification. The user does not need to watch routine testing.
- When a task requires an authenticated route, first check whether an authorized browser session can be reused securely.
- If manual authentication is required, use the in-chat browser or launch a visible Chromium window for the user. Tell the user when the login page is ready, wait for authentication, then resume automated testing.
- Reuse authenticated sessions where supported to avoid repeatedly requesting login.
- Never expose credentials, authentication tokens, or session cookies in logs, source code, screenshots, or project documentation.
- Never commit browser authentication state to the repository.
- If authentication blocks one task, continue other independent tasks where practical. Treat authentication as a project-wide blocker only when it prevents all remaining work.

## Change verification

- Verify the rendered route and populated behavior; a passing build alone does not establish that a UI change works.
- Include phone and tablet viewport checks in the implementation task for responsive UI work.
- Do not push, merge, or deploy without fresh explicit user approval.
