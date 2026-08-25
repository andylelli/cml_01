/**
 * shared/temporal-anchor.ts — single source of truth for the pipeline's load-bearing
 * temporal facts: the deterministic anchor date (year + month, hashed from runId) and the
 * derived season (month → season).
 *
 * This module CENTRALIZES logic that today lives duplicated in two places:
 *   1. The deterministic date derivation (`simpleHash` + `generateSpecificDate`) in
 *      packages/prompts-llm/src/agent2d-temporal-context.ts (~lines 104–134).
 *   2. The month→season map (`MONTH_TO_SEASON`) + `deriveTemporalSeasonLock`/`normalizeMonthToken`
 *      in packages/prompts-llm/src/agent9-prose/lint.ts (~lines 740–797).
 *
 * Per the Agent 2d redesign (documentation/12_system_redesign/05_agent_2d_temporal_context.md
 * §4.1 / §9.3 phase 1), the season is a *theorem derived from the month axiom*, not an opinion
 * an LLM offers and another agent overrules. This is the "first increment": the pure, additive,
 * dark module behind no flag — copied EXACTLY from the two existing implementations so a later
 * phase can repoint both consumers (Agent 2d and Agent 9) at it with provably zero behavior change.
 *
 * IMPORTANT: This module is a verbatim COPY, not a reimplementation. The golden test
 * (src/__tests__/temporal-anchor.test.ts) asserts byte-identical output against the LIVE
 * `generateSpecificDate` (agent2d) and the LIVE `MONTH_TO_SEASON` (agent9-prose/lint). Do NOT
 * change the math here without updating those originals first — the two must stay in lockstep
 * until phase 2 makes the originals read from this module.
 */

/**
 * Canonical season vocabulary. Copied EXACTLY from agent9-prose/lint.ts (`CanonicalSeason`).
 * Note: the season space is {spring, summer, autumn, winter} — Agent 9 uses "autumn" (not "fall"),
 * which is the value that wins over the LLM-authored season in prose generation.
 */
export type CanonicalSeason = "spring" | "summer" | "autumn" | "winter";

/**
 * Month → season map. Copied EXACTLY (byte-identical) from agent9-prose/lint.ts `MONTH_TO_SEASON`.
 * This is the ONE map the redesign wants to exist in exactly one place. Keys are lowercase month
 * names; the season values are the load-bearing temporal facts Agent 9 enforces in prose.
 */
export const MONTH_TO_SEASON: Record<string, CanonicalSeason> = {
  january: "winter",
  february: "winter",
  march: "spring",
  april: "spring",
  may: "spring",
  june: "summer",
  july: "summer",
  august: "summer",
  september: "autumn",
  october: "autumn",
  november: "autumn",
  december: "winter",
};

/**
 * Normalize a month token (trim + lowercase). Copied EXACTLY from agent9-prose/lint.ts
 * `normalizeMonthToken` — this is the normalization `deriveTemporalSeasonLock` applies before
 * the `MONTH_TO_SEASON` lookup, so months like "January" / " May " resolve correctly.
 */
export const normalizeMonthToken = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const normal = value.trim().toLowerCase();
  return normal.length > 0 ? normal : undefined;
};

/**
 * Derive the canonical season for a month. Mirrors agent9-prose/lint.ts `deriveTemporalSeasonLock`'s
 * lookup: normalize the token, then read `MONTH_TO_SEASON`. Returns `undefined` for an unknown or
 * empty month (exactly as the live derivation does — it returns `undefined` rather than a default).
 */
export const monthToSeason = (month: unknown): CanonicalSeason | undefined => {
  const normal = normalizeMonthToken(month);
  if (!normal) return undefined;
  return MONTH_TO_SEASON[normal];
};

/**
 * Simple hash function to convert string to number.
 * Copied EXACTLY (verbatim) from agent2d-temporal-context.ts so the hashed date is identical.
 */
export const simpleHash = (str: string): number => {
  /**
   * A_73 Part IV §2 — `str.length` on `undefined` throws a TypeError, and `agent2-cast.ts:167`
   * calls this with a bare `runId` and no fallback. The parameter is typed `string`, but this
   * codebase routes artifact data through `CaseData = any`, so an absent runId is reachable — and
   * two of the three call sites evidently thought so, since both defend against it.
   *
   * Coercing is the right answer HERE rather than at each call site: hashing the literal
   * `"undefined"` is stable, which is what every caller actually wants, and it removes a crash
   * without changing the hash of any real input.
   */
  if (typeof str !== "string") str = String(str);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Generate specific year and month from runId to ensure variation.
 * Copied EXACTLY (verbatim) from agent2d-temporal-context.ts `generateSpecificDate`. The hashing
 * and bit-shift math (`hash % 10`, `(hash >> 4) % 12`) MUST match so the date is byte-identical.
 *
 * NOTE: like the original, when `runId` is falsy this falls back to `Math.random()` and is therefore
 * non-deterministic for that one input — preserved verbatim so equivalence holds. Callers wanting a
 * stable anchor must pass a real runId (which the live call site does).
 */
export const generateSpecificDate = (
  decade: string,
  runId: string,
): { year: number; month: string } => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Parse decade (e.g., "1950s" -> 1950)
  const decadeStart = parseInt(decade.replace(/s$/, ''), 10) || 1950;

  // Use hash to deterministically select year and month
  /**
   * A_73 Part IV §2 — THE FALLBACK IS PRESERVED; ITS SILENCE IS NOT.
   *
   * Three files hash a runId and all three answer a falsy one differently:
   *
   *   agent2-cast.ts:167       simpleHash(runId)                 → TypeError (simpleHash reads .length)
   *   HERE                     simpleHash(runId || Math.random()) → NON-DETERMINISTIC
   *   name-generator.ts:568    simpleHash(runId || 'default')     → stable fallback
   *
   * The value is NOT changed here, because the header above pins this function as byte-identical to
   * `generateSpecificDate` in agent2d-temporal-context.ts and an equivalence claim is worth more
   * than tidiness. What changes is that the non-deterministic path now announces itself: a replay
   * that silently produces a different date is precisely the failure mode A_72 §10.4's matched-pair
   * method cannot survive, and until now nothing in the artifact or the log would have said so.
   */
  if (!runId) {
    console.warn(
      "[temporal-anchor] generateSpecificDate called with no runId — falling back to Math.random(). " +
        "This story's year/month are NOT reproducible, so it cannot serve as a matched-pair control.",
    );
  }
  const hash = simpleHash(runId || Math.random().toString());
  const yearOffset = hash % 10; // 0-9
  const monthIndex = (hash >> 4) % 12; // Use different bits for month

  return {
    year: decadeStart + yearOffset,
    month: monthNames[monthIndex]
  };
};

/**
 * The single, derived temporal source of truth the redesign wants (§4.1). It unifies the hashed
 * anchor date with the deterministically-derived season. `season` may be `undefined` only if the
 * month token is somehow not a canonical month name (the hashed `month` always is, so in practice
 * `deriveTemporalAnchor` always yields a defined season).
 */
export interface TemporalAnchor {
  /** Hashed from runId within the decade (e.g. 1953). */
  year: number;
  /** Hashed from runId — a full month name, e.g. "May" (matches `generateSpecificDate`). */
  month: string;
  /** Derived: `monthToSeason(month)` — the ONLY place this derivation lives. */
  season: CanonicalSeason | undefined;
}

/**
 * Compute the full `TemporalAnchor` for a (decade, runId). Pure: same inputs ⇒ same anchor
 * (provided a real runId is given — see `generateSpecificDate`'s falsy-runId note). This is the
 * future single source both Agent 2d and Agent 9 will read; today it is dark and additive.
 */
export const deriveTemporalAnchor = (
  decade: string,
  runId: string,
): TemporalAnchor => {
  const { year, month } = generateSpecificDate(decade, runId);
  return {
    year,
    month,
    season: monthToSeason(month),
  };
};
