// A_111 V batch — OFF byte-identity over every stored case (wider than `npm run pin:v2`, which pins 2 fixture cases):
// every chapter's writer prompt, the scene objects, the notes and the bible, under four profiles x false lead on/off,
// with PROSE_V2_AUDIT_FIXES unset. Build the base commit, write a.json; build the change, write b.json; then --diff.
//   node p19-off-identity.mjs a.json   ·   node p19-off-identity.mjs --diff a.json b.json   (exit 1 on any moved row)
//   P19_KNOWN_POSITIVE=1 sets the flag ON, so a --diff against an OFF file must move rows — the probe can see a change.
import fs from "node:fs";
import { createHash } from "node:crypto";
if (process.argv[2] === "--diff") {
  const a = JSON.parse(fs.readFileSync(process.argv[3], "utf8")), b = JSON.parse(fs.readFileSync(process.argv[4], "utf8"));
  let moved = 0, total = 0;
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { total++; if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) { moved++; if (moved <= 10) console.log("MOVED", k); } }
  console.log(`${moved} of ${total} rows moved`);
  process.exit(moved ? 1 : 0);
}
const R = (p) => new URL(`../../../../${p}`, import.meta.url).href;
const { cases } = await import("./cases.mjs");
const pe = await import(R("packages/prose-engine/dist/index.js"));
const run = await import(R("apps/worker/dist/jobs/agents/agent9-v2/run.js"));
const SHIPPED = { CML_VERIFIED_FIXES: "1", CML_PROMPT_TRIMS: "1", CML_IDENTITY_ROLE_WINS: "1" };
const B = { PROSE_V2_CONTRACT_FIXES: "1", PROSE_V2_OPENING: "1", PROSE_V2_SELECTOR_RANKS: "1", PROSE_V2_TAIL_FINDING: "1" };
const PROFILES = { off: {}, shipped: SHIPPED, shippedB: { ...SHIPPED, ...B }, shippedSched: { ...SHIPPED, ...B, PROSE_V2_SCHEDULE: "1", CML_A110_UPSTREAM: "1" } };
const TOUCHED = [...new Set([...Object.values(PROFILES).flatMap((p) => Object.keys(p)), "PROSE_V2_AUDIT_FIXES"])];
const sha = (s) => createHash("sha256").update(s).digest("hex").slice(0, 16);
const out = {};
for (const c of cases) {
  for (const [name, env] of Object.entries(PROFILES)) {
    for (const falseLead of [false, true]) {
      for (const k of TOUCHED) delete process.env[k];
      Object.assign(process.env, env);
      if (process.env.P19_KNOWN_POSITIVE === "1") process.env.PROSE_V2_AUDIT_FIXES = "1"; // the probe's own known positive
      const k = pe.buildBookContract({ ...c.input, falseLead });
      const rows = [];
      for (const s of k.scenes) rows.push(sha(run.assembleWriterPrompt({ bible: k.bible.text, brief: k.brief.text, contracts: run.renderSceneContract(k, s.chapter), soFar: "", format: pe.writerFormatInstruction([s.chapter]) })));
      out[`${c.id}·${name}·fl${falseLead ? 1 : 0}`] = { prompts: rows, scenes: sha(JSON.stringify(k.scenes)), notes: sha(JSON.stringify(k.notes)), bible: sha(JSON.stringify(k.bible)) };
    }
  }
}
fs.writeFileSync(process.argv[2], JSON.stringify(out));
console.log("wrote", Object.keys(out).length, "rows");
