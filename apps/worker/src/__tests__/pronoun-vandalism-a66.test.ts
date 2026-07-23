import { describe, expect, it } from "vitest";
import { applyTargetedPronounSweep, buildHighPrecisionPronounValidator } from "../jobs/agents/agent9-run.js";

// A_66 — the worker-level vandalism fixtures. Probe #1's forensics: the late parity pass ran
// applyTargetedPronounSweep on pronoun-CLEAN drafts (seeded by false-positive proximity
// detections naming all six cast members) and manufactured all 27 shipped drift instances.

const CAST: any[] = [
  { name: "Hugo Vane", gender: "male" },
  { name: "Eleanor Voss", gender: "female" },
  { name: "Dr. Mallory Finch", gender: "female" },
  { name: "Beatrice Quill", gender: "female" },
  { name: "Sylvia Trent", gender: "female" },
  { name: "Captain Ivor Hale", gender: "male" },
];

const CLEAN_PROSE = {
  chapters: [
    {
      title: "Chapter 2",
      paragraphs: [
        "Hugo set the watch on the parquet beside Eleanor's hand.",
        "He glanced at the others—Dr. Finch's composure was brittle, her lips pressed tight, while Captain Hale's fingers drummed a silent tattoo against his sleeve.",
        "He reached for Eleanor's evening bag, its clasp stiff and cold beneath his fingers.",
      ],
    },
  ],
};

describe("A_66 — applyTargetedPronounSweep on clean drafts (the probe-#1 replay, worker level)", () => {
  it("makes ZERO text changes even when the false-positive seed targets every cast member", () => {
    const targets = new Set(CAST.map((c) => c.name)); // the probe-#1 shape: all six targeted
    const res = applyTargetedPronounSweep(CLEAN_PROSE, CAST, targets);
    expect(res.prose.chapters[0].paragraphs).toEqual(CLEAN_PROSE.chapters[0].paragraphs);
  });
});

describe("A_66 P2 — the high-precision guard metric", () => {
  const validator = buildHighPrecisionPronounValidator(CAST);

  it("scores clean prose 100 (no signal from name-proximity fallacies)", () => {
    const r = validator(CLEAN_PROSE);
    expect(r.ok).toBe(true);
    expect(r.score).toBe(100);
  });

  it("penalizes a genuine impossible self-reference (the precision family fires)", () => {
    const drifted = {
      chapters: [
        { title: "Ch3", paragraphs: ["Eleanor composed himself before speaking to the assembled guests."] },
      ],
    };
    const r = validator(drifted);
    expect(r.ok).toBe(false);
    expect(r.score).toBeLessThan(100);
    expect(r.violations).toEqual(["pronoun_high_precision_mismatch"]);
  });

  it("a mutation that INTRODUCES a high-precision mismatch scores strictly worse than clean (the revert signal)", () => {
    const before = validator(CLEAN_PROSE).score;
    const vandalized = {
      chapters: [
        {
          title: "Chapter 2",
          paragraphs: [
            // Hugo is the ONLY referent in the window; the tag pronoun is female → attribution flip.
            'Hugo crossed the room and lifted the latch. "I saw nothing," she said.',
          ],
        },
      ],
    };
    expect(validator(vandalized).score).toBeLessThan(before);
  });
});
