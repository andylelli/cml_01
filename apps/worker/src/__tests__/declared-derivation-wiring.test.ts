/**
 * WIRING TEST for the Phase 1 declared-derivation check.
 *
 * WHY THIS FILE EXISTS. The check was written inline inside `runAgent3b`, which meant the ONLY way
 * to find out whether it ran was to pay for a run. CLAUDE.md is explicit about where that ends:
 * *"verify a lever by its agent label in `logs/llm-prompts-full.jsonl`, not by grepping the module.
 * Three flags were found to be no-ops on 2026-08-29 despite looking correctly wired."* The block is
 * now an exported function so the flag gate, the telemetry and the violations can all be exercised
 * against a real context shape for nothing.
 *
 * The fixtures are REGISTRY-shaped, not artifact-shaped, and that distinction is the point.
 * `buildRegistryFromPrimaryDevice` runs `wordifyLockedFactValue` and
 * `stripLeadingArticleFromLockedValue` before anything reads a locked fact, so the check sees
 * "quarter to six on the evening prior" — WITHOUT the article the artifact carries. Measuring one
 * shape and shipping against another is what let the forbidden-time-form check emit 18 warnings
 * without once naming the defect it was built for.
 *
 * VERIFIED against the real transform over all 44 archived runs: raw and registry shapes give the
 * same firing set, 14/44, zero disagreements.
 */

import { afterEach, describe, expect, it } from "vitest";

import {
  applyDeclaredDerivationCheck,
  isDeclaredDerivationsEnabled,
  stripLeadingArticleFromLockedValue,
} from "../jobs/agents/agent3b-run.js";

const ORIGINAL = process.env.AGENT3B_DECLARED_DERIVATIONS;
afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.AGENT3B_DECLARED_DERIVATIONS;
  else process.env.AGENT3B_DECLARED_DERIVATIONS = ORIGINAL;
});

/** The real `canary_1788457673112` facts, put through the real registry transform. */
const registryShaped = (facts: Array<{ id: string; value: string; derivedFrom?: string[] }>) =>
  facts.map((f) => ({ ...f, value: stripLeadingArticleFromLockedValue(f.value) }));

const REAL_CASE = registryShaped([
  { id: "call_sheet_date", value: "a quarter to six on the evening prior" },
  {
    id: "actual_call_sheet_creation",
    value: "twenty minutes past three on the murder day",
    derivedFrom: ["call_sheet_date", "call_sheet_creation_delay"],
  },
  { id: "call_sheet_creation_delay", value: "one hour and fifty-five minutes" },
]);

const ctxWith = (registry: unknown[]) => ({ lockedFactRegistry: registry, warnings: [] as string[] }) as any;

describe("applyDeclaredDerivationCheck — the wiring, not the algorithm", () => {
  it("the real registry transform strips the article, and the check still fires", () => {
    // Pins the transform itself, so a change to it cannot silently un-wire the check.
    expect(REAL_CASE[0].value).toBe("quarter to six on the evening prior");
    process.env.AGENT3B_DECLARED_DERIVATIONS = "true";
    const ctx = ctxWith(REAL_CASE);
    expect(applyDeclaredDerivationCheck(ctx)).toHaveLength(1);
  });

  it("is a complete no-op with the flag off — no violations AND no warning", () => {
    delete process.env.AGENT3B_DECLARED_DERIVATIONS;
    const ctx = ctxWith(REAL_CASE);
    expect(applyDeclaredDerivationCheck(ctx)).toEqual([]);
    expect(ctx.warnings).toEqual([]);
  });

  it("reads the flag at CALL time, not at module load (ADR-0004)", () => {
    delete process.env.AGENT3B_DECLARED_DERIVATIONS;
    expect(isDeclaredDerivationsEnabled()).toBe(false);
    process.env.AGENT3B_DECLARED_DERIVATIONS = "true";
    expect(isDeclaredDerivationsEnabled()).toBe(true);
    process.env.AGENT3B_DECLARED_DERIVATIONS = "1";
    expect(isDeclaredDerivationsEnabled()).toBe(true);
    process.env.AGENT3B_DECLARED_DERIVATIONS = "false";
    expect(isDeclaredDerivationsEnabled()).toBe(false);
  });

  it("emits the spine telemetry even when the arithmetic is CLEAN", () => {
    // The whole point: "clean" and "never looked" must not write the same log.
    process.env.AGENT3B_DECLARED_DERIVATIONS = "true";
    const ctx = ctxWith(
      registryShaped([
        { id: "t_start", value: "a quarter past nine in the evening" },
        { id: "t_end", value: "twenty minutes to ten in the evening" },
        { id: "gap", value: "twenty-five minutes", derivedFrom: ["t_start", "t_end"] },
      ]),
    );
    expect(applyDeclaredDerivationCheck(ctx)).toEqual([]);
    expect(ctx.warnings.some((w: string) => w.startsWith("[X38-spine]"))).toBe(true);
    expect(ctx.warnings.join(" ")).toContain("closes");
  });

  it("survives an empty or missing registry without throwing", () => {
    process.env.AGENT3B_DECLARED_DERIVATIONS = "true";
    expect(() => applyDeclaredDerivationCheck(ctxWith([]))).not.toThrow();
    const bare = { warnings: [] as string[] } as any;
    expect(() => applyDeclaredDerivationCheck(bare)).not.toThrow();
    expect(applyDeclaredDerivationCheck(bare)).toEqual([]);
  });

  it("names the offending fact, so the regeneration feedback is actionable", () => {
    process.env.AGENT3B_DECLARED_DERIVATIONS = "true";
    const violations = applyDeclaredDerivationCheck(ctxWith(REAL_CASE));
    expect(violations[0].code).toBe("declared_derivation_broken");
    expect(violations[0].message).toContain("actual_call_sheet_creation");
  });
});
