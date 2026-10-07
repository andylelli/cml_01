import { afterEach, describe, expect, it, vi } from "vitest";
import type { CaseData } from "@cml/cml";
import { buildNarrativePrompt } from "../agent7-narrative.js";
import { buildLocationProfilesPrompt } from "../agent2c-location-profiles.js";
import { generateCharacterProfiles } from "../agent2b-character-profiles.js";
import { checkNamesApart } from "../agent2-cast-checker.js";
import type { ClueDistributionResult } from "../agent5-clues.js";

/**
 * A_110 step 2 (CML_A110_UPSTREAM): P3 the Gathering, W4 the profiled places and the evidence's places, P2 appearance and
 * whyHere, L4 the humour clause, P4 names apart. Every prompt is RENDERED; OFF is byte-identical to a flag-less build.
 */
afterEach(() => {
  delete process.env.CML_A110_UPSTREAM;
  vi.restoreAllMocks();
});
const on = () => (process.env.CML_A110_UPSTREAM = "1");

const caseData = {
  meta: { title: "A Case", primary_axis: "temporal", schema_version: "2.0" },
  setup: { era: { year: 1935, location: "A seaside hotel", key_details: ["fog"] }, crime: { description: "Found dead", victim: "Sylvia Trent", method: "struck", location: "Lounge", when: "a quarter past eight" } },
  cast: [{ character_id: "detective", name: "Eleanor Voss", role: "detective", access_level: "full" }, { character_id: "s1", name: "Hugo Vane", role: "suspect", access_level: "routine" }],
} as unknown as CaseData;
const clues = {
  clues: [{ id: "clue_1", category: "temporal", description: "A stopped clock", sourceInCML: "x", pointsTo: "Time of death", placement: "early", criticality: "essential" }],
  redHerrings: [],
  fairPlayChecks: { essentialCluesCount: 1, allCluesBeforeSolution: true, discriminatingTestPresent: true, noSpecialKnowledge: true },
} as unknown as ClueDistributionResult;
const locationProfiles = { primary: { name: "Gullscar House" }, keyLocations: [{ name: "The Boathouse" }, { name: "The Long Gallery" }] };
const a7 = () => { const p = buildNarrativePrompt({ caseData, clues, targetLength: "medium", locationProfiles } as never); return `${p.system}\n${p.developer}\n${p.user}`; };

describe("P3 + W4 — Agent 7", () => {
  it("OFF: the body comes first, no places block, byte-identical", () => {
    const off = a7();
    expect(off).toContain("The body comes first.");
    expect(off).not.toContain("Scene 1 is the Gathering");
    expect(off).not.toContain("The Places This Case Has Described");
    process.env.CML_A110_UPSTREAM = "0";
    expect(a7()).toBe(off);
  });
  it("ON: scene 1 is the Gathering with the victim alive and marked; scene 2 the discovery; the profiled places offered", () => {
    on();
    const t = a7();
    expect(t).toContain("Scene 1 is the Gathering, Scene 2 the Crime");
    expect(t).toContain('set "victimAlive": true on it');
    expect(t).not.toContain("The body comes first.");
    expect(t).toMatch(/The Places This Case Has Described[\s\S]*- Gullscar House\n- The Boathouse\n- The Long Gallery/);
  });
});

describe("W4 — Agent 2c is told where the evidence is found", () => {
  const input: any = {
    settingRefinement: {
      era: { decade: "1930s", technology: [], forensics: [], transportation: [], communication: [], socialNorms: [], policing: [] },
      location: { type: "manor", description: "A manor", physicalConstraints: [], geographicIsolation: "moderate", accessControl: [] },
      atmosphere: { weather: "rain", timeOfDay: "evening", mood: "tense", visualDescription: "dim" },
      realism: { anachronisms: [], implausibilities: [], recommendations: [] },
    },
    caseData: { CASE: { meta: { title: "T" } } },
    tone: "Classic",
    clueObservables: ["A torn page wedged under the boathouse door", "Wet footprints on the gallery stairs"],
  };
  const text = () => { const p: any = buildLocationProfilesPrompt(input); return `${p.system}\n${p.developer}\n${p.user ?? ""}`; };
  it("OFF: nothing added, byte-identical to a build without observables", () => {
    const off = text();
    expect(off).not.toContain("Evidence in this case is found");
    expect(off).toBe((() => { const p: any = buildLocationProfilesPrompt({ ...input, clueObservables: undefined }); return `${p.system}\n${p.developer}\n${p.user ?? ""}`; })());
  });
  it("ON: the observables, as places to make key locations", () => {
    on();
    expect(text()).toMatch(/Evidence in this case is found[^\n]*\n- A torn page wedged under the boathouse door\n- Wet footprints on the gallery stairs/);
  });
});

describe("P2 + L4 — Agent 2b", () => {
  const cast = {
    characters: ["Ann Lee", "Bo Ray"].map((name) => ({ name, roleArchetype: "suspect", gender: "female", ageRange: "40s", occupation: "x", publicPersona: "x", privateSecret: "x", motiveSeed: "x", motiveStrength: "weak", alibiWindow: "x", accessPlausibility: "possible", stakes: "x", characterArcPotential: "x" })),
    relationships: { pairs: [] }, diversity: { stereotypeCheck: [], recommendations: [] },
    crimeDynamics: { possibleCulprits: [], redHerrings: [], victimCandidates: [], detectiveCandidates: [] },
  };
  const firstPrompt = async (): Promise<string> => {
    let captured = "";
    const client: any = {
      chat: async (req: any) => {
        if (!captured) captured = req.messages.map((m: any) => m.content).join("\n");
        return { content: JSON.stringify({ profiles: cast.characters.map((c) => ({ characterName: c.name, paragraphs: ["p"] })) }) };
      },
      getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
      getLogger: () => ({ logRequest: async () => {}, logResponse: async () => {}, logError: async () => {} }),
    };
    for (const level of ["warn", "error", "log"] as const) vi.spyOn(console, level).mockImplementation(() => {});
    try {
      await generateCharacterProfiles(client, { caseData: { CASE: { meta: { title: "T" }, cast: cast.characters.map((c) => ({ name: c.name })) } }, cast, tone: "classic", targetWordCount: 1000, runId: "r", projectId: "p" } as any, 1);
    } catch {
      // only the prompt is under test
    }
    return captured;
  };
  it("OFF: the humour clause, no new fields", async () => {
    const t = await firstPrompt();
    expect(t).toContain("and how their humour manifests in dialogue");
    expect(t).not.toContain('"whyHere"');
  });
  it("ON: appearance and whyHere asked for; the humour clause gone", async () => {
    on();
    const t = await firstPrompt();
    expect(t).not.toContain("and how their humour manifests in dialogue");
    expect(t).toContain('"appearance": "Two concrete physical details a stranger notices first"');
    expect(t).toContain('"whyHere": "Why this person is at this place on this day, in one sentence: the reason they would give anybody who asked"');
  });
});

describe("P4 — names a reader can tell apart", () => {
  const cast = (names: string[], pairs: Array<Record<string, string>> = []) =>
    ({ characters: names.map((name) => ({ name })), relationships: { pairs } }) as never;
  it("a shared first name is an error with its repair", () => {
    const issues = checkNamesApart((cast(["Ada Vane", "Ada Moor", "Tom Bell"]) as any).characters, cast(["Ada Vane", "Ada Moor", "Tom Bell"]));
    expect(issues.map((i) => i.code)).toEqual(["shared_first_name"]);
  });
  it("a shared surname needs its kinship stated; titles are not names", () => {
    const c1 = cast(["Dr. Ada Vane", "Inspector Tom Vane"]);
    expect(checkNamesApart((c1 as any).characters, c1).map((i) => i.code)).toEqual(["shared_surname_no_kinship"]);
    const c2 = cast(["Ada Vane", "Tom Vane"], [{ character1: "Ada Vane", character2: "Tom Vane", relationship: "Tom is Ada's younger brother" }]);
    expect(checkNamesApart((c2 as any).characters, c2)).toEqual([]);
  });
  it("distinct names pass", () => {
    const c = cast(["Ada Vane", "Tom Bell", "Iris Moor"]);
    expect(checkNamesApart((c as any).characters, c)).toEqual([]);
  });
});
