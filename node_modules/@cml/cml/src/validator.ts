import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

export type CmlValidationResult = {
  valid: boolean;
  errors: string[];
};

type SchemaNode = {
  type?: "string" | "number" | "boolean" | "object" | "array";
  required?: boolean;
  allowed?: Array<string | number | boolean>;
  fields?: Record<string, SchemaNode>;
  items?: SchemaNode | "string" | "number" | "boolean" | "object" | "array";
};

const loadSchema = (): Record<string, SchemaNode> => {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const schemaPath = path.resolve(currentDir, "..", "..", "..", "schema", "cml_2_0.schema.yaml");
  const raw = fs.readFileSync(schemaPath, "utf8");
  return yaml.load(raw) as Record<string, SchemaNode>;
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
): void => {
  if (value === undefined || value === null) {
    if (node.required) {
      errors.push(`${pathLabel} is required`);
    }
    return;
  }

  if (!isType(value, node.type)) {
    errors.push(`${pathLabel} must be ${node.type}`);
    return;
  }

  if (node.allowed && !node.allowed.includes(value as string | number | boolean)) {
    errors.push(`${pathLabel} must be one of ${node.allowed.join(", ")}`);
  }

  if (node.type === "object" && node.fields && value && typeof value === "object") {
    for (const [fieldName, fieldSchema] of Object.entries(node.fields)) {
      const fieldValue = (value as Record<string, unknown>)[fieldName];
      validateNode(fieldSchema, fieldValue, `${pathLabel}.${fieldName}`, errors);
    }
  }

  if (node.type === "array" && node.items && Array.isArray(value)) {
    const itemSchema: SchemaNode =
      typeof node.items === "string" ? { type: node.items } : (node.items as SchemaNode);
    value.forEach((item, index) => {
      validateNode(itemSchema, item, `${pathLabel}[${index}]`, errors);
    });
  }
};

export const validateCml = (payload: unknown): CmlValidationResult => {
  const schema = loadSchema();

  if (!payload || typeof payload !== "object") {
    return { valid: false, errors: ["Payload must be an object"] };
  }

  const errors: string[] = [];
  const record = payload as Record<string, unknown>;

  for (const [key, node] of Object.entries(schema)) {
    validateNode(node, record[key], key, errors);
  }

  return { valid: errors.length === 0, errors };
};
