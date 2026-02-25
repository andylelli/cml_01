import { Scorer, PhaseScore, ScoringContext, TestResult } from '../types.js';
import {
  createTest,
  pass,
  fail,
  partial,
  exists,
  hasMinWords,
  validateSchema,
  calculateCategoryScore,
  scoreTextQuality,
  getCriticalFailures,
  TestCategory,
} from '../scorer-utils.js';

/**
 * Background Context input (from Agent 2e)
 */
export interface BackgroundContextInput {
  era_background?: {
    decade?: string;
    tech_capabilities?: string[];
    forensic_capabilities?: string[];
    communications?: string[];
    transportation?: string[];
    social_norms?: string[];
  };
  location_background?: {
    location_type?: string;
    physical_constraints?: string[];
    security_features?: string[];
    accessibility?: string[];
    atmosphere?: string[];
  };
  constraints?: {
    prohibited_anachronisms?: string[];
    required_period_elements?: string[];
  };
}

/**
 * Background Context output (validated artifact)
 */
export type BackgroundContextOutput = BackgroundContextInput;

/**
 * Scores the Background Context generation phase (Agent 2e)
 * 
 * Validation: Schema compliance, required fields
 * Quality: Detail richness, historical accuracy indicators
 * Completeness: Coverage of era and location aspects
 * Consistency: Internal coherence between era/location
 */
export class BackgroundContextScorer
  implements Scorer<BackgroundContextInput, BackgroundContextOutput>
{
  async score(
    input: BackgroundContextInput,
    output: BackgroundContextOutput,
    context: ScoringContext
  ): Promise<PhaseScore> {
    const tests: TestResult[] = [];

    // VALIDATION TESTS (40% weight)
    tests.push(...this.validateStructure(output));

    // QUALITY TESTS (30% weight)
    tests.push(...this.assessQuality(output));

    // COMPLETENESS TESTS (20% weight)
    tests.push(...this.checkCompleteness(output));

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

    // Determine pass/fail and reasons
    const criticalFailures = getCriticalFailures(tests);
    const passed = criticalFailures.length === 0 && total >= 60;
    
    const component_failures: string[] = [];
    if (validation_score < 60) component_failures.push('validation');
    if (quality_score < 50) component_failures.push('quality');
    if (completeness_score < 60) component_failures.push('completeness');
    if (consistency_score < 50) component_failures.push('consistency');

    return {
      agent: 'agent2e-background',
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
  private validateStructure(output: BackgroundContextOutput): TestResult[] {
    const tests: TestResult[] = [];

    // Check top-level structure
    if (!output) {
      tests.push(
        fail(
          'Output exists',
          'validation',
          2.0,
          'Background context output is null or undefined',
          'critical'
        )
      );
      return tests;
    }

    // Era background required fields
    if (output.era_background) {
      const era = output.era_background;
      tests.push(
        exists(era.decade)
          ? pass('Era decade present', 'validation', 1.0)
          : fail('Era decade present', 'validation', 1.0, 'Decade is required', 'major')
      );
      tests.push(
        exists(era.tech_capabilities)
          ? pass('Tech capabilities present', 'validation', 1.0)
          : fail('Tech capabilities present', 'validation', 1.0, 'Tech capabilities required', 'major')
      );
      tests.push(
        exists(era.forensic_capabilities)
          ? pass('Forensic capabilities present', 'validation', 1.0)
          : fail('Forensic capabilities present', 'validation', 1.0, 'Forensic capabilities required', 'major')
      );
    } else {
      tests.push(
        fail(
          'Era background exists',
          'validation',
          2.0,
          'Era background section is missing',
          'critical'
        )
      );
    }

    // Location background required fields
    if (output.location_background) {
      const loc = output.location_background;
      tests.push(
        exists(loc.location_type)
          ? pass('Location type present', 'validation', 1.0)
          : fail('Location type present', 'validation', 1.0, 'Location type required', 'major')
      );
      tests.push(
        exists(loc.physical_constraints)
          ? pass('Physical constraints present', 'validation', 1.0)
          : fail('Physical constraints present', 'validation', 1.0, 'Physical constraints required', 'major')
      );
    } else {
      tests.push(
        fail(
          'Location background exists',
          'validation',
          2.0,
          'Location background section is missing',
          'critical'
        )
      );
    }

    // Constraints section
    if (output.constraints) {
      tests.push(pass('Constraints section present', 'validation', 0.5));
    } else {
      tests.push(
        partial(
          'Constraints section present',
          'validation',
          50,
          0.5,
          'Constraints section recommended but not critical',
          'minor'
        )
      );
    }

    return tests;
  }

  /**
   * Quality: Detail richness and thoroughness
   */
  private assessQuality(output: BackgroundContextOutput): TestResult[] {
    const tests: TestResult[] = [];

    // Era background quality
    if (output.era_background) {
      const era = output.era_background;
      
      // Check array sizes for richness
      const techCount = era.tech_capabilities?.length || 0;
      const forensicCount = era.forensic_capabilities?.length || 0;
      const commsCount = era.communications?.length || 0;
      const transportCount = era.transportation?.length || 0;
      const socialCount = era.social_norms?.length || 0;

      tests.push(
        techCount >= 3
          ? pass('Tech capabilities detailed', 'quality', 1.0, `${techCount} items`)
          : partial('Tech capabilities detailed', 'quality', Math.min(100, techCount * 33), 1.0, `Only ${techCount} items`)
      );

      tests.push(
        forensicCount >= 3
          ? pass('Forensic capabilities detailed', 'quality', 1.0, `${forensicCount} items`)
          : partial('Forensic capabilities detailed', 'quality', Math.min(100, forensicCount * 33), 1.0, `Only ${forensicCount} items`)
      );

      tests.push(
        commsCount >= 2
          ? pass('Communications detailed', 'quality', 1.0, `${commsCount} items`)
          : partial('Communications detailed', 'quality', Math.min(100, commsCount * 50), 1.0, `Only ${commsCount} items`)
      );

      tests.push(
        transportCount >= 2
          ? pass('Transportation detailed', 'quality', 1.0, `${transportCount} items`)
          : partial('Transportation detailed', 'quality', Math.min(100, transportCount * 50), 1.0, `Only ${transportCount} items`)
      );

      tests.push(
        socialCount >= 2
          ? pass('Social norms detailed', 'quality', 1.0, `${socialCount} items`)
          : partial('Social norms detailed', 'quality', Math.min(100, socialCount * 50), 1.0, `Only ${socialCount} items`)
      );
    }

    // Location background quality
    if (output.location_background) {
      const loc = output.location_background;
      
      const constraintsCount = loc.physical_constraints?.length || 0;
      const securityCount = loc.security_features?.length || 0;
      const accessCount = loc.accessibility?.length || 0;
      const atmosphereCount = loc.atmosphere?.length || 0;

      tests.push(
        constraintsCount >= 3
          ? pass('Physical constraints detailed', 'quality', 1.0, `${constraintsCount} items`)
          : partial('Physical constraints detailed', 'quality', Math.min(100, constraintsCount * 33), 1.0, `Only ${constraintsCount} items`)
      );

      tests.push(
        securityCount >= 2
          ? pass('Security features detailed', 'quality', 1.0, `${securityCount} items`)
          : partial('Security features detailed', 'quality', Math.min(100, securityCount * 50), 1.0, `Only ${securityCount} items`)
      );

      tests.push(
        accessCount >= 2
          ? pass('Accessibility detailed', 'quality', 1.0, `${accessCount} items`)
          : partial('Accessibility detailed', 'quality', Math.min(100, accessCount * 50), 1.0, `Only ${accessCount} items`)
      );

      tests.push(
        atmosphereCount >= 2
          ? pass('Atmosphere detailed', 'quality', 1.0, `${atmosphereCount} items`)
          : partial('Atmosphere detailed', 'quality', Math.min(100, atmosphereCount * 50), 1.0, `Only ${atmosphereCount} items`)
      );
    }

    return tests;
  }

  /**
   * Completeness: Coverage of all expected aspects
   */
  private checkCompleteness(output: BackgroundContextOutput): TestResult[] {
    const tests: TestResult[] = [];

    // Era background completeness
    const eraScore = output.era_background
      ? this.scoreEraCompleteness(output.era_background)
      : 0;
    tests.push(
      createTest(
        'Era background complete',
        'completeness',
        eraScore >= 70,
        eraScore,
        2.0,
        `Era completeness: ${eraScore}%`
      )
    );

    // Location background completeness
    const locScore = output.location_background
      ? this.scoreLocationCompleteness(output.location_background)
      : 0;
    tests.push(
      createTest(
        'Location background complete',
        'completeness',
        locScore >= 70,
        locScore,
        2.0,
        `Location completeness: ${locScore}%`
      )
    );

    // Constraints completeness (optional but good to have)
    if (output.constraints) {
      const hasProhibited = (output.constraints.prohibited_anachronisms?.length || 0) > 0;
      const hasRequired = (output.constraints.required_period_elements?.length || 0) > 0;
      
      const constraintsScore = (hasProhibited ? 50 : 0) + (hasRequired ? 50 : 0);
      tests.push(
        createTest(
          'Constraints defined',
          'completeness',
          constraintsScore >= 50,
          constraintsScore,
          1.0,
          `Constraints completeness: ${constraintsScore}%`
        )
      );
    } else {
      tests.push(
        partial(
          'Constraints defined',
          'completeness',
          30,
          1.0,
          'Constraints section missing (optional)'
        )
      );
    }

    return tests;
  }

  /**
   * Score era background completeness (0-100)
   */
  private scoreEraCompleteness(era: NonNullable<BackgroundContextOutput['era_background']>): number {
    let score = 0;
    let maxScore = 0;

    // Decade (required)
    maxScore += 20;
    if (exists(era.decade)) score += 20;

    // Tech capabilities (required)
    maxScore += 20;
    if ((era.tech_capabilities?.length || 0) >= 3) score += 20;
    else score += (era.tech_capabilities?.length || 0) * 6;

    // Forensic capabilities (required)
    maxScore += 20;
    if ((era.forensic_capabilities?.length || 0) >= 3) score += 20;
    else score += (era.forensic_capabilities?.length || 0) * 6;

    // Communications (important)
    maxScore += 15;
    if ((era.communications?.length || 0) >= 2) score += 15;
    else score += (era.communications?.length || 0) * 7;

    // Transportation (important)
    maxScore += 15;
    if ((era.transportation?.length || 0) >= 2) score += 15;
    else score += (era.transportation?.length || 0) * 7;

    // Social norms (nice to have)
    maxScore += 10;
    if ((era.social_norms?.length || 0) >= 2) score += 10;
    else score += (era.social_norms?.length || 0) * 5;

    return Math.round((score / maxScore) * 100);
  }

  /**
   * Score location background completeness (0-100)
   */
  private scoreLocationCompleteness(loc: NonNullable<BackgroundContextOutput['location_background']>): number {
    let score = 0;
    let maxScore = 0;

    // Location type (required)
    maxScore += 25;
    if (exists(loc.location_type)) score += 25;

    // Physical constraints (required)
    maxScore += 25;
    if ((loc.physical_constraints?.length || 0) >= 3) score += 25;
    else score += (loc.physical_constraints?.length || 0) * 8;

    // Security features (important)
    maxScore += 20;
    if ((loc.security_features?.length || 0) >= 2) score += 20;
    else score += (loc.security_features?.length || 0) * 10;

    // Accessibility (important)
    maxScore += 15;
    if ((loc.accessibility?.length || 0) >= 2) score += 15;
    else score += (loc.accessibility?.length || 0) * 7;

    // Atmosphere (nice to have)
    maxScore += 15;
    if ((loc.atmosphere?.length || 0) >= 2) score += 15;
    else score += (loc.atmosphere?.length || 0) * 7;

    return Math.round((score / maxScore) * 100);
  }

  /**
   * Consistency: Internal coherence
   */
  private checkConsistency(
    output: BackgroundContextOutput,
    context: ScoringContext
  ): TestResult[] {
    const tests: TestResult[] = [];

    // Check that era and location are mutually compatible
    // (This is a simple check - could be more sophisticated)
    if (output.era_background && output.location_background) {
      tests.push(
        pass(
          'Era/Location compatibility',
          'consistency',
          1.0,
          'Era and location background both present'
        )
      );
    } else {
      tests.push(
        fail(
          'Era/Location compatibility',
          'consistency',
          1.0,
          'Missing era or location background',
          'major'
        )
      );
    }

    // Check that constraints align with capabilities
    if (output.constraints && output.era_background) {
      const anachronisms = output.constraints.prohibited_anachronisms || [];
      const techCapabilities = output.era_background.tech_capabilities || [];
      
      // Simple check: ensure prohibited items aren't in capabilities
      const conflicts = anachronisms.filter(item =>
        techCapabilities.some(tech => tech.toLowerCase().includes(item.toLowerCase()))
      );
      
      if (conflicts.length > 0) {
        tests.push(
          fail(
            'Constraint/Capability consistency',
            'consistency',
            1.0,
            `Anachronisms found in capabilities: ${conflicts.join(', ')}`,
            'major'
          )
        );
      } else {
        tests.push(
          pass(
            'Constraint/Capability consistency',
            'consistency',
            1.0,
            'No anachronism conflicts detected'
          )
        );
      }
    }

    return tests;
  }

  /**
   * Calculate letter grade from numeric score
   */
  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Build failure reason message
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
