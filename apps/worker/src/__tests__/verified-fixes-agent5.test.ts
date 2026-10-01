/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — Agent 5 items A5-D05, A5-11 / A5-D04, and the unflagged
 * A5-Q02 (meridiem detection, behind its own AGENT5_MERIDIEM_CHECK).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { enforceRedHerringFloorKeepingCoverage } from "../jobs/agents/agent5/coverage-retries.js";
import { extractInitialClues } from "../jobs/agents/agent5/extraction.js";
import { buildAgent5RegenerationContract, currentAgent5StrictBase } from "../jobs/agents/agent5/contract-payload.js";
import { statesExplicitMeridiem } from "../jobs/clue-contracts/clue-time.js";

const FLAG = "CML_VERIFIED_FIXES";
let saved: Record<string, string | undefined> = {};
beforeEach(() => {
  saved = {
    [FLAG]: process.env[FLAG],
    AGENT5_RED_HERRING_FLOOR: process.env.AGENT5_RED_HERRING_FLOOR,
    AGENT5_MERIDIEM_CHECK: process.env.AGENT5_MERIDIEM_CHECK,
    AGENT5_STRICT_PROMPT_CONTRACTS: process.env.AGENT5_STRICT_PROMPT_CONTRACTS,
  };
  delete process.env.AGENT5_RED_HERRING_FLOOR;
  delete process.env.AGENT5_STRICT_PROMPT_CONTRACTS;
});
afterEach(() => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
});
const setFlag = (on: boolean) => { if (on) process.env[FLAG] = "1"; else delete process.env[FLAG]; };

const LOCKED = [{ id: "fact_clock", value: "ten minutes past nine", description: "the stopped clock" }];
const STRICT_BASE: any = {
  strictSourcePaths: ["CASE.cast[1].alibi_window"],
  requiredIdToSourceMappings: [],
  requiredStepCoverageFloors: [],
  requiredLateClueSlot: "late slot",
  requiredDirectCulpritClue: "direct culprit clue",
  recommendations: [],
};
const STRICT_CONTRACT = {
  strictSourcePaths: STRICT_BASE.strictSourcePaths,
  requiredIdToSourceMappings: STRICT_BASE.requiredIdToSourceMappings,
  requiredStepCoverageFloors: STRICT_BASE.requiredStepCoverageFloors,
  requiredLateClueSlot: STRICT_BASE.requiredLateClueSlot,
  requiredDirectCulpritClue: STRICT_BASE.requiredDirectCulpritClue,
};

const cml = (): any => ({
  CASE: {
    cast: [
      { name: "Iwan Hale", culprit_eligibility: "eligible", alibi_window: "in the pantry after supper" },
      { name: "Agnes Pike", culprit_eligibility: "eligible", alibi_window: "at the scullery door until ten" },
    ],
    culpability: { culprits: ["Iwan Hale"] },
    inference_path: {
      steps: [{ observation: "Grease marks ring the clock key slot.", correction: "The clock was staged.", required_evidence: ["Porter saw the key cabinet open."] }],
    },
  },
});

const clue = (id: string, description: string, pointsTo: string): any => ({
  id, description, pointsTo, sourceInCML: "CASE.inference_path.steps[0].observation",
  placement: "early", criticality: "essential", evidenceType: "observation", supportsInferenceStep: 1,
});

const makeCtx = (): any => ({
  client: {},
  inputs: { targetLength: "medium", enableLockedFactRegistry: true },
  lockedFactRegistry: LOCKED,
  runId: "run",
  projectId: "proj",
  warnings: [],
  errors: [],
  agentCosts: {},
  agentDurations: {},
  reportProgress: () => {},
  cml: cml(),
});

const makeRun = (regenerated: any): any => ({
  clueDensity: "moderate",
  strictPromptFeedbackBase: STRICT_BASE,
  proactiveFirstPassFeedback: undefined,
  mergeStrictPromptFeedback: (f: any) => f,
  cluesStart: Date.now(),
  recordHardFailPhaseScore: () => {},
  failAgent5: (m: string) => { throw new Error(m); },
  extractWithAttempt: vi.fn(async () => regenerated),
});

/** The floor's regeneration: a red herring, and no clue that names Agnes Pike. */
const regenerated = (): any => ({
  clues: [clue("clue_grease", "Grease marks ring the clock key slot.", "The clock was staged.")],
  redHerrings: [{ id: "rh_1", description: "A muddy boot by the door.", supportsAssumption: "an intruder", misdirection: "outsider" }],
  clueTimeline: { early: ["clue_grease"], mid: [], late: [] },
  fairPlayChecks: {},
  cost: 0.01,
});
/** What reaches the floor: suspect coverage already backstopped (Agnes is named), but 0 red herrings. */
const beforeFloor = (): any => ({
  clues: [
    clue("clue_grease", "Grease marks ring the clock key slot.", "The clock was staged."),
    clue("clue_fp_elimination_agnes_pike", "Agnes Pike was at the scullery door until ten.", "Eliminates Agnes Pike because the cook corroborates her alibi."),
  ],
  redHerrings: [],
  clueTimeline: { early: ["clue_grease"], mid: ["clue_fp_elimination_agnes_pike"], late: [] },
  cost: 0,
});
const namesAgnes = (clues: any) => clues.clues.some((c: any) => /Agnes Pike/.test(`${c.description} ${c.pointsTo}`));

describe("A5-D05 — suspect coverage survives the red-herring floor's regeneration", () => {
  it("flag OFF: the regenerated set ships without the suspect backstop (today)", async () => {
    setFlag(false);
    const ctx = makeCtx();
    const out = await enforceRedHerringFloorKeepingCoverage(ctx, makeRun(regenerated()), { agent5RetryInvoked: false } as any, beforeFloor());
    expect(out.redHerrings).toHaveLength(1);
    expect(namesAgnes(out)).toBe(false);
  });

  it("flag ON: suspect coverage is re-run on the regenerated set", async () => {
    setFlag(true);
    const ctx = makeCtx();
    const out = await enforceRedHerringFloorKeepingCoverage(ctx, makeRun(regenerated()), { agent5RetryInvoked: false } as any, beforeFloor());
    expect(out.redHerrings).toHaveLength(1);
    expect(namesAgnes(out)).toBe(true);
    expect(ctx.warnings.join("\n")).toMatch(/suspect-coverage deterministic synthesis/);
  });

  it("flag ON: no regeneration (floor met) leaves the clue set untouched", async () => {
    setFlag(true);
    const input = { ...beforeFloor(), redHerrings: [{ id: "rh_a" }] };
    const run = makeRun(regenerated());
    const out = await enforceRedHerringFloorKeepingCoverage(makeCtx(), run, { agent5RetryInvoked: false } as any, input);
    expect(out).toBe(input);
    expect(run.extractWithAttempt).not.toHaveBeenCalled();
  });
});

describe("A5-11 / A5-D04 — regeneration payloads carry the first pass's strict contract and locked facts", () => {
  it("the first-pass payload is unchanged by the helper refactor", async () => {
    const ctx = makeCtx();
    const run = makeRun(regenerated());
    await extractInitialClues(ctx, run, { extractionAttempt: 0 } as any);
    const payload = run.extractWithAttempt.mock.calls[0][0];
    expect(payload.strictContract).toEqual(STRICT_CONTRACT);
    expect(payload.lockedFacts).toBe(LOCKED);
    expect(Object.keys(payload)).toEqual([
      "cml", "clueDensity", "redHerringBudget", "fairPlayFeedback", "strictContract", "runId", "projectId", "lockedFacts",
    ]);
  });

  it("flag OFF: the red-herring floor's payload omits them (today)", async () => {
    setFlag(false);
    const run = makeRun(regenerated());
    await enforceRedHerringFloorKeepingCoverage(makeCtx(), run, { agent5RetryInvoked: false } as any, beforeFloor());
    const payload = run.extractWithAttempt.mock.calls[0][0];
    expect("strictContract" in payload).toBe(false);
    expect("lockedFacts" in payload).toBe(false);
  });

  it("flag ON: the red-herring floor's payload carries them", async () => {
    setFlag(true);
    const run = makeRun(regenerated());
    await enforceRedHerringFloorKeepingCoverage(makeCtx(), run, { agent5RetryInvoked: false } as any, beforeFloor());
    const payload = run.extractWithAttempt.mock.calls[0][0];
    expect(payload.strictContract).toEqual(STRICT_CONTRACT);
    expect(payload.lockedFacts).toBe(LOCKED);
  });

  it("buildAgent5RegenerationContract omits both when there is nothing to send", () => {
    const ctx = { ...makeCtx(), inputs: { enableLockedFactRegistry: false } };
    expect(buildAgent5RegenerationContract(ctx, undefined)).toEqual({});
  });

  it("buildAgent5RegenerationContract honours AGENT5_STRICT_PROMPT_CONTRACTS=off", () => {
    process.env.AGENT5_STRICT_PROMPT_CONTRACTS = "off";
    const ctx = { ...makeCtx(), inputs: { enableLockedFactRegistry: false } };
    expect(currentAgent5StrictBase(ctx)).toBeUndefined();
    expect(buildAgent5RegenerationContract(ctx, currentAgent5StrictBase(ctx))).toEqual({});
  });
});

describe("A5-Q02 — statesExplicitMeridiem needs a clock number (unflagged, behind AGENT5_MERIDIEM_CHECK)", () => {
  it("is off (false) without AGENT5_MERIDIEM_CHECK, as before", () => {
    delete process.env.AGENT5_MERIDIEM_CHECK;
    expect(statesExplicitMeridiem("at 8 pm")).toBe(false);
  });

  it("does not read the verb 'am' as a meridiem", () => {
    process.env.AGENT5_MERIDIEM_CHECK = "1";
    expect(statesExplicitMeridiem("I am here")).toBe(false);
    expect(statesExplicitMeridiem("I am certain it was PM's fault")).toBe(false);
  });

  it("reads a clock time with a meridiem", () => {
    process.env.AGENT5_MERIDIEM_CHECK = "1";
    expect(statesExplicitMeridiem("at 8 pm")).toBe(true);
    expect(statesExplicitMeridiem("8:15 a.m.")).toBe(true);
    expect(statesExplicitMeridiem("at 8 a.m. sharp")).toBe(true);
    expect(statesExplicitMeridiem("by 11pm")).toBe(true);
    expect(statesExplicitMeridiem("at eight p.m.")).toBe(true);
  });
});
