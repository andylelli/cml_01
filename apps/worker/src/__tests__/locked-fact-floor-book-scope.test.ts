/**
 * A_84 F1 — `AGENT9_LOCKED_FACT_FLOOR_BOOK_SCOPE`.
 *
 * MEASURED 2026-09-07 over the 29 post-X70 manuscripts: `enforceLockedFactValuePresence` shipped 95
 * template sentences and 95 of 95 injected a value the book already stated verbatim in another
 * chapter. The regen that runs before it judges presence at BOOK scope; the floor judged it at
 * CHAPTER scope. These tests pin both scopes, the env read, the known-positive (a value absent from
 * the whole book still gets its floor), and idempotency across the floor's two call sites.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  enforceLockedFactValuePresence,
  isLockedFactFloorBookScopeEnabled,
} from "../jobs/agents/agent9-run.js";

const makeProse = (chapters: string[][]) => ({ chapters: chapters.map((paragraphs) => ({ paragraphs })) });
const textOf = (prose: any, idx: number): string => (prose.chapters[idx].paragraphs as string[]).join("\n\n");
// `DURATION_VARIANTS[1]` capitalises the value ("Forty minutes had passed before it was done."), so
// presence is judged case-insensitively — exactly as the floor itself judges it. The first version
// of this file compared lowercase and reported the floor broken; it was the assertion.
const has = (text: string, value: string): boolean => text.toLowerCase().includes(value.toLowerCase());

// `tokenizeLockedFactDescription` keeps tokens of 4+ letters that are not stopwords, and the floor
// needs two of them in the target chapter. "tamper", "delay" and "clock" all qualify.
const FACT = { value: "forty minutes", description: "The tamper delay on the clock ran to forty minutes" };

/** ch0 carries the value in the model's own words; ch1 discusses the device without the value. */
const proseWithValueElsewhere = () =>
  makeProse([
    ["The tamper delay was forty minutes by the porter's reckoning, and nobody disputed it."],
    ["The tamper on the clock was obvious to anyone who looked. The delay had been deliberate."],
  ]);

/** Neither chapter carries the value — the obligation the floor exists to guarantee. */
const proseWithValueAbsent = () =>
  makeProse([
    ["The porter said nothing useful about when the clock had been touched."],
    ["The tamper on the clock was obvious to anyone who looked. The delay had been deliberate."],
  ]);

describe("AGENT9_LOCKED_FACT_FLOOR_BOOK_SCOPE — chapter scope vs book scope", () => {
  afterEach(() => {
    delete process.env.AGENT9_LOCKED_FACT_FLOOR_BOOK_SCOPE;
  });

  it("OFF: today's behaviour — injects into a chapter that lacks the value even though another chapter has it", () => {
    const out = enforceLockedFactValuePresence(proseWithValueElsewhere(), [FACT], { bookScope: false });
    expect(has(textOf(out, 1), "forty minutes")).toBe(true);
    expect(textOf(out, 1)).not.toBe(textOf(proseWithValueElsewhere(), 1));
  });

  it("ON: a value present anywhere in the book is never injected", () => {
    const before = proseWithValueElsewhere();
    const out = enforceLockedFactValuePresence(before, [FACT], { bookScope: true });
    expect(textOf(out, 0)).toBe(textOf(before, 0));
    expect(textOf(out, 1)).toBe(textOf(before, 1));
  });

  it("ON, KNOWN-POSITIVE: a value absent from the WHOLE book still gets its floor", () => {
    // Without this the flag would be an off switch with extra steps, not a scope fix.
    const out = enforceLockedFactValuePresence(proseWithValueAbsent(), [FACT], { bookScope: true });
    const injectedSomewhere = out.chapters.some((c: any) => has((c.paragraphs as string[]).join(" "), "forty minutes"));
    expect(injectedSomewhere).toBe(true);
  });

  it("ON: order-independent — the value may sit in a LATER chapter than the one that would be injected", () => {
    const before = makeProse([
      ["The tamper on the clock was obvious to anyone who looked. The delay had been deliberate."],
      ["Forty minutes, the porter said at last, and that was the end of it."],
    ]);
    const out = enforceLockedFactValuePresence(before, [FACT], { bookScope: true });
    expect(textOf(out, 0)).toBe(textOf(before, 0));
  });

  it("reads the env at CALL time, never at module load (ADR-0004)", () => {
    expect(isLockedFactFloorBookScopeEnabled({})).toBe(false);
    expect(isLockedFactFloorBookScopeEnabled({ AGENT9_LOCKED_FACT_FLOOR_BOOK_SCOPE: "true" })).toBe(true);
    expect(isLockedFactFloorBookScopeEnabled({ AGENT9_LOCKED_FACT_FLOOR_BOOK_SCOPE: "1" })).toBe(true);
    expect(isLockedFactFloorBookScopeEnabled({ AGENT9_LOCKED_FACT_FLOOR_BOOK_SCOPE: "0" })).toBe(false);

    process.env.AGENT9_LOCKED_FACT_FLOOR_BOOK_SCOPE = "true";
    const on = enforceLockedFactValuePresence(proseWithValueElsewhere(), [FACT]);
    expect(textOf(on, 1)).toBe(textOf(proseWithValueElsewhere(), 1));

    process.env.AGENT9_LOCKED_FACT_FLOOR_BOOK_SCOPE = "false";
    const off = enforceLockedFactValuePresence(proseWithValueElsewhere(), [FACT]);
    expect(has(textOf(off, 1), "forty minutes")).toBe(true);
  });

  it("ON: idempotent across the floor's two call sites — a second pass changes nothing", () => {
    // The floor runs at :6218 and again inside the deterministic rescue. With the value now on the
    // page after the first pass (absent case), the second pass must see it at book scope and stop.
    const once = enforceLockedFactValuePresence(proseWithValueAbsent(), [FACT], { bookScope: true });
    const twice = enforceLockedFactValuePresence(once, [FACT], { bookScope: true });
    expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
  });

  it("does not touch non-atomic (descriptive) facts under either scope", () => {
    const descriptive = { value: "the groundskeeper's log noted drizzle and a locked side gate", description: "The log entry for the night of the tamper on the clock" };
    const before = proseWithValueAbsent();
    for (const bookScope of [false, true]) {
      const out = enforceLockedFactValuePresence(before, [descriptive], { bookScope });
      expect(JSON.stringify(out)).toBe(JSON.stringify(before));
    }
  });
});
