import { describe, expect, it } from "vitest";

import {
  classifyFailure,
  shouldContinueRetry,
  type RetryPacket,
} from "../retry-protocol.ts";

describe("retry-protocol failure class mapping", () => {
  it("maps paragraph structure failures to structure class", () => {
    const packet = classifyFailure({
      validationErrors: ["chapter.paragraphs must contain at least 4 paragraphs"],
      attempt: 1,
      maxRetries: 3,
      priorPackets: [],
    });

    expect(packet.failureClass).toBe("structure");
  });

  it("maps clue timing failures to clue_timing class", () => {
    const packet = classifyFailure({
      validationErrors: ["clue visibility incomplete: revealed without evidence anchor"],
      attempt: 1,
      maxRetries: 3,
      priorPackets: [],
    });

    expect(packet.failureClass).toBe("clue_timing");
  });

  it("maps tone and pacing signals to tone_pacing class", () => {
    const packet = classifyFailure({
      validationErrors: ["Tone pacing drift detected in chapter opening"],
      attempt: 1,
      maxRetries: 3,
      priorPackets: [],
    });

    expect(packet.failureClass).toBe("tone_pacing");
  });

  it("maps new stage and reveal contract failures to expected classes", () => {
    const stagePacket = classifyFailure({
      validationErrors: ["Stage-mode outcome failed (early_investigation): chapter must include contradiction pressure."],
      attempt: 1,
      maxRetries: 3,
      priorPackets: [],
    });
    expect(stagePacket.failureClass).toBe("fair_play");
    expect(stagePacket.failureSubcode).toBe("stage_mode_outcome");

    const dtPacket = classifyFailure({
      validationErrors: ["Discriminating test validity failed: must state competing theory and observable result."],
      attempt: 1,
      maxRetries: 3,
      priorPackets: [],
    });
    expect(dtPacket.failureClass).toBe("clue_timing");

    const revealPacket = classifyFailure({
      validationErrors: ["Final reveal completeness failed: reveal must include motive and opportunity."],
      attempt: 1,
      maxRetries: 3,
      priorPackets: [],
    });
    expect(revealPacket.failureClass).toBe("fair_play");
  });
});

describe("retry-protocol deterministic mitigation", () => {
  it("uses split_chapter after repeated completeness/structure failure", () => {
    const prior: RetryPacket = {
      attempt: 1,
      failureClass: "structure",
      failedGates: ["chapter.paragraphs"],
      mustFix: ["fix"],
      warningsToClear: [],
      maxRetries: 3,
      shouldEscalate: false,
      deterministicMitigation: { type: "none" },
    };

    const packet = classifyFailure({
      validationErrors: ["paragraph structure underflow"],
      attempt: 2,
      maxRetries: 3,
      priorPackets: [prior],
    });

    expect(packet.shouldEscalate).toBe(true);
    expect(packet.deterministicMitigation?.type).toBe("split_chapter");
  });

  it("uses tighten_obligation after repeated clue_timing failure", () => {
    const prior: RetryPacket = {
      attempt: 1,
      failureClass: "clue_timing",
      failedGates: ["clue"],
      mustFix: ["fix"],
      warningsToClear: [],
      maxRetries: 3,
      shouldEscalate: false,
      deterministicMitigation: { type: "none" },
    };

    const packet = classifyFailure({
      validationErrors: ["missing clue visibility evidence"],
      attempt: 2,
      maxRetries: 3,
      priorPackets: [prior],
    });

    expect(packet.shouldEscalate).toBe(true);
    expect(packet.deterministicMitigation?.type).toBe("tighten_obligation");
  });

  it("continues template retries when escalated before max budget", () => {
    const packet = classifyFailure({
      validationErrors: ["Template linter: opening-style entropy too low"],
      attempt: 2,
      maxRetries: 4,
      priorPackets: [],
    });

    expect(shouldContinueRetry(packet, [])).toBe(true);
  });

  it("still stops non-template retries on repeated failure class", () => {
    const packet = classifyFailure({
      validationErrors: ["chapter.paragraphs must contain at least 4 paragraphs"],
      attempt: 2,
      maxRetries: 4,
      priorPackets: [],
    });
    const prior = classifyFailure({
      validationErrors: ["chapter.paragraphs must contain at least 4 paragraphs"],
      attempt: 1,
      maxRetries: 4,
      priorPackets: [],
    });

    expect(packet.failureClass).toBe("structure");
    expect(shouldContinueRetry(packet, [prior])).toBe(false);
  });

  it("continues retries when template signals co-occur with a higher-priority class", () => {
    const prior = classifyFailure({
      validationErrors: ["missing clue visibility evidence"],
      attempt: 1,
      maxRetries: 4,
      priorPackets: [],
    });
    const packet = classifyFailure({
      validationErrors: [
        "missing clue visibility evidence",
        "Template linter: repeated long paragraph fingerprint detected",
      ],
      attempt: 2,
      maxRetries: 4,
      priorPackets: [prior],
    });

    expect(packet.failureClass).toBe("clue_timing");
    expect(packet.templateSignalPresent).toBe(true);
    expect(packet.shouldEscalate).toBe(true);
    expect(shouldContinueRetry(packet, [prior])).toBe(true);
  });

  it("adds freshenAtoms and diversifyStructure when clue_timing and template fail together", () => {
    const packet = classifyFailure({
      validationErrors: [
        "missing clue visibility evidence",
        "Template linter: repeated long paragraph fingerprint detected",
      ],
      attempt: 2,
      maxRetries: 3,
      priorPackets: [
        {
          attempt: 1,
          failureClass: "clue_timing",
          failedGates: ["clue"],
          mustFix: ["fix"],
          warningsToClear: [],
          maxRetries: 3,
          shouldEscalate: false,
          deterministicMitigation: { type: "none" },
        },
      ],
    });

    expect(packet.failureClass).toBe("clue_timing");
    expect(packet.deterministicMitigation?.type).toBe("tighten_obligation");
    expect(packet.deterministicMitigation?.params?.freshenAtoms).toBe(true);
    expect(packet.deterministicMitigation?.params?.diversifyStructure).toBe(true);
  });

  it("escalates to structural_pivot when paragraph_fingerprint fires on attempt >= 2", () => {
    const prior: RetryPacket = {
      attempt: 1,
      failureClass: "template",
      failedGates: ["paragraph fingerprint"],
      mustFix: ["fix"],
      warningsToClear: [],
      maxRetries: 4,
      shouldEscalate: false,
      deterministicMitigation: { type: "none" },
    };

    const packet = classifyFailure({
      validationErrors: [
        "Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.",
      ],
      attempt: 2,
      maxRetries: 4,
      priorPackets: [prior],
    });

    expect(packet.failureClass).toBe("template");
    expect(packet.shouldEscalate).toBe(true);
    expect(packet.deterministicMitigation?.type).toBe("structural_pivot");
  });
});
