/**
 * PER-BLOCK CAPS MUST FIT THE CONTENT THE BLOCK ACTUALLY PRODUCES.
 *
 * Every cap in this pipeline was set from an ESTIMATE written in its own comment, and three of them
 * were wrong enough to delete instructions on every prompt of every run:
 *
 *   pronoun_accuracy   comment said "≈560 tokens"   really 852 (6-cast)   cut rules 9 and 10
 *   temporal_context   comment said "850 fits"      really 1620           cut 48% of the block
 *   location_profiles  comment said "1000 fits"     really 1217           cut the SCENE OPENING RULE
 *
 * `pronoun_accuracy` is the one that can be rebuilt from nothing but a cast, so it is pinned here.
 * The other two need a persisted artifact to build, and the FIRST attempt to measure them used a
 * synthetic input, reported "fits", and was worthless — the same error as validating a prose check
 * against a .md export instead of the artifact it reads. Their real sizes are recorded above; anyone
 * changing them must re-measure from `data/store.json`, not from an invented object.
 *
 * Why it matters that pronoun_accuracy in particular fits: the two rules the old cap removed are the
 * dialogue-attribution rules, and `detectAttributionFlips` is a whole detector built for exactly the
 * defect they prevent. We were deleting the prevention and keeping the detector, on a run that
 * shipped 13 pronoun-drift issues.
 */

import { describe, expect, it } from "vitest";

import { buildPronounAccuracyBlock } from "../agent9-prose/prompt-blocks.js";
import { estimateTokenCount, truncateToTokenBudget } from "../agent9-prose/prompt-builder.js";

/** Must match `perBlockTokenCap.pronoun_accuracy` in prompt-builder.ts. */
const PRONOUN_CAP = 1100;

const castOf = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    name: `Character Number${i} Longsurname`,
    gender: i % 2 ? "male" : "female",
    role: i === 0 ? "detective" : "suspect",
  }));

describe("pronoun_accuracy fits its cap at every cast size this pipeline builds", () => {
  it.each([4, 5, 6, 7, 8, 9, 10])("cast of %i fits under the cap", (n) => {
    const block = buildPronounAccuracyBlock(castOf(n));
    const tokens = estimateTokenCount(block);
    expect(tokens, `cast ${n} renders ${tokens}t against a ${PRONOUN_CAP}t cap`).toBeLessThanOrEqual(PRONOUN_CAP);
  });

  it("the dialogue-attribution rules survive the cap — the ones the old 700 removed", () => {
    // Rule 9 (pronoun refers to the SPEAKER) and rule 10 (use the FULL NAME) sat past 700 tokens.
    const block = buildPronounAccuracyBlock(castOf(10));
    const kept = truncateToTokenBudget(block, PRONOUN_CAP);
    expect(kept).not.toContain("[truncated for prompt budget]");
    expect(kept).toContain("FULL NAME");
  });

  it("REGRESSION: the previous cap really did cut them, so this test is not vacuous", () => {
    // A guard that passes whatever the cap is would prove nothing. At the OLD cap the block is cut
    // and rule 10 is gone; that is what makes the assertion above meaningful.
    const block = buildPronounAccuracyBlock(castOf(6));
    const atOldCap = truncateToTokenBudget(block, 700);
    expect(atOldCap).toContain("[truncated for prompt budget]");
    expect(atOldCap).not.toContain("FULL NAME");
  });
});
