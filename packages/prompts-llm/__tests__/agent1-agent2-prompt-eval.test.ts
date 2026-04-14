import { describe, expect, it } from "vitest";
import { buildSettingPrompt, type SettingInputs } from "../src/agent1-setting.js";
import { buildCastPrompt, type CastInputs } from "../src/agent2-cast.js";

type EvalResult = {
  score: number;
  checks: string[];
  misses: string[];
};

const scoreAgent1Prompt = (prompt: ReturnType<typeof buildSettingPrompt>): EvalResult => {
  const checks: string[] = [];
  const misses: string[] = [];
  let score = 0;

  const mark = (ok: boolean, points: number, passLabel: string, missLabel: string) => {
    if (ok) {
      score += points;
      checks.push(passLabel);
    } else {
      misses.push(missLabel);
    }
  };

  mark(
    prompt.system.includes("historical-setting refiner") && prompt.system.includes("Non-negotiable rules"),
    20,
    "clear role and authority",
    "missing clear role/rules in system",
  );

  mark(
    prompt.developer.includes("Output schema") && prompt.developer.includes("\"realism\""),
    15,
    "explicit output schema",
    "missing explicit schema contract",
  );

  mark(
    prompt.developer.includes("Quality bar") && prompt.developer.includes("investigation relevance"),
    20,
    "quality bar with investigative relevance",
    "quality bar is weak or missing",
  );

  mark(
    prompt.developer.includes("silent checklist")
      && prompt.developer.includes("No anachronistic capabilities")
      && prompt.developer.includes("Schema complete"),
    10,
    "silent self-check contract",
    "missing self-check contract",
  );

  mark(
    prompt.developer.includes("Micro-exemplar") && prompt.developer.includes("Weak:") && prompt.developer.includes("Strong:"),
    20,
    "few-shot style exemplar guidance",
    "missing weak-vs-strong exemplar guidance",
  );

  mark(
    prompt.user.includes("Input brief") && prompt.user.includes("Return one complete JSON object"),
    15,
    "concise task framing and strict output instruction",
    "user task framing is not crisp",
  );

  return { score, checks, misses };
};

const scoreAgent2Prompt = (prompt: ReturnType<typeof buildCastPrompt>): EvalResult => {
  const checks: string[] = [];
  const misses: string[] = [];
  let score = 0;

  const mark = (ok: boolean, points: number, passLabel: string, missLabel: string) => {
    if (ok) {
      score += points;
      checks.push(passLabel);
    } else {
      misses.push(missLabel);
    }
  };

  mark(
    prompt.system.includes("cast-and-motive architect") && prompt.system.includes("Non-negotiable rules"),
    15,
    "clear role and authority",
    "missing role/rules in system",
  );

  mark(
    prompt.developer.includes("Execution plan") && prompt.developer.includes("silent schema"),
    20,
    "explicit multi-step execution plan",
    "missing execution plan",
  );

  mark(
    prompt.developer.includes("motiveStrength") && prompt.developer.includes("accessPlausibility") && prompt.developer.includes("none|low|moderate|high"),
    20,
    "enum constraints are explicit",
    "enum constraints are incomplete",
  );

  mark(
    prompt.developer.includes("Quality bar") && prompt.developer.includes("near-duplicate") && prompt.developer.includes("roleArchetype"),
    15,
    "quality rubric for coherence and diversity",
    "quality rubric is weak or missing",
  );

  mark(
    prompt.developer.includes("Micro-exemplars") && prompt.developer.includes("Good motive/opportunity coupling") && prompt.developer.includes("Weak coupling to avoid"),
    20,
    "few-shot style quality exemplars",
    "missing quality exemplars",
  );

  mark(
    prompt.user.includes("Hard requirements") && prompt.user.includes("possibleCulprits") && prompt.user.includes("Output JSON only"),
    10,
    "hard guardrails in user task",
    "user guardrails are incomplete",
  );

  return { score, checks, misses };
};

const settingCases: SettingInputs[] = [
  {
    runId: "eval-a1-001",
    projectId: "eval-a1",
    decade: "1920s",
    location: "Country manor",
    institution: "Private residence",
    weather: "Heavy rain",
    socialStructure: "British aristocracy",
    tone: "Golden age",
  },
  {
    runId: "eval-a1-002",
    projectId: "eval-a1",
    decade: "1940s",
    location: "Ocean liner",
    institution: "Passenger vessel",
    weather: "Fog at sea",
    socialStructure: "Mixed class passengers",
    tone: "Tense but elegant",
  },
  {
    runId: "eval-a1-003",
    projectId: "eval-a1",
    decade: "1960s",
    location: "University campus",
    institution: "Research college",
    weather: "Cold autumn evening",
    socialStructure: "Faculty and students",
    tone: "Intellectual puzzle",
  },
];

const castCases: CastInputs[] = [
  {
    runId: "eval-a2-001",
    projectId: "eval-a2",
    castSize: 6,
    setting: "1930s English country manor",
    crimeType: "Murder",
    tone: "Classic golden age mystery",
    socialContext: "Aristocrats and household staff",
    detectiveType: "police",
  },
  {
    runId: "eval-a2-002",
    projectId: "eval-a2",
    castSize: 7,
    setting: "1940s Atlantic ocean liner",
    crimeType: "Theft and blackmail",
    tone: "Atmospheric and claustrophobic",
    socialContext: "International wealthy passengers",
    detectiveType: "private",
  },
  {
    runId: "eval-a2-003",
    projectId: "eval-a2",
    characterNames: ["Nora Bell", "Cyril Marsh", "Uma Pike", "Edith Lane", "Rowan Vale", "Tobias Quill"],
    setting: "1950s provincial theater",
    crimeType: "Poisoning",
    tone: "Wry and character-driven",
    socialContext: "Actors, patrons, and local officials",
    detectiveType: "amateur",
  },
];

describe("Prompt Eval Harness: Agent 1 and Agent 2", () => {
  it("scores Agent 1 prompt quality >= 90 across fixed scenarios", () => {
    const results = settingCases.map((input) => scoreAgent1Prompt(buildSettingPrompt(input)));
    const minScore = Math.min(...results.map((r) => r.score));

    expect(results).toHaveLength(3);
    expect(minScore).toBeGreaterThanOrEqual(90);
  });

  it("scores Agent 2 prompt quality >= 90 across fixed scenarios", () => {
    const results = castCases.map((input) => scoreAgent2Prompt(buildCastPrompt(input)));
    const minScore = Math.min(...results.map((r) => r.score));

    expect(results).toHaveLength(3);
    expect(minScore).toBeGreaterThanOrEqual(90);
  });

  it("keeps total eval input count in the 5-10 range", () => {
    const totalCases = settingCases.length + castCases.length;
    expect(totalCases).toBeGreaterThanOrEqual(5);
    expect(totalCases).toBeLessThanOrEqual(10);
  });
});
