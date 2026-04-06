/**
 * Prose Consistency Validator
 *
 * Checks generated prose against:
 *  1. LOCKED FACTS — physical evidence values that must appear verbatim.
 *  2. PRONOUN DRIFT — supplementary check using CML cast gender to catch
 *     any drift not caught by CharacterConsistencyValidator.
 *
 * Severity guide:
 *  - critical:  a locked fact value is directly contradicted in prose
 *  - major:     a locked fact item is mentioned without its correct value
 *  - moderate:  pronoun mismatch detected for a character with known gender
 *  - minor:     possible pronoun drift (ambiguous, heuristic-only)
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';

interface LockedFact {
  id: string;
  value: string;
  description: string;
  appearsInChapters?: string[];
}

/** Regex-escape a string for use inside a RegExp */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Remove balanced quoted dialogue from a text window before pronoun-drift checking.
 *
 * Characters in dialogue routinely use the opposite gender when referring to
 * absent third parties ("he was rude to me" said by a female about a male).
 * Without stripping these, the proximity-window check fires a false-positive
 * pronoun_drift whenever such dialogue appears near a character's name.
 *
 * Strips straight double-quote pairs and curly double-quote pairs (non-greedy).
 * Single-quoted dialogue is intentionally NOT stripped — too many legitimate uses
 * (possessives, contractions) that would produce incorrect windows.
 */
function stripDialogueFromWindow(text: string): string {
  return text
    .replace(/\u201C[^\u201D]*\u201D/g, ' ')   // curly " ... "
    .replace(/"[^"]{0,300}"/g, ' ');             // straight "..." (≤300 chars: bounded to avoid spanning multiple speakers)
}

/**
 * Derive canonical pronouns from a gender string.
 * Returns { subject, object, possessive } or null if gender is unknown.
 */
function genderToPronouns(gender: string | undefined): { subject: string; object: string; possessive: string } | null {
  switch ((gender ?? '').toLowerCase()) {
    case 'male':
      return { subject: 'he', object: 'him', possessive: 'his' };
    case 'female':
      return { subject: 'she', object: 'her', possessive: 'her' };
    case 'non-binary':
      return { subject: 'they', object: 'them', possessive: 'their' };
    default:
      return null;
  }
}

/** Returns the pronoun set for the opposite binary gender (used to detect drift). */
function oppositePronouns(gender: string): { subject: string; object: string; possessive: string } | null {
  switch (gender.toLowerCase()) {
    case 'male':
      return { subject: 'she', object: 'her', possessive: 'her' };
    case 'female':
      return { subject: 'he', object: 'him', possessive: 'his' };
    default:
      return null;
  }
}

export class ProseConsistencyValidator implements Validator {
  name = 'ProseConsistencyValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    const errors: ValidationError[] = [];

    errors.push(...this.checkLockedFacts(story, cml));
    errors.push(...this.checkPronounDrift(story, cml));
    errors.push(...this.checkOpeningStyles(story));
    errors.push(...this.checkContextLeakage(story));

    return { valid: errors.every(e => e.severity !== 'critical'), errors };
  }

  // ---------------------------------------------------------------------------
  // 1. Locked-facts consistency
  // ---------------------------------------------------------------------------

  private checkLockedFacts(story: Story, cml?: CMLData): ValidationError[] {
    const lockedFacts: LockedFact[] = cml?.lockedFacts ?? [];
    if (lockedFacts.length === 0) return [];

    const errors: ValidationError[] = [];

    for (const fact of lockedFacts) {
      const canonicalValue = fact.value.trim();
      if (!canonicalValue) continue;

      // Keywords that suggest prose is referencing this fact
      const keywords = fact.description
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 3);

      // If appearsInChapters is populated, build a fast-lookup Set once here rather
      // than inside the scene loop — null signals "no scoping, check all chapters".
      const scopedChapters: Set<number> | null =
        fact.appearsInChapters && fact.appearsInChapters.length > 0
          ? new Set(fact.appearsInChapters.map(Number))
          : null;

      for (const scene of story.scenes) {
        // Primary chapter scope gate: if the fact has been annotated with the chapters
        // where its associated evidence is formally introduced, skip all others.
        // This eliminates false positives from background keyword co-occurrence
        // (e.g. "clock" appearing in a chapter that has nothing to do with the
        // clock-stopping device). The keyword check below remains active as a fallback
        // when appearsInChapters is absent (e.g. for facts with no matching clue).
        if (scopedChapters !== null && !scopedChapters.has(scene.number)) continue;

        const text = scene.text.toLowerCase();

        // Does the scene mention enough keywords from this fact's description?
        // Use majority threshold (≥50%, min 2) to avoid false positives from
        // common short words appearing incidentally in every chapter.
        const matchedKeywords = keywords.filter(kw => text.includes(kw));
        const requiredMatches = Math.max(2, Math.ceil(keywords.length * 0.5));
        const mentionsFact = matchedKeywords.length >= requiredMatches;
        if (!mentionsFact) continue;

        // Does the verbatim value appear? If not, flag as major.
        const valuePattern = new RegExp(escapeRegex(canonicalValue.toLowerCase()), 'i');
        if (!valuePattern.test(scene.text)) {
          // Check whether a recognisably *different* numeric value appears near the keywords
          const hasConflict = this.detectConflictingValue(scene.text, canonicalValue);
          errors.push({
            type: hasConflict ? 'locked_fact_contradicted' : 'locked_fact_missing_value',
            message: hasConflict
              ? `Locked fact "${fact.description}" contradicted in chapter ${scene.number}. Expected value "${canonicalValue}" but a different value appears nearby.`
              : `Locked fact "${fact.description}" is described in chapter ${scene.number} without its canonical value "${canonicalValue}".`,
            severity: hasConflict ? 'critical' : 'major',
            sceneNumber: scene.number,
            suggestion: `Use the exact value "${canonicalValue}" whenever this evidence is described.`,
            cmlReference: `lockedFacts[${fact.id}]`,
          });
        }
      }
    }

    return errors;
  }

  /**
   * Detect whether a conflicting numeric-or-time value appears within 50 characters
   * of any keyword for the fact, where the canonical value is also numeric/time.
   */
  private detectConflictingValue(text: string, canonicalValue: string): boolean {
    // Only trigger for values that are numbers, times (e.g. "10:47", "3 yards")
    const isNumericOrTime = /\d/.test(canonicalValue);
    if (!isNumericOrTime) return false;

    // Find all numeric tokens in prose then compare to canonical
    const numericPattern = /\b\d[\d:.,]*\s*(?:minutes?|hours?|yards?|feet|inches|seconds?|pm|am|o'clock)?\b/gi;
    const proseNumbers = [...text.matchAll(numericPattern)].map(m => m[0].trim());
    // If any numeric token in the prose differs from canonical but overlaps on digits/time, flag
    return proseNumbers.some(n => n !== canonicalValue && n !== '' && !n.includes(canonicalValue) && !canonicalValue.includes(n));
  }

  // ---------------------------------------------------------------------------
  // 2. Pronoun drift (supplement to CharacterConsistencyValidator)
  // ---------------------------------------------------------------------------

  private checkPronounDrift(story: Story, cml?: CMLData): ValidationError[] {
    if (!cml?.CASE?.cast) return [];

    const errors: ValidationError[] = [];

    for (const castMember of cml.CASE.cast) {
      const gender = castMember.gender;
      if (!gender || gender === 'non-binary') continue; // non-binary uses they/them; no binary drift to detect

      const canonical = genderToPronouns(gender);
      const wrong = oppositePronouns(gender);
      if (!canonical || !wrong) continue;

      const firstName = castMember.name.split(' ')[0];
      const windowSize = 200; // characters around name mention to check

      // Competing-entity guard: collect first names of characters whose gender
      // matches the "wrong" pronoun set so we can suppress false positives when
      // such a character is mentioned in the same window.
      const oppositeGender = gender === 'male' ? 'female' : 'male';
      const oppositeFirstNames = (cml.CASE.cast as typeof castMember[])
        .filter((c) => c.gender === oppositeGender)
        .map((c) => c.name.split(' ')[0] as string);

      for (const scene of story.scenes) {
        const positions = this.findNamePositions(scene.text, firstName);
        for (const pos of positions) {
          const window = scene.text.slice(Math.max(0, pos - windowSize), pos + firstName.length + windowSize);
          // Strip balanced dialogue once and reuse for both the pronoun test and the
          // competitor guard — avoids calling the strip function twice per position.
          const windowStripped = stripDialogueFromWindow(window);
          const windowLower = windowStripped.toLowerCase();

          // If a wrong-gender pronoun appears in this window, flag it — unless a
          // character of that gender is also named (ambiguous reference, not an error).
          const wrongPronounPattern = new RegExp(`\\b(${wrong.subject}|${wrong.object}|${wrong.possessive})\\b`, 'i');
          if (wrongPronounPattern.test(windowLower)) {
            // The competitor check uses windowStripped (already dialogue-stripped) so that
            // a competitor's name inside quoted dialogue doesn't suppress a real drift.
            const competitorInWindow = oppositeFirstNames.some((fn) =>
              new RegExp(`\\b${fn}\\b`, 'i').test(windowStripped)
            );
            if (competitorInWindow) break;
            errors.push({
              type: 'pronoun_drift',
              message: `Pronoun drift for "${castMember.name}" in chapter ${scene.number}: expected ${canonical.subject}/${canonical.object}/${canonical.possessive} (${gender}) but found a ${gender === 'male' ? 'female' : 'male'} pronoun nearby.`,
              severity: 'moderate',
              sceneNumber: scene.number,
              suggestion: `Use "${canonical.subject}/${canonical.object}/${canonical.possessive}" exclusively for ${castMember.name}.`,
              cmlReference: `cast[${castMember.name}].gender`,
            });
            break; // one error per character per scene is enough
          }
        }
      }
    }

    return errors;
  }

  private findNamePositions(text: string, name: string): number[] {
    const positions: number[] = [];
    const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      positions.push(match.index);
    }
    return positions;
  }

  // ---------------------------------------------------------------------------
  // 3. Opening style repetition
  // ---------------------------------------------------------------------------

  /**
   * Classify the opening sentence of a chapter into one of 7 style buckets.
   * Mirrors classifyOpeningStyle() in narrative-state.ts (duplicated here to
   * avoid a cross-package dependency on @cml/prompts-llm).
   */
  private classifyOpeningStyle(sentence: string): string {
    const s = sentence.trim().toLowerCase();
    if (s.startsWith('"') || s.startsWith('\u2018') || s.startsWith('\u201c')) return 'dialogue-open';
    if (/^(the|a|an) [a-z]+ (of|in|at|from|with)/.test(s)) return 'noun-phrase-atmosphere';
    if (/^(it was|there was|there had been)/.test(s)) return 'expository-setup';
    if (/^(when|after|before|as|by the time)/.test(s)) return 'temporal-subordinate';
    // character-action: [Name] + any action verb (past tense regular or common irregular)
    // Extended verb list covers all examples in OPENING_STYLE_ROTATION directive plus
    // common literary action openers the LLM is likely to produce.
    if (/^[a-z]+ (had|was|were|stood|sat|lay|walked|entered|opened|closed|crossed|rose|set|drew|turned|moved|lifted|placed|reached|stepped|paused|leaned|settled|glanced|approached|said|spoke|asked|replied|looked|took|came|went|ran|fell|picked|seized|gripped|pushed|pulled|let|threw|held|bent|knelt|pressed|rang|knocked|read|found|saw|heard|noticed|watched|waited|remained)/.test(s)) return 'character-action';
    // time-anchor: digit-format (9:30 p.m. or 9.30 a.m. or 9 o'clock) OR word-format
    // ("At half past nine", "At midnight", "At a quarter to eleven")
    if (/\d{1,2}([.:]\d{1,2})?\s*(a\.m\.|p\.m\.|o'clock|am|pm)/i.test(s) ||
        /^at\s+(half\s+past|a?\s*quarter\s+(past|to)|midnight|noon|dawn|dusk)/i.test(s)) return 'time-anchor';
    return 'general-descriptive';
  }

  private checkOpeningStyles(story: Story): ValidationError[] {
    if (story.scenes.length < 4) return []; // too few chapters to penalise repetition

    const styleCounts = new Map<string, number[]>(); // style → scene numbers

    for (const scene of story.scenes) {
      // Use a lookahead so the sentence boundary is only recognised when the period / ! / ?
      // is followed by end-of-string OR whitespace + an uppercase letter.  This prevents
      // splitting mid-abbreviation (p.m., a.m., Mr., Mrs., Dr., St., etc.).
      const firstSentenceMatch = scene.text.match(/^.+?[.!?](?=\s+[A-Z]|\s*$)/);
      if (!firstSentenceMatch) continue;
      const style = this.classifyOpeningStyle(firstSentenceMatch[0]);
      if (!styleCounts.has(style)) styleCounts.set(style, []);
      styleCounts.get(style)!.push(scene.number);
    }

    const errors: ValidationError[] = [];
    const total = story.scenes.length;

    for (const [style, scenes] of styleCounts.entries()) {
      const pct = scenes.length / total;
      if (pct > 0.5) {
        errors.push({
          type: 'opening_style_repetition',
          message: `Opening style "${style}" used in ${scenes.length}/${total} chapters (${Math.round(pct * 100)}%) — exceeds 50% threshold. Chapters: ${scenes.join(', ')}.`,
          severity: 'moderate',
          suggestion: 'Vary chapter opening styles: try dialogue-open, time-anchor, character-action, noun-phrase-atmosphere across chapters.',
        });
      }
    }

    return errors;
  }

  // ---------------------------------------------------------------------------
  // 4. Context leakage detection
  // ---------------------------------------------------------------------------

  private checkContextLeakage(story: Story): ValidationError[] {
    const errors: ValidationError[] = [];

    // Pattern 1: verbatim location-template phrase "At The [Capitalised] in [Capitalised]"
    const locationTemplatePattern = /\bAt The [A-Z][a-zA-Z\s]+ in [A-Z][a-zA-Z]+\b/g;

    for (const scene of story.scenes) {
      const locationMatches = [...scene.text.matchAll(locationTemplatePattern)];
      for (const match of locationMatches) {
        errors.push({
          type: 'context_leakage',
          message: `Context template phrase "${match[0]}" detected verbatim in chapter ${scene.number}. This indicates a location profile paragraph was transcribed into prose.`,
          severity: 'major',
          sceneNumber: scene.number,
          suggestion: 'Remove or rewrite this passage — it appears to copy a location profile template rather than original prose.',
        });
      }

      // Pattern 2: very long sentences (>55 words) showing hallmarks of location profile templates.
      // Three independent signals required: (1) room noun, (2) sensory-category noun OR structural
      // template marker, (3) structural template marker ("the [smell|scent|…] of <word>") OR a
      // country/estate noun. The structural marker fires when the LLM reproduces the multi-clause
      // "X of Y" enumeration characteristic of profile paragraphs. Requiring both room noun and
      // this structural pattern (or country/estate as fallback) is tighter than the old
      // ">40 words + room + country + sensory" triple that fired on any long atmospheric sentence.
      const sentences = scene.text.split(/(?<=[.!?])\s+/);
      for (const sentence of sentences) {
        const wordCount = sentence.trim().split(/\s+/).length;
        if (wordCount > 55) {
          const hasLocationRoom = /\b(drawing room|library|study|kitchen|dining|hallway|parlour|parlor|cellar|attic|corridor)\b/i.test(sentence);
          const hasSensoryEnum = /\b(smell|scent|sound|sight|touch|aroma|fragrance|reek|odour|odor)\b/i.test(sentence);
          // Structural signal: "the <sensory> of <place/thing>" — characteristic enumeration
          // pattern used in location profile paragraphs but rare in natural character-POV prose.
          const hasTemplateStructure = /\bthe\s+(smell|scent|sound|sounds|sight|touch|aroma|fragrance|reek|odour|odor|feel)\s+of\s+\w/i.test(sentence);
          const hasCountryOrEstate = /\b(England|Scotland|France|manor|estate|hall|village|countryside)\b/i.test(sentence);
          if (hasLocationRoom && hasSensoryEnum && (hasTemplateStructure || hasCountryOrEstate)) {
            errors.push({
              type: 'context_leakage_suspected',
              message: `Suspected context leakage in chapter ${scene.number}: a ${wordCount}-word sentence shows hallmarks of a location profile template (room + sensory enumeration${hasTemplateStructure ? ' + template listing structure' : ''}).`,
              severity: 'minor',
              sceneNumber: scene.number,
              suggestion: 'Verify this sentence is original prose and not copied from a location profile paragraph.',
            });
          }
        }
      }
    }

    return errors;
  }
}
