/**
 * Culprit integrity — the answer to the mystery must exist, be a person, and not be the person the
 * story deliberately accuses in error.
 *
 * FOUND 2026-08-03 by `scripts/geometry-backtest.mjs` against run_20260802-1654 (external 80/100):
 * the model returned `culprits: []`, normalization filled it positionally with the first eligible
 * cast member — who was `false_solution.accused_suspect` — and the reviewer's complaint on that story
 * was verbatim *"Chapter 6 accuses Hale, but Hale is guilty."* `agent3-cml.ts` had instructed
 * "The accused_suspect MUST NOT be the real culprit" for months; nothing checked it.
 */

import { describe, expect, it } from "vitest";

import { validateCml } from "../validator.js";

const CAST = [
  { name: "Eleanor Voss", role_archetype: "Detective", culprit_eligibility: "eligible" },
  { name: "Dr. Mallory Finch", role_archetype: "Victim", culprit_eligibility: "ineligible" },
  { name: "Captain Ivor Hale", role_archetype: "Suspect", culprit_eligibility: "eligible" },
  { name: "Hugo Vane", role_archetype: "Suspect", culprit_eligibility: "eligible" },
];

const caseWith = (overrides: Record<string, unknown>) => ({
  CASE: {
    cast: CAST,
    culpability: { culprit_count: 1, culprits: ["Hugo Vane"] },
    false_solution: { accused_suspect: "Captain Ivor Hale" },
    ...overrides,
  },
});

/** Only the culprit-integrity errors — the fixture is deliberately not a complete, schema-valid CML. */
const culpritErrors = (payload: unknown): string[] =>
  validateCml(payload).errors.filter((e) => /culprit|accused_suspect/i.test(e));

describe("culprit integrity", () => {
  it("accepts a case that names a culprit who is not the falsely accused", () => {
    expect(culpritErrors(caseWith({}))).toEqual([]);
  });

  it("rejects a case that answers nothing", () => {
    const errors = culpritErrors(caseWith({ culpability: { culprit_count: 1, culprits: [] } }));
    expect(errors.join(" ")).toMatch(/culprits is empty/);
  });

  it("reports the empty list ONCE, not as five consequences of one cause", () => {
    const errors = culpritErrors(caseWith({ culpability: { culprit_count: 1, culprits: [] } }));
    expect(errors).toHaveLength(1);
  });

  it("rejects a false solution that accuses the culprit — the run-1654 defect", () => {
    const errors = culpritErrors(
      caseWith({ culpability: { culprit_count: 1, culprits: ["Captain Ivor Hale"] } }),
    );
    expect(errors.join(" ")).toMatch(/who is the culprit/);
  });

  it("rejects a culprit who is not in the cast", () => {
    const errors = culpritErrors(caseWith({ culpability: { culprit_count: 1, culprits: ["Nobody At All"] } }));
    expect(errors.join(" ")).toMatch(/not in CASE\.cast/);
  });

  it("rejects the victim and the detective as culprits", () => {
    expect(culpritErrors(caseWith({ culpability: { culprit_count: 1, culprits: ["Dr. Mallory Finch"] } })).join(" "))
      .toMatch(/who is the victim/);
    expect(culpritErrors(caseWith({ culpability: { culprit_count: 1, culprits: ["Eleanor Voss"] } })).join(" "))
      .toMatch(/who is the detective/);
  });

  it("rejects a culprit the cast marks ineligible", () => {
    const errors = culpritErrors(caseWith({ culpability: { culprit_count: 1, culprits: ["Dr. Mallory Finch"] } }));
    expect(errors.join(" ")).toMatch(/culprit_eligibility is "ineligible"/);
  });

  it("rejects a declared count that disagrees with the names", () => {
    const errors = culpritErrors(caseWith({ culpability: { culprit_count: 2, culprits: ["Hugo Vane"] } }));
    expect(errors.join(" ")).toMatch(/culprit_count is 2 but 1 culprit/);
  });

  it("matches names case- and whitespace-insensitively rather than by identity", () => {
    const errors = culpritErrors(
      caseWith({
        culpability: { culprit_count: 1, culprits: ["  captain ivor hale "] },
        false_solution: { accused_suspect: "Captain Ivor Hale" },
      }),
    );
    expect(errors.join(" ")).toMatch(/who is the culprit/);
  });
});

/**
 * The false-time invariant, enforced (A_71 · found reaching the page 2026-08-03).
 *
 * `checkTimelineDeception` was written in response to an external review whose headline complaint was
 * "the timeline is backwards", exported from its package — and called by nothing for two months. Run
 * `run_20260802-1818` (external 68/100) violated it in BOTH directions and shipped.
 */
describe("false-time deception, as a validation error", () => {
  const timelineErrors = (payload: unknown): string[] =>
    validateCml(payload).errors.filter((e) => /hidden_model\.mechanism \(/.test(e));

  const timedCase = (mechanism: Record<string, unknown>, alibi: string) => ({
    CASE: {
      cast: [
        { name: "Dr. Mallory Finch", role_archetype: "Victim", culprit_eligibility: "ineligible" },
        { name: "Hugo Vane", role_archetype: "Suspect", culprit_eligibility: "eligible", alibi_window: alibi },
      ],
      culpability: { culprit_count: 1, culprits: ["Hugo Vane"] },
      false_solution: { accused_suspect: "Captain Ivor Hale" },
      hidden_model: { mechanism },
    },
  });

  it("accepts a deception that actually protects the culprit", () => {
    // Staged 8:50 sits inside the culprit's accounted span; the real 10:15 falls outside it.
    const errors = timelineErrors(
      timedCase({ apparent_time_of_death: "8:50", actual_time_of_death: "10:15" }, "8:30 to 9:15 in the bar"),
    );
    expect(errors).toEqual([]);
  });

  it("rejects the run-1818 shape — backwards in both directions", () => {
    // Apparent 8:50 is OUTSIDE the window (so faking it incriminates him); actual 8:15 is INSIDE it
    // (so he could not have done it at all).
    const errors = timelineErrors(
      timedCase({ apparent_time_of_death: "ten minutes to nine", actual_time_of_death: "quarter past eight" }, "8:10 to 8:30 in the study"),
    );
    expect(errors.join(" ")).toMatch(/apparent_not_covered/);
    expect(errors.join(" ")).toMatch(/actual_covered/);
  });

  it("rejects a concealment that hides nothing", () => {
    const errors = timelineErrors(
      timedCase({ apparent_time_of_death: "9:00", actual_time_of_death: "9:00" }, "8:30 to 9:15 in the bar"),
    );
    expect(errors.join(" ")).toMatch(/times_identical/);
  });

  it("says nothing when the case does not fake a time — a generator that omits the fields is never blocked", () => {
    expect(timelineErrors(timedCase({ apparent_time_of_death: "", actual_time_of_death: "" }, "8:10 to 8:30"))).toEqual([]);
    expect(timelineErrors(timedCase({}, "8:10 to 8:30"))).toEqual([]);
  });

  it("says nothing when the times are unparseable rather than inventing a failure", () => {
    const errors = timelineErrors(
      timedCase({ apparent_time_of_death: "sometime after dinner", actual_time_of_death: "late" }, "8:10 to 8:30"),
    );
    expect(errors).toEqual([]);
  });
});
