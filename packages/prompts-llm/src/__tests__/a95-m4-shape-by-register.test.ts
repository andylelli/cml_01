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

import {
  buildOwnedShapeLines,
  buildWitBeatLines,
  isShapeByRegisterEnabled,
  selectWitBeat,
} from "../agent9-prose/obligation-block.js";
import { HUMOUR_STYLES } from "../agent9-prose/prompt-blocks.js";
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

describe("the flags default OFF", () => {
  it("both are off unless .env says so", () => {
    for (const f of FLAGS) delete process.env[f];
    expect(isShapeByRegisterEnabled()).toBe(false);
    expect(isBandByAxisEnabled()).toBe(false);
  });
});

describe("each shape is owned by a register", () => {
  it("the flat answer goes to an understated voice, the retort to a sharp one", () => {
    const lines = buildOwnedShapeLines(CAST, 1).join("\n");
    const flatOwner = /THE FLAT ANSWER — (\w+ \w+) answers/.exec(lines)?.[1];
    const retortOwner = /and (\w+ \w+) answers it in six words/.exec(lines)?.[1];
    expect(["Edith Penhale", "Agatha Innes"]).toContain(flatOwner);
    expect(["Millicent Ashcombe", "Violet Radcliffe"]).toContain(retortOwner);
    expect(flatOwner).not.toBe(retortOwner);
  });

  it("THE READER'S OWN SUGGESTION: the humourless character gets the unintended joke", () => {
    const lines = buildOwnedShapeLines(CAST, 1).join("\n");
    expect(lines).toContain("THE UNMEANT JOKE — Leonard Nettleship");
    expect(lines).toContain("WITHOUT INTENDING TO");
    expect(lines).toContain("must not");
  });

  it("the owners rotate, so one chapter's voices are not every chapter's", () => {
    const owner = (n: number) => /THE FLAT ANSWER — (\w+ \w+)/.exec(buildOwnedShapeLines(CAST, n).join("\n"))?.[1];
    expect(new Set([1, 2, 3, 4].map(owner)).size).toBeGreaterThan(1);
  });

  it("a cast with no sharp register still gets its retort — the shape is never lost", () => {
    const mild = CAST.filter((c) => c.humourStyle === "dry_wit" || c.humourStyle === "none");
    const lines = buildOwnedShapeLines(mild, 1).join("\n");
    expect(lines).toContain("and somebody answers it in six words or fewer");
  });

  it("a cast with nobody humourless gets no unmeant joke rather than a wrong one", () => {
    const allFunny = CAST.filter((c) => c.humourStyle !== "none");
    expect(buildOwnedShapeLines(allFunny, 1).join("\n")).not.toContain("THE UNMEANT JOKE");
  });

  it("the A_94 rules survive: additions not a diet, and no register named in narration", () => {
    const lines = buildOwnedShapeLines(CAST, 1).join("\n");
    expect(lines).toContain("additions, not a diet");
    expect(lines).toContain("NEVER NAME A REGISTER OR A SHAPE IN NARRATION");
    expect(lines).toContain("not in ANY wording");
  });

  /**
   * R4d — MEASURED on run 50862. The chapter obeyed "short answers" by shortening ALL speech:
   * speeches 230 -> 132, speeches of >=15 words 62 -> 17, mean 12.8 -> 9.5. The retort needs a long
   * setup, so retorts collapsed 17 -> 3 and wit fell to 9.7 despite flat answers holding at 6. And
   * the narration ban was routed around: "Four words, final." and "She did not elaborate." were both
   * banned, and the model wrote "her answer as brief as the fading light" SEVEN times.
   */
  it("R4d: the long setup is itself an instruction, so the retort has something to deflate", () => {
    const lines = buildOwnedShapeLines(CAST, 1).join("\n");
    expect(lines).toContain("TWENTY-FIVE WORDS OR MORE");
    expect(lines).toContain("write that speech");
  });

  it("R4d: it says explicitly that nobody else shortens", () => {
    const lines = buildOwnedShapeLines(CAST, 1).join("\n");
    expect(lines).toContain("THESE ARE THE ONLY SHORT SPEECHES THE CHAPTER OWES");
    expect(lines).toContain("fewer long speeches than");
  });

  it("R4d: the brevity-tag rule is a positive operation, not another list to route around", () => {
    const lines = buildOwnedShapeLines(CAST, 1).join("\n");
    expect(lines).toContain("not in ANY wording");
    expect(lines).toContain("what SOMEBODY ELSE DOES");
    // A_102 §14.2: this line used to pin the specimen's PRESENCE. The seed 18179 read quoted "as brief
    // as the fading light" back at us — a phrase shown to the model is a phrase it writes — so the
    // rule keeps its operation and loses its specimen, and the test pins the absence.
    expect(lines).not.toContain("as brief as the fading light");
    expect(lines).not.toContain("She did not elaborate");
  });

  it("and it adds the differentiation the reader asked for", () => {
    expect(buildOwnedShapeLines(CAST, 1).join("\n")).toContain("no two");
  });
});

describe("it reaches the wit beat only when both flags are on", () => {
  const beat = selectWitBeat(CAST, 1)!;

  it("WIT_SHAPES on, SHAPE_BY_REGISTER off: the A_94 unowned wording, byte-identical", () => {
    process.env.AGENT9_WIT_SHAPES = "true";
    delete process.env.AGENT9_SHAPE_BY_REGISTER;
    const lines = buildWitBeatLines(beat, HUMOUR_STYLES, CAST, 1).join("\n");
    expect(lines).toContain("THE FLAT ANSWER");
    expect(lines).not.toContain("THE UNMEANT JOKE");
    expect(lines).not.toMatch(/THE FLAT ANSWER — \w+ \w+ answers/);
  });

  it("both on: the shapes carry names", () => {
    process.env.AGENT9_WIT_SHAPES = "true";
    process.env.AGENT9_SHAPE_BY_REGISTER = "true";
    const lines = buildWitBeatLines(beat, HUMOUR_STYLES, CAST, 1).join("\n");
    expect(lines).toMatch(/THE FLAT ANSWER — \w+ \w+ answers/);
    expect(lines).toContain("THE UNMEANT JOKE");
  });

  it("WIT_SHAPES off: no shapes at all, whatever R7 says", () => {
    delete process.env.AGENT9_WIT_SHAPES;
    process.env.AGENT9_SHAPE_BY_REGISTER = "true";
    const lines = buildWitBeatLines(beat, HUMOUR_STYLES, CAST, 1).join("\n");
    expect(lines).toContain("ONE WIT BEAT");
    expect(lines).not.toContain("THE FLAT ANSWER");
  });
});

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
