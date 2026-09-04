/**
 * DIAGNOSIS-BATCH #6 — the final-chapter confession/verdict ending.
 *
 * MEASURED on story_20260903-0738 (external read 78/100): the final chapter's last paragraph ends
 * `"You did it. " The words hung between them, final and irrevocable. Ivor Kestrel offered a slow
 * nod` — exactly the shape two existing prompt obligations already forbid (obligation-block.ts's
 * AFTERMATH REQUIRED and CLOSE IN-SCENE clauses), and confirmed NOT the B5 injector's own hardcoded
 * text (buildCulpritEvidenceSentenceInScene) — the model wrote this independently.
 *
 * MEASURED across 214 final chapters on disk before wiring this in: 28 (13%) already carry one of
 * these two shapes. A real, substantial rate — this stays warning-only (see the function's own
 * docblock), not a gate.
 */

import { describe, expect, it } from "vitest";

import { detectFinalChapterVerdictEnding } from "../jobs/agents/agent9-run.js";

const chaptersWith = (finalParagraphs: string[], earlierChapterCount = 2) => [
  ...Array.from({ length: earlierChapterCount }, (_, i) => ({
    title: `Ch${i + 1}`,
    paragraphs: ["An earlier chapter, unrelated content."],
  })),
  { title: "Final", paragraphs: finalParagraphs },
];

describe("detectFinalChapterVerdictEnding (diagnosis-batch #6)", () => {
  it("catches the ACTUAL measured theatre-case ending, spaced-quote rendering and all", () => {
    const chapters = chaptersWith([
      "The company dispersed into the drizzle.",
      '"You did it. " The words hung between them, final and irrevocable. Ivor Kestrel offered a slow nod, his eyes steady but silent.',
    ]);
    const messages = detectFinalChapterVerdictEnding(chapters);
    expect(messages.some((m) => m.includes("confession-confirmation quote"))).toBe(true);
  });

  it("catches the B5 injector's own hardcoded text too, if it ever lands as the closing beat", () => {
    const chapters = chaptersWith([
      '"You did it." The words settled and nobody took them back. Hugo Vane said nothing, and the proof on the table said the rest.',
    ]);
    expect(detectFinalChapterVerdictEnding(chapters).length).toBeGreaterThan(0);
  });

  it("catches the narrator-verdict shapes the obligation block names explicitly", () => {
    for (const ending of [
      "Justice had been served, but the cost was written on every face left behind.",
      "The case was closed, but the story would linger in the halls for years.",
      "In the end, Hale was responsible for the murder, and everyone in the house knew it.",
    ]) {
      const messages = detectFinalChapterVerdictEnding(chaptersWith([ending]));
      expect(messages.some((m) => m.includes("narrator verdict sentence"))).toBe(true);
    }
  });

  it("stays SILENT on a genuine in-scene aftermath ending — the common, correct shape", () => {
    const chapters = chaptersWith([
      "Marguerite Yardley quietly paid a debt at the box office, her gesture unnoticed by most but not by Dorothy.",
      "Dorothy lingered, letting the atmosphere settle, and watched the company disperse into the rain.",
    ]);
    expect(detectFinalChapterVerdictEnding(chapters)).toEqual([]);
  });

  it("only checks the FINAL chapter — an earlier chapter's confession does not trigger it", () => {
    const chapters = [
      { title: "Ch1", paragraphs: ["Unrelated setup."] },
      { title: "Ch8", paragraphs: ['"You did it. " Hale looked away.'] }, // reveal chapter, not final
      { title: "Ch10", paragraphs: ["A clean aftermath line with no verdict shape."] },
    ];
    expect(detectFinalChapterVerdictEnding(chapters)).toEqual([]);
  });

  it("only checks the LAST paragraph — an earlier confession within the final chapter is allowed to be referenced", () => {
    const chapters = chaptersWith([
      '"You did it. " Hale confessed, and the room fell silent.', // the confession itself, earlier in the chapter
      "Now, an hour later, the company gathered in the foyer to reckon with what came next.", // the actual close
    ]);
    expect(detectFinalChapterVerdictEnding(chapters)).toEqual([]);
  });

  it("handles empty/missing input without throwing", () => {
    expect(detectFinalChapterVerdictEnding([])).toEqual([]);
    expect(detectFinalChapterVerdictEnding([{ paragraphs: [] }])).toEqual([]);
    expect(detectFinalChapterVerdictEnding([{}])).toEqual([]);
  });
});

describe("curly quotes — the typography that made this check blind", () => {
  /**
   * MEASURED on story_20260904-1711 (external read 83/100). Its final paragraph is the exact shape
   * this check exists for, and the reviewer named it as the reason the ending "feels like it has
   * accidentally reverted to reveal mode". The check returned [].
   *
   * `prose.chapters` holds CURLY quotes; the exported .md holds straight ones. The original pattern
   * required a straight quote, and its docblock claimed it had been checked against the real
   * manuscript — it had, but against the .md rather than the artifact the check actually reads.
   * Validating the rendered form instead of the in-pipeline form is the same error that let the
   * forbidden-time-form fixture certify its own bug, and `accept.ts` has carried `foldTypography`
   * for this since a curly apostrophe made parseClockTime return null on "two o’clock".
   *
   * THE FIXTURES BELOW USE CURLY QUOTES DELIBERATELY. Do not "normalise" them.
   */
  it("catches the real 83/100 ending, verbatim and curly", () => {
    const chapters = [
      { paragraphs: ["An ordinary chapter."] },
      {
        paragraphs: [
          "Clarissa looked out across the rows, the flicker of lamplight catching her eyes, and waited " +
            "for the curtain to fall. “You did it. ” The words settled and nobody took them back. " +
            "Marguerite Gaunt said nothing, and the proof on the table said the rest.",
        ],
      },
    ];
    const messages = detectFinalChapterVerdictEnding(chapters);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain("confession-confirmation");
  });

  it("still catches the straight-quote form — the fold must not trade one blindness for another", () => {
    const chapters = [{ paragraphs: ["aftermath.", '"You did it. " Hugo Vane said nothing at all.'] }];
    expect(detectFinalChapterVerdictEnding(chapters)).toHaveLength(1);
  });

  it("stays silent on a clean curly-quoted aftermath", () => {
    const chapters = [
      { paragraphs: ["An ordinary chapter."] },
      { paragraphs: ["“It is done,” she said, and the stage, for a moment, belonged to no one."] },
    ];
    expect(detectFinalChapterVerdictEnding(chapters)).toEqual([]);
  });
});
