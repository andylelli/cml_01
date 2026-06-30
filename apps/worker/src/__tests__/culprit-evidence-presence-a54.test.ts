import { describe, it, expect } from "vitest";
import { enforceCulpritEvidencePresence } from "../jobs/agents/agent9-run.js";

// A_54 #1 — the culprit-near-death guard must catch the REAL bug (culprit IS the discovered-dead
// character) WITHOUT the false positive (culprit merely co-present at the Ch1 crime scene, as every
// suspect is when the body is found). The old ±250-char window fired on nearly every Golden-Age
// opening, suppressed culprit evidence, and gated clean runs to "failure".

const allText = (out: any) =>
  out.chapters.map((c: any) => (c.paragraphs as string[]).join(" ")).join(" ");

describe("enforceCulpritEvidencePresence — culprit-near-death false positive (A_54 #1)", () => {
  it("INJECTS evidence for a culprit merely co-present at the Ch1 crime scene (was wrongly skipped)", () => {
    const prose = {
      chapters: [
        { paragraphs: ["Dr. Mallory Finch lay slumped at the head of the table, lifeless. Hugo Vane stood by the sideboard, watching the others with a sardonic tilt."] },
        { paragraphs: ["In the end Eleanor gathered them in the lounge. The clock had been tampered with, and only Hugo Vane held a key to the case."] },
      ],
    };
    const cml = { CASE: { culpability: { culprits: ["Hugo Vane"] }, cast: [
      { name: "Dr. Mallory Finch", role: "victim" },
      { name: "Hugo Vane", role: "suspect" },
    ] } };
    const out = enforceCulpritEvidencePresence(prose, cml);
    // Hugo Vane is the culprit and co-present, but NOT the victim and NOT the deceased → must be live.
    expect(allText(out)).toContain("Hugo Vane was responsible");
  });

  it("SKIPS injection when the culprit matches the named victim (real CML collision)", () => {
    const prose = {
      chapters: [
        { paragraphs: ["Dr. Mallory Finch lay slumped at the table, lifeless."] },
        { paragraphs: ["Eleanor considered the facts of the case at length."] },
      ],
    };
    const cml = { CASE: { culpability: { culprits: ["Dr. Mallory Finch"] }, cast: [
      { name: "Dr. Mallory Finch", role: "victim" },
    ] } };
    const out = enforceCulpritEvidencePresence(prose, cml);
    expect(allText(out)).not.toContain("Finch was responsible");
    expect(allText(out)).not.toContain("was responsible, and the evidence");
  });

  it("SKIPS injection when the culprit is described as the deceased in Ch1 (subject of the death)", () => {
    const prose = {
      chapters: [
        { paragraphs: ["Hugo Vane lay dead on the study floor, a paper-knife between his shoulders."] },
        { paragraphs: ["Eleanor reviewed what little evidence remained."] },
      ],
    };
    const cml = { CASE: { culpability: { culprits: ["Hugo Vane"] }, cast: [
      { name: "Hugo Vane", role: "suspect" },
    ] } };
    const out = enforceCulpritEvidencePresence(prose, cml);
    expect(allText(out)).not.toContain("Hugo Vane was responsible");
  });

  // A_56 (run review 09168377): the collision test must be on the FULL name, not the surname. A culprit
  // who only SHARES A FAMILY SURNAME with the victim (Edward vs Edith Marwood) is a different person; the
  // old surname-only test suppressed culprit evidence on every family mystery.
  it("INJECTS for a culprit who only shares a surname with the victim (Edward Marwood vs victim Edith Marwood)", () => {
    const prose = {
      chapters: [
        { paragraphs: ["Edith Marwood lay lifeless beneath the sundial. Edward Marwood watched from the terrace, his face unreadable."] },
        { paragraphs: ["At last Arthur gathered them. The ledger and the shadow showed that only Edward Marwood could have arranged it."] },
      ],
    };
    const cml = { CASE: { culpability: { culprits: ["Edward Marwood"] }, cast: [
      { name: "Edith Marwood", role: "victim" },
      { name: "Edward Marwood", role: "suspect" },
    ] } };
    const out = enforceCulpritEvidencePresence(prose, cml);
    expect(allText(out)).toContain("Edward Marwood was responsible");
  });
});
