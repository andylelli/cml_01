import { describe, expect, it } from "vitest";
import { detectLockedFactClueTimeMismatch } from "../jobs/agents/agent9-run.js";

// Abort class #9 (M2-era, 2026-07-19, run mystery-1784457594600): the hard-stop comparator did an
// absolute-minutes diff, so a meridiem-less word-form locked time ("ten minutes to nine" = 8:50)
// against an explicit-meridiem clue time ("8:00 pm") scored 670 minutes apart instead of 50 and
// aborted a fully-designed run pre-prose. The fixtures pin both directions: the FP must stay dead
// AND genuinely irreconcilable times must still hard-stop (detector power proven, not deleted).
describe("detectLockedFactClueTimeMismatch — 12-hour-circle comparison on asymmetric meridiem", () => {
  it("class-#9 fixture: word-form fact vs same-evening pm clue 50 min apart is NOT a violation", () => {
    expect(
      detectLockedFactClueTimeMismatch(
        "ten minutes to nine",
        "The lobby ledger notes the porter's round at 8:00 pm, before the alarm was raised.",
      ),
    ).toBeNull();
  });

  it("word-form fact vs pm clue >60 min apart on the 12-hour circle still flags as ambiguity", () => {
    const verdict = detectLockedFactClueTimeMismatch(
      "ten minutes to nine",
      "Witness states they heard the crash at 11:30 pm.",
    );
    expect(verdict).not.toBeNull();
    expect(verdict?.type).toBe("ambiguity");
    expect(verdict?.rawClueTime).toBe("11:30 pm");
  });

  it("both-explicit meridiem, >60 min apart, flags as mismatch (absolute clock)", () => {
    const verdict = detectLockedFactClueTimeMismatch(
      "8:50 pm",
      "The note fixes the appointment at 11:30 pm.",
    );
    expect(verdict).not.toBeNull();
    expect(verdict?.type).toBe("mismatch");
  });

  it("both-explicit meridiem, <60 min apart, is NOT a violation", () => {
    expect(
      detectLockedFactClueTimeMismatch("8:50 pm", "The concierge logged the call at 8:10 pm."),
    ).toBeNull();
  });

  it("hour-boundary wraparound: word-form o'clock vs pm clue 15 min apart is NOT a violation", () => {
    expect(
      detectLockedFactClueTimeMismatch(
        "eleven o'clock",
        "The night porter clocked the corridor light at 11:15 pm.",
      ),
    ).toBeNull();
  });

  it("clue with no digit-form time is ignored", () => {
    expect(
      detectLockedFactClueTimeMismatch(
        "ten minutes to nine",
        "The hall clock face had been wiped clean of dust.",
      ),
    ).toBeNull();
  });
});
