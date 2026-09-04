/**
 * THE CULPRIT-EVIDENCE FLOOR WRITES THE LAST SENTENCE OF THE BOOK.
 *
 * MEASURED across the shipped corpus on 2026-09-04: FIVE manuscripts end on
 * `buildCulpritEvidenceSentenceInScene`'s text, and the two carrying an external read are the two
 * most recent. Both readers named it without being asked:
 *
 *   read-20260904-1711 (83, ending 7)  "That belongs in Chapter 8, not Chapter 10 ...
 *                                       Delete the last two sentences."
 *   read-20260904-2035 (82, ending 6)  "the final sentences ruin the aftermath ...
 *                                       This line should be deleted."
 *
 * `ending` is the ONLY one of ten categories that moved between those two books.
 *
 * The sentence is not refused - ADR-0003 forbids trading a bad sentence for a missing obligation,
 * and X4 telemetry says the in-scene form does its job (run 22362: injections=1, violations=0,
 * against a prior 100% violation rate). The defect is POSITIONAL. `detectFinalChapterVerdictEnding`
 * is scoped to the final paragraph precisely because aftermath may reference the confession and must
 * not re-stage it as the closing beat, so one paragraph earlier satisfies both rules at once.
 *
 * These tests wire the REAL injector to the REAL detector rather than asserting on a string, because
 * the claim being made is that those two components disagree about the same paragraph.
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import { buildCulpritEvidenceSentenceInScene, culpritEvidenceLinkInText } from "@cml/prompts-llm";

import { detectFinalChapterVerdictEnding, enforceCulpritEvidencePresence } from "../jobs/agents/agent9-run.js";

const CULPRIT = "Desmond Jardine";

const CML = {
  CASE: {
    culpability: { culprits: [CULPRIT] },
    cast: [
      { name: CULPRIT, role: "suspect" },
      { name: "Clarissa Gaunt", role: "victim" },
    ],
  },
};

/** A manuscript whose final chapter closes on aftermath and never links the culprit to evidence. */
const manuscript = (finalParagraphs: string[]) => ({
  chapters: [
    { title: "Ch1", paragraphs: ["Clarissa Gaunt was found in the rehearsal hall."] },
    { title: "Ch2", paragraphs: [CULPRIT + " kept the rehearsal log in his own hand."] },
    { title: "Final", paragraphs: finalParagraphs },
  ],
});

const AFTERMATH = [
  "The company dispersed, and " + CULPRIT + " was gone from the building by noon.",
  "Iris Norbury gathered the rehearsal schedules and did not look back.",
  "He closed his eyes briefly, then followed, the chill of the autumn air trailing behind him.",
];

const MARKER = "the proof on the table said the rest";

const finalParagraphsOf = (prose: any): string[] => prose.chapters[prose.chapters.length - 1].paragraphs;
const allText = (prose: any): string =>
  prose.chapters.map((c: any) => c.paragraphs.join("\n\n")).join("\n\n");

describe("culprit-evidence injection and the closing beat", () => {
  afterEach(() => {
    delete process.env.AGENT9_INJECT_BEFORE_FINAL_PARAGRAPH;
    delete process.env.AGENT9_CULPRIT_INJECTION_IN_SCENE;
    vi.restoreAllMocks();
  });

  it("REGRESSION: today's default reproduces the shipped defect — the book ends on the injection", () => {
    // Non-vacuous guard. If this ever stops tripping the detector, the fix below proves nothing,
    // because the two components would no longer disagree about the same paragraph.
    process.env.AGENT9_CULPRIT_INJECTION_IN_SCENE = "true";
    delete process.env.AGENT9_INJECT_BEFORE_FINAL_PARAGRAPH;

    const out = enforceCulpritEvidencePresence(manuscript([...AFTERMATH]), CML);
    const paragraphs = finalParagraphsOf(out);

    expect(paragraphs[paragraphs.length - 1]).toContain(MARKER);
    expect(detectFinalChapterVerdictEnding(out.chapters).length).toBeGreaterThan(0);
  });

  it("with the flag on, the sentence moves one paragraph up and the detector goes quiet", () => {
    process.env.AGENT9_CULPRIT_INJECTION_IN_SCENE = "true";
    process.env.AGENT9_INJECT_BEFORE_FINAL_PARAGRAPH = "true";

    const out = enforceCulpritEvidencePresence(manuscript([...AFTERMATH]), CML);
    const paragraphs = finalParagraphsOf(out);

    expect(paragraphs[paragraphs.length - 1]).not.toContain(MARKER);
    expect(paragraphs[paragraphs.length - 2]).toContain(MARKER);
    expect(detectFinalChapterVerdictEnding(out.chapters)).toEqual([]);
  });

  it("the OBLIGATION still holds — moving the paragraph must not lose the contract", () => {
    // The whole reason this is safe: `culpritEvidenceLinkInText` reads the MANUSCRIPT, not one
    // paragraph. If that were not true this change would trade a mark for a broken contract, which
    // ADR-0003 forbids outright.
    process.env.AGENT9_CULPRIT_INJECTION_IN_SCENE = "true";
    process.env.AGENT9_INJECT_BEFORE_FINAL_PARAGRAPH = "true";

    const out = enforceCulpritEvidencePresence(manuscript([...AFTERMATH]), CML);
    expect(culpritEvidenceLinkInText(CULPRIT, allText(out))).toBe(true);
    expect(allText(out)).toContain(buildCulpritEvidenceSentenceInScene(CULPRIT));
  });

  it("the injection still happens exactly once, and is still reported to X4", () => {
    process.env.AGENT9_CULPRIT_INJECTION_IN_SCENE = "true";
    process.env.AGENT9_INJECT_BEFORE_FINAL_PARAGRAPH = "true";

    const events: any[] = [];
    const out = enforceCulpritEvidencePresence(manuscript([...AFTERMATH]), CML, (e: any) => events.push(e));

    expect(events).toHaveLength(1);
    expect(events[0].target).toBe(CULPRIT);
    // X4 counts injections. Moving the paragraph must not make the floor look like it stopped firing,
    // which is the exact hollow-result failure the FLAG-AUDIT row warns about.
    expect(events[0].sentence).toContain(MARKER);
    expect(allText(out).split(MARKER)).toHaveLength(2);
  });

  it("a single-paragraph final chapter falls back to the obligation, and SAYS so", () => {
    // The paragraph must NAME the culprit. `injectSentenceIfAbsent` targets the last chapter that
    // mentions the target, so a final chapter that never names him sends the injection to an earlier
    // chapter and this fallback is never reached — the first version of this test asserted against a
    // path it was not exercising.
    process.env.AGENT9_CULPRIT_INJECTION_IN_SCENE = "true";
    process.env.AGENT9_INJECT_BEFORE_FINAL_PARAGRAPH = "true";
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const out = enforceCulpritEvidencePresence(
      manuscript(["The company dispersed into the drizzle, and " + CULPRIT + " was gone by noon."]),
      CML,
    );

    expect(finalParagraphsOf(out)).toHaveLength(1);
    expect(finalParagraphsOf(out)[0]).toContain(MARKER);
    expect(warn.mock.calls.flat().join(" ")).toContain("the obligation wins");
  });

  it("steps over a trailing separator rather than hiding behind it", () => {
    // The detector skips a trailing "---". If placement did not, the sentence would land in the real
    // last paragraph while the detector stayed quiet — green tests over a shipped defect.
    process.env.AGENT9_CULPRIT_INJECTION_IN_SCENE = "true";
    process.env.AGENT9_INJECT_BEFORE_FINAL_PARAGRAPH = "true";

    const out = enforceCulpritEvidencePresence(manuscript([...AFTERMATH, "---"]), CML);
    const paragraphs = finalParagraphsOf(out);

    expect(paragraphs[paragraphs.length - 1]).toBe("---");
    expect(paragraphs[paragraphs.length - 2]).not.toContain(MARKER);
    expect(paragraphs[paragraphs.length - 3]).toContain(MARKER);
    expect(detectFinalChapterVerdictEnding(out.chapters)).toEqual([]);
  });

  it("reads the flag at CALL time — three flags on this project were no-ops without this", () => {
    process.env.AGENT9_CULPRIT_INJECTION_IN_SCENE = "true";
    process.env.AGENT9_INJECT_BEFORE_FINAL_PARAGRAPH = "true";
    const on = finalParagraphsOf(enforceCulpritEvidencePresence(manuscript([...AFTERMATH]), CML));
    process.env.AGENT9_INJECT_BEFORE_FINAL_PARAGRAPH = "0";
    const off = finalParagraphsOf(enforceCulpritEvidencePresence(manuscript([...AFTERMATH]), CML));

    expect(on[on.length - 1]).not.toContain(MARKER);
    expect(off[off.length - 1]).toContain(MARKER);
  });
});
