#!/usr/bin/env node
/**
 * A_77 Phase 2 — the encode harness.
 *
 *   node scripts/corpus-encode.mjs <slug> [--text <path>] [--budget 5.00]
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────────────────────
 *
 * A_77 §16.11 measured the alternative: encoding a novel conversationally costs ~20x what a scripted
 * pass costs, because every turn re-sends the whole text. This script is the scripted pass. Its job
 * is ENCODE -> VERIFY -> DERIVE over texts already acquired, cleared and provenanced.
 *
 * ── THE SPEND SPLIT, AND WHY IT IS NOT UNIFORM ───────────────────────────────────────────────────
 *
 * The three passes have different error economics, which is the whole reason for the model choice:
 *
 *   pass 1  structure map        errors caught by: nothing needs to (it is scaffolding)  -> cheapest
 *   pass 3  clue sweep + spans   errors caught by: String.includes, free, deterministic  -> cheapest
 *   pass 2  case encode          errors caught by: NOTHING                               -> spend here
 *
 * `validateCml` catches field names and grounding. It does NOT catch "the mechanism is a gramophone"
 * (A_77 §16.11) — a plausible-but-wrong case clears every automated gate this project owns. That is
 * exactly what the legacy corpus is. So the money goes on pass 2 and nowhere else.
 *
 * ── SCHEMA CONFORMANCE BY CONSTRUCTION ───────────────────────────────────────────────────────────
 *
 * The model emits JSON against a flat contract; this script builds the CML 2.0 YAML from it. A_77
 * §16.3 found that every first-attempt gate failure was a FIELD NAME, so field names are not the
 * model's problem here — they are the script's, and the script cannot get them wrong twice.
 *
 * Budget: cumulative spend is tracked in library/.encode-ledger.json and the run ABORTS before any
 * call that would cross --budget. Stated in GBP using the price table in
 * packages/llm-client/src/cost-tracker.ts.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import yaml from "js-yaml";

// ── config ───────────────────────────────────────────────────────────────────────────────────────
const ROOT = "C:/CML";
const LEDGER = `${ROOT}/library/.encode-ledger.json`;
const env = Object.fromEntries(
  readFileSync(`${ROOT}/.env.local`, "utf8").split(/\r?\n/)
    .filter((l) => /^[A-Z][A-Z0-9_]*=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).split("#")[0].trim()]),
);
const ENDPOINT = env.AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "");
const KEY = env.AZURE_OPENAI_API_KEY;
const VER = env.AZURE_OPENAI_API_VERSION || "2024-10-21";

/**
 * MEASURED 2026-08-31 by scripts/corpus-capacity.mjs — the binding constraint is QUOTA, not price:
 *
 *   gpt-4o-mini    100,000 TPM
 *   gpt-4.1-mini   250,000 TPM   <- the only deployment that can hold a whole novel
 *   gpt-4.1         50,000 TPM   <- SMALLER THAN THE SHORTEST NOVEL (57k). Unusable here.
 *
 * A_78's cost analysis recommended gpt-4.1 for the encode pass on error-economics grounds. That
 * recommendation is correct and unrunnable on this resource: a prompt larger than the per-minute
 * allowance can never succeed, and no amount of backoff changes it (eight consecutive 429s at a
 * constant 32s Retry-After is what that looks like). Until the gpt-4.1 quota is raised, the encode
 * pass runs on gpt-4.1-mini and the CONSENSUS check below is the compensation for the weaker model.
 */
const MODEL = { map: "gpt-4o-mini", encode: "gpt-4.1-mini", sweep: "gpt-4o-mini" }; // `map` may be promoted below
const TPM = { "gpt-4o-mini": 100000, "gpt-4.1-mini": 250000, "gpt-4.1": 50000 };
const PRICE = { // GBP per million tokens
  "gpt-4o-mini": { in: 0.13035, out: 0.5214 },
  "gpt-4.1-mini": { in: 0.316, out: 1.264 },
  "gpt-4.1": { in: 1.58, out: 6.32 },
};

const args = process.argv.slice(2);
const slug = args[0];
const BUDGET = Number((args.find((a) => a.startsWith("--budget=")) ?? "--budget=5").split("=")[1]);
if (!slug) { console.error("usage: corpus-encode.mjs <slug> [--budget=5]"); process.exit(2); }

const textPath = (args.find((a) => a.startsWith("--text=")) ?? "").split("=")[1]
  || `C:/Users/andyl/AppData/Local/Temp/claude/C--CML/37bf12e3-44c1-4bb6-ae7f-407b46016ade/scratchpad/src/${slug}.txt`;

// ── budget ledger ────────────────────────────────────────────────────────────────────────────────
const loadLedger = () => (existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, "utf8")) : { totalGbp: 0, runs: [] });
const ledger = loadLedger();
let runCost = 0;
const spend = (model, usage) => {
  const p = PRICE[model];
  const c = (usage.prompt_tokens * p.in + usage.completion_tokens * p.out) / 1e6;
  runCost += c;
  return c;
};
const wouldExceed = (est) => ledger.totalGbp + runCost + est > BUDGET;

// ── one call ─────────────────────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Azure enforces a per-minute token quota per deployment, and a 60k-token prompt can exhaust a
 * minute's budget in one call. A 429 here is a QUEUEING signal, not an error: back off and retry.
 * Without this the harness fails on the first long novel, which is every novel.
 */
async function chat(model, messages, { json = false, maxTokens = 4000 } = {}) {
  const url = `${ENDPOINT}/openai/deployments/${model}/chat/completions?api-version=${VER}`;
  const body = { messages, max_tokens: maxTokens, temperature: 0.2 };
  if (json) body.response_format = { type: "json_object" };
  let res, wait = 20000;
  for (let attempt = 1; attempt <= 8; attempt++) {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": KEY },
      body: JSON.stringify(body),
    });
    if (res.status !== 429) break;
    const hdr = Number(res.headers.get("retry-after")) * 1000;
    const delay = Number.isFinite(hdr) && hdr > 0 ? hdr + 2000 : wait;
    process.stderr.write(`    [${model}] 429 rate limit — waiting ${Math.round(delay / 1000)}s (attempt ${attempt}/8)
`);
    await sleep(delay);
    wait = Math.min(wait * 1.5, 120000);
  }
  if (!res.ok) throw new Error(`${model} HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  const cost = spend(model, j.usage);
  process.stderr.write(`    [${model}] in=${j.usage.prompt_tokens} out=${j.usage.completion_tokens} £${cost.toFixed(4)}\n`);
  return j.choices[0].message.content;
}

// ── the JSON contract the encoder fills ──────────────────────────────────────────────────────────
const CONTRACT = `Return ONE JSON object with exactly these keys:
{
 "decade":"e.g. 1880s", "realism_constraints":[3 strings about what the period could and could not do],
 "location":"where the case happens", "institution":"the body investigating or the setting's institution",
 "crime_category":"murder|theft|blackmail|disappearance|fraud", "crime_subtype":"one phrase naming the trick",
 "cast":[{"name","age_range","role_archetype","role":"detective|victim|culprit|suspect|witness|bystander",
   "gender":"male|female|non-binary","culpability":"guilty|innocent|unknown",
   "culprit_eligibility":"eligible|ineligible|locked",
   "public_persona","private_secret","motive_seed","motive_strength":"none|weak|moderate|strong",
   "alibi_window","access_plausibility","stakes","moral_complexity",
   "relationships":[],"opportunity_channels":[],"behavioral_tells":[],"evidence_sensitivity":[]}],
 "culprits":["exact name(s) from cast"],
 "surface_summary":"what the case looks like before the solution, 2-3 sentences",
 "accepted_facts":[4 things everyone believes], "inferred_conclusions":[3 wrong conclusions drawn from them],
 "mechanism_description":"how the crime ACTUALLY worked, 2-3 sentences",
 "delivery_path":[5-7 ordered steps of the mechanism],
 "outcome_result":"one sentence",
 "false_assumption":{"statement":"the reader's load-bearing wrong belief, one sentence",
   "type":"temporal|spatial|identity|behavioral|authority",
   "why_it_seems_reasonable":"2 sentences","what_it_hides":"2 sentences"},
 "false_solution":{"accused_suspect","supporting_points":[3-4],"the_one_flaw","refuted_in_chapter":number},
 "red_herrings":[{"id":"rh_snake_case","description","points_at_suspect","innocent_explanation","resolved_in_chapter":number}],
 "closed_circle":{"suspects":[names],"rationale"},
 "constraint_space":{"time_anchors":[],"time_windows":[],"access_actors":[],"access_objects":[],
   "trust_channels":[],"authority_sources":[]},
 "inference_path":[{"observation","correction","effect","required_evidence":[2 CONCRETE items: a named
   object, a witness statement, a timestamp, a physical trace or an access record]}],
 "discriminating_test":{"method":"reenactment|trap|constraint_proof|administrative_pressure",
   "design":"2-3 sentences","knowledge_revealed":"1-2 sentences","pass_condition":"1-2 sentences"},
 "fair_play_explanation":"3 sentences on why the reader could have solved it",
 "anchors":[{"claim":"what this proves","anchor":"4 to 8 CONSECUTIVE words copied from the text"}]
}
HARD RULES:
- THE BOOK CONTAINS A WRONG ANSWER ON PURPOSE. A detective novel states, at length and persuasively,
  at least one explanation that is later refuted — often argued by a clever character, sometimes
  published in-world as the official theory. ENCODE THE EXPLANATION THAT SURVIVES TO THE LAST
  CHAPTER, not the most fully-argued one. Before you write mechanism_description, find the passage
  where the truth is finally admitted (a confession, an unmasking, the detective's closing account)
  and encode THAT. If two accounts conflict, the later one wins.
  A_79 §11.3 — measured: our first Big Bow Mystery encode described the murderer entering the locked
  room beforehand with a key and faking the bolt. That is the book's REFUTED theory of how an innocent
  man did it. Zangwill's actual trick is that the killer cuts the sleeping man's throat AS HE BREAKS
  THE DOOR DOWN, in front of a witness, and only then announces a death that has not yet happened.
  The wrong version was internally coherent, textually grounded and exactly backwards.
- false_solution is where the refuted explanation belongs. If the book argues a theory and then
  demolishes it, that theory is the false_solution and the demolition is evidence — never the
  mechanism.
- inference_path must have 6 or 7 steps. red_herrings must have exactly 2. cast must have 5-7 people.
- Provide 12-20 anchors. An anchor is a SHORT run of 4 to 8 consecutive words COPIED FROM THE TEXT.
  You are POINTING at a sentence, not reproducing it — the harness will extract the full sentence
  itself. Choose the most distinctive short run you can (an unusual noun plus its neighbours beats a
  common phrase). Do NOT join words from different places, do NOT tidy punctuation, do NOT continue
  past a quotation mark. If you are not certain a run appears exactly, choose a shorter one.
- EVERY anchor must be an OBJECT with both keys: {"claim": "...", "anchor": "..."}. A bare string is
  not acceptable. The claim is what the quotation proves, in your own words; the anchor is the copied
  run. MEASURED: an encode that returned bare strings disabled the harness's solution-coverage check
  entirely, and it reported "0/0" — which reads like a pass and means nothing was checked.
- AN ANCHOR IS A QUOTATION, NOT A DESCRIPTION. This is the single most common failure and it is
  checked mechanically: the harness runs an exact substring search, so a true statement written in
  your own words scores zero. MEASURED — one encode of The Hound of the Baskervilles located 3 of 20
  anchors because it returned summaries: "a savage hound, painted with phosphorus" and "the escaped
  convict Selden" are both perfectly true and neither appears in the book.
  WRONG: "Jack Stapleton, the naturalist and antagonist"   (accurate; nowhere in the text)
  WRONG: "Grodman reveals his confession"                  (accurate; nowhere in the text)
  RIGHT: "lying on his back, with his throat cut"          (copied)
  Test each anchor before you emit it: could you point to it, word for word, in a single unbroken
  run of the text you were given? If not, replace it with one you can.
- Cover with anchors: the victim, the cause of death, the culprit, the mechanism, the false
  assumption, each red herring, and the discriminating test.
- required_evidence items must be 8 words or more and name a CONCRETE thing: an object, a document,
  a witness statement, a timestamp, a measurement or an access record. Never a bare noun.
- culprit_eligibility must be exactly one of: eligible, ineligible, locked.
- ALIASES GO IN THE NAME. If a character is known by a second name, an alias or a professional
  identity that the case turns on, write it as "Real Name (Alias)" - for example
  "John Douglas (Birdy Edwards)". The grounding validator ignores words drawn from cast names
  and nothing else, so an alias left out of the cast list will be rejected as unexplained jargon.
- ROLES ARE LOAD-BEARING. A role of "victim" means THE PERSON WHO IS KILLED OR ROBBED - not the
  client, not the person who hires the detective, not the one in danger. If a client brings the case
  but someone else dies, the DEAD person is the victim and the client is a suspect or witness.
  Exactly one cast member has role "victim" and exactly one has role "detective". Every name in
  culprits must be a cast member whose role is "culprit" and whose culpability is "guilty".
- role_archetype must NOT contain the word "detective" unless that person IS the detective.
- Do not invent names. Every name must appear in the supplied text.
- ORDER OF WORK: write inference_path FIRST and completely, then write mechanism_description and
  discriminating_test using ONLY nouns and verbs that already appear in it. Writing the test
  first and the path afterwards is the single most common cause of rejection.
- GROUNDING (a validator enforces this): every distinctive noun or verb you use in
  discriminating_test.design and .knowledge_revealed, and in mechanism_description, MUST also appear
  in at least one inference_path observation or required_evidence item. Write the inference path
  FIRST, then write the discriminating test using only vocabulary already present in it. A test that
  introduces a new proper noun or a new object will be rejected.
- discriminating_test.pass_condition must be a concrete verifiable fact, contradiction or
  elimination. It must NOT rely on someone confessing, reacting, breaking down or looking guilty.
- required_evidence items must be observable BEFORE the solution is known. A confession, a
  handwriting analysis of a confession, an arrest or a breakdown is NOT evidence the reader could
  weigh in advance — name the physical object, document, timing fact or access record instead.
- false_solution.accused_suspect must be an INNOCENT person. Naming the real culprit is not
  misdirection and will be rejected. At most 2 names may appear in culprits.`;

// ── build CML 2.0 from the JSON ──────────────────────────────────────────────────────────────────
const { buildCml } = await import("file:///C:/CML/scripts/lib-build-cml.mjs");

// ── run ──────────────────────────────────────────────────────────────────────────────────────────
process.on("exit", () => {
  // A crash mid-run has still cost money. Bank it, or the next run's budget guard is lying.
  if (runCost > 0 && !ledger.runs.some((r) => r.slug === slug)) {
    const l = loadLedger();
    l.totalGbp += runCost;
    l.runs.push({ slug, costGbp: Number(runCost.toFixed(4)), valid: false, spans: "aborted" });
    writeFileSync(LEDGER, JSON.stringify(l, null, 1), "utf8");
  }
});

const dir = `${ROOT}/library/works/${slug}`;
mkdirSync(dir, { recursive: true });
const prov = yaml.load(readFileSync(`${dir}/provenance.yaml`, "utf8"));
const text = readFileSync(textPath, "utf8");
const approxTok = Math.round(text.split(/\s+/).length * 1.33);

console.log(`\n=== ${slug} ===`);
console.log(` text: ${text.split(/\s+/).length.toLocaleString()} words (~${approxTok.toLocaleString()} tokens)`);
console.log(` ledger so far: £${ledger.totalGbp.toFixed(4)}  budget: £${BUDGET.toFixed(2)}`);

// Fail fast on capacity. A book bigger than the deployment's TPM cannot be encoded in one call, and
// discovering that through eight 32s retries wastes five minutes to learn something a header knows.
// The map pass is scaffolding, so it runs on the cheapest model that can HOLD the book. Two of the
// nine exceed gpt-4o-mini's 100k; for those the map costs a little more rather than not running.
if (approxTok > TPM[MODEL.map] - 12000) {
  process.stderr.write(`  (map pass promoted to ${MODEL.encode}: ${approxTok.toLocaleString()} tokens exceeds ${MODEL.map}'s ceiling)
`);
  MODEL.map = MODEL.encode;
}

for (const [pass, m] of [["map", MODEL.map], ["encode", MODEL.encode]]) {
  const headroom = TPM[m] - 12000; // leave room for the completion
  if (approxTok > headroom) {
    console.error(`
CAPACITY STOP: ${slug} is ~${approxTok.toLocaleString()} tokens; the ${m} deployment used for the ${pass} pass allows ${TPM[m].toLocaleString()} tokens/min.`);
    console.error(`  This book cannot be encoded in a single call on this resource. Raise the quota, or split this title out.`);
    process.exit(6);
  }
}

const estimate = (approxTok * PRICE[MODEL.map].in + approxTok * PRICE[MODEL.encode].in + 12000 * PRICE[MODEL.encode].out) / 1e6;
if (wouldExceed(estimate)) {
  console.error(`\nBUDGET STOP: this book is estimated at £${estimate.toFixed(3)}; ledger £${ledger.totalGbp.toFixed(4)} + estimate exceeds £${BUDGET.toFixed(2)}.`);
  process.exit(3);
}

// pass 1 — structure map (cheapest)
process.stderr.write("  pass 1 · structure map\n");
const map = await chat(MODEL.map, [
  { role: "system", content: "You summarise novels for a downstream extraction step. Be terse and factual." },
  { role: "user", content: `List, for this novel: (a) every named character with one clause on who they are; (b) the chapter in which the crime is discovered; (c) the chapter in which the solution is explained; (d) a two-sentence statement of the solution. No preamble.\n\n${text}` },
], { maxTokens: 1500 });

// pass 2 — case encode (the one that gets the money)
process.stderr.write("  pass 2 · case encode\n");
let raw = await chat(MODEL.encode, [
  { role: "system", content: "You are a structural analyst of detective fiction. You read the supplied text and encode the case. You never invent a name, a quotation or a mechanism. Output JSON only." },
  { role: "user", content: `${CONTRACT}\n\nSTRUCTURE MAP (from a prior pass, may be incomplete):\n${map}\n\nFULL TEXT:\n${text}` },
], { json: true, maxTokens: 12000 });

let data;
try { data = JSON.parse(raw); }
catch { writeFileSync(`${dir}/encode-raw.json`, raw, "utf8"); console.error("  encoder did not return parseable JSON (saved to encode-raw.json)"); process.exit(4); }
// Persist BEFORE gating. The first batch spent £0.16 on four encodes and discarded every one of them
// because the gate failed and only the report was written. Paid output is never thrown away again.
writeFileSync(`${dir}/encode-raw.json`, JSON.stringify(data, null, 1), "utf8");

/**
 * ── PASS 2b · ADJUDICATION — the workaround for a 50,000 TPM ceiling ────────────────────────────
 *
 * gpt-4.1 cannot see a novel: the shortest is 57k tokens and the deployment's whole minute is 50k,
 * so a single call can never fit. But the strong model does not NEED the novel. Split by ROLE
 * instead of by text:
 *
 *   gpt-4.1-mini (250k TPM)  reads the full novel -> the encode, WITH verbatim spans.
 *                            This is retrieval, and every span is checked for free by
 *                            String.includes. A weak model here is SAFE because it is verified.
 *
 *   gpt-4.1      (50k TPM)   reads only the encode JSON (~10k tokens) -> adjudicates the JUDGEMENT:
 *                            axis, false assumption, mechanism, discriminating test. This is the
 *                            pass A_78 measured as being checked by NOTHING, so it gets the strong
 *                            model. ~14k tokens in — comfortably inside the ceiling.
 *
 * This is not a concession to the quota. It is the architecture the error economics already argued
 * for: spend where nothing checks, economise where verification is free. The quota merely forced it.
 *
 * Skipped with --no-adjudicate.
 */
if (!args.includes("--no-adjudicate")) {
  const judgement = {
    culprits: data.culprits, crime_subtype: data.crime_subtype,
    cast_roles: (data.cast ?? []).map((c) => ({ name: c.name, role: c.role, culpability: c.culpability })),
    surface_summary: data.surface_summary,
    accepted_facts: data.accepted_facts, inferred_conclusions: data.inferred_conclusions,
    mechanism_description: data.mechanism_description, delivery_path: data.delivery_path,
    false_assumption: data.false_assumption,
    inference_path: (data.inference_path ?? []).map((s) => ({ observation: s.observation, correction: s.correction, effect: s.effect })),
    discriminating_test: data.discriminating_test,
  };
  const estAdj = (14000 * PRICE["gpt-4.1"].in + 3000 * PRICE["gpt-4.1"].out) / 1e6;
  if (wouldExceed(estAdj)) {
    process.stderr.write("  pass 2b · SKIPPED (budget)\n");
  } else {
    process.stderr.write("  pass 2b · adjudicate (gpt-4.1, judgement only)\n");
    try {
      const adj = await chat("gpt-4.1", [
        { role: "system", content: "You are a senior structural analyst of detective fiction. A junior pass has encoded a case from the full text. You see only its encoding, not the novel. Correct the JUDGEMENT — is the axis right, is the false assumption the load-bearing one, does the mechanism describe the actual trick, does the discriminating test discriminate? Output JSON only." },
        { role: "user", content: `Return JSON with keys: false_assumption {statement,type,why_it_seems_reasonable,what_it_hides}, mechanism_description, discriminating_test {method,design,knowledge_revealed,pass_condition}, and "changed":[list of field names you altered], and "confidence":"high|medium|low".

RULES
- \`type\` must be one of temporal|spatial|identity|behavioral|authority and must name what the READER misjudges: temporal=WHEN, spatial=WHERE, identity=WHO, behavioral=HOW SOMEONE WOULD ACT, authority=WHO MAY BE BELIEVED.
- The false assumption is the belief that, once dropped, collapses the mystery. Not a plot summary.
- GROUNDING: every distinctive noun in discriminating_test must already appear in the inference_path below. Introduce nothing new.
- pass_condition must be a concrete verifiable fact, never a confession or a reaction.
- CHECK THE ROLES, CONSERVATIVELY. Return "victim_correction" ONLY when the cast member marked
  "victim" is NOT KILLED OR ROBBED AT ALL - a client who merely hires the detective, a person in
  danger who survives, a witness. If they ARE a genuine victim of the crime, omit the key even when
  another character also dies: where a case has more than one death, the victim is the PRIMARY one,
  the death the investigation is about, not a later killing done to cover it up. Changing a real
  victim for a secondary one makes the encoding worse, not better.
  Format when correcting: {"should_be":"<name>","currently":"<name>","why":"<one line>"}.
- If the junior pass was right, return its values unchanged and set "changed":[].

ENCODING TO ADJUDICATE:
${JSON.stringify(judgement, null, 1)}` },
      ], { json: true, maxTokens: 3000 });
      const a = JSON.parse(adj);
      if (a.victim_correction?.should_be) {
        const vc = a.victim_correction;
        const cast = data.cast ?? [];
        const target = cast.find((c) => c.name === vc.should_be);
        const current = cast.find((c) => c.role === "victim");
        if (target && current && target !== current) {
          current.role = "suspect";
          current.culprit_eligibility = "eligible";
          target.role = "victim";
          target.culprit_eligibility = "ineligible";
          target.culpability = "innocent";
          process.stderr.write(`    VICTIM CORRECTED: ${vc.currently} -> ${vc.should_be} (${vc.why})\n`);
        }
      }
      if (a.false_assumption?.type) data.false_assumption = a.false_assumption;
      if (a.mechanism_description) data.mechanism_description = a.mechanism_description;
      if (a.discriminating_test?.method) data.discriminating_test = a.discriminating_test;
      writeFileSync(`${dir}/adjudication.json`, JSON.stringify(a, null, 1), "utf8");
      process.stderr.write(`    adjudicator changed: [${(a.changed ?? []).join(", ") || "nothing"}]  confidence=${a.confidence ?? "?"}
`);
    } catch (e) {
      process.stderr.write(`    adjudication skipped: ${String(e.message).slice(0, 120)}
`);
    }
  }
}

// build + gate
const cml = buildCml(data, { title: prov.title, author: prov.author, license: `Public domain (first published ${prov.first_publication_year}; author died ${prov.author_death_year}). Project Gutenberg ebook ${prov.source.ebook_id}.` });
const { validateCml } = await import(`file://${ROOT}/packages/cml/dist/validator.js`);
let v = validateCml(cml);
/**
 * TARGETED REPAIR. The validator does not merely say "not grounded" — it names the exact terms that
 * are missing ("add these mechanism/test terms to earlier observations or required_evidence: birdy,
 * edward, pinkerton"). The first version of this pass re-sent the whole contract and asked for a
 * fresh attempt, which is asking the model to guess at a problem the error message has already
 * solved. Quote the terms back instead, and say where to put them.
 */
const groundingTerms = (errs) => [...new Set(errs
  .map((e) => /required_evidence:\s*(.+)$/.exec(e)?.[1] ?? "")
  .flatMap((t) => t.split(",").map((x) => x.trim()).filter(Boolean)))];

for (let attempt = 1; attempt <= 3 && !v.valid; attempt++) {
  const terms = groundingTerms(v.errors);
  const hint = terms.length
    ? `\n\nThe grounding failures name these exact terms as missing: ${terms.join(", ")}.\nAdd each of them, verbatim, into at least one inference_path observation or required_evidence item, so that the discriminating test and the mechanism introduce no vocabulary the reader has not already met. Do not change what the case MEANS — only make the earlier steps mention what the later ones use.`
    : "";
  process.stderr.write(`  gate attempt ${attempt}: FAIL (${v.errors.length}) — repairing${terms.length ? " [" + terms.length + " terms]" : ""}\n`);
  const repairModel = JSON.stringify(data).length / 3.5 < 30000 ? "gpt-4.1" : MODEL.encode;
  const fix = await chat(repairModel, [
    { role: "system", content: "You repair a JSON case encoding to satisfy a validator. Change as little as possible. Output the FULL corrected JSON only." },
    { role: "user", content: `${CONTRACT}\n\nThe JSON below produced these validator errors:\n${v.errors.join("\n")}${hint}\n\nFix them and return the whole object.\n\nJSON:\n${JSON.stringify(data)}` },
  ], { json: true, maxTokens: 12000 });
  try { data = JSON.parse(fix); } catch { break; }
  v = validateCml(buildCml(data, { title: prov.title, author: prov.author, license: cml.CASE.meta.license }));
}
const finalCml = buildCml(data, { title: prov.title, author: prov.author, license: cml.CASE.meta.license });
v = validateCml(finalCml);

// VERIFY — deterministic, free
const N = (s) => String(s).replace(/\s+/g, " ").trim();
const src = N(text);
/**
 * The encoder may return `spans` as plain strings OR as {claim, span} objects. The first version of
 * this line did `{...s}`, which spreads a STRING into an object of character-indexed keys and leaves
 * `s.span` undefined — reporting 0/20 for four books whose spans were in fact verbatim. The failure
 * looked like a model failure and was a harness failure: A_77's evidence standard, in one line.
 */
/**
 * ── ANCHOR-AND-EXTRACT ──────────────────────────────────────────────────────────────────────────
 *
 * MEASURED on the first clean run: asking gpt-4.1-mini to REPRODUCE verbatim spans from a 55k-token
 * context yielded 3/20. Diagnosis showed three failure kinds, none of them fabrication:
 *   - paraphrase                ("was found dead in his room under circumstances which point to...")
 *   - stitching two fragments   (continuing a quotation past its closing quote mark)
 *   - punctuation drift         (the source has ",-clear" and the model wrote ", clear")
 * Long prefixes matched in every case, so the model was reading the text and failing to transcribe it.
 *
 * So stop asking it to transcribe. NEVER ASK A MODEL TO REPRODUCE TEXT YOU ALREADY HAVE — ask it to
 * POINT. It returns a short anchor; the harness finds the anchor and extracts the surrounding
 * sentence itself. The span is then verbatim BY CONSTRUCTION, and verification still does its real
 * job: an anchor that is not in the book cannot be found, so invention is still caught. What is no
 * longer caught is transcription drift, which was never the thing we were guarding against.
 */
const NORM = (t) => t.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-");
const srcN = NORM(src);
const spans = (data.anchors ?? data.spans ?? []).map((a) => {
  const anchor = typeof a === "string" ? a : (a.anchor ?? a.span ?? "");
  const claim = typeof a === "string" ? "" : (a.claim ?? "");
  const needle = NORM(N(anchor));
  const at = needle.length > 0 ? srcN.indexOf(needle) : -1;
  if (at < 0) return { claim, anchor, span: "", ok: false };
  // expand to sentence bounds around the anchor
  let lo = at, hi = at + needle.length;
  while (lo > 0 && !/[.!?"]/.test(srcN[lo - 1])) lo -= 1;
  while (hi < srcN.length && !/[.!?]/.test(srcN[hi])) hi += 1;
  return { claim, anchor, span: src.slice(lo, Math.min(hi + 1, src.length)).trim(), ok: true };
});
const passed = spans.filter((s) => s.ok).length;

console.log(`\n validateCml : ${v.valid ? "PASS" : "FAIL (" + v.errors.length + ")"}`);
if (!v.valid) v.errors.slice(0, 6).forEach((e) => console.log("   • " + e));
const victim = (data.cast ?? []).find((c) => c.role === "victim");
if (victim) {
  const surname = String(victim.name).split(/\s+/).pop();
  const mech = `${data.mechanism_description ?? ""} ${data.surface_summary ?? ""} ${data.crime_subtype ?? ""}`;
  if (surname.length > 2 && !new RegExp(surname, "i").test(mech)) {
    console.log(` WARNING     : victim "${victim.name}" is never named in the mechanism or summary — check the role assignment`);
  }
}
console.log(` anchors     : ${passed}/${spans.length} located (spans extracted verbatim by the harness)`);
spans.filter((s) => !s.ok).slice(0, 5).forEach((s) => console.log(`   ✗ not in text: ${String(s.anchor).slice(0, 80)}`));
console.log(` cost        : £${runCost.toFixed(4)}`);

if (v.valid) writeFileSync(`${dir}/case.cml2.yaml`, yaml.dump(finalCml, { lineWidth: 100 }), "utf8");
/**
 * A_79 §11.4 — a REJECTED attempt must not overwrite the accepted case's evidence.
 *
 * `case.cml2.yaml` is written only when the case validates (the line above), but the report used to
 * be written either way. So a failed re-encode left `encode-report.json` describing a case that was
 * thrown away, while the case on disk was the older, accepted one — and the evidence gate in
 * `corpus-sync-fingerprints.mjs` would then judge one file by another file's anchors. MEASURED: that
 * is exactly what happened to `the_leavenworth_case` on 2026-08-31.
 *
 * A rejected attempt is still worth keeping — it is what `corpus-repair.mjs` works from — so it goes
 * to its own name rather than being discarded.
 */
const report = { slug, valid: v.valid, errors: v.errors ?? [], spans, costGbp: runCost, models: MODEL, case_written: v.valid };
writeFileSync(`${dir}/encode-report${v.valid ? "" : ".rejected"}.json`, JSON.stringify(report, null, 1), "utf8");

ledger.totalGbp += runCost;
ledger.runs.push({ slug, costGbp: Number(runCost.toFixed(4)), valid: v.valid, spans: `${passed}/${spans.length}` });
writeFileSync(LEDGER, JSON.stringify(ledger, null, 1), "utf8");
process.exitCode = v.valid ? 0 : 5;
console.log(` ledger      : £${ledger.totalGbp.toFixed(4)} of £${BUDGET.toFixed(2)}`);
