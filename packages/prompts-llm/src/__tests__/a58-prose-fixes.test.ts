import { describe, expect, it } from "vitest";
import { detectVictimAlive } from "../agent9-prose/generate.js";
import { buildResolutionBackstopSentence, RESOLUTION_RE } from "../agent9-prose/clue-validation.js";

// A_58 run-review fixes (prompts-llm side).

describe("A_58 #4 — detectVictimAlive returns the matching SENTENCE, not the paragraph start", () => {
  it("flags the active-victim sentence even when the paragraph opens with a different character", () => {
    // The run logged `VICTIM ALIVE: "Agnes Fairchild…"` because the whole paragraph was returned and
    // sliced; the real hit is the Edith (victim) sentence later in the paragraph.
    const chapter = {
      paragraphs: [
        "Agnes Fairchild's eyes shone with sudden tears, though she blinked them away. Edith Langley turned to him and said she was glad of the company.",
      ],
    };
    const hits = detectVictimAlive(chapter, "Edith Langley");
    expect(hits.length).toBe(1);
    expect(hits[0]).toContain("Edith Langley");
    expect(hits[0]).not.toMatch(/^Agnes/); // the diagnostic now points at the offending sentence
  });

  it("does not flag a paragraph that only mentions a non-victim actively", () => {
    const chapter = { paragraphs: ["Agnes Fairchild turned to him and said she was glad of the company."] };
    expect(detectVictimAlive(chapter, "Edith Langley")).toEqual([]);
  });
});

describe("A_58 #1 — resolution backstop closes in-scene, not on a summary verdict", () => {
  const sentence = buildResolutionBackstopSentence("Harcourt");

  it("satisfies the resolution-event detector", () => {
    expect(RESOLUTION_RE.test(sentence)).toBe(true);
  });

  it("does NOT match any verdict-closer pattern (would fail the close-in-scene lint)", () => {
    // Mirrors VERDICT_CLOSER_RE in lint.ts.
    const VERDICT_CLOSERS = [
      /^[A-Z][a-z][\w\s]+ was responsible\b/,
      /\bplaced the matter beyond\b/i,
      /\bevidence (?:confirmed|established)\b.{0,40}\bbeyond\b/i,
      /\bthe case was closed\b/i,
      /\bjustice had been served\b/i,
    ];
    for (const re of VERDICT_CLOSERS) expect(re.test(sentence)).toBe(false);
  });

  it("names the culprit and ends inside the scene", () => {
    expect(sentence).toContain("Harcourt");
    expect(sentence.trimEnd().endsWith(".")).toBe(true);
    expect(sentence).toMatch(/breath it had been holding\.$/); // sensation close, not a verdict
  });
});
