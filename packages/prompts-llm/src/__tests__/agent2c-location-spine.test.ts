import { describe, expect, it } from "vitest";
import {
  extractLocationSpine,
  checkLocationSpine,
} from "../agent2c-location-spine.js";
import type { LocationSpine } from "../agent2c-location-spine.js";
import type {
  LocationProfilesResult,
  KeyLocation,
} from "../agent2c-location-profiles.js";

/** A KeyLocation with sensible defaults, overridable per test. */
function makeKeyLocation(
  overrides: Partial<KeyLocation> & { id: string; name: string },
): KeyLocation {
  return {
    id: overrides.id,
    name: overrides.name,
    type: overrides.type ?? "interior",
    purpose: overrides.purpose ?? "Crime scene",
    visualDetails: overrides.visualDetails ?? "Dark oak panelling and gas sconces",
    sensoryDetails: overrides.sensoryDetails ?? {
      sights: ["candlelight on dark oak", "rain-streaked window panes"],
      sounds: ["crackling fire", "pages turning in the silence"],
      smells: ["beeswax and cold ash", "damp stone and old leather"],
      tactile: ["worn leather armchair", "chill draft from the casement"],
    },
    accessControl: overrides.accessControl ?? "Locked after dinner; key held by the butler",
    sensoryVariants: overrides.sensoryVariants,
    paragraphs: overrides.paragraphs ?? ["Paragraph 1", "Paragraph 2"],
  };
}

/** A clean, fully-populated LocationProfilesResult. */
function makeProfiles(
  overrides: Partial<LocationProfilesResult> = {},
): LocationProfilesResult {
  return {
    status: "draft",
    tone: "Classic",
    primary: {
      name: "Thornfield Manor",
      type: "interior",
      place: "Little Hadleigh",
      country: "England",
      summary: "An isolated country house.",
      visualDescription: "Rambling Victorian pile.",
      atmosphere: "Brooding and remote.",
      paragraphs: ["Para 1", "Para 2"],
    },
    keyLocations: [
      makeKeyLocation({ id: "library", name: "The West Library", purpose: "Clue site" }),
      makeKeyLocation({
        id: "conservatory",
        name: "The Conservatory",
        type: "exterior",
        purpose: "Gathering space",
        accessControl: "Open to family and guests by day",
      }),
    ],
    atmosphere: {
      era: "1920s",
      weather: "Rain",
      timeFlow: "Three days of mounting tension on a snowbound estate",
      mood: "Oppressive",
      eraMarkers: ["gas lamps", "motor cars"],
      sensoryPalette: {
        dominant: "cold beeswax and old paper",
        secondary: ["hushed", "shadowed"],
      },
      paragraphs: ["Atmosphere para 1"],
    },
    cost: 0,
    durationMs: 0,
    ...overrides,
  };
}

describe("extractLocationSpine", () => {
  it("projects logic-bearing fields and a baseline palette per place", () => {
    const spine = extractLocationSpine(makeProfiles());

    expect(spine.primaryName).toBe("Thornfield Manor");
    // isolation anchor sourced from atmosphere (timeFlow preferred).
    expect(spine.isolation).toBe("Three days of mounting tension on a snowbound estate");
    expect(spine.places).toHaveLength(2);

    const library = spine.places[0];
    expect(library).toMatchObject({
      id: "library",
      name: "The West Library",
      type: "interior",
      purpose: "Clue site",
    });
    expect(library.accessControl).toContain("Locked after dinner");
    // baseline palette derived from sensoryDetails (sights first).
    expect(library.baselinePalette.dominant).toBe("candlelight on dark oak");
    expect(library.baselinePalette.secondary.length).toBeGreaterThan(0);
    expect(library.baselinePalette.secondary.length).toBeLessThanOrEqual(3);

    const conservatory = spine.places[1];
    expect(conservatory.type).toBe("exterior");
    expect(conservatory.purpose).toBe("Gathering space");
  });

  it("does NOT carry the combinatorial sensory bible (variants/paragraphs)", () => {
    const spine = extractLocationSpine(makeProfiles());
    const place = spine.places[0] as Record<string, unknown>;
    expect(place.sensoryVariants).toBeUndefined();
    expect(place.paragraphs).toBeUndefined();
    expect(place.sensoryDetails).toBeUndefined();
  });

  it("normalizes an invalid type to interior and synthesizes a missing id", () => {
    const profiles = makeProfiles({
      keyLocations: [
        // type is bogus; id missing -> falls back to name; then index.
        { name: "Cellar", type: "dungeon" as any } as unknown as KeyLocation,
      ],
    });
    const spine = extractLocationSpine(profiles);
    expect(spine.places[0].type).toBe("interior");
    expect(spine.places[0].id).toBe("Cellar");
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["empty object", {}],
    ["keyLocations not an array", { keyLocations: "nope" }],
    ["malformed places", { keyLocations: [null, 42, { id: "x" }] }],
  ])("never throws on malformed input: %s", (_label, input) => {
    expect(() => extractLocationSpine(input as any)).not.toThrow();
    const spine = extractLocationSpine(input as any);
    expect(Array.isArray(spine.places)).toBe(true);
    expect(typeof spine.primaryName).toBe("string");
    expect(typeof spine.isolation).toBe("string");
  });
});

describe("checkLocationSpine", () => {
  it("passes a clean, fully-populated spine", () => {
    const spine = extractLocationSpine(makeProfiles());
    const result = checkLocationSpine(spine);
    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("flags a place missing purpose, accessControl, and an empty palette", () => {
    const spine: LocationSpine = {
      primaryName: "Manor",
      isolation: "snowbound",
      places: [
        {
          id: "library",
          name: "Library",
          type: "interior",
          purpose: "",
          accessControl: "",
          baselinePalette: { dominant: "", secondary: [] },
        },
      ],
    };
    const result = checkLocationSpine(spine);
    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.stringContaining("missing purpose"),
        expect.stringContaining("missing accessControl"),
        expect.stringContaining("empty baseline palette"),
      ]),
    );
  });

  it("flags duplicate ids", () => {
    const place = {
      id: "library",
      name: "Library",
      type: "interior" as const,
      purpose: "Clue site",
      accessControl: "Locked",
      baselinePalette: { dominant: "beeswax", secondary: [] },
    };
    const spine: LocationSpine = {
      primaryName: "Manor",
      isolation: "snowbound",
      places: [place, { ...place }],
    };
    const result = checkLocationSpine(spine);
    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining("duplicate id: library")]),
    );
  });

  it("flags an empty spine (no places)", () => {
    const result = checkLocationSpine({
      primaryName: "Manor",
      isolation: "",
      places: [],
    });
    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([expect.stringContaining("no places")]),
    );
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["empty object", {}],
    ["places not an array", { places: "nope" }],
    ["malformed places", { places: [null, { id: "x" }] }],
  ])("never throws on malformed input: %s", (_label, input) => {
    expect(() => checkLocationSpine(input as any)).not.toThrow();
    const result = checkLocationSpine(input as any);
    expect(typeof result.ok).toBe("boolean");
    expect(Array.isArray(result.issues)).toBe(true);
  });

  it("round-trips: extract then check passes for a valid artifact", () => {
    const result = checkLocationSpine(extractLocationSpine(makeProfiles()));
    expect(result.ok).toBe(true);
  });
});
