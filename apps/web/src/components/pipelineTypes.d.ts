/**
 * Types for the ProgressIndicator component.
 * Extracted to a .ts file so they are accessible to both the component,
 * App.vue, and test files when using plain tsc (without vue-tsc).
 */
export interface PipelineStep {
    id: string;
    label: string;
    status: "pending" | "running" | "complete" | "failed" | "skipped";
    durationMs?: number;
}
