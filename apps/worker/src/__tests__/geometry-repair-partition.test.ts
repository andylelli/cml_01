/**
 * X1 (architecture/REVIEW_05.md §12.1) — every geometry violation code has a decision recorded.
 *
 * The 08-04 run reported `false_solution_absent (ch6)` and nothing acted on it, which was correct
 * behaviour and completely indistinguishable, on the report, from a violation that had been handled
 * and failed. This test is the thing that keeps that state visible: a code added to `accept.ts`
 * without being routed to a pass or listed with a reason fails here rather than joining a silent
 * bucket.
 */

import { describe, expect, it } from "vitest";
import {
  GEOMETRY_CODES_WITHOUT_PROSE_REPAIR,
  GEOMETRY_CODES_WITH_OWN_PASS,
  GEOMETRY_VIOLATION_CODES,
} from "@cml/story-geometry";

import { GEOMETRY_CODES_NEEDING_MODIFY, GEOMETRY_DEFECT_KIND_BY_CODE } from "../jobs/agents/agent9-run.js";

describe("geometry repair partition (X1)", () => {
  it("routes or excuses every violation code, with no overlap", () => {
    const reused = Object.keys(GEOMETRY_DEFECT_KIND_BY_CODE);
    const ownPass = [...GEOMETRY_CODES_WITH_OWN_PASS];
    const excused = Object.keys(GEOMETRY_CODES_WITHOUT_PROSE_REPAIR);
    const all = [...reused, ...ownPass, ...excused];

    expect([...all].sort()).toEqual([...GEOMETRY_VIOLATION_CODES].sort());
    // A code in two buckets means two answers to "what happens to this?".
    expect(new Set(all).size).toBe(all.length);
  });

  it("keeps the code list in step with the codes accept.ts actually emits", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(new URL("../../../../packages/story-geometry/src/accept.ts", import.meta.url), "utf8"),
    );
    const emitted = new Set([...source.matchAll(/code:\s*"([a-z_]+)"/g)].map((m) => m[1]));
    expect([...emitted].sort()).toEqual([...GEOMETRY_VIOLATION_CODES].sort());
  });

  /**
   * N7 — the modify partition is a SUBSET of the reused map, not a third bucket.
   *
   * The apply loop only ever sees violations whose code is a key of `GEOMETRY_DEFECT_KIND_BY_CODE`;
   * everything else is filtered out before any channel is chosen. So a code listed as "needs the
   * modify channel" but missing from the map would not be routed anywhere — it would read like a
   * decision and behave like the silent bucket X1 exists to abolish.
   */
  it("routes every modify-channel code through the reuse map it is filtered by (N7)", () => {
    for (const code of GEOMETRY_CODES_NEEDING_MODIFY) {
      expect(GEOMETRY_DEFECT_KIND_BY_CODE[code], code).toBeDefined();
    }
    // And each of them is a real emitted code, not a stale name kept alive by a Set literal.
    for (const code of GEOMETRY_CODES_NEEDING_MODIFY) {
      expect([...GEOMETRY_VIOLATION_CODES], code).toContain(code);
    }
  });

  it("gives a reason, not just a name, for each code nothing can repair", () => {
    for (const [code, reason] of Object.entries(GEOMETRY_CODES_WITHOUT_PROSE_REPAIR)) {
      expect(reason.length, code).toBeGreaterThan(40);
    }
    // The one that motivated the item is a real gap and says so, rather than being excused as
    // structurally unrepairable like the outline- and case-level codes around it.
    expect(GEOMETRY_CODES_WITHOUT_PROSE_REPAIR.false_solution_absent).toMatch(/X1/);
  });
});
