export type JobName = "settingJob" | "castJob" | "cmlJob" | "validateCmlJob" | "cluesJob" | "outlineJob" | "proseJob" | "gamePackJob";
export type JobContext = {
    runId?: string;
    projectId?: string;
};
export type JobHandler = (context: JobContext) => Promise<void>;
export declare const jobRegistry: Record<JobName, JobHandler>;
