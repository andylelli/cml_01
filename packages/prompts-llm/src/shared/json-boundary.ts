/**
 * A_65b Ph8 (reliability plan) — THE JSON-BOUNDARY KIT, shared.
 *
 * jsonrepair silently CLOSES a truncated structure, fabricating plausible partial objects from
 * the cut-off tail. Run a3c2973f: an Agent-5 response ending `{"id": "clue_` was "repaired" into
 * a phantom clue that survived every downstream pass and hard-stopped the release gate 15 minutes
 * later. Agent 5 got the guard same-day; the Ph8 inventory found five more boundaries running
 * jsonrepair bare (agent3-cml — the CML itself — agent6-fairplay, agent65-world-builder,
 * agent2d, agent2e). This kit is the one rule, everywhere: a merely-SLOPPY payload (trailing
 * comma, unquoted key) still ends with its closing brace/bracket; a TRUNCATED one does not —
 * and a truncated payload must be REFUSED, not repaired, so the caller's existing retry/error
 * path handles it honestly instead of ingesting a phantom.
 *
 * CR-20: the ladder that applies this rule is `parseLlmJson` (llm-json.ts), at every boundary that repairs;
 * `guardedJsonrepairParse`, which had no production caller, is gone.
 */

/** True when the payload looks completion-limit truncated (no closing brace/bracket at the tail). */
export const looksTruncatedJson = (raw: string): boolean => {
  const t = String(raw ?? "")
    .trim()
    .replace(/```(?:json)?/gi, "")
    .trim();
  if (!t) return true;
  const last = t[t.length - 1];
  return last !== "}" && last !== "]";
};
