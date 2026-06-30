import { describe, expect, it } from "vitest";
import { buildStoryWorldState, runContradictionGate } from "../world-state.js";

// A_57 §9.1 — the Story World-State ledger unifies D1 (typed facts), D2 (staged/true contradiction),
// D3 (mechanism vs environment), and identity (gender). The contradiction gate surfaces repair-at-source
// conflicts. Validated against run-09168377 (sundial vs overcast; culprit Edward vs victim Edith Marwood).

const sundialDevice = {
  title: "The Garden Sundial Alibi",
  corePrinciple:
    "The sundial's shadow length and direction, combined with solar azimuth and elevation angles, contradict the supposed murder time.",
  mechanismFamilyHints: ["timing window trap"],
  fairPlayClues: ["Weather logs confirm clear skies that day"],
};

const overcast = {
  weather: "Overcast skies with intermittent light rain, typical of English countryside",
  timeOfDay: "Early evening",
  season: "winter",
};

const lockedFacts = [
  { id: "lf_true", description: "the actual murder time the shadow indicates", value: "twenty minutes past four in the afternoon" },
  { id: "lf_staged", description: "time the watch was staged to show", value: "half past three in the afternoon" },
  { id: "lf_weather", description: "the estate weather log", value: "Weather logs confirming clear skies during the afternoon" },
];

const cast = [
  { name: "Edith Marwood", gender: "female", role_archetype: "victim" },
  { name: "Edward Marwood", gender: "male", role_archetype: "suspect" },
  { name: "Daphne Sinclair", gender: "female", role_archetype: "suspect" },
  { name: "Arthur Hale", gender: "male", role_archetype: "detective" },
];

describe("buildStoryWorldState (A_57 §9.1)", () => {
  const ws = buildStoryWorldState({
    lockedFacts,
    device: sundialDevice,
    atmosphere: overcast,
    cast,
    victim: "Edith Marwood",
    culprits: ["Edward Marwood"],
  });

  it("types locked facts (D1): atomic times vs descriptive weather log", () => {
    const trueTime = ws.facts.find((f) => f.id === "lf_true");
    const weather = ws.facts.find((f) => f.id === "lf_weather");
    expect(trueTime?.type).toBe("atomic");
    expect(weather?.type).toBe("descriptive");
  });

  it("co-locates the single staged/true contradiction (D2)", () => {
    expect(ws.contradiction).not.toBeNull();
    expect(ws.contradiction!.values).toContain("twenty minutes past four in the afternoon");
    expect(ws.contradiction!.values).toContain("half past three in the afternoon");
  });

  it("captures the mechanism-environment conflict (D3)", () => {
    expect(ws.environment.precondition?.factor).toBe("sunlight");
    expect(ws.environment.conflict).toBe(true);
  });

  it("records identity (name, gender, role) for every cast member", () => {
    expect(ws.characters).toHaveLength(4);
    expect(ws.characters.find((c) => c.name === "Daphne Sinclair")?.gender).toBe("female");
    expect(ws.characters.find((c) => c.name === "Arthur Hale")?.gender).toBe("male");
  });
});

describe("runContradictionGate (A_57 §9.1)", () => {
  it("flags the D3 mechanism-environment conflict on the real run", () => {
    const ws = buildStoryWorldState({ lockedFacts, device: sundialDevice, atmosphere: overcast, cast, victim: "Edith Marwood", culprits: ["Edward Marwood"] });
    const gate = runContradictionGate(ws);
    expect(gate.ok).toBe(false);
    expect(gate.conflicts.some((c) => c.kind === "mechanism_environment")).toBe(true);
    // Edward Marwood ≠ Edith Marwood — a shared surname must NOT trip the culprit-is-victim check.
    expect(gate.conflicts.some((c) => c.kind === "culprit_is_victim")).toBe(false);
  });

  it("passes cleanly when the world is coherent (clear weather, full genders, distinct culprit)", () => {
    const ws = buildStoryWorldState({
      lockedFacts,
      device: sundialDevice,
      atmosphere: { weather: "Bright clear winter afternoon, sharp shadows", season: "winter" },
      cast,
      victim: "Edith Marwood",
      culprits: ["Edward Marwood"],
    });
    expect(runContradictionGate(ws)).toEqual({ ok: true, conflicts: [] });
  });

  it("flags culprit_is_victim when the culprit IS the named victim", () => {
    const ws = buildStoryWorldState({ cast, victim: "Edith Marwood", culprits: ["edith marwood"] });
    const gate = runContradictionGate(ws);
    expect(gate.conflicts.some((c) => c.kind === "culprit_is_victim")).toBe(true);
  });

  it("flags a character with no resolvable gender (D5 substrate)", () => {
    const ws = buildStoryWorldState({ cast: [{ name: "Pat Gray", role_archetype: "suspect" }] });
    const gate = runContradictionGate(ws);
    expect(gate.conflicts.some((c) => c.kind === "character_missing_gender")).toBe(true);
  });

  it("flags duplicate canonical character names", () => {
    const ws = buildStoryWorldState({
      cast: [
        { name: "John Vane", gender: "male" },
        { name: "John Vane", gender: "male" },
      ],
    });
    const gate = runContradictionGate(ws);
    expect(gate.conflicts.some((c) => c.kind === "duplicate_character")).toBe(true);
  });
});
