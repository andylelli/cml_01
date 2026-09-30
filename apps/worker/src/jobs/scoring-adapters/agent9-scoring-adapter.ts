 // SCO-07: was a copy of the scorer's
import type { ClueDistributionResult } from "@cml/prompts-llm";
import {
  detectControlPlaneLeakage,
  validateCharacterLifecycle,
} from "@cml/story-validation";
import type { ProseTrustSignal } from "@cml/story-validation";
import {
  buildDiscriminatingSemanticTokens,
  collectClueEvidenceFromProse,
  getAdapterConfig,
  getDiscriminatingEvidenceClueIds,
  getKnownClueIds,
  isDiscriminatingTestChapter,
} from "./clue-evidence.js";
// Re-exported so existing importers of this module keep their path.
export {
  collectClueEvidenceFromProse,
} from "./clue-evidence.js";

// ============================================================================
// Agent 9: Prose Generation
// ============================================================================

// Local alias matching the scorer's expected shape (agent9-prose-scorer.ts ChapterProse)
export interface ChapterProse {
  chapter_number: number;
  chapter_title: string;
  prose: string;
  clues_present?: string[];
  discriminating_test_present?: boolean;
}

export interface ProseOutput {
  chapters: ChapterProse[];
  /**
   * Union of all known clue IDs (clue_to_scene_mapping + ClueDistributionResult +
   * discriminating_test.evidence_clues + clue_registry) so the scorer can check
   * visibility against the same namespace used for detection.
   */
  expected_clue_ids?: string[];
  // Added so adaptProseForScoring can populate the fair-play consistency test (P-1 fix)
  fair_play_validation?: {
    all_clues_visible?: boolean;
    discriminating_test_complete?: boolean;
    no_solution_spoilers?: boolean;
    /** D7: true when no clue is first revealed in the same chapter where deduction/conclusion language appears. */
    fair_play_timing_compliant?: boolean;
    fair_play_timing_violations?: Array<{ clue_id: string; chapter: number }>;
  };
  completeness_diagnostics?: {
    expected_clue_ids_count?: number;
    visible_clue_ids_count?: number;
    clue_visibility_ratio?: number;
    missing_clue_ids?: string[];
  };
  trust_signals?: ProseTrustSignal[];
}

export interface ProseScoringAdapterOptions {
  fallbackTelemetry?: Array<{ chapterNumber?: number; committed?: boolean; reason?: string }>;
}

// D7: Matches strong conclusion/accusation language used when a detective draws a final
// inference from evidence — separate from the looser DISCRIMINATING_PROS_RE used for
// discriminating-test detection.  Used exclusively for same-chapter timing enforcement.
const CONCLUSION_RE =
  /\b(that proves|which proves|therefore[^.!?]{0,60}(?:culprit|guilty|murderer)|the only explanation|conclusively shows|i accuse|i name|you are the|the murderer is)\b/i;

const SPOILER_PROSE_RE =
  /\b(the\s+culprit\s+was|the\s+killer\s+was|was\s+the\s+murderer|confess(?:ed)?\s+to\s+the\s+murder|admitted\s+to\s+the\s+murder|i\s+name\s+[A-Z][a-z]+|i\s+accuse\s+[A-Z][a-z]+)\b/i;

export function adaptProseForScoring(
  proseChapters: any[],
  cmlCase?: any,          // pass (cml as any).CASE for clue extraction
  clueDistribution?: ClueDistributionResult,
  options?: ProseScoringAdapterOptions,
): ProseOutput {
  const fairPlayConfig = getAdapterConfig().fair_play;
  const evidence = collectClueEvidenceFromProse(proseChapters, cmlCase, clueDistribution);
  const knownClueIds = getKnownClueIds(cmlCase, clueDistribution);
  const discriminatingEvidenceIds = getDiscriminatingEvidenceClueIds(cmlCase);
  const discriminatingTokens = buildDiscriminatingSemanticTokens(cmlCase);

  const chapters: ChapterProse[] = proseChapters.map((ch: any, idx: number) => {
    const prose: string = ch.paragraphs?.join('\n\n') ?? ch.prose ?? '';
    const chapterNumber = idx + 1;
    const clues_present = evidence.evidenceByChapter[chapterNumber] ?? [];
    const discriminating_test_present = isDiscriminatingTestChapter(
      prose,
      discriminatingTokens,
      clues_present,
      discriminatingEvidenceIds,
    );

    return {
      chapter_number: idx + 1,          // sequential 1-based
      chapter_title: ch.title ?? '',
      prose,
      clues_present: clues_present.length > 0 ? clues_present : undefined,
      discriminating_test_present: discriminating_test_present || undefined,
    };
  });

  const storyForLifecycle = {
    id: 'agent9-prose',
    projectId: 'agent9-prose',
    metadata: {
      cast: ((cmlCase?.cast ?? []) as any[]).map((c: any) => String(c?.name ?? '')).filter(Boolean),
    },
    scenes: proseChapters.map((ch: any, idx: number) => ({
      number: idx + 1,
      title: String(ch?.title ?? `Chapter ${idx + 1}`),
      text: Array.isArray(ch?.paragraphs) ? ch.paragraphs.join('\n\n') : String(ch?.prose ?? ''),
    })),
  };
  const lifecycleErrors = validateCharacterLifecycle(
    storyForLifecycle,
    cmlCase ? { CASE: cmlCase } as any : undefined,
  );
  const leakageCount = chapters.reduce(
    (count, chapter) => count + detectControlPlaneLeakage(chapter.prose).filter((f) => f.confidence === 'hard').length,
    0,
  );
  const fallbackShortCount = chapters.filter((chapter) => {
    const words = chapter.prose.trim().split(/\s+/).filter(Boolean).length;
    return words > 0 && words < 850 && /fallback|chapter advances|scene objective|required evidence/i.test(chapter.prose);
  }).length;
  const committedFallbackCount = (options?.fallbackTelemetry ?? [])
    .filter((entry) => entry?.committed !== false)
    .length;
  const trustSignals: ProseTrustSignal[] = [
    ...lifecycleErrors
      .filter((error) => error.severity === 'critical')
      .map((error) => ({
        code: error.type === 'victim_culprit_conflict'
          ? 'identity_continuity_collapse'
          : error.type,
        severity: 'critical' as const,
        cap: 60,
        source: 'validation' as const,
      })),
    ...(leakageCount > 0
      ? [{
          code: 'control_plane_leakage',
          severity: 'major' as const,
          cap: 75,
          source: 'validation' as const,
        }]
      : []),
    ...(fallbackShortCount > 1
      ? [{
          code: 'multiple_fallback_short_chapters',
          severity: 'major' as const,
          cap: 80,
          source: 'fallback' as const,
        }]
      : []),
    ...(committedFallbackCount > 0
      ? [{
          code: committedFallbackCount > 1 ? 'multiple_committed_fallback_chapters' : 'committed_fallback_chapter',
          severity: 'major' as const,
          cap: committedFallbackCount > 1 ? 80 : 88,
          source: 'fallback' as const,
        }]
      : []),
  ];

  // Populate fair_play_validation so the scorer's consistency check runs (P-1 fix)
  const dtComplete = chapters.some(c => c.discriminating_test_present);
  const allCluesVisible =
    knownClueIds.length === 0 ||
    knownClueIds.every(id => evidence.visibleClueIds.includes(id));
  const missingClueIds = knownClueIds.filter((id) => !evidence.visibleClueIds.includes(id));
  const clueVisibilityRatio =
    knownClueIds.length > 0 ? evidence.visibleClueIds.length / knownClueIds.length : 1;
  // Spoiler check: look for accusation/solution language in the first 50% of chapters.
  // We deliberately stop at the halfway point so Act III climax language isn't penalised.
  const hasEarlyRevealCue = chapters
    .slice(0, Math.max(1, Math.ceil(chapters.length * fairPlayConfig.spoiler_early_chapter_ratio)))
    .some((chapter) => SPOILER_PROSE_RE.test(chapter.prose));
  const noSolutionSpoilers = !hasEarlyRevealCue;

  // D7: Fair-play timing check — each clue must be revealed to the reader at least one
  // chapter before it is used in a detective deduction or conclusion scene.
  // We flag violations only when a clue's first-reveal chapter is also a
  // discriminating-test or strong-conclusion chapter.
  // D7 fair-play timing: track the *first* chapter in which each clue becomes visible.
  // (Any later chapter that also contains the clue is not a timing violation — only the
  //  first reveal matters for the clue-before-deduction rule.)
  const firstRevealChapterById: Record<string, number> = {};
  for (const [chNumStr, clueIds] of Object.entries(evidence.evidenceByChapter)) {
    const chNum = Number(chNumStr);
    for (const clueId of clueIds) {
      if (!(clueId in firstRevealChapterById)) {
        firstRevealChapterById[clueId] = chNum;
      }
    }
  }
  const fairPlayTimingViolations: Array<{ clue_id: string; chapter: number }> = [];
  // Act I chapters (first 25%) are exempt from the timing check — early chapters commonly
  // use scene-setting language that incidentally triggers CONCLUSION_RE or discriminating tests.
  const actIExemptionEnd = Math.ceil(chapters.length * 0.25);
  for (const chapter of chapters) {
    const inActI = chapter.chapter_number <= actIExemptionEnd;
    const isDeductionChapter =
      !inActI && (chapter.discriminating_test_present || CONCLUSION_RE.test(chapter.prose));
    if (!isDeductionChapter) continue;
    const firstRevealedHere = Object.entries(firstRevealChapterById)
      .filter(([, firstChap]) => firstChap === chapter.chapter_number)
      .map(([clueId]) => clueId);
    for (const clueId of firstRevealedHere) {
      fairPlayTimingViolations.push({ clue_id: clueId, chapter: chapter.chapter_number });
    }
  }
  const fairPlayTimingCompliant = fairPlayTimingViolations.length === 0;

  return {
    chapters,
    // Expose the union of all known clue ID sources so the scorer can compare against
    // the same namespace the adapter used for detection.  Without this, the scorer
    // re-derives expected IDs from CASE.prose_requirements.clue_to_scene_mapping alone
    // (agent3 IDs), while the adapter detected using ClueDistributionResult IDs (agent5).
    // Because these two ID sets are independently generated, they almost never match,
    // so every clue appears "missing" and the visibility score is permanently 0/N.
    expected_clue_ids: knownClueIds.length > 0 ? knownClueIds : undefined,
    fair_play_validation: {
      all_clues_visible: allCluesVisible,
      discriminating_test_complete: dtComplete,
      no_solution_spoilers: noSolutionSpoilers,
      fair_play_timing_compliant: fairPlayTimingCompliant,
      fair_play_timing_violations: fairPlayTimingViolations.length > 0 ? fairPlayTimingViolations : undefined,
    },
    completeness_diagnostics: {
      expected_clue_ids_count: knownClueIds.length,
      visible_clue_ids_count: evidence.visibleClueIds.length,
      clue_visibility_ratio: clueVisibilityRatio,
      missing_clue_ids: missingClueIds.length > 0 ? missingClueIds : undefined,
    },
    trust_signals: trustSignals.length > 0 ? trustSignals : undefined,
  };
}
