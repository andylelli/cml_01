/**
 * Comprehensive logging infrastructure for LLM operations
 */

import { createHash } from "crypto";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import type { LLMLogEntry, LogLevel } from "./types.js";
import type { Message } from "./types.js";

interface FullPromptLogEntry {
  timestamp: string;
  agent: string;
  runId: string;
  projectId: string;
  operation: string;
  model: string;
  temperature: number;
  maxTokens: number;
  promptHash: string;
  retryAttempt: number;
  messages: Message[];
}

export class LLMLogger {
  private logLevel: LogLevel;
  private logToConsole: boolean;
  private logToFile: boolean;
  private logFilePath?: string;
  private logFullPromptsToFile: boolean;
  private fullPromptLogFilePath?: string;

  constructor(options: {
    logLevel?: LogLevel;
    logToConsole?: boolean;
    logToFile?: boolean;
    logFilePath?: string;
    logFullPromptsToFile?: boolean;
    fullPromptLogFilePath?: string;
  } = {}) {
    this.logLevel = options.logLevel || ("info" as LogLevel);
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

  async logFullPrompt(
    entry: Omit<FullPromptLogEntry, "timestamp"> & { timestamp?: string }
  ): Promise<void> {
    if (!this.logFullPromptsToFile || !this.fullPromptLogFilePath) {
      return;
    }
    const logEntry: FullPromptLogEntry = {
      timestamp: entry.timestamp || new Date().toISOString(),
      agent: entry.agent,
      runId: entry.runId,
      projectId: entry.projectId,
      operation: entry.operation,
      model: entry.model,
      temperature: entry.temperature,
      maxTokens: entry.maxTokens,
      promptHash: entry.promptHash,
      retryAttempt: entry.retryAttempt,
      messages: entry.messages,
    };
    this.writeJsonLine(this.fullPromptLogFilePath, logEntry, "full prompt log");
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

  private writeJsonLine(filePath: string, payload: object, label: string): void {
    try {
      const jsonLine = JSON.stringify(payload) + "\n";
      appendFileSync(filePath, jsonLine);
    } catch (error) {
      console.error(`Failed to write ${label} to file:`, error);
    }
  }

  private formatLogForConsole(level: LogLevel, entry: LLMLogEntry): string {
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

  async flush(): Promise<void> {
    // No-op for now, could implement buffering in future
  }

  static hashContent(content: string): string {
    return createHash("sha256").update(content).digest("hex").substring(0, 16);
  }
}
