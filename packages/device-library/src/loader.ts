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
  cache = patterns;
  return patterns;
}

/** Sorted list of seeded pattern ids. */
export const listPatternIds = (): string[] => loadPatterns().map((p) => p.pattern_id);
