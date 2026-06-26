import { describe, it, expect } from "vitest";
import {
  resolveDiscriminatingSceneIndex,
  stampMechanismRevealGate,
} from "../mechanism-reveal-gate.js";

// A_50 §9.3 fix #3 — the full mechanism explanation must land AT the discriminating-test scene,
// not be telegraphed in Act 1 (judge: "the clock mechanism is explained too early").

const scenes = [
  { act: 1, actSceneNumber: 1 },
  { act: 1, actSceneNumber: 2 },
  { act: 2, actSceneNumber: 1 },
  { act: 2, actSceneNumber: 2 },
  { act: 3, actSceneNumber: 1 }, // index 4
  { act: 3, actSceneNumber: 2 }, // index 5
];

describe("resolveDiscriminatingSceneIndex", () => {
  it("finds the exact act+scene match", () => {
    expect(resolveDiscriminatingSceneIndex(scenes, { act_number: 3, scene_number: 2 })).toBe(5);
    expect(resolveDiscriminatingSceneIndex(scenes, { act_number: 2, scene_number: 1 })).toBe(2);
  });

  it("falls back to the first scene of the act when the scene number is missing/out of range", () => {
    expect(resolveDiscriminatingSceneIndex(scenes, { act_number: 3 })).toBe(4);
    expect(resolveDiscriminatingSceneIndex(scenes, { act_number: 3, scene_number: 9 })).toBe(4);
  });

  it("returns -1 when the test scene is absent or the act is unknown", () => {
    expect(resolveDiscriminatingSceneIndex(scenes, null)).toBe(-1);
    expect(resolveDiscriminatingSceneIndex(scenes, undefined)).toBe(-1);
    expect(resolveDiscriminatingSceneIndex(scenes, { act_number: 4 })).toBe(-1);
    expect(resolveDiscriminatingSceneIndex(scenes, { act_number: "x" })).toBe(-1);
  });
});

describe("stampMechanismRevealGate", () => {
  it("withholds the mechanism before the threshold and allows it at/after", () => {
    const cells = scenes.map(() => ({}) as { mechanismRevealAllowed?: boolean });
    const res = stampMechanismRevealGate(cells, 4); // reveal at act 3 scene 1
    expect(res).toEqual({ withheld: 4, thresholdIndex: 4 });
    expect(cells.map((c) => c.mechanismRevealAllowed)).toEqual([false, false, false, false, true, true]);
  });

  it("is a no-op when the threshold is negative (ungated)", () => {
    const cells = scenes.map(() => ({}) as { mechanismRevealAllowed?: boolean });
    const res = stampMechanismRevealGate(cells, -1);
    expect(res).toEqual({ withheld: 0, thresholdIndex: -1 });
    expect(cells.every((c) => c.mechanismRevealAllowed === undefined)).toBe(true);
  });

  it("end-to-end: resolve then stamp from a CML discriminating_test_scene", () => {
    const cells = scenes.map((s) => ({ ...s }) as { act: number; actSceneNumber: number; mechanismRevealAllowed?: boolean });
    const idx = resolveDiscriminatingSceneIndex(cells, { act_number: 3, scene_number: 1 });
    stampMechanismRevealGate(cells, idx);
    // pre-test scenes withhold; the test scene (index 4) and later reveal
    expect(cells[3].mechanismRevealAllowed).toBe(false);
    expect(cells[4].mechanismRevealAllowed).toBe(true);
    expect(cells[5].mechanismRevealAllowed).toBe(true);
  });
});
