/**
 * REVIEW_04 §11.2 B1 — binding the case's temporal anchors to the times the story will print.
 *
 * THE DEFECT. Agent 3b designs the hard-logic device, locks its facts, and the prose injector prints
 * them verbatim. Agent 3 authors `hidden_model.mechanism.{apparent,actual}_time_of_death` from a
 * prompt that has never seen them. MEASURED on the 2026-08-04 run: the case said "quarter past eight"
 * / "quarter past seven"; the manuscript printed "a quarter to four" (5×) and "ten minutes past four"
 * (6×). **Neither of the case's anchors appeared anywhere in the finished story.**
 */

import { describe, expect, it } from "vitest";

import { buildCMLPrompt, isDeviceTimeBindingEnabled } from "../agent3-cml.js";
import type { CMLPromptInputs } from "../types.js";

const DEVICE_FACTS = [
  { id: "freeze_duration", value: "thirty-five minutes", description: "Exact duration the pendulum was immobilized" },
  { id: "false_time_displayed", value: "a quarter to four", description: "Clock time shown during the pendulum freeze" },
  { id: "resumption_time", value: "ten minutes past four", description: "Time when the pendulum resumed swinging" },
];

const baseInputs: CMLPromptInputs = {
  decade: "1930s",
  location: "A seaside hotel",
  institution: "Hotel",
  tone: "Classic Golden Age",
  weather: "Rain",
  socialStructure: "Rigid class hierarchy",
  primaryAxis: "temporal",
  castSize: 5,
  castNames: ["Eleanor Voss", "Hugo Vane", "Beatrice Quill", "Ivor Hale", "Sylvia Trent"],
  detectiveType: "Amateur",
  victimArchetype: "Sylvia Trent",
  complexityLevel: "moderate",
  mechanismFamilies: ["clock manipulation"],
  runId: "device-time-binding-test",
  projectId: "test",
};

const withFlag = <T>(value: string | undefined, fn: () => T): T => {
  const saved = process.env.AGENT3_DEVICE_TIME_BINDING;
  if (value === undefined) delete process.env.AGENT3_DEVICE_TIME_BINDING;
  else process.env.AGENT3_DEVICE_TIME_BINDING = value;
  try {
    return fn();
  } finally {
    if (saved === undefined) delete process.env.AGENT3_DEVICE_TIME_BINDING;
    else process.env.AGENT3_DEVICE_TIME_BINDING = saved;
  }
};

describe("AGENT3_DEVICE_TIME_BINDING", () => {
  it("is off unless explicitly enabled, and read at runtime", () => {
    expect(isDeviceTimeBindingEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isDeviceTimeBindingEnabled({ AGENT3_DEVICE_TIME_BINDING: "true" } as NodeJS.ProcessEnv)).toBe(true);
    expect(isDeviceTimeBindingEnabled({ AGENT3_DEVICE_TIME_BINDING: "1" } as NodeJS.ProcessEnv)).toBe(true);
    for (const off of ["", "0", "false", "no"]) {
      expect(isDeviceTimeBindingEnabled({ AGENT3_DEVICE_TIME_BINDING: off } as NodeJS.ProcessEnv)).toBe(false);
    }
  });

  it("leaves the prompt byte-identical when off, even with locked facts present", () => {
    const off = withFlag(undefined, () => buildCMLPrompt({ ...baseInputs, lockedFacts: DEVICE_FACTS }));
    const none = withFlag(undefined, () => buildCMLPrompt(baseInputs));
    expect(off.developer).toBe(none.developer);
    expect(off.developer).not.toContain("Device Locked Facts");
  });

  it("leaves the prompt byte-identical when on but no locked facts exist", () => {
    // `enableLockedFactRegistry` may be off, or the device may lock nothing. Self-gating either way.
    const on = withFlag("true", () => buildCMLPrompt(baseInputs));
    const off = withFlag(undefined, () => buildCMLPrompt(baseInputs));
    expect(on.developer).toBe(off.developer);
  });

  it("binds the apparent time to the locked displayed time when on", () => {
    const prompt = withFlag("true", () => buildCMLPrompt({ ...baseInputs, lockedFacts: DEVICE_FACTS }));
    expect(prompt.developer).toContain("Device Locked Facts");
    expect(prompt.developer).toContain('false_time_displayed = "a quarter to four"');
    expect(prompt.developer).toMatch(/apparent_time_of_death` MUST equal that value/);
  });

  it("constrains the true time and the alibi windows to the same clock", () => {
    const prompt = withFlag("true", () => buildCMLPrompt({ ...baseInputs, lockedFacts: DEVICE_FACTS }));
    // The residual the deterministic detector cannot safely derive: `resumption_time` is when the
    // mechanism restarted, not when anyone died. The model can reason about it; a mapping cannot.
    expect(prompt.developer).toMatch(/actual_time_of_death` must be consistent with the same device timeline/);
    expect(prompt.developer).toMatch(/alibi_window` must sit on that same clock/);
  });

  it("asks for the locked values' own word-form, because the prose reproduces them exactly", () => {
    const prompt = withFlag("true", () => buildCMLPrompt({ ...baseInputs, lockedFacts: DEVICE_FACTS }));
    expect(prompt.developer).toMatch(/two spellings of one hour read to a reader as two different times/);
  });

  it("ignores malformed locked facts rather than emitting a half-written rule", () => {
    const prompt = withFlag("true", () =>
      buildCMLPrompt({ ...baseInputs, lockedFacts: [{ id: "", value: "" }, { id: "x", value: "" }] as any }),
    );
    expect(prompt.developer).not.toContain("Device Locked Facts");
  });
});
