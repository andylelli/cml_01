/**
 * agent9-prose/prompt-builder.ts
 * High-level prose prompt construction: world brief, context summary,
 * clue description, NSD block, token budgeting, and the top-level
 * buildProsePrompt() assembler.
 */
import { isVictimArchetype } from "@cml/cml";
import { createHash } from "node:crypto";
import type { CaseData } from "@cml/cml";
import {
  getGenerationParams,
  getStoryLengthTarget,
  resolveSceneWordBudget,
  anonymizeUnknownTitledNames,
} from "@cml/story-validation";
import { selectChapterAtoms, buildAssetLibrary } from "../asset-library.js";
import type { AssetLibrary } from "../types/asset-library.js";
import type { NarrativeState } from "../types/narrative-state.js";
import { updateNSD } from "../types/narrative-state.js";
import type { ClueDistributionResult, Clue } from "../agent5-clues.js";
import {
  ARC_POSITION_REGISTER,
  ARC_POS_TO_SCENE_TYPE,
  HIGH_TENSION_POSITIONS,
} from "../constants/arc-position.js";
import {
  capitalizeWord,
  getSeasonAllowList,
  MONTH_TO_SEASON,
  deriveTemporalSeasonLock,
  enforceMonthSeasonLockOnChapter,
} from "./lint.js";
import type { CanonicalSeason } from "./lint.js";
import {
  getChapterWordTargets,
  getPromptPreferredWords,
  getRequiredClueIdsForScene,
  CLUE_TOKEN_STOPWORDS,
  surfaceSpecKeyTerms,
  tokenizeForClueObligation,
  resolveStageModeKey,
  formatStageModeLabel,
  resolveCmlSceneRefChapterNumber,
  sceneMatchesCmlSceneRef,
} from "./clue-validation.js";
import {
  buildStageModeContractBlock,
  formatCompositionLabel,
  getStageModeProfile,
} from "./narrative-balance.js";
import {
  buildIdentityMap,
  tagCharacter,
  sanitizeClueField,
  extractBeatFingerprints,
  detectRecurringPhrases,
  formatProvisionalScoringFeedbackBlock,
  selectSensoryVariant,
} from "./phrase-analysis.js";
import type { BeatFingerprint } from "./phrase-analysis.js";
import { buildChapterObligationBlock } from "./obligation-block.js";
import {
  buildPronounAccuracyBlock,
  buildCharacterContractsBlock,
  buildCharacterPersonalityBlock,
  buildLocationProfilesBlock,
  buildTemporalContextBlock,
  buildSettingRefinementBlock,
  buildBackgroundContextBlock,
  buildFairPlayContractBlock,
  stripLocationParagraphs,
} from "./prompt-blocks.js";
import {
  buildContinuityContext,
  buildStoryToDateBlock,
  buildSceneGroundingChecklist,
} from "./context-management.js";
import { sanitizeContinuityTailForPrompt } from "./continuity-tail.js";
import { buildDiscriminatingTestChecklist } from "./discriminating.js";
import { sanitizeScenesCharacters } from "./sanitization.js";
import type { CastDesign } from "../agent2-cast.js";
import type { PromptBlockPriority, PromptContextBlock, PromptSectionInputs } from "./prompt-blocks.js";
import type {
  ProseChapter,
  ChapterSummary,
  ProseGenerationInputs,
  MacroArcEntry,
} from "./types.js";

// A_58 review: a CLOCK TIME requires a number/number-word around the preposition — not a bare `to`/
// `half`/`quarter`, which match ordinary English ("pinned TO the door", "a QUARTER of the estate", "the
// HALF-open door"). The old `\b(?:past|to|quarter|half)\b` test mis-classified such descriptive values as
// atomic (D1) and could pair them as a bogus discriminating contradiction (D2). Matches: "3:30", "4.20",
// "ten o'clock", "half past three", "quarter to nine", "twenty minutes past four", "thirteen minutes to
// midnight". Does NOT match a bare preposition with no clock number on both sides.
const TIME_NUM = "(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|noon|midnight|midday|quarter|half)";
const CLOCK_TIME_RE = new RegExp(
  "\\d{1,2}\\s*[:.]\\s*\\d{2}" + // 3:30 / 4.20
    "|\\b[\\w-]+\\s+o[’']clock\\b" + // ten o'clock
    `|\\b(?:${TIME_NUM}|\\d{1,2})(?:[-\\s]${TIME_NUM})*\\s+(?:minutes?\\s+)?(?:past|to)\\s+(?:the\\s+)?(?:${TIME_NUM}|\\d{1,2})\\b`, // half past three / twenty minutes past four / thirteen minutes to midnight
  "i",
);

// Canonical singular for each measurement unit, so a staged/true pair of the SAME scale merges even across
// irregular plurals ("ten feet" vs "twelve foot"; "metres" vs "meters").
const UNIT_CANON: Record<string, string> = {
  minutes: "minute", minute: "minute", hours: "hour", hour: "hour", seconds: "second", second: "second",
  degrees: "degree", degree: "degree", feet: "foot", foot: "foot", metres: "metre", metre: "metre",
  meters: "metre", meter: "metre", yards: "yard", yard: "yard", inches: "inch", inch: "inch",
  paces: "pace", pace: "pace", miles: "mile", mile: "mile", pounds: "pound", pound: "pound",
  ounces: "ounce", ounce: "ounce", stone: "stone", grains: "grain", grain: "grain",
};
const UNIT_RE = /\b(minutes?|hours?|seconds?|degrees?|feet|foot|metres?|meters?|yards?|inches?|paces?|miles?|pounds?|ounces?|stone|grains?)\b/i;

/**
 * A_57 D1 — is a locked-fact value ATOMIC (a time / number / measurement that must be reproduced
 * verbatim) vs DESCRIPTIVE (a log entry / weather note / document clause that must be paraphrased, not
 * spliced in verbatim)? Parameter-generic: keys off the value's shape, never its content. Exported so
 * the prose prompt and the worker's locked-fact presence enforcer agree on which facts are verbatim.
 */
export const isAtomicLockedFactValue = (raw: string): boolean => {
  const v = String(raw ?? "").trim();
  if (!v) return false;
  // A clue-critical time may carry a trailing day-part ("…past four in the afternoon"); it is still an
  // atomic time and must stay verbatim. Strip that qualifier before the length check so a pure time of 7+
  // words ("twenty minutes past four in the afternoon") is not misread as a descriptive clause and routed
  // to the paraphrase block — which would lose fidelity on the single most clue-critical value.
  const core = v.replace(/[,\s]+(?:in\s+the\s+(?:morning|afternoon|evening)|at\s+night)\.?$/i, "").trim();
  const words = core.split(/\s+/).filter(Boolean);
  if (words.length > 6) return false; // a clause/sentence is descriptive
  if (/\d/.test(core) || CLOCK_TIME_RE.test(core) || UNIT_RE.test(core)) {
    return true; // time / measurement / quantity
  }
  if (words.length <= 3 && /^(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty)\b/i.test(core)) {
    return true; // a short number-word amount
  }
  return false;
};

/**
 * A_57 D2 — the discriminating dimension of an atomic locked-fact value: a clock-time, else a measurement
 * unit, used to pair a STAGED value against a TRUE value of the SAME scale. Bare counts (no unit, no time)
 * return null: two unrelated tallies ("three drops", "two letters") are NOT a comparable contradiction, so
 * they must never be paired. Parameter-generic — keys off the value's shape, never its content.
 */
const lockedFactDimension = (raw: string): string | null => {
  const v = String(raw ?? "").trim().toLowerCase();
  if (!v) return null;
  if (CLOCK_TIME_RE.test(v)) return "time"; // a real clock time, not a bare to/half/quarter (A_58 review)
  const unit = v.match(UNIT_RE);
  if (unit) return `unit:${UNIT_CANON[unit[1].toLowerCase()] ?? unit[1].toLowerCase().replace(/s$/, "")}`;
  return null; // a bare count is not a comparable dimension — never pair on it
};

export interface DiscriminatingContradictionPair {
  /** the two contradicting locked-fact values (a staged value and the true value), in registry order */
  values: [string, string];
  /** their locked-fact descriptions, for the obligation text */
  descriptions: [string, string];
}

/**
 * A_57 D2 — find the "single canonical contradiction" pair among the locked facts. A discriminating
 * timeline/quantity mystery turns on a STAGED value and a TRUE value of the SAME dimension (two
 * clock-times, two readings). When the prose states both as flat parallel truths instead of ONE
 * contradiction, a human reads "the central clue contradicts itself" (ChatGPT's biggest problem on run
 * 09168377). Returning the pair lets the chapter obligation require them to appear AS A CONTRAST.
 *
 * Conservative: groups the ATOMIC locked facts by dimension (clock-time / measurement unit) and returns a
 * pair ONLY when exactly one dimension holds exactly two DISTINCT values. Any ambiguity (no such
 * dimension, three+ same-dimension values, or several candidate pairs) → null, so a wrong contrast is
 * never forced onto unrelated facts. Parameter-generic across clock, tide table, thermometer, or ledger.
 */
export const findDiscriminatingContradictionPair = (
  lockedFacts: ReadonlyArray<{ description?: string; value?: string }> | undefined,
): DiscriminatingContradictionPair | null => {
  if (!Array.isArray(lockedFacts)) return null;
  const byDim = new Map<string, Array<{ description: string; value: string }>>();
  for (const f of lockedFacts) {
    const value = String(f?.value ?? "").trim();
    if (!value || !isAtomicLockedFactValue(value)) continue;
    const dim = lockedFactDimension(value);
    if (!dim) continue;
    const list = byDim.get(dim) ?? [];
    if (!list.some((x) => x.value.toLowerCase() === value.toLowerCase())) {
      list.push({ description: String(f?.description ?? "").trim(), value });
      byDim.set(dim, list);
    }
  }
  const candidates = [...byDim.values()].filter((list) => list.length === 2);
  if (candidates.length !== 1) return null; // none, or ambiguous (multiple candidate pairs)
  const [a, b] = candidates[0];
  return { values: [a.value, b.value], descriptions: [a.description, b.description] };
};

export const REVEAL_GROUNDWORK_BANNED_TERMS = [
  'culprit',
  'murderer',
  'killer',
  'guilty',
  'reveal',
  'revelation',
  'solution',
  'confession',
];

export const buildRevealGroundworkCues = (revealImplications: string): string[] => {
  const compact = revealImplications.replace(/\s+/g, ' ').trim();
  if (!compact) return [];

  const BANNED_RE = new RegExp(
    `\\b(${REVEAL_GROUNDWORK_BANNED_TERMS.join('|')})\\b`,
    'i',
  );

  const rawSentences = compact
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim().replace(/^['"\u2018\u2019\u201c\u201d]+|['"\u2018\u2019\u201c\u201d]+$/g, ''))
    .filter((sentence) => sentence.length >= 24)
    .slice(0, 3);

  // P2-14: Drop any sentence that contains a banned reveal term entirely and replace with
  // a generic placeholder. Previously banned terms were replaced with "hidden-truth",
  // producing ungrammatical instructions ("the hidden-truth of Dr. Finch's involvement").
  const cues = rawSentences
    .map((sentence) => {
      if (BANNED_RE.test(sentence)) {
        // Replace the whole sentence — don't produce broken English instructions.
        return 'Plant one subtle anomaly that can be re-read after the resolution.';
      }
      const trimmed = sentence
        .replace(/\b(will|would)\b[^.?!;:]*$/i, '')
        .replace(/\b(on|at)\s+the\s+reveal\b/gi, '')
        .replace(/\b(recontextuali[sz]e[sd]?|recolou?r(?:ed|ing)?|explain(?:ed|s|ing)?|prove(?:d|s|n)?|confir(?:m|ms|med|ming))\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[.;,:\-\s]+$/g, '')
        .trim();
      return trimmed.length >= 12 ? trimmed : '';
    })
    .filter((cue) => cue.length >= 12);

  if (cues.length > 0) return cues;

  const fallback = compact.slice(0, 120).replace(/[.;,:\-\s]+$/g, '').trim();
  return fallback ? [fallback] : [];
};

// ─── WORLD FIX A (ANALYSIS_17) ───────────────────────────────────────────
// Add authoritative season enforcement into buildWorldBriefBlock().
// Previously the World Document injected era atmosphere (eraRegister) but no
// season vocabulary rule. Season enforcement lived in the temporal_context block
// (medium priority, droppable under token pressure). This fix derives the correct
// season from historicalMoment.specificDate and emits a "## Season Lock" section
// inside world_document (high priority, never dropped).
// All WORLD FIX A changes are tagged [WORLD FIX A] below.
//
// To revert World Fix A in full:
//   1. In buildWorldBriefBlock(), delete the entire [WORLD FIX A] code block:
//      from `const hmDateLower = String(hm.specificDate ?? '').toLowerCase();`
//      through the closing `}` of the `if (hmMonth) { ... }` block.
//      (The four preceding lines — lines.push Era, eraRegister, emotionalRegister,
//      physicalConstraints — are unchanged and must be kept.)
// ─────────────────────────────────────────────────────────────────────────
/**
 * Builds the WORLD DOCUMENT brief block injected into per-chapter prose prompts.
 *
 * When a WorldDocument is present, it supersedes raw character/location/temporal
 * blocks with richer, emotionally-grounded context. The gross structure of
 * temporal/fashion/location is still provided  by the regular blocks so the
 * world brief focuses on voice, humour, and emotional arc.
 */
export const buildWorldBriefBlock = (
  worldDoc: any,
  chapterIndex: number,
  totalChapters: number,
  characterPronouns?: Record<string, string>, // [PHASE 1] inline (he/him) labels in Character Voices headings
  activeCharacterNames?: Set<string>,
  narrativeState?: NarrativeState,
): string => {
  if (!worldDoc) return '';

  // §3.2: Compute arc position once at function scope — used for register-matched
  // voice fragment selection, humour permission, and turning-point lookup.
  const arcPosition = chapterIndex <= 1 ? 'opening'
    : chapterIndex <= Math.floor(totalChapters * 0.25) ? 'early'
    : chapterIndex <= Math.floor(totalChapters * 0.4) ? 'first_turn'
    : chapterIndex <= Math.floor(totalChapters * 0.55) ? 'mid'
    : chapterIndex <= Math.floor(totalChapters * 0.7) ? 'second_turn'
    : chapterIndex <= Math.floor(totalChapters * 0.8) ? 'pre_climax'
    : chapterIndex === totalChapters - 1 ? 'resolution'
    : 'climax';

  const lines: string[] = [];
  lines.push('\n\nWORLD DOCUMENT (use this as your primary creative context):');

  // Historical moment
  const hm = worldDoc.historicalMoment;
  if (hm) {
    lines.push(`\n## Era: ${hm.specificDate}`);
    if (hm.eraRegister) lines.push(hm.eraRegister);
    if (hm.emotionalRegister) lines.push(`Emotional register: ${hm.emotionalRegister}`);
    if (Array.isArray(hm.physicalConstraints) && hm.physicalConstraints.length > 0) {
      lines.push('Physical constraints: ' + hm.physicalConstraints.slice(0, 4).join(' | '));
    }
    if (Array.isArray(hm.currentTensions) && hm.currentTensions.length > 0) {
      lines.push('Current tensions (weave into background texture): ' + hm.currentTensions.slice(0, 3).join(' | '));
    }
    if (hm.wartimeServiceContext) {
      const wsc = hm.wartimeServiceContext;
      lines.push(`Wartime context — ${wsc.serviceStatus}: ${wsc.socialTexture}${wsc.absenceEffect ? ` Absence effect: ${wsc.absenceEffect}` : ''}`);
    }
    // [WORLD FIX A] Season lock: derive season authoritatively from specificDate.
    // Lives in world_document (high priority) and cannot be dropped by token-budget cuts.
    // This is the canonical temporal contract — all other season references are secondary.
    const hmDateLower = String(hm.specificDate ?? '').toLowerCase();
    const hmMonth = Object.keys(MONTH_TO_SEASON).find(m => hmDateLower.includes(m));
    if (hmMonth) {
      const hmSeason = MONTH_TO_SEASON[hmMonth];
      const hmForbidden = ['spring', 'summer', 'autumn', 'winter']
        .filter(s => s !== hmSeason)
        .join(', ');
      lines.push(`\n## Season Lock (mandatory — derived from ${hm.specificDate})`);
      lines.push(`Season: ${hmSeason}. Allowed vocabulary: ${getSeasonAllowList(hmSeason)}`);
      lines.push(`Forbidden seasonal words — never use in narration, dialogue, or metaphor: ${hmForbidden} and their adjectival forms.`);
      lines.push(`Every weather description, atmosphere, and time-of-year reference must be consistent with ${hmSeason}.`);
    }
  }

  // Story theme
  if (worldDoc.storyTheme) {
    lines.push(`\n## Story Theme\n${worldDoc.storyTheme}`);
  }

  // Emotional arc overview + position-specific beat
  const arc = worldDoc.storyEmotionalArc;
  if (arc) {
    if (arc.dominantRegister || arc.arcDescription) {
      lines.push(`\n## Story Emotional Register`);
      if (arc.dominantRegister) lines.push(`Dominant: ${arc.dominantRegister}`);
      if (arc.arcDescription) lines.push(`\nArc:\n${arc.arcDescription}`);
    }
    if (Array.isArray(arc.turningPoints)) {
      const tp = arc.turningPoints.find((t: any) => t.position === arcPosition);
      if (tp?.emotionalDescription) {
        lines.push(`\n## Emotional register at this point in the story\n${tp.emotionalDescription}`);
      }
    }
    // Ending note — only in final act (helps shape denouement texture)
    if (arc.endingNote && chapterIndex >= Math.floor(totalChapters * 0.75)) {
      lines.push(`\n## Ending note (shape final chapters toward this)\n${arc.endingNote}`);
    }
  }

  // Character portraits — physical appearance + era intersection
  if (Array.isArray(worldDoc.characterPortraits) && worldDoc.characterPortraits.length > 0) {
    lines.push('\n## Character Portraits (appearance & era)');
    for (const portrait of worldDoc.characterPortraits) {
      if (activeCharacterNames?.size && !activeCharacterNames.has(portrait.name)) continue;
      lines.push(`\n### ${portrait.name}`);
      if (portrait.portrait) lines.push(portrait.portrait);
      if (portrait.eraIntersection) lines.push(`Era intersection: ${portrait.eraIntersection}`);
    }
  }

  // Character voice sketches — all available registers (comfortable, evasive, stressed, formal, humorous)
  if (Array.isArray(worldDoc.characterVoiceSketches) && worldDoc.characterVoiceSketches.length > 0) {
    lines.push('\n## Character Voices');
    for (const sketch of worldDoc.characterVoiceSketches) {
      if (activeCharacterNames?.size && !activeCharacterNames.has(sketch.name)) continue;
      const pronounsLabel = characterPronouns?.[sketch.name] ? ` (${characterPronouns[sketch.name]})` : ''; // [PHASE 1]
      lines.push(`\n### ${sketch.name}${pronounsLabel}`);
      if (sketch.voiceDescription) lines.push(sketch.voiceDescription);
      // §3.2: Register-matched fragment selection — prefer dominant arc register;
      // humorous fragments are elevated when permitted, suppressed when forbidden.
      const dominantRegister = ARC_POSITION_REGISTER[arcPosition] ?? 'neutral';
      const voiceHumourEntry = worldDoc.humourPlacementMap?.find(
        (e: any) => e.scenePosition === ARC_POS_TO_SCENE_TYPE[arcPosition],
      );
      const voiceHumourPermitted = voiceHumourEntry?.humourPermission !== 'forbidden';
      const sorted = [...(sketch.fragments ?? [])].sort((a: any, b: any) => {
        const aReg: string = a.register ?? 'neutral';
        const bReg: string = b.register ?? 'neutral';
        const aMatch = aReg === dominantRegister ? 0 : 1;
        const bMatch = bReg === dominantRegister ? 0 : 1;
        const aHumour = aReg === 'humorous' ? (voiceHumourPermitted ? -1 : 2) : 0;
        const bHumour = bReg === 'humorous' ? (voiceHumourPermitted ? -1 : 2) : 0;
        return (aMatch + aHumour) - (bMatch + bHumour);
      });
      const fragments = sorted.slice(0, 3);
      for (const frag of fragments) {
        lines.push(`[${frag.register}] ${frag.text}`);
      }
      if (sketch.humourNote) lines.push(`Humour: ${sketch.humourNote}`);
    }
  }

  // Location registers — emotional register, camera angle, era note per key location
  if (Array.isArray(worldDoc.locationRegisters) && worldDoc.locationRegisters.length > 0) {
    lines.push('\n## Location Registers (scene framing guides)');
    for (const reg of worldDoc.locationRegisters) {
      lines.push(`\n${reg.name}: ${reg.emotionalRegister}. Camera angle: ${reg.cameraAngle}.${reg.eraNote ? ` Era: ${reg.eraNote}` : ''}`);
    }
  }

  // Humour placement map — scene-position-specific humour permission
  if (Array.isArray(worldDoc.humourPlacementMap) && worldDoc.humourPlacementMap.length > 0) {
    const mappedSceneType = ARC_POS_TO_SCENE_TYPE[arcPosition] ?? arcPosition;
    const humourEntry = worldDoc.humourPlacementMap.find((e: any) => e.scenePosition === mappedSceneType);
    if (humourEntry) {
      const permitted = humourEntry.permittedCharacters?.join(', ') ?? '';
      const forms = humourEntry.permittedForms?.join(', ') ?? '';
      lines.push(`\n## Humour guidance for this story position (${arcPosition})`);
      lines.push(`Permission: ${humourEntry.humourPermission}${humourEntry.condition ? ` — condition: ${humourEntry.condition}` : ''}`);
      if (permitted) lines.push(`Characters who may be funny: ${permitted}`);
      if (forms) lines.push(`Permitted forms: ${forms}`);
      lines.push(`Rationale: ${humourEntry.rationale}`);
    }
  }

  // §4.1 + §4.2: relativePos shared by both the break-moment and reveal-implications gates
  const relativePos = chapterIndex / Math.max(1, totalChapters);

  // §4.2: Break moment — full obligation at 60–85%, approach signal (texture only) at 40–60%
  if (worldDoc?.breakMoment?.character) {
    const bm = worldDoc.breakMoment;
    const breakMomentAlreadyDeployed =
      (narrativeState?.deployedAssets?.['break_moment:story:full']?.length ?? 0) > 0;
    if (!breakMomentAlreadyDeployed && relativePos >= 0.60 && relativePos <= 0.85) {
      lines.push(
        `\n## Character Break Moment (this section of the story)\n` +
        `Character: ${bm.character}\n` +
        `Form: ${bm.form ?? ''}\n` +
        `Narrative function: ${bm.narrativeFunction ?? ''}`,
      );
    } else if (relativePos >= 0.40 && relativePos < 0.60) {
      lines.push(
        `\n## Character Pressure\n` +
        `${bm.character} is approaching a point of breakdown. ` +
        `Stress and strain should be accumulating visibly — through behaviour, not statement. ` +
        `No confrontation yet.`,
      );
    }
  }

  // §4.1: Two-phase reveal implications
  // - Chapters 0–1: silent (too early to plant)
  // - Chapters 2 → 74%: forward-planting texture ("Reveal Groundwork")
  // - 75%+: full retrospective injection ("Reveal Implications")
  if (typeof worldDoc.revealImplications === 'string' && worldDoc.revealImplications.length > 0) {
    if (relativePos >= 0.75) {
      lines.push(`\n## Reveal Implications (plant these subtly)\n${worldDoc.revealImplications}`);
    } else if (chapterIndex >= 2) {
      const cues = buildRevealGroundworkCues(worldDoc.revealImplications);
      lines.push('\n## Reveal Groundwork (texture — do not explain, only plant)');
      if (cues.length > 0) {
        cues.forEach((cue) => {
          lines.push(`- Plant one subtle observable beat related to: "${cue}". Do not explain significance yet.`);
        });
      } else {
        lines.push('- Plant one subtle anomaly that can be re-read later. Do not explain significance yet.');
      }
    }
  }

  return lines.join('\n');
};

export const buildContextSummary = (caseData: CaseData, cast: CastDesign) => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const crimeClass = meta.crime_class ?? {};
  const era = meta.era?.decade ?? "Unknown era";
  const location = meta.setting?.location ?? "Unknown setting";
  const title = meta.title ?? "Untitled Mystery";
  const falseAssumption = cmlCase.false_assumption?.statement ?? "";
  const culpritNames = cmlCase.culpability?.culprits ?? [];
  const culprit = Array.isArray(culpritNames) ? culpritNames.join(", ") : "Unknown";
  const castCharacters = Array.isArray((cast as any)?.characters)
    ? (cast as any).characters
    : Array.isArray(cmlCase?.cast)
      ? cmlCase.cast
      : Array.isArray(cmlCase?.cast?.characters)
        ? cmlCase.cast.characters
        : [];
  // Annotate each character with their pronoun form. CML stories are set in the
  // 1930s–1950s Golden Age of detective fiction — gender was binary in this era;
  // 'non-binary' is not a valid gender value and will never appear in the cast.
  const castNames = castCharacters.map((c: any) => {
    const g = (c.gender ?? '').toLowerCase();
    if (g === 'female') return `${c.name} (she/her)`;
    if (g === 'male')   return `${c.name} (he/him)`;
    return c.name;
  }).join(', ');

  // Resolve victim's full name from cast by role field or roleArchetype substring
  const victimCharacter = castCharacters.find(
    (c: any) => {
      if (c.role === 'victim') return true;
      const archetype: string = c.roleArchetype ?? (c as any).role_archetype ?? '';
      return typeof archetype === 'string' && isVictimArchetype(archetype);
    }
  );
  const victimName = (victimCharacter as any)?.name ?? '';
  const victimLine = victimName ? `\nVictim: ${victimName}` : '';
  // Extract culprit motive from their character profile (CML 2.0: cast.characters[n].motive_seed)
  const culpritNameSet = new Set<string>(Array.isArray(cmlCase.culpability?.culprits) ? cmlCase.culpability.culprits : []);
  const culpritChar = castCharacters.find((c: any) => culpritNameSet.has(c.name));
  const motive = culpritChar?.motive_seed ?? '';
  const motiveLock = motive ? `\n\nMOTIVE LOCK: The culprit's motive is: "${motive}". Every scene involving the culprit must remain consistent with this motive. Do not introduce alternative motivations.` : '';

  return `# Case Overview\nTitle: ${title}\nEra: ${era}\nSetting: ${location}\nCrime: ${crimeClass.category ?? "murder"} (${crimeClass.subtype ?? "unknown"})\nCulprit: ${culprit}${victimLine}\nFalse assumption: ${falseAssumption}\nCast: ${castNames}\n\nSetting Lock: Keep all scenes and descriptions consistent with the stated setting (${location}). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "${location}" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.${motiveLock}`;
};

/**
 * Returns the victim character's full name from the cast, or '' if not found.
 * Used to enforce named-victim guardrails in prose prompts.
 */
export const resolveVictimName = (cast: CastDesign): string => {
  const chars = Array.isArray((cast as any)?.characters) ? (cast as any).characters : [];
  // Pass 1: explicit role=victim
  let victim = chars.find((c: any) => c.role === 'victim');
  // Pass 2: role_archetype contains 'victim'
  if (!victim) victim = chars.find((c: any) => {
    const archetype: string = c.roleArchetype ?? (c as any).role_archetype ?? '';
    return typeof archetype === 'string' && isVictimArchetype(archetype);
  });
  // Pass 3: culpabilityVictim injected by caller from CML CASE.culpability.victim
  if (!victim && (cast as any)?.culpabilityVictim) {
    victim = chars.find((c: any) => c.name === (cast as any).culpabilityVictim);
  }
  return (victim as any)?.name ?? '';
};

// ROADMAP_TO_80 M0 / L1: the DEATH method (how the victim was killed) is distinct from the
// concealment mechanism (hidden_model.mechanism.description). The reveal-completeness gate and the
// resolution obligation must surface the killing — not only how the timeline was faked — or the
// rubric's "weak murder method (concealment explained, death not)" cap fires. We DERIVE it
// deterministically (no new LLM-schema field needed): an explicit CASE.death_method wins, else we
// read meta.crime_class.subtype/category and normalise to a canonical injury phrase whose tokens are
// robust substrings (so a "stab wound" target matches prose saying "stabbed"/"stabbing").
const DEATH_METHOD_CANON: Array<[RegExp, string]> = [
  [/stab|knif|blade/i, "stab wound"],
  [/shoot|shot|gun|firearm|pistol|revolver/i, "gunshot wound"],
  [/strangl|garrot|throttl/i, "strangulation"],
  [/poison|arsenic|cyanide|toxin/i, "poisoning"],
  [/bludgeon|blunt[- ]?force|cudgel|struck/i, "blunt-force blow"],
  [/drown/i, "drowning"],
  [/smother|suffocat|asphyxiat/i, "suffocation"],
  [/electrocut/i, "electrocution"],
  [/burn|arson/i, "burns"],
];

/**
 * Resolves the victim's manner of death as a short phrase with robust tokens, or '' if unknowable.
 * Source order: explicit CASE.death_method → meta.crime_class.subtype → meta.crime_class.category.
 */
export const resolveDeathMethod = (cml: any): string => {
  const c = cml && typeof cml === "object" && cml.CASE && typeof cml.CASE === "object" ? cml.CASE : (cml ?? {});
  const explicit = typeof c?.death_method === "string" ? c.death_method.trim() : "";
  if (explicit) return explicit;
  const subtype = typeof c?.meta?.crime_class?.subtype === "string" ? c.meta.crime_class.subtype : "";
  const category = typeof c?.meta?.crime_class?.category === "string" ? c.meta.crime_class.category : "";
  const haystack = `${subtype} ${category}`;
  for (const [re, canon] of DEATH_METHOD_CANON) {
    if (re.test(haystack)) return canon;
  }
  return "";
};

const normalizePromptValue = (value: unknown): string =>
  String(value ?? "").replace(/\s+/g, " ").trim();

const buildFirstAppearanceContractsBlock = (
  caseData: CaseData,
  cast: CastDesign,
  scenes: unknown[],
  chapterSummaries: ChapterSummary[],
  priorChapters: ProseChapter[],
): string => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const caseCast = Array.isArray(cmlCase.cast) ? cmlCase.cast : [];
  const designCast = Array.isArray((cast as any)?.characters) ? (cast as any).characters : [];
  const victimName = resolveVictimName(cast) || normalizePromptValue(cmlCase?.culpability?.victim);
  const victimLower = victimName.toLowerCase();

  const canonicalNameByLower = new Map<string, string>();
  for (const entry of [...designCast, ...caseCast]) {
    const name = normalizePromptValue((entry as any)?.name);
    if (!name) continue;
    const lower = name.toLowerCase();
    if (!canonicalNameByLower.has(lower)) canonicalNameByLower.set(lower, name);
  }
  if (canonicalNameByLower.size === 0) return "";

  const seenLower = new Set<string>();
  for (const summary of chapterSummaries) {
    for (const name of summary.charactersPresent ?? []) {
      const lower = normalizePromptValue(name).toLowerCase();
      if (canonicalNameByLower.has(lower)) seenLower.add(lower);
    }
  }

  const castNameRegex = new Map<string, RegExp>();
  for (const [lower, name] of canonicalNameByLower.entries()) {
    castNameRegex.set(lower, new RegExp(`\\b${name.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i"));
  }
  for (const chapter of priorChapters) {
    const chapterText = Array.isArray(chapter?.paragraphs) ? chapter.paragraphs.join("\n") : "";
    if (!chapterText) continue;
    for (const [lower, rx] of castNameRegex.entries()) {
      if (rx.test(chapterText)) seenLower.add(lower);
    }
  }

  const orderedFirstAppearances: string[] = [];
  const emitted = new Set<string>();
  for (const scene of scenes as any[]) {
    const sceneCharacters = Array.isArray(scene?.characters) ? scene.characters : [];
    for (const rawName of sceneCharacters) {
      const lower = normalizePromptValue(rawName).toLowerCase();
      const canonical = canonicalNameByLower.get(lower);
      if (!canonical) continue;
      if (lower === victimLower) continue;
      if (seenLower.has(lower) || emitted.has(lower)) continue;
      emitted.add(lower);
      orderedFirstAppearances.push(canonical);
    }
  }
  if (orderedFirstAppearances.length === 0) return "";

  const relationshipPairs = Array.isArray((cast as any)?.relationships?.pairs)
    ? (cast as any).relationships.pairs
    : [];

  const lines: string[] = [
    "\n\n## FIRST-APPEARANCE SUSPECT INTRO CONTRACT (MANDATORY)",
    "When a character below appears for the first time in this batch, their first beat must establish all of the following in natural prose:",
    "1. Public identity (who they are in this household/social world)",
    "2. Connection to the victim",
    "3. Why they matter to the investigation now",
    "4. Surface behaviour plus one subtle suspicious/emotional tell",
    "5. The investigator's immediate read of that behaviour (provisional, not a verdict)",
    "Bad (too thin): \"Captain Hale stood nearby.\"",
    "Good pattern: \"Captain Hale, the household steward and the victim's trusted adviser, stood nearest the body. His posture was disciplined, but his hand tightened around his watch chain.\"",
    "Use subtle pressure cues only. Do not write confessions or explicit guilt declarations in first appearances.",
  ];

  for (const name of orderedFirstAppearances) {
    const lower = name.toLowerCase();
    const caseEntry = caseCast.find((entry: any) => normalizePromptValue(entry?.name).toLowerCase() === lower) ?? {};
    const designEntry = designCast.find((entry: any) => normalizePromptValue(entry?.name).toLowerCase() === lower) ?? {};

    const occupation = normalizePromptValue((designEntry as any)?.occupation ?? (caseEntry as any)?.occupation);
    const role = normalizePromptValue(
      (caseEntry as any)?.role
      ?? (designEntry as any)?.role
      ?? (caseEntry as any)?.role_archetype
      ?? (designEntry as any)?.roleArchetype,
    ).replace(/_/g, " ");
    const publicPersona = normalizePromptValue((caseEntry as any)?.public_persona ?? (designEntry as any)?.publicPersona);
    const access = normalizePromptValue((caseEntry as any)?.access_plausibility ?? (designEntry as any)?.accessPlausibility);
    const alibiWindow = normalizePromptValue((caseEntry as any)?.alibi_window ?? (designEntry as any)?.alibiWindow);
    const opportunityChannels = Array.isArray((caseEntry as any)?.opportunity_channels)
      ? (caseEntry as any).opportunity_channels.map((v: unknown) => normalizePromptValue(v)).filter(Boolean)
      : [];
    const behaviouralTells = Array.isArray((caseEntry as any)?.behavioral_tells)
      ? (caseEntry as any).behavioral_tells.map((v: unknown) => normalizePromptValue(v)).filter(Boolean)
      : [];
    const stakes = normalizePromptValue((caseEntry as any)?.stakes ?? (designEntry as any)?.stakes);
    const motiveSeed = normalizePromptValue((caseEntry as any)?.motive_seed ?? (designEntry as any)?.motiveSeed);

    const relationshipHints: string[] = [];
    const perCharacterRelationships = Array.isArray((caseEntry as any)?.relationships)
      ? (caseEntry as any).relationships
      : [];
    for (const rel of perCharacterRelationships) {
      const relText = normalizePromptValue(rel);
      if (!relText) continue;
      if (victimName && relText.toLowerCase().includes(victimLower)) {
        relationshipHints.push(relText);
      }
    }
    for (const pair of relationshipPairs) {
      const c1 = normalizePromptValue((pair as any)?.character1);
      const c2 = normalizePromptValue((pair as any)?.character2);
      if (!victimName || !c1 || !c2) continue;
      const pairMatchesVictim =
        (c1.toLowerCase() === lower && c2.toLowerCase() === victimLower)
        || (c2.toLowerCase() === lower && c1.toLowerCase() === victimLower);
      if (!pairMatchesVictim) continue;
      const relationship = normalizePromptValue((pair as any)?.relationship);
      const sharedHistory = normalizePromptValue((pair as any)?.sharedHistory);
      const combined = [relationship, sharedHistory].filter(Boolean).join("; ");
      if (combined) relationshipHints.push(combined);
    }

    const publicIdentity = [occupation, role].filter(Boolean).join("; ");
    const victimConnection = relationshipHints[0]
      || (victimName ? `directly affected by ${victimName}'s death and its fallout` : "directly tied to the victim's social circle");

    const roleLower = role.toLowerCase();
    const investigationRelevance = roleLower.includes("detective")
      ? "is actively driving interviews and credibility checks in this scene"
      : [
          access ? `access plausibility: ${access}` : "",
          alibiWindow ? `alibi window: ${alibiWindow}` : "",
          opportunityChannels.length > 0 ? `opportunity channel: ${opportunityChannels[0]}` : "",
        ].filter(Boolean).join(" | ") || "holds testimony or access that can move the case forward";

    const pressureCue = behaviouralTells[0]
      || stakes
      || motiveSeed
      || publicPersona
      || "show a subtle hesitation, fixation, or defensive shift";

    lines.push(`\n- ${name}`);
    lines.push(`  Public identity anchor: ${publicIdentity || `${name} is a central household figure`} `);
    lines.push(`  Connection to victim: ${victimConnection}.`);
    lines.push(`  Investigation relevance: ${investigationRelevance}.`);
    lines.push(`  Suspicion/pressure cue seed: ${pressureCue}.`);
    lines.push("  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.");
  }

  return lines.join("\n");
};

const buildChapterOutcomeBlock = (
  activeMode: string,
  chapterStart: number,
  chapterEnd: number,
  cmlCase: any,
  narrativeState: NarrativeState | undefined,
  investigationLog: { unresolvedSuspects: string[] } | undefined,
  batchScenes: any[],
): string => {
  const suspects = ((cmlCase?.cast ?? []) as any[])
    .filter((entry: any) => {
      const role = String(entry?.role_archetype ?? entry?.role ?? "").toLowerCase();
      return !role.includes("detective") && !isVictimArchetype(role);
    })
    .map((entry: any) => String(entry?.name ?? ""))
    .filter(Boolean);
  const pressureTargets = new Set<string>();
  for (const scene of batchScenes) {
    const names = Array.isArray(scene?.characters) ? scene.characters : [];
    for (const name of names) {
      if (suspects.includes(String(name))) pressureTargets.add(String(name));
    }
  }

  const revealedClues = narrativeState?.cluesRevealedToReader?.length ?? 0;
  const unresolvedCount = Array.isArray(investigationLog?.unresolvedSuspects)
    ? investigationLog.unresolvedSuspects.filter(Boolean).length
    : suspects.length;

  const modeOutcomeByMode: Record<string, string> = {
    discovery_opening: "Introduce cast relevance and plant first clue while keeping culprit unresolved.",
    early_investigation: "Advance contradiction/alibi pressure and change working theory.",
    suspect_pressure: "Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).",
    false_suspect_clearing: "Prove innocence with evidence and re-target suspicion.",
    clue_reinterpretation: "Reframe prior clue meaning and update suspect implications.",
    discriminating_test: "Execute discriminating test and state prove-vs-rule-out outcome.",
    final_reveal: "Deliver full accusation chain: motive, death method, concealment mechanism, and consequence.",
    aftermath_consequence: "Show emotional/social consequences without introducing decisive new evidence.",
  };

  const requiredInfoByMode: Record<string, string> = {
    discovery_opening: "First clue observation tied to suspect landscape.",
    early_investigation: "At least one contradiction, alibi stress, or credibility fracture.",
    suspect_pressure: "At least one fear/motive/lie/loyalty reveal with investigative consequence.",
    false_suspect_clearing: "Evidence that clears one suspect and redirects inquiry.",
    clue_reinterpretation: "Earlier clue gets revised meaning with explicit theory update.",
    discriminating_test: "Observable test result separating theory A from theory B.",
    final_reveal: "Direct linkage between culprit and victim death, not mechanism-only tampering.",
    aftermath_consequence: "Consequence on relationships/order after truth.",
  };

  const profile = getStageModeProfile(activeMode as any);

  const lines = [
    "\n\n## CHAPTER OUTCOME CONTRACT (MANDATORY)",
    `Batch chapters: ${chapterStart}-${chapterEnd}.`,
    `Investigation state at start: ${revealedClues} clue(s) revealed to reader; approximately ${unresolvedCount} unresolved suspect(s).`,
    `Must change by end: ${modeOutcomeByMode[activeMode] ?? modeOutcomeByMode.early_investigation}`,
    `Suspect pressure target(s): ${Array.from(pressureTargets).join(", ") || "Use the most implicated active suspect in this batch."}`,
    `Required new information: ${requiredInfoByMode[activeMode] ?? requiredInfoByMode.early_investigation}`,
    `Forbidden reveals at this stage: ${profile.forbidden_reveals.join(" | ")}`,
  ];

  // L1 (ROADMAP_TO_80 M0): surface the resolved MANNER OF DEATH into the reveal contract. The
  // "weak murder method (concealment explained, death not)" cap fires when the reveal explains how the
  // timeline/clock was faked but never how the victim DIED. resolveDeathMethod was previously only used
  // to *validate* the reveal — the model was never *told* the manner of death, so it could only comply
  // by luck. Inject it as an explicit obligation so the killing is named in plain words.
  if (activeMode === "final_reveal") {
    const deathMethod = resolveDeathMethod(cmlCase);
    if (deathMethod) {
      lines.push(
        `Manner of death (MUST be named in the reveal): state plainly how the victim died — cause of death: ${deathMethod}. ` +
          `Surface it in the prose in plain words (e.g. "${deathMethod}") — not only how the clock/timeline was ` +
          `manipulated. A reveal that explains the concealment but never the killing fails the fair-play contract.`,
      );
    }

    // A_52 category ladder: plot_structure / clues / ending all sit at 5/10 because the reveal reads as
    // a clinical alibi-by-alibi elimination ("innocence established by the physical record"), pays off
    // clues as fresh logic rather than earned earlier, and resolves on a generic, asserted motive
    // ("jealousy") with no emotional weight. Push the reveal toward a single clear chain, clues-as-payoff,
    // a specific emotionally-grounded motive, and human closure.
    const culprit =
      String((cmlCase as any)?.culpability?.culprits?.[0] ?? "the culprit").trim() || "the culprit";
    const victim =
      String(
        (cmlCase as any)?.culpability?.victim ??
          (cmlCase as any)?.crimeDynamics?.victimCandidates?.[0] ??
          (Array.isArray((cmlCase as any)?.cast)
            ? ((cmlCase as any).cast.find((c: any) =>
                /victim/i.test(String(c?.role ?? c?.role_archetype ?? c?.roleArchetype ?? "")),
              )?.name ?? "")
            : ""),
      ).trim() || "the victim";
    lines.push(
      `Solution chain (plot clarity, NOT a timeline ledger): present the solution as ONE clear spine the reader can follow — ${culprit}, by the named means, with the established opportunity, for a specific reason. Clear each other suspect in a line or two; do NOT walk through every alibi and timeline as bookkeeping. A convoluted multi-timeline elimination is the failure mode here.`,
    );
    lines.push(
      `Clues as payoff (fair-play): build the reveal from clues the reader has ALREADY seen and the detective has weighed earlier — name them as they are paid off ("the scratched casing from the first morning", "the chimes the gardener heard"). Do not introduce decisive evidence for the first time here; clues should feel earned, not produced.`,
    );
    lines.push(
      `Motive (specific + emotional, NEVER a bare label): develop WHY ${culprit} killed ${victim} with concrete, personal specificity drawn from their relationship and history — the emotional truth that made murder feel, to ${culprit}, like the only door left. A one-word motive ("jealousy", "greed", "revenge") asserted without that interior truth is a FAIL: name what was actually at stake for ${culprit} and why no lesser act would serve.`,
    );
    lines.push(
      `Closure (emotional payoff, not a verdict): end on human consequence — the cost to those left behind, ${culprit}'s undoing, and the detective's reflection on what the truth changes — not a clinical "innocence established by the physical record." The reader should FEEL the weight of the resolution, not merely verify it.`,
    );
  }

  return lines.join("\n");
};

const buildModeSpecificChecklistItems = (activeMode: string): string[] => {
  switch (activeMode) {
    case "discovery_opening":
      return [
        "□ Mode check (Discovery/Opening): victim is explicitly named and major suspects are introduced before deep mechanism explanation.",
        "□ Mode check (Discovery/Opening): no culprit reveal and no full murder mechanism explanation.",
      ];
    case "suspect_pressure":
      return [
        "□ Mode check (Suspect Pressure): chapter contains a NEW pressure reveal (fear, motive, lie, loyalty conflict, or secret).",
        "□ Mode check (Suspect Pressure): NO culprit resolution — the chapter must NOT contain a confession, an arrest/'under arrest', 'case closed', 'I accuse'/'I name', or 'the culprit/murderer/killer is/was …'. Build suspicion only; the accusation is reserved for the final reveal.",
      ];
    case "false_suspect_clearing":
      return [
        "□ Mode check (False Suspect Clearing): suspect innocence is evidenced (not asserted) and suspicion shifts after clearing.",
      ];
    case "clue_reinterpretation":
      return [
        "□ Mode check (Clue Reinterpretation): chapter states prior clue meaning and revised meaning with explicit theory change.",
      ];
    case "discriminating_test":
      return [
        "□ Mode check (Discriminating Test): chapter states competing theories, test result, what is proved, and what is ruled out.",
      ];
    case "final_reveal":
      return [
        "□ Mode check (Final Reveal): chapter includes motive, death method, concealment mechanism, opportunity, evidence chain, and consequence.",
        "□ Mode check (Final Reveal): culprit is explicitly responsible for the victim's death, not only mechanism tampering.",
      ];
    case "aftermath_consequence":
      return [
        "□ Mode check (Aftermath/Consequence): chapter focuses on emotional/social fallout without introducing decisive new mystery evidence.",
      ];
    case "early_investigation":
    default:
      return [
        "□ Mode check (Early Investigation): chapter includes contradiction/alibi pressure and changes the investigator's working theory.",
      ];
  }
};

const buildPostChapterOneCharacterPressureBlock = (
  chapterStart: number,
  chapterEnd: number,
): string => {
  if (chapterEnd <= 1) return "";

  return [
    "\n\n## POST-CHAPTER-1 CHARACTER PRESSURE CONTRACT (MANDATORY)",
    "After Chapter 1, character content must not read as biography or static profile recap.",
    "Character beats must carry pressure and case movement.",
    chapterStart <= 1
      ? "For chapters 2+ in this batch, apply this contract strictly."
      : "Apply this contract to every chapter in this batch.",
    "",
    "For each chapter after Chapter 1, reveal at least one NEW character truth about one of:",
    "- fear",
    "- motive",
    "- lie/deception",
    "- loyalty conflict",
    "- relationship to the victim",
    "",
    "That character development must do at least one of the following:",
    "- make someone more suspicious",
    "- make someone less suspicious",
    "- explain why someone lied",
    "- reveal motive",
    "- deepen the emotional cost of the crime",
    "- change the investigator's understanding of the case",
    "",
    "Hard constraints:",
    "- No character paragraph that only restates occupation/role/persona without investigative consequence.",
    "- No static biography dumps after Chapter 1.",
    "- The investigator must register the pressure shift in-scene (through observation, questioning, or revised theory).",
  ].join("\n");
};

/**
 * Extract prose requirements from CML for validation
 * Returns formatted string describing mandatory prose elements
 */
export const buildProseRequirements = (
  caseData: CaseData,
  scenesForChapter?: unknown[],
  allOutlineScenes?: any[],
): string => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const proseReqs = cmlCase.prose_requirements ?? {};
  
  if (!proseReqs || Object.keys(proseReqs).length === 0) {
    return '';
  }

  let output = '\n\nCRITICAL PROSE REQUIREMENTS:\n\n';
  output += 'The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.\n\n';

  // Discriminating test scene
  if (proseReqs.discriminating_test_scene) {
    const dts = proseReqs.discriminating_test_scene;
    output += `**Discriminating Test Scene (Act ${dts.act_number}, Scene ${dts.scene_number}):**\n`;
    // tests_assumption_elements does not exist in cml_2_0 schema — removed (PS-3 fix)
    output += `Required elements: ${(dts.required_elements || []).join(', ')}\n`;
    // discriminating_test_scene.outcome does not exist in schema — omit rather than output 'N/A'
    if (dts.test_type) output += `Test type: ${dts.test_type}\n`;
    output += '\n';
  }

  // Suspect clearance scenes
  if (proseReqs.suspect_clearance_scenes && proseReqs.suspect_clearance_scenes.length > 0) {
    output += '**Suspect Clearance Scenes:**\n';
    proseReqs.suspect_clearance_scenes.forEach((clearance: any) => {
      output += `- ${clearance.suspect_name} (Act ${clearance.act_number}, Scene ${clearance.scene_number}): ${clearance.clearance_method}\n`;
      // CML schema field is supporting_clues, not required_clues (PS-4 fix)
      if (clearance.supporting_clues && clearance.supporting_clues.length > 0) {
        output += `  Clues: ${clearance.supporting_clues.join(', ')}\n`;
      }
    });
    output += '\n';
  }

  // Culprit revelation scene
  if (proseReqs.culprit_revelation_scene) {
    const crs = proseReqs.culprit_revelation_scene;
    output += `**Culprit Revelation Scene (Act ${crs.act_number}, Scene ${crs.scene_number}):**\n`;
    output += `Method: ${crs.revelation_method || 'detective explanation'}\n`;
    // culprit_revelation_scene has no required_clues in schema — use clue_to_scene_mapping (PS-4 fix)
    const crsClues = ((proseReqs.clue_to_scene_mapping ?? []) as any[]).filter(
      (m: any) => m.act_number === crs.act_number && m.scene_number === crs.scene_number
    ).map((m: any) => m.clue_id).filter(Boolean);
    if (crsClues.length > 0) {
      output += `Must reference clues: ${crsClues.join(', ')}\n`;
    }
    output += '\n';
  }

  // Identity rules (culprit reference restrictions)
  // The CML schema defines identity_rules as an ARRAY of per-character objects, not a scalar.
  // Each entry has: character_name, revealed_in_act (optional), before_reveal_reference, after_reveal_reference
  if (Array.isArray(proseReqs.identity_rules) && proseReqs.identity_rules.length > 0) {
    output += '**Identity Protection Rules:**\n';
    for (const rule of proseReqs.identity_rules) {
      output += `Character: ${rule.character_name}\n`;
      if (rule.revealed_in_act != null) {
        output += `- Before Act ${rule.revealed_in_act}: refer as "${rule.before_reveal_reference}"\n`;
        output += `- From Act ${rule.revealed_in_act} onward: refer as "${rule.after_reveal_reference}"\n`;
      } else {
        output += `- Before revelation: refer as "${rule.before_reveal_reference}"\n`;
        output += `- After revelation: refer as "${rule.after_reveal_reference}"\n`;
      }
    }
    output += '\n';
  }

  // Clue to scene mapping for this chapter
  if (proseReqs.clue_to_scene_mapping && scenesForChapter) {
    const relevantClues = proseReqs.clue_to_scene_mapping.filter((mapping: any) => {
      return scenesForChapter.some((scene: any) =>
        sceneMatchesCmlSceneRef(scene, mapping, allOutlineScenes ?? scenesForChapter as any[])
      );
    });
    
    if (relevantClues.length > 0) {
      output += '**Clue Placement for These Chapters:**\n';
      relevantClues.forEach((mapping: any) => {
        output += `- ${mapping.clue_id} must appear in Act ${mapping.act_number}, Scene ${mapping.scene_number} via ${mapping.delivery_method}\n`;
      });
      output += '\n';
    }
  }

  output += '**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.\n';

  return output;
};

/**
 * Strip phantom character names from scene data.
 *
 * 1. Characters array — remove any name not in the valid cast list.
 * 2. Summary / title text — replace any `Title Surname` pattern
 *    whose surname is not a valid cast member with an anonymous equivalent.
 *
 * This prevents phantom names baked into the narrative outline (e.g. from stale
 * LLM examples) from instructing the prose LLM to write about non-existent people.
 * If filtering the characters array would leave it empty, the original is preserved
 * so the scene still has context.
 */

export function buildTimelineStateBlock(
  temporalLock: { month: string; season: CanonicalSeason } | undefined,
  lockedFacts: ProseGenerationInputs['lockedFacts'] | undefined,
  cmlCase: any,
): string {
  const lines: string[] = [];

  if (temporalLock) {
    lines.push(`- Timeline anchor: ${capitalizeWord(temporalLock.month)} (${temporalLock.season}).`);
    lines.push(`- Month, season, weather, and time-of-year language in this batch must stay compatible with ${temporalLock.season}.`);
  }

  const constraintTime = cmlCase?.constraint_space?.time ?? cmlCase?.constraint_space?.timeline ?? {};
  const anchors = Array.isArray(constraintTime?.anchors) ? constraintTime.anchors : [];
  anchors
    .map((anchor: unknown) => String(anchor ?? '').trim())
    .filter(Boolean)
    .slice(0, 5)
    .forEach((anchor: string) => lines.push(`- Established timeline fact: ${anchor}`));

  // P2-6: Include ALL locked facts (up to cap), not just time-domain ones. Previously only
  // time-related facts were shown, leaving non-temporal locked facts with no frozen-state reminder.
  (lockedFacts ?? [])
    .slice(0, 8)
    .forEach((fact) => lines.push(`- If referenced, use exact phrase: "${fact.value}" (${fact.description}).`));

  if (lines.length === 0) {
    return '';
  }

  // P2-6: Renamed from "FROZEN TIMELINE STATE" to "FROZEN FACT STATE" to reflect that
  // non-temporal locked facts are now included.
  return `\n\nFROZEN FACT STATE (DO NOT ALTER):\n${lines.join('\n')}`;
}

// ─── PHASE 4 (BLUE-E) ────────────────────────────────────────────────────────
// Narrative Beat Registry: extract key sentence fingerprints from each committed
// chapter and inject them into the NSD as FORBIDDEN REPEATS so the LLM cannot
// re-use the same narrative beats in later chapters.

export function buildClueDescriptionBlock(
  scenesForChapter: unknown[],
  clueDistribution: ClueDistributionResult | undefined,
  cmlCase?: any,
): string {
  if (!Array.isArray(scenesForChapter) || scenesForChapter.length === 0) return '';

  const clueMap = clueDistribution?.clues?.length
    ? new Map<string, Clue>(clueDistribution.clues.map(c => [c.id, c]))
    : new Map<string, Clue>();
  const relevantClues: Clue[] = [];
  const relevantClueIds = new Set<string>();
  for (const scene of scenesForChapter as any[]) {
    const clueIds: string[] = Array.isArray(scene.cluesRevealed) ? scene.cluesRevealed : [];
    for (const id of clueIds) {
      const clue = clueMap.get(id);
      if (clue && !relevantClueIds.has(id)) {
        relevantClues.push(clue);
        relevantClueIds.add(id);
      }
    }
  }

  // Collect mapping-only clues (in clue_to_scene_mapping but not yet in relevantClues)
  const seenMappingIds = new Set<string>();
  const mappingOnlyLines: string[] = [];
  for (const scene of scenesForChapter as any[]) {
    for (const entry of ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])) {
      const id = String(entry?.clue_id ?? '');
      if (!id || seenMappingIds.has(id)) continue;
      if (!sceneMatchesCmlSceneRef(scene, entry, scenesForChapter as any[])) continue;
      if (!entry?.delivery_method) continue;
      if (relevantClueIds.has(id)) continue;
      seenMappingIds.add(id);
      mappingOnlyLines.push(`\n• [${id}] ${entry.delivery_method}`);
      mappingOnlyLines.push(`  Category: structural | Placement: early (Act ${entry.act_number})`);
      mappingOnlyLines.push(`  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): what this observation reveals about the time or circumstances of the crime.`);
    }
  }

  if (relevantClues.length === 0 && mappingOnlyLines.length === 0) return '';

  const lines: string[] = [
    '\n\n⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:',
    'The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:',
  ];
  for (const clue of relevantClues) {
    // R-A (M0): surface key terms, never the full description/pointsTo sentence (LLM copies it).
    lines.push(`\n• [${clue.id}] ${surfaceSpecKeyTerms(String(clue.description ?? ''))}`);
    lines.push(`  Category: ${clue.category} | Criticality: ${clue.criticality}${clue.supportsInferenceStep ? ` | Supports inference step ${clue.supportsInferenceStep}` : ''}`);
    // A_65 Phase 1 — planning context, never prose: the old "Points to:" label read as an
    // instruction to STATE the inference on arrival (the instant-inference syndrome, F3).
    lines.push(`  Later significance (context for YOU — do NOT state this in the prose; meaning surfaces only at the licensed deduction beats): ${surfaceSpecKeyTerms(String(clue.pointsTo ?? ''))}`);
  }
  lines.push(...mappingOnlyLines);
  lines.push('\nFor each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.');
  return lines.join('\n');
}

/**
 * Format the NarrativeState into a read-only system prompt block.
 * Injected between the continuity context and the discriminating-test checklist.
 */
export function buildNSDBlock(
  state: NarrativeState | undefined,
  victimName?: string,
  investigationLog?: { revealedClueDescs: string[]; clearedSuspects: { name: string; method: string }[]; unresolvedSuspects: string[] },
  arcPosition?: string,
  identityMap?: Map<string, string>,
  beatHistory?: BeatFingerprint[],
): string {
  if (!state) return '';

  // Phase 5: CHAPTER_TYPE_ADVANCE — tell the LLM what structural beat this chapter must achieve
  const CHAPTER_TYPE_ADVANCE: Record<string, string> = {
    opening:     'Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).',
    early:       'Interview each suspect — record their claimed whereabouts',
    first_turn:  'Examine physical evidence — find at least one new clue',
    mid:         'Test one suspect\'s alibi against a known fact — result must be stated',
    second_turn: 'New evidence overturns the leading theory — introduce a reversal',
    pre_climax:  'Narrow to the culprit — apply the discriminating test logic',
    climax:      'Confront the culprit with the complete evidence chain',
    resolution:  'Confession or arrest, culprit states motive explicitly, method explained, consequences stated',
  };

  const lines: string[] = ['\n\n═══ NARRATIVE STATE (read-only — do not contradict) ═══'];

  if (state.lockedFacts.length > 0) {
    lines.push('\nLOCKED FACTS — use verbatim whenever this evidence is described:');
    state.lockedFacts.forEach(f => lines.push(`  • ${f.description}: "${f.value}"`, ));
  }

  if (Object.keys(state.characterPronouns).length > 0) {
    lines.push('\nCHARACTER PRONOUNS — never deviate from these:');
    Object.entries(state.characterPronouns).forEach(([name, pronouns]) => lines.push(`  • ${name}: ${pronouns}`));
  }

  if (state.cluesRevealedToReader.length > 0) {
    lines.push(`\nCLUES ALREADY REVEALED TO READER: ${state.cluesRevealedToReader.join(', ')} — do not reveal these as new information.`);
  }

  // Phase 5: Investigation log (deterministic from clue IDs + clearance data)
  if (investigationLog) {
    lines.push('\nINVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):');
    if (investigationLog.revealedClueDescs.length > 0) {
      lines.push(`• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): ${investigationLog.revealedClueDescs.join(' | ')}`);
    }
    if (investigationLog.clearedSuspects.length > 0) {
      investigationLog.clearedSuspects.forEach(s => lines.push(`• Suspect cleared: ${identityMap ? tagCharacter(s.name, identityMap) : s.name} — ${s.method}`));
    }
    if (investigationLog.unresolvedSuspects.length > 0) {
      lines.push(`• Suspects still unresolved: ${investigationLog.unresolvedSuspects.map(n => identityMap ? tagCharacter(n, identityMap) : n).join(', ')}`);
    }
    lines.push('⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.');
  }

  // [PHASE 4] FORBIDDEN REPEATS — beat history from prior committed chapters
  if (Array.isArray(beatHistory) && beatHistory.length > 0) {
    // Cap the window to the 8 most recent chapters — older beats are less relevant
    // and injecting all 250+ beats from a 42-chapter story would exhaust token budget.
    const recentBeats = beatHistory.slice(-8);
    const allBeats = recentBeats.flatMap(bfp =>
      bfp.beats.map(beat => `• Ch${bfp.chapterNumber}: "${beat.slice(0, 90)}${beat.length > 90 ? '\u2026' : ''}"`))
    lines.push('\n⛔ FORBIDDEN REPEATS — These narrative beats have already been written.');
    lines.push('Do NOT rewrite them or near-paraphrases. Write something that has NOT happened yet:');
    allBeats.forEach(b => lines.push(b));
    lines.push('Advancing the story requires new information, a new character action, or a new location.');
  }

  // Phase 5: Chapter-type advance instruction
  const advanceInstruction = arcPosition ? CHAPTER_TYPE_ADVANCE[arcPosition] : undefined;
  if (advanceInstruction) {
    lines.push(`\n⚠ THIS CHAPTER'S REQUIRED ADVANCE (${arcPosition}): ${advanceInstruction}`);
  }

  if (typeof state.continuityTail === 'string' && state.continuityTail.trim().length > 0) {
    const continuityTail = sanitizeContinuityTailForPrompt(state.continuityTail);
    const excerpt = continuityTail.length > 260
      ? `${continuityTail.slice(0, 260).trimEnd()}...`
      : continuityTail;
    lines.push(`\nCONTINUITY HANDOFF — previous chapter closing beat:`);
    lines.push(`  • "${excerpt}"`);
    lines.push('  • The next chapter must open as a continuation of this beat, not as a disconnected reset.');
  }

  // Layer 2 (recency): DEAD CHARACTER block last — closest to the generation instruction
  if (victimName && (!arcPosition || arcPosition !== 'opening')) {
    const vName = victimName;
    lines.push(`\n⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:`);
    lines.push(`• ${vName}: murdered before Chapter 1. In ALL chapters from here on:`);
    lines.push(`  - Refer to them ONLY in past tense, only as the victim of the crime`);
    lines.push(`  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react`);
    lines.push(`  - NEVER describe them as present at any scene, conversation, or confrontation`);
    lines.push(`  - WRONG: "${vName} crossed the room" / "${vName} sat on the sofa" / "${vName} nodded"`);
    lines.push(`  - WRONG: "${vName} gave testimony" / "${vName} asked what had happened"`);
    lines.push(`  - CORRECT: "${vName} had often said..." / "${vName}'s effects were found" / "witnesses recalled ${vName}'s habit of..."`);
  }

  // Fix-2: Identity stability lock — post-reveal zone. Prohibit role alias terms after
  // the culprit has been arrested or confessed. Fires for the final 20–30% of the story
  // (pre_climax, climax, resolution arc positions) where the narrative-continuity
  // validator's ROLE_ALIAS_TERMS regex fires on phrases like "the killer"/"the murderer".
  if (arcPosition === 'pre_climax' || arcPosition === 'climax' || arcPosition === 'resolution') {
    lines.push('\n⛔ IDENTITY STABILITY — post-reveal zone:');
    lines.push('If the culprit has been arrested or confessed in any prior chapter, NEVER use role aliases in narrative prose:');
    lines.push('  FORBIDDEN (narrator voice): "the killer", "the murderer", "the culprit", "the criminal", "the guilty party"');
    lines.push('  REQUIRED: use the character\'s actual name (first name or full name) every time.');
    lines.push('  Exception: a character\'s spoken dialogue may contain these terms — the ban applies to narrator voice only.');
  }

  lines.push('═══════════════════════════════════════════════════════');
  return lines.join('\n');
}

// ─── PHASE 1 (ANALYSIS_16) ────────────────────────────────────────────────
// Dedicated pronoun_accuracy prompt block with 9-rule continuity contract.
// All PHASE 1 changes are tagged [PHASE 1] below.
//
// To revert Phase 1 in full:
//   1. Delete buildPronounAccuracyBlock() function (below)
//   2. Remove `pronounAccuracyBlock: string` from PromptSectionInputs
//   3. Remove `pronoun_accuracy: 400` from perBlockTokenCap
//   4. Remove `{ key: 'pronoun_accuracy', ... }` from buildPromptContextBlocks orderedSections
//   5. Remove `characterPronouns?` parameter from buildWorldBriefBlock (and the pronounsLabel line inside)
//   6. Revert buildWorldBriefBlock call site to 3-arg form (drop last arg)
//   7. Delete `const pronounAccuracyBlock = buildPronounAccuracyBlock(cast)` assignment
//   8. Remove `pronounAccuracyBlock,` from the buildPromptContextBlocks({...}) call
//   9. Restore old Rule 2 (pronoun list) inside characterConsistencyRules
// ─────────────────────────────────────────────────────────────────────────
/**
 * Builds a dedicated PRONOUN ACCURACY block with a 9-rule continuity contract.
 * Inserted at position 0 (before character_consistency) so pronoun rules have
 * the highest priority ordering in every prose prompt.
 */


export const buildPromptContextBlocks = (sections: PromptSectionInputs): PromptContextBlock[] => {
  const orderedSections: Array<{ key: string; priority: PromptBlockPriority; content: string }> = [
    { key: 'character_consistency', content: `\n\n${sections.characterConsistencyRules}`, priority: 'critical' },
    { key: 'first_appearance_contracts', content: sections.firstAppearanceContractsBlock, priority: 'critical' },
    { key: 'character_pressure_contract', content: sections.characterPressureContractBlock, priority: 'critical' },
    { key: 'setting_refinement', content: sections.settingRefinementBlock, priority: 'high' },
    { key: 'background_context', content: sections.backgroundContextBlock, priority: 'medium' },
    { key: 'world_document', content: sections.worldDocumentBlock, priority: 'high' },
    { key: 'fair_play_contract', content: sections.fairPlayContractBlock, priority: 'critical' },
    { key: 'character_personality', content: sections.characterPersonalityContext, priority: 'high' },
    { key: 'character_contracts', content: sections.characterContractsBlock, priority: 'high' },
    { key: 'physical_plausibility', content: `\n\n${sections.physicalPlausibilityRules}`, priority: 'high' },
    { key: 'era_authenticity', content: sections.eraAuthenticityRules, priority: 'high' },
    { key: 'location_profiles', content: sections.locationProfilesContext, priority: 'medium' },
    { key: 'texture_pool', content: sections.texturePoolBlock ?? '', priority: 'medium' },
    { key: 'temporal_context', content: sections.temporalContextBlock, priority: 'high' }, // Fix A1: temporal consistency promoted from medium
    { key: 'locked_facts', content: sections.lockedFactsBlock, priority: 'critical' },
    { key: 'clue_descriptions', content: sections.clueDescriptionBlock, priority: 'critical' },
    { key: 'narrative_state', content: sections.nsdBlock, priority: 'critical' },
    { key: 'continuity_context', content: sections.continuityBlock, priority: 'medium' },
    { key: 'discriminating_test', content: sections.discriminatingTestBlock, priority: 'critical' },
    { key: 'humour_guide', content: sections.humourGuideBlock, priority: 'optional' },
    { key: 'craft_guide', content: sections.craftGuideBlock, priority: 'high' }, // Fix D2: craft guide promoted from optional
    { key: 'scene_grounding', content: sections.sceneGroundingChecklist, priority: 'critical' },
    { key: 'provisional_scoring_feedback', content: sections.provisionalScoringFeedbackBlock, priority: 'critical' },
    { key: 'pronoun_accuracy', content: sections.pronounAccuracyBlock, priority: 'critical' }, // recency fix: moved from position 0 to last
  ];

  return orderedSections
    .filter((section) => section.content.trim().length > 0)
    .map((section) => ({ key: section.key, content: section.content, priority: section.priority }));
};

export const estimateTokenCount = (value: string): number => {
  if (!value) return 0;
  return Math.ceil(value.length / 4);
};

export const truncateToTokenBudget = (value: string, maxTokens: number): string => {
  if (!value || maxTokens <= 0) return '';
  const maxChars = maxTokens * 4;
  if (value.length <= maxChars) return value;
  const truncated = value.slice(0, Math.max(0, maxChars - 24)).trimEnd();
  return `${truncated}\n[truncated for prompt budget]`;
};

export const applyPromptBudgeting = (
  baseSystem: string,
  developer: string,
  user: string,
  blocks: PromptContextBlock[],
  budgetTokens: number,
): { composedSystem: string; droppedBlocks: string[]; truncatedBlocks: string[] } => {
  const fixedTokens = estimateTokenCount(baseSystem) + estimateTokenCount(developer) + estimateTokenCount(user);
  const availableForBlocks = Math.max(0, budgetTokens - fixedTokens);

  const perBlockTokenCap: Partial<Record<string, number>> = {
    pronoun_accuracy: 700, // [PHASE 1] — raised from 400: 8 rules + table for ~12-char cast ≈ 560 tokens; 400 truncated rules 5-9
    first_appearance_contracts: 650, // First-appearance suspect intro obligations for newly introduced cast members
    character_pressure_contract: 520, // Post-Ch1 character-pressure obligations and pass/fail criteria
    setting_refinement: 700,   // ~4 paragraphs of era-level setting guidance; 700 prevents mid-paragraph cut
    background_context: 450,   // short cast/motive synopsis — typically 300-400 tokens; 450 gives margin
    fair_play_contract: 1100,  // P2-19: raised from 700 to accommodate fairPlayGuardrails merged in (~4×~100 tokens)
    character_personality: 1400, // raised from 900: physicalMannerisms + privateLonging + motiveSeed add ~150 tokens per character
    location_profiles: 1000,   // primary + keyLocations + sensory palette; 1000 fits 3-4 locations with sensory detail
    texture_pool: 600,          // rotating atmosphere atoms; 600 fits ~8-10 atoms at ~60 tokens each
    temporal_context: 850,      // season + era + weather + cultural notes; 850 fits a full temporal profile
    continuity_context: 500,    // chapter-summary + recurring-phrase list; compact by design
    humour_guide: 850,          // full humour guidelines page; 850 matches craft_guide budget
    craft_guide: 850,           // emotional-depth guidelines page; 850 tested empirically against full content
  };

  const truncatedBlocks: string[] = [];
  let workingBlocks = blocks
    .filter((block) => block.content.trim().length > 0)
    .map((block) => {
      const maxTokens = perBlockTokenCap[block.key];
      if (!maxTokens) return block;
      const originalTokens = estimateTokenCount(block.content);
      if (originalTokens <= maxTokens) return block;
      truncatedBlocks.push(block.key);
      return {
        ...block,
        content: truncateToTokenBudget(block.content, maxTokens),
      };
    });

  const computeBlockTokens = () => workingBlocks.reduce((sum, block) => sum + estimateTokenCount(block.content), 0);
  let blockTokens = computeBlockTokens();
  const droppedBlocks: string[] = [];

  // Deterministic drop order: optional -> medium -> high (critical never dropped).
  const dropOrder: PromptBlockPriority[] = ["optional", "medium", "high"];
  for (const priority of dropOrder) {
    if (blockTokens <= availableForBlocks) break;
    const candidates = workingBlocks.filter((block) => block.priority === priority);
    for (const block of candidates) {
      if (blockTokens <= availableForBlocks) break;
      droppedBlocks.push(block.key);
      blockTokens -= estimateTokenCount(block.content);
      workingBlocks = workingBlocks.filter((entry) => entry.key !== block.key);
    }
  }

  const composedSystem =
    baseSystem +
    workingBlocks.map((block) => block.content).join('') +
    `\n\nPROMPT BUDGET SUMMARY: budget=${budgetTokens} tokens; fixed=${fixedTokens}; context=${blockTokens}; dropped=[${droppedBlocks.join(', ') || 'none'}]; truncated=[${truncatedBlocks.join(', ') || 'none'}]` +
    `\n\n${developer}`;

  return { composedSystem, droppedBlocks, truncatedBlocks };
};

/**
 * Strip raw prose paragraph arrays from location profiles before injecting into context.
 * Prevents the LLM from transcribing pre-written prose blocks verbatim (context leakage).
 * Keeps all structural data: names, types, purpose, sensoryDetails, atmosphere.
 */

export const buildProsePrompt = (
  inputs: ProseGenerationInputs,
  scenesOverride?: unknown[],
  chapterStart = 1,
  chapterSummaries: ChapterSummary[] = [],
  priorChapters: ProseChapter[] = [],
) => {
  const { outline, targetLength = "medium", narrativeStyle = "classic" } = inputs;
  const outlineActs = Array.isArray(outline.acts) ? outline.acts : [];
  const scenes = Array.isArray(scenesOverride)
    ? scenesOverride
    : outlineActs.flatMap((act) => (Array.isArray(act.scenes) ? act.scenes : []));
  // P1-1: All scenes from the outline (not just this batch) — needed to compute per-act
  // scene numbers for clue/clearance matching (CML uses per-act, outline uses global).
  const allOutlineScenes = outlineActs.flatMap((act) => Array.isArray(act.scenes) ? act.scenes : []);

  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const era = cmlCase.meta?.era?.decade ?? "Unknown era";
  const cast = Array.isArray((inputs.cast as any)?.characters)
    ? (inputs.cast as any).characters
    : [];

  // [PHASE 3] Build identity map and narrative voice declaration
  const identityMap = buildIdentityMap(cast);
  const povChar = cast.find((c: any) =>
    (typeof c.role_archetype === 'string' && c.role_archetype.toLowerCase().includes('detective')) ||
    (typeof c.role === 'string' && c.role.toLowerCase().includes('detective'))
  );
  const narrativeVoiceLine = povChar
    ? `NARRATIVE VOICE: ${tagCharacter(povChar.name, identityMap)} is the viewpoint character. ` +
      `Unanchored “she/her” or “he/him” without a nearby name refers to ${povChar.name}. ` +
      `Default narrator pronoun: ${identityMap.get(povChar.name) ?? 'SHE'}. ` +
      `Never default to “he/his” as the neutral narrator voice unless the POV character is male.\n\n`
    : '';

  // §1.6: Compute active character names (characters present in any scene in this batch)
  // Used to filter portraits, voice sketches, and personality blocks to reduce token cost.
  const activeCharacterNames = new Set<string>(
    (scenes as any[]).flatMap((s: any) =>
      Array.isArray(s.characters) ? (s.characters as string[]) : [],
    ),
  );
  // BLUE-5: Suppress victim from active character set — victim personality/profile should not
  // be injected as a living character contract after their death is established.
  const activeFilterVictimName = resolveVictimName(inputs.cast);
  if (activeFilterVictimName) activeCharacterNames.delete(activeFilterVictimName);

  // §3.1/3.2/3.4: Compute arc position, build asset library, and derive texture pool
  const proseArcPosition = (() => {
    const ci = chapterStart - 1;
    const tc = (outline as any)?.totalScenes ?? scenes.length;
    return ci <= 1 ? 'opening'
      : ci <= Math.floor(tc * 0.25) ? 'early'
      : ci <= Math.floor(tc * 0.4) ? 'first_turn'
      : ci <= Math.floor(tc * 0.55) ? 'mid'
      : ci <= Math.floor(tc * 0.7) ? 'second_turn'
      : ci <= Math.floor(tc * 0.8) ? 'pre_climax'
      : ci === tc - 1 ? 'resolution'
      : 'climax';
  })();
  const assetLibrary: AssetLibrary = buildAssetLibrary(
    inputs.worldDocument,
    inputs.characterProfiles,
    inputs.locationProfiles,
    inputs.temporalContext,
  );
  const assetDeployedAssets: Record<string, number[]> = inputs.narrativeState?.deployedAssets ?? {};
  const { obligationAtoms: selectedObligationAtoms, textureAtoms } = selectChapterAtoms(
    assetLibrary,
    activeCharacterNames.size > 0 ? activeCharacterNames : new Set<string>(),
    new Set<string>(),
    assetDeployedAssets,
    proseArcPosition,
  );
  const textureAtomsForPrompt = textureAtoms.slice(0, 10);
  const textureAtomIds = textureAtomsForPrompt.map((a) => a.id);
  // Only stamp obligations we know are injected via the character context path.
  // Story/window atoms selected here are not guaranteed to be emitted every batch.
  const selectedObligationAtomIds = selectedObligationAtoms
    .filter((a) => a.scope === 'character')
    .map((a) => a.id);
  const texturePoolBlock = textureAtomsForPrompt.length > 0
    ? `\n\n## Texture Pool\nDraw on these as opportunities arise — you are not required to use them.\n\n` +
      textureAtomsForPrompt.map((a) => `- ${a.content}`).join('\n')
    : '';
  // §3.3b: Pre-compute sensory variants per chapter for obligation injection
  const sensoryVariantsByChapter: Record<number, any> = {};
  if (Array.isArray(scenesOverride) && inputs.locationProfiles) {
    const locProfiles = stripLocationParagraphs(inputs.locationProfiles);
    (scenesOverride as any[]).forEach((scene, idx) => {
      const chapterNum = chapterStart + idx;
      const sceneSettingObj = (scene as any).setting;
      const sceneSetting = (typeof sceneSettingObj?.location === 'string' ? sceneSettingObj.location : '').toLowerCase();
      const sceneTimeOfDay = typeof sceneSettingObj?.timeOfDay === 'string' ? sceneSettingObj.timeOfDay : '';
      const sceneWeather = typeof sceneSettingObj?.atmosphere === 'string' ? sceneSettingObj.atmosphere : '';
      const matchedLocation = ((locProfiles.keyLocations ?? []) as any[]).find((kl: any) =>
        (kl.id && sceneSetting.includes(kl.id.toLowerCase())) ||
        (kl.name && sceneSetting.includes(kl.name.toLowerCase()))
      );
      if (matchedLocation?.sensoryVariants?.length > 0) {
        const locationKey: string = matchedLocation.id ?? matchedLocation.name ?? '';
        const lastUsed = inputs.narrativeState?.lastUsedSensoryVariant?.[locationKey];
        const variant = selectSensoryVariant(
          matchedLocation.sensoryVariants,
          chapterNum - 1,
          lastUsed,
          { timeOfDay: sceneTimeOfDay, weather: sceneWeather },
        );
        if (variant) sensoryVariantsByChapter[chapterNum] = variant;
      }
    });
  }

  // Derive victim name for guardrail injection
  const proseVictimName = resolveVictimName(inputs.cast);
  const firstAppearanceContractsBlock = buildFirstAppearanceContractsBlock(
    inputs.caseData,
    inputs.cast,
    scenes as any[],
    chapterSummaries,
    priorChapters,
  );
  const victimIdentityRule = proseVictimName
    ? proseArcPosition === 'opening'
      ? `- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is ${proseVictimName}. Name them — ${proseVictimName} — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.`
      : `- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): ${proseVictimName} is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When ${proseVictimName} is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: \`${proseVictimName} said, "…"\` / \`${proseVictimName} turned to him\`. RIGHT: \`${proseVictimName} had said, weeks before, that…\` / \`Agnes remembered how ${proseVictimName} used to…\`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names ${proseVictimName} beside an action or speech verb. A live dialogue tag or present action for ${proseVictimName} is a continuity failure that will be rejected and regenerated.`
    : '';

  const system = `${narrativeVoiceLine}You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: ${cast.map((c: any) => { const g = c.gender?.toLowerCase(); const label = g === 'female' ? 'woman' : g === 'male' ? 'man' : ''; const isVictim = isVictimArchetype(c.role ?? c.roleArchetype); const baseName = label ? `${c.name} (${label})` : c.name; return isVictim ? `${baseName} — DECEASED, past-tense only` : baseName; }).join(', ')}.
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: ${cast.map((c: any) => c.name).join(', ')}?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.
⚠️ BEFORE YOU WRITE each chapter, also ask yourself: "Am I using the correct pronouns for every character — she/her for women, he/him for men?" If not, correct it before writing a single word.
⛔ GENDER IS NON-NEGOTIABLE: The gender of every character is shown above. Use the correct pronouns at all times — a woman is always she/her, a man is always he/him. Never swap, default, or guess.

Rules:
- Do not introduce new facts beyond the CML and outline.
- Preserve all clues, alibis, and the core mystery logic.
- Maintain strict setting fidelity to the specified location and era.
- Write immersive, sensory-rich prose that transports readers to the setting
- Include scene-setting passages that establish atmosphere, time, and place
- Use varied sentence structure and sophisticated vocabulary
- Show character emotions through actions and dialogue, not just telling
- Create distinct character voices and personalities based on their profiles
- ⛔ ANTI-EXPOSITORY DIALOGUE (ROADMAP_TO_80 M3 — HIGH PRIORITY): No character may state evidence, an alibi, a timeline, or a clearance as a flat report. Dialogue must carry SUBTEXT — characters deflect, evade, hedge, imply, or push back; the investigator INFERS what is not said. A line that exists only to relay a fact the reader needs is forbidden: route that fact to narration or have a character resist/qualify it. Each speaking character must sound distinct (diction, rhythm, what they avoid) — a reader should attribute a line without its tag. Replace "I was in the kitchen at eleven, the cook will confirm" with evasion under pressure that the inspector must read.
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. If a sensory phrase (e.g., "air thick with tension", "smell of polished wood") has appeared in any prior chapter, rephrase it entirely. No atmospheric sentence should appear verbatim or near-verbatim in more than one chapter.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation". Rewrite any scaffold-like sentence into chapter-specific prose tied to character action.
- TEMPLATE PRECONDITION (STRICT): Before returning JSON, self-check every paragraph for reused scaffold patterns and high-overlap phrasing from prior chapters. If any paragraph resembles template scaffold language, DISCARD that paragraph and rewrite it from a different sentence skeleton before output. Do not return until all paragraphs pass this precondition.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
${inputs.moralAmbiguityNote ? `- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "${inputs.moralAmbiguityNote}" — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.` : '- MORAL COMPLEXITY: When writing the denouement, include at least one detail that complicates the moral verdict — a motive the reader can understand, a consequence that feels unjust, or a relationship that can never recover.'}
${inputs.mechanismEnvironmentException ? `- ${inputs.mechanismEnvironmentException}` : ''}
- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
${victimIdentityRule}`;

  // [PHASE 1] Rule 2 (per-character pronoun list + 'Never switch pronouns mid-story') removed from
  // characterConsistencyRules — it is now covered exclusively by the pronounAccuracyBlock above.
  // Pre-Phase-1 Rule 2 was:
  //   "2. Gender pronouns must match character definition:\n   - Name: he/him/his ...\n   - Never switch pronouns mid-story"
  // Old Rule 3 (character roles) has been renumbered to Rule 2.
  const characterConsistencyRules = `\nCRITICAL CHARACTER CONSISTENCY RULES:\n\n1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.\n   COMPLETE CAST (no other named characters exist): ${cast.map((c: any) => isVictimArchetype(c.role ?? c.roleArchetype) ? `${c.name} (DECEASED)` : c.name).join(', ')}\n   - "Mr. Jennings entered the room" \u2192 ILLEGAL. Jennings is not in the cast.\n   - "Constable Reed took notes" \u2192 ILLEGAL. Reed is not in the cast.\n   - "A constable took notes" \u2192 LEGAL (no name given).\n\n2. Character roles are fixed:\n${cast.map((c: any) => `   - ${c.name}: ${isVictimArchetype(c.role ?? c.roleArchetype) ? 'victim (DECEASED \u2014 does not appear in any scene, past tense only)' : c.roleArchetype || c.role || 'character'}`).join('\n')}\n   - Never place characters in locations inconsistent with their role`;

  const pronounAccuracyBlock = buildPronounAccuracyBlock(cast); // [PHASE 1]

  // §1.6: Character personality block (extracted — see buildCharacterPersonalityBlock above)
  const characterPersonalityContext = buildCharacterPersonalityBlock(
    inputs.characterProfiles,
    inputs.cast,
    activeCharacterNames.size > 0 ? activeCharacterNames : undefined,
    Object.keys(assetLibrary).length > 0 ? assetLibrary : undefined,
    assetDeployedAssets, // always pass — empty {} is valid (chapter 1 has no prior deployments)
    proseArcPosition,
  );

  // Pillar 2: Character Contracts block — scene-specific voice/behaviour contracts
  const sceneActNumbers = (scenes as any[]).map((s) => Number(s.act ?? 2));
  const dominantAct = sceneActNumbers.length > 0
    ? Math.round(sceneActNumbers.reduce((a, b) => a + b, 0) / sceneActNumbers.length)
    : 2;
  const characterContractsBlock = buildCharacterContractsBlock(
    inputs.characterBundle,
    activeCharacterNames.size > 0 ? activeCharacterNames : undefined,
    dominantAct,
    identityMap,
  );

  const physicalPlausibilityRules = `\nPHYSICAL PLAUSIBILITY REQUIREMENTS:\n\nAll physical evidence must obey real-world physics:\n\n1. VIABLE Evidence by Location:\n   Interior: fingerprints, torn fabric, overturned furniture, blood spatter, documents\n   Exterior (calm): secured items, structural damage, witness observations\n   Exterior (storm): NO trace evidence survives - use only structural damage or interior evidence\n\n2. IMPLAUSIBLE Evidence (DO NOT USE):\n   ❌ Footprints on wooden deck (treated wood doesn't retain prints)\n   ❌ Footprints in rain/storm (washed away immediately)\n   ❌ Metal embedded in hardwood (requires bullet velocity, not human force)\n   ❌ Light objects in storm (blown away)\n\n3. For struggle evidence use:\n   ✓ Overturned furniture, torn clothing, scattered items, defensive wounds\n   ❌ Objects embedded in hard surfaces, shattered steel/iron`;

  const eraAuthenticityRules = era !== "Unknown era" ? `\nERA AUTHENTICITY (${era}):\n\n1. FORBIDDEN terms (did not exist):\n   ${era === '1950s' ? '❌ cell phone, internet, email, computer, GPS, digital camera, text message, app, online' : '❌ Modern technology'}\n\n2. REQUIRED period markers (include 2+ per scene):\n   ✓ Formal address: Mr./Mrs./Miss/Dr./Sir/Lady\n   ✓ Period technology: ${era === '1950s' ? 'telephone, telegram, radio, typewriter' : 'period-appropriate items'}\n   ✓ Fashion: ${era === '1950s' ? 'gloves, hats, formal suits, stockings' : 'period clothing'}\n\n3. Use period-authentic language and social norms` : '';

  // §1.6: Location profiles block (extracted — see buildLocationProfilesBlock above)
  const locationProfilesContext = buildLocationProfilesBlock(
    inputs.locationProfiles,
    scenesOverride,
    chapterStart,
    inputs.narrativeState?.lastUsedSensoryVariant,
  );

  // §1.6: Temporal context block (extracted — see buildTemporalContextBlock above)
  const temporalContextBlock = buildTemporalContextBlock(inputs.temporalContext);
  const settingRefinementBlock = buildSettingRefinementBlock(inputs.caseData);
  const backgroundContextBlock = buildBackgroundContextBlock(inputs.caseData);
  const fairPlayContractBlock = buildFairPlayContractBlock(inputs.caseData);


  // Build continuity context from chapter 2 onwards (character names, setting terms from earlier chapters)
  let continuityBlock = '';
  if (chapterSummaries.length > 0) {
    // P1.3 (default-off, AGENT9_BIBLE_AUTHORITATIVE): dereference the true-time anchor from the case
    // ground truth (storyContract crime-time anchors, else an atomic locked-fact time) instead of
    // scraping it from generated prose. Default undefined → today's scrape.
    let lockedTimeAnchor: string | undefined;
    if (process.env.AGENT9_BIBLE_AUTHORITATIVE === 'true' || process.env.AGENT9_BIBLE_AUTHORITATIVE === '1') {
      const anchorFromContract = (inputs.storyContract as any)?.crimeTimeAnchors?.find?.((a: unknown) => String(a ?? '').trim());
      const anchorFromFacts = (inputs.lockedFacts ?? [])
        .map((f) => String(f?.value ?? '').trim())
        .find((v) => isAtomicLockedFactValue(v) && /\b(?:past|to|after|before|o'clock|:|midnight|noon)\b/i.test(v));
      lockedTimeAnchor = (String(anchorFromContract ?? '').trim() || anchorFromFacts) || undefined;
    }
    continuityBlock = buildContinuityContext(chapterSummaries, chapterStart, lockedTimeAnchor);
  }

  const storyToDateBlock = buildStoryToDateBlock(priorChapters, chapterStart);

  // Build discriminating test checklist only for the chapter batch that actually contains
  // the discriminating test scene. Previously this was injected into every chapter past
  // the 70% threshold, wasting tokens and creating ambiguity about which chapter must
  // deliver the test. Now we check whether any scene in this batch matches dtScene.
  let discriminatingTestBlock = '';
  const chapterEnd = chapterStart + scenes.length - 1;
  const totalScenes = (outline as any)?.totalScenes ?? scenes.length;
  const dtSceneCheck = cmlCase.prose_requirements?.discriminating_test_scene;
  const isDiscriminatingTestBatch = dtSceneCheck
    ? (scenes as any[]).some(
        (s) => sceneMatchesCmlSceneRef(
          s,
          dtSceneCheck,
          allOutlineScenes,
          /\b(discriminating|test|controlled comparison|trap|prove|disprove)/i,
        ),
      )
    : chapterEnd >= Math.ceil(totalScenes * 0.70); // fallback: old threshold behaviour
  if (isDiscriminatingTestBatch) {
    const chapterRange = `${chapterStart}-${chapterEnd}`;
    discriminatingTestBlock = buildDiscriminatingTestChecklist(inputs.caseData, chapterRange, inputs.outline, totalScenes);
  }

  // Build locked facts block — ground truth physical evidence values the prose must never contradict
  let lockedFactsBlock = '';
  if (inputs.lockedFacts && inputs.lockedFacts.length > 0) {
    // Phase 3: detect word-form time values and generate forbidden alternative phrasings
    const WORD_NUM_MAP: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
      nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
      fifteen: 15, twenty: 20, 'twenty-five': 25, thirty: 30, 'thirty-five': 35,
      forty: 40, 'forty-five': 45, fifty: 50, 'fifty-five': 55,
    };
    const NUM_WORD_MAP = Object.fromEntries(Object.entries(WORD_NUM_MAP).map(([k, v]) => [v, k]));
    const isWordFormTimeValue = (v: string): boolean =>
      /\b(past|to|o[\u2019']clock|quarter|half)\b/i.test(v);
    const getForbiddenTimeForms = (v: string): string[] => {
      const lower = v.toLowerCase().trim();
      const forbidden: string[] = [];
      // Parse "X minutes past Y" or "X past Y"
      const pastMatch = lower.match(/^([\w-]+)\s+(?:minutes?\s+)?past\s+([\w-]+)$/);
      const toMatch = lower.match(/^([\w-]+)\s+(?:minutes?\s+)?to\s+([\w-]+)$/);
      const oclockMatch = lower.match(/^([\w-]+)\s+o[\u2019']clock$/);
      let h: number | undefined, m: number | undefined;
      if (pastMatch) {
        m = WORD_NUM_MAP[pastMatch[1]] ?? (pastMatch[1] === 'quarter' ? 15 : pastMatch[1] === 'half' ? 30 : undefined);
        h = WORD_NUM_MAP[pastMatch[2]];
      } else if (toMatch) {
        const rawM = WORD_NUM_MAP[toMatch[1]];
        const rawH = WORD_NUM_MAP[toMatch[2]];
        if (rawM != null && rawH != null) { h = rawH === 1 ? 12 : rawH - 1; m = 60 - rawM; }
      } else if (oclockMatch) {
        h = WORD_NUM_MAP[oclockMatch[1]]; m = 0;
      }
      if (h != null && m != null) {
        const hWord = NUM_WORD_MAP[h] ?? String(h);
        const mPad = String(m).padStart(2, '0');
        forbidden.push(`${h}:${mPad}`, `${h}.${mPad}`); // digit forms
        if (m > 0) {
          const mWord = NUM_WORD_MAP[m];
          if (mWord) {
            forbidden.push(`${hWord} ${mWord}`, `${hWord}-${mWord}`); // plain word / hyphenated
            forbidden.push(`${hWord} past ${mWord}`); // wrong order
          }
          if (m !== 15) forbidden.push(`quarter past ${hWord}`);
          if (m !== 30) forbidden.push(`half past ${hWord}`);
        }
      }
      return forbidden.filter(f => f.toLowerCase() !== lower);
    };

    // A_57 D1: an ATOMIC value (time / number / measurement) MUST be reproduced verbatim — fidelity is
    // the whole point of the clue. A DESCRIPTIVE value (a weather log, a document's contents) must NOT be
    // forced verbatim: jamming a long exact clause mid-sentence is what produced the garbled apostrophe
    // splices ("drizzle'the groundskeeper's entry … skies"). Split them and surface descriptive facts as
    // "convey the meaning in your own words" so the model writes a clean, grammatical observation.
    const atomicFacts = inputs.lockedFacts.filter(f => isAtomicLockedFactValue(String(f.value ?? '')));
    const descriptiveFacts = inputs.lockedFacts.filter(f => !isAtomicLockedFactValue(String(f.value ?? '')));
    const factLines = atomicFacts
      .map(f => {
        let line = `  - ${f.description}: "${f.value}"`;
        if (isWordFormTimeValue(f.value)) {
          const forbidden = getForbiddenTimeForms(f.value);
          if (forbidden.length > 0) {
            line += `\n    ⛔ FORBIDDEN alternatives: ${forbidden.map(x => `"${x}"`).join(', ')} — the ONLY acceptable form is "${f.value}"`;
          }
        }
        return line;
      })
      .join('\n');
    const verbatimBlock = atomicFacts.length > 0
      ? `\n\nNON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):\nThe following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.\n\nFAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.\n\nCRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.\n\nLocked values:\n${factLines}\n\nIf a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.`
      : '';
    const descriptiveBlock = descriptiveFacts.length > 0
      ? `\n\nEVIDENCE TO CONVEY IN YOUR OWN WORDS (NOT verbatim): weave each of these descriptive facts into the chapter as a COMPLETE, GRAMMATICAL observation by a character — surface the MEANING, never copy the phrasing word-for-word, and NEVER splice two evidence phrases together with an apostrophe or run two clauses together without a sentence break. If a fact has no relevance to this chapter, omit it.\n${descriptiveFacts.map(f => `  - ${f.description}: ${f.value}`).join('\n')}`
      : '';
    // A_57 D2 — the "single canonical contradiction" contract. When two locked values are the staged/true
    // pair of the discriminating clue, a chapter that states BOTH as flat parallel truths reads as a clue
    // that "contradicts itself" (ChatGPT's biggest problem on run 09168377). Require them to surface AS ONE
    // contrast, never two standalone statements. The values stay verbatim (they are in the block above).
    const contradictionPair = findDiscriminatingContradictionPair(atomicFacts);
    // A_58 review: the pair is returned in registry order, which does NOT tell us which value is the
    // staged appearance vs the true state — so the instruction must stay order-neutral (a hardcoded
    // "the watch read VALUES[0], yet … VALUES[1]" example could invert staged/true). Let the model infer
    // which is which from the evidence; we only require the two to surface as ONE contrast, not two truths.
    const contradictionBlock = contradictionPair
      ? `\n\n⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "${contradictionPair.values[0]}" and "${contradictionPair.values[1]}" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.`
      : '';
    lockedFactsBlock = verbatimBlock + descriptiveBlock + contradictionBlock;
  }

  // Build NSD block (narrative state document) — style register and fact history
  // Phase 5: compute investigation log deterministically from clue distribution + clearance data
  const nsdInvestigationLog: { revealedClueDescs: string[]; clearedSuspects: { name: string; method: string }[]; unresolvedSuspects: string[] } | undefined = (() => {
    const revealedIds = inputs.narrativeState?.cluesRevealedToReader ?? [];
    if (revealedIds.length === 0 && !inputs.narrativeState) return undefined;
    const allClues = inputs.clueDistribution?.clues ?? [];
    const revealedClueDescs = revealedIds
      .map((id) => {
        const c = allClues.find((x: any) => x.id === id);
        if (!c) return id;
        // Reference label only — a short topic, never the full conclusory description.
        // Feeding the raw description here let the model lift an already-established clue's
        // analytical sentence back into later chapters (run_1d55f7c7 shipped these verbatim).
        // R-A (M0): disjoint key terms, not a consecutive phrase from the source.
        const src = String((c as any).pointsTo ?? c.description ?? id);
        return surfaceSpecKeyTerms(src, 6) || id;
      })
      .filter(Boolean);
    const clearanceScenes = (cmlCase?.prose_requirements?.suspect_clearance_scenes ?? []) as any[];
    const clearedSuspects = clearanceScenes
      .filter((s: any) => {
        const globalChapterNum = resolveCmlSceneRefChapterNumber(
          s,
          allOutlineScenes,
          0,
          /\b(clear|cleared|clearance|alibi|ruled out|eliminat)/i,
        );
        return globalChapterNum < chapterStart;
      })
      .map((s: any) => ({ name: String(s.suspect_name ?? ''), method: String(s.clearance_method ?? '') }))
      .filter((s) => s.name);
    const allSuspects = (cmlCase?.cast ?? []) as any[];
    const culprits: string[] = (cmlCase?.culpability?.culprits ?? []) as string[];
    const clearedNames = new Set(clearedSuspects.map((s) => s.name));
    const unresolvedSuspects = allSuspects
      .filter((c: any) => {
        const role = String(c.role_archetype ?? c.role ?? '').toLowerCase();
        return !role.includes('detective') && !isVictimArchetype(role) && !culprits.includes(c.name) && !clearedNames.has(c.name);
      })
      .map((c: any) => String(c.name ?? ''))
      .filter(Boolean);
    return { revealedClueDescs, clearedSuspects, unresolvedSuspects };
  })();
  const nsdBlock = buildNSDBlock(inputs.narrativeState, proseVictimName || undefined, nsdInvestigationLog, proseArcPosition, identityMap, inputs.narrativeState?.beatHistory);

  // Build clue description block — injects full agent5 clue objects so prose agent knows
  // exactly what evidence to surface and how it should manifest for the reader.
  const clueDescriptionBlock = buildClueDescriptionBlock(scenes, inputs.clueDistribution, cmlCase);

  // Build humour guide block from writing guides
  let humourGuideBlock = '';
  if (inputs.writingGuides?.humour) {
    humourGuideBlock = '\n\nHUMOUR & WIT GUIDELINES (Golden Age Mystery Style):\n\n' +
      'Humour is STRUCTURAL, not decorative. Every humorous moment must serve at least one purpose: hide information, reveal character, control pacing, provide tonal contrast, expose social truth, or sharpen the final reveal.\n\n' +
      'TONE: Balance classical structure with modern-clean, restrained, irony-aware voice. Aim for crisp prose, controlled formality, mildly sharpened dryness. Think: polite language, ruthless implication.\n\n' +
      'APPROVED HUMOUR STYLES (use all of these naturally throughout):\n' +
      '1. UNDERSTATEMENT (primary tool) - Increase seriousness by pretending not to. Example: "The evening deteriorated somewhat after the stabbing."\n' +
      '2. DRY OBSERVATIONAL WIT - Draw humour from human behaviour. Example: "Everyone preferred harmony. This required extensive dishonesty."\n' +
      '3. POLITE SAVAGERY - Maintain civility while delivering verbal incision. Example: "He was devoted to principle," said the solicitor. "His own," said the detective.\n' +
      '4. CHARACTER-DRIVEN CONTRAST - Humour from personality friction (literal vs dramatic, pragmatic vs romantic, rigid vs modern). Never farce, always friction.\n' +
      '5. PRECISION CRUELTY (sparingly) - Short, exact, devastating. Example: "He had the moral backbone of warm custard." Use rarely for maximum impact.\n\n' +
      'ADVANCED TECHNIQUE - PUZZLE CAMOUFLAGE: Readers lower their analytical guard when amused. Hide key habits in jokes, plant timeline clues in sarcasm, mask technical details with mild mockery. The joke makes the fact feel harmless.\n\n' +
      'SOCIAL X-RAY: Use humour to expose class blindness, moral hypocrisy, gender expectations, inheritance absurdity, respectability theatre. Let irony reveal, not preach.\n\n' +
      'DETECTIVE VOICE: The detective should rarely laugh, occasionally observe, almost never banter. Deliver one devastatingly mild remark per major scene. Example: "I do not accuse you. I merely observe that facts appear less cooperative in your presence."\n\n' +
      'RHYTHM: Tension -> Dry remark -> Silence -> Investigation resumes. Never stack jokes. Never let humour dominate a scene. Small, controlled, regular infusions.\n\n' +
      'BALANCE: For every 3 pages of investigation, insert 1 understated observation. If readers would laugh loudly, it is too much. Aim for the quiet exhale through the nose.\n\n' +
      'RUNNING GAGS AS STRUCTURE: Introduce a recurring minor joke casually, repeat it, then make it central to the solution. Reader reaction: Amusement -> Recognition -> Admiration.\n\n' +
      'EMOTIONAL HUMOUR: Humour can mask vulnerability. Example: "He disliked arguments. They implied things might change." Modern emotional subtlety inside classical tone.\n\n' +
      'FORBIDDEN: Humour at the moment of corpse discovery, in physical description of the dead, during genuine grief, in the core logical explanation. No broad parody, no farce, no anachronistic sarcasm, no characters existing only for comic relief, no humour that weakens intellectual tension.\n\n' +
      'GUIDING PRINCIPLE: Do not try to be funny. Try to be exact. Exactness produces dryness. Dryness produces intelligence. Intelligence produces quiet amusement. Quiet amusement is the perfect companion to murder.';
  }


  // Build whodunnit craft guide block from writing guides
  let craftGuideBlock = '';
  if (inputs.writingGuides?.craft) {
    craftGuideBlock = '\n\nWHODUNNIT CRAFT GUIDELINES (Emotional Depth & Soul):\n\n' +
      'These principles ensure the mystery has emotional resonance, not just logical mechanics.\n\n' +
      '1. THE MURDER MUST MEAN SOMETHING: The death should destabilize emotional ecosystems. Show who loved the victim, who depended on them, who is secretly relieved. Use telling details ("Her coffee was still warm") rather than clinical statements ("The body was found at half past seven").\n\n' +
      '2. GIVE EVERY SUSPECT A WOUND: People kill because of shame, fear, love, desperation, pride, protection, or revenge. Beyond motive, give each suspect a private longing, a contradiction, a vulnerability unrelated to the crime. Readers should think: "I do not want it to be them."\n\n' +
      '3. THE DETECTIVE NEEDS A PERSONAL STAKE: The external mystery should echo an internal one. Perhaps they see themselves in the victim, the case mirrors a past failure, or they are avoiding something in their own life.\n\n' +
      '4. ADD MOMENTS THAT DO NOT ADVANCE THE PLOT: Include micro-moments that create texture: a suspect making tea too slowly, a trembling hand lighting a cigarette, someone staring too long at a family photo. These pauses make the story feel alive.\n\n' +
      '5. LET EMOTION LEAK INTO DIALOGUE: Avoid clinical information exchange. Write subtext-rich dialogue where characters do not always say what they mean. Example: "You think I would lie about that?" "I think people lie when they are scared." "I am not scared." "Your hands say otherwise."\n\n' +
      '6. RAISE MORAL COMPLEXITY: The most soulful mysteries make readers uncomfortable. What if the victim was not entirely good? What if the killer had a reason that almost makes sense? If the reader finishes thinking "I do not know how I feel about that," you have succeeded.\n\n' +
      '7. SENSORY ATMOSPHERE AS SOUL: Use recurring sensory anchors (the smell of lilies from the funeral, rain tapping like nervous fingers) to build mood. Atmosphere is not decoration; it is the story breathing.\n\n' +
      '8. LET SOMEONE BREAK: At least once, someone should crack: cry unexpectedly, laugh hysterically, confess something unrelated, admit they are tired. Emotion destabilizes the procedural rhythm and makes the story human.\n\n' +
      '9. MAKE THE REVEAL HURT: The best reveals do not just surprise; they wound. The reveal should recontextualize earlier tenderness, expose a betrayal, or force the detective to confront something personal. If the reveal only satisfies logic, it feels clinical. If it rearranges relationships, it feels human.';
  }

  const qualityGuardrails = Array.isArray(inputs.qualityGuardrails) ? inputs.qualityGuardrails : [];
  const rolloutFlagsRaw = (getGenerationParams().agent9_prose as any)?.rollout_flags;
  const rolloutFlags = {
    blue_sky_mode_enabled: rolloutFlagsRaw?.blue_sky_mode_enabled === true,
  };
  
  // P2-19: Fair-play guardrails are now part of buildFairPlayContractBlock so they go through
  // the token-budget system (fair_play_contract block, priority critical).  Only external
  // story-specific guardrails remain here.
  const allGuardrails = [...qualityGuardrails];
  if (rolloutFlags.blue_sky_mode_enabled) {
    allGuardrails.push(
      "BLUE-SKY MODE: prefer high-specificity scene invention over boilerplate transitions; each chapter must introduce one concrete, era-authentic detail that has not appeared in prior chapters.",
    );
  }
  // P2-23: Renamed from "QUALITY GUARDRAILS (MUST SATISFY)" — these are external story-specific
  // guidelines, not hard validation gates. Overusing MANDATORY/MUST SATISFY labels dilutes the
  // signal for the items that ARE hard-retried (atmosphere, clues, clearances).
  const qualityGuardrailBlock = allGuardrails.length > 0
    ? `\n\nQUALITY GUIDELINES (strongly preferred):\n${allGuardrails.map((rule, idx) => `${idx + 1}. ${rule}`).join("\n")}`
    : "";

  // Build prose requirements block for this chapter batch
  const proseRequirementsBlock = buildProseRequirements(inputs.caseData, scenes, allOutlineScenes);
  const sceneGroundingChecklist = buildSceneGroundingChecklist(scenes, inputs.locationProfiles, chapterStart);

  const worldDocumentBlock = buildWorldBriefBlock(
    inputs.worldDocument,
    chapterStart - 1,
    totalScenes,
    inputs.narrativeState?.characterPronouns,
    activeCharacterNames.size > 0 ? activeCharacterNames : undefined,
    inputs.narrativeState,
  ); // [PHASE 1]

  const provisionalScoringFeedbackBlock = formatProvisionalScoringFeedbackBlock(
    inputs.provisionalScoringFeedback,
    inputs.narrativeState?.recurringPhraseWarnings,
  );

  // Para-range bounds are derived from the hard floor and chapter target so the paragraph count
  // guidance always guarantees the hard floor (min) and reaches the preferred target (max),
  // regardless of config changes to hard_floor_relaxation_ratio or preferred_chapter_words.
  const _shortT = getChapterWordTargets("short");
  const _medT   = getChapterWordTargets("medium");
  const _longT  = getChapterWordTargets("long");
  const _shortPromptPreferred = getPromptPreferredWords("short");
  const _medPromptPreferred = getPromptPreferredWords("medium");
  const _longPromptPreferred = getPromptPreferredWords("long");
  const chapterWordGuidance: Record<string, string> = {
    short: `${Math.ceil(_shortT.hardFloorWords / 120)}-${Math.ceil(_shortPromptPreferred / 180) + 1} substantial paragraphs (each 120–180 words) — TARGET ≥ ${_shortPromptPreferred} words — do not stop early`,
    medium: `${Math.ceil(_medT.hardFloorWords / 150)}-${Math.ceil(_medPromptPreferred / 220) + 1} substantial paragraphs (each 150–220 words) — TARGET ≥ ${_medPromptPreferred} words — do not stop early`,
    long: `${Math.ceil(_longT.hardFloorWords / 180)}-${Math.ceil(_longPromptPreferred / 250) + 1} substantial paragraphs (each 180–250 words) — TARGET ≥ ${_longPromptPreferred} words — do not stop early`,
  };
  const chapterGuidance = chapterWordGuidance[targetLength] ?? chapterWordGuidance.medium;

  const chapterWordTargets = getChapterWordTargets(targetLength);
  const chapterPromptPreferredWords = getPromptPreferredWords(targetLength);
  const chapterTargetWords = chapterPromptPreferredWords;
  const temporalLock = deriveTemporalSeasonLock(inputs.temporalContext);
  const activeStageMode = resolveStageModeKey(
    chapterStart,
    chapterEnd,
    totalScenes,
    isDiscriminatingTestBatch,
    cmlCase,
    allOutlineScenes,
    scenes as any[],
  );
  const wordCountContract = [
    'WORD COUNT CONTRACT (NON-NEGOTIABLE):',
    `- Target: ${chapterTargetWords} words per chapter. Do not stop before reaching this threshold.`,
    '- Overshoot rather than undershoot. When in doubt, write one more paragraph.',
    '- Expand with concrete action beats, clue-linked dialogue, and sensory detail.',
    '- Never pad with recap, repeated atmosphere, or generic filler.',
  ].join('\n');
  const chapterObligationBlock = buildChapterObligationBlock(
    scenes,
    chapterStart,
    cmlCase,
    inputs.lockedFacts,
    temporalLock,
    inputs.clueDistribution,
    {
      targetWords: chapterTargetWords,
    },
    Object.keys(sensoryVariantsByChapter).length > 0 ? sensoryVariantsByChapter : undefined,
    inputs.narrativeState,
    proseArcPosition,
    inputs.worldDocument,
    inputs.macroArcPlan,
    allOutlineScenes,
    activeStageMode,
  );
  const timelineStateBlock = buildTimelineStateBlock(
    temporalLock,
    inputs.lockedFacts,
    cmlCase,
  );

  const developer = `# Prose Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "classic|modern|atmospheric",\n  "chapters": [\n    {\n      "title": "Chapter title",\n      "summary": "1-2 sentence summary",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]\n    }\n  ],\n  "cast": ["Name 1", "Name 2"],\n  "note": ""\n}\n\nRequirements:\n- Write exactly one chapter per outline scene (${scenes.length || "N"} total).\n- Chapter numbering starts at ${chapterStart} and increments by 1 per scene.\n- Each chapter has ${chapterGuidance}.\n- Use ${narrativeStyle} tone and ${targetLength} length guidance.\n- Reflect the outline summary in each chapter.\n- Keep all logic consistent with CML (no new facts).\n- Chapter title format: EVERY chapter title MUST follow exactly \"Chapter N: [Descriptive title]\" (e.g. \"Chapter 1: The Frozen Clock\"). Do NOT use number-only (\"Chapter 1\") or title-only (\"The Frozen Clock\") formats — mixed formats are a validation error.\n\nNOVEL-QUALITY PROSE REQUIREMENTS:\n\n1. SCENE-SETTING: Every chapter MUST open with the following in the FIRST TWO PARAGRAPHS — this is a VALIDATION REQUIREMENT and chapters that omit it are retried:\n   (a) 2+ sensory words from: smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim\n   (b) 1+ atmosphere/time word from: rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark\n   (c) A named location anchor from the setting profiles\n\n   Then establish time of day, weather, and lighting; describe the location using sensory details; set mood and atmosphere before advancing plot beats.\n   Example structure: "The <MONTH> <TIME> brought <WEATHER> to <LOCATION>. In the <ROOM>, <LIGHTING> while <SENSORY_DETAIL>. <CHARACTER>'s <OBJECT> <ACTION>."

   Generate new descriptions using actual location and character names from the provided profiles.\n\n2. SHOW, DON'T TELL: Use concrete details and actions\n   ❌ "She was nervous."\n   ✓ "Her fingers twisted the hem of her glove, the silk threatening to tear. A bead of perspiration traced down her temple despite the cool morning air."\n   - Body language reveals emotion\n   - Actions reveal character\n   - Environment reflects internal state\n\n3. VARIED SENTENCE STRUCTURE:\n   - Mix short, punchy sentences with longer, flowing ones\n   - Use sentence rhythm to control pacing\n   - Short sentences for tension, longer for description\n   - Paragraph variety: Some 2 lines, some 8 lines\n\n4. DIALOGUE THAT REVEALS CHARACTER:\n   - Each character has distinct speech patterns (see character profiles)\n   - Use dialogue tags sparingly (action beats instead)\n   - Subtext: characters don't always say what they mean\n   - Class/background affects vocabulary and formality\n   - Tension through what's NOT said\n   Example structure: "<DIALOGUE>," <CHARACTER> said, <ACTION_BEAT>.

   Use only character names from the provided cast list.\n\n5. SENSORY IMMERSION:\n   - Include multiple senses per scene (2-3 minimum)\n   - Period-specific sensory details from location/temporal profiles\n   - Tactile details create immediacy\n   - Use sensory palette provided in location profiles\n   - Vary sensory focus: visual → auditory → olfactory → tactile\n\n6. PARAGRAPH STRUCTURE:\n   - Opening: Hook with action, dialogue, or atmospheric detail\n   - Middle: Develop scene, reveal information, build tension\n   - Closing: End with revelation, question, or transition\n   - Each paragraph should advance story or deepen character\n\n7. PACING VARIATION:\n   - Action scenes: Short paragraphs (2-4 lines), quick succession\n   - Investigation scenes: Moderate length (4-6 lines), methodical rhythm\n   - Atmospheric scenes: Longer paragraphs (6-8 lines), detailed description\n   - Revelation scenes: Build slowly with long paragraphs, climax with short punch\n\n8. EMOTIONAL SUBTEXT & TENSION:\n   - Characters have hidden secrets/stakes (see character profiles)\n   - Every interaction carries subtext based on relationships\n   - Build tension through: pauses, interrupted speech, avoided topics, body language\n   - Mystery atmosphere: Suspicion, unease, watchfulness\n   - Use weather/atmosphere to mirror emotional tension${qualityGuardrailBlock}${proseRequirementsBlock}`;

  const developerWithAudit = developer.replace(
    '  "note": ""\n}\n\nRequirements:',
    '  "note": "",\n  "audit": {\n    "locked_fact_phrases": "present in paragraph N | absent",\n    "season_words_used": "list seasonal words used in this batch | none",\n    "discriminating_test_present": "yes: chapter N paragraph M | no",\n    "required_clues_present": "clue_id or description: chapter N paragraph M | absent",\n    "early_observation_present": "description: chapter N paragraph M (first 25%) | absent",\n    "early_inference_present": "yes: paragraph immediately following observation | no"\n  }\n}\n\nThe audit field is a self-check only. Fill it honestly. It will be stripped before storage.\n\nRequirements:',
  );

  // Amateur detective extra warning — LLM tends to invent police officers for unnamed official response
  const amateurPoliceWarning = inputs.detectiveType === 'amateur'
    ? `\n\n⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.`
    : '';

  const stageModeContractBlock = buildStageModeContractBlock(activeStageMode);
  const chapterOutcomeBlock = buildChapterOutcomeBlock(
    activeStageMode,
    chapterStart,
    chapterEnd,
    cmlCase,
    inputs.narrativeState,
    nsdInvestigationLog,
    scenes as any[],
  );
  const characterPressureContractBlock = buildPostChapterOneCharacterPressureBlock(chapterStart, chapterEnd);

  let developerWithContracts = developerWithAudit.replace(
    '\n\nNOVEL-QUALITY PROSE REQUIREMENTS:',
    `\n\n${wordCountContract}\n\nNOVEL-QUALITY PROSE REQUIREMENTS:`,
  ) + stageModeContractBlock + chapterOutcomeBlock;

  // P1.3: when the Agent 7 scheduler is authoritative, respect each scene's own budget (clamped to a
  // sane band) instead of flooring every chapter up to one uniform target. Default-OFF ⇒ unchanged.
  const schedulerAuthoritative = /^(1|true|yes|on)$/i.test(process.env.AGENT7_SCHEDULER_AUTHORITATIVE ?? '');

  // A_50 §9.3 #3 / A_52 item 4: honor the Agent 7 mechanism-reveal gate. Before the discriminating-test
  // scene, withhold the full HOW-it-was-done explanation (observable clues only); telegraphing it early
  // kills the reveal's surprise (judge: "the mechanism is explained too early"). The block self-gates on
  // the per-scene `mechanismRevealAllowed` flag — when no scene carries it (gate not stamped) both
  // branches are inert — so it no longer depends on the heavier scheduler-authority experiment.
  {
    const gateFlags = (scenes as any[]).map((s) => s?.mechanismRevealAllowed);
    const anyWithheld = gateFlags.some((f) => f === false);
    const anyReveal = gateFlags.some((f) => f === true);
    if (anyReveal && anyWithheld) {
      developerWithContracts +=
        `\n\nMECHANISM REVEAL GATE (reveal here): This chapter contains the discriminating test — this is where the full concealment mechanism is explained for the first time. Do not assume the reader was already told HOW the crime was concealed.`;
    } else if (anyWithheld) {
      developerWithContracts +=
        `\n\nMECHANISM REVEAL GATE (withhold): The discriminating test has NOT happened yet. Show observable clues, contradictions, and suspicions, but do NOT yet explain HOW the concealment mechanism actually works, and do not state outright that it was deliberately rigged — keep the method an open question. Reserve the full explanation for the discriminating-test chapter.`;
    }
  }
  const scenesWithAdjustedEstimates = sanitizeScenesCharacters(
    (scenes as any[]).map((scene) => ({
      ...scene,
      estimatedWordCount: resolveSceneWordBudget({
        sceneEstimate: typeof scene?.estimatedWordCount === 'number' ? scene.estimatedWordCount : undefined,
        chapterTargetWords,
        hardFloorWords: chapterWordTargets.hardFloorWords,
        authoritative: schedulerAuthoritative,
      }),
    })),
    cast.map((c: any) => c.name),
  );

  // Strip the murder victim from scene.characters in the user-prompt JSON for non-opening chapters.
  // The victim is dead — listing them as a scene participant contradicts the DEAD CHARACTER guardrail
  // and gives the prose LLM implicit permission to write them as alive. BLUE-5 already removes them
  // from activeCharacterNames (for contracts/personality blocks); this ensures the outline JSON agrees.
  const scenesForPrompt = (proseArcPosition !== 'opening' && proseVictimName)
    ? (scenesWithAdjustedEstimates as any[]).map((scene) => ({
        ...scene,
        characters: Array.isArray(scene.characters)
          ? scene.characters.filter((n: string) => n !== proseVictimName)
          : scene.characters,
      }))
    : scenesWithAdjustedEstimates;

  // Pillar 4 (Unit 4.3): build per-scene completeness contract block
  const completenessContractLines: string[] = [];
  if (inputs.enableOutlineCompleteness) {
    for (const scene of (scenesWithAdjustedEstimates as any[])) {
      const sceneLines: string[] = [];
      if (scene.pivotElement) {
        sceneLines.push(
          `  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "${scene.pivotElement}"`,
        );
      }
      if (scene.factEstablished) {
        sceneLines.push(
          `  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "${scene.factEstablished}"`,
        );
      }
      if (scene.redHerringPlacement && scene.redHerringPlacement.redHerringId) {
        sceneLines.push(
          `  RED HERRING (MANDATORY — seed naturally, not flagged as false): [${scene.redHerringPlacement.redHerringId}] ${scene.redHerringPlacement.placementDetail}`,
        );
      }
      if (sceneLines.length > 0) {
        completenessContractLines.push(
          `Chapter ${scene.sceneNumber} (Act ${scene.act}) completeness contract:`,
          ...sceneLines,
        );
      }
    }
  }
  const completenessContractBlock =
    completenessContractLines.length > 0
      ? `\n\n[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]\n${completenessContractLines.join("\n")}`
      : "";

  // Compact pronoun lock prepended to user message for maximum recency — placed
  // immediately before the scene outline so it is the last thing the model reads
  // before generating. The full 9-rule block is in the developer section (last position);
  // this compact header is a final per-character reminder.
  const compactPronounLines = cast
    .filter((c: any) => ['male', 'female'].includes(String(c.gender ?? '').toLowerCase()))
    .map((c: any) => {
      const isMale = String(c.gender).toLowerCase() === 'male';
      return `• ${c.name} — ${isMale ? 'he/him/his (NEVER she/her)' : 'she/her/her (NEVER he/him)'}`;
    });
  const compactPronounHeader = compactPronounLines.length > 0
    ? `⛔ PRONOUN LOCK (verify every sentence before writing):\n${compactPronounLines.join('\n')}\n\n`
    : '';

  const user = `Write the full prose following the outline scenes.\n\n${chapterObligationBlock}${chapterOutcomeBlock}${timelineStateBlock}${storyToDateBlock}${completenessContractBlock}\n\n${buildContextSummary(inputs.caseData, inputs.cast)}\n\n${compactPronounHeader}Outline scenes:\n${JSON.stringify(scenesForPrompt, null, 2)}`;

  const promptContextBlocks = buildPromptContextBlocks({
    pronounAccuracyBlock, // [PHASE 1]
    characterConsistencyRules,
    firstAppearanceContractsBlock,
    characterPressureContractBlock,
    settingRefinementBlock,
    backgroundContextBlock,
    fairPlayContractBlock,
    characterPersonalityContext,
    characterContractsBlock,
    physicalPlausibilityRules,
    eraAuthenticityRules,
    locationProfilesContext,
    temporalContextBlock,
    lockedFactsBlock,
    clueDescriptionBlock,
    nsdBlock,
    continuityBlock,
    discriminatingTestBlock,
    humourGuideBlock,
    craftGuideBlock,
    sceneGroundingChecklist,
    provisionalScoringFeedbackBlock,
    worldDocumentBlock,
    texturePoolBlock,
  });

  const baseSystem = `${system}${amateurPoliceWarning}`;
  // FIX 3: prose-prompt token ceiling. Lowering this engages the designed priority-based block
  // dropping (optional → medium → high; critical never dropped), trimming the heaviest prompts —
  // which both reduces retry-inducing over-constraint and cost. Tunable via env so it can be
  // dialled in empirically once the prose model tier is chosen (see model-tiers.ts). Default
  // lowered from 32000 to 24000.
  const prosePromptTokenCeiling = (() => {
    const raw = Number(process.env.AGENT9_PROMPT_TOKEN_CEILING);
    return Number.isFinite(raw) && raw >= 8000 ? raw : 24000;
  })();
  const { composedSystem } = applyPromptBudgeting(
    baseSystem,
    developerWithContracts,
    user,
    promptContextBlocks,
    prosePromptTokenCeiling,
  );
  let composedSystemWithAssetSelfReport = composedSystem;
  if (textureAtomIds.length > 0) {
    composedSystemWithAssetSelfReport +=
      `\n\n## Asset Self-Report (required)\n` +
      `At the very END of your response, after all prose, add a single line:\n` +
      `<used_assets>${textureAtomIds.join(',')}</used_assets>\n` +
      `Replace the list with only the IDs of texture assets you actually used. ` +
      `If you used none, output <used_assets></used_assets>.`;
  }

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: composedSystemWithAssetSelfReport },
    { role: "user", content: user },
  ];

  // Build early-placement clue checklist items from clueDistribution
  const earlyClueCheckItems: string[] = [];
  const clueMap = new Map<string, Clue>(
    (inputs.clueDistribution?.clues ?? []).map((c) => [c.id, c]),
  );
  (scenes as any[]).forEach((scene, idx) => {
    const chapterNumber = chapterStart + idx;
    const requiredClueIds = getRequiredClueIdsForScene(cmlCase, scene, allOutlineScenes);
    for (const clueId of requiredClueIds) {
      const clue = clueMap.get(clueId);
      if (clue?.placement === 'early') {
        // R-A leakage cure: surface key terms, never the full clue SENTENCE (the LLM copies it verbatim).
        earlyClueCheckItems.push(
          `□ Chapter ${chapterNumber}: the clue [${clue.id}] (${surfaceSpecKeyTerms(String(clue.description ?? ''))}) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.`,
        );
      } else if (!clue) {
        // Unresolved clue ID — check delivery_method from clue_to_scene_mapping for early placement
        const mappingEntry = ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
          .find((e: any) => String(e?.clue_id) === clueId && Number(e?.act_number) === 1);
        if (mappingEntry?.delivery_method) {
          earlyClueCheckItems.push(
            `□ Chapter ${chapterNumber}: "${mappingEntry.delivery_method.trim()}" [${clueId}] — place this observation in the first 25% of the chapter, followed immediately by an explicit inference or suspicion paragraph.`,
          );
        }
      }
    }
  });

  // Build a pronoun audit table so the model must enumerate the pronouns it used per
  // character rather than making a vague "I checked" assertion. This is stripped before
  // storage (like the `audit` field) — it exists only to force active self-review.
  // See ANALYSIS_24 Option C.
  const pronounAuditLines: string[] = [];
  // All characters in CML are binary-gendered (1930s–1950s Golden Age era).
  const castWithGender = cast.filter((c: any) => {
    const g = c.gender?.toLowerCase();
    return g === 'male' || g === 'female';
  });
  if (castWithGender.length > 0) {
    pronounAuditLines.push('□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.');
    pronounAuditLines.push('  Character            | Canonical     | Used in draft | Match?');
    pronounAuditLines.push('  ---------------------|---------------|---------------|-------');
    for (const c of castWithGender) {
      const g = (c.gender as string).toLowerCase();
      const canonical = g === 'female' ? 'she/her/her/herself' : 'he/him/his/himself';
      pronounAuditLines.push(`  ${c.name.padEnd(20)} | ${canonical.padEnd(25)} | [fill in]     | [yes/no]`);
    }
  }

  const checklistItems = [
    'BEFORE SUBMITTING YOUR JSON — verify this checklist:',
    `□ Each chapter reaches the hard floor of ${chapterWordTargets.hardFloorWords} words and aims for ${chapterTargetWords} words or more.`,
    '□ If you mention locked evidence, you used the exact locked phrase verbatim.',
    ...(temporalLock
      ? [
          `□ Allowed seasonal words only: ${getSeasonAllowList(temporalLock.season)}.`,
          `□ Forbidden seasonal words: ${['spring', 'summer', 'autumn', 'winter'].filter((s) => s !== temporalLock.season).join(', ')}.`,
        ]
      : []),
    ...earlyClueCheckItems,
    ...(inputs.narrativeState?.continuityTail?.trim()
      ? [
          '□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).',
        ]
      : []),
    ...(scenes.length > 1
      ? [
          '□ Each chapter opening after the first clearly hands off from the previous chapter ending; no hard resets between consecutive chapters.',
        ]
      : []),
    ...(chapterEnd > 1
      ? [
          '□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).',
          '□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).',
          '□ No post-Chapter-1 chapter contains static biography-only character paragraphs.',
        ]
      : []),
    ...buildModeSpecificChecklistItems(activeStageMode),
    ...pronounAuditLines,
    '□ Return valid JSON only.',
  ];
  messages.push({ role: 'user' as const, content: checklistItems.join('\n') });

  // E5: Capture section sizes (char count per block before budgeting)
  const sectionSizes: Record<string, number> = {};
  for (const block of promptContextBlocks) {
    sectionSizes[block.key] = block.content.length;
  }

  return {
    system,
    developer: developerWithContracts,
    user,
    messages,
    sectionSizes,
    selectedObligationAtomIds,
    textureAtomIds,
  };
};
