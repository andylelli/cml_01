import { describe, expect, it } from "vitest";

import { dialWindowContains, parseClockTime, parseTimeWindow } from "@cml/cml";

import { applyAlibiPlanBeforeRetry, buildAlibiPlanRule, buildChronologyRule, buildDeviceArithmeticRule } from "../agent3-cml.js";
import { checkCaseTimelineDeception } from "@cml/cml";
import { buildHardLogicDevicePrompt, isDurationAnchorsEnabled } from "../agent3b-hard-logic-devices.js";

/**
 * A_90 — what reaches the Agent 3 prompt. Both rules are spliced into the device-time-binding
 * section as `${...}`, so "" is the byte-identity guarantee when a flag is off or there is nothing
 * to say; the assertions here are on the strings themselves.
 */
const withEnv = <T>(vars: Record<string, string | undefined>, fn: () => T): T => {
  const saved: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(vars)) {
    saved[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    return fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
};

const twoClocks = [
  { id: "displayed_time", value: "ten minutes past eleven", description: "the hands" },
  { id: "true_time", value: "twenty minutes to eleven", description: "the stopped watch" },
  { id: "clock_shift", value: "thirty minutes", description: "how far", derivedFrom: ["displayed_time", "true_time"] },
];

const shipDevice = [
  { id: "silent_intermission_duration", value: "seven minutes", description: "duration of the gramophone's silent pause" },
  { id: "last_pose_hold", value: "three minutes", description: "the last pose held" },
  { id: "music_restart_time", value: "twenty minutes past four", description: "music resumed" },
  { id: "murder_window_interval", value: "ten minutes", description: "the window", derivedFrom: ["silent_intermission_duration", "last_pose_hold"] },
];

describe("buildAlibiPlanRule (AGENT3_ALIBI_PLAN)", () => {
  it("OFF: empty, whatever the registry", () => {
    expect(withEnv({ AGENT3_ALIBI_PLAN: undefined }, () => buildAlibiPlanRule(twoClocks))).toBe("");
  });

  it("ON with two locked clocks: one computed window per assignment, each holding both invariants", () => {
    const rule = withEnv({ AGENT3_ALIBI_PLAN: "true" }, () => buildAlibiPlanRule(twoClocks));
    expect(rule).toContain("THE CULPRIT'S ALIBI IS ALREADY COMPUTED");
    const lines = rule.split("\n").filter((l) => l.includes("• if `apparent_time_of_death` is"));
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      const m = /apparent_time_of_death` is "([^"]+)".*actual_time_of_death` is "([^"]+)".*alibi_window` is "([^"]+)"/.exec(line)!;
      expect(m, line).not.toBeNull();
      const apparent = parseClockTime(m[1])!;
      const actual = parseClockTime(m[2])!;
      const [start, end] = parseTimeWindow(m[3])!;
      expect(dialWindowContains(start, end, apparent)).toBe(true);
      expect(dialWindowContains(start, end, actual)).toBe(false);
    }
  });

  it("ON with a registry that is not its shape (one clock, three durations): empty", () => {
    expect(withEnv({ AGENT3_ALIBI_PLAN: "true" }, () => buildAlibiPlanRule(shipDevice))).toBe("");
  });
});

describe("buildChronologyRule (AGENT3_CHRONOLOGY)", () => {
  it("OFF: empty", () => {
    expect(withEnv({ AGENT3_CHRONOLOGY: undefined }, () => buildChronologyRule(shipDevice))).toBe("");
  });

  it("ON, nothing anchored: the anchoring rule alone, no clock block", () => {
    const rule = withEnv({ AGENT3_CHRONOLOGY: "true" }, () => buildChronologyRule(shipDevice));
    expect(rule).not.toContain("THE CLOCK");
    expect(rule).toContain("`constraint_space.time.anchors`");
    expect(rule).toContain("reported against the case as unanchored");
  });

  it("ON, anchored: the solved clock names the value the reader wrote by hand", () => {
    const anchored = shipDevice.map((f) =>
      f.id === "silent_intermission_duration" ? { ...f, anchor: { at: "music_restart_time", edge: "end" } } : f,
    );
    const rule = withEnv({ AGENT3_CHRONOLOGY: "true" }, () => buildChronologyRule(anchored));
    expect(rule).toContain("THE CLOCK");
    expect(rule).toContain('"thirteen minutes past four"');
    expect(rule).toContain("thirteen minutes past four to twenty minutes past four (seven minutes)");
    expect(rule).toContain("last_pose_hold");
  });
});

describe("AGENT3B_DURATION_ANCHORS is read at call time", () => {
  it("off unset, on when set", () => {
    expect(withEnv({ AGENT3B_DURATION_ANCHORS: undefined }, () => isDurationAnchorsEnabled())).toBe(false);
    expect(withEnv({ AGENT3B_DURATION_ANCHORS: "true" }, () => isDurationAnchorsEnabled())).toBe(true);
  });
});

describe("the 3b prompt asks for the anchor only under AGENT3B_DURATION_ANCHORS", () => {
  const baseInputs = {
    runId: "r1",
    projectId: "p1",
    decade: "1940s",
    location: "a seaside hotel",
    institution: "hotel",
    tone: "Classic",
    primaryAxis: "temporal" as const,
  };
  const whole = () => {
    const p = buildHardLogicDevicePrompt(baseInputs as any);
    return [p.system, p.developer, p.user].join("\n");
  };
  it("OFF: byte-identical skeleton, no anchor field", () => {
    const text = withEnv({ AGENT3B_DURATION_ANCHORS: undefined }, whole);
    expect(text).not.toContain("PLACE EVERY DURATION ON THE CLOCK");
  });
  it("ON: the field, its two edges, and the defect it exists for", () => {
    const text = withEnv({ AGENT3B_DURATION_ANCHORS: "true" }, whole);
    expect(text).toContain("PLACE EVERY DURATION ON THE CLOCK");
    expect(text).toContain('"anchor": { "at": "<id of a clock fact>", "edge": "start" | "end" }');
    expect(text).toContain("thirteen minutes past four");
  });
});

describe("run 81042 — three locked clocks and one derived interval (AGENT3_DECEPTION_PAIR)", () => {
  const device = [
    { id: "clock_chime_actual_time", value: "twenty-five minutes past three", description: "the true strike" },
    { id: "clock_chime_displayed_time", value: "a quarter to four", description: "what the face showed" },
    { id: "victim_watch_stopped_time", value: "ten minutes past three", description: "the watch" },
    { id: "clock_chime_advance_interval", value: "twenty minutes", description: "the advance", derivedFrom: ["clock_chime_displayed_time", "clock_chime_actual_time"] },
  ];

  it("OFF: neither rule prints — the shape that left the run without arithmetic or a window", () => {
    withEnv({ AGENT3_DECEPTION_PAIR: undefined, AGENT3_ALIBI_PLAN: "true" }, () => {
      expect(buildDeviceArithmeticRule(device)).toBe("");
      expect(buildAlibiPlanRule(device)).toBe("");
    });
  });

  it("ON: the arithmetic rule binds the two declared clocks, and the alibi plan prints both branches", () => {
    withEnv({ AGENT3_DECEPTION_PAIR: "true", AGENT3_ALIBI_PLAN: "true" }, () => {
      const rule = buildDeviceArithmeticRule(device);
      expect(rule).toContain("must BE those two values");
      expect(rule).toContain("twenty-five minutes past three");
      expect(rule).toContain("a quarter to four");
      expect(rule).not.toContain("ten minutes past three");
      const plan = buildAlibiPlanRule(device);
      expect((plan.match(/• if `apparent_time_of_death` is/g) ?? []).length).toBe(2);
    });
  });
});

describe("run 81042 — repair before retry (applyAlibiPlanBeforeRetry)", () => {
  const attemptOne = () => ({
    CASE: {
      culpability: { culprits: ["Ottoline Dunmore"] },
      hidden_model: { mechanism: { apparent_time_of_death: "a quarter to four", actual_time_of_death: "ten minutes past three" } },
      cast: [
        { name: "Ottoline Dunmore", alibi_window: "4:00 to 4:30 at lock-keeper's cottage" },
        { name: "Percival Thorne", alibi_window: "4:00 to 4:30 in the manor library" },
      ],
    },
  });
  const validate = (c: any) => {
    const errors = checkCaseTimelineDeception(c).map((v) => `CASE.hidden_model.mechanism (${v.code}): ${v.message}`);
    return { valid: errors.length === 0, errors };
  };

  it("renders the window around the LOCKED staged time and the case validates without a retry", () => {
    withEnv({ AGENT3_TIMELINE_WINDOW_VOCABULARY: "true", AGENT3_ALIBI_UNREADABLE_GATE: "true" }, () => {
      const cml = attemptOne();
      expect(validate(cml).errors.join(" ")).toContain("apparent_not_covered");
      const result = applyAlibiPlanBeforeRetry(cml, validate);
      expect(result.changes).toHaveLength(1);
      expect(result.changes[0]!.reason).toBe("apparent_not_covered");
      expect(result.changes[0]!.after).toContain("lock-keeper's cottage");
      expect(result.validation.valid).toBe(true);
      expect(result.note).toContain("valid, no retry spent");
      // the staged time stayed on the locked value — the thing the retry moved
      expect(cml.CASE.hidden_model.mechanism.apparent_time_of_death).toBe("a quarter to four");
      expect(cml.CASE.cast[1]!.alibi_window).toBe("4:00 to 4:30 in the manor library");
    });
  });

  it("a coherent case is left alone and reports no note", () => {
    withEnv({ AGENT3_TIMELINE_WINDOW_VOCABULARY: "true", AGENT3_ALIBI_UNREADABLE_GATE: "true" }, () => {
      const cml = attemptOne();
      cml.CASE.cast[0]!.alibi_window = "3:30 to 3:50 at lock-keeper's cottage";
      const result = applyAlibiPlanBeforeRetry(cml, validate);
      expect(result.changes).toEqual([]);
      expect(result.note).toBe("");
    });
  });

  it("the validator's own message no longer tells the model to move a locked staged time", () => {
    withEnv({ AGENT3_TIMELINE_WINDOW_VOCABULARY: "true", AGENT3_ALIBI_UNREADABLE_GATE: "true" }, () => {
      const message = validate(attemptOne()).errors.join(" ");
      expect(message).toContain("Move the culprit's alibi window so it CONTAINS the staged time");
      expect(message).not.toContain("Move the APPARENT time to somewhere inside");
    });
  });
});
