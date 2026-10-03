/**
 * Agent 9: prose.
 *
 * Owner decision 1 (2026-09-30): the v1 engine is retired. Since 2026-09-25 the engine was v2
 * (`agent9-v2/run.ts`, chapter per call) behind `PROSE_ENGINE=v2`; the 8,700 lines of v1 below its early
 * return — batch generation, the regen ladder, the deterministic post-passes, the release-gate audit — are
 * deleted, not kept as a fallback, and `PROSE_ENGINE` is no longer read. The replay fixtures were re-based
 * onto a v2 recording first (`eval/replay`, `resume-1790796774319`).
 *
 * Writes to ctx: prose (and warnings / errors).
 */
import type { OrchestratorContext } from "./shared.js";
import { runProseEngineV2 } from "./agent9-v2/run.js";

export async function runAgent9(ctx: OrchestratorContext): Promise<void> {
  await runProseEngineV2(ctx);
}
