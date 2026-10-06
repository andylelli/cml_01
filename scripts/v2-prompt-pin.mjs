#!/usr/bin/env node
/**
 * A_111 CR-d — pin the v2 writer prompts under the configurations that SHIP, not only the one the replay records.
 *
 * MEASURED 2026-10-06: the five replay fixtures record 146–147 env keys and none of CML_VERIFIED_FIXES,
 * CML_PROMPT_TRIMS, CML_IDENTITY_ROLE_WINS or any A_110 flag, while `.env.local` ships the first three ON — so
 * `replay:check` proves the OFF branch of what ships byte-identical, and nothing pins the ON branch.
 *
 * This builds every chapter's writer prompt (book so far empty) from `dist` for each case in the two v2-prose fixture
 * stores, under each PROFILE below, and records a sha256 per (case, profile, chapter). No model call, £0. The fixture
 * stores are committed, so the pin moves only when the CODE moves.
 *
 *   node scripts/v2-prompt-pin.mjs            # compare with eval/replay/v2-prompt-pin.json; exit 1 on any change
 *   node scripts/v2-prompt-pin.mjs --write    # record (after reviewing what moved)
 *
 * Needs `npm run build:all`.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const PIN = join(ROOT, "eval", "replay", "v2-prompt-pin.json");
const FIXTURES = ["v2-prose-cdad5315", "v2-prose-d0ee7b26"];

const SHIPPED = { CML_VERIFIED_FIXES: "1", CML_PROMPT_TRIMS: "1", CML_IDENTITY_ROLE_WINS: "1" };
const A110_B = { PROSE_V2_CONTRACT_FIXES: "1", PROSE_V2_OPENING: "1", PROSE_V2_SELECTOR_RANKS: "1", PROSE_V2_TAIL_FINDING: "1" };
const PROFILES = {
  off: {},
  shipped: SHIPPED,
  "shipped+a110B": { ...SHIPPED, ...A110_B },
  // A_111 P-6 arm C: everything that ships plus the A_110 arm-B flags and the V batch.
  "shipped+a110B+audit": { ...SHIPPED, ...A110_B, PROSE_V2_AUDIT_FIXES: "1" },
};
// Every flag any profile sets, cleared before each profile so they cannot leak between profiles.
const TOUCHED = [...new Set(Object.values(PROFILES).flatMap((p) => Object.keys(p)))];

const pe = await import(pathToFileURL(join(ROOT, "packages/prose-engine/dist/index.js")).href);
const run = await import(pathToFileURL(join(ROOT, "apps/worker/dist/jobs/agents/agent9-v2/run.js")).href);

const casesOf = (fixture) => {
  const store = JSON.parse(gunzipSync(readFileSync(join(ROOT, "eval", "replay", `${fixture}.store.json.gz`))).toString("utf8"));
  const by = new Map();
  for (const a of Object.values(store.artifacts ?? {})) {
    if (!a?.projectId) continue;
    if (!by.has(a.projectId)) by.set(a.projectId, {});
    by.get(a.projectId)[a.type] = a.payload; // the latest row of each type wins, as the run reads it
  }
  const spec = (pid) => Object.values(store.specs ?? {}).filter((s) => s.projectId === pid).pop()?.spec ?? {};
  const out = [];
  for (const [id, a] of by) {
    if (!a.cml || !a.outline || !a.clues || !a.cast) continue;
    out.push({
      id,
      input: {
        cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast?.cast ?? a.cast, profiles: a.character_profiles,
        world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting,
        // The device's own locked facts: deterministic from the store (a run's registry file is not committed).
        lockedFacts: a.hard_logic_devices?.devices?.[0]?.lockedFacts ?? [],
        humourLevel: spec(id).humourLevel ?? "classic", targetLength: spec(id).targetLength ?? "short",
      },
    });
  }
  return out;
};

const sha = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const saved = { ...process.env };
const pins = {};
for (const fixture of FIXTURES) {
  for (const c of casesOf(fixture)) {
    for (const [profile, env] of Object.entries(PROFILES)) {
      for (const k of TOUCHED) delete process.env[k];
      Object.assign(process.env, env);
      const k = pe.buildBookContract(c.input);
      const chapters = k.scenes?.length ?? k.core?.scenes?.length ?? 0;
      const rows = [];
      for (let ch = 1; ch <= chapters; ch++) {
        const user = run.assembleWriterPrompt({ bible: k.bible.text, brief: k.brief.text, contracts: run.renderSceneContract(k, ch), soFar: "", format: pe.writerFormatInstruction([ch]) });
        rows.push(sha(user));
      }
      pins[`${fixture} · ${c.id} · ${profile}`] = rows;
    }
  }
}
process.env = saved;

if (process.argv.includes("--write")) {
  writeFileSync(PIN, JSON.stringify(pins, null, 1) + "\n");
  console.log(`[v2-prompt-pin] wrote ${Object.keys(pins).length} (case, profile) rows to ${PIN}`);
  process.exit(0);
}
if (!existsSync(PIN)) {
  console.log("[v2-prompt-pin] no pin recorded — run with --write");
  process.exit(1);
}
const before = JSON.parse(readFileSync(PIN, "utf8"));
let moved = 0;
for (const key of new Set([...Object.keys(before), ...Object.keys(pins)])) {
  const a = before[key] ?? [], b = pins[key] ?? [];
  const changed = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) changed.push(i + 1);
  if (changed.length) { moved++; console.log(`MOVED  ${key}: chapter(s) ${changed.join(", ")}`); }
}
console.log(moved === 0 ? `[v2-prompt-pin] clean — ${Object.keys(pins).length} (case, profile) rows byte-identical` : `[v2-prompt-pin] ${moved} row(s) moved`);
process.exit(moved === 0 ? 0 : 1);
