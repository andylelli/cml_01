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
const ENV_FILE = join(ROOT, ".env.local");
const SOURCE_ROOTS = ["apps", "packages", "scripts"];
const JSON_OUT = process.argv.includes("--json");

/**
 * Which env vars count as behaviour flags.
 *
 * Deliberately NOT every `process.env.*` read: infrastructure vars (endpoints, keys, log paths,
 * timeouts) are configuration in the ordinary sense and have never produced this defect. The prefixes
 * below are the pipeline's own levers — the ones the corpus regime governs.
 */
const FLAG_PATTERN = /\b(AGENT\d*[A-Z]*_[A-Z0-9_]+|LLM_HTTP_TRANSPORT|RUBRIC_[A-Z0-9_]+|NOVELTY_[A-Z0-9_]+)\b/g;

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

/** Flags the CONFIG sets — commented-out lines do not count as set. */
const collectConfigFlags = () => {
  const set = new Set();
  if (!existsSync(ENV_FILE)) return set;
  for (const line of readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const match = /^\s*([A-Z][A-Z0-9_]+)\s*=/.exec(line);
    if (!match) continue;
    if (new RegExp(`^(?:${FLAG_PATTERN.source})$`).test(match[1])) set.add(match[1]);
  }
  return set;
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
const config = collectConfigFlags();
const register = collectRegisterFlags();

const codeNames = new Set(code.keys());
const configuredButUnread = [...config].filter((f) => !codeNames.has(f)).sort();
const readButUnregistered = [...codeNames].filter((f) => !register.has(f)).sort();

if (JSON_OUT) {
  console.log(
    JSON.stringify(
      {
        counts: { code: codeNames.size, config: config.size, register: register.size },
        configuredButUnread,
        readButUnregistered,
        readSites: Object.fromEntries([...code].map(([k, v]) => [k, [...v].sort()])),
      },
      null,
      2,
    ),
  );
} else {
  console.log(`[flags] code reads ${codeNames.size} · .env.local sets ${config.size} · register documents ${register.size}`);

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

  if (!configuredButUnread.length && !readButUnregistered.length) {
    console.log("\n[flags] clean — every configured flag is read, and every read flag is registered.");
  }
}

const STRICT = process.argv.includes("--strict");
const failed = configuredButUnread.length > 0 || (STRICT && readButUnregistered.length > 0);
if (!JSON_OUT && readButUnregistered.length && !STRICT) {
  console.log(`\n[flags] not gating on the ${readButUnregistered.length} unregistered flags — pass --strict to.`);
}
process.exit(failed ? 1 : 0);
