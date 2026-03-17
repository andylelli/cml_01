/**
 * Agent 9: Prose Generator
 *
 * Generates full narrative prose from the narrative outline + CML + cast.
 * Output Format: JSON (chapters with paragraphs)
 */
import { createHash } from 'node:crypto';
import { jsonrepair } from "jsonrepair";
import { ChapterValidator, CharacterConsistencyValidator, STORY_LENGTH_TARGETS, anonymizeUnknownTitledNames, getSceneTarget, getChapterTargetTolerance, getGenerationParams, repairChapterPronouns, } from "@cml/story-validation";
import { classifyOpeningStyle } from "./types/narrative-state.js";
import { updateNSD } from "./types/narrative-state.js";
const CLUE_ID_MARKER_REGEX = /\[\[\s*CLUE_ID\s*:\s*([^\]]+?)\s*\]\]/gi;
const isCluePresenceAdjudicatorShadowEnabled = () => {
    const yamlEnabled = getGenerationParams().agent9_prose.generation.clue_presence_adjudicator_shadow_enabled;
    if (typeof yamlEnabled === "boolean") {
        return yamlEnabled;
    }
    return /^(1|true|yes)$/i.test(process.env.AGENT9_CLUE_PRESENCE_ADJUDICATOR_SHADOW ?? "");
};
const getCluePresenceAdjudicatorMaxIdsPerChapter = () => {
    const yamlValue = getGenerationParams().agent9_prose.generation.clue_presence_adjudicator_max_ids_per_chapter;
    return Number.isFinite(yamlValue) ? Math.max(1, Math.floor(yamlValue)) : 4;
};
const getCluePresenceAdjudicatorPotentialOverrideConfidence = () => {
    const yamlValue = getGenerationParams().agent9_prose.generation.clue_presence_adjudicator_potential_override_confidence;
    return Number.isFinite(yamlValue) ? Math.max(0, Math.min(1, yamlValue)) : 0.7;
};
const isClueIdMarkerModeEnabled = () => {
    const yamlEnabled = getGenerationParams().agent9_prose.generation.clue_id_marker_mode_enabled;
    if (typeof yamlEnabled === "boolean") {
        return yamlEnabled;
    }
    return /^(1|true|yes)$/i.test(process.env.AGENT9_CLUE_ID_MARKER_MODE ?? "");
};
const GENERATION_PARAMS_YAML_PATH = "apps/worker/config/generation-params.yaml";
const countWords = (value) => {
    const trimmed = value.trim();
    if (trimmed.length === 0)
        return 0;
    return trimmed.split(/\s+/).length;
};
const getChapterWordTargets = (targetLength) => {
    const config = getGenerationParams().agent9_prose.word_policy;
    return {
        hardFloorWords: Math.max(config.min_hard_floor_words, Math.floor(STORY_LENGTH_TARGETS[targetLength].chapterMinWords * config.hard_floor_relaxation_ratio)),
        preferredWords: config.preferred_chapter_words[targetLength],
    };
};
const CLUE_TOKEN_STOPWORDS = new Set([
    "about", "after", "again", "against", "between", "could", "every", "first", "found", "from",
    "having", "however", "later", "might", "other", "their", "there", "these", "those", "through",
    "under", "where", "which", "while", "would", "without", "afterward", "during",
]);
const normalizeClueId = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const tokenizeForClueObligation = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !CLUE_TOKEN_STOPWORDS.has(token));
const resolveClueById = (clueDistribution, clueId) => {
    const normalizedClueId = normalizeClueId(String(clueId || ""));
    return (clueDistribution?.clues ?? []).find((entry) => normalizeClueId(String(entry?.id || "")) === normalizedClueId);
};
const getRequiredClueIdsForScene = (cmlCase, scene) => {
    const mapped = (cmlCase?.prose_requirements?.clue_to_scene_mapping ?? [])
        .filter((entry) => Number(entry?.act_number) === Number(scene?.act) &&
        Number(entry?.scene_number) === Number(scene?.sceneNumber))
        .map((entry) => String(entry?.clue_id || ""))
        .filter(Boolean);
    const sceneClues = (Array.isArray(scene?.cluesRevealed) ? scene.cluesRevealed : [])
        .map((id) => String(id || ""))
        .filter(Boolean);
    return Array.from(new Set([...mapped, ...sceneClues]));
};
const buildChapterRequirementLedger = (cmlCase, batchScenes, chapterStart, targetLength) => {
    const { hardFloorWords, preferredWords } = getChapterWordTargets(targetLength);
    return batchScenes.map((scene, idx) => ({
        chapterNumber: chapterStart + idx,
        targetLength,
        hardFloorWords,
        preferredWords,
        requiredClueIds: getRequiredClueIdsForScene(cmlCase, scene),
    }));
};
const chapterMentionsRequiredClue = (chapterText, clueId, clueDistribution) => {
    const lowered = chapterText.toLowerCase();
    const normalizedClueId = normalizeClueId(clueId);
    if (lowered.includes(clueId.toLowerCase())) {
        return true;
    }
    if (normalizedClueId.length > 0 && lowered.includes(normalizedClueId)) {
        return true;
    }
    const clue = (clueDistribution?.clues ?? []).find((entry) => normalizeClueId(String(entry?.id || "")) === normalizedClueId);
    if (!clue)
        return false;
    const tokens = Array.from(new Set([
        ...tokenizeForClueObligation(String(clue.description ?? "")),
        ...tokenizeForClueObligation(String(clue.pointsTo ?? "")),
    ])).slice(0, 10);
    if (tokens.length === 0)
        return false;
    const matched = tokens.filter((token) => lowered.includes(token));
    const requiredMatches = Math.max(2, Math.ceil(tokens.length * 0.4));
    return matched.length >= requiredMatches;
};
const getMissingRequiredClueIds = (chapterText, requiredClueIds, clueDistribution) => requiredClueIds.filter((clueId) => !chapterMentionsRequiredClue(chapterText, clueId, clueDistribution));
export const stripClueIdMarkersFromText = (value) => value
    .replace(CLUE_ID_MARKER_REGEX, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
const stripClueIdMarkersFromChapter = (chapter) => ({
    ...chapter,
    title: stripClueIdMarkersFromText(chapter.title),
    summary: typeof chapter.summary === "string" ? stripClueIdMarkersFromText(chapter.summary) : chapter.summary,
    paragraphs: (chapter.paragraphs ?? []).map((paragraph) => stripClueIdMarkersFromText(String(paragraph || ""))),
});
export const validateChapterPreCommitObligations = (chapter, ledgerEntry, clueDistribution) => {
    const hardFailures = [];
    const preferredMisses = [];
    const chapterText = (chapter.paragraphs ?? []).join(" ");
    const wordCount = countWords(chapterText);
    const wordTarget = {
        wordCount,
        hardFloorWords: ledgerEntry.hardFloorWords,
        preferredWords: ledgerEntry.preferredWords,
        isBelowHardFloor: wordCount < ledgerEntry.hardFloorWords,
        isBelowPreferred: wordCount < ledgerEntry.preferredWords,
    };
    if (wordTarget.isBelowHardFloor) {
        hardFailures.push(`Chapter ${ledgerEntry.chapterNumber}: word count below hard floor (${wordCount}/${ledgerEntry.hardFloorWords})`);
    }
    else if (wordTarget.isBelowPreferred) {
        preferredMisses.push(`Chapter ${ledgerEntry.chapterNumber}: word count below preferred target (${wordCount}/${ledgerEntry.preferredWords})`);
    }
    const missingRequiredClueIds = getMissingRequiredClueIds(chapterText, ledgerEntry.requiredClueIds, clueDistribution);
    for (const clueId of missingRequiredClueIds) {
        hardFailures.push(`Chapter ${ledgerEntry.chapterNumber}: missing required clue obligation for "${clueId}"`);
    }
    return { hardFailures, preferredMisses, wordTarget, missingRequiredClueIds };
};
const normalizeParagraphForFingerprint = (paragraph) => paragraph
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const tokenizeWords = (text) => text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0);
const toNgrams = (tokens, n) => {
    const grams = new Set();
    if (tokens.length < n)
        return grams;
    for (let i = 0; i <= tokens.length - n; i += 1) {
        grams.add(tokens.slice(i, i + n).join(" "));
    }
    return grams;
};
const jaccardSimilarity = (a, b) => {
    if (a.size === 0 || b.size === 0)
        return 0;
    let intersection = 0;
    for (const item of a) {
        if (b.has(item))
            intersection += 1;
    }
    const union = a.size + b.size - intersection;
    return union > 0 ? intersection / union : 0;
};
const extractOpeningSentence = (paragraph) => {
    const firstSentence = paragraph.match(/^[^.!?]+[.!?]/);
    return (firstSentence?.[0] ?? paragraph).trim();
};
const classifyOpeningEntropyKey = (openingSentence) => {
    const style = classifyOpeningStyle(openingSentence);
    if (style !== "general-descriptive")
        return style;
    const stopWords = new Set([
        "the", "a", "an", "and", "or", "but", "so", "for", "to", "of", "in", "on", "at", "with", "by", "from", "into", "over", "under", "after", "before", "as", "it", "there", "was", "were", "is", "are", "had", "has",
    ]);
    const tokens = tokenizeWords(openingSentence).filter((token) => token.length > 2 && !stopWords.has(token));
    if (tokens.length === 0)
        return style;
    // Add a compact lexical signature so distinct descriptive openings do not all collapse
    // to one bucket and trigger false zero-entropy failures.
    return `${style}:${tokens.slice(0, 2).join("-")}`;
};
const shannonEntropy = (values) => {
    if (values.length === 0)
        return 0;
    const counts = new Map();
    values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
    let entropy = 0;
    for (const count of counts.values()) {
        const p = count / values.length;
        entropy -= p * Math.log2(p);
    }
    return entropy;
};
const lintBatchProse = (batchChapters, priorChapters, priorOpeningStyles, options) => {
    const issues = [];
    const styleLinterConfig = getGenerationParams().agent9_prose.style_linter;
    const entropyConfig = styleLinterConfig.entropy;
    const mode = options?.mode ?? "standard";
    const chapterOffset = Math.max(0, options?.chapterOffset ?? 0);
    const entropyMinWindow = Math.max(2, options?.entropyMinWindow ??
        (mode === "repair" ? entropyConfig.min_window_repair : entropyConfig.min_window_standard));
    const entropyWarmupChapters = Math.max(0, options?.entropyWarmupChapters ??
        (mode === "repair" ? entropyConfig.warmup_chapters_repair : entropyConfig.warmup_chapters_standard));
    const generatedChapterCount = chapterOffset + priorChapters.length + batchChapters.length;
    const adaptiveStandardEntropyThreshold = (() => {
        // Short stories have fewer chapters to establish variety, so the threshold starts lower
        // and tightens as the run grows.  Three tiers:
        //   ≤6 chapters  → 0.65 (lenient: small window = low inherent entropy)
        //   ≤10 chapters → 0.72 (moderate)
        //   >10 chapters → 0.80 (strict: any style recycling is now clearly a template defect)
        if (generatedChapterCount <= entropyConfig.standard.early_chapter_max) {
            return entropyConfig.standard.early_threshold;
        }
        if (generatedChapterCount <= entropyConfig.standard.mid_chapter_max) {
            return entropyConfig.standard.mid_threshold;
        }
        return entropyConfig.standard.late_threshold;
    })();
    const entropyThreshold = options?.entropyThreshold ??
        (mode === "repair" ? entropyConfig.repair_threshold : adaptiveStandardEntropyThreshold);
    const priorOpeningStylesFromChapters = priorChapters
        .map((chapter) => (chapter.paragraphs?.[0] ? classifyOpeningEntropyKey(extractOpeningSentence(chapter.paragraphs[0])) : "general-descriptive"))
        .filter(Boolean);
    const fallbackPriorStyles = priorOpeningStyles.map((style) => String(style || "general-descriptive")).filter(Boolean);
    const candidateOpeningStyles = batchChapters
        .map((chapter) => (chapter.paragraphs?.[0] ? classifyOpeningEntropyKey(extractOpeningSentence(chapter.paragraphs[0])) : "general-descriptive"))
        .filter(Boolean);
    const openingWindow = [
        ...(priorOpeningStylesFromChapters.length > 0 ? priorOpeningStylesFromChapters : fallbackPriorStyles).slice(-entropyConfig.opening_styles_prior_window),
        ...candidateOpeningStyles,
    ].slice(-entropyConfig.opening_styles_total_window);
    const entropyCheckReady = generatedChapterCount > entropyWarmupChapters;
    if (entropyCheckReady && openingWindow.length >= entropyMinWindow) {
        const entropy = shannonEntropy(openingWindow);
        if (entropy < entropyThreshold) {
            issues.push({
                type: "opening_style_entropy",
                message: `Template linter: opening-style entropy too low (${entropy.toFixed(2)} < ${entropyThreshold.toFixed(2)}). Vary chapter openings and avoid repeated style buckets.`,
            });
        }
    }
    // Paragraph fingerprint check: exact deduplication of long prose blocks across chapters.
    // Minimum length is configurable to avoid false positives on short scene-setter fragments.
    const priorFingerprints = new Set();
    priorChapters.forEach((chapter) => {
        (chapter.paragraphs ?? []).forEach((paragraph) => {
            const normalized = normalizeParagraphForFingerprint(paragraph);
            if (normalized.length >= styleLinterConfig.paragraph_fingerprint_min_chars) {
                priorFingerprints.add(normalized);
            }
        });
    });
    const batchSeen = new Set();
    for (const chapter of batchChapters) {
        for (const paragraph of chapter.paragraphs ?? []) {
            const normalized = normalizeParagraphForFingerprint(paragraph);
            if (normalized.length < styleLinterConfig.paragraph_fingerprint_min_chars)
                continue;
            if (priorFingerprints.has(normalized) || batchSeen.has(normalized)) {
                issues.push({
                    type: "paragraph_fingerprint",
                    message: "Template linter: repeated long paragraph fingerprint detected. Rewrite repeated scaffold-like prose into chapter-specific language.",
                });
                break;
            }
            batchSeen.add(normalized);
        }
        if (issues.some((issue) => issue.type === "paragraph_fingerprint"))
            break;
    }
    // N-gram overlap check: catches near-duplicate prose that evades exact fingerprinting
    // (e.g. when the LLM swaps a few words but keeps the same sentence structure).
    // We compare configurable n-gram Jaccard similarity against a bounded prior paragraph set.
    const priorCandidates = priorChapters
        .flatMap((chapter) => chapter.paragraphs ?? [])
        .map((paragraph) => normalizeParagraphForFingerprint(paragraph))
        .filter((paragraph) => paragraph.length >= styleLinterConfig.ngram.min_chars)
        .slice(-styleLinterConfig.ngram.prior_paragraph_limit);
    const priorNgrams = priorCandidates.map((paragraph) => toNgrams(tokenizeWords(paragraph), styleLinterConfig.ngram.gram_size));
    if (priorNgrams.length > 0) {
        outer: for (const chapter of batchChapters) {
            for (const paragraph of chapter.paragraphs ?? []) {
                const normalized = normalizeParagraphForFingerprint(paragraph);
                if (normalized.length < styleLinterConfig.ngram.min_chars)
                    continue;
                const candidate = toNgrams(tokenizeWords(normalized), styleLinterConfig.ngram.gram_size);
                if (candidate.size < styleLinterConfig.ngram.min_candidate_ngrams)
                    continue;
                for (const base of priorNgrams) {
                    const overlap = jaccardSimilarity(candidate, base);
                    if (overlap >= styleLinterConfig.ngram.overlap_threshold) {
                        issues.push({
                            type: "ngram_overlap",
                            message: `Template linter: high n-gram overlap detected (${overlap.toFixed(2)} >= ${styleLinterConfig.ngram.overlap_threshold.toFixed(2)}). Rephrase this passage to avoid template leakage.`,
                        });
                        break outer;
                    }
                }
            }
        }
    }
    return issues;
};
const MONTH_TO_SEASON = {
    january: 'winter',
    february: 'winter',
    march: 'spring',
    april: 'spring',
    may: 'spring',
    june: 'summer',
    july: 'summer',
    august: 'summer',
    september: 'autumn',
    october: 'autumn',
    november: 'autumn',
    december: 'winter',
};
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeMonthToken = (value) => {
    if (typeof value !== 'string')
        return undefined;
    const normal = value.trim().toLowerCase();
    return normal.length > 0 ? normal : undefined;
};
const capitalizeWord = (value) => {
    if (!value)
        return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
};
const deriveTemporalSeasonLock = (temporalContext) => {
    const month = normalizeMonthToken(temporalContext?.specificDate?.month);
    if (!month)
        return undefined;
    const season = MONTH_TO_SEASON[month];
    if (!season)
        return undefined;
    return { month, season };
};
const conflictingSeasonPatterns = {
    spring: [/\b(summer|midsummer|autumn|winter|wintry)\b/gi],
    summer: [/\b(spring|vernal|autumn|winter|wintry)\b/gi],
    autumn: [/\b(spring|vernal|summer|midsummer|winter|wintry)\b/gi],
    winter: [/\b(spring|vernal|summer|midsummer|autumn)\b/gi],
};
const enforceMonthSeasonLockOnChapter = (chapter, lock) => {
    if (!lock)
        return chapter;
    if (!Array.isArray(chapter.paragraphs) || chapter.paragraphs.length === 0)
        return chapter;
    const monthPattern = new RegExp(`\\b${escapeRegExp(lock.month)}\\b`, 'i');
    const chapterText = chapter.paragraphs.join(' ');
    if (!monthPattern.test(chapterText)) {
        return chapter;
    }
    const expectedSeason = lock.season;
    const patterns = conflictingSeasonPatterns[expectedSeason];
    let changed = false;
    const rewritten = chapter.paragraphs.map((paragraph) => {
        let next = paragraph;
        for (const pattern of patterns) {
            next = next.replace(pattern, (matched) => {
                changed = true;
                return matched.charAt(0) === matched.charAt(0).toUpperCase()
                    ? capitalizeWord(expectedSeason)
                    : expectedSeason;
            });
        }
        return next;
    });
    if (!changed)
        return chapter;
    return {
        ...chapter,
        paragraphs: rewritten,
    };
};
const buildContextSummary = (caseData, cast) => {
    const cmlCase = caseData?.CASE ?? {};
    const meta = cmlCase.meta ?? {};
    const crimeClass = meta.crime_class ?? {};
    const era = meta.era?.decade ?? "Unknown era";
    const location = meta.setting?.location ?? "Unknown setting";
    const title = meta.title ?? "Untitled Mystery";
    const falseAssumption = cmlCase.false_assumption?.statement ?? "";
    const culpritNames = cmlCase.culpability?.culprits ?? [];
    const culprit = Array.isArray(culpritNames) ? culpritNames.join(", ") : "Unknown";
    const castNames = cast.characters.map((c) => c.name).join(", ");
    // Resolve victim's full name from cast by roleArchetype (camelCase) or role_archetype (snake_case)
    const victimCharacter = cast.characters.find((c) => {
        const archetype = c.roleArchetype ?? c.role_archetype ?? '';
        return typeof archetype === 'string' && archetype.toLowerCase().includes('victim');
    });
    const victimName = victimCharacter?.name ?? '';
    const victimLine = victimName ? `\nVictim: ${victimName}` : '';
    return `# Case Overview\nTitle: ${title}\nEra: ${era}\nSetting: ${location}\nCrime: ${crimeClass.category ?? "murder"} (${crimeClass.subtype ?? "unknown"})\nCulprit: ${culprit}${victimLine}\nFalse assumption: ${falseAssumption}\nCast: ${castNames}\n\nSetting Lock: Keep all scenes and descriptions consistent with the stated setting (${location}). Do not introduce a different location type.`;
};
/**
 * Returns the victim character's full name from the cast, or '' if not found.
 * Used to enforce named-victim guardrails in prose prompts.
 */
export const resolveVictimName = (cast) => {
    const victimChar = cast.characters.find((c) => {
        const archetype = c.roleArchetype ?? c.role_archetype ?? '';
        return typeof archetype === 'string' && archetype.toLowerCase().includes('victim');
    });
    return victimChar?.name ?? '';
};
const buildPronounLockLines = (castCharacters) => castCharacters.map((character) => {
    const gender = String(character.gender ?? '').toLowerCase();
    const pronouns = gender === 'male'
        ? 'he/him/his'
        : gender === 'female'
            ? 'she/her/her'
            : 'they/them/their';
    return `- ${character.name}: ${pronouns}`;
});
const resolveVictimNameFromCaseData = (caseData) => {
    const cmlCase = caseData?.CASE ?? {};
    const cast = Array.isArray(cmlCase.cast) ? cmlCase.cast : [];
    const victim = cast.find((character) => {
        const archetype = String(character?.role_archetype ?? character?.roleArchetype ?? '').toLowerCase();
        return archetype.includes('victim');
    });
    return typeof victim?.name === 'string' ? victim.name : '';
};
/**
 * Extract prose requirements from CML for validation
 * Returns formatted string describing mandatory prose elements
 */
const buildProseRequirements = (caseData, scenesForChapter) => {
    const cmlCase = caseData?.CASE ?? {};
    const proseReqs = cmlCase.prose_requirements ?? {};
    if (!proseReqs || Object.keys(proseReqs).length === 0) {
        return '';
    }
    let output = '\n\nCRITICAL PROSE REQUIREMENTS:\n\n';
    output += 'The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.\n\n';
    // Discriminating test scene
    if (proseReqs.discriminating_test_scene) {
        const dts = proseReqs.discriminating_test_scene;
        output += `**Discriminating Test Scene (Act ${dts.act_number}, Scene ${dts.scene_number}):**\n`;
        // tests_assumption_elements does not exist in cml_2_0 schema — removed (PS-3 fix)
        output += `Required elements: ${(dts.required_elements || []).join(', ')}\n`;
        if (dts.test_type)
            output += `Test type: ${dts.test_type}\n`;
        output += `Outcome: ${dts.outcome || 'N/A'}\n\n`;
    }
    // Suspect clearance scenes
    if (proseReqs.suspect_clearance_scenes && proseReqs.suspect_clearance_scenes.length > 0) {
        output += '**Suspect Clearance Scenes:**\n';
        proseReqs.suspect_clearance_scenes.forEach((clearance) => {
            output += `- ${clearance.suspect_name} (Act ${clearance.act_number}, Scene ${clearance.scene_number}): ${clearance.clearance_method}\n`;
            // CML schema field is supporting_clues, not required_clues (PS-4 fix)
            if (clearance.supporting_clues && clearance.supporting_clues.length > 0) {
                output += `  Clues: ${clearance.supporting_clues.join(', ')}\n`;
            }
        });
        output += '\n';
    }
    // Culprit revelation scene
    if (proseReqs.culprit_revelation_scene) {
        const crs = proseReqs.culprit_revelation_scene;
        output += `**Culprit Revelation Scene (Act ${crs.act_number}, Scene ${crs.scene_number}):**\n`;
        output += `Method: ${crs.revelation_method || 'detective explanation'}\n`;
        // culprit_revelation_scene has no required_clues in schema — use clue_to_scene_mapping (PS-4 fix)
        const crsClues = (proseReqs.clue_to_scene_mapping ?? []).filter((m) => m.act_number === crs.act_number && m.scene_number === crs.scene_number).map((m) => m.clue_id).filter(Boolean);
        if (crsClues.length > 0) {
            output += `Must reference clues: ${crsClues.join(', ')}\n`;
        }
        output += '\n';
    }
    // Identity rules (culprit reference restrictions)
    // The CML schema defines identity_rules as an ARRAY of per-character objects, not a scalar.
    // Each entry has: character_name, revealed_in_act (optional), before_reveal_reference, after_reveal_reference
    if (Array.isArray(proseReqs.identity_rules) && proseReqs.identity_rules.length > 0) {
        output += '**Identity Protection Rules:**\n';
        for (const rule of proseReqs.identity_rules) {
            output += `Character: ${rule.character_name}\n`;
            if (rule.revealed_in_act != null) {
                output += `- Before Act ${rule.revealed_in_act}: refer as "${rule.before_reveal_reference}"\n`;
                output += `- From Act ${rule.revealed_in_act} onward: refer as "${rule.after_reveal_reference}"\n`;
            }
            else {
                output += `- Before revelation: refer as "${rule.before_reveal_reference}"\n`;
                output += `- After revelation: refer as "${rule.after_reveal_reference}"\n`;
            }
        }
        output += '\n';
    }
    // Clue to scene mapping for this chapter
    if (proseReqs.clue_to_scene_mapping && scenesForChapter) {
        const relevantClues = proseReqs.clue_to_scene_mapping.filter((mapping) => {
            // Check if this clue should appear in current chapter batch
            return scenesForChapter.some((scene) => scene.act === mapping.act_number && scene.sceneNumber === mapping.scene_number);
        });
        if (relevantClues.length > 0) {
            output += '**Clue Placement for These Chapters:**\n';
            relevantClues.forEach((mapping) => {
                output += `- ${mapping.clue_id} must appear in Act ${mapping.act_number}, Scene ${mapping.scene_number} via ${mapping.delivery_method}\n`;
            });
            output += '\n';
        }
    }
    output += '**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate. Follow these specifications precisely.\n';
    return output;
};
/**
 * Strip phantom character names from scene data.
 *
 * 1. Characters array — remove any name not in the valid cast list.
 * 2. Summary / title text — replace any `Title Surname` pattern
 *    whose surname is not a valid cast member with an anonymous equivalent.
 *
 * This prevents phantom names baked into the narrative outline (e.g. from stale
 * LLM examples) from instructing the prose LLM to write about non-existent people.
 * If filtering the characters array would leave it empty, the original is preserved
 * so the scene still has context.
 */
function sanitizeScenesCharacters(scenes, validCastNames) {
    const validSet = new Set(validCastNames);
    const sanitizeText = (text) => anonymizeUnknownTitledNames(text, validCastNames);
    return scenes.map(scene => {
        if (!scene)
            return scene;
        const sanitized = Array.isArray(scene.characters)
            ? scene.characters.filter((name) => typeof name === 'string' && validSet.has(name))
            : scene.characters;
        // Sanitize all free-text fields that the prose LLM reads — not just summary/title.
        // The outline LLM commonly writes phantom names in purpose and dramaticElements too.
        const sanitizedDramaticElements = scene.dramaticElements
            ? Object.fromEntries(Object.entries(scene.dramaticElements).map(([k, v]) => [
                k,
                typeof v === 'string' ? sanitizeText(v) : v,
            ]))
            : scene.dramaticElements;
        return {
            ...scene,
            characters: sanitized?.length > 0 ? sanitized : scene.characters,
            summary: typeof scene.summary === 'string' ? sanitizeText(scene.summary) : scene.summary,
            title: typeof scene.title === 'string' ? sanitizeText(scene.title) : scene.title,
            purpose: typeof scene.purpose === 'string' ? sanitizeText(scene.purpose) : scene.purpose,
            dramaticElements: sanitizedDramaticElements,
        };
    });
}
/**
 * Sanitize generated chapter prose to remove invented titled names before validation.
 *
 * Converts unknown `Title Surname` mentions into anonymous role phrases
 * (e.g. "Detective Harlow" -> "the detective"). This acts as a hard safety
 * net for late-chapter retries where the model may still drift into
 * genre-attractor names.
 */
function sanitizeGeneratedChapter(chapter, validCastNames) {
    const sanitizeText = (text) => anonymizeUnknownTitledNames(text, validCastNames);
    return {
        ...chapter,
        title: typeof chapter.title === 'string' ? sanitizeText(chapter.title) : chapter.title,
        summary: typeof chapter.summary === 'string' ? sanitizeText(chapter.summary) : chapter.summary,
        paragraphs: Array.isArray(chapter.paragraphs)
            ? chapter.paragraphs.map((p) => (typeof p === 'string' ? sanitizeText(p) : p))
            : chapter.paragraphs,
    };
}
/**
 * Build per-chapter clue description block from agent5 ClueDistributionResult.
 * Maps each scene's clue IDs to full Clue objects so the prose agent knows exactly
 * what evidence to surface and how it should be observable to the reader.
 */
function buildClueDescriptionBlock(scenesForChapter, clueDistribution, requiredClueIds = []) {
    if (!Array.isArray(scenesForChapter) || scenesForChapter.length === 0)
        return '';
    const hasDistribution = Array.isArray(clueDistribution?.clues) && clueDistribution.clues.length > 0;
    if (!hasDistribution && requiredClueIds.length === 0)
        return '';
    const clueMap = new Map();
    const clueMapNormalized = new Map();
    if (hasDistribution) {
        for (const clue of clueDistribution.clues) {
            clueMap.set(clue.id, clue);
            const normalized = normalizeClueId(clue.id);
            if (normalized && !clueMapNormalized.has(normalized)) {
                clueMapNormalized.set(normalized, clue);
            }
        }
    }
    const requiredByNormalized = new Map();
    for (const id of requiredClueIds) {
        const normalized = normalizeClueId(String(id || ""));
        if (!normalized || requiredByNormalized.has(normalized))
            continue;
        requiredByNormalized.set(normalized, String(id));
    }
    const relevantClues = [];
    const seenClueIds = new Set();
    const addClueIfPresent = (id) => {
        if (!id)
            return;
        const normalized = normalizeClueId(id);
        const clue = clueMap.get(id) ?? clueMapNormalized.get(normalized);
        if (!clue || seenClueIds.has(clue.id))
            return;
        seenClueIds.add(clue.id);
        relevantClues.push(clue);
    };
    for (const scene of scenesForChapter) {
        const clueIds = Array.isArray(scene.cluesRevealed) ? scene.cluesRevealed : [];
        for (const id of clueIds) {
            addClueIfPresent(String(id));
        }
    }
    for (const requiredId of requiredClueIds) {
        addClueIfPresent(String(requiredId));
    }
    const unresolvedRequiredIds = Array.from(requiredByNormalized.entries())
        .filter(([normalized]) => !Array.from(seenClueIds).some((id) => normalizeClueId(id) === normalized))
        .map(([, original]) => original);
    if (relevantClues.length === 0 && unresolvedRequiredIds.length === 0)
        return '';
    const lines = [
        '\n\n⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:',
        'The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:',
    ];
    for (const clue of relevantClues) {
        lines.push(`\n• [${clue.id}] ${clue.description}`);
        lines.push(`  Category: ${clue.category} | Criticality: ${clue.criticality}${clue.supportsInferenceStep ? ` | Supports inference step ${clue.supportsInferenceStep}` : ''}`);
        lines.push(`  Points to: ${clue.pointsTo}`);
    }
    if (unresolvedRequiredIds.length > 0) {
        lines.push('\n• Required clue IDs without clue-distribution metadata (still mandatory):');
        unresolvedRequiredIds.forEach((id) => {
            lines.push(`  - ${id}: ensure explicit on-page observable evidence and immediate detective interpretation.`);
        });
    }
    if (requiredClueIds.length > 0 && isClueIdMarkerModeEnabled()) {
        lines.push('\nTemporary technical marker mode (enabled): include the exact marker token for each REQUIRED clue in the same sentence as its observable evidence.');
        lines.push('Marker format: [[CLUE_ID:<required_clue_id>]]');
        lines.push('These markers are required for validator reliability and will be removed before final prose output.');
        requiredClueIds.forEach((id) => {
            lines.push(`  - Required marker: [[CLUE_ID:${id}]]`);
        });
    }
    lines.push('\nFor each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.');
    return lines.join('\n');
}
/**
 * Format the NarrativeState into a read-only system prompt block.
 * Injected between the continuity context and the discriminating-test checklist.
 */
function buildNSDBlock(state) {
    if (!state)
        return '';
    const lines = ['\n\n═══ NARRATIVE STATE (read-only — do not contradict) ═══'];
    if (state.lockedFacts.length > 0) {
        lines.push('\nLOCKED FACTS — use verbatim whenever this evidence is described:');
        state.lockedFacts.forEach(f => lines.push(`  • ${f.description}: "${f.value}"`));
    }
    if (Object.keys(state.characterPronouns).length > 0) {
        lines.push('\nCHARACTER PRONOUNS — never deviate from these:');
        Object.entries(state.characterPronouns).forEach(([name, pronouns]) => lines.push(`  • ${name}: ${pronouns}`));
    }
    if (state.usedOpeningStyles.length > 0) {
        lines.push(`\nDO NOT OPEN THIS CHAPTER WITH: ${state.usedOpeningStyles.slice(-5).join(', ')} (already used in prior chapters)`);
    }
    if (state.usedSensoryPhrases.length > 0) {
        lines.push(`\nDO NOT REUSE THESE SENSORY PHRASES (already used): ${state.usedSensoryPhrases.slice(-10).join('; ')}`);
    }
    if (state.cluesRevealedToReader.length > 0) {
        lines.push(`\nCLUES ALREADY REVEALED TO READER: ${state.cluesRevealedToReader.join(', ')} — do not reveal these as new information.`);
    }
    lines.push('═══════════════════════════════════════════════════════');
    return lines.join('\n');
}
const buildCmlGroundTruthBlock = (caseData, scenesForChapter) => {
    const cmlCase = caseData?.CASE ?? {};
    if (!cmlCase || Object.keys(cmlCase).length === 0) {
        return '';
    }
    const cast = Array.isArray(cmlCase.cast) ? cmlCase.cast : [];
    const toPronouns = (genderValue) => {
        const gender = String(genderValue ?? '').toLowerCase();
        if (gender === 'male')
            return 'he/him/his';
        if (gender === 'female')
            return 'she/her/her';
        return 'they/them/their';
    };
    const castSnapshot = cast.map((character) => ({
        name: character?.name ?? 'Unknown',
        role: character?.role_archetype ?? character?.roleArchetype ?? 'character',
        pronouns: toPronouns(character?.gender),
    }));
    const inferencePath = Array.isArray(cmlCase.inference_path)
        ? cmlCase.inference_path.slice(0, 8).map((step) => ({
            step: step?.step,
            observation: step?.observation,
            correction: step?.correction,
            effect: step?.effect,
        }))
        : [];
    const chapterSceneKeys = Array.isArray(scenesForChapter)
        ? scenesForChapter
            .map((scene) => ({
            act: scene?.act,
            sceneNumber: scene?.sceneNumber,
        }))
            .filter((entry) => typeof entry.act === 'number' && typeof entry.sceneNumber === 'number')
        : [];
    const clueMapping = Array.isArray(cmlCase?.prose_requirements?.clue_to_scene_mapping)
        ? cmlCase.prose_requirements.clue_to_scene_mapping
        : [];
    const chapterSpecificClues = chapterSceneKeys.length
        ? clueMapping
            .filter((mapping) => chapterSceneKeys.some((entry) => entry.act === mapping?.act_number && entry.sceneNumber === mapping?.scene_number))
            .map((mapping) => ({
            clueId: mapping?.clue_id,
            act: mapping?.act_number,
            scene: mapping?.scene_number,
            method: mapping?.delivery_method,
        }))
        : [];
    const snapshot = {
        title: cmlCase?.meta?.title ?? 'Untitled Mystery',
        era: cmlCase?.meta?.era?.decade ?? 'Unknown era',
        setting: cmlCase?.meta?.setting?.location ?? 'Unknown setting',
        crime: cmlCase?.meta?.crime_class ?? {},
        falseAssumption: cmlCase?.false_assumption ?? {},
        discriminatingTest: cmlCase?.discriminating_test ?? {},
        constraintSpace: cmlCase?.constraint_space ?? {},
        cast: castSnapshot,
        inferencePath,
        chapterSpecificClues,
    };
    return [
        '\n\nCML CANONICAL GROUND TRUTH (AUTHORITATIVE):',
        'Treat the following as the source logic model for this story. Do not invent facts outside it.',
        'INTERPRETATION RULES:',
        '- CML is the canonical truth. If CML conflicts with style instincts, CML wins.',
        '- `surface_model` describes what appears true to characters/readers at that point; preserve this misdirection until the intended reveal.',
        '- `hidden_model` describes the actual mechanism; do not leak it early unless the outline scene explicitly requires that reveal.',
        '- `false_assumption` defines the reader-facing mistaken belief; reinforce it fairly with red herrings, then break it with evidence already shown.',
        '- `constraint_space` is non-negotiable feasibility logic (time/access/physical/social). Never write scenes that violate these constraints.',
        '- `inference_path` is the reasoning chain. Ensure clue presentation enables these steps without introducing new evidence.',
        '- `discriminating_test` must be executed as specified and only with previously surfaced evidence.',
        '- Cast names/pronouns are immutable. Never add named entities outside canonical cast.',
        'CML SNAPSHOT (for this batch):',
        JSON.stringify(snapshot, null, 2),
    ].join('\n');
};
export function formatProvisionalScoringFeedbackBlock(feedback) {
    const effectiveFeedback = Array.isArray(feedback) ? feedback.slice(-2) : [];
    if (effectiveFeedback.length === 0)
        return '';
    const lines = [];
    lines.push('\n\nPROVISIONAL CHAPTER SCORE FEEDBACK (APPLY TO NEXT CHAPTERS):');
    lines.push('Treat the following deficits as hard corrective targets for this batch.');
    for (const item of effectiveFeedback) {
        lines.push(`- From Chapter ${item.fromChapter}: score ${item.score}/100`);
        if (item.deficits.length > 0) {
            lines.push(`  Deficits: ${item.deficits.join('; ')}`);
        }
        if (item.directives.length > 0) {
            lines.push(`  Required corrections: ${item.directives.join(' | ')}`);
        }
    }
    lines.push('Do not repeat the same deficits in the next chapter.');
    return lines.join('\n');
}
const buildPromptContextBlocks = (sections) => {
    const orderedSections = [
        { key: 'cml_ground_truth', content: sections.cmlGroundTruthBlock, priority: 'critical' },
        { key: 'character_consistency', content: `\n\n${sections.characterConsistencyRules}`, priority: 'critical' },
        { key: 'character_personality', content: sections.characterPersonalityContext, priority: 'high' },
        { key: 'physical_plausibility', content: `\n\n${sections.physicalPlausibilityRules}`, priority: 'high' },
        { key: 'era_authenticity', content: sections.eraAuthenticityRules, priority: 'high' },
        { key: 'location_profiles', content: sections.locationProfilesContext, priority: 'medium' },
        { key: 'temporal_context', content: sections.temporalContextBlock, priority: 'medium' },
        { key: 'locked_facts', content: sections.lockedFactsBlock, priority: 'critical' },
        { key: 'clue_descriptions', content: sections.clueDescriptionBlock, priority: 'critical' },
        { key: 'narrative_state', content: sections.nsdBlock, priority: 'critical' },
        { key: 'continuity_context', content: sections.continuityBlock, priority: 'medium' },
        { key: 'discriminating_test', content: sections.discriminatingTestBlock, priority: 'critical' },
        { key: 'humour_guide', content: sections.humourGuideBlock, priority: 'optional' },
        { key: 'craft_guide', content: sections.craftGuideBlock, priority: 'optional' },
        { key: 'scene_grounding', content: sections.sceneGroundingChecklist, priority: 'critical' },
        { key: 'provisional_scoring_feedback', content: sections.provisionalScoringFeedbackBlock, priority: 'critical' },
    ];
    return orderedSections
        .filter((section) => section.content.trim().length > 0)
        .map((section) => ({ key: section.key, content: section.content, priority: section.priority }));
};
const estimateTokenCount = (value) => {
    if (!value)
        return 0;
    return Math.ceil(value.length / 4);
};
const truncateToTokenBudget = (value, maxTokens) => {
    if (!value || maxTokens <= 0)
        return '';
    const maxChars = maxTokens * 4;
    if (value.length <= maxChars)
        return value;
    const truncated = value.slice(0, Math.max(0, maxChars - 24)).trimEnd();
    return `${truncated}\n[truncated for prompt budget]`;
};
const applyPromptBudgeting = (baseSystem, developer, user, blocks, budgetTokens) => {
    const fixedTokens = estimateTokenCount(baseSystem) + estimateTokenCount(developer) + estimateTokenCount(user);
    const availableForBlocks = Math.max(0, budgetTokens - fixedTokens);
    const perBlockTokenCap = {
        cml_ground_truth: 700,
        character_personality: 900,
        location_profiles: 1000,
        temporal_context: 850,
        continuity_context: 500,
        humour_guide: 850,
        craft_guide: 850,
    };
    const truncatedBlocks = [];
    let workingBlocks = blocks
        .filter((block) => block.content.trim().length > 0)
        .map((block) => {
        const maxTokens = perBlockTokenCap[block.key];
        if (!maxTokens)
            return block;
        const originalTokens = estimateTokenCount(block.content);
        if (originalTokens <= maxTokens)
            return block;
        truncatedBlocks.push(block.key);
        return {
            ...block,
            content: truncateToTokenBudget(block.content, maxTokens),
        };
    });
    const computeBlockTokens = () => workingBlocks.reduce((sum, block) => sum + estimateTokenCount(block.content), 0);
    let blockTokens = computeBlockTokens();
    const droppedBlocks = [];
    // Deterministic drop order: optional -> medium -> high (critical never dropped).
    const dropOrder = ["optional", "medium", "high"];
    for (const priority of dropOrder) {
        if (blockTokens <= availableForBlocks)
            break;
        const candidates = workingBlocks.filter((block) => block.priority === priority);
        for (const block of candidates) {
            if (blockTokens <= availableForBlocks)
                break;
            droppedBlocks.push(block.key);
            workingBlocks = workingBlocks.filter((entry) => entry.key !== block.key);
            blockTokens = computeBlockTokens();
        }
    }
    const composedSystem = baseSystem +
        workingBlocks.map((block) => block.content).join('') +
        `\n\nPROMPT BUDGET SUMMARY: budget=${budgetTokens} tokens; fixed=${fixedTokens}; context=${blockTokens}; dropped=[${droppedBlocks.join(', ') || 'none'}]; truncated=[${truncatedBlocks.join(', ') || 'none'}]` +
        `\n\n${developer}`;
    return { composedSystem, droppedBlocks, truncatedBlocks };
};
/**
 * Strip raw prose paragraph arrays from location profiles before injecting into context.
 * Prevents the LLM from transcribing pre-written prose blocks verbatim (context leakage).
 * Keeps all structural data: names, types, purpose, sensoryDetails, atmosphere.
 */
function stripLocationParagraphs(locationProfiles) {
    if (!locationProfiles || typeof locationProfiles !== 'object')
        return locationProfiles;
    const strip = (obj) => {
        if (Array.isArray(obj))
            return obj.map(strip);
        if (obj && typeof obj === 'object') {
            const out = {};
            for (const [k, v] of Object.entries(obj)) {
                if (k === 'paragraphs')
                    continue; // drop prose blocks
                out[k] = strip(v);
            }
            return out;
        }
        return obj;
    };
    return strip(locationProfiles);
}
const buildProsePrompt = (inputs, scenesOverride, chapterStart = 1, chapterSummaries = []) => {
    const { outline, targetLength = "medium", narrativeStyle = "classic" } = inputs;
    const outlineActs = Array.isArray(outline.acts) ? outline.acts : [];
    const scenes = Array.isArray(scenesOverride)
        ? scenesOverride
        : outlineActs.flatMap((act) => (Array.isArray(act.scenes) ? act.scenes : []));
    const cmlCase = inputs.caseData?.CASE ?? {};
    const era = cmlCase.meta?.era?.decade ?? "Unknown era";
    const cast = inputs.cast.characters || [];
    // Derive victim name for guardrail injection
    const proseVictimName = resolveVictimName(inputs.cast);
    const isChapterOneBatch = chapterStart <= 1 && chapterStart + scenes.length - 1 >= 1;
    const victimIdentityRule = proseVictimName
        ? `- VICTIM IDENTITY: The murder victim is ${proseVictimName}. Introduce them by full name in the discovery chapter and refer to them by name throughout. Never write "an unknown victim", "the body of a stranger", or "the victim" without first having established the victim's name. The victim must feel like a real person whose death matters.`
        : '';
    const system = `CONTEXT: You are writing chapters of a Golden Age whodunnit mystery novel in the literary tradition of Agatha Christie, Arthur Conan Doyle, and Dorothy L. Sayers. This is a creative fiction writing task. All references to crime, death, poison, weapons, alibis, and investigation are part of the fictional narrative and are standard elements of the mystery genre. No real people or events are depicted.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: ${cast.map((c) => c.name).join(', ')}.
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: ${cast.map((c) => c.name).join(', ')}?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.

Rules:
- Do not introduce new facts beyond the CML and outline.
- Preserve all clues, alibis, and the core mystery logic.
- Maintain strict setting fidelity to the specified location and era.
- Write immersive, sensory-rich prose that transports readers to the setting
- Include scene-setting passages that establish atmosphere, time, and place
- Use varied sentence structure and sophisticated vocabulary
- Show character emotions through actions and dialogue, not just telling
- Create distinct character voices and personalities based on their profiles
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. If a sensory phrase (e.g., "air thick with tension", "smell of polished wood") has appeared in any prior chapter, rephrase it entirely. No atmospheric sentence should appear verbatim or near-verbatim in more than one chapter.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation". Rewrite any scaffold-like sentence into chapter-specific prose tied to character action.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
${inputs.moralAmbiguityNote ? `- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "${inputs.moralAmbiguityNote}" — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.` : '- MORAL COMPLEXITY: When writing the denouement, include at least one detail that complicates the moral verdict — a motive the reader can understand, a consequence that feels unjust, or a relationship that can never recover.'}
${victimIdentityRule}`;
    const characterConsistencyRules = `\nCRITICAL CHARACTER CONSISTENCY RULES:\n\n1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.\n   COMPLETE CAST (no other named characters exist): ${cast.map((c) => c.name).join(', ')}\n   - "Mr. Jennings entered the room" \u2192 ILLEGAL. Jennings is not in the cast.\n   - "Constable Reed took notes" \u2192 ILLEGAL. Reed is not in the cast.\n   - "A constable took notes" \u2192 LEGAL (no name given).\n\n2. Gender pronouns must match character definition:\n${cast.map((c) => {
        const gender = c.gender?.toLowerCase();
        const pronouns = gender === 'male' ? 'he/him/his' : gender === 'female' ? 'she/her/her' : 'they/them/their';
        return `   - ${c.name}: ${pronouns}`;
    }).join('\n')}\n   - Never switch pronouns mid-story\n\n3. Character roles are fixed:\n${cast.map((c) => `   - ${c.name}: ${c.role || 'character'}`).join('\n')}\n   - Never place characters in locations inconsistent with their role`;
    // Build character personality/voice/humour guidance from character profiles
    let characterPersonalityContext = '';
    if (inputs.characterProfiles && Array.isArray(inputs.characterProfiles.profiles)) {
        const HUMOUR_STYLE_DESCRIPTIONS = {
            understatement: 'Increases seriousness by pretending not to. Deadpan delivery of extraordinary facts.',
            dry_wit: 'Sharp observations about human behaviour. Concise, often one-liners.',
            polite_savagery: 'Maintains perfect civility while delivering devastating verbal incisions.',
            self_deprecating: 'Turns wit inward. Disarming, often hides intelligence or pain.',
            observational: 'Notices absurdity in situations and people. Comments wryly on what others miss.',
            deadpan: 'Delivers the remarkable as though it were mundane. Flat affect, maximum impact.',
            sardonic: 'Darker edge. Mocking tone that reveals cynicism or world-weariness.',
            blunt: 'Says what others are thinking. Lacks social filter. Comic through honesty.',
            none: 'This character is not humorous. They are earnest, tense, or grief-stricken.',
        };
        const personalities = inputs.characterProfiles.profiles.map((profile) => {
            const name = profile.name || 'Unknown';
            const persona = profile.publicPersona || '';
            const secret = profile.privateSecret || '';
            const stakes = profile.stakes || '';
            const internalConflict = profile.internalConflict || '';
            const personalStake = profile.personalStakeInCase || '';
            const humourStyle = profile.humourStyle || 'none';
            const humourLevel = typeof profile.humourLevel === 'number' ? profile.humourLevel : 0;
            const speechMannerisms = profile.speechMannerisms || '';
            const styleDesc = HUMOUR_STYLE_DESCRIPTIONS[humourStyle] || '';
            let humourGuidance = '';
            if (humourStyle !== 'none' && humourLevel > 0) {
                const frequency = humourLevel >= 0.7 ? 'frequently' : humourLevel >= 0.4 ? 'occasionally' : 'rarely';
                humourGuidance = '\n  Humour: ' + humourStyle.replace(/_/g, ' ') + ' (level ' + humourLevel.toFixed(1) + ' - ' + frequency + ' witty). ' + styleDesc;
            }
            else {
                humourGuidance = '\n  Humour: None - this character plays it straight. Their seriousness provides contrast for wittier characters.';
            }
            const voiceLine = speechMannerisms ? '\n  Voice & Mannerisms: ' + speechMannerisms : '';
            const conflictLine = internalConflict ? '\n  Internal Conflict: ' + internalConflict : '';
            const stakeLine = personalStake ? '\n  Personal Stake in Case: ' + personalStake : '';
            return name + ':\n  Public: ' + persona + '\n  Hidden: ' + secret + '\n  Stakes: ' + stakes + humourGuidance + voiceLine + conflictLine + stakeLine;
        }).join('\n\n');
        characterPersonalityContext = '\n\nCHARACTER PERSONALITIES, VOICES & HUMOUR:\n\nEach character has a distinct personality, voice, humour style, and hidden depth. Use these to create authentic, differentiated characters whose wit (or lack thereof) reveals who they are:\n\n' + personalities + '\n\nWRITING GUIDANCE:\n1. Dialogue: Each character should sound different. Humour style shapes HOW they speak, humourLevel shapes HOW OFTEN.\n2. Internal thoughts: Reference their hidden secrets and stakes to add subtext.\n3. Body language: Show personality through gestures, posture, habits.\n4. Reactions: Characters react differently to same events based on personality.\n5. Speech patterns: Use speechMannerisms for verbal tics, rhythm, formality level.\n6. Personal stake: Characters with personalStakeInCase defined should reference it at least twice across the story through internal monologue, hesitation, or action — especially the detective.\n7. HUMOUR CONTRAST: Characters with high humourLevel (0.7+) should deliver wit frequently. Characters with low/zero should play it straight. The CONTRAST between witty and earnest characters creates the best comedy.\n8. HUMOUR AS CHARACTER: A character\'s humour style reveals their psychology - self_deprecating masks insecurity, polite_savagery masks aggression, deadpan masks emotion.\n9. NEVER force humour on a character with humourLevel 0 or style none.';
    }
    const physicalPlausibilityRules = `\nPHYSICAL PLAUSIBILITY REQUIREMENTS:\n\nAll physical evidence must obey real-world physics:\n\n1. VIABLE Evidence by Location:\n   Interior: fingerprints, torn fabric, overturned furniture, blood spatter, documents\n   Exterior (calm): secured items, structural damage, witness observations\n   Exterior (storm): NO trace evidence survives - use only structural damage or interior evidence\n\n2. IMPLAUSIBLE Evidence (DO NOT USE):\n   ❌ Footprints on wooden deck (treated wood doesn't retain prints)\n   ❌ Footprints in rain/storm (washed away immediately)\n   ❌ Metal embedded in hardwood (requires bullet velocity, not human force)\n   ❌ Light objects in storm (blown away)\n\n3. For struggle evidence use:\n   ✓ Overturned furniture, torn clothing, scattered items, defensive wounds\n   ❌ Objects embedded in hard surfaces, shattered steel/iron`;
    const eraAuthenticityRules = era !== "Unknown era" ? `\nERA AUTHENTICITY (${era}):\n\n1. FORBIDDEN terms (did not exist):\n   ${era === '1950s' ? '❌ cell phone, internet, email, computer, GPS, digital camera, text message, app, online' : '❌ Modern technology'}\n\n2. REQUIRED period markers (include 2+ per scene):\n   ✓ Formal address: Mr./Mrs./Miss/Dr./Sir/Lady\n   ✓ Period technology: ${era === '1950s' ? 'telephone, telegram, radio, typewriter' : 'period-appropriate items'}\n   ✓ Fashion: ${era === '1950s' ? 'gloves, hats, formal suits, stockings' : 'period clothing'}\n\n3. Use period-authentic language and social norms` : '';
    // Build location profiles context (avoid nested template literals)
    // Strip raw prose paragraphs first to prevent context leakage into generated prose.
    let locationProfilesContext = '';
    if (inputs.locationProfiles) {
        const loc = stripLocationParagraphs(inputs.locationProfiles);
        const primaryName = loc.primary?.name || 'N/A';
        const primaryPlace = loc.primary?.place || '';
        const primaryCountry = loc.primary?.country || '';
        const geographicContext = primaryPlace && primaryCountry
            ? primaryPlace + ', ' + primaryCountry
            : primaryPlace || primaryCountry || '';
        const primarySummary = loc.primary?.summary || '';
        const keyLocs = (loc.keyLocations || []).map((l) => '- ' + l.name + ' (' + l.type + '): ' + l.purpose).join('\\n');
        const mood = loc.atmosphere?.mood || 'N/A';
        const weather = loc.atmosphere?.weather || 'N/A';
        // Build comprehensive sensory palette
        const sensoryExamples = (loc.keyLocations || []).slice(0, 3).map((l) => {
            const senses = l.sensoryDetails || {};
            const sights = (senses.sights || []).slice(0, 3).join(', ');
            const sounds = (senses.sounds || []).slice(0, 3).join(', ');
            const smells = (senses.smells || []).slice(0, 3).join(', ');
            const tactile = (senses.tactile || []).slice(0, 2).join(', ');
            return l.name + ' (' + l.type + '):\\n  - Visual: ' + sights + '\\n  - Sounds: ' + sounds + '\\n  - Scents: ' + smells + (tactile ? '\\n  - Touch: ' + tactile : '');
        }).join('\\n\\n');
        const locationLine = geographicContext
            ? 'Primary Location: ' + primaryName + ' (' + geographicContext + ')\\n' + primarySummary
            : 'Primary Location: ' + primaryName + '\\n' + primarySummary;
        // Add specific sensory usage examples
        const sensoryGuidance = '\n\n⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not copy or paraphrase any template text.\n\nSENSORY WRITING TECHNIQUES:\n- Opening paragraphs: Lead with 2-3 sensory details to ground the scene\n- Movement between locations: Note sensory changes (quiet study → noisy dining room)\n- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)\n- Period authenticity: Use period-specific sensory details from location/temporal profiles\n- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature';
        locationProfilesContext = '\\n\\nLOCATION PROFILES:\\n\\nYou have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.\\n\\n' + locationLine + '\\n\\nKey Locations Available:\\n' + keyLocs + '\\n\\nAtmosphere: ' + mood + '\\nWeather: ' + weather + '\\n\\nUSAGE GUIDELINES:\\n1. First mention of location: Use full sensory description from profiles\\n2. Geographic grounding: Reference the specific place (' + (geographicContext || 'setting') + ') naturally in dialogue or narrative\\n3. Action scenes: Integrate physical layout details (access, sightlines, constraints)\\n4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette\\n5. Era details: Weave in period markers naturally\\n6. Consistency: Keep all location descriptions aligned with profiles\\n7. Each chapter opening must anchor to a named location from this list\\n8. Include at least 2 sensory cues + 1 atmosphere marker in each chapter opening\\n9. Do NOT use generic repeated manor/storm filler without profile-specific details\\n\\nSENSORY PALETTE (use 2-3 senses per scene):\\n' + sensoryExamples + sensoryGuidance;
        // Append chapter-specific sensory palette hints derived from sensoryVariants objects
        if (Array.isArray(scenesOverride) && scenesOverride.length > 0 && Array.isArray(loc.keyLocations)) {
            const paletteHints = [];
            scenesOverride.forEach((scene, idx) => {
                const sceneSettingObj = scene.setting;
                const sceneSetting = (typeof sceneSettingObj?.location === 'string' ? sceneSettingObj.location : '').toLowerCase();
                const sceneTimeOfDay = (typeof sceneSettingObj?.timeOfDay === 'string' ? sceneSettingObj.timeOfDay : '').toLowerCase();
                const sceneWeather = (typeof sceneSettingObj?.atmosphere === 'string' ? sceneSettingObj.atmosphere : '').toLowerCase();
                const chapterNum = chapterStart + idx;
                const matchedLocation = loc.keyLocations.find((kl) => (kl.id && sceneSetting.includes(kl.id.toLowerCase())) ||
                    (kl.name && sceneSetting.includes(kl.name.toLowerCase())));
                if (matchedLocation?.sensoryVariants?.length > 0) {
                    // Try to match by timeOfDay + weather; fall back to cycling by chapter number
                    const variants = matchedLocation.sensoryVariants;
                    let variant = (sceneTimeOfDay || sceneWeather)
                        ? (variants.find((v) => (!sceneTimeOfDay || v.timeOfDay?.toLowerCase().includes(sceneTimeOfDay) || sceneTimeOfDay.includes(v.timeOfDay?.toLowerCase())) &&
                            (!sceneWeather || v.weather?.toLowerCase().includes(sceneWeather) || sceneWeather.includes(v.weather?.toLowerCase()))) ?? variants[chapterNum % variants.length])
                        : variants[chapterNum % variants.length];
                    if (variant) {
                        const sights = (variant.sights || []).slice(0, 2).join(', ');
                        const sounds = (variant.sounds || []).slice(0, 2).join(', ');
                        const smells = (variant.smells || []).slice(0, 2).join(', ');
                        paletteHints.push(`  Chapter ${chapterNum} (${matchedLocation.name}, ${variant.timeOfDay} / ${variant.weather} — ${variant.mood}):\n` +
                            `    Sights: ${sights}\n    Sounds: ${sounds}\n    Smells: ${smells}`);
                    }
                }
            });
            if (paletteHints.length > 0) {
                locationProfilesContext += '\\n\\nCHAPTER SENSORY PALETTE HINTS (evoke these qualities without copying verbatim):\\n' + paletteHints.join('\\n');
            }
        }
    }
    // Build temporal context (specific date, season, fashion, current affairs)
    let temporalContextBlock = '';
    if (inputs.temporalContext) {
        const dateInfo = inputs.temporalContext.specificDate;
        const dateStr = dateInfo.month + ' ' + dateInfo.year;
        const season = inputs.temporalContext.seasonal?.season || 'N/A';
        const seasonLock = deriveTemporalSeasonLock(inputs.temporalContext);
        const lockedSeason = seasonLock?.season || season;
        const forbiddenSeasons = ['spring', 'summer', 'autumn', 'winter']
            .filter((s) => s !== lockedSeason)
            .join(', ');
        const seasonWeather = (inputs.temporalContext.seasonal?.weather || []).slice(0, 3).join(', ');
        const mensFormeal = (inputs.temporalContext.fashion?.mensWear?.formal || []).slice(0, 4).join(', ');
        const mensCasual = (inputs.temporalContext.fashion?.mensWear?.casual || []).slice(0, 3).join(', ');
        const mensAcc = (inputs.temporalContext.fashion?.mensWear?.accessories || []).slice(0, 3).join(', ');
        const womensFormeal = (inputs.temporalContext.fashion?.womensWear?.formal || []).slice(0, 4).join(', ');
        const womensCasual = (inputs.temporalContext.fashion?.womensWear?.casual || []).slice(0, 3).join(', ');
        const womensAcc = (inputs.temporalContext.fashion?.womensWear?.accessories || []).slice(0, 3).join(', ');
        const music = (inputs.temporalContext.cultural?.entertainment?.popularMusic || []).slice(0, 3).join(', ');
        const films = (inputs.temporalContext.cultural?.entertainment?.films || []).slice(0, 2).join(', ');
        const prices = (inputs.temporalContext.cultural?.dailyLife?.typicalPrices || []).slice(0, 4).join(', ');
        const majorEvents = (inputs.temporalContext.currentAffairs?.majorEvents || []).slice(0, 2).join('; ');
        const atmosphericDetails = (inputs.temporalContext.atmosphericDetails || []).slice(0, 4).join(' ');
        const fashionGuidance = '\\n\\nFASHION INTEGRATION TECHNIQUES:\\n- First appearance: Describe outfit to establish class/personality\\n- Accessories: Gloves, hats, pocket watches, jewelry reveal status\\n- Time-specific: Different outfits for different times of day\\n- Character traits: Fastidious dresser vs rumpled appearance\\n- Action integration: "She tugged at her glove" or "He adjusted his tie"\\n- Weather appropriate: Overcoats in winter, light linen in summer';
        const culturalGuidance = '\\n\\nCULTURAL TOUCHSTONE INTEGRATION:\\n- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"\\n- Background details: Radio playing, newspaper headlines, theater posters\\n- Social commentary: Characters discuss current events naturally\\n- Class indicators: Aristocrats discuss opera, servants discuss music halls\\n- Authentic references: Use actual songs, films, events from the specific date';
        temporalContextBlock = '\\n\\nTEMPORAL CONTEXT:\\n\\nThis story takes place in ' + dateStr + ' during ' + season + '.\\n\\nSeasonal Atmosphere:\\n- Weather patterns: ' + seasonWeather + '\\n- Season: ' + season + '\\n\\nPeriod Fashion (describe naturally):\\n- Men formal: ' + mensFormeal + '\\n- Men casual: ' + mensCasual + '\\n- Men accessories: ' + mensAcc + '\\n- Women formal: ' + womensFormeal + '\\n- Women casual: ' + womensCasual + '\\n- Women accessories: ' + womensAcc + '\\n\\nCultural Context (reference naturally):\\n- Music/entertainment: ' + music + (films ? '; Films: ' + films : '') + '\\n- Typical prices: ' + prices + (majorEvents ? '\\n- Current events: ' + majorEvents : '') + '\\n\\nAtmospheric Details:\\n' + atmosphericDetails + fashionGuidance + culturalGuidance + '\\n\\nUSAGE REQUIREMENTS:\\n1. Date references: Mention month/season at least once early in story\\n2. Fashion descriptions: Every character gets fashion description on first appearance\\n3. Cultural touchstones: Reference music/entertainment 2-3 times across story\\n4. Prices/daily life: Use when relevant (meals, tickets, wages)\\n5. Seasonal consistency: Weather and atmosphere must match ' + dateInfo.month + ' and ' + season + ' throughout\\n6. Historical accuracy: NO anachronisms for ' + dateStr + '\\n7. Month-season lock: If a chapter mentions ' + dateInfo.month + ', do not use conflicting season labels in that chapter.\\n8. Season lock (hard): This timeline is anchored to ' + dateInfo.month + ' (' + lockedSeason + '). Avoid incompatible seasonal labels (' + forbiddenSeasons + ') in the same chapter.';
    }
    // Build continuity context from chapter 2 onwards (character names, setting terms from earlier chapters)
    let continuityBlock = '';
    if (chapterSummaries.length > 0) {
        continuityBlock = buildContinuityContext(chapterSummaries, chapterStart);
    }
    // Build discriminating test checklist for late chapters.
    // The threshold is relative: we show the checklist once we're past 70% of the story.
    // totalScenes comes from the outline — same source of truth as agent7-narrative.
    let discriminatingTestBlock = '';
    const chapterEnd = chapterStart + scenes.length - 1;
    const totalScenes = outline?.totalScenes ?? scenes.length;
    const lateChapterThreshold = Math.ceil(totalScenes * 0.70);
    if (chapterEnd >= lateChapterThreshold) {
        const chapterRange = `${chapterStart}-${chapterEnd}`;
        discriminatingTestBlock = buildDiscriminatingTestChecklist(inputs.caseData, chapterRange, inputs.outline, totalScenes);
    }
    // Build locked facts block — ground truth physical evidence values the prose must never contradict
    let lockedFactsBlock = '';
    if (inputs.lockedFacts && inputs.lockedFacts.length > 0) {
        const factLines = inputs.lockedFacts
            .map(f => `  - ${f.description}: "${f.value}"`)
            .join('\n');
        lockedFactsBlock = `\n\n⛔ LOCKED FACTS — DO NOT CONTRADICT:\nThe following physical evidence values are ground truth established by the mystery's logic. Use them verbatim whenever the relevant evidence is described. NEVER introduce a different number, time, distance, or quantity for these facts across any chapter:\n${factLines}`;
    }
    // Build NSD block (narrative state document) — style register and fact history
    const nsdBlock = buildNSDBlock(inputs.narrativeState);
    // Build clue description block from the same required clue contract used by pre-commit validation.
    // This keeps prompt obligations and validator obligations aligned.
    const requiredClueIdsForPrompt = Array.from(new Set(scenes
        .flatMap((scene) => getRequiredClueIdsForScene(cmlCase, scene))
        .map((id) => String(id || ""))
        .filter(Boolean)));
    const clueDescriptionBlock = buildClueDescriptionBlock(scenes, inputs.clueDistribution, requiredClueIdsForPrompt);
    // Build humour guide block from writing guides
    let humourGuideBlock = '';
    if (inputs.writingGuides?.humour) {
        humourGuideBlock = '\n\nHUMOUR & WIT GUIDELINES (Golden Age Mystery Style):\n\n' +
            'Humour is STRUCTURAL, not decorative. Every humorous moment must serve at least one purpose: hide information, reveal character, control pacing, provide tonal contrast, expose social truth, or sharpen the final reveal.\n\n' +
            'TONE: Balance classical structure with modern-clean, restrained, irony-aware voice. Aim for crisp prose, controlled formality, mildly sharpened dryness. Think: polite language, ruthless implication.\n\n' +
            'APPROVED HUMOUR STYLES (use all of these naturally throughout):\n' +
            '1. UNDERSTATEMENT (primary tool) - Increase seriousness by pretending not to. Example: "The evening deteriorated somewhat after the stabbing."\n' +
            '2. DRY OBSERVATIONAL WIT - Draw humour from human behaviour. Example: "Everyone preferred harmony. This required extensive dishonesty."\n' +
            '3. POLITE SAVAGERY - Maintain civility while delivering verbal incision. Example: "He was devoted to principle," said the solicitor. "His own," said the detective.\n' +
            '4. CHARACTER-DRIVEN CONTRAST - Humour from personality friction (literal vs dramatic, pragmatic vs romantic, rigid vs modern). Never farce, always friction.\n' +
            '5. PRECISION CRUELTY (sparingly) - Short, exact, devastating. Example: "He had the moral backbone of warm custard." Use rarely for maximum impact.\n\n' +
            'ADVANCED TECHNIQUE - PUZZLE CAMOUFLAGE: Readers lower their analytical guard when amused. Hide key habits in jokes, plant timeline clues in sarcasm, mask technical details with mild mockery. The joke makes the fact feel harmless.\n\n' +
            'SOCIAL X-RAY: Use humour to expose class blindness, moral hypocrisy, gender expectations, inheritance absurdity, respectability theatre. Let irony reveal, not preach.\n\n' +
            'DETECTIVE VOICE: The detective should rarely laugh, occasionally observe, almost never banter. Deliver one devastatingly mild remark per major scene. Example: "I do not accuse you. I merely observe that facts appear less cooperative in your presence."\n\n' +
            'RHYTHM: Tension -> Dry remark -> Silence -> Investigation resumes. Never stack jokes. Never let humour dominate a scene. Small, controlled, regular infusions.\n\n' +
            'BALANCE: For every 3 pages of investigation, insert 1 understated observation. If readers would laugh loudly, it is too much. Aim for the quiet exhale through the nose.\n\n' +
            'RUNNING GAGS AS STRUCTURE: Introduce a recurring minor joke casually, repeat it, then make it central to the solution. Reader reaction: Amusement -> Recognition -> Admiration.\n\n' +
            'EMOTIONAL HUMOUR: Humour can mask vulnerability. Example: "He disliked arguments. They implied things might change." Modern emotional subtlety inside classical tone.\n\n' +
            'FORBIDDEN: Humour at the moment of corpse discovery, in physical description of the dead, during genuine grief, in the core logical explanation. No broad parody, no farce, no anachronistic sarcasm, no characters existing only for comic relief, no humour that weakens intellectual tension.\n\n' +
            'GUIDING PRINCIPLE: Do not try to be funny. Try to be exact. Exactness produces dryness. Dryness produces intelligence. Intelligence produces quiet amusement. Quiet amusement is the perfect companion to murder.';
    }
    // Build whodunnit craft guide block from writing guides
    let craftGuideBlock = '';
    if (inputs.writingGuides?.craft) {
        craftGuideBlock = '\n\nWHODUNNIT CRAFT GUIDELINES (Emotional Depth & Soul):\n\n' +
            'These principles ensure the mystery has emotional resonance, not just logical mechanics.\n\n' +
            '1. THE MURDER MUST MEAN SOMETHING: The death should destabilize emotional ecosystems. Show who loved the victim, who depended on them, who is secretly relieved. Use telling details ("Her coffee was still warm") rather than clinical statements ("The body was found at 7:30").\n\n' +
            '2. GIVE EVERY SUSPECT A WOUND: People kill because of shame, fear, love, desperation, pride, protection, or revenge. Beyond motive, give each suspect a private longing, a contradiction, a vulnerability unrelated to the crime. Readers should think: "I do not want it to be them."\n\n' +
            '3. THE DETECTIVE NEEDS A PERSONAL STAKE: The external mystery should echo an internal one. Perhaps they see themselves in the victim, the case mirrors a past failure, or they are avoiding something in their own life.\n\n' +
            '4. ADD MOMENTS THAT DO NOT ADVANCE THE PLOT: Include micro-moments that create texture: a suspect making tea too slowly, a trembling hand lighting a cigarette, someone staring too long at a family photo. These pauses make the story feel alive.\n\n' +
            '5. LET EMOTION LEAK INTO DIALOGUE: Avoid clinical information exchange. Write subtext-rich dialogue where characters do not always say what they mean. Example: "You think I would lie about that?" "I think people lie when they are scared." "I am not scared." "Your hands say otherwise."\n\n' +
            '6. RAISE MORAL COMPLEXITY: The most soulful mysteries make readers uncomfortable. What if the victim was not entirely good? What if the killer had a reason that almost makes sense? If the reader finishes thinking "I do not know how I feel about that," you have succeeded.\n\n' +
            '7. SENSORY ATMOSPHERE AS SOUL: Use recurring sensory anchors (the smell of lilies from the funeral, rain tapping like nervous fingers) to build mood. Atmosphere is not decoration; it is the story breathing.\n\n' +
            '8. LET SOMEONE BREAK: At least once, someone should crack: cry unexpectedly, laugh hysterically, confess something unrelated, admit they are tired. Emotion destabilizes the procedural rhythm and makes the story human.\n\n' +
            '9. MAKE THE REVEAL HURT: The best reveals do not just surprise; they wound. The reveal should recontextualize earlier tenderness, expose a betrayal, or force the detective to confront something personal. If the reveal only satisfies logic, it feels clinical. If it rearranges relationships, it feels human.';
    }
    const qualityGuardrails = Array.isArray(inputs.qualityGuardrails) ? inputs.qualityGuardrails : [];
    // CRITICAL: Fair Play Clue Sequencing Guardrails
    // Prevent detective from discovering and using clues in the same chapter
    const fairPlayGuardrails = [
        "FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.",
        "FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.",
        "FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.",
        "FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters."
    ];
    const allGuardrails = [...fairPlayGuardrails, ...qualityGuardrails];
    const qualityGuardrailBlock = allGuardrails.length > 0
        ? `\n\nQUALITY GUARDRAILS (MUST SATISFY):\n${allGuardrails.map((rule, idx) => `${idx + 1}. ${rule}`).join("\n")}`
        : "";
    // Build prose requirements block for this chapter batch
    const proseRequirementsBlock = buildProseRequirements(inputs.caseData, scenes);
    const cmlGroundTruthBlock = buildCmlGroundTruthBlock(inputs.caseData, scenes);
    const sceneGroundingChecklist = buildSceneGroundingChecklist(scenes, inputs.locationProfiles, chapterStart);
    const provisionalScoringFeedbackBlock = formatProvisionalScoringFeedbackBlock(inputs.provisionalScoringFeedback);
    const chapterWordGuidance = {
        short: `4-6 substantial paragraphs — HARD FLOOR ${getChapterWordTargets("short").hardFloorWords} words, PREFERRED ${getChapterWordTargets("short").preferredWords} words`,
        medium: `5-7 substantial paragraphs — HARD FLOOR ${getChapterWordTargets("medium").hardFloorWords} words, PREFERRED ${getChapterWordTargets("medium").preferredWords} words`,
        long: `8-12 substantial paragraphs — HARD FLOOR ${getChapterWordTargets("long").hardFloorWords} words, PREFERRED ${getChapterWordTargets("long").preferredWords} words`,
    };
    const chapterGuidance = chapterWordGuidance[targetLength] ?? chapterWordGuidance.medium;
    const chapterWordTargets = getChapterWordTargets(targetLength);
    const overshootBuffer = getGenerationParams().agent9_prose.word_policy.prompt_overshoot_buffer_words;
    const statedTarget = chapterWordTargets.preferredWords + overshootBuffer;
    const rigidWordCountBlock = [
        "WORD COUNT IS RIGID FOR THIS CHAPTER.",
        `- Target for this ${targetLength} chapter: ${statedTarget} words.`,
        `- Absolute minimum hard floor: ${chapterWordTargets.hardFloorWords} words.`,
        `- If your draft is below ${statedTarget}, expand with concrete actions, dialogue, and evidence-linked beats until it reaches at least ${statedTarget} words.`,
        `- Do not submit a chapter below ${chapterWordTargets.hardFloorWords} words under any circumstance.`,
    ].join("\n");
    const chapterOneVictimRule = proseVictimName && isChapterOneBatch
        ? [
            "CHAPTER 1 VICTIM-NAMING RULE (NON-NEGOTIABLE):",
            `- In Chapter 1, name the victim as \"${proseVictimName}\" on-page.`,
            "- Never use placeholder phrasing such as \"unknown victim\", \"stranger\", or unnamed body references in place of the victim name.",
            `- If the exact full name \"${proseVictimName}\" is missing, the chapter is invalid.`,
        ].join("\n")
        : "";
    const immutablePronounMap = buildPronounLockLines(cast);
    const immutablePronounBlock = immutablePronounMap.length > 0
        ? `IMMUTABLE PRONOUN MAP (NON-OVERRIDABLE):\n${immutablePronounMap.join("\n")}\n- Do not switch or reinterpret these pronouns in any chapter.\n- Any pronoun mismatch invalidates the chapter.`
        : "";
    const developer = `# Prose Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "classic|modern|atmospheric",\n  "chapters": [\n    {\n      "title": "Chapter title",\n      "summary": "1-2 sentence summary",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]\n    }\n  ],\n  "cast": ["Name 1", "Name 2"],\n  "note": ""\n}\n\nRequirements:\n- Write exactly one chapter per outline scene (${scenes.length || "N"} total).\n- Chapter numbering starts at ${chapterStart} and increments by 1 per scene.\n- Each chapter has ${chapterGuidance}.\n- Use ${narrativeStyle} tone and ${targetLength} length guidance.\n- Reflect the outline summary in each chapter.\n- Keep all logic consistent with CML (no new facts).\n\nNOVEL-QUALITY PROSE REQUIREMENTS:\n\n1. SCENE-SETTING: Begin key scenes with atmospheric description\n   - Establish time of day, weather, lighting\n   - Describe location using sensory details (sight, sound, smell, touch)\n   - Set mood and atmosphere before action begins\n   - Use location and temporal context to ground reader\n   Example structure: "The <MONTH> <TIME> brought <WEATHER> to <LOCATION>. In the <ROOM>, <LIGHTING> while <SENSORY_DETAIL>. <CHARACTER>'s <OBJECT> <ACTION>."

   Generate new descriptions using actual location and character names from the provided profiles.\n\n2. SHOW, DON'T TELL: Use concrete details and actions\n   ❌ "She was nervous."\n   ✓ "Her fingers twisted the hem of her glove, the silk threatening to tear. A bead of perspiration traced down her temple despite the cool morning air."\n   - Body language reveals emotion\n   - Actions reveal character\n   - Environment reflects internal state\n\n3. VARIED SENTENCE STRUCTURE:\n   - Mix short, punchy sentences with longer, flowing ones\n   - Use sentence rhythm to control pacing\n   - Short sentences for tension, longer for description\n   - Paragraph variety: Some 2 lines, some 8 lines\n\n4. DIALOGUE THAT REVEALS CHARACTER:\n   - Each character has distinct speech patterns (see character profiles)\n   - Use dialogue tags sparingly (action beats instead)\n   - Subtext: characters don't always say what they mean\n   - Class/background affects vocabulary and formality\n   - Tension through what's NOT said\n   Example structure: "<DIALOGUE>," <CHARACTER> said, <ACTION_BEAT>.

   Use only character names from the provided cast list.\n\n5. SENSORY IMMERSION:\n   - Include multiple senses per scene (2-3 minimum)\n   - Period-specific sensory details from location/temporal profiles\n   - Tactile details create immediacy\n   - Use sensory palette provided in location profiles\n   - Vary sensory focus: visual → auditory → olfactory → tactile\n\n6. PARAGRAPH STRUCTURE:\n   - Opening: Hook with action, dialogue, or atmospheric detail\n   - Middle: Develop scene, reveal information, build tension\n   - Closing: End with revelation, question, or transition\n   - Each paragraph should advance story or deepen character\n\n7. PACING VARIATION:\n   - Action scenes: Short paragraphs (2-4 lines), quick succession\n   - Investigation scenes: Moderate length (4-6 lines), methodical rhythm\n   - Atmospheric scenes: Longer paragraphs (6-8 lines), detailed description\n   - Revelation scenes: Build slowly with long paragraphs, climax with short punch\n\n8. EMOTIONAL SUBTEXT & TENSION:\n   - Characters have hidden secrets/stakes (see character profiles)\n   - Every interaction carries subtext based on relationships\n   - Build tension through: pauses, interrupted speech, avoided topics, body language\n   - Mystery atmosphere: Suspicion, unease, watchfulness\n   - Use weather/atmosphere to mirror emotional tension${qualityGuardrailBlock}${proseRequirementsBlock}`;
    // Amateur detective extra warning — LLM tends to invent police officers for unnamed official response
    const amateurPoliceWarning = inputs.detectiveType === 'amateur'
        ? `\n\n⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.`
        : '';
    const strictContractAppendix = `${rigidWordCountBlock}${chapterOneVictimRule ? `\n\n${chapterOneVictimRule}` : ""}${immutablePronounBlock ? `\n\n${immutablePronounBlock}` : ""}`;
    const developerWithContracts = `${developer}\n\n${strictContractAppendix}`;
    const user = `Write the full prose following the outline scenes.\n\n${buildContextSummary(inputs.caseData, inputs.cast)}\n\nOutline scenes:\n${JSON.stringify(sanitizeScenesCharacters(scenes, cast.map((c) => c.name)), null, 2)}`;
    const promptContextBlocks = buildPromptContextBlocks({
        cmlGroundTruthBlock,
        characterConsistencyRules,
        characterPersonalityContext,
        physicalPlausibilityRules,
        eraAuthenticityRules,
        locationProfilesContext,
        temporalContextBlock,
        lockedFactsBlock,
        clueDescriptionBlock,
        nsdBlock,
        continuityBlock,
        discriminatingTestBlock,
        humourGuideBlock,
        craftGuideBlock,
        sceneGroundingChecklist,
        provisionalScoringFeedbackBlock,
    });
    const baseSystem = `${system}${amateurPoliceWarning}`;
    const { composedSystem } = applyPromptBudgeting(baseSystem, developerWithContracts, user, promptContextBlocks, 6200);
    const messages = [
        { role: "system", content: composedSystem },
        { role: "user", content: user },
    ];
    // E5: Capture section sizes (char count per block before budgeting)
    const sectionSizes = {};
    for (const block of promptContextBlocks) {
        sectionSizes[block.key] = block.content.length;
    }
    return { system, developer, user, messages, sectionSizes };
};
const chunkScenes = (scenes, chunkSize) => {
    const batches = [];
    for (let i = 0; i < scenes.length; i += chunkSize) {
        batches.push(scenes.slice(i, i + chunkSize));
    }
    return batches;
};
const parseProseResponse = (content) => {
    try {
        return JSON.parse(content);
    }
    catch (error) {
        const repaired = jsonrepair(content);
        return JSON.parse(repaired);
    }
};
const cloneBatchChapters = (chapters) => chapters.map((chapter) => ({
    ...chapter,
    paragraphs: Array.isArray(chapter.paragraphs) ? [...chapter.paragraphs] : [],
}));
/**
 * Build a lean revision message set for the main retry loop.
 *
 * Content-filter mitigation: the full `buildProsePrompt` carries dense CML case
 * data (murder details, crime scenes, physical evidence) which, combined with the
 * previous prose in the revision directive, exceeds Azure's content-management
 * threshold.  This lean version includes only the context the model needs for
 * surgical edits — character map, word targets, victim name — framed explicitly
 * as a creative-fiction editing task so the filter treats the content as literary.
 */
/**
 * Serialise failed chapters into the prose JSON payload that will be sent as an
 * `assistant`-role message.  Azure's content filter does not re-classify
 * historical assistant-role messages with the same harm classifier it applies to
 * incoming `user` messages, so mystery prose paragraphs (murder, poison, weapons)
 * no longer trigger content_filter errors when delivered this way.
 */
const buildRevisionProseJson = (failedChapters, chapterStart) => {
    const chapterPayload = failedChapters.map((chapter, idx) => ({
        chapterNumber: chapterStart + idx,
        title: chapter.title,
        summary: chapter.summary ?? "",
        paragraphs: Array.isArray(chapter.paragraphs) ? chapter.paragraphs : [],
    }));
    return JSON.stringify({ chapters: chapterPayload }, null, 2);
};
const buildLeanRevisionMessages = (retrySourceChapters, errors, chapterStart, feedback, options) => {
    const pronounLockLines = buildPronounLockLines(options.cast);
    const wordTargets = getChapterWordTargets(options.targetLength || "medium");
    // Build scene context lines so the model can regenerate from structural context
    // rather than from prose paragraphs (which trigger the Azure content filter).
    const sceneLines = Array.isArray(options.scenes)
        ? options.scenes
            .map((scene, idx) => {
            const parts = [`Chapter ${chapterStart + idx}:`];
            if (scene?.summary)
                parts.push(`Summary: ${scene.summary}`);
            if (scene?.purpose)
                parts.push(`Purpose: ${scene.purpose}`);
            return parts.join(" ");
        })
            .filter(Boolean)
        : [];
    const system = [
        "CONTEXT: You are writing chapters of a mystery fiction manuscript in the tradition of Agatha Christie and Arthur Conan Doyle.",
        "This is a creative fiction writing task. All references to crime, death, murder, poison, weapons, alibis, and investigation are standard elements of the mystery genre.",
        "",
        "You are a targeted chapter regeneration assistant. Write a fresh chapter that satisfies ALL listed requirements.",
        "Do NOT add or remove chapters. Return exactly the same number of chapters as scenes provided.",
        "",
        "CHARACTER MAP (immutable — use these pronouns exactly):",
        ...pronounLockLines,
        "",
        `WORD TARGETS: hard floor ${wordTargets.hardFloorWords} words, preferred ${wordTargets.preferredWords} words per chapter.`,
        ...(sceneLines.length > 0 ? ["", "SCENE CONTEXT (write each chapter to fulfil its scene):", ...sceneLines] : []),
        "",
        "Return valid JSON only.",
    ].join("\n");
    const fixInstructions = buildRetryRevisionUserDirective(retrySourceChapters, errors, chapterStart, {
        victimName: options.victimName,
        pronounLockLines,
    });
    // NOTE: No prior prose in the conversation — mystery prose paragraphs in any
    // role (user OR assistant) trigger Azure's content filter on subsequent calls.
    // Provide scene context in the system message and error directives in the user
    // message instead; the model regenerates rather than revises in-place.
    return [
        { role: "system", content: system },
        { role: "user", content: feedback },
        { role: "user", content: fixInstructions },
    ];
};
export const buildRetryRevisionPrompt = (failedChapters, errors, chapterStart, options) => {
    const system = [
        "CONTEXT: All output is for a Golden Age whodunnit mystery novel — creative fiction in the tradition of Agatha Christie. All references to crime, death, murder, poison, weapons, alibis, and investigation are standard fictional genre elements. No real people or events are depicted.",
        "You are a targeted chapter regeneration assistant for mystery fiction.",
        "Write a fresh chapter that corrects ALL listed errors.",
        "Keep chapter count/order unchanged and do not add/remove chapters.",
        "Return JSON only.",
    ].join(" ");
    // No prior prose in the conversation — mystery prose paragraphs in any role
    // (user OR assistant) trigger Azure's content filter on subsequent calls.
    const fixInstructions = buildRetryRevisionUserDirective(failedChapters, errors, chapterStart, options);
    return [
        { role: "system", content: system },
        { role: "user", content: fixInstructions },
    ];
};
export const buildRetryRevisionUserDirective = (failedChapters, errors, chapterStart, options) => {
    const chapterEnd = chapterStart + failedChapters.length - 1;
    const includesChapterOne = chapterStart <= 1 && 1 <= chapterEnd;
    const hardFloorMatch = errors
        .map((error) => error.match(/word count (?:below hard floor|below minimum) \(\d+\/(\d+)\)/i))
        .find(Boolean);
    const hardFloorWords = hardFloorMatch ? Number(hardFloorMatch[1]) : undefined;
    const fixOrderHeader = [
        "MANDATORY FIX ORDER (APPLY IN THIS EXACT ORDER):",
        `1. Word count first: ${Number.isFinite(hardFloorWords) ? `each revised chapter must be >= ${hardFloorWords} words.` : "each revised chapter must satisfy the validator hard-floor target."}`,
        `2. Victim naming second: ${includesChapterOne ? (options?.victimName ? `Chapter 1 must name the victim as \"${options.victimName}\" and must not use unknown-victim placeholders.` : "Chapter 1 must name the victim explicitly and avoid unknown-victim placeholders.") : "keep existing victim references stable unless validator errors explicitly report victim-naming defects."}`,
        `3. Pronouns third: ${Array.isArray(options?.pronounLockLines) && options.pronounLockLines.length > 0 ? `keep this immutable map exactly -> ${options.pronounLockLines.join('; ')}` : "preserve each character's canonical pronouns exactly as defined by cast."}`,
        "4. Style and pacing fourth: improve prose flow only after rules 1-3 are fully satisfied.",
    ].join("\n");
    const user = [
        "Regeneration mode: write a corrected chapter that fixes ALL listed errors.",
        "",
        "═══ REQUIREMENTS ═══",
        "- Use the character map and scene context from the system prompt as your foundation.",
        "- Fix every error listed below — these are the ONLY defects in the previous attempt.",
        "- Clue references, victim naming, and any element NOT listed as an error must be present in your output.",
        "- Do NOT reduce word count — meet or exceed the hard floor target in the system prompt.",
        "════════════════════════════════════════",
        "",
        fixOrderHeader,
        "",
        "Fix ONLY these errors:",
        ...errors.map((error) => `- ${error}`),
        "",
        "Return this JSON schema exactly:",
        '{"chapters":[{"title":"...","summary":"...","paragraphs":["...","..."]}]}',
    ].join("\n");
    return user;
};
const buildProvisionalChapterScore = (chapter, chapterNumber, ledgerEntry, contentIssues, clueDistribution) => {
    const chapterText = (chapter.paragraphs ?? []).join(' ');
    const wordCount = countWords(chapterText);
    const hardFloorWords = ledgerEntry?.hardFloorWords ?? 0;
    const wordScore = wordCount >= hardFloorWords
        ? 100
        : hardFloorWords > 0
            ? Math.min(100, Math.round((wordCount / hardFloorWords) * 100))
            : 100;
    const paragraphCount = chapter.paragraphs?.length ?? 0;
    const paragraphScore = paragraphCount >= 6 ? 100 : paragraphCount >= 5 ? 93 : paragraphCount >= 4 ? 86 : paragraphCount >= 3 ? 76 : 65;
    const requiredClues = ledgerEntry?.requiredClueIds ?? [];
    const matchedClues = requiredClues.filter((clueId) => chapterMentionsRequiredClue(chapterText, clueId, clueDistribution));
    const clueScore = requiredClues.length > 0
        ? Math.round((matchedClues.length / requiredClues.length) * 100)
        : 100;
    const weightedIssuePenalty = contentIssues.reduce((penalty, issue) => {
        const sev = String(issue.severity ?? '').toLowerCase();
        if (sev === 'major' || sev === 'critical')
            return penalty + 18;
        if (sev === 'minor')
            return penalty + 8;
        return penalty + 5;
    }, 0);
    const issueScore = Math.max(0, 100 - weightedIssuePenalty);
    const provisionalScore = Math.max(0, Math.min(100, Math.round(wordScore * 0.35 + paragraphScore * 0.2 + clueScore * 0.25 + issueScore * 0.2)));
    const deficits = [];
    const directives = [];
    if (wordScore < 100) {
        deficits.push(`word density below hard floor (${wordCount}/${hardFloorWords})`);
        directives.push(`Keep chapter length at or above hard floor ${hardFloorWords} words while preserving clue obligations and scene continuity.`);
        if (hardFloorWords > 0 && wordCount < hardFloorWords) {
            directives.push(`Chapter is below hard floor (${wordCount}/${hardFloorWords}); expand with concrete evidence/action beats before retrying.`);
        }
    }
    if (paragraphScore < 95) {
        deficits.push(`paragraph structure too thin (${paragraphCount} paragraphs)`);
        directives.push('Use at least 4-5 substantial paragraphs with varied rhythm and one strong scene transition.');
    }
    if (clueScore < 100) {
        const missing = requiredClues.filter((clueId) => !matchedClues.includes(clueId));
        deficits.push(`required clue surfacing incomplete (${matchedClues.length}/${requiredClues.length})`);
        if (missing.length > 0) {
            directives.push(`Surface missing clue evidence on-page with observable detail: ${missing.join(', ')}.`);
        }
        else {
            directives.push('Surface required clue evidence on-page before any deduction beat.');
        }
    }
    const groundingIssue = contentIssues.find((issue) => /grounding|location anchoring|setting fidelity/i.test(issue.message));
    if (groundingIssue) {
        deficits.push('scene grounding weakness');
        directives.push('Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.');
    }
    const temporalIssue = contentIssues.find((issue) => /month\/season contradiction|temporal/i.test(issue.message));
    if (temporalIssue) {
        deficits.push('temporal consistency risk');
        directives.push('Maintain month-season lock in narration and dialogue; remove conflicting seasonal terms.');
    }
    if (deficits.length === 0 && provisionalScore < 95) {
        deficits.push('general prose quality drift');
        directives.push('Tighten causal clarity and add one explicit evidence-driven inference beat in the next chapter.');
    }
    return {
        chapter: chapterNumber,
        score: provisionalScore,
        deficits,
        directives,
    };
};
const validateChapterCount = (chapters, expected, options) => {
    if (!Array.isArray(chapters) || chapters.length === 0) {
        throw new Error("Invalid prose output: missing chapters");
    }
    if (expected > 0 && chapters.length !== expected) {
        const lengthLabel = options?.targetLength ?? "medium";
        throw new Error(`Invalid prose output: expected ${expected} chapters, got ${chapters.length} [source outline.acts[].scenes for this batch/run; YAML chapter target key ${GENERATION_PARAMS_YAML_PATH}#story_length_policy.chapter_targets.${lengthLabel}]`);
    }
};
/**
 * Extract chapter summary for continuity tracking
 * Captures character names, setting vocabulary, and key events from completed chapters
 */
function extractChapterSummary(chapter, chapterNumber, castNames) {
    const text = chapter.paragraphs.join(' ');
    // Extract character names that actually appear in this chapter
    const charactersPresent = castNames.filter(name => {
        const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(text);
    });
    // Extract setting-related terms (common location vocabulary)
    const settingPatterns = [
        /\b(library|drawing[- ]room|study|parlour|parlor|dining[- ]room|ballroom|conservatory|terrace|garden|stable|kitchen|servants?'? quarters?)\b/gi,
        /\b(cabin|stateroom|deck|gangway|saloon|smoking[- ]room|promenade)\b/gi,
        /\b(compartment|corridor|dining[- ]car|sleeping[- ]car|platform|station)\b/gi,
        /\b(lobby|suite|bedroom|restaurant|bar|lounge)\b/gi,
        /\b(estate|manor|cottage|villa|townhouse|apartment|flat)\b/gi
    ];
    const settingTerms = [];
    settingPatterns.forEach(pattern => {
        const matches = text.match(pattern) || [];
        matches.forEach(match => {
            const normalized = match.toLowerCase().trim();
            if (!settingTerms.includes(normalized)) {
                settingTerms.push(normalized);
            }
        });
    });
    // Extract first sentence of each paragraph as key events (simple heuristic)
    const keyEvents = [];
    chapter.paragraphs.slice(0, 3).forEach(para => {
        const firstSentence = para.match(/^[^.!?]+[.!?]/);
        if (firstSentence && firstSentence[0].length < 150) {
            keyEvents.push(firstSentence[0].trim());
        }
    });
    return {
        chapterNumber,
        title: chapter.title,
        charactersPresent: charactersPresent.slice(0, 8), // Limit to top 8
        settingTerms: settingTerms.slice(0, 10), // Limit to 10 terms
        keyEvents: keyEvents.slice(0, 3) // Max 3 events
    };
}
/**
 * Build continuity context from previous chapter summaries
 * Provides character name consistency and setting vocabulary for late chapters
 */
function buildContinuityContext(summaries, currentChapterStart) {
    if (summaries.length === 0) {
        return '';
    }
    // Use all previous chapter summaries for name/setting aggregation
    const relevantSummaries = summaries;
    // Aggregate character names across all previous chapters
    const allCharacters = new Set();
    relevantSummaries.forEach(s => s.charactersPresent.forEach(c => allCharacters.add(c)));
    // Aggregate setting terms
    const allSettingTerms = new Set();
    relevantSummaries.forEach(s => s.settingTerms.forEach(t => allSettingTerms.add(t)));
    let context = '\n\n═══════════════════════════════════════════════════════════\n';
    context += '📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY\n';
    context += '═══════════════════════════════════════════════════════════\n\n';
    context += '**CRITICAL: You are writing chapters ' + currentChapterStart + '+. Maintain consistency with earlier chapters.**\n\n';
    // Character names section
    if (allCharacters.size > 0) {
        context += '**Character Names Used in Chapters 1-' + Math.max(...relevantSummaries.map(s => s.chapterNumber)) + ':**\n';
        const charList = Array.from(allCharacters).slice(0, 12).join(', ');
        context += charList + '\n\n';
        context += '✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.\n';
        context += '✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character\'s canonical name in the list above.\n\n';
    }
    // Setting vocabulary section
    if (allSettingTerms.size > 0) {
        context += '**Setting Vocabulary Established in Earlier Chapters:**\n';
        const termList = Array.from(allSettingTerms).slice(0, 15).join(', ');
        context += termList + '\n\n';
        context += '✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.\n';
        context += '✓ Do NOT introduce new location types that contradict earlier chapters.\n\n';
    }
    // Recent chapter summaries for narrative flow
    const recentSummaries = summaries.slice(Math.max(0, summaries.length - 3), summaries.length);
    if (recentSummaries.length > 0) {
        context += '**Recent Chapter Summary (for narrative continuity):**\n';
        recentSummaries.forEach(summary => {
            context += `Chapter ${summary.chapterNumber}: ${summary.title}\n`;
            if (summary.keyEvents.length > 0) {
                context += `  Events: ${summary.keyEvents[0]}\n`;
            }
        });
        context += '\n';
    }
    context += '⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.\n';
    context += 'Double-check every character name against the list above before using it.\n';
    context += '═══════════════════════════════════════════════════════════\n';
    return context;
}
/**
 * Build an explicit chapter-by-chapter scene grounding checklist using
 * outline scene settings and location profile names.
 */
function buildSceneGroundingChecklist(scenes, locationProfiles, chapterStart) {
    if (!Array.isArray(scenes) || scenes.length === 0)
        return '';
    const locationNames = new Set();
    if (locationProfiles?.primary?.name) {
        locationNames.add(String(locationProfiles.primary.name));
    }
    if (Array.isArray(locationProfiles?.keyLocations)) {
        for (const loc of locationProfiles.keyLocations) {
            if (loc?.name)
                locationNames.add(String(loc.name));
        }
    }
    const checklistLines = [];
    scenes.forEach((scene, idx) => {
        const chapterNumber = chapterStart + idx;
        const sceneLocation = String(scene?.setting?.location || scene?.location || '').trim();
        const locationHint = sceneLocation.length > 0
            ? sceneLocation
            : (locationNames.size > 0 ? Array.from(locationNames)[0] : 'the canonical primary location');
        checklistLines.push(`- Chapter ${chapterNumber}: anchor opening in "${locationHint}"; include 2+ sensory cues and 1+ atmosphere marker before major dialogue.`);
    });
    const knownLocations = Array.from(locationNames).slice(0, 8).join(', ');
    const knownLocationLine = knownLocations.length > 0
        ? `Known location profile anchors: ${knownLocations}`
        : 'Known location profile anchors: use the primary location and scene setting terms from outline.';
    return `\n\nSCENE GROUNDING CHECKLIST (MUST FOLLOW):\n${knownLocationLine}\n${checklistLines.join('\n')}`;
}
/**
 * Validate that discriminating test requirements can be satisfied by CML
 * Returns error message if validation fails, empty string if OK
 */
function validateChecklistRequirements(caseData) {
    const cmlCase = caseData?.CASE ?? {};
    const discriminatingTest = cmlCase.discriminating_test;
    if (!discriminatingTest || !discriminatingTest.design) {
        return ''; // No test to validate
    }
    const evidenceClues = discriminatingTest.evidence_clues || [];
    const clueRegistry = cmlCase.clue_registry || [];
    // Check that all evidence clues exist in clue registry
    const missingClues = [];
    evidenceClues.forEach((clue) => {
        const clueId = typeof clue === 'string' ? clue : clue.clue_id;
        const exists = clueRegistry.some((registryClue) => registryClue.clue_id === clueId);
        if (!exists) {
            missingClues.push(clueId);
        }
    });
    if (missingClues.length > 0) {
        return `❌ CHECKLIST VALIDATION FAILED: Discriminating test references clues that don't exist in clue_registry: ${missingClues.join(', ')}. Cannot generate checklist with invalid clue references.`;
    }
    // Check that eliminated suspects exist in cast
    const eliminated = discriminatingTest.eliminated_suspects || [];
    const cast = cmlCase.cast || [];
    const missingCast = [];
    eliminated.forEach((suspect) => {
        const suspectName = typeof suspect === 'string' ? suspect : suspect.name;
        const exists = cast.some((member) => member.name === suspectName);
        if (!exists) {
            missingCast.push(suspectName);
        }
    });
    if (missingCast.length > 0) {
        return `❌ CHECKLIST VALIDATION FAILED: Discriminating test eliminates suspects not in cast: ${missingCast.join(', ')}. Cannot eliminate non-existent characters.`;
    }
    return ''; // Validation passed
}
/**
 * Build discriminating test checklist from CML.
 * Provides explicit checkbox requirements for late chapters (past 70% of story) where the test should appear.
 * Breaks down complex multi-step reasoning into concrete requirements.
 */
function buildDiscriminatingTestChecklist(caseData, chapterRange, outline, totalScenes) {
    const cmlCase = caseData?.CASE ?? {};
    const discriminatingTest = cmlCase.discriminating_test;
    if (!discriminatingTest || !discriminatingTest.design) {
        return '';
    }
    // Validate checklist requirements before building
    const validationError = validateChecklistRequirements(caseData);
    if (validationError) {
        return '\n\n' + validationError + '\n';
    }
    const testDesign = discriminatingTest.design;
    const testType = testDesign.test_type || 'unknown';
    const testDescription = testDesign.description || '';
    const evidenceClues = discriminatingTest.evidence_clues || [];
    const eliminated = discriminatingTest.eliminated_suspects || [];
    // Only show checklist once we're in the late portion of the story (past 70% threshold).
    // This threshold is relative to totalScenes, matching chapter-validator.ts behaviour.
    const chapterNumbers = chapterRange.split('-').map(n => parseInt(n, 10));
    const lateThreshold = Math.ceil(totalScenes * 0.70);
    const isLateChapter = chapterNumbers.some(n => n >= lateThreshold);
    if (!isLateChapter) {
        return '';
    }
    // Extract clue locations from outline
    const clueLocations = extractClueLocations(caseData, outline);
    let checklist = '\n\n═══════════════════════════════════════════════════════════\n';
    checklist += '🎯 DISCRIMINATING TEST CHECKLIST - CRITICAL REQUIREMENTS\n';
    checklist += '═══════════════════════════════════════════════════════════\n\n';
    checklist += `This is a **${testType}** test. The detective must:\n\n`;
    checklist += `**Test Description:**\n${testDescription}\n\n`;
    checklist += `**MANDATORY CHECKLIST - Every box must be checked:**\n\n`;
    // Evidence clue requirements with locations
    if (evidenceClues.length > 0) {
        checklist += `☐ **Evidence Integration**\n`;
        evidenceClues.forEach((clue) => {
            const clueId = typeof clue === 'string' ? clue : clue.clue_id;
            const clueType = typeof clue === 'object' ? clue.type || 'clue' : 'clue';
            const location = clueLocations.get(clueId);
            const locationStr = location ? ` (appears in ${location})` : '';
            checklist += `  ☐ Explicitly reference or use clue: "${clueId}" (${clueType})${locationStr}\n`;
        });
        checklist += `\n`;
    }
    // Test execution requirements based on type
    checklist += `☐ **Test Execution**\n`;
    if (testType === 'timing_test' || testType === 'timeline_test') {
        checklist += `  ☐ Detective reviews or reconstructs the timeline\n`;
        checklist += `  ☐ Show calculation or reasoning about time windows\n`;
        checklist += `  ☐ Demonstrate which suspects had/lacked opportunity\n`;
    }
    else if (testType === 'physical_test' || testType === 'capability_test') {
        checklist += `  ☐ Detective tests or demonstrates the physical requirement\n`;
        checklist += `  ☐ Show measurement, demonstration, or verification\n`;
        checklist += `  ☐ Clearly show which suspects can/cannot meet requirement\n`;
    }
    else if (testType === 'knowledge_test' || testType === 'specialized_knowledge') {
        checklist += `  ☐ Detective identifies what specialized knowledge is required\n`;
        checklist += `  ☐ Show investigation of who has this knowledge\n`;
        checklist += `  ☐ Demonstrate which suspects possess/lack the knowledge\n`;
    }
    else if (testType === 'access_test' || testType === 'opportunity_test') {
        checklist += `  ☐ Detective maps who had access at critical time\n`;
        checklist += `  ☐ Show verification of alibis or access records\n`;
        checklist += `  ☐ Clearly eliminate suspects who lacked access\n`;
    }
    else {
        checklist += `  ☐ Detective performs the test or verification\n`;
        checklist += `  ☐ Show clear reasoning and evidence evaluation\n`;
        checklist += `  ☐ Demonstrate which suspects pass/fail the test\n`;
    }
    checklist += `\n`;
    // Suspect elimination requirements
    if (eliminated.length > 0) {
        checklist += `☐ **Suspect Elimination**\n`;
        eliminated.forEach((suspect) => {
            const suspectName = typeof suspect === 'string' ? suspect : suspect.name;
            checklist += `  ☐ Clearly eliminate "${suspectName}" from suspicion\n`;
        });
        checklist += `\n`;
    }
    // Detective reasoning requirements
    checklist += `☐ **Detective Reasoning**\n`;
    checklist += `  ☐ Detective explicitly states the test logic\n`;
    checklist += `  ☐ Show step-by-step deduction process\n`;
    checklist += `  ☐ Connect test results to innocence/guilt determination\n`;
    checklist += `\n`;
    // Prose quality requirements
    checklist += `☐ **Prose Integration**\n`;
    checklist += `  ☐ Scene is dramatic and engaging (not dry exposition)\n`;
    checklist += `  ☐ Use dialogue to reveal test logic naturally\n`;
    checklist += `  ☐ Build tension as test proceeds\n`;
    checklist += `  ☐ Clear moment of revelation when test succeeds\n`;
    checklist += `\n`;
    checklist += `⚠️ **VALIDATION:** If ANY checkbox above is unchecked in your prose, the chapter will FAIL validation.\n`;
    checklist += `This test is THE HARDEST element to get right. Take your time. Check every box.\n`;
    checklist += `═══════════════════════════════════════════════════════════\n`;
    return checklist;
}
/**
 * Extract evidence clue locations from narrative outline
 * Returns map of clue_id to Act/Scene location for checklist injection
 */
function extractClueLocations(caseData, outline) {
    const clueLocations = new Map();
    const cmlCase = caseData?.CASE ?? {};
    const clueRegistry = cmlCase.clue_registry || [];
    // Build set of clue IDs we're looking for
    const clueIds = new Set(clueRegistry.map((c) => String(c.clue_id || '')));
    // Search through outline acts and scenes
    outline.acts?.forEach((act) => {
        const actNum = act.act_number;
        act.scenes?.forEach((scene) => {
            const sceneNum = scene.scene_number;
            const sceneText = JSON.stringify(scene).toLowerCase();
            // Check each clue ID
            clueIds.forEach((clueId) => {
                if (clueId && sceneText.includes(clueId.toLowerCase())) {
                    const location = `Act ${actNum}, Scene ${sceneNum}`;
                    // Store first occurrence (could track multiple if needed)
                    if (!clueLocations.has(clueId)) {
                        clueLocations.set(clueId, location);
                    }
                }
            });
        });
    });
    return clueLocations;
}
/**
 * Build enhanced, categorized retry feedback
 * Helps LLM understand exactly what to fix
 */
const buildEnhancedRetryFeedback = (errors, caseData, chapterRange, attempt, maxAttempts, options) => {
    const orderedErrors = prioritizeRetryErrors(errors);
    const isPronounError = (error) => /pronoun|pronoun_gender_mismatch|gender mismatch/i.test(error);
    const isCharacterNameError = (error) => {
        const normalized = error.toLowerCase();
        const looksLikeNameIssue = normalized.includes("illegal_named_walk_on") ||
            normalized.includes("invented name") ||
            normalized.includes("unknown character") ||
            normalized.includes("not in the cast") ||
            normalized.includes("not in cast") ||
            normalized.includes("canonical name") ||
            normalized.includes("character") ||
            normalized.includes("name");
        return looksLikeNameIssue && !isPronounError(error);
    };
    const cmlCase = caseData?.CASE ?? {};
    const cast = cmlCase.cast || [];
    const castNames = cast.map((c) => c.name);
    const victimName = resolveVictimNameFromCaseData(caseData);
    const pronounLockLines = buildPronounLockLines(cast);
    const locationType = cmlCase.meta?.setting?.location_type || '';
    const priorAttemptErrors = options?.priorAttemptErrors ?? [];
    const chapterRangeNumbers = Array.from(chapterRange.matchAll(/\d+/g)).map((match) => Number(match[0]));
    const includesChapterOne = chapterRangeNumbers.length > 0
        ? (chapterRangeNumbers.length === 1
            ? chapterRangeNumbers[0] === 1
            : Math.min(...chapterRangeNumbers) <= 1 && 1 <= Math.max(...chapterRangeNumbers))
        : false;
    const getClueNarrativeHints = (clueIds) => clueIds
        .map((clueId) => {
        const clue = resolveClueById(options?.clueDistribution, clueId);
        if (!clue) {
            return `- ${clueId}: add concrete on-page evidence plus immediate detective interpretation.`;
        }
        const description = String(clue.description ?? "").trim();
        const pointsTo = String(clue.pointsTo ?? "").trim();
        return `- ${clueId}: evidence='${description || "(no description provided)"}'${pointsTo ? `; points_to='${pointsTo}'` : ""}`;
    })
        .slice(0, 6);
    const persistenceSignals = summarizeRetryPersistence(priorAttemptErrors);
    const persistentObligationIds = persistenceSignals.persistentMissingClueIds;
    const hardFloorFailureAttempts = persistenceSignals.hardFloorFailureAttempts;
    // Categorize errors
    const obligationErrors = orderedErrors.filter(e => e.toLowerCase().includes('missing required clue obligation'));
    const hardFloorErrors = orderedErrors.filter(e => e.toLowerCase().includes('word count below hard floor'));
    const pronounErrors = orderedErrors.filter(isPronounError);
    const temporalErrors = orderedErrors.filter(e => e.toLowerCase().includes('month/season contradiction') || e.toLowerCase().includes('temporal'));
    const paragraphErrors = orderedErrors.filter(e => e.toLowerCase().includes('overlong paragraph block') || e.toLowerCase().includes('paragraph'));
    const characterNameErrors = orderedErrors.filter(isCharacterNameError);
    const settingErrors = orderedErrors.filter(e => e.toLowerCase().includes('setting') || e.toLowerCase().includes('location'));
    const testErrors = orderedErrors.filter(e => e.toLowerCase().includes('discriminating test'));
    const otherErrors = orderedErrors.filter(e => !obligationErrors.includes(e) &&
        !hardFloorErrors.includes(e) &&
        !pronounErrors.includes(e) &&
        !temporalErrors.includes(e) &&
        !paragraphErrors.includes(e) &&
        !characterNameErrors.includes(e) &&
        !settingErrors.includes(e) &&
        !testErrors.includes(e));
    const buildRetryMicroPromptDirectives = (rawErrors, rangeLabel) => {
        const directives = [];
        const loweredErrors = rawErrors.map((error) => error.toLowerCase());
        const clueErrors = loweredErrors.some((error) => error.includes("missing required clue obligation") || error.includes("clue visibility"));
        if (clueErrors) {
            const clueIds = Array.from(new Set(rawErrors.flatMap((error) => {
                const matches = Array.from(error.matchAll(/"([^"]+)"/g));
                return matches.map((match) => String(match[1] || "")).filter(Boolean);
            })));
            const clueScope = clueIds.length > 0
                ? `Required clue IDs for chapter(s) ${rangeLabel}: ${clueIds.join(", ")}.`
                : `Recover missing required clue evidence in chapter(s) ${rangeLabel}.`;
            const clueNarrativeHints = clueIds.length > 0
                ? getClueNarrativeHints(clueIds).join(" ")
                : "";
            directives.push(`MICRO-PROMPT [clue_visibility]: ${clueScope} Add an on-page clue observation moment and a detective processing line for each missing clue in separate paragraphs. Do not use meta language or internal IDs without narrative context. ${clueNarrativeHints}`);
        }
        const wordCountError = rawErrors.find((error) => /word count (below (hard floor|minimum))/i.test(error));
        if (wordCountError) {
            const hardMatch = wordCountError.match(/\((\d+)\/(\d+)\)/);
            const currentWords = hardMatch ? Number(hardMatch[1]) : undefined;
            const targetWords = hardMatch ? Number(hardMatch[2]) : undefined;
            const guidance = Number.isFinite(targetWords)
                ? `Raise chapter length to at least ${targetWords} words${Number.isFinite(currentWords) ? ` (currently ${currentWords})` : ""}.`
                : "Adjust chapter length to satisfy the configured hard-floor policy.";
            directives.push(`MICRO-PROMPT [word_count]: ${guidance} Expand with concrete action beats, sensory setting detail, and inference-relevant dialogue; avoid filler recap.`);
        }
        const groundingErrors = loweredErrors.some((error) => error.includes("scene location anchoring") || error.includes("grounding") || error.includes("setting fidelity"));
        if (groundingErrors) {
            directives.push(`MICRO-PROMPT [scene_grounding]: Open each failed chapter with a named location from context plus at least two sensory cues and one atmosphere marker before advancing plot beats.`);
        }
        const temporalErrors = loweredErrors.some((error) => error.includes("month/season contradiction") || error.includes("temporal"));
        if (temporalErrors) {
            directives.push(`MICRO-PROMPT [temporal_consistency]: Keep month-season terms aligned; replace conflicting seasonal labels in narration and dialogue while preserving scene events.`);
        }
        const paragraphErrors = loweredErrors.some((error) => error.includes("overlong paragraph block") || error.includes("paragraph"));
        if (paragraphErrors) {
            directives.push(`MICRO-PROMPT [paragraph_structure]: Split dense paragraph walls into smaller logical blocks with clear scene beats and varied rhythm.`);
        }
        const pronounErrors = loweredErrors.some((error) => error.includes("pronoun") || error.includes("pronoun_gender_mismatch") || error.includes("gender mismatch"));
        if (pronounErrors) {
            const pronounMap = pronounLockLines.length > 0
                ? ` Enforce this exact map without deviation: ${pronounLockLines.join('; ')}`
                : " Enforce the cast-defined pronoun map exactly.";
            directives.push(`MICRO-PROMPT [pronoun_consistency]: Replace every mismatched pronoun token with the canonical character pronoun set and re-check each mention in-scene.${pronounMap}`);
        }
        return directives;
    };
    const retryDirectives = buildRetryMicroPromptDirectives(orderedErrors, chapterRange);
    const hardFloorMatch = hardFloorErrors
        .map((error) => error.match(/word count (?:below hard floor|below minimum) \(\d+\/(\d+)\)/i))
        .find(Boolean);
    const hardFloorWords = hardFloorMatch ? Number(hardFloorMatch[1]) : undefined;
    const strictFixOrder = [
        "MANDATORY FIX ORDER (APPLY IN THIS EXACT ORDER):",
        `1. Word count first: ${Number.isFinite(hardFloorWords) ? `each failed chapter must be >= ${hardFloorWords} words.` : "each failed chapter must satisfy the hard-floor target in the validator message."}`,
        `2. Victim naming second: ${victimName ? `Chapter 1 must name the victim as \"${victimName}\" and must not use unknown-victim placeholders.` : "Chapter 1 must name the victim explicitly and avoid unknown-victim placeholders."}`,
        `3. Pronouns third: ${pronounLockLines.length > 0 ? `keep this immutable map exactly -> ${pronounLockLines.join('; ')}` : "preserve each character's canonical pronouns exactly as defined by cast."}`,
        "4. Style and pacing fourth: revise voice/rhythm only after rules 1-3 are satisfied.",
    ].join("\n");
    let feedback = `⚠️ CRITICAL: Attempt ${attempt}/${maxAttempts} for chapters ${chapterRange} had ${errors.length} validation error(s).\n\n`;
    feedback += `You MUST fix ALL of these issues. This is your ${attempt === maxAttempts ? 'FINAL' : 'last'} chance before generation fails.\n\n`;
    if (includesChapterOne || characterNameErrors.length > 0 || pronounErrors.length > 0 || hardFloorErrors.length > 0) {
        feedback += `${strictFixOrder}\n\n`;
    }
    if (obligationErrors.length > 0) {
        feedback += `═══ CLUE OBLIGATION ERRORS (${obligationErrors.length}) ═══\n`;
        obligationErrors.forEach(e => feedback += `• ${e}\n`);
        feedback += `\n✓ SOLUTION PRIORITY 1: Satisfy required clue obligations first before style or pacing edits\n`;
        feedback += `✓ Add explicit on-page evidence moments for each missing clue with immediate detective processing\n`;
        feedback += `✓ Keep clue evidence concrete and observable; avoid meta labels without narrative context\n\n`;
    }
    if (persistentObligationIds.length > 0) {
        feedback += `═══ PERSISTENT CLUE OBLIGATION ALERT (${persistentObligationIds.length}) ═══\n`;
        feedback += `• These clue obligations failed in multiple attempts: ${persistentObligationIds.join(", ")}\n`;
        getClueNarrativeHints(persistentObligationIds).forEach((hint) => {
            feedback += `• ${hint}\n`;
        });
        feedback += `\n✓ MANDATORY: Resolve each persistent clue using concrete physical evidence and immediate reasoning in-scene\n`;
        feedback += `✓ Do not print internal IDs like clue_early_1 in narration; express the clue through observable details\n\n`;
    }
    if (hardFloorFailureAttempts >= 2) {
        feedback += `═══ HARD FLOOR COLLAPSE RISK ═══\n`;
        feedback += `• Hard-floor failures occurred in ${hardFloorFailureAttempts} prior attempt(s) for this batch.\n`;
        feedback += `✓ Maintain clue-bearing paragraphs while expanding with concrete scene action; avoid compressing clue evidence during rewrites.\n\n`;
    }
    if (hardFloorErrors.length > 0) {
        feedback += `═══ HARD FLOOR WORD ERRORS (${hardFloorErrors.length}) ═══\n`;
        hardFloorErrors.forEach(e => feedback += `• ${e}\n`);
        feedback += `\n✓ SOLUTION PRIORITY 2: Raise chapter length above hard floor while preserving clue logic\n`;
        feedback += `✓ Expand with concrete evidence-driven action beats and sensory-grounded detail (no filler recap)\n\n`;
    }
    if (temporalErrors.length > 0) {
        feedback += `═══ TEMPORAL CONSISTENCY ERRORS (${temporalErrors.length}) ═══\n`;
        temporalErrors.forEach(e => feedback += `• ${e}\n`);
        feedback += `\n✓ SOLUTION PRIORITY 3: Enforce month-season lock in narration and dialogue\n`;
        feedback += `✓ Replace conflicting season terms with wording consistent with the anchored month\n\n`;
    }
    if (paragraphErrors.length > 0) {
        feedback += `═══ PARAGRAPH STRUCTURE ERRORS (${paragraphErrors.length}) ═══\n`;
        paragraphErrors.forEach(e => feedback += `• ${e}\n`);
        feedback += `\n✓ SOLUTION PRIORITY 4: Split dense paragraph blocks into logical units with clear breakpoints\n`;
        feedback += `✓ Maintain pacing variety with short/medium/long paragraph rhythm\n\n`;
    }
    if (characterNameErrors.length > 0) {
        feedback += `═══ CHARACTER NAME ERRORS (${characterNameErrors.length}) ═══\n`;
        characterNameErrors.forEach(e => feedback += `• ${e}\n`);
        feedback += `\n✓ SOLUTION: The ONLY characters who exist are: ${castNames.join(', ')}\n`;
        feedback += `❌ You used one or more names that are NOT in the cast list above. Find every invented name and either replace it with a real cast member or cut the passage entirely.\n`;
        feedback += `✓ Do NOT introduce any new named character. Walk-on figures must remain anonymous ("a constable", "the footman") — never Mr./Mrs./Inspector [surname].\n\n`;
        feedback += `✓ Never use rank compounds as names (e.g., "Detective Inspector"). If needed, use anonymous role phrases only: "the detective", "an inspector".\n\n`;
    }
    if (pronounErrors.length > 0) {
        feedback += `═══ PRONOUN CONSISTENCY ERRORS (${pronounErrors.length}) ═══\n`;
        pronounErrors.forEach(e => feedback += `• ${e}\n`);
        feedback += `\n✓ SOLUTION: Use this immutable pronoun map exactly for every mention in failed chapters:\n`;
        if (pronounLockLines.length > 0) {
            pronounLockLines.forEach((line) => {
                feedback += `• ${line.replace(/^-\s*/, "")}\n`;
            });
        }
        else {
            feedback += `• Preserve cast-defined pronouns exactly; do not infer or swap pronouns from context.\n`;
        }
        feedback += `✓ Replace mismatched pronouns in-place first, then re-read each sentence to ensure references remain coherent.\n\n`;
    }
    if (settingErrors.length > 0) {
        feedback += `═══ SETTING DRIFT ERRORS (${settingErrors.length}) ═══\n`;
        settingErrors.forEach(e => feedback += `• ${e}\n`);
        if (locationType) {
            feedback += `\n✓ SOLUTION: This story is set in a "${locationType}"\n`;
            feedback += `✓ Use ONLY location vocabulary appropriate for this setting type\n`;
            feedback += `✓ DO NOT use terms from other settings (manor, train, hotel, etc.)\n\n`;
        }
    }
    if (testErrors.length > 0) {
        feedback += `═══ DISCRIMINATING TEST ERRORS (${testErrors.length}) ═══\n`;
        testErrors.forEach(e => feedback += `• ${e}\n`);
        feedback += `\n✓ SOLUTION: The discriminating test must be explicit and complete\n`;
        feedback += `✓ Include the detective's reasoning, the test itself, and clear elimination of suspects\n`;
        feedback += `✓ Reference specific evidence clues from the CML\n`;
        feedback += `✓ Use the discriminating test checklist from the prompt when provided\n`;
        feedback += `\n`;
    }
    if (otherErrors.length > 0) {
        feedback += `═══ OTHER ERRORS (${otherErrors.length}) ═══\n`;
        otherErrors.forEach(e => feedback += `• ${e}\n`);
        feedback += `\n`;
    }
    if (retryDirectives.length > 0) {
        feedback += `═══ RETRY MICRO-PROMPTS (${retryDirectives.length}) ═══\n`;
        retryDirectives.forEach((directive) => {
            feedback += `• ${directive}\n`;
        });
        feedback += `\n`;
    }
    feedback += `═══ STABILITY ANCHOR ═══\n`;
    feedback += `Before regenerating, note what already PASSED in the previous attempt and preserve it:\n`;
    feedback += `• Character names and pronouns that were correct — keep them identical.\n`;
    feedback += `• Clue references that were already surfaced — do not remove or weaken them.\n`;
    feedback += `• Victim naming that was already present — do not regress.\n`;
    feedback += `• Word count that already met the floor — do not shrink chapters.\n`;
    feedback += `\n`;
    feedback += `═══════════════════════════════════\n`;
    feedback += `REGENERATE chapters ${chapterRange} with ALL listed fixes applied.\n`;
    feedback += `Fix every listed error. Do NOT introduce new defects while fixing existing ones.\n`;
    return feedback;
};
const parseExpandedChapterResponse = (content) => {
    const parsed = parseProseResponse(content);
    const candidate = parsed?.chapter ?? parsed;
    if (!candidate || typeof candidate !== "object") {
        throw new Error("Invalid underflow expansion payload: missing chapter object");
    }
    if (!Array.isArray(candidate.paragraphs) || candidate.paragraphs.length === 0) {
        throw new Error("Invalid underflow expansion payload: chapter.paragraphs must be a non-empty array");
    }
    return {
        title: typeof candidate.title === "string" ? candidate.title : "Untitled Chapter",
        summary: typeof candidate.summary === "string" ? candidate.summary : undefined,
        paragraphs: candidate.paragraphs.map((value) => String(value ?? "")).filter(Boolean),
    };
};
export const parseCluePresenceAdjudicationResponse = (content) => {
    const parseJson = () => {
        try {
            return JSON.parse(content);
        }
        catch {
            const repaired = jsonrepair(content);
            return JSON.parse(repaired);
        }
    };
    const parsed = parseJson();
    if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid clue adjudication payload");
    }
    const rawConfidence = Number(parsed.confidence);
    const confidence = Number.isFinite(rawConfidence)
        ? Math.max(0, Math.min(1, rawConfidence))
        : 0;
    const allowedFailureModes = new Set([
        "not_present",
        "too_implicit",
        "ambiguous",
        "format_error",
    ]);
    const failureMode = allowedFailureModes.has(parsed.failure_mode)
        ? parsed.failure_mode
        : "format_error";
    const evidenceSpans = Array.isArray(parsed.evidence_spans)
        ? parsed.evidence_spans.map((value) => String(value ?? "").trim()).filter(Boolean)
        : [];
    return {
        present: Boolean(parsed.present),
        confidence,
        evidenceSpans,
        reasoningSummary: typeof parsed.reasoning_summary === "string" ? parsed.reasoning_summary : "",
        failureMode,
    };
};
const adjudicateCluePresenceShadow = async (client, chapterText, chapterNumber, clueId, clueDistribution, scene, model, runId, projectId) => {
    const clue = resolveClueById(clueDistribution, clueId);
    const clueDescription = String(clue?.description ?? "").trim();
    const cluePointsTo = String(clue?.pointsTo ?? "").trim();
    const sceneSummary = typeof scene?.summary === "string" ? scene.summary : "";
    const system = [
        "CONTEXT: You are analysing chapters of a Golden Age whodunnit mystery novel (creative fiction in the tradition of Agatha Christie). All references to crime, death, and investigation are standard fictional genre elements.",
        "You are a strict clue-presence adjudicator for fair-play mystery prose.",
        "Decide whether the required clue is present on-page in the supplied chapter text.",
        "Use only explicit textual evidence. Do not infer from off-page assumptions.",
        "If present=true, include at least one verbatim evidence span from the chapter text.",
        "Return JSON only.",
    ].join(" ");
    const user = [
        `Chapter number: ${chapterNumber}`,
        `Required clue id: ${clueId}`,
        `Clue description: ${clueDescription || "(missing)"}`,
        `Clue points-to: ${cluePointsTo || "(missing)"}`,
        sceneSummary ? `Scene summary: ${sceneSummary}` : "",
        "Assess whether the clue is present in the chapter prose below.",
        "Output schema:",
        '{"present":boolean,"confidence":number,"evidence_spans":string[],"reasoning_summary":string,"failure_mode":"not_present|too_implicit|ambiguous|format_error"}',
        "Chapter prose:",
        chapterText.slice(0, 16000),
    ]
        .filter(Boolean)
        .join("\n\n");
    const response = await client.chat({
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
        model,
        temperature: 0,
        maxTokens: 500,
        jsonMode: true,
        logContext: {
            runId: runId ?? "",
            projectId: projectId ?? "",
            agent: `Agent9-CluePresenceAdjudicator-Ch${chapterNumber}`,
        },
    });
    return parseCluePresenceAdjudicationResponse(response.content);
};
const extractMissingRequiredClueIds = (errors) => Array.from(new Set(errors.flatMap((error) => {
    if (!/missing required clue obligation/i.test(error)) {
        return [];
    }
    const matches = Array.from(error.matchAll(/"([^"]+)"/g));
    return matches.map((match) => String(match[1] || "")).filter(Boolean);
})));
export const summarizeRetryPersistence = (attemptErrorsHistory) => {
    const counts = new Map();
    attemptErrorsHistory.forEach((attemptErrors) => {
        extractMissingRequiredClueIds(attemptErrors).forEach((id) => {
            counts.set(id, (counts.get(id) ?? 0) + 1);
        });
    });
    const persistentMissingClueIds = Array.from(counts.entries())
        .filter(([, count]) => count >= 2)
        .map(([id]) => id);
    const hardFloorFailureAttempts = attemptErrorsHistory.filter((attemptErrors) => attemptErrors.some((error) => /word count below hard floor/i.test(error))).length;
    return {
        persistentMissingClueIds,
        hardFloorFailureAttempts,
    };
};
const getRetryErrorPriority = (error) => {
    const normalized = error.toLowerCase();
    if (normalized.includes("missing required clue obligation"))
        return 0;
    if (normalized.includes("word count below hard floor"))
        return 1;
    if (normalized.includes("pronoun") || normalized.includes("pronoun_gender_mismatch") || normalized.includes("gender mismatch"))
        return 2;
    if (normalized.includes("month/season contradiction") || normalized.includes("temporal"))
        return 3;
    if (normalized.includes("overlong paragraph block"))
        return 4;
    if (normalized.includes("scene location anchoring") || normalized.includes("grounding"))
        return 5;
    if (normalized.includes("paragraph"))
        return 6;
    return 50;
};
export const prioritizeRetryErrors = (errors) => [...errors]
    .map((error, index) => ({ error, index, priority: getRetryErrorPriority(error) }))
    .sort((a, b) => (a.priority - b.priority) || (a.index - b.index))
    .map((entry) => entry.error);
const attemptClueObligationRepair = async (client, chapter, chapterNumber, scene, ledgerEntry, missingClueIds, clueDistribution, strictMode, model, runId, projectId, cast) => {
    const chapterText = (chapter.paragraphs ?? []).join("\n\n");
    const sceneSummary = typeof scene?.summary === "string" ? scene.summary : "";
    const scenePurpose = typeof scene?.purpose === "string" ? scene.purpose : "";
    const expansionConfig = getGenerationParams().agent9_prose.underflow_expansion;
    const clueContextLines = missingClueIds
        .map((clueId) => {
        const clue = resolveClueById(clueDistribution, clueId);
        if (!clue) {
            return `- ${clueId}: add observable physical or testimonial evidence and explicit detective interpretation.`;
        }
        const description = String(clue.description ?? "").trim();
        const pointsTo = String(clue.pointsTo ?? "").trim();
        return `- ${clueId}: evidence='${description || "(no description provided)"}'${pointsTo ? `; points_to='${pointsTo}'` : ""}`;
    })
        .slice(0, 8);
    const clueRepairPronounLockLines = cast && cast.length > 0 ? buildPronounLockLines(cast) : [];
    const system = [
        "CONTEXT: You are editing a chapter of a Golden Age whodunnit mystery novel (creative fiction in the tradition of Agatha Christie and Arthur Conan Doyle). All references to crime, death, poison, weapons, and investigation are standard fictional genre elements. No real people or events are depicted.",
        "You are a surgical prose revision assistant for mystery fiction.",
        "Repair missing required clue obligations while preserving chronology, cast identity, and clue logic.",
        "Do not introduce new named characters and do not remove existing valid evidence.",
        clueRepairPronounLockLines.length > 0
            ? `CHARACTER PRONOUN MAP (immutable — use these exactly, without deviation): ${clueRepairPronounLockLines.join('; ')}`
            : "",
        isClueIdMarkerModeEnabled()
            ? "Temporary technical marker mode is enabled. You may include only [[CLUE_ID:<id>]] markers for required clues; these will be stripped after validation."
            : "Do not print internal clue IDs in narration (for example clue_early_1). Express clues as concrete, observable evidence.",
        strictMode
            ? "Strict mode: every required clue must appear explicitly in scene text with immediate detective reasoning, otherwise the output is invalid."
            : "",
        "Output JSON only.",
    ].join(" ");
    const user = [
        `Chapter ${chapterNumber} is missing required clue obligations: ${missingClueIds.join(", ")}.`,
        "Repair the chapter so every missing obligation appears on-page as observable evidence with coherent narrative context.",
        clueContextLines.length > 0 ? `Required clue evidence context:\n${clueContextLines.join("\n")}` : "",
        `Keep chapter length at or above hard floor ${ledgerEntry.hardFloorWords} words.`,
        strictMode
            ? "Strict mode requirements: dedicate at least one sentence of explicit observation and one sentence of detective interpretation for each missing clue."
            : "",
        sceneSummary ? `Scene summary: ${sceneSummary}` : "",
        scenePurpose ? `Scene purpose: ${scenePurpose}` : "",
        isClueIdMarkerModeEnabled()
            ? `Include exact markers for each missing clue in-line with evidence: ${missingClueIds
                .map((id) => `[[CLUE_ID:${id}]]`)
                .join(", ")}.`
            : "",
        "Return this schema:",
        '{"chapter":{"title":"...","summary":"...","paragraphs":["...","..."]}}',
        "Only return the JSON payload.",
        "Current chapter text:",
        chapterText,
    ]
        .filter(Boolean)
        .join("\n\n");
    const response = await client.chat({
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
        model,
        temperature: expansionConfig.temperature,
        maxTokens: expansionConfig.max_tokens,
        jsonMode: true,
        logContext: {
            runId: runId ?? "",
            projectId: projectId ?? "",
            agent: `Agent9-ClueObligationRepair-Ch${chapterNumber}`,
        },
    });
    return parseExpandedChapterResponse(response.content);
};
const attemptUnderflowExpansion = async (client, chapter, chapterNumber, scene, ledgerEntry, model, runId, projectId, targetWords, cast) => {
    const chapterText = (chapter.paragraphs ?? []).join("\n\n");
    const currentWords = countWords(chapterText);
    const effectiveTarget = targetWords ?? ledgerEntry.hardFloorWords;
    const missingWords = Math.max(0, effectiveTarget - currentWords);
    const expansionConfig = getGenerationParams().agent9_prose.underflow_expansion;
    const expansionHint = Math.max(expansionConfig.min_additional_words, Math.min(expansionConfig.max_additional_words, missingWords + expansionConfig.buffer_words));
    const sceneSummary = typeof scene?.summary === "string" ? scene.summary : "";
    const scenePurpose = typeof scene?.purpose === "string" ? scene.purpose : "";
    const requiredClues = ledgerEntry.requiredClueIds;
    const targetLabel = targetWords ? "preferred target" : "hard floor";
    const expansionPronounLockLines = cast && cast.length > 0 ? buildPronounLockLines(cast) : [];
    const system = [
        "CONTEXT: You are editing a chapter of a Golden Age whodunnit mystery novel (creative fiction in the tradition of Agatha Christie and Arthur Conan Doyle). All references to crime, death, poison, weapons, and investigation are standard fictional genre elements. No real people or events are depicted.",
        "You are a surgical prose revision assistant for mystery fiction.",
        "Expand the chapter without changing clue logic, chronology, or character identity.",
        "Do not remove evidence already present. Do not add new named characters.",
        expansionPronounLockLines.length > 0
            ? `CHARACTER PRONOUN MAP (immutable — use these exactly, without deviation): ${expansionPronounLockLines.join('; ')}`
            : "",
        "Output JSON only.",
    ].filter(Boolean).join(" ");
    const user = [
        `Chapter ${chapterNumber} is below ${targetLabel} (${currentWords}/${effectiveTarget}).`,
        `Expand by roughly ${expansionHint} words so the chapter reaches at least ${effectiveTarget} words.`,
        requiredClues.length > 0
            ? `Preserve and clearly surface required clue obligations: ${requiredClues.join(", ")}.`
            : "No additional clue IDs are required for this chapter.",
        sceneSummary ? `Scene summary: ${sceneSummary}` : "",
        scenePurpose ? `Scene purpose: ${scenePurpose}` : "",
        "Return this schema:",
        '{"chapter":{"title":"...","summary":"...","paragraphs":["...","..."]}}',
        "Only return the JSON payload.",
        "Current chapter text:",
        chapterText,
    ]
        .filter(Boolean)
        .join("\n\n");
    const response = await client.chat({
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
        model,
        temperature: expansionConfig.temperature,
        maxTokens: expansionConfig.max_tokens,
        jsonMode: true,
        logContext: {
            runId: runId ?? "",
            projectId: projectId ?? "",
            agent: `Agent9-UnderflowExpansion-Ch${chapterNumber}`,
        },
    });
    return parseExpandedChapterResponse(response.content);
};
export async function generateProse(client, inputs, maxAttempts) {
    const configuredMaxAttempts = getGenerationParams().agent9_prose.generation.default_max_attempts;
    const resolvedMaxAttempts = maxAttempts ?? configuredMaxAttempts;
    const resolvedTargetLength = inputs.targetLength ?? "medium";
    const start = Date.now();
    const outlineActs = Array.isArray(inputs.outline.acts) ? inputs.outline.acts : [];
    const scenes = outlineActs.flatMap((act) => (Array.isArray(act.scenes) ? act.scenes : []));
    const sceneCount = scenes.length;
    const yamlSceneTarget = getSceneTarget(resolvedTargetLength);
    const sceneTargetTolerance = getChapterTargetTolerance();
    if (Math.abs(sceneCount - yamlSceneTarget) > sceneTargetTolerance) {
        const minAllowedSceneCount = Math.max(1, yamlSceneTarget - sceneTargetTolerance);
        const maxAllowedSceneCount = yamlSceneTarget + sceneTargetTolerance;
        console.warn(`[Agent 9] Outline scene/chapter count (${sceneCount}) is outside YAML target tolerance (${yamlSceneTarget} +/- ${sceneTargetTolerance}, allowed ${minAllowedSceneCount}-${maxAllowedSceneCount}) for ${resolvedTargetLength}. Source: ${GENERATION_PARAMS_YAML_PATH}#story_length_policy.chapter_targets.${resolvedTargetLength}; ${GENERATION_PARAMS_YAML_PATH}#story_length_policy.chapter_target_tolerance`);
    }
    const chapters = [];
    const chapterSummaries = [];
    const chapterValidationHistory = [];
    const provisionalChapterScores = [];
    let mandatoryRepairTriggered = 0;
    let mandatoryRepairExecuted = 0;
    let mandatoryRepairInvariantViolations = 0;
    let pronounRepairsApplied = 0;
    // E5: Collect prompt fingerprints per chapter for traceability
    const promptFingerprints = [];
    const chapterValidator = new ChapterValidator();
    const characterConsistencyValidator = new CharacterConsistencyValidator();
    const temporalSeasonLock = deriveTemporalSeasonLock(inputs.temporalContext);
    const progressCallback = inputs.onProgress || (() => { });
    const castNames = inputs.cast.characters.map(c => c.name);
    const proseModelConfig = getGenerationParams().agent9_prose.prose_model;
    const batchSize = Math.max(1, Math.min(inputs.batchSize || 1, proseModelConfig.max_batch_size));
    const proseLinterStats = {
        checksRun: 0,
        failedChecks: 0,
        openingStyleEntropyFailures: 0,
        openingStyleEntropyBypasses: 0,
        paragraphFingerprintFailures: 0,
        ngramOverlapFailures: 0,
    };
    const hardFloorMissChapters = new Set();
    const preferredTargetMissChapters = new Set();
    let hardFloorMissCount = 0;
    let preferredTargetMissCount = 0;
    let underflowExpansionAttempts = 0;
    let underflowExpansionRecovered = 0;
    let underflowExpansionFailed = 0;
    let preferredExpansionAttempts = 0;
    let preferredExpansionRecovered = 0;
    let preferredExpansionFailed = 0;
    let cluePresenceAdjudicatorCalls = 0;
    let cluePresenceAdjudicatorPotentialOverrides = 0;
    let cluePresenceAdjudicatorMalformedOutputs = 0;
    const cluePresenceAdjudicatorTraces = [];
    const requiredClueIdsByChapter = new Map();
    // Deep-copy the caller's NarrativeState so mutations during generation (updateNSD calls)
    // do not bleed back into the orchestrator's copy.  Array/object fields need explicit
    // spreading because the outer spread {...inputs.narrativeState} is only one level deep.
    let liveNarrativeState = inputs.narrativeState
        ? {
            ...inputs.narrativeState,
            lockedFacts: [...inputs.narrativeState.lockedFacts],
            characterPronouns: { ...inputs.narrativeState.characterPronouns },
            usedOpeningStyles: [...inputs.narrativeState.usedOpeningStyles],
            usedSensoryPhrases: [...inputs.narrativeState.usedSensoryPhrases],
            cluesRevealedToReader: [...inputs.narrativeState.cluesRevealedToReader],
            chapterSummaries: [...inputs.narrativeState.chapterSummaries],
        }
        : undefined;
    let rollingProvisionalFeedback = Array.isArray(inputs.provisionalScoringFeedback)
        ? [...inputs.provisionalScoringFeedback]
        : [];
    // Generate and validate scenes in configurable batches.
    // When batchSize=1 (default) this processes one chapter per LLM call;
    // higher values group multiple scenes into a single call for throughput gains.
    for (let batchStart = 0; batchStart < scenes.length; batchStart += batchSize) {
        const batchScenes = scenes.slice(batchStart, batchStart + batchSize);
        const chapterStart = batchStart + 1;
        const chapterEnd = batchStart + batchScenes.length;
        const cmlCase = inputs.caseData?.CASE ?? {};
        const chapterRequirementLedger = buildChapterRequirementLedger(cmlCase, batchScenes, chapterStart, resolvedTargetLength);
        for (const entry of chapterRequirementLedger) {
            const requiredClueIds = Array.from(new Set(entry.requiredClueIds.map((id) => String(id || "")).filter(Boolean)));
            const normalizedRequiredClueIds = Array.from(new Set(requiredClueIds.map((id) => normalizeClueId(id)).filter(Boolean)));
            requiredClueIdsByChapter.set(entry.chapterNumber, {
                requiredClueIds,
                normalizedRequiredClueIds,
            });
        }
        const maxBatchAttempts = Math.max(1, resolvedMaxAttempts);
        let lastBatchErrors = [];
        let lastFailedBatchChapters = null;
        const attemptErrorHistory = [];
        let batchSuccess = false;
        let suppressRevision = false; // set when content-filter blocks a revision attempt
        const overallProgress = 91 + Math.floor((batchStart / sceneCount) * 3); // 91-94%
        const batchLabel = batchScenes.length > 1 ? `${chapterStart}-${chapterEnd}` : `${chapterStart}`;
        progressCallback('prose', `Generating chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel}/${sceneCount}...`, overallProgress);
        for (let attempt = 1; attempt <= maxBatchAttempts; attempt++) {
            try {
                const useRevisionRetry = attempt > 1 &&
                    !suppressRevision &&
                    lastBatchErrors.length > 0 &&
                    Array.isArray(lastFailedBatchChapters) &&
                    lastFailedBatchChapters.length === batchScenes.length;
                let messages;
                if (useRevisionRetry) {
                    const retrySourceChapters = lastFailedBatchChapters;
                    const feedback = buildEnhancedRetryFeedback(lastBatchErrors, inputs.caseData, batchLabel, attempt, maxBatchAttempts, {
                        clueDistribution: inputs.clueDistribution,
                        priorAttemptErrors: attemptErrorHistory,
                    });
                    // Use lean revision prompt (content-filter mitigation): carries only
                    // character map, word targets, and fiction-framing context instead of
                    // the full CML case data which concentrates crime/violence content.
                    messages = buildLeanRevisionMessages(retrySourceChapters, lastBatchErrors, chapterStart, feedback, {
                        cast: inputs.cast.characters,
                        victimName: resolveVictimName(inputs.cast),
                        targetLength: inputs.targetLength ?? "medium",
                        scenes: batchScenes,
                    });
                }
                else {
                    // chapterSummaries already holds every committed chapter, so continuity
                    // context is always up-to-date when buildProsePrompt is called.
                    const prompt = buildProsePrompt({
                        ...inputs,
                        narrativeState: liveNarrativeState,
                        provisionalScoringFeedback: rollingProvisionalFeedback,
                    }, batchScenes, chapterStart, chapterSummaries);
                    // E5: Compute prompt fingerprint on first attempt only (captures base prompt structure)
                    if (attempt === 1) {
                        const promptText = prompt.messages.map((m) => m.content).join('\n');
                        const promptHash = createHash('sha256').update(promptText).digest('hex').slice(0, 16);
                        for (let ci = chapterStart; ci <= chapterEnd; ci++) {
                            promptFingerprints.push({ chapter: ci, hash: promptHash, section_sizes: prompt.sectionSizes });
                        }
                    }
                    // Add retry feedback on subsequent attempts
                    if (attempt > 1 && lastBatchErrors.length > 0) {
                        const feedback = buildEnhancedRetryFeedback(lastBatchErrors, inputs.caseData, batchLabel, attempt, maxBatchAttempts, {
                            clueDistribution: inputs.clueDistribution,
                            priorAttemptErrors: attemptErrorHistory,
                        });
                        prompt.messages.push({ role: "user", content: feedback });
                        // Attach previous prose as `assistant` role so Azure content filter does not
                        // re-classify mystery prose paragraphs as harmful user input.
                        if (Array.isArray(lastFailedBatchChapters) && lastFailedBatchChapters.length > 0) {
                            const priorPayload = lastFailedBatchChapters.map((chapter, idx) => ({
                                chapterNumber: chapterStart + idx,
                                title: chapter.title,
                                summary: chapter.summary ?? "",
                                paragraphs: Array.isArray(chapter.paragraphs) ? chapter.paragraphs : [],
                            }));
                            const widenedMessages = prompt.messages;
                            widenedMessages.push({
                                role: "assistant",
                                content: JSON.stringify({ chapters: priorPayload }, null, 2),
                            });
                            widenedMessages.push({
                                role: "user",
                                content: [
                                    "Your draft above is the baseline.",
                                    "Preserve every paragraph that already passes validation verbatim.",
                                    "Only modify passages that directly address the errors listed in the previous message.",
                                ].join(" "),
                            });
                        }
                    }
                    messages = prompt.messages;
                }
                // temperature=0.45: low enough to maintain clue-ID and character-name fidelity,
                // high enough to produce distinct prose across chapters without stylistic collapse.
                // Token budget is length-aware: long stories require ~2400 words/chapter (~3600 prose
                // tokens + JSON envelope), so they get 6 000 tokens per scene.  Short/medium fit
                // comfortably within 4 500 tokens.  Hard caps prevent runaway completions.
                const tokensPerScene = inputs.targetLength === "long" ? 6000 : 4500;
                const response = await client.chat({
                    messages,
                    model: inputs.model,
                    temperature: proseModelConfig.temperature,
                    maxTokens: Math.min(tokensPerScene * batchScenes.length, 20000),
                    jsonMode: true,
                    logContext: {
                        runId: inputs.runId ?? "",
                        projectId: inputs.projectId ?? "",
                        agent: `Agent9-ProseGenerator-Ch${batchLabel}`,
                    },
                });
                const proseBatch = parseProseResponse(response.content);
                validateChapterCount(proseBatch.chapters, batchScenes.length, {
                    targetLength: resolvedTargetLength,
                });
                // Validate each chapter in the batch individually
                let batchErrors = [];
                const provisionalBatchScores = [];
                for (let i = 0; i < proseBatch.chapters.length; i++) {
                    let chapter = enforceMonthSeasonLockOnChapter(sanitizeGeneratedChapter(proseBatch.chapters[i], castNames), temporalSeasonLock);
                    // Deterministic pronoun repair: fix gender-pronoun mismatches before
                    // validation so the retry loop doesn't burn attempts on LLM drift.
                    const pronounRepairResult = repairChapterPronouns(chapter, inputs.cast.characters);
                    if (pronounRepairResult.repairCount > 0) {
                        chapter = { ...chapter, ...pronounRepairResult.chapter };
                        pronounRepairsApplied += pronounRepairResult.repairCount;
                    }
                    proseBatch.chapters[i] = chapter;
                    const chapterNumber = chapterStart + i;
                    const ledgerEntry = chapterRequirementLedger[i];
                    const evaluateCandidate = (candidate, trackUnderflow = true) => {
                        const hardErrors = [];
                        if (!candidate.title || typeof candidate.title !== 'string') {
                            hardErrors.push(`chapter.title is required and must be a string`);
                        }
                        if (!Array.isArray(candidate.paragraphs)) {
                            hardErrors.push(`chapter.paragraphs must be an array`);
                        }
                        else if (candidate.paragraphs.length === 0) {
                            hardErrors.push(`chapter.paragraphs cannot be empty`);
                        }
                        else {
                            candidate.paragraphs.forEach((para, pIdx) => {
                                if (typeof para !== 'string') {
                                    hardErrors.push(`chapter.paragraphs[${pIdx}] must be a string`);
                                }
                            });
                        }
                        const contentValidation = chapterValidator.validateChapter({
                            title: candidate.title,
                            paragraphs: candidate.paragraphs,
                            chapterNumber,
                            totalChapters: sceneCount,
                            temporalMonth: temporalSeasonLock?.month,
                            temporalSeason: temporalSeasonLock?.season,
                        }, inputs.caseData);
                        contentValidation.issues
                            .filter(issue => issue.severity === 'critical' || issue.severity === 'major')
                            .forEach(issue => {
                            hardErrors.push(`Chapter ${chapterNumber}: ${issue.message}${issue.suggestion ? ` (${issue.suggestion})` : ''}`);
                        });
                        const pronounValidation = characterConsistencyValidator.validate({
                            id: inputs.runId ?? "agent9-pronoun-precommit",
                            projectId: inputs.projectId ?? "agent9",
                            scenes: [
                                {
                                    number: chapterNumber,
                                    title: candidate.title || `Chapter ${chapterNumber}`,
                                    text: [candidate.title, ...(candidate.paragraphs ?? [])].join("\n\n"),
                                },
                            ],
                        }, inputs.caseData);
                        pronounValidation.errors
                            .filter((issue) => issue.type === "pronoun_gender_mismatch" && issue.severity === "critical")
                            .forEach((issue) => {
                            hardErrors.push(`Chapter ${chapterNumber}: ${issue.message}${issue.suggestion ? ` (${issue.suggestion})` : ""}`);
                        });
                        const obligations = ledgerEntry
                            ? validateChapterPreCommitObligations(candidate, ledgerEntry, inputs.clueDistribution)
                            : undefined;
                        if (obligations) {
                            hardErrors.push(...obligations.hardFailures);
                            if (trackUnderflow) {
                                if (obligations.wordTarget.isBelowHardFloor) {
                                    hardFloorMissCount += 1;
                                    hardFloorMissChapters.add(chapterNumber);
                                }
                                if (obligations.wordTarget.isBelowPreferred) {
                                    preferredTargetMissCount += 1;
                                    preferredTargetMissChapters.add(chapterNumber);
                                }
                            }
                        }
                        const missingClueIds = obligations?.missingRequiredClueIds ?? [];
                        const hasOnlyHardFloorUnderflow = hardErrors.length > 0 &&
                            hardErrors.every((error) => /word count below hard floor/i.test(error));
                        return {
                            hardErrors,
                            missingClueIds,
                            contentValidation,
                            hasOnlyHardFloorUnderflow,
                        };
                    };
                    let evaluation = evaluateCandidate(chapter, true);
                    // Option B/C: obligation-first repair pass when required clue obligations are missing.
                    if (ledgerEntry) {
                        const initialMissingClueIds = [...evaluation.missingClueIds];
                        let missingClueIds = [...initialMissingClueIds];
                        let chapterRepairPassesExecuted = 0;
                        if (initialMissingClueIds.length > 0) {
                            mandatoryRepairTriggered += 1;
                        }
                        for (let repairPass = 1; repairPass <= 2 && missingClueIds.length > 0; repairPass += 1) {
                            chapterRepairPassesExecuted += 1;
                            mandatoryRepairExecuted += 1;
                            try {
                                const repaired = await attemptClueObligationRepair(client, chapter, chapterNumber, batchScenes[i], ledgerEntry, missingClueIds, inputs.clueDistribution, repairPass > 1, inputs.model, inputs.runId, inputs.projectId, inputs.cast.characters);
                                chapter = enforceMonthSeasonLockOnChapter(sanitizeGeneratedChapter(repaired, castNames), temporalSeasonLock);
                                const clueRepairPronounResult = repairChapterPronouns(chapter, inputs.cast.characters);
                                if (clueRepairPronounResult.repairCount > 0) {
                                    chapter = { ...chapter, ...clueRepairPronounResult.chapter };
                                    pronounRepairsApplied += clueRepairPronounResult.repairCount;
                                }
                                proseBatch.chapters[i] = chapter;
                                evaluation = evaluateCandidate(chapter, false);
                                const remainingMissingClueIds = evaluation.missingClueIds;
                                if (remainingMissingClueIds.length === 0) {
                                    break;
                                }
                                if (repairPass > 1 && remainingMissingClueIds.length >= missingClueIds.length) {
                                    break;
                                }
                                missingClueIds = remainingMissingClueIds;
                            }
                            catch {
                                // Keep existing chapter/evaluation so normal retry flow still captures failures.
                                break;
                            }
                        }
                        if (initialMissingClueIds.length > 0 && chapterRepairPassesExecuted === 0) {
                            mandatoryRepairInvariantViolations += 1;
                            evaluation.hardErrors.push(`Chapter ${chapterNumber}: mandatory clue-obligation repair was not executed before retry continuation`);
                        }
                    }
                    // Option D: If hard-floor underflow is the only blocker, attempt a chapter-local expansion
                    // before failing the whole batch retry cycle.
                    if (evaluation.hasOnlyHardFloorUnderflow && ledgerEntry) {
                        underflowExpansionAttempts += 1;
                        try {
                            const expanded = await attemptUnderflowExpansion(client, chapter, chapterNumber, batchScenes[i], ledgerEntry, inputs.model, inputs.runId, inputs.projectId, undefined, inputs.cast.characters);
                            chapter = enforceMonthSeasonLockOnChapter(sanitizeGeneratedChapter(expanded, castNames), temporalSeasonLock);
                            const expandPronounResult = repairChapterPronouns(chapter, inputs.cast.characters);
                            if (expandPronounResult.repairCount > 0) {
                                chapter = { ...chapter, ...expandPronounResult.chapter };
                                pronounRepairsApplied += expandPronounResult.repairCount;
                            }
                            proseBatch.chapters[i] = chapter;
                            evaluation = evaluateCandidate(chapter, false);
                            if (evaluation.hasOnlyHardFloorUnderflow || evaluation.hardErrors.length > 0) {
                                underflowExpansionFailed += 1;
                            }
                            else {
                                underflowExpansionRecovered += 1;
                            }
                        }
                        catch {
                            underflowExpansionFailed += 1;
                        }
                    }
                    // Option E: If all hard errors are cleared but the chapter is below preferred target,
                    // attempt expansion to reach the preferred word count.
                    if (evaluation.hardErrors.length === 0 && ledgerEntry) {
                        const chapterTextForPreferred = (chapter.paragraphs ?? []).join(" ");
                        const currentWordsForPreferred = countWords(chapterTextForPreferred);
                        if (currentWordsForPreferred < ledgerEntry.preferredWords) {
                            preferredExpansionAttempts += 1;
                            try {
                                const expanded = await attemptUnderflowExpansion(client, chapter, chapterNumber, batchScenes[i], ledgerEntry, inputs.model, inputs.runId, inputs.projectId, ledgerEntry.preferredWords, inputs.cast.characters);
                                chapter = enforceMonthSeasonLockOnChapter(sanitizeGeneratedChapter(expanded, castNames), temporalSeasonLock);
                                const prefPronounResult = repairChapterPronouns(chapter, inputs.cast.characters);
                                if (prefPronounResult.repairCount > 0) {
                                    chapter = { ...chapter, ...prefPronounResult.chapter };
                                    pronounRepairsApplied += prefPronounResult.repairCount;
                                }
                                proseBatch.chapters[i] = chapter;
                                // Re-evaluate to confirm no regressions introduced
                                evaluation = evaluateCandidate(chapter, false);
                                const expanded_words = countWords((chapter.paragraphs ?? []).join(" "));
                                if (expanded_words >= ledgerEntry.preferredWords) {
                                    preferredExpansionRecovered += 1;
                                }
                                else {
                                    preferredExpansionFailed += 1;
                                }
                            }
                            catch {
                                preferredExpansionFailed += 1;
                            }
                        }
                    }
                    if (isCluePresenceAdjudicatorShadowEnabled() &&
                        attempt >= maxBatchAttempts &&
                        evaluation.missingClueIds.length > 0) {
                        const chapterText = [chapter.title, ...chapter.paragraphs]
                            .map((value) => String(value || "").trim())
                            .filter(Boolean)
                            .join("\n\n");
                        const clueIdsToAdjudicate = Array.from(new Set(evaluation.missingClueIds)).slice(0, getCluePresenceAdjudicatorMaxIdsPerChapter());
                        for (const missingClueId of clueIdsToAdjudicate) {
                            cluePresenceAdjudicatorCalls += 1;
                            try {
                                const adjudication = await adjudicateCluePresenceShadow(client, chapterText, chapterNumber, missingClueId, inputs.clueDistribution, batchScenes[i], inputs.model, inputs.runId, inputs.projectId);
                                const hasEvidence = adjudication.evidenceSpans.length > 0;
                                const potentialOverride = adjudication.present &&
                                    adjudication.confidence >= getCluePresenceAdjudicatorPotentialOverrideConfidence() &&
                                    hasEvidence;
                                if (potentialOverride) {
                                    cluePresenceAdjudicatorPotentialOverrides += 1;
                                }
                                cluePresenceAdjudicatorTraces.push({
                                    chapter: chapterNumber,
                                    clueId: missingClueId,
                                    present: adjudication.present,
                                    confidence: adjudication.confidence,
                                    evidenceSpans: adjudication.evidenceSpans,
                                    failureMode: adjudication.failureMode,
                                });
                            }
                            catch {
                                cluePresenceAdjudicatorMalformedOutputs += 1;
                                cluePresenceAdjudicatorTraces.push({
                                    chapter: chapterNumber,
                                    clueId: missingClueId,
                                    present: false,
                                    confidence: 0,
                                    evidenceSpans: [],
                                    failureMode: "format_error",
                                    malformedOutput: true,
                                });
                            }
                        }
                    }
                    const chapterErrors = [...evaluation.hardErrors];
                    provisionalBatchScores.push(buildProvisionalChapterScore(chapter, chapterNumber, ledgerEntry, evaluation.contentValidation.issues, inputs.clueDistribution));
                    if (chapterErrors.length > 0) {
                        batchErrors.push(...chapterErrors);
                        chapterValidationHistory.push({ chapterNumber, attempt, errors: chapterErrors });
                    }
                }
                // Online anti-template linter gate before committing this batch.
                proseLinterStats.checksRun += 1;
                const linterIssues = lintBatchProse(proseBatch.chapters, chapters, liveNarrativeState?.usedOpeningStyles ?? [], inputs.templateLinterProfile);
                if (linterIssues.length > 0) {
                    proseLinterStats.failedChecks += 1;
                    if (linterIssues.some((issue) => issue.type === "opening_style_entropy")) {
                        proseLinterStats.openingStyleEntropyFailures += 1;
                    }
                    if (linterIssues.some((issue) => issue.type === "paragraph_fingerprint")) {
                        proseLinterStats.paragraphFingerprintFailures += 1;
                    }
                    if (linterIssues.some((issue) => issue.type === "ngram_overlap")) {
                        proseLinterStats.ngramOverlapFailures += 1;
                    }
                    batchErrors.push(...linterIssues.map((issue) => issue.message));
                }
                const isEntropyOnlyFailure = batchErrors.length > 0 &&
                    linterIssues.length > 0 &&
                    linterIssues.every((issue) => issue.type === "opening_style_entropy") &&
                    batchErrors.every((error) => error.startsWith("Template linter: opening-style entropy too low"));
                if (isEntropyOnlyFailure && attempt >= maxBatchAttempts) {
                    proseLinterStats.openingStyleEntropyBypasses += 1;
                    console.warn(`[Agent 9] Batch ch${batchLabel} exhausted entropy retries; accepting batch with entropy warning to avoid false hard-stop.`);
                    progressCallback('prose', `⚠ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} accepted with residual entropy warning after ${maxBatchAttempts} attempts`, overallProgress);
                    batchErrors = [];
                }
                if (batchErrors.length > 0) {
                    lastFailedBatchChapters = cloneBatchChapters(proseBatch.chapters);
                    const orderedBatchErrors = prioritizeRetryErrors(batchErrors);
                    lastBatchErrors = orderedBatchErrors;
                    attemptErrorHistory.push(orderedBatchErrors);
                    console.warn(`[Agent 9] Batch ch${batchLabel} validation failed (attempt ${attempt}/${maxBatchAttempts}):\n` +
                        orderedBatchErrors.map(e => `  - ${e}`).join('\n'));
                    progressCallback('prose', `❌ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} validation failed (attempt ${attempt}/${maxBatchAttempts}): ${orderedBatchErrors.length} issue(s)`, overallProgress);
                    if (attempt >= maxBatchAttempts) {
                        const errorSummary = orderedBatchErrors.slice(0, 5).join('; ');
                        throw new Error(`Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} failed validation after ${maxBatchAttempts} attempts. Issues: ${errorSummary}` +
                            `${orderedBatchErrors.length > 5 ? ` (and ${orderedBatchErrors.length - 5} more)` : ''}`);
                    }
                    continue;
                }
                provisionalChapterScores.push(...provisionalBatchScores);
                // All chapters in this batch passed validation — commit them
                for (let i = 0; i < proseBatch.chapters.length; i++) {
                    const chapter = isClueIdMarkerModeEnabled()
                        ? stripClueIdMarkersFromChapter(proseBatch.chapters[i])
                        : proseBatch.chapters[i];
                    proseBatch.chapters[i] = chapter;
                    const chapterNumber = chapterStart + i;
                    chapters.push(chapter);
                    // Extract summary immediately so the next batch's prompt has full continuity
                    const summary = extractChapterSummary(chapter, chapterNumber, castNames);
                    chapterSummaries.push(summary);
                }
                if (liveNarrativeState) {
                    liveNarrativeState = updateNSD(liveNarrativeState, proseBatch.chapters, chapterStart);
                }
                // Feed chapter-level deficits forward so chapter N can correct chapter N+1.
                const feedbackFromBatch = provisionalChapterScores
                    .filter((entry) => entry.chapter >= chapterStart && entry.chapter <= chapterEnd)
                    .filter((entry) => entry.deficits.length > 0 || entry.score < 95)
                    .map((entry) => ({
                    fromChapter: entry.chapter,
                    score: entry.score,
                    deficits: entry.deficits,
                    directives: entry.directives,
                }));
                if (feedbackFromBatch.length > 0) {
                    rollingProvisionalFeedback = [...rollingProvisionalFeedback, ...feedbackFromBatch].slice(-4);
                }
                // Notify caller — pass validation issues from any failed attempts so the
                // orchestrator can surface them in the run history panel (§3.2).
                if (inputs.onBatchComplete) {
                    await inputs.onBatchComplete(proseBatch.chapters, chapterStart, chapterEnd, lastBatchErrors);
                }
                batchSuccess = true;
                if (attempt > 1) {
                    console.log(`[Agent 9] Batch ch${batchLabel} validated successfully on attempt ${attempt}`);
                    progressCallback('prose', `✅ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} validated (retry succeeded)`, overallProgress);
                }
                else {
                    progressCallback('prose', `✅ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel}/${sceneCount} validated`, overallProgress);
                }
                break;
            }
            catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                attemptErrorHistory.push([errorMsg]);
                // Detect Azure content-filter rejections. When revision mode triggers the
                // filter (murder-mystery prose in the directive), suppress revision for all
                // remaining attempts so we don't waste cycles on prompts that will be blocked.
                const isContentFilter = /content.management.policy|content_filter|ResponsibleAIPolicyViolation/i.test(errorMsg);
                if (isContentFilter) {
                    suppressRevision = true;
                    // Preserve existing validation errors and chapter context so the next
                    // real attempt gets substantive feedback (e.g. pronoun errors) instead
                    // of a useless content-filter error string.  Only fall back to the
                    // error message when there is no prior validation state to keep.
                    if (lastBatchErrors.length === 0) {
                        lastBatchErrors = [errorMsg];
                    }
                    // Keep lastFailedBatchChapters from the previous validation attempt
                    // (if any) so the fresh-retry path can attach prior prose context.
                    console.warn(`[Agent 9] Content filter hit on batch ch${batchLabel} attempt ${attempt}; suppressing revision mode for remaining attempts.`);
                }
                else {
                    lastBatchErrors = [errorMsg];
                    // Prevent low-signal exception text from driving surgical revision retries.
                    lastFailedBatchChapters = null;
                }
                if (attempt >= maxBatchAttempts) {
                    throw new Error(`Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} generation failed after ${maxBatchAttempts} attempts: ${errorMsg}`);
                }
            }
        }
        if (!batchSuccess) {
            throw new Error(`Failed to generate chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} after all attempts`);
        }
    }
    validateChapterCount(chapters, sceneCount, { targetLength: resolvedTargetLength });
    const durationMs = Date.now() - start;
    const costTracker = client.getCostTracker();
    // Aggregate cost across all per-chapter agent keys (Agent9-ProseGenerator-Ch1, -Ch2, ...)
    const allAgentCosts = costTracker.getSummary().byAgent;
    const cost = Object.entries(allAgentCosts)
        .filter(([key]) => key.startsWith("Agent9-ProseGenerator"))
        .reduce((sum, [, val]) => sum + val, 0);
    const batchesWithRetries = new Set(chapterValidationHistory.map((h) => Math.floor((h.chapterNumber - 1) / batchSize))).size;
    const totalBatches = Math.ceil(sceneCount / batchSize);
    const note = chapterValidationHistory.length > 0
        ? `Generated in scene batches. ${batchesWithRetries} batch(es) required retry for validation.`
        : "Generated in scene batches.";
    const underflow = {
        preferredTargetWords: getChapterWordTargets(resolvedTargetLength).preferredWords,
        hardFloorMisses: hardFloorMissCount,
        hardFloorMissChapters: Array.from(hardFloorMissChapters).sort((a, b) => a - b),
        preferredTargetMisses: preferredTargetMissCount,
        preferredTargetMissChapters: Array.from(preferredTargetMissChapters).sort((a, b) => a - b),
        expansionAttempts: underflowExpansionAttempts,
        expansionRecovered: underflowExpansionRecovered,
        expansionFailed: underflowExpansionFailed,
        preferredExpansionAttempts,
        preferredExpansionRecovered,
        preferredExpansionFailed,
    };
    const cluePresenceAdjudicatorTelemetry = cluePresenceAdjudicatorCalls > 0 || cluePresenceAdjudicatorMalformedOutputs > 0
        ? {
            mode: "shadow",
            calls: cluePresenceAdjudicatorCalls,
            potentialOverrides: cluePresenceAdjudicatorPotentialOverrides,
            malformedOutputs: cluePresenceAdjudicatorMalformedOutputs,
            traces: cluePresenceAdjudicatorTraces,
        }
        : undefined;
    return {
        status: "draft",
        tone: inputs.narrativeStyle,
        chapters,
        cast: inputs.cast.characters.map((c) => c.name),
        note,
        cost,
        durationMs,
        prompt_fingerprints: promptFingerprints.length > 0 ? promptFingerprints : undefined,
        validationDetails: chapterValidationHistory.length > 0 ? {
            totalBatches,
            batchesWithRetries,
            failureHistory: chapterValidationHistory.map(h => ({
                batchIndex: h.chapterNumber - 1,
                chapterRange: `${h.chapterNumber}`,
                attempt: h.attempt,
                errors: h.errors,
            })),
            linter: proseLinterStats,
            underflow,
            mandatoryRepair: {
                triggered: mandatoryRepairTriggered,
                executed: mandatoryRepairExecuted,
                invariantViolations: mandatoryRepairInvariantViolations,
            },
            pronounRepairsApplied,
            cluePresenceAdjudicator: cluePresenceAdjudicatorTelemetry,
            requiredClueIdsByChapter: Array.from(requiredClueIdsByChapter.entries())
                .sort((a, b) => a[0] - b[0])
                .map(([chapter, data]) => ({
                chapter,
                requiredClueIds: data.requiredClueIds,
                normalizedRequiredClueIds: data.normalizedRequiredClueIds,
            })),
            provisionalChapterScores,
        } : (proseLinterStats.checksRun > 0 || mandatoryRepairTriggered > 0) ? {
            totalBatches,
            batchesWithRetries,
            failureHistory: [],
            linter: proseLinterStats,
            underflow,
            mandatoryRepair: {
                triggered: mandatoryRepairTriggered,
                executed: mandatoryRepairExecuted,
                invariantViolations: mandatoryRepairInvariantViolations,
            },
            pronounRepairsApplied,
            cluePresenceAdjudicator: cluePresenceAdjudicatorTelemetry,
            requiredClueIdsByChapter: Array.from(requiredClueIdsByChapter.entries())
                .sort((a, b) => a[0] - b[0])
                .map(([chapter, data]) => ({
                chapter,
                requiredClueIds: data.requiredClueIds,
                normalizedRequiredClueIds: data.normalizedRequiredClueIds,
            })),
            provisionalChapterScores,
        } : undefined,
    };
}
//# sourceMappingURL=agent9-prose.js.map