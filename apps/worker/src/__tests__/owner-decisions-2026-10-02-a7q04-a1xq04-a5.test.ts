/**
 * Owner decisions 2026-10-02 (documentation/code-review/OPEN-QUESTIONS.md §1):
 *   A7-Q04  — a clue with no/invalid placement anchors in act 2, not act 3 (clue-pacing.ts).
 *   A1X-Q04 — Agent 2d's specificDate year/month are pinned to generateSpecificDate's mandate.
 *   A5-12   — CML_VERIFIED_FIXES ON bypasses the clue-contract memos.
 *   A5-Q04  — AGENT5_RED_HERRING_TOPUP: one targeted red-herring call after separation.
 *   A5-Q07  — the clue-spec shadow names the required slots no shipped clue covers.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateSpecificDate } from "@cml/prompts-llm/temporal-anchor";
import { applyDeterministicCluePreAssignment } from "../jobs/agents/agent7-run.js";
import { pinSpecificDateToMandate, temporalAnchorRunId } from "../jobs/agents/agent2d-run.js";
import { buildStrictSourcePathWhitelist, buildStrictPromptFeedback } from "../jobs/clue-contracts/contracts.js";
import { analyzeSuspectCoverage } from "../jobs/clue-contracts/suspect-coverage.js";
import {
  buildRedHerringTopupPrompt,
  topUpRedHerringsAfterSeparation,
} from "../jobs/agents/agent5/red-herring-topup.js";
import { runClueSpecShadow, uncoveredClueSpecSlots } from "../jobs/clue-contracts/clue-spec-shadow.js";

const FLAGS = ["CML_VERIFIED_FIXES", "AGENT5_RED_HERRING_TOPUP", "AGENT5_DERIVE_SHADOW"];
let saved: Record<string, string | undefined> = {};
beforeEach(() => {
  saved = Object.fromEntries(FLAGS.map((f) => [f, process.env[f]]));
  FLAGS.forEach((f) => delete process.env[f]);
});
afterEach(() => {
  for (const f of FLAGS) {
    if (saved[f] === undefined) delete process.env[f];
    else process.env[f] = saved[f];
  }
});

// ── A7-Q04 ──────────────────────────────────────────────────────────────────

describe("A7-Q04 — an essential clue with no valid placement anchors in act 2", () => {
  const outline = () =>
    ({
      acts: [
        { actNumber: 1, scenes: [{ sceneNumber: 1 }] },
        { actNumber: 2, scenes: [{ sceneNumber: 2 }] },
        { actNumber: 3, scenes: [{ sceneNumber: 3 }] },
      ],
    }) as any;
  const actOf = (narrative: any, id: string): number[] =>
    narrative.acts.filter((a: any) => a.scenes.some((s: any) => (s.cluesRevealed ?? []).includes(id))).map((a: any) => a.actNumber);

  for (const placement of [undefined, "sometime", ""]) {
    it(`placement ${JSON.stringify(placement)} → act 2`, () => {
      const narrative = outline();
      const clues = { clues: [{ id: "c1", criticality: "essential", placement }], clueTimeline: {} } as any;
      applyDeterministicCluePreAssignment(narrative, { CASE: {} } as any, clues, 0);
      expect(actOf(narrative, "c1")).toEqual([2]);
    });
  }

  it("valid placements are unchanged (early → 1, mid → 2, late → 3)", () => {
    for (const [placement, act] of [["early", 1], ["mid", 2], ["late", 3]] as const) {
      const narrative = outline();
      const clues = { clues: [{ id: "c1", criticality: "essential", placement }], clueTimeline: {} } as any;
      applyDeterministicCluePreAssignment(narrative, { CASE: {} } as any, clues, 0);
      expect(actOf(narrative, "c1")).toEqual([act]);
    }
  });
});

// ── A1X-Q04 ─────────────────────────────────────────────────────────────────

describe("A1X-Q04 — 2d's month/year are pinned to the mandate", () => {
  const RUN = "mystery-1790896091454";
  const mandate = generateSpecificDate("1930s", RUN);

  it("a reply with the wrong month (and year) is corrected, with a warning", () => {
    const wrongMonth = mandate.month === "January" ? "February" : "January";
    const tc = { specificDate: { year: mandate.year + 1, month: wrongMonth, era: "1930s", day: 4 } };
    const warning = pinSpecificDateToMandate(tc, "1930s", RUN);
    expect(tc.specificDate).toEqual({ year: mandate.year, month: mandate.month, era: "1930s", day: 4 });
    expect(warning).toMatch(/^\[A1X-Q04\]/);
    expect(warning).toContain(wrongMonth);
  });

  it("a matching reply is unchanged and produces no warning", () => {
    const tc = { specificDate: { year: mandate.year, month: mandate.month, era: "1930s" } };
    const before = JSON.stringify(tc);
    expect(pinSpecificDateToMandate(tc, "1930s", RUN)).toBeNull();
    expect(JSON.stringify(tc)).toBe(before);
  });

  it("no anchor id (the Math.random path) is never pinned", () => {
    const tc = { specificDate: { year: 1, month: "Nope" } };
    expect(pinSpecificDateToMandate(tc, "1930s", "")).toBeNull();
    expect(tc.specificDate).toEqual({ year: 1, month: "Nope" });
  });

  it("the anchor id: fresh run → runId; resume → the SOURCE run; unknown source → runId", () => {
    expect(temporalAnchorRunId({ runId: "mystery-1", projectId: "p1", inputs: {} as any })).toBe("mystery-1");
    expect(
      temporalAnchorRunId({ runId: "resume-99", projectId: "p1", inputs: { resumeFromRunId: "mystery-1" } as any }),
    ).toBe("mystery-1");
    // resume-run.ts falls back to the projectId when no originalRunId was given: that is not a run id.
    expect(temporalAnchorRunId({ runId: "resume-99", projectId: "p1", inputs: { resumeFromRunId: "p1" } as any })).toBe(
      "resume-99",
    );
  });
});

// ── A5-12 ───────────────────────────────────────────────────────────────────

describe("A5-12 — CML_VERIFIED_FIXES ON bypasses the memos", () => {
  const cmlWithSteps = (n: number) => ({
    CASE: { inference_path: { steps: Array.from({ length: n }, (_, i) => ({ observation: `obs ${i}`, correction: `cor ${i}` })) } },
  });

  it("ON: a mutation between two calls is seen by the second (whitelist + strict feedback)", () => {
    process.env.CML_VERIFIED_FIXES = "1";
    const cml = cmlWithSteps(1) as any;
    const first = buildStrictSourcePathWhitelist(cml).length;
    const firstFeedback = buildStrictPromptFeedback(cml)?.strictSourcePaths.length ?? 0;
    cml.CASE.inference_path.steps.push({ observation: "obs new", correction: "cor new" });
    expect(buildStrictSourcePathWhitelist(cml).length).toBeGreaterThan(first);
    expect(buildStrictPromptFeedback(cml)?.strictSourcePaths.length ?? 0).toBeGreaterThan(firstFeedback);
  });

  it("OFF: unchanged — the memo returns the first answer (the known staleness)", () => {
    const cml = cmlWithSteps(1) as any;
    const first = buildStrictSourcePathWhitelist(cml).length;
    cml.CASE.inference_path.steps.push({ observation: "obs new", correction: "cor new" });
    expect(buildStrictSourcePathWhitelist(cml).length).toBe(first);
  });

  it("ON: a cast mutation is seen by suspect coverage (OFF keeps the cached scan)", () => {
    const make = () => ({
      cml: {
        CASE: {
          cast: [
            { name: "Edith Marlowe", culprit_eligibility: "eligible" },
            { name: "Victor Crane", culprit_eligibility: "eligible" },
          ],
          culpability: { culprits: ["Victor Crane"] },
        },
      } as any,
      clues: { clues: [{ id: "c1", description: "A note in Marlowe's hand.", pointsTo: "", evidenceType: "observation" }] } as any,
    });
    const names = (r: any) => r.records.map((x: any) => x.suspect).sort();

    process.env.CML_VERIFIED_FIXES = "1";
    const on = make();
    const onBefore = names(analyzeSuspectCoverage(on.cml, on.clues));
    on.cml.CASE.cast.push({ name: "Hugo Pell", culprit_eligibility: "eligible" });
    expect(names(analyzeSuspectCoverage(on.cml, on.clues))).not.toEqual(onBefore);

    delete process.env.CML_VERIFIED_FIXES;
    const off = make();
    const offBefore = names(analyzeSuspectCoverage(off.cml, off.clues));
    off.cml.CASE.cast.push({ name: "Hugo Pell", culprit_eligibility: "eligible" });
    expect(names(analyzeSuspectCoverage(off.cml, off.clues))).toEqual(offBefore);
  });
});

// ── A5-Q04 ──────────────────────────────────────────────────────────────────

const topupFixture = (reply: unknown) => {
  const chat = vi.fn(async () => ({ content: typeof reply === "string" ? reply : JSON.stringify(reply), model: "stub" }));
  const ctx: any = {
    cml: {
      CASE: {
        false_assumption: { statement: "The gardener left by the orchard gate before nightfall", why_it_seems_reasonable: "His boots were by the scullery door" },
        culpability: { culprits: ["Victor Crane"] },
        cast: [
          { name: "Victor Crane", culprit_eligibility: "eligible" },
          { name: "Edith Marlowe", culprit_eligibility: "eligible" },
          { name: "Blackwood Harrowgate Pemberton", culprit_eligibility: "eligible" },
        ],
        inference_path: { steps: [{ observation: "o", correction: "Blackwood Harrowgate Pemberton altered the ledger" }] },
      },
    },
    client: {
      chat,
      getCostTracker: () => ({ getSummary: () => ({ byAgent: { "Agent5-ClueExtraction": 0.42 } }) }),
    },
    runId: "run-1",
    projectId: "proj-1",
    warnings: [] as string[],
    agentCosts: {} as Record<string, number>,
    agentDurations: {} as Record<string, number>,
  };
  const run: any = { failAgent5: vi.fn(() => { throw new Error("run aborted"); }) };
  const state: any = { extractionAttempt: 3 };
  return { ctx, run, state, chat };
};
const CLEAN = [
  { id: "rh_boots", description: "Muddy boots by the scullery door suggest Edith Marlowe came in late.", supportsAssumption: "gardener", misdirection: "Points at the orchard gate." },
  { id: "rh_gate", description: "The orchard gate latch hangs open at nightfall.", supportsAssumption: "gardener", misdirection: "Implies an exit before dark." },
];

describe("A5-Q04 — red-herring top-up after separation", () => {
  it("OFF: no call, no warning, clues untouched", async () => {
    const { ctx, run, state, chat } = topupFixture({ redHerrings: CLEAN });
    const clues: any = { clues: [], redHerrings: [] };
    const snapshot = JSON.stringify(clues);
    const out = await topUpRedHerringsAfterSeparation(ctx, run, state, clues);
    expect(out).toBe(clues);
    expect(JSON.stringify(clues)).toBe(snapshot);
    expect(chat).not.toHaveBeenCalled();
    expect(ctx.warnings).toEqual([]);
  });

  it("ON: asks for only the missing ones and appends the survivors", async () => {
    process.env.AGENT5_RED_HERRING_TOPUP = "1";
    const { ctx, run, state, chat } = topupFixture({ redHerrings: [CLEAN[1]] });
    const kept = { id: "rh_kept", description: "A torn glove in the orchard.", supportsAssumption: "x", misdirection: "y" };
    const clues: any = { clues: [], redHerrings: [kept] };
    await topUpRedHerringsAfterSeparation(ctx, run, state, clues);
    expect(chat).toHaveBeenCalledTimes(1);
    const call = (chat.mock.calls[0] as any[])[0];
    expect(call.logContext.agent).toBe("Agent5-ClueExtraction");
    expect(call.logContext.retryAttempt).toBe(3);
    const user = call.messages.find((m: any) => m.role === "user").content;
    expect(user).toContain("Write exactly 1 new red herring(s).");
    expect(user).toContain("The gardener left by the orchard gate before nightfall");
    expect(user).toMatch(/- altered/); // a correction word the pruner scores, listed as forbidden
    expect(user).toContain("rh_kept");
    expect(clues.redHerrings.map((r: any) => r.id)).toEqual(["rh_kept", "rh_gate"]);
    expect(ctx.warnings.some((w: string) => /^\[A5-Q04\] red-herring top-up after separation: 1 survived, asked for 1, model returned 1, 1 passed separation — now 2\/2/.test(w))).toBe(true);
    expect(ctx.agentCosts.agent5_clues).toBe(0.42);
    expect(run.failAgent5).not.toHaveBeenCalled();
  });

  it("ON: a reply the separation prunes is not appended, and the run is never aborted", async () => {
    process.env.AGENT5_RED_HERRING_TOPUP = "1";
    const leak = { id: "rh_leak", description: "blackwood harrowgate pemberton altered the ledger", supportsAssumption: "x", misdirection: "blackwood harrowgate pemberton" };
    const { ctx, run, state } = topupFixture({ redHerrings: [leak, CLEAN[0]] });
    const clues: any = { clues: [], redHerrings: [] };
    await topUpRedHerringsAfterSeparation(ctx, run, state, clues);
    expect(clues.redHerrings.map((r: any) => r.id)).toEqual(["rh_boots"]);
    expect(ctx.warnings.some((w: string) => w.startsWith("[A5-Q04] Agent 5 red-herring overlap hardening: pruned"))).toBe(true);
    expect(run.failAgent5).not.toHaveBeenCalled();
  });

  it("ON: at budget → no call; a failed call keeps the input", async () => {
    process.env.AGENT5_RED_HERRING_TOPUP = "1";
    const full = topupFixture({ redHerrings: CLEAN });
    const clues: any = { clues: [], redHerrings: [...CLEAN] };
    await topUpRedHerringsAfterSeparation(full.ctx, full.run, full.state, clues);
    expect(full.chat).not.toHaveBeenCalled();

    const broken = topupFixture("not json at all");
    const empty: any = { clues: [], redHerrings: [] };
    await topUpRedHerringsAfterSeparation(broken.ctx, broken.run, broken.state, empty);
    expect(empty.redHerrings).toEqual([]);
    expect(broken.ctx.warnings.some((w: string) => w.includes("model returned 0"))).toBe(true);
  });

  it("the prompt names the false assumption, the innocents, never the culprit as a target", () => {
    const { ctx } = topupFixture({});
    const { user } = buildRedHerringTopupPrompt(ctx.cml, { clues: [], redHerrings: [] } as any, 2);
    expect(user).toContain("innocent suspects: Edith Marlowe, Blackwood Harrowgate Pemberton.");
    expect(user).toContain("The culprit is Victor Crane");
  });
});

// ── A5-Q07 ──────────────────────────────────────────────────────────────────

describe("A5-Q07 — the clue-spec shadow names uncovered required slots", () => {
  it("a slot is covered by id, by source path (CASE. prefix ignored), or by step+evidence type", () => {
    const slots: any[] = [
      { id: "s1", sourceInCML: "CASE.inference_path.steps[0].observation", evidenceType: "observation", supportsInferenceStep: 1 },
      { id: "s2", sourceInCML: "CASE.inference_path.steps[1].observation", evidenceType: "observation", supportsInferenceStep: 2 },
      { id: "s3", sourceInCML: "CASE.inference_path.steps[2].observation", evidenceType: "contradiction", supportsInferenceStep: 3 },
      { id: "s4", sourceInCML: "CASE.cast[0].alibi_window", evidenceType: "elimination" },
    ];
    const shipped = [
      { id: "s1" },
      { id: "x", sourceInCML: "inference_path.steps[1].observation" },
      { id: "y", supportsInferenceStep: 3, evidenceType: "contradiction" },
    ];
    expect(uncoveredClueSpecSlots(slots, shipped).map((s) => s.id)).toEqual(["s4"]);
  });

  it("writes exactly one `[clue-spec shadow] uncovered:` line; AGENT5_DERIVE_SHADOW=0 silences it", () => {
    const cml = {
      CASE: {
        inference_path: { steps: [{ observation: "The clock was wound", correction: "It was wound late", required_evidence: ["key"] }] },
        cast: [{ name: "Edith Marlowe", culprit_eligibility: "eligible" }],
      },
    };
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const warnings: string[] = [];
    runClueSpecShadow({ cml, clues: { clues: [] }, warnings });
    const lines = warnings.filter((w) => w.startsWith("[clue-spec shadow] uncovered:"));
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/uncovered: (\d+)\/\1 required slots/); // nothing shipped → every slot uncovered

    process.env.AGENT5_DERIVE_SHADOW = "0";
    const silent: string[] = [];
    runClueSpecShadow({ cml, clues: { clues: [] }, warnings: silent });
    expect(silent).toEqual([]);
    info.mockRestore();
  });
});
