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

describe("effectiveNoveltyThreshold — flag-coupled gate (T1.6)", () => {
  it("leaves the threshold untouched when cross-run novelty is OFF (default-safe)", () => {
    // The static default ≥1.0 must keep skipping the audit when the flag is off.
    expect(effectiveNoveltyThreshold(1.1, false)).toBe(1.1);
    expect(effectiveNoveltyThreshold(0.9, false)).toBe(0.9);
  });

  it("caps the threshold so the audit fires when cross-run novelty is ON", () => {
    expect(effectiveNoveltyThreshold(1.1, true)).toBe(CROSS_RUN_NOVELTY_THRESHOLD);
    expect(effectiveNoveltyThreshold(1.1, true)).toBeLessThan(1);
  });

  it("never raises an already-lower threshold", () => {
    expect(effectiveNoveltyThreshold(0.5, true)).toBe(0.5);
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
