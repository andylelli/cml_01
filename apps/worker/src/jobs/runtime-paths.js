import { dirname, join, resolve as pathResolve } from "path";
import { fileURLToPath } from "url";
export function resolveWorkerRuntimePaths(moduleUrl) {
    const workspaceRoot = pathResolve(dirname(fileURLToPath(moduleUrl)), "..", "..", "..", "..");
    return {
        workspaceRoot,
        workerAppRoot: join(workspaceRoot, "apps", "worker"),
        examplesRoot: join(workspaceRoot, "examples"),
    };
}
//# sourceMappingURL=runtime-paths.js.map