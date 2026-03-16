/**
 * Agent 6: Fair Play Auditor
 *
 * Extracted from mystery-orchestrator.ts. Runs auditFairPlay() with one
 * clue-regen retry, then WP5B (blind reader simulation) and WP6B (CML
 * structural revision on critical failures). May mutate ctx.cml and ctx.clues.
 * Writes ctx.fairPlayAudit and ctx.hasCriticalFairPlayFailure.
 */
import { type OrchestratorContext } from "./shared.js";
export declare function runAgent6(ctx: OrchestratorContext): Promise<void>;
