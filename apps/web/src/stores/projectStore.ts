import { defineStore } from "pinia";
import { ref } from "vue";
import type { AllValidation, ProseData, RunEvent, ValidationResult, NoveltyAuditData, CharacterProfilesData } from "../components/types";
import {
  fetchCharacterProfiles,
  fetchCast,
  fetchCastValidation,
  fetchClues,
  fetchCluesValidation,
  fetchCml,
  fetchCmlValidation,
  fetchFairPlayReport,
  fetchGamePack,
  fetchLatestRun,
  fetchLlmLogs,
  fetchOutline,
  fetchOutlineValidation,
  fetchProse,
  fetchRunEvents,
  fetchSetting,
  fetchSettingValidation,
  fetchSynopsis,
  fetchNoveltyAudit,
  type Artifact,
  type LlmLogEntry,
} from "../services/api";

type LoadSummary = {
  failures: PromiseSettledResult<Artifact>[];
  hasNotFound: boolean;
  hasNetworkError: boolean;
  notFoundCount: number;
};

const defaultValidation: ValidationResult = { valid: true, errors: [], warnings: [] };

export const useProjectStore = defineStore("project", () => {
  const artifactsStatus = ref<"idle" | "loading" | "ready" | "partial" | "error">("idle");

  const cmlArtifact = ref<string | null>(null);
  const cluesArtifact = ref<string | null>(null);
  const outlineArtifact = ref<string | null>(null);
  const proseArtifact = ref<string | null>(null);
  const gamePackArtifact = ref<string | null>(null);
  const settingArtifact = ref<string | null>(null);
  const castArtifact = ref<string | null>(null);
  const characterProfilesArtifact = ref<string | null>(null);

  const settingData = ref<{ decade?: string; locationPreset?: string; weather?: string; socialStructure?: string } | null>(null);
  const castData = ref<{ suspects?: string[] } | null>(null);
  const cluesData = ref<{ summary?: string; items?: Array<{ id: string; category: string; text: string; pointsTo: string; redHerring: boolean; revealChapter?: number }> } | null>(null);
  const fairPlayReport = ref<{ summary?: string; checks?: Array<{ id: string; label: string; status: string }> } | null>(null);
  const outlineData = ref<{ chapters?: unknown } | null>(null);
  const synopsisData = ref<{ title?: string; summary?: string } | null>(null);
  const proseData = ref<ProseData | null>(null);
  const characterProfilesData = ref<CharacterProfilesData | null>(null);
  const noveltyAuditData = ref<NoveltyAuditData | null>(null);
  const gamePackData = ref<{ title?: string; suspects?: string[]; materials?: string[] } | null>(null);

  const runEventsData = ref<RunEvent[]>([]);
  const latestRunId = ref<string | null>(null);
  const llmLogs = ref<LlmLogEntry[]>([]);

  const allValidation = ref<AllValidation>({
    setting: { ...defaultValidation },
    cast: { ...defaultValidation },
    cml: { ...defaultValidation },
    clues: { ...defaultValidation },
    outline: { ...defaultValidation },
  });

  const normalizeSetting = (payload: any) => {
    if (!payload || typeof payload !== "object") return null;
    const era = payload.era ?? {};
    const location = payload.location ?? {};
    const atmosphere = payload.atmosphere ?? {};
    return {
      decade: payload.decade ?? era.decade,
      locationPreset: payload.locationPreset ?? location.type ?? location.description,
      weather: payload.weather ?? atmosphere.weather,
      socialStructure: payload.socialStructure ?? (Array.isArray(era.socialNorms) ? era.socialNorms[0] : undefined),
    };
  };

  const normalizeCast = (payload: any) => {
    if (!payload || typeof payload !== "object") return null;
    if (Array.isArray(payload.suspects)) {
      return { suspects: payload.suspects };
    }
    const characters = payload.cast?.characters ?? payload.characters ?? [];
    const suspects = Array.isArray(characters)
      ? characters
          .map((c: any) => c?.name)
          .filter((name: unknown): name is string => typeof name === "string" && name.trim().length > 0)
      : [];
    return { suspects };
  };

  const normalizeClues = (payload: any) => {
    if (!payload || typeof payload !== "object") return null;
    if (Array.isArray(payload.items)) {
      return payload as typeof cluesData.value;
    }
    const placementToChapter: Record<string, number> = { early: 1, mid: 2, late: 3 };
    const clues = Array.isArray(payload.clues) ? payload.clues : [];
    const redHerrings = Array.isArray(payload.redHerrings) ? payload.redHerrings : [];
    const items = [
      ...clues.map((clue: any) => ({
        id: clue.id ?? `clue_${Math.random().toString(36).slice(2, 8)}`,
        category: clue.category ?? "clue",
        text: clue.description ?? clue.text ?? "",
        pointsTo: clue.pointsTo ?? "",
        redHerring: false,
        revealChapter: placementToChapter[String(clue.placement ?? "")],
      })),
      ...redHerrings.map((rh: any, index: number) => ({
        id: rh.id ?? `rh_${index + 1}`,
        category: "red herring",
        text: rh.description ?? "",
        pointsTo: rh.supportsAssumption ?? rh.misdirection ?? "",
        redHerring: true,
        revealChapter: 1,
      })),
    ];
    return { summary: payload.summary, items };
  };

  const normalizeOutline = (payload: any) => {
    if (!payload || typeof payload !== "object") return null;
    if (Array.isArray(payload.chapters)) {
      return payload as typeof outlineData.value;
    }
    const acts = Array.isArray(payload.acts) ? payload.acts : [];
    const chapters = acts.flatMap((act: any) => {
      const scenes = Array.isArray(act.scenes) ? act.scenes : [];
      return scenes.map((scene: any, index: number) => ({
        title: scene.title ?? `Scene ${scene.sceneNumber ?? index + 1}`,
        summary: scene.summary ?? scene.purpose ?? "",
        events: scene.cluesRevealed ?? [],
      }));
    });
    return { chapters };
  };

  const normalizeProse = (payload: any, fallbackTitle?: string): ProseData | null => {
    if (!payload || typeof payload !== "object") return null;
    const chapters = Array.isArray(payload.chapters) ? payload.chapters : [];
    const normalizedChapters = chapters.map((chapter: any, index: number) => {
      const paragraphs = Array.isArray(chapter.paragraphs)
        ? chapter.paragraphs
        : typeof chapter.content === "string"
          ? chapter.content.split(/\n\n+/).filter(Boolean)
          : typeof chapter.text === "string"
            ? chapter.text.split(/\n\n+/).filter(Boolean)
            : [];
      return {
        title: chapter.title ?? `Chapter ${chapter.number ?? index + 1}`,
        summary: chapter.summary,
        paragraphs,
      };
    });
    return {
      status: payload.status ?? "generated",
      tone: payload.tone,
      chapters: normalizedChapters,
      cast: payload.cast,
      note: payload.note ?? payload.title ?? fallbackTitle,
    };
  };

  const normalizeCharacterProfiles = (payload: any): CharacterProfilesData | null => {
    if (!payload || typeof payload !== "object") return null;
    const profiles = Array.isArray(payload.profiles) ? payload.profiles : [];
    const normalizedProfiles = profiles.map((profile: any, index: number) => {
      const paragraphs = Array.isArray(profile.paragraphs)
        ? profile.paragraphs
        : typeof profile.text === "string"
          ? profile.text.split(/\n\n+/).filter(Boolean)
          : [];
      return {
        name: profile.name ?? `Character ${index + 1}`,
        summary: profile.summary,
        publicPersona: profile.publicPersona,
        privateSecret: profile.privateSecret,
        motiveSeed: profile.motiveSeed,
        alibiWindow: profile.alibiWindow,
        accessPlausibility: profile.accessPlausibility,
        stakes: profile.stakes,
        paragraphs,
        order: profile.order ?? index + 1,
      };
    });
    return {
      status: payload.status ?? "draft",
      tone: payload.tone,
      targetWordCount: payload.targetWordCount,
      profiles: normalizedProfiles,
      note: payload.note,
    };
  };

  const loadArtifacts = async (
    projectId: string,
    options: { includeCml?: boolean } = {},
  ): Promise<LoadSummary> => {
    artifactsStatus.value = "loading";

    const includeCml = options.includeCml ?? true;

    const [
      setting,
      cast,
      cml,
      validation,
      clues,
      fairPlay,
      outline,
      prose,
      characterProfiles,
      gamePack,
      synopsis,
      settingValidation,
      castValidation,
      cluesValidation,
      outlineValidation,
      noveltyAudit,
    ] = await Promise.allSettled([
      fetchSetting(projectId),
      fetchCast(projectId),
      includeCml ? fetchCml(projectId) : Promise.resolve(null as unknown as Artifact),
      includeCml ? fetchCmlValidation(projectId) : Promise.resolve(null as unknown as Artifact),
      fetchClues(projectId),
      fetchFairPlayReport(projectId),
      fetchOutline(projectId),
      fetchProse(projectId),
      fetchCharacterProfiles(projectId),
      fetchGamePack(projectId),
      fetchSynopsis(projectId),
      fetchSettingValidation(projectId),
      fetchCastValidation(projectId),
      fetchCluesValidation(projectId),
      fetchOutlineValidation(projectId),
      fetchNoveltyAudit(projectId),
    ]);

    const settingPayload = setting.status === "fulfilled" ? setting.value.payload : null;
    const castPayload = cast.status === "fulfilled" ? cast.value.payload : null;
    const cluesPayload = clues.status === "fulfilled" ? clues.value.payload : null;
    const outlinePayload = outline.status === "fulfilled" ? outline.value.payload : null;
    const prosePayload = prose.status === "fulfilled" ? prose.value.payload : null;
    const characterProfilesPayload = characterProfiles.status === "fulfilled" ? characterProfiles.value.payload : null;
    const synopsisPayload = synopsis.status === "fulfilled" ? (synopsis.value.payload as typeof synopsisData.value) : null;

    settingArtifact.value = setting.status === "fulfilled" ? JSON.stringify(setting.value.payload, null, 2) : null;
    settingData.value = normalizeSetting(settingPayload);

    castArtifact.value = cast.status === "fulfilled" ? JSON.stringify(cast.value.payload, null, 2) : null;
    castData.value = normalizeCast(castPayload);

    cmlArtifact.value = includeCml && cml.status === "fulfilled" ? JSON.stringify(cml.value.payload, null, 2) : null;

    allValidation.value = {
      setting: settingValidation.status === "fulfilled" ? (settingValidation.value.payload as ValidationResult) : { ...defaultValidation },
      cast: castValidation.status === "fulfilled" ? (castValidation.value.payload as ValidationResult) : { ...defaultValidation },
      cml: includeCml && validation.status === "fulfilled"
        ? (validation.value.payload as ValidationResult)
        : { ...defaultValidation },
      clues: cluesValidation.status === "fulfilled" ? (cluesValidation.value.payload as ValidationResult) : { ...defaultValidation },
      outline: outlineValidation.status === "fulfilled" ? (outlineValidation.value.payload as ValidationResult) : { ...defaultValidation },
    };

    cluesArtifact.value = clues.status === "fulfilled" ? JSON.stringify(clues.value.payload, null, 2) : null;
    cluesData.value = normalizeClues(cluesPayload);

    fairPlayReport.value = fairPlay.status === "fulfilled" ? (fairPlay.value.payload as typeof fairPlayReport.value) : null;

    outlineArtifact.value = outline.status === "fulfilled" ? JSON.stringify(outline.value.payload, null, 2) : null;
    outlineData.value = normalizeOutline(outlinePayload);

    proseArtifact.value = prose.status === "fulfilled" ? JSON.stringify(prose.value.payload, null, 2) : null;
    synopsisData.value = synopsisPayload;
    proseData.value = prose.status === "fulfilled" ? normalizeProse(prosePayload, synopsisPayload?.title) : null;

    characterProfilesArtifact.value = characterProfiles.status === "fulfilled"
      ? JSON.stringify(characterProfiles.value.payload, null, 2)
      : null;
    characterProfilesData.value = characterProfiles.status === "fulfilled"
      ? normalizeCharacterProfiles(characterProfilesPayload)
      : null;

    gamePackArtifact.value = gamePack.status === "fulfilled" ? JSON.stringify(gamePack.value.payload, null, 2) : null;
    gamePackData.value = gamePack.status === "fulfilled" ? (gamePack.value.payload as typeof gamePackData.value) : null;

    noveltyAuditData.value = noveltyAudit.status === "fulfilled" ? (noveltyAudit.value.payload as NoveltyAuditData) : null;

    const latestRun = await fetchLatestRun(projectId).catch(() => null);
    if (latestRun) {
      latestRunId.value = latestRun.id;
      const events = await fetchRunEvents(latestRun.id).catch(() => []);
      runEventsData.value = events;
    } else {
      latestRunId.value = null;
      runEventsData.value = [];
    }

    const candidates = [
      setting,
      cast,
      ...(includeCml ? [cml, validation] : []),
      clues,
      fairPlay,
      outline,
      prose,
      characterProfiles,
      gamePack,
      synopsis,
      settingValidation,
      castValidation,
      cluesValidation,
      outlineValidation,
      noveltyAudit,
    ];

    const failures = candidates.filter((result): result is PromiseSettledResult<Artifact> => result.status === "rejected");

    const failureReasons = failures
      .map((result) => (result.status === "rejected" ? result.reason : null))
      .filter((reason): reason is Error => reason instanceof Error);
    const notFoundCount = failureReasons.filter((reason) => reason.message.includes("(404)")).length;
    const hasNotFound = notFoundCount > 0;
    const hasNetworkError = failureReasons.some((reason) => reason.message.toLowerCase().includes("failed to fetch"));

    if (failures.length === 0) {
      artifactsStatus.value = "ready";
    } else if (failures.length === 16) {
      if (hasNotFound || hasNetworkError) {
        artifactsStatus.value = "error";
      } else {
        artifactsStatus.value = "idle";
      }
    } else if (failures.length < 5) {
      artifactsStatus.value = "partial";
    } else {
      artifactsStatus.value = "error";
    }

    return { failures, hasNotFound, hasNetworkError, notFoundCount };
  };

  const loadRunEvents = async (projectId: string) => {
    const latestRun = await fetchLatestRun(projectId).catch(() => null);
    if (latestRun) {
      latestRunId.value = latestRun.id;
      const events = await fetchRunEvents(latestRun.id).catch(() => []);
      runEventsData.value = events;
      return;
    }
    latestRunId.value = null;
    runEventsData.value = [];
  };

  const resetValidation = () => {
    allValidation.value = {
      setting: { ...defaultValidation },
      cast: { ...defaultValidation },
      cml: { ...defaultValidation },
      clues: { ...defaultValidation },
      outline: { ...defaultValidation },
    };
  };

  const loadLlmLogs = async (projectId?: string | null, limit = 200) => {
    llmLogs.value = await fetchLlmLogs(projectId, limit);
  };

  const clearAll = () => {
    artifactsStatus.value = "idle";
    cmlArtifact.value = null;
    cluesArtifact.value = null;
    outlineArtifact.value = null;
    proseArtifact.value = null;
    characterProfilesArtifact.value = null;
    gamePackArtifact.value = null;
    settingArtifact.value = null;
    castArtifact.value = null;
    settingData.value = null;
    castData.value = null;
    cluesData.value = null;
    fairPlayReport.value = null;
    outlineData.value = null;
    synopsisData.value = null;
    proseData.value = null;
    characterProfilesData.value = null;
    noveltyAuditData.value = null;
    gamePackData.value = null;
    runEventsData.value = [];
    latestRunId.value = null;
    llmLogs.value = [];
    resetValidation();
  };

  return {
    artifactsStatus,
    cmlArtifact,
    cluesArtifact,
    outlineArtifact,
    proseArtifact,
    characterProfilesArtifact,
    gamePackArtifact,
    settingArtifact,
    castArtifact,
    settingData,
    castData,
    cluesData,
    fairPlayReport,
    outlineData,
    synopsisData,
    proseData,
    characterProfilesData,
    noveltyAuditData,
    gamePackData,
    runEventsData,
    latestRunId,
    llmLogs,
    allValidation,
    loadArtifacts,
    loadRunEvents,
    loadLlmLogs,
    resetValidation,
    clearAll,
  };
});
