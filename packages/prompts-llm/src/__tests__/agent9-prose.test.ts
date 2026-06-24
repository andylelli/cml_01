import { describe, expect, it, vi } from "vitest";

const mockedGenerationParams = {
  story_length_policy: {
    targets: { short: 10, medium: 20, long: 30 },
    chapter_target_tolerance: 2,
    word_target_multiplier: 1.25,
    word_targets: {
      short: { chapter_count: 10, min_words: 7500, max_words: 12500, chapter_ideal_words: 1000 },
      medium: { chapter_count: 20, min_words: 25500, max_words: 42500, chapter_ideal_words: 1300 },
      long: { chapter_count: 30, min_words: 49500, max_words: 82500, chapter_ideal_words: 1800 },
    },
    total_word_budget_ratio: { min_ratio: 0.75, max_ratio: 1.25 },
  },
  agent9_prose: {
    generation: {
      default_max_attempts: 4,
    },
    story_length_policy: {
      targets: { short: 10, medium: 20, long: 30 },
      chapter_target_tolerance: 2,
      word_target_multiplier: 1.25,
      word_targets: {
        short: { chapter_count: 10, min_words: 7500, max_words: 12500, chapter_ideal_words: 1000 },
        medium: { chapter_count: 20, min_words: 25500, max_words: 42500, chapter_ideal_words: 1300 },
        long: { chapter_count: 30, min_words: 49500, max_words: 82500, chapter_ideal_words: 1800 },
      },
      total_word_budget_ratio: { min_ratio: 0.75, max_ratio: 1.25 },
    },
    underflow_expansion: {
      enabled: true,
      expansion_size_ratio: {
        min_additional_words_ratio: 0.16,
        max_additional_words_ratio: 0.56,
        buffer_words_ratio: 0.18,
      },
      temperature: 0.2,
      max_tokens_ratio: 1.7,
      preferred_miss_expansion_ratio: 0.85,
    },
    stage_modes: {
      discovery_opening: {
        balance_targets: { investigation: { min_pct: 35, max_pct: 45 }, atmosphere: { min_pct: 20, max_pct: 30 } },
        required_outcomes: ["Name the victim explicitly."],
        forbidden_reveals: ["No culprit reveal."],
      },
      early_investigation: {
        balance_targets: { investigation: { min_pct: 45, max_pct: 55 }, atmosphere: { min_pct: 15, max_pct: 25 } },
        required_outcomes: ["Advance the working theory."],
        forbidden_reveals: ["No final culprit resolution."],
      },
      suspect_pressure: {
        balance_targets: { suspicion: { min_pct: 45, max_pct: 55 }, inference: { min_pct: 20, max_pct: 30 } },
        required_outcomes: ["Increase suspect pressure."],
        forbidden_reveals: ["No full murder confession unless required."],
      },
      false_suspect_clearing: {
        balance_targets: { exoneration: { min_pct: 40, max_pct: 50 }, redirection: { min_pct: 20, max_pct: 30 } },
        required_outcomes: ["Clear one suspect with evidence."],
        forbidden_reveals: ["Do not clear by convenience."],
      },
      clue_reinterpretation: {
        balance_targets: { reinterpretation: { min_pct: 35, max_pct: 45 }, inference: { min_pct: 25, max_pct: 35 } },
        required_outcomes: ["Reframe an earlier clue."],
        forbidden_reveals: ["No decisive new evidence from nowhere."],
      },
      discriminating_test: {
        balance_targets: { test_execution: { min_pct: 40, max_pct: 50 }, proof_chain: { min_pct: 25, max_pct: 35 } },
        required_outcomes: ["Run a concrete discriminating test."],
        forbidden_reveals: ["Do not merely restate existing evidence."],
      },
      final_reveal: {
        balance_targets: { proof_chain: { min_pct: 45, max_pct: 55 }, consequence: { min_pct: 15, max_pct: 25 } },
        required_outcomes: ["Deliver the full proof chain."],
        forbidden_reveals: ["Do not end with mechanism-only confession."],
      },
      aftermath_consequence: {
        balance_targets: { consequence: { min_pct: 45, max_pct: 55 }, reflection: { min_pct: 20, max_pct: 30 } },
        required_outcomes: ["Show emotional and social consequences after truth lands."],
        forbidden_reveals: ["Do not introduce decisive new mystery evidence."],
      },
    },
    style_linter: {
      entropy: {
        min_window_standard: 3,
        min_window_repair: 2,
        warmup_chapters_standard: 2,
        warmup_chapters_repair: 0,
        opening_styles_prior_window: 6,
        opening_styles_total_window: 8,
        standard: {
          early_chapter_max: 6,
          mid_chapter_max: 10,
          early_threshold: 0.65,
          mid_threshold: 0.72,
          late_threshold: 0.8,
        },
        repair_threshold: 0.55,
      },
      paragraph_fingerprint_min_chars: 180,
      ngram: {
        min_chars: 120,
        prior_paragraph_limit: 20,
        gram_size: 7,
        min_candidate_ngrams: 5,
        overlap_threshold: 0.72,
      },
    },
  },
};

vi.mock("@cml/story-validation", async () => {
  const actual = await vi.importActual<any>("@cml/story-validation");
  return {
    ...actual,
    STORY_LENGTH_TARGETS: actual.STORY_LENGTH_TARGETS ?? {
      short: { chapterMinWords: 1000 },
      medium: { chapterMinWords: 1300 },
      long: { chapterMinWords: 1800 },
    },
    getGenerationParams: () => mockedGenerationParams,
  };
});

import {
  applyDeterministicCluePatch,
  applyDeterministicClearancePatch,
  applyDeterministicDiscriminatingTestPatch,
  attemptUnderflowExpansion,
  assessNarrativeBalanceSignals,
  buildCanonicalRetryBrief,
  buildChapterRepairContext,
  buildSinglePassRetryPrompt,
  buildCompletionFallbackChapter,
  buildEnhancedRetryFeedback,
  buildPostPassPolishPrompt,
  buildChapterObligationBlock,
  buildDiscriminatingTestChecklist,
  describeDtMechanismForPrompt,
  buildNarrativeBalanceBlock,
  buildProsePrompt,
  buildTimelineStateBlock,
  chooseRetryPromptStrategy,
  detectConfiguredBannedPhrases,
  detectRecurringPhrases,
  enforceMonthSeasonLockOnChapterWithTelemetry,
  formatProvisionalScoringFeedbackBlock,
  hasPolishRegression,
  lintBatchProse,
  repairChapterDeterministically,
  resolveClueObligationState,
  resolveDiscriminatingTestValidityState,
  runAtmosphereRepairIfNeeded,
  stripInternalAuditPhrasing,
  stripAuditField,
  validateChapterPreCommitObligations,
  polishPassingChapter,
} from "../agent9-prose.ts";
import type { ProseGenerationResult } from "../agent9-prose.ts";

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

describe("stripInternalAuditPhrasing", () => {
  it("removes internal audit/debug-note phrasing while preserving narrative sentences", () => {
    const input =
      "The detail is explicit: the watch was wound back by fourteen minutes. " +
      "Nora closed the diary and looked toward the stair. " +
      "Without changing the essential deduction chain, this clue confirms guilt.";

    const cleaned = stripInternalAuditPhrasing(input);
    expect(cleaned).toBe("Nora closed the diary and looked toward the stair.");
  });
});

describe("buildEnhancedRetryFeedback template-overlap escalation", () => {
  it("switches to structured rewrite mode immediately after the first n-gram overlap failure", () => {
    const feedback = buildEnhancedRetryFeedback(
      [
        "Template linter: high n-gram overlap with prior chapter prose (Jaccard 0.88 >= 0.80)",
      ],
      {} as any,
      "6",
      2,
      6,
    );

    expect(feedback).toContain("STRUCTURED REWRITE MODE");
    expect(feedback).toContain("Rebuild paragraph-by-paragraph");
  });

  it("emits entity-fidelity micro-directive for identity consistency failures", () => {
    const feedback = buildEnhancedRetryFeedback(
      [
        "Entity fidelity: illegal_named_walk_on in chapter 2: unknown titled name 'Inspector Crowe'",
      ],
      {} as any,
      "2",
      2,
      6,
    );

    expect(feedback).toContain("REPAIR [entity_fidelity");
    expect(feedback).toContain("cast-canonical names");
  });

  it("preserves continuity instructions when duplication lock is active", () => {
    const priorParagraph =
      "Clara kept her hand on the mantel while the witness retraced each movement in the drawing room, " +
      "and every pause in the account made the rewound clock look less like accident than design beneath the lamplight.";
    const feedback = buildEnhancedRetryFeedback(
      [
        "Template linter: high n-gram overlap with prior chapter prose (Jaccard 0.88 >= 0.80)",
      ],
      {} as any,
      "6",
      3,
      6,
      {
        enableSurgicalFingerprintRetry: true,
        linterIssues: [
          {
            type: "ngram_overlap",
            message: "high n-gram overlap with prior chapter prose",
            matchingPriorParagraph: priorParagraph,
          },
        ] as any,
        priorChapterParagraphs: [priorParagraph],
      },
    );

    expect(feedback).toContain("Preserve continuity with the established story facts");
    expect(feedback).toContain("Keep the clue state, cast facts, and chapter obligations intact");
    expect(feedback).not.toContain("Write as if you cannot see the prior chapters");
  });
});

describe("single-pass retry prompt strategy", () => {
  it("uses surgical patch mode for narrow single-family fixes", () => {
    const strategy = chooseRetryPromptStrategy(
      ['Chapter 5: scene location coverage missing — expected location anchor "the local café" was not grounded in prose.'],
      2,
      6,
    );

    expect(strategy.mode).toBe("surgical_patch");
    expect(strategy.includePriorDraft).toBe(true);
  });

  it("switches to targeted rebuild for multi-family retries and suppresses prior-draft anchoring", () => {
    const strategy = chooseRetryPromptStrategy(
      [
        'Chapter 5: clue evidence "A faint scratch is found on the clock face." is absent.',
        'Stage-mode outcome failed (clue_reinterpretation): chapter must reinterpret an earlier clue and state how meaning changed.',
        'Template linter: repeated content opener detected ("gaston leaned").',
      ],
      2,
      6,
    );

    expect(strategy.mode).toBe("targeted_rebuild");
    expect(strategy.includePriorDraft).toBe(false);
  });
});

describe("canonical retry brief", () => {
  it("builds one top-level retry brief for mixed logic and quality failures", () => {
    const result = buildCanonicalRetryBrief({
      errors: [
        'Chapter 5: clue evidence "A faint scratch is found on the clock face." is absent.',
        'Template linter: repeated content opener detected ("gaston leaned").',
      ],
      caseData: baseCaseData,
      chapterRange: "5",
      attempt: 2,
      maxAttempts: 6,
    });

    expect(result.feedback.match(/SINGLE-PASS RETRY CONTRACT/g)?.length ?? 0).toBe(1);
    expect(result.feedback.match(/SUCCESS CHECKLIST/g)?.length ?? 0).toBe(1);
    expect(result.feedback).toContain("RETRY PHASE: 1 of 2");
  });
});

describe("buildSinglePassRetryPrompt", () => {
  it("builds a one-pass repair brief with rewrite plan and checklist", () => {
    const result = buildSinglePassRetryPrompt({
      errors: [
        'Chapter 5: clue evidence "A faint scratch is found on the clock face." is absent. Include an on-page observation or reference to "A faint scratch is found on the clock face." (this clue reveals: This indicates potential tampering with the clock.) before the chapter ends.',
        'Chapter 5: scene location coverage missing — expected location anchor "the local café" was not grounded in prose.',
        'Stage-mode outcome failed (clue_reinterpretation): chapter must reinterpret an earlier clue and state how meaning changed.',
      ],
      chapterRange: "5",
      attempt: 2,
      maxAttempts: 6,
      packet: {
        attempt: 2,
        failureClass: "fair_play",
        failureSubcode: "stage_mode_outcome",
        failedGates: [],
        mustFix: ["Resolve fair_play issues before accepting this batch."],
        warningsToClear: [],
        maxRetries: 6,
        shouldEscalate: false,
        deterministicMitigation: { type: "none" },
      },
    });

    expect(result.prompt).toContain("SINGLE-PASS RETRY CONTRACT");
    expect(result.prompt).toContain("Retry mode: TARGETED_REBUILD.");
    expect(result.prompt).toContain("PRIMARY FAILURES");
    expect(result.prompt).toContain("REWRITE PLAN");
    expect(result.prompt).toContain("SUCCESS CHECKLIST");
    expect(result.prompt).toContain('"A faint scratch is found on the clock face."');
    expect(result.prompt).toContain('"the local café"');
    expect(result.strategy.includePriorDraft).toBe(false);
  });

  it("R1/R2 (ANALYSIS_44): lists ALL repeated openers and drops the contradictory 'no more than two' wording", () => {
    const result = buildSinglePassRetryPrompt({
      errors: [
        'Template linter: repeated content opener detected ("lady beatrice"). Avoid reusing the same meaningful opener phrase, and avoid starting 3+ paragraphs with the same meaningful first word.',
        'Template linter: repeated content opener detected ("george langley"). Avoid reusing the same meaningful opener phrase, and avoid starting 3+ paragraphs with the same meaningful first word.',
      ],
      chapterRange: "4",
      attempt: 2,
      maxAttempts: 3,
    });

    // R1: both openers must reach the retry, not just the first.
    expect(result.prompt).toContain('"lady beatrice"');
    expect(result.prompt).toContain('"george langley"');
    // R2: the old wording described a passing state that actually fails the 2nd-occurrence gate.
    expect(result.prompt).not.toContain("No more than two paragraphs");
    expect(result.prompt).toContain("No two paragraphs begin with the same name or meaningful word");
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
        batchCommitRecords: [
          {
            chapterStart: 1,
            chapterEnd: 1,
            chapterRange: "1",
            attemptCount: 1,
            gateOutcomes: [
              { gate: "encoding", passed: true, failedAttempts: 0 },
            ],
            newClueIdsRevealed: ["clue_a"],
            cumulativeClueSet: ["clue_a"],
            deployedAtomIds: ["portrait:Inspector:first_impression"],
            continuityTailPreview: "The inspector closed the notebook.",
            promptFingerprintHash: "abc1234567890def",
            durationMs: 1100,
            cost: 0.014,
          },
        ],
      },
    };

    // Both can coexist
    expect(result.prompt_fingerprints).toHaveLength(1);
    expect(result.validationDetails?.linter.checksRun).toBe(3);
    expect(result.validationDetails?.batchCommitRecords?.[0].chapterRange).toBe("1");
  });
});

describe("validateChapterPreCommitObligations", () => {
  const baseLedger = {
    chapterNumber: 1,
    hardFloorWords: 800,
    preferredWords: 1300,
    requiredClueIds: [],
  };

  it("returns hard failure when chapter is below hard floor", () => {
    const chapter = {
      title: "Chapter One",
      paragraphs: [new Array(500).fill("word").join(" ")],
    };

    const result = validateChapterPreCommitObligations(chapter, baseLedger as any);
    expect(result.hardFailures.some((msg) => msg.includes("below hard floor"))).toBe(true);
    expect(result.preferredMisses.length).toBe(0);
    expect(result.wordTarget.isBelowHardFloor).toBe(true);
  });

  it("returns preferred miss (not hard failure) when above hard floor but below preferred target", () => {
    const chapter = {
      title: "Chapter One",
      paragraphs: [new Array(1000).fill("word").join(" ")],
    };

    const result = validateChapterPreCommitObligations(chapter, baseLedger as any);
    expect(result.hardFailures.length).toBe(0);
    expect(result.preferredMisses.some((msg) => msg.includes("below preferred target"))).toBe(true);
    expect(result.wordTarget.isBelowHardFloor).toBe(false);
    expect(result.wordTarget.isBelowPreferred).toBe(true);
  });

  it("passes word gate when chapter meets preferred target", () => {
    const chapter = {
      title: "Chapter One",
      paragraphs: [new Array(1500).fill("word").join(" ")],
    };

    const result = validateChapterPreCommitObligations(chapter, baseLedger as any);
    expect(result.hardFailures.length).toBe(0);
    expect(result.preferredMisses.length).toBe(0);
    expect(result.wordTarget.isBelowPreferred).toBe(false);
  });

  it("passes suspect-pressure fallback chapters without premature resolution", () => {
    const ledger = {
      chapterNumber: 5,
      hardFloorWords: 700,
      preferredWords: 900,
      requiredClueIds: ["clue_clock"],
    };
    const chapter = buildCompletionFallbackChapter(
      undefined,
      baseScene,
      5,
      ledger as any,
      baseInputs.clueDistribution,
      baseCaseData,
      {
        stageMode: "suspect_pressure",
        focusName: "Edgar Vale",
      },
    );

    const result = validateChapterPreCommitObligations(
      chapter,
      ledger as any,
      baseInputs.clueDistribution,
      ["Clara Whitfield", "Edgar Vale"],
      undefined,
      {
        mode: "suspect_pressure",
        suspectNames: ["Edgar Vale"],
      } as any,
    );

    expect(result.hardFailures.some((msg) => msg.includes("suspect_pressure"))).toBe(false);
  });

  it("passes discriminating-test fallback chapters with explicit competing theories and result", () => {
    const ledger = {
      chapterNumber: 8,
      hardFloorWords: 700,
      preferredWords: 900,
      requiredClueIds: ["clue_clock"],
    };
    const chapter = buildCompletionFallbackChapter(
      undefined,
      baseScene,
      8,
      ledger as any,
      baseInputs.clueDistribution,
      baseCaseData,
      {
        stageMode: "discriminating_test",
        focusName: "Edgar Vale",
      },
    );

    const result = validateChapterPreCommitObligations(
      chapter,
      ledger as any,
      baseInputs.clueDistribution,
      ["Clara Whitfield", "Edgar Vale"],
      undefined,
      {
        mode: "discriminating_test",
      } as any,
    );

    expect(result.hardFailures.some((msg) => msg.includes("Discriminating test validity failed"))).toBe(false);
  });

  it("passes final-reveal fallback chapters with motive, opportunity, and method linkage", () => {
    const ledger = {
      chapterNumber: 9,
      hardFloorWords: 700,
      preferredWords: 900,
      requiredClueIds: ["clue_clock"],
    };
    const finalRevealCaseData = {
      ...baseCaseData,
      CASE: {
        ...baseCaseData.CASE,
        culpability: {
          culprits: ["Edgar Vale"],
        },
        hidden_model: {
          mechanism: {
            description: "poisoned the evening brandy after rewinding the mantel clock",
          },
        },
      },
    };
    const chapter = buildCompletionFallbackChapter(
      undefined,
      baseScene,
      9,
      ledger as any,
      baseInputs.clueDistribution,
      finalRevealCaseData,
      {
        stageMode: "final_reveal",
        focusName: "Edgar Vale",
      },
    );

    const result = validateChapterPreCommitObligations(
      chapter,
      ledger as any,
      baseInputs.clueDistribution,
      ["Clara Whitfield", "Edgar Vale"],
      undefined,
      {
        mode: "final_reveal",
        culpritName: "Edgar Vale",
        murderMethod: "poisoned the evening brandy after rewinding the mantel clock",
      } as any,
    );

    expect(result.hardFailures.some((msg) => msg.includes("Final reveal completeness failed"))).toBe(false);
  });
});

describe("validator-aligned deterministic repair helpers", () => {
  it("treats delivery-method-only clue metadata as satisfied without adding filler prose", () => {
    const ledger = {
      chapterNumber: 2,
      hardFloorWords: 1,
      preferredWords: 1,
      requiredClueIds: ["clue_glance"],
      clueObligationContext: [
        {
          id: "clue_glance",
          description: "Direct observation",
          placement: "early",
        },
      ],
    };
    const chapter = {
      title: "Chapter 2",
      paragraphs: [
        "Clara crossed the room before anyone could stop her and made the household wait in silence.",
        "The first exchange was careful, restrained, and pointed enough to keep every suspect watching one another.",
      ],
    };

    const clueState = resolveClueObligationState(
      chapter as any,
      ledger as any,
      "clue_glance",
      undefined,
      ["Clara Whitfield", "Edgar Vale"],
    );
    const patched = applyDeterministicCluePatch(
      chapter as any,
      baseScene,
      ledger as any,
      undefined,
      baseCaseData,
      ["Clara Whitfield", "Edgar Vale"],
    );
    const result = validateChapterPreCommitObligations(
      chapter as any,
      ledger as any,
      undefined,
      ["Clara Whitfield", "Edgar Vale"],
    );

    expect(clueState.isMetadataOnly).toBe(true);
    expect(clueState.isPresent).toBe(true);
    expect(clueState.isEarlyEnough).toBe(true);
    expect(patched.insertedClueIds).toEqual([]);
    expect(result.hardFailures.some((msg) => msg.includes("clue evidence"))).toBe(false);
  });

  it("uses validator DT state so incidental marker words no longer cause a false skip", () => {
    const ledger = {
      chapterNumber: 8,
      hardFloorWords: 1,
      preferredWords: 1,
      requiredClueIds: ["clue_clock"],
    };
    const chapter = {
      title: "Chapter 8",
      paragraphs: [
        "Clara said either story might sound plausible until the room was forced to slow down and listen properly.",
        "The result of her latest observation was only a heavier silence, not yet the kind of proof that settled anything.",
        "Everyone understood the comparison had to come from the evidence itself before a clear explanation could survive.",
      ],
    };

    const validityBefore = resolveDiscriminatingTestValidityState(chapter as any);
    const patched = applyDeterministicDiscriminatingTestPatch(
      chapter as any,
      baseCaseData,
      "Clara Whitfield",
      undefined,
      "Edgar Vale",
      ledger as any,
      baseInputs.clueDistribution,
    );
    const after = validateChapterPreCommitObligations(
      patched.chapter,
      ledger as any,
      baseInputs.clueDistribution,
      ["Clara Whitfield", "Edgar Vale"],
      undefined,
      { mode: "discriminating_test" } as any,
    );

    expect(validityBefore.isValid).toBe(false);
    expect(patched.inserted).toBe(true);
    expect(after.hardFailures.some((msg) => msg.includes("Discriminating test validity failed"))).toBe(false);
  });

  it("renders prose-facing DT evidence text instead of raw clue ids", () => {
    const ledger = {
      chapterNumber: 8,
      hardFloorWords: 1,
      preferredWords: 1,
      requiredClueIds: ["clue_clock"],
      clueObligationContext: [
        {
          id: "clue_clock",
          description: "Direct observation",
          placement: "early",
        },
      ],
    };
    const chapter = {
      title: "Chapter 8",
      paragraphs: [
        "Clara gathered the household in the drawing room and let the silence settle into something ceremonial.",
        "No one yet knew which comparison she meant to force on them.",
      ],
    };

    const patched = applyDeterministicDiscriminatingTestPatch(
      chapter as any,
      baseCaseData,
      "Clara Whitfield",
      undefined,
      "Edgar Vale",
      ledger as any,
      baseInputs.clueDistribution,
    );
    const patchedText = patched.chapter.paragraphs.join(" ");

    expect(patched.inserted).toBe(true);
    // R-A (M0): the DT evidence is surfaced as KEY TERMS, not the verbatim clue sentence — so the
    // discriminating terms appear, but never the full "The mantel clock has been rewound." sentence.
    expect(patchedText).toMatch(/clock/i);
    expect(patchedText).toMatch(/rewound/i);
    expect(patchedText).not.toContain("The mantel clock has been rewound");
    expect(patchedText).not.toMatch(/\bclue_clock\b/i);
    expect(patchedText).not.toContain("[object Object]");
  });
});

describe("deterministic suspect-clearance patch", () => {
  it("inserts an evidence-based clearance paragraph that satisfies the linter", () => {
    const clearances = [
      {
        suspect_name: "Edgar Vale",
        clearance_method: "timeline contradiction",
        supporting_clues: ["clue_clock"],
      },
    ];
    const ledger = {
      chapterNumber: 6,
      hardFloorWords: 700,
      preferredWords: 900,
      requiredClueIds: ["clue_clock"],
    };
    const chapter = {
      title: "Chapter 6",
      paragraphs: [
        "Clara gathered the household in the drawing room and returned everyone to the stopped clock on the mantel.",
        "Each answer had to match the visible marks on the case, the timing of the supper tray, and the witness accounts already given.",
        "By the end of the exchange the room understood that one version of the evening was collapsing under its own strain.",
      ],
    };

    const before = lintBatchProse([chapter] as any, [], [], {
      matchingClearances: clearances as any,
    });
    const patched = applyDeterministicClearancePatch(
      chapter as any,
      clearances as any,
      ledger as any,
      baseInputs.clueDistribution,
    );
    const after = lintBatchProse([patched.chapter] as any, [], [], {
      matchingClearances: clearances as any,
    });

    expect(before.some((issue) => issue.type === "suspect_clearance_missing")).toBe(true);
    expect(patched.insertedSuspects).toEqual(["Edgar Vale"]);
    expect(after.some((issue) => issue.type === "suspect_clearance_missing")).toBe(false);
  });
});

describe("deterministic clue and discriminating-test patches", () => {
  it("materializes missing early clues into an observation-plus-inference structure", () => {
    const clueDistribution = {
      clues: [
        {
          id: "clue_clock",
          description: "The mantel clock has been rewound.",
          category: "physical",
          criticality: "essential",
          placement: "early",
          pointsTo: "the time of death was staged",
        },
      ],
    };
    const ledger = {
      chapterNumber: 2,
      hardFloorWords: 700,
      preferredWords: 900,
      requiredClueIds: ["clue_clock"],
      clueObligationContext: [
        {
          id: "clue_clock",
          description: "The mantel clock has been rewound.",
          placement: "early",
        },
      ],
    };
    const chapter = {
      title: "Chapter 2",
      paragraphs: [
        "Clara entered the drawing room to find everyone already braced for another round of questions.",
        "Edgar kept his eyes on the hearth while the servants avoided one another.",
        "No one yet understood which detail would break the room open.",
      ],
    };

    const before = validateChapterPreCommitObligations(
      chapter as any,
      ledger as any,
      clueDistribution as any,
      ["Clara Whitfield", "Edgar Vale"],
    );
    const patched = applyDeterministicCluePatch(
      chapter as any,
      baseScene,
      ledger as any,
      clueDistribution as any,
      baseCaseData,
      ["Clara Whitfield", "Edgar Vale"],
    );
    const after = validateChapterPreCommitObligations(
      patched.chapter,
      ledger as any,
      clueDistribution as any,
      ["Clara Whitfield", "Edgar Vale"],
    );

    expect(before.hardFailures.some((msg) => msg.includes('clue evidence "The mantel clock has been rewound." is absent'))).toBe(true);
    expect(patched.insertedClueIds).toEqual(["clue_clock"]);
    expect(patched.insertedEarlyClueIds).toEqual(["clue_clock"]);
    expect(after.hardFailures.some((msg) => msg.includes("clue evidence"))).toBe(false);
  });

  it("adds a discriminating-test scaffold when the chapter lacks one", () => {
    const ledger = {
      chapterNumber: 8,
      hardFloorWords: 700,
      preferredWords: 900,
      requiredClueIds: ["clue_clock"],
    };
    const chapter = {
      title: "Chapter 8",
      paragraphs: [
        "Clara gathered the household in the drawing room and let the silence settle into something almost ceremonial.",
        "Every face in the room showed strain, but none of them yet knew how she meant to separate fear from fact.",
        "The next move had to come from the evidence itself rather than from another round of accusation.",
      ],
    };

    const before = validateChapterPreCommitObligations(
      chapter as any,
      ledger as any,
      baseInputs.clueDistribution,
      ["Clara Whitfield", "Edgar Vale"],
      undefined,
      { mode: "discriminating_test" } as any,
    );
    const patched = applyDeterministicDiscriminatingTestPatch(
      chapter as any,
      baseCaseData,
      "Clara Whitfield",
      "The mantel clock has been rewound.",
    );
    const after = validateChapterPreCommitObligations(
      patched.chapter,
      ledger as any,
      baseInputs.clueDistribution,
      ["Clara Whitfield", "Edgar Vale"],
      undefined,
      { mode: "discriminating_test" } as any,
    );

    expect(before.hardFailures.some((msg) => msg.includes("Discriminating test validity failed"))).toBe(true);
    expect(patched.inserted).toBe(true);
    expect(after.hardFailures.some((msg) => msg.includes("Discriminating test validity failed"))).toBe(false);
  });

  it("applies validator-aligned deterministic repairs through one shared helper", () => {
    const ledger = {
      chapterNumber: 8,
      hardFloorWords: 700,
      preferredWords: 900,
      requiredClueIds: ["clue_clock"],
      clueObligationContext: [
        {
          id: "clue_clock",
          description: "The mantel clock has been rewound.",
          placement: "early",
        },
      ],
    };
    const chapter = {
      title: "Chapter 8",
      paragraphs: [
        "Clara gathered the household and made them repeat their timelines without interruption.",
        "The room was tense, but she had not yet stated the competing explanations in full.",
      ],
    };
    const repairContext = buildChapterRepairContext({
      chapterNumber: 8,
      scene: baseScene,
      sceneCount: 10,
      caseData: baseCaseData,
      cmlCase: baseCaseData.CASE,
      scenes: [baseScene],
      dtSceneCheck: { act_number: 3, scene_number: 1 },
      ledgerEntry: ledger as any,
      clueDistribution: baseInputs.clueDistribution,
      matchingClearances: [],
    });

    const repaired = repairChapterDeterministically({
      chapter: chapter as any,
      repairContext,
      ledgerEntry: ledger as any,
      clueDistribution: baseInputs.clueDistribution,
      caseData: baseCaseData,
      castNames: ["Clara Whitfield", "Edgar Vale"],
      applyClearancePatch: false,
    });
    const obligations = validateChapterPreCommitObligations(
      repaired.chapter,
      ledger as any,
      baseInputs.clueDistribution,
      ["Clara Whitfield", "Edgar Vale"],
      undefined,
      { mode: "discriminating_test" } as any,
    );

    expect(repaired.appliedRepairs).toContain("clue_materialization");
    expect(repaired.appliedRepairs).toContain("discriminating_test_scaffold");
    expect(repaired.insertedDiscriminatingTest).toBe(true);
    expect(obligations.hardFailures.some((msg) => msg.includes("Discriminating test validity failed"))).toBe(false);
  });
});

const baseCaseData: any = {
  CASE: {
    meta: {
      title: "The November Clock",
      era: { decade: "1930s" },
      setting: { location: "Blackwood Hall" },
      crime_class: { category: "murder", subtype: "poison" },
    },
    false_assumption: { statement: "The victim died after midnight." },
    constraint_space: {
      time: {
        anchors: ["The mantel clock stopped at thirteen minutes to midnight."],
      },
    },
    clue_registry: [{ clue_id: "clue_clock" }],
    discriminating_test: {
      design: {
        test_type: "mechanism_test",
        description: "The detective confronts the culprit with the rewound clock and poisoned cup.",
      },
      evidence_clues: [{ clue_id: "clue_clock", type: "physical" }],
      eliminated_suspects: [{ name: "Edgar Vale" }],
    },
    prose_requirements: {
      discriminating_test_scene: { act_number: 3, scene_number: 1 },
      suspect_clearance_scenes: [
        { act_number: 3, scene_number: 1, suspect_name: "Edgar Vale", clearance_method: "timeline contradiction" },
      ],
      clue_to_scene_mapping: [
        { act_number: 3, scene_number: 1, clue_id: "clue_clock", delivery_method: "observation" },
      ],
    },
  },
};

const baseCast: any = {
  characters: [
    { name: "Clara Whitfield", gender: "female", role: "detective" },
    { name: "Edgar Vale", gender: "male", role: "suspect" },
    { name: "Miriam Frost", gender: "female", role: "victim" },
  ],
};

const baseScene: any = {
  act: 3,
  sceneNumber: 1,
  title: "The Trap",
  summary: "Clara gathers everyone in the drawing room.",
  purpose: "Run the discriminating test and clear Edgar.",
  setting: { location: "Drawing Room" },
  characters: ["Clara Whitfield", "Edgar Vale"],
  cluesRevealed: ["clue_clock"],
};

const baseInputs: any = {
  caseData: baseCaseData,
  outline: {
    acts: [{ act_number: 3, scenes: [baseScene] }],
    totalScenes: 1,
  },
  cast: baseCast,
  targetLength: "medium",
  narrativeStyle: "classic",
  temporalContext: {
    specificDate: { month: "november", year: 1934 },
    seasonal: { season: "autumn", weather: ["mist", "rain"] },
    fashion: { mensWear: {}, womensWear: {} },
    cultural: { entertainment: {}, dailyLife: {} },
    currentAffairs: {},
    atmosphericDetails: ["Cold rain tapped at the windowpanes."],
  },
  lockedFacts: [
    { id: "lf_clock", description: "mantel clock reading", value: "thirteen minutes to midnight" },
    { id: "lf_poison", description: "poison dose", value: "three drops" },
  ],
  clueDistribution: {
    clues: [
      {
        id: "clue_clock",
        description: "The mantel clock has been rewound.",
        category: "physical",
        criticality: "essential",
        pointsTo: "The time of death was staged.",
      },
    ],
  },
  narrativeState: {
    lockedFacts: [],
    characterPronouns: {},
    usedOpeningStyles: [],
    usedSensoryPhrases: [],
    cluesRevealedToReader: [],
    chapterSummaries: [],
  },
};

describe("Agent 9 prompt hardening fixes", () => {
  it("injects full prior chapter text as Story To Date context", () => {
    const priorChapters = [
      {
        title: "Chapter 1: Discovery",
        paragraphs: [
          "Vivienne entered the study and found the clock stopped at ten minutes past eleven.",
          "Muriel watched the doorway in silence.",
        ],
      },
    ];

    const prompt = buildProsePrompt(baseInputs, [baseScene], 2, [], priorChapters as any);
    const userMessage = prompt.messages.find((m) => m.role === "user")?.content ?? "";

    expect(userMessage).toContain("STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM)");
    expect(userMessage).toContain("--- BEGIN PRIOR CHAPTER 1 ---");
    expect(userMessage).toContain("Title: Chapter 1: Discovery");
    expect(userMessage).toContain("Vivienne entered the study and found the clock stopped at ten minutes past eleven.");
    expect(userMessage).toContain("--- END PRIOR CHAPTER 1 ---");
  });

  it("Fix 1 adds a per-chapter obligation block with clue, location, clearance, and season obligations", () => {
    const block = buildChapterObligationBlock(
      [baseScene],
      7,
      baseCaseData.CASE,
      baseInputs.lockedFacts,
      { month: "november", season: "autumn" } as any,
    );

    expect(block).toContain("CHAPTER OBLIGATION CONTRACT");
    expect(block).toContain("Chapter 7:");
    expect(block).toContain("Drawing Room");
    expect(block).toContain("clue_clock");
    expect(block).toContain("\"Edgar Vale\"");
    expect(block).toContain("clearance method (\"timeline contradiction\")");
    expect(block).toContain("STYLE HARD-BAN");
    expect(block).toContain("Seasonal vocabulary allow-list: autumn, autumnal, fall.");
  });

  // -------------------------------------------------------------------------
  // Layer A — anti-leakage prompt reframing (run_1d55f7c7)
  // -------------------------------------------------------------------------
  it("A1: describeDtMechanismForPrompt surfaces key terms, never the design sentence (R-A, M0)", () => {
    const design =
      "A controlled reenactment demonstrates the grandfather clock's spring tension and hand positions.";
    const framed = describeDtMechanismForPrompt(design);
    expect(framed).toContain("in your own words");
    expect(framed).toMatch(/FAILS validation/i);
    // R-A: the full design sentence is NEVER handed to the model — only key terms.
    expect(framed).not.toContain(design);
    expect(framed).toMatch(/reenactment|grandfather|clock|spring|tension/i);
    // Empty design yields no injected text.
    expect(describeDtMechanismForPrompt("")).toBe("");
  });

  it("A2: clue-obligation header tells the model to dramatize in its own words, not transcribe", () => {
    const block = buildChapterObligationBlock(
      [baseScene],
      7,
      baseCaseData.CASE,
      baseInputs.lockedFacts,
      { month: "november", season: "autumn" } as any,
      baseInputs.clueDistribution,
    );
    expect(block).toContain("YOUR OWN WORDS");
    expect(block).toMatch(/Copying a clue's[\s\S]*FAILS validation/);
  });

  // -------------------------------------------------------------------------
  // Layer B — disclosure embargo + reveal-clue deferral
  // -------------------------------------------------------------------------
  it("B1/B3: the clue-disclosure embargo and spoiler ban fire for the suspect_pressure stage", () => {
    const scene: any = { act: 1, sceneNumber: 1, title: "Pressure", setting: { location: "Study" }, characters: [] };
    const block = buildChapterObligationBlock(
      [scene],
      2,
      baseCaseData.CASE,
      [],
      { month: "november", season: "autumn" } as any,
      baseInputs.clueDistribution,
      undefined,
      undefined,
      undefined,
      "mid",
      undefined,
      undefined,
      [scene],
      "suspect_pressure",
    );
    expect(block).toContain("CLUE DISCLOSURE RULE (Stage 2");
    expect(block).toContain("MECHANISM SPOILER BAN");
  });

  it("B1/B3: the embargo and spoiler ban are absent in the final_reveal stage", () => {
    const scene: any = { act: 1, sceneNumber: 1, title: "Reveal", setting: { location: "Study" }, characters: [] };
    const block = buildChapterObligationBlock(
      [scene],
      9,
      baseCaseData.CASE,
      [],
      { month: "november", season: "autumn" } as any,
      baseInputs.clueDistribution,
      undefined,
      undefined,
      undefined,
      "resolution",
      undefined,
      undefined,
      [scene],
      "final_reveal",
    );
    expect(block).not.toContain("CLUE DISCLOSURE RULE");
    expect(block).not.toContain("MECHANISM SPOILER BAN");
  });

  it("B2: a reveal-class early clue in a pre-reveal chapter is embargoed (observation kept, spoiler reasoning dropped)", () => {
    const caseB2: any = {
      meta: { setting: { location: "Wynthorpe Manor" } },
      cast: [
        { name: "Inspector Fox", role: "detective", gender: "male" },
        { name: "Lady Beatrice", role_archetype: "suspect", gender: "female" },
        { name: "Sir Lionel", role_archetype: "victim", gender: "male" },
      ],
      culpability: { culprits: ["Lady Beatrice"] },
      prose_requirements: {
        discriminating_test_scene: { act_number: 2, scene_number: 1 },
        culprit_revelation_scene: { act_number: 2, scene_number: 2 },
        clue_to_scene_mapping: [
          { act_number: 1, scene_number: 1, clue_id: "clue_mechanism_core", delivery_method: "observation" },
        ],
      },
    };
    const sceneB2: any = { act: 1, sceneNumber: 1, title: "Discovery", setting: { location: "Study" }, characters: [] };
    const clueDistB2: any = {
      clues: [
        {
          id: "clue_mechanism_core",
          placement: "early",
          description: "Lady Beatrice wound back the clock by forty minutes to mask the time of death.",
          pointsTo: "the culprit Lady Beatrice",
        },
      ],
    };
    const block = buildChapterObligationBlock(
      [sceneB2],
      1,
      caseB2,
      [],
      undefined,
      clueDistB2,
      undefined,
      undefined,
      undefined,
      "opening",
      undefined,
      undefined,
      [sceneB2],
      "discovery_opening",
    );
    // The clue is still surfaced (so the validator's presence/early checks hold)...
    expect(block).toContain("[clue_mechanism_core]");
    // ...but the spoiler-driving reasoning block and "Points to" line are suppressed.
    expect(block).toContain("SPOILER EMBARGO (pre-reveal chapter)");
    expect(block).not.toContain("MANDATORY TWO-PARAGRAPH STRUCTURE");
    expect(block).not.toContain("explicitly reasons");
    expect(block).not.toContain("Points to: the culprit Lady Beatrice");
  });

  it("Fix 2 uses positive locked-fact phrasing in the prose prompt", () => {
    const prompt = buildProsePrompt(baseInputs, [baseScene], 1, []);
    expect(prompt.messages[0].content).toContain("NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES");
    expect(prompt.messages[0].content).toContain("it MUST use the exact phrase shown");
  });

  it("applies word_target_multiplier when sending chapter ideal words to the LLM prompt", () => {
    mockedGenerationParams.agent9_prose.story_length_policy.word_target_multiplier = 1.0;
    const baselinePrompt = buildProsePrompt(baseInputs, [baseScene], 1, []);
    const baselineJoined = baselinePrompt.messages.map((m) => m.content).join("\n\n");
    const baselineMatch = baselineJoined.match(/Target:\s*(\d+)\s*words per chapter/i);
    expect(baselineMatch).not.toBeNull();
    const baselineTarget = Number(baselineMatch?.[1] ?? 0);

    mockedGenerationParams.agent9_prose.story_length_policy.word_target_multiplier = 1.25;
    const boostedPrompt = buildProsePrompt(baseInputs, [baseScene], 1, []);
    const boostedJoined = boostedPrompt.messages.map((m) => m.content).join("\n\n");
    const boostedMatch = boostedJoined.match(/Target:\s*(\d+)\s*words per chapter/i);
    expect(boostedMatch).not.toBeNull();
    const boostedTarget = Number(boostedMatch?.[1] ?? 0);

    expect(boostedTarget).toBeGreaterThan(baselineTarget);
  });

  it("Fix 3 builds a frozen timeline state block from temporal lock and time anchors", () => {
    const block = buildTimelineStateBlock(
      { month: "november", season: "autumn" } as any,
      baseInputs.lockedFacts,
      baseCaseData.CASE,
    );

    expect(block).toContain("FROZEN FACT STATE (DO NOT ALTER)");
    expect(block).toContain("November (autumn)");
    expect(block).toContain("The mantel clock stopped at thirteen minutes to midnight.");
    expect(block).toContain("thirteen minutes to midnight");
  });

  it("Fix 4 uses an exclusive season allow-list in the prompt checklist", () => {
    const prompt = buildProsePrompt(baseInputs, [baseScene], 1, []);
    const joined = prompt.messages.map((m) => m.content).join("\n\n");
    expect(joined).toContain("Allowed seasonal words only: autumn, autumnal, fall.");
    expect(joined).toContain("Forbidden seasonal words: spring, summer, winter.");
  });

  it("Fix 5 strengthens discriminating-test checklist language into a concrete confrontation contract", () => {
    const caseData = {
      ...baseCaseData,
      CASE: {
        ...baseCaseData.CASE,
        cast: baseCast.characters,
      },
    };
    const outline: any = { acts: [{ act_number: 3, scenes: [{ scene_number: 1, title: "Trap", summary: "Trap scene mentions clue_clock." }] }] };
    const checklist = buildDiscriminatingTestChecklist(caseData, "3-3", outline, 3);
    expect(checklist).toContain("concrete scene beat");
    expect(checklist).toContain("confronts the culprit or key suspect directly");
    expect(checklist).toContain("real-time dramatic scene");
  });

  it("uses computed unresolved suspect count from investigation state in chapter outcome contract", () => {
    const prompt = buildProsePrompt(baseInputs, [baseScene], 2, []);
    const joined = prompt.messages.map((m) => m.content).join("\n\n");

    // Edgar is cleared in chapter 1, so chapter 2 should not report one unresolved suspect.
    expect(joined).toContain("approximately 0 unresolved suspect(s)");
  });

  it("emits one active narrative-balance block instead of layered percentage tables", () => {
    const prompt = buildProsePrompt(baseInputs, [baseScene], 2, []);
    const joined = prompt.messages.map((m) => m.content).join("\n\n");

    expect(buildNarrativeBalanceBlock("discriminating_test")).toContain("Mode-specific narrative balance targets:");
    expect(joined).toContain("Mode-specific narrative balance targets:");
    expect(joined).not.toContain("CHAPTER COMPOSITION TARGETS (MANDATORY NARRATIVE BALANCE)");
    expect(joined).not.toContain("Reference profile across chapter phases:");
  });

  it("provides advisory soft narrative-balance hints without creating hard failures", () => {
    const assessment = assessNarrativeBalanceSignals(
      {
        title: "Chapter 8",
        paragraphs: [
          "Fog settled against the windows while silence stretched between every breath in the drawing room.",
          "Cold lamplight and shadow did most of the talking before anyone dared move.",
        ],
      } as any,
      "discriminating_test",
    );

    expect(assessment.hints.length).toBeGreaterThan(0);
    expect(assessment.hints.join(" ")).toContain("Add one concise beat emphasizing");
  });

  it("Fix 6 detects recurring cross-chapter phrases", () => {
    const phrases = detectRecurringPhrases([
      { title: "1", paragraphs: ["The air hung cold and still beneath the rafters while the lamps shivered." ] },
      { title: "2", paragraphs: ["The air hung cold and still beneath the rafters while the lamps shivered." ] },
      { title: "3", paragraphs: ["The air hung cold and still beneath the rafters while the lamps shivered." ] },
    ] as any, 7, 3);

    expect(phrases.length).toBeGreaterThan(0);
    expect(phrases[0]).toContain("air hung cold and still");
  });

  it("Stage 9 detects configured phrase-family variants via normalization", () => {
    const hits = detectConfiguredBannedPhrases(
      [
        { title: "1", paragraphs: ["By the clock tower at three-fifteen, Clara slowed her pace."] },
        { title: "2", paragraphs: ["Another paragraph without the phrase family."] },
      ] as any,
      ["clock tower at quarter past three"],
    );

    expect(hits).toContain("clock tower at quarter past three");
  });

  it("Stage 9 emits banned_phrase linter issues for hard-ban matches", () => {
    const issues = lintBatchProse(
      [
        {
          title: "1",
          paragraphs: ["Near the clock tower at quarter past, Clara paused beside the gate."],
        },
      ] as any,
      [],
      [],
      {
        bannedPhrases: ["near the clock tower at quarter past"],
      },
    );

    expect(issues.some((issue) => issue.type === "banned_phrase")).toBe(true);
    expect(issues.some((issue) => /banned phrase detected/i.test(issue.message))).toBe(true);
  });

  it("Section 10 protects mechanical spring collocations during season lock rewrites", () => {
    const result = enforceMonthSeasonLockOnChapterWithTelemetry(
      {
        title: "1",
        paragraphs: [
          "The suspension spring rested beside the mainspring while autumn rain struck the pane.",
        ],
      } as any,
      { month: "january", season: "winter" },
      {
        contextAware: true,
        protectedCollocations: true,
        semanticDiffGuard: true,
      },
    );

    const rewritten = result.chapter.paragraphs[0] ?? "";
    expect(rewritten).toContain("suspension spring");
    expect(rewritten).toContain("mainspring");
    expect(rewritten).toContain("winter rain");
    expect(result.telemetry.protectedCollisionsBlocked).toBeGreaterThan(0);
  });

  it("Section 10 boundary linter flags malformed apostrophes and unbalanced quotes", () => {
    const issues = lintBatchProse(
      [
        {
          title: "1",
          paragraphs: ["The clock'paused as she whispered, \"Not now."],
        },
      ] as any,
      [],
      [],
      { boundaryIntegrityGateEnabled: true },
    );

    expect(issues.some((issue) => issue.type === "boundary_integrity")).toBe(true);
  });

  it("Section 10 flags repeated paragraph openers within a chapter", () => {
    const issues = lintBatchProse(
      [
        {
          title: "1",
          paragraphs: [
            "Clara checked the hallway before she spoke.",
            "Clara crossed to the mantel and lifted the envelope.",
            "Clara studied the torn page under the lamp.",
            "Nora watched without interrupting.",
          ],
        },
      ] as any,
      [],
      [],
      {},
    );

    expect(issues.some((issue) => issue.type === "template_bleed" && /repeated content opener/i.test(issue.message))).toBe(true);
  });

  it("Section 10 ignores repeated function-word openers in isolation", () => {
    const issues = lintBatchProse(
      [
        {
          title: "1",
          paragraphs: [
            "The clock clicked once as she leaned closer.",
            "The window rattled as rain intensified.",
            "He moved aside when Clara entered.",
          ],
        },
      ] as any,
      [],
      [],
      {},
    );

    expect(issues.some((issue) => issue.type === "template_bleed" && /repeated content opener/i.test(issue.message))).toBe(false);
  });

  it("R1 (ANALYSIS_44): reports EVERY distinct repeated opener in one pass, not just the first", () => {
    const issues = lintBatchProse(
      [
        {
          title: "1",
          paragraphs: [
            "Lady Beatrice paused at the threshold.",
            "Lady Beatrice studied the broken latch.",
            "George Langley wiped his hands on his apron.",
            "George Langley avoided the inspector's eyes.",
          ],
        },
      ] as any,
      [],
      [],
      {},
    );

    const openerIssues = issues.filter(
      (issue) => issue.type === "template_bleed" && /repeated content opener/i.test(issue.message),
    );
    // Old break-at-first behaviour emitted only one issue; R1 must surface both openers.
    expect(openerIssues.length).toBe(2);
    expect(openerIssues.some((issue) => /lady beatrice/i.test(issue.message))).toBe(true);
    expect(openerIssues.some((issue) => /george langley/i.test(issue.message))).toBe(true);
  });

  it("R1 (ANALYSIS_44): does not emit duplicate issues when one opener repeats 3+ times", () => {
    const issues = lintBatchProse(
      [
        {
          title: "1",
          paragraphs: [
            "Lady Beatrice paused at the threshold.",
            "Lady Beatrice studied the broken latch.",
            "Lady Beatrice turned to the inspector.",
            "Nora watched in silence.",
          ],
        },
      ] as any,
      [],
      [],
      {},
    );

    const openerIssues = issues.filter(
      (issue) => issue.type === "template_bleed" && /repeated content opener/i.test(issue.message),
    );
    expect(openerIssues.length).toBe(1);
    expect(/lady beatrice/i.test(openerIssues[0].message)).toBe(true);
  });

  it("Fix 7 runs targeted atmosphere repair only for chapters containing banned phrases", async () => {
    const bannedPhrase = "the air hung cold and still beneath the rafters while the lamps shivered";
    const chat = vi.fn().mockResolvedValue({
      // The implementation uses parsePhraseReplacementsResponse which expects {"replacements":[...]}
      content: JSON.stringify({
        replacements: [
          {
            original: bannedPhrase,
            replacement: "fresh rain rattled the casement while Clara watched the corridor",
          },
        ],
      }),
    });
    const client: any = { chat };

    const result = await runAtmosphereRepairIfNeeded(
      client,
      [
        { title: "1", paragraphs: ["The air hung cold and still beneath the rafters while the lamps shivered."] },
        { title: "2", paragraphs: ["A different sentence entirely."] },
      ] as any,
      [bannedPhrase],
      "test-model",
      "run-1",
      "proj-1",
    );

    expect(chat).toHaveBeenCalledTimes(1);
    // applyPhraseSubstitutions capitalises replacement when original match was sentence-case
    expect(result[0].paragraphs[0]).toContain("Fresh rain rattled the casement");
    expect(result[1].paragraphs[0]).toBe("A different sentence entirely.");
  });

  it("Stage 9 removes fixed repair cap and processes all matching chapters", async () => {
    const bannedPhrase = "the air hung cold and still beneath the rafters while the lamps shivered";
    const chat = vi.fn().mockResolvedValue({
      content: JSON.stringify({
        replacements: [
          {
            original: bannedPhrase,
            replacement: "fresh rain rattled the casement while Clara watched the corridor",
          },
        ],
      }),
    });
    const client: any = { chat };

    const chapters = Array.from({ length: 9 }, (_, i) => ({
      title: `${i + 1}`,
      paragraphs: ["The air hung cold and still beneath the rafters while the lamps shivered."],
    }));

    const result = await runAtmosphereRepairIfNeeded(
      client,
      chapters as any,
      [bannedPhrase],
      "test-model",
      "run-1",
      "proj-1",
    );

    expect(chat).toHaveBeenCalledTimes(9);
    expect(result.every((ch) => ch.paragraphs[0].includes("Fresh rain rattled the casement"))).toBe(true);
  });

  it("Fix 8 tells underflow expansion to overshoot and avoid filler recap", async () => {
    const chat = vi.fn().mockResolvedValue({
      content: JSON.stringify({
        chapter: {
          title: "Expanded",
          summary: "expanded",
          paragraphs: ["expanded paragraph one", "expanded paragraph two"],
        },
      }),
    });
    const client: any = { chat };

    await attemptUnderflowExpansion(
      client,
      { title: "Short", paragraphs: [new Array(50).fill("word").join(" ")] } as any,
      2,
      baseScene,
      { chapterNumber: 2, hardFloorWords: 800, preferredWords: 1300, requiredClueIds: ["clue_clock"] } as any,
      "test-model",
      "run-1",
      "proj-1",
    );

    const userPrompt = chat.mock.calls[0][0].messages[1].content as string;
    expect(userPrompt).toContain("Hard minimum: 800 words. Do not return below this minimum.");
    expect(userPrompt).toContain("Overshoot rather than undershoot");
    expect(userPrompt).toContain("Do not stop at the first threshold crossing");
    expect(userPrompt).toContain("Never pad with recap or repeated atmosphere");
  });

  it("Fix 9 includes audit in the prompt schema and strips it from parsed payloads", () => {
    const prompt = buildProsePrompt(baseInputs, [baseScene], 1, []);
    expect(prompt.developer).toContain('"audit"');

    const stripped = stripAuditField({
      status: "draft",
      chapters: [],
      cast: [],
      audit: { locked_fact_phrases: "absent" },
    });
    expect(stripped.audit).toBeUndefined();
    expect(stripped.status).toBe("draft");
  });

  it("aligns reveal implications with two-phase injection (groundwork before late-story full reveal)", () => {
    const earlyInputs = {
      ...baseInputs,
      outline: {
        acts: [{ act_number: 1, scenes: [baseScene] }],
        totalScenes: 10,
      },
      worldDocument: {
        revealImplications:
          "Mrs. Vale hesitates when asked about the clock. On the reveal, this pause proves she knew the true time of death.",
      },
    };

    const earlyPrompt = buildProsePrompt(earlyInputs as any, [baseScene], 3, []);
    const earlySystem = earlyPrompt.messages[0].content;
    expect(earlySystem).toContain("## Reveal Groundwork");
    expect(earlySystem).not.toContain("## Reveal Implications (plant these subtly)");

    const latePrompt = buildProsePrompt(earlyInputs as any, [baseScene], 9, []);
    const lateSystem = latePrompt.messages[0].content;
    expect(lateSystem).toContain("## Reveal Implications (plant these subtly)");
  });

  it("does not leak window-scoped reveal atoms through generic texture pool", () => {
    const inputs = {
      ...baseInputs,
      worldDocument: {
        revealImplications: "UNIQUE_REVEAL_LEAK_SENTENCE that must remain window-gated.",
      },
      characterProfiles: { profiles: [] },
      locationProfiles: undefined,
      temporalContext: undefined,
      narrativeState: {
        lockedFacts: [],
        characterPronouns: {},
        cluesRevealedToReader: [],
        continuityTail: "",
        deployedAssets: {},
        lastUsedSensoryVariant: {},
        recurringPhraseWarnings: [],
      },
    };

    const prompt = buildProsePrompt(inputs as any, [baseScene], 1, []);
    const system = prompt.messages[0].content;
    expect(system).not.toContain("## Texture Pool");
    expect(system).not.toContain("UNIQUE_REVEAL_LEAK_SENTENCE");
  });

  it("adds explicit continuity handoff guidance to narrative state block when continuity tail exists", () => {
    const prompt = buildProsePrompt(
      {
        ...baseInputs,
        narrativeState: {
          lockedFacts: [],
          characterPronouns: {},
          cluesRevealedToReader: [],
          continuityTail: "She left the ledger open at the line naming Edgar's payment.",
          deployedAssets: {},
          lastUsedSensoryVariant: {},
          recurringPhraseWarnings: [],
        },
      } as any,
      [baseScene],
      4,
      [
        {
          chapterNumber: 3,
          title: "Chapter 3: The Ledger",
          charactersPresent: ["Clara Whitfield"],
          settingTerms: ["study"],
          keyEvents: ["She closed the ledger without looking up."],
        },
      ],
    );

    const system = prompt.messages[0].content;
    expect(system).toContain("CONTINUITY HANDOFF");
    expect(system).toContain("She left the ledger open at the line naming Edgar's payment.");
    expect(system).toContain("must open as a continuation");
  });

  it("sanitizes banned atmosphere phrase families from continuity handoff excerpts", () => {
    const prompt = buildProsePrompt(
      {
        ...baseInputs,
        narrativeState: {
          lockedFacts: [],
          characterPronouns: {},
          cluesRevealedToReader: [],
          continuityTail:
            "Salt air gathered in the stairwell as she paused. She left the ledger open at the line naming Edgar's payment.",
          deployedAssets: {},
          lastUsedSensoryVariant: {},
          recurringPhraseWarnings: [],
        },
      } as any,
      [baseScene],
      4,
      [],
    );

    const system = prompt.messages[0].content;
    expect(system).toContain("CONTINUITY HANDOFF");
    expect(system).toContain("She left the ledger open at the line naming Edgar's payment.");
    expect(system.toLowerCase()).not.toContain("salt air");
  });

  it("sanitizes continuity-tail text in chapter obligation continuity bridge", () => {
    const block = buildChapterObligationBlock(
      [baseScene],
      4,
      baseCaseData.CASE,
      baseInputs.lockedFacts,
      { month: "november", season: "autumn" } as any,
      undefined,
      undefined,
      undefined,
      {
        lockedFacts: [],
        characterPronouns: {},
        cluesRevealedToReader: [],
        continuityTail:
          "Salt air gathered in the stairwell as she paused. She left the ledger open at the line naming Edgar's payment.",
        deployedAssets: {},
        lastUsedSensoryVariant: {},
        recurringPhraseWarnings: [],
      } as any,
    );

    expect(block).toContain("Carry forward one unresolved element");
    expect(block).toContain("She left the ledger open at the line naming Edgar's payment.");
    expect(block.toLowerCase()).not.toContain("salt air");
  });

  it("adds continuity checks to the pre-submit checklist when continuity is available", () => {
    const prompt = buildProsePrompt(
      {
        ...baseInputs,
        narrativeState: {
          lockedFacts: [],
          characterPronouns: {},
          cluesRevealedToReader: [],
          continuityTail: "A key turned in the corridor door.",
          deployedAssets: {},
          lastUsedSensoryVariant: {},
          recurringPhraseWarnings: [],
        },
      } as any,
      [
        baseScene,
        {
          ...baseScene,
          sceneNumber: 2,
          title: "Aftermath",
          summary: "The questioning continues.",
        },
      ],
      5,
      [],
    );

    const checklist = prompt.messages[prompt.messages.length - 1].content;
    expect(checklist).toContain("First chapter in this batch opens by continuing the previous chapter closing beat");
    expect(checklist).toContain("Each chapter opening after the first clearly hands off from the previous chapter ending");
  });

  it("injects setting, background, and fair-play contract blocks when upstream artifacts are present", () => {
    const caseData = {
      ...baseCaseData,
      SETTING_REFINEMENT: {
        era: {
          decade: "1930s",
          technology: ["Valve radios", "Manual typewriters"],
          communication: ["Operator-routed calls"],
          socialNorms: ["Formal address in public rooms"],
          policing: ["Local constabulary first response"],
        },
        location: {
          type: "Country manor",
          description: "A rain-locked estate",
          physicalConstraints: ["Single usable stair after midnight"],
          geographicIsolation: "Nearest town is forty minutes away by car.",
          accessControl: ["Library key held by butler after dinner"],
        },
        atmosphere: {
          weather: "cold rain",
          timeOfDay: "night",
          mood: "contained dread",
        },
        realism: {
          recommendations: ["Keep telephony delayed by switchboard traffic"],
        },
      },
      BACKGROUND_CONTEXT: {
        status: "ok",
        backdropSummary: "An inheritance dispute traps heirs and staff in performative civility.",
        era: { decade: "1930s", socialStructure: "gentry and servants under shared scandal pressure" },
        setting: { location: "Blackwood Hall", institution: "private residence", weather: "rain" },
        castAnchors: ["Clara Whitfield", "Edgar Vale"],
        theme: "Respectability versus truth",
      },
      CASE: {
        ...baseCaseData.CASE,
        fair_play: {
          explanation: "All decisive evidence appears before confrontation.",
        },
      },
    } as any;

    const prompt = buildProsePrompt(
      {
        ...baseInputs,
        caseData,
      } as any,
      [baseScene],
      4,
      [],
    );

    const system = prompt.messages[0].content;
    expect(system).toContain("SETTING REFINEMENT CONSTRAINTS");
    expect(system).toContain("BACKGROUND CONTEXT (social coherence anchor)");
    expect(system).toContain("FAIR-PLAY AND INFERENCE CONTRACT");
  });
});

describe("post-pass polish", () => {
  it("rolls back the polished candidate when validation regresses", async () => {
    const chapter = {
      title: "Chapter 8: The Trap",
      paragraphs: [
        "Clara gathered the household in the drawing room and set the rewound clock where everyone could see it.",
        "She spoke carefully, making the comparison plain without yet naming the killer.",
      ],
    };
    const repairContext = buildChapterRepairContext({
      chapterNumber: 8,
      scene: baseScene,
      sceneCount: 10,
      caseData: baseCaseData,
      cmlCase: baseCaseData.CASE,
      scenes: [baseScene],
      dtSceneCheck: { act_number: 3, scene_number: 1 },
      ledgerEntry: {
        chapterNumber: 8,
        hardFloorWords: 1,
        preferredWords: 1,
        requiredClueIds: ["clue_clock"],
        clueObligationContext: [
          {
            id: "clue_clock",
            description: "The mantel clock has been rewound.",
            placement: "early",
          },
        ],
      } as any,
      clueDistribution: baseInputs.clueDistribution,
      matchingClearances: [{ suspect_name: "Edgar Vale" }],
    });
    const client = {
      chat: vi.fn().mockResolvedValue({
        content: JSON.stringify({
          status: "draft",
          chapters: [
            {
              title: "Chapter 8: The Trap",
              paragraphs: [
                "Clara gathered the household in the drawing room.",
                "She spoke carefully, but the decisive object was no longer named.",
              ],
            },
          ],
        }),
      }),
    } as any;

    const prompt = buildPostPassPolishPrompt({ chapter, repairContext });
    const result = await polishPassingChapter({
      chapter,
      client,
      repairContext,
      validateCandidate: (candidate) => ({
        chapter: candidate,
        hardErrors: candidate.paragraphs.join(" ").includes("rewound clock") ? [] : ["missing clue"],
      }),
    });

    expect(prompt).toContain("QUALITY-ONLY POLISH PASS");
    expect(prompt).toContain("Edgar Vale");
    expect(result.keptPolishedVersion).toBe(false);
    expect(result.rollbackReason).toBe("validation_regression");
    expect(result.chapter).toEqual(chapter);
  });

  it("rolls back polished output when obligation-bearing clues are removed", async () => {
    const chapter = {
      title: "Chapter 8: The Trap",
      paragraphs: [
        "Clara gathered the household in the drawing room and set the rewound clock where everyone could see it.",
        "She compared the clock marks against the witness timings before anyone could dodge the conclusion.",
      ],
    };
    const repairContext = buildChapterRepairContext({
      chapterNumber: 8,
      scene: baseScene,
      sceneCount: 10,
      caseData: baseCaseData,
      cmlCase: baseCaseData.CASE,
      scenes: [baseScene],
      dtSceneCheck: { act_number: 3, scene_number: 1 },
      ledgerEntry: {
        chapterNumber: 8,
        hardFloorWords: 1,
        preferredWords: 1,
        requiredClueIds: ["clue_clock"],
      } as any,
      clueDistribution: baseInputs.clueDistribution,
      matchingClearances: [{ suspect_name: "Edgar Vale" }],
    });
    const client = {
      chat: vi.fn().mockResolvedValue({
        content: JSON.stringify({
          status: "draft",
          chapters: [
            {
              title: "Chapter 8: The Trap",
              paragraphs: [
                "Clara gathered the household in the drawing room and spoke with deliberate calm.",
                "She moved from one statement to the next without naming the physical evidence.",
              ],
            },
          ],
        }),
      }),
    } as any;

    expect(hasPolishRegression({
      original: chapter as any,
      polished: chapter as any,
      repairContext,
    })).toBe(false);

    const result = await polishPassingChapter({
      chapter: chapter as any,
      client,
      repairContext,
      // Simulate a validator pass so the obligation guard is the deciding protection.
      validateCandidate: (candidate) => ({
        chapter: candidate,
        hardErrors: [],
      }),
    });

    expect(result.keptPolishedVersion).toBe(false);
    expect(result.rollbackReason).toBe("obligation_regression");
    expect(result.chapter).toEqual(chapter);
  });

  it("does not flag metadata-only clue obligations that were never explicit in original prose", () => {
    const repairContext = buildChapterRepairContext({
      chapterNumber: 2,
      scene: baseScene,
      sceneCount: 10,
      caseData: baseCaseData,
      cmlCase: baseCaseData.CASE,
      scenes: [baseScene],
      dtSceneCheck: { act_number: 3, scene_number: 1 },
      ledgerEntry: {
        chapterNumber: 2,
        hardFloorWords: 1,
        preferredWords: 1,
        requiredClueIds: ["clue_meta"],
        clueObligationContext: [
          {
            id: "clue_meta",
            description: "Direct observation",
            placement: "early",
          },
        ],
      } as any,
      clueDistribution: undefined,
      matchingClearances: [],
    });

    const original = {
      title: "Chapter 2",
      paragraphs: [
        "Clara held the room in silence and watched every witness choose their words with care.",
        "No one volunteered certainty, but the timeline had begun to tighten around one contradiction.",
      ],
    };
    const polished = {
      title: "Chapter 2",
      paragraphs: [
        "Clara held the room in patient silence, watching each witness choose their words with care.",
        "No one offered certainty, yet the timeline tightened around one stubborn contradiction.",
      ],
    };

    expect(hasPolishRegression({
      original: original as any,
      polished: polished as any,
      repairContext,
    })).toBe(false);
  });
});
