import { describe, expect, it, vi } from "vitest";
import { buildStoryBible } from "../story-bible.js";
import { buildMacroArcPlan } from "../agent9-prose/types.js";
import { runResolutionRegenPass, runCulpritEvidenceRegenPass } from "../agent9-prose/regen-integration.js";
import { makeRegenFn } from "../agent9-prose/regen-llm.js";
import type { ProseChapter } from "../agent9-prose/types.js";

// A_61 RC1.4 — the resolution (B6) + culprit-evidence (B5) injectors converted to inject→regen.

const bible = buildStoryBible({
  lockedFacts: [{ id: "lf", description: "the time", value: "half past ten" }],
  cast: [
    { name: "Evelyn Harcourt", gender: "female", role_archetype: "detective" },
    { name: "James Harcourt", gender: "male", role_archetype: "suspect" },
  ],
  victim: "Lord Charles",
  culprits: ["James Harcourt"],
  macroArcPlan: buildMacroArcPlan(6),
});

describe("runResolutionRegenPass — the B6 replacement", () => {
  it("is a no-op when the final chapter already closes in-scene naming the culprit", async () => {
    const client = { chat: vi.fn() } as any;
    const closed: ProseChapter = { title: "Ch6", paragraphs: ['"I confess," said James Harcourt, and the constable arrested him.'] };
    const res = await runResolutionRegenPass({ chapter: closed, chapterNumber: 6, culprit: "James Harcourt", bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("dramatizes the reveal when the final chapter lacks it", async () => {
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({ chapter: { title: "Ch6", paragraphs: ["The room was silent.", '"It was me — I killed him," Harcourt confessed, and the inspector arrested him on the spot.'] } }),
      })),
    } as any;
    const open: ProseChapter = { title: "Ch6", paragraphs: ["The room was silent."] };
    const res = await runResolutionRegenPass({ chapter: open, chapterNumber: 6, culprit: "James Harcourt", bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(true);
    expect(res.repaired).toContain("James Harcourt");
    expect(res.chapter.paragraphs.join(" ")).toMatch(/confess|arrest/i);
  });

  it("reports unresolved (floor applies) when regen fails to close", async () => {
    const onUnresolved = vi.fn();
    const client = { chat: vi.fn(async () => ({ content: JSON.stringify({ chapter: { title: "Ch6", paragraphs: ["The room was silent.", "Nothing was resolved."] } }) })) } as any;
    const open: ProseChapter = { title: "Ch6", paragraphs: ["The room was silent."] };
    const res = await runResolutionRegenPass({ chapter: open, chapterNumber: 6, culprit: "James Harcourt", bible, regen: makeRegenFn({ client }), maxAttemptsPerDefect: 1, onUnresolved });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved).toContain("James Harcourt");
    expect(onUnresolved).toHaveBeenCalled();
  });
});

describe("runCulpritEvidenceRegenPass — the B5 replacement", () => {
  const chapters: ProseChapter[] = [
    { title: "Ch1", paragraphs: ["The body was found in the study."] },
    { title: "Ch6", paragraphs: ["James Harcourt stood accused before them all."] },
  ];

  it("is a no-op when the culprit is already linked to evidence", async () => {
    const client = { chat: vi.fn() } as any;
    const linked: ProseChapter[] = [{ title: "Ch6", paragraphs: ["James Harcourt was responsible because the timeline and the evidence placed him at the scene."] }];
    const res = await runCulpritEvidenceRegenPass({ chapters: linked, liveCulprits: ["James Harcourt"], bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(false);
    expect(client.chat).not.toHaveBeenCalled();
  });

  it("links the culprit to the evidence in the last chapter naming them", async () => {
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({ chapter: { title: "Ch6", paragraphs: ["James Harcourt stood accused before them all.", "The evidence — the timeline and the cold tea — proved James Harcourt was responsible because only he could have been in the study."] } }),
      })),
    } as any;
    const res = await runCulpritEvidenceRegenPass({ chapters, liveCulprits: ["James Harcourt"], bible, regen: makeRegenFn({ client }) });
    expect(res.ran).toBe(true);
    expect(res.repaired).toContain("James Harcourt");
  });

  it("rolls back (floor applies) when regen drops a locked fact present in the target", async () => {
    const onUnresolved = vi.fn();
    const withFact: ProseChapter[] = [{ title: "Ch6", paragraphs: ["James Harcourt was named at half past ten before the others."] }];
    const client = {
      // links the culprit but drops "half past ten"
      chat: vi.fn(async () => ({ content: JSON.stringify({ chapter: { title: "Ch6", paragraphs: ["James Harcourt was responsible because the evidence proved it."] } }) })),
    } as any;
    const res = await runCulpritEvidenceRegenPass({ chapters: withFact, liveCulprits: ["James Harcourt"], bible, regen: makeRegenFn({ client }), maxAttemptsPerDefect: 1, onUnresolved });
    expect(res.repaired).toEqual([]);
    expect(res.unresolved).toContain("James Harcourt");
  });
});
