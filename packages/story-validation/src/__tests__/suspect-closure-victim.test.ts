/**
 * A_76 — we were hard-stopping runs for failing to clear the murder victim.
 *
 * `suspectNames` excluded culprits and detectives and NOT victims, so a dead character was required
 * to have an on-page elimination with supporting evidence. That failure reached the Agent 9 release
 * gate and threw. It was 2 of 2 corpus-wide validation failures — canary_1785694688532 (Sylvia
 * Trent) and canary_1787090659142 (Eleanor Voss), both `role_archetype: victim`.
 *
 * There was no repair path either: the deterministic floor derives its list from
 * `computeEliminationSuspects`, which HAS excluded victims since A_68, so the injector could never
 * satisfy the validator that was killing the run.
 */

import { describe, expect, it } from 'vitest';

import { SuspectClosureValidator } from '../suspect-closure-validator.js';

const cml = (cast: any[]) => ({
  CASE: {
    cast,
    culpability: { culprits: ['Captain Ivor Hale'] },
  },
} as never);

/** A manuscript that clears the real suspects and says nothing exonerating about the victim. */
const STORY = {
  scenes: [
    {
      sceneNumber: 1,
      text: 'Beatrice Quill was cleared; the reception evidence put her elsewhere. '
        + 'Sylvia Trent was ruled out because the service corridor timeline confirmed it. '
        + 'Hugo Vane could not have been present, and the suite log proved it.',
    },
  ],
} as never;

const CAST = [
  { name: 'Eleanor Voss', role_archetype: 'Detective' },
  { name: 'Dr. Mallory Finch', role_archetype: 'victim' },
  { name: 'Captain Ivor Hale', role_archetype: 'Suspect' },
  { name: 'Beatrice Quill', role_archetype: 'Suspect' },
  { name: 'Sylvia Trent', role_archetype: 'Suspect' },
  { name: 'Hugo Vane', role_archetype: 'Suspect' },
];

describe('the victim is never required to be cleared', () => {
  it('raises no suspect-closure error for the victim', () => {
    // Asserting on the VICTIM specifically, not on overall validity: this validator also checks
    // culprit-evidence closure, which the minimal fixture below deliberately does not satisfy.
    // `r.valid` would therefore be false for a reason that has nothing to do with the fix, and a
    // test that asserts it would be testing the fixture rather than the change.
    const v = new SuspectClosureValidator();
    return v.validate(STORY, cml(CAST)).then((r) => {
      const closure = r.errors.filter((e) => e.type === 'suspect_closure_missing');
      expect(closure.map((e) => e.message ?? '').join(' ')).not.toMatch(/Mallory Finch/);
      expect(closure).toHaveLength(0);
    });
  });

  it('honours culpability.victim as well as the role field', () => {
    // Some cases name the victim only on culpability, with no victim archetype in the cast.
    const noArchetype = CAST.map((c) => (c.name === 'Dr. Mallory Finch' ? { name: c.name, role_archetype: 'Suspect' } : c));
    const withField = {
      CASE: { cast: noArchetype, culpability: { culprits: ['Captain Ivor Hale'], victim: 'Dr. Mallory Finch' } },
    } as never;
    const v = new SuspectClosureValidator();
    return v.validate(STORY, withField).then((r) => {
      expect(r.errors.map((e) => e.message ?? e.type).join(' ')).not.toMatch(/Mallory Finch/);
    });
  });

  it('reads the role through every spelling, not a bare role_archetype substring', () => {
    // X50: castDesign uses `roleArchetype`, cml.CASE.cast uses `role_archetype`, some carry `role`.
    const camel = [
      { name: 'Eleanor Voss', roleArchetype: 'Amateur Sleuth / Civilian Investigator' },
      { name: 'Dr. Mallory Finch', roleArchetype: 'Victim' },
      { name: 'Captain Ivor Hale', roleArchetype: 'Suspect' },
      { name: 'Beatrice Quill', role: 'Suspect' },
      { name: 'Sylvia Trent', role: 'Suspect' },
      { name: 'Hugo Vane', role: 'Suspect' },
    ];
    const v = new SuspectClosureValidator();
    return v.validate(STORY, cml(camel)).then((r) => {
      const msg = r.errors.map((e) => e.message ?? e.type).join(' ');
      expect(msg).not.toMatch(/Mallory Finch/);
      expect(msg).not.toMatch(/Eleanor Voss/);
    });
  });

  it('STILL fails when a genuine suspect is never cleared — the gate must keep working', () => {
    const missing = {
      scenes: [{ sceneNumber: 1, text: 'Beatrice Quill was cleared; the evidence put her elsewhere.' }],
    } as never;
    const v = new SuspectClosureValidator();
    return v.validate(missing, cml(CAST)).then((r) => {
      const msg = r.errors.map((e) => e.message ?? e.type).join(' ');
      expect(msg).toMatch(/Sylvia Trent|Hugo Vane/);
    });
  });
});
