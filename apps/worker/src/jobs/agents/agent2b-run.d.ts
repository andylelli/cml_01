/**
 * Agent 2b: Character Profiles
 *
 * Extracted from mystery-orchestrator.ts. Runs generateCharacterProfiles()
 * via executeAgentWithRetry when scoring is enabled, validates against schema,
 * and writes ctx.characterProfiles.
 */
import { type OrchestratorContext } from "./shared.js";
export declare function runAgent2b(ctx: OrchestratorContext): Promise<void>;
