/**
 * Agent 7: Narrative Formatter
 *
 * Extracted from mystery-orchestrator.ts. Runs formatNarrative() via
 * executeAgentWithRetry (when scoring is enabled), applies schema repair,
 * runs the pre-prose outline quality gate, and applies deterministic clue
 * pacing. Writes ctx.narrative and ctx.outlineCoverageIssues.
 */
import type { NarrativeOutline, ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import { type OrchestratorContext } from "./shared.js";
type DeterministicClueAssignmentStats = {
    totalScenes: number;
    minRequired: number;
    before: number;
    after: number;
    mappingAssignments: number;
    essentialAssignments: number;
    gapFillAssignments: number;
    thresholdFillAssignments: number;
};
type NarrativeSceneCountSnapshot = {
    totalScenes: number;
    perAct: Record<1 | 2 | 3, number>;
};
export declare function captureNarrativeSceneCountSnapshot(narrative: NarrativeOutline): NarrativeSceneCountSnapshot;
export declare function checkNarrativeSceneCountFloor(candidate: NarrativeOutline, baseline: NarrativeSceneCountSnapshot): {
    ok: boolean;
    message?: string;
};
export declare function applyDeterministicCluePreAssignment(narrative: NarrativeOutline, cml: CaseData, clues: ClueDistributionResult, minCoverageRatio?: number): DeterministicClueAssignmentStats;
export declare function runAgent7(ctx: OrchestratorContext): Promise<void>;
export {};
