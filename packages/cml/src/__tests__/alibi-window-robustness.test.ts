/**
 * A SILENT TIME GATE MEANS UNPARSEABLE MORE OFTEN THAN IT MEANS CLEAN.
 *
 * Run 89022 shipped with its deception broken and nothing said so. The culprit's alibi read
 * `"twelve to three, at the village green"`; splitting on " to " left `"three, at the village green"`,
 * the place-clause strip removed `" at the village green"`, and `"three,"` — with a trailing comma —
 * was refused. The window was unreadable, so `checkCaseTimelineDeception` returned NOTHING on a case
 * whose staged time of death (3:20) sits OUTSIDE the culprit's own alibi (12:00–3:00). The fake
 * incriminated him. That is precisely what `apparent_not_covered` exists to catch.
 *
 * MEASURED over the 52 stored cases: every culprit has an alibi window string, and in 6 of them (12%)
 * none parses — so this gate has been silent on one case in eight. Their windows fail for FOUR
 * DIFFERENT reasons, which is the argument for reporting rather than for another vocabulary patch:
 *
 *   "Before 9:15 in the dining room"                       one endpoint, not a range
 *   "seven ten to seven thirty five in costume workshop"   unhyphenated "thirty five"
 *   "07:15-08:00"                                          no whitespace around the dash
 *   "twelve to three, at the village green"                a comma
 *
 * Two of those four are fixed here. The other two stay unreadable ON PURPOSE — and are now REPORTED.
 */

import { afterEach, describe, expect, it } from "vitest";

import { checkCaseTimelineDeception, checkTimelineDeception, parseTimeWindow } from "../timeline-deception.js";

const M = (h: number, m: number) => (h % 12) * 60 + m;

describe("punctuation is not part of a time", () => {
  it.each([
    ["twelve to three, at the village green", M(12, 0), M(3, 0)],
    ["eleven to three, at the village hall", M(11, 0), M(3, 0)],
    ["twelve thirty to four, at sewing shop", M(12, 30), M(4, 0)],
  ])("%s — the real run-89022 windows", (raw, s, e) => {
    expect(parseTimeWindow(raw, { wide: true })).toEqual([s, e]);
  });

  it("reads a dash with no spaces around it", () => {
    expect(parseTimeWindow("07:15-08:00", { wide: true })).toEqual([M(7, 15), M(8, 0)]);
  });

  it("REGRESSION: a dash INSIDE a minute word is not a separator", () => {
    // Allowing `-` generally corrupted ELEVEN existing windows — "one forty-five to two fifty"
    // became 1:40–1:55. Measurement caught it before it shipped; this keeps it caught.
    expect(parseTimeWindow("one forty-five to two fifty in the dining room", { wide: true }))
      .toEqual([M(1, 45), M(2, 50)]);
    expect(parseTimeWindow("eight forty-five to nine thirty-five at reception desk", { wide: true }))
      .toEqual([M(8, 45), M(9, 35)]);
  });

  it("the narrow default is untouched by any of this", () => {
    expect(parseTimeWindow("twelve to three, at the village green")).toBeNull();
    expect(parseTimeWindow("07:15-08:00")).toBeNull();
    expect(parseTimeWindow("8:10 to 8:30 in the study")).toEqual([M(8, 10), M(8, 30)]);
  });
});

describe("an unreadable window is REPORTED, not passed over in silence", () => {
  const caseWith = (window: string) => ({
    cast: [{ name: "Kenneth Gaunt", alibi_window: window }],
    culpability: { culprits: ["Kenneth Gaunt"] },
    hidden_model: {
      mechanism: { apparent_time_of_death: "twenty past three", actual_time_of_death: "three minutes past three" },
    },
  });

  afterEach(() => {
    delete process.env.AGENT3_ALIBI_UNREADABLE_GATE;
    delete process.env.AGENT3_TIMELINE_WINDOW_VOCABULARY;
  });

  it("names the failure when it cannot read the window", () => {
    const found = checkTimelineDeception({
      apparentTime: "twenty past three",
      actualTime: "three minutes past three",
      culpritAlibiWindows: ["Before 9:15 in the dining room"],
    });
    const codes = found.map((v) => v.code);
    expect(codes).toContain("culprit_alibi_unreadable");
    expect(found.find((v) => v.code === "culprit_alibi_unreadable")!.message).toContain("could not run");
  });

  it("stays silent when the culprit genuinely has NO window — absence is not failure", () => {
    // The two causes of an empty window list are opposites and must not be conflated.
    expect(checkTimelineDeception({
      apparentTime: "twenty past three",
      actualTime: "three minutes past three",
      culpritAlibiWindows: [],
    }).map((v) => v.code)).not.toContain("culprit_alibi_unreadable");
    expect(checkTimelineDeception({
      apparentTime: "twenty past three",
      actualTime: "three minutes past three",
      culpritAlibiWindows: ["   "],
    }).map((v) => v.code)).not.toContain("culprit_alibi_unreadable");
  });

  it("does not fire when the window READS — that is the whole point", () => {
    expect(checkTimelineDeception({
      apparentTime: "half past two",
      actualTime: "three minutes past three",
      culpritAlibiWindows: ["two o'clock to three o'clock"],
    }).map((v) => v.code)).not.toContain("culprit_alibi_unreadable");
  });

  it("the adapter drops it unless the gate flag is on, so today's behaviour is unchanged", () => {
    delete process.env.AGENT3_ALIBI_UNREADABLE_GATE;
    expect(checkCaseTimelineDeception(caseWith("Before 9:15 in the dining room"))).toEqual([]);

    process.env.AGENT3_ALIBI_UNREADABLE_GATE = "true";
    expect(checkCaseTimelineDeception(caseWith("Before 9:15 in the dining room")).map((v) => v.code))
      .toContain("culprit_alibi_unreadable");
  });

  it("reads the gate flag at CALL time", () => {
    process.env.AGENT3_ALIBI_UNREADABLE_GATE = "1";
    expect(checkCaseTimelineDeception(caseWith("Before 9:15")).length).toBeGreaterThan(0);
    process.env.AGENT3_ALIBI_UNREADABLE_GATE = "0";
    expect(checkCaseTimelineDeception(caseWith("Before 9:15"))).toEqual([]);
  });
});

describe("run 89022, end to end — the case the gate was silent on", () => {
  afterEach(() => { delete process.env.AGENT3_TIMELINE_WINDOW_VOCABULARY; });

  it("now catches that the staged time does not protect the culprit", () => {
    // Kenneth's alibi is 12:00–3:00. The staged death at 3:20 falls OUTSIDE it, so faking it
    // incriminates him rather than protecting him. This shipped, uncaught, at 85/100.
    process.env.AGENT3_TIMELINE_WINDOW_VOCABULARY = "true";
    const codes = checkCaseTimelineDeception({
      cast: [{ name: "Kenneth Gaunt", alibi_window: "twelve to three, at the village green" }],
      culpability: { culprits: ["Kenneth Gaunt"] },
      hidden_model: {
        mechanism: {
          apparent_time_of_death: "twenty past three",
          actual_time_of_death: "three minutes past three",
        },
      },
    }).map((v) => v.code);

    expect(codes).toContain("apparent_not_covered");
  });
});
