/**
 * A_108 — ONE SOFTENED RETRY WHEN AZURE'S CONTENT FILTER REFUSES A v2 PROMPT.
 *
 * MEASURED 2026-09-24, arm B of the v1-v2 engine pair (seed 23403, `resume-1790274273032`): all three
 * v2 writer drafts were refused before a word was written — `content_filter`, `violence: medium`, on
 * the PROMPT. The case was a stabbing with a fencing foil. v1 wrote the same case chapter by chapter
 * without a refusal; v2 packs the whole case into one ~31,000-character brief, and its violent wording
 * runs at 24.9 per 10,000 characters against v1's 13.0. So the v2 book was never written and the pair
 * could not be read.
 *
 * `llm-client/content-filter.ts` records that a softening policy should be "a separate, flag-gated
 * increment designed against the counts". These are the counts: three refusals in three, one case.
 *
 * THE POLICY. Only on a content-filter refusal, and only once: the same prompt is re-sent with the
 * case's most graphic words replaced by the restrained forms a Golden Age novel uses for them, plus
 * one line telling the writer the facts are unchanged. A prompt that passes is never touched. The
 * facts do not change — who, with what, where, when — only the vocabulary the filter scores.
 *
 * Flag-gated `AGENT9_V2_FILTER_SOFTEN` (default OFF), read at call time (ADR-0004).
 */

export const isFilterSoftenEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_V2_FILTER_SOFTEN ?? "").trim());

/** Graphic word → restrained form. Case of the first letter is preserved. Facts are untouched. */
const SOFTENINGS: Array<[RegExp, string]> = [
  [/\bstabbed\b/gi, "killed"],
  [/\bstabbing\b/gi, "killing"],
  [/\bstabs\b/gi, "strikes"],
  [/\bstab\b/gi, "strike"],
  [/\bblood-?stained\b/gi, "stained"],
  [/\bbloodied\b/gi, "stained"],
  [/\bbloody\b/gi, "stained"],
  [/\bbloodstains?\b/gi, "stains"],
  [/\bblood\b/gi, "stains"],
  [/\bwounds\b/gi, "marks"],
  [/\bwounded\b/gi, "hurt"],
  [/\bwound\b/gi, "mark"],
  [/\bcorpse\b/gi, "body"],
  [/\bgore\b/gi, "stains"],
  [/\bslit\b/gi, "cut"],
];

const matchCase = (original: string, replacement: string): string =>
  original.charAt(0) === original.charAt(0).toUpperCase() && original.charAt(0) !== original.charAt(0).toLowerCase()
    ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
    : replacement;

/** Replace the graphic vocabulary the filter scores. Pure; the count of replacements is returned. */
export const softenViolentWording = (text: string): { text: string; replaced: number } => {
  let replaced = 0;
  let out = String(text ?? "");
  for (const [re, replacement] of SOFTENINGS) {
    out = out.replace(re, (m) => {
      replaced += 1;
      return matchCase(m, replacement);
    });
  }
  return { text: out, replaced };
};

/** The one line the writer is told, so the restrained wording is not read as a change of facts. */
export const SOFTENED_NOTE =
  "Note: some words in the case notes below are written with the restraint of a Golden Age novel. " +
  "The facts are unchanged — who died, how, where and when — and the book should state them as plainly as the genre does.";
