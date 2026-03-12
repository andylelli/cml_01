import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { load as parseYaml } from "js-yaml";

export interface Agent9WordPolicyConfig {
  hard_floor_relaxation_ratio: number;
  min_hard_floor_words: number;
  preferred_chapter_words: {
    short: number;
    medium: number;
    long: number;
  };
}

export interface Agent9UnderflowExpansionConfig {
  min_additional_words: number;
  max_additional_words: number;
  buffer_words: number;
  temperature: number;
  max_tokens: number;
}

export interface Agent9GenerationConfig {
  default_max_attempts: number;
}

export interface Agent9StyleLinterConfig {
  entropy: {
    standard: {
      early_chapter_max: number;
      early_threshold: number;
      mid_chapter_max: number;
      mid_threshold: number;
      late_threshold: number;
    };
    repair_threshold: number;
    min_window_standard: number;
    min_window_repair: number;
    warmup_chapters_standard: number;
    warmup_chapters_repair: number;
    opening_styles_prior_window: number;
    opening_styles_total_window: number;
  };
  paragraph_fingerprint_min_chars: number;
  ngram: {
    min_chars: number;
    gram_size: number;
    overlap_threshold: number;
    min_candidate_ngrams: number;
    prior_paragraph_limit: number;
  };
}

export interface Agent9ProseModelConfig {
  temperature: number;
  max_batch_size: number;
}

export interface Agent9ScoringAdapterConfig {
  discriminating: {
    semantic_token_match_ratio: number;
    min_semantic_token_matches: number;
    max_semantic_tokens: number;
  };
  clue_semantic: {
    token_match_ratio: number;
    min_token_matches: number;
    confidence_cap: number;
    signature_tokens_from_distribution: number;
    signature_tokens_from_id_fallback: number;
  };
  fair_play: {
    spoiler_early_chapter_ratio: number;
  };
}

export interface Agent9ScorerConfig {
  completeness: {
    word_count: {
      low_ratio: number;
      low_score: number;
    };
    clue_visibility: {
      pass_ratio: number;
      minor_gap_ratio: number;
      minor_gap_score: number;
    };
  };
}

export interface GenerationParamsConfig {
  agent9_prose: {
    word_policy: Agent9WordPolicyConfig;
    underflow_expansion: Agent9UnderflowExpansionConfig;
    generation: Agent9GenerationConfig;
    prose_model: Agent9ProseModelConfig;
    style_linter: Agent9StyleLinterConfig;
    scoring_adapter: Agent9ScoringAdapterConfig;
    scorer: Agent9ScorerConfig;
  };
}

const DEFAULT_CONFIG: GenerationParamsConfig = {
  agent9_prose: {
    word_policy: {
      hard_floor_relaxation_ratio: 0.9,
      min_hard_floor_words: 600,
      preferred_chapter_words: {
        short: 1300,
        medium: 1600,
        long: 2400,
      },
    },
    underflow_expansion: {
      min_additional_words: 220,
      max_additional_words: 680,
      buffer_words: 220,
      temperature: 0.2,
      max_tokens: 2600,
    },
    generation: {
      default_max_attempts: 3,
    },
    prose_model: {
      temperature: 0.45,
      max_batch_size: 10,
    },
    style_linter: {
      entropy: {
        standard: {
          early_chapter_max: 6,
          early_threshold: 0.65,
          mid_chapter_max: 10,
          mid_threshold: 0.72,
          late_threshold: 0.8,
        },
        repair_threshold: 0.65,
        min_window_standard: 4,
        min_window_repair: 5,
        warmup_chapters_standard: 0,
        warmup_chapters_repair: 3,
        opening_styles_prior_window: 6,
        opening_styles_total_window: 8,
      },
      paragraph_fingerprint_min_chars: 170,
      ngram: {
        min_chars: 140,
        gram_size: 6,
        overlap_threshold: 0.6,
        min_candidate_ngrams: 10,
        prior_paragraph_limit: 25,
      },
    },
    scoring_adapter: {
      discriminating: {
        semantic_token_match_ratio: 0.3,
        min_semantic_token_matches: 2,
        max_semantic_tokens: 12,
      },
      clue_semantic: {
        token_match_ratio: 0.3,
        min_token_matches: 2,
        confidence_cap: 0.95,
        signature_tokens_from_distribution: 8,
        signature_tokens_from_id_fallback: 6,
      },
      fair_play: {
        spoiler_early_chapter_ratio: 0.5,
      },
    },
    scorer: {
      completeness: {
        word_count: {
          low_ratio: 0.8,
          low_score: 70,
        },
        clue_visibility: {
          pass_ratio: 0.95,
          minor_gap_ratio: 0.8,
          minor_gap_score: 85,
        },
      },
    },
  },
};

let cachedConfig: GenerationParamsConfig | null = null;
let cachedPath: string | null = null;

const clampNumber = (value: unknown, fallback: number, min: number, max: number): number => {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
};

const resolveDefaultConfigPath = (): string => {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(currentDir, "..", "..", "..", "apps", "worker", "config", "generation-params.yaml");
};

const resolveConfigPath = (): string => {
  const envPath = process.env.CML_GENERATION_PARAMS_PATH?.trim();
  if (envPath) {
    return path.resolve(envPath);
  }

  const workspacePath = path.resolve(process.cwd(), "apps", "worker", "config", "generation-params.yaml");
  if (existsSync(workspacePath)) {
    return workspacePath;
  }

  return resolveDefaultConfigPath();
};

const mergeConfig = (partial: Partial<GenerationParamsConfig>): GenerationParamsConfig => {
  const merged: GenerationParamsConfig = {
    agent9_prose: {
      word_policy: {
        hard_floor_relaxation_ratio: clampNumber(
          partial.agent9_prose?.word_policy?.hard_floor_relaxation_ratio,
          DEFAULT_CONFIG.agent9_prose.word_policy.hard_floor_relaxation_ratio,
          0.6,
          1,
        ),
        min_hard_floor_words: Math.floor(
          clampNumber(
            partial.agent9_prose?.word_policy?.min_hard_floor_words,
            DEFAULT_CONFIG.agent9_prose.word_policy.min_hard_floor_words,
            200,
            2000,
          ),
        ),
        preferred_chapter_words: {
          short: Math.floor(
            clampNumber(
              partial.agent9_prose?.word_policy?.preferred_chapter_words?.short,
              DEFAULT_CONFIG.agent9_prose.word_policy.preferred_chapter_words.short,
              400,
              5000,
            ),
          ),
          medium: Math.floor(
            clampNumber(
              partial.agent9_prose?.word_policy?.preferred_chapter_words?.medium,
              DEFAULT_CONFIG.agent9_prose.word_policy.preferred_chapter_words.medium,
              600,
              7000,
            ),
          ),
          long: Math.floor(
            clampNumber(
              partial.agent9_prose?.word_policy?.preferred_chapter_words?.long,
              DEFAULT_CONFIG.agent9_prose.word_policy.preferred_chapter_words.long,
              800,
              9000,
            ),
          ),
        },
      },
      underflow_expansion: {
        min_additional_words: Math.floor(
          clampNumber(
            partial.agent9_prose?.underflow_expansion?.min_additional_words,
            DEFAULT_CONFIG.agent9_prose.underflow_expansion.min_additional_words,
            50,
            2000,
          ),
        ),
        max_additional_words: Math.floor(
          clampNumber(
            partial.agent9_prose?.underflow_expansion?.max_additional_words,
            DEFAULT_CONFIG.agent9_prose.underflow_expansion.max_additional_words,
            100,
            4000,
          ),
        ),
        buffer_words: Math.floor(
          clampNumber(
            partial.agent9_prose?.underflow_expansion?.buffer_words,
            DEFAULT_CONFIG.agent9_prose.underflow_expansion.buffer_words,
            0,
            3000,
          ),
        ),
        temperature: clampNumber(
          partial.agent9_prose?.underflow_expansion?.temperature,
          DEFAULT_CONFIG.agent9_prose.underflow_expansion.temperature,
          0,
          1,
        ),
        max_tokens: Math.floor(
          clampNumber(
            partial.agent9_prose?.underflow_expansion?.max_tokens,
            DEFAULT_CONFIG.agent9_prose.underflow_expansion.max_tokens,
            500,
            16000,
          ),
        ),
      },
      generation: {
        default_max_attempts: Math.floor(
          clampNumber(
            partial.agent9_prose?.generation?.default_max_attempts,
            DEFAULT_CONFIG.agent9_prose.generation.default_max_attempts,
            1,
            8,
          ),
        ),
      },
      prose_model: {
        temperature: clampNumber(
          partial.agent9_prose?.prose_model?.temperature,
          DEFAULT_CONFIG.agent9_prose.prose_model.temperature,
          0,
          1,
        ),
        max_batch_size: Math.floor(
          clampNumber(
            partial.agent9_prose?.prose_model?.max_batch_size,
            DEFAULT_CONFIG.agent9_prose.prose_model.max_batch_size,
            1,
            20,
          ),
        ),
      },
      style_linter: {
        entropy: {
          standard: {
            early_chapter_max: Math.floor(
              clampNumber(
                partial.agent9_prose?.style_linter?.entropy?.standard?.early_chapter_max,
                DEFAULT_CONFIG.agent9_prose.style_linter.entropy.standard.early_chapter_max,
                1,
                20,
              ),
            ),
            early_threshold: clampNumber(
              partial.agent9_prose?.style_linter?.entropy?.standard?.early_threshold,
              DEFAULT_CONFIG.agent9_prose.style_linter.entropy.standard.early_threshold,
              0,
              2,
            ),
            mid_chapter_max: Math.floor(
              clampNumber(
                partial.agent9_prose?.style_linter?.entropy?.standard?.mid_chapter_max,
                DEFAULT_CONFIG.agent9_prose.style_linter.entropy.standard.mid_chapter_max,
                2,
                30,
              ),
            ),
            mid_threshold: clampNumber(
              partial.agent9_prose?.style_linter?.entropy?.standard?.mid_threshold,
              DEFAULT_CONFIG.agent9_prose.style_linter.entropy.standard.mid_threshold,
              0,
              2,
            ),
            late_threshold: clampNumber(
              partial.agent9_prose?.style_linter?.entropy?.standard?.late_threshold,
              DEFAULT_CONFIG.agent9_prose.style_linter.entropy.standard.late_threshold,
              0,
              2,
            ),
          },
          repair_threshold: clampNumber(
            partial.agent9_prose?.style_linter?.entropy?.repair_threshold,
            DEFAULT_CONFIG.agent9_prose.style_linter.entropy.repair_threshold,
            0,
            2,
          ),
          min_window_standard: Math.floor(
            clampNumber(
              partial.agent9_prose?.style_linter?.entropy?.min_window_standard,
              DEFAULT_CONFIG.agent9_prose.style_linter.entropy.min_window_standard,
              2,
              20,
            ),
          ),
          min_window_repair: Math.floor(
            clampNumber(
              partial.agent9_prose?.style_linter?.entropy?.min_window_repair,
              DEFAULT_CONFIG.agent9_prose.style_linter.entropy.min_window_repair,
              2,
              20,
            ),
          ),
          warmup_chapters_standard: Math.floor(
            clampNumber(
              partial.agent9_prose?.style_linter?.entropy?.warmup_chapters_standard,
              DEFAULT_CONFIG.agent9_prose.style_linter.entropy.warmup_chapters_standard,
              0,
              20,
            ),
          ),
          warmup_chapters_repair: Math.floor(
            clampNumber(
              partial.agent9_prose?.style_linter?.entropy?.warmup_chapters_repair,
              DEFAULT_CONFIG.agent9_prose.style_linter.entropy.warmup_chapters_repair,
              0,
              20,
            ),
          ),
          opening_styles_prior_window: Math.floor(
            clampNumber(
              partial.agent9_prose?.style_linter?.entropy?.opening_styles_prior_window,
              DEFAULT_CONFIG.agent9_prose.style_linter.entropy.opening_styles_prior_window,
              1,
              30,
            ),
          ),
          opening_styles_total_window: Math.floor(
            clampNumber(
              partial.agent9_prose?.style_linter?.entropy?.opening_styles_total_window,
              DEFAULT_CONFIG.agent9_prose.style_linter.entropy.opening_styles_total_window,
              2,
              40,
            ),
          ),
        },
        paragraph_fingerprint_min_chars: Math.floor(
          clampNumber(
            partial.agent9_prose?.style_linter?.paragraph_fingerprint_min_chars,
            DEFAULT_CONFIG.agent9_prose.style_linter.paragraph_fingerprint_min_chars,
            80,
            800,
          ),
        ),
        ngram: {
          min_chars: Math.floor(
            clampNumber(
              partial.agent9_prose?.style_linter?.ngram?.min_chars,
              DEFAULT_CONFIG.agent9_prose.style_linter.ngram.min_chars,
              50,
              800,
            ),
          ),
          gram_size: Math.floor(
            clampNumber(
              partial.agent9_prose?.style_linter?.ngram?.gram_size,
              DEFAULT_CONFIG.agent9_prose.style_linter.ngram.gram_size,
              2,
              12,
            ),
          ),
          overlap_threshold: clampNumber(
            partial.agent9_prose?.style_linter?.ngram?.overlap_threshold,
            DEFAULT_CONFIG.agent9_prose.style_linter.ngram.overlap_threshold,
            0,
            1,
          ),
          min_candidate_ngrams: Math.floor(
            clampNumber(
              partial.agent9_prose?.style_linter?.ngram?.min_candidate_ngrams,
              DEFAULT_CONFIG.agent9_prose.style_linter.ngram.min_candidate_ngrams,
              1,
              200,
            ),
          ),
          prior_paragraph_limit: Math.floor(
            clampNumber(
              partial.agent9_prose?.style_linter?.ngram?.prior_paragraph_limit,
              DEFAULT_CONFIG.agent9_prose.style_linter.ngram.prior_paragraph_limit,
              1,
              200,
            ),
          ),
        },
      },
      scoring_adapter: {
        discriminating: {
          semantic_token_match_ratio: clampNumber(
            partial.agent9_prose?.scoring_adapter?.discriminating?.semantic_token_match_ratio,
            DEFAULT_CONFIG.agent9_prose.scoring_adapter.discriminating.semantic_token_match_ratio,
            0,
            1,
          ),
          min_semantic_token_matches: Math.floor(
            clampNumber(
              partial.agent9_prose?.scoring_adapter?.discriminating?.min_semantic_token_matches,
              DEFAULT_CONFIG.agent9_prose.scoring_adapter.discriminating.min_semantic_token_matches,
              1,
              10,
            ),
          ),
          max_semantic_tokens: Math.floor(
            clampNumber(
              partial.agent9_prose?.scoring_adapter?.discriminating?.max_semantic_tokens,
              DEFAULT_CONFIG.agent9_prose.scoring_adapter.discriminating.max_semantic_tokens,
              1,
              50,
            ),
          ),
        },
        clue_semantic: {
          token_match_ratio: clampNumber(
            partial.agent9_prose?.scoring_adapter?.clue_semantic?.token_match_ratio,
            DEFAULT_CONFIG.agent9_prose.scoring_adapter.clue_semantic.token_match_ratio,
            0,
            1,
          ),
          min_token_matches: Math.floor(
            clampNumber(
              partial.agent9_prose?.scoring_adapter?.clue_semantic?.min_token_matches,
              DEFAULT_CONFIG.agent9_prose.scoring_adapter.clue_semantic.min_token_matches,
              1,
              10,
            ),
          ),
          confidence_cap: clampNumber(
            partial.agent9_prose?.scoring_adapter?.clue_semantic?.confidence_cap,
            DEFAULT_CONFIG.agent9_prose.scoring_adapter.clue_semantic.confidence_cap,
            0,
            1,
          ),
          signature_tokens_from_distribution: Math.floor(
            clampNumber(
              partial.agent9_prose?.scoring_adapter?.clue_semantic?.signature_tokens_from_distribution,
              DEFAULT_CONFIG.agent9_prose.scoring_adapter.clue_semantic.signature_tokens_from_distribution,
              1,
              40,
            ),
          ),
          signature_tokens_from_id_fallback: Math.floor(
            clampNumber(
              partial.agent9_prose?.scoring_adapter?.clue_semantic?.signature_tokens_from_id_fallback,
              DEFAULT_CONFIG.agent9_prose.scoring_adapter.clue_semantic.signature_tokens_from_id_fallback,
              1,
              40,
            ),
          ),
        },
        fair_play: {
          spoiler_early_chapter_ratio: clampNumber(
            partial.agent9_prose?.scoring_adapter?.fair_play?.spoiler_early_chapter_ratio,
            DEFAULT_CONFIG.agent9_prose.scoring_adapter.fair_play.spoiler_early_chapter_ratio,
            0.1,
            1,
          ),
        },
      },
      scorer: {
        completeness: {
          word_count: {
            low_ratio: clampNumber(
              partial.agent9_prose?.scorer?.completeness?.word_count?.low_ratio,
              DEFAULT_CONFIG.agent9_prose.scorer.completeness.word_count.low_ratio,
              0,
              1,
            ),
            low_score: clampNumber(
              partial.agent9_prose?.scorer?.completeness?.word_count?.low_score,
              DEFAULT_CONFIG.agent9_prose.scorer.completeness.word_count.low_score,
              0,
              100,
            ),
          },
          clue_visibility: {
            pass_ratio: clampNumber(
              partial.agent9_prose?.scorer?.completeness?.clue_visibility?.pass_ratio,
              DEFAULT_CONFIG.agent9_prose.scorer.completeness.clue_visibility.pass_ratio,
              0,
              1,
            ),
            minor_gap_ratio: clampNumber(
              partial.agent9_prose?.scorer?.completeness?.clue_visibility?.minor_gap_ratio,
              DEFAULT_CONFIG.agent9_prose.scorer.completeness.clue_visibility.minor_gap_ratio,
              0,
              1,
            ),
            minor_gap_score: clampNumber(
              partial.agent9_prose?.scorer?.completeness?.clue_visibility?.minor_gap_score,
              DEFAULT_CONFIG.agent9_prose.scorer.completeness.clue_visibility.minor_gap_score,
              0,
              100,
            ),
          },
        },
      },
    },
  };

  if (
    merged.agent9_prose.underflow_expansion.max_additional_words <
    merged.agent9_prose.underflow_expansion.min_additional_words
  ) {
    merged.agent9_prose.underflow_expansion.max_additional_words =
      merged.agent9_prose.underflow_expansion.min_additional_words;
  }

  const entropy = merged.agent9_prose.style_linter.entropy;
  if (entropy.standard.mid_chapter_max < entropy.standard.early_chapter_max) {
    entropy.standard.mid_chapter_max = entropy.standard.early_chapter_max;
  }

  if (entropy.opening_styles_total_window < entropy.opening_styles_prior_window) {
    entropy.opening_styles_total_window = entropy.opening_styles_prior_window;
  }

  const scorerConfig = merged.agent9_prose.scorer.completeness;
  if (scorerConfig.clue_visibility.pass_ratio < scorerConfig.clue_visibility.minor_gap_ratio) {
    scorerConfig.clue_visibility.pass_ratio = scorerConfig.clue_visibility.minor_gap_ratio;
  }

  return merged;
};

export const getGenerationParams = (): GenerationParamsConfig => {
  const resolvedPath = resolveConfigPath();
  if (cachedConfig && cachedPath === resolvedPath) {
    return cachedConfig;
  }

  try {
    const raw = readFileSync(resolvedPath, "utf8");
    const parsed = parseYaml(raw) as Partial<GenerationParamsConfig>;
    cachedConfig = mergeConfig(parsed ?? {});
    cachedPath = resolvedPath;
    return cachedConfig;
  } catch {
    cachedConfig = DEFAULT_CONFIG;
    cachedPath = resolvedPath;
    return cachedConfig;
  }
};

export const resetGenerationParamsCacheForTests = (): void => {
  cachedConfig = null;
  cachedPath = null;
};
