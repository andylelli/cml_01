import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCluePrompt } from "../agent5-clues.js";
import { buildCMLPrompt } from "../agent3-cml.js";
import { buildLocationProfilesPrompt } from "../agent2c-location-profiles.js";
import { auditNovelty, buildNoveltyPrompt } from "../agent8-novelty.js";
import { generateCharacterProfiles } from "../agent2b-character-profiles.js";

/**
 * CML_PROMPT_TRIMS (owner decision 12, CR-28 deferrals, 2026-10-02). OFF pins the old prompt; ON pins each trim.
 * The byte-equality proof over the archived inputs was old-dist vs new-dist (0 diffs with the flag unset).
 */
afterEach(() => {
  delete process.env.CML_PROMPT_TRIMS;
  delete process.env.CML_VERIFIED_FIXES;
  vi.restoreAllMocks();
});
const on = () => { process.env.CML_PROMPT_TRIMS = "1"; };
const count = (s: string, needle: string) => s.split(needle).length - 1;

// ---------------------------------------------------------------------------------------------------------
// Agent 5 — A5-16, A5-10, A5-Q03
// ---------------------------------------------------------------------------------------------------------
const cml5: any = {
  CASE: {
    meta: { title: "Clockwork Silence", crime_class: { category: "murder" } },
    false_assumption: { type: "temporal", statement: "The clock stopped naturally." },
    culpability: { culprits: ["Iwan Hale"] },
    hidden_model: { mechanism: { description: "The culprit wound and stalled the clock movement." } },
    discriminating_test: { design: "Use grease traces on the key slot to prove staged stoppage.", evidence_clues: ["clue_clock_trace"] },
    inference_path: { steps: [{ observation: "Grease marked the key slot before supper.", correction: "The displayed time was staged." }] },
    cast: [
      { name: "Iwan Hale", culprit_eligibility: "eligible" },
      { name: "Agnes Pike", culprit_eligibility: "eligible", alibi_window: "in the pantry" },
    ],
    constraint_space: {
      time: { anchors: ["supper bell at seven"], contradictions: [] },
      access: { actors: ["butler"], objects: ["clock key"] },
      physical: { traces: ["grease streak"] },
    },
  },
};
const proactive = { overallStatus: "needs-revision" as const, recommendations: ["FIRST PASS PRIORITY: x"], targetedClueIds: ["clue_clock_trace"] };
const retry = {
  overallStatus: "fail" as const,
  violations: [{ severity: "critical" as const, rule: "cast path", description: "d", suggestion: "s" }],
  warnings: ["w"],
};
const a5 = (feedback?: any) => buildCluePrompt({ cml: structuredClone(cml5), clueDensity: "moderate", redHerringBudget: 1, fairPlayFeedback: feedback });
const CULPRIT_UNIQUE = "- CULPRIT-UNIQUE CLUE:";
const FIRST_RH = "- FIRST-ATTEMPT RED HERRING CONTRACT:";

describe("CML_PROMPT_TRIMS — Agent 5", () => {
  it("OFF: the volatile CML summary opens the developer message and status/audit are asked for", () => {
    const p = a5(proactive);
    expect(p.developer.startsWith("## CML Summary")).toBe(true);
    expect(p.developer).toContain('"status": "pass|fail"');
    expect(p.developer).toContain('"audit": {');
    expect(p.user).toContain("- STATUS CONTRACT:");
    expect(p.user).toContain("- FAIL-FAST STATUS:");
    // A5-10's measured defect: proactive feedback suppresses the two first-attempt lines.
    expect(p.user).not.toContain(CULPRIT_UNIQUE);
    expect(a5().user).toContain(CULPRIT_UNIQUE);
  });

  it("ON (A5-16): the static sections come first and are identical across cases", () => {
    on();
    const a = a5(proactive).developer;
    const other = structuredClone(cml5);
    other.CASE.meta.title = "A Different Case";
    const b = buildCluePrompt({ cml: other, clueDensity: "dense", redHerringBudget: 0 }).developer;
    expect(a.startsWith("## Hard Precedence (resolve in order)")).toBe(true);
    const staticEnd = a.indexOf("## CML Summary");
    expect(staticEnd).toBeGreaterThan(4000);
    expect(b.slice(0, staticEnd)).toBe(a.slice(0, staticEnd));
    expect(a.endsWith("\n")).toBe(false);
  });

  it("ON (A5-10): no status/audit output instruction anywhere; inference is still asked for", () => {
    on();
    for (const p of [a5(), a5(proactive), a5(retry)]) {
      const all = p.system + p.developer + p.user;
      expect(all).not.toMatch(/status\s*=|"status"|STATUS CONTRACT|FAIL-FAST STATUS|audit arrays|"audit"|audit\.invalidSourcePaths|Set status/);
      expect(all).toContain('"inference": "What that observable lets the detective conclude"');
      expect(all).toContain("TOP-LEVEL KEY CONTRACT: output top-level keys exactly as clues, redHerrings; do not output red_herrings.");
    }
  });

  it("ON: each restated contract is stated once", () => {
    on();
    const p = a5(proactive);
    const all = p.developer + p.user;
    for (const c of [
      "CAST PATH BINDING CONTRACT:", "REQUIRED FIELDS CONTRACT:", "PER-STEP COVERAGE CONTRACT:", "SUSPECT PARITY CONTRACT:",
      "TOP-LEVEL KEY CONTRACT:", "SOURCE FORMAT CONTRACT:", "DISCRIMINATING ID EXACTNESS:", "FULL OBJECT CONTRACT:",
      "ANTI-COLLAPSE OUTPUT RULE:", "SOURCE LEGALITY CONTRACT:",
      "every ID in CASE.discriminating_test.evidence_clues must appear as a clue id",
    ]) expect([c, count(all, c)]).toEqual([c, 1]);
    // every field FULL OBJECT named survives
    expect(all).toContain("each clue object includes id, category, description, sourceInCML, pointsTo, placement, criticality, supportsInferenceStep, evidenceType");
    expect(p.user).not.toMatch(/\n\n\n/);
  });

  it("ON (A5-Q03): the first-attempt lines ship on the first pass, proactive feedback or not, and not on a retry", () => {
    on();
    expect(a5().user).toContain(CULPRIT_UNIQUE);
    expect(a5(proactive).user).toContain(CULPRIT_UNIQUE);
    expect(a5(proactive).user).toContain(FIRST_RH);
    const r = a5(retry).user;
    expect(r).not.toContain(CULPRIT_UNIQUE);
    expect(r).toContain("Retry mode (bounded delta repair):");
    expect(r).toContain("Retry CAST PATH BINDING CONTRACT (MANDATORY)");
  });

  it("OFF retry block keeps its status/audit lines", () => {
    const r = a5(retry).user;
    expect(r).toContain("- Populate audit arrays to show no unresolved critical defects.");
    expect(r).toContain('return status="fail" with the blocking term list in audit.invalidSourcePaths.');
  });
});

// ---------------------------------------------------------------------------------------------------------
// Agent 3 — A34-14
// ---------------------------------------------------------------------------------------------------------
const a3Input = {
  decade: "1930s", location: "Yorkshire", institution: "manor house", tone: "classic", weather: "misty",
  socialStructure: "gentry and staff", theme: "deception", primaryAxis: "temporal" as const, castSize: 4,
  castNames: ["Iwan Hale", "Agnes Pike", "Marta Dean", "Reid Shaw"], detectiveType: "inspector",
  victimArchetype: "industrialist", complexityLevel: "moderate" as const, mechanismFamilies: ["clockwork tampering"],
  runId: "run-test", projectId: "proj-test",
};
const SEED = "**Uniqueness Seed**: run-test-proj-test";

describe("CML_PROMPT_TRIMS — Agent 3", () => {
  it("OFF: the seed sits before the era constraints and rule 4 restates the contract", () => {
    const d = buildCMLPrompt(a3Input).developer;
    expect(d.indexOf(SEED)).toBeLessThan(d.indexOf("**Era Constraints**"));
    expect(d).toContain("Avoid abstract placeholders in required_evidence");
    expect(d).toContain("Do NOT use detective-only behavioral shorthand as evidence");
  });

  it("ON: the seed closes the developer message, and the rule-4 contract is stated once with every example kept", () => {
    on();
    const d = buildCMLPrompt(a3Input).developer;
    expect(count(d, SEED)).toBe(1);
    expect(d.endsWith(`${SEED}\nUse this seed to ensure the case details and logic differ meaningfully from prior runs.`)).toBe(true);
    expect(d.indexOf(SEED)).toBeGreaterThan(d.indexOf("Before finalizing, run a silent checklist:"));
    expect(d).not.toContain("Avoid abstract placeholders in required_evidence");
    expect(count(d, "REQUIRED_EVIDENCE ANTI-ABSTRACTNESS CONTRACT:")).toBe(1);
    for (const ex of ["timeline discrepancy", "suspicious behavior", "hidden motive", "motive pressure", "detective insight", "inconsistency", "anomaly",
      "he seems guilty", "she appears nervous", "signals of guilt", "suspicious reactions", "observed defensiveness", "confession"]) {
      expect(d).toContain(`"${ex}"`);
    }
  });

  it("A34-D11 text paths work under both CML_VERIFIED_FIXES settings with the trims on", () => {
    on();
    const all = () => buildCMLPrompt(a3Input).messages.map((m) => String(m.content)).join("\n");
    expect(all()).toContain("- Ensure discriminating_test.evidence_clues is non-empty");
    expect(all()).toContain("discriminating_test.evidence_clues MUST be a non-empty array");
    process.env.CML_VERIFIED_FIXES = "1";
    expect(all()).toContain("- Leave discriminating_test.evidence_clues empty (Agent 5 back-fills it");
    expect(all()).toContain("discriminating_test.evidence_clues may be left empty");
    expect(all()).not.toContain("- Ensure discriminating_test.evidence_clues is non-empty");
  });
});

// ---------------------------------------------------------------------------------------------------------
// Agent 2c — A1X-11(a)
// ---------------------------------------------------------------------------------------------------------
const a2cInput: any = {
  settingRefinement: {
    era: { decade: "1930s", technology: [], forensics: [], transportation: [], communication: [], socialNorms: ["class"], policing: [] },
    location: { type: "manor", description: "A manor", physicalConstraints: [], geographicIsolation: "moderate", accessControl: [] },
    atmosphere: { weather: "rain", timeOfDay: "evening", mood: "tense", visualDescription: "dim" },
    realism: { anachronisms: [], implausibilities: [], recommendations: [] },
  },
  caseData: { CASE: { meta: { title: "T" } } },
  tone: "Classic",
};
const a2c = () => { const p: any = buildLocationProfilesPrompt(a2cInput); return { system: p.system as string, developer: p.developer as string }; };

describe("CML_PROMPT_TRIMS — Agent 2c", () => {
  it("OFF: the sensory-format rule three times, the F30-5 minimum twice, the forbidden atoms in the example", () => {
    const { system, developer } = a2c();
    const all = system + developer;
    expect(count(all, "Sensory Format**") + count(all, "F5a NOUN-PHRASE RULE")).toBe(3);
    expect(count(all, "F30-5 SENSORY MINIMUM")).toBe(2);
    expect(developer).toContain('"smells": ["beeswax and cold ash", "damp stone and old leather"]');
    expect(developer).toContain('"the tick of a mantel clock"');
  });

  it("ON: each rule once, and the example JSON no longer models the atoms the distinctness rule forbids", () => {
    on();
    const { system, developer } = a2c();
    const all = system + developer;
    expect(count(all, "Sensory Format")).toBe(1);
    expect(count(all, "F5a")).toBe(1);
    expect(count(all, "F30-5 SENSORY MINIMUM")).toBe(1);
    expect(all).toContain("at least 4 noun-phrase entries in EACH of sights, sounds, smells, and tactile");
    expect(all).toContain("scores 0 on sensory richness");
    const example = developer.slice(developer.indexOf('"keyLocations": ['), developer.indexOf("Requirements:"));
    for (const atom of ["beeswax", "damp stone", "mantel clock", "distant clock", "long shadows"]) expect([atom, example.includes(atom)]).toEqual([atom, false]);
    // the distinctness rule itself keeps its named examples
    expect(developer).toContain('Do NOT reuse the same scents/sounds (e.g. "tick of the clock", "damp stone", "beeswax", "long shadows")');
  });
});

// ---------------------------------------------------------------------------------------------------------
// Agent 8 — A1X-11(c)
// ---------------------------------------------------------------------------------------------------------
const cml8 = (title: string): any => ({ CASE: { meta: { title }, cast: [] } });
const RECOMPUTED = ['"status":', '"overallNovelty":', '"mostSimilarSeed":', '"highestSimilarity":', '"overallSimilarity":'];

describe("CML_PROMPT_TRIMS — Agent 8", () => {
  const prompt = () => buildNoveltyPrompt({ generatedCML: cml8("Gen"), seedCMLs: [cml8("Seed One")], similarityThreshold: 0.9 });
  it("OFF asks for the five recomputed fields; ON does not, and keeps the per-dimension scores", () => {
    const off = prompt().user;
    for (const f of RECOMPUTED) expect(off).toContain(f);
    expect(off).toContain("- status matches threshold policy");
    on();
    const onUser = prompt().user;
    for (const f of RECOMPUTED) expect([f, onUser.includes(f)]).toEqual([f, false]);
    expect(onUser).not.toContain("status matches threshold policy");
    for (const f of ['"similarityScores": [', '"seedTitle":', '"plotSimilarity":', '"structuralSimilarity":', '"violations":', '"summary":']) expect(onUser).toContain(f);
  });

  const client = (content: string): any => ({
    chat: async () => ({ content }),
    getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
    getLogger: () => ({ logRequest: async () => {}, logResponse: async () => {}, logError: async () => {} }),
  });
  const reply = JSON.stringify({
    similarityScores: [{ seedTitle: "Seed One", plotSimilarity: 0.2, characterSimilarity: 0.2, settingSimilarity: 0.2, solutionSimilarity: 0.2, structuralSimilarity: 0.2, concerningMatches: [] }],
    violations: [], warnings: [], recommendations: [], summary: "fine",
  });
  const run = () => auditNovelty(client(reply), { generatedCML: cml8("Gen"), seedCMLs: [cml8("Seed One")], similarityThreshold: 0.9 });
  it("the parser: OFF still requires status; ON accepts a reply without it and computes the verdict", async () => {
    await expect(run()).rejects.toThrow(/missing required fields/);
    on();
    const r = await run();
    expect(r.status).toBe("pass");
    expect(r.mostSimilarSeed).toBe("Seed One");
    expect(r.highestSimilarity).toBeCloseTo(0.2, 5);
  });
});

// ---------------------------------------------------------------------------------------------------------
// Agent 2b — A1X-11(e)
// ---------------------------------------------------------------------------------------------------------
describe("CML_PROMPT_TRIMS — Agent 2b paragraph repairs", () => {
  const cast = {
    characters: ["Ann Lee", "Bo Ray", "Cy Dunn"].map((name) => ({ name, roleArchetype: "suspect", gender: "female", ageRange: "40s", occupation: "x", publicPersona: "x", privateSecret: "x", motiveSeed: "x", motiveStrength: "weak", alibiWindow: "x", accessPlausibility: "possible", stakes: "x", characterArcPotential: "x" })),
    relationships: { pairs: [] }, diversity: { stereotypeCheck: [], recommendations: [] },
    crimeDynamics: { possibleCulprits: [], redHerrings: [], victimCandidates: [], detectiveCandidates: [] },
  };
  const run = async () => {
    let inFlight = 0, maxInFlight = 0;
    const repairMessages: string[] = [];
    const client: any = {
      chat: async (req: any) => {
        if (req.logContext?.agent === "Agent2b-ProfileRepair") {
          repairMessages.push(JSON.stringify(req.messages));
          inFlight++; maxInFlight = Math.max(maxInFlight, inFlight);
          await new Promise((r) => setTimeout(r, 5));
          inFlight--;
          return { content: '{"paragraphs": ["repaired"]}' };
        }
        return { content: JSON.stringify({ profiles: cast.characters.map((c) => ({ characterName: c.name, paragraphs: [] })) }) };
      },
      getCostTracker: () => ({ getSummary: () => ({ byAgent: {} }) }),
      getLogger: () => ({ logRequest: async () => {}, logResponse: async () => {}, logError: async () => {} }),
    };
    for (const level of ["warn", "error", "log"] as const) vi.spyOn(console, level).mockImplementation(() => {});
    const r = await generateCharacterProfiles(client, { caseData: { CASE: { meta: { title: "T" }, cast: cast.characters.map((c) => ({ name: c.name })) } }, cast, tone: "classic", targetWordCount: 1000, runId: "r", projectId: "p" } as any, 1);
    return { maxInFlight, repairMessages: [...repairMessages].sort(), paragraphs: r.profiles.map((p: any) => p.paragraphs) };
  };
  it("OFF runs the repairs one after another; ON runs them together with the same prompts and results", async () => {
    const off = await run();
    expect(off.repairMessages.length).toBe(3);
    expect(off.maxInFlight).toBe(1);
    on();
    const onRun = await run();
    expect(onRun.maxInFlight).toBe(3);
    expect(onRun.repairMessages).toEqual(off.repairMessages);
    expect(onRun.paragraphs).toEqual(off.paragraphs);
  });
});
