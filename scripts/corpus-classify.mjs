#!/usr/bin/env node
/**
 * A_77 Phase 2 / A_78 §9 — the judgement fields that do not derive.
 *
 *   node scripts/corpus-classify.mjs [slug ...]
 *
 * Three fields cannot be computed from a case file, and one was being computed WRONGLY:
 *
 *   mechanism_family  A_78 §4 recorded that the ledger's regex classifier produces plausible-but-
 *                     wrong families, and §16.9 showed a wrong family propagates into the novelty
 *                     verdict. corpus-derive.mjs then reproduced that exact defect: "a jury of her
 *                     peers" classified as `secret_will_inheritance` because the mechanism text
 *                     contains the word "will" as a VERB, and the twisted candle as `poison_delayed`
 *                     because a regex cannot tell a candle from a dose. Keyword rules over free text
 *                     are the wrong instrument for a judgement. This asks a model that has the case.
 *
 *   principleType     4-value enum. Not in the CML. A_78 §9.1.
 *   title             a device needs a NAME, which is invention, not extraction.
 *
 * Runs on gpt-4.1: the input is one case file (~8k tokens), far inside the 50k/min ceiling that
 * makes gpt-4.1 unusable for the encode itself. This is the cheapest place in the pipeline to buy
 * judgement, at roughly 1.5p a book.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import yaml from "js-yaml";

const ROOT = "C:/CML";
const WORKS = `${ROOT}/library/works`;
const env = Object.fromEntries(
  readFileSync(`${ROOT}/.env.local`, "utf8").split(/\r?\n/)
    .filter((l) => /^[A-Z][A-Z0-9_]*=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).split("#")[0].trim()]),
);
const ENDPOINT = env.AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "");
const KEY = env.AZURE_OPENAI_API_KEY;
const VER = env.AZURE_OPENAI_API_VERSION || "2024-10-21";
const PRICE = { in: 1.58, out: 6.32 };

const FAMILIES = ["locked_room_key", "locked_room_timing", "alibi_fabrication", "impersonation",
  "substituted_body", "poison_delayed", "poison_substitution", "staged_scene", "unconscious_act",
  "disguised_natural_agent", "hidden_accomplice", "information_leak", "recorded_presence",
  "secret_will_inheritance"];
const DEVICE_FAMILY = {
  locked_room_key: "spatial_routing", locked_room_timing: "timing", alibi_fabrication: "timing",
  poison_delayed: "timing", poison_substitution: "timing", recorded_presence: "timing",
  impersonation: "identity", substituted_body: "identity",
  secret_will_inheritance: "authority", information_leak: "authority",
  staged_scene: "spatial_routing", hidden_accomplice: "behavioral",
  disguised_natural_agent: "behavioral", unconscious_act: "behavioral",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let spend = 0;
async function ask(messages) {
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(`${ENDPOINT}/openai/deployments/gpt-4.1/chat/completions?api-version=${VER}`, {
      method: "POST", headers: { "Content-Type": "application/json", "api-key": KEY },
      body: JSON.stringify({ messages, max_tokens: 700, temperature: 0.1, response_format: { type: "json_object" } }),
    });
    if (res.status === 429) { await sleep(25000); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const j = await res.json();
    spend += (j.usage.prompt_tokens * PRICE.in + j.usage.completion_tokens * PRICE.out) / 1e6;
    return JSON.parse(j.choices[0].message.content);
  }
  throw new Error("rate limited after 6 attempts");
}

const slugs = process.argv.slice(2).length ? process.argv.slice(2)
  : readdirSync(WORKS).filter((s) => existsSync(`${WORKS}/${s}/case.cml2.yaml`));

const rows = [];
for (const slug of slugs) {
  const dir = `${WORKS}/${slug}`;
  const C = yaml.load(readFileSync(`${dir}/case.cml2.yaml`, "utf8")).CASE;
  const brief = {
    title: C.meta.title, decade: C.meta.era.decade,
    crime_subtype: C.meta.crime_class.subtype,
    false_assumption: C.false_assumption,
    mechanism: C.hidden_model.mechanism.description,
    delivery_path: (C.hidden_model.mechanism.delivery_path ?? []).map((s) => s.step),
    discriminating_test: C.discriminating_test,
  };
  let out;
  try {
    out = await ask([
      { role: "system", content: "You classify the structural mechanism of a detective story. Output JSON only." },
      { role: "user", content: `Given this case, return JSON:
{"mechanism_family":"one of ${FAMILIES.join("|")}",
 "family_reason":"one clause",
 "false_assumption_pattern":"the WRONG BELIEF as a short proposition in snake_case, 3-7 words",
 "inference_shape":"how the truth is reached, snake_case verb phrase, 2-5 words",
 "principleType":"physical_law|math|cognitive_bias|social_logic",
 "device_title":"a 2-4 word NAME for this trick, in the style of 'The Reset Clock' or 'The Borrowed Name'",
 "requires":["1-3 capability tokens the trick NEEDS, snake_case, e.g. mechanical_clock, physical_disguise, social_deference, sound_recording_playback, period_poison, predictable_heat_source, mirror_or_glass, pen_and_ink, old_building_structure, tide_tables"],
 "forbids":["1-2 LATER capabilities that would DEFEAT it, from: cctv, electronic_timekeeping, voice_authentication, modern_toxicology_screen, automated_fingerprint_search, forensic_document_dating"]}

Choose mechanism_family by what the trick STRUCTURALLY IS, not by a word that happens to appear.
If none fits well, choose the least-wrong and say so in family_reason.

false_assumption_pattern must be a PROPOSITION THE READER BELIEVES AND THAT IS FALSE — something that
could be written on one line and then disproved. It is a similarity key: two different novels turning
on the same wrong belief must produce the same string, so abstract away every name and object.
  GOOD: the_body_died_before_the_room_opened / locked_room_means_no_entry / supernatural_cause /
        a_heard_voice_proves_presence / the_dead_is_who_they_appear / the_actor_acted_knowingly
  BAD:  the_victim_s_death, the_dead_man_is, the_bloodstain_on_the
        (these are the opening words of a sentence, not beliefs — two of them stop mid-phrase on an
         article. A key like that matches nothing and separates nothing.)
inference_shape follows the same rule: debunk_supernatural / reframe_access_at_discovery /
reconstruct_true_time_of_death. Not a noun phrase lifted from the text.

CASE:
${JSON.stringify(brief, null, 1)}` },
    ]);
  } catch (e) { console.log(`${slug}: ${String(e.message).slice(0, 80)}`); continue; }

  // fingerprint: correct the family
  const fpPath = `${dir}/fingerprint.yaml`;
  if (existsSync(fpPath)) {
    const fp = yaml.load(readFileSync(fpPath, "utf8"));
    const was = fp[0].mechanism_family;
    const wasPattern = fp[0].false_assumption_pattern;
    if (FAMILIES.includes(out.mechanism_family)) fp[0].mechanism_family = out.mechanism_family;
    /**
     * A_79 §11.4 — `false_assumption_pattern` and `inference_shape` are classified here too.
     *
     * `corpus-derive.mjs` builds both with `tokenise(sentence).slice(0, 4)` — the first four words of
     * a sentence. That is not an abstraction, and several came out cut off mid-phrase on an article
     * ("the_bloodstain_on_the"). The novelty judge uses these as similarity keys, so the derived
     * fingerprints were WEAKER than the hand-authored ones they replaced: a deliberate paraphrase of
     * The Big Bow Mystery stopped being caught the moment the derived row won.
     */
    const clean = (v) => String(v ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const pattern = clean(out.false_assumption_pattern);
    const shape = clean(out.inference_shape);
    if (pattern.split("_").length >= 3) fp[0].false_assumption_pattern = pattern;
    if (shape.split("_").length >= 2) fp[0].inference_shape = shape;
    writeFileSync(fpPath, yaml.dump(fp, { lineWidth: 100 }), "utf8");
    rows.push({
      slug, was, now: fp[0].mechanism_family,
      changed: was !== fp[0].mechanism_family ? "YES" : "",
      pattern: `${String(wasPattern).slice(0, 22)} -> ${String(fp[0].false_assumption_pattern).slice(0, 34)}`,
    });
  }
  // device: fill the three TODOs
  const dvPath = `${dir}/device.draft.yaml`;
  if (existsSync(dvPath)) {
    const dv = yaml.load(readFileSync(dvPath, "utf8"));
    dv.title = out.device_title ?? dv.title;
    dv.principleType = ["physical_law", "math", "cognitive_bias", "social_logic"].includes(out.principleType) ? out.principleType : "cognitive_bias";
    dv.family = DEVICE_FAMILY[out.mechanism_family] ?? dv.family;
    dv.feasibility.requires = (out.requires ?? []).slice(0, 3);
    dv.feasibility.forbids = (out.forbids ?? []).slice(0, 2);
    writeFileSync(dvPath, yaml.dump(dv, { lineWidth: 100 }), "utf8");
  }
}
console.table(rows);
console.log(`spend: £${spend.toFixed(4)}`);
