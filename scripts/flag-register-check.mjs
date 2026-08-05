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
  return { set, shadowed };
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

const code = collectCodeFlags();
const { set: config, shadowed } = collectConfigFlags();
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
