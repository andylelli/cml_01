/**
 * A_73 — the per-agent model router.
 *
 * The property that matters most is the LAST one: with nothing configured, every agent resolves to
 * the caller's default. A cost knob that changes behaviour when nobody has touched it is not a knob,
 * it is a regression.
 */
import { describe, it, expect } from "vitest";
import { resolveAgentModel, agentModelEnvVar } from "../agent-model-router.js";

describe("agentModelEnvVar", () => {
  it.each([
    ["Agent1-SettingRefiner", "AGENT1_MODEL"],
    ["Agent2-CastDesigner", "AGENT2_MODEL"],
    ["Agent2c-LocationProfiles", "AGENT2C_MODEL"],
    ["Agent3b-HardLogicDeviceGenerator", "AGENT3B_MODEL"],
    ["Agent65-WorldBuilder", "AGENT65_MODEL"],
    ["Agent9-ProseGenerator", "AGENT9_MODEL"],
  ])("%s → %s", (label, expected) => {
    expect(agentModelEnvVar(label)).toBe(expected);
  });

  it("snake-cases labels that carry no agent number", () => {
    expect(agentModelEnvVar("RubricScorer")).toBe("RUBRIC_SCORER_MODEL");
    expect(agentModelEnvVar("NoveltySkeletonJudge")).toBe("NOVELTY_SKELETON_JUDGE_MODEL");
  });

  it("returns null for an empty label rather than inventing a variable", () => {
    expect(agentModelEnvVar("")).toBeNull();
    expect(agentModelEnvVar("   ")).toBeNull();
  });
});

describe("resolveAgentModel", () => {
  const DEFAULT = "gpt-4.1";

  it("returns the caller's default when nothing is configured", () => {
    expect(resolveAgentModel("Agent2c-LocationProfiles", DEFAULT, {})).toBe(DEFAULT);
  });

  it("routes an agent to its configured model", () => {
    const env = { AGENT2C_MODEL: "gpt-4.1-mini" } as NodeJS.ProcessEnv;
    expect(resolveAgentModel("Agent2c-LocationProfiles", DEFAULT, env)).toBe("gpt-4.1-mini");
  });

  it("routes ONLY the agent named — a sibling keeps the default", () => {
    const env = { AGENT2C_MODEL: "gpt-4.1-mini" } as NodeJS.ProcessEnv;
    expect(resolveAgentModel("Agent2b-CharacterProfiles", DEFAULT, env)).toBe(DEFAULT);
    expect(resolveAgentModel("Agent3-CMLGenerator", DEFAULT, env)).toBe(DEFAULT);
  });

  it("treats an empty or whitespace override as unset, never as an empty model", () => {
    expect(resolveAgentModel("Agent1-SettingRefiner", DEFAULT, { AGENT1_MODEL: "" })).toBe(DEFAULT);
    expect(resolveAgentModel("Agent1-SettingRefiner", DEFAULT, { AGENT1_MODEL: "   " })).toBe(DEFAULT);
  });

  it("falls back when the agent label is absent — an unlabelled call is not a routing decision", () => {
    expect(resolveAgentModel(undefined, DEFAULT, { AGENT1_MODEL: "gpt-4.1-mini" })).toBe(DEFAULT);
  });

  it("with an EMPTY env, no agent in the 08-25 run would move off the default", () => {
    // The full agent list from mystery-1787681973166's call log. If any of these resolved to
    // something other than the default with no configuration, the router would be a silent
    // behaviour change rather than a cost knob.
    const agents = [
      "Agent1-SettingRefiner", "Agent2-CastDesigner", "Agent2b-CharacterProfiles",
      "Agent2c-LocationProfiles", "Agent2d-TemporalContext", "Agent2e-BackgroundContext",
      "Agent3-CMLGenerator", "Agent3b-HardLogicDeviceGenerator", "Agent5-ClueExtraction",
      "Agent6-FairPlayAuditor", "Agent6-BlindReader", "Agent65-WorldBuilder",
      "Agent7-NarrativeFormatter", "Agent8-NoveltyAuditor", "Agent9-ProseGenerator",
      "RubricScorer", "NoveltySkeletonJudge",
    ];
    for (const a of agents) expect(resolveAgentModel(a, DEFAULT, {})).toBe(DEFAULT);
  });
});
