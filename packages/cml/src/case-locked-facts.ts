/**
 * X51 (REVIEW_11 §8.1) — THE LOCKED-FACT REGISTRY IS DEVICE-SCOPED, AND THE DEVICE IS A CLOCK.
 *
 * `agent3b-run.ts` builds `ctx.lockedFactRegistry` from exactly one source: the PRIMARY hard-logic
 * device's own `lockedFacts`. The device is a timing trick, so on the canary every locked fact is a
 * clock time — and every case fact outside the device is pinned nowhere.
 *
 * The pin itself WORKS. On run `mystery-1786999938275` the phrase "a quarter to three" is verbatim
 * across five chapters because it is locked. What is not locked drifts, and the cold reader marked
 * both drifts down:
 *
 *   THE WEAPON      ch1 "heavy brass candlestick", ch2 onward "heavy bronze statuette".
 *                   ("Pick one." — the reader's first listed problem.)
 *   ALIBI LOCATIONS Captain Hale gives FOUR across five statements — "on patrol" (ch2), "on my
 *                   rounds… the lobby was empty" (ch3), "the staff saw me in the lounge" (ch6), "I
 *                   was in the smoking room with two staff" (ch8). Beatrice gives "the front desk"
 *                   (ch3), "the kitchen" (ch4), and BOTH in one ch9 sentence.
 *
 * Both facts already exist in the case model — `CASE.death_method` and each cast entry's
 * `alibi_window` — and the consistency gate downstream is value-agnostic (a verbatim string check).
 * Nothing routed them in. That is all this module does.
 *
 * ── WHY LOCATIONS AND NOT THE WHOLE `alibi_window` ──
 * `alibi_window` reads "2:00 to 2:40 PM in the smoking room". Locking that whole string would put a
 * third and fourth clock value into the registry, and `checkCaseTimeCoherence` (X38) fires only on
 * `clocks.length === 2 && durations.length === 1` — so locking the times would silently disable the
 * one check that caught this run's largest defect. Every value produced here is REFUSED if it parses
 * as a clock time or a duration, so the device's arithmetic stays the only arithmetic in the registry.
 */

import { isVictimArchetype, isDetectiveArchetype, roleTextsOf } from "./roles.js";
import { parseClockTime, parseDurationMinutes } from "./timeline-deception.js";

export interface CaseScopedLockedFact {
  id: string;
  value: string;
  description: string;
}

/** At most this many alibi locations, so a large cast cannot flood the prompt (see X47). */
const MAX_ALIBI_FACTS = 6;

/** Shortest value worth pinning: below this a "location" is a fragment, not a place. */
const MIN_VALUE_CHARS = 4;

const slug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);

/**
 * A value is safe to lock only if it is not a time. See the module header: a clock- or duration-valued
 * entry here would change what X38 sees and could switch that check off entirely.
 */
const isTimeValued = (value: string): boolean =>
  parseClockTime(value) !== null || parseDurationMinutes(value) !== null;

/**
 * The weapon noun from a death-method phrase, or null.
 *
 * Agent 3 writes `death_method` as an action: "struck with a heavy bronze statuette", "poisoned with
 * a tincture of foxglove". The instrument is what drifts between chapters, so the instrument is what
 * gets pinned — not the verb, which prose is entitled to vary ("struck", "brought down", "the blow").
 * Returns null rather than guessing when the phrase names no instrument ("strangled", "a fall").
 */
export const extractWeaponFromDeathMethod = (deathMethod: unknown): string | null => {
  const raw = String(deathMethod ?? "").trim();
  if (!raw) return null;
  // Take the LAST "with", so "struck from behind with a statuette" keeps the instrument.
  const m = /\bwith\s+(.+)$/i.exec(raw);
  if (!m) return null;
  const value = (m[1] ?? "")
    .trim()
    .replace(/["'.!?;,]+$/, "")
    // "a heavy bronze statuette to the head" — drop a trailing target phrase, keep the object.
    .replace(/\s+(?:to|in|on|across|against)\s+the\s+\w+$/i, "")
    .trim();
  if (value.length < MIN_VALUE_CHARS) return null;
  // A weapon phrase should not be a whole clause; a long one is the model narrating, not naming.
  if (value.split(/\s+/).length > 8) return null;
  if (isTimeValued(value)) return null;
  return value;
};

/**
 * The place from an `alibi_window` string, or null.
 *
 * The shape Agent 2 emits is "<time range> in <place>". Only the place is returned, for the reason in
 * the module header. Returns null when the field carries no place ("N/A", "2:00 to 2:40 PM"), because
 * an absent fact is better than a wrong one that prose is then ordered to repeat verbatim.
 */
export const extractAlibiLocation = (alibiWindow: unknown): string | null => {
  const raw = String(alibiWindow ?? "").trim();
  if (!raw || /^n\/?a$/i.test(raw)) return null;
  /**
   * The place is the FIRST locative tail that reads like a place.
   *
   * Two things were learned building this. More than one preposition is needed — the first version
   * took `" in "` only, which reads "2:00 to 2:40 PM in the smoking room" and misses "2:10 to 2:50 PM
   * AT the front desk", i.e. Beatrice Quill, the worst drifter in the 08-17 manuscript (front desk in
   * ch3, the kitchen in ch4, and both in one sentence in ch9). And FIRST beats last: taking the last
   * preposition truncates a multi-part place ("in the room by the stair" → "the stair"), while taking
   * the first plausible one skips a leading time phrase because that tail is too long to be a place.
   */
  const isPlace = (candidate: string): boolean => {
    if (candidate.length < MIN_VALUE_CHARS) return false;
    if (candidate.split(/\s+/).length > 6) return false;
    if (isTimeValued(candidate)) return false;
    // A time-of-day phrase is not a place. "…from two until three in the afternoon" would otherwise
    // pin "the afternoon" as Hale's whereabouts and order the prose to repeat it verbatim.
    return !/^(?:the\s+)?(?:morning|afternoon|evening|night|interval|hour|meantime|time)$/i.test(candidate);
  };

  for (const m of raw.matchAll(/\b(?:in|at|on|inside|within|near|beside|by)\s+/gi)) {
    const start = (m.index ?? 0) + m[0].length;
    const candidate = raw.slice(start).trim().replace(/["'.!?;,]+$/, "").trim();
    if (isPlace(candidate)) return candidate;
  }
  return null;
};

/**
 * Case-scoped locked facts: the murder weapon, and each suspect's alibi location.
 *
 * Additive and defensive by construction — every extraction that is not confident returns null and
 * contributes nothing, because the registry's contract is "reproduce this value exactly", and a wrong
 * value under that instruction is worse than no value at all.
 *
 * The victim and the detective are excluded from the alibi facts for the reason X50 records: you do
 * not pin an alibi for the corpse, and the sleuth's whereabouts are not a suspect's alibi.
 */
export const buildCaseScopedLockedFacts = (caseData: unknown): CaseScopedLockedFact[] => {
  const c = (caseData ?? {}) as Record<string, any>;
  const facts: CaseScopedLockedFact[] = [];

  const weapon = extractWeaponFromDeathMethod(c.death_method);
  if (weapon) {
    facts.push({
      id: "murder_weapon",
      value: weapon,
      description: "The object used to kill the victim — name it with these exact words every time it appears.",
    });
  }

  const cast: any[] = Array.isArray(c.cast) ? c.cast : [];
  const culprits = new Set<string>(
    (Array.isArray(c.culpability?.culprits) ? c.culpability.culprits : []).map((n: any) => String(n ?? "").trim()),
  );
  const seen = new Set<string>();
  // Count the alibi facts directly rather than inferring them from `facts.length` minus a weapon that
  // may not exist — `extractWeaponFromDeathMethod` returns null for "strangulation" or "a fall", and
  // the `facts.length >= MAX_ALIBI_FACTS + 1` form then admitted 7 alibis instead of 6.
  // FOUND ON REVIEW 2026-08-18.
  let alibiFacts = 0;
  for (const entry of cast) {
    if (alibiFacts >= MAX_ALIBI_FACTS) break;
    const name = String(entry?.name ?? "").trim();
    if (!name) continue;
    const roles = roleTextsOf(entry);
    if (roles.some(isVictimArchetype) || roles.some(isDetectiveArchetype)) continue;
    // The culprit's stated alibi is a claim the reveal DEMOLISHES. Pinning it would order the prose to
    // repeat the lie verbatim in the chapter that takes it apart, so the culprit is excluded too.
    if (culprits.has(name)) continue;
    const location = extractAlibiLocation(entry?.alibi_window);
    if (!location) continue;
    const id = `alibi_location_${slug(name)}`;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    alibiFacts += 1;
    facts.push({
      id,
      value: location,
      description: `Where ${name} says they were when the crime occurred — use this exact place every time their alibi is stated.`,
    });
  }

  return facts;
};
