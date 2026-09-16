/**
 * TURN DENSITY — does the middle of the book ever point somewhere else?
 *
 * A_95 M6 measured the structural half of this: across 51 stored outlines a `false_solution` scene's
 * purpose names an innocent being accused in 23 (45%), and an `alibis` scene carries its second
 * incident in 2 (4%). This is the other half — what arrived on the page.
 *
 * On the bookshop book (seed 63935), across ten chapters: **0 sentences entertain any suspect other
 * than the culprit, and 0 theories are overturned.** The story converges by chapter four and then
 * confirms the same answer six times. The reader never writes "obvious culprit" — the rubric has no
 * misdirection category — so it arrives as *"chapters 3-8 circle the same information"*, plot 7,
 * pacing 7.
 *
 * TELEMETRY, NEVER A GATE (B1): it would fire on most books we have.
 */

/** A sentence that puts a named non-culprit in the frame as a suspect. */
const SUSPICION =
  /\b(suspect|suspicion|accus\w*|guilt\w*|culprit|killer|murderer|theory|must have|responsible|blame)\b/i;

/**
 * A_96 C3 / F6 — a chapter that names a non-culprit as suspect and CLEARS them in the same chapter
 * has not turned; it has performed a turn and taken it back. Run 50862 scored 4 of 6 on the first
 * cut of this instrument with no false solution a reader would believe for a page: chapter 6 accused
 * Gwendolyn and resolved it inside the chapter. A turn is an accusation the chapter ENDS on.
 */
const CLEARING =
  /\b(cleared|innocent|could not have|cannot have|ruled out|not (?:the )?(?:killer|murderer|culprit)|alibi (?:holds|held|confirmed|stands)|accounted for|exonerat\w*)\b/i;

/** A sentence that overturns what was believed. */
const OVERTURN =
  /\b(overturn\w*|wrong (?:about|all along)|had been mistaken|no longer|ruled out|could not have|cannot have|revis\w+|reconsider\w*|new theory|after all|in fact|it was not)\b/i;

export interface TurnDensity {
  /** Chapters in the window that put a non-culprit in the frame. */
  chaptersSuspectingOthers: number;
  /** Chapters in the window that overturn a belief. */
  chaptersOverturning: number;
  /** Chapters examined. */
  window: number;
  /** Chapters doing either. */
  chaptersWithATurn: number;
}

const splitSentences = (text: string): string[] =>
  String(text ?? "").replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).filter(Boolean);

/**
 * @param chapters   chapter texts in order
 * @param culprits   the culprit name(s) — a sentence naming only these is convergence, not a turn
 * @param others     the non-culprit suspects
 * @param from/to    the 1-based middle window, default chapters 3..8
 */
export const turnDensity = (
  chapters: ReadonlyArray<string>,
  culprits: ReadonlyArray<string>,
  others: ReadonlyArray<string>,
  from = 3,
  to = 8,
): TurnDensity => {
  const lower = (xs: ReadonlyArray<string>) => xs.map((x) => String(x ?? "").trim()).filter(Boolean);
  const culpritNames = lower(culprits);
  const otherNames = lower(others);
  let suspecting = 0;
  let overturning = 0;
  let either = 0;
  let window = 0;
  for (let i = from - 1; i < Math.min(to, chapters.length); i += 1) {
    const text = chapters[i] ?? "";
    if (!text) continue;
    window += 1;
    let o = false;
    // A name is "in the frame" at chapter end only if it was suspected and NOT cleared afterwards in
    // the same chapter. Track the last suspicion and the last clearing per non-culprit name.
    const lastSuspected = new Map<string, number>();
    const lastCleared = new Map<string, number>();
    const sentences = splitSentences(text);
    sentences.forEach((sentence, idx) => {
      const namesCulprit = culpritNames.some((n) => sentence.includes(n));
      for (const n of otherNames) {
        if (!sentence.includes(n)) continue;
        if (SUSPICION.test(sentence) && !namesCulprit) lastSuspected.set(n, idx);
        if (CLEARING.test(sentence)) lastCleared.set(n, idx);
      }
      if (!o && OVERTURN.test(sentence)) o = true;
    });
    const s = [...lastSuspected.entries()].some(([n, at]) => (lastCleared.get(n) ?? -1) < at);
    if (s) suspecting += 1;
    if (o) overturning += 1;
    if (s || o) either += 1;
  }
  return { chaptersSuspectingOthers: suspecting, chaptersOverturning: overturning, window, chaptersWithATurn: either };
};

/** One line for the run report. */
export const summariseTurnDensity = (d: TurnDensity): string =>
  `${d.chaptersWithATurn}/${d.window} middle chapters turn — ${d.chaptersSuspectingOthers} END with a ` +
  `non-culprit still in the frame, ${d.chaptersOverturning} overturn a belief. The bookshop book measured ` +
  `0 and 0 across ten chapters; seed 50862 scored 4 on the weaker first cut with no turn a reader ` +
  `would believe. MEASURE only.`;
