import { describe, expect, it } from "vitest";
import { validateCharacterLifecycle } from "../character-lifecycle-validator.js";

// Roadmap S3 — a reveal that clears the culprit then overturns it in the NEXT sentence must not
// false-fire `cleared_culprit_conflict`; a genuine standalone clearance of the culprit still fires.

const cml: any = {
  CASE: {
    cast: [
      { name: "Beatrice Quill", role_archetype: "suspect", gender: "female" },
      { name: "Inspector Gray", role_archetype: "detective", gender: "male" },
    ],
    culpability: { culprits: ["Beatrice Quill"] },
  },
};
const story = (text: string) => ({ scenes: [{ number: 10, title: "The Reveal", text }] });
const hasConflict = (text: string) =>
  validateCharacterLifecycle(story(text) as any, cml).some((e) => e.type === "cleared_culprit_conflict");

describe("cleared_culprit_conflict — window teardown guard (S3)", () => {
  it("does NOT fire when the clearance is overturned in the NEXT sentence (the reveal pattern)", () => {
    expect(hasConflict("For a moment, Beatrice Quill's alibi seemed to clear her. But Inspector Gray revealed she had lied about the study.")).toBe(false);
  });

  it("does NOT fire when the reveal names the culprit as guilty nearby", () => {
    expect(hasConflict("Beatrice Quill had been cleared early on. In truth she was the murderer all along.")).toBe(false);
  });

  it("STILL does not fire with an in-sentence negation (existing guard preserved)", () => {
    expect(hasConflict("The alibi that had once cleared Beatrice Quill collapsed under scrutiny.")).toBe(false);
  });

  it("STILL FIRES on a genuine standalone clearance of the culprit with no teardown nearby", () => {
    expect(hasConflict("Beatrice Quill was cleared by the evidence; her alibi held and she could not have done it. Everyone went home satisfied.")).toBe(true);
  });
});
