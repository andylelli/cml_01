/**
 * Agent 2c: Location Profiles
 *
 * Extracted from mystery-orchestrator.ts. Runs generateLocationProfiles()
 * via executeAgentWithRetry when scoring is enabled, validates against schema,
 * and writes ctx.locationProfiles.
 */
import { type OrchestratorContext } from "./shared.js";
export declare function runAgent2c(ctx: OrchestratorContext): Promise<void>;
