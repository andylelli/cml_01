/**
 * agent9-prose/phrase-analysis.ts
 * Beat fingerprinting, recurring-phrase detection, sensory atom selection,
 * identity-map helpers, and scoring-feedback formatting.
 */
import { selectChapterAtoms } from "../asset-library.js";
import type { AssetLibrary } from "../types/asset-library.js";
import type { ClueDistributionResult } from "../agent5-clues.js";
import { CLUE_TOKEN_STOPWORDS, tokenizeForClueObligation } from "./clue-validation.js";
import { tokenizeWords, toNgrams, jaccardSimilarity } from "./lint.js";
import type { ProseChapter } from "./types.js";
// ─────────────────────────────────────────────────────────────────────────────
export interface BeatFingerprint {
  chapterNumber: number;
  beats: string[]; // 3-6 key sentences from the chapter
}

// Module-level constant — avoids re-creating the Set on every sentence scored
// inside extractBeatFingerprints.
export const FUNCTION_WORD_EXCLUSIONS = new Set([
  'which', 'where', 'when', 'that', 'this', 'with', 'from', 'have', 'been', 'will',
  'would', 'could', 'should', 'while', 'their', 'there', 'these', 'those', 'about',
  'other', 'after', 'before', 'above', 'below', 'between', 'through', 'across',
  'against', 'around', 'during', 'under', 'since', 'until', 'still', 'again',
]);

/**
 * Extract beat fingerprints from a committed chapter.
 * Primary: noun-dense, pronoun-light sentence from each 200-word block.
 * Secondary: dialogue attribution lines that mention a cast member.
 */
export function extractBeatFingerprints(
  chapter: ProseChapter,
  chapterNumber: number,
  castNames: string[],
): BeatFingerprint {
  const paragraphs = chapter.paragraphs ?? [];
  const BLOCK_SIZE = 200;
  const beats: string[] = [];
  let wordBuffer = 0;
  let blockSentences: string[] = [];

  const scoreSentence = (s: string): number => {
    const words = s.split(/\s+/);
    const pronouns = words.filter(w => /^(he|she|they|it|him|her|his|their|its)$/i.test(w)).length;
    // P2-20: Exclude common function words (5+ chars) that are not nouns — previous filter
    // only excluded a handful of conjunctions and auxiliaries, causing false positives.
    const nouns = words.filter(w => w.length >= 5 && !FUNCTION_WORD_EXCLUSIONS.has(w.toLowerCase())).length;
    // Bonus for sentences containing a cast name — strong signal of an anchor beat.
    const castBonus = castNames.filter(n => s.includes(n)).length * 3;
    return nouns - pronouns + castBonus;
  };

  for (const para of paragraphs) {
    const sentences = para.split(/(?<=[.!?])\s+/);
    for (const sentence of sentences) {
      blockSentences.push(sentence);
      wordBuffer += sentence.split(/\s+/).length;
      if (wordBuffer >= BLOCK_SIZE) {
        const best = blockSentences.reduce((a, b) => scoreSentence(a) >= scoreSentence(b) ? a : b);
        if (best.length >= 40) beats.push(best.trim());
        wordBuffer = 0;
        blockSentences = [];
      }
    }
  }
  // BUG-6 FIX: flush remaining partial block so tail sentences aren't silently discarded
  if (blockSentences.length > 0) {
    const best = blockSentences.reduce((a, b) => scoreSentence(a) >= scoreSentence(b) ? a : b);
    if (best.length >= 40) beats.push(best.trim());
  }

  // Secondary: dialogue attribution lines mentioning a cast member
  for (const para of paragraphs) {
    const sentences = para.split(/(?<=[.!?])\s+/);
    for (const s of sentences) {
      const nameCount = castNames.filter(n => s.includes(n)).length;
      const hasDialogue = /\bsaid\b|\breplied\b|\basked\b|\banswered\b|\bwhispered\b/.test(s);
      if (nameCount >= 1 && hasDialogue && s.length >= 40 && beats.length < 6) {
        const sNgrams = toNgrams(tokenizeWords(s), 4);
        if (!beats.some(b => jaccardSimilarity(toNgrams(tokenizeWords(b), 4), sNgrams) > 0.4)) {
          beats.push(s.trim());
        }
      }
    }
  }

  return { chapterNumber, beats: beats.slice(0, 6) };
}

// ─── PHASE 3 (BLUE-D) ────────────────────────────────────────────────────────
// Inline identity tags: co-locate compact pronoun anchors with every character
// name in instruction blocks (NOT in prose) so the LLM never disambiguates by
// recency alone. Format: "Name[SHE]" / "Name[HE]" / "Name[THEY]".
// ─────────────────────────────────────────────────────────────────────────────
/** Returns "Name[SHE]" / "Name[HE]" / "Name[THEY]" from the identityMap, or the plain name if not found. */
export function tagCharacter(name: string, identityMap: Map<string, string>): string {
  const tag = identityMap.get(name);
  return tag ? `${name}[${tag}]` : name;
}

/** Builds a Map<name, tag> from cast, e.g. { "[female character]" => "SHE", "[male character]" => "HE" }. */
export function buildIdentityMap(cast: any[]): Map<string, string> {
  return new Map(cast.map((c: any) => {
    const g = (typeof c.gender === 'string' ? c.gender : '').toLowerCase();
    const tag = g === 'female' ? 'SHE' : g === 'male' ? 'HE' : 'THEY';
    return [c.name as string, tag];
  }));
}

/**
 * Phase 2A: Strip internal agent annotation language that bleeds into prompts.
 * These strings come from CML generation agents and must never appear in chapter obligation text.
 */
export const sanitizeClueField = (text: string): string =>
  text
    .replace(/The detail is explicit:\s*/gi, '')
    .replace(/This detail added\s+\w+\s+texture[^.]+\./gi, '')
    .replace(/without changing the essential deduction chain[^.]*\./gi, '')
    // P2-18: Require "in the case background" to start a sentence (preceded only by a period/newline
    // or at string start) so the pattern doesn't strip legitimate narrative uses of this phrase.
    .replace(/(^|\.\s{0,2})in the case background[^.]*\./gim, (m, p1) => p1 || '')
    .trim();


/**
 * A_65b Ph4 (reliability plan) — MANDATED-REPETITION exclusions for the recurrence detector.
 * The 277-call AtmosphereRepair census found the pass dominated by the pipeline scrubbing its
 * OWN required repetitions (Type-B self-interference): the A1 injector lead ("pressed on to the
 * next concrete detail" — the top phrase at 19+16+16 overlapping n-grams) and LOCKED-FACT value
 * phrasings ("hands fixed at ten minutes past eight") which the fact machinery REQUIRES verbatim
 * across chapters — and whose LLM "fresh alternative" then risks a locked_fact_absent regen (a
 * three-stage self-interference chain). A recurring n-gram is exempt when it contains a locked
 * value or matches an injector-seed fragment. Bounded and ours — this list never grows to chase
 * model phrasing (the anti-mole law); it names only text WE insert or REQUIRE.
 */
const MANDATED_REPETITION_FRAGMENTS: ReadonlyArray<string> = [
  // A1 early-clue lead family (deterministic-repair.ts; also scaffold seed A1:pressed_on)
  'pressed on to the next concrete detail',
  'laid the facts out plainly where the others could see them',
];

// n-grams are sliding windows, so a gram usually overlaps a fragment PARTIALLY ("she pressed on
// to the next concrete" vs "pressed on to the next concrete detail"). Exempt a gram when it
// contains any 5-word sub-window of a fragment — distinctive enough to never exempt innocent prose.
const FRAGMENT_SUBWINDOWS: ReadonlyArray<string> = MANDATED_REPETITION_FRAGMENTS.flatMap((frag) => {
  const words = frag.split(/\s+/);
  const out: string[] = [];
  for (let i = 0; i + 5 <= words.length; i++) out.push(words.slice(i, i + 5).join(' '));
  return out.length > 0 ? out : [frag];
});

const containsMandatedRepetition = (gram: string, lockedValues: ReadonlyArray<string>): boolean => {
  const g = gram.toLowerCase();
  for (const w of FRAGMENT_SUBWINDOWS) {
    if (g.includes(w)) return true;
  }
  for (const v of lockedValues) {
    const lv = String(v ?? '').toLowerCase().trim();
    if (lv.length < 6) continue;
    if (g.includes(lv)) return true;
    // Sliding windows overlap values partially too — a gram carrying ≥3 consecutive words of a
    // locked value must not become a substitution target (replacing it would mangle the value).
    // 3 words is the precision floor: 2-word windows ("ten minutes") would exempt innocent prose.
    const words = lv.split(/\s+/);
    for (let i = 0; i + 3 <= words.length; i++) {
      if (g.includes(words.slice(i, i + 3).join(' '))) return true;
    }
  }
  return false;
};

export function detectRecurringPhrases(
  chapters: ProseChapter[],
  ngramSize = 7,
  threshold = 3,
  /** A_65b Ph4 — locked-fact VALUES the prose must repeat verbatim; never repair targets. */
  lockedValues: ReadonlyArray<string> = [],
): string[] {
  const chapterHits = new Map<string, Set<number>>();

  chapters.forEach((chapter, index) => {
    const tokens = tokenizeWords((chapter.paragraphs ?? []).join(' '));
    const grams = toNgrams(tokens, ngramSize);
    for (const gram of grams) {
      const parts = gram.split(' ');
      const contentWords = parts.filter((part) => part.length > 3 && !CLUE_TOKEN_STOPWORDS.has(part));
      if (contentWords.length < 3) continue;
      if (containsMandatedRepetition(gram, lockedValues)) continue;
      if (!chapterHits.has(gram)) {
        chapterHits.set(gram, new Set<number>());
      }
      chapterHits.get(gram)!.add(index);
    }
  });

  return Array.from(chapterHits.entries())
    .filter(([, hits]) => hits.size >= threshold)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 15)
    .map(([phrase]) => phrase);
}

/**
 * Build per-chapter clue description block from agent5 ClueDistributionResult.
 * Maps each scene's clue IDs to full Clue objects so the prose agent knows exactly
 * what evidence to surface and how it should be observable to the reader.
 * Also includes mapping-only clues from clue_to_scene_mapping that have delivery_method.
 */

export function formatProvisionalScoringFeedbackBlock(
  feedback: Array<{
    fromChapter: number;
    score: number;
    deficits: string[];
    directives: string[];
  }> | undefined,
  recurringPhraseWarnings?: string[],
): string {
  const effectiveFeedback = Array.isArray(feedback) ? feedback.slice(-2) : [];
  const effectivePhraseWarnings = Array.isArray(recurringPhraseWarnings)
    ? recurringPhraseWarnings.filter((p) => typeof p === 'string' && p.trim().length > 0).slice(0, 10)
    : [];
  if (effectiveFeedback.length === 0 && effectivePhraseWarnings.length === 0) return '';

  const lines: string[] = [];
  // Isolation wrapper — instructs the model that this block is private diagnostic
  // content that must never be reproduced verbatim in narrative output. Without this
  // wrapper the model tends to echo imperative directives into prose (chapters 2, 13, 15
  // pattern). The wrapper+framing change is two-layer: structural isolation + observational
  // phrasing (no imperative "Required corrections:" language).
  lines.push('\n\n[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]');
  lines.push('\nPRIOR CHAPTER QUALITY OBSERVATIONS:');
  for (const item of effectiveFeedback) {
    lines.push(`- Chapter ${item.fromChapter} (score ${item.score}/100):`);
    if (item.deficits.length > 0) {
      lines.push(`  Quality gaps noted: ${item.deficits.join('; ')}`);
    }
    if (item.directives.length > 0) {
      lines.push(`  Address in upcoming chapters: ${item.directives.join(' | ')}`);
    }
  }
  if (effectivePhraseWarnings.length > 0) {
    // A_65 Phase 3 — THE VARIETY CONTRACT. The top-6 derivation's single clean structural
    // separator between the corpus's best and worst stories is phrase repetition (TOP ~10 vs BOT
    // ~14 recurring 7-grams, 4 of 6 worst runs saturated); AtmosphereRepair burns ~8 LLM calls a
    // run scrubbing it post-hoc and never converges. Prevention is a drafting behavior, so the
    // instruction demands a DIFFERENT SOURCE, not merely avoidance.
    lines.push(
      `- USED-UP PHRASINGS (these exact wordings are spent — they already appear in earlier chapters and repetition is this story's biggest measured quality risk): ${effectivePhraseWarnings.map((p) => `"${p}"`).join(', ')}.`,
    );
    lines.push(
      `  Do not reuse or lightly vary them. Draw this chapter's atmosphere and transitions from a DIFFERENT sensory or physical source than the previous chapter (if the last chapter leaned on sound/silence, use light, temperature, touch, or object detail here).`,
    );
  }
  lines.push('[END INTERNAL DIAGNOSTICS]');
  return lines.join('\n');
}

export function selectSensoryVariant(
  variants: any[],
  chapterIndex: number,
  lastUsed: string | undefined,
  scene: { timeOfDay?: string; weather?: string },
): any | undefined {
  if (!variants?.length) return undefined;
  // Normalize to lowercase so callers don't need to pre-process case
  const sceneTime = (scene.timeOfDay ?? '').toLowerCase();
  const sceneWeather = (scene.weather ?? '').toLowerCase();
  let candidates = variants.filter(
    (v) => (v.timeOfDay ?? '').toLowerCase() === sceneTime && (v.weather ?? '').toLowerCase() === sceneWeather,
  );
  if (!candidates.length) candidates = variants.filter((v) => (v.timeOfDay ?? '').toLowerCase() === sceneTime);
  if (!candidates.length) candidates = [...variants];
  // Anti-repeat: avoid re-using the same variant when alternatives exist
  if (candidates.length === 1 && candidates[0].id === lastUsed) {
    const alternates = variants.filter((v) => v.id !== lastUsed);
    if (alternates.length) candidates = alternates;
  }
  return candidates[chapterIndex % candidates.length];
}

/**
 * compileSensoryAtoms — post-processes Agent 2c location profiles so that
 * sensoryDetails arrays contain noun phrases only (no complete sentences).
 *
 * Agent 2c's LLM may still generate full sentences despite the schema instruction.
 * This deterministic transform strips grammatical structure from any entry that
 * looks like a sentence (> 60 chars or contains a verb/period), reducing it to
 * the core noun phrase. Called in agent2c-run.ts immediately after the agent
 * completes, before the profiles reach any downstream prompt builder.
 */
export function compileSensoryAtoms(profiles: any): any {
  if (!profiles) return profiles;

  const atomise = (val: string): string => {
    if (typeof val !== 'string') return val;
    // Already a short noun phrase — leave untouched
    if (val.length <= 55 && !/[.!?]/.test(val)) return val;
    let result = val
      // Strip leading article + subject ("The fire crackles" → "fire crackles")
      .replace(/^The\s+/i, '')
      // Strip from first present-tense verb pattern onward
      .replace(/\bprovide[sd]?\b.*$/i, '')
      .replace(/\bfill[sed]?\b.*$/i, '')
      .replace(/\blinger(?:s|ed|ing)?\b.*$/i, '')
      .replace(/\bwaft[sed]?\b.*$/i, '')
      .replace(/\bseep[sed]?\b.*$/i, '')
      .replace(/\bcarr(?:ies|y|ied)\b.*$/i, '')
      .replace(/\bhangs?\b.*$/i, '')
      .replace(/\bsit[s]?\b.*$/i, '')
      .replace(/\brest[s]?\b.*$/i, '')
      // Strip trailing clause extensions
      .replace(/,\s*(punctuated|interrupted|mingling|creating|offering|inviting|adding)[^,]*$/i, '')
      .replace(/\s*as\s+if\s+.*$/i, '')
      .replace(/\s*—\s+.*$/i, '')
      .replace(/\s*,\s+[a-z][^,]{20,}$/i, '') // trailing subordinate clause
      // Strip terminal punctuation
      .replace(/[.,;:!?]+$/, '')
      .trim();
    // If still long after stripping, keep only the first 5 tokens (noun phrase head)
    if (result.length > 55) {
      result = result.split(/\s+/).slice(0, 5).join(' ');
    }
    return result || val;
  };

  const SENSORY_KEYS = ['sights', 'sounds', 'smells', 'tactile'];

  const transformLocation = (loc: any): any => {
    if (!loc?.sensoryDetails) return loc;
    const sd = { ...loc.sensoryDetails };
    for (const key of SENSORY_KEYS) {
      if (Array.isArray(sd[key])) {
        sd[key] = (sd[key] as string[]).map(atomise);
      }
    }
    return { ...loc, sensoryDetails: sd };
  };

  return {
    ...profiles,
    keyLocations: Array.isArray(profiles.keyLocations)
      ? profiles.keyLocations.map(transformLocation)
      : profiles.keyLocations,
  };
}