import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { designCast, type CastInputs } from "../agent2-cast.js";

/**
 * CR-21 (A1X-05) — characterisation of designCast's attempt loop, written before it was restructured.
 *
 * Every retry path × AGENT2_CONSTRAINED_CAST off/on, with a scripted client. The snapshot holds, per
 * scenario: how many calls were made, a digest of each call's messages (so a changed retry prompt fails),
 * the retryAttempt each call logged, and the returned cast (or the thrown message). Existing tests pin
 * single behaviours; this pins the whole sequence, which is what a restructure can silently change.
 */
const FLAG = "AGENT2_CONSTRAINED_CAST";
afterEach(() => {
  delete process.env[FLAG];
  vi.restoreAllMocks();
});

const inputs = (): CastInputs => ({
  runId: "run-char",
  projectId: "proj-char",
  castSize: 5,
  setting: "1930s country house",
  crimeType: "murder",
  tone: "golden age",
  detectiveType: "amateur",
});

const ARCHETYPES = ["Amateur Sleuth", "Primary suspect", "Financial suspect", "Romantic suspect", "Social rival"];
const person = (i: number, over: Record<string, unknown> = {}) => ({
  name: `Person ${i}`,
  ageRange: "40s",
  occupation: "resident",
  roleArchetype: ARCHETYPES[(i - 1) % ARCHETYPES.length],
  publicPersona: "composed",
  privateSecret: "ruined",
  motiveSeed: "the estate",
  motiveStrength: "moderate",
  alibiWindow: "after dinner",
  accessPlausibility: "possible",
  stakes: "reputation",
  characterArcPotential: "faces the truth",
  gender: i % 2 ? "male" : "female",
  ...over,
});
const cast = (n: number, opts: { culprits?: number; archetype?: string; over?: (i: number) => Record<string, unknown>; snake?: boolean; tension?: string } = {}) => {
  const characters = Array.from({ length: n }, (_, k) => person(k + 1, { ...(opts.archetype ? { roleArchetype: opts.archetype } : {}), ...(opts.over?.(k + 1) ?? {}) }));
  const others = characters.slice(1).map((c) => c.name);
  const cd = {
    possibleCulprits: others.slice(0, opts.culprits ?? 3),
    redHerrings: others.slice(0, 1),
    victimCandidates: others.slice(-1),
    detectiveCandidates: [characters[0]?.name ?? "Person 1"],
  };
  return JSON.stringify({
    characters,
    relationships: opts.tension ? [{ characterA: "Person 1", characterB: "Person 2", relationship: "rivals", tension: opts.tension }] : { pairs: [] },
    diversity: { stereotypeCheck: [], recommendations: [] },
    ...(opts.snake
      ? { crimeDynamics: { possible_culprits: cd.possibleCulprits, red_herrings: cd.redHerrings, victim_candidates: cd.victimCandidates, detective_candidates: cd.detectiveCandidates } }
      : { crimeDynamics: cd }),
  });
};

const SCENARIOS: Record<string, string[]> = {
  clean: [cast(5)],
  "count miss, then clean": [cast(4), cast(5)],
  "count miss ×3": [cast(4), cast(4), cast(6)],
  "missing fields, then clean": [cast(5, { over: (i) => (i === 2 ? { stakes: "" } : {}) }), cast(5)],
  "missing fields ×3": Array(3).fill(cast(5, { over: (i) => (i === 2 ? { stakes: "", name: "" } : {}) })),
  "culprits short, then clean": [cast(5, { culprits: 1 }), cast(5)],
  "culprits short ×3": Array(3).fill(cast(5, { culprits: 1 })),
  "low diversity ×3": Array(3).fill(cast(5, { archetype: "Suspect" })),
  "parse error, then clean": ["{not json", cast(5)],
  "parse error ×3": Array(3).fill("{not json"),
  "empty, then clean": ["", cast(5)],
  "snake_case crimeDynamics": [cast(5, { snake: true })],
  "enum near-misses": [cast(5, { over: (i) => ({ accessPlausibility: i === 2 ? "Likely" : "POSSIBLE", motiveStrength: i === 3 ? "overwhelming" : "Strong", gender: i === 4 ? "M" : i === 5 ? "unknown" : "female" }), tension: "severe" })],
};

const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);

async function run(responses: string[]) {
  const calls: Array<{ messages: string; retryAttempt: unknown; temperature: unknown; maxTokens: unknown }> = [];
  let i = 0;
  const client = {
    chat: vi.fn(async (req: any) => {
      calls.push({ messages: digest(req.messages), retryAttempt: req.logContext?.retryAttempt, temperature: req.temperature, maxTokens: req.maxTokens });
      return { content: responses[Math.min(i++, responses.length - 1)] };
    }),
    getCostTracker: () => ({ getSummary: () => ({ byAgent: { "Agent2-CastDesigner": 0.01 } }) }),
  };
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    const r = await designCast(client as any, inputs(), 3);
    return { calls, attempt: r.attempt, cast: r.cast };
  } catch (err) {
    return { calls, threw: (err as Error).message };
  }
}

describe("designCast characterisation (CR-21 / A1X-05)", () => {
  for (const flag of ["off", "on"] as const) {
    for (const [name, responses] of Object.entries(SCENARIOS)) {
      it(`${name} — constrained ${flag}`, async () => {
        if (flag === "on") process.env[FLAG] = "on";
        expect(await run(responses)).toMatchSnapshot();
      });
    }
  }
});
