import { afterEach, describe, expect, it } from "vitest";
import { buildCaseScopedLockedFacts, deriveCaseChronology, identifyPeople, namesIn, parseClockTime } from "@cml/cml";
import { buildBookContract } from "../book-contract.js";
import { flattenScenes, resolveCastName, unwrapCase } from "../contract.js";
import { checkTraceRules } from "../trace-templates.js";
import { completeProjects, type ArchiveProject } from "./fixtures.js";
import type { BookContract, ContractInput, SceneContract } from "../types.js";

/**
 * ANALYSIS_111 §5, group C — WF-005's contract-construction defects (V2C-01…05, 07, 09…12) behind PROSE_V2_AUDIT_FIXES.
 *
 * Every stored case is a witness. Each test first shows the defect with the flag OFF (a test that cannot fail on the
 * old code proves nothing), then shows it gone with the flag ON. The archive is absent in a checkout without
 * `data/store.json`; then every suite skips. The probes that measured these over the same cases are in
 * `documentation/workflow/WF-005-probes/audit-contract/` (p1, p2, p13, p15, p17, p18).
 */
afterEach(() => {
  delete process.env.PROSE_V2_AUDIT_FIXES;
});

const projects = completeProjects();
const hasArchive = projects.length > 0;
const suite = hasArchive ? describe : describe.skip;

const build = (input: ContractInput, on: boolean): BookContract => {
  if (on) process.env.PROSE_V2_AUDIT_FIXES = "1";
  else delete process.env.PROSE_V2_AUDIT_FIXES;
  return buildBookContract(input);
};
const castOf = (p: ArchiveProject): string[] =>
  ((p.input.cast?.characters ?? []) as Array<{ name?: unknown }>).map((m) => String(m?.name ?? "").trim()).filter(Boolean);
const caseOf = (p: ArchiveProject) => unwrapCase(p.input.cml) as Record<string, any>;
const sceneAt = (c: BookContract, chapter: number): SceneContract | undefined => c.scenes.find((s) => s.chapter === chapter);
const testChapterOf = (c: BookContract): number => c.roles.discriminatingTest ?? c.roles.reveal;
const dial = (from: number, to: number): number => (((to - from) % 720) + 720) % 720;
/** Count the projects where `defect` holds. */
const count = (on: boolean, defect: (c: BookContract, p: ArchiveProject) => boolean): number =>
  projects.filter((p) => defect(build(p.input, on), p)).length;

suite("A_111 V batch C — contract construction, every stored case a witness", () => {
  it("V-1: the reveal's window contains the actual time of death and names no living innocent", () => {
    const wrong = (c: BookContract, p: ArchiveProject): boolean => {
      const window = sceneAt(c, c.roles.reveal)?.opportunityWindow;
      if (!window) return false;
      const cb = caseOf(p);
      const chrono = deriveCaseChronology(cb, (p.input.lockedFacts ?? []) as never);
      const at = new Map(chrono.events.map((e) => [e.id, e.dial] as const));
      const interval = chrono.intervals.find((i) => i.label === window.label && at.has(i.start) && at.has(i.end));
      const tod = parseClockTime(String(cb.hidden_model?.mechanism?.actual_time_of_death ?? ""));
      const misses = interval !== undefined && tod !== null && dial(at.get(interval.start)!, tod) > dial(at.get(interval.start)!, at.get(interval.end)!);
      const innocent = namesIn(window.label, identifyPeople(castOf(p))).some((n) => !c.fairPlay.culprits.includes(n) && n !== c.fairPlay.victim);
      return misses || innocent;
    };
    expect(count(false, wrong)).toBeGreaterThan(0); // MEASURED 2026-10-06 (p17, run registries): 30 of 64
    expect(count(true, wrong)).toBe(0);
    // ON, a window stated is a row of THE CLOCK as printed: the value the reveal must give both ends of.
    for (const p of projects) {
      const c = build(p.input, true);
      const window = sceneAt(c, c.roles.reveal)?.opportunityWindow;
      if (window) expect(c.chronology.rows.map((r) => r.value)).toContain(window.value);
    }
  });

  it("V-2: the crime chapter states two instants in clock order, never a window that reads backwards", () => {
    const backwards = (c: BookContract): boolean =>
      c.scenes.some((s) => {
        if (!s.timeWindow) return false;
        const a = parseClockTime(s.timeWindow.from);
        const b = parseClockTime(s.timeWindow.to);
        return a !== null && b !== null && dial(a, b) > 360;
      });
    expect(count(false, backwards)).toBeGreaterThan(0); // MEASURED: 31 of 64 (29 by raw dial, 2 across midnight)
    let stated = 0;
    for (const p of projects) {
      const c = build(p.input, true);
      expect(c.scenes.some((s) => s.timeWindow)).toBe(false);
      const mech = caseOf(p).hidden_model?.mechanism ?? {};
      for (const s of c.scenes) {
        if (!s.deathClock) continue;
        stated++;
        const a = parseClockTime(mech.actual_time_of_death);
        const ap = parseClockTime(mech.apparent_time_of_death);
        if (a !== null && ap !== null && a !== ap) expect(s.deathClock.order).toBe(dial(ap, a) < 360 ? "apparent-first" : "actual-first");
        const instants = c.chronology.rows.filter((r) => r.kind === "instant").map((r) => r.value);
        expect(instants).toContain(s.deathClock.actual);
        expect(instants).toContain(s.deathClock.apparent);
      }
    }
    expect(stated).toBeGreaterThan(0);
  });

  it("V-3: every decisive clue is staged strictly before the test, and the precedence rule says so", () => {
    const firstStaged = (c: BookContract, id: string): number | undefined =>
      [...c.scenes].sort((a, b) => a.chapter - b.chapter).find((s) => s.mustSurface.some((m) => m.id === id))?.chapter;
    const lateDecisive = (c: BookContract): boolean =>
      c.fairPlay.decisiveClueIds.some((id) => {
        const f = firstStaged(c, id);
        return f === undefined || f >= testChapterOf(c);
      });
    // The OFF witness, and the rule that let it through: precedence counted the test chapter itself.
    let heldWhileLate = 0;
    for (const p of projects) {
      const c = build(p.input, false);
      const rule = checkTraceRules(c).find((t) => t.rule === "decisive-clue-before-test");
      if (lateDecisive(c) && rule?.verdict === "holds") heldWhileLate++;
    }
    expect(heldWhileLate).toBeGreaterThan(0); // MEASURED: 19 of 64
    expect(count(false, lateDecisive)).toBeGreaterThan(0);
    // The strict rule, applied to the OFF contract, flags what the old rule passed — the rule's own known positive.
    let flagged = 0;
    for (const p of projects) {
      const c = build(p.input, false);
      process.env.PROSE_V2_AUDIT_FIXES = "1";
      if (lateDecisive(c) && checkTraceRules(c).find((t) => t.rule === "decisive-clue-before-test")?.verdict === "violated") flagged++;
    }
    expect(flagged).toBe(count(false, lateDecisive));
    // ON: none late, the rule holds, and "already on the page" points only at an earlier chapter.
    expect(count(true, lateDecisive)).toBe(0);
    for (const p of projects) {
      const c = build(p.input, true);
      expect(checkTraceRules(c).find((t) => t.rule === "decisive-clue-before-test")?.verdict).not.toBe("violated");
      for (const s of c.scenes) {
        for (const r of s.mayMention) {
          expect(r.firstChapter).toBeLessThan(s.chapter);
          expect(firstStaged(c, r.id)).toBe(r.firstChapter);
        }
      }
    }
  });

  it("V-3: clue obligations are unchanged except a decisive clue moved to before the test", () => {
    let moved = 0;
    for (const p of projects) {
      const off = build(p.input, false);
      const on = build(p.input, true);
      const test = testChapterOf(on);
      const pairs = (c: BookContract) => new Set(c.scenes.flatMap((s) => s.mustSurface.map((m) => `${m.id}@${s.chapter}`)));
      const a = pairs(off);
      const b = pairs(on);
      expect(b.size).toBe(a.size);
      for (const key of new Set([...a, ...b])) {
        if (a.has(key) === b.has(key)) continue;
        const [id, chapter] = [key.split("@")[0]!, Number(key.split("@")[1])];
        expect(on.fairPlay.decisiveClueIds).toContain(id);
        expect(a.has(key) ? chapter >= test : chapter < test).toBe(true);
        moved++;
      }
    }
    expect(moved).toBeGreaterThan(0); // MEASURED: 22 clues in 21 of 64
  });

  it("V-4: the test's innocent and culprit are both on the test chapter's page", () => {
    const offPage = (c: BookContract): boolean => {
      const s = sceneAt(c, testChapterOf(c));
      return Boolean(s?.testSubjects) && ![s!.testSubjects!.innocent, ...c.fairPlay.culprits].every((n) => s!.present.includes(n));
    };
    expect(count(false, offPage)).toBeGreaterThan(0); // MEASURED: innocent 36 of 64, culprit 11
    expect(count(true, offPage)).toBe(0);
  });

  it("V-6: no job line names a culprit as the one whose life the ending shows changed", () => {
    const culpritJob = (c: BookContract, p: ArchiveProject): boolean =>
      c.scenes.some((s) => {
        const v = s.job?.consequenceFor;
        if (!v) return false;
        const resolved = resolveCastName(v, castOf(p)) ?? v;
        return c.fairPlay.culprits.includes(resolved);
      });
    expect(count(false, culpritJob)).toBeGreaterThan(0); // MEASURED: 7 of the 7 outlines carrying the field
    expect(count(true, culpritJob)).toBe(0);
    for (const p of projects) {
      const c = build(p.input, true);
      for (const s of c.scenes) if (s.aftermath?.consequenceFor) expect(c.fairPlay.culprits).not.toContain(s.aftermath.consequenceFor);
    }
  });

  it("V-7: every clearance is on a page that has the suspect, and no victim or culprit is cleared", () => {
    const offPage = (c: BookContract): boolean =>
      c.scenes.some((s) => s.eliminationsAllowed.some((e) => e.name !== c.fairPlay.victim && !s.present.includes(e.name)));
    expect(count(false, offPage)).toBeGreaterThan(0); // MEASURED: 41 of 64 (78 rows)
    expect(count(true, offPage)).toBe(0);
    for (const p of projects) {
      const c = build(p.input, true);
      for (const s of c.scenes) for (const e of s.eliminationsAllowed) expect([c.fairPlay.victim, ...c.fairPlay.culprits]).not.toContain(e.name);
    }
  });

  it("V-8: the false solution's accused is never cleared before the chapter that accuses them — false-lead step 2's move", () => {
    const accusedOf = (p: ArchiveProject): string => String(caseOf(p).false_solution?.accused_suspect ?? "").replace(/\s+/g, " ").trim();
    const early = (c: BookContract, p: ArchiveProject): boolean => {
      const accused = resolveCastName(accusedOf(p), castOf(p)) ?? accusedOf(p);
      const fs = c.roles.falseSolution;
      return Boolean(accused) && fs !== null && c.scenes.some((s) => s.chapter < fs && s.eliminationsAllowed.some((e) => e.name === accused));
    };
    expect(count(false, early)).toBeGreaterThan(0); // MEASURED: 54 of 64
    expect(count(true, early)).toBe(0);
    // Pinned to false-lead.ts step 2: where PROSE_V2_FALSE_LEAD moves the accused's clearance to chapter B, the audit
    // clears them in B — or, when V-7 already placed that clearance on a later page of theirs, in that chapter, which is
    // still after the accusation and before the reveal (MEASURED: 51 of 54 in B, 3 in chapter 8 with B = 6).
    let inB = 0;
    let later = 0;
    for (const p of projects) {
      const lead = build({ ...p.input, falseLead: true }, false);
      const moves = lead.notes.map((n) => n.match(/^false lead: (.+)'s clearance moved from chapter \d+ to (\d+)/)).filter(Boolean);
      if (moves.length === 0) continue;
      const on = build(p.input, true);
      for (const m of moves) {
        const [name, b] = [m![1]!, Number(m![2])];
        const where = on.scenes.filter((s) => s.eliminationsAllowed.some((e) => e.name === name));
        expect(where.length).toBe(1);
        const s = where[0]!;
        expect(s.present).toContain(name);
        if (s.chapter === b) inB++;
        else {
          expect(s.chapter).toBeGreaterThan(b);
          expect(s.chapter).toBeLessThan(on.roles.reveal);
          later++;
        }
      }
    }
    expect(inB).toBeGreaterThan(later);
  });

  it("V-9: an outline name that is one cast member's is on the page; what matches nobody is reported", () => {
    const lost = (c: BookContract, p: ArchiveProject): boolean => {
      const names = castOf(p);
      return flattenScenes(p.input.outline).some((scene) => {
        const s = sceneAt(c, Number(scene.sceneNumber));
        return ((scene.characters ?? []) as unknown[]).some((raw) => {
          const n = String(raw ?? "").trim();
          const resolved = n && !names.includes(n) ? resolveCastName(n, names) : null;
          return resolved !== null && s !== undefined && !s.present.includes(resolved);
        });
      });
    };
    expect(count(false, lost)).toBeGreaterThan(0); // MEASURED: 4 of 64 cases, 40 chapters (the detective in 3)
    expect(count(true, lost)).toBe(0);
    const reported = projects.filter((p) => build(p.input, true).notes.some((n) => /outline names no cast member answers to/.test(n)));
    expect(reported.length).toBeGreaterThan(0);
  });

  it("V-9: the resolver takes a title off and nothing else", () => {
    const cast = ["Eleanor Hargrave", "Charles Pembroke", "Margaret Pembroke", "Reginald Gresham Jr."];
    expect(resolveCastName("Detective Eleanor Hargrave", cast)).toBe("Eleanor Hargrave");
    expect(resolveCastName("Inspector Hargrave", cast)).toBe("Eleanor Hargrave");
    expect(resolveCastName("Reginald Jr.", cast)).toBe("Reginald Gresham Jr.");
    expect(resolveCastName("Mr. Pembroke", cast)).toBeNull(); // two Pembrokes: nobody
    expect(resolveCastName("Eleanor Hargrave's maid", cast)).toBeNull();
    expect(resolveCastName("Eleanor Hargrave (referred to)", cast)).toBeNull();
    expect(resolveCastName("Victim", cast)).toBeNull();
  });

  it("V-17: no locked fact is cut from THE CLOCK, and every cut line is counted", () => {
    // The registry as runAgent3 leaves it: the device's facts, then the case-scoped (X51) facts appended last.
    const withRegistry = (p: ArchiveProject): ContractInput => ({
      ...p.input,
      lockedFacts: [...(p.input.lockedFacts ?? []), ...(buildCaseScopedLockedFacts(unwrapCase(p.input.cml)) as unknown as Array<Record<string, unknown>>)],
    });
    const clockOf = (c: BookContract): string => c.bible.text.split(/\n(?=## )/).find((s) => s.startsWith("## THE CLOCK")) ?? "";
    const lockedLost = (c: BookContract, p: ArchiveProject): boolean => {
      const clock = clockOf(c);
      const rows = new Set(c.chronology.rows.map((r) => r.value));
      return (withRegistry(p).lockedFacts ?? []).some((f) => {
        const v = String(f.value ?? "").replace(/\s+/g, " ").trim();
        return v !== "" && !rows.has(v) && !clock.split("\n").some((l) => l.trim().split(" — ")[0] === v);
      });
    };
    const lostOff = projects.filter((p) => lockedLost(build(withRegistry(p), false), p)).length;
    const lostOn = projects.filter((p) => lockedLost(build(withRegistry(p), true), p)).length;
    expect(lostOff).toBeGreaterThan(0); // MEASURED with the run registries: 18 of 64 lose 45 facts
    expect(lostOn).toBe(0);
    for (const p of projects) {
      const off = build(withRegistry(p), false);
      expect(off.bible.dropped).toBeUndefined();
      const on = build(withRegistry(p), true);
      const cut = Object.values(on.bible.dropped ?? {}).reduce((a, b) => a + (b ?? 0), 0);
      expect(on.notes.some((n) => n.startsWith("the bible cut "))).toBe(cut > 0);
      // The evidence count is exact: the lines THE EVIDENCE would carry, less the lines it does.
      const evidence = (on.bible.text.split(/\n(?=## )/).find((s) => s.startsWith("## THE EVIDENCE")) ?? "").split("\n").filter((l) => /^\s{2}\[/.test(l)).length;
      const owed = on.scenes.reduce((n, s) => n + s.mustSurface.filter((m) => m.observable || m.keyTerms.length).length, 0);
      if (!on.bible.truncated.includes("clues")) expect(on.bible.dropped?.clues ?? 0).toBe(owed - evidence);
    }
  });
});

describe("A_111 V batch C — no archive needed", () => {
  it("the flag is read at call time, and OFF leaves the bible without a dropped count", () => {
    const input: ContractInput = { cml: {}, outline: { acts: [] } };
    delete process.env.PROSE_V2_AUDIT_FIXES;
    expect(buildBookContract(input).bible.dropped).toBeUndefined();
    process.env.PROSE_V2_AUDIT_FIXES = "1";
    expect(buildBookContract(input).bible.dropped).toEqual({});
  });
});
