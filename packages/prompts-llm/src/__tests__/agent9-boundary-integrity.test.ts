import { describe, expect, it } from "vitest";
import { findBoundaryIntegrityFindings } from "../agent9-prose/lint.ts";

// A_106 — the post-pass polish dropped quotation marks on two of three chapter-8 redos of seed 18179
// (52->53 and 48->47), its own acceptance check did not look, and both chapters fell back after the
// batch lint forced retries of prose the model had written correctly. One function now serves both.
describe("findBoundaryIntegrityFindings — one check for the batch lint and the post-pass polish", () => {
  // Shaped on redo 3's chapter 8, paragraph 2, before and after the polish.
  const drafted = [
    "“You all recall the servants’ testimony,” Frances continued, her tone measured. “The clock’s chime was not only faint but delayed that night.” She paused, watching Gerald.",
    "Gerald’s hand stilled on the clock’s casing.",
  ];
  const polished = [
    "\"You all recall the servants’ testimony,\" Frances continued, her tone measured. \"The clock’s chime was not only faint but delayed that night. She paused, watching Gerald.",
    "Gerald’s hand stilled on the clock’s casing.",
  ];

  it("passes the chapter as the model wrote it", () => {
    expect(findBoundaryIntegrityFindings(drafted)).toEqual([]);
  });

  it("flags the chapter after the polish dropped a closing quotation mark", () => {
    expect(findBoundaryIntegrityFindings(polished)).toEqual(["unbalanced quotation marks"]);
  });

  it("counts straight and curly quotes together, as the batch gate always has", () => {
    expect(findBoundaryIntegrityFindings(["“Yes,\" she said."])).toEqual([]);
  });

  it("flags a fused apostrophe token and allows contractions and possessives", () => {
    expect(findBoundaryIntegrityFindings(["The word'paused mid-line."])).toEqual(['malformed apostrophe token "word\'paused"']);
    expect(findBoundaryIntegrityFindings(["She didn't know the detective's name."])).toEqual([]);
  });

  it("returns nothing for an empty chapter", () => {
    expect(findBoundaryIntegrityFindings([])).toEqual([]);
  });
});
