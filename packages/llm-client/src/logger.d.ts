/**
 * Comprehensive logging infrastructure for LLM operations
 */
import type { Message } from "./types.js";
import type { LLMLogEntry, LogLevel } from "./types.js";
interface FullPromptLogEntry {
    timestamp: string;
    runId: string;
    projectId: string;
    agent: string;
    operation: string;
    model: string;
    temperature: number;
    maxTokens: number;
    promptHash: string;
    retryAttempt: number;
    messages: Message[];
}
export declare class LLMLogger {
    private logLevel;
    private logToConsole;
    private logToFile;
    private logFilePath?;
    private logFullPromptsToFile;
    private fullPromptLogFilePath?;
    constructor(options?: {
        logLevel?: LogLevel;
        logToConsole?: boolean;
        logToFile?: boolean;
        logFilePath?: string;
        logFullPromptsToFile?: boolean;
        fullPromptLogFilePath?: string;
    });
    logFullPrompt(entry: Omit<FullPromptLogEntry, "timestamp"> & {
        timestamp?: string;
    }): Promise<void>;
    logRequest(entry: Partial<LLMLogEntry>): Promise<void>;
    logResponse(entry: Partial<LLMLogEntry>): Promise<void>;
    logError(entry: Partial<LLMLogEntry>): Promise<void>;
    private writeLog;
    private writeJsonLine;
    private formatLogForConsole;
    flush(): Promise<void>;
    static hashContent(content: string): string;
}
export {};
