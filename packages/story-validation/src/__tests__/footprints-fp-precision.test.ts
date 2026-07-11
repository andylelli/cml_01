import { describe, expect, it } from "vitest";
import { PhysicalPlausibilityValidator } from "../physical-validator.js";

// Roadmap Phase A — the implausible_footprints check was a whole-chapter substring co-occurrence
// (`text.includes('metal') && /footprint/`) that hard-failed clean clock runs. Now sentence-scoped,
// word-bounded, preposition-linked, medium-guarded. Precision only — a real footprint-on-bare-metal fires.

const v = new PhysicalPlausibilityValidator();
const run = (text: string) => v.validate({ scenes: [{ number: 1, title: "Ch1", text }] } as any);
const hasFootprintFP = (text: string) =>
  run(text).errors.some((e: any) => e.type === "implausible_footprints");

describe("implausible_footprints — must NOT fire (FP class removed)", () => {
  it("'metal' and 'footprints' in DIFFERENT sentences", () => {
    expect(hasFootprintFP("The battered metal clock stood on the mantel. Outside, footprints led through the mud by the garden gate.")).toBe(false);
  });
  it("footprints in a deposited medium ON a hard surface", () => {
    expect(hasFootprintFP("Footprints in the dust on the metal walkway pointed to the door.")).toBe(false);
    expect(hasFootprintFP("Muddy footprints on the tiled floor trailed to the study.")).toBe(false);
  });
  it("word boundary — 'metallic' is not 'metal'", () => {
    expect(hasFootprintFP("A metallic gleam caught his eye. Footprints crossed the lawn.")).toBe(false);
  });
});

describe("implausible_footprints — must STILL fire (real implausibility)", () => {
  it("footprints pressed onto a bare hard surface with no medium", () => {
    expect(hasFootprintFP("Clear footprints were stamped into the metal plate, though nothing could mark it.")).toBe(true);
  });
});
