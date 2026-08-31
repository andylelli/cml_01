#!/usr/bin/env node
/**
 * A_77 Phase 2 — deployment probe.
 *
 * Which Azure deployments actually answer, what their configured context is, and what a token costs.
 * Run before `corpus-encode.mjs` so the model choice is a measurement rather than a guess.
 */
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync("C:/CML/.env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z][A-Z0-9_]*=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).split("#")[0].trim()]),
);

const ENDPOINT = env.AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "");
const KEY = env.AZURE_OPENAI_API_KEY;
const VER = env.AZURE_OPENAI_API_VERSION || "2024-10-21";

const CANDIDATES = ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4.1", "gpt-4o"];

for (const dep of CANDIDATES) {
  const url = `${ENDPOINT}/openai/deployments/${dep}/chat/completions?api-version=${VER}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": KEY },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Reply with the single word: ok" }],
        max_tokens: 5,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.log(`${dep.padEnd(14)} HTTP ${res.status}  ${t.slice(0, 90).replace(/\s+/g, " ")}`);
      continue;
    }
    const j = await res.json();
    console.log(`${dep.padEnd(14)} OK   reply="${(j.choices?.[0]?.message?.content ?? "").trim()}"  usage=${JSON.stringify(j.usage)}`);
  } catch (e) {
    console.log(`${dep.padEnd(14)} ERROR ${String(e.message).slice(0, 80)}`);
  }
}
