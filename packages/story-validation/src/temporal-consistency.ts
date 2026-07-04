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

export interface TemporalConsistencyAnalysis {
  mentionedMonths: string[];
  expectedSeasons: CanonicalSeason[];
  conflictingSeasons: CanonicalSeason[];
}

export function analyzeTemporalConsistency(
  text: string,
  temporalMonth?: string,
  mechanismTerms?: readonly string[]
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
  for (const { season, pattern } of SEASON_PATTERNS) {
    const target = season === 'spring' ? seasonalText : lowered;
    if (pattern.test(target) && !expectedSeasonsSet.has(season)) {
      conflicting.add(season);
    }
  }

  return {
    mentionedMonths,
    expectedSeasons,
    conflictingSeasons: Array.from(conflicting),
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
