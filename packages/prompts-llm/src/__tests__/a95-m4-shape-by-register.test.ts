/**
 * A_95 M4 (R7) — SHAPE BY REGISTER, and the band by axis.
 *
 * The reader who first scored our humour (A_94 §8.1) ranked the seed-1358 cast's comic voices in
 * exactly the order Agent 2b had assigned them — four for four, knowing none of it — and then named
 * the one thing to fix: *"several characters speak in similar polished aphorisms. Give each a
 * different comic flavour."* The two shapes were asked of the CHAPTER, so anyone could supply them.
 *
 * The cast below is that run's, verbatim from `character_profiles`.
 */

import { afterEach, describe, expect, it } from "vitest";
import { selectWitBeat } from "../prose-contract/beats.js";

import { bandForAxis, isBandByAxisEnabled, resolveBandForRun } from "../humour-level.js";

const FLAGS = ["AGENT9_SHAPE_BY_REGISTER", "AGENT9_WIT_SHAPES", "AGENT2B_BAND_BY_AXIS"];
const saved = Object.fromEntries(FLAGS.map((f) => [f, process.env[f]]));
afterEach(() => {
  for (const f of FLAGS) {
    if (saved[f] === undefined) delete process.env[f];
    else process.env[f] = saved[f]!;
  }
});

/** Seed 1358's cast, as Agent 2b wrote it under `--humour sharp`. */
const CAST = [
  { name: "Edith Penhale", humourStyle: "dry_wit", humourLevel: 0.5 },
  { name: "Leonard Nettleship", humourStyle: "none", humourLevel: 0 },
  { name: "Millicent Ashcombe", humourStyle: "polite_savagery", humourLevel: 0.7 },
  { name: "Agatha Innes", humourStyle: "understatement", humourLevel: 0.2 },
  { name: "Violet Radcliffe", humourStyle: "sardonic", humourLevel: 0.75 },
];

describe("the band by axis fills in only an ABSENT band", () => {
  it("the social axes get sharp, the object axes stay classic", () => {
    expect(bandForAxis("authority")).toBe("sharp");
    expect(bandForAxis("identity")).toBe("sharp");
    for (const axis of ["temporal", "spatial", "mechanical", "behavioral", "", null, "nonsense"]) {
      expect(bandForAxis(axis)).toBe("classic");
    }
  });

  it("an explicit band always wins — --humour and a generated yaml are never overridden", () => {
    process.env.AGENT2B_BAND_BY_AXIS = "true";
    expect(resolveBandForRun("dry", "authority")).toBe("dry");
    expect(resolveBandForRun("none", "identity")).toBe("none");
  });

  it("OFF: an absent band is classic, exactly as before", () => {
    delete process.env.AGENT2B_BAND_BY_AXIS;
    expect(resolveBandForRun(undefined, "authority")).toBe("classic");
  });

  it("ON: an absent band follows the axis, and can only ever raise it above the corpus default", () => {
    process.env.AGENT2B_BAND_BY_AXIS = "true";
    expect(resolveBandForRun(undefined, "authority")).toBe("sharp");
    expect(resolveBandForRun("", "spatial")).toBe("classic");
  });
});
