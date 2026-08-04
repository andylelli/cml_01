/**
 * The run's warning channel is one array, and it must stay one array.
 *
 * FOUND 2026-08-04 by the first live geometry run. `agent6-run.ts` cleared its transient warnings
 * with `ctx.warnings = ctx.warnings.filter(...)`. `filter` returns a NEW array, so the call — which
 * is unconditional, at the end of every Agent 6 — replaced `ctx.warnings` and severed its aliasing
 * with the orchestrator's `warnings`.
 *
 * Everything pushed after that point went into an array nothing reads: Agent 7, Agent 7.5, and all
 * 108 push sites in Agent 9. The run logged "Release gate warning: scene-grounding coverage below
 * target" to the console and recorded it on no artifact. Every archived report in the corpus shows
 * zero `[Agent 9]` warnings — not because Agent 9 is quiet, but because nothing it says survives.
 *
 * The orchestrator asserts the invariant in a comment ("Everything Agent 9 pushes to ctx.warnings
 * aliases this array, so this captures the whole run"). A comment is not a check, and this is the
 * check — expressed as the property rather than as one call site, so the next in-place-vs-copy slip
 * anywhere in the pipeline fails here.
 */

import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { clearWarningsInPlace } from "../jobs/agents/shared.js";

/**
 * EVERY source file under jobs/, not a hand-listed set of agents.
 *
 * The original list named the agent run files. That would have missed a reassignment in the
 * orchestrator, in shared.ts, or in any file added later — and "the list was not updated" is how the
 * defect this test exists for survived in the first place.
 */
const collectSources = (dir: string, out: Array<{ file: string; path: string }> = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "node_modules") continue;
      collectSources(full, out);
    } else if (entry.name.endsWith(".ts")) {
      out.push({ file: relative(JOBS_ROOT, full).split("\\").join("/"), path: full });
    }
  }
  return out;
};

const JOBS_ROOT = fileURLToPath(new URL("../jobs", import.meta.url));
const AGENT_SOURCES = collectSources(JOBS_ROOT);

describe("warning-channel aliasing", () => {
  it("no agent replaces ctx.warnings with a new array", () => {
    const offenders: string[] = [];
    for (const { file, path } of AGENT_SOURCES) {
      const source = readFileSync(path, "utf8");
      source.split(/\r?\n/).forEach((line, index) => {
        const code = line.trim();
        // Comments describe the defect; they are not the defect. (This file's own fix is documented
        // by quoting the broken line, which an untrimmed scan reports as a live offender.)
        if (code.startsWith("//") || code.startsWith("*") || code.startsWith("/*")) return;
        // Only the RUN context's channel. `result.warnings = …` on an agent's own result object is a
        // different array with no aliasing contract.
        if (/(?:^|[^\w.])(?:ctx|context|c)\.warnings\s*=(?!=)/.test(code)) {
          offenders.push(`${file}:${index + 1}  ${code}`);
        }
      });
    }
    expect(offenders, `ctx.warnings must be mutated in place, never reassigned:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("scans a non-trivial number of files, so a passing result means something", () => {
    // A glob that silently matched nothing would pass forever.
    expect(AGENT_SOURCES.length).toBeGreaterThan(15);
    expect(AGENT_SOURCES.some((s) => s.file.endsWith("agent6-run.ts"))).toBe(true);
    expect(AGENT_SOURCES.some((s) => s.file.endsWith("mystery-orchestrator.ts"))).toBe(true);
  });

  it("clearWarningsInPlace — the REAL helper Agent 6 calls — keeps the array identity", () => {
    // Behavioural, not a source scan: this is the function that runs, exercised directly.
    const orchestratorWarnings = ["keep-1", "drop-me", "keep-2"];
    const ctx = { warnings: orchestratorWarnings };

    const removed = clearWarningsInPlace(ctx.warnings, new Set(["drop-me"]));

    expect(removed).toBe(1);
    expect(ctx.warnings).toBe(orchestratorWarnings);
    expect(orchestratorWarnings).toEqual(["keep-1", "keep-2"]);

    // The property that actually failed in production: a later stage's push must be visible.
    ctx.warnings.push("[Agent 9] geometry third_time");
    expect(orchestratorWarnings).toContain("[Agent 9] geometry third_time");
  });

  it("clearWarningsInPlace is a no-op on nothing-to-clear, and says so", () => {
    const warnings = ["a", "b"];
    expect(clearWarningsInPlace(warnings, new Set())).toBe(0);
    expect(clearWarningsInPlace(warnings, new Set(["absent"]))).toBe(0);
    expect(clearWarningsInPlace([], new Set(["a"]))).toBe(0);
    expect(warnings).toEqual(["a", "b"]);
  });

  it("clearWarningsInPlace matches on the trimmed value, as the call site does", () => {
    const warnings = ["  padded  ", "kept"];
    expect(clearWarningsInPlace(warnings, new Set(["padded"]))).toBe(1);
    expect(warnings).toEqual(["kept"]);
  });

});
