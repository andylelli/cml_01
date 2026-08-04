/**
 * Agent 7.5 — the stage, its modes, and the wiring that decides whether it is reachable at all.
 *
 * The unit-level behaviour of the contract lives in `@cml/story-geometry`. What is asserted here is
 * the part that has historically gone wrong in this repository: a lever that reads as enabled and
 * does nothing, a stage that becomes a new abort class, and a resumed run that silently re-derives a
 * different contract than the one its chapters were written against.
 */

import { describe, expect, it, vi } from "vitest";

import { resolveGeometryStageMode, runAgent75 } from "../jobs/agents/agent75-run.js";
import { assertFlagCapabilities, FlagCapabilityError } from "../jobs/flag-preflight.js";
import { RESUME_FIELD_BY_ARTIFACT } from "../jobs/resume-hydration.js";

const makeCtx = (overrides: Record<string, unknown> = {}): any => ({
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
      false_solution: { accused_suspect: "Eleanor Frey" },
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
  ...overrides,
});

const withEnv = async (env: Record<string, string | undefined>, fn: () => Promise<void>) => {
  const saved: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(env)) {
    saved[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    await fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
};

describe("AGENT75_GEOMETRY mode", () => {
  it("defaults to shadow — a read-only checker that ships dark is the failure this design targets", () => {
    expect(resolveGeometryStageMode({} as NodeJS.ProcessEnv)).toBe("shadow");
  });

  it("reads the mode at runtime, not at module load (the dotenv-freeze trap)", () => {
    expect(resolveGeometryStageMode({ AGENT75_GEOMETRY: "off" } as NodeJS.ProcessEnv)).toBe("off");
    expect(resolveGeometryStageMode({ AGENT75_GEOMETRY: "gate" } as NodeJS.ProcessEnv)).toBe("gate");
    expect(resolveGeometryStageMode({ AGENT75_GEOMETRY: "shadow" } as NodeJS.ProcessEnv)).toBe("shadow");
  });
});

describe("runAgent75", () => {
  it("derives the contract in shadow and makes no LLM call", async () => {
    await withEnv({ AGENT75_GEOMETRY: "shadow", AGENT75_GEOMETRY_RESOLVE: undefined }, async () => {
      const ctx = makeCtx();
      await runAgent75(ctx);
      expect(ctx.storyGeometry?.closure.closed).toBe(true);
      expect(ctx.storyGeometry?.clincher?.clueId).toBe("c_fabric");
      expect(ctx.client.chat).not.toHaveBeenCalled();
    });
  });

  it("leaves the outline untouched in shadow", async () => {
    await withEnv({ AGENT75_GEOMETRY: "shadow" }, async () => {
      const ctx = makeCtx();
      const before = JSON.stringify(ctx.narrative);
      await runAgent75(ctx);
      expect(JSON.stringify(ctx.narrative)).toBe(before);
    });
  });

  it("applies additive outline repair only in gate mode, and only when the contract is unclosed", async () => {
    await withEnv({ AGENT75_GEOMETRY: "gate" }, async () => {
      // A false solution that accuses the culprit leaves the contract unclosed, which is what opens
      // the repair path. The repair cannot fix that particular defect — and must not claim to.
      const ctx = makeCtx();
      ctx.cml.CASE.false_solution.accused_suspect = "Hugo Hale";
      await runAgent75(ctx);
      const scenes = ctx.narrative.acts[0].scenes;
      expect(scenes[0].geometryRole).toBe("opening");
      expect(scenes[8].geometryRole).toBe("reveal");
      expect(ctx.storyGeometry.closure.closed).toBe(false);
      expect(ctx.warnings.join(" ")).toMatch(/GEOMETRY NOT CLOSED/);
    });
  });

  it("does nothing at all when off", async () => {
    await withEnv({ AGENT75_GEOMETRY: "off" }, async () => {
      const ctx = makeCtx();
      await runAgent75(ctx);
      expect(ctx.storyGeometry).toBeUndefined();
      expect(ctx.warnings).toEqual([]);
    });
  });

  it("inherits a restored contract rather than re-deriving a different one", async () => {
    await withEnv({ AGENT75_GEOMETRY: "shadow" }, async () => {
      const restored = { version: 1, chapterCount: 99 } as any;
      const ctx = makeCtx({ storyGeometry: restored });
      await runAgent75(ctx);
      expect(ctx.storyGeometry).toBe(restored);
      expect(ctx.warnings.join(" ")).toMatch(/restored from artifact/);
    });
  });

  it("never becomes a new abort class — a broken input warns and the pipeline continues", async () => {
    await withEnv({ AGENT75_GEOMETRY: "gate" }, async () => {
      const ctx = makeCtx();
      // A getter that throws is the cheapest stand-in for any upstream shape this stage cannot read.
      Object.defineProperty(ctx, "cml", {
        get() {
          throw new Error("cml exploded");
        },
      });
      await expect(runAgent75(ctx)).resolves.toBeUndefined();
      expect(ctx.storyGeometry).toBeUndefined();
      expect(ctx.warnings.join(" ")).toMatch(/geometry unavailable/);
    });
  });
});

describe("resume", () => {
  it("persists the contract so a resumed run inherits the acceptance test it was written against", () => {
    expect((RESUME_FIELD_BY_ARTIFACT as Record<string, string>).story_geometry).toBe("storyGeometry");
  });
});

describe("flag preflight — combinations that would silently run the control arm", () => {
  it("refuses a prose contract with the stage off", () => {
    expect(() =>
      assertFlagCapabilities({ AGENT75_GEOMETRY: "off", AGENT9_GEOMETRY_CONTRACT: "true" } as NodeJS.ProcessEnv),
    ).toThrow(FlagCapabilityError);
  });

  it("refuses acceptance=apply with the stage off", () => {
    expect(() =>
      assertFlagCapabilities({ AGENT75_GEOMETRY: "off", AGENT9_GEOMETRY_ACCEPTANCE: "apply" } as NodeJS.ProcessEnv),
    ).toThrow(FlagCapabilityError);
  });

  it("refuses the aftermath-repeat pass when the acceptance test is not in apply", () => {
    expect(() =>
      assertFlagCapabilities({ AGENT9_REGEN_AFTERMATH_REPEAT: "true" } as NodeJS.ProcessEnv),
    ).toThrow(FlagCapabilityError);
  });

  it("permits the default configuration", () => {
    expect(() => assertFlagCapabilities({} as NodeJS.ProcessEnv)).not.toThrow();
  });
});
