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

// ---------------------------------------------------------------------------
// High-precision pronoun-drift detectors (pronoun_policy "verify" — detection
// without the deterministic prose-writing fixer). Pure functions so the rubric
// scorer's pronounsUnstable extractor can replicate the exact same predicate
// (packages/rubric-score/src/facts.ts holds a local copy — rubric-score cannot
// depend on story-validation). Precision over recall: dialogue is never scanned,
// ungendered cast members are skipped, and any same-gender cast mention in the
// window suppresses the event.
// ---------------------------------------------------------------------------

export interface PronounDriftCastEntry {
  name: string;
  gender?: string;
}

export interface PronounDriftEvent {
  kind: 'attribution_flip' | 'impossible_self_reference';
  /** Canonical full cast name of the drifted character. */
  characterName: string;
  /** Offending snippet (whitespace-collapsed, capped) for the report/rubric citation. */
  sentence: string;
}

// Past-tense speech verbs only — prose is past tense; a present-tense list would silently no-op.
const SPEECH_VERBS =
  'said|asked|replied|observed|answered|added|continued|murmured|muttered|whispered|remarked|noted|' +
  'countered|insisted|agreed|admitted|conceded|pressed|urged|demanded|snapped|sighed|offered|ventured|' +
  'began|repeated|echoed|announced|declared|explained|protested|warned|corrected|mused|responded|' +
  'interjected|interrupted|confirmed|suggested';

// Personal-object nouns for the possessive branch of impossible-self-reference: an opposite-gender
// possessive over the subject's OWN body/attire/effects is near-certain drift; a generic noun is not.
const SELF_NOUNS =
  'gloves?|hat|coat|jacket|waistcoat|collar|cuffs?|tie|cravat|spectacles|monocle|hair|moustache|mustache|' +
  'beard|brow|forehead|eyes?|jaw|chin|lips?|mouth|throat|voice|breath|composure|temper|gaze|expression|' +
  'hands?|fingers?|palms?|shoulders?|arms?|knees?|sleeves?|pockets?|watch|cane|pipe|notebook|notes|pen|' +
  'skirts?|gown|dress|shawl|scarf|handbag|umbrella|glasses|shoes?|boots?';

const DETECTOR_NAME_TITLES = new Set([
  'dr', 'mr', 'mrs', 'miss', 'ms', 'lord', 'lady', 'sir', 'capt', 'captain', 'col', 'colonel',
  'prof', 'professor', 'rev', 'reverend', 'madame', 'madam', 'inspector', 'sergeant', 'constable', 'dame',
]);

type BinaryGender = 'male' | 'female';

function normalizeBinaryGender(gender: string | undefined): BinaryGender | null {
  const g = (gender ?? '').trim().toLowerCase();
  return g === 'male' || g === 'female' ? g : null;
}

/**
 * Gendered name-token index: lowercased token → { canonical full name, gender }.
 * Titles are dropped, tokens under 3 chars are dropped, and a token shared by
 * characters of BOTH genders is dropped entirely (ambiguous — precision first).
 */
function buildGenderedTokenIndex(cast: PronounDriftCastEntry[]): Map<string, { name: string; gender: BinaryGender }> {
  const index = new Map<string, { name: string; gender: BinaryGender }>();
  const ambiguous = new Set<string>();
  for (const member of cast) {
    const gender = normalizeBinaryGender(member.gender);
    const name = String(member.name ?? '').trim();
    if (!gender || !name) continue; // skip ungendered names
    for (const rawToken of name.split(/\s+/)) {
      const token = rawToken.replace(/\.$/, '').toLowerCase();
      if (token.length < 3 || DETECTOR_NAME_TITLES.has(token)) continue;
      const existing = index.get(token);
      if (existing && existing.gender !== gender) {
        ambiguous.add(token);
        continue;
      }
      if (!existing) index.set(token, { name, gender });
    }
  }
  for (const token of ambiguous) index.delete(token);
  return index;
}

/**
 * Prepare a narration-only scan window: strip balanced quoted dialogue, then cut anything
 * trailing an unmatched opening quote (the window often ends mid-dialogue, just before the
 * tag being examined) and anything preceding an unmatched closing curly quote (the window
 * may begin mid-dialogue).
 */
function narrationOnly(window: string): string {
  let s = stripDialogueFromWindow(window);
  const firstDanglingClose = s.indexOf('”');
  if (firstDanglingClose !== -1) s = s.slice(firstDanglingClose + 1);
  const lastDanglingOpen = Math.max(s.lastIndexOf('"'), s.lastIndexOf('“'));
  if (lastDanglingOpen !== -1) s = s.slice(0, lastDanglingOpen);
  return s;
}

function snippetAround(text: string, start: number, end: number): string {
  return text
    .slice(Math.max(0, start), Math.min(text.length, end))
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

/**
 * Detector (a) — attribution flip: a narration dialogue-tag pronoun ('"…," he said') whose nearest
 * preceding gendered narration referent (cast name or subject pronoun, scanning back at most one
 * paragraph boundary) is opposite-gender, with no same-gender cast name anywhere in that window.
 */
export function detectAttributionFlips(text: string, cast: PronounDriftCastEntry[]): PronounDriftEvent[] {
  const events: PronounDriftEvent[] = [];
  const tokenIndex = buildGenderedTokenIndex(cast);
  if (tokenIndex.size === 0) return events;

  const tagPattern = new RegExp(`["\\u201D]\\s*(he|she)\\s+(?:${SPEECH_VERBS})\\b`, 'gi');
  let tag: RegExpExecArray | null;
  while ((tag = tagPattern.exec(text)) !== null) {
    // The tag pronoun must be narration: a straight quote at the match start must be a CLOSING
    // quote (even count of straight quotes up to and including it); a curly ” always closes.
    if (text[tag.index] === '"') {
      const quotesThrough = (text.slice(0, tag.index + 1).match(/"/g) ?? []).length;
      if (quotesThrough % 2 !== 0) continue; // opening quote → pronoun is inside dialogue
    }

    const tagGender: BinaryGender = tag[1].toLowerCase() === 'he' ? 'male' : 'female';

    // Scan-back window: current paragraph plus at most one paragraph boundary back.
    let windowStart = 0;
    const currentBoundary = text.lastIndexOf('\n\n', tag.index);
    if (currentBoundary !== -1) {
      const previousBoundary = text.lastIndexOf('\n\n', currentBoundary - 1);
      windowStart = previousBoundary === -1 ? 0 : previousBoundary + 2;
    }
    const narration = narrationOnly(text.slice(windowStart, tag.index));

    // Gendered referents in narration: cast-name tokens and bare subject pronouns.
    let nearest: { pos: number; gender: BinaryGender } | null = null;
    let nearestOppositeName: { pos: number; name: string } | null = null;
    let sameGenderNamePresent = false;
    for (const [token, info] of tokenIndex) {
      const namePattern = new RegExp(`\\b${escapeRegex(token)}\\b`, 'gi');
      let nameMatch: RegExpExecArray | null;
      while ((nameMatch = namePattern.exec(narration)) !== null) {
        if (info.gender === tagGender) sameGenderNamePresent = true;
        if (!nearest || nameMatch.index > nearest.pos) nearest = { pos: nameMatch.index, gender: info.gender };
        if (info.gender !== tagGender && (!nearestOppositeName || nameMatch.index > nearestOppositeName.pos)) {
          nearestOppositeName = { pos: nameMatch.index, name: info.name };
        }
      }
    }
    const subjectPronounPattern = /\b(he|she)\b/gi;
    let pronounMatch: RegExpExecArray | null;
    while ((pronounMatch = subjectPronounPattern.exec(narration)) !== null) {
      const gender: BinaryGender = pronounMatch[1].toLowerCase() === 'he' ? 'male' : 'female';
      if (!nearest || pronounMatch.index > nearest.pos) nearest = { pos: pronounMatch.index, gender };
    }

    if (!nearest) continue;                       // no gendered referent → nothing to contradict
    if (nearest.gender === tagGender) continue;   // tag agrees with the nearest referent
    if (sameGenderNamePresent) continue;          // a same-gender character is in scope — ambiguous, skip
    if (!nearestOppositeName) continue;           // opposite referent is pronoun-only — cannot name a character

    events.push({
      kind: 'attribution_flip',
      characterName: nearestOppositeName.name,
      sentence: snippetAround(text, tag.index - 120, tag.index + tag[0].length + 60),
    });
  }
  return events;
}

/**
 * Detector (b) — impossible self-reference: a narration sentence whose subject is a gendered cast
 * name and which refers back to that subject with an opposite-gender reflexive ("Eleanor composed
 * himself") or an opposite-gender possessive over a personal-object noun ("Eleanor … adjusted his
 * gloves"). Skipped when an opposite-gender pronoun intervenes (a second actor is in play) or when
 * ANY cast member matching the wrong pronoun's gender appears in the paragraph.
 */
export function detectImpossibleSelfReferences(text: string, cast: PronounDriftCastEntry[]): PronounDriftEvent[] {
  const events: PronounDriftEvent[] = [];
  const tokenIndex = buildGenderedTokenIndex(cast);
  if (tokenIndex.size === 0) return events;

  // 1–3 leading capitalized tokens (optional title + first/surname); the verb that follows is
  // lowercase in past-tense prose so the match stops at the subject.
  const subjectPattern = /^\s*((?:[A-Z][A-Za-z'\-]*\.?\s+){0,2}[A-Z][A-Za-z'\-]*)/;

  for (const paragraph of text.split(/\n\s*\n/)) {
    const narration = stripDialogueFromWindow(paragraph);
    const paragraphLower = narration.toLowerCase();

    for (const sentence of narration.split(/(?<=[.!?])\s+/)) {
      const subjectMatch = sentence.match(subjectPattern);
      if (!subjectMatch) continue;
      const candidateTokens = subjectMatch[1]
        .split(/\s+/)
        .map((t) => t.replace(/\.$/, '').toLowerCase())
        .filter((t) => t.length >= 3 && !DETECTOR_NAME_TITLES.has(t));
      let subject: { name: string; gender: BinaryGender } | null = null;
      for (const candidate of candidateTokens) {
        const info = tokenIndex.get(candidate);
        if (info) { subject = info; break; }
      }
      if (!subject) continue; // subject is not a gendered cast member

      const wrongGender: BinaryGender = subject.gender === 'male' ? 'female' : 'male';
      const wrongReflexive = subject.gender === 'female' ? 'himself' : 'herself';
      const wrongPossessive = subject.gender === 'female' ? 'his' : 'her';
      // An intervening opposite-gender pronoun means a second actor is in play, not drift.
      const intervener = subject.gender === 'female' ? /\b(he|him)\b/i : /\bshe\b/i;

      const rest = sentence.slice((subjectMatch.index ?? 0) + subjectMatch[0].length);
      const reflexiveMatch = new RegExp(`\\b${wrongReflexive}\\b`, 'i').exec(rest);
      const possessiveMatch = new RegExp(`\\b${wrongPossessive}\\s+(?:own\\s+)?(?:${SELF_NOUNS})\\b`, 'i').exec(rest);
      const hit =
        reflexiveMatch && (!possessiveMatch || reflexiveMatch.index <= possessiveMatch.index)
          ? reflexiveMatch
          : possessiveMatch;
      if (!hit) continue;
      if (intervener.test(rest.slice(0, hit.index))) continue;

      // Same-gender-as-wrong-pronoun cast mention anywhere in the paragraph → plausible referent, skip.
      let wrongGenderCastPresent = false;
      for (const [token, info] of tokenIndex) {
        if (info.gender !== wrongGender) continue;
        if (new RegExp(`\\b${escapeRegex(token)}\\b`).test(paragraphLower)) { wrongGenderCastPresent = true; break; }
      }
      if (wrongGenderCastPresent) continue;

      events.push({
        kind: 'impossible_self_reference',
        characterName: subject.name,
        sentence: sentence.replace(/\s+/g, ' ').trim().slice(0, 200),
      });
    }
  }
  return events;
}

/** Both high-precision detectors over one chapter's text. */
export function detectPronounDriftEvents(text: string, cast: PronounDriftCastEntry[]): PronounDriftEvent[] {
  return [...detectAttributionFlips(text, cast), ...detectImpossibleSelfReferences(text, cast)];
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

      // RC2.1 (A_61 Phase 2b): a locked fact's canonical value need only be surfaced ONCE across the
      // chapters that genuinely reference it — not restated in every incidental-keyword chapter. The
      // per-scene "missing value" check multiplied a single fact into many majors (run bf6khyl2r: one
      // "thirty feet" distance fact → 6 majors) and demanded robotic repetition (A_57 D1). We now collect
      // the scenes that reference the fact, and require the value to appear in AT LEAST ONE of them.
      // (A *conflicting* value stays a per-scene critical — a contradiction anywhere is a real error.)
      const relevantSceneNumbers: number[] = [];
      let valueAppearsSomewhere = false;

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

        relevantSceneNumbers.push(scene.number);

        // Does the verbatim value appear? If not, check structural variants before flagging.
        const valuePattern = new RegExp(escapeRegex(canonicalValue.toLowerCase()), 'i');
        const valueFound = valuePattern.test(scene.text) || this.checkValueVariants(canonicalValue, scene.text);
        if (valueFound) {
          valueAppearsSomewhere = true;
          continue;
        }

        // A recognisably *different* numeric/time value near the keywords is a hard contradiction
        // wherever it occurs — kept per-scene and critical.
        if (this.detectConflictingValue(scene.text, canonicalValue)) {
          errors.push({
            type: 'locked_fact_contradicted',
            message: `Locked fact "${fact.description}" contradicted in chapter ${scene.number}. Expected value "${canonicalValue}" but a different value appears nearby.`,
            severity: 'critical',
            sceneNumber: scene.number,
            suggestion: `Use the exact value "${canonicalValue}" whenever this evidence is described.`,
            cmlReference: `lockedFacts[${fact.id}]`,
          });
        }
      }

      // Missing-value: flag ONCE if the canonical value never appears in any chapter that references it.
      if (relevantSceneNumbers.length > 0 && !valueAppearsSomewhere) {
        errors.push({
          type: 'locked_fact_missing_value',
          message: `Locked fact "${fact.description}" is referenced (chapter(s) ${relevantSceneNumbers.join(', ')}) but its canonical value "${canonicalValue}" never appears. State it at least once where the evidence is introduced.`,
          severity: 'major',
          sceneNumber: relevantSceneNumbers[0],
          suggestion: `Use the exact value "${canonicalValue}" at least once where this evidence is described.`,
          cmlReference: `lockedFacts[${fact.id}]`,
        });
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

  /**
   * Check whether `text` contains a structurally equivalent variant of `canonicalValue`
   * that the verbatim equality check misses. Returns true if a variant is found.
   *
   * Handles:
   *  1. Hyphenated adjective form of plural-unit quantities:
   *     "forty minutes" → also accept "forty-minute" (e.g. "a forty-minute delay")
   *  2. Temperature abbreviations:
   *     "98 degrees Fahrenheit" → also accept "98°F", "98 °F", "98 degrees F"
   */
  private checkValueVariants(canonicalValue: string, text: string): boolean {
    const lower = canonicalValue.toLowerCase();

    // 1. Adjective form: "[quantity] [unit]s" → "[quantity]-[unit]"
    //    e.g. "forty minutes" → "forty-minute", "two hours" → "two-hour"
    const pluralUnitMatch = lower.match(/^(.+)\s+(\w+)s$/);
    if (pluralUnitMatch) {
      const adjForm = `${pluralUnitMatch[1]}-${pluralUnitMatch[2]}`;
      if (new RegExp(`\\b${escapeRegex(adjForm)}\\b`, 'i').test(text)) return true;
    }

    // 2. Temperature abbreviation: "N degrees [scale]" → "N°S", "N degrees S"
    const tempMatch = lower.match(/^(\d+)\s+degrees?\s+(fahrenheit|celsius|kelvin|centigrade)$/i);
    if (tempMatch) {
      const digits = tempMatch[1];
      const scaleChar = tempMatch[2][0].toUpperCase();
      if (new RegExp(`\\b${digits}\\s*°\\s*${scaleChar}\\b|\\b${digits}\\s+degrees?\\s+${scaleChar}\\b`, 'i').test(text)) return true;
    }

    // 3. Time variant: "X o'clock" → accept common hour-only phrasings the LLM uses:
    //    "eight PM", "eight p.m.", "eight in the evening", "when the clock struck eight", etc.
    const oclockMatch = lower.match(/^([a-z-]+)\s+o['\u2019]clock$/);
    if (oclockMatch) {
      const hw = oclockMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const hourVariants = new RegExp(
        `\\b${hw}\\s*(?:p\\.?m\\.?|a\\.?m\\.?)\\b` +
        `|\\b${hw}\\s+(?:in\\s+the\\s+(?:evening|morning|afternoon|night)|that\\s+(?:evening|night|morning))\\b` +
        `|when\\s+the\\s+clock\\s+struck\\s+${hw}\\b` +
        `|\\bthe\\s+hour\\s+of\\s+${hw}\\b` +
        `|\\b${hw}\\s+on\\s+the\\s+dot\\b`,
        'i',
      );
      if (hourVariants.test(text)) return true;
    }

    return false;
  }

  // ---------------------------------------------------------------------------
  // 2. Pronoun drift (supplement to CharacterConsistencyValidator)
  // ---------------------------------------------------------------------------

  private checkPronounDrift(story: Story, cml?: CMLData): ValidationError[] {
    if (!cml?.CASE?.cast) return [];

    const errors: ValidationError[] = [];

    // High-precision detectors first (attribution-flip, impossible-self-reference): specific
    // offending snippets make better repair directives than the proximity-window message.
    // One pronoun_drift error per character per scene across BOTH layers — flaggedPairs seeds
    // the window heuristic below. The "Pronoun drift for \"<name>\"" message prefix is the
    // contract extractPronounTargetNames (agent9-run) parses for LLM-regen repair targeting.
    const flaggedPairs = new Set<string>(); // `${cast name}::${scene number}`
    const castEntries: PronounDriftCastEntry[] = cml.CASE.cast.map((c) => ({ name: c.name, gender: c.gender }));
    for (const scene of story.scenes) {
      for (const event of detectPronounDriftEvents(scene.text, castEntries)) {
        const pairKey = `${event.characterName}::${scene.number}`;
        if (flaggedPairs.has(pairKey)) continue;
        flaggedPairs.add(pairKey);
        const detail = event.kind === 'attribution_flip'
          ? 'a dialogue tag uses the opposite-gender pronoun for the nearest referent'
          : 'an opposite-gender possessive/reflexive refers back to the sentence subject';
        errors.push({
          type: 'pronoun_drift',
          message: `Pronoun drift for "${event.characterName}" in chapter ${scene.number}: ${detail} — "${event.sentence}".`,
          severity: 'moderate',
          sceneNumber: scene.number,
          suggestion: `Use the pronouns matching ${event.characterName}'s gender exclusively when the narration refers to ${event.characterName}.`,
          cmlReference: `cast[${event.characterName}].gender`,
        });
      }
    }

    for (const castMember of cml.CASE.cast) {
      const gender = castMember.gender;
      // Era constraint: CML stories are set in the 1930s–1950s; all characters are binary-gendered.
      if (!gender) continue;

      const canonical = genderToPronouns(gender);
      const wrong = oppositePronouns(gender);
      if (!canonical || !wrong) continue;

      const nameParts = castMember.name.trim().split(/\s+/);
      const firstName = nameParts[0] ?? '';
      // F30-2: Also search by surname so "Quincy" references near wrong pronouns are caught
      // even when the first name "Robert" doesn't appear in that local context.
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1]! : '';
      // Deduplicate: if first name === last name (single-word name), search once only.
      const searchNames = (lastName && lastName !== firstName) ? [firstName, lastName] : [firstName];

      const windowSize = 200; // characters around name mention to check

      // Competing-entity guard: collect all name parts (first + last + middle) of
      // characters whose gender matches the "wrong" pronoun set.
      // Using only first names misses cases where the character is referred to by
      // last name or full name in narrative text near the subject character's mention.
      const oppositeGender = gender === 'male' ? 'female' : 'male';
      const oppositeFirstNames = (cml.CASE.cast as typeof castMember[])
        .filter((c) => c.gender === oppositeGender)
        .flatMap((c) => c.name.split(/\s+/).filter((part) => part.length >= 3));

      // Track scenes already flagged for this character (one error per character per scene),
      // seeded with scenes the high-precision detectors above already reported.
      const flaggedScenes = new Set<number>(
        story.scenes.map((s) => s.number).filter((n) => flaggedPairs.has(`${castMember.name}::${n}`)),
      );

      for (const scene of story.scenes) {
        if (flaggedScenes.has(scene.number)) continue;

        // F30-2: Check positions for each search name (first name + surname).
        for (const searchName of searchNames) {
          if (flaggedScenes.has(scene.number)) break;
          const positions = this.findNamePositions(scene.text, searchName);
          for (const pos of positions) {
            if (flaggedScenes.has(scene.number)) break;
            const window = scene.text.slice(Math.max(0, pos - windowSize), pos + searchName.length + windowSize);
            // Strip balanced dialogue once and reuse for both the pronoun test and the
            // competitor guard — avoids calling the strip function twice per position.
            const windowStripped = stripDialogueFromWindow(window);
            const windowLower = windowStripped.toLowerCase();

            // If a wrong-gender pronoun appears in this window, flag it — unless a
            // character of that gender is also named (ambiguous reference, not an error).
            const wrongPronounPattern = new RegExp(`\\b(${wrong.subject}|${wrong.object}|${wrong.possessive})\\b`, 'i');
            if (wrongPronounPattern.test(windowLower)) {
              // Suppress only when an opposite-gender competitor appears in the same
              // paragraph as the subject name within the full scene text.
              const paragraphStartToken = scene.text.lastIndexOf("\n\n", pos);
              const paragraphEndToken = scene.text.indexOf("\n\n", pos);
              const paragraphStart = paragraphStartToken === -1 ? 0 : paragraphStartToken + 2;
              const paragraphEnd = paragraphEndToken === -1 ? scene.text.length : paragraphEndToken;
              const paragraphText = scene.text.slice(paragraphStart, paragraphEnd);
              const competitorSearchText = stripDialogueFromWindow(paragraphText);
              const competitorFound = oppositeFirstNames.some((fn) =>
                new RegExp(`\\b${fn}\\b`, 'i').test(competitorSearchText)
              );
              // Use flaggedScenes set so that checking additional search names for the same
              // character in the same scene doesn't produce duplicate errors.
              if (competitorFound) continue;
              flaggedScenes.add(scene.number);
              errors.push({
                type: 'pronoun_drift',
                message: `Pronoun drift for "${castMember.name}" in chapter ${scene.number}: expected ${canonical.subject}/${canonical.object}/${canonical.possessive} (${gender}) but found a ${gender === 'male' ? 'female' : 'male'} pronoun nearby.`,
                severity: 'moderate',
                sceneNumber: scene.number,
                suggestion: `Use "${canonical.subject}/${canonical.object}/${canonical.possessive}" exclusively for ${castMember.name}.`,
                cmlReference: `cast[${castMember.name}].gender`,
              });
              break; // stop checking further positions for this search name
            }
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
    // character-action: a named character (1–3 words) + any action verb.
    // Supports single first-name, two-part full names, and titled three-part names.
    // A negative lookahead blocks articles/pronouns/prepositions from being mistaken for names.
    {
      const _v = 'had|was|were|stood|sat|lay|walked|entered|opened|closed|crossed|rose|set|drew|turned|moved|lifted|placed|reached|stepped|paused|leaned|settled|glanced|approached|said|spoke|asked|replied|looked|took|came|went|ran|fell|picked|seized|gripped|pushed|pulled|let|threw|held|bent|knelt|pressed|rang|knocked|read|found|saw|heard|noticed|watched|waited|remained';
      const _g = '(?!(?:the|a|an|it|there|when|after|before|as|by|her|his|their|its|she|he|they|we|you|i) )';
      if (new RegExp(`^${_g}[a-z]+ (${_v})`).test(s)) return 'character-action';                         // "Eleanor walked"
      if (new RegExp(`^${_g}[a-z]+ [a-z]+ (${_v})`).test(s)) return 'character-action';                  // "Beatrice Quill stepped"
      if (new RegExp(`^${_g}[a-z]+\\.? [a-z]+ [a-z]+ (${_v})`).test(s)) return 'character-action';      // "Dr. Mallory Finch examined" / "Captain Ivor Hale crossed"
    }
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
