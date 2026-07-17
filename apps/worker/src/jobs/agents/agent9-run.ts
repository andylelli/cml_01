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
  runCritiqueRewritePass,
  runScaffoldRegenPass,
  runTemplateLeakageRegenPass,
  runDualValueContrastRegenPass,
  runResolutionRegenPass,
  runCulpritEvidenceRegenPass,
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
  type ChapterValidator,
  type NarrativeState,
  type BatchCommitRecord,
  type ReleaseGateAudit,
} from "@cml/prompts-llm";
import { noScaffoldValidator, detectTemplateLeakage } from "@cml/prose-guard";
import { validateArtifact, validateCml } from "@cml/cml";
// Agent 9 redesign Phase A (§4.2 / §9.7): the validation-gated-mutation law — a deterministic prose
// pass may not ship a mutation it didn't re-validate. Default-off flag; legacy path byte-identical.
import { mutateThenValidate, noMetadataDumpValidator } from "@cml/prose-guard";
import { ProseScorer, StoryValidationPipeline, CharacterConsistencyValidator, repairChapterPronouns, repairPronouns, normalizeTitles, buildLocationRegistry, normalizeLocationNames, getGenerationParams, getPronounPolicySettings, validateCharacterLifecycle, CONFESSION_RE as LIFECYCLE_CONFESSION_RE, RECOLLECTION_FRAME_RE as LIFECYCLE_RECOLLECTION_RE, detectMissingCaseTransitionBridge, BRIDGE_TERMS, validateDialogueIdiolect, anonymiseNamedWalkOns, buildAllowedNameParts, computeArrestPivotIndex, ROLE_ALIAS_TERMS } from "@cml/story-validation";
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

const parseBooleanEnv = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined || value === null || value.trim() === "") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  return fallback;
};

/**
 * Agent 9 redesign Phase A (§4.2): validation-gated mutation. When ON, every deterministic prose
 * mutation that has a machine-checkable validator (today: the grounding-lead injector vs the §3.2
 * location-metadata-dump leak) is wrapped in `mutateThenValidate` and reverted if it regresses the
 * property. Default ON (the safety law is active); set `AGENT9_MUTATION_REVALIDATION=0` to disable.
 * When on but no regression occurs, behaviour is identical to legacy (the lead ships unchanged); it
 * only ever REVERTS a lead that would have introduced a metadata-dump opening (a strict improvement).
 */
// Read at RUNTIME, not import time: the worker/canary call dotenv `config()` AFTER their (hoisted)
// static imports, so a module-level `const = process.env.X` would freeze to the default before
// .env.local loads and a flag set only there would silently never flip. Getters read on each call.
const isMutationRevalidationEnabled = () => parseBooleanEnv(process.env.AGENT9_MUTATION_REVALIDATION, true);

/**
 * ROADMAP_TO_80 M1: the deterministic grounding-lead PREPEND cycled 5 fixed location-preamble
 * templates onto the front of (almost) every chapter — the dominant prose offender behind the judge's
 * "repeated atmospheric/setting descriptions", the Ch1 location mismatch (keyLocations[idx % n] ≠ the
 * scene's room), and the Ch6 verbatim doubled opener. It is now OFF by default: chapters keep the
 * model's own opening (gpt-4.1 + the OPENING_STYLE_ROTATION prompt guidance). Reversible — set
 * `AGENT9_GROUNDING_LEAD=1` to restore the prepend. The leak/duplicate SANITISATION fallbacks
 * (replacing a scaffold-leak or exact-duplicate paragraph) still use the template as a last resort.
 *
 * A_52 item 3: kept OFF by default ON PURPOSE. Scene-grounding is only a release-gate *warning*, but the
 * prepend's repetition was itself a K2 prose penalty ("repeated atmospheric/setting descriptions") — so
 * forcing it to clear the warning can lower the score we are trying to raise. The primary lever is now
 * the prompt reconciliation (OPENING_STYLE_ROTATION + the grounding checklist no longer fight). The
 * opt-in path is still improved: the Ch1 location-mismatch noted above is FIXED — the lead now anchors
 * to a location the chapter actually visits (preferredLocationName), so enabling it no longer describes
 * the wrong room.
 */
const isGroundingLeadEnabled = () => parseBooleanEnv(process.env.AGENT9_GROUNDING_LEAD, false);

/**
 * First-principles LLD §6.1 / phase P2 — promote the world-state contradiction gate and the
 * discriminator verifier from warn-level telemetry to SOURCE-LEVEL BLOCKING: an incoherent or unsound
 * case is repaired upstream (Agent 3b/5/7), never papered over in prose. OFF by default — flipping it
 * on turns previously-shipping unsound cases into aborts, so it must land with an upstream repair hook
 * and clear an N≥4 gate first. When off, behaviour is unchanged (the conflicts stay warnings).
 */
const isBibleGatesBlockingEnabled = () => parseBooleanEnv(process.env.AGENT9_BIBLE_GATES_BLOCKING, false);

/**
 * First-principles LLD §6.5 / phase P5 — the critique→rewrite-at-creative-temperature pass. After
 * generation, the lowest-scoring chapters are critiqued against the rubric and rewritten at temp
 * 0.7–0.9, with deterministic re-validation + rollback (the rewrite can never drop a locked fact or
 * smuggle scaffold; clue-presence and pronoun fidelity are additionally backstopped by the downstream
 * story-validation pipeline + pronoun sweep). OFF by default; scoped to ≤4 chapters for the 2× ceiling.
 */
const isCritiqueRewriteEnabled = () => parseBooleanEnv(process.env.AGENT9_CRITIQUE_REWRITE, false);

/**
 * First-principles LLD §6.4 / phase P4 (RC1.2/RC1.3) — the deductive-scaffold / report-style-clearance
 * regen pass. After generation + deterministic hygiene, any chapter whose endgame ships its deduction or
 * a suspect clearance as a templated verdict (the rubric caps: prose ≤ 4 scaffold, prose ≤ 6 / ending ≤ 7
 * report-style) has the flagged paragraph DRAMATIZED in-scene via the scoped regen loop, gated so a
 * rewrite ships only if it clears the shape AND drops no locked fact. OFF by default; N≥4 before default-on.
 */
const isScaffoldRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_SCAFFOLD, false);

/**
 * A_62 RC-2.1 — the repair arm for `templateLeakageHits`, the most frequent cap of the M1 era (7/15
 * runs; it pins `prose ≤4` on 10/15 and fires with NO scaffold-family cap on 4/15, so the P4 scaffold
 * A/B provably cannot reach those runs). The detector, the `"leakage"` defect kind and its regen
 * instruction all shipped already — only the producer was missing (see `runTemplateLeakageRegenPass`).
 *
 * OFF by default, and deliberately so: an unmeasured default-on lever is the A_54 trap, and it would
 * silently confound the P4 scaffold read (the two caps co-fire on 3/15 runs). N≥4 matched pairs before
 * default-on. Runtime getter, never a module const — the flags-freeze-before-dotenv trap.
 */
const isTemplateLeakageRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_LEAKAGE, false);

/**
 * A_62 RC-2.2 — the repair arm for `dualValueNoContrast` (Item 9, A_57 D2): 6/21 shipped runs and
 * accelerating (3 of 5 on M1 attempt 3). The detector was promoted from rubric-score into
 * prose-guard so cap and lever key off the same function. Pair source: `worldState.contradiction`
 * — the SAME `ctx.discriminatingContradiction` the final rubric consumes (never re-derived).
 * OFF by default (N≥4 matched pairs before default-on); runtime getter, never a module const.
 */
const isDualValueRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_DUAL_VALUE, false);

/** A_61 RC1.4 — dramatize the reveal/culprit-evidence in-scene instead of pasting the deterministic
 * "It was me… I confess" resolution backstop / "beyond all reasonable doubt" culprit sentence. Both
 * default-off (N≥4 before default-on), runtime-read; the deterministic injectors stay as the floor. */
const isResolutionRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_RESOLUTION, false);
const isCulpritEvidenceRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_CULPRIT_EVIDENCE, false);

/** A_61 RC3.3 — dramatize an explicit body-discovery bridge when prose shifts a missing-person frame to
 * murder with none. Default-off (N≥4 before default-on), runtime-read. */
const isTransitionRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_TRANSITION, false);

/** A_61 roadmap S8 — the fifth regen pass: withhold the causal mechanism explanation in any chapter
 * strictly before the discriminating-test chapter (the plot_structure/pacing "mechanism explained too
 * early" cap). Default-off (powered ≥4×4 A/B before default-on), runtime-read. */
const isMechanismRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_MECHANISM, false);

/** A_61 roadmap S2 — the reliability floor for `illegal_named_walk_on`: rewrite an out-of-cast titled
 * walk-on to a role noun instead of aborting the run over an incidental extra. Default-off, runtime-read. */
const isWalkonRepairEnabled = () => parseBooleanEnv(process.env.AGENT9_WALKON_REPAIR, false);

/** Ledger Item 15 — LLM-first surfacing of missing atomic locked-fact values (insertion regen) so the
 * deterministic "The hour stood at X." injector (externally read as generated-sounding, 2/4 S0 reviews)
 * becomes a rare floor instead of the norm. Default-off, runtime-read; N≥4 before default-on. */
const isLockedFactRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_LOCKED_FACT, false);

/** A_61 RC2.2 — dereference the frozen Bible gender map as the SINGLE authoritative pronoun source
 * (validators + narrative state), instead of each site re-parsing raw cast gender. Default-off. */
const isBibleAuthoritativeEnabled = () => parseBooleanEnv(process.env.AGENT9_BIBLE_AUTHORITATIVE, false);

/** A_61 RC5.3 — the dialogue-distinctiveness (voice idiolect) gate mode: off | shadow | enforce.
 * Default off. shadow logs coverage/leakage telemetry; enforce additionally surfaces leakage as a
 * release-gate warning (repair-not-abort — never aborts the run). Runtime-read. */
const voiceEnforceMode = (): "off" | "shadow" | "enforce" => {
  const m = String(process.env.AGENT9_VOICE_ENFORCE ?? "off").trim().toLowerCase();
  return m === "enforce" ? "enforce" : m === "shadow" || m === "1" || m === "true" || m === "on" ? "shadow" : "off";
};

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

/**
 * Words that may legitimately appear doubled in English prose and must NOT be collapsed by the
 * adjacent-duplicate sweep in sanitizeProseText: "he had had enough", "the fact that that happened",
 * the cleft "what it is is…". Everything else (e.g. "the the", "soft soft") is treated as an artefact.
 */
const VALID_DOUBLED_WORDS = new Set(["had", "that", "is"]);

export const sanitizeProseText = (value: unknown) => {
  let text = typeof value === "string" ? value : value == null ? "" : String(value);
  text = text.normalize("NFC");
  for (const [pattern, replacement] of proseMojibakeReplacements) {
    text = text.replace(pattern, replacement);
  }
  return text
    .replace(/^Generated in scene batches\b.*$/gim, "")
    // Collapse accidental adjacent duplicate words ("the the" → "the", "soft soft" → "soft"),
    // preserving the first word's case and the grammatical doublings in VALID_DOUBLED_WORDS.
    // The trailing \b stops false positives where a word merely prefixes the next ("the thermometer").
    .replace(/\b(\w+)\s+\1\b/gi, (match, word: string) =>
      VALID_DOUBLED_WORDS.has(word.toLowerCase()) ? match : word,
    )
    // Fix possessive+article bleed: "my The Study" → "the Study"; "in my The Library" → "in the Library"
    .replace(/\b(my|your|his|her|our|their)\s+(The|A|An)\s+/gi, (_, _poss, art) => `${art.toLowerCase()} `)
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
const detectLockedFactClueTimeMismatch = (
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

  const factMinutes = factHour.hour * 60 + factHour.minute;
  const clueMinutes = clueHour.hour * 60 + clueHour.minute;
  const diffMinutes = Math.abs(factMinutes - clueMinutes);

  // AM/PM ambiguity must be explicit in CML; never silently infer one side.
  if (factHour.explicitMeridiem !== clueHour.explicitMeridiem && diffMinutes >= 60) {
    return {
      type: "ambiguity",
      rawClueTime: clueHour.raw || extractFirstTimeString(clueText) || `${clueHour.hour}:${String(clueHour.minute).padStart(2, "0")}`,
      factMinutes,
      clueMinutes,
    };
  }

  if (diffMinutes >= 60) {
    return {
      type: "mismatch",
      rawClueTime: clueHour.raw || extractFirstTimeString(clueText) || `${clueHour.hour}:${String(clueHour.minute).padStart(2, "0")}`,
      factMinutes,
      clueMinutes,
    };
  }
  return null;
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

const INJECTION_TEMPLATES: Record<FactValueType, (desc: string, val: string) => string> = {
  // ANALYSIS_47: the previous wordings ("The time was recorded as X." / "The elapsed time was
  // confirmed as X.") read as validation-text and — critically — match BOTH lint.ts
  // DEBUG_NOTE_PATTERNS (/the (time|…) was recorded as/) AND the rubric's detectTemplateLeakage
  // (/the time was recorded as/, /the elapsed time was confirmed/). That tripped the rubric's
  // prose ≤ 4 + overall ≤ 65 leakage caps on every run whose prose omitted a locked numeric fact.
  // These phrasings read as period prose and match neither linter (values are word-form, so the
  // digit-based DEBUG_NOTE arithmetic patterns never apply).
  time:             (_d, v) => `The hour stood at ${v}.`,
  duration_minutes: (_d, v) => `It had taken ${v} in all.`,
  weight:           (d, v)  => `${d.charAt(0).toUpperCase() + d.slice(1)} weighed ${v}.`,
  length:           (d, v)  => `The measurement confirmed: ${v}.`,
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

const LIFECYCLE_DEATH_RE = /\b(?:dead|body|corpse|deceased|lifeless|murdered|killed|slain)\b/i;
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
    const role = String(entry?.role_archetype ?? entry?.roleArchetype ?? entry?.role ?? "").toLowerCase();
    const name = String(entry?.name ?? "").trim();
    if (name && role.includes("victim")) {
      victims.add(normalizeNameLower(name));
    }
  }

  for (const entry of castCharacters) {
    const role = String((entry as any)?.role_archetype ?? (entry as any)?.roleArchetype ?? (entry as any)?.role ?? "").toLowerCase();
    const name = String((entry as any)?.name ?? "").trim();
    if (name && role.includes("victim")) {
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
      .filter((entry) => roleTextForIntegrity(entry).includes("victim"))
      .map((entry) => normalizeNameLower(entry?.name)),
  );
  const detectiveSet = new Set<string>(
    castEntries
      .filter((entry) => {
        const role = roleTextForIntegrity(entry);
        return role.includes("detective") || role.includes("investigator") || role.includes("inspector");
      })
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

    const driftMatch = message.match(/Pronoun drift for\s+"([^"]+)"/i);
    const mismatchMatch = message.match(/Character\s+"([^"]+)"\s+has\s+incorrect\s+pronouns/i);
    const rawName = (driftMatch?.[1] ?? mismatchMatch?.[1] ?? "").trim();
    if (!rawName) continue;

    const canonical = canonicalByLower.get(normalizeNameLower(rawName)) ?? rawName;
    targets.add(canonical);
  }

  return targets;
};

const applyTargetedPronounSweep = (
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
const VICTIM_RECOLLECTION_PREFIX = "In a remembered moment, ";
const VICTIM_RECOLLECTION_FRAME_RE = /^\s*(?:in a remembered moment\b|in life\b|before (?:she|he|they) (?:died|was killed|was murdered)\b|the memory of\b)/i;

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
          sentence = VICTIM_RECOLLECTION_PREFIX + sentence.replace(/^\s+/, "");
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
    const rendered = INJECTION_TEMPLATES[classifyFactValue(canonical)](String(fact?.description ?? ""), canonical).trim();
    if (!rendered) continue;
    const escaped = rendered.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existing = (fullTextForSeed.match(new RegExp(escaped, "gi")) ?? []).length;
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
      const sentence = INJECTION_TEMPLATES[valueType](description, canonical);
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
const injectSentenceIfAbsent = (
  prose: any,
  targets: string[],
  hasContent: (name: string, text: string) => boolean,
  buildSentence: (target: string) => string,
  logTag: string,
): any => {
  const chapters = (prose.chapters as any[]).slice();
  for (const target of targets) {
    const alreadyPresent = chapters.some((ch: any) => {
      const text = Array.isArray(ch.paragraphs) ? (ch.paragraphs as string[]).join('\n\n') : '';
      return hasContent(target, text);
    });
    if (alreadyPresent) continue;

    let targetIdx = chapters.length - 1;
    for (let i = chapters.length - 1; i >= 0; i--) {
      const text = Array.isArray(chapters[i].paragraphs) ? (chapters[i].paragraphs as string[]).join('\n\n') : '';
      if (nameInTextShared(target, text)) { targetIdx = i; break; }
    }

    const ch = chapters[targetIdx];
    const paragraphs: string[] = Array.isArray(ch.paragraphs) ? [...(ch.paragraphs as string[])] : [];
    if (paragraphs.length === 0) continue;
    const lastIdx = paragraphs.length - 1;
    paragraphs[lastIdx] = `${paragraphs[lastIdx].trim()} ${buildSentence(target)}`;
    chapters[targetIdx] = { ...ch, paragraphs };
    console.warn(`[Agent 9] ${logTag}: injected sentence for "${target}".`);
  }
  return { ...prose, chapters };
};

export const enforceSuspectEliminationPresence = (prose: any, cml: any, castDesign?: any): any => {
  // P1-7: Prefer castDesign.characters (Agent 2 normalised) over cml.CASE.cast (Agent 3 raw).
  const rawCast: any[] = Array.isArray(castDesign?.characters)
    ? castDesign.characters
    : Array.isArray(cml?.CASE?.cast)
      ? cml.CASE.cast
      : [];
  const castNames: string[] = rawCast.map((c: any) => String(c?.name ?? '').trim()).filter(Boolean);
  if (castNames.length === 0) {
    if (!Array.isArray(castDesign?.characters) && !Array.isArray(cml?.CASE?.cast)) {
      console.warn('[Agent 9] enforceSuspectEliminationPresence: no cast source available (castDesign and cml.CASE.cast both absent)');
    }
    return prose;
  }

  const culpritSet = new Set<string>(
    Array.isArray(cml?.CASE?.culpability?.culprits)
      ? cml.CASE.culpability.culprits.map((n: any) => String(n ?? '').trim())
      : [],
  );
  const detectiveSet = new Set<string>(
    rawCast
      .filter((c: any) => typeof c.role_archetype === 'string' && c.role_archetype.toLowerCase().includes('detective'))
      .map((c: any) => String(c.name ?? '').trim()),
  );
  const suspects = castNames.filter((name) => !culpritSet.has(name) && !detectiveSet.has(name));
  if (suspects.length === 0) return prose;

  const ELIMINATION_TERMS = /\b(cleared|ruled\s+out|eliminated|not\s+the\s+culprit|innocent|alibi\s+holds|alibi\s+confirmed|could\s+not\s+have)\b/i;
  const EVIDENCE_TERMS = /\b(evidence|because|therefore|which\s+proves|proof|alibi|timeline|constraint|observation)\b/i;

  return injectSentenceIfAbsent(
    prose,
    suspects,
    (name, text) => nameInTextShared(name, text) && ELIMINATION_TERMS.test(text) && EVIDENCE_TERMS.test(text),
    (suspect) => `${extractSurname(suspect)} was thoroughly cleared by the evidence; the alibi confirmed they could not have committed the crime.`,
    'enforceSuspectEliminationPresence',
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

export const enforceCulpritEvidencePresence = (prose: any, cml: any): any => {
  const liveCulprits = computeLiveCulprits(prose, cml);
  if (liveCulprits.length === 0) return prose;

  const CULPRIT_TERMS = /\b(culprits?|killers?|murderers?|responsible|did\s+it)\b/i;
  const EVIDENCE_TERMS = /\b(evidence|because|therefore|which\s+proves|proof|alibi|timeline|constraint|observation)\b/i;

  return injectSentenceIfAbsent(
    prose,
    liveCulprits,
    (culprit, text) => nameInTextShared(culprit, text) && CULPRIT_TERMS.test(text) && EVIDENCE_TERMS.test(text),
    (culprit) => `${culprit} was responsible, and the evidence placed the matter beyond all reasonable doubt.`,
    'enforceCulpritEvidencePresence',
  );
};

/**
 * Phase 6 Layer 3: Backstop resolution injector.
 * After all post-processing, if the final chapter lacks resolution markers (confession/arrest/culprit named),
 * inject a minimal resolution paragraph. This is a last-resort guard — Layer 1 (obligation block) and
 * Layer 2 (pre-commit validator) should already have handled this via retries.
 */
const injectResolutionIfAbsent = (prose: any, cml: any): any => {
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
  paragraphs.push(buildResolutionBackstopSentence(culpritSurname));
  const newChapters = [...chapters];
  newChapters[newChapters.length - 1] = { ...finalChapter, paragraphs };
  console.warn(`[Agent 9] injectResolutionIfAbsent: injected resolution paragraph for "${culprit}".`);
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

  let substitutions = 0;
  const updatedChapters = chapters.map((chapter: any, ci: number) => {
    if (ci <= arrestCi) return chapter; // at/before the reveal — skip
    const paragraphs = Array.isArray(chapter.paragraphs) ? (chapter.paragraphs as string[]) : [];
    const updatedParagraphs = paragraphs.map((p: string) => {
      const updated = p.replace(roleAliasReplaceRe, primaryCulprit);
      if (updated !== p) substitutions++;
      return updated;
    });
    return { ...chapter, paragraphs: updatedParagraphs };
  });

  if (substitutions > 0) {
    console.warn(
      `[Agent 9] substituteRoleAliasesInPostRevealChapters: replaced ${substitutions} role alias(es) → "${primaryCulprit}" in post-reveal chapters.`,
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
        detail: `NSD claims this clue was revealed in ch${chapterNumber} but the release-gate matcher finds no prose anchor. Plant it as a concrete in-scene observation: ${observable}`,
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
        args.onNote?.(`[Agent 9] NSD-anchor regen UNRESOLVED ch${chapterNumber} ${d.obligationRef}: ${reason} (hard-stop stands).`),
    });
    if (pass.ran) chapters[idx] = pass.chapter;
    repaired.push(...pass.repaired);
    unresolved.push(...pass.unresolved);
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

  if (!ctx.cml || !ctx.cast || !ctx.characterProfiles || !ctx.locationProfiles || !ctx.temporalContext || !ctx.hardLogicDevices || !ctx.narrative || !ctx.clues || !ctx.coverageResult || !ctx.outlineCoverageIssues) {
    throw new Error("Agent 9 precondition failed: missing required upstream artifacts before prose generation.");
  }

  const cml = ctx.cml;
  const cast = ctx.cast;
  const castDesign = (cast as any).cast;
  if (!castDesign || !Array.isArray(castDesign.characters)) {
    throw new Error("Agent 9 precondition failed: cast.cast.characters is missing or malformed.");
  }

  const characterProfiles = ctx.characterProfiles;
  const locationProfiles = ctx.locationProfiles;
  const temporalContext = ctx.temporalContext;
  const hardLogicDevices = ctx.hardLogicDevices;
  const narrative = ctx.narrative;
  const clues = ctx.clues;
  const coverageResult = ctx.coverageResult;
  const outlineCoverageIssues = ctx.outlineCoverageIssues;
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
    const isSuspectRole = (c: any): boolean => {
      const role = String(c?.role_archetype ?? c?.role ?? "").toLowerCase();
      return !role.includes("detective") && !role.includes("victim");
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
      c.role === 'victim' || String(c.roleArchetype ?? '').toLowerCase().includes('victim'),
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
      const batchSize = Math.max(1, Math.min(inputs.proseBatchSize ?? 1, 10));
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

  try {
    prose = await generateProse(client, {
    caseData: cml,
    outline: narrative,
    cast: castDesign,
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
    resumeCheckpoint: loadedCheckpoint
      ? {
          chapters: loadedCheckpoint.completedChapters,
          narrativeState,
          promptFingerprints: loadedCheckpoint.promptFingerprints,
        }
      : undefined,
    onProgress: (phase: string, message: string, percentage: number) =>
      reportProgress(phase as any, message, percentage),
    batchSize: inputs.proseBatchSize,
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

  // #2.1: Shared post-processing chain — extracted from 4 inline call sites.
  // Runs applyDeterministicProsePostProcessing → repairWordFormLockedFacts → normalizeLocationNames
  // in the correct order.  Accepts the prose-input separately so schema-repair retry can pass
  // retriedProse as the input without reassigning the outer prose variable prematurely.
  const applyStandardPostProcessingChain = (input: any): any => {
    let result = applyDeterministicProsePostProcessing(sanitizeProseResult(input), locationProfiles, castDesign.characters, pronounRepairEnabled);
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
      const scaffoldRegen = makeRegenFn({ client, model: proseDeployment, runId: ctx.runId, projectId: ctx.projectId });
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
      const leakageRegen = makeRegenFn({ client, model: proseDeployment, runId: ctx.runId, projectId: ctx.projectId });
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
      const dualValueRegen = makeRegenFn({ client, model: proseDeployment, runId: ctx.runId, projectId: ctx.projectId });
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
        const mechanismRegen = makeRegenFn({ client, model: proseDeployment, runId: ctx.runId, projectId: ctx.projectId });
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
        const regenFnT = makeRegenFn({ client, model: proseDeployment, runId: ctx.runId, projectId: ctx.projectId });
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
      ctx.warnings.push(`[Agent 9] voice-idiolect (${voiceEnforceMode()}): ${verdict.metrics.speakersWithTic}/${verdict.metrics.distinctSignatures} speakers used their tic; ${verdict.metrics.ticLeakagePairs} leakage pair(s).`);
      if (voiceEnforceMode() === "enforce" && !verdict.ok) {
        // RC5.3 enforce-with-repair — regen each leaking chapter's offending line in the speaker's own
        // idiom, gated on the SAME validateDialogueIdiolect predicate + locked-fact preservation. Runs
        // pre-validation/pre-scoring like the other regen passes; unresolved leaks warn exactly as before.
        const costBeforeVoice = client.getCostTracker().getTotalCost();
        try {
          const regenBibleV = { ...worldState, beatSheet: [] };
          const regenFnV = makeRegenFn({ client, model: proseDeployment, runId: ctx.runId, projectId: ctx.projectId });
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

  // P5 (default-off, AGENT9_CRITIQUE_REWRITE) — critique→rewrite the lowest-scoring chapters at creative
  // temperature. Runs BEFORE first-pass scoring + the story-validation pipeline, so every rewrite flows
  // through the existing gates; the library's own validator rolls back any rewrite that drops a locked
  // fact or introduces scaffold, and clue-presence/pronoun fidelity are re-checked downstream. Wrapped
  // so any failure leaves the generated chapters untouched.
  if (isCritiqueRewriteEnabled() && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    // Snapshot the client's running cost so the critique-rewrite LLM spend is folded into prose.cost
    // (otherwise the per-agent cost telemetry under-reports it).
    const costBeforeRewrite = client.getCostTracker().getTotalCost();
    try {
      const atomicValues = (worldState.facts ?? [])
        .filter((f) => f.type === "atomic")
        .map((f) => String(f.value ?? "").trim())
        .filter(Boolean);
      const pronouns: Record<string, string> = {};
      for (const c of (castDesign.characters ?? []) as any[]) {
        const g = String(c?.gender ?? "").toLowerCase();
        const name = String(c?.name ?? "").trim();
        if (name) pronouns[name] = g === "male" ? "he/him" : g === "female" ? "she/her" : "they/them";
      }
      // Ledger P4.2 — a creative-temperature rewrite may not REINTRODUCE defect classes the regen
      // passes (which run BEFORE this pass) already cleared. The validator is evaluated on the
      // original first (critiqueAndRewriteChapter's isRegression), so pre-existing defects self-
      // baseline: only NEW violations roll a rewrite back. Chapter-list snapshot note: within one
      // pass, earlier accepted rewrites aren't reflected here — a combination defect across two
      // same-pass rewrites still lands on the final release gate, which is unchanged.
      const rewriteMechanismTerms = deriveMechanismTerms(String(caseBlock?.hidden_model?.mechanism?.description ?? ""));
      const rewriteDtChapter = resolveDiscriminatingTestChapter(macroArcPlan);
      const rewriteChapterSnapshot = (prose.chapters as any[]).slice();
      const validatorFor = (index: number, original: any): ChapterValidator =>
        buildRewriteAcceptanceValidator({
          atomicValues,
          chapterSnapshot: rewriteChapterSnapshot,
          mechanismTerms: rewriteMechanismTerms,
          dtChapter: rewriteDtChapter,
          index,
          original,
        });
      const scored = (ctx.proseChapterScores ?? [])
        .map((s: any) => ({ index: (Number(s?.chapter) || 0) - 1, score: Number(s?.individual_score) || 0 }))
        .filter((s) => s.index >= 0 && s.index < prose.chapters.length);
      const rw = await runCritiqueRewritePass({
        client,
        chapters: prose.chapters,
        scored,
        maxChapters: 4,
        validatorFor,
        constraintsFor: () => ({ lockedFacts: atomicValues, pronouns, requiredClues: [] }),
        model: proseDeployment,
        runId: ctx.runId,
        projectId: ctx.projectId,
        onResult: (i, r) => {
          if (!r.rewritten && r.rollbackReason) {
            ctx.warnings.push(`[Agent 9] critique-rewrite ch${i + 1} rolled back: ${r.rollbackReason}`);
          }
        },
      });
      if (rw.rewrittenIndices.length > 0) {
        prose.chapters = rw.chapters;
        prose = applyStandardPostProcessingChain(prose); // re-run hygiene over the rewritten chapters
        ctx.warnings.push(`[Agent 9] critique-rewrite rewrote chapter(s) [${rw.rewrittenIndices.map((i) => i + 1).join(", ")}].`);
      }
    } catch (err) {
      ctx.warnings.push(`[Agent 9] critique-rewrite pass failed: ${err instanceof Error ? err.message : String(err)} (chapters unchanged).`);
    } finally {
      // Fold the critique-rewrite spend into the prose cost regardless of outcome (calls may have run
      // before a rollback), so per-agent cost telemetry stays accurate.
      const rewriteCost = client.getCostTracker().getTotalCost() - costBeforeRewrite;
      if (rewriteCost > 0 && typeof prose?.cost === "number") prose.cost += rewriteCost;
    }
  }
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

  let entityPronounDriftCount = 0;
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
    batch_commit_records: (prose.validationDetails as any)?.batchCommitRecords ?? [],
    outline_coverage_issue_count: outlineCoverageIssues.length,
    critical_clue_coverage_gap: coverageResult.hasCriticalGaps,
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
      const regenFnLf = makeRegenFn({ client, model: proseDeployment, runId: ctx.runId, projectId: ctx.projectId });
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
  // A_61 RC1.4 — inject→regen for culprit-evidence (B5) and resolution (B6). Each runs BEFORE its
  // deterministic injector so a successful regen makes the injector a logged no-op floor; on failure the
  // injector fires exactly as today. Wrapped so any regen failure leaves prose untouched.
  if ((isCulpritEvidenceRegenEnabled() || isResolutionRegenEnabled()) && Array.isArray(prose.chapters) && prose.chapters.length > 0) {
    const costBeforeRegen = client.getCostTracker().getTotalCost();
    try {
      const regenBibleRc14 = { ...worldState, beatSheet: [] };
      const regenFnRc14 = makeRegenFn({ client, model: proseDeployment, runId: ctx.runId, projectId: ctx.projectId });
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
    } catch (err) {
      ctx.warnings.push(`[Agent 9] RC1.4 regen pass failed: ${err instanceof Error ? err.message : String(err)} (injector floor applies).`);
    } finally {
      const regenCost = client.getCostTracker().getTotalCost() - costBeforeRegen;
      if (regenCost > 0 && typeof prose?.cost === "number") prose.cost += regenCost;
    }
  }
  prose = enforceCulpritEvidencePresence(prose, cml);
  // Phase 6 Layer 3: Backstop resolution injector — guarantees resolution markers exist in final chapter
  prose = injectResolutionIfAbsent(prose, cml);
  prose = enforceSuspectEliminationPresence(prose, cml, castDesign); // P1-7: pass castDesign
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
        ),
        cml,
      ),
      cml,
      castDesign, // P1-7: pass castDesign
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
  // ANALYSIS_44 follow-up: this targeted parity repair is INTENTIONALLY independent of the broad
  // `pronoun_policy` (which gates the aggressive cross-paragraph sweep). The parity pass only
  // touches characters the final validator flagged with a clear gender mismatch (e.g. a male
  // detective written she/her), so it must still fire when the broad sweep is off — otherwise a
  // validator-confirmed mismatch survives straight to a terminal abort (the observed run 6aea3501).
  const pronounGateParityEnabled =
    (getGenerationParams().agent9_prose as any)?.rollout_flags?.pronoun_gate_parity_enabled !== false;
  if (pronounGateParityEnabled) {
    const lateTargets = extractPronounTargetNames(validationReport.errors ?? [], castDesign.characters as CastEntry[]);
    if (lateTargets.size > 0) {
      const lateRepair = applyTargetedPronounSweep(prose, castDesign.characters as CastEntry[], lateTargets);
      if (lateRepair.repairCount > 0) {
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
      .filter((c: any) => {
        const role = String(c?.role ?? c?.roleArchetype ?? "").toLowerCase();
        return !role.includes("detective") && !role.includes("victim");
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
      const nsdRegen = makeRegenFn({ client, model: proseDeployment, runId: ctx.runId, projectId: ctx.projectId });
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
      });
      prose.chapters = repair.chapters;
      prose = applyStandardPostProcessingChain(prose); // hygiene over the planted paragraphs
      // Re-collect with the SAME matcher the hard-stop uses; keep only still-unanchored ids.
      const recollected = collectClueEvidenceFromProse(prose.chapters, (cml as any).CASE, clues);
      evidenceVisibleClues = new Set(recollected.visibleClueIds);
      revealedWithoutEvidence = Array.from(enforceableNsdRevealedClueSet).filter(
        (id) => !evidenceVisibleClues.has(id),
      );
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
  // Commit results to context
  // ============================================================================
  ctx.prose = prose;
  ctx.validationReport = validationReport;
}
