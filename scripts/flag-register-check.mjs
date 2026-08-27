#!/usr/bin/env node
/**
 * REVIEW_02 §2.3 / FLAG-AUDIT — the generated flag table, as a check.
 *
 * WHY THIS EXISTS. FLAG-AUDIT closed with `AGENT9_MODEL_REGEN` — "set in config, read by nothing" —
 * and called it "the third instance of the same defect shape in this document". The audit that wrote
 * that sentence then shipped with instances #4 and #5 sitting inside it (`AGENT9_MODEL_REWRITE`,
 * `AGENT9_MODEL_GENERATE`), because nothing compared the three lists that have to agree:
 *
 *     what the CODE reads   ·   what the CONFIG sets   ·   what the REGISTER documents
 *
 * A flag in the config but not the code is a decision nobody is honouring. A flag in the code but
 * not the register is a permanent branch with no exit condition. Both classes have shipped here
 * repeatedly, and both are one set-difference away from being impossible.
 *
 * WHAT IT DOES NOT DO. It cannot tell you a flag is *reachable* — `AGENT9_MODEL_REGEN` was read by
 * `resolveStageModel("regen", …)`, a function with zero call sites, so it would have passed this
 * check. Only a run settles reachability (FLAG-AUDIT: "a flag is verified by finding its effect in
 * llm-prompts-full.jsonl"). This closes the cheap class so the expensive one is what is left.
 *
 * Usage:  node scripts/flag-register-check.mjs [--json] [--strict]
 * Exit:   0 clean · 1 a configured flag no code reads · 1 (--strict only) an unregistered flag
 *
 * WHY TWO SEVERITIES. The config→code class is a defect on sight and gates immediately. The
 * code→register class currently has a 39-flag backlog, because FLAG-AUDIT scoped itself to
 * `AGENT9_*` and the rest of the pipeline's levers were never registered. Gating on that today would
 * fail every build and teach everyone to pass `--no-verify`, which is how a check becomes furniture.
 * It reports loudly, and `--strict` is what turns it into a gate once the backlog is triaged.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const REGISTER = join(ROOT, "architecture", "FLAG-AUDIT.md");
/**
 * BOTH env files, in the order the pipeline loads them.
 *
 * FOUND BY AUDIT 2026-08-03. This read `.env.local` alone — but every entry point called
 * `config({path: .env})` *before* `config({path: .env.local})`, and **dotenv does not override a
 * value already set**, so `.env` won every key both files defined: the opposite of what the
 * filenames imply. `AZURE_OPENAI_DEPLOYMENT_NAME` was the expensive one — `.env.local` asked for
 * `gpt-4.1-mini`, `.env` said `gpt-4o-mini`, and every non-prose agent ran on `gpt-4o-mini`.
 *
 * A checker that reads only the losing file can report "clean" while the runtime disagrees — the
 * precise defect class this tool exists to catch, in the tool itself.
 *
 * UPDATED 2026-08-05 (X7, REVIEW_05 §20.2). Precedence is now inverted at the source: every loader
 * either passes `{ override: true }` on `.env.local` or reads it first under first-wins, so
 * **`.env.local` wins** — including the four canary harnesses and the two spike scripts, which were
 * still on the old semantics when this line was last edited. The `effective` map below is where
 * that is modelled; the order here is the LOAD order, not the priority order. Reading it as
 * priority is how the original defect was written.
 */
const ENV_FILES = [join(ROOT, ".env"), join(ROOT, ".env.local")];
const SOURCE_ROOTS = ["apps", "packages", "scripts"];
const JSON_OUT = process.argv.includes("--json");

/**
 * Which env vars count as behaviour flags.
 *
 * Deliberately NOT every `process.env.*` read: infrastructure vars (endpoints, keys, log paths,
 * timeouts) are configuration in the ordinary sense and have never produced this defect. The prefixes
 * below are the pipeline's own levers — the ones the corpus regime governs.
 */
/**
 * The logging keys are named ONE BY ONE rather than caught by a `LOG_[A-Z0-9_]+` wildcard.
 *
 * X3 (REVIEW_05 §12.3) put them in scope because `LOG_FULL_PROMPTS_TO_FILE` had four parsers, three
 * of which read `1` as false and silently disabled the evidence a paid run leaves behind. A
 * wildcard would also sweep in every LOG_-prefixed local and telemetry label in the tree, and a
 * checker that reports phantoms is one people learn to ignore — the failure this file already warns
 * about two functions below.
 */
const LOGGING_KEYS = [
  "LOG_LEVEL",
  "LOG_TO_CONSOLE",
  "LOG_TO_FILE",
  "LOG_FILE_PATH",
  "LOG_FULL_PROMPTS_TO_FILE",
  "FULL_PROMPT_LOG_FILE_PATH",
  "LOG_ACTUAL_PROMPT_DOCS_TO_FILE",
  "ACTUAL_PROMPT_DOCS_DIR",
];

const FLAG_PATTERN = new RegExp(
  String.raw`\b(AGENT\d*[A-Z]*_[A-Z0-9_]+|LLM_HTTP_TRANSPORT|RUBRIC_[A-Z0-9_]+|NOVELTY_[A-Z0-9_]+|` +
    `${LOGGING_KEYS.join("|")})\\b`,
  "g",
);

/** Paths whose flag mentions are documentation of a flag, not a use of one. */
const isExcluded = (path) =>
  path.includes("__tests__") ||
  path.includes(`${"dist"}${"/"}`) ||
  path.includes("\\dist\\") ||
  path.includes("node_modules") ||
  path.endsWith(".d.ts") ||
  path.endsWith(".map");

const walk = (dir, out = []) => {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
      walk(full, out);
    } else if (/\.(ts|mts|mjs|js)$/.test(entry.name) && !isExcluded(full)) {
      out.push(full);
    }
  }
  return out;
};

/** Flags the CODE reads: `process.env.X` or `env.X` or `env["X"]`. */
const collectCodeFlags = () => {
  const found = new Map(); // flag -> Set(relative file)
  for (const rootDir of SOURCE_ROOTS) {
    const abs = join(ROOT, rootDir);
    if (!existsSync(abs) || !statSync(abs).isDirectory()) continue;
    for (const file of walk(abs)) {
      const text = readFileSync(file, "utf8");
      // Two forms count as a read, and the second is not optional:
      //   1. a direct access — `process.env.X`, `env["X"]`
      //   2. the flag name as a STRING LITERAL — `{ generate: "AGENT9_MODEL_GENERATE" }`
      //
      // Form 2 exists because `model-tiering.ts` resolves through a lookup table
      // (`process.env[ENV_BY_STAGE[stage]]`), and a checker that only understood form 1 reported
      // `AGENT9_MODEL_GENERATE` as unread — a false positive on the very flag this check was written
      // for. An instrument that cannot see indirection would have sent someone to delete a live
      // config line.
      //
      // A comment naming a flag still does NOT count: prose uses backticks, not quotes, and a
      // deleted flag's ghost lives in comments — which is where `AGENT9_MODEL_REWRITE` survived.
      const direct = text.matchAll(
        /(?:process\.env|(?<![\w.])env)\s*(?:\.\s*([A-Z][A-Z0-9_]+)|\[\s*["']([A-Z][A-Z0-9_]+)["']\s*\])/g,
      );

      // Form 2 is only consulted in files that ACTUALLY index env dynamically. Without that
      // condition the first pass reported seven phantom flags — `console.log("AGENT5_FAILURE_CLASS",
      // …)` in the canary harness, which are telemetry LABELS that merely look like env names. A
      // checker that reports phantoms is one people learn to ignore, which is worse than no checker.
      const indexesEnvDynamically = /process\.env\s*\[/.test(text);
      const scannable = indexesEnvDynamically
        ? text.replace(/console\.\w+\(\s*["'][A-Z0-9_]+["']/g, "")
        : "";
      const literal = scannable.matchAll(/["']([A-Z][A-Z0-9_]{3,})["']/g);

      for (const match of [...direct, ...literal]) {
        const name = match[1] || match[2];
        if (!name || !new RegExp(`^(?:${FLAG_PATTERN.source})$`).test(name)) continue;
        if (!found.has(name)) found.set(name, new Set());
        found.get(name).add(relative(ROOT, file).replace(/\\/g, "/"));
      }
    }
  }
  return found;
};

/** Every assignment in one env file. Commented-out lines do not count as set. */
const readEnvFile = (path) => {
  const map = new Map();
  if (!existsSync(path)) return map;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z][A-Z0-9_]+)\s*=(.*)$/.exec(line);
    if (match) map.set(match[1], match[2].trim());
  }
  return map;
};

/**
 * Flags the CONFIG sets, plus every key SHADOWED across the two files.
 *
 * Shadowing is reported for **all** env keys, not just flag-shaped ones — the worst instance found
 * was `AZURE_OPENAI_DEPLOYMENT_NAME`, which no flag pattern would have matched.
 */
const collectConfigFlags = () => {
  const isFlag = (name) => new RegExp(`^(?:${FLAG_PATTERN.source})$`).test(name);
  const [base, local] = ENV_FILES.map(readEnvFile);

  // Precedence as of 2026-08-03: every production loader passes { override: true } on
  // , so the LOCAL file wins — matching what the filenames imply. Before that fix
  //  won silently, and this checker modelled the broken order.
  const effective = new Map(base);
  for (const [k, v] of local) effective.set(k, v);

  const shadowed = [];
  for (const [k, v] of base) {
    if (local.has(k) && local.get(k) !== v) {
      shadowed.push({ key: k, wins: local.get(k), ignored: v });
    }
  }

  const set = new Set([...effective.keys()].filter(isFlag));
  // `effective` is returned too so the register-state check can compare VALUES, not just presence.
  return { set, shadowed, effective };
};

/** Flags the REGISTER documents — any FLAG-AUDIT mention inside a table row or backticks. */
const collectRegisterFlags = () => {
  const set = new Set();
  if (!existsSync(REGISTER)) return set;
  const text = readFileSync(REGISTER, "utf8");
  for (const match of text.matchAll(/`([A-Z][A-Z0-9_]+)`/g)) {
    if (new RegExp(`^(?:${FLAG_PATTERN.source})$`).test(match[1])) set.add(match[1]);
  }
  return set;
};

/**
 * A FOURTH QUESTION, added 2026-08-27: is the file that reads the flag REACHABLE?
 *
 * ── WHY THE OTHER THREE WERE NOT ENOUGH ──────────────────────────────────────────────────────────
 *
 * `AGENT9_OPENING_IDEATION` was documented in FLAG-AUDIT.md with a full probe plan, was READ by
 * `openingIdeationEnabled()` in `agent9-prose/opening-ideation.ts`, and this checker reported CLEAN —
 * while the entire module was imported by ZERO non-test files. A whole feature aimed at
 * `opening_hook`, a category that has never scored 9 in 43 external reads, existed and could not run.
 *
 * "Read somewhere" and "reachable from the pipeline" are different properties, and only the second
 * one means the flag does anything. A checker that conflates them will keep reporting clean over dead
 * levers, which is the most expensive kind of false negative this project has: it makes an untried
 * idea look like a tried one.
 *
 * The test is deliberately crude — is this module imported by any other non-test source file — because
 * a precise call-graph would need a type-aware pass and the crude version already caught the case that
 * motivated it. It can miss a module that is imported but whose reader is never called; it cannot
 * produce a false alarm, since an unimported module genuinely cannot run.
 */
const SEP = String.fromCharCode(92);
const SPLIT_LINE = new RegExp(String.fromCharCode(13) + '?' + String.fromCharCode(10));
// No backslash escapes in this pattern on purpose: every previous attempt lost them in
// transit and the regex silently matched nothing. Explicit space class instead of a shorthand.
const ROW_RE = new RegExp('^[|][ ]*`([A-Z0-9_]+)`[ ]*[|]([^|]*)[|]');
const collectUnreachableFlagReaders = (codeMap) => {
  // Paths are normalised to forward slashes ONCE, up front. The first version tested Windows
  // backslash paths with forward-slash patterns and reported fifteen live modules as unreachable --
  // a checker whose own false positives exceed its true ones is worse than no checker.
  const norm = (f) => f.split(SEP).join('/');
  const sources = [];
  for (const rootDir of SOURCE_ROOTS) {
    const abs = join(ROOT, rootDir);
    if (!existsSync(abs) || !statSync(abs).isDirectory()) continue;
    for (const file of walk(abs)) sources.push(file);
  }
  const nonTest = sources.filter((f) => {
    const n = norm(f);
    return !n.includes('/__tests__/') && !n.includes('.test.');
  });
  const textOf = new Map(nonTest.map((f) => [norm(f), readFileSync(f, 'utf8')]));

  // Plain substring search on the compiled specifier. Building a regex here needs escaped escapes,
  // and this repo has lost time repeatedly to a backslash that did not survive a round trip.
  const importedByOthers = (file) => {
    const n = norm(file);
    const base = n.substring(n.lastIndexOf('/') + 1).replace(/[.][cm]?[jt]s$/, '');
    const needle = base + '.js';
    for (const [other, text] of textOf) {
      if (other === n) continue;
      if (text.includes(needle)) return true;
    }
    return false;
  };

  // Entry points run without being imported: CLI mains, the API server, agent stage files.
  // Tested on the BASENAME, not the path -- the first version matched /agent\d/ against the whole
  // path, so every file under `agent9-prose/` counted as an entry point and the one genuinely dead
  // module in the repo was waved through by the check written to find it.
  const isEntryPoint = (n) => {
    const base = n.substring(n.lastIndexOf('/') + 1);
    if (n.includes('/scripts/')) return true;
    if (base === 'server.ts' || base.startsWith('index.')) return true;
    if (base.includes('-run.') || base.includes('orchestrator')) return true;
    return /^agent\d/.test(base);
  };

  const out = [];
  for (const [flag, files] of codeMap) {
    const readers = [...files].map((rel) => norm(join(ROOT, rel))).filter((f) => textOf.has(f));
    if (readers.length === 0) continue;
    const anyReachable = readers.some((f) => isEntryPoint(f) || importedByOthers(f));
    if (!anyReachable) out.push([flag, readers.map((f) => f.slice(norm(ROOT).length + 1))]);
  }
  return out;
};

/**
 * A FIFTH QUESTION: does the register's STATE column match the live config?
 *
 * The register's second column is headed `State`, not "code default" -- it is a claim about what the
 * flag IS right now. On 2026-08-27 twelve rows said `unset -> off` for flags that `.env.local`
 * actually sets ON, including `AGENT9_GEOMETRY_ACCEPTANCE`, documented as `shadow` and running in
 * `apply`.
 *
 * That is not cosmetic. This register is the document a probe is designed against: you read it to
 * decide which lever to move and what the baseline is. Twelve wrong rows means a baseline nobody can
 * trust, and this project has already burned runs on baselines that were not what they looked like.
 *
 * Reported, never fatal -- a stale doc must not block a build. The point is that it stops being
 * invisible.
 */
const collectRegisterStates = () => {
  const states = new Map();
  if (!existsSync(REGISTER)) return states;
  for (const line of readFileSync(REGISTER, 'utf8').split(SPLIT_LINE)) {
    const m = ROW_RE.exec(line);
    if (m) states.set(m[1], m[2].trim().split('`').join(''));
  }
  return states;
};

const code = collectCodeFlags();
const { set: config, shadowed, effective: configValues } = collectConfigFlags();
const register = collectRegisterFlags();

const codeNames = new Set(code.keys());
const configuredButUnread = [...config].filter((f) => !codeNames.has(f)).sort();
const readButUnregistered = [...codeNames].filter((f) => !register.has(f)).sort();

if (JSON_OUT) {
  console.log(
    JSON.stringify(
      {
        counts: { code: codeNames.size, config: config.size, register: register.size },
        shadowed,
        configuredButUnread,
        readButUnregistered,
        readSites: Object.fromEntries([...code].map(([k, v]) => [k, [...v].sort()])),
      },
      null,
      2,
    ),
  );
} else {
  console.log(`[flags] code reads ${codeNames.size} · config sets ${config.size} (.env + .env.local) · register documents ${register.size}`);

  {
    const states = collectRegisterStates();
    const drift = [];
    for (const [flag, claimed] of states) {
      const live = configValues.get(flag);
      if (/^unset/i.test(claimed) && live !== undefined) drift.push([flag, claimed, live]);
    }
    if (drift.length) {
      console.log(`
[flags] REGISTER SAYS UNSET, CONFIG SETS IT — ${drift.length}:`);
      for (const [flag, claimed, live] of drift) {
        console.log(`   ${flag.padEnd(42)} register: ${claimed.padEnd(22)} live: ${live}`);
      }
      console.log(`   The register is what a probe's baseline is designed against. Update the State`);
      console.log(`   column, or unset the flag — a wrong baseline is how a run gets spent measuring nothing.`);
    }
  }

  const unreachable = collectUnreachableFlagReaders(code);
  if (unreachable.length) {
    console.log(`
[flags] READ BY AN UNREACHABLE MODULE — ${unreachable.length} (documented, "read", and inert):`);
    for (const [flag, files] of unreachable) {
      console.log(`   ${flag}`);
      for (const f of files) console.log(`      reader: ${f}  (imported by no non-test file)`);
    }
    console.log(`   Wire the module in, or delete it and its register row. A dead lever documented as`);
    console.log(`   live makes an untried idea look tried.`);
  }

  if (configuredButUnread.length) {
    console.log(`\n[flags] SET IN CONFIG, READ BY NO CODE — ${configuredButUnread.length}:`);
    for (const f of configuredButUnread) console.log(`  ${f}`);
    console.log(
      "  → this is the AGENT9_MODEL_REGEN / _REWRITE / _GENERATE class: a config line that reads as a\n" +
        "    decision and is honoured by nothing. Delete the line, or wire the flag.",
    );
  }

  if (readButUnregistered.length) {
    console.log(`\n[flags] READ BY CODE, ABSENT FROM architecture/FLAG-AUDIT.md — ${readButUnregistered.length}:`);
    for (const f of readButUnregistered) console.log(`  ${f}  (${[...code.get(f)].slice(0, 2).join(", ")})`);
    console.log(
      "  → register it with an owner, a settling probe, and what happens if the probe never runs.\n" +
        "    A flag with no exit condition is a permanent branch (FLAG-AUDIT lifecycle rule).",
    );
  }

  if (shadowed.length) {
    console.log(`\n[flags] DUPLICATED — set in BOTH files with different values — ${shadowed.length}:`);
    for (const s of shadowed) console.log(`  ${s.key}\n    effective: ${s.wins}  (.env.local)\n    ignored  : ${s.ignored}  (.env)`);
    console.log(
      "  → .env.local now wins: every production loader passes { override: true } (fixed 2026-08-03).\n" +
        "    Not a defect any more, but two sources for one key is how the gpt-4o-mini shadowing\n" +
        "    survived unnoticed for months — delete the .env copy.",
    );
  }

  if (!configuredButUnread.length && !readButUnregistered.length && !shadowed.length) {
    console.log("\n[flags] clean — every configured flag is read, and every read flag is registered.");
  }
}

const STRICT = process.argv.includes("--strict");
const failed = configuredButUnread.length > 0 || (STRICT && readButUnregistered.length > 0);
if (!JSON_OUT && readButUnregistered.length && !STRICT) {
  console.log(`\n[flags] not gating on the ${readButUnregistered.length} unregistered flags — pass --strict to.`);
}
process.exit(failed ? 1 : 0);
