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
    prompt_overshoot_buffer_words: number;
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
    clue_presence_adjudicator_shadow_enabled: boolean;
    clue_presence_adjudicator_max_ids_per_chapter: number;
    clue_presence_adjudicator_potential_override_confidence: number;
    clue_id_marker_mode_enabled: boolean;
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
export interface StoryLengthPolicyConfig {
    chapter_targets: {
        short: number;
        medium: number;
        long: number;
    };
    chapter_target_tolerance: number;
    word_targets: {
        short: {
            min_words: number;
            max_words: number;
            chapter_ideal_words: number;
        };
        medium: {
            min_words: number;
            max_words: number;
            chapter_ideal_words: number;
        };
        long: {
            min_words: number;
            max_words: number;
            chapter_ideal_words: number;
        };
    };
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
export declare const getGenerationParams: () => GenerationParamsConfig;
export declare const resetGenerationParamsCacheForTests: () => void;
export {};
