export type WorkerRuntimePaths = {
    workspaceRoot: string;
    workerAppRoot: string;
    examplesRoot: string;
};
export declare function resolveWorkerRuntimePaths(moduleUrl: string): WorkerRuntimePaths;
