/**
 * agent9-prose/context-management.ts
 * Chapter summary extraction, continuity-context building, story-to-date block,
 * opening-style rotation, and scene-grounding checklist generation.
 */
import type { ClueDistributionResult } from "../agent5-clues.js";
import {
  ARC_POSITION_REGISTER,
  ARC_POS_TO_SCENE_TYPE,
  HIGH_TENSION_POSITIONS,
} from "../constants/arc-position.js";
import { getGenerationParams } from "@cml/story-validation";
import type { NarrativeState } from "../types/narrative-state.js";
import type {
  ProseChapter,
  ChapterSummary,
  ProseGenerationInputs,
} from "./types.js";
export function extractChapterSummary(chapter: ProseChapter, chapterNumber: number, castNames: string[]): ChapterSummary {
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
  
  const settingTerms: string[] = [];
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
  const keyEvents: string[] = [];
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
export function buildContinuityContext(summaries: ChapterSummary[], currentChapterStart: number): string {
  if (summaries.length === 0) {
    return '';
  }

  // Use all previous chapter summaries for name/setting aggregation
  const relevantSummaries = summaries;

  // Aggregate character names across all previous chapters
  const allCharacters = new Set<string>();
  relevantSummaries.forEach(s => s.charactersPresent.forEach(c => allCharacters.add(c)));

  // Aggregate setting terms
  const allSettingTerms = new Set<string>();
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

  // Fix 3: Clock-anchor extraction — scan prior keyEvents for established time phrases
  // and inject a locked-anchor directive so later chapters cannot oscillate the time.
  const CLOCK_ANCHOR_RE = /\b(?:(?:a\s+)?(?:ten|five|twenty|quarter|half)\s+(?:minutes?\s+)?(?:past|to|after|before)\s+(?:midnight|noon|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)|(?:\d{1,2}:\d{2}(?:\s*[ap]\.?m\.?)?))\b/gi;
  const clockAnchors: string[] = [];
  relevantSummaries.forEach(s => {
    s.keyEvents.forEach(ev => {
      const matches = ev.match(CLOCK_ANCHOR_RE);
      if (matches) clockAnchors.push(...matches);
    });
  });
  const uniqueClockAnchors = [...new Set(clockAnchors.map(a => a.toLowerCase()))];
  if (uniqueClockAnchors.length > 0) {
    context += '\n**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**\n';
    context += `Clock time established in earlier chapters: **"${uniqueClockAnchors[0]}"**\n`;
    if (uniqueClockAnchors.length > 1) {
      context += `⚠ CONFLICT: multiple times found (${uniqueClockAnchors.join(', ')}). Use ONLY the first: "${uniqueClockAnchors[0]}". All others are errors.\n`;
    }
    context += '✓ RULE: Every reference to the clock MUST use exactly this phrase. No variation permitted.\n';
  }

  context += '═══════════════════════════════════════════════════════════\n';
  
  return context;
}

export function buildStoryToDateBlock(priorChapters: ProseChapter[], currentChapterStart: number): string {
  const normalize = (value: unknown): string => String(value ?? '').replace(/\r\n/g, '\n').trim();
  const lines: string[] = [];
  lines.push('\n\nSTORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):');

  if (!Array.isArray(priorChapters) || priorChapters.length === 0 || currentChapterStart <= 1) {
    lines.push('- No previous chapter text exists yet for this batch.');
    return lines.join('\n');
  }

  lines.push(
    '- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.',
  );
  lines.push(
    '- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.',
  );
  lines.push(
    '- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.',
  );

  for (let idx = 0; idx < priorChapters.length; idx++) {
    const chapterNumber = idx + 1;
    const chapter = priorChapters[idx];
    const title = normalize(chapter?.title || `Chapter ${chapterNumber}`);
    const paragraphs = Array.isArray(chapter?.paragraphs)
      ? chapter.paragraphs.map((p) => normalize(p)).filter(Boolean)
      : [];
    lines.push(`\n--- BEGIN PRIOR CHAPTER ${chapterNumber} ---`);
    lines.push(`Title: ${title}`);
    if (paragraphs.length > 0) {
      lines.push(paragraphs.join('\n\n'));
    } else {
      lines.push('[No paragraph text recorded]');
    }
    lines.push(`--- END PRIOR CHAPTER ${chapterNumber} ---`);
  }

  return lines.join('\n');
}

/**
 * Opening style rotation used to assign a mandatory first-sentence style to each
 * chapter, ensuring no single style (especially "general-descriptive") accounts
 * for more than a third of chapters.
 *
 * The cycle is 6 styles long; "general-descriptive" appears once per cycle.
 * For 18 chapters that means 3 general-descriptive (17%) — well under the 50%
 * validation threshold that fires `opening_style_repetition`.
 *
 * Each directive is given to the LLM in the per-chapter scene grounding checklist
 * as a HARD REQUIREMENT so that the opening sentence pattern is enforced before
 * any sensory/atmosphere obligations.
 */
export const OPENING_STYLE_ROTATION: Array<{ style: string; directive: string }> = [
  {
    style: 'character-action',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…".',
  },
  {
    style: 'dialogue-open',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with spoken dialogue — e.g. \'"[words]," [Name] said/asked/replied/murmured.\' The opening quote must be the first character on the line.',
  },
  {
    style: 'time-anchor',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o\'clock…" / "On the second day after the discovery…". Time must be in the first clause.',
  },
  {
    style: 'noun-phrase-atmosphere',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a noun-phrase atmosphere — e.g. "The smell of damp stone in the cellar…" / "A chill from the landing…" / "The sound of the clock in the hall…". Pattern: "The/A [noun] of/in/from [place]…".',
  },
  {
    style: 'temporal-subordinate',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a temporal subordinate clause — e.g. "When [Name] entered…" / "After the last guest…" / "Before the household had stirred…" / "As the light faded…".',
  },
  {
    style: 'expository-setup',
    directive:
      'OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an expository setup — e.g. "It was not until…" / "There had been no word since…" / "There was a note on the table…". Begin with "It was", "There was", or "There had been" followed immediately by a specific condition, event, or discovery. Do not open on generic mood alone — but still anchor the location and weave in the sensory + time-of-day grounding across the next sentence or two.',
  },
];

/**
 * Build an explicit chapter-by-chapter scene grounding checklist using
 * outline scene settings and location profile names.
 *
 * Also embeds:
 *  2b — per-chapter opening style directive (prevents opening_style_repetition)
 *  2c — canonical location capitalisation block (prevents location_name_variant)
 */
export function buildSceneGroundingChecklist(
  scenes: unknown[],
  locationProfiles: any,
  chapterStart: number,
): string {
  if (!Array.isArray(scenes) || scenes.length === 0) return '';

  const locationNames = new Set<string>();
  if (locationProfiles?.primary?.name) {
    locationNames.add(String(locationProfiles.primary.name));
  }
  if (Array.isArray(locationProfiles?.keyLocations)) {
    for (const loc of locationProfiles.keyLocations) {
      if (loc?.name) locationNames.add(String(loc.name));
    }
  }
  // Pre-pass: also collect scene-level location names so that locations which appear
  // in the narrative outline but not in locationProfiles (e.g. "Wine Cellar" from
  // scene.setting.location) are included in the capitalisation enforcement block.
  for (const scene of scenes as any[]) {
    const sceneLocName = String(scene?.setting?.location || scene?.location || '').trim();
    if (sceneLocName.length > 0) locationNames.add(sceneLocName);
  }

  // 2c — Canonical location names for capitalisation enforcement
  const canonicalLocationList = Array.from(locationNames).slice(0, 12);
  const locationCapitalisationBlock =
    canonicalLocationList.length > 0
      ? `\nLOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):\n` +
        `All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.\n` +
        `Canonical forms: ${canonicalLocationList.map((n) => `"${n}"`).join(', ')}\n` +
        `Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. ` +
        `Every time you mention a named location, copy its capitalisation from the list above.`
      : '';

  const checklistLines: string[] = [];
  scenes.forEach((scene: any, idx) => {
    const chapterNumber = chapterStart + idx;
    const sceneLocation = String(scene?.setting?.location || scene?.location || '').trim();
    const locationHint = sceneLocation.length > 0
      ? sceneLocation
      : (locationNames.size > 0 ? Array.from(locationNames)[0] : 'the canonical primary location');

    // 2b — Deterministic opening style assignment (cycle index based on absolute chapter number
    // so assignments are stable across multi-batch generation)
    const styleIdx = (chapterNumber - 1) % OPENING_STYLE_ROTATION.length;
    const { directive: openingStyleDirective } = OPENING_STYLE_ROTATION[styleIdx];

    checklistLines.push(
      `- Chapter ${chapterNumber}: ${openingStyleDirective} ` +
      `Anchor opening in "${locationHint}". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.`
    );
  });

  const knownLocations = Array.from(locationNames).slice(0, 8).join(', ');
  const knownLocationLine = knownLocations.length > 0
    ? `Known location profile anchors: ${knownLocations}`
    : 'Known location profile anchors: use the primary location and scene setting terms from outline.';

  return `\n\nSCENE GROUNDING CHECKLIST (MUST FOLLOW):\n${knownLocationLine}${locationCapitalisationBlock}\n${checklistLines.join('\n')}`;
}

/**
 * Validate that discriminating test requirements can be satisfied by CML
 * Returns error message if validation fails, empty string if OK
 */