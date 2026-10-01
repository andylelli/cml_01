/**
 * Owner decision 12 (CML_VERIFIED_FIXES):
 *  - A1X-10: refineSetting backfills a missing top-level key before spending an LLM re-roll on it.
 *  - A6-D04: the blind-reader prompt's "The suspects are:" omits the detective and the victim.
 * And A34-11 (R1, unflagged): Agent 4's result carries a required `degraded` discriminant.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { backfillSetting, refineSetting } from "../agent1-setting.js";
import { blindReaderSimulation, blindReaderSuspectNames } from "../agent6-fairplay.js";
import { reviseCml } from "../agent4-revision.js";

const FLAG = "CML_VERIFIED_FIXES";
let saved: string | undefined;
beforeEach(() => { saved = process.env[FLAG]; });
afterEach(() => { if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved; });
const setFlag = (on: boolean) => { if (on) process.env[FLAG] = "1"; else delete process.env[FLAG]; };

const noop = async () => {};
const fakeClient = (replies: string[]) => {
  const calls: any[] = [];
  let i = 0;
  const reply = async (req: any) => {
    calls.push(req);
    return { content: replies[Math.min(i++, replies.length - 1)], model: "mock", latencyMs: 1, finishReason: "stop" };
  };
  return {
    calls,
    client: {
      getLogger: () => ({ logRequest: noop, logResponse: noop, logError: noop }),
      getCostTracker: () => ({ getSummary: () => ({ byAgent: {} as Record<string, number> }) }),
      chatWithRetry: reply,
      chat: reply,
    } as any,
  };
};

// ── A1X-10 ──────────────────────────────────────────────────────────────────

const COMPLETE = {
  era: { decade: "1930s", technology: ["party-line telephone"], forensics: ["county pathologist"], transportation: ["branch-line train"], communication: ["telegram"], socialNorms: ["deference"], policing: ["county constabulary"] },
  location: { type: "manor", description: "A fenland manor", physicalConstraints: ["one causeway"], geographicIsolation: "high", accessControl: ["locked gate"] },
  atmosphere: { weather: "fog", timeOfDay: "night", mood: "uneasy", visualDescription: "Lamplight on wet stone." },
  realism: { anachronisms: [], implausibilities: [], recommendations: ["Delay the lab report."] },
};
const withoutAtmosphere = () => { const s: any = structuredClone(COMPLETE); delete s.atmosphere; return JSON.stringify(s); };
const inputs = { runId: "r", projectId: "p", decade: "1930s", location: "Fenland", institution: "Manor" };

describe("A1X-10 — backfill before the structural re-roll", () => {
  it("flag OFF: a response missing `atmosphere` costs a re-roll (today)", async () => {
    setFlag(false);
    const { client, calls } = fakeClient([withoutAtmosphere(), JSON.stringify(COMPLETE)]);
    const r = await refineSetting(client, inputs, 2);
    expect(calls).toHaveLength(2);
    expect(r.attempt).toBe(2);
    expect(r.setting.atmosphere.weather).toBe("fog");
    expect(r.structuralBackfill).toBeUndefined();
  });

  it("flag ON: the same response is backfilled, no re-roll, and the backfill is reported", async () => {
    setFlag(true);
    const { client, calls } = fakeClient([withoutAtmosphere(), JSON.stringify(COMPLETE)]);
    const r = await refineSetting(client, inputs, 2);
    expect(calls).toHaveLength(1);
    expect(r.attempt).toBe(1);
    expect(r.setting.atmosphere).toEqual({ weather: "overcast", timeOfDay: "evening", mood: "tense", visualDescription: "Dim, shadowed period interiors." });
    expect(r.setting.era.technology).toEqual(["party-line telephone"]); // the model's content is kept
    expect(r.structuralBackfill).toEqual(["atmosphere"]);
  });

  it("flag ON: a response with none of the four blocks is junk, not partial — it is still re-rolled", async () => {
    setFlag(true);
    const { client, calls } = fakeClient([JSON.stringify({ note: "nothing useful" }), JSON.stringify(COMPLETE)]);
    const r = await refineSetting(client, inputs, 2);
    expect(calls).toHaveLength(2);
    expect(r.structuralBackfill).toBeUndefined();
  });

  it("flag ON: a backfilled artifact that still fails the schema is re-rolled", async () => {
    setFlag(true);
    const bad: any = JSON.parse(withoutAtmosphere());
    bad.era.technology = [1, 2]; // items must be strings; backfill keeps an authored array
    const { client, calls } = fakeClient([JSON.stringify(bad), JSON.stringify(COMPLETE)]);
    const r = await refineSetting(client, inputs, 2);
    expect(calls).toHaveLength(2);
    expect(r.setting.atmosphere.weather).toBe("fog");
  });

  it("backfillSetting fills neutrals from the brief and never overwrites authored values", () => {
    const s = backfillSetting({ era: { decade: "1920s" } }, { decade: "1930s", location: "Fenland", institution: "Manor" });
    expect(s.era.decade).toBe("1920s");
    expect(s.era.policing).toEqual([]);
    expect(s.location.type).toBe("Manor");
    expect(s.location.description).toBe("Fenland — Manor");
    expect(s.realism).toEqual({ anachronisms: [], implausibilities: [], recommendations: [] });
  });
});

// ── A34-11 ──────────────────────────────────────────────────────────────────

describe("A34-11 — the revision result's `degraded` is a required discriminant", () => {
  it("the degraded arm carries its unresolved warnings as an array", async () => {
    const { client } = fakeClient(["not json at all"]);
    const r = await reviseCml(client, {
      originalPrompt: { system: "", developer: "", user: "" },
      invalidCml: "scalar-not-an-object",
      validationErrors: ["CASE.meta.license is required"],
      attempt: 1,
    }, 1);
    expect(r.degraded).toBe(true);
    if (r.degraded) {
      // Type-level: no optional chaining needed on this arm.
      expect(Array.isArray(r.unresolvedLogicWarnings)).toBe(true);
      expect(r.unresolvedLogicWarnings.length).toBeGreaterThan(0);
      expect(r.validation.valid).toBe(false);
    }
  });
});

// ── A6-D04 ──────────────────────────────────────────────────────────────────

const CASE_CAST = [
  { name: "Inspector Hale", role: "detective" },
  { name: "Lord Ashby", role_archetype: "Victim" },
  { name: "Mary Carter", role: "suspect" },
  { name: "Edith Vane", role_archetype: "Housekeeper" },
  { name: "Tom Reed", role: "culprit" },
];
const NAMES = CASE_CAST.map((c) => c.name);
const CLUES: any = {
  clues: [{ id: "c1", placement: "early", description: "A muddy boot print by the door.", criticality: "essential" }],
  redHerrings: [],
};

const suspectsLine = (user: string) => (user.match(/The suspects are: ([^\n]*)/) ?? [])[1];

describe("A6-D04 — the blind reader's suspect list", () => {
  it("flag OFF: the whole cast, detective and victim included (today)", async () => {
    setFlag(false);
    const { client, calls } = fakeClient([JSON.stringify({ suspectedCulprit: "Tom Reed", reasoning: "r", confidenceLevel: "likely", missingInformation: [] })]);
    await blindReaderSimulation(client, CLUES, "It was an accident", NAMES, { caseCast: CASE_CAST });
    expect(suspectsLine(calls[0].messages[1].content)).toBe(NAMES.join(", "));
  });

  it("flag ON: the detective and the victim are left out", async () => {
    setFlag(true);
    const { client, calls } = fakeClient([JSON.stringify({ suspectedCulprit: "Tom Reed", reasoning: "r", confidenceLevel: "likely", missingInformation: [] })]);
    await blindReaderSimulation(client, CLUES, "It was an accident", NAMES, { caseCast: CASE_CAST });
    expect(suspectsLine(calls[0].messages[1].content)).toBe("Mary Carter, Edith Vane, Tom Reed");
  });

  it("flag ON: no cast supplied, or fewer than two left, falls back to the full list", () => {
    setFlag(true);
    expect(blindReaderSuspectNames(NAMES)).toEqual(NAMES);
    const tiny = [{ name: "Inspector Hale", role: "detective" }, { name: "Lord Ashby", role: "victim" }, { name: "Tom Reed", role: "culprit" }];
    expect(blindReaderSuspectNames(tiny.map((c) => c.name), tiny)).toEqual(tiny.map((c) => c.name));
  });

  it("flag ON: a name with no cast entry is kept", () => {
    setFlag(true);
    expect(blindReaderSuspectNames([...NAMES, "A Stranger"], CASE_CAST)).toEqual(["Mary Carter", "Edith Vane", "Tom Reed", "A Stranger"]);
  });
});
