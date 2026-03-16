export type Project = {
    id: string;
    name: string;
    status: string;
    createdAt?: string;
};
export type Spec = {
    id: string;
    projectId: string;
    spec: unknown;
};
export type ActivityLog = {
    id: string;
    projectId: string | null;
    scope: string;
    message: string;
    payload: unknown;
    createdAt: string;
};
export type ProjectRepository = {
    createProject: (name: string) => Promise<Project>;
    listProjects: () => Promise<Project[]>;
    getProject: (id: string) => Promise<Project | null>;
    createSpec: (projectId: string, spec: unknown) => Promise<Spec>;
    getSpec: (id: string) => Promise<Spec | null>;
    getLatestSpec: (projectId: string) => Promise<Spec | null>;
    setProjectStatus: (projectId: string, status: string) => Promise<void>;
    getProjectStatus: (projectId: string) => Promise<string>;
    createRun: (projectId: string, status: string) => Promise<{
        id: string;
        projectId: string;
        status: string;
    }>;
    updateRunStatus: (runId: string, status: string) => Promise<void>;
    addRunEvent: (runId: string, step: string, message: string) => Promise<void>;
    getLatestRun: (projectId: string) => Promise<{
        id: string;
        projectId: string;
        status: string;
    } | null>;
    getRunEvents: (runId: string) => Promise<Array<{
        step: string;
        message: string;
    }>>;
    createLog: (log: Omit<ActivityLog, "id" | "createdAt">) => Promise<ActivityLog>;
    listLogs: (projectId?: string | null) => Promise<ActivityLog[]>;
    createArtifact: (projectId: string, type: string, payload: unknown, sourceSpecId?: string | null) => Promise<{
        id: string;
        projectId: string;
        type: string;
        payload: unknown;
    }>;
    getLatestArtifact: (projectId: string, type: string) => Promise<{
        id: string;
        projectId: string;
        type: string;
        payload: unknown;
    } | null>;
    clearAllData: () => Promise<void>;
};
export declare const createRepository: () => Promise<ProjectRepository>;
