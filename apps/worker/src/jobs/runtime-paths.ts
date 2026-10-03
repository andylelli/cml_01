import { dirname, join, resolve as pathResolve } from "path";
import { fileURLToPath } from "url";

export type WorkerRuntimePaths = {
  workspaceRoot: string;
  workerAppRoot: string;
  examplesRoot: string;
};

export function resolveWorkerRuntimePaths(moduleUrl: string): WorkerRuntimePaths {
  const workspaceRoot = pathResolve(dirname(fileURLToPath(moduleUrl)), "..", "..", "..", "..");

  return {
    workspaceRoot,
    workerAppRoot: join(workspaceRoot, "apps", "worker"),
    examplesRoot: join(workspaceRoot, "examples"),
  };
}

/**
 * The worker's runtime paths, resolved ONCE from this module's location (jobs/, the same depth as the
 * orchestrator). `resolveWorkerRuntimePaths(import.meta.url)` walks four directories up from its CALLER,
 * so a module one level deeper (jobs/pipeline/*) that called it would land in apps/ instead of the
 * workspace root. Import these instead of re-resolving (code review CR-25).
 */
export const WORKER_RUNTIME_PATHS: WorkerRuntimePaths = resolveWorkerRuntimePaths(import.meta.url);
