/**
 * The means-link trace splitter (one splitter, two callers — 17-hitting-90 P1.3).
 *
 * Moved out of the v1 engine's `agent9-prose/discriminating.ts` by owner decision 1 (2026-09-30), which deleted that
 * engine; these are the declarations the v2 engine, Agent 7 or scoring still read (with every helper they
 * reference, moved by `scripts/move-declarations.mjs --closure`). Nothing in them changed.
 */

/**
 * Build discriminating test checklist from CML.
 * Provides explicit checkbox requirements for late chapters (past 70% of story) where the test should appear.
 * Breaks down complex multi-step reasoning into concrete requirements.
 */
/**
 * A_107 — split a weapon-first means-link trace ("<weapon>: <finding> — <culprit>", Agent 3 rule 8b)
 * into its parts, so the confrontation checklist can ask for the link without quoting a span long
 * enough to be copied and then rejected by the verbatim-copy gate. Undefined when the shape is absent.
 */
export const splitMeansLinkTrace = (
  trace: string | undefined,
): { weapon: string; finding: string; culprit: string } | undefined => {
  const t = String(trace ?? "").trim();
  const colon = t.indexOf(":");
  const dash = Math.max(t.lastIndexOf(" \u2014 "), t.lastIndexOf(" - "), t.lastIndexOf(" \u2013 "));
  if (colon <= 0 || dash <= colon) return undefined;
  const weapon = t.slice(0, colon).trim();
  const finding = t.slice(colon + 1, dash).trim().replace(/[.;,]+$/, "");
  const culprit = t.slice(dash + 3).trim().replace(/^by\s+/i, "").replace(/[.;,]+$/, "");
  if (!weapon || !finding || !culprit) return undefined;
  return { weapon: weapon.charAt(0).toLowerCase() + weapon.slice(1), finding, culprit };
};
