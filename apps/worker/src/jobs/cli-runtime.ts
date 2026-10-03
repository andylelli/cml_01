/**
 * Shared bootstrap for the worker's standalone entry points (replay bench, resume CLI, eval harness).
 *
 * Each of these runs OUTSIDE the API process, so each needs the same three things before it can do
 * anything: environment loaded from `.env.local`, an LLM logger writing to the canonical log paths,
 * and a client built from the same config the API uses. Those were previously copied per script.
 *
 * The log paths matter more than they look. Cost auditing reads `logs/llm-prompts-full.jsonl` and
 * nothing else (`report-total-cost-underreports-7x`), so a bench that logged somewhere private would
 * be invisible to the only cost measurement this project trusts.
 */

import { readBooleanFlag } from "@cml/cml";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { AzureOpenAIClient, LLMLogger, ReplayClient, writeCassette } from "@cml/llm-client";

/** The replay client built for this process, if any — so a CLI can check completeness at exit. */
export let activeReplayClient: ReplayClient | undefined;

/**
 * CR-03 — after a replayed stage: every recorded attempt must have been asked for, or the code made
 * fewer calls than the run it replays. Returns the lines to print; empty = the replay was exact.
 */
export function replayCompletenessProblems(): { lines: string[]; failed: boolean } {
  if (!activeReplayClient) return { lines: [], failed: false };
  const left = activeReplayClient.unconsumed();
  const r = activeReplayClient.report();
  const lines = r.parameterDrift.map((d) => `[replay] parameter drift: ${d}`);
  for (const m of r.mismatches) lines.push(`[replay] MISMATCH: ${m}`);
  if (left.length) lines.push(`[replay] ${left.length} recorded attempt(s) never requested: ${left.slice(0, 8).map((e) => e.agent).join(", ")}`);
  // rebase: write the cassette with the current prompts, even when it failed — the diff is the evidence.
  const out = (process.env.LLM_REPLAY_REBASE_OUT ?? "").trim();
  if (r.mode === "rebase" && out) {
    const rebased = activeReplayClient.rebased();
    writeCassette(out, rebased);
    const syn = (rebased.source.syntheticFailures as string[]) ?? [];
    lines.push(`[replay] rebased cassette written to ${out}: ${rebased.entries.length} attempts; ${rebased.source.promptsChangedByRebase} call(s) with a changed prompt; ${rebased.source.droppedByRebase} recorded attempt(s) dropped; ${syn.length} synthetic failure(s)${syn.length ? ` (${syn.join(", ")})` : ""}`);
    return { lines: [...lines, `[replay] RESULT: REBASED — replay it in strict mode to confirm a MATCH`], failed: r.mismatches.length > 0 };
  }
  const failed = r.mismatches.length > 0 || left.length > 0;
  lines.push(failed ? `[replay] RESULT: NO MATCH (${r.mode})` : `[replay] RESULT: MATCH — ${r.calls} calls, ${r.attemptsServed} recorded attempts, all served (${r.mode})`);
  return { lines, failed };
}

/**
 * Minimal .env reader — no dependency, never echoes values.
 *
 * Existing environment always wins: a value already set was set deliberately (by a harness arm, a
 * CI job, or an operator probing a flag), and a dotenv file that overrode it would silently undo
 * the experiment being run.
 */
export function loadEnvFiles(root: string): void {
  // CR-03 — a replay fixture carries its own flag environment; this machine's .env.local must not
  // leak into it (CI has none, so a fixture digested against a local file would fail there).
  if (readBooleanFlag("CML_SKIP_ENV_FILES", false)) return;
  for (const name of [".env.local", ".env"]) {
    const path = join(root, name);
    if (!existsSync(path)) continue;
    for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      const quoted = (val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"));
      if (quoted) {
        val = val.slice(1, -1);
      } else {
        /**
         * A_91 — STRIP THE INLINE COMMENT. This hand-rolled parser did not, while the canary path
         * uses real `dotenv`, which does. So the same file gave two different values depending on
         * which entry point read it:
         *
         *     AGENT9_PROMPT_TOKEN_CEILING=56000  # raised from 40000 2026-09-04
         *
         * reached `dotenv` as "56000" and reached THIS parser as "56000  # raised from 40000...",
         * which `Number()` reads as NaN, so the prose prompt ceiling fell back to its 24,000 default
         * on every resumed run. MEASURED in the prompts themselves: the fresh run 81042 logged
         * `budget=56000 … dropped=[none]`, and the two resumes that followed logged `budget=24000 …
         * dropped=[humour_guide, background_context, location_profiles]`. Both books now waiting to
         * be read were written with less than half the intended prompt.
         *
         * BLAST RADIUS, measured over the 128 flags in `.env.local`: 38 carry an inline comment. The
         * booleans survived by accident, because their readers test a leading `true|1|yes|on` and the
         * comment sits after it; the two NUMERIC ones did not — this ceiling, and `AGENT9_GROUNDING_LEAD`,
         * whose `0` became NaN and turned a deliberate OFF into a fallback ON.
         *
         * Only an UNQUOTED value is trimmed, and only at whitespace-then-#, so a `#` inside a value
         * (a URL fragment, a password) is untouched unless it is preceded by a space.
         */
        const hash = val.search(/\s#/);
        if (hash >= 0) val = val.slice(0, hash).trim();
      }
      if (key && process.env[key] === undefined) process.env[key] = val;
    }
  }
}

/**
 * X3 (architecture/REVIEW_05.md §12.3) — THE parser for the logging switches.
 *
 * There were four of these: here, `apps/api/src/server.ts`, `scripts/canary-core.mjs` and
 * `scripts/canary-agent-boundary.mjs`. Three accepted only the literal string `"true"`, so
 * `LOG_FULL_PROMPTS_TO_FILE=1` — the form every gated flag in this pipeline accepts — read as
 * FALSE and silently disabled full-prompt logging. The failure mode is losing the evidence for a
 * run that has already been paid for, and it would look like the run had never been made.
 *
 * The truthy set matches the rest of the pipeline (`1|true|yes|on`). An empty value takes the
 * default rather than reading as false: `LOG_TO_FILE=` in a dotenv file is an unset key, not an
 * instruction to stop logging.
 */
export const parseEnvBool = (v: string | undefined, def: boolean): boolean =>
  v === undefined || v === "" ? def : /^(1|true|yes|on)$/i.test(v);

/**
 * THE logger every entry point builds — API, canary core, agent-loop boundary, benches.
 *
 * Four copies of this existed, three of them carrying a comment claiming to match the API's version
 * "exactly" — a correspondence maintained by hand, which is to say not maintained. They had already
 * drifted twice: the agent-loop copy once omitted the full-prompt and actual-doc options entirely
 * (so an agent-loop run wrote `llm.jsonl` and nothing else, silently, for every agent), and it
 * still defaulted `logFilePath` to a relative `apps/api/logs/llm.jsonl` where the others resolve
 * against the workspace root.
 */
export function buildLlmLogger(workspaceRoot: string): LLMLogger {
  return new LLMLogger({
    logLevel: process.env.LOG_LEVEL as any,
    logToConsole: parseEnvBool(process.env.LOG_TO_CONSOLE, true),
    logToFile: parseEnvBool(process.env.LOG_TO_FILE, true),
    logFilePath: process.env.LOG_FILE_PATH || join(workspaceRoot, "logs", "llm.jsonl"),
    logFullPromptsToFile: parseEnvBool(process.env.LOG_FULL_PROMPTS_TO_FILE, true),
    fullPromptLogFilePath:
      process.env.FULL_PROMPT_LOG_FILE_PATH || join(workspaceRoot, "logs", "llm-prompts-full.jsonl"),
    logActualPromptDocsToFile: parseEnvBool(process.env.LOG_ACTUAL_PROMPT_DOCS_TO_FILE, true),
    actualPromptDocsDir:
      process.env.ACTUAL_PROMPT_DOCS_DIR || join(workspaceRoot, "documentation", "prompts", "actual"),
  });
}

/**
 * X14 (REVIEW_05 §27.3) — THE DEPLOYMENT NAME IS A CREDENTIAL, and there is one body for saying so.
 *
 * `?? "gpt-4o-mini"` appeared at ELEVEN call sites. §20.4 found the harnesses resolving `gpt-4o-mini`
 * while the pipeline resolved `gpt-4.1-mini` — *"a £6 four-run probe would have measured a model the
 * product does not use, and nothing in the report would have said so"* — fixed the loader precedence,
 * and then deleted the key from `.env`, leaving it in a git-ignored file only. Every silent default
 * was one missing key away from restoring the defect, undetectably, and §12.5 records that two
 * sources for this one key is *"how the `gpt-4o-mini` shadowing survived for months"*.
 *
 * Eleven copies of a default is the two-bodies trap at scale, so the fix is one function rather than
 * eleven edits: the correspondence between them was never going to be maintained by hand.
 *
 * Callers that must not start without it use `require`; callers that legitimately degrade (the API's
 * optional client, the worker's `null` path) use `resolve` and handle the empty string themselves.
 */
export const resolveAzureDeployment = (): string => process.env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "";

export function requireAzureDeployment(): string {
  const deployment = resolveAzureDeployment();
  if (!deployment) {
    throw new Error(
      "AZURE_OPENAI_DEPLOYMENT_NAME is not set. It is deliberately NOT defaulted: a run that silently " +
        "uses a different model than the one being measured is worse than a run that does not start " +
        "(REVIEW_05 §20.4 / X14). Set it in .env.local at the workspace root.",
    );
  }
  return deployment;
}

/** Mirrors `apps/api`'s client construction, including the logger. Credentials are never printed. */
export function buildClient(workspaceRoot: string): AzureOpenAIClient {
  // CR-03 — offline replay. With a cassette (scripts/cassette-from-logs.mjs) every call is answered
  // from the recording and a prompt that differs by one byte throws, naming the agent and the byte.
  // No credentials, no network, no cost. Read at call time (ADR-0004).
  const cassette = (process.env.LLM_REPLAY_CASSETTE ?? "").trim();
  if (cassette) {
    const mode = (process.env.LLM_REPLAY_MODE ?? "").trim() === "rebase" ? "rebase" : "strict";
    const replay = ReplayClient.fromFile(cassette, mode);
    console.log(`[replay] LLM_REPLAY_CASSETTE=${cassette} (${mode}): ${replay.cassette.entries.length} recorded attempts; no LLM calls will be made`);
    activeReplayClient = replay;
    // The pipeline uses chat / chatWithRetry / getCostTracker / getLogger / getContentFilterTracker,
    // all of which ReplayClient provides; the cast is the one place that knowledge lives.
    return replay as unknown as AzureOpenAIClient;
  }
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT ?? "";
  const apiKey = process.env.AZURE_OPENAI_API_KEY ?? "";
  if (!endpoint || !apiKey) {
    throw new Error(
      "Missing Azure credentials. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY (or put them in .env.local at the workspace root).",
    );
  }
  // This is the client `resume-run` builds, which is R5's kill-and-resume drill: a resume that
  // silently continued a `gpt-4.1-mini` run on `gpt-4o-mini` would mix two models inside one probe
  // run, and nothing would say so.
  const deployment = requireAzureDeployment();
  return new AzureOpenAIClient({
    endpoint,
    apiKey,
    defaultModel: deployment,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-10-21",
    requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE ?? 60),
    logger: buildLlmLogger(workspaceRoot),
  } as any);
}
