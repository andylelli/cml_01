/**
 * ANALYSIS_99 §10.13 — the bible's budget and the brief's law.
 *
 * These are the two tests that stop v2 becoming v1. The bible cannot grow past a budget, so there is
 * never a budgeter to drop the craft (WP-001 §4.2: `humour_guide` reached 10 of 10 chapters on one
 * run and 0 of 10 on the next two, because it was the only `optional` block in the prompt). The
 * brief cannot contain a prohibition, an example or a rate, because each is a measured failure:
 * VoiceSpec's 22.0-word average (0 of 10 chapters), A_67's copied coordinate (45 of 45), A_96 B1's
 * quoted ban (*"She did not elaborate"*, ten times).
 */
import { describe, expect, it } from "vitest";

import { buildBible, BIBLE_BUDGET, BIBLE_BUDGETS, estimateTokens } from "../bible.js";
import { briefLawViolations, buildBrief, BRIEF_BUDGET } from "../brief.js";
import { buildBookContract } from "../book-contract.js";
import { buildContractCore } from "../contract.js";
import { completeProjects, loadArchive } from "./fixtures.js";

const archive = loadArchive();
const complete = completeProjects();

describe.skipIf(archive.length === 0)("the bible, over the archive", () => {
  it("never exceeds its budget, and no section exceeds its own", () => {
    for (const project of archive) {
      const core = buildContractCore(project.input);
      const bible = buildBible(project.input, core);
      expect(bible.tokens, `${project.projectId}: ${bible.tokens} tokens`).toBeLessThanOrEqual(BIBLE_BUDGET);
      for (const section of bible.sections) {
        expect(section.tokens, `${project.projectId}/${section.key}`).toBeLessThanOrEqual(BIBLE_BUDGETS[section.key]);
      }
    }
  });

  it("the case and the cast are always there — they are what the writer cannot invent", () => {
    for (const project of complete) {
      const core = buildContractCore(project.input);
      const bible = buildBible(project.input, core);
      const keys = bible.sections.map((s) => s.key);
      expect(keys, project.projectId).toContain("case");
      expect(keys, project.projectId).toContain("cast");
      expect(bible.truncated, project.projectId).not.toContain("case");
      expect(bible.truncated, project.projectId).not.toContain("cast");
    }
  });

  it("names the culprit and the chapter that may say so", () => {
    for (const project of complete) {
      const core = buildContractCore(project.input);
      if (core.fairPlay.culprits.length === 0) continue;
      const bible = buildBible(project.input, core);
      expect(bible.text, project.projectId).toContain(core.fairPlay.culprits[0]!);
      expect(bible.text, project.projectId).toMatch(new RegExp(`chapter ${core.fairPlay.revealChapter}\\b`));
    }
  });

  it("clue ids appear in the evidence register and nowhere else", () => {
    for (const project of complete.slice(0, 12)) {
      const core = buildContractCore(project.input);
      const bible = buildBible(project.input, core);
      const evidence = bible.sections.find((s) => s.key === "clues")?.body ?? "";
      const others = bible.sections.filter((s) => s.key !== "clues").map((s) => s.body).join("\n");
      for (const scene of core.scenes) {
        for (const surface of scene.mustSurface) {
          if (evidence.includes(surface.id)) {
            expect(others, `${project.projectId}: ${surface.id} outside the register`).not.toContain(surface.id);
          }
        }
      }
    }
  });

  it("prints what the bible actually costs across the archive", () => {
    const sizes = complete.map((p) => buildBible(p.input, buildContractCore(p.input)).tokens);
    if (sizes.length === 0) return;
    const mean = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    console.info(
      `[bible] ${sizes.length} books — mean ${mean.toFixed(0)} tokens, min ${Math.min(...sizes)}, ` +
        `max ${Math.max(...sizes)}, budget ${BIBLE_BUDGET}`,
    );
    expect(mean).toBeGreaterThan(0);
  });
});

describe("the brief's law", () => {
  const profiles = [
    { name: "Edith Penhale", humourStyle: "dry_wit", humourLevel: 0.5 },
    { name: "Agatha Innes", humourStyle: "none", humourLevel: 0 },
    { name: "Violet Radcliffe", humourStyle: "polite_savagery", humourLevel: 0.8 },
  ];

  const core = buildContractCore({
    cml: {
      CASE: {
        culpability: { culprits: ["Agatha Innes"] },
        cast: [{ name: "Agatha Innes", role_archetype: "suspect" }, { name: "Violet Radcliffe", role_archetype: "victim" }],
        hidden_model: { mechanism: { description: "a clock advanced by twenty minutes" } },
      },
    },
    clues: { clues: [] },
    outline: {
      acts: [
        {
          scenes: [
            { sceneNumber: 1, act: 1, beat: "gathering", title: "Arrival", characters: [], setting: { location: "the hall" } },
            { sceneNumber: 2, act: 2, beat: "final_trap", title: "The Test", characters: [], setting: { location: "the hall" } },
            { sceneNumber: 3, act: 3, beat: "revelation", title: "After", characters: [], setting: { location: "the hall" } },
          ],
        },
      ],
    },
    cast: { characters: [{ name: "Agatha Innes" }, { name: "Violet Radcliffe" }] },
    profiles: { profiles },
    humourLevel: "classic",
  });

  it("carries no prohibition, no example and no rate, and fits the page", () => {
    const brief = buildBrief({ core, profiles, humourLevel: "classic" });
    expect(briefLawViolations(brief)).toEqual([]);
    expect(brief.tokens).toBeLessThanOrEqual(BRIEF_BUDGET);
  });

  it("every ask is a countable act, and the counts are the canon gap", () => {
    const brief = buildBrief({ core, profiles, humourLevel: "classic" });
    const page = brief.asks.filter((a) => a.section === "page").map((a) => a.line);
    expect(page.join(" ")).toMatch(/6 paragraphs in each chapter open on a line somebody speaks/);
    expect(page.join(" ")).toMatch(/at least four sentences/i);
    expect(page.join(" ")).toMatch(/at least three em-dashes/i);
  });

  it("a dry book opens fewer paragraphs on speech than a classic one", () => {
    const classic = buildBrief({ core, profiles, humourLevel: "classic" });
    const dry = buildBrief({ core, profiles, humourLevel: "dry" });
    expect(classic.text).toContain("6 paragraphs");
    expect(dry.text).toContain("4 paragraphs");
  });

  it("names the reveal chapter and what it owes", () => {
    const brief = buildBrief({ core, profiles, humourLevel: "classic" });
    expect(brief.text).toMatch(/Chapter 2 names Agatha Innes/);
  });

  it("gives every character a register, including the one who is not funny", () => {
    const brief = buildBrief({ core, profiles, humourLevel: "classic" });
    for (const p of profiles) expect(brief.text).toContain(p.name);
    expect(brief.text).toMatch(/Agatha Innes is in earnest throughout/);
  });

  it("REGRESSION: a character's own mannerisms stay in the bible, so the brief cannot inherit a rate", () => {
    // Agent 2b writes "her tone is formal but never stiff" and "occasionally punctuates her
    // observations"; quoting those in the brief put a prohibition and a rate into an instruction
    // this file is forbidden to write. The law test found it over the archive, not in review.
    const withProse = profiles.map((p) => ({
      ...p,
      signatureTic: "Let's not jump to conclusions just yet.",
      speechMannerisms: "formal but never stiff; occasionally punctuated with a cutting remark",
    }));
    const brief = buildBrief({ core, profiles: withProse, humourLevel: "classic" });
    expect(briefLawViolations(brief)).toEqual([]);
    expect(brief.text).not.toContain("never stiff");
  });

  it("a book with no profiles still produces a lawful brief", () => {
    const brief = buildBrief({ core, profiles: [], humourLevel: "none" });
    expect(briefLawViolations(brief)).toEqual([]);
    expect(brief.asks.length).toBeGreaterThan(0);
  });
});

describe.skipIf(complete.length === 0)("the brief's law holds over every archived book", () => {
  it("no brief anywhere carries a prohibition, an example or a rate", () => {
    for (const project of complete) {
      const contract = buildBookContract(project.input);
      const problems = briefLawViolations(contract.brief);
      expect(problems, `${project.projectId}: ${problems.join(" | ")}`).toEqual([]);
    }
  });

  it("prints what the brief costs, and what a whole prompt prefix costs", () => {
    const rows = complete.map((p) => {
      const contract = buildBookContract(p.input);
      return { brief: contract.brief.tokens, bible: contract.bible.tokens };
    });
    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
    console.info(
      `[brief] mean ${mean(rows.map((r) => r.brief)).toFixed(0)} tokens (budget ${BRIEF_BUDGET}); ` +
        `bible + brief mean ${mean(rows.map((r) => r.bible + r.brief)).toFixed(0)} — v1's fixed prefix is ~23,600 by chapter 10`,
    );
    expect(rows.length).toBeGreaterThan(0);
  });
});

describe("the token estimate is the same arithmetic v1 uses", () => {
  it("chars over four, rounded up", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens("abcd")).toBe(1);
    expect(estimateTokens("abcde")).toBe(2);
  });
});
