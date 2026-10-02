import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGenerationParams } from "@cml/story-validation";
import { normalizeCmlForGeneration } from "../cml/normalize.js";

/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — A34-D03 (gender looked up by the INPUT name at the member's index)
 * and A34-D04 (cast mapped positionally over castNames: extras dropped, reordered members mis-paired).
 */
const FLAG = "CML_VERIFIED_FIXES";
let saved: string | undefined;
beforeEach(() => {
  saved = process.env[FLAG];
  delete process.env[FLAG];
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved;
  vi.restoreAllMocks();
});

const inputs = {
  decade: "1930s", location: "A country house", institution: "Manor", primaryAxis: "temporal",
  castNames: ["Eleanor Voss", "Captain Ivor Hale", "Beatrice Quill"],
  castGenders: { "Eleanor Voss": "female", "Captain Ivor Hale": "male", "Beatrice Quill": "female" },
} as any;

const member = (name: string, extra: Record<string, unknown> = {}) => ({ name, role_archetype: `${name} archetype`, ...extra });

const normalize = (cast: unknown[]) => {
  const notes: string[] = [];
  const out = normalizeCmlForGeneration(
    { CASE: { cast, culpability: { culprit_count: 1, culprits: ["Beatrice Quill"] } } },
    inputs,
    notes,
    getGenerationParams().agent3_cml.params,
  ) as any;
  return { cast: out.CASE.cast as Array<Record<string, any>>, notes };
};

// The model reordered the cast and added a character nobody asked for.
const reordered = () => [member("Captain Ivor Hale"), member("Eleanor Voss"), member("Beatrice Quill"), member("Mr. Ozias Penn")];

describe("A34-D03 — gender belongs to the member's own name", () => {
  it("flag OFF: gender comes from the requested name at the same index (swaps on reorder)", () => {
    const { cast } = normalize(reordered());
    expect(cast[0].name).toBe("Captain Ivor Hale");
    expect(cast[0].gender).toBe("female");
    expect(cast[1].name).toBe("Eleanor Voss");
    expect(cast[1].gender).toBe("male");
  });

  it("flag ON: gender is looked up by the member's name, case-insensitively", () => {
    process.env[FLAG] = "1";
    const { cast } = normalize([member("captain ivor hale "), member("Eleanor Voss"), member("Beatrice Quill")]);
    const byName = Object.fromEntries(cast.map((m) => [m.name.trim().toLowerCase(), m.gender]));
    expect(byName["captain ivor hale"]).toBe("male");
    expect(byName["eleanor voss"]).toBe("female");
  });
});

describe("A34-D04 — the cast is matched by name, extras kept, only missing names padded", () => {
  it("flag OFF: positional — the extra model character is dropped", () => {
    const { cast, notes } = normalize(reordered());
    expect(cast.map((m) => m.name)).toEqual(["Captain Ivor Hale", "Eleanor Voss", "Beatrice Quill"]);
    expect(notes.some((n) => n.includes("A34-D04"))).toBe(false);
  });

  it("flag ON: requested order, extra appended with a note", () => {
    process.env[FLAG] = "1";
    const { cast, notes } = normalize(reordered());
    expect(cast.map((m) => m.name)).toEqual(["Eleanor Voss", "Captain Ivor Hale", "Beatrice Quill", "Mr. Ozias Penn"]);
    expect(cast[0].role_archetype).toBe("Eleanor Voss archetype");
    expect(cast[1].role_archetype).toBe("Captain Ivor Hale archetype");
    expect(notes.some((n) => n.includes("A34-D04") && n.includes("Mr. Ozias Penn"))).toBe(true);
  });

  it("flag ON: a name the model lacks is padded; a titled variant still matches", () => {
    process.env[FLAG] = "1";
    const { cast } = normalize([member("Beatrice Quill"), member("Lady Eleanor Voss")]);
    expect(cast.map((m) => m.name)).toEqual(["Lady Eleanor Voss", "Captain Ivor Hale", "Beatrice Quill"]);
    expect(cast[0].role_archetype).toBe("Lady Eleanor Voss archetype");
    expect(cast[1].role_archetype).toBe("suspect"); // padded default
    expect(cast[0].gender).toBe("female");
    expect(cast[1].gender).toBe("male");
  });
});
