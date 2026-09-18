/**
 * ANALYSIS_99 §10.13 — THE DRY RUN.
 *
 * Every prompt v2 would send, built over a real archived project, with no call made. It is the
 * cheapest thing in the plan and it answers the two questions that otherwise cost £1.10 to ask: does
 * the stage run end to end on real artifacts, and how big is the prompt it would send?
 *
 * The number matters. v1's fixed prefix is ~23,600 tokens by chapter 10 and its cross-chapter cache
 * prefix is 7.6% (15_llm §5.1), which is why a frontier writer was unaffordable. v2's stable half is
 * the bible plus the brief, measured at 4,442 tokens over the archive, and this test is where that
 * claim meets a whole assembled prompt.
 */
import { afterEach, describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { buildContractInput, generateBookV2, isProseEngineV2 } from "../jobs/agents/agent9-v2/run.js";
import { hashContract } from "../jobs/agents/agent9-v2/checkpoint.js";
import { resetRoleCache, resolveRole, roleLabel } from "../jobs/agents/agent9-v2/roles.js";
import type { OrchestratorContext } from "../jobs/agents/shared.js";

const REPO_ROOT = join(process.cwd(), "..", "..");

const loadProject = (): Record<string, unknown> | null => {
  const path = join(REPO_ROOT, "data", "store.json");
  if (!existsSync(path)) return null;
  try {
    const store = JSON.parse(readFileSync(path, "utf8")) as {
      artifacts?: Array<{ projectId?: string; type?: string; payload?: unknown }>;
    };
    const byProject = new Map<string, Record<string, unknown>>();
    for (const artifact of store.artifacts ?? []) {
      const id = String(artifact?.projectId ?? "");
      const type = String(artifact?.type ?? "");
      if (!id || !type) continue;
      if (!byProject.has(id)) byProject.set(id, {});
      byProject.get(id)![type] = artifact.payload;
    }
    for (const [, artifacts] of [...byProject].reverse()) {
      if (artifacts.cml && artifacts.clues && artifacts.outline && artifacts.cast && artifacts.character_profiles) {
        return artifacts;
      }
    }
  } catch {
    return null;
  }
  return null;
};

const artifacts = loadProject();

const unwrap = (value: unknown, keys: string[]): unknown => {
  const v = value as Record<string, unknown> | null;
  if (!v || typeof v !== "object") return value;
  for (const key of keys) if (v[key] && typeof v[key] === "object") return v[key];
  return value;
};

const fakeContext = (): OrchestratorContext => {
  const warnings: string[] = [];
  const errors: string[] = [];
  return {
    client: {
      chat: async () => {
        throw new Error("the dry run must make no call");
      },
      getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
    },
    inputs: { targetLength: "short", humourLevel: "classic" },
    runId: "dry",
    projectId: "dry",
    startTime: Date.now(),
    reportProgress: () => {},
    warnings,
    errors,
    workerAppRoot: join(process.cwd(), "logs-test"),
    workspaceRoot: REPO_ROOT,
    primaryAxis: "temporal",
    cml: artifacts?.cml,
    clues: artifacts?.clues,
    narrative: unwrap(artifacts?.outline, ["narrative", "outline"]),
    cast: { cast: unwrap(artifacts?.cast, ["cast"]) },
    characterProfiles: artifacts?.character_profiles,
    worldDocument: artifacts?.world_document,
    locationProfiles: artifacts?.location_profiles,
    temporalContext: artifacts?.temporal_context,
    setting: artifacts?.setting,
    lockedFactRegistry: (
      (artifacts?.hard_logic_devices as { devices?: Array<{ lockedFacts?: unknown[] }> } | undefined)?.devices?.[0]
        ?.lockedFacts ?? []
    ),
  } as unknown as OrchestratorContext;
};

const KEYS = ["PROSE_ENGINE", "PROSE_V2_DRY", "PROSE_V2_WRITER", "PROSE_V2_DRAFTS"] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
afterEach(() => {
  // `process.env.X = undefined` writes the STRING "undefined", which is how the first cut of this
  // suite silently changed the segmentation plan of every test after the first. Delete, never assign.
  for (const key of KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  resetRoleCache();
});

describe("the switch", () => {
  it("is OFF unless the environment says v2, so v1 is untouched by default", () => {
    delete process.env.PROSE_ENGINE;
    expect(isProseEngineV2()).toBe(false);
    expect(isProseEngineV2({ PROSE_ENGINE: "v1" } as NodeJS.ProcessEnv)).toBe(false);
    expect(isProseEngineV2({ PROSE_ENGINE: "v2" } as NodeJS.ProcessEnv)).toBe(true);
    expect(isProseEngineV2({ PROSE_ENGINE: " V2 " } as NodeJS.ProcessEnv)).toBe(true);
  });
});

describe("the roles", () => {
  const azure = { chat: async () => ({ content: "" }) } as never;

  it("default to Azure, and carry a label the cost tracker can attribute", () => {
    delete process.env.PROSE_V2_WRITER;
    const writer = resolveRole("writer", azure);
    expect(writer.provider).toBe("azure");
    expect(writer.maxOutputTokens).toBe(32_768);
    expect(writer.supportsTemperature).toBe(true);
    expect(roleLabel("writer", "S0-D1")).toBe("Agent9v2-Writer-S0-D1");
  });

  it("REGRESSION: a malformed or stringy-undefined setting keeps the role's own cap", () => {
    // `planSegments` is sized against this number, so a blind fallback re-segments the book. The dry
    // run caught it: a book that fits one call was planned as three, and nothing said why.
    for (const value of ["undefined", "", "azure:not-a-model", "nonsense"]) {
      process.env.PROSE_V2_WRITER = value;
      expect(resolveRole("writer", azure).maxOutputTokens, value).toBe(32_768);
    }
  });

  it("an anthropic role with no key falls back to Azure rather than aborting a run", () => {
    process.env.PROSE_V2_WRITER = "anthropic:claude-opus-5";
    const key = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      const writer = resolveRole("writer", azure);
      expect(writer.provider).toBe("azure");
    } finally {
      if (key !== undefined) process.env.ANTHROPIC_API_KEY = key;
    }
  });

  it("a Claude role never offers temperature — it is a 400, not a no-op", () => {
    process.env.PROSE_V2_WRITER = "anthropic:claude-opus-5";
    process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "sk-test-key-for-resolution-only";
    const writer = resolveRole("writer", azure);
    if (writer.provider === "anthropic") expect(writer.supportsTemperature).toBe(false);
  });
});

describe("the contract hash", () => {
  it("changes when the book changes, so a resumed run cannot continue a different one", () => {
    const a = hashContract({ chapters: 10, reveal: 9, aftermath: 10, clueIds: ["a", "b"] });
    expect(hashContract({ chapters: 10, reveal: 9, aftermath: 10, clueIds: ["b", "a"] })).toBe(a);
    expect(hashContract({ chapters: 10, reveal: 8, aftermath: 10, clueIds: ["a", "b"] })).not.toBe(a);
    expect(hashContract({ chapters: 11, reveal: 9, aftermath: 10, clueIds: ["a", "b"] })).not.toBe(a);
  });
});

describe.skipIf(!artifacts)("the dry run over a real archived project", () => {
  it("adapts the context into a contract input that carries every artifact", () => {
    const input = buildContractInput(fakeContext());
    expect(input.cml).toBeTruthy();
    expect(input.outline).toBeTruthy();
    expect((input.cast?.characters ?? []).length).toBeGreaterThan(0);
    expect((input.profiles?.profiles ?? []).length).toBeGreaterThan(0);
  });

  it("runs end to end with no call, and reports the prompt it would have sent", async () => {
    process.env.PROSE_ENGINE = "v2";
    process.env.PROSE_V2_DRY = "1";
    process.env.PROSE_V2_DRAFTS = "3";
    const ctx = fakeContext();
    const result = await generateBookV2(ctx);

    expect(result.contract.engine).toBe("v2");
    expect(result.contract.scenes.length).toBeGreaterThan(0);
    const dry = ctx.warnings.filter((w) => w.includes("DRY RUN"));
    expect(dry.length).toBeGreaterThan(0);

    const sizes = dry.map((w) => Number(/prompt (\d+) tokens/.exec(w)?.[1] ?? 0));
    const biggest = Math.max(...sizes);
    console.info(
      `[v2 dry run] ${result.contract.book.chapters} chapters in ${dry.length} segment(s), ` +
        `biggest prompt ${biggest} tokens ` +
        `(bible ${result.contract.bible.tokens} + brief ${result.contract.brief.tokens}); ` +
        `v1's fixed prefix alone is ~23,600 by chapter 10`,
    );
    expect(biggest).toBeGreaterThan(0);
    // The whole first prompt — bible, brief, every chapter contract, the format instruction — must
    // fit well inside v1's ceiling, because that is what makes a frontier writer affordable.
    expect(biggest).toBeLessThan(24_000);
  });

  it("the telemetry block leads with the law v2 exists to keep", async () => {
    process.env.PROSE_ENGINE = "v2";
    process.env.PROSE_V2_DRY = "1";
    const ctx = fakeContext();
    const result = await generateBookV2(ctx);
    expect(result.telemetry[0]).toBe("[Agent 9 v2] deterministic writes: 0");
    expect(result.telemetry.join("\n")).toMatch(/contract: \d+ chapters, reveal ch\d+/);
    expect(result.telemetry.join("\n")).toMatch(/plan: (book|acts|chapters)/);
  });
});
