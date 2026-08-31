/**
 * Device library — pattern loader.
 *
 * Reads every `data/patterns/*.yaml` and validates each against the strict
 * `schema/device_library.schema.yaml` (top-level repo schema dir, ajv-compiled) before returning
 * it. A malformed or typo'd pattern fails loudly here, not in retrieval.
 *
 * Path resolution works from both `src/` (vitest) and `dist/` (built): both are one level under the
 * package root, so `<dir>/..` reaches the package root and `<root>/../../schema` reaches the repo
 * schema dir in either case.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import { Ajv, type ValidateFunction } from "ajv";
import type { DevicePattern } from "./types.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = (): string => path.resolve(HERE, "..");
const patternsDir = (): string => path.join(packageRoot(), "data", "patterns");
const schemaPath = (): string =>
  path.resolve(packageRoot(), "..", "..", "schema", "device_library.schema.yaml");

const ajv = new Ajv({ allErrors: true, strict: false });
let validator: ValidateFunction | undefined;
let cache: DevicePattern[] | undefined;

const getValidator = (): ValidateFunction => {
  if (validator) return validator;
  const schema = yaml.load(fs.readFileSync(schemaPath(), "utf8")) as Record<string, unknown>;
  validator = ajv.compile(schema);
  return validator;
};

/** Validate arbitrary data against the device-pattern schema (for tests / external callers). */
export const validatePatternData = (data: unknown): boolean => getValidator()(data) as boolean;

const validateOrThrow = (data: unknown, sourceLabel: string): void => {
  const validate = getValidator();
  if (!validate(data)) {
    const detail = (validate.errors ?? [])
      .map((e) => `  ${e.instancePath || "/"} ${e.message ?? ""}`.trimEnd())
      .join("\n");
    throw new Error(`Device pattern "${sourceLabel}" failed schema:\n${detail}`);
  }
};

/**
 * A_79 A1 — the corpus-derived patterns, 2026-08-31.
 *
 * `library/works/<slug>/device.draft.yaml` holds one device pattern per encoded public-domain novel,
 * generated from a validator-clean case rather than written from memory. They are loaded from where
 * they are AUTHORED rather than copied in beside the hand-written eleven, because copying is exactly
 * how `examples/` and `seed-fingerprints.yaml` drifted into disagreeing 11 times in 14 (A_77 §4.3).
 * One source, derived outputs.
 *
 * Default OFF. Turning it on changes the raw material every Agent 3b prompt is built from —
 * MEASURED at retrieval for a 1931 story: spatial 5 -> 10, behavioral 4 -> 8, identity 1 -> 3. That
 * is a behaviour change to a paid pipeline, so it is a flag flip somebody makes deliberately.
 *
 * A corpus pattern that fails the schema is SKIPPED WITH A WARNING rather than thrown, unlike the
 * curated eleven which throw. The curated set is hand-maintained and a break there is a mistake; the
 * corpus set is machine-generated and growing, and one bad entry must not take the generator down.
 */
const corpusEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.DEVICE_LIBRARY_INCLUDE_CORPUS ?? "").trim());

const corpusDir = (env: NodeJS.ProcessEnv = process.env): string =>
  String(env.DEVICE_LIBRARY_CORPUS_DIR ?? "").trim() ||
  path.resolve(packageRoot(), "..", "..", "library", "works");

/**
 * A_79 §11.3 — skip works the evidence gate FAILED.
 *
 * `library/works/.verification.json` is written by `scripts/corpus-sync-fingerprints.mjs`, which
 * recomputes each work's anchor coverage against its own source text. A work marked `failed` has
 * positive evidence against it: our first Big Bow Mystery encode described the murderer entering the
 * locked room beforehand with a key — which is the book's REFUTED theory, argued at length in-world,
 * and the exact opposite of Zangwill's trick. It passed `validateCml` cleanly, because a schema check
 * cannot tell a coherent wrong answer from a right one.
 *
 * Only `failed` is excluded. A work with no evidence on disk is kept: "we did not look" must never
 * read as "it is bad". Missing manifest = nothing skipped, so the gate can only ever remove works it
 * has actually judged.
 */
const failedWorks = (root: string): Set<string> => {
  const manifest = path.join(root, ".verification.json");
  if (!fs.existsSync(manifest)) return new Set();
  try {
    const works = (JSON.parse(fs.readFileSync(manifest, "utf8")) as { works?: Record<string, string> }).works ?? {};
    return new Set(Object.entries(works).filter(([, state]) => state === "failed").map(([slug]) => slug));
  } catch {
    return new Set();
  }
};

const loadCorpusPatterns = (): DevicePattern[] => {
  if (!corpusEnabled()) return [];
  const root = corpusDir();
  if (!fs.existsSync(root)) return [];
  const failed = failedWorks(root);
  const out: DevicePattern[] = [];
  for (const slug of fs.readdirSync(root).sort()) {
    if (failed.has(slug)) continue;
    const file = path.join(root, slug, "device.draft.yaml");
    if (!fs.existsSync(file)) continue;
    let entry: DevicePattern;
    try {
      entry = yaml.load(fs.readFileSync(file, "utf8")) as DevicePattern;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[device-library] corpus pattern ${slug} unreadable: ${String(err)}`);
      continue;
    }
    if (!getValidator()(entry)) {
      const detail = (getValidator().errors ?? []).map((e) => `${e.instancePath} ${e.message}`).join("; ");
      // eslint-disable-next-line no-console
      console.warn(`[device-library] corpus pattern ${slug} failed schema, skipped: ${detail}`);
      continue;
    }
    if (entry.pattern_id !== slug) {
      // eslint-disable-next-line no-console
      console.warn(`[device-library] corpus pattern ${slug} declares pattern_id "${entry.pattern_id}", skipped`);
      continue;
    }
    out.push(entry);
  }
  return out;
};

/** Load + validate every seed pattern (cached). */
export function loadPatterns(): DevicePattern[] {
  if (cache) return cache;
  const dir = patternsDir();
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".yaml") && !f.endsWith(".schema.yaml"))
    : [];
  const patterns: DevicePattern[] = [];
  for (const file of files.sort()) {
    const entry = yaml.load(fs.readFileSync(path.join(dir, file), "utf8")) as DevicePattern;
    validateOrThrow(entry, `data/patterns/${file}`);
    if (entry.pattern_id !== path.basename(file, ".yaml")) {
      throw new Error(`Device pattern data/patterns/${file} declares pattern_id "${entry.pattern_id}"`);
    }
    patterns.push(entry);
  }
  patterns.push(...loadCorpusPatterns());
  cache = patterns;
  return patterns;
}

/** Drop the memo. Only needed by tests that flip DEVICE_LIBRARY_INCLUDE_CORPUS between cases. */
export const resetPatternCache = (): void => { cache = undefined; };

/** Sorted list of seeded pattern ids. */
export const listPatternIds = (): string[] => loadPatterns().map((p) => p.pattern_id);
