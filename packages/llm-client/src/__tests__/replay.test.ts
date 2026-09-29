/**
 * CR-03 — the replay client's matching rules. The committed fixture (eval/replay, `npm run
 * replay:check`) proves the harness end to end; these pin each rule on its own, so a change to one is
 * named rather than surfacing as "the digest moved".
 */
import { describe, expect, it } from "vitest";
import { ReplayClient, ReplayMismatchError, promptHashOf, type Cassette, type CassetteEntry } from "../replay.js";
import type { Message } from "../types.js";

const msgs = (text: string): Message[] => [{ role: "user", content: text }];
const usage = { promptTokens: 10, completionTokens: 5, totalTokens: 15 };
let seq = 0;
const ok = (agent: string, prompt: string, content: string): CassetteEntry => ({
  seq: seq++, agent, promptHash: promptHashOf(msgs(prompt)), messages: msgs(prompt),
  outcome: { kind: "response", content, usage, finishReason: "stop", model: "gpt-4.1" },
});
const fail = (agent: string, prompt: string, errorMessage: string): CassetteEntry => ({
  seq: seq++, agent, promptHash: promptHashOf(msgs(prompt)), messages: msgs(prompt),
  outcome: { kind: "error", errorMessage },
});
const cassette = (...entries: CassetteEntry[]): Cassette => ({ source: { test: true }, entries });
const call = (c: ReplayClient, agent: string, prompt: string) =>
  c.chat({ messages: msgs(prompt), logContext: { agent, runId: "r", projectId: "p" } });

describe("ReplayClient — strict", () => {
  it("serves the recorded response for a byte-identical prompt, and charges its cost", async () => {
    const c = new ReplayClient(cassette(ok("A", "hello", "world")));
    expect((await call(c, "A", "hello")).content).toBe("world");
    expect(c.unconsumed()).toHaveLength(0);
    expect(c.getCostTracker().getTotalCost()).toBeGreaterThan(0);
  });

  it("throws on a one-byte prompt change, naming the agent and the byte, and remembers it", async () => {
    const c = new ReplayClient(cassette(ok("A", "hello world", "x")));
    const err = await call(c, "A", "hello World").catch((e) => e);
    expect(err).toBeInstanceOf(ReplayMismatchError);
    expect(err.message).toContain('"A"');
    // Offsets count in the serialised messages: 27 chars of `[{"role":"user","content":"` + "hello " = 33.
    expect(err.offset).toBe(33);
    // A caller that swallows the error must not turn the mismatch into a pass.
    expect(c.report().mismatches).toHaveLength(1);
  });

  it("keeps parallel calls with IDENTICAL prompts apart by agent label (the v2 drafts)", async () => {
    const c = new ReplayClient(cassette(ok("W-D2", "same", "draft two"), ok("W-D1", "same", "draft one")));
    // Recorded order D2 then D1 (the order they happened to finish); code asks D1 first.
    expect((await call(c, "W-D1", "same")).content).toBe("draft one");
    expect((await call(c, "W-D2", "same")).content).toBe("draft two");
  });

  it("skips an error that the retry loop swallowed (same prompt sent again) and serves the retry", async () => {
    const c = new ReplayClient(cassette(fail("A", "p", "HTTP 429"), ok("A", "p", "after retry")));
    expect((await call(c, "A", "p")).content).toBe("after retry");
    expect(c.unconsumed()).toHaveLength(0);
  });

  it("re-throws an error that was the last attempt of its prompt — what the caller saw", async () => {
    const c = new ReplayClient(cassette(fail("A", "p", "content_filter refusal")));
    await expect(call(c, "A", "p")).rejects.toThrow("content_filter refusal");
  });

  it("treats a changed maxTokens or temperature as a mismatch — the recorded text would not survive it", async () => {
    const e = { ...ok("A", "p", "x"), maxTokens: 4000, temperature: 0.7 };
    const c = new ReplayClient(cassette(e));
    await c.chat({ messages: msgs("p"), maxTokens: 8000, logContext: { agent: "A", runId: "r", projectId: "p" } });
    expect(c.report().mismatches.join("\n")).toMatch(/maxTokens 4000 recorded, 8000 now/);
  });

  it("does NOT swallow an error the caller saw and answered with its own retry (new attempt number)", async () => {
    const first = { ...fail("A", "p", "content_filter"), retryAttempt: 0 };
    const second = { ...ok("A", "p", "second call"), retryAttempt: 1 };
    const c = new ReplayClient(cassette(first, second));
    const ask = (retryAttempt: number) =>
      c.chat({ messages: msgs("p"), logContext: { agent: "A", runId: "r", projectId: "p", retryAttempt } });
    await expect(ask(0)).rejects.toThrow("content_filter");
    expect((await ask(1)).content).toBe("second call");
  });

  it("reports recorded attempts the code never asked for", async () => {
    const c = new ReplayClient(cassette(ok("A", "p", "x"), ok("B", "q", "y")));
    await call(c, "A", "p");
    expect(c.unconsumed().map((e) => e.agent)).toEqual(["B"]);
  });
});

describe("ReplayClient — rebase", () => {
  it("takes one logical call at a time, never a later call that shares the prompt", async () => {
    const c = new ReplayClient(cassette(ok("A", "P", "one"), ok("A", "Q", "two"), ok("A", "P", "three")), "rebase");
    expect((await call(c, "A", "P")).content).toBe("one");
    expect((await call(c, "A", "Q")).content).toBe("two");
    expect((await call(c, "A", "P")).content).toBe("three");
    expect(c.rebased().source.syntheticFailures).toEqual([]);
  });

  it("serves by label and order, records the current prompt, drops the unasked, marks new calls synthetic", async () => {
    const c = new ReplayClient(cassette(ok("A", "old prompt", "reply A"), ok("B", "q", "reply B")), "rebase");
    expect((await call(c, "A", "new prompt")).content).toBe("reply A");
    await expect(call(c, "C", "never recorded")).rejects.toThrow(/CR-03 rebase/);
    const r = c.rebased();
    expect(r.entries.map((e) => e.agent)).toEqual(["A", "C"]);
    expect(r.entries[0].promptHash).toBe(promptHashOf(msgs("new prompt")));
    expect(r.entries[1].synthetic).toBe(true);
    expect(r.source.promptsChangedByRebase).toBe(1);
    expect(r.source.droppedByRebase).toBe(1);

    // The rebased cassette replays strictly to a complete match.
    const strict = new ReplayClient(r);
    expect((await call(strict, "A", "new prompt")).content).toBe("reply A");
    await expect(call(strict, "C", "never recorded")).rejects.toThrow(/CR-03 rebase/);
    expect(strict.unconsumed()).toHaveLength(0);
    expect(strict.report().mismatches).toHaveLength(0);
  });
});
