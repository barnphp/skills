# Barnphp Skills

Agent skills for Laravel developers who want to ship real applications — not vibe-code their way into a ball of mud.

These skills are small, composable, and opinionated. They work with any AI agent (OpenCode, Claude Code, Codex). They encode decades of software engineering fundamentals, adapted for the Laravel ecosystem. Hack them. Extend them. Make them yours.

## Quickstart

**Primary** — via [laravel/boost](https://github.com/laravel/boost):

```bash
php artisan boost:add-skill barnphp/skills
```

**Fallback** — clone and link manually:

```bash
git clone https://github.com/barnphp/skills
cd skills && bash scripts/link-skills.sh
```

Then run `/setup-barnphp-skills` in your agent. It will:
- Ask which issue tracker you use (GitHub or local files)
- Ask what triage labels you apply to issues
- Scaffold `CONTEXT.md` with a starter Laravel vocabulary
- Create an empty `docs/adr/` directory

## Why These Skills Exist

These skills fix four failure modes I see repeatedly in AI-assisted Laravel development.

### #1: The Agent Didn't Do What I Want

> "No-one knows exactly what they want"
>
> David Thomas & Andrew Hunt, [The Pragmatic Programmer](https://www.amazon.co.uk/Pragmatic-Programmer-Anniversary-Journey-Mastery/dp/B0833F1T3V)

**The Problem.** Misalignment is the most common failure mode in software development. You ask the agent to build a feature. It builds something technically correct but completely wrong. The communication gap between what you imagine and what the agent produces is real — and it costs hours.

**The Fix** is a grilling session before you write a single line of code:

- [`/grill-me`](./skills/productivity/grill-me/SKILL.md) — for any plan or design decision
- [`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.md) — same, but cross-references your `CONTEXT.md` and ADRs to keep decisions consistent with what you've already built

Use them every time you're about to make a meaningful change.

### #2: The Agent Is Way Too Verbose

> With a ubiquitous language, conversations among developers and expressions of the code are all derived from the same domain model.
>
> Eric Evans, [Domain-Driven Design](https://www.amazon.co.uk/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)

**The Problem.** Laravel projects accumulate vocabulary drift fast. "Service", "manager", "handler", "repository" — different devs (and agents) mean different things. Without a shared language, the agent uses 20 words where 1 will do and names things inconsistently across the codebase.

**The Fix** is a `CONTEXT.md` — a living glossary that gives the agent a shared vocabulary for your project. Terms like `Action`, `Form Request`, `Job`, `Policy` get defined once and used consistently.

<details>
<summary>Example</summary>

Which is easier to read?

- **BEFORE**: "There's a problem when the data submitted by the user gets validated and then passed to the class that handles the business logic before being persisted"
- **AFTER**: "There's a problem in the Action's handle method before persistence"

This concision pays off every session.

</details>

[`/grill-with-docs`](./skills/engineering/grill-with-docs/SKILL.md) builds this shared language inline as you design, and records hard-to-explain decisions as ADRs.

> [!TIP]
> A shared language has compounding benefits:
>
> - **Models, Actions, and Jobs are named consistently** across the codebase
> - The **codebase is easier for the agent to navigate** without re-reading everything
> - The agent **spends fewer tokens on thinking**, because it has precise language to work with

### #3: The Code Doesn't Work

> "Always take small, deliberate steps. The rate of feedback is your speed limit. Never take on a task that's too big."
>
> David Thomas & Andrew Hunt, [The Pragmatic Programmer](https://www.amazon.co.uk/Pragmatic-Programmer-Anniversary-Journey-Mastery/dp/B0833F1T3V)

**The Problem.** Even when the agent understands what to build, it still produces bugs. Without fast feedback loops the agent flies blind — generating plausible-looking code with hidden defects.

**The Fix** is tight feedback loops at every layer.

For automated tests, a red-green-refactor loop is critical. The agent writes a failing Pest test first, then writes the minimal code to pass it. Each vertical slice — migration, model, action, controller, route, feature test — is completed before the next begins.

- [`/tdd`](./skills/engineering/tdd/SKILL.md) — red-green-refactor with Pest v4, feature tests, unit tests, datasets, and browser testing

For debugging, the agent pulls live context directly from your application using [laravel/boost](https://github.com/laravel/boost) MCP tools — reading the last error, scanning log entries, inspecting the database schema — rather than asking you to sprinkle `dd()` calls.

- [`/diagnose`](./skills/engineering/diagnose/SKILL.md) — AI-native debugging loop powered by laravel/boost

### #4: We Built A Ball Of Mud

> "Invest in the design of the system _every day_."
>
> Kent Beck, [Extreme Programming Explained](https://www.amazon.co.uk/Extreme-Programming-Explained-Embrace-Change/dp/0321278658)

**The Problem.** Agents accelerate software entropy. Fat controllers, logic-in-middleware, Eloquent models doing everything — a Laravel codebase can become unmaintainable in weeks when an agent is moving fast.

**The Fix** is caring about Laravel architecture from day one:

- [`/to-prd`](./skills/engineering/to-prd/SKILL.md) — before writing code, identify which Actions, Models, and Jobs are involved
- [`/zoom-out`](./skills/engineering/zoom-out/SKILL.md) — ask the agent where a piece of code sits in the request lifecycle and whether it belongs in a Job, an Action, or a Controller
- [`/improve-codebase-architecture`](./skills/engineering/improve-codebase-architecture/SKILL.md) — rescue a drifting codebase by surfacing fat controllers, anemic models, and misplaced business logic. Run it every few days.

### Summary

Software engineering fundamentals matter more than ever. These skills are Barnphp's best effort at condensing those fundamentals into repeatable Laravel-native practices. Enjoy.

---

> **Standing on the shoulders of giants.** These skills are a Laravel port of [Matt Pocock](https://www.mattpocock.com/)'s original [skills repo](https://github.com/mattpocock/skills). Matt is the author of [Total TypeScript](https://www.totaltypescript.com/) and one of the sharpest engineering minds in the JavaScript ecosystem. His original framing — the four failure modes, the grilling sessions, the shared language discipline, the red-green-refactor loop — is the foundation everything here is built on. Thank you, Matt.

---

## Reference

### Engineering

Skills for daily Laravel code work.

- **[diagnose](./skills/engineering/diagnose/SKILL.md)** — AI-native debugging loop powered by laravel/boost MCP tools: last-error → read-log-entries → database-schema → hypothesise → fix → regression-test.
- **[grill-with-docs](./skills/engineering/grill-with-docs/SKILL.md)** — Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates `CONTEXT.md` and ADRs inline.
- **[triage](./skills/engineering/triage/SKILL.md)** — Triage issues through a state machine of triage roles, using Laravel-flavoured vocabulary and labels.
- **[improve-codebase-architecture](./skills/engineering/improve-codebase-architecture/SKILL.md)** — Surface fat controllers, anemic models, and misplaced business logic. Proposes refactors toward Laravel conventions (Actions, Form Requests, Jobs, Policies).
- **[setup-barnphp-skills](./skills/engineering/setup-barnphp-skills/SKILL.md)** — Scaffold the per-repo config (issue tracker, triage labels, `CONTEXT.md` starter vocabulary, `docs/adr/`) that the other engineering skills consume. Run once per repo.
- **[tdd](./skills/engineering/tdd/SKILL.md)** — Test-driven development with Pest v4: red-green-refactor, feature tests, unit tests, datasets, and browser testing. One vertical Laravel slice at a time.
- **[to-issues](./skills/engineering/to-issues/SKILL.md)** — Break any plan, spec, or PRD into independently-grabbable GitHub issues using Laravel vertical slices (migration → model → action → controller → route → Pest feature test).
- **[to-prd](./skills/engineering/to-prd/SKILL.md)** — Turn the current conversation context into a PRD and submit it as a GitHub issue. No interview — synthesizes what you've already discussed.
- **[zoom-out](./skills/engineering/zoom-out/SKILL.md)** — Tell the agent to zoom out, map the relevant Laravel layers, and explain where a piece of code sits in the request lifecycle.

### Productivity

General workflow tools, not code-specific.

- **[caveman](./skills/productivity/caveman/SKILL.md)** — Ultra-compressed communication mode. Cuts token usage ~75% by dropping filler while keeping full technical accuracy.
- **[grill-me](./skills/productivity/grill-me/SKILL.md)** — Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.
- **[write-a-skill](./skills/productivity/write-a-skill/SKILL.md)** — Create new skills with proper structure, progressive disclosure, and bundled resources.

### Misc

Tools kept around for specific situations.

- **[git-guardrails](./skills/misc/git-guardrails-claude-code/SKILL.md)** — Set up an OpenCode plugin to block dangerous git commands (push, reset --hard, clean, etc.) before they execute.
- **[setup-opencode-hooks](./skills/misc/setup-opencode-hooks/SKILL.md)** — Set up OpenCode hooks to run `composer check` (Pest + Pint + PHPStan + Rector) before every commit.
