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
const SPRING_MECHANICAL_RE = new RegExp(
  [
    // <mechanism word>('s) spring(s): clock spring, clock's spring, mainspring, watch spring, balance spring
    String.raw`\b(?:main|coil|leaf|suspension|torsion|hair|clock|watch|pendulum|escapement|balance|mantel|grandfather)(?:'?s)?\s*-?\s*springs?\b`,
    // spring(s) <mechanism/trap qualifier>: spring tension, spring housing, spring-loaded, spring blade,
    // spring trap, spring catch... The separator is [\s-]+ (space OR hyphen) so "spring-loaded" — the
    // dominant A_60 sundial-trap form — is stripped, not read as the season.
    String.raw`\bsprings?[\s-]+(?:tension|housing|barrel|mechanism|steel|coil|loaded|driven|assembly|recoil|blade|trap|catch|latch|lever|release|bolt|dagger|hinge|clip|arm)\b`,
    // <action> spring(s): wound spring, winding spring, coiled spring, tensioned spring, over-wound spring
    String.raw`\b(?:wound|winding|coiled|tension(?:ed)?|over-?wound|recoiled)\s+springs?\b`,
    // enumerated trap components — "a spring or a blade", "a spring, perhaps, or a blade" (A_60): a
    // "spring" listed as an alternative mechanism within one clause of a trap noun via or/and. Bounded
    // by [^.!?]{0,25} so it stays in-sentence and short — a seasonal "spring" is not enumerated against
    // a blade, so "in the spring, the roses bloomed" is untouched.
    String.raw`\bsprings?\b[^.!?]{0,25}?\b(?:or|and)\s+(?:an?\s+|the\s+)?(?:blade|trap|catch|latch|lever|bolt|dagger|mechanism)s?\b`,
  ].join('|'),
  'gi',
);

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
  temporalMonth?: string
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
  // not mistaken for the season (the dominant false positive in time-tampering mysteries).
  const seasonalText = lowered.replace(SPRING_MECHANICAL_RE, ' ');
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
