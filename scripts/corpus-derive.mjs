#!/usr/bin/env node
/**
 * A_77 Phase 2 / A_78 §9 — the derive step.
 *
 *   node scripts/corpus-derive.mjs [slug ...]        (default: every work with a case.cml2.yaml)
 *
 * Turns a validator-clean `case.cml2.yaml` into the two derived artifacts:
 *
 *   fingerprint.yaml    — the 8 abstract fields the novelty judge compares (A_77 §10.5). DERIVED,
 *                         so the 11-of-14 drift in §4.3 cannot recur: the file is regenerated from
 *                         its source rather than hand-authored beside it.
 *   device.draft.yaml   — the device-library pattern (A_78 §9). 10 of its 11 required fields come
 *                         straight out of the case; the three that do not are left as explicit TODOs
 *                         rather than guessed, because A_78 §9.3 measured what guessing them costs.
 *
 * Deterministic. No LLM, no network, £0.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import yaml from "js-yaml";
import { Ajv } from "ajv";

const ROOT = "C:/CML";
const WORKS = `${ROOT}/library/works`;
const deviceSchema = new Ajv({ allErrors: true, strict: false })
  .compile(yaml.load(readFileSync(`${ROOT}/schema/device_library.schema.yaml`, "utf8")));
const { validateFingerprint } = await import(`file://${ROOT}/packages/novelty/dist/loader.js`);

/** 14-value corpus family -> 5-value device family. A_78 §9 widened this: the schema permits
 *  `behavioral`, so three of the five families FAMILY_MAP left as null now resolve. */
const DEVICE_FAMILY = {
  locked_room_key: "spatial_routing", locked_room_timing: "timing", alibi_fabrication: "timing",
  poison_delayed: "timing", poison_substitution: "timing", recorded_presence: "timing",
  impersonation: "identity", substituted_body: "identity",
  secret_will_inheritance: "authority", information_leak: "authority",
  staged_scene: "spatial_routing", hidden_accomplice: "behavioral",
  disguised_natural_agent: "behavioral", unconscious_act: "behavioral",
};

/** Which mechanism family a case belongs to, inferred from its own mechanism text. The keys are the
 *  @cml/novelty vocabulary; order matters, first match wins. */
const FAMILY_RULES = [
  [/recording|gramophone|phonograph|wax cylinder/i, "recorded_presence"],
  [/substitut\w* (?:body|corpse)|disfigur\w+ (?:body|corpse)|body is not/i, "substituted_body"],
  [/impersonat|disguis|assumed identity|passing as|false name/i, "impersonation"],
  [/will|inherit|legac|heir/i, "secret_will_inheritance"],
  [/leak|confidential|informant|conduit/i, "information_leak"],
  [/slow|delayed|onset|hours after|days after/i, "poison_delayed"],
  [/poison|dose|toxic|arsenic|strychnine|cyanide/i, "poison_substitution"],
  [/duplicate key|second key|spare key|re-?lock/i, "locked_room_key"],
  [/alibi|clock|timetable|candle|delayed[- ]action|timer/i, "alibi_fabrication"],
  [/accomplice|confederate|overlooked (?:agent|servant)/i, "hidden_accomplice"],
  [/staged|arranged the scene|made it look|simulat/i, "staged_scene"],
  [/hound|beast|supernatural|apparition|phosphor/i, "disguised_natural_agent"],
  [/asleep|unaware|unconscious|opium|laudanum|somnambul/i, "unconscious_act"],
  [/locked room|sealed|bolted from within/i, "locked_room_timing"],
];
const TEST_SHAPE = {
  reenactment: "reconstruction", trap: "behavioral_tell",
  constraint_proof: "timetable_contradiction", administrative_pressure: "behavioral_tell",
};

const tokenise = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").split("_").slice(0, 4).join("_");

const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(WORKS).filter((s) => existsSync(`${WORKS}/${s}/case.cml2.yaml`));

const rows = [];
for (const slug of slugs) {
  const dir = `${WORKS}/${slug}`;
  const C = yaml.load(readFileSync(`${dir}/case.cml2.yaml`, "utf8")).CASE;
  const prov = existsSync(`${dir}/provenance.yaml`) ? yaml.load(readFileSync(`${dir}/provenance.yaml`, "utf8")) : {};

  const mechText = `${C.hidden_model?.mechanism?.description ?? ""} ${C.meta?.crime_class?.subtype ?? ""} ${C.false_assumption?.statement ?? ""}`;
  const family = (FAMILY_RULES.find(([re]) => re.test(mechText)) ?? [null, "staged_scene"])[1];

  // ── fingerprint ────────────────────────────────────────────────────────────
  const fp = {
    id: slug,
    corpus: "seed",
    axis: C.false_assumption.type,
    mechanism_family: family,
    false_assumption_pattern: tokenise(C.false_assumption.statement).slice(0, 60),
    discriminating_test_shape: TEST_SHAPE[C.discriminating_test?.method] ?? "physical_trace",
    inference_shape: tokenise(C.inference_path?.steps?.at(-1)?.effect ?? "resolve_the_case"),
    premise: String(C.surface_model?.narrative?.summary ?? "").replace(/\s+/g, " ").trim().slice(0, 200),
    source: `library/works/${slug}/case.cml2.yaml`,
  };
  const fpOk = validateFingerprint(fp);
  if (fpOk) writeFileSync(`${dir}/fingerprint.yaml`, yaml.dump([fp], { lineWidth: 100 }), "utf8");

  // ── device pattern (the "wiki") ────────────────────────────────────────────
  // De-specification is ROLE-AWARE (A_78 §9.4): a regex that replaces every name with one placeholder
  // collapses the victim and the culprit into the same word and destroys the distinction that IS the
  // mystery. Each name is replaced by its own role instead.
  const roleWord = { victim: "the victim", culprit: "the culprit", detective: "the investigator",
                     suspect: "a suspect", witness: "a witness", bystander: "a bystander" };
  const subs = [];
  for (const c of C.cast ?? []) {
    const word = roleWord[c.role] ?? "a person";
    for (const part of String(c.name).replace(/[^A-Za-z ]/g, " ").split(/\s+/)) {
      if (/^[A-Z]/.test(part) && part.length > 2 && !["The","Mrs","Mr","Sir","Miss","Dr","Lady","Lord"].includes(part)) {
        subs.push([part, word]);
      }
    }
  }
  subs.sort((a, b) => b[0].length - a[0].length);
  const WB = String.fromCharCode(92) + "b";
  const strip = (s) => {
    let t = String(s ?? "").replace(/\s+/g, " ").trim();
    for (const [n, w] of subs) t = t.replace(new RegExp(WB + n + "(\u2019s|'s)?" + WB, "g"), w);
    return t.replace(/\b(the victim|the culprit|the investigator)( \1)+/g, "$1").trim();
  };

  const device = {
    pattern_id: slug,
    title: `TODO — name this device`,
    family: DEVICE_FAMILY[family],
    axes: [C.false_assumption.type],
    principle: strip(C.false_assumption.what_it_hides),
    principleType: "TODO",
    surface_illusion_template: strip((C.surface_model?.inferred_conclusions ?? []).join("; ")),
    underlying_reality_template: strip(C.hidden_model?.mechanism?.description),
    feasibility: {
      // A_78 §9.3 trap 1: `eras` is a FEASIBILITY RANGE, not the publication decade. A pattern that
      // declares only its own decade retrieves ZERO times for a story set anywhere else.
      eras: [1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950],
      requires: [],   // TODO — trap 2: empty means "feasible in every era, including 2020"
      forbids: [],    // TODO — trap 3: an unknown token here fails OPEN
    },
    clue_archetypes: (C.inference_path?.steps ?? [])
      .flatMap((s) => (s.required_evidence ?? []).map(tokenise)).filter(Boolean).slice(0, 6),
    sources: [`${C.meta.author}, ${C.meta.title} — library/works/${slug}/case.cml2.yaml`],
  };
  const devOk = deviceSchema(device);
  writeFileSync(`${dir}/device.draft.yaml`, yaml.dump(device, { lineWidth: 100 }), "utf8");

  const LEAK = /\b(Kershaw|Smethurst|Welkin|Smythe|Brodski|Hickler|Wright|Holmes|Watson|Lexman|Kara)\b/;
  rows.push({
    slug, axis: fp.axis, family, device_family: device.family,
    fingerprint: fpOk ? "ok" : "FAIL",
    device: devOk ? "ok (3 TODO)" : "schema FAIL",
    despec: LEAK.test(device.principle + device.surface_illusion_template + device.underlying_reality_template) ? "LEAK" : "clean",
    clues: device.clue_archetypes.length,
  });
}
console.table(rows);
console.log("\nTODO fields are deliberate: title, principleType and feasibility.requires/forbids");
console.log("do not derive from a case file (A_78 §9.1). They are cheap LLM calls on a SHORT input.");
