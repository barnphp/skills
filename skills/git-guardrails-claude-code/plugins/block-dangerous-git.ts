/**
 * OpenCode plugin: block dangerous git commands.
 *
 * Place this file in:
 *   - .opencode/plugins/block-dangerous-git.ts  (project-level)
 *   - ~/.config/opencode/plugins/block-dangerous-git.ts  (global)
 *
 * OpenCode loads all .js/.ts files from those directories automatically at startup.
 */

import type { Plugin } from "@opencode-ai/plugin";

const DANGEROUS_PATTERNS: RegExp[] = [
  /git\s+push/,
  /push\s+--force/,
  /git\s+reset\s+--hard/,
  /git\s+clean\s+-[a-z]*f/,
  /git\s+branch\s+-D/,
  /git\s+checkout\s+\./,
  /git\s+restore\s+\./,
];

export const GitGuardrails: Plugin = async (_ctx) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "bash") return;

      const command = (output.args as { command?: string })?.command ?? "";

      for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.test(command)) {
          throw new Error(
            `BLOCKED: '${command}' matches dangerous pattern '${pattern}'. ` +
              `The user has prevented you from running this command.`
          );
        }
      }
    },
  };
};
