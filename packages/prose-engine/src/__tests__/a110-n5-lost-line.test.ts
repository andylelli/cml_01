import { afterEach, describe, expect, it } from "vitest";
import { applyEditList, orphanedTags } from "../edits.js";
import { anchorEarlyClue } from "../findings.js";
import type { SceneContract } from "../types.js";

/**
 * A_110 N5 — a spoken line lost between the writer and the page. MEASURED on run bcc0d637's checkpoint: the `clue_early`
 * hard gate is chapter-level, its finding fell back to the chapter's first sentence, six findings named that one
 * sentence, and the editor cut chapter 5's opening question, shipping "Eleanor Gresham asked, her voice level as she…".
 * Both halves of the fix are behind PROSE_V2_CONTRACT_FIXES; OFF, nothing changes.
 */
afterEach(() => {
  delete process.env.PROSE_V2_CONTRACT_FIXES;
});

describe("orphaned dialogue tags", () => {
  it("counts a paragraph that opens on a tag with no spoken words before it", () => {
    expect(orphanedTags("Ada Vane asked, her voice level as she set the log down.")).toBe(1);
    expect(orphanedTags("She said, quietly enough that nobody turned.")).toBe(1);
  });
  it("does not count speech, narration, or indirect speech without a comma", () => {
    expect(orphanedTags("\"Did you see him?\" Ada Vane asked, her voice level.")).toBe(0);
    expect(orphanedTags("Ada Vane set the log down on the desk.")).toBe(0);
    expect(orphanedTags("She asked whether he had seen the boat.")).toBe(0);
  });
});

describe("the editor may not orphan a tag", () => {
  // Long enough that a seven-word cut is inside `lengthWithin`'s tolerance, as it is in a real chapter.
  const narration = Array.from({ length: 12 }, (_, i) => `The rain kept on against the glass for the ${i + 1}th time that hour, and the lamp on the desk burned low.`).join(" ");
  const chapter = {
    number: 5,
    title: "Five",
    paragraphs: [
      "\"Did you see him near the harbour?\" Ada Vane asked, her voice level as she set the log on the table.",
      "Tom Bell shook his head and looked at the window.",
      narration,
    ],
  };
  const findings = [{ class: "clue_early", chapter: 5, quote: "q", note: "n", severity: "defect", source: "checker" } as never];
  const cut = { edits: [{ find: "\"Did you see him near the harbour?\" Ada Vane asked,", replace: "Ada Vane asked,", addresses: [0] }], cannot: [] };

  it("ON: the edit that keeps the tag and cuts the words is rolled back", () => {
    process.env.PROSE_V2_CONTRACT_FIXES = "1";
    const { chapter: after, outcome } = applyEditList(chapter, cut, { lockedValues: [], castNames: ["Ada Vane", "Tom Bell"], findings });
    expect(outcome.applied).toBe(0);
    expect(outcome.rolledBack.noOrphanedTag).toBe(1);
    expect(after.paragraphs[0]).toMatch(/^"Did you see him/);
  });

  it("OFF: the same edit lands, as it did in run bcc0d637 (the witness)", () => {
    const { chapter: after, outcome } = applyEditList(chapter, cut, { lockedValues: [], castNames: ["Ada Vane", "Tom Bell"], findings });
    expect(outcome.applied).toBe(1);
    expect(after.paragraphs[0]).toMatch(/^Ada Vane asked,/);
  });

  it("ON: cutting a whole line, tag included, is still allowed", () => {
    process.env.PROSE_V2_CONTRACT_FIXES = "1";
    const whole = { edits: [{ find: " Tom Bell shook his head and looked at the window.", replace: " Tom Bell looked at the window.", addresses: [0] }], cannot: [] };
    const { outcome } = applyEditList(
      { ...chapter, paragraphs: [chapter.paragraphs[0] + " Tom Bell shook his head and looked at the window.", narration] },
      whole,
      { lockedValues: [], castNames: ["Ada Vane", "Tom Bell"], findings },
    );
    expect(outcome.rolledBack.noOrphanedTag ?? 0).toBe(0);
  });
});

describe("an early clue is anchored on the sentence that carries it", () => {
  const scenes = [{ chapter: 6, present: ["Ada Vane", "Tom Bell"], location: "the study", mustSurface: [{ id: "clue_a", keyTerms: ["ledger", "torn", "page", "ink", "ada"] }] }] as unknown as SceneContract[];
  it("names the sentence with the most of the clue's terms, not the chapter's first", () => {
    const body = "\"Did you see him?\" Ada asked. The ledger lay open, a page torn out where the ink had run. Tom said nothing.";
    const placed = anchorEarlyClue(body, "clue_a is owed to chapter 6", { scenes });
    expect(placed.report).toBe(false);
    expect(placed.quote).toMatch(/^The ledger lay open/);
    expect(placed.note).toMatch(/carries ledger, torn, page, ink/);
  });
  it("reports a clue spread across the chapter instead of sending the editor to the first line", () => {
    const body = "\"Did you see him?\" Ada asked. The ledger was shut. A page lay on the floor. Ink dried on the pen. Something was torn.";
    const placed = anchorEarlyClue(body, "clue_a is owed to chapter 6", { scenes });
    expect(placed.report).toBe(true);
  });
});
