/**
 * Suspect Closure Validator
 * Verifies suspect elimination ledger coverage and culprit evidence closure.
 * Uses regex-first validation with LLM semantic fallback for natural prose.
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';
import type { AzureOpenAIClient, LogContext } from '@cml/llm-client';
import { semanticValidateSuspectElimination, semanticValidateCulpritEvidence } from './semantic-validator.js';

const ELIMINATION_TERMS = /\b(cleared|ruled\s+out|eliminated|not\s+the\s+culprit|innocent|alibi\s+holds|alibi\s+confirmed|could\s+not\s+have)\b/i;
const CULPRIT_TERMS = /\b(culprits?|killers?|murderers?|responsible|did\s+it)\b/i;
const EVIDENCE_TERMS = /\b(evidence|because|therefore|which\s+proves|proof|alibi|timeline|constraint|observation)\b/i;

const normalizeName = (name: string) => name.replace(/\s+/g, ' ').trim();

// Extract the surname (last word) from a full name, stripping honorifics.
// Used to match prose that refers to suspects by surname only (e.g. "Dr. Finch"
// when the full name is "Dr. Mallory Finch").
const extractSurname = (fullName: string): string => {
  const tokens = fullName.trim().split(/\s+/);
  return tokens[tokens.length - 1];
};

// Returns true if the text contains the full name OR the surname alone.
const nameAppearsInText = (fullName: string, text: string): boolean =>
  text.includes(fullName) || text.includes(extractSurname(fullName));

export class SuspectClosureValidator implements Validator {
  name = 'SuspectClosureValidator';
  private llmClient?: AzureOpenAIClient;
  private logContext?: LogContext;

  constructor(llmClient?: AzureOpenAIClient, logContext?: LogContext) {
    this.llmClient = llmClient;
    this.logContext = logContext;
  }

  async validate(story: Story, cml?: CMLData): Promise<ValidationResult> {
    if (!cml) {
      return { valid: true, errors: [] };
    }

    const errors: ValidationError[] = [];
    const castNames = cml.CASE.cast.map((c) => normalizeName(c.name));
    const culpritSet = new Set((cml.CASE.culpability?.culprits || []).map((name) => normalizeName(name)));
    // Detectives are never treated as suspects requiring elimination evidence.
    const detectiveSet = new Set(
      (cml.CASE.cast as any[])
        .filter((c) => typeof c.role_archetype === 'string' && c.role_archetype.toLowerCase().includes('detective'))
        .map((c) => normalizeName(c.name))
    );
    const suspectNames = castNames.filter((name) => !culpritSet.has(name) && !detectiveSet.has(name));

    // Validate suspect eliminations
    for (const suspect of suspectNames) {
      // Phase 1: Regex-based validation (fast, cheap)
      const hasClosure = story.scenes.some((scene) => {
        const text = scene.text || '';
        // Use nameAppearsInText so "Dr. Finch" matches "Dr. Mallory Finch" etc.
        return nameAppearsInText(suspect, text) && ELIMINATION_TERMS.test(text) && EVIDENCE_TERMS.test(text);
      });

      let hasValidElimination = hasClosure;

      // Phase 2: Semantic fallback (if regex fails and LLM is available).
      // Rather than filtering scenes by name appearance (which misses elimination
      // passages that use pronouns or title-only references), we search a
      // concatenated reveal block (last REVEAL_SCENES scenes) and, if that fails,
      // the full story text.
      if (!hasValidElimination && this.llmClient) {
        console.log(`[SuspectClosureValidator] Regex validation failed for ${suspect}; trying semantic fallback...`);

        const REVEAL_SCENES = 3;
        const revealScenes = story.scenes.slice(-REVEAL_SCENES);
        const revealText = revealScenes.map((s) => s.text || '').join('\n\n');

        const revealResult = await semanticValidateSuspectElimination(
          revealText,
          suspect,
          this.llmClient,
          this.logContext
        );

        if (revealResult.isValid && revealResult.confidence !== 'low') {
          console.log(`[SuspectClosureValidator] ${suspect} elimination validated semantically in reveal block: ${revealResult.reasoning}`);
          hasValidElimination = true;
        }

        if (!hasValidElimination) {
          // Full-story fallback: culprit accusation elsewhere implicitly clears suspects.
          // Check the whole story so cross-scene elimination patterns are not missed.
          const fullStoryText = story.scenes.map((s) => s.text || '').join('\n\n');
          const fullResult = await semanticValidateSuspectElimination(
            fullStoryText,
            suspect,
            this.llmClient,
            this.logContext
          );

          if (fullResult.isValid && fullResult.confidence !== 'low') {
            console.log(`[SuspectClosureValidator] ${suspect} elimination validated semantically in full story: ${fullResult.reasoning}`);
            hasValidElimination = true;
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
        return nameAppearsInText(culprit, text) && CULPRIT_TERMS.test(text) && EVIDENCE_TERMS.test(text);
      });

      let hasValidEvidence = hasCulpritChain;

      // Phase 2: Semantic fallback — search the reveal block then the full story,
      // not individual scenes filtered by name, so pronoun-referential passages
      // near the accusation are not silently skipped.
      if (!hasValidEvidence && this.llmClient) {
        console.log(`[SuspectClosureValidator] Regex validation failed for culprit ${culprit}; trying semantic fallback...`);

        const REVEAL_SCENES = 3;
        const revealScenes = story.scenes.slice(-REVEAL_SCENES);
        const revealText = revealScenes.map((s) => s.text || '').join('\n\n');

        const revealResult = await semanticValidateCulpritEvidence(
          revealText,
          culprit,
          this.llmClient,
          this.logContext
        );

        if (revealResult.isValid && revealResult.confidence !== 'low') {
          console.log(`[SuspectClosureValidator] ${culprit} evidence chain validated semantically in reveal block: ${revealResult.reasoning}`);
          hasValidEvidence = true;
        }

        if (!hasValidEvidence) {
          const fullStoryText = story.scenes.map((s) => s.text || '').join('\n\n');
          const fullResult = await semanticValidateCulpritEvidence(
            fullStoryText,
            culprit,
            this.llmClient,
            this.logContext
          );

          if (fullResult.isValid && fullResult.confidence !== 'low') {
            console.log(`[SuspectClosureValidator] ${culprit} evidence chain validated semantically in full story: ${fullResult.reasoning}`);
            hasValidEvidence = true;
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
