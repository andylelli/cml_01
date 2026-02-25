import { Scorer, PhaseScore, ScoringContext, TestResult } from '../types.js';
import {
  pass,
  fail,
  partial,
  exists,
  hasMinLength,
  validateSchema,
  calculateCategoryScore,
  scoreArrayCompleteness,
  checkDuplicates,
  getCriticalFailures,
  inRange,
} from '../scorer-utils.js';

/**
 * Cast member from CML
 */
export interface CastMember {
  name: string;
  age_range?: string;
  role_archetype?: string;
  relationships?: string[];
  public_persona?: string;
  private_secret?: string;
  motive_seed?: string;
  motive_strength?: string;
  alibi_window?: string;
  access_plausibility?: string;
  opportunity_channels?: string[];
  behavioral_tells?: string[];
  stakes?: string;
  evidence_sensitivity?: string[];
  culprit_eligibility?: string;
  culpability?: string;
}

/**
 * Cast Design input (from user + previous agents)
 */
export interface CastDesignInput {
  cast_size?: number;
  primary_axis?: string;
}

/**
 * Cast Design output (CML cast array)
 */
export interface CastDesignOutput {
  cast: CastMember[];
}

/**
 * Scores the Cast Design phase (Agent 2)
 * 
 * Validation: Schema compliance, required fields per character
 * Quality: Character depth, motive strength, relationship complexity
 * Completeness: Cast size appropriate, all roles covered
 * Consistency: Relationship reciprocity, culprit designation validity
 */
export class CastDesignScorer
  implements Scorer<CastDesignInput, CastDesignOutput>
{
  async score(
    input: CastDesignInput,
    output: CastDesignOutput,
    context: ScoringContext
  ): Promise<PhaseScore> {
    const tests: TestResult[] = [];

    // VALIDATION TESTS (40% weight)
    tests.push(...this.validateStructure(output));

    // QUALITY TESTS (30% weight)
    tests.push(...this.assessQuality(output));

    // COMPLETENESS TESTS (20% weight)
    tests.push(...this.checkCompleteness(output, input));

    // CONSISTENCY TESTS (10% weight)
    tests.push(...this.checkConsistency(output, context));

    // Calculate component scores
    const validation_score = calculateCategoryScore(tests, 'validation');
    const quality_score = calculateCategoryScore(tests, 'quality');
    const completeness_score = calculateCategoryScore(tests, 'completeness');
    const consistency_score = calculateCategoryScore(tests, 'consistency');

    // Calculate total (weighted average)
    const total =
      validation_score * 0.4 +
      quality_score * 0.3 +
      completeness_score * 0.2 +
      consistency_score * 0.1;

    // Determine pass/fail
    const criticalFailures = getCriticalFailures(tests);
    const passed = criticalFailures.length === 0 && total >= 60;
    
    const component_failures: string[] = [];
    if (validation_score < 60) component_failures.push('validation');
    if (quality_score < 50) component_failures.push('quality');
    if (completeness_score < 60) component_failures.push('completeness');
    if (consistency_score < 50) component_failures.push('consistency');

    return {
      agent: 'agent2-cast',
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

  /**
   * Validation: Schema structure and required fields
   */
  private validateStructure(output: CastDesignOutput): TestResult[] {
    const tests: TestResult[] = [];

    // Check cast array exists
    if (!output || !Array.isArray(output.cast)) {
      tests.push(
        fail(
          'Cast array exists',
          'validation',
          3.0,
          'Cast array is missing or not an array',
          'critical'
        )
      );
      return tests;
    }

    tests.push(pass('Cast array exists', 'validation', 1.0));

    // Check cast not empty
    if (output.cast.length === 0) {
      tests.push(
        fail(
          'Cast not empty',
          'validation',
          3.0,
          'Cast array is empty',
          'critical'
        )
      );
      return tests;
    }

    tests.push(pass('Cast not empty', 'validation', 1.0));

    // Validate each character
    let validCharacters = 0;
    for (const char of output.cast) {
      const charTests = this.validateCharacter(char);
      tests.push(...charTests);
      if (charTests.every(t => t.passed)) {
        validCharacters++;
      }
    }

    // Check that most characters are valid
    const validRate = validCharacters / output.cast.length;
    if (validRate < 0.7) {
      tests.push(
        fail(
          'Character validity rate',
          'validation',
          2.0,
          `Only ${Math.round(validRate * 100)}% of characters are valid (need 70%)`,
          'major'
        )
      );
    } else if (validRate < 1.0) {
      tests.push(
        partial(
          'Character validity rate',
          'validation',
          Math.round(validRate * 100),
          2.0,
          `${Math.round(validRate * 100)}% of characters are valid`
        )
      );
    } else {
      tests.push(
        pass('Character validity rate', 'validation', 2.0, 'All characters valid')
      );
    }

    // Check for duplicate names
    tests.push(checkDuplicates(output.cast, c => c.name, 'No duplicate names', 'validation'));

    return tests;
  }

  /**
   * Validate individual character
   */
  private validateCharacter(char: CastMember): TestResult[] {
    const tests: TestResult[] = [];
    const charName = char.name || 'Unnamed';

    // Required fields
    const requiredFields: (keyof CastMember)[] = [
      'name',
      'role_archetype',
      'public_persona',
      'private_secret',
      'motive_seed',
      'motive_strength',
      'culprit_eligibility',
    ];

    for (const field of requiredFields) {
      if (!exists(char[field])) {
        tests.push(
          fail(
            `${charName}: ${field}`,
            'validation',
            0.5,
            `Missing required field: ${field}`,
            'major'
          )
        );
      } else {
        tests.push(
          pass(`${charName}: ${field}`, 'validation', 0.1)
        );
      }
    }

    return tests;
  }

  /**
   * Quality: Character depth and richness
   */
  private assessQuality(output: CastDesignOutput): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.cast || output.cast.length === 0) {
      return tests;
    }

    // Check character depth across cast
    let totalDepthScore = 0;
    for (const char of output.cast) {
      totalDepthScore += this.scoreCharacterDepth(char);
    }
    const avgDepth = totalDepthScore / output.cast.length;

    tests.push(
      avgDepth >= 75
        ? pass('Character depth', 'quality', 2.0, `Average depth: ${Math.round(avgDepth)}%`)
        : partial('Character depth', 'quality', avgDepth, 2.0, `Average depth: ${Math.round(avgDepth)}%`)
    );

    // Check motive strength distribution
    const motiveStrengths = output.cast
      .map(c => c.motive_strength)
      .filter(exists);
    
    const hasVariety = new Set(motiveStrengths).size >= 2;
    tests.push(
      hasVariety
        ? pass('Motive strength variety', 'quality', 1.0, 'Multiple motive strengths present')
        : partial('Motive strength variety', 'quality', 50, 1.0, 'Limited motive variety', 'minor')
    );

    // Check relationship complexity
    const relationshipTests = this.assessRelationshipQuality(output.cast);
    tests.push(...relationshipTests);

    return tests;
  }

  /**
   * Score individual character depth (0-100)
   */
  private scoreCharacterDepth(char: CastMember): number {
    let score = 0;

    // Has name (required)
    if (exists(char.name)) score += 10;

    // Has role archetype
    if (exists(char.role_archetype)) score += 10;

    // Has public persona (should be descriptive)
    if (char.public_persona && char.public_persona.length > 20) score += 15;
    else if (exists(char.public_persona)) score += 5;

    // Has private secret (should be descriptive)
    if (char.private_secret && char.private_secret.length > 20) score += 15;
    else if (exists(char.private_secret)) score += 5;

    // Has motive
    if (char.motive_seed && char.motive_seed.length > 15) score += 15;
    else if (exists(char.motive_seed)) score += 5;

    // Has relationships
    if ((char.relationships?.length || 0) >= 2) score += 10;
    else if ((char.relationships?.length || 0) >= 1) score += 5;

    // Has opportunity channels
    if ((char.opportunity_channels?.length || 0) >= 2) score += 10;
    else if ((char.opportunity_channels?.length || 0) >= 1) score += 5;

    // Has behavioral tells
    if ((char.behavioral_tells?.length || 0) >= 2) score += 10;
    else if ((char.behavioral_tells?.length || 0) >= 1) score += 5;

    // Has stakes
    if (exists(char.stakes)) score += 10;

    return Math.min(100, score);
  }

  /**
   * Assess relationship network quality
   */
  private assessRelationshipQuality(cast: CastMember[]): TestResult[] {
    const tests: TestResult[] = [];

    // Count total relationships
    const totalRelationships = cast.reduce(
      (sum, char) => sum + (char.relationships?.length || 0),
      0
    );

    const avgRelationships = totalRelationships / cast.length;

    tests.push(
      avgRelationships >= 2
        ? pass('Relationship density', 'quality', 1.0, `Avg ${avgRelationships.toFixed(1)} per character`)
        : partial('Relationship density', 'quality', Math.min(100, avgRelationships * 50), 1.0, `Only ${avgRelationships.toFixed(1)} per character`)
    );

    // Check that characters reference each other
    const names = cast.map(c => c.name);
    let reciprocalCount = 0;
    for (const char of cast) {
      if (!char.relationships) continue;
      for (const rel of char.relationships) {
        // Check if mentioned person exists in cast
        if (names.some(name => rel.includes(name))) {
          reciprocalCount++;
        }
      }
    }

    const hasReciprocal = reciprocalCount > 0;
    tests.push(
      hasReciprocal
        ? pass('Relationships reference cast', 'quality', 1.0)
        : fail('Relationships reference cast', 'quality', 1.0, 'Relationships don\'t reference other cast members', 'minor')
    );

    return tests;
  }

  /**
   * Completeness: Cast size and coverage
   */
  private checkCompleteness(
    output: CastDesignOutput,
    input: CastDesignInput
  ): TestResult[] {
    const tests: TestResult[] = [];

    // Check cast size
    const castSize = output.cast?.length || 0;
    const targetSize = input.cast_size || 8;

    tests.push(
      scoreArrayCompleteness(
        output.cast,
        Math.max(4, targetSize - 2), // Min is target-2, but at least 4
        targetSize,
        'Cast size appropriate',
        'completeness'
      )
    );

    // Check that we have at least one culprit-eligible character
    const eligibleCount = output.cast.filter(
      c => c.culprit_eligibility === 'eligible'
    ).length;

    tests.push(
      eligibleCount >= 3
        ? pass('Sufficient suspects', 'completeness', 2.0, `${eligibleCount} eligible suspects`)
        : eligibleCount >= 1
        ? partial('Sufficient suspects', 'completeness', eligibleCount * 30, 2.0, `Only ${eligibleCount} suspect(s)`, 'minor')
        : fail('Sufficient suspects', 'completeness', 2.0, 'No eligible suspects', 'critical')
    );

    // Check role diversity
    const archetypes = new Set(
      output.cast.map(c => c.role_archetype).filter(exists)
    );
    const diversityScore = Math.min(100, (archetypes.size / castSize) * 100);

    tests.push(
      archetypes.size >= castSize * 0.7
        ? pass('Role diversity', 'completeness', 1.0, `${archetypes.size} unique archetypes`)
        : partial('Role diversity', 'completeness', diversityScore, 1.0, `Only ${archetypes.size} archetypes for ${castSize} characters`)
    );

    return tests;
  }

  /**
   * Consistency: Internal coherence
   */
  private checkConsistency(
    output: CastDesignOutput,
    context: ScoringContext
  ): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.cast || output.cast.length === 0) {
      return tests;
    }

    // Check culprit eligibility consistency
    const eligibilityTests = this.checkCulpritEligibility(output.cast);
    tests.push(...eligibilityTests);

    // Check relationship reciprocity
    const reciprocityTests = this.checkRelationshipReciprocity(output.cast);
    tests.push(...reciprocityTests);

    return tests;
  }

  /**
   * Check culprit eligibility designation consistency
   */
  private checkCulpritEligibility(cast: CastMember[]): TestResult[] {
    const tests: TestResult[] = [];

    const eligible = cast.filter(c => c.culprit_eligibility === 'eligible');
    const ineligible = cast.filter(c => c.culprit_eligibility === 'ineligible');
    const locked = cast.filter(c => c.culprit_eligibility === 'locked');

    // Should have at least one eligible
    tests.push(
      eligible.length >= 1
        ? pass('Has eligible suspects', 'consistency', 1.0)
        : fail('Has eligible suspects', 'consistency', 1.0, 'No eligible suspects defined', 'critical')
    );

    // Check that locked characters have culpability set
    const lockedWithCulpability = locked.filter(c => exists(c.culpability));
    if (locked.length > 0) {
      tests.push(
        lockedWithCulpability.length === locked.length
          ? pass('Locked characters have culpability', 'consistency', 1.0)
          : partial('Locked characters have culpability', 'consistency', (lockedWithCulpability.length / locked.length) * 100, 1.0, 'Some locked characters missing culpability')
      );
    }

    return tests;
  }

  /**
   * Check relationship reciprocity
   */
  private checkRelationshipReciprocity(cast: CastMember[]): TestResult[] {
    const tests: TestResult[] = [];

    const nameMap = new Map(cast.map(c => [c.name.toLowerCase(), c]));
    let reciprocalRelationships = 0;
    let totalRelationships = 0;

    for (const char of cast) {
      if (!char.relationships) continue;

      for (const rel of char.relationships) {
        totalRelationships++;
        
        // Check if this relationship mentions another cast member
        for (const [name, otherChar] of nameMap) {
          if (char.name.toLowerCase() === name) continue;
          if (rel.toLowerCase().includes(name)) {
            // Check if other character mentions this one
            if (otherChar.relationships?.some(r => 
              r.toLowerCase().includes(char.name.toLowerCase())
            )) {
              reciprocalRelationships++;
            }
          }
        }
      }
    }

    if (totalRelationships > 0) {
      const reciprocityRate = (reciprocalRelationships / totalRelationships) * 100;
      tests.push(
        reciprocityRate >= 30
          ? pass('Relationship reciprocity', 'consistency', 1.0, `${Math.round(reciprocityRate)}% reciprocal`)
          : partial('Relationship reciprocity', 'consistency', Math.max(30, reciprocityRate), 1.0, `Only ${Math.round(reciprocityRate)}% reciprocal`, 'minor')
      );
    }

    return tests;
  }

  /**
   * Calculate letter grade
   */
  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Build failure reason
   */
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
