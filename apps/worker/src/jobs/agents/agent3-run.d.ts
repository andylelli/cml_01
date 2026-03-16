/**
 * Agent 3: CML Generator (+ Agent 4 auto-revision, + Agent 8 Novelty Auditor)
 *
 * Extracted from mystery-orchestrator.ts. Runs generateCML(), handles the
 * built-in Agent 4 auto-revision, records CML scoring, then runs the novelty
 * audit (Agent 8) with one retry on failure, and writes ctx.cml + ctx.noveltyAudit.
 */
import { type OrchestratorContext } from "./shared.js";
export declare function runAgent3(ctx: OrchestratorContext): Promise<void>;
