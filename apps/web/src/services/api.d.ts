export declare const exportArtifacts: (projectId: string, artifactTypes: string[]) => Promise<Blob>;
export type ApiHealth = {
    status: string;
    service: string;
};
export type Project = {
    id: string;
    name: string;
    status?: string;
    createdAt?: string;
};
export type Spec = {
    id: string;
    projectId: string;
    spec: unknown;
};
export type Artifact<T = unknown> = {
    id: string;
    projectId: string;
    type: string;
    payload: T;
};
export type Run = {
    id: string;
    projectId: string;
    status: string;
};
export type RunEvent = {
    step: string;
    message: string;
};
export type ProjectStatus = {
    projectId: string;
    status: string;
};
export type ActivityLogPayload = {
    projectId?: string | null;
    scope: string;
    message: string;
    payload?: unknown;
};
export declare const fetchHealth: () => Promise<ApiHealth>;
export declare const logActivity: (entry: ActivityLogPayload) => Promise<void>;
export declare const createProject: (name: string) => Promise<Project>;
export declare const fetchProjects: () => Promise<Project[]>;
export declare const fetchProject: (projectId: string) => Promise<Project>;
export declare const saveSpec: (projectId: string, spec: unknown) => Promise<Spec>;
export declare const fetchLatestSpec: (projectId: string) => Promise<Spec | null>;
export declare const runPipeline: (projectId: string) => Promise<{
    status: string;
    projectId: string;
    runId?: string;
}>;
export declare const regenerateArtifact: (projectId: string, scope: string) => Promise<{
    status: string;
    scope: string;
}>;
export declare const fetchCml: (projectId: string) => Promise<Artifact>;
export declare const fetchCmlValidation: (projectId: string) => Promise<Artifact>;
export declare const fetchSetting: (projectId: string) => Promise<Artifact>;
export declare const fetchCast: (projectId: string) => Promise<Artifact>;
export declare const fetchSettingValidation: (projectId: string) => Promise<Artifact>;
export declare const fetchCastValidation: (projectId: string) => Promise<Artifact>;
export declare const fetchClues: (projectId: string) => Promise<Artifact>;
export declare const fetchCluesValidation: (projectId: string) => Promise<Artifact>;
export declare const fetchOutline: (projectId: string) => Promise<Artifact>;
export declare const fetchOutlineValidation: (projectId: string) => Promise<Artifact>;
export declare const fetchProse: (projectId: string) => Promise<Artifact>;
export declare const fetchCharacterProfiles: (projectId: string) => Promise<Artifact>;
export declare const fetchLocationProfiles: (projectId: string) => Promise<Artifact>;
export declare const fetchTemporalContext: (projectId: string) => Promise<Artifact>;
export declare const fetchBackgroundContext: (projectId: string) => Promise<Artifact>;
export declare const fetchHardLogicDevices: (projectId: string) => Promise<Artifact>;
export declare const fetchFairPlayReport: (projectId: string) => Promise<Artifact>;
export declare const fetchGamePack: (projectId: string) => Promise<Artifact>;
export declare const fetchSynopsis: (projectId: string) => Promise<Artifact>;
export declare const fetchNoveltyAudit: (projectId: string) => Promise<Artifact>;
export declare const downloadGamePackPdf: (projectId: string) => Promise<Blob>;
export declare const downloadStoryPdf: (projectId: string, length?: string) => Promise<Blob>;
export declare const fetchProseVersions: (projectId: string) => Promise<Record<string, Artifact>>;
export type SampleSummary = {
    id: string;
    name: string;
    filename: string;
};
export declare const fetchSamples: () => Promise<SampleSummary[]>;
export declare const fetchSampleContent: (id: string) => Promise<{
    id: string;
    name: string;
    content: string;
}>;
export declare const fetchLatestRun: (projectId: string) => Promise<Run | null>;
export declare const fetchRunEvents: (runId: string) => Promise<RunEvent[]>;
export declare const fetchProjectStatus: (projectId: string) => Promise<ProjectStatus>;
export declare const clearPersistenceStore: () => Promise<{
    status: string;
}>;
export declare const fetchScoringReport: (projectId: string, runId: string) => Promise<unknown>;
export declare const fetchScoringHistory: (projectId: string, limit?: number) => Promise<unknown[]>;
export declare const fetchScoringAggregate: () => Promise<unknown>;
export type LlmLogEntry = {
    timestamp: string;
    runId: string;
    projectId: string;
    agent: string;
    operation: string;
    model?: string;
    latencyMs?: number;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    estimatedCost?: number;
    errorMessage?: string;
    validationStatus?: string;
};
export declare const fetchLlmLogs: (projectId?: string | null, limit?: number) => Promise<LlmLogEntry[]>;
