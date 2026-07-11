import type { CMLData, Story, ValidationError, ValidationResult, Validator } from './types.js';

export type CharacterLifecycleStatus =
  | 'alive'
  | 'deceased'
  | 'victim'
  | 'active_dialogue'
  | 'active_suspect'
  | 'cleared'
  | 'culprit'
  | 'confesses';

export type LifecycleEvidenceStrength = 'hard' | 'medium' | 'heuristic';

export interface CharacterLifecycleEvent {
  characterName: string;
  status: CharacterLifecycleStatus;
  chapterNumber: number;
  evidence: string;
  source: 'cml' | 'outline' | 'prose';
  strength: LifecycleEvidenceStrength;
}

export interface CharacterLifecycleLedger {
  byCharacter: Record<string, CharacterLifecycleEvent[]>;
}

// A_50 §8 rank 3 / A_43 G/H/I: these predicates are the SINGLE SOURCE OF TRUTH for the deceased/
// victim-alive family. The worker's deterministic repair (applyCanonicalVictimRescue) imports them so
// the repair's flag-set can never drift from the detector's (the drift that left the rescue reframing
// one sentence while the critical re-fired and aborted the run).
export const DEATH_RE = /\b(?:dead|body|corpse|deceased|lifeless|murdered|killed|slain)\b/i;
export const CONFESSION_RE = /\b(?:confessed|confession|admitted\s+(?:it|the\s+(?:murder|killing))|i\s+(?:killed|murdered|poisoned|struck|shot|stabbed))\b/i;
export const ACTIVE_VERB_RE = /\b(?:said|asked|replied|answered|entered|stood|walked|looked|nodded|spoke|turned|moved|sat|rose|gestured|examined|handed|pointed|confessed|admitted)\b/i;
const CLEARED_RE = /\b(?:cleared|ruled\s+out|eliminated|innocent|alibi\s+(?:holds|held|confirmed)|could\s+not\s+have)\b/i;
// A_50 §9: a culprit named near a clearance word in the SAME (reveal) chapter is overwhelmingly the
// DEMOLITION of a false alibi ("the alibi that had once cleared X collapsed"), not an exoneration —
// so a clearance sentence carrying one of these negation/collapse markers must NOT seed a `cleared`
// event for a culprit (it false-fired `cleared_culprit_conflict` and blocked the run).
const CLEARANCE_NEGATION_RE = /\b(?:no longer|had once|once cleared|false alibi|collapsed|crumbled|unravell?ed|fell apart|failed|broke|no alibi|never (?:had|held))\b/i;
// Roadmap S3 — reveal-teardown vocabulary: a culprit's apparent clearance overturned by the reveal.
// Kept distinct from CLEARANCE_NEGATION_RE (the alibi-mechanics verbs) so both read clearly.
const CLEARANCE_REVEAL_RE = /\b(?:but|yet|however|in (?:truth|fact|reality)|actually|revealed|unmask(?:ed)?|exposed|confess(?:ed|es|ion)|lied|deception|guilty|the (?:real )?(?:culprit|killer|murderer)|was (?:in fact )?(?:the )?(?:culprit|killer|murderer|guilty)|had done it|committed the)\b/i;
/** True when a culprit's clearance sentence is overturned within a short window (this + next 2 sentences). */
const clearanceOverturnedNear = (sentences: string[], index: number): boolean => {
  const windowText = sentences.slice(index, index + 3).join(' ');
  return CLEARANCE_NEGATION_RE.test(windowText) || CLEARANCE_REVEAL_RE.test(windowText);
};
// ANALYSIS_43 Phase 2 (G): a sentence that OPENS with an explicit recollection/flashback
// frame is a remembered moment, not a live appearance — so it must not count as
// `active_dialogue` for a deceased victim. Anchored to the sentence start so it cannot be
// tripped by an incidental mid-sentence "remembered"; the deterministic victim rescue
// emits exactly this frame ("In a remembered moment, ...") to clear a false reappearance.
export const RECOLLECTION_FRAME_RE = /^\s*(?:in a remembered moment\b|in life\b|before (?:she|he|they) (?:died|was killed|was murdered)\b|the memory of\b|[A-Z][a-z]+ (?:remembered|recalled) (?:how|that|the)\b)/i;

const normalizeName = (value: string): string => value.toLowerCase().replace(/\s+/g, ' ').trim();

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sentenceSplit = (text: string): string[] =>
  String(text ?? '')
    .match(/[^.!?\n]+[.!?]*/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? [];

const getRole = (entry: any): string =>
  String(entry?.role_archetype ?? entry?.roleArchetype ?? entry?.role ?? '').toLowerCase();

const getVictimNames = (cml?: CMLData): string[] =>
  ((cml as any)?.CASE?.cast ?? [])
    .filter((entry: any) => getRole(entry).includes('victim'))
    .map((entry: any) => String(entry?.name ?? '').trim())
    .filter(Boolean);

const getCulpritNames = (cml?: CMLData): string[] =>
  ((cml as any)?.CASE?.culpability?.culprits ?? [])
    .map((name: unknown) => String(name ?? '').trim())
    .filter(Boolean);

const getCastNames = (story: Story, cml?: CMLData): string[] => {
  const names = new Set<string>();
  ((cml as any)?.CASE?.cast ?? []).forEach((entry: any) => {
    const name = String(entry?.name ?? '').trim();
    if (name) names.add(name);
  });
  (story.metadata?.cast ?? []).forEach((name) => {
    const trimmed = String(name ?? '').trim();
    if (trimmed) names.add(trimmed);
  });
  return Array.from(names);
};

const nameInSentence = (sentence: string, name: string): boolean =>
  new RegExp(`\\b${escapeRegExp(name)}\\b`, 'i').test(sentence);

const isPossessiveObjectOnly = (sentence: string, name: string): boolean => {
  const escaped = escapeRegExp(name);
  const possessiveOnly = new RegExp(`\\b${escaped}(?:'s|\\u2019s)\\b`, 'i').test(sentence);
  const directName = new RegExp(`\\b${escaped}\\b(?!['\\u2019]s)`, 'i').test(sentence);
  return possessiveOnly && !directName;
};

const hasActiveUse = (sentence: string, name: string): boolean => {
  if (!nameInSentence(sentence, name)) return false;
  if (isPossessiveObjectOnly(sentence, name)) return false;
  // A sentence explicitly framed as recollection/flashback is not a live appearance.
  if (RECOLLECTION_FRAME_RE.test(sentence)) return false;
  const escaped = escapeRegExp(name);
  const subjectPattern = new RegExp(`\\b${escaped}\\b[^.!?]{0,80}${ACTIVE_VERB_RE.source}`, 'i');
  const dialoguePattern = new RegExp(`[\\u201c"]?[^\\u201d"]{0,160}[\\u201d"]?\\s*,?\\s*\\b${escapeRegExp(name.split(/\s+/).slice(-1)[0])}\\b\\s+(?:said|asked|replied|answered|confessed|admitted)\\b`, 'i');
  return subjectPattern.test(sentence) || dialoguePattern.test(sentence);
};

// RC4.4 (A_61 / run_33ecb4ad): a confession sentence that names this character as the OBJECT of the
// killing — "I killed <name>", "I strangled <name>" — makes them the VICTIM, not the confessor. The
// culprit's confession routinely names the victim ("I killed Lady Beatrice Ellsworth"), which otherwise
// false-fires `deceased_character_confesses` on the victim (the name-in-sentence class, cf. A_58 VICTIM
// ALIVE). Exclude the confession attribution when the character's name/surname follows a first-person
// harm verb. (The victim-as-SUBJECT confession — "Margaret Langley confessed …" — is untouched.)
const CONFESSION_KILL_VERB_RE = 'killed|murdered|poisoned|struck|shot|stabbed|strangled|slew|slain|smothered|drowned|throttled|did away with';
const isConfessionKillObject = (sentence: string, name: string): boolean => {
  const surname = name.split(/\s+/).slice(-1)[0] ?? name;
  const alt = Array.from(new Set([name, surname].filter(Boolean))).map(escapeRegExp).join('|');
  if (!alt) return false;
  return new RegExp(`\\bi\\s+(?:${CONFESSION_KILL_VERB_RE})\\b[^.!?]{0,30}?\\b(?:${alt})\\b`, 'i').test(sentence);
};

const addEvent = (
  ledger: CharacterLifecycleLedger,
  event: CharacterLifecycleEvent,
): void => {
  const key = normalizeName(event.characterName);
  ledger.byCharacter[key] = [...(ledger.byCharacter[key] ?? []), event];
};

export function buildCharacterLifecycleLedger(story: Story, cml?: CMLData): CharacterLifecycleLedger {
  const ledger: CharacterLifecycleLedger = { byCharacter: {} };
  const castNames = getCastNames(story, cml);
  const victimNames = getVictimNames(cml);
  const culpritNames = getCulpritNames(cml);
  const culpritKeys = new Set(Array.from(culpritNames).map(normalizeName));

  for (const victimName of victimNames) {
    addEvent(ledger, {
      characterName: victimName,
      status: 'victim',
      chapterNumber: 0,
      evidence: 'CML cast role marks character as victim',
      source: 'cml',
      strength: 'hard',
    });
  }

  for (const culpritName of culpritNames) {
    addEvent(ledger, {
      characterName: culpritName,
      status: 'culprit',
      chapterNumber: 0,
      evidence: 'CML culpability marks character as culprit',
      source: 'cml',
      strength: 'hard',
    });
  }

  for (const scene of story.scenes ?? []) {
    const text = scene.text ?? '';
    const sentences = sentenceSplit(text);
    for (let si = 0; si < sentences.length; si++) {
      const sentence = sentences[si];
      for (const name of castNames) {
        if (!nameInSentence(sentence, name)) continue;

        if (DEATH_RE.test(sentence)) {
          addEvent(ledger, {
            characterName: name,
            status: 'deceased',
            chapterNumber: scene.number,
            evidence: sentence,
            source: 'prose',
            strength: 'heuristic',
          });
        }

        if (hasActiveUse(sentence, name)) {
          addEvent(ledger, {
            characterName: name,
            status: 'active_dialogue',
            chapterNumber: scene.number,
            evidence: sentence,
            source: 'prose',
            strength: 'heuristic',
          });
        }

        // A confession explicitly framed as recollection/flashback is not a LIVE confession
        // by the (dead) character — mirror the hasActiveUse() recollection exclusion so the
        // canonical-victim rescue's "In a remembered moment, …" reframe clears this event.
        if (
          CONFESSION_RE.test(sentence) &&
          !RECOLLECTION_FRAME_RE.test(sentence) &&
          !isConfessionKillObject(sentence, name)
        ) {
          addEvent(ledger, {
            characterName: name,
            status: 'confesses',
            chapterNumber: scene.number,
            evidence: sentence,
            source: 'prose',
            strength: 'heuristic',
          });
        }

        // A_50 §9 + roadmap S3: don't seed a `cleared` event for the CULPRIT when the clearance is
        // negated/demolished — that is the reveal tearing down a false alibi, not an exoneration, and it
        // false-fired cleared_culprit_conflict. A reveal usually overturns in the NEXT sentence ("…her
        // alibi cleared her. But the detective proved she had lied."), so the teardown is checked over a
        // short window (this + next 2 sentences), and the vocabulary includes reveal language, not just
        // "collapsed"-style verbs. A genuine standalone clearance of the culprit with no teardown nearby
        // still fires (both-directions tested).
        if (
          CLEARED_RE.test(sentence) &&
          !(culpritKeys.has(normalizeName(name)) && clearanceOverturnedNear(sentences, si))
        ) {
          addEvent(ledger, {
            characterName: name,
            status: 'cleared',
            chapterNumber: scene.number,
            evidence: sentence,
            source: 'prose',
            strength: 'heuristic',
          });
        }
      }
    }
  }

  return ledger;
}

const earliestChapter = (events: CharacterLifecycleEvent[], statuses: CharacterLifecycleStatus[]): number | undefined => {
  const chapters = events
    .filter((event) => statuses.includes(event.status))
    .map((event) => event.chapterNumber)
    .filter((chapter) => chapter > 0);
  return chapters.length > 0 ? Math.min(...chapters) : undefined;
};

export function validateCharacterLifecycle(story: Story, cml?: CMLData): ValidationError[] {
  const ledger = buildCharacterLifecycleLedger(story, cml);
  const errors: ValidationError[] = [];

  for (const [key, events] of Object.entries(ledger.byCharacter)) {
    const displayName = events[0]?.characterName ?? key;
    const isVictim = events.some((event) => event.status === 'victim');
    const isCulprit = events.some((event) => event.status === 'culprit');
    const deathChapter = earliestChapter(events, ['deceased']);
    const effectiveDeathChapter = deathChapter ?? (isVictim ? 1 : undefined);

    if (isVictim && isCulprit) {
      errors.push({
        type: 'victim_culprit_conflict',
        message: `${displayName} is marked as both victim and culprit`,
        severity: 'critical',
        suggestion: 'Victim and culprit assignments must be mutually exclusive unless the schema explicitly supports a false death.'
      });
    }

    if (effectiveDeathChapter != null) {
      const activeAfterDeath = events.find(
        (event) => event.status === 'active_dialogue' && event.chapterNumber > effectiveDeathChapter,
      );
      if (activeAfterDeath) {
        errors.push({
          type: 'victim_reappears_alive',
          message: `${displayName} is dead/victim by chapter ${effectiveDeathChapter} but appears active in chapter ${activeAfterDeath.chapterNumber}`,
          severity: 'critical',
          sceneNumber: activeAfterDeath.chapterNumber,
          suggestion: 'Do not give active dialogue/action to a confirmed dead victim; correct the victim or culprit identity.',
          details: {
            characterName: displayName,
            deadByChapter: effectiveDeathChapter,
            reappearsChapter: activeAfterDeath.chapterNumber,
          },
        });
      }

      const confessionAfterDeath = events.find(
        (event) => event.status === 'confesses' && event.chapterNumber >= effectiveDeathChapter,
      );
      if (confessionAfterDeath) {
        errors.push({
          type: 'deceased_character_confesses',
          message: `${displayName} is dead/victim but has confession language in chapter ${confessionAfterDeath.chapterNumber}`,
          severity: 'critical',
          sceneNumber: confessionAfterDeath.chapterNumber,
          suggestion: 'Assign confession language only to a living culprit.',
          details: {
            characterName: displayName,
            deadByChapter: effectiveDeathChapter,
            confessesChapter: confessionAfterDeath.chapterNumber,
          },
        });
      }
    }

    const clearedChapter = earliestChapter(events, ['cleared']);
    if (clearedChapter != null && isCulprit) {
      errors.push({
        type: 'cleared_culprit_conflict',
        message: `${displayName} is cleared in chapter ${clearedChapter} but also marked as culprit`,
        severity: 'major',
        sceneNumber: clearedChapter,
        suggestion: 'If this is a false clearance, mark it explicitly in the outline; otherwise do not clear the culprit.'
      });
    }
  }

  return errors;
}

export class CharacterLifecycleValidator implements Validator {
  name = 'CharacterLifecycleValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    const errors = validateCharacterLifecycle(story, cml);
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
