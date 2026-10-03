import { afterEach, describe, expect, it } from "vitest";
import { buildBookContract } from "../book-contract.js";
import { checkTraceRules, existence, notSuccession, precedence, response } from "../trace-templates.js";
import { completeProjects } from "./fixtures.js";
import type { BookContract, SceneContract } from "../types.js";

/**
 * A_110 0.3 — order rules as Declare templates, three-valued (WP-007 §2.4). Each template is pinned on a hand-built
 * trace in all three verdicts; each rule has a witness — a trace or an archived contract on which it fires.
 */
afterEach(() => {
  delete process.env.PROSE_V2_CONTRACT_FIXES;
  delete process.env.PROSE_V2_OPENING;
});

const scene = (chapter: number, extra: Partial<SceneContract> = {}): SceneContract =>
  ({ chapter, present: [], mustSurface: [], eliminationsAllowed: [], ...extra }) as unknown as SceneContract;
const is = (n: number) => (s: SceneContract) => s.chapter === n;

describe("the templates", () => {
  const trace = [1, 2, 3, 4].map((n) => scene(n));
  it("precedence: b only after (or with) a", () => {
    expect(precedence(trace, is(2), is(3))).toEqual([]);
    expect(precedence(trace, is(2), is(2))).toEqual([]);
    expect(precedence(trace, is(3), is(2))).toEqual(["ch2"]);
  });
  it("response: every a followed by b", () => {
    expect(response(trace, is(1), is(4))).toEqual([]);
    expect(response(trace, is(4), is(1))).toEqual(["ch4"]);
  });
  it("notSuccession: no b after a", () => {
    expect(notSuccession(trace, is(3), is(2))).toEqual([]);
    expect(notSuccession(trace, is(2), is(3))).toEqual(["ch3"]);
    expect(notSuccession(trace, is(9), is(3))).toEqual([]);
  });
  it("existence", () => {
    expect(existence(trace, is(4))).toEqual([]);
    expect(existence(trace, is(9))).toEqual(["book"]);
  });
});

const contract = (scenes: SceneContract[], over: Partial<BookContract> = {}): BookContract =>
  ({
    scenes,
    roles: { reveal: 3, discriminatingTest: 2 },
    fairPlay: { culprits: ["C"], victim: "V", decisiveClueIds: ["k"], mechanismSummary: "", revealChapter: 3 },
    ...over,
  }) as unknown as BookContract;
const verdict = (c: BookContract, rule: string) => checkTraceRules(c).find((t) => t.rule === rule)!;

describe("the rules: a witness for each, and unknown when the field is absent", () => {
  it("decisive-clue-before-test", () => {
    const shownAt = (n: number) => [1, 2, 3].map((ch) => scene(ch, ch === n ? { mustSurface: [{ id: "k" }] as never } : {}));
    expect(verdict(contract(shownAt(1)), "decisive-clue-before-test").verdict).toBe("holds");
    expect(verdict(contract(shownAt(3)), "decisive-clue-before-test")).toMatchObject({ verdict: "violated", where: ["k (ch2)"] });
    expect(verdict(contract(shownAt(1), { fairPlay: { culprits: [], victim: "V", decisiveClueIds: [], mechanismSummary: "", revealChapter: 3 } }), "decisive-clue-before-test").verdict).toBe("unknown");
  });

  it("no-clearance-after-reveal", () => {
    const clearedAt = (n: number) => [1, 2, 3, 4].map((ch) => scene(ch, ch === n ? { eliminationsAllowed: [{ name: "X" }] as never } : {}));
    expect(verdict(contract(clearedAt(2)), "no-clearance-after-reveal").verdict).toBe("holds");
    expect(verdict(contract(clearedAt(4)), "no-clearance-after-reveal")).toMatchObject({ verdict: "violated", where: ["ch4"] });
  });

  it("introduced-at-first-appearance", () => {
    const intro = { opening: { introductions: [{ name: "A", occupation: "x", pronoun: "she is" }] } } as unknown as Partial<SceneContract>;
    expect(verdict(contract([scene(1, { present: ["A"], ...intro }), scene(2, { present: ["A"] })]), "introduced-at-first-appearance").verdict).toBe("holds");
    expect(verdict(contract([scene(1, { present: ["A"] }), scene(2, { present: ["A"], ...intro })]), "introduced-at-first-appearance")).toMatchObject({ verdict: "violated", where: ["A (ch1)"] });
    expect(verdict(contract([scene(1, { present: ["A"] })]), "introduced-at-first-appearance").verdict).toBe("unknown");
  });

  it("victim-alive-before-found", () => {
    expect(verdict(contract([scene(1, { present: ["V"], victimAlive: true }), scene(2, { present: ["V"] })]), "victim-alive-before-found").verdict).toBe("holds");
    expect(verdict(contract([scene(1, { present: ["V"] }), scene(2, { present: ["V"], victimAlive: true })]), "victim-alive-before-found").verdict).toBe("violated");
    expect(verdict(contract([scene(1, { present: ["V"] })]), "victim-alive-before-found").verdict).toBe("unknown");
  });
});

describe("over the archive (MEASURED 2026-10-03: 64 contracts)", () => {
  const projects = completeProjects();
  it("decisive-clue-before-test fires on real contracts — a decisive clue not shown by the test", () => {
    const violated = projects.filter((p) => verdict(buildBookContract(p.input), "decisive-clue-before-test").verdict === "violated");
    expect(violated.length).toBeGreaterThan(0);
    expect(violated.length).toBeLessThan(projects.length / 4);
  });

  it("introductions: unknown with the opening flag off, held in every contract with it on", () => {
    for (const p of projects.slice(0, 12)) {
      delete process.env.PROSE_V2_OPENING;
      expect(verdict(buildBookContract(p.input), "introduced-at-first-appearance").verdict).toBe("unknown");
      process.env.PROSE_V2_OPENING = "1";
      expect(verdict(buildBookContract(p.input), "introduced-at-first-appearance").verdict).toBe("holds");
    }
  });

  it("every verdict reaches the run report: a violation or an unknown is a note", () => {
    const c = buildBookContract(projects[0]!.input);
    expect(c.notes.some((n) => n.startsWith("trace rules unknown:"))).toBe(true);
  });
});
