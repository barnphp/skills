# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, or
- **`CONTEXT-MAP.md`** at the repo root if it exists — it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`docs/adr/`** — read ADRs that touch the area you're about to work in.
- **`docs/agents/`** — read any Barnphp-scaffolded convention files (issue-tracker, triage-labels, domain).

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The producer skill (`/grill-with-docs`) creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context repo (most Laravel apps):

```
/
├── CONTEXT.md
├── docs/
│   ├── adr/
│   │   ├── 0001-single-action-controllers.md
│   │   └── 0002-no-repository-pattern.md
│   └── agents/
│       ├── issue-tracker.md
│       ├── triage-labels.md
│       └── domain.md
└── app/
```

Multi-context repo (presence of `CONTEXT-MAP.md` at the root — e.g. a Laravel monorepo with DDD domain folders):

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← system-wide decisions
└── app/
    ├── Domain/
    │   ├── Ordering/
    │   │   ├── CONTEXT.md
    │   │   └── docs/adr/             ← domain-specific decisions
    │   └── Billing/
    │       ├── CONTEXT.md
    │       └── docs/adr/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

Common Laravel-specific terms to check for: **Action**, **Form Request**, **Model**, **Job**, **Policy**, **Feature test**, **Unit test**, **Vertical slice**, **Composer check**.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/grill-with-docs`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0002 (no repository pattern) — but worth reopening because…_
