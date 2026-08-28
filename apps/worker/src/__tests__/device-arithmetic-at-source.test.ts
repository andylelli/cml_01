/**
 * X38-AT-SOURCE — the repair, at the call site that owns the registry.
 *
 * THE RULE THIS FILE EXISTS TO HOLD: **a detector may guess; a repairer may not.**
 *
 * The first draft of `reconcileDeviceArithmetic` rewrote whichever locked fact parsed as a duration,
 * on the reasoning that an interval is always the derived quantity. That is true of all 24 archived
 * devices — and all 24 are clock-family (pendulum, bell, sundial, hourglass, escapement). It is false
 * for families this pipeline actively asks for: a poison's onset, a tide's period and a fuse's burn
 * are physical constants, and there the TIMES must move instead. A locked fact reaches the page
 * verbatim, so that repair would have silently corrupted the mechanism of any such story.
 *
 * The pass therefore rewrites nothing the device has not declared derived. The tests below are in two
 * halves: it repairs a declared consequence, and it refuses everything else — including the exact
 * archived registries it used to "fix".
 *
 * Fixtures are archived devices, quoted verbatim from apps/worker/logs/locked-facts-*.json.
 */

import { describe, expect, it } from "vitest";
import { checkCaseTimeCoherence } from "@cml/cml";

import { reconcileDeviceArithmetic } from "../jobs/agents/agent3b-run.js";
import type { OrchestratorContext, LockedFact } from "../jobs/agents/shared.js";

const makeCtx = (registry: LockedFact[]) =>
  ({ lockedFactRegistry: registry, warnings: [] as string[] }) as unknown as OrchestratorContext;

const warningsOf = (ctx: OrchestratorContext) => (ctx as unknown as { warnings: string[] }).warnings;
const registryOf = (ctx: OrchestratorContext) =>
  (ctx as unknown as { lockedFactRegistry: LockedFact[] }).lockedFactRegistry;

const fact = (id: string, value: string, derivedFrom?: string[]): LockedFact => ({
  id, value, description: "", ...(derivedFrom ? { derivedFrom } : {}),
});

describe("reconcileDeviceArithmetic — repairs ONLY what the device declared derived", () => {
  it("closes mystery-1786998999620 once the interval declares its two sources", () => {
    // 8:45 and 8:20 are 25 apart, under an interval declaring twenty.
    const ctx = makeCtx([
      fact("tampering_time", "a quarter to nine"),
      fact("murder_time_displayed", "twenty minutes past eight"),
      fact("backward_shift_duration", "twenty minutes", ["tampering_time", "murder_time_displayed"]),
    ]);

    reconcileDeviceArithmetic(ctx);

    expect(registryOf(ctx)[2]!.value).toBe("twenty-five minutes");
    expect(checkCaseTimeCoherence({ lockedFacts: registryOf(ctx) })).toEqual([]);
  });

  it("leaves both declared SOURCES exactly as authored", () => {
    const ctx = makeCtx([
      fact("false_time_displayed", "a quarter to four"),
      fact("resumption_time", "ten minutes past four"),
      fact("freeze_duration", "thirty-five minutes", ["false_time_displayed", "resumption_time"]),
    ]);

    reconcileDeviceArithmetic(ctx);

    expect(registryOf(ctx)[0]!.value).toBe("a quarter to four");
    expect(registryOf(ctx)[1]!.value).toBe("ten minutes past four");
    expect(registryOf(ctx)[2]!.value).toBe("twenty-five minutes");
  });

  it("repairs a TIME when the time is the declared consequence — the poison-device direction", () => {
    // The interval is fixed by the compound and carries no derivedFrom; the time follows from it.
    // The archive contains no device of this shape, which is precisely why it is tested.
    const ctx = makeCtx([
      fact("collapse_time", "a quarter to nine"),
      fact("onset_duration", "forty minutes"),
      fact("dose_administered_time", "twenty minutes past eight", ["collapse_time", "onset_duration"]),
    ]);

    reconcileDeviceArithmetic(ctx);

    // Not actionable by this pass: the declared relation is time-from-(time, interval), not an
    // interval between two clock positions. It must decline in SILENCE, never guess, and above all
    // never fall back to rewriting the constant.
    expect(registryOf(ctx)[1]!.value).toBe("forty minutes");
    expect(registryOf(ctx)[2]!.value).toBe("twenty minutes past eight");
  });

  it("keeps the fact's id, description, position and declaration", () => {
    const ctx = makeCtx([
      { id: "tampering_time", value: "a quarter to nine", description: "when the case was opened" },
      { id: "murder_time_displayed", value: "twenty minutes past eight", description: "the clock face" },
      {
        id: "backward_shift_duration", value: "twenty minutes",
        description: "how far the hands were set back",
        derivedFrom: ["tampering_time", "murder_time_displayed"],
      },
    ]);

    reconcileDeviceArithmetic(ctx);

    const repaired = registryOf(ctx)[2]!;
    expect(repaired.id).toBe("backward_shift_duration");
    expect(repaired.description).toBe("how far the hands were set back");
    expect(repaired.derivedFrom).toEqual(["tampering_time", "murder_time_displayed"]);
    expect(registryOf(ctx)).toHaveLength(3);
  });

  it("says what it did and why it was allowed to — a silent rewrite of a locked fact is not auditable", () => {
    const ctx = makeCtx([
      fact("tampering_time", "a quarter to nine"),
      fact("murder_time_displayed", "twenty minutes past eight"),
      fact("backward_shift_duration", "twenty minutes", ["tampering_time", "murder_time_displayed"]),
    ]);

    reconcileDeviceArithmetic(ctx);

    const note = warningsOf(ctx).find((w) => w.includes("[X38]"));
    expect(note).toBeDefined();
    expect(note).toContain("declares itself derived from");
    expect(note).toContain("twenty minutes");
    expect(note).toContain("twenty-five minutes");
  });

  it("does nothing to a declared relation that already holds", () => {
    const registry = [
      fact("clock_face_time", "a quarter to nine"),
      fact("chime_time", "twenty-five minutes past eight"),
      fact("shift_duration", "twenty minutes", ["clock_face_time", "chime_time"]),
    ];
    const ctx = makeCtx(registry.map((f) => ({ ...f })));

    reconcileDeviceArithmetic(ctx);

    expect(registryOf(ctx)).toEqual(registry);
    expect(warningsOf(ctx)).toEqual([]);
  });
});

describe("reconcileDeviceArithmetic — refuses everything it was not licensed to touch", () => {
  // Every archived registry that the old pass rewrote. None declares derivedFrom, because the field
  // did not exist when they were authored. All must now come back untouched.
  const archived: Array<[string, LockedFact[]]> = [
    ["mystery-1785860662362", [
      fact("false_time_displayed", "a quarter to four"),
      fact("resumption_time", "ten minutes past four"),
      fact("freeze_duration", "thirty-five minutes"),
    ]],
    ["mystery-1786821276166", [
      fact("murder_time_displayed", "a quarter past seven in the evening"),
      fact("chime_recorded_time", "five minutes past seven in the evening"),
      fact("pendulum_delay_duration", "fourteen minutes"),
    ]],
    ["mystery-1786999938275", [
      fact("clock_face_time_at_murder", "a quarter to three"),
      fact("hotel_bell_chime_time", "twenty minutes past two"),
      fact("pendulum_reversal_duration", "twenty minutes"),
    ]],
  ];

  it.each(archived)("leaves %s untouched — no declaration, no licence", (_runId, registry) => {
    const ctx = makeCtx(registry.map((f) => ({ ...f })));

    reconcileDeviceArithmetic(ctx);

    expect(registryOf(ctx)).toEqual(registry);
    expect(warningsOf(ctx)).toEqual([]);
    // ...and the DETECTOR still says so. Coverage is not lost, only the silent write.
    expect(checkCaseTimeCoherence({ lockedFacts: registryOf(ctx) }).map((v) => v.code))
      .toContain("locked_time_arithmetic");
  });

  it("refuses a declaration naming an id that is not in the registry", () => {
    const ctx = makeCtx([
      fact("tampering_time", "a quarter to nine"),
      fact("shift_duration", "twenty minutes", ["tampering_time", "no_such_fact"]),
    ]);

    reconcileDeviceArithmetic(ctx);

    expect(registryOf(ctx)[1]!.value).toBe("twenty minutes");
    expect(warningsOf(ctx).join(" ")).toContain("not in the registry");
  });

  it("refuses a declaration that does not name exactly two sources", () => {
    for (const sources of [[], ["a"], ["a", "b", "c"]]) {
      const ctx = makeCtx([
        fact("a", "a quarter to nine"),
        fact("b", "twenty minutes past eight"),
        fact("c", "ten minutes past ten"),
        fact("d", "twenty minutes", sources),
      ]);
      reconcileDeviceArithmetic(ctx);
      expect(registryOf(ctx)[3]!.value, `sources=${JSON.stringify(sources)}`).toBe("twenty minutes");
    }
  });

  it("refuses a zero-length interval rather than writing a nonsense duration", () => {
    const ctx = makeCtx([
      fact("clock_face_time", "a quarter to nine"),
      fact("chime_time", "a quarter to nine"),
      fact("shift_duration", "twenty minutes", ["clock_face_time", "chime_time"]),
    ]);

    reconcileDeviceArithmetic(ctx);

    expect(registryOf(ctx)[2]!.value).toBe("twenty minutes");
    expect(warningsOf(ctx).join(" ")).toContain("NOT repaired");
  });

  it("measures a midnight-straddling pair the short way round", () => {
    // parseClockTime is dial-relative (0..719), so a plain subtraction made 11:50 and 12:10 read as
    // 700 minutes apart instead of twenty. Every gap site now goes through dialGapMinutes. This case
    // is COHERENT and the pass must do nothing at all — before the fix it declined with a warning,
    // which was the right refusal for the wrong reason.
    const ctx = makeCtx([
      fact("chime_time", "ten minutes to twelve"),
      fact("discovery_time", "ten minutes past twelve"),
      fact("delay_duration", "twenty minutes", ["chime_time", "discovery_time"]),
    ]);

    reconcileDeviceArithmetic(ctx);

    expect(registryOf(ctx)[2]!.value).toBe("twenty minutes");
    expect(warningsOf(ctx)).toEqual([]);
  });

  it("repairs a midnight-straddling pair that genuinely disagrees", () => {
    const ctx = makeCtx([
      fact("chime_time", "ten minutes to twelve"),
      fact("discovery_time", "ten minutes past twelve"),
      fact("delay_duration", "forty minutes", ["chime_time", "discovery_time"]),
    ]);

    reconcileDeviceArithmetic(ctx);

    expect(registryOf(ctx)[2]!.value).toBe("twenty minutes");
  });

  it("survives an absent or empty registry — the flag that builds it is optional", () => {
    expect(() => reconcileDeviceArithmetic(makeCtx([]))).not.toThrow();
    const absent = { warnings: [] as string[] } as unknown as OrchestratorContext;
    expect(() => reconcileDeviceArithmetic(absent)).not.toThrow();
  });

  it("ignores a registry with no temporal facts in it at all", () => {
    const registry = [fact("distance_to_latch", "sixteen feet"), fact("wire_gauge", "two inches")];
    const ctx = makeCtx(registry.map((f) => ({ ...f })));

    reconcileDeviceArithmetic(ctx);

    expect(registryOf(ctx)).toEqual(registry);
    expect(warningsOf(ctx)).toEqual([]);
  });
});

describe("the repair reaches the DEVICE, not only the registry", () => {
  /**
   * MEASURED on run `canary_1787953182108`, external read 85/100 and the reader's number-one issue.
   * This pass restated `signal_window_duration` from "thirty-five minutes" to "fifty minutes", the CML
   * carried the corrected value -- and the MANUSCRIPT said "thirty-five minutes" EIGHT times and
   * "fifty minutes" not once.
   *
   * One value, two bodies: the pass mutated ctx.lockedFactRegistry while the device it was read from
   * still held the old string, and BOTH go downstream. The writer reads the device.
   *
   *   reader: "But 10:40 to 11:30 is 50 minutes, not 35... the arithmetic needs correcting"
   *           "with the tide arithmetic fixed ... this could reach 90-92/100"
   */
  const registry = (): LockedFact[] => ([
    { id: "lantern_last_visible_time", value: "twenty minutes to eleven at night", description: "d" },
    { id: "high_tide_time", value: "half past eleven at night", description: "d" },
    {
      id: "signal_window_duration",
      value: "thirty-five minutes",
      description: "d",
      derivedFrom: ["lantern_last_visible_time", "high_tide_time"],
    },
  ] as unknown as LockedFact[]);

  const ctxWithDevice = (facts: LockedFact[], deviceFacts: any[]) =>
    ({
      lockedFactRegistry: facts,
      warnings: [] as string[],
      hardLogicDevices: { devices: [{ title: "Lantern", lockedFacts: deviceFacts }] },
    }) as unknown as OrchestratorContext;

  it("writes the corrected value back to the device's own lockedFacts", () => {
    const deviceFacts = [
      { id: "high_tide_time", value: "half past eleven at night" },
      { id: "signal_window_duration", value: "thirty-five minutes" },
    ];
    const ctx = ctxWithDevice(registry(), deviceFacts);
    reconcileDeviceArithmetic(ctx);

    // The registry was already repaired before this change; the DEVICE is what was being missed.
    expect(registryOf(ctx).find((f) => f.id === "signal_window_duration")?.value).toBe("fifty minutes");
    expect(deviceFacts[1].value).toBe("fifty minutes");
    // Untouched sources stay untouched, in the device as in the registry.
    expect(deviceFacts[0].value).toBe("half past eleven at night");
  });

  it("says how many device facts it reached, and says so loudly when it reached none", () => {
    // A silent zero here is the whole defect: the run reported a repair while the page kept the old
    // number eight times.
    const ctx = ctxWithDevice(registry(), [{ id: "signal_window_duration", value: "some other wording" }]);
    reconcileDeviceArithmetic(ctx);
    const said = warningsOf(ctx).join(" ");
    expect(said).toContain("Written back to 0 device fact(s)");
    expect(said).toContain("the prose will use it");
  });

  it("touches only the fact it rewrote, matched by id", () => {
    const deviceFacts = [
      { id: "signal_window_duration", value: "thirty-five minutes" },
      { id: "unrelated_duration", value: "thirty-five minutes" },
    ];
    reconcileDeviceArithmetic(ctxWithDevice(registry(), deviceFacts));
    expect(deviceFacts[0].value).toBe("fifty minutes");
    // Same string, different fact — a blind search-and-replace would have corrupted this.
    expect(deviceFacts[1].value).toBe("thirty-five minutes");
  });

  it("does not crash when the run carries no device artifact", () => {
    const ctx = ({ lockedFactRegistry: registry(), warnings: [] as string[] }) as unknown as OrchestratorContext;
    expect(() => reconcileDeviceArithmetic(ctx)).not.toThrow();
    expect(registryOf(ctx).find((f) => f.id === "signal_window_duration")?.value).toBe("fifty minutes");
  });
});
