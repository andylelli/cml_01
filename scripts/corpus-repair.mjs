#!/usr/bin/env node
/**
 * A_77 Phase 2 — repair-only pass.
 *
 *   node scripts/corpus-repair.mjs <slug> [--attempts=4]
 *
 * Re-encoding a novel to fix a validator error costs ~£0.23 and rerolls the whole case: the third
 * attempt at The Leavenworth Case came back WORSE (5 errors, where the previous encode had reached
 * 2), because a fresh encode is a fresh sample, not an improvement. The paid, mostly-good encoding
 * is already on disk in encode-raw.json. Repair THAT.
 *
 * Runs on gpt-4.1 — the input is one JSON case (~10k tokens), far inside the 50k/min ceiling that
 * makes gpt-4.1 unusable for the encode itself. ~£0.03 a round instead of £0.23.
 *
 * THE PRINCIPLE THAT MADE REPAIRS WORK: never ask the model to guess at a problem the error message
 * has already diagnosed. The validator names the missing grounding terms; quote them back. The
 * reaction detector matches a fixed vocabulary; list it. Generic "fix these errors" prompts failed
 * three rounds running; targeted ones succeeded on the first.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import yaml from "js-yaml";

const ROOT = "C:/CML";
const slug = process.argv[2];
const ATTEMPTS = Number((process.argv.find((a) => a.startsWith("--attempts=")) ?? "--attempts=4").split("=")[1]);
if (!slug) { console.error("usage: corpus-repair.mjs <slug>"); process.exit(2); }

const env = Object.fromEntries(
  readFileSync(`${ROOT}/.env.local`, "utf8").split(/\r?\n/)
    .filter((l) => /^[A-Z][A-Z0-9_]*=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).split("#")[0].trim()]),
);
const ENDPOINT = env.AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "");
const KEY = env.AZURE_OPENAI_API_KEY;
const VER = env.AZURE_OPENAI_API_VERSION || "2024-10-21";
const PRICE = { in: 1.58, out: 6.32 };

const dir = `${ROOT}/library/works/${slug}`;
const prov = yaml.load(readFileSync(`${dir}/provenance.yaml`, "utf8"));
let data = JSON.parse(readFileSync(`${dir}/encode-raw.json`, "utf8"));

const { validateCml } = await import(`file://${ROOT}/packages/cml/dist/validator.js`);
const buildCml = (await import(`file://${ROOT}/scripts/lib-build-cml.mjs`)).buildCml;
const meta = {
  title: prov.title, author: prov.author,
  license: `Public domain (first published ${prov.first_publication_year}; author died ${prov.author_death_year}). Project Gutenberg ebook ${prov.source.ebook_id}.`,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let spend = 0;
async function ask(messages) {
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`${ENDPOINT}/openai/deployments/gpt-4.1/chat/completions?api-version=${VER}`, {
      method: "POST", headers: { "Content-Type": "application/json", "api-key": KEY },
      body: JSON.stringify({ messages, max_tokens: 12000, temperature: 0.1, response_format: { type: "json_object" } }),
    });
    if (res.status === 429) { process.stderr.write("  429, waiting 25s\n"); await sleep(25000); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const j = await res.json();
    spend += (j.usage.prompt_tokens * PRICE.in + j.usage.completion_tokens * PRICE.out) / 1e6;
    process.stderr.write(`  [gpt-4.1] in=${j.usage.prompt_tokens} out=${j.usage.completion_tokens}\n`);
    return JSON.parse(j.choices[0].message.content);
  }
  throw new Error("rate limited");
}

const BANNED = "confess, confession, reaction, react, reacts, breaks down, breakdown, admits, admission, betrays himself, observe the suspects, watch their faces";

let v = validateCml(buildCml(data, meta));
console.log(`${slug}: ${v.valid ? "already PASS" : `FAIL (${v.errors.length})`}`);

for (let n = 1; n <= ATTEMPTS && !v.valid; n++) {
  const terms = [...new Set(v.errors
    .map((e) => /required_evidence:\s*(.+)$/.exec(e)?.[1] ?? "")
    .flatMap((t) => t.split(",").map((x) => x.trim()).filter(Boolean)))];

  let hint = "";
  if (terms.length) {
    hint += `\n\nGROUNDING. The validator names these exact terms as missing: ${terms.join(", ")}.\n` +
      `Insert each one, verbatim, into at least one inference_path observation or required_evidence item. ` +
      `Do not change what the case MEANS — only make the earlier steps mention the vocabulary the later ones use.`;
  }
  if (v.errors.some((e) => /reaction\/confession language/.test(e))) {
    hint += `\n\nREACTION LANGUAGE. The detector matches WORDS, not meaning. Remove every occurrence of: ${BANNED}.\n` +
      `If the case contains a document that purports to be a confession, call it what it PHYSICALLY is — ` +
      `"the forged letter", "the disputed document" — because its evidential value is the paper and the ` +
      `handwriting, not the act of confessing. If a test gathers people, describe the COMPARISON being made ` +
      `(timings, access records, physical traces set against one another), never the watching of behaviour.`;
  }
  if (v.errors.some((e) => /is too brief|too abstract/.test(e))) {
    hint += `\n\nEVIDENCE DETAIL. Any required_evidence item flagged as brief or abstract must become 8+ words ` +
      `naming a concrete thing: an object, a document, a timestamp, a measurement, an access record.`;
  }

  console.log(`  attempt ${n}: repairing ${v.errors.length} error(s)${terms.length ? ` [${terms.length} terms]` : ""}`);
  let next;
  try {
    next = await ask([
      { role: "system", content: "You repair a JSON case encoding so it satisfies a validator. Change as little as possible; preserve the case's meaning exactly. Output the FULL corrected JSON only." },
      { role: "user", content: `These validator errors must all be cleared:\n${v.errors.join("\n")}${hint}\n\nJSON:\n${JSON.stringify(data)}` },
    ]);
  } catch (e) { console.log(`  ${e.message}`); break; }

  const cand = validateCml(buildCml(next, meta));
  // Keep the repair only if it is not worse. A reroll that increases the error count is a step back.
  if (cand.errors.length <= v.errors.length) { data = next; v = cand; }
  else console.log(`  attempt ${n} rejected (${cand.errors.length} > ${v.errors.length}) — keeping previous`);
}

console.log(`\n${slug}: ${v.valid ? "PASS" : `FAIL (${v.errors.length})`}   repair spend £${spend.toFixed(4)}`);
v.errors.slice(0, 4).forEach((e) => console.log("  • " + e.slice(0, 140)));
writeFileSync(`${dir}/encode-raw.json`, JSON.stringify(data, null, 1), "utf8");
if (v.valid) {
  writeFileSync(`${dir}/case.cml2.yaml`, yaml.dump(buildCml(data, meta), { lineWidth: 100 }), "utf8");
  console.log(`  wrote case.cml2.yaml`);
}
