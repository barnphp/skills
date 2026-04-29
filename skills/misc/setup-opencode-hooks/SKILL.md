---
name: setup-opencode-hooks
description: Set up OpenCode hooks to run composer check (Pest + Pint + PHPStan + Rector) before every commit. Use when user wants to enforce code quality on commit, add pre-commit quality gates, or set up composer check as an OpenCode hook.
---

# Setup OpenCode Hooks

Configures OpenCode to run `composer check` — the project's quality gate — before every commit.

`composer check` runs in sequence:
1. **Pest** — test suite must pass
2. **Pint** — code must be formatted (`--test` mode, no auto-fix)
3. **PHPStan** — static analysis must pass
4. **Rector** — no pending refactors (`--dry-run` mode)

A commit is blocked if any of these fail.

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

Fix any failures before proceeding. Don't install hooks that immediately block on a broken codebase.

### 3. Ask scope

Ask the user: install for **this project only** (`.opencode/settings.json`) or **all projects** (`~/.opencode/settings.json`)?

### 4. Copy the hook script

The bundled script is at: [scripts/composer-check.sh](scripts/composer-check.sh)

Copy it to the target location:

- **Project**: `.opencode/hooks/composer-check.sh`
- **Global**: `~/.opencode/hooks/composer-check.sh`

Make it executable:

```bash
chmod +x .opencode/hooks/composer-check.sh
```

### 5. Add hook to OpenCode settings

**Project** (`.opencode/settings.json`):

```json
{
  "hooks": {
    "beforeCommit": [
      {
        "command": "\"$OPENCODE_PROJECT_DIR\"/.opencode/hooks/composer-check.sh"
      }
    ]
  }
}
```

**Global** (`~/.opencode/settings.json`):

```json
{
  "hooks": {
    "beforeCommit": [
      {
        "command": "~/.opencode/hooks/composer-check.sh"
      }
    ]
  }
}
```

If the settings file already exists, merge into the existing `hooks.beforeCommit` array.

### 6. Verify

Run a quick test to confirm the hook executes correctly:

```bash
.opencode/hooks/composer-check.sh
```

Should exit 0 on a clean codebase and exit 1 (with output) on a failure.

### 7. Done

Tell the user that `composer check` will now run automatically before every commit OpenCode makes. They can still bypass it manually with `git commit` directly — this only gates OpenCode-initiated commits.
