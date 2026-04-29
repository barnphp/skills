---
name: improve-codebase-architecture
description: Surface Laravel architectural problems (fat controllers, logic-in-models, misplaced business logic) and propose refactors toward Laravel conventions. Use when user wants to improve architecture, find refactoring opportunities, rescue a ball-of-mud codebase, or make a Laravel project more testable and maintainable.
---

# Improve Codebase Architecture

Surface architectural friction in a Laravel application and propose concrete refactors toward Laravel conventions. The aim is a codebase where business logic lives in Actions, HTTP concerns live in Controllers and Form Requests, and everything is testable through its public interface.

This skill is *informed* by the project's domain model. Read `CONTEXT.md` and `docs/adr/` before proposing anything — the domain language names good boundaries, and ADRs record decisions the skill should not re-litigate.

## Laravel Architecture Conventions

These are the opinions this skill enforces. See [conventions.md](conventions.md) for the full guide.

| Layer | Purpose | Lives in |
|---|---|---|
| **Controller** | Receive HTTP, delegate, return response. Nothing else. | `app/Http/Controllers/` |
| **Form Request** | Validate and authorize one HTTP request | `app/Http/Requests/` |
| **Action** | One piece of business logic, one `handle()` method | `app/Actions/` |
| **Model** | Relationships, scopes, casts, accessors. No business logic. | `app/Models/` |
| **Job** | Deferred or background work | `app/Jobs/` |
| **Policy** | Authorization logic for a Model | `app/Policies/` |
| **Resource** | Transform a Model for API responses | `app/Http/Resources/` |

## Anti-Patterns to Surface

When exploring, look for these:

- **Fat controller** — controller method over ~20 lines, or containing business logic, queries, or direct model saves
- **Logic in Model** — model methods that do more than relationships, scopes, casts, or accessors
- **Validation in controller** — `$request->validate([...])` inside a controller method (should be a Form Request)
- **God Job** — a Job that does multiple unrelated things (should be split into separate Jobs or Actions)
- **Missing authorization** — routes without Policy checks, or authorization logic scattered across controllers
- **N+1 queries** — eager loading absent where relationships are accessed in loops
- **Direct model saves in controller** — `$post->save()` in a controller instead of an Action
- **Untestable code** — logic buried where it can only be tested through a slow browser test instead of a fast feature test

## Process

### 1. Explore

Read `CONTEXT.md` and any relevant ADRs first. Then walk the codebase organically — note where you experience friction:

- Which controllers are long? Which have `$request->validate()`?
- Which Models have methods that dispatch events, send notifications, or make decisions?
- Where is authorization logic? Is it in Policies or scattered in controllers?
- Where are Jobs dispatched? Are they doing too much?
- Which parts of the codebase have no tests, or tests that break on refactor?
- Where would you have to touch 5 files to change one behavior?

### 2. Present candidates

Present a numbered list of refactor candidates. For each candidate:

- **Files** — which files are involved
- **Problem** — the specific anti-pattern and why it causes friction
- **Solution** — plain English description of what would change (e.g. "Extract `StorePostController::__invoke` body into `CreatePostAction::handle`")
- **Test impact** — would this make the code more testable? How?

**Use `CONTEXT.md` vocabulary for domain terms.** If the glossary defines "Action", say "extract into an Action" — not "extract into a service class".

**ADR conflicts**: if a candidate contradicts an existing ADR, only surface it when the friction is real enough to warrant reopening. Mark it clearly.

Do NOT write code yet. Ask the user: "Which of these would you like to tackle first?"

### 3. Refactor loop

Once the user picks a candidate:

1. Confirm the existing tests pass (`composer check`)
2. Propose the specific refactor — show before/after signatures, not full code
3. Get approval, then implement
4. Run `composer check` — all tests must still pass after each step
5. If tests break, the refactor changed behavior — stop, investigate, fix

Side effects as decisions crystallize:

- **Naming a new Action or class after a concept not in `CONTEXT.md`?** Add the term to `CONTEXT.md`. See [CONTEXT-FORMAT.md](../grill-with-docs/CONTEXT-FORMAT.md).
- **User rejects a candidate with a load-bearing reason?** Offer an ADR. See [ADR-FORMAT.md](../grill-with-docs/ADR-FORMAT.md).

See [conventions.md](conventions.md) for detailed refactor patterns.
