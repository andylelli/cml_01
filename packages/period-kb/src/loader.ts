/**
 * Period KB — data loader.
 *
 * Reads the year/archetype YAML files at the package root (`eras/`, `places/`) and
 * validates each against its strict schema (`schema/`) using ajv before handing it
 * back. A typo'd or malformed entry fails loudly here rather than producing a missing
 * fact deep in the pipeline.
 *
 * Path resolution works from both `src/` (vitest, TS) and `dist/` (built JS): both are
 * one level under the package root, so `<dir>/..` reaches the data folders in either case.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import { Ajv } from "ajv";
import type { ValidateFunction } from "ajv";
import type { EraEntry, PlaceEntry } from "./types.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Package root (sibling of `src/` and `dist/`). */
export const packageRoot = (): string => path.resolve(HERE, "..");

const erasDir = (): string => path.join(packageRoot(), "eras");
const placesDir = (): string => path.join(packageRoot(), "places");
const schemaDir = (): string => path.join(packageRoot(), "schema");

const ajv = new Ajv({ allErrors: true, strict: false });

const validatorCache = new Map<string, ValidateFunction>();
const eraCache = new Map<number, EraEntry>();
const placeCache = new Map<string, PlaceEntry>();

const getValidator = (schemaName: string): ValidateFunction => {
  const cached = validatorCache.get(schemaName);
  if (cached) {
    return cached;
  }
  const schemaPath = path.join(schemaDir(), `${schemaName}.schema.yaml`);
  const raw = fs.readFileSync(schemaPath, "utf8");
  const schema = yaml.load(raw) as Record<string, unknown>;
  const validate = ajv.compile(schema);
  validatorCache.set(schemaName, validate);
  return validate;
};

/** Validate arbitrary data against the era schema (for tests / external callers). */
export const validateEraData = (data: unknown): boolean => getValidator("era")(data) as boolean;
/** Validate arbitrary data against the place schema (for tests / external callers). */
export const validatePlaceData = (data: unknown): boolean => getValidator("place")(data) as boolean;

const validateOrThrow = (data: unknown, schemaName: string, sourceLabel: string): void => {
  const validate = getValidator(schemaName);
  if (!validate(data)) {
    const detail = (validate.errors ?? [])
      .map((e) => `  ${e.instancePath || "/"} ${e.message ?? ""}`.trimEnd())
      .join("\n");
    throw new Error(`Period KB entry "${sourceLabel}" failed ${schemaName} schema:\n${detail}`);
  }
};

const yamlFilesIn = (dir: string): string[] => {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") && !f.endsWith(".schema.yaml"));
};

/** Sorted list of every year that has a seeded `eras/<year>.yaml`. */
export const listEraYears = (): number[] =>
  yamlFilesIn(erasDir())
    .map((f) => Number.parseInt(path.basename(f, ".yaml"), 10))
    .filter((n) => Number.isInteger(n))
    .sort((a, b) => a - b);

export const hasEraYear = (year: number): boolean =>
  fs.existsSync(path.join(erasDir(), `${year}.yaml`));

/** Load and validate the entry for an exact year. Throws if the file is absent. */
export const loadEraEntry = (year: number): EraEntry => {
  const cached = eraCache.get(year);
  if (cached) {
    return cached;
  }
  const filePath = path.join(erasDir(), `${year}.yaml`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Period KB has no era anchor for year ${year} (${filePath})`);
  }
  const entry = yaml.load(fs.readFileSync(filePath, "utf8")) as EraEntry;
  validateOrThrow(entry, "era", `eras/${year}.yaml`);
  if (entry.year !== year) {
    throw new Error(`Period KB era file eras/${year}.yaml declares year ${entry.year}`);
  }
  eraCache.set(year, entry);
  return entry;
};

/** Sorted list of every seeded place archetype. */
export const listPlaceArchetypes = (): string[] =>
  yamlFilesIn(placesDir())
    .map((f) => path.basename(f, ".yaml"))
    .sort();

export const hasPlaceArchetype = (archetype: string): boolean =>
  fs.existsSync(path.join(placesDir(), `${archetype}.yaml`));

/** Load and validate a place archetype. Throws if the file is absent. */
export const loadPlaceEntry = (archetype: string): PlaceEntry => {
  const cached = placeCache.get(archetype);
  if (cached) {
    return cached;
  }
  const filePath = path.join(placesDir(), `${archetype}.yaml`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Period KB has no place archetype "${archetype}" (${filePath})`);
  }
  const entry = yaml.load(fs.readFileSync(filePath, "utf8")) as PlaceEntry;
  validateOrThrow(entry, "place", `places/${archetype}.yaml`);
  if (entry.archetype !== archetype) {
    throw new Error(
      `Period KB place file places/${archetype}.yaml declares archetype "${entry.archetype}"`
    );
  }
  placeCache.set(archetype, entry);
  return entry;
};
