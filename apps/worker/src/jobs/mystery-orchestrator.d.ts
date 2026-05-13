/**
 * Mystery Generation Orchestrator — Thin Coordinator
 *
 * Delegates all per-agent logic to apps/worker/src/jobs/agents/.
 * Each runAgentN() mutates the shared OrchestratorContext in place.
 *
 * Pipeline:
 *   Agent1 (Setting) → Agent2 (Cast) → Agent2e (Background Context)
 *   → Agent3b (Hard Logic Devices) → Agent3 (CML + Agent4 auto-revision)
 *   → Agent5 (Clue Distribution) → Agent6 (Fair Play + clue loop)
 *   → Agent7 (Narrative Outline) → Agent2b (Character Profiles)
 *   → Agent2c (Location Profiles) → Agent2d (Temporal Context)
 *   → [CML Validation Gate] → Agent9 (Prose + Release Gate)
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { ClueDistributionResult, FairPlayAuditResult, NarrativeOutline, CharacterProfilesResult, LocationProfilesResult, TemporalContextResult, BackgroundContextArtifact, HardLogicDeviceResult, ProseGenerationResult, NoveltyAuditResult, SettingRefinementResult, CastDesignResult } from "@cml/prompts-llm";
import { getStoryLengthTargetMetadata } from "@cml/story-validation";
import type { GenerationReport, ValidationReport } from "@cml/story-validation";
import { captureNarrativeSceneCountSnapshot, checkNarrativeSceneCountFloor, applyDeterministicCluePreAssignment } from "./agents/index.js";
export interface MysteryGenerationInputs {
    /** e.g. "locked room murder in a manor" */
    theme: string;
    eraPreference?: string;
    locationPreset?: string;
    tone?: string;
    primaryAxis?: "temporal" | "spatial" | "social" | "psychological" | "mechanical";
    /** suspects + witnesses; detective is always +1 */
    castSize?: number;
    castNames?: string[];
    detectiveType?: "police" | "private" | "amateur";
    targetLength?: "short" | "medium" | "long";
    narrativeStyle?: "classic" | "modern" | "atmospheric";
    /** Skip Agent 8 novelty check if true */
    skipNoveltyCheck?: boolean;
    /** Agent 8 similarity threshold, default 0.9 */
    similarityThreshold?: number;
    /** Chapters per LLM call (1–10, default 1) */
    proseBatchSize?: number;
    runId?: string;
    projectId?: string;
    /** Pillar 1: accumulate locked facts from Agent 3b and propagate to Agents 5, 7, 9 */
    enableLockedFactRegistry?: boolean;
    /** Pillar 1: pre-generation gate — halt if outline/clues disagree with registry */
    enableLockedFactGate?: boolean;
    /** Pillar 2: assemble Character Context Bundle from Agents 2b + 65 and pass to Agent 9 */
    enableCharacterBundle?: boolean;
    /** Pillar 3: halt pipeline when a quality-evaluator result has blocking=true */
    enableBindingGates?: boolean;
    /** Pillar 3: override a blocking gate — log audit warning instead of throwing */
    forceWarnings?: boolean;
    /** Pillar 6: inject BANNED PARAGRAPH blocks and structural-pivot mode into Agent 9 retry prompts
     *  when a paragraph fingerprint failure recurs across attempts */
    enableSurgicalFingerprintRetry?: boolean;
    /** Pillar 4: require pivotElement, factEstablished, permittedBehavioursByAct, and
     *  redHerringPlacement per outline scene; post-Agent-7 validator halts on null/generic values;
     *  Agent 9 enacts pivotElement, factEstablished, and redHerringPlacement per chapter */
    enableOutlineCompleteness?: boolean;
}
export interface MysteryGenerationProgress {
    stage: "setting" | "cast" | "background-context" | "hard_logic_devices" | "cml" | "clues" | "fairplay" | "narrative" | "profiles" | "location-profiles" | "temporal-context" | "prose" | "validation" | "novelty" | "novelty_math" | "complete";
    message: string;
    percentage: number;
    timestamp: Date;
}
export interface MysteryGenerationResult {
    cml: CaseData;
    clues: ClueDistributionResult;
    fairPlayAudit: FairPlayAuditResult;
    narrative: NarrativeOutline;
    characterProfiles: CharacterProfilesResult;
    locationProfiles: LocationProfilesResult;
    temporalContext: TemporalContextResult;
    backgroundContext: BackgroundContextArtifact;
    hardLogicDevices: HardLogicDeviceResult;
    prose: ProseGenerationResult;
    noveltyAudit?: NoveltyAuditResult;
    validationReport: ValidationReport;
    scoringReport?: GenerationReport;
    setting: SettingRefinementResult;
    cast: CastDesignResult;
    metadata: {
        runId: string;
        projectId?: string;
        totalCost: number;
        totalDurationMs: number;
        agentCosts: Record<string, number>;
        agentDurations: Record<string, number>;
        revisedByAgent4: boolean;
        revisionAttempts?: number;
    };
    status: "success" | "warning" | "failure";
    warnings: string[];
    errors: string[];
}
export type ProgressCallback = (progress: MysteryGenerationProgress) => void;
type AbortedProseSummaryInputs = {
    expectedChaptersTotal: number;
    chaptersGeneratedCommitted: number;
    targetMeta: ReturnType<typeof getStoryLengthTargetMetadata>;
    scoreTotal: number | null;
    failureReason: string;
    startedAtMs: number;
    proseCost: number;
    batchSize: number;
    templateLinterFailedChecks: number;
    templateLinterEntropyFailures: number;
};
declare function buildAbortedProseSummary(inputs: AbortedProseSummaryInputs): Record<string, unknown>;
export declare function generateMystery(client: AzureOpenAIClient, inputs: MysteryGenerationInputs, onProgress?: ProgressCallback): Promise<MysteryGenerationResult>;
export declare function generateMysterySimple(client: AzureOpenAIClient, theme: string, onProgress?: ProgressCallback): Promise<MysteryGenerationResult>;
export declare const __testables: {
    buildAbortedProseSummary: typeof buildAbortedProseSummary;
    captureNarrativeSceneCountSnapshot: typeof captureNarrativeSceneCountSnapshot;
    checkNarrativeSceneCountFloor: typeof checkNarrativeSceneCountFloor;
    applyDeterministicCluePreAssignment: typeof applyDeterministicCluePreAssignment;
    applyDeterministicProsePostProcessing: (prose: any, locationProfiles: any) => any;
    detectIdentityAliasBreaks: (prose: any, cml: any) => {
        chapterIndex: number;
        message: string;
    }[];
    buildNarrativeSubsetForChapterIndexes: (narrative: any, chapterIndexes: number[]) => any;
    isDiscriminatingTestCoverageError: (error: {
        type?: string;
        message?: string;
    }) => boolean;
    isSuspectClosureCoverageError: (error: {
        type?: string;
        message?: string;
    }) => boolean;
    isCulpritEvidenceChainCoverageError: (error: {
        type?: string;
        message?: string;
    }) => boolean;
    isSuspectEliminationCoverageError: (error: {
        type?: string;
        message?: string;
    }) => boolean;
};
export {};
