import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildNarrativePrompt } from "../agent7-narrative.js";
import { buildNoveltyPrompt } from "../agent8-novelty.js";

/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — A7-D01 and A1X-D03: Agent 7's case summary and Agent 8's CML summariser
 * read CML-1.x paths (`setup.crime.victim`, `solution.culprit.motive`) from a CML 2.0 `{ CASE }` wrapper.
 */
const FLAG = "CML_VERIFIED_FIXES";
let saved: string | undefined;
beforeEach(() => { saved = process.env[FLAG]; delete process.env[FLAG]; });
afterEach(() => { if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved; });

const cml2 = () => ({
  CML_VERSION: 2.0,
  CASE: {
    meta: { title: "The Glasshouse Affair", primary_axis: "temporal", era: { decade: "1930s" }, setting: { location: "a Kent manor" }, crime_class: { category: "murder", subtype: "poisoning" } },
    cast: [
      { name: "Inspector Hale", role_archetype: "Detective Inspector", motive_seed: "none", culprit_eligibility: "ineligible" },
      { name: "Lord Ashcombe", role_archetype: "Victim", motive_seed: "none", culprit_eligibility: "ineligible" },
      { name: "Clara Venn", role_archetype: "Secretary", motive_seed: "she was to be dismissed without a reference", culprit_eligibility: "eligible" },
      { name: "Dr. Pell", role_archetype: "Physician", motive_seed: "an unpaid debt", culprit_eligibility: "eligible" },
      { name: "Mrs. Tibb", role_archetype: "Housekeeper", motive_seed: "none", culprit_eligibility: "ineligible" },
    ],
    culpability: { culprit_count: 1, culprits: ["Clara Venn"] },
    hidden_model: { mechanism: { description: "The tonic bottle was switched after the nine o'clock dose." } },
    false_assumption: { statement: "The poison was taken at dinner." },
  },
});

const clues = { clues: [], redHerrings: [], fairPlayChecks: {} } as any;

describe("A7-D01 — Agent 7 developer context reads CML 2.0", () => {
  it("flag OFF: the old CML-1.x reads (Unknown victim/motive, culprit and victim listed as witnesses)", () => {
    const { developer } = buildNarrativePrompt({ caseData: cml2() as any, clues });
    expect(developer).toContain("**Victim**: Unknown");
    expect(developer).toContain("**Motive**: Unknown motive");
    expect(developer).toContain("- **Witness**: Clara Venn");
    expect(developer).toContain("- **Witness**: Lord Ashcombe");
  });

  it("flag ON: victim and motive from CASE.cast; culprit is a suspect; victim is no witness", () => {
    process.env[FLAG] = "1";
    const { developer } = buildNarrativePrompt({ caseData: cml2() as any, clues });
    expect(developer).toContain("**Victim**: Lord Ashcombe");
    expect(developer).toContain("**Motive**: she was to be dismissed without a reference");
    expect(developer).toContain("- **Suspect**: Clara Venn");
    expect(developer).not.toContain("- **Witness**: Clara Venn");
    expect(developer).not.toMatch(/\*\*(Witness|Suspect)\*\*: Lord Ashcombe/);
    expect(developer).toContain("- **Witness**: Mrs. Tibb");
  });

  it("flag ON: the user request's victim lookup finds the victim in CASE.cast", () => {
    const off = buildNarrativePrompt({ caseData: cml2() as any, clues }).user;
    process.env[FLAG] = "1";
    const on = buildNarrativePrompt({ caseData: cml2() as any, clues }).user;
    expect(off).not.toContain("Lord Ashcombe");
    expect(on).toContain("Lord Ashcombe");
  });
});

describe("A1X-D03 — Agent 8 CML summariser reads CML 2.0", () => {
  const prompt = () => buildNoveltyPrompt({ generatedCML: cml2() as any, seedCMLs: [] }).developer;

  it("flag OFF: every summary says Victim/Motive Unknown", () => {
    const user = prompt();
    expect(user).toContain("**Victim**: Unknown");
    expect(user).toContain("**Motive**: Unknown");
    expect(user).toContain("**Solution Method**: poisoning");
  });

  it("flag ON: victim, motive and mechanism from CASE", () => {
    process.env[FLAG] = "1";
    const user = prompt();
    expect(user).toContain("**Victim**: Lord Ashcombe");
    expect(user).toContain("**Motive**: she was to be dismissed without a reference");
    expect(user).toContain("**Solution Method**: The tonic bottle was switched after the nine o'clock dose.");
  });
});
