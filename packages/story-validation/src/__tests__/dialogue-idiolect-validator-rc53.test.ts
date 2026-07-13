import { describe, expect, it } from "vitest";
import { validateDialogueIdiolect } from "../dialogue-idiolect-validator.js";

// A_61 RC5.3 — deterministic dialogue-distinctiveness gate: coverage (warn) + cross-speaker leakage (error).

const capsules = [
  { name: "Beatrice Quill", speechTics: ["as it happens"] },
  { name: "Hugo Vane", speechTics: ["I should think"] },
];

describe("validateDialogueIdiolect — coverage (warn-only)", () => {
  it("no coverage issue when each speaker uses their tic", () => {
    const prose =
      '"As it happens, I was in the garden," said Beatrice Quill. ' +
      '"I should think that unlikely," Hugo Vane replied.';
    const r = validateDialogueIdiolect(capsules, prose);
    expect(r.ok).toBe(true);
    expect(r.issues.filter((i) => i.type === "voice_tic_missing")).toHaveLength(0);
    expect(r.metrics.speakersWithTic).toBe(2);
  });

  it("warns (does not fail) when an attributed speaker never uses their tic", () => {
    const prose =
      '"I was in the garden," said Beatrice Quill. ' +   // no tic
      '"I should think that unlikely," Hugo Vane replied.';
    const r = validateDialogueIdiolect(capsules, prose);
    expect(r.ok).toBe(true); // coverage is warn-only
    expect(r.issues.some((i) => i.type === "voice_tic_missing" && i.speaker === "Beatrice Quill")).toBe(true);
  });
});

describe("validateDialogueIdiolect — leakage (error, ok=false)", () => {
  it("flags a tic spoken by the WRONG character as a voice-swap", () => {
    const prose =
      '"As it happens, I was in the garden," said Beatrice Quill. ' +
      '"As it happens, so was I," said Hugo Vane.'; // Beatrice's tic in Hugo's mouth
    const r = validateDialogueIdiolect(capsules, prose);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.type === "voice_tic_leakage" && i.speaker === "Hugo Vane")).toBe(true);
    expect(r.metrics.ticLeakagePairs).toBeGreaterThan(0);
  });

  it("carries the leaked tic + owner on the issue (what the RC5.3 regen pass consumes)", () => {
    const prose =
      '"As it happens, I was in the garden," said Beatrice Quill. ' +
      '"As it happens, so was I," said Hugo Vane.';
    const leak = validateDialogueIdiolect(capsules, prose).issues.find((i) => i.type === "voice_tic_leakage");
    expect(leak?.tic).toBe("as it happens"); // normalized — the regen probe matches case-insensitively
    expect(leak?.owner).toBe("Beatrice Quill");
    expect(leak?.speaker).toBe("Hugo Vane");
  });

  it("does NOT flag leakage when two speakers keep distinct tics", () => {
    const prose =
      '"As it happens, I was in the garden," said Beatrice Quill. ' +
      '"I should think that unlikely," Hugo Vane replied.';
    expect(validateDialogueIdiolect(capsules, prose).metrics.ticLeakagePairs).toBe(0);
  });
});

describe("validateDialogueIdiolect — robustness", () => {
  it("empty capsules or prose → ok, nothing to gate", () => {
    expect(validateDialogueIdiolect([], "some prose").ok).toBe(true);
    expect(validateDialogueIdiolect(capsules, "").ok).toBe(true);
  });

  it("skips ambiguous attribution (two names near the quote) rather than misattributing", () => {
    // Both names appear in the window → conservative skip, no leakage error, no false coverage.
    const prose = '"As it happens," Beatrice Quill told Hugo Vane, "we should go."';
    const r = validateDialogueIdiolect(capsules, prose);
    expect(r.ok).toBe(true);
    expect(r.metrics.ticLeakagePairs).toBe(0);
  });

  // Review fix — an ADDRESSEE named after the quote must not be treated as the speaker.
  it("does NOT misattribute a pronoun-speaker line to the addressee (no false leakage on good prose)", () => {
    // Speaker is "she" (Beatrice); "Vane" is only the addressee. Beatrice's tic is in the quote.
    const prose = '"As it happens, I saw nothing," she said to Vane.';
    const r = validateDialogueIdiolect(capsules, prose);
    expect(r.ok).toBe(true); // NOT flagged as Hugo speaking Beatrice's tic
    expect(r.metrics.ticLeakagePairs).toBe(0);
  });
});
