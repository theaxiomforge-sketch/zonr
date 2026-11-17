# Git Commit Guidelines

Use these rules whenever creating a git commit. If local `AGENTS.md` differs, prefer these preferences unless a repository-local instruction is stricter and not contradictory.

## Header

Format: `<type>(<scope>): <subject>`

- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- Scope is optional; use a noun for the exact module/place
- Subject: succinct, lowercase start, imperative present tense, no trailing period
- Short description under 100 characters, then a newline, then the detailed body

## Formatting

- Separate header, body, and footer with blank lines
- Keep lines under 250 characters (up to 500 only where this rule allows)
- Wrap body text around 72 characters
- Use markdown syntax
- Concise, informal, factual tone
- Imperative present tense for the header subject and narrative body
  (motivation / previous behavior)
- Separate sentences in the detailed description with newlines
- List significant changes
- Explain motivation and contrast with previous behavior
- Mention implications and possible usages of the changes

## Required body sections (bullet lists)

**What changed**
- Summarize concrete behavior, UI, docs, tests, or implementation changes
- Prefer past tense here (e.g. "Added…", "Renamed…", "Fixed…")
- Header subject stays imperative present (e.g. `feat(ui): add empty states`)

**Notes**
- Follow-ups, tech debt, edge cases

**Testing**
- List exactly what was run: unit tests, integration tests, manual testing
- If nothing was run → say: `Not run`

**How to try it**
- Steps to verify the change (imperative is fine: "Open…", "Tap…")

**Edited files**
- List each file that changed, was edited, or was created
- Use the exact file names/paths that were staged

## Footer (optional)

- Issue references or breaking changes
- Breaking changes must start with `BREAKING CHANGE:`
- Reverts: header `revert: <reverted header>` and body exactly `This reverts commit <hash>.`

## Strict rules

- ALWAYS present the full draft commit message to the user before any `git commit`
- Allow the user to edit the message; use their revised text if they provide one
- Obtain explicit approval before running `git commit` (e.g. "approved", "commit it", "looks good")
- Do NOT stage or commit until the user approves the message (unless they already approved in the same turn)
- Do NOT claim tests passed unless actually run
- Do NOT invent logs, metrics, or screenshots
- Explicitly call out breaking changes
- Explicitly call out PII, auth, or payment changes
- Keep language simple and factual
- Do NOT mention Codex or AI
- Do NOT add `Co-authored-by: Cursor <cursoragent@cursor.com>` or any Cursor/agent co-author trailer
- Keep all commit-message lines under 500 characters
- Preserve imperative present tense for the header subject; past tense is
  allowed and preferred in **What changed** bullets

## Commit workflow

When the user asks for a commit (or you propose one):

1. Run `git status`, `git diff`, and `git log` in parallel to understand changes and message style.
2. Draft the full message: header plus all required body sections (**What changed**, **Notes**, **Testing**, **How to try it**, **Edited files**).
3. **Present the draft** to the user in a copy-pasteable block. Invite edits.
4. **Wait for explicit approval** before staging or committing. If they revise the message, use their version.
5. After approval only: `git add` relevant files, `git commit` via HEREDOC (Git Bash on Windows), then `git status` to verify.

Do not skip steps 3–4, even when splitting into multiple commits — present and approve each message separately unless the user asks to batch-approve.
