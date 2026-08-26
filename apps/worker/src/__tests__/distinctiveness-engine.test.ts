/**
 * ANALYSIS_74 §8 — the distinctiveness engine's deterministic core.
 *
 * Everything under test here is pure and free: dispersion (DE2), family classification (DE4), the
 * prior-run bridge (DE3) and the cell scheduler (DE5). The point of testing them hard is that they
 * are the half of the engine that must be right BEFORE a paid run depends on it — A_74 §8.6's
 * ablation ladder puts all of this on rungs 0–3, which cost nothing, precisely so that a read is
 * never spent discovering a wiring defect.
 */

import { describe, expect, it } from "vitest";
import { classifyMechanismFamily, familyOfRecord, familyVerdictOf, ledgerDispersion } from "../jobs/novelty-dispersion.js";
import { cellRepeatDepth, priorRunFingerprints } from "../jobs/prior-run-fingerprints.js";
import {
  SCHEDULER_FAMILIES,
  assignedFamilyFromTheme,
  cellDirective,
  resolveSchedulerMode,
  scheduleCell,
} from "../jobs/cell-scheduler.js";
import type { PriorRunRecord } from "../jobs/novelty-ledger.js";

const rec = (over: Partial<PriorRunRecord> = {}): PriorRunRecord => ({
  id: "r",
  title: "t",
  era: "1930s",
  location: "A Manor",
  crimeSubtype: "",
  deathMethod: "",
  axis: "temporal",
  falseAssumption: "",
  discrimMethod: "",
  discrimDesign: "",
  premise: "",
  ...over,
});

/**
 * The seven records actually in `apps/api/data/novelty-ledger.json` when §8 was written, reduced to
 * the fields that matter. This is the fixture the whole section argues from, so it is pinned here:
 * if a future change makes these seven stop reading as a monoculture, that is either a real
 * improvement or a broken classifier, and this test forces someone to decide which.
 *
 * Note WHERE the mechanism actually lives in these records: `discrimDesign`, not `deathMethod` or
 * `crimeSubtype`. That is why `familyOfRecord` reads every text field, and it is also why the old
 * ledger's avoidance lines were so weak — they were emitted from subtype, manner of death and axis,
 * and never from the one field that names the trick.
 */
const SHIPPED_SEVEN: PriorRunRecord[] = [
  rec({ id: "1", title: "The Sundial Shadow Conspiracy", crimeSubtype: "stabbing", deathMethod: "stabbed with a dagger", discrimDesign: "A controlled sundial shadow experiment is conducted by placing an identical watch face at the sundial" }),
  rec({ id: "2", title: "The Sundial's Silent Verdict", crimeSubtype: "poisoning with delayed effect", deathMethod: "poisoned with aconite concealed in ice cubes", discrimDesign: "A controlled demonstration measures the sundial's shadow delay under similar temperature conditions" }),
  rec({ id: "3", title: "The Thermally Sealed Study", crimeSubtype: "strangulation with cord in locked study", deathMethod: "strangled with a silk cord", discrimDesign: "Recreate the thermal conditions of the study's hearth fire with an identical brass bolt latch and mantel thermometer" }),
  rec({ id: "4", title: "The Garden Sundial Enigma", crimeSubtype: "brass latch delayed gate bolt murder", deathMethod: "struck with a heavy brass garden gate bolt", discrimDesign: "Demonstrate by controlled temperature simulation and gate latch observation that the garden gate's bolt cannot be released before the stated hour", premise: "a deception embedded in the thermal expansion delay of the garden gate's brass latch" }),
  rec({ id: "5", title: "The Bell Tower's Last Chime", crimeSubtype: "delayed acoustic timeline murder", deathMethod: "struck with a heavy brass choir bell clapper", discrimDesign: "A controlled ringing of the choir bell is staged, with prior measurement of the chime delay" }),
  rec({ id: "6", title: "The Sundial's Frozen Shadow", crimeSubtype: "struck with heavy copper sundial gnomon", deathMethod: "struck with heavy copper sundial gnomon", discrimDesign: "By comparing the exact stopped time on the watch with the sundial shadow position" }),
  rec({ id: "7", title: "The Fete's Frozen Hour", crimeSubtype: "strangulation at village fete", deathMethod: "strangled", discrimDesign: "A controlled demonstration comparing frozen sundial shadow positions before and after frost formation" }),
];
describe("DE4 — one family vocabulary", () => {
  it("classifies the clock/tide/thermal family as locked_room_timing", () => {
    expect(classifyMechanismFamily("the sundial gnomon")).toBe("locked_room_timing");
    expect(classifyMechanismFamily("rising tide at the sluice")).toBe("locked_room_timing");
    expect(classifyMechanismFamily("thermal expansion in a brass latch")).toBe("locked_room_timing");
  });

  it("returns unclassified rather than guessing, and never folds it into a real family", () => {
    expect(classifyMechanismFamily("")).toBe("unclassified");
    expect(classifyMechanismFamily(undefined, "  ")).toBe("unclassified");
    // A sentence with no mechanism vocabulary at all must not land on a family by accident.
    expect(classifyMechanismFamily("a quiet afternoon in the garden")).toBe("unclassified");
  });

  it("does not fire on ordinary mystery prose — 'the heat of the moment' is not a thermal device", () => {
    expect(classifyMechanismFamily("he acted in the heat of the moment")).toBe("unclassified");
  });

  it("prefers a stored family over re-deriving one, so a classifier change cannot rewrite history", () => {
    const stored = rec({ mechanismFamily: "impersonation", deathMethod: "struck by a clock weight" });
    expect(familyOfRecord(stored)).toBe("impersonation");
  });
});

describe("DE2 — dispersion sees what nearest-neighbour cannot", () => {
  const d = ledgerDispersion(SHIPPED_SEVEN);
  const field = (name: string) => d.fields.find((f) => f.field === name)!;

  /**
   * AXIS IS THE LOAD-BEARING NUMBER, and it is the one that is not classifier-dependent.
   *
   * `axis` is DECLARED by the CML; nothing infers it. Seven of seven temporal is a fact about the
   * corpus, and under uniform sampling from six axes P(all seven identical) is about 1.4e-5.
   *
   * `mechanismFamily` is INFERRED by the keyword scorer in this repo, and A_74 §8 originally reported
   * it as H=0.00 as well. That figure was an artifact of the first-match-wins bug fixed here: with the
   * weighted scorer the same records spread across three families. The corpus is still concentrated
   * and every one of these seven is a time-of-death trick by human reading — but the honest claim is
   * about the axis, and about the titles, not about a number a classifier produced.
   */
  it("reports the shipped corpus as a total collapse on AXIS, which nothing infers", () => {
    expect(field("axis").entropy).toBe(0);
    expect(field("axis").distinct).toBe(1);
  });

  it("no longer claims a total family collapse — that number was the classifier's, not the corpus's", () => {
    expect(field("mechanismFamily").distinct).toBeGreaterThan(1);
  });

  it("reports the SAME corpus as perfectly varied on free text — the illusion the ledger was reporting", () => {
    // Float, not integer: log(7)/log(7) lands on 0.9999999999999999. Asserting exact 1 here would be
    // a test that fails on arithmetic rather than on meaning.
    expect(field("crimeSubtype").entropy).toBeCloseTo(1, 6);
    expect(field("deathMethod").entropy).toBeCloseTo(1, 6);
  });

  it("marks free-text fields so a 1.00 there is never read as health", () => {
    expect(field("crimeSubtype").vocabulary).toBeNull();
    expect(field("axis").vocabulary).toBe(6);
    expect(field("mechanismFamily").vocabulary).toBe(14);
  });

  it("rises when the corpus actually spreads", () => {
    const mixed = [
      ...SHIPPED_SEVEN.slice(0, 2),
      rec({ id: "8", axis: "spatial", deathMethod: "found behind a concealed passage", crimeSubtype: "locked door bolt" }),
      rec({ id: "9", axis: "identity", deathMethod: "impersonated the victim for two days" }),
    ];
    expect(ledgerDispersion(mixed).fields.find((f) => f.field === "axis")!.entropy).toBeGreaterThan(0.4);
  });

  it("survives an empty ledger without dividing by zero", () => {
    const empty = ledgerDispersion([]);
    expect(empty.window).toBe(0);
    expect(empty.fields.every((f) => f.entropy === 0 && f.top === null)).toBe(true);
  });
});

describe("DE3 — the prior-run bridge", () => {
  it("projects records into the judge's corpus, labelled prior_run", () => {
    const fps = priorRunFingerprints(SHIPPED_SEVEN);
    expect(fps.length).toBe(7);
    expect(fps.every((f) => f.corpus === "prior_run")).toBe(true);
  });

  it("leaves the two unrecoverable fields EMPTY rather than filling them with an unmatchable value", () => {
    // A snake-cased sentence would never equal an LLM's short label, but it would LOOK populated.
    // See A_74 §8.1.3: a decoy field is worse than an absent one.
    const fps = priorRunFingerprints([rec({ deathMethod: "struck by the pendulum weight", falseAssumption: "The victim died when the clock said he did." })]);
    expect(fps[0].false_assumption_pattern).toBe("");
    expect(fps[0].inference_shape).toBe("");
  });

  it("drops unclassified records instead of letting them collide on the structural key", () => {
    expect(priorRunFingerprints([rec({ deathMethod: "a quiet afternoon" })])).toHaveLength(0);
  });

  it("reports repeat depth — the number severity() cannot produce", () => {
    const cell = cellRepeatDepth(SHIPPED_SEVEN, "temporal", "locked_room_timing");
    expect(cell.depth).toBeGreaterThan(0);
    expect(cell.window).toBe(7);
    const fresh = cellRepeatDepth(SHIPPED_SEVEN, "identity", "impersonation");
    expect(fresh.depth).toBe(0);
    expect(fresh.sinceLastUse).toBeNull();
  });
});

/**
 * REGRESSION — the first scheduled run classified as its own opposite.
 *
 * `The Elevator Cage Enigma` turns on an elevator cage and a scratch half an inch above a gate latch.
 * It was classified `locked_room_timing` because ONE incidental "clock" appeared in a paragraph of
 * premise prose, while `locked_room_key` matched nothing at all — its vocabulary had no word for an
 * elevator. First-match-wins over a long text, and a prose premise weighted equal to `crimeSubtype`.
 *
 * The consequence was not cosmetic: `familyOfRecord` feeds the scheduler, so while every run
 * classified as one family, the family coordinate could never advance and the engine would have
 * reported a monoculture it had already left.
 */
describe("DE4 — the weighted scorer, pinned against the bug that produced it", () => {
  const elevator = rec({
    axis: "spatial",
    crimeSubtype: "blunt force in a locked service lift",
    deathMethod: "struck with a heavy glass decanter",
    discrimDesign: "A scratch half an inch above the bottom latch of the elevator gate shows the cage was moved by hand",
    premise: "At a seaside hotel the lobby clock stood above the desk as the guests gathered, and the lift indicator read ground floor.",
  });

  it("is not decided by one incidental noun in a paragraph of prose", () => {
    expect(familyOfRecord(elevator)).toBe("locked_room_key");
  });

  it("weights the mechanism fields above the premise, and says so in the verdict", () => {
    const v = familyVerdictOf(elevator);
    expect(v.family).toBe("locked_room_key");
    expect(v.runnerUp?.family).toBe("locked_room_timing");
    // The runner-up must be strictly behind, not merely ordered behind.
    expect(v.score).toBeGreaterThan(v.runnerUp!.score);
  });

  it("counts DISTINCT hits, so repeating a word cannot brute-force a family", () => {
    // Five clocks score ONE (distinct hits); five different locked-room nouns score five.
    const spam = rec({ crimeSubtype: "clock clock clock clock clock", deathMethod: "strangled in a locked study; the door bolt and the latch were untouched and the key still stood in the keyhole" });
    expect(familyOfRecord(spam)).toBe("locked_room_key");
  });
});

describe("DE5 — the cell scheduler", () => {
  it("leaves the collapsed cell, on both coordinates", () => {
    const cell = scheduleCell(SHIPPED_SEVEN);
    expect(cell.axis).not.toBe("temporal");
    expect(cell.depth).toBe(0);
  });

  it("always differs from the previous run in at least two coordinates", () => {
    // The one-coordinate move is how a monoculture drifts while satisfying its constraint:
    // sundial -> bell tower changes the noun and nothing else.
    for (let n = 1; n <= SHIPPED_SEVEN.length; n += 1) {
      expect(scheduleCell(SHIPPED_SEVEN.slice(0, n)).differsFromPrevious.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("is deterministic — the same ledger always yields the same cell", () => {
    const a = scheduleCell(SHIPPED_SEVEN);
    const b = scheduleCell(SHIPPED_SEVEN);
    expect({ ...a, reason: "" }).toEqual({ ...b, reason: "" });
  });

  it("keeps walking rather than settling, when its own choices are fed back in", () => {
    const seen = new Set<string>();
    let corpus = [...SHIPPED_SEVEN];
    for (let i = 0; i < 6; i += 1) {
      const cell = scheduleCell(corpus);
      seen.add(`${cell.axis}|${cell.family}`);
      corpus = [...corpus, rec({ id: `s${i}`, axis: cell.axis, mechanismFamily: cell.family })];
    }
    // Six consecutive scheduled runs must not repeat a cell — that is the whole promise of the walk.
    expect(seen.size).toBe(6);
  });

  it("never schedules a family the generator's own validators would fight", () => {
    // substituted_body (the twins trope) and unconscious_act (hypnosis) are banned downstream; a
    // scheduler that can request an impossible cell converts a coverage gap into a retry storm.
    expect(SCHEDULER_FAMILIES).not.toContain("substituted_body" as never);
    expect(SCHEDULER_FAMILIES).not.toContain("unconscious_act" as never);
  });

  it("starts somewhere plain on an empty ledger, not at the strangest cell in the space", () => {
    const cell = scheduleCell([]);
    expect(cell.axis).toBe("temporal");
    expect(cell.depth).toBe(0);
  });
});

describe("DE5 — the directive is an obligation, not a prohibition", () => {
  const directive = cellDirective({ axis: "spatial", family: "locked_room_key", testShape: "physical_trace" });

  it("states what the case MUST be, and never asks for avoidance", () => {
    expect(directive).toContain("MUST turn on");
    expect(directive).toMatch(/locked room key/);
    expect(directive).not.toMatch(/\bavoid\b/i);
    expect(directive).not.toMatch(/\bdiverge\b/i);
  });

  it("demands the mechanism be REALIZED, because a name-check in chapter 2 is the failure mode", () => {
    expect(directive).toContain("REALIZED");
  });

  it("round-trips through the theme so downstream agents can read the assignment back", () => {
    expect(assignedFamilyFromTheme(`Some neutral brief. ${directive}`)).toBe("locked_room_key");
  });

  it("returns null for an ordinary theme — the common case, and not an error", () => {
    expect(assignedFamilyFromTheme("Golden Age country-house murder with a clock-tampering method.")).toBeNull();
    expect(assignedFamilyFromTheme(undefined)).toBeNull();
  });
});

describe("DE5 — the flag defaults off", () => {
  it("is off unless explicitly set, and shadow is reachable", () => {
    expect(resolveSchedulerMode({} as NodeJS.ProcessEnv)).toBe("off");
    expect(resolveSchedulerMode({ NOVELTY_CELL_SCHEDULER: "" } as NodeJS.ProcessEnv)).toBe("off");
    expect(resolveSchedulerMode({ NOVELTY_CELL_SCHEDULER: "shadow" } as NodeJS.ProcessEnv)).toBe("shadow");
    expect(resolveSchedulerMode({ NOVELTY_CELL_SCHEDULER: "on" } as NodeJS.ProcessEnv)).toBe("on");
  });
});
