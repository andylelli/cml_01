export type CanonicalSeason = 'spring' | 'summer' | 'autumn' | 'winter';

export const MONTH_TO_SEASON: Record<string, CanonicalSeason> = {
  january: 'winter',
  february: 'winter',
  march: 'spring',
  april: 'spring',
  may: 'spring',
  june: 'summer',
  july: 'summer',
  august: 'summer',
  september: 'autumn',
  october: 'autumn',
  november: 'autumn',
  december: 'winter',
};

export const MONTH_ABBREVIATIONS: Record<string, string> = {
  jan: 'january',
  feb: 'february',
  mar: 'march',
  apr: 'april',
  jun: 'june',
  jul: 'july',
  aug: 'august',
  sep: 'september',
  sept: 'september',
  oct: 'october',
  nov: 'november',
  dec: 'december',
};

const ALL_SEASONS: CanonicalSeason[] = ['spring', 'summer', 'autumn', 'winter'];

export const MONTH_TO_FORBIDDEN_SEASONS: Record<string, CanonicalSeason[]> =
  Object.fromEntries(
    Object.entries(MONTH_TO_SEASON).map(([month, season]) => [
      month,
      ALL_SEASONS.filter((candidate) => candidate !== season),
    ])
  ) as Record<string, CanonicalSeason[]>;

const SEASON_PATTERNS: Array<{ season: CanonicalSeason; pattern: RegExp }> = [
  { season: 'spring', pattern: /\b(spring|springtime|vernal)\b/i },
  { season: 'summer', pattern: /\b(summer|summertime|midsummer|summery)\b/i },
  { season: 'autumn', pattern: /\b(autumn|autumnal)\b/i },
  { season: 'winter', pattern: /\b(winter|wintertime|wintry)\b/i },
];

// "spring" collides with a clock's mainspring / "spring tension" — the load-bearing object in a
// time-tampering mystery, mentioned in nearly every chapter. The bare-word season test above would
// then false-fire a "month/season contradiction" on the clock component every single chapter, and it
// can never be repaired because the Agent 9 season-lock rewriter (correctly) PROTECTS mechanical
// springs. Strip these mechanical-spring collocations before testing the SEASONAL sense so the two
// agree. ("springtime"/"vernal" are unambiguous and are never stripped.)
// RC2.3 — the mechanical-"spring" exclusion noun list is no longer a hand-maintained per-mechanism
// regex (the A_60 whack-a-mole: sundial/gnomon had to be added by hand). The seed nouns below are the
// generic clockwork vocabulary; the CASE's own declared mechanism terms are UNIONED in at call time via
// buildSpringMechanicalRe(extractCaseMechanismTerms(case)), so a novel device is excluded by construction.
const BUILTIN_SPRING_MECH_NOUNS = [
  'main', 'coil', 'leaf', 'suspension', 'torsion', 'hair', 'clock', 'watch',
  'pendulum', 'escapement', 'balance', 'mantel', 'grandfather',
];

// Season vocabulary + common function words that must never enter the noun-trigger list: a clock case
// whose prose literally contains "spring" must not get "spring" re-added as a strip trigger, and no
// season word can become one either.
const SEASON_WORDS_FOR_STOP = [
  'spring', 'springtime', 'summer', 'summertime', 'midsummer', 'summery',
  'autumn', 'autumnal', 'winter', 'wintertime', 'wintry', 'vernal', 'season', 'seasonal',
];
// A_61 RC2.3 (review fix) — generic weather/temperature/time MODIFIERS must never be harvested as
// mechanism nouns: an adjective like "cold"/"early"/"damp" harvested from mechanism prose would enter the
// spring-collocation regex and strip a GENUINE seasonal "cold spring air", masking a real season conflict.
const GENERIC_MODIFIER_STOPWORDS = [
  'cold', 'warm', 'cool', 'chill', 'chilly', 'damp', 'dry', 'wet', 'mild', 'fresh', 'crisp', 'bitter',
  'harsh', 'misty', 'foggy', 'frosty', 'icy', 'rainy', 'sunny', 'windy', 'stormy', 'clear', 'grey', 'gray',
  'early', 'late', 'morning', 'evening', 'night', 'midnight', 'noon', 'dawn', 'dusk', 'hours', 'hour',
  'heavy', 'light', 'dark', 'pale', 'bright', 'soft', 'still', 'quiet', 'sudden', 'slow', 'deep', 'high', 'low',
];
const MECH_TERM_STOPWORDS = new Set<string>([
  'the', 'and', 'with', 'that', 'this', 'from', 'was', 'were', 'had', 'has', 'have', 'her', 'his',
  'him', 'she', 'they', 'their', 'them', 'then', 'than', 'which', 'while', 'been', 'into', 'onto',
  'over', 'under', 'when', 'where', 'what', 'who', 'whom', 'whose', 'because', 'would', 'could',
  'should', 'about', 'after', 'before', 'above', 'below', 'between', 'through', 'during',
  ...SEASON_WORDS_FOR_STOP,
  ...GENERIC_MODIFIER_STOPWORDS,
]);

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * RC2.3 — derive the case's declared mechanism vocabulary from the FROZEN case fields (never from
 * prose): the discriminating-test design/method text, the hidden-model mechanism description + delivery
 * path, and the death method. Tokens ≥4 chars, minus generic function words and every season word.
 * Null-safe → [] for a missing case. This is the union that excludes a novel mechanism's "spring"
 * collocation without any hand-edited regex.
 */
export function extractCaseMechanismTerms(cmlCase: any): string[] {
  const dt = cmlCase?.discriminating_test ?? {};
  const mech = cmlCase?.hidden_model?.mechanism ?? {};
  const sources: unknown[] = [
    dt.design, dt.pass_condition, dt.knowledge_revealed, dt.method, dt.test_description, dt.expected_result,
    mech.description,
    ...(Array.isArray(mech.delivery_path) ? mech.delivery_path.map((s: any) => s?.step) : []),
    cmlCase?.death_method,
  ];
  const out = new Set<string>();
  for (const src of sources) {
    if (typeof src !== 'string' || !src) continue;
    for (const w of src.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/)) {
      if (w.length >= 4 && !MECH_TERM_STOPWORDS.has(w)) out.add(w);
    }
  }
  return Array.from(out);
}

/**
 * Build the mechanical-spring exclusion regex from the builtin clockwork nouns unioned with the case's
 * declared mechanism terms. Only branch 1's noun group varies; the qualifier/action/enumeration branches
 * are fixed. `buildSpringMechanicalRe([])` is byte-identical to the pre-RC2.3 behaviour (the fallback).
 */
export function buildSpringMechanicalRe(mechanismTerms: readonly string[] = []): RegExp {
  const nounAlt = Array.from(new Set([...BUILTIN_SPRING_MECH_NOUNS, ...mechanismTerms]))
    .filter(Boolean)
    .map(escapeRe)
    .join('|');
  return new RegExp(
    [
      // <mechanism word>('s) spring(s): clock spring, clock's spring, mainspring, gnomon-spring (case term)
      String.raw`\b(?:${nounAlt})(?:'?s)?\s*-?\s*springs?\b`,
      // spring(s) <mechanism/trap qualifier>: spring tension, spring-loaded, spring blade, spring catch...
      String.raw`\bsprings?[\s-]+(?:tension|housing|barrel|mechanism|steel|coil|loaded|driven|assembly|recoil|blade|trap|catch|latch|lever|release|bolt|dagger|hinge|clip|arm)\b`,
      // <action> spring(s): wound spring, winding spring, coiled spring, tensioned spring, over-wound spring
      String.raw`\b(?:wound|winding|coiled|tension(?:ed)?|over-?wound|recoiled)\s+springs?\b`,
      // enumerated trap components — "a spring or a blade" (A_60): a "spring" listed as an alternative
      // mechanism within one clause of a trap noun via or/and, bounded in-sentence.
      String.raw`\bsprings?\b[^.!?]{0,25}?\b(?:or|and)\s+(?:an?\s+|the\s+)?(?:blade|trap|catch|latch|lever|bolt|dagger|mechanism)s?\b`,
    ].join('|'),
    'gi',
  );
}

// The no-terms fallback, used when a caller has no case vocabulary (narrative-continuity-validator).
const SPRING_MECHANICAL_RE = buildSpringMechanicalRe([]);

// Months that are also common English words (modal verb / motion verb).
const AMBIGUOUS_MONTHS = new Set(['may', 'march']);

// Title Case alone is NOT enough to disambiguate: a sentence- or quote-initial modal/verb is also Title
// Case ("'May I?' she asked", "March on!"). Require an explicit CALENDAR context — a temporal
// preposition/determiner before the month, an adjacent day-number or year, or a dated time-of-day —
// so only the genuine month sense counts. (Fixes the mystery-1782647685448 false positive: «'May I?'
// Eleanor asked» in a genuinely summery scene was read as the month May and flagged against "summery".)
const AMBIGUOUS_MONTH_CONTEXT_WORDS =
  'in|by|on|since|until|till|through|during|before|after|that|last|this|next|each|every|early|late|mid|of|one';
const buildAmbiguousMonthPattern = (month: string): RegExp =>
  new RegExp(
    [
      String.raw`\b(?:${AMBIGUOUS_MONTH_CONTEXT_WORDS})\s+${month}\b`,
      String.raw`\b${month}\s+(?:\d{1,2}(?:st|nd|rd|th)?|\d{4}|morning|afternoon|evening|night)\b`,
      String.raw`\b\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?${month}\b`,
    ].join('|'),
    'i',
  );

const MONTH_PATTERNS: Array<{ month: string; pattern: RegExp }> = [
  ...Object.keys(MONTH_TO_SEASON).map((month) => ({
    month,
    // Ambiguous months require an explicit calendar context (see above); the rest match the bare word.
    pattern: AMBIGUOUS_MONTHS.has(month)
      ? buildAmbiguousMonthPattern(month)
      : new RegExp(`\\b${month}\\b`, 'i'),
  })),
  ...Object.entries(MONTH_ABBREVIATIONS).map(([abbr, month]) => ({
    month,
    // A_53 P5 (mar-abbrev-collides-with-ambiguous-march): an abbreviation whose expansion is an
    // ambiguous English word ("mar" → march, also the verb "to mar") must carry the abbreviating
    // PERIOD — "Mar." is the month; bare "mar" ("would mar the autumn") is the verb. Unambiguous
    // abbreviations still match with or without the period.
    pattern: AMBIGUOUS_MONTHS.has(month)
      ? new RegExp(`\\b${abbr}\\.`, 'i')
      : new RegExp(`\\b${abbr}\\.?\\b`, 'i'),
  })),
];

/**
 * REVIEW_12 §3.1 — DOES THE CASE ITSELF NAME A SPRING AS A PHYSICAL OBJECT?
 *
 * MEASURED on run `mystery-1787090659145`: **8 of that run's 11 retry calls** were
 * `month/season contradiction (september vs spring)` on chapters 2, 3, 4 and 8, twice each. Agent 2d's
 * temporal data was CORRECT (`month: September`, `season: fall`). The contradiction was between the
 * case's own physical evidence —
 *
 *   CASE.constraint_space.physical.traces: "Broken spring fragment found near rooftop pulley"
 *
 * — and a season word list. Every occurrence of "spring" in the shipped manuscript is that object.
 *
 * `buildSpringMechanicalRe` already exists for this and could not reach it: it is built from mechanism
 * NOUNS (`main`, `coil`, `clock`…) and winding ACTIONS (`wound`, `coiled`…), so it strips "mainspring"
 * and "clock spring" but not "broken spring fragment", not "a loose wire and a broken spring", and not
 * the bare "the spring" that English uses once a thing has been introduced. Its own comment calls the
 * previous round of that list "the A_60 whack-a-mole", and lengthening it again would be the same move.
 *
 * The document-level fact is free and was going unused: when the case's own evidence names a spring,
 * the manuscript's springs are that object unless they carry an unambiguous SEASONAL marker. This
 * inverts the default for exactly the cases where the collision happens, and for no others.
 */
export function caseNamesMechanicalSpring(cmlCase: any): boolean {
  const cs = cmlCase?.constraint_space ?? {};
  const dt = cmlCase?.discriminating_test ?? {};
  const mech = cmlCase?.hidden_model?.mechanism ?? {};
  const sources: unknown[] = [
    ...(Array.isArray(cs.physical?.traces) ? cs.physical.traces : []),
    ...(Array.isArray(cs.access?.objects) ? cs.access.objects : []),
    dt.design, dt.method, dt.test_description, dt.pass_condition, dt.expected_result,
    mech.description,
    ...(Array.isArray(mech.delivery_path) ? mech.delivery_path.map((s: any) => s?.step) : []),
    cmlCase?.death_method,
  ];
  return sources.some((s) => typeof s === 'string' && /\bsprings?\b/i.test(s));
}

/**
 * "spring" in the SEASONAL sense, requiring a marker that a clock part cannot carry.
 *
 * Used only when `caseNamesMechanicalSpring` is true. `springtime` and `vernal` are unambiguous on
 * their own and stay; everything else needs a seasonal collocation.
 *
 * CHOSEN ON CORPUS EVIDENCE, not vocabulary: swept over 171 manuscripts and 487 sentences containing
 * "spring". This matches 365 of them and every sampled match is the season. Of the 122 left, 72 are
 * plainly the device ("the state of the spring", "a stiff spring", "broken spring fragment").
 *
 * THE TRADE, stated plainly. The residue also holds genuine seasonal uses ("spring coat", "spring
 * decorations"), so on a case that names a mechanical spring this can mask a real season error. That
 * requires the model to write spring-seasonal prose in a non-spring month — which the corpus does not
 * show happening, because the seasonal uses all come from stories actually set in spring, where there
 * is no conflict to mask. Against that: 8 unrepairable retries per affected run, every run.
 */
const SPRING_SEASONAL_COLLOCATION_NOUNS =
  'air|morning|afternoon|evening|day|days|night|nights|rain|rains|shower|showers|sun|sunshine|sunlight|' +
  'light|breeze|wind|winds|thaw|bloom|blooms|blossom|blossoms|green|grass|flower|flowers|weather|chill|' +
  'cold|frost|equinox|term|season|month|months|week|weeks|fog|mist|haze|drizzle|garden|gardens|dawn|dusk|' +
  'twilight|sky|storm|storms|tide|tides|planting|warmth|damp|coat|clouds|decorations|renewal';

const SPRING_SEASONAL_ONLY_RE = new RegExp(
  [
    String.raw`\b(?:springtime|vernal)\b`,
    String.raw`\b(?:early|late|mid|last|next|this|that|following|previous|one)\s+spring\b`,
    String.raw`\bspring(?:'s)?\s+(?:${SPRING_SEASONAL_COLLOCATION_NOUNS})\b`,
    String.raw`\b(?:chill|air|scent|smell|light|warmth|promise|edge|hint|first|onset|arrival|start|end|beginning|coming|midst)\s+of\s+spring\b`,
    String.raw`\bin\s+(?:the\s+)?spring\b`,
    String.raw`\bspring\s+(?:had|has|have|was|were|is|came|comes|arrived|arrives|turned|would|will)\b`,
    String.raw`\b(?:since|until|till|before|after|by|through|throughout|during)\s+(?:last\s+|next\s+|the\s+)?spring\b`,
  ].join('|'),
  'i',
);

export interface TemporalConsistencyAnalysis {
  mentionedMonths: string[];
  expectedSeasons: CanonicalSeason[];
  conflictingSeasons: CanonicalSeason[];
  /**
   * REVIEW_12 §3.2 — the exact text that produced each conflicting season, so the failure message can
   * name its trigger. "align season wording" is unactionable when the offending token is the case's
   * own murder device.
   */
  seasonTriggers: Partial<Record<CanonicalSeason, string>>;
}

export function analyzeTemporalConsistency(
  text: string,
  temporalMonth?: string,
  mechanismTerms?: readonly string[],
  /** True when the CASE names a spring as a physical object — see `caseNamesMechanicalSpring`. */
  caseNamesSpring = false,
): TemporalConsistencyAnalysis {
  const lowered = (text || '').toLowerCase();
  const monthMentions = new Set<string>();

  for (const { month, pattern } of MONTH_PATTERNS) {
    // Ambiguous months ("May"/"March") match only inside an explicit calendar context (see
    // buildAmbiguousMonthPattern); test against the original text to preserve any day/year casing.
    // Other patterns are case-insensitive and can use the pre-lowercased copy.
    const testTarget = AMBIGUOUS_MONTHS.has(month) ? text : lowered;
    if (pattern.test(testTarget)) {
      monthMentions.add(month);
    }
  }

  const canonicalTemporalMonth = normalizeMonth(temporalMonth);
  if (canonicalTemporalMonth) {
    monthMentions.add(canonicalTemporalMonth);
  }

  const mentionedMonths = Array.from(monthMentions);
  const expectedSeasonsSet = new Set<CanonicalSeason>(
    mentionedMonths.map((month) => MONTH_TO_SEASON[month]).filter(Boolean)
  );

  const expectedSeasons = Array.from(expectedSeasonsSet);
  if (expectedSeasons.length === 0) {
    return {
      mentionedMonths: [],
      expectedSeasons: [],
      conflictingSeasons: [],
      seasonTriggers: {},
    };
  }

  // For "spring", test a copy with mechanical-spring collocations removed so a clock's mainspring is
  // not mistaken for the season (the dominant false positive in time-tampering mysteries). RC2.3: when
  // the caller supplies the case's declared mechanism terms, exclude a novel device's spring collocation
  // by construction; otherwise use the builtin-only fallback (byte-identical to pre-RC2.3).
  const springRe = mechanismTerms && mechanismTerms.length
    ? buildSpringMechanicalRe(mechanismTerms)
    : SPRING_MECHANICAL_RE;
  const seasonalText = lowered.replace(springRe, ' ');
  const conflicting = new Set<CanonicalSeason>();
  const seasonTriggers: Partial<Record<CanonicalSeason, string>> = {};
  for (const { season, pattern } of SEASON_PATTERNS) {
    // REVIEW_12 §3.1: when the CASE names a spring as a physical object, the bare word is that object.
    // Only an unambiguous seasonal marker counts, which is what `SPRING_SEASONAL_ONLY_RE` requires.
    const effective =
      season === 'spring' && caseNamesSpring ? SPRING_SEASONAL_ONLY_RE : pattern;
    const target = season === 'spring' ? seasonalText : lowered;
    const match = effective.exec(target);
    // `pattern` may be a /g/ regex in some season entries; reset so a later call is not skipped.
    effective.lastIndex = 0;
    if (match && !expectedSeasonsSet.has(season)) {
      conflicting.add(season);
      // REVIEW_12 §3.2 — carry the offending words out, with a little context, so the caller can
      // name the trigger instead of restating the rule.
      const at = match.index ?? 0;
      seasonTriggers[season] = target.slice(Math.max(0, at - 40), at + match[0].length + 40).trim();
    }
  }

  return {
    mentionedMonths,
    expectedSeasons,
    conflictingSeasons: Array.from(conflicting),
    seasonTriggers,
  };
}

function normalizeMonth(value?: string): string | undefined {
  if (!value) return undefined;
  const cleaned = value.trim().toLowerCase().replace(/\.$/, '');
  if (MONTH_TO_SEASON[cleaned]) {
    return cleaned;
  }
  return MONTH_ABBREVIATIONS[cleaned];
}
