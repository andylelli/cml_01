import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { renderPlannedCulpritAlibi } from "../alibi-plan.js";
import { checkCaseTimelineDeception } from "../timeline-deception.js";

/**
 * A_90 Move 0 — THE PIN.
 *
 * ANALYSIS_90 §9.2 first claimed the timeline violation was "detected and not enforced". It was
 * wrong: every archived case that shipped with one started before the 2026-08-19 abort or the
 * 2026-09-04/05 vocabulary flags that make its window readable. What Move 0 actually needs is a pin
 * that DETECTION covers every shape the archive has produced with the production flags on — and,
 * with Move 2, that every one of those shapes is repaired rather than aborted.
 *
 * The fixture is every archived case that raises a timeline code (15 of 53), reduced to the fields
 * the check and the planner read. Regenerate with the scratch script named in the fixture.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(fs.readFileSync(path.join(here, "fixtures", "a90-archive-timeline.json"), "utf8"));

const FLAGS = ["AGENT3_TIMELINE_WINDOW_VOCABULARY", "AGENT3_ALIBI_UNREADABLE_GATE"] as const;
const saved: Record<string, string | undefined> = {};
beforeAll(() => {
  for (const f of FLAGS) {
    saved[f] = process.env[f];
    process.env[f] = "true";
  }
});
afterAll(() => {
  for (const f of FLAGS) {
    if (saved[f] === undefined) delete process.env[f];
    else process.env[f] = saved[f];
  }
});

describe("A_90 Move 0 — every archived timeline violator is detected with the production flags", () => {
  it("raises the same codes the archive audit recorded, case by case", () => {
    expect(fixture.violators).toHaveLength(15);
    for (const row of fixture.violators) {
      const codes = checkCaseTimelineDeception({ CASE: row.CASE }).map((v) => v.code).sort();
      expect(codes, row.projectId).toEqual([...row.codes].sort());
    }
  });

  it("covers all three shapes: apparent_not_covered, actual_covered, culprit_alibi_unreadable", () => {
    const seen = new Set(fixture.violators.flatMap((r: any) => r.codes));
    expect(seen).toEqual(new Set(["apparent_not_covered", "actual_covered", "culprit_alibi_unreadable"]));
  });
});

describe("A_90 Move 2 — every archived violator is repaired by the render, none aborted", () => {
  it("renders each culprit window from the two death times and the validator then passes", () => {
    let cleared = 0;
    for (const row of fixture.violators) {
      const cml = JSON.parse(JSON.stringify({ CASE: row.CASE }));
      const changes = renderPlannedCulpritAlibi(cml);
      expect(changes.length, `${row.projectId} should be rendered`).toBeGreaterThan(0);
      for (const change of changes) expect(change.after, row.projectId).not.toBe(change.before);
      if (checkCaseTimelineDeception(cml).length === 0) cleared += 1;
    }
    expect(cleared).toBe(fixture.violators.length);
  });

  it("keeps the location the model wrote wherever there was one", () => {
    let withLocation = 0;
    for (const row of fixture.violators) {
      const cml = JSON.parse(JSON.stringify({ CASE: row.CASE }));
      for (const change of renderPlannedCulpritAlibi(cml)) {
        const beforeLocation = /\b(?:in|at|on)\s+(the\s+)?[a-z]/i.test(change.before);
        if (beforeLocation && / in /.test(change.after)) withLocation += 1;
      }
    }
    // Not every archived window names a place; the ones that do must keep it.
    expect(withLocation).toBeGreaterThanOrEqual(8);
  });
});
