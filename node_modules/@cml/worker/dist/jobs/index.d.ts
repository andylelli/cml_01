export type JobName = "settingJob" | "castJob" | "cmlJob" | "validateCmlJob" | "cluesJob" | "outlineJob" | "proseJob" | "gamePackJob" | "fullPipelineJob";
export { generateMystery, generateMysterySimple, type MysteryGenerationInputs, type MysteryGenerationProgress, type MysteryGenerationResult, type ProgressCallback, } from "./mystery-orchestrator.js";
export type JobContext = {
    runId?: string;
    projectId?: string;
};
export type JobHandler = (context: JobContext) => Promise<void>;
export declare const jobRegistry: Record<JobName, JobHandler>;
