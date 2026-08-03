/**
 * S3 (architecture/REVIEW_01.md) — the regen pass registry.
 *
 * A registry that describes the code is worth nothing if it can drift from the code. These tests are
 * what make it load-bearing rather than decorative: they check the table against the ACTUAL exports,
 * the ACTUAL flag names in source, and the ACTUAL defect kinds the type system allows. If someone
 * adds a thirteenth regen pass and forgets the table, this fails.
 *
 * That is the whole point. The defect shape S3 exists to prevent is a defect quietly acquiring a
 * second repair body — which is only detectable if there is one place that claims to list them all,
 * and that place is checked.
 */

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  finishRegenPass,
  passesForDefectKind,
  REGEN_PASS_FLAGS,
  REGEN_PASS_REGISTRY,
  regenPassById,
  regenPassDidNotRun,
  REPAIRABLE_DEFECT_KINDS,
} from "../agent9-prose/regen-registry.js";
import * as regenIntegration from "../agent9-prose/regen-integration.js";
import type { ProseChapter, ProseDefect } from "../agent9-prose/types.js";

const REGEN_INTEGRATION_SRC = fileURLToPath(
  new URL("../agent9-prose/regen-integration.ts", import.meta.url),
);
const FLAG_AUDIT = fileURLToPath(new URL("../../../../architecture/FLAG-AUDIT.md", import.meta.url));

describe("registry ↔ code", () => {
  it("every registered runner is a real exported function", () => {
    for (const spec of REGEN_PASS_REGISTRY) {
      const exported = (regenIntegration as Record<string, unknown>)[spec.runner];
      expect(typeof exported, `${spec.id} → ${spec.runner}`).toBe("function");
    }
  });

  it("every exported regen pass is in the registry", () => {
    // The direction that catches a NEW pass added without registering it — the actual drift risk.
    const exportedPasses = Object.keys(regenIntegration).filter(
      (name) => /^run\w+RegenPass$/.test(name) || /^run\w+ResidualPass$/.test(name),
    );
    const registered = new Set(REGEN_PASS_REGISTRY.map((s) => s.runner));

    // `runInsertionRegenPass` is the shared CORE the insertion family delegates to, not a pass with
    // its own detector, so it is deliberately not a registry entry.
    const unregistered = exportedPasses.filter(
      (name) => !registered.has(name) && name !== "runInsertionRegenPass",
    );
    expect(unregistered, `unregistered regen passes: ${unregistered.join(", ")}`).toEqual([]);
  });

  it("has unique ids", () => {
    const ids = REGEN_PASS_REGISTRY.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("names only flags that actually appear in source", () => {
    const source = readFileSync(REGEN_INTEGRATION_SRC, "utf8");
    const workerAndProse = source + readFileSync(FLAG_AUDIT, "utf8");
    for (const flag of REGEN_PASS_FLAGS) {
      // Flags are read in the worker's agent9-run and registered in FLAG-AUDIT; a flag in neither is
      // a flag with no exit condition, which is the lifecycle failure S1 identified.
      expect(workerAndProse, `flag ${flag} is not registered in FLAG-AUDIT.md`).toContain(flag);
    }
  });

  it("classifies each pass into a family that matches its guard", () => {
    // insertion → may only ADD (guarded by preserveOriginalParagraphsValidator)
    // rewrite    → may MODIFY (needs its own fidelity guard)
    // Misclassifying an insertion pass as a rewrite removes the only guard between a targeted repair
    // and collateral re-gendering of shipped prose (repair.ts:153).
    for (const spec of REGEN_PASS_REGISTRY) {
      expect(["insertion", "rewrite"]).toContain(spec.family);
    }
    expect(regenPassById("clue")?.family).toBe("insertion");
    expect(regenPassById("scaffold")?.family).toBe("rewrite");
  });
});

describe("defect-kind coverage", () => {
  it("answers 'which pass repairs this defect kind?' in one lookup", () => {
    expect(passesForDefectKind("missing_clue").map((s) => s.id)).toEqual(["clue"]);
    expect(passesForDefectKind("mechanism_revealed_early").map((s) => s.id)).toEqual(["mechanism_reveal"]);
  });

  it("permits a defect kind to have more than one pass ONLY across scopes", () => {
    // dual_value has a per-chapter pass and a ship-scope residual pass. That is two SCOPES of one
    // repair, not two bodies of one repair — the distinction S3 exists to keep visible.
    const dual = passesForDefectKind("dual_value_no_contrast");
    expect(dual.length).toBe(2);
    expect(dual.map((s) => s.id).sort()).toEqual(["dual_value_contrast", "dual_value_full_story_residual"]);

    const clearance = passesForDefectKind("missing_clearance");
    expect(clearance.map((s) => s.id).sort()).toEqual(["clearance", "suspect_elimination"]);
  });

  it("exposes the repairable set so the deterministic floor's scope is explicit", () => {
    expect(REPAIRABLE_DEFECT_KINDS.has("missing_clue")).toBe(true);
    expect(REPAIRABLE_DEFECT_KINDS.has("scaffold_not_prose")).toBe(true);
    // `pronoun_mismatch` and `locked_fact_absent` have instructions but no registered PASS — they are
    // repaired inside other passes' validators, not by a pass of their own. Asserted so that stays a
    // deliberate fact rather than an oversight someone rediscovers.
    expect(REPAIRABLE_DEFECT_KINDS.has("pronoun_mismatch")).toBe(false);
  });
});

describe("finishRegenPass — the tail that used to be repeated per pass", () => {
  const chapter = { paragraphs: ["a"] } as ProseChapter;
  const defect = (ref: string): ProseDefect =>
    ({ chapter: 1, kind: "missing_clue", detail: "d", obligationRef: ref, severity: "hard" }) as ProseDefect;

  it("subtracts unresolved from attempted rather than assuming all-or-nothing", () => {
    // A pass that resolved two of three must report exactly that. Every pass re-expressed this rule
    // by hand; two of them expressed it as `unresolved.length === 0 ? [ref] : []`, which is only
    // correct for a single defect.
    const out = finishRegenPass(chapter, [defect("a"), defect("b"), defect("c")], [defect("b")]);
    expect(out.repaired.sort()).toEqual(["a", "c"]);
    expect(out.unresolved).toEqual(["b"]);
    expect(out.ran).toBe(true);
  });

  it("drops defects with no obligationRef instead of recording empty-string repairs", () => {
    const anonymous = { chapter: 1, kind: "leakage", detail: "d", severity: "hard" } as ProseDefect;
    const out = finishRegenPass(chapter, [anonymous], []);
    expect(out.repaired).toEqual([]);
  });

  it("reports everything repaired when nothing is unresolved", () => {
    const out = finishRegenPass(chapter, [defect("a")], []);
    expect(out.repaired).toEqual(["a"]);
    expect(out.unresolved).toEqual([]);
  });

  it("carries the scaffold pass's `floored` list, including an empty one", () => {
    // The scaffold pass always returned `floored`, empty or not. Losing the empty array would make
    // "the floor ran and changed nothing" indistinguishable from "the floor never ran".
    expect(finishRegenPass(chapter, [], [], { floored: [] }).floored).toEqual([]);
    expect(finishRegenPass(chapter, [], [], { floored: ["r1"] }).floored).toEqual(["r1"]);
    expect(finishRegenPass(chapter, [], []).floored).toBeUndefined();
  });

  it("regenPassDidNotRun marks ran=false and touches nothing", () => {
    const out = regenPassDidNotRun(chapter);
    expect(out).toEqual({ chapter, repaired: [], unresolved: [], ran: false });
    expect(out.chapter).toBe(chapter);
  });
});
