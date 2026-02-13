/**
 * Generic Artifact Validator
 * Validates any artifact against its corresponding YAML schema
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

export type ArtifactValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

type SchemaNode = {
  type?: "string" | "number" | "boolean" | "object" | "array";
  required?: boolean;
  allowed?: Array<string | number | boolean>;
  fields?: Record<string, SchemaNode>;
  items?: SchemaNode | "string" | "number" | "boolean" | "object" | "array";
  description?: string;
};

const schemaCache = new Map<string, Record<string, SchemaNode>>();

const loadArtifactSchema = (artifactType: string): Record<string, SchemaNode> => {
  if (schemaCache.has(artifactType)) {
    return schemaCache.get(artifactType)!;
  }

  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const schemaPath = path.resolve(
    currentDir,
    "..", "..", "..", "schema",
    `${artifactType}.schema.yaml`
  );

  try {
    const raw = fs.readFileSync(schemaPath, "utf8");
    const schema = yaml.load(raw) as Record<string, SchemaNode>;
    schemaCache.set(artifactType, schema);
    return schema;
  } catch (error) {
    throw new Error(`Failed to load schema for artifact type "${artifactType}": ${error}`);
  }
};

const isType = (value: unknown, type?: SchemaNode["type"]): boolean => {
  if (!type) {
    return true;
  }
  if (type === "array") {
    return Array.isArray(value);
  }
  if (type === "object") {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  return typeof value === type;
};

const validateNode = (
  node: SchemaNode,
  value: unknown,
  pathLabel: string,
  errors: string[],
  warnings: string[],
): void => {
  if (value === undefined || value === null) {
    if (node.required) {
      errors.push(`${pathLabel} is required`);
    }
    return;
  }

  if (!isType(value, node.type)) {
    errors.push(`${pathLabel} must be ${node.type}, got ${typeof value}`);
    return;
  }

  if (node.allowed && !node.allowed.includes(value as string | number | boolean)) {
    errors.push(`${pathLabel} must be one of [${node.allowed.join(", ")}], got "${value}"`);
  }

  if (node.type === "object" && node.fields && value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    
    // Check required fields
    for (const [fieldName, fieldSchema] of Object.entries(node.fields)) {
      const fieldValue = record[fieldName];
      validateNode(fieldSchema, fieldValue, `${pathLabel}.${fieldName}`, errors, warnings);
    }
    
    // Warn about unexpected fields
    const schemaKeys = new Set(Object.keys(node.fields));
    const dataKeys = Object.keys(record);
    for (const key of dataKeys) {
      if (!schemaKeys.has(key)) {
        warnings.push(`${pathLabel}.${key} is not defined in schema (unexpected field)`);
      }
    }
  }

  if (node.type === "array" && node.items && Array.isArray(value)) {
    const itemSchema: SchemaNode =
      typeof node.items === "string" ? { type: node.items } : (node.items as SchemaNode);
    value.forEach((item, index) => {
      validateNode(itemSchema, item, `${pathLabel}[${index}]`, errors, warnings);
    });
  }
};

/**
 * Validate an artifact against its schema
 * 
 * @param artifactType - The type of artifact (e.g., "character_profiles", "location_profiles")
 * @param payload - The artifact data to validate
 * @returns Validation result with errors and warnings
 */
export const validateArtifact = (
  artifactType: string,
  payload: unknown
): ArtifactValidationResult => {
  try {
    const schema = loadArtifactSchema(artifactType);

    if (!payload || typeof payload !== "object") {
      return { 
        valid: false, 
        errors: ["Artifact payload must be an object"], 
        warnings: [] 
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const record = payload as Record<string, unknown>;

    for (const [key, node] of Object.entries(schema)) {
      validateNode(node, record[key], key, errors, warnings);
    }

    return { 
      valid: errors.length === 0, 
      errors, 
      warnings 
    };
  } catch (error) {
    return {
      valid: false,
      errors: [`Schema validation failed: ${error}`],
      warnings: []
    };
  }
};

/**
 * Validate multiple artifacts at once
 */
export const validateArtifacts = (
  artifacts: Array<{ type: string; payload: unknown }>
): Record<string, ArtifactValidationResult> => {
  const results: Record<string, ArtifactValidationResult> = {};
  for (const { type, payload } of artifacts) {
    results[type] = validateArtifact(type, payload);
  }
  return results;
};

/**
 * Get all available artifact types by reading schema directory
 */
export const getArtifactTypes = (): string[] => {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const schemaDir = path.resolve(currentDir, "..", "..", "..", "schema");
  
  try {
    const files = fs.readdirSync(schemaDir);
    return files
      .filter(f => f.endsWith(".schema.yaml") && f !== "cml_2_0.schema.yaml")
      .map(f => f.replace(".schema.yaml", ""));
  } catch {
    return [];
  }
};
