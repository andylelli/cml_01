import { Scorer, PhaseScore, ScoringContext, TestResult } from '../types.js';
import {
  pass,
  fail,
  partial,
  exists,
  calculateCategoryScore,
  getCriticalFailures,
} from '../scorer-utils.js';

/**
 * Chapter from narrative outline
 */
export interface Chapter {
  chapter_number?: number;
  chapter_title?: string;
  scenes?: Scene[];
  clues_introduced?: string[];
}

/**
 * Scene from narrative outline
 */
export interface Scene {
  scene_id?: string;
  location?: string;
  characters_present?: string[];
  action?: string;
}

/**
 * Narrative outline from Agent 7
 */
export interface NarrativeOutlineOutput {
  chapters: Chapter[];
  discriminating_test_scene?: {
    chapter_number?: number;
    scene_id?: string;
    description?: string;
  };
}

/**
 * Scores the Narrative Outline phase (Agent 7)
 * 
 * Validation: 18 chapters, scene structure
 * Quality: Pacing, scene detail
 * Completeness: All CML clues present, discriminating test
 * Consistency: Character names match cast
 */
export class NarrativeScorer
  implements Scorer<any, NarrativeOutlineOutput>
{
  private getExpectedChapters(targetLength?: string): number {
    if (targetLength === 'short') return 12;
    if (targetLength === 'long') return 26;
    return 18; // medium default
  }

  async score(
    input: any,
    output: NarrativeOutlineOutput,
    context: ScoringContext
  ): Promise<PhaseScore> {
    const tests: TestResult[] = [];
    const expectedChapters = this.getExpectedChapters(context.targetLength);

    // VALIDATION TESTS (40% weight)
    tests.push(...this.validateStructure(output, expectedChapters));

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

    // Calculate total
    const total =
      validation_score * 0.4 +
      quality_score * 0.3 +
      completeness_score * 0.2 +
      consistency_score * 0.1;

    const criticalFailures = getCriticalFailures(tests);
    const passed = criticalFailures.length === 0 && total >= 60;
    
    const component_failures: string[] = [];
    if (validation_score < 60) component_failures.push('validation');
    if (quality_score < 50) component_failures.push('quality');
    if (completeness_score < 60) component_failures.push('completeness');
    if (consistency_score < 50) component_failures.push('consistency');

    return {
      agent: 'agent7-narrative-outline',
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

  private validateStructure(output: NarrativeOutlineOutput, expectedChapters: number): TestResult[] {
    const tests: TestResult[] = [];

    if (!output || !Array.isArray(output.chapters)) {
      tests.push(
        fail(
          'Chapters array exists',
          'validation',
          3.0,
          'Chapters array is missing',
          'critical'
        )
      );
      return tests;
    }

    tests.push(pass('Chapters array exists', 'validation', 0.5));

    // Expect chapter count based on story length
    const chapterCount = output.chapters.length;
    const tolerance = Math.max(2, Math.round(expectedChapters * 0.1));
    tests.push(
      chapterCount === expectedChapters
        ? pass('Chapter count', 'validation', 2.0, `${expectedChapters} chapters`)
        : Math.abs(chapterCount - expectedChapters) <= tolerance
        ? partial('Chapter count', 'validation', 80, 2.0, `${chapterCount} chapters (expected ${expectedChapters})`, 'minor')
        : partial('Chapter count', 'validation', Math.max(0, 100 - Math.abs(expectedChapters - chapterCount) * 5), 2.0, `${chapterCount} chapters (expected ${expectedChapters})`, 'major')
    );

    // Validate chapter structure
    let validChapters = 0;
    for (const chapter of output.chapters) {
      if (this.isValidChapter(chapter)) {
        validChapters++;
      }
    }

    const validRate = validChapters / output.chapters.length;
    tests.push(
      validRate >= 0.9
        ? pass('Chapter structure', 'validation', 2.0, `${Math.round(validRate * 100)}% valid`)
        : partial('Chapter structure', 'validation', validRate * 100, 2.0, `Only ${Math.round(validRate * 100)}% valid`)
    );

    // Validate discriminating test scene
    if (!output.discriminating_test_scene) {
      tests.push(
        fail(
          'Discriminating test scene',
          'validation',
          1.5,
          'Missing discriminating test scene',
          'major'
        )
      );
    } else if (
      !exists(output.discriminating_test_scene.chapter_number) ||
      !exists(output.discriminating_test_scene.scene_id) ||
      !exists(output.discriminating_test_scene.description)
    ) {
      tests.push(
        fail(
          'Discriminating test scene',
          'validation',
          1.5,
          'Discriminating test scene incomplete',
          'major'
        )
      );
    } else {
      tests.push(pass('Discriminating test scene', 'validation', 1.5));
    }

    return tests;
  }

  private isValidChapter(chapter: Chapter): boolean {
    return (
      exists(chapter.chapter_number) &&
      exists(chapter.chapter_title) &&
      Array.isArray(chapter.scenes) &&
      chapter.scenes.length > 0
    );
  }

  private assessQuality(output: NarrativeOutlineOutput): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.chapters || output.chapters.length === 0) {
      return tests;
    }

    // Check scene detail quality
    let totalSceneQuality = 0;
    let sceneCount = 0;

    for (const chapter of output.chapters) {
      if (!chapter.scenes) continue;

      for (const scene of chapter.scenes) {
        totalSceneQuality += this.scoreSceneDetail(scene);
        sceneCount++;
      }
    }

    const avgSceneQuality = sceneCount > 0 ? totalSceneQuality / sceneCount : 0;

    tests.push(
      avgSceneQuality >= 70
        ? pass('Scene detail quality', 'quality', 1.5, `${Math.round(avgSceneQuality)}% average`)
        : partial('Scene detail quality', 'quality', avgSceneQuality, 1.5, `${Math.round(avgSceneQuality)}% average`)
    );

    // Check clue distribution (pacing)
    const clueDistribution = this.analyzeClueDistribution(output.chapters);
    tests.push(
      clueDistribution.score >= 70
        ? pass('Clue pacing', 'quality', 1.0, clueDistribution.reason)
        : partial('Clue pacing', 'quality', clueDistribution.score, 1.0, clueDistribution.reason)
    );

    // Check chapter title quality
    const chaptersWithTitles = output.chapters.filter(
      c => exists(c.chapter_title) && c.chapter_title!.length >= 5
    ).length;

    tests.push(
      chaptersWithTitles >= output.chapters.length * 0.9
        ? pass('Chapter titles', 'quality', 0.5, `${chaptersWithTitles}/${output.chapters.length}`)
        : partial('Chapter titles', 'quality', (chaptersWithTitles / output.chapters.length) * 100, 0.5, `Only ${chaptersWithTitles}/${output.chapters.length}`)
    );

    return tests;
  }

  private scoreSceneDetail(scene: Scene): number {
    let score = 0;

    // Scene ID
    if (exists(scene.scene_id)) score += 20;

    // Location
    if (exists(scene.location)) score += 20;

    // Characters present
    if (scene.characters_present && scene.characters_present.length > 0) {
      score += 20;
      if (scene.characters_present.length >= 2) score += 10;
    }

    // Action description
    if (scene.action) {
      const wordCount = scene.action.split(/\s+/).length;
      if (wordCount >= 30) score += 30;
      else if (wordCount >= 15) score += 20;
      else if (wordCount >= 5) score += 10;
    }

    return Math.min(100, score);
  }

  private analyzeClueDistribution(chapters: Chapter[]): { score: number; reason: string } {
    // Count clues per chapter
    const cluesPerChapter: number[] = [];
    let totalClues = 0;

    for (const chapter of chapters) {
      const clueCount = chapter.clues_introduced?.length || 0;
      cluesPerChapter.push(clueCount);
      totalClues += clueCount;
    }

    if (totalClues === 0) {
      return { score: 0, reason: 'No clues introduced' };
    }

    // Check distribution: clues should be spread across chapters, not all at once
    const chaptersWithClues = cluesPerChapter.filter(c => c > 0).length;
    const distributionRate = chaptersWithClues / chapters.length;

    // Check for even distribution (avoid dumping all clues in one chapter)
    const maxCluesInChapter = Math.max(...cluesPerChapter);
    const avgCluesPerChapter = totalClues / chapters.length;
    const concentrationRatio = avgCluesPerChapter > 0 ? maxCluesInChapter / (avgCluesPerChapter * chapters.length) : 0;

    let score = 0;
    if (distributionRate >= 0.5) score += 50; // Clues in at least half the chapters
    else if (distributionRate >= 0.3) score += 30;

    if (concentrationRatio <= 0.3) score += 50; // Not too concentrated
    else if (concentrationRatio <= 0.5) score += 30;

    return {
      score: Math.min(100, score),
      reason: `${chaptersWithClues}/${chapters.length} chapters have clues`,
    };
  }

  private checkCompleteness(
    output: NarrativeOutlineOutput,
    context: ScoringContext
  ): TestResult[] {
    const tests: TestResult[] = [];

    // Check that all CML clues are present in outline
    if (context.cml) {
      const cmlClues = this.extractCMLClues(context.cml);
      const outlineClues = this.extractOutlineClues(output);

      let matchedClues = 0;
      for (const cmlClue of cmlClues) {
        if (this.clueInOutline(cmlClue, outlineClues)) {
          matchedClues++;
        }
      }

      if (cmlClues.length > 0) {
        const coverageRate = matchedClues / cmlClues.length;
        tests.push(
          coverageRate >= 0.9
            ? pass('CML clue coverage', 'completeness', 2.0, `${matchedClues}/${cmlClues.length} clues`)
            : partial('CML clue coverage', 'completeness', coverageRate * 100, 2.0, `Only ${matchedClues}/${cmlClues.length} clues`, 'major')
        );
      }
    }

    // Check discriminating test scene is in outline
    if (output.discriminating_test_scene) {
      const dtChapter = output.discriminating_test_scene.chapter_number;
      const dtSceneId = output.discriminating_test_scene.scene_id;

      if (dtChapter && dtSceneId) {
        const chapter = output.chapters.find(c => c.chapter_number === dtChapter);
        const sceneExists = chapter?.scenes?.some(s => s.scene_id === dtSceneId);

        tests.push(
          sceneExists
            ? pass('Discriminating test in outline', 'completeness', 1.0)
            : fail('Discriminating test in outline', 'completeness', 1.0, 'Scene not found in chapter', 'major')
        );
      }
    }

    return tests;
  }

  private extractCMLClues(cml: any): string[] {
    const clues: string[] = [];

    // Extract from hard logic devices
    if (cml.CASE?.hard_logic_devices) {
      for (const device of cml.CASE.hard_logic_devices) {
        if (device.clue_type === 'inference_clue' && device.clue_id) {
          clues.push(device.clue_id);
        }
      }
    }

    return clues;
  }

  private extractOutlineClues(output: NarrativeOutlineOutput): string[] {
    const clues: string[] = [];

    for (const chapter of output.chapters) {
      if (chapter.clues_introduced) {
        clues.push(...chapter.clues_introduced);
      }
    }

    return clues;
  }

  private clueInOutline(cmlClue: string, outlineClues: string[]): boolean {
    // Simple string matching (could be more sophisticated)
    const normalized = cmlClue.toLowerCase().trim();
    return outlineClues.some(oc => oc.toLowerCase().trim().includes(normalized) || normalized.includes(oc.toLowerCase().trim()));
  }

  private checkConsistency(
    output: NarrativeOutlineOutput,
    context: ScoringContext
  ): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.chapters || output.chapters.length === 0) {
      return tests;
    }

    // Check that character names in scenes match cast
    if (context.cml || context.previous_phases?.agent2_cast) {
      // Prefer the structured cast from previous_phases; fall back to raw CML CASE.cast
      const castPhase = context.previous_phases?.agent2_cast;
      const castArray: Array<{ name: string }> =
        (castPhase?.characters ?? castPhase ?? (context.cml as any)?.CASE?.cast ?? []);
      const castNames = castArray
        .map((c: any) => c.name?.toLowerCase())
        .filter((n: any): n is string => typeof n === 'string' && n.length > 0);

      let totalCharacterReferences = 0;
      let matchedReferences = 0;

      for (const chapter of output.chapters) {
        if (!chapter.scenes) continue;

        for (const scene of chapter.scenes) {
          if (!scene.characters_present) continue;

          for (const charRef of scene.characters_present) {
            totalCharacterReferences++;
            const normalized = charRef.toLowerCase().trim();
            if (castNames.some((cn: string) => normalized.includes(cn) || cn.includes(normalized))) {
              matchedReferences++;
            }
          }
        }
      }

      if (totalCharacterReferences > 0) {
        const matchRate = matchedReferences / totalCharacterReferences;
        tests.push(
          matchRate >= 0.8
            ? pass('Character name consistency', 'consistency', 1.5, `${Math.round(matchRate * 100)}% match cast`)
            : partial('Character name consistency', 'consistency', matchRate * 100, 1.5, `Only ${Math.round(matchRate * 100)}% match cast`)
        );
      }
    }

    // Check for duplicate scene IDs
    const sceneIds: string[] = [];
    for (const chapter of output.chapters) {
      if (chapter.scenes) {
        for (const scene of chapter.scenes) {
          if (scene.scene_id) sceneIds.push(scene.scene_id);
        }
      }
    }

    const uniqueSceneIds = new Set(sceneIds);
    tests.push(
      uniqueSceneIds.size === sceneIds.length
        ? pass('No duplicate scene IDs', 'consistency', 0.5)
        : fail('No duplicate scene IDs', 'consistency', 0.5, `${sceneIds.length - uniqueSceneIds.size} duplicate(s)`, 'minor')
    );

    return tests;
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
