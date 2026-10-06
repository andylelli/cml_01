// A6-07 (CR-12): one cast-aware answer to "which member does this guess name?".
import { describe, expect, it } from "vitest";

import { guessNamesMember, resolveGuessToCastMember } from "../identity.js";

const cast = ["Eleanor Gresham", "Reginald Gresham", "Reginald Gresham Jr.", "Agatha Pemberton", "Charles Fenwick", "Isabel Morton"];

describe("resolveGuessToCastMember", () => {
  it("resolves a full name, a title and surname, a surname, a first name", () => {
    expect(resolveGuessToCastMember("Isabel Morton", cast)).toBe("Isabel Morton");
    expect(resolveGuessToCastMember("Miss Morton", cast)).toBe("Isabel Morton");
    expect(resolveGuessToCastMember("Morton", cast)).toBe("Isabel Morton");
    expect(resolveGuessToCastMember("Isabel", cast)).toBe("Isabel Morton");
    expect(resolveGuessToCastMember("Isabel Morton, the maid", cast)).toBe("Isabel Morton");
  });

  it("keeps a suffix apart: the father is not the son", () => {
    expect(resolveGuessToCastMember("Reginald Gresham", cast)).toBe("Reginald Gresham");
    expect(resolveGuessToCastMember("Reginald Gresham Jr.", cast)).toBe("Reginald Gresham Jr.");
    expect(resolveGuessToCastMember("Gresham Jr", cast)).toBe("Reginald Gresham Jr.");
  });

  it("an ambiguous guess names nobody", () => {
    expect(resolveGuessToCastMember("Mr. Gresham", cast)).toBeNull();
    expect(resolveGuessToCastMember("Reginald", cast)).toBeNull();
    expect(resolveGuessToCastMember("the butler", cast)).toBeNull();
    expect(resolveGuessToCastMember("", cast)).toBeNull();
  });

  it("the two failures of two-way includes are gone", () => {
    // includes rejected a title + surname, and accepted the father for the son.
    expect(guessNamesMember("Mr. Montague", "Charles Montague", ["Charles Montague", "Ada Blythe"])).toBe(true);
    expect(guessNamesMember("Reginald Gresham", "Reginald Gresham Jr.", cast)).toBe(false);
    // and a substring is never a name ("Ann" is not "Joanna").
    expect(guessNamesMember("Ann", "Joanna Pike", ["Joanna Pike", "Ann Lowe"])).toBe(false);
  });
});
