import { describe, expect, it } from "vitest";
import { buildCMLPrompt, deriveDeathMethodFromCrimeClass } from "../agent3-cml.ts";

describe("agent3 cml prompt required-evidence hardening", () => {
  const baseInput = {
    decade: "1930s",
    location: "Yorkshire",
    institution: "manor house",
    tone: "classic",
    weather: "misty",
    socialStructure: "gentry and staff",
    theme: "deception",
    primaryAxis: "temporal" as const,
    castSize: 4,
    castNames: ["Iwan Hale", "Agnes Pike", "Marta Dean", "Reid Shaw"],
    detectiveType: "inspector",
    victimArchetype: "industrialist",
    complexityLevel: "moderate" as const,
    mechanismFamilies: ["clockwork tampering"],
    runId: "run-test",
    projectId: "proj-test",
  };

  it("includes explicit anti-abstractness contract for required_evidence in developer prompt", () => {
    const prompt = buildCMLPrompt(baseInput);

    expect(prompt.developer).toContain("REQUIRED_EVIDENCE ANTI-ABSTRACTNESS CONTRACT");
    expect(prompt.developer).toContain("Reject placeholders and generic summaries");
    expect(prompt.developer).toContain("If a step cannot be supported by 2-4 concrete entries");
  });

  it("requires pre-output required_evidence self-check in user prompt", () => {
    const prompt = buildCMLPrompt(baseInput);

    expect(prompt.user).toContain("REQUIRED SELF-CHECK BEFORE OUTPUT");
    expect(prompt.user).toContain("Verify each step has required_evidence length 2-4");
    expect(prompt.user).toContain("not detective-private cognition");
  });
});

describe("agent3 cml death_method (ANALYSIS_48 T1.1)", () => {
  const baseInput = {
    decade: "1930s", location: "Yorkshire", institution: "manor house", tone: "classic",
    weather: "misty", socialStructure: "gentry and staff", theme: "deception",
    primaryAxis: "temporal" as const, castSize: 4,
    castNames: ["Iwan Hale", "Agnes Pike", "Marta Dean", "Reid Shaw"],
    detectiveType: "inspector", victimArchetype: "industrialist",
    complexityLevel: "moderate" as const, mechanismFamilies: ["clockwork tampering"],
    runId: "run-test", projectId: "proj-test",
  };

  it("surfaces the required manner-of-death contract in the prompt", () => {
    const prompt = buildCMLPrompt(baseInput);
    const all = `${prompt.developer}\n${prompt.user}`;
    expect(all).toContain("death_method");
    expect(all.toLowerCase()).toContain("physical manner of death");
    expect(all.toLowerCase()).toContain("distinct from the concealment mechanism");
  });

  it("derives a physical manner of death from the crime classification, else nothing", () => {
    expect(deriveDeathMethodFromCrimeClass("premeditated stabbing", "murder")).toBe("stabbing");
    expect(deriveDeathMethodFromCrimeClass("strangled in the study", "murder")).toBe("strangulation");
    expect(deriveDeathMethodFromCrimeClass("", "poisoning")).toBe("poisoning");
    // a gimmick subtype that names no physical method resolves to "" (caller falls back to a default)
    expect(deriveDeathMethodFromCrimeClass("time-masked manor murder", "murder")).toBe("");
  });
});

describe("17-hitting-90 P3.1 / P3.2 — the case shapes the readers asked for", () => {
  const input = {
    decade: "1920s",
    location: "a seaside hotel",
    institution: "fencing academy",
    tone: "dark",
    weather: "fog",
    socialStructure: "masters and pupils",
    theme: "a room that appears sealed but is not",
    primaryAxis: "spatial" as const,
    castSize: 4,
    castNames: ["Katherine Quayle", "Hector Gaunt", "Desmond Kestrel", "Montague Norbury"],
    detectiveType: "police",
    victimArchetype: "academy founder",
    complexityLevel: "moderate" as const,
    mechanismFamilies: ["locked room"],
    runId: "run-test",
    projectId: "proj-test",
  };
  // The YAML skeleton is emitted only into the merged system message (Azure has no developer role).
  const all = () => buildCMLPrompt(input).messages.map((m) => String(m.content)).join("\n");
  it("death_method asks for the place on the body a wound kills, as a shape", () => {
    expect(all()).toContain('"<verb> with <weapon>, to the <chest | throat | neck | heart | back | skull | temple>"');
    expect(all()).toContain('for a wound, add ", to the <chest|throat|neck|heart|back|skull>"');
  });
  it("the time windows ask for one entry that is the act itself, with two ends", () => {
    expect(all()).toContain("to <the latest moment they could leave> — the murder");
    expect(all()).toContain("windows: []  # one entry is the act itself");
  });
});
