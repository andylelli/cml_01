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
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const AGENT_SOURCES = [
  "agent1-run.ts", "agent2-run.ts", "agent2b-run.ts", "agent2c-run.ts", "agent2d-run.ts",
  "agent2e-run.ts", "agent3-run.ts", "agent3b-run.ts", "agent5-run.ts", "agent6-run.ts",
  "agent65-run.ts", "agent7-run.ts", "agent75-run.ts", "agent9-run.ts", "shared.ts",
].map((f) => ({ file: f, path: fileURLToPath(new URL(`../jobs/agents/${f}`, import.meta.url)) }));

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

  it("clearing warnings in place preserves the array the orchestrator holds", () => {
    // The exact shape agent6-run uses, asserted as a property so the fix cannot silently regress.
    const orchestratorWarnings: string[] = ["keep-1", "drop-me", "keep-2"];
    const ctx = { warnings: orchestratorWarnings };
    const toClear = new Set(["drop-me"]);

    const kept = ctx.warnings.filter((w) => !toClear.has(w.trim()));
    ctx.warnings.length = 0;
    for (const w of kept) ctx.warnings.push(w);

    expect(ctx.warnings).toBe(orchestratorWarnings); // identity: the alias survived
    expect(orchestratorWarnings).toEqual(["keep-1", "keep-2"]); // and the removal is visible to the report

    // A later stage's push must reach the orchestrator's array.
    ctx.warnings.push("[Agent 9] geometry third_time");
    expect(orchestratorWarnings).toContain("[Agent 9] geometry third_time");
  });
});
