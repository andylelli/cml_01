/**
 * A_75 §6.3 (P3.1) — the rule, enforced.
 *
 *   > Text the pipeline writes for itself is held to the same standard as text the model writes.
 *
 * Until X4 that standard ran in one direction only. `RESOLUTION_VERDICT_CLOSER_RULES` failed the MODEL
 * for writing a summary verdict, and `enforceCulpritEvidencePresence` wrote one on every firing — 5
 * injections, 10 violations, a 100% violation rate across the archived runs — and shipped it, because
 * ADR-0003 says injections stand. Three external readers quoted the result back as generator residue.
 *
 * X4 fixed one sentence. THIS makes the class unrepresentable, and the sweep at the bottom is the part
 * that does the work: a new floor cannot be added in a violating form, and cannot be added without
 * declaring itself, without failing here. That is the difference between a repair and a rule.
 */

import { describe, expect, it } from 'vitest';

import * as templates from '../agent9-prose/injection-templates.js';
import { INJECTION_BUILDERS, isInjectedSentence } from '../agent9-prose/injection-templates.js';
import { RESOLUTION_VERDICT_CLOSER_RULES, findModelBoundRuleViolations } from '../agent9-prose/lint.js';

/** Key-term bags of the shape `composeProseTermPhrase` emits — not tidy noun phrases. */
const CLUE = { description: 'Victim last seen alive minutes past', pointsTo: 'Temporal conflict hale alibi' };

const live = INJECTION_BUILDERS.filter((b) => b.status === 'live');
const superseded = INJECTION_BUILDERS.filter((b) => b.status === 'superseded');

/**
 * The model is failed per SENTENCE, so an injected paragraph is checked per sentence too. A verdict
 * closer buried as the second sentence of a two-sentence injection is the shape the B5 floor produced
 * on the run that started all this.
 */
const sentencesOf = (text: string): string[] =>
  text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

describe('every LIVE injection builder obeys the rules the model is held to', () => {
  it.each(live.map((b) => [b.id, b] as const))('%s breaks no model-bound rule', (_id, builder) => {
    const specimen = builder.specimen();
    const violations = sentencesOf(specimen).flatMap((s) => findModelBoundRuleViolations(s).map((r) => r.id));
    expect(violations).toEqual([]);
  });

  /**
   * Property #2 of injection-templates.ts. A compliant sentence that no checker recognises is WORSE
   * than a non-compliant one: geometry then reports `met` where it should report `met_by_injection`,
   * and the injector-retirement metric goes blind to the injector most worth retiring. That is exactly
   * what happened to the clue floor, undetected, for the life of the project.
   */
  it.each(live.map((b) => [b.id, b] as const))('%s is still recognisable as machine text', (_id, builder) => {
    const specimen = builder.specimen();
    const recognised = sentencesOf(specimen).some((s) => isInjectedSentence(s));
    expect(recognised).toBe(true);
  });
});

describe('the superseded builders are pinned, not forgotten', () => {
  it('there is at least one, and it names its replacement', () => {
    expect(superseded.length).toBeGreaterThan(0);
    for (const b of superseded) {
      expect(b.supersededBy, `${b.id} must name what replaced it`).toBeTruthy();
      expect(INJECTION_BUILDERS.some((x) => x.id === b.supersededBy && x.status === 'live')).toBe(true);
    }
  });

  it('buildCulpritEvidenceSentence still breaks exactly the two rules X4 counted', () => {
    // The pin. If this ever passes clean, the defect was silently reworded and the 100%-violation
    // measurement in the file header no longer describes anything.
    const s = templates.buildCulpritEvidenceSentence('Hugo Vane');
    expect(findModelBoundRuleViolations(s).map((r) => r.id).sort())
      .toEqual(['verdict_closer.beyond', 'verdict_closer.was_responsible']);
  });
});

describe('THE SWEEP — no builder can exist outside the registry', () => {
  /**
   * Without this, the registry is a list someone remembers to update. With it, adding
   * `buildSomethingSentence` to the module and not declaring it fails the suite, and declaring it
   * subjects it to both checks above. This is what turns P3 from a repair into a rule.
   */
  const exportedBuilders = Object.entries(templates)
    .filter(([name, value]) => /^build[A-Z]/.test(name) && typeof value === 'function')
    .map(([name]) => name);

  it('finds the builders (a sweep that matches nothing would pass silently)', () => {
    expect(exportedBuilders.length).toBeGreaterThanOrEqual(6);
  });

  it('every exported build* function is declared in INJECTION_BUILDERS', () => {
    const declared = new Set(INJECTION_BUILDERS.map((b) => b.id));
    const undeclared = exportedBuilders.filter((name) => !declared.has(name));
    expect(undeclared, 'add these to INJECTION_BUILDERS with a specimen and a status').toEqual([]);
  });

  it('every declared id names a real exported function', () => {
    const missing = INJECTION_BUILDERS
      .map((b) => b.id)
      .filter((id) => typeof (templates as Record<string, unknown>)[id] !== 'function');
    expect(missing, 'a registry entry with no builder behind it checks nothing').toEqual([]);
  });
});

describe('the rules themselves are reachable', () => {
  it('RESOLUTION_VERDICT_CLOSER_RULES is non-empty — an empty rule array passes everything', () => {
    expect(RESOLUTION_VERDICT_CLOSER_RULES.length).toBeGreaterThan(0);
  });
});

describe('BOTH SIDES OF THE FLAG — a lever may not smuggle in a violating shape', () => {
  /**
   * `AGENT9_CLUE_LIST_GRAMMAR` changes what the largest injector writes. A flag-gated rendering that
   * obeys the rules when OFF and breaks them when ON is a defect that no default-state suite can see,
   * and this project ships increments default-OFF as a matter of course — so the OFF suite is the only
   * one that ever runs until a probe turns the flag on in production.
   *
   * The env is read at CALL time precisely so this test can drive it.
   */
  const withFlag = <T>(value: string | undefined, fn: () => T): T => {
    const prev = process.env.AGENT9_CLUE_LIST_GRAMMAR;
    if (value === undefined) delete process.env.AGENT9_CLUE_LIST_GRAMMAR;
    else process.env.AGENT9_CLUE_LIST_GRAMMAR = value;
    try {
      return fn();
    } finally {
      if (prev === undefined) delete process.env.AGENT9_CLUE_LIST_GRAMMAR;
      else process.env.AGENT9_CLUE_LIST_GRAMMAR = prev;
    }
  };

  it('the flag actually changes the text (a no-op lever would pass every check below)', () => {
    const off = withFlag(undefined, () => templates.buildClueInferenceParagraph([CLUE]));
    const on = withFlag('true', () => templates.buildClueInferenceParagraph([CLUE]));
    expect(on).not.toEqual(off);
    expect(off).toContain('bent the trail toward');
    expect(on).toContain('What it pointed to:');
  });

  it.each([['off', undefined], ['on', 'true']] as const)(
    'with the flag %s, the clue floor breaks no model-bound rule and stays recognisable',
    (_label, value) => {
      withFlag(value, () => {
        for (const text of [
          templates.buildClueInferenceParagraph([CLUE]),
          templates.buildClueInferenceParagraph([CLUE, { description: 'Scrape on the ledge' }]),
          templates.buildClueInferenceSentence({ description: 'Scrape on the ledge' }),
        ]) {
          const sentences = sentencesOf(text);
          expect(sentences.flatMap((s) => findModelBoundRuleViolations(s).map((r) => r.id))).toEqual([]);
          expect(sentences.some((s) => isInjectedSentence(s))).toBe(true);
        }
      });
    },
  );

  it('the operands never share a sentence with the investigator name — abort class #6 stays closed', () => {
    // The run-killer this builder is shaped around: a cast name and the key terms in ONE sentence let
    // the lifecycle validator's death heuristic mark the DETECTIVE deceased.
    for (const value of [undefined, 'true'] as const) {
      withFlag(value, () => {
        const observation = templates.buildClueObservationParagraph('Eleanor Voss', CLUE.description, false);
        const nameBearing = sentencesOf(observation).filter((s) => s.includes('Eleanor Voss'));
        expect(nameBearing).toHaveLength(1);
        expect(nameBearing[0]).not.toContain(CLUE.description);
      });
    }
  });
});
