import { describe, expect, it } from "vitest";

import { clearShutdownFlush, registerShutdownFlush, shutdownFlushRuns } from "../process-guards.js";

/**
 * ORC-12 / ORC-D09 — the shutdown flush was one slot. A second concurrent run replaced the first's
 * flush, and the first run's `finally` then cleared the second's: a crash after that flushed nobody.
 */
describe("shutdown flush registry", () => {
  it("keeps concurrent runs' flushes separate, and a run clears only its own", () => {
    registerShutdownFlush("run-a", async () => {});
    registerShutdownFlush("run-b", async () => {});
    expect(shutdownFlushRuns().sort()).toEqual(["run-a", "run-b"]);
    clearShutdownFlush("run-a"); // run A's finally
    expect(shutdownFlushRuns()).toEqual(["run-b"]);
    clearShutdownFlush("run-b");
    expect(shutdownFlushRuns()).toEqual([]);
  });
});
