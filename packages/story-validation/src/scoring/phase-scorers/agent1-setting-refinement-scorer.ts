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
 * Setting refinement from Agent 1
 */
export interface SettingRefinementOutput {
  locations?: {
    name?: string;
    layout?: string;
    key_features?: string[];
    clue_placements?: Array<{
      clue_id?: string;
      location?: string;
      physical_justification?: string;
    }>;
  }[];
  physical_constraints?: string;
  accessibility_notes?: string;
}

/**
 * Scores the Setting Refinement phase (Agent 1)
 * 
 * Validation: Location layout structure
 * Quality: Physical plausibility, detail richness
 * Completeness: All locations from profiles covered
 * Consistency: Clue placements logically justified
 */
export class SettingRefinementScorer
  implements Scorer<any, SettingRefinementOutput>
{
  async score(
    input: any,
    output: SettingRefinementOutput,
    context: ScoringContext
  ): Promise<PhaseScore> {
    const tests: TestResult[] = [];

    // VALIDATION TESTS (40% weight)
    tests.push(...this.validateStructure(output));

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
      agent: 'agent1-setting-refinement',
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

  private validateStructure(output: SettingRefinementOutput): TestResult[] {
    const tests: TestResult[] = [];

    if (!output) {
      tests.push(
        fail(
          'Output exists',
          'validation',
          3.0,
          'Setting refinement output is missing',
          'critical'
        )
      );
      return tests;
    }

    if (!Array.isArray(output.locations)) {
      tests.push(
        fail(
          'Locations array exists',
          'validation',
          2.0,
          'Locations array is missing',
          'critical'
        )
      );
      return tests;
    }

    tests.push(pass('Locations array exists', 'validation', 0.5));

    if (output.locations.length === 0) {
      tests.push(
        fail(
          'Locations not empty',
          'validation',
          2.0,
          'No locations defined',
          'critical'
        )
      );
      return tests;
    }

    // Validate each location
    let validLocations = 0;
    for (const location of output.locations) {
      if (this.isValidLocation(location)) {
        validLocations++;
      }
    }

    const validRate = validLocations / output.locations.length;
    tests.push(
      validRate >= 0.8
        ? pass('Location validity', 'validation', 2.0, `${Math.round(validRate * 100)}% valid`)
        : partial('Location validity', 'validation', validRate * 100, 2.0, `Only ${Math.round(validRate * 100)}% valid`)
    );

    return tests;
  }

  private isValidLocation(location: any): boolean {
    return (
      exists(location.name) &&
      exists(location.layout) &&
      Array.isArray(location.key_features) &&
      location.key_features.length > 0
    );
  }

  private assessQuality(output: SettingRefinementOutput): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.locations || output.locations.length === 0) {
      return tests;
    }

    // Check physical plausibility
    let plausibleLocations = 0;
    for (const location of output.locations) {
      if (this.isPhysicallyPlausible(location)) {
        plausibleLocations++;
      }
    }

    tests.push(
      plausibleLocations >= output.locations.length * 0.8
        ? pass('Physical plausibility', 'quality', 1.5, `${plausibleLocations}/${output.locations.length} plausible`)
        : partial('Physical plausibility', 'quality', (plausibleLocations / output.locations.length) * 100, 1.5, `Only ${plausibleLocations}/${output.locations.length} plausible`)
    );

    // Check layout detail richness
    let totalLayoutQuality = 0;
    for (const location of output.locations) {
      totalLayoutQuality += this.scoreLayoutDetail(location);
    }
    const avgLayoutQuality = totalLayoutQuality / output.locations.length;

    tests.push(
      avgLayoutQuality >= 70
        ? pass('Layout detail', 'quality', 1.0, `${Math.round(avgLayoutQuality)}% average`)
        : partial('Layout detail', 'quality', avgLayoutQuality, 1.0, `${Math.round(avgLayoutQuality)}% average`)
    );

    // Check clue placement justification quality
    const cluePlacements = output.locations.flatMap(l => l.clue_placements || []);
    let wellJustified = 0;
    for (const placement of cluePlacements) {
      if (placement.physical_justification && placement.physical_justification.length >= 30) {
        wellJustified++;
      }
    }

    if (cluePlacements.length > 0) {
      tests.push(
        wellJustified >= cluePlacements.length * 0.7
          ? pass('Clue justification quality', 'quality', 0.5, `${wellJustified}/${cluePlacements.length} well justified`)
          : partial('Clue justification quality', 'quality', (wellJustified / cluePlacements.length) * 100, 0.5, `Only ${wellJustified}/${cluePlacements.length} well justified`)
      );
    }

    return tests;
  }

  private isPhysicallyPlausible(location: any): boolean {
    if (!location.layout) return false;

    const layout = location.layout.toLowerCase();

    // Look for spatial markers (indicates thought about physical space)
    const spatialMarkers = [
      /north|south|east|west/i,
      /left|right|center|middle/i,
      /adjacent|next to|beside|near/i,
      /above|below|upstairs|downstairs/i,
      /front|back|rear/i,
      /entrance|exit|door|window/i,
    ];

    const matchedMarkers = spatialMarkers.filter(m => m.test(layout)).length;

    // Also check for measurements or dimensions
    const hasMeasurements = /\d+\s*(feet|foot|ft|meters|m|yards|yd)/i.test(layout);

    return matchedMarkers >= 2 || hasMeasurements;
  }

  private scoreLayoutDetail(location: any): number {
    let score = 0;

    // Layout description length
    if (location.layout) {
      const wordCount = location.layout.split(/\s+/).length;
      if (wordCount >= 100) score += 40;
      else if (wordCount >= 50) score += 25;
      else if (wordCount >= 20) score += 15;
    }

    // Key features count and detail
    if (location.key_features && Array.isArray(location.key_features)) {
      const featureCount = location.key_features.length;
      if (featureCount >= 5) score += 30;
      else if (featureCount >= 3) score += 20;
      else if (featureCount >= 1) score += 10;

      // Check feature detail (not just one-word items)
      const detailedFeatures = location.key_features.filter(
        (f: string) => f.split(/\s+/).length >= 3
      ).length;
      if (detailedFeatures >= 3) score += 20;
      else if (detailedFeatures >= 1) score += 10;
    }

    // Clue placements presence
    if (location.clue_placements && location.clue_placements.length > 0) {
      score += 10;
    }

    return Math.min(100, score);
  }

  private checkCompleteness(
    output: SettingRefinementOutput,
    context: ScoringContext
  ): TestResult[] {
    const tests: TestResult[] = [];

    // Check that key locations from location profiles are covered
    if (context.previous_phases && context.previous_phases.agent2c_location_profiles) {
      const profiles = (context.previous_phases.agent2c_location_profiles as any)?.location_profiles || [];
      const profileNames = profiles.map((p: any) => p.location_name?.toLowerCase()).filter((n: string | undefined): n is string => !!n);
      const refinementNames = output.locations?.map(l => l.name?.toLowerCase()).filter((n: string | undefined): n is string => !!n) || [];

      let coveredProfiles = 0;
      for (const profileName of profileNames) {
        if (refinementNames.some(rn => rn.includes(profileName) || profileName.includes(rn))) {
          coveredProfiles++;
        }
      }

      if (profileNames.length > 0) {
        const coverageRate = coveredProfiles / profileNames.length;
        tests.push(
          coverageRate >= 0.8
            ? pass('Location coverage', 'completeness', 1.5, `${coveredProfiles}/${profileNames.length} profiles`)
            : partial('Location coverage', 'completeness', coverageRate * 100, 1.5, `Only ${coveredProfiles}/${profileNames.length} profiles`, 'major')
        );
      }
    } else {
      // If no profiles, check minimum location count
      const locationCount = output.locations?.length || 0;
      tests.push(
        locationCount >= 3
          ? pass('Minimum locations', 'completeness', 1.5, `${locationCount} locations`)
          : partial('Minimum locations', 'completeness', (locationCount / 3) * 100, 1.5, `Only ${locationCount} locations`)
      );
    }

    // Check that physical constraints and accessibility are defined
    tests.push(
      exists(output.physical_constraints)
        ? pass('Physical constraints', 'completeness', 0.75)
        : fail('Physical constraints', 'completeness', 0.75, 'Missing physical constraints', 'minor')
    );

    tests.push(
      exists(output.accessibility_notes)
        ? pass('Accessibility notes', 'completeness', 0.75)
        : fail('Accessibility notes', 'completeness', 0.75, 'Missing accessibility notes', 'minor')
    );

    return tests;
  }

  private checkConsistency(
    output: SettingRefinementOutput,
    context: ScoringContext
  ): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.locations || output.locations.length === 0) {
      return tests;
    }

    // Check that clue placements reference valid clues from CML
    if (context.cml) {
      const cmlClues = this.extractCMLClues(context.cml);
      const placementClues = output.locations
        .flatMap(l => l.clue_placements || [])
        .map(cp => cp.clue_id)
        .filter((id): id is string => exists(id));

      let validPlacements = 0;
      for (const placementClue of placementClues) {
        if (this.clueInCML(placementClue, cmlClues)) {
          validPlacements++;
        }
      }

      if (placementClues.length > 0) {
        const validRate = validPlacements / placementClues.length;
        tests.push(
          validRate >= 0.8
            ? pass('Clue placement validity', 'consistency', 1.5, `${Math.round(validRate * 100)}% valid`)
            : partial('Clue placement validity', 'consistency', validRate * 100, 1.5, `Only ${Math.round(validRate * 100)}% valid`)
        );
      }
    }

    // Check for duplicate location names
    const locationNames = output.locations.map(l => l.name).filter((name): name is string => exists(name));
    const uniqueNames = new Set(locationNames.map(n => n.toLowerCase()));

    tests.push(
      uniqueNames.size === locationNames.length
        ? pass('No duplicate locations', 'consistency', 0.5)
        : fail('No duplicate locations', 'consistency', 0.5, `${locationNames.length - uniqueNames.size} duplicate(s)`, 'minor')
    );

    return tests;
  }

  private extractCMLClues(cml: any): string[] {
    const clues: string[] = [];

    // Extract from hard logic devices
    if (cml.CASE?.hard_logic_devices) {
      for (const device of cml.CASE.hard_logic_devices) {
        if (device.clue_id) {
          clues.push(device.clue_id);
        }
      }
    }

    return clues;
  }

  private clueInCML(placementClue: string, cmlClues: string[]): boolean {
    const normalized = placementClue.toLowerCase().trim();
    return cmlClues.some(cc => cc.toLowerCase().trim().includes(normalized) || normalized.includes(cc.toLowerCase().trim()));
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
