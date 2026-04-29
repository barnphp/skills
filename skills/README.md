# Engineering

Skills for daily Laravel code work.

- **[diagnose](./diagnose/SKILL.md)** — AI-native debugging loop powered by laravel/boost MCP tools: last-error → read-log-entries → database-schema → hypothesise → fix → regression-test.
- **[grill-with-docs](./grill-with-docs/SKILL.md)** — Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates `CONTEXT.md` and ADRs inline.
- **[triage](./triage/SKILL.md)** — Triage issues through a state machine of triage roles, using Laravel-flavoured vocabulary and labels.
- **[improve-codebase-architecture](./improve-codebase-architecture/SKILL.md)** — Surface fat controllers, anemic models, and misplaced business logic. Proposes refactors toward Laravel conventions (Actions, Form Requests, Jobs, Policies).
- **[setup-barnphp-skills](./setup-barnphp-skills/SKILL.md)** — Scaffold the per-repo config (issue tracker, triage labels, `CONTEXT.md` starter vocabulary, `docs/adr/`) that the other engineering skills consume. Run once per repo.
- **[tdd](./tdd/SKILL.md)** — Test-driven development with Pest v4: red-green-refactor, feature tests, unit tests, datasets, and browser testing. One vertical Laravel slice at a time.
- **[to-issues](./to-issues/SKILL.md)** — Break any plan, spec, or PRD into independently-grabbable GitHub issues using Laravel vertical slices (migration → model → action → controller → route → Pest feature test).
- **[to-prd](./to-prd/SKILL.md)** — Turn the current conversation context into a PRD and submit it as a GitHub issue.
- **[zoom-out](./zoom-out/SKILL.md)** — Tell the agent to zoom out, map the relevant Laravel layers, and explain where code sits in the request lifecycle.

# Productivity

General workflow tools, not code-specific.

- **[caveman](./caveman/SKILL.md)** — Ultra-compressed communication mode. Cuts token usage ~75% by dropping filler while keeping full technical accuracy.
- **[grill-me](./grill-me/SKILL.md)** — Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.
- **[write-a-skill](./write-a-skill/SKILL.md)** — Create new skills with proper structure, progressive disclosure, and bundled resources.

# Misc

Tools kept around for specific situations.

- **[git-guardrails](./git-guardrails-claude-code/SKILL.md)** — Set up an OpenCode plugin to block dangerous git commands (push, reset --hard, clean, etc.) before they execute.
- **[setup-opencode-hooks](./setup-opencode-hooks/SKILL.md)** — Set up OpenCode hooks to run `composer check` (Pest + Pint + PHPStan + Rector) before every commit.
