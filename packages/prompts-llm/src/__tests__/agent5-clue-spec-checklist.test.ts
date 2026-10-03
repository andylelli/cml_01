/**
 * A5-15 / A5-Q07 — AGENT5_CLUE_SPEC_CHECKLIST. OFF: the checklist is `generateExplicitClueRequirements`'s.
 * ON: one line per `deriveClueSpec(cml).clueSlots` entry, with clue-spec's fields, in the same line format.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { deriveClueSpec } from "@cml/clue-spec";
import { buildCluePrompt } from "../agent5-clues.ts";
import { buildClueSpecChecklist } from "../agent5/clue-spec-checklist.ts";

const GOLDEN_CML = {
  CASE: {
    meta: { title: "The Stopped Regulator", crime_class: { category: "murder" } },
    death_method: "stabbed with a letter-opener",
    false_assumption: { type: "temporal", statement: "The study clock shows the true time of death." },
    culpability: { culprits: ["Edmund Pryce"] },
    hidden_model: { mechanism: { description: "Pryce advanced the regulator forty minutes before dinner to build his alibi." } },
    discriminating_test: {
      design: "Wind the regulator in front of the household and compare it against the church bell.",
      knowledge_revealed: "The regulator gains exactly forty minutes after it is wound.",
    },
    false_solution: {
      accused_suspect: "Clara Voss",
      supporting_points: ["Clara quarrelled with the victim at tea."],
      the_one_flaw: "Clara was seen at the lodge when the church bell struck nine.",
    },
    inference_path: {
      steps: [
        { observation: "The regulator's key lies on the wrong side of the mantel.", correction: "Someone wound the clock after the household retired." },
        { observation: "The church bell and the study clock disagree by forty minutes.", correction: "The time of death is forty minutes earlier than the clock shows." },
      ],
    },
    cast: [
      { name: "Edmund Pryce", culprit_eligibility: "eligible", motive_seed: "a forged codicil", evidence_sensitivity: ["brass filings on his cuff"] },
      { name: "Clara Voss", culprit_eligibility: "eligible", alibi_window: "8:40-9:20 at the lodge" },
      { name: "Thomas Hale", culprit_eligibility: "eligible", alibi_window: "8:30-9:30 in the cellar" },
      { name: "Mrs Abbott", culprit_eligibility: "ineligible" },
    ],
  },
};

type ParsedLine = { text: string; evidenceType: string; criticality: string; placement: string; category: string; step?: number; terms: string };

function parseChecklist(developer: string): { count: number; lines: ParsedLine[] } {
  const start = developer.indexOf("## Mandatory Clue Requirements (");
  const header = developer.slice(start).match(/^## Mandatory Clue Requirements \((\d+) required\)\n/);
  if (!header) throw new Error("checklist header missing");
  const rows = developer.slice(start + header[0].length).split("\n");
  const lines: ParsedLine[] = [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].startsWith("## ")) break;
    const m = rows[i].match(/^(\d+)\. (.*)$/);
    if (!m) continue;
    const a = rows[i + 1].match(/^ {3}→ (\w+) \| (\w+) \| (\w+) \| (\w+)(?: \| step (\d+))?(?: \| terms: (.*))?$/);
    if (!a) throw new Error(`no arrow line after: ${rows[i]}`);
    lines.push({ text: m[2], evidenceType: a[1], criticality: a[2], placement: a[3], category: a[4], step: a[5] ? Number(a[5]) : undefined, terms: a[6] ?? "" });
  }
  return { count: Number(header[1]), lines };
}

const developerFor = () => buildCluePrompt({ cml: GOLDEN_CML, clueDensity: "moderate", redHerringBudget: 1 }).developer;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("AGENT5_CLUE_SPEC_CHECKLIST", () => {
  it("OFF (unset or 0): the checklist is the legacy generateExplicitClueRequirements block", () => {
    vi.stubEnv("AGENT5_CLUE_SPEC_CHECKLIST", "");
    const unset = developerFor();
    vi.stubEnv("AGENT5_CLUE_SPEC_CHECKLIST", "0");
    expect(developerFor()).toBe(unset);

    const { count, lines } = parseChecklist(unset);
    // 2 steps x (obs + contra), contradiction anchor, mechanism, death-method tell, discriminating evidence,
    // culprit direct + unique-means + premeditation, 2 eliminations + the elimination chain.
    expect(count).toBe(14);
    expect(lines).toHaveLength(14);
    expect(unset).toContain("UNIQUELY had the means/skill/access/knowledge");
    expect(unset).toContain("premeditation or planning (a forged codicil)");
    expect(unset).not.toContain("the clincher");
    // the legacy inferCategory: "stabbed with a letter-opener" has no keyword, so it defaults to testimonial
    expect(lines.find((l) => l.text.includes("manner of death"))?.category).toBe("testimonial");
  });

  it("ON: one line per deriveClueSpec required slot, with clue-spec's fields", () => {
    vi.stubEnv("AGENT5_CLUE_SPEC_CHECKLIST", "1");
    const { count, lines } = parseChecklist(developerFor());
    const slots = deriveClueSpec(GOLDEN_CML).clueSlots;
    // 2 steps x (obs + contra), mechanism, method, discriminating evidence, culprit direct, 2 eliminations, flaw, clincher.
    expect(slots.length).toBe(12);
    expect(count).toBe(slots.length);
    expect(
      lines.map(({ evidenceType, criticality, placement, category, step, terms }) => ({ evidenceType, criticality, placement, category, step, terms })),
    ).toEqual(
      slots.map((s) => ({
        evidenceType: s.evidenceType,
        criticality: s.criticality,
        placement: s.suggestedPlacement,
        category: s.category,
        step: s.supportsInferenceStep,
        terms: s.keyTerms.join(", "),
      })),
    );
    expect(buildClueSpecChecklist(GOLDEN_CML).map((l) => l.slotId)).toEqual(slots.map((s) => s.id));
  });

  it("ON: clue-spec's category wins where the two derivations disagree, and the shared sentences are unchanged", () => {
    vi.stubEnv("AGENT5_CLUE_SPEC_CHECKLIST", "true");
    const on = parseChecklist(developerFor()).lines;
    vi.stubEnv("AGENT5_CLUE_SPEC_CHECKLIST", "");
    const off = parseChecklist(developerFor()).lines;

    const method = (ls: ParsedLine[]) => ls.find((l) => l.text.includes("manner of death"))!;
    expect(method(on).category).toBe("physical");
    expect(method(on).text).toBe(method(off).text);
    // the step-1 observation sentence is the legacy sentence, word for word
    expect(on[0].text).toBe(off[0].text);
    expect(on.some((l) => l.text.includes("the clincher") && l.text.includes("brass filings on his cuff"))).toBe(true);
    expect(on.some((l) => l.text.includes("the flaw in the case against Clara Voss"))).toBe(true);
    expect(on.some((l) => l.text.includes("UNIQUELY had the means"))).toBe(false);
  });

  it("is read at call time", () => {
    vi.stubEnv("AGENT5_CLUE_SPEC_CHECKLIST", "");
    const off = developerFor();
    vi.stubEnv("AGENT5_CLUE_SPEC_CHECKLIST", "on");
    expect(developerFor()).not.toBe(off);
    vi.stubEnv("AGENT5_CLUE_SPEC_CHECKLIST", "off");
    expect(developerFor()).toBe(off);
  });
});
