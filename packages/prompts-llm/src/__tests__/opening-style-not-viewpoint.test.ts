/**
 * A_76 — the rotation varies the STYLE, but one style had a single realisation.
 *
 * X94 fixed chapter 1 always drawing `character-action`: books opening with the detective's full
 * name fell from 71% (Aug 1–22) to 40% (Aug 23+). But the four post-fix books that still drew that
 * style produced, in effect, one sentence:
 *
 *   "Eleanor Voss pressed her gloved fingertips to the cold marble of the rec..."
 *   "Eleanor Voss pressed her gloved fingertips against the polished brass ra..."
 *   "Eleanor Voss pressed her gloved hand against the cool marble of the Art ..."
 *   "Eleanor Voss pressed her gloved hand to the damp brass rail as she stepp..."
 *
 * The directive said "a named character" and the model resolved that to the viewpoint character every
 * time. `opening_hook` has never scored 9 in 43 reads.
 *
 * The fix is an OPERATION, which A_75 proved this model complies with (unlike a statistic): name
 * someone else, or open on the object. Both break the template.
 */

import { describe, expect, it } from 'vitest';

import { OPENING_STYLE_ROTATION } from '../agent9-prose/context-management.js';

const characterAction = OPENING_STYLE_ROTATION.find((s) => s.style === 'character-action');

describe('the character-action opening cannot collapse onto the viewpoint character', () => {
  it('exists and still asks for a physical action', () => {
    expect(characterAction).toBeDefined();
    expect(characterAction!.directive).toMatch(/physical action or motion/);
  });

  it('forbids the viewpoint character by name', () => {
    expect(characterAction!.directive).toMatch(/NOT be the viewpoint character/);
  });

  it('gives an escape hatch, so a solitary opening is not made impossible', () => {
    // A hard prohibition with no alternative is how a directive gets quietly ignored: if the scene
    // genuinely holds one person, the model must still have something to comply with.
    expect(characterAction!.directive).toMatch(/begin with the OBJECT/);
  });

  it('leaves every other style untouched — one lever, one symptom', () => {
    for (const s of OPENING_STYLE_ROTATION) {
      if (s.style === 'character-action') continue;
      expect(s.directive).not.toMatch(/viewpoint character/);
    }
  });
});
