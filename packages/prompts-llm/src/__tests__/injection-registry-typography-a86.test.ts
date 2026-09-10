/**
 * A_86 item 62 — every registered builder must still be recognised AFTER the pipeline's own
 * typography passes have touched it.
 *
 * THE DEFECT THIS GENERALISES (A_85): the "You did it" pattern required a straight quote followed
 * immediately by the sentence. A later pass curls quotes and inserts a space, so the shipped text was
 * `"You did it. ” The words settled…` and `isInjectedSentence` returned FALSE on the floor's own
 * output in 4 of 4 books. Every checker that consumes the registry — the scaffold regen, the
 * clearance-trim scrub, the geometry acceptance — was blind to it.
 *
 * That was fixed for ONE pattern. This makes the CLASS unrepresentable: every live builder's
 * specimen is pushed through the same transformations the pipeline actually applies, and must still
 * be recognised. A new floor whose pattern is typography-fragile fails here rather than in a book.
 */

import { describe, expect, it } from "vitest";
import { INJECTION_BUILDERS, isInjectedSentence } from "../agent9-prose/injection-templates.js";

/** The transformations the shipped text has actually been observed to carry. */
const TRANSFORMS: ReadonlyArray<{ name: string; apply: (s: string) => string }> = [
  { name: "as built", apply: (s) => s },
  { name: "curly double quotes", apply: (s) => s.replace(/"([^"]*)"/g, "“$1”") },
  { name: "curly apostrophes", apply: (s) => s.replace(/'/g, "’") },
  {
    // The exact shape that shipped in run 24901: a space between the stop and the closing quote.
    name: "space before a closing quote",
    apply: (s) => s.replace(/([.!?])"/g, '$1 "').replace(/([.!?])”/g, "$1 ”"),
  },
  {
    name: "curly quotes AND a space before the closing quote",
    apply: (s) => s.replace(/"([^"]*)"/g, "“$1”").replace(/([.!?])”/g, "$1 ”"),
  },
];

const liveBuilders = INJECTION_BUILDERS.filter((b) => b.status === "live");

describe("A_86 item 62 — the registry survives the pipeline's own typography", () => {
  it("there are live builders to check (guards against a vacuous pass)", () => {
    expect(liveBuilders.length).toBeGreaterThan(0);
  });

  for (const builder of liveBuilders) {
    const specimen = builder.specimen();
    for (const transform of TRANSFORMS) {
      it(`${builder.id} is recognised — ${transform.name}`, () => {
        const shipped = transform.apply(specimen);
        expect(isInjectedSentence(shipped)).toBe(true);
      });
    }
  }

  it("authored prose is still not mistaken for an injection under the same transforms", () => {
    const authored = [
      `"You did it, then," she said, and put the cup down.`,
      "The rain had not stopped since Tuesday.",
      "He gathered his notes and left without another word.",
    ];
    for (const line of authored) {
      for (const transform of TRANSFORMS) {
        expect(isInjectedSentence(transform.apply(line))).toBe(false);
      }
    }
  });
});
