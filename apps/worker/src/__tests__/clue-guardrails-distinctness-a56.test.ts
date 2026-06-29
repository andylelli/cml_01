import { describe, expect, it } from "vitest";
import { applyClueGuardrails } from "../jobs/agents/shared.js";

// A_56 5-A — P1.2 distinctness: when a collision group has >1 ESSENTIAL clue sharing a `points to`
// implication (a top cause of a flabby, repetitive middle), keep one as the anchor and DEMOTE the extras
// to "supporting" (repair-not-abort: never delete, never drop below the essential minimum).

const clue = (id: string, pointsTo: string, criticality: string, placement: string) => ({
  id,
  description: `clue ${id} description`,
  pointsTo,
  criticality,
  placement,
  sourceInCML: "constraint_space",
});

describe("applyClueGuardrails — P1.2 distinctness demotion (A_56 5-A)", () => {
  it("demotes one redundant essential clue (shared pointsTo) to supporting, keeping an anchor", () => {
    const clues = {
      clues: [
        clue("c1", "the gardener is guilty", "essential", "early"),
        clue("c2", "the gardener is guilty", "essential", "mid"), // redundant: same implication as c1
        clue("c3", "the window was forced", "essential", "mid"),
        clue("c4", "the clock was reset", "essential", "late"),
      ],
    };
    const res = applyClueGuardrails({} as any, clues as any);

    const byId = Object.fromEntries(clues.clues.map((c) => [c.id, c]));
    // Exactly one of the colliding pair is demoted; one stays as the essential anchor.
    expect([byId.c1.criticality, byId.c2.criticality].sort()).toEqual(["essential", "supporting"]);
    // Non-colliding essentials are untouched (and the minimum of 3 essentials is preserved: c3, c4 + one anchor).
    expect(byId.c3.criticality).toBe("essential");
    expect(byId.c4.criticality).toBe("essential");
    expect(res.fixes.some((f) => /Demoted \d+ redundant essential/.test(f))).toBe(true);
    expect(res.issues.some((i) => i.severity === "warning" && /'points to' implication/.test(i.message))).toBe(true);
  });

  it("leaves a legitimate single-essential + supporting-echo group untouched", () => {
    const clues = {
      clues: [
        clue("c1", "the gardener is guilty", "essential", "early"),
        clue("c2", "the gardener is guilty", "supporting", "mid"), // echo, not a redundant essential
        clue("c3", "the window was forced", "essential", "mid"),
        clue("c4", "the clock was reset", "essential", "late"),
      ],
    };
    applyClueGuardrails({} as any, clues as any);
    const byId = Object.fromEntries(clues.clues.map((c) => [c.id, c]));
    expect(byId.c1.criticality).toBe("essential"); // the lone essential anchor stays
    expect(byId.c2.criticality).toBe("supporting");
  });
});
