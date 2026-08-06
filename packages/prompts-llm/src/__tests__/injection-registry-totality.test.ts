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

import { SCAFFOLD_EXHAUSTION_FLOORS } from "../agent9-prose/regen-integration.js";
import {
  INJECTED_SENTENCE_PATTERNS,
  buildCulpritEvidenceSentence,
  buildSuspectClearanceSentence,
  isInjectedSentence,
} from "../agent9-prose/injection-templates.js";

/**
 * A floor's `replacement` is a `String.replace` template, so it can carry `$1` for the name the floor
 * captured. Substituting a plausible one is the only way to ask "would the sentence this floor
 * produces be recognised?" — and the name must be plausible, because the patterns bound how much text
 * may sit between the template's fixed words.
 */
const materialise = (replacement: string): string =>
  replacement.replace(/\$(\d)/g, "Captain Ivor Hale");

describe("X13 — every scaffold floor's output is in the injection registry", () => {
  it("has floors to check, so a vacuous pass is impossible", () => {
    expect(SCAFFOLD_EXHAUSTION_FLOORS.length).toBeGreaterThan(0);
  });

  it.each(SCAFFOLD_EXHAUSTION_FLOORS.map((f) => [f.rule, f.replacement] as const))(
    "recognises what the %s floor rewrites an injected sentence into",
    (rule, replacement) => {
      const shipped = materialise(replacement);
      expect(
        isInjectedSentence(shipped),
        `The ${rule} floor produces "${shipped}", which no INJECTED_SENTENCE_PATTERNS entry matches. ` +
          `Geometry would score that sentence as authored prose and met_by_injection_count would ` +
          `under-report. Add the laundered form to injection-templates.ts.`,
      ).toBe(true);
    },
  );

  /**
   * The other direction. The floors rewrite what the injectors write, so the ORIGINAL phrasings must
   * be recognised too — a floor only fires when its `re` matches, and on a run where none does, the
   * injector's own sentence is what ships.
   */
  it.each([
    ["culprit evidence", buildCulpritEvidenceSentence("Captain Ivor Hale")],
    ["suspect clearance", buildSuspectClearanceSentence("Hale")],
  ])("recognises the %s injector's own sentence, before any floor rewrites it", (_label, sentence) => {
    expect(isInjectedSentence(sentence)).toBe(true);
  });

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

  it("keeps every pattern anchored to template wording rather than to a name", () => {
    // A pattern that matched a NAME would fire on any sentence about that character. Every entry must
    // still match after the name is changed, which is the property that makes the registry portable
    // across runs.
    const withOtherName = buildCulpritEvidenceSentence("Beatrice Quill");
    expect(isInjectedSentence(withOtherName)).toBe(true);
    expect(INJECTED_SENTENCE_PATTERNS.some((re) => /Hale|Ivor|Captain/i.test(re.source))).toBe(false);
  });
});
