/**
 * World-First scene enrichment: arc position and scene type per scene.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import type { NarrativeOutline, WorldDocumentResult } from "@cml/prompts-llm";

/**
 * Maps a normalised scene position (0.0–1.0) to the nearest storyEmotionalArc
 * turningPoints.position enum value.
 */
function toArcPosition(pos: number): string {
  // Thresholds aligned with buildWorldBriefBlock in agent9-prose.ts so that
  // the same story position resolves to the same arc label in both agents.
  if (pos <= 0.08) return 'opening';   // corresponds to chapterIndex <= 1 in a ~12-chapter story
  if (pos <= 0.25) return 'early';
  if (pos <= 0.40) return 'first_turn';
  if (pos <= 0.55) return 'mid';
  if (pos <= 0.70) return 'second_turn';
  if (pos <= 0.80) return 'pre_climax';
  if (pos < 1.00)  return 'climax';
  return 'resolution';
}

/**
 * Maps act number + scene-in-act to a humourPlacementMap scenePosition enum value.
 * Best-effort deterministic mapping.
 */
function toSceneType(act: 1 | 2 | 3, sceneInAct: number): string {
  if (act === 1 && sceneInAct === 1) return 'opening_scene';
  if (act === 1 && sceneInAct === 2) return 'first_investigation';
  if (act === 1) return 'first_interview';
  if (act === 2 && sceneInAct <= 2) return 'mid_investigation';
  if (act === 2 && sceneInAct <= 3) return 'tension_scene';
  if (act === 2) return 'pre_climax';
  if (act === 3 && sceneInAct === 1) return 'discriminating_test';
  if (act === 3 && sceneInAct === 2) return 'revelation';
  return 'resolution';
}

/**
 * Enriches every scene in the narrative outline with the six World-First fields
 * derived from the World Document:
 *   emotionalRegister, dominantCharacterNote, humourGuidance,
 *   eraTextureNote, locationRegisterNote
 *
 * NOTE: subtextNote is NOT set here — it requires creative LLM reasoning and
 * should already be present in the Agent 7 LLM output if the World Document
 * was passed to formatNarrative(). This function provides the deterministic
 * fallbacks for the five structurally-derivable fields.
 */
export function applyWorldFirstSceneEnrichment(
  narrative: NarrativeOutline,
  world: WorldDocumentResult,
): void {
  const acts = Array.isArray(narrative.acts) ? narrative.acts : [];
  const totalScenes = acts.reduce((n: number, a: any) =>
    n + (Array.isArray(a?.scenes) ? a.scenes.length : 0), 0);
  let sceneIndex = 0;

  for (const actBlock of acts) {
    const actNumber = (Number(actBlock?.actNumber) || (acts.indexOf(actBlock) + 1)) as 1 | 2 | 3;
    const scenes = Array.isArray(actBlock?.scenes) ? actBlock.scenes : [];

    for (let si = 0; si < scenes.length; si++) {
      const scene = scenes[si];
      const sceneInAct = si + 1;
      const position = totalScenes > 1 ? sceneIndex / (totalScenes - 1) : 0;

      // ── emotionalRegister ──────────────────────────────────────────────
      const arcPos = toArcPosition(position);
      const turningPoints = world.storyEmotionalArc?.turningPoints ?? [];
      const matchedTp = turningPoints.find((t: any) => t.position === arcPos)
        ?? turningPoints[Math.min(
          Math.floor(position * turningPoints.length),
          turningPoints.length - 1,
        )];
      (scene as any).emotionalRegister =
        matchedTp?.emotionalDescription ?? world.storyEmotionalArc?.dominantRegister ?? '';

      // ── dominantCharacterNote ──────────────────────────────────────────
      const sceneChars: string[] = Array.isArray((scene as any).characters)
        ? (scene as any).characters
        : [];
      const voiceMatch = (world.characterVoiceSketches ?? []).find((v: any) =>
        sceneChars.some((c) => c.toLowerCase().includes(v.name.toLowerCase())),
      );
      (scene as any).dominantCharacterNote = voiceMatch
        ? { name: voiceMatch.name, voiceRegister: voiceMatch.voiceDescription }
        : undefined;

      // ── humourGuidance ─────────────────────────────────────────────────
      const sceneType = toSceneType(actNumber, sceneInAct);
      const humourEntry = (world.humourPlacementMap ?? []).find(
        (h: any) => h.scenePosition === sceneType,
      );
      (scene as any).humourGuidance = humourEntry
        ? {
            permission: humourEntry.humourPermission,
            character: humourEntry.permittedCharacters?.[0] ?? undefined,
            form: humourEntry.permittedForms?.[0] ?? undefined,
            condition: humourEntry.condition ?? undefined,
          }
        : { permission: 'permitted' };

      // ── eraTextureNote ─────────────────────────────────────────────────
      const physicalConstraints: string[] =
        world.historicalMoment?.physicalConstraints ?? [];
      (scene as any).eraTextureNote = physicalConstraints.join('; ');

      // ── locationRegisterNote ───────────────────────────────────────────
      // Scene location lives at scene.setting.location (a name string);
      // scene.locationId does not exist in the narrative outline schema.
      const locationName: string =
        (scene as any).locationId ??
        (scene as any).setting?.location ??
        '';
      const locReg = (world.locationRegisters ?? []).find(
        (l: any) =>
          locationName
            ? l.locationId === locationName ||
              l.name?.toLowerCase() === locationName.toLowerCase()
            : false,
      );
      (scene as any).locationRegisterNote = locReg
        ? `${locReg.emotionalRegister} — ${locReg.cameraAngle}`
        : '';

      sceneIndex++;
    }
  }
}
