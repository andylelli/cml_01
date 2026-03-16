import { describe, expect, it } from "vitest";
import { __testables } from "../jobs/mystery-orchestrator.js";
describe("mystery orchestrator fix coverage", () => {
    it("deterministic clue pre-assignment reaches minimum coverage", () => {
        const narrative = {
            acts: [
                { actNumber: 1, scenes: [{ sceneNumber: 1 }, { sceneNumber: 2 }, { sceneNumber: 3 }, { sceneNumber: 4 }] },
                { actNumber: 2, scenes: [{ sceneNumber: 5 }, { sceneNumber: 6 }, { sceneNumber: 7 }] },
                { actNumber: 3, scenes: [{ sceneNumber: 8 }, { sceneNumber: 9 }, { sceneNumber: 10 }] },
            ],
        };
        const cml = {
            CASE: {
                prose_requirements: {
                    clue_to_scene_mapping: [{ clue_id: "c1", act_number: 1, scene_number: 2 }],
                },
            },
        };
        const clues = {
            clues: [
                { id: "c1", criticality: "essential", placement: "early" },
                { id: "c2", criticality: "essential", placement: "mid" },
                { id: "c3", criticality: "supporting", placement: "late" },
                { id: "c4", criticality: "supporting", placement: "early" },
            ],
            clueTimeline: { early: ["c1", "c4"], mid: ["c2"], late: ["c3"] },
        };
        const stats = __testables.applyDeterministicCluePreAssignment(narrative, cml, clues, 0.6);
        expect(stats.after).toBeGreaterThanOrEqual(stats.minRequired);
        const mappedScene = narrative.acts[0].scenes.find((s) => s.sceneNumber === 2);
        expect(mappedScene?.cluesRevealed).toContain("c1");
    });
    it("scene count floor rejects total and per-act shrink", () => {
        const baseline = {
            acts: [
                { actNumber: 1, scenes: [{ sceneNumber: 1 }, { sceneNumber: 2 }] },
                { actNumber: 2, scenes: [{ sceneNumber: 3 }, { sceneNumber: 4 }] },
                { actNumber: 3, scenes: [{ sceneNumber: 5 }, { sceneNumber: 6 }] },
            ],
        };
        const candidate = {
            acts: [
                { actNumber: 1, scenes: [{ sceneNumber: 1 }, { sceneNumber: 2 }] },
                { actNumber: 2, scenes: [{ sceneNumber: 3 }] },
                { actNumber: 3, scenes: [{ sceneNumber: 4 }, { sceneNumber: 5 }] },
            ],
        };
        const lock = __testables.captureNarrativeSceneCountSnapshot(baseline);
        const check = __testables.checkNarrativeSceneCountFloor(candidate, lock);
        expect(check.ok).toBe(false);
        expect(check.message).toContain("changed");
    });
    it("prose post-processing rewrites scaffold leakage and dedups repeated long paragraphs", () => {
        const scaffold = "At the old hall, the smell of oil and wet stone mixed with wind and weather, creating an atmosphere ripe for revelation.";
        const repeated = "This is an intentionally long repeated paragraph used for deterministic dedup testing. ".repeat(4);
        const prose = {
            chapters: [
                { title: "Ch1", paragraphs: [scaffold, repeated] },
                { title: "Ch2", paragraphs: [repeated] },
            ],
        };
        const locationProfiles = [{ name: "The Hall", place: "Harrow", country: "England" }];
        const processed = __testables.applyDeterministicProsePostProcessing(prose, locationProfiles);
        expect(processed.chapters[0].paragraphs.some((p) => /atmosphere\s+ripe\s+for\s+revelation/i.test(p))).toBe(false);
        expect(processed.chapters[1].paragraphs[0]).not.toBe(repeated);
    });
    it("identity alias detector flags role-only aliases after reveal", () => {
        const prose = {
            chapters: [
                { paragraphs: ["John Smith confessed to the murder."] },
                { paragraphs: ["The killer watched from the doorway."] },
            ],
        };
        const cml = { CASE: { culpability: { culprits: ["John Smith"] } } };
        const issues = __testables.detectIdentityAliasBreaks(prose, cml);
        expect(issues.length).toBeGreaterThan(0);
        expect(issues[0]?.chapterIndex).toBe(1);
    });
    it("suspect elimination classifier recognizes alias error keys", () => {
        const err = { type: "suspect_elimination_coverage_incomplete", message: "coverage missing" };
        expect(__testables.isSuspectEliminationCoverageError(err)).toBe(true);
    });
    it("aborted prose summary emits canonical progress metrics with legacy aliases", () => {
        const targetMeta = {
            source: "story-length-targets-v1",
            fingerprint: "abc123",
            target_length: "short",
            target: {
                scenes: 20,
                chapters: 20,
                minWords: 15000,
                maxWords: 25000,
                chapterMinWords: 1300,
            },
        };
        const summary = __testables.buildAbortedProseSummary({
            expectedChaptersTotal: 20,
            chaptersGeneratedCommitted: 7,
            targetMeta,
            scoreTotal: 83,
            failureReason: "chapter validation failed",
            startedAtMs: Date.now() - 200,
            proseCost: 0.1,
            batchSize: 1,
            templateLinterFailedChecks: 1,
            templateLinterEntropyFailures: 1,
        });
        expect(summary.expected_chapters_total).toBe(20);
        expect(summary.chapters_generated_committed).toBe(7);
        expect(summary.chapters_failed_uncommitted).toBe(13);
        expect(summary.chapters_generated).toBe(7);
        expect(summary.expected_chapter_count).toBe(20);
        expect(summary.count_reconciliation).toMatchObject({
            expected_chapters_total: 20,
            chapters_generated_committed: 7,
            chapters_failed_uncommitted: 13,
            run_state: "partial_generation",
            chapter_word_buckets: {
                hard_floor_miss_count: 0,
                pass_count: 7,
            },
        });
    });
});
//# sourceMappingURL=mystery-orchestrator-fixes.test.js.map