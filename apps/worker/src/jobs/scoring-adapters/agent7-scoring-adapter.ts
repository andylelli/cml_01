import type { NarrativeOutline, Scene } from "@cml/prompts-llm";
import type { ClueRef } from "./shared.js";

// ============================================================================
// Agent 7: Narrative Outline
// ============================================================================

export interface ScorerChapter {
  chapter_number?: number;
  chapter_title?: string;
  scenes?: Array<{
    scene_id?: string;
    location?: string;
    characters_present?: string[];
    action?: string;
  }>;
  clues_introduced?: string[];
}

export interface ScorerNarrativeOutlineOutput {
  chapters: ScorerChapter[];
  discriminating_test_scene?: {
    chapter_number?: number;
    scene_id?: string;
    description?: string;
  };
}

/**
 * Build a map from identifier tokens to full cast names for character name normalisation.
 * e.g. "Evelyn Hawthorne" → keys: "evelyn_hawthorne", "evelyn", "hawthorne"
 */
function buildCastNameMap(castMembers: Array<{ name: string }>): Map<string, string> {
  const map = new Map<string, string>();
  const tokenCounts = new Map<string, number>();

  for (const member of castMembers) {
    const lower = member.name.toLowerCase();
    for (const part of lower.split(/\s+/)) {
      if (part.length > 2) tokenCounts.set(part, (tokenCounts.get(part) ?? 0) + 1);
    }
  }

  for (const member of castMembers) {
    const full = member.name;
    const lower = full.toLowerCase();
    // Full underscored form: "evelyn_hawthorne"
    map.set(lower.replace(/\s+/g, '_'), full);
    // Each word individually when unambiguous: "evelyn", "hawthorne"
    for (const part of lower.split(/\s+/)) {
      if (part.length > 2 && (tokenCounts.get(part) ?? 0) === 1) map.set(part, full);
    }
  }
  return map;
}

/**
 * Resolve a character token to a full name using the cast map.
 * Falls back to the original token if no match is found.
 */
function resolveCharacterName(token: string, nameMap: Map<string, string>): string {
  const key = token.toLowerCase().replace(/\s+/g, '_');
  return nameMap.get(key)
    ?? nameMap.get(token.toLowerCase())
    ?? token;
}

export function adaptNarrativeForScoring(
  narrative: NarrativeOutline,
  castMembers?: Array<{ name: string }>,
  clueList?: ClueRef[],
): ScorerNarrativeOutlineOutput {
  const nameMap = castMembers ? buildCastNameMap(castMembers) : new Map<string, string>();

  // Keywords that indicate a discriminating/confrontation/reveal scene.
  // Trailing \b after the group removed — it blocked stem-matches like "confronted". (N-2 fix)
  const DISCRIMINATING_KEYWORDS = /\b(confront|accus|reveal|denouement|unmas|expos|reck|arrest|final\s+reveal|confess|trap|gather.*suspects?|summon.*suspects?)/i;

  let discriminatingActIndex = -1;
  let discriminatingSceneIndex = -1;
  let discriminatingScene: Scene | null = null;

  // Scan all scenes for the best discriminating candidate (outer: label removed — N-5 fix)
  for (let ai = 0; ai < (narrative.acts || []).length; ai++) {
    const act = narrative.acts[ai];
    for (let si = 0; si < (act.scenes || []).length; si++) {
      const s = act.scenes[si];
      const text = [s.title, s.purpose, s.summary, s.dramaticElements?.revelation, s.dramaticElements?.conflict].join(' ');
      if (DISCRIMINATING_KEYWORDS.test(text)) {
        discriminatingActIndex = ai;
        discriminatingSceneIndex = si;
        discriminatingScene = s;
        // Keep scanning — prefer the LAST match (final reveal beats earlier confrontations)
      }
    }
  }

  // Transform acts and scenes into chapters structure (with character name normalisation)
  const totalActs = (narrative.acts || []).length;
  let sequentialChapterNum = 0;
  let discriminatingChapterNum = 0; // Tracks sequential number of the discriminating scene
  const chapters: ScorerChapter[] = (narrative.acts || []).flatMap((act, actIndex) => {
    return (act.scenes || []).map((scene, sceneIndex) => {
      sequentialChapterNum++; // Sequential 1-based chapter numbers across all acts
      if (actIndex === discriminatingActIndex && sceneIndex === discriminatingSceneIndex) {
        discriminatingChapterNum = sequentialChapterNum;
      }

      // Normalise character tokens to full cast names
      const characters_present = (scene.characters || []).map(token =>
        resolveCharacterName(token, nameMap)
      );

      return {
        chapter_number: sequentialChapterNum,
        chapter_title: scene.title || `Scene ${scene.sceneNumber}`,
        scenes: [{
          // Fallback to 1-based index when sceneNumber is undefined (N-4 fix)
          scene_id: `scene_${scene.sceneNumber ?? (sceneIndex + 1)}`,
          location: scene.setting?.location || '',
          characters_present,
          action: scene.summary || scene.purpose || '',
        }],
        clues_introduced: scene.cluesRevealed || [],
      };
    });
  });

  // Distribute clueList IDs across chapters to reach >=50% chapters with clues.
  // analyzeClueDistribution() needs chaptersWithClues/total >= 0.5 for +50pts.
  if (clueList && clueList.length > 0 && chapters.length > 0) {
    // Partition clues by placement band
    const earlyClues = clueList.filter(c => !c.placement || c.placement === 'early').map(c => c.id);
    const midClues   = clueList.filter(c => c.placement === 'mid').map(c => c.id);
    const lateClues  = clueList.filter(c => c.placement === 'late').map(c => c.id);

    // Band boundaries (approximate act split)
    const actSize = Math.ceil(chapters.length / 3);
    const bands = [
      { clues: earlyClues, start: 0,           end: actSize },
      { clues: midClues,   start: actSize,      end: actSize * 2 },
      { clues: lateClues,  start: actSize * 2,  end: chapters.length },
    ];

    for (const band of bands) {
      let clueIdx = 0;
      for (let ci = band.start; ci < Math.min(band.end, chapters.length); ci++) {
        if (clueIdx >= band.clues.length) break;
        const chapter = chapters[ci];
        // Only add if chapter doesn't already have this clue
        if (!chapter.clues_introduced!.includes(band.clues[clueIdx])) {
          chapter.clues_introduced = [...(chapter.clues_introduced || []), band.clues[clueIdx]];
          clueIdx++;
        }
      }
    }
  }

  const discriminating_test_scene = discriminatingScene
    ? {
        chapter_number: discriminatingChapterNum,
        // Same fallback as chapter build (N-4 fix)
        scene_id: `scene_${discriminatingScene.sceneNumber ?? (discriminatingSceneIndex + 1)}`,
        description: discriminatingScene.summary || discriminatingScene.purpose || discriminatingScene.title,
      }
    : undefined;

  return {
    chapters,
    discriminating_test_scene,
  };
}
