/**
 * ── A_86 item 12 — is the VICTIM ALIVE gate flagging recollection, or real resurrection? ─────────
 *
 * MEASURED CONTEXT: 3 of the 12 prose retries in the last four runs were this class, the single
 * largest driver, and two of the three sentences read as ordinary past-tense CHARACTERISATION of a
 * dead person — "Adela Ashgrove insisted on cross-checking every delivery against the tide clock",
 * "And yet, Marguerite Selwyn was nothing if not precise." A mystery cannot be written without
 * saying what the victim was like, so if the gate cannot tell habitual past from on-page action it
 * is buying 30k-token retries for correct prose.
 *
 * WHAT THIS ANSWERS, and deliberately not more: over every shipped chapter in the store, how often
 * does the gate fire, and how many of those firings sit inside a sentence that ALSO carries an
 * explicit retrospect marker (used to, always, never, would,"in life", "had been").
 * A firing with such a marker is a candidate false positive; one without is presumed real.
 *
 * This does NOT change behaviour. The exemption it argues for is only worth building if the rate is
 * material, and per CLAUDE.md a negative result from a probe is a claim about the probe until it is
 * shown to work against a known positive — so the probe prints its own known-positive check first.
 */

import { readFileSync } from "node:fs";
import { detectVictimAlive } from "../packages/prompts-llm/dist/agent9-prose/generate.js";

const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const byProject = new Map();
for (const a of Object.values(store.artifacts ?? [])) {
  if (!byProject.has(a.projectId)) byProject.set(a.projectId, {});
  byProject.get(a.projectId)[a.type] = a.payload;
}

/** Past-habitual / retrospect markers: the sentence is ABOUT the dead person, not staging them. */
const RETROSPECT = /\b(?:used to|always|never|would (?:have )?|had (?:been|always|never)|in life|by all accounts|everyone (?:said|agreed)|was known|had a habit|was nothing if not|insisted on|preferred|kept to)\b/i;

const sentencesOf = (text) => text.split(/(?<=[.!?])\s+/);

// ── known-positive check: the gate MUST fire on an unambiguous resurrection ──
const KNOWN_POSITIVE = { paragraphs: ['"I saw nothing," Adela Ashgrove said, turning to the window.'] };
const KNOWN_NEGATIVE = { paragraphs: ["The rain had not stopped since Tuesday."] };
const posFires = detectVictimAlive(KNOWN_POSITIVE, "Adela Ashgrove").length > 0;
const negFires = detectVictimAlive(KNOWN_NEGATIVE, "Adela Ashgrove").length > 0;
console.log(`known-positive fires: ${posFires ? "YES (probe works)" : "NO — PROBE IS BROKEN, ignore everything below"}`);
console.log(`known-negative fires: ${negFires ? "YES — PROBE IS BROKEN" : "no (correct)"}`);
if (!posFires || negFires) process.exit(1);

let books = 0;
let firings = 0;
let withRetrospect = 0;
const examples = [];
for (const [pid, p] of byProject) {
  const victim = (p.cml?.CASE?.cast ?? []).find((c) =>
    /victim/i.test(String(c?.role_archetype ?? c?.roleArchetype ?? c?.role ?? "")),
  )?.name;
  const chapters = p.prose?.chapters;
  if (!victim || !Array.isArray(chapters)) continue;
  books += 1;
  for (const chapter of chapters) {
    for (const sentence of detectVictimAlive(chapter, victim)) {
      firings += 1;
      if (RETROSPECT.test(sentence)) {
        withRetrospect += 1;
        if (examples.length < 6) examples.push(`${pid.slice(-6)}: ${sentence.trim().slice(0, 120)}`);
      }
    }
  }
}

console.log(`\nbooks with a named victim and prose: ${books}`);
console.log(`gate firings across every shipped chapter : ${firings}`);
console.log(
  `...carrying an explicit retrospect marker        : ${withRetrospect}` +
    ` (${firings > 0 ? ((100 * withRetrospect) / firings).toFixed(1) : "0"}% — candidate false positives)`,
);
for (const e of examples) console.log(`   e.g. ${e}`);
console.log(
  `\nNOTE: these are SHIPPED chapters, i.e. text that already passed or was repaired. The retry-time` +
    ` rate is not observable from here — this bounds the shape of the problem, not its cost.`,
);
