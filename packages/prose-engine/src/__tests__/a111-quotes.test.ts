/**
 * A_111 — the nested quote arm D shipped, and the two guards that would have stopped the editor writing it.
 * The writer's draft: `"Let it be clear: Ivor Yardley killed Cecil Thorne."`; the editor, repairing `flat_reveal`:
 * `"Adela looked from Ivor to Harriet, her voice steady. "You killed Cecil Thorne."`. With V-13's set-based cast guard
 * (PROSE_V2_AUDIT_FIXES) nothing reverted it.
 */
import { afterEach, describe, expect, it } from "vitest";

import { applyEditList } from "../edits.js";
import { paragraphQuoteDefects, quoteDefects } from "../quotes.js";
import type { EditList } from "../types.js";

const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});

describe("paragraphQuoteDefects", () => {
  it("counts an opening quote inside an open one, and a closing quote with none open", () => {
    expect(paragraphQuoteDefects('Adela closed her notebook. "Adela looked from Ivor to Harriet. "You killed him."')).toBe(1);
    expect(paragraphQuoteDefects('Adela turned to Ottoline. ""The killer entered by the panel."')).toBe(1);
    expect(paragraphQuoteDefects('"The rest is dust and years. Adela traced the mark again. "This mark was not here."')).toBe(1);
  });
  it("does not count well-formed speech, a dash before a close, or a quote left open for the next paragraph", () => {
    expect(paragraphQuoteDefects('"Absolutely," Adela replied. "The track is new."')).toBe(0);
    expect(paragraphQuoteDefects('Marguerite said, "You cannot mean—" before catching herself.')).toBe(0);
    expect(paragraphQuoteDefects('"There are circumstances—"')).toBe(0);
    expect(quoteDefects('"I went down to the shore, and waited.\n\n"Nobody came," she said.')).toBe(0);
    expect(paragraphQuoteDefects("“Curly,” she said. “Fine.”")).toBe(0);
  });
});

describe("the editor may not write a nested quote, nor un-name the culprit after the reveal (PROSE_V2_AUDIT_FIXES)", () => {
  const fill = "The sunlight slanted across the carpet. Nobody moved to leave, not yet. The panel swung shut.";
  const chapter = {
    title: "Eight",
    paragraphs: [fill, 'Cecil Thorne lay where he had fallen.', 'Adela closed her notebook, the motion deliberate. "Let it be clear: Ivor Yardley killed Cecil Thorne." The words settled in the room.', fill, 'Ivor Yardley said nothing.'],
  };
  const cast = ["Adela Halloway", "Cecil Thorne", "Ivor Yardley", "Harriet Bellamy"];
  const options = { lockedValues: [], castNames: cast, findings: [], culprit: { name: "Ivor Yardley", victim: "Cecil Thorne", cast } };
  const edit = (find: string, replace: string): EditList => ({ edits: [{ find, replace, addresses: [0] }], cannot: [] });
  const nested = edit(
    '"Let it be clear: Ivor Yardley killed Cecil Thorne." The words settled in the room.',
    '"Adela looked from Ivor to Harriet, her voice steady. "You killed Cecil Thorne." The words lingered in the air.',
  );

  it("ON: the nested-quote rewrite is reverted by noNewQuoteDefect", () => {
    process.env.PROSE_V2_AUDIT_FIXES = "1";
    const out = applyEditList(chapter, nested, options);
    expect(out.outcome.applied).toBe(0);
    expect(out.outcome.rolledBack.noNewQuoteDefect).toBe(1);
  });

  it("ON: an edit that removes the only line naming the culprit is reverted by culpritNamingIntact", () => {
    process.env.PROSE_V2_AUDIT_FIXES = "1";
    const unname = edit('"Let it be clear: Ivor Yardley killed Cecil Thorne."', '"Let it be clear."');
    const out = applyEditList(chapter, unname, options);
    expect(out.outcome.applied).toBe(0);
    expect(out.outcome.rolledBack.culpritNamingIntact).toBe(1);
  });

  it("ON: an edit that keeps the naming and the quotes well formed still applies", () => {
    process.env.PROSE_V2_AUDIT_FIXES = "1";
    const good = edit(
      '"Let it be clear: Ivor Yardley killed Cecil Thorne." The words settled in the room.',
      'She looked at Ivor Yardley. "You killed Cecil Thorne." The words settled in the room.',
    );
    expect(applyEditList(chapter, good, options).outcome.applied).toBe(1);
  });

  it("OFF: both guards are silent (0 in every measurement)", () => {
    delete process.env.PROSE_V2_AUDIT_FIXES;
    const out = applyEditList(chapter, nested, options);
    expect(out.outcome.rolledBack.noNewQuoteDefect ?? 0).toBe(0);
    expect(out.outcome.rolledBack.culpritNamingIntact ?? 0).toBe(0);
  });
});
