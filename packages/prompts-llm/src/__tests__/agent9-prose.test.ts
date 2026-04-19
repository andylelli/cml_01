import { describe, expect, it, vi } from "vitest";

const mockedGenerationParams = {
  story_length_policy: {
    targets: { short: 10, medium: 20, long: 30 },
    chapter_target_tolerance: 2,
    word_targets: {
      short: { chapter_count: 10, min_words: 7500, max_words: 12500, chapter_ideal_words: 1000 },
      medium: { chapter_count: 20, min_words: 25500, max_words: 42500, chapter_ideal_words: 1300 },
      long: { chapter_count: 30, min_words: 49500, max_words: 82500, chapter_ideal_words: 1800 },
    },
    total_word_budget_ratio: { min_ratio: 0.75, max_ratio: 1.25 },
  },
  agent9_prose: {
    story_length_policy: {
      targets: { short: 10, medium: 20, long: 30 },
      chapter_target_tolerance: 2,
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
  attemptUnderflowExpansion,
  buildChapterObligationBlock,
  buildDiscriminatingTestChecklist,
  buildProsePrompt,
  buildTimelineStateBlock,
  detectRecurringPhrases,
  formatProvisionalScoringFeedbackBlock,
  runAtmosphereRepairIfNeeded,
  stripAuditField,
  validateChapterPreCommitObligations,
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
    expect(block).toContain("Edgar Vale via timeline contradiction");
    expect(block).toContain("Seasonal vocabulary allow-list: autumn, autumnal, fall.");
  });

  it("Fix 2 uses positive locked-fact phrasing in the prose prompt", () => {
    const prompt = buildProsePrompt(baseInputs, [baseScene], 1, []);
    expect(prompt.messages[0].content).toContain("NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES");
    expect(prompt.messages[0].content).toContain("it MUST use the exact phrase shown");
  });

  it("Fix 3 builds a frozen timeline state block from temporal lock and time anchors", () => {
    const block = buildTimelineStateBlock(
      { month: "november", season: "autumn" } as any,
      baseInputs.lockedFacts,
      baseCaseData.CASE,
    );

    expect(block).toContain("FROZEN TIMELINE STATE");
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

  it("Fix 6 detects recurring cross-chapter phrases", () => {
    const phrases = detectRecurringPhrases([
      { title: "1", paragraphs: ["The air hung cold and still beneath the rafters while the lamps shivered." ] },
      { title: "2", paragraphs: ["The air hung cold and still beneath the rafters while the lamps shivered." ] },
      { title: "3", paragraphs: ["The air hung cold and still beneath the rafters while the lamps shivered." ] },
    ] as any, 7, 3);

    expect(phrases.length).toBeGreaterThan(0);
    expect(phrases[0]).toContain("air hung cold and still");
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
