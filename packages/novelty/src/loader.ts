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
const schemaPath = (): string => path.resolve(packageRoot(), "..", "..", "schema", "novelty_fingerprint.schema.yaml");

const ajv = new Ajv({ allErrors: true, strict: false });
let validator: ValidateFunction | undefined;

const getValidator = (): ValidateFunction => {
  if (validator) return validator;
  const schema = yaml.load(fs.readFileSync(schemaPath(), "utf8")) as Record<string, unknown>;
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
export function loadReferenceCorpus(): Fingerprint[] {
  const all = [...loadSeedFingerprints(), ...loadClicheLedger()];
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
