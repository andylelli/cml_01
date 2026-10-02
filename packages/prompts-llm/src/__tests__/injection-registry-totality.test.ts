/**
 * X13 (architecture/REVIEW_05.md §27.3) — the injection registry must know every LAUNDERED form.
 *
 * §10.1 recorded this test as shipped and it was not built. The gap it leaves is specific and quiet:
 * `INJECTED_SENTENCE_PATTERNS` exists so geometry can tell the pipeline's own sentences from prose,
 * and `enforceCulpritEvidencePresence`'s sentence is NOT what reaches the page — the B5 scaffold floor
 * rewrites it first. A registry holding only the injector's phrasing matched nothing on the run that
 * motivated the whole item.
 *
 * So every `SCAFFOLD_EXHAUSTION_FLOORS` entry is a second body of the same fact, and the two are
 * maintained in different files by different hands. A third floor added without a matching pattern
 * would launder an injected sentence past the detector in silence, and `met_by_injection_count` — the
 * exit metric THINK_01 Move 5 and §12.4 both depend on — would under-report with nothing saying so.
 *
 * This asserts the correspondence rather than the wording: the floors may say what they like, so long
 * as what they PRODUCE is recognisable as machine text.
 */

import { describe, expect, it } from "vitest";
import { INJECTED_SENTENCE_PATTERNS, isInjectedSentence } from "../prose-contract/injected-sentences.js";


/**
 * A floor's `replacement` is a `String.replace` template, so it can carry `$1` for the name the floor
 * captured. Substituting a plausible one is the only way to ask "would the sentence this floor
 * produces be recognised?" — and the name must be plausible, because the patterns bound how much text
 * may sit between the template's fixed words.
 */
/**
 * A floor's replacement may be a template string OR a builder function (A_80 item 3: the B5 floor now
 * calls `buildCulpritEvidenceSentenceInScene` rather than substituting a fixed phrase, because the
 * fixed phrase it used to write was itself a registered piece of generator residue). Both shapes must
 * be materialised into the sentence that would actually ship, or this test stops checking the floor
 * whose output changed — which is the one worth checking.
 */
const materialise = (replacement: string | ((...args: string[]) => string)): string =>
  typeof replacement === "function"
    ? replacement("", "Captain Ivor Hale")
    : replacement.replace(/\$(\d)/g, "Captain Ivor Hale");

describe("X13 — every scaffold floor's output is in the injection registry", () => {

  it("does not match authored prose that merely discusses responsibility", () => {
    // The guard on widening: these are the shapes a novelist writes, and none may be scored as
    // machine text. `was responsible` is deliberately narrower than bare `responsible`.
    for (const authored of [
      "Hale was responsible for the arrangements that evening, and did them badly.",
      "She had killed him, and said so without any prompting at all.",
      "The evidence was overwhelming, and Hale did not trouble to deny it.",
    ]) {
      expect(isInjectedSentence(authored), authored).toBe(false);
    }
  });
});
