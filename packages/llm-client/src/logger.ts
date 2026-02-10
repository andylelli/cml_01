/**
 * Comprehensive logging infrastructure for LLM operations
 */

import { createHash } from "crypto";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import type { LLMLogEntry, LogLevel } from "./types.js";

export class LLMLogger {
  private logLevel: LogLevel;
  private logToConsole: boolean;
  private logToFile: boolean;
  private logFilePath?: string;

  constructor(options: {
    logLevel?: LogLevel;
    logToConsole?: boolean;
    logToFile?: boolean;
    logFilePath?: string;
  } = {}) {
    this.logLevel = options.logLevel || ("info" as LogLevel);
    this.logToConsole = options.logToConsole ?? true;
    this.logToFile = options.logToFile ?? false;
    this.logFilePath = options.logFilePath;

    // Create log directory if needed
    if (this.logToFile && this.logFilePath) {
      const dir = dirname(this.logFilePath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
  }

  async logRequest(entry: Partial<LLMLogEntry>): Promise<void> {
    const logEntry: LLMLogEntry = {
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

    this.writeLog("info" as LogLevel, logEntry);
  }

  async logResponse(entry: Partial<LLMLogEntry>): Promise<void> {
    const logEntry: LLMLogEntry = {
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

    const level = entry.success ? ("info" as LogLevel) : ("warn" as LogLevel);
    this.writeLog(level, logEntry);
  }

  async logError(entry: Partial<LLMLogEntry>): Promise<void> {
    const logEntry: LLMLogEntry = {
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

    this.writeLog("error" as LogLevel, logEntry);
  }

  private writeLog(level: LogLevel, entry: LLMLogEntry): void {
    // Check log level
    const levels: LogLevel[] = ["debug", "info", "warn", "error", "critical"] as LogLevel[];
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
      try {
        const jsonLine = JSON.stringify(entry) + "\n";
        appendFileSync(this.logFilePath, jsonLine);
      } catch (error) {
        console.error("Failed to write log to file:", error);
      }
    }
  }

  private formatLogForConsole(level: LogLevel, entry: LLMLogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const levelStr = level.toUpperCase().padEnd(8);

    if (entry.success && entry.operation === "response") {
      return `${timestamp} [${levelStr}] ${entry.agent} | ${entry.operation} | ${entry.model} | ${entry.latencyMs}ms | ${entry.totalTokens} tokens | $${entry.estimatedCost?.toFixed(4)}`;
    }

    if (!entry.success) {
      return `${timestamp} [${levelStr}] ${entry.agent} | ${entry.operation} | ERROR: ${entry.errorMessage}`;
    }

    return `${timestamp} [${levelStr}] ${entry.agent} | ${entry.operation}`;
  }

  async flush(): Promise<void> {
    // No-op for now, could implement buffering in future
  }

  static hashContent(content: string): string {
    return createHash("sha256").update(content).digest("hex").substring(0, 16);
  }
}
