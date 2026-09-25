/**
 * ANALYSIS_109 M3 — does the case prove itself? The grounded extension of an argumentation framework.
 *
 * The golden cases all prove themselves (MEASURED 2026-09-25, after the clue reader was fixed), so the
 * known-positives are hand-built: an innocent nothing clears, a clearance aimed at the culprit, a cover
 * nothing breaks. The reader's own known-positives are the golden clues it first misread.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { analyseProof, buildCaseModel, clearedBySceneOf, groundedExtension, identifyPeople, readInference } from "../index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const golden = path.join(here, "..", "..", "..", "..", "eval", "golden");
const haveGolden = fs.existsSync(golden);

const cast = [
  { name: "Gerald Harcourt", role_archetype: "detective" },
  { name: "Beatrice Langley", role_archetype: "victim" },
  { name: "Leonard Pike", alibi_window: "Between ten and eleven" },
  { name: "Margot Ellsworth" },
  { name: "Evelyn Marsh" },
];
const base = {
  cast,
  culpability: { culprits: ["Leonard Pike"] },
  false_assumption: { statement: "The person at the ladder was Charles Wentworth." },
  discriminating_test: { design: "The dust at the ladder is compared with each man's shoe." },
};
const clue = (id: string, inference: string) => ({ id, observable: inference, inference });

describe("the grounded extension", () => {
  it("accepts the unattacked, defeats what they attack, and reinstates what they defend", () => {
    const g = groundedExtension(["a", "b", "c"], [["a", "b"], ["b", "c"]]);
    expect([...g].sort()).toEqual(["a", "c"]);
  });

  it("leaves an unresolved two-cycle out", () => {
    expect([...groundedExtension(["a", "b"], [["a", "b"], ["b", "a"]])]).toEqual([]);
  });
});

describe("does the case prove itself", () => {
  it("KNOWN-NEGATIVE: every innocent cleared, the cover broken by the test — proven", () => {
    const model = buildCaseModel({
      cml: { CASE: base },
      clues: [clue("c1", "Eliminates Margot Ellsworth."), clue("c2", "Evelyn Marsh cannot be the culprit.")],
    });
    const p = analyseProof(model);
    expect(p.culpritProven).toBe(true);
    expect(p.uncleared).toEqual([]);
  });

  it("KNOWN-POSITIVE: an innocent nothing clears is still a live suspect at the end", () => {
    const model = buildCaseModel({ cml: { CASE: base }, clues: [clue("c1", "Eliminates Margot Ellsworth.")] });
    expect(analyseProof(model).uncleared).toEqual(["Evelyn Marsh"]);
  });

  it("KNOWN-POSITIVE: a clearance aimed at the culprit is a contradiction in the case", () => {
    const model = buildCaseModel({
      cml: { CASE: base },
      clues: [clue("c1", "Eliminates Margot Ellsworth."), clue("c2", "Evelyn Marsh cannot be the culprit."), clue("c3", "Leonard Pike's alibi is confirmed; he is excluded.")],
    });
    expect(analyseProof(model).culpritCleared).toEqual(["Leonard Pike"]);
  });

  it("KNOWN-POSITIVE: a cover nothing breaks — no test, no clue implicating the culprit — leaves him unproven", () => {
    const model = buildCaseModel({
      cml: { CASE: { ...base, discriminating_test: {} } },
      clues: [clue("c1", "Eliminates Margot Ellsworth."), clue("c2", "Evelyn Marsh cannot be the culprit.")],
    });
    expect(analyseProof(model).culpritProven).toBe(false);
  });

  it("a stated clearance scene clears too", () => {
    const cml = { CASE: { ...base, prose_requirements: { suspect_clearance_scenes: [{ suspect_name: "Evelyn Marsh", clearance_method: "kitchen logs" }] } } };
    const model = buildCaseModel({ cml, clues: [clue("c1", "Eliminates Margot Ellsworth.")] });
    expect(analyseProof(model, { clearedByScene: clearedBySceneOf(cml) }).uncleared).toEqual([]);
  });
});

describe("reading a clue's inference, clause by clause", () => {
  const people = identifyPeople(["Margaret Hensley", "Charles Montague", "Annabelle Marwood", "Charles Fenwick"]);

  it("one clue can clear one person and implicate another", () => {
    expect(readInference("Eliminates Margaret Hensley and narrows the solution toward Charles Montague.", identifyPeople(["Margaret Hensley", "Charles Montague"]))).toEqual({
      clears: ["Margaret Hensley"],
      implicates: ["Charles Montague"],
    });
    expect(readInference("Annabelle Marwood cannot be the culprit, focusing suspicion on Charles Fenwick.", people)).toEqual({
      clears: ["Annabelle Marwood"],
      implicates: ["Charles Fenwick"],
    });
  });

  it.skipIf(!haveGolden)("KNOWN-POSITIVES from golden eb1251aa: an alibi broken implicates, a negated match clears, placed at the scene implicates", () => {
    const a = JSON.parse(fs.readFileSync(path.join(golden, "bundle-eb1251aa.json"), "utf8")).artifacts;
    const model = buildCaseModel({ cml: a.cml, clues: a.clues });
    const byId = (id: string) => model.clues.find((c) => c.id === id)!;
    expect(byId("clue_charles_alibi_conflict").implicates).toEqual(["Charles Pembroke"]);
    expect(byId("clue_footprint_moisture").clears).toEqual(["Eleanor Fairchild"]);
    expect(byId("clue_staff_witness").implicates).toEqual(["Charles Pembroke"]);
    expect(analyseProof(model, { clearedByScene: clearedBySceneOf(a.cml) })).toMatchObject({ culpritProven: true, uncleared: [], culpritCleared: [] });
  });
});
