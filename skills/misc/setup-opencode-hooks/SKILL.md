---
name: setup-opencode-hooks
description: Set up an OpenCode plugin to run composer check (Pest + Pint + PHPStan + Rector) before every bash commit command. Use when user wants to enforce code quality on commit, add pre-commit quality gates, or set up composer check as an OpenCode plugin.
---

# Setup OpenCode Hooks

Sets up an OpenCode `tool.execute.before` plugin that runs `composer check` before any `git commit` command the agent tries to execute, blocking the commit if checks fail.

`composer check` runs in sequence:
1. **Pest** — test suite must pass
2. **Pint** — code must be formatted (`--test` mode, no auto-fix)
3. **PHPStan** — static analysis must pass
4. **Rector** — no pending refactors (`--dry-run` mode)

## Steps

### 1. Check for composer check script

Look at `composer.json`. Does a `check` script already exist?

If not, add it:

```json
{
  "scripts": {
    "check": [
      "@php artisan test",
      "./vendor/bin/pint --test",
      "./vendor/bin/phpstan analyse",
      "./vendor/bin/rector --dry-run"
    ]
  }
}
```

Confirm with the user before writing. If they use different tools (e.g. `pest` directly instead of `artisan test`), adjust accordingly.

### 2. Verify composer check runs

```bash
composer check
```

Fix any failures before proceeding. Don't install a plugin that immediately blocks on a broken codebase.

### 3. Ask scope

Ask the user: install for **this project only** (`.opencode/plugins/`) or **all projects** (`~/.config/opencode/plugins/`)?

### 4. Copy the plugin

The bundled plugin is at: [plugins/composer-check.ts](plugins/composer-check.ts)

Copy it to the target location:

- **Project**: `.opencode/plugins/composer-check.ts`
- **Global**: `~/.config/opencode/plugins/composer-check.ts`

No config file changes are needed — OpenCode automatically loads all `.js` and `.ts` files from those directories at startup.

### 5. Ask about customization

Ask if the user wants to adjust which checks run, or whether they want to block on `git commit` only vs. other patterns (e.g. also block on `git push`). Edit the plugin accordingly.

### 6. Verify

Restart OpenCode. Try asking the agent to commit with a failing test — it should be blocked. On a clean codebase it should commit successfully.

### 7. Notes

- This is a **project-level plugin** if placed in `.opencode/plugins/` — safe to commit to git.
- It is a **global plugin** if placed in `~/.config/opencode/plugins/` — applies to all projects.
- This only gates OpenCode-initiated commits. Running `git commit` yourself in the terminal is unaffected.
