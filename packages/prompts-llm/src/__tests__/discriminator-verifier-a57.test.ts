import { describe, expect, it } from "vitest";
import { verifyDiscriminator } from "../discriminator-verifier.js";

// A_57 §9.2 — the discriminator verifier confirms the test partitions the suspects soundly: the culprit is
// the unique survivor, every other suspect is eliminated, and at least one planted clue is cited. It must
// catch the real unsound-case failure modes without false-firing on a well-formed case.

describe("verifyDiscriminator (A_57 §9.2)", () => {
  it("passes a sound partition: culprit named, all others eliminated, clues cited", () => {
    const verdict = verifyDiscriminator({
      culprits: ["Edward Marwood"],
      suspects: ["Edward Marwood", "Daphne Sinclair", "Charles Whitmore"],
      eliminatedSuspects: ["Daphne Sinclair", "Charles Whitmore"],
      evidenceClueCount: 3,
    });
    expect(verdict).toEqual({ sound: true, issues: [] });
  });

  it("flags a suspect who is neither the culprit nor eliminated (not fair-play)", () => {
    const verdict = verifyDiscriminator({
      culprits: ["Edward Marwood"],
      suspects: ["Edward Marwood", "Daphne Sinclair", "Charles Whitmore"],
      eliminatedSuspects: ["Daphne Sinclair"], // Charles left unaccounted
      evidenceClueCount: 2,
    });
    expect(verdict.sound).toBe(false);
    expect(verdict.issues.some((i) => i.kind === "suspect_unaccounted" && i.detail.includes("Charles Whitmore"))).toBe(true);
  });

  it("flags the test eliminating its own culprit (self-contradicting partition)", () => {
    const verdict = verifyDiscriminator({
      culprits: ["Edward Marwood"],
      suspects: ["Edward Marwood", "Daphne Sinclair"],
      eliminatedSuspects: ["Edward Marwood", "Daphne Sinclair"],
      evidenceClueCount: 1,
    });
    expect(verdict.sound).toBe(false);
    expect(verdict.issues.some((i) => i.kind === "culprit_eliminated")).toBe(true);
  });

  it("flags a test that cites no planted clue (not reconstructable)", () => {
    const verdict = verifyDiscriminator({
      culprits: ["Edward Marwood"],
      suspects: ["Edward Marwood", "Daphne Sinclair"],
      eliminatedSuspects: ["Daphne Sinclair"],
      evidenceClueCount: 0,
    });
    expect(verdict.sound).toBe(false);
    expect(verdict.issues.some((i) => i.kind === "no_evidence_clues")).toBe(true);
  });

  it("flags a missing culprit", () => {
    const verdict = verifyDiscriminator({
      culprits: [],
      suspects: ["Daphne Sinclair"],
      eliminatedSuspects: ["Daphne Sinclair"],
      evidenceClueCount: 1,
    });
    expect(verdict.sound).toBe(false);
    expect(verdict.issues.some((i) => i.kind === "no_culprit")).toBe(true);
  });

  it("is case/whitespace-insensitive when matching culprit against the eliminated set", () => {
    const verdict = verifyDiscriminator({
      culprits: ["Edward Marwood"],
      suspects: ["Edward Marwood", "Daphne Sinclair"],
      eliminatedSuspects: ["  daphne sinclair  ", "EDWARD MARWOOD"],
      evidenceClueCount: 1,
    });
    expect(verdict.issues.some((i) => i.kind === "culprit_eliminated")).toBe(true);
  });
});
