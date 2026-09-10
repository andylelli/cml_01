/**
 * ── A_86 item 90 — run the tests for the packages you actually touched ───────────────────────────
 *
 * WHY. `npm test` runs every workspace behind a full `build:all` (the `pretest` hook), which is the
 * right thing before a commit and the wrong thing between two edits of one file. 339 test files run
 * to tell you about the one package you changed.
 *
 * WHAT IT DOES. Asks git which files differ from HEAD (staged, unstaged and untracked), maps each to
 * its workspace, and runs vitest on exactly those directories. No git changes ⇒ it says so and exits
 * 0 rather than silently running everything.
 *
 * WHAT IT IS NOT. Not a replacement for `npm test`: it deliberately does NOT run the dependents of a
 * changed package. `build:changed` exists for that, and the full suite is what a commit is verified
 * against. This is the between-edits loop only, and it says so on every run.
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const sh = (cmd) => {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return "";
  }
};

const changed = new Set(
  [
    ...sh("git diff --name-only HEAD").split("\n"),
    ...sh("git ls-files --others --exclude-standard").split("\n"),
  ]
    .map((line) => line.trim())
    .filter(Boolean),
);

if (changed.size === 0) {
  console.log("[test:touched] no files differ from HEAD — nothing to test.");
  process.exit(0);
}

/** packages/<name>/... and apps/<name>/... are the two workspace layouts in this repo. */
const workspaces = new Set();
for (const file of changed) {
  const match = /^(packages|apps)\/([^/]+)\//.exec(file.replace(/\\/g, "/"));
  if (!match) continue;
  const dir = join(match[1], match[2]);
  if (existsSync(join(dir, "package.json"))) workspaces.add(dir.replace(/\\/g, "/"));
}

if (workspaces.size === 0) {
  console.log(
    `[test:touched] ${changed.size} changed file(s), none inside a workspace ` +
      `(scripts, docs or config). Nothing to run here — use \`npm test\` before committing.`,
  );
  process.exit(0);
}

const targets = [...workspaces].sort();
console.log(
  `[test:touched] ${targets.length} touched workspace(s): ${targets.join(", ")}\n` +
    `[test:touched] NOTE: dependents are NOT run. Use \`npm run build:changed\` and the full suite ` +
    `before committing.\n`,
);
execSync(`npx vitest run ${targets.join(" ")}`, { stdio: "inherit" });
