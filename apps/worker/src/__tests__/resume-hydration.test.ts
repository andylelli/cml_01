/**
 * R5 (architecture/REVIEW_01.md) — durable-execution resume.
 *
 * Both directions throughout, per the REVIEW §7 conventions: every test that proves resume RESTORES
 * something has a partner proving it does NOT restore when it shouldn't. The dangerous failure here
 * is not "resume didn't work" (loud, one wasted run) — it is "resume half-worked", which produces a
 * story that is neither fresh nor faithful and no artifact says so.
 */

import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  applyResumeBundle,
  buildResumeDiagnostic,
  checkBuildFingerprint,
  computeBuildFingerprint,
  dropFromArtifact,
  isStageSatisfied,
  loadResumeBundle,
  missingSecondaryOutputs,
  readRunFingerprint,
  RESUME_ARTIFACT_NAMES,
  RESUME_FIELD_BY_ARTIFACT,
  ResumeSkipTracker,
  STAGE_SECONDARY_OUTPUTS,
  writeRunFingerprint,
  type ResumeBundle,
} from "../jobs/resume-hydration.js";
import { latestArtifact, loadArtifactStore, loadProjectSpec } from "../jobs/artifact-store.js";
import type { OrchestratorContext } from "../jobs/agents/shared.js";

const emptyCtx = (): OrchestratorContext => ({}) as unknown as OrchestratorContext;

const withTempWorkspace = (write: (root: string) => void): string => {
  const root = mkdtempSync(join(tmpdir(), "cml-resume-"));
  mkdirSync(join(root, "data"), { recursive: true });
  write(root);
  return root;
};

describe("applyResumeBundle", () => {
  it("restores every known artifact onto the ctx field the pipeline reads", () => {
    const ctx = emptyCtx();
    const bundle: ResumeBundle = { cml: { case: 1 }, cast: [{ name: "A" }], outline: { acts: [1] } };

    const applied = applyResumeBundle(ctx, bundle);

    expect(applied.restored.sort()).toEqual(["cast", "cml", "narrative"]);
    expect((ctx as any).cml).toEqual({ case: 1 });
    // `outline` is the artifact name; `narrative` is the ctx field. The mapping is the whole point.
    expect((ctx as any).narrative).toEqual({ acts: [1] });
  });

  it("treats a present-but-empty artifact as ABSENT so the stage re-runs", () => {
    // Half an artifact is worse than none: it passes a truthiness check and starves the stage below.
    const ctx = emptyCtx();
    const applied = applyResumeBundle(ctx, { cml: {}, cast: [], setting: "  ", clues: null as unknown });

    expect(applied.restored).toEqual([]);
    expect(applied.skippedEmpty.sort()).toEqual(["cast", "clues", "cml", "setting"]);
    expect((ctx as any).cml).toBeUndefined();
  });

  it("reports unrecognised keys instead of silently dropping them", () => {
    const applied = applyResumeBundle(emptyCtx(), { not_a_stage: { x: 1 } } as ResumeBundle);
    expect(applied.unknown).toEqual(["not_a_stage"]);
    expect(applied.restored).toEqual([]);
  });

  it("maps every artifact name to a distinct ctx field", () => {
    // A duplicated target would make one stage silently overwrite another's restore.
    const fields = Object.values(RESUME_FIELD_BY_ARTIFACT);
    expect(new Set(fields).size).toBe(fields.length);
    expect(RESUME_ARTIFACT_NAMES.length).toBe(fields.length);
  });
});

describe("isStageSatisfied", () => {
  it("is true only when the field carries real content", () => {
    const ctx = emptyCtx();
    expect(isStageSatisfied(ctx, "cml")).toBe(false);

    (ctx as any).cml = {};
    expect(isStageSatisfied(ctx, "cml")).toBe(false); // empty object is not a completed stage

    (ctx as any).cml = { CASE: { id: 1 } };
    expect(isStageSatisfied(ctx, "cml")).toBe(true);
  });

  it("counts a stage that ran in THIS process, not just a restored one", () => {
    // Same guard serves resume and normal execution — that is why it reads ctx, not the bundle.
    const ctx = emptyCtx();
    (ctx as any).prose = { chapters: [{ title: "One" }] };
    expect(isStageSatisfied(ctx, "prose")).toBe(true);
  });
});

describe("loadResumeBundle", () => {
  const store = [
    { project_id: "p1", artifact_type: "cml", payload: { v: 1 } },
    { project_id: "p1", artifact_type: "cml", payload: { v: 2 } }, // later row wins
    { project_id: "p1", artifact_type: "cast", payload_json: '[{"name":"A"}]' }, // string payload
    { projectId: "p1", type: "outline", payload: { acts: [1] } }, // camelCase spelling
    { project_id: "p2", artifact_type: "cml", payload: { other: true } },
  ];

  it("collects the latest payload per artifact for the requested project only", () => {
    const { bundle, found } = loadResumeBundle(store, "p1");

    expect(bundle.cml).toEqual({ v: 2 });
    expect(bundle.cast).toEqual([{ name: "A" }]); // JSON-string payload parsed
    expect(bundle.outline).toEqual({ acts: [1] }); // camelCase row still found
    expect(found).toContain("cml");
    expect(bundle).not.toHaveProperty("prose");
  });

  it("reports what the dead run never produced rather than failing", () => {
    const { missing } = loadResumeBundle(store, "p1");
    // A run that died before Agent 9 legitimately has no prose — that is the case resume exists for.
    expect(missing).toContain("prose");
    expect(missing).toContain("character_profiles");
  });

  it("returns an all-missing bundle for an unknown project, never another project's work", () => {
    const { found, missing } = loadResumeBundle(store, "does-not-exist");
    expect(found).toEqual([]);
    expect(missing.length).toBe(RESUME_ARTIFACT_NAMES.length);
  });
});

describe("artifact-store reader", () => {
  it("reads both store shapes and both payload spellings", () => {
    const root = withTempWorkspace((r) =>
      writeFileSync(
        join(r, "data", "store.json"),
        JSON.stringify({
          artifacts: [{ project_id: "p1", artifact_type: "cml", payload_json: '{"a":1}' }],
          specs: [{ project_id: "p1", spec: { theme: "A locked room" } }],
        }),
      ),
    );
    try {
      const store = loadArtifactStore(root);
      expect(latestArtifact(store, "p1", "cml")).toEqual({ a: 1 });
      expect(loadProjectSpec(root, "p1")).toEqual({ theme: "A locked room" });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("throws on a missing store rather than reporting an empty one", () => {
    // An empty read would look like "nothing to restore" and quietly re-run the full pipeline.
    const root = withTempWorkspace(() => {});
    try {
      expect(() => loadArtifactStore(root)).toThrow(/Artifact store not found/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("build fingerprint", () => {
  it("changes when a dist file changes, and is stable when nothing does", () => {
    const root = withTempWorkspace((r) => {
      mkdirSync(join(r, "apps", "worker", "dist"), { recursive: true });
      writeFileSync(join(r, "apps", "worker", "dist", "a.js"), "console.log(1)");
    });
    try {
      const first = computeBuildFingerprint(root);
      expect(first).not.toBeNull();
      expect(computeBuildFingerprint(root)).toBe(first);

      // Size is part of the digest, so a rewrite is detected without depending on clock resolution.
      writeFileSync(join(r_(root), "a.js"), "console.log(1); console.log(2);");
      expect(computeBuildFingerprint(root)).not.toBe(first);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("returns null when nothing is built, so an unbuilt tree is not a false alarm", () => {
    const root = withTempWorkspace(() => {});
    try {
      expect(computeBuildFingerprint(root)).toBeNull();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("round-trips through the sidecar file", () => {
    const root = withTempWorkspace(() => {});
    try {
      writeRunFingerprint(root, "run-1", "abc123");
      expect(readRunFingerprint(root, "run-1")).toBe("abc123");
      expect(readRunFingerprint(root, "no-such-run")).toBeNull();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("checkBuildFingerprint", () => {
  it("REFUSES a known mismatch — the mixed-generation run", () => {
    const verdict = checkBuildFingerprint("build-old", "build-new");
    expect(verdict.ok).toBe(false);
    expect(verdict.reason).toBe("mismatch");
    expect(verdict.detail).toContain("build-old");
    expect(verdict.detail).toContain("build-new");
  });

  it("allows a match", () => {
    expect(checkBuildFingerprint("same", "same")).toMatchObject({ ok: true, reason: "match" });
  });

  it("allows an unknown baseline, with a reason — runs predating the guard must stay resumable", () => {
    expect(checkBuildFingerprint(null, "current")).toMatchObject({ ok: true, reason: "no_baseline" });
  });

  it("allows an unbuilt tree rather than blocking on a fingerprint it cannot compute", () => {
    expect(checkBuildFingerprint("recorded", null)).toMatchObject({ ok: true, reason: "not_built" });
  });
});

describe("ResumeSkipTracker — contiguous prefix", () => {
  it("REFUSES to skip a later stage once an earlier one has had to run", () => {
    // The crash this prevents: a store with `hard_logic_devices` but no `cml` would skip Agent 3b
    // and run Agent 3 — and agent3-run.ts:84 reads ctx.hardLogicDirectives, which ONLY Agent 3b
    // writes, then immediately calls .hardLogicModes.join(). TypeError, on the most likely resume
    // case of all (a run that died inside Agent 3).
    const tracker = new ResumeSkipTracker();
    const ctx = emptyCtx();
    (ctx as any).setting = { era: "1950s" };
    (ctx as any).hardLogicDevices = { devices: [1] };
    // `cast` deliberately absent — this is the hole.

    expect(tracker.shouldSkip(ctx, "setting")).toBe(true);
    expect(tracker.shouldSkip(ctx, "cast")).toBe(false); // must run — closes the prefix
    // Present, but AFTER the hole. Skipping it is what caused the crash.
    expect(tracker.shouldSkip(ctx, "hardLogicDevices")).toBe(false);
  });

  it("skips a genuine contiguous prefix", () => {
    const tracker = new ResumeSkipTracker();
    const ctx = emptyCtx();
    (ctx as any).setting = { a: 1 };
    (ctx as any).cast = { b: 1 };

    expect(tracker.shouldSkip(ctx, "setting")).toBe(true);
    expect(tracker.shouldSkip(ctx, "cast")).toBe(true);
    expect(tracker.shouldSkip(ctx, "backgroundContext")).toBe(false);
    expect(tracker.skipped).toEqual(["setting", "cast"]);
  });

  it("skips nothing on a fresh run", () => {
    const tracker = new ResumeSkipTracker();
    const ctx = emptyCtx();
    expect(tracker.shouldSkip(ctx, "setting")).toBe(false);
    expect(tracker.skipped).toEqual([]);
    expect(tracker.degradedSignals()).toEqual([]);
  });
});

describe("ResumeSkipTracker — degraded signals", () => {
  it("names the derived state a skip silently destroyed", () => {
    // The SILENT bug: the coverage gate reads `ctx.coverageResult?.hasCriticalGaps`, so a missing
    // coverageResult reads as "no critical gaps" and the binding gate passes without evaluating.
    const tracker = new ResumeSkipTracker();
    const ctx = emptyCtx();
    (ctx as any).clues = { list: [1] }; // artifact restored...
    // ...but coverageResult, which Agent 5 also writes, is not persisted and so is absent.

    expect(tracker.shouldSkip(ctx, "clues")).toBe(true);
    expect(tracker.degraded.get("clues")).toEqual(["coverageResult"]);
    expect(tracker.degradedSignals()).toEqual(["coverageResult"]);
  });

  it("reports NO degradation when the derived state happens to be present", () => {
    const tracker = new ResumeSkipTracker();
    const ctx = emptyCtx();
    (ctx as any).clues = { list: [1] };
    (ctx as any).coverageResult = { hasCriticalGaps: false, uncoveredSteps: [] };

    expect(tracker.shouldSkip(ctx, "clues")).toBe(true);
    expect(tracker.degraded.size).toBe(0);
    expect(tracker.degradedSignals()).toEqual([]);
  });

  it("declares a secondary output for every stage that writes unpersisted derived state", () => {
    // Guards the table itself. Each entry corresponds to a real `ctx.X = ...` outside the artifact
    // set; missing one reintroduces exactly the bug this test file documents.
    expect(STAGE_SECONDARY_OUTPUTS.hardLogicDevices).toContain("hardLogicDirectives");
    expect(STAGE_SECONDARY_OUTPUTS.cml).toContain("noveltyAudit");
    expect(STAGE_SECONDARY_OUTPUTS.clues).toContain("coverageResult");
    expect(STAGE_SECONDARY_OUTPUTS.fairPlayAudit).toContain("coverageResult");
    expect(STAGE_SECONDARY_OUTPUTS.narrative).toContain("outlineCoverageIssues");
  });

  it("missingSecondaryOutputs reports only what is actually absent", () => {
    const ctx = emptyCtx();
    expect(missingSecondaryOutputs(ctx, "cml")).toEqual(["noveltyAudit"]);
    (ctx as any).noveltyAudit = { status: "pass" };
    expect(missingSecondaryOutputs(ctx, "cml")).toEqual([]);
    // A stage with no unpersisted outputs never reports degradation.
    expect(missingSecondaryOutputs(ctx, "setting")).toEqual([]);
  });
});

describe("buildResumeDiagnostic", () => {
  it("marks the run as partially accounted so the ledger cannot average it with fresh runs", () => {
    const diagnostic = buildResumeDiagnostic(
      "run-dead",
      { restored: ["cml", "cast"], skippedEmpty: ["clues"], unknown: [] },
      ["cml", "cast"],
    );

    expect(diagnostic.resumed_from).toBe("run-dead");
    expect(diagnostic.skipped_stages).toEqual(["cml", "cast"]);
    expect(diagnostic.empty_artifacts_ignored).toEqual(["clues"]);
    // The load-bearing field: a resumed run's cost covers only the stages that executed.
    expect(diagnostic.partial_cost_accounting).toBe(true);
  });

  it("records unavailable signals so a bypassed gate cannot read as a passed one", () => {
    const clean = buildResumeDiagnostic("r", { restored: [], skippedEmpty: [], unknown: [] }, []);
    expect(clean.signals_unavailable).toEqual([]);
    expect(clean.gates_fully_evaluated).toBe(true);

    const degraded = buildResumeDiagnostic(
      "r",
      { restored: ["clues"], skippedEmpty: [], unknown: [] },
      ["clues"],
      ["coverageResult"],
    );
    expect(degraded.signals_unavailable).toEqual(["coverageResult"]);
    // The flag a ledger must read before treating a resumed run as equivalent evidence.
    expect(degraded.gates_fully_evaluated).toBe(false);
  });
});

/** Path to the temp dist dir used above; kept as a helper so the test body reads cleanly. */
function r_(root: string): string {
  return join(root, "apps", "worker", "dist");
}

describe("RESUME_REDO — the matched-pair affordance (A_75 P1v)", () => {
  /**
   * A_74 §6.1 measured that no judge model resolves a gap under ~7 marks here, so the only instrument
   * that resolves a single mark is a human reading two books differing in exactly ONE thing. That
   * recommendation stood for days and was not executable: two fresh runs give two different books, and
   * `resume-run` refuses outright when every stage has an artifact — which a completed run always has.
   */
  const complete = RESUME_ARTIFACT_NAMES.map((name) => ({
    project_id: "pair",
    artifact_type: name,
    payload: { stage: name },
  }));

  it("without a redo, a completed run has nothing missing — the state that blocked the experiment", () => {
    const { found, missing } = loadResumeBundle(complete, "pair");
    expect(missing).toEqual([]);
    expect(found).toEqual(RESUME_ARTIFACT_NAMES);
  });

  it("redoing 'prose' keeps every upstream stage and drops only prose", () => {
    const { bundle, found, missing } = loadResumeBundle(complete, "pair", "prose");
    expect(missing).toEqual(["prose"]);
    // The property the pair rests on: upstream is the SAME PERSISTED PAYLOAD, not a re-derivation.
    expect(found).toEqual(RESUME_ARTIFACT_NAMES.filter((n) => n !== "prose"));
    expect(bundle.cml).toEqual({ stage: "cml" });
    expect(bundle.story_geometry).toEqual({ stage: "story_geometry" });
    expect(bundle.prose).toBeUndefined();
  });

  it("CASCADES downstream, which is a correctness property and not a convenience", () => {
    // Keeping story_geometry while re-running the outline would judge new chapters against a contract
    // derived from a DIFFERENT outline. A stage's downstream artifacts are only valid for the stage
    // that produced them.
    const { found, missing } = loadResumeBundle(complete, "pair", "outline");
    expect(missing).toEqual(["outline", "story_geometry", "prose"]);
    expect(found).not.toContain("story_geometry");
    expect(found).toContain("world_document");
  });

  it("redoing the first stage drops everything — equivalent to a fresh run, and allowed", () => {
    const { found, missing } = loadResumeBundle(complete, "pair", RESUME_ARTIFACT_NAMES[0]);
    expect(found).toEqual([]);
    expect(missing).toEqual(RESUME_ARTIFACT_NAMES);
  });

  it("an unknown stage name drops NOTHING rather than silently dropping everything", () => {
    // The dangerous failure for a paired experiment is a typo that resumes normally and produces a
    // second copy of the first arm — two identical books read as evidence the lever does nothing.
    // The CLI refuses on an unknown name; this pins that the library cannot quietly over-drop either.
    const { drop } = dropFromArtifact("not_a_stage" as never);
    expect(drop.size).toBe(0);
    const { missing } = loadResumeBundle(complete, "pair", "not_a_stage" as never);
    expect(missing).toEqual([]);
  });

  it("still reports a genuinely missing stage alongside a redone one", () => {
    const partial = complete.filter((r) => r.artifact_type !== "world_document");
    const { missing } = loadResumeBundle(partial, "pair", "prose");
    expect(missing).toEqual(["world_document", "prose"]);
  });
});
