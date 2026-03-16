/**
 * Agent 2: Cast & Motive Designer
 *
 * Extracted from mystery-orchestrator.ts. Runs designCast(), handles
 * scoring-path retry and schema-repair retry, and writes ctx.cast.
 */
import { type OrchestratorContext } from "./shared.js";
export declare function runAgent2(ctx: OrchestratorContext): Promise<void>;
