import { describe, expect, it } from "vitest";

type Score = { total: number; misses: string[] };

const scoreSettingOutput = (output: any): Score => {
  let total = 0;
  const misses: string[] = [];

  const has = (ok: boolean, points: number, miss: string) => {
    if (ok) total += points;
    else misses.push(miss);
  };

  has(typeof output?.era?.decade === "string", 10, "missing era.decade");
  has(Array.isArray(output?.era?.technology) && output.era.technology.length >= 3, 15, "weak era.technology detail");
  has(Array.isArray(output?.location?.physicalConstraints) && output.location.physicalConstraints.length >= 3, 15, "weak location physical constraints");
  has(typeof output?.location?.geographicIsolation === "string" && output.location.geographicIsolation.length > 20, 10, "weak geographicIsolation");
  has(typeof output?.atmosphere?.visualDescription === "string" && output.atmosphere.visualDescription.length > 50, 15, "weak atmosphere visualDescription");
  has(Array.isArray(output?.realism?.recommendations) && output.realism.recommendations.length >= 3, 15, "weak realism recommendations");
  has(Array.isArray(output?.realism?.anachronisms) && output.realism.anachronisms.length === 0, 10, "anachronisms not empty");
  has(Array.isArray(output?.realism?.implausibilities) && output.realism.implausibilities.length === 0, 10, "implausibilities not empty");

  return { total, misses };
};

const scoreCastOutput = (output: any): Score => {
  let total = 0;
  const misses: string[] = [];

  const has = (ok: boolean, points: number, miss: string) => {
    if (ok) total += points;
    else misses.push(miss);
  };

  const chars = Array.isArray(output?.characters) ? output.characters : [];
  const detectiveNames = chars.filter((c: any) => /detective|investigator|inspector/i.test(String(c.roleArchetype ?? ""))).map((c: any) => c.name);
  const culpritSet = new Set(Array.isArray(output?.crimeDynamics?.possibleCulprits) ? output.crimeDynamics.possibleCulprits : []);
  const uniqueArchetypes = new Set(chars.map((c: any) => String(c.roleArchetype ?? "").toLowerCase().trim()).filter(Boolean));

  has(chars.length >= 6, 15, "insufficient character count");
  has(chars.every((c: any) => c.name && c.motiveSeed && c.alibiWindow && c.accessPlausibility), 20, "missing required character fields");
  has(detectiveNames.length === 1, 10, "detective cardinality not equal to one");
  has(detectiveNames.every((name: string) => !culpritSet.has(name)), 10, "detective appears in possible culprits");
  has(Array.isArray(output?.crimeDynamics?.possibleCulprits) && output.crimeDynamics.possibleCulprits.length >= 3, 15, "insufficient possible culprits");
  has(uniqueArchetypes.size >= Math.ceil(chars.length * 0.7), 15, "weak archetype diversity");
  has(Array.isArray(output?.diversity?.stereotypeCheck) && output.diversity.stereotypeCheck.length === 0, 15, "stereotypeCheck not fully resolved");

  return { total, misses };
};

const settingFixture = {
  era: {
    decade: "1930s",
    technology: ["Valve radio sets in common rooms", "Party-line telephones with operator delays", "Manual typewriters with carbon-copy records"],
    forensics: ["Fingerprint comparison", "Basic toxicology", "Early ballistic analysis"],
    transportation: ["Petrol touring cars", "Branch-line rail service", "Horse carts for estate logistics"],
    communication: ["Telegrams", "Postal correspondence", "Operator-assisted local calls"],
    socialNorms: ["Class hierarchy in household access", "Strict dinner protocols", "Gendered expectations of conduct"],
    policing: ["Local constabulary first response", "Regional detective support", "Paper-led chain of evidence"],
  },
  location: {
    type: "Country manor",
    description: "An isolated estate with service corridors, guest wings, and restricted studies.",
    physicalConstraints: ["Limited night access to upper corridor", "Single service stair bottleneck", "Rain-slick paths reducing exterior movement"],
    geographicIsolation: "Nearest town is forty minutes by car, making rapid outside intervention unlikely during storm hours.",
    accessControl: ["Library locked after dinner", "Wine cellar key held by butler", "Guest wing curfew after midnight"],
  },
  atmosphere: {
    weather: "Cold rain",
    timeOfDay: "Late evening",
    mood: "Constrained and suspicious",
    visualDescription: "Gas lamps pool amber light across dark paneling while rain streaks blur the terrace doors, shrinking every corridor into a private stage for secrets.",
  },
  realism: {
    anachronisms: [],
    implausibilities: [],
    recommendations: [
      "Keep toxicology turnaround to days, not hours.",
      "Use operator-mediated call delays to shape alibi uncertainty.",
      "Reflect rationing anxiety in household financial motives.",
    ],
  },
};

const castFixture = {
  characters: [
    { name: "Iris Cole", roleArchetype: "Amateur Sleuth / Civilian Investigator", motiveSeed: "Protect family name", alibiWindow: "Drawing room, from half past eight until five minutes to nine", accessPlausibility: "possible" },
    { name: "Martin Hale", roleArchetype: "Primary suspect", motiveSeed: "Audit exposure", alibiWindow: "Library corridor, from twenty to nine until nine o'clock", accessPlausibility: "easy" },
    { name: "Nora Bell", roleArchetype: "Financial suspect", motiveSeed: "Debt pressure", alibiWindow: "Telephone alcove, from twenty-five to nine until ten to nine", accessPlausibility: "possible" },
    { name: "Edgar Pike", roleArchetype: "Gatekeeper witness", motiveSeed: "Career risk", alibiWindow: "Cellar inventory, from twenty to nine until a quarter to nine", accessPlausibility: "unlikely" },
    { name: "Ruth Vale", roleArchetype: "Social rival", motiveSeed: "Public humiliation", alibiWindow: "South parlor, from a quarter to nine until five past nine", accessPlausibility: "possible" },
    { name: "Tom Quill", roleArchetype: "Outsider observer", motiveSeed: "Hidden blackmail", alibiWindow: "Garage shed, from half past eight until five minutes to nine", accessPlausibility: "possible" },
  ],
  relationships: { pairs: [] },
  diversity: { stereotypeCheck: [], recommendations: ["Maintain class-voice distinction without caricature"] },
  crimeDynamics: {
    possibleCulprits: ["Martin Hale", "Nora Bell", "Ruth Vale"],
    redHerrings: ["Tom Quill"],
    victimCandidates: ["Martin Hale"],
    detectiveCandidates: ["Iris Cole"],
  },
};

describe("Fixture Output Eval Harness", () => {
  it("scores Agent 1 fixture output >= 90", () => {
    const result = scoreSettingOutput(settingFixture);
    expect(result.total).toBeGreaterThanOrEqual(90);
  });

  it("scores Agent 2 fixture output >= 90", () => {
    const result = scoreCastOutput(castFixture);
    expect(result.total).toBeGreaterThanOrEqual(90);
  });
});
