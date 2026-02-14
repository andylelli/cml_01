/**
 * Suspect Closure Validator
 * Verifies suspect elimination ledger coverage and culprit evidence closure.
 * Uses regex-first validation with LLM semantic fallback for natural prose.
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';
import type { AzureOpenAIClient } from '@cml/llm-client';
import { semanticValidateSuspectElimination, semanticValidateCulpritEvidence } from './semantic-validator.js';

const ELIMINATION_TERMS = /\b(cleared|ruled\s+out|eliminated|not\s+the\s+culprit|innocent|alibi\s+holds)\b/i;
const CULPRIT_TERMS = /\b(culprit|killer|murderer|responsible|did\s+it)\b/i;
const EVIDENCE_TERMS = /\b(evidence|because|therefore|proof|alibi|timeline|constraint|observation)\b/i;

const normalizeName = (name: string) => name.replace(/\s+/g, ' ').trim();

export class SuspectClosureValidator implements Validator {
  name = 'SuspectClosureValidator';
  private llmClient?: AzureOpenAIClient;

  constructor(llmClient?: AzureOpenAIClient) {
    this.llmClient = llmClient;
  }

  async validate(story: Story, cml?: CMLData): Promise<ValidationResult> {
    if (!cml) {
      return { valid: true, errors: [] };
    }

    const errors: ValidationError[] = [];
    const castNames = cml.CASE.cast.map((c) => normalizeName(c.name));
    const culpritSet = new Set((cml.CASE.culpability?.culprits || []).map((name) => normalizeName(name)));
    const suspectNames = castNames.filter((name) => !culpritSet.has(name));

    // Validate suspect eliminations
    for (const suspect of suspectNames) {
      // Phase 1: Regex-based validation (fast, cheap)
      const hasClosure = story.scenes.some((scene) => {
        const text = scene.text || '';
        return text.includes(suspect) && ELIMINATION_TERMS.test(text) && EVIDENCE_TERMS.test(text);
      });

      let hasValidElimination = hasClosure;

      // Phase 2: Semantic fallback (if regex fails and LLM is available)
      if (!hasValidElimination && this.llmClient) {
        console.log(`[SuspectClosureValidator] Regex validation failed for ${suspect}; trying semantic fallback...`);

        for (const scene of story.scenes) {
          if (scene.text?.includes(suspect)) {
            const semanticResult = await semanticValidateSuspectElimination(
              scene.text || '',
              suspect,
              this.llmClient
            );

            if (semanticResult.isValid && semanticResult.confidence !== 'low') {
              console.log(`[SuspectClosureValidator] ${suspect} elimination validated semantically in scene ${scene.number}: ${semanticResult.reasoning}`);
              hasValidElimination = true;
              break;
            }
          }
        }

        if (!hasValidElimination) {
          console.log(`[SuspectClosureValidator] Semantic validation also failed for ${suspect}`);
        }
      }

      if (!hasValidElimination) {
        errors.push({
          type: 'suspect_closure_missing',
          message: `Suspect ${suspect} is not explicitly eliminated with evidence`,
          severity: 'major',
          suggestion: 'Add an explicit elimination line tied to concrete evidence or timeline constraints'
        });
      }
    }

    // Validate culprit evidence chains
    for (const culprit of culpritSet) {
      // Phase 1: Regex-based validation
      const hasCulpritChain = story.scenes.some((scene) => {
        const text = scene.text || '';
        return text.includes(culprit) && CULPRIT_TERMS.test(text) && EVIDENCE_TERMS.test(text);
      });

      let hasValidEvidence = hasCulpritChain;

      // Phase 2: Semantic fallback
      if (!hasValidEvidence && this.llmClient) {
        console.log(`[SuspectClosureValidator] Regex validation failed for culprit ${culprit}; trying semantic fallback...`);

        for (const scene of story.scenes) {
          if (scene.text?.includes(culprit)) {
            const semanticResult = await semanticValidateCulpritEvidence(
              scene.text || '',
              culprit,
              this.llmClient
            );

            if (semanticResult.isValid && semanticResult.confidence !== 'low') {
              console.log(`[SuspectClosureValidator] ${culprit} evidence chain validated semantically in scene ${scene.number}: ${semanticResult.reasoning}`);
              hasValidEvidence = true;
              break;
            }
          }
        }

        if (!hasValidEvidence) {
          console.log(`[SuspectClosureValidator] Semantic validation also failed for culprit ${culprit}`);
        }
      }

      if (!hasValidEvidence) {
        errors.push({
          type: 'culprit_evidence_chain_missing',
          message: `Culprit ${culprit} is not tied to a non-ambiguous evidence chain`,
          severity: 'critical',
          suggestion: 'Add explicit culprit linkage using at least one decisive evidence statement'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
