import { afterEach, describe, expect, it } from "vitest";
import { whereAndWhen } from "../bible.js";
import { buildBookContract } from "../book-contract.js";
import { checkContractRules } from "../contract-rules.js";
import { collectCheckerFindings } from "../findings.js";
import { completeProjects } from "./fixtures.js";
import type { ContractInput } from "../types.js";

/**
 * ANALYSIS_110 step 0 — PROSE_V2_CONTRACT_FIXES. Each defect has a witness: the archive with the flag OFF shows it (a
 * test that cannot fail on the old code proves nothing), and ON removes it. MEASURED before the fixes over the 31
 * distinct casts in the archive: the victim among the suspects to clear in 23, a wit owner off the page in 31, a wit
 * beat at the body, the test or the reveal in 31, the trait line in the every-call bible in 14.
 */
afterEach(() => {
  delete process.env.PROSE_V2_CONTRACT_FIXES;
});
const projects = completeProjects();
const build = (input: ContractInput, on: boolean) => {
  if (on) process.env.PROSE_V2_CONTRACT_FIXES = "1";
  else delete process.env.PROSE_V2_CONTRACT_FIXES;
  return buildBookContract(input);
};
const violated = (input: ContractInput, on: boolean, rule: string): number => {
  const c = build(input, on);
  return checkContractRules(c, c.bible.text).filter((v) => v.rule === rule).length;
};

describe("A_110 step 0 over the archive: every contract rule holds with the flag ON", () => {
  it("has archived projects to check", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  for (const rule of [
    "victim-not-cleared",
    "wit-owner-on-page",
    "no-wit-at-body-test-reveal",
    "trait-not-in-every-call-bible",
    "culprit-on-reveal-page",
  ]) {
    it(`${rule}: violated somewhere OFF (the witness), nowhere ON`, () => {
      const off = projects.reduce((n, p) => n + violated(p.input, false, rule), 0);
      const on = projects.reduce((n, p) => n + violated(p.input, true, rule), 0);
      expect(off).toBeGreaterThan(0);
      expect(on).toBe(0);
    });
  }

  it("ON: every archived contract passes every rule", () => {
    for (const p of projects) {
      const c = build(p.input, true);
      expect(checkContractRules(c, c.bible.text)).toEqual([]);
    }
  });

  it("ON: each person's trait is owned by one chapter, before the reveal", () => {
    for (const p of projects) {
      const c = build(p.input, true);
      const names = c.scenes.flatMap((s) => (s.beats.depth ? [s.beats.depth.name] : []));
      expect(new Set(names).size).toBe(names.length);
      for (const s of c.scenes) if (s.beats.depth) expect(s.chapter).toBeLessThan(c.roles.reveal);
    }
  });

  it("ON: the bible carries every relationship pair, the detective's first", () => {
    let moreThanBefore = 0;
    for (const p of projects) {
      const pairsIn = (text: string) =>
        (((text.split(/\n(?=## )/).find((s) => s.startsWith("## WHO IS WHAT TO WHOM")) ?? "").match(/^\s+\S.* & .*:/gm)) ?? []).length;
      const off = pairsIn(build(p.input, false).bible.text);
      const on = pairsIn(build(p.input, true).bible.text);
      expect(on).toBeGreaterThanOrEqual(off);
      if (on > off) moreThanBefore++;
    }
    expect(moreThanBefore).toBeGreaterThan(0); // known positive: run bcc0d637 kept 8 of 11 OFF
  });

  it("OFF: every prompt the flag touches is unchanged (bible and brief byte-identical to a flag-less build)", () => {
    for (const p of projects.slice(0, 8)) {
      delete process.env.PROSE_V2_CONTRACT_FIXES;
      const a = buildBookContract(p.input);
      process.env.PROSE_V2_CONTRACT_FIXES = "0";
      const b = buildBookContract(p.input);
      expect(b.bible.text).toBe(a.bible.text);
      expect(b.brief.text).toBe(a.brief.text);
    }
  });
});

describe("A_110 W1 — where and when, from the shapes the artifacts have", () => {
  const input = {
    setting: { setting: { location: { type: "Seaside Hotel", description: "x" }, era: { decade: "1930s" } } },
    locations: { primary: { name: "Cliffhaven Hotel", place: "Mevagissey", country: "England" } },
    temporal: { specificDate: { year: 1934, month: "January", day: 15 }, seasonal: { season: "winter" } },
  } as unknown as ContractInput;

  it("reads the real shapes into one line", () => {
    expect(whereAndWhen(input).line).toBe("Where and when: Cliffhaven Hotel, a seaside hotel at Mevagissey, England; January 1934, winter.");
    expect(whereAndWhen(input).unknown).toEqual([]);
  });

  it("reports what it cannot read instead of printing nothing (K4)", () => {
    const { unknown } = whereAndWhen({ setting: {}, locations: {}, temporal: {} } as unknown as ContractInput);
    expect(unknown).toEqual(["the place", "its town and country", "the year"]);
  });

  it("archive, ON: every bible with a location profile names a place in THE WORLD", () => {
    process.env.PROSE_V2_CONTRACT_FIXES = "1";
    let checked = 0;
    for (const p of projects) {
      if (!(p.input.locations as { primary?: unknown } | undefined)?.primary) continue;
      checked++;
      expect(buildBookContract(p.input).bible.text).toMatch(/## THE WORLD\nWhere and when: \S/);
    }
    expect(checked).toBeGreaterThan(0);
  });
});

describe("A_110 D5 — no example lists in the lines that leaked", () => {
  // The examples the specimen audit (A_110 §30.5) found on the page, and the one more of the same shape.
  const leaked = ["a movement, an object handled, a look away, the next question", "a door unlocked, a letter sent", "an apology, a thanks, a resentment", "a habit, a possession, a letter"];
  it("OFF carries them (the witness); ON the brief carries none", () => {
    // Not every book has a closure chapter, so the witness is the archive as a whole.
    const off = projects.map((p) => build(p.input, false).brief.text).join("\n");
    const on = projects.map((p) => build(p.input, true).brief.text).join("\n");
    for (const l of leaked) {
      expect(off).toContain(l);
      expect(on).not.toContain(l);
    }
  });
});

describe("A_110 L8 and §30.1 — findings", () => {
  const p = projects[0];
  const chapters = [
    { number: 1, title: "One", paragraphs: [
      "The chapter ended with the group in the lounge, the truth exposed.",
      "Eleanor considered the knife, already referenced in chapter 6, and set it down.",
      "\"We read it in chapter one,\" said Charles, laughing.",
    ] },
  ];
  it("ON: a chapter named in narration is a finding; a character may say it", () => {
    if (!p) return;
    process.env.PROSE_V2_CONTRACT_FIXES = "1";
    const c = buildBookContract(p.input);
    const hits = collectCheckerFindings(chapters, c, [1]).filter((f) => f.class === "chapter_reference");
    expect(hits.map((h) => h.quote)).toEqual([
      "The chapter ended with the group in the lounge, the truth exposed.",
      "Eleanor considered the knife, already referenced in chapter 6, and set it down.",
    ]);
    delete process.env.PROSE_V2_CONTRACT_FIXES;
    expect(collectCheckerFindings(chapters, buildBookContract(p.input), [1]).filter((f) => f.class === "chapter_reference")).toEqual([]);
  });
});
