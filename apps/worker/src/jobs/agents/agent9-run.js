/**
 * Agent 9: Prose Generator
 *
 * Handles:
 * - Prose generation with per-batch NSD tracking and scoring telemetry
 * - Identity continuity repair (targeted and full fallback)
 * - Schema validation repair retry
 * - Full story validation pipeline with targeted repair guardrails
 * - Auto-fix encoding issues
 * - Release gate quality checks (hard stops)
 *
 * Writes to ctx: prose, validationReport, proseScoringSnapshot, proseChapterScores,
 * proseSecondRunChapterScores, prosePassAccounting, proseRewritePassCount,
 * proseRepairPassCount, latestProseScore, nsdTransferTrace
 */
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { generateProse, initNarrativeState, updateNSD, } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { ProseScorer, StoryValidationPipeline, getStoryLengthTargetMetadata, } from "@cml/story-validation";
import { adaptProseForScoring, collectClueEvidenceFromProse, } from "../scoring-adapters/index.js";
import { buildOutlineRepairGuardrails, } from "./shared.js";
// ============================================================================
// Prose text sanitization helpers
// ============================================================================
const proseMojibakeReplacements = [
    [/Ã¢â‚¬â„¢/g, "\u2019"],
    [/Ã¢â‚¬Ëœ/g, "\u2018"],
    // eslint-disable-next-line no-control-regex
    [/Ã¢â‚¬Å"|Ã¢â‚¬\x9d/g, "\u201D"],
    [/Ã¢â‚¬"|Ã¢â‚¬â€/g, "\u2014"],
    [/Ã¢â‚¬â€œ/g, "\u2013"],
    [/Ã¢â‚¬Â¦/g, "\u2026"],
    [/faË†Â§ade|fa\u02c6\u00a7ade/g, "fa\u00e7ade"],
    [/â€™/g, "\u2019"],
    [/â€˜/g, "\u2018"],
    // eslint-disable-next-line no-control-regex
    [/â€œ|â€\x9d/g, "\u201C"],
    [/â€"|â€"/g, "\u2014"],
    [/â€"/g, "\u2013"],
    [/â€¦/g, "\u2026"],
    [/â\u0080\u0099/g, "\u2019"],
    [/â\u0080\u0098/g, "\u2018"],
    [/â\u0080\u009c|â\u0080\u009d/g, "\u201C"],
    [/â\u0080\u0093/g, "\u2013"],
    [/â\u0080\u0094/g, "\u2014"],
    [/â\u0080\u00a6/g, "\u2026"],
    [/â\u0080\u00a2/g, "\u2022"],
    [/Ã\u201a/g, ""],
    [/Â/g, ""],
    [/\uFFFD/g, ""],
];
export const illegalControlCharPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
// persistentMojibakePattern: detects sequences that survived the replacement table above.
// Used as a hard-stop check after the chapter is written to disk — if any of these
// multibyte mojibake fragments appear, the repair table failed and the prose must be rejected.
export const persistentMojibakePattern = /(?:Ã¢â‚¬â„¢|Ã¢â‚¬Ëœ|Ã¢â‚¬Å"|â€™|â€˜|â€œ|â€\x9d|â€"|â€¦|\uFFFD)/; // eslint-disable-line no-control-regex
const normalizeWrappedParagraphText = (text) => {
    const blocks = text
        .replace(/\r\n/g, "\n")
        .split(/\n{2,}/)
        .map((block) => block.replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim())
        .filter((block) => block.length > 0);
    return blocks.join("\n\n");
};
const splitIntoFallbackChunks = (text, maxLength) => {
    const fallbackChunks = [];
    let remaining = text.trim();
    while (remaining.length > maxLength) {
        const splitAt = remaining.lastIndexOf(" ", maxLength);
        const safeSplit = splitAt > Math.floor(maxLength * 0.55) ? splitAt : maxLength;
        fallbackChunks.push(remaining.slice(0, safeSplit).trim());
        remaining = remaining.slice(safeSplit).trim();
    }
    if (remaining.length > 0)
        fallbackChunks.push(remaining);
    return fallbackChunks.filter(Boolean);
};
const splitLongParagraphForReadability = (paragraph, maxLength = 900) => {
    const normalized = paragraph.trim();
    if (!normalized)
        return [];
    if (normalized.length <= maxLength)
        return [normalized];
    const sentences = normalized
        .split(/(?<=[.!?]["'\u201D\u2019]?)\s+(?=[A-Z0-9"\u201C\u2018])/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);
    if (sentences.length <= 1) {
        return splitIntoFallbackChunks(normalized, maxLength);
    }
    const chunks = [];
    let current = "";
    for (const sentence of sentences) {
        const candidate = current ? `${current} ${sentence}` : sentence;
        if (candidate.length > maxLength && current) {
            chunks.push(current);
            current = sentence;
        }
        else {
            current = candidate;
        }
    }
    if (current)
        chunks.push(current);
    if (chunks.length <= 1 && normalized.length > maxLength) {
        return splitIntoFallbackChunks(normalized, maxLength);
    }
    return chunks;
};
export const sanitizeProseText = (value) => {
    let text = typeof value === "string" ? value : value == null ? "" : String(value);
    text = text.normalize("NFC");
    for (const [pattern, replacement] of proseMojibakeReplacements) {
        text = text.replace(pattern, replacement);
    }
    return text
        .replace(/^Generated in scene batches\.?$/gim, "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(illegalControlCharPattern, "")
        .replace(/\u00A0/g, " ")
        .replace(/\t/g, " ")
        .replace(/\r\n/g, "\n")
        // Dialogue punctuation normalization
        .replace(/"([^"]*)"/g, "\u201C$1\u201D")
        .replace(/(\w)'(\w)/g, "$1\u2019$2")
        .replace(/--/g, "\u2014")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\s+$/gm, "")
        .trim();
};
const enforceReadableParagraphFlow = (paragraphs) => {
    let normalized = paragraphs
        .map((paragraph) => normalizeWrappedParagraphText(sanitizeProseText(paragraph)))
        .flatMap((paragraph) => paragraph.split(/\n{2,}/))
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph.length > 0)
        .flatMap((paragraph) => splitLongParagraphForReadability(paragraph));
    let guard = 0;
    while (normalized.length < 3 && guard < 4) {
        const longestIndex = normalized.reduce((bestIdx, paragraph, idx, arr) => paragraph.length > arr[bestIdx].length ? idx : bestIdx, 0);
        const longest = normalized[longestIndex] ?? "";
        if (longest.length < 500)
            break;
        const splitChunks = splitLongParagraphForReadability(longest, Math.max(280, Math.floor(longest.length / 2)));
        if (splitChunks.length <= 1)
            break;
        normalized = [
            ...normalized.slice(0, longestIndex),
            ...splitChunks,
            ...normalized.slice(longestIndex + 1),
        ];
        guard += 1;
    }
    return normalized;
};
const buildDeterministicGroundingLead = (chapterIndex, locationProfiles) => {
    const primary = locationProfiles.primary;
    const keyLocations = locationProfiles.keyLocations || [];
    const target = keyLocations.length > 0 ? keyLocations[chapterIndex % keyLocations.length] : undefined;
    const locationName = target?.name || primary?.name || "the estate";
    const place = primary?.place ? ` in ${primary.place}` : "";
    const country = primary?.country ? `, ${primary.country}` : "";
    const weather = locationProfiles.atmosphere?.weather || "rain";
    const mood = locationProfiles.atmosphere?.mood || "tense";
    const smells = target?.sensoryDetails?.smells || [];
    const sounds = target?.sensoryDetails?.sounds || [];
    const tactile = target?.sensoryDetails?.tactile || [];
    const smell = (smells[0] || "old timber and damp stone").replace(/\.$/, "");
    const sound = (sounds[0] || "the sound of the wind in the corridor").replace(/\.$/, "");
    const touch = (tactile[0] || "the cold banister and rough wallpaper").replace(/\.$/, "");
    const leadTemplates = [
        `${locationName}${place}${country} carried ${weather.toLowerCase()} in every corridor; ${sound} drifted past, and ${touch} made the ${mood.toLowerCase()} mood impossible to ignore.`,
        `Under ${weather.toLowerCase()} skies, ${locationName}${place}${country} felt sharply ${mood.toLowerCase()}; ${sound} lingered while ${smell} clung to coats and curtains.`,
        `By the time they reached ${locationName}${place}${country}, ${sound} had become a constant undertone, and ${touch} left the room feeling quietly ${mood.toLowerCase()}.`,
        `In ${locationName}${place}${country}, ${smell} and ${sound} met at the doorway, and even ${touch} seemed to signal a ${mood.toLowerCase()} turn in events.`,
        `${locationName}${place}${country} met them with ${weather.toLowerCase()} and ${smell}; ${sound} threaded through the scene, and ${touch} sharpened the ${mood.toLowerCase()} tension.`,
    ];
    return sanitizeProseText(leadTemplates[chapterIndex % leadTemplates.length]);
};
const templateLeakageScaffoldPattern = /at\s+the\s+[a-z][\s\S]{0,120}the\s+smell\s+of[\s\S]{20,300}?atmosphere\s+ripe\s+for\s+revelation\.?/i;
const normalizeParagraphForLeakageDedup = (paragraph) => paragraph.replace(/\s+/g, " ").trim().toLowerCase();
const getGroundingSignals = (opening, anchors) => {
    const normalized = opening.toLowerCase();
    const hasAnchor = anchors.some((anchor) => normalized.includes(anchor));
    const sensoryCount = (normalized.match(/\b(smell|scent|odor|fragrance|sound|echo|silence|whisper|creak|cold|warm|damp|rough|smooth|glow|shadow|flicker|dim)\b/gi) || []).length;
    const hasAtmosphere = /\b(rain|wind|fog|storm|mist|thunder|evening|morning|night|dawn|dusk|lighting|season|weather)\b/i.test(normalized);
    return { hasAnchor, sensoryCount, hasAtmosphere };
};
export const applyDeterministicProsePostProcessing = (prose, locationProfiles) => {
    const anchors = [];
    if (locationProfiles.primary?.name)
        anchors.push(locationProfiles.primary.name.toLowerCase());
    (locationProfiles.keyLocations || []).forEach((loc) => {
        if (loc?.name)
            anchors.push(String(loc.name).toLowerCase());
    });
    const seenLongParagraphs = new Set();
    return {
        ...prose,
        chapters: prose.chapters.map((chapter, index) => {
            const readableParagraphs = enforceReadableParagraphFlow(chapter.paragraphs || []);
            const opening = readableParagraphs.slice(0, 2).join(" ");
            const signals = getGroundingSignals(opening, anchors);
            const needsGroundingLead = !signals.hasAnchor || signals.sensoryCount < 2 || !signals.hasAtmosphere;
            const groundedParagraphs = needsGroundingLead
                ? [buildDeterministicGroundingLead(index, locationProfiles), ...readableParagraphs]
                : readableParagraphs;
            const sanitizedParagraphs = groundedParagraphs
                .map((paragraph, paragraphIndex) => {
                const cleaned = sanitizeProseText(paragraph);
                if (templateLeakageScaffoldPattern.test(cleaned)) {
                    return buildDeterministicGroundingLead(index + paragraphIndex, locationProfiles);
                }
                return cleaned;
            })
                .filter((paragraph) => paragraph.length > 0);
            const leakageDedupedParagraphs = sanitizedParagraphs.map((paragraph, paragraphIndex) => {
                const normalized = normalizeParagraphForLeakageDedup(paragraph);
                if (normalized.length < 170) {
                    return paragraph;
                }
                if (!seenLongParagraphs.has(normalized)) {
                    seenLongParagraphs.add(normalized);
                    return paragraph;
                }
                return buildDeterministicGroundingLead(index + paragraphIndex + 1, locationProfiles);
            });
            return {
                ...chapter,
                paragraphs: leakageDedupedParagraphs,
            };
        }),
    };
};
const chapterHeadingPrefixPattern = /^\s*chapter\s+\d+\s*:\s*/i;
export const normalizeChapterTitle = (value) => {
    const sanitized = sanitizeProseText(value);
    let title = sanitized;
    let guard = 0;
    while (chapterHeadingPrefixPattern.test(title) && guard < 4) {
        title = title.replace(chapterHeadingPrefixPattern, "").trim();
        guard += 1;
    }
    return title.replace(/^[:\-\s]+/, "").trim();
};
export const sanitizeProseResult = (prose) => ({
    ...prose,
    note: prose.note ? sanitizeProseText(prose.note) || undefined : prose.note,
    chapters: prose.chapters.map((chapter, index) => ({
        ...chapter,
        title: normalizeChapterTitle(chapter.title) || `Chapter ${index + 1}`,
        summary: chapter.summary ? sanitizeProseText(chapter.summary) || undefined : chapter.summary,
        paragraphs: chapter.paragraphs
            .map((paragraph) => normalizeWrappedParagraphText(sanitizeProseText(paragraph)))
            .filter((p) => p.length > 0),
    })),
});
// ============================================================================
// Identity alias detection
// ============================================================================
export const detectIdentityAliasBreaks = (prose, cml) => {
    const cmlCase = cml?.CASE ?? {};
    const culprits = Array.isArray(cmlCase?.culpability?.culprits)
        ? cmlCase.culpability.culprits
        : [];
    if (culprits.length === 0) {
        return [];
    }
    const confessionOrArrest = /\b(confess(?:ed|ion)|admitted\s+it|under\s+arrest|arrested|revealed\s+the\s+culprit)\b/i;
    const roleOnlyAlias = /\b(the\s+(killer|murderer|culprit|criminal))\b/i;
    const issues = [];
    let revealChapter = -1;
    for (let index = 0; index < prose.chapters.length; index += 1) {
        const chapter = prose.chapters[index];
        const chapterText = chapter.paragraphs.join("\n");
        if (revealChapter < 0 && confessionOrArrest.test(chapterText)) {
            revealChapter = index;
            continue;
        }
        if (revealChapter >= 0 && index > revealChapter) {
            const mentionsCulpritByName = culprits.some((name) => chapterText.includes(name));
            if (roleOnlyAlias.test(chapterText) && !mentionsCulpritByName) {
                issues.push({
                    chapterIndex: index,
                    message: `Chapter ${index + 1} uses role-only culprit aliases without stable culprit name references`,
                });
            }
        }
    }
    return issues;
};
export const buildNarrativeSubsetForChapterIndexes = (narrative, chapterIndexes) => {
    const normalizedIndexes = Array.from(new Set(chapterIndexes.filter((idx) => idx >= 0))).sort((a, b) => a - b);
    const indexSet = new Set(normalizedIndexes);
    let runningIndex = 0;
    const subsetActs = (narrative.acts ?? [])
        .map((act) => {
        const scenes = Array.isArray(act?.scenes) ? act.scenes : [];
        const keptScenes = [];
        scenes.forEach((scene) => {
            if (indexSet.has(runningIndex)) {
                keptScenes.push(scene);
            }
            runningIndex += 1;
        });
        if (keptScenes.length === 0) {
            return null;
        }
        const estimatedWordCount = keptScenes.reduce((sum, scene) => {
            const words = Number(scene?.estimatedWordCount ?? 0);
            return sum + (Number.isFinite(words) ? words : 0);
        }, 0);
        return { ...act, scenes: keptScenes, estimatedWordCount };
    })
        .filter(Boolean);
    const estimatedTotalWords = subsetActs.reduce((sum, act) => {
        const words = Number(act?.estimatedWordCount ?? 0);
        return sum + (Number.isFinite(words) ? words : 0);
    }, 0);
    return {
        ...narrative,
        acts: subsetActs,
        totalScenes: normalizedIndexes.length,
        estimatedTotalWords,
    };
};
// ============================================================================
// Clue visibility
// ============================================================================
export const getExpectedClueIdsForVisibility = (cmlCase, clueDistribution) => {
    const mappingIds = (cmlCase?.prose_requirements?.clue_to_scene_mapping ?? [])
        .map((entry) => String(entry?.clue_id || ""))
        .filter(Boolean);
    const distributionIds = (clueDistribution?.clues ?? [])
        .map((entry) => String(entry?.id || ""))
        .filter(Boolean);
    const discriminatingIds = (cmlCase?.discriminating_test?.evidence_clues ?? [])
        .map((entry) => String(entry || ""))
        .filter(Boolean);
    const registryIds = (cmlCase?.clue_registry ?? [])
        .map((entry) => String(entry?.clue_id || entry?.id || ""))
        .filter(Boolean);
    return Array.from(new Set([...mappingIds, ...distributionIds, ...discriminatingIds, ...registryIds]));
};
// ============================================================================
// Validation error classification
// ============================================================================
const normalizeValidationErrorKey = (value) => (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
const matchesValidationAliases = (value, aliases) => {
    const normalizedValue = normalizeValidationErrorKey(value);
    return aliases.some((alias) => normalizeValidationErrorKey(alias) === normalizedValue);
};
const DISCRIMINATING_TEST_ALIAS_KEYS = [
    "missing_discriminating_test",
    "cml_test_not_realized",
    "discriminating_test_missing",
];
const SUSPECT_CLOSURE_ALIAS_KEYS = [
    "suspect_closure_missing",
    "suspect_elimination_coverage_incomplete",
    "suspect_elimination_missing",
    "suspect_clearance_missing",
];
const CULPRIT_EVIDENCE_CHAIN_ALIAS_KEYS = [
    "culprit_evidence_chain_missing",
    "culprit_chain_missing",
    "culprit_evidence_missing",
    "culprit_link_missing",
];
const DISCRIMINATING_TEST_MESSAGE_RE = /(discriminating\s+test|re-?enactment|timing\s+test|constraint\s+proof|test\s+scene)/i;
const SUSPECT_CLOSURE_MESSAGE_RE = /(suspect\s+(eliminat|clos|clear)|ruled\s+out|alibi\s+confirm|suspect\s+coverage)/i;
const CULPRIT_CHAIN_MESSAGE_RE = /(culprit\s+.*evidence\s+chain|evidence\s+chain\s+.*culprit|culprit\s+.*non-ambiguous\s+evidence)/i;
export const isDiscriminatingTestCoverageError = (error) => matchesValidationAliases(error.type, DISCRIMINATING_TEST_ALIAS_KEYS) ||
    DISCRIMINATING_TEST_MESSAGE_RE.test(error.message || "");
export const isSuspectClosureCoverageError = (error) => matchesValidationAliases(error.type, SUSPECT_CLOSURE_ALIAS_KEYS) ||
    SUSPECT_CLOSURE_MESSAGE_RE.test(error.message || "");
export const isCulpritEvidenceChainCoverageError = (error) => matchesValidationAliases(error.type, CULPRIT_EVIDENCE_CHAIN_ALIAS_KEYS) ||
    CULPRIT_CHAIN_MESSAGE_RE.test(error.message || "");
export const isSuspectEliminationCoverageError = (error) => isSuspectClosureCoverageError(error) || isCulpritEvidenceChainCoverageError(error);
// ============================================================================
// Release gate evaluation helpers
// ============================================================================
const evaluateProseReadability = (prose) => {
    let denseChapterCount = 0;
    let underParagraphCount = 0;
    let severeParagraphBlocks = 0;
    prose.chapters.forEach((chapter) => {
        const paragraphs = chapter.paragraphs || [];
        if (paragraphs.length < 3) {
            underParagraphCount += 1;
            denseChapterCount += 1;
        }
        const overlong = paragraphs.filter((paragraph) => paragraph.length > 2400).length;
        if (overlong > 0) {
            severeParagraphBlocks += overlong;
            denseChapterCount += 1;
        }
    });
    return { denseChapterCount, underParagraphCount, severeParagraphBlocks };
};
const evaluateSceneGroundingCoverage = (prose, locationProfiles) => {
    const knownAnchors = new Set();
    if (locationProfiles.primary?.name)
        knownAnchors.add(locationProfiles.primary.name.toLowerCase());
    (locationProfiles.keyLocations || []).forEach((loc) => {
        if (loc?.name)
            knownAnchors.add(String(loc.name).toLowerCase());
    });
    const sensoryTerms = /\b(smell|scent|odor|fragrance|sound|echo|silence|whisper|creak|cold|warm|damp|rough|smooth|glow|shadow|flicker|dim)\b/gi;
    const atmosphereTerms = /\b(rain|wind|fog|storm|mist|thunder|evening|morning|night|dawn|dusk|lighting|season|weather)\b/i;
    let grounded = 0;
    prose.chapters.forEach((chapter) => {
        const opening = chapter.paragraphs.slice(0, 2).join(" ").toLowerCase();
        const hasAnchor = Array.from(knownAnchors).some((anchor) => opening.includes(anchor));
        const sensoryCount = (opening.match(sensoryTerms) || []).length;
        const hasAtmosphere = atmosphereTerms.test(opening);
        if (hasAnchor && sensoryCount >= 2 && hasAtmosphere) {
            grounded += 1;
        }
    });
    const coverage = prose.chapters.length > 0 ? grounded / prose.chapters.length : 0;
    return { grounded, total: prose.chapters.length, coverage };
};
const evaluateTemplateLeakage = (prose) => {
    const normalizedParagraphs = prose.chapters.flatMap((chapter) => (chapter.paragraphs || [])
        .map((paragraph) => paragraph.replace(/\s+/g, " ").trim().toLowerCase())
        .filter((paragraph) => paragraph.length >= 170));
    const seen = new Set();
    const duplicated = new Set();
    normalizedParagraphs.forEach((paragraph) => {
        if (seen.has(paragraph))
            duplicated.add(paragraph);
        seen.add(paragraph);
    });
    const scaffoldPattern = /at\s+the\s+[a-z][\s\S]{0,120}the\s+smell\s+of[\s\S]{20,300}?atmosphere\s+ripe\s+for\s+revelation\.?/i;
    const scaffoldCount = prose.chapters.reduce((count, chapter) => {
        const text = (chapter.paragraphs || []).join(" ");
        return count + (scaffoldPattern.test(text) ? 1 : 0);
    }, 0);
    return {
        duplicatedLongParagraphCount: duplicated.size,
        scaffoldCount,
        hasLeakage: duplicated.size > 0 || scaffoldCount > 0,
    };
};
const evaluateSensoryVariety = (prose) => {
    const ATMOSPHERIC_TOKENS = [
        /smell of \w[\w\s]{2,30}/gi,
        /scent of \w[\w\s]{2,30}/gi,
        /air (?:thick|heavy|laden|filled|carrying) with \w[\w\s]{2,25}/gi,
        /(?:overcast|grey|gray) skies?/gi,
        /rain (?:tapping|pattering|drumming|falling)/gi,
        /tension[ ,](?:pressed|hung|filled|lay)/gi,
        /(?:polished wood|tobacco|mildew|damp|musty|smoky) (?:filled|hung|permeated|clung)/gi,
        /tick(?:ing)? (?:of (?:the )?clock|clock)/gi,
        /dim(?:ly)? (?:lit|illuminated)/gi,
    ];
    const totalChapters = prose.chapters.length;
    if (totalChapters < 3)
        return { overusedPhrases: [], hasExcessiveRepetition: false };
    const phraseToChapterCount = new Map();
    for (const chapter of prose.chapters) {
        const text = (chapter.paragraphs || []).join(" ");
        const matchedThisChapter = new Set();
        for (const pattern of ATMOSPHERIC_TOKENS) {
            const matches = text.match(pattern) ?? [];
            for (const rawMatch of matches) {
                const normalised = rawMatch.toLowerCase().trim().slice(0, 60);
                if (!matchedThisChapter.has(normalised)) {
                    matchedThisChapter.add(normalised);
                    phraseToChapterCount.set(normalised, (phraseToChapterCount.get(normalised) ?? 0) + 1);
                }
            }
        }
    }
    // 40% chapter threshold: a sensory phrase that appears in more than 40% of chapters
    // suggests the LLM is templating atmosphere rather than generating fresh imagery.
    // Fewer than 3 chapters gives insufficient signal to measure repetition.
    const threshold = Math.floor(totalChapters * 0.4);
    const overused = [];
    for (const [phrase, count] of phraseToChapterCount.entries()) {
        if (count > threshold)
            overused.push(`"${phrase}" (${count}/${totalChapters} chapters)`);
    }
    return { overusedPhrases: overused, hasExcessiveRepetition: overused.length > 0 };
};
const evaluateTemporalConsistency = (prose, temporalContext) => {
    const month = temporalContext?.specificDate?.month?.toLowerCase();
    if (!month) {
        return { contradictions: 0, details: [] };
    }
    const monthToSeason = {
        january: "winter", february: "winter", march: "spring", april: "spring",
        may: "spring", june: "summer", july: "summer", august: "summer",
        september: "autumn", october: "autumn", november: "autumn", december: "winter",
    };
    const seasonRegex = {
        spring: /\b(spring|vernal)\b/i,
        summer: /\b(summer|midsummer)\b/i,
        autumn: /\b(autumn|fall)\b/i,
        winter: /\b(winter|wintry)\b/i,
    };
    const expected = monthToSeason[month];
    if (!expected) {
        return { contradictions: 0, details: [] };
    }
    const details = [];
    prose.chapters.forEach((chapter, idx) => {
        const opening = (chapter.paragraphs || []).slice(0, 2).join(" ");
        const lowered = opening.toLowerCase();
        if (!new RegExp(`\\b${month}\\b`, "i").test(lowered)) {
            return;
        }
        Object.keys(seasonRegex).forEach((season) => {
            if (season !== expected && seasonRegex[season].test(lowered)) {
                details.push(`chapter ${idx + 1}: ${month} with ${season}`);
            }
        });
    });
    return { contradictions: details.length, details };
};
const placeholderRoleSurnamePattern = /\b(a|an)\s+(inspector|detective|constable|sergeant|captain|gentleman|lady|woman|man|doctor)\s+([A-Z][a-z]+(?:[-''][A-Z][a-z]+)?)\b/g;
const placeholderNamedStandalonePattern = /\b(a woman [A-Z][a-z]+|a man [A-Z][a-z]+)\b/g;
const placeholderGenericRolePattern = /\b(a gentleman|an inspector|a detective|a constable|a sergeant|a captain|a doctor)\b/gi;
const evaluatePlaceholderLeakage = (prose) => {
    const joined = prose.chapters
        .map((chapter) => {
        const body = (chapter.paragraphs || []).join("\n");
        return `${chapter.title}\n${chapter.summary ?? ""}\n${body}`;
    })
        .join("\n\n");
    const roleSurnameMatches = Array.from(joined.matchAll(placeholderRoleSurnamePattern)).map((match) => match[0]);
    const namedStandaloneMatches = Array.from(joined.matchAll(placeholderNamedStandalonePattern)).map((match) => match[0]);
    const genericRoleMatches = joined.match(placeholderGenericRolePattern) || [];
    const uniqueRoleSurnameMatches = Array.from(new Set(roleSurnameMatches));
    return {
        roleSurnameCount: roleSurnameMatches.length,
        standaloneCount: namedStandaloneMatches.length,
        genericRoleCount: genericRoleMatches.length,
        examples: uniqueRoleSurnameMatches.slice(0, 5),
        severeLeakage: roleSurnameMatches.length > 0 || namedStandaloneMatches.length >= 2,
        hasLeakage: roleSurnameMatches.length > 0 ||
            namedStandaloneMatches.length > 0 ||
            genericRoleMatches.length >= 12,
    };
};
const evaluateChapterHeadingArtifacts = (prose) => {
    const offending = prose.chapters.filter((chapter) => chapterHeadingPrefixPattern.test(chapter.title || ""));
    return { duplicatedHeadingCount: offending.length, hasArtifacts: offending.length > 0 };
};
// ============================================================================
// Writing guides loader (uses workspaceRoot from ctx — not import.meta.url)
// ============================================================================
const loadWritingGuides = (workspaceRoot) => {
    const guides = {};
    const notesDir = join(workspaceRoot, "notes");
    try {
        const humourPath = join(notesDir, "DEFINITIVE_GUIDE_TO_HUMOUR.md");
        if (existsSync(humourPath)) {
            guides.humour = readFileSync(humourPath, "utf8");
        }
    }
    catch { /* optional guide */ }
    try {
        const craftPath = join(notesDir, "WHAT_MAKES_A_GOOD_WHODUNNIT.md");
        if (existsSync(craftPath)) {
            guides.craft = readFileSync(craftPath, "utf8");
        }
    }
    catch { /* optional guide */ }
    return guides;
};
// ============================================================================
// runAgent9
// ============================================================================
export async function runAgent9(ctx) {
    const { client, inputs, runId, projectId, reportProgress, savePartialReport, enableScoring, scoreAggregator, scoringLogger, workspaceRoot, } = ctx;
    const cml = ctx.cml;
    const cast = ctx.cast;
    const characterProfiles = ctx.characterProfiles;
    const locationProfiles = ctx.locationProfiles;
    const temporalContext = ctx.temporalContext;
    const hardLogicDevices = ctx.hardLogicDevices;
    const narrative = ctx.narrative;
    const clues = ctx.clues;
    const coverageResult = ctx.coverageResult;
    const outlineCoverageIssues = ctx.outlineCoverageIssues;
    const fairPlayAudit = ctx.fairPlayAudit;
    reportProgress("prose", "Generating prose chapter by chapter with per-chapter validation...", 91);
    const baselineProseGuardrails = [
        "Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.",
        "Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.",
        "In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).",
    ];
    let prose;
    const totalSceneCount = narrative.acts?.flatMap((a) => a.scenes || []).length || 0;
    const moralAmbiguityNote = hardLogicDevices.devices[0]?.moralAmbiguity;
    const proseLockedFacts = hardLogicDevices.devices[0]?.lockedFacts;
    const characterGenderMap = Object.fromEntries(cast.cast.characters.map((c) => [c.name, c.gender ?? "non-binary"]));
    let narrativeState = initNarrativeState(proseLockedFacts ?? [], characterGenderMap);
    const prosePhaseStartTime = Date.now();
    const proseDeployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME_PROSE ||
        process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    const proseModelOverride = proseDeployment
        ? { model: proseDeployment }
        : {};
    const pushProsePassAccounting = (passType, durationMs, cost, chaptersGenerated) => {
        ctx.prosePassAccounting.push({
            pass_type: passType,
            duration_ms: durationMs,
            cost,
            chapters_generated: chaptersGenerated,
        });
    };
    const computeProseChapterScoreSeries = async (chaptersToScore) => {
        if (!enableScoring || !scoreAggregator || chaptersToScore.length === 0)
            return [];
        try {
            const scorer = new ProseScorer();
            const batchSize = Math.max(1, Math.min(inputs.proseBatchSize ?? 1, 10));
            const series = [];
            const accumulated = [];
            const totalChapters = totalSceneCount || chaptersToScore.length;
            for (let i = 0; i < chaptersToScore.length; i += batchSize) {
                const batch = chaptersToScore.slice(i, i + batchSize);
                accumulated.push(...batch);
                const adaptedBatch = adaptProseForScoring(batch, cml.CASE, clues);
                const batchScore = await scorer.score({}, adaptedBatch, {
                    previous_phases: {
                        agent2_cast: cast.cast,
                        agent2b_character_profiles: characterProfiles.profiles,
                        agent2c_location_profiles: locationProfiles,
                    },
                    cml,
                    threshold_config: { mode: "standard" },
                    targetLength: inputs.targetLength ?? "medium",
                    partialGeneration: true,
                });
                const adaptedAll = adaptProseForScoring(accumulated, cml.CASE, clues);
                const cumulativeScore = await scorer.score({}, adaptedAll, {
                    previous_phases: {
                        agent2_cast: cast.cast,
                        agent2b_character_profiles: characterProfiles.profiles,
                        agent2c_location_profiles: locationProfiles,
                    },
                    cml,
                    threshold_config: { mode: "standard" },
                    targetLength: inputs.targetLength ?? "medium",
                    partialGeneration: true,
                });
                series.push({
                    chapter: Math.min(i + batch.length, totalChapters),
                    total_chapters: totalChapters,
                    individual_score: Math.round(batchScore.total ?? 0),
                    cumulative_score: Math.round(cumulativeScore.total ?? 0),
                    individual_validation_score: Math.round(batchScore.validation_score ?? 0),
                    individual_quality_score: Math.round(batchScore.quality_score ?? 0),
                    individual_completeness_score: Math.round(batchScore.completeness_score ?? 0),
                    individual_consistency_score: Math.round(batchScore.consistency_score ?? 0),
                    cumulative_validation_score: Math.round(cumulativeScore.validation_score ?? 0),
                    cumulative_quality_score: Math.round(cumulativeScore.quality_score ?? 0),
                    cumulative_completeness_score: Math.round(cumulativeScore.completeness_score ?? 0),
                    cumulative_consistency_score: Math.round(cumulativeScore.consistency_score ?? 0),
                });
            }
            return series;
        }
        catch {
            return [];
        }
    };
    const rescoreAgent9ProsePhase = async () => {
        if (!enableScoring || !scoreAggregator)
            return;
        try {
            const secondRunSeries = await computeProseChapterScoreSeries(prose.chapters);
            if (ctx.proseSecondRunChapterScores.length === 0 && secondRunSeries.length > 0) {
                ctx.proseSecondRunChapterScores = secondRunSeries;
            }
            const reAdaptedProse = adaptProseForScoring(prose.chapters, cml.CASE, clues);
            const reScoreProse = await new ProseScorer().score({}, reAdaptedProse, {
                previous_phases: {
                    agent2_cast: cast.cast,
                    agent2b_character_profiles: characterProfiles.profiles,
                    agent2c_location_profiles: locationProfiles,
                },
                cml,
                targetLength: inputs.targetLength ?? "medium",
                threshold_config: { mode: "standard" },
            });
            if (ctx.proseChapterScores.length > 0) {
                reScoreProse.breakdown = {
                    chapter_scores: [...ctx.proseChapterScores],
                    repair_chapter_scores: [...ctx.proseSecondRunChapterScores],
                };
            }
            ctx.latestProseScore = reScoreProse;
            scoreAggregator.upsertPhaseScore("agent9_prose", "Prose Generation", reScoreProse, ctx.agentDurations["agent9_prose"] ?? 0, ctx.agentCosts["agent9_prose"] ?? 0);
        }
        catch {
            // Re-scoring is best-effort; never abort generation
        }
    };
    const proseStart = Date.now();
    ctx.proseScoringSnapshot.startedAtMs = proseStart;
    const accumulatedChapters = [];
    prose = await generateProse(client, {
        caseData: cml,
        outline: narrative,
        cast: cast.cast,
        ...proseModelOverride,
        detectiveType: inputs.detectiveType,
        characterProfiles: characterProfiles,
        locationProfiles: locationProfiles,
        temporalContext: temporalContext,
        moralAmbiguityNote,
        lockedFacts: proseLockedFacts,
        clueDistribution: clues,
        narrativeState,
        targetLength: inputs.targetLength,
        narrativeStyle: inputs.narrativeStyle,
        qualityGuardrails: [
            ...baselineProseGuardrails,
            ...(outlineCoverageIssues.length > 0
                ? buildOutlineRepairGuardrails(outlineCoverageIssues, cml)
                : []),
        ],
        writingGuides: loadWritingGuides(workspaceRoot),
        runId,
        projectId: projectId || "",
        onProgress: (phase, message, percentage) => reportProgress(phase, message, percentage),
        batchSize: inputs.proseBatchSize,
        onBatchComplete: async (batchChapters, batchStart, batchEnd, validationIssues) => {
            const nsdBefore = {
                used_opening_styles_tail: [...narrativeState.usedOpeningStyles],
                used_sensory_phrases_tail: [...narrativeState.usedSensoryPhrases],
                clues_revealed_to_reader: [...narrativeState.cluesRevealedToReader],
                chapter_summary_count: narrativeState.chapterSummaries.length,
            };
            narrativeState = updateNSD(narrativeState, batchChapters, batchStart);
            const allOutlineScenes = (narrative.acts ?? []).flatMap((a) => a.scenes || []);
            const batchRevealedIds = allOutlineScenes
                .filter((s) => s.sceneNumber >= batchStart && s.sceneNumber <= batchEnd)
                .flatMap((s) => (Array.isArray(s.cluesRevealed) ? s.cluesRevealed : []));
            const newlyRevealedClues = batchRevealedIds.filter((id) => !nsdBefore.clues_revealed_to_reader.includes(id));
            const batchClueEvidence = collectClueEvidenceFromProse(batchChapters, cml.CASE, clues);
            const clueEvidenceAnchors = newlyRevealedClues.flatMap((clueId) => batchClueEvidence.evidenceByClue[clueId] ?? []);
            const clueStateById = Object.fromEntries(newlyRevealedClues.map((clueId) => [
                clueId,
                batchClueEvidence.clueStateById[clueId] ?? "introduced",
            ]));
            if (batchRevealedIds.length > 0) {
                const merged = [...new Set([...narrativeState.cluesRevealedToReader, ...batchRevealedIds])];
                narrativeState = { ...narrativeState, cluesRevealedToReader: merged };
            }
            const cluesWithNoAnchor = newlyRevealedClues.filter((clueId) => (batchClueEvidence.evidenceByClue[clueId] ?? []).length === 0);
            if (cluesWithNoAnchor.length > 0) {
                ctx.warnings.push(`NSD batch ${batchStart}-${batchEnd}: clue(s) marked revealed but no prose evidence anchor found: ${cluesWithNoAnchor.join(", ")}. Fair-play verification may be incomplete.`);
            }
            ctx.nsdTransferTrace.push({
                batch_start: batchStart,
                batch_end: batchEnd,
                chapters_generated: batchChapters.length,
                validation_issue_count: validationIssues?.length ?? 0,
                validation_issue_samples: (validationIssues ?? []).slice(0, 3),
                newly_revealed_clue_ids: [...new Set(newlyRevealedClues)],
                clue_state_by_id: clueStateById,
                clue_evidence_anchors: clueEvidenceAnchors,
                before: nsdBefore,
                after: {
                    used_opening_styles_tail: [...narrativeState.usedOpeningStyles],
                    used_sensory_phrases_tail: [...narrativeState.usedSensoryPhrases],
                    clues_revealed_to_reader: [...narrativeState.cluesRevealedToReader],
                    chapter_summary_count: narrativeState.chapterSummaries.length,
                },
            });
            const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;
            if (enableScoring && scoreAggregator && scoringLogger) {
                accumulatedChapters.push(...batchChapters);
                try {
                    const scorer = new ProseScorer();
                    const adaptedBatch = adaptProseForScoring(batchChapters, cml.CASE, clues);
                    const batchScore = await scorer.score({}, adaptedBatch, {
                        previous_phases: {
                            agent2_cast: cast.cast,
                            agent2b_character_profiles: characterProfiles.profiles,
                            agent2c_location_profiles: locationProfiles,
                        },
                        cml,
                        threshold_config: { mode: "standard" },
                        targetLength: inputs.targetLength ?? "medium",
                        partialGeneration: true,
                    });
                    const adaptedAll = adaptProseForScoring(accumulatedChapters, cml.CASE, clues);
                    const partialScore = await scorer.score({}, adaptedAll, {
                        previous_phases: {
                            agent2_cast: cast.cast,
                            agent2b_character_profiles: characterProfiles.profiles,
                            agent2c_location_profiles: locationProfiles,
                        },
                        cml,
                        threshold_config: { mode: "standard" },
                        targetLength: inputs.targetLength ?? "medium",
                        partialGeneration: true,
                    });
                    const individualPct = Math.round(batchScore.total ?? 0);
                    const pct = Math.round(partialScore.total ?? 0);
                    const elapsedMs = Date.now() - prosePhaseStartTime;
                    ctx.proseChapterScores.push({
                        chapter: batchEnd,
                        total_chapters: totalSceneCount,
                        individual_score: individualPct,
                        cumulative_score: pct,
                        individual_validation_score: Math.round(batchScore.validation_score ?? 0),
                        individual_quality_score: Math.round(batchScore.quality_score ?? 0),
                        individual_completeness_score: Math.round(batchScore.completeness_score ?? 0),
                        individual_consistency_score: Math.round(batchScore.consistency_score ?? 0),
                        cumulative_validation_score: Math.round(partialScore.validation_score ?? 0),
                        cumulative_quality_score: Math.round(partialScore.quality_score ?? 0),
                        cumulative_completeness_score: Math.round(partialScore.completeness_score ?? 0),
                        cumulative_consistency_score: Math.round(partialScore.consistency_score ?? 0),
                    });
                    ctx.proseScoringSnapshot.chaptersGenerated = batchEnd;
                    ctx.proseScoringSnapshot.latestChapterScore = individualPct;
                    ctx.proseScoringSnapshot.latestCumulativeScore = pct;
                    const scoreWithBreakdown = {
                        ...partialScore,
                        breakdown: { chapter_scores: [...ctx.proseChapterScores] },
                    };
                    scoreAggregator.upsertPhaseScore("agent9_prose", "Prose Generation", scoreWithBreakdown, elapsedMs, 0);
                    await savePartialReport();
                    reportProgress("prose", `Chapter ${chapterLabel} complete \u00b7 chapter: ${individualPct}/100 \u00b7 cumulative: ${pct}/100`, 91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3));
                }
                catch {
                    reportProgress("prose", `Chapter ${chapterLabel} complete`, 91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3));
                }
            }
            else {
                reportProgress("prose", `Chapter ${chapterLabel} complete`, 91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3));
            }
            if (validationIssues && validationIssues.length > 0) {
                const issueRange = batchEnd > batchStart ? `${batchStart}-${batchEnd}` : `${batchEnd}`;
                reportProgress("prose", `\u26a0 Chapter${batchEnd > batchStart ? "s" : ""} ${issueRange} required retry \u2014 ${validationIssues.length} issue${validationIssues.length !== 1 ? "s" : ""}: ${validationIssues.slice(0, 2).join("; ")}${validationIssues.length > 2 ? ` (+${validationIssues.length - 2} more)` : ""}`, 91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3));
            }
        },
    });
    prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles);
    const proseFirstPassDurationMs = Date.now() - proseStart;
    const proseFirstPassCost = prose.cost;
    ctx.agentCosts["agent9_prose"] = proseFirstPassCost;
    ctx.agentDurations["agent9_prose"] = proseFirstPassDurationMs;
    pushProsePassAccounting("first_pass", proseFirstPassDurationMs, proseFirstPassCost, prose.chapters.length);
    // Closure — captures prose, ctx, and first-pass timing locals
    const buildPostGenerationSummaryDetails = (score, finalized) => ({
        ...(() => {
            const targetMeta = getStoryLengthTargetMetadata(inputs.targetLength ?? "medium");
            const chaptersGeneratedCommitted = prose.chapters.length;
            const expectedChaptersTotal = targetMeta.target.chapters;
            const chaptersFailedUncommitted = Math.max(0, expectedChaptersTotal - chaptersGeneratedCommitted);
            const underflow = prose.validationDetails?.underflow;
            const hardFloorMissCount = Number.isFinite(underflow?.hardFloorMisses)
                ? Number(underflow.hardFloorMisses)
                : 0;
            const preferredTargetMissCount = Number.isFinite(underflow?.preferredTargetMisses)
                ? Number(underflow.preferredTargetMisses)
                : 0;
            const hardFloorMissChapters = Array.isArray(underflow?.hardFloorMissChapters)
                ? underflow.hardFloorMissChapters
                : [];
            const preferredTargetMissChapters = Array.isArray(underflow?.preferredTargetMissChapters)
                ? underflow.preferredTargetMissChapters
                : [];
            const chaptersWithWordMiss = new Set([...hardFloorMissChapters, ...preferredTargetMissChapters]
                .filter((value) => typeof value === "number" && Number.isFinite(value)));
            const chaptersWordPassCount = Math.max(0, chaptersGeneratedCommitted - chaptersWithWordMiss.size);
            const failedUncommittedChapterRanges = chaptersFailedUncommitted > 0
                ? [
                    {
                        start: chaptersGeneratedCommitted + 1,
                        end: expectedChaptersTotal,
                    },
                ]
                : [];
            const runState = finalized
                ? (chaptersFailedUncommitted > 0 ? "partial_generation" : "complete")
                : "in_progress";
            const storyWordsTotal = prose.chapters.reduce((sum, chapter) => {
                const chapterText = Array.isArray(chapter?.paragraphs)
                    ? chapter.paragraphs.join(" ")
                    : "";
                const words = chapterText.trim().split(/\s+/).filter(Boolean).length;
                return sum + words;
            }, 0);
            const hardFloorFromFailures = (() => {
                const failureHistory = (prose.validationDetails?.failureHistory ?? []);
                const values = failureHistory
                    .flatMap((failure) => (Array.isArray(failure.errors) ? failure.errors : []))
                    .flatMap((error) => {
                    const match = /word count below hard floor \(\d+\/(\d+)\)/i.exec(error);
                    return match ? [Number(match[1])] : [];
                })
                    .filter((value) => Number.isFinite(value));
                if (values.length === 0)
                    return null;
                return Math.max(...values);
            })();
            return {
                // Canonical phase-2 naming
                expected_chapters_total: expectedChaptersTotal,
                chapters_generated_committed: chaptersGeneratedCommitted,
                chapters_failed_uncommitted: chaptersFailedUncommitted,
                story_words_total: storyWordsTotal,
                chapter_words_hard_floor: hardFloorFromFailures,
                chapter_words_preferred_target: Number.isFinite(underflow?.preferredTargetWords)
                    ? Number(underflow.preferredTargetWords)
                    : null,
                count_reconciliation: {
                    target_contract_source: targetMeta.source,
                    target_contract_fingerprint: targetMeta.fingerprint,
                    expected_chapters_total: expectedChaptersTotal,
                    chapters_generated_committed: chaptersGeneratedCommitted,
                    chapters_failed_uncommitted: chaptersFailedUncommitted,
                    failed_uncommitted_chapter_ranges: failedUncommittedChapterRanges,
                    chapter_word_buckets: {
                        hard_floor_miss_count: hardFloorMissCount,
                        preferred_target_miss_count: preferredTargetMissCount,
                        pass_count: chaptersWordPassCount,
                    },
                    run_state: runState,
                },
                // Legacy compatibility aliases
                target_contract_source: targetMeta.source,
                target_contract_fingerprint: targetMeta.fingerprint,
                target_length: targetMeta.target_length,
                expected_scene_count: targetMeta.target.scenes,
                expected_chapter_count: targetMeta.target.chapters,
                expected_story_min_words: targetMeta.target.minWords,
                expected_story_max_words: targetMeta.target.maxWords,
                expected_chapter_min_words: targetMeta.target.chapterMinWords,
            };
        })(),
        ...(() => {
            const fairPlay = adaptProseForScoring(prose.chapters, cml.CASE, clues)
                .fair_play_validation;
            const clueEvidence = collectClueEvidenceFromProse(prose.chapters, cml.CASE, clues);
            const expectedClueIds = getExpectedClueIdsForVisibility(cml.CASE, clues);
            const extractedClueIds = clueEvidence.visibleClueIds;
            const missingExpectedClueIds = expectedClueIds.filter((id) => !extractedClueIds.includes(id));
            const unexpectedExtractedClueIds = extractedClueIds.filter((id) => !expectedClueIds.includes(id));
            const fairPlayComponentScore = (fairPlay?.all_clues_visible ? 40 : 0) +
                (fairPlay?.discriminating_test_complete ? 40 : 0) +
                (fairPlay?.no_solution_spoilers ? 20 : 0);
            return {
                fair_play_all_clues_visible: fairPlay?.all_clues_visible ?? null,
                fair_play_discriminating_test_complete: fairPlay?.discriminating_test_complete ?? null,
                fair_play_no_solution_spoilers: fairPlay?.no_solution_spoilers ?? null,
                fair_play_component_score: fairPlay ? fairPlayComponentScore : null,
                clue_visibility_expected_ids: expectedClueIds,
                clue_visibility_extracted_ids: extractedClueIds,
                clue_visibility_missing_expected_ids: missingExpectedClueIds,
                clue_visibility_unexpected_extracted_ids: unexpectedExtractedClueIds,
                clue_visibility_expected_count: expectedClueIds.length,
                clue_visibility_extracted_count: extractedClueIds.length,
            };
        })(),
        ...(() => {
            const linter = prose.validationDetails?.linter;
            const underflow = prose.validationDetails?.underflow;
            const requiredClueIdsByChapter = Array.isArray(prose.validationDetails?.requiredClueIdsByChapter)
                ? prose.validationDetails.requiredClueIdsByChapter
                : [];
            return {
                template_linter_checks_run: linter?.checksRun ?? 0,
                template_linter_failed_checks: linter?.failedChecks ?? 0,
                template_linter_opening_style_entropy_failures: linter?.openingStyleEntropyFailures ?? 0,
                template_linter_opening_style_entropy_bypasses: linter?.openingStyleEntropyBypasses ?? 0,
                template_linter_paragraph_fingerprint_failures: linter?.paragraphFingerprintFailures ?? 0,
                template_linter_ngram_overlap_failures: linter?.ngramOverlapFailures ?? 0,
                // Canonical + compatibility underflow telemetry
                chapter_words_hard_floor_miss_count: underflow?.hardFloorMisses ?? 0,
                chapter_words_preferred_target_miss_count: underflow?.preferredTargetMisses ?? 0,
                chapters_with_hard_floor_miss: underflow?.hardFloorMissChapters ?? [],
                chapters_with_preferred_target_miss: underflow?.preferredTargetMissChapters ?? [],
                word_underflow_hard_floor_misses: underflow?.hardFloorMisses ?? 0,
                word_underflow_hard_floor_chapters: underflow?.hardFloorMissChapters ?? [],
                word_underflow_preferred_target_misses: underflow?.preferredTargetMisses ?? 0,
                word_underflow_preferred_target_chapters: underflow?.preferredTargetMissChapters ?? [],
                clue_obligation_required_ids_by_chapter: requiredClueIdsByChapter.map((entry) => ({
                    chapter: entry?.chapter,
                    required_clue_ids: Array.isArray(entry?.requiredClueIds)
                        ? entry.requiredClueIds
                        : [],
                })),
                clue_obligation_normalized_required_ids_by_chapter: requiredClueIdsByChapter.map((entry) => ({
                    chapter: entry?.chapter,
                    normalized_required_clue_ids: Array.isArray(entry?.normalizedRequiredClueIds)
                        ? entry.normalizedRequiredClueIds
                        : [],
                })),
            };
        })(),
        score_total: score?.total ?? null,
        score_grade: score?.grade ?? null,
        score_passed_threshold: score
            ? scoreAggregator?.passesThreshold(score) ?? false
            : null,
        component_failures: score?.component_failures ?? [],
        failure_reason: score?.failure_reason ?? null,
        // Legacy compatibility alias
        chapters_generated: prose.chapters.length,
        prose_duration_ms_first_pass: proseFirstPassDurationMs,
        prose_duration_ms_total: ctx.agentDurations["agent9_prose"] ?? 0,
        prose_cost_first_pass: proseFirstPassCost,
        prose_cost_total: ctx.agentCosts["agent9_prose"] ?? 0,
        rewrite_pass_count: ctx.proseRewritePassCount,
        repair_pass_count: ctx.proseRepairPassCount,
        per_pass_accounting: ctx.prosePassAccounting,
        metrics_snapshot: finalized ? "final" : "initial",
        batch_size: inputs.proseBatchSize ?? 1,
        batches_with_retries: prose.validationDetails?.batchesWithRetries ?? 0,
        total_batches: prose.validationDetails?.totalBatches ?? 0,
        mandatory_clue_repair_triggered: prose.validationDetails?.mandatoryRepair?.triggered ?? 0,
        mandatory_clue_repair_executed: prose.validationDetails?.mandatoryRepair?.executed ?? 0,
        mandatory_clue_repair_invariant_violations: prose.validationDetails?.mandatoryRepair?.invariantViolations ?? 0,
        batch_failure_events: prose.validationDetails?.failureHistory?.length ?? 0,
        batch_failure_history: (prose.validationDetails?.failureHistory ?? []).map((failure) => ({
            chapter_range: failure.chapterRange,
            attempt: failure.attempt,
            errors: failure.errors,
        })),
        ...(() => {
            const failureHistory = (prose.validationDetails?.failureHistory ?? []);
            const obligationCountsByRange = new Map();
            const hardFloorCountsByRange = new Map();
            for (const failure of failureHistory) {
                const chapterRange = String(failure.chapterRange ?? "unknown");
                const errors = Array.isArray(failure.errors) ? failure.errors : [];
                const missingClueIds = Array.from(new Set(errors.flatMap((error) => {
                    if (!/missing required clue obligation/i.test(error)) {
                        return [];
                    }
                    const matches = Array.from(error.matchAll(/"([^"]+)"/g));
                    return matches.map((match) => String(match[1] ?? "")).filter(Boolean);
                })));
                if (missingClueIds.length > 0) {
                    const clueCounts = obligationCountsByRange.get(chapterRange) ?? new Map();
                    missingClueIds.forEach((clueId) => {
                        clueCounts.set(clueId, (clueCounts.get(clueId) ?? 0) + 1);
                    });
                    obligationCountsByRange.set(chapterRange, clueCounts);
                }
                if (errors.some((error) => /word count below hard floor/i.test(error))) {
                    hardFloorCountsByRange.set(chapterRange, (hardFloorCountsByRange.get(chapterRange) ?? 0) + 1);
                }
            }
            const persistentClueObligationRanges = Array.from(obligationCountsByRange.entries())
                .map(([chapterRange, clueCounts]) => ({
                chapter_range: chapterRange,
                clue_ids: Array.from(clueCounts.entries())
                    .filter(([, count]) => count >= 2)
                    .map(([clueId]) => clueId),
            }))
                .filter((entry) => entry.clue_ids.length > 0);
            const persistentHardFloorRanges = Array.from(hardFloorCountsByRange.entries())
                .filter(([, count]) => count >= 2)
                .map(([chapterRange, count]) => ({
                chapter_range: chapterRange,
                attempts: count,
            }));
            return {
                persistent_clue_obligation_ranges: persistentClueObligationRanges,
                persistent_clue_obligation_range_count: persistentClueObligationRanges.length,
                persistent_hard_floor_ranges: persistentHardFloorRanges,
            };
        })(),
        batch_failure_samples: (prose.validationDetails?.failureHistory ?? [])
            .slice(0, 3)
            .map((failure) => ({
            chapter_range: failure.chapterRange,
            attempt: failure.attempt,
            errors: failure.errors,
        })),
        outline_coverage_issue_count: outlineCoverageIssues.length,
        critical_clue_coverage_gap: coverageResult.hasCriticalGaps,
        nsd_transfer_steps: ctx.nsdTransferTrace.length,
        nsd_transfer_trace: ctx.nsdTransferTrace,
    });
    // First-pass scoring
    if (enableScoring && scoreAggregator && scoringLogger) {
        const scorer = new ProseScorer();
        const adapted = adaptProseForScoring(prose.chapters, cml.CASE, clues);
        const score = await scorer.score({}, adapted, {
            previous_phases: {
                agent2_cast: cast.cast,
                agent2b_character_profiles: characterProfiles.profiles,
                agent2c_location_profiles: locationProfiles,
            },
            cml,
            threshold_config: { mode: "standard" },
            targetLength: inputs.targetLength ?? "medium",
        });
        ctx.latestProseScore = score;
        if (ctx.proseChapterScores.length > 0 && !score.breakdown) {
            score.breakdown = { chapter_scores: [...ctx.proseChapterScores] };
        }
        scoreAggregator.upsertPhaseScore("agent9_prose", "Prose Generation", score, ctx.agentDurations["agent9_prose"] ?? 0, ctx.agentCosts["agent9_prose"] ?? 0);
        scoringLogger.logPhaseScore("agent9_prose", "Prose Generation", score, ctx.agentDurations["agent9_prose"] ?? 0, ctx.agentCosts["agent9_prose"] ?? 0, runId, projectId || "");
        await savePartialReport();
        if (!scoreAggregator.passesThreshold(score)) {
            ctx.warnings.push(`Prose Generation: scored ${score.total}/100 (${score.grade}) below threshold; skipping full-phase retry and continuing with targeted validation/repair guardrails`);
        }
        const postGenerationSummaryDetails = buildPostGenerationSummaryDetails(score, false);
        scoringLogger.logPhaseDiagnostic("agent9_prose", "Prose Generation", "post_generation_summary", postGenerationSummaryDetails, runId, projectId || "");
        scoreAggregator.upsertDiagnostic("agent9_prose_post_generation_summary", "agent9_prose", "Prose Generation", "post_generation_summary", postGenerationSummaryDetails);
        ctx.proseScoringSnapshot.postGenerationSummaryLogged = true;
        // E5: Emit prompt fingerprints for per-chapter prompt traceability
        if (Array.isArray(prose.prompt_fingerprints) && prose.prompt_fingerprints.length > 0) {
            scoreAggregator.upsertDiagnostic("agent9_prose_prompt_fingerprints", "agent9_prose", "Prose Generation", "prompt_fingerprints", {
                chapter_count: prose.prompt_fingerprints.length,
                fingerprints: prose.prompt_fingerprints,
            });
        }
    }
    // ============================================================================
    // Identity continuity check
    // ============================================================================
    const identityAliasIssues = detectIdentityAliasBreaks(prose, cml);
    if (identityAliasIssues.length > 0) {
        ctx.warnings.push("Agent 9: Identity continuity guardrail detected role-alias drift; regenerating prose once");
        identityAliasIssues.forEach((issue) => ctx.warnings.push(`  - ${issue.message}`));
        const issueChapterIndexes = Array.from(new Set(identityAliasIssues
            .map((issue) => issue.chapterIndex)
            .filter((idx) => idx >= 0 && idx < prose.chapters.length))).sort((a, b) => a - b);
        // 40% threshold: if fewer than 40% of chapters have alias issues, targeted repair is
        // cheaper than a full regeneration.  Above that, a full re-write produces cleaner results
        // than patching a majority of chapters.
        const targetedFixThreshold = Math.max(1, Math.ceil(prose.chapters.length * 0.4));
        const canTargetedRepair = issueChapterIndexes.length > 0 &&
            issueChapterIndexes.length <= targetedFixThreshold;
        if (canTargetedRepair) {
            const targetLabels = issueChapterIndexes.map((idx) => String(idx + 1)).join(", ");
            ctx.warnings.push(`Agent 9: Targeted identity repair for chapter(s): ${targetLabels}`);
            const targetedOutline = buildNarrativeSubsetForChapterIndexes(narrative, issueChapterIndexes);
            const proseRetryStart = Date.now();
            reportProgress("prose", `Regenerating ${issueChapterIndexes.length} chapter(s) due to identity drift...`, 92);
            const targetedProse = await generateProse(client, {
                caseData: cml,
                outline: targetedOutline,
                cast: cast.cast,
                ...proseModelOverride,
                detectiveType: inputs.detectiveType,
                characterProfiles: characterProfiles,
                locationProfiles: locationProfiles,
                temporalContext: temporalContext,
                moralAmbiguityNote,
                lockedFacts: proseLockedFacts,
                clueDistribution: clues,
                narrativeState,
                targetLength: inputs.targetLength,
                narrativeStyle: inputs.narrativeStyle,
                qualityGuardrails: baselineProseGuardrails,
                writingGuides: loadWritingGuides(workspaceRoot),
                runId,
                projectId: projectId || "",
                onProgress: (phase, message, percentage) => reportProgress(phase, message, percentage),
                batchSize: Math.max(1, Math.min(inputs.proseBatchSize ?? 1, issueChapterIndexes.length)),
                onBatchComplete: (_batchChapters, batchStart, batchEnd) => {
                    reportProgress("prose", `[Identity targeted fix] Chapter batch ${batchStart}-${batchEnd} complete`, 92);
                },
            });
            const sanitizedTargeted = applyDeterministicProsePostProcessing(sanitizeProseResult(targetedProse), locationProfiles);
            if (sanitizedTargeted.chapters.length === issueChapterIndexes.length) {
                issueChapterIndexes.forEach((chapterIndex, i) => {
                    prose.chapters[chapterIndex] = sanitizedTargeted.chapters[i];
                });
                prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles);
                ctx.warnings.push(`Agent 9: Targeted identity repair replaced ${issueChapterIndexes.length} chapter(s) without full regeneration`);
            }
            else {
                ctx.warnings.push(`Agent 9: Targeted identity repair returned unexpected chapter count (${sanitizedTargeted.chapters.length}/${issueChapterIndexes.length}); falling back to full regeneration`);
            }
            ctx.agentCosts["agent9_prose"] =
                (ctx.agentCosts["agent9_prose"] || 0) + targetedProse.cost;
            ctx.agentDurations["agent9_prose"] =
                (ctx.agentDurations["agent9_prose"] || 0) + (Date.now() - proseRetryStart);
            ctx.proseRewritePassCount += 1;
            pushProsePassAccounting("identity_targeted_repair", Date.now() - proseRetryStart, targetedProse.cost, targetedProse.chapters.length);
        }
        else {
            ctx.warnings.push(`Agent 9: Identity drift impacted ${issueChapterIndexes.length} chapter(s), exceeding targeted-repair threshold (${targetedFixThreshold}); using full prose regeneration fallback`);
        }
        let retryIdentityIssues = detectIdentityAliasBreaks(prose, cml);
        if (retryIdentityIssues.length > 0) {
            const proseRetryStart = Date.now();
            reportProgress("prose", "Regenerating all prose due to residual identity drift...", 92);
            const retriedProse = await generateProse(client, {
                caseData: cml,
                outline: narrative,
                cast: cast.cast,
                ...proseModelOverride,
                detectiveType: inputs.detectiveType,
                characterProfiles: characterProfiles,
                locationProfiles: locationProfiles,
                temporalContext: temporalContext,
                moralAmbiguityNote,
                lockedFacts: proseLockedFacts,
                clueDistribution: clues,
                narrativeState,
                targetLength: inputs.targetLength,
                narrativeStyle: inputs.narrativeStyle,
                qualityGuardrails: baselineProseGuardrails,
                writingGuides: loadWritingGuides(workspaceRoot),
                runId,
                projectId: projectId || "",
                onProgress: (phase, message, percentage) => reportProgress(phase, message, percentage),
                batchSize: inputs.proseBatchSize,
                onBatchComplete: (_batchChapters, _batchStart, batchEnd) => {
                    const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;
                    reportProgress("prose", `[Identity fallback] Chapter ${chapterLabel} complete`, 92 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 2));
                },
            });
            prose = applyDeterministicProsePostProcessing(sanitizeProseResult(retriedProse), locationProfiles);
            ctx.agentCosts["agent9_prose"] =
                (ctx.agentCosts["agent9_prose"] || 0) + retriedProse.cost;
            ctx.agentDurations["agent9_prose"] =
                (ctx.agentDurations["agent9_prose"] || 0) + (Date.now() - proseRetryStart);
            ctx.proseRewritePassCount += 1;
            pushProsePassAccounting("identity_full_regeneration", Date.now() - proseRetryStart, retriedProse.cost, retriedProse.chapters.length);
            retryIdentityIssues = detectIdentityAliasBreaks(prose, cml);
        }
        if (retryIdentityIssues.length > 0) {
            retryIdentityIssues.forEach((issue) => ctx.errors.push(`Identity continuity failure: ${issue.message}`));
            throw new Error("Prose identity continuity guardrail failed after retry");
        }
        await rescoreAgent9ProsePhase();
    }
    // ============================================================================
    // Surface chapter validation issues
    // ============================================================================
    if (prose.validationDetails && prose.validationDetails.batchesWithRetries > 0) {
        const batchRetryMsg = `Prose generation: ${prose.validationDetails.batchesWithRetries}/${prose.validationDetails.totalBatches} batch(es) required retry due to validation issues`;
        ctx.warnings.push(batchRetryMsg);
        await client.getLogger()?.logError({
            runId,
            projectId,
            agent: "Agent9-ProseGenerator",
            operation: "batch_validation",
            errorMessage: batchRetryMsg,
            metadata: {
                batchesWithRetries: prose.validationDetails.batchesWithRetries,
                totalBatches: prose.validationDetails.totalBatches,
            },
        });
        prose.validationDetails.failureHistory.forEach((failure) => {
            const failureMsg = `  - Chapters ${failure.chapterRange} (attempt ${failure.attempt}): ${failure.errors.join("; ")}`;
            ctx.warnings.push(failureMsg);
            client.getLogger()?.logError({
                runId,
                projectId,
                agent: "Agent9-ProseGenerator",
                operation: "chapter_validation_failure",
                errorMessage: `Chapters ${failure.chapterRange} failed validation`,
                metadata: {
                    chapterRange: failure.chapterRange,
                    attempt: failure.attempt,
                    errors: failure.errors,
                },
            });
        });
        if (outlineCoverageIssues.length > 0) {
            const contextMsg = `  Context: Outline had ${outlineCoverageIssues.length} coverage issue(s) which may have affected prose quality`;
            ctx.warnings.push(contextMsg);
            client.getLogger()?.logError({
                runId,
                projectId,
                agent: "Agent9-ProseGenerator",
                operation: "context_issue",
                errorMessage: contextMsg,
                metadata: { outlineCoverageIssues },
            });
        }
        if (coverageResult.hasCriticalGaps) {
            const contextMsg = `  Context: CML had critical clue coverage gaps which may have affected prose scene content`;
            ctx.warnings.push(contextMsg);
            client.getLogger()?.logError({
                runId,
                projectId,
                agent: "Agent9-ProseGenerator",
                operation: "context_issue",
                errorMessage: contextMsg,
                metadata: { clueCoverageGaps: coverageResult },
            });
        }
    }
    const mandatoryRepairTelemetry = prose.validationDetails?.mandatoryRepair;
    if ((mandatoryRepairTelemetry?.invariantViolations ?? 0) > 0) {
        const invariantMsg = `Mandatory clue-repair invariant violation: ${mandatoryRepairTelemetry.invariantViolations} chapter(s) continued retry flow without executing required chapter-local clue repair`;
        ctx.warnings.push(invariantMsg);
        await client.getLogger()?.logError({
            runId,
            projectId,
            agent: "Agent9-ProseGenerator",
            operation: "mandatory_clue_repair_invariant",
            errorMessage: invariantMsg,
            metadata: {
                triggered: mandatoryRepairTelemetry?.triggered ?? 0,
                executed: mandatoryRepairTelemetry?.executed ?? 0,
                invariantViolations: mandatoryRepairTelemetry?.invariantViolations ?? 0,
            },
        });
    }
    // ============================================================================
    // Prose schema validation
    // ============================================================================
    let proseSchemaValidation = validateArtifact("prose", prose);
    if (!proseSchemaValidation.valid) {
        ctx.warnings.push("Prose artifact failed schema validation on first attempt; retrying prose generation with schema repair guardrails");
        const schemaRepairGuardrails = [
            "Return a valid prose artifact that strictly matches required schema fields and types.",
            ...proseSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
        ];
        const proseSchemaRetryStart = Date.now();
        const retriedProse = await generateProse(client, {
            caseData: cml,
            outline: narrative,
            cast: cast.cast,
            ...proseModelOverride,
            detectiveType: inputs.detectiveType,
            characterProfiles: characterProfiles,
            locationProfiles: locationProfiles,
            temporalContext: temporalContext,
            moralAmbiguityNote,
            lockedFacts: proseLockedFacts,
            clueDistribution: clues,
            narrativeState,
            targetLength: inputs.targetLength,
            narrativeStyle: inputs.narrativeStyle,
            qualityGuardrails: [...baselineProseGuardrails, ...schemaRepairGuardrails],
            writingGuides: loadWritingGuides(workspaceRoot),
            runId,
            projectId: projectId || "",
            onProgress: (phase, message, percentage) => reportProgress(phase, message, percentage),
            batchSize: inputs.proseBatchSize,
            onBatchComplete: (_batchChapters, _batchStart, batchEnd) => {
                const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;
                reportProgress("prose", `[Schema-repair] Chapter ${chapterLabel} complete`, 92 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 2));
            },
        });
        ctx.agentCosts["agent9_prose"] =
            (ctx.agentCosts["agent9_prose"] || 0) + retriedProse.cost;
        ctx.agentDurations["agent9_prose"] =
            (ctx.agentDurations["agent9_prose"] || 0) + (Date.now() - proseSchemaRetryStart);
        ctx.proseRepairPassCount += 1;
        pushProsePassAccounting("schema_repair", Date.now() - proseSchemaRetryStart, retriedProse.cost, retriedProse.chapters.length);
        const retryValidation = validateArtifact("prose", retriedProse);
        if (!retryValidation.valid) {
            retryValidation.errors.forEach((error) => ctx.errors.push(`Prose schema failure: ${error}`));
            throw new Error("Prose artifact failed schema validation");
        }
        prose = applyDeterministicProsePostProcessing(sanitizeProseResult(retriedProse), locationProfiles);
        proseSchemaValidation = retryValidation;
        ctx.warnings.push("Prose schema-repair retry succeeded");
        await rescoreAgent9ProsePhase();
    }
    proseSchemaValidation.warnings.forEach((warning) => ctx.warnings.push(`Prose schema warning: ${warning}`));
    reportProgress("prose", `Prose generated (${prose.chapters.length} chapters)`, 94);
    // ============================================================================
    // Story Validation
    // ============================================================================
    reportProgress("validation", "Starting full-story validation gate...", 96);
    const validationStart = Date.now();
    const validationPipeline = new StoryValidationPipeline(client);
    prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles);
    const storyForValidation = {
        id: runId,
        projectId: projectId || runId,
        scenes: prose.chapters.map((ch, idx) => ({
            number: idx + 1,
            title: ch.title,
            text: ch.paragraphs.join("\n\n"),
        })),
    };
    let validationReport = await validationPipeline.validate(storyForValidation, {
        ...cml,
        lockedFacts: proseLockedFacts ?? [],
    });
    const preRepairValidationSummary = { ...validationReport.summary };
    let postRepairValidationSummary = { ...validationReport.summary };
    ctx.agentDurations["validation"] = Date.now() - validationStart;
    if (validationReport.status === "passed") {
        reportProgress("validation", "Full-story validation passed.", 98);
    }
    else if (validationReport.status === "needs_review") {
        ctx.warnings.push(`Story validation: ${validationReport.status} - ${validationReport.summary.major} major issues`);
        reportProgress("validation", `Full-story validation needs review (${validationReport.summary.major} major issues)`, 98);
    }
    else {
        const validationFailureMsg = "Story validation: " +
            validationReport.status +
            " - " +
            validationReport.summary.critical +
            " critical, " +
            validationReport.summary.major +
            " major issues";
        ctx.warnings.push(validationFailureMsg);
        await client.getLogger()?.logError({
            runId,
            projectId,
            agent: "ValidationPipeline",
            operation: "final_validation",
            errorMessage: validationFailureMsg,
            metadata: { status: validationReport.status, summary: validationReport.summary },
        });
        ctx.warnings.push("═══ PROSE VALIDATION FAILURE DETAILS ═══");
        validationReport.errors.slice(0, 10).forEach((err) => {
            const errMsg = `  [${err.severity}] ${err.type}: ${err.message}`;
            ctx.warnings.push(errMsg);
            client.getLogger()?.logError({
                runId,
                projectId,
                agent: "ValidationPipeline",
                operation: "validation_error",
                errorMessage: err.message,
                metadata: { severity: err.severity, type: err.type, fullError: err },
            });
        });
        if (validationReport.errors.length > 10) {
            const remainingMsg = `  ... and ${validationReport.errors.length - 10} more validation errors`;
            ctx.warnings.push(remainingMsg);
        }
        ctx.warnings.push("═══ CONTRIBUTING FACTORS ═══");
        if (prose.validationDetails && prose.validationDetails.batchesWithRetries > 0) {
            ctx.warnings.push(`  \u2022 Chapter generation: ${prose.validationDetails.batchesWithRetries} batches had validation issues during generation`);
        }
        if (coverageResult.hasCriticalGaps) {
            const gapTypes = [];
            if (coverageResult.issues.some((i) => i.message.includes("inference step")))
                gapTypes.push("inference path coverage");
            if (coverageResult.issues.some((i) => i.message.includes("discriminating test")))
                gapTypes.push("discriminating test evidence");
            if (coverageResult.issues.some((i) => i.message.includes("suspect")))
                gapTypes.push("suspect elimination");
            ctx.warnings.push(`  \u2022 CML clue coverage: Critical gaps in ${gapTypes.join(", ")}`);
        }
        if (outlineCoverageIssues.length > 0) {
            ctx.warnings.push(`  \u2022 Outline: ${outlineCoverageIssues.length} coverage issues`);
        }
        if (fairPlayAudit && fairPlayAudit.overallStatus !== "pass") {
            ctx.warnings.push(`  \u2022 Fair play audit: ${fairPlayAudit.overallStatus} - may indicate structural CML issues`);
        }
        ctx.warnings.push("═══════════════════════════════════════");
        reportProgress("validation", "Full-story validation failed; starting full-prose repair run", 96);
        const repairGuardrailSet = new Set();
        repairGuardrailSet.add("Never use placeholder named role constructions (for example 'Detective Surname', 'Inspector Surname', 'a woman Surname', 'a man Surname'). Use canonical cast names only.");
        repairGuardrailSet.add("Ensure Act III contains explicit suspect-elimination coverage for every non-culprit suspect, each with concrete evidence or confirmed alibi.");
        repairGuardrailSet.add("Each chapter must open and close with distinct phrasing — never reuse sentences, transitions, or descriptive blocks from another chapter in this run.");
        for (const err of validationReport.errors) {
            if (isDiscriminatingTestCoverageError(err)) {
                repairGuardrailSet.add("The prose MUST include a scene where the detective performs a discriminating test (experiment, re-enactment, trap, or timing test) that explicitly rules out or eliminates at least one suspect with on-page evidence and reasoning.");
            }
            if (isSuspectClosureCoverageError(err)) {
                repairGuardrailSet.add("The prose MUST include a scene in which each non-culprit suspect is explicitly cleared (ruled out, eliminated, alibi confirmed) with stated evidence.");
            }
            if (isCulpritEvidenceChainCoverageError(err)) {
                repairGuardrailSet.add("The prose MUST include a scene where the culprit is identified and the full evidence chain (because, therefore, proof) is laid out.");
            }
        }
        const repairGuardrails = Array.from(repairGuardrailSet);
        if (repairGuardrails.length > 0) {
            ctx.warnings.push("Prose repair retry: " + repairGuardrails.length + " guardrails applied");
            reportProgress("prose", "Regenerating prose with targeted guardrails (chapter-granular repair mode)...", 96);
            const proseRepairStart = Date.now();
            let repairNarrativeState = initNarrativeState(proseLockedFacts ?? [], characterGenderMap);
            const repairProseChapterScores = [];
            let accumulatedRepairChapters = [];
            const repairedProse = await generateProse(client, {
                caseData: cml,
                outline: narrative,
                cast: cast.cast,
                ...proseModelOverride,
                detectiveType: inputs.detectiveType,
                characterProfiles: characterProfiles,
                locationProfiles: locationProfiles,
                temporalContext: temporalContext,
                moralAmbiguityNote,
                lockedFacts: proseLockedFacts,
                clueDistribution: clues,
                narrativeState: repairNarrativeState,
                targetLength: inputs.targetLength,
                narrativeStyle: inputs.narrativeStyle,
                qualityGuardrails: repairGuardrails,
                templateLinterProfile: {
                    mode: "repair",
                    entropyThreshold: 0.65,
                    entropyMinWindow: 5,
                    entropyWarmupChapters: 3,
                    chapterOffset: 0,
                },
                writingGuides: loadWritingGuides(workspaceRoot),
                runId,
                projectId: projectId || "",
                onProgress: (phase, message, percentage) => reportProgress(phase, message, percentage),
                batchSize: 1,
                onBatchComplete: async (batchChapters, _batchStart, batchEnd) => {
                    repairNarrativeState = updateNSD(repairNarrativeState, batchChapters, batchEnd - batchChapters.length + 1);
                    accumulatedRepairChapters = [...accumulatedRepairChapters, ...batchChapters];
                    const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;
                    reportProgress("prose", `[Repair] Chapter ${chapterLabel} complete`, 96 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 1));
                    if (enableScoring && scoreAggregator) {
                        try {
                            const repairScorer = new ProseScorer();
                            const adaptedBatch = adaptProseForScoring(batchChapters, cml.CASE, clues);
                            const batchScore = await repairScorer.score({}, adaptedBatch, {
                                previous_phases: {
                                    agent2_cast: cast.cast,
                                    agent2b_character_profiles: characterProfiles.profiles,
                                    agent2c_location_profiles: locationProfiles,
                                },
                                cml,
                                threshold_config: { mode: "standard" },
                                targetLength: inputs.targetLength ?? "medium",
                                partialGeneration: true,
                            });
                            const adaptedAll = adaptProseForScoring(accumulatedRepairChapters, cml.CASE, clues);
                            const cumulScore = await repairScorer.score({}, adaptedAll, {
                                previous_phases: {
                                    agent2_cast: cast.cast,
                                    agent2b_character_profiles: characterProfiles.profiles,
                                    agent2c_location_profiles: locationProfiles,
                                },
                                cml,
                                threshold_config: { mode: "standard" },
                                targetLength: inputs.targetLength ?? "medium",
                                partialGeneration: true,
                            });
                            repairProseChapterScores.push({
                                chapter: batchEnd,
                                total_chapters: totalSceneCount || batchEnd,
                                individual_score: Math.round(batchScore.total ?? 0),
                                cumulative_score: Math.round(cumulScore.total ?? 0),
                                individual_validation_score: Math.round(batchScore.validation_score ?? 0),
                                individual_quality_score: Math.round(batchScore.quality_score ?? 0),
                                individual_completeness_score: Math.round(batchScore.completeness_score ?? 0),
                                individual_consistency_score: Math.round(batchScore.consistency_score ?? 0),
                                cumulative_validation_score: Math.round(cumulScore.validation_score ?? 0),
                                cumulative_quality_score: Math.round(cumulScore.quality_score ?? 0),
                                cumulative_completeness_score: Math.round(cumulScore.completeness_score ?? 0),
                                cumulative_consistency_score: Math.round(cumulScore.consistency_score ?? 0),
                            });
                        }
                        catch {
                            // Best-effort — never abort repair generation
                        }
                    }
                },
            }, 3);
            prose = applyDeterministicProsePostProcessing(sanitizeProseResult(repairedProse), locationProfiles);
            ctx.agentCosts["agent9_prose"] =
                (ctx.agentCosts["agent9_prose"] || 0) + repairedProse.cost;
            ctx.agentDurations["agent9_prose"] =
                (ctx.agentDurations["agent9_prose"] || 0) + (Date.now() - proseRepairStart);
            ctx.proseRepairPassCount += 1;
            pushProsePassAccounting("validation_repair", Date.now() - proseRepairStart, repairedProse.cost, repairedProse.chapters.length);
            if (enableScoring && scoreAggregator && repairProseChapterScores.length > 0) {
                try {
                    const repairScorer = new ProseScorer();
                    const repairAdapted = adaptProseForScoring(prose.chapters, cml.CASE, clues);
                    const repairFinalScore = await repairScorer.score({}, repairAdapted, {
                        previous_phases: {
                            agent2_cast: cast.cast,
                            agent2b_character_profiles: characterProfiles.profiles,
                            agent2c_location_profiles: locationProfiles,
                        },
                        cml,
                        threshold_config: { mode: "standard" },
                        targetLength: inputs.targetLength ?? "medium",
                    });
                    ctx.latestProseScore = repairFinalScore;
                    if (ctx.proseSecondRunChapterScores.length === 0) {
                        ctx.proseSecondRunChapterScores = [...repairProseChapterScores];
                    }
                    repairFinalScore.breakdown = {
                        chapter_scores: [...ctx.proseChapterScores],
                        repair_chapter_scores: [...ctx.proseSecondRunChapterScores],
                    };
                    scoreAggregator.upsertPhaseScore("agent9_prose", "Prose Generation", repairFinalScore, ctx.agentDurations["agent9_prose"] ?? 0, ctx.agentCosts["agent9_prose"] ?? 0);
                    await savePartialReport();
                }
                catch {
                    // Best-effort
                }
            }
            const repairedStory = {
                id: runId,
                projectId: projectId || runId,
                scenes: prose.chapters.map((ch, idx) => ({
                    number: idx + 1,
                    title: ch.title,
                    text: ch.paragraphs.join("\n\n"),
                })),
            };
            validationReport = await validationPipeline.validate(repairedStory, {
                ...cml,
                lockedFacts: proseLockedFacts ?? [],
            });
            postRepairValidationSummary = { ...validationReport.summary };
            if (validationReport.status === "passed" ||
                validationReport.status === "needs_review") {
                ctx.warnings.push("Prose repair retry improved validation to: " + validationReport.status);
                reportProgress("validation", "Full-story validation after repair: " + validationReport.status, 97);
            }
            else {
                ctx.warnings.push("Prose repair retry did not fully resolve validation: " +
                    validationReport.status);
                reportProgress("validation", "Full-story validation still " + validationReport.status + " after repair", 97);
            }
        }
        else {
            ctx.warnings.push("Story validation failed but no recoverable error types found");
        }
        reportProgress("validation", "Full-story validation result: " + validationReport.status, 98);
    }
    // ============================================================================
    // Auto-fix encoding issues
    // ============================================================================
    const fixedStory = validationPipeline.autoFix(storyForValidation);
    let encodingFixesApplied = false;
    for (let i = 0; i < fixedStory.scenes.length; i++) {
        if (fixedStory.scenes[i].text !== storyForValidation.scenes[i].text) {
            encodingFixesApplied = true;
            const fixedParagraphs = fixedStory.scenes[i].text.split("\n\n");
            prose.chapters[i] = {
                ...prose.chapters[i],
                paragraphs: fixedParagraphs,
            };
        }
    }
    if (encodingFixesApplied) {
        reportProgress("validation", "Applied auto-fixes for encoding issues", 99);
    }
    prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles);
    if (enableScoring && scoreAggregator && scoringLogger) {
        const finalizedPostGenerationDetails = buildPostGenerationSummaryDetails(ctx.latestProseScore, true);
        scoringLogger.logPhaseDiagnostic("agent9_prose", "Prose Generation", "post_generation_summary", finalizedPostGenerationDetails, runId, projectId || "");
        scoreAggregator.upsertDiagnostic("agent9_prose_post_generation_summary", "agent9_prose", "Prose Generation", "post_generation_summary", finalizedPostGenerationDetails);
        ctx.proseScoringSnapshot.postGenerationSummaryLogged = true;
    }
    // ============================================================================
    // Release Gate
    // ============================================================================
    // Two levels of release-gate failure:
    //   releaseGateReasons — warnings logged to ctx; generation continues; output still saved.
    //   hardStopReasons    — thrown as an error; orchestrator catch block saves a partial
    //                         report with a zeroed prose score.
    // A condition can appear in both arrays (warning AND hard stop) to capture context in
    // the release gate diagnostic before throwing.
    const releaseGateReasons = [];
    const hardStopReasons = [];
    const validationErrorTypes = new Set(validationReport.errors.map((error) => error.type));
    const hasSuspectEliminationCoverageFailure = validationReport.errors.some((error) => isSuspectEliminationCoverageError(error));
    const readabilitySummary = evaluateProseReadability(prose);
    const sceneGrounding = evaluateSceneGroundingCoverage(prose, locationProfiles);
    const templateLeakage = evaluateTemplateLeakage(prose);
    const temporalConsistency = evaluateTemporalConsistency(prose, temporalContext);
    const placeholderLeakage = evaluatePlaceholderLeakage(prose);
    const chapterHeadingArtifacts = evaluateChapterHeadingArtifacts(prose);
    const sensoryVariety = evaluateSensoryVariety(prose);
    const clueEvidence = collectClueEvidenceFromProse(prose.chapters, cml.CASE, clues);
    const expectedClueIds = getExpectedClueIdsForVisibility(cml.CASE, clues);
    const extractedClueIds = clueEvidence.visibleClueIds;
    const missingExpectedClueIds = expectedClueIds.filter((id) => !extractedClueIds.includes(id));
    const unexpectedExtractedClueIds = extractedClueIds.filter((id) => !expectedClueIds.includes(id));
    const nsdRevealedClues = new Set(ctx.nsdTransferTrace.flatMap((step) => step.newly_revealed_clue_ids));
    const evidenceVisibleClues = new Set(clueEvidence.visibleClueIds);
    const revealedWithoutEvidence = Array.from(nsdRevealedClues).filter((id) => !evidenceVisibleClues.has(id));
    const evidenceWithoutReveal = Array.from(evidenceVisibleClues).filter((id) => !nsdRevealedClues.has(id));
    const nsdVisibilityDivergence = {
        diverged: revealedWithoutEvidence.length > 0 || evidenceWithoutReveal.length > 0,
        revealed_count: nsdRevealedClues.size,
        evidence_visible_count: evidenceVisibleClues.size,
        clue_state_by_id: clueEvidence.clueStateById,
        revealed_without_evidence: revealedWithoutEvidence,
        evidence_without_reveal: evidenceWithoutReveal,
        sample_evidence_anchors: Object.values(clueEvidence.evidenceByClue).flat().slice(0, 8),
    };
    const proseContainsIllegalControlChars = prose.chapters.some((chapter) => chapter.paragraphs.some((paragraph) => /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(paragraph)));
    const proseContainsMojibake = prose.chapters.some((chapter) => chapter.paragraphs.some((paragraph) => persistentMojibakePattern.test(paragraph)));
    if (fairPlayAudit) {
        const fpValidation = fairPlayAudit.overallStatus === "pass"
            ? 100
            : fairPlayAudit.overallStatus === "needs-revision"
                ? 70
                : 45;
        const hasZeroScoreViolation = fairPlayAudit.checks?.some((check) => check.status === "fail") ?? false;
        if (fpValidation < 60 || hasZeroScoreViolation) {
            const violationSummary = fairPlayAudit.violations
                .map((v) => `${v.rule} (${v.severity})`)
                .join(", ");
            releaseGateReasons.push(`fair play audit score below threshold (${fpValidation}/100)${hasZeroScoreViolation ? " with 0-score violations" : ""}: ${violationSummary}`);
            hardStopReasons.push(`fair play audit failed (${fpValidation}/100): mystery violates fundamental fair play principles`);
        }
        else if (fairPlayAudit.overallStatus === "needs-revision") {
            releaseGateReasons.push(`fair play audit needs revision (score: ${fpValidation}/100)`);
        }
    }
    if (validationErrorTypes.has("identity_role_alias_break") ||
        validationErrorTypes.has("missing_case_transition_bridge") ||
        validationErrorTypes.has("case_transition_missing")) {
        releaseGateReasons.push("critical continuity issue detected");
    }
    if (validationErrorTypes.has("temporal_contradiction")) {
        releaseGateReasons.push("temporal continuity contradiction detected");
        hardStopReasons.push("temporal continuity contradiction detected");
    }
    if (validationErrorTypes.has("investigator_role_drift")) {
        releaseGateReasons.push("investigator role continuity drift detected");
    }
    if (proseContainsMojibake) {
        releaseGateReasons.push("mojibake/encoding artifact remains");
        hardStopReasons.push("mojibake/encoding artifact remains");
    }
    if (proseContainsIllegalControlChars || validationErrorTypes.has("illegal_character")) {
        releaseGateReasons.push("illegal character/encoding corruption detected");
        hardStopReasons.push("illegal character/encoding corruption detected");
    }
    if (validationErrorTypes.has("missing_discriminating_test") ||
        validationErrorTypes.has("cml_test_not_realized")) {
        releaseGateReasons.push("no valid discriminating test scene");
    }
    if (hasSuspectEliminationCoverageFailure) {
        releaseGateReasons.push("suspect elimination coverage incomplete");
        hardStopReasons.push("suspect elimination coverage incomplete");
    }
    if (templateLeakage.hasLeakage) {
        releaseGateReasons.push(`templated prose leakage detected (duplicate long blocks: ${templateLeakage.duplicatedLongParagraphCount}, scaffold matches: ${templateLeakage.scaffoldCount})`);
        hardStopReasons.push("templated prose leakage detected");
    }
    if (temporalConsistency.contradictions > 0) {
        releaseGateReasons.push(`month/season contradictions found (${temporalConsistency.details.slice(0, 3).join("; ")})`);
        hardStopReasons.push("month/season contradictions found");
    }
    if (placeholderLeakage.hasLeakage) {
        releaseGateReasons.push(`placeholder token leakage detected (role+surname: ${placeholderLeakage.roleSurnameCount}, named standalone placeholders: ${placeholderLeakage.standaloneCount}, generic role phrases: ${placeholderLeakage.genericRoleCount}${placeholderLeakage.examples.length > 0 ? `, examples: ${placeholderLeakage.examples.join(", ")}` : ""})`);
        if (placeholderLeakage.severeLeakage) {
            hardStopReasons.push("placeholder token leakage detected");
        }
    }
    if (chapterHeadingArtifacts.hasArtifacts) {
        releaseGateReasons.push(`duplicate chapter heading artifacts detected (${chapterHeadingArtifacts.duplicatedHeadingCount})`);
        hardStopReasons.push("duplicate chapter heading artifacts detected");
    }
    if (sensoryVariety.hasExcessiveRepetition) {
        releaseGateReasons.push(`atmospheric sensory palette recycled across >40% of chapters (${sensoryVariety.overusedPhrases.slice(0, 3).join(", ")})`);
        ctx.warnings.push(`Sensory variety warning: ${sensoryVariety.overusedPhrases.length} overused atmospheric phrase(s) detected. Vary imagery across chapters.`);
    }
    if (readabilitySummary.denseChapterCount > 0) {
        releaseGateReasons.push(`readability density threshold exceeded (dense chapters: ${readabilitySummary.denseChapterCount}, low-paragraph chapters: ${readabilitySummary.underParagraphCount}, overlong blocks: ${readabilitySummary.severeParagraphBlocks})`);
    }
    if (sceneGrounding.coverage < 0.9) {
        releaseGateReasons.push(`scene-grounding coverage below target (${sceneGrounding.grounded}/${sceneGrounding.total} chapters grounded)`);
    }
    if (nsdVisibilityDivergence.diverged) {
        releaseGateReasons.push(`nsd/clue-visibility divergence (${revealedWithoutEvidence.length} NSD reveals lack prose evidence; ${evidenceWithoutReveal.length} evidence-visible clues absent from NSD reveal list)`);
        if (revealedWithoutEvidence.length > 0) {
            hardStopReasons.push(`clue visibility incomplete (${revealedWithoutEvidence.length} NSD-revealed clue(s) have no prose evidence anchors)`);
        }
    }
    ctx.warnings.push(`UTF-8/multibyte check: ${proseContainsIllegalControlChars ? "FAILED (illegal control characters found)" : "PASSED (valid Unicode preserved)"}`);
    if (enableScoring && scoringLogger) {
        const releaseDiagnostic = {
            validation_status: validationReport.status,
            validation_summary: validationReport.summary,
            validation_snapshots: {
                pre_repair: preRepairValidationSummary,
                post_repair: postRepairValidationSummary,
                release_gate: validationReport.summary,
            },
            release_gate_warning_count: releaseGateReasons.length,
            release_gate_hard_stop_count: hardStopReasons.length,
            release_gate_warnings: releaseGateReasons,
            release_gate_hard_stops: Array.from(new Set(hardStopReasons)),
            readability: readabilitySummary,
            scene_grounding: sceneGrounding,
            template_leakage: templateLeakage,
            temporal_consistency: temporalConsistency,
            placeholder_leakage: placeholderLeakage,
            chapter_heading_artifacts: chapterHeadingArtifacts,
            sensory_variety: sensoryVariety,
            clue_visibility_expected_ids: expectedClueIds,
            clue_visibility_extracted_ids: extractedClueIds,
            clue_visibility_missing_expected_ids: missingExpectedClueIds,
            clue_visibility_unexpected_extracted_ids: unexpectedExtractedClueIds,
            clue_visibility_expected_count: expectedClueIds.length,
            clue_visibility_extracted_count: extractedClueIds.length,
            nsd_visibility_divergence: nsdVisibilityDivergence,
            has_illegal_control_chars: proseContainsIllegalControlChars,
            has_mojibake: proseContainsMojibake,
            fair_play_status: fairPlayAudit?.overallStatus ?? null,
        };
        scoringLogger.logPhaseDiagnostic("agent9_prose", "Release Gate", "release_gate_summary", releaseDiagnostic, runId, projectId || "");
        scoreAggregator?.upsertDiagnostic("agent9_prose_release_gate_summary", "agent9_prose", "Release Gate", "release_gate_summary", releaseDiagnostic);
    }
    if (releaseGateReasons.length > 0) {
        releaseGateReasons.forEach((reason) => ctx.warnings.push(`Release gate warning: ${reason}`));
        reportProgress("validation", `Release gate warnings: ${releaseGateReasons.join("; ")}`, 99);
    }
    // E4: Failure lineage bundle — compact per-run failure audit trail
    if (enableScoring && scoreAggregator && scoringLogger) {
        const failureHistory = prose.validationDetails?.failureHistory ?? [];
        const firstFailChapter = failureHistory.length > 0
            ? Math.min(...failureHistory.map((e) => (e.batchIndex ?? 0) + 1))
            : null;
        const errorClasses = Array.from(new Set(failureHistory.flatMap((entry) => (entry.errors ?? []).map((error) => {
            if (/clue|evidence/i.test(error))
                return 'clue_visibility';
            if (/word.*count|minimum.*words|chapter.*length/i.test(error))
                return 'word_count';
            if (/temporal|season|month/i.test(error))
                return 'temporal';
            if (/scene.*ground|location/i.test(error))
                return 'scene_grounding';
            if (/identity|character|phantom/i.test(error))
                return 'identity_continuity';
            if (/template|fingerprint|ngram/i.test(error))
                return 'template_leakage';
            return 'validation_error';
        }))));
        const correctiveAttempts = (ctx.proseRepairPassCount ?? 0) + (ctx.proseRewritePassCount ?? 0);
        const finalBlockingReason = hardStopReasons.length > 0
            ? Array.from(new Set(hardStopReasons)).join('; ')
            : releaseGateReasons.length > 0
                ? releaseGateReasons.slice(0, 3).join('; ')
                : null;
        const failureLineage = {
            first_failing_chapter: firstFailChapter,
            error_classes: errorClasses,
            corrective_attempts: correctiveAttempts,
            final_blocking_reason: finalBlockingReason,
        };
        scoringLogger.logPhaseDiagnostic("agent9_prose", "Prose Generation", "failure_lineage", failureLineage, runId, projectId || "");
        scoreAggregator.upsertDiagnostic("agent9_prose_failure_lineage", "agent9_prose", "Prose Generation", "failure_lineage", failureLineage);
    }
    if (hardStopReasons.length > 0) {
        const hardStopMessage = `Release gate hard-stop: ${Array.from(new Set(hardStopReasons)).join("; ")}`;
        ctx.errors.push(hardStopMessage);
        reportProgress("validation", hardStopMessage, 99);
        throw new Error(hardStopMessage);
    }
    // ============================================================================
    // Commit results to context
    // ============================================================================
    ctx.prose = prose;
    ctx.validationReport = validationReport;
}
//# sourceMappingURL=agent9-run.js.map