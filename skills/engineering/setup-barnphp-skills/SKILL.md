---
name: setup-barnphp-skills
description: Sets up per-repo configuration so the engineering skills know this repo's issue tracker, triage label vocabulary, domain doc layout, and OpenCode hooks. Run before first use of `to-issues`, `to-prd`, `triage`, `diagnose`, `tdd`, `improve-codebase-architecture`, or `zoom-out` — or if those skills appear to be missing context.
disable-model-invocation: true
---

# Setup Barnphp Skills

Scaffold the per-repo configuration that the engineering skills assume:

- **Issue tracker** — where issues live (GitHub by default; local markdown is also supported)
- **Triage labels** — the strings used for the five canonical triage roles
- **Domain docs** — scaffold `CONTEXT.md` with a Laravel starter vocabulary and an empty `docs/adr/` directory
- **OpenCode hooks** — confirm whether `composer check` hooks are configured

This is a prompt-driven skill, not a deterministic script. Explore, present what you found, confirm with the user, then write.

## Process

### 1. Explore

Look at the current repo to understand its starting state. Read whatever exists; don't assume:

- `git remote -v` and `.git/config` — is this a GitHub repo? Which one?
- `opencode.json` or `.opencode/` — does an OpenCode config exist? Are hooks already configured?
- `CLAUDE.md` and `AGENTS.md` at the repo root — does either exist? Is there already an `## Agent skills` section?
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `docs/adr/` directory — does it exist? How many ADRs?
- `docs/agents/` — does prior output from this skill already exist?
- `composer.json` — does a `check` script exist?
- `.scratch/` — sign that a local-markdown issue tracker is already in use

### 2. Present findings and ask

Summarise what's present and what's missing. Walk the user through four decisions **one at a time** — present a section, get the user's answer, then move to the next.

Assume the user does not know what these terms mean. Each section starts with a short explainer, then shows the choices and the default.

**Section A — Issue tracker.**

> Explainer: The "issue tracker" is where issues live for this repo. Skills like `to-issues`, `triage`, and `to-prd` read from and write to it — they need to know whether to call `gh issue create`, write a markdown file under `.scratch/`, or follow some other workflow. Pick the place you actually track work.

Default: if `git remote` points at GitHub, propose GitHub. Otherwise offer:

- **GitHub** — issues live in the repo's GitHub Issues
- **Local markdown** — issues live as files under `.scratch/<feature>/` (good for solo projects)
- **Other** (Linear, Jira, etc.) — ask the user to describe the workflow; record it as freeform prose

**Section B — Triage label vocabulary.**

> Explainer: The `triage` skill moves issues through a state machine. It applies labels that must match strings you've actually configured in your tracker. If you already use different label names (e.g. `bug:triage` instead of `needs-triage`), map them here.

The five canonical roles:

- `needs-triage` — maintainer needs to evaluate
- `needs-info` — waiting on reporter
- `ready-for-agent` — fully specified, AFK-ready
- `ready-for-human` — needs human implementation
- `wontfix` — will not be actioned

Default: each role's string equals its name. Ask if the user wants to override any.

**Section C — Domain docs.**

> Explainer: Skills like `improve-codebase-architecture`, `diagnose`, and `tdd` read `CONTEXT.md` for your project's domain language, and `docs/adr/` for past architectural decisions.

If `CONTEXT.md` does not exist, scaffold it from [context-template.md](./context-template.md) — a Laravel-specific starter vocabulary covering Model, Action, Form Request, Job, Policy, Feature test, Unit test, Vertical slice, and Composer check.

If `docs/adr/` does not exist, create it with a `.gitkeep`.

Confirm the layout:

- **Single-context** — one `CONTEXT.md` + `docs/adr/` at the repo root. Most Laravel apps are this.
- **Multi-context** — `CONTEXT-MAP.md` at the root pointing to per-context files (monorepos, DDD domain folders).

**Section D — OpenCode hooks.**

> Explainer: OpenCode hooks let you run `composer check` automatically before every commit, catching Pest failures, Pint formatting issues, PHPStan errors, and Rector suggestions before they reach the repo.

Check if `opencode.json` already has a `beforeCommit` hook calling `composer check`. If not, ask the user if they want it configured. If yes, add it. If the project has no `check` script in `composer.json`, note this and suggest they add one:

```json
"scripts": {
    "check": [
        "@php artisan test",
        "./vendor/bin/pint --test",
        "./vendor/bin/phpstan analyse",
        "./vendor/bin/rector --dry-run"
    ]
}
```

### 3. Confirm and write

Show the user a draft of all files to be written. Let them edit before writing.

Write in this order:

1. `CONTEXT.md` — from [context-template.md](./context-template.md) if it doesn't exist
2. `docs/adr/.gitkeep` — if `docs/adr/` doesn't exist
3. `docs/agents/issue-tracker.md` — from the appropriate template
4. `docs/agents/triage-labels.md` — from [triage-labels.md](./triage-labels.md)
5. `docs/agents/domain.md` — from [domain.md](./domain.md)
6. `opencode.json` — add/update the `beforeCommit` hook if confirmed
7. `## Agent skills` block in `CLAUDE.md` or `AGENTS.md`

**Pick the agent config file to edit:**
- If `CLAUDE.md` exists, edit it.
- Else if `AGENTS.md` exists, edit it.
- If neither exists, ask the user which to create.
- Never create both.

The `## Agent skills` block:

```markdown
## Agent skills

### Issue tracker

[one-line summary]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary]. See `docs/agents/triage-labels.md`.

### Domain docs

[single-context or multi-context]. See `docs/agents/domain.md`.

### Quality gate

`composer check` runs Pest, Pint, PHPStan, and Rector. Enforced by OpenCode hooks.
```

### 4. Done

Tell the user which engineering skills will now read from these files. Mention they can edit `docs/agents/*.md` and `CONTEXT.md` directly — re-running this skill is only needed if they want to switch issue trackers or restart from scratch.
