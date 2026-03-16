/**
 * Agent 5: Clue Distribution
 *
 * Extracted from mystery-orchestrator.ts. Runs extractClues(), applies
 * deterministic guardrails, checks inference-path coverage (WP4), and
 * writes ctx.clues / ctx.coverageResult / ctx.allCoverageIssues.
 */
import { type OrchestratorContext } from "./shared.js";
export declare function runAgent5(ctx: OrchestratorContext): Promise<void>;
