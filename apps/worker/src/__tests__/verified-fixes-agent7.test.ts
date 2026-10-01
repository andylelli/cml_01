/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — Agent 7 / 7.5 items A7-D02, A7-D05, A7-D09.
 * Flag OFF pins today's behaviour; flag ON pins the fix.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockFormatNarrative = vi.hoisted(() => vi.fn());
vi.mock("@cml/prompts-llm", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@cml/prompts-llm")>()),
  formatNarrative: (...args: any[]) => mockFormatNarrative(...args),
}));

import { ensureSchemaValid } from "../jobs/agents/agent7/generate.js";
import { fillMissingActPurposes } from "../jobs/agents/agent7/normalize.js";
import { commitAndStampOutline, warnIfCommittedOutlineInvalid } from "../jobs/agents/agent7/stamps.js";
import { runAgent75 } from "../jobs/agents/agent75-run.js";

const FLAG = "CML_VERIFIED_FIXES";
let savedFlag: string | undefined;
let savedGeometry: string | undefined;
beforeEach(() => {
  savedFlag = process.env[FLAG];
  savedGeometry = process.env.AGENT75_GEOMETRY;
  mockFormatNarrative.mockReset();
});
afterEach(() => {
  if (savedFlag === undefined) delete process.env[FLAG]; else process.env[FLAG] = savedFlag;
  if (savedGeometry === undefined) delete process.env.AGENT75_GEOMETRY; else process.env.AGENT75_GEOMETRY = savedGeometry;
});
const setFlag = (on: boolean) => { if (on) process.env[FLAG] = "1"; else delete process.env[FLAG]; };

/** A schema-valid outline (the run-87779 shape with counts), optionally missing one act purpose. */
const outline = (opts: { dropPurposeOnAct?: number } = {}): any => ({
  title: "The Chime That Fell Wrong",
  logline: "A country-house clock strikes at an hour it should not.",
  totalScenes: 10,
  estimatedTotalWords: 15000,
  pacingNotes: ["Steady."],
  cost: 0,
  durationMs: 0,
  acts:[3, 4, 3].map((sceneCount, actIndex) => ({
    actNumber: actIndex + 1,
    title: `Act ${actIndex + 1}`,
    ...(opts.dropPurposeOnAct === actIndex + 1 ? {} : { purpose: "Advance the story." }),
    estimatedWordCount: 5000,
    scenes: Array.from({ length: sceneCount }, (_, i) => ({
      sceneNumber: i + 1,
      act: actIndex + 1,
      title: `Scene ${i + 1}`,
      purpose: "Something happens.",
      summary: "A summary of the scene.",
      characters: ["Julian Penhale"],
      cluesRevealed: [],
      setting: { location: "The library", timeOfDay: "evening", atmosphere: "tense" },
      dramaticElements: { tension: "high", conflict: "interpersonal", revelation: "partial" },
      beat: null,
      estimatedWordCount: 1234,
    })),
  })),
});

const ctx7 = (): any => ({
  client: {},
  inputs: { targetLength: "short" },
  runId: "run",
  projectId: "proj",
  warnings: [],
  errors: [],
  agentCosts: {},
  agentDurations: {},
  enableScoring: false,
  cml: { CASE: {} },
  clues: { clues: [] },
});
const run7 = (): any => ({ minClueSceneRatio: 0, pacingGuardrails: [], lockedFactsSpread: {}, completenessSpread: {} });

describe("A7-D02 — the schema-repair retry fills a missing act purpose", () => {
  it("fillMissingActPurposes is the attempt-1 fill (default purpose + warning)", () => {
    const ctx = ctx7();
    const o = outline({ dropPurposeOnAct: 2 });
    fillMissingActPurposes(ctx, o);
    expect(o.acts[1].purpose).toMatch(/Develop the investigation/);
    expect(ctx.warnings).toContain("act2.purpose was missing — synthesised default.");
  });

  it("flag OFF: a retry that omits an act purpose still hard-aborts", async () => {
    setFlag(false);
    mockFormatNarrative.mockResolvedValue({ ...outline({ dropPurposeOnAct: 2 }), cost: 0.01 });
    const ctx = ctx7();
    const first = outline({ dropPurposeOnAct: 1 });
    await expect(ensureSchemaValid(ctx, run7(), first)).rejects.toThrow(/failed schema validation/);
    expect(ctx.errors.join(" ")).toMatch(/purpose/);
  });

  it("flag ON: the retry gets the same fill and is adopted", async () => {
    setFlag(true);
    mockFormatNarrative.mockResolvedValue({ ...outline({ dropPurposeOnAct: 2 }), cost: 0.01 });
    const ctx = ctx7();
    const result = await ensureSchemaValid(ctx, run7(), outline({ dropPurposeOnAct: 1 }));
    expect(result.acts[1].purpose).toMatch(/Develop the investigation/);
    expect(ctx.warnings).toContain("Narrative outline schema-repair retry succeeded");
    expect(ctx.errors).toEqual([]);
  });
});

describe("A7-D05 — the committed outline is schema-checked, warn-only", () => {
  it("a valid outline produces no warning", () => {
    const ctx = ctx7();
    warnIfCommittedOutlineInvalid(ctx, outline());
    expect(ctx.warnings).toEqual([]);
  });

  it("an invalid outline warns and never throws", () => {
    const ctx = ctx7();
    expect(() => warnIfCommittedOutlineInvalid(ctx, outline({ dropPurposeOnAct: 3 }))).not.toThrow();
    expect(ctx.warnings).toHaveLength(1);
    expect(ctx.warnings[0]).toMatch(/^\[A7-D05\] Committed outline fails narrative_outline schema validation/);
  });

  const commitInvalid = (on: boolean): string[] => {
    setFlag(on);
    const ctx = { ...ctx7(), reportProgress: () => {} };
    commitAndStampOutline(ctx, { title: "T", acts: [{ actNumber: 1, scenes: [{ sceneNumber: 1 }] }] } as any, false, []);
    return ctx.warnings.filter((w: string) => w.includes("[A7-D05]"));
  };

  it("flag OFF: commitAndStampOutline commits an invalid outline silently (today)", () => {
    expect(commitInvalid(false)).toEqual([]);
  });

  it("flag ON: commitAndStampOutline warns once on an invalid outline", () => {
    const warned = commitInvalid(true);
    expect(warned).toHaveLength(1);
    expect(warned[0]).toMatch(/acts\[0\]\.purpose is required/);
  });
});

describe("A7-D09 — runAgent75 asks the caller to re-persist a gate-mode repair", () => {
  const ctx75 = (): any => ({
    client: { getCostTracker: () => ({ getTotalCost: () => 0 }), chat: vi.fn() },
    runId: "run-test",
    projectId: "proj",
    warnings: [],
    errors: [],
    agentCosts: {},
    agentDurations: {},
    reportProgress: () => {},
    cml: {
      CASE: {
        culpability: { culprits: ["Hugo Hale"] },
        death_method: "strangled",
        hidden_model: { mechanism: { actual_time_of_death: "10:15", apparent_time_of_death: "8:50" } },
        // accusing the culprit leaves the contract unclosed, which opens the gate-mode repair path
        false_solution: { accused_suspect: "Hugo Hale" },
        cast: [{ name: "Hugo Hale", role_archetype: "suspect" }, { name: "Eleanor Frey", role_archetype: "suspect" }],
      },
    },
    clues: {
      clues: [
        { id: "c_fabric", category: "physical", criticality: "essential", description: "a torn scrap of grey fabric", keyTerms: ["fabric"] },
      ],
    },
    narrative: {
      acts: [
        {
          scenes: [
            { beat: "gathering" }, { beat: "crime" }, { beat: "first_enquiries" }, { beat: "motives" },
            { beat: "alibis" }, { beat: "false_solution" }, { beat: "secrets" }, { beat: "pattern" },
            { beat: "final_trap" }, { beat: "revelation" },
          ],
        },
      ],
    },
  });

  it("flag OFF: resolves undefined (as before) even when the gate repaired the outline", async () => {
    setFlag(false);
    process.env.AGENT75_GEOMETRY = "gate";
    const ctx = ctx75();
    const before = JSON.stringify(ctx.narrative);
    expect(await runAgent75(ctx)).toBeUndefined();
    expect(JSON.stringify(ctx.narrative)).not.toBe(before); // the repair did happen
  });

  it("flag ON: returns true when the gate repaired the outline", async () => {
    setFlag(true);
    process.env.AGENT75_GEOMETRY = "gate";
    const ctx = ctx75();
    expect(await runAgent75(ctx)).toBe(true);
    expect(ctx.narrative.acts[0].scenes[0].geometryRole).toBe("opening");
  });

  it("flag ON: shadow mode (no repair) resolves undefined", async () => {
    setFlag(true);
    process.env.AGENT75_GEOMETRY = "shadow";
    expect(await runAgent75(ctx75())).toBeUndefined();
  });

  it("the orchestrator re-persists the outline on true, in one line", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync(new URL("../jobs/mystery-orchestrator.ts", import.meta.url), "utf8");
    expect(src).toMatch(/if \(await runAgent75\(ctx\)\) await persistArtifact\("outline", ctx\.narrative\);/);
  });
});
