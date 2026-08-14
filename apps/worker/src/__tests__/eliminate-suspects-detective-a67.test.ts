import { describe, it, expect } from "vitest";
import { computeEliminationSuspects, enforceSuspectEliminationPresence } from "../jobs/agents/agent9-run.js";

// A_67 adversarial-review bug: computeEliminationSuspects iterates the PREFERRED source
// castDesign.characters (Agent-2 normalised, camelCase `roleArchetype`) but read the detective role from
// bare snake_case `role_archetype`, so the detective was never excluded and got "cleared" as a suspect —
// the injector wrote "<Detective> was thoroughly cleared by the evidence…" and the regen pass burned an
// LLM call on the sleuth. Fixed by reading both spellings (role_archetype ?? roleArchetype ?? role).

const cml = {
  CASE: {
    culpability: { culprits: ["Grace Wend"] },
    cast: [
      { name: "Inspector Hale", role_archetype: "detective" },
      { name: "Edward Marwood", role_archetype: "suspect" },
      { name: "Grace Wend", role_archetype: "suspect" },
    ],
  },
};

describe("computeEliminationSuspects — detective exclusion across cast shapes (A_67 review)", () => {
  it("excludes a detective whose archetype is camelCase roleArchetype (the Agent-2 castDesign shape)", () => {
    const castDesign = {
      characters: [
        { name: "Inspector Hale", roleArchetype: "detective" }, // camelCase — the preferred source
        { name: "Edward Marwood", roleArchetype: "suspect" },
        { name: "Grace Wend", roleArchetype: "suspect" },
      ],
    };
    const suspects = computeEliminationSuspects(cml, castDesign);
    expect(suspects).toContain("Edward Marwood");
    expect(suspects).not.toContain("Inspector Hale"); // detective — was WRONGLY retained pre-fix
    expect(suspects).not.toContain("Grace Wend"); // culprit
  });

  it("still excludes a detective on the snake_case cml.CASE.cast fallback (no castDesign)", () => {
    const suspects = computeEliminationSuspects(cml, undefined);
    expect(suspects).not.toContain("Inspector Hale");
    expect(suspects).toContain("Edward Marwood");
  });

  it("enforceSuspectEliminationPresence injects NO clearance sentence for the detective", () => {
    const castDesign = {
      characters: [
        { name: "Inspector Hale", roleArchetype: "detective" },
        { name: "Edward Marwood", roleArchetype: "suspect" },
      ],
    };
    const prose = {
      chapters: [{ paragraphs: ["Inspector Hale gathered the household as Edward Marwood shifted uneasily by the fire."] }],
    };
    const out = enforceSuspectEliminationPresence(prose, cml, castDesign);
    const text = out.chapters.map((c: any) => (c.paragraphs as string[]).join(" ")).join(" ");
    // The sleuth must never be narrated as an exonerated murder suspect.
    expect(text).not.toMatch(/Hale was thoroughly cleared by the evidence/i);
  });
});

// A_68 probe (SUSPECT_ELIM run 1715): the VICTIM was never excluded, so the injector shipped
// "Ellsworth was thoroughly cleared by the evidence; the alibi confirmed they could not have committed
// the crime" for Lady Beatrice Ellsworth — the murder victim. A latent bug (only fires when the injector
// actually injects for the victim), surfaced by the treatment arm. You never clear the victim.
describe("computeEliminationSuspects — victim exclusion (A_68 probe)", () => {
  const victimCml = {
    CASE: {
      culpability: { culprits: ["Charles Pembroke"], victim: "Lady Beatrice Ellsworth" },
      cast: [
        { name: "Inspector Harold Wren", role_archetype: "detective" },
        { name: "Lady Beatrice Ellsworth", role_archetype: "victim" },
        { name: "Charles Pembroke", role_archetype: "suspect" },
        { name: "Margaret Huxley", role_archetype: "suspect" },
      ],
    },
  };

  it("excludes the victim by role_archetype (snake_case cml.CASE.cast)", () => {
    const suspects = computeEliminationSuspects(victimCml, undefined);
    expect(suspects).not.toContain("Lady Beatrice Ellsworth"); // victim — was WRONGLY retained pre-fix
    expect(suspects).not.toContain("Inspector Harold Wren"); // detective
    expect(suspects).not.toContain("Charles Pembroke"); // culprit
    expect(suspects).toContain("Margaret Huxley"); // the only real suspect
  });

  it("excludes the victim by camelCase roleArchetype (Agent-2 castDesign) and by culpability.victim", () => {
    const castDesign = {
      characters: [
        { name: "Inspector Harold Wren", roleArchetype: "detective" },
        { name: "Lady Beatrice Ellsworth", roleArchetype: "victim" },
        { name: "Charles Pembroke", roleArchetype: "suspect" },
        { name: "Margaret Huxley", roleArchetype: "suspect" },
      ],
    };
    const suspects = computeEliminationSuspects(victimCml, castDesign);
    expect(suspects).not.toContain("Lady Beatrice Ellsworth");
    expect(suspects).toEqual(["Margaret Huxley"]);
  });

  it("enforceSuspectEliminationPresence injects NO clearance sentence for the victim", () => {
    const prose = {
      chapters: [{ paragraphs: ["Lady Beatrice Ellsworth lay by the sundial as Margaret Huxley looked on."] }],
    };
    const out = enforceSuspectEliminationPresence(prose, victimCml, undefined);
    const text = out.chapters.map((c: any) => (c.paragraphs as string[]).join(" ")).join(" ");
    expect(text).not.toMatch(/Ellsworth was thoroughly cleared by the evidence/i);
  });
});

// X29 (REVIEW_08 §7) — the clearance and the aftermath contracts fought over one chapter. The regen
// pass was bounded by the reveal first, and that was half a fix: this FLOOR is what runs when regen
// cannot dramatize a clearance (and the only writer at all with AGENT9_REGEN_SUSPECT_ELIM off), it
// targets "the last chapter that names the suspect", and the aftermath names everyone. So the sentence
// the aftermath contract forbids kept a route into the aftermath, where `aftermath_repeat` then spends
// an LLM call taking it back out — ch9 of the 08-07 run shipped two of its eight paragraphs short.
describe("enforceSuspectEliminationPresence — bounded by the reveal chapter (X29)", () => {
  const castDesign = {
    characters: [
      { name: "Inspector Hale", roleArchetype: "detective" },
      { name: "Edward Marwood", roleArchetype: "suspect" },
      { name: "Grace Wend", roleArchetype: "suspect" },
    ],
  };
  const makeProse = () => ({
    chapters: [
      { paragraphs: ["Edward Marwood met them at the door of the mill."] },
      { paragraphs: ["Hale named Grace Wend, and Edward Marwood watched the constable close the notebook."] },
      { paragraphs: ["The mill wheel turned again that spring, and Edward Marwood took the tenancy."] },
    ],
  });
  const clearanceRe = /Marwood was thoroughly cleared by the evidence/i;
  const chapterText = (out: any, idx: number) => (out.chapters[idx].paragraphs as string[]).join(" ");

  it("injects into the reveal chapter, not the aftermath chapter that also names the suspect", () => {
    const out = enforceSuspectEliminationPresence(makeProse(), cml, castDesign, undefined, 2);
    expect(chapterText(out, 1)).toMatch(clearanceRe);
    expect(chapterText(out, 2)).not.toMatch(clearanceRe);
    // The aftermath paragraph is returned byte-identical — nothing to repair back out.
    expect(chapterText(out, 2)).toBe("The mill wheel turned again that spring, and Edward Marwood took the tenancy.");
  });

  it("falls back to the reveal chapter when no chapter up to it names the suspect", () => {
    const prose = {
      chapters: [
        { paragraphs: ["The mill stood silent."] },
        { paragraphs: ["Hale named Grace Wend at last."] },
        { paragraphs: ["Edward Marwood took the tenancy that spring."] },
      ],
    };
    const out = enforceSuspectEliminationPresence(prose, cml, castDesign, undefined, 2);
    expect(chapterText(out, 1)).toMatch(clearanceRe);
    expect(chapterText(out, 2)).not.toMatch(clearanceRe);
  });

  it("is unbounded when the ceiling is omitted — the pre-X29 behaviour for a run without geometry", () => {
    const out = enforceSuspectEliminationPresence(makeProse(), cml, castDesign, undefined);
    expect(chapterText(out, 2)).toMatch(clearanceRe); // the last chapter that names him: the aftermath
  });

  it("still no-ops when the suspect is already cleared in scene ANYWHERE, aftermath included", () => {
    const prose = {
      chapters: [
        { paragraphs: ["Two witnesses saw Marwood in town; his alibi confirmed he could not have been at the mill."] },
        { paragraphs: ["Hale named Grace Wend."] },
        { paragraphs: ["Edward Marwood took the tenancy."] },
      ],
    };
    const out = enforceSuspectEliminationPresence(prose, cml, castDesign, undefined, 2);
    expect(out.chapters.map((c: any) => (c.paragraphs as string[]).join(" ")).join(" ")).not.toMatch(clearanceRe);
  });
});
