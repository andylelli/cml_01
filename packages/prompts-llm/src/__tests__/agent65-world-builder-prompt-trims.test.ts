/**
 * A6-17 (CR-28, CML_PROMPT_TRIMS) — World Builder prompt economy.
 *
 * OFF: the system prompt and the user message are byte-identical to the pre-change code. The hashes below were
 * recorded from a compile of the source BEFORE the edit, over the four golden bundles (they also fold in the
 * configured arc word count, so a generation-params.yaml change moves them too).
 * ON: compact JSON, the CASE projection drops the solution / generator-control keys, and the system prompt's arc
 * word minimum is rendered from config (`arc_description_gate + arc_description_prompt_buffer`) like the retries.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const arcOverride: { gate?: number; buffer?: number } = {};
vi.mock("@cml/story-validation", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    getGenerationParams: () => {
      const p = actual.getGenerationParams();
      if (arcOverride.gate === undefined) return p;
      const copy = structuredClone(p);
      copy.agent65_world_builder.params.quality.arc_description_gate = arcOverride.gate;
      copy.agent65_world_builder.params.quality.arc_description_prompt_buffer = arcOverride.buffer;
      return copy;
    },
  };
});

import { __testables, generateWorldDocument } from "../agent65-world-builder.ts";

const { buildWorldBuilderUserMessage, worldBuilderSystem, projectCaseForWorldBuilder, WORLD_BUILDER_CASE_OMIT } = __testables;

const FLAG = "CML_PROMPT_TRIMS";
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

const GOLDEN_IDS = ["56049d93", "6b91b4b1", "a5c017a1", "eb1251aa"] as const;
const OLD_SYS = "1fdd5860ed423733664e95aa78489cc99117ed0b8a7b95e0a97fb866116bdde3";
const OLD_USER: Record<string, string> = {
  "56049d93": "ad7a4cc71767bcd8883287886f597d6e5509e1087eb2687b371dde6406e904d1",
  "6b91b4b1": "6a48e35076f1a4d8477021d689f8ed0605f6c17df1a2caa59f4f374b672ec569",
  "a5c017a1": "f523e55c82264d7499cf065e823ef2faab1df4fcb6d2e1e30cdedd32bffe4dc2",
  "eb1251aa": "6ba2048619914411077e86ddab0a366d8d8b58f84b8566c089fba72c68cf0987",
};

function inputsOf(id: string): any {
  const a = JSON.parse(
    readFileSync(fileURLToPath(new URL(`../../../../eval/golden/bundle-${id}.json`, import.meta.url)), "utf8"),
  ).artifacts;
  return {
    caseData: a.cml,
    characterProfiles: a.character_profiles,
    locationProfiles: a.location_profiles,
    temporalContext: a.temporal_context,
    backgroundContext: a.background_context,
    hardLogicDevices: a.hard_logic_devices,
    clueDistribution: a.clues,
    runId: "r",
    projectId: "p",
  };
}

/** The messages generateWorldDocument actually sends on its first call. */
async function firstCall(inputs: any): Promise<Array<{ role: string; content: string }>> {
  let first: any;
  const client = {
    chat: vi.fn(async (req: any) => {
      first ??= req.messages;
      return { content: "not json", finishReason: "stop", model: "m", usage: {}, latencyMs: 1, cost: 0 };
    }),
  };
  await generateWorldDocument(inputs, client as any).catch(() => undefined);
  return first;
}

function caseBlock(user: string): string {
  return user.split("### CASE\n")[1].split("\n\n### CHARACTER_PROFILES")[0];
}

describe("A6-17 CML_PROMPT_TRIMS — World Builder", () => {
  let saved: string | undefined;
  beforeEach(() => {
    saved = process.env[FLAG];
    delete process.env[FLAG];
    delete arcOverride.gate;
    delete arcOverride.buffer;
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved;
    vi.restoreAllMocks();
  });

  it.each(GOLDEN_IDS)("OFF: system and user messages are byte-identical to the pre-change code (%s)", async (id) => {
    const [sys, user] = await firstCall(inputsOf(id));
    expect(sha(sys.content)).toBe(OLD_SYS);
    expect(sha(user.content)).toBe(OLD_USER[id]);
  });

  it("OFF: the system prompt keeps the literal 300 even when config says otherwise", () => {
    arcOverride.gate = 250;
    arcOverride.buffer = 100;
    expect(sha(worldBuilderSystem())).toBe(OLD_SYS);
    expect(worldBuilderSystem()).toContain("at least 300 words");
  });

  it.each(GOLDEN_IDS)("ON: inputs are compact, the dropped CASE keys are absent and the kept ones present (%s)", async (id) => {
    process.env[FLAG] = "1";
    const inputs = inputsOf(id);
    const [, user] = await firstCall(inputs);
    const inputsPart = user.content.split("---\n\n## OUTPUT INSTRUCTIONS")[0];
    expect(inputsPart).not.toMatch(/\n {2}["{[]/);
    const sent = JSON.parse(caseBlock(user.content));
    for (const k of WORLD_BUILDER_CASE_OMIT) expect(sent, k).not.toHaveProperty(k);
    const full = inputs.caseData.CASE;
    for (const k of Object.keys(full).filter((k) => !(WORLD_BUILDER_CASE_OMIT as readonly string[]).includes(k))) {
      expect(sent[k], k).toEqual(full[k]);
    }
    // The solution half stays (the reveal draws on it — 394 archived phrase hits); only other agents' instructions go.
    for (const k of ["meta", "cast", "culpability", "surface_model", "false_assumption", "hidden_model", "inference_path", "discriminating_test"]) expect(sent).toHaveProperty(k);
    // Known-positive: the same block with the flag OFF carries the dropped keys and the indentation.
    delete process.env[FLAG];
    const offUser = buildWorldBuilderUserMessage(inputs);
    const offCase = JSON.parse(caseBlock(offUser));
    expect(Object.keys(offCase)).toEqual(expect.arrayContaining([...WORLD_BUILDER_CASE_OMIT].filter((k) => k in inputs.caseData.CASE)));
    expect([...WORLD_BUILDER_CASE_OMIT].some((k) => k in inputs.caseData.CASE)).toBe(true);
    expect(offUser).toMatch(/\n {2}"/);
    expect(user.content.length).toBeLessThan(offUser.length * 0.85);
  });

  it("ON: the input artifacts are not mutated by the projection", () => {
    process.env[FLAG] = "1";
    const inputs = inputsOf(GOLDEN_IDS[0]);
    const before = JSON.stringify(inputs.caseData);
    buildWorldBuilderUserMessage(inputs);
    expect(JSON.stringify(inputs.caseData)).toBe(before);
    expect(projectCaseForWorldBuilder(null)).toBeNull();
  });

  it("ON: the system prompt renders the arc word minimum from config, agreeing with the user message", async () => {
    process.env[FLAG] = "1";
    arcOverride.gate = 250;
    arcOverride.buffer = 100;
    const [sys, user] = await firstCall(inputsOf(GOLDEN_IDS[0]));
    expect(sys.content).toContain("It MUST be at least 350 words");
    expect(sys.content).toContain("A response shorter than 350 words");
    expect(sys.content).not.toContain("300 words");
    expect(user.content).toContain("arcDescription: MINIMUM 350 words");
    // With the shipped config (200 + 100) the rendered text is the old text.
    delete arcOverride.gate;
    delete arcOverride.buffer;
    expect(sha(worldBuilderSystem())).toBe(OLD_SYS);
  });
});
