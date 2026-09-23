/**
 * A_100 A1 — ranked exemplar selection, pinned.
 *
 * The defect: `selectRelevantPatterns` was `filter(axis).slice(0, 3)` over a directory-sorted pool,
 * so Agent 3 saw the alphabetically first three cases on its axis, every run, forever. Sixteen of
 * nineteen identity cases never reached a prompt. These tests pin (a) that the flag-off path is
 * byte-identical to that behaviour, so nothing changes until someone chooses it, and (b) that with
 * the flag on, evidence outranks the alphabet.
 */
import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { selectRelevantPatterns, seedSelectionKey, loadSeedCMLFiles, type SeedSelectionPrefs } from "../utils/seed-loader.js";
import type { SeedPattern } from "../types.js";

const pat = (id: string, axis = "identity"): SeedPattern => ({
  id, title: id, axis,
  structure: { mechanismType: "x", falseAssumptionPattern: "x", constraintSpaceSize: 0, inferencePathSteps: 0, discriminatingTestMethod: "x" },
  content: { premise: "", falseAssumptionStatement: "", mechanismDescription: "", inferenceSketch: "", discriminatingTestDesign: "" },
} as unknown as SeedPattern);

/** A works root with encode reports and a verification manifest. */
const makeWorks = (spec: Record<string, { ok: number; total: number; state: string }>) => {
  const root = mkdtempSync(join(tmpdir(), "cml-a100-"));
  const works: Record<string, string> = {};
  for (const [id, s] of Object.entries(spec)) {
    mkdirSync(join(root, id), { recursive: true });
    writeFileSync(join(root, id, "encode-report.json"), JSON.stringify({
      spans: Array.from({ length: s.total }, (_, i) => ({ ok: i < s.ok })),
    }));
    works[id] = s.state;
  }
  writeFileSync(join(root, ".verification.json"), JSON.stringify({ works }));
  return root;
};

const ORIG = process.env.SEED_SELECTION_RANKED;
afterEach(() => { if (ORIG === undefined) delete process.env.SEED_SELECTION_RANKED; else process.env.SEED_SELECTION_RANKED = ORIG; });

describe("A_100 A1 — ranked exemplar selection", () => {
  // Alphabetical pool: the old slice would return a, b, c regardless of evidence.
  const pool = [pat("a_weak"), pat("b_weak"), pat("c_weak"), pat("d_strong"), pat("e_strong"), pat("z_other_axis", "temporal")];

  it("flag OFF is byte-identical to the old slice(0, 3)", () => {
    delete process.env.SEED_SELECTION_RANKED;
    expect(selectRelevantPatterns(pool, "identity", 3).map((p) => p.id)).toEqual(["a_weak", "b_weak", "c_weak"]);
    expect(seedSelectionKey()).toBe("slice");
  });

  it("flag ON: anchor coverage and verification outrank the alphabet", () => {
    process.env.SEED_SELECTION_RANKED = "true";
    const root = makeWorks({
      a_weak: { ok: 3, total: 20, state: "derived_unverified" },
      b_weak: { ok: 5, total: 20, state: "derived_unverified" },
      c_weak: { ok: 4, total: 20, state: "derived" },
      d_strong: { ok: 19, total: 19, state: "derived" },
      e_strong: { ok: 16, total: 20, state: "derived" },
    });
    try {
      const ids = selectRelevantPatterns(pool, "identity", 3, undefined, root).map((p) => p.id);
      expect(ids).toEqual(["d_strong", "e_strong", "c_weak"]);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  it("flag ON: a must-include source is always among the three", () => {
    process.env.SEED_SELECTION_RANKED = "true";
    const root = makeWorks({
      a_weak: { ok: 1, total: 20, state: "derived_unverified" },
      b_weak: { ok: 1, total: 20, state: "derived_unverified" },
      c_weak: { ok: 1, total: 20, state: "derived_unverified" },
      d_strong: { ok: 19, total: 19, state: "derived" },
      e_strong: { ok: 19, total: 19, state: "derived" },
    });
    try {
      const prefs: SeedSelectionPrefs = { mustInclude: "a_weak" };
      const ids = selectRelevantPatterns(pool, "identity", 3, prefs, root).map((p) => p.id);
      expect(ids).toContain("a_weak");
      expect(ids).toHaveLength(3);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  it("flag ON: equal scores resolve by id, deterministically, and only as the last resort", () => {
    process.env.SEED_SELECTION_RANKED = "true";
    const root = makeWorks({
      a_weak: { ok: 10, total: 20, state: "derived" }, b_weak: { ok: 10, total: 20, state: "derived" },
      c_weak: { ok: 10, total: 20, state: "derived" }, d_strong: { ok: 10, total: 20, state: "derived" },
      e_strong: { ok: 10, total: 20, state: "derived" },
    });
    try {
      const once = selectRelevantPatterns(pool, "identity", 3, undefined, root).map((p) => p.id);
      const twice = selectRelevantPatterns(pool, "identity", 3, undefined, root).map((p) => p.id);
      expect(once).toEqual(twice);
      expect(once).toEqual(["a_weak", "b_weak", "c_weak"]);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  /**
   * A_103 B4: with worksRoot omitted - the production call shape - the selector must still find the
   * evidence, via the root the corpus was last loaded from, never via a cwd-relative guess. MEASURED
   * before the fix, from C:\\: every read failed, every score was 0, the pick was alphabetical.
   */
  it("flag ON with worksRoot omitted uses the last-loaded root, not the cwd", () => {
    process.env.SEED_SELECTION_RANKED = "true";
    const root = mkdtempSync(join(tmpdir(), "cml-a103-"));
    const works = join(root, "library", "works");
    const spec: Record<string, { ok: number; total: number; state: string }> = {
      a_weak: { ok: 1, total: 20, state: "derived_unverified" }, b_weak: { ok: 1, total: 20, state: "derived_unverified" },
      c_weak: { ok: 1, total: 20, state: "derived_unverified" }, d_strong: { ok: 19, total: 19, state: "derived" },
      e_strong: { ok: 19, total: 19, state: "derived" },
    };
    const states: Record<string, string> = {};
    for (const [id, s] of Object.entries(spec)) {
      mkdirSync(join(works, id), { recursive: true });
      writeFileSync(join(works, id, "encode-report.json"), JSON.stringify({ spans: Array.from({ length: s.total }, (_, i) => ({ ok: i < s.ok })) }));
      writeFileSync(join(works, id, "case.cml2.yaml"), `CML_VERSION: 2.0\nCASE:\n  meta:\n    title: "${id}"\n  false_assumption:\n    type: identity\n`, "utf-8");
      states[id] = s.state;
    }
    writeFileSync(join(works, ".verification.json"), JSON.stringify({ works: states }));
    try {
      expect(loadSeedCMLFiles(works).length).toBe(5);          // remembers `works` as the root
      const ids = selectRelevantPatterns(pool, "identity", 3).map((p) => p.id);   // no worksRoot passed
      expect(ids.slice(0, 2)).toEqual(["d_strong", "e_strong"]);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });

  it("the memo key differs when the must-include source differs", () => {
    process.env.SEED_SELECTION_RANKED = "true";
    expect(seedSelectionKey({ mustInclude: "x" })).not.toBe(seedSelectionKey({ mustInclude: "y" }));
    expect(seedSelectionKey({ mustInclude: "x" })).not.toBe(seedSelectionKey());
  });
});
