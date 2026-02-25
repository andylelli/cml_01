import { Scorer, PhaseScore, ScoringContext, TestResult } from '../types.js';
import {
  pass,
  fail,
  partial,
  exists,
  hasMinLength,
  calculateCategoryScore,
  getCriticalFailures,
} from '../scorer-utils.js';

/**
 * Hard Logic Device from CML
 */
export interface HardLogicDevice {
  id: string;
  name?: string;
  type?: string;
  description?: string;
  why_necessary?: string;
  implications?: string[];
  red_herring_potential?: string;
}

/**
 * Hard Logic input
 */
export interface HardLogicInput {
  cast?: any[];
  crime_type?: string;
}

/**
 * Hard Logic output (CML hard logic devices)
 */
export interface HardLogicOutput {
  hard_logic_devices: HardLogicDevice[];
}

/**
 * Scores the Hard Logic Devices phase (Agent 3b/4)
 * 
 * Validation: Schema compliance, device structure
 * Quality: Logic soundness, necessity justification
 * Completeness: Sufficient devices for mystery complexity
 * Consistency: Non-contradictory devices, clear implications
 */
export class HardLogicScorer
  implements Scorer<HardLogicInput, HardLogicOutput>
{
  async score(
    input: HardLogicInput,
    output: HardLogicOutput,
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
      agent: 'agent4-hard-logic',
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
   * Validation: Schema structure
   */
  private validateStructure(output: HardLogicOutput): TestResult[] {
    const tests: TestResult[] = [];

    // Check devices array exists
    if (!output || !Array.isArray(output.hard_logic_devices)) {
      tests.push(
        fail(
          'Devices array exists',
          'validation',
          3.0,
          'Hard logic devices array is missing or not an array',
          'critical'
        )
      );
      return tests;
    }

    tests.push(pass('Devices array exists', 'validation', 1.0));

    // Validate each device
    let validDevices = 0;
    for (const device of output.hard_logic_devices) {
      const deviceTests = this.validateDevice(device);
      tests.push(...deviceTests);
      if (deviceTests.every(t => t.passed)) {
        validDevices++;
      }
    }

    // Check validity rate
    if (output.hard_logic_devices.length > 0) {
      const validRate = validDevices / output.hard_logic_devices.length;
      tests.push(
        validRate >= 0.8
          ? pass('Device validity rate', 'validation', 2.0, `${Math.round(validRate * 100)}% valid`)
          : partial('Device validity rate', 'validation', validRate * 100, 2.0, `Only ${Math.round(validRate * 100)}% valid`)
      );
    }

    return tests;
  }

  /**
   * Validate individual device
   */
  private validateDevice(device: HardLogicDevice): TestResult[] {
    const tests: TestResult[] = [];
    const deviceId = device.id || 'Unknown';

    // Required fields
    if (!exists(device.id)) {
      tests.push(
        fail(
          `${deviceId}: has ID`,
          'validation',
          0.5,
          'Device missing ID',
          'major'
        )
      );
    } else {
      tests.push(pass(`${deviceId}: has ID`, 'validation', 0.1));
    }

    if (!exists(device.type)) {
      tests.push(
        fail(
          `${deviceId}: has type`,
          'validation',
          0.5,
          'Device missing type',
          'major'
        )
      );
    } else {
      tests.push(pass(`${deviceId}: has type`, 'validation', 0.1));
    }

    if (!exists(device.why_necessary)) {
      tests.push(
        fail(
          `${deviceId}: has justification`,
          'validation',
          0.5,
          'Device missing why_necessary field',
          'major'
        )
      );
    } else {
      tests.push(pass(`${deviceId}: has justification`, 'validation', 0.1));
    }

    return tests;
  }

  /**
   * Quality: Logic soundness
   */
  private assessQuality(output: HardLogicOutput): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.hard_logic_devices || output.hard_logic_devices.length === 0) {
      return tests;
    }

    // Check device depth across all devices
    let totalDepth = 0;
    for (const device of output.hard_logic_devices) {
      totalDepth += this.scoreDeviceDepth(device);
    }
    const avgDepth = totalDepth / output.hard_logic_devices.length;

    tests.push(
      avgDepth >= 70
        ? pass('Device detail quality', 'quality', 2.0, `Average depth: ${Math.round(avgDepth)}%`)
        : partial('Device detail quality', 'quality', avgDepth, 2.0, `Average depth: ${Math.round(avgDepth)}%`)
    );

    // Check that devices have implications
    const withImplications = output.hard_logic_devices.filter(
      d => d.implications && d.implications.length > 0
    ).length;

    tests.push(
      withImplications >= output.hard_logic_devices.length * 0.7
        ? pass('Devices have implications', 'quality', 1.0, `${withImplications}/${output.hard_logic_devices.length} devices`)
        : partial('Devices have implications', 'quality', (withImplications / output.hard_logic_devices.length) * 100, 1.0, `Only ${withImplications}/${output.hard_logic_devices.length} devices`)
    );

    return tests;
  }

  /**
   * Score individual device depth (0-100)
   */
  private scoreDeviceDepth(device: HardLogicDevice): number {
    let score = 0;

    // Has ID
    if (exists(device.id)) score += 10;

    // Has type
    if (exists(device.type)) score += 10;

    // Has name
    if (exists(device.name)) score += 10;

    // Has description (should be detailed)
    if (device.description && device.description.length > 30) score += 20;
    else if (exists(device.description)) score += 10;

    // Has why_necessary (should be detailed)
    if (device.why_necessary && device.why_necessary.length > 30) score += 20;
    else if (exists(device.why_necessary)) score += 10;

    // Has implications
    if ((device.implications?.length || 0) >= 2) score += 15;
    else if ((device.implications?.length || 0) >= 1) score += 7;

    // Has red herring potential
    if (exists(device.red_herring_potential)) score += 15;

    return Math.min(100, score);
  }

  /**
   * Completeness: Sufficient devices
   */
  private checkCompleteness(
    output: HardLogicOutput,
    input: HardLogicInput
  ): TestResult[] {
    const tests: TestResult[] = [];

    const deviceCount = output.hard_logic_devices?.length || 0;

    // Mysteries typically need 2-5 hard logic devices
    tests.push(
      deviceCount >= 2
        ? pass('Minimum devices present', 'completeness', 2.0, `${deviceCount} devices`)
        : deviceCount >= 1
        ? partial('Minimum devices present', 'completeness', 50, 2.0, `Only ${deviceCount} device`, 'minor')
        : fail('Minimum devices present', 'completeness', 2.0, 'No hard logic devices', 'critical')
    );

    // Check device type diversity
    const types = new Set(
      output.hard_logic_devices.map(d => d.type).filter(exists)
    );

    tests.push(
      types.size >= Math.min(deviceCount, 3)
        ? pass('Device type diversity', 'completeness', 1.0, `${types.size} unique types`)
        : partial('Device type diversity', 'completeness', (types.size / deviceCount) * 100, 1.0, `Only ${types.size} types`)
    );

    return tests;
  }

  /**
   * Consistency: Non-contradictory logic
   */
  private checkConsistency(
    output: HardLogicOutput,
    context: ScoringContext
  ): TestResult[] {
    const tests: TestResult[] = [];

    if (!output.hard_logic_devices || output.hard_logic_devices.length === 0) {
      return tests;
    }

    // Check for duplicate IDs
    const ids = output.hard_logic_devices.map(d => d.id).filter(exists);
    const uniqueIds = new Set(ids);

    tests.push(
      uniqueIds.size === ids.length
        ? pass('No duplicate device IDs', 'consistency', 1.0)
        : fail('No duplicate device IDs', 'consistency', 1.0, `${ids.length - uniqueIds.size} duplicate(s)`, 'major')
    );

    // Check that implications are meaningful (not empty strings)
    let meaningfulImplications = 0;
    let totalImplications = 0;

    for (const device of output.hard_logic_devices) {
      if (!device.implications) continue;
      for (const impl of device.implications) {
        totalImplications++;
        if (impl && impl.trim().length > 10) {
          meaningfulImplications++;
        }
      }
    }

    if (totalImplications > 0) {
      const meaningfulRate = meaningfulImplications / totalImplications;
      tests.push(
        meaningfulRate >= 0.8
          ? pass('Implications are meaningful', 'consistency', 1.0)
          : partial('Implications are meaningful', 'consistency', meaningfulRate * 100, 1.0, `Only ${Math.round(meaningfulRate * 100)}% meaningful`)
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
