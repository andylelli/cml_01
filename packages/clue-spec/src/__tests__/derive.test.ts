import { describe, expect, it } from "vitest";
import { deriveClueSpec } from "../derive.js";
import type { CmlCaseForClues } from "../types.js";

/**
 * The §4.4 worked example, as a frozen CML CASE. The clock was reset after the will signing; the
 * nephew is the convincing-but-innocent accused; Mrs. Hale is the culprit.
 */
function workedExample(): CmlCaseForClues {
  return {
    inference_path: {
      steps: [
        {
          observation: "The study clock had stopped at the time of the will signing.",
          correction: "But the gardener heard it chime the hour AFTER the signing — so it was reset.",
          effect: "The signing time on record is false; the will was signed later than claimed.",
        },
        {
          observation: "Only a household member could reach the study unseen.",
          correction: "The side passage was unlocked that evening, widening who could reach it.",
          effect: "Access does not single out the nephew.",
        },
        {
          observation: "The clock case bore no fresh fingerprints.",
          correction: "Mrs. Hale alone wore gloves at dinner, explaining the absence of prints.",
          effect: "The resetter handled the case without leaving prints.",
        },
      ],
    },
    false_assumption: { statement: "The clock fixes the time of death." },
    false_solution: {
      accused_suspect: "the nephew",
      supporting_points: [
        "The nephew inherited everything",
        "He was alone in the study at the recorded time",
      ],
      the_one_flaw: "He could not have reset a clock he never touched (no prints on the case).",
    },
    culpability: { culprits: ["Mrs. Hale"] },
    cast: [
      { name: "the nephew", culprit_eligibility: "eligible", alibi_window: "At dinner until nine." },
      { name: "Mrs. Hale", culprit_eligibility: "eligible", access_plausibility: "Free run of the house." },
      { name: "the constable", culprit_eligibility: "ineligible", alibi_window: "On his beat all evening." },
    ],
    hidden_model: { mechanism: { description: "The mantel clock was wound back, then reset after the signing." } },
    discriminating_test: {
      method: "reenactment",
      design: "Re-stage the signing and time the chime against a second clock.",
      knowledge_revealed: "The chime falls a full hour after the recorded signing time.",
      pass_condition: "The reenacted chime contradicts the recorded time.",
    },
  };
}

describe("deriveClueSpec — §4.1 mapping table", () => {
  it("emits exactly one observation + one contradiction slot per inference step", () => {
    const spec = deriveClueSpec(workedExample());
    const obs = spec.clueSlots.filter((s) => s.evidenceType === "observation" && s.supportsInferenceStep);
    const contra = spec.clueSlots.filter((s) => s.evidenceType === "contradiction");
    expect(obs).toHaveLength(3);
    expect(contra).toHaveLength(3);
    // each step's pair points at the right CASE path
    expect(spec.clueSlots.find((s) => s.id === "slot_obs_step1")?.sourceInCML).toBe(
      "CASE.inference_path.steps[0].observation",
    );
    expect(spec.clueSlots.find((s) => s.id === "slot_contra_step3")?.sourceInCML).toBe(
      "CASE.inference_path.steps[2].correction",
    );
  });

  it("emits a mechanism-visibility slot", () => {
    const spec = deriveClueSpec(workedExample());
    expect(spec.clueSlots.find((s) => s.id === "slot_mechanism_visible")?.sourceInCML).toBe(
      "CASE.hidden_model.mechanism.description",
    );
  });

  it("A_67 FIX-2: emits an essential/early/physical method-evidence slot from CASE.death_method, distinct from the mechanism", () => {
    const spec = deriveClueSpec({ ...workedExample(), death_method: "strangulation" });
    const method = spec.clueSlots.find((s) => s.id === "slot_method_evidence");
    expect(method).toBeDefined();
    expect(method!.sourceInCML).toBe("CASE.death_method");
    expect(method!.criticality).toBe("essential");
    expect(method!.suggestedPlacement).toBe("early");
    expect(method!.category).toBe("physical");
    expect(method!.evidenceType).toBe("observation");
    // planted early + cited at the reveal, NOT bound to a mid/late inference step (which would push placement late)
    expect(method!.supportsInferenceStep).toBeUndefined();
    // the cause of death is a DIFFERENT source than the concealment mechanism
    expect(method!.sourceInCML).not.toBe(
      spec.clueSlots.find((s) => s.id === "slot_mechanism_visible")?.sourceInCML,
    );
  });

  it("A_67 FIX-2: emits NO method-evidence slot when CASE.death_method is absent", () => {
    expect(deriveClueSpec(workedExample()).clueSlots.some((s) => s.id === "slot_method_evidence")).toBe(false);
    expect(deriveClueSpec({}).clueSlots.some((s) => s.id === "slot_method_evidence")).toBe(false);
  });

  it("emits a discriminating-evidence slot when the test has no declared evidence_clues", () => {
    const spec = deriveClueSpec(workedExample());
    expect(spec.clueSlots.some((s) => s.id === "slot_discrim_evidence")).toBe(true);
  });

  it("reuses declared discriminating evidence_clues ids verbatim when present", () => {
    const cml = workedExample();
    cml.discriminating_test!.evidence_clues = ["clue_chime_witness", { id: "clue_second_clock" }];
    const spec = deriveClueSpec(cml);
    expect(spec.clueSlots.some((s) => s.id === "clue_chime_witness")).toBe(true);
    expect(spec.clueSlots.some((s) => s.id === "clue_second_clock")).toBe(true);
    // ...and then it does NOT also emit the generic fallback slot
    expect(spec.clueSlots.some((s) => s.id === "slot_discrim_evidence")).toBe(false);
  });

  it("emits one direct-evidence slot per culprit, pointed at the culprit's cast index", () => {
    const spec = deriveClueSpec(workedExample());
    const slot = spec.clueSlots.find((s) => s.id === "slot_culprit_direct_mrs_hale");
    expect(slot).toBeDefined();
    expect(slot?.sourceInCML).toBe("CASE.cast[1].access_plausibility"); // Mrs. Hale is cast[1]
  });

  it("emits an elimination slot for each eligible non-culprit, and NOT for culprits or ineligibles", () => {
    const spec = deriveClueSpec(workedExample());
    const elim = spec.clueSlots.filter((s) => s.evidenceType === "elimination");
    expect(elim.map((s) => s.id)).toEqual(["slot_eliminate_the_nephew"]);
    expect(spec.clueSlots.some((s) => s.id === "slot_eliminate_mrs_hale")).toBe(false); // culprit
    expect(spec.clueSlots.some((s) => s.id === "slot_eliminate_the_constable")).toBe(false); // ineligible
  });

  it("emits the hinge slot from false_solution.the_one_flaw", () => {
    const spec = deriveClueSpec(workedExample());
    expect(spec.clueSlots.find((s) => s.id === "slot_flaw")?.sourceInCML).toBe(
      "CASE.false_solution.the_one_flaw",
    );
  });

  it("derives one red-herring slot per false_solution.supporting_point (§4.2)", () => {
    const spec = deriveClueSpec(workedExample());
    expect(spec.redHerringSlots).toHaveLength(2);
    expect(spec.redHerringSlots[0]).toMatchObject({
      id: "slot_rh_1",
      supportsAssumption: "The nephew inherited everything",
      sourceInCML: "CASE.false_solution.supporting_points[0]",
    });
  });
});

describe("deriveClueSpec — invariants (§9.4)", () => {
  it("every slot id is unique", () => {
    const spec = deriveClueSpec(workedExample());
    const ids = [...spec.clueSlots, ...spec.redHerringSlots].map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every sourceInCML is a real CASE path", () => {
    const spec = deriveClueSpec(workedExample());
    for (const s of [...spec.clueSlots, ...spec.redHerringSlots]) {
      expect(s.sourceInCML.startsWith("CASE."), `${s.id}: ${s.sourceInCML}`).toBe(true);
    }
  });

  it("RED-HERRING INVARIANT: no red-herring source overlaps the inference_path (can't reinforce truth)", () => {
    const spec = deriveClueSpec(workedExample());
    for (const rh of spec.redHerringSlots) {
      expect(rh.sourceInCML.includes("inference_path")).toBe(false);
      expect(rh.sourceInCML.startsWith("CASE.false_solution")).toBe(true);
    }
  });

  it("essential clue slots are never suggested 'late' (must precede the discriminating test)", () => {
    const spec = deriveClueSpec(workedExample());
    for (const s of spec.clueSlots.filter((c) => c.criticality === "essential")) {
      expect(s.suggestedPlacement).not.toBe("late");
    }
  });
});

describe("deriveClueSpec — robustness", () => {
  it("accepts a { CASE: ... } wrapper identically to a bare CASE", () => {
    const bare = deriveClueSpec(workedExample());
    const wrapped = deriveClueSpec({ CASE: workedExample() });
    expect(wrapped).toEqual(bare);
  });

  it("returns an empty-but-valid spec for an empty CML (no throw)", () => {
    const spec = deriveClueSpec({});
    expect(spec.clueSlots).toEqual([]);
    expect(spec.redHerringSlots).toEqual([]);
  });

  it("tolerates missing optional blocks (no false_solution, no mechanism)", () => {
    const spec = deriveClueSpec({
      inference_path: { steps: [{ observation: "o", correction: "c", effect: "e" }] },
      culpability: { culprits: [] },
      cast: [],
    });
    expect(spec.clueSlots.map((s) => s.id)).toEqual(["slot_obs_step1", "slot_contra_step1"]);
    expect(spec.redHerringSlots).toEqual([]);
  });
});
