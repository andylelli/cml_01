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
import {
  getGenerationParams,
  // X95 — one opening-grounding vocabulary, rendered here rather than re-typed.
  OPENING_SENSORY_MARKERS,
  OPENING_ATMOSPHERE_MARKERS,
  formatGroundingMarkers,
  groundingPaletteFor,
} from "@cml/story-validation";
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
export function buildContinuityContext(
  summaries: ChapterSummary[],
  currentChapterStart: number,
  // P1.3 (first-principles LLD §6.1) — when the Story Bible supplies an authoritative true-time anchor,
  // pass it here to DEREFERENCE it instead of scraping the time out of generated prose. The scrape is a
  // drift surface (a misread prior chapter pins the wrong time); the Bible value is ground truth. Default
  // undefined → today's scrape behaviour (no change).
  lockedTimeAnchorOverride?: string,
): string {
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
  const scrapedAnchors = [...new Set(clockAnchors.map(a => a.toLowerCase()))];
  // P1.3: the Bible override is authoritative when supplied; otherwise fall back to the scraped anchor.
  const override = (lockedTimeAnchorOverride ?? '').trim();
  const authoritative = override || scrapedAnchors[0];
  if (authoritative) {
    context += '\n**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**\n';
    context += `Clock time${override ? ' (from the case ground truth)' : ' established in earlier chapters'}: **"${authoritative}"**\n`;
    // Conflict note: any scraped anchor that disagrees with the authoritative value is an error.
    const conflicting = scrapedAnchors.filter((a) => a !== authoritative.toLowerCase());
    if (conflicting.length > 0) {
      context += `⚠ CONFLICT: other times appear (${conflicting.join(', ')}). Use ONLY: "${authoritative}". All others are errors.\n`;
    }
    /**
     * A_73 §2 — C4, THE LOCKED-FACT TAX, IN ITS ACTIONABLE FORM.
     *
     * A_72 §5.1/§10.3 priced C4 as a fair-play renegotiation: a canonical form plus a registered
     * alias list, validated. It is not. The STORY VALIDATOR already requires the canonical value
     * only ONCE across the whole book —
     *
     *     prose-consistency-validator.ts:423
     *     // Missing-value: flag ONCE if the canonical value never appears in any chapter that references it.
     *
     * with a test pinning exactly that (`locked-fact-once.test.ts`, "value required ONCE, not per
     * incidental mention"). The only per-scene hard error is `locked_fact_contradicted`, which fires
     * on a DIFFERENT value near the fact's keywords.
     *
     * So the thing that puts the same seven words into fifteen of a book's eighty-nine dialogue
     * spans — the reader's standing "catchphrase-heavy" complaint, and `dialogue` reaching 8 exactly
     * once in 35 reads — is this prompt line, not the gate. Relaxing it needs no validator change
     * and no alias registry.
     *
     * FLAG-GATED, DEFAULT OFF, because it changes the prose of every run and the house rule is that
     * behaviour levers are probed before promotion. Off, the text below is byte-identical to what
     * shipped before.
     *
     * ONE CONSTRAINT ON THE RELAXED FORM: `detectConflictingValue` hard-fails on a different
     * NUMERIC/TIME-shaped value near the keywords, so the permitted alternatives must be
     * non-numeric ("the tide time", "the hour the tide turned"). "eleven-ten" is exactly the shape
     * that check exists to catch. The wording below says so rather than trusting the model to infer it.
     */
    const lockedFactAliasesEnabled = /^(1|true|yes|on)$/i.test(process.env.AGENT9_LOCKED_FACT_ALIASES ?? '');
    if (lockedFactAliasesEnabled) {
      context += `✓ RULE: State this phrase EXACTLY — "${authoritative}" — at least once in every chapter that turns on this fact.\n`;
      context += '  After that first exact statement, later references in the SAME chapter may use natural language\n';
      context += '  ("the tide time", "the hour the tide turned", "that hour"). Do NOT invent a different clock value,\n';
      context += '  and do NOT re-word it as another time (e.g. "eleven-ten") — a different time reads as a contradiction.\n';
      context += '  Fair play is preserved by the exact statement; repeating it verbatim in every line is not required.\n';
    } else {
      context += '✓ RULE: Every reference to the clock MUST use exactly this phrase. No variation permitted.\n';
    }
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
 * Which opening style chapter N gets — and, with a seed, WHICH STORY'S rotation it belongs to.
 *
 * ── THE DEFECT THIS EXISTS TO FIX (measured 2026-08-23) ──────────────────────────────────────────
 *
 * The index was `(chapterNumber - 1) % LEN`. Correct within a book — no two adjacent chapters share
 * a style, which is what the entropy linter checks — and **constant across books at chapter 1**, which
 * nothing checks, because every run is scored on its own. Chapter 1 has therefore opened in
 * `character-action` on every manuscript this project has ever produced.
 *
 * Chapter 1 is the only chapter the `opening_hook` category reads. Measured over the 35 archived
 * manuscripts that carry an external read (`npm run ledger:external-read`):
 *
 *     opening_hook:  8 maximum, in 34 reads. NEVER 9. Mean 8.0 across the best eight.
 *
 *     first sentences:   "Eleanor Voss pressed her gloved hand against the smooth brass handle…"
 *                        "Eleanor Voss pressed her gloved palm to the cold brass handle…"
 *                        "Eleanor Voss stepped briskly across the terrazzo tiles…"
 *                        "Inspector Evelyn Harcourt stepped across the threshold…"
 *
 *     word frequency in sentence one:  pressed 26%, chill 26%, stepped 23%, gloved 23%, damp 23%
 *
 * The readers' notes for the category are an inventory of props — *"Body, clock contradiction, weapon,
 * logbook, foggy hotel — strong hook"* — and a mark of 8, every time. That is the signature of a hook
 * that works and is unremarkable, and the cause is one line of arithmetic rather than the model.
 *
 * ── WHY A SEED AND NOT RANDOMNESS ────────────────────────────────────────────────────────────────
 *
 * Runs in this project are replayed, A/B'd and rescored; a random offset would make two runs of the
 * same case incomparable and this repo has already lost a paid experiment to non-reproducibility. The
 * offset is an FNV-1a hash of a per-story string (the case title), so it is stable for a story and
 * different between stories. No seed ⇒ offset 0 ⇒ byte-identical to the old behaviour.
 */
export function openingStyleIndexFor(chapterNumber: number, rotationSeed?: string): number {
  const len = OPENING_STYLE_ROTATION.length;
  let offset = 0;
  if (rotationSeed && rotationSeed.trim().length > 0) {
    // FNV-1a, 32-bit. Chosen for being short, dependency-free and deterministic across platforms.
    let h = 0x811c9dc5;
    for (let i = 0; i < rotationSeed.length; i += 1) {
      h ^= rotationSeed.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    offset = h % len;
  }
  // `chapterNumber` is 1-based and may exceed len; the modulo keeps the cycle intact either way.
  return (((chapterNumber - 1 + offset) % len) + len) % len;
}

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
  /**
   * Per-STORY offset for the opening-style rotation. Omitted ⇒ offset 0 ⇒ the pre-2026-08-23
   * behaviour, in which chapter 1 of every book opened in the same style. See `openingStyleIndexFor`.
   */
  rotationSeed?: string,
  /**
   * Per-STORY seed for the grounding-vocabulary palette (X95). Omitted ⇒ the full validated lists are
   * shown, exactly as they always have been. Separate from `rotationSeed` because they are separate
   * levers with separate probes, even when both are seeded from the same case title.
   */
  paletteSeed?: string,
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

  /**
   * X95 — what vocabulary this chapter is SHOWN.
   *
   * With no palette seed the full validated lists are rendered, which is what every run has done to
   * date. With one, the prompt leads with a rotating subset per chapter and per story: the validator
   * still accepts every word on the full list, so nothing can newly fail — a subset of an accepted
   * list is still accepted — but two stories stop being told to reach for the same five words.
   *
   * MEASURED over the 35 archived manuscripts with an external read: `chill` opens 26% of them,
   * `damp` 23%, `faint` 23%. `atmosphere` and `opening_hook` are two of the five categories no reader
   * has ever given a 9, and the reader's notes on both are interchangeable between manuscripts.
   */
  const sensoryChoices = (chapterNumber: number): readonly string[] =>
    paletteSeed ? groundingPaletteFor(chapterNumber, paletteSeed, OPENING_SENSORY_MARKERS, 8) : OPENING_SENSORY_MARKERS;
  const atmosphereChoices = (chapterNumber: number): readonly string[] =>
    paletteSeed ? groundingPaletteFor(chapterNumber, paletteSeed, OPENING_ATMOSPHERE_MARKERS, 12) : OPENING_ATMOSPHERE_MARKERS;

  const checklistLines: string[] = [];
  scenes.forEach((scene: any, idx) => {
    const chapterNumber = chapterStart + idx;
    const sceneLocation = String(scene?.setting?.location || scene?.location || '').trim();
    const locationHint = sceneLocation.length > 0
      ? sceneLocation
      : (locationNames.size > 0 ? Array.from(locationNames)[0] : 'the canonical primary location');

    // 2b — Deterministic opening style assignment (cycle index based on absolute chapter number
    // so assignments are stable across multi-batch generation), offset once per STORY — see
    // `openingStyleIndexFor`.
    const styleIdx = openingStyleIndexFor(chapterNumber, rotationSeed);
    const { directive: openingStyleDirective } = OPENING_STYLE_ROTATION[styleIdx];

    checklistLines.push(
      `- Chapter ${chapterNumber}: ${openingStyleDirective} ` +
      `Anchor opening in "${locationHint}". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from ${formatGroundingMarkers(sensoryChoices(chapterNumber), '/')} — and (b) include 1+ atmosphere/time word — choose from ${formatGroundingMarkers(atmosphereChoices(chapterNumber), '/')}. These are validated requirements, not style suggestions; missing them triggers a retry.`
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