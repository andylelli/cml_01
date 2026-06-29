import { describe, expect, it } from "vitest";
import { parseJudgeResult } from "../llm-judge.js";
import { applyHardCaps } from "../hard-caps.js";
import { CATEGORIES, type RubricScore, type StoryFacts } from "../types.js";

// A_55 #1 (critical) — a judge that returns `categories` as an OBJECT MAP keyed by category name
// (gpt-4.1-mini did this) must NOT collapse to a false raw 0. The judge scored the story; the parser
// was discarding it via `Array.isArray(obj.categories) ? ... : []`.

const objectMapJudge = (marks: Record<string, number>, total: number) =>
  JSON.stringify({
    categories: Object.fromEntries(
      Object.entries(marks).map(([k, m]) => [k, { mark: m, reason: "ok" }]),
    ),
    total,
    overall_view: "A well-crafted Golden Age mystery.",
  });

const ALL7: Record<string, number> = Object.fromEntries(CATEGORIES.map((c) => [c, 7]));

describe("parseJudgeResult — object-map `categories` shape (A_55)", () => {
  it("parses the object-map shape into the 10-category array (was [] → false 0)", () => {
    const { rubric } = parseJudgeResult(objectMapJudge(ALL7, 70));
    expect(rubric.categories.length).toBe(10);
    const labels = new Set(rubric.categories.map((c) => c.category));
    for (const c of CATEGORIES) expect(labels.has(c)).toBe(true);
    expect(rubric.categories.reduce((s, c) => s + c.mark, 0)).toBe(70);
    expect(rubric.total).toBe(70);
  });

  it("scores via applyHardCaps to the real total, not a false 0", () => {
    const { rubric } = parseJudgeResult(objectMapJudge(ALL7, 70));
    const capped = applyHardCaps(rubric, {} as StoryFacts);
    expect(capped.final).toBe(70);
  });

  it("array shape still works (no regression)", () => {
    const arrayJudge = JSON.stringify({
      categories: CATEGORIES.map((c) => ({ category: c, mark: 8, reason: "ok" })),
      total: 80,
    });
    const { rubric } = parseJudgeResult(arrayJudge);
    expect(rubric.categories.length).toBe(10);
    expect(applyHardCaps(rubric, {} as StoryFacts).final).toBe(80);
  });

  it("defensive: a genuinely empty categories payload falls back to the judge total, not 0", () => {
    const rubric: RubricScore = {
      categories: [],
      total: 65,
      overall_view: "",
      what_works: [],
      main_problems: [],
      chapter_issues: [],
      fastest_fixes: [],
    };
    expect(applyHardCaps(rubric, {} as StoryFacts).final).toBe(65);
  });
});
