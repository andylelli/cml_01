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

  it("review fix — does NOT pin a culprit-implicating clue to the discovery scene (early-reveal guard)", () => {
    process.env.AGENT7_DISCOVERY_TELL = "1";
    // a culprit-direct clue whose description happens to contain a death-method token ("blood")
    const clues = [{ id: "clue_culprit_direct_1", description: "blood on Hugo's sleeve proves the killer", pointsTo: "the culprit" }];
    const ctx = makeCtx({ deathMethod: "stabbing", clues }) as any;
    const narrative = makeNarrative("crime", []) as any;
    ensureDiscoverySceneMethodTellPresent(ctx, narrative);
    expect(narrative.acts[0].scenes[0].cluesRevealed).toEqual([]); // not pinned — would reveal the culprit early
  });

  it("is a no-op when no recognisable tell clue exists", () => {
    process.env.AGENT7_DISCOVERY_TELL = "1";
    const clues = [{ id: "clue_other", description: "a muddy footprint" }];
    const ctx = makeCtx({ deathMethod: "poisoning", clues }) as any;
    const narrative = makeNarrative("crime", []) as any;
    ensureDiscoverySceneMethodTellPresent(ctx, narrative);
    expect(narrative.acts[0].scenes[0].cluesRevealed).toEqual([]);
  });

  /**
   * X48 (REVIEW_11 §5) — the regression this function actually shipped.
   *
   * GOLDEN_AGE_BEATS is ["gathering", "crime", ...], so on every 10-chapter run the `"crime"` beat is
   * SCENE 2 and the tell was stamped there — while `obligation-block.ts` hardcodes the body-discovery
   * and weapon-observation obligations to `chapterNumber === 1`. Measured on run
   * `mystery-1786999938275`: the clue reached the prose prompt for ch2–ch10 and 0 times in ch1, and
   * Agent 9 invented "a heavy brass candlestick" for the chapter it was told to describe the weapon in.
   */
  it("X48 — targets scene 1 on a Golden Age arc, where the 'crime' beat is scene 2", () => {
    process.env.AGENT7_DISCOVERY_TELL = "1";
    const clues = [{ id: "clue_tell", description: "a blunt wound consistent with a heavy bronze statuette", isDeathMethodTell: true }];
    const ctx = makeCtx({ deathMethod: "struck with a heavy bronze statuette", clues }) as any;
    const narrative = {
      acts: [
        { actNumber: 1, scenes: [
          { sceneNumber: 1, beat: "gathering", cluesRevealed: [] },
          { sceneNumber: 2, beat: "crime", cluesRevealed: [] },
        ] },
      ],
    } as any;
    ensureDiscoverySceneMethodTellPresent(ctx, narrative);
    expect(narrative.acts[0].scenes[0].cluesRevealed).toContain("clue_tell"); // chapter 1 — the contract's chapter
    expect(narrative.acts[0].scenes[1].cluesRevealed).toEqual([]);            // chapter 2 — untouched
    // The warning must name the scene it wrote to; the old message said only "the discovery scene",
    // which was true of a scene two chapters from the one the prose contract addresses.
    expect(ctx.warnings.some((w: string) => w.includes("act 1, scene 1"))).toBe(true);
  });

  it("X48 — still finds the 'crime' beat when there is no act-1 scene 1", () => {
    process.env.AGENT7_DISCOVERY_TELL = "1";
    const clues = [{ id: "clue_tell", description: "bitter residue", isDeathMethodTell: true }];
    const ctx = makeCtx({ clues }) as any;
    const narrative = {
      acts: [
        { actNumber: 2, scenes: [
          { sceneNumber: 1, beat: "gathering", cluesRevealed: [] },
          { sceneNumber: 2, beat: "crime", cluesRevealed: [] },
        ] },
      ],
    } as any;
    ensureDiscoverySceneMethodTellPresent(ctx, narrative);
    expect(narrative.acts[0].scenes[1].cluesRevealed).toContain("clue_tell");
  });
});
