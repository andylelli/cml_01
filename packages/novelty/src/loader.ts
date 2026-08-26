/**
 * Ledger loader — reads + ajv-validates the seed and genre-cliche fingerprint ledgers against
 * schema/novelty_fingerprint.schema.yaml. A typo'd axis or unknown mechanism family fails loudly here.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import { Ajv, type ValidateFunction } from "ajv";
import type { Fingerprint } from "./types.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = (): string => path.resolve(HERE, "..");
const dataFile = (name: string): string => path.join(packageRoot(), "data", name);

/** Walk up from `start` looking for `relative`, so the shared repo-root schema resolves whether the
 * package is loaded from its real path (packages/novelty) OR via a node_modules symlink — in which case
 * `packageRoot()/../..` lands in node_modules, not the repo root (the A_56 8-A worker ENOENT). */
const findUp = (relative: string, start: string): string | undefined => {
  let dir = start;
  for (let i = 0; i < 10; i++) {
    const candidate = path.join(dir, relative);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return undefined;
};

const SCHEMA_REL = path.join("schema", "novelty_fingerprint.schema.yaml");
const schemaPath = (): string | undefined => {
  const direct = path.resolve(packageRoot(), "..", "..", SCHEMA_REL);
  if (fs.existsSync(direct)) return direct;
  return findUp(SCHEMA_REL, packageRoot());
};

const ajv = new Ajv({ allErrors: true, strict: false });
let validator: ValidateFunction | undefined;

const getValidator = (): ValidateFunction => {
  if (validator) return validator;
  const file = schemaPath();
  if (!file) {
    // Schema unreachable (e.g. an unexpected symlink layout). Degrade gracefully: load fingerprints
    // unvalidated rather than throwing, so the (shadow) novelty judge still works. Logged once.
    // eslint-disable-next-line no-console
    console.warn("[novelty] fingerprint schema not found; loading corpus without ajv validation.");
    validator = (() => true) as unknown as ValidateFunction;
    return validator;
  }
  const schema = yaml.load(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
  validator = ajv.compile(schema);
  return validator;
};

/** Validate arbitrary data against the fingerprint schema. */
export const validateFingerprint = (data: unknown): boolean => getValidator()(data) as boolean;

function loadLedger(file: string): Fingerprint[] {
  const entries = (yaml.load(fs.readFileSync(dataFile(file), "utf8")) ?? []) as Fingerprint[];
  const validate = getValidator();
  for (const entry of entries) {
    if (!validate(entry)) {
      const detail = (validate.errors ?? []).map((e) => `  ${e.instancePath || "/"} ${e.message ?? ""}`.trimEnd()).join("\n");
      throw new Error(`Fingerprint "${(entry as { id?: string }).id ?? "?"}" in ${file} failed schema:\n${detail}`);
    }
  }
  return entries;
}

let seedCache: Fingerprint[] | undefined;
let clicheCache: Fingerprint[] | undefined;

export function loadSeedFingerprints(): Fingerprint[] {
  return (seedCache ??= loadLedger("seed-fingerprints.yaml"));
}

export function loadClicheLedger(): Fingerprint[] {
  return (clicheCache ??= loadLedger("cliche-ledger.yaml"));
}

/**
 * A_53 P7 (seed-cliche-fingerprint-duplicates): the structural identity of a fingerprint — the five
 * abstract fields the verdict is computed from. Two entries with the same key are the same idea even
 * if their ids differ (`spare_key_relock` ≡ `the_second_key`).
 */
const structuralKey = (fp: Fingerprint): string =>
  [fp.axis, fp.mechanism_family, fp.false_assumption_pattern, fp.discriminating_test_shape, fp.inference_shape]
    .map((s) => String(s ?? "").trim().toLowerCase())
    .join("|");

// More-specific corpora win a collision: a concrete prior run / seed beats a generic genre cliche.
const CORPUS_SPECIFICITY: Record<string, number> = { prior_run: 3, seed: 2, cliche: 1 };

/**
 * Seeds + cliches — the two static reference corpora a new idea must diverge from. A_53 P7: de-duped
 * across corpora by structural key (warn on collision) so the same idea isn't double-counted and the
 * corpus labelling is deterministic; on collision keep the more-specific corpus.
 */
export function loadReferenceCorpus(priorRuns: Fingerprint[] = []): Fingerprint[] {
  /**
   * A_74 §8 DE3 — PRIOR RUNS WERE NEVER PASSED IN, AND THE DESIGN ALWAYS EXPECTED THEM.
   *
   * `CORPUS_SPECIFICITY` above ranks `prior_run` ABOVE `seed` and `cliche`, and `Corpus` declares it
   * as a member — but the only call site (`agent3-run.ts`) called this with no arguments, so the
   * structural judge compared every candidate against a FIXED corpus of seeds and cliches and was
   * never shown a single run this pipeline had produced. The organ that can measure structural
   * repetition could not see the repetition; the organ that saw it (the cross-run ledger) could only
   * emit free-text avoidance lines into a prompt.
   *
   * Prior runs are PASSED rather than loaded here on purpose: this package is pure and fs-light, and
   * the ledger is app-side (see novelty-ledger.ts's header for why that split exists).
   */
  const all = [...priorRuns, ...loadSeedFingerprints(), ...loadClicheLedger()];
  const byKey = new Map<string, Fingerprint>();
  for (const fp of all) {
    const key = structuralKey(fp);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, fp);
      continue;
    }
    const keep = (CORPUS_SPECIFICITY[fp.corpus] ?? 0) > (CORPUS_SPECIFICITY[existing.corpus] ?? 0) ? fp : existing;
    const drop = keep === fp ? existing : fp;
    // eslint-disable-next-line no-console
    console.warn(
      `[novelty] duplicate fingerprint across corpora: "${drop.id}" (${drop.corpus}) ≡ "${keep.id}" (${keep.corpus}); keeping the more-specific corpus.`,
    );
    byKey.set(key, keep);
  }
  return [...byKey.values()];
}
