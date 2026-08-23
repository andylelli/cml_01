/**
 * The axis chooses the kind of mystery. A location must not overrule it.
 *
 * WHAT THIS EXISTS TO STOP. `deriveHardLogicDirectives` seeds two mechanism families from the primary
 * axis and then lets keyword rules append more. Those rules matched `theme + locationPreset` merged
 * into a single string and knew nothing about the axis, so:
 *
 *     primaryAxis: authority, locationPreset: SeasideHotel
 *       -> [authority-channel manipulation, status-based witness distortion, TIMETABLE DEPENDENCY]
 *
 * `/train|rail|liner|ship|seaside|hotel/` matches `SeasideHotel` twice over — and `SeasideHotel` is the
 * DEFAULT location in `canary-core-inputs.yaml`, so every archived run was handed a temporal mechanism
 * family regardless of the axis it asked for.
 *
 * MEASURED on the first authority case this project ever produced (2026-08-21): its locked facts came
 * out `high_tide_time`, `murder_claimed_time`, `promenade_length`, `wet_sand_mark_length` — a
 * tide-and-clock mechanism wearing an authority label.
 *
 * **This is the second half of the temporal monoculture.** X88 was the first: a reverse alias map that
 * collapsed the axis LABEL. This collapsed the MECHANISM. Fixing X88 alone would have produced four
 * more non-temporal labels sitting on four more temporal mechanisms, and the 0.2 sweep would have
 * reported five successes while measuring one axis — which is precisely the failure X70 already made
 * once, and the reason 23 of 23 archived cases are temporal.
 *
 * THE RULE, and the distinction it turns on: **a theme is intent, a location is scenery.** A caller who
 * writes a theme about a liner is asking for a transit mystery and may have every family that implies.
 * A caller who merely sets the story in a seaside hotel gets the setting, not a different mystery.
 */

import { describe, expect, it } from "vitest";

import { CML_PRIMARY_AXES, deriveHardLogicDirectives, type CmlPrimaryAxis } from "../shared.js";

/** The families the axis switch itself owns — the same index the guard consults. */
const OWNER: Readonly<Record<string, CmlPrimaryAxis>> = {
  "schedule contradiction": "temporal",
  "timing window trap": "temporal",
  "timetable dependency": "temporal",
  "access path illusion": "spatial",
  "geometry-based movement": "spatial",
  "role substitution proof": "identity",
  "witness misidentification constraint": "identity",
  "cognitive bias exploitation": "behavioral",
  "memory anchoring misdirection": "behavioral",
  "authority-channel manipulation": "authority",
  "status-based witness distortion": "authority",
};

const LOCATIONS = ["SeasideHotel", "CountryHouse", "Village", "Liner", "Theatre"];
const NEUTRAL = "Golden Age murder within a closed circle of suspects.";

describe("no location may introduce another axis's mechanism family", () => {
  for (const axis of CML_PRIMARY_AXES) {
    for (const location of LOCATIONS) {
      it(`${axis} @ ${location}`, () => {
        const { mechanismFamilies } = deriveHardLogicDirectives(NEUTRAL, axis, location);
        const foreign = mechanismFamilies.filter((f) => OWNER[f] && OWNER[f] !== axis);
        expect(foreign, `${location} pulled ${axis} toward ${foreign.map((f) => OWNER[f]).join(", ")}`).toEqual([]);
      });
    }
  }

  it("the exact combination that produced the authority-labelled clock story", () => {
    const d = deriveHardLogicDirectives(NEUTRAL, "authority", "SeasideHotel");
    expect(d.mechanismFamilies).not.toContain("timetable dependency");
    // The SETTING survives — only the family was refused. A seaside hotel is still a seaside hotel.
    expect(d.hardLogicModes).toContain("transit or seaside topology");
    expect(d.refusedFamilies.join(" ")).toContain("timetable dependency");
  });
});

describe("a theme is intent — it may introduce any family it asks for", () => {
  it("an explicitly transit THEME keeps its timetable on a non-temporal axis", () => {
    // The caller said "liner" and "timetable" in the theme. That is a request, not scenery.
    const d = deriveHardLogicDirectives(
      "A murder aboard a liner, turning on the boat-train timetable.",
      "authority",
      "CountryHouse",
    );
    expect(d.mechanismFamilies).toContain("timetable dependency");
    expect(d.refusedFamilies).toEqual([]);
  });

  it("a same-axis family from the location is never refused", () => {
    // `timetable dependency` IS temporal, so on a temporal axis the location adding it is correct.
    const d = deriveHardLogicDirectives(NEUTRAL, "temporal", "SeasideHotel");
    expect(d.mechanismFamilies).toContain("timetable dependency");
    expect(d.refusedFamilies).toEqual([]);
  });

  it("axis-neutral families are always allowed, whatever introduced them", () => {
    // `sealed-space constraint proof` belongs to no axis: it describes an impossibility, not a kind
    // of deduction. Guarding it would strip locked-room construction out of four of the five axes.
    const d = deriveHardLogicDirectives("An impossible crime in a locked room.", "behavioral", "CountryHouse");
    expect(d.mechanismFamilies).toContain("sealed-space constraint proof");
  });
});

describe("the axis always gets its own two families, and they lead", () => {
  for (const axis of CML_PRIMARY_AXES) {
    it(`${axis} keeps both of its own, first`, () => {
      const own = Object.entries(OWNER)
        .filter(([, a]) => a === axis)
        .map(([f]) => f);
      const { mechanismFamilies } = deriveHardLogicDirectives(NEUTRAL, axis, "SeasideHotel");
      const mine = own.filter((f) => mechanismFamilies.includes(f));
      // temporal owns three (incl. timetable dependency); the switch seeds exactly two for every axis.
      expect(mine.length).toBeGreaterThanOrEqual(2);
      // Leading matters: `mechanismFamilies` is sliced to 6, so anything appended can only be trimmed.
      expect(OWNER[mechanismFamilies[0]!]).toBe(axis);
    });
  }

  it("all five axes still produce five DISTINCT family sets", () => {
    // The property the corpus violated for 23 runs, asserted at the mechanism level rather than the
    // label level — a label fix alone (X88) would pass a test that only looked at the axis name.
    const sets = CML_PRIMARY_AXES.map((a) =>
      deriveHardLogicDirectives(NEUTRAL, a, "SeasideHotel").mechanismFamilies.join("|"),
    );
    expect(new Set(sets).size).toBe(CML_PRIMARY_AXES.length);
  });
});
