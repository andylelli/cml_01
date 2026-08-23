/**
 * X69 — the motive has no concrete noun, and the rule that asked for one could not be applied.
 *
 * THE READER'S COMPLAINT (08-19 cold read): *"The reveal says Finch would expose 'what he'd been
 * hiding', but the secret needs a concrete noun"* — with examples of what would do: theft from
 * emergency funds, falsified security reports, black-market ration coupons, forged maintenance
 * invoices. One of three fixes the reader priced at 87–89 together.
 *
 * WHAT THE TRACKER ASSUMED, AND WHAT WAS ACTUALLY WRONG. REVIEW_05 recorded X69 as *"nothing checks
 * that it is specific"* and proposed requiring it where the motive is authored. But a MOTIVE
 * SPECIFICITY rule already existed in this prompt, with a passing example naming a forged codicil. It
 * was being ignored, and there is a structural reason:
 *
 *   line 335   "MOTIVE SPECIFICITY (culprit only): The culprit's motiveSeed MUST answer all three..."
 *   line 451   "The culprit is chosen later from the suspects; do NOT mark anyone 'culprit'."
 *
 * **The rule was addressed to an agent explicitly forbidden from identifying its subject.** There was
 * no character Agent 2 could apply it to. Same shape as X70 (a rule keyed to a vocabulary the caller
 * does not use), X73 (a contract the outline author cannot see) and X80 (a router keyed to strings
 * that are never emitted): not a missing check — a rule whose subject does not exist yet.
 *
 * THE FIX is scope, not severity: the standard now binds every name in `possibleCulprits`, which
 * Agent 2 does know and must supply at least three of.
 *
 * MEASURED over the 18 distinct archived culprits — every one of these is a real `motive_seed`, with
 * its `private_secret` beside it:
 *
 *   "Blackmail threat from victim"                       <- "Financial troubles unknown to others"
 *   "Silence Dr. Finch to hide dealings"                 <- "Experimented with hotel clocks as a hobby"
 *   "Jealousy and silencing a potential expose"          <- "Expert in mechanical devices and horology"
 *   "Prevent Dr. Finch's disclosure of damaging secret"  <- "Financial troubles threaten hotel future"
 *
 * Twice the "secret" is not a secret but a SKILL, and twice it has no connection to the motive beside
 * it — the two fields are authored independently and do not refer to the same thing.
 *
 * NO DETECTOR SHIPS WITH THIS, AND THAT IS DELIBERATE. A heuristic was built and measured against
 * those 18: it flagged 6, and its misses included every example above. "A concrete noun is not a
 * regex" — the tracker's own warning — held. Widening the wordlist would be the X62/X74 trap. This
 * check belongs to a reader or a judge, not to a pattern.
 */

import { describe, expect, it } from 'vitest';

import { buildCastPrompt } from '../agent2-cast.js';

/**
 * The prompt is hard-wrapped, so a phrase can straddle a newline. Collapse whitespace once and assert
 * with plain strings — a regex here would only be a place to lose an escape.
 */
const promptText = (): string => {
  const p = buildCastPrompt({
    runId: 'x69-test',
    projectId: 'test',
    setting: '1930s seaside hotel',
    crimeType: 'Murder',
    tone: 'Classic Golden Age',
    castSize: 6,
    characterNames: ['Eleanor Voss', 'Hugo Vane', 'Beatrice Quill', 'Ivor Hale', 'Sylvia Trent', 'Marjorie Ash'],
  }) as unknown as Record<string, string>;
  return [p.system, p.developer, p.user].filter(Boolean).join('\n').replace(/\s+/g, ' ');
};

describe('the motive rule binds a subject Agent 2 can identify', () => {
  it('scopes to possibleCulprits, not to "the culprit"', () => {
    const text = promptText();
    expect(text).toContain('applies to EVERY name you put in crimeDynamics.possibleCulprits');
    // The old scoping is what made it inapplicable. It must not come back.
    expect(text).not.toContain('MOTIVE SPECIFICITY (culprit only)');
  });

  it('says out loud that the culprit is not yet known', () => {
    // Without this the model may still guess a culprit and apply the rule to one character.
    expect(promptText()).toContain('You do not know which of them becomes the culprit');
  });

  it('still asks the original three questions', () => {
    const text = promptText();
    expect(text).toContain("What the character gains from the victim's death");
    expect(text).toContain('What the victim knew, or was about to do');
    expect(text).toContain('Why killing was preferred over a non-lethal alternative');
  });
});

describe('it names the thing, and names the failure modes from the corpus', () => {
  it('demands a named act, document, sum or object', () => {
    const text = promptText();
    expect(text).toContain('MUST NAME THE THING');
    expect(text).toContain('specific act, document, sum, or object');
  });

  it('quotes the corpus back as failing examples', () => {
    // REVIEW_12 §3.2's lesson: naming the anti-pattern gives a model that believes it complied
    // something concrete to change. These are real archived values, not invented ones.
    const text = promptText();
    expect(text).toContain("what he'd been hiding");
    expect(text).toContain('Blackmail threat from victim');
    expect(text).toContain('Silence him to hide his dealings');
  });

  it('binds privateSecret to the same thing the motive refers to', () => {
    const text = promptText();
    expect(text).toContain('The same rule binds privateSecret');
    // The two archived failure shapes: a category, and a skill.
    expect(text).toContain('Financial troubles unknown to others');
    expect(text).toContain('Expert in horology');
  });
});

describe('the rule is generic across story parameters', () => {
  it('names no era, setting or mechanism in the rule body', () => {
    const body = promptText().split('MOTIVE SPECIFICITY')[1]!.slice(0, 1800).toLowerCase();
    for (const word of ['clock', 'pendulum', 'seaside', '1930']) {
      expect(body, word).not.toContain(word);
    }
  });
});
