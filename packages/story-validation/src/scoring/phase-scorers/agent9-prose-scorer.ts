import { Scorer, PhaseScore, ScoringContext, TestResult } from '../types.js';
import {
  pass,
  fail,
  partial,
  exists,
  calculateCategoryScore,
  getCriticalFailures,
} from '../scorer-utils.js';
import { STORY_LENGTH_TARGETS, type StoryLength } from '../../story-length-targets.js';

/**
 * Chapter prose from Agent 9
 */
export interface ChapterProse {
  chapter_number?: number;
  chapter_title?: string;
  prose?: string;
  clues_present?: string[];
  discriminating_test_present?: boolean;
}

/**
 * Prose output from Agent 9
 */
export interface ProseOutput {
  chapters: ChapterProse[];
  overall_word_count?: number;
  /**
   * Authoritative set of expected clue IDs for the visibility check.
   * Populated by adaptProseForScoring() from the union of all known ID sources
   * (clue_to_scene_mapping + clueDistribution + discriminating_test + clue_registry).
   * When present, checkCompleteness() uses this instead of re-deriving IDs from the CML
   * alone — ensuring the scorer and the adapter share the same ID namespace.
   */
  expected_clue_ids?: string[];
  fair_play_validation?: {
    all_clues_visible?: boolean;
    discriminating_test_complete?: boolean;
    no_solution_spoilers?: boolean;
    /** D7: true when no clue is first revealed in the same chapter where detective deduction/conclusion language appears. */
    fair_play_timing_compliant?: boolean;
    fair_play_timing_violations?: Array<{ clue_id: string; chapter: number }>;
  };
}

/**
 * Scores the Prose phase (Agent 9)
 * 
 * Validation: All chapters present, discriminating test included
 * Quality: Prose quality, readability, engagement
 * Completeness: Word count targets, all clues visible
 * Consistency: Character names match, setting fidelity, fair play
 */
// Alias the shared constants under the local name used throughout this file.
// Source of truth is packages/story-validation/src/story-length-targets.ts — edit there.
const LENGTH_TARGETS = STORY_LENGTH_TARGETS;

export class ProseScorer
  implements Scorer<any, ProseOutput>
{
  private targetLength: StoryLength = 'medium';

  async score(
    input: any,
    output: ProseOutput,
    context: ScoringContext
  ): Promise<PhaseScore> {
    this.targetLength = (context.targetLength ?? 'medium') as StoryLength;
    const tests: TestResult[] = [];

    // VALIDATION TESTS (40% weight)
    tests.push(...this.validateStructure(output, context));

    // QUALITY TESTS (30% weight)
    tests.push(...this.assessQuality(output));

    // COMPLETENESS TESTS (20% weight)
    tests.push(...this.checkCompleteness(output, context));

    // CONSISTENCY TESTS (10% weight)
    tests.push(...this.checkConsistency(output, context));

    // Calculate component scores
    const validation_score = calculateCategoryScore(tests, 'validation');
    const quality_score = calculateCategoryScore(tests, 'quality');
    const completeness_score = calculateCategoryScore(tests, 'completeness');
    const consistency_score = calculateCategoryScore(tests, 'consistency');

    // Total = weighted sum.  Weights reflect what matters most for a publishable mystery:
    // structural validity (40%) > prose craft (30%) > word-count completeness (20%) > consistency (10%).
    const total =
      validation_score * 0.4 +
      quality_score * 0.3 +
      completeness_score * 0.2 +
      consistency_score * 0.1;

    const criticalFailures = getCriticalFailures(tests);
    const passed = criticalFailures.length === 0 && total >= 60;
    
    // Component thresholds are intentionally asymmetric:
    //   validation / completeness: >= 60 required (structural gate — can't publish a broken mystery)
    //   quality / consistency: >= 50 allowed (prose craft has more subjective headroom)
    const component_failures: string[] = [];
    if (validation_score < 60) component_failures.push('validation');
    if (quality_score < 50) component_failures.push('quality');
    if (completeness_score < 60) component_failures.push('completeness');
    if (consistency_score < 50) component_failures.push('consistency');

    return {
      agent: 'agent9-prose',
      validation_score,
      quality_score,
      completeness_score,
      consistency_score,
      total: Math.round(total),
      grade: this.calculateGrade(total),
      passed,
      tests,
      component_failures: component_failures.length > 0 ? component_failures : undefined,
      failure_reason: !passed
        ? this.buildFailureReason(criticalFailures, component_failures)
        : undefined,
    };
  }

  private validateStructure(output: ProseOutput, context: ScoringContext): TestResult[] {
    const tests: TestResult[] = [];

    if (!output || !Array.isArray(output.chapters)) {
      tests.push(
        fail(
          'Chapters array exists',
          'validation',
          3.0,
          'Prose chapters array is missing',
          'critical'
        )
      );
      return tests;
    }

    tests.push(pass('Chapters array exists', 'validation', 0.5));

    // Expect chapter count based on story length.
    // Skip during partial generation — chapter count is always low mid-generation.
    if (!context.partialGeneration) {
      const targets = LENGTH_TARGETS[this.targetLength];
      const expectedChapters = targets.chapters;
      const actualChapters = output.chapters.length;

      tests.push(
        actualChapters === expectedChapters
          ? pass('All chapters present', 'validation', 2.0, `${actualChapters} chapters`)
          : actualChapters >= expectedChapters - 2
          ? partial('All chapters present', 'validation', 85, 2.0, `${actualChapters}/${expectedChapters} chapters`, 'minor')
          : partial('All chapters present', 'validation', (actualChapters / expectedChapters) * 100, 2.0, `Only ${actualChapters}/${expectedChapters} chapters`, 'major')
      );
    }

    // Validate each chapter structure
    let validChapters = 0;
    for (const chapter of output.chapters) {
      if (this.isValidChapter(chapter)) {
        validChapters++;
      }
    }

    const validRate = output.chapters.length > 0 ? validChapters / output.chapters.length : 0;
    tests.push(
      validRate >= 0.95
        ? pass('Chapter structure', 'validation', 1.5, `${Math.round(validRate * 100)}% valid`)
        : partial('Chapter structure', 'validation', validRate * 100, 1.5, `Only ${Math.round(validRate * 100)}% valid`)
    );

    // Check discriminating test presence
    const dtChapters = output.chapters.filter(c => c.discriminating_test_present);
    tests.push(
      dtChapters.length > 0
        ? pass('Discriminating test present', 'validation', 1.5)
        : fail('Discriminating test present', 'validation', 1.5, 'Discriminating test not found in any chapter', 'critical')
    );

    return tests;
  }

  private isValidChapter(chapter: ChapterProse): boolean {
    // 500 chars ~= 80-100 words: a chapter that short is effectively a stub
    // and should fail validation outright rather than receive a partial score.
    return (
      exists(chapter.chapter_number) &&
      exists(chapter.chapter_title) &&
      exists(chapter.prose) &&
      chapter.prose!.length >= 500 // Minimum prose length
    );
  }

  private assessQuality(output: ProseOutput): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.chapters || output.chapters.length === 0) {
      return tests;
    }

    // Check prose quality per chapter
    let totalProseQuality = 0;
    let chapterCount = 0;

    for (const chapter of output.chapters) {
      if (chapter.prose) {
        totalProseQuality += this.scoreProseQuality(chapter.prose);
        chapterCount++;
      }
    }

    const avgProseQuality = chapterCount > 0 ? totalProseQuality / chapterCount : 0;

    tests.push(
      avgProseQuality >= 70
        ? pass('Prose quality', 'quality', 2.0, `${Math.round(avgProseQuality)}% average`)
        : partial('Prose quality', 'quality', avgProseQuality, 2.0, `${Math.round(avgProseQuality)}% average`)
    );

    // Check readability (sentence variety, paragraph structure)
    let totalReadability = 0;
    for (const chapter of output.chapters) {
      if (chapter.prose) {
        totalReadability += this.scoreReadability(chapter.prose);
      }
    }
    const avgReadability = chapterCount > 0 ? totalReadability / chapterCount : 0;

    tests.push(
      avgReadability >= 70
        ? pass('Readability', 'quality', 1.0, `${Math.round(avgReadability)}% average`)
        : partial('Readability', 'quality', avgReadability, 1.0, `${Math.round(avgReadability)}% average`)
    );

    return tests;
  }

  private scoreProseQuality(prose: string): number {
    let score = 0;

    // Word count — threshold based on story length
    const targets = LENGTH_TARGETS[this.targetLength];
    const wordCount = prose.split(/\s+/).length;
    if (wordCount >= targets.chapterMinWords) score += 30;
    else if (wordCount >= Math.round(targets.chapterMinWords * 0.6)) score += 20;
    else if (wordCount >= Math.round(targets.chapterMinWords * 0.35)) score += 10;

    // Paragraph structure (multiple paragraphs)
    const paragraphs = prose.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    if (paragraphs.length >= 5) score += 20;
    else if (paragraphs.length >= 3) score += 12;
    else if (paragraphs.length >= 1) score += 5;

    // Dialogue presence (indicates character interaction)
    const hasDialogue = /["'].*["']/.test(prose) || /\bsaid\b|\basked\b|\breplied\b/i.test(prose);
    if (hasDialogue) score += 20;

    // Descriptive elements (sensory details)
    const sensoryWords = [
      /\b(saw|seen|looked|appeared|gleamed|shimmered)\b/i,
      /\b(heard|sound|voice|whispered|shouted)\b/i,
      /\b(smelled|scent|aroma|stench)\b/i,
      /\b(felt|touched|texture|smooth|rough)\b/i,
    ];
    const sensoryMatches = sensoryWords.filter(pattern => pattern.test(prose)).length;
    score += sensoryMatches * 5;

    // Narrative flow (transitions between scenes)
    const transitionWords = [
      /\b(meanwhile|later|afterward|then|next|subsequently)\b/i,
      /\b(suddenly|immediately|finally|eventually)\b/i,
    ];
    const transitionMatches = transitionWords.filter(pattern => pattern.test(prose)).length;
    score += Math.min(10, transitionMatches * 5);

    return Math.min(100, score);
  }

  private scoreReadability(prose: string): number {
    let score = 0;

    // Sentence count and variety
    const sentences = prose.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length >= 20) score += 30;
    else if (sentences.length >= 10) score += 20;
    else if (sentences.length >= 5) score += 10;

    // Sentence length variety (check for mix of short and long sentences)
    const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;

    if (variance > 50) score += 30; // Good variety
    else if (variance > 20) score += 20;
    else if (variance > 10) score += 10;

    // Check for overly long sentences (readability issue)
    const tooLongSentences = sentenceLengths.filter(len => len > 50).length;
    if (tooLongSentences === 0) score += 20;
    else if (tooLongSentences <= 2) score += 10;

    // Paragraph balance (not too short, not too long)
    const paragraphs = prose.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphWordCounts = paragraphs.map(p => p.split(/\s+/).length);
    const balancedParagraphs = paragraphWordCounts.filter(wc => wc >= 30 && wc <= 300).length;
    if (paragraphs.length > 0 && balancedParagraphs / paragraphs.length >= 0.7) {
      score += 20;
    } else if (paragraphs.length > 0 && balancedParagraphs / paragraphs.length >= 0.4) {
      score += 10;
    }

    return Math.min(100, score);
  }

  private checkCompleteness(output: ProseOutput, context: ScoringContext): TestResult[] {
    const tests: TestResult[] = [];

    // Skip whole-story word count during partial generation — it will always fail
    // mid-stream. Only score it once all chapters are present.
    if (!context.partialGeneration) {
      const targets = LENGTH_TARGETS[this.targetLength];
      const targetMin = targets.minWords;
      const targetMax = targets.maxWords;
      const wordCount = output.overall_word_count || this.calculateTotalWordCount(output);

      tests.push(
        wordCount >= targetMin && wordCount <= targetMax
          ? pass('Word count target', 'completeness', 1.5, `${wordCount.toLocaleString()} words`)
          : wordCount >= targetMin * 0.8
          ? partial('Word count target', 'completeness', 70, 1.5, `${wordCount.toLocaleString()} words (low)`, 'minor')
          : partial('Word count target', 'completeness', Math.min(100, (wordCount / targetMin) * 100), 1.5, `Only ${wordCount.toLocaleString()} words`, 'major')
      );
    }

    // Check that all CML clues are visible in prose.
    // Use output.expected_clue_ids when the adapter populated it — this ensures the
    // scorer compares against the same ID namespace the adapter used for detection
    // (union of clue_to_scene_mapping IDs + ClueDistributionResult IDs). Falling back
    // to extractCMLClues() when not available preserves backwards compatibility.
    if (context.cml || output.expected_clue_ids) {
      const cmlClues = output.expected_clue_ids ?? this.extractCMLClues(context.cml);
      const proseClues = output.chapters.flatMap(c => c.clues_present || []);

      let visibleClues = 0;
      for (const cmlClue of cmlClues) {
        if (this.clueInProse(cmlClue, proseClues)) {
          visibleClues++;
        }
      }

      if (cmlClues.length > 0) {
        const clueVisibility = visibleClues / cmlClues.length;
        tests.push(
          clueVisibility >= 0.95
            ? pass('Clue visibility', 'completeness', 1.5, `${visibleClues}/${cmlClues.length} clues`)
            : clueVisibility >= 0.8
            ? partial('Clue visibility', 'completeness', 85, 1.5, `${visibleClues}/${cmlClues.length} clues`, 'minor')
            : partial('Clue visibility', 'completeness', clueVisibility * 100, 1.5, `Only ${visibleClues}/${cmlClues.length} clues`, 'critical')
        );
      }
    }

    return tests;
  }

  private calculateTotalWordCount(output: ProseOutput): number {
    return output.chapters.reduce((total, chapter) => {
      const words = chapter.prose?.split(/\s+/).length || 0;
      return total + words;
    }, 0);
  }

  private extractCMLClues(cml: any): string[] {
    // Read from the canonical CML path: CASE.prose_requirements.clue_to_scene_mapping[].clue_id
    // (CASE.hard_logic_devices and CASE.clue_registry do not exist in the cml_2_0 schema)
    return ((cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? [])
      .map((m: any) => m.clue_id as string)
      .filter((id: any): id is string => typeof id === 'string' && id.length > 0);
  }

  private clueInProse(cmlClue: string, proseClues: string[]): boolean {
    const normalized = cmlClue.toLowerCase().trim();
    return proseClues.some(pc => pc.toLowerCase().trim().includes(normalized) || normalized.includes(pc.toLowerCase().trim()));
  }

  private checkConsistency(output: ProseOutput, context: ScoringContext): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.chapters || output.chapters.length === 0) {
      return tests;
    }

    // Check character name consistency across chapters
    if (context.cml) {
      const cast = (context.cml as any)?.CASE?.cast || [];
      const castNames = cast.map((c: any) => c.name).filter((n: string) => n);

      const characterConsistency = this.checkCharacterNameConsistency(
        output.chapters,
        castNames
      );

      tests.push(
        characterConsistency.score >= 90
          ? pass('Character name consistency', 'consistency', 2.0, characterConsistency.reason)
          : partial('Character name consistency', 'consistency', characterConsistency.score, 2.0, characterConsistency.reason, characterConsistency.score < 70 ? 'major' : 'minor')
      );
    }

    // Check setting fidelity (locations match location profiles)
    if (context.previous_phases && context.previous_phases.agent2c_location_profiles) {
      // The orchestrator passes the full locationProfiles object; keyLocations is the array.
      // KeyLocation objects use .name (not .location_name).
      const rawProfiles = context.previous_phases.agent2c_location_profiles as any;
      const profiles: any[] = Array.isArray(rawProfiles)
        ? rawProfiles
        : Array.isArray(rawProfiles?.keyLocations)
          ? rawProfiles.keyLocations
          : [];
      const profileNames = profiles
        .map((p: any) => (p.name ?? p.location_name ?? '').toLowerCase())
        .filter((n: string) => n);

      const settingFidelity = this.checkSettingFidelity(output.chapters, profileNames);

      tests.push(
        settingFidelity.score >= 70
          ? pass('Setting fidelity', 'consistency', 1.5, settingFidelity.reason)
          : partial('Setting fidelity', 'consistency', settingFidelity.score, 1.5, settingFidelity.reason)
      );
    }

    // Check fair play validation
    if (output.fair_play_validation) {
      const fpv = output.fair_play_validation;

      // D8 recalibrated weights: 35/35/15/15 (was 40/40/20) to include timing enforcement.
      // fair_play_timing_compliant defaults to pass (15 pts) when absent for backwards compat.
      // The `!== false` sentinel is intentional: undefined (field missing) is treated as
      // passing so existing scored runs without the field do not retroactively lose points.
      const fairPlayScore =
        (fpv.all_clues_visible ? 35 : 0) +
        (fpv.discriminating_test_complete ? 35 : 0) +
        (fpv.no_solution_spoilers ? 15 : 0) +
        (fpv.fair_play_timing_compliant !== false ? 15 : 0);

      const timingDetail =
        fpv.fair_play_timing_compliant === false && fpv.fair_play_timing_violations?.length
          ? `: timing violation in chapter(s) ${[...new Set(fpv.fair_play_timing_violations.map((v) => v.chapter))].join(", ")}`
          : "";

      tests.push(
        fairPlayScore === 100
          ? pass('Fair play compliance', 'consistency', 1.5)
          : partial('Fair play compliance', 'consistency', fairPlayScore, 1.5, `${fairPlayScore}/100${timingDetail}`, fairPlayScore < 60 ? 'critical' : 'minor')
      );
    }

    return tests;
  }

  private checkCharacterNameConsistency(
    chapters: ChapterProse[],
    castNames: string[]
  ): { score: number; reason: string } {
    // Extract all character references from prose
    const allProse = chapters.map(c => c.prose || '').join(' ');
    const words = allProse.split(/\s+/);

    // Count references to each cast member
    const references: Record<string, number> = {};
    for (const name of castNames) {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\b${escapedName}\\b`, 'gi');
      const matches = allProse.match(pattern);
      references[name] = matches ? matches.length : 0;
    }

    // Check if all cast members are referenced
    const referencedMembers = Object.values(references).filter(count => count > 0).length;
    const coverageRate = castNames.length > 0 ? referencedMembers / castNames.length : 1;

    // Check for name variations or typos (simple check)
    const uniqueCapitalizedWords = new Set(
      words.filter(w => /^[A-Z][a-z]+/.test(w))
    );

    let score = coverageRate * 100;
    
    return {
      score: Math.round(score),
      reason: `${referencedMembers}/${castNames.length} characters referenced`,
    };
  }

  private checkSettingFidelity(
    chapters: ChapterProse[],
    profileNames: string[]
  ): { score: number; reason: string } {
    const allProse = chapters.map(c => c.prose || '').join(' ').toLowerCase();

    let referencedLocations = 0;
    for (const locationName of profileNames) {
      if (allProse.includes(locationName)) {
        referencedLocations++;
      }
    }

    const fidelityRate = profileNames.length > 0 ? referencedLocations / profileNames.length : 1;

    return {
      score: Math.round(fidelityRate * 100),
      reason: `${referencedLocations}/${profileNames.length} locations referenced`,
    };
  }

  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private buildFailureReason(
    criticalFailures: TestResult[],
    componentFailures: string[]
  ): string {
    const parts: string[] = [];

    if (criticalFailures.length > 0) {
      parts.push(`${criticalFailures.length} critical failure(s)`);
    }

    if (componentFailures.length > 0) {
      parts.push(`Components below minimum: ${componentFailures.join(', ')}`);
    }

    return parts.join('; ') || 'Score below threshold';
  }
}
