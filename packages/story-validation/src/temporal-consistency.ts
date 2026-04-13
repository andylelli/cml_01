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
  { season: 'autumn', pattern: /\b(autumn|autumnal|fall)\b/i },
  { season: 'winter', pattern: /\b(winter|wintertime|wintry)\b/i },
];

// Months that are also common English words (modal verb / motion verb).
// Require Title Case so lowercase "may" and "march" don't trigger false positives.
const AMBIGUOUS_MONTHS = new Set(['may', 'march']);

const MONTH_PATTERNS: Array<{ month: string; pattern: RegExp }> = [
  ...Object.keys(MONTH_TO_SEASON).map((month) => ({
    month,
    // Ambiguous months need a capital first letter to avoid matching common verbs
    // (e.g. "he may leave" or "they march forward").
    pattern: AMBIGUOUS_MONTHS.has(month)
      ? new RegExp(`\\b${month[0].toUpperCase()}${month.slice(1)}\\b`)
      : new RegExp(`\\b${month}\\b`, 'i'),
  })),
  ...Object.entries(MONTH_ABBREVIATIONS).map(([abbr, month]) => ({
    month,
    pattern: new RegExp(`\\b${abbr}\\.?\\b`, 'i'),
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
    // Ambiguous month patterns require Title Case, so test against the original text.
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

  const conflicting = new Set<CanonicalSeason>();
  for (const { season, pattern } of SEASON_PATTERNS) {
    if (pattern.test(lowered) && !expectedSeasonsSet.has(season)) {
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
