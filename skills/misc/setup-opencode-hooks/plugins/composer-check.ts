/**
 * OpenCode plugin: run `composer check` before every git commit.
 *
 * Place this file in:
 *   - .opencode/plugins/composer-check.ts  (project-level)
 *   - ~/.config/opencode/plugins/composer-check.ts  (global)
 *
 * OpenCode loads all .js/.ts files from those directories automatically at startup.
 *
 * Requires a `check` script in composer.json that runs your quality gate
 * (e.g. Pest + Pint --test + PHPStan + Rector --dry-run).
 */

import type { Plugin } from "@opencode-ai/plugin";

export const ComposerCheck: Plugin = async ({ $ }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "bash") return;

      const command = (output.args as { command?: string })?.command ?? "";

      if (!/git\s+commit/.test(command)) return;

      try {
        await $`composer check`;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : String(err);
        throw new Error(
          `BLOCKED: composer check failed. Fix all errors before committing.\n\n${message}`
        );
      }
    },
  };
};
