/**
 * Process-level guards — the missing safety net under a long, paid run.
 *
 * A_73 Part IV §1. `grep "process.on("` across BOTH apps returned nothing: no `unhandledRejection`,
 * no `uncaughtException`, no `SIGINT`/`SIGTERM`. On Node >= 15 an unhandled rejection TERMINATES the
 * process, so any rejection escaping a handler anywhere in a ~40-minute, ~£1.10 run killed it with
 * no partial saved and no diagnostic beyond a stack trace. Ctrl-C did the same.
 *
 * WHY THIS IS THE COMPLEMENT TO A_71 §1.1, NOT A DUPLICATE OF IT. That work made the partial report
 * honest AT WRITE TIME — `in_progress`, `incomplete: true`, a reason — so a stranded snapshot stops
 * reading as a finished run scoring 96. It did not make the write HAPPEN when the process dies
 * abruptly, and the orchestrator's own comment lists the ways it does: *"a crash, a hard-stop whose
 * own save fails, the 0xC0000409 process abort of A_70 §8.5, a power cut"*. This is the other half:
 * on the way down, flush once, say why, and use a distinct exit code so the cause is visible in a
 * shell log rather than inferred later from a stranded artifact.
 *
 * DESIGN NOTES
 *  - The flush is a REGISTRY, not an import. `savePartialReport` is a per-run closure over the
 *    orchestrator's aggregator and repository; there is no module-level "current run" to reach for,
 *    and inventing one would be a worse coupling than a two-line register/clear pair.
 *  - The handler is re-entrancy guarded. A rejection thrown *by the flush itself* must not recurse.
 *  - `uncaughtException` deliberately still exits. Node's docs are right that continuing after one
 *    leaves the process in an undefined state; the value here is the flush and the message, not
 *    survival.
 *  - Exit codes are distinct so a wrapper script can tell the three apart:
 *      17 unhandled rejection · 18 uncaught exception · 19 signal
 */

type FlushFn = () => Promise<void>;

/**
 * ORC-12 / ORC-D09: keyed by run. A single slot let a second concurrent run (the API starts one per
 * request) replace the first's flush, and the first run's `finally` then cleared the second's.
 */
const activeFlushes = new Map<string, FlushFn>();
let installed = false;
let shuttingDown = false;

/**
 * Register a run's partial-report writer. Called by the orchestrator once per run, immediately after
 * the closure exists; cleared, for that run only, in that function's `finally`.
 */
export const registerShutdownFlush = (runId: string, fn: FlushFn): void => {
  activeFlushes.set(runId, fn);
};

export const clearShutdownFlush = (runId: string): void => {
  activeFlushes.delete(runId);
};

/** Exposed for tests: the runs with a flush registered. */
export const shutdownFlushRuns = (): string[] => [...activeFlushes.keys()];

const FLUSH_TIMEOUT_MS = 10_000;

/** Every run in progress, together: one run's failing flush must not stop the others'. */
const flushAll = async (): Promise<void> => {
  const results = await Promise.allSettled([...activeFlushes.values()].map((fn) => fn()));
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  if (failed.length) {
    throw new AggregateError(failed.map((r) => r.reason), `${failed.length} of ${results.length} flush(es) failed`);
  }
};

const flushWithTimeout = async (label: string): Promise<void> => {
  if (activeFlushes.size === 0) {
    console.error(`[process-guards] ${label}: no run in progress — nothing to flush.`);
    return;
  }
  const flush = flushAll;
  // A hung filesystem must not turn "dying loudly" into "hanging forever".
  let timer: NodeJS.Timeout | undefined;
  try {
    await Promise.race([
      flush(),
      new Promise<void>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`flush exceeded ${FLUSH_TIMEOUT_MS}ms`)), FLUSH_TIMEOUT_MS);
      }),
    ]);
    console.error(`[process-guards] ${label}: partial report flushed.`);
  } catch (err) {
    console.error(`[process-guards] ${label}: partial flush FAILED —`, err);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const die = (label: string, detail: unknown, code: number): void => {
  if (shuttingDown) {
    // A second fault while already going down: say so and leave immediately, or we loop.
    console.error(`[process-guards] ${label} DURING shutdown — exiting now.`, detail);
    process.exit(code);
  }
  shuttingDown = true;
  console.error(`\n[process-guards] ${label}\n`, detail);
  void flushWithTimeout(label).finally(() => process.exit(code));
};

/**
 * Install the guards. Idempotent — safe to call from more than one entry point.
 *
 * `appName` appears in every message so a shell scrollback with an API window and a worker window
 * side by side says which one died.
 */
export const installProcessGuards = (appName: string): void => {
  if (installed) return;
  installed = true;

  process.on("unhandledRejection", (reason) => {
    die(`${appName}: UNHANDLED PROMISE REJECTION — the run is being terminated by Node`, reason, 17);
  });

  process.on("uncaughtException", (error) => {
    die(`${appName}: UNCAUGHT EXCEPTION`, error, 18);
  });

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => {
      die(`${appName}: received ${signal} — shutting down`, "(operator or service stop)", 19);
    });
  }
};
