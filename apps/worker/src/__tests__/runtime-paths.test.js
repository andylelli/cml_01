import { describe, expect, it } from "vitest";
import { resolveWorkerRuntimePaths } from "../jobs/runtime-paths.js";
describe("resolveWorkerRuntimePaths", () => {
    it("derives workspace/worker/examples roots from module URL", () => {
        const moduleUrl = "file:///c:/CML/apps/worker/src/jobs/mystery-orchestrator.ts";
        const paths = resolveWorkerRuntimePaths(moduleUrl);
        const normalizedWorkspace = paths.workspaceRoot.replace(/\\/g, "/").toLowerCase();
        const normalizedWorker = paths.workerAppRoot.replace(/\\/g, "/").toLowerCase();
        const normalizedExamples = paths.examplesRoot.replace(/\\/g, "/").toLowerCase();
        expect(normalizedWorkspace).toContain("/cml");
        expect(normalizedWorker.endsWith("/cml/apps/worker")).toBe(true);
        expect(normalizedExamples.endsWith("/cml/examples")).toBe(true);
    });
    it("does not depend on process cwd", () => {
        const moduleUrl = "file:///c:/CML/apps/worker/src/jobs/mystery-orchestrator.ts";
        const before = resolveWorkerRuntimePaths(moduleUrl);
        const originalCwd = process.cwd();
        try {
            process.chdir("c:/");
            const after = resolveWorkerRuntimePaths(moduleUrl);
            expect(after).toEqual(before);
        }
        finally {
            process.chdir(originalCwd);
        }
    });
});
//# sourceMappingURL=runtime-paths.test.js.map