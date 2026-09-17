import { describe, expect, it } from "vitest";
import { applyPhraseSubstitutions } from "../agent9-prose/repair.ts";
import { restoreProperNounCasing } from "../agent9-prose/clue-validation.ts";

/**
 * A_89 C1 — the phrase-variety splice lowercased every proper noun but the first word.
 *
 * `replacement` arrives in the lowercase register of the normalised phrases the model was shown, and
 * the casing restore covered only `replacement[0]`. `Nora Gaunt let a flicker…` became `Nora gaunt
 * let a flicker…`. The external reader of run 88651 quoted two such lines as generator scaffolding;
 * MEASURED across the archive with each book's own cast: 4 of 42 books, 15 occurrences.
 */
describe("A_89 C1 — the phrase splice must not lowercase names", () => {
  it("restores a surname inside the replaced span", () => {
    const para = "Julian Quayle stayed silent. Nora Gaunt let a flicker of amusement cross her face.";
    const out = applyPhraseSubstitutions([para], [
      { original: "let a flicker of amusement cross her face", replacement: "allowed herself the ghost of a smile" },
    ]);
    expect(out[0]).toContain("Nora Gaunt");
    expect(out[0]).not.toContain("Nora gaunt");
  });

  it("restores a name carried INSIDE the replacement itself", () => {
    const para = "The room waited. Nora Gaunt permitted herself a fleeting grin at the suggestion.";
    const out = applyPhraseSubstitutions([para], [
      { original: "Nora Gaunt permitted herself a fleeting grin", replacement: "nora gaunt allowed one corner of her mouth to rise" },
    ]);
    expect(out[0]).toContain("Nora Gaunt allowed one corner");
    expect(out[0]).not.toMatch(/nora gaunt/);
  });

  it("CONSERVATIVE: it cannot invent a capital that is not in the source", () => {
    expect(restoreProperNounCasing("she crossed the deck", "he crossed the deck slowly")).toBe("she crossed the deck");
  });

  it("CONSERVATIVE: a sentence-initial capital does not teach it to capitalise mid-sentence", () => {
    // "The" opens a sentence in the source; it must NOT capitalise "the" in the phrase.
    const out = restoreProperNounCasing("crossed the floor", "The floor creaked. Gwendolyn Vance waited.");
    expect(out).toBe("crossed the floor");
  });

  it("REGRESSION: a paragraph-opening capital must not capitalise the same word mid-sentence", () => {
    // The first cut used the matched span PLUS the paragraph as the casing source, which moved
    // the paragraph sentence-initial "The" into a mid-sentence position and taught the helper to
    // capitalise every later "the". Three existing tests caught it. The source is the paragraph.
    const para = "The rain came down in sheets. Fresh rain rattled the casement while she waited.";
    const out = applyPhraseSubstitutions([para], [
      { original: "while she waited", replacement: "as the hour turned" },
    ]);
    expect(out[0]).toContain("rattled the casement");
    expect(out[0]).not.toContain("The casement");
    expect(out[0]).toContain("as the hour turned");
  });

  /**
   * 2026-09-17 bug check. A capital that OPENS a quotation, or follows a colon or a dash, carries no
   * casing information either; the first cut stripped the quote and saw `He said,` — not a sentence
   * end — and wrote "The light through The window".
   */
  it("REGRESSION: a capital opening a quotation does not teach it to capitalise the same word", () => {
    const para = 'He said, "The floor creaked." Then Nora Gaunt let a flicker of amusement cross her face.';
    expect(restoreProperNounCasing("the light through the window", para)).toBe("the light through the window");
    // and a proper noun that sits MID-sentence in the same paragraph is still restored
    expect(restoreProperNounCasing("nora gaunt turned", para)).toBe("Nora Gaunt turned");
  });

  it("REGRESSION: nor does a capital after a colon or a dash", () => {
    expect(restoreProperNounCasing("the clock on the wall", "Two things stood out: The first was the clock. Nora Gaunt said nothing.")).toBe("the clock on the wall");
    expect(restoreProperNounCasing("the clock on the wall", "She turned — The clock had stopped. Nora Gaunt waited.")).toBe("the clock on the wall");
  });

  it("still preserves ALL-CAPS and sentence-opening capitals", () => {
    const para = "NORA GAUNT LET A FLICKER SHOW. Then she turned away.";
    const out = applyPhraseSubstitutions([para], [
      { original: "let a flicker show", replacement: "allowed a smile" },
    ]);
    expect(out[0]).toContain("ALLOWED A SMILE");
  });
});
