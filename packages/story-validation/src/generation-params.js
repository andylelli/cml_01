import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { load as parseYaml } from "js-yaml";
const DEFAULT_CONFIG = {
    story_length_policy: {
        chapter_targets: {
            short: 20,
            medium: 30,
            long: 42,
        },
        chapter_target_tolerance: 3,
        word_targets: {
            short: {
                min_words: 15000,
                max_words: 25000,
                chapter_ideal_words: 1000,
            },
            medium: {
                min_words: 40000,
                max_words: 60000,
                chapter_ideal_words: 1700,
            },
            long: {
                min_words: 70000,
                max_words: 100000,
                chapter_ideal_words: 2200,
            },
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
            prompt_overshoot_buffer_words: 200,
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
            clue_presence_adjudicator_shadow_enabled: false,
            clue_presence_adjudicator_max_ids_per_chapter: 4,
            clue_presence_adjudicator_potential_override_confidence: 0.7,
            clue_id_marker_mode_enabled: false,
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
let cachedConfig = null;
let cachedPath = null;
const clampNumber = (value, fallback, min, max) => {
    if (typeof value !== "number" || Number.isNaN(value))
        return fallback;
    return Math.min(max, Math.max(min, value));
};
const requireYamlNumber = (value, keyPath, min, max) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
        throw new Error(`Missing required numeric config: ${keyPath}`);
    }
    return Math.min(max, Math.max(min, value));
};
const assertYamlMatchesTemplate = (value, template, keyPath) => {
    if (typeof template === "number") {
        if (typeof value !== "number" || Number.isNaN(value)) {
            throw new Error(`Missing required numeric config: ${keyPath}`);
        }
        return;
    }
    if (typeof template === "string") {
        if (typeof value !== "string") {
            throw new Error(`Missing required string config: ${keyPath}`);
        }
        return;
    }
    if (template && typeof template === "object") {
        if (!value || typeof value !== "object" || Array.isArray(value)) {
            throw new Error(`Missing required object config: ${keyPath}`);
        }
        const templateRecord = template;
        const valueRecord = value;
        for (const childKey of Object.keys(templateRecord)) {
            const childPath = keyPath ? `${keyPath}.${childKey}` : childKey;
            if (!(childKey in valueRecord)) {
                throw new Error(`Missing required config key: ${childPath}`);
            }
            assertYamlMatchesTemplate(valueRecord[childKey], templateRecord[childKey], childPath);
        }
    }
};
const resolveDefaultConfigPath = () => {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(currentDir, "..", "..", "..", "apps", "worker", "config", "generation-params.yaml");
};
const resolveConfigPath = () => {
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
const mergeConfig = (partial) => {
    const source = partial;
    const agent9WordPolicySource = source.agent9_prose?.word_policy;
    const hardFloorRelaxationRatio = requireYamlNumber(agent9WordPolicySource?.hard_floor_relaxation_ratio, "agent9_prose.word_policy.hard_floor_relaxation_ratio", 0.6, 1);
    const merged = {
        story_length_policy: {
            chapter_targets: {
                short: Math.floor(clampNumber(source.story_length_policy?.chapter_targets?.short, DEFAULT_CONFIG.story_length_policy.chapter_targets.short, 5, 80)),
                medium: Math.floor(clampNumber(source.story_length_policy?.chapter_targets?.medium, DEFAULT_CONFIG.story_length_policy.chapter_targets.medium, 5, 80)),
                long: Math.floor(clampNumber(source.story_length_policy?.chapter_targets?.long, DEFAULT_CONFIG.story_length_policy.chapter_targets.long, 5, 80)),
            },
            chapter_target_tolerance: Math.floor(clampNumber(source.story_length_policy?.chapter_target_tolerance, DEFAULT_CONFIG.story_length_policy.chapter_target_tolerance, 0, 10)),
            word_targets: {
                short: {
                    min_words: Math.floor(clampNumber(source.story_length_policy?.word_targets?.short?.min_words, DEFAULT_CONFIG.story_length_policy.word_targets.short.min_words, 1000, 200000)),
                    max_words: Math.floor(clampNumber(source.story_length_policy?.word_targets?.short?.max_words, DEFAULT_CONFIG.story_length_policy.word_targets.short.max_words, 1000, 250000)),
                    chapter_ideal_words: Math.floor(clampNumber(source.story_length_policy?.word_targets?.short?.chapter_ideal_words, DEFAULT_CONFIG.story_length_policy.word_targets.short.chapter_ideal_words, 200, 12000)),
                },
                medium: {
                    min_words: Math.floor(clampNumber(source.story_length_policy?.word_targets?.medium?.min_words, DEFAULT_CONFIG.story_length_policy.word_targets.medium.min_words, 1000, 200000)),
                    max_words: Math.floor(clampNumber(source.story_length_policy?.word_targets?.medium?.max_words, DEFAULT_CONFIG.story_length_policy.word_targets.medium.max_words, 1000, 250000)),
                    chapter_ideal_words: Math.floor(clampNumber(source.story_length_policy?.word_targets?.medium?.chapter_ideal_words, DEFAULT_CONFIG.story_length_policy.word_targets.medium.chapter_ideal_words, 200, 12000)),
                },
                long: {
                    min_words: Math.floor(clampNumber(source.story_length_policy?.word_targets?.long?.min_words, DEFAULT_CONFIG.story_length_policy.word_targets.long.min_words, 1000, 200000)),
                    max_words: Math.floor(clampNumber(source.story_length_policy?.word_targets?.long?.max_words, DEFAULT_CONFIG.story_length_policy.word_targets.long.max_words, 1000, 250000)),
                    chapter_ideal_words: Math.floor(clampNumber(source.story_length_policy?.word_targets?.long?.chapter_ideal_words, DEFAULT_CONFIG.story_length_policy.word_targets.long.chapter_ideal_words, 200, 12000)),
                },
            },
        },
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
                hard_floor_relaxation_ratio: hardFloorRelaxationRatio,
                prompt_overshoot_buffer_words: Math.floor(clampNumber(agent9WordPolicySource?.prompt_overshoot_buffer_words, DEFAULT_CONFIG.agent9_prose.word_policy.prompt_overshoot_buffer_words, 0, 600)),
            },
            underflow_expansion: {
                min_additional_words: Math.floor(clampNumber(partial.agent9_prose?.underflow_expansion?.min_additional_words, DEFAULT_CONFIG.agent9_prose.underflow_expansion.min_additional_words, 50, 2000)),
                max_additional_words: Math.floor(clampNumber(partial.agent9_prose?.underflow_expansion?.max_additional_words, DEFAULT_CONFIG.agent9_prose.underflow_expansion.max_additional_words, 100, 4000)),
                buffer_words: Math.floor(clampNumber(partial.agent9_prose?.underflow_expansion?.buffer_words, DEFAULT_CONFIG.agent9_prose.underflow_expansion.buffer_words, 0, 3000)),
                temperature: clampNumber(partial.agent9_prose?.underflow_expansion?.temperature, DEFAULT_CONFIG.agent9_prose.underflow_expansion.temperature, 0, 1),
                max_tokens: Math.floor(clampNumber(partial.agent9_prose?.underflow_expansion?.max_tokens, DEFAULT_CONFIG.agent9_prose.underflow_expansion.max_tokens, 500, 16000)),
            },
            generation: {
                default_max_attempts: Math.floor(clampNumber(partial.agent9_prose?.generation?.default_max_attempts, DEFAULT_CONFIG.agent9_prose.generation.default_max_attempts, 1, 8)),
                clue_presence_adjudicator_shadow_enabled: typeof partial.agent9_prose?.generation?.clue_presence_adjudicator_shadow_enabled === "boolean"
                    ? partial.agent9_prose.generation.clue_presence_adjudicator_shadow_enabled
                    : DEFAULT_CONFIG.agent9_prose.generation.clue_presence_adjudicator_shadow_enabled,
                clue_presence_adjudicator_max_ids_per_chapter: Math.floor(clampNumber(partial.agent9_prose?.generation?.clue_presence_adjudicator_max_ids_per_chapter, DEFAULT_CONFIG.agent9_prose.generation.clue_presence_adjudicator_max_ids_per_chapter, 1, 20)),
                clue_presence_adjudicator_potential_override_confidence: clampNumber(partial.agent9_prose?.generation?.clue_presence_adjudicator_potential_override_confidence, DEFAULT_CONFIG.agent9_prose.generation.clue_presence_adjudicator_potential_override_confidence, 0, 1),
                clue_id_marker_mode_enabled: typeof partial.agent9_prose?.generation?.clue_id_marker_mode_enabled === "boolean"
                    ? partial.agent9_prose.generation.clue_id_marker_mode_enabled
                    : DEFAULT_CONFIG.agent9_prose.generation.clue_id_marker_mode_enabled,
            },
            prose_model: {
                temperature: clampNumber(partial.agent9_prose?.prose_model?.temperature, DEFAULT_CONFIG.agent9_prose.prose_model.temperature, 0, 1),
                max_batch_size: Math.floor(clampNumber(partial.agent9_prose?.prose_model?.max_batch_size, DEFAULT_CONFIG.agent9_prose.prose_model.max_batch_size, 1, 20)),
            },
            style_linter: {
                entropy: {
                    standard: {
                        early_chapter_max: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.entropy?.standard?.early_chapter_max, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.standard.early_chapter_max, 1, 20)),
                        early_threshold: clampNumber(partial.agent9_prose?.style_linter?.entropy?.standard?.early_threshold, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.standard.early_threshold, 0, 2),
                        mid_chapter_max: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.entropy?.standard?.mid_chapter_max, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.standard.mid_chapter_max, 2, 30)),
                        mid_threshold: clampNumber(partial.agent9_prose?.style_linter?.entropy?.standard?.mid_threshold, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.standard.mid_threshold, 0, 2),
                        late_threshold: clampNumber(partial.agent9_prose?.style_linter?.entropy?.standard?.late_threshold, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.standard.late_threshold, 0, 2),
                    },
                    repair_threshold: clampNumber(partial.agent9_prose?.style_linter?.entropy?.repair_threshold, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.repair_threshold, 0, 2),
                    min_window_standard: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.entropy?.min_window_standard, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.min_window_standard, 2, 20)),
                    min_window_repair: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.entropy?.min_window_repair, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.min_window_repair, 2, 20)),
                    warmup_chapters_standard: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.entropy?.warmup_chapters_standard, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.warmup_chapters_standard, 0, 20)),
                    warmup_chapters_repair: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.entropy?.warmup_chapters_repair, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.warmup_chapters_repair, 0, 20)),
                    opening_styles_prior_window: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.entropy?.opening_styles_prior_window, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.opening_styles_prior_window, 1, 30)),
                    opening_styles_total_window: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.entropy?.opening_styles_total_window, DEFAULT_CONFIG.agent9_prose.style_linter.entropy.opening_styles_total_window, 2, 40)),
                },
                paragraph_fingerprint_min_chars: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.paragraph_fingerprint_min_chars, DEFAULT_CONFIG.agent9_prose.style_linter.paragraph_fingerprint_min_chars, 80, 800)),
                ngram: {
                    min_chars: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.ngram?.min_chars, DEFAULT_CONFIG.agent9_prose.style_linter.ngram.min_chars, 50, 800)),
                    gram_size: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.ngram?.gram_size, DEFAULT_CONFIG.agent9_prose.style_linter.ngram.gram_size, 2, 12)),
                    overlap_threshold: clampNumber(partial.agent9_prose?.style_linter?.ngram?.overlap_threshold, DEFAULT_CONFIG.agent9_prose.style_linter.ngram.overlap_threshold, 0, 1),
                    min_candidate_ngrams: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.ngram?.min_candidate_ngrams, DEFAULT_CONFIG.agent9_prose.style_linter.ngram.min_candidate_ngrams, 1, 200)),
                    prior_paragraph_limit: Math.floor(clampNumber(partial.agent9_prose?.style_linter?.ngram?.prior_paragraph_limit, DEFAULT_CONFIG.agent9_prose.style_linter.ngram.prior_paragraph_limit, 1, 200)),
                },
            },
            scoring_adapter: {
                discriminating: {
                    semantic_token_match_ratio: clampNumber(partial.agent9_prose?.scoring_adapter?.discriminating?.semantic_token_match_ratio, DEFAULT_CONFIG.agent9_prose.scoring_adapter.discriminating.semantic_token_match_ratio, 0, 1),
                    min_semantic_token_matches: Math.floor(clampNumber(partial.agent9_prose?.scoring_adapter?.discriminating?.min_semantic_token_matches, DEFAULT_CONFIG.agent9_prose.scoring_adapter.discriminating.min_semantic_token_matches, 1, 10)),
                    max_semantic_tokens: Math.floor(clampNumber(partial.agent9_prose?.scoring_adapter?.discriminating?.max_semantic_tokens, DEFAULT_CONFIG.agent9_prose.scoring_adapter.discriminating.max_semantic_tokens, 1, 50)),
                },
                clue_semantic: {
                    token_match_ratio: clampNumber(partial.agent9_prose?.scoring_adapter?.clue_semantic?.token_match_ratio, DEFAULT_CONFIG.agent9_prose.scoring_adapter.clue_semantic.token_match_ratio, 0, 1),
                    min_token_matches: Math.floor(clampNumber(partial.agent9_prose?.scoring_adapter?.clue_semantic?.min_token_matches, DEFAULT_CONFIG.agent9_prose.scoring_adapter.clue_semantic.min_token_matches, 1, 10)),
                    confidence_cap: clampNumber(partial.agent9_prose?.scoring_adapter?.clue_semantic?.confidence_cap, DEFAULT_CONFIG.agent9_prose.scoring_adapter.clue_semantic.confidence_cap, 0, 1),
                    signature_tokens_from_distribution: Math.floor(clampNumber(partial.agent9_prose?.scoring_adapter?.clue_semantic?.signature_tokens_from_distribution, DEFAULT_CONFIG.agent9_prose.scoring_adapter.clue_semantic.signature_tokens_from_distribution, 1, 40)),
                    signature_tokens_from_id_fallback: Math.floor(clampNumber(partial.agent9_prose?.scoring_adapter?.clue_semantic?.signature_tokens_from_id_fallback, DEFAULT_CONFIG.agent9_prose.scoring_adapter.clue_semantic.signature_tokens_from_id_fallback, 1, 40)),
                },
                fair_play: {
                    spoiler_early_chapter_ratio: clampNumber(partial.agent9_prose?.scoring_adapter?.fair_play?.spoiler_early_chapter_ratio, DEFAULT_CONFIG.agent9_prose.scoring_adapter.fair_play.spoiler_early_chapter_ratio, 0.1, 1),
                },
            },
            scorer: {
                completeness: {
                    word_count: {
                        low_ratio: clampNumber(partial.agent9_prose?.scorer?.completeness?.word_count?.low_ratio, DEFAULT_CONFIG.agent9_prose.scorer.completeness.word_count.low_ratio, 0, 1),
                        low_score: clampNumber(partial.agent9_prose?.scorer?.completeness?.word_count?.low_score, DEFAULT_CONFIG.agent9_prose.scorer.completeness.word_count.low_score, 0, 100),
                    },
                    clue_visibility: {
                        pass_ratio: clampNumber(partial.agent9_prose?.scorer?.completeness?.clue_visibility?.pass_ratio, DEFAULT_CONFIG.agent9_prose.scorer.completeness.clue_visibility.pass_ratio, 0, 1),
                        minor_gap_ratio: clampNumber(partial.agent9_prose?.scorer?.completeness?.clue_visibility?.minor_gap_ratio, DEFAULT_CONFIG.agent9_prose.scorer.completeness.clue_visibility.minor_gap_ratio, 0, 1),
                        minor_gap_score: clampNumber(partial.agent9_prose?.scorer?.completeness?.clue_visibility?.minor_gap_score, DEFAULT_CONFIG.agent9_prose.scorer.completeness.clue_visibility.minor_gap_score, 0, 100),
                    },
                },
            },
        },
    };
    if (merged.agent9_prose.underflow_expansion.max_additional_words <
        merged.agent9_prose.underflow_expansion.min_additional_words) {
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
export const getGenerationParams = () => {
    const resolvedPath = resolveConfigPath();
    if (cachedConfig && cachedPath === resolvedPath) {
        return cachedConfig;
    }
    try {
        const raw = readFileSync(resolvedPath, "utf8");
        const parsed = parseYaml(raw);
        assertYamlMatchesTemplate(parsed ?? {}, DEFAULT_CONFIG, "");
        cachedConfig = mergeConfig(parsed ?? {});
        cachedPath = resolvedPath;
        return cachedConfig;
    }
    catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load generation params from ${resolvedPath}: ${reason}`);
    }
};
export const resetGenerationParamsCacheForTests = () => {
    cachedConfig = null;
    cachedPath = null;
};
//# sourceMappingURL=generation-params.js.map