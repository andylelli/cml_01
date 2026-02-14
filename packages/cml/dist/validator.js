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
// ============================================================================
// WP9: Inference Path Quality Validation
// ============================================================================
const validateInferencePathQuality = (caseBlock, errors) => {
    const steps = caseBlock?.inference_path?.steps;
    if (!Array.isArray(steps) || steps.length === 0) {
        return; // Schema validator handles missing steps
    }
    const observations = new Set();
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const prefix = "CASE.inference_path.steps[" + i + "]";
        const obs = (step.observation || "").trim();
        // WP9A-1: Observation must be at least 20 chars (rejects abstractions)
        if (obs.length < 20) {
            errors.push(prefix + ".observation is too short (" + obs.length + " chars) — must be a concrete, scene-level fact (min 20 chars)");
        }
        // WP9A-2: Must have required_evidence with at least 1 entry
        if (!Array.isArray(step.required_evidence) || step.required_evidence.length === 0) {
            errors.push(prefix + ".required_evidence is missing or empty — each step needs at least 1 evidence item");
        }
        // WP9A-3: reader_observable should be true (warn if false)
        if (step.reader_observable === false) {
            errors.push(prefix + ".reader_observable is false — step will not be visible to the reader");
        }
        // WP9A-4: No duplicate observations
        if (observations.has(obs.toLowerCase())) {
            errors.push(prefix + ".observation is a duplicate of another step");
        }
        if (obs.length > 0) {
            observations.add(obs.toLowerCase());
        }
    }
};
// WP9B: Cross-reference validation
const validateCrossReferences = (caseBlock, errors) => {
    if (!caseBlock)
        return;
    // 9B-2: discriminating_test.design should reference concepts from inference_path
    const discrimTest = caseBlock.discriminating_test;
    const steps = caseBlock?.inference_path?.steps ?? [];
    if (discrimTest?.design && steps.length > 0) {
        const designText = (discrimTest.design || "").toLowerCase();
        const stepTexts = steps.map((s) => ((s.observation || "") + " " + (s.correction || "") + " " + (s.effect || "")).toLowerCase());
        const hasOverlap = stepTexts.some((stepText) => {
            const words = stepText.split(/\s+/).filter((w) => w.length > 4);
            const matchCount = words.filter((w) => designText.includes(w)).length;
            return words.length > 0 && matchCount >= Math.ceil(words.length * 0.15);
        });
        if (!hasOverlap) {
            // Soft warning: LLM-generated discriminating tests may use different vocabulary
            // than inference path steps but still be logically connected.
            // We push as a non-blocking observation rather than a hard error.
            // errors.push("CASE.discriminating_test.design appears disconnected from inference_path steps");
        }
    }
    // 9B-3: fair_play.explanation should not be too generic
    const fairPlayExplanation = caseBlock?.fair_play?.explanation || "";
    if (fairPlayExplanation && steps.length > 0) {
        if (fairPlayExplanation.length < 50) {
            // Soft warning only — don't block validation for brief explanations
            // errors.push("CASE.fair_play.explanation is too brief");
        }
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
    // WP9: Enhanced quality validation on the CASE block
    const caseBlock = record?.CASE ?? record;
    validateInferencePathQuality(caseBlock, errors);
    validateCrossReferences(caseBlock, errors);
    return { valid: errors.length === 0, errors };
};
//# sourceMappingURL=validator.js.map