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
    quality: {
      evidence_clue_backfill_threshold: number;
      fail_when_backfill_exceeds_threshold: boolean;
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
      pass_criteria: {
        min_confidence: "likely" | "certain";
        max_remediation_cycles: number;
      };
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

export interface StoryLengthBudgetRatioConfig {
  min_ratio: number;
  max_ratio: number;
}

export interface Agent9UnderflowExpansionConfig {
  /**
   * Master switch for the underflow expansion pass.
   * When false the expansion LLM call is skipped entirely and chapters that are below
   * either the hard floor or the preferred target proceed directly to retry.
   * Default: true.
   */
  enabled: boolean;
  expansion_size_ratio: {
    min_additional_words_ratio: number;
    max_additional_words_ratio: number;
    buffer_words_ratio: number;
  };
  temperature: number;
  max_tokens_ratio: number;
  /**
   * Fraction of preferred chapter words below which a preferred-miss (non-hard-floor)
   * chapter triggers expansion.  Chapters above this fraction are already "close enough"
   * and do not need an expansion call.
   * e.g. 0.85 means expansion fires when wordCount < preferredWords * 0.85.
   * Set to 1.0 to always expand on preferred-miss; set to 0.0 to never expand on preferred-miss.
   * Supported range: 0.0 – 1.0
   */
  preferred_miss_expansion_ratio: number;
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

export interface Agent65WorldBuilderConfig extends AgentStatusConfig {
  params: {
    model: ModelConfig;
    generation: GenerationConfig;
    quality: {
      arc_description_gate: number;
      arc_description_prompt_buffer: number;
    };
  };
}

export interface Agent9ValidationConfig {
  pronoun_policy?: PronounPolicy;
  pronoun_checking_enabled: boolean;
  pronoun_validation_enabled: boolean;
}

export type PronounPolicy = "strict" | "relaxed" | "off";

export type PronounPolicySettings = {
  policy: PronounPolicy;
  checkingEnabled: boolean;
  validationEnabled: boolean;
};

export interface Agent9ChapterCompositionRangeConfig {
  min_pct: number;
  max_pct: number;
}

export interface Agent9ChapterCompositionPhaseConfig {
  [component: string]: Agent9ChapterCompositionRangeConfig;
}

export interface Agent9ChapterCompositionTargetsConfig {
  chapter1: Agent9ChapterCompositionPhaseConfig;
  early_investigation: Agent9ChapterCompositionPhaseConfig;
  middle_chapters: Agent9ChapterCompositionPhaseConfig;
  false_suspect_chapters: Agent9ChapterCompositionPhaseConfig;
  discriminating_test_chapter: Agent9ChapterCompositionPhaseConfig;
  final_reveal: Agent9ChapterCompositionPhaseConfig;
}

export interface Agent9StageModeProfileConfig {
  balance_targets: Agent9ChapterCompositionPhaseConfig;
  required_outcomes: string[];
  forbidden_reveals: string[];
}

export interface Agent9StageModesConfig {
  discovery_opening: Agent9StageModeProfileConfig;
  early_investigation: Agent9StageModeProfileConfig;
  suspect_pressure: Agent9StageModeProfileConfig;
  false_suspect_clearing: Agent9StageModeProfileConfig;
  clue_reinterpretation: Agent9StageModeProfileConfig;
  discriminating_test: Agent9StageModeProfileConfig;
  final_reveal: Agent9StageModeProfileConfig;
  aftermath_consequence: Agent9StageModeProfileConfig;
}

export interface Agent9RolloutFlagsConfig {
  phrase_family_detection_enabled: boolean;
  uncapped_repair_targets_enabled: boolean;
  precommit_phrase_gate_enabled: boolean;
  tiered_phrase_contract_enabled: boolean;
  phrase_specific_linter_enabled: boolean;
  blue_sky_mode_enabled: boolean;
  season_lock_context_aware_enabled: boolean;
  season_lock_protected_collocations_enabled: boolean;
  boundary_integrity_gate_enabled: boolean;
  semantic_rewrite_diff_guard_enabled: boolean;
  entity_fidelity_gate_enabled: boolean;
  culprit_alias_gate_enabled: boolean;
  integrity_retry_packet_enabled: boolean;
  integrity_blue_sky_mode_enabled: boolean;
  // ANALYSIS_43 Phase 0 — repairable-residual rollout flags.
  // pronoun_gate_parity_enabled: run the final pronoun validator at the per-chapter
  //   commit point and re-repair after victim/alias mutations (Phase 1 / H).
  // victim_alive_repair_enabled: deterministically neutralize a CANONICAL victim given
  //   active dialogue/action after death (Phase 2 / G).
  // repairable_abort_softening_enabled: when the only residual critical/major issues are
  //   in the deterministically-repairable allowlist, run one more repair cycle and
  //   downgrade to needs_review instead of a hard abort (Phase 3 / I).
  pronoun_gate_parity_enabled: boolean;
  victim_alive_repair_enabled: boolean;
  repairable_abort_softening_enabled: boolean;
  // ANALYSIS_44 R3: when a chapter exhausts its retry budget and the ONLY residual failure is
  // a repeated-paragraph-opener (template_bleed) issue, accept the chapter with a warning
  // instead of letting it hard-abort the run. Set false to restore strict opener enforcement.
  opener_exhaustion_bypass_enabled: boolean;
}

export interface StoryLengthWordTargetConfig {
  chapter_count: number;
  min_words: number;
  max_words: number;
  chapter_ideal_words: number;
}

export interface StoryLengthPolicyConfig {
  targets: { short: number; medium: number; long: number };
  chapter_target_tolerance: number;
  word_target_multiplier: number;
  word_targets: {
    short: StoryLengthWordTargetConfig;
    medium: StoryLengthWordTargetConfig;
    long: StoryLengthWordTargetConfig;
  };
  total_word_budget_ratio: StoryLengthBudgetRatioConfig;
}

export interface GenerationParamsConfig {
  story_length_policy: StoryLengthPolicyConfig;
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
  agent65_world_builder: Agent65WorldBuilderConfig;
  agent8_novelty: Agent8NoveltyConfig;
  agent9_prose: {
    story_length_policy: StoryLengthPolicyConfig;
    chapter_composition_targets: Agent9ChapterCompositionTargetsConfig;
    stage_modes: Agent9StageModesConfig;
    underflow_expansion: Agent9UnderflowExpansionConfig;
    generation: Agent9GenerationConfig;
    prose_model: Agent9ProseModelConfig;
    rollout_flags: Agent9RolloutFlagsConfig;
    style_linter: Agent9StyleLinterConfig;
    scoring_adapter: Agent9ScoringAdapterConfig;
    scorer: Agent9ScorerConfig;
    validation: Agent9ValidationConfig;
  };
}

const DEFAULT_CONFIG: GenerationParamsConfig = {
  story_length_policy: {
    targets: { short: 10, medium: 20, long: 30 },
    chapter_target_tolerance: 2,
    word_target_multiplier: 1.0,
    word_targets: {
      short:  { chapter_count: 10, min_words: 7_500, max_words: 12_500, chapter_ideal_words: 1000 },
      medium: { chapter_count: 20, min_words: 25_500, max_words: 42_500, chapter_ideal_words: 1700 },
      long:   { chapter_count: 30, min_words: 49_500, max_words: 82_500, chapter_ideal_words: 2200 },
    },
    total_word_budget_ratio: {
      min_ratio: 0.75,
      max_ratio: 1.25,
    },
  },
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
      quality: {
        evidence_clue_backfill_threshold: 3,
        fail_when_backfill_exceeds_threshold: true,
      },
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
      blind_reader: {
        model: { temperature: 0.2, max_tokens: 1500 },
        pass_criteria: {
          min_confidence: "likely",
          max_remediation_cycles: 2,
        },
      },
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
  agent65_world_builder: {
    status: "implemented",
    params: {
      model: { temperature: 0.7, max_tokens: 6000 },
      generation: { default_max_attempts: 2 },
      quality: {
        arc_description_gate: 200,
        arc_description_prompt_buffer: 100,
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
    story_length_policy: {
      targets: { short: 10, medium: 20, long: 30 },
      chapter_target_tolerance: 2,
      word_target_multiplier: 1.0,
      word_targets: {
        short: { chapter_count: 10, min_words: 7_500, max_words: 12_500, chapter_ideal_words: 1000 },
        medium: { chapter_count: 20, min_words: 25_500, max_words: 42_500, chapter_ideal_words: 1700 },
        long: { chapter_count: 30, min_words: 49_500, max_words: 82_500, chapter_ideal_words: 2200 },
      },
      total_word_budget_ratio: {
        min_ratio: 0.75,
        max_ratio: 1.25,
      },
    },
    chapter_composition_targets: {
      chapter1: {
        setting: { min_pct: 20, max_pct: 20 },
        character_introductions: { min_pct: 40, max_pct: 40 },
        discovery_reactions: { min_pct: 30, max_pct: 30 },
        first_clue: { min_pct: 10, max_pct: 10 },
      },
      early_investigation: {
        setting: { min_pct: 10, max_pct: 15 },
        character_pressure: { min_pct: 35, max_pct: 40 },
        clue_development: { min_pct: 45, max_pct: 50 },
      },
      middle_chapters: {
        setting: { min_pct: 10, max_pct: 10 },
        character_conflict: { min_pct: 30, max_pct: 35 },
        alibi_testing_clue_reinterpretation: { min_pct: 50, max_pct: 60 },
      },
      false_suspect_chapters: {
        setting: { min_pct: 10, max_pct: 10 },
        character_focus: { min_pct: 45, max_pct: 45 },
        evidence_contradiction: { min_pct: 45, max_pct: 45 },
      },
      discriminating_test_chapter: {
        setting: { min_pct: 10, max_pct: 10 },
        character_reaction: { min_pct: 20, max_pct: 25 },
        test_proof_reversal: { min_pct: 65, max_pct: 70 },
      },
      final_reveal: {
        setting: { min_pct: 10, max_pct: 10 },
        motive_character_consequence: { min_pct: 30, max_pct: 30 },
        evidence_chain: { min_pct: 40, max_pct: 40 },
        confession_aftermath: { min_pct: 20, max_pct: 20 },
      },
    },
    stage_modes: {
      discovery_opening: {
        balance_targets: {
          setting: { min_pct: 15, max_pct: 20 },
          character_introductions: { min_pct: 35, max_pct: 40 },
          discovery_reactions: { min_pct: 25, max_pct: 30 },
          first_clue: { min_pct: 10, max_pct: 15 },
        },
        required_outcomes: [
          "Victim is named explicitly.",
          "Major suspects are introduced with relevance and tension.",
          "First clue is planted without full mechanism explanation.",
        ],
        forbidden_reveals: [
          "No culprit reveal.",
          "No full murder mechanism explanation.",
        ],
      },
      early_investigation: {
        balance_targets: {
          setting: { min_pct: 10, max_pct: 15 },
          character_pressure: { min_pct: 35, max_pct: 40 },
          clue_development: { min_pct: 45, max_pct: 50 },
        },
        required_outcomes: [
          "Develop clues through contradiction, questioning, or alibi pressure.",
          "End with changed investigative theory.",
        ],
        forbidden_reveals: ["No final culprit resolution."],
      },
      suspect_pressure: {
        balance_targets: {
          setting: { min_pct: 5, max_pct: 10 },
          character_pressure: { min_pct: 45, max_pct: 55 },
          evidence_or_alibi_testing: { min_pct: 35, max_pct: 45 },
        },
        required_outcomes: [
          "Reveal fear, motive, lie, loyalty conflict, or secret.",
          "Suspicion state changes by chapter end.",
        ],
        forbidden_reveals: ["No full murder confession unless outline-required."],
      },
      false_suspect_clearing: {
        balance_targets: {
          setting: { min_pct: 5, max_pct: 10 },
          character_consequence: { min_pct: 30, max_pct: 40 },
          evidence_proving_innocence: { min_pct: 50, max_pct: 60 },
        },
        required_outcomes: [
          "Show why suspect looked guilty.",
          "Prove innocence with evidence, corroborated alibi, or timing logic.",
          "Shift suspicion afterward.",
        ],
        forbidden_reveals: ["Do not clear by convenience or assertion."],
      },
      clue_reinterpretation: {
        balance_targets: {
          setting: { min_pct: 5, max_pct: 10 },
          character_reaction: { min_pct: 25, max_pct: 35 },
          clue_reinterpretation: { min_pct: 55, max_pct: 65 },
        },
        required_outcomes: [
          "State original clue meaning and revised meaning.",
          "Show suspect implications and theory update.",
        ],
        forbidden_reveals: ["Do not introduce decisive new evidence from nowhere."],
      },
      discriminating_test: {
        balance_targets: {
          setting: { min_pct: 5, max_pct: 10 },
          character_reaction: { min_pct: 20, max_pct: 25 },
          test_proof_reversal: { min_pct: 65, max_pct: 70 },
        },
        required_outcomes: [
          "State competing theories.",
          "Run/reveal concrete test with observable result.",
          "State what result proves and rules out.",
        ],
        forbidden_reveals: ["Do not merely restate known evidence."],
      },
      final_reveal: {
        balance_targets: {
          setting: { min_pct: 5, max_pct: 10 },
          motive_emotional_truth: { min_pct: 30, max_pct: 35 },
          evidence_chain: { min_pct: 35, max_pct: 45 },
          confession_consequence: { min_pct: 20, max_pct: 25 },
        },
        required_outcomes: [
          "Provide motive, death method, opportunity, and evidence chain.",
          "Distinguish death method from concealment mechanism.",
          "State culprit trace/mistake and consequences.",
        ],
        forbidden_reveals: ["No mechanism-only confession without death responsibility."],
      },
      aftermath_consequence: {
        balance_targets: {
          setting: { min_pct: 5, max_pct: 10 },
          emotional_fallout: { min_pct: 45, max_pct: 55 },
          social_reordering: { min_pct: 35, max_pct: 45 },
        },
        required_outcomes: [
          "Show emotional fallout and changed order.",
          "Close consequence arcs for surviving characters.",
        ],
        forbidden_reveals: ["Do not introduce decisive new mystery evidence."],
      },
    },
    underflow_expansion: {
      enabled: true,
      expansion_size_ratio: {
        min_additional_words_ratio: 0.16,
        max_additional_words_ratio: 0.56,
        buffer_words_ratio: 0.18,
      },
      temperature: 0.2,
      max_tokens_ratio: 1.76,
      preferred_miss_expansion_ratio: 0.85,
    },
    generation: {
      default_max_attempts: 3,
    },
    prose_model: {
      temperature: 0.45,
      max_batch_size: 10,
    },
    rollout_flags: {
      phrase_family_detection_enabled: true,
      uncapped_repair_targets_enabled: true,
      precommit_phrase_gate_enabled: true,
      tiered_phrase_contract_enabled: true,
      phrase_specific_linter_enabled: true,
      blue_sky_mode_enabled: false,
      season_lock_context_aware_enabled: true,
      season_lock_protected_collocations_enabled: true,
      boundary_integrity_gate_enabled: true,
      semantic_rewrite_diff_guard_enabled: true,
      entity_fidelity_gate_enabled: true,
      culprit_alias_gate_enabled: true,
      integrity_retry_packet_enabled: true,
      integrity_blue_sky_mode_enabled: false,
      pronoun_gate_parity_enabled: true,
      victim_alive_repair_enabled: true,
      repairable_abort_softening_enabled: true,
      opener_exhaustion_bypass_enabled: true,
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
    validation: {
      pronoun_policy: "strict",
      pronoun_checking_enabled: true,
      pronoun_validation_enabled: true,
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

  const mergeWordTarget = (
    src: any,
    defaults: StoryLengthWordTargetConfig,
  ): StoryLengthWordTargetConfig => ({
    chapter_count: Math.max(1, Math.floor(clampNumber(src?.chapter_count, defaults.chapter_count, 1, 200))),
    min_words: Math.max(1, Math.floor(clampNumber(src?.min_words, defaults.min_words, 100, 500000))),
    max_words: Math.max(1, Math.floor(clampNumber(src?.max_words, defaults.max_words, 100, 1000000))),
    chapter_ideal_words: Math.max(1, Math.floor(clampNumber(src?.chapter_ideal_words, defaults.chapter_ideal_words, 50, 10000))),
  });

  const lengthSource = source.agent9_prose?.story_length_policy ?? source.story_length_policy ?? {};
  const ratioDefaults = DEFAULT_CONFIG.story_length_policy.total_word_budget_ratio;
  const totalWordBudgetRatio: StoryLengthBudgetRatioConfig = {
    min_ratio: clampNumber(lengthSource?.total_word_budget_ratio?.min_ratio, ratioDefaults.min_ratio, 0.1, 2.0),
    max_ratio: clampNumber(lengthSource?.total_word_budget_ratio?.max_ratio, ratioDefaults.max_ratio, 0.2, 3.0),
  };

  const mergeWordTargetDerived = (
    src: any,
    defaults: StoryLengthWordTargetConfig,
  ): StoryLengthWordTargetConfig => {
    const mergedTarget = mergeWordTarget(src, defaults);
    const chapterCount = Math.max(1, mergedTarget.chapter_count);
    const ideal = Math.max(1, mergedTarget.chapter_ideal_words);
    const totalIdeal = chapterCount * ideal;
    const minWords = Math.max(1, Math.floor(totalIdeal * totalWordBudgetRatio.min_ratio));
    const maxWords = Math.max(minWords, Math.ceil(totalIdeal * totalWordBudgetRatio.max_ratio));
    return {
      chapter_count: chapterCount,
      chapter_ideal_words: ideal,
      min_words: minWords,
      max_words: maxWords,
    };
  };

  const resolvedStoryLengthPolicy: StoryLengthPolicyConfig = {
    targets: {
      short: mergeWordTarget(lengthSource?.word_targets?.short, DEFAULT_CONFIG.story_length_policy.word_targets.short).chapter_count,
      medium: mergeWordTarget(lengthSource?.word_targets?.medium, DEFAULT_CONFIG.story_length_policy.word_targets.medium).chapter_count,
      long: mergeWordTarget(lengthSource?.word_targets?.long, DEFAULT_CONFIG.story_length_policy.word_targets.long).chapter_count,
    },
    chapter_target_tolerance: Math.max(
      0,
      Math.floor(
        clampNumber(
          lengthSource?.chapter_target_tolerance,
          DEFAULT_CONFIG.story_length_policy.chapter_target_tolerance,
          0,
          50,
        ),
      ),
    ),
    word_target_multiplier: clampNumber(
      lengthSource?.word_target_multiplier,
      DEFAULT_CONFIG.story_length_policy.word_target_multiplier,
      0.5,
      3.0,
    ),
    word_targets: {
      short: mergeWordTargetDerived(lengthSource?.word_targets?.short, DEFAULT_CONFIG.story_length_policy.word_targets.short),
      medium: mergeWordTargetDerived(lengthSource?.word_targets?.medium, DEFAULT_CONFIG.story_length_policy.word_targets.medium),
      long: mergeWordTargetDerived(lengthSource?.word_targets?.long, DEFAULT_CONFIG.story_length_policy.word_targets.long),
    },
    total_word_budget_ratio: totalWordBudgetRatio,
  };

  const mergeCompositionPhase = (
    srcPhase: any,
    defaultPhase: Agent9ChapterCompositionPhaseConfig,
  ): Agent9ChapterCompositionPhaseConfig => {
    const mergedPhase: Agent9ChapterCompositionPhaseConfig = {};
    for (const [component, defaultRange] of Object.entries(defaultPhase)) {
      const minCandidate = clampNumber(srcPhase?.[component]?.min_pct, defaultRange.min_pct, 0, 100);
      const maxCandidate = clampNumber(srcPhase?.[component]?.max_pct, defaultRange.max_pct, 0, 100);
      mergedPhase[component] = {
        min_pct: Math.min(minCandidate, maxCandidate),
        max_pct: Math.max(minCandidate, maxCandidate),
      };
    }
    return mergedPhase;
  };

  const defaultComposition = DEFAULT_CONFIG.agent9_prose.chapter_composition_targets;
  const sourceComposition = partial.agent9_prose?.chapter_composition_targets;
  const resolvedChapterCompositionTargets: Agent9ChapterCompositionTargetsConfig = {
    chapter1: mergeCompositionPhase(sourceComposition?.chapter1, defaultComposition.chapter1),
    early_investigation: mergeCompositionPhase(sourceComposition?.early_investigation, defaultComposition.early_investigation),
    middle_chapters: mergeCompositionPhase(sourceComposition?.middle_chapters, defaultComposition.middle_chapters),
    false_suspect_chapters: mergeCompositionPhase(sourceComposition?.false_suspect_chapters, defaultComposition.false_suspect_chapters),
    discriminating_test_chapter: mergeCompositionPhase(sourceComposition?.discriminating_test_chapter, defaultComposition.discriminating_test_chapter),
    final_reveal: mergeCompositionPhase(sourceComposition?.final_reveal, defaultComposition.final_reveal),
  };

  const mergeStringList = (candidate: unknown, fallback: string[]): string[] => {
    if (!Array.isArray(candidate)) return [...fallback];
    const normalized = candidate
      .map((value) => String(value ?? "").trim())
      .filter(Boolean);
    return normalized.length > 0 ? normalized : [...fallback];
  };

  const defaultStageModes = DEFAULT_CONFIG.agent9_prose.stage_modes;
  const sourceStageModes = partial.agent9_prose?.stage_modes as any;
  const mergeStageModeProfile = (
    sourceProfile: any,
    defaultProfile: Agent9StageModeProfileConfig,
  ): Agent9StageModeProfileConfig => ({
    balance_targets: mergeCompositionPhase(sourceProfile?.balance_targets, defaultProfile.balance_targets),
    required_outcomes: mergeStringList(sourceProfile?.required_outcomes, defaultProfile.required_outcomes),
    forbidden_reveals: mergeStringList(sourceProfile?.forbidden_reveals, defaultProfile.forbidden_reveals),
  });

  const resolvedStageModes: Agent9StageModesConfig = {
    discovery_opening: mergeStageModeProfile(sourceStageModes?.discovery_opening, defaultStageModes.discovery_opening),
    early_investigation: mergeStageModeProfile(sourceStageModes?.early_investigation, defaultStageModes.early_investigation),
    suspect_pressure: mergeStageModeProfile(sourceStageModes?.suspect_pressure, defaultStageModes.suspect_pressure),
    false_suspect_clearing: mergeStageModeProfile(sourceStageModes?.false_suspect_clearing, defaultStageModes.false_suspect_clearing),
    clue_reinterpretation: mergeStageModeProfile(sourceStageModes?.clue_reinterpretation, defaultStageModes.clue_reinterpretation),
    discriminating_test: mergeStageModeProfile(sourceStageModes?.discriminating_test, defaultStageModes.discriminating_test),
    final_reveal: mergeStageModeProfile(sourceStageModes?.final_reveal, defaultStageModes.final_reveal),
    aftermath_consequence: mergeStageModeProfile(sourceStageModes?.aftermath_consequence, defaultStageModes.aftermath_consequence),
  };

  const merged: GenerationParamsConfig = {
    story_length_policy: resolvedStoryLengthPolicy,
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
        quality: {
          evidence_clue_backfill_threshold: Math.floor(
            clampNumber(
              source.agent3_cml?.params?.quality?.evidence_clue_backfill_threshold,
              DEFAULT_CONFIG.agent3_cml.params.quality.evidence_clue_backfill_threshold,
              0,
              20,
            )
          ),
          fail_when_backfill_exceeds_threshold:
            (source.agent3_cml?.params?.quality?.fail_when_backfill_exceeds_threshold ??
              DEFAULT_CONFIG.agent3_cml.params.quality.fail_when_backfill_exceeds_threshold) !== false,
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
          pass_criteria: {
            min_confidence:
              source.agent6_fairplay?.params?.blind_reader?.pass_criteria?.min_confidence === "certain"
                ? "certain"
                : DEFAULT_CONFIG.agent6_fairplay.params.blind_reader.pass_criteria.min_confidence,
            max_remediation_cycles: Math.floor(
              clampNumber(
                source.agent6_fairplay?.params?.blind_reader?.pass_criteria?.max_remediation_cycles,
                DEFAULT_CONFIG.agent6_fairplay.params.blind_reader.pass_criteria.max_remediation_cycles,
                0,
                5,
              ),
            ),
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
    agent65_world_builder: {
      status: typeof source.agent65_world_builder?.status === "string" ? source.agent65_world_builder.status : DEFAULT_CONFIG.agent65_world_builder.status,
      params: {
        model: {
          temperature: clampNumber(source.agent65_world_builder?.params?.model?.temperature, DEFAULT_CONFIG.agent65_world_builder.params.model.temperature, 0, 1),
          max_tokens: Math.floor(clampNumber(source.agent65_world_builder?.params?.model?.max_tokens, DEFAULT_CONFIG.agent65_world_builder.params.model.max_tokens, 256, 20000)),
        },
        generation: {
          default_max_attempts: Math.floor(clampNumber(source.agent65_world_builder?.params?.generation?.default_max_attempts, DEFAULT_CONFIG.agent65_world_builder.params.generation.default_max_attempts, 1, 10)),
        },
        quality: {
          arc_description_gate: Math.floor(clampNumber(source.agent65_world_builder?.params?.quality?.arc_description_gate, DEFAULT_CONFIG.agent65_world_builder.params.quality.arc_description_gate, 50, 1000)),
          arc_description_prompt_buffer: Math.floor(clampNumber(source.agent65_world_builder?.params?.quality?.arc_description_prompt_buffer, DEFAULT_CONFIG.agent65_world_builder.params.quality.arc_description_prompt_buffer, 0, 500)),
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
      story_length_policy: {
        targets: {
          short: resolvedStoryLengthPolicy.targets.short,
          medium: resolvedStoryLengthPolicy.targets.medium,
          long: resolvedStoryLengthPolicy.targets.long,
        },
        chapter_target_tolerance: resolvedStoryLengthPolicy.chapter_target_tolerance,
        word_target_multiplier: resolvedStoryLengthPolicy.word_target_multiplier,
        word_targets: {
          short: { ...resolvedStoryLengthPolicy.word_targets.short },
          medium: { ...resolvedStoryLengthPolicy.word_targets.medium },
          long: { ...resolvedStoryLengthPolicy.word_targets.long },
        },
        total_word_budget_ratio: { ...resolvedStoryLengthPolicy.total_word_budget_ratio },
      },
      chapter_composition_targets: {
        chapter1: { ...resolvedChapterCompositionTargets.chapter1 },
        early_investigation: { ...resolvedChapterCompositionTargets.early_investigation },
        middle_chapters: { ...resolvedChapterCompositionTargets.middle_chapters },
        false_suspect_chapters: { ...resolvedChapterCompositionTargets.false_suspect_chapters },
        discriminating_test_chapter: { ...resolvedChapterCompositionTargets.discriminating_test_chapter },
        final_reveal: { ...resolvedChapterCompositionTargets.final_reveal },
      },
      stage_modes: {
        discovery_opening: { ...resolvedStageModes.discovery_opening, balance_targets: { ...resolvedStageModes.discovery_opening.balance_targets } },
        early_investigation: { ...resolvedStageModes.early_investigation, balance_targets: { ...resolvedStageModes.early_investigation.balance_targets } },
        suspect_pressure: { ...resolvedStageModes.suspect_pressure, balance_targets: { ...resolvedStageModes.suspect_pressure.balance_targets } },
        false_suspect_clearing: { ...resolvedStageModes.false_suspect_clearing, balance_targets: { ...resolvedStageModes.false_suspect_clearing.balance_targets } },
        clue_reinterpretation: { ...resolvedStageModes.clue_reinterpretation, balance_targets: { ...resolvedStageModes.clue_reinterpretation.balance_targets } },
        discriminating_test: { ...resolvedStageModes.discriminating_test, balance_targets: { ...resolvedStageModes.discriminating_test.balance_targets } },
        final_reveal: { ...resolvedStageModes.final_reveal, balance_targets: { ...resolvedStageModes.final_reveal.balance_targets } },
        aftermath_consequence: { ...resolvedStageModes.aftermath_consequence, balance_targets: { ...resolvedStageModes.aftermath_consequence.balance_targets } },
      },
      underflow_expansion: {
        expansion_size_ratio: {
          min_additional_words_ratio: clampNumber(
            partial.agent9_prose?.underflow_expansion?.expansion_size_ratio?.min_additional_words_ratio,
            DEFAULT_CONFIG.agent9_prose.underflow_expansion.expansion_size_ratio.min_additional_words_ratio,
            0.01,
            1.5,
          ),
          max_additional_words_ratio: clampNumber(
            partial.agent9_prose?.underflow_expansion?.expansion_size_ratio?.max_additional_words_ratio,
            DEFAULT_CONFIG.agent9_prose.underflow_expansion.expansion_size_ratio.max_additional_words_ratio,
            0.05,
            3.0,
          ),
          buffer_words_ratio: clampNumber(
            partial.agent9_prose?.underflow_expansion?.expansion_size_ratio?.buffer_words_ratio,
            DEFAULT_CONFIG.agent9_prose.underflow_expansion.expansion_size_ratio.buffer_words_ratio,
            0.0,
            2.0,
          ),
        },
        temperature: clampNumber(
          partial.agent9_prose?.underflow_expansion?.temperature,
          DEFAULT_CONFIG.agent9_prose.underflow_expansion.temperature,
          0,
          1,
        ),
        max_tokens_ratio: clampNumber(
          partial.agent9_prose?.underflow_expansion?.max_tokens_ratio,
          DEFAULT_CONFIG.agent9_prose.underflow_expansion.max_tokens_ratio,
          0.5,
          10.0,
        ),
        enabled: (partial.agent9_prose?.underflow_expansion?.enabled ?? DEFAULT_CONFIG.agent9_prose.underflow_expansion.enabled) !== false,
        preferred_miss_expansion_ratio: clampNumber(
          partial.agent9_prose?.underflow_expansion?.preferred_miss_expansion_ratio,
          DEFAULT_CONFIG.agent9_prose.underflow_expansion.preferred_miss_expansion_ratio,
          0,
          1,
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
      rollout_flags: {
        phrase_family_detection_enabled:
          typeof partial.agent9_prose?.rollout_flags?.phrase_family_detection_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.phrase_family_detection_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.phrase_family_detection_enabled,
        uncapped_repair_targets_enabled:
          typeof partial.agent9_prose?.rollout_flags?.uncapped_repair_targets_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.uncapped_repair_targets_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.uncapped_repair_targets_enabled,
        precommit_phrase_gate_enabled:
          typeof partial.agent9_prose?.rollout_flags?.precommit_phrase_gate_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.precommit_phrase_gate_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.precommit_phrase_gate_enabled,
        tiered_phrase_contract_enabled:
          typeof partial.agent9_prose?.rollout_flags?.tiered_phrase_contract_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.tiered_phrase_contract_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.tiered_phrase_contract_enabled,
        phrase_specific_linter_enabled:
          typeof partial.agent9_prose?.rollout_flags?.phrase_specific_linter_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.phrase_specific_linter_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.phrase_specific_linter_enabled,
        blue_sky_mode_enabled:
          typeof partial.agent9_prose?.rollout_flags?.blue_sky_mode_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.blue_sky_mode_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.blue_sky_mode_enabled,
        season_lock_context_aware_enabled:
          typeof partial.agent9_prose?.rollout_flags?.season_lock_context_aware_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.season_lock_context_aware_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.season_lock_context_aware_enabled,
        season_lock_protected_collocations_enabled:
          typeof partial.agent9_prose?.rollout_flags?.season_lock_protected_collocations_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.season_lock_protected_collocations_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.season_lock_protected_collocations_enabled,
        boundary_integrity_gate_enabled:
          typeof partial.agent9_prose?.rollout_flags?.boundary_integrity_gate_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.boundary_integrity_gate_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.boundary_integrity_gate_enabled,
        semantic_rewrite_diff_guard_enabled:
          typeof partial.agent9_prose?.rollout_flags?.semantic_rewrite_diff_guard_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.semantic_rewrite_diff_guard_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.semantic_rewrite_diff_guard_enabled,
        entity_fidelity_gate_enabled:
          typeof partial.agent9_prose?.rollout_flags?.entity_fidelity_gate_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.entity_fidelity_gate_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.entity_fidelity_gate_enabled,
        culprit_alias_gate_enabled:
          typeof partial.agent9_prose?.rollout_flags?.culprit_alias_gate_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.culprit_alias_gate_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.culprit_alias_gate_enabled,
        integrity_retry_packet_enabled:
          typeof partial.agent9_prose?.rollout_flags?.integrity_retry_packet_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.integrity_retry_packet_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.integrity_retry_packet_enabled,
        integrity_blue_sky_mode_enabled:
          typeof partial.agent9_prose?.rollout_flags?.integrity_blue_sky_mode_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.integrity_blue_sky_mode_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.integrity_blue_sky_mode_enabled,
        pronoun_gate_parity_enabled:
          typeof partial.agent9_prose?.rollout_flags?.pronoun_gate_parity_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.pronoun_gate_parity_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.pronoun_gate_parity_enabled,
        victim_alive_repair_enabled:
          typeof partial.agent9_prose?.rollout_flags?.victim_alive_repair_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.victim_alive_repair_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.victim_alive_repair_enabled,
        repairable_abort_softening_enabled:
          typeof partial.agent9_prose?.rollout_flags?.repairable_abort_softening_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.repairable_abort_softening_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.repairable_abort_softening_enabled,
        opener_exhaustion_bypass_enabled:
          typeof partial.agent9_prose?.rollout_flags?.opener_exhaustion_bypass_enabled === "boolean"
            ? partial.agent9_prose.rollout_flags.opener_exhaustion_bypass_enabled
            : DEFAULT_CONFIG.agent9_prose.rollout_flags.opener_exhaustion_bypass_enabled,
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
      validation: {
        pronoun_policy: (() => {
          const raw = String(partial.agent9_prose?.validation?.pronoun_policy ?? "").trim().toLowerCase();
          if (raw === "strict" || raw === "relaxed" || raw === "off") {
            return raw as PronounPolicy;
          }
          return DEFAULT_CONFIG.agent9_prose.validation.pronoun_policy;
        })(),
        pronoun_checking_enabled: typeof partial.agent9_prose?.validation?.pronoun_checking_enabled === 'boolean'
          ? partial.agent9_prose.validation.pronoun_checking_enabled
          : DEFAULT_CONFIG.agent9_prose.validation.pronoun_checking_enabled,
        pronoun_validation_enabled: typeof partial.agent9_prose?.validation?.pronoun_validation_enabled === 'boolean'
          ? partial.agent9_prose.validation.pronoun_validation_enabled
          : DEFAULT_CONFIG.agent9_prose.validation.pronoun_validation_enabled,
      },
    },
  };

  if (
    merged.agent9_prose.underflow_expansion.expansion_size_ratio.max_additional_words_ratio <
    merged.agent9_prose.underflow_expansion.expansion_size_ratio.min_additional_words_ratio
  ) {
    merged.agent9_prose.underflow_expansion.expansion_size_ratio.max_additional_words_ratio =
      merged.agent9_prose.underflow_expansion.expansion_size_ratio.min_additional_words_ratio;
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

const derivePronounPolicyFromLegacyFlags = (
  checkingEnabled: boolean,
  validationEnabled: boolean,
): PronounPolicy => {
  if (!checkingEnabled && !validationEnabled) return "off";
  if (checkingEnabled && validationEnabled) return "strict";
  return "relaxed";
};

export const getPronounPolicySettings = (
  config: GenerationParamsConfig = getGenerationParams(),
): PronounPolicySettings => {
  const validationConfig = config.agent9_prose.validation;
  const configuredPolicy = validationConfig.pronoun_policy;
  const policy = configuredPolicy
    ?? derivePronounPolicyFromLegacyFlags(
      validationConfig.pronoun_checking_enabled,
      validationConfig.pronoun_validation_enabled,
    );

  if (policy === "off") {
    return { policy, checkingEnabled: false, validationEnabled: false };
  }

  if (policy === "relaxed") {
    return { policy, checkingEnabled: true, validationEnabled: false };
  }

  return { policy: "strict", checkingEnabled: true, validationEnabled: true };
};

export const getPronounPolicy = (
  config: GenerationParamsConfig = getGenerationParams(),
): PronounPolicy => getPronounPolicySettings(config).policy;

export const resetGenerationParamsCacheForTests = (): void => {
  cachedConfig = null;
  cachedPath = null;
};
