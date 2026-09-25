/**
 * A_109 step 6 — the false solution, argued before it is refuted (`PROSE_V2_FALSE_LEAD`).
 *
 * The golden contracts are the known-positive of the DEFECT: every supporting point unowned, and the
 * accused cleared in chapter 5 before chapter 6 accuses them — 4 of 4. Hand-built cases pin the rules
 * the golden four do not exercise: a later refutation chapter, a refutation stated too early, no
 * false-solution chapter, an accused who is the culprit.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildCaseModel, walkReader } from "@cml/cml";
import { describe, expect, it } from "vitest";

import { buildBookContract } from "../book-contract.js";
import { buildContractCore } from "../contract.js";
import { TEMPLATE } from "../contract-phrases.js";
import { readerInputOf } from "../reader-input.js";
import type { ContractInput } from "../types.js";

const golden = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..", "eval", "golden");
const bundles = existsSync(golden) ? readdirSync(golden).filter((f) => f.startsWith("bundle-")) : [];
const load = (file: string) => JSON.parse(readFileSync(join(golden, file), "utf8")).artifacts;
const contractOf = (a: Record<string, any>, falseLead?: boolean) =>
  buildBookContract({
    cml: a.cml ?? {},
    clues: a.clues ?? null,
    outline: a.outline?.narrative ?? a.outline,
    cast: a.cast?.cast ?? a.cast,
    profiles: a.character_profiles ?? null,
    humourLevel: "classic",
    ...(falseLead === undefined ? {} : { falseLead }),
  });

describe("the golden four — the defect, and the flag", () => {
  it.skipIf(bundles.length === 0)("KNOWN-POSITIVE (the defect, flag OFF): no point is owned, and the accused is cleared before the chapter that accuses them", () => {
    for (const file of bundles) {
      const a = load(file);
      const accused = a.cml.CASE.false_solution.accused_suspect;
      const contract = contractOf(a);
      expect(contract.scenes.some((s) => s.falseLeads || s.falseCase)).toBe(false);
      const clearedIn = contract.scenes.filter((s) => s.eliminationsAllowed.some((e) => e.name === accused)).map((s) => s.chapter);
      expect(clearedIn).toEqual([5]);
      expect(contract.roles.falseSolution).toBe(6);
    }
  });

  it.skipIf(bundles.length === 0)("KNOWN-NEGATIVE: the flag OFF is byte-for-byte today's contract", () => {
    for (const file of bundles) {
      const a = load(file);
      expect(JSON.stringify(contractOf(a, false))).toBe(JSON.stringify(contractOf(a)));
    }
  });

  it.skipIf(bundles.length === 0)("ON: every point owned once, after the crime and before the accusation; the clearance after it; the chapter told what it argues from", () => {
    for (const file of bundles) {
      const a = load(file);
      const fs = a.cml.CASE.false_solution;
      const contract = contractOf(a, true);
      const owned = contract.scenes.flatMap((s) => (s.falseLeads ?? []).map((l) => ({ chapter: s.chapter, ...l })));
      expect(owned.map((o) => o.point).sort()).toEqual([...fs.supporting_points].map(String).sort());
      const crime = contract.scenes.find((s) => s.beat === "crime")!.chapter;
      for (const o of owned) {
        expect(o.accused).toBe(fs.accused_suspect);
        expect(o.chapter).toBeGreaterThan(crime);
        expect(o.chapter).toBeLessThan(contract.roles.falseSolution!);
      }
      const clearedIn = contract.scenes.filter((s) => s.eliminationsAllowed.some((e) => e.name === fs.accused_suspect)).map((s) => s.chapter);
      expect(clearedIn).toEqual([6]);
      const fsScene = contract.scenes.find((s) => s.chapter === contract.roles.falseSolution)!;
      expect(fsScene.falseCase).toEqual({ accused: fs.accused_suspect, shownIn: [...new Set(owned.map((o) => o.chapter))].sort((x, y) => x - y), brokenIn: 6 });
      for (const o of owned) expect(contract.bible.text).toContain(`${o.point} — shown in chapter ${o.chapter}`);
      expect(contract.notes.some((n) => n.includes("clearance moved from chapter 5 to 6"))).toBe(true);
      expect(fsScene.present).toContain(fs.accused_suspect);
    }
  });

  it.skipIf(bundles.length === 0)("the reader model: the accused leads before the culprit in 2 of 4; the culprit's own clues still decide by chapter 5", () => {
    let accusedFirst = 0;
    for (const file of bundles) {
      const a = load(file);
      const model = buildCaseModel({ cml: a.cml, clues: a.clues });
      const r = walkReader(model, readerInputOf(contractOf(a, true)));
      const leaders = r.walk.filter((w) => w.chapter < 8).map((w) => w.leader).filter(Boolean);
      if (leaders[0] === a.cml.CASE.false_solution.accused_suspect) accusedFirst += 1;
      expect(r.culpritLeadsAt!).toBeLessThanOrEqual(5);
    }
    expect(accusedFirst).toBe(2);
  });
});

const base = (overrides: { falseSolution?: Record<string, unknown>; beats?: string[]; culprit?: string } = {}): ContractInput => {
  const beats = overrides.beats ?? ["gathering", "crime", "first_enquiries", "motives", "alibis", "false_solution", "secrets", "final_trap", "revelation"];
  return {
    cml: {
      CASE: {
        culpability: { culprits: [overrides.culprit ?? "Leonard Pike"] },
        cast: [
          { name: "Leonard Pike", role_archetype: "suspect" },
          { name: "Charles Wentworth", role_archetype: "suspect" },
          { name: "Margot Ellsworth", role_archetype: "suspect" },
          { name: "Gerald Harcourt", role_archetype: "detective" },
          { name: "Beatrice Langley", role_archetype: "victim" },
        ],
        false_solution: overrides.falseSolution ?? {
          accused_suspect: "Charles Wentworth",
          supporting_points: ["Charles Wentworth was seen at the ladder at ten.", "His gloves were wet."],
          the_one_flaw: "The ladder was moved after ten.",
        },
        prose_requirements: {
          suspect_clearance_scenes: [
            { suspect_name: "Charles Wentworth", clearance_method: "the ferryman's log" },
            { suspect_name: "Margot Ellsworth", clearance_method: "the kitchen book" },
          ],
        },
      },
    },
    clues: { clues: [] },
    outline: {
      acts: [
        {
          scenes: beats.map((beat, i) => ({
            sceneNumber: i + 1,
            beat,
            title: `Chapter ${i + 1}`,
            characters: i === 3 ? ["Gerald Harcourt", "Charles Wentworth"] : ["Gerald Harcourt", "Margot Ellsworth"],
            setting: { location: "the house" },
          })),
        },
      ],
    },
    cast: { characters: [{ name: "Leonard Pike" }, { name: "Charles Wentworth" }, { name: "Margot Ellsworth" }, { name: "Gerald Harcourt" }] },
    profiles: null,
    humourLevel: "classic",
    falseLead: true,
  };
};

describe("the rules the golden four do not exercise", () => {
  it("the accused's own chapter takes the first point; the points keep the case's order", () => {
    const core = buildContractCore(base());
    const owned = core.scenes.flatMap((s) => (s.falseLeads ?? []).map((l) => [s.chapter, l.point] as const));
    expect(owned.map(([c]) => c)).toContain(4);
    expect(owned.map(([, p]) => p)).toEqual(["Charles Wentworth was seen at the ladder at ten.", "His gloves were wet."]);
    expect(owned.map(([c]) => c)).toEqual([...owned.map(([c]) => c)].sort((x, y) => x - y));
  });

  it("a refutation the case places later than the accusation (and before the reveal) takes the clearance", () => {
    const core = buildContractCore(base({ falseSolution: { accused_suspect: "Charles Wentworth", supporting_points: ["Seen at the ladder."], refuted_in_chapter: 7 } }));
    expect(core.scenes.find((s) => s.chapter === 7)!.eliminationsAllowed.map((e) => e.name)).toContain("Charles Wentworth");
    expect(core.scenes.find((s) => s.chapter === 6)!.falseCase).toEqual({ accused: "Charles Wentworth", shownIn: [4], brokenIn: 7 });
  });

  it("a refutation stated BEFORE the accusation is not believed — the false-solution chapter breaks it", () => {
    const core = buildContractCore(base({ falseSolution: { accused_suspect: "Charles Wentworth", supporting_points: ["Seen at the ladder."], refuted_in_chapter: 3 } }));
    expect(core.scenes.find((s) => s.chapter === 6)!.falseCase!.brokenIn).toBe(6);
    expect(core.scenes.filter((s) => s.eliminationsAllowed.some((e) => e.name === "Charles Wentworth")).map((s) => s.chapter)).toEqual([6]);
  });

  it("KNOWN-NEGATIVE: no false-solution chapter — nothing scheduled, and the run report says so", () => {
    const core = buildContractCore(base({ beats: ["gathering", "crime", "first_enquiries", "motives", "alibis", "secrets", "final_trap", "revelation"] }));
    expect(core.scenes.some((s) => s.falseLeads || s.falseCase)).toBe(false);
    expect(core.notes.some((n) => n.includes("no false_solution chapter"))).toBe(true);
  });

  it("KNOWN-NEGATIVE: an accused who is the culprit is not argued as the wrong answer", () => {
    const core = buildContractCore(base({ culprit: "Charles Wentworth" }));
    expect(core.scenes.some((s) => s.falseLeads || s.falseCase)).toBe(false);
  });

  it("the wording is registered, so the echo checker catches it if the prose prints it", () => {
    expect(Object.values(TEMPLATE)).toEqual(expect.arrayContaining([TEMPLATE.falseLeadShown, TEMPLATE.falseCaseArgued]));
  });
});
