import { type Artifact } from "../services/api";
type LoadSummary = {
    failures: PromiseSettledResult<Artifact>[];
    hasNotFound: boolean;
    hasNetworkError: boolean;
    notFoundCount: number;
};
export declare const useProjectStore: import("pinia").StoreDefinition<"project", Pick<{
    artifactsStatus: import("vue").Ref<"idle" | "error" | "ready" | "loading" | "partial", "idle" | "error" | "ready" | "loading" | "partial">;
    cmlArtifact: import("vue").Ref<string | null, string | null>;
    cluesArtifact: import("vue").Ref<string | null, string | null>;
    outlineArtifact: import("vue").Ref<string | null, string | null>;
    proseArtifact: import("vue").Ref<string | null, string | null>;
    characterProfilesArtifact: import("vue").Ref<string | null, string | null>;
    locationProfilesArtifact: import("vue").Ref<string | null, string | null>;
    temporalContextArtifact: import("vue").Ref<string | null, string | null>;
    backgroundContextArtifact: import("vue").Ref<string | null, string | null>;
    hardLogicDevicesArtifact: import("vue").Ref<string | null, string | null>;
    gamePackArtifact: import("vue").Ref<string | null, string | null>;
    settingArtifact: import("vue").Ref<string | null, string | null>;
    castArtifact: import("vue").Ref<string | null, string | null>;
    settingData: import("vue").Ref<{
        decade?: string | undefined;
        locationPreset?: string | undefined;
        weather?: string | undefined;
        socialStructure?: string | undefined;
    } | null, {
        decade?: string;
        locationPreset?: string;
        weather?: string;
        socialStructure?: string;
    } | {
        decade?: string | undefined;
        locationPreset?: string | undefined;
        weather?: string | undefined;
        socialStructure?: string | undefined;
    } | null>;
    castData: import("vue").Ref<{
        suspects?: string[] | undefined;
    } | null, {
        suspects?: string[];
    } | {
        suspects?: string[] | undefined;
    } | null>;
    cluesData: import("vue").Ref<{
        summary?: string | undefined;
        items?: {
            id: string;
            category: string;
            text: string;
            pointsTo: string;
            redHerring: boolean;
            revealChapter?: number | undefined;
        }[] | undefined;
    } | null, {
        summary?: string;
        items?: Array<{
            id: string;
            category: string;
            text: string;
            pointsTo: string;
            redHerring: boolean;
            revealChapter?: number;
        }>;
    } | {
        summary?: string | undefined;
        items?: {
            id: string;
            category: string;
            text: string;
            pointsTo: string;
            redHerring: boolean;
            revealChapter?: number | undefined;
        }[] | undefined;
    } | null>;
    fairPlayReport: import("vue").Ref<{
        summary?: string | undefined;
        checks?: {
            id: string;
            label: string;
            status: string;
        }[] | undefined;
    } | null, {
        summary?: string;
        checks?: Array<{
            id: string;
            label: string;
            status: string;
        }>;
    } | {
        summary?: string | undefined;
        checks?: {
            id: string;
            label: string;
            status: string;
        }[] | undefined;
    } | null>;
    outlineData: import("vue").Ref<{
        chapters?: unknown;
    } | null, {
        chapters?: unknown;
    } | {
        chapters?: unknown;
    } | null>;
    synopsisData: import("vue").Ref<{
        title?: string | undefined;
        summary?: string | undefined;
    } | null, {
        title?: string;
        summary?: string;
    } | {
        title?: string | undefined;
        summary?: string | undefined;
    } | null>;
    proseData: any;
    characterProfilesData: any;
    locationProfilesData: any;
    temporalContextData: any;
    backgroundContextData: any;
    hardLogicDevicesData: any;
    noveltyAuditData: any;
    gamePackData: import("vue").Ref<{
        title?: string | undefined;
        suspects?: string[] | undefined;
        materials?: string[] | undefined;
    } | null, {
        title?: string;
        suspects?: string[];
        materials?: string[];
    } | {
        title?: string | undefined;
        suspects?: string[] | undefined;
        materials?: string[] | undefined;
    } | null>;
    runEventsData: import("vue").Ref<any, any>;
    latestRunId: import("vue").Ref<string | null, string | null>;
    llmLogs: import("vue").Ref<any, any>;
    allValidation: any;
    loadArtifacts: (projectId: string, options?: {
        includeCml?: boolean;
    }) => Promise<LoadSummary>;
    loadRunEvents: (projectId: string) => Promise<void>;
    loadLlmLogs: (projectId?: string | null, limit?: number) => Promise<void>;
    resetValidation: () => void;
    clearAll: () => void;
}, any>, Pick<{
    artifactsStatus: import("vue").Ref<"idle" | "error" | "ready" | "loading" | "partial", "idle" | "error" | "ready" | "loading" | "partial">;
    cmlArtifact: import("vue").Ref<string | null, string | null>;
    cluesArtifact: import("vue").Ref<string | null, string | null>;
    outlineArtifact: import("vue").Ref<string | null, string | null>;
    proseArtifact: import("vue").Ref<string | null, string | null>;
    characterProfilesArtifact: import("vue").Ref<string | null, string | null>;
    locationProfilesArtifact: import("vue").Ref<string | null, string | null>;
    temporalContextArtifact: import("vue").Ref<string | null, string | null>;
    backgroundContextArtifact: import("vue").Ref<string | null, string | null>;
    hardLogicDevicesArtifact: import("vue").Ref<string | null, string | null>;
    gamePackArtifact: import("vue").Ref<string | null, string | null>;
    settingArtifact: import("vue").Ref<string | null, string | null>;
    castArtifact: import("vue").Ref<string | null, string | null>;
    settingData: import("vue").Ref<{
        decade?: string | undefined;
        locationPreset?: string | undefined;
        weather?: string | undefined;
        socialStructure?: string | undefined;
    } | null, {
        decade?: string;
        locationPreset?: string;
        weather?: string;
        socialStructure?: string;
    } | {
        decade?: string | undefined;
        locationPreset?: string | undefined;
        weather?: string | undefined;
        socialStructure?: string | undefined;
    } | null>;
    castData: import("vue").Ref<{
        suspects?: string[] | undefined;
    } | null, {
        suspects?: string[];
    } | {
        suspects?: string[] | undefined;
    } | null>;
    cluesData: import("vue").Ref<{
        summary?: string | undefined;
        items?: {
            id: string;
            category: string;
            text: string;
            pointsTo: string;
            redHerring: boolean;
            revealChapter?: number | undefined;
        }[] | undefined;
    } | null, {
        summary?: string;
        items?: Array<{
            id: string;
            category: string;
            text: string;
            pointsTo: string;
            redHerring: boolean;
            revealChapter?: number;
        }>;
    } | {
        summary?: string | undefined;
        items?: {
            id: string;
            category: string;
            text: string;
            pointsTo: string;
            redHerring: boolean;
            revealChapter?: number | undefined;
        }[] | undefined;
    } | null>;
    fairPlayReport: import("vue").Ref<{
        summary?: string | undefined;
        checks?: {
            id: string;
            label: string;
            status: string;
        }[] | undefined;
    } | null, {
        summary?: string;
        checks?: Array<{
            id: string;
            label: string;
            status: string;
        }>;
    } | {
        summary?: string | undefined;
        checks?: {
            id: string;
            label: string;
            status: string;
        }[] | undefined;
    } | null>;
    outlineData: import("vue").Ref<{
        chapters?: unknown;
    } | null, {
        chapters?: unknown;
    } | {
        chapters?: unknown;
    } | null>;
    synopsisData: import("vue").Ref<{
        title?: string | undefined;
        summary?: string | undefined;
    } | null, {
        title?: string;
        summary?: string;
    } | {
        title?: string | undefined;
        summary?: string | undefined;
    } | null>;
    proseData: any;
    characterProfilesData: any;
    locationProfilesData: any;
    temporalContextData: any;
    backgroundContextData: any;
    hardLogicDevicesData: any;
    noveltyAuditData: any;
    gamePackData: import("vue").Ref<{
        title?: string | undefined;
        suspects?: string[] | undefined;
        materials?: string[] | undefined;
    } | null, {
        title?: string;
        suspects?: string[];
        materials?: string[];
    } | {
        title?: string | undefined;
        suspects?: string[] | undefined;
        materials?: string[] | undefined;
    } | null>;
    runEventsData: import("vue").Ref<any, any>;
    latestRunId: import("vue").Ref<string | null, string | null>;
    llmLogs: import("vue").Ref<any, any>;
    allValidation: any;
    loadArtifacts: (projectId: string, options?: {
        includeCml?: boolean;
    }) => Promise<LoadSummary>;
    loadRunEvents: (projectId: string) => Promise<void>;
    loadLlmLogs: (projectId?: string | null, limit?: number) => Promise<void>;
    resetValidation: () => void;
    clearAll: () => void;
}, any>, Pick<{
    artifactsStatus: import("vue").Ref<"idle" | "error" | "ready" | "loading" | "partial", "idle" | "error" | "ready" | "loading" | "partial">;
    cmlArtifact: import("vue").Ref<string | null, string | null>;
    cluesArtifact: import("vue").Ref<string | null, string | null>;
    outlineArtifact: import("vue").Ref<string | null, string | null>;
    proseArtifact: import("vue").Ref<string | null, string | null>;
    characterProfilesArtifact: import("vue").Ref<string | null, string | null>;
    locationProfilesArtifact: import("vue").Ref<string | null, string | null>;
    temporalContextArtifact: import("vue").Ref<string | null, string | null>;
    backgroundContextArtifact: import("vue").Ref<string | null, string | null>;
    hardLogicDevicesArtifact: import("vue").Ref<string | null, string | null>;
    gamePackArtifact: import("vue").Ref<string | null, string | null>;
    settingArtifact: import("vue").Ref<string | null, string | null>;
    castArtifact: import("vue").Ref<string | null, string | null>;
    settingData: import("vue").Ref<{
        decade?: string | undefined;
        locationPreset?: string | undefined;
        weather?: string | undefined;
        socialStructure?: string | undefined;
    } | null, {
        decade?: string;
        locationPreset?: string;
        weather?: string;
        socialStructure?: string;
    } | {
        decade?: string | undefined;
        locationPreset?: string | undefined;
        weather?: string | undefined;
        socialStructure?: string | undefined;
    } | null>;
    castData: import("vue").Ref<{
        suspects?: string[] | undefined;
    } | null, {
        suspects?: string[];
    } | {
        suspects?: string[] | undefined;
    } | null>;
    cluesData: import("vue").Ref<{
        summary?: string | undefined;
        items?: {
            id: string;
            category: string;
            text: string;
            pointsTo: string;
            redHerring: boolean;
            revealChapter?: number | undefined;
        }[] | undefined;
    } | null, {
        summary?: string;
        items?: Array<{
            id: string;
            category: string;
            text: string;
            pointsTo: string;
            redHerring: boolean;
            revealChapter?: number;
        }>;
    } | {
        summary?: string | undefined;
        items?: {
            id: string;
            category: string;
            text: string;
            pointsTo: string;
            redHerring: boolean;
            revealChapter?: number | undefined;
        }[] | undefined;
    } | null>;
    fairPlayReport: import("vue").Ref<{
        summary?: string | undefined;
        checks?: {
            id: string;
            label: string;
            status: string;
        }[] | undefined;
    } | null, {
        summary?: string;
        checks?: Array<{
            id: string;
            label: string;
            status: string;
        }>;
    } | {
        summary?: string | undefined;
        checks?: {
            id: string;
            label: string;
            status: string;
        }[] | undefined;
    } | null>;
    outlineData: import("vue").Ref<{
        chapters?: unknown;
    } | null, {
        chapters?: unknown;
    } | {
        chapters?: unknown;
    } | null>;
    synopsisData: import("vue").Ref<{
        title?: string | undefined;
        summary?: string | undefined;
    } | null, {
        title?: string;
        summary?: string;
    } | {
        title?: string | undefined;
        summary?: string | undefined;
    } | null>;
    proseData: any;
    characterProfilesData: any;
    locationProfilesData: any;
    temporalContextData: any;
    backgroundContextData: any;
    hardLogicDevicesData: any;
    noveltyAuditData: any;
    gamePackData: import("vue").Ref<{
        title?: string | undefined;
        suspects?: string[] | undefined;
        materials?: string[] | undefined;
    } | null, {
        title?: string;
        suspects?: string[];
        materials?: string[];
    } | {
        title?: string | undefined;
        suspects?: string[] | undefined;
        materials?: string[] | undefined;
    } | null>;
    runEventsData: import("vue").Ref<any, any>;
    latestRunId: import("vue").Ref<string | null, string | null>;
    llmLogs: import("vue").Ref<any, any>;
    allValidation: any;
    loadArtifacts: (projectId: string, options?: {
        includeCml?: boolean;
    }) => Promise<LoadSummary>;
    loadRunEvents: (projectId: string) => Promise<void>;
    loadLlmLogs: (projectId?: string | null, limit?: number) => Promise<void>;
    resetValidation: () => void;
    clearAll: () => void;
}, any>>;
export {};
