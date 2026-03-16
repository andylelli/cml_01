/**
 * Comprehensive logging infrastructure for LLM operations
 */
import { createHash } from "crypto";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
export class LLMLogger {
    logLevel;
    logToConsole;
    logToFile;
    logFilePath;
    logFullPromptsToFile;
    fullPromptLogFilePath;
    constructor(options = {}) {
        this.logLevel = options.logLevel || "info";
        this.logToConsole = options.logToConsole ?? true;
        this.logToFile = options.logToFile ?? false;
        this.logFilePath = options.logFilePath;
        this.logFullPromptsToFile = options.logFullPromptsToFile ?? false;
        this.fullPromptLogFilePath =
            options.fullPromptLogFilePath ||
                (this.logFilePath ? join(dirname(this.logFilePath), "llm-prompts-full.jsonl") : undefined);
        // Create log directory if needed
        if (this.logToFile && this.logFilePath) {
            const dir = dirname(this.logFilePath);
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }
        }
        if (this.logFullPromptsToFile && this.fullPromptLogFilePath) {
            const dir = dirname(this.fullPromptLogFilePath);
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }
        }
    }
    async logFullPrompt(entry) {
        if (!this.logFullPromptsToFile || !this.fullPromptLogFilePath) {
            return;
        }
        const logEntry = {
            ...entry,
            timestamp: entry.timestamp || new Date().toISOString(),
        };
        this.writeJsonLine(this.fullPromptLogFilePath, logEntry, "full prompt log");
    }
    async logRequest(entry) {
        const logEntry = {
            timestamp: entry.timestamp || new Date().toISOString(),
            runId: entry.runId || "",
            projectId: entry.projectId || "",
            agent: entry.agent || "",
            operation: entry.operation || "request",
            model: entry.model || "",
            promptHash: entry.promptHash || "",
            success: true,
            retryAttempt: entry.retryAttempt || 0,
            metadata: entry.metadata || {},
        };
        this.writeLog("info", logEntry);
    }
    async logResponse(entry) {
        const logEntry = {
            timestamp: entry.timestamp || new Date().toISOString(),
            runId: entry.runId || "",
            projectId: entry.projectId || "",
            agent: entry.agent || "",
            operation: entry.operation || "response",
            model: entry.model || "",
            promptHash: entry.promptHash || "",
            responseHash: entry.responseHash,
            latencyMs: entry.latencyMs,
            promptTokens: entry.promptTokens,
            completionTokens: entry.completionTokens,
            totalTokens: entry.totalTokens,
            estimatedCost: entry.estimatedCost,
            success: entry.success ?? true,
            errorCode: entry.errorCode,
            errorMessage: entry.errorMessage,
            validationStatus: entry.validationStatus,
            retryAttempt: entry.retryAttempt || 0,
            metadata: entry.metadata || {},
        };
        const level = entry.success ? "info" : "warn";
        this.writeLog(level, logEntry);
    }
    async logError(entry) {
        const logEntry = {
            timestamp: entry.timestamp || new Date().toISOString(),
            runId: entry.runId || "",
            projectId: entry.projectId || "",
            agent: entry.agent || "",
            operation: entry.operation || "error",
            model: entry.model || "",
            promptHash: entry.promptHash || "",
            success: false,
            errorCode: entry.errorCode,
            errorMessage: entry.errorMessage,
            retryAttempt: entry.retryAttempt || 0,
            metadata: entry.metadata || {},
        };
        this.writeLog("error", logEntry);
    }
    writeLog(level, entry) {
        // Check log level
        const levels = ["debug", "info", "warn", "error", "critical"];
        const currentLevelIndex = levels.indexOf(this.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        if (messageLevelIndex < currentLevelIndex) {
            return; // Skip logs below current level
        }
        // Console logging
        if (this.logToConsole) {
            const summary = this.formatLogForConsole(level, entry);
            console.log(summary);
        }
        // File logging (JSONL format)
        if (this.logToFile && this.logFilePath) {
            this.writeJsonLine(this.logFilePath, entry, "log");
        }
    }
    writeJsonLine(filePath, payload, label) {
        try {
            const jsonLine = JSON.stringify(payload) + "\n";
            appendFileSync(filePath, jsonLine);
        }
        catch (error) {
            console.error(`Failed to write ${label} to file:`, error);
        }
    }
    formatLogForConsole(level, entry) {
        const timestamp = new Date(entry.timestamp).toISOString();
        const levelStr = level.toUpperCase().padEnd(8);
        if (entry.success && entry.operation === "response") {
            return `${timestamp} [${levelStr}] ${entry.agent} | ${entry.operation} | ${entry.model} | ${entry.latencyMs}ms | ${entry.totalTokens} tokens | $${entry.estimatedCost?.toFixed(4)}`;
        }
        if (!entry.success) {
            const message = entry.errorMessage?.trim() || "Unknown error";
            return `${timestamp} [${levelStr}] ${entry.agent} | ${entry.operation} | ERROR: ${message}`;
        }
        return `${timestamp} [${levelStr}] ${entry.agent} | ${entry.operation}`;
    }
    async flush() {
        // No-op for now, could implement buffering in future
    }
    static hashContent(content) {
        return createHash("sha256").update(content).digest("hex").substring(0, 16);
    }
}
//# sourceMappingURL=logger.js.map