/**
 * ANALYSIS_109 M5 — THE RESTATED FACT.
 *
 * Repetition is the readers' commonest complaint (64 of 71 reviews), and "clue recaps" 20. The copy
 * checkers catch VERBATIM repeats — a sentence, a six-word run inside a paragraph. What they cannot
 * see is the same fact said again in new words: run 98dec72a gave Margot's alibi, "nine o'clock to ten
 * o'clock", in chapters 2, 5, 7 and 8, each time in a different sentence.
 *
 * The measure is Broder's CONTAINMENT (1997), not resemblance: does a sentence contain most of a
 * fact's own terms? A fact is a clue's observable (owned by the chapter the contract gives it) or an
 * alibi (a named person and a clock window, owned by the first chapter that states it). A restatement
 * in a later chapter, or a third statement inside the owner's, is a recap. The test chapter and the
 * reveal are exempt: re-citing the evidence there is the genre's contract (A_90 §13).
 *
 * Exact at book scale: a few hundred sentences against a few dozen facts is milliseconds, so the
 * MinHash sketch A_109 named (for web-scale corpora) is not needed and would only approximate.
 */
import { extractClockValues, identifyPeople, namesIn } from "@cml/cml";

import { contentStemsOf } from "./instruction-echo.js";
import { splitSentences } from "./sentences.js";
import type { ContractCore, ProseChapterLike } from "./types.js";

export interface RecapHit {
  chapter: number;
  kind: "clue" | "alibi";
  /** The clue id, or the window ("Margot Ellsworth 9:00–10:00" when one person is named). */
  fact: string;
  owner: number;
  sentence: string;
}

/** A sentence restates a clue when it holds this share of the clue's content words, and this many. */
export const RECAP_SHARE = 0.6;
export const RECAP_MIN_TERMS = 3;
/** How many statements of its own fact the owner chapter may make before the rest are recaps. */
export const OWNER_ALLOWANCE = 2;

const renderWindow = (a: number, b: number): string => {
  const hm = (d: number): string => `${Math.floor(d / 60) || 12}:${String(d % 60).padStart(2, "0")}`;
  return `${hm(a)}–${hm(b)}`;
};

const normalise = (text: string): string => String(text ?? "").replace(/\s+/g, " ").trim();

export const findRecaps = (
  byChapter: ReadonlyMap<number, ProseChapterLike>,
  core: ContractCore,
  options: {
    people?: ReadonlyArray<string>;
    /**
     * The case's ALIBI windows (dial pairs). When given, only these are tracked. MEASURED keyed on every
     * window: 112 of 228 books fire, and pair 3's tide window (the mechanism the brief asks to be stated
     * with both ends) is flagged 13 times — a check that fires on half the books is an off switch
     * (CLAUDE.md). The readers' complaint is the ALIBI said again, so the pipeline passes the alibis.
     */
    windows?: ReadonlyArray<readonly [number, number]>;
  } = {},
): RecapHit[] => {
  const exempt = new Set([core.roles.discriminatingTest, core.roles.reveal].filter((c): c is number => c !== null));
  const chapters = [...byChapter.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([chapter, c]) => ({ chapter, sentences: splitSentences(normalise((c.paragraphs ?? []).join(" "))) }));
  const hits: RecapHit[] = [];

  // ── clues: owned by the contract ────────────────────────────────────────────────────────────────
  for (const scene of core.scenes) {
    for (const surface of scene.mustSurface) {
      const terms = [...new Set(contentStemsOf(surface.observable))];
      if (terms.length < RECAP_MIN_TERMS + 1) continue;
      const need = Math.max(RECAP_MIN_TERMS, Math.ceil(terms.length * RECAP_SHARE));
      for (const { chapter, sentences } of chapters) {
        if (chapter < scene.chapter || exempt.has(chapter)) continue; // before its owner is `clue_early`'s
        const restating = sentences.filter((s) => {
          const have = new Set(contentStemsOf(s));
          return terms.filter((t) => have.has(t)).length >= need;
        });
        const excess = chapter === scene.chapter ? restating.slice(OWNER_ALLOWANCE) : restating;
        for (const sentence of excess) hits.push({ chapter, kind: "clue", fact: surface.id, owner: scene.chapter, sentence });
      }
    }
  }

  // ── windows: a clock window, owned by the first chapter that states it ──────────────────────────
  // Keyed on the window alone. Measured first with a named person required in the sentence, it found
  // 0 of run 98dec72a's four restatements of Margot's alibi: they read "I was in the kitchen from nine
  // o'clock to ten o'clock" and "her own alibi — nine o'clock to ten o'clock". Whoever says it, the
  // same window given again in a later chapter is the recap the reader named.
  const people = identifyPeople(
    options.people ?? [...core.scenes.flatMap((s) => s.present), ...core.fairPlay.culprits, core.fairPlay.victim],
  );
  const tracked = options.windows
    ? new Set(options.windows.map(([x, y]) => { const [a, b] = [x, y].sort((p, q) => p - q); return `${a}–${b}`; }))
    : null;
  const firstSeen = new Map<string, number>();
  const seenIn = new Map<string, number>();
  for (const { chapter, sentences } of chapters) {
    for (const sentence of sentences) {
      const dials = [...new Set(extractClockValues(sentence).map((v) => v.dial))];
      if (dials.length !== 2) continue; // two times make a window; three or more are a timetable
      const [a, b] = [...dials].sort((x, y) => x - y);
      const key = `${a}–${b}`;
      if (tracked && !tracked.has(key)) continue;
      const owner = firstSeen.get(key);
      if (owner === undefined) {
        firstSeen.set(key, chapter);
        seenIn.set(`${key}@${chapter}`, 1);
        continue;
      }
      const inThis = (seenIn.get(`${key}@${chapter}`) ?? 0) + 1;
      seenIn.set(`${key}@${chapter}`, inThis);
      if (exempt.has(chapter)) continue;
      if (chapter === owner && inThis <= OWNER_ALLOWANCE) continue;
      const who = namesIn(sentence, people);
      hits.push({ chapter, kind: "alibi", fact: `${who.length === 1 ? `${who[0]} ` : ""}${renderWindow(a!, b!)}`, owner, sentence });
    }
  }
  return hits;
};
