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
    expect(config.agent9_prose.story_length_policy.word_targets.medium.chapter_count).toBe(20);
    expect(config.agent9_prose.story_length_policy.total_word_budget_ratio.min_ratio).toBe(0.75);
    expect(config.agent9_prose.underflow_expansion.max_tokens_ratio).toBe(1.76);
    expect(config.agent9_prose.generation.default_max_attempts).toBe(3);
  });

  it("applies YAML overrides from a single config file", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "cml-gen-params-"));
    const configPath = path.join(dir, "generation-params.yaml");

    writeFileSync(
      configPath,
      [
        "agent9_prose:",
        "  story_length_policy:",
        "    chapter_target_tolerance: 3",
        "    word_targets:",
        "      short:",
        "        chapter_count: 12",
        "        chapter_ideal_words: 950",
        "      medium:",
        "        chapter_count: 22",
        "        chapter_ideal_words: 1650",
        "      long:",
        "        chapter_count: 32",
        "        chapter_ideal_words: 2100",
        "    total_word_budget_ratio:",
        "      min_ratio: 0.8",
        "      max_ratio: 1.3",
        "  underflow_expansion:",
        "    expansion_size_ratio:",
        "      min_additional_words_ratio: 0.2",
        "      max_additional_words_ratio: 0.6",
        "      buffer_words_ratio: 0.15",
        "    temperature: 0.15",
        "    max_tokens_ratio: 1.9",
        "  generation:",
        "    default_max_attempts: 4",
        "",
      ].join("\n"),
      "utf8",
    );

    process.env.CML_GENERATION_PARAMS_PATH = configPath;
    resetGenerationParamsCacheForTests();

    const config = getGenerationParams();
  expect(config.agent9_prose.story_length_policy.word_targets.short.chapter_count).toBe(12);
  expect(config.agent9_prose.story_length_policy.word_targets.medium.chapter_ideal_words).toBe(1650);
  expect(config.agent9_prose.story_length_policy.total_word_budget_ratio.max_ratio).toBe(1.3);
  expect(config.agent9_prose.underflow_expansion.expansion_size_ratio.max_additional_words_ratio).toBe(0.6);
  expect(config.agent9_prose.underflow_expansion.max_tokens_ratio).toBe(1.9);
    expect(config.agent9_prose.generation.default_max_attempts).toBe(4);

    rmSync(dir, { recursive: true, force: true });
  });
});
