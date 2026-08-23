/**
 * The suspect-clearance fold, on a real outline shape — X32's repair half.
 *
 * WHY THIS IS THE ONE TO GET RIGHT. `pacing` is one of five categories that has **never been given a 9
 * in 34 external reads** (`npm run ledger:external-read -- --gaps`), and it is the only one of the five
 * carrying a named, repairable defect. Four of the top eight manuscripts say the same thing:
 *
 *     "Good final trap; Chapter 9 repeats clearances after they are already resolved."
 *     "Builds well; Chapter 10 still repeats some of Chapter 9."
 *
 * The detection has existed since 2026-08-19 (X32). What did not exist was a repair that costs nothing:
 * the flag raised an outline ISSUE, which drives an outline RETRY, and 11 of 32 archived outlines
 * allocate the job more than once — so the lever asked for a third of all runs to re-roll their outline
 * to fix a defect a re-roll may reproduce. That is why it has been default-OFF since 2026-07-24.
 *
 * These tests pin the deterministic replacement: the gate marks WHICH scene owns the clearance job, and
 * says nothing at all when the outline only allocates it once.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { applySuspectClearanceGate } from "../agent7-run.js";

/** A scene with clearance language: elimination terms AND evidence terms, which is what X32 counts. */
const clearingScene = (n: number, beat?: string) => ({
  sceneNumber: n,
  beat,
  title: "Clearing the Others",
  purpose: "The detective rules out the remaining suspects; their alibis are confirmed by the timeline evidence.",
});

/** A scene with no clearance job at all. */
const plainScene = (n: number, beat?: string) => ({
  sceneNumber: n,
  beat,
  title: "First Enquiries",
  purpose: "The detective walks the corridor and notes what the staff remember of the evening.",
});

const outlineOf = (scenes: any[][]) => ({
  acts: scenes.map((sceneList, i) => ({ actNumber: i + 1, scenes: sceneList })),
}) as any;

const ctxOf = () => ({ warnings: [] as string[] }) as any;

describe("applySuspectClearanceGate", () => {
  const original = process.env.AGENT9_FOLD_SUSPECT_CLEARANCES;
  beforeEach(() => {
    delete process.env.AGENT9_FOLD_SUSPECT_CLEARANCES;
  });
  afterEach(() => {
    if (original === undefined) delete process.env.AGENT9_FOLD_SUSPECT_CLEARANCES;
    else process.env.AGENT9_FOLD_SUSPECT_CLEARANCES = original;
  });

  /** The 08-19 shape: clearances in ch6, again in ch9, and a third time in ch10 after the confession. */
  const threePassOutline = () =>
    outlineOf([
      [plainScene(1), plainScene(2), plainScene(3)],
      [plainScene(4), plainScene(5), clearingScene(6)],
      [plainScene(7), plainScene(8, "final_trap"), clearingScene(9, "revelation"), clearingScene(10)],
    ]);

  it("does nothing at all with the flag off — the default run is byte-identical", () => {
    const narrative = threePassOutline();
    const ctx = ctxOf();
    applySuspectClearanceGate(ctx, narrative);
    for (const act of narrative.acts) {
      for (const scene of act.scenes) expect(scene).not.toHaveProperty("suspectClearanceAllowed");
    }
    expect(ctx.warnings).toEqual([]);
  });

  it("folds the clearances into the reveal and suppresses the other two", () => {
    process.env.AGENT9_FOLD_SUSPECT_CLEARANCES = "true";
    const narrative = threePassOutline();
    const ctx = ctxOf();
    applySuspectClearanceGate(ctx, narrative);

    const flat = narrative.acts.flatMap((a: any) => a.scenes);
    const byNumber = (n: number) => flat.find((s: any) => s.sceneNumber === n);
    expect(byNumber(9).suspectClearanceAllowed).toBe(true); // the revelation keeps the job
    expect(byNumber(6).suspectClearanceAllowed).toBe(false);
    expect(byNumber(10).suspectClearanceAllowed).toBe(false); // the post-confession repeat
    expect(ctx.warnings.join(" ")).toMatch(/\[X32\] Suspect-clearance fold: 3 scenes/);
  });

  it("leaves every scene without a clearance job unmarked", () => {
    process.env.AGENT9_FOLD_SUSPECT_CLEARANCES = "true";
    const narrative = threePassOutline();
    applySuspectClearanceGate(ctxOf(), narrative);
    const flat = narrative.acts.flatMap((a: any) => a.scenes);
    for (const n of [1, 2, 3, 4, 5, 7, 8]) {
      expect(flat.find((s: any) => s.sceneNumber === n), `scene ${n}`).not.toHaveProperty("suspectClearanceAllowed");
    }
  });

  it("is inert on the CORRECT shape — one clearance scene stays unmarked", () => {
    process.env.AGENT9_FOLD_SUSPECT_CLEARANCES = "true";
    const narrative = outlineOf([
      [plainScene(1)],
      [plainScene(2)],
      [plainScene(3, "final_trap"), clearingScene(4, "revelation")],
    ]);
    const ctx = ctxOf();
    applySuspectClearanceGate(ctx, narrative);
    const flat = narrative.acts.flatMap((a: any) => a.scenes);
    for (const scene of flat) expect(scene).not.toHaveProperty("suspectClearanceAllowed");
    expect(ctx.warnings).toEqual([]);
  });

  it("falls back to the act-3-scene-2 position when no beat says revelation", () => {
    process.env.AGENT9_FOLD_SUSPECT_CLEARANCES = "true";
    // Act 3 scene 2 is scene 9 overall; the clearances sit at 6, 9, 10 with no beats assigned.
    const narrative = outlineOf([
      [plainScene(1), plainScene(2), plainScene(3)],
      [plainScene(4), plainScene(5), clearingScene(6)],
      [plainScene(7), clearingScene(8), clearingScene(9)],
    ]);
    applySuspectClearanceGate(ctxOf(), narrative);
    const flat = narrative.acts.flatMap((a: any) => a.scenes);
    expect(flat.find((s: any) => s.sceneNumber === 8).suspectClearanceAllowed).toBe(true);
    expect(flat.find((s: any) => s.sceneNumber === 6).suspectClearanceAllowed).toBe(false);
    expect(flat.find((s: any) => s.sceneNumber === 9).suspectClearanceAllowed).toBe(false);
  });

  it("never throws on a malformed outline", () => {
    process.env.AGENT9_FOLD_SUSPECT_CLEARANCES = "true";
    const ctx = ctxOf();
    expect(() => applySuspectClearanceGate(ctx, { acts: null } as any)).not.toThrow();
    expect(() => applySuspectClearanceGate(ctx, {} as any)).not.toThrow();
  });
});
