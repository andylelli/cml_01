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

  it("stops retry continuation when escalated", () => {
    const packet = classifyFailure({
      validationErrors: ["Template linter: opening-style entropy too low"],
      attempt: 2,
      maxRetries: 2,
      priorPackets: [],
    });

    expect(shouldContinueRetry(packet, [])).toBe(false);
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
