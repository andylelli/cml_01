#!/usr/bin/env node
/**
 * A_100 B2 — the PART-TYPE vocabulary, learned from the parts and assigned back to them.
 *
 *   node scripts/corpus-part-types.mjs [--budget=0.25] [--dry]
 *   npm run corpus:part-types
 *
 * ── WHY THIS IS A JUDGEMENT AND NOT A REGEX ──────────────────────────────────────────────────────
 *
 * A hand-set of eight regex buckets caught 61% of false-solution flaws and 39% of red-herring
 * explanations (WP-004 §3.2). The remainder are not unclassifiable; they are shapes the hand-set did
 * not think of. A vocabulary that is LEARNED from the strings gets finer as the corpus grows, which is
 * the one property scale should buy and a hand-written enum cannot have (WP-004 §6.4).
 *
 * Two stages per part kind, both by the chat model (no embedding deployment exists on this
 * resource — `corpus-classify.mjs` made the same choice for the same reason):
 *
 *   PROPOSE  all strings of a kind (or a sample, for steps) -> 8–14 named types with one-line
 *            definitions, chosen to partition the sample; `other` is allowed and counted.
 *   ASSIGN   every string -> exactly one type from the proposed list, in batches of 40.
 *
 * The vocabulary is written BESIDE the assignments so a later run can re-assign against a frozen
 * vocabulary (`--vocab=<path>`) instead of proposing a new one — otherwise every refit would move the
 * types under the grammar fitted on them, which is the drift this project keeps paying for.
 *
 * Budget-guarded like `corpus-encode.mjs`: aborts before any call that would cross `--budget`.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const ROOT = "C:/CML";
const PARTS = `${ROOT}/library/index/parts.json`;
const OUT = `${ROOT}/library/index/part-types.json`;
const args = process.argv.slice(2);
const BUDGET = Number((args.find((a) => a.startsWith("--budget=")) ?? "--budget=0.25").split("=")[1]);
const DRY = args.includes("--dry");
const VOCAB_IN = (args.find((a) => a.startsWith("--vocab=")) ?? "").split("=")[1] || null;

const env = Object.fromEntries(
  readFileSync(`${ROOT}/.env.local`, "utf8").split(/\r?\n/)
    .filter((l) => /^[A-Z][A-Z0-9_]*=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).split("#")[0].trim()]),
);
const ENDPOINT = env.AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "");
const KEY = env.AZURE_OPENAI_API_KEY;
const VER = env.AZURE_OPENAI_API_VERSION || "2024-10-21";
const MODEL = "gpt-4.1-mini";
const PRICE = { in: 0.316, out: 1.264 };   // £ per 1M tokens, from packages/llm-client/src/cost-tracker.ts

let spend = 0;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function ask(system, user, maxTokens = 1500) {
  const est = ((system.length + user.length) / 4 * PRICE.in + maxTokens * PRICE.out) / 1e6;
  if (spend + est > BUDGET) throw new Error(`budget: £${spend.toFixed(4)} + est £${est.toFixed(4)} would cross £${BUDGET}`);
  if (DRY) { console.log(`  [dry] would send ${Math.round((system.length + user.length) / 4)} tokens`); return null; }
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`${ENDPOINT}/openai/deployments/${MODEL}/chat/completions?api-version=${VER}`, {
      method: "POST", headers: { "Content-Type": "application/json", "api-key": KEY },
      body: JSON.stringify({ messages: [{ role: "system", content: system }, { role: "user", content: user }],
        max_tokens: maxTokens, temperature: 0.1, response_format: { type: "json_object" } }),
    });
    if (res.status === 429) { await sleep(20000); continue; }
    if (res.status === 400) {
      const body = await res.text();
      /**
       * MEASURED 2026-09-18: 118 red-herring explanations in one prompt passed; ~137 inference steps
       * — "X was killed by Y" at density — tripped Azure's content management policy. The filter is
       * on the PROMPT, so it is a batch-size problem: the caller splits and retries. Anything else
       * on 400 is a real error.
       */
      if (/content management policy|content_filter/i.test(body)) { const e = new Error("content-filter"); e.contentFilter = true; throw e; }
      throw new Error(`HTTP 400: ${body.slice(0, 200)}`);
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const j = await res.json();
    spend += (j.usage.prompt_tokens * PRICE.in + j.usage.completion_tokens * PRICE.out) / 1e6;
    return JSON.parse(j.choices[0].message.content);
  }
  throw new Error("rate limited after 6 attempts");
}

const P = JSON.parse(readFileSync(PARTS, "utf8"));
const kinds = {
  flaw: { what: "the ONE FLAW that refutes a detective novel's false solution (the wrong accusation)",
    items: P.items.filter((c) => c.false_solution?.the_one_flaw).map((c) => ({ ref: `${c.slug}#fs`, text: c.false_solution.the_one_flaw })) },
  herring: { what: "the INNOCENT EXPLANATION behind a red herring in a detective novel (why the suspicious thing was not the crime)",
    items: P.items.flatMap((c) => c.herrings.filter((h) => h.innocent_explanation).map((h) => ({ ref: `${c.slug}#rh${h.i}`, text: h.innocent_explanation }))) },
  step: { what: "one step of a detective's INFERENCE CHAIN, given as observation -> correction -> effect",
    items: P.items.flatMap((c) => c.chain.map((s) => ({ ref: `${c.slug}#s${s.i}`, text: `${s.observation} || ${s.correction} || ${s.effect}` }))) },
};

const FRAME = "This is literary-structural analysis of public-domain Golden Age detective fiction (1860-1930) for a research corpus; the instances describe fictional plot mechanics only. ";
const SYS_PROPOSE = (what) => `${FRAME}You are classifying STRUCTURAL SHAPES in Golden Age detective fiction. You will be given many instances of: ${what}. Propose a vocabulary of 8 to 14 TYPES that partitions them by SHAPE (the kind of move being made), never by content (no names, places or objects). Each type: a snake_case id of 2-4 words and a one-line definition. Types must be mutually exclusive and jointly cover the instances; include "other" only if needed. Return JSON {"types":[{"id":"...","definition":"..."}]}.`;
const SYS_ASSIGN = (what, types) => `${FRAME}You are classifying STRUCTURAL SHAPES in Golden Age detective fiction. Each instance is: ${what}. Assign each to exactly ONE type from this list, by SHAPE not content:\n${types.map((t) => `- ${t.id}: ${t.definition}`).join("\n")}\nReturn JSON {"assignments":[{"ref":"...","type":"..."}]} with one entry per instance, refs copied exactly.`;

const out = { generated_by: "scripts/corpus-part-types.mjs", generated_on: new Date().toISOString().slice(0, 10), model: MODEL, vocabulary: {}, assignments: {}, counts: {}, spend_gbp: 0 };
const frozen = VOCAB_IN ? JSON.parse(readFileSync(VOCAB_IN, "utf8")).vocabulary : null;

for (const [kind, k] of Object.entries(kinds)) {
  console.log(`\n${kind}: ${k.items.length} instances`);
  let types;
  if (frozen?.[kind]) { types = frozen[kind]; console.log(`  vocabulary: frozen from ${VOCAB_IN} (${types.length} types)`); }
  else {
    const sample = kind === "step" ? k.items.filter((_, i) => i % 5 === 0) : k.items;   // steps: every fifth, ~80
    const propose = async (items) => {
      try { return (await ask(SYS_PROPOSE(k.what), items.map((x, i) => `${i + 1}. ${x.text}`).join("\n"), 1200))?.types ?? []; }
      catch (e) { if (!e.contentFilter || items.length < 20) throw e; return propose(items.filter((_, i) => i % 2 === 0)); }
    };
    types = await propose(sample);
    console.log(`  proposed ${types.length} types from ${sample.length}: ${types.map((t) => t.id).join(", ")}`);
  }
  out.vocabulary[kind] = types;
  const valid = new Set(types.map((t) => t.id));
  const assigned = {};
  const filtered = [];
  /** Assign a batch; on a content-filter 400 split it in half and try each half, down to singletons. */
  const assignBatch = async (batch) => {
    try {
      const r = await ask(SYS_ASSIGN(k.what, types), batch.map((x) => `${x.ref} :: ${x.text}`).join("\n"), 1800);
      for (const a of r?.assignments ?? []) if (valid.has(a.type)) assigned[a.ref] = a.type;
    } catch (e) {
      if (!e.contentFilter) throw e;
      if (batch.length === 1) { filtered.push(batch[0].ref); return; }
      const mid = Math.ceil(batch.length / 2);
      await assignBatch(batch.slice(0, mid));
      await assignBatch(batch.slice(mid));
    }
  };
  for (let i = 0; i < k.items.length; i += 40) {
    await assignBatch(k.items.slice(i, i + 40));
    process.stdout.write(`\r  assigned ${Math.min(i + 40, k.items.length)}/${k.items.length}   `);
  }
  process.stdout.write("\n");
  if (filtered.length) console.log(`  ${filtered.length} instance(s) refused by the content filter even alone: ${filtered.slice(0, 5).join(", ")}${filtered.length > 5 ? " ..." : ""}`);
  out.filtered = { ...(out.filtered ?? {}), [kind]: filtered };
  out.assignments[kind] = assigned;
  const counts = {}; for (const t of Object.values(assigned)) counts[t] = (counts[t] ?? 0) + 1;
  out.counts[kind] = counts;
  const missing = k.items.length - Object.keys(assigned).length;
  console.log(`  ${Object.keys(assigned).length} assigned, ${missing} unassigned · ${Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(" · ")}`);
  out.spend_gbp = +spend.toFixed(4);
  if (!DRY) writeFileSync(OUT, `${JSON.stringify(out, null, 1)}\n`, "utf8");   // a later kind failing must not lose this one
}
out.spend_gbp = +spend.toFixed(4);
if (!DRY) { writeFileSync(OUT, `${JSON.stringify(out, null, 1)}\n`, "utf8"); console.log(`\nwrote ${OUT} · spend £${spend.toFixed(4)}`); }
