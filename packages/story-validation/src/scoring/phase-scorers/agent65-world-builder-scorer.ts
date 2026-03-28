import { Scorer, PhaseScore, ScoringContext, TestResult } from '../types.js';
import { pass, fail, partial, calculateCategoryScore, getCriticalFailures } from '../scorer-utils.js';

export interface WorldBuilderOutput {
  status?: string;
  storyTheme?: string;
  historicalMoment?: {
    specificDate?: string;
    eraRegister?: string;
    currentTensions?: string[];
    physicalConstraints?: string[];
    emotionalRegister?: string;
  };
  characterPortraits?: Array<{ name?: string; portrait?: string; eraIntersection?: string }>;
  characterVoiceSketches?: Array<{
    name?: string;
    voiceDescription?: string;
    fragments?: Array<{ register?: string; text?: string }>;
  }>;
  locationRegisters?: Array<{ locationId?: string; emotionalRegister?: string; cameraAngle?: string }>;
  storyEmotionalArc?: {
    dominantRegister?: string;
    arcDescription?: string;
    turningPoints?: Array<{ position?: string; emotionalDescription?: string }>;
    endingNote?: string;
  };
  humourPlacementMap?: Array<{ scenePosition?: string; humourPermission?: string; rationale?: string }>;
  breakMoment?: { character?: string; scenePosition?: string; form?: string; narrativeFunction?: string };
  revealImplications?: string;
  validationConfirmations?: Record<string, boolean | string>;
}

const EXPECTED_ARC_POSITIONS = new Set([
  'opening', 'early', 'first_turn', 'mid', 'second_turn', 'pre_climax', 'climax', 'resolution',
]);

const EXPECTED_HUMOUR_POSITIONS = new Set([
  'opening_scene', 'first_investigation', 'body_discovery', 'first_interview',
  'domestic_scene', 'mid_investigation', 'second_interview', 'tension_scene',
  'pre_climax', 'discriminating_test', 'revelation', 'resolution',
]);

const countWords = (text: string): number => (text ?? '').trim().split(/\s+/).filter(Boolean).length;

/**
 * Scores the World Builder phase (Agent 6.5)
 *
 * Phase key: agent65_world_builder
 * Pass threshold: 70 points out of 100
 * Gate: validationConfirmations must all be true (checked independently of score)
 */
export class Agent65WorldBuilderScorer implements Scorer<any, WorldBuilderOutput> {
  async score(
    _input: any,
    output: WorldBuilderOutput,
    context: ScoringContext & { castSize?: number }
  ): Promise<PhaseScore> {
    const tests: TestResult[] = [];

    // ── GATE: validationConfirmations (fail blocks pipeline regardless of score) ──
    tests.push(...this.checkValidationConfirmations(output));

    // ── SCORED CHECKS ──────────────────────────────────────────────────────────
    tests.push(...this.scoreCharacterPortraitsCoverage(output, context));
    tests.push(...this.scoreVoiceSketchFragments(output));
    tests.push(...this.scoreHumourPlacementMap(output));
    tests.push(...this.scoreEmotionalArc(output));
    tests.push(...this.scoreBreakMoment(output));
    tests.push(...this.scoreStoryTheme(output));

    const validation_score = calculateCategoryScore(tests, 'validation');
    const quality_score = calculateCategoryScore(tests, 'quality');
    const completeness_score = calculateCategoryScore(tests, 'completeness');
    const consistency_score = calculateCategoryScore(tests, 'consistency');

    // Total is sum of scored checks (max 100)
    const total =
      validation_score * 0.4 +
      quality_score * 0.25 +
      completeness_score * 0.25 +
      consistency_score * 0.1;

    const criticalFailures = getCriticalFailures(tests);
    const passed = criticalFailures.length === 0 && total >= 70;

    const component_failures: string[] = [];
    if (criticalFailures.length > 0) component_failures.push('gate_failed');
    if (quality_score < 50) component_failures.push('quality');
    if (completeness_score < 50) component_failures.push('completeness');

    return {
      agent: 'agent65-world-builder',
      validation_score,
      quality_score,
      completeness_score,
      consistency_score,
      total: Math.round(total),
      grade: this.grade(total),
      passed,
      tests,
      component_failures: component_failures.length > 0 ? component_failures : undefined,
      failure_reason: !passed
        ? criticalFailures.map((t) => t.message).join('; ')
        : undefined,
    };
  }

  // ── Gate: all validationConfirmations must be true ────────────────────────
  private checkValidationConfirmations(output: WorldBuilderOutput): TestResult[] {
    const tests: TestResult[] = [];
    const confirmations = output?.validationConfirmations ?? {};
    const expected = [
      'noNewCharacterFacts', 'noNewPlotFacts', 'castComplete',
      'eraSpecific', 'lockedFactsPreserved', 'humourMapComplete',
    ];
    for (const key of expected) {
      const val = confirmations[key];
      if (val === true) {
        tests.push(pass(`validationConfirmations.${key}`, 'validation', 1));
      } else {
        tests.push(fail(
          `validationConfirmations.${key}`,
          'validation',
          1,
          `${key} is not confirmed: ${val}`,
          'critical'
        ));
      }
    }
    return tests;
  }

  // ── Scored: characterPortraits coverage (0-20 pts) ────────────────────────
  private scoreCharacterPortraitsCoverage(
    output: WorldBuilderOutput,
    context: ScoringContext & { castSize?: number }
  ): TestResult[] {
    const portraits = output?.characterPortraits ?? [];
    const castSize = context?.castSize ?? portraits.length;

    if (castSize === 0) {
      return [pass('characterPortraits populated', 'quality', 3)];
    }

    if (portraits.length === castSize) {
      return [pass('characterPortraits covers full cast', 'quality', 3)];
    }

    return [partial(
      'characterPortraits covers full cast',
      'quality',
      Math.round(100 * (portraits.length / castSize)),
      3,
      `${portraits.length}/${castSize} cast members have portraits`
    )];
  }

  // ── Scored: voiceSketchFragments (0-20 pts) ───────────────────────────────
  private scoreVoiceSketchFragments(output: WorldBuilderOutput): TestResult[] {
    const tests: TestResult[] = [];
    const sketches = output?.characterVoiceSketches ?? [];

    if (sketches.length === 0) {
      tests.push(fail('characterVoiceSketches present', 'quality', 3, 'No voice sketches', 'minor'));
      return tests;
    }

    let wellFormedCount = 0;
    for (const sketch of sketches) {
      const fragments = sketch.fragments ?? [];
      const hasComfortable = fragments.some((f) => f.register === 'comfortable');
      const hasEvasive = fragments.some((f) => f.register === 'evasive');
      const hasEnoughFragments = fragments.length >= 3;
      const registersCount = new Set(fragments.map((f) => f.register)).size;
      if (hasComfortable && hasEvasive && hasEnoughFragments && registersCount >= 2) {
        wellFormedCount++;
      }
    }

    const ratio = wellFormedCount / sketches.length;
    if (ratio >= 0.9) {
      tests.push(pass('voiceSketch fragments quality', 'quality', 3));
    } else if (ratio >= 0.5) {
      tests.push(partial('voiceSketch fragments quality', 'quality', Math.round(ratio * 100), 3,
        `${wellFormedCount}/${sketches.length} sketches have ≥3 fragments across ≥2 registers`));
    } else {
      tests.push(fail('voiceSketch fragments quality', 'quality', 3,
        `Only ${wellFormedCount}/${sketches.length} sketches are well-formed`));
    }

    return tests;
  }

  // ── Scored: humourPlacementMap coverage (0-20 pts) ───────────────────────
  private scoreHumourPlacementMap(output: WorldBuilderOutput): TestResult[] {
    const tests: TestResult[] = [];
    const map = output?.humourPlacementMap ?? [];
    const presentPositions = new Set(map.map((e) => e.scenePosition));

    const missingPositions = [...EXPECTED_HUMOUR_POSITIONS].filter((p) => !presentPositions.has(p));

    if (missingPositions.length === 0) {
      tests.push(pass('humourPlacementMap complete (12 positions)', 'completeness', 3));
    } else {
      tests.push(partial(
        'humourPlacementMap complete (12 positions)',
        'completeness',
        Math.round(100 * ((12 - missingPositions.length) / 12)),
        3,
        `Missing positions: ${missingPositions.join(', ')}`
      ));
    }

    // Check that body_discovery, discriminating_test, revelation are forbidden
    const solemnPositions = ['body_discovery', 'discriminating_test', 'revelation'];
    for (const pos of solemnPositions) {
      const entry = map.find((e) => e.scenePosition === pos);
      if (entry && entry.humourPermission !== 'forbidden') {
        tests.push(fail(
          `${pos} humour is forbidden`,
          'consistency',
          1,
          `${pos} has humourPermission "${entry.humourPermission}" — must be "forbidden"`
        ));
      }
    }

    return tests;
  }

  // ── Scored: storyEmotionalArc (0-20 pts) ──────────────────────────────────
  private scoreEmotionalArc(output: WorldBuilderOutput): TestResult[] {
    const tests: TestResult[] = [];
    const arc = output?.storyEmotionalArc;
    if (!arc) {
      tests.push(fail('storyEmotionalArc present', 'completeness', 3, 'storyEmotionalArc missing'));
      return tests;
    }

    const wordCount = countWords(arc.arcDescription ?? '');
    if (wordCount >= 200 && wordCount <= 350) {
      tests.push(pass('arcDescription word count (200-300w)', 'quality', 3));
    } else if (wordCount >= 100) {
      tests.push(partial('arcDescription word count (200-300w)', 'quality', 50, 3,
        `arcDescription has ${wordCount} words (target 200-300)`));
    } else {
      tests.push(fail('arcDescription word count (200-300w)', 'quality', 3,
        `arcDescription too short: ${wordCount} words`));
    }

    const turningPoints = arc.turningPoints ?? [];
    const presentPositions = new Set(turningPoints.map((t) => t.position));
    const missingArc = [...EXPECTED_ARC_POSITIONS].filter((p) => !presentPositions.has(p));
    if (missingArc.length === 0) {
      tests.push(pass('arcTurningPoints all 8 positions', 'completeness', 3));
    } else {
      tests.push(partial('arcTurningPoints all 8 positions', 'completeness',
        Math.round(100 * ((8 - missingArc.length) / 8)), 3,
        `Missing arc positions: ${missingArc.join(', ')}`));
    }

    return tests;
  }

  // ── Scored: breakMoment (0-10 pts) ────────────────────────────────────────
  private scoreBreakMoment(output: WorldBuilderOutput): TestResult[] {
    const bm = output?.breakMoment;
    if (!bm) {
      return [fail('breakMoment present', 'completeness', 2, 'breakMoment missing')];
    }
    const allPopulated = bm.character && bm.scenePosition && bm.form && bm.narrativeFunction;
    if (allPopulated) {
      return [pass('breakMoment all fields populated', 'completeness', 2)];
    }
    return [partial('breakMoment all fields populated', 'completeness', 50, 2,
      'breakMoment has empty fields')];
  }

  // ── Scored: storyTheme (0-10 pts) ─────────────────────────────────────────
  private scoreStoryTheme(output: WorldBuilderOutput): TestResult[] {
    const theme = output?.storyTheme ?? '';
    const words = countWords(theme);
    if (words >= 20) {
      return [pass('storyTheme ≥20 words', 'quality', 2)];
    }
    if (words >= 10) {
      return [partial('storyTheme ≥20 words', 'quality', 50, 2, `storyTheme has ${words} words`)];
    }
    return [fail('storyTheme ≥20 words', 'quality', 2, `storyTheme too short: "${theme}"`)];
  }

  private grade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}
