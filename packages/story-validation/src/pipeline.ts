/**
 * Story Validation Pipeline
 * Coordinates all validators and provides comprehensive quality checking
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError, ProseConsistencyReport } from './types.js';
import type { AzureOpenAIClient, LogContext } from '@cml/llm-client';
import { EncodingValidator } from './encoding-validator.js';
import { CharacterConsistencyValidator } from './character-validator.js';
import { PhysicalPlausibilityValidator } from './physical-validator.js';
import { EraAuthenticityValidator } from './era-validator.js';
import { NarrativeContinuityValidator } from './narrative-continuity-validator.js';
import { CaseTransitionValidator } from './case-transition-validator.js';
import { DiscriminatingTestValidator } from './discriminating-test-validator.js';
import { SuspectClosureValidator } from './suspect-closure-validator.js';
import { ProseConsistencyValidator } from './prose-consistency-validator.js';

export interface ValidationReport {
  status: 'passed' | 'needs_review' | 'needs_revision' | 'failed';
  summary: {
    totalIssues: number;
    critical: number;
    major: number;
    moderate: number;
    minor: number;
  };
  errors: ValidationError[];
  canProceed: boolean;
  recommendations: string[];
  consistencyReport?: ProseConsistencyReport;
}

export class StoryValidationPipeline {
  private validators: Validator[];

  constructor(llmClient?: AzureOpenAIClient, logContext?: LogContext) {
    this.validators = [
      new EncodingValidator(),
      new CharacterConsistencyValidator(),
      new ProseConsistencyValidator(),
      new NarrativeContinuityValidator(),
      new CaseTransitionValidator(),
      new DiscriminatingTestValidator(llmClient, logContext),
      new SuspectClosureValidator(llmClient, logContext),
      new PhysicalPlausibilityValidator(),
      new EraAuthenticityValidator()
    ];
  }

  async validate(story: Story, cml?: CMLData): Promise<ValidationReport> {
    const allErrors: ValidationError[] = [];

    for (const validator of this.validators) {
      try {
        const result = await validator.validate(story, cml);
        allErrors.push(...result.errors);

        // Stop on critical errors from character/encoding validators
        if (result.errors.some(e => e.severity === 'critical') && 
            (validator.name === 'CharacterConsistencyValidator')) {
          return this.generateReport(allErrors, cml, validator.name);
        }
      } catch (error) {
        console.error(`Validator ${validator.name} failed:`, error);
      }
    }

    return this.generateReport(allErrors, cml);
  }

  private generateReport(errors: ValidationError[], cml?: CMLData, failedAt?: string): ValidationReport {
    const summary = {
      totalIssues: errors.length,
      critical: errors.filter(e => e.severity === 'critical').length,
      major: errors.filter(e => e.severity === 'major').length,
      moderate: errors.filter(e => e.severity === 'moderate').length,
      minor: errors.filter(e => e.severity === 'minor').length
    };

    const status = this.determineStatus(summary);
    const recommendations = this.generateRecommendations(errors);

    return {
      status,
      summary,
      errors,
      canProceed: status !== 'failed',
      recommendations,
      consistencyReport: this.buildConsistencyReport(errors, cml),
    };
  }

  private buildConsistencyReport(errors: ValidationError[], cml?: CMLData): ProseConsistencyReport {
    const lockedFactsChecked = cml?.lockedFacts?.length ?? 0;
    const lockedFactsViolations = errors.filter(e =>
      e.type === 'locked_fact_contradicted' || e.type === 'locked_fact_missing_value'
    ).length;
    const pronounDriftViolations = errors.filter(e => e.type === 'pronoun_drift').length;
    const openingStyleViolations = errors.filter(e => e.type === 'opening_style_repetition').length;
    const contextLeakageViolations = errors.filter(e =>
      e.type === 'context_leakage' || e.type === 'context_leakage_suspected'
    ).length;

    const criticalOrMajor = errors.filter(e => e.severity === 'critical' || e.severity === 'major').length;
    const overallStatus: ProseConsistencyReport['overallStatus'] =
      criticalOrMajor > 0 ? 'fail' :
      errors.filter(e => e.severity === 'moderate').length > 0 ? 'needs_review' :
      'pass';

    return {
      lockedFactsChecked,
      lockedFactsViolations,
      pronounDriftViolations,
      openingStyleViolations,
      contextLeakageViolations,
      overallStatus,
    };
  }

  private determineStatus(summary: ValidationReport['summary']): ValidationReport['status'] {
    if (summary.critical > 0) {
      return 'failed';
    }
    if (summary.major > 5) {
      return 'needs_revision';
    }
    if (summary.major > 0 || summary.moderate > 5) {
      return 'needs_review';
    }
    return 'passed';
  }

  private generateRecommendations(errors: ValidationError[]): string[] {
    const recommendations: string[] = [];
    const errorTypes = new Set(errors.map(e => e.type));

    if (errorTypes.has('encoding_artifact')) {
      recommendations.push('Auto-fix available: Run EncodingValidator.fixStory() to clean up encoding issues');
    }

    if (errorTypes.has('illegal_character')) {
      recommendations.push('Strip illegal control characters (UTF-8 safe) while preserving valid multibyte Unicode characters');
    }

    if (
      errorTypes.has('character_name_inconsistency') ||
      errorTypes.has('detective_name_inconsistency') ||
      errorTypes.has('illegal_named_walk_on')
    ) {
      recommendations.push('CRITICAL: Choose one consistent name for each character and use throughout');
    }

    if (errorTypes.has('pronoun_gender_mismatch')) {
      recommendations.push('CRITICAL: Ensure pronouns match character gender consistently');
    }

    if (errorTypes.has('implausible_footprints') || errorTypes.has('implausible_embedded_object')) {
      recommendations.push('Replace physically impossible evidence with realistic alternatives');
    }

    if (errorTypes.has('anachronism')) {
      recommendations.push('Remove anachronistic technology/terms and replace with period-appropriate alternatives');
    }

    if (errorTypes.has('missing_period_markers')) {
      recommendations.push('Add period-specific details (fashion, technology, social norms) to enhance immersion');
    }

    if (errorTypes.has('missing_case_transition_bridge') || errorTypes.has('case_transition_missing')) {
      recommendations.push('Add an explicit disappearance→murder bridge scene (body discovery/identification and reclassification)');
    }

    if (
      errorTypes.has('missing_discriminating_test') ||
      errorTypes.has('cml_test_not_realized') ||
      errorTypes.has('discriminating_test_missing_setup') ||
      errorTypes.has('discriminating_test_missing_evidence_usage') ||
      errorTypes.has('discriminating_test_missing_elimination_logic') ||
      errorTypes.has('discriminating_test_missing_outcome_declaration')
    ) {
      recommendations.push('Stage an explicit discriminating test that eliminates alternatives with evidence-backed logic');
    }

    if (errorTypes.has('suspect_closure_missing') || errorTypes.has('culprit_evidence_chain_missing')) {
      recommendations.push('Add suspect elimination ledger coverage and a decisive culprit evidence chain in the final act');
    }

    if (errorTypes.has('identity_role_alias_break')) {
      recommendations.push('Keep culprit identity references stable after confession/arrest; avoid role-only renaming');
    }

    if (errorTypes.has('investigator_role_drift')) {
      recommendations.push('Keep investigator authority consistent; if command shifts from amateur to official investigator, narrate an explicit handoff/collaboration bridge');
    }

    if (errorTypes.has('temporal_contradiction')) {
      recommendations.push('Resolve month/season contradictions (e.g., May with autumn language) and keep weather cues temporally consistent');
    }

    return recommendations;
  }

  /**
   * Auto-fix what can be automatically corrected
   */
  autoFix(story: Story): Story {
    const encodingValidator = new EncodingValidator();
    return encodingValidator.fixStory(story);
  }
}
