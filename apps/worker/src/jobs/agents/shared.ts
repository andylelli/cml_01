/**
 * Orchestrator shared context, types, and utility functions.
 *
 * All runAgentN() functions accept OrchestratorContext and mutate it in place.
 * Shared low-level utilities (delay, describeError, etc.) live here
 * so they are importable by every agent run file without creating circular
 * dependencies with mystery-orchestrator.ts.
 */

// ORC-06: split by responsibility; this file only re-exports, so every importer keeps its path.
export * from "./context.js";
export * from "./premise.js";
export * from "./clue-guardrails.js";
export * from "./outline-guardrails.js";
export * from "./run-utils.js";
export * from "./stage-runner.js";
export * from "./novelty-constraints.js";
