/**
 * CR-03 (documentation/code-review) — RECORD / REPLAY.
 *
 * WHY. The functions that decide most of a run — `runAgent9`, `generateProse`, `generateMystery`,
 * the v2 prose engine — have 0% unit coverage and could be exercised only by a paid run (~£1.15).
 * Every behaviour-preserving refactor of them was therefore either unproven or expensive. A replay
 * runs the SAME code offline: each LLM call is answered from a recording, and a call whose prompt
 * differs by one byte from the recorded one fails, naming the agent and the first differing byte.
 * "The refactor changed nothing" becomes a free, exact check instead of a belief.
 *
 * WHERE IT SITS. At `chat()` — the boundary every agent calls. The real client's `chat()` wraps
 * `chatOnce()` in `withRetry`, and `chatOnce()` logs each ATTEMPT (prompt, then response or error).
 * A cassette is that attempt log. Replay serves each call the outcome the caller actually saw: a
 * recorded error FOLLOWED BY another attempt with the same prompt was a retry the loop swallowed, so
 * it is skipped; an error that is the last attempt of its prompt is what the caller saw, so it is
 * re-thrown. The recording decides, not the error text: the live loop classifies by HTTP status,
 * which the log keeps only as prose (MEASURED: a 429 re-thrown by a text rule changed the book).
 *
 * WHAT IT CHECKS. The prompt: `messages`, compared by the same hash the logger records
 * (`LLMLogger.hashContent(JSON.stringify(messages))`), WITHIN the call's agent label. The label is
 * part of a call's identity: the v2 engine sends a segment's three drafts in parallel with IDENTICAL
 * prompts, told apart only by label (-D1/-D2/-D3). Matched by hash alone, draft 1 was served draft 2's
 * recorded reply, a different draft won, and every later prompt differed (MEASURED 2026-09-29). Calls must also be complete: `unconsumed()`
 * lists recorded attempts the code never asked for (it made fewer calls than the recording).
 * Parameter differences (maxTokens, temperature, model) are reported by `report()`, not thrown —
 * the resolved model depends on env routing, which a replay does not own.
 *
 * TWO MODES.
 *   strict  (default) — match by prompt hash. The proof mode: a refactor must reproduce every prompt.
 *   rebase            — match by agent label and call order, serve the recorded outcome, and record the
 *                       prompt the CURRENT code sent. `rebased()` returns the cassette with those
 *                       prompts. A deliberate prompt change is re-baselined for free, and the cassette
 *                       diff shows exactly which prompts it changed. The rebased cassette is what the
 *                       CURRENT code does: attempts it no longer asks for are dropped, and a call the
 *                       recording never made is stored as a failure marked `synthetic` — the replay
 *                       answers it with an error, which the pipeline handles as a failed call. Rebase
 *                       never invents a response; a paid recording replaces the synthetic entries.
 *
 * A mismatch is REMEMBERED as well as thrown: pipeline code that catches a failed call and carries on
 * (the v2 engine treats a thrown draft as a failed draft) must not turn a mismatch into a pass.
 */
import { gunzipSync, gzipSync } from "zlib";
import { readFileSync, writeFileSync } from "fs";
import { CostTracker } from "./cost-tracker.js";
import { ContentFilterTracker } from "./content-filter.js";
import { LLMLogger } from "./logger.js";
import type { ChatOptions, ChatResponse, Message, TokenUsage } from "./types.js";

/** One recorded ATTEMPT — a prompt and what came back. */
export interface CassetteEntry {
  seq: number;
  agent: string;
  promptHash: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  retryAttempt?: number;
  messages: Message[];
  /** Written by rebase for a call the recording never made; always an error outcome. */
  synthetic?: true;
  outcome:
    | { kind: "response"; content: string; usage: TokenUsage; finishReason: string; model: string; latencyMs?: number }
    | { kind: "error"; errorCode?: string; errorMessage: string };
}

export interface Cassette {
  /** Where it came from: a run id, the logs it was joined from, when. Free-form provenance. */
  source: Record<string, unknown>;
  entries: CassetteEntry[];
}

/** `.jsonl` or `.jsonl.gz`: line 1 is `{"source": …}`, every further line one CassetteEntry. */
export function readCassette(path: string): Cassette {
  const buf = readFileSync(path);
  const text = path.endsWith(".gz") ? gunzipSync(buf).toString("utf8") : buf.toString("utf8");
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) throw new Error(`Cassette ${path} is empty`);
  const head = JSON.parse(lines[0]);
  if (!head || typeof head !== "object" || !("source" in head)) {
    throw new Error(`Cassette ${path}: first line must be {"source": …}`);
  }
  return { source: head.source, entries: lines.slice(1).map((l) => JSON.parse(l) as CassetteEntry) };
}

/** Inverse of readCassette. `.gz` compresses. */
export function writeCassette(path: string, cassette: Cassette): void {
  const text = [JSON.stringify({ source: cassette.source }), ...cassette.entries.map((e) => JSON.stringify(e))].join("\n") + "\n";
  writeFileSync(path, path.endsWith(".gz") ? gzipSync(text, { level: 9 }) : text);
}

const callKey = (agent: string, promptHash: string): string => `${agent}|${promptHash}`;

export const promptHashOf = (messages: Message[]): string => LLMLogger.hashContent(JSON.stringify(messages));

export class ReplayMismatchError extends Error {
  constructor(message: string, readonly agent: string, readonly offset: number) {
    super(message);
    this.name = "ReplayMismatchError";
  }
}

/** First index where two strings differ, or -1. */
function firstDifference(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a.charCodeAt(i) !== b.charCodeAt(i)) return i;
  return a.length === b.length ? -1 : n;
}

const excerpt = (s: string, at: number): string =>
  JSON.stringify(s.slice(Math.max(0, at - 60), at + 60));

export interface ReplayReport {
  mode: ReplayMode;
  calls: number;
  attemptsServed: number;
  parameterDrift: string[];
  /** Every mismatch thrown, even if the caller swallowed it. Non-empty = the replay did not match. */
  mismatches: string[];
}

export type ReplayMode = "strict" | "rebase";

export class ReplayClient {
  private readonly queues = new Map<string, CassetteEntry[]>();
  private readonly byAgent = new Map<string, CassetteEntry[]>();
  private readonly consumed = new Set<number>();
  private readonly costTracker = new CostTracker();
  private readonly contentFilterTracker = new ContentFilterTracker();
  private readonly logger = new LLMLogger({
    logToConsole: false,
    logToFile: false,
    logFullPromptsToFile: false,
    logActualPromptDocsToFile: false,
  });
  private calls = 0;
  private readonly drift: string[] = [];
  private readonly mismatches: string[] = [];
  /** rebase mode: every attempt served, in call order, with the prompt the current code sent. */
  private readonly served: CassetteEntry[] = [];
  private promptsChanged = 0;

  constructor(readonly cassette: Cassette, readonly mode: ReplayMode = "strict") {
    const ordered = [...cassette.entries].sort((a, b) => a.seq - b.seq);
    for (const e of ordered) {
      const q = this.queues.get(callKey(e.agent, e.promptHash)) ?? [];
      q.push(e);
      this.queues.set(callKey(e.agent, e.promptHash), q);
      const a = this.byAgent.get(e.agent) ?? [];
      a.push(e);
      this.byAgent.set(e.agent, a);
    }
  }

  static fromFile(path: string, mode: ReplayMode = "strict"): ReplayClient {
    return new ReplayClient(readCassette(path), mode);
  }

  async chat(options: ChatOptions): Promise<ChatResponse> {
    this.calls += 1;
    const agent = options.logContext?.agent ?? "(no agent label)";
    const hash = promptHashOf(options.messages);
    let queue: CassetteEntry[] | undefined;
    if (this.mode === "rebase") {
      // Next unconsumed attempts of this agent, in recorded order; one logical call = the attempts that
      // share the first one's recorded hash (retries of the same prompt).
      const pendingForAgent = (this.byAgent.get(agent) ?? []).filter((e) => !this.consumed.has(e.seq));
      if (pendingForAgent.length === 0) {
        const errorMessage = `CR-03 rebase: "${agent}" made a call the recording does not have; the replay answers it with this error`;
        this.served.push({ seq: -1, agent, promptHash: hash, messages: options.messages, synthetic: true, outcome: { kind: "error", errorMessage } });
        throw new Error(errorMessage);
      }
      const first = pendingForAgent[0];
      queue = pendingForAgent.filter((e) => e.promptHash === first.promptHash);
      if (first.promptHash !== hash) this.promptsChanged += 1;
      // Remove them from the hash queue too, so strict bookkeeping stays consistent.
      const hq = this.queues.get(callKey(agent, first.promptHash)) ?? [];
      this.queues.set(callKey(agent, first.promptHash), hq.filter((e) => !queue!.includes(e)));
      queue = [...queue];
    } else {
      queue = this.queues.get(callKey(agent, hash));
      if (!queue || queue.length === 0) throw this.remember(this.mismatch(agent, options.messages));
    }

    for (;;) {
      const entry = queue.shift()!;
      this.consumed.add(entry.seq);
      if (this.mode === "rebase") this.served.push({ ...entry, messages: options.messages, promptHash: hash });
      this.noteDrift(agent, entry, options);
      if (entry.outcome.kind === "response") {
        const o = entry.outcome;
        this.costTracker.trackCost(o.model, o.usage, agent);
        return { content: o.content, usage: o.usage, model: o.model, finishReason: o.finishReason, latencyMs: o.latencyMs ?? 0 };
      }
      if (queue.length > 0) continue; // the same prompt was sent again: a retry swallowed this error
      throw new Error(entry.outcome.errorMessage);
    }
  }

  async chatWithRetry(options: ChatOptions): Promise<ChatResponse> {
    return this.chat(options);
  }

  getCostTracker(): CostTracker {
    return this.costTracker;
  }

  getContentFilterTracker(): ContentFilterTracker {
    return this.contentFilterTracker;
  }

  getLogger(): LLMLogger {
    return this.logger;
  }

  /** rebase mode: the cassette with each served attempt's prompt replaced by what the code sent now. */
  rebased(): Cassette {
    const entries = this.served.map((e, seq) => ({ ...e, seq }));
    const synthetic = entries.filter((e) => e.synthetic).map((e) => e.agent);
    return {
      source: {
        ...this.cassette.source,
        rebasedAt: new Date().toISOString(),
        promptsChangedByRebase: this.promptsChanged,
        droppedByRebase: this.unconsumed().length,
        syntheticFailures: synthetic,
      },
      entries,
    };
  }

  private remember(err: ReplayMismatchError): ReplayMismatchError {
    this.mismatches.push(err.message.split("\n")[0]);
    return err;
  }

  /** Recorded attempts the code never asked for: it made fewer (or different) calls than the run. */
  unconsumed(): CassetteEntry[] {
    return this.cassette.entries.filter((e) => !this.consumed.has(e.seq));
  }

  report(): ReplayReport {
    return { mode: this.mode, calls: this.calls, attemptsServed: this.consumed.size, parameterDrift: [...this.drift], mismatches: [...this.mismatches] };
  }

  private noteDrift(agent: string, entry: CassetteEntry, options: ChatOptions): void {
    const maxTokens = options.maxTokens ?? 4000;
    if (entry.maxTokens !== undefined && entry.maxTokens !== maxTokens) {
      this.drift.push(`${agent} #${entry.seq}: maxTokens ${entry.maxTokens} recorded, ${maxTokens} now`);
    }
    if (options.model && entry.model && options.model !== entry.model) {
      this.drift.push(`${agent} #${entry.seq}: model ${entry.model} recorded, ${options.model} now`);
    }
  }

  /** The prompt matched nothing recorded: explain against the next unconsumed call of the same agent. */
  private mismatch(agent: string, messages: Message[]): ReplayMismatchError {
    const candidates = (this.byAgent.get(agent) ?? []).filter((e) => !this.consumed.has(e.seq));
    const actual = JSON.stringify(messages);
    if (candidates.length === 0) {
      const known = [...this.byAgent.keys()].slice(0, 12).join(", ");
      return new ReplayMismatchError(
        `Replay: no recorded call left for agent "${agent}" (call #${this.calls}). ` +
          `The code made a call the recording does not have. Recorded agents: ${known}…`,
        agent,
        -1,
      );
    }
    const expected = JSON.stringify(candidates[0].messages);
    const at = firstDifference(expected, actual);
    return new ReplayMismatchError(
      `Replay: prompt for "${agent}" differs from the recording (seq ${candidates[0].seq}) at byte ${at} ` +
        `of ${expected.length} recorded / ${actual.length} now.\n  recorded: ${excerpt(expected, at)}\n  now:      ${excerpt(actual, at)}`,
      agent,
      at,
    );
  }
}
