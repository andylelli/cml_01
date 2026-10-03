import { describe, expect, it } from "vitest";
import { checkLocationDistinctness } from "@cml/prompts-llm";
import { enforceLocationSensoryFallbacks } from "../jobs/agents/agent2c-run.js";

// A1X-07 (R1) — `buildLocationFallback` was deleted as unreachable. These pins were written against the
// code BEFORE the deletion and must pass unchanged after it: every padding path (0, 1, 2+ entries; empty,
// blank, punctuation and missing names; sensoryVariants with and without entries) produces the same text.

const run = (profiles: unknown) => {
  const warnings: string[] = [];
  const out = enforceLocationSensoryFallbacks(structuredClone(profiles), warnings);
  return { out, warnings };
};

describe("enforceLocationSensoryFallbacks (A1X-07 R1 pins)", () => {
  it("pads an empty room with both variants, named by the lower-cased location", () => {
    const { out, warnings } = run({ keyLocations: [{ name: "  The Study " }] });
    expect(out.keyLocations[0].sensoryDetails).toEqual({
      sights: ["shadowed corners in the study", "uneven light across the study"],
      sounds: ["subdued noise carrying through the study", "a faint sound somewhere beyond the study"],
      smells: ["stale air lingering in the study", "a dry trace of dust in the study"],
      tactile: ["cold surfaces at the study", "a draught moving through the study"],
    });
    expect(warnings).toEqual([
      "Agent 2c: inserted 8 deterministic sensory fallback phrase(s) for location profile grounding.",
    ]);
  });

  it("pads a one-entry field with the SECOND variant only", () => {
    const { out } = run({
      keyLocations: [{ id: "hall", sensoryDetails: { sights: ["a brass lamp"], sounds: ["x", "y"], smells: ["a", "b"], tactile: ["c", "d"] } }],
    });
    expect(out.keyLocations[0].sensoryDetails.sights).toEqual(["a brass lamp", "uneven light across hall"]);
    expect(out.keyLocations[0].sensoryDetails.sounds).toEqual(["x", "y"]);
  });

  it("uses 'the room' for a blank or missing name", () => {
    const blank = run({ keyLocations: [{ name: "   " }] }).out.keyLocations[0];
    expect(blank.sensoryDetails.sights[0]).toBe("shadowed corners in the room");
    const missing = run({ keyLocations: [{}] }).out.keyLocations[0];
    expect(missing.sensoryDetails.tactile).toEqual(["cold surfaces at the room", "a draught moving through the room"]);
  });

  it("fills an empty sensoryVariant field from the padded sensoryDetails[0]", () => {
    const { out, warnings } = run({
      keyLocations: [{
        name: "Library",
        sensoryDetails: { sights: ["dusty spines"], sounds: [], smells: ["old paper", "ink"], tactile: ["cold", "smooth"] },
        sensoryVariants: [{ sights: [], sounds: ["rain on glass"], smells: ["   "] }, null, { mood: "x" }],
      }],
    });
    const loc = out.keyLocations[0];
    expect(loc.sensoryVariants[0]).toEqual({ sights: ["dusty spines"], sounds: ["rain on glass"], smells: ["old paper"] });
    expect(loc.sensoryVariants[2]).toEqual({
      mood: "x",
      sights: ["dusty spines"],
      sounds: ["subdued noise carrying through library"],
      smells: ["old paper"],
    });
    // 1 (sights) + 2 (sounds) padding + 2 (variant 0) + 3 (variant 2)
    expect(warnings[0]).toContain("inserted 8 deterministic");
  });

  it("drops full-sentence bleed before padding, and passes non-objects through", () => {
    const { out } = run({
      keyLocations: [{ name: "Terrace", sensoryDetails: { sights: ["rain drifted slowly across the empty terrace at dusk", "wet flagstones"] } }],
    });
    expect(out.keyLocations[0].sensoryDetails.sights).toEqual(["wet flagstones", "uneven light across terrace"]);
    expect(run(null).out).toBeNull();
    expect(run("x").out).toBe("x");
  });
});

// A1X-07 — `ignoreAtoms` was proposed for deletion as a no-op. It is NOT a strict no-op, so it was kept:
// a room whose name normalises to nothing (normAtom keeps only [a-z0-9]) receives fallbacks that reduce
// to exactly the ignored stems.
describe("ignoreAtoms is not a strict no-op (A1X-07, kept)", () => {
  it("changes the verdict for two sparse rooms with non-Latin names", () => {
    const profiles = enforceLocationSensoryFallbacks(
      { keyLocations: [{ name: "書斎" }, { name: "居間" }] },
      [],
    );
    const stems = [
      "shadowed corners in", "uneven light across", "subdued noise carrying through", "a faint sound somewhere beyond",
      "stale air lingering in", "a dry trace of dust in", "cold surfaces at", "a draught moving through",
    ];
    expect(checkLocationDistinctness(profiles).issues.length).toBe(1);
    expect(checkLocationDistinctness(profiles, { ignoreAtoms: stems }).issues.length).toBe(0);
  });
});
