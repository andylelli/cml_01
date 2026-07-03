import { describe, it, expect } from "vitest";
import { validateCharacterLifecycle } from "../character-lifecycle-validator.js";

// ANALYSIS_44 follow-up (run 6aea3501): a dead/victim character given confession language
// must flag `deceased_character_confesses` — UNLESS the sentence is reframed as a recollection,
// which is how applyCanonicalVictimRescue neutralizes it. Before the fix the recollection frame
// cleared `victim_reappears_alive` but NOT the confession, so the run aborted anyway.

const cml = {
  CASE: {
    cast: [
      { name: "Margaret Langley", role: "victim", role_archetype: "victim", gender: "female" },
      { name: "John Avery", role: "suspect", role_archetype: "suspect", gender: "male" },
    ],
    culpability: { victim: "Margaret Langley", culprits: ["John Avery"] },
  },
};

const makeStory = (paragraphsByChapter: string[][]) => ({
  id: "s",
  projectId: "p",
  scenes: paragraphsByChapter.map((paras, i) => ({
    number: i + 1,
    title: `Chapter ${i + 1}`,
    text: paras.join("\n\n"),
  })),
});

describe("validateCharacterLifecycle — deceased_character_confesses recollection exclusion", () => {
  it("flags a plain confession by a dead victim", () => {
    const story = makeStory([
      ["The lifeless body of Margaret Langley was found in the locked study."],
      ["Margaret Langley confessed to the murder before the assembled household."],
    ]);
    const errors = validateCharacterLifecycle(story as any, cml as any);
    expect(errors.some((e: any) => e.type === "deceased_character_confesses")).toBe(true);
  });

  it("does NOT flag a confession explicitly reframed as a recollection", () => {
    const story = makeStory([
      ["The lifeless body of Margaret Langley was found in the locked study."],
      ["In a remembered moment, Margaret Langley confessed to the murder before the assembled household."],
    ]);
    const errors = validateCharacterLifecycle(story as any, cml as any);
    expect(errors.some((e: any) => e.type === "deceased_character_confesses")).toBe(false);
    // The reappearance must also stay clear (the recollection frame covers both).
    expect(errors.some((e: any) => e.type === "victim_reappears_alive")).toBe(false);
  });

  it("attaches a details block (characterName + deadByChapter) for downstream rescue extraction", () => {
    const story = makeStory([
      ["The lifeless body of Margaret Langley was found in the locked study."],
      ["Margaret Langley confessed to the murder before the assembled household."],
    ]);
    const errors = validateCharacterLifecycle(story as any, cml as any);
    const confession = errors.find((e: any) => e.type === "deceased_character_confesses") as any;
    expect(confession?.details?.characterName).toBe("Margaret Langley");
    expect(typeof confession?.details?.deadByChapter).toBe("number");
  });
});

describe("validateCharacterLifecycle — culprit confesses to killing the named victim (RC4.4 / run_33ecb4ad)", () => {
  it("does NOT flag the victim when the culprit's confession names her as the kill-object", () => {
    // Exact run_33ecb4ad shape: the culprit confesses "I killed <victim>"; the victim's name appears
    // only as the object of the killing — she is not confessing.
    const story = makeStory([
      ["The lifeless body of Margaret Langley was found in the locked study."],
      ["Reginald Clarke's composure cracked. 'I killed Margaret Langley. I strangled her with a silk cord there in the study.'"],
    ]);
    const errors = validateCharacterLifecycle(story as any, cml as any);
    expect(errors.some((e: any) => e.type === "deceased_character_confesses")).toBe(false);
  });

  it("STILL flags the victim as SUBJECT of a genuine confession (true positive preserved)", () => {
    const story = makeStory([
      ["The lifeless body of Margaret Langley was found in the locked study."],
      ["Margaret Langley confessed to the murder before the assembled household."],
    ]);
    const errors = validateCharacterLifecycle(story as any, cml as any);
    expect(errors.some((e: any) => e.type === "deceased_character_confesses")).toBe(true);
  });
});

describe("validateCharacterLifecycle — cleared_culprit_conflict guard (A_50 §9)", () => {
  it("does NOT flag a culprit whose clearance is negated/demolished in the reveal", () => {
    const story = makeStory([
      ["The body of Margaret Langley was discovered in the study."],
      ["John Avery seemed beyond reproach that evening."],
      ["The alibi that had once cleared John Avery collapsed under the new evidence."],
    ]);
    const errors = validateCharacterLifecycle(story as any, cml as any);
    expect(errors.some((e: any) => e.type === "cleared_culprit_conflict")).toBe(false);
  });

  it("STILL flags a genuine (incoherent) bare clearance of the culprit", () => {
    const story = makeStory([
      ["The body of Margaret Langley was discovered in the study."],
      ["John Avery was cleared; his alibi held and no one doubted him again."],
    ]);
    const errors = validateCharacterLifecycle(story as any, cml as any);
    expect(errors.some((e: any) => e.type === "cleared_culprit_conflict")).toBe(true);
  });
});
