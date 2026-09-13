import { describe, expect, it } from "vitest";

import { applyPromptBudgeting } from "../agent9-prose/prompt-builder.js";

/**
 * A_91 F1 — the humour guide was the only `optional` block in the prose prompt, and the budgeter's
 * drop order is ["optional", "medium", "high"], so it was the whole first tier rather than one
 * candidate among several. MEASURED: 10 of 10 chapters on `mystery-1789232316546`, 0 of 10 on each
 * of the two resumes that followed, while `craft_guide` — loaded on the same line by the same call —
 * survived because Fix D2 had already promoted it.
 *
 * This pins the mechanism rather than the one-word edit: at a budget that forces a drop, a block at
 * `optional` goes and the same block at `high` stays.
 */
const block = (key: string, priority: "critical" | "high" | "medium" | "optional", size: number) => ({
  key,
  content: "x ".repeat(size),
  priority,
  stability: "run" as const,
});

describe("applyPromptBudgeting — priority decides what survives a squeeze", () => {
  it("drops `optional` before `medium` before `high`", () => {
    const blocks = [
      block("critical_thing", "critical", 400),
      block("humour_guide", "optional", 400),
      block("continuity", "medium", 400),
      block("craft_guide", "high", 400),
    ];
    const tight = applyPromptBudgeting("sys", "dev", "user", blocks, 500);
    expect(tight.droppedBlocks).toContain("humour_guide");
    expect(tight.droppedBlocks.indexOf("humour_guide")).toBeLessThan(
      tight.droppedBlocks.indexOf("craft_guide") === -1 ? Number.MAX_SAFE_INTEGER : tight.droppedBlocks.indexOf("craft_guide"),
    );
  });

  it("the same block at `high` survives a squeeze that drops it at `optional`", () => {
    const at = (priority: "high" | "optional") =>
      applyPromptBudgeting("sys", "dev", "user", [
        block("critical_thing", "critical", 400),
        block("humour_guide", priority, 400),
        block("continuity", "medium", 400),
      ], 450);
    expect(at("optional").droppedBlocks).toContain("humour_guide");
    expect(at("high").droppedBlocks).not.toContain("humour_guide");
  });

  it("a generous budget drops nothing, whatever the priority", () => {
    const roomy = applyPromptBudgeting("sys", "dev", "user", [block("humour_guide", "optional", 50)], 100000);
    expect(roomy.droppedBlocks).toEqual([]);
  });
});

/**
 * A_91 F1b was BUILT AND REVERTED in the same hour, and the reason is worth keeping.
 *
 * Making `humour_guide` a protected craft input would have made it survive even a futile squeeze —
 * and it broke `prompt-budget-craft-floor-x47.test.ts`, which encodes a deliberate 2026-08-18
 * decision that this block is exactly what a futile squeeze SHOULD shed. Then the root cause turned
 * up: the worker's own env parser did not strip inline comments, so
 * `AGENT9_PROMPT_TOKEN_CEILING=56000  # …` reached the resume path as NaN and the ceiling fell back
 * to 24,000. At the real 56,000 the fresh run dropped NOTHING. The guide was never being deleted for
 * being non-craft; it was being deleted because the budget was less than half its intended size.
 *
 * So the classification stands as its author left it, and the promotion out of `optional` stays as
 * insurance for a prompt that genuinely overruns.
 */
describe("the humour guide's classification is left as its author set it", () => {
  it("is NOT a protected craft input — the X47 decision stands", async () => {
    const { __CRAFT_INPUT_BLOCKS } = await import("../agent9-prose/prompt-builder.js");
    expect(__CRAFT_INPUT_BLOCKS.has("humour_guide")).toBe(false);
    expect(__CRAFT_INPUT_BLOCKS.has("craft_guide")).toBe(true);
  });
});
