/**
 * X86 — the one Agent 5 gate that killed a run where every neighbour repairs first.
 *
 * `findLockedFactClueTimeConflicts` threw immediately. In `enforceAgent5DeterministicContracts`,
 * `checkCastNamePathConsistency` gets `repairCastNamePathConsistency`, `checkEraTimeStyleInClues` gets
 * `sanitizeEraTimeStyleInClues`, and `findCulpritDiscriminatingGaps` gets
 * `synthesizeMissingCulpritDiscriminatingClues` — each repairs, re-checks, and only then throws.
 *
 * IT COST A LIVE RUN on 2026-08-21 (PLAN-TO-90 0b.1, first attempt). The registry held
 * `clock_displayed_time = "a quarter past seven"` and `chime_time = "a quarter to seven"`, while the
 * clues put the clock face at 6:45 and the chimes at 7:15 — the two canonical values **transposed**.
 * The parsers were verified correct (`a quarter past seven` → 435, `a quarter to seven` → 405,
 * `a quarter to noon` → 705), so the gate was right that the case contradicted itself. The run died at
 * Agent 5 regardless, before a word of prose.
 *
 * WHERE THE LINE IS, and why it is drawn here. *A detector may guess; a repairer may not.* So exactly
 * one condition is repaired: **the clue text literally contains another locked fact's canonical
 * value** in the slot this fact owns. The registry is canonical by construction — Pillar 1 exists so
 * these values cannot drift — so a clue carrying a different REGISTRY value there is a transposition,
 * not a new assertion. Anything else still aborts: a time the registry has never heard of is a genuine
 * disagreement, and choosing a winner would be the over-reach this file refuses.
 */

import { describe, expect, it } from "vitest";

import {
  findLockedFactClueTimeConflicts,
  repairLockedFactClueTimeTranspositions,
} from "../agent5-run.js";

/** The 2026-08-21 case, reduced to the two facts and the two clues that transposed. */
const lockedFacts = () => [
  { id: "clock_displayed_time", description: "the lobby clock face", value: "a quarter past seven" },
  { id: "chime_time", description: "the chimes", value: "a quarter to seven" },
];

const caseWith = (clueIds: string[]) => ({
  CASE: {
    prose_requirements: { clue_to_scene_mapping: clueIds.map((id) => ({ clue_id: id, scene: 1 })) },
  },
});

const clue = (id: string, description: string) => ({
  id,
  description,
  pointsTo: "",
  supportsInferenceStep: 1,
});

/** Only the fields these gates read are populated. */
const bundle = (clues: ReturnType<typeof clue>[]) => ({ clues, redHerrings: [], audit: {} }) as never;

/**
 * The gate as the call sites now run it: detect, repair, re-detect, and throw only on what survives.
 * Driving `enforceAgent5DeterministicContracts` instead would trip `checkSourcePathValidity` a dozen
 * gates earlier and test everything except the behaviour that changed.
 */
const run = (clues: ReturnType<typeof clue>[]) => {
  const cml = caseWith(clues.map((c) => c.id)) as never;
  const facts = lockedFacts() as never;
  const repairs: string[] = [];
  let conflicts = findLockedFactClueTimeConflicts(cml, bundle(clues), facts);
  if (conflicts.length > 0) {
    repairs.push(
      ...repairLockedFactClueTimeTranspositions(cml, bundle(clues), facts).map(
        (r) => `Agent 5 locked-fact time transposition repair: ${r}`,
      ),
    );
    conflicts = findLockedFactClueTimeConflicts(cml, bundle(clues), facts);
  }
  if (conflicts.length > 0) {
    throw new Error(`Agent 5 CML-clue consistency gate failed (${conflicts.length} time conflict(s)).`);
  }
  return repairs;
};

describe("the gate must not fire on a case that is already correct", () => {
  /**
   * THE BIGGER HALF OF X86, found while testing the repairer. The reachability test used
   * `nameAppearsInText` for the fact VALUE as well as its description — a predicate built for cast
   * names, which falls back to the final token so "… Vane" matches "Mary Vane". For values:
   *
   *     "a quarter past seven" -> "seven"     "a quarter to seven" -> "seven"
   *
   * so each fact matched the OTHER fact's clue, the gate compared 435 against 405, and reported a
   * contradiction in a consistent case. The 2026-08-21 run was killed by THIS, not by a transposition.
   * It fires whenever two locked times share a final word — for clock values ("seven", "o'clock",
   * "night") that is the ordinary case, not an exotic one.
   */
  it("does not flag two consistent clues whose times share a final word", () => {
    expect(() =>
      run([
        clue("clue_face", "The lobby clock face showed a quarter past seven when the body was found."),
        clue("clue_chimes", "The chimes were heard at a quarter to seven from the lounge."),
      ]),
    ).not.toThrow();
  });

  it("repairs nothing when there was nothing wrong", () => {
    // A repair here would mean the false positive had merely been converted into a silent rewrite.
    const clues = [
      clue("clue_face", "The lobby clock face showed a quarter past seven when the body was found."),
      clue("clue_chimes", "The chimes were heard at a quarter to seven from the lounge."),
    ];
    expect(run(clues)).toEqual([]);
    expect(clues[0]!.description).toContain("a quarter past seven");
    expect(clues[1]!.description).toContain("a quarter to seven");
  });
});

describe("a transposition against the canonical registry is repaired, not fatal", () => {
  it("does not throw when the two registry values are swapped between clues", () => {
    expect(() =>
      run([
        clue("clue_face", "The lobby clock face showed a quarter to seven when the body was found."),
        clue("clue_chimes", "The chimes were heard at a quarter past seven from the lounge."),
      ]),
    ).not.toThrow();
  });

  it("rewrites each clue to its own fact's canonical value", () => {
    const clues = [
      clue("clue_face", "The lobby clock face showed a quarter to seven when the body was found."),
      clue("clue_chimes", "The chimes were heard at a quarter past seven from the lounge."),
    ];
    run(clues);
    expect(clues[0]!.description).toContain("a quarter past seven");
    expect(clues[0]!.description).not.toContain("a quarter to seven");
    expect(clues[1]!.description).toContain("a quarter to seven");
    expect(clues[1]!.description).not.toContain("a quarter past seven");
  });

  it("records what it changed, naming both facts", () => {
    // A silent repair is the X85 defect. The warning must let a reader reconstruct the swap.
    const warnings = run([
      clue("clue_face", "The lobby clock face showed a quarter to seven when the body was found."),
      clue("clue_chimes", "The chimes were heard at a quarter past seven from the lounge."),
    ]);
    const repair = warnings.find((w) => w.includes("transposition repair"));
    expect(repair).toBeDefined();
    expect(repair).toContain("clock_displayed_time");
  });
});

describe("everything that is NOT a transposition still aborts", () => {
  it("throws on a time the registry has never heard of", () => {
    // 6:15 is neither fact's value, so nothing proves which side is wrong. Guessing here would be
    // the over-reach the repairer exists to avoid.
    expect(() =>
      run([clue("clue_face", "The lobby clock face showed a quarter past six when the body was found.")]),
    ).toThrow(/consistency gate failed/);
  });

  it("leaves a clean case untouched and silent", () => {
    const clues = [
      clue("clue_face", "The lobby clock face showed a quarter past seven when the body was found."),
      clue("clue_chimes", "The chimes were heard at a quarter to seven from the lounge."),
    ];
    const warnings = run(clues);
    expect(warnings.filter((w) => w.includes("transposition repair"))).toEqual([]);
    expect(clues[0]!.description).toContain("a quarter past seven");
  });
});
