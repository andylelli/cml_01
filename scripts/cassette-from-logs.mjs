#!/usr/bin/env node
// CR-03 — build a replay cassette for one run from the logs the LLM client already writes.
//
// The client logs every ATTEMPT twice: the request to `llm-prompts-full.jsonl` (full messages) and
// the outcome to `llm.jsonl` (`chat_response` with the full text, or `chat_error`). Both carry
// runId, agent and promptHash, so a past run is a free recording. This joins them.
//
//   node scripts/cassette-from-logs.mjs --run <runId> --out fixtures/x.jsonl.gz
//   node scripts/cassette-from-logs.mjs --run <runId> --out x.jsonl.gz --logs <file> --logs <file>
//
// Default log locations: logs/, logs/archive/, apps/api/logs/, apps/worker/logs/ — resume runs log
// to logs/, API runs to apps/api/logs/, and rotated files go to logs/archive/.
// Error text is scrubbed of URLs (it carries the Azure endpoint host). Fails if any prompt attempt has
// no outcome, or any outcome no prompt — a cassette with a hole replays as a lie.
import { createReadStream, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
// The cassette format has ONE body: @cml/llm-client (build:all first).
import { writeCassette } from '../packages/llm-client/dist/index.js';

const args = process.argv.slice(2);
const arg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const runId = arg('--run');
const out = arg('--out');
if (!runId || !out) { console.error('usage: --run <runId> --out <file.jsonl[.gz]> [--logs <file>]…'); process.exit(2); }

const explicit = args.flatMap((a, i) => (a === '--logs' ? [args[i + 1]] : []));
const dirs = ['logs', 'logs/archive', 'apps/api/logs', 'apps/worker/logs'];
const files = explicit.length ? explicit : dirs.filter(existsSync).flatMap((d) =>
  readdirSync(d).filter((f) => /^llm(-prompts-full)?[-.].*jsonl$|^llm\.jsonl$|^llm-prompts-full\.jsonl$/.test(f)).map((f) => join(d, f)));

const prompts = [];
const outcomes = [];
const seen = new Set();
for (const file of files) {
  const rl = createInterface({ input: createReadStream(file), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.includes(runId)) continue;
    let o;
    try { o = JSON.parse(line); } catch { continue; }
    if (o.runId !== runId) continue;
    const key = `${o.timestamp}|${o.promptHash}|${o.operation ?? 'prompt'}|${o.messages ? 'p' : 'o'}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (Array.isArray(o.messages)) prompts.push(o);
    else if (o.operation === 'chat_response' || o.operation === 'chat_error') outcomes.push(o);
  }
}
const byTime = (a, b) => (a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0);
prompts.sort(byTime);
outcomes.sort(byTime);
if (prompts.length === 0) { console.error(`no prompts for ${runId} in ${files.length} log file(s)`); process.exit(1); }

const pending = new Map();
for (const o of outcomes) { const q = pending.get(o.promptHash) ?? []; q.push(o); pending.set(o.promptHash, q); }
const scrub = (s) => String(s ?? '').replace(/https?:\/\/[^\s"')]+/g, '<url>');
const entries = [];
const holes = [];
prompts.forEach((p, seq) => {
  const o = pending.get(p.promptHash)?.shift();
  if (!o) { holes.push(`${p.agent} ${p.timestamp}: prompt with no outcome`); return; }
  const outcome = o.operation === 'chat_response'
    ? { kind: 'response', content: o.response, finishReason: o.finishReason ?? 'stop', model: o.model, latencyMs: o.latencyMs,
        usage: { promptTokens: o.promptTokens ?? 0, completionTokens: o.completionTokens ?? 0, totalTokens: o.totalTokens ?? 0,
          ...(o.cachedPromptTokens !== undefined ? { cachedPromptTokens: o.cachedPromptTokens } : {}) } }
    : { kind: 'error', errorCode: o.errorCode, errorMessage: scrub(o.errorMessage) };
  entries.push({ seq, agent: p.agent, promptHash: p.promptHash, model: p.model, temperature: p.temperature,
    maxTokens: p.maxTokens, retryAttempt: p.retryAttempt, messages: p.messages, outcome });
});
for (const [hash, q] of pending) for (const o of q) holes.push(`${o.agent} ${o.timestamp}: outcome with no prompt (${hash})`);
if (holes.length) { console.error(`cassette has ${holes.length} hole(s):\n  ` + holes.slice(0, 20).join('\n  ')); process.exit(1); }
if (entries.some((e) => e.outcome.kind === 'response' && typeof e.outcome.content !== 'string')) {
  console.error('a response record has no text: the outcome log did not keep full responses'); process.exit(1);
}

const source = { runId, projectId: prompts[0].projectId, builtFrom: files, builtAt: new Date().toISOString(),
  attempts: entries.length, errors: entries.filter((e) => e.outcome.kind === 'error').length };
writeCassette(out, { source, entries });
const agents = new Set(entries.map((e) => e.agent.replace(/-(S\d+-D\d+|Ch\d+-R\d+)$/, '')));
console.log(`cassette ${out}: ${entries.length} attempts (${source.errors} errors), ${agents.size} agent families, project ${source.projectId}`);
