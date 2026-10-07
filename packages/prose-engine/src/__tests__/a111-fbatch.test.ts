import { afterEach, describe, expect, it } from "vitest";
import { buildBookContract } from "../book-contract.js";
import { collectCheckerFindings } from "../findings.js";
import { completeProjects } from "./fixtures.js";
import type { ContractInput } from "../types.js";

/**
 * A_111 F-1..F-3 — three defects the arm-D read (89) named, each traced to a construction:
 *   F-1 the case's red herrings owned by no chapter (PROSE_V2_HERRINGS);
 *   F-2 a short sentence said twice back to back, under every repeat check's length floor (PROSE_V2_AUDIT_FIXES);
 *   F-3 the period line filled with a state measured against the present (PROSE_V2_CONTRACT_FIXES).
 */
const FLAGS = ["PROSE_V2_HERRINGS", "PROSE_V2_AUDIT_FIXES", "PROSE_V2_CONTRACT_FIXES"];
afterEach(() => {
  for (const f of FLAGS) delete process.env[f];
});
const projects = completeProjects();
const caseOf = (input: ContractInput) => {
  const cml = input.cml as Record<string, unknown>;
  return (cml.CASE ?? cml) as { red_herrings?: Array<{ description: string; resolved_in_chapter: number }> };
};

describe("F-1 — every red herring is noticed in one chapter and explained in a later one, by the reveal", () => {
  it("ON, over the archive", () => {
    process.env.PROSE_V2_HERRINGS = "1";
    let herrings = 0;
    for (const p of projects) {
      const c = buildBookContract(p.input);
      for (const h of caseOf(p.input).red_herrings ?? []) {
        const detail = h.description.replace(/\s+/g, " ").trim();
        const noticed = c.scenes.find((s) => (s.herrings ?? []).some((x) => x.detail === detail));
        const explained = c.scenes.find((s) => (s.herringsExplained ?? []).some((x) => x.detail === detail));
        expect(noticed, detail).toBeDefined();
        expect(explained, detail).toBeDefined();
        expect(noticed!.chapter).toBeLessThan(explained!.chapter);
        expect(explained!.chapter).toBeLessThanOrEqual(c.roles.reveal);
        expect(c.bible.text).toContain(`noticed in chapter ${noticed!.chapter}, explained in chapter ${explained!.chapter}`);
        herrings++;
      }
    }
    expect(herrings).toBeGreaterThan(0);
  });

  it("OFF: no chapter owns a herring, and the bible is byte-identical to a flag-less build", () => {
    for (const p of projects.slice(0, 8)) {
      const a = buildBookContract(p.input);
      expect(a.scenes.some((s) => s.herrings || s.herringsExplained)).toBe(false);
      process.env.PROSE_V2_HERRINGS = "0";
      expect(buildBookContract(p.input).bible.text).toBe(a.bible.text);
      delete process.env.PROSE_V2_HERRINGS;
    }
  });
});

describe("F-2 — a sentence said twice in a row is a finding, however short", () => {
  const chapter = {
    number: 3,
    title: "Three",
    paragraphs: [`Ivor's reply was clipped. "You'll have them." "You'll have them." He moved to the library door, pausing to look back at the desk.`],
  };
  const deliberate = { number: 3, title: "Three", paragraphs: [`"No. No." She shut the door on the hall and stood with her back against it.`] };
  const hits = (ch: typeof chapter) =>
    collectCheckerFindings([ch], buildBookContract(projects[0]!.input), [3]).filter((f) => f.class === "copied_sentence" && /in a row/.test(f.note)).length;

  it("ON: the doubled line is reported once; a two-word 'No. No.' is not", () => {
    process.env.PROSE_V2_AUDIT_FIXES = "1";
    expect(hits(chapter)).toBe(1);
    expect(hits(deliberate)).toBe(0);
  });
  it("OFF: not reported", () => {
    expect(hits(chapter)).toBe(0);
  });
});

describe("F-3 — the period line is never a state measured against the present", () => {
  const withConstraints = (input: ContractInput): ContractInput => {
    const world = structuredClone((input.world ?? {}) as Record<string, unknown>);
    world.historicalMoment = {
      ...((world.historicalMoment as object) ?? {}),
      physicalConstraints: ["Absence of modern forensic technologies, reliance on physical clues and testimony", "Fog closes the coast road after dark"],
    };
    return { ...input, world } as ContractInput;
  };
  const frictions = () => buildBookContract(withConstraints(projects[0]!.input)).scenes.map((s) => s.texture?.friction).filter(Boolean);

  it("ON: the absence is dropped, the fog stays", () => {
    process.env.PROSE_V2_CONTRACT_FIXES = "1";
    expect(frictions()).toEqual(["Fog closes the coast road after dark"]);
  });
  it("OFF: both reach a chapter, as before", () => {
    expect(frictions()).toHaveLength(2);
  });
});
