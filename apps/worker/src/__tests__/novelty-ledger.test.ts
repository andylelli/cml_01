import { describe, expect, it } from "vitest";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";
import { rm } from "fs/promises";
import {
  extractPriorRunRecord,
  priorRunAvoidancePatterns,
  mergePriorRunsIntoConstraints,
  loadNoveltyLedger,
  appendNoveltyLedger,
  effectiveNoveltyThreshold,
  CROSS_RUN_NOVELTY_THRESHOLD,
  type PriorRunRecord,
  type NoveltyConstraints,
} from "../jobs/novelty-ledger.js";

describe("effectiveNoveltyThreshold — mode-coupled gate (T1.6 / A_53 P7)", () => {
  it("leaves the threshold untouched in off and shadow modes (only explicit 'on' caps it)", () => {
    expect(effectiveNoveltyThreshold(1.1, "off")).toBe(1.1);
    expect(effectiveNoveltyThreshold(0.9, "off")).toBe(0.9);
    // A_53 P7: shadow (the new default) records + feeds prior runs but does NOT cap the threshold.
    expect(effectiveNoveltyThreshold(0.9, "shadow")).toBe(0.9);
  });

  it("caps the threshold so the audit fires harder when cross-run novelty is fully ON", () => {
    expect(effectiveNoveltyThreshold(1.1, "on")).toBe(CROSS_RUN_NOVELTY_THRESHOLD);
    expect(effectiveNoveltyThreshold(1.1, "on")).toBeLessThan(1);
  });

  it("never raises an already-lower threshold", () => {
    expect(effectiveNoveltyThreshold(0.5, "on")).toBe(0.5);
  });
});

const sampleCml = {
  CASE: {
    meta: {
      title: "The Marchmont Clock Conspiracy",
      era: { decade: "1930s" },
      setting: { location: "Yorkshire manor" },
      crime_class: { subtype: "time-masked manor murder" },
    },
    death_method: "a blunt-force blow",
    false_assumption: { type: "temporal", statement: "The stopped clock shows the time of death." },
    discriminating_test: { method: "reconstruction", design: "wind the demonstration clock" },
    surface_model: { narrative: { summary: "A manipulated clock fakes the time of death." } },
  },
};

describe("novelty-ledger — extract + merge (ANALYSIS_49 T1.7)", () => {
  it("extracts the avoidance-relevant fields from a CML CASE", () => {
    const rec = extractPriorRunRecord(sampleCml, "run_123");
    expect(rec.id).toBe("run_123");
    expect(rec.title).toBe("The Marchmont Clock Conspiracy");
    expect(rec.crimeSubtype).toBe("time-masked manor murder");
    expect(rec.deathMethod).toBe("a blunt-force blow");
    expect(rec.axis).toBe("temporal");
    expect(rec.falseAssumption).toContain("stopped clock");
  });

  it("turns records into 'Prior run' avoidance strings", () => {
    const rec = extractPriorRunRecord(sampleCml, "run_123");
    const patterns = priorRunAvoidancePatterns([rec]);
    expect(patterns).toContain("Prior run crime subtype: time-masked manor murder");
    expect(patterns).toContain("Prior run manner of death: a blunt-force blow");
    expect(patterns.some((p) => p.startsWith("Prior run false assumption:"))).toBe(true);
  });

  it("folds prior runs into the constraints, prior-run patterns first, de-duped and capped", () => {
    const base: NoveltyConstraints = { divergeFrom: ["Seed A"], areas: [], avoidancePatterns: ["seed pattern"] };
    const rec = extractPriorRunRecord(sampleCml, "run_123");
    const merged = mergePriorRunsIntoConstraints(base, [rec]);
    expect(merged.avoidancePatterns[0]).toMatch(/^Prior run/);
    expect(merged.avoidancePatterns).toContain("seed pattern");
    expect(merged.divergeFrom[0]).toBe("The Marchmont Clock Conspiracy");
    expect(merged.avoidancePatterns.length).toBeLessThanOrEqual(20);
  });

  it("returns the constraints unchanged when there are no prior runs", () => {
    const base: NoveltyConstraints = { divergeFrom: ["X"], areas: [], avoidancePatterns: ["y"] };
    expect(mergePriorRunsIntoConstraints(base, [])).toEqual(base);
  });
});

/**
 * X45 (architecture/REVIEW_10.md §5) — the cap cut from the wrong end of the window, and it cut the
 * seed patterns out entirely.
 *
 * MEASURED against the shipped 80-record ledger before the fix: a 20-run window emitted 100 patterns,
 * `slice(0, 20)` kept the four OLDEST, the most recent run was not represented at all, and 0 of 3
 * seed-derived patterns survived. Both fixtures below are that shape.
 */
describe("mergePriorRunsIntoConstraints — X45, which end of the window the cap keeps", () => {
  /** `records` is append-ordered, so `run19` is the most recent and the one to diverge from hardest. */
  const manyRuns = (n: number): PriorRunRecord[] =>
    Array.from({ length: n }, (_, i) => ({
      id: `run${i}`,
      title: `Title ${i}`,
      era: "1940s",
      location: "Seaside Hotel",
      crimeSubtype: `subtype${i}`,
      deathMethod: `method${i}`,
      axis: "temporal",
      falseAssumption: `assumption${i}`,
      discrimMethod: "trap",
      premise: `premise${i}`,
      discrimDesign: `design${i}`,
    }));

  const seeds: NoveltyConstraints = {
    divergeFrom: ["Seed Title A", "Seed Title B"],
    areas: [],
    avoidancePatterns: ["seed pattern 1", "seed pattern 2", "seed pattern 3"],
  };

  it("represents the MOST RECENT run — the whole point of a recency feed", () => {
    const merged = mergePriorRunsIntoConstraints(seeds, manyRuns(20));
    expect(merged.avoidancePatterns.join(" ")).toContain("subtype19");
    expect(merged.divergeFrom).toContain("Title 19");
  });

  it("drops the OLDEST runs when the cap bites, not the newest", () => {
    const merged = mergePriorRunsIntoConstraints(seeds, manyRuns(20));
    const text = merged.avoidancePatterns.join(" ");
    // run0 is twenty cases ago; run19 shipped last. Only one of them can fit, and it is not run0.
    expect(text).not.toContain("subtype0 ");
    expect(text).toContain("subtype19");
  });

  it("never displaces the seed corpus entirely — the feed supplements, it does not swap", () => {
    const merged = mergePriorRunsIntoConstraints(seeds, manyRuns(20));
    for (const seed of seeds.avoidancePatterns) expect(merged.avoidancePatterns).toContain(seed);
    for (const title of seeds.divergeFrom) expect(merged.divergeFrom).toContain(title);
  });

  it("gives the reservation back when the seeds do not need it", () => {
    const thinSeeds: NoveltyConstraints = { divergeFrom: [], areas: [], avoidancePatterns: [] };
    const merged = mergePriorRunsIntoConstraints(thinSeeds, manyRuns(20));
    // A floor, not a quota: with no seeds to protect, all 20 slots go to prior runs.
    expect(merged.avoidancePatterns).toHaveLength(20);
    expect(merged.avoidancePatterns.every((p) => p.startsWith("Prior run"))).toBe(true);
  });

  it("still respects the caps, and still leads with a prior run", () => {
    const merged = mergePriorRunsIntoConstraints(seeds, manyRuns(20));
    expect(merged.avoidancePatterns.length).toBeLessThanOrEqual(20);
    expect(merged.divergeFrom.length).toBeLessThanOrEqual(12);
    expect(merged.avoidancePatterns[0]).toMatch(/^Prior run/);
  });

  it("keeps a run's own fields adjacent, so the model reads one prior case and not a shuffled heap", () => {
    const merged = mergePriorRunsIntoConstraints(seeds, manyRuns(3));
    const first = merged.avoidancePatterns.slice(0, 5).join(" ");
    expect(first).toContain("subtype2");
    expect(first).toContain("method2");
    expect(first).toContain("assumption2");
  });
});

describe("novelty-ledger — persistence round-trip", () => {
  it("returns [] for a missing ledger, then loads what was appended", async () => {
    const ledgerPath = join(tmpdir(), `novelty-ledger-test-${randomUUID()}.json`);
    try {
      expect(await loadNoveltyLedger(ledgerPath)).toEqual([]);
      const rec: PriorRunRecord = extractPriorRunRecord(sampleCml, "run_abc");
      await appendNoveltyLedger(rec, ledgerPath);
      await appendNoveltyLedger(extractPriorRunRecord(sampleCml, "run_def"), ledgerPath);
      const loaded = await loadNoveltyLedger(ledgerPath);
      expect(loaded.map((r) => r.id)).toEqual(["run_abc", "run_def"]);
    } finally {
      await rm(ledgerPath, { force: true });
    }
  });
});
