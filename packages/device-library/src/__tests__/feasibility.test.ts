import { describe, expect, it } from "vitest";
import { checkFeasibility } from "../feasibility.js";
import { makeStubOracle } from "../era-capabilities.js";
import { loadPatterns } from "../loader.js";
import type { DevicePattern } from "../types.js";

const byId = (id: string): DevicePattern => loadPatterns().find((p) => p.pattern_id === id)!;

describe("feasibility gate (§4.3 / §9.4)", () => {
  const oracle1931 = makeStubOracle(1931);

  it("the timing patterns are feasible in 1931", () => {
    for (const id of ["clock_rewind", "recorded_presence", "delayed_poison", "hearth_release"]) {
      const r = checkFeasibility(byId(id), oracle1931);
      expect(r.feasible, `${id}: ${r.reason}`).toBe(true);
    }
  });

  it("INVARIANT: a feasible device's requires ⊆ era capabilities (no anachronistic dependency)", () => {
    for (const pattern of loadPatterns()) {
      const r = checkFeasibility(pattern, oracle1931);
      if (r.feasible) {
        for (const cap of pattern.feasibility.requires) {
          expect(oracle1931.isAvailable(cap), `${pattern.pattern_id} requires ${cap}`).toBe(true);
        }
      }
    }
  });

  it("INVARIANT: requires ∩ forbids = ∅ for every seed pattern (no malformed patterns)", () => {
    for (const pattern of loadPatterns()) {
      expect(checkFeasibility(pattern, makeStubOracle(1931)).internalConflicts, pattern.pattern_id).toEqual([]);
    }
  });

  it("rejects a device whose required capability the era lacks (gramophone trick in 1880)", () => {
    const r = checkFeasibility(byId("recorded_presence"), makeStubOracle(1880));
    expect(r.feasible).toBe(false);
    expect(r.missingRequires).toContain("sound_recording_playback");
  });

  it("rejects a device the era DEFEATS (recorded-voice alibi once voice authentication exists)", () => {
    const r = checkFeasibility(byId("recorded_presence"), makeStubOracle(2000));
    expect(r.feasible).toBe(false);
    expect(r.defeatedByEra).toContain("voice_authentication");
  });

  it("rejects an invented device that cites a 1980s capability in 1931 (DNA)", () => {
    const bad: DevicePattern = {
      ...byId("substituted_identity"),
      pattern_id: "dna_anachronism",
      feasibility: { eras: [1930], requires: ["dna_profiling"], forbids: [] },
    };
    expect(checkFeasibility(bad, makeStubOracle(1931)).feasible).toBe(false);
  });

  it("the gate is NOT inert: it rejects at least one seed pattern in an off-era (§6)", () => {
    const rejectedIn1880 = loadPatterns().filter((p) => !checkFeasibility(p, makeStubOracle(1880)).feasible);
    expect(rejectedIn1880.length).toBeGreaterThan(0);
  });
});
