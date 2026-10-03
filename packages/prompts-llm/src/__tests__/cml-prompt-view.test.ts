/**
 * A6-10 / A7-03 / A6-11 / A7-09 / A1X-12 — the shared CML prompt-header projection and the prompt
 * builders that read it. The refactor was byte-preserving (proved against the archived store with
 * CML_VERIFIED_FIXES off and on); the snapshots below pin those bytes on a CML 2.0 fixture so the R2
 * step (correct values for Agents 7/8) shows up as a deliberate snapshot change.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  AGENT6_CASE_POLICY,
  AGENT7_CASE_POLICY,
  AGENT8_CASE_POLICY,
  formatConstraintList,
  projectCaseForPrompt,
  renderDiscriminatingTest,
} from "../shared/cml-prompt-view.js";
import { buildFairPlayPrompt } from "../agent6-fairplay.js";
import { buildNarrativePrompt } from "../agent7-narrative.js";
import { buildNoveltyPrompt, resolveNoveltyPolicy } from "../agent8-novelty.js";

const cml2 = {
  CML_VERSION: 2,
  CASE: {
    meta: {
      title: "The Orchard Clock",
      crime_class: { category: "murder", subtype: "poisoning" },
      era: { decade: "1930s", realism_constraints: ["telephone exchange", "railway timetable", "gas lamps", "telegrams"] },
      setting: { location: "Ashby Grange" },
    },
    cast: [
      { name: "Inspector Hale", role_archetype: "Detective Inspector", alibi_window: "n/a", evidence_sensitivity: ["none"] },
      { name: "Lord Ashby", role_archetype: "victim", role: "victim" },
      { name: "Clara Venn", role_archetype: "secretary", motive_seed: " debts to the estate ", opportunity_channels: ["study door"] },
      { name: "Tom Reed", role_archetype: "gardener", culprit_eligibility: "eligible" },
    ],
    culpability: { culprits: ["Clara Venn"] },
    false_assumption: { type: "temporal", statement: "He died at nine.", why_it_seems_reasonable: "The clock stopped.", what_it_hides: "The clock was set back." },
    surface_model: { narrative: { summary: "A stopped clock fixes the hour." }, accepted_facts: ["The clock read nine"], inferred_conclusions: ["Death at nine"] },
    hidden_model: { mechanism: { description: "Clock set back an hour", delivery_path: [{ step: "wind back" }, "leave"] }, outcome: { result: "Lord Ashby dead" } },
    inference_path: {
      steps: [
        { observation: "Dust on the key", correction: "The clock was wound recently", effect: "time is unreliable", required_evidence: ["dusty key"] },
        { observation: "Train ticket", correction: "Clara was in town at ten", reader_observable: false },
      ],
    },
    discriminating_test: { method: "trap", design: "Ask who knew the clock was slow", knowledge_revealed: "Only the culprit knew", evidence_clues: ["clue_1"] },
    constraint_space: {
      time: { anchors: ["nine chimes", "ten train"], windows: [{ description: "8–10 pm" }], contradictions: ["clock vs train"] },
      access: { actors: ["Clara"], objects: ["key"], permissions: [] },
      physical: { laws: ["springs unwind"], traces: ["dust"] },
      social: { trust_channels: ["butler"], authority_sources: [] },
    },
    fair_play: { all_clues_visible: true, no_special_knowledge_required: true, no_late_information: true, reader_can_solve: true },
    quality_controls: { clue_visibility_requirements: { essential_clues_min: 3, early_clues_min: 2 }, discriminating_test_requirements: { timing: "late Act II" } },
    prose_requirements: {
      clue_to_scene_mapping: [{ clue_id: "clue_1", act_number: 1, scene_number: 2, delivery_method: "observation" }],
      suspect_clearance_scenes: [{ suspect_name: "Tom Reed", act_number: 2, scene_number: 3, clearance_method: "alibi", supporting_clues: ["clue_2"] }],
    },
  },
};

const clues = {
  clues: [
    { id: "clue_1", placement: "early", criticality: "essential", category: "temporal", description: "Dust on the clock key", supportsInferenceStep: 1, evidenceType: "observation" },
    { id: "clue_2", placement: "mid", criticality: "essential", category: "testimonial", description: "Ticket stub for the ten o'clock", supportsInferenceStep: 2 },
    { id: "clue_3", placement: "late", criticality: "supporting", category: "physical", description: "A slow watch" },
  ],
  redHerrings: [{ id: "rh_1", description: "The gardener's muddy boots", supportsAssumption: "outsider", misdirection: "mud" }],
} as any;

const legacyCml = {
  meta: { title: "", primary_axis: "spatial", crime_class: { subtype: "stabbing" } },
  setup: { crime: { description: "Stabbed in the library" }, era: { year: 1925, location: "Bath" } },
  inference_path: { discriminating_test: { when: "Act III", test: "the knife test", reveals: "the left hand" } },
};

describe("projectCaseForPrompt — the per-site policies stay distinct (byte-preserving)", () => {
  it("CML 2.0: every policy agrees on the header except the untitled fallback", () => {
    const a6 = projectCaseForPrompt(cml2, AGENT6_CASE_POLICY);
    const a7 = projectCaseForPrompt(cml2, AGENT7_CASE_POLICY);
    expect(a6.primaryAxis).toBe("temporal");
    expect(a7.primaryAxis).toBe("temporal");
    expect(a6.crime).toBe("poisoning");
    expect(a7.crime).toBe("poisoning");
    expect(a6.culpritName).toBe("Clara Venn");
    expect(a7.era).toBe("1930s - Ashby Grange");
    expect(a7.settingLocation).toBe("Ashby Grange");
  });

  it("legacy shape: Agent 6 is false-assumption/crime-class first, Agents 7/8 meta/setup first", () => {
    const withFa = { ...legacyCml, CASE: { false_assumption: { type: "temporal" } } };
    expect(projectCaseForPrompt(withFa, AGENT6_CASE_POLICY).primaryAxis).toBe("temporal");
    expect(projectCaseForPrompt(withFa, AGENT7_CASE_POLICY).primaryAxis).toBe("spatial");
    expect(projectCaseForPrompt(legacyCml, AGENT6_CASE_POLICY).crime).toBe("stabbing");
    expect(projectCaseForPrompt(legacyCml, AGENT8_CASE_POLICY).crime).toBe("Stabbed in the library");
    expect(projectCaseForPrompt(legacyCml, AGENT7_CASE_POLICY).title).toBe("Untitled Mystery");
    expect(projectCaseForPrompt(legacyCml, AGENT8_CASE_POLICY).title).toBe("Untitled");
    expect(projectCaseForPrompt(legacyCml, AGENT8_CASE_POLICY).era).toBe("1925 - Bath");
  });

  it("legacy discriminating-test labels differ per agent", () => {
    const v = projectCaseForPrompt(legacyCml, AGENT6_CASE_POLICY);
    expect(renderDiscriminatingTest(v, "what_why")).toBe("**When**: Act III\n**What**: the knife test\n**Why**: the left hand");
    expect(renderDiscriminatingTest(v, "test_reveals")).toBe("**When**: Act III\n**Test**: the knife test\n**Reveals**: the left hand");
  });

  it("formatConstraintList caps only when a limit is given", () => {
    const time = cml2.CASE.constraint_space.time;
    const keys = ["anchors", "windows", "contradictions"];
    expect(formatConstraintList(time, keys)).toBe("- nine chimes\n- ten train\n- 8–10 pm\n- clock vs train");
    expect(formatConstraintList(time, keys, 3)).toBe("- nine chimes\n- ten train\n- 8–10 pm");
    expect(formatConstraintList(["a", { description: "b" }], [], 1)).toBe("- a");
    expect(formatConstraintList(undefined, keys)).toBe("None");
  });
});

describe("A6-11 — one clue line for the early/mid/late listings", () => {
  it("renders each placement section with the shared formatter", () => {
    const { developer } = buildFairPlayPrompt({ caseData: cml2 as any, clues });
    expect(developer).toContain("### Early Clues (Act I) - 1 clues\n- [essential] temporal →step1 (observation): Dust on the clock key");
    expect(developer).toContain("### Mid Clues (Act II) - 1 clues\n- [essential] testimonial →step2: Ticket stub for the ten o'clock");
    expect(developer).toContain("### Late Clues (Act III) - 1 clues\n- [supporting] physical: A slow watch");
  });
});

describe("A1X-12 — resolveNoveltyPolicy", () => {
  const config = { thresholds: { similarity_threshold_default: 0.9, fail_delta: 0.1 } };
  it("shipped config: prompt and verdict state the same band", () => {
    const p = resolveNoveltyPolicy({ similarityThreshold: 0.85 }, config);
    expect(p).toEqual({ similarityThreshold: 0.85, promptThreshold: 0.85, failDelta: 0.1, failThreshold: Math.min(1, 0.85 + 0.1) });
    const { user } = buildNoveltyPrompt({ generatedCML: cml2 as any, seedCMLs: [], similarityThreshold: 0.85 });
    expect(user).toContain("- **Warning**: Overall similarity 85-95% for any seed\n- **Fail**: Overall similarity > 95% for any seed");
  });
  it("keeps the two documented differences: the prompt guards the threshold, the verdict does not", () => {
    const p = resolveNoveltyPolicy({ similarityThreshold: 1.5 }, config);
    expect(p.promptThreshold).toBe(0.9);
    expect(p.similarityThreshold).toBe(1.5);
    expect(p.failThreshold).toBe(1);
    expect(resolveNoveltyPolicy({}, config).similarityThreshold).toBe(0.9);
  });
});

describe("prompt bytes on a CML 2.0 fixture (characterisation)", () => {
  const prior = process.env.CML_VERIFIED_FIXES;
  afterEach(() => {
    if (prior === undefined) delete process.env.CML_VERIFIED_FIXES;
    else process.env.CML_VERIFIED_FIXES = prior;
  });
  for (const flag of ["off", "on"] as const) {
    it(`Agents 6/7/8 with CML_VERIFIED_FIXES ${flag}`, () => {
      if (flag === "on") process.env.CML_VERIFIED_FIXES = "1";
      else delete process.env.CML_VERIFIED_FIXES;
      const fair = buildFairPlayPrompt({ caseData: cml2 as any, clues });
      const fairNarrative = buildFairPlayPrompt({
        caseData: cml2 as any,
        clues,
        structuralAuditResult: { passed: true, gaps: [], evidenceCluesPresent: ["clue_1"], evidenceCluesMissing: [], stepsCovered: [1, 2], stepsUncovered: [], eliminationPresent: ["Tom Reed"], eliminationMissing: [] },
      });
      const narrative = buildNarrativePrompt({ caseData: cml2 as any, clues, targetLength: "short", detectiveType: "amateur", qualityGuardrails: ["Spread the clues"] });
      const novelty = buildNoveltyPrompt({ generatedCML: cml2 as any, seedCMLs: [legacyCml as any] });
      expect({
        fairDeveloper: fair.developer,
        fairNarrativeDeveloper: fairNarrative.developer,
        narrativeDeveloper: narrative.developer,
        narrativeUser: narrative.user,
        noveltyDeveloper: novelty.developer,
        noveltyUser: novelty.user,
      }).toMatchSnapshot();
    });
  }
});
