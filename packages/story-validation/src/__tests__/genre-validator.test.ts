import { describe, expect, it } from "vitest";
import { validateGenreStructure } from "../genre-validator.js";

const goodCase = () => ({
  CASE: {
    culpability: { culprits: ["Edward Kingsley"] },
    false_solution: {
      accused_suspect: "Vivienne Hart",
      supporting_points: ["Strongest motive", "No alibi"],
      the_one_flaw: "Could not have reached the study in the time available.",
    },
    red_herrings: [
      { id: "rh1", description: "A torn letter", innocent_explanation: "An old, unrelated quarrel." },
      { id: "rh2", description: "Muddy boots", innocent_explanation: "A walk in the garden before dinner." },
    ],
    closed_circle: { suspects: ["Vivienne Hart", "Thomas Braddock", "Edward Kingsley"] },
  },
});

describe("validateGenreStructure", () => {
  it("passes a well-formed Golden Age case", () => {
    const r = validateGenreStructure(goodCase());
    expect(r.valid).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it("rejects a false solution that accuses the real culprit", () => {
    const c = goodCase();
    c.CASE.false_solution.accused_suspect = "Edward Kingsley";
    const r = validateGenreStructure(c);
    expect(r.valid).toBe(false);
    expect(r.errors.join(" ")).toMatch(/real culprit/i);
  });

  it("requires at least two red herrings with innocent explanations", () => {
    const c = goodCase();
    c.CASE.red_herrings = [{ id: "rh1", description: "A torn letter", innocent_explanation: "" } as any];
    const r = validateGenreStructure(c);
    expect(r.valid).toBe(false);
    expect(r.errors.join(" ")).toMatch(/red herring/i);
  });

  it("requires the culprit to be inside the closed circle", () => {
    const c = goodCase();
    c.CASE.closed_circle.suspects = ["Vivienne Hart", "Thomas Braddock"];
    const r = validateGenreStructure(c);
    expect(r.valid).toBe(false);
    expect(r.errors.join(" ")).toMatch(/closed_circle/i);
  });

  it("matches culprit by surname when the circle lists a full name", () => {
    const c = goodCase();
    c.CASE.culpability.culprits = ["Kingsley"];
    const r = validateGenreStructure(c);
    expect(r.valid).toBe(true);
  });
});
