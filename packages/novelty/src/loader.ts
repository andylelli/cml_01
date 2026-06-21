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

/** Seeds + cliches — the two static reference corpora a new idea must diverge from. */
export function loadReferenceCorpus(): Fingerprint[] {
  return [...loadSeedFingerprints(), ...loadClicheLedger()];
}
