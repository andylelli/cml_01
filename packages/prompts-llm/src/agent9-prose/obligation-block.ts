/**
 * agent9-prose/obligation-block.ts
 * buildChapterObligationBlock â€” the combined clue-obligation / NSD context block
 * injected into every prose prompt.
 */
import type { ClueDistributionResult, Clue } from "../agent5-clues.js";
import { getGenerationParams } from "@cml/story-validation";
import {
  ARC_POS_TO_SCENE_TYPE,
  HIGH_TENSION_POSITIONS,
} from "../constants/arc-position.js";
import {
  getRequiredClueIdsForScene,
  isBehaviouralClue,
  isDeliveryMethodLabel,
  tokenMatchesText,
  tokenizeForClueObligation,
} from "./clue-validation.js";
import { getSeasonAllowList, capitalizeWord } from "./lint.js";
import type { CanonicalSeason } from "./lint.js";
import { sanitizeClueField, tagCharacter, buildIdentityMap } from "./phrase-analysis.js";
import { getTieredBannedPhrasePolicy } from "./banned-phrases.js";
import type { BeatFingerprint } from "./phrase-analysis.js";
import type { NarrativeState } from "../types/narrative-state.js";
import type {
  ProseChapter,
  ChapterRequirementLedgerEntry,
  MacroArcEntry,
  ProseGenerationInputs,
} from "./types.js";
export function buildChapterObligationBlock(
  scenesForChapter: unknown[],
  chapterStart: number,
  cmlCase: any,
  lockedFacts: ProseGenerationInputs['lockedFacts'] | undefined,
  temporalLock: { month: string; season: CanonicalSeason } | undefined,
  clueDistribution?: ClueDistributionResult,
  wordTarget?: { targetWords: number },
  sensoryVariantsByChapter?: Record<number, any>,
  narrativeState?: NarrativeState,
  currentArcPosition?: string,
  worldDoc?: any,
  macroArcPlan?: MacroArcEntry[],
  allOutlineScenes?: any[],
): string {
  if (!Array.isArray(scenesForChapter) || scenesForChapter.length === 0) {
    return '';
  }

  const proseRequirements = cmlCase?.prose_requirements ?? {};
  const dtScene = proseRequirements?.discriminating_test_scene;
  // Exclude deceased victims from clearance obligations — a dead character cannot
  // meaningfully appear in a "alibi confirmed" paragraph and causes the LLM to
  // generate nonsensical or repetitive prose when forced to clear a victim.
  const _victimNamesForClearance = new Set<string>(
    ((cmlCase?.cast ?? []) as any[])
      .filter((c: any) => String(c.role_archetype ?? c.role ?? '').toLowerCase().includes('victim'))
      .map((c: any) => String(c.name ?? '').trim().toLowerCase())
  );
  // Culprits must never be included in suspect-clearance obligations.
  const _culpritNamesForClearance = new Set<string>(
    ((cmlCase?.culpability?.culprits ?? []) as any[])
      .map((name: any) => String(name ?? '').trim().toLowerCase())
      .filter(Boolean)
  );
  const clearanceScenes = Array.isArray(proseRequirements?.suspect_clearance_scenes)
    ? proseRequirements.suspect_clearance_scenes.filter(
        (entry: any) => {
          const suspect = String(entry?.suspect_name ?? '').trim().toLowerCase();
          if (!suspect) return false;
          if (_victimNamesForClearance.has(suspect)) return false;
          if (_culpritNamesForClearance.has(suspect)) return false;
          return true;
        }
      )
    : [];
  const victimForIdentity = ((cmlCase?.cast ?? []) as any[])
    .find((c: any) => String(c.role_archetype ?? c.role ?? '').toLowerCase().includes('victim'));
  const victimNameForIdentity = String(victimForIdentity?.name ?? '').trim();

  const clueMap = new Map<string, Clue>(
    (clueDistribution?.clues ?? []).map((c) => [c.id, c]),
  );
  const deliveryMethodMap = new Map<string, { delivery_method?: string; act_number?: number; scene_number?: number }>(
    ((cmlCase?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
      .filter((e: any) => e?.clue_id)
      .map((e: any) => [String(e.clue_id), e]),
  );

  // Fix 5: Detect recently-interrogated suspects from beat history to prevent
  // repetitive confrontation scenes in consecutive chapters.
  const INTERROGATION_VERBS_RE = /\b(?:question(?:ed|ing)?|interrogat(?:ed|ing)?|confront(?:ed|ing)?|interview(?:ed|ing)?|accus(?:ed|ing)?|press(?:ed|ing)?|challeng(?:ed|ing)?)\b/i;
  const allSuspectNames: string[] = ((cmlCase.cast ?? []) as any[])
    .filter((c: any) => {
      const role = String(c.role_archetype ?? c.role ?? '').toLowerCase();
      return !role.includes('detective') && !role.includes('victim') && !role.includes('narrator');
    })
    .map((c: any) => String(c.name ?? '').trim())
    .filter(Boolean);
  const recentlyInterrogatedSuspects = new Set<string>();
  if (narrativeState?.beatHistory && allSuspectNames.length > 0) {
    const recentBeats = (narrativeState.beatHistory as BeatFingerprint[]).slice(-8);
    for (const bfp of recentBeats) {
      for (const beat of bfp.beats) {
        if (INTERROGATION_VERBS_RE.test(beat)) {
          for (const suspectName of allSuspectNames) {
            const lastName = (suspectName.split(' ').pop() ?? suspectName);
            if (new RegExp(`\\b${lastName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(beat)) {
              recentlyInterrogatedSuspects.add(suspectName);
            }
          }
        }
      }
    }
  }

  // FIX-C3: Extract culprit alibi windows for per-chapter alibi consistency lock.
  const culpritNameSet = new Set<string>(
    ((cmlCase?.culpability?.culprits ?? []) as any[]).filter((n: any) => typeof n === 'string' && n)
  );
  const culpritAlibiLock = ((cmlCase?.cast ?? []) as any[])
    .filter((c: any) => culpritNameSet.has(String(c.name ?? '')))
    .map((c: any) => ({ name: String(c.name), alibiWindow: String(c.alibi_window ?? '').trim() }))
    .filter((c) => c.alibiWindow.length > 0);

  // FIX-M3 + FIX-D1: Clue-stage embargo — controls what the LLM may state per arc position.
  const STAGE1_ARC = new Set(['opening', 'discovery', 'first_clue', 'first_evidence', 'introduction']);
  const STAGE2_ARC = new Set(['investigation', 'access', 'evidence', 'alibi_probe', 'red_herring', 'complication']);
  const STAGE3_ARC = new Set(['testing', 'confrontation', 'discriminating', 'reversal', 'isolation', 'climax']);
  const clueStageForRun = !currentArcPosition ? 4
    : STAGE1_ARC.has(currentArcPosition) ? 1
    : STAGE2_ARC.has(currentArcPosition) ? 2
    : STAGE3_ARC.has(currentArcPosition) ? 3 : 4;

  const lines: string[] = ['CHAPTER OBLIGATION CONTRACT (MUST SATISFY):'];

  // Era authenticity preamble — injected once per batch so the LLM never introduces
  // anachronistic terms regardless of how far the pronoun/clue blocks push the system
  // message down in the context window.
  const eraDecode: string = String(cmlCase?.meta?.era?.decade ?? '').trim();
  const ERA_FORBIDDEN: Record<string, string[]> = {
    '1860s': ['telephone','automobile','airplane','radio','television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital'],
    '1870s': ['telephone','automobile','airplane','radio','television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital'],
    '1880s': ['automobile','airplane','radio','television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital'],
    '1890s': ['airplane','radio','television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital'],
    '1900s': ['television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital','plastic'],
    '1910s': ['television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital','plastic'],
    '1920s': ['television','computer','internet','email','cell phone','mobile','smartphone','GPS','laptop','digital'],
    '1930s': ['computer','internet','email','cell phone','mobile phone','smartphone','GPS','laptop','digital camera','text message','app','wifi','bluetooth','jet plane'],
    '1940s': ['internet','email','cell phone','mobile phone','smartphone','GPS','laptop','digital camera','text message','app','wifi','bluetooth'],
    '1950s': ['internet','email','cell phone','mobile phone','smartphone','GPS','laptop','digital camera','text message','app','wifi','bluetooth'],
  };
  const eraForbidden = ERA_FORBIDDEN[eraDecode];
  if (eraForbidden && eraForbidden.length > 0) {
    lines.push(`- ERA RULE (${eraDecode}): NEVER use these anachronistic terms: ${eraForbidden.map(t => `"${t}"`).join(', ')}. Any occurrence will cause the chapter to be rejected.`);
  }

  // Stage 9: tiered banned-phrase controls (hard/soft/watch) shared with runtime repair.
  const rolloutFlagsRaw = (getGenerationParams().agent9_prose as any)?.rollout_flags;
  const rolloutFlags = {
    tiered_phrase_contract_enabled:
      rolloutFlagsRaw?.tiered_phrase_contract_enabled !== false,
  };
  if (rolloutFlags.tiered_phrase_contract_enabled) {
    const phrasePolicy = getTieredBannedPhrasePolicy(cmlCase);
    if (phrasePolicy.hard.length > 0) {
      lines.push(
        `- STYLE HARD-BAN: NEVER use these phrase families: ${phrasePolicy.hard.map((p) => `"${p}"`).join(', ')}. Any occurrence triggers rejection/retry.`,
      );
    }
    if (phrasePolicy.soft.length > 0) {
      lines.push(
        `- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: ${phrasePolicy.soft.map((p) => `"${p}"`).join(', ')}.`,
      );
    }
    if (phrasePolicy.watch.length > 0) {
      lines.push(
        `- STYLE WATCHLIST: keep these patterns varied and scene-specific: ${phrasePolicy.watch.map((p) => `"${p}"`).join(', ')}.`,
      );
    }
  }

  const continuityTail = typeof narrativeState?.continuityTail === 'string'
    ? narrativeState.continuityTail.replace(/\s+/g, ' ').trim()
    : '';
  const continuityTailExcerpt = continuityTail.length > 220
    ? `${continuityTail.slice(0, 220).trimEnd()}...`
    : continuityTail;

  (scenesForChapter as any[]).forEach((scene, idx) => {
    const chapterNumber = chapterStart + idx;
    const requiredClueIds = getRequiredClueIdsForScene(cmlCase, scene, allOutlineScenes);
    const sceneAct = Number(scene?.act);
    // P1-1: compute per-act scene number for clearance/DTS matching (same normalisation
    // as getRequiredClueIdsForScene — CML uses per-act numbers, outline uses global).
    const perActSceneNum = allOutlineScenes
      ? Number(scene?.sceneNumber) - allOutlineScenes.filter((s: any) => Number(s?.act) < sceneAct).length
      : Number(scene?.sceneNumber);
    const locationAnchor = String(scene?.setting?.location || scene?.location || '').trim();
    // Exact match uses per-act scene number so CML clue_to_scene_mapping aligns with outline.
    const exactClearances = clearanceScenes.filter((entry: any) =>
      Number(entry?.act_number) === sceneAct &&
      Number(entry?.scene_number) === perActSceneNum,
    );
    const matchingClearances: typeof exactClearances = exactClearances.length > 0
      ? exactClearances
      : (() => {
          // Act-level fallback: only fire on the genuinely last chapter of the act.
          // With proseBatchSize=1 every batch has 1 scene, so idx===length-1 is always true —
          // which caused the fallback to fire for every chapter in the act (#24).
          // Check allOutlineScenes to find whether any scene with the same act number has a
          // higher sceneNumber than the current one.  If there is a later scene in the same act,
          // this is not the clearance chapter yet.
          const isLastInAct = allOutlineScenes
            ? !allOutlineScenes.some(
                (s: any) => Number(s?.act) === sceneAct && Number(s?.sceneNumber) > Number(scene?.sceneNumber),
              )
            : idx === (scenesForChapter as any[]).length - 1;
          return isLastInAct
            ? clearanceScenes.filter((entry: any) => Number(entry?.act_number) === sceneAct)
            : [];
        })();
    const isDiscriminatingTestChapter =
      Number(dtScene?.act_number) === sceneAct &&
      Number(dtScene?.scene_number) === perActSceneNum;

    // Post-reveal naming constraint — fires for chapters that come after the revelation
    // scene so the LLM doesn't replace the culprit's name with role aliases.
    const revelationSceneRef = proseRequirements.culprit_revelation_scene ?? null;
    const isPostRevealChapter = !isDiscriminatingTestChapter &&
      revelationSceneRef != null && (
        Number(scene?.act) > Number(revelationSceneRef.act_number) ||
        (Number(scene?.act) === Number(revelationSceneRef.act_number) &&
          perActSceneNum > Number(revelationSceneRef.scene_number))
      );

    lines.push(`- Chapter ${chapterNumber}:`);
    // [PHASE 5] Inject structural archetype contract
    if (macroArcPlan) {
      const arcEntry = macroArcPlan.find((e) => e.chapter === chapterNumber);
      if (arcEntry) {
        lines.push(`  - STRUCTURAL ARCHETYPE — Chapter ${chapterNumber} must be: ${arcEntry.archetype}`);
        lines.push(`      ✓ MUST contain: ${arcEntry.mustContain}`);
        lines.push(`      ✗ MUST NOT contain: ${arcEntry.mustNotContain}`);
      }
    }
    if (wordTarget) {
      lines.push(`  - Word count: Target ${wordTarget.targetWords} words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.`);
    }
    if (isPostRevealChapter) {
      const postRevealCulpritNames: string = ((cmlCase?.culpability?.culprits ?? []) as any[])
        .filter((n: any) => typeof n === 'string' && n).join(' and ');
      if (postRevealCulpritNames) {
        lines.push(`  - POST-REVEAL NAMING: the culprit has been unmasked. Refer to ${postRevealCulpritNames} by name. Do NOT use "the killer", "the murderer", "the culprit", "the criminal", or any similar role label as a substitute for ${postRevealCulpritNames}'s name.`);
      }
    }

    if (chapterNumber === 1 && victimNameForIdentity) {
      lines.push(`  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "${victimNameForIdentity}" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming ${victimNameForIdentity} in the same paragraph.`);
    }
    lines.push(`  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.`);
    lines.push(`  - Scene is set in: ${locationAnchor || 'the canonical scene location'} — reference it naturally within the paragraph, never as your opening phrase.`);
    lines.push(`  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.`);
    // FIX-P2: First chapter — investigator-role establishment requirement.
    // Prevents the LLM from deferring authority to an off-screen "real detective" who never arrives.
    if (chapterNumber === 1) {
      const detectiveName = ((cmlCase?.cast ?? []) as any[]).find((c: any) =>
        String(c.role ?? '').toLowerCase() === 'detective' ||
        String((c as any).role_archetype ?? '').toLowerCase().includes('detective')
      )?.name ?? '';
      if (detectiveName) {
        lines.push(`  - INVESTIGATOR ESTABLISHMENT REQUIRED: ${detectiveName} must claim or be recognised as the investigator in this chapter. Establish ${detectiveName} as the detective-in-charge within the first two paragraphs — ${detectiveName} IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. ${detectiveName} begins the investigation in this chapter.`);
      }
    };

    if (continuityTailExcerpt && idx === 0) {
      lines.push(
        `  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. ` +
        `Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "${continuityTailExcerpt}".`,
      );
    } else if (idx > 0) {
      lines.push(
        `  - Inter-chapter handoff: Chapter ${chapterNumber} must open by continuing unresolved pressure from the end of Chapter ${chapterNumber - 1}. ` +
        `Use a concrete bridge (same object, question, movement trail, or emotional beat), not a reset atmosphere paragraph.`,
      );
    }

    if (requiredClueIds.length > 0) {
      lines.push(`  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):`);
      for (const clueId of requiredClueIds) {
        const clue = clueMap.get(clueId);
        if (clue) {
          const earlyFlag = clue.placement === 'early'
            ? ' ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter'
            : '';
          lines.push(`    • ${sanitizeClueField(String(clue.description ?? ''))} [${clueId}]${earlyFlag}`);
          lines.push(`      Points to: ${sanitizeClueField(String(clue.pointsTo ?? ''))}`);  
          if (clue.placement === 'early') {
            lines.push(`      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):`);
            lines.push(`         Paragraph 1: The POV character physically approaches or directly observes this evidence.`);
            lines.push(`           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).`);
            lines.push(`         Paragraph 2 (immediately following): The detective or POV character explicitly reasons`);
            lines.push(`           about what this evidence implies — who it implicates, why it may be unreliable,`);
            lines.push(`           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.`);
          }
        } else {
          // Fallback: no distribution data — use delivery_method from clue_to_scene_mapping if available
          const mapping = deliveryMethodMap.get(clueId);
          const fallbackDesc = mapping?.delivery_method
            ? mapping.delivery_method.trim()
            : 'observable evidence relevant to the investigation';
          const isEarlyMapping = Number(mapping?.act_number) === 1;
          const earlyFlagFallback = isEarlyMapping
            ? ' ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter'
            : '';
          lines.push(`    • ${fallbackDesc} [${clueId}]${earlyFlagFallback}`);
          lines.push(`      Points to: what this observation reveals about the time or circumstances of the crime.`);
          if (isEarlyMapping) {
            lines.push(`      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):`);
            lines.push(`         Paragraph 1: The POV character physically approaches or directly observes this evidence.`);
            lines.push(`           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).`);
            lines.push(`         Paragraph 2 (immediately following): The detective or POV character explicitly reasons`);
            lines.push(`           about what this evidence implies — who it implicates, why it may be unreliable,`);
            lines.push(`           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.`);
          }
        }
      }
    } else {
      lines.push(`  - Clue obligations: none for this chapter.`);
    }

    // Fix 5: Interrogation differentiation — if this scene interrogates a suspect who was
    // already interrogated in a recent chapter, inject a mandatory differentiation directive.
    if (recentlyInterrogatedSuspects.size > 0) {
      const sceneText = [
        String(scene?.purpose ?? ''),
        String(scene?.description ?? ''),
        String(scene?.title ?? ''),
      ].join(' ').toLowerCase();
      if (INTERROGATION_VERBS_RE.test(sceneText)) {
        for (const suspectName of recentlyInterrogatedSuspects) {
          const lastName = (suspectName.split(' ').pop() ?? suspectName).toLowerCase();
          if (sceneText.includes(lastName) || sceneText.includes(suspectName.toLowerCase())) {
            lines.push(
              `  - ⛔ DIFFERENTIATION REQUIRED: ${suspectName} has already been questioned in a recent chapter.`,
              `    Do NOT re-stage the same confrontation style. Instead advance the investigation past it:`,
              `    • Examine physical evidence connected to ${suspectName}`,
              `    • Reveal a new contradiction in ${suspectName}'s account via a third party or document`,
              `    • Show ${suspectName} in an unguarded moment (not direct detective questioning)`,
              `    This chapter must establish new information not already given in prior ${suspectName} scenes.`,
            );
            break;
          }
        }
      }
    }

    // Tonal contrast — omit for discriminating test/revelation chapters that must sustain maximum tension
    if (!isDiscriminatingTestChapter) {
      lines.push(`  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.`);
    }

    // FIX-D2: Confrontation escalation rule — a second confrontation arc must differ materially.
    // Fires when the current macro-arc archetype is CONFRONTATION and a prior chapter already
    // used that archetype (detected via macroArcPlan).
    if (macroArcPlan) {
      const chapterNumForArc = chapterNumber;
      const arcEntry = macroArcPlan.find((e: any) => Number(e.chapter) === chapterNumForArc);
      const isConfrontationChapter = String(arcEntry?.archetype ?? '').toUpperCase() === 'CONFRONTATION';
      const priorConfrontation = macroArcPlan.some(
        (e: any) => Number(e.chapter) < chapterNumForArc && String(e.archetype ?? '').toUpperCase() === 'CONFRONTATION',
      );
      if (isConfrontationChapter && priorConfrontation) {
        lines.push(
          `  - ⛔ CONFRONTATION ESCALATION REQUIRED: a confrontation scene has already occurred in a prior chapter.`,
          `    This exchange MUST end differently. One of the following is required:`,
          `    (a) New physical evidence is produced or discovered during the exchange.`,
          `    (b) The suspect reveals a detail not stated anywhere in the story until now.`,
          `    (c) The investigator revises their theory as a direct result of this encounter.`,
          `    Do NOT write a confrontation that ends without new information entering the story.`,
        );
      }
    }

    // FIX-M3 + FIX-D1: Clue-stage embargo — restrict how much the LLM may reveal.
    if (clueStageForRun <= 3) {
      lines.push(`  - CLUE DISCLOSURE RULE (Stage ${clueStageForRun}/4):`);
      if (clueStageForRun === 1) {
        lines.push(`    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.`);
      } else if (clueStageForRun === 2) {
        lines.push(`    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.`);
      } else {
        lines.push(`    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.`);
      }
      lines.push(`    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.`);
      lines.push(`    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.`);
    }

    if (matchingClearances.length > 0) {
      lines.push(`  - ⚠ SUSPECT CLEARANCE REQUIRED (MANDATORY): each suspect below MUST be named explicitly and cleared with on-page evidence and a reasoning connector (because / therefore / which proves):`);
      for (const clearance of matchingClearances) {
        const realClueIds = Array.isArray(clearance.supporting_clues)
          ? (clearance.supporting_clues as string[]).filter((id: string) => id && !id.match(/^clue_id_\d+$/))
          : [];
        const clueRef = realClueIds.length > 0 ? ` Cite clues: ${realClueIds.join(', ')}.` : '';
        lines.push(`    • "${clearance.suspect_name}": write a dedicated paragraph that (a) names ${clearance.suspect_name} explicitly, (b) states the clearance method ("${clearance.clearance_method}"), (c) shows the supporting evidence using "because / therefore / which proves", and (d) the clearing event must be shown as an in-scene moment — a named witness, a physical record, or a witnessed observation. Asserting the alibi without showing how it was confirmed is not sufficient. Accepted clearance phrases: "cleared", "ruled out", "innocent", "alibi holds", "alibi confirmed", "could not have".${clueRef}`);
      }
    }
    // FIX-C3: Alibi consistency lock — culprit's established alibi window must not be contradicted.
    if (culpritAlibiLock.length > 0) {
      for (const { name, alibiWindow } of culpritAlibiLock) {
        lines.push(`  - ALIBI LOCK: ${name}'s established alibi is "${alibiWindow}". Do NOT place ${name} at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.`);
      }
    }
    // FIX-M2: Culprit testimony continuity — for chapters 2+, any specific time, place, or
    // claim already made by the culprit must not be altered or contradicted.
    if (chapterNumber > 1) {
      const _m2CulpritNames = ((cmlCase?.culpability?.culprits ?? []) as any[])
        .map((n: any) => String(n).trim())
        .filter(Boolean);
      if (_m2CulpritNames.length > 0) {
        const _m2List = _m2CulpritNames.join(' and ');
        lines.push(`  - TESTIMONY CONTINUITY: ${_m2List} has already made statements in earlier chapters. Any time, location, or claim attributed to ${_m2List} in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.`);
      }
    }
    if (isDiscriminatingTestChapter) {
      const dtDetails = cmlCase.discriminating_test ?? {};
      const dtMethod = dtDetails.method ?? 'confrontation';
      const dtDesign = typeof dtDetails.design === 'string' ? dtDetails.design : '';
      const dtEvidenceClues: string[] = Array.isArray(dtDetails.evidence_clues) && dtDetails.evidence_clues.length > 0
        ? (dtDetails.evidence_clues as any[]).filter((c: any) => typeof c === 'string' && c.trim())
        : ((cmlCase.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
            .filter((e: any) => Number(e?.act_number) === Number(dtScene?.act_number))
            .map((e: any) => String(e?.clue_id || ''))
            .filter(Boolean);
      const culpritNames: string = (cmlCase.culpability?.culprits ?? []).filter((n: any) => typeof n === 'string' && n).join(', ');
      const nonCulpritSuspects: string[] = (cmlCase.cast ?? [])
        .filter((c: any) => {
          if ((cmlCase.culpability?.culprits ?? []).includes(c.name)) return false;
          const role = String(c.role_archetype ?? c.role ?? '').toLowerCase();
          return !role.includes('detective') && !role.includes('victim');
        })
        .map((c: any) => c.name as string)
        .filter(Boolean);
      lines.push(`  - ⚠ DISCRIMINATING TEST (${dtMethod}) — MANDATORY real-time scene with dialogue and confrontation. DO NOT summarize it after the fact.`);
      if (culpritNames) lines.push(`    ⚠ CULPRIT-UNIQUENESS REQUIRED: the decisive evidence must expose a fact or physical characteristic that ONLY ${culpritNames} could satisfy. Announcing that the crime method occurred does NOT qualify. The test must reveal access, knowledge, or physical proof that eliminates all non-culprits before naming ${culpritNames}.`);
      if (dtDesign) lines.push(`    Mechanism: ${dtDesign}`);
      if (dtEvidenceClues.length > 0) lines.push(`    Cite these already-revealed clue IDs during the test: ${dtEvidenceClues.join(', ')}`);
      if (nonCulpritSuspects.length > 0) lines.push(`    Eliminate on-page with explicit evidence: ${nonCulpritSuspects.map((n) => `"${n}"`).join(', ')} — state EXACTLY why each is ruled out (because / therefore / which proves).`);
      if (culpritNames) lines.push(`    Convict: name "${culpritNames}" explicitly as the murderer. Connect every clue to them using "because / therefore / which proves".`);
      const dtCulpritEntry = (cmlCase.cast ?? []).find(
        (c: any) => (cmlCase.culpability?.culprits ?? []).includes(c.name)
      );
      const dtCulpritMotive = String(dtCulpritEntry?.motive_seed ?? '').trim();
      if (dtCulpritMotive) {
        lines.push(`    Motive statement REQUIRED: the culprit must explicitly state or acknowledge their motive during or immediately after the confrontation. Canonical motive: "${dtCulpritMotive}". Do not omit it.`);
      }
      lines.push(`    Required beats in order: (1) detective states the test logic, (2) test is executed as a scene beat, (3) each suspect's response is shown, (4) non-culprits eliminated with evidence, (5) culprit named and case sealed.`);
      // FIX-M1: Discriminating-test new-fact requirement — a DT chapter that only re-interrogates
      // known facts will be rejected. One new physical fact, object, or testimony is mandatory.
      lines.push(`    NEW OBSERVABLE FACT REQUIRED: this chapter MUST introduce exactly one physical fact, object, or testimony that has NOT appeared in any prior chapter. A discriminating-test chapter that only recapitulates known facts will be rejected and regenerated.`);
    }
    // Culprit revelation scene obligation — when this chapter contains the revelation scene
    // and it is not already the discriminating test chapter (which handles conviction above).
    const revelationScene = proseRequirements.culprit_revelation_scene ?? null;
    // BUG FIX: use perActSceneNum (same normalisation as isDiscriminatingTestChapter) so
    // CML per-act scene_number values match correctly.  Using the global sceneNumber caused
    // the reveal chapter to never be detected in multi-act stories, silently suppressing
    // the culprit revelation requirement and the TYPE 6-A motive injection.
    const isRevealChapter =
      !isDiscriminatingTestChapter &&
      revelationScene != null &&
      Number(revelationScene.act_number) === Number(scene?.act) &&
      Number(revelationScene.scene_number) === perActSceneNum;
    if (isRevealChapter) {
      const culpritNames: string = (cmlCase.culpability?.culprits ?? []).filter((n: any) => typeof n === 'string' && n).join(', ');
      const revealMethod: string = revelationScene.revelation_method ?? 'confrontation with evidence';
      lines.push(`  - ⚠ CULPRIT REVELATION REQUIRED (${revealMethod}): this chapter MUST name "${culpritNames}" explicitly as the murderer before the chapter ends. Include a complete evidence chain using "because / therefore / which proves" for each piece of proof. Do not let the chapter end with the culprit unnamed or the verdict ambiguous.`);
      const revealCulpritEntry = (cmlCase.cast ?? []).find(
        (c: any) => (cmlCase.culpability?.culprits ?? []).includes(c.name)
      );
      const revealCulpritMotive = String(revealCulpritEntry?.motive_seed ?? '').trim();
      if (revealCulpritMotive) {
        lines.push(`  - Motive statement REQUIRED: the culprit must explicitly state or acknowledge their motive in this chapter. Canonical motive: "${revealCulpritMotive}". Do not paraphrase or omit it.`);
      }
      // FIX-M2 + FIX-E1: Strengthen revelation completeness — require evidence chain and kill statement.
      lines.push(`  - ⚠ EVIDENCE CHAIN REQUIRED: before or during the confession the detective must summarise the evidence chain — stating at minimum: (a) the mechanism of death, (b) how the culprit accessed the victim, (c) the motive, and (d) why all other suspects are excluded.`);
      lines.push(`  - ⚠ KILL STATEMENT REQUIRED: the culprit must use or strongly imply a specific act verb — "I killed", "I poisoned", "I struck", "I administered" — within 3 sentences of naming the victim. Passive constructions ("the death occurred", "she was found") are NOT sufficient. The culprit's agency must be explicit.`);
      lines.push(`  - ⚠ PRONOUN RESOLUTION: any pronoun in the confession that refers to a third party ("protect him", "because of her") must be resolved by naming the character in the same sentence.`);
    }
    // §3.3b: Sensory obligation injection
    const selectedVariant = sensoryVariantsByChapter?.[chapterNumber];
    if (selectedVariant) {
      lines.push(
        `  - Sensory obligation — use at least two of: ` +
        `${(selectedVariant.sights ?? []).slice(0, 2).join(', ')} | ` +
        `${(selectedVariant.sounds ?? []).slice(0, 2).join(', ')} | ` +
        `${(selectedVariant.smells ?? []).slice(0, 1).join(', ')}. ` +
        `Mood: ${selectedVariant.mood ?? ''}.`,
      );
    }
  });

  // §4.4: Tonal contrast enforcement — when two consecutive chapters are both high-tension,
  // inject an explicit relief instruction (stronger than the existing per-chapter tonal hint).
  if (
    currentArcPosition &&
    narrativeState?.previousChapterArcPosition &&
    HIGH_TENSION_POSITIONS.has(narrativeState.previousChapterArcPosition) &&
    HIGH_TENSION_POSITIONS.has(currentArcPosition)
  ) {
    const humourEntry = Array.isArray(worldDoc?.humourPlacementMap)
      ? worldDoc.humourPlacementMap.find(
          (e: any) => e.scenePosition === ARC_POS_TO_SCENE_TYPE[currentArcPosition],
        )
      : undefined;
    if (humourEntry?.humourPermission !== 'forbidden' && humourEntry?.permittedCharacters?.length > 0) {
      lines.push(
        `\n- Tonal contrast required: the previous chapter was high-tension. ` +
        `${humourEntry.permittedCharacters[0]} may use ${humourEntry.permittedForms?.[0] ?? 'understatement'} ` +
        `to provide a brief moment of relief before tension resumes.`,
      );
    } else {
      lines.push(
        `\n- Tonal contrast required: the previous chapter was high-tension. ` +
        `This chapter must include at least one beat of relief, pause, or quiet observation.`,
      );
    }
  }

  if ((lockedFacts ?? []).length > 0) {
    lines.push('- Locked fact phrase obligations:');
    (lockedFacts ?? []).slice(0, 8).forEach((fact) => {
      lines.push(`  - If this batch mentions ${fact.description}, write exactly: "${fact.value}".`);
    });
  }

  if (temporalLock) {
    lines.push(`- Seasonal vocabulary allow-list: ${getSeasonAllowList(temporalLock.season)}.`);
    lines.push(`- Forbidden seasonal words: ${['spring', 'summer', 'autumn', 'winter'].filter((s) => s !== temporalLock.season).join(', ')}.`);
  }

  // FIX-P1: Beat uniqueness guard — list beats committed in prior chapters so the LLM
  // does not repeat the same chapter purpose (e.g., two alibi-probe chapters in a row).
  const usedBeatsList = narrativeState?.beatHistory
    ?.map((b: any) => {
      const label = String(b.archetypeLabel ?? b.label ?? b.purpose ?? '').trim();
      const ch = Number(b.chapterNumber ?? b.chapter ?? 0);
      return label ? `Ch${ch}: ${label}` : null;
    })
    .filter(Boolean) as string[] | undefined;
  if (usedBeatsList && usedBeatsList.length > 0) {
    lines.push(`- BEATS ALREADY PLAYED — do not make any of the following the primary purpose of this chapter:`);
    for (const beat of usedBeatsList) {
      lines.push(`  • ${beat}`);
    }
    lines.push(`  If this chapter's primary purpose would duplicate a beat above, shift the focus: introduce new evidence, a new witness angle, or a change in the investigator's theory.`);
  }

  // Fix-3: DT-Fallback reminder — when we are in the final arc window (pre_climax /
  // climax) and the CML defines a discriminating test, remind the LLM to stage it as a
  // concrete scene before the story ends. Prevents cml_test_not_realized when the exact
  // act/scene coordinate match in buildDiscriminatingTestChecklist misses by one scene.
  if (dtScene && (currentArcPosition === 'pre_climax' || currentArcPosition === 'climax')) {
    const dtMethod = String(cmlCase?.discriminating_test?.method ?? cmlCase?.discriminating_test?.test_type ?? '').trim();
    if (dtMethod) {
      lines.push(`\n⚠ DISCRIMINATING TEST WINDOW: The story's "${dtMethod}" test MUST be staged as a concrete scene before the story ends. If this chapter has not yet performed it, do so now — do not defer to a later chapter. A post-hoc summary is NOT acceptable.`);
    }
  }

  // Phase 6 Layer 1: Resolution chapter mandatory checklist
  if (currentArcPosition === 'resolution') {
    const culpritNames: string = ((cmlCase?.culpability?.culprits ?? []) as string[]).filter((n) => typeof n === 'string' && n).join(', ');
    const murderMethod: string = cmlCase?.hidden_model?.mechanism?.description ?? 'the crime method';
    lines.push(`\n⛔ MANDATORY RESOLUTION — THIS IS THE FINAL CHAPTER:`);
    lines.push(`  Five events MUST appear as on-page prose (not offstage summary):`);
    lines.push(`  1. ACCUSATION: The detective names ${culpritNames || 'the culprit'} and states the charge.`);
    lines.push(`  2. CULPRIT RESPONSE: ${culpritNames || 'The culprit'} confesses with detail, or reacts in a way that confirms guilt.`);
    lines.push(`  3. METHOD: State exactly how "${murderMethod}" was used — specific, not vague.`);
    lines.push(`  4. CONSEQUENCE: What happens to ${culpritNames || 'the culprit'} (arrested, fled, taken into custody).`);
    lines.push(`  5. AFTERMATH: At least one other character reacts emotionally to the truth.`);
    lines.push(`  A chapter submitted without all five will be rejected and regenerated.`);
    // FIX-2: Mandatory per-suspect clearance in final chapter.
    // gpt-4.1-mini efficiently places clearances in earlier chapters and writes Chapter 10
    // as pure resolution, causing the final lint gate to fail. Force explicit clearances here.
    const _resCulpritSet = new Set<string>(
      ((cmlCase?.culpability?.culprits ?? []) as any[])
        .map((n: any) => String(n).trim())
        .filter(Boolean)
    );
    const _resVictimSet = new Set<string>(
      ((cmlCase?.cast ?? []) as any[])
        .filter((c: any) => String(c.role_archetype ?? c.role ?? '').toLowerCase().includes('victim'))
        .map((c: any) => String(c.name ?? '').trim())
        .filter(Boolean)
    );
    const finalChapterSuspects: string[] = ((cmlCase?.cast ?? []) as any[])
      .filter((c: any) => {
        const name = String(c.name ?? '').trim();
        if (_resCulpritSet.has(name)) return false;
        if (_resVictimSet.has(name)) return false;
        const role = String(c.role_archetype ?? c.role ?? '').toLowerCase();
        // FIX-2 patch: detectives must also be cleared in the resolution chapter because
        // the lint gate (matchingClearances from suspect_clearance_scenes) checks ALL
        // non-culprit, non-victim characters. Without an explicit obligation the LLM uses
        // first-person speech which omits the detective's own name, failing the name gate.
        return !role.includes('narrator');
      })
      .map((c: any) => String(c.name ?? '').trim())
      .filter(Boolean);
    if (finalChapterSuspects.length > 0) {
      lines.push(`  6. SUSPECT CLEARANCES (MANDATORY — lint-enforced): every non-culprit suspect below MUST be named explicitly and cleared in a dedicated paragraph in THIS chapter:`);
      for (const suspectName of finalChapterSuspects) {
        lines.push(`    • "${suspectName}" — include a paragraph that: (a) names "${suspectName}" by name, (b) states a clearance phrase (cleared / ruled out / innocent / alibi holds / alibi confirmed / could not have), (c) includes a reasoning connector (because / therefore / which proves / alibi). Example: "${suspectName} was cleared because [evidence]; [their] alibi confirmed [they] could not have committed the crime." All three elements must be in the SAME paragraph — do not split across paragraphs.`);
      }
      lines.push(`  Items 1–6 are ALL mandatory. A chapter missing any item will be rejected and regenerated.`);
    }
  }

  // F6a/F6b: Compact pronoun table reminder — appended to every chapter's obligation block
  // so the gender anchors are adjacent to the generation instruction regardless of context depth.
  // Full 10-rule contract is in the pronoun_accuracy block (priority: critical); this is a
  // lightweight re-check cue for Chapters 5+ where that block is buried in the context window.
  const castForPronouns: any[] = ((cmlCase?.cast ?? []) as any[]).filter(
    (c: any) => c.gender?.toLowerCase() === 'male' || c.gender?.toLowerCase() === 'female'
  );
  if (castForPronouns.length > 0) {
    const compactTable = castForPronouns
      .map((c: any) => {
        const pronouns = c.gender.toLowerCase() === 'male' ? 'he/him/his' : 'she/her/her';
        return `    ${c.name}: ${pronouns}`;
      })
      .join('\n');
    lines.push(`\n⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:`);
    lines.push(compactTable);
    lines.push(`  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.`);
  }

  return `\n\n${lines.join('\n')}`;
}
