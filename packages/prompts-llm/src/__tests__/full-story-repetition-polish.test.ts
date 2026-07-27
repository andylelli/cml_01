import { describe, expect, it } from "vitest";
import { runFullStoryRepetitionPolish } from "../agent9-prose/post-pass-polish.js";
import { detectRecurringPhrases } from "../agent9-prose/phrase-analysis.js";
import type { ProseChapter } from "../agent9-prose/types.js";

// A_70 §8.2 — the needle/haystack regression.
//
// `detectRecurringPhrases` emits NORMALIZED token n-grams (tokenizeWords: lowercased, punctuation
// stripped, single-spaced). `runFullStoryRepetitionPolish` used to match them with a raw
// `.toLowerCase().includes()` against un-normalized chapter text, at TWO sites (target selection and
// the per-chapter `localPhrases` filter). A 7-word n-gram nearly always spans a sentence break, so
// neither could ever match: the A_70 A/B measured 0/15 phrases matching on every arm, and the lever
// made ZERO LLM calls while reporting itself enabled. These tests exist so that cannot recur silently.

const filler = (n: number, seed = "word"): string =>
  Array.from({ length: n }, (_, i) => `${seed}${i}`).join(" ");

const makeClient = (
  respond: (userContent: string, agent: string) => string,
  calls: { agent: string; model?: string }[] = [],
) =>
  ({
    chat: async (req: any) => {
      const agent = String(req?.logContext?.agent ?? "");
      calls.push({ agent, model: req?.model });
      return {
        content: respond(String(req?.messages?.[1]?.content ?? ""), agent),
        model: "test-model",
        latencyMs: 1,
      };
    },
  }) as any;

const rewriteOf = (chapter: ProseChapter, paragraphs: string[]) =>
  JSON.stringify({ status: "draft", chapters: [{ title: chapter.title, paragraphs }] });

/**
 * The real-world shape: a phrase repeated across chapters, but broken by a full stop in the prose —
 * exactly the case the raw comparison could never see. Note "afternoon. Chimes" spans the sentence
 * boundary, mirroring the phrase the A/B actually surfaced
 * ("clock running oddly earlier this afternoon chimes").
 */
const REPEATED = "The clock was running oddly earlier this afternoon. Chimes not as usual, he noted.";

const chapterWith = (lead: string, seed: string): ProseChapter => ({
  title: `Chapter ${seed}`,
  paragraphs: [`${lead} ${REPEATED}`, `Mrs Hale said nothing at all. ${filler(60, seed)}`],
});

const CHAPTERS: ProseChapter[] = [
  chapterWith("Inspector Wren arrived at dusk.", "a"),
  chapterWith("The hall stood empty and cold.", "b"),
  chapterWith("Rain moved across the terrace.", "c"),
];

describe("runFullStoryRepetitionPolish — A_70 §8.2 needle/haystack", () => {
  it("detectRecurringPhrases really does emit punctuation-stripped n-grams (the premise)", () => {
    const phrases = detectRecurringPhrases(CHAPTERS, 7, 3);
    expect(phrases.length).toBeGreaterThan(0);
    // The normalized form joins across the full stop; the raw text never contains this substring.
    const spanning = phrases.find((p) => p.includes("afternoon chimes"));
    expect(spanning).toBeTruthy();
    expect(CHAPTERS[0].paragraphs.join("\n\n").toLowerCase()).not.toContain(spanning!);
  });

  // THE regression, isolated.
  //
  // The phrase list here contains ONLY a normalized n-gram that spans the full stop
  // ("…this afternoon. Chimes not as usual…"), so there is no second phrase that could match under
  // the old raw comparison and mask the bug. Before the fix: targetIdx stays empty, zero LLM calls.
  // (An earlier draft of this test used the full detectRecurringPhrases output and passed WITHOUT
  // the fix — some 7-grams sit inside a single sentence and match raw text too. Hence this one.)
  it("targets a chapter whose ONLY repeated phrase spans a sentence boundary", async () => {
    const spanning = "running oddly earlier this afternoon chimes not";
    // Precondition: the normalized needle is genuinely absent from the raw prose.
    expect(CHAPTERS[0].paragraphs.join("\n\n").toLowerCase()).not.toContain(spanning);

    const calls: { agent: string }[] = [];
    const client0 = makeClient((_u, agent) => {
      const n = Number(agent.replace(/^.*-Ch/, ""));
      const ch = CHAPTERS[n - 1];
      return rewriteOf(ch, [
        `${ch.paragraphs[0].split(".")[0]}. The clock had drifted since noon, and the chimes fell wrong.`,
        ch.paragraphs[1],
      ]);
    }, calls);

    const isolated = await runFullStoryRepetitionPolish({
      chapters: [...CHAPTERS],
      client: client0,
      recurringPhrases: [spanning],
      lockedValues: [],
      castNames: ["Mrs Hale"],
    });

    expect(calls.length).toBeGreaterThan(0);
    expect(isolated.editedChapters.length).toBeGreaterThan(0);
  });

  it("still works end-to-end on real detectRecurringPhrases output", async () => {
    const phrases = detectRecurringPhrases(CHAPTERS, 7, 3);
    const calls: { agent: string }[] = [];
    const client = makeClient((_u, agent) => {
      const n = Number(agent.replace(/^.*-Ch/, ""));
      const ch = CHAPTERS[n - 1];
      return rewriteOf(ch, [
        `${ch.paragraphs[0].split(".")[0]}. The clock had drifted since noon, and the chimes fell wrong.`,
        ch.paragraphs[1],
      ]);
    }, calls);

    const result = await runFullStoryRepetitionPolish({
      chapters: [...CHAPTERS],
      client,
      recurringPhrases: phrases,
      lockedValues: [],
      castNames: ["Mrs Hale"],
    });

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0].agent).toMatch(/^Agent9-FullStoryRepetitionPolish-Ch\d+$/);
    expect(result.editedChapters.length).toBeGreaterThan(0);
  });

  it("respects maxChaptersPerPhrase so one phrase cannot fan out to every chapter", async () => {
    const phrases = detectRecurringPhrases(CHAPTERS, 7, 3);
    const calls: { agent: string }[] = [];
    const client = makeClient((_u, agent) => {
      const n = Number(agent.replace(/^.*-Ch/, ""));
      return rewriteOf(CHAPTERS[n - 1], CHAPTERS[n - 1].paragraphs);
    }, calls);

    await runFullStoryRepetitionPolish({
      chapters: [...CHAPTERS],
      client,
      recurringPhrases: phrases,
      lockedValues: [],
      castNames: [],
      maxChaptersPerPhrase: 1,
    });

    expect(calls).toHaveLength(1);
  });

  it("makes no call when there is nothing to vary", async () => {
    const calls: { agent: string }[] = [];
    const client = makeClient(() => "{}", calls);
    const distinct: ProseChapter[] = [
      { title: "One", paragraphs: [`Wren counted the minutes. ${filler(40, "x")}`] },
      { title: "Two", paragraphs: [`Rain crossed the terrace. ${filler(40, "y")}`] },
    ];
    const result = await runFullStoryRepetitionPolish({
      chapters: [...distinct],
      client,
      recurringPhrases: [],
      lockedValues: [],
      castNames: [],
    });
    expect(calls).toHaveLength(0);
    expect(result.editedChapters).toEqual([]);
  });

  // The guard that lets this pass ship at all: a rewrite that drops a locked value never lands.
  it("rolls a chapter back when the rewrite drops a locked-fact value", async () => {
    const locked = "ten minutes past eleven";
    const chapters: ProseChapter[] = CHAPTERS.map((c, i) => ({
      ...c,
      paragraphs: [`${c.paragraphs[0]} The hands stood at ${locked}.`, c.paragraphs[1]],
    }));
    const phrases = detectRecurringPhrases(chapters, 7, 3);
    const client = makeClient((_u, agent) => {
      const n = Number(agent.replace(/^.*-Ch/, ""));
      const ch = chapters[n - 1];
      // Same length, but the locked value is gone.
      return rewriteOf(ch, [`${ch.paragraphs[0].replace(locked, "some other hour")}`, ch.paragraphs[1]]);
    });

    const result = await runFullStoryRepetitionPolish({
      chapters: [...chapters],
      client,
      recurringPhrases: phrases,
      lockedValues: [locked],
      castNames: [],
    });

    expect(result.editedChapters).toEqual([]);
    expect(result.chapters[0].paragraphs.join(" ")).toContain(locked);
  });
});
