---
name: diagnose
description: AI-native debugging loop for Laravel applications powered by laravel/boost MCP tools. Use when user says "diagnose this" / "debug this", reports a bug, says something is broken/throwing/failing, or describes a performance regression.
---

# Diagnose

An AI-native debugging discipline for Laravel. The agent pulls live application context directly via [laravel/boost](https://github.com/laravel/boost) MCP tools rather than asking the developer to instrument code manually.

When exploring the codebase, read `CONTEXT.md` to understand the domain model and check ADRs in the area you're touching.

## Prerequisites

This skill assumes `laravel/boost` is installed and its MCP server is running:

```bash
composer require laravel/boost --dev
php artisan boost:install --mcp
```

If Boost is not available, fall back to the [manual instrumentation fallback](./fallback.md).

## Phase 1 — Pull context from the application

**This is the skill.** Before reading a single line of code, pull live context from the running application. The agent has direct access to what actually happened, not what the code suggests might happen.

Run these Boost MCP tools in order:

### 1. Get the last error

```json
{ "name": "last-error" }
```

Read the full error: message, exception class, file, line number, and stack trace. Map the stack trace to the domain model using `CONTEXT.md` — understand *which layer* the error originated in (HTTP, Action, Model, Job, etc.).

### 2. Read recent log entries

```json
{ "name": "read-log-entries", "arguments": { "entries": 50 } }
```

Look for patterns — repeated errors, unusual sequences, timing anomalies. Note the timestamps. A sequence of log entries often tells the story before the stack trace does.

### 3. Read browser console logs (for frontend bugs)

```json
{ "name": "browser-logs", "arguments": { "entries": 20 } }
```

For bugs that surface in the UI — Livewire errors, Alpine.js failures, failed fetch requests — the browser console is the first signal.

### 4. Inspect the database schema (for data-related bugs)

```json
{ "name": "database-schema", "arguments": { "summary": true } }
```

If the error involves a missing column, a wrong type, or a failed foreign key constraint, confirm the actual schema rather than assuming it matches the migration files.

For a specific table:

```json
{ "name": "database-schema", "arguments": { "filter": "posts", "include_column_details": true } }
```

**Do not proceed to Phase 2 until you have read the error and logs.** Hypothesising without data is guessing.

## Phase 2 — Build a feedback loop

A fast, deterministic, agent-runnable pass/fail signal for the bug. Everything else is mechanical. If you have one, you will find the cause.

Try in roughly this order:

1. **Failing Pest test** — the ideal loop. Write a feature test that reproduces the exact failure. Red means bug present; green means fixed.
2. **`php artisan tinker` invocation** — for bugs in an Action or Model method, invoke it directly and observe the output.
3. **HTTP replay** — replay the exact request using the payload from the log entries.
4. **Artisan command** — if the bug is in a Job or Command, run `php artisan` with the relevant arguments.
5. **Throwaway test** — if no clean seam exists, write a temporary test at the closest available seam.

A 2-second deterministic Pest test is a debugging superpower. Invest the time to build it.

**If you genuinely cannot build a feedback loop**, stop and say so. List what you tried. Ask the user for a captured log dump, a reproduction script, or access to the environment.

## Phase 3 — Reproduce

Run the feedback loop. Watch the bug appear.

Confirm:

- [ ] The loop produces the failure the **user** described — not a different failure nearby
- [ ] The failure is reproducible across multiple runs
- [ ] You have captured the exact symptom (exception class, wrong HTTP status, wrong database state)

Do not proceed until you can reproduce the bug.

## Phase 4 — Hypothesise

Generate **3–5 ranked hypotheses** before testing any of them.

Each hypothesis must be falsifiable:

> "If `<X>` is the cause, then changing `<Y>` will make the bug disappear."

**Show the ranked list before testing.** The user often has domain knowledge that re-ranks instantly. Don't block on it — proceed if they're AFK.

Common Laravel hypothesis categories:

- **Middleware** — is the request being terminated or transformed before reaching the controller?
- **Authorization** — is a Policy or Gate blocking unexpectedly?
- **Validation** — is a Form Request failing silently?
- **N+1 / query** — is the ORM generating unexpected SQL? Check with `DB::listen()` or Telescope.
- **Queue serialization** — is a Job payload being serialized/deserialized incorrectly?
- **Cache stale data** — is the application reading from cache when it should hit the database?
- **Missing migration** — does the schema match what the code expects?

## Phase 5 — Instrument

Each probe must map to a specific prediction from Phase 4. **Change one variable at a time.**

Tool preference:

1. **Re-run Boost MCP tools** after each change — `last-error` and `read-log-entries` show the new state immediately.
2. **`php artisan tinker`** — inspect model state, test method calls, verify query output live.
3. **Laravel Telescope** — if available, inspect the full request/response cycle, query log, and job payloads.
4. **Targeted `Log::debug()`** calls — tag every debug log with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end is a single grep. Untagged logs survive; tagged logs die.

Never "log everything and grep". Each log must map to a specific hypothesis.

## Phase 6 — Fix + regression test

Write the regression test **before the fix** — but only if a correct seam exists.

A correct seam is one where the test exercises the real bug pattern at the call site. If the only available seam is a shallow unit test that can't replicate the chain that triggered the bug, it gives false confidence.

If a correct seam exists:

1. Turn the reproduction into a failing Pest test at that seam
2. Watch it fail
3. Apply the fix
4. Watch it pass
5. Re-run `composer check` — Pest, Pint, PHPStan, Rector all pass

## Phase 7 — Cleanup + post-mortem

Required before declaring done:

- [ ] Original reproduction no longer reproduces
- [ ] Regression test passes (or absence of seam is documented)
- [ ] All `[DEBUG-...]` log calls removed
- [ ] Throwaway code deleted
- [ ] The winning hypothesis is stated in the commit message

**Then ask: what would have prevented this bug?** If the answer involves architecture — no good test seam, business logic in the wrong layer, missing Form Request validation — hand off to `/improve-codebase-architecture` with the specifics.
