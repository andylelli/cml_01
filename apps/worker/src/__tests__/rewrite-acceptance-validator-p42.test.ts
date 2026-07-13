import { describe, expect, it } from "vitest";
import { buildRewriteAcceptanceValidator } from "../jobs/agents/agent9-run.js";
import { deriveMechanismTerms } from "@cml/prompts-llm";

// Ledger P4.2 — a creative-temperature critique-rewrite may not REINTRODUCE defect classes the
// regen passes already cleared. The validator self-baselines via isRegression (validate(original)
// vs validate(candidate)), so these tests assert the VIOLATION DELTA between original and rewrite.

const ch = (text: string) => ({ title: "Ch", paragraphs: [text] });

describe("buildRewriteAcceptanceValidator — case-transition reintroduction", () => {
  it("flags a rewrite that REMOVES the bridge from a death chapter after a disappearance frame", () => {
    const snapshot = [
      ch("Lady Beatrice Wentworth vanished from the terrace before supper."),
      ch("Then the body was found in the ravine; it was murder."), // bridged → clean
    ];
    const validate = buildRewriteAcceptanceValidator({
      atomicValues: [],
      chapterSnapshot: snapshot,
      mechanismTerms: [],
      dtChapter: null,
      index: 1,
      original: snapshot[1],
    });
    expect(validate(snapshot[1]).violations).toEqual([]); // baseline clean
    const rewritten = ch("It was murder, plain and cold, and the household knew it.");
    const after = validate(rewritten);
    expect(after.ok).toBe(false);
    expect(after.violations).toContain("case_transition_defect_ch2");
  });

  it("flags a rewrite that ADDS a disappearance frame ahead of an unbridged death chapter", () => {
    const snapshot = [
      ch("The household dined late; nothing seemed amiss."), // no person-disappearance
      ch("By morning the inspector called it murder."), // death, no bridge — but no frame, so clean
    ];
    const validate = buildRewriteAcceptanceValidator({
      atomicValues: [],
      chapterSnapshot: snapshot,
      mechanismTerms: [],
      dtChapter: null,
      index: 0,
      original: snapshot[0],
    });
    expect(validate(snapshot[0]).violations).toEqual([]);
    const rewritten = ch("The household dined late; she had been missing since Tuesday.");
    const after = validate(rewritten);
    expect(after.ok).toBe(false);
    expect(after.violations).toContain("case_transition_defect_ch2");
  });

  it("does NOT flag a rewrite when the defect existed in the ORIGINAL too (self-baseline via isRegression)", () => {
    const snapshot = [
      ch("She had been missing since Tuesday."),
      ch("By morning the inspector called it murder."), // defect pre-exists
    ];
    const validate = buildRewriteAcceptanceValidator({
      atomicValues: [],
      chapterSnapshot: snapshot,
      mechanismTerms: [],
      dtChapter: null,
      index: 1,
      original: snapshot[1],
    });
    const before = validate(snapshot[1]);
    const rewritten = ch("By morning the inspector called it murder, and the fog pressed at the glass.");
    const after = validate(rewritten);
    // same violation before and after — isRegression's newViolations diff would pass this rewrite
    expect(before.violations).toContain("case_transition_defect_ch2");
    expect(after.violations).toContain("case_transition_defect_ch2");
    expect(after.violations.filter((v) => !before.violations.includes(v))).toEqual([]);
  });
});

describe("buildRewriteAcceptanceValidator — mechanism-too-early reintroduction", () => {
  const MECH = "The culprit rewound the mantel clock and reset the hands to fabricate the alibi timing.";
  const mechanismTerms = deriveMechanismTerms(MECH);

  it("flags a PRE-discriminating-test rewrite that gains a full mechanism explanation", () => {
    const original = ch("The mantel clock, its hands still, sat beside the culprit's chair; the alibi and the timing troubled her.");
    const validate = buildRewriteAcceptanceValidator({
      atomicValues: [],
      chapterSnapshot: [original],
      mechanismTerms,
      dtChapter: 5,
      index: 0, // chapter 1, strictly before DT chapter 5
      original,
    });
    expect(validate(original).violations).toEqual([]); // naming nouns without the causal marker is fine
    const rewritten = ch("Then she rewound the mantel clock and reset the hands to fabricate the alibi timing, so the culprit's scheme held.");
    const after = validate(rewritten);
    expect(after.ok).toBe(false);
    expect(after.violations).toContain("mechanism_revealed_early");
  });

  it("does NOT flag the discriminating-test chapter itself explaining the mechanism", () => {
    const original = ch("The test was prepared in silence.");
    const validate = buildRewriteAcceptanceValidator({
      atomicValues: [],
      chapterSnapshot: [original],
      mechanismTerms,
      dtChapter: 1, // index 0 IS the DT chapter → not strictly before
      index: 0,
      original,
    });
    const rewritten = ch("Then she rewound the mantel clock and reset the hands to fabricate the alibi timing, so the culprit's scheme held.");
    expect(validate(rewritten).violations).not.toContain("mechanism_revealed_early");
  });
});

describe("buildRewriteAcceptanceValidator — existing guards still hold", () => {
  it("still detects a dropped locked fact", () => {
    const original = ch("The clock had stopped at half past three, and no one spoke.");
    const validate = buildRewriteAcceptanceValidator({
      atomicValues: ["half past three"],
      chapterSnapshot: [original],
      mechanismTerms: [],
      dtChapter: null,
      index: 0,
      original,
    });
    const rewritten = ch("The clock had stopped, and no one spoke.");
    const after = validate(rewritten);
    expect(after.ok).toBe(false);
    expect(after.violations).toContain("dropped_locked_fact:half past three");
  });
});
