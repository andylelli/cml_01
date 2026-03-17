/**
 * Discriminating Test Validator
 * Ensures the prose contains a falsifiable test that excludes all but one suspect.
 * Uses regex-first validation with LLM semantic fallback for natural prose.
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';
import type { AzureOpenAIClient, LogContext } from '@cml/llm-client';
import { semanticValidateDiscriminatingTest } from './semantic-validator.js';

const TEST_TERMS = /\b(test|experiment|re-?enactment|trap|constraint proof|demonstration|verification)\b/i;
const EXCLUSION_TERMS = /\b(excluded?|eliminated?|ruled\s+out|could\s+not\s+have|cannot\s+be\s+the\s+culprit|only\s+one\s+person\s+could)\b/i;
const EVIDENCE_TERMS = /\b(because|therefore|proof|evidence|measured|timed|observed)\b/i;
const OUTCOME_TERMS = /\b(culprit|killer|murderer|did\s+it|was\s+guilty|is\s+guilty|must\s+be)\b/i;

type ComponentName = 'setup' | 'evidence' | 'elimination' | 'outcome';

interface ComponentMatch {
  sceneNumber: number;
  lineNumber: number;
}

interface SceneComponentCoverage {
  sceneNumber: number;
  setup: ComponentMatch | null;
  evidence: ComponentMatch | null;
  elimination: ComponentMatch | null;
  outcome: ComponentMatch | null;
  score: number;
}

function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n|\n/g)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

function findComponentInScene(sceneNumber: number, text: string, pattern: RegExp): ComponentMatch | null {
  const paragraphs = splitIntoParagraphs(text);

  for (let i = 0; i < paragraphs.length; i += 1) {
    if (pattern.test(paragraphs[i])) {
      return {
        sceneNumber,
        lineNumber: i + 1,
      };
    }
  }

  return null;
}

function toCoverage(sceneNumber: number, text: string): SceneComponentCoverage {
  const setup = findComponentInScene(sceneNumber, text, TEST_TERMS);
  const evidence = findComponentInScene(sceneNumber, text, EVIDENCE_TERMS);
  const elimination = findComponentInScene(sceneNumber, text, EXCLUSION_TERMS);
  const outcome = findComponentInScene(sceneNumber, text, OUTCOME_TERMS);
  const score = [setup, evidence, elimination, outcome].filter(Boolean).length;

  return {
    sceneNumber,
    setup,
    evidence,
    elimination,
    outcome,
    score,
  };
}

function missingComponentToError(
  missingComponent: ComponentName,
  fallbackLocation: ComponentMatch | null
): ValidationError {
  const location = fallbackLocation ?? undefined;

  if (missingComponent === 'setup') {
    return {
      type: 'discriminating_test_missing_setup',
      message: 'Discriminating test is missing an explicit setup/action scene (test, experiment, trap, or reenactment).',
      severity: 'major',
      sceneNumber: location?.sceneNumber,
      lineNumber: location?.lineNumber,
      suggestion: 'Stage a concrete test action before presenting conclusions.',
    };
  }

  if (missingComponent === 'evidence') {
    return {
      type: 'discriminating_test_missing_evidence_usage',
      message: 'Discriminating test is missing explicit evidence usage (because/proof/evidence/measured/timed/observed).',
      severity: 'major',
      sceneNumber: location?.sceneNumber,
      lineNumber: location?.lineNumber,
      suggestion: 'Tie the test to concrete evidence and explain the supporting observation.',
    };
  }

  if (missingComponent === 'elimination') {
    return {
      type: 'discriminating_test_missing_elimination_logic',
      message: 'Discriminating test is missing elimination logic that rules out alternatives.',
      severity: 'major',
      sceneNumber: location?.sceneNumber,
      lineNumber: location?.lineNumber,
      suggestion: 'State which alternatives are excluded and why they cannot satisfy the test.',
    };
  }

  return {
    type: 'discriminating_test_missing_outcome_declaration',
    message: 'Discriminating test is missing an outcome declaration that names or asserts the resulting culprit conclusion.',
    severity: 'major',
    sceneNumber: location?.sceneNumber,
    lineNumber: location?.lineNumber,
    suggestion: 'Close the test by declaring the resulting culprit conclusion in-scene.',
  };
}

export class DiscriminatingTestValidator implements Validator {
  name = 'DiscriminatingTestValidator';
  private llmClient?: AzureOpenAIClient;
  private logContext?: LogContext;

  constructor(llmClient?: AzureOpenAIClient, logContext?: LogContext) {
    this.llmClient = llmClient;
    this.logContext = logContext;
  }

  async validate(story: Story, cml?: CMLData): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const sceneCoverage = story.scenes.map((scene) => toCoverage(scene.number, scene.text || ''));

    // Phase 1: Regex-based validation (fast, cheap)
    const scenesWithTests = sceneCoverage.filter((scene) => scene.setup);
    const validTestScenes = sceneCoverage.filter(
      (scene) => scene.setup && scene.evidence && scene.elimination && scene.outcome
    );

    let hasValidTest = validTestScenes.length > 0;

    // Phase 2: Semantic fallback (if regex fails and LLM is available)
    if (!hasValidTest && this.llmClient) {
      console.log('[DiscriminatingTestValidator] Regex validation failed; trying semantic fallback...');

      // Check all scenes for semantic validity
      for (const scene of story.scenes) {
        const semanticResult = await semanticValidateDiscriminatingTest(scene.text || '', this.llmClient, this.logContext);
        
        if (semanticResult.isValid && semanticResult.confidence !== 'low') {
          console.log(`[DiscriminatingTestValidator] Scene ${scene.number} validated semantically: ${semanticResult.reasoning}`);
          hasValidTest = true;
          break;
        }
      }

      if (!hasValidTest) {
        console.log('[DiscriminatingTestValidator] Semantic validation also failed');
      }
    }

    // Add errors if validation failed both ways
    if (!hasValidTest) {
      const strongestCandidate = sceneCoverage
        .slice()
        .sort((a, b) => b.score - a.score)[0];

      const fallbackLocation =
        strongestCandidate?.setup ??
        strongestCandidate?.evidence ??
        strongestCandidate?.elimination ??
        strongestCandidate?.outcome ??
        null;

      errors.push({
        type: 'missing_discriminating_test',
        message: 'No valid discriminating test found (setup + evidence usage + elimination logic + outcome declaration).',
        severity: 'critical',
        sceneNumber: fallbackLocation?.sceneNumber,
        lineNumber: fallbackLocation?.lineNumber,
        suggestion: 'Add a scene with an explicit test that eliminates alternatives and supports one culprit by evidence'
      });

      if (strongestCandidate && strongestCandidate.score > 0) {
        const missingComponents: ComponentName[] = [];

        if (!strongestCandidate.setup) missingComponents.push('setup');
        if (!strongestCandidate.evidence) missingComponents.push('evidence');
        if (!strongestCandidate.elimination) missingComponents.push('elimination');
        if (!strongestCandidate.outcome) missingComponents.push('outcome');

        for (const missingComponent of missingComponents) {
          errors.push(missingComponentToError(missingComponent, fallbackLocation));
        }
      }
    }

    // Check CML realization
    if (cml?.CASE?.discriminating_test?.method && scenesWithTests.length === 0) {
      errors.push({
        type: 'cml_test_not_realized',
        message: 'CML includes a discriminating test, but prose does not stage it explicitly',
        severity: 'major',
        suggestion: 'Realize the CML discriminating test method in an on-page scene'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
