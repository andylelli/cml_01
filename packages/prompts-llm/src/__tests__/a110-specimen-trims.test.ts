import { afterEach, describe, expect, it } from "vitest";
import { buildCastPrompt, type CastInputs } from "../agent2-cast.js";
import { buildCMLPrompt } from "../agent3-cml.js";
import { buildLocationProfilesPrompt } from "../agent2c-location-profiles.js";

/**
 * A_110 0.6b (PROMPT_SPECIMEN_TRIMS) — the case-noun guard's specimens out of the prompts. MEASURED: Agent 3's
 * 'e.g., "Little Middleton, Yorkshire"' is a place in 18 of 72 stored cases and a person in none. Each test RENDERS the
 * real prompt, so a specimen stranded in a plain string (where `${…}` would print literally) cannot pass.
 */
afterEach(() => {
  delete process.env.PROMPT_SPECIMEN_TRIMS;
});

const all = (p: { messages?: Array<{ content: unknown }>; system?: string; developer?: string; user?: string }): string =>
  [p.system, p.developer, p.user, ...(p.messages ?? []).map((m) => String(m.content))].filter(Boolean).join("\n");

const castInputs: CastInputs = {
  runId: "r", projectId: "p",
  characterNames: ["Iwan Hale", "Agnes Pike", "Marta Dean", "Reid Shaw", "Ada Vane"],
  setting: "1930s English country manor", crimeType: "Murder", tone: "Classic", socialContext: "gentry and staff",
};
const a3Input = {
  decade: "1930s", location: "Yorkshire", institution: "manor house", tone: "classic", weather: "misty",
  socialStructure: "gentry and staff", theme: "deception", primaryAxis: "identity" as const, castSize: 4,
  castNames: ["Iwan Hale", "Agnes Pike", "Marta Dean", "Reid Shaw"], detectiveType: "inspector",
  victimArchetype: "industrialist", complexityLevel: "moderate" as const, mechanismFamilies: ["clockwork tampering"],
  runId: "run-test", projectId: "proj-test",
};
const a2cInput: any = {
  settingRefinement: {
    era: { decade: "1930s", technology: [], forensics: [], transportation: [], communication: [], socialNorms: ["class"], policing: [] },
    location: { type: "ocean liner", description: "A liner", physicalConstraints: [], geographicIsolation: "high", accessControl: [] },
    atmosphere: { weather: "rain", timeOfDay: "evening", mood: "tense", visualDescription: "dim" },
    realism: { anachronisms: [], implausibilities: [], recommendations: [] },
  },
  caseData: { CASE: { meta: { title: "T" } } },
  tone: "Classic",
};

const SPECIMENS = ["Finch", "Ashford", "Middleton", "Southampton", "Liverpool", "Boston", "Atlantic", "Westminster", "Nice, Cannes, Monaco", "Orient Express"];
const carried = (text: string): string[] => SPECIMENS.filter((s) => text.includes(s));

describe("every specimen is rendered OFF and absent ON", () => {
  it("Agent 2 — the worked example's name", () => {
    expect(carried(all(buildCastPrompt(castInputs)))).toContain("Finch");
    process.env.PROMPT_SPECIMEN_TRIMS = "1";
    const on = all(buildCastPrompt(castInputs));
    expect(carried(on)).toEqual([]);
    expect(on).toContain("Prevent another guest's disclosure of a damaging secret");
  });

  it("Agent 3 — the skeleton's name and the geography examples", () => {
    const off = all(buildCMLPrompt(a3Input) as never);
    expect(carried(off)).toEqual(expect.arrayContaining(["Ashford", "Middleton", "Southampton", "Atlantic"]));
    process.env.PROMPT_SPECIMEN_TRIMS = "1";
    const on = all(buildCMLPrompt(a3Input) as never);
    expect(carried(on)).toEqual([]);
    expect(on).toContain("a specific English village and its county, named by you for this case");
    expect(on).not.toContain("${");
  });

  it("Agent 2c — the route examples", () => {
    const off = all(buildLocationProfilesPrompt(a2cInput) as never);
    expect(carried(off)).toEqual(expect.arrayContaining(["Southampton", "Liverpool", "Boston"]));
    process.env.PROMPT_SPECIMEN_TRIMS = "1";
    const on = all(buildLocationProfilesPrompt(a2cInput) as never);
    expect(carried(on)).toEqual([]);
    expect(on).toContain("the route, from the port of departure to the port of arrival");
  });

  it("OFF is byte-identical to a flag-less build", () => {
    const a = all(buildCMLPrompt(a3Input) as never);
    process.env.PROMPT_SPECIMEN_TRIMS = "0";
    expect(all(buildCMLPrompt(a3Input) as never)).toBe(a);
  });
});
