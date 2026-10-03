/**
 * A_110 L7 / WP-006 K10 — the page's shape against canon floors. Known positives in both directions: a canon text sits
 * above every floor, and run bcc0d637 (the book the owner called wooden) sits below the three it measures.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CANON_PAGE_SHAPE, measurePageShape, summarisePageShape } from "../page-shape.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const book = join(root, "stories", "story_20261002-2110", "the_fog_bound_masquerade_at_cliffhaven_hotel.md");
const canonDir = join(root, "library", "texts");

describe("page shape", () => {
  it("measures a run of identical sentences as redundant, unvaried and full of tails", () => {
    const flat = Array.from({ length: 1200 }, (_, i) => `Eleanor set down the ledger number ${i}, her hands steady on the desk.`).join(" ");
    const s = measurePageShape(flat);
    expect(s.compressedRatio).not.toBeNull();
    expect(s.compressedRatio!).toBeLessThan(CANON_PAGE_SHAPE.compressedRatioMin);
    expect(s.openerEntropy!).toBeLessThan(1);
    expect(s.tailPer10k).toBeGreaterThan(CANON_PAGE_SHAPE.tailPer10kMax);
  });

  it("returns null, not a number, for a text shorter than the canon's window", () => {
    const s = measurePageShape("A short text. It has two sentences.");
    expect(s.compressedRatio).toBeNull();
    expect(s.openerEntropy).toBeNull();
    expect(s.distinctPer8k).toBeNull();
  });

  it.runIf(existsSync(book))("run bcc0d637 falls below the canon on all three floors (the owner's 'wooden')", () => {
    const text = readFileSync(book, "utf8").replace(/^#.*$/gm, "").replace(/^\*Run ID.*$/m, "").replace(/^---\s*$/gm, "");
    const s = measurePageShape(text);
    expect(s.compressedRatio!).toBeLessThan(CANON_PAGE_SHAPE.compressedRatioMin);
    expect(s.openerEntropy!).toBeLessThan(CANON_PAGE_SHAPE.openerEntropyMin);
    expect(s.lengthLag1).toBeLessThan(CANON_PAGE_SHAPE.lengthLag1Min);
    expect(summarisePageShape(s)).toMatch(/BELOW.*BELOW.*BELOW/);
  });

  it.runIf(existsSync(canonDir))("canon texts sit at or above the compressed-ratio and opener floors", () => {
    const files = readdirSync(canonDir).filter((f) => f.endsWith(".txt")).slice(0, 12);
    let checked = 0;
    for (const f of files) {
      const raw = readFileSync(join(canonDir, f), "utf8").replace(/\r/g, "");
      if (raw.length < 110_000) continue;
      const s = measurePageShape(raw.slice(40_000, 110_000));
      checked++;
      expect(s.compressedRatio!).toBeGreaterThanOrEqual(CANON_PAGE_SHAPE.compressedRatioMin - 0.005);
      expect(s.openerEntropy!).toBeGreaterThanOrEqual(CANON_PAGE_SHAPE.openerEntropyMin - 0.2);
    }
    expect(checked).toBeGreaterThan(0);
  });
});
