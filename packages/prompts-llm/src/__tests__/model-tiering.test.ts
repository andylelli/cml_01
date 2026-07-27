import { afterEach, describe, expect, it } from "vitest";
import { resolveStageModel } from "../agent9-prose/model-tiering.js";

// P6 — per-stage model router. Env override per stage, else the caller's default. No behaviour change
// when nothing is configured.

const ENV = [
  "AGENT9_MODEL_GENERATE",
  "AGENT9_MODEL_REWRITE",
  "AGENT9_MODEL_CRITIQUE",
  "AGENT9_MODEL_REGEN",
  "AGENT9_MODEL_POLISH",
];
afterEach(() => ENV.forEach((k) => delete process.env[k]));

describe("resolveStageModel", () => {
  it("falls back to the default when no override is set", () => {
    expect(resolveStageModel("regen", "prose-deploy")).toBe("prose-deploy");
    expect(resolveStageModel("rewrite", undefined)).toBeUndefined();
  });

  it("uses the stage override when set", () => {
    process.env.AGENT9_MODEL_REWRITE = "opus-strong";
    process.env.AGENT9_MODEL_REGEN = "haiku-cheap";
    expect(resolveStageModel("rewrite", "prose-deploy")).toBe("opus-strong");
    expect(resolveStageModel("regen", "prose-deploy")).toBe("haiku-cheap");
    expect(resolveStageModel("generate", "prose-deploy")).toBe("prose-deploy"); // unset → fallback
  });

  it("ignores a blank/whitespace override (falls back)", () => {
    process.env.AGENT9_MODEL_CRITIQUE = "   ";
    expect(resolveStageModel("critique", "prose-deploy")).toBe("prose-deploy");
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
