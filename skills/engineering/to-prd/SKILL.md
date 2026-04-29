---
name: to-prd
description: Turn the current conversation context into a PRD and publish it to the project issue tracker. Use when user wants to create a PRD from the current context.
---

This skill takes the current conversation context and codebase understanding and produces a PRD. Do NOT interview the user — just synthesize what you already know.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-barnphp-skills` if not.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the PRD, and respect any ADRs in the area you're touching.

2. Sketch out the major Laravel layers you will need to build or modify. Use `CONTEXT.md` vocabulary throughout.

For each feature, identify the **vertical slice** — the complete set of layers required:

- **Migration** — schema changes
- **Model** — Eloquent model, relationships, scopes, factory
- **Form Request** — validation and authorization
- **Action** — business logic class with a `handle()` method
- **Controller** — thin HTTP layer, delegates to the Action
- **Route** — registered in `routes/api.php` or `routes/web.php`
- **Feature test** — Pest test covering the full HTTP cycle

A slice is not complete unless all layers are present. Actively look for logic that should live in an Action rather than a controller or model.

Check with the user that these layers match their expectations. Check with the user which layers they want tests written for.

3. Write the PRD using the template below, then publish it to the project issue tracker. Apply the `needs-triage` triage label so it enters the normal triage flow.

<prd-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this PRD.

## Further Notes

Any further notes about the feature.

</prd-template>
