/**
 * Agent 2d: Temporal Context
 *
 * Extracted from mystery-orchestrator.ts. Runs generateTemporalContext()
 * via executeAgentWithRetry when scoring is enabled, validates against schema,
 * and writes ctx.temporalContext.
 */
import { type OrchestratorContext } from "./shared.js";
export declare function runAgent2d(ctx: OrchestratorContext): Promise<void>;
