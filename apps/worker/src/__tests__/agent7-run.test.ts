import { describe, expect, it } from "vitest";
import { computeDeterministicGapFillCap, coerceNarrativeSceneBeats } from "../jobs/agents/agent7-run.js";

const GOLDEN_AGE_BEAT_SET = new Set([
  "gathering", "crime", "first_enquiries", "motives", "alibis",
  "false_solution", "secrets", "pattern", "final_trap", "revelation",
]);

describe("agent7 deterministic pacing cap", () => {
  it("keeps a minimum cap of 3 for short outlines", () => {
    expect(computeDeterministicGapFillCap(0)).toBe(3);
    expect(computeDeterministicGapFillCap(8)).toBe(3);
  });

  it("scales cap for medium outlines", () => {
    expect(computeDeterministicGapFillCap(19)).toBe(5);
    expect(computeDeterministicGapFillCap(24)).toBe(6);
  });

  it("caps deterministic fill at 8 for large outlines", () => {
    expect(computeDeterministicGapFillCap(40)).toBe(8);
    expect(computeDeterministicGapFillCap(80)).toBe(8);
  });
});

describe("coerceNarrativeSceneBeats", () => {
  it("maps known synonyms onto the canonical Golden-Age arc", () => {
    const narrative: any = {
      acts: [
        { scenes: [{ beat: "interrogation" }, { beat: "discovery" }, { beat: "resolution" }] },
      ],
    };
    const result = coerceNarrativeSceneBeats(narrative);
    expect(narrative.acts[0].scenes.map((s: any) => s.beat)).toEqual([
      "first_enquiries", "crime", "revelation",
    ]);
    expect(result).toEqual({ coerced: 3, dropped: 0 });
  });

  it("drops unrecognised beats and preserves/normalises canonical ones", () => {
    const narrative: any = {
      acts: [
        { scenes: [{ beat: "reflection" }, { beat: "Gathering" }, { beat: " false_solution " }] },
      ],
    };
    const result = coerceNarrativeSceneBeats(narrative);
    const scenes = narrative.acts[0].scenes;
    expect("beat" in scenes[0]).toBe(false); // unrecognised → dropped
    expect(scenes[1].beat).toBe("gathering"); // case-normalised
    expect(scenes[2].beat).toBe("false_solution"); // whitespace-trimmed
    expect(result).toEqual({ coerced: 0, dropped: 1 });
  });

  it("leaves the whole run_01150a9f beat set schema-valid (no out-of-enum beats survive)", () => {
    const narrative: any = {
      acts: [
        { scenes: [{ beat: "gathering" }, { beat: "discovery" }, { beat: "discovery" }, { beat: "interrogation" }, { beat: "reflection" }, { beat: "resolution" }] },
        { scenes: [{ beat: "discovery" }, { beat: "interrogation" }, { beat: "interrogation" }] },
        { scenes: [{ beat: "resolution" }] },
      ],
    };
    coerceNarrativeSceneBeats(narrative);
    for (const act of narrative.acts) {
      for (const scene of act.scenes) {
        if (scene.beat != null) expect(GOLDEN_AGE_BEAT_SET.has(scene.beat)).toBe(true);
      }
    }
  });

  it("is null-safe and tolerates missing/empty beats", () => {
    expect(coerceNarrativeSceneBeats(undefined)).toEqual({ coerced: 0, dropped: 0 });
    expect(coerceNarrativeSceneBeats({})).toEqual({ coerced: 0, dropped: 0 });
    const narrative: any = { acts: [{ scenes: [{}, { beat: "" }, { beat: null }] }] };
    expect(coerceNarrativeSceneBeats(narrative)).toEqual({ coerced: 0, dropped: 0 });
  });
});
