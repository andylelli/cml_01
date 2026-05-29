import type { ProseChapter } from "./types.js";

export interface TieredBannedPhrasePolicy {
  hard: string[];
  soft: string[];
  watch: string[];
}

const DEFAULT_TIERED_BANNED_PHRASE_POLICY: TieredBannedPhrasePolicy = {
  // Hard bans should always trigger retry/preventive enforcement.
  hard: [
    "clock tower at quarter past three",
    "near the clock tower at quarter past",
    "showed quarter past three when the body",
    "in the formal gardens during the murder",
  ],
  // Soft bans are strongly discouraged and should be rewritten if present.
  soft: [
    "lips pressed into a thin line",
    "the household runs smoothly when every cog",
    "the pressures upon this household are many",
  ],
  // Watchlist terms are tracked for telemetry/early warning.
  watch: [
    "quarter past three",
    "three fifteen",
    "the old bell striking three fifteen",
    "the chimes echoed just after three-fifteen",
  ],
};

const canonicalizeTimeMentions = (value: string): string =>
  value
    .replace(/\bquarter\s+past\s+three\b/gi, "3:15")
    .replace(/\bthree\s+fifteen\b/gi, "3:15")
    .replace(/\bthree-fifteen\b/gi, "3:15")
    .replace(/\b15\s+minutes\s+past\s+three\b/gi, "3:15")
    .replace(/\bjust\s+after\s+3:15\b/gi, "3:15");

export const normalizeForPhraseMatch = (value: string): string =>
  canonicalizeTimeMentions(String(value ?? "").toLowerCase())
    .replace(/[^a-z0-9:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const mergeUniquePhrases = (...groups: Array<string[] | undefined>): string[] => {
  const dedup = new Map<string, string>();
  for (const group of groups) {
    for (const raw of group ?? []) {
      const phrase = String(raw ?? "").trim();
      if (!phrase) continue;
      const key = normalizeForPhraseMatch(phrase);
      if (!key) continue;
      if (!dedup.has(key)) {
        dedup.set(key, phrase);
      }
    }
  }
  return Array.from(dedup.values());
};

export const getTieredBannedPhrasePolicy = (_caseData?: unknown): TieredBannedPhrasePolicy => ({
  hard: [...DEFAULT_TIERED_BANNED_PHRASE_POLICY.hard],
  soft: [...DEFAULT_TIERED_BANNED_PHRASE_POLICY.soft],
  watch: [...DEFAULT_TIERED_BANNED_PHRASE_POLICY.watch],
});

export const getRepairBannedPhrases = (policy: TieredBannedPhrasePolicy): string[] =>
  mergeUniquePhrases(policy.hard, policy.soft);

export const getWarningBannedPhrases = (policy: TieredBannedPhrasePolicy): string[] =>
  mergeUniquePhrases(policy.hard, policy.soft, policy.watch);

export const detectConfiguredBannedPhrases = (
  chapters: ProseChapter[],
  phrases: string[],
  minChapterHits = 1,
): string[] => {
  if (!Array.isArray(chapters) || chapters.length === 0 || !Array.isArray(phrases) || phrases.length === 0) {
    return [];
  }

  const normalizedChapters = chapters.map((chapter) =>
    normalizeForPhraseMatch((chapter.paragraphs ?? []).join(" ")),
  );
  const phraseHits = new Map<string, Set<number>>();

  for (let chapterIndex = 0; chapterIndex < normalizedChapters.length; chapterIndex += 1) {
    const chapterText = normalizedChapters[chapterIndex];
    for (const phrase of phrases) {
      const normalizedPhrase = normalizeForPhraseMatch(phrase);
      if (!normalizedPhrase) continue;
      if (!chapterText.includes(normalizedPhrase)) continue;
      if (!phraseHits.has(phrase)) {
        phraseHits.set(phrase, new Set<number>());
      }
      phraseHits.get(phrase)!.add(chapterIndex);
    }
  }

  return Array.from(phraseHits.entries())
    .filter(([, hits]) => hits.size >= minChapterHits)
    .sort((a, b) => b[1].size - a[1].size)
    .map(([phrase]) => phrase);
};
