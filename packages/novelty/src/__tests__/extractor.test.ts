import { describe, expect, it } from "vitest";
import {
  buildSkeletonExtractionMessages,
  parseSkeletonResponse,
  createSkeletonExtractor,
} from "../extractor.js";
import { judgeNovelty } from "../compare.js";
import { loadReferenceCorpus } from "../loader.js";

// A_56 8-A — the LLM skeleton-extractor. These cover the pure prompt/parse seam (no real LLM): enum
// clamping, snake_case normalisation of the two label fields, and an end-to-end "extractor → judge"
// using a stubbed ChatFn that reproduces a known corpus fingerprint (which the judge must NOT call
// "distinct" — proving the labels are now in the comparison space, unlike a deterministic skeleton).

describe("parseSkeletonResponse", () => {
  it("parses a well-formed response into a 5-field Skeleton", () => {
    const sk = parseSkeletonResponse(
      JSON.stringify({
        axis: "temporal",
        mechanism_family: "poison_delayed",
        false_assumption_pattern: "time_of_symptom=time_of_act",
        discriminating_test_shape: "chemical_timing",
        inference_shape: "decouple_act_from_symptom",
        premise: "Strychnine kills hours later.",
      }),
      "run-1",
    );
    expect(sk.axis).toBe("temporal");
    expect(sk.mechanism_family).toBe("poison_delayed");
    expect(sk.false_assumption_pattern).toBe("time_of_symptom=time_of_act");
    expect(sk.discriminating_test_shape).toBe("chemical_timing");
    expect(sk.inference_shape).toBe("decouple_act_from_symptom");
    expect(sk.id).toBe("run-1");
  });

  it("clamps invalid enum values to safe fallbacks (never throws)", () => {
    const sk = parseSkeletonResponse(
      JSON.stringify({
        axis: "made_up_axis",
        mechanism_family: "not_a_family",
        false_assumption_pattern: "Whatever The Reader Thinks!",
        discriminating_test_shape: "nonsense",
        inference_shape: "Some Deductive Move",
      }),
    );
    expect(["temporal", "spatial", "identity", "epistemic", "behavioral", "authority"]).toContain(sk.axis);
    expect(sk.mechanism_family).toBe("staged_scene"); // fallback
    expect(sk.discriminating_test_shape).toBe("physical_trace"); // fallback
    // label fields are snake-cased so the judge's norm() can compare them
    expect(sk.false_assumption_pattern).toBe("whatever_the_reader_thinks");
    expect(sk.inference_shape).toBe("some_deductive_move");
  });

  it("tolerates code fences around the JSON", () => {
    const sk = parseSkeletonResponse("```json\n{\"axis\":\"spatial\",\"mechanism_family\":\"locked_room_timing\",\"false_assumption_pattern\":\"x\",\"discriminating_test_shape\":\"timetable_contradiction\",\"inference_shape\":\"y\"}\n```");
    expect(sk.axis).toBe("spatial");
    expect(sk.mechanism_family).toBe("locked_room_timing");
  });
});

describe("buildSkeletonExtractionMessages", () => {
  it("includes the CML structural fields and the enum constraints", () => {
    const msgs = buildSkeletonExtractionMessages({
      CASE: {
        hidden_model: { mechanism: { description: "a rewound longcase clock" } },
        false_assumption: { type: "temporal", statement: "the clock showed the true time" },
        discriminating_test: { method: "compare the chime timing", design: "timetable" },
        surface_model: { narrative: { summary: "A manor murder." } },
      },
    });
    expect(msgs).toHaveLength(2);
    expect(msgs[0].content).toContain("poison_delayed"); // enum list present
    expect(msgs[1].content).toContain("rewound longcase clock"); // mechanism surfaced
    expect(msgs[1].content).toContain("A manor murder."); // premise surfaced
  });
});

describe("createSkeletonExtractor → judgeNovelty (end-to-end via stub ChatFn)", () => {
  it("a skeleton reproducing a corpus fingerprint is NOT judged 'distinct' (labels are in the comparison space)", async () => {
    // Stub the LLM: return the_mysterious_affair_at_styles' abstract fingerprint verbatim.
    const extract = createSkeletonExtractor(async () => ({
      content: JSON.stringify({
        axis: "temporal",
        mechanism_family: "poison_delayed",
        false_assumption_pattern: "time_of_symptom=time_of_act",
        discriminating_test_shape: "chemical_timing",
        inference_shape: "decouple_act_from_symptom",
      }),
    }));
    const skeleton = await extract({ CASE: {} }, "run-x");
    const verdict = judgeNovelty(skeleton, loadReferenceCorpus());
    // Shares the wrong belief + the trick → at least a structural variation, never "distinct".
    expect(verdict.verdict).not.toBe("distinct");
    expect(verdict.nearest).not.toBeNull();
  });

  it("a genuinely novel skeleton is judged 'distinct'", async () => {
    const extract = createSkeletonExtractor(async () => ({
      content: JSON.stringify({
        axis: "authority",
        mechanism_family: "information_leak",
        false_assumption_pattern: "the_official_record_is_complete",
        discriminating_test_shape: "behavioral_tell",
        inference_shape: "expose_suppressed_amendment",
      }),
    }));
    const verdict = judgeNovelty(await extract({ CASE: {} }), loadReferenceCorpus());
    expect(verdict.verdict).toBe("distinct");
  });
});
