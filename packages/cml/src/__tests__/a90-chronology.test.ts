import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  checkChronologyCoherence,
  deriveCaseChronology,
  extractClockValues,
  findUnanchoredClockValues,
  isChronologyEnabled,
  isChronologyErrorsEnabled,
  parseDurationAnchor,
  renderCaseTimes,
  renderChronologyBlock,
  solveLockedChronology,
  summariseChronology,
} from "../chronology.js";

/**
 * A_90 Moves 1 and 3 — one chronology solved from the device.
 *
 * The fixture is the 2026-09-12 book's own device and case (project …789156244431), the one whose
 * reader wrote "if the music paused at 4:00 and the silent intermission lasted seven minutes, the
 * music should resume at 4:07, not 4:20" and then wrote out the timeline by hand. Every assertion
 * below about the ship device is that timeline.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(fs.readFileSync(path.join(here, "fixtures", "a90-archive-timeline.json"), "utf8"));

const shipFacts = (): any[] => JSON.parse(JSON.stringify(fixture.ship.lockedFacts));
const anchoredFacts = (): any[] => {
  const facts = shipFacts();
  facts.find((f) => f.id === "silent_intermission_duration").anchor = { at: "music_restart_time", edge: "end" };
  facts.find((f) => f.id === "last_pose_hold").anchor = { at: "silent_intermission_duration_start", edge: "start" };
  return facts;
};
const shipCase = (): any => JSON.parse(JSON.stringify(fixture.ship.CASE));

describe("solveLockedChronology — the 2026-09-12 device", () => {
  it("as archived: one clock, and three durations sitting nowhere on it", () => {
    const chrono = solveLockedChronology(shipFacts());
    expect(chrono.events.map((e) => e.id)).toEqual(["music_restart_time"]);
    expect(chrono.events[0]!.dial).toBe(260);
    expect(chrono.unplaced.map((u) => u.id).sort()).toEqual(["last_pose_hold", "murder_window_interval", "silent_intermission_duration"]);
    // Nothing solved, nothing to print: the prompt stays byte-identical.
    expect(renderChronologyBlock(chrono)).toBe("");
  });

  it("with anchors: the intermission begins at thirteen minutes past four and the pose ends at sixteen past", () => {
    const chrono = solveLockedChronology(anchoredFacts());
    const byId = Object.fromEntries(chrono.events.map((e) => [e.id, e]));
    expect(byId["silent_intermission_duration_start"]!.dial).toBe(253);
    expect(byId["silent_intermission_duration_start"]!.source).toBe("solved");
    expect(byId["silent_intermission_duration_start"]!.via).toBe("twenty minutes past four less seven minutes");
    expect(byId["last_pose_hold_end"]!.dial).toBe(256);
    expect(chrono.intervals.map((i) => i.id).sort()).toEqual(["last_pose_hold", "silent_intermission_duration"]);
    expect(chrono.unplaced.map((u) => u.id)).toEqual(["murder_window_interval"]);

    const block = renderChronologyBlock(chrono);
    expect(block).toContain("THE CLOCK");
    expect(block).toContain('"thirteen minutes past four"');
    expect(block).toContain("silent_intermission_duration (duration of the gramophone's silent pause during rehearsal music): thirteen minutes past four to twenty minutes past four (seven minutes)");
    expect(block).toContain("murder_window_interval");
  });

  it("a duration derived from two clock facts is the interval between them", () => {
    const chrono = solveLockedChronology([
      { id: "seen", value: "ten minutes past eleven" },
      { id: "punched", value: "twenty minutes to eleven" },
      { id: "shift", value: "thirty minutes", derivedFrom: ["seen", "punched"] },
    ]);
    expect(chrono.intervals).toHaveLength(1);
    expect(chrono.intervals[0]!.minutes).toBe(30);
    expect(chrono.intervals[0]!.lengthRaw).toBe("thirty minutes");
    expect(chrono.unplaced).toEqual([]);
  });

  it("an anchor naming nothing leaves the duration unplaced, with the reason", () => {
    const facts = shipFacts();
    facts.find((f) => f.id === "silent_intermission_duration").anchor = { at: "nowhere", edge: "end" };
    const chrono = solveLockedChronology(facts);
    expect(chrono.unplaced.find((u) => u.id === "silent_intermission_duration")!.reason).toContain('"nowhere"');
    expect(summariseChronology(chrono)).toContain("unplaced locked durations");
  });

  it("parseDurationAnchor reads start/end spellings and refuses the rest", () => {
    expect(parseDurationAnchor({ at: "x", edge: "end" })).toEqual({ at: "x", edge: "end" });
    expect(parseDurationAnchor({ at: "x", edge: "starts" })).toEqual({ at: "x", edge: "start" });
    expect(parseDurationAnchor({ event: "x", edge: "ENDS AT" })).toEqual({ at: "x", edge: "end" });
    expect(parseDurationAnchor({ at: "x", edge: "middle" })).toBeNull();
    expect(parseDurationAnchor({ edge: "end" })).toBeNull();
    expect(parseDurationAnchor("music_restart_time")).toBeNull();
  });
});

describe("extractClockValues — every spelling the cases and the renderers use", () => {
  it("reads digits, word-form, o'clock and the spoken form", () => {
    const dials = (text: string) => extractClockValues(text).map((v) => v.dial);
    expect(dials("4:13")).toEqual([253]);
    expect(dials("thirteen minutes past four")).toEqual([253]);
    expect(dials("a quarter to five")).toEqual([285]);
    expect(dials("four o'clock and four o’clock")).toEqual([240, 240]);
    expect(dials("three fifty-five to four ten in the rehearsal room")).toEqual([235, 250]);
    expect(dials("twelve oh five")).toEqual([5]);
    expect(dials("twenty-five minutes past four")).toEqual([265]);
  });

  it("does not read prose that only looks like a time", () => {
    expect(extractClockValues("she went to four shops and came back to one")).toEqual([]);
    expect(extractClockValues("chapter two, three days later")).toEqual([]);
  });
});

describe("deriveCaseChronology + findUnanchoredClockValues — the archived ship case", () => {
  it("collects death times, anchors, windows and alibi endpoints", () => {
    const chrono = deriveCaseChronology(shipCase(), shipFacts());
    const dials = new Set(chrono.events.map((e) => e.dial));
    for (const d of [240, 255, 260, 235, 250]) expect(dials.has(d), `dial ${d}`).toBe(true);
    expect(chrono.intervals.some((i) => i.id.startsWith("alibi:"))).toBe(true);
    expect(chrono.events.some((e) => e.id === "apparent_time_of_death" && e.source === "case")).toBe(true);
  });

  it("known-positive: a stray clock value in an inference step is reported by path; declared, it is not", () => {
    const cml = shipCase();
    cml.inference_path.steps.push({ observation: "the chapel bell rang at 6:45" });
    const before = findUnanchoredClockValues(cml, deriveCaseChronology(cml, shipFacts()));
    expect(before.unanchored.map((u) => u.raw)).toContain("6:45");
    expect(before.unanchored.find((u) => u.raw === "6:45")!.path).toBe("inference_path.steps[].observation");

    cml.constraint_space.time.anchors.push("6:45 — the chapel bell");
    const after = findUnanchoredClockValues(cml, deriveCaseChronology(cml, shipFacts()));
    expect(after.unanchored.map((u) => u.raw)).not.toContain("6:45");
    expect(after.total).toBe(before.total);
  });

  it("another artifact is walked with its own skip rule", () => {
    const chrono = deriveCaseChronology(shipCase(), shipFacts());
    const clues = { clues: [{ description: "the log shows the music resumed at 4:20" }, { description: "a train at 7:50" }] };
    const anchoring = findUnanchoredClockValues(clues, chrono, { skip: () => false });
    expect(anchoring.total).toBe(2);
    expect(anchoring.unanchored.map((u) => u.raw)).toEqual(["7:50"]);
  });
});

describe("checkChronologyCoherence", () => {
  it("a window whose stated length disagrees with its endpoints", () => {
    const cml = shipCase();
    cml.constraint_space.time.windows.push("4:00 to 4:20 — the silent intermission (seven minutes)");
    const findings = checkChronologyCoherence(cml, deriveCaseChronology(cml, shipFacts()), shipFacts());
    const hit = findings.find((f) => f.code === "window_duration_mismatch");
    expect(hit).toBeDefined();
    expect(hit!.message).toContain("20 minutes");
    expect(hit!.message).toContain("7 minutes");
  });

  it("the archived case's 'intermission starting at four o'clock' contradicts the solved 4:13 once the device is anchored", () => {
    const cml = shipCase();
    const facts = anchoredFacts();
    const findings = checkChronologyCoherence(cml, deriveCaseChronology(cml, facts), facts);
    const hit = findings.find((f) => f.code === "anchor_contradicts_solved_event");
    expect(hit).toBeDefined();
    expect(hit!.path).toBe("constraint_space.time.anchors[0]");
    expect(hit!.message).toContain("thirteen minutes past four");
  });

  it("nothing solved means nothing to contradict; an anchor that agrees is not a finding", () => {
    const cml = shipCase();
    expect(checkChronologyCoherence(cml, deriveCaseChronology(cml, shipFacts()), shipFacts())).toEqual([]);
    cml.constraint_space.time.anchors[0] =
      "Gramophone schedule showing rehearsal music with a silent intermission starting at thirteen minutes past four";
    const facts = anchoredFacts();
    const findings = checkChronologyCoherence(cml, deriveCaseChronology(cml, facts), facts);
    expect(findings.filter((f) => f.code === "anchor_contradicts_solved_event")).toEqual([]);
  });
});

describe("renderCaseTimes — one spelling for a locked minute, and nothing else", () => {
  it("respells a death time that parses to a locked clock, once", () => {
    const cml = shipCase();
    cml.hidden_model.mechanism.apparent_time_of_death = "4:20";
    const changes = renderCaseTimes(cml, deriveCaseChronology(cml, shipFacts()));
    expect(changes).toHaveLength(1);
    expect(changes[0]!.path).toBe("hidden_model.mechanism.apparent_time_of_death");
    expect(cml.hidden_model.mechanism.apparent_time_of_death).toBe("twenty minutes past four");
    expect(renderCaseTimes(cml, deriveCaseChronology(cml, shipFacts()))).toEqual([]);
  });

  it("leaves a death time that matches no locked clock alone", () => {
    const cml = shipCase();
    const before = cml.hidden_model.mechanism.actual_time_of_death;
    expect(renderCaseTimes(cml, deriveCaseChronology(cml, shipFacts()))).toEqual([]);
    expect(cml.hidden_model.mechanism.actual_time_of_death).toBe(before);
  });
});

describe("flags are read at call time", () => {
  it("AGENT3_CHRONOLOGY and AGENT3_CHRONOLOGY_ERRORS", () => {
    for (const [flag, read] of [
      ["AGENT3_CHRONOLOGY", isChronologyEnabled],
      ["AGENT3_CHRONOLOGY_ERRORS", isChronologyErrorsEnabled],
    ] as const) {
      const saved = process.env[flag];
      try {
        delete process.env[flag];
        expect(read()).toBe(false);
        process.env[flag] = "true";
        expect(read()).toBe(true);
        process.env[flag] = "off";
        expect(read()).toBe(false);
      } finally {
        if (saved === undefined) delete process.env[flag];
        else process.env[flag] = saved;
      }
    }
  });
});
