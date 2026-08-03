/**
 * REVIEW_02 §3.1 — the R9 × R5 interaction.
 *
 * The defect: the parallel profile branch called `runAgent2b/2c/2d` directly instead of through the
 * orchestrator's `stage()` wrapper, which is where the resume skip lives. A resumed run with
 * `AGENT_PROFILES_PARALLEL=true` therefore re-ran all three profile agents whose artifacts had just
 * been restored, and overwrote them with fresh output. R5's acceptance test ("resume → 0 LLM calls
 * for stages 1-13") failed only when R9's flag was on, so it read as a resume bug.
 *
 * `selectPending` is the shared decision the branch now uses. These tests pin the two properties that
 * make it safe: it skips what is already present, and it still obeys the contiguous-prefix rule.
 */

import { describe, expect, it } from "vitest";

import { ResumeSkipTracker } from "../jobs/resume-hydration.js";
import type { OrchestratorContext } from "../jobs/agents/index.js";

const PROFILE_FIELDS = ["characterProfiles", "locationProfiles", "temporalContext"] as const;

const ctxWith = (fields: Partial<Record<string, unknown>>): OrchestratorContext =>
  fields as unknown as OrchestratorContext;

const populated = { profiles: [{ name: "Ada" }] };

describe("ResumeSkipTracker.selectPending — concurrent stages", () => {
  it("skips every profile stage whose artifact was restored (the resume case)", () => {
    const tracker = new ResumeSkipTracker();
    const ctx = ctxWith({
      characterProfiles: populated,
      locationProfiles: populated,
      temporalContext: populated,
    });

    const { pending, skipped } = tracker.selectPending(ctx, PROFILE_FIELDS);

    expect(pending).toEqual([]);
    expect(skipped).toEqual([...PROFILE_FIELDS]);
    expect(tracker.skipped).toEqual([...PROFILE_FIELDS]);
  });

  it("runs every profile stage on a fresh run — the flag must not change a normal run", () => {
    const tracker = new ResumeSkipTracker();
    const { pending, skipped } = tracker.selectPending(ctxWith({}), PROFILE_FIELDS);

    expect(pending).toEqual([...PROFILE_FIELDS]);
    expect(skipped).toEqual([]);
  });

  it("obeys the contiguous prefix INSIDE the group — one missing stage forces the rest to run", () => {
    const tracker = new ResumeSkipTracker();
    // 2b restored, 2c missing, 2d restored. 2d must still RUN: once any stage executes, no later
    // stage may be skipped, because a later stage can consume in-process state no artifact captures.
    const ctx = ctxWith({ characterProfiles: populated, temporalContext: populated });

    const { pending, skipped } = tracker.selectPending(ctx, PROFILE_FIELDS);

    expect(skipped).toEqual(["characterProfiles"]);
    expect(pending).toEqual(["locationProfiles", "temporalContext"]);
  });

  it("treats a present-but-empty artifact as absent", () => {
    const tracker = new ResumeSkipTracker();
    const { pending } = tracker.selectPending(
      ctxWith({ characterProfiles: {}, locationProfiles: [], temporalContext: "" }),
      PROFILE_FIELDS,
    );
    expect(pending).toEqual([...PROFILE_FIELDS]);
  });

  it("closes the prefix for stages checked AFTER the group", () => {
    const tracker = new ResumeSkipTracker();
    const ctx = ctxWith({ narrative: populated });

    tracker.selectPending(ctx, PROFILE_FIELDS); // all three must run → prefix exhausted
    // `narrative` is populated, but a stage ran before it, so it may not be skipped.
    expect(tracker.shouldSkip(ctx, "narrative")).toBe(false);
  });
});
