import { describe, expect, it } from "vitest";

import { hasActiveUse, isKillVerbObject } from "../character-lifecycle-validator.js";

/**
 * A_90 §14 — run 10845's shipped book. The accusation named the victim as the object of the killing
 * and a dialogue tag two words later made him a live speaker, so the canonical-victim rescue framed
 * the line and the reader met "In a remembered moment, "You killed Oswald Ingram," Gerald said…".
 * `isConfessionKillObject` already made this judgement for "I killed <name>"; the subject was never
 * the point.
 */
const SHIPPED =
  '"You killed Oswald Ingram," Gerald said quietly, "by stabbing him with a corkscrew in the timber-framed room."';

describe("isKillVerbObject — a name after a kill verb is that verb's victim", () => {
  it("catches the line that shipped, for the full name and the surname", () => {
    expect(isKillVerbObject(SHIPPED, "Oswald Ingram")).toBe(true);
    expect(isKillVerbObject(SHIPPED, "Ingram")).toBe(true);
  });

  it("catches every subject, not only the first person A_61 met", () => {
    for (const subject of ["I", "You", "He", "She", "They", "Someone", "Nobody"]) {
      expect(isKillVerbObject(`${subject} killed Oswald Ingram that night.`, "Oswald Ingram"), subject).toBe(true);
    }
    expect(isKillVerbObject("You strangled Oswald Ingram in the cellar.", "Oswald Ingram")).toBe(true);
  });

  it("leaves the victim as SUBJECT alone — that is a real live appearance", () => {
    expect(isKillVerbObject("Oswald Ingram killed the lamp and left.", "Oswald Ingram")).toBe(false);
    expect(isKillVerbObject("Oswald Ingram said the brewery was finished.", "Oswald Ingram")).toBe(false);
  });

  it("does not fire for a different character named in the same sentence", () => {
    expect(isKillVerbObject(SHIPPED, "Gerald Jardine")).toBe(false);
  });
});

describe("hasActiveUse — the rescue's predicate no longer sees a live victim", () => {
  it("the shipped accusation is not a live appearance of the victim", () => {
    expect(hasActiveUse(SHIPPED, "Oswald Ingram")).toBe(false);
  });

  it("but a genuine live appearance still is", () => {
    expect(hasActiveUse("Oswald Ingram entered the room and said nothing.", "Oswald Ingram")).toBe(true);
    expect(hasActiveUse('"The brewery is mine," Oswald Ingram said.', "Oswald Ingram")).toBe(true);
  });

  /**
   * The first cut of the guard used a bare 30-character window and suppressed the SPEAKER of the
   * accusation too, because "Oswald Ingram," sits inside those 30 characters. The window now stops
   * at the clause — no comma, semicolon, colon or quote between the verb and the name.
   */
  it("and the speaker of the accusation is still live", () => {
    expect(isKillVerbObject('"You killed Oswald Ingram," Gerald Jardine said quietly.', "Gerald Jardine")).toBe(false);
    expect(hasActiveUse('"You killed Oswald Ingram," Gerald Jardine said quietly.', "Gerald Jardine")).toBe(true);
  });
});
