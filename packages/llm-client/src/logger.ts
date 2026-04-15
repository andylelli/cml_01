/**
 * Comprehensive logging infrastructure for LLM operations
 */

import { createHash } from "crypto";
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { basename, dirname, join } from "path";
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

interface ActualPromptRecord {
  sequence: number;
  agent: string;
  retryAttempt: number;
  promptHash: string;
  requestTimestamp: string;
  requestFile: string;
  responseTimestamp?: string;
  responseFile?: string;
}

interface ActualPromptRunState {
  runId: string;
  projectId: string;
  folderName: string;
  records: ActualPromptRecord[];
}

export class LLMLogger {
  private logLevel: LogLevel;
  private logToConsole: boolean;
  private logToFile: boolean;
  private logFilePath?: string;
  private logFullPromptsToFile: boolean;
  private fullPromptLogFilePath?: string;
  private logActualPromptDocsToFile: boolean;
  private actualPromptDocsDir?: string;
  private runFolderByRunId: Map<string, string>;

  constructor(options: {
    logLevel?: LogLevel;
    logToConsole?: boolean;
    logToFile?: boolean;
    logFilePath?: string;
    logFullPromptsToFile?: boolean;
    fullPromptLogFilePath?: string;
    logActualPromptDocsToFile?: boolean;
    actualPromptDocsDir?: string;
  } = {}) {
    this.logLevel = options.logLevel || ("info" as LogLevel);
    this.logToConsole = options.logToConsole ?? true;
    this.logToFile = options.logToFile ?? false;
    this.logFilePath = options.logFilePath;
    this.logFullPromptsToFile = options.logFullPromptsToFile ?? false;
    this.fullPromptLogFilePath =
      options.fullPromptLogFilePath ||
      (this.logFilePath ? join(dirname(this.logFilePath), "llm-prompts-full.jsonl") : undefined);
    this.logActualPromptDocsToFile = options.logActualPromptDocsToFile ?? true;
    this.actualPromptDocsDir = options.actualPromptDocsDir;
    this.runFolderByRunId = new Map<string, string>();

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

    if (this.logActualPromptDocsToFile && this.actualPromptDocsDir && !existsSync(this.actualPromptDocsDir)) {
      mkdirSync(this.actualPromptDocsDir, { recursive: true });
    }
  }

  async logFullPrompt(
    entry: Omit<FullPromptLogEntry, "timestamp"> & { timestamp?: string }
  ): Promise<void> {
    const timestamp = entry.timestamp || new Date().toISOString();
    if (!this.logFullPromptsToFile || !this.fullPromptLogFilePath) {
      // still allow actual prompt docs generation below
    } else {
      const logEntry: FullPromptLogEntry = {
        timestamp,
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

    this.writeActualRequestRecord({
      timestamp,
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
    });
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
      response: entry.response,
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
    this.writeActualResponseRecord(logEntry);
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

  private writeActualRequestRecord(entry: FullPromptLogEntry): void {
    if (!this.logActualPromptDocsToFile || !this.actualPromptDocsDir) {
      return;
    }
    if (!entry.runId) {
      return;
    }

    try {
      const runDir = this.getOrCreateRunDir(entry.runId, entry.projectId, entry.timestamp);
      const state = this.readRunState(runDir, entry.runId, entry.projectId);

      const existing = state.records.find(
        (record) =>
          record.promptHash === entry.promptHash &&
          record.retryAttempt === entry.retryAttempt &&
          record.agent === entry.agent
      );

      const record =
        existing ||
        ({
          sequence: this.nextSequence(state),
          agent: entry.agent,
          retryAttempt: entry.retryAttempt,
          promptHash: entry.promptHash,
          requestTimestamp: entry.timestamp,
          requestFile: "",
        } as ActualPromptRecord);

      record.requestTimestamp = entry.timestamp;
      record.requestFile = this.buildRequestFilename(record.sequence, entry.agent, entry.retryAttempt);

      this.writeRequestMarkdown(runDir, record.requestFile, entry);

      if (!existing) {
        state.records.push(record);
      }

      this.writeRunState(runDir, state);
      this.writeRunIndex(runDir, state);
      this.writeActualRootReadme();
    } catch (error) {
      console.error("Failed to write actual request record:", error);
    }
  }

  private writeActualResponseRecord(entry: LLMLogEntry): void {
    if (!this.logActualPromptDocsToFile || !this.actualPromptDocsDir) {
      return;
    }
    if (!entry.runId || entry.operation !== "chat_response") {
      return;
    }

    try {
      const runDir = this.getOrCreateRunDir(entry.runId, entry.projectId, entry.timestamp);
      const state = this.readRunState(runDir, entry.runId, entry.projectId);
      const record = this.findOrCreateResponseRecord(state, entry);

      record.responseTimestamp = entry.timestamp;
      record.responseFile = this.buildResponseFilename(record.sequence, entry.agent, entry.retryAttempt);

      this.writeResponseMarkdown(runDir, record.responseFile, record, entry);
      this.writeRunState(runDir, state);
      this.writeRunIndex(runDir, state);
      this.writeActualRootReadme();
    } catch (error) {
      console.error("Failed to write actual response record:", error);
    }
  }

  private getOrCreateRunDir(runId: string, projectId: string, timestamp: string): string {
    const cached = this.runFolderByRunId.get(runId);
    if (cached) {
      return join(this.actualPromptDocsDir!, cached);
    }

    const existing = this.findExistingRunFolder(runId);
    if (existing) {
      this.runFolderByRunId.set(runId, existing);
      return join(this.actualPromptDocsDir!, existing);
    }

    const stamp = this.formatStamp(timestamp);
    const shortCode = this.getRunShortCode(runId);
    const folderName = `run_${stamp}_${shortCode}`;
    const runDir = join(this.actualPromptDocsDir!, folderName);
    mkdirSync(runDir, { recursive: true });

    const state: ActualPromptRunState = {
      runId,
      projectId,
      folderName,
      records: [],
    };
    this.writeRunState(runDir, state);
    this.writeRunIndex(runDir, state);

    this.runFolderByRunId.set(runId, folderName);
    return runDir;
  }

  private findExistingRunFolder(runId: string): string | undefined {
    if (!this.actualPromptDocsDir || !existsSync(this.actualPromptDocsDir)) {
      return undefined;
    }

    const entries = readdirSync(this.actualPromptDocsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const runDir = join(this.actualPromptDocsDir, entry.name);
      const statePath = join(runDir, ".actual-run-state.json");
      if (!existsSync(statePath)) {
        continue;
      }
      try {
        const parsed = JSON.parse(readFileSync(statePath, "utf8")) as ActualPromptRunState;
        if (parsed.runId === runId) {
          return entry.name;
        }
      } catch {
        // ignore malformed state files
      }
    }

    return undefined;
  }

  private readRunState(runDir: string, runId: string, projectId: string): ActualPromptRunState {
    const statePath = join(runDir, ".actual-run-state.json");
    if (!existsSync(statePath)) {
      return {
        runId,
        projectId,
        folderName: basename(runDir),
        records: [],
      };
    }

    try {
      const parsed = JSON.parse(readFileSync(statePath, "utf8")) as ActualPromptRunState;
      if (!Array.isArray(parsed.records)) {
        parsed.records = [];
      }
      return parsed;
    } catch {
      return {
        runId,
        projectId,
        folderName: basename(runDir),
        records: [],
      };
    }
  }

  private writeRunState(runDir: string, state: ActualPromptRunState): void {
    const statePath = join(runDir, ".actual-run-state.json");
    const normalized = {
      ...state,
      records: [...state.records].sort((a, b) => a.sequence - b.sequence),
    };
    writeFileSync(statePath, `${JSON.stringify(normalized, null, 2)}\n`);
  }

  private writeRunIndex(runDir: string, state: ActualPromptRunState): void {
    const records = [...state.records].sort((a, b) => a.sequence - b.sequence);
    const lines: string[] = [];
    lines.push(`# Actual Prompt Records for ${state.folderName}`);
    lines.push("");
    lines.push("Source logs: `logs/llm.jsonl`, `logs/llm-prompts-full.jsonl`");
    lines.push("");
    lines.push(`- Run ID: \`${state.runId}\``);
    lines.push(`- Project ID: \`${state.projectId || ""}\``);
    lines.push("");
    lines.push("| # | Request Timestamp | Agent | Retry | Request File | Response File |");
    lines.push("|---|---|---|---:|---|---|");

    for (const record of records) {
      const requestExists = !!record.requestFile && existsSync(join(runDir, record.requestFile));
      const responseExists = !!record.responseFile && existsSync(join(runDir, record.responseFile));
      const requestLink = record.requestFile
        ? requestExists
          ? `[${record.requestFile}](./${record.requestFile})`
          : "(missing)"
        : "(missing)";
      const responseLink = record.responseFile
        ? responseExists
          ? `[${record.responseFile}](./${record.responseFile})`
          : "(missing)"
        : "(pending)";
      const retryCell = this.getRetryLabel(record.retryAttempt);
      lines.push(
        `| ${record.sequence} | ${record.requestTimestamp} | ${record.agent} | ${retryCell} | ${requestLink} | ${responseLink} |`
      );
    }

    lines.push("");
    lines.push("## Request / Response Pairs");
    lines.push("");

    for (const record of records) {
      const requestExists = !!record.requestFile && existsSync(join(runDir, record.requestFile));
      const responseExists = !!record.responseFile && existsSync(join(runDir, record.responseFile));
      const requestPart = record.requestFile
        ? requestExists
          ? `[request](./${record.requestFile})`
          : "request pending"
        : "request pending";
      const responsePart = record.responseFile
        ? responseExists
          ? `[response](./${record.responseFile})`
          : "response pending"
        : "response pending";
      const attemptLabel = this.getAttemptLabel(record.retryAttempt);
      lines.push(
        `- ${String(record.sequence).padStart(2, "0")} ${record.agent} (${attemptLabel}): ${requestPart} | ${responsePart}`
      );
    }

    writeFileSync(join(runDir, "INDEX.md"), `${lines.join("\n")}\n`);
  }

  private writeActualRootReadme(): void {
    if (!this.actualPromptDocsDir || !existsSync(this.actualPromptDocsDir)) {
      return;
    }

    const folders = readdirSync(this.actualPromptDocsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && existsSync(join(this.actualPromptDocsDir!, entry.name, "INDEX.md")))
      .map((entry) => entry.name)
      .sort();

    const lines: string[] = [];
    lines.push("# Actual Prompt Records");
    lines.push("");
    lines.push("Generated from real run-time LLM request/response logs.");
    lines.push("");
    lines.push("## Runs");
    lines.push("");
    for (const folder of folders) {
      lines.push(`- [${folder}](./${folder}/INDEX.md)`);
    }

    writeFileSync(join(this.actualPromptDocsDir, "README.md"), `${lines.join("\n")}\n`);
  }

  private buildRequestFilename(sequence: number, agent: string, retryAttempt: number): string {
    const retryPart = this.getRetryFilePart(retryAttempt);
    return `${this.padSequence(sequence)}_${this.sanitizeForFilename(agent)}${retryPart}_request.md`;
  }

  private buildResponseFilename(sequence: number, agent: string, retryAttempt: number): string {
    const retryPart = this.getRetryFilePart(retryAttempt);
    return `${this.padSequence(sequence)}_${this.sanitizeForFilename(agent)}${retryPart}_response.md`;
  }

  private writeRequestMarkdown(runDir: string, fileName: string, entry: FullPromptLogEntry): void {
    const lines: string[] = [];
    lines.push("# Actual Prompt Record");
    lines.push("");
    lines.push(`- Run ID: \`${entry.runId}\``);
    lines.push(`- Project ID: \`${entry.projectId}\``);
    lines.push(`- Timestamp: \`${entry.timestamp}\``);
    lines.push(`- Agent: \`${entry.agent}\``);
    lines.push(`- Operation: \`${entry.operation}\``);
    lines.push(`- Model: \`${entry.model}\``);
    lines.push(`- Temperature: \`${entry.temperature}\``);
    lines.push(`- Max Tokens: \`${entry.maxTokens}\``);
    lines.push(`- Attempt: \`${this.getAttemptLabel(entry.retryAttempt)}\``);
    lines.push(`- Prompt Hash: \`${entry.promptHash}\``);

    entry.messages.forEach((message, index) => {
      lines.push("");
      lines.push(`## Message ${index + 1} (role=${message.role})`);
      lines.push("");
      lines.push("```text");
      lines.push(message.content);
      lines.push("```");
    });

    writeFileSync(join(runDir, fileName), `${lines.join("\n")}\n`);
  }

  private writeResponseMarkdown(
    runDir: string,
    fileName: string,
    record: ActualPromptRecord,
    entry: LLMLogEntry
  ): void {
    const lines: string[] = [];
    lines.push("# Actual Prompt Response Record");
    lines.push("");
    lines.push(`- Run ID: \`${entry.runId}\``);
    lines.push(`- Project ID: \`${entry.projectId}\``);
    lines.push(`- Request Timestamp: \`${record.requestTimestamp}\``);
    lines.push(`- Response Timestamp: \`${entry.timestamp}\``);
    lines.push(`- Agent: \`${entry.agent}\``);
    lines.push("- Operation: `chat_response`");
    lines.push(`- Model: \`${entry.model}\``);
    lines.push(`- Attempt: \`${this.getAttemptLabel(entry.retryAttempt)}\``);
    lines.push(`- Prompt Hash: \`${entry.promptHash}\``);

    if (entry.responseHash) lines.push(`- Response Hash: \`${entry.responseHash}\``);
    if (entry.latencyMs != null) lines.push(`- Latency (ms): \`${entry.latencyMs}\``);
    if (entry.promptTokens != null) lines.push(`- Prompt Tokens: \`${entry.promptTokens}\``);
    if (entry.completionTokens != null) lines.push(`- Completion Tokens: \`${entry.completionTokens}\``);
    if (entry.totalTokens != null) lines.push(`- Total Tokens: \`${entry.totalTokens}\``);
    if (entry.estimatedCost != null) lines.push(`- Estimated Cost: \`${entry.estimatedCost}\``);

    if (entry.response) {
      lines.push("");
      lines.push("## Response Body");
      lines.push("");
      lines.push("```text");
      lines.push(entry.response);
      lines.push("```");
    } else {
      lines.push("");
      lines.push("## Response Body");
      lines.push("");
      lines.push("Response text was not captured for this record.");
    }

    writeFileSync(join(runDir, fileName), `${lines.join("\n")}\n`);
  }

  private findOrCreateResponseRecord(state: ActualPromptRunState, entry: LLMLogEntry): ActualPromptRecord {
    const byExactKey = [...state.records]
      .reverse()
      .find(
        (record) =>
          record.promptHash === entry.promptHash &&
          record.retryAttempt === entry.retryAttempt &&
          record.agent === entry.agent
      );

    if (byExactKey) {
      return byExactKey;
    }

    const sequence = this.nextSequence(state);
    const created: ActualPromptRecord = {
      sequence,
      agent: entry.agent,
      retryAttempt: entry.retryAttempt,
      promptHash: entry.promptHash,
      requestTimestamp: entry.timestamp,
      requestFile: "",
    };
    state.records.push(created);
    return created;
  }

  private nextSequence(state: ActualPromptRunState): number {
    if (state.records.length === 0) {
      return 1;
    }
    return Math.max(...state.records.map((record) => record.sequence)) + 1;
  }

  private formatStamp(timestamp: string): string {
    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hour = String(date.getUTCHours()).padStart(2, "0");
    const minute = String(date.getUTCMinutes()).padStart(2, "0");
    return `${year}${month}${day}-${hour}${minute}`;
  }

  private getRunShortCode(runId: string): string {
    const withoutPrefix = runId.startsWith("run_") ? runId.slice(4) : runId;
    return withoutPrefix.split("-")[0] || withoutPrefix;
  }

  private padSequence(sequence: number): string {
    return String(sequence).padStart(2, "0");
  }

  private sanitizeForFilename(value: string): string {
    return value.replace(/[^A-Za-z0-9-]+/g, "_").replace(/^_+|_+$/g, "");
  }

  private normalizeRetryNumber(rawRetryAttempt: number): number {
    if (!Number.isFinite(rawRetryAttempt) || rawRetryAttempt <= 1) {
      return 0;
    }
    return Math.min(Math.max(rawRetryAttempt - 1, 1), 4);
  }

  private getRetryFilePart(rawRetryAttempt: number): string {
    const retry = this.normalizeRetryNumber(rawRetryAttempt);
    return retry > 0 ? `_retry${retry}` : "";
  }

  private getRetryLabel(rawRetryAttempt: number): string {
    const retry = this.normalizeRetryNumber(rawRetryAttempt);
    return retry > 0 ? String(retry) : "-";
  }

  private getAttemptLabel(rawRetryAttempt: number): string {
    const retry = this.normalizeRetryNumber(rawRetryAttempt);
    return retry > 0 ? `retry ${retry}` : "first";
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
