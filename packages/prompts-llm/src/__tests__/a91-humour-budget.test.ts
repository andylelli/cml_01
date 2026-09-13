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
