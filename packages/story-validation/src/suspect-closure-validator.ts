/**
 * Suspect Closure Validator
 * Verifies suspect elimination ledger coverage and culprit evidence closure.
 * Uses regex-first validation with LLM semantic fallback for natural prose.
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';
import { roleTextsOf, isVictimArchetype, isDetectiveArchetype } from '@cml/cml';
import type { AzureOpenAIClient, LogContext } from '@cml/llm-client';
import { semanticValidateSuspectElimination, semanticValidateCulpritEvidence } from './semantic-validator.js';

const ELIMINATION_TERMS = /\b(cleared|ruled\s+out|eliminated|not\s+the\s+culprit|innocent|alibi\s+holds|alibi\s+confirmed|could\s+not\s+have|cannot\s+have|no\s+opportunity|no\s+access|impossible\s+for|accounted\s+for|vouched\s+for|beyond\s+suspicion)\b/i;
const CULPRIT_TERMS = /\b(culprits?|killers?|murderers?|responsible|did\s+it|committed|confessed?|guilty|accused)\b/i;
const EVIDENCE_TERMS = /\b(evidence|because|therefore|which\s+proves?|proof|alibi|timeline|constraint|observation|demonstrated|confirmed|established)\b/i;

const normalizeName = (name: string) => name.replace(/\s+/g, ' ').trim();
const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeAliasText = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\b(mr|mrs|ms|dr)\./g, '$1')
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const TITLE_EXPANSIONS: Record<string, string[]> = {
  dr: ['dr', 'doctor'],
  mr: ['mr', 'mister'],
  mrs: ['mrs'],
  miss: ['miss'],
  ms: ['ms'],
  inspector: ['inspector'],
  detective: ['detective'],
  captain: ['captain'],
  colonel: ['colonel'],
  sir: ['sir'],
  lady: ['lady'],
};

// Extract the surname (last word) from a full name, stripping honorifics.
// Used to match prose that refers to suspects by surname only (e.g. "Dr. Finch"
// when the full name is "Dr. Mallory Finch").
const extractSurname = (fullName: string): string => {
  const tokens = fullName.trim().split(/\s+/);
  return tokens[tokens.length - 1] ?? '';
};

const buildNameAliases = (fullName: string): string[] => {
  const normalized = normalizeName(fullName);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const rawTitle = tokens[0].toLowerCase().replace(/\.$/, '');
  const hasTitle = Object.prototype.hasOwnProperty.call(TITLE_EXPANSIONS, rawTitle);
  const surname = extractSurname(normalized);
  const firstNonTitle = hasTitle ? tokens[1] : tokens[0];
  const aliases = new Set<string>();

  aliases.add(normalized);
  if (surname) aliases.add(surname);
  if (firstNonTitle && surname && firstNonTitle.toLowerCase() !== surname.toLowerCase()) {
    aliases.add(`${firstNonTitle} ${surname}`);
  }
  if (hasTitle && surname) {
    for (const expanded of TITLE_EXPANSIONS[rawTitle]) {
      aliases.add(`${expanded} ${surname}`);
    }
  }

  return Array.from(aliases);
};

const aliasAppearsInText = (alias: string, text: string): boolean => {
  const normAlias = normalizeAliasText(alias);
  const normText = normalizeAliasText(text);
  if (!normAlias || !normText) return false;
  return new RegExp(`\\b${escapeRegex(normAlias)}\\b`, 'i').test(normText);
};

const nameAppearsInText = (fullName: string, text: string): boolean =>
  buildNameAliases(fullName).some((alias) => aliasAppearsInText(alias, text));

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
        .filter((c) => roleTextsOf(c).some(isDetectiveArchetype))
        .map((c) => normalizeName(c.name))
    );
    /**
     * A_76 — WE WERE HARD-STOPPING RUNS FOR FAILING TO CLEAR THE MURDER VICTIM.
     *
     * `suspectNames` excluded culprits and detectives and NOT victims, so a dead character was
     * required to have an on-page elimination with supporting evidence. When that (inevitably)
     * failed, `suspect_closure_missing` reached the Agent 9 release gate and threw. It is 2 of 2
     * corpus-wide validation failures: canary_1785694688532 (Sylvia Trent) and canary_1787090659142
     * (Eleanor Voss), both `role_archetype: victim`.
     *
     * There was no repair path either: the deterministic floor `enforceSuspectEliminationPresence`
     * derives its list from `computeEliminationSuspects`, which HAS excluded victims since A_68 — so
     * the injector could never satisfy the validator that was killing the run. A split brain between
     * two lists that were meant to agree.
     *
     * Unconditional, not flag-gated: this can only ever REMOVE a demand, so it cannot introduce a
     * failure. Clearing fewer people is never what makes a mystery invalid.
     *
     * The role reads also go through `roleTextsOf` / the archetype predicates rather than a bare
     * `role_archetype` substring test, which misses the `roleArchetype` and bare-`role` spellings
     * (X50).
     */
    const victimSet = new Set(
      (cml.CASE.cast as any[])
        .filter((c) => roleTextsOf(c).some(isVictimArchetype))
        .map((c) => normalizeName(c.name)),
    );
    const declaredVictim = normalizeName(String((cml.CASE as any)?.culpability?.victim ?? ''));
    if (declaredVictim) victimSet.add(declaredVictim);

    const suspectNames = castNames.filter(
      (name) => !culpritSet.has(name) && !detectiveSet.has(name) && !victimSet.has(name),
    );

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
