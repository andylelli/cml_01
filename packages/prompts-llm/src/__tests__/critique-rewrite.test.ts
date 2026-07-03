import { describe, expect, it, vi } from "vitest";
import { noScaffoldValidator } from "@cml/prose-guard";
import type { ValidatorResult } from "@cml/prose-guard";
import {
  selectLowestScoringChapters,
  buildCritiquePrompt,
  buildRewritePrompt,
  critiqueAndRewriteChapter,
  runCritiqueRewritePass,
} from "../agent9-prose/critique-rewrite.js";
import type { ProseChapter } from "../agent9-prose/types.js";

// P5 — critique→rewrite at creative temp, with deterministic re-validation + rollback.

const ch = (...p: string[]): ProseChapter => ({ title: "C", paragraphs: p });
const text = (c: ProseChapter) => (c.paragraphs ?? []).join(" ");
// gate: the clue "cold tea" must survive AND no scaffold may appear
const factsGate = (c: ProseChapter): ValidatorResult => {
  const clue = text(c).toLowerCase().includes("cold tea");
  const scaffold = noScaffoldValidator(text(c));
  return { ok: clue && scaffold.ok, score: (clue ? 100 : 0) + scaffold.score, violations: [...(clue ? [] : ["dropped_clue"]), ...scaffold.violations] };
};
const constraints = { lockedFacts: ["half past three"], pronouns: { Evelyn: "she/her" }, requiredClues: ["the cold tea"] };

describe("selectLowestScoringChapters", () => {
  it("picks the k lowest, ties by index, skips those at/above the threshold", () => {
    const scored = [{ index: 0, score: 80 }, { index: 1, score: 50 }, { index: 2, score: 50 }, { index: 3, score: 95 }];
    expect(selectLowestScoringChapters(scored, 2)).toEqual([1, 2]);
    expect(selectLowestScoringChapters(scored, 4, 90)).toEqual([1, 2, 0]); // 3 (95) skipped
  });
});

describe("prompts", () => {
  it("critique is read-only (no plot/logic changes) and names the dimensions", () => {
    const { system, user } = buildCritiquePrompt(ch("A flat sentence."));
    expect(system).toMatch(/do not propose plot, clue, or logic changes/i);
    expect(user).toMatch(/dialogue/);
  });
  it("rewrite carries the hard constraints", () => {
    const { system, user } = buildRewritePrompt(ch("x"), ["flat dialogue"], constraints);
    expect(system).toMatch(/Never alter any character's pronoun/i);
    expect(user).toMatch(/half past three/);
    expect(user).toMatch(/Evelyn: she\/her/);
    expect(user).toMatch(/the cold tea/);
  });
});

describe("critiqueAndRewriteChapter — keep on no-regression, rollback otherwise", () => {
  const original = ch("Evelyn saw the cold tea. It was a flat, functional sentence reporting the fact.");

  it("keeps a rewrite that lifts craft and preserves the clue", async () => {
    const client = {
      chat: vi.fn()
        .mockResolvedValueOnce({ content: JSON.stringify({ issues: ["dialogue is flat"] }) }) // critique
        .mockResolvedValueOnce({ content: JSON.stringify({ chapter: { title: "C", paragraphs: ["The cold tea had skinned over, untouched since the hour she came."] } }) }), // rewrite
    } as any;
    const res = await critiqueAndRewriteChapter({ client, chapter: original, constraints, validate: factsGate });
    expect(res.rewritten).toBe(true);
    expect(text(res.chapter)).toMatch(/cold tea/);
    expect(client.chat).toHaveBeenCalledTimes(2);
  });

  it("rolls back a rewrite that drops the clue", async () => {
    const client = {
      chat: vi.fn()
        .mockResolvedValueOnce({ content: JSON.stringify({ issues: [] }) })
        .mockResolvedValueOnce({ content: JSON.stringify({ chapter: { title: "C", paragraphs: ["A beautiful but clueless paragraph about the weather."] } }) }),
    } as any;
    const res = await critiqueAndRewriteChapter({ client, chapter: original, constraints, validate: factsGate });
    expect(res.rewritten).toBe(false);
    expect(res.rollbackReason).toMatch(/dropped_clue|invalid/);
    expect(res.chapter).toBe(original);
  });

  it("rolls back a rewrite that introduces scaffold", async () => {
    const client = {
      chat: vi.fn()
        .mockResolvedValueOnce({ content: JSON.stringify({ issues: [] }) })
        .mockResolvedValueOnce({ content: JSON.stringify({ chapter: { title: "C", paragraphs: ["She weighed the cold tea, and the trail bent toward the gardener."] } }) }),
    } as any;
    const res = await critiqueAndRewriteChapter({ client, chapter: original, constraints, validate: factsGate });
    expect(res.rewritten).toBe(false);
    expect(res.rollbackReason).toMatch(/scaffold_not_prose/);
  });

  it("survives a critique-call failure (rewrites against generic dimensions)", async () => {
    const client = {
      chat: vi.fn()
        .mockRejectedValueOnce(new Error("critique boom"))
        .mockResolvedValueOnce({ content: JSON.stringify({ chapter: { title: "C", paragraphs: ["The cold tea skinned over in the cold morning light."] } }) }),
    } as any;
    const res = await critiqueAndRewriteChapter({ client, chapter: original, constraints, validate: factsGate });
    expect(res.rewritten).toBe(true);
  });

  it("rolls back (no throw) when the rewrite call fails", async () => {
    const client = { chat: vi.fn().mockResolvedValueOnce({ content: JSON.stringify({ issues: [] }) }).mockRejectedValueOnce(new Error("rewrite boom")) } as any;
    const res = await critiqueAndRewriteChapter({ client, chapter: original, constraints, validate: factsGate });
    expect(res.rewritten).toBe(false);
    expect(res.rollbackReason).toMatch(/rewrite_failed/);
    expect(res.chapter).toBe(original);
  });
});

describe("runCritiqueRewritePass — only the lowest-scoring chapters, in place", () => {
  it("rewrites just the targeted chapters and leaves the rest untouched", async () => {
    const chapters = [ch("good ch with cold tea"), ch("weak ch with cold tea"), ch("ok ch with cold tea")];
    const scored = [{ index: 0, score: 85 }, { index: 1, score: 40 }, { index: 2, score: 78 }];
    const client = {
      chat: vi.fn()
        .mockResolvedValueOnce({ content: JSON.stringify({ issues: ["flat"] }) })
        .mockResolvedValueOnce({ content: JSON.stringify({ chapter: { title: "C", paragraphs: ["A lifted weak ch that still names the cold tea."] } }) }),
    } as any;
    const res = await runCritiqueRewritePass({
      client,
      chapters,
      scored,
      maxChapters: 1,
      validatorFor: () => factsGate,
      constraintsFor: () => constraints,
    });
    expect(res.rewrittenIndices).toEqual([1]);
    expect(text(res.chapters[1])).toMatch(/lifted weak/);
    expect(res.chapters[0]).toBe(chapters[0]); // untouched
    expect(res.chapters[2]).toBe(chapters[2]); // untouched
  });
});
