/**
 * Agent 2e: Background Context Generator
 *
 * Extracted from mystery-orchestrator.ts. Runs generateBackgroundContext(),
 * handles scoring-path retry and schema validation, and writes ctx.backgroundContext.
 */
import { type OrchestratorContext } from "./shared.js";
export declare function runAgent2e(ctx: OrchestratorContext): Promise<void>;
