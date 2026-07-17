import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CONFIG,
  getGenerationParams,
  getPronounPolicySettings,
  resetGenerationParamsCacheForTests,
  type GenerationParamsConfig,
  type PronounPolicy,
} from '../generation-params.js';
import {
  ProseConsistencyValidator,
  detectAttributionFlips,
  detectImpossibleSelfReferences,
  detectPronounDriftEvents,
  type PronounDriftCastEntry,
} from '../prose-consistency-validator.js';
import type { CMLData, Scene, Story } from '../types.js';

// ITEM 13 — pronoun drift: detection back on ("verify") WITHOUT the corrupting deterministic fixer.
// Both directions everywhere: the defect is caught, the legitimate case is untouched.

const withPolicy = (
  policy: PronounPolicy | undefined,
  checking: boolean,
  validation: boolean,
): GenerationParamsConfig => ({
  ...DEFAULT_CONFIG,
  agent9_prose: {
    ...DEFAULT_CONFIG.agent9_prose,
    validation: {
      pronoun_policy: policy,
      pronoun_checking_enabled: checking,
      pronoun_validation_enabled: validation,
    },
  },
});

describe('pronoun_policy "verify" — detection on, deterministic repair off', () => {
  it('"verify" resolves to checkingEnabled=false (no prose-writing fixer) + validationEnabled=true (errors reported)', () => {
    const settings = getPronounPolicySettings(withPolicy('verify', true, true));
    expect(settings.policy).toBe('verify');
    expect(settings.checkingEnabled).toBe(false);
    expect(settings.validationEnabled).toBe(true);
  });

  it('"strict" and "off" are unchanged (both directions)', () => {
    const strict = getPronounPolicySettings(withPolicy('strict', false, false));
    expect(strict).toEqual({ policy: 'strict', checkingEnabled: true, validationEnabled: true });
    const off = getPronounPolicySettings(withPolicy('off', true, true));
    expect(off).toEqual({ policy: 'off', checkingEnabled: false, validationEnabled: false });
  });

  it('legacy flag pair (checking=false, validation=true) derives "verify" when no policy is set', () => {
    const settings = getPronounPolicySettings(withPolicy(undefined, false, true));
    expect(settings.policy).toBe('verify');
    expect(settings.checkingEnabled).toBe(false);
    expect(settings.validationEnabled).toBe(true);
  });

  it('the live YAML now ships pronoun_policy=verify (pins the config change)', () => {
    resetGenerationParamsCacheForTests();
    const live = getPronounPolicySettings(getGenerationParams());
    expect(live.policy).toBe('verify');
    expect(live.checkingEnabled).toBe(false);
    expect(live.validationEnabled).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// High-precision drift detectors
// ---------------------------------------------------------------------------

const CAST: PronounDriftCastEntry[] = [
  { name: 'Eleanor Fairfax', gender: 'female' },
  { name: 'Edmund Hale', gender: 'male' },
];

function makeScene(overrides: Partial<Scene> & { text: string }): Scene {
  return { number: 1, title: 'Scene', ...overrides };
}
function makeStory(scenes: Scene[]): Story {
  return { id: 's1', projectId: 'p1', scenes };
}
function makeCML(cast: Array<{ name: string; gender: string }>): CMLData {
  return { CASE: { meta: {}, cast, culpability: { culprits: [] } } } as unknown as CMLData;
}

describe('detectAttributionFlips', () => {
  it('fires on an S0-style flip: female narration referent, male dialogue tag, no male nearby', () => {
    const text =
      'Eleanor Fairfax studied the ledger by lamplight, tracing the crooked column of figures.\n\n' +
      '"The figures do not balance," he observed.';
    const events = detectAttributionFlips(text, CAST);
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe('attribution_flip');
    expect(events[0].characterName).toBe('Eleanor Fairfax');
    expect(events[0].sentence).toContain('he observed');
  });

  it('does NOT fire when a male cast member appears between the female referent and the tag', () => {
    const text =
      'Eleanor Fairfax studied the ledger by lamplight.\n\n' +
      'Edmund Hale leaned over the desk and tapped the crooked column of figures.\n\n' +
      '"The figures do not balance," he observed.';
    expect(detectAttributionFlips(text, CAST)).toHaveLength(0);
  });

  it('does NOT fire when the tag pronoun agrees with the nearest gendered referent', () => {
    const text =
      'Eleanor Fairfax studied the ledger by lamplight.\n\n' +
      '"The figures do not balance," she observed.';
    expect(detectAttributionFlips(text, CAST)).toHaveLength(0);
  });

  it('does NOT fire on a pronoun+speech-verb inside dialogue (quote-parity guard)', () => {
    const text =
      'Eleanor Fairfax lowered the letter and frowned at the page. ' +
      'The words were plain enough: "he said nothing of the ledger to anyone."';
    expect(detectAttributionFlips(text, CAST)).toHaveLength(0);
  });

  it('does NOT fire for ungendered cast (skip, never guess)', () => {
    const text =
      'Eleanor Fairfax studied the ledger.\n\n"The figures do not balance," he observed.';
    expect(detectAttributionFlips(text, [{ name: 'Eleanor Fairfax' }])).toHaveLength(0);
  });
});

describe('detectImpossibleSelfReferences', () => {
  it('fires when an opposite-gender possessive refers back to the sentence subject', () => {
    const text = 'Eleanor Fairfax paused at the mirror and adjusted his gloves before the interview.';
    const events = detectImpossibleSelfReferences(text, CAST);
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe('impossible_self_reference');
    expect(events[0].characterName).toBe('Eleanor Fairfax');
    expect(events[0].sentence).toContain('adjusted his gloves');
  });

  it('fires on an opposite-gender reflexive ("composed himself" for a female subject)', () => {
    const text = 'Eleanor Fairfax composed himself and rang for the maid.';
    const events = detectImpossibleSelfReferences(text, CAST);
    expect(events).toHaveLength(1);
    expect(events[0].characterName).toBe('Eleanor Fairfax');
  });

  it('does NOT fire when a cast member of the pronoun gender is in the paragraph (legitimate reference)', () => {
    const text = 'Eleanor Fairfax handed Edmund Hale his gloves and smiled at the exchange.';
    expect(detectImpossibleSelfReferences(text, CAST)).toHaveLength(0);
  });

  it('does NOT fire when an opposite-gender pronoun intervenes (a second actor is in play)', () => {
    const text = 'Eleanor Fairfax watched as he gathered his gloves from the hall table.';
    expect(detectImpossibleSelfReferences(text, CAST)).toHaveLength(0);
  });

  it('does NOT fire inside quoted dialogue', () => {
    const text = '"Eleanor Fairfax adjusted his gloves, you know," the porter recalled.';
    expect(detectImpossibleSelfReferences(text, CAST)).toHaveLength(0);
  });
});

describe('ProseConsistencyValidator — detector wiring + repair-targeting message contract', () => {
  const validator = new ProseConsistencyValidator();

  it('emits pronoun_drift with the extractPronounTargetNames-parsable message, moderate severity (never critical)', () => {
    const story = makeStory([
      makeScene({
        number: 3,
        text:
          'Eleanor Fairfax studied the ledger by lamplight, tracing the crooked column of figures.\n\n' +
          '"The figures do not balance," he observed.',
      }),
    ]);
    const result = validator.validate(story, makeCML([
      { name: 'Eleanor Fairfax', gender: 'female' },
      { name: 'Edmund Hale', gender: 'male' },
    ]));
    const drift = result.errors.filter((e) => e.type === 'pronoun_drift');
    expect(drift).toHaveLength(1); // detector + window heuristic dedupe to ONE error per character per scene
    expect(drift[0].severity).toBe('moderate'); // repair-not-abort: moderate can never fail a report
    expect(drift[0].sceneNumber).toBe(3);
    // The exact contract agent9-run's extractPronounTargetNames parses for LLM-regen targeting:
    const nameMatch = drift[0].message.match(/Pronoun drift for\s+"([^"]+)"/i);
    expect(nameMatch?.[1]).toBe('Eleanor Fairfax');
    // moderate pronoun_drift must not flip the validator result to invalid (critical-only)
    expect(result.valid).toBe(true);
  });

  it('legitimate prose passes clean (no pronoun_drift)', () => {
    const story = makeStory([
      makeScene({
        number: 1,
        text:
          'Eleanor Fairfax studied the ledger by lamplight.\n\n' +
          '"The figures do not balance," she observed. Edmund Hale nodded and reached for his notebook.',
      }),
    ]);
    const result = validator.validate(story, makeCML([
      { name: 'Eleanor Fairfax', gender: 'female' },
      { name: 'Edmund Hale', gender: 'male' },
    ]));
    expect(result.errors.filter((e) => e.type === 'pronoun_drift')).toHaveLength(0);
  });
});

describe("A_62 Item 13 — FP2 unnamed-role intervener (detector precision)", () => {
  const cast = [
    { name: "Eleanor Voss", gender: "female" },
    { name: "Captain Ivor Hale", gender: "male" },
  ] as any;

  it("FP2 (the RC-4 live FP): an unnamed role carrying the pronoun does NOT fire", () => {
    const fp2 = "As Eleanor spoke, the night porter stepped forward, clearing his throat.";
    expect(detectPronounDriftEvents(fp2, cast)).toEqual([]);
  });

  it("TP1 still fires (recall preserved): a genuine beat mismatch with no role noun", () => {
    const tp1 = "Captain Hale tightened her jaw and looked away.";
    expect(detectPronounDriftEvents(tp1, cast).length).toBeGreaterThan(0);
  });
});
