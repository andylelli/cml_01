/**
 * `precompileStoryContract` was fed `cml.CAST` — a field a CML artifact does not have.
 *
 * A CML artifact is `{ CML_VERSION, CASE }`. `resolveVictimContract` reads `castData.characters`, so
 * it got `undefined`, fell through all three passes, and returned an empty name. MEASURED across
 * every post-X70 report: 52 of 52 records `victim.name=""` with `roleConfirmedFrom="fallback_unknown"`
 * — the resolver had never once succeeded.
 *
 * These tests pin the two shapes the fixed call site can pass: `castDesign` (the normal path) and the
 * `CASE.cast` fallback (a hydrated replay with no castDesign).
 */
import { describe, expect, it } from "vitest";

import { resolveVictimContract } from "@cml/prompts-llm";

const castDesign = {
  characters: [
    { name: "Marguerite Selwyn", role: "victim", roleArchetype: "Victim", gender: "female" },
    { name: "Percival Orme", role: "suspect", roleArchetype: "Suspect", gender: "male" },
    { name: "Edmund Whitlock", role: "detective", roleArchetype: "Detective", gender: "male" },
  ],
};
const caseCast = [
  { name: "Marguerite Selwyn", role_archetype: "Victim" },
  { name: "Percival Orme", role_archetype: "Suspect" },
];

describe("the victim resolves from the sources the call site can actually supply", () => {
  it("castDesign — the normal path", () => {
    const v = resolveVictimContract(castDesign, undefined);
    expect(v.name).toBe("Marguerite Selwyn");
    expect(v.roleConfirmedFrom).toBe("cast.role=victim");
  });

  it("{ characters: CASE.cast } — the hydrated-replay fallback, via role_archetype", () => {
    const v = resolveVictimContract({ characters: caseCast }, undefined);
    expect(v.name).toBe("Marguerite Selwyn");
    expect(v.roleConfirmedFrom).toBe("cast.role_archetype");
  });

  it("REGRESSION: the shape that was passed for the life of the project resolves nothing", () => {
    // `cml.CAST` is undefined on every CML artifact — this is what 52 of 52 runs recorded.
    const v = resolveVictimContract(undefined, undefined);
    expect(v.name).toBe("");
    expect(v.roleConfirmedFrom).toBe("fallback_unknown");
  });

  it("a CML case block is also the wrong shape — it has .cast, not .characters", () => {
    const v = resolveVictimContract({ cast: caseCast } as never, undefined);
    expect(v.roleConfirmedFrom).toBe("fallback_unknown");
  });

  it("falls back to the culpability victim name when no role marks one", () => {
    const unmarked = { characters: [{ name: "Marguerite Selwyn" }, { name: "Percival Orme" }] };
    const v = resolveVictimContract(unmarked, "Marguerite Selwyn");
    expect(v.name).toBe("Marguerite Selwyn");
    expect(v.roleConfirmedFrom).toBe("cml.culpability.victim");
  });
});
