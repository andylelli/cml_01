import { describe, expect, it } from "vitest";
import { isFullSentenceBleed } from "../jobs/agents/agent2c-run.js";

// A_58 #6 — the F5b sensory-bleed detector flagged "rain-speckled rose petals" as "contains verb" because
// CONJUGATED_VERB_RE matches "rose" (the flower vs the past tense of rise). Bleed = a full SENTENCE, so a
// finite verb AND clause-length is required; a short noun phrase with a homograph must NOT be flagged.

describe("isFullSentenceBleed (A_58 #6)", () => {
  it("does NOT flag short noun phrases that contain a verb-homograph noun", () => {
    expect(isFullSentenceBleed("rain-speckled rose petals")).toBe(false); // the run's false positive
    expect(isFullSentenceBleed("sun-warmed gravel paths")).toBe(false);
    expect(isFullSentenceBleed("cast-iron gate")).toBe(false);
    expect(isFullSentenceBleed("low fire in the grate")).toBe(false);
  });

  it("DOES flag a genuine full-sentence bleed (finite verb + clause length)", () => {
    expect(isFullSentenceBleed("rain drifted slowly across the empty terrace at dusk")).toBe(true);
    expect(isFullSentenceBleed("the mantel clock ticked steadily through the silent hall")).toBe(true);
  });
});
