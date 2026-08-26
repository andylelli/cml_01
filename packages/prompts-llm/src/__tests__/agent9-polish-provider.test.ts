/**
 * A_71 — Sonnet 5 post-pass polish on PASSING chapters only.
 *
 * These tests pin the two properties the feature depends on:
 *   1. Default OFF. Unset AGENT9_POLISH_PROVIDER ⇒ byte-identical behaviour to before.
 *   2. When routed to another provider, the Azure stage-model tier is BYPASSED — sending an Azure
 *      deployment name to Anthropic would 404 every polish call.
 *
 * The "only on passing chapters" guarantee is structural, not conventional: `resolvePolishProvider()`
 * is called inside generate.ts's `chapterErrors.length === 0` branch, so a failing chapter cannot
 * reach the provider at all. The rollback tests below cover the other half — polish can never make a
 * passing chapter worse.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CostTracker, LLMLogger } from "@cml/llm-client";
import {
  DEFAULT_POLISH_ANTHROPIC_MODEL,
  isAnthropicPolishEnabled,
  resolvePolishAnthropicModel,
  resolvePolishProvider,
  resetPolishProviderCache,
} from "../agent9-prose/polish-provider.js";
import { polishPassingChapter, shouldPolishChapter } from "../agent9-prose/post-pass-polish.js";

const ENV_KEYS = [
  "AGENT9_POLISH_PROVIDER",
  "AGENT9_POLISH_ANTHROPIC_MODEL",
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_BASE_URL",
  "AGENT9_MODEL_POLISH",
] as const;
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) saved[key] = process.env[key];
  for (const key of ENV_KEYS) delete process.env[key];
  resetPolishProviderCache();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key]!;
  }
  resetPolishProviderCache();
  vi.restoreAllMocks();
});

describe("polish provider gating", () => {
  it("is off when the flag is unset — the default must reproduce today's behaviour", () => {
    expect(isAnthropicPolishEnabled()).toBe(false);
    expect(resolvePolishProvider()).toBeUndefined();
  });

  it("is off for any value other than 'anthropic'", () => {
    process.env.AGENT9_POLISH_PROVIDER = "true";
    expect(resolvePolishProvider()).toBeUndefined();
    process.env.AGENT9_POLISH_PROVIDER = "azure";
    expect(resolvePolishProvider()).toBeUndefined();
  });

  it("accepts the flag case-insensitively and with surrounding whitespace", () => {
    process.env.AGENT9_POLISH_PROVIDER = "  Anthropic  ";
    expect(isAnthropicPolishEnabled()).toBe(true);
  });

  it("degrades to the default provider when the API key is missing — a polish-only feature must never abort a run", () => {
    process.env.AGENT9_POLISH_PROVIDER = "anthropic";
    expect(resolvePolishProvider()).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("ANTHROPIC_API_KEY is unset"));
  });

  it("builds a provider when opted in with a key, defaulting to Sonnet 5", () => {
    process.env.AGENT9_POLISH_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-test";
    const provider = resolvePolishProvider();
    expect(provider?.model).toBe(DEFAULT_POLISH_ANTHROPIC_MODEL);
    expect(typeof provider?.client.chat).toBe("function");
  });

  it("honours an explicit model override", () => {
    process.env.AGENT9_POLISH_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-test";
    process.env.AGENT9_POLISH_ANTHROPIC_MODEL = "claude-opus-5";
    expect(resolvePolishAnthropicModel()).toBe("claude-opus-5");
    expect(resolvePolishProvider()?.model).toBe("claude-opus-5");
  });

  it("reuses one client across chapters rather than building one per call", () => {
    process.env.AGENT9_POLISH_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-test";
    expect(resolvePolishProvider()).toBe(resolvePolishProvider());
  });

  it("re-resolves when the model changes mid-process", () => {
    process.env.AGENT9_POLISH_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-test";
    const first = resolvePolishProvider();
    process.env.AGENT9_POLISH_ANTHROPIC_MODEL = "claude-opus-5";
    expect(resolvePolishProvider()).not.toBe(first);
  });

  it("reads env at call time, not at import time (the dotenv-freeze trap)", () => {
    expect(resolvePolishProvider()).toBeUndefined();
    process.env.AGENT9_POLISH_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-test";
    expect(resolvePolishProvider()).toBeDefined();
  });

  // Regression: the first cut of this file let AnthropicClient build its own LLMLogger (defaults:
  // logToFile false, logFullPromptsToFile false) and its own CostTracker. Every Sonnet 5 call would
  // then have been absent from logs/llm.jsonl, logs/llm-prompts-full.jsonl, and cost attribution —
  // the stage would bill silently while appearing to do nothing.
  it("wires the host logger and cost tracker into the provider so telemetry is not silently dropped", () => {
    process.env.AGENT9_POLISH_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-test";
    const logger = new LLMLogger({ logToConsole: false });
    const costTracker = new CostTracker();

    const provider = resolvePolishProvider({ logger, costTracker });

    expect((provider?.client as any).logger).toBe(logger);
    expect((provider?.client as any).costTracker).toBe(costTracker);
  });

  it("rebuilds when the host telemetry changes so a stale logger cannot capture a later run", () => {
    process.env.AGENT9_POLISH_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-test";
    const first = resolvePolishProvider({ logger: new LLMLogger({ logToConsole: false }) });
    const second = resolvePolishProvider({ logger: new LLMLogger({ logToConsole: false }) });
    expect(second).not.toBe(first);
  });

  it("still caches when the same telemetry instances are passed on every chapter", () => {
    process.env.AGENT9_POLISH_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-test";
    const logger = new LLMLogger({ logToConsole: false });
    const costTracker = new CostTracker();
    expect(resolvePolishProvider({ logger, costTracker })).toBe(resolvePolishProvider({ logger, costTracker }));
  });
});

/**
 * MANDATORY INVARIANT: one polish call per chapter, and only after that chapter has passed.
 *
 * Measured violation that motivated this (2026-07-31 agent-loop run): the accept path is re-entered
 * on every batch attempt, so a chapter that passed on attempt 1 was re-polished on attempts 2, 3, …
 * whenever another chapter in the same batch forced a batch retry — Ch4 4x, Ch6 3x, Ch7/8/9 2x each.
 * 13 calls for 5 chapters. The default `attempt === 1` guard hid it until an opt-in flag lifted it.
 */
describe("shouldPolishChapter — once per chapter, passing only", () => {
  const base = {
    chapterNumber: 4,
    chapterPassed: true,
    alreadyPolished: new Set<number>(),
    attempt: 1,
    provisionalScore: 90,
    polishRetriedChapters: false,
    polishHighLeakage: false,
  };

  it("polishes a passing chapter that has not been polished yet", () => {
    expect(shouldPolishChapter(base)).toBe(true);
  });

  it("NEVER polishes a chapter that failed its gates", () => {
    expect(shouldPolishChapter({ ...base, chapterPassed: false })).toBe(false);
  });

  it("never polishes a failing chapter even with both opt-in flags on", () => {
    expect(
      shouldPolishChapter({
        ...base,
        chapterPassed: false,
        polishRetriedChapters: true,
        polishHighLeakage: true,
        provisionalScore: 0,
      }),
    ).toBe(false);
  });

  it("NEVER polishes the same chapter twice", () => {
    expect(shouldPolishChapter({ ...base, alreadyPolished: new Set([4]) })).toBe(false);
  });

  it("no flag combination can re-open an already-polished chapter", () => {
    for (const polishRetriedChapters of [false, true]) {
      for (const polishHighLeakage of [false, true]) {
        for (const attempt of [1, 2, 3]) {
          expect(
            shouldPolishChapter({
              ...base,
              alreadyPolished: new Set([4]),
              attempt,
              polishRetriedChapters,
              polishHighLeakage,
            }),
          ).toBe(false);
        }
      }
    }
  });

  it("does not block a different chapter in the same batch", () => {
    expect(shouldPolishChapter({ ...base, chapterNumber: 5, alreadyPolished: new Set([4]) })).toBe(true);
  });

  it("skips retried chapters by default", () => {
    expect(shouldPolishChapter({ ...base, attempt: 2 })).toBe(false);
  });

  it("includes retried chapters when AGENT9_POLISH_RETRIED_CHAPTERS is on", () => {
    expect(shouldPolishChapter({ ...base, attempt: 2, polishRetriedChapters: true })).toBe(true);
  });

  it("respects the provisional<95 gate by default", () => {
    expect(shouldPolishChapter({ ...base, provisionalScore: 95 })).toBe(false);
    expect(shouldPolishChapter({ ...base, provisionalScore: 94.9 })).toBe(true);
  });

  it("bypasses the provisional gate for high-leakage chapters", () => {
    expect(shouldPolishChapter({ ...base, provisionalScore: 99, polishHighLeakage: true })).toBe(true);
  });

  it("simulates the observed regression: a 4-attempt batch yields exactly one call", () => {
    const polished = new Set<number>();
    let calls = 0;
    for (let attempt = 1; attempt <= 4; attempt++) {
      // Ch4 passes every attempt; the batch retries because a sibling chapter keeps failing.
      if (
        shouldPolishChapter({
          ...base,
          alreadyPolished: polished,
          attempt,
          polishHighLeakage: true,
          provisionalScore: 99,
        })
      ) {
        polished.add(base.chapterNumber);
        calls++;
      }
    }
    expect(calls).toBe(1);
  });
});

describe("polishPassingChapter provider routing", () => {
  const chapter = {
    title: "Chapter 8: The Trap",
    paragraphs: [
      "Clara gathered the household in the drawing room and set the rewound clock where everyone could see it.",
      "She compared the clock marks against the witness timings before anyone could dodge the conclusion.",
    ],
  } as any;

  const repairContext = {
    chapterNumber: 8,
    stageMode: "final_reveal",
    investigatorName: "Clara",
    culpritName: "Edgar Vale",
    requiredClueSummaries: [],
    matchingClearances: [],
  } as any;

  const okReply = (paragraphs: string[]) => ({
    content: JSON.stringify({ status: "draft", chapters: [{ title: chapter.title, paragraphs }] }),
    finishReason: "end_turn",
  });

  it("routes to the polish client and its own model, bypassing the Azure stage tier", async () => {
    process.env.AGENT9_MODEL_POLISH = "azure-gpt-41-deployment";
    const azure = { chat: vi.fn() } as any;
    const polishClient = {
      chat: vi.fn().mockResolvedValue(okReply(["Rewritten with the rewound clock still on the table.", "Second line."])),
    } as any;

    await polishPassingChapter({
      chapter,
      client: azure,
      polishClient,
      polishModel: "claude-sonnet-5",
      repairContext,
      model: "azure-default",
      validateCandidate: (candidate) => ({ chapter: candidate, hardErrors: [] }),
    });

    expect(azure.chat).not.toHaveBeenCalled();
    expect(polishClient.chat).toHaveBeenCalledTimes(1);
    // The Azure deployment name must NOT leak through to the other provider.
    expect(polishClient.chat.mock.calls[0][0].model).toBe("claude-sonnet-5");
  });

  it("keeps using the default client and the stage tier when no polish client is supplied", async () => {
    process.env.AGENT9_MODEL_POLISH = "azure-gpt-41-deployment";
    const azure = {
      chat: vi.fn().mockResolvedValue(okReply(["Rewritten line one.", "Rewritten line two."])),
    } as any;

    await polishPassingChapter({
      chapter,
      client: azure,
      repairContext,
      model: "azure-default",
      validateCandidate: (candidate) => ({ chapter: candidate, hardErrors: [] }),
    });

    expect(azure.chat).toHaveBeenCalledTimes(1);
    expect(azure.chat.mock.calls[0][0].model).toBe("azure-gpt-41-deployment");
  });

  it("rolls back a truncated reply rather than committing a partial chapter", async () => {
    const polishClient = {
      chat: vi.fn().mockResolvedValue({
        content: '{"status":"draft","chapters":[{"title":"Chapter 8: The Trap","paragraphs":["Half a chap',
        finishReason: "max_tokens",
      }),
    } as any;

    const result = await polishPassingChapter({
      chapter,
      client: { chat: vi.fn() } as any,
      polishClient,
      polishModel: "claude-sonnet-5",
      repairContext,
      validateCandidate: (candidate) => ({ chapter: candidate, hardErrors: [] }),
    });

    expect(result.keptPolishedVersion).toBe(false);
    expect(result.rollbackReason).toBe("truncated"); // A_74 §5.2: a token budget, not a validator
    expect(result.chapter).toEqual(chapter);
  });

  it("rolls back a refusal rather than committing an empty chapter", async () => {
    const polishClient = {
      chat: vi.fn().mockResolvedValue({ content: "", finishReason: "refusal" }),
    } as any;

    const result = await polishPassingChapter({
      chapter,
      client: { chat: vi.fn() } as any,
      polishClient,
      polishModel: "claude-sonnet-5",
      repairContext,
      validateCandidate: (candidate) => ({ chapter: candidate, hardErrors: [] }),
    });

    expect(result.keptPolishedVersion).toBe(false);
    expect(result.rollbackReason).toBe("refused"); // A_74 §5.2: the content filter, not a validator
    expect(result.chapter).toEqual(chapter);
  });

  it("commits a clean polish from the alternate provider", async () => {
    const polishClient = {
      chat: vi
        .fn()
        .mockResolvedValue(
          okReply([
            "Clara set the rewound clock on the table where the household could not look away from it.",
            "She laid the clock marks beside the witness timings, and the conclusion closed itself.",
          ]),
        ),
    } as any;

    const result = await polishPassingChapter({
      chapter,
      client: { chat: vi.fn() } as any,
      polishClient,
      polishModel: "claude-sonnet-5",
      repairContext,
      validateCandidate: (candidate) => ({ chapter: candidate, hardErrors: [] }),
    });

    expect(result.keptPolishedVersion).toBe(true);
    expect(result.chapter.paragraphs[0]).toContain("rewound clock");
  });

  it("still rolls back on a validator regression regardless of provider", async () => {
    const polishClient = {
      chat: vi.fn().mockResolvedValue(okReply(["A rewrite that drops the decisive object.", "Second line."])),
    } as any;

    const result = await polishPassingChapter({
      chapter,
      client: { chat: vi.fn() } as any,
      polishClient,
      polishModel: "claude-sonnet-5",
      repairContext,
      validateCandidate: (candidate) => ({
        chapter: candidate,
        hardErrors: candidate.paragraphs.join(" ").includes("rewound clock") ? [] : ["missing clue"],
      }),
    });

    expect(result.keptPolishedVersion).toBe(false);
    expect(result.rollbackReason).toBe("validation_regression");
    expect(result.chapter).toEqual(chapter);
  });
});
