/**
 * The sentences the pipeline writes for itself — one registry, so a checker can tell them apart from
 * prose (REVIEW_05 §10.1 / N1).
 *
 * WHY THIS FILE EXISTS. On run `mystery-1785870981757` the finished manuscript named its murderer in
 * exactly one sentence, and no human wrote it:
 *
 *   "Captain Ivor Hale was responsible; the evidence allowed no other reading."
 *
 * Three machine layers produced it. `enforceCulpritEvidencePresence` injected
 * *"…was responsible, and the evidence placed the matter beyond all reasonable doubt."* because the
 * model had named nobody; the `B5` scaffold floor then rewrote that into the shorter form above,
 * because the scaffold detector recognises the first phrasing and not the second. Geometry's
 * acceptance test could see neither, so "the story never names its culprit" read as satisfied.
 *
 * TWO PROPERTIES THIS FILE MUST HAVE, and both are load-bearing:
 *
 *   1. **The builders live here, and the injectors call them.** A registry that re-types the strings
 *      is a second body that drifts from the first — the trap this codebase has paid for repeatedly.
 *      `agent9-run.ts` imports these rather than holding its own copies.
 *   2. **It carries the LAUNDERED forms too.** A registry containing only what the injector writes
 *      would have matched nothing on that run, because what SHIPPED was the floor's rewrite. Every
 *      floor that edits an injected sentence must contribute its replacement here.
 *
 * The patterns are deliberately loose about names and punctuation and strict about the template
 * wording: the wording is ours and fixed, the names are not.
 */

import { buildResolutionBackstopSentence } from "./clue-validation.js";

export { buildResolutionBackstopSentence };

/**
 * `enforceCulpritEvidencePresence` — the deterministic floor for "the prose never links the culprit
 * to the act". MOVED from `agent9-run.ts`; the text is byte-identical, because changing it would
 * change what ships.
 */
export const buildCulpritEvidenceSentence = (culprit: string): string =>
  `${culprit} was responsible, and the evidence placed the matter beyond all reasonable doubt.`;

/** `enforceSuspectEliminationPresence` — the floor for "this suspect is never cleared in the prose". */
export const buildSuspectClearanceSentence = (surname: string): string =>
  `${surname} was thoroughly cleared by the evidence; the alibi confirmed they could not have committed the crime.`;

/**
 * Every sentence shape the pipeline writes for itself, INCLUDING the forms the scaffold floors
 * rewrite them into.
 *
 * A checker matching any of these has found machine text, not authored prose. Used by geometry's
 * acceptance test to return `met_by_injection` rather than `met` — the distinction that gives the
 * injector-retirement work (THINK_01 Move 5, REVIEW_05 §12.4) an exit condition it can measure.
 */
export const INJECTED_SENTENCE_PATTERNS: ReadonlyArray<RegExp> = [
  // enforceCulpritEvidencePresence, as written…
  /\bwas responsible,\s*and the evidence placed the matter beyond all reasonable doubt\b/i,
  // …and as the B5 scaffold floor rewrites it. THIS is the form that shipped on 08-04.
  /\bwas responsible;\s*the evidence allowed no other reading\b/i,
  // enforceSuspectEliminationPresence
  /\bwas thoroughly cleared by the evidence;\s*the alibi confirmed they could not have committed the crime\b/i,
  // the A3 scaffold floor's replacement for the clearance phrasing
  /\bplaced\s+.{1,40}?\s+elsewhere\b/i,
  // buildResolutionBackstopSentence — the confession backstop
  /"It was me\."\s*The words left\s+.{1,40}?\s+at last, barely above a whisper\./i,
  /"I confess\s*[—-]\s*I did it\."/i,
];

/** Does this sentence match something the pipeline wrote for itself? */
export const isInjectedSentence = (sentence: string): boolean =>
  INJECTED_SENTENCE_PATTERNS.some((re) => re.test(sentence));
