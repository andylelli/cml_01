import { describe, expect, it, vi } from "vitest";
import { buildStoryBible } from "../story-bible.js";
import { buildMacroArcPlan } from "../agent9-prose/types.js";
import { runCaseTransitionRegenPass } from "../agent9-prose/regen-integration.js";
import { makeRegenFn } from "../agent9-prose/regen-llm.js";
import type { ProseChapter } from "../agent9-prose/types.js";

// A_61 RC3.3 — the case-transition-bridge regen pass (bridgePresent injected to keep prompts-llm acyclic).

const bible = buildStoryBible({
  lockedFacts: [{ id: "lf", description: "time", value: "half past nine" }],
  cast: [{ name: "Eleanor Voss", gender: "female", role_archetype: "victim" }],
  culprits: ["Hugo Vane"],
  macroArcPlan: buildMacroArcPlan(6),
});

const bridgePresent = (t: string) => /\b(body\s+was\s+found|found\s+dead|discovered\s+dead|(?:body|corpse|remains)\s+(?:was\s+)?(?:found|discovered))\b/i.test(t);

describe("runCaseTransitionRegenPass", () => {
  it("is a no-op when a bridge is already present", async () => {
    const client = { chat: vi.fn() } as any;
    const ch: ProseChapter = { title: "Ch2", paragraphs: ["The body was found; it was murder."] };
    const res = await runCaseTransitionRegenPass({ chapter: ch, chapterNumber: 2, paragraphIndex: 0, bible, regen: makeRegenFn({ client }), bridgePresent });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("inserts a bridge when murder language has none", async () => {
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({ chapter: { title: "Ch2", paragraphs: ["At dawn the body was found in the ravine, and the inspector confirmed it was murder."] } }),
      })),
    } as any;
    const ch: ProseChapter = { title: "Ch2", paragraphs: ["The inspector announced it was murder."] };
    const res = await runCaseTransitionRegenPass({ chapter: ch, chapterNumber: 2, paragraphIndex: 0, bible, regen: makeRegenFn({ client }), bridgePresent });
    expect(res.ran).toBe(true);
    expect(res.repaired).toContain("transition_ch2");
    expect(bridgePresent(res.chapter.paragraphs.join(" "))).toBe(true);
  });

  it("rolls back (gate still applies) when regen drops a locked fact present in the chapter", async () => {
    const onUnresolved = vi.fn();
    const client = {
      // adds a bridge but drops "half past nine"
      chat: vi.fn(async () => ({ content: JSON.stringify({ chapter: { title: "Ch2", paragraphs: ["The body was found; murder."] } }) })),
    } as any;
    const ch: ProseChapter = { title: "Ch2", paragraphs: ["At half past nine the inspector announced it was murder."] };
    const res = await runCaseTransitionRegenPass({ chapter: ch, chapterNumber: 2, paragraphIndex: 0, bible, regen: makeRegenFn({ client }), bridgePresent, maxAttemptsPerDefect: 1, onUnresolved });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved).toContain("transition_ch2");
  });
});
