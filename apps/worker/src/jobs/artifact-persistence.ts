import { describeError } from "./agents/index.js";
import type { ArtifactCallback } from "./mystery-orchestrator.js";

/**
 * ORC-D13: an artifact write that fails used to end in `.catch(() => {})` — 14 of them in `generateMystery`,
 * the resume checkpoint among them — so a missing artifact left no trace. Still never fatal (the run itself is
 * fine), but it is now a warning in the report, naming the stage a resume could not restore.
 */
export function artifactPersister(onArtifact: ArtifactCallback | undefined, warnings: string[]) {
  return async (type: string, payload: unknown): Promise<void> => {
    if (!onArtifact || !payload) return;
    try {
      await onArtifact(type, payload);
    } catch (e) {
      warnings.push(`[artifact-save] '${type}' was NOT persisted: ${describeError(e)} — a resume cannot restore this stage.`);
    }
  };
}
