import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { ensureDiscoverySceneMethodTellPresent } from "../jobs/agents/agent7-run.js";

// A_61 RC3.5 — additively guarantee the body-discovery scene references a cause-of-death "key tell" clue.

const makeCtx = (opts: { deathMethod?: string; clues: any[]; discoveryClues?: string[]; discoveryBeat?: string }) => ({
  cml: { CASE: { death_method: opts.deathMethod ?? "poisoning" } },
  clues: { clues: opts.clues },
  warnings: [] as string[],
});

const makeNarrative = (discoveryBeat: string, discoveryClues: string[]) => ({
  acts: [
    { actNumber: 1, scenes: [
      { sceneNumber: 1, beat: discoveryBeat, cluesRevealed: [...discoveryClues] },
      { sceneNumber: 2, beat: "investigation", cluesRevealed: ["clue_other"] },
    ] },
  ],
});

describe("ensureDiscoverySceneMethodTellPresent — RC3.5 both directions", () => {
  const origEnv = process.env.AGENT7_DISCOVERY_TELL;
  afterEach(() => { process.env.AGENT7_DISCOVERY_TELL = origEnv; });

  it("adds a tagged tell clue to the discovery scene when absent (flag on)", () => {
    process.env.AGENT7_DISCOVERY_TELL = "1";
    const clues = [
      { id: "clue_tell", description: "a bitter almond residue on the cup", isDeathMethodTell: true },
      { id: "clue_other", description: "a muddy footprint" },
    ];
    const ctx = makeCtx({ clues }) as any;
    const narrative = makeNarrative("crime", []) as any;
    ensureDiscoverySceneMethodTellPresent(ctx, narrative);
    expect(narrative.acts[0].scenes[0].cluesRevealed).toContain("clue_tell");
    expect(ctx.warnings.some((w: string) => w.includes("discovery-tell"))).toBe(true);
  });

  it("matches a tell clue by death-method token when untagged", () => {
    process.env.AGENT7_DISCOVERY_TELL = "1";
    const clues = [{ id: "clue_x", description: "the victim showed sudden numbness and collapse", keyTerms: ["numbness"] }];
    const ctx = makeCtx({ deathMethod: "poisoning", clues }) as any;
    const narrative = makeNarrative("crime", []) as any;
    ensureDiscoverySceneMethodTellPresent(ctx, narrative);
    expect(narrative.acts[0].scenes[0].cluesRevealed).toContain("clue_x");
  });

  it("is a no-op (false-positive direction) when the discovery scene already shows a tell", () => {
    process.env.AGENT7_DISCOVERY_TELL = "1";
    const clues = [{ id: "clue_tell", description: "bitter residue", isDeathMethodTell: true }];
    const ctx = makeCtx({ clues }) as any;
    const narrative = makeNarrative("crime", ["clue_tell"]) as any;
    ensureDiscoverySceneMethodTellPresent(ctx, narrative);
    expect(narrative.acts[0].scenes[0].cluesRevealed).toEqual(["clue_tell"]); // unchanged, no duplicate
    expect(ctx.warnings.length).toBe(0);
    // no other scene mutated
    expect(narrative.acts[0].scenes[1].cluesRevealed).toEqual(["clue_other"]);
  });

  it("falls back to Act1 Scene1 when no 'crime' beat exists", () => {
    process.env.AGENT7_DISCOVERY_TELL = "1";
    const clues = [{ id: "clue_tell", description: "bitter residue", isDeathMethodTell: true }];
    const ctx = makeCtx({ clues }) as any;
    const narrative = makeNarrative("opening", []) as any; // no crime beat
    ensureDiscoverySceneMethodTellPresent(ctx, narrative);
    expect(narrative.acts[0].scenes[0].cluesRevealed).toContain("clue_tell");
  });

  it("is inert when the flag is OFF (default)", () => {
    process.env.AGENT7_DISCOVERY_TELL = "";
    const clues = [{ id: "clue_tell", description: "bitter residue", isDeathMethodTell: true }];
    const ctx = makeCtx({ clues }) as any;
    const narrative = makeNarrative("crime", []) as any;
    ensureDiscoverySceneMethodTellPresent(ctx, narrative);
    expect(narrative.acts[0].scenes[0].cluesRevealed).toEqual([]);
  });

  it("is a no-op when no recognisable tell clue exists", () => {
    process.env.AGENT7_DISCOVERY_TELL = "1";
    const clues = [{ id: "clue_other", description: "a muddy footprint" }];
    const ctx = makeCtx({ deathMethod: "poisoning", clues }) as any;
    const narrative = makeNarrative("crime", []) as any;
    ensureDiscoverySceneMethodTellPresent(ctx, narrative);
    expect(narrative.acts[0].scenes[0].cluesRevealed).toEqual([]);
  });
});
