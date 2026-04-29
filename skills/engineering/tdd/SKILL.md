---
name: tdd
description: Test-driven development with red-green-refactor loop using Pest v4. Use when user wants to build features or fix bugs using TDD, mentions "red-green-refactor", wants feature tests or unit tests, wants browser testing, or asks for test-first development in Laravel.
---

# Test-Driven Development (Laravel / Pest v4)

## Philosophy

**Core principle**: Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

**Good tests** exercise real code paths through HTTP requests, Actions, and Models. They describe *what* the system does, not *how* it does it. A good test reads like a specification — `a user can create a post` tells you exactly what capability exists. These tests survive refactors because they don't care about internal structure.

**Bad tests** are coupled to implementation. They test private methods, assert on internal state, or verify through database queries when the HTTP response is the real observable behavior. The warning sign: your test breaks when you refactor, but user-facing behavior hasn't changed.

See [tests.md](tests.md) for examples and [mocking.md](mocking.md) for mocking guidelines.

## Anti-Pattern: Horizontal Slices

**DO NOT write all tests first, then all implementation.** This is horizontal slicing.

This produces tests that verify imagined behavior, not actual behavior. You outrun your headlights and commit to test structure before understanding the implementation.

**Correct approach**: Vertical slices via tracer bullets. One test → one implementation → repeat. Each test responds to what you learned from the previous cycle.

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
```

## Laravel Vertical Slice

A complete slice in Laravel covers all layers in one pass:

```
migration → model → factory → form request → action → controller → route → feature test
```

Never test a layer in isolation when a feature test through the full stack is possible and fast.

## Workflow

### 1. Planning

Read `CONTEXT.md` and relevant ADRs before writing anything. Use the project's domain vocabulary in test names and descriptions.

Before writing any code:

- [ ] Confirm with user what the public interface is (route, Action signature, or Model method)
- [ ] Confirm which behaviors to test — prioritize the critical path
- [ ] Identify the right test type for each behavior (see [tests.md](tests.md))
- [ ] List the behaviors to test — not implementation steps
- [ ] Get user approval on the plan

Ask: "What is the public interface? Which behaviors matter most to test?"

**You can't test everything.** Focus on critical paths and complex logic, not every edge case.

### 2. Tracer Bullet

Write ONE test that confirms ONE thing about the system:

```php
it('allows a user to create a post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/posts', [
            'title' => 'Hello World',
            'body'  => 'My first post.',
        ]);

    $response->assertCreated();
    $this->assertDatabaseHas('posts', ['title' => 'Hello World']);
});
```

```
RED:   Write test for first behavior → test fails
GREEN: Write minimal code to pass → test passes
```

This is your tracer bullet — it proves the full path works end-to-end.

### 3. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails
GREEN: Minimal code to pass → passes
```

Rules:

- One test at a time
- Only enough code to pass the current test
- Don't anticipate future tests
- Keep tests focused on observable behavior (HTTP responses, database state, dispatched jobs)

### 4. Browser Testing (Pest v4)

Use browser tests for flows that require JavaScript, Livewire interactions, or multi-step UI flows. See [browser-tests.md](browser-tests.md).

```php
it('allows a user to submit the contact form', function () {
    $this->browse(function (Browser $browser) {
        $browser->visit('/contact')
            ->type('name', 'John Doe')
            ->type('email', 'john@example.com')
            ->press('Send')
            ->assertSee('Thank you');
    });
});
```

Only reach for browser tests when a feature test through the HTTP layer cannot cover the behavior. Browser tests are slower — keep them for flows that genuinely require a browser.

### 5. Refactor

After all tests pass, look for [refactor candidates](refactoring.md):

- [ ] Extract duplication
- [ ] Move business logic into Actions if it's sitting in controllers
- [ ] Slim down Models — scopes are fine, logic is not
- [ ] Run `composer check` after each refactor step

**Never refactor while RED.** Get to GREEN first.

## Checklist Per Cycle

```
[ ] Test describes behavior, not implementation
[ ] Test uses HTTP or public Action interface — not private methods
[ ] Test would survive an internal refactor
[ ] Code is minimal for this test
[ ] No speculative features added
[ ] composer check passes
```
