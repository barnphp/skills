#!/bin/bash

# Runs composer check as an OpenCode beforeCommit hook.
# Exits 0 on success, 1 on failure (blocking the commit).

set -e

# Navigate to the project root
if [ -n "$OPENCODE_PROJECT_DIR" ]; then
  cd "$OPENCODE_PROJECT_DIR"
fi

if [ ! -f "composer.json" ]; then
  echo "ERROR: No composer.json found. Are you in a Laravel project?" >&2
  exit 1
fi

# Check if the 'check' script exists in composer.json
if ! php -r "exit(isset(json_decode(file_get_contents('composer.json'), true)['scripts']['check']) ? 0 : 1);"; then
  echo "ERROR: No 'check' script found in composer.json." >&2
  echo "Run /setup-opencode-hooks to configure it." >&2
  exit 1
fi

echo "Running composer check..."
composer check

echo "All checks passed."
exit 0
