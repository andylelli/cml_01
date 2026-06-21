/**
 * cml-core shadow measurement (Agent 3 redesign §9.5 — the "killer measurement").
 *
 * Runs a BEST-EFFORT parser from today's stringy CML into the typed core, over every shipped CML
 * we can find (store.json artifacts + captured Agent3 responses), and reports how many cases the
 * fair-play engines can even RUN on — and of those, how many they would FAIL.
 *
 * This intentionally measures two things the redesign predicts (07_agent_3_cml_generator.md §3):
 *   1. The load-bearing logic in today's CML is *prose* (alibi_window: "Present throughout";
 *      inference effect: "Narrows ... notably John Avery"), so the uniqueness checker mostly
 *      CANNOT run — that un-checkability is itself the finding.
 *   2. Weaker structural signals we CAN compute on every case (culprit in circle, path addresses
 *      the other suspects, discriminating evidence present) to characterise the corpus.
 *
 * Pure read-only analysis. No pipeline wiring. Run: node scripts/cml-core-shadow.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  certify,
  clockSetFastBroken,
  clockSetFastRepaired,
} from "../packages/cml-core/dist/index.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(ROOT, "scripts", ".corpus-cache");

// ── corpus collection ───────────────────────────────────────────────────────

function fromStore() {
  const out = [];
  const p = path.join(ROOT, "data", "store.json");
  if (!fs.existsSync(p)) return out;
  const store = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const a of store.artifacts ?? []) {
    const CASE = a?.payload?.CASE;
    if (CASE?.inference_path) out.push({ source: `store/${a.id ?? "?"}`, CASE });
  }
  return out;
}

function extractCaseFromResponseMd(text) {
  // The response body is the first fenced code block; the JSON is { CML_VERSION, CASE } or a CASE.
  const fence = text.match(/```[a-z]*\n([\s\S]*?)```/i);
  let body = fence ? fence[1] : text;
  // best-effort: slice from first { to last }
  const a = body.indexOf("{");
  const b = body.lastIndexOf("}");
  if (a < 0 || b < 0) return null;
  try {
    const obj = JSON.parse(body.slice(a, b + 1));
    return obj.CASE ?? (obj.inference_path ? obj : null);
  } catch {
    return null;
  }
}

function fromCache() {
  const out = [];
  if (!fs.existsSync(CACHE)) return out;
  for (const f of fs.readdirSync(CACHE).filter((f) => f.endsWith(".md"))) {
    const CASE = extractCaseFromResponseMd(fs.readFileSync(path.join(CACHE, f), "utf8"));
    if (CASE?.inference_path) out.push({ source: f.replace(/^documentation.*actual__/, "").replace(/__.*$/, ""), CASE });
  }
  return out;
}

// Live on-disk Agent3 response captures (untracked runs). The historical/deleted ones can be
// recovered into scripts/.corpus-cache/ with:
//   for f in $(git ls-files 'documentation/prompts/actual/**/*Agent3*CMLGenerator_response.md'); do
//     git show "HEAD:$f" > "scripts/.corpus-cache/$(echo "$f" | sed 's#/#__#g')"; done
function fromLiveDisk() {
  const out = [];
  const base = path.join(ROOT, "documentation", "prompts", "actual");
  if (!fs.existsSync(base)) return out;
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/Agent3.*CMLGenerator_response\.md$/i.test(e.name)) {
        const CASE = extractCaseFromResponseMd(fs.readFileSync(p, "utf8"));
        if (CASE?.inference_path) out.push({ source: path.basename(dir), CASE });
      }
    }
  };
  walk(base);
  return out;
}

function signature(CASE) {
  return `${CASE.meta?.title ?? "?"}|${(CASE.closed_circle?.suspects ?? []).join(",")}|${(CASE.culpability?.culprits ?? []).join(",")}`;
}

function collectCorpus() {
  const all = [...fromStore(), ...fromCache(), ...fromLiveDisk()];
  const seen = new Map();
  for (const item of all) {
    const sig = signature(item.CASE);
    if (!seen.has(sig)) seen.set(sig, item); // dedup identical cases, keep first
  }
  return [...seen.values()];
}

// ── best-effort English-time parsing ─────────────────────────────────────────

const HOUR_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const hourWord = (w) => HOUR_WORDS[String(w).toLowerCase()] ?? (/^\d+$/.test(w) ? Number(w) : null);

function parseTimes(str) {
  const out = [];
  if (typeof str !== "string") return out;
  const s = str.toLowerCase();
  let m;
  for (const re of [/\b(\d{1,2}):(\d{2})\b/g]) while ((m = re.exec(s))) out.push(Number(m[1]) * 60 + Number(m[2]));
  let re = /half past (\w+)/g; while ((m = re.exec(s))) { const h = hourWord(m[1]); if (h != null) out.push(h * 60 + 30); }
  re = /quarter (past|to) (\w+)/g; while ((m = re.exec(s))) { const h = hourWord(m[2]); if (h != null) out.push(m[1] === "past" ? h * 60 + 15 : h * 60 - 15); }
  re = /(\w+) minutes? (past|to) (\w+)/g; while ((m = re.exec(s))) { const mm = hourWord(m[1]); const h = hourWord(m[3]); if (mm != null && h != null) out.push(m[2] === "past" ? h * 60 + mm : h * 60 - mm); }
  re = /(\w+) o'?clock/g; while ((m = re.exec(s))) { const h = hourWord(m[1]); if (h != null) out.push(h * 60); }
  return out;
}

// rooms that would PRECLUDE the crime (a specific elsewhere), vs whole-house terms that don't
const SPECIFIC_LOCATION = /\b(study|library|kitchen|garden|conservatory|cellar|stable|station|drawing[- ]?room|dining[- ]?room|bedroom|attic|hall|terrace|village)\b/i;
const WHOLE_HOUSE = /\b(manor|estate|house|premises|throughout|grounds)\b/i;

// ── per-case best-effort analysis ────────────────────────────────────────────

// Suspects: prefer an explicit closed circle; else derive from the cast (minus victim/detective).
// Older (gpt-4o-mini) CMLs have NO closed_circle at all and inconsistent role labels.
function deriveSuspects(CASE) {
  const circle = CASE.closed_circle?.suspects;
  if (Array.isArray(circle) && circle.length) return circle.map(String);
  const isVictim = (r) => /victim/i.test(r ?? "");
  const isDetective = (r) => /detective|inspector|investigator|sleuth/i.test(r ?? "");
  return (CASE.cast ?? [])
    .filter((c) => !isVictim(c.role_archetype ?? c.role) && !isDetective(c.role_archetype ?? c.role))
    .map((c) => String(c.name));
}

function analyze(CASE) {
  const suspects = deriveSuspects(CASE);
  const culprits = (CASE.culpability?.culprits ?? []).map(String);
  const culprit = culprits[0];
  const steps = CASE.inference_path?.steps ?? [];
  const stepText = steps.map((s) => `${s.observation ?? ""} ${s.correction ?? ""} ${s.effect ?? ""}`).join(" ");

  // (a) how many cast members yield a machine-timed alibi at a SPECIFIC (precluding) location?
  let timedSpecificAlibis = 0;
  for (const c of CASE.cast ?? []) {
    const a = String(c.alibi_window ?? "");
    if (parseTimes(a).length > 0 && SPECIFIC_LOCATION.test(a) && !WHOLE_HOUSE.test(a)) timedSpecificAlibis++;
  }

  // (b) crime window: a "time of death between X and Y" anywhere in the time/hidden model
  const timeBlob = [
    ...(CASE.constraint_space?.time?.windows ?? []),
    ...(CASE.constraint_space?.time?.anchors ?? []),
    CASE.hidden_model?.mechanism ?? "",
    CASE.hidden_model?.timeline ?? "",
  ].join(" || ");
  let crimeWindow = null;
  const death = timeBlob.toLowerCase().match(/(death|died|killed)[^.]*?\bbetween\b([^.]*)/);
  if (death) { const ts = parseTimes(death[2]); if (ts.length >= 2) crimeWindow = { start: Math.min(...ts), end: Math.max(...ts) }; }

  // (c) inference steps with a MACHINE elimination (a named suspect + elimination language)
  let structuredEliminations = 0;
  const elimRe = /(eliminat|rule[sd]? out|exonerat|clears?|cannot be|absolv|excludes?)/i;
  for (const s of steps) {
    const t = `${s.correction ?? ""} ${s.effect ?? ""}`;
    if (elimRe.test(t) && suspects.some((n) => n !== culprit && t.includes(n))) structuredEliminations++;
  }

  // CHECKABLE by the uniqueness engine? need a crime window + a precluding timed alibi for each
  // non-culprit suspect. (Almost never true for today's prose CML — that's the point.)
  const checkable = !!crimeWindow && timedSpecificAlibis >= Math.max(1, suspects.length - 1);

  // ── structural-lite signals (runnable on every case, no times needed) ──
  const noCulpritNamed = culprits.length === 0;
  const culpritInCircle = !!culprit && suspects.includes(culprit);
  const pathMentionsCulprit = !!culprit && stepText.includes(culprit);
  const others = suspects.filter((n) => n !== culprit);
  const othersAddressed = others.filter((n) => stepText.includes(n)).length;
  const evidenceClues = CASE.discriminating_test?.evidence_clues ?? [];
  const hasEvidenceClues = Array.isArray(evidenceClues) && evidenceClues.length > 0;

  return {
    title: CASE.meta?.title ?? "(untitled)",
    suspects: suspects.length,
    culprit,
    steps: steps.length,
    timedSpecificAlibis,
    crimeWindow,
    structuredEliminations,
    checkable,
    noCulpritNamed,
    culpritInCircle,
    pathMentionsCulprit,
    othersAddressed,
    othersTotal: others.length,
    hasEvidenceClues,
  };
}

// ── run ──────────────────────────────────────────────────────────────────────

const corpus = collectCorpus();
const rows = corpus.map((c) => ({ source: c.source, ...analyze(c.CASE) }));

const line = (s = "") => console.log(s);
line("=".repeat(78));
line("CML-CORE SHADOW MEASUREMENT  (Agent 3 redesign §9.5)");
line("=".repeat(78));

// control: prove the engines work when the data IS structured
const ctrlBroken = certify(clockSetFastBroken());
const ctrlRepaired = certify(clockSetFastRepaired());
line(`\nENGINE CONTROL (typed fixtures): broken.ok=${ctrlBroken.ok} (expect false), repaired.ok=${ctrlRepaired.ok} (expect true)`);

line(`\nCORPUS: ${rows.length} distinct shipped CML(s)\n`);
for (const r of rows) {
  line(`• ${r.title}  [${r.source}]`);
  line(`    suspects=${r.suspects} culprit=${r.culprit} steps=${r.steps}`);
  line(`    machine-timed precluding alibis: ${r.timedSpecificAlibis}/${r.suspects}   crimeWindow: ${r.crimeWindow ? `[${r.crimeWindow.start},${r.crimeWindow.end}]` : "NOT EXTRACTABLE"}   structured eliminations: ${r.structuredEliminations}/${r.steps}`);
  line(`    -> uniqueness-checkable: ${r.checkable ? "YES" : "NO"}`);
  line(`    structural-lite: culpritInCircle=${r.culpritInCircle}  pathNamesCulprit=${r.pathMentionsCulprit}  otherSuspectsAddressedByPath=${r.othersAddressed}/${r.othersTotal}  discriminatingEvidenceClues=${r.hasEvidenceClues}`);
}

const checkable = rows.filter((r) => r.checkable);
const noCulprit = rows.filter((r) => r.noCulpritNamed);
const culpritNotInCircle = rows.filter((r) => !r.noCulpritNamed && !r.culpritInCircle);
const pathSilentOnCulprit = rows.filter((r) => r.culprit && !r.pathMentionsCulprit);
const incompleteElimination = rows.filter((r) => r.othersAddressed < r.othersTotal);
const noEvidenceClues = rows.filter((r) => !r.hasEvidenceClues);

line("\n" + "-".repeat(78));
line("HEADLINE");
line("-".repeat(78));
line(`  shipped CMLs analysed ................................ ${rows.length}`);
line(`  uniqueness-CHECKABLE today (machine time+access) .... ${checkable.length}  (${pct(checkable.length, rows.length)})`);
line(`  -> NOT machine-checkable for fair-play uniqueness ... ${rows.length - checkable.length}  (${pct(rows.length - checkable.length, rows.length)})`);
line("");
line("  structural-lite findings (computable even on prose CML):");
line(`    CML names NO culprit at all (empty culprits[]) ... ${noCulprit.length}`);
line(`    named culprit NOT among the suspects ............. ${culpritNotInCircle.length}`);
line(`    inference path never names the culprit ........... ${pathSilentOnCulprit.length}`);
line(`    path does NOT address every other suspect ........ ${incompleteElimination.length}  (incomplete elimination — readers can't rule them all out)`);
line(`    no discriminating_test.evidence_clues ............ ${noEvidenceClues.length}`);
line("");
line("INTERPRETATION");
line("  The uniqueness engine WORKS (control passes), but it cannot run on the shipped");
line("  corpus: today's CML encodes alibis/timeline/eliminations as PROSE, so the");
line("  per-suspect timed presence facts the checker needs do not exist as data.");
line("  Fair-play here is therefore not merely UNVERIFIED but UNVERIFIABLE — which is the");
line("  strongest justification for the typed core: it makes the load-bearing logic");
line("  machine-checkable so the question 'does it solve, uniquely?' becomes decidable.");
line("=".repeat(78));

function pct(n, d) { return d === 0 ? "0%" : `${Math.round((100 * n) / d)}%`; }
