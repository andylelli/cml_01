import { describe, expect, it } from "vitest";
import { splitParagraphForStructure } from "../agent9-prose/sanitization.ts";

/**
 * A_88 — `splitParagraphForStructure` silently DELETED the first sentence of any paragraph that
 * opened with dialogue.
 *
 * Its chunk pattern required whitespace-or-end straight after the terminator. A paragraph opening
 * with speech has a closing quote there instead, so the alternative failed, the regex engine
 * advanced past the whole sentence, and nothing matched it — leaving a dangling quote.
 *
 * MEASURED against the archive's 3,392 paragraphs de-corrupted to the shape the model actually
 * emits: 1,567 paragraphs lost or altered text, 29,933 words dropped. Against the archive AS STORED
 * it measured 0%, because the sibling splitter defect (fixed in the same commit) had put a space in
 * front of every closing quote and that space satisfied the pattern. One bug held the other shut.
 */
const RQ = "”";
const LQ = "“";

describe("A_88 — splitParagraphForStructure must never lose prose", () => {
  it("keeps a paragraph that opens with dialogue intact", () => {
    const p = `${LQ}I expect your full cooperation.${RQ} Her words hung in the air. He said nothing at all in reply.`;
    const out = splitParagraphForStructure(p);
    expect(out).not.toBeNull();
    expect(out!.join(" ")).toBe(p);
  });

  it("round-trips a range of real paragraph shapes without losing a word", () => {
    const cases = [
      `${LQ}Who else knew?${RQ} she asked. ${LQ}Nobody,${RQ} he said. The clock struck nine just then.`,
      "He crossed the room slowly. She watched him go. Neither of them spoke again that evening.",
      `The lamp guttered. ${LQ}It was me,${RQ} Quentin said. The room did not move at all.`,
      'She said, "I saw the clock." Then she left. Nobody followed her out into the rain.',
    ];
    for (const text of cases) {
      const out = splitParagraphForStructure(text);
      if (out) expect(out.join(" ")).toBe(text);
    }
  });

  it("SAFE FAILURE MODE: malformed inverted quotes are spaced, never deleted", () => {
    // The two archived books whose quotes are inverted write `taut.”It is…` — a closing quote used
    // to open speech. The required-whitespace form dropped the sentence; this form must not.
    const p = `He looked away, the line of his jaw taut.${RQ}It is a sobering thought. The rest stayed quiet.`;
    const out = splitParagraphForStructure(p);
    expect(out).not.toBeNull();
    const rejoined = out!.join(" ");
    for (const word of ["taut", "sobering", "thought", "rest", "stayed", "quiet"]) {
      expect(rejoined).toContain(word);
    }
  });

  it("still splits into two halves when it can", () => {
    const p = "One sentence here. Two sentences here. Three sentences here. Four sentences here.";
    const out = splitParagraphForStructure(p);
    expect(out).not.toBeNull();
    expect(out!.length).toBe(2);
    expect(out![0]).toBeTruthy();
    expect(out![1]).toBeTruthy();
  });
});
