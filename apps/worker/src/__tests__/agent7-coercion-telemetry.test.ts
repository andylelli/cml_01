/**
 * R4 step 4 (architecture/REVIEW_01.md) — Agent 7 coercion counters.
 *
 * These counters are the ONLY admissible evidence for S7 ("retire coercion sites proven dead").
 * The bar S7 has to clear is "this helper fired zero times across real runs on the structured-output
 * arm" — which means the counter itself has to be trustworthy in two directions:
 *
 *   1. it must count when coercion fires (or S7 deletes a live safety net), and
 *   2. it must emit a ZERO rather than nothing when coercion never fires (or "no telemetry" is
 *      indistinguishable from "no firings" — the silent-failure shape REVIEW §2.4 is about).
 */

import { describe, expect, it } from "vitest";

import {
  coerceNarrativeSceneBeats,
  emitAgent7CoercionTelemetry,
  hoistMisplacedSceneFields,
  recordAgent7Coercion,
} from "../jobs/agents/agent7-run.js";
import type { OrchestratorContext } from "../jobs/agents/shared.js";

const ctxWithWarnings = (): OrchestratorContext =>
  ({ warnings: [] as string[] }) as unknown as OrchestratorContext;

describe("recordAgent7Coercion", () => {
  it("accumulates across call sites rather than overwriting", () => {
    // Coercion runs at up to four points per run (first attempt, schema retry, remediation, final).
    // An assignment instead of an accumulation would under-report by however many paths ran.
    const ctx = ctxWithWarnings();
    recordAgent7Coercion(ctx, { beatsCoerced: 2, beatsDropped: 1 });
    recordAgent7Coercion(ctx, { fieldsHoisted: 3 });
    recordAgent7Coercion(ctx, { beatsCoerced: 1 });

    expect(ctx.agent7Coercion).toMatchObject({
      beatsCoerced: 3,
      beatsDropped: 1,
      fieldsHoisted: 3,
      firings: 3,
    });
  });

  it("does NOT count a firing when a helper changed nothing", () => {
    // The negative direction. If a no-op incremented `firings`, every run would look like the
    // coercion layer was load-bearing and S7 could never retire anything.
    const ctx = ctxWithWarnings();
    recordAgent7Coercion(ctx, { beatsCoerced: 0, beatsDropped: 0, fieldsHoisted: 0 });
    recordAgent7Coercion(ctx, {});

    expect(ctx.agent7Coercion?.firings).toBe(0);
  });

  it("stamps which structured-output arm produced the counts", () => {
    const ctx = ctxWithWarnings();
    recordAgent7Coercion(ctx, { beatsCoerced: 1 });
    expect(typeof ctx.agent7Coercion?.structuredOutput).toBe("boolean");
  });

  it("keeps counts on ctx, not module state, so batch runs cannot bleed into each other", () => {
    const a = ctxWithWarnings();
    const b = ctxWithWarnings();
    recordAgent7Coercion(a, { beatsCoerced: 5 });
    recordAgent7Coercion(b, { beatsCoerced: 1 });

    expect(a.agent7Coercion?.beatsCoerced).toBe(5);
    expect(b.agent7Coercion?.beatsCoerced).toBe(1);
  });
});

describe("emitAgent7CoercionTelemetry", () => {
  it("emits a line even when NOTHING was coerced", () => {
    // A zero that is never written is indistinguishable from a telemetry path that never ran.
    const ctx = ctxWithWarnings();
    emitAgent7CoercionTelemetry(ctx);

    const line = ctx.warnings.find((w) => w.includes("[R4] agent7 coercion telemetry"));
    expect(line).toBeDefined();
    expect(line).toContain("firings=0");
    expect(line).toContain("beats_coerced=0");
    expect(line).toContain("fields_hoisted=0");
  });

  it("reports the accumulated counts", () => {
    const ctx = ctxWithWarnings();
    recordAgent7Coercion(ctx, { beatsCoerced: 4, beatsDropped: 2, fieldsHoisted: 1 });
    emitAgent7CoercionTelemetry(ctx);

    const line = ctx.warnings.find((w) => w.includes("[R4] agent7 coercion telemetry"))!;
    expect(line).toContain("beats_coerced=4");
    expect(line).toContain("beats_dropped=2");
    expect(line).toContain("fields_hoisted=1");
    expect(line).toContain("firings=1");
  });

  it("survives a ctx with no score aggregator — telemetry must not abort a good run", () => {
    const ctx = ctxWithWarnings();
    expect(() => emitAgent7CoercionTelemetry(ctx)).not.toThrow();
  });
});

describe("the helpers the counters measure", () => {
  it("coerceNarrativeSceneBeats reports what it actually changed", () => {
    const narrative = {
      acts: [{ scenes: [{ beat: "revelation" }, { beat: "not-a-real-beat" }, { beat: "gathering" }] }],
    };
    const result = coerceNarrativeSceneBeats(narrative);

    // Canonical beats pass through; unrecognised ones are dropped rather than aborting the run.
    expect(result.dropped).toBeGreaterThan(0);
    expect(result.coerced + result.dropped).toBeGreaterThan(0);
  });

  it("hoistMisplacedSceneFields reports zero on an already-correct outline", () => {
    const narrative = {
      acts: [{ scenes: [{ purpose: "Establish the household", summary: "They gather.", setting: { location: "Hall" } }] }],
    };
    expect(hoistMisplacedSceneFields(narrative).hoisted).toBe(0);
  });

  it("hoistMisplacedSceneFields recovers fields the model nested under `setting`", () => {
    // agent7-scene-fields-nested-under-setting: this exact shape hard-aborted run a9c1e346.
    const narrative = {
      acts: [{ scenes: [{ setting: { location: "Hall", purpose: "Establish the household", summary: "They gather." } }] }],
    };
    expect(hoistMisplacedSceneFields(narrative).hoisted).toBeGreaterThan(0);
  });
});
