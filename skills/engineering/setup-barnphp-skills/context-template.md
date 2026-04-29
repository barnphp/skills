# [Project Name]

A Laravel application. Fill in the project-specific terms below as they become clear through `/grill-with-docs` sessions.

## Language

**Action**:
A single-responsibility PHP class that encapsulates one piece of business logic. Lives in `app/Actions/`. Has a `handle()` method. Called from Controllers, Jobs, or other Actions.
_Avoid_: service class, handler, manager

**Form Request**:
A Laravel class extending `FormRequest` that handles validation and authorization for a single HTTP request. Lives in `app/Http/Requests/`. Acts as the boundary between the HTTP layer and the Action layer.
_Avoid_: request class, validator, DTO (unless this project uses a separate DTO pattern — see ADRs)

**Model**:
An Eloquent model. Owns relationships, scopes, casts, and accessors for a single database table. Should not contain business logic.
_Avoid_: entity, record

**Job**:
A Laravel `ShouldQueue` class for deferred or background work. Lives in `app/Jobs/`. Dispatched from Actions or Controllers.
_Avoid_: worker, task, background process

**Policy**:
A Laravel authorization Policy class. Owns all authorization logic for a given Model. Lives in `app/Policies/`.
_Avoid_: gate (use only when referring to inline Gate closures, not Policy classes)

**Feature test**:
A Pest test that exercises a complete HTTP request/response cycle through the full Laravel stack. Lives in `tests/Feature/`.
_Avoid_: integration test

**Unit test**:
A Pest test that exercises a single class or function in isolation, without booting the Laravel application. Lives in `tests/Unit/`.

**Vertical slice**:
A complete end-to-end implementation of a single capability: migration + model + factory + form request + action + controller + route + feature test. All layers, one thin path.
_Avoid_: full-stack feature, horizontal slice

**Composer check**:
The project's quality gate command — runs Pest, Pint, PHPStan, and Rector in sequence via `composer check`.
_Avoid_: CI pipeline (when referring to local checks), test suite (use only for Pest specifically)

## Relationships

- A **Form Request** validates input before it reaches an **Action**
- A **Job** delegates long-running work from an **Action**
- A **Policy** authorizes access to a **Model**
- A **Vertical slice** spans from **Model** through **Action** to **Feature test**

## Project-specific terms

_Add domain terms here as they are resolved in `/grill-with-docs` sessions._

## Flagged ambiguities

_Add ambiguities here as they surface. Remove them once resolved._
