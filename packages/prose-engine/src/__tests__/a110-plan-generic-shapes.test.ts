import { afterEach, describe, expect, it } from "vitest";
import { whereAndWhen } from "../bible.js";
import { buildBookContract } from "../book-contract.js";
import { completeProjects } from "./fixtures.js";
import type { ContractInput } from "../types.js";

/**
 * A_110 IMPLEMENTATION PLAN item 0.8 — rules G4 and G5: every change is generic to any story, so each branch an item
 * takes on a case's FIELDS has a fixture, and a missing field is reported, never invented. Step 0's where-and-when unit
 * test had one case's shape only; step 1's D2 had no test of its official-investigator branch. These fixtures use
 * other shapes, and the D2 test is a counterfactual on a real archived case, so it does not restate the code's rule.
 */
afterEach(() => {
  delete process.env.PROSE_V2_CONTRACT_FIXES;
  delete process.env.PROSE_V2_OPENING;
});

describe("W1 where-and-when, on shapes other than the motivating case's", () => {
  it("a year-less date falls back to the era's decade; a place with no country still reads", () => {
    const input = {
      setting: { setting: { era: { decade: "1920s" } } },
      locations: { primary: { name: "Ravensholme", place: "Whitby" } },
      temporal: {},
    } as unknown as ContractInput;
    expect(whereAndWhen(input)).toEqual({ line: "Where and when: Ravensholme at Whitby; 1920s.", unknown: [] });
  });

  it("a setting with only a kind and a month-year reports the missing town instead of inventing one (G4)", () => {
    const input = {
      setting: { location: { type: "Ocean Liner" }, era: { decade: "1930s" } },
      locations: {},
      temporal: { specificDate: { year: 1936, month: "March" } },
    } as unknown as ContractInput;
    const { line, unknown } = whereAndWhen(input);
    expect(line).toBe("Where and when: ocean liner; March 1936.");
    expect(unknown).toEqual(["its town and country"]);
  });
});

describe("D2 branches on the detective's standing, not on the story (G5)", () => {
  type Character = { name?: string; role?: string; roleArchetype?: string };
  const authorityOf = (input: ContractInput): { present: boolean; authority?: string } | null => {
    process.env.PROSE_V2_OPENING = "1";
    const death = buildBookContract(input).scenes.find((s) => s.opening?.death)?.opening?.death;
    return death ? { present: true, authority: death.authority } : null;
  };
  const isDetective = (c: Character) => /detective|investigator|sleuth|inspector/i.test(`${c.role ?? ""} ${c.roleArchetype ?? ""}`);

  it("an amateur sends for the police; the same case with an official investigator does not", () => {
    let tested = 0;
    for (const p of completeProjects()) {
      const base = authorityOf(p.input);
      if (!base?.authority) continue; // only cases whose detective is not official and whose body chapter exists
      const cast = p.input.cast as { characters?: Character[] };
      const characters = (cast.characters ?? []).map((c) => (isDetective(c) ? { ...c, roleArchetype: "Detective Inspector" } : c));
      const official = authorityOf({ ...p.input, cast: { ...cast, characters } } as unknown as ContractInput);
      expect(official?.present).toBe(true);
      expect(official?.authority).toBeUndefined();
      if (++tested >= 5) break;
    }
    expect(tested).toBeGreaterThan(0);
  });

  it("the archive exercises both branches", () => {
    let amateur = 0, official = 0;
    for (const p of completeProjects()) {
      const r = authorityOf(p.input);
      if (!r) continue;
      if (r.authority) amateur++;
      else official++;
    }
    expect(amateur).toBeGreaterThan(0);
    expect(official).toBeGreaterThan(0);
  });
});
