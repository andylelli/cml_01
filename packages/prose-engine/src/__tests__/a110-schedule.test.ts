import { afterEach, describe, expect, it } from "vitest";
import { buildBookContract } from "../book-contract.js";
import { checkContractRules } from "../contract-rules.js";
import { holdCulpritCluesLate, namesCulprit, rebalanceEvidence, withoutCulprit } from "../schedule.js";
import { completeProjects } from "./fixtures.js";

/**
 * A_110 N9 + M9 (PROSE_V2_SCHEDULE). Pure operations pinned on hand-built schedules; the archive pinned on what must
 * never happen (a clue lost, a rule broken) and what the flag must do (meanings deferred, the busiest chapter lighter).
 */
afterEach(() => {
  delete process.env.PROSE_V2_SCHEDULE;
  delete process.env.PROSE_V2_CONTRACT_FIXES;
});

describe("M9 load", () => {
  it("moves clues from the busiest chapter to lighter EARLIER ones, never before the first owned chapter", () => {
    const own = new Map([["a", 2], ...["b", "c", "d", "e", "f", "g"].map((id) => [id, 6] as [string, number])]);
    const moves = rebalanceEvidence(own, { chapters: [1, 2, 3, 4, 5, 6, 7, 8], decisive: new Set(), before: 8 });
    expect(moves.length).toBeGreaterThan(0);
    for (const m of moves) {
      expect(m.to).toBeLessThan(m.from);
      expect(m.to).toBeGreaterThanOrEqual(2);
    }
    const loads = [2, 3, 4, 5, 6, 7].map((c) => [...own.values()].filter((v) => v === c).length);
    expect(Math.max(...loads)).toBeLessThanOrEqual(Math.ceil(7 / 6) + 1);
  });
  it("moves decisive clues last and never a kept-late clue", () => {
    const own = new Map([["z_decisive", 5], ["late", 5], ["x", 5], ["y", 5], ["w", 5], ["a", 2]]);
    const moves = rebalanceEvidence(own, { chapters: [2, 3, 4, 5], decisive: new Set(["z_decisive"]), before: 6, keepLate: new Set(["late"]) });
    expect(moves.map((m) => m.id)).not.toContain("late");
    expect(moves[0]!.id).not.toBe("z_decisive");
  });
});

describe("N9 facts and meanings", () => {
  it("moves a culprit's early clues into the second half, in order, never to or past the test", () => {
    const own = new Map([["c1", 2], ["c2", 3], ["n1", 2], ["c3", 7]]);
    const moves = holdCulpritCluesLate(own, new Set(["c1", "c2", "c3"]), { chapters: [1, 2, 3, 4, 5, 6, 7, 8], before: 8 });
    expect(moves.map((m) => m.id)).toEqual(["c1", "c2"]);
    for (const m of moves) expect(m.to).toBeGreaterThanOrEqual(5);
    for (const m of moves) expect(m.to).toBeLessThan(8);
    expect(own.get("n1")).toBe(2);
    expect(own.get("c1")!).toBeLessThanOrEqual(own.get("c2")!);
  });
  it("names the culprit as someone, every form of the name", () => {
    expect(withoutCulprit("Witnesses confused Ada Vane for Tom; Vane's boots were wet; Ada left early.", ["Ada Vane"])).toBe(
      "Witnesses confused someone for Tom; someone's boots were wet; someone left early.",
    );
    expect(namesCulprit("the lock was picked", ["Ada Vane"])).toBe(false);
    expect(namesCulprit("Vane picked the lock", ["Ada Vane"])).toBe(true);
  });
});

describe("over the archive", () => {
  const projects = completeProjects();
  const build = (input: (typeof projects)[number]["input"], on: boolean) => {
    process.env.PROSE_V2_CONTRACT_FIXES = "1";
    if (on) process.env.PROSE_V2_SCHEDULE = "1";
    else delete process.env.PROSE_V2_SCHEDULE;
    return buildBookContract(input);
  };
  const surfaced = (c: ReturnType<typeof buildBookContract>) => new Set(c.scenes.flatMap((s) => s.mustSurface.map((m) => m.id)));

  it("ON: no clue is lost, no contract rule breaks, the busiest chapter is never heavier", () => {
    for (const p of projects) {
      const off = build(p.input, false);
      const on = build(p.input, true);
      for (const id of surfaced(off)) expect(surfaced(on).has(id)).toBe(true);
      expect(checkContractRules(on, on.bible.text)).toEqual([]);
      const max = (c: typeof on) => Math.max(0, ...c.scenes.map((s) => s.mustSurface.length));
      expect(max(on)).toBeLessThanOrEqual(max(off));
    }
  });

  it("ON: a culprit's clue before the test carries its meaning's chapter, and the test chapter says the meanings", () => {
    let deferredBooks = 0;
    for (const p of projects) {
      const on = build(p.input, true);
      const deferred = on.scenes.flatMap((s) => s.mustSurface.filter((m) => m.conclusionAt !== undefined).map((m) => ({ s, m })));
      if (deferred.length === 0) continue;
      deferredBooks++;
      for (const { s, m } of deferred) expect(m.conclusionAt).toBeGreaterThan(s.chapter);
      const test = on.scenes.find((s) => s.chapter === deferred[0]!.m.conclusionAt);
      expect(test?.conclusions?.length ?? 0).toBeGreaterThan(0);
    }
    expect(deferredBooks).toBeGreaterThan(projects.length / 2);
  });

  it("OFF: no clue carries a deferred meaning and the brief is byte-identical", () => {
    for (const p of projects.slice(0, 8)) {
      const off = build(p.input, false);
      expect(off.scenes.some((s) => s.mustSurface.some((m) => m.conclusionAt !== undefined) || s.conclusions)).toBe(false);
      process.env.PROSE_V2_SCHEDULE = "0";
      expect(buildBookContract(p.input).brief.text).toBe(off.brief.text);
    }
  });
});
