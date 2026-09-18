/**
 * THE WRITER WRITES A CHAPTER PER CALL, NOT A BOOK PER CALL.
 *
 * A_99 §10.4 planned the book as one call and measured that 52 of 53 archived books fit inside one
 * writer response. They fit the CAP. They do not fit the model's idea of a turn.
 *
 * MEASURED 2026-09-18, the first paid v2 run (seed 50862, `resume-1789750237998`, £0.14):
 * azure:gpt-4.1 was given all ten chapters and a 32,768-token cap, returned CHAPTER 1 — roughly
 * 1,300 tokens, 4% of the cap, not truncated — and stopped. The continuation was an `if`, so it ran
 * once, bought chapter 2, and the book shipped at 2 of 10: 1,964 words against the v1 arm's 8,965.
 *
 * Every instrument then reported an improvement, because 2 chapters of careful prose beat 10 of
 * ordinary prose on every rate the selector measures. That is the failure this file exists to stop:
 * an engine that is winning its own instruments while not writing the book.
 */
import { afterEach, describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildContractInput, generateBookV2 } from "../jobs/agents/agent9-v2/run.js";
import { resetRoleCache } from "../jobs/agents/agent9-v2/roles.js";
import type { OrchestratorContext } from "../jobs/agents/shared.js";

/**
 * The repo root, found by walking up from THIS FILE until the store is there.
 *
 * It used to be `join(process.cwd(), "..", "..")`, which is right only when vitest is invoked from
 * `apps/worker`. Run from the repo root — which is how `npx vitest run apps/worker` and CI both do
 * it — it resolved to `C:/`, the store was not found, and every test in the file SKIPPED. A suite
 * that reports "3 skipped" and moves on is a suite that is not running.
 */
const repoRoot = (): string => {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let up = 0; up < 8; up += 1) {
    if (existsSync(join(dir, "data", "store.json"))) return dir;
    dir = dirname(dir);
  }
  return join(process.cwd(), "..", "..");
};

const REPO_ROOT = repoRoot();

const loadProject = (): Record<string, unknown> | null => {
  const path = join(REPO_ROOT, "data", "store.json");
  if (!existsSync(path)) return null;
  try {
    const store = JSON.parse(readFileSync(path, "utf8")) as {
      artifacts?: Array<{ projectId?: string; type?: string; payload?: unknown }>;
    };
    const byProject = new Map<string, Record<string, unknown>>();
    for (const artifact of store.artifacts ?? []) {
      const id = String(artifact?.projectId ?? "");
      const type = String(artifact?.type ?? "");
      if (!id || !type) continue;
      if (!byProject.has(id)) byProject.set(id, {});
      byProject.get(id)![type] = artifact.payload;
    }
    for (const [, artifacts] of [...byProject].reverse()) {
      if (artifacts.cml && artifacts.clues && artifacts.outline && artifacts.cast && artifacts.character_profiles) {
        return artifacts;
      }
    }
  } catch {
    return null;
  }
  return null;
};

const artifacts = loadProject();

const unwrap = (value: unknown, keys: string[]): unknown => {
  const v = value as Record<string, unknown> | null;
  if (!v || typeof v !== "object") return value;
  for (const key of keys) if (v[key] && typeof v[key] === "object") return v[key];
  return value;
};

/** A paragraph of ordinary prose, long enough that the instruments have something to read. */
const body = (n: number): string =>
  [
    `=== CHAPTER ${n}: The Chapter ===`,
    `Bertram crossed the office and set the compass on the ledger, where the light from the ` +
      `window caught the scuffed brass casing and showed the wear along one edge.`,
    `"You hold it flat," he said, and waited, because the answer would matter more than the question.`,
  ].join("\n\n");

/**
 * The shape the engine's `chat` wrapper actually sends. The first cut of these fakes destructured
 * `{ user }`, which the wrapper has never sent — it sends `messages` — so every fake returned an
 * empty string and the failures they produced were claims about the fakes.
 */
interface ChatArgs {
  messages: Array<{ role: string; content: string }>;
  logContext?: { agent?: string };
}

interface Call {
  agent: string;
  user: string;
}

/** Which chapters this prompt is asking for: the continuation's list if there is one, else the contract's. */
const chaptersAsked = (user: string): number[] => {
  const asked = /Continue with ([\d, ]+)/.exec(user) ?? /Chapters owed: ([\d, ]+)/.exec(user);
  return (asked?.[1] ?? "")
    .split(",")
    .map((part) => Number(part.trim()))
    .filter(Number.isFinite);
};

const writerCalls = (calls: Call[]): Call[] => calls.filter((c) => /Writer/.test(c.agent));

/**
 * A client that behaves the way the paid run measured: it writes the FIRST chapter it is asked for
 * and stops, however many are owed.
 */
const oneChapterPerCall = (calls: Call[]) => ({
  chat: async ({ messages, logContext }: ChatArgs) => {
    const user = String(messages.at(-1)?.content ?? "");
    calls.push({ agent: String(logContext?.agent ?? ""), user });
    const first = chaptersAsked(user)[0];
    return { content: first ? body(first) : "" };
  },
  getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
});

/** A client that answers every continuation with nothing new. */
const refusesToContinue = (calls: Call[]) => ({
  chat: async ({ messages, logContext }: ChatArgs) => {
    const user = String(messages.at(-1)?.content ?? "");
    calls.push({ agent: String(logContext?.agent ?? ""), user });
    return { content: writerCalls(calls).length === 1 ? body(1) : "I have written the book already." };
  },
  getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
});

/**
 * A checkpoint path of this test's own.
 *
 * Without it every test in the file shares `agent9v2-checkpoint-continuation.json`, and since they
 * all build the SAME contract from the same archived project, the second test restores the first
 * test's book and never calls the writer. That is not a test artefact — it is the production defect
 * this file pins, met in the test harness first.
 */
let checkpointSeq = 0;

const contextWith = (client: unknown): OrchestratorContext =>
  ({
    client,
    inputs: {
      targetLength: "short",
      humourLevel: "classic",
      agent9CheckpointPath: join(
        tmpdir(),
        `cml-v2-checkpoint-${process.pid}-${(checkpointSeq += 1)}.json`,
      ),
    },
    runId: "continuation",
    projectId: "continuation",
    startTime: Date.now(),
    reportProgress: () => {},
    warnings: [] as string[],
    errors: [] as string[],
    workerAppRoot: join(process.cwd(), "logs-test"),
    workspaceRoot: REPO_ROOT,
    primaryAxis: "temporal",
    cml: artifacts?.cml,
    clues: artifacts?.clues,
    narrative: unwrap(artifacts?.outline, ["narrative", "outline"]),
    cast: { cast: unwrap(artifacts?.cast, ["cast"]) },
    characterProfiles: artifacts?.character_profiles,
    worldDocument: artifacts?.world_document,
    locationProfiles: artifacts?.location_profiles,
    temporalContext: artifacts?.temporal_context,
    setting: artifacts?.setting,
    lockedFactRegistry: [],
  }) as unknown as OrchestratorContext;

const KEYS = ["PROSE_ENGINE", "PROSE_V2_DRY", "PROSE_V2_DRAFTS", "PROSE_V2_WRITER"] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
afterEach(() => {
  for (const key of KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  resetRoleCache();
});

describe.skipIf(!artifacts)("the continuation runs until the chapters owed are delivered", () => {
  it("KNOWN-POSITIVE: a writer that stops after one chapter still yields the whole book", async () => {
    process.env.PROSE_V2_DRAFTS = "1";
    const calls: Call[] = [];
    const ctx = contextWith(oneChapterPerCall(calls));

    const result = await generateBookV2(ctx);
    const owed = result.contract.scenes.length;

    // This is the assertion the first paid run would have failed: 2 of 10.
    expect(owed).toBeGreaterThan(2);
    expect(result.chapters.length).toBe(owed);
    expect(writerCalls(calls).length).toBeGreaterThanOrEqual(owed);
  });

  it("the chapters arrive in order and none is written twice", async () => {
    process.env.PROSE_V2_DRAFTS = "1";
    const result = await generateBookV2(contextWith(oneChapterPerCall([])));
    const numbers = result.chapters.map((_chapter, index) => index);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it("STOPS on a continuation that adds nothing, rather than paying for the same refusal", async () => {
    // Every round re-sends the whole book so far, so an unbounded retry is the expensive failure.
    process.env.PROSE_V2_DRAFTS = "1";
    const calls: Call[] = [];
    const ctx = contextWith(refusesToContinue(calls));

    const result = await generateBookV2(ctx);

    // the first call, and ONE continuation that made no progress
    expect(writerCalls(calls).length).toBe(2);
    expect(result.chapters.length).toBe(1);
    const ctxWarnings = (ctx as unknown as { warnings: string[] }).warnings;
    expect(ctxWarnings.some((w) => /added no chapter/.test(w))).toBe(true);
  });

  it("KNOWN-POSITIVE: an INCOMPLETE checkpointed segment is rewritten, not inherited", async () => {
    // The paid run wrote a 2-of-10 segment into its checkpoint and called it done. Every later run
    // on that project would have restored it and never called the writer — a truncated book, made
    // permanent, announced as "restored from the checkpoint".
    process.env.PROSE_V2_DRAFTS = "1";
    const shared = join(tmpdir(), `cml-v2-shared-${process.pid}-${Date.now()}.json`);

    const stopsAfterOne = (calls: Call[]) => ({
      chat: async ({ messages, logContext }: ChatArgs) => {
        const user = String(messages.at(-1)?.content ?? "");
        calls.push({ agent: String(logContext?.agent ?? ""), user });
        return { content: writerCalls(calls).length === 1 ? body(1) : "nothing further" };
      },
      getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
    });

    const firstCalls: Call[] = [];
    const first = contextWith(stopsAfterOne(firstCalls));
    (first.inputs as { agent9CheckpointPath?: string }).agent9CheckpointPath = shared;
    const firstResult = await generateBookV2(first);
    expect(firstResult.chapters.length).toBeLessThan(firstResult.contract.scenes.length);

    const secondCalls: Call[] = [];
    const second = contextWith(oneChapterPerCall(secondCalls));
    (second.inputs as { agent9CheckpointPath?: string }).agent9CheckpointPath = shared;
    const secondResult = await generateBookV2(second);

    // The second run must write the book, not inherit one chapter.
    expect(writerCalls(secondCalls).length).toBeGreaterThan(0);
    expect(secondResult.chapters.length).toBe(secondResult.contract.scenes.length);
  });

  it("a writer that delivers the whole book in one call makes no continuation call at all", async () => {
    process.env.PROSE_V2_DRAFTS = "1";
    const calls: Call[] = [];
    const wholeBook = {
      chat: async ({ messages, logContext }: ChatArgs) => {
        const user = String(messages.at(-1)?.content ?? "");
        calls.push({ agent: String(logContext?.agent ?? ""), user });
        return { content: chaptersAsked(user).map(body).join("\n\n") };
      },
      getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
    };
    const ctx = contextWith(wholeBook);

    const result = await generateBookV2(ctx);

    expect(result.chapters.length).toBe(result.contract.scenes.length);
    expect(writerCalls(calls).filter((c) => /continue/i.test(c.agent))).toEqual([]);
  });
});
