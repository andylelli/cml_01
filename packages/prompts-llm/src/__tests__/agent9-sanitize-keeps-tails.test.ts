import { describe, expect, it } from "vitest";
import { stripInternalAuditPhrasing } from "../agent9-prose/sanitization.ts";

// A_106 §5 — the audit-phrase filter was deleting prose that is not audit phrasing: any text after
// the last full stop, question mark or exclamation mark, and any sentence closing on two marks. On
// arm A of seed 23403 it deleted an interrupted speech with its closing quote and chapter 6 fell back.
describe("stripInternalAuditPhrasing keeps every sentence that is not audit phrasing", () => {
  it("keeps an interrupted speech ending in a dash and a closing quote", () => {
    const p = "\u201cSome of us have reputations to maintain,\u201d he said. \u201cI, for one, would prefer a poorly timed cup of tea. There are only so many indignities a man can bear before he questions polite society altogether\u2014\u201d";
    const out = stripInternalAuditPhrasing(p);
    expect(out).toContain("polite society altogether\u2014\u201d");
    expect((out.match(/[\u201c\u201d"]/g) ?? []).length % 2).toBe(0);
  });

  it("keeps a sentence closing on two marks", () => {
    const p = "\u201cThe watch stopped at 'twenty minutes past nine.' That is a difference of 'fifty-five minutes.'\u201d She waited.";
    expect(stripInternalAuditPhrasing(p)).toContain("'fifty-five minutes.'\u201d");
  });

  it("keeps a trailing ellipsis", () => {
    expect(stripInternalAuditPhrasing("She began to answer. Then\u2026")).toBe("She began to answer. Then\u2026");
  });

  it("still removes a real audit sentence", () => {
    const p = "The clock stood at ten. The detail is explicit in the record. She turned away.";
    expect(stripInternalAuditPhrasing(p)).toBe("The clock stood at ten. She turned away.");
  });
});
