/**
 * P2.3 (ANALYSIS_50) unit tests for the Agent 2c scene gates:
 *  - T2.8 cross-location distinctness (Jaccard atom overlap > 0.5, shared primary mood)
 *  - T2.7 crime-scene profiling (a keyLocation must be the crime scene)
 *  - flag-mode parsing (off/shadow/enforce), default OFF
 */
import { describe, expect, it } from "vitest";
import {
  parseSceneGateMode,
  locationAtomSet,
  checkLocationDistinctness,
  checkCrimeSceneProfiled,
  buildSceneGateFeedback,
} from "../agent2c-location-distinctness.js";
import type { KeyLocation, LocationProfilesResult } from "../agent2c-location-profiles.js";

const loc = (over: Partial<KeyLocation>): KeyLocation =>
  ({
    id: over.id ?? "l1",
    name: over.name ?? "A Room",
    type: "interior",
    purpose: over.purpose ?? "Gathering space",
    visualDetails: "",
    sensoryDetails: over.sensoryDetails ?? { sights: [], sounds: [], smells: [], tactile: [] },
    accessControl: "",
    sensoryVariants: over.sensoryVariants ?? [],
    paragraphs: [],
  }) as KeyLocation;

const profiles = (keyLocations: KeyLocation[]): LocationProfilesResult =>
  ({ status: "final", primary: {}, keyLocations, atmosphere: {}, cost: 0, durationMs: 0 }) as any;

describe("parseSceneGateMode", () => {
  it("defaults to off; maps enforce and other truthy → shadow", () => {
    expect(parseSceneGateMode(undefined)).toBe("off");
    expect(parseSceneGateMode("off")).toBe("off");
    expect(parseSceneGateMode("0")).toBe("off");
    expect(parseSceneGateMode("enforce")).toBe("enforce");
    expect(parseSceneGateMode("shadow")).toBe("shadow");
    expect(parseSceneGateMode("on")).toBe("shadow");
  });
});

describe("locationAtomSet", () => {
  it("normalizes and unions all four sense fields", () => {
    const set = locationAtomSet(
      loc({ sensoryDetails: { sights: ["Candlelight on oak."], sounds: ["crackling fire"], smells: ["beeswax"], tactile: ["cold brass"] } }),
    );
    expect(set.has("candlelight on oak")).toBe(true);
    expect(set.size).toBe(4);
  });
});

describe("checkLocationDistinctness (T2.8)", () => {
  it("flags a pair with >50% sensory-atom overlap", () => {
    const shared = { sights: ["a", "b"], sounds: ["c", "d"], smells: ["e"], tactile: ["f"] };
    const res = checkLocationDistinctness(profiles([loc({ id: "x", sensoryDetails: shared }), loc({ id: "y", sensoryDetails: shared })]));
    expect(res.ok).toBe(false);
    expect(res.issues.some((i) => i.kind === "atom_overlap")).toBe(true);
  });
  it("passes when rooms have distinct palettes", () => {
    const a = { sights: ["gaslight on oak"], sounds: ["ticking clock"], smells: ["beeswax"], tactile: ["cold brass"] };
    const b = { sights: ["sun on chalk cliffs"], sounds: ["gull cries"], smells: ["brine and tar"], tactile: ["sea wind"] };
    const res = checkLocationDistinctness(profiles([loc({ id: "x", sensoryDetails: a }), loc({ id: "y", sensoryDetails: b })]));
    expect(res.ok).toBe(true);
  });
  it("does NOT flag rooms that only collide on ignored fallback atoms", () => {
    const fallback = { sights: ["dim gaslight"], sounds: ["faint tick"], smells: ["coal smoke"], tactile: ["cold brass"] };
    const a = { ...fallback, sights: ["gaslight on oak", "dim gaslight"] };
    const b = { ...fallback, sights: ["sun on chalk cliffs", "dim gaslight"] };
    const p = profiles([loc({ id: "x", sensoryDetails: a }), loc({ id: "y", sensoryDetails: b })]);
    // Without ignoring fallbacks, the shared default atoms trip the gate...
    expect(checkLocationDistinctness(p).ok).toBe(false);
    // ...but once the injected fallback atoms are ignored, the rooms read as distinct.
    const ignore = ["dim gaslight", "faint tick", "coal smoke", "cold brass"];
    expect(checkLocationDistinctness(p, { ignoreAtoms: ignore }).ok).toBe(true);
  });

  it("flags two locations that share a primary mood", () => {
    const res = checkLocationDistinctness(
      profiles([
        loc({ id: "x", sensoryDetails: { sights: ["gaslight"], sounds: [], smells: [], tactile: [] }, sensoryVariants: [{ id: "v", timeOfDay: "night", weather: "rain", sights: [], sounds: [], smells: [], mood: "Oppressive dread" } as any] }),
        loc({ id: "y", sensoryDetails: { sights: ["sunlight"], sounds: [], smells: [], tactile: [] }, sensoryVariants: [{ id: "v", timeOfDay: "morning", weather: "clear", sights: [], sounds: [], smells: [], mood: "oppressive DREAD" } as any] }),
      ]),
    );
    expect(res.issues.some((i) => i.kind === "shared_mood")).toBe(true);
  });
});

describe("checkCrimeSceneProfiled (T2.7)", () => {
  it("passes when a keyLocation is the crime scene", () => {
    expect(checkCrimeSceneProfiled(profiles([loc({ id: "crime_scene", purpose: "Crime scene" }), loc({ id: "hall" })])).ok).toBe(true);
    expect(checkCrimeSceneProfiled(profiles([loc({ id: "study", purpose: "Where the body was found" })])).ok).toBe(true);
  });
  it("fails when no location is the crime scene", () => {
    const res = checkCrimeSceneProfiled(profiles([loc({ id: "library", purpose: "Reading room" }), loc({ id: "hall", purpose: "Gathering space" })]));
    expect(res.ok).toBe(false);
    expect(res.issue).toMatch(/crime scene/i);
  });
  it("fails when the crime-scene hint matches no profiled room", () => {
    const res = checkCrimeSceneProfiled(profiles([loc({ id: "crime_scene", name: "The Library", purpose: "Crime scene" })]), "the conservatory");
    expect(res.ok).toBe(false);
    expect(res.issue).toMatch(/conservatory/);
  });
  it("fails when there are no locations at all", () => {
    expect(checkCrimeSceneProfiled(profiles([])).ok).toBe(false);
  });
});

describe("buildSceneGateFeedback", () => {
  it("composes crime-scene + distinctness guidance", () => {
    const fb = buildSceneGateFeedback(
      { ok: false, issues: [{ a: "Library", b: "Study", kind: "atom_overlap", detail: "67% sensory-atom overlap (threshold 50%)" }] },
      { ok: false, issue: "no keyLocation is profiled as the crime scene" },
    );
    expect(fb).toMatch(/Crime scene:/);
    expect(fb).toMatch(/Distinctness:.*Library.*Study/);
  });
});
