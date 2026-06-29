import { describe, expect, it } from "vitest";
import { extractStoryFacts } from "../facts.js";

// A_56 1-C — a victim promoted via `culpability.victim` (no `role:victim` cast tag) must still resolve,
// so `victimUnnamed` fires consistently with the prose-side stageContractCheck. Previously the facts
// extractor omitted this path, leaving non-role-victim cases silently unguarded.

const cml = (victim: string) => ({
  CASE: { cast: [], culpability: { victim, culprits: ["Mr Hyde"] } },
});

describe("extractStoryFacts — victim resolves via culpability.victim (A_56 1-C)", () => {
  it("flags victimUnnamed when culpability.victim is set but absent from the prose", () => {
    const facts = extractStoryFacts(cml("Lady Pemberton"), "The detective examined the empty study.");
    expect(facts.victimUnnamed).toBe(true);
  });

  it("does NOT flag victimUnnamed when the culpability.victim name appears in the prose", () => {
    const facts = extractStoryFacts(cml("Lady Pemberton"), "Lady Pemberton was found dead in the study.");
    expect(facts.victimUnnamed).toBe(false);
  });

  it("leaves victimUnnamed undefined when no victim is resolvable at all (judge decides)", () => {
    const facts = extractStoryFacts({ CASE: { cast: [], culpability: { culprits: ["Mr Hyde"] } } }, "anything");
    expect(facts.victimUnnamed).toBeUndefined();
  });
});
