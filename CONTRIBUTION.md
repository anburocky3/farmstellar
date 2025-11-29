**Purpose**: This document explains how contributors should work in this repository using a feature-branch + pull-request workflow. Follow these guidelines to keep history clean, reviews fast, and releases predictable.

**Branching**:

- **Main branch**: `main` is always deployable. Do not push directly to `main`.
- **Feature branches**: Create branches off `main` for every task, bugfix, or experiment. Use short, descriptive names with a consistent prefix, for example:

  - `feature/add-crop-validation`
  - `fix/mongo-connection-error`
  - `chore/update-deps`

- Keep feature branches focused: one logical change per branch. Small, reviewable PRs are merged faster.

**Issues & assignment**:

- Before starting work on an issue, add a comment to the issue and wait for an admin (maintainer) to assign it to you. This prevents duplicate effort and ensures priorities are clear.
- Do not open a PR, fork, or start a feature branch for an issue that has not been assigned. If you believe the issue should be worked on immediately, ping the maintainers in the issue or in the team's communication channel and request assignment.
- If an assigned issue is stale or you cannot complete it within a reasonable time, update the issue status and unassign yourself so others can pick it up.

**Workflow (step-by-step)**

1. Pull the latest `main`:

   ```bash
   git checkout main
   git pull origin main
   ```

2. Create a feature branch from `main`:

   ```bash
   git checkout -b feature/short-descriptive-name
   ```

3. Make small, focused commits. Use present-tense imperative messages and include context when helpful. Examples:

   - `Add basic name validation to crops POST endpoint`
   - `Refactor server startup to use connection helper`

4. Rebase or merge from `main` regularly while working to keep your branch up-to-date and reduce merge conflicts:

   ```bash
   git fetch origin
   git rebase origin/main
   # or, if you prefer merge:
   # git merge origin/main
   ```

5. Push your branch and open a Pull Request (PR) on the repo hosting service (GitHub):

   ```bash
   git push -u origin feature/short-descriptive-name
   ```

6. Fill the PR description with: what changed, why, and any migration or rollout notes. Link related issue(s) or ticket(s).

**Pull Request (PR) best practices**

- **One purpose per PR**: Avoid mixing unrelated changes (e.g., refactor + feature + formatting) in the same PR.
- **Use a clear title and description**: Explain the intent, the high-level approach, and any impacts.
- **Small diffs**: Aim for PRs that reviewers can understand in ~15–30 minutes. If a change is large, break it into smaller PRs.
- **Include tests**: Add unit/integration tests for new behavior where practical.
- **Include screenshots or logs** when the change affects UI or observable behavior.
- **Link issues**: Reference the issue number(s) the PR addresses.
- **Self-review**: Before requesting review, run linting, unit tests, and a local smoke test.

**Review checklist for reviewers**

- Does the PR do one thing and do it well?
- Is the code clear and easy to follow?
- Are there tests for important logic or regressions?
- Are edge cases handled and errors surfaced appropriately?
- Is the public API stable and documented (if applicable)?
- Are dependencies and security implications considered (e.g., new packages)?

**Merging**

- Use the repository's protected-branch rules: require at least one approving review and passing CI before merge.
- Prefer `Squash and merge` for feature branches to keep `main` history readable, unless the branch intentionally contains multiple, meaningful commits.
- Delete the feature branch after merging.

**Commit message style**

- Use short, imperative subject lines (<= 72 chars) and an optional body explaining the why.

Example:

```
Refactor: centralize mongoose connection

Move DB connection logic into `server/mongoose/connection.js` and use
it from the root `server.js` to keep responsibilities separated.
```

**Tests & CI**

- Run tests locally before opening a PR. Add tests for new behavior when reasonable.
- Fix CI failures before merging. If CI is flaky, mention it in the PR and create a follow-up to fix the pipeline instead of bypassing checks.

**Security & Secrets**

- Never commit secrets, API keys, or credentials. Use `.env` locally and add `.env` to `.gitignore`.
- For production secrets, use your deployment platform's secrets manager.

**Code formatting & linting**

- Run the project's linters and formatters before pushing. Keep CI linters passing.
- Small formatting-only changes should be in dedicated PRs (or omitted if covered by automatic formatters).

**Emergency fixes / Hotfixes**

- For hotfixes that must go directly to production, create a `hotfix/*` branch from `main`, apply the fix, open a PR, and follow expedited review/merge rules defined by the team.

**Onboarding new contributors**

- If you're new here, open a draft PR early to get feedback and help from reviewers.
- Ask for help in PR comments or your team's chat when blockers appear.

**Questions or exceptions**

- When unsure, ask in the PR or reach out to the repository maintainers. Exceptions to this guide should be documented in the PR and agreed upon by reviewers.

Thanks for contributing — your careful changes make this project stronger.
