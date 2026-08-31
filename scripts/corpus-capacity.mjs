#!/usr/bin/env node
/**
 * A_77 Phase 2 — deployment capacity probe.
 *
 * `corpus-encode.mjs` failed on gpt-4.1 with eight consecutive 429s at a constant 32s Retry-After.
 * That is a QUOTA CEILING, not a burst: if a deployment's tokens-per-minute is below the size of the
 * prompt, no amount of backoff will ever let the call through. This reads the rate-limit headers
 * Azure returns on a cheap call, so the encode model is chosen against a measured ceiling rather
 * than a hopeful one.
 */
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync("C:/CML/.env.local", "utf8").split(/\r?\n/)
    .filter((l) => /^[A-Z][A-Z0-9_]*=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).split("#")[0].trim()]),
);
const ENDPOINT = env.AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "");
const KEY = env.AZURE_OPENAI_API_KEY;
const VER = env.AZURE_OPENAI_API_VERSION || "2024-10-21";

const INTERESTING = [
  "x-ratelimit-limit-tokens", "x-ratelimit-remaining-tokens",
  "x-ratelimit-limit-requests", "x-ratelimit-remaining-requests",
  "x-ratelimit-reset-tokens", "retry-after",
];

for (const dep of ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4.1"]) {
  const res = await fetch(`${ENDPOINT}/openai/deployments/${dep}/chat/completions?api-version=${VER}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": KEY },
    body: JSON.stringify({ messages: [{ role: "user", content: "ok" }], max_tokens: 1 }),
  });
  const hdrs = INTERESTING.map((h) => [h, res.headers.get(h)]).filter(([, v]) => v != null);
  console.log(`\n${dep}  HTTP ${res.status}`);
  if (!hdrs.length) console.log("  (no rate-limit headers returned)");
  for (const [h, v] of hdrs) console.log(`  ${h.padEnd(30)} ${v}`);
  const lim = Number(res.headers.get("x-ratelimit-limit-tokens"));
  if (Number.isFinite(lim) && lim > 0) {
    console.log(`  => largest single prompt that can ever succeed: ~${lim.toLocaleString()} tokens`);
    console.log(`     (the eight novels run 57k–259k tokens; ${lim < 60000 ? "THIS DEPLOYMENT CANNOT TAKE THEM" : "workable"})`);
  }
}
