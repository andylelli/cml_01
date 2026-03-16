/**
 * Agent 1: Era & Setting Refiner
 *
 * Extracted from mystery-orchestrator.ts. Runs refineSetting(), handles
 * scoring-path retry and schema-repair retry, and writes ctx.setting.
 */
import { type OrchestratorContext } from "./shared.js";
export declare function runAgent1(ctx: OrchestratorContext): Promise<void>;
