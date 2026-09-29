import { describe, expect, it } from "vitest";
import { CastDesignScorer } from "../phase-scorers/agent2-cast-scorer.js";
import { CharacterProfilesScorer } from "../phase-scorers/agent2b-character-profiles-scorer.js";
import { LocationProfilesScorer } from "../phase-scorers/agent2c-location-profiles-scorer.js";
import { HardLogicScorer } from "../phase-scorers/agent4-hard-logic-scorer.js";

/**
 * SCO-D07 — a scorer handed an output without its main array threw from `checkCompleteness`, and the
 * caller logged "Scoring failed … continuing without retry" instead of recording a score. Absent is
 * empty: the scorer returns a failing score.
 */
describe("phase scorers grade a missing array instead of throwing (SCO-D07)", () => {
  const ctx = { previous_phases: {}, cml: undefined as any, threshold_config: { mode: "standard" as const } };
  for (const [name, scorer] of [
    ["cast", new CastDesignScorer()],
    ["character profiles", new CharacterProfilesScorer()],
    ["location profiles", new LocationProfilesScorer()],
    ["hard logic", new HardLogicScorer()],
  ] as const) {
    it(name, async () => {
      const score = await (scorer as any).score({}, {}, ctx);
      expect(score.passed).toBe(false);
      expect(typeof score.total).toBe("number");
    });
  }
});
