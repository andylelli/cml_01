/**
 * Agent 3b: Hard-Logic Device Ideation
 *
 * Extracted from mystery-orchestrator.ts. Runs generateHardLogicDevices(),
 * handles scoring-path retry and schema validation, computes hardLogicDirectives,
 * and writes ctx.hardLogicDevices + ctx.hardLogicDirectives.
 */
import { type OrchestratorContext } from "./shared.js";
export declare function runAgent3b(ctx: OrchestratorContext): Promise<void>;
