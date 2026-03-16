export const MONTH_TO_SEASON = {
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
export const MONTH_ABBREVIATIONS = {
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
const ALL_SEASONS = ['spring', 'summer', 'autumn', 'winter'];
export const MONTH_TO_FORBIDDEN_SEASONS = Object.fromEntries(Object.entries(MONTH_TO_SEASON).map(([month, season]) => [
    month,
    ALL_SEASONS.filter((candidate) => candidate !== season),
]));
const SEASON_PATTERNS = [
    { season: 'spring', pattern: /\b(spring|springtime|vernal)\b/i },
    { season: 'summer', pattern: /\b(summer|summertime|midsummer|summery)\b/i },
    { season: 'autumn', pattern: /\b(autumn|autumnal|fall)\b/i },
    { season: 'winter', pattern: /\b(winter|wintertime|wintry)\b/i },
];
const MONTH_PATTERNS = [
    ...Object.keys(MONTH_TO_SEASON).map((month) => ({
        month,
        pattern: new RegExp(`\\b${month}\\b`, 'i'),
    })),
    ...Object.entries(MONTH_ABBREVIATIONS).map(([abbr, month]) => ({
        month,
        pattern: new RegExp(`\\b${abbr}\\.?\\b`, 'i'),
    })),
];
export function analyzeTemporalConsistency(text, temporalMonth) {
    const lowered = (text || '').toLowerCase();
    const monthMentions = new Set();
    for (const { month, pattern } of MONTH_PATTERNS) {
        if (pattern.test(lowered)) {
            monthMentions.add(month);
        }
    }
    const canonicalTemporalMonth = normalizeMonth(temporalMonth);
    if (canonicalTemporalMonth) {
        monthMentions.add(canonicalTemporalMonth);
    }
    const mentionedMonths = Array.from(monthMentions);
    const expectedSeasonsSet = new Set(mentionedMonths.map((month) => MONTH_TO_SEASON[month]).filter(Boolean));
    const expectedSeasons = Array.from(expectedSeasonsSet);
    if (expectedSeasons.length === 0) {
        return {
            mentionedMonths: [],
            expectedSeasons: [],
            conflictingSeasons: [],
        };
    }
    const conflicting = new Set();
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
function normalizeMonth(value) {
    if (!value)
        return undefined;
    const cleaned = value.trim().toLowerCase().replace(/\.$/, '');
    if (MONTH_TO_SEASON[cleaned]) {
        return cleaned;
    }
    return MONTH_ABBREVIATIONS[cleaned];
}
//# sourceMappingURL=temporal-consistency.js.map