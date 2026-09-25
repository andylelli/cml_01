/**
 * 17-hitting-90 P1.2–P1.6 — the reveal package v2 lacked and v1 had, on the case the engine pair was
 * read on (seed 23403, `canary_1790272530595`): the proof lands on the culprit, the weapon at the
 * confrontation, the mechanism sentence with a two-ended window, a confession of two counted lines,
 * and a naming gate that reads an accusation to the culprit's face.
 */
import { describe, expect, it } from "vitest";

import { buildBrief, mechanismOperation, revealOperation } from "../brief.js";
import { buildContractCore } from "../contract.js";
import { namesAsCulprit } from "../culprit.js";
import { completeProjects, loadArchive } from "./fixtures.js";

const PAIR_PROJECT = "canary_1790272530595";
const pair = loadArchive().find((p) => p.projectId === PAIR_PROJECT);

describe("the reveal package on the engine-pair case", () => {
  it("KNOWN-POSITIVE: the reveal chapter carries the weapon, the finding and the culprit from the means-link trace", () => {
    if (!pair) return;
    const core = buildContractCore(pair.input);
    const reveal = core.scenes.find((s) => s.chapter === core.roles.reveal)!;
    expect(reveal.proof).toEqual({
      weapon: "fencing foil",
      finding: "fresh blood and handling marks in victim's room",
      culprit: "Desmond Kestrel",
    });
  });

  it("the test is applied to a cleared innocent first and the culprit second", () => {
    if (!pair) return;
    const core = buildContractCore(pair.input);
    const carriers = core.scenes.filter((s) => s.testSubjects);
    expect(carriers.length).toBeGreaterThan(0);
    for (const scene of carriers) {
      expect(["Hector Gaunt", "Neville Lachlan", "Bertram Vance"]).toContain(scene.testSubjects!.innocent);
      expect(scene.testSubjects!.culprit).toBe("Desmond Kestrel");
    }
  });

  it("the window is the chronology's interval about the act, both ends spelled by THE CLOCK", () => {
    if (!pair) return;
    const core = buildContractCore(pair.input);
    const reveal = core.scenes.find((s) => s.chapter === core.roles.reveal)!;
    expect(reveal.opportunityWindow).toBeDefined();
    expect(reveal.opportunityWindow!.label).toMatch(/murder|entry|act/i);
    expect(mechanismOperation(core)).toMatch(/window, not an instant/);
    expect(mechanismOperation(core)).toContain(reveal.opportunityWindow!.value);
  });

  it("the confession is two counted lines, each with a slot, and the brief carries both operations", () => {
    if (!pair) return;
    const core = buildContractCore(pair.input);
    const op = revealOperation(core);
    expect(op).toMatch(/speaks twice/);
    expect(op).toMatch(/what Katherine Quayle was about to do/);
    expect(op).toMatch(/a person, a position or a place/);
    const brief = buildBrief({ core, humourLevel: pair.input.humourLevel });
    expect(brief.text).toContain("speaks twice");
    expect(brief.text).toContain("the route and the means, in one sentence");
  });

  it("no archived case throws, and a case without a linking trace carries no proof rather than a wrong one", () => {
    for (const project of completeProjects()) {
      const core = buildContractCore(project.input);
      const reveal = core.scenes.find((s) => s.chapter === core.roles.reveal)!;
      if (reveal.proof) {
        expect(reveal.proof.weapon.length).toBeGreaterThan(0);
        expect(core.fairPlay.culprits.some((c) => reveal.proof!.culprit.includes(c.split(/\s+/).slice(-1)[0]!))).toBe(true);
      }
    }
  });
});

describe("the naming gate reads the accusation to the culprit's face", () => {
  it("KNOWN-POSITIVE: arm B's chapter 8 sentence, which the gate read as naming nobody", () => {
    expect(
      namesAsCulprit(
        "Desmond Kestrel, you alone could have used the cave's secret window and the duplicate key. The evidence leads to you.",
        "Desmond Kestrel",
      ),
    ).toBe(true);
  });

  it("a stabbing is a verb of killing", () => {
    expect(namesAsCulprit("It was Kestrel who stabbed Katherine Quayle in her own room.", "Desmond Kestrel")).toBe(true);
  });

  it("handing somebody a foil is not an accusation", () => {
    expect(namesAsCulprit("Desmond Kestrel handed you the foil and said nothing.", "Desmond Kestrel")).toBe(false);
    expect(namesAsCulprit("Kestrel, you will want your gloves back before the session.", "Desmond Kestrel")).toBe(false);
  });
});

describe("17-hitting-90 P2.1 — the dramatised wound (WP-001 O2)", () => {
  it("KNOWN-POSITIVE: on the engine-pair case one first-half chapter stages the victim and the culprit before the death", () => {
    if (!pair) return;
    const core = buildContractCore(pair.input);
    const carriers = core.scenes.filter((s) => s.wound);
    expect(carriers).toHaveLength(1);
    const scene = carriers[0]!;
    expect(scene.chapter).toBeGreaterThanOrEqual(2);
    expect(scene.chapter).toBeLessThanOrEqual(Math.floor(core.scenes.length / 2));
    expect(scene.wound).toMatchObject({ victim: "Katherine Quayle", culprit: "Desmond Kestrel" });
    if (scene.wound!.accused) expect(scene.wound!.accused).not.toBe("Desmond Kestrel");
  });

  it("every archived case with a victim and a culprit stages exactly one wound, never on the reveal or after it", () => {
    for (const project of completeProjects()) {
      const core = buildContractCore(project.input);
      const carriers = core.scenes.filter((s) => s.wound);
      if (!core.fairPlay.victim || core.fairPlay.culprits.length === 0 || core.scenes.length < 4) continue;
      expect(carriers.length, project.projectId).toBe(1);
      expect(carriers[0]!.chapter, project.projectId).toBeLessThan(core.roles.reveal);
    }
  });
});
