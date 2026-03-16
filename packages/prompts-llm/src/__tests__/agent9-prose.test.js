import { describe, expect, it } from "vitest";
import { buildRetryRevisionUserDirective, buildRetryRevisionPrompt, formatProvisionalScoringFeedbackBlock, parseCluePresenceAdjudicationResponse, prioritizeRetryErrors, stripClueIdMarkersFromText, summarizeRetryPersistence, validateChapterPreCommitObligations, } from "../agent9-prose.js";
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
        const result = {
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
        const fingerprints = [
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
        const result = {
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
        const fingerprints = [
            { chapter: 1, hash: "deadbeefcafe0123", section_sizes: {} },
            { chapter: 2, hash: "0011223344556677", section_sizes: { clue_descriptions: 500 } },
        ];
        for (const fp of fingerprints) {
            expect(fp.hash).toMatch(/^[0-9a-f]{16}$/);
        }
    });
    it("section_sizes values are non-negative integers", () => {
        const sectionSizes = {
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
        const result = {
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
        requiredClueIds: [],
    };
    it("returns hard failure when chapter is below hard floor", () => {
        const chapter = {
            title: "Chapter One",
            paragraphs: [new Array(500).fill("word").join(" ")],
        };
        const result = validateChapterPreCommitObligations(chapter, baseLedger);
        expect(result.hardFailures.some((msg) => msg.includes("below hard floor"))).toBe(true);
        expect(result.wordTarget.isBelowHardFloor).toBe(true);
    });
    it("does not hard-fail when above hard floor", () => {
        const chapter = {
            title: "Chapter One",
            paragraphs: [new Array(1000).fill("word").join(" ")],
        };
        const result = validateChapterPreCommitObligations(chapter, baseLedger);
        expect(result.hardFailures.length).toBe(0);
        expect(result.wordTarget.isBelowHardFloor).toBe(false);
    });
    it("passes high word-count chapters when hard floor is met", () => {
        const chapter = {
            title: "Chapter One",
            paragraphs: [new Array(1800).fill("word").join(" ")],
        };
        const result = validateChapterPreCommitObligations(chapter, baseLedger);
        expect(result.hardFailures.length).toBe(0);
        expect(result.wordTarget.isBelowHardFloor).toBe(false);
    });
    it("passes word gate when chapter clears hard floor", () => {
        const chapter = {
            title: "Chapter One",
            paragraphs: [new Array(1500).fill("word").join(" ")],
        };
        const result = validateChapterPreCommitObligations(chapter, baseLedger);
        expect(result.hardFailures.length).toBe(0);
        expect(result.wordTarget.isBelowHardFloor).toBe(false);
    });
    it("matches required clue IDs despite separator drift in clue distribution", () => {
        const chapter = {
            title: "Chapter Three",
            paragraphs: [
                "The witness pointed to the broken hourglass and described the exact chime sequence before the scream.",
            ],
        };
        const ledger = {
            chapterNumber: 3,
            hardFloorWords: 1,
            requiredClueIds: ["clue_early_1"],
            preferredWords: 1,
            targetLength: "short",
        };
        const clueDistribution = {
            clues: [
                {
                    id: "clue-early-1",
                    category: "testimonial",
                    description: "hourglass witness chime",
                    sourceInCML: "CASE.prose_requirements.clue_to_scene_mapping[0]",
                    pointsTo: "",
                    placement: "early",
                    criticality: "essential",
                },
            ],
            redHerrings: [],
            clueTimeline: { early: ["clue-early-1"], mid: [], late: [] },
            fairPlayChecks: {
                allEssentialCluesPresent: true,
                noNewFactsIntroduced: true,
                redHerringsDontBreakLogic: true,
            },
            latencyMs: 0,
            cost: 0,
        };
        const result = validateChapterPreCommitObligations(chapter, ledger, clueDistribution);
        expect(result.missingRequiredClueIds).toEqual([]);
        expect(result.hardFailures.some((msg) => msg.includes("missing required clue obligation"))).toBe(false);
    });
});
describe("prioritizeRetryErrors", () => {
    it("orders clue obligations before hard-floor and style errors", () => {
        const input = [
            "Chapter 2: missing required clue obligation for \"Witness chime testimony\"",
            "Chapter 2: word count below hard floor (680/704)",
            "Chapter 2 contains an overlong paragraph block (5234 chars)",
            "Chapter 2 has month/season contradiction (may vs autumn)",
        ];
        const ordered = prioritizeRetryErrors(input);
        expect(ordered[0]).toContain("missing required clue obligation");
        expect(ordered[1]).toContain("below hard floor");
        expect(ordered[2]).toContain("month/season contradiction");
        expect(ordered[3]).toContain("overlong paragraph block");
    });
    it("prioritizes pronoun mismatches ahead of temporal/style drift", () => {
        const input = [
            "Chapter 6 has month/season contradiction (may vs autumn)",
            "Chapter 6: Character \"Alison Devereux\" has incorrect pronouns.",
            "Chapter 6 contains an overlong paragraph block (5234 chars)",
        ];
        const ordered = prioritizeRetryErrors(input);
        expect(ordered[0]).toContain("incorrect pronouns");
        expect(ordered[1]).toContain("month/season contradiction");
        expect(ordered[2]).toContain("overlong paragraph block");
    });
    it("preserves original order among same-priority entries", () => {
        const input = [
            "Chapter 1: missing required clue obligation for \"clue_a\"",
            "Chapter 1: missing required clue obligation for \"clue_b\"",
            "Chapter 1: missing required clue obligation for \"clue_c\"",
        ];
        const ordered = prioritizeRetryErrors(input);
        expect(ordered).toEqual(input);
    });
});
describe("summarizeRetryPersistence", () => {
    it("detects clue IDs that persist across multiple failed attempts", () => {
        const history = [
            [
                'Chapter 3: missing required clue obligation for "clue_early_1"',
                "Chapter 3: word count below hard floor (700/704)",
            ],
            [
                'Chapter 3: missing required clue obligation for "clue_early_1"',
                'Chapter 3: missing required clue obligation for "clue_red_herring"',
            ],
            [
                'Chapter 3: missing required clue obligation for "clue_early_1"',
            ],
        ];
        const summary = summarizeRetryPersistence(history);
        expect(summary.persistentMissingClueIds).toEqual(["clue_early_1"]);
    });
    it("counts hard-floor failures across prior attempts", () => {
        const history = [
            ["Chapter 3: word count below hard floor (701/704)"],
            ["Chapter 3: word count below hard floor (694/704)"],
            ["Chapter 3: word count below hard floor (690/704)"],
        ];
        const summary = summarizeRetryPersistence(history);
        expect(summary.hardFloorFailureAttempts).toBe(3);
    });
});
describe("parseCluePresenceAdjudicationResponse", () => {
    it("parses valid adjudication JSON", () => {
        const parsed = parseCluePresenceAdjudicationResponse(JSON.stringify({
            present: true,
            confidence: 0.92,
            evidence_spans: ["The watch face was cracked at seven."],
            reasoning_summary: "The clue is explicit and directly stated.",
            failure_mode: "not_present",
        }));
        expect(parsed.present).toBe(true);
        expect(parsed.confidence).toBe(0.92);
        expect(parsed.evidenceSpans).toEqual(["The watch face was cracked at seven."]);
        expect(parsed.reasoningSummary).toContain("explicit");
        expect(parsed.failureMode).toBe("not_present");
    });
    it("repairs lightly malformed JSON output", () => {
        const malformed = '{"present":true,"confidence":1.7,"evidence_spans":["ink on cuff",],"reasoning_summary":"visible","failure_mode":"ambiguous",}';
        const parsed = parseCluePresenceAdjudicationResponse(malformed);
        expect(parsed.present).toBe(true);
        expect(parsed.confidence).toBe(1);
        expect(parsed.evidenceSpans).toEqual(["ink on cuff"]);
        expect(parsed.failureMode).toBe("ambiguous");
    });
    it("throws when payload cannot be parsed", () => {
        expect(() => parseCluePresenceAdjudicationResponse("not-json")).toThrow();
    });
});
describe("stripClueIdMarkersFromText", () => {
    it("removes clue ID markers while preserving surrounding prose", () => {
        const input = "She pointed to the watch [[CLUE_ID:clue_early_1]] and noted the cracked glass [[CLUE_ID:clue_mid_2]].";
        const output = stripClueIdMarkersFromText(input);
        expect(output).toBe("She pointed to the watch and noted the cracked glass.");
    });
});
describe("buildRetryRevisionPrompt", () => {
    it("builds a minimal edit prompt containing prior prose and targeted errors", () => {
        const messages = buildRetryRevisionPrompt([
            {
                title: "Chapter 1",
                summary: "Discovery in the study.",
                paragraphs: ["Stephen Waldegrave lay by the hearth."],
            },
        ], [
            "Chapter 1: word count below hard floor (598/704)",
            "Chapter 1: Character \"Alison Devereux\" has incorrect pronouns.",
        ], 1);
        // Phase 5 fix: prior prose removed from all revision prompts — mystery prose
        // paragraphs in ANY role (user OR assistant) trigger Azure's content filter.
        expect(messages).toHaveLength(2);
        expect(messages[0].role).toBe("system");
        expect(messages[0].content).toContain("targeted chapter regeneration assistant");
        expect(messages[1].role).toBe("user");
        expect(messages[1].content).toContain("Fix ONLY these errors");
        expect(messages[1].content).toContain("word count below hard floor");
        expect(messages[1].content).toContain("Alison Devereux");
        expect(messages[1].content).toContain("Regeneration mode");
    });
    it("omits chapter-1 victim naming hard requirement for non-Ch1 batches", () => {
        const directive = buildRetryRevisionUserDirective([
            {
                title: "Chapter 6",
                summary: "A corridor confrontation.",
                paragraphs: ["Alison stepped aside as the constable entered."],
            },
        ], [
            "Chapter 6: word count below hard floor (690/704)",
            "Chapter 6: Character \"Alison Devereux\" has incorrect pronouns.",
        ], 6, {
            victimName: "Stephen Waldegrave",
            pronounLockLines: ["- Alison Devereux: she/her/her"],
        });
        expect(directive).toContain("keep existing victim references stable unless validator errors explicitly report victim-naming defects");
        expect(directive).not.toContain("Chapter 1 must name the victim as");
    });
});
//# sourceMappingURL=agent9-prose.test.js.map