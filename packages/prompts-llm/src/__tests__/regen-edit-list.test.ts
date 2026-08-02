/**
 * Edit-list regen — return only what changed.
 *
 * Two claims under test, and the SAFETY one matters more than the cost one:
 *
 *   COST   — a full-chapter reply spends ~1,671 completion tokens to alter a paragraph. Measured on
 *            run mystery-1785521869768: 11 regen calls, 18,384 completion tokens, £0.150.
 *   SAFETY — with a full-chapter reply, untouched paragraphs survive only because the model was ASKED
 *            to copy them and a validator checked afterwards. That is the mechanism that let
 *            `repair.ts:153` re-gender characters. With an edit list they are spliced from the source
 *            object and cannot change at all.
 *
 * The tests below pin the splice rules, because every one of them is a way a malformed reply could
 * damage a chapter instead of failing cleanly.
 */

import { describe, expect, it } from "vitest";

import {
  applyParagraphEdits,
  buildRegenPrompt,
  isRegenEditListEnabled,
  parseEditListResponse,
} from "../agent9-prose/regen-llm.js";
import type { ProseChapter } from "../agent9-prose/types.js";

const chapter = (): ProseChapter => ({
  title: "Chapter 3",
  summary: "The library is searched.",
  paragraphs: [
    "Miss Yates crossed the hall, her gloves still damp from the rain.",
    "The clock on the mantel had stopped at half past three.",
    "She said nothing of the ledger.",
  ],
});

describe("flag", () => {
  it("is OFF unless explicitly enabled, and reads env at call time", () => {
    expect(isRegenEditListEnabled({})).toBe(false);
    expect(isRegenEditListEnabled({ AGENT9_REGEN_EDIT_LIST: "true" })).toBe(true);
    expect(isRegenEditListEnabled({ AGENT9_REGEN_EDIT_LIST: "1" })).toBe(true);
    for (const v of ["yes", "on", "TRUE", "", "false", "0"]) {
      expect(isRegenEditListEnabled({ AGENT9_REGEN_EDIT_LIST: v })).toBe(false);
    }
  });
});

describe("applyParagraphEdits", () => {
  it("replaces only the indexed paragraph and leaves the rest IDENTICAL BY REFERENCE", () => {
    // The safety claim, stated as an assertion: untouched paragraphs are the same strings from the
    // source, not model-regenerated copies of them.
    const source = chapter();
    const { chapter: out, applied } = applyParagraphEdits(source, [
      { index: 1, text: "The clock on the mantel had stopped at twenty past four." },
    ]);

    expect(applied).toEqual([1]);
    expect(out.paragraphs[1]).toContain("twenty past four");
    expect(out.paragraphs[0]).toBe(source.paragraphs[0]);
    expect(out.paragraphs[2]).toBe(source.paragraphs[2]);
  });

  it("carries title and summary through untouched", () => {
    const source = chapter();
    const { chapter: out } = applyParagraphEdits(source, [{ index: 0, text: "New opening." }]);
    expect(out.title).toBe(source.title);
    expect(out.summary).toBe(source.summary);
  });

  it("DROPS an out-of-range index rather than appending unreviewed prose", () => {
    const source = chapter();
    const { chapter: out, applied, rejected } = applyParagraphEdits(source, [
      { index: 9, text: "A paragraph that belongs to no chapter." },
      { index: -1, text: "Nor this one." },
    ]);

    expect(applied).toEqual([]);
    expect(rejected).toEqual([9, -1]);
    expect(out.paragraphs).toEqual(source.paragraphs);
    expect(out.paragraphs.length).toBe(3);
  });

  it("DROPS an empty replacement rather than deleting a paragraph", () => {
    // No repair instruction ever means "remove this paragraph"; silently shortening a chapter would
    // sail past a presence validator while damaging the prose.
    const source = chapter();
    const { chapter: out, applied } = applyParagraphEdits(source, [
      { index: 0, text: "   " },
      { index: 2, text: "" },
    ]);
    expect(applied).toEqual([]);
    expect(out.paragraphs).toEqual(source.paragraphs);
  });

  it("rejects a non-integer index", () => {
    const source = chapter();
    const { applied } = applyParagraphEdits(source, [{ index: 1.5, text: "x" } as any]);
    expect(applied).toEqual([]);
  });

  it("applies several edits in one reply", () => {
    const source = chapter();
    const { chapter: out, applied } = applyParagraphEdits(source, [
      { index: 0, text: "A." },
      { index: 2, text: "C." },
    ]);
    expect(applied).toEqual([0, 2]);
    expect(out.paragraphs).toEqual(["A.", source.paragraphs[1], "C."]);
  });
});

describe("parseEditListResponse", () => {
  it("parses a clean reply", () => {
    const out = parseEditListResponse('{"edits":[{"index":1,"text":"Replaced."}]}', chapter());
    expect(out.paragraphs[1]).toBe("Replaced.");
  });

  it("recovers JSON wrapped in prose or a fence", () => {
    const wrapped = 'Here you go:\n```json\n{"edits":[{"index":0,"text":"Replaced."}]}\n```';
    expect(parseEditListResponse(wrapped, chapter()).paragraphs[0]).toBe("Replaced.");
  });

  it("THROWS on unusable replies so the loop retries or falls to the floor", () => {
    // Same contract as parseExpandedChapterResponse: a throw is a failed attempt, never a crash.
    for (const bad of ["not json at all", "{}", '{"edits":[]}', '{"edits":"nope"}']) {
      expect(() => parseEditListResponse(bad, chapter())).toThrow();
    }
  });

  it("THROWS when every edit was rejected — a no-op must not read as success", () => {
    expect(() => parseEditListResponse('{"edits":[{"index":99,"text":"x"}]}', chapter())).toThrow(
      /out of range or empty/,
    );
  });
});

describe("buildRegenPrompt", () => {
  const req = {
    chapter: chapter(),
    instruction: "Plant the required clue.",
    constraints: { lockedFacts: [], pronouns: {}, mustNotReveal: [] },
    defect: { chapter: 3, kind: "missing_clue", detail: "d", severity: "hard" },
  } as any;

  it("asks for the full chapter when the flag is off — unchanged behaviour", () => {
    const { user } = buildRegenPrompt(req);
    expect(user).toContain('"chapter"');
    expect(user).toContain("SOURCE CHAPTER JSON:");
    expect(user).not.toContain('"edits"');
  });

  it("asks for edits, with indexed source paragraphs, when the flag is on", () => {
    const { user } = buildRegenPrompt(req, { editList: true });
    expect(user).toContain('{"edits":[{"index":0,"text":');
    expect(user).toContain("[0] Miss Yates crossed the hall");
    expect(user).toContain("[1] The clock on the mantel");
    // Telling the model NOT to echo unchanged paragraphs is the cost saving.
    expect(user).toContain("Do NOT return unchanged paragraphs");
  });
});
