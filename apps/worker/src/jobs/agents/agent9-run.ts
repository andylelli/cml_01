/**
 * Agent 9: Prose Generator
 *
 * Handles:
 * - Prose generation with per-batch NSD tracking and scoring telemetry
 * - Schema validation repair retry
 * - Full story validation pipeline with targeted repair guardrails
 * - Auto-fix encoding issues
 * - Release gate quality checks (hard stops)
 *
 * Writes to ctx: prose, validationReport, proseScoringSnapshot, proseChapterScores,
 * proseSecondRunChapterScores, prosePassAccounting, proseRewritePassCount,
 * proseRepairPassCount, latestProseScore, nsdTransferTrace
 */

import { join } from "path";
import { existsSync, readFileSync } from "fs";
import {
  generateProse,
  initNarrativeState,
  updateNSD,
  type NarrativeState,
} from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { ProseScorer, StoryValidationPipeline, repairChapterPronouns } from "@cml/story-validation";
import type { PhaseScore, CastEntry } from "@cml/story-validation";
import {
  adaptProseForScoring,
  collectClueEvidenceFromProse,
} from "../scoring-adapters/index.js";
import {
  type OrchestratorContext,
  buildOutlineRepairGuardrails,
} from "./shared.js";

// ============================================================================
// Local types
// ============================================================================

type ValidationErrorSignal = {
  type?: string;
  message?: string;
};

type ProseReadabilitySummary = {
  denseChapterCount: number;
  underParagraphCount: number;
  severeParagraphBlocks: number;
};

// ============================================================================
// Prose text sanitization helpers
// ============================================================================

const proseMojibakeReplacements: Array<[RegExp, string]> = [
  [/Ã¢â‚¬â„¢/g, "\u2019"],
  [/Ã¢â‚¬Ëœ/g, "\u2018"],
  // eslint-disable-next-line no-control-regex
  [/Ã¢â‚¬Å"|Ã¢â‚¬\x9d/g, "\u201D"],
  [/Ã¢â‚¬"|Ã¢â‚¬â€/g, "\u2014"],
  [/Ã¢â‚¬â€œ/g, "\u2013"],
  [/Ã¢â‚¬Â¦/g, "\u2026"],
  [/faË†Â§ade|fa\u02c6\u00a7ade/g, "fa\u00e7ade"],
  [/â€™/g, "\u2019"],
  [/â€˜/g, "\u2018"],
  // eslint-disable-next-line no-control-regex
  [/â€œ|â€\x9d/g, "\u201C"],
  [/â€"|â€"/g, "\u2014"],
  [/â€"/g, "\u2013"],
  [/â€¦/g, "\u2026"],
  [/â\u0080\u0099/g, "\u2019"],
  [/â\u0080\u0098/g, "\u2018"],
  [/â\u0080\u009c|â\u0080\u009d/g, "\u201C"],
  [/â\u0080\u0093/g, "\u2013"],
  [/â\u0080\u0094/g, "\u2014"],
  [/â\u0080\u00a6/g, "\u2026"],
  [/â\u0080\u00a2/g, "\u2022"],
  [/Ã\u201a/g, ""],
  [/Â/g, ""],
  [/\uFFFD/g, ""],
];

export const illegalControlCharPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
// persistentMojibakePattern: detects sequences that survived the replacement table above.
// Used as a hard-stop check after the chapter is written to disk — if any of these
// multibyte mojibake fragments appear, the repair table failed and the prose must be rejected.
export const persistentMojibakePattern =
  /(?:Ã¢â‚¬â„¢|Ã¢â‚¬Ëœ|Ã¢â‚¬Å"|â€™|â€˜|â€œ|â€\x9d|â€"|â€¦|\uFFFD)/; // eslint-disable-line no-control-regex

const normalizeWrappedParagraphText = (text: string) => {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim())
    .filter((block) => block.length > 0);
  return blocks.join("\n\n");
};

const splitIntoFallbackChunks = (text: string, maxLength: number): string[] => {
  const fallbackChunks: string[] = [];
  let remaining = text.trim();
  while (remaining.length > maxLength) {
    const splitAt = remaining.lastIndexOf(" ", maxLength);
    const safeSplit = splitAt > Math.floor(maxLength * 0.55) ? splitAt : maxLength;
    fallbackChunks.push(remaining.slice(0, safeSplit).trim());
    remaining = remaining.slice(safeSplit).trim();
  }
  if (remaining.length > 0) fallbackChunks.push(remaining);
  return fallbackChunks.filter(Boolean);
};

const splitLongParagraphForReadability = (paragraph: string, maxLength = 900): string[] => {
  const normalized = paragraph.trim();
  if (!normalized) return [];
  if (normalized.length <= maxLength) return [normalized];

  const sentences = normalized
    .split(/(?<=[.!?]["'\u201D\u2019]?)\s+(?=[A-Z0-9"\u201C\u2018])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return splitIntoFallbackChunks(normalized, maxLength);
  }

  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxLength && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  if (chunks.length <= 1 && normalized.length > maxLength) {
    return splitIntoFallbackChunks(normalized, maxLength);
  }

  return chunks;
};

export const sanitizeProseText = (value: unknown) => {
  let text = typeof value === "string" ? value : value == null ? "" : String(value);
  text = text.normalize("NFC");
  for (const [pattern, replacement] of proseMojibakeReplacements) {
    text = text.replace(pattern, replacement);
  }
  return text
    .replace(/^Generated in scene batches\.?$/gim, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(illegalControlCharPattern, "")
    .replace(/\u00A0/g, " ")
    .replace(/\t/g, " ")
    .replace(/\r\n/g, "\n")
    // Dialogue punctuation normalization
    .replace(/"([^"]*)"/g, "\u201C$1\u201D")
    .replace(/(\w)'(\w)/g, "$1\u2019$2")
    .replace(/--/g, "\u2014")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+$/gm, "")
    .trim();
};

const enforceReadableParagraphFlow = (paragraphs: string[]): string[] => {
  let normalized = paragraphs
    .map((paragraph) => normalizeWrappedParagraphText(sanitizeProseText(paragraph)))
    .flatMap((paragraph) => paragraph.split(/\n{2,}/))
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .flatMap((paragraph) => splitLongParagraphForReadability(paragraph));

  let guard = 0;
  while (normalized.length < 3 && guard < 4) {
    const longestIndex = normalized.reduce(
      (bestIdx, paragraph, idx, arr) =>
        paragraph.length > arr[bestIdx].length ? idx : bestIdx,
      0,
    );
    const longest = normalized[longestIndex] ?? "";
    if (longest.length < 500) break;

    const splitChunks = splitLongParagraphForReadability(
      longest,
      Math.max(280, Math.floor(longest.length / 2)),
    );
    if (splitChunks.length <= 1) break;

    normalized = [
      ...normalized.slice(0, longestIndex),
      ...splitChunks,
      ...normalized.slice(longestIndex + 1),
    ];
    guard += 1;
  }

  return normalized;
};

const buildDeterministicGroundingLead = (
  chapterIndex: number,
  locationProfiles: any,
): string => {
  const primary = locationProfiles.primary;
  const keyLocations = locationProfiles.keyLocations || [];
  const target =
    keyLocations.length > 0 ? keyLocations[chapterIndex % keyLocations.length] : undefined;

  const locationName = target?.name || primary?.name || "the estate";
  const place = primary?.place ? ` in ${primary.place}` : "";
  const country = primary?.country ? `, ${primary.country}` : "";
  const weather = locationProfiles.atmosphere?.weather || "rain";
  const mood = locationProfiles.atmosphere?.mood || "tense";

  const smells = target?.sensoryDetails?.smells || [];
  const sounds = target?.sensoryDetails?.sounds || [];
  const tactile = target?.sensoryDetails?.tactile || [];

  const smell = (smells[0] || "old timber and damp stone").replace(/\.$/, "");
  const sound = (sounds[0] || "the sound of the wind in the corridor").replace(/\.$/, "");
  const touch = (tactile[0] || "the cold banister and rough wallpaper").replace(/\.$/, "");

  const leadTemplates = [
    `${locationName}${place}${country} carried ${weather.toLowerCase()} in every corridor; ${sound} drifted past, and ${touch} made the ${mood.toLowerCase()} mood impossible to ignore.`,
    `Under ${weather.toLowerCase()} skies, ${locationName}${place}${country} felt sharply ${mood.toLowerCase()}; ${sound} lingered while ${smell} clung to coats and curtains.`,
    `By the time they reached ${locationName}${place}${country}, ${sound} had become a constant undertone, and ${touch} left the room feeling quietly ${mood.toLowerCase()}.`,
    `In ${locationName}${place}${country}, ${smell} and ${sound} met at the doorway, and even ${touch} seemed to signal a ${mood.toLowerCase()} turn in events.`,
    `${locationName}${place}${country} met them with ${weather.toLowerCase()} and ${smell}; ${sound} threaded through the scene, and ${touch} sharpened the ${mood.toLowerCase()} tension.`,
  ];

  return sanitizeProseText(leadTemplates[chapterIndex % leadTemplates.length]);
};

const templateLeakageScaffoldPattern =
  /at\s+the\s+[a-z][\s\S]{0,120}the\s+smell\s+of[\s\S]{20,300}?atmosphere\s+ripe\s+for\s+revelation\.?/i;

const normalizeParagraphForLeakageDedup = (paragraph: string) =>
  paragraph.replace(/\s+/g, " ").trim().toLowerCase();

const getGroundingSignals = (opening: string, anchors: string[]) => {
  const normalized = opening.toLowerCase();
  const hasAnchor = anchors.some((anchor) => normalized.includes(anchor));
  const sensoryCount = (
    normalized.match(
      /\b(smell|scent|odor|fragrance|sound|echo|silence|whisper|creak|cold|warm|damp|rough|smooth|glow|shadow|flicker|dim)\b/gi,
    ) || []
  ).length;
  const hasAtmosphere =
    /\b(rain|wind|fog|storm|mist|thunder|evening|morning|night|dawn|dusk|lighting|season|weather)\b/i.test(
      normalized,
    );
  return { hasAnchor, sensoryCount, hasAtmosphere };
};

// ============================================================================
// Word-form locked fact repair
// ============================================================================

const WORD_TO_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, 'twenty-one': 21, 'twenty-two': 22, 'twenty-three': 23,
  'twenty-four': 24, 'twenty-five': 25, 'twenty-six': 26, 'twenty-seven': 27,
  'twenty-eight': 28, 'twenty-nine': 29, thirty: 30, half: 30, quarter: 15,
  'thirty-one': 31, 'thirty-two': 32, 'thirty-three': 33, 'thirty-four': 34,
  'thirty-five': 35, 'thirty-six': 36, 'thirty-seven': 37, 'thirty-eight': 38,
  'thirty-nine': 39, forty: 40, 'forty-one': 41, 'forty-two': 42,
  'forty-three': 43, 'forty-four': 44, 'forty-five': 45, 'forty-six': 46,
  'forty-seven': 47, 'forty-eight': 48, 'forty-nine': 49, fifty: 50,
  'fifty-five': 55, sixty: 60,
};

/**
 * Parse a word-form time string (e.g. "ten minutes past eleven", "half past three")
 * into a { hour, minute } pair. Returns null if not a recognised pattern.
 */
const parseWordFormTime = (value: string): { hour: number; minute: number } | null => {
  const lower = value.toLowerCase().trim();

  // "half past [hour]"
  const halfPast = lower.match(/^half\s+past\s+(\w+)$/);
  if (halfPast) {
    const h = WORD_TO_NUM[halfPast[1]];
    if (h != null) return { hour: h, minute: 30 };
  }

  // "quarter past [hour]"
  const quarterPast = lower.match(/^quarter\s+past\s+(\w+)$/);
  if (quarterPast) {
    const h = WORD_TO_NUM[quarterPast[1]];
    if (h != null) return { hour: h, minute: 15 };
  }

  // "quarter to [hour]"
  const quarterTo = lower.match(/^quarter\s+to\s+(\w+)$/);
  if (quarterTo) {
    const h = WORD_TO_NUM[quarterTo[1]];
    if (h != null) return { hour: h === 1 ? 12 : h - 1, minute: 45 };
  }

  // "[N word] [minutes] past [hour]" — e.g. "ten minutes past eleven", "five past six"
  const minutesPast = lower.match(/^([\w-]+)\s+(?:minutes?\s+)?past\s+(\w+)$/);
  if (minutesPast) {
    const m = WORD_TO_NUM[minutesPast[1].trim()];
    const h = WORD_TO_NUM[minutesPast[2].trim()];
    if (m != null && h != null) return { hour: h, minute: m };
  }

  // "[N word] [minutes] to [hour]" — e.g. "ten minutes to twelve", "five to three"
  const minutesTo = lower.match(/^([\w-]+)\s+(?:minutes?\s+)?to\s+(\w+)$/);
  if (minutesTo) {
    const m = WORD_TO_NUM[minutesTo[1].trim()];
    const h = WORD_TO_NUM[minutesTo[2].trim()];
    if (m != null && h != null) {
      return { hour: h === 1 ? 12 : h - 1, minute: 60 - m };
    }
  }

  return null;
};

/**
 * Parse a word-form quantity string (e.g. "forty minutes", "seven inches", "two miles")
 * into a { amount, unit } pair. Accepts any unit word that follows a recognised number word.
 * Returns null if not a recognised pattern.
 */
const parseWordFormQuantity = (value: string): { amount: number; unit: string } | null => {
  const lower = value.toLowerCase().trim();
  // Matches exactly: "[word-form-number] [unit]" — e.g. "forty minutes", "seven inches", "three shots"
  const match = lower.match(/^([\w-]+)\s+(\w+)$/);
  if (!match) return null;
  const amount = WORD_TO_NUM[match[1]];
  if (amount == null) return null;
  return { amount, unit: match[2] };
};

/**
 * Deterministic post-prose repair for word-form locked-fact time and duration values.
 *
 * When a locked fact's canonical value is a word-phrased time (e.g.
 * "ten minutes past eleven") or a word-phrased duration (e.g. "forty minutes"),
 * the LLM may convert it to digit form ("11:10 PM", "40 minutes") despite the
 * FIX-C prompt instruction. This pass scans each scoped chapter's paragraphs
 * and replaces any digit-form equivalent with the canonical word form,
 * preventing the ProseConsistencyValidator from firing a false
 * locked_fact_missing_value major issue.
 *
 * Per-chapter warning is emitted when more than 3 replacements are required
 * in a single chapter — this indicates the LLM is persistently ignoring the
 * locked-fact format constraint and may need stronger attribution.
 */
export const repairWordFormLockedFacts = (prose: any, lockedFacts: any[]): any => {
  if (!Array.isArray(lockedFacts) || lockedFacts.length === 0) return prose;

  // Build (pattern → canonical) repair list for word-form time and duration facts.
  const repairs: Array<{ pattern: RegExp; canonical: string; chaptersScope: Set<number> | null }> = [];

  for (const fact of lockedFacts) {
    const canonical = typeof fact.value === 'string' ? fact.value.trim() : null;
    if (!canonical) continue;

    const chaptersScope = Array.isArray(fact.appearsInChapters) && fact.appearsInChapters.length > 0
      ? new Set((fact.appearsInChapters as string[]).map(Number).filter((n) => !isNaN(n)))
      : null;

    // Try time-of-day pattern first (e.g. "ten minutes past eleven" → catch "11:10 PM").
    const parsedTime = parseWordFormTime(canonical);
    if (parsedTime) {
      const { hour, minute } = parsedTime;
      const minutePadded = String(minute).padStart(2, '0');
      // Match "H:MM" or "H.MM" optionally followed by AM/PM variants.
      const pattern = new RegExp(
        `\\b${hour}[:\\.]${minutePadded}(?:\\s*(?:AM|PM|a\\.m\\.|p\\.m\\.|am|pm))?\\b`,
        'g',
      );
      repairs.push({ pattern, canonical, chaptersScope });
      continue;
    }

    // Try word-phrased quantity pattern (e.g. "forty minutes" → catch "40 minutes",
    // "seven inches" → catch "7 inches", "three shots" → catch "3 shots").
    const parsedQuantity = parseWordFormQuantity(canonical);
    if (parsedQuantity) {
      const { amount, unit } = parsedQuantity;
      // Build unit pattern:
      //  - Regular plurals ending in 's' ("minutes", "shots", "yards"): make the 's' optional
      //    so both digit-singular and digit-plural forms are caught.
      //  - Irregular plurals and exact forms ("feet", "inch"): use exact match to avoid
      //    constructing invalid stems (e.g. "fee" from "feet").
      const escapedUnit = unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const unitPattern = unit.endsWith('s') && unit.length > 3
        ? `${unit.slice(0, -1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?`
        : escapedUnit;
      const pattern = new RegExp(
        `\\b${amount}\\s+${unitPattern}\\b`,
        'gi',
      );
      repairs.push({ pattern, canonical, chaptersScope });
    }
  }

  if (repairs.length === 0) return prose;

  let totalRepairs = 0;
  const repairedChapters = (prose.chapters as any[]).map((chapter: any, idx: number) => {
    const chapterNumber = idx + 1;
    const applicableRepairs = repairs.filter(
      (r) => !r.chaptersScope || r.chaptersScope.has(chapterNumber),
    );
    if (applicableRepairs.length === 0) return chapter;

    let chapterRepairs = 0;
    const repairedParagraphs = (chapter.paragraphs as string[]).map((paragraph: string) => {
      let repaired = paragraph;
      for (const { pattern, canonical } of applicableRepairs) {
        pattern.lastIndex = 0; // reset stateful regex
        const before = repaired;
        repaired = repaired.replace(pattern, canonical);
        if (repaired !== before) chapterRepairs += 1;
      }
      return repaired;
    });

    totalRepairs += chapterRepairs;

    if (chapterRepairs > 3) {
      console.warn(
        `[Agent 9] repairWordFormLockedFacts: Chapter ${chapterNumber} required ${chapterRepairs} replacements — LLM may be persistently ignoring the locked-fact format constraint.`,
      );
    }

    return { ...chapter, paragraphs: repairedParagraphs };
  });

  if (totalRepairs > 0) {
    console.log(`[Agent 9] repairWordFormLockedFacts: ${totalRepairs} digit-form → word-form replacement(s) applied.`);
  }

  return { ...prose, chapters: repairedChapters };
};

export const applyDeterministicProsePostProcessing = (
  prose: any,
  locationProfiles: any,
  castCharacters: CastEntry[] = [],
): any => {
  const anchors: string[] = [];
  if (locationProfiles.primary?.name) anchors.push(locationProfiles.primary.name.toLowerCase());
  (locationProfiles.keyLocations || []).forEach((loc: any) => {
    if (loc?.name) anchors.push(String(loc.name).toLowerCase());
  });

  const seenLongParagraphs = new Set<string>();
  let totalPronounRepairs = 0;

  const processedChapters = prose.chapters.map((chapter: any, index: number) => {
    const readableParagraphs = enforceReadableParagraphFlow(chapter.paragraphs || []);
    const opening = readableParagraphs.slice(0, 2).join(" ");
    const signals = getGroundingSignals(opening, anchors);

    const needsGroundingLead =
      !signals.hasAnchor || signals.sensoryCount < 2 || !signals.hasAtmosphere;
    const groundedParagraphs = needsGroundingLead
      ? [buildDeterministicGroundingLead(index, locationProfiles), ...readableParagraphs]
      : readableParagraphs;

    const sanitizedParagraphs = groundedParagraphs
      .map((paragraph: string, paragraphIndex: number) => {
        const cleaned = sanitizeProseText(paragraph);
        if (templateLeakageScaffoldPattern.test(cleaned)) {
          return buildDeterministicGroundingLead(index + paragraphIndex, locationProfiles);
        }
        return cleaned;
      })
      .filter((paragraph: string) => paragraph.length > 0);

    const leakageDedupedParagraphs = sanitizedParagraphs.map(
      (paragraph: string, paragraphIndex: number) => {
        const normalized = normalizeParagraphForLeakageDedup(paragraph);
        if (normalized.length < 170) {
          return paragraph;
        }
        if (!seenLongParagraphs.has(normalized)) {
          seenLongParagraphs.add(normalized);
          return paragraph;
        }
        return buildDeterministicGroundingLead(index + paragraphIndex + 1, locationProfiles);
      },
    );

    // Deterministic pronoun repair: fix wrong-gender pronouns in unambiguous sentences.
    // Only active when cast characters are provided.
    if (castCharacters.length > 0) {
      const pronRepaired = repairChapterPronouns(
        { ...chapter, paragraphs: leakageDedupedParagraphs },
        castCharacters,
      );
      totalPronounRepairs += pronRepaired.repairCount;
      return pronRepaired.chapter;
    }

    return {
      ...chapter,
      paragraphs: leakageDedupedParagraphs,
    };
  });

  return {
    ...prose,
    chapters: processedChapters,
    pronounRepairsApplied: totalPronounRepairs,
  };
};

const chapterHeadingPrefixPattern = /^\s*chapter\s+\d+\s*:\s*/i;

export const normalizeChapterTitle = (value: unknown) => {
  const sanitized = sanitizeProseText(value);
  let title = sanitized;
  let guard = 0;

  while (chapterHeadingPrefixPattern.test(title) && guard < 4) {
    title = title.replace(chapterHeadingPrefixPattern, "").trim();
    guard += 1;
  }

  return title.replace(/^[:\-\s]+/, "").trim();
};

export const sanitizeProseResult = (prose: any): any => ({
  ...prose,
  note: prose.note ? sanitizeProseText(prose.note) || undefined : prose.note,
  chapters: prose.chapters.map((chapter: any, index: number) => ({
    ...chapter,
    title: normalizeChapterTitle(chapter.title) || `Chapter ${index + 1}`,
    summary: chapter.summary ? sanitizeProseText(chapter.summary) || undefined : chapter.summary,
    paragraphs: chapter.paragraphs
      .map((paragraph: any) => normalizeWrappedParagraphText(sanitizeProseText(paragraph)))
      .filter((p: string) => p.length > 0),
  })),
});

// ============================================================================
// Clue visibility
// ============================================================================

export const getExpectedClueIdsForVisibility = (
  cmlCase: any,
  clueDistribution?: any,
): string[] => {
  const mappingIds: string[] = (
    (cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as unknown[]
  )
    .map((entry: any) => String(entry?.clue_id || ""))
    .filter(Boolean);
  const distributionIds: string[] = (clueDistribution?.clues ?? [])
    .map((entry: any) => String(entry?.id || ""))
    .filter(Boolean);
  const discriminatingIds: string[] = (
    (cmlCase?.discriminating_test?.evidence_clues ?? []) as unknown[]
  )
    .map((entry) => String(entry || ""))
    .filter(Boolean);
  const registryIds: string[] = ((cmlCase?.clue_registry ?? []) as unknown[])
    .map((entry: any) => String(entry?.clue_id || entry?.id || ""))
    .filter(Boolean);

  // Reconcile: only keep mapping/registry IDs that Agent 5 actually distributed to chapters.
  // Ambient clues in the registry with no chapter assignment are not visible in prose and must
  // not appear in the expected set (they would generate false "missing clue" failures).
  // discriminatingIds are always kept — they are required by fair-play rules regardless.
  //
  // Guard: if clueDistribution is absent (or produced no clues), fall back to the full
  // registry+mapping union so the function remains safe when called before Agent 5 has run.
  if (distributionIds.length === 0) {
    return Array.from(
      new Set([...mappingIds, ...discriminatingIds, ...registryIds]),
    );
  }

  const distributedSet = new Set(distributionIds);
  const droppedIds = [...new Set([...mappingIds, ...registryIds])].filter(
    (id) => !distributedSet.has(id) && !discriminatingIds.includes(id),
  );
  if (droppedIds.length > 0) {
    console.warn(
      `[getExpectedClueIdsForVisibility] ${droppedIds.length} clue ID(s) excluded from expected set (not in Agent 5 distributed output): ${droppedIds.join(", ")}`,
    );
  }

  // reconciledMappingIds / reconciledRegistryIds are subsets of distributionIds by construction
  // (filtered to only those present in distributedSet), so they add no new IDs to the union.
  // The effective return is: distributionIds ∪ discriminatingIds.
  return Array.from(
    new Set([...distributionIds, ...discriminatingIds]),
  );
};

// ============================================================================
// Validation error classification
// ============================================================================

const normalizeValidationErrorKey = (value: string | undefined) =>
  (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const matchesValidationAliases = (value: string | undefined, aliases: string[]) => {
  const normalizedValue = normalizeValidationErrorKey(value);
  return aliases.some((alias) => normalizeValidationErrorKey(alias) === normalizedValue);
};

const DISCRIMINATING_TEST_ALIAS_KEYS = [
  "missing_discriminating_test",
  "cml_test_not_realized",
  "discriminating_test_missing",
];

const SUSPECT_CLOSURE_ALIAS_KEYS = [
  "suspect_closure_missing",
  "suspect_elimination_coverage_incomplete",
  "suspect_elimination_missing",
  "suspect_clearance_missing",
];

const CULPRIT_EVIDENCE_CHAIN_ALIAS_KEYS = [
  "culprit_evidence_chain_missing",
  "culprit_chain_missing",
  "culprit_evidence_missing",
  "culprit_link_missing",
];

const DISCRIMINATING_TEST_MESSAGE_RE =
  /(discriminating\s+test|re-?enactment|timing\s+test|constraint\s+proof|test\s+scene)/i;
const SUSPECT_CLOSURE_MESSAGE_RE =
  /(suspect\s+(eliminat|clos|clear)|ruled\s+out|alibi\s+confirm|suspect\s+coverage)/i;
const CULPRIT_CHAIN_MESSAGE_RE =
  /(culprit\s+.*evidence\s+chain|evidence\s+chain\s+.*culprit|culprit\s+.*non-ambiguous\s+evidence)/i;

export const isDiscriminatingTestCoverageError = (error: ValidationErrorSignal) =>
  matchesValidationAliases(error.type, DISCRIMINATING_TEST_ALIAS_KEYS) ||
  DISCRIMINATING_TEST_MESSAGE_RE.test(error.message || "");

export const isSuspectClosureCoverageError = (error: ValidationErrorSignal) =>
  matchesValidationAliases(error.type, SUSPECT_CLOSURE_ALIAS_KEYS) ||
  SUSPECT_CLOSURE_MESSAGE_RE.test(error.message || "");

export const isCulpritEvidenceChainCoverageError = (error: ValidationErrorSignal) =>
  matchesValidationAliases(error.type, CULPRIT_EVIDENCE_CHAIN_ALIAS_KEYS) ||
  CULPRIT_CHAIN_MESSAGE_RE.test(error.message || "");

export const isSuspectEliminationCoverageError = (error: ValidationErrorSignal) =>
  isSuspectClosureCoverageError(error) || isCulpritEvidenceChainCoverageError(error);

// ============================================================================
// Release gate evaluation helpers
// ============================================================================

const evaluateProseReadability = (prose: any): ProseReadabilitySummary => {
  let denseChapterCount = 0;
  let underParagraphCount = 0;
  let severeParagraphBlocks = 0;

  prose.chapters.forEach((chapter: any) => {
    const paragraphs = chapter.paragraphs || [];
    if (paragraphs.length < 3) {
      underParagraphCount += 1;
      denseChapterCount += 1;
    }
    const overlong = paragraphs.filter((paragraph: string) => paragraph.length > 2400).length;
    if (overlong > 0) {
      severeParagraphBlocks += overlong;
      denseChapterCount += 1;
    }
  });

  return { denseChapterCount, underParagraphCount, severeParagraphBlocks };
};

const evaluateSceneGroundingCoverage = (prose: any, locationProfiles: any) => {
  const knownAnchors = new Set<string>();
  if (locationProfiles.primary?.name)
    knownAnchors.add(locationProfiles.primary.name.toLowerCase());
  (locationProfiles.keyLocations || []).forEach((loc: any) => {
    if (loc?.name) knownAnchors.add(String(loc.name).toLowerCase());
  });

  const sensoryTerms =
    /\b(smell|scent|odor|fragrance|sound|echo|silence|whisper|creak|cold|warm|damp|rough|smooth|glow|shadow|flicker|dim)\b/gi;
  const atmosphereTerms =
    /\b(rain|wind|fog|storm|mist|thunder|evening|morning|night|dawn|dusk|lighting|season|weather)\b/i;

  let grounded = 0;
  prose.chapters.forEach((chapter: any) => {
    const opening = chapter.paragraphs.slice(0, 2).join(" ").toLowerCase();
    const hasAnchor = Array.from(knownAnchors).some((anchor) => opening.includes(anchor));
    const sensoryCount = (opening.match(sensoryTerms) || []).length;
    const hasAtmosphere = atmosphereTerms.test(opening);
    if (hasAnchor && sensoryCount >= 2 && hasAtmosphere) {
      grounded += 1;
    }
  });

  const coverage = prose.chapters.length > 0 ? grounded / prose.chapters.length : 0;
  return { grounded, total: prose.chapters.length, coverage };
};

const placeholderRoleSurnamePattern =
  /\b(a|an)\s+(inspector|detective|constable|sergeant|captain|gentleman|lady|woman|man|doctor)\s+([A-Z][a-z]+(?:[-''][A-Z][a-z]+)?)\b/g;
const placeholderNamedStandalonePattern = /\b(a woman [A-Z][a-z]+|a man [A-Z][a-z]+)\b/g;
const placeholderGenericRolePattern =
  /\b(a gentleman|an inspector|a detective|a constable|a sergeant|a captain|a doctor)\b/gi;

const evaluatePlaceholderLeakage = (prose: any) => {
  const joined = prose.chapters
    .map((chapter: any) => {
      const body = (chapter.paragraphs || []).join("\n");
      return `${chapter.title}\n${chapter.summary ?? ""}\n${body}`;
    })
    .join("\n\n");

  const roleSurnameMatches = (Array.from(joined.matchAll(placeholderRoleSurnamePattern)) as RegExpMatchArray[]).map(
    (match) => match[0],
  );
  const namedStandaloneMatches = (Array.from(
    joined.matchAll(placeholderNamedStandalonePattern),
  ) as RegExpMatchArray[]).map((match) => match[0]);
  const genericRoleMatches = joined.match(placeholderGenericRolePattern) || [];
  const uniqueRoleSurnameMatches = Array.from(new Set(roleSurnameMatches));

  return {
    roleSurnameCount: roleSurnameMatches.length,
    standaloneCount: namedStandaloneMatches.length,
    genericRoleCount: genericRoleMatches.length,
    examples: uniqueRoleSurnameMatches.slice(0, 5),
    severeLeakage: roleSurnameMatches.length > 0 || namedStandaloneMatches.length >= 2,
    hasLeakage:
      roleSurnameMatches.length > 0 ||
      namedStandaloneMatches.length > 0 ||
      genericRoleMatches.length >= 12,
  };
};

const evaluateChapterHeadingArtifacts = (prose: any) => {
  const offending = prose.chapters.filter((chapter: any) =>
    chapterHeadingPrefixPattern.test(chapter.title || ""),
  );
  return { duplicatedHeadingCount: offending.length, hasArtifacts: offending.length > 0 };
};

// ============================================================================
// Writing guides loader (uses workspaceRoot from ctx — not import.meta.url)
// ============================================================================

const loadWritingGuides = (workspaceRoot: string): { humour?: string; craft?: string } => {
  const guides: { humour?: string; craft?: string } = {};
  const notesDir = join(workspaceRoot, "notes");
  try {
    const humourPath = join(notesDir, "DEFINITIVE_GUIDE_TO_HUMOUR.md");
    if (existsSync(humourPath)) {
      guides.humour = readFileSync(humourPath, "utf8");
    }
  } catch { /* optional guide */ }
  try {
    const craftPath = join(notesDir, "WHAT_MAKES_A_GOOD_WHODUNNIT.md");
    if (existsSync(craftPath)) {
      guides.craft = readFileSync(craftPath, "utf8");
    }
  } catch { /* optional guide */ }
  return guides;
};

// ============================================================================
// runAgent9
// ============================================================================

export async function runAgent9(ctx: OrchestratorContext): Promise<void> {
  const {
    client,
    inputs,
    runId,
    projectId,
    reportProgress,
    savePartialReport,
    enableScoring,
    scoreAggregator,
    scoringLogger,
    workspaceRoot,
  } = ctx;

  const cml = ctx.cml!;
  const cast = ctx.cast!;
  const characterProfiles = ctx.characterProfiles!;
  const locationProfiles = ctx.locationProfiles!;
  const temporalContext = ctx.temporalContext!;
  const hardLogicDevices = ctx.hardLogicDevices!;
  const narrative = ctx.narrative!;
  const clues = ctx.clues!;
  const coverageResult = ctx.coverageResult!;
  const outlineCoverageIssues = ctx.outlineCoverageIssues!;
  const fairPlayAudit = ctx.fairPlayAudit;

  reportProgress("prose", "Generating prose chapter by chapter with per-chapter validation...", 91);

  const baselineProseGuardrails = [
    "Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.",
    "Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.",
    "In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).",
  ];

  let prose: any;
  const totalSceneCount =
    narrative.acts?.flatMap((a: any) => a.scenes || []).length || 0;
  const moralAmbiguityNote = hardLogicDevices.devices[0]?.moralAmbiguity;
  const proseLockedFacts = (hardLogicDevices.devices ?? []).flatMap((d: any) =>
    Array.isArray(d.lockedFacts) ? d.lockedFacts : []
  );

  // Derive which chapters each locked fact is expected to appear in by cross-referencing
  // the narrative scene→clue assignments against locked fact keyword overlap.
  //
  // Without this scoping, ProseConsistencyValidator fires the verbatim-phrase check on
  // every chapter that incidentally matches 2+ keywords from the fact's description
  // (e.g. any chapter mentioning "clock" triggers the check for "exact time shown on
  // stopped clock face"). Since mystery prose uses these words throughout, the result
  // is dozens of false-positive major issues that block the story validation gate.
  //
  // With appearsInChapters populated, the validator only checks the chapters where
  // the associated clue evidence is formally introduced to the reader.
  const clueIdToChapters = new Map<string, number[]>();
  for (const act of (narrative.acts ?? [])) {
    for (const scene of (act.scenes ?? [])) {
      const chapterNum = scene.sceneNumber as number;
      for (const clueId of (Array.isArray(scene.cluesRevealed) ? scene.cluesRevealed : [])) {
        const existing = clueIdToChapters.get(clueId) ?? [];
        existing.push(chapterNum);
        clueIdToChapters.set(clueId, existing);
      }
    }
  }
  const annotatedLockedFacts = proseLockedFacts.map((fact: any) => {
    // If the fact already carries chapter scoping (e.g. set by agent3b), respect it.
    if (Array.isArray(fact.appearsInChapters) && fact.appearsInChapters.length > 0) return fact;
    const keywords = String(fact.description ?? '').toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
    const matchedChapters = new Set<number>();
    for (const clue of (clues.clues ?? [])) {
      const clueText = `${clue.description} ${clue.pointsTo}`.toLowerCase();
      const overlap = keywords.filter((kw: string) => clueText.includes(kw)).length;
      if (overlap >= 2) {
        for (const ch of (clueIdToChapters.get(clue.id) ?? [])) {
          matchedChapters.add(ch);
        }
      }
    }
    return matchedChapters.size > 0
      ? { ...fact, appearsInChapters: [...matchedChapters].sort((a, b) => a - b).map(String) }
      : fact;
  });

  const characterGenderMap: Record<string, string> = Object.fromEntries(
    cast.cast.characters.filter((c: any) => c.gender).map((c: any) => [c.name, c.gender]),
  );
  let narrativeState: NarrativeState = initNarrativeState(
    annotatedLockedFacts,
    characterGenderMap,
  );
  const prosePhaseStartTime = Date.now();
  const proseDeployment =
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME_PROSE ||
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  const proseModelOverride = proseDeployment
    ? ({ model: proseDeployment } as Record<string, string>)
    : {};

  const pushProsePassAccounting = (
    passType: string,
    durationMs: number,
    cost: number,
    chaptersGenerated: number,
  ) => {
    ctx.prosePassAccounting.push({
      pass_type: passType,
      duration_ms: durationMs,
      cost,
      chapters_generated: chaptersGenerated,
    });
  };

  const computeProseChapterScoreSeries = async (chaptersToScore: any[]): Promise<any[]> => {
    if (!enableScoring || !scoreAggregator || chaptersToScore.length === 0) return [];
    try {
      const scorer = new ProseScorer();
      const batchSize = Math.max(1, Math.min(inputs.proseBatchSize ?? 1, 10));
      const series: any[] = [];
      const accumulated: any[] = [];
      const totalChapters = totalSceneCount || chaptersToScore.length;

      for (let i = 0; i < chaptersToScore.length; i += batchSize) {
        const batch = chaptersToScore.slice(i, i + batchSize);
        accumulated.push(...batch);

        const adaptedBatch = adaptProseForScoring(batch, (cml as any).CASE, clues);
        const batchScore = await scorer.score({}, adaptedBatch, {
          previous_phases: {
            agent2_cast: cast.cast,
            agent2b_character_profiles: characterProfiles.profiles,
            agent2c_location_profiles: locationProfiles,
          },
          cml,
          threshold_config: { mode: "standard" },
          targetLength: inputs.targetLength ?? "medium",
          partialGeneration: true,
        });

        const adaptedAll = adaptProseForScoring(accumulated, (cml as any).CASE, clues);
        const cumulativeScore = await scorer.score({}, adaptedAll, {
          previous_phases: {
            agent2_cast: cast.cast,
            agent2b_character_profiles: characterProfiles.profiles,
            agent2c_location_profiles: locationProfiles,
          },
          cml,
          threshold_config: { mode: "standard" },
          targetLength: inputs.targetLength ?? "medium",
          partialGeneration: true,
        });

        series.push({
          chapter: Math.min(i + batch.length, totalChapters),
          total_chapters: totalChapters,
          individual_score: Math.round(batchScore.total ?? 0),
          cumulative_score: Math.round(cumulativeScore.total ?? 0),
          individual_validation_score: Math.round(batchScore.validation_score ?? 0),
          individual_quality_score: Math.round(batchScore.quality_score ?? 0),
          individual_completeness_score: Math.round(batchScore.completeness_score ?? 0),
          individual_consistency_score: Math.round(batchScore.consistency_score ?? 0),
          cumulative_validation_score: Math.round(cumulativeScore.validation_score ?? 0),
          cumulative_quality_score: Math.round(cumulativeScore.quality_score ?? 0),
          cumulative_completeness_score: Math.round(cumulativeScore.completeness_score ?? 0),
          cumulative_consistency_score: Math.round(cumulativeScore.consistency_score ?? 0),
        });
      }

      return series;
    } catch {
      return [];
    }
  };

  const rescoreAgent9ProsePhase = async () => {
    if (!enableScoring || !scoreAggregator) return;
    try {
      const secondRunSeries = await computeProseChapterScoreSeries(prose.chapters);
      if (ctx.proseSecondRunChapterScores.length === 0 && secondRunSeries.length > 0) {
        ctx.proseSecondRunChapterScores = secondRunSeries;
      }

      const reAdaptedProse = adaptProseForScoring(prose.chapters, (cml as any).CASE, clues);
      const reScoreProse = await new ProseScorer().score({}, reAdaptedProse, {
        previous_phases: {
          agent2_cast: cast.cast,
          agent2b_character_profiles: characterProfiles.profiles,
          agent2c_location_profiles: locationProfiles,
        },
        cml,
        targetLength: inputs.targetLength ?? "medium",
        threshold_config: { mode: "standard" },
        narrativeSceneCount: totalSceneCount || undefined,
      });

      if (ctx.proseChapterScores.length > 0) {
        (reScoreProse as PhaseScore).breakdown = {
          chapter_scores: [...ctx.proseChapterScores],
          repair_chapter_scores: [...ctx.proseSecondRunChapterScores],
        };
      }

      ctx.latestProseScore = reScoreProse;
      scoreAggregator.upsertPhaseScore(
        "agent9_prose",
        "Prose Generation",
        reScoreProse,
        ctx.agentDurations["agent9_prose"] ?? 0,
        ctx.agentCosts["agent9_prose"] ?? 0,
      );
    } catch {
      // Re-scoring is best-effort; never abort generation
    }
  };

  const proseStart = Date.now();
  ctx.proseScoringSnapshot.startedAtMs = proseStart;
  const accumulatedChapters: any[] = [];

  prose = await generateProse(client, {
    caseData: cml,
    outline: narrative,
    cast: cast.cast,
    ...proseModelOverride,
    detectiveType: inputs.detectiveType,
    worldDocument: ctx.worldDocument,
    characterProfiles: characterProfiles,
    locationProfiles: locationProfiles,
    temporalContext: temporalContext,
    moralAmbiguityNote,
    lockedFacts: annotatedLockedFacts,
    clueDistribution: clues,
    narrativeState,
    targetLength: inputs.targetLength,
    narrativeStyle: inputs.narrativeStyle,
    qualityGuardrails: [
      ...baselineProseGuardrails,
      ...(outlineCoverageIssues.length > 0
        ? buildOutlineRepairGuardrails(outlineCoverageIssues, cml)
        : []),
    ],
    writingGuides: loadWritingGuides(workspaceRoot),
    runId,
    projectId: projectId || "",
    onProgress: (phase: string, message: string, percentage: number) =>
      reportProgress(phase as any, message, percentage),
    batchSize: inputs.proseBatchSize,
    onBatchComplete: async (batchChapters: any, batchStart: number, batchEnd: number, validationIssues: any) => {
      const nsdBefore = {
        clues_revealed_to_reader: [...narrativeState.cluesRevealedToReader],
      };

      const allOutlineScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes || []);
      const batchRevealedIds: string[] = allOutlineScenes
        .filter((s: any) => s.sceneNumber >= batchStart && s.sceneNumber <= batchEnd)
        .flatMap((s: any) => (Array.isArray(s.cluesRevealed) ? s.cluesRevealed : []));
      const lastBatchChapter = batchChapters[batchChapters.length - 1];
      narrativeState = updateNSD(narrativeState, {
        paragraphs: lastBatchChapter?.paragraphs,
        cluesRevealedIds: batchRevealedIds,
      });
      const newlyRevealedClues = batchRevealedIds.filter(
        (id) => !nsdBefore.clues_revealed_to_reader.includes(id),
      );
      const batchClueEvidence = collectClueEvidenceFromProse(
        batchChapters,
        (cml as any).CASE,
        clues,
      );
      const clueEvidenceAnchors = newlyRevealedClues.flatMap(
        (clueId) => batchClueEvidence.evidenceByClue[clueId] ?? [],
      );
      const clueStateById: Record<string, any> = Object.fromEntries(
        newlyRevealedClues.map((clueId) => [
          clueId,
          batchClueEvidence.clueStateById[clueId] ?? "introduced",
        ]),
      );
      const cluesWithNoAnchor = newlyRevealedClues.filter(
        (clueId) => (batchClueEvidence.evidenceByClue[clueId] ?? []).length === 0,
      );
      if (cluesWithNoAnchor.length > 0) {
        ctx.warnings.push(
          `NSD batch ${batchStart}-${batchEnd}: clue(s) marked revealed but no prose evidence anchor found: ${cluesWithNoAnchor.join(", ")}. Fair-play verification may be incomplete.`,
        );
      }

      ctx.nsdTransferTrace.push({
        batch_start: batchStart,
        batch_end: batchEnd,
        chapters_generated: batchChapters.length,
        validation_issue_count: validationIssues?.length ?? 0,
        validation_issue_samples: (validationIssues ?? []).slice(0, 3),
        newly_revealed_clue_ids: [...new Set(newlyRevealedClues)],
        clue_state_by_id: clueStateById,
        clue_evidence_anchors: clueEvidenceAnchors,
        before: nsdBefore,
        after: {
          clues_revealed_to_reader: [...narrativeState.cluesRevealedToReader],
        },
      });

      const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;

      if (enableScoring && scoreAggregator && scoringLogger) {
        accumulatedChapters.push(...batchChapters);
        try {
          const scorer = new ProseScorer();
          const adaptedBatch = adaptProseForScoring(batchChapters, (cml as any).CASE, clues);
          const batchScore = await scorer.score({}, adaptedBatch, {
            previous_phases: {
              agent2_cast: cast.cast,
              agent2b_character_profiles: characterProfiles.profiles,
              agent2c_location_profiles: locationProfiles,
            },
            cml,
            threshold_config: { mode: "standard" },
            targetLength: inputs.targetLength ?? "medium",
            partialGeneration: true,
          });

          const adaptedAll = adaptProseForScoring(accumulatedChapters, (cml as any).CASE, clues);
          const partialScore = await scorer.score({}, adaptedAll, {
            previous_phases: {
              agent2_cast: cast.cast,
              agent2b_character_profiles: characterProfiles.profiles,
              agent2c_location_profiles: locationProfiles,
            },
            cml,
            threshold_config: { mode: "standard" },
            targetLength: inputs.targetLength ?? "medium",
            partialGeneration: true,
          });

          const individualPct = Math.round(batchScore.total ?? 0);
          const pct = Math.round(partialScore.total ?? 0);
          const elapsedMs = Date.now() - prosePhaseStartTime;

          ctx.proseChapterScores.push({
            chapter: batchEnd,
            total_chapters: totalSceneCount,
            individual_score: individualPct,
            cumulative_score: pct,
            individual_validation_score: Math.round(batchScore.validation_score ?? 0),
            individual_quality_score: Math.round(batchScore.quality_score ?? 0),
            individual_completeness_score: Math.round(batchScore.completeness_score ?? 0),
            individual_consistency_score: Math.round(batchScore.consistency_score ?? 0),
            cumulative_validation_score: Math.round(partialScore.validation_score ?? 0),
            cumulative_quality_score: Math.round(partialScore.quality_score ?? 0),
            cumulative_completeness_score: Math.round(partialScore.completeness_score ?? 0),
            cumulative_consistency_score: Math.round(partialScore.consistency_score ?? 0),
          });
          ctx.proseScoringSnapshot.chaptersGenerated = batchEnd;
          ctx.proseScoringSnapshot.latestChapterScore = individualPct;
          ctx.proseScoringSnapshot.latestCumulativeScore = pct;

          const scoreWithBreakdown: PhaseScore = {
            ...partialScore,
            breakdown: { chapter_scores: [...ctx.proseChapterScores] },
          };
          scoreAggregator.upsertPhaseScore(
            "agent9_prose",
            "Prose Generation",
            scoreWithBreakdown,
            elapsedMs,
            0,
          );
          await savePartialReport();

          reportProgress(
            "prose",
            `Chapter ${chapterLabel} complete \u00b7 chapter: ${individualPct}/100 \u00b7 cumulative: ${pct}/100`,
            91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3),
          );
        } catch {
          reportProgress(
            "prose",
            `Chapter ${chapterLabel} complete`,
            91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3),
          );
        }
      } else {
        reportProgress(
          "prose",
          `Chapter ${chapterLabel} complete`,
          91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3),
        );
      }

      if (validationIssues && validationIssues.length > 0) {
        const issueRange =
          batchEnd > batchStart ? `${batchStart}-${batchEnd}` : `${batchEnd}`;
        reportProgress(
          "prose",
          `\u26a0 Chapter${batchEnd > batchStart ? "s" : ""} ${issueRange} required retry \u2014 ${validationIssues.length} issue${validationIssues.length !== 1 ? "s" : ""}: ${validationIssues.slice(0, 2).join("; ")}${validationIssues.length > 2 ? ` (+${validationIssues.length - 2} more)` : ""}`,
          91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3),
        );
      }
    },
  });

  prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles, cast.cast.characters);
  // 1c: Repair digit-form conversions of word-phrased locked facts (e.g. "11:10 PM" → "ten minutes past eleven").
  // Must run before StoryValidationPipeline so ProseConsistencyValidator sees the canonical form.
  prose = repairWordFormLockedFacts(prose, annotatedLockedFacts);
  const proseFirstPassDurationMs = Date.now() - proseStart;
  const proseFirstPassCost = prose.cost;
  ctx.agentCosts["agent9_prose"] = proseFirstPassCost;
  ctx.agentDurations["agent9_prose"] = proseFirstPassDurationMs;
  pushProsePassAccounting(
    "first_pass",
    proseFirstPassDurationMs,
    proseFirstPassCost,
    prose.chapters.length,
  );

  // Closure — captures prose, ctx, and first-pass timing locals
  const buildPostGenerationSummaryDetails = (score: PhaseScore | null, finalized: boolean) => ({
    ...((): Record<string, unknown> => {
      const fairPlay = adaptProseForScoring(prose.chapters, (cml as any).CASE, clues)
        .fair_play_validation;
      const clueEvidence = collectClueEvidenceFromProse(prose.chapters, (cml as any).CASE, clues);
      const expectedClueIds = getExpectedClueIdsForVisibility((cml as any).CASE, clues);
      const extractedClueIds = clueEvidence.visibleClueIds;
      const missingExpectedClueIds = expectedClueIds.filter(
        (id) => !extractedClueIds.includes(id),
      );
      const unexpectedExtractedClueIds = extractedClueIds.filter(
        (id) => !expectedClueIds.includes(id),
      );
      const fairPlayComponentScore =
        (fairPlay?.all_clues_visible ? 40 : 0) +
        (fairPlay?.discriminating_test_complete ? 40 : 0) +
        (fairPlay?.no_solution_spoilers ? 20 : 0);
      return {
        fair_play_all_clues_visible: fairPlay?.all_clues_visible ?? null,
        fair_play_discriminating_test_complete:
          fairPlay?.discriminating_test_complete ?? null,
        fair_play_no_solution_spoilers: fairPlay?.no_solution_spoilers ?? null,
        fair_play_component_score: fairPlay ? fairPlayComponentScore : null,
        clue_visibility_expected_ids: expectedClueIds,
        clue_visibility_extracted_ids: extractedClueIds,
        clue_visibility_missing_expected_ids: missingExpectedClueIds,
        clue_visibility_unexpected_extracted_ids: unexpectedExtractedClueIds,
        clue_visibility_expected_count: expectedClueIds.length,
        clue_visibility_extracted_count: extractedClueIds.length,
      };
    })(),
    ...((): Record<string, unknown> => {
      const linter = (prose.validationDetails as any)?.linter;
      return {
        template_linter_checks_run: linter?.checksRun ?? 0,
        template_linter_failed_checks: linter?.failedChecks ?? 0,
        template_linter_opening_style_entropy_failures:
          linter?.openingStyleEntropyFailures ?? 0,
        template_linter_opening_style_entropy_bypasses:
          linter?.openingStyleEntropyBypasses ?? 0,
        template_linter_paragraph_fingerprint_failures:
          linter?.paragraphFingerprintFailures ?? 0,
        template_linter_ngram_overlap_failures: linter?.ngramOverlapFailures ?? 0,
      };
    })(),
    score_total: score?.total ?? null,
    score_grade: score?.grade ?? null,
    score_passed_threshold: score
      ? scoreAggregator?.passesThreshold(score) ?? false
      : null,
    component_failures: score?.component_failures ?? [],
    failure_reason: score?.failure_reason ?? null,
    chapters_generated: prose.chapters.length,
    prose_duration_ms_first_pass: proseFirstPassDurationMs,
    prose_duration_ms_total: ctx.agentDurations["agent9_prose"] ?? 0,
    prose_cost_first_pass: proseFirstPassCost,
    prose_cost_total: ctx.agentCosts["agent9_prose"] ?? 0,
    rewrite_pass_count: ctx.proseRewritePassCount,
    repair_pass_count: ctx.proseRepairPassCount,
    per_pass_accounting: ctx.prosePassAccounting,
    metrics_snapshot: finalized ? "final" : "initial",
    batch_size: inputs.proseBatchSize ?? 1,
    batches_with_retries: prose.validationDetails?.batchesWithRetries ?? 0,
    total_batches: prose.validationDetails?.totalBatches ?? 0,
    batch_failure_events: prose.validationDetails?.failureHistory?.length ?? 0,
    batch_failure_history: (prose.validationDetails?.failureHistory ?? []).map(
      (failure: any) => ({
        chapter_range: failure.chapterRange,
        attempt: failure.attempt,
        errors: failure.errors,
      }),
    ),
    batch_failure_samples: (prose.validationDetails?.failureHistory ?? [])
      .slice(0, 3)
      .map((failure: any) => ({
        chapter_range: failure.chapterRange,
        attempt: failure.attempt,
        errors: failure.errors,
      })),
    outline_coverage_issue_count: outlineCoverageIssues.length,
    critical_clue_coverage_gap: coverageResult.hasCriticalGaps,
    nsd_transfer_steps: ctx.nsdTransferTrace.length,
    nsd_transfer_trace: ctx.nsdTransferTrace,
  });

  // First-pass scoring
  if (enableScoring && scoreAggregator && scoringLogger) {
    const scorer = new ProseScorer();
    const adapted = adaptProseForScoring(prose.chapters, (cml as any).CASE, clues);
    const score = await scorer.score({}, adapted, {
      previous_phases: {
        agent2_cast: cast.cast,
        agent2b_character_profiles: characterProfiles.profiles,
        agent2c_location_profiles: locationProfiles,
      },
      cml,
      threshold_config: { mode: "standard" },
      targetLength: inputs.targetLength ?? "medium",
      narrativeSceneCount: totalSceneCount || undefined,
    });
    ctx.latestProseScore = score;

    if (ctx.proseChapterScores.length > 0 && !score.breakdown) {
      (score as PhaseScore).breakdown = { chapter_scores: [...ctx.proseChapterScores] };
    }

    scoreAggregator.upsertPhaseScore(
      "agent9_prose",
      "Prose Generation",
      score,
      ctx.agentDurations["agent9_prose"] ?? 0,
      ctx.agentCosts["agent9_prose"] ?? 0,
    );
    scoringLogger.logPhaseScore(
      "agent9_prose",
      "Prose Generation",
      score,
      ctx.agentDurations["agent9_prose"] ?? 0,
      ctx.agentCosts["agent9_prose"] ?? 0,
      runId,
      projectId || "",
    );
    await savePartialReport();

    if (!scoreAggregator.passesThreshold(score)) {
      ctx.warnings.push(
        `Prose Generation: scored ${score.total}/100 (${score.grade}) below threshold; skipping full-phase retry and continuing with targeted validation/repair guardrails`,
      );
    }

    const postGenerationSummaryDetails = buildPostGenerationSummaryDetails(score, false);
    scoringLogger.logPhaseDiagnostic(
      "agent9_prose",
      "Prose Generation",
      "post_generation_summary",
      postGenerationSummaryDetails,
      runId,
      projectId || "",
    );
    scoreAggregator.upsertDiagnostic(
      "agent9_prose_post_generation_summary",
      "agent9_prose",
      "Prose Generation",
      "post_generation_summary",
      postGenerationSummaryDetails,
    );
    ctx.proseScoringSnapshot.postGenerationSummaryLogged = true;

    // E5: Emit prompt fingerprints for per-chapter prompt traceability
    if (Array.isArray(prose.prompt_fingerprints) && prose.prompt_fingerprints.length > 0) {
      scoreAggregator.upsertDiagnostic(
        "agent9_prose_prompt_fingerprints",
        "agent9_prose",
        "Prose Generation",
        "prompt_fingerprints",
        {
          chapter_count: prose.prompt_fingerprints.length,
          fingerprints: prose.prompt_fingerprints,
        },
      );
    }
  }

  // ============================================================================
  // Surface chapter validation issues
  // ============================================================================
  if (prose.validationDetails && prose.validationDetails.batchesWithRetries > 0) {
    const batchRetryMsg = `Prose generation: ${prose.validationDetails.batchesWithRetries}/${prose.validationDetails.totalBatches} batch(es) required retry due to validation issues`;
    ctx.warnings.push(batchRetryMsg);
    await client.getLogger()?.logError({
      runId,
      projectId,
      agent: "Agent9-ProseGenerator",
      operation: "batch_validation",
      errorMessage: batchRetryMsg,
      metadata: {
        batchesWithRetries: prose.validationDetails.batchesWithRetries,
        totalBatches: prose.validationDetails.totalBatches,
      },
    });
    prose.validationDetails.failureHistory.forEach((failure: any) => {
      const failureMsg = `  - Chapters ${failure.chapterRange} (attempt ${failure.attempt}): ${failure.errors.join("; ")}`;
      ctx.warnings.push(failureMsg);
      client.getLogger()?.logError({
        runId,
        projectId,
        agent: "Agent9-ProseGenerator",
        operation: "chapter_validation_failure",
        errorMessage: `Chapters ${failure.chapterRange} failed validation`,
        metadata: {
          chapterRange: failure.chapterRange,
          attempt: failure.attempt,
          errors: failure.errors,
        },
      });
    });
    if (outlineCoverageIssues.length > 0) {
      const contextMsg = `  Context: Outline had ${outlineCoverageIssues.length} coverage issue(s) which may have affected prose quality`;
      ctx.warnings.push(contextMsg);
      client.getLogger()?.logError({
        runId,
        projectId,
        agent: "Agent9-ProseGenerator",
        operation: "context_issue",
        errorMessage: contextMsg,
        metadata: { outlineCoverageIssues },
      });
    }
    if (coverageResult.hasCriticalGaps) {
      const contextMsg = `  Context: CML had critical clue coverage gaps which may have affected prose scene content`;
      ctx.warnings.push(contextMsg);
      client.getLogger()?.logError({
        runId,
        projectId,
        agent: "Agent9-ProseGenerator",
        operation: "context_issue",
        errorMessage: contextMsg,
        metadata: { clueCoverageGaps: coverageResult },
      });
    }
  }

  // ============================================================================
  // Prose schema validation
  // ============================================================================
  let proseSchemaValidation = validateArtifact("prose", prose);
  if (!proseSchemaValidation.valid) {
    ctx.warnings.push(
      "Prose artifact failed schema validation on first attempt; retrying prose generation with schema repair guardrails",
    );
    const schemaRepairGuardrails = [
      "Return a valid prose artifact that strictly matches required schema fields and types.",
      ...proseSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
    ];
    const proseSchemaRetryStart = Date.now();
    const retriedProse = await generateProse(client, {
      caseData: cml,
      outline: narrative,
      cast: cast.cast,
      ...proseModelOverride,
      detectiveType: inputs.detectiveType,
      worldDocument: ctx.worldDocument,
      characterProfiles: characterProfiles,
      locationProfiles: locationProfiles,
      temporalContext: temporalContext,
      moralAmbiguityNote,
      lockedFacts: annotatedLockedFacts,
      clueDistribution: clues,
      narrativeState,
      targetLength: inputs.targetLength,
      narrativeStyle: inputs.narrativeStyle,
      qualityGuardrails: [...baselineProseGuardrails, ...schemaRepairGuardrails],
      writingGuides: loadWritingGuides(workspaceRoot),
      runId,
      projectId: projectId || "",
      onProgress: (phase: string, message: string, percentage: number) =>
        reportProgress(phase as any, message, percentage),
      batchSize: inputs.proseBatchSize,
      onBatchComplete: (_batchChapters: any, _batchStart: number, batchEnd: number) => {
        const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;
        reportProgress(
          "prose",
          `[Schema-repair] Chapter ${chapterLabel} complete`,
          92 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 2),
        );
      },
    });
    ctx.agentCosts["agent9_prose"] =
      (ctx.agentCosts["agent9_prose"] || 0) + retriedProse.cost;
    ctx.agentDurations["agent9_prose"] =
      (ctx.agentDurations["agent9_prose"] || 0) + (Date.now() - proseSchemaRetryStart);
    ctx.proseRepairPassCount += 1;
    pushProsePassAccounting(
      "schema_repair",
      Date.now() - proseSchemaRetryStart,
      retriedProse.cost,
      retriedProse.chapters.length,
    );
    const retryValidation = validateArtifact("prose", retriedProse);
    if (!retryValidation.valid) {
      retryValidation.errors.forEach((error) =>
        ctx.errors.push(`Prose schema failure: ${error}`),
      );
      throw new Error("Prose artifact failed schema validation");
    }
    prose = applyDeterministicProsePostProcessing(
      sanitizeProseResult(retriedProse),
      locationProfiles,
      cast.cast.characters,
    );
    prose = repairWordFormLockedFacts(prose, annotatedLockedFacts);
    proseSchemaValidation = retryValidation;
    ctx.warnings.push("Prose schema-repair retry succeeded");
    await rescoreAgent9ProsePhase();
  }
  proseSchemaValidation.warnings.forEach((warning) =>
    ctx.warnings.push(`Prose schema warning: ${warning}`),
  );

  reportProgress("prose", `Prose generated (${prose.chapters.length} chapters)`, 94);

  // ============================================================================
  // Story Validation
  // ============================================================================
  reportProgress("validation", "Starting full-story validation gate...", 96);

  const validationStart = Date.now();
  const validationPipeline = new StoryValidationPipeline(client, { runId, projectId: projectId || runId, agent: 'Agent9-Validation' });

  prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles);
  prose = repairWordFormLockedFacts(prose, annotatedLockedFacts);

  const storyForValidation = {
    id: runId,
    projectId: projectId || runId,
    scenes: prose.chapters.map((ch: any, idx: number) => ({
      number: idx + 1,
      title: ch.title,
      text: ch.paragraphs.join("\n\n"),
    })),
  };

  let validationReport: any = await validationPipeline.validate(storyForValidation, {
    ...cml,
    lockedFacts: annotatedLockedFacts,
    locationProfiles: locationProfiles ?? undefined,
  } as any);
  const preRepairValidationSummary = { ...validationReport.summary };
  let postRepairValidationSummary = { ...validationReport.summary };
  ctx.agentDurations["validation"] = Date.now() - validationStart;

  if (validationReport.status === "passed") {
    reportProgress("validation", "Full-story validation passed.", 98);
  } else if (validationReport.status === "needs_review") {
    ctx.warnings.push(
      `Story validation: ${validationReport.status} - ${validationReport.summary.major} major issues`,
    );
    reportProgress(
      "validation",
      `Full-story validation needs review (${validationReport.summary.major} major issues)`,
      98,
    );
  } else {
    const validationFailureMsg =
      "Story validation: " +
      validationReport.status +
      " - " +
      validationReport.summary.critical +
      " critical, " +
      validationReport.summary.major +
      " major issues";
    ctx.warnings.push(validationFailureMsg);
    await client.getLogger()?.logError({
      runId,
      projectId,
      agent: "ValidationPipeline",
      operation: "final_validation",
      errorMessage: validationFailureMsg,
      metadata: { status: validationReport.status, summary: validationReport.summary },
    });

    // Persist the full error list (all errors, not just the first 10) to scoring.jsonl
    // and to the exported report JSON via the diagnostics upsert.
    if (ctx.scoringLogger) {
      ctx.scoringLogger.logValidationFailure(
        validationReport.status,
        validationReport.summary,
        validationReport.errors.map((e: any) => ({
          type: e.type,
          severity: e.severity,
          message: e.message,
          sceneNumber: e.sceneNumber,
          suggestion: e.suggestion,
          cmlReference: e.cmlReference,
        })),
        runId,
        projectId || "",
      );
    }
    if (ctx.scoreAggregator) {
      ctx.scoreAggregator.upsertDiagnostic(
        "story_validation_failure",
        "ValidationPipeline",
        "Story Validation",
        "validation_failure",
        {
          status: validationReport.status,
          summary: validationReport.summary,
          errors: validationReport.errors.map((e: any) => ({
            type: e.type,
            severity: e.severity,
            message: e.message,
            sceneNumber: e.sceneNumber,
            suggestion: e.suggestion,
            cmlReference: e.cmlReference,
          })),
        },
      );
    }

    ctx.warnings.push("═══ PROSE VALIDATION FAILURE DETAILS ═══");
    validationReport.errors.slice(0, 10).forEach((err: any) => {
      const errMsg = `  [${err.severity}] ${err.type}: ${err.message}`;
      ctx.warnings.push(errMsg);
    });
    if (validationReport.errors.length > 10) {
      const remainingMsg = `  ... and ${validationReport.errors.length - 10} more validation errors (all logged to scoring.jsonl)`;
      ctx.warnings.push(remainingMsg);
    }

    ctx.warnings.push("═══ CONTRIBUTING FACTORS ═══");
    if (prose.validationDetails && prose.validationDetails.batchesWithRetries > 0) {
      ctx.warnings.push(
        `  \u2022 Chapter generation: ${prose.validationDetails.batchesWithRetries} batches had validation issues during generation`,
      );
    }
    if (coverageResult.hasCriticalGaps) {
      const gapTypes = [];
      if (coverageResult.issues.some((i: any) => i.message.includes("inference step")))
        gapTypes.push("inference path coverage");
      if (coverageResult.issues.some((i: any) => i.message.includes("discriminating test")))
        gapTypes.push("discriminating test evidence");
      if (coverageResult.issues.some((i: any) => i.message.includes("suspect")))
        gapTypes.push("suspect elimination");
      ctx.warnings.push(
        `  \u2022 CML clue coverage: Critical gaps in ${gapTypes.join(", ")}`,
      );
    }
    if (outlineCoverageIssues.length > 0) {
      ctx.warnings.push(
        `  \u2022 Outline: ${outlineCoverageIssues.length} coverage issues`,
      );
    }
    if (fairPlayAudit && fairPlayAudit.overallStatus !== "pass") {
      ctx.warnings.push(
        `  \u2022 Fair play audit: ${fairPlayAudit.overallStatus} - may indicate structural CML issues`,
      );
    }
    ctx.warnings.push("═══════════════════════════════════════");

    throw new Error(
      `Story validation failed: ${validationReport.summary.critical} critical, ${validationReport.summary.major} major issues`,
    );
  }

  // ============================================================================
  // Auto-fix encoding issues
  // ============================================================================
  const fixedStory = validationPipeline.autoFix(storyForValidation);
  let encodingFixesApplied = false;

  for (let i = 0; i < fixedStory.scenes.length; i++) {
    if (fixedStory.scenes[i].text !== storyForValidation.scenes[i].text) {
      encodingFixesApplied = true;
      const fixedParagraphs = fixedStory.scenes[i].text.split("\n\n");
      prose.chapters[i] = {
        ...prose.chapters[i],
        paragraphs: fixedParagraphs,
      };
    }
  }

  if (encodingFixesApplied) {
    reportProgress("validation", "Applied auto-fixes for encoding issues", 99);
  }

  prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles, cast.cast.characters);
  prose = repairWordFormLockedFacts(prose, annotatedLockedFacts);

  if (enableScoring && scoreAggregator && scoringLogger) {
    const finalizedPostGenerationDetails = buildPostGenerationSummaryDetails(
      ctx.latestProseScore,
      true,
    );
    scoringLogger.logPhaseDiagnostic(
      "agent9_prose",
      "Prose Generation",
      "post_generation_summary",
      finalizedPostGenerationDetails,
      runId,
      projectId || "",
    );
    scoreAggregator.upsertDiagnostic(
      "agent9_prose_post_generation_summary",
      "agent9_prose",
      "Prose Generation",
      "post_generation_summary",
      finalizedPostGenerationDetails,
    );
    ctx.proseScoringSnapshot.postGenerationSummaryLogged = true;
  }

  // ============================================================================
  // Release Gate
  // ============================================================================
  // Two levels of release-gate failure:
  //   releaseGateReasons — warnings logged to ctx; generation continues; output still saved.
  //   hardStopReasons    — thrown as an error; orchestrator catch block saves a partial
  //                         report with a zeroed prose score.
  // A condition can appear in both arrays (warning AND hard stop) to capture context in
  // the release gate diagnostic before throwing.
  const releaseGateReasons: string[] = [];
  const hardStopReasons: string[] = [];
  const validationErrorTypes = new Set(
    validationReport.errors.map((error: any) => error.type),
  );
  const hasSuspectEliminationCoverageFailure = validationReport.errors.some(
    (error: any) => isSuspectEliminationCoverageError(error),
  );
  const readabilitySummary = evaluateProseReadability(prose);
  const sceneGrounding = evaluateSceneGroundingCoverage(prose, locationProfiles);
  const placeholderLeakage = evaluatePlaceholderLeakage(prose);
  const chapterHeadingArtifacts = evaluateChapterHeadingArtifacts(prose);
  const clueEvidence = collectClueEvidenceFromProse(
    prose.chapters,
    (cml as any).CASE,
    clues,
  );
  const expectedClueIds = getExpectedClueIdsForVisibility((cml as any).CASE, clues);
  const extractedClueIds = clueEvidence.visibleClueIds;
  const missingExpectedClueIds = expectedClueIds.filter(
    (id) => !extractedClueIds.includes(id),
  );
  const unexpectedExtractedClueIds = extractedClueIds.filter(
    (id) => !expectedClueIds.includes(id),
  );
  const nsdRevealedClues = new Set(
    ctx.nsdTransferTrace.flatMap((step: any) => step.newly_revealed_clue_ids),
  );
  const evidenceVisibleClues = new Set(clueEvidence.visibleClueIds);
  const revealedWithoutEvidence = Array.from(nsdRevealedClues).filter(
    (id) => !evidenceVisibleClues.has(id),
  );
  const evidenceWithoutReveal = Array.from(evidenceVisibleClues).filter(
    (id) => !nsdRevealedClues.has(id),
  );
  const nsdVisibilityDivergence = {
    diverged: revealedWithoutEvidence.length > 0 || evidenceWithoutReveal.length > 0,
    revealed_count: nsdRevealedClues.size,
    evidence_visible_count: evidenceVisibleClues.size,
    clue_state_by_id: clueEvidence.clueStateById,
    revealed_without_evidence: revealedWithoutEvidence,
    evidence_without_reveal: evidenceWithoutReveal,
    sample_evidence_anchors: Object.values(clueEvidence.evidenceByClue).flat().slice(0, 8),
  };
  const proseContainsIllegalControlChars = prose.chapters.some((chapter: any) =>
    chapter.paragraphs.some((paragraph: string) =>
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(paragraph),
    ),
  );
  const proseContainsMojibake = prose.chapters.some((chapter: any) =>
    chapter.paragraphs.some((paragraph: string) =>
      persistentMojibakePattern.test(paragraph),
    ),
  );

  if (fairPlayAudit) {
    const fpValidation =
      fairPlayAudit.overallStatus === "pass"
        ? 100
        : fairPlayAudit.overallStatus === "needs-revision"
          ? 70
          : 45;
    const hasZeroScoreViolation =
      fairPlayAudit.checks?.some((check: any) => check.status === "fail") ?? false;

    if (fpValidation < 60 || hasZeroScoreViolation) {
      const violationSummary = fairPlayAudit.violations
        .map((v: any) => `${v.rule} (${v.severity})`)
        .join(", ");
      releaseGateReasons.push(
        `fair play audit score below threshold (${fpValidation}/100)${hasZeroScoreViolation ? " with 0-score violations" : ""}: ${violationSummary}`,
      );
      hardStopReasons.push(
        `fair play audit failed (${fpValidation}/100): mystery violates fundamental fair play principles`,
      );
    } else if (fairPlayAudit.overallStatus === "needs-revision") {
      releaseGateReasons.push(
        `fair play audit needs revision (score: ${fpValidation}/100)`,
      );
    }
  }

  if (
    validationErrorTypes.has("identity_role_alias_break") ||
    validationErrorTypes.has("missing_case_transition_bridge") ||
    validationErrorTypes.has("case_transition_missing")
  ) {
    releaseGateReasons.push("critical continuity issue detected");
  }
  if (validationErrorTypes.has("temporal_contradiction")) {
    releaseGateReasons.push("temporal continuity contradiction detected");
    hardStopReasons.push("temporal continuity contradiction detected");
  }
  if (validationErrorTypes.has("investigator_role_drift")) {
    releaseGateReasons.push("investigator role continuity drift detected");
  }
  if (proseContainsMojibake) {
    releaseGateReasons.push("mojibake/encoding artifact remains");
    hardStopReasons.push("mojibake/encoding artifact remains");
  }
  if (proseContainsIllegalControlChars || validationErrorTypes.has("illegal_character")) {
    releaseGateReasons.push("illegal character/encoding corruption detected");
    hardStopReasons.push("illegal character/encoding corruption detected");
  }
  if (
    validationErrorTypes.has("missing_discriminating_test") ||
    validationErrorTypes.has("cml_test_not_realized")
  ) {
    releaseGateReasons.push("no valid discriminating test scene");
  }
  if (hasSuspectEliminationCoverageFailure) {
    releaseGateReasons.push("suspect elimination coverage incomplete");
    hardStopReasons.push("suspect elimination coverage incomplete");
  }
  if (placeholderLeakage.hasLeakage) {
    const leakageMsg = `placeholder token leakage detected (role+surname: ${placeholderLeakage.roleSurnameCount}, named standalone placeholders: ${placeholderLeakage.standaloneCount}, generic role phrases: ${placeholderLeakage.genericRoleCount}${placeholderLeakage.examples.length > 0 ? `, examples: ${placeholderLeakage.examples.join(", ")}` : ""})`;
    releaseGateReasons.push(leakageMsg);
    hardStopReasons.push(leakageMsg);
  }
  if (chapterHeadingArtifacts.hasArtifacts) {
    releaseGateReasons.push(
      `duplicate chapter heading artifacts detected (${chapterHeadingArtifacts.duplicatedHeadingCount})`,
    );
    hardStopReasons.push("duplicate chapter heading artifacts detected");
  }
  if (readabilitySummary.denseChapterCount > 0) {
    releaseGateReasons.push(
      `readability density threshold exceeded (dense chapters: ${readabilitySummary.denseChapterCount}, low-paragraph chapters: ${readabilitySummary.underParagraphCount}, overlong blocks: ${readabilitySummary.severeParagraphBlocks})`,
    );
  }
  if (sceneGrounding.coverage < 0.9) {
    releaseGateReasons.push(
      `scene-grounding coverage below target (${sceneGrounding.grounded}/${sceneGrounding.total} chapters grounded)`,
    );
  }
  if (nsdVisibilityDivergence.diverged) {
    releaseGateReasons.push(
      `nsd/clue-visibility divergence (${revealedWithoutEvidence.length} NSD reveals lack prose evidence; ${evidenceWithoutReveal.length} evidence-visible clues absent from NSD reveal list)`,
    );
    if (revealedWithoutEvidence.length > 0) {
      hardStopReasons.push(
        `clue visibility incomplete (${revealedWithoutEvidence.length} NSD-revealed clue(s) have no prose evidence anchors)`,
      );
    }
  }

  ctx.warnings.push(
    `UTF-8/multibyte check: ${proseContainsIllegalControlChars ? "FAILED (illegal control characters found)" : "PASSED (valid Unicode preserved)"}`,
  );

  if (enableScoring && scoringLogger) {
    const releaseDiagnostic = {
      validation_status: validationReport.status,
      validation_summary: validationReport.summary,
      validation_snapshots: {
        pre_repair: preRepairValidationSummary,
        post_repair: postRepairValidationSummary,
        release_gate: validationReport.summary,
      },
      release_gate_warning_count: releaseGateReasons.length,
      release_gate_hard_stop_count: hardStopReasons.length,
      release_gate_warnings: releaseGateReasons,
      release_gate_hard_stops: Array.from(new Set(hardStopReasons)),
      readability: readabilitySummary,
      scene_grounding: sceneGrounding,
      placeholder_leakage: placeholderLeakage,
      chapter_heading_artifacts: chapterHeadingArtifacts,
      clue_visibility_expected_ids: expectedClueIds,
      clue_visibility_extracted_ids: extractedClueIds,
      clue_visibility_missing_expected_ids: missingExpectedClueIds,
      clue_visibility_unexpected_extracted_ids: unexpectedExtractedClueIds,
      clue_visibility_expected_count: expectedClueIds.length,
      clue_visibility_extracted_count: extractedClueIds.length,
      nsd_visibility_divergence: nsdVisibilityDivergence,
      has_illegal_control_chars: proseContainsIllegalControlChars,
      has_mojibake: proseContainsMojibake,
      fair_play_status: fairPlayAudit?.overallStatus ?? null,
    };

    scoringLogger.logPhaseDiagnostic(
      "agent9_prose",
      "Release Gate",
      "release_gate_summary",
      releaseDiagnostic,
      runId,
      projectId || "",
    );
    scoreAggregator?.upsertDiagnostic(
      "agent9_prose_release_gate_summary",
      "agent9_prose",
      "Release Gate",
      "release_gate_summary",
      releaseDiagnostic,
    );
  }

  if (releaseGateReasons.length > 0) {
    releaseGateReasons.forEach((reason) =>
      ctx.warnings.push(`Release gate warning: ${reason}`),
    );
    reportProgress(
      "validation",
      `Release gate warnings: ${releaseGateReasons.join("; ")}`,
      99,
    );
  }

  // E4: Failure lineage bundle — compact per-run failure audit trail
  if (enableScoring && scoreAggregator && scoringLogger) {
    const failureHistory = prose.validationDetails?.failureHistory ?? [];
    const firstFailChapter =
      failureHistory.length > 0
        ? Math.min(...failureHistory.map((e: any) => (e.batchIndex ?? 0) + 1))
        : null;
    const errorClasses = Array.from(
      new Set(
        failureHistory.flatMap((entry: any) =>
          ((entry.errors ?? []) as string[]).map((error) => {
            if (/clue|evidence/i.test(error)) return 'clue_visibility';
            if (/word.*count|minimum.*words|chapter.*length/i.test(error)) return 'word_count';
            if (/temporal|season|month/i.test(error)) return 'temporal';
            if (/scene.*ground|location/i.test(error)) return 'scene_grounding';
            if (/identity|character|phantom/i.test(error)) return 'identity_continuity';
            if (/template|fingerprint|ngram/i.test(error)) return 'template_leakage';
            return 'validation_error';
          }),
        ),
      ),
    );
    const correctiveAttempts =
      (ctx.proseRepairPassCount ?? 0) + (ctx.proseRewritePassCount ?? 0);
    const finalBlockingReason =
      hardStopReasons.length > 0
        ? Array.from(new Set(hardStopReasons)).join('; ')
        : releaseGateReasons.length > 0
          ? releaseGateReasons.slice(0, 3).join('; ')
          : null;
    const failureLineage = {
      first_failing_chapter: firstFailChapter,
      error_classes: errorClasses,
      corrective_attempts: correctiveAttempts,
      final_blocking_reason: finalBlockingReason,
    };
    scoringLogger.logPhaseDiagnostic(
      "agent9_prose",
      "Prose Generation",
      "failure_lineage",
      failureLineage,
      runId,
      projectId || "",
    );
    scoreAggregator.upsertDiagnostic(
      "agent9_prose_failure_lineage",
      "agent9_prose",
      "Prose Generation",
      "failure_lineage",
      failureLineage,
    );
  }

  if (hardStopReasons.length > 0) {
    const hardStopMessage = `Release gate hard-stop: ${Array.from(new Set(hardStopReasons)).join("; ")}`;
    ctx.errors.push(hardStopMessage);
    reportProgress("validation", hardStopMessage, 99);
    throw new Error(hardStopMessage);
  }

  // ============================================================================
  // Commit results to context
  // ============================================================================
  ctx.prose = prose;
  ctx.validationReport = validationReport;
}
