/**
 * X47 (REVIEW_11 §9, REVIEW_10 §10.1/§10.2) — the budget squeeze deletes craft and buys nothing.
 *
 * The numbers below are this function's own summary line, from run `mystery-1786999938275`:
 *
 *   ch   fixed    available   shipped   newly dropped
 *    6  17,736      6,264      5,863    character_contracts, physical_plausibility, ...
 *    8  21,415      2,585      5,499    craft_guide, judged_on
 *   10  23,622        378      4,723    -
 *
 * Chapters 8-10 ship more context than they are allowed even after dropping everything droppable, so
 * the drops there bought nothing at all — they only deleted the standard the chapter is written to.
 * And within a priority class the loop takes blocks in ARRAY ORDER, which puts the flat six's own
 * inputs first.
 */

import { describe, expect, it, afterEach } from "vitest";
import { applyPromptBudgeting, estimateTokenCount, __isPromptBudgetCraftFloorEnabled } from "../agent9-prose/prompt-builder.js";
import type { PromptContextBlock } from "../agent9-prose/prompt-builder.js";

/** A block of roughly `tokens` tokens — `estimateTokenCount` is chars/4. */
const block = (key: string, priority: PromptContextBlock["priority"], tokens: number): PromptContextBlock => ({
  key,
  priority,
  content: "x".repeat(tokens * 4),
});

const summaryOf = (composed: string): Record<string, string> => {
  const line = composed.split("PROMPT BUDGET SUMMARY: ")[1]?.split("\n")[0] ?? "";
  return Object.fromEntries(
    line.split("; ").map((pair) => {
      const i = pair.indexOf("=");
      return [pair.slice(0, i), pair.slice(i + 1)];
    }),
  );
};

const FLAG = "AGENT9_PROMPT_BUDGET_CRAFT_FLOOR";

describe("applyPromptBudgeting — the diagnosis is unconditional (X47)", () => {
  const orig = process.env[FLAG];
  afterEach(() => { process.env[FLAG] = orig; });

  it("reports available, critical and futile on every call, flag or no flag", () => {
    process.env[FLAG] = "";
    // fixed = 900 tokens, budget 1000 → 100 available; criticals alone are 400.
    const fixed = "f".repeat(900 * 4);
    const { composedSystem } = applyPromptBudgeting(
      fixed, "", "",
      [block("locked_facts", "critical", 400), block("craft_guide", "high", 200)],
      1000,
    );
    const s = summaryOf(composedSystem);
    expect(s.available).toBe("100");
    expect(s.critical).toBe("400");
    expect(s.futile).toBe("true"); // 400 critical > 100 available — no drop sequence can succeed
    expect(s.craftFloor).toBe("false");
  });

  it("is byte-identical to the old behaviour with the flag off", () => {
    process.env[FLAG] = "";
    expect(__isPromptBudgetCraftFloorEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    const fixed = "f".repeat(900 * 4);
    const blocks = [block("locked_facts", "critical", 400), block("craft_guide", "high", 200)];
    const { droppedBlocks } = applyPromptBudgeting(fixed, "", "", blocks, 1000);
    // The old loop drops craft_guide even though the prompt still cannot fit. Unchanged, on purpose.
    expect(droppedBlocks).toEqual(["craft_guide"]);
  });
});

describe("applyPromptBudgeting — the futility check (X47, flag on)", () => {
  const orig = process.env[FLAG];
  afterEach(() => { process.env[FLAG] = orig; });

  it("drops NOTHING when the critical floor alone already exceeds the budget", () => {
    process.env[FLAG] = "1";
    const fixed = "f".repeat(900 * 4); // available = 100
    const { droppedBlocks, composedSystem } = applyPromptBudgeting(
      fixed, "", "",
      [block("locked_facts", "critical", 400), block("craft_guide", "high", 200), block("judged_on", "high", 100)],
      1000,
    );
    // This is the ch8 row: everything droppable goes and the prompt is still over. Keep the craft.
    expect(droppedBlocks).toEqual([]);
    expect(summaryOf(composedSystem).futile).toBe("true");
  });

  /**
   * FOUND ON REVIEW 2026-08-18 — the first futility branch skipped the drop loop ENTIRELY, so the
   * chapters furthest over the ceiling shipped MORE than before (5,500 context tokens where the old
   * code shipped 4,000) and kept `humour_guide` and `physical_plausibility` too. "Stop deleting craft
   * for nothing" is not "stop deleting anything".
   */
  it("still sheds the NON-craft blocks when the squeeze is futile", () => {
    process.env[FLAG] = "1";
    const fixed = "f".repeat(900 * 4); // available = 100, criticals 400 -> futile
    const { droppedBlocks } = applyPromptBudgeting(
      fixed, "", "",
      [
        block("locked_facts", "critical", 400),
        block("humour_guide", "optional", 300),
        block("physical_plausibility", "high", 400),
        block("craft_guide", "high", 500),
        block("judged_on", "high", 300),
      ],
      1000,
    );
    expect(droppedBlocks).toEqual(["humour_guide", "physical_plausibility"]);
    expect(droppedBlocks).not.toContain("craft_guide");
    expect(droppedBlocks).not.toContain("judged_on");
  });

  it("still drops normally when dropping CAN reach the budget", () => {
    process.env[FLAG] = "1";
    const fixed = "f".repeat(500 * 4); // available = 500, criticals 300 → not futile
    const { droppedBlocks, composedSystem } = applyPromptBudgeting(
      fixed, "", "",
      [block("locked_facts", "critical", 300), block("humour_guide", "optional", 400)],
      1000,
    );
    expect(summaryOf(composedSystem).futile).toBe("false");
    expect(droppedBlocks).toEqual(["humour_guide"]);
  });
});

describe("applyPromptBudgeting — craft inputs go last within their class (X47, flag on)", () => {
  const orig = process.env[FLAG];
  afterEach(() => { process.env[FLAG] = orig; });

  /** The ch6 shape: several `high` blocks, craft ones first in array order, only some must go. */
  const ch6Blocks = () => [
    block("locked_facts", "critical", 200),
    block("character_contracts", "high", 150), // craft — first in array order, dropped first pre-X47
    block("physical_plausibility", "high", 150),
    block("era_authenticity", "high", 150),
    block("temporal_context", "high", 150),
  ];

  it("pre-X47 (flag off) the dialogue contract is the first high block to go", () => {
    process.env[FLAG] = "";
    const fixed = "f".repeat(500 * 4); // available = 500; criticals 200; highs 600 → must shed 300
    const { droppedBlocks } = applyPromptBudgeting(fixed, "", "", ch6Blocks(), 1000);
    expect(droppedBlocks[0]).toBe("character_contracts");
  });

  it("with the floor on, the non-craft high blocks go first and the dialogue contract survives", () => {
    process.env[FLAG] = "1";
    const fixed = "f".repeat(500 * 4);
    const { droppedBlocks, composedSystem } = applyPromptBudgeting(fixed, "", "", ch6Blocks(), 1000);
    expect(droppedBlocks).not.toContain("character_contracts");
    expect(droppedBlocks).toEqual(["physical_plausibility", "era_authenticity"]);
    // And the budget is still met — this trades WHICH block is lost, never how many tokens ship.
    const s = summaryOf(composedSystem);
    expect(Number(s.context)).toBeLessThanOrEqual(Number(s.available));
  });

  it("drops a craft block when there is nothing else left in its class", () => {
    process.env[FLAG] = "1";
    const fixed = "f".repeat(800 * 4); // available = 200; criticals 100 → not futile, but tight
    const { droppedBlocks } = applyPromptBudgeting(
      fixed, "", "",
      [block("locked_facts", "critical", 100), block("craft_guide", "high", 300)],
      1000,
    );
    // The floor is a preference, not immunity.
    expect(droppedBlocks).toEqual(["craft_guide"]);
  });

  it("leaves the non-craft ordering untouched, so an unrelated prompt drops exactly as before", () => {
    const blocks = [
      block("locked_facts", "critical", 100),
      block("setting_refinement", "high", 200),
      block("physical_plausibility", "high", 200),
      block("era_authenticity", "high", 200),
    ];
    const fixed = "f".repeat(500 * 4);
    process.env[FLAG] = "";
    const before = applyPromptBudgeting(fixed, "", "", blocks, 1000).droppedBlocks;
    process.env[FLAG] = "1";
    const after = applyPromptBudgeting(fixed, "", "", blocks, 1000).droppedBlocks;
    expect(after).toEqual(before);
  });
});

describe("estimateTokenCount", () => {
  it("is chars/4, which is what every number in the X47 tables above is denominated in", () => {
    expect(estimateTokenCount("x".repeat(400))).toBe(100);
  });
});
