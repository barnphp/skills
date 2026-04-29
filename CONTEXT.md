# Barnphp Skills

A collection of agent skills for Laravel development. Skills are organized into buckets and consumed by per-repo configuration emitted by `/setup-barnphp-skills`.

## Language

**Issue tracker**:
The tool that hosts a repo's issues — GitHub Issues, Linear, a local `.scratch/` markdown convention, or similar. Skills like `to-issues`, `to-prd`, `triage` read from and write to it.
_Avoid_: backlog manager, backlog backend, issue host

**Issue**:
A single tracked unit of work inside an **Issue tracker** — a bug, task, PRD, or slice produced by `to-issues`.
_Avoid_: ticket (use only when quoting external systems that call them tickets)

**Triage role**:
A canonical state-machine label applied to an **Issue** during triage (e.g. `needs-triage`, `ready-for-agent`). Each role maps to a real label string in the **Issue tracker** via `docs/agents/triage-labels.md`.

**Action**:
A single-responsibility PHP class that encapsulates one piece of business logic. Lives in `app/Actions/`. Has a `handle()` method. Called from Controllers, Jobs, or other Actions.
_Avoid_: service class (use only when referring to Laravel's service container), handler, manager

**Form Request**:
A Laravel class extending `FormRequest` that handles validation and authorization for a single HTTP request. Lives in `app/Http/Requests/`. Acts as the DTO boundary between the HTTP layer and the Action layer.
_Avoid_: request class, validator class, DTO (unless the project explicitly uses a separate DTO pattern)

**Model**:
An Eloquent model. Owns relationships, scopes, casts, and accessors for a single database table. Should not contain business logic.
_Avoid_: entity, record

**Job**:
A Laravel `ShouldQueue` class for deferred or background work. Lives in `app/Jobs/`. Dispatched from Actions or Controllers. Should contain a single, clearly-named task.
_Avoid_: worker, task, background process

**Policy**:
A Laravel authorization Policy class. Owns all authorization logic for a given Model. Lives in `app/Policies/`.
_Avoid_: gate (use only when referring to inline Gate closures, not Policy classes)

**Feature test**:
A Pest test that exercises a complete HTTP request/response cycle through the full Laravel stack — routing, middleware, controller, action, database. Lives in `tests/Feature/`.
_Avoid_: integration test, end-to-end test (unless using Pest browser testing)

**Unit test**:
A Pest test that exercises a single class or function in isolation, without booting the Laravel application. Lives in `tests/Unit/`.
_Avoid_: isolated test, pure test

**Vertical slice**:
A complete end-to-end implementation of a single capability: migration + model + factory + form request + action + controller + route + feature test. All layers, one thin path.
_Avoid_: full-stack feature, horizontal slice

**Composer check**:
The project's single quality gate command — a Composer script alias that runs Pest, Pint, PHPStan, and Rector in sequence. Enforced by OpenCode hooks before every commit.
_Avoid_: CI pipeline (when referring to local pre-commit checks), test suite (use only to refer to Pest specifically)

## Relationships

- An **Issue tracker** holds many **Issues**
- An **Issue** carries one **Triage role** at a time
- A **Vertical slice** is the minimum shippable unit — it spans from **Model** through **Action** to **Feature test**
- A **Form Request** validates input before it reaches an **Action**
- A **Job** delegates long-running work from an **Action**
- A **Policy** authorizes access to a **Model**

## Flagged ambiguities

- "service class" is ambiguous in Laravel — it could mean a class registered in the service container, or an informal "catch-all business logic" class. Resolved: use **Action** for business logic. Use "service" only when discussing the service container itself.
- "repository" is contested in the Laravel community. Resolved: unless this project has explicitly adopted the Repository pattern (documented in `docs/adr/`), prefer Eloquent scopes and query methods directly on the **Model**.
- "controller" can mean a resource controller or a single-action controller. Resolved: default to single-action controllers (one class per route) unless the project ADR says otherwise.
