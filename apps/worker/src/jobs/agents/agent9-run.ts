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

import { dirname, join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import {
  buildAssetDiagnosticReport,
  buildAssetLibrary,
  checkNSDParity,
  generateProse,
  repairNameHygieneInChapters,
  generateVoiceSpec,
  isVoiceSpecEnabled,
  trimRedundantClearances,
  blindReadProse,
  isProseBlindReaderEnabled,
  initNarrativeState,
  updateNSD,
  resolveVictimName,
  stampDeployedAtoms,
  extractBeatFingerprints,
  buildMacroArcPlan,
  precompileStoryContract,
  RESOLUTION_RE,
  buildResolutionBackstopSentence,
  isAtomicLockedFactValue,
  checkMechanismEnvironmentConsistency,
  buildStoryWorldState,
  runContradictionGate,
  verifyDiscriminator,
  buildStoryBible,
  runScaffoldRegenPass,
  applyScaffoldExhaustionFloor,
  culpritEvidenceLinkInText,
  runRegenRepair,
  composeChapterValidator,
  buildRegenRequest,
  runTemplateLeakageRegenPass,
  runDualValueContrastRegenPass,
  runDualValueFullStoryResidualPass,
  detectDualValueAtShipScope,
  runResolutionRegenPass,
  runCulpritEvidenceRegenPass,
  runSuspectEliminationRegenPass,
  runCaseTransitionRegenPass,
  runMechanismRevealRegenPass,
  runVoiceLeakageRegenPass,
  runInsertionRegenPass,
  makeRegenFn,
  repairCaseSoundness,
  genderMapFromBible,
  deriveMechanismTerms,
  chapterFullyExplainsMechanism,
  resolveDiscriminatingTestChapter,
  // A_69 Increment 3 — whole-story read-only diagnostic. Lives HERE, not in generate.ts: the A_69
  // smoke probe proved the prose keeps changing after generate.ts returns (scaffold regen replaced
  // ch9 wholesale, so 2 of 5 findings pointed at text that no longer shipped). Only this layer sees
  // the final story.
  resolveFullStoryDiagnosticMode,
  runFullStoryDiagnostic,
  applyFullStoryDiagnosticFindings,
  getDeterministicClearancePasteTelemetry,
  getDeterministicCluePasteTelemetry,
  resetDeterministicClearancePasteTelemetry,
  resetDeterministicCluePasteTelemetry,
  resolveStageModel,
  // Agent 7.5 geometry (architecture/GEOMETRY-AGENT-DESIGN.md §8.5/§8.6) — the negative-obligation
  // repair pass, and the one clock-time parser the acceptance test must share.
  runAftermathRepeatRegenPass,
  runRevealRepairRegenPass,
  parseClockTime,
  // X38 — ONE duration parser, injected. story-geometry deliberately holds no copy (its local one
  // had already diverged on "twenty-five minutes").
  parseDurationMinutes,
  dialGapMinutes,
  // REVIEW_05 §10.1 — the pipeline's own sentences, and the patterns that recognise them.
  buildCulpritEvidenceSentence,
  buildCulpritEvidenceSentenceInScene,
  buildSuspectClearanceSentence,
  INJECTED_SENTENCE_PATTERNS,
  // REVIEW_05 §10.6 (X4) — the rules that bind the model, applied to what the floors write.
  findModelBoundRuleViolations,
  type ChapterValidator,
  type NarrativeState,
  type BatchCommitRecord,
  type ReleaseGateAudit,
  // A_73 §11.1 — the one prose-stage clearance vocabulary.
  CLEARANCE_TERMS_RE,
} from "@cml/prompts-llm";
import { noScaffoldValidator, detectTemplateLeakage, detectScaffoldNotProse, detectDerivedContradictionLeak, detectEvidentiaryRegister, machineRegisterRate, REGISTER_TELEMETRY_THRESHOLD, bookVoiceConformance, VOICE_CONFORMANCE_DELIVERED } from "@cml/prose-guard";
import {
  chapterIndexFor,
  checkManuscriptGeometry,
  GEOMETRY_CODES_WITHOUT_PROSE_REPAIR,
} from "@cml/story-geometry";
import { validateArtifact, validateCml, isVictimArchetype, isDetectiveArchetype, roleTextsOf } from "@cml/cml";
// Agent 9 redesign Phase A (§4.2 / §9.7): the validation-gated-mutation law — a deterministic prose
// pass may not ship a mutation it didn't re-validate. Default-off flag; legacy path byte-identical.
import { mutateThenValidate, noMetadataDumpValidator } from "@cml/prose-guard";
import { ProseScorer, StoryValidationPipeline, CharacterConsistencyValidator, repairChapterPronouns, repairPronouns, normalizeTitles, buildLocationRegistry, normalizeLocationNames, getGenerationParams, getPronounPolicySettings, validateCharacterLifecycle, DEATH_RE as LIFECYCLE_DEATH_RE, CONFESSION_RE as LIFECYCLE_CONFESSION_RE, RECOLLECTION_FRAME_RE as LIFECYCLE_RECOLLECTION_RE, detectMissingCaseTransitionBridge, BRIDGE_TERMS, validateDialogueIdiolect, anonymiseNamedWalkOns, buildAllowedNameParts, computeArrestPivotIndex, ROLE_ALIAS_TERMS, detectAttributionFlips, detectImpossibleSelfReferences } from "@cml/story-validation";
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
  details?: Record<string, unknown>;
};

type ProseReadabilitySummary = {
  denseChapterCount: number;
  underParagraphCount: number;
  severeParagraphBlocks: number;
};

type Agent9ResumeCheckpoint = {
  version: 1;
  runId: string;
  projectId?: string;
  savedAt: string;
  completedChapters: Array<{ title: string; summary?: string; paragraphs: string[] }>;
  narrativeState: NarrativeState;
  promptFingerprints?: Array<{
    chapter: number;
    hash: string;
    section_sizes: Record<string, number>;
  }>;
};

const loadAgent9ResumeCheckpoint = (
  checkpointPath: string,
  expectedRunId: string,
): Agent9ResumeCheckpoint | null => {
  if (!existsSync(checkpointPath)) return null;
  try {
    const parsed = JSON.parse(readFileSync(checkpointPath, "utf8")) as Agent9ResumeCheckpoint;
    if (!parsed || parsed.version !== 1) return null;
    if (typeof parsed.runId !== "string" || parsed.runId.length === 0) return null;
    if (parsed.runId !== expectedRunId) return null;
    if (!Array.isArray(parsed.completedChapters)) return null;
    if (!parsed.narrativeState || typeof parsed.narrativeState !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
};

const persistAgent9ResumeCheckpoint = (
  checkpointPath: string,
  checkpoint: Agent9ResumeCheckpoint,
): void => {
  mkdirSync(dirname(checkpointPath), { recursive: true });
  writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2), "utf8");
};

// S4 (REVIEW_03 item 6) — the flag surface moved to ./agent9/flags.ts. Runtime getters, never
// module consts: see that file for why, and FLAG-AUDIT.md for each lever's probe.
import {
  parseBooleanEnv,
  isMutationRevalidationEnabled,
  isGroundingLeadEnabled,
  isBibleGatesBlockingEnabled,
  isScaffoldRegenEnabled,
  isTemplateLeakageRegenEnabled,
  isClearanceTrimEnabled,
  isDualValueRegenEnabled,
  isPronounRegenEnabled,
  isResolutionRegenEnabled,
  isCulpritEvidenceRegenEnabled,
  isSuspectEliminationRegenEnabled,
  isTransitionRegenEnabled,
  isMechanismRegenEnabled,
  isWalkonRepairEnabled,
  isLockedFactRegenEnabled,
  isBibleAuthoritativeEnabled,
  voiceEnforceMode,
} from "./agent9/flags.js";

/**
 * Ledger P4.2 — the critique-rewrite acceptance validator: a creative-temperature rewrite may not
 * REINTRODUCE defect classes the regen passes (which run BEFORE the rewrite) already cleared.
 * Evaluated on the original first (critiqueAndRewriteChapter's isRegression), so pre-existing
 * defects self-baseline: only NEW violations roll a rewrite back.
 * (a) case-transition: the candidate is swapped into the chapter snapshot and any
 *     missing_case_transition_bridge defect touching the rewritten position (as the death-side
 *     chapter, or as the disappearance frame for the NEXT chapter) is a violation.
 * (b) mechanism-too-early: a pre-discriminating-test chapter must not gain a full mechanism
 *     explanation (same predicate as the S8 regen and the rubric cap).
 * Snapshot note: within one pass, earlier accepted rewrites aren't reflected in the snapshot — a
 * combination defect across two same-pass rewrites still lands on the final release gate.
 */
export const buildRewriteAcceptanceValidator = (args: {
  atomicValues: ReadonlyArray<string>;
  chapterSnapshot: ReadonlyArray<any>;
  mechanismTerms: ReadonlyArray<string>;
  dtChapter: number | null;
  index: number;
  original: any;
}): ((cand: any) => { ok: boolean; score: number; violations: string[] }) => {
  const presentValues = args.atomicValues.filter((v) =>
    ((args.original?.paragraphs ?? []) as string[]).join(" ").includes(v),
  );
  return (cand: any) => {
    const text = ((cand?.paragraphs ?? []) as string[]).join(" ");
    const scaffold = noScaffoldValidator(text);
    const dropped = presentValues.filter((v) => !text.includes(v));
    const candList = args.chapterSnapshot.map((ch, i) => (i === args.index ? cand : ch));
    const transitionViolations = detectMissingCaseTransitionBridge(candList as any)
      .filter((d) => d.chapterNumber === args.index + 1 || d.chapterNumber === args.index + 2)
      .map((d) => `case_transition_defect_ch${d.chapterNumber}`);
    const mechanismViolations =
      args.mechanismTerms.length > 0 &&
      args.dtChapter != null &&
      args.index + 1 < args.dtChapter &&
      chapterFullyExplainsMechanism(text.toLowerCase(), [...args.mechanismTerms])
        ? ["mechanism_revealed_early"]
        : [];
    const introduced = [...transitionViolations, ...mechanismViolations];
    return {
      ok: scaffold.ok && dropped.length === 0 && introduced.length === 0,
      score: scaffold.score + (presentValues.length - dropped.length) * 10 - introduced.length * 25,
      violations: [...scaffold.violations, ...dropped.map((v) => `dropped_locked_fact:${v}`), ...introduced],
    };
  };
};

export const buildSyntheticNsdClueAnchor = (
  clueId: string,
  chapterNumber: number,
  clueRecord?: { description?: string; pointsTo?: string },
) => {
  const summary = [
    String(clueRecord?.description ?? "").trim(),
    String(clueRecord?.pointsTo ?? "").trim(),
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .slice(0, 220);

  return {
    clue_id: clueId,
    chapter_number: chapterNumber,
    evidence_quote: summary.length > 0
      ? `[Synthetic NSD anchor] No direct prose quote extracted in this batch. Clue metadata: ${summary}`
      : `[Synthetic NSD anchor] No direct prose quote extracted in this batch for ${clueId}.`,
    evidence_offset: {
      chapter: chapterNumber,
      paragraph: 1,
      sentence: 1,
    },
    confidence: 0,
    state: "introduced" as const,
    quality: "synthetic" as const,
  };
};

// S4 (REVIEW_03 item 6) — prose text sanitation moved to ./agent9/prose-text.ts. Re-exported below
// so every existing import of these symbols from agent9-run.js keeps resolving.
import {
  illegalControlCharPattern,
  persistentMojibakePattern,
  sanitizeProseText,
  enforceReadableParagraphFlow,
  splitLongParagraphForReadability,
  normalizeWrappedParagraphText,
} from "./agent9/prose-text.js";
export { illegalControlCharPattern, persistentMojibakePattern, sanitizeProseText };

// A field value is "phrase-like" (multi-clause or verb-bearing) and unsafe to
// interpolate directly into a sentence template. Earlier agents occasionally emit
// malformed mood/weather values — e.g. "quiet tension underlies the cozy setting"
// or "overcast with intermittent drizzle typical of english countryside" — that
// produce broken prose ("...gave the room a quiet tension underlies the cozy setting
// cast that refused to lift") when spliced into the leadTemplates below. This was
// the source of the Chapter-2 setting-metadata leak in run_1d55f7c7.
const GROUNDING_FIELD_VERB_RE =
  /\b(underlies?|reflect(?:s|ing|ed)?|suggest(?:s|ing|ed)?|evok\w*|convey(?:s|ing|ed)?|creat\w*|gives?|giving|set(?:s|ting)?|pervad\w*|linger\w*|hang\w*|cast\w*|impl(?:y|ies|ied)|typical\s+of|reminiscent\s+of)\b/i;

// Sanitise an atmosphere field (mood/weather) into a single short adjective phrase
// that is safe to interpolate. Returns the fallback when the value is multi-clause,
// verb-bearing, or too long to be a clean adjective.
const cleanAtmosphereField = (raw: unknown, fallback: string, maxWords: number): string => {
  let v = String(raw ?? "")
    .split(/[,;]/)[0]
    .split(/\s+and\s+/)[0]
    .replace(/[.]+$/, "")
    .trim();
  const words = v.split(/\s+/).filter(Boolean);
  if (!v || words.length === 0 || words.length > maxWords || GROUNDING_FIELD_VERB_RE.test(v)) {
    return fallback;
  }
  return v;
};

// Sanitise a location name: strip embedded " - Sub-location" dumps (e.g.
// "Wynthorpe Manor - Library" → "Wynthorpe Manor") and cap length so the
// geographic chain ("Name in Place, Region, Country") can never be reproduced.
const cleanLocationName = (raw: unknown, fallback: string): string => {
  let v = String(raw ?? "").replace(/\s*[-–—]\s*.*$/, "").replace(/[.,;]+$/, "").trim();
  const words = v.split(/\s+/).filter(Boolean);
  if (!v || words.length > 6) return fallback;
  return v;
};

// A_52 item 3: single source of truth for the scene-grounding vocabulary. The release-gate scorer
// (evaluateSceneGroundingCoverage), the rescue trigger (getGroundingSignals), and the deterministic
// leads all grade against THESE exact terms. Keeping them in one place stops the scorer and the rescue
// from silently drifting apart — a drift would make the rescue "fix" a chapter the gate still fails.
const GROUNDING_SENSORY_SOURCE =
  "smell|scent|odor|fragrance|sound|echo|silence|whisper|creak|cold|warm|damp|rough|smooth|glow|shadow|flicker|dim";
const GROUNDING_ATMOSPHERE_SOURCE =
  "rain|wind|fog|storm|mist|thunder|evening|morning|night|dawn|dusk|lighting|season|weather|afternoon|midday|noon|midnight|twilight|sunrise|sunset|daylight|sunlight|overcast|cloudy|bright|dark|grey|gray|pale|cold|warm|chill|crisp|damp|drizzle|haze|lamplight|firelight";
// Fresh instances per call — a shared /g regex carries mutable lastIndex state across .test()/.match().
const groundingSensoryRegex = (): RegExp => new RegExp(`\\b(${GROUNDING_SENSORY_SOURCE})\\b`, "gi");
const groundingAtmosphereRegex = (): RegExp => new RegExp(`\\b(${GROUNDING_ATMOSPHERE_SOURCE})\\b`, "i");

// Minimal, field-free grounding leads used when the profile-derived lead would be
// malformed. They carry the sensory + atmosphere + location-anchor signals that
// getGroundingSignals requires, but interpolate ONLY the sanitised location name.
const buildSafeGroundingLead = (chapterIndex: number, locationName: string): string => {
  const L = locationName || "the room";
  const safeTemplates = [
    `A grey light filled ${L}, and the cold air carried the faint creak of old timber.`,
    `${L} lay in shadow, its damp stillness broken only by the distant patter of rain.`,
    `A chill hung over ${L}; the dim light caught the dust along the silent shelves.`,
    `Pale daylight pressed at the windows of ${L}, where the cold room smelled of old wood and stone.`,
    `The morning was overcast and still over ${L}, the room hushed but for the wind against the glass.`,
  ];
  return sanitizeProseText(safeTemplates[chapterIndex % safeTemplates.length]);
};

export const buildDeterministicGroundingLead = (
  chapterIndex: number,
  locationProfiles: any,
  preferredLocationName?: string,
): string => {
  const primary = locationProfiles.primary;
  const keyLocations = locationProfiles.keyLocations || [];
  // A_52 item 3: anchor the lead to the location the chapter actually visits when known — prepending
  // atmosphere about a room the chapter never enters was the "mismatched opener" defect that got this
  // pass disabled. Match the preferred name to its profile (for coherent sensory detail) and fall back
  // to a bare name; only when no preference is given do we rotate through keyLocations.
  let target: any =
    keyLocations.length > 0 ? keyLocations[chapterIndex % keyLocations.length] : undefined;
  if (preferredLocationName && preferredLocationName.trim().length > 0) {
    const pref = preferredLocationName.trim().toLowerCase();
    const match = keyLocations.find((l: any) => String(l?.name || "").toLowerCase() === pref);
    target = match || { name: preferredLocationName.trim() };
  }

  const locationName = cleanLocationName(target?.name || primary?.name, "the premises");
  // Cap geography to a single short place token and DROP the country — never emit the
  // full "Name in Place, Region, Country" chain that leaked in run_1d55f7c7.
  const placeRaw = cleanLocationName(primary?.place, "");
  const place = placeRaw && placeRaw.toLowerCase() !== locationName.toLowerCase() ? ` in ${placeRaw}` : "";
  const weather = cleanAtmosphereField(locationProfiles.atmosphere?.weather, "rain", 3);
  const mood = cleanAtmosphereField(locationProfiles.atmosphere?.mood, "tense", 3);

  const smells = target?.sensoryDetails?.smells || [];
  const sounds = target?.sensoryDetails?.sounds || [];
  const tactile = target?.sensoryDetails?.tactile || [];

  // Lowercase first letter for mid-sentence insertion; strip trailing period.
  const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
  const smell = lcFirst((smells[0] || "old timber and damp stone").replace(/\.$/, ""));
  const sound = lcFirst((sounds[0] || "the sound of the wind in the corridor").replace(/\.$/, ""));
  const touch = lcFirst((tactile[0] || "the cold banister and rough wallpaper").replace(/\.$/, ""));

  const leadTemplates = [
    `${locationName}${place} held a ${mood.toLowerCase()} weight to it; ${sound}, and the faint trace of ${smell} completed the picture.`,
    `The ${weather.toLowerCase()} had settled over ${locationName}${place}; ${sound}, and ${touch} gave the room a ${mood.toLowerCase()} cast that refused to lift.`,
    `Entering ${locationName}${place}, ${sound} was the first thing one noticed—${touch}, and the whole space felt quietly ${mood.toLowerCase()}.`,
    `${locationName}${place} received them with ${smell} alongside ${sound}, and ${touch} reinforced the ${mood.toLowerCase()} impression.`,
    `In ${locationName}${place}, ${sound} and ${smell} set the tone; ${touch} ran beneath it all, and the ${weather.toLowerCase()} outside pressed the ${mood.toLowerCase()} mood inward.`,
  ];

  const lead = sanitizeProseText(leadTemplates[chapterIndex % leadTemplates.length]);

  // Final safety net: if the assembled lead still looks malformed (a residual
  // " - " location dump, a verb-bearing field that slipped through, or an
  // over-long run-on), fall back to a field-free safe lead. This guarantees the
  // deterministic injector can never reintroduce a setting-metadata field dump.
  const looksMalformed =
    /\s[-–—]\s/.test(lead) ||
    GROUNDING_FIELD_VERB_RE.test(`${weather} ${mood}`) ||
    lead.split(/\s+/).length > 45;
  if (looksMalformed) {
    return buildSafeGroundingLead(chapterIndex, locationName);
  }
  return lead;
};

const templateLeakageScaffoldPattern =
  /at\s+the\s+[a-z][\s\S]{0,120}the\s+smell\s+of[\s\S]{20,300}?atmosphere\s+ripe\s+for\s+revelation\.?/i;

const normalizeParagraphForLeakageDedup = (paragraph: string) =>
  paragraph.replace(/\s+/g, " ").trim().toLowerCase();

const getGroundingSignals = (opening: string, anchors: string[]) => {
  const normalized = opening.toLowerCase();
  const hasAnchor = anchors.some((anchor) => normalized.includes(anchor));
  const sensoryCount = (normalized.match(groundingSensoryRegex()) || []).length;
  const hasAtmosphere = groundingAtmosphereRegex().test(normalized);
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
  'twenty-eight': 28, 'twenty-nine': 29, thirty: 30,
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
  const lower = value
    .toLowerCase()
    .trim()
    .replace(/^[\s]*(?:the|an?)\s+/, "");

  const resolveHourToken = (tokenRaw: string, mode: "past" | "to" | "plain"): number | null => {
    const token = tokenRaw.trim().toLowerCase();
    if (!token) return null;
    if (token === "midnight") {
      // For "to midnight" we want the previous hour boundary (23:xx).
      return mode === "to" ? 24 : 0;
    }
    if (token === "noon") {
      return 12;
    }
    return WORD_TO_NUM[token] ?? null;
  };

  // "half past [hour]"
  const halfPast = lower.match(/^half\s+past\s+(\w+)$/);
  if (halfPast) {
    const h = WORD_TO_NUM[halfPast[1]];
    if (h != null) return { hour: h, minute: 30 };
  }

  // "quarter past [hour]"
  const quarterPast = lower.match(/^(?:a\s+)?quarter\s+past\s+([\w-]+)$/);
  if (quarterPast) {
    const h = resolveHourToken(quarterPast[1], "past");
    if (h != null) return { hour: h, minute: 15 };
  }

  // "quarter to [hour]"
  const quarterTo = lower.match(/^(?:a\s+)?quarter\s+to\s+([\w-]+)$/);
  if (quarterTo) {
    const h = resolveHourToken(quarterTo[1], "to");
    if (h != null) return { hour: h === 1 ? 12 : h - 1, minute: 45 };
  }

  // "[N word] [minutes] past [hour]" — e.g. "ten minutes past eleven", "five past six"
  const minutesPast = lower.match(/^([\w-]+)\s+(?:minutes?\s+)?past\s+([\w-]+)$/);
  if (minutesPast) {
    const m = WORD_TO_NUM[minutesPast[1].trim()];
    const h = resolveHourToken(minutesPast[2], "past");
    if (m != null && h != null) return { hour: h, minute: m };
  }

  // "[N word] [minutes] to [hour]" — e.g. "ten minutes to twelve", "five to three"
  const minutesTo = lower.match(/^([\w-]+)\s+(?:minutes?\s+)?to\s+([\w-]+)$/);
  if (minutesTo) {
    const m = WORD_TO_NUM[minutesTo[1].trim()];
    const h = resolveHourToken(minutesTo[2], "to");
    if (m != null && h != null) {
      return { hour: h === 1 ? 12 : h - 1, minute: 60 - m };
    }
  }

  // "[hour word] o'clock" — e.g. "eleven o'clock" (= 11:00)
  // Accept both straight (') and curly (\u2019) apostrophes so CML values
  // authored in smart-quote editors are handled correctly.
  const oclock = lower.match(/^([\w-]+)\s+o[\u2019']clock$/);
  if (oclock) {
    const h = resolveHourToken(oclock[1], "plain");
    if (h != null) return { hour: h, minute: 0 };
  }

  // "[hour word] [minute word]" plain format — e.g. "eleven ten" (= 11:10)
  // Guard: hour must be 1–12, minute must be 1–59 to avoid clashing with
  // quantity patterns like "forty minutes" (h=40 → rejected) or "two feet".
  const plainHM = lower.match(/^([\w-]+)\s+([\w-]+)$/);
  if (plainHM) {
    const h = WORD_TO_NUM[plainHM[1].trim()];
    const m = WORD_TO_NUM[plainHM[2].trim()];
    if (h != null && h >= 1 && h <= 12 && m != null && m >= 1 && m <= 59) {
      return { hour: h, minute: m };
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

// ============================================================================
// [FIX §11.1] Locked-fact / clue-description time-value mismatch detection
// ============================================================================

/**
 * Extract the first hour (0-23 fractional) expressed as a digit-form time in text.
 * Matches: "8:30 PM", "11:15 AM", "9 PM", "8 AM".
 * Returns null if no AM/PM-qualified time found.
 */
const extractDigitFormHour = (
  text: string,
): { hour: number; minute: number; explicitMeridiem: boolean; raw: string } | null => {
  const lower = text.toLowerCase();
  const hhmm = lower.match(/\b(\d{1,2}):(\d{2})\s*(am|pm)\b/);
  if (hhmm) {
    let h = parseInt(hhmm[1], 10);
    const m = parseInt(hhmm[2], 10);
    if (hhmm[3] === 'pm' && h < 12) h += 12;
    if (hhmm[3] === 'am' && h === 12) h = 0;
    return { hour: h, minute: m, explicitMeridiem: true, raw: hhmm[0] };
  }
  const hOnly = lower.match(/\b(\d{1,2})\s*(am|pm)\b/);
  if (hOnly) {
    let h = parseInt(hOnly[1], 10);
    if (hOnly[2] === 'pm' && h < 12) h += 12;
    if (hOnly[2] === 'am' && h === 12) h = 0;
    return { hour: h, minute: 0, explicitMeridiem: true, raw: hOnly[0] };
  }
  return null;
};

/** Extract the first raw time string from text for use in warning messages. */
const extractFirstTimeString = (text: string): string | null =>
  text.match(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|a\.m\.|p\.m\.|am|pm)\b/i)?.[0] ?? null;

/**
 * Detect a time discrepancy between a locked-fact canonical value and an
 * associated clue description. Returns the conflicting time string found in
 * clueText, or null if no conflict is detected.
 *
 * Catches cases like locked-fact value "eleven o'clock" (= 11:00) vs clue
 * description "Witness states they heard a loud noise at 8:30 PM" (= 20:30) —
 * mutually exclusive times for the same event that cause permanent
 * locked_fact_missing_value failures on every chapter that references the fact.
 */
export const detectLockedFactClueTimeMismatch = (
  factValue: string,
  clueText: string,
):
  | { type: "ambiguity" | "mismatch"; rawClueTime: string; factMinutes: number; clueMinutes: number }
  | null => {
  const factParsed = parseWordFormTime(factValue.trim());
  const factHour = factParsed
    ? { hour: factParsed.hour, minute: factParsed.minute, explicitMeridiem: false }
    : extractDigitFormHour(factValue);
  if (factHour === null) return null;

  const clueHour = extractDigitFormHour(clueText);
  if (clueHour === null) return null;

  // Word-form locked times ("ten minutes to nine") carry no meridiem, so an absolute-minutes diff
  // against an explicit-meridiem clue time reads same-evening values as half a day apart — abort
  // class #9 was "ten minutes to nine" vs "8:00 pm", 50 real minutes apart, scored as 670. Compare
  // through classifyTemporalDifference, which uses the 12-hour circle whenever meridiem info is
  // asymmetric or absent — identical semantics to the cross-artifact warning path.
  const verdict = classifyTemporalDifference(
    { hour: factHour.hour, minute: factHour.minute, explicitMeridiem: factHour.explicitMeridiem, raw: factValue.trim() },
    { hour: clueHour.hour, minute: clueHour.minute, explicitMeridiem: clueHour.explicitMeridiem, raw: clueHour.raw },
  );
  if (verdict === null) return null;

  return {
    type: verdict.type,
    rawClueTime: clueHour.raw || extractFirstTimeString(clueText) || `${clueHour.hour}:${String(clueHour.minute).padStart(2, "0")}`,
    factMinutes: factHour.hour * 60 + factHour.minute,
    clueMinutes: clueHour.hour * 60 + clueHour.minute,
  };
};

type CrossArtifactTemporalConflict = {
  sourceTag: "agent3_cml" | "agent7_narrative";
  sourcePath: string;
  sourceTime: string;
  violationType: "ambiguity" | "mismatch";
  lockedFactDescription: string;
  lockedFactValue: string;
};

type TemporalAnchorSignal = {
  hour: number;
  minute: number;
  explicitMeridiem: boolean;
  raw: string;
};

type TemporalTextCandidate = {
  sourceTag: "agent3_cml" | "agent7_narrative";
  path: string;
  text: string;
};

const TIME_LIKE_TEXT_RE =
  /\b(?:\d{1,2}(?::\d{2})?\s*(?:a\.m\.|p\.m\.|am|pm)|(?:a\s+)?quarter\s+(?:past|to)\s+[a-z-]+|half\s+past\s+[a-z-]+|[a-z-]+\s+(?:minutes?\s+)?(?:past|to)\s+[a-z-]+|[a-z-]+\s+o['’]clock|midnight|noon)\b/i;

const DIGIT_FORM_TIME_GLOBAL_RE = /\b(\d{1,2})(?::(\d{2}))?\s*(a\.m\.|p\.m\.|am|pm)\b/gi;

const WORD_FORM_TIME_PATTERNS: RegExp[] = [
  /\b(?:a\s+)?quarter\s+past\s+[a-z-]+\b/gi,
  /\b(?:a\s+)?quarter\s+to\s+[a-z-]+\b/gi,
  /\bhalf\s+past\s+[a-z-]+\b/gi,
  /\b[a-z-]+\s+(?:minutes?\s+)?past\s+[a-z-]+\b/gi,
  /\b[a-z-]+\s+(?:minutes?\s+)?to\s+[a-z-]+\b/gi,
  /\b[a-z-]+\s+o['’]clock\b/gi,
];

const circularMinuteDiff = (left: number, right: number, cycle: number): number => {
  const raw = Math.abs(left - right);
  return Math.min(raw, cycle - raw);
};

const toComparableTemporalMinutes = (signal: TemporalAnchorSignal): { absolute: number; twelveHour: number } => ({
  absolute: signal.hour * 60 + signal.minute,
  twelveHour: (signal.hour % 12) * 60 + signal.minute,
});

const classifyTemporalDifference = (
  canonical: TemporalAnchorSignal,
  candidate: TemporalAnchorSignal,
): { type: "ambiguity" | "mismatch" } | null => {
  const canonicalMinutes = toComparableTemporalMinutes(canonical);
  const candidateMinutes = toComparableTemporalMinutes(candidate);
  const mixedMeridiem = canonical.explicitMeridiem !== candidate.explicitMeridiem;
  const diff = mixedMeridiem
    ? circularMinuteDiff(canonicalMinutes.twelveHour, candidateMinutes.twelveHour, 720)
    : canonical.explicitMeridiem
      ? circularMinuteDiff(canonicalMinutes.absolute, candidateMinutes.absolute, 1440)
      : circularMinuteDiff(canonicalMinutes.twelveHour, candidateMinutes.twelveHour, 720);

  if (diff < 60) return null;
  return { type: mixedMeridiem ? "ambiguity" : "mismatch" };
};

const extractTemporalAnchorSignals = (text: string): TemporalAnchorSignal[] => {
  const signals: TemporalAnchorSignal[] = [];
  const seen = new Set<string>();

  for (const match of text.matchAll(DIGIT_FORM_TIME_GLOBAL_RE)) {
    const hourRaw = Number.parseInt(String(match[1] ?? ""), 10);
    const minuteRaw = Number.parseInt(String(match[2] ?? "0"), 10);
    const meridiem = String(match[3] ?? "").toLowerCase();
    if (!Number.isFinite(hourRaw) || !Number.isFinite(minuteRaw)) continue;

    let hour = hourRaw;
    if (meridiem.startsWith("p") && hour < 12) hour += 12;
    if (meridiem.startsWith("a") && hour === 12) hour = 0;
    const signal: TemporalAnchorSignal = {
      hour,
      minute: minuteRaw,
      explicitMeridiem: true,
      raw: String(match[0] ?? "").trim(),
    };
    const key = `${signal.hour}:${signal.minute}:${signal.explicitMeridiem}:${signal.raw.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      signals.push(signal);
    }
  }

  for (const pattern of WORD_FORM_TIME_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const raw = String(match[0] ?? "").trim();
      if (!raw) continue;
      const parsed = parseWordFormTime(raw);
      if (!parsed) continue;
      const signal: TemporalAnchorSignal = {
        hour: parsed.hour,
        minute: parsed.minute,
        explicitMeridiem: false,
        raw,
      };
      const key = `${signal.hour}:${signal.minute}:${signal.explicitMeridiem}:${signal.raw.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        signals.push(signal);
      }
    }
  }

  return signals;
};

const collectTemporalTextCandidates = (
  node: unknown,
  path: string,
  sourceTag: "agent3_cml" | "agent7_narrative",
  results: TemporalTextCandidate[],
  depth = 0,
): void => {
  if (depth > 7 || results.length >= 400 || node == null) return;

  if (typeof node === "string") {
    const text = node.trim();
    if (text.length === 0) return;
    if (!TIME_LIKE_TEXT_RE.test(text)) return;
    results.push({ sourceTag, path, text });
    return;
  }

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i += 1) {
      collectTemporalTextCandidates(node[i], `${path}[${i}]`, sourceTag, results, depth + 1);
      if (results.length >= 400) return;
    }
    return;
  }

  if (typeof node === "object") {
    const entries = Object.entries(node as Record<string, unknown>);
    for (const [key, value] of entries) {
      collectTemporalTextCandidates(value, `${path}.${key}`, sourceTag, results, depth + 1);
      if (results.length >= 400) return;
    }
  }
};

export const detectCrossArtifactTemporalConflicts = (args: {
  lockedFacts: Array<{ description?: string; value?: string }>;
  cmlCase: any;
  narrative: any;
}): CrossArtifactTemporalConflict[] => {
  const { lockedFacts, cmlCase, narrative } = args;
  if (!Array.isArray(lockedFacts) || lockedFacts.length === 0) return [];

  const candidates: TemporalTextCandidate[] = [];

  if (cmlCase && typeof cmlCase === "object") {
    collectTemporalTextCandidates(cmlCase.false_assumption, "CASE.false_assumption", "agent3_cml", candidates);
    collectTemporalTextCandidates(cmlCase.constraint_space?.time, "CASE.constraint_space.time", "agent3_cml", candidates);
    collectTemporalTextCandidates(cmlCase.discriminating_test, "CASE.discriminating_test", "agent3_cml", candidates);
    collectTemporalTextCandidates(cmlCase.prose_requirements, "CASE.prose_requirements", "agent3_cml", candidates);
    collectTemporalTextCandidates(cmlCase.narrative_outline, "CASE.narrative_outline", "agent3_cml", candidates);
  }

  if (narrative && typeof narrative === "object") {
    collectTemporalTextCandidates(narrative.acts, "narrative.acts", "agent7_narrative", candidates);
  }

  if (candidates.length === 0) return [];

  const conflicts: CrossArtifactTemporalConflict[] = [];
  const seenConflicts = new Set<string>();

  for (const fact of lockedFacts) {
    const lockedFactDescription = String(fact?.description ?? "").trim();
    const lockedFactValue = String(fact?.value ?? "").trim();
    if (!lockedFactDescription || !lockedFactValue) continue;

    const parsedWordForm = parseWordFormTime(lockedFactValue);
    const parsedDigitForm = extractDigitFormHour(lockedFactValue);
    const canonicalSignal: TemporalAnchorSignal | null = parsedWordForm
      ? {
          hour: parsedWordForm.hour,
          minute: parsedWordForm.minute,
          explicitMeridiem: false,
          raw: lockedFactValue,
        }
      : parsedDigitForm
        ? {
            hour: parsedDigitForm.hour,
            minute: parsedDigitForm.minute,
            explicitMeridiem: parsedDigitForm.explicitMeridiem,
            raw: parsedDigitForm.raw,
          }
        : null;
    if (!canonicalSignal) continue;

    const factKeywords = tokenizeLockedFactDescription(lockedFactDescription);
    const factHasClockLikeAnchor = factKeywords.some((keyword) => /(clock|watch|time|hour|minute)/.test(keyword));
    const keywordMatchesCandidate = (keyword: string, candidateLower: string): boolean => {
      if (candidateLower.includes(keyword)) return true;
      const stemmed = keyword
        .replace(/(?:ing|ed|es|s)$/i, "")
        .trim();
      return stemmed.length >= 4 && candidateLower.includes(stemmed);
    };

    for (const candidate of candidates) {
      const candidateLower = candidate.text.toLowerCase();
      const overlap = factKeywords.filter((keyword) => keywordMatchesCandidate(keyword, candidateLower)).length;
      const clockContextCandidate = /(clock|watch|time|hour|minute)/.test(candidateLower);
      const associated = overlap >= 2 || (overlap >= 1 && factHasClockLikeAnchor && clockContextCandidate);
      if (!associated) continue;

      const temporalSignals = extractTemporalAnchorSignals(candidate.text);
      if (temporalSignals.length === 0) continue;

      for (const signal of temporalSignals) {
        const mismatch = classifyTemporalDifference(canonicalSignal, signal);
        if (!mismatch) continue;

        const key = [
          lockedFactDescription.toLowerCase(),
          lockedFactValue.toLowerCase(),
          candidate.sourceTag,
          candidate.path,
          signal.raw.toLowerCase(),
          mismatch.type,
        ].join("::");
        if (seenConflicts.has(key)) continue;
        seenConflicts.add(key);

        conflicts.push({
          sourceTag: candidate.sourceTag,
          sourcePath: candidate.path,
          sourceTime: signal.raw,
          violationType: mismatch.type,
          lockedFactDescription,
          lockedFactValue,
        });
      }
    }
  }

  return conflicts;
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

    // Track whether any specific pattern handler matched this canonical.
    let matchedSpecificHandler = false;

    // Try time-of-day pattern first (e.g. "ten minutes past eleven" → catch "11:10 PM").
    const parsedTime = parseWordFormTime(canonical);
    if (parsedTime) {
      // Default to chapter-scoped repairs when appearsInChapters is provided.
      // Opt into global normalization only when the fact explicitly requests it.
      const applyGlobalTimeNormalization =
        fact?.normalizeAcrossStory === true ||
        String(fact?.scope ?? '').toLowerCase() === 'global';
      const scopeForTimeRepairs: Set<number> | null = applyGlobalTimeNormalization ? null : chaptersScope;
      const { hour, minute } = parsedTime;
      const minutePadded = String(minute).padStart(2, '0');
      // Match "H:MM" or "H.MM" optionally followed by AM/PM variants.
      const digitPattern = new RegExp(
        `\\b${hour}[:\\.]${minutePadded}(?:\\s*(?:AM|PM|a\\.m\\.|p\\.m\\.|am|pm))?\\b`,
        'g',
      );
      repairs.push({ pattern: digitPattern, canonical, chaptersScope: scopeForTimeRepairs });

      // Also catch word-alias forms that parseWordFormTime newly handles —
      // e.g. "eleven ten" for canonical "ten minutes past eleven" (11:10),
      // "eleven o'clock" for canonical "eleven o'clock" (already matched verbatim,
      // but other time formats representing the same hour would also need repair).
      // We only do this for cases where the plain "H MM" or "H o'clock" word form
      // DIFFERS from the canonical (to avoid no-op replacements).
      const hourWord = Object.entries(WORD_TO_NUM).find(([, v]) => v === hour)?.[0] ?? '';
      const minWord = minute > 0
        ? (Object.entries(WORD_TO_NUM).find(([, v]) => v === minute)?.[0] ?? '')
        : '';
      if (minute === 0 && hourWord) {
        // "eleven o'clock" form — only repair if canonical is NOT already "X o'clock"
        if (!/o[\u2019']clock/i.test(canonical)) {
          const oclockPattern = new RegExp(`\\b${hourWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+o[\\u2019']clock\\b`, 'gi');
          repairs.push({ pattern: oclockPattern, canonical, chaptersScope: scopeForTimeRepairs });
        }
        // Hour-only digit + AM/PM form: "8 PM", "8PM", "8 p.m." → canonical (e.g. "eight o'clock")
        const hourOnlyDigitAmPm = new RegExp(
          `\\b${hour}\\s*(?:AM|PM|a\\.m\\.|p\\.m\\.|am|pm)\\b`,
          'gi',
        );
        repairs.push({ pattern: hourOnlyDigitAmPm, canonical, chaptersScope: scopeForTimeRepairs });
        // Hour word + AM/PM form: "eight PM", "eight p.m." → canonical
        const escapedHourWord = hourWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const hourWordAmPm = new RegExp(
          `\\b${escapedHourWord}\\s+(?:AM|PM|a\\.m\\.|p\\.m\\.|am|pm)\\b`,
          'gi',
        );
        repairs.push({ pattern: hourWordAmPm, canonical, chaptersScope: scopeForTimeRepairs });
        // "X in the evening/morning/afternoon/night" → canonical (e.g. "eight in the evening")
        const inTheTimeOfDay = new RegExp(
          `\\b${escapedHourWord}\\s+(?:in\\s+the\\s+(?:evening|morning|afternoon|night)|that\\s+(?:evening|night|morning))\\b`,
          'gi',
        );
        repairs.push({ pattern: inTheTimeOfDay, canonical, chaptersScope: scopeForTimeRepairs });
      } else if (hourWord && minWord) {
        // "eleven ten" form — only repair if canonical is NOT this same plain H-M form
        const plainWordForm = `${hourWord} ${minWord}`;
        if (canonical.toLowerCase() !== plainWordForm) {
          const wordAliasPattern = new RegExp(
            `\\b${hourWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+${minWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
            'gi',
          );
          repairs.push({ pattern: wordAliasPattern, canonical, chaptersScope: scopeForTimeRepairs });
        }
        // Phase 3: wrong-order form: "eleven past ten" when canonical is "ten past eleven"
        const escapedHour = hourWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedMin = minWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wrongOrderPattern = new RegExp(`\\b${escapedHour}\\s+(?:minutes?\\s+)?past\\s+${escapedMin}\\b`, 'gi');
        repairs.push({ pattern: wrongOrderPattern, canonical, chaptersScope: scopeForTimeRepairs });
        // "N past H" without "minutes" keyword — e.g. "ten past eleven" → "ten minutes past eleven"
        if (/minutes?\s+past/i.test(canonical)) {
          const pastWithoutMinutes = new RegExp(`\\b${escapedMin}\\s+past\\s+${escapedHour}\\b`, 'gi');
          repairs.push({ pattern: pastWithoutMinutes, canonical, chaptersScope: scopeForTimeRepairs });
        }
        // Phase 3: hyphenated form: "eleven-ten"
        const hyphenPattern = new RegExp(`\\b${escapedHour}-${escapedMin}\\b`, 'gi');
        repairs.push({ pattern: hyphenPattern, canonical, chaptersScope: scopeForTimeRepairs });
      }
      // Phase 3: "quarter past [hour]" / "half past [hour]" as wrong substitutions when canonical differs
      if (hourWord) {
        const escapedHour = hourWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (minute !== 15 && !/quarter\s+past/i.test(canonical)) {
          const quarterPastPattern = new RegExp(`\\bquarter\\s+past\\s+${escapedHour}\\b`, 'gi');
          repairs.push({ pattern: quarterPastPattern, canonical, chaptersScope: scopeForTimeRepairs });
        }
        if (minute !== 30 && !/half\s+past/i.test(canonical)) {
          const halfPastPattern = new RegExp(`\\bhalf\\s+past\\s+${escapedHour}\\b`, 'gi');
          repairs.push({ pattern: halfPastPattern, canonical, chaptersScope: scopeForTimeRepairs });
        }
      }
      matchedSpecificHandler = true;
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
      // Also catch "about/roughly/approximately/around 40 minutes" — qualifier gets
      // replaced with the canonical word-form so the locked-fact exact value appears.
      // NOTE: \\s+ must be OUTSIDE the alternation group so all qualifiers consume
      // the space before the digit ("about 40", not "about40").
      const pattern = new RegExp(
        `\\b(?:(?:about|roughly|approximately|around)\\s+)?${amount}\\s+${unitPattern}\\b`,
        'gi',
      );
      repairs.push({ pattern, canonical, chaptersScope });
      matchedSpecificHandler = true;
      continue;
    }

    // Handle digit-form temperature canonicals: e.g. "98 degrees Fahrenheit".
    // Neither parseWordFormTime nor parseWordFormQuantity handles these because the
    // number is already in digit form. Build patterns for common abbreviation variants
    // that the LLM may use: "98°F", "98° F", "98 degrees F", "98 deg F".
    const tempMatch = canonical.match(/^(\d+)\s+degrees?\s+(fahrenheit|celsius|kelvin|centigrade)$/i);
    if (tempMatch) {
      const digits = tempMatch[1];
      const scaleChar = tempMatch[2][0].toUpperCase(); // 'F', 'C', 'K'
      const escapedUnit = tempMatch[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Matches: "98°F", "98 °F", "98° F", "98 degrees F", "98 deg F"
      const tempPattern = new RegExp(
        `\\b${digits}\\s*°\\s*${scaleChar}\\b|\\b${digits}\\s+(?:degrees?|deg)\\.?\\s+${scaleChar}\\b`,
        'gi',
      );
      repairs.push({ pattern: tempPattern, canonical, chaptersScope });
      // Also catch word-form number variant (e.g. "ninety-eight degrees Fahrenheit")
      // only when the digit value is in WORD_TO_NUM range and has a word form.
      const digitNum = parseInt(digits, 10);
      const numWord = Object.entries(WORD_TO_NUM).find(([, v]) => v === digitNum)?.[0];
      if (numWord) {
        const wordTempPattern = new RegExp(
          `\\b${numWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+degrees?\\s+${escapedUnit}\\b`,
          'gi',
        );
        repairs.push({ pattern: wordTempPattern, canonical, chaptersScope });
      }
      matchedSpecificHandler = true;
    }

    // Generic fallback: for locked facts that don't match time, quantity, or temperature
    // patterns (e.g. "the green ledger", "the east wing"), build a case-insensitive
    // verbatim regex so that case variants are normalised to the canonical form.
    // Only applied to canonicals of ≥6 chars to avoid spurious single-word matches.
    if (!matchedSpecificHandler && canonical.length >= 6) {
      const escapedCanonical = canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const verbatimCasePattern = new RegExp(escapedCanonical, 'gi');
      repairs.push({ pattern: verbatimCasePattern, canonical, chaptersScope });
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

const LOCKED_FACT_DESC_STOPWORDS = new Set([
  "the", "and", "that", "with", "from", "into", "over", "under", "when", "where",
  "which", "their", "there", "been", "were", "have", "this", "exact", "amount",
  "difference", "between", "shown", "about", "after", "before", "during", "while",
]);

const tokenizeLockedFactDescription = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !LOCKED_FACT_DESC_STOPWORDS.has(token));

type FactValueType = 'time' | 'duration_minutes' | 'weight' | 'length' | 'generic';

function classifyFactValue(canonical: string): FactValueType {
  // P2-4: "quarter" and "half" are only clock-time indicators when adjacent to an hour-word.
  // "a quarter of a mile" or "half the distance" must not be classified as time.
  // Also add "at the hour" as an unambiguous time indicator.
  const HOUR_WORDS = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/i;
  const isClockContext =
    /\b(past|to|o['']clock|AM|PM|a\.m\.|p\.m\.|in\s+the\s+(morning|afternoon|evening|night)|at\s+the\s+hour)\b/i.test(canonical) ||
    (/\b(quarter|half)\b/i.test(canonical) && HOUR_WORDS.test(canonical));
  if (isClockContext) return 'time';
  if (/\b(minute|second|hour)s?\b/i.test(canonical)) return 'duration_minutes';
  if (/\b(pound|stone|kilogram)s?\b/i.test(canonical)) return 'weight';
  if (/\b(feet?|foot|inch|metre|meter|yard)s?\b/i.test(canonical)) return 'length';
  return 'generic';
}

// A_62 P4.4 (partial, evidence-led): "The hour stood at ${v}." was ONE FIXED STRING responsible
// for the campaign's most frequent cap — 21 verbatim occurrences across the capped runs; Item 17
// (template-leakage, 19/39 runs) is substantially THIS sentence, and it is Item 15's verbatim
// external-read example ("The hour stood at…"). The history is an arms race the code lost twice:
// A_47 renamed the template specifically to dodge that era's detectors ("The time was recorded
// as…" → "The hour stood at…"), and the Item-15 era correctly re-listed the new phrase
// (fidelity.ts TEMPLATE_LEAKAGE + banned-phrases — which bans the MODEL from a sentence the
// WORKER injects). The regen lever couldn't reach it: this injector is the fallback floor that
// fires exactly when regen already failed (see the caller), so the P3 leakage A/B measured 0→0.
//
// The fix ends the arms race instead of joining it: no FIXED string. A small rotation of
// period-idiomatic phrasings, selected deterministically from the VALUE (reproducible runs), none
// matching TEMPLATE_LEAKAGE / DEBUG_NOTE_PATTERNS / the scaffold family — pinned by a test that
// asserts non-membership, so any future detector re-listing is a conscious decision, not a trap.
const pickVariant = (
  variants: Array<(d: string, v: string) => string>,
  seed: string,
  occurrence = 0,
) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  // The VALUE picks the starting variant (so two runs of the same story read the same, and two
  // different facts start in different places). The OCCURRENCE walks forward from there, which is
  // what makes the second injection of one fact provably different from the first rather than
  // 50/50 — with MAX_INJECTIONS_PER_FACT at 2 and two variants, a hash alone was a coin flip.
  return variants[(h + occurrence) % variants.length];
};

/** The seed carries the occurrence ordinal; anything unparseable means "the first one". */
const occurrenceOf = (seed?: string): number => {
  const n = Number.parseInt(String(seed ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const TIME_VARIANTS: Array<(d: string, v: string) => string> = [
  (_d, v) => `It was ${v} by the mantel clock.`,
  (_d, v) => `By then it was ${v}.`,
  (_d, v) => `The clocks put it at ${v}.`,
];
const DURATION_VARIANTS: Array<(d: string, v: string) => string> = [
  (_d, v) => `It had taken ${v} in all.`,
  (_d, v) => `${v.charAt(0).toUpperCase() + v.slice(1)} had passed before it was done.`,
];
/**
 * X65 — a locked fact's `description` is a SCHEMA LABEL, not a noun phrase.
 *
 * The 08-19 registry described its wire as "Length of the thin control wire from rooftop terrace to
 * clock mechanism", and the variant below used that string as a sentence SUBJECT, so the manuscript
 * shipped — twice, verbatim —
 *
 *   "Length of the thin control wire from Rooftop Terrace to clock mechanism came to twenty-five feet."
 *
 * which is a database row wearing a full stop. The non-membership test never caught it because its
 * fixtures were tidier than production: it passes "the corridor" and "the drop", which already ARE
 * noun phrases. Strip the measurement head ("Length of", "Distance from") and the trailing
 * prepositional tail, and what remains is the thing itself: "The thin control wire".
 */
const MEASURE_NOUN = "length|width|height|depth|distance|span|drop|weight|mass";

const measurementSubject = (description: string): string => {
  // Drop the trailing rationale a description often carries ("…, crucial for sound travel timing").
  let text = String(description ?? "").trim().split(",")[0]!.trim();
  if (!text) return "It";

  const m = text.match(new RegExp(`^(?:the\\s+)?(?:total\\s+)?(${MEASURE_NOUN})\\s+(of|from|between)\\s+(.+)$`, "i"));
  if (m) {
    const noun = m[1]!.toLowerCase();
    // "Length OF the thin control wire from X to Y" — the subject is the THING being measured.
    if (m[2]!.toLowerCase() === "of") {
      const thing = m[3]!.split(/\s+(?:from|between|to|across|along|down|up)\s+/i)[0]!.trim();
      if (thing) return article(thing);
    }
    // "Distance FROM the lobby clock TO the dining hall" — the subject is the DISTANCE, not the
    // clock. Naming the endpoint made the 08-19-2047 run ship "The lobby grandfather clock came to
    // forty feet.", which is grammatical and false: a clock is not forty feet long. Keeping the
    // measurement noun alone is short, true, and cannot inherit the label's syntax.
    return article(noun);
  }
  return article(text);
};

/** Give a noun phrase an article unless it already has one, and capitalise it. */
function article(text: string): string {
  let t = text.trim();
  if (!t) return "It";
  if (!/^(?:the|a|an|his|her|its|their)\b/i.test(t)) t = `the ${t}`;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const LENGTH_VARIANTS: Array<(d: string, v: string) => string> = [
  (d, v) => `${measurementSubject(d)} came to ${v}.`,
  (_d, v) => `Measured out, it ran to ${v}.`,
];

// Exported for the arms-race regression test (injector output × the real detectors).
/**
 * X64 — THE ROTATION COULD NOT ROTATE, so A_62's "no FIXED string" fix changed nothing observable.
 *
 * `pickVariant` is seeded on the VALUE. A locked fact's value is invariant across the whole
 * manuscript by definition — that is what makes it a locked fact — so every appearance of one fact
 * selected the same variant, and MAX_INJECTIONS_PER_FACT = 2 then delivered exactly two VERBATIM
 * duplicates. Measured on story_20260819-0147: "It had taken forty-five minutes in all." ×2 and the
 * wire sentence ×2, which is the whole of the injector's contribution to that manuscript.
 *
 * The regression test asserted that different VALUES pick different variants — true, and irrelevant,
 * because one manuscript has one value per fact. `seed` mixes in the occurrence site (the chapter),
 * which is the axis that actually varies within a run. Omitted, behaviour is unchanged and
 * deterministic, so the existing reproducibility contract still holds.
 */
export const INJECTION_TEMPLATES: Record<FactValueType, (desc: string, val: string, seed?: string) => string> = {
  time:             (d, v, s) => pickVariant(TIME_VARIANTS, v, occurrenceOf(s))(d, v),
  duration_minutes: (d, v, s) => pickVariant(DURATION_VARIANTS, v, occurrenceOf(s))(d, v),
  weight:           (d, v)  => `${measurementSubject(d)} weighed ${v}.`,
  length:           (d, v, s) => pickVariant(LENGTH_VARIANTS, v, occurrenceOf(s))(d, v),
  // F3: disabled — produces court-document prose ("The relevant value was established: X").
  // Generic numeric facts should surface via the obligation block, not post-hoc injection.
  generic:          (_d, _v) => ``,
};

/** Extract the surname (last word) from a full name. */
const extractSurname = (name: string): string => name.trim().split(/\s+/).pop() ?? name;

const normalizeNameLower = (value: unknown): string => String(value ?? "").trim().toLowerCase();

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const splitLifecycleSentences = (text: string): string[] =>
  String(text ?? "")
    .match(/[^.!?\n]+[.!?]*/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? [];

// A_73 §11.3 — this was a verbatim second copy of `DEATH_RE` from @cml/story-validation. Two bodies
// of the heuristic that has already caused a run-killing abort (ABORT CLASS #6: a cast name plus a
// death word in one sentence marked the DETECTIVE deceased in ch3). Identical today, which is the
// only reason it was latent rather than live. Now imported and aliased at the top of this file,
// exactly as CONFESSION_RE and RECOLLECTION_FRAME_RE already were.
const LIFECYCLE_ACTIVE_RE = /\b(?:said|asked|replied|answered|entered|stood|walked|looked|nodded|spoke|turned|moved|sat|rose|gestured|examined|handed|pointed|confessed|admitted)\b/i;
const LIFECYCLE_TITLE_PREFIX_RE = /^(?:Dr|Miss|Mrs|Mr|Captain|Col|Colonel|Major|Sir|Lady|Lord|Prof|Professor|Reverend|Rev|Inspector|Detective|Sergeant)\.?\s+/i;

const toLifecycleShortName = (fullName: string): string => {
  const cleaned = String(fullName ?? "").trim().replace(LIFECYCLE_TITLE_PREFIX_RE, "");
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length <= 1) return cleaned;
  return tokens[0] ?? cleaned;
};

const getVictimNameSet = (cml: any, castCharacters: CastEntry[]): Set<string> => {
  const victims = new Set<string>();
  const cmlCase = (cml as any)?.CASE ?? cml;
  const cmlCast = Array.isArray(cmlCase?.cast) ? cmlCase.cast : [];

  for (const entry of cmlCast) {
    const role = String(entry?.role_archetype ?? entry?.roleArchetype ?? entry?.role ?? "");
    const name = String(entry?.name ?? "").trim();
    if (name && isVictimArchetype(role)) {
      victims.add(normalizeNameLower(name));
    }
  }

  for (const entry of castCharacters) {
    const role = String((entry as any)?.role_archetype ?? (entry as any)?.roleArchetype ?? (entry as any)?.role ?? "");
    const name = String((entry as any)?.name ?? "").trim();
    if (name && isVictimArchetype(role)) {
      victims.add(normalizeNameLower(name));
    }
  }

  const culpabilityVictim = String(cmlCase?.culpability?.victim ?? "").trim();
  if (culpabilityVictim) {
    victims.add(normalizeNameLower(culpabilityVictim));
  }

  return victims;
};

const roleTextForIntegrity = (entry: any): string =>
  String(entry?.role_archetype ?? entry?.role ?? entry?.roleArchetype ?? "").toLowerCase();

/**
 * Wave 1 culprit-role integrity lock:
 * - culprit must not be victim/detective/ineligible
 * - if invalid, deterministically pick first eligible non-victim non-detective cast member
 * - keep suspect_clearance_scenes free of culprit/victim entries
 */
const enforceCmlCulpritRoleIntegrity = (
  cml: any,
  castDesign: any,
  warnings: string[],
): void => {
  const cmlCase = (cml as any)?.CASE ?? cml;
  if (!cmlCase || typeof cmlCase !== "object") return;

  const castFromCml: any[] = Array.isArray(cmlCase.cast) ? cmlCase.cast : [];
  const castEntries: any[] = castFromCml.length > 0
    ? castFromCml
    : (Array.isArray(castDesign?.characters) ? castDesign.characters : []);
  if (castEntries.length === 0) return;

  const victimSet = new Set<string>(
    castEntries
      .filter((entry) => isVictimArchetype(roleTextForIntegrity(entry)))
      .map((entry) => normalizeNameLower(entry?.name)),
  );
  const detectiveSet = new Set<string>(
    castEntries
      // X50 (REVIEW_11 §7): `roleTextForIntegrity` coalesces to ONE field and this matched by bare
      // substring, so "the detective's landlady" counted as the detective. Test every role field, with
      // the head-noun predicate that `isVictimArchetype` beside it already uses.
      .filter((entry) => roleTextsOf(entry).some(isDetectiveArchetype))
      .map((entry) => normalizeNameLower(entry?.name)),
  );

  const culpability =
    cmlCase.culpability && typeof cmlCase.culpability === "object"
      ? cmlCase.culpability
      : (cmlCase.culpability = {});

  const existingCulprits: string[] = Array.isArray(culpability.culprits)
    ? culpability.culprits.map((name: any) => String(name ?? "").trim()).filter(Boolean)
    : [];

  const castByName = new Map(
    castEntries
      .map((entry) => [normalizeNameLower(entry?.name), entry] as const)
      .filter(([name]) => name.length > 0),
  );

  const isEligible = (nameLower: string): boolean => {
    const entry = castByName.get(nameLower);
    if (!entry) return false;
    const eligibility = String(entry?.culprit_eligibility ?? "eligible").toLowerCase();
    if (eligibility === "ineligible" || eligibility === "locked") return false;
    return true;
  };

  const validCulprits = existingCulprits.filter((name) => {
    const lowered = normalizeNameLower(name);
    if (!lowered) return false;
    if (victimSet.has(lowered) || detectiveSet.has(lowered)) return false;
    return isEligible(lowered);
  });

  const fallback = castEntries.find((entry) => {
    const lowered = normalizeNameLower(entry?.name);
    if (!lowered) return false;
    if (victimSet.has(lowered) || detectiveSet.has(lowered)) return false;
    return isEligible(lowered);
  });

  const resolvedCulprits: string[] = validCulprits.length > 0
    ? [validCulprits[0]]
    : fallback
      ? [String(fallback.name)]
      : existingCulprits.slice(0, 1);

  const changed =
    resolvedCulprits.length !== existingCulprits.length
    || resolvedCulprits.some((name, idx) => name !== existingCulprits[idx]);

  if (resolvedCulprits.length > 0) {
    culpability.culprits = resolvedCulprits;
    culpability.culprit_count = resolvedCulprits.length;
  }

  const culpritSet = new Set(resolvedCulprits.map((name) => normalizeNameLower(name)));
  for (const entry of castEntries) {
    const lowered = normalizeNameLower(entry?.name);
    if (!lowered) continue;
    if (victimSet.has(lowered)) {
      entry.culprit_eligibility = "ineligible";
      if (entry.culpability === "guilty") entry.culpability = "innocent";
    }
    if (culpritSet.has(lowered)) {
      entry.culprit_eligibility = "eligible";
      entry.culpability = "guilty";
    } else if (entry.culpability === "guilty") {
      entry.culpability = "unknown";
    }
  }

  const proseRequirements =
    cmlCase.prose_requirements && typeof cmlCase.prose_requirements === "object"
      ? cmlCase.prose_requirements
      : (cmlCase.prose_requirements = {});
  if (Array.isArray(proseRequirements.suspect_clearance_scenes)) {
    proseRequirements.suspect_clearance_scenes = proseRequirements.suspect_clearance_scenes.filter((entry: any) => {
      const suspect = normalizeNameLower(entry?.suspect_name);
      if (!suspect) return false;
      if (victimSet.has(suspect)) return false;
      if (culpritSet.has(suspect)) return false;
      return true;
    });
  }

  if (changed) {
    warnings.push(
      `Culprit-role integrity lock adjusted culprit assignment from [${existingCulprits.join(", ") || "none"}] to [${resolvedCulprits.join(", ") || "none"}].`,
    );
  }
};

const extractPronounTargetNames = (errors: any[], castCharacters: CastEntry[]): Set<string> => {
  const targets = new Set<string>();
  if (!Array.isArray(errors) || !Array.isArray(castCharacters) || castCharacters.length === 0) {
    return targets;
  }

  const canonicalByLower = new Map<string, string>(
    castCharacters
      .map((character) => [normalizeNameLower((character as any)?.name), String((character as any)?.name ?? "").trim()] as const)
      .filter(([lowered, canonical]) => lowered.length > 0 && canonical.length > 0),
  );

  for (const error of errors) {
    const type = String(error?.type ?? "").toLowerCase();
    if (type !== "pronoun_drift" && type !== "pronoun_gender_mismatch") continue;
    const message = String(error?.message ?? "");

    // A_66 P5 — repair targets may be seeded ONLY by the high-precision detectors. The
    // ±200-char proximity heuristic ("…found a female pronoun nearby") false-positived on
    // probe #1's CLEAN story 23 times and seeded the corruption; it stays alive as a MEASURE
    // but can never again name a repair target (detectors-are-measures; levers need precision).
    if (type === "pronoun_drift" && /pronoun nearby/i.test(message)) continue;

    const driftMatch = message.match(/Pronoun drift for\s+"([^"]+)"/i);
    const mismatchMatch = message.match(/Character\s+"([^"]+)"\s+has\s+incorrect\s+pronouns/i);
    const rawName = (driftMatch?.[1] ?? mismatchMatch?.[1] ?? "").trim();
    if (!rawName) continue;

    const canonical = canonicalByLower.get(normalizeNameLower(rawName)) ?? rawName;
    targets.add(canonical);
  }

  return targets;
};

export const applyTargetedPronounSweep = (
  prose: any,
  castCharacters: CastEntry[],
  targetNames: Set<string>,
): { prose: any; repairCount: number } => {
  if (!Array.isArray(castCharacters) || castCharacters.length === 0 || targetNames.size === 0) {
    return { prose, repairCount: 0 };
  }

  const onlyNames = new Set(
    Array.from(targetNames)
      .map((name) => String(name ?? "").trim())
      .filter(Boolean),
  );
  if (onlyNames.size === 0) return { prose, repairCount: 0 };

  let repairCount = 0;
  const chapters = (prose.chapters as any[]).map((chapter: any) => {
    const rawText = Array.isArray(chapter.paragraphs)
      ? chapter.paragraphs.map((paragraph: unknown) => String(paragraph ?? "")).join("\n\n")
      : "";
    if (!rawText.trim()) return chapter;

    const normalized = normalizeTitles(rawText);
    const repaired = repairPronouns(normalized, castCharacters as any, {
      onlyNames,
      crossParagraphInheritance: true,
    });
    const repairedText = repaired?.text && repaired.text.length > 0 ? repaired.text : normalized;
    repairCount += repaired?.repairCount ?? 0;

    const mentionsTargetName = Array.from(onlyNames).some((targetName) => {
      const pattern = new RegExp(`\\b${escapeRegex(targetName)}\\b`, "i");
      return pattern.test(repairedText);
    });

    let finalText = repairedText;
    if (mentionsTargetName) {
      const chapterRepair = repairChapterPronouns(
        {
          title: String(chapter?.title ?? ""),
          summary: typeof chapter?.summary === "string" ? chapter.summary : undefined,
          paragraphs: repairedText
            .split("\n\n")
            .map((paragraph: string) => paragraph.trim())
            .filter(Boolean),
        },
        castCharacters as any,
      );
      if (chapterRepair?.repairCount && chapterRepair.repairCount > 0) {
        repairCount += chapterRepair.repairCount;
        finalText = (chapterRepair.chapter.paragraphs ?? []).join("\n\n");
      }
    }

    if (finalText === rawText) {
      return chapter;
    }

    return {
      ...chapter,
      paragraphs: finalText
        .split("\n\n")
        .map((paragraph: string) => paragraph.trim())
        .filter(Boolean),
    };
  });

  return { prose: { ...prose, chapters }, repairCount };
};

type VictimReappearanceIssue = {
  characterName: string;
  deadByChapter: number;
  reappearsChapter: number;
};

const extractVictimReappearanceIssues = (errors: any[]): VictimReappearanceIssue[] => {
  if (!Array.isArray(errors)) return [];
  const issues: VictimReappearanceIssue[] = [];

  for (const err of errors) {
    if (String(err?.type ?? "") !== "victim_reappears_alive") continue;

    const details = err?.details && typeof err.details === "object"
      ? err.details as Record<string, unknown>
      : null;
    const detailedCharacterName = String(details?.characterName ?? "").trim();
    const detailedDeadByChapter = Number(details?.deadByChapter);
    const detailedReappearsChapter = Number(details?.reappearsChapter);
    if (
      detailedCharacterName
      && Number.isFinite(detailedDeadByChapter)
      && Number.isFinite(detailedReappearsChapter)
    ) {
      issues.push({
        characterName: detailedCharacterName,
        deadByChapter: detailedDeadByChapter,
        reappearsChapter: detailedReappearsChapter,
      });
      continue;
    }

    const message = String(err?.message ?? "");
    const match = message.match(/^(.+?)\s+is\s+dead\/victim\s+by\s+chapter\s+(\d+)\s+but\s+appears\s+active\s+in\s+chapter\s+(\d+)/i);
    if (!match) continue;

    const characterName = String(match[1] ?? "").trim();
    const deadByChapter = Number(match[2]);
    const reappearsChapter = Number(match[3]);
    if (!characterName || !Number.isFinite(deadByChapter) || !Number.isFinite(reappearsChapter)) {
      continue;
    }

    issues.push({ characterName, deadByChapter, reappearsChapter });
  }

  return issues;
};

// ANALYSIS_44 follow-up: a dead/victim character given confession language
// (`deceased_character_confesses`) is the same class of defect as `victim_reappears_alive`
// and is repaired the same way (reframe the active sentence as recollection). Surface these
// issues too so a confession-only victim (no separate reappearance flag) is still rescued.
const extractDeceasedConfessionIssues = (errors: any[]): VictimReappearanceIssue[] => {
  if (!Array.isArray(errors)) return [];
  const issues: VictimReappearanceIssue[] = [];
  for (const err of errors) {
    if (String(err?.type ?? "") !== "deceased_character_confesses") continue;
    const details = err?.details && typeof err.details === "object"
      ? err.details as Record<string, unknown>
      : null;
    const characterName = String(details?.characterName ?? "").trim();
    const deadByChapter = Number(details?.deadByChapter);
    const confessesChapter = Number(details?.confessesChapter);
    if (!characterName || !Number.isFinite(deadByChapter)) continue;
    issues.push({
      characterName,
      deadByChapter,
      reappearsChapter: Number.isFinite(confessesChapter) ? confessesChapter : deadByChapter + 1,
    });
  }
  return issues;
};

export const applyLifecycleContinuityGuard = (
  prose: any,
  castCharacters: CastEntry[],
  cml: any,
): { prose: any; replacementCount: number } => {
  if (!Array.isArray(prose?.chapters) || !Array.isArray(castCharacters) || castCharacters.length === 0) {
    return { prose, replacementCount: 0 };
  }

  const victimNames = getVictimNameSet(cml, castCharacters);
  const castNames = castCharacters
    .map((entry) => String((entry as any)?.name ?? "").trim())
    .filter(Boolean);

  let replacementCount = 0;
  const chapters = (prose.chapters as any[]).map((chapter: any) => {
    const paragraphs = Array.isArray(chapter?.paragraphs)
      ? chapter.paragraphs.map((paragraph: unknown) => String(paragraph ?? ""))
      : [];
    if (paragraphs.length === 0) return chapter;

    const sentenceGrid = paragraphs.map((paragraph: string) => splitLifecycleSentences(paragraph));
    const updatedGrid = sentenceGrid.map((sentences: string[]) => [...sentences]);

    for (const fullName of castNames) {
      if (victimNames.has(normalizeNameLower(fullName))) continue;

      const shortName = toLifecycleShortName(fullName);
      if (!shortName || shortName === fullName) continue;

      const namePattern = new RegExp(`\\b${escapeRegex(fullName)}\\b`, "i");
      const replacementPattern = new RegExp(`\\b${escapeRegex(fullName)}\\b`, "g");
      const deathSentenceRefs: Array<{ paragraphIdx: number; sentenceIdx: number }> = [];
      let hasActiveUsage = false;

      for (let paragraphIdx = 0; paragraphIdx < updatedGrid.length; paragraphIdx += 1) {
        const sentences = updatedGrid[paragraphIdx];
        for (let sentenceIdx = 0; sentenceIdx < sentences.length; sentenceIdx += 1) {
          const sentence = sentences[sentenceIdx];
          if (!namePattern.test(sentence)) continue;
          if (LIFECYCLE_DEATH_RE.test(sentence)) {
            deathSentenceRefs.push({ paragraphIdx, sentenceIdx });
          }
          if (LIFECYCLE_ACTIVE_RE.test(sentence)) {
            hasActiveUsage = true;
          }
        }
      }

      if (!hasActiveUsage || deathSentenceRefs.length === 0) continue;

      for (const ref of deathSentenceRefs) {
        const source = updatedGrid[ref.paragraphIdx][ref.sentenceIdx];
        const replaced = source.replace(replacementPattern, shortName);
        if (replaced !== source) {
          updatedGrid[ref.paragraphIdx][ref.sentenceIdx] = replaced;
          replacementCount += 1;
        }
      }
    }

    const updatedParagraphs = updatedGrid.map((sentences: string[], paragraphIdx: number) => {
      if (sentences.length === 0) return paragraphs[paragraphIdx];
      const rebuilt = sanitizeProseText(sentences.join(" "));
      return rebuilt.length > 0 ? rebuilt : paragraphs[paragraphIdx];
    });

    return { ...chapter, paragraphs: updatedParagraphs };
  });

  if (replacementCount > 0) {
    console.warn(
      `[Agent 9] applyLifecycleContinuityGuard: rewrote ${replacementCount} ambiguous death attribution sentence(s) for active non-victim continuity.`,
    );
  }

  return { prose: { ...prose, chapters }, replacementCount };
};

export const applyVictimReappearanceRescue = (
  prose: any,
  castCharacters: CastEntry[],
  cml: any,
  issues: VictimReappearanceIssue[],
): { prose: any; repairCount: number; skippedVictimNames: string[] } => {
  if (!Array.isArray(prose?.chapters) || !Array.isArray(issues) || issues.length === 0) {
    return { prose, repairCount: 0, skippedVictimNames: [] };
  }

  const victimNames = getVictimNameSet(cml, castCharacters);
  const skippedVictimNames: string[] = [];
  const issueByName = new Map<string, VictimReappearanceIssue>();
  for (const issue of issues) {
    const normalized = normalizeNameLower(issue.characterName);
    if (!normalized) continue;
    if (victimNames.has(normalized)) {
      skippedVictimNames.push(issue.characterName);
      continue;
    }
    const existing = issueByName.get(normalized);
    if (!existing || issue.reappearsChapter > existing.reappearsChapter) {
      issueByName.set(normalized, issue);
    }
  }

  if (issueByName.size === 0) {
    return { prose, repairCount: 0, skippedVictimNames };
  }

  let repairCount = 0;
  const chapters = (prose.chapters as any[]).map((chapter: any, chapterIdx: number) => {
    const chapterNumber = chapterIdx + 1;
    const paragraphs = Array.isArray(chapter?.paragraphs)
      ? chapter.paragraphs.map((paragraph: unknown) => String(paragraph ?? ""))
      : [];
    if (paragraphs.length === 0) return chapter;

    const updatedParagraphs = paragraphs.map((paragraph: string) => {
      const sentences = splitLifecycleSentences(paragraph);
      if (sentences.length === 0) return paragraph;
      let paragraphChanged = false;

      for (let sentenceIdx = 0; sentenceIdx < sentences.length; sentenceIdx += 1) {
        let sentence = sentences[sentenceIdx];
        if (!LIFECYCLE_DEATH_RE.test(sentence)) continue;

        for (const issue of issueByName.values()) {
          if (chapterNumber > issue.reappearsChapter) continue;
          const namePattern = new RegExp(`\\b${escapeRegex(issue.characterName)}\\b`, "i");
          if (!namePattern.test(sentence)) continue;

          const shortName = toLifecycleShortName(issue.characterName);
          if (!shortName || shortName === issue.characterName) continue;

          const replacePattern = new RegExp(`\\b${escapeRegex(issue.characterName)}\\b`, "g");
          const updated = sentence.replace(replacePattern, shortName);
          if (updated !== sentence) {
            sentence = updated;
            repairCount += 1;
            paragraphChanged = true;
          }
        }

        sentences[sentenceIdx] = sentence;
      }

      return paragraphChanged ? sanitizeProseText(sentences.join(" ")) : paragraph;
    });

    return { ...chapter, paragraphs: updatedParagraphs };
  });

  if (repairCount > 0) {
    console.warn(
      `[Agent 9] applyVictimReappearanceRescue: repaired ${repairCount} death-attribution sentence(s) for non-victim characters flagged by validation.`,
    );
  }

  return { prose: { ...prose, chapters }, repairCount, skippedVictimNames };
};

// ANALYSIS_43 Phase 2 (G): canonical-victim rescue. `applyVictimReappearanceRescue` (above)
// deliberately SKIPS canonical victim names, so a `victim_reappears_alive` on the CANONICAL
// victim (a dead victim given active dialogue/action) is never repaired and aborts the run.
// This repair handles exactly that case: for the canonical victim's active sentences in
// post-death chapters, it prepends an explicit recollection frame ("In a remembered moment,
// ...") — minimal, grammatical, reversible — which the lifecycle validator now treats as a
// flashback rather than a live appearance (RECOLLECTION_FRAME_RE), clearing the false reappearance.
// A_70 §3 — frame VARIETY, not a single stock opener.
//
// Measured: this one prefix shipped 28 times in `the_bell_tower_s_last_chime.md` (the 79) and 4 times
// in the 2026-07-27 run — the most-repeated machine phrase in the corpus, and a deterministic
// injection rather than an LLM tic. The polish prompt names it and asks the LLM to remove it
// ([post-pass-polish.ts:107]) but polish runs INSIDE generateProse, ~1,600 lines before this
// injection — it is told to delete a phrase that does not exist yet. So the fix belongs here.
//
// Every frame below must be accepted by BOTH the local guard and story-validation's
// RECOLLECTION_FRAME_RE, or the validator still sees a live appearance and the run risks an abort.
// All three are gender-free by design: inferring he/she here would walk straight back into the A_66
// pronoun war. Rotation is deterministic (by repair index), never random, so runs stay reproducible.
const VICTIM_RECOLLECTION_FRAMES = [
  "In a remembered moment, ",
  "In life, ",
  "Before the death, ",
] as const;
/** Retained as the canonical first frame; rotation starts here. */
const VICTIM_RECOLLECTION_PREFIX = VICTIM_RECOLLECTION_FRAMES[0];
const VICTIM_RECOLLECTION_FRAME_RE = /^\s*(?:in a remembered moment\b|in life\b|before the death\b|before (?:she|he|they) (?:died|was killed|was murdered)\b|the memory of\b)/i;

/**
 * A_50 §8 rank 3: match a victim by full name, surname, or possessive — parity with the lifecycle
 * detector's in-sentence name match (incl. dialogue-tag/possessive references) so the rescue reframes
 * EVERY flagged sentence, not only the literal-full-name one (the under-firing that aborted the run).
 */
const victimSentencePattern = (name: string): RegExp => {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  const alts = new Set<string>();
  if (parts.length) alts.add(escapeRegex(parts.join(" ")));
  const surname = parts.length > 1 ? parts[parts.length - 1] : "";
  if (surname.length > 2) alts.add(escapeRegex(surname));
  return new RegExp(`\\b(?:${Array.from(alts).join("|")})(?:['’]s)?\\b`, "i");
};

export const applyCanonicalVictimRescue = (
  prose: any,
  castCharacters: CastEntry[],
  cml: any,
  issues: VictimReappearanceIssue[],
): { prose: any; repairCount: number; reframedVictimNames: string[] } => {
  if (!Array.isArray(prose?.chapters) || !Array.isArray(issues) || issues.length === 0) {
    return { prose, repairCount: 0, reframedVictimNames: [] };
  }

  const victimNames = getVictimNameSet(cml, castCharacters);
  // Only CANONICAL victims here — dedupe by name, keep the earliest deadByChapter.
  const issueByName = new Map<string, VictimReappearanceIssue>();
  for (const issue of issues) {
    const normalized = normalizeNameLower(issue.characterName);
    if (!normalized || !victimNames.has(normalized)) continue;
    const existing = issueByName.get(normalized);
    if (!existing || issue.deadByChapter < existing.deadByChapter) {
      issueByName.set(normalized, issue);
    }
  }
  if (issueByName.size === 0) {
    return { prose, repairCount: 0, reframedVictimNames: [] };
  }

  let repairCount = 0;
  const reframed = new Set<string>();
  const namePatterns = new Map<string, RegExp>();
  for (const issue of issueByName.values()) namePatterns.set(issue.characterName, victimSentencePattern(issue.characterName));
  const chapters = (prose.chapters as any[]).map((chapter: any, chapterIdx: number) => {
    const chapterNumber = chapterIdx + 1;
    const paragraphs = Array.isArray(chapter?.paragraphs)
      ? chapter.paragraphs.map((paragraph: unknown) => String(paragraph ?? ""))
      : [];
    if (paragraphs.length === 0) return chapter;

    const updatedParagraphs = paragraphs.map((paragraph: string) => {
      const sentences = splitLifecycleSentences(paragraph);
      if (sentences.length === 0) return paragraph;
      let changed = false;

      for (let i = 0; i < sentences.length; i += 1) {
        let sentence = sentences[i];
        if (VICTIM_RECOLLECTION_FRAME_RE.test(sentence)) continue; // already a recollection
        // A_50 §8 rank 3: mirror the detector's flag predicates EXACTLY so every flagged sentence is
        // reframed (not just active-verb ones): confession-by-noun/first-person AND active dialogue.
        const confessHit = LIFECYCLE_CONFESSION_RE.test(sentence) && !LIFECYCLE_RECOLLECTION_RE.test(sentence);
        const activeHit = LIFECYCLE_ACTIVE_RE.test(sentence);
        // Leave PURE death/discovery narration untouched — but a death word that co-occurs with a
        // confession/active use ("'I killed him,' the note in her hand read") MUST still reframe.
        if (LIFECYCLE_DEATH_RE.test(sentence) && !confessHit && !activeHit) continue;
        if (!confessHit && !activeHit) continue; // not a flagged sentence

        for (const issue of issueByName.values()) {
          // validator flags confessions with chapter >= deadByChapter, so the death chapter itself is
          // reframable (canonical victim with no prose death ⇒ deadByChapter defaults to 1).
          if (chapterNumber < issue.deadByChapter) continue;
          const namePattern = namePatterns.get(issue.characterName) ?? victimSentencePattern(issue.characterName);
          if (!namePattern.test(sentence)) continue;
          // A_70 §3: rotate the frame so N reframes in one story do not read as one stamped phrase.
          sentence =
            VICTIM_RECOLLECTION_FRAMES[repairCount % VICTIM_RECOLLECTION_FRAMES.length] +
            sentence.replace(/^\s+/, "");
          changed = true;
          repairCount += 1;
          reframed.add(issue.characterName);
          break;
        }
        sentences[i] = sentence;
      }

      return changed ? sanitizeProseText(sentences.join(" ")) : paragraph;
    });

    return { ...chapter, paragraphs: updatedParagraphs };
  });

  if (repairCount > 0) {
    console.warn(
      `[Agent 9] applyCanonicalVictimRescue: reframed ${repairCount} active-victim sentence(s) as recollection for ${reframed.size} canonical victim(s): ${Array.from(reframed).join(", ")}.`,
    );
  }

  return { prose: { ...prose, chapters }, repairCount, reframedVictimNames: Array.from(reframed) };
};

/**
 * A_57 D1 — clean a garbled evidence splice: a stray apostrophe joining two word-tokens with no space
 * that is NEITHER a contraction/possessive ('s, n't, 're, 've, 'll, 'd, 'm, o'clock) NOR a name particle
 * (O'Brien, d'Arcy). These come from forcing a *descriptive* locked-fact value verbatim into prose
 * ("…drizzle'the groundskeeper's entry noting … skies"). Rewrites the stray apostrophe into "; " so the
 * clause is grammatical. Parameter-generic; never touches valid possessives/contractions/names; pure.
 */
export const repairMalformedSurfacing = (prose: any): { prose: any; repairCount: number } => {
  if (!Array.isArray(prose?.chapters)) return { prose, repairCount: 0 };
  const CONTRACTION = /^(?:s|t|re|ve|ll|d|m|clock)$/i;
  const NAME_PARTICLE = /^[odl]$/i;
  let repairCount = 0;
  const chapters = (prose.chapters as any[]).map((ch: any) => {
    if (!Array.isArray(ch?.paragraphs)) return ch;
    const paragraphs = (ch.paragraphs as unknown[]).map((p) =>
      String(p ?? "").replace(/([A-Za-z]+)(['’])([A-Za-z][A-Za-z]*)/g, (whole, before: string, _apos: string, after: string) => {
        if (CONTRACTION.test(after) || NAME_PARTICLE.test(before)) return whole;
        repairCount += 1;
        return `${before}; ${after}`;
      }),
    );
    return { ...ch, paragraphs };
  });
  return { prose: { ...prose, chapters }, repairCount };
};

/**
 * A_57 D5 — a deterministic pronoun-stability validator for `mutateThenValidate`. Counts
 * `pronoun_gender_mismatch` errors via the (synchronous, deterministic) CharacterConsistencyValidator,
 * which reads cast genders from `cml.CASE.cast`. Higher score = fewer misgendered pronouns, so a
 * post-processing pass that RAISES the count regresses and gets reverted, while a pass that lowers it (a
 * genuine repair) ships. Any measurement failure returns "no signal" (score 100) so the gate is inert,
 * never harmful. Exported for unit testing. Pure given pure inputs.
 */
export const buildPronounStabilityValidator =
  (cml: any, runId: string, projectId: string, genderOverride?: Record<string, "male" | "female">) =>
  (currentProse: any): { ok: boolean; score: number; violations: string[] } => {
    let mismatches = 0;
    try {
      const story = {
        id: runId,
        projectId,
        scenes: ((currentProse?.chapters ?? []) as any[]).map((ch: any, idx: number) => ({
          number: idx + 1,
          title: ch?.title,
          text: ((ch?.paragraphs ?? []) as string[]).join("\n\n"),
        })),
      };
      const result = new CharacterConsistencyValidator(genderOverride).validate(story as any, cml as any);
      mismatches = (result.errors ?? []).filter((e: any) => e?.type === "pronoun_gender_mismatch").length;
    } catch {
      return { ok: true, score: 100, violations: [] };
    }
    return {
      ok: mismatches === 0,
      score: 100 - mismatches * 10,
      // A_58 review: the violation label MUST be count-free. mutateThenValidate reverts when the mutated
      // value introduces a violation string not present before; embedding the count made a PARTIAL repair
      // (e.g. 5→2 mismatches) read as a brand-new violation ("…:2" ∉ ["…:5") and get reverted, so only a
      // repair to exactly zero ever shipped. A stable label lets the score comparison gate regressions.
      violations: mismatches > 0 ? ["pronoun_gender_mismatch"] : [],
    };
  };

/**
 * A_66 P2 — the HIGH-PRECISION pronoun guard metric. The A_57 D5 metric above shares the
 * name-anchored fallacy with the repair it guards (probe #1: the corruption SCORED AS AN
 * IMPROVEMENT), so guarded mutations could vandalize with the guard's blessing. This validator
 * counts only the two precision-first detectors — attribution flips ("…," he said after a female
 * referent) and impossible self-references ("Eleanor composed himself") — which carry near-zero
 * false-positive rates by design (their headers say "precision over recall"). A pronoun-mutating
 * pass that RAISES this count is doing damage, whatever the loose metric says. Count-free
 * violation labels (the A_58 lesson). Measurement failure = no signal (inert, never harmful).
 */
export const buildHighPrecisionPronounValidator =
  (castCharacters: CastEntry[]) =>
  (currentProse: any): { ok: boolean; score: number; violations: string[] } => {
    let hits = 0;
    try {
      const cast = (castCharacters as any[])
        .filter((c) => typeof c?.gender === "string" && /^(male|female)$/i.test(c.gender))
        .map((c) => ({ name: String(c.name ?? "").trim(), gender: String(c.gender).toLowerCase() }));
      if (cast.length === 0) return { ok: true, score: 100, violations: [] };
      for (const ch of (currentProse?.chapters ?? []) as any[]) {
        const text = ((ch?.paragraphs ?? []) as string[]).join("\n\n");
        if (!text.trim()) continue;
        hits += detectAttributionFlips(text, cast as any).length;
        hits += detectImpossibleSelfReferences(text, cast as any).length;
      }
    } catch {
      return { ok: true, score: 100, violations: [] };
    }
    return {
      ok: hits === 0,
      score: 100 - hits * 10,
      violations: hits > 0 ? ["pronoun_high_precision_mismatch"] : [],
    };
  };

export const enforceLockedFactValuePresence = (prose: any, lockedFacts: any[]): any => {
  if (!Array.isArray(lockedFacts) || lockedFacts.length === 0) return prose;

  let injectedCount = 0;
  // Global cap: each locked-fact value may be injected at most 2 times across the whole
  // story. Without this, the injection fires on every chapter that lacks the value,
  // producing the same sentence verbatim 7-8 times in an 11-chapter story.
  const MAX_INJECTIONS_PER_FACT = 2;
  const globalInjectionCount = new Map<string, number>();
  // Ledger Item 15: this function runs at MORE THAN ONE call site per run, and each call used to
  // start its count at zero — tide shipped "The hour stood at…" 3× (cap 2). Seed the cap with the
  // template sentences ALREADY present so the cap is idempotent across calls.
  const fullTextForSeed = (prose.chapters as any[])
    .map((ch: any) => (Array.isArray(ch?.paragraphs) ? ch.paragraphs.join("\n\n") : ""))
    .join("\n\n");
  for (const fact of lockedFacts) {
    const canonical = typeof fact?.value === "string" ? fact.value.trim() : "";
    if (!canonical || !isAtomicLockedFactValue(canonical)) continue;
    // X64: the sentence now varies by chapter, so the idempotency seed must count EVERY variant this
    // fact can produce. Counting only one of them would let a re-run re-inject past the cap.
    const factType = classifyFactValue(canonical);
    const factDesc = String(fact?.description ?? "");
    const variants = new Set(
      Array.from({ length: MAX_INJECTIONS_PER_FACT }, (_v, i) =>
        INJECTION_TEMPLATES[factType](factDesc, canonical, String(i)).trim(),
      ),
    );
    let existing = 0;
    for (const variant of variants) {
      if (!variant) continue;
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      existing += (fullTextForSeed.match(new RegExp(escaped, "gi")) ?? []).length;
    }
    if (existing > 0) globalInjectionCount.set(canonical.toLowerCase(), existing);
  }

  const chapters = (prose.chapters as any[]).map((chapter: any, idx: number) => {
    const chapterNumber = idx + 1;
    const paragraphs = Array.isArray(chapter.paragraphs)
      ? chapter.paragraphs.map((p: unknown) => String(p ?? ""))
      : [];
    if (paragraphs.length === 0) return chapter;

    let chapterTextLower = paragraphs.join("\n\n").toLowerCase();
    const updatedParagraphs = [...paragraphs];
    const injectedThisChapter = new Set<string>();

    for (const fact of lockedFacts) {
      const canonical = typeof fact?.value === "string" ? fact.value.trim() : "";
      const description = typeof fact?.description === "string" ? fact.description.trim() : "";
      if (!canonical || !description) continue;
      // A_57 D1: only ATOMIC values (times/numbers/measurements) are force-injected verbatim. DESCRIPTIVE
      // values (log entries, weather notes) are conveyed by the model in its own words (the prose prompt
      // requests that) — force-injecting their exact clause is what produced the garbled splices.
      if (!isAtomicLockedFactValue(canonical)) continue;

      const scopedChapters = Array.isArray(fact?.appearsInChapters)
        ? new Set((fact.appearsInChapters as string[]).map((v) => Number(v)).filter((n) => Number.isFinite(n)))
        : null;
      if (scopedChapters && scopedChapters.size > 0 && !scopedChapters.has(chapterNumber)) {
        continue;
      }

      if (chapterTextLower.includes(canonical.toLowerCase())) {
        continue;
      }

      const descTokens = tokenizeLockedFactDescription(description);
      if (descTokens.length < 2) continue;

      const chapterHits = descTokens.filter((token) => chapterTextLower.includes(token)).length;
      if (chapterHits < 2) continue;

      let bestIdx = -1;
      let bestScore = 0;
      for (let i = 0; i < updatedParagraphs.length; i += 1) {
        const paraLower = updatedParagraphs[i].toLowerCase();
        const score = descTokens.filter((token) => paraLower.includes(token)).length;
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }
      if (bestIdx < 0 || bestScore < 1) continue;

      if (injectedThisChapter.has(canonical.toLowerCase())) continue;
      const globalCount = globalInjectionCount.get(canonical.toLowerCase()) ?? 0;
      if (globalCount >= MAX_INJECTIONS_PER_FACT) continue;
      const valueType = classifyFactValue(canonical);
      const sentence = INJECTION_TEMPLATES[valueType](description, canonical, String(globalCount));
      // F2/F3: skip injection when the template returns an empty string (disabled templates).
      if (sentence.trim().length === 0) continue;
      updatedParagraphs[bestIdx] = `${sentence} ${updatedParagraphs[bestIdx].trim()}`;
      chapterTextLower = updatedParagraphs.join("\n\n").toLowerCase();
      injectedThisChapter.add(canonical.toLowerCase());
      globalInjectionCount.set(canonical.toLowerCase(), globalCount + 1);
      injectedCount += 1;
    }

    return { ...chapter, paragraphs: updatedParagraphs };
  });

  if (injectedCount > 0) {
    console.warn(
      `[Agent 9] enforceLockedFactValuePresence: injected canonical locked-fact value mention(s): ${injectedCount}.`,
    );
  }

  return { ...prose, chapters };
};

/**
 * Deterministic repair: ensures every culprit listed in the CML appears in at least one
 * chapter alongside a culprit term (murderer/responsible/etc.) and an evidence term
 * (evidence/proof/because/etc.), satisfying the SuspectClosureValidator regex gate.
 * Injects a single bridging sentence into the last paragraph of the most relevant chapter
 * when the chain is absent.  No-ops when the chain already exists.
 */
/**
 * #2.3: Shared chapter-injection helper.
 * For each target name: if none of the prose chapters already contain the required content
 * (as judged by `hasContent`), find the last chapter that mentions the target and append
 * the sentence returned by `buildSentence` to its final paragraph.
 * Eliminates ~90 lines of boilerplate from enforceSuspectEliminationPresence,
 * enforceCulpritEvidencePresence, and injectResolutionIfAbsent.
 */
const TITLE_PREFIX_RE_SHARED = /^(?:Dr|Miss|Mrs|Mr|Captain|Col|Colonel|Major|Sir|Lady|Lord|Prof|Reverend|Rev)\.?\s+/i;
const nameInTextShared = (name: string, text: string): boolean => {
  const titleStripped = name.replace(TITLE_PREFIX_RE_SHARED, '');
  if (text.includes(name)) return true;
  if (titleStripped && text.includes(titleStripped)) return true;
  const surname = extractSurname(titleStripped || name);
  return !!surname && text.includes(surname);
};
/**
 * X4 — what an injection reports about itself. Called once per injected sentence, by every floor
 * that routes through `injectSentenceIfAbsent`, so a single recorder sees them all.
 */
export type InjectionRecorder = (event: {
  injector: string;
  target: string;
  chapterIndex: number;
  sentence: string;
}) => void;

/**
 * X4 (REVIEW_05 §10.6) — record that a deterministic floor wrote a sentence the linter forbids the
 * model from writing. **Records; never refuses.**
 *
 * §10.6 weighs refusing the injection (Option 1) and rejects it for now: refusing means shipping
 * without the obligation, which ADR-0003 forbids for a repairable defect — it converts a bad
 * sentence into a missing one. Option 1 becomes available once N7 shows the repair path can land.
 *
 * Until then this is the evidence that decision needs, and the counters are the whole point: they
 * make "the injectors write text the model would be failed for" a NUMBER instead of an anecdote from
 * one run.
 */
export const recordAgent9Injection = (ctx: OrchestratorContext): InjectionRecorder => {
  const counters = (ctx.agent9InjectorLint ??= { injections: 0, violations: 0, byRule: {} });
  return ({ injector, target, chapterIndex, sentence }) => {
    counters.injections += 1;
    for (const rule of findModelBoundRuleViolations(sentence)) {
      counters.violations += 1;
      const key = `${injector}:${rule.id}`;
      counters.byRule[key] = (counters.byRule[key] ?? 0) + 1;
      ctx.warnings.push(
        `[X4] injector-vs-lint: ${injector} injected a sentence into chapter ${chapterIndex + 1} ` +
          `for "${target}" that violates ${rule.id} — a rule the model is held to. ` +
          `The injection STANDS (ADR-0003); this is a record, not a refusal. Rule: ${rule.rule}`,
      );
    }
  };
};

/**
 * Emit X4's counters once per run, to the two channels that outlive the process — `ctx.warnings`
 * (captured wholesale into `run_warnings`) and a report diagnostic an A/B analyser can read without
 * regex over prose.
 *
 * **Emitted even when every count is zero**, for the reason §16/N4 keeps re-teaching: a zero that is
 * never written is indistinguishable from a check that never ran. If the injectors fired zero times
 * this run, that fact is the retirement evidence.
 */
export const emitAgent9InjectorLintTelemetry = (ctx: OrchestratorContext): void => {
  const counters = (ctx.agent9InjectorLint ??= { injections: 0, violations: 0, byRule: {} });
  const byRule = Object.entries(counters.byRule)
    .map(([key, count]) => `${key}=${count}`)
    .join(" ");

  ctx.warnings.push(
    `[X4] agent9 injector-vs-lint telemetry: injections=${counters.injections} ` +
      `violations=${counters.violations}${byRule ? ` ${byRule}` : ""}`,
  );

  try {
    (ctx as any).scoreAggregator?.upsertDiagnostic?.(
      "agent9_injector_lint",
      "agent9_prose",
      "Agent 9 Injector-vs-Lint Counters",
      "agent9_injector_lint",
      { ...counters, byRule: { ...counters.byRule } },
    );
  } catch {
    // Telemetry must never abort a run that produced a manuscript.
  }
};

const injectSentenceIfAbsent = (
  prose: any,
  targets: string[],
  hasContent: (name: string, text: string) => boolean,
  buildSentence: (target: string) => string,
  logTag: string,
  onInject?: InjectionRecorder,
  /**
   * X29 — the last chapter this sentence may be injected into, 1-based. Omitted ⇒ the final chapter,
   * which is the behaviour every caller had. Only the clearance floor passes it: culprit-evidence and
   * resolution BELONG at the end, and bounding them would move the reveal out of the reveal.
   */
  lastChapterAllowed?: number,
): any => {
  const chapters = (prose.chapters as any[]).slice();
  const ceiling =
    typeof lastChapterAllowed === 'number' && lastChapterAllowed >= 1
      ? Math.min(lastChapterAllowed - 1, chapters.length - 1)
      : chapters.length - 1;
  // No chapter to write into (an empty manuscript, or a ceiling below chapter 1) — inject nothing
  // rather than index past the end.
  if (ceiling < 0) return prose;
  for (const target of targets) {
    const alreadyPresent = chapters.some((ch: any) => {
      const text = Array.isArray(ch.paragraphs) ? (ch.paragraphs as string[]).join('\n\n') : '';
      return hasContent(target, text);
    });
    if (alreadyPresent) continue;

    let targetIdx = ceiling;
    for (let i = ceiling; i >= 0; i--) {
      const text = Array.isArray(chapters[i].paragraphs) ? (chapters[i].paragraphs as string[]).join('\n\n') : '';
      if (nameInTextShared(target, text)) { targetIdx = i; break; }
    }

    const ch = chapters[targetIdx];
    const paragraphs: string[] = Array.isArray(ch.paragraphs) ? [...(ch.paragraphs as string[])] : [];
    if (paragraphs.length === 0) continue;
    const lastIdx = paragraphs.length - 1;
    const injectedSentence = buildSentence(target);
    paragraphs[lastIdx] = `${paragraphs[lastIdx].trim()} ${injectedSentence}`;
    chapters[targetIdx] = { ...ch, paragraphs };
    console.warn(`[Agent 9] ${logTag}: injected sentence for "${target}".`);
    // X4 — the injection has already happened. Recording never blocks it (§10.6 Option 2).
    onInject?.({ injector: logTag, target, chapterIndex: targetIdx, sentence: injectedSentence });
  }
  return { ...prose, chapters };
};

/**
 * A_67 FIX-1(b) — the suspect set shared by the deterministic injector floor and the LLM regen gate
 * (class-#5 doctrine: floor and gate agree on WHO must be cleared). Cast minus culprits minus detectives.
 * P1-7: prefer castDesign.characters (Agent 2 normalised) over cml.CASE.cast (Agent 3 raw).
 */
export const computeEliminationSuspects = (cml: any, castDesign?: any): string[] => {
  const rawCast: any[] = Array.isArray(castDesign?.characters)
    ? castDesign.characters
    : Array.isArray(cml?.CASE?.cast)
      ? cml.CASE.cast
      : [];
  const castNames: string[] = rawCast.map((c: any) => String(c?.name ?? '').trim()).filter(Boolean);
  if (castNames.length === 0) return [];
  const culpritSet = new Set<string>(
    Array.isArray(cml?.CASE?.culpability?.culprits)
      ? cml.CASE.culpability.culprits.map((n: any) => String(n ?? '').trim())
      : [],
  );
  const detectiveSet = new Set<string>(
    rawCast
      /**
       * A_67 review bug: the preferred source (castDesign.characters, Agent-2) stores the archetype in
       * camelCase `roleArchetype`, so a bare snake_case `role_archetype` read silently excluded NO
       * detective on the normal path — the injector/regen then "cleared" the sleuth as a suspect.
       *
       * X50 (REVIEW_11 §7) — THE SAME BUG, ONE LAYER DOWN, AND THE A_67 FIX DID NOT REACH IT.
       * That fix cured the KEY and the VALUE broke it again. Agent 2's own prompt mandates, three
       * times, `roleArchetype MUST be "Amateur Sleuth / Civilian Investigator"` — no `detective`
       * substring — and `??` stops at the first NON-NULLISH value, so `c.role` (the
       * `detective|victim|suspect` enum, the one field that answers the question) was never read.
       * MEASURED on run `mystery-1786999938275`: `regen-suspect-elimination UNRESOLVED Eleanor Voss`,
       * the investigator, two repair calls spent clearing the sleuth.
       *
       * `roleTextsOf` tests EVERY role field rather than coalescing to one, and
       * `isDetectiveArchetype` carries all three vocabularies this pipeline emits (detective / sleuth
       * / investigator) with `isVictimArchetype`'s head-noun discipline.
       */
      .filter((c: any) => roleTextsOf(c).some(isDetectiveArchetype))
      .map((c: any) => String(c.name ?? '').trim()),
  );
  // A_68 probe (SUSPECT_ELIM run 1715): the VICTIM was never excluded here — only culprit + detective
  // were — so the elimination injector shipped "Ellsworth was thoroughly cleared by the evidence; the
  // alibi confirmed they could not have committed the crime" for Lady Beatrice ELLSWORTH, the murder
  // victim. You do not clear the victim of being the murderer. Exclude victims the same way the cast-
  // integrity pass does. X50: over ALL role fields, not the first non-nullish one.
  const victimSet = new Set<string>();
  for (const c of rawCast) {
    const name = String(c?.name ?? '').trim();
    if (name && roleTextsOf(c).some(isVictimArchetype)) victimSet.add(name);
  }
  const culpabilityVictim = String(cml?.CASE?.culpability?.victim ?? '').trim();
  if (culpabilityVictim) victimSet.add(culpabilityVictim);
  return castNames.filter(
    (name) => !culpritSet.has(name) && !detectiveSet.has(name) && !victimSet.has(name),
  );
};

/**
 * X29 (REVIEW_08 §7) — `lastClearanceChapter` is geometry's reveal chapter, 1-based, and it bounds the
 * FLOOR the same way it bounds the regen pass above it.
 *
 * The pass was bounded first, and that was half a fix: the floor is the path that runs when regen
 * cannot dramatize a clearance (and the only path at all when `AGENT9_REGEN_SUSPECT_ELIM` is off), it
 * targets "the last chapter that names the suspect", and the aftermath names everyone. So the sentence
 * the aftermath contract forbids kept its own route into the aftermath. Omitted ⇒ unbounded.
 */
export const enforceSuspectEliminationPresence = (
  prose: any,
  cml: any,
  castDesign?: any,
  onInject?: InjectionRecorder,
  lastClearanceChapter?: number,
): any => {
  const suspects = computeEliminationSuspects(cml, castDesign);
  if (suspects.length === 0) {
    if (!Array.isArray(castDesign?.characters) && !Array.isArray(cml?.CASE?.cast)) {
      console.warn('[Agent 9] enforceSuspectEliminationPresence: no cast source available (castDesign and cml.CASE.cast both absent)');
    }
    return prose;
  }

  // A_73 §11.1 — was the seventh copy of this regex. Single-sourced from @cml/prompts-llm; same matcher.
  const ELIMINATION_TERMS = CLEARANCE_TERMS_RE;
  const EVIDENCE_TERMS = /\b(evidence|because|therefore|which\s+proves|proof|alibi|timeline|constraint|observation)\b/i;

  return injectSentenceIfAbsent(
    prose,
    suspects,
    (name, text) => nameInTextShared(name, text) && ELIMINATION_TERMS.test(text) && EVIDENCE_TERMS.test(text),
    (suspect) => buildSuspectClearanceSentence(extractSurname(suspect)),
    'enforceSuspectEliminationPresence',
    onInject,
    lastClearanceChapter,
  );
};

/**
 * A_61 RC1.4 — the F1/A_54 "live culprit" guards, extracted so the culprit-evidence REGEN pass and the
 * deterministic injector floor share ONE guard: a culprit is skipped only when it (a) matches the named
 * victim by full name, or (b) is described as the deceased in Ch1. Co-presence at the crime scene is normal.
 */
export const computeLiveCulprits = (prose: any, cml: any): string[] => {
  const culprits: string[] = Array.isArray(cml?.CASE?.culpability?.culprits)
    ? cml.CASE.culpability.culprits.map((n: any) => String(n ?? '').trim()).filter(Boolean)
    : [];
  if (culprits.length === 0) return [];

  // F1 (A_54 #1): Guard against the REAL victim/culprit identity collision — the CML assigning the
  // discovered-dead character as the culprit (accused in Ch9, already dead in Ch1) — WITHOUT the
  // old false positive. The previous ±250-char window flagged the culprit merely being CO-PRESENT at
  // the Ch1 crime scene, which is normal: in a Golden-Age opening every suspect (incl. the culprit) is
  // in the room when the body is found, so it fired almost every run, suppressed culprit evidence, and
  // gated clean runs to "failure". We now skip injection ONLY when (a) the culprit matches the NAMED
  // VICTIM, or (b) the culprit is the grammatical SUBJECT/OBJECT of a death in Ch1 (tight adjacency).
  // A_56 (run review): match the culprit↔victim collision on the FULL name, not the surname. A shared
  // family surname (culprit "Edward Marwood" vs victim "Edith Marwood") is two DIFFERENT people; the old
  // surname-only test false-fired on any family mystery and suppressed culprit evidence (observed run
  // 09168377). Honorific-stripped, space-collapsed full names distinguish siblings/spouses.
  const stripHonorific = (s: string): string =>
    String(s ?? '')
      .toLowerCase()
      .replace(/\b(?:mr|mrs|ms|miss|dr|sir|lord|lady|mme|mlle|the)\b\.?/g, ' ')
      .replace(/[^a-z\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  const victimFullNames = new Set(
    (Array.isArray(cml?.CASE?.cast) ? cml.CASE.cast : [])
      .filter((c: any) => {
        const role = String(c?.role ?? '').trim().toLowerCase();
        const ra = String(c?.role_archetype ?? '').trim().toLowerCase().replace(/^the\s+/, '');
        return role === 'victim' || ra === 'victim';
      })
      .map((c: any) => stripHonorific(String(c?.name ?? '')))
      .filter(Boolean),
  );
  const DEATH_WORD = `(?:lifeless|dead|slain|killed|murdered|shot|stabbed|strangled|poisoned|slumped|body|corpse|remains)`;
  const ch1Text = ((prose.chapters?.[0]?.paragraphs ?? []) as string[]).join(' ');
  const liveCulprits = culprits.filter((culprit) => {
    const culpritFull = stripHonorific(culprit);
    if (!culpritFull) return true;
    // (a) genuine collision: the culprit IS the named victim (same person — FULL-name equality).
    if (victimFullNames.has(culpritFull)) {
      console.error(
        `[Agent 9] enforceCulpritEvidencePresence: SKIPPED injection for "${culprit}" — the culprit ` +
        `matches the named victim; the CML culprit/victim assignment is invalid (manual CML fix required).`,
      );
      return false;
    }
    // (b) the culprit (by FULL name, so a same-surname victim narrated as dead does NOT trip it) is
    // described as the deceased in Ch1 — a genuinely broken CML where the discovered-dead character is
    // the named culprit. Tight subject/object binding, not mere co-presence near a death word.
    const escFull = culpritFull.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const deathSubjectRE = new RegExp(
      `\\b${escFull}\\b(?:['’]s\\s+(?:body|corpse|remains)` +
        `|\\s+(?:lay|was|had\\s+been|is|'s)\\b[^.!?]{0,30}\\b${DEATH_WORD}\\b` +
        `|\\s*,\\s*(?:now\\s+)?(?:dead|lifeless|slain))` +
        `|\\b(?:body|corpse|remains)\\s+of\\s+${escFull}\\b` +
        `|\\bfound\\s+${escFull}\\b[^.!?]{0,20}\\b${DEATH_WORD}\\b`,
      'i',
    );
    if (deathSubjectRE.test(ch1Text)) {
      console.error(
        `[Agent 9] enforceCulpritEvidencePresence: SKIPPED injection for "${culprit}" — the culprit is ` +
        `described as the deceased in Chapter 1; the CML culprit assignment is likely invalid (manual CML fix required).`,
      );
      return false;
    }
    return true; // co-present at the crime scene is normal — safe to inject culprit evidence.
  });

  return liveCulprits;
};

export const enforceCulpritEvidencePresence = (prose: any, cml: any, onInject?: InjectionRecorder): any => {
  const liveCulprits = computeLiveCulprits(prose, cml);
  if (liveCulprits.length === 0) return prose;

  return injectSentenceIfAbsent(
    prose,
    liveCulprits,
    // A_64 §2 F1 — the SAME predicate the RC1.4 regen pass gates on (class-#5 doctrine: the floor
    // consumes the gate's own signal). The previous local matcher (case-sensitive substring) and the
    // pass's (case-insensitive `\b(name|surname)\b`) disagreed — the v_tide_enforce split-brain that
    // pasted B5 after the pass had judged the story linked.
    (culprit, text) => culpritEvidenceLinkInText(culprit, text),
    // REVIEW_05 §10.1 — the sentence text lives in `injection-templates.ts` with the pattern that
    // recognises it (and the floor's rewrite of it). A local copy here would drift from the checker.
    // A_74 §9.4 / X4 — the floor may write a COMPLIANT sentence instead of a summary verdict.
    // Measured: every injection this floor has ever made breaks verdict_closer (5 injections, 10
    // violations across 18 archived runs). The in-scene form satisfies culpritEvidenceLinkInText and
    // trips no verdict-closer rule — neither refusing the injection nor letting it stand, which is
    // the third option REVIEW_05 §10.6 did not consider. Env read at call time, not module load.
    (culprit) =>
      /^(1|true|yes|on)$/i.test(process.env.AGENT9_CULPRIT_INJECTION_IN_SCENE ?? "")
        ? buildCulpritEvidenceSentenceInScene(culprit)
        : buildCulpritEvidenceSentence(culprit),
    'enforceCulpritEvidencePresence',
    onInject,
  );
};

/**
 * Phase 6 Layer 3: Backstop resolution injector.
 * After all post-processing, if the final chapter lacks resolution markers (confession/arrest/culprit named),
 * inject a minimal resolution paragraph. This is a last-resort guard — Layer 1 (obligation block) and
 * Layer 2 (pre-commit validator) should already have handled this via retries.
 */
const injectResolutionIfAbsent = (prose: any, cml: any, onInject?: InjectionRecorder): any => {
  const chapters: any[] = Array.isArray(prose.chapters) ? prose.chapters : [];
  if (chapters.length === 0) return prose;

  const finalChapter = chapters[chapters.length - 1];
  const culprit: string = ((cml?.CASE?.culpability?.culprits ?? []) as string[])[0] ?? '';
  if (!culprit) return prose;

  const culpritSurname = extractSurname(culprit);
  // RESOLUTION_RE imported from @cml/prompts-llm — shared with agent9-prose.ts (fix #3.2)
  const culpritRE = new RegExp(`\\b${culpritSurname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

  // Ledger Item 11: the resolution may legitimately live in the REVEAL chapter (final_trap/Ch9)
  // with the final chapter as aftermath — injecting a second confession into the final chapter
  // is the duplicated-reveal defect all four S0 external reviews flagged. The floor only fires
  // when NO chapter carries the resolution.
  const anyChapterResolves = chapters.some((ch) => {
    const t = ((ch?.paragraphs ?? []) as string[]).join(' ');
    return RESOLUTION_RE.test(t) && culpritRE.test(t);
  });
  if (anyChapterResolves) {
    return prose; // resolution already present somewhere — never duplicate it into the final chapter
  }

  const paragraphs = [...((finalChapter.paragraphs ?? []) as string[])];
  // Use shared sentence from buildResolutionBackstopSentence so both backstop sites stay in sync (fix #2.4)
  const injectedSentence = buildResolutionBackstopSentence(culpritSurname);
  paragraphs.push(injectedSentence);
  const newChapters = [...chapters];
  newChapters[newChapters.length - 1] = { ...finalChapter, paragraphs };
  console.warn(`[Agent 9] injectResolutionIfAbsent: injected resolution paragraph for "${culprit}".`);
  // X4 — this floor appends a WHOLE paragraph rather than routing through injectSentenceIfAbsent,
  // so it reports itself here. Same recorder, same rules, one more site that cannot go unmeasured.
  onInject?.({
    injector: 'injectResolutionIfAbsent',
    target: culprit,
    chapterIndex: newChapters.length - 1,
    sentence: injectedSentence,
  });
  return { ...prose, chapters: newChapters };
};

// Conservative gender-mismatch counter used to keep the deterministic pronoun
// sweep MONOTONIC: it counts wrong-gender pronouns only in sentences that name
// exactly one gender of known-gender character (no opposite-gender competitor),
// excluding quoted speech. This mirrors the repair's own view of the text, so a
// before/after comparison reliably detects whether the sweep made gendering worse.
const countChapterPronounMismatches = (text: string, castCharacters: CastEntry[]): number => {
  // Ledger Item 13: match on full name OR first name OR surname — the previous full-name-only
  // labels meant a sentence like "Eleanor adjusted his gloves" (bare first name; the dominant
  // register of the prose) was never counted, blinding the monotonicity comparison.
  const chars = (castCharacters as any[])
    .filter((c) => typeof c?.gender === "string" && /^(male|female)$/i.test(c.gender))
    .map((c) => {
      const full = String(c.name ?? "").trim().toLowerCase();
      const parts = full.split(/\s+/).filter((p) => p.length >= 3 && !/^(dr|mr|mrs|miss|ms|sir|lady|lord|captain|colonel|professor|inspector|constable|sergeant|reverend)\.?$/.test(p));
      return { labels: [...new Set([full, ...parts])].filter(Boolean), gender: String(c.gender).toLowerCase() };
    })
    .filter((c) => c.labels.length > 0);
  if (chars.length === 0) return 0;

  // Strip quoted speech so dialogue (which refers to third parties) is not counted.
  const narrative = text.replace(/[“"][^“”"]*[”"]/g, " ").replace(/[‘'][^‘’']*[’']/g, " ");
  const sentences = narrative.split(/(?<=[.!?])\s+/);
  let mismatches = 0;
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    const present = chars.filter((c) =>
      c.labels.some((label) => new RegExp(`\\b${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(lower)),
    );
    if (present.length === 0) continue;
    const genders = new Set(present.map((c) => c.gender));
    if (genders.size !== 1) continue; // ambiguous — a competitor of the other gender is present
    const g = [...genders][0];
    const wrong =
      g === "male"
        ? (sentence.match(/\b(she|her|hers|herself)\b/gi) || []).length
        : (sentence.match(/\b(he|him|his|himself)\b/gi) || []).length;
    mismatches += wrong;
  }
  return mismatches;
};

export const applyDeterministicPronounSweep = (prose: any, castCharacters: CastEntry[]): any => {
  if (!Array.isArray(castCharacters) || castCharacters.length === 0) return prose;

  let repairCount = 0;
  let revertedChapters = 0;
  const chapters = (prose.chapters as any[]).map((chapter: any) => {
    const rawText = Array.isArray(chapter.paragraphs)
      ? chapter.paragraphs.map((p: unknown) => String(p ?? "")).join("\n\n")
      : "";
    if (!rawText.trim()) return chapter;

    // ANALYSIS_17 V-B: normalize title phrases first ("the doctor Finch" → "Dr. Finch")
    const text = normalizeTitles(rawText);
    const titleChanged = text !== rawText;
    const titleNormalizedChapter = () => ({
      ...chapter,
      paragraphs: text.split("\n\n").map((p: string) => p.trim()).filter(Boolean),
    });

    const repaired = repairPronouns(text, castCharacters as any, { crossParagraphInheritance: true });
    if (!repaired || repaired.repairCount <= 0 || repaired.text === text) {
      // Return title-normalized text even if no pronoun repairs were needed
      if (titleChanged) {
        repairCount += 1;
        return titleNormalizedChapter();
      }
      return chapter;
    }

    // Monotonic guard: the full-cast sweep must never INCREASE wrong-gender pronouns.
    // After run_1d55f7c7, cross-paragraph inheritance flipped a correct female run to
    // male; if that ever recurs, discard the swept text (keeping title normalization).
    const before = countChapterPronounMismatches(text, castCharacters);
    const after = countChapterPronounMismatches(repaired.text, castCharacters);
    if (after > before) {
      revertedChapters += 1;
      console.warn(
        `[Agent 9] applyDeterministicPronounSweep: reverted "${chapter.title}" — sweep increased pronoun ` +
        `mismatches (${before} → ${after}); keeping the model's pronouns.`,
      );
      if (titleChanged) {
        repairCount += 1;
        return titleNormalizedChapter();
      }
      return chapter;
    }

    repairCount += repaired.repairCount + (titleChanged ? 1 : 0);
    return {
      ...chapter,
      paragraphs: repaired.text
        .split("\n\n")
        .map((p: string) => p.trim())
        .filter(Boolean),
    };
  });

  if (repairCount > 0 || revertedChapters > 0) {
    console.warn(
      `[Agent 9] applyDeterministicPronounSweep: applied ${repairCount} repair(s)` +
      `${revertedChapters > 0 ? `, reverted ${revertedChapters} chapter(s)` : ""}.`,
    );
  }

  return { ...prose, chapters };
};

/**
 * Normalise chapter titles so all chapters use consistent "Chapter N: Title" format.
 * Chapters with bare number-only or title-only formats are upgraded to number-plus-title.
 * Chapters already in "Chapter N: ..." format are passed through unchanged.
 * This eliminates chapter_title_inconsistency validation warnings caused by mixed formats.
 */
const normalizeChapterTitles = (prose: any): any => {
  const chapters = prose.chapters as any[];
  const getFormat = (title: string) => {
    const t = (title ?? '').trim();
    if (/^chapter\s+\d+:\s*\S/i.test(t)) return 'number-plus-title';
    if (/^chapter\s+\d+$/i.test(t)) return 'number-only';
    if (/^\d+$/.test(t)) return 'bare-number';
    return 'title-only';
  };

  // Two-pass: compute all formats first, then only normalise when mixed.
  const formats = chapters.map((c: any) => getFormat(c.title ?? ''));
  if (formats.every(f => f === 'number-plus-title')) return prose; // already canonical

  // Normalise all outliers to 'number-plus-title' (the canonical format).
  const normalizedChapters = chapters.map((chapter: any, idx: number) => {
    const chapterNum = idx + 1;
    const format = formats[idx];
    if (format === 'number-plus-title') return chapter;

    const existingTitle = (chapter.title ?? '').trim();
    let titlePart: string;
    if (format === 'title-only') {
      titlePart = existingTitle;
    } else {
      // number-only ("Chapter N") or bare-number ("N"): no descriptive title available.
      // Derive a brief label from the opening paragraph for a meaningful result.
      const firstPara = ((chapter.paragraphs as string[])?.[0] ?? '');
      titlePart = firstPara.split(/\s+/).slice(0, 5).join(' ') || String(chapterNum);
    }
    return { ...chapter, title: `Chapter ${chapterNum}: ${titlePart}` };
  });
  return { ...prose, chapters: normalizedChapters };
};

// ── Post-reveal role-alias substitution ────────────────────────────────────────────
// The LLM sometimes uses role-alias phrases ("the killer", "the murderer", etc.)
// in climax/resolution chapters despite the IDENTITY STABILITY prohibition in the
// prompt. This deterministic post-processor replaces those phrases with the
// culprit's canonical name, preventing identity_role_alias_break validation errors.
// (role-alias regex now single-sourced from @cml/story-validation ROLE_ALIAS_TERMS — see the repair below)

export const substituteRoleAliasesInPostRevealChapters = (prose: any, cml: any): any => {
  const cmlCase = (cml as any)?.CASE ?? cml;
  const culprits: string[] = Array.isArray(cmlCase?.culpability?.culprits)
    ? cmlCase.culpability.culprits.map((n: any) => String(n ?? "").trim()).filter(Boolean)
    : [];
  if (culprits.length === 0) return prose;

  const primaryCulprit = culprits[0];
  const chapters = prose.chapters as any[];
  // Roadmap Phase A fix: the post-reveal boundary must mirror the DETECTOR's content-driven pivot, not a
  // static floor(0.8*tc). The old threshold only covered the last ~20% of chapters, so when a reveal was
  // followed by >1 denouement chapter (normal Golden-Age structure), the detector flagged a role alias in
  // a middle post-reveal chapter that the repair skipped → identity_role_alias_break critical aborted the
  // run (M1 clock run, scene 9 of 10). computeArrestPivotIndex returns the FIRST arrest/confession chapter,
  // so rewriting everything AFTER it is a guaranteed superset of what the detector flags. No arrest → no
  // reveal yet → leave prose untouched (never rename a still-hidden culprit). Regex single-sourced from
  // story-validation's ROLE_ALIAS_TERMS so the two can never drift.
  const chapterTexts = chapters.map((ch: any) => (Array.isArray(ch?.paragraphs) ? ch.paragraphs.join(' ') : ''));
  const arrestCi = computeArrestPivotIndex(chapterTexts);
  if (arrestCi < 0) return prose; // no arrest/confession → nothing is post-reveal
  const roleAliasReplaceRe = new RegExp(ROLE_ALIAS_TERMS.source, 'gi');

  // A_64 §2 F4 — the role-predicate guard. In a NEGATED identity predicate ("X could not have been
  // the killer", "X was not the murderer") the alias names a ROLE, not the culprit; substituting the
  // culprit's proper name there produced shipped nonsense ("Beatrice Quill could not have been
  // Captain Ivor Hale", dv_clock_off ch10). A bare skip is not available either — the detector this
  // sweep repairs (identity_role_alias_break, abort-class critical) still flags the alias post-pivot.
  // So under negation we substitute the role word "responsible": clearance meaning preserved, no
  // role-alias term left for the detector, no identity corruption.
  const NEGATED_IDENTITY_TAIL = /(?:\bnot|n['’]t|\bnever)(?:\s+(?:have|has|had))?(?:\s+(?:been|be))?\s*$/i;

  let substitutions = 0;
  let negatedSubstitutions = 0;
  const updatedChapters = chapters.map((chapter: any, ci: number) => {
    if (ci <= arrestCi) return chapter; // at/before the reveal — skip
    const paragraphs = Array.isArray(chapter.paragraphs) ? (chapter.paragraphs as string[]) : [];
    const updatedParagraphs = paragraphs.map((p: string) => {
      return p.replace(roleAliasReplaceRe, (...args: any[]) => {
        const match = String(args[0]);
        const offset = args[args.length - 2] as number;
        const before = p.slice(Math.max(0, offset - 40), offset);
        const after = p.slice(offset + match.length, offset + match.length + 2);
        // Possessive follow ("the killer's target") is REFERENTIAL — the culprit's name is correct
        // there even under negation; "responsible's" would be broken. Guard only bare predicates.
        if (NEGATED_IDENTITY_TAIL.test(before) && !/^['’]/.test(after)) {
          negatedSubstitutions++;
          return "responsible";
        }
        substitutions++;
        return primaryCulprit;
      });
    });
    return { ...chapter, paragraphs: updatedParagraphs };
  });

  if (substitutions > 0 || negatedSubstitutions > 0) {
    console.warn(
      `[Agent 9] substituteRoleAliasesInPostRevealChapters: replaced ${substitutions} role alias(es) → "${primaryCulprit}"` +
        (negatedSubstitutions > 0 ? ` and ${negatedSubstitutions} negated identity predicate(s) → "responsible" (A_64 F4)` : "") +
        ` in post-reveal chapters.`,
    );
  }
  return { ...prose, chapters: updatedChapters };
};

export const applyDeterministicProsePostProcessing = (
  prose: any,
  locationProfiles: any,
  castCharacters: CastEntry[] = [],
  enablePronounRepair: boolean = true,
): any => {
  const anchors: string[] = [];
  if (locationProfiles.primary?.name) anchors.push(locationProfiles.primary.name.toLowerCase());
  (locationProfiles.keyLocations || []).forEach((loc: any) => {
    if (loc?.name) anchors.push(String(loc.name).toLowerCase());
  });

  const seenLongParagraphs = new Set<string>();
  // Separately track grounding leads so they can be deduped across chapters even
  // though they are shorter than the 170-char general dedup threshold.
  const seenGroundingLeads = new Set<string>();
  let totalPronounRepairs = 0;
  let groundingLeadReverts = 0; // §4.2 validation-gated-mutation telemetry (0 unless the flag is on)

  const buildUniqueGroundingLead = (baseIndex: number, preferredLocationName?: string): string => {
    for (let offset = 0; offset < 5; offset++) {
      const candidate = buildDeterministicGroundingLead(baseIndex + offset, locationProfiles, preferredLocationName);
      const key = candidate.replace(/\s+/g, ' ').trim().toLowerCase();
      if (!seenGroundingLeads.has(key)) {
        seenGroundingLeads.add(key);
        return candidate;
      }
    }
    // All 5 templates used — fall back to primary location with a unique offset
    return buildDeterministicGroundingLead(baseIndex + 5, locationProfiles, preferredLocationName);
  };

  const processedChapters = prose.chapters.map((chapter: any, index: number) => {
    const readableParagraphs = enforceReadableParagraphFlow(chapter.paragraphs || []);
    const opening = readableParagraphs.slice(0, 2).join(" ");
    const signals = getGroundingSignals(opening, anchors);

    // A_52 item 3: anchor any rescue lead to a location the chapter actually visits, so we never
    // prepend atmosphere about a room the chapter never enters. Prefer a PROPER-CASE known location
    // already present in the chapter's own prose; fall back to the primary location name.
    const chapterTextLc = readableParagraphs.join(" ").toLowerCase();
    const knownLocationNames: string[] = [];
    if (locationProfiles.primary?.name) knownLocationNames.push(String(locationProfiles.primary.name));
    (locationProfiles.keyLocations || []).forEach((loc: any) => {
      if (loc?.name) knownLocationNames.push(String(loc.name));
    });
    const presentName = knownLocationNames.find((n) => chapterTextLc.includes(n.toLowerCase()));
    const preferredAnchorName =
      presentName ?? (locationProfiles.primary?.name ? String(locationProfiles.primary.name) : undefined);

    // A_52 item 3: the validation-gated rescue is ON by default. The prompt-only experiment (lead OFF)
    // plateaued at 2/9 chapters grounded; this prepends a profile-derived, location-matched grounding
    // sentence ONLY to chapters that fail the scorer, and only if it introduces no metadata dump.
    // Reversible: set AGENT9_GROUNDING_LEAD=0 to restore pure model openings.
    const needsGroundingLead =
      isGroundingLeadEnabled() &&
      (!signals.hasAnchor || signals.sensoryCount < 2 || !signals.hasAtmosphere);
    let groundedParagraphs: string[];
    if (isMutationRevalidationEnabled() && needsGroundingLead) {
      // Validation-gated mutation (§4.2): prepend the grounding lead, but revert to the model's clean
      // opening if doing so introduces a location-metadata-dump (the run_1d55f7c7 §3.2 leak). The
      // mutation ships only if it broke nothing — the universal law, applied here via the shared
      // @cml/prose-guard primitive instead of the bespoke looksMalformed guard.
      const outcome = mutateThenValidate(
        readableParagraphs,
        (paras: string[]) => [buildUniqueGroundingLead(index, preferredAnchorName), ...paras],
        (paras: string[]) => noMetadataDumpValidator(paras.join(" ")),
      );
      groundedParagraphs = outcome.value;
      if (outcome.reverted) {
        groundingLeadReverts += 1;
        console.warn(
          `[Agent 9] mutation-revalidation: reverted grounding lead on chapter ${index + 1} — ` +
            `it would have introduced a location-metadata dump (${outcome.reason}); kept the model's opening.`,
        );
      }
    } else {
      groundedParagraphs = needsGroundingLead
        ? [buildUniqueGroundingLead(index, preferredAnchorName), ...readableParagraphs]
        : readableParagraphs;
    }

    const sanitizedParagraphs = groundedParagraphs
      .map((paragraph: string, paragraphIndex: number) => {
        const cleaned = sanitizeProseText(paragraph);
        if (templateLeakageScaffoldPattern.test(cleaned)) {
          return buildUniqueGroundingLead(index + paragraphIndex, preferredAnchorName);
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
        return buildUniqueGroundingLead(index + paragraphIndex + 1, preferredAnchorName);
      },
    );

    // Deterministic pronoun repair: fix wrong-gender pronouns in unambiguous sentences.
    // Only active when cast characters are provided and enablePronounRepair is true.
    if (castCharacters.length > 0 && enablePronounRepair) {
      const pronRepaired = repairChapterPronouns(
        { ...chapter, paragraphs: leakageDedupedParagraphs },
        castCharacters,
      );
      // A_52 item 6: gate this per-chapter repair with the same monotonic guard the full-cast sweep
      // uses. The §3.3 bug (a pronoun pass flipping a correct gender run) is exactly the unguarded
      // mutation the redesign's "universal law" forbids — yet this sibling call shipped repairChapter-
      // Pronouns' output unvalidated. If the repair did not strictly reduce wrong-gender pronouns, keep
      // the model's. (Title normalisation, if any, is re-applied downstream by applyDeterministicPronoun-
      // Sweep, so reverting here loses nothing permanent.)
      const beforeMismatch = countChapterPronounMismatches(
        leakageDedupedParagraphs.join("\n\n"),
        castCharacters,
      );
      const afterMismatch = countChapterPronounMismatches(
        (pronRepaired.chapter.paragraphs as string[]).join("\n\n"),
        castCharacters,
      );
      if (afterMismatch > beforeMismatch) {
        console.warn(
          `[Agent 9] applyDeterministicProsePostProcessing: reverted per-chapter pronoun repair on ` +
            `chapter ${index + 1} — it increased pronoun mismatches (${beforeMismatch} → ${afterMismatch}); ` +
            `kept the model's pronouns.`,
        );
        return { ...chapter, paragraphs: leakageDedupedParagraphs };
      }
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
    groundingLeadReverts,
  };
};

const chapterHeadingPrefixPattern = /^\s*chapter\s+\d+\s*:\s*/i;

/**
 * #10: Naming note — two similarly-named chapter title functions serve different purposes:
 * - `normalizeChapterTitle(value)` — sanitises a SINGLE raw chapter title from the LLM
 *   response: strips outer sanitizeProseText artifacts and removes the leading "Chapter N: "
 *   prefix so the descriptive portion is returned clean.  Used inside `sanitizeProseResult`.
 * - `normalizeChapterTitles(prose)` — normalises ALL chapter titles in a prose object so
 *   all chapters use the same "Chapter N: Title" format.  Runs as a separate post-processing
 *   step after scoring because it needs the full chapter array to detect mixed formats.
 * The two are complementary, not alternatives — do not merge them.
 */
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
    paragraphs: (chapter.paragraphs || [])
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

export const reconcileDiscriminatingEvidenceIdsToCanonicalNamespace = (
  cmlCase: any,
  canonicalClueIdsInput: Iterable<string>,
): {
  referencedIds: string[];
  finalIds: string[];
  nonCanonicalIds: string[];
  removedNonCanonical: string[];
  seededFromMapping: string[];
  repaired: boolean;
} => {
  const discrimTest = cmlCase?.discriminating_test;
  if (!discrimTest || !Array.isArray(discrimTest.evidence_clues)) {
    return {
      referencedIds: [],
      finalIds: [],
      nonCanonicalIds: [],
      removedNonCanonical: [],
      seededFromMapping: [],
      repaired: false,
    };
  }

  const canonicalClueIds = new Set(
    Array.from(canonicalClueIdsInput)
      .map((id) => String(id ?? "").trim())
      .filter(Boolean),
  );
  const referencedIds: string[] = discrimTest.evidence_clues
    .map((id: unknown) => String(id ?? "").trim())
    .filter(Boolean);
  const canonicalEvidenceIds = referencedIds.filter((id) => canonicalClueIds.has(id));
  const nonCanonicalIds = referencedIds.filter((id) => !canonicalClueIds.has(id));
  const finalIds = [...new Set(canonicalEvidenceIds)];
  const seededFromMapping: string[] = [];

  const mappingIds: string[] = Array.isArray(cmlCase?.prose_requirements?.clue_to_scene_mapping)
    ? cmlCase.prose_requirements.clue_to_scene_mapping
      .map((entry: any) => String(entry?.clue_id ?? "").trim())
      .filter((id: string) => Boolean(id) && canonicalClueIds.has(id))
    : [];

  if (finalIds.length < 2) {
    for (const mappingId of mappingIds) {
      if (!finalIds.includes(mappingId)) {
        finalIds.push(mappingId);
        seededFromMapping.push(mappingId);
      }
      if (finalIds.length >= 3) break;
    }
  }

  if (finalIds.length < 2) {
    for (const fallbackId of canonicalClueIds) {
      if (!finalIds.includes(fallbackId)) {
        finalIds.push(fallbackId);
      }
      if (finalIds.length >= 2) break;
    }
  }

  const repaired =
    nonCanonicalIds.length > 0
    || finalIds.length !== referencedIds.length
    || finalIds.some((id, index) => id !== referencedIds[index]);

  if (repaired) {
    discrimTest.evidence_clues = finalIds;
  }

  const remainingNonCanonical = finalIds.filter((id) => !canonicalClueIds.has(id));

  return {
    referencedIds,
    finalIds,
    nonCanonicalIds: remainingNonCanonical,
    removedNonCanonical: nonCanonicalIds,
    seededFromMapping,
    repaired,
  };
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
    let chapterIsDense = false;
    if (paragraphs.length < 3) {
      underParagraphCount += 1;
      chapterIsDense = true;
    }
    const overlong = paragraphs.filter((paragraph: string) => paragraph.length > 2400).length;
    if (overlong > 0) {
      severeParagraphBlocks += overlong;
      chapterIsDense = true;
    }
    if (chapterIsDense) denseChapterCount += 1;
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

  // Convert to array once — avoids re-allocating Array.from(knownAnchors) per chapter.
  const anchorList = Array.from(knownAnchors);
  let grounded = 0;
  prose.chapters.forEach((chapter: any) => {
    const opening = (chapter.paragraphs || []).slice(0, 2).join(" ").toLowerCase();
    const signals = getGroundingSignals(opening, anchorList);
    if (signals.hasAnchor && signals.sensoryCount >= 2 && signals.hasAtmosphere) {
      grounded += 1;
    }
  });

  const coverage = prose.chapters.length > 0 ? grounded / prose.chapters.length : 0;
  return { grounded, total: prose.chapters.length, coverage };
};

export const partitionNsdRevealedCluesForReleaseGate = (
  nsdRevealedClues: Iterable<string>,
  expectedClueIds: Iterable<string>,
  optionalClueIds: Iterable<string> = [],
) => {
  const expected = new Set(Array.from(expectedClueIds).map((id) => String(id)));
  const optional = new Set(Array.from(optionalClueIds).map((id) => String(id)));
  const enforceable: string[] = [];
  const advisoryOnly: string[] = [];
  const optionalDowngraded: string[] = [];
  for (const rawId of nsdRevealedClues) {
    const id = String(rawId);
    if (!expected.has(id)) {
      advisoryOnly.push(id);
    } else if (optional.has(id)) {
      // Optional-criticality clues are texture, not fair-play-load-bearing: a missing prose
      // anchor for one can NEVER be a fair-play failure, so it must never hard-stop the run.
      // (e.g. clue_late_optional_slot_1 — a strict-mapping-contract filler Agent 5 is required
      // to synthesize; run mystery-1784055526685 hard-aborted on exactly this.) Essential and
      // supporting clues stay enforceable.
      optionalDowngraded.push(id);
    } else {
      enforceable.push(id);
    }
  }
  return {
    enforceable,
    advisoryOnly,
    optionalDowngraded,
  };
};

const placeholderRoleSurnamePattern =
  /\b(?:a|an|the)\s+(inspector|detective|constable|sergeant|captain|gentleman|lady|woman|man|doctor)\s+([A-Z][a-z]+(?:[-''][A-Z][a-z]+)?)\b/g;
const placeholderNamedStandalonePattern = /\b(?:a woman|a man) ([A-Z][a-z]+)\b/g;
// "a woman X" / "a man X" is a placeholder only when X is an APPOSITIVE name
// ("a woman Quill, pale and shaking"). When X is the SUBJECT of a relative clause —
// "a woman Eleanor had once mentored" = "a woman [whom] Eleanor had mentored" — it is
// ordinary prose, not leakage. The following token discriminates: a verb/auxiliary or
// relativizer ⇒ relative clause ⇒ NOT a placeholder. (The role+surname branch already
// guards itself via the known-cast-name filter; this is the equivalent guard.)
const relativeClauseFollowerPattern =
  /^\s+(?:had|has|have|was|were|is|are|am|will|would|could|should|did|does|do|been|who|whom|that|which|she|he|they|then|once|never|always|often|seldom|might|may|must)\b/i;
const placeholderGenericRolePattern =
  /\b(a gentleman|an inspector|a detective|a constable|a sergeant|a captain|a doctor)\b/gi;

export const evaluatePlaceholderLeakage = (prose: any, castSurnames?: Set<string>) => {
  const joined = prose.chapters
    .map((chapter: any) => {
      const body = (chapter.paragraphs || []).join("\n");
      return `${chapter.title}\n${chapter.summary ?? ""}\n${body}`;
    })
    .join("\n\n");

  // Only flag role+surname matches where the surname belongs to a known cast member.
  // "a gentleman Ashcroft" where Ashcroft is a minor background character is valid prose,
  // not a placeholder — the false positive fires when the LLM uses "a gentleman Hale"
  // instead of the proper character name.
  const allRoleSurnameMatches = (Array.from(joined.matchAll(placeholderRoleSurnamePattern)) as RegExpMatchArray[]);
  const roleSurnameMatches = allRoleSurnameMatches
    .filter((match) => !castSurnames || castSurnames.has(match[2]))
    .map((match) => match[0]);
  const namedStandaloneMatches = (Array.from(
    joined.matchAll(placeholderNamedStandalonePattern),
  ) as RegExpMatchArray[])
    // Drop relative-clause uses ("a woman Eleanor had once mentored") — the name is the clause
    // subject, not an apposed placeholder. This is the false positive that hard-stopped good,
    // complete stories whose victim prose read "a woman <Detective> had once mentored …".
    .filter((match) => !relativeClauseFollowerPattern.test(joined.slice((match.index ?? 0) + match[0].length)))
    .map((match) => match[0]);
  const genericRoleMatches = joined.match(placeholderGenericRolePattern) || [];
  const uniqueRoleSurnameMatches = Array.from(new Set(roleSurnameMatches));
  const uniqueStandaloneMatches = Array.from(new Set(namedStandaloneMatches));

  return {
    roleSurnameCount: roleSurnameMatches.length,
    standaloneCount: namedStandaloneMatches.length,
    genericRoleCount: genericRoleMatches.length,
    // Surface BOTH offending kinds so a future leakage abort names its token (this diagnosis
    // had to be reconstructed from the raw prose because standalone examples weren't reported).
    examples: [...uniqueRoleSurnameMatches, ...uniqueStandaloneMatches].slice(0, 5),
    severeLeakage: roleSurnameMatches.length > 0 || namedStandaloneMatches.length >= 2,
    hasLeakage:
      roleSurnameMatches.length > 0 ||
      namedStandaloneMatches.length > 0 ||
      genericRoleMatches.length >= 25, // P1-5: raised from 12 to avoid false positives in stories featuring a doctor/captain
  };
};

const evaluateChapterHeadingArtifacts = (prose: any) => {
  const offending = prose.chapters.filter((chapter: any) =>
    chapterHeadingPrefixPattern.test(chapter.title || ""),
  );
  return { duplicatedHeadingCount: offending.length, hasArtifacts: offending.length > 0 };
};

type CmlUsageValidationResult = {
  errors: string[];
  warnings: string[];
};

const validateCmlUsageForProse = (
  cml: any,
  clues: any,
  castDesign: any,
  maxSceneNumber: number,
): CmlUsageValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const cmlCase = (cml as any)?.CASE ?? cml;
  const castNames = new Set<string>(
    ((castDesign?.characters ?? []) as any[])
      .map((c: any) => String(c?.name ?? "").trim())
      .filter((name: string) => name.length > 0),
  );
  const clueIds = new Set<string>(
    ((clues?.clues ?? []) as any[])
      .map((clue: any) => String(clue?.id ?? "").trim())
      .filter((id: string) => id.length > 0),
  );

  const culpritNames: string[] = Array.isArray(cmlCase?.culpability?.culprits)
    ? cmlCase.culpability.culprits.map((name: any) => String(name ?? "").trim()).filter(Boolean)
    : [];
  for (const culprit of culpritNames) {
    if (!castNames.has(culprit)) {
      errors.push(
        `CML usage invalid: culprit \"${culprit}\" is not present in cast.characters.`,
      );
    }
  }

  const mapping = Array.isArray(cmlCase?.prose_requirements?.clue_to_scene_mapping)
    ? cmlCase.prose_requirements.clue_to_scene_mapping
    : [];
  for (const entry of mapping as any[]) {
    const clueId = String(entry?.clue_id ?? "").trim();
    const actNumberRaw = entry?.act_number;
    const sceneNumberRaw = entry?.scene_number;
    const hasSceneNumber = sceneNumberRaw !== undefined && sceneNumberRaw !== null && String(sceneNumberRaw).trim() !== "";
    const actNumber = Number(actNumberRaw);
    const sceneNumber = hasSceneNumber ? Number(sceneNumberRaw) : undefined;

    if (!clueId) {
      errors.push("CML usage invalid: prose_requirements.clue_to_scene_mapping entry is missing clue_id.");
      continue;
    }
    if (!Number.isFinite(actNumber) || !Number.isInteger(actNumber) || actNumber < 1) {
      errors.push(
        `CML usage invalid: clue mapping for \"${clueId}\" has invalid act_number (${String(actNumberRaw)}).`,
      );
      continue;
    }
    if (hasSceneNumber && (!Number.isFinite(sceneNumber) || !Number.isInteger(sceneNumber!))) {
      errors.push(
        `CML usage invalid: clue mapping for \"${clueId}\" has non-integer scene_number (${String(sceneNumberRaw)}).`,
      );
      continue;
    }
    if (hasSceneNumber && (sceneNumber! < 1 || (maxSceneNumber > 0 && sceneNumber! > maxSceneNumber))) {
      errors.push(
        `CML usage invalid: clue mapping for \"${clueId}\" points to scene ${sceneNumber}, outside valid range 1-${maxSceneNumber}.`,
      );
    }
    if (!clueIds.has(clueId)) {
      warnings.push(
        `CML usage warning: clue mapping references \"${clueId}\" but this id is not present in clue distribution.`,
      );
    }
  }

  const identityRules = Array.isArray(cmlCase?.prose_requirements?.identity_rules)
    ? cmlCase.prose_requirements.identity_rules
    : [];
  for (const rule of identityRules as any[]) {
    const character = String(rule?.character ?? "").trim();
    if (character && !castNames.has(character)) {
      warnings.push(
        `CML usage warning: identity rule references unknown cast character \"${character}\".`,
      );
    }
  }

  return { errors, warnings };
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
// repairUnanchoredNsdCluesBeforeGate — A_62 abort class #5
// ============================================================================

/**
 * A_62 abort class #5 (M1v5 run 1, `mystery-1784238677818`, poison): the release gate hard-stopped
 * on `clue_core_contradiction_chain` — an ESSENTIAL clue — with `corrective_attempts: 0`, while the
 * prose was saturated with the clue's content ("confirming the residue of poison", "poison …
 * had found its way into the victim"). Two defects compounded:
 *
 *   1. SPLIT-BRAIN MATCHERS. The generation/repair side satisfies its obligations via
 *      `chapterMentionsRequiredClue` (clue-validation); the release gate enforces
 *      `collectClueEvidenceFromProse` (scoring-adapter), whose semantic pass needs >=3 signature
 *      tokens co-occurring in ONE paragraph (min 2, ratio 0.28 over ~8 tokens). Good prose
 *      disperses an idea across sentences, so the gate can fail text the ledger passed — and
 *      nothing upstream ever repairs what only the gate can see. The RC-2 rule ("a cap has a lever
 *      iff its detector is reachable from the generation loop") violated between gate and lever.
 *   2. THE BATCH LOOP PAPERS OVER IT. At batch time the same condition is detected
 *      (`cluesWithNoAnchor`) and "fixed" with SYNTHETIC trace anchors — telemetry parity, prose
 *      untouched — so the run sails on toward a certain hard-stop 7 chapters later.
 *
 * This helper is the missing repair edge, run at the gate BEFORE the hard-stop fires: for each
 * enforceable NSD-revealed clue with no anchor, plant it via the EXISTING `missing_clue` insertion
 * regen into the chapter whose NSD step claimed the reveal — with the acceptance validator being
 * THE GATE'S OWN MATCHER (injected `collectEvidence`), so cap and lever key off one function and a
 * passing repair provably clears the stop. Insertion-only (original paragraphs preserved — the
 * repair.ts:153 lesson); whatever regen cannot resolve still hard-stops, exactly as today.
 *
 * Post-validation-mutation caveat (the standing agent9 trap): this runs AFTER story-validation, so
 * the planted paragraph is validated by (a) the insertion pass's own validators, (b) the re-run
 * post-processing hygiene chain, (c) the gate's re-collection + its remaining checks (control
 * chars / mojibake run after this point) — but NOT by the full story-validation suite. That
 * residual is logged as a warning on every repair so it is never silent.
 */
export const repairUnanchoredNsdCluesBeforeGate = async (args: {
  chapters: any[];
  unanchoredClueIds: readonly string[];
  nsdTransferTrace: ReadonlyArray<any>;
  cmlCase: any;
  clues: any;
  bible: any;
  regen: (req: any) => Promise<any>;
  /** THE GATE'S matcher, injected — the same function the hard-stop keys off. */
  collectEvidence: (chapters: any[], cmlCase: any, clues: any) => { visibleClueIds: string[] };
  onNote?: (msg: string) => void;
  maxAttemptsPerDefect?: number;
  /** Class #12: appended to each defect's regen instruction on the post-hygiene retry round —
   * steers the plant away from the phrasings the hygiene chain rewrites (names/titles). */
  detailSuffix?: string;
}): Promise<{ chapters: any[]; repaired: string[]; unresolved: string[] }> => {
  const chapters = [...args.chapters];
  const repaired: string[] = [];
  const unresolved: string[] = [];
  if (args.unanchoredClueIds.length === 0 || chapters.length === 0) {
    return { chapters, repaired, unresolved: [...args.unanchoredClueIds] };
  }

  const clueById = new Map(
    ((Array.isArray(args.clues?.clues) ? args.clues.clues : []) as any[])
      .map((c: any) => [String(c?.id ?? "").trim(), c] as const)
      .filter(([id]) => id.length > 0),
  );

  // Target the chapter whose NSD step claimed the reveal (its batch_end — where the batch-time
  // synthetic anchor pointed); clamp into range, fall back to an early chapter.
  const byChapter = new Map<number, string[]>();
  for (const clueId of args.unanchoredClueIds) {
    const step = args.nsdTransferTrace.find(
      (s: any) => Array.isArray(s?.newly_revealed_clue_ids) && s.newly_revealed_clue_ids.includes(clueId),
    );
    const raw = Number(step?.batch_end ?? 0);
    const chapterNumber = Math.min(Math.max(raw >= 1 ? raw : 2, 1), chapters.length);
    byChapter.set(chapterNumber, [...(byChapter.get(chapterNumber) ?? []), clueId]);
  }

  for (const [chapterNumber, clueIds] of byChapter) {
    const idx = chapterNumber - 1;
    const chapter = chapters[idx];
    if (!chapter) {
      unresolved.push(...clueIds);
      continue;
    }
    const defects = clueIds.map((clueId) => {
      const clue: any = clueById.get(clueId);
      const observable = String(clue?.observable ?? clue?.description ?? clueId);
      return {
        chapter: chapterNumber,
        kind: "missing_clue" as const,
        obligationRef: clueId,
        detail: `NSD claims this clue was revealed in ch${chapterNumber} but the release-gate matcher finds no prose anchor. Plant it as a concrete in-scene observation: ${observable}${args.detailSuffix ?? ""}`,
        severity: "hard" as const,
      };
    });
    const presenceValidatorFor = (defect: any) => (c: any) => {
      const ok = args
        .collectEvidence([c], args.cmlCase, args.clues)
        .visibleClueIds.includes(String(defect.obligationRef ?? ""));
      return {
        ok,
        score: ok ? 100 : 0,
        violations: ok ? [] : [`nsd_unanchored:${defect.obligationRef}`],
      };
    };
    const pass = await runInsertionRegenPass({
      chapter,
      defects,
      bible: args.bible,
      regen: args.regen as any,
      presenceValidatorFor,
      maxAttemptsPerDefect: args.maxAttemptsPerDefect ?? 2,
      onUnresolved: (d: any, reason: string) =>
        args.onNote?.(`[Agent 9] NSD-anchor regen UNRESOLVED ch${chapterNumber} ${d.obligationRef}: ${reason} (deterministic floor next).`),
    });
    if (pass.ran) chapters[idx] = pass.chapter;
    let stillUnresolved = [...pass.unresolved];
    // Class #13 (P5-DV tide_on, mystery-1784576986525): the Azure content filter starved the
    // anchor regen — every attempt filtered, zero candidates, certain hard-stop. Deterministic
    // floor, same doctrine as the clue/clearance patches: append a neutral-subject paragraph
    // carrying the clue's observable text ("The record now held" is the production builder's
    // detector-non-membership-tested phrasing; class-#6 rule — no cast name shares the term
    // sentence), accept iff THE GATE'S OWN matcher sees it. A flat sentence risks a rubric cap;
    // a cap beats an abort (repair-not-abort).
    for (const clueId of [...stillUnresolved]) {
      const clue: any = clueById.get(clueId);
      const observable = String(clue?.observable ?? clue?.description ?? "").trim().replace(/\.+$/, "");
      if (!observable) continue;
      const paragraph = `The record now held one further detail, set down without comment: ${observable}.`;
      const current = chapters[idx];
      const candidate = { ...current, paragraphs: [...(current?.paragraphs ?? []), paragraph] };
      const ok = args
        .collectEvidence([candidate], args.cmlCase, args.clues)
        .visibleClueIds.includes(clueId);
      if (ok) {
        chapters[idx] = candidate;
        stillUnresolved = stillUnresolved.filter((id) => id !== clueId);
        repaired.push(clueId);
        args.onNote?.(
          `[Agent 9] NSD-anchor DETERMINISTIC floor planted ${clueId} in ch${chapterNumber} (regen starved — class #13); gate matcher accepted.`,
        );
      } else {
        args.onNote?.(
          `[Agent 9] NSD-anchor deterministic floor for ${clueId} NOT accepted by the gate matcher (hard-stop stands).`,
        );
      }
    }
    repaired.push(...pass.repaired);
    unresolved.push(...stillUnresolved);
    if (pass.repaired.length > 0) {
      args.onNote?.(
        `[Agent 9] NSD-anchor regen planted [${pass.repaired.join(", ")}] in ch${chapterNumber} via the gate's own matcher. ` +
        `NOTE: the planted paragraph is post-story-validation (insertion-validated + hygiene only) — A_62 class #5 residual.`,
      );
    }
  }
  return { chapters, repaired, unresolved };
};

// ============================================================================
// Agent 7.5 geometry — the Agent-9 half of the interface
// ============================================================================

/**
 * Phase 3 of the geometry build sequence: the post-prose acceptance test.
 *
 * `off` — not run.
 * `shadow` — re-check the contract against the committed manuscript and record every constraint's
 *            outcome, satisfied ones included. Deterministic and free (no LLM call), which is why
 *            this is the default: the alternative is a checker that ships dark, and "checkers get
 *            built and never wired" is the failure mode this whole design was written against.
 * `apply` — additionally route chapter-scoped violations into the repair ladder.
 *
 * Runtime getter, never a module const (`module-const-flags-frozen-before-dotenv`).
 */
type GeometryAcceptanceMode = "off" | "shadow" | "apply";
const resolveGeometryAcceptanceMode = (env: NodeJS.ProcessEnv = process.env): GeometryAcceptanceMode => {
  const raw = String(env.AGENT9_GEOMETRY_ACCEPTANCE ?? "").trim().toLowerCase();
  if (raw === "off" || raw === "0" || raw === "false" || raw === "no") return "off";
  if (raw === "apply" || raw === "on" || raw === "1" || raw === "true") return "apply";
  return "shadow";
};

/** The thirteenth regen pass — the first negative one. Default OFF. */
const isAftermathRepeatRegenEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_REGEN_AFTERMATH_REPEAT ?? ""));

/**
 * N7 (REVIEW_08 §3) — route the REVEAL family off the insertion-only channel and onto one that may
 * modify. Default OFF, runtime-read.
 *
 * With the flag off, `reveal_culprit_not_named` / `reveal_method_absent` / `reveal_motive_absent` keep
 * going to `runInsertionRegenPass` exactly as on the 08-07 run — where all three attempts failed with
 * `modified_or_dropped_original_paragraph`, because a reveal is not something a chapter can be given
 * one more paragraph of. On, they go to `runRevealRepairRegenPass` over the pinned edit-list channel.
 */
const isRevealModifyRegenEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_REGEN_REVEAL_MODIFY ?? ""));

/**
 * The geometry codes whose repair REQUIRES modifying an existing paragraph — the N7 partition.
 *
 * Everything else geometry routes is additive: a method signature, a clincher plant and a clincher
 * payoff are all things a chapter can carry one more observation of, and insertion-only is the
 * stronger guard when it can work at all. These three are the chapter's own climax; there is no
 * paragraph to add that makes the reveal have happened.
 */
export const GEOMETRY_CODES_NEEDING_MODIFY: ReadonlySet<string> = new Set([
  "reveal_culprit_not_named",
  "reveal_method_absent",
  "reveal_motive_absent",
]);

/**
 * The defect kinds geometry violations map onto — all of them pre-existing (§8.5 "reuse").
 * `aftermath_repeat` is deliberately absent: it is the one violation with no reusable pass, and it
 * has its own runner rather than a mapping.
 */
type GeometryRepairDefectKind = "missing_clue" | "culprit_unlinked" | "missing_resolution";

/**
 * The reuse map, hoisted to module scope so it can be ASSERTED against the code list rather than
 * inspected by reading (X1, REVIEW_05 §12.1). Every geometry code is either here, in
 * `GEOMETRY_CODES_WITH_OWN_PASS`, or in `GEOMETRY_CODES_WITHOUT_PROSE_REPAIR` with a reason —
 * a total partition, enforced by test.
 */
export const GEOMETRY_DEFECT_KIND_BY_CODE: Readonly<Record<string, GeometryRepairDefectKind>> = {
  method_signature_absent: "missing_clue",
  clincher_not_planted: "missing_clue",
  clincher_absent_at_payoff: "culprit_unlinked",
  reveal_culprit_not_named: "missing_resolution",
  reveal_method_absent: "missing_resolution",
  reveal_motive_absent: "missing_resolution",
  // X44 — the reveal states one of the case's two times, or neither. Same family as the three above:
  // a disclosure obligation the bound chapter did not deliver, and the resolution pass is the one that
  // rewrites a reveal into completeness. Distinct from `time_anchors_absent`, which is excused from
  // prose repair because ITS repair is to the case; this one is on the page and fixable there.
  reveal_times_not_stated: "missing_resolution",
};

// ============================================================================
// runAgent9
// ============================================================================

/**
 * PRONOUN COVERAGE — say so when a character sits outside what the checks can read.
 *
 * FOUND BY REVIEW, 2026-08-20. Agent 2 is explicitly invited to produce `non-binary` characters:
 * `agent2-cast.ts` prints "gender (male|female|non-binary)" in the schema block and the type allows
 * it. Three pronoun detectors in this file — attribution flips, impossible self-references, and the
 * he/she monotonicity comparison — filter the cast with `/^(male|female)$/i`, so such a character is
 * dropped from every one of them WITHOUT A WORD.
 *
 * That exclusion is the safe half of a choice: including them in a binary he/she comparison would
 * manufacture false positives, and singular "they" is genuinely ambiguous with the plural, so a
 * detector for it is not a small change. What is NOT defensible is doing it silently. This project
 * has spent several work items on pronoun drift because a reader named it; a character the machinery
 * cannot check should be visible in the run log rather than discovered in a manuscript.
 *
 * MEASURED: 0 of 154 archived characters carry a value outside male/female, so this is latent, not a
 * live defect. It fires the first time the model accepts the invitation.
 */
const PRONOUN_CHECKED_GENDERS = /^(male|female)$/i;

export const warnOnUncheckedPronounGenders = (
  castCharacters: ReadonlyArray<{ name?: unknown; gender?: unknown }>,
  warn: (message: string) => void,
): void => {
  const unchecked = (castCharacters ?? [])
    .filter((c) => {
      const g = String(c?.gender ?? "").trim();
      return g.length > 0 && !PRONOUN_CHECKED_GENDERS.test(g);
    })
    .map((c) => `${String(c?.name ?? "(unnamed)")} (${String(c?.gender)})`);
  if (unchecked.length === 0) return;
  warn(
    `[pronoun-coverage] ${unchecked.length} character(s) have a gender the pronoun checks do not ` +
      `read, so attribution flips, impossible self-references and the he/she monotonicity comparison ` +
      `all skip them: ${unchecked.join(", ")}. Their pronouns are UNVERIFIED in this manuscript.`,
  );
};

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

  // A_71 — the clearance-paste tally is module-level state in @cml/prompts-llm. Reset per run so a
  // replay harness that calls runAgent9 twice in one process cannot carry the first run's count
  // into the second and make a probe read as a change it never was.
  resetDeterministicClearancePasteTelemetry();
  resetDeterministicCluePasteTelemetry();

  /**
   * ── THE PRECONDITION, AND WHAT IT IS ALLOWED TO REQUIRE ──────────────────────────────────────────
   *
   * These nine are GENERATION INPUTS: without any one of them there is no chapter to write.
   *
   * `coverageResult` and `outlineCoverageIssues` used to be in this list and are NOT generation
   * inputs — they are DERIVED SIGNALS produced as unpersisted side effects of Agent 5/6/7 (see
   * `STAGE_SECONDARY_OUTPUTS` in resume-hydration.ts, which already names them as exactly that). They
   * feed warnings, repair guardrails and report fields. Prose can be written without them.
   *
   * REQUIRING THEM MADE THE RESUME PATH IMPOSSIBLE. `resume-run.ts` exists, in its own words, because
   * "a run that dies at Agent 9 has already produced thirteen stages of artifacts and spent ~£1.40 of
   * its ~£1.50". But a resume restores a contiguous PREFIX and skips the stages whose artifacts are
   * present — so Agent 5/6/7 never execute, their unpersisted side effects are never produced, and
   * Agent 9 threw before its first LLM call. **Every Agent-9 resume this feature was built for was
   * structurally dead**, and it surfaced here because A_75 P1v needs exactly that path for a matched
   * pair. Found by running it, not by reading it.
   */
  if (!ctx.cml || !ctx.cast || !ctx.characterProfiles || !ctx.locationProfiles || !ctx.temporalContext || !ctx.hardLogicDevices || !ctx.narrative || !ctx.clues) {
    throw new Error("Agent 9 precondition failed: missing required upstream artifacts before prose generation.");
  }

  /**
   * The degraded reading, and it must never be mistaken for a clean one.
   *
   * `resume-hydration.ts` states the rule this obeys: *"a gate that cannot evaluate must say so — it
   * must never pass by default."* An absent `coverageResult` defaulted to `hasCriticalGaps: false`
   * would report a clean coverage check that never ran, which is the `loadNoveltyLedger` /
   * geometry-replay defect this project has now found three times: silence recorded as a pass.
   *
   * So absence is carried EXPLICITLY — `evaluated: false` — the run warns, and the report field goes
   * NULL rather than `false`.
   */
  const coverageEvaluated = Boolean(ctx.coverageResult);
  const outlineCoverageEvaluated = Array.isArray(ctx.outlineCoverageIssues);
  if (!coverageEvaluated || !outlineCoverageEvaluated) {
    ctx.warnings.push(
      `[Agent 9] COVERAGE SIGNALS NOT EVALUATED this run (${[
        !coverageEvaluated ? "coverageResult" : null,
        !outlineCoverageEvaluated ? "outlineCoverageIssues" : null,
      ].filter(Boolean).join(", ")}) — the producing stage was skipped, typically a resume. ` +
      `Prose generation proceeds; every check these feed reports UNEVALUATED, not clean.`,
    );
  }

  const cml = ctx.cml;
  const cast = ctx.cast;
  const castDesign = (cast as any).cast;

  // Say so if any character sits outside what the pronoun checks can read (see the helper above).
  warnOnUncheckedPronounGenders(
    (Array.isArray(castDesign?.characters) ? castDesign.characters : []) as Array<{ name?: unknown; gender?: unknown }>,
    (message) => ctx.warnings.push(message),
  );
  if (!castDesign || !Array.isArray(castDesign.characters)) {
    throw new Error("Agent 9 precondition failed: cast.cast.characters is missing or malformed.");
  }

  const characterProfiles = ctx.characterProfiles;
  const locationProfiles = ctx.locationProfiles;
  const temporalContext = ctx.temporalContext;
  const hardLogicDevices = ctx.hardLogicDevices;
  const narrative = ctx.narrative;
  const clues = ctx.clues;
  const coverageResult = ctx.coverageResult ?? ({ hasCriticalGaps: false, issues: [] } as any);
  const outlineCoverageIssues = ctx.outlineCoverageIssues ?? [];
  const fairPlayAudit = ctx.fairPlayAudit;
  const settingRefinement = ctx.setting?.setting;
  const backgroundContext = ctx.backgroundContext;
  const noveltyAudit = ctx.noveltyAudit;
  const bottomUpRedesignEnabled = parseBooleanEnv(process.env.AGENT9_REDESIGN_V1, true);
  const pronounRepairEnabled = getPronounPolicySettings().checkingEnabled;
  if (!pronounRepairEnabled) {
    console.warn("[Agent 9] Deterministic pronoun repair is DISABLED (generation-params.yaml: agent9_prose.validation.pronoun_policy=off).");
  }

  if (!bottomUpRedesignEnabled) {
    ctx.warnings.push(
      "Agent9 bottom-up redesign is disabled via AGENT9_REDESIGN_V1=false; using legacy prose generation path.",
    );
  }

  // CML gate: repair discriminating_test_scene stub.
  // Agent 3 occasionally emits discriminating_test_scene: {} (empty object).
  // The CML schema treats discriminating_test_scene as optional at the object level but
  // requires its sub-fields when the object is present, so an empty stub fails validateCml.
  // If the stub is present but missing all required fields, repopulate from available CML data
  // using the narrative outline for act/scene coordinates.
  const proseReqsNode = (cml as any)?.CASE?.prose_requirements;
  if (proseReqsNode && typeof proseReqsNode.discriminating_test_scene === "object"
      && proseReqsNode.discriminating_test_scene !== null) {
    // Deep-clone the stub before reading fields so mutations don't silently propagate to
    // any code that already holds a reference to the original object (#26).
    const dts = JSON.parse(JSON.stringify(proseReqsNode.discriminating_test_scene)) as Record<string, unknown>;
    const hasMandatoryFields =
      dts.act_number != null && dts.scene_number != null
      && Array.isArray(dts.required_elements) && dts.test_type != null;
    if (!hasMandatoryFields) {
      // Derive act/scene from narrative outline + timing constraint.
      const cmlCase = (cml as any)?.CASE ?? {};
      const timing = String(cmlCase.discriminating_test_requirements?.timing ?? "").toLowerCase();
      const targetAct = timing.includes("act1") ? 1 : timing.includes("act2") ? 2 : 3;
      const isEarly = timing.includes("early") || !timing.includes("late");
      const allScenes: any[] = (narrative?.acts ?? []).flatMap((a: any) => a.scenes ?? []);
      const actScenes = allScenes.filter((s: any) => (s.act ?? s.actNumber) === targetAct);
      const chosenScene = actScenes.length > 0
        ? (isEarly ? actScenes[0] : actScenes[actScenes.length - 1])
        : allScenes[allScenes.length - 1]; // fallback: last scene overall
      const derivedActNumber = targetAct;
      const derivedSceneNumber = Number(chosenScene?.sceneNumber ?? allScenes.length) || allScenes.length;
      const derivedTestType = String(cmlCase.discriminating_test?.method ?? "deductive_proof");
      const derivedElements: string[] = Array.isArray(cmlCase.discriminating_test?.evidence_clues)
        ? cmlCase.discriminating_test.evidence_clues.map(String)
        : [];
      proseReqsNode.discriminating_test_scene = {
        act_number: derivedActNumber,
        scene_number: derivedSceneNumber,
        test_type: derivedTestType,
        required_elements: derivedElements,
      };
      ctx.warnings.push(
        `CML gate: discriminating_test_scene was empty stub — back-filled from CML data`
        + ` (act ${derivedActNumber}, scene ${derivedSceneNumber}, test_type "${derivedTestType}")`,
      );
    }
  }

  // Wave 1 pre-prose integrity lock: keep culprit assignment compatible with role/eligibility.
  enforceCmlCulpritRoleIntegrity(cml, castDesign, ctx.warnings);

  const preProseLifecycleErrors = validateCharacterLifecycle(
    {
      id: runId,
      projectId: projectId || "",
      scenes: [],
      metadata: {
        cast: ((cml as any)?.CASE?.cast ?? []).map((entry: any) => String(entry?.name ?? '')).filter(Boolean),
      },
    },
    cml as any,
  ).filter((error) => error.severity === "critical");
  if (preProseLifecycleErrors.length > 0) {
    preProseLifecycleErrors.forEach((error) =>
      ctx.errors.push(`Lifecycle preflight failure: ${error.message}`),
    );
    const summary = preProseLifecycleErrors.map((error) => error.message).slice(0, 4).join("; ");
    throw new Error(`Agent 9 aborted before prose generation: lifecycle validation failed: ${summary}`);
  }

  // Full CML/schema preflight before prose generation to fail fast on invalid structures
  // and cross-reference usage errors that prose retries cannot repair.
  const cmlSchemaValidation = validateCml(cml);
  if (!cmlSchemaValidation.valid) {
    cmlSchemaValidation.errors.forEach((error) =>
      ctx.errors.push(`CML schema failure: ${error}`),
    );
    const summary = cmlSchemaValidation.errors.slice(0, 6).join("; ");
    throw new Error(`Agent 9 aborted before prose generation: CML schema validation failed: ${summary}`);
  }

  const sceneCountForUsage =
    narrative.acts?.flatMap((a: any) => a.scenes || []).length || 0;
  const cmlUsageValidation = validateCmlUsageForProse(cml, clues, castDesign, sceneCountForUsage);
  cmlUsageValidation.warnings.forEach((warning) => ctx.warnings.push(warning));
  if (cmlUsageValidation.errors.length > 0) {
    cmlUsageValidation.errors.forEach((error) => ctx.errors.push(error));
    const summary = cmlUsageValidation.errors.slice(0, 6).join("; ");
    throw new Error(`Agent 9 aborted before prose generation: CML usage validation failed: ${summary}`);
  }

  const canonicalClueIds = new Set<string>([
    ...(((cml as any)?.CASE?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
      .map((entry: any) => String(entry?.clue_id ?? '').trim())
      .filter(Boolean),
    ...((clues?.clues ?? []) as any[])
      .map((entry: any) => String(entry?.id ?? '').trim())
      .filter(Boolean),
  ]);
  const cmlCase = (cml as any)?.CASE ?? {};
  const clueNamespaceRepair = reconcileDiscriminatingEvidenceIdsToCanonicalNamespace(cmlCase, canonicalClueIds);
  if (clueNamespaceRepair.repaired) {
    const removedSample = clueNamespaceRepair.removedNonCanonical.slice(0, 3).join(", ");
    const seededSample = clueNamespaceRepair.seededFromMapping.slice(0, 3).join(", ");
    const removedSuffix = clueNamespaceRepair.removedNonCanonical.length > 3 ? ", ..." : "";
    const seededSuffix = clueNamespaceRepair.seededFromMapping.length > 3 ? ", ..." : "";
    const notes: string[] = [];
    if (clueNamespaceRepair.removedNonCanonical.length > 0) {
      notes.push(
        `removed non-canonical entries (${clueNamespaceRepair.removedNonCanonical.length}: ${removedSample}${removedSuffix})`,
      );
    }
    if (clueNamespaceRepair.seededFromMapping.length > 0) {
      notes.push(
        `seeded canonical IDs from clue_to_scene_mapping (${clueNamespaceRepair.seededFromMapping.length}: ${seededSample}${seededSuffix})`,
      );
    }
    if (notes.length > 0) {
      ctx.warnings.push(`Agent 9 clue namespace preflight: ${notes.join("; ")}.`);
    }
  }
  const discriminatingEvidenceIds = clueNamespaceRepair.finalIds;
  const nonCanonicalEvidenceIds = clueNamespaceRepair.nonCanonicalIds;
  if (nonCanonicalEvidenceIds.length > 0) {
    const msg = `Clue namespace preflight: discriminating evidence ID(s) not found in canonical clue namespace: ${nonCanonicalEvidenceIds.join(", ")}`;
    ctx.errors.push(msg);
    throw new Error(`Agent 9 aborted before prose generation: ${msg}`);
  }
  if (enableScoring && scoreAggregator && scoringLogger) {
    const audit = {
      canonicalIds: Array.from(canonicalClueIds),
      referencedIds: discriminatingEvidenceIds,
      missingIds: nonCanonicalEvidenceIds,
      nonCanonicalIds: nonCanonicalEvidenceIds,
      safeRemaps: clueNamespaceRepair.seededFromMapping,
      status: nonCanonicalEvidenceIds.length > 0 ? "fail" : "pass",
    };
    scoringLogger.logPhaseDiagnostic(
      "agent9_prose",
      "Prose Generation",
      "clue_namespace_audit",
      audit,
      runId,
      projectId || "",
    );
    scoreAggregator.upsertDiagnostic(
      "agent9_prose_clue_namespace_audit",
      "agent9_prose",
      "Prose Generation",
      "clue_namespace_audit",
      audit,
    );
  }

  const blockingOutlineIssues = outlineCoverageIssues.filter((issue) =>
    issue.type === "missing_discriminating_test_scene"
    || issue.type === "missing_suspect_closure_scene",
  );
  if (blockingOutlineIssues.length > 0) {
    const summary = blockingOutlineIssues.map((issue) => issue.message).join("; ");
    throw new Error(
      `Agent 9 aborted before prose generation: outline pre-commit completeness gate failed: ${summary}`,
    );
  }

  reportProgress("prose", "Generating prose chapter by chapter with per-chapter validation...", 91);

  const baselineProseGuardrails = [
    "Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.",
    "Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.",
    "In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).",
  ];

  const upstreamGuardrails: string[] = [];

  if (settingRefinement) {
    const eraSignals = [
      ...(Array.isArray(settingRefinement.era?.technology) ? settingRefinement.era.technology : []),
      ...(Array.isArray(settingRefinement.era?.communication) ? settingRefinement.era.communication : []),
      ...(Array.isArray(settingRefinement.era?.socialNorms) ? settingRefinement.era.socialNorms : []),
      ...(Array.isArray(settingRefinement.era?.policing) ? settingRefinement.era.policing : []),
    ]
      .map((v: any) => String(v).trim())
      .filter(Boolean)
      .slice(0, 6);
    if (eraSignals.length > 0) {
      upstreamGuardrails.push(
        `Integrate at least two concrete era-grounded details per chapter from setting refinement signals: ${eraSignals.join(' | ')}.`,
      );
    }
    const movementConstraints = [
      ...(Array.isArray(settingRefinement.location?.physicalConstraints) ? settingRefinement.location.physicalConstraints : []),
      ...(Array.isArray(settingRefinement.location?.accessControl) ? settingRefinement.location.accessControl : []),
    ]
      .map((v: any) => String(v).trim())
      .filter(Boolean)
      .slice(0, 5);
    if (movementConstraints.length > 0) {
      upstreamGuardrails.push(
        `Respect setting movement/access constraints in scene action and alibis: ${movementConstraints.join(' | ')}.`,
      );
    }
  }

  if (backgroundContext) {
    if (backgroundContext.backdropSummary) {
      upstreamGuardrails.push(
        `Sustain social coherence with this backdrop pressure: ${backgroundContext.backdropSummary}`,
      );
    }
    if (Array.isArray(backgroundContext.castAnchors) && backgroundContext.castAnchors.length > 0) {
      upstreamGuardrails.push(
        `Maintain continuity around these socially central cast anchors where relevant: ${backgroundContext.castAnchors.slice(0, 6).join(', ')}.`,
      );
    }
  }

  if (fairPlayAudit) {
    const criticalFairPlayFixes = (fairPlayAudit.violations ?? [])
      .filter((v: any) => String(v?.severity ?? '').toLowerCase() === 'critical')
      .slice(0, 3)
      .map((v: any) => String(v?.suggestion || v?.description || '').trim())
      .filter(Boolean);
    criticalFairPlayFixes.forEach((fix) => {
      upstreamGuardrails.push(`Fair-play repair requirement: ${fix}`);
    });
  }

  if (noveltyAudit) {
    const noveltySignals = [
      ...(Array.isArray(noveltyAudit.violations) ? noveltyAudit.violations : []),
      ...(Array.isArray(noveltyAudit.warnings) ? noveltyAudit.warnings : []),
    ]
      .map((v: any) => String(v).trim())
      .filter(Boolean)
      .slice(0, 3);
    noveltySignals.forEach((signal) => {
      upstreamGuardrails.push(
        `Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: ${signal}`,
      );
    });
  }

  let prose: any;
  const totalSceneCount =
    narrative.acts?.flatMap((a: any) => a.scenes || []).length || 0;
  // [PHASE 5] Pre-compute macro arc plan for structural archetype locking
  const macroArcPlan = buildMacroArcPlan(totalSceneCount);
  const moralAmbiguityNote = hardLogicDevices.devices[0]?.moralAmbiguity;
  const proseLockedFacts = (hardLogicDevices.devices ?? []).flatMap((d: any) =>
    Array.isArray(d.lockedFacts) ? d.lockedFacts : []
  );

  // A_57 §9.1 — Story World-State ledger: the SINGLE canonical, typed, cross-checked view of the facts the
  // prose will reference — typed locked facts (D1), the staged/true contradiction (D2), the
  // mechanism-environment check (D3), and per-character identity. Built ONCE; D1/D2/D3 all DRAW from it
  // rather than re-deriving (§9.5 clause 2), so e.g. the D3 prose instruction below is read off the ledger
  // instead of a second `checkMechanismEnvironmentConsistency` call.
  const caseBlock = (cml as any)?.CASE ?? {};
  // A_61 RC2.5 — repair clear-cut case-soundness data errors AT SOURCE (unknown gender, culprit==victim,
  // self-contradicting/incomplete elimination set, missing culprit derivable from cast) BEFORE the
  // world-state is built and the gate runs — the repair-not-abort prerequisite for promoting the gate to
  // blocking. Mutates caseBlock in place so both the prose prompt and the gate see the repaired data.
  {
    const soundnessRepair = repairCaseSoundness(caseBlock, {
      castDesignCharacters: castDesign.characters,
    });
    for (const r of soundnessRepair.repairs) ctx.warnings.push(`[Agent 9] ${r}`);
    if (soundnessRepair.residualBlocked.length > 0) {
      ctx.warnings.push(`[Agent 9] case-soundness: unrepairable residual conflicts — ${soundnessRepair.residualBlocked.join(", ")}.`);
    }
  }
  const worldStateVictim = (Array.isArray(caseBlock.cast) ? caseBlock.cast : [])
    .find((c: any) => /victim/i.test(String(c?.role_archetype ?? c?.role ?? "")))?.name ?? null;
  const worldStateCulprits: string[] = Array.isArray(caseBlock.culpability?.culprits) ? caseBlock.culpability.culprits : [];
  const worldState = buildStoryWorldState({
    lockedFacts: proseLockedFacts,
    device: hardLogicDevices.devices[0],
    atmosphere: settingRefinement?.atmosphere,
    cast: Array.isArray(caseBlock.cast) ? caseBlock.cast : [],
    victim: worldStateVictim,
    culprits: worldStateCulprits,
  });
  // A_57 D2 — publish the ledger's canonical staged/true pair so the FINAL rubric scorer can run the
  // dual-value-without-contrast detector off the same single source of truth (no re-derivation).
  ctx.discriminatingContradiction = worldState.contradiction;

  // A_57 D3 — drawn from the ledger (not re-derived). When the mechanism's environmental precondition
  // contradicts the setting weather, surface a generic instruction so the prose renders a brief, justified
  // local exception rather than straining to reconcile the clue with the ambient world (the run-09168377
  // sundial-needs-sun vs winter-overcast defect).
  const mechanismEnvironmentException = worldState.environment.conflict
    ? worldState.environment.repairInstruction
    : undefined;
  if (worldState.environment.conflict) {
    ctx.warnings.push(
      `[Agent 9] mechanism–environment conflict (A_57 D3): mechanism requires ${worldState.environment.precondition?.factor} ` +
      `but the setting is "${worldState.environment.ambient}" (note "${worldState.environment.conflictTerm}"). Injected a ` +
      `local-exception instruction into the prose prompt so the clue holds without contradicting the weather.`,
    );
  }

  // A_57 §9.1 contradiction gate + §9.2 discriminator verifier — coherence + soundness telemetry over the
  // ledger BEFORE prose (the §9.4 "judge sees coherence/soundness" foundation). Warn-level in v1: it makes
  // the defects VISIBLE without risking a mid-pipeline abort. The discriminator verifier confirms the test
  // partitions the suspects soundly — culprit is the unique survivor, every other suspect eliminated, at
  // least one planted clue cited. Suspect/clue sets are derived exactly as the DT checklist derives them.
  {
    const gate = runContradictionGate(worldState);
    if (!gate.ok) {
      const detail =
        `[Agent 9] world-state contradiction gate (A_57 §9.1): ${gate.conflicts.length} conflict(s) — ` +
        gate.conflicts.map((c) => `${c.kind}: ${c.detail}`).join("; ") + ".";
      // P2: block at source when enabled; otherwise stay warn-level (today's behaviour). RC2.5:
      // mechanism_environment is already prose-repaired (repairInstruction above), so it must NEVER
      // trigger the blocking throw — only genuinely unsound, unrepaired conflicts abort.
      const blockingConflicts = gate.conflicts.filter((c) => c.kind !== "mechanism_environment");
      if (isBibleGatesBlockingEnabled() && blockingConflicts.length > 0) {
        throw new Error(`${detail} [AGENT9_BIBLE_GATES_BLOCKING] repair the case upstream before prose.`);
      }
      ctx.warnings.push(detail);
    }

    const dt = caseBlock.discriminating_test ?? {};
    const castList: any[] = Array.isArray(caseBlock.cast) ? caseBlock.cast : [];
    // X50 (REVIEW_11 §7): this chain never reached `roleArchetype` at all, so on a castDesign-shaped
    // entry both the detective and the victim exclusions were no-ops. Test every role field.
    const isSuspectRole = (c: any): boolean => {
      const roles = roleTextsOf(c);
      return !roles.some(isDetectiveArchetype) && !roles.some(isVictimArchetype);
    };
    const suspectNames = castList.filter(isSuspectRole).map((c: any) => String(c?.name ?? "")).filter(Boolean);
    const culpritSet = new Set(worldStateCulprits.map((n) => String(n).trim().toLowerCase()));
    // Mirror discriminating.ts: explicit eliminated_suspects when present, else the derived "every
    // non-culprit, non-guilty suspect is eliminated" set (so suspect_unaccounted never false-fires on a
    // CML that simply doesn't enumerate eliminations).
    const rawEliminated: any[] = Array.isArray(dt.eliminated_suspects) ? dt.eliminated_suspects : [];
    const eliminatedSuspects: string[] = rawEliminated.length > 0
      ? rawEliminated.map((s: any) => (typeof s === "string" ? s : s?.name)).filter(Boolean)
      : castList
          .filter((c: any) => isSuspectRole(c) && !culpritSet.has(String(c?.name ?? "").trim().toLowerCase()) && String(c?.culpability ?? "").toLowerCase() !== "guilty")
          .map((c: any) => String(c?.name ?? ""))
          .filter(Boolean);
    const evidenceClueCount = Array.isArray(dt.evidence_clues)
      ? dt.evidence_clues.filter(Boolean).length
      : 0;
    const verdict = verifyDiscriminator({
      culprits: worldStateCulprits,
      suspects: suspectNames,
      eliminatedSuspects,
      evidenceClueCount,
    });
    if (!verdict.sound) {
      const detail =
        `[Agent 9] discriminator verifier (A_57 §9.2): ${verdict.issues.length} soundness issue(s) — ` +
        verdict.issues.map((i: { kind: string; detail: string }) => `${i.kind}: ${i.detail}`).join("; ") + ".";
      // P2: block at source when enabled; otherwise stay warn-level (today's behaviour).
      if (isBibleGatesBlockingEnabled()) {
        throw new Error(`${detail} [AGENT9_BIBLE_GATES_BLOCKING] repair the case upstream before prose.`);
      }
      ctx.warnings.push(detail);
    }
  }

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
  //
  // We store only the FIRST (minimum) chapter in which each clue appears.
  // Storing all appearances (e.g. from deterministic back-fill spreading an essential
  // clue across chapters 1, 6, 12, 17) causes appearsInChapters to include chapters
  // that pre-date the formal introduction of the fact's value, producing
  // locked_fact_missing_value false positives. The repair system (repairWordFormLockedFacts)
  // already corrects digit-form values in all later chapters, so only the first
  // introduction chapter needs validator coverage.
  const clueIdToChapters = new Map<string, number[]>();
  for (const act of (narrative.acts ?? [])) {
    for (const scene of (act.scenes ?? [])) {
      const chapterNum = scene.sceneNumber as number;
      for (const clueId of (Array.isArray(scene.cluesRevealed) ? scene.cluesRevealed : [])) {
        const existing = clueIdToChapters.get(clueId);
        if (existing === undefined) {
          // First time we see this clue — record this as its introduction chapter.
          clueIdToChapters.set(clueId, [chapterNum]);
        } else if (chapterNum < existing[0]) {
          // Earlier chapter found (scenes may not be visited in strict order).
          existing[0] = chapterNum;
        }
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

  // FIX-B: Locked-fact / clue-description time-value mismatch detection.
  // If a locked fact's canonical time value is irreconcilable with the time
  // expressed in an associated clue description, the LLM will permanently
  // write the clue's time and every chapter will fail locked_fact_missing_value.
  // Emit a warning early (before expensive prose generation) so the CML author
  // can fix the contradiction before re-running.
  //
  // Only check clues that have ≥2 keyword overlap with the locked fact description.
  // This mirrors the annotation loop above and avoids spurious mismatch warnings
  // from entirely unrelated timed clues (e.g. a murder-weapon clue mentioning
  // "8 PM" being flagged against a clock-reading locked fact).
  const cmlIntegrityViolations: string[] = [];
  for (const fact of annotatedLockedFacts) {
    const factValue = String(fact.value ?? '');
    const factKeywords = String(fact.description ?? '')
      .toLowerCase()
      .split(/\s+/)
      .filter((w: string) => w.length > 3);
    for (const clue of (clues.clues ?? [])) {
      const clueText = `${clue.description ?? ''} ${clue.pointsTo ?? ''}`;
      const clueTextLower = clueText.toLowerCase();
      const overlap = factKeywords.filter((kw: string) => clueTextLower.includes(kw)).length;
      if (overlap < 2) continue; // clue is not associated with this locked fact
      const mismatchTime = detectLockedFactClueTimeMismatch(factValue, clueText);
      if (mismatchTime) {
        const cluePath = `clues.clues[${clues.clues.indexOf(clue)}].description`;
        const factPath = `hardLogicDevices.devices[*].lockedFacts[description=${JSON.stringify(
          String(fact.description ?? "")
        )}].value`;
        const details = {
          clue_id: String(clue.id ?? ""),
          locked_fact_description: String(fact.description ?? ""),
          canonical_value: factValue,
          parsed_clue_time: mismatchTime.rawClueTime,
          violation_type: mismatchTime.type,
          cml_field_path: factPath,
          clue_field_path: cluePath,
        };
        const mismatchMessage =
          `[CML integrity] Locked fact "${fact.description}" (canonical: "${factValue}") conflicts with clue "${clue.id}" time ("${mismatchTime.rawClueTime}") [${mismatchTime.type}]. Field paths: ${factPath} vs ${cluePath}.`;
        cmlIntegrityViolations.push(mismatchMessage);
        ctx.warnings.push(mismatchMessage);
        ctx.errors.push(`[CML integrity details] ${JSON.stringify(details)}`);
      }
    }
  }

  const crossArtifactTemporalConflicts = detectCrossArtifactTemporalConflicts({
    lockedFacts: annotatedLockedFacts,
    cmlCase: (cml as any)?.CASE,
    narrative,
  });
  // Cross-artifact temporal conflicts are WARNINGS, not a hard abort. They scan free-prose CML
  // fields (e.g. false_assumption.why_it_seems_reasonable) where a *different* time is often
  // intentional misdirection in a fair-play mystery — and even when it is genuine drift, the prose
  // stage enforces the canonical locked time per chapter. Aborting a fully-designed run on this
  // signal is the wrong severity; only the direct clue-time mismatch above (which dooms prose
  // validation) remains a hard stop.
  for (const conflict of crossArtifactTemporalConflicts) {
    const factPath = `hardLogicDevices.devices[*].lockedFacts[description=${JSON.stringify(conflict.lockedFactDescription)}].value`;
    const sourceLabel = conflict.sourceTag === "agent3_cml" ? "Agent3-CML" : "Agent7-Narrative";
    const message =
      `[CML integrity warning] Locked fact "${conflict.lockedFactDescription}" (canonical: "${conflict.lockedFactValue}") ` +
      `differs from ${sourceLabel} time anchor "${conflict.sourceTime}" [${conflict.violationType}] ` +
      `at ${conflict.sourcePath}. Prose will use the locked value; verify this is intended misdirection.`;
    ctx.warnings.push(message);
    ctx.errors.push(
      `[CML integrity details] ${JSON.stringify({
        severity: "warning",
        source_tag: conflict.sourceTag,
        source_path: conflict.sourcePath,
        source_time: conflict.sourceTime,
        violation_type: conflict.violationType,
        locked_fact_description: conflict.lockedFactDescription,
        canonical_value: conflict.lockedFactValue,
        cml_field_path: factPath,
      })}`,
    );
  }

  if (cmlIntegrityViolations.length > 0) {
    cmlIntegrityViolations.forEach((message) => ctx.errors.push(message));
    const actionablePaths = cmlIntegrityViolations.slice(0, 6).join(" | ");
    throw new Error(
      `Agent 9 aborted before prose generation due to ${cmlIntegrityViolations.length} CML integrity contradiction(s). Correct the referenced CML/clue fields and rerun. ${actionablePaths}`,
    );
  }

  // FIX 4: Build a pronoun-lock map for EVERY named character. Previously this filtered
  // to `c.gender`, silently excluding any character whose gender was unset — the model then
  // defaulted to "he" (women narrated as male). Gender is now guaranteed upstream (Agent 2),
  // but keep a deterministic fallback here so the lock can never be silently empty, and warn
  // if a fallback ever fires so the upstream gap is visible.
  const normalizeGenderValue = (value: unknown): string | undefined => {
    const raw = String(value ?? "").trim().toLowerCase();
    if (raw === "male" || raw === "female" || raw === "non-binary") return raw;
    return undefined;
  };
  const characterGenderMap: Record<string, string> = Object.fromEntries(
    (Array.isArray(castDesign?.characters) ? castDesign.characters : [])
      .filter((c: any) => c?.name)
      .map((c: any, idx: number) => {
        const resolved = normalizeGenderValue(c.gender);
        if (!resolved) {
          ctx.warnings.push(
            `Agent 9: character "${c.name}" reached prose without a gender; applied deterministic fallback. Check Agent 2 gender population.`,
          );
        }
        return [c.name, resolved ?? (idx % 2 === 0 ? "female" : "male")];
      }),
  );
  let narrativeState: NarrativeState = initNarrativeState(
    annotatedLockedFacts,
    characterGenderMap,
  );
  // BLUE-5: Pre-set victimConfirmedDeadChapter=1 from CML data.
  // The victim is always dead from chapter 1 — do not wait for death language to appear
  // in prose before activating the victim prohibition block in buildNSDBlock.
  // CAST.characters does not exist in the CML schema (only CASE.cast does) — use
  // castDesign.characters (Agent 2 cast, camelCase roleArchetype) as the correct source.
  {
    const castArr = Array.isArray(castDesign?.characters) ? castDesign.characters : [];
    let victimEntry = castArr.find((c: any) =>
      c.role === 'victim' || isVictimArchetype(c.roleArchetype),
    );
    // Phase 6a: fallback to CML CASE.culpability.victim when cast-level role resolution fails
    if (!victimEntry) {
      const culpabilityVictim: string = String((cml as any)?.CASE?.culpability?.victim ?? '').trim();
      if (culpabilityVictim) {
        victimEntry = castArr.find((c: any) => String(c.name ?? '') === culpabilityVictim);
      }
    }
    if (victimEntry?.name && narrativeState.victimConfirmedDeadChapter === undefined) {
      narrativeState = { ...narrativeState, victimConfirmedDeadChapter: 1 };
    }
  }

  const checkpointPath =
    (typeof inputs.agent9CheckpointPath === "string" && inputs.agent9CheckpointPath.trim().length > 0)
      ? inputs.agent9CheckpointPath.trim()
      : join(workspaceRoot, "logs", `agent9-checkpoint-${runId}.json`);
  const resumeEnabled = inputs.resumeAgent9FromCheckpoint === true;
  const loadedCheckpoint = resumeEnabled
    ? loadAgent9ResumeCheckpoint(checkpointPath, runId)
    : null;
  if (resumeEnabled && loadedCheckpoint) {
    narrativeState = {
      ...loadedCheckpoint.narrativeState,
      lockedFacts: [...(loadedCheckpoint.narrativeState.lockedFacts ?? [])],
      characterPronouns: { ...(loadedCheckpoint.narrativeState.characterPronouns ?? {}) },
      cluesRevealedToReader: [...(loadedCheckpoint.narrativeState.cluesRevealedToReader ?? [])],
    };
    ctx.warnings.push(
      `Agent 9 resume: loaded ${loadedCheckpoint.completedChapters.length} checkpointed chapter(s) from ${checkpointPath}.`,
    );
  } else if (resumeEnabled) {
    ctx.warnings.push(
      `Agent 9 resume requested but no valid checkpoint found at ${checkpointPath}; starting fresh prose generation.`,
    );
  }

  const checkpointedChapters: any[] = loadedCheckpoint
    ? [...loadedCheckpoint.completedChapters]
    : [];
  const prosePhaseStartTime = Date.now();
  const proseDeployment =
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME_PROSE ||
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  /**
   * REVIEW_02 §2.3 — the model chapter GENERATION actually runs on.
   *
   * Same defect as the regen tier below, found by the same check and missed by the sweep that fixed
   * that one: `AGENT9_MODEL_GENERATE` is set in `.env.local`, and `resolveStageModel("generate", …)`
   * had ZERO call sites — both `generateProse` calls took `proseDeployment` directly. The config has
   * been asserting a choice about the pipeline's single most expensive stage that nothing read.
   *
   * Both consumers of this override are `generateProse`, so the tier is scoped exactly to generation.
   * Resolution is unchanged when the var is unset; at the current config it is a no-op
   * (`AGENT9_MODEL_GENERATE=gpt-4.1` = `AZURE_OPENAI_DEPLOYMENT_NAME_PROSE`), which is why this
   * ships wired rather than flag-gated: it makes an existing config line true without moving today's
   * behaviour by a byte.
   */
  const generateDeployment = resolveStageModel("generate", proseDeployment);
  const proseModelOverride = generateDeployment
    ? ({ model: generateDeployment } as Record<string, string>)
    : {};

  /**
   * The model scoped regens actually run on.
   *
   * THE BUG THIS FIXES. `AGENT9_MODEL_REGEN` has existed since the P6 stage router and is set to
   * `gpt-4.1-mini` in `.env.local` — but every one of the ten `makeRegenFn` call sites below passed
   * `proseDeployment` directly, so `resolveStageModel("regen", …)` was never consulted and every
   * regen ran on the premium prose deployment. Measured on run mystery-1785521869768: 11 regen calls,
   * £0.150 of a £0.947 Agent 9, against ~£0.030 at the tier the config asked for. A configured lever
   * that silently does nothing is this codebase's most expensive recurring defect shape, and this is
   * one more instance of it.
   *
   * Resolution is unchanged when `AGENT9_MODEL_REGEN` is UNSET — it falls back to `proseDeployment`,
   * exactly as today. Setting it is what now takes effect.
   */
  const regenDeployment = resolveStageModel("regen", proseDeployment);

  /**
   * Chapters per generation call.
   *
   * WHY THIS IS A COST LEVER. Measured on run mystery-1785521869768: generation sent 22,292 prompt
   * tokens to produce 1,913 completion tokens per chapter — an 11.7:1 ratio, and roughly two thirds
   * of that prompt (bible, cast, era rules, physics, craft/humour guides, output schema) is IDENTICAL
   * for every chapter in the run. At batch size 1 that block is re-sent ten times. Batching two
   * chapters per call halves the number of times it is sent.
   *
   * DO NOT READ "two thirds" AS A CACHING ESTIMATE — it is a CONTENT claim, and caching is a PREFIX
   * match. Measured on mystery-1787167692140: the longest common prefix across the twelve chapter
   * prompts is 5% of a mean prompt, not two thirds, because chapter-specific content is interleaved
   * into the 60K-character system message rather than appended after it. The order-independent
   * ceiling — what AGENT9_PROMPT_PREFIX_ORDER exists to unlock — is 29%. Azure telemetry on the two
   * runs that carry it confirms the shape: 6-12% cached on a first attempt, 88-97% on a retry.
   * See documentation/15_llm_model_and_cost/01_llm_cost_and_performance_levers.md.
   *
   * The 11.7:1 ratio is also stale: the two most recent runs measure 4.3:1 and 6.5:1.
   *
   * WHY IT IS NOT SIMPLY DEFAULTED UP. Two real constraints:
   *   1. `maxTokens` bounds the reply. At ~1,913 tokens per chapter, 2 fits inside the 4,000 default
   *      and 3 does not — a larger batch needs maxTokens raised or it truncates mid-chapter.
   *   2. Retries are per BATCH. This run retried 3 of 13 calls; at batch size 2 each retry
   *      regenerates two chapters, so a high retry rate erodes the saving and can reverse it.
   * Both make it a behaviour change, so it reads from env and stays at today's value unless set.
   */
  /**
   * REVIEW_02 §3.2 — the documented hard limit is now the CODED limit.
   *
   * FLAG-AUDIT states "Hard limit: 2 — a chapter is ~1,913 completion tokens against a 4,000
   * maxTokens", and the code accepted 1–10. An operator who read that reasoning as guidance and set
   * 3 got JSON truncated mid-chapter with `maxTokens` unchanged. A constraint that lives only in a
   * markdown table is not a constraint; the preflight warns when the configured value is clamped.
   */
  const MAX_PROSE_BATCH_SIZE = 2;
  const proseBatchSizeFromEnv = (): number | undefined => {
    const raw = Number(process.env.AGENT9_PROSE_BATCH_SIZE);
    if (!Number.isFinite(raw) || raw < 1) return undefined;
    return Math.min(Math.floor(raw), MAX_PROSE_BATCH_SIZE);
  };
  // Clamped HERE rather than only at the loop, so the value recorded on the artifact is the value
  // actually used. Reporting a batch size the run did not use is the reporting defect A_71 §1 spent
  // a section on.
  const requestedProseBatchSize = inputs.proseBatchSize ?? proseBatchSizeFromEnv();
  const effectiveProseBatchSize =
    requestedProseBatchSize === undefined
      ? undefined
      : Math.max(1, Math.min(requestedProseBatchSize, MAX_PROSE_BATCH_SIZE));

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

  /** #9: Shared ProseScorer args builder — avoids config drift across the 3 scorer call sites. */
  const buildProseScoreArgs = (extra: Record<string, unknown> = {}) => ({
    previous_phases: {
      agent2_cast: castDesign,
      agent2b_character_profiles: characterProfiles.profiles,
      agent2c_location_profiles: locationProfiles,
    },
    cml,
    threshold_config: { mode: "standard" as const },
    targetLength: inputs.targetLength ?? "medium",
    ...extra,
  });

  const computeProseChapterScoreSeries = async (chaptersToScore: any[]): Promise<any[]> => {
    if (!enableScoring || !scoreAggregator || chaptersToScore.length === 0) return [];
    try {
      const scorer = new ProseScorer();
      const batchSize = Math.max(1, Math.min(effectiveProseBatchSize ?? 1, MAX_PROSE_BATCH_SIZE));
      const series: any[] = [];
      const accumulated: any[] = [];
      const totalChapters = totalSceneCount || chaptersToScore.length;

      for (let i = 0; i < chaptersToScore.length; i += batchSize) {
        const batch = chaptersToScore.slice(i, i + batchSize);
        accumulated.push(...batch);

        const adaptedBatch = adaptProseForScoring(batch, (cml as any).CASE, clues);
        const batchScore = await scorer.score({}, adaptedBatch, buildProseScoreArgs({ partialGeneration: true }));

        const adaptedAll = adaptProseForScoring(accumulated, (cml as any).CASE, clues);
        const cumulativeScore = await scorer.score({}, adaptedAll, buildProseScoreArgs({ partialGeneration: true }));

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
      const reScoreProse = await new ProseScorer().score({}, reAdaptedProse, buildProseScoreArgs({
        narrativeSceneCount: totalSceneCount || undefined,
      }));

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
  const accumulatedChapters: any[] = [...checkpointedChapters];
  const assetLibrary = buildAssetLibrary(
    ctx.worldDocument,
    characterProfiles,
    locationProfiles,
    temporalContext,
  );

  // §2.5: Obligation atom stamping — cleared in onAtomsSelected, consumed in onBatchComplete
  let pendingObligationAtomIds: string[] = [];
  let pendingTextureAtomIds: string[] = [];

  // [PHASE 6] Precompile StoryContract — resolves victim, sensory atoms, locked facts, arc plan
  const storyContract = precompileStoryContract({
    castData: cml.CAST,
    cmlCase: (cml as any)?.CASE,
    lockedFacts: annotatedLockedFacts,
    macroArcPlan,
    locationProfiles: Array.isArray(locationProfiles) ? locationProfiles : [],
  });
  ctx.warnings.push(
    `[StoryContract] victim.name="${storyContract.victim.name}" roleConfirmedFrom="${storyContract.victim.roleConfirmedFrom}" lockedFacts=${storyContract.lockedFacts.length} macroArcScenes=${storyContract.macroArcPlan.length}`,
  );

  // [G2] Role cross-validation: culprits must not overlap with victimCandidates or detectiveCandidates.
  // An overlap indicates a conflated character role — the same person cannot be both culprit and victim/detective.
  {
    // A_62 P3 replay fix: hydrated (archived) Agent-2 outputs carry candidate entries as OBJECTS
    // ({name, reason}) where the live path normalizes to strings before this point — the A/B replay
    // bypasses agent2-run's post-parse normalization, so every replay arm crashed here
    // ("v.toLowerCase is not a function", 16/16 arms dead, $0 spent). Read both shapes.
    const candidateName = (entry: any): string => String(entry?.name ?? entry ?? "").trim();
    const victimCandidates: string[] = (castDesign.crimeDynamics?.victimCandidates ?? []).map(candidateName).filter(Boolean);
    const detectiveCandidates: string[] = (castDesign.crimeDynamics?.detectiveCandidates ?? []).map(candidateName).filter(Boolean);
    for (const culpritName of storyContract.culpritNames) {
      if (victimCandidates.some(v => v.toLowerCase() === culpritName.toLowerCase())) {
        const msg = `[G2] Role conflict: "${culpritName}" appears in both culpability.culprits and crimeDynamics.victimCandidates — a culprit cannot also be a victim candidate.`;
        ctx.warnings.push(msg);
        console.warn(`[Agent 9] ${msg}`);
      }
      if (detectiveCandidates.some(d => d.toLowerCase() === culpritName.toLowerCase())) {
        const msg = `[G2] Role conflict: "${culpritName}" appears in both culpability.culprits and crimeDynamics.detectiveCandidates — a culprit cannot also be a detective candidate.`;
        ctx.warnings.push(msg);
        console.warn(`[Agent 9] ${msg}`);
      }
    }
  }

  /**
   * ── A_75 §6.1 (P1) — COMMIT THE VOICE, ONCE, BEFORE CHAPTER ONE ────────────────────────────────
   *
   * The mechanism A_72 §2.1 measured behind `premise`, the only category that is routinely praised:
   * generate candidates under an explicit `divergeFrom`, judge, commit as a constraint every
   * downstream step honours. Here it commits how the book SOUNDS.
   *
   * ONCE per story, not per chapter — a per-chapter decision would give each chapter its own voice,
   * which is A_75 §3's uniformity problem with extra steps. Two design-tier calls (generate + judge),
   * and the judge is skipped when only one candidate survives validation.
   *
   * It CANNOT stop a run. Any failure leaves `voiceSpec` null and the prompt is byte-identical to
   * today — the same reasoning B1 applied to geometry: a craft lever that can abort is an off switch.
   */
  let committedVoiceSpec: import("@cml/prose-guard").VoiceSpec | null = null;
  /**
   * Held and added AFTER `generateProse` returns. The first version of this added it to `prose.cost`
   * here — and `prose` is not assigned until twenty lines below, so `typeof prose?.cost === "number"`
   * was false on every run and the spend vanished. That is the report-underreporting class this
   * project has already measured in both directions; the point of a flag-gated lever is knowing what
   * it costs, and a lever whose cost never reaches the total cannot be priced.
   */
  let voiceSpecCost = 0;
  if (isVoiceSpecEnabled()) {
    const voiceResult = await generateVoiceSpec(client, {
      runId: ctx.runId,
      projectId: ctx.projectId,
      title: (cml as any)?.CASE?.title ?? (narrative as any)?.title,
      settingSummary: (cml as any)?.CASE?.setting?.location ?? undefined,
      era: (cml as any)?.CASE?.setting?.era ?? undefined,
    });
    committedVoiceSpec = voiceResult.spec;
    voiceSpecCost = voiceResult.cost;
    if (voiceResult.spec) {
      const s = voiceResult.spec;
      ctx.warnings.push(
        `[Agent 9] VOICE SPEC committed: ${s.sentenceLength.mean.toFixed(1)}±${s.sentenceLength.sd.toFixed(1)} words, ` +
        `${s.diction}, ${s.narrationDistance} — habit "${s.syntacticHabit.slice(0, 70)}", ` +
        `signature "${s.signatureMove.slice(0, 70)}" (£${voiceResult.cost.toFixed(3)}, ${voiceResult.candidates.length} candidates).`,
      );
      // The REJECTED candidates are the evidence that the divergence gate is doing work rather than
      // waving everything through — a run where nothing is ever rejected has a gate that never fires.
      for (const c of voiceResult.candidates.filter((x) => x.rejected.length > 0)) {
        ctx.warnings.push(`[Agent 9] voice candidate rejected (${c.spec.sentenceLength.mean.toFixed(1)} words): ${c.rejected.join("; ")}`);
      }
    } else {
      ctx.warnings.push(
        `[Agent 9] VOICE SPEC not committed: ${voiceResult.error ?? "no candidate"} — chapters are written without a voice block (prompt unchanged).`,
      );
    }
  }

  try {
    prose = await generateProse(client, {
    caseData: cml,
    outline: narrative,
    cast: castDesign,
    voiceSpec: committedVoiceSpec,
    ...proseModelOverride,
    detectiveType: inputs.detectiveType,
    worldDocument: ctx.worldDocument,
    macroArcPlan,
    characterProfiles: characterProfiles,
    locationProfiles: locationProfiles,
    temporalContext: temporalContext,
    characterBundle: ctx.characterBundle,
    moralAmbiguityNote,
    mechanismEnvironmentException,
    lockedFacts: annotatedLockedFacts,
    clueDistribution: clues,
    narrativeState,
    targetLength: inputs.targetLength,
    narrativeStyle: inputs.narrativeStyle,
    qualityGuardrails: [
      ...baselineProseGuardrails,
      ...upstreamGuardrails,
      ...(outlineCoverageIssues.length > 0
        ? buildOutlineRepairGuardrails(outlineCoverageIssues, cml)
        : []),
    ],
    writingGuides: loadWritingGuides(workspaceRoot),
    runId,
    projectId: projectId || "",
    bottomUpRedesignEnabled,
    enableSurgicalFingerprintRetry: inputs.enableSurgicalFingerprintRetry,
    enableOutlineCompleteness: inputs.enableOutlineCompleteness,
    storyContract,
    // Agent 7.5 — the manuscript contract as prompt input. Self-gating: the prompt builder ignores it
    // unless AGENT9_GEOMETRY_CONTRACT is on, so passing it here is inert until that flag flips.
    storyGeometry: ctx.storyGeometry,
    resumeCheckpoint: loadedCheckpoint
      ? {
          chapters: loadedCheckpoint.completedChapters,
          narrativeState,
          promptFingerprints: loadedCheckpoint.promptFingerprints,
        }
      : undefined,
    onProgress: (phase: string, message: string, percentage: number) =>
      reportProgress(phase as any, message, percentage),
    batchSize: effectiveProseBatchSize,
    onAtomsSelected: (ids: string[]) => {
      pendingObligationAtomIds = ids;
    },
    onBatchComplete: async (
      batchChapters: any,
      batchStart: number,
      batchEnd: number,
      validationIssues: any,
      usedTextureAtomIds?: string[],
      nsdCheckpoint?: {
        cluesRevealedToReader: string[];
        previousChapterArcPosition?: string;
        continuityTail: string;
        chapter: number;
      },
      batchCommitRecord?: BatchCommitRecord,
    ) => {
      checkpointedChapters.push(...(Array.isArray(batchChapters) ? batchChapters : []));
      pendingTextureAtomIds = Array.isArray(usedTextureAtomIds) ? usedTextureAtomIds : [];
      const nsdBefore = {
        clues_revealed_to_reader: [...narrativeState.cluesRevealedToReader],
      };

      const allOutlineScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes || []);
      const batchRevealedIds: string[] = allOutlineScenes
        .filter((s: any) => s.sceneNumber >= batchStart && s.sceneNumber <= batchEnd)
        .flatMap((s: any) => (Array.isArray(s.cluesRevealed) ? s.cluesRevealed : []))
        .map((id: any) => String(id))
        .filter(Boolean);
      const lastBatchChapter = batchChapters[batchChapters.length - 1];
      const arcAnchorChapter = batchEnd;
      const batchArcPosition = arcAnchorChapter <= 1 ? 'opening'
        : arcAnchorChapter <= Math.floor(totalSceneCount * 0.25) ? 'early'
        : arcAnchorChapter <= Math.floor(totalSceneCount * 0.4) ? 'first_turn'
        : arcAnchorChapter <= Math.floor(totalSceneCount * 0.55) ? 'mid'
        : arcAnchorChapter <= Math.floor(totalSceneCount * 0.7) ? 'second_turn'
        : arcAnchorChapter <= Math.floor(totalSceneCount * 0.8) ? 'pre_climax'
        : arcAnchorChapter === totalSceneCount ? 'resolution'
        : 'climax';
      narrativeState = updateNSD(narrativeState, {
        paragraphs: lastBatchChapter?.paragraphs,
        cluesRevealedIds: batchRevealedIds,
        arcPosition: batchArcPosition,  // §4.4: track previous chapter arc position
      });

      // [PHASE 4] Extract beat fingerprints from each committed chapter and append to beatHistory
      const castNamesList = (Array.isArray((cml.CAST as any)?.characters) ? (cml.CAST as any).characters : []).map((c: any) => c.name as string).filter(Boolean);
      const newBeats = (batchChapters as any[]).map((ch: any, idx: number) =>
        extractBeatFingerprints(ch, batchStart + idx, castNamesList)
      );
      narrativeState = {
        ...narrativeState,
        beatHistory: [...(narrativeState.beatHistory ?? []), ...newBeats],
      };

      // §1.2: Set victimConfirmedDeadChapter when victim name + death language first co-occur
      if (narrativeState.victimConfirmedDeadChapter === undefined) {
        // Phase 6a: inject culpabilityVictim onto cast for Pass 3 fallback
        const castForVictim: any = { ...(cml.CAST as any), culpabilityVictim: String((cml as any)?.CASE?.culpability?.victim ?? '').trim() };
        const victimName = resolveVictimName(castForVictim).toLowerCase();
        if (victimName) {
          const batchText = (batchChapters as any[])
            .flatMap((ch: any) => (Array.isArray(ch.paragraphs) ? ch.paragraphs : []))
            .join(' ')
            .toLowerCase();
          const deathPattern = /\b(dead|body|corpse|killed|murder(?:ed)?|lifeless|deceased|slain)\b/;
          if (batchText.includes(victimName) && deathPattern.test(batchText)) {
            narrativeState = { ...narrativeState, victimConfirmedDeadChapter: batchStart };
          }
        }
      }

      // §2.5: Stamp deployed obligation atoms into narrativeState after batch commits
      const committedObligationAtomIds = [...pendingObligationAtomIds];
      if (pendingObligationAtomIds.length > 0) {
        narrativeState = stampDeployedAtoms(narrativeState, pendingObligationAtomIds, batchStart);
        pendingObligationAtomIds = [];
      }

      // §5.1: Stamp only validated texture atom IDs reported by the LLM.
      let committedTextureAtomIds: string[] = [];
      if (pendingTextureAtomIds.length > 0) {
        const validTextureAtoms = pendingTextureAtomIds.filter((atomId) => Boolean(assetLibrary[atomId]));
        committedTextureAtomIds = [...validTextureAtoms];
        narrativeState = stampDeployedAtoms(narrativeState, validTextureAtoms, batchStart);
        pendingTextureAtomIds = [];
      }
      const committedDeployedAtomIds = Array.from(
        new Set([...committedObligationAtomIds, ...committedTextureAtomIds]),
      );

      if (bottomUpRedesignEnabled && nsdCheckpoint) {
        const parity = checkNSDParity(narrativeState, nsdCheckpoint);
        if (parity.parityCritical.length > 0) {
          const parityMsg =
            `NSD parity critical divergence at batch ${batchStart}-${batchEnd}: ${parity.parityCritical.join('; ')}`;
          ctx.errors.push(parityMsg);
          throw new Error(parityMsg);
        }
        if (parity.parityWarnings.length > 0) {
          ctx.warnings.push(
            `NSD parity warning at batch ${batchStart}-${batchEnd}: ${parity.parityWarnings.join('; ')}`,
          );
        }
      }

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
      const clueIndexById = new Map(
        (Array.isArray(clues?.clues) ? clues.clues : [])
          .map((clue: any) => [String(clue?.id ?? "").trim(), clue] as const)
          .filter(([clueId]) => clueId.length > 0),
      );
      if (cluesWithNoAnchor.length > 0) {
        for (const clueId of cluesWithNoAnchor) {
          clueEvidenceAnchors.push(
            buildSyntheticNsdClueAnchor(
              clueId,
              batchEnd,
              clueIndexById.get(clueId),
            ),
          );
        }
      }
      if (cluesWithNoAnchor.length > 0) {
        ctx.warnings.push(
          `NSD batch ${batchStart}-${batchEnd}: clue(s) marked revealed but no prose evidence anchor found: ${cluesWithNoAnchor.join(", ")}. Synthetic NSD anchors were added to preserve transfer-trace parity; fair-play verification may still be incomplete.`,
        );
      }

      ctx.nsdTransferTrace.push({
        batch_start: batchStart,
        batch_end: batchEnd,
        chapter_range: batchCommitRecord?.chapterRange ?? `${batchStart}-${batchEnd}`,
        chapters_generated: batchChapters.length,
        attempt_count: batchCommitRecord?.attemptCount,
        gate_outcomes: batchCommitRecord?.gateOutcomes,
        deployed_atom_ids: batchCommitRecord?.deployedAtomIds ?? committedDeployedAtomIds,
        cumulative_clue_set: batchCommitRecord?.cumulativeClueSet ?? [...new Set(narrativeState.cluesRevealedToReader)],
        continuity_tail_preview:
          batchCommitRecord?.continuityTailPreview
          ?? String(narrativeState.continuityTail ?? "").replace(/\s+/g, " ").trim().slice(0, 220),
        prompt_fingerprint_hash: batchCommitRecord?.promptFingerprintHash,
        batch_duration_ms: batchCommitRecord?.durationMs,
        batch_cost: batchCommitRecord?.cost,
        validation_issue_count: validationIssues?.length ?? 0,
        validation_issue_samples: (validationIssues ?? []).slice(0, 3),
        newly_revealed_clue_ids: [...new Set(newlyRevealedClues)],
        clue_state_by_id: clueStateById,
        clue_evidence_anchors: clueEvidenceAnchors,
        before: nsdBefore,
        after: {
          clues_revealed_to_reader: [...narrativeState.cluesRevealedToReader],
        },
        internal_checkpoint: nsdCheckpoint
          ? {
              chapter: nsdCheckpoint.chapter,
              clues_revealed_to_reader: nsdCheckpoint.cluesRevealedToReader,
              previous_arc_position: nsdCheckpoint.previousChapterArcPosition,
            }
          : undefined,
      });

      // Log per-chapter word counts to the run log
      for (let batchIdx = 0; batchIdx < batchChapters.length; batchIdx++) {
        const chapter = batchChapters[batchIdx] as any;
        const words = ((chapter.paragraphs as string[]) ?? [])
          .join(" ")
          .split(/\s+/)
          .filter((w: string) => w.length > 0).length;
        ctx.runLogger.logChapterWords(batchStart + batchIdx, words);
      }

      const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;

      if (enableScoring && scoreAggregator && scoringLogger) {
        accumulatedChapters.push(...batchChapters);
        try {
          const scorer = new ProseScorer();
          const adaptedBatch = adaptProseForScoring(batchChapters, (cml as any).CASE, clues);
          const batchScore = await scorer.score({}, adaptedBatch, buildProseScoreArgs({ partialGeneration: true }));

          const adaptedAll = adaptProseForScoring(accumulatedChapters, (cml as any).CASE, clues);
          const partialScore = await scorer.score({}, adaptedAll, buildProseScoreArgs({ partialGeneration: true }));

          const individualPct = Math.round(batchScore.total ?? 0);
          const pct = Math.round(partialScore.total ?? 0);
          const elapsedMs = Date.now() - prosePhaseStartTime;
          ctx.agentDurations["agent9_prose"] = elapsedMs;

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

      try {
        persistAgent9ResumeCheckpoint(checkpointPath, {
          version: 1,
          runId,
          projectId,
          savedAt: new Date().toISOString(),
          completedChapters: checkpointedChapters,
          narrativeState,
        });
      } catch (checkpointError) {
        ctx.warnings.push(`Agent 9 checkpoint write failed: ${String(checkpointError)}`);
      }
    },
    });
  } catch (error) {
    // Preserve canonical elapsed prose time even when generation aborts mid-retry.
    ctx.agentDurations["agent9_prose"] = Date.now() - proseStart;
    throw error;
  }

  try {
    persistAgent9ResumeCheckpoint(checkpointPath, {
      version: 1,
      runId,
      projectId,
      savedAt: new Date().toISOString(),
      completedChapters: checkpointedChapters.length > 0 ? checkpointedChapters : prose.chapters,
      narrativeState,
      promptFingerprints: prose.prompt_fingerprints,
    });
  } catch (checkpointError) {
    ctx.warnings.push(`Agent 9 checkpoint finalization failed: ${String(checkpointError)}`);
  }

  // A_75 P1 — fold the voice-spec spend into the run total now that `prose` exists. See the note at
  // the generation site: adding it before this point silently dropped it.
  if (voiceSpecCost > 0 && typeof prose?.cost === "number") {
    prose.cost += voiceSpecCost;
    ctx.warnings.push(`[Agent 9] voice-spec spend £${voiceSpecCost.toFixed(3)} folded into the run total.`);
  }

  // #2.1: Shared post-processing chain — extracted from 4 inline call sites.
  // Runs applyDeterministicProsePostProcessing → repairWordFormLockedFacts → normalizeLocationNames
  // in the correct order.  Accepts the prose-input separately so schema-repair retry can pass
  // retriedProse as the input without reassigning the outer prose variable prematurely.
  const applyStandardPostProcessingChain = (input: any): any => {
    let result = applyDeterministicProsePostProcessing(sanitizeProseResult(input), locationProfiles, castDesign.characters, pronounRepairEnabled);
    /**
     * Two malformed-prose classes the external reader of `story_20260828-2301` listed for removal,
     * in a book that scored 85/100 with `prose` capped at 7 for "leakage and malformed lines":
     *
     *     "I just hoped to avoid dismissal dr finch... she hadn t earned the right"
     *
     * MEASURED over 196 manuscripts: a cast name lower-cased after a title in 22 books (11%), a
     * contraction missing its apostrophe in 4 (2%). Replayed against that shipped manuscript, this
     * repairs exactly the lines the reader quoted — two "dr finch" and one "hadn t".
     *
     * Unconditional, because both are unambiguous typographical repairs rather than a style choice,
     * and the name half is CAST-SCOPED so it cannot corrupt ordinary prose: of the 49 corpus hits, 16
     * are words like "the Captain was late", and those are left exactly as written.
     */
    {
      const names = (castDesign?.characters ?? []).map((c: any) => String(c?.name ?? "")).filter(Boolean);
      const hygiene = repairNameHygieneInChapters(result?.chapters ?? [], names);
      if (hygiene.repairs.length > 0) {
        result = { ...result, chapters: hygiene.chapters };
        ctx.warnings.push(
          `[Agent 9] name/contraction hygiene: ${hygiene.repairs.length} repair(s) — ${hygiene.repairs.slice(0, 4).join("; ")}`
          + `${hygiene.repairs.length > 4 ? ` (+${hygiene.repairs.length - 4} more)` : ""}`,
        );
      }
    }
    result = repairWordFormLockedFacts(result, annotatedLockedFacts);
    result = applyLifecycleContinuityGuard(result, castDesign.characters as CastEntry[], cml).prose;
    result = normalizeLocationNames(result, buildLocationRegistry({ locationProfiles } as any));
    // A_62 abort class #8 (order-of-operations half): the standalone walk-on sweep runs ONCE, but
    // every text-writing pass after it (scaffold/missing_clue regens, the NSD-anchor plant, the
    // resolution backstop) can introduce fresh titled-name shapes — M1v9-8 aborted on "Mr. In"
    // written by a ch4/ch9 missing_clue regen AFTER the sweep. The chain re-runs after every such
    // pass, so anonymising HERE puts the floor at the choke point (the RC-6.2 lesson applied to
    // prose): no late writer can re-introduce a walk-on the sweep would have caught. Same flag,
    // same allowlist, deterministic and cast-safe; function-word "surnames" are exempt inside
    // anonymiseNamedWalkOns itself (the precision half of class #8).
    if (isWalkonRepairEnabled() && Array.isArray(result?.chapters)) {
      const walkonAllowedParts = buildAllowedNameParts(
        ((castDesign.characters ?? []) as any[]).map((c: any) => String(c?.name ?? "")).filter(Boolean),
      );
      result = {
        ...result,
        chapters: result.chapters.map((ch: any) => ({
          ...ch,
          paragraphs: (ch.paragraphs ?? []).map((p: string) => anonymiseNamedWalkOns(String(p ?? ""), walkonAllowedParts).text),
        })),
      };
    }
    return result;
  };

  prose = applyStandardPostProcessingChain(prose);

  // P4 (default-off, AGENT9_REGEN_SCAFFOLD) — RC1.2/RC1.3: dramatize any chapter whose endgame ships its
  // deduction / a suspect clearance as a templated verdict (the rubric scaffold prose≤4 + report-style
  // prose≤6/ending≤7 caps). Per-chapter scoped regen through the SAME detectors the caps use; a rewrite
  // ships only if it clears the shape and drops no locked fact. Runs BEFORE scoring so a cleared chapter
  // is scored honestly; whatever regen can't resolve is logged (the cap then applies — never silent).
  // The empty beat sheet means no embargo is enforced here — safe because this fires in the reveal (the
  // culprit is already named) and the downstream story-validation gate still catches any early reveal.
  if (isScaffoldRegenEnabled() && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    const costBeforeScaffold = client.getCostTracker().getTotalCost();
    try {
      const regenBible = { ...worldState, beatSheet: [] };
      const scaffoldRegen = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
      for (let i = 0; i < prose.chapters.length; i++) {
        const pass = await runScaffoldRegenPass({
          chapter: prose.chapters[i],
          chapterNumber: i + 1,
          bible: regenBible,
          regen: scaffoldRegen,
          onUnresolved: (d, reason) =>
            ctx.warnings.push(`[Agent 9] regen-scaffold UNRESOLVED ch${i + 1} ${d.obligationRef}: ${reason} (cap may still apply).`),
        });
        if (pass.ran) {
          prose.chapters[i] = pass.chapter;
          if (pass.repaired.length > 0) {
            ctx.warnings.push(`[Agent 9] regen-scaffold dramatized [${pass.repaired.join(", ")}] in ch${i + 1}.`);
          }
          // A_64 §2 F3 — the exhaustion floor de-templated a machine-inserted signature the regen
          // could not dramatize. Log loudly: each firing is an injector the regen loop lost to.
          if ((pass.floored ?? []).length > 0) {
            ctx.warnings.push(`[Agent 9] regen-scaffold FLOORED [${(pass.floored ?? []).join(", ")}] in ch${i + 1} — injector template de-templated deterministically (A_64 F3).`);
          }
        }
      }
      prose = applyStandardPostProcessingChain(prose); // re-run hygiene over any rewritten chapters
    } catch (err) {
      ctx.warnings.push(`[Agent 9] regen-scaffold pass failed: ${err instanceof Error ? err.message : String(err)} (chapters unchanged).`);
    } finally {
      const scaffoldCost = client.getCostTracker().getTotalCost() - costBeforeScaffold;
      if (scaffoldCost > 0 && typeof prose?.cost === "number") prose.cost += scaffoldCost;
    }
  }

  // A_62 RC-2.1 (default-off, AGENT9_REGEN_LEAKAGE) — the repair arm `templateLeakageHits` never had.
  // Runs AFTER the scaffold pass on purpose: the two detectors are complementary (prose-guard's
  // scaffold.ts:15 says so — scaffold catches deductive scaffolding, detectTemplateLeakage catches
  // metadata/audit/comma-table leakage), and a scaffold rewrite can itself introduce templated text, so
  // leakage gets the last word. Through the SAME detector the rubric cap keys off, so a passing regen
  // provably no longer trips the class. Paragraph-scoped; a rewrite ships only if it clears the leakage,
  // drops no locked fact, and does NOT shrink the chapter (deletion would trade a prose cap for a
  // completeness_structure run-killer). Runs before scoring so a cleared chapter scores honestly.
  if (isTemplateLeakageRegenEnabled() && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    const costBeforeLeakage = client.getCostTracker().getTotalCost();
    try {
      const regenBible = { ...worldState, beatSheet: [] };
      const leakageRegen = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
      for (let i = 0; i < prose.chapters.length; i++) {
        const pass = await runTemplateLeakageRegenPass({
          chapter: prose.chapters[i],
          chapterNumber: i + 1,
          bible: regenBible,
          regen: leakageRegen,
          onUnresolved: (d, reason) =>
            ctx.warnings.push(`[Agent 9] regen-leakage UNRESOLVED ch${i + 1} ${d.obligationRef}: ${reason} (cap may still apply).`),
        });
        if (pass.ran) {
          prose.chapters[i] = pass.chapter;
          if (pass.repaired.length > 0) {
            ctx.warnings.push(`[Agent 9] regen-leakage cleared [${pass.repaired.join(", ")}] in ch${i + 1}.`);
          }
        }
      }
      prose = applyStandardPostProcessingChain(prose); // re-run hygiene over any rewritten chapters

      // ATTRIBUTION GUARD (A_62 §6 mole list / the "post-processing runs after validation" trap).
      // applyStandardPostProcessingChain runs DETERMINISTIC INJECTORS (applyDeterministicProsePostProcessing,
      // repairWordFormLockedFacts) that WRITE prose — the very layer RC-1 blames for leakage (LLD P7 /
      // P4.4 exists to delete it). So a chapter this pass just cleaned can be re-dirtied downstream.
      // Without this check the P3 A/B would read "the leakage lever doesn't work" when the truth is
      // "the lever worked and an injector undid it" — the exact fired-and-lost misattribution the P3.1
      // label audit had to untangle for the scaffold family. Log it as data, don't paper over it.
      for (let i = 0; i < (prose.chapters?.length ?? 0); i++) {
        const after = detectTemplateLeakage((prose.chapters[i]?.paragraphs ?? []).join(" "));
        if (after.length > 0) {
          ctx.warnings.push(
            `[Agent 9] regen-leakage POST-PROCESSING RE-INJECTED leakage in ch${i + 1} after the pass cleared it: ${after.join(" | ")} — attribute to the injector layer (LLD P7), NOT to lever ineffectiveness.`,
          );
        }
      }
    } catch (err) {
      ctx.warnings.push(`[Agent 9] regen-leakage pass failed: ${err instanceof Error ? err.message : String(err)} (chapters unchanged).`);
    } finally {
      const leakageCost = client.getCostTracker().getTotalCost() - costBeforeLeakage;
      if (leakageCost > 0 && typeof prose?.cost === "number") prose.cost += leakageCost;
    }
  }

  // A_62 RC-2.2 (default-off, AGENT9_REGEN_DUAL_VALUE) — the repair arm for `dualValueNoContrast`
  // (Item 9: clues ≤6). Binds the staged/true pair as ONE observed contradiction; the validator
  // rejects any rewrite that deletes either canonical value (silencing the detector by destroying the
  // clue is the false win this guards). Pair from worldState.contradiction — the same ledger value the
  // rubric consumes. Ordered after the leakage pass (its rewrite could in principle introduce flat
  // restatements) and before the mechanism pass (which can then strip any causal language a contrast
  // rewrite might edge toward). Runs before scoring so a cleared chapter scores honestly.
  if (isDualValueRegenEnabled() && worldState.contradiction && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    const costBeforeDualValue = client.getCostTracker().getTotalCost();
    try {
      const regenBible = { ...worldState, beatSheet: [] };
      const dualValueRegen = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
      for (let i = 0; i < prose.chapters.length; i++) {
        const pass = await runDualValueContrastRegenPass({
          chapter: prose.chapters[i],
          chapterNumber: i + 1,
          bible: regenBible,
          pair: worldState.contradiction,
          regen: dualValueRegen,
          onUnresolved: (d, reason) =>
            ctx.warnings.push(`[Agent 9] regen-dual-value UNRESOLVED ch${i + 1} ${d.obligationRef}: ${reason} (cap may still apply).`),
        });
        if (pass.ran) {
          prose.chapters[i] = pass.chapter;
          if (pass.repaired.length > 0) {
            ctx.warnings.push(`[Agent 9] regen-dual-value bound the contradiction [${pass.repaired.join(", ")}] in ch${i + 1}.`);
          }
        }
      }
      prose = applyStandardPostProcessingChain(prose); // re-run hygiene over any rewritten chapters
      // A_64 §2 (the 7.2 rewire) — ship-scope residual arm. The per-chapter loop above detects on
      // one chapter's text; the CAP detects on the assembled full story (the 7.2 split-brain: lever
      // enabled + silent on every arm while tide_on capped). If the cap-scope detector still fires
      // after the loop + hygiene, bind the pair with a targeted regen whose acceptance IS the
      // cap-scope detector (candidate spliced into the full story).
      const residual = await runDualValueFullStoryResidualPass({
        chapters: prose.chapters,
        bible: regenBible,
        pair: worldState.contradiction,
        regen: dualValueRegen,
        onUnresolved: (d, reason) =>
          ctx.warnings.push(`[Agent 9] regen-dual-value SHIP-SCOPE UNRESOLVED ${d.obligationRef}: ${reason} (cap will apply).`),
      });
      if (residual.ran) {
        if (residual.repaired) {
          prose.chapters = residual.chapters;
          prose = applyStandardPostProcessingChain(prose);
          ctx.warnings.push(`[Agent 9] regen-dual-value bound the contradiction at SHIP scope (cross-chapter window — A_64 7.2 rewire).`);
        } else {
          ctx.warnings.push(`[Agent 9] regen-dual-value: flat pair persists at SHIP scope — the dualValueNoContrast cap WILL apply (honest).`);
        }
      }
    } catch (err) {
      ctx.warnings.push(`[Agent 9] regen-dual-value pass failed: ${err instanceof Error ? err.message : String(err)} (chapters unchanged).`);
    } finally {
      const dualValueCost = client.getCostTracker().getTotalCost() - costBeforeDualValue;
      if (dualValueCost > 0 && typeof prose?.cost === "number") prose.cost += dualValueCost;
    }
  }

  // S8 (default-off, AGENT9_REGEN_MECHANISM) — the fifth regen pass: any chapter STRICTLY BEFORE the
  // discriminating-test chapter that fully explains HOW the concealment trick worked trips the
  // plot_structure/pacing "mechanism explained too early" cap. This rewrites the offending paragraph to
  // withhold the causal clause (keeping the physical clue on the page), through the SAME
  // chapterFullyExplainsMechanism predicate the cap keys off; a rewrite ships only if it clears the
  // predicate and drops no locked fact. Bible-authoritative boundary: resolveDiscriminatingTestChapter,
  // never re-derived stage modes. Runs before scoring so a cleared chapter scores honestly.
  if (isMechanismRegenEnabled() && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    const mechanismTerms = deriveMechanismTerms(String(caseBlock?.hidden_model?.mechanism?.description ?? ""));
    const dtChapter = resolveDiscriminatingTestChapter(macroArcPlan);
    if (mechanismTerms.length > 0 && dtChapter != null) {
      const costBeforeMechanism = client.getCostTracker().getTotalCost();
      try {
        const regenBibleM = { ...worldState, beatSheet: [] };
        const mechanismRegen = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
        for (let i = 0; i < prose.chapters.length; i++) {
          if (i + 1 >= dtChapter) continue; // only chapters strictly before the discriminating-test scene
          const pass = await runMechanismRevealRegenPass({
            chapter: prose.chapters[i],
            chapterNumber: i + 1,
            mechanismTerms,
            bible: regenBibleM,
            regen: mechanismRegen,
            onUnresolved: (_d, reason) =>
              ctx.warnings.push(`[Agent 9] regen-mechanism UNRESOLVED ch${i + 1}: ${reason} (cap may still apply).`),
          });
          if (pass.ran) {
            prose.chapters[i] = pass.chapter;
            if (pass.repaired.length > 0) {
              ctx.warnings.push(`[Agent 9] regen-mechanism withheld the method in ch${i + 1}.`);
            }
          }
        }
        prose = applyStandardPostProcessingChain(prose); // re-run hygiene over any rewritten chapters
      } catch (err) {
        ctx.warnings.push(`[Agent 9] regen-mechanism pass failed: ${err instanceof Error ? err.message : String(err)} (chapters unchanged).`);
      } finally {
        const mechanismCost = client.getCostTracker().getTotalCost() - costBeforeMechanism;
        if (mechanismCost > 0 && typeof prose?.cost === "number") prose.cost += mechanismCost;
      }
    }
  }

  // P4 (default-off, AGENT9_REGEN_TRANSITION) — RC3.3: dramatize an explicit body-discovery/confirmation
  // bridge in any chapter that shifts a missing-person frame to murder with no bridge (detected here in
  // the worker, which owns @cml/story-validation; the BRIDGE_TERMS predicate is injected into the pass so
  // prompts-llm stays acyclic). Runs before scoring so a bridged chapter no longer trips the continuity gate.
  if (isTransitionRegenEnabled() && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    const transitionDefects = detectMissingCaseTransitionBridge(prose.chapters);
    if (transitionDefects.length > 0) {
      const costBeforeTransition = client.getCostTracker().getTotalCost();
      try {
        const regenBibleT = { ...worldState, beatSheet: [] };
        const regenFnT = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
        const bridgePresent = (text: string): boolean => BRIDGE_TERMS.test(text);
        for (const loc of transitionDefects) {
          const idx = loc.chapterNumber - 1;
          if (idx < 0 || idx >= prose.chapters.length) continue;
          const pass = await runCaseTransitionRegenPass({
            chapter: prose.chapters[idx],
            chapterNumber: loc.chapterNumber,
            paragraphIndex: loc.paragraphIndex,
            bible: regenBibleT,
            regen: regenFnT,
            bridgePresent,
            onUnresolved: (d, reason) => ctx.warnings.push(`[Agent 9] regen-transition UNRESOLVED ch${loc.chapterNumber}: ${reason} (continuity gate still applies).`),
          });
          if (pass.ran && pass.repaired.length > 0) {
            prose.chapters[idx] = pass.chapter;
            ctx.warnings.push(`[Agent 9] regen-transition inserted a case-transition bridge in ch${loc.chapterNumber}.`);
          }
        }
        prose = applyStandardPostProcessingChain(prose);
      } catch (err) {
        ctx.warnings.push(`[Agent 9] regen-transition pass failed: ${err instanceof Error ? err.message : String(err)} (chapters unchanged).`);
      } finally {
        const transitionCost = client.getCostTracker().getTotalCost() - costBeforeTransition;
        if (transitionCost > 0 && typeof prose?.cost === "number") prose.cost += transitionCost;
      }
    }
  }

  // A_61 RC5.3 — dialogue-distinctiveness (voice idiolect) gate. Verifies the frozen signature tics reach
  // the prose: coverage (each speaker uses their tic) is warn-only; leakage (a tic in the wrong speaker's
  // mouth) is the strong voice-swap signal. shadow logs telemetry; enforce REPAIRS leakage via the scoped
  // regen (runVoiceLeakageRegenPass) and surfaces whatever regen cannot clear as a release warning.
  // Never aborts (repair-not-abort); attribution is conservative so it can't fail unattributable prose.
  if (voiceEnforceMode() !== "off" && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    try {
      const capsules = ((ctx.characterBundle?.characters ?? []) as any[])
        .map((c) => ({ name: String(c?.name ?? ""), speechTics: String(c?.signatureTic ?? "").trim() ? [String(c.signatureTic).trim()] : [] }))
        .filter((c) => c.name);
      const chapterTextOf = (ch: any): string => ((ch?.paragraphs ?? []) as string[]).join(" ");
      const proseText = (prose.chapters as any[]).map(chapterTextOf).join("\n\n");
      const verdict = validateDialogueIdiolect(capsules, proseText);
      const voiceMetricsLine = `[Agent 9] voice-idiolect (${voiceEnforceMode()}): ${verdict.metrics.speakersWithTic}/${verdict.metrics.distinctSignatures} speakers used their tic; ${verdict.metrics.ticLeakagePairs} leakage pair(s); ${verdict.metrics.ticOveruseSpeakers.length} overuse speaker(s)${verdict.metrics.ticOveruseSpeakers.length ? ` (${verdict.metrics.ticOveruseSpeakers.join(", ")})` : ""}.`;
      // console.warn AND ctx.warnings: agent9-era ctx.warnings were observed missing from the
      // canary's result.warnings on shipped runs (plumbing bug, backlog) — the chain logs are the
      // A/B analyzer's tic-metrics source, so this line must reach stdout/stderr directly, the
      // same channel applyCanonicalVictimRescue proves durable.
      console.warn(voiceMetricsLine);
      ctx.warnings.push(voiceMetricsLine);
      if (voiceEnforceMode() === "enforce" && !verdict.ok) {
        // RC5.3 enforce-with-repair — regen each leaking chapter's offending line in the speaker's own
        // idiom, gated on the SAME validateDialogueIdiolect predicate + locked-fact preservation. Runs
        // pre-validation/pre-scoring like the other regen passes; unresolved leaks warn exactly as before.
        const costBeforeVoice = client.getCostTracker().getTotalCost();
        try {
          const regenBibleV = { ...worldState, beatSheet: [] };
          const regenFnV = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
          const leakedTicsIn = (text: string): string[] =>
            validateDialogueIdiolect(capsules, text).issues
              .filter((iss) => iss.severity === "error" && iss.type === "voice_tic_leakage")
              .map((iss) => String(iss.tic ?? ""))
              .filter(Boolean);
          for (let i = 0; i < prose.chapters.length; i++) {
            const chVerdict = validateDialogueIdiolect(capsules, chapterTextOf(prose.chapters[i]));
            const leaks = chVerdict.issues
              .filter((iss) => iss.severity === "error" && iss.type === "voice_tic_leakage")
              .map((iss) => ({ owner: String(iss.owner ?? ""), speaker: String(iss.speaker ?? ""), tic: String(iss.tic ?? "") }));
            if (leaks.length === 0) continue;
            const pass = await runVoiceLeakageRegenPass({
              chapter: prose.chapters[i],
              chapterNumber: i + 1,
              leaks,
              bible: regenBibleV,
              regen: regenFnV,
              leakedTics: leakedTicsIn,
              onUnresolved: (_d, reason) =>
                ctx.warnings.push(`[Agent 9] regen-voice UNRESOLVED ch${i + 1}: ${reason} (leakage warning stands).`),
            });
            if (pass.ran && pass.repaired.length > 0) {
              prose.chapters[i] = pass.chapter;
              ctx.warnings.push(`[Agent 9] regen-voice cleared ${pass.repaired.length} cross-speaker tic leak(s) in ch${i + 1}.`);
            }
          }
          prose = applyStandardPostProcessingChain(prose); // re-run hygiene over any rewritten chapters
        } catch (err) {
          ctx.warnings.push(`[Agent 9] regen-voice pass failed: ${err instanceof Error ? err.message : String(err)} (chapters unchanged).`);
        } finally {
          const voiceCost = client.getCostTracker().getTotalCost() - costBeforeVoice;
          if (voiceCost > 0 && typeof prose?.cost === "number") prose.cost += voiceCost;
        }
        // Surface whatever still leaks AFTER repair (the pre-repair issues may now be stale).
        const postVerdict = validateDialogueIdiolect(capsules, (prose.chapters as any[]).map(chapterTextOf).join("\n\n"));
        for (const issue of postVerdict.issues.filter((i) => i.severity === "error")) {
          ctx.warnings.push(`[Agent 9] voice-idiolect LEAKAGE: ${issue.message}`);
        }
      }
    } catch (err) {
      ctx.warnings.push(`[Agent 9] voice-idiolect gate skipped: ${err instanceof Error ? err.message : String(err)}.`);
    }
  }

  // S1 (architecture/FLAG-AUDIT.md) — the critique-rewrite pass was REMOVED 2026-08-01.
  // Probe complete with a negative verdict: A_63 P5.1, 4 matched fresh pairs — targets flat
  // (oh -0.50, dlg 0.00, pace 0.00), prose -1.00, rubric total -2.0. It was off in .env.local
  // AND off by code default, so removal is a runtime no-op. Do not reintroduce without a
  // fresh probe; the negative result is the reason it is gone, not neglect.

  // 1c: Repair digit-form conversions of word-phrased locked facts (e.g. "11:10 PM" → "ten minutes past eleven").
  // Must run before StoryValidationPipeline so ProseConsistencyValidator sees the canonical form.
  // 1d: Normalize location names to canonical capitalised forms before validation.
  // (Both now handled inside applyStandardPostProcessingChain above.)
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

  // A_73 §3a — null until validation computes it. Was 0, which the "initial" metrics snapshot then
  // published as a measurement (see canary-core.mjs). An unmeasured metric must not look measured.
  let entityPronounDriftCount: number | null = null;
  let culpritGateAliasMatchesCount = 0;
  let culpritGateFalsePositiveCount = 0;

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
      const phraseTelemetry = (prose.validationDetails as any)?.phraseTelemetry;
      const integrityTelemetry = (prose.validationDetails as any)?.integrityTelemetry;
      const phraseRolloutFlags = phraseTelemetry?.rolloutFlags ?? {};
      const clearancePasteTelemetry = getDeterministicClearancePasteTelemetry();
      // A_73 §15.1 — the clue injector now reports like the clearance one.
      const cluePasteTelemetry = getDeterministicCluePasteTelemetry();
      return {
        template_linter_checks_run: linter?.checksRun ?? 0,
        template_linter_failed_checks: linter?.failedChecks ?? 0,
        template_linter_opening_style_entropy_failures:
          linter?.openingStyleEntropyFailures ?? 0,
        template_linter_opening_style_entropy_bypasses:
          linter?.openingStyleEntropyBypasses ?? 0,
        template_linter_opener_bypasses: linter?.openerBypasses ?? 0,
        template_linter_paragraph_fingerprint_failures:
          linter?.paragraphFingerprintFailures ?? 0,
        template_linter_ngram_overlap_failures: linter?.ngramOverlapFailures ?? 0,
        template_linter_boundary_integrity_failures: linter?.boundaryIntegrityFailures ?? 0,
        season_lock_replacements_total: integrityTelemetry?.seasonLockReplacements ?? 0,
        season_lock_protected_collisions_blocked:
          integrityTelemetry?.seasonLockProtectedCollisionsBlocked ?? 0,
        mechanical_term_collision_count:
          integrityTelemetry?.mechanicalSeasonCollisionCount ?? 0,
        boundary_integrity_failures_count: linter?.boundaryIntegrityFailures ?? 0,
        semantic_rewrite_diff_blocks_count:
          integrityTelemetry?.semanticRewriteDiffBlocks ?? 0,
        entity_pronoun_drift_count: entityPronounDriftCount,
        // A_71 — the AGENT9_REGEN_SUSPECT_ELIM probe's read path. A_70 §2 measured the WRONG
        // injector (enforceSuspectEliminationPresence, 0/14 and still 0/18) and concluded the
        // clearance prose had no injector source. It has one: buildDeterministicClearanceParagraph
        // in deterministic-repair.ts, across three call sites. This counts what actually shipped.
        deterministic_clearance_paste_count: clearancePasteTelemetry.count,
        deterministic_clearance_paste_suspects: clearancePasteTelemetry.suspects,
        deterministic_clue_paste_count: cluePasteTelemetry.count,
        deterministic_clue_paste_clue_ids: cluePasteTelemetry.clueIds,
        culprit_gate_alias_matches_count: culpritGateAliasMatchesCount,
        culprit_gate_false_positive_count: culpritGateFalsePositiveCount,
        phrase_telemetry_recurring_phrase_count: phraseTelemetry?.recurringPhraseCount ?? 0,
        phrase_telemetry_configured_detected_phrase_count:
          phraseTelemetry?.configuredDetectedPhraseCount ?? 0,
        phrase_telemetry_configured_repair_phrase_count:
          phraseTelemetry?.configuredRepairPhraseCount ?? 0,
        phrase_telemetry_repair_phrase_candidate_count:
          phraseTelemetry?.repairPhraseCandidateCount ?? 0,
        phrase_telemetry_hard_ban_linter_failures:
          phraseTelemetry?.hardBanLinterFailures ?? 0,
        phrase_rollout_phrase_family_detection_enabled:
          phraseRolloutFlags.phraseFamilyDetectionEnabled ?? null,
        phrase_rollout_uncapped_repair_targets_enabled:
          phraseRolloutFlags.uncappedRepairTargetsEnabled ?? null,
        phrase_rollout_precommit_phrase_gate_enabled:
          phraseRolloutFlags.precommitPhraseGateEnabled ?? null,
        phrase_rollout_tiered_phrase_contract_enabled:
          phraseRolloutFlags.tieredPhraseContractEnabled ?? null,
        phrase_rollout_phrase_specific_linter_enabled:
          phraseRolloutFlags.phraseSpecificLinterEnabled ?? null,
        phrase_rollout_blue_sky_mode_enabled:
          phraseRolloutFlags.blueSkyModeEnabled ?? null,
        integrity_rollout_season_lock_context_aware_enabled:
          phraseRolloutFlags.seasonLockContextAwareEnabled ?? null,
        integrity_rollout_season_lock_protected_collocations_enabled:
          phraseRolloutFlags.seasonLockProtectedCollocationsEnabled ?? null,
        integrity_rollout_boundary_integrity_gate_enabled:
          phraseRolloutFlags.boundaryIntegrityGateEnabled ?? null,
        integrity_rollout_semantic_rewrite_diff_guard_enabled:
          phraseRolloutFlags.semanticRewriteDiffGuardEnabled ?? null,
        integrity_rollout_entity_fidelity_gate_enabled:
          phraseRolloutFlags.entityFidelityGateEnabled ?? null,
        integrity_rollout_culprit_alias_gate_enabled:
          phraseRolloutFlags.culpritAliasGateEnabled ?? null,
        integrity_rollout_integrity_retry_packet_enabled:
          phraseRolloutFlags.integrityRetryPacketEnabled ?? null,
        integrity_rollout_integrity_blue_sky_mode_enabled:
          phraseRolloutFlags.integrityBlueSkyModeEnabled ?? null,
        integrity_telemetry_season_lock_replacements:
          integrityTelemetry?.seasonLockReplacements ?? 0,
        integrity_telemetry_protected_collisions_blocked:
          integrityTelemetry?.seasonLockProtectedCollisionsBlocked ?? 0,
        integrity_telemetry_semantic_rewrite_diff_blocks:
          integrityTelemetry?.semanticRewriteDiffBlocks ?? 0,
        integrity_telemetry_mechanical_season_collision_count:
          integrityTelemetry?.mechanicalSeasonCollisionCount ?? 0,
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
    bottom_up_redesign_enabled: bottomUpRedesignEnabled,
    batch_size: effectiveProseBatchSize ?? 1,
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
    batch_commit_records: (prose.validationDetails as any)?.batchCommitRecords ?? [],
    // NULL, not false, when the producing stage was skipped — a check that did not run must not be
    // reportable as a check that passed.
    outline_coverage_issue_count: outlineCoverageEvaluated ? outlineCoverageIssues.length : null,
    critical_clue_coverage_gap: coverageEvaluated ? coverageResult.hasCriticalGaps : null,
    nsd_transfer_steps: ctx.nsdTransferTrace.length,
    nsd_transfer_trace: ctx.nsdTransferTrace,
    underflow_hard_floor_misses: (prose.validationDetails as any)?.underflow?.hardFloorMisses ?? 0,
    underflow_preferred_target_misses: (prose.validationDetails as any)?.underflow?.preferredTargetMisses ?? 0,
    underflow_hard_floor_miss_chapters: (prose.validationDetails as any)?.underflow?.hardFloorMissChapters ?? [],
    underflow_preferred_target_miss_chapters: (prose.validationDetails as any)?.underflow?.preferredTargetMissChapters ?? [],
    underflow_expansion_attempts: (prose.validationDetails as any)?.underflow?.expansionAttempts ?? 0,
    underflow_expansion_recovered: (prose.validationDetails as any)?.underflow?.expansionRecovered ?? 0,
    underflow_expansion_failed: (prose.validationDetails as any)?.underflow?.expansionFailed ?? 0,
    chapter_word_counts: (prose.validationDetails as any)?.underflow?.chapterWordCounts ?? [],
  });

  // First-pass scoring
  if (enableScoring && scoreAggregator && scoringLogger) {
    const scorer = new ProseScorer();
    const adapted = adaptProseForScoring(prose.chapters, (cml as any).CASE, clues, {
      fallbackTelemetry: (prose.validationDetails as any)?.fallbackTelemetry ?? [],
    });
    const score = await scorer.score({}, adapted, buildProseScoreArgs({
      narrativeSceneCount: totalSceneCount || undefined,
    }));
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
      cast: castDesign,
      // The SAME committed spec — a schema-repair retry that re-decided the voice would produce a
      // book written half in one voice and half in another, and the conformance number would then be
      // measuring the retry rather than the lever.
      voiceSpec: committedVoiceSpec,
      ...proseModelOverride,
      detectiveType: inputs.detectiveType,
      worldDocument: ctx.worldDocument,
      macroArcPlan,
      characterProfiles: characterProfiles,
      locationProfiles: locationProfiles,
      temporalContext: temporalContext,
      characterBundle: ctx.characterBundle,
      moralAmbiguityNote,
      mechanismEnvironmentException,
      lockedFacts: annotatedLockedFacts,
      clueDistribution: clues,
      narrativeState,
      targetLength: inputs.targetLength,
      narrativeStyle: inputs.narrativeStyle,
      qualityGuardrails: [...baselineProseGuardrails, ...upstreamGuardrails, ...schemaRepairGuardrails],
      writingGuides: loadWritingGuides(workspaceRoot),
      runId,
      projectId: projectId || "",
      bottomUpRedesignEnabled,
      enableSurgicalFingerprintRetry: inputs.enableSurgicalFingerprintRetry,
      enableOutlineCompleteness: inputs.enableOutlineCompleteness,
      storyContract,
      storyGeometry: ctx.storyGeometry,
      onProgress: (phase: string, message: string, percentage: number) =>
        reportProgress(phase as any, message, percentage),
      batchSize: effectiveProseBatchSize,
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
    prose = applyStandardPostProcessingChain(retriedProse);
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

  // A_57 D5 — re-validate-after-mutation for the pronoun property. Extend the validation-gated mutation
  // law (until now only on the grounding lead, §4.2) to the deterministic post-processing passes that
  // could re-introduce gender drift. The CharacterConsistencyValidator is deterministic + synchronous and
  // reads cast genders from cml.CASE.cast, so we can cheaply count pronoun_gender_mismatch errors before
  // and after a pass; if a pass INCREASES that count, revert it (the §3.3 "sweep flipped a correct
  // pronoun run" bug). Pure-win: it only ever reverts a regression, never blocks an improvement. Any
  // measurement failure falls back to "no signal" (score 100), so the guard is inert rather than harmful.
  // Gated by AGENT9_MUTATION_REVALIDATION (default on). Only cleanup/repair passes are wrapped — NEVER a
  // content-injection pass, where a revert could drop a REQUIRED culprit/resolution/clearance sentence.
  // RC2.2: when Bible-authoritative, the pronoun-stability validator checks against the frozen Bible
  // gender map (the single source), not a re-parse of raw cast gender. RC2.5's soundness repair has
  // already guaranteed every cast member resolves, so the map is complete.
  const bibleGenderMapRc22 = isBibleAuthoritativeEnabled() ? genderMapFromBible(worldState) : undefined;
  const pronounStabilityValidator = buildPronounStabilityValidator(cml, runId, projectId || runId, bibleGenderMapRc22);
  const applyPronounGuardedMutation = (currentProse: any, mutate: (p: any) => any, label: string): any => {
    if (!isMutationRevalidationEnabled()) return mutate(currentProse);
    const outcome = mutateThenValidate(currentProse, mutate, pronounStabilityValidator);
    if (outcome.reverted) {
      ctx.warnings.push(`[Agent 9] mutation-revalidation (A_57 D5): reverted ${label} — ${outcome.reason}.`);
    }
    return outcome.value;
  };

  prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles, castDesign.characters, pronounRepairEnabled);
  prose = repairWordFormLockedFacts(prose, annotatedLockedFacts);
  // Ledger Item 15 — LLM-first: surface each missing atomic locked-fact value in-scene via the
  // insertion regen BEFORE the deterministic injector, so "The hour stood at X." (externally read
  // as generated-sounding) fires only as a rare floor. Insertion-only pass: existing paragraphs are
  // never modified; a regen ships only if the canonical value is now verbatim on the page.
  if (isLockedFactRegenEnabled() && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    const costBeforeLf = client.getCostTracker().getTotalCost();
    try {
      const regenBibleLf = { ...worldState, beatSheet: [] };
      const regenFnLf = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
      const chapterTextsLf = (prose.chapters as any[]).map((ch: any) =>
        (Array.isArray(ch?.paragraphs) ? ch.paragraphs.join("\n\n") : "").toLowerCase(),
      );
      for (const fact of annotatedLockedFacts as any[]) {
        const canonical = typeof fact?.value === "string" ? fact.value.trim() : "";
        const description = typeof fact?.description === "string" ? fact.description.trim() : "";
        if (!canonical || !description || !isAtomicLockedFactValue(canonical)) continue;
        if (chapterTextsLf.some((t) => t.includes(canonical.toLowerCase()))) continue; // already on the page
        // Target the chapter with the strongest description-token affinity (the injector's own heuristic).
        const descTokens = tokenizeLockedFactDescription(description);
        if (descTokens.length < 2) continue;
        let bestIdx = -1;
        let bestScore = 1; // require >= 2 token hits, mirroring the injector's gate
        for (let i = 0; i < chapterTextsLf.length; i += 1) {
          const score = descTokens.filter((token) => chapterTextsLf[i].includes(token)).length;
          if (score > bestScore) { bestScore = score; bestIdx = i; }
        }
        if (bestIdx < 0) continue;
        const pass = await runInsertionRegenPass({
          chapter: prose.chapters[bestIdx],
          defects: [{
            chapter: bestIdx + 1,
            kind: "locked_fact_absent",
            detail: `${description} — the exact phrase "${canonical}" must appear verbatim, woven into the scene as observation or dialogue`,
            obligationRef: canonical,
            severity: "hard",
          }],
          bible: regenBibleLf,
          regen: regenFnLf,
          presenceValidatorFor: () => (c: any) => {
            const present = ((c?.paragraphs ?? []) as string[]).join(" ").toLowerCase().includes(canonical.toLowerCase());
            return { ok: present, score: present ? 100 : 0, violations: present ? [] : [`locked_fact_absent:${canonical}`] };
          },
          onUnresolved: (_d: any, reason: string) =>
            ctx.warnings.push(`[Agent 9] regen-locked-fact UNRESOLVED "${canonical}": ${reason} (injector floor applies).`),
        });
        if (pass.ran && pass.repaired.length > 0) {
          prose.chapters[bestIdx] = pass.chapter;
          chapterTextsLf[bestIdx] = ((pass.chapter?.paragraphs ?? []) as string[]).join("\n\n").toLowerCase();
          ctx.warnings.push(`[Agent 9] regen-locked-fact surfaced "${canonical}" in ch${bestIdx + 1} (injector suppressed).`);
        }
      }
    } catch (err) {
      ctx.warnings.push(`[Agent 9] regen-locked-fact pass failed: ${err instanceof Error ? err.message : String(err)} (injector floor applies).`);
    } finally {
      const lfCost = client.getCostTracker().getTotalCost() - costBeforeLf;
      if (lfCost > 0 && typeof prose?.cost === "number") prose.cost += lfCost;
    }
  }
  prose = enforceLockedFactValuePresence(prose, annotatedLockedFacts);
  // A_57 D1: clean any garbled evidence splice (a locked-fact value joined to the next clause by a stray
  // apostrophe/no space) BEFORE the culprit/resolution passes run over the text. Minimal + safe — it only
  // rewrites a non-contraction, non-possessive, non-name-particle apostrophe-join into a clean separator.
  {
    const surfacingRepair = repairMalformedSurfacing(prose);
    if (surfacingRepair.repairCount > 0) {
      const beforeSurfacing = prose;
      // D5-guarded: a splice cleanup must never introduce a pronoun regression.
      prose = applyPronounGuardedMutation(
        prose,
        () => surfacingRepair.prose,
        `repairMalformedSurfacing (A_57 D1, ${surfacingRepair.repairCount} splice(s))`,
      );
      if (prose !== beforeSurfacing) {
        ctx.warnings.push(
          `[Agent 9] repairMalformedSurfacing: cleaned ${surfacingRepair.repairCount} garbled evidence splice(s) (A_57 D1).`,
        );
      }
    }
  }
  /**
   * X29 — the last chapter a suspect clearance may land in, 1-based: geometry's reveal chapter.
   *
   * Every chapter after it is AFTERMATH, whose contract's `mustNotContain` forbids a suspect clearance,
   * so a clearance written there is detected as `aftermath_repeat` and repaired back out again. Two
   * obligations pulling one chapter in opposite directions is a contract defect, not a tuning problem;
   * on the 08-07 run it cost ch9 two of its eight paragraphs (REVIEW_08 §7).
   *
   * Read ONCE and handed to both writers of clearance prose — the regen pass and the deterministic
   * injector floor — because bounding only one of them leaves the other free to start the same fight.
   * `undefined` (geometry off, or no reveal in the contract) ⇒ unbounded, the pre-X29 behaviour.
   */
  const lastClearanceChapter: number | undefined =
    ctx.storyGeometry?.chapterContract?.find((c) => c.role === "reveal")?.chapter;

  // A_61 RC1.4 — inject→regen for culprit-evidence (B5) and resolution (B6). Each runs BEFORE its
  // deterministic injector so a successful regen makes the injector a logged no-op floor; on failure the
  // injector fires exactly as today. Wrapped so any regen failure leaves prose untouched.
  if ((isCulpritEvidenceRegenEnabled() || isResolutionRegenEnabled() || isSuspectEliminationRegenEnabled()) && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    const costBeforeRegen = client.getCostTracker().getTotalCost();
    try {
      const regenBibleRc14 = { ...worldState, beatSheet: [] };
      const regenFnRc14 = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
      if (isCulpritEvidenceRegenEnabled()) {
        const liveCulprits = computeLiveCulprits(prose, cml);
        if (liveCulprits.length > 0) {
          const pass = await runCulpritEvidenceRegenPass({
            chapters: prose.chapters,
            liveCulprits,
            bible: regenBibleRc14,
            regen: regenFnRc14,
            onUnresolved: (d, reason) => ctx.warnings.push(`[Agent 9] regen-culprit-evidence UNRESOLVED ${d.obligationRef}: ${reason} (injector floor applies).`),
          });
          if (pass.ran) {
            prose.chapters = pass.chapters;
            if (pass.repaired.length > 0) ctx.warnings.push(`[Agent 9] regen-culprit-evidence linked [${pass.repaired.join(", ")}] (injector suppressed for these).`);
          }
        }
      }
      if (isResolutionRegenEnabled()) {
        const culprit = String(((cml as any)?.CASE?.culpability?.culprits ?? [])[0] ?? "").trim();
        const lastIdx = prose.chapters.length - 1;
        if (culprit && lastIdx >= 0) {
          // Ledger Item 11: the resolution's home is the REVEAL chapter, not unconditionally the
          // final chapter (which is aftermath when the reveal lands earlier). Skip entirely when ANY
          // chapter already resolves (mirrors injectResolutionIfAbsent); otherwise target the last
          // chapter that names the culprit (the de-facto reveal), falling back to the final chapter.
          const culpritSurnameR = extractSurname(culprit);
          const culpritReR = new RegExp(`\\b${culpritSurnameR.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
          const chapterTextR = (ch: any): string => ((ch?.paragraphs ?? []) as string[]).join(" ");
          const anyResolves = (prose.chapters as any[]).some((ch) => RESOLUTION_RE.test(chapterTextR(ch)) && culpritReR.test(chapterTextR(ch)));
          let targetIdx = lastIdx;
          for (let i = lastIdx; i >= 0; i--) {
            if (culpritReR.test(chapterTextR(prose.chapters[i]))) { targetIdx = i; break; }
          }
          if (!anyResolves) {
            const pass = await runResolutionRegenPass({
              chapter: prose.chapters[targetIdx],
              chapterNumber: targetIdx + 1,
              culprit,
              bible: regenBibleRc14,
              regen: regenFnRc14,
              onUnresolved: (d, reason) => ctx.warnings.push(`[Agent 9] regen-resolution UNRESOLVED ${d.obligationRef}: ${reason} (injector floor applies).`),
            });
            if (pass.ran) {
              prose.chapters[targetIdx] = pass.chapter;
              if (pass.repaired.length > 0) ctx.warnings.push(`[Agent 9] regen-resolution dramatized the reveal for "${culprit}" in ch${targetIdx + 1} (injector suppressed).`);
            }
          }
        }
      }
      if (isSuspectEliminationRegenEnabled()) {
        // A_67 FIX-1(b): dramatize each non-culprit suspect's clearance in-scene BEFORE the deterministic
        // register-sentence injector floor at enforceSuspectEliminationPresence, so a successful regen
        // makes the floor a logged no-op. Unresolved suspects fall through to the injector (never abort).
        const elimSuspects = computeEliminationSuspects(cml, castDesign);
        if (elimSuspects.length > 0) {
          const pass = await runSuspectEliminationRegenPass({
            chapters: prose.chapters,
            suspects: elimSuspects,
            bible: regenBibleRc14,
            regen: regenFnRc14,
            // X29 — a clearance may not land in the aftermath, which forbids one. Geometry knows where
            // the reveal is; without it the pass keeps its old unbounded behaviour.
            lastClearanceChapter,
            onUnresolved: (d, reason) => ctx.warnings.push(`[Agent 9] regen-suspect-elimination UNRESOLVED ${d.obligationRef}: ${reason} (injector floor applies).`),
          });
          if (pass.ran) {
            prose.chapters = pass.chapters;
            if (pass.repaired.length > 0) ctx.warnings.push(`[Agent 9] regen-suspect-elimination dramatised clearances for [${pass.repaired.join(", ")}] (injector suppressed for these).`);
          }
        }
      }
    } catch (err) {
      ctx.warnings.push(`[Agent 9] RC1.4 regen pass failed: ${err instanceof Error ? err.message : String(err)} (injector floor applies).`);
    } finally {
      const regenCost = client.getCostTracker().getTotalCost() - costBeforeRegen;
      if (regenCost > 0 && typeof prose?.cost === "number") prose.cost += regenCost;
    }
  }
  // A_66 P3 — THE VERIFY-MODE PRONOUN REPAIR CHANNEL, wired at last. `pronoun_policy: verify`
  // has always documented "repairs go through LLM regen, validator-gated" — but `pronoun_mismatch`
  // had an instruction, a regen path, and ZERO producers. The two HIGH-PRECISION detectors are now
  // the producers: each hit becomes a scoped, phrase-level regen (the ANALYSIS_20-safe shape —
  // "change nothing else"), accepted only if the high-precision count strictly falls and nothing
  // else regresses. Precision-triggered ⇒ cost-bounded (clean drafts = zero hits = zero calls).
  // Kill-switch: AGENT9_REGEN_PRONOUN=false (runtime getter, never a module const).
  if (
    isPronounRegenEnabled() &&
    getPronounPolicySettings().policy === "verify" &&
    Array.isArray(prose.chapters) &&
    prose.chapters.length > 0
  ) {
    const hpCast = (castDesign.characters as any[])
      .filter((c) => typeof c?.gender === "string" && /^(male|female)$/i.test(c.gender))
      .map((c) => ({ name: String(c.name ?? "").trim(), gender: String(c.gender).toLowerCase() }));
    if (hpCast.length > 0) {
      const costBeforePronoun = client.getCostTracker().getTotalCost();
      try {
        const regenBibleP = { ...worldState, beatSheet: [] };
        const pronounRegen = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
        const genderByName = new Map(hpCast.map((c) => [c.name, c.gender]));
        for (let i = 0; i < prose.chapters.length; i++) {
          const chText = ((prose.chapters[i]?.paragraphs ?? []) as string[]).join("\n\n");
          if (!chText.trim()) continue;
          const events = [
            ...detectAttributionFlips(chText, hpCast as any),
            ...detectImpossibleSelfReferences(chText, hpCast as any),
          ];
          if (events.length === 0) continue;
          const defects = events.slice(0, 4).map((e, k) => ({
            chapter: i + 1,
            kind: "pronoun_mismatch" as const,
            detail: `${e.characterName} (${genderByName.get(e.characterName) ?? "?"}) is misgendered in: "${e.sentence}"`,
            obligationRef: `pronoun_ch${i + 1}_${k}`,
            severity: "hard" as const,
          }));
          const hpChapterValidator = (c: any) => {
            const t = ((c?.paragraphs ?? []) as string[]).join("\n\n");
            const n = detectAttributionFlips(t, hpCast as any).length + detectImpossibleSelfReferences(t, hpCast as any).length;
            return { ok: n === 0, score: 100 - n * 10, violations: n > 0 ? ["pronoun_high_precision_mismatch"] : [] };
          };
          const validate = composeChapterValidator(hpChapterValidator);
          const result = await runRegenRepair(
            prose.chapters[i],
            defects as any,
            (chapter: any, d: any) => buildRegenRequest(chapter, d, regenBibleP),
            pronounRegen,
            validate,
            {
              maxAttemptsPerDefect: 2,
              onUnresolved: (d: any, reason: string) =>
                ctx.warnings.push(`[Agent 9] regen-pronoun UNRESOLVED ch${i + 1} ${d.obligationRef}: ${reason} (drift ships; census will count it).`),
            },
          );
          if (result.unresolved.length < defects.length) {
            prose.chapters[i] = result.chapter;
            ctx.warnings.push(`[Agent 9] regen-pronoun repaired ${defects.length - result.unresolved.length} high-precision mismatch(es) in ch${i + 1} (A_66 P3).`);
          }
        }
      } catch (err) {
        ctx.warnings.push(`[Agent 9] regen-pronoun pass failed: ${err instanceof Error ? err.message : String(err)} (chapters unchanged).`);
      } finally {
        const pronounCost = client.getCostTracker().getTotalCost() - costBeforePronoun;
        if (pronounCost > 0 && typeof prose?.cost === "number") prose.cost += pronounCost;
      }
    }
  }

  // X4 — one recorder for all three floors, so every injected sentence is measured against the
  // rules that bind the model (REVIEW_05 §10.6). Records; never refuses.
  const recordInjection = recordAgent9Injection(ctx);
  prose = enforceCulpritEvidencePresence(prose, cml, recordInjection);
  // Phase 6 Layer 3: Backstop resolution injector — guarantees resolution markers exist in final chapter
  prose = injectResolutionIfAbsent(prose, cml, recordInjection);
  // X29 — bounded by the reveal chapter: the floor may not write a clearance into the aftermath either.
  prose = enforceSuspectEliminationPresence(prose, cml, castDesign, recordInjection, lastClearanceChapter); // P1-7: pass castDesign
  prose = applyLifecycleContinuityGuard(prose, castDesign.characters as CastEntry[], cml).prose;
  if (pronounRepairEnabled) {
    // D5-guarded: the broad pronoun sweep is the canonical fix, but the §3.3 bug was a sweep that
    // FLIPPED a correct pronoun run. Revert it if it raises the mismatch count rather than lowering it.
    prose = applyPronounGuardedMutation(
      prose,
      (p) => applyDeterministicPronounSweep(p, castDesign.characters as CastEntry[]),
      "applyDeterministicPronounSweep",
    );
  }
  // FIX-D: pass { locationProfiles } rather than bare cml so buildLocationRegistry
  // finds location data. ctx.cml (the CML case data) does not carry locationProfiles —
  // they are stored separately in ctx.locationProfiles. Using cml as the argument
  // produced an empty registry, silently bypassing all location normalisation.
  prose = normalizeLocationNames(prose, buildLocationRegistry({ locationProfiles } as any));
  prose = normalizeChapterTitles(prose);
  // Fix 8.1: Replace any role-alias phrases ("the killer", "the murderer", etc.) with the
  // culprit's canonical name in post-reveal chapters, preventing identity_role_alias_break.
  prose = substituteRoleAliasesInPostRevealChapters(prose, cml);

  // A_61 roadmap S2 (default-off, AGENT9_WALKON_REPAIR) — reliability floor: rewrite any out-of-cast
  // titled walk-on (Mrs Green, Mr Bayless…) to a role noun so an incidental extra never aborts the run
  // on `illegal_named_walk_on`. Only touches names NOT in the cast — never a locked fact / clue / culprit.
  if (isWalkonRepairEnabled() && Array.isArray(prose?.chapters) && prose.chapters.length > 0) {
    try {
      const castNamesForWalkon = ((castDesign?.characters ?? []) as any[])
        .map((c) => String(c?.name ?? "").trim()).filter(Boolean);
      const allowedParts = buildAllowedNameParts(castNamesForWalkon);
      const replacedAll: string[] = [];
      for (const ch of prose.chapters as any[]) {
        if (!Array.isArray(ch?.paragraphs)) continue;
        ch.paragraphs = ch.paragraphs.map((p: any) => {
          const r = anonymiseNamedWalkOns(String(p ?? ""), allowedParts);
          if (r.replaced.length > 0) replacedAll.push(...r.replaced);
          return r.text;
        });
      }
      if (replacedAll.length > 0) {
        ctx.warnings.push(`[Agent 9] walk-on repair: anonymised ${replacedAll.length} out-of-cast named walk-on(s) [${Array.from(new Set(replacedAll)).join(", ")}].`);
      }
    } catch (err) {
      ctx.warnings.push(`[Agent 9] walk-on repair skipped: ${err instanceof Error ? err.message : String(err)}.`);
    }
  }

  // ── A_64 §2 F2 — the scaffold SHIP-CHECK: the last write wins ─────────────────────────────────
  // Every deterministic injector above (culprit-evidence B5 at its call site, resolution, suspect-
  // elimination) runs AFTER the scaffold regen pass, so a template pasted here ships straight into
  // the rubric's facts.ts recheck — the exact Mechanism B of the 7.5-pool autopsy (v_tide_enforce:
  // B5 written 17s before scoring, in no LLM call). This is the FINAL text-mutation slot: re-run the
  // ship-time detector per chapter and de-template deterministically (value- and evidence-preserving
  // floors); anything the floor can't cover ships capped WITH a warning that reaches the artifact.
  // No text-writing pass may be added after this block — validation and scoring read this text.
  if (Array.isArray(prose?.chapters)) {
    for (let ci = 0; ci < prose.chapters.length; ci++) {
      const chText = ((prose.chapters[ci]?.paragraphs ?? []) as string[]).join(" ");
      const shipHits = detectScaffoldNotProse(chText);
      if (shipHits.length === 0) continue;
      const { chapter: floored, floored: rules } = applyScaffoldExhaustionFloor(prose.chapters[ci]);
      if (rules.length > 0) {
        prose.chapters[ci] = floored;
        ctx.warnings.push(
          `[Agent 9] scaffold SHIP-CHECK floored [${rules.join(", ")}] in ch${ci + 1} — template re-introduced after the regen pass (A_64 F2; suspect the injector ordering).`,
        );
      }
      const residual = detectScaffoldNotProse(((prose.chapters[ci]?.paragraphs ?? []) as string[]).join(" "));
      if (residual.length > 0) {
        ctx.warnings.push(
          `[Agent 9] scaffold SHIP-CHECK residual [${residual.map((h) => h.rule).join(", ")}] in ch${ci + 1} — no floor covers this family; the prose≤4 cap WILL apply (honest).`,
        );
      }
    }
    // Dual-value at cap scope — warn-only (a contrast needs prose, not a deterministic splice): a
    // firing here perfectly predicts the dualValueNoContrast cap, since scoring runs the SAME
    // function on the SAME assembled text. Telemetry for the corpus era (A_64 7.2 rewire).
    if (worldState.contradiction && detectDualValueAtShipScope(prose.chapters, worldState.contradiction)) {
      ctx.warnings.push(
        `[Agent 9] SHIP-CHECK: dual-value flat pair present at cap scope — the clues≤6 cap WILL apply (honest).`,
      );
    }
    // A_65 Phase 1 — two MEASURES (never gates, never regens):
    // (a) derived-contradiction leak: a PRE-reveal chapter assembling both canonical pair values
    //     into an explicit inference (the F3 chapter-one class); assembly AT/after the pivot is
    //     the walk's job and legal.
    // (b) evidentiary-register narration count (the frozen family) — the machine-register residual.
    {
      const chapterTextsA65 = (prose.chapters as any[]).map((ch: any) => ((ch?.paragraphs ?? []) as string[]).join(" "));
      const pivotA65 = computeArrestPivotIndex(chapterTextsA65);
      if (worldState.contradiction && pivotA65 > 0) {
        for (let ci = 0; ci < pivotA65; ci++) {
          const leaks = detectDerivedContradictionLeak(chapterTextsA65[ci], worldState.contradiction);
          if (leaks.length > 0) {
            ctx.warnings.push(
              `[Agent 9] SHIP-CHECK: derived-contradiction ASSEMBLED pre-reveal in ch${ci + 1} (the F3 class): "${leaks[0].sentence.slice(0, 120)}…"`,
            );
          }
        }
      }
      const registerTotal = chapterTextsA65.reduce((n, t) => n + detectEvidentiaryRegister(t).length, 0);
      /**
       * PASS 10 — emitted EVEN AT ZERO, and it was not before.
       *
       * This is labelled a MEASURE, and A_65's stated purpose for it is to track whether the
       * withheld-inference contract pushes the count down. Reporting only when the count is non-zero
       * makes the one outcome the measure exists to detect — reaching zero — indistinguishable from
       * the check not running at all. That is the exact rule X4 states 1,600 lines below in this same
       * file: *"emitted even at zero: a zero that is never written cannot be told apart from a check
       * that never ran"*. The rule was written down and then not applied here.
       */
      ctx.warnings.push(
        `[Agent 9] SHIP-CHECK: evidentiary-register narration ×${registerTotal} `
        + `(measure — the withheld-inference contract should push this down; ×0 means CLEAN, not unrun).`,
      );
      // A_75 §6.2 (P2) — the same family measured by GRAMMAR rather than by the frozen phrase list
      // above, which by its own law can only ever see phrasings we wrote. ALWAYS ON, never a gate:
      // rho = -0.421 against the human `prose` mark over 40 read manuscripts (n=40, |rho|>0.314 to
      // signify), falling monotonically 15.9% at prose 4 to 10.0% at prose 8. That makes it the first
      // prose signal in this pipeline that points at the mark rather than at a defect count.
      //
      // Reported as a RATE and as a per-chapter WORST, because the correlation is with the rate. The
      // per-sentence score at threshold 4 was measured and REJECTED as a lever (rho = +0.207, wrong
      // sign) — see machine-register.ts. Nothing acts on this number; it is a health signal, and the
      // run-to-run series is what makes it worth carrying.
      /**
       * A_75 §6.1 (P1) — DID THE BOOK KEEP ITS VOICE?
       *
       * The one prose number in this pipeline that points UPWARD rather than counting defects, and
       * the only reason P1 is worth running rather than arguing about: it separates "the spec never
       * reached the prose" from "the spec reached the prose and did not help", which are different
       * outcomes with different next moves.
       *
       * §6.1's falsification, stated before the build and repeated here where it will be read:
       * **conformance >= 0.8 with `prose` still at 6-7 across two external cold reads kills the
       * hypothesis**, and A_72's Tier 4 (the generation model) reopens with evidence.
       *
       * Chapters delivered is reported beside the mean on purpose — five chapters at 1.0 and five at
       * 0.2 average the same as ten at 0.6, and those are different failures.
       */
      if (committedVoiceSpec) {
        const conf = bookVoiceConformance(chapterTextsA65, committedVoiceSpec);
        const worst = conf.chapters
          .map((c, i) => ({ ch: i + 1, ...c }))
          .filter((c) => c.sentences > 0)
          .sort((a, b) => a.score - b.score)[0];
        ctx.warnings.push(
          `[Agent 9] VOICE CONFORMANCE ${conf.mean.toFixed(2)} ` +
          `(target ${committedVoiceSpec.sentenceLength.mean.toFixed(1)}±${committedVoiceSpec.sentenceLength.sd.toFixed(1)} words; ` +
          `${conf.chaptersDelivered}/${conf.chapters.filter((c) => c.sentences > 0).length} chapters at >=${VOICE_CONFORMANCE_DELIVERED})` +
          `${worst ? `, worst ch${worst.ch} at ${worst.score.toFixed(2)} (${worst.observedMean.toFixed(1)} words, drift ${worst.drift > 0 ? "+" : ""}${worst.drift.toFixed(1)})` : ""}` +
          ` — A_75 P1. >=${VOICE_CONFORMANCE_DELIVERED} means the spec REACHED the prose; whether it helped is the reader's call.`,
        );
      }
      {
        const whole = machineRegisterRate(chapterTextsA65.join(" "), REGISTER_TELEMETRY_THRESHOLD);
        const perChapter = chapterTextsA65
          .map((t, i) => ({ ch: i + 1, ...machineRegisterRate(t, REGISTER_TELEMETRY_THRESHOLD) }))
          .filter((r) => r.sentences >= 20)
          .sort((a, b) => b.rate - a.rate);
        const worst = perChapter[0];
        if (whole.sentences > 0) {
          ctx.warnings.push(
            `[Agent 9] SHIP-CHECK: machine-register rate ${(100 * whole.rate).toFixed(1)}% ` +
            `(${whole.hits}/${whole.sentences} narration sentences at score>=${REGISTER_TELEMETRY_THRESHOLD})` +
            `${worst ? `, worst ch${worst.ch} at ${(100 * worst.rate).toFixed(1)}%` : ""} ` +
            `— MEASURE only. Read: prose 8 books sit near 10%, prose 4 near 16%.`,
          );
        }
      }
    }
  }

  const buildStoryForValidation = (currentProse: any) => ({
    id: runId,
    projectId: projectId || runId,
    scenes: currentProse.chapters.map((ch: any, idx: number) => ({
      number: idx + 1,
      title: ch.title,
      text: ch.paragraphs.join("\n\n"),
    })),
  });

  const validateCurrentProse = async (currentProse: any): Promise<any> =>
    validationPipeline.validate(buildStoryForValidation(currentProse), {
      ...cml,
      lockedFacts: annotatedLockedFacts,
      locationProfiles: locationProfiles ?? undefined,
    } as any);

  let validationReport: any = await validateCurrentProse(prose);
  const preRepairValidationSummary = { ...validationReport.summary };
  let postRepairValidationSummary = { ...validationReport.summary };

  const hasDeterministicRepairableFailures =
    Array.isArray(validationReport.errors)
    && validationReport.errors.some((err: any) =>
      err?.type === "locked_fact_missing_value"
      || err?.type === "pronoun_drift"
      || err?.type === "culprit_evidence_chain_missing"
      || err?.type === "suspect_closure_missing"
      || err?.type === "victim_reappears_alive",
    );

  if (hasDeterministicRepairableFailures) {
    const repairedInner = enforceSuspectEliminationPresence(
      injectResolutionIfAbsent(
        enforceCulpritEvidencePresence(
          enforceLockedFactValuePresence(
            repairWordFormLockedFacts(prose, annotatedLockedFacts),
            annotatedLockedFacts,
          ),
          cml,
          recordInjection, // X4 — the repair path injects too, and was never measured
        ),
        cml,
        recordInjection,
      ),
      cml,
      castDesign, // P1-7: pass castDesign
      recordInjection,
      lastClearanceChapter, // X29 — the repair path injects too, and was unbounded the same way
    );
    const withLifecycleGuard = applyLifecycleContinuityGuard(
      repairedInner,
      castDesign.characters as CastEntry[],
      cml,
    );
    const withPronounRepair = pronounRepairEnabled
      ? applyDeterministicPronounSweep(withLifecycleGuard.prose, castDesign.characters as CastEntry[])
      : withLifecycleGuard.prose;
    prose = substituteRoleAliasesInPostRevealChapters(withPronounRepair, cml);

    validationReport = await validateCurrentProse(prose);
    postRepairValidationSummary = { ...validationReport.summary };
    ctx.warnings.push("Validation deterministic rescue applied for locked-fact/pronoun/lifecycle consistency before release gate.");
  }

  const pronounTargets = extractPronounTargetNames(validationReport.errors ?? [], castDesign.characters as CastEntry[]);
  if (pronounRepairEnabled && pronounTargets.size > 0) {
    const targetedPronounRepair = applyTargetedPronounSweep(
      prose,
      castDesign.characters as CastEntry[],
      pronounTargets,
    );
    if (targetedPronounRepair.repairCount > 0) {
      prose = targetedPronounRepair.prose;
      validationReport = await validateCurrentProse(prose);
      postRepairValidationSummary = { ...validationReport.summary };
      ctx.warnings.push(
        `Targeted pronoun rescue applied for ${pronounTargets.size} character(s); deterministic repairs: ${targetedPronounRepair.repairCount}.`,
      );
    }
  }

  const victimReappearanceIssues = extractVictimReappearanceIssues(validationReport.errors ?? []);
  if (victimReappearanceIssues.length > 0) {
    const victimRescue = applyVictimReappearanceRescue(
      prose,
      castDesign.characters as CastEntry[],
      cml,
      victimReappearanceIssues,
    );
    if (victimRescue.repairCount > 0) {
      prose = victimRescue.prose;
      validationReport = await validateCurrentProse(prose);
      postRepairValidationSummary = { ...validationReport.summary };
      ctx.warnings.push(
        `Victim continuity rescue applied for ${victimReappearanceIssues.length} lifecycle issue(s); deterministic repairs: ${victimRescue.repairCount}.`,
      );
    }
    if (victimRescue.skippedVictimNames.length > 0) {
      ctx.warnings.push(
        `Victim continuity rescue skipped canonical victim names: ${victimRescue.skippedVictimNames.join(", ")}.`,
      );
    }
  }

  // ANALYSIS_43 Phase 2 (G): canonical-victim rescue — handles the `victim_reappears_alive`
  // cases the rescue above SKIPS (the canonical victim). Behind victim_alive_repair_enabled.
  const victimAliveRepairEnabled =
    (getGenerationParams().agent9_prose as any)?.rollout_flags?.victim_alive_repair_enabled !== false;
  if (victimAliveRepairEnabled) {
    // Reframe both reappearance AND confession defects on canonical victims (a dead victim with
    // confession language is repaired identically — the validator now clears a recollection-framed
    // confession). Merge by name, keeping the earliest deadByChapter.
    const canonicalVictimIssues = [
      ...extractVictimReappearanceIssues(validationReport.errors ?? []),
      ...extractDeceasedConfessionIssues(validationReport.errors ?? []),
    ];
    if (canonicalVictimIssues.length > 0) {
      const canonicalRescue = applyCanonicalVictimRescue(
        prose,
        castDesign.characters as CastEntry[],
        cml,
        canonicalVictimIssues,
      );
      if (canonicalRescue.repairCount > 0) {
        prose = canonicalRescue.prose;
        validationReport = await validateCurrentProse(prose);
        postRepairValidationSummary = { ...validationReport.summary };
        ctx.warnings.push(
          `Canonical-victim rescue reframed ${canonicalRescue.repairCount} active-victim sentence(s) as recollection for: ${canonicalRescue.reframedVictimNames.join(", ")}.`,
        );
      }
    }
  }

  // ANALYSIS_43 Phase 1b (H): final pronoun re-validate + targeted re-repair AFTER the
  // victim-rescue and role-alias mutations above — those mutate prose and can leave a
  // residual mismatch the earlier sweep (which ran before them) never re-checked. Behind
  // pronoun_gate_parity_enabled.
  //
  // A_66 P1 — THE PARITY PASS NOW OBEYS pronoun_policy. The ANALYSIS_44 note that stood here
  // declared this pass "INTENTIONALLY independent of the broad pronoun_policy" so that a
  // validator-confirmed mismatch could not ride to a TERMINAL ABORT (run 6aea3501). That
  // rationale has EXPIRED: residual pronoun issues are warn-only today (the integrity gate
  // below), so nothing aborts — and the independence became pure corruption surface: probe #1's
  // entry-point forensics proved ALL 27 shipped drift instances were manufactured by this exact
  // path on pronoun-CLEAN drafts ("He knelt beside Eleanor Voss" → "She knelt…"), seeded by
  // false-positive proximity detections, unguarded, and scored as an improvement by the loose
  // metric. Under `verify` ("deterministic fixer stays off — it corrupted prose historically",
  // the owner's own comment) NO deterministic pronoun mutation runs; true drift routes to the
  // validator-gated LLM regen channel (A_66 P3). Under strict/relaxed the pass still runs — now
  // wrapped in the HIGH-PRECISION guard (A_66 P2) so it can never again bless its own vandalism.
  const pronounGateParityEnabled =
    (getGenerationParams().agent9_prose as any)?.rollout_flags?.pronoun_gate_parity_enabled !== false &&
    getPronounPolicySettings().checkingEnabled;
  if (pronounGateParityEnabled) {
    const lateTargets = extractPronounTargetNames(validationReport.errors ?? [], castDesign.characters as CastEntry[]);
    if (lateTargets.size > 0) {
      const highPrecisionValidator = buildHighPrecisionPronounValidator(castDesign.characters as CastEntry[]);
      const before = highPrecisionValidator(prose);
      const lateRepair = applyTargetedPronounSweep(prose, castDesign.characters as CastEntry[], lateTargets);
      const after = highPrecisionValidator(lateRepair.prose);
      if (after.score < before.score) {
        ctx.warnings.push(
          `[Agent 9] late pronoun re-repair REVERTED (A_66 P2): high-precision mismatches would rise (${before.score} → ${after.score}).`,
        );
      } else if (lateRepair.prose !== prose) {
        // A_66 P5 honesty: report on TEXT CHANGE, not repairCount — the sweep historically
        // mutated with repairCount=0 (normalization/segment churn), shipping silent flips.
        prose = lateRepair.prose;
        validationReport = await validateCurrentProse(prose);
        postRepairValidationSummary = { ...validationReport.summary };
        ctx.warnings.push(
          `Late pronoun re-repair (post victim/alias mutation) applied for ${lateTargets.size} character(s); repairs: ${lateRepair.repairCount}.`,
        );
      }
    }
  }

  const residualPronounIssues = Array.isArray(validationReport.errors)
    ? validationReport.errors.filter((err: any) =>
        err?.type === "pronoun_drift" || err?.type === "pronoun_gender_mismatch",
      ).length
    : 0;
  entityPronounDriftCount = residualPronounIssues;
  if (residualPronounIssues > 0) {
    ctx.warnings.push(
      `Pronoun integrity gate: ${residualPronounIssues} pronoun issue(s) remain after deterministic rescue.`,
    );
  }

  ctx.agentDurations["validation"] = Date.now() - validationStart;

  // [G6] Read-back comprehension gate — deterministic checks using StoryContract as answer key.
  // Verifies that a hypothetical reader of the finished prose could answer the four
  // core mystery questions.  Failures are logged as warnings (non-fatal); they surface
  // structural omissions that prose-generation validation may have missed.
  {
    const g6Issues: string[] = [];
    const culpritAliasGateEnabled =
      (getGenerationParams().agent9_prose as any)?.rollout_flags?.culprit_alias_gate_enabled !== false;
    const fullTextRaw = prose.chapters.map((ch: any) => (ch.paragraphs ?? []).join(' ')).join(' ');
    const finalChapterTextRaw = (prose.chapters[prose.chapters.length - 1]?.paragraphs ?? []).join(' ');
    const normalizeAliasText = (value: string): string =>
      value
        .toLowerCase()
        .replace(/\b(mr|mrs|ms|dr)\./g, '$1')
        .replace(/[^a-z0-9\s'-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const fullText = normalizeAliasText(fullTextRaw);
    const finalChapterText = normalizeAliasText(finalChapterTextRaw);

    const titleExpansions: Record<string, string[]> = {
      dr: ['dr', 'doctor'],
      mr: ['mr', 'mister'],
      mrs: ['mrs'],
      miss: ['miss'],
      ms: ['ms'],
      inspector: ['inspector'],
      detective: ['detective'],
      captain: ['captain'],
      colonel: ['colonel'],
      sir: ['sir'],
      lady: ['lady'],
    };
    const buildCulpritAliases = (name: string): string[] => {
      const tokens = name.trim().split(/\s+/).filter(Boolean);
      if (tokens.length === 0) return [];
      const surname = tokens[tokens.length - 1] ?? '';
      const title = tokens[0]?.toLowerCase().replace(/\.$/, '') ?? '';
      const hasTitle = Object.prototype.hasOwnProperty.call(titleExpansions, title);
      const firstNonTitle = hasTitle ? tokens[1] : tokens[0];
      const aliases = new Set<string>();
      aliases.add(name);
      if (surname) aliases.add(surname);
      if (firstNonTitle && surname && firstNonTitle.toLowerCase() !== surname.toLowerCase()) {
        aliases.add(`${firstNonTitle} ${surname}`);
      }
      if (hasTitle && surname) {
        for (const expanded of titleExpansions[title]) aliases.add(`${expanded} ${surname}`);
      }
      return Array.from(aliases);
    };
    const textContainsAnyAlias = (text: string, aliases: string[]): boolean =>
      aliases.some((alias) => {
        const normalizedAlias = normalizeAliasText(alias);
        if (!normalizedAlias) return false;
        return new RegExp(`\\b${escapeRegex(normalizedAlias)}\\b`, 'i').test(text);
      });

    // Q1: Does the story contain any culprit name?
    for (const culprit of storyContract.culpritNames) {
      const aliases = culpritAliasGateEnabled ? buildCulpritAliases(culprit) : [culprit];
      const hasAliasMatch = culprit ? textContainsAnyAlias(fullText, aliases) : false;
      const hasCanonicalMatch = culprit ? textContainsAnyAlias(fullText, [culprit]) : false;
      if (hasAliasMatch && !hasCanonicalMatch) {
        culpritGateAliasMatchesCount += 1;
      }
      if (culprit && !hasAliasMatch) {
        if (hasCanonicalMatch) {
          culpritGateFalsePositiveCount += 1;
        }
        g6Issues.push(`[G6-Q1] Culprit name "${culprit}" never appears in the prose — the reader cannot identify the murderer.`);
      }
    }

    // Q2: Does the final chapter name the culprit?
    for (const culprit of storyContract.culpritNames) {
      const surname = culprit.trim().split(/\s+/).pop() ?? culprit;
      const aliases = culpritAliasGateEnabled ? buildCulpritAliases(culprit) : [surname];
      const hasAliasMatch = surname ? textContainsAnyAlias(finalChapterText, aliases) : false;
      const hasCanonicalSurname = surname ? textContainsAnyAlias(finalChapterText, [surname]) : false;
      if (hasAliasMatch && !hasCanonicalSurname) {
        culpritGateAliasMatchesCount += 1;
      }
      if (surname && !hasAliasMatch) {
        if (hasCanonicalSurname) {
          culpritGateFalsePositiveCount += 1;
        }
        g6Issues.push(`[G6-Q2] Culprit surname "${surname}" absent from final chapter — the resolution scene must name the murderer.`);
      }
    }

    // Q3: Does the story mention the murder method tokens?
    const methodDesc: string = (cml as any)?.CASE?.hidden_model?.mechanism?.description ?? '';
    if (methodDesc) {
      const methodTokens = methodDesc.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t: string) => t.length > 3);
      const methodPresent = methodTokens.some((t: string) => fullText.includes(t));
      if (!methodPresent) {
        g6Issues.push(`[G6-Q3] Murder method ("${methodDesc}") has no token present in the prose — the murder mechanism must be discoverable.`);
      }
    }

    // Q4: Does the story mention at least one observable inference step's observation tokens?
    const observableSteps = storyContract.inferenceChain.filter(s => s.reader_observable && s.observation.length > 20);
    if (observableSteps.length > 0) {
      let anyObservableStepCovered = false;
      for (const step of observableSteps) {
        const tokens = step.observation.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((t: string) => t.length > 4);
        if (tokens.length > 0 && tokens.some((t: string) => fullText.includes(t))) {
          anyObservableStepCovered = true;
          break;
        }
      }
      if (!anyObservableStepCovered) {
        g6Issues.push(`[G6-Q4] None of the ${observableSteps.length} reader-observable inference steps have observation tokens in the prose — the reasoning chain is not grounded.`);
      }
    }

    if (g6Issues.length > 0) {
      for (const issue of g6Issues) {
        ctx.warnings.push(issue);
        console.warn(`[Agent 9] ${issue}`);
      }
    } else {
      ctx.warnings.push('[G6] Read-back comprehension gate: all 4 checks passed.');
    }
  }

  // ANALYSIS_43 Phase 3 (I): repairable-abort softening. When a run would otherwise hard-abort
  // ("failed") but EVERY residual critical/major issue is in the deterministically-repairable
  // allowlist, run one more bounded repair cycle; if a repairable residual still remains,
  // downgrade to needs_review (output saved) instead of throwing. Genuinely non-repairable
  // criticals (CML integrity, encoding corruption, structural completeness) still abort.
  const REPAIRABLE_ISSUE_TYPES = new Set<string>([
    "victim_reappears_alive",
    "deceased_character_confesses",
    // A_50 §9: a same-chapter "clearance" of the actual culprit in the reveal is a false-alibi
    // demolition, not an exoneration — the detector guard now suppresses most, but admit it here so a
    // residual softens failed→needs_review instead of throwing (it co-occurred with the confession
    // critical and its absence from this allowlist blocked softening entirely). Upstream agent3/agent6
    // fair-play cause tracked separately.
    "cleared_culprit_conflict",
    "pronoun_drift",
    "pronoun_gender_mismatch",
    "locked_fact_missing_value",
    "suspect_closure_missing",
    "culprit_evidence_chain_missing",
  ]);
  const repairableAbortSofteningEnabled =
    (getGenerationParams().agent9_prose as any)?.rollout_flags?.repairable_abort_softening_enabled !== false;
  const blockingIssuesAreRepairable = (report: any): boolean => {
    const blocking = Array.isArray(report?.errors)
      ? report.errors.filter((e: any) => e?.severity === "critical" || e?.severity === "major")
      : [];
    return blocking.length > 0 && blocking.every((e: any) => REPAIRABLE_ISSUE_TYPES.has(String(e?.type ?? "")));
  };
  let softenedFromFailed = false;
  if (
    repairableAbortSofteningEnabled &&
    validationReport.status !== "passed" &&
    validationReport.status !== "needs_review" &&
    blockingIssuesAreRepairable(validationReport)
  ) {
    // One more bounded deterministic repair cycle over the repairable residuals.
    let cycleProse = applyLifecycleContinuityGuard(prose, castDesign.characters as CastEntry[], cml).prose;
    const cycleVictimIssues = [
      ...extractVictimReappearanceIssues(validationReport.errors ?? []),
      ...extractDeceasedConfessionIssues(validationReport.errors ?? []),
    ];
    if (cycleVictimIssues.length > 0) {
      if (victimAliveRepairEnabled) {
        cycleProse = applyCanonicalVictimRescue(cycleProse, castDesign.characters as CastEntry[], cml, cycleVictimIssues).prose;
      }
      cycleProse = applyVictimReappearanceRescue(cycleProse, castDesign.characters as CastEntry[], cml, cycleVictimIssues).prose;
    }
    // ANALYSIS_44 follow-up: targeted pronoun repair in the softening cycle runs whenever broad
    // pronoun repair OR the parity gate is enabled (parity is independent of pronoun_policy).
    if (pronounRepairEnabled || pronounGateParityEnabled) {
      const cycleTargets = extractPronounTargetNames(validationReport.errors ?? [], castDesign.characters as CastEntry[]);
      if (cycleTargets.size > 0) {
        cycleProse = applyTargetedPronounSweep(cycleProse, castDesign.characters as CastEntry[], cycleTargets).prose;
      }
      cycleProse = applyDeterministicPronounSweep(cycleProse, castDesign.characters as CastEntry[]);
    }
    prose = cycleProse;
    validationReport = await validateCurrentProse(prose);
    postRepairValidationSummary = { ...validationReport.summary };

    if (
      validationReport.status !== "passed" &&
      validationReport.status !== "needs_review" &&
      blockingIssuesAreRepairable(validationReport)
    ) {
      softenedFromFailed = true;
    }
  }

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
  } else if (softenedFromFailed) {
    const residualTypes = (validationReport.errors ?? [])
      .filter((e: any) => e?.severity === "critical" || e?.severity === "major")
      .map((e: any) => `${e.severity}:${e.type}`);
    ctx.warnings.push(
      `Story validation softened: failed → needs_review after a final repair cycle. ` +
      `${residualTypes.length} repairable residual(s): ${residualTypes.join(", ")}. Output saved.`,
    );
    if (ctx.scoreAggregator) {
      ctx.scoreAggregator.upsertDiagnostic(
        "story_validation_softened",
        "ValidationPipeline",
        "Story Validation",
        "validation_softened",
        {
          status: validationReport.status,
          summary: validationReport.summary,
          residualTypes,
          errors: (validationReport.errors ?? []).map((e: any) => ({
            type: e.type, severity: e.severity, message: e.message, sceneNumber: e.sceneNumber,
          })),
        },
      );
    }
    reportProgress(
      "validation",
      `Full-story validation softened to needs_review (${residualTypes.length} repairable residual(s)); output saved.`,
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
    ctx.errors.push(validationFailureMsg);

    // Triage de-masking (A_60 V.1 / P.7): month/season contradictions are a single, false-positive-prone
    // class (mechanical "spring" in a trap-based mystery reads as the season). When they dominate the
    // major count, the run looks broadly broken but is one concentrated issue. Surface the breakdown so
    // the log isn't misread — and so a genuine season conflict is still visible.
    const majorEnErrors = (validationReport.errors ?? []).filter(
      (e: any) => e?.severity === "major" || e?.severity === "critical",
    );
    const seasonMajors = majorEnErrors.filter((e: any) =>
      /month\/season contradiction/i.test(String(e?.message ?? "")),
    );
    if (seasonMajors.length > 0) {
      const seasonTriageMsg =
        `Validation triage: ${seasonMajors.length}/${majorEnErrors.length} major issue(s) are month/season contradictions — ` +
        `one class (A_60 V.1). Verify these are not mechanical-"spring" false positives before treating the run as broadly failing.`;
      console.warn(`[Agent 9] ${seasonTriageMsg}`);
      ctx.warnings.push(seasonTriageMsg);
    }

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

    ctx.errors.push("Validation issues:");
    validationReport.errors.slice(0, 10).forEach((err: any) => {
      ctx.errors.push(`  [${err.severity}] ${err.type}: ${err.message}`);
    });
    if (validationReport.errors.length > 10) {
      ctx.errors.push(`  ... and ${validationReport.errors.length - 10} more validation errors (all logged to scoring.jsonl)`);
    }

    ctx.errors.push("Contributing factors:");
    if (prose.validationDetails && prose.validationDetails.batchesWithRetries > 0) {
      ctx.errors.push(
        `  Chapter generation: ${prose.validationDetails.batchesWithRetries} batches had validation issues during generation`,
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
      ctx.errors.push(
        `  CML clue coverage: Critical gaps in ${gapTypes.join(", ")}`,
      );
    }
    if (outlineCoverageIssues.length > 0) {
      ctx.errors.push(
        `  Outline: ${outlineCoverageIssues.length} coverage issues`,
      );
    }
    if (fairPlayAudit && fairPlayAudit.overallStatus !== "pass") {
      ctx.errors.push(
        `  Fair play audit: ${fairPlayAudit.overallStatus} - may indicate structural CML issues`,
      );
    }

    // Update the validation stage in the run log with the failure outcome before throwing
    ctx.runLogger.logProgress(
      "validation",
      `Validation failed: ${validationReport.summary.critical} critical, ${validationReport.summary.major} major issues`,
      ctx.warnings,
      ctx.errors,
    );

    throw new Error(
      `Story validation failed: ${validationReport.summary.critical} critical, ${validationReport.summary.major} major issues`,
    );
  }

  // ============================================================================
  // Auto-fix encoding issues
  // ============================================================================
  // Rebuild from current prose.chapters — deterministic repairs above may have changed
  // paragraphs since storyForValidation was first constructed. Using the stale snapshot
  // would overwrite repaired paragraphs with pre-repair text when encoding fixes apply.
  const storyForAutoFix = buildStoryForValidation(prose);
  const fixedStory = validationPipeline.autoFix(storyForAutoFix);
  let encodingFixesApplied = false;

  for (let i = 0; i < fixedStory.scenes.length; i++) {
    if (fixedStory.scenes[i].text !== storyForAutoFix.scenes[i].text) {
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

  prose = applyStandardPostProcessingChain(prose);

  // Release-gate parity invariant: any prose mutation after validation must be followed
  // by a fresh validation pass so release decisions reflect the final prose bytes.
  validationReport = await validateCurrentProse(prose);
  postRepairValidationSummary = { ...validationReport.summary };

  // ============================================================================
  // Agent 7.5 — the post-prose ACCEPTANCE TEST (GEOMETRY-AGENT-DESIGN §8.9)
  // ============================================================================
  // This is what makes geometry a stage rather than a utility: every other stage asserts about a
  // plan; this is the only one that wrote its acceptance test before the artefact existed and
  // enforces it after.
  //
  // WHERE IT SITS IS NOT A DETAIL. It runs on the COMMITTED chapters, after every deterministic
  // post-processing pass and after the re-validation above — never before. This codebase has already
  // paid for the other order once: deterministic sweeps running after validation, corrupting clean
  // output with nothing left to re-validate it. A geometry check placed earlier would certify a
  // constraint that a later sweep then violated.
  //
  // `shadow` (default) records every constraint's outcome and changes nothing. `apply` routes
  // chapter-scoped violations into the repair ladder — reusing the existing passes where §8.5 says
  // reuse, and the one new negative pass where nothing could be reused. Never an abort (ADR-0003):
  // a violation that survives repair ships, recorded.
  const geometryAcceptanceMode = resolveGeometryAcceptanceMode();
  let geometryReleaseWarnings: string[] = [];
  if (
    geometryAcceptanceMode !== "off" &&
    ctx.storyGeometry &&
    Array.isArray(prose.chapters) &&
    prose.chapters.length > 0
  ) {
    const geometryCostBefore = client.getCostTracker().getTotalCost();
    try {
      const geometry = ctx.storyGeometry;

      /**
       * ── A_75 §12: TRIM THE CLEARANCE REGISTER BEFORE THE GATE COUNTS IT ─────────────────────────
       *
       * `clearance_over_budget` is the MOST FREQUENT geometry code in the archive — 17 of 23 runs
       * (74%), ahead of `reveal_culprit_not_named` (61%) and `unaccounted_time` (57%) — and
       * `story-geometry/src/codes.ts` records that it has no repair: *"the only negative pass that
       * exists (aftermath_repeat) removes repetition rather than trimming a register"*.
       *
       * Both external readers of the 2026-08-27 matched pair complained about it unprompted, and both
       * tied it to the ENDING: *"it slows the ending"*, *"still unnecessary after Chapter 8"*.
       * `AGENT9_FOLD_SUSPECT_CLEARANCES` is already ON and is only a prompt steer — the model
       * re-argues anyway, and until now nothing downstream trimmed it.
       *
       * Runs BEFORE acceptance so the gate counts the trimmed text: a repair the gate cannot see is
       * a repair nobody can verify. Deletion is safe here by construction — see `trimRedundantClearances`,
       * which will only remove a clearance whose suspect was already cleared in an EARLIER chapter, so
       * a `suspect_closure_missing` run-killer cannot be introduced by it.
       */
      if (isClearanceTrimEnabled()) {
        const budget = Number((geometry as any)?.clearanceBudget?.maxSentences);
        if (Number.isFinite(budget) && budget >= 0) {
          const trim = trimRedundantClearances(
            prose.chapters as any,
            // SUSPECTS ONLY. A_76 §5: passing the whole cast made the trim attribute clearances to
            // the DETECTIVE and delete narrative sentences about her — "Eleanor let the silence
            // linger, the air thick with the knowledge that order ha..." is not a clearance, it just
            // names her near clearance language. Two of four removals across the corpus were this.
            // The victim is excluded for the reason obligation-block.ts already gives: a dead
            // character cannot meaningfully appear in an "alibi confirmed" paragraph.
            // Reads role via `roleTextsOf`, which covers the camelCase/snake_case trap (X50).
            (castDesign?.characters ?? [])
              .filter((c: any) => {
                const roles = roleTextsOf(c);
                return !roles.some(isVictimArchetype) && !roles.some(isDetectiveArchetype);
              })
              .map((c: any) => String(c?.name ?? ""))
              .filter(Boolean),
            budget,
          );
          if (trim.removed.length > 0) {
            prose.chapters = trim.chapters as any;
            prose = applyStandardPostProcessingChain(prose);
            for (const line of trim.removed) ctx.warnings.push(`[Agent 9] ${line}`);
            ctx.warnings.push(
              `[Agent 9] clearance register trimmed: ${trim.removed.length} redundant clearance sentence(s) ` +
              `removed against a budget of ${budget}. Every suspect's FIRST clearance was preserved.`,
            );
          }
        }
      }
      const runAcceptance = () =>
        checkManuscriptGeometry(geometry, (prose.chapters ?? []) as any[], {
          parseClockTime,
          parseDurationMinutes,
          dialGapMinutes,
          injectionTemplates: INJECTED_SENTENCE_PATTERNS,
        });

      let report = runAcceptance();
      const before = report.violations.map((v) => `${v.code}@${v.chapter ?? "-"}`);
      const repaired: string[] = [];

      if (geometryAcceptanceMode === "apply") {
        // A validator that re-runs the REAL check on the candidate chapter, substituted into the real
        // manuscript. No second implementation of "is it fixed?" — a regen validated against a
        // paraphrase of the detector can pass its own check and fail the one that ships.
        // `chapterIndex` is the ARRAY slot; `chapterNumber` is what the contract binds. They are equal
        // only while the chapter array is dense and in order, and assuming it silently substitutes one
        // chapter while checking another (the misalignment the package's `chapterIndexFor` now closes).
        const validatorForCode = (chapterIndex: number, chapterNumber: number, code: string) => (candidate: any) => {
          const probe = (prose.chapters ?? []).slice();
          probe[chapterIndex] = candidate;
          const probed = checkManuscriptGeometry(geometry, probe as any[], {
            parseClockTime,
            parseDurationMinutes,
            dialGapMinutes,
            injectionTemplates: INJECTED_SENTENCE_PATTERNS,
          });
          const still = probed.violations.some((v) => v.code === code && v.chapter === chapterNumber);
          return { ok: !still, score: still ? 0 : 100, violations: still ? [`geometry:${code}`] : [] };
        };
        /**
         * N7 — a candidate must not introduce a violation the manuscript does not have YET.
         *
         * `validatorForCode` asks "is the targeted defect gone?"; on the insertion channel the answer
         * was enough, because `preserveOriginalParagraphsValidator` made collateral impossible. A
         * rewrite can trade one violation for another, so the guard that replaces insertion-only is
         * this one: re-run the whole acceptance test and reject anything NEW, anywhere.
         *
         * The baseline is read at pass time rather than from `report`, because chapters repaired
         * earlier in this same loop have already changed the manuscript — comparing against the
         * pre-repair report would charge this candidate for an earlier pass's collateral.
         */
        const noRegressionValidatorFor = (chapterIndex: number) => {
          const key = (v: { code: string; chapter: number | null }) => `${v.code}@${v.chapter ?? "-"}`;
          const baseline = new Set(
            checkManuscriptGeometry(geometry, (prose.chapters ?? []) as any[], {
              parseClockTime,
              parseDurationMinutes,
              dialGapMinutes,
              injectionTemplates: INJECTED_SENTENCE_PATTERNS,
            }).violations.map(key),
          );
          return (candidate: any) => {
            const probe = (prose.chapters ?? []).slice();
            probe[chapterIndex] = candidate;
            const introduced = checkManuscriptGeometry(geometry, probe as any[], {
              parseClockTime,
              parseDurationMinutes,
              dialGapMinutes,
              injectionTemplates: INJECTED_SENTENCE_PATTERNS,
            })
              .violations.map(key)
              .filter((k) => !baseline.has(k));
            return {
              ok: introduced.length === 0,
              score: introduced.length === 0 ? 100 : 0,
              violations: introduced.map((k) => `geometry_introduced:${k}`),
            };
          };
        };

        const geometryBible = { ...worldState, beatSheet: [] } as any;
        const geometryRegen = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
        /**
         * N7/X36 — the REWRITE passes pin the EDIT-LIST channel rather than reading
         * `AGENT9_REGEN_EDIT_LIST`, for two reasons that pull the same way: an edit list is the only
         * channel on which untouched paragraphs cannot drift (§36 measured 0/3 → 2/3 on the aftermath
         * pass), and it is the channel a rewrite wants — it can only replace paragraphs that already
         * exist, which is precisely this repair and precisely NOT the additive ones above.
         */
        const rewriteChannelRegen = makeRegenFn({
          client,
          model: regenDeployment,
          runId: ctx.runId,
          projectId: ctx.projectId,
          editList: true,
        });

        // ── the reused passes (§8.5) ─────────────────────────────────────────
        // Each geometry violation maps onto a defect kind that already has an instruction and a
        // repair path. Only the mapping is new; no second repair body is created.
        const DEFECT_KIND_BY_CODE = GEOMETRY_DEFECT_KIND_BY_CODE;
        const additive = report.violations.filter(
          (v) => v.scope === "chapter" && v.chapter !== null && DEFECT_KIND_BY_CODE[v.code],
        );
        const byChapter = new Map<number, typeof additive>();
        for (const violation of additive) {
          const list = byChapter.get(violation.chapter as number) ?? [];
          list.push(violation);
          byChapter.set(violation.chapter as number, list);
        }
        // N7 — which channel a violation goes down. Flag off ⇒ everything stays on insertion-only,
        // byte-identical to the 08-07 run (including its three failures on the reveal).
        const needsModifyChannel = (code: string): boolean =>
          isRevealModifyRegenEnabled() && GEOMETRY_CODES_NEEDING_MODIFY.has(code);
        for (const [chapterNumber, violations] of byChapter) {
          const index = chapterIndexFor((prose.chapters ?? []) as any[], chapterNumber);
          const chapter = index >= 0 ? (prose.chapters ?? [])[index] : undefined;
          if (!chapter) continue;
          const defectFor = (v: (typeof violations)[number]) => ({
            chapter: chapterNumber,
            kind: DEFECT_KIND_BY_CODE[v.code]!,
            detail: v.message,
            obligationRef: `geometry_${v.code}`,
            severity: "hard" as const,
          });
          const presenceValidatorFor = (defect: any) => {
            const code = String(defect.obligationRef ?? "").replace(/^geometry_/, "");
            return validatorForCode(index, chapterNumber, code);
          };
          const insertionDefects = violations.filter((v) => !needsModifyChannel(v.code)).map(defectFor);
          const modifyDefects = violations.filter((v) => needsModifyChannel(v.code)).map(defectFor);

          if (insertionDefects.length > 0) {
            const pass = await runInsertionRegenPass({
              chapter: (prose.chapters ?? [])[index],
              defects: insertionDefects,
              bible: geometryBible,
              regen: geometryRegen,
              presenceValidatorFor,
              onUnresolved: (_d: any, reason: string) =>
                ctx.warnings.push(`[Agent 9] geometry regen UNRESOLVED in ch${chapterNumber}: ${reason}.`),
            });
            if (pass.ran && pass.repaired.length > 0) {
              prose.chapters[index] = pass.chapter;
              repaired.push(...pass.repaired);
            }
          }

          // N7 — the reveal family, on the channel that may modify. Runs AFTER the additive repairs
          // above so it sees (and its no-regression baseline includes) whatever they planted.
          if (modifyDefects.length > 0) {
            const pass = await runRevealRepairRegenPass({
              chapter: (prose.chapters ?? [])[index],
              defects: modifyDefects,
              bible: geometryBible,
              regen: rewriteChannelRegen,
              presenceValidatorFor,
              noRegressionValidator: noRegressionValidatorFor(index),
              // X35 — the method the case actually specifies, so the reveal cannot invent one; and the
              // culprit, so the disclosure is written in the shape X34's check can read.
              deathMethod: (cml as any)?.CASE?.death_method ?? null,
              culprit: geometry.culprit ?? null,
              onUnresolved: (_d: any, reason: string) =>
                ctx.warnings.push(`[Agent 9] geometry reveal-repair UNRESOLVED in ch${chapterNumber}: ${reason}.`),
            });
            if (pass.ran && pass.repaired.length > 0) {
              prose.chapters[index] = pass.chapter;
              repaired.push(...pass.repaired);
              ctx.warnings.push(
                `[Agent 9] N7 reveal-repair rewrote ch${chapterNumber} to satisfy [${pass.repaired.join(", ")}] ` +
                  `(modify channel, edit-list).`,
              );
            }
          }
        }

        // ── the one NEW pass: the negative obligation (§8.6) ─────────────────
        if (isAftermathRepeatRegenEnabled()) {
          /**
           * X25 — EVERY aftermath chapter, not just the first.
           *
           * This was `.find`, which was correct while the contract bound exactly one aftermath
           * chapter. X23 binds every chapter after the reveal, so a story can now carry more than one
           * `aftermath_repeat` violation, and `.find` would repair the earliest and silently leave the
           * rest. Exposed by the fix rather than by a run, which is the cheap way round.
           */
          const aftermathViolations = report.violations.filter(
            (v) => v.code === "aftermath_repeat" && v.chapter !== null,
          );
          const revealChapter = geometry.chapterContract.find((c) => c.role === "reveal")?.chapter ?? 0;
          for (const aftermath of aftermathViolations) {
            const index = chapterIndexFor((prose.chapters ?? []) as any[], aftermath.chapter as number);
            const chapter = index >= 0 ? (prose.chapters ?? [])[index] : undefined;
            if (chapter) {
              const pass = await runAftermathRepeatRegenPass({
                chapter,
                chapterNumber: aftermath.chapter as number,
                paragraphIndices: aftermath.paragraphIndices ?? [],
                culprit: geometry.culprit,
                methodTerms: geometry.methodSignature?.keyTerms ?? [],
                revealChapter,
                bible: geometryBible,
                // X36 — the SAME pinned channel the reveal repair uses. This pass took the unpinned
                // `geometryRegen`, so it ran whole-chapter whenever AGENT9_REGEN_EDIT_LIST was off —
                // the arm §36 measured at 0-of-3, every failure reading `regen introduced`. It then
                // fired live for the first time on 08-15 and lost twice, with exactly that signature,
                // on a chapter the cold read named unprompted. Both rewrite passes, one channel.
                regen: rewriteChannelRegen,
                onUnresolved: (_d: any, reason: string) =>
                  ctx.warnings.push(`[Agent 9] aftermath-repeat regen UNRESOLVED in ch${aftermath.chapter}: ${reason}.`),
              });
              if (pass.ran && pass.repaired.length > 0) {
                prose.chapters[index] = pass.chapter;
                repaired.push(...pass.repaired);
              }
            }
          }
        }

        if (repaired.length > 0) {
          // Same parity invariant as above: prose changed, so hygiene and validation run again before
          // any release decision reads it.
          prose = applyStandardPostProcessingChain(prose);
          validationReport = await validateCurrentProse(prose);
          postRepairValidationSummary = { ...validationReport.summary };
          report = runAcceptance();
        }
      }

      // A violation that survived is a warning on the report, not a stop. Only in `apply` does it
      // reach the release gate — in shadow the contract is not authoritative, and a shadow signal
      // that shows up as a gate reason would misreport what the run was actually gated on.
      if (geometryAcceptanceMode === "apply") {
        geometryReleaseWarnings = report.violations.map(
          (v) => `geometry ${v.code}${v.chapter ? ` (ch${v.chapter})` : ""}`,
        );
      }

      const geometryDiagnostic = {
        mode: geometryAcceptanceMode,
        violation_count: report.violations.length,
        violations: report.violations,
        // Every check, INCLUDING the satisfied ones. A zero that is never written is
        // indistinguishable from a check that never ran (A_70/A_71).
        checks: report.checks,
        met_count: report.checks.filter((c) => c.verdict === "met").length,
        // REVIEW_05 §10.1 — the number the injector-retirement work (THINK_01 Move 5) needs. An
        // obligation the pipeline satisfied for itself is not a success and not a failure; it is a
        // floored failure, and it has never been counted before.
        met_by_injection_count: report.checks.filter((c) => c.verdict === "met_by_injection").length,
        met_by_injection: report.checks.filter((c) => c.verdict === "met_by_injection"),
        // REVIEW_05 §14.3 — travels WITH the checks it qualifies. The acceptance test only ever sees
        // the chapters the contract binds, so when N4 reports the reveal bound to a chapter that does
        // not disclose, `reveal_culprit_not_named` is a statement about that chapter and not about the
        // manuscript. Reported so a reader of the report knows which of the two below to trust.
        reveal_binding_uncertain: geometry.closure.revealBindingUncertain === true,
        // X24 — and whether the finished manuscript CONFIRMED that pre-prose worry or refuted it.
        // N4's note is a title-based guess made before any prose exists; this is the same question
        // answered from the page, and it has already shown the note wrong on two runs.
        reveal_binding: report.revealBinding,
        // The story-level question, scanned over every chapter rather than the bound one. This is what
        // the rubric's `noResolution` fact means, and reading the bound-chapter check as if it meant
        // the same thing inverted §14.4 on the run that motivated this whole document.
        manuscript_disclosure: report.manuscriptDisclosure,
        extra_times: report.extraTimes,
        violations_before_repair: before,
        repaired,
      };
      /**
       * X24 — close N4's pre-prose worry out loud.
       *
       * `checkRevealBinding` pushes a `closure.notes` warning at derive time, from a beat label
       * against a chapter title. It has fired on two runs whose binding was correct, so leaving it
       * unanswered on the report trains readers to discount it — the §21 lesson about a warning that
       * always fires. The manuscript can now settle it, so say which way it went.
       */
      if (geometry.closure.revealBindingUncertain) {
        const rb = report.revealBinding;
        ctx.warnings.push(
          rb.verdict === "confirmed"
            ? `[Agent 7.5] reveal-binding worry RESOLVED: the contract bound chapter ${rb.boundChapter} and the ` +
              `manuscript discloses there. The pre-prose note compared a beat label against a title and was wrong.`
            : rb.verdict === "refuted"
              ? `[Agent 7.5] reveal-binding worry CONFIRMED: the contract bound chapter ${rb.boundChapter} but the ` +
                `manuscript discloses in chapter ${rb.disclosureChapter}. Every reveal check read the wrong chapter.`
              : `[Agent 7.5] reveal-binding worry NOT MEASURABLE: nothing in the manuscript discloses, so the ` +
                `binding cannot be confirmed or refuted from the page.`,
        );
      }

      (prose as any).validationDetails = {
        ...((prose as any).validationDetails ?? {}),
        storyGeometry: geometryDiagnostic,
      };
      if (enableScoring && scoreAggregator && scoringLogger) {
        scoringLogger.logPhaseDiagnostic(
          "agent9_prose",
          "Prose Generation",
          "story_geometry_acceptance",
          geometryDiagnostic,
          runId,
          projectId || "",
        );
        scoreAggregator.upsertDiagnostic(
          "agent9_prose_story_geometry",
          "agent9_prose",
          "Prose Generation",
          "story_geometry_acceptance",
          geometryDiagnostic,
        );
      }
      console.info(
        `[Agent 9 geometry:${geometryAcceptanceMode}] ${report.checks.length} checks, ` +
          `${report.violations.length} violation(s)` +
          (repaired.length > 0 ? `, ${repaired.length} repaired` : "") +
          (report.violations.length > 0 ? `: ${report.violations.map((v) => v.code).join(", ")}` : ""),
      );
      for (const violation of report.violations) {
        // X1 — say which violations nothing can act on. A code with no repair path reads on the
        // report exactly like one that was handled and simply did not resolve; naming the state is
        // the whole free half of §12.1, and the reason travels with it so nobody re-derives it.
        const noRepair = GEOMETRY_CODES_WITHOUT_PROSE_REPAIR[violation.code];
        ctx.warnings.push(
          `[Agent 9] geometry ${violation.code}${violation.chapter ? ` (ch${violation.chapter})` : ""}: ${violation.message}` +
            (noRepair ? ` — NO REPAIR PATH: ${noRepair}.` : ""),
        );
      }
    } catch (err) {
      ctx.warnings.push(
        `[Agent 9] geometry acceptance test failed: ${err instanceof Error ? err.message : String(err)} (chapters unchanged).`,
      );
    } finally {
      const geometryCost = client.getCostTracker().getTotalCost() - geometryCostBefore;
      if (geometryCost > 0 && typeof (prose as any)?.cost === "number") (prose as any).cost += geometryCost;
    }
  }

  const assetDeploymentReport = buildAssetDiagnosticReport(
    assetLibrary,
    narrativeState.deployedAssets,
  );
  if (enableScoring && scoreAggregator && scoringLogger) {
    scoringLogger.logPhaseDiagnostic(
      "agent9_prose",
      "Prose Generation",
      "asset_deployment",
      { report: assetDeploymentReport },
      runId,
      projectId || "",
    );
    scoreAggregator.upsertDiagnostic(
      "agent9_prose_asset_deployment",
      "agent9_prose",
      "Prose Generation",
      "asset_deployment",
      { report: assetDeploymentReport },
    );
  }

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
  const validationErrorTypes = new Set<string>(
    validationReport.errors.map((error: any) => String(error.type ?? "")),
  );
  const hasSuspectEliminationCoverageFailure = validationReport.errors.some(
    (error: any) => isSuspectEliminationCoverageError(error),
  );
  const readabilitySummary = evaluateProseReadability(prose);
  const sceneGrounding = evaluateSceneGroundingCoverage(prose, locationProfiles);

  // SWEEP D: prose-level blind-reader fairness check. Feeds every chapter except the reveal to
  // the model and asks it to name the culprit from the suspect list — the genre's real fairness
  // test (can the reader solve it from what's on the page?). Gated by ENABLE_PROSE_BLIND_READER
  // so it adds no cost unless enabled; warning-only and never throws.
  if (isProseBlindReaderEnabled()) {
    const blindSuspects = (Array.isArray(castDesign.characters) ? castDesign.characters : [])
      // X50 (REVIEW_11 §7): never reached `role_archetype`; same family as computeEliminationSuspects.
      .filter((c: any) => {
        const roles = roleTextsOf(c);
        return !roles.some(isDetectiveArchetype) && !roles.some(isVictimArchetype);
      })
      .map((c: any) => String(c?.name ?? "").trim())
      .filter(Boolean);
    const blindCulprit = String(((cml as any)?.CASE?.culpability?.culprits ?? [])[0] ?? "").trim();
    const blindResult = await blindReadProse({
      client,
      chapters: prose.chapters,
      suspects: blindSuspects,
      culprit: blindCulprit,
    });
    if (blindResult.ran) {
      if (!blindResult.correct) {
        releaseGateReasons.push(
          `Prose blind reader could not identify the culprit before the reveal ` +
          `(guessed "${blindResult.guessedCulprit || "—"}", actual "${blindCulprit}", ` +
          `confidence ${blindResult.confidence.toFixed(2)}): the story may not be fairly solvable from the prose.`,
        );
      } else if (blindResult.confidence < 0.5) {
        ctx.warnings.push(
          `Prose blind reader identified the culprit but with low confidence ` +
          `(${blindResult.confidence.toFixed(2)}); fair-play clueing in the prose may be thin.`,
        );
      } else {
        ctx.warnings.push(
          `Prose blind reader solved the case correctly before the reveal (confidence ${blindResult.confidence.toFixed(2)}).`,
        );
      }
    } else if (blindResult.error) {
      ctx.warnings.push(`Prose blind reader skipped (${blindResult.error}).`);
    }
  }
  // Build a set of cast surnames to avoid false-positive placeholder detections on
  // minor background characters the LLM may introduce with "a gentleman [Name]" phrasing.
  const castSurnamesForLeakageCheck = new Set<string>(
    (Array.isArray(castDesign.characters) ? castDesign.characters : [])
      .map((c: any) => {
        const nameParts = String(c?.name ?? "").trim().split(/\s+/);
        return nameParts[nameParts.length - 1]; // last word = surname
      })
      .filter(Boolean),
  );
  const placeholderLeakage = evaluatePlaceholderLeakage(prose, castSurnamesForLeakageCheck);
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
  // Optional-criticality clues (e.g. Agent 5's synthesized late-texture slot) are not
  // fair-play-load-bearing, so an unanchored one must not hard-stop the release gate.
  const optionalClueIds = new Set<string>(
    (((clues as any)?.clues ?? []) as any[])
      .filter((c: any) => String(c?.criticality ?? "").toLowerCase() === "optional")
      .map((c: any) => String(c?.id ?? ""))
      .filter(Boolean),
  );
  const {
    enforceable: enforceableNsdRevealedClues,
    advisoryOnly: advisoryOnlyNsdRevealedClues,
    optionalDowngraded: optionalDowngradedNsdRevealedClues,
  } = partitionNsdRevealedCluesForReleaseGate(nsdRevealedClues, expectedClueIds, optionalClueIds);
  const enforceableNsdRevealedClueSet = new Set(enforceableNsdRevealedClues);
  let evidenceVisibleClues = new Set(clueEvidence.visibleClueIds);
  let revealedWithoutEvidence = Array.from(enforceableNsdRevealedClueSet).filter(
    (id) => !evidenceVisibleClues.has(id),
  );
  // A_62 abort class #5: an enforceable NSD clue with no anchor was previously a CERTAIN hard-stop
  // with corrective_attempts:0 — the gate enforced a matcher the repair layers never consult
  // (split-brain: ledger uses chapterMentionsRequiredClue, gate uses collectClueEvidenceFromProse).
  // Repair BEFORE stopping: plant via the existing missing_clue insertion regen, accepted by THE
  // GATE'S OWN matcher, then re-collect and only hard-stop what remains. Unflagged — reliability
  // repair, same category as dd2190f6/257f7855/6dff6933.
  let nsdAnchorRepairAttempts = 0;
  if (revealedWithoutEvidence.length > 0 && Array.isArray(prose?.chapters) && prose.chapters.length > 0) {
    nsdAnchorRepairAttempts = revealedWithoutEvidence.length;
    const costBeforeNsdRepair = client.getCostTracker().getTotalCost();
    try {
      const nsdRegen = makeRegenFn({ client, model: regenDeployment, runId: ctx.runId, projectId: ctx.projectId });
      // Class #12 (P5-DV poison, mystery-1784570276364): a round-1 plant was accepted by the
      // gate's own matcher, then applyStandardPostProcessingChain rewrote it and the re-collect
      // missed — one hygiene pass turned a repaired run into a hard-stop with no second attempt.
      // Two rounds: each plants → full hygiene → re-collect. Round 2 steers the regen away from
      // named-person phrasings (the anonymiser/walk-on rewriters are the destructive passes) and
      // logs the destruction explicitly so a recurrence names itself.
      for (let round = 1; round <= 2 && revealedWithoutEvidence.length > 0; round++) {
        const beforeRound = [...revealedWithoutEvidence];
        const repair = await repairUnanchoredNsdCluesBeforeGate({
          chapters: prose.chapters,
          unanchoredClueIds: revealedWithoutEvidence,
          nsdTransferTrace: ctx.nsdTransferTrace,
          cmlCase: (cml as any).CASE,
          clues,
          bible: { ...worldState, beatSheet: [] },
          regen: nsdRegen,
          collectEvidence: collectClueEvidenceFromProse as any,
          onNote: (m) => ctx.warnings.push(m),
          detailSuffix: round === 2
            ? " IMPORTANT: describe the physical evidence impersonally — do NOT name or title any person in the planted sentences (a prior attempt was rewritten away by the name-hygiene passes)."
            : undefined,
        });
        prose.chapters = repair.chapters;
        prose = applyStandardPostProcessingChain(prose); // hygiene over the planted paragraphs
        // Re-collect with the SAME matcher the hard-stop uses; keep only still-unanchored ids.
        const recollected = collectClueEvidenceFromProse(prose.chapters, (cml as any).CASE, clues);
        evidenceVisibleClues = new Set(recollected.visibleClueIds);
        revealedWithoutEvidence = Array.from(enforceableNsdRevealedClueSet).filter(
          (id) => !evidenceVisibleClues.has(id),
        );
        const lostToHygiene = repair.repaired.filter((id) => revealedWithoutEvidence.includes(id));
        if (lostToHygiene.length > 0) {
          ctx.warnings.push(
            `[Agent 9] NSD-anchor round ${round}: plant(s) [${lostToHygiene.join(", ")}] were accepted by the matcher but DESTROYED by the post-processing chain (class #12)${round < 2 ? " — retrying with impersonal phrasing" : " — hard-stop stands"}.`,
          );
        }
        if (revealedWithoutEvidence.length === beforeRound.length && repair.repaired.length === 0) break; // nothing planted — a 2nd identical round is wasted spend
      }
    } catch (err) {
      ctx.warnings.push(
        `[Agent 9] NSD-anchor regen pass failed: ${err instanceof Error ? err.message : String(err)} (hard-stop evaluation proceeds on the original prose).`,
      );
    } finally {
      const nsdRepairCost = client.getCostTracker().getTotalCost() - costBeforeNsdRepair;
      if (nsdRepairCost > 0 && typeof (prose as any)?.cost === "number") (prose as any).cost += nsdRepairCost;
    }
  }
  const evidenceWithoutReveal = Array.from(evidenceVisibleClues).filter(
    (id) => !enforceableNsdRevealedClueSet.has(id),
  );
  const nsdVisibilityDivergence = {
    diverged: revealedWithoutEvidence.length > 0 || evidenceWithoutReveal.length > 0,
    revealed_count: enforceableNsdRevealedClueSet.size,
    evidence_visible_count: evidenceVisibleClues.size,
    clue_state_by_id: clueEvidence.clueStateById,
    revealed_without_evidence: revealedWithoutEvidence,
    evidence_without_reveal: evidenceWithoutReveal,
    sample_evidence_anchors: Object.values(clueEvidence.evidenceByClue).flat().slice(0, 8),
  };
  const syntheticNsdAnchorCount = ctx.nsdTransferTrace.reduce(
    (total: number, step: any) =>
      total +
      (Array.isArray(step?.clue_evidence_anchors)
        ? step.clue_evidence_anchors.filter((anchor: any) => anchor?.quality === "synthetic").length
        : 0),
    0,
  );
  if (advisoryOnlyNsdRevealedClues.length > 0) {
    ctx.warnings.push(
      `NSD advisory: ${advisoryOnlyNsdRevealedClues.length} NSD-only clue id(s) are outside expected visibility set and excluded from hard-gate parity checks: ${advisoryOnlyNsdRevealedClues.join(", ")}`,
    );
  }
  const optionalDowngradedWithoutEvidence = optionalDowngradedNsdRevealedClues.filter(
    (id) => !evidenceVisibleClues.has(id),
  );
  if (optionalDowngradedWithoutEvidence.length > 0) {
    ctx.warnings.push(
      `NSD advisory: ${optionalDowngradedWithoutEvidence.length} optional-criticality NSD-revealed clue(s) lack a prose evidence anchor; downgraded from hard-stop to advisory (optional texture clues are not fair-play-load-bearing): ${optionalDowngradedWithoutEvidence.join(", ")}`,
    );
  }
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
      // A_62 P3 replay distortion: hydrated Agent-5 responses predate agent5-run's deterministic
      // enrichment (the synthesized clue_fp_*/culprit_direct/strict-slot clues), so a FRESH audit
      // over hydrated artifacts structurally zeroes and hard-stops arms whose LIVE runs shipped
      // with real audits — 45/100 on most replay arms regardless of archive era. In A/B replays
      // the fair-play gate is not the measured outcome (rubric caps are), and the distortion is
      // identical in both arms, so demote to advisory THERE ONLY. Live runs are unaffected: the
      // flag is set exclusively by the replay harness. Never set it in .env/.env.local.
      if (parseBooleanEnv(process.env.CANARY_REPLAY_FAIRPLAY_ADVISORY, false)) {
        ctx.warnings.push(
          `[Agent 9] REPLAY: fair-play hard-stop demoted to advisory (CANARY_REPLAY_FAIRPLAY_ADVISORY) — ` +
          `fresh audit over hydrated artifacts scored ${fpValidation}/100; not a verdict on the live story.`,
        );
      } else {
        hardStopReasons.push(
          `fair play audit failed (${fpValidation}/100): mystery violates fundamental fair play principles`,
        );
      }
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

  // Agent 7.5 — contract violations that survived repair. Warnings, never a hard stop: the run ships
  // with the violation recorded (ADR-0003 / GEOMETRY-AGENT-DESIGN §8.10). Populated only in `apply`
  // mode, so a shadow signal never misreports what a run was actually gated on.
  if (geometryReleaseWarnings.length > 0) {
    releaseGateReasons.push(...geometryReleaseWarnings);
  }
  if (validationErrorTypes.has("temporal_contradiction")) {
    releaseGateReasons.push("temporal continuity contradiction detected");
    // temporal_contradiction is severity: major (not critical) — downgrade from hard-stop
    // to soft gate to avoid false positives (e.g. "damp chill of autumn" written in August)
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
  // NSD divergence: split into two distinct cases.
  // revealedWithoutEvidence = NSD planned a reveal but prose has no evidence anchor → hard gate.
  // evidenceWithoutReveal   = prose delivered a clue not in the NSD plan → advisory only
  //   (upstream Agent 7 clue-coverage gate now ensures plan completeness; residual mismatch
  //    is an NSD-tracking artefact, not a fair-play failure).
  if (revealedWithoutEvidence.length > 0) {
    releaseGateReasons.push(
      `clue visibility incomplete: ${revealedWithoutEvidence.length} NSD-revealed clue(s) lack prose evidence anchor(s) (${revealedWithoutEvidence.join(", ")})`,
    );
    hardStopReasons.push(
      `clue visibility incomplete (${revealedWithoutEvidence.length} NSD-revealed clue(s) have no prose evidence anchors)`,
    );
  }
  if (evidenceWithoutReveal.length > 0) {
    ctx.warnings.push(
      `NSD advisory: ${evidenceWithoutReveal.length} clue(s) visible in prose but absent from NSD outline plan: ${evidenceWithoutReveal.join(", ")} — see clue_visibility_extracted_ids in diagnostics.`,
    );
  }

  const releaseGateAudit: ReleaseGateAudit = {
    status:
      hardStopReasons.length > 0
        ? "failed"
        : releaseGateReasons.length > 0
          ? "warning"
          : "passed",
    warningReasons: [...releaseGateReasons],
    hardStopReasons: Array.from(new Set(hardStopReasons)),
    validationErrorTypes: Array.from(validationErrorTypes),
    nsdVisibilityDivergence: {
      diverged: nsdVisibilityDivergence.diverged,
      revealedCount: nsdVisibilityDivergence.revealed_count,
      evidenceVisibleCount: nsdVisibilityDivergence.evidence_visible_count,
      revealedWithoutEvidence: [...revealedWithoutEvidence],
      evidenceWithoutReveal: [...evidenceWithoutReveal],
    },
    readability: readabilitySummary,
    sceneGrounding: {
      grounded: sceneGrounding.grounded,
      total: sceneGrounding.total,
      coverage: sceneGrounding.coverage,
    },
    placeholderLeakage,
    chapterHeadingArtifacts,
    hasIllegalControlChars: proseContainsIllegalControlChars,
    hasMojibake: proseContainsMojibake,
    fairPlayStatus: fairPlayAudit?.overallStatus ?? null,
  };

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
      synthetic_nsd_anchor_count: syntheticNsdAnchorCount,
      fallback_telemetry: (prose.validationDetails as any)?.fallbackTelemetry ?? [],
      has_illegal_control_chars: proseContainsIllegalControlChars,
      has_mojibake: proseContainsMojibake,
      fair_play_status: fairPlayAudit?.overallStatus ?? null,
      phrase_telemetry: (prose.validationDetails as any)?.phraseTelemetry ?? null,
      integrity_telemetry: (prose.validationDetails as any)?.integrityTelemetry ?? null,
      season_lock_replacements_total:
        (prose.validationDetails as any)?.integrityTelemetry?.seasonLockReplacements ?? 0,
      season_lock_protected_collisions_blocked:
        (prose.validationDetails as any)?.integrityTelemetry?.seasonLockProtectedCollisionsBlocked ?? 0,
      mechanical_term_collision_count:
        (prose.validationDetails as any)?.integrityTelemetry?.mechanicalSeasonCollisionCount ?? 0,
      boundary_integrity_failures_count:
        (prose.validationDetails as any)?.linter?.boundaryIntegrityFailures ?? 0,
      semantic_rewrite_diff_blocks_count:
        (prose.validationDetails as any)?.integrityTelemetry?.semanticRewriteDiffBlocks ?? 0,
      entity_pronoun_drift_count: entityPronounDriftCount,
      culprit_gate_alias_matches_count: culpritGateAliasMatchesCount,
      culprit_gate_false_positive_count: culpritGateFalsePositiveCount,
      release_gate_audit: releaseGateAudit,
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
      (ctx.proseRepairPassCount ?? 0) + (ctx.proseRewritePassCount ?? 0) + nsdAnchorRepairAttempts;
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
  // A_69 Increment 3 — whole-story READ-ONLY diagnostic (default OFF)
  // ============================================================================
  // Placed at the very end on purpose. Every rewrite layer — scaffold regen, leakage regen, the
  // deterministic injectors (enforceSuspectEliminationPresence et al), NSD-anchor planting, the
  // pronoun sweeps — has now run, so `prose.chapters` is what actually ships. It also sits AFTER the
  // hard-stop throw above, so a story that will never ship never costs a diagnostic call.
  //
  // `shadow` reads the story and records findings, changing nothing. `apply` additionally routes the
  // anchored findings into a per-chapter rewrite behind the locked-value/cast-name/number/length
  // rollback guard. Best-effort throughout: any failure leaves the committed chapters untouched.
  const fullStoryDiagnosticMode = resolveFullStoryDiagnosticMode();
  if (fullStoryDiagnosticMode !== "off" && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    const costBeforeDiagnostic = client.getCostTracker().getTotalCost();
    try {
      const diagnostic = await runFullStoryDiagnostic({
        chapters: prose.chapters,
        client,
        model: proseDeployment,
        runId: ctx.runId,
        projectId: ctx.projectId,
        mode: fullStoryDiagnosticMode,
      });
      const byClass: Record<string, number> = {};
      for (const finding of diagnostic.findings) {
        byClass[finding.findingClass] = (byClass[finding.findingClass] ?? 0) + 1;
      }
      let editedChapters: number[] = [];
      let rolledBackChapters: number[] = [];
      if (fullStoryDiagnosticMode === "apply" && diagnostic.findings.length > 0) {
        const applied = await applyFullStoryDiagnosticFindings({
          chapters: prose.chapters,
          findings: diagnostic.findings,
          client,
          model: proseDeployment,
          runId: ctx.runId,
          projectId: ctx.projectId,
          lockedValues: annotatedLockedFacts.map((f: any) => String(f?.value ?? "")).filter(Boolean),
          castNames: (castDesign?.characters ?? [])
            .map((c: any) => String(c?.name ?? ""))
            .filter(Boolean),
        });
        if (applied.chapters.length === prose.chapters.length) {
          prose.chapters = applied.chapters;
          prose = applyStandardPostProcessingChain(prose); // hygiene over any rewritten chapters
        }
        editedChapters = applied.editedChapters;
        rolledBackChapters = applied.rolledBackChapters;
      }
      // The discard count IS the anchoring failure rate — the number that decides whether `apply`
      // is ever worth promoting. Surface it, never swallow it.
      (prose as any).validationDetails = {
        ...((prose as any).validationDetails ?? {}),
        fullStoryDiagnostic: {
          mode: fullStoryDiagnosticMode,
          findingCount: diagnostic.findings.length,
          discardedCount: diagnostic.discarded.length,
          malformedCount: diagnostic.malformed,
          failed: diagnostic.failed,
          byClass,
          editedChapters,
          rolledBackChapters,
          findings: diagnostic.findings,
          discarded: diagnostic.discarded,
        },
      };
      if (diagnostic.discarded.length > 0) {
        ctx.warnings.push(
          `[Agent 9] full-story diagnostic: ${diagnostic.discarded.length} of ${diagnostic.findings.length + diagnostic.discarded.length} finding(s) failed to anchor and were discarded.`,
        );
      }
    } catch (err) {
      ctx.warnings.push(
        `[Agent 9] full-story diagnostic failed: ${err instanceof Error ? err.message : String(err)} (chapters unchanged).`,
      );
    } finally {
      const diagnosticCost = client.getCostTracker().getTotalCost() - costBeforeDiagnostic;
      if (diagnosticCost > 0 && typeof (prose as any)?.cost === "number") (prose as any).cost += diagnosticCost;
    }
  }

  // ============================================================================
  // Commit results to context
  // ============================================================================
  // X4 — emitted here, after every injection site including the deterministic repair path, and
  // emitted even at zero: a zero that is never written cannot be told apart from a check that
  // never ran (REVIEW_05 §10.6).
  emitAgent9InjectorLintTelemetry(ctx);

  /**
   * ── PASS 1 FINDING: the published report described text that no longer existed ────────────────
   *
   * `validationReport` was last refreshed at the release gate. AFTER that point two LLM-driven paths
   * still rewrite chapters — the NSD anchor repair (two rounds of planted sentences, each followed by
   * a full hygiene chain) and `applyFullStoryDiagnosticFindings` — and neither re-validated. So
   * `ctx.validationReport`, which is the record of what shipped and what the run is judged on, could
   * describe a manuscript that was subsequently edited twice.
   *
   * That is `agent9-postprocess-after-validation` in its most consequential form: not a detector
   * going stale, but the RECORD going stale. A defect introduced by a late pass — a pronoun flip from
   * the anonymiser, a locked-fact value rewritten, an early reveal planted — had nothing left to
   * catch it, and the report would still read clean.
   *
   * The fix is deliberately NOT to re-run the gate. The gate has already decided and acting on a
   * different answer here would make the decision non-deterministic. Instead: re-validate, publish the
   * FRESH report so the record matches the manuscript, and WARN when the two disagree — which turns a
   * silent late regression into a named one. Deterministic, no LLM call, no cost.
   */
  try {
    const gateSummary = validationReport?.summary ?? {};
    const finalReport = await validateCurrentProse(prose);
    const finalSummary = finalReport?.summary ?? {};
    const changed = Object.keys({ ...gateSummary, ...finalSummary })
      .filter((k) => JSON.stringify((gateSummary as any)[k]) !== JSON.stringify((finalSummary as any)[k]));
    if (changed.length > 0) {
      ctx.warnings.push(
        `[Agent 9] POST-GATE REWRITE CHANGED VALIDATION: ${changed
          .map((k) => `${k} ${JSON.stringify((gateSummary as any)[k])} -> ${JSON.stringify((finalSummary as any)[k])}`)
          .join("; ")} — a pass after the release gate edited the prose. The gate's decision stands ` +
        `(it is not re-run here); the REPORT now describes the shipped manuscript.`,
      );
    }
    validationReport = finalReport;
  } catch (err) {
    // A failure here must not lose the run: keep the gate-time report and say the record is stale.
    ctx.warnings.push(
      `[Agent 9] final re-validation failed (${err instanceof Error ? err.message : String(err)}) — ` +
      `the published report is the GATE-TIME one and may predate late rewrites.`,
    );
  }

  ctx.prose = prose;
  ctx.validationReport = validationReport;
}
