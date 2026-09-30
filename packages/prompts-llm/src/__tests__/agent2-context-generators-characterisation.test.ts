import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { generateCharacterProfiles } from "../agent2b-character-profiles.js";
import { generateLocationProfiles } from "../agent2c-location-profiles.js";
import { generateTemporalContext } from "../agent2d-temporal-context.js";
import { generateBackgroundContext } from "../agent2e-background-context.js";

/**
 * CR-20 (A1X-03) — characterisation of the four context generators' shells, written before they were
 * moved onto one. Replay pins each generator's FIRST call; this pins the retry paths: a structural miss,
 * a schema miss (its errors reach the next prompt), a sloppy payload, a truncated one, exhaustion. Per
 * scenario: each call's label, retryAttempt and a digest of its messages; the returned cost, attempts and
 * artifact keys, or the thrown message; and the console lines the shell writes.
 */
afterEach(() => vi.restoreAllMocks());

const setting = {
  era: { decade: "1930s", technology: [], forensics: [], transportation: [], communication: [], socialNorms: ["class"], policing: [] },
  location: { type: "manor", description: "A manor", physicalConstraints: [], geographicIsolation: "moderate", accessControl: [] },
  atmosphere: { weather: "rain", timeOfDay: "evening", mood: "tense", visualDescription: "dim" },
  realism: { anachronisms: [], implausibilities: [], recommendations: [] },
};
const cast = {
  characters: [{ name: "Ann Lee", roleArchetype: "detective", gender: "female", ageRange: "40s", occupation: "x", publicPersona: "x", privateSecret: "x", motiveSeed: "x", motiveStrength: "weak", alibiWindow: "x", accessPlausibility: "possible", stakes: "x", characterArcPotential: "x" }],
  relationships: { pairs: [] }, diversity: { stereotypeCheck: [], recommendations: [] },
  crimeDynamics: { possibleCulprits: [], redHerrings: [], victimCandidates: [], detectiveCandidates: [] },
};
const cml = { CASE: { meta: { title: "T", era: { decade: "1930s" }, setting: { location: "manor" } }, cast: [{ name: "Ann Lee" }] } };

const SHAPED: Record<string, unknown> = {
  "2b": { profiles: [{ characterName: "Ann Lee", paragraphs: [] }] },
  "2c": {
    primary: { name: "Manor", paragraphs: ["p"] }, keyLocations: [{ id: "a" }, { id: "b" }, { id: "c" }],
    atmosphere: { era: "1930s", weather: "rain", timeFlow: "slow", mood: "tense", eraMarkers: [], sensoryPalette: { dominant: "x", secondary: [] }, paragraphs: ["p"] },
  },
  "2d": { specificDate: { year: 1930, month: "May" }, seasonal: {}, fashion: {}, currentAffairs: {}, cultural: {}, paragraphs: ["p"] },
  "2e": { status: "ok", backdropSummary: "x", castAnchors: ["Ann Lee"] },
};
const GENERATORS: Record<string, (client: any) => Promise<any>> = {
  "2b": (c) => generateCharacterProfiles(c, { caseData: cml, cast, tone: "classic", targetWordCount: 1000, runId: "r", projectId: "p" } as any, 3),
  "2c": (c) => generateLocationProfiles(c, { settingRefinement: setting, caseData: cml, tone: "Classic", targetWordCount: 1000, runId: "r", projectId: "p" } as any, 3),
  "2d": (c) => generateTemporalContext(c, { settingRefinement: setting, caseData: cml, runId: "r", projectId: "p" } as any, 3),
  "2e": (c) => generateBackgroundContext(c, { settingRefinement: setting, cast, theme: "t", tone: "t", runId: "r", projectId: "p" } as any, 3),
};
const SCENARIOS: Record<string, (shaped: string) => string[]> = {
  "structural miss, then shaped": (s) => ["{}", s, s],
  "shaped ×3 (schema misses feed the retry prompt)": (s) => [s, s, s],
  "sloppy (trailing comma)": (s) => [s.replace(/}$/, ",}")],
  "truncated, then shaped": (s) => [s.slice(0, -12), s, s],
  "not JSON ×3": () => ["not json at all", "not json at all", "not json at all"],
};

const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 16);
const strip = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, "");

async function run(key: string, responses: string[]) {
  const calls: Array<{ agent: string; retryAttempt: unknown; messages: string }> = [];
  const byAgent: Record<string, number> = {};
  let i = 0;
  const client = {
    chat: async (req: any) => {
      const agent = req.logContext?.agent;
      byAgent[agent] = (byAgent[agent] ?? 0) + 0.01;
      calls.push({ agent, retryAttempt: req.logContext?.retryAttempt, messages: digest(req.messages) });
      if (agent === "Agent2b-ProfileRepair") return { content: '{"paragraphs": ["repaired"]}' };
      return { content: responses[Math.min(i++, responses.length - 1)] };
    },
    getCostTracker: () => ({ getSummary: () => ({ byAgent: { ...byAgent } }) }),
    getLogger: () => ({ logRequest: async () => {}, logResponse: async () => {}, logError: async () => {} }),
  };
  const logs: string[] = [];
  for (const level of ["warn", "error", "log"] as const) {
    vi.spyOn(console, level).mockImplementation((...args: unknown[]) => { logs.push(`${level}: ${strip(args.map(String).join(" "))}`); });
  }
  try {
    const r = await GENERATORS[key](client);
    return { calls, cost: Math.round(r.cost * 1000) / 1000, attempts: r.attempt, keys: Object.keys(r).sort(), artifact: digest(r.backgroundContext ?? { ...r, cost: undefined, durationMs: undefined }), logs };
  } catch (err) {
    return { calls, threw: strip((err as Error).message), logs };
  }
}

describe("context generators characterisation (CR-20 / A1X-03)", () => {
  for (const key of Object.keys(GENERATORS)) {
    for (const [name, responses] of Object.entries(SCENARIOS)) {
      it(`${key} — ${name}`, async () => {
        expect(await run(key, responses(JSON.stringify(SHAPED[key])))).toMatchSnapshot();
      });
    }
  }
});
