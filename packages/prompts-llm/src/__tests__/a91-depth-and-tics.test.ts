import { describe, expect, it } from "vitest";

import { buildProfilesPrompt, isFormativeIncidentEnabled, isTicTemplateBanEnabled } from "../agent2b-character-profiles.js";
import { buildCharacterPersonalityBlock } from "../agent9-prose/prompt-blocks.js";

/**
 * A_91 F2/F3 — depth and wit, as operations rather than adjectives.
 *
 * DEPTH, by the definition that produced this work: a trait is not depth; a trait with a history is.
 * MEASURED over 378 archived characters — a past-time marker in 3%, a concrete incident in 15%, an
 * emotional stance in 41%, and all three together in 1 (0%). The cause is the schema: every field it
 * asks for is case-facing, and there is no field for a life before the case.
 *
 * WIT: 23% of the archive's 377 signature tics open "One must / One mustn't / One might", another
 * 11% "Let us / Let's not" — so a third of every cast's individuating catchphrase comes from two
 * constructions, and 79 of the 377 are literal duplicates across books.
 */
const withEnv = <T>(vars: Record<string, string | undefined>, fn: () => T): T => {
  const saved: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(vars)) {
    saved[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    return fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
};

const inputs = {
  runId: "t",
  projectId: "t",
  tone: "Classic",
  decade: "1930s",
  cast: { characters: [{ name: "Percival Thorne", gender: "male", role: "suspect" }] },
} as any;
const whole = () => {
  const p = buildProfilesPrompt(inputs);
  return [p.system, p.developer, p.user].filter(Boolean).join("\n");
};

describe("AGENT2B_FORMATIVE_INCIDENT — the life before the case", () => {
  it("OFF: the prompt asks for nothing new", () => {
    const text = withEnv({ AGENT2B_FORMATIVE_INCIDENT: undefined }, whole);
    expect(text).not.toContain("FORMATIVE INCIDENT");
    expect(text).not.toContain("formativeIncident");
  });

  it("ON: it asks for all five parts, and forbids tying them to the murder", () => {
    const text = withEnv({ AGENT2B_FORMATIVE_INCIDENT: "true" }, whole);
    expect(text).toContain("FORMATIVE INCIDENT");
    expect(text).toContain("formativeIncident");
    for (const part of ["the TRAIT it explains", "its ORIGIN as a specific EVENT", "what it COST", "their STANCE", "the CONSEQUENCE"]) {
      expect(text, part).toContain(part);
    }
    expect(text).toContain("A role is not an origin");
    // A_91 §12 — the first cast to receive this instruction filled one frame seven times.
    expect(text).toContain("NO TWO OF THESE MAY SHARE AN OPENING FORMULA");
    expect(text).toContain('Developed a habit of');
    expect(text).toContain("The five parts are REQUIREMENTS, not a sentence pattern");
    expect(text).toContain("is not a formative incident, it is a motive");
  });
});

describe("AGENT2B_TIC_TEMPLATE_BAN — the exhausted forms", () => {
  it("OFF: no ban", () => {
    expect(withEnv({ AGENT2B_TIC_TEMPLATE_BAN: undefined }, whole)).not.toContain("THE EXHAUSTED FORMS");
  });

  it("ON: names the measured openings and the tag question, and offers other grammar", () => {
    const text = withEnv({ AGENT2B_TIC_TEMPLATE_BAN: "true" }, whole);
    expect(text).toContain("THE EXHAUSTED FORMS");
    for (const banned of ['"One must"', '"One mustn\'t"', '"Let us"', '"Darling"', '"isn\'t it?"']) {
      expect(text, banned).toContain(banned);
    }
    expect(text).toContain("does not have to be a sentence");
  });
});

describe("the formative incident REACHES the prose prompt", () => {
  const bundle = {
    characters: [{ name: "Percival Thorne", gender: "male" }],
  } as any;
  const profiles = {
    profiles: [{
      name: "Percival Thorne",
      publicPersona: "A stooped clerk.",
      privateSecret: "He gambles.",
      stakes: "His position.",
      humourStyle: "dry_wit",
      humourLevel: 0.5,
      formativeIncident: "Walked with a stoop ever since a carting accident at nine that almost killed him; bitter that speed was taken from him; office work was all that was left.",
    }],
  } as any;

  it("prints it as an operation, not as background", () => {
    const block = buildCharacterPersonalityBlock(profiles, bundle);
    expect(block).toContain("Life before this case");
    expect(block).toContain("carting accident at nine");
    expect(block).toContain("show the TRAIT in action");
    expect(block).toContain("never tie it to the murder");
  });

  it("a profile without one is byte-identical to before", () => {
    const without = { profiles: [{ ...profiles.profiles[0], formativeIncident: undefined }] } as any;
    expect(buildCharacterPersonalityBlock(without, bundle)).not.toContain("Life before this case");
  });
});

describe("flags are read at call time", () => {
  it("both", () => {
    expect(withEnv({ AGENT2B_FORMATIVE_INCIDENT: undefined }, isFormativeIncidentEnabled)).toBe(false);
    expect(withEnv({ AGENT2B_FORMATIVE_INCIDENT: "true" }, isFormativeIncidentEnabled)).toBe(true);
    expect(withEnv({ AGENT2B_TIC_TEMPLATE_BAN: undefined }, isTicTemplateBanEnabled)).toBe(false);
    expect(withEnv({ AGENT2B_TIC_TEMPLATE_BAN: "true" }, isTicTemplateBanEnabled)).toBe(true);
  });
});
