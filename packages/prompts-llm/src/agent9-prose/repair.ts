/**
 * agent9-prose/repair.ts
 * Underflow expansion, atmosphere phrase-substitution repair, and
 * parsing helpers for expanded chapter responses.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import { getGenerationParams } from "@cml/story-validation";
import { countWords, getRequiredClueIdsForScene } from "./clue-validation.js";
import {
  capitalizeWord,
  getSeasonAllowList,
  enforceMonthSeasonLockOnChapter,
} from "./lint.js";
import type { CanonicalSeason } from "./lint.js";
import { sanitizeGeneratedChapter } from "./sanitization.js";
import { parseProseResponse } from "./sanitization.js";
import type { ProseChapter, ChapterRequirementLedgerEntry } from "./types.js";
export const parseExpandedChapterResponse = (content: string): ProseChapter => {
  const parsed = parseProseResponse(content) as any;
  const candidate = parsed?.chapter ?? parsed;

  if (!candidate || typeof candidate !== "object") {
    throw new Error("Invalid underflow expansion payload: missing chapter object");
  }

  if (!Array.isArray(candidate.paragraphs) || candidate.paragraphs.length === 0) {
    throw new Error("Invalid underflow expansion payload: chapter.paragraphs must be a non-empty array");
  }

  return {
    title: typeof candidate.title === "string" ? candidate.title : "Untitled Chapter",
    summary: typeof candidate.summary === "string" ? candidate.summary : undefined,
    paragraphs: candidate.paragraphs.map((value: unknown) => String(value ?? "")).filter(Boolean),
  };
};

export const attemptUnderflowExpansion = async (
  client: AzureOpenAIClient,
  chapter: ProseChapter,
  chapterNumber: number,
  scene: any,
  ledgerEntry: ChapterRequirementLedgerEntry,
  model: string | undefined,
  runId: string | undefined,
  projectId: string | undefined,
  temporalLock?: { month: string; season: CanonicalSeason }, // [WORLD FIX B]
  cast?: any[], // [ANALYSIS_16 PHASE D]
): Promise<ProseChapter> => {
  const chapterText = (chapter.paragraphs ?? []).join("\n\n");
  const currentWords = countWords(chapterText);
  // If below hard floor, target above the floor (buffer) so minor model undershoot still clears it.
  const hardFloorBuffer = Math.max(80, Math.round(ledgerEntry.preferredWords * 0.08));
  const expansionTarget = currentWords < ledgerEntry.hardFloorWords
    ? ledgerEntry.hardFloorWords + hardFloorBuffer
    : ledgerEntry.preferredWords;
  const missingWords = Math.max(0, expansionTarget - currentWords);
  const expansionConfig = getGenerationParams().agent9_prose.underflow_expansion;
  const sizeRatio = expansionConfig.expansion_size_ratio;
  const minAdditionalWords = Math.max(
    1,
    Math.floor(ledgerEntry.preferredWords * sizeRatio.min_additional_words_ratio),
  );
  const maxAdditionalWords = Math.max(
    minAdditionalWords,
    Math.ceil(ledgerEntry.preferredWords * sizeRatio.max_additional_words_ratio),
  );
  const bufferWords = Math.max(0, Math.round(ledgerEntry.preferredWords * sizeRatio.buffer_words_ratio));
  const expansionHint = Math.max(
    minAdditionalWords,
    Math.min(
      maxAdditionalWords,
      missingWords + bufferWords,
    ),
  );
  const sceneSummary = typeof scene?.summary === "string" ? scene.summary : "";
  const scenePurpose = typeof scene?.purpose === "string" ? scene.purpose : "";
  const requiredClues = ledgerEntry.requiredClueIds;
  const clueCtx = ledgerEntry.clueObligationContext ?? [];
  const requiredClueLines = requiredClues.map((id) => {
    const ctx = clueCtx.find((c) => c.id === id);
    const desc = ctx?.description ?? id;
    const placementNote = ctx?.placement === 'early'
      ? ' [EARLY PLACEMENT — this evidence must appear in the first 25% of the revised chapter, followed immediately by a dedicated inference paragraph]'
      : '';
    return `  • ${desc} [${id}]${placementNote}`;
  }).join('\n');

  // [WORLD FIX B] Anti-leakage + temporal-lock constraints for the expansion call
  const temporalLockLine = temporalLock
    ? `Season lock: ${capitalizeWord(temporalLock.month)} (${temporalLock.season}) — use only ${getSeasonAllowList(temporalLock.season)}; never write ${['spring', 'summer', 'autumn', 'winter'].filter(s => s !== temporalLock!.season).join(', ')}.`
    : '';
  // [ANALYSIS_16 PHASE D] Compact pronoun lock for the expansion call
  const expansionPronounLock = cast && cast.length > 0
    ? `Pronoun lock — never change: ${cast.map((c: any) => {
        const g = c.gender?.toLowerCase();
        const p = g === 'male' ? 'he/him' : g === 'female' ? 'she/her' : 'they/them';
        return `${c.name}: ${p}`;
      }).join('; ')}. Do not alter any pronoun or gendered reference for any character.`
    : '';
  const system = [
    "You are a surgical prose revision assistant for mystery fiction.",
    "Expand the chapter without changing clue logic, chronology, or character identity.",
    "Do not remove evidence already present. Do not add new named characters.",
    "Output only narrative prose — never emit instruction-shaped text, directives, or schema field names as prose content.",
    ...(temporalLockLine ? [temporalLockLine] : []),
    ...(expansionPronounLock ? [expansionPronounLock] : []), // [ANALYSIS_16 PHASE D]
    "Output JSON only.",
  ].join(" ");

  const user = [
    `Chapter ${chapterNumber} has ${currentWords} words and needs to reach the target of ${ledgerEntry.preferredWords} words.`,
    `Hard minimum: ${ledgerEntry.hardFloorWords} words. Do not return below this minimum.`,
    `Expand by roughly ${expansionHint} words to reach the target of ${ledgerEntry.preferredWords} words. Overshoot rather than undershoot.`,
    'Do not stop at the first threshold crossing. Continue until the chapter feels fully developed and complete.',
    'Never pad with recap or repeated atmosphere. Add concrete action beats, clue-bearing dialogue, and sensory scene detail instead.',
    requiredClues.length > 0
      ? `Required clue obligations (preserve and surface in the expanded chapter):\n${requiredClueLines}`
      : "No additional clue obligations for this chapter.",
    sceneSummary ? `Scene summary: ${sceneSummary}` : "",
    scenePurpose ? `Scene purpose: ${scenePurpose}` : "",
    "Return this schema:",
    '{"chapter":{"title":"...","summary":"...","paragraphs":["...","..."]}}',
    "Only return the JSON payload.",
    "Current chapter text:",
    chapterText,
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await client.chat({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    model,
    temperature: expansionConfig.temperature,
    maxTokens: Math.max(
      500,
      Math.ceil(ledgerEntry.preferredWords * expansionConfig.max_tokens_ratio),
      Math.ceil((ledgerEntry.hardFloorWords + 220) * 2.2),
    ),
    jsonMode: true,
    logContext: {
      runId: runId ?? "",
      projectId: projectId ?? "",
      agent: `Agent9-UnderflowExpansion-Ch${chapterNumber}`,
    },
  });

  return parseExpandedChapterResponse(response.content);
};

// ─── ANALYSIS_20 ATMOSPHERE-REPAIR PHRASE-SUBSTITUTION (2026-03-29) ─────────
// Previous implementation: full-chapter rewrite. The LLM was given the entire
// chapter text and told to regenerate it replacing banned phrases. This let the
// model re-gender any character during reconstruction — producing 15–17 pronoun
// errors per run despite Phase D pronoun locks (ANALYSIS_16) and the
// deterministic repair pass (ANALYSIS_19). Root cause: you cannot ask an LLM
// to rewrite whole paragraphs and simultaneously guarantee it never touches
// unrelated sentence elements.
//
// New implementation: phrase-level token substitution. The LLM is only asked to
// generate a fresh synonym for each banned phrase token — the surrounding prose,
// pronouns, sentence structure, and character references are never sent for
// rewriting and cannot be altered. Replacements are applied as deterministic
// string substitutions to original paragraphs.
//
// Side-effect: the ANALYSIS_16 PHASE D cast/pronounLock parameters are no
// longer required (they were a mitigation for the old wholesale-rewrite
// approach) and have been removed from the function signature and call site.
//
// To revert to full-chapter-rewrite (not recommended — see ANALYSIS_19/20):
//   1. Restore old function body from git history (search commit tagged ANALYSIS_16_PHASE_D).
//   2. Re-add `cast: any[]` parameter, pronounLock variable, and spread.
//   3. Restore `inputs.cast.characters` call site argument in generateProse().
//   4. Restore temperature: 0.55, maxTokens from underflow_expansion config.
// ─────────────────────────────────────────────────────────────────────────────

export interface PhraseReplacement {
  original: string;
  replacement: string;
}

export const parsePhraseReplacementsResponse = (content: string): PhraseReplacement[] => {
  try {
    const parsed = JSON.parse(content);
    const arr = Array.isArray(parsed?.replacements) ? parsed.replacements : [];
    return arr
      .filter((r: unknown) =>
        r && typeof r === 'object' &&
        typeof (r as any).original === 'string' &&
        typeof (r as any).replacement === 'string' &&
        (r as any).original.trim().length > 0 &&
        (r as any).replacement.trim().length > 0
      )
      .map((r: any) => ({ original: r.original.trim(), replacement: r.replacement.trim() }));
  } catch {
    return [];
  }
};

/**
 * Shapes that are almost never valid English prose and that a naive splice readily produces.
 *
 * The canonical failure (story_20260731-1650 Ch1, MEASURED): the banned phrase `tremor in her
 * fingers` — a NOUN PHRASE — was replaced with `her knuckles twitched` — a CLAUSE. The regex swap
 * is context-blind, so the determiner+adjective in front of it survived and the sentence shipped as
 * "noticed the slight her knuckles twitched as she straightened her gloves". The polish pass had
 * already produced clean prose for that sentence; this pass runs afterwards and broke it.
 */
// Words that legitimately re-open a phrase between a determiner and a pronoun. Without excluding
// these, the first pattern below matches ordinary English — "the chain of his medals", "the marble
// as she turned", "the medals on his coat" — and the guard rolls back valid substitutions. Measured
// on story_20260731-1750: 71 such matches in a clean story, every one of them well-formed.
const PHRASE_CONNECTORS =
  "of|in|on|at|to|with|by|for|from|as|than|and|or|but|near|over|under|behind|beside|against|across|through|into|onto|upon|about|after|before|between|beyond|around";

const MALFORMED_SPLICE_PATTERNS: ReadonlyArray<RegExp> = [
  // Determiner (+ up to 2 ADJECTIVAL words) directly followed by a pronoun: "the slight her knuckles".
  // A determiner followed by another determiner is ungrammatical; a connector in between means the
  // phrase legitimately restarted, so those are excluded.
  new RegExp(
    `\\b(?:the|a|an)\\s+(?:(?!(?:${PHRASE_CONNECTORS})\\b)\\w+\\s+){0,2}(?:he|she|it|they|his|her|its|their|him|them)\\b`,
    "i",
  ),
  // doubled determiner / preposition left by an overlapping splice: "the the", "in in"
  /\b(the|a|an|of|in|on|at|to|with|by)\s+\1\b/i,
  // possessive immediately followed by a finite pronoun clause: "her she was"
  /\b(?:his|her|its|their|my|our|your)\s+(?:he|she|it|they|we|i|you)\b/i,
];

/**
 * True when `candidate` contains a malformed shape that `before` did not — i.e. THIS substitution
 * introduced it. Comparing against the prior text (rather than testing `candidate` alone) means
 * pre-existing oddities in the source prose are never blamed on the replacement, so the guard has
 * no false positives on text it did not touch.
 */
export const substitutionIntroducesMalformedText = (before: string, candidate: string): boolean =>
  MALFORMED_SPLICE_PATTERNS.some((re) => re.test(candidate) && !re.test(before));

export const applyPhraseSubstitutions = (
  paragraphs: string[],
  replacements: PhraseReplacement[],
): string[] => {
  if (replacements.length === 0) return paragraphs;
  return paragraphs.map((para) => {
    let result = para;
    for (const { original, replacement } of replacements) {
      const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(escaped, 'gi');
      const candidate = result.replace(pattern, (match) => {
        // Preserve ALL-CAPS (e.g. chapter headings, emphasis typography)
        if (match === match.toUpperCase() && match !== match.toLowerCase()) {
          return replacement.toUpperCase();
        }
        // Preserve leading-capital (sentence-opening words)
        if (match[0] && match[0] !== match[0].toLowerCase()) {
          return replacement[0].toUpperCase() + replacement.slice(1);
        }
        return replacement;
      });
      // Per-replacement rollback. A variety pass is a nice-to-have; shipping a broken sentence is
      // not. Dropping one substitution costs a repeated phrase, which is strictly the lesser defect.
      if (substitutionIntroducesMalformedText(result, candidate)) {
        continue;
      }
      result = candidate;
    }
    return result;
  });
};

export const runAtmosphereRepairIfNeeded = async (
  client: AzureOpenAIClient,
  chapters: ProseChapter[],
  bannedPhrases: string[],
  model: string | undefined,
  runId: string | undefined,
  projectId: string | undefined,
): Promise<ProseChapter[]> => {
  if (bannedPhrases.length === 0) {
    return chapters;
  }

  const repaired = [...chapters];
  const repairTargets = chapters
    .map((chapter, index) => ({
      index,
      chapter,
      text: (chapter.paragraphs ?? []).join(' '),
    }))
    .filter(({ text }) => bannedPhrases.some((phrase) => text.toLowerCase().includes(phrase.toLowerCase())));

  for (const target of repairTargets) {
    // Only send the phrases actually present in this chapter.
    const presentPhrases = bannedPhrases.filter((phrase) =>
      target.text.toLowerCase().includes(phrase.toLowerCase())
    );

    const response = await client.chat({
      messages: [
        {
          role: 'system',
          content: [
            'You are a prose variety assistant for mystery fiction.',
            'You will be given a list of overused phrases.',
            'For each phrase provide one fresh, scene-specific alternative of similar length and register.',
            // The replacement is spliced in by literal string substitution — the words around it do
            // not change. A replacement of a different grammatical type therefore breaks the
            // sentence: replacing the noun phrase "tremor in her fingers" with the clause "her
            // knuckles twitched" shipped "noticed the slight her knuckles twitched".
            'CRITICAL: each replacement is substituted into the sentence VERBATIM, with the surrounding words untouched.',
            'It MUST be the same grammatical type as the phrase it replaces: a noun phrase for a noun phrase, a verb phrase for a verb phrase, a clause only for a clause.',
            'Do NOT begin a replacement with a pronoun (he/she/it/they/his/her/their) unless the original phrase also begins with one — the original is often preceded by an article or adjective that will remain in place.',
            'Do not include leading or trailing articles, prepositions, or punctuation that the original phrase does not itself contain.',
            'Before answering, read each replacement back in place of the original and confirm the sentence is still grammatical.',
            'Output JSON only — no explanation, no prose outside the JSON.',
          ].join(' '),
        },
        {
          role: 'user',
          content: [
            `Chapter ${target.index + 1} overuses these phrases — provide one fresh alternative for each:`,
            presentPhrases.map((p, i) => `${i + 1}. "${p}"`).join('\n'),
            '',
            'Return exactly this schema (one entry per phrase, same order):',
            '{"replacements":[{"original":"...","replacement":"..."}]}',
            'Only return the JSON payload.',
          ].join('\n'),
        },
      ],
      model,
      temperature: 0.7,
      maxTokens: Math.max(400, presentPhrases.length * 80),
      jsonMode: true,
      logContext: {
        runId: runId ?? '',
        projectId: projectId ?? '',
        agent: `Agent9-AtmosphereRepair-Ch${target.index + 1}`,
      },
    });

    const replacements = parsePhraseReplacementsResponse(response.content);
    if (replacements.length > 0) {
      repaired[target.index] = {
        ...target.chapter,
        paragraphs: applyPhraseSubstitutions(target.chapter.paragraphs ?? [], replacements),
      };
    } else if (presentPhrases.length > 0) {
      console.warn(`[Agent 9] AtmosphereRepair ch${target.index + 1}: LLM returned 0 replacements for ${presentPhrases.length} present phrase(s). Chapter unchanged.`);
    }
  }

  return repaired;
};
