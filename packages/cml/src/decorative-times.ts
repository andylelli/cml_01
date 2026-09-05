/**
 * ── T3: THE TIME CLAIMS THAT PROVE NOTHING ───────────────────────────────────────────────────────
 *
 * The external read of run 89022 (85/100) named this without naming it:
 *
 *   > There are too many time claims, and not all of them are necessary. The bell/sundial material
 *   > makes the story feel more complicated WITHOUT PROVING AS MUCH as the ring/watch/jacket clues.
 *
 * The obvious reading — "too many" is a count — is REFUTED. MEASURED over the 52 stored cases, that
 * book carries 8 distinct clock values against a corpus median of 9. It is not an outlier.
 *
 * The complaint is about NECESSITY, and necessity is checkable. A LOCKED fact is one the prose is
 * contractually required to print verbatim. A locked TIME fact that appears nowhere in
 * `inference_path` or `discriminating_test` is complexity the reader must carry and the mystery never
 * uses. On 89022 those were `festival_departure_time` ("twenty minutes past four") and
 * `chime_to_departure_interval` ("sixty-five minutes") — and "sixty-five minutes had passed before it
 * was done" is a line the SAME review listed under scaffold to delete. The reader met a number the
 * pipeline forced onto the page and the plot never spent.
 *
 * ── WHY THIS REPORTS AND DOES NOT GATE ───────────────────────────────────────────────────────────
 *
 * MEASURED over the 37 cases joinable to their locked-fact registry: 112 locked time facts, of which
 * **62 (55%) prove nothing**, spread across **29 of 37 cases (78%)**.
 *
 * B1 is unambiguous at 78% — a check that fires on most runs is an off switch with extra steps. This
 * is not a defect in a case, it is a property of how cases are built: Agent 3b authors a device with
 * its own clock, Agent 3 authors an inference path, and nothing requires the second to use the first.
 * Half the times in this pipeline are decoration by construction.
 *
 * So this is telemetry, and the number is the point. The fix is at the source — lock fewer times, or
 * make the inference use them — and that is a design decision, not something a linter should force.
 */

export interface DecorativeTimeFact {
  id: string;
  value: string;
}

const TIME_SHAPED_ID = /time|interval|duration|hour|clock|chime|when/i;

/**
 * Locked TIME facts the case's own reasoning never refers to.
 *
 * Matching is deliberately generous — value, id, and id-with-spaces all count as a reference — so
 * this UNDER-reports rather than over-reports. A fact it calls decorative is one the inference path
 * mentions in no form at all, which is the claim worth making.
 */
export const findDecorativeTimeFacts = (
  cmlCase: any,
  lockedFacts?: ReadonlyArray<{ id?: unknown; value?: unknown }>,
): DecorativeTimeFact[] => {
  const facts = (lockedFacts ?? []).filter(
    (f) => f && String(f.id ?? "").trim() && TIME_SHAPED_ID.test(String(f.id)),
  );
  if (facts.length === 0) return [];

  const caseBlock = cmlCase?.CASE ?? cmlCase;

  /**
   * NO REASONING TO JUDGE AGAINST MEANS NO VERDICT, and getting this wrong inflates the headline.
   *
   * The first version tested `haystack.trim()`, but `JSON.stringify({})` is `"{}"` — non-empty — so a
   * case with no inference path marked EVERY time fact decorative. Caught by a test asserting the
   * empty-case behaviour, and it mattered: the corpus rate was measured with the same bug and had to
   * be recomputed.
   */
  const hasContent = (node: unknown): boolean =>
    !!node && typeof node === "object" && Object.keys(node as object).length > 0;
  if (!hasContent(caseBlock?.inference_path) && !hasContent(caseBlock?.discriminating_test)) return [];

  const haystack = (
    JSON.stringify(caseBlock?.inference_path ?? {}) +
    " " +
    JSON.stringify(caseBlock?.discriminating_test ?? {})
  ).toLowerCase();

  return facts
    .filter((f) => {
      const id = String(f.id).toLowerCase();
      const value = String(f.value ?? "").toLowerCase();
      if (value && haystack.includes(value)) return false;
      if (haystack.includes(id)) return false;
      if (haystack.includes(id.replace(/_/g, " "))) return false;
      return true;
    })
    .map((f) => ({ id: String(f.id), value: String(f.value ?? "") }));
};

/** One line for the run log. Empty string when every locked time fact is used. */
export const summariseDecorativeTimes = (
  cmlCase: any,
  lockedFacts?: ReadonlyArray<{ id?: unknown; value?: unknown }>,
): string => {
  const decorative = findDecorativeTimeFacts(cmlCase, lockedFacts);
  if (decorative.length === 0) return "";
  const total = (lockedFacts ?? []).filter(
    (f) => f && String(f.id ?? "").trim() && TIME_SHAPED_ID.test(String(f.id)),
  ).length;
  return (
    `[T3 decorative-time] ${decorative.length} of ${total} locked TIME fact(s) appear nowhere in the ` +
    `inference path or the discriminating test — the prose must print them and the mystery never uses ` +
    `them: ${decorative.map((d) => `${d.id}="${d.value}"`).join(", ")}. ` +
    `MEASURE only (55% of locked time facts corpus-wide, 78% of cases — B1 forbids gating this).`
  );
};
