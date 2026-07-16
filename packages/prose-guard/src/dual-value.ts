/**
 * A_57 D2 / A_62 RC-2.2 — the dual-value-without-contrast detector.
 *
 * MOVED HERE from `@cml/rubric-score/src/facts.ts` (verbatim — same regex, same window, same
 * semantics) so it is reachable from the generation loop. The A_62 RC-2 rule: *a cap has a lever iff
 * its detector is reachable from the generation loop.* `prompts-llm` must not depend on
 * `@cml/rubric-score`, so while this lived there the `dualValueNoContrast` cap (Item 9 — 6/21 shipped
 * runs and accelerating: 3 of 5 on M1 attempt 3) was structurally leverless. `@cml/prose-guard` is the
 * sanctioned shared home (`scaffold.ts:144`); `rubric-score` now imports it from here, exactly as it
 * already does `detectTemplateLeakage` / `detectScaffoldNotProse` / `detectReportStyleClearance` —
 * the regen validator and the score cap key off the SAME function, so a passing regen provably no
 * longer trips the cap.
 *
 * WHAT IT FIRES ON: the discriminating clue's staged value and true value appearing close together
 * with NO contrast connective binding them — two flat parallel truths instead of one contradiction
 * ("the watch read ten past nine. The tide tables gave a quarter to eight."). High-precision: only the
 * two CANONICAL values (from the world-state ledger) co-occurring within a tight window, lacking a
 * contrast connective in that window. A story that properly frames the contrast ("the watch read X,
 * yet the shadow could only fall that way at Y") is NOT flagged.
 */

export interface DiscriminatingPair {
  values: [string, string];
}

/** Lowercased indexes of every occurrence of `needle` in `haystack`. */
function allIndexes(haystack: string, needle: string): number[] {
  const out: number[] = [];
  if (!needle) return out;
  let from = 0;
  for (;;) {
    const i = haystack.indexOf(needle, from);
    if (i === -1) break;
    out.push(i);
    from = i + needle.length;
  }
  return out;
}

export function detectDualValueNoContrast(prose: string, pair: DiscriminatingPair): boolean {
  const a = String(pair.values?.[0] ?? "").trim().toLowerCase();
  const b = String(pair.values?.[1] ?? "").trim().toLowerCase();
  if (!a || !b || a === b) return false;
  const lower = prose.toLowerCase();
  const CONTRAST = /\b(?:but|yet|however|whereas|while|though|although|rather than|instead of|could only|only have|cannot|can['’]?t|impossible|contradict\w*|discrepan\w*|at odds|conflict\w*|mismatch\w*|inconsisten\w*|did not match|didn['’]?t match)\b/;
  const WINDOW = 240; // ~2-3 sentences: "stated as two flat, side-by-side truths"
  const idxsA = allIndexes(lower, a);
  const idxsB = allIndexes(lower, b);
  for (const ia of idxsA) {
    for (const ib of idxsB) {
      const lo = Math.min(ia, ib);
      const hi = Math.max(ia + a.length, ib + b.length);
      if (hi - lo <= WINDOW) {
        // Inspect a slightly padded window so a contrast connective just before/after still counts.
        const windowText = lower.slice(Math.max(0, lo - 48), Math.min(lower.length, hi + 48));
        if (!CONTRAST.test(windowText)) return true; // co-present, no contrast → the D2 defect
      }
    }
  }
  return false;
}
