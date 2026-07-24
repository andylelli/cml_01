import { describe, expect, it } from "vitest";
import { computeDeterministicGapFillCap, coerceNarrativeSceneBeats, hoistMisplacedSceneFields } from "../jobs/agents/agent7-run.js";

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

describe("hoistMisplacedSceneFields — recover scene fields the model nested under 'setting' (run a9c1e346)", () => {
  it("hoists purpose/characters/cluesRevealed/dramaticElements out of setting and synthesises the summary, clearing the completeness gate", () => {
    // The exact shape that hard-aborted run a9c1e346 (scene 7 "Secrets Beneath Secrets"): a title at the
    // top level, everything else buried inside `setting`.
    const narrative: any = {
      acts: [
        {
          act_number: 2,
          scenes: [
            {
              sceneNumber: 7,
              title: "Secrets Beneath Secrets",
              purpose: null,
              summary: null,
              characters: null,
              setting: {
                location: "Backstage corridors",
                timeOfDay: "Next morning",
                atmosphere: "Revelatory and tense",
                characters: ["Inspector Harold Bramwell", "Philip Turner"],
                purpose: "Uncover unrelated lies and sabotage; reveal premeditation by Philip Turner",
                cluesRevealed: ["clue_14", "clue_15"],
                dramaticElements: { conflict: "Sabotage aimed to damage Fenwick", tension: "Suspicion shifts to Turner" },
              },
            },
          ],
        },
      ],
    };

    const res = hoistMisplacedSceneFields(narrative);
    expect(res.hoisted).toBeGreaterThan(0);

    const scene = narrative.acts[0].scenes[0];
    expect(scene.purpose).toContain("Uncover unrelated lies");
    expect(scene.characters).toEqual(["Inspector Harold Bramwell", "Philip Turner"]);
    expect(scene.cluesRevealed).toEqual(["clue_14", "clue_15"]);
    // No top-level summary anywhere → synthesised from the model's own purpose + dramatic beats.
    expect(String(scene.summary).trim().length).toBeGreaterThan(0);
    expect(scene.summary).toContain("Suspicion shifts to Turner");
  });

  it("never overwrites an existing top-level value and is null-safe", () => {
    expect(hoistMisplacedSceneFields(undefined)).toEqual({ hoisted: 0 });
    expect(hoistMisplacedSceneFields({})).toEqual({ hoisted: 0 });
    const narrative: any = {
      acts: [{ scenes: [{ title: "Whole", purpose: "keep me", summary: "mine", characters: ["A"], setting: { purpose: "IGNORE", characters: ["B"] } }] }],
    };
    const res = hoistMisplacedSceneFields(narrative);
    expect(res.hoisted).toBe(0);
    const scene = narrative.acts[0].scenes[0];
    expect(scene.purpose).toBe("keep me");
    expect(scene.characters).toEqual(["A"]);
  });
});
