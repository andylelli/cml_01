import { afterEach, describe, expect, it } from "vitest";
import { resolveStageModel } from "../agent9-prose/model-tiering.js";

// P6 — per-stage model router. Env override per stage, else the caller's default. No behaviour change
// when nothing is configured.
//
// REVIEW_02 §2.3 — the `rewrite` and `critique` stages are GONE. Both outlived the passes that
// consumed them, and this file previously asserted against `"critique"`, a stage that had never been
// in `Agent9Stage` at all: vitest does not typecheck, so `ENV_BY_STAGE["critique"]` resolved to
// `undefined`, the lookup fell through to the default, and the test went green while proving nothing.
// A test that passes for a stage that does not exist is worse than no test — hence the guard below.

const ENV = ["AGENT9_MODEL_GENERATE", "AGENT9_MODEL_REGEN", "AGENT9_MODEL_POLISH", "AGENT9_MODEL_REWRITE"];
afterEach(() => ENV.forEach((k) => delete process.env[k]));

describe("resolveStageModel", () => {
  it("falls back to the default when no override is set", () => {
    expect(resolveStageModel("regen", "prose-deploy")).toBe("prose-deploy");
    expect(resolveStageModel("generate", undefined)).toBeUndefined();
  });

  it("uses the stage override when set", () => {
    process.env.AGENT9_MODEL_GENERATE = "opus-strong";
    process.env.AGENT9_MODEL_REGEN = "haiku-cheap";
    expect(resolveStageModel("generate", "prose-deploy")).toBe("opus-strong");
    expect(resolveStageModel("regen", "prose-deploy")).toBe("haiku-cheap");
    expect(resolveStageModel("polish", "prose-deploy")).toBe("prose-deploy"); // unset → fallback
  });

  it("ignores a blank/whitespace override (falls back)", () => {
    process.env.AGENT9_MODEL_REGEN = "   ";
    expect(resolveStageModel("regen", "prose-deploy")).toBe("prose-deploy");
  });

  // REVIEW_02 §2.3 — the removed tiers must not resolve. `AGENT9_MODEL_REWRITE` was set in
  // `.env.local` for weeks after its only consumer was deleted, asserting a model choice nothing
  // read. If a future edit re-adds the stage, this fails.
  it("does NOT resolve a removed stage, even when its old env var is set", () => {
    process.env.AGENT9_MODEL_REWRITE = "opus-strong";
    expect(resolveStageModel("rewrite" as never, "prose-deploy")).toBe("prose-deploy");
    expect(resolveStageModel("critique" as never, "prose-deploy")).toBe("prose-deploy");
  });

  // A_69 Increment 2 — the polish tier lets ONLY the line-edit passes run on a stronger deployment
  // while generation stays put. Unset must be a guaranteed no-op.
  describe("polish stage (A_69)", () => {
    it("falls back to the prose deployment when unset — no behaviour change", () => {
      expect(resolveStageModel("polish", "prose-deploy")).toBe("prose-deploy");
    });

    it("routes polish independently of generation", () => {
      process.env.AGENT9_MODEL_POLISH = "frontier-strong";
      expect(resolveStageModel("polish", "prose-deploy")).toBe("frontier-strong");
      expect(resolveStageModel("generate", "prose-deploy")).toBe("prose-deploy");
    });

    it("ignores a blank override", () => {
      process.env.AGENT9_MODEL_POLISH = "  ";
      expect(resolveStageModel("polish", "prose-deploy")).toBe("prose-deploy");
    });
  });
});
