import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
const loadSchema = () => {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const schemaPath = path.resolve(currentDir, "..", "..", "..", "schema", "cml_2_0.schema.yaml");
    const raw = fs.readFileSync(schemaPath, "utf8");
    return yaml.load(raw);
};
const isType = (value, type) => {
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
const validateNode = (node, value, pathLabel, errors) => {
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
    if (node.allowed && !node.allowed.includes(value)) {
        errors.push(`${pathLabel} must be one of ${node.allowed.join(", ")}`);
    }
    if (node.type === "object" && node.fields && value && typeof value === "object") {
        for (const [fieldName, fieldSchema] of Object.entries(node.fields)) {
            const fieldValue = value[fieldName];
            validateNode(fieldSchema, fieldValue, `${pathLabel}.${fieldName}`, errors);
        }
    }
    if (node.type === "array" && node.items && Array.isArray(value)) {
        const itemSchema = typeof node.items === "string" ? { type: node.items } : node.items;
        value.forEach((item, index) => {
            validateNode(itemSchema, item, `${pathLabel}[${index}]`, errors);
        });
    }
};
export const validateCml = (payload) => {
    const schema = loadSchema();
    if (!payload || typeof payload !== "object") {
        return { valid: false, errors: ["Payload must be an object"] };
    }
    const errors = [];
    const record = payload;
    for (const [key, node] of Object.entries(schema)) {
        validateNode(node, record[key], key, errors);
    }
    return { valid: errors.length === 0, errors };
};
//# sourceMappingURL=validator.js.map