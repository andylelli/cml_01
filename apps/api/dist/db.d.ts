export type Project = {
    id: string;
    name: string;
    status: string;
};
export type Spec = {
    id: string;
    projectId: string;
    spec: unknown;
};
export type ProjectRepository = {
    createProject: (name: string) => Promise<Project>;
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
};
export declare const createRepository: () => Promise<ProjectRepository>;
