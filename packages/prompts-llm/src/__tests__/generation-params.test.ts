import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { describe, expect, it, afterEach } from "vitest";
import {
  getGenerationParams,
  resetGenerationParamsCacheForTests,
} from "../utils/generation-params.js";

describe("generation params loader", () => {
  afterEach(() => {
    delete process.env.CML_GENERATION_PARAMS_PATH;
    resetGenerationParamsCacheForTests();
  });

  it("loads defaults when configured path is missing", () => {
    process.env.CML_GENERATION_PARAMS_PATH = path.join(tmpdir(), "does-not-exist", "params.yaml");
    resetGenerationParamsCacheForTests();

    const config = getGenerationParams();
    expect(config.agent9_prose.word_policy.hard_floor_relaxation_ratio).toBe(0.77);
    expect(config.agent9_prose.word_policy.preferred_chapter_words.medium).toBe(1600);
    expect(config.agent9_prose.generation.default_max_attempts).toBe(3);
  });

  it("applies YAML overrides from a single config file", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "cml-gen-params-"));
    const configPath = path.join(dir, "generation-params.yaml");

    writeFileSync(
      configPath,
      [
        "agent9_prose:",
        "  word_policy:",
        "    hard_floor_relaxation_ratio: 0.85",
        "    min_hard_floor_words: 700",
        "    preferred_chapter_words:",
        "      short: 1200",
        "      medium: 1500",
        "      long: 2200",
        "  underflow_expansion:",
        "    min_additional_words: 260",
        "    max_additional_words: 900",
        "    buffer_words: 300",
        "    temperature: 0.15",
        "    max_tokens: 3000",
        "  generation:",
        "    default_max_attempts: 4",
        "",
      ].join("\n"),
      "utf8",
    );

    process.env.CML_GENERATION_PARAMS_PATH = configPath;
    resetGenerationParamsCacheForTests();

    const config = getGenerationParams();
    expect(config.agent9_prose.word_policy.hard_floor_relaxation_ratio).toBe(0.85);
    expect(config.agent9_prose.word_policy.min_hard_floor_words).toBe(700);
    expect(config.agent9_prose.word_policy.preferred_chapter_words.long).toBe(2200);
    expect(config.agent9_prose.underflow_expansion.max_tokens).toBe(3000);
    expect(config.agent9_prose.generation.default_max_attempts).toBe(4);

    rmSync(dir, { recursive: true, force: true });
  });
});
