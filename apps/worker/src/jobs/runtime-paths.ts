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
