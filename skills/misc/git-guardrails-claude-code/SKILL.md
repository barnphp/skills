---
name: git-guardrails
description: Set up an OpenCode plugin to block dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execute. Use when user wants to prevent destructive git operations or add git safety guardrails to OpenCode.
---

# Setup Git Guardrails

Sets up an OpenCode `beforeBash` hook that intercepts and blocks dangerous git commands before they execute.

## What Gets Blocked

- `git push` (all variants including `--force`)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

When blocked, the agent sees a message telling it that it does not have authority to run these commands.

## Steps

### 1. Ask scope

Ask the user: install for **this project only** (`.opencode/settings.json`) or **all projects** (`~/.opencode/settings.json`)?

### 2. Copy the hook script

The bundled script is at: [scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh)

Copy it to the target location based on scope:

- **Project**: `.opencode/hooks/block-dangerous-git.sh`
- **Global**: `~/.opencode/hooks/block-dangerous-git.sh`

Make it executable:

```bash
chmod +x .opencode/hooks/block-dangerous-git.sh
```

### 3. Add hook to OpenCode settings

**Project** (`.opencode/settings.json`):

```json
{
  "hooks": {
    "beforeBash": [
      {
        "command": "\"$OPENCODE_PROJECT_DIR\"/.opencode/hooks/block-dangerous-git.sh"
      }
    ]
  }
}
```

**Global** (`~/.opencode/settings.json`):

```json
{
  "hooks": {
    "beforeBash": [
      {
        "command": "~/.opencode/hooks/block-dangerous-git.sh"
      }
    ]
  }
}
```

If the settings file already exists, merge the hook into the existing `hooks.beforeBash` array — don't overwrite other settings.

### 4. Ask about customization

Ask if the user wants to add or remove any patterns from the blocked list. Edit the copied script accordingly.

### 5. Verify

Run a quick test:

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | .opencode/hooks/block-dangerous-git.sh
```

Should exit with code 2 and print a BLOCKED message to stderr.
