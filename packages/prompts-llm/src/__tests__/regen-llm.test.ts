import { describe, expect, it, vi } from "vitest";
import { noScaffoldValidator } from "@cml/prose-guard";
import type { ValidatorResult } from "@cml/prose-guard";
import { buildRegenPrompt, makeRegenFn } from "../agent9-prose/regen-llm.js";
import { runRegenRepair, type ProseDefect, type RegenRequest } from "../agent9-prose/regen-repair.js";
import type { ProseChapter } from "../agent9-prose/types.js";

// LLD §6.4 / P3.3 — the concrete RegenFn. Prompt-construction + parsing are tested with a mock client;
// then an end-to-end pass through runRegenRepair proves the loop + LLM + validator compose.

const chapter: ProseChapter = { title: "Ch3", summary: "the study", paragraphs: ["Evelyn entered.", "Nothing seemed amiss."] };
const defect: ProseDefect = {
  chapter: 3,
  paragraphIndex: 1,
  kind: "missing_clue",
  detail: "the cold tea clue is absent",
  obligationRef: "clue_cold_tea",
  severity: "hard",
};
const req: RegenRequest = {
  chapter,
  paragraphIndex: 1,
  instruction: "plant clue_cold_tea here as an in-scene observation",
  constraints: {
    lockedFacts: [{ value: "half past three", description: "the staged time" }],
    pronouns: { "Evelyn Harcourt": "she/her", "James Harcourt": "he/him" },
    mustNotReveal: ["James Harcourt is the culprit"],
  },
  defect,
};

describe("buildRegenPrompt — carries the obligation + all hard constraints", () => {
  const { system, user } = buildRegenPrompt(req);

  it("instructs surgical, in-scene, change-as-little-as-possible revision", () => {
    expect(system).toMatch(/surgical/i);
    expect(system).toMatch(/in-scene/i);
    expect(system).toMatch(/never alter.*pronoun/i);
  });

  it("includes the instruction, locked facts, pronoun lock, and embargo", () => {
    expect(user).toMatch(/plant clue_cold_tea here as an in-scene observation/);
    expect(user).toMatch(/half past three \(the staged time\)/);
    expect(user).toMatch(/Evelyn Harcourt: she\/her/);
    expect(user).toMatch(/EMBARGO/);
    expect(user).toMatch(/James Harcourt is the culprit/);
  });

  it("scopes the edit to the target paragraph index", () => {
    expect(user).toMatch(/paragraph index 1/);
  });

  it("pins the output schema and ships the source chapter", () => {
    expect(user).toMatch(/"chapter":\{"title"/);
    expect(user).toMatch(/Nothing seemed amiss/);
  });
});

describe("makeRegenFn — calls the client once and parses the single-chapter payload", () => {
  it("returns the parsed revised chapter", async () => {
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({
          chapter: { title: "Ch3", summary: "the study", paragraphs: ["Evelyn entered.", "The cold tea sat untouched."] },
        }),
      })),
    } as any;
    const regen = makeRegenFn({ client, model: "test-deploy", runId: "r1", projectId: "p1" });
    const out = await regen(req);
    expect(out.paragraphs[1]).toMatch(/cold tea/);
    expect(client.chat).toHaveBeenCalledOnce();
    const callArg = client.chat.mock.calls[0][0];
    expect(callArg.jsonMode).toBe(true);
    expect(callArg.temperature).toBe(0.3); // surgical, not creative
    expect(callArg.model).toBe("test-deploy");
    expect(callArg.logContext.agent).toMatch(/Agent9-Regen-Ch3-missing_clue/);
  });

  it("propagates a malformed payload as a throw (the loop treats it as a failed attempt)", async () => {
    const client = { chat: vi.fn(async () => ({ content: "not json at all {" })) } as any;
    const regen = makeRegenFn({ client });
    await expect(regen(req)).rejects.toBeTruthy();
  });
});

describe("end-to-end — makeRegenFn driving runRegenRepair", () => {
  const cluePresent = (c: ProseChapter): ValidatorResult => {
    const present = (c.paragraphs ?? []).join(" ").toLowerCase().includes("cold tea");
    const scaffold = noScaffoldValidator((c.paragraphs ?? []).join(" "));
    return {
      ok: present && scaffold.ok,
      score: (present ? 100 : 0) + scaffold.score,
      violations: [...(present ? [] : ["missing_clue:cold tea"]), ...scaffold.violations],
    };
  };

  it("a good model response plants the clue and the loop accepts it", async () => {
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({ chapter: { title: "Ch3", paragraphs: ["Evelyn entered.", "The cold tea sat untouched, a skin on its surface."] } }),
      })),
    } as any;
    const regen = makeRegenFn({ client });
    const res = await runRegenRepair(chapter, [defect], (c, d) => ({ ...req, chapter: c, defect: d }), regen, cluePresent);
    expect(res.outcomes[0].applied).toBe(true);
    expect(res.unresolved).toEqual([]);
  });

  it("a model response that smuggles in scaffold is rolled back, defect stays unresolved", async () => {
    const onUnresolved = vi.fn();
    const client = {
      chat: vi.fn(async () => ({
        content: JSON.stringify({ chapter: { title: "Ch3", paragraphs: ["Evelyn entered.", "She weighed the cold tea, and the trail bent toward the gardener."] } }),
      })),
    } as any;
    const regen = makeRegenFn({ client });
    const res = await runRegenRepair(chapter, [defect], (c, d) => ({ ...req, chapter: c, defect: d }), regen, cluePresent, {
      maxAttemptsPerDefect: 1,
      onUnresolved,
    });
    expect(res.outcomes[0].applied).toBe(false);
    expect(onUnresolved).toHaveBeenCalled();
  });
});
