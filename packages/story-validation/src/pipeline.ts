/**
 * Story Validation Pipeline
 * Coordinates all validators and provides comprehensive quality checking
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';
import type { AzureOpenAIClient } from '@cml/llm-client';
import { EncodingValidator } from './encoding-validator.js';
import { CharacterConsistencyValidator } from './character-validator.js';
import { PhysicalPlausibilityValidator } from './physical-validator.js';
import { EraAuthenticityValidator } from './era-validator.js';
import { NarrativeContinuityValidator } from './narrative-continuity-validator.js';
import { CaseTransitionValidator } from './case-transition-validator.js';
import { DiscriminatingTestValidator } from './discriminating-test-validator.js';
import { SuspectClosureValidator } from './suspect-closure-validator.js';

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
}

export class StoryValidationPipeline {
  private validators: Validator[];

  constructor(llmClient?: AzureOpenAIClient) {
    this.validators = [
      new EncodingValidator(),
      new CharacterConsistencyValidator(),
      new NarrativeContinuityValidator(),
      new CaseTransitionValidator(),
      new DiscriminatingTestValidator(llmClient),
      new SuspectClosureValidator(llmClient),
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
          return this.generateReport(allErrors, validator.name);
        }
      } catch (error) {
        console.error(`Validator ${validator.name} failed:`, error);
      }
    }

    return this.generateReport(allErrors);
  }

  private generateReport(errors: ValidationError[], failedAt?: string): ValidationReport {
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
      recommendations
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

    if (errorTypes.has('character_name_inconsistency') || errorTypes.has('detective_name_inconsistency')) {
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

    if (errorTypes.has('missing_discriminating_test') || errorTypes.has('cml_test_not_realized')) {
      recommendations.push('Stage an explicit discriminating test that eliminates alternatives with evidence-backed logic');
    }

    if (errorTypes.has('suspect_closure_missing') || errorTypes.has('culprit_evidence_chain_missing')) {
      recommendations.push('Add suspect elimination ledger coverage and a decisive culprit evidence chain in the final act');
    }

    if (errorTypes.has('identity_role_alias_break')) {
      recommendations.push('Keep culprit identity references stable after confession/arrest; avoid role-only renaming');
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
