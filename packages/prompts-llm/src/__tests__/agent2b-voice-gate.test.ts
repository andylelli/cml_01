import { describe, expect, it } from "vitest";
import {
  voiceGatePass,
  buildVoiceGateFeedback,
  extractVoiceCapsule,
  type VoiceCapsuleMetrics,
  type VoiceCapsuleCheckResult,
} from "../agent2b-voice-capsule.js";

function metrics(partial: Partial<VoiceCapsuleMetrics>): VoiceCapsuleMetrics {
  return {
    count: 0,
    groundedRegisterCount: 0,
    deployableCount: 0,
    duplicatePairs: 0,
    uniqueRegisters: 0,
    ungroundedCount: 0,
    ...partial,
  };
}

describe("voiceGatePass (P1.4)", () => {
  it("passes an empty cast (nothing to gate)", () => {
    expect(voiceGatePass(metrics({ count: 0 }))).toBe(true);
    expect(voiceGatePass(null)).toBe(true);
  });

  it("passes when registers are distinct, no collisions, and all profiles deployable", () => {
    expect(
      voiceGatePass(metrics({ count: 4, uniqueRegisters: 3, duplicatePairs: 0, deployableCount: 4 })),
    ).toBe(true);
  });

  it("fails when fewer than 60% of registers are distinct", () => {
    // ceil(0.6 * 5) = 3 required; only 2 distinct.
    expect(
      voiceGatePass(metrics({ count: 5, uniqueRegisters: 2, duplicatePairs: 0, deployableCount: 5 })),
    ).toBe(false);
  });

  it("fails on any duplicate voice pair", () => {
    expect(
      voiceGatePass(metrics({ count: 4, uniqueRegisters: 4, duplicatePairs: 1, deployableCount: 4 })),
    ).toBe(false);
  });

  it("fails when a profile is not deployable", () => {
    expect(
      voiceGatePass(metrics({ count: 4, uniqueRegisters: 4, duplicatePairs: 0, deployableCount: 3 })),
    ).toBe(false);
  });
});

describe("buildVoiceGateFeedback (P1.4)", () => {
  it("builds a deduped, structured retry instruction from the checker issues", () => {
    const check: VoiceCapsuleCheckResult = {
      ok: false,
      issues: [
        { code: "no_speech_tics", severity: "error", character: "Mrs Hale", message: "no tics", feedback: "Give Mrs Hale a tic." },
        { code: "no_speech_tics", severity: "error", character: "Mrs Hale", message: "no tics", feedback: "Give Mrs Hale a tic." },
        { code: "duplicate_voice", severity: "warn", character: "Dr Voss", message: "dup", feedback: "Differentiate Dr Voss." },
      ],
      metrics: metrics({ count: 2 }),
    };
    const feedback = buildVoiceGateFeedback(check);
    expect(feedback).toContain("VOICE DISTINCTNESS RETRY");
    expect(feedback).toContain("Give Mrs Hale a tic.");
    expect(feedback).toContain("Differentiate Dr Voss.");
    // Deduped: the repeated Mrs Hale feedback appears exactly once.
    expect(feedback.match(/Give Mrs Hale a tic\./g)).toHaveLength(1);
  });
});

describe("extractVoiceCapsule — signatureTic (P1.4)", () => {
  it("leads the tic list with an explicit signatureTic", () => {
    const capsule = extractVoiceCapsule({
      name: "Lady Carradine",
      speechMannerisms: "She speaks in clipped, formal tones.",
      signatureTic: "If you say so.",
    });
    expect(capsule.speechTics[0]).toBe("If you say so.");
  });

  it("is back-compat: no signatureTic ⇒ tics derived only from speechMannerisms", () => {
    const withTic = extractVoiceCapsule({
      name: "A",
      speechMannerisms: "Answers every question with another question",
      signatureTic: "And what would you know about it?",
    });
    const withoutTic = extractVoiceCapsule({
      name: "A",
      speechMannerisms: "Answers every question with another question",
    });
    expect(withTic.speechTics[0]).toBe("And what would you know about it?");
    expect(withoutTic.speechTics).not.toContain("And what would you know about it?");
  });
});
