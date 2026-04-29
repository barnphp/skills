---
name: git-guardrails
description: Set up an OpenCode plugin to block dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execute. Use when user wants to prevent destructive git operations or add git safety guardrails to OpenCode.
---

# Setup Git Guardrails

Sets up an OpenCode `tool.execute.before` plugin that intercepts and blocks dangerous git commands before they execute.

## What Gets Blocked

- `git push` (all variants including `--force`)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

When blocked, OpenCode throws an error telling it that it does not have authority to run these commands.

## Steps

### 1. Ask scope

Ask the user: install for **this project only** (`.opencode/plugins/`) or **all projects** (`~/.config/opencode/plugins/`)?

### 2. Copy the plugin

The bundled plugin is at: [plugins/block-dangerous-git.ts](plugins/block-dangerous-git.ts)

Copy it to the target location:

- **Project**: `.opencode/plugins/block-dangerous-git.ts`
- **Global**: `~/.config/opencode/plugins/block-dangerous-git.ts`

No config file changes are needed — OpenCode automatically loads all `.js` and `.ts` files from those directories at startup.

### 3. Ask about customization

Ask if the user wants to add or remove any patterns from the blocked list. Edit the `DANGEROUS_PATTERNS` array in the copied plugin accordingly.

### 4. Verify

Restart OpenCode. The plugin loads at startup. To confirm it's active, ask OpenCode to run `git push` — it should be blocked with an error message.

### 5. Notes

- This is a **project-level plugin** if placed in `.opencode/plugins/` — safe to commit to git.
- It is a **global plugin** if placed in `~/.config/opencode/plugins/` — applies to all projects.
- The plugin only blocks the AI agent. Running `git push` yourself in the terminal is unaffected.
