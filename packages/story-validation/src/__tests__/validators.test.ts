/**
 * Unit tests for the four story-quality validators:
 *   - NarrativeContinuityValidator
 *   - CaseTransitionValidator
 *   - DiscriminatingTestValidator
 *   - SuspectClosureValidator
 */
import { describe, it, expect, beforeEach } from "vitest";
import { NarrativeContinuityValidator } from "../narrative-continuity-validator.js";
import { CaseTransitionValidator } from "../case-transition-validator.js";
import { DiscriminatingTestValidator } from "../discriminating-test-validator.js";
import { SuspectClosureValidator } from "../suspect-closure-validator.js";
import type { Story, CMLData, Scene } from "../types.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeScene(overrides: Partial<Scene> & { text: string }): Scene {
  return {
    number: 1,
    title: "Scene",
    ...overrides,
  };
}

function makeStory(scenes: Scene[]): Story {
  return { id: "s1", projectId: "p1", scenes };
}

function makeCML(culprits: string[], castExtras: string[] = []): CMLData {
  const allNames = [...culprits, ...castExtras];
  return {
    CASE: {
      meta: {},
      cast: allNames.map((name) => ({ name, role_archetype: "suspect" })),
      culpability: { culprits },
    },
  };
}

// ─── NarrativeContinuityValidator ────────────────────────────────────────────

describe("NarrativeContinuityValidator", () => {
  let validator: NarrativeContinuityValidator;

  beforeEach(() => {
    validator = new NarrativeContinuityValidator();
  });

  it("passes a clean story with no continuity issues", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "The guests arrived at the manor." }),
      makeScene({ number: 2, text: "Inspector Drake examined the evidence carefully." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("passes when disappearance and murder co-exist with a bridge term", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "Lord Ashby had disappeared from the scene." }),
      makeScene({ number: 2, text: "The body was found in the cellar; the missing person case became a murder." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(true);
  });

  it("flags missing bridge when transitioning from disappearance to murder", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "Lord Ashby had disappeared without trace." }),
      makeScene({ number: 2, text: "He had been murdered, clearly." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(false);
    expect(result.errors[0].type).toBe("missing_case_transition_bridge");
    expect(result.errors[0].severity).toBe("major");
    expect(result.errors[0].sceneNumber).toBe(2);
  });

  it("passes when no disappearance is mentioned before murder terms", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "The victim was found dead at dawn." }),
      makeScene({ number: 2, text: "The body had been moved from the study." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(true);
  });

  it("flags identity role aliasing after arrest/confession", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "Clara admitted it. She was arrested." }),
      makeScene({ number: 2, text: "The killer fled before the inspector arrived." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(false);
    expect(result.errors[0].type).toBe("identity_role_alias_break");
    expect(result.errors[0].severity).toBe("critical");
    expect(result.errors[0].sceneNumber).toBe(2);
  });

  it("passes when post-arrest scene uses stable name, not role alias", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "Clara confessed. She was under arrest." }),
      makeScene({ number: 2, text: "Clara was escorted to the station." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(true);
  });

  it("does not flag role alias before any arrest/confession scene", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "The killer was still at large." }),
      makeScene({ number: 2, text: "The murderer left no fingerprints." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(true);
  });
});

// ─── CaseTransitionValidator ──────────────────────────────────────────────────

describe("CaseTransitionValidator", () => {
  let validator: CaseTransitionValidator;

  beforeEach(() => {
    validator = new CaseTransitionValidator();
  });

  it("passes when story has no disappearance signal", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "The victim was found dead in the library." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(true);
  });

  it("passes when story has disappearance and bridge and murder terms", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "She had vanished three days ago." }),
      makeScene({ number: 2, text: "The body was found in the river. The murder was confirmed." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(true);
  });

  it("flags missing bridge when both disappearance and murder mentioned without bridge", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "He had gone missing last Tuesday." }),
      makeScene({ number: 2, text: "The police now treated it as a homicide." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(false);
    expect(result.errors[0].type).toBe("case_transition_missing");
    expect(result.errors[0].severity).toBe("major");
  });

  it("passes when CML has missing status but story has bridge", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "He had disappeared last week." }),
      makeScene({ number: 2, text: "Confirmed dead — identified the body near the lake." }),
    ]);
    const cml: CMLData = {
      CASE: {
        meta: { crime_class: { victim_identity_status: "missing" } },
        cast: [],
      },
    };
    const result = validator.validate(story, cml);
    expect(result.valid).toBe(true);
  });

  it("flags missing bridge even with CML missing status", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "She had vanished entirely." }),
      makeScene({ number: 2, text: "The murder weapon was recovered." }),
    ]);
    const cml: CMLData = {
      CASE: {
        meta: { crime_class: { victim_identity_status: "missing" } },
        cast: [],
      },
    };
    const result = validator.validate(story, cml);
    expect(result.valid).toBe(false);
    expect(result.errors[0].type).toBe("case_transition_missing");
  });

  it("passes when story has only disappearance terms but no murder at all", () => {
    const story = makeStory([
      makeScene({ number: 1, text: "Lady Forsyth had gone missing, the household worried." }),
    ]);
    const result = validator.validate(story);
    expect(result.valid).toBe(true);
  });
});

// ─── DiscriminatingTestValidator ─────────────────────────────────────────────

describe("DiscriminatingTestValidator", () => {
  let validator: DiscriminatingTestValidator;

  beforeEach(() => {
    // No LLM client — regex-only mode
    validator = new DiscriminatingTestValidator();
  });

  it("passes when scene has test + exclusion + evidence terms", async () => {
    const story = makeStory([
      makeScene({
        number: 1,
        text: "The detective set a trap to test the suspect. Only one person could have reached the cabinet, because the window lock was verified to have been shut. The evidence excluded everyone else.",
      }),
    ]);
    const result = await validator.validate(story);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("flags missing discriminating test when no scene qualifies", async () => {
    const story = makeStory([
      makeScene({ number: 1, text: "Everyone suspected everyone else." }),
      makeScene({ number: 2, text: "The inspector questioned the staff." }),
    ]);
    const result = await validator.validate(story);
    expect(result.valid).toBe(false);
    expect(result.errors[0].type).toBe("missing_discriminating_test");
    expect(result.errors[0].severity).toBe("critical");
  });

  it("flags test without exclusion language as insufficient", async () => {
    const story = makeStory([
      makeScene({ number: 1, text: "The detective ran an experiment and gathered evidence from the scene." }),
    ]);
    // Has 'experiment' + 'evidence' but not exclusion — should fail
    const result = await validator.validate(story);
    expect(result.valid).toBe(false);
    expect(result.errors[0].type).toBe("missing_discriminating_test");
  });

  it("flags test without evidence terms as insufficient", async () => {
    const story = makeStory([
      makeScene({ number: 1, text: "The detective set a trap and ruled out the butler entirely." }),
    ]);
    // Has 'trap' + 'ruled out' but not evidence — should fail
    const result = await validator.validate(story);
    expect(result.valid).toBe(false);
  });

  it("passes with 're-enactment' terminology that satisfies all three term groups", async () => {
    const story = makeStory([
      makeScene({
        number: 1,
        text: "A re-enactment showed, therefore, that only she could have been the culprit — everyone else was eliminated because the time-measured observation proved it.",
      }),
    ]);
    const result = await validator.validate(story);
    expect(result.valid).toBe(true);
  });

  it("flags cml_test_not_realized when CML has discriminating test but no prose scene mentions test", async () => {
    const story = makeStory([
      makeScene({ number: 1, text: "The inspector was puzzled by the whole affair." }),
    ]);
    const cml: CMLData = {
      CASE: {
        meta: {},
        cast: [],
        discriminating_test: {
          method: "timing analysis",
          design: "The window could only have been opened from inside",
        },
      },
    };
    const result = await validator.validate(story, cml);
    expect(result.valid).toBe(false);
    // Should have at minimum the missing_discriminating_test error
    expect(result.errors.some((e) => e.type === "missing_discriminating_test")).toBe(true);
  });
});

// ─── SuspectClosureValidator ──────────────────────────────────────────────────

describe("SuspectClosureValidator", () => {
  let validator: SuspectClosureValidator;

  beforeEach(() => {
    validator = new SuspectClosureValidator();
  });

  it("passes without CML — closure check is skipped", async () => {
    const story = makeStory([makeScene({ number: 1, text: "A fine story." })]);
    const result = await validator.validate(story);
    expect(result.valid).toBe(true);
  });

  it("passes when every non-culprit suspect is cleared with evidence", async () => {
    const story = makeStory([
      makeScene({
        number: 1,
        text: "Dr. Harlow was cleared: his alibi holds — he was observed at the club at the time. Therefore he is innocent.",
      }),
      makeScene({
        number: 2,
        text: "Colonel Blake was the culprit. The evidence proved it because his fingerprints matched.",
      }),
    ]);
    const cml = makeCML(["Colonel Blake"], ["Dr. Harlow"]);
    const result = await validator.validate(story, cml);
    expect(result.valid).toBe(true);
  });

  it("flags a suspect with no closure scene", async () => {
    const story = makeStory([
      makeScene({
        number: 1,
        text: "Colonel Blake was the culprit. The evidence proved it because his fingerprints matched.",
      }),
    ]);
    // Dr. Harlow is a suspect but never mentioned with clearing language
    const cml = makeCML(["Colonel Blake"], ["Dr. Harlow"]);
    const result = await validator.validate(story, cml);
    expect(result.valid).toBe(false);
    expect(result.errors[0].type).toBe("suspect_closure_missing");
    expect(result.errors[0].message).toContain("Dr. Harlow");
  });

  it("flags suspect present in scene but without elimination language", async () => {
    const story = makeStory([
      makeScene({
        number: 1,
        text: "Dr. Harlow was questioned but said nothing useful.",
      }),
      makeScene({
        number: 2,
        text: "Colonel Blake was the culprit because the proof was overwhelming.",
      }),
    ]);
    const cml = makeCML(["Colonel Blake"], ["Dr. Harlow"]);
    const result = await validator.validate(story, cml);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.message.includes("Dr. Harlow"))).toBe(true);
  });

  it("flags missing culprit evidence chain", async () => {
    const story = makeStory([
      makeScene({
        number: 1,
        text: "Dr. Harlow was cleared — his alibi holds and therefore he is innocent.",
      }),
      makeScene({
        number: 2,
        // Mentions culprit but no culprit + evidence combination
        text: "Colonel Blake stood in the doorway silently.",
      }),
    ]);
    const cml = makeCML(["Colonel Blake"], ["Dr. Harlow"]);
    const result = await validator.validate(story, cml);
    expect(result.valid).toBe(false);
    expect(result.errors[0].type).toBe("culprit_evidence_chain_missing");
    expect(result.errors[0].message).toContain("Colonel Blake");
  });

  it("passes with two culprits both evidenced", async () => {
    const story = makeStory([
      makeScene({
        number: 1,
        text: "Mrs. Vane was eliminated — the alibi holds, therefore she is not the culprit.",
      }),
      makeScene({
        number: 2,
        text: "Colonel Blake and Miss Dray were the murderers. The evidence proved it because the signed letter was found.",
      }),
    ]);
    const cml = makeCML(["Colonel Blake", "Miss Dray"], ["Mrs. Vane"]);
    const result = await validator.validate(story, cml);
    expect(result.valid).toBe(true);
  });

  it("skips culprits from suspect elimination check", async () => {
    // The culprit must not appear in the suspect-cleared list
    const story = makeStory([
      makeScene({
        number: 1,
        text: "Colonel Blake was the killer. The evidence proved it because of the glove.",
      }),
    ]);
    // No non-culprit suspects — only culprit in cast
    const cml = makeCML(["Colonel Blake"]);
    const result = await validator.validate(story, cml);
    expect(result.valid).toBe(true);
  });
});
