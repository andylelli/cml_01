import { describe, it, expect } from "vitest";
import { buildLocationRegistry, validateLocationConsistency } from "../location-normalizer.js";
import type { CMLData, Story } from "../types.js";

const makeCml = (locations: Array<{ name: string }>, primaryName?: string): CMLData => ({
  CASE: {
    meta: {},
    cast: [],
  },
  locationProfiles: {
    primary: primaryName ? { name: primaryName } : undefined,
    keyLocations: locations,
  },
});

const makeStory = (chapters: Array<{ number: number; text: string }>): Story => ({
  id: "test",
  projectId: "p1",
  scenes: chapters.map(ch => ({
    number: ch.number,
    title: `Chapter ${ch.number}`,
    text: ch.text,
  })),
});

describe("buildLocationRegistry", () => {
  it("registers canonical names, no-article variants, and hyphenated variants", () => {
    const cml = makeCml([{ name: "Drawing Room" }, { name: "The Library" }]);
    const registry = buildLocationRegistry(cml);

    expect(registry.get("drawing room")).toBe("Drawing Room");
    expect(registry.get("drawing-room")).toBe("Drawing Room");
    expect(registry.get("the library")).toBe("The Library");
    expect(registry.get("library")).toBe("The Library");
  });

  it("registers primary location", () => {
    const cml = makeCml([], "Harrowfield Hall");
    const registry = buildLocationRegistry(cml);

    expect(registry.get("harrowfield hall")).toBe("Harrowfield Hall");
    expect(registry.get("harrowfield-hall")).toBe("Harrowfield Hall");
  });

  it("returns empty registry when no locationProfiles", () => {
    const cml: CMLData = { CASE: { meta: {}, cast: [] } };
    const registry = buildLocationRegistry(cml);
    expect(registry.size).toBe(0);
  });
});

describe("validateLocationConsistency", () => {
  it("flags non-canonical casing of a location name", () => {
    const cml = makeCml([{ name: "Drawing Room" }]);
    const story = makeStory([
      { number: 1, text: "She entered the drawing room and sat down." },
    ]);

    const errors = validateLocationConsistency(story, cml);
    expect(errors.some(e =>
      e.type === "location_name_variant" &&
      e.message.includes("drawing room") &&
      e.message.includes("Drawing Room")
    )).toBe(true);
  });

  it("does NOT flag exact canonical usage", () => {
    const cml = makeCml([{ name: "Drawing Room" }]);
    const story = makeStory([
      { number: 1, text: "She entered the Drawing Room and sat down." },
    ]);

    const errors = validateLocationConsistency(story, cml);
    expect(errors.some(e => e.type === "location_name_variant")).toBe(false);
  });

  it("returns no errors when no locationProfiles provided", () => {
    const cml: CMLData = { CASE: { meta: {}, cast: [] } };
    const story = makeStory([{ number: 1, text: "The drawing room was empty." }]);

    const errors = validateLocationConsistency(story, cml);
    expect(errors).toHaveLength(0);
  });

  it("returns no errors when CML is undefined", () => {
    const story = makeStory([{ number: 1, text: "The drawing room was empty." }]);
    const errors = validateLocationConsistency(story, undefined);
    expect(errors).toHaveLength(0);
  });

  it("flags variant in multiple chapters independently", () => {
    const cml = makeCml([{ name: "The Library" }]);
    const story = makeStory([
      { number: 1, text: "He walked into the library." },
      { number: 2, text: "She waited in the library." },
    ]);

    const errors = validateLocationConsistency(story, cml);
    // "the library" matches "The Library" canonical but differs in case
    const ch1Errors = errors.filter(e => e.sceneNumber === 1);
    const ch2Errors = errors.filter(e => e.sceneNumber === 2);
    expect(ch1Errors.length).toBeGreaterThanOrEqual(1);
    expect(ch2Errors.length).toBeGreaterThanOrEqual(1);
  });
});
