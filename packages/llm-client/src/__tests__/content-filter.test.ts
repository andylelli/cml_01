import { describe, expect, it } from "vitest";
import {
  ContentFilterTracker,
  contentFilterFamily,
  isContentFilterRefusal,
} from "../content-filter.js";

/**
 * A_71 (A_70 §5). The 07-27 run took 10 refusals — 6 on Ch2, 2 on Ch5, 2 on Ch6, all
 * `missing_clue` regens — and none of them appeared in any artifact. These pin the detector against
 * the exact message Azure returned, and against the ordinary telemetry it must NOT claim.
 */

const AZURE_REFUSAL =
  "The response was filtered due to the prompt triggering Azure OpenAI's content management policy. " +
  "Please modify your prompt and retry.";

describe("isContentFilterRefusal", () => {
  it("detects the message Azure actually returned on the 07-27 run", () => {
    expect(isContentFilterRefusal(new Error(AZURE_REFUSAL))).toBe(true);
  });

  it("detects a ResponsibleAIPolicyViolation code", () => {
    expect(
      isContentFilterRefusal(new Error("400 ResponsibleAIPolicyViolation: request blocked"))
    ).toBe(true);
  });

  it("accepts a bare string and an error-shaped object", () => {
    expect(isContentFilterRefusal(AZURE_REFUSAL)).toBe(true);
    expect(isContentFilterRefusal({ message: AZURE_REFUSAL })).toBe(true);
  });

  it("does NOT claim ordinary transport failures", () => {
    expect(isContentFilterRefusal(new Error("getaddrinfo ENOTFOUND azure.example"))).toBe(false);
    expect(isContentFilterRefusal(new Error("timeout: exceeded the 240000ms deadline"))).toBe(false);
    expect(isContentFilterRefusal(new Error("429 rate_limit_exceeded"))).toBe(false);
  });

  it("does NOT fire on a successful response's finish_reason telemetry", () => {
    // `content_filter` alone appears in finish reasons and filter-results blocks on calls that
    // SUCCEEDED. Keying on the bare token would over-count the class into meaninglessness.
    expect(isContentFilterRefusal(new Error('finishReason: "content_filter"'))).toBe(false);
  });

  it("is null-safe", () => {
    expect(isContentFilterRefusal(null)).toBe(false);
    expect(isContentFilterRefusal(undefined)).toBe(false);
    expect(isContentFilterRefusal(new Error(""))).toBe(false);
  });
});

describe("contentFilterFamily", () => {
  it("collapses chapter numbers so recurrence is visible across runs", () => {
    expect(contentFilterFamily("Agent9-Regen-Ch2-missing_clue")).toBe("Agent9-Regen-missing_clue");
    expect(contentFilterFamily("Agent9-Regen-Ch5-missing_clue")).toBe("Agent9-Regen-missing_clue");
  });

  it("labels an unlabelled call rather than dropping it", () => {
    expect(contentFilterFamily("")).toBe("unlabelled");
  });
});

describe("ContentFilterTracker", () => {
  it("reproduces the 07-27 tally: 10 refusals across three chapters, one family", () => {
    const tracker = new ContentFilterTracker();
    for (let i = 0; i < 6; i++) {
      tracker.record(new Error(AZURE_REFUSAL), "Agent9-Regen-Ch2-missing_clue", "gpt-4.1");
    }
    for (let i = 0; i < 2; i++) {
      tracker.record(new Error(AZURE_REFUSAL), "Agent9-Regen-Ch5-missing_clue", "gpt-4.1");
    }
    for (let i = 0; i < 2; i++) {
      tracker.record(new Error(AZURE_REFUSAL), "Agent9-Regen-Ch6-missing_clue", "gpt-4.1");
    }

    const summary = tracker.getSummary();
    expect(summary.total).toBe(10);
    expect(summary.byAgent["Agent9-Regen-Ch2-missing_clue"]).toBe(6);
    expect(summary.byFamily["Agent9-Regen-missing_clue"]).toBe(10);
  });

  it("ignores non-refusals, so the count means only what it says", () => {
    const tracker = new ContentFilterTracker();
    expect(tracker.record(new Error("ECONNRESET"), "Agent9-ProseGenerator", "gpt-4.1")).toBe(false);
    expect(tracker.getTotal()).toBe(0);
  });

  it("bounds the stored message so a tally cannot become a log dump", () => {
    const tracker = new ContentFilterTracker();
    tracker.record(new Error(AZURE_REFUSAL + "x".repeat(2000)), "Agent9-Regen-Ch2", "gpt-4.1");
    expect(tracker.getSummary().refusals[0].message.length).toBeLessThanOrEqual(400);
  });
});
