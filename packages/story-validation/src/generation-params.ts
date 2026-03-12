import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { load as parseYaml } from "js-yaml";

interface ModelConfig {
  temperature: number;
  max_tokens: number;
}

interface GenerationConfig {
  default_max_attempts: number;
}

interface AgentStatusConfig {
  status: string;
}

export interface Agent1SettingConfig extends AgentStatusConfig {
  params: {
    model: ModelConfig;
    generation: GenerationConfig;
  };
}

export interface Agent2CastConfig extends AgentStatusConfig {
  params: {
    model: ModelConfig;
    generation: GenerationConfig;
    quality: {
      role_archetype: {
        min_unique_ratio: number;
      };
      culpability: {
        max_possible_culprits: number;
      };
    };
  };
}

export interface Agent2SimpleConfig extends AgentStatusConfig {
  params: {
    model: ModelConfig;
    generation: GenerationConfig;
  };
}

export interface Agent3CmlConfig extends AgentStatusConfig {
  params: {
    model: ModelConfig;
    generation: GenerationConfig;
    inference_requirements: {
      default_max_steps: number;
    };
  };
}

export interface Agent4ValidatorConfig extends AgentStatusConfig {
  params: {
    model: ModelConfig;
    generation: GenerationConfig;
    inference_requirements: {
      default_max_steps: number;
    };
  };
}

export interface Agent5CluesConfig extends AgentStatusConfig {
  params: {
    model: ModelConfig;
  };
}

export interface Agent6FairPlayConfig extends AgentStatusConfig {
  params: {
    audit: {
      model: ModelConfig;
    };
    blind_reader: {
      model: ModelConfig;
    };
    retries: {
      max_fair_play_attempts: number;
      max_total_attempts_with_targeted_regen: number;
      max_retry_cost_usd: number;
    };
  };
}

export interface Agent7NarrativeConfig extends AgentStatusConfig {
  params: {
    model: ModelConfig;
    pacing: {
      min_clue_scene_ratio: number;
      act_distribution: {
        act1_ratio: number;
        act2_ratio: number;
      };
    };
  };
}

export interface Agent8NoveltyConfig extends AgentStatusConfig {
  params: {
    model: ModelConfig;
    thresholds: {
      similarity_threshold_default: number;
      fail_delta: number;
    };
    weighting: {
      plot: number;
      character: number;
      setting: number;
      solution: number;
      structural: number;
    };
  };
}

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
  agent1_setting: Agent1SettingConfig;
  agent2_cast: Agent2CastConfig;
  agent2b_profiles: Agent2SimpleConfig;
  agent2c_location_profiles: Agent2SimpleConfig;
  agent2d_temporal_context: Agent2SimpleConfig;
  agent2e_background_context: Agent2SimpleConfig;
  agent3_cml: Agent3CmlConfig;
  agent3b_hard_logic_devices: Agent2SimpleConfig;
  agent4_cml_validator: Agent4ValidatorConfig;
  agent5_clues: Agent5CluesConfig;
  agent6_fairplay: Agent6FairPlayConfig;
  agent7_narrative: Agent7NarrativeConfig;
  agent8_novelty: Agent8NoveltyConfig;
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
  agent1_setting: {
    status: "implemented",
    params: {
      model: { temperature: 0.6, max_tokens: 2000 },
      generation: { default_max_attempts: 3 },
    },
  },
  agent2_cast: {
    status: "implemented",
    params: {
      model: { temperature: 0.75, max_tokens: 6000 },
      generation: { default_max_attempts: 3 },
      quality: {
        role_archetype: { min_unique_ratio: 0.7 },
        culpability: { max_possible_culprits: 3 },
      },
    },
  },
  agent2b_profiles: {
    status: "implemented",
    params: {
      model: { temperature: 0.6, max_tokens: 4000 },
      generation: { default_max_attempts: 2 },
    },
  },
  agent2c_location_profiles: {
    status: "implemented",
    params: {
      model: { temperature: 0.6, max_tokens: 4500 },
      generation: { default_max_attempts: 2 },
    },
  },
  agent2d_temporal_context: {
    status: "implemented",
    params: {
      model: { temperature: 0.7, max_tokens: 4500 },
      generation: { default_max_attempts: 2 },
    },
  },
  agent2e_background_context: {
    status: "implemented",
    params: {
      model: { temperature: 0.4, max_tokens: 1200 },
      generation: { default_max_attempts: 2 },
    },
  },
  agent3_cml: {
    status: "implemented",
    params: {
      model: { temperature: 0.7, max_tokens: 8000 },
      generation: { default_max_attempts: 3 },
      inference_requirements: { default_max_steps: 5 },
    },
  },
  agent3b_hard_logic_devices: {
    status: "implemented",
    params: {
      model: { temperature: 0.7, max_tokens: 2600 },
      generation: { default_max_attempts: 3 },
    },
  },
  agent4_cml_validator: {
    status: "implemented",
    params: {
      model: { temperature: 0.5, max_tokens: 8000 },
      generation: { default_max_attempts: 5 },
      inference_requirements: { default_max_steps: 5 },
    },
  },
  agent5_clues: {
    status: "implemented",
    params: {
      model: { temperature: 0.4, max_tokens: 3000 },
    },
  },
  agent6_fairplay: {
    status: "implemented",
    params: {
      audit: { model: { temperature: 0.3, max_tokens: 2500 } },
      blind_reader: { model: { temperature: 0.2, max_tokens: 1500 } },
      retries: {
        max_fair_play_attempts: 2,
        max_total_attempts_with_targeted_regen: 3,
        max_retry_cost_usd: 0.15,
      },
    },
  },
  agent7_narrative: {
    status: "implemented",
    params: {
      model: { temperature: 0.5, max_tokens: 16000 },
      pacing: {
        min_clue_scene_ratio: 0.6,
        act_distribution: {
          act1_ratio: 0.28,
          act2_ratio: 0.47,
        },
      },
    },
  },
  agent8_novelty: {
    status: "implemented",
    params: {
      model: { temperature: 0.3, max_tokens: 2500 },
      thresholds: {
        similarity_threshold_default: 0.9,
        fail_delta: 0.1,
      },
      weighting: {
        plot: 0.3,
        character: 0.25,
        setting: 0.15,
        solution: 0.25,
        structural: 0.05,
      },
    },
  },
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
  const source = partial as any;
  const merged: GenerationParamsConfig = {
    agent1_setting: {
      status: typeof source.agent1_setting?.status === "string" ? source.agent1_setting.status : DEFAULT_CONFIG.agent1_setting.status,
      params: {
        model: {
          temperature: clampNumber(source.agent1_setting?.params?.model?.temperature, DEFAULT_CONFIG.agent1_setting.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent1_setting?.params?.model?.max_tokens, DEFAULT_CONFIG.agent1_setting.params.model.max_tokens, 256, 20000)),
        },
        generation: {
          default_max_attempts: Math.floor(clampNumber(source.agent1_setting?.params?.generation?.default_max_attempts, DEFAULT_CONFIG.agent1_setting.params.generation.default_max_attempts, 1, 10)),
        },
      },
    },
    agent2_cast: {
      status: typeof source.agent2_cast?.status === "string" ? source.agent2_cast.status : DEFAULT_CONFIG.agent2_cast.status,
      params: {
        model: {
          temperature: clampNumber(source.agent2_cast?.params?.model?.temperature, DEFAULT_CONFIG.agent2_cast.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent2_cast?.params?.model?.max_tokens, DEFAULT_CONFIG.agent2_cast.params.model.max_tokens, 256, 20000)),
        },
        generation: {
          default_max_attempts: Math.floor(clampNumber(source.agent2_cast?.params?.generation?.default_max_attempts, DEFAULT_CONFIG.agent2_cast.params.generation.default_max_attempts, 1, 10)),
        },
        quality: {
          role_archetype: {
            min_unique_ratio: clampNumber(source.agent2_cast?.params?.quality?.role_archetype?.min_unique_ratio, DEFAULT_CONFIG.agent2_cast.params.quality.role_archetype.min_unique_ratio, 0.1, 1),
          },
          culpability: {
            max_possible_culprits: Math.floor(clampNumber(source.agent2_cast?.params?.quality?.culpability?.max_possible_culprits, DEFAULT_CONFIG.agent2_cast.params.quality.culpability.max_possible_culprits, 1, 10)),
          },
        },
      },
    },
    agent2b_profiles: {
      status: typeof source.agent2b_profiles?.status === "string" ? source.agent2b_profiles.status : DEFAULT_CONFIG.agent2b_profiles.status,
      params: {
        model: {
          temperature: clampNumber(source.agent2b_profiles?.params?.model?.temperature, DEFAULT_CONFIG.agent2b_profiles.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent2b_profiles?.params?.model?.max_tokens, DEFAULT_CONFIG.agent2b_profiles.params.model.max_tokens, 256, 20000)),
        },
        generation: {
          default_max_attempts: Math.floor(clampNumber(source.agent2b_profiles?.params?.generation?.default_max_attempts, DEFAULT_CONFIG.agent2b_profiles.params.generation.default_max_attempts, 1, 10)),
        },
      },
    },
    agent2c_location_profiles: {
      status: typeof source.agent2c_location_profiles?.status === "string" ? source.agent2c_location_profiles.status : DEFAULT_CONFIG.agent2c_location_profiles.status,
      params: {
        model: {
          temperature: clampNumber(source.agent2c_location_profiles?.params?.model?.temperature, DEFAULT_CONFIG.agent2c_location_profiles.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent2c_location_profiles?.params?.model?.max_tokens, DEFAULT_CONFIG.agent2c_location_profiles.params.model.max_tokens, 256, 20000)),
        },
        generation: {
          default_max_attempts: Math.floor(clampNumber(source.agent2c_location_profiles?.params?.generation?.default_max_attempts, DEFAULT_CONFIG.agent2c_location_profiles.params.generation.default_max_attempts, 1, 10)),
        },
      },
    },
    agent2d_temporal_context: {
      status: typeof source.agent2d_temporal_context?.status === "string" ? source.agent2d_temporal_context.status : DEFAULT_CONFIG.agent2d_temporal_context.status,
      params: {
        model: {
          temperature: clampNumber(source.agent2d_temporal_context?.params?.model?.temperature, DEFAULT_CONFIG.agent2d_temporal_context.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent2d_temporal_context?.params?.model?.max_tokens, DEFAULT_CONFIG.agent2d_temporal_context.params.model.max_tokens, 256, 20000)),
        },
        generation: {
          default_max_attempts: Math.floor(clampNumber(source.agent2d_temporal_context?.params?.generation?.default_max_attempts, DEFAULT_CONFIG.agent2d_temporal_context.params.generation.default_max_attempts, 1, 10)),
        },
      },
    },
    agent2e_background_context: {
      status: typeof source.agent2e_background_context?.status === "string" ? source.agent2e_background_context.status : DEFAULT_CONFIG.agent2e_background_context.status,
      params: {
        model: {
          temperature: clampNumber(source.agent2e_background_context?.params?.model?.temperature, DEFAULT_CONFIG.agent2e_background_context.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent2e_background_context?.params?.model?.max_tokens, DEFAULT_CONFIG.agent2e_background_context.params.model.max_tokens, 256, 20000)),
        },
        generation: {
          default_max_attempts: Math.floor(clampNumber(source.agent2e_background_context?.params?.generation?.default_max_attempts, DEFAULT_CONFIG.agent2e_background_context.params.generation.default_max_attempts, 1, 10)),
        },
      },
    },
    agent3_cml: {
      status: typeof source.agent3_cml?.status === "string" ? source.agent3_cml.status : DEFAULT_CONFIG.agent3_cml.status,
      params: {
        model: {
          temperature: clampNumber(source.agent3_cml?.params?.model?.temperature, DEFAULT_CONFIG.agent3_cml.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent3_cml?.params?.model?.max_tokens, DEFAULT_CONFIG.agent3_cml.params.model.max_tokens, 256, 20000)),
        },
        generation: {
          default_max_attempts: Math.floor(clampNumber(source.agent3_cml?.params?.generation?.default_max_attempts, DEFAULT_CONFIG.agent3_cml.params.generation.default_max_attempts, 1, 10)),
        },
        inference_requirements: {
          default_max_steps: Math.floor(clampNumber(source.agent3_cml?.params?.inference_requirements?.default_max_steps, DEFAULT_CONFIG.agent3_cml.params.inference_requirements.default_max_steps, 1, 20)),
        },
      },
    },
    agent3b_hard_logic_devices: {
      status: typeof source.agent3b_hard_logic_devices?.status === "string" ? source.agent3b_hard_logic_devices.status : DEFAULT_CONFIG.agent3b_hard_logic_devices.status,
      params: {
        model: {
          temperature: clampNumber(source.agent3b_hard_logic_devices?.params?.model?.temperature, DEFAULT_CONFIG.agent3b_hard_logic_devices.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent3b_hard_logic_devices?.params?.model?.max_tokens, DEFAULT_CONFIG.agent3b_hard_logic_devices.params.model.max_tokens, 256, 20000)),
        },
        generation: {
          default_max_attempts: Math.floor(clampNumber(source.agent3b_hard_logic_devices?.params?.generation?.default_max_attempts, DEFAULT_CONFIG.agent3b_hard_logic_devices.params.generation.default_max_attempts, 1, 10)),
        },
      },
    },
    agent4_cml_validator: {
      status: typeof source.agent4_cml_validator?.status === "string" ? source.agent4_cml_validator.status : DEFAULT_CONFIG.agent4_cml_validator.status,
      params: {
        model: {
          temperature: clampNumber(source.agent4_cml_validator?.params?.model?.temperature, DEFAULT_CONFIG.agent4_cml_validator.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent4_cml_validator?.params?.model?.max_tokens, DEFAULT_CONFIG.agent4_cml_validator.params.model.max_tokens, 256, 20000)),
        },
        generation: {
          default_max_attempts: Math.floor(clampNumber(source.agent4_cml_validator?.params?.generation?.default_max_attempts, DEFAULT_CONFIG.agent4_cml_validator.params.generation.default_max_attempts, 1, 10)),
        },
        inference_requirements: {
          default_max_steps: Math.floor(clampNumber(source.agent4_cml_validator?.params?.inference_requirements?.default_max_steps, DEFAULT_CONFIG.agent4_cml_validator.params.inference_requirements.default_max_steps, 1, 20)),
        },
      },
    },
    agent5_clues: {
      status: typeof source.agent5_clues?.status === "string" ? source.agent5_clues.status : DEFAULT_CONFIG.agent5_clues.status,
      params: {
        model: {
          temperature: clampNumber(source.agent5_clues?.params?.model?.temperature, DEFAULT_CONFIG.agent5_clues.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent5_clues?.params?.model?.max_tokens, DEFAULT_CONFIG.agent5_clues.params.model.max_tokens, 256, 20000)),
        },
      },
    },
    agent6_fairplay: {
      status: typeof source.agent6_fairplay?.status === "string" ? source.agent6_fairplay.status : DEFAULT_CONFIG.agent6_fairplay.status,
      params: {
        audit: {
          model: {
            temperature: clampNumber(source.agent6_fairplay?.params?.audit?.model?.temperature, DEFAULT_CONFIG.agent6_fairplay.params.audit.model.temperature, 0, 1),
            max_tokens: Math.floor(clampNumber(source.agent6_fairplay?.params?.audit?.model?.max_tokens, DEFAULT_CONFIG.agent6_fairplay.params.audit.model.max_tokens, 256, 20000)),
          },
        },
        blind_reader: {
          model: {
            temperature: clampNumber(source.agent6_fairplay?.params?.blind_reader?.model?.temperature, DEFAULT_CONFIG.agent6_fairplay.params.blind_reader.model.temperature, 0, 1),
            max_tokens: Math.floor(clampNumber(source.agent6_fairplay?.params?.blind_reader?.model?.max_tokens, DEFAULT_CONFIG.agent6_fairplay.params.blind_reader.model.max_tokens, 256, 20000)),
          },
        },
        retries: {
          max_fair_play_attempts: Math.floor(clampNumber(source.agent6_fairplay?.params?.retries?.max_fair_play_attempts, DEFAULT_CONFIG.agent6_fairplay.params.retries.max_fair_play_attempts, 1, 10)),
          max_total_attempts_with_targeted_regen: Math.floor(clampNumber(source.agent6_fairplay?.params?.retries?.max_total_attempts_with_targeted_regen, DEFAULT_CONFIG.agent6_fairplay.params.retries.max_total_attempts_with_targeted_regen, 1, 10)),
          max_retry_cost_usd: clampNumber(source.agent6_fairplay?.params?.retries?.max_retry_cost_usd, DEFAULT_CONFIG.agent6_fairplay.params.retries.max_retry_cost_usd, 0, 10),
        },
      },
    },
    agent7_narrative: {
      status: typeof source.agent7_narrative?.status === "string" ? source.agent7_narrative.status : DEFAULT_CONFIG.agent7_narrative.status,
      params: {
        model: {
          temperature: clampNumber(source.agent7_narrative?.params?.model?.temperature, DEFAULT_CONFIG.agent7_narrative.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent7_narrative?.params?.model?.max_tokens, DEFAULT_CONFIG.agent7_narrative.params.model.max_tokens, 256, 32000)),
        },
        pacing: {
          min_clue_scene_ratio: clampNumber(source.agent7_narrative?.params?.pacing?.min_clue_scene_ratio, DEFAULT_CONFIG.agent7_narrative.params.pacing.min_clue_scene_ratio, 0.1, 1),
          act_distribution: {
            act1_ratio: clampNumber(source.agent7_narrative?.params?.pacing?.act_distribution?.act1_ratio, DEFAULT_CONFIG.agent7_narrative.params.pacing.act_distribution.act1_ratio, 0.1, 0.8),
            act2_ratio: clampNumber(source.agent7_narrative?.params?.pacing?.act_distribution?.act2_ratio, DEFAULT_CONFIG.agent7_narrative.params.pacing.act_distribution.act2_ratio, 0.1, 0.8),
          },
        },
      },
    },
    agent8_novelty: {
      status: typeof source.agent8_novelty?.status === "string" ? source.agent8_novelty.status : DEFAULT_CONFIG.agent8_novelty.status,
      params: {
        model: {
          temperature: clampNumber(source.agent8_novelty?.params?.model?.temperature, DEFAULT_CONFIG.agent8_novelty.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent8_novelty?.params?.model?.max_tokens, DEFAULT_CONFIG.agent8_novelty.params.model.max_tokens, 256, 20000)),
        },
        thresholds: {
          similarity_threshold_default: clampNumber(source.agent8_novelty?.params?.thresholds?.similarity_threshold_default, DEFAULT_CONFIG.agent8_novelty.params.thresholds.similarity_threshold_default, 0, 1),
          fail_delta: clampNumber(source.agent8_novelty?.params?.thresholds?.fail_delta, DEFAULT_CONFIG.agent8_novelty.params.thresholds.fail_delta, 0, 1),
        },
        weighting: {
          plot: clampNumber(source.agent8_novelty?.params?.weighting?.plot, DEFAULT_CONFIG.agent8_novelty.params.weighting.plot, 0, 1),
          character: clampNumber(source.agent8_novelty?.params?.weighting?.character, DEFAULT_CONFIG.agent8_novelty.params.weighting.character, 0, 1),
          setting: clampNumber(source.agent8_novelty?.params?.weighting?.setting, DEFAULT_CONFIG.agent8_novelty.params.weighting.setting, 0, 1),
          solution: clampNumber(source.agent8_novelty?.params?.weighting?.solution, DEFAULT_CONFIG.agent8_novelty.params.weighting.solution, 0, 1),
          structural: clampNumber(source.agent8_novelty?.params?.weighting?.structural, DEFAULT_CONFIG.agent8_novelty.params.weighting.structural, 0, 1),
        },
      },
    },
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
