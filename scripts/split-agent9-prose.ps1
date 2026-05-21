<#
  split-agent9-prose.ps1

  Splits agent9-prose.ts (7,259 lines) into 12 modular files inside
  packages/prompts-llm/src/agent9-prose/ plus an index.ts barrel.
  Then rewrites agent9-prose.ts as a transparent re-export barrel.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$srcPath = "c:\CML\packages\prompts-llm\src\agent9-prose.ts"
$outDir  = "c:\CML\packages\prompts-llm\src\agent9-prose"

Write-Host "Reading source ($srcPath)..."
$rawLines = [System.IO.File]::ReadAllLines($srcPath, [System.Text.Encoding]::UTF8)
Write-Host "  $($rawLines.Count) lines read."

# ─── helpers ─────────────────────────────────────────────────────────────────
function Get-Block([int]$from, [int]$to) {
    # $from / $to are 1-based inclusive line numbers
    if ($to -gt $rawLines.Count) { $to = $rawLines.Count }
    return $rawLines[($from - 1)..($to - 1)] -join "`n"
}

function Add-ExportKeywords([string]$block, [string[]]$identifiers) {
    foreach ($id in $identifiers) {
        # Escape the identifier for regex
        $escaped = [Regex]::Escape($id)
        # Match top-level (no leading whitespace) const/function/interface/type/class declarations
        $block = [Regex]::Replace(
            $block,
            "(?m)^(const |function |interface |type |class |async function )($escaped\b)",
            { param($m) "export " + $m.Groups[1].Value + $m.Groups[2].Value }
        )
    }
    return $block
}

function Write-File([string]$path, [string]$content) {
    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
    $lines = ($content -split "`n").Count
    Write-Host "  Created: $([System.IO.Path]::GetFileName($path)) ($lines lines)"
}

# ─── create target directory ─────────────────────────────────────────────────
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}
Write-Host "Target directory: $outDir"
Write-Host ""

# ═════════════════════════════════════════════════════════════════════════════
# FILE 1: types.ts  (source lines 46-313)
# ═════════════════════════════════════════════════════════════════════════════
$typesImport = @'
/**
 * agent9-prose/types.ts
 * Shared types, interfaces and arc-planning utilities for Agent 9 prose generation.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { NarrativeOutline } from "../agent7-narrative.js";
import type { CastDesign } from "../agent2-cast.js";
import type { ClueDistributionResult } from "../agent5-clues.js";
import { STORY_LENGTH_TARGETS, getStoryLengthTarget } from "@cml/story-validation";
import type { NarrativeState } from "../types/narrative-state.js";
import type { AssetLibrary } from "../types/asset-library.js";
import type { BatchCommitRecord, BatchGateName } from "../contracts/batch-commit-record.js";
import type { RetryPacket } from "../retry-protocol.js";

'@

$typesBody = Get-Block 46 313
$typesContent = $typesImport + $typesBody
Write-File "$outDir\types.ts" $typesContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 2: clue-validation.ts  (source lines 314-945)
# ═════════════════════════════════════════════════════════════════════════════
$clueImport = @'
/**
 * agent9-prose/clue-validation.ts
 * Clue token matching, chapter obligation validation, batch-gate tracking,
 * word-count targets, and resolution checks.
 */
import { getGenerationParams, getStoryLengthTarget } from "@cml/story-validation";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { ClueDistributionResult, Clue } from "../agent5-clues.js";
import type { BatchGateName, BatchCommitRecord } from "../contracts/batch-commit-record.js";
import type {
  ProseChapter,
  ChapterRequirementLedgerEntry,
  ChapterWordTargetResult,
  ChapterObligationResult,
  ClueObligationContext,
} from "./types.js";

'@

$clueBody = Get-Block 314 945
$clueBody = Add-ExportKeywords $clueBody @(
    'countWords',
    'getChapterWordTargets',
    'getWordTargetMultiplier',
    'getPromptPreferredWords',
    'getAgent9CostTotal',
    'ALL_BATCH_GATES',
    'initBatchGateFailureCounts',
    'inferBatchGatesFromError',
    'noteBatchGateFailures',
    'buildBatchGateOutcomes',
    'CLUE_TOKEN_STOPWORDS',
    'tokenizeForClueObligation',
    'filterNonCastProperNameTokens',
    'CLUE_DELIVERY_METHOD_LABELS',
    'isDeliveryMethodLabel',
    'tokenMatchesText',
    'getRequiredClueIdsForScene',
    'buildChapterRequirementLedger',
    'BEHAVIOURAL_MARKERS',
    'isBehaviouralClue',
    'buildClueSemanticAnchorFamilies',
    'semanticAnchorFamiliesMatched',
    'chapterMentionsRequiredClue',
    'chapterClueAppearsEarly'
)
$clueContent = $clueImport + $clueBody
Write-File "$outDir\clue-validation.ts" $clueContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 3: lint.ts  (source lines 946-1617)
# ═════════════════════════════════════════════════════════════════════════════
$lintImport = @'
/**
 * agent9-prose/lint.ts
 * Prose linter (n-gram, fingerprint, entropy, template-bleed),
 * season/month lock utilities, and opening-sentence helpers.
 */
import { getGenerationParams } from "@cml/story-validation";
import { classifyOpeningStyle } from "../types/narrative-state.js";
import {
  ARC_POSITION_REGISTER,
} from "../constants/arc-position.js";
import type { ProseChapter, ProseLinterIssue, MacroArcEntry } from "./types.js";

'@

$lintBody = Get-Block 946 1617
$lintBody = Add-ExportKeywords $lintBody @(
    'normalizeParagraphForFingerprint',
    'tokenizeWords',
    'toNgrams',
    'jaccardSimilarity',
    'extractOpeningSentence',
    'shannonEntropy',
    'lintBatchProse',
    'CanonicalSeason',
    'MONTH_TO_SEASON',
    'escapeRegExp',
    'normalizeMonthToken',
    'capitalizeWord',
    'deriveTemporalSeasonLock',
    'getSeasonAllowList',
    'conflictingSeasonPatterns',
    'SEASONAL_PRESENCE_RE',
    'enforceMonthSeasonLockOnChapter'
)
# CanonicalSeason is a type alias — make it `export type CanonicalSeason`
$lintBody = [Regex]::Replace($lintBody, '(?m)^export (type CanonicalSeason)', 'export $1')
# Fix: type alias export syntax — the above is already correct; ensure we don't double-export
$lintBody = $lintBody -replace '(?m)^type CanonicalSeason ', 'export type CanonicalSeason '
$lintContent = $lintImport + $lintBody
Write-File "$outDir\lint.ts" $lintContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 4: sanitization.ts  (source lines 2064-2183 + 4538-4546 + 4556-4563)
# ═════════════════════════════════════════════════════════════════════════════
$sanitImport = @'
/**
 * agent9-prose/sanitization.ts
 * Text sanitization helpers for prose chapters and cast references.
 */
import { anonymizeUnknownTitledNames } from "@cml/story-validation";
import type { ProseChapter } from "./types.js";

'@

$sanitBody1 = Get-Block 2064 2183
$sanitBody2 = Get-Block 4538 4546   # normalizeProseCastOrThrow
$sanitBody3 = Get-Block 4556 4563   # stripAuditField

$sanitBody = $sanitBody1 + "`n`n" + $sanitBody2 + "`n`n" + $sanitBody3
$sanitBody = Add-ExportKeywords $sanitBody @(
    'sanitizeScenesCharacters',
    'sanitizeGeneratedChapter',
    'splitParagraphForStructure',
    'enforceMinimumParagraphStructure',
    'normalizeProseCastOrThrow'
)
$sanitContent = $sanitImport + $sanitBody
Write-File "$outDir\sanitization.ts" $sanitContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 5: phrase-analysis.ts
#   source lines 2223-2335  (BeatFingerprint, extractBeatFingerprints, tagCharacter,
#                             buildIdentityMap, sanitizeClueField)
#          + 2818-2851  (detectRecurringPhrases)
#          + 3110-3149  (formatProvisionalScoringFeedbackBlock)
#          + 3456-3543  (selectSensoryVariant, compileSensoryAtoms)
# ═════════════════════════════════════════════════════════════════════════════
$phraseImport = @'
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

'@

$phraseBody1 = Get-Block 2223 2335   # BeatFingerprint ... sanitizeClueField
$phraseBody2 = Get-Block 2818 2851   # detectRecurringPhrases
$phraseBody3 = Get-Block 3110 3149   # formatProvisionalScoringFeedbackBlock
$phraseBody4 = Get-Block 3456 3543   # selectSensoryVariant, compileSensoryAtoms

$phraseBody = $phraseBody1 + "`n`n" + $phraseBody2 + "`n`n" + $phraseBody3 + "`n`n" + $phraseBody4
$phraseBody = Add-ExportKeywords $phraseBody @(
    'FUNCTION_WORD_EXCLUSIONS',
    'tagCharacter',
    'buildIdentityMap',
    'sanitizeClueField'
)
$phraseContent = $phraseImport + $phraseBody
Write-File "$outDir\phrase-analysis.ts" $phraseContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 6: obligation-block.ts  (source lines 2336-2817)
# ═════════════════════════════════════════════════════════════════════════════
$obligImport = @'
/**
 * agent9-prose/obligation-block.ts
 * buildChapterObligationBlock — the combined clue-obligation / NSD context block
 * injected into every prose prompt.
 */
import type { ClueDistributionResult, Clue } from "../agent5-clues.js";
import {
  ARC_POS_TO_SCENE_TYPE,
  HIGH_TENSION_POSITIONS,
} from "../constants/arc-position.js";
import {
  getRequiredClueIdsForScene,
  isBehaviouralClue,
  isDeliveryMethodLabel,
  tokenMatchesText,
  tokenizeForClueObligation,
} from "./clue-validation.js";
import { getSeasonAllowList, capitalizeWord } from "./lint.js";
import type { CanonicalSeason } from "./lint.js";
import { sanitizeClueField, tagCharacter, buildIdentityMap } from "./phrase-analysis.js";
import type { BeatFingerprint } from "./phrase-analysis.js";
import type {
  ProseChapter,
  ChapterRequirementLedgerEntry,
  MacroArcEntry,
} from "./types.js";

'@

$obligBody = Get-Block 2336 2817
$obligContent = $obligImport + $obligBody
Write-File "$outDir\obligation-block.ts" $obligContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 7: prompt-blocks.ts
#   source lines 3033-3109 (buildPronounAccuracyBlock)
#          + 3265-3293  (stripLocationParagraphs)
#          + 3294-3455  (buildCharacterContractsBlock, buildCharacterPersonalityBlock)
#          + 3545-3849  (buildLocationProfilesBlock .. buildFairPlayContractBlock)
# ═════════════════════════════════════════════════════════════════════════════
$blocksImport = @'
/**
 * agent9-prose/prompt-blocks.ts
 * Individual prompt-section builders: character contracts, personality,
 * location profiles, temporal context, setting, fair-play, pronoun accuracy.
 */
import { selectChapterAtoms } from "../asset-library.js";
import {
  ARC_POS_TO_SCENE_TYPE,
  HIGH_TENSION_POSITIONS,
} from "../constants/arc-position.js";
import type { CaseData } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
import { tagCharacter, selectSensoryVariant, compileSensoryAtoms } from "./phrase-analysis.js";
import type { BeatFingerprint } from "./phrase-analysis.js";
import { getSeasonAllowList, deriveTemporalSeasonLock } from "./lint.js";
import type { CanonicalSeason } from "./lint.js";
import type { AssetLibrary } from "../types/asset-library.js";
import type { ProseChapter, MacroArcEntry } from "./types.js";

'@

$blocksBody1 = Get-Block 3033 3109   # buildPronounAccuracyBlock
$blocksBody2 = Get-Block 3265 3293   # stripLocationParagraphs
$blocksBody3 = Get-Block 3294 3455   # buildCharacterContractsBlock, buildCharacterPersonalityBlock
$blocksBody4 = Get-Block 3545 3849   # buildLocationProfilesBlock .. buildFairPlayContractBlock

$blocksBody = $blocksBody1 + "`n`n" + $blocksBody2 + "`n`n" + $blocksBody3 + "`n`n" + $blocksBody4
$blocksBody = Add-ExportKeywords $blocksBody @(
    'buildPronounAccuracyBlock'
)
$blocksContent = $blocksImport + $blocksBody
Write-File "$outDir\prompt-blocks.ts" $blocksContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 8: prompt-builder.ts
#   source lines 1618-2063 (buildRevealGroundworkCues .. buildProseRequirements)
#          + 2184-2222  (buildTimelineStateBlock)
#          + 2852-3032  (buildClueDescriptionBlock, buildNSDBlock)
#          + 3150-3264  (PromptBlockPriority..applyPromptBudgeting)
#          + 3850-4537  (buildProsePrompt)
# ═════════════════════════════════════════════════════════════════════════════
$pbImport = @'
/**
 * agent9-prose/prompt-builder.ts
 * High-level prose prompt construction: world brief, context summary,
 * clue description, NSD block, token budgeting, and the top-level
 * buildProsePrompt() assembler.
 */
import { createHash } from "node:crypto";
import type { CaseData } from "@cml/cml";
import {
  getGenerationParams,
  getStoryLengthTarget,
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
  tokenizeForClueObligation,
} from "./clue-validation.js";
import {
  buildIdentityMap,
  tagCharacter,
  sanitizeClueField,
  extractBeatFingerprints,
  detectRecurringPhrases,
  formatProvisionalScoringFeedbackBlock,
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
import { buildDiscriminatingTestChecklist } from "./discriminating.js";
import { sanitizeScenesCharacters } from "./sanitization.js";
import type {
  ProseChapter,
  ChapterSummary,
  ProseGenerationInputs,
  MacroArcEntry,
} from "./types.js";

'@

$pbBody1 = Get-Block 1618 2063
$pbBody2 = Get-Block 2184 2222
$pbBody3 = Get-Block 2852 3032
$pbBody4 = Get-Block 3150 3264
$pbBody5 = Get-Block 3850 4537

$pbBody = $pbBody1 + "`n`n" + $pbBody2 + "`n`n" + $pbBody3 + "`n`n" + $pbBody4 + "`n`n" + $pbBody5
$pbBody = Add-ExportKeywords $pbBody @(
    'REVEAL_GROUNDWORK_BANNED_TERMS',
    'buildRevealGroundworkCues',
    'buildWorldBriefBlock',
    'buildContextSummary',
    'buildProseRequirements',
    'buildClueDescriptionBlock',
    'buildNSDBlock',
    'PromptBlockPriority',
    'PromptContextBlock',
    'PromptSectionInputs',
    'buildPromptContextBlocks',
    'estimateTokenCount',
    'truncateToTokenBudget',
    'applyPromptBudgeting'
)
$pbContent = $pbImport + $pbBody
Write-File "$outDir\prompt-builder.ts" $pbContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 9: context-management.ts  (source lines 4718-5008)
# ═════════════════════════════════════════════════════════════════════════════
$ctxImport = @'
/**
 * agent9-prose/context-management.ts
 * Chapter summary extraction, continuity-context building, story-to-date block,
 * opening-style rotation, and scene-grounding checklist generation.
 */
import type { ClueDistributionResult } from "../agent5-clues.js";
import {
  ARC_POSITION_REGISTER,
  ARC_POS_TO_SCENE_TYPE,
  HIGH_TENSION_POSITIONS,
} from "../constants/arc-position.js";
import { getGenerationParams } from "@cml/story-validation";
import type { NarrativeState } from "../types/narrative-state.js";
import type {
  ProseChapter,
  ChapterSummary,
  ProseGenerationInputs,
} from "./types.js";

'@

$ctxBody = Get-Block 4718 5008
$ctxBody = Add-ExportKeywords $ctxBody @(
    'extractChapterSummary',
    'buildContinuityContext',
    'buildStoryToDateBlock',
    'OPENING_STYLE_ROTATION',
    'buildSceneGroundingChecklist'
)
$ctxContent = $ctxImport + $ctxBody
Write-File "$outDir\context-management.ts" $ctxContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 10: discriminating.ts  (source lines 5009-5238)
# ═════════════════════════════════════════════════════════════════════════════
$discImport = @'
/**
 * agent9-prose/discriminating.ts
 * Discriminating-test checklist builder and checklist requirement validator.
 */
import type { CaseData } from "@cml/cml";
import type { ClueDistributionResult } from "../agent5-clues.js";
import type { ProseChapter, ChapterRequirementLedgerEntry } from "./types.js";

'@

$discBody = Get-Block 5009 5238
$discBody = Add-ExportKeywords $discBody @(
    'validateChecklistRequirements',
    'extractClueLocations'
)
$discContent = $discImport + $discBody
Write-File "$outDir\discriminating.ts" $discContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 11: repair.ts  (source lines 6089-6374)
# ═════════════════════════════════════════════════════════════════════════════
$repairImport = @'
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
import type { ProseChapter, ChapterRequirementLedgerEntry } from "./types.js";

'@

$repairBody = Get-Block 6089 6374
$repairBody = Add-ExportKeywords $repairBody @(
    'parseExpandedChapterResponse',
    'parsePhraseReplacementsResponse',
    'applyPhraseSubstitutions',
    'PhraseReplacement'
)
$repairContent = $repairImport + $repairBody
Write-File "$outDir\repair.ts" $repairContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 12: generate.ts
#   source lines 4548-4555  (chunkScenes)
#          + 4564-4717      (extractAndStripUsedAssets .. validateChapterCount)
#          + 5239-6088      (sanitizeForContentPolicy .. buildEnhancedRetryFeedback)
#          + 6375-end       (generateProse)
# ═════════════════════════════════════════════════════════════════════════════
$genImport = @'
/**
 * agent9-prose/generate.ts
 * Core prose generation loop: generateProse() orchestrator, batch scoring,
 * retry feedback, victim-alive detection, and pronoun-error extraction.
 */
import { createHash } from "node:crypto";
import { jsonrepair } from "jsonrepair";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import {
  ChapterValidator,
  CharacterConsistencyValidator,
  getGenerationParams,
  getStoryLengthTarget,
  repairChapterPronouns,
  repairPronouns,
} from "@cml/story-validation";
import type { NarrativeOutline } from "../agent7-narrative.js";
import type { CastDesign } from "../agent2-cast.js";
import type { ClueDistributionResult, Clue } from "../agent5-clues.js";
import type { NarrativeState } from "../types/narrative-state.js";
import { classifyOpeningStyle, initNarrativeState, updateNSD } from "../types/narrative-state.js";
import { buildAssetLibrary, selectChapterAtoms } from "../asset-library.js";
import type { AssetLibrary } from "../types/asset-library.js";
import {
  buildProseRequestContract,
  validateRequestContract,
} from "../contracts/prose-request-contract.js";
import type { BatchCommitRecord, BatchGateName } from "../contracts/batch-commit-record.js";
import {
  buildRetryFeedback,
  classifyFailure,
  shouldContinueRetry,
} from "../retry-protocol.js";
import type { RetryPacket } from "../retry-protocol.js";
import {
  ARC_POSITION_REGISTER,
  ARC_POS_TO_SCENE_TYPE,
  HIGH_TENSION_POSITIONS,
} from "../constants/arc-position.js";
import {
  countWords,
  getChapterWordTargets,
  getPromptPreferredWords,
  getAgent9CostTotal,
  ALL_BATCH_GATES,
  initBatchGateFailureCounts,
  inferBatchGatesFromError,
  noteBatchGateFailures,
  buildBatchGateOutcomes,
  CLUE_TOKEN_STOPWORDS,
  tokenizeForClueObligation,
  isBehaviouralClue,
  isDeliveryMethodLabel,
  tokenMatchesText,
  getRequiredClueIdsForScene,
  buildChapterRequirementLedger,
  chapterMentionsRequiredClue,
  validateChapterPreCommitObligations,
  RESOLUTION_RE,
  buildResolutionBackstopSentence,
} from "./clue-validation.js";
import {
  tokenizeWords,
  toNgrams,
  jaccardSimilarity,
  lintBatchProse,
  capitalizeWord,
  MONTH_TO_SEASON,
  deriveTemporalSeasonLock,
  getSeasonAllowList,
  enforceMonthSeasonLockOnChapter,
} from "./lint.js";
import type { CanonicalSeason } from "./lint.js";
import {
  sanitizeScenesCharacters,
  sanitizeGeneratedChapter,
  enforceMinimumParagraphStructure,
  normalizeProseCastOrThrow,
  stripAuditField,
} from "./sanitization.js";
import {
  extractBeatFingerprints,
  detectRecurringPhrases,
  buildIdentityMap,
  tagCharacter,
} from "./phrase-analysis.js";
import type { BeatFingerprint } from "./phrase-analysis.js";
import { buildChapterObligationBlock } from "./obligation-block.js";
import { buildProsePrompt, resolveVictimName } from "./prompt-builder.js";
import {
  extractChapterSummary,
  buildContinuityContext,
  buildStoryToDateBlock,
  buildSceneGroundingChecklist,
} from "./context-management.js";
import { buildDiscriminatingTestChecklist } from "./discriminating.js";
import {
  attemptUnderflowExpansion,
  runAtmosphereRepairIfNeeded,
} from "./repair.js";
import type {
  ProseChapter,
  ChapterSummary,
  ProseGenerationInputs,
  ProseGenerationResult,
  ProseLinterStats,
  ProseLinterIssue,
  ChapterRequirementLedgerEntry,
} from "./types.js";

// Re-export ProvisionalChapterScore so index.ts can re-export it
export type { ProvisionalChapterScore } from "./types.js";

'@

$genBody1 = Get-Block 4548 4555   # chunkScenes
$genBody2 = Get-Block 4564 4717   # extractAndStripUsedAssets .. validateChapterCount
$genBody3 = Get-Block 5239 6088   # sanitizeForContentPolicy .. buildEnhancedRetryFeedback
$genBody4 = Get-Block 6375 $rawLines.Count  # generateProse to end of file

$genBody = $genBody1 + "`n`n" + $genBody2 + "`n`n" + $genBody3 + "`n`n" + $genBody4
$genBody = Add-ExportKeywords $genBody @(
    'chunkScenes',
    'extractAndStripUsedAssets',
    'parseProseResponse',
    'buildProvisionalChapterScore',
    'validateChapterCount',
    'sanitizeForContentPolicy',
    'detectVictimAlive',
    'extractPronounOffendingSentences',
    'buildEnhancedRetryFeedback'
)
$genContent = $genImport + $genBody
Write-File "$outDir\generate.ts" $genContent


# ═════════════════════════════════════════════════════════════════════════════
# FILE 13: index.ts  (barrel re-export)
# ═════════════════════════════════════════════════════════════════════════════
$indexContent = @'
/**
 * agent9-prose/index.ts
 * Barrel — re-exports every public symbol from the agent9-prose module.
 * External code imports from './agent9-prose.js' (the outer barrel) or
 * from this file directly; the public API is identical.
 */
export * from "./types.js";
export * from "./clue-validation.js";
export * from "./lint.js";
export * from "./sanitization.js";
export * from "./phrase-analysis.js";
export * from "./obligation-block.js";
export * from "./prompt-blocks.js";
export * from "./prompt-builder.js";
export * from "./context-management.js";
export * from "./discriminating.js";
export * from "./repair.js";
export * from "./generate.js";
'@

Write-File "$outDir\index.ts" $indexContent


# ═════════════════════════════════════════════════════════════════════════════
# REWRITE agent9-prose.ts as a transparent barrel
# ═════════════════════════════════════════════════════════════════════════════
$barrelContent = @'
/**
 * agent9-prose.ts
 *
 * Transparent re-export barrel. All implementation is in agent9-prose/.
 * External importers of './agent9-prose.js' see an identical public API.
 */
export * from "./agent9-prose/index.js";
'@

[System.IO.File]::WriteAllText($srcPath, $barrelContent, [System.Text.Encoding]::UTF8)
Write-Host ""
Write-Host "  Rewrote: agent9-prose.ts (barrel re-export)"
Write-Host ""
Write-Host "Done! Files created in $outDir"
Write-Host "Run: npm run -w @cml/prompts-llm build"
