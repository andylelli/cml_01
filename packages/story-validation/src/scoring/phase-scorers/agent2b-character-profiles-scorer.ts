import { Scorer, PhaseScore, ScoringContext, TestResult } from '../types.js';
import {
  pass,
  fail,
  partial,
  exists,
  hasMinWords,
  calculateCategoryScore,
  getCriticalFailures,
  scoreTextQuality,
} from '../scorer-utils.js';

/**
 * Character profile from Agent 2b
 */
export interface CharacterProfile {
  character_name?: string;
  public_persona?: string;
  private_secrets?: string;
  motive_and_alibi?: string;
  stakes?: string;
  behavioral_tells?: string;
  humour_style?: string;
}

/**
 * Character Profiles input
 */
export interface CharacterProfilesInput {
  cast?: any[];
}

/**
 * Character Profiles output
 */
export interface CharacterProfilesOutput {
  character_profiles: CharacterProfile[];
}

/**
 * Scores the Character Profiles phase (Agent 2b)
 * 
 * Validation: Required fields present, profile structure
 * Quality: Narrative depth, humour style richness
 * Completeness: All cast members have profiles
 * Consistency: Names match cast, no contradictions
 */
export class CharacterProfilesScorer
  implements Scorer<CharacterProfilesInput, CharacterProfilesOutput>
{
  async score(
    input: CharacterProfilesInput,
    output: CharacterProfilesOutput,
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
      agent: 'agent2b-character-profiles',
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

  private validateStructure(output: CharacterProfilesOutput): TestResult[] {
    const tests: TestResult[] = [];

    if (!output || !Array.isArray(output.character_profiles)) {
      tests.push(
        fail(
          'Profiles array exists',
          'validation',
          3.0,
          'Character profiles array is missing',
          'critical'
        )
      );
      return tests;
    }

    tests.push(pass('Profiles array exists', 'validation', 1.0));

    if (output.character_profiles.length === 0) {
      tests.push(
        fail(
          'Profiles not empty',
          'validation',
          3.0,
          'No character profiles generated',
          'critical'
        )
      );
      return tests;
    }

    // Validate each profile
    let validProfiles = 0;
    for (const profile of output.character_profiles) {
      const profileTests = this.validateProfile(profile);
      tests.push(...profileTests);
      if (profileTests.every(t => t.passed)) {
        validProfiles++;
      }
    }

    const validRate = validProfiles / output.character_profiles.length;
    tests.push(
      validRate >= 0.8
        ? pass('Profile validity rate', 'validation', 2.0, `${Math.round(validRate * 100)}% valid`)
        : partial('Profile validity rate', 'validation', validRate * 100, 2.0, `Only ${Math.round(validRate * 100)}% valid`)
    );

    return tests;
  }

  private validateProfile(profile: CharacterProfile): TestResult[] {
    const tests: TestResult[] = [];
    const name = profile.character_name || 'Unknown';

    // Required fields
    const requiredFields: (keyof CharacterProfile)[] = [
      'character_name',
      'public_persona',
      'private_secrets',
      'stakes',
    ];

    for (const field of requiredFields) {
      if (!exists(profile[field])) {
        tests.push(
          fail(
            `${name}: ${field}`,
            'validation',
            0.5,
            `Missing required field: ${field}`,
            'major'
          )
        );
      } else {
        tests.push(pass(`${name}: ${field}`, 'validation', 0.1));
      }
    }

    return tests;
  }

  private assessQuality(output: CharacterProfilesOutput): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.character_profiles || output.character_profiles.length === 0) {
      return tests;
    }

    // Check narrative depth
    let totalDepth = 0;
    for (const profile of output.character_profiles) {
      totalDepth += this.scoreProfileDepth(profile);
    }
    const avgDepth = totalDepth / output.character_profiles.length;

    tests.push(
      avgDepth >= 70
        ? pass('Profile narrative depth', 'quality', 2.0, `Average depth: ${Math.round(avgDepth)}%`)
        : partial('Profile narrative depth', 'quality', avgDepth, 2.0, `Average depth: ${Math.round(avgDepth)}%`)
    );

    // Check humour style presence
    const withHumour = output.character_profiles.filter(
      p => exists(p.humour_style) && p.humour_style!.length > 20
    ).length;

    tests.push(
      withHumour >= output.character_profiles.length * 0.7
        ? pass('Humour style richness', 'quality', 1.0, `${withHumour}/${output.character_profiles.length} profiles`)
        : partial('Humour style richness', 'quality', (withHumour / output.character_profiles.length) * 100, 1.0, `Only ${withHumour}/${output.character_profiles.length} profiles`)
    );

    // Check for distinct personalities
    tests.push(...this.assessPersonalityDistinction(output.character_profiles));

    return tests;
  }

  private scoreProfileDepth(profile: CharacterProfile): number {
    let score = 0;

    // Public persona (4-6 paragraphs ideal)
    if (profile.public_persona) {
      const wordCount = profile.public_persona.split(/\s+/).length;
      if (wordCount >= 150) score += 25;
      else if (wordCount >= 80) score += 15;
      else if (wordCount >= 40) score += 8;
    }

    // Private secrets (detail)
    if (profile.private_secrets) {
      const wordCount = profile.private_secrets.split(/\s+/).length;
      if (wordCount >= 100) score += 25;
      else if (wordCount >= 50) score += 15;
      else if (wordCount >= 25) score += 8;
    }

    // Motive and alibi
    if (profile.motive_and_alibi) {
      const wordCount = profile.motive_and_alibi.split(/\s+/).length;
      if (wordCount >= 80) score += 20;
      else if (wordCount >= 40) score += 12;
      else if (wordCount >= 20) score += 6;
    }

    // Stakes
    if (profile.stakes) {
      const wordCount = profile.stakes.split(/\s+/).length;
      if (wordCount >= 50) score += 15;
      else if (wordCount >= 25) score += 9;
      else if (wordCount >= 10) score += 4;
    }

    // Behavioral tells
    if (exists(profile.behavioral_tells)) score += 10;

    // Humour style
    if (exists(profile.humour_style)) score += 5;

    return Math.min(100, score);
  }

  private assessPersonalityDistinction(profiles: CharacterProfile[]): TestResult[] {
    const tests: TestResult[] = [];

    // Check that personas are distinct (not too similar)
    const personas = profiles.map(p => p.public_persona || '').filter(p => p.length > 0);
    
    if (personas.length >= 2) {
      // Simple check: ensure personas have different key words
      const distinctCount = new Set(
        personas.map(p => p.substring(0, 50).toLowerCase())
      ).size;

      const distinctRate = distinctCount / personas.length;
      tests.push(
        distinctRate >= 0.8
          ? pass('Distinct personalities', 'quality', 1.0, `${Math.round(distinctRate * 100)}% distinct`)
          : partial('Distinct personalities', 'quality', distinctRate * 100, 1.0, `Only ${Math.round(distinctRate * 100)}% distinct`)
      );
    }

    return tests;
  }

  private checkCompleteness(
    output: CharacterProfilesOutput,
    input: CharacterProfilesInput
  ): TestResult[] {
    const tests: TestResult[] = [];

    const profileCount = output.character_profiles?.length || 0;
    const castCount = input.cast?.length || 0;

    // Check that all cast members have profiles
    if (castCount > 0) {
      const coverageRate = Math.min(1, profileCount / castCount);
      tests.push(
        coverageRate >= 0.95
          ? pass('Cast coverage', 'completeness', 2.0, `${profileCount}/${castCount} profiles`)
          : partial('Cast coverage', 'completeness', coverageRate * 100, 2.0, `Only ${profileCount}/${castCount} profiles`, coverageRate < 0.7 ? 'major' : 'minor')
      );
    } else {
      tests.push(
        profileCount >= 4
          ? pass('Minimum profiles', 'completeness', 2.0, `${profileCount} profiles`)
          : partial('Minimum profiles', 'completeness', (profileCount / 4) * 100, 2.0, `Only ${profileCount} profiles`)
      );
    }

    // Check field completeness across all profiles
    let totalFieldScore = 0;
    for (const profile of output.character_profiles) {
      const fields = [
        profile.public_persona,
        profile.private_secrets,
        profile.motive_and_alibi,
        profile.stakes,
        profile.behavioral_tells,
        profile.humour_style,
      ];
      const filledFields = fields.filter(exists).length;
      totalFieldScore += (filledFields / fields.length) * 100;
    }
    const avgFieldCompleteness = profileCount > 0 ? totalFieldScore / profileCount : 0;

    tests.push(
      avgFieldCompleteness >= 80
        ? pass('Field completeness', 'completeness', 1.0, `${Math.round(avgFieldCompleteness)}% fields filled`)
        : partial('Field completeness', 'completeness', avgFieldCompleteness, 1.0, `Only ${Math.round(avgFieldCompleteness)}% fields filled`)
    );

    return tests;
  }

  private checkConsistency(
    output: CharacterProfilesOutput,
    context: ScoringContext
  ): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.character_profiles || output.character_profiles.length === 0) {
      return tests;
    }

    // Check for duplicate names
    const names = output.character_profiles.map(p => p.character_name).filter(exists);
    const uniqueNames = new Set(names);

    tests.push(
      uniqueNames.size === names.length
        ? pass('No duplicate names', 'consistency', 1.0)
        : fail('No duplicate names', 'consistency', 1.0, `${names.length - uniqueNames.size} duplicate(s)`, 'major')
    );

    // Check that profiles reference cast if available
    if (context.previous_phases && context.cml) {
      const cast = (context.cml as any)?.CASE?.cast || [];
      const castNames = cast.map((c: any) => c.name?.toLowerCase()).filter((n: string) => n);
      
      let matchingNames = 0;
      for (const profile of output.character_profiles) {
        const profileName = (profile.character_name || '').toLowerCase();
        if (castNames.some((cn: string) => profileName.includes(cn) || cn.includes(profileName))) {
          matchingNames++;
        }
      }

      if (castNames.length > 0) {
        const matchRate = matchingNames / output.character_profiles.length;
        tests.push(
          matchRate >= 0.8
            ? pass('Names match cast', 'consistency', 1.0, `${Math.round(matchRate * 100)}% match`)
            : partial('Names match cast', 'consistency', matchRate * 100, 1.0, `Only ${Math.round(matchRate * 100)}% match`)
        );
      }
    }

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
