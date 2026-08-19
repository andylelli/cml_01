/**
 * X51 (REVIEW_11 §8.1) — the registry is device-scoped, so the weapon and the alibi locations drift.
 *
 * The fixture below is the real `CASE` shape from run `mystery-1786999938275`, the 86-scoring run
 * whose cold reader listed both drifts: the weapon ("Chapter 1 says heavy brass candlestick, while
 * Chapter 2/3 use heavy bronze statuette — pick one") and the alibis ("Hale is placed in the smoking
 * room, lounge, and on patrol across different sections").
 */

import { describe, expect, it } from "vitest";
import {
  buildCaseScopedLockedFacts,
  extractAlibiLocation,
  extractWeaponFromDeathMethod,
} from "../case-locked-facts.js";
import { checkCaseTimeCoherence } from "../timeline-deception.js";
import { isDetectiveArchetype, isVictimArchetype } from "../roles.js";

const realCase = {
  death_method: "struck with a heavy bronze statuette",
  culpability: { culprits: ["Hugo Vane"], victim: "Dr. Mallory Finch" },
  cast: [
    { name: "Eleanor Voss", role_archetype: "Detective", alibi_window: "2:30 to 3:30 PM in the hotel lounge" },
    { name: "Dr. Mallory Finch", role_archetype: "victim", alibi_window: "N/A" },
    { name: "Captain Ivor Hale", role_archetype: "Suspect", alibi_window: "2:00 to 2:40 PM in the smoking room" },
    { name: "Beatrice Quill", role_archetype: "Suspect", alibi_window: "2:10 to 2:50 PM at the front desk" },
    { name: "Sylvia Trent", role_archetype: "Suspect", alibi_window: "2:15 to 2:45 PM in the garden lounge" },
    { name: "Hugo Vane", role_archetype: "Suspect", alibi_window: "2:20 to 3:00 PM in his private study" },
  ],
};

describe("buildCaseScopedLockedFacts — the real 08-17 case (X51)", () => {
  const facts = buildCaseScopedLockedFacts(realCase);
  const byId = new Map(facts.map((f) => [f.id, f.value]));

  it("pins the murder weapon — the fact chapter 1 invented a second version of", () => {
    expect(byId.get("murder_weapon")).toBe("a heavy bronze statuette");
  });

  it("pins each suspect's alibi location, across both preposition shapes", () => {
    // "in the smoking room" and — the bug the first draft of this had — "AT the front desk".
    expect(byId.get("alibi_location_captain_ivor_hale")).toBe("the smoking room");
    expect(byId.get("alibi_location_beatrice_quill")).toBe("the front desk");
    expect(byId.get("alibi_location_sylvia_trent")).toBe("the garden lounge");
  });

  it("pins no alibi for the detective, the victim, or the culprit", () => {
    // You do not pin an alibi for the corpse; the sleuth's whereabouts are not a suspect's alibi; and
    // the culprit's alibi is the lie the reveal demolishes — ordering the prose to repeat it verbatim
    // in the chapter that takes it apart is the opposite of consistency.
    expect(byId.has("alibi_location_eleanor_voss")).toBe(false);
    expect(byId.has("alibi_location_dr_mallory_finch")).toBe(false);
    expect(byId.has("alibi_location_hugo_vane")).toBe(false);
  });

  it("adds no clock- or duration-valued fact, so X38 still sees exactly two clocks and one duration", () => {
    // The guard that matters: `checkCaseTimeCoherence` fires ONLY on 2 clocks + 1 duration. If an
    // alibi window's times reached the registry, the one check that caught this run's largest defect
    // would switch itself off.
    const deviceFacts = [
      { id: "clock_face_time_at_murder", value: "a quarter to three" },
      { id: "hotel_bell_chime_time", value: "twenty minutes past two" },
      { id: "pendulum_reversal_duration", value: "twenty minutes" },
    ];
    const before = checkCaseTimeCoherence({ lockedFacts: deviceFacts });
    const after = checkCaseTimeCoherence({ lockedFacts: [...deviceFacts, ...facts] });
    expect(before.map((v) => v.code)).toEqual(["locked_time_arithmetic"]);
    expect(after.map((v) => v.code)).toEqual(before.map((v) => v.code));
  });
});

describe("extractWeaponFromDeathMethod", () => {
  it("names the instrument, not the verb", () => {
    expect(extractWeaponFromDeathMethod("struck with a heavy bronze statuette")).toBe("a heavy bronze statuette");
    expect(extractWeaponFromDeathMethod("poisoned with a tincture of foxglove")).toBe("a tincture of foxglove");
  });

  it("drops a trailing target phrase but keeps the object", () => {
    expect(extractWeaponFromDeathMethod("struck with a brass candlestick to the head")).toBe("a brass candlestick");
  });

  it("returns null rather than guessing when the method names no instrument", () => {
    expect(extractWeaponFromDeathMethod("strangulation")).toBeNull();
    expect(extractWeaponFromDeathMethod("a fall from the bell tower")).toBeNull();
    expect(extractWeaponFromDeathMethod("")).toBeNull();
    expect(extractWeaponFromDeathMethod(undefined)).toBeNull();
  });

  it("refuses a whole clause — that is the model narrating, not naming", () => {
    expect(
      extractWeaponFromDeathMethod("struck with what the household later agreed must have been the heavy bronze statuette from the hall"),
    ).toBeNull();
  });
});

describe("extractAlibiLocation", () => {
  it("reads the place after any locative preposition", () => {
    expect(extractAlibiLocation("2:00 to 2:40 PM in the smoking room")).toBe("the smoking room");
    expect(extractAlibiLocation("2:10 to 2:50 PM at the front desk")).toBe("the front desk");
    expect(extractAlibiLocation("half past two, on the west terrace")).toBe("the west terrace");
  });

  it("skips a leading time phrase and takes the first tail that reads like a place", () => {
    expect(extractAlibiLocation("in the hour after two, at the front desk")).toBe("the front desk");
  });

  it("keeps a multi-part place rather than truncating at its inner preposition", () => {
    // Taking the LAST preposition would answer "the stair"; the first plausible tail is the place.
    expect(extractAlibiLocation("2:00 PM in the still room by the stair")).toBe("the still room by the stair");
  });

  it("returns null for N/A, for a bare time range, and for a time-of-day phrase", () => {
    expect(extractAlibiLocation("N/A")).toBeNull();
    expect(extractAlibiLocation("2:00 to 2:40 PM")).toBeNull();
    // "…from two until three in the afternoon" must not pin "the afternoon" as a place.
    expect(extractAlibiLocation("from two until three in the afternoon")).toBeNull();
    expect(extractAlibiLocation("")).toBeNull();
  });
});

describe("buildCaseScopedLockedFacts — defensive edges", () => {
  it("returns nothing for an empty or malformed case", () => {
    expect(buildCaseScopedLockedFacts(undefined)).toEqual([]);
    expect(buildCaseScopedLockedFacts({})).toEqual([]);
    expect(buildCaseScopedLockedFacts({ cast: "not an array" })).toEqual([]);
  });

  it("caps the alibi facts so a large cast cannot flood the prompt", () => {
    const cast = Array.from({ length: 20 }, (_, i) => ({
      name: `Suspect ${i}`,
      role_archetype: "suspect",
      alibi_window: `2:00 to 2:40 PM in room ${i}`,
    }));
    const facts = buildCaseScopedLockedFacts({ death_method: "struck with a poker", cast });
    expect(facts.length).toBeLessThanOrEqual(7); // 6 alibis + the weapon
  });

  it("reads the role from any of the three field spellings (X50's rule)", () => {
    const facts = buildCaseScopedLockedFacts({
      cast: [
        // The label Agent 2 actually emits — no `detective` substring anywhere in it.
        { name: "Eleanor Voss", roleArchetype: "Amateur Sleuth / Civilian Investigator", alibi_window: "2:00 PM in the lounge" },
        { name: "Ivor Hale", role: "suspect", alibi_window: "2:00 PM in the smoking room" },
      ],
    });
    expect(facts.map((f) => f.id)).toEqual(["alibi_location_ivor_hale"]);
  });
});

/**
 * FOUND ON REVIEW 2026-08-18 — the first `isDetectiveArchetype` required the role noun to be the FINAL
 * word of its head segment, which rejected every ordinary detective label the `.includes("detective")`
 * it replaced had matched. That is X50's own symptom reintroduced by X50's fix: a detective wrongly
 * readmitted to the elimination-suspect set is the sleuth being cleared of a crime nobody accused
 * them of.
 */
describe("isDetectiveArchetype — denotes, but not only as the final word", () => {
  it("matches the three vocabularies this pipeline emits", () => {
    expect(isDetectiveArchetype("detective")).toBe(true);                                  // the role enum
    expect(isDetectiveArchetype("Amateur Sleuth / Civilian Investigator")).toBe(true);      // Agent 2's mandate
    expect(isDetectiveArchetype("Detective")).toBe(true);                                   // Agent 7's cast list
  });

  it("matches labels with a trailing qualifier — all of these returned FALSE before the fix", () => {
    expect(isDetectiveArchetype("Private detective hired by the family")).toBe(true);
    expect(isDetectiveArchetype("Inspector from Scotland Yard")).toBe(true);
    expect(isDetectiveArchetype("Detective with the county police")).toBe(true);
  });

  it("still matches a leading qualifier", () => {
    expect(isDetectiveArchetype("Consulting detective")).toBe(true);
    expect(isDetectiveArchetype("Private investigator")).toBe(true);
  });

  it("still REFUSES relational and possessive references — the reason the head rule exists", () => {
    expect(isDetectiveArchetype("Landlady of the detective")).toBe(false);
    expect(isDetectiveArchetype("Friend of the sleuth")).toBe(false);
    expect(isDetectiveArchetype("the detective's landlady")).toBe(false);
    expect(isDetectiveArchetype("the inspector’s driver")).toBe(false);
  });

  it("refuses ordinary suspect roles and empty input", () => {
    expect(isDetectiveArchetype("Retired Sea Captain")).toBe(false);
    expect(isDetectiveArchetype("Hotel Owner")).toBe(false);
    expect(isDetectiveArchetype("")).toBe(false);
    expect(isDetectiveArchetype(undefined)).toBe(false);
  });

  it("leaves isVictimArchetype's stricter head-final rule alone — the asymmetry is deliberate", () => {
    // A false victim rewrites a character's lifecycle (abort class #10); a false detective only skips
    // one clearance. The victim predicate keeps the rule that cost a run to learn.
    expect(isVictimArchetype("Friend of the victim")).toBe(false);
    expect(isVictimArchetype("murder victim")).toBe(true);
  });
});

/**
 * FOUND ON REVIEW 2026-08-18 — the cap read `facts.length >= MAX_ALIBI_FACTS + 1`, assuming a weapon
 * fact always exists. `extractWeaponFromDeathMethod` returns null for "strangulation" or "a fall".
 */
describe("buildCaseScopedLockedFacts — the alibi cap counts alibis", () => {
  const cast = Array.from({ length: 20 }, (_, i) => ({
    name: `Suspect ${i}`,
    role_archetype: "suspect",
    alibi_window: `2:00 to 2:40 PM in room ${i}`,
  }));

  it("caps at 6 alibis when there IS a weapon fact", () => {
    const facts = buildCaseScopedLockedFacts({ death_method: "struck with a poker", cast });
    expect(facts.filter((f) => f.id.startsWith("alibi_location_")).length).toBe(6);
    expect(facts.length).toBe(7);
  });

  it("caps at 6 alibis when there is NO weapon fact — was 7 before the fix", () => {
    const facts = buildCaseScopedLockedFacts({ death_method: "strangulation", cast });
    expect(facts.filter((f) => f.id.startsWith("alibi_location_")).length).toBe(6);
    expect(facts.length).toBe(6);
  });
});
