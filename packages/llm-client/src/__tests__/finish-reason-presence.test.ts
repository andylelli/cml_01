/**
 * An absent finish_reason must not read as a real one.
 *
 * Run `mystery-1789105355374` aborted on a truncated Agent 7 outline whose guard fires on
 * `finishReason === "length"`. It did not fire, and could not: `parseChatWireResponse` defaults an
 * absent `finish_reason` to `"stop"`, so "the model stopped" and "nobody said why" were the same
 * value. The default is KEPT (downstream branches depend on it); `finishReasonPresent` carries the
 * distinction. Same rule the `cachedPromptTokens` field in that file already states.
 */
import { describe, expect, it } from "vitest";

import { parseChatWireResponse } from "../azure-http-transport.js";

const wire = (choice: Record<string, unknown>) => ({
  choices: [{ message: { content: "text" }, ...choice }],
  usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
});

describe("finishReasonPresent distinguishes a real stop from a defaulted one", () => {
  it("a real finish_reason is present and preserved", () => {
    const r = parseChatWireResponse(wire({ finish_reason: "stop" }));
    expect(r.finishReason).toBe("stop");
    expect(r.finishReasonPresent).toBe(true);
  });

  it("length is preserved — the value Agent 7's guard keys on", () => {
    const r = parseChatWireResponse(wire({ finish_reason: "length" }));
    expect(r.finishReason).toBe("length");
    expect(r.finishReasonPresent).toBe(true);
  });

  it.each([
    ["absent", {}],
    ["null", { finish_reason: null }],
    ["empty string", { finish_reason: "" }],
    ["non-string", { finish_reason: 7 }],
  ])("%s: still defaults to stop for compatibility, but is marked NOT present", (_label, choice) => {
    const r = parseChatWireResponse(wire(choice));
    expect(r.finishReason).toBe("stop");
    expect(r.finishReasonPresent).toBe(false);
  });

  it("a malformed body does not throw and reports absence", () => {
    for (const raw of [undefined, null, {}, { choices: [] }, "nonsense", 42]) {
      const r = parseChatWireResponse(raw as never);
      expect(r.finishReasonPresent).toBe(false);
      expect(r.finishReason).toBe("stop");
    }
  });
});
