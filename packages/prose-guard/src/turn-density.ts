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
    let s = false;
    let o = false;
    for (const sentence of splitSentences(text)) {
      if (!s && SUSPICION.test(sentence)) {
        const namesOther = otherNames.some((n) => sentence.includes(n));
        const namesCulprit = culpritNames.some((n) => sentence.includes(n));
        if (namesOther && !namesCulprit) s = true;
      }
      if (!o && OVERTURN.test(sentence)) o = true;
      if (s && o) break;
    }
    if (s) suspecting += 1;
    if (o) overturning += 1;
    if (s || o) either += 1;
  }
  return { chaptersSuspectingOthers: suspecting, chaptersOverturning: overturning, window, chaptersWithATurn: either };
};

/** One line for the run report. */
export const summariseTurnDensity = (d: TurnDensity): string =>
  `${d.chaptersWithATurn}/${d.window} middle chapters turn — ${d.chaptersSuspectingOthers} put a ` +
  `non-culprit in the frame, ${d.chaptersOverturning} overturn a belief. The bookshop book measured ` +
  `0 and 0 across ten chapters. MEASURE only.`;
