import { describe, expect, it } from "vitest";

import { deriveStoryGeometry, selectClincherClue } from "../derive.js";
import type { GeometryClue, GeometryOutline } from "../types.js";

const GOLDEN_AGE_10: GeometryOutline = {
  acts: [
    {
      scenes: [
        { beat: "gathering", title: "The Gathering" },
        { beat: "crime", title: "The Body in the Library" },
        { beat: "first_enquiries", title: "First Enquiries" },
      ],
    },
    {
      scenes: [
        { beat: "motives", title: "Motives" },
        { beat: "alibis", title: "Alibis" },
        { beat: "false_solution", title: "A Solution Too Neat" },
        { beat: "secrets", title: "Secrets" },
        { beat: "pattern", title: "The Pattern" },
      ],
    },
    {
      scenes: [
        { beat: "final_trap", title: "The Culprit Revealed" },
        { beat: "revelation", title: "Aftermath" },
      ],
    },
  ],
};

const CLUES: GeometryClue[] = [
  { id: "clue_fabric", category: "physical", criticality: "essential", description: "A torn scrap of grey wool caught on the terrace rail", keyTerms: ["fabric", "wool"], supportsInferenceStep: 3 },
  { id: "clue_ledger", category: "testimonial", criticality: "supporting", description: "The porter's ledger records nobody leaving" },
  { id: "clue_bruise", category: "physical", criticality: "essential", description: "Bruising at the throat", isDeathMethodTell: true, keyTerms: ["throat"] },
];

const CML = {
  CASE: {
    culpability: { culprits: ["Hugo Hale"] },
    death_method: "strangled with a cord",
    hidden_model: { mechanism: { actual_time_of_death: "10:15", apparent_time_of_death: "8:50" } },
    false_solution: { accused_suspect: "Eleanor Frey" },
    cast: [{ name: "Hugo Hale", role_archetype: "suspect" }],
  },
};

describe("deriveStoryGeometry", () => {
  const geometry = deriveStoryGeometry({ cml: CML, clues: CLUES, narrative: GOLDEN_AGE_10 });

  it("closes on a well-formed Golden-Age outline", () => {
    expect(geometry.closure.closed).toBe(true);
    expect(geometry.closure.unmet).toEqual([]);
  });

  it("reads both temporal anchors from the CML rather than inventing a cardinality rule", () => {
    expect(geometry.timeModel).toMatchObject({ trueTime: "10:15", apparentTime: "8:50" });
  });

  it("selects the clincher from clues that already exist, and never the method tell", () => {
    expect(geometry.clincher?.clueId).toBe("clue_fabric");
    expect(geometry.clincher?.source).toBe("derived");
    expect(geometry.clincher?.uniqueToCulprit).toBe("Hugo Hale");
  });

  /**
   * X44 (REVIEW_10 §5) — the obligation the 08-06 reader asked for and the contract never carried.
   * An obligation the model is GIVEN must be one the acceptance test can SCORE, so the two gate on
   * the same condition: both anchors, or neither.
   */
  it("X44 — the reveal contract owes both times, stated together", () => {
    const reveal = geometry.chapterContract.find((c) => c.role === "reveal")!;
    const owed = reveal.mustContain.join(" ");
    expect(owed).toMatch(/both times stated together/);
    expect(owed).toContain("8:50");
    expect(owed).toContain("10:15");
  });

  it("X44 — omits the obligation when the case declares only one anchor", () => {
    const oneAnchor = {
      CASE: { ...CML.CASE, hidden_model: { mechanism: { actual_time_of_death: "10:15" } } },
    };
    const g = deriveStoryGeometry({ cml: oneAnchor, clues: CLUES, narrative: GOLDEN_AGE_10 });
    const reveal = g.chapterContract.find((c) => c.role === "reveal")!;
    expect(reveal.mustContain.join(" ")).not.toMatch(/both times stated together/);
    // The obligations that do not depend on the clock are untouched.
    expect(reveal.mustContain.join(" ")).toMatch(/named outright/);
  });

  it("plants the clincher by chapter 3 and pays it off in the reveal", () => {
    expect(geometry.clincher?.plantByChapter).toBe(3);
    expect(geometry.clincher?.payoffChapter).toBe(9); // final_trap, not the last chapter
  });

  it("puts the method signature in chapter 1 with checkable terms", () => {
    expect(geometry.methodSignature).toMatchObject({ plantChapter: 1 });
    expect(geometry.methodSignature?.keyTerms).toContain("ligature");
  });

  it("binds only the load-bearing chapters", () => {
    expect(geometry.chapterContract.map((c) => [c.chapter, c.role])).toEqual([
      [1, "opening"],
      [6, "false_solution"],
      [9, "reveal"],
      [10, "aftermath"],
    ]);
  });

  it("gives the aftermath chapter the negative obligation nothing else can express", () => {
    const aftermath = geometry.chapterContract.find((c) => c.role === "aftermath");
    expect(aftermath?.mustNotContain.length).toBeGreaterThan(0);
    expect(aftermath?.mustNotContain.join(" ")).toMatch(/restatement of the method/);
  });

  it("prefers an LLM-resolved clincher when one is supplied, and records the provenance", () => {
    const resolved = deriveStoryGeometry({
      cml: CML,
      clues: CLUES,
      narrative: GOLDEN_AGE_10,
      resolution: { clincherClueId: "clue_ledger" },
    });
    expect(resolved.clincher?.clueId).toBe("clue_ledger");
    expect(resolved.clincher?.source).toBe("llm");
  });

  it("is total on an empty case — a missing field is a diagnosis, never a throw", () => {
    const empty = deriveStoryGeometry({ cml: {} });
    expect(empty.closure.closed).toBe(false);
    expect(empty.closure.unmet.length).toBeGreaterThan(0);
  });
});

describe("chapter-contract collisions", () => {
  /**
   * FOUND ON REVIEW 2026-08-03. Contracts were added opening → false_solution → reveal → aftermath and
   * skipped any chapter that already had one. An outline whose false-solution beat lands on the same
   * chapter as the reveal — which happens whenever there is no `final_trap` beat and the last chapter
   * is `false_solution` — therefore dropped the REVEAL contract, and with it every disclosure check
   * the acceptance test performs. The most important obligation in the object vanished because of the
   * order two lines were written in.
   */
  const sixEndingOnFalseSolution: GeometryOutline = {
    acts: [{ scenes: [
      { beat: "gathering" }, { beat: "crime" }, { beat: "first_enquiries" },
      { beat: "motives" }, { beat: "alibis" }, { beat: "false_solution" },
    ] }],
  };

  it("keeps the reveal contract when the false solution lands on the same chapter", () => {
    const g = deriveStoryGeometry({ cml: CML, clues: CLUES, narrative: sixEndingOnFalseSolution });
    const sixth = g.chapterContract.find((c) => c.chapter === 6);
    expect(sixth?.role).toBe("reveal");
  });

  it("merges the displaced role's positive obligations rather than losing them", () => {
    const g = deriveStoryGeometry({ cml: CML, clues: CLUES, narrative: sixEndingOnFalseSolution });
    const sixth = g.chapterContract.find((c) => c.chapter === 6)!;
    expect(sixth.mustContain.join(" ")).toMatch(/named outright/);
    expect(sixth.mustContain.join(" ")).toMatch(/accuses Eleanor Frey/);
  });

  it("never carries two roles' contradictory prohibitions in one contract", () => {
    // A one-chapter story is the sharp case: the opening must NOT reveal the culprit, and the reveal
    // MUST. Only the winning role's prohibitions survive.
    const single: GeometryOutline = { acts: [{ scenes: [{ beat: "revelation" }] }] };
    const g = deriveStoryGeometry({ cml: CML, clues: CLUES, narrative: single });
    const only = g.chapterContract.find((c) => c.chapter === 1)!;
    expect(only.role).toBe("reveal");
    expect(only.mustNotContain.join(" ")).not.toMatch(/identity of the culprit/);
  });
});

describe("the clincher is selected, never authored", () => {
  /**
   * FOUND ON REVIEW 2026-08-03. A resolve returning an unknown clue id plus a sentence attached free
   * prose to a different clue's id and marked it `source: "llm"` — the external reviewer's own
   * suggested sentence travelling into the prose prompt as the clincher trace. That is §3 breached
   * through the back door: a trace mapping to no clue is an invented clue.
   */
  it("ignores a restatement whose clue does not exist", () => {
    const g = deriveStoryGeometry({
      cml: CML, clues: CLUES, narrative: GOLDEN_AGE_10,
      resolution: { clincherClueId: "no_such_clue", clincherTrace: "Eleanor held the torn fabric beside Hugo's cuff." },
    });
    expect(g.clincher?.trace).not.toMatch(/Eleanor held/);
    expect(g.clincher?.source).toBe("derived");
  });

  it("honours a restatement of a clue that does exist", () => {
    const g = deriveStoryGeometry({
      cml: CML, clues: CLUES, narrative: GOLDEN_AGE_10,
      resolution: { clincherClueId: "clue_fabric", clincherTrace: "grey wool torn from a cuff" },
    });
    expect(g.clincher?.trace).toBe("grey wool torn from a cuff");
    expect(g.clincher?.source).toBe("llm");
  });
});

/**
 * CS2 (REVIEW_05 §5, §23) — a DECLARED clincher outranks scoring.
 *
 * Until `@cml/clue-spec` is promoted (CS1), no clue carries `role`, and `selectClincherClue` scores
 * the set and takes the best available. On three measured runs that winner was an `optional` clue,
 * so geometry hung a plant-before-payoff obligation on a clue the pipeline may drop. When the clue
 * set declares which clue is the clincher, scoring stops being the decision.
 */
describe("selectClincherClue — CS2 declared role", () => {
  const scoringFavourite: GeometryClue = {
    id: "clue_physical_optional",
    description: "A scorched glove tip beside the hearth.",
    category: "physical",
    criticality: "optional",
    supportsInferenceStep: 2,
  };
  const declared: GeometryClue = {
    id: "slot_clincher",
    description: "The right glove, scorched by the clock spring.",
    category: "testimonial", // deliberately scores WORSE on every other signal
    criticality: "essential",
    role: "clincher",
  };

  it("picks the declared clincher over the clue scoring would choose", () => {
    expect(selectClincherClue([scoringFavourite, declared])?.id).toBe("slot_clincher");
    // order-independent — a sort that depended on input order would pass one of these only
    expect(selectClincherClue([declared, scoringFavourite])?.id).toBe("slot_clincher");
  });

  it("still scores normally when nothing is declared — the fallback is unchanged", () => {
    expect(selectClincherClue([scoringFavourite])?.id).toBe("clue_physical_optional");
    expect(selectClincherClue([])).toBeNull();
  });

  it("a declared clincher wins even when it is also the death-method tell's shape", () => {
    // isDeathMethodTell scores -6 precisely to keep the two obligations apart; a DECLARATION is a
    // stronger signal than that heuristic, and the clue set is the thing that knows.
    const declaredTell: GeometryClue = { ...declared, isDeathMethodTell: true };
    expect(selectClincherClue([scoringFavourite, declaredTell])?.id).toBe("slot_clincher");
  });
});
