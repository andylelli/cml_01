import { describe, expect, it, vi } from "vitest";
import type { ValidatorResult } from "@cml/prose-guard";
import {
  buildRewritePrompt,
  critiqueAndRewriteChapter,
} from "../agent9-prose/critique-rewrite.js";
import type { RewriteConstraints } from "../agent9-prose/critique-rewrite.js";
import type { ProseChapter } from "../agent9-prose/types.js";

// ITEM 9 — locked values are PRESERVATION-ONLY in the rewrite prompt: the flat "reproduce these"
// imperative made the temp-0.8 rewrite INSERT absent locked values side-by-side (dualValueNoContrast).
// The contradictionPair obligation binds only when the chapter already states BOTH readings.

const ch = (...p: string[]): ProseChapter => ({ title: "C", paragraphs: p });
const STAGED = "ten minutes past eleven";
const TRUE = "a quarter to eleven";
const base: RewriteConstraints = {
  lockedFacts: [STAGED, TRUE],
  pronouns: {},
  requiredClues: [],
};

describe("buildRewritePrompt — locked values are preservation-only", () => {
  it("user prompt scopes reproduction to values the chapter mentions and forbids introduction", () => {
    const { user } = buildRewritePrompt(ch("A quiet hall."), [], base);
    expect(user).toMatch(/If the chapter mentions any of these measured values, reproduce the exact phrase verbatim/);
    expect(user).toContain(STAGED);
    expect(user).toContain(TRUE);
    expect(user).toMatch(/NEVER introduce a locked value the chapter does not already state/);
    // old unconditional imperative must be gone
    expect(user).not.toMatch(/Reproduce these values verbatim/);
  });

  it("system prompt scopes verbatim reproduction to values the chapter already states", () => {
    const { system } = buildRewritePrompt(ch("A quiet hall."), [], base);
    expect(system).toMatch(/Reproduce verbatim every locked fact value the chapter already states/);
    expect(system).toMatch(/never introduce locked values the chapter does not state/);
    // old unconditional wording must be gone
    expect(system).not.toMatch(/Reproduce every locked fact value verbatim\./);
  });

  it("omits the locked-value line entirely when there are no locked facts", () => {
    const { user } = buildRewritePrompt(ch("A quiet hall."), [], { ...base, lockedFacts: [] });
    expect(user).not.toMatch(/measured values/);
    expect(user).not.toMatch(/NEVER introduce a locked value/);
  });
});

describe("buildRewritePrompt — contradictionPair obligation", () => {
  const pair = { stagedValue: STAGED, trueValue: TRUE };

  it("binds when the chapter states BOTH values (case-insensitive), as one explicit contradiction", () => {
    const chapter = ch(
      `The clock face read Ten Minutes Past Eleven when the door was forced.`,
      `Yet the works, once opened, proved the hands had been stopped at A Quarter To Eleven.`,
    );
    const { user } = buildRewritePrompt(chapter, [], { ...base, contradictionPair: pair });
    expect(user).toMatch(/CONTRADICTION OBLIGATION/);
    expect(user).toMatch(/ONE explicit contradiction/);
    expect(user).toMatch(/never as two disconnected readings/);
    expect(user).toContain(`"${STAGED}"`);
    expect(user).toContain(`"${TRUE}"`);
  });

  it("adds no requirement when the chapter states only one of the two values", () => {
    const chapter = ch(`The clock face read ten minutes past eleven when the door was forced.`);
    const { user } = buildRewritePrompt(chapter, [], { ...base, contradictionPair: pair });
    expect(user).not.toMatch(/CONTRADICTION OBLIGATION/);
  });

  it("adds no requirement when the chapter states neither value", () => {
    const chapter = ch("No timepiece appeared in the room at all.");
    const { user } = buildRewritePrompt(chapter, [], { ...base, contradictionPair: pair });
    expect(user).not.toMatch(/CONTRADICTION OBLIGATION/);
  });

  it("adds no requirement when the pair is unset or null, even with both values present", () => {
    const chapter = ch(`It read ${STAGED}; the works said ${TRUE}.`);
    expect(buildRewritePrompt(chapter, [], base).user).not.toMatch(/CONTRADICTION OBLIGATION/);
    expect(buildRewritePrompt(chapter, [], { ...base, contradictionPair: null }).user).not.toMatch(/CONTRADICTION OBLIGATION/);
  });
});

describe("critiqueAndRewriteChapter — constraints flow into the rewrite call", () => {
  const alwaysOk = (): ValidatorResult => ({ ok: true, score: 100, violations: [] });

  it("sends the preservation-scoped line and the bound contradiction obligation to the LLM", async () => {
    const chapter = ch(`It read ${STAGED}; the works said ${TRUE}.`);
    const client = {
      chat: vi.fn()
        .mockResolvedValueOnce({ content: JSON.stringify({ issues: [] }) })
        .mockResolvedValueOnce({ content: JSON.stringify({ chapter: { title: "C", paragraphs: [`It claimed ${STAGED}, but ${TRUE} was true.`] } }) }),
    } as any;
    const res = await critiqueAndRewriteChapter({
      client,
      chapter,
      constraints: { ...base, contradictionPair: { stagedValue: STAGED, trueValue: TRUE } },
      validate: alwaysOk,
    });
    expect(res.rewritten).toBe(true);
    const rewriteCall = client.chat.mock.calls[1][0];
    const userMsg = rewriteCall.messages.find((m: { role: string }) => m.role === "user").content;
    const systemMsg = rewriteCall.messages.find((m: { role: string }) => m.role === "system").content;
    expect(userMsg).toMatch(/NEVER introduce a locked value the chapter does not already state/);
    expect(userMsg).toMatch(/CONTRADICTION OBLIGATION/);
    expect(systemMsg).toMatch(/never introduce locked values the chapter does not state/);
  });
});
