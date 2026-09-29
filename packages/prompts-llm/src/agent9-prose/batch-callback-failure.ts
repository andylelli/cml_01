/**
 * A9G-D04 — a throw from the caller's `onBatchComplete`, carried past `generateProse`'s batch retry loop
 * unretried. The batch is already COMMITTED when the callback runs; a throw from it (e.g. the worker's NSD
 * parity check) used to land in the loop's catch, which regenerated or fell back and pushed the batch a
 * second time, and the run then died at `validateChapterCount` with a count that named neither cause.
 */
export class BatchCallbackFailure extends Error {
  constructor(readonly cause: unknown) {
    super(cause instanceof Error ? cause.message : String(cause));
  }
}

/** Run the caller's `onBatchComplete`; a throw leaves as a `BatchCallbackFailure`, which the retry loop re-throws. */
export async function runBatchCallback(call: () => Promise<void> | void): Promise<void> {
  try {
    await call();
  } catch (callbackError) {
    throw new BatchCallbackFailure(callbackError);
  }
}
