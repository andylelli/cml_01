/**
 * Types for the DebugPanel component.
 * Extracted to a .ts file so they are accessible to both the component
 * and test files when using plain tsc (without vue-tsc).
 */
export interface LlmLogEntry {
    id?: string;
    timestamp?: string;
    agent?: string;
    model?: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    durationMs?: number;
    cost?: number;
    status?: "ok" | "error" | "retry";
    errorMessage?: string;
    prompt?: string;
    response?: string;
}
