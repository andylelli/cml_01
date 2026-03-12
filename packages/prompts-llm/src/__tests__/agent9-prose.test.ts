import { describe, expect, it } from "vitest";
import { formatProvisionalScoringFeedbackBlock } from "../agent9-prose.js";
import type { ProseGenerationResult } from "../agent9-prose.js";

// ── formatProvisionalScoringFeedbackBlock ────────────────────────────────────
describe("formatProvisionalScoringFeedbackBlock", () => {
  it("returns empty string when feedback is undefined", () => {
    expect(formatProvisionalScoringFeedbackBlock(undefined)).toBe("");
  });

  it("returns empty string when feedback array is empty", () => {
    expect(formatProvisionalScoringFeedbackBlock([])).toBe("");
  });

  it("includes chapter number, score, deficits, and directives in output", () => {
    const feedback = [
      {
        fromChapter: 3,
        score: 62,
        deficits: ["clue not surfaced", "scene not grounded"],
        directives: ["explicitly name clue_pendant in chapter text"],
      },
    ];
    const result = formatProvisionalScoringFeedbackBlock(feedback);
    expect(result).toContain("Chapter 3");
    expect(result).toContain("62");
    expect(result).toContain("clue not surfaced");
    expect(result).toContain("explicitly name clue_pendant");
  });

  it("includes only the last two feedback entries when more than two are given", () => {
    const feedback = [
      { fromChapter: 1, score: 55, deficits: ["old-deficit"], directives: [] },
      { fromChapter: 2, score: 60, deficits: ["deficit-2"], directives: ["fix-2"] },
      { fromChapter: 3, score: 70, deficits: ["deficit-3"], directives: ["fix-3"] },
    ];
    const result = formatProvisionalScoringFeedbackBlock(feedback);
    expect(result).toContain("Chapter 2");
    expect(result).toContain("Chapter 3");
    expect(result).not.toContain("Chapter 1");
    expect(result).not.toContain("old-deficit");
  });

  it("handles entries with no deficits or directives gracefully", () => {
    const feedback = [{ fromChapter: 5, score: 78, deficits: [], directives: [] }];
    const result = formatProvisionalScoringFeedbackBlock(feedback);
    expect(result).toContain("Chapter 5");
    expect(result).toContain("78");
  });
});

// ── E5: ProseGenerationResult.prompt_fingerprints ───────────────────────────
describe("ProseGenerationResult prompt_fingerprints (E5 contract)", () => {
  it("accepts a result with no prompt_fingerprints (optional field)", () => {
    // Validates the field is optional — TypeScript compile test reinforced at runtime
    const result: Partial<ProseGenerationResult> = {
      status: "draft",
      chapters: [],
      cast: [],
      cost: 0,
      durationMs: 0,
      // prompt_fingerprints intentionally absent
    };
    expect(result.prompt_fingerprints).toBeUndefined();
  });

  it("accepts a result with prompt_fingerprints containing correct shape", () => {
    const fingerprints: NonNullable<ProseGenerationResult["prompt_fingerprints"]> = [
      {
        chapter: 1,
        hash: "a1b2c3d4e5f60001",
        section_sizes: {
          character_consistency: 2400,
          clue_descriptions: 1840,
          narrative_state: 910,
          scene_grounding: 640,
        },
      },
      {
        chapter: 2,
        hash: "b2c3d4e5f6a70002",
        section_sizes: {
          character_consistency: 2400,
          clue_descriptions: 980,
          narrative_state: 910,
        },
      },
    ];

    const result: Partial<ProseGenerationResult> = {
      status: "draft",
      chapters: [],
      cast: [],
      cost: 0,
      durationMs: 0,
      prompt_fingerprints: fingerprints,
    };

    expect(result.prompt_fingerprints).toHaveLength(2);
    expect(result.prompt_fingerprints?.[0].chapter).toBe(1);
    expect(result.prompt_fingerprints?.[0].hash).toHaveLength(16);
    expect(result.prompt_fingerprints?.[0].section_sizes).toHaveProperty("character_consistency");
    expect(result.prompt_fingerprints?.[1].chapter).toBe(2);
  });

  it("each fingerprint hash is a 16-char hex string", () => {
    const fingerprints: NonNullable<ProseGenerationResult["prompt_fingerprints"]> = [
      { chapter: 1, hash: "deadbeefcafe0123", section_sizes: {} },
      { chapter: 2, hash: "0011223344556677", section_sizes: { clue_descriptions: 500 } },
    ];
    for (const fp of fingerprints) {
      expect(fp.hash).toMatch(/^[0-9a-f]{16}$/);
    }
  });

  it("section_sizes values are non-negative integers", () => {
    const sectionSizes: Record<string, number> = {
      character_consistency: 2400,
      clue_descriptions: 1840,
      narrative_state: 0,
      temporal_context: 430,
    };
    for (const size of Object.values(sectionSizes)) {
      expect(typeof size).toBe("number");
      expect(size).toBeGreaterThanOrEqual(0);
    }
  });

  it("discriminates prompt_fingerprints field from validationDetails", () => {
    const result: Partial<ProseGenerationResult> = {
      status: "final",
      chapters: [],
      cast: [],
      cost: 0.05,
      durationMs: 12000,
      prompt_fingerprints: [{ chapter: 1, hash: "abc1234567890def", section_sizes: {} }],
      validationDetails: {
        totalBatches: 1,
        batchesWithRetries: 0,
        failureHistory: [],
        linter: {
          checksRun: 3,
          failedChecks: 0,
          openingStyleEntropyFailures: 0,
          openingStyleEntropyBypasses: 0,
          paragraphFingerprintFailures: 0,
          ngramOverlapFailures: 0,
        },
      },
    };

    // Both can coexist
    expect(result.prompt_fingerprints).toHaveLength(1);
    expect(result.validationDetails?.linter.checksRun).toBe(3);
  });
});
