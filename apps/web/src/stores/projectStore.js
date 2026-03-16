import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchBackgroundContext, fetchCharacterProfiles, fetchCast, fetchCastValidation, fetchClues, fetchCluesValidation, fetchCml, fetchCmlValidation, fetchFairPlayReport, fetchGamePack, fetchHardLogicDevices, fetchLatestRun, fetchLlmLogs, fetchLocationProfiles, fetchOutline, fetchOutlineValidation, fetchProse, fetchRunEvents, fetchSetting, fetchSettingValidation, fetchSynopsis, fetchTemporalContext, fetchNoveltyAudit, } from "../services/api";
const defaultValidation = { valid: true, errors: [], warnings: [] };
export const useProjectStore = defineStore("project", () => {
    const artifactsStatus = ref("idle");
    const cmlArtifact = ref(null);
    const cluesArtifact = ref(null);
    const outlineArtifact = ref(null);
    const proseArtifact = ref(null);
    const gamePackArtifact = ref(null);
    const settingArtifact = ref(null);
    const castArtifact = ref(null);
    const characterProfilesArtifact = ref(null);
    const locationProfilesArtifact = ref(null);
    const temporalContextArtifact = ref(null);
    const backgroundContextArtifact = ref(null);
    const hardLogicDevicesArtifact = ref(null);
    const settingData = ref(null);
    const castData = ref(null);
    const cluesData = ref(null);
    const fairPlayReport = ref(null);
    const outlineData = ref(null);
    const synopsisData = ref(null);
    const proseData = ref(null);
    const characterProfilesData = ref(null);
    const locationProfilesData = ref(null);
    const temporalContextData = ref(null);
    const backgroundContextData = ref(null);
    const hardLogicDevicesData = ref(null);
    const noveltyAuditData = ref(null);
    const gamePackData = ref(null);
    const runEventsData = ref([]);
    const latestRunId = ref(null);
    const llmLogs = ref([]);
    const allValidation = ref({
        setting: { ...defaultValidation },
        cast: { ...defaultValidation },
        cml: { ...defaultValidation },
        clues: { ...defaultValidation },
        outline: { ...defaultValidation },
    });
    const normalizeSetting = (payload) => {
        if (!payload || typeof payload !== "object")
            return null;
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
    const normalizeCast = (payload) => {
        if (!payload || typeof payload !== "object")
            return null;
        if (Array.isArray(payload.suspects)) {
            return { suspects: payload.suspects };
        }
        const characters = payload.cast?.characters ?? payload.characters ?? [];
        const suspects = Array.isArray(characters)
            ? characters
                .map((c) => c?.name)
                .filter((name) => typeof name === "string" && name.trim().length > 0)
            : [];
        return { suspects };
    };
    const normalizeClues = (payload) => {
        if (!payload || typeof payload !== "object")
            return null;
        if (Array.isArray(payload.items)) {
            return payload;
        }
        const placementToChapter = { early: 1, mid: 2, late: 3 };
        const clues = Array.isArray(payload.clues) ? payload.clues : [];
        const redHerrings = Array.isArray(payload.redHerrings) ? payload.redHerrings : [];
        const items = [
            ...clues.map((clue) => ({
                id: clue.id ?? `clue_${Math.random().toString(36).slice(2, 8)}`,
                category: clue.category ?? "clue",
                text: clue.description ?? clue.text ?? "",
                pointsTo: clue.pointsTo ?? "",
                redHerring: false,
                revealChapter: placementToChapter[String(clue.placement ?? "")],
            })),
            ...redHerrings.map((rh, index) => ({
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
    const normalizeOutline = (payload) => {
        if (!payload || typeof payload !== "object")
            return null;
        if (Array.isArray(payload.chapters)) {
            return payload;
        }
        const acts = Array.isArray(payload.acts) ? payload.acts : [];
        const chapters = acts.flatMap((act) => {
            const scenes = Array.isArray(act.scenes) ? act.scenes : [];
            return scenes.map((scene, index) => ({
                title: scene.title ?? `Scene ${scene.sceneNumber ?? index + 1}`,
                summary: scene.summary ?? scene.purpose ?? "",
                events: scene.cluesRevealed ?? [],
            }));
        });
        return { chapters };
    };
    const normalizeProse = (payload, fallbackTitle) => {
        if (!payload || typeof payload !== "object")
            return null;
        const chapters = Array.isArray(payload.chapters) ? payload.chapters : [];
        const normalizedChapters = chapters.map((chapter, index) => {
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
    const normalizeCharacterProfiles = (payload) => {
        if (!payload || typeof payload !== "object")
            return null;
        const profiles = Array.isArray(payload.profiles) ? payload.profiles : [];
        const normalizedProfiles = profiles.map((profile, index) => {
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
                humourStyle: profile.humourStyle,
                humourLevel: typeof profile.humourLevel === "number" ? profile.humourLevel : undefined,
                speechMannerisms: profile.speechMannerisms,
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
    const normalizeHardLogicDevices = (payload) => {
        if (!payload || typeof payload !== "object")
            return null;
        const devices = Array.isArray(payload.devices)
            ? payload.devices
            : [];
        return {
            status: payload.status ?? "ok",
            overview: typeof payload.overview === "string" ? payload.overview : "",
            devices,
        };
    };
    const loadArtifacts = async (projectId, options = {}) => {
        artifactsStatus.value = "loading";
        const latestRun = await fetchLatestRun(projectId).catch(() => null);
        if (!latestRun) {
            latestRunId.value = null;
            runEventsData.value = [];
            artifactsStatus.value = "idle";
            cmlArtifact.value = null;
            cluesArtifact.value = null;
            outlineArtifact.value = null;
            proseArtifact.value = null;
            characterProfilesArtifact.value = null;
            locationProfilesArtifact.value = null;
            temporalContextArtifact.value = null;
            backgroundContextArtifact.value = null;
            hardLogicDevicesArtifact.value = null;
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
            locationProfilesData.value = null;
            temporalContextData.value = null;
            backgroundContextData.value = null;
            hardLogicDevicesData.value = null;
            noveltyAuditData.value = null;
            gamePackData.value = null;
            resetValidation();
            return { failures: [], hasNotFound: false, hasNetworkError: false, notFoundCount: 0 };
        }
        const includeCml = options.includeCml ?? true;
        const [setting, cast, cml, validation, clues, fairPlay, outline, prose, characterProfiles, locationProfiles, temporalContext, backgroundContext, hardLogicDevices, gamePack, synopsis, noveltyAudit, settingValidation, castValidation, cluesValidation, outlineValidation,] = await Promise.allSettled([
            fetchSetting(projectId),
            fetchCast(projectId),
            includeCml ? fetchCml(projectId) : Promise.resolve(null),
            includeCml ? fetchCmlValidation(projectId) : Promise.resolve(null),
            fetchClues(projectId),
            fetchFairPlayReport(projectId),
            fetchOutline(projectId),
            fetchProse(projectId),
            fetchCharacterProfiles(projectId),
            fetchLocationProfiles(projectId),
            fetchTemporalContext(projectId),
            fetchBackgroundContext(projectId),
            fetchHardLogicDevices(projectId),
            fetchGamePack(projectId),
            fetchSynopsis(projectId),
            fetchNoveltyAudit(projectId),
            fetchSettingValidation(projectId),
            fetchCastValidation(projectId),
            fetchCluesValidation(projectId),
            fetchOutlineValidation(projectId),
        ]);
        const settingPayload = setting.status === "fulfilled" ? setting.value.payload : null;
        const castPayload = cast.status === "fulfilled" ? cast.value.payload : null;
        const cluesPayload = clues.status === "fulfilled" ? clues.value.payload : null;
        const outlinePayload = outline.status === "fulfilled" ? outline.value.payload : null;
        const prosePayload = prose.status === "fulfilled" ? prose.value.payload : null;
        const characterProfilesPayload = characterProfiles.status === "fulfilled" ? characterProfiles.value.payload : null;
        const synopsisPayload = synopsis.status === "fulfilled" ? synopsis.value.payload : null;
        settingArtifact.value = setting.status === "fulfilled" ? JSON.stringify(setting.value.payload, null, 2) : null;
        settingData.value = normalizeSetting(settingPayload);
        castArtifact.value = cast.status === "fulfilled" ? JSON.stringify(cast.value.payload, null, 2) : null;
        castData.value = normalizeCast(castPayload);
        cmlArtifact.value = includeCml && cml.status === "fulfilled" ? JSON.stringify(cml.value.payload, null, 2) : null;
        allValidation.value = {
            setting: settingValidation.status === "fulfilled"
                ? settingValidation.value.payload
                : { ...defaultValidation },
            cast: castValidation.status === "fulfilled"
                ? castValidation.value.payload
                : { ...defaultValidation },
            cml: includeCml && validation.status === "fulfilled"
                ? validation.value.payload
                : { ...defaultValidation },
            clues: cluesValidation.status === "fulfilled"
                ? cluesValidation.value.payload
                : { ...defaultValidation },
            outline: outlineValidation.status === "fulfilled"
                ? outlineValidation.value.payload
                : { ...defaultValidation },
        };
        cluesArtifact.value = clues.status === "fulfilled" ? JSON.stringify(clues.value.payload, null, 2) : null;
        cluesData.value = normalizeClues(cluesPayload);
        fairPlayReport.value = fairPlay.status === "fulfilled" ? fairPlay.value.payload : null;
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
        locationProfilesArtifact.value = locationProfiles.status === "fulfilled"
            ? JSON.stringify(locationProfiles.value.payload, null, 2)
            : null;
        locationProfilesData.value = locationProfiles.status === "fulfilled"
            ? locationProfiles.value.payload
            : null;
        temporalContextArtifact.value = temporalContext.status === "fulfilled"
            ? JSON.stringify(temporalContext.value.payload, null, 2)
            : null;
        temporalContextData.value = temporalContext.status === "fulfilled"
            ? temporalContext.value.payload
            : null;
        backgroundContextArtifact.value = backgroundContext.status === "fulfilled"
            ? JSON.stringify(backgroundContext.value.payload, null, 2)
            : null;
        backgroundContextData.value = backgroundContext.status === "fulfilled"
            ? backgroundContext.value.payload
            : null;
        hardLogicDevicesArtifact.value = hardLogicDevices.status === "fulfilled"
            ? JSON.stringify(hardLogicDevices.value.payload, null, 2)
            : null;
        hardLogicDevicesData.value = hardLogicDevices.status === "fulfilled"
            ? normalizeHardLogicDevices(hardLogicDevices.value.payload)
            : null;
        gamePackArtifact.value = gamePack.status === "fulfilled" ? JSON.stringify(gamePack.value.payload, null, 2) : null;
        gamePackData.value = gamePack.status === "fulfilled" ? gamePack.value.payload : null;
        noveltyAuditData.value = noveltyAudit.status === "fulfilled" ? noveltyAudit.value.payload : null;
        latestRunId.value = latestRun.id;
        const events = await fetchRunEvents(latestRun.id).catch(() => []);
        runEventsData.value = events;
        const candidates = [
            setting,
            cast,
            ...(includeCml ? [cml, validation] : []),
            clues,
            fairPlay,
            outline,
            prose,
            characterProfiles,
            locationProfiles,
            temporalContext,
            backgroundContext,
            hardLogicDevices,
            gamePack,
            synopsis,
            noveltyAudit,
        ];
        const failures = candidates.filter((result) => result.status === "rejected");
        const failureReasons = failures
            .map((result) => (result.status === "rejected" ? result.reason : null))
            .filter((reason) => reason instanceof Error);
        const notFoundCount = failureReasons.filter((reason) => reason.message.includes("(404)")).length;
        const hasNotFound = notFoundCount > 0;
        const hasNetworkError = failureReasons.some((reason) => reason.message.toLowerCase().includes("failed to fetch"));
        if (failures.length === 0) {
            artifactsStatus.value = "ready";
        }
        else if (failures.length === candidates.length) {
            if (hasNotFound || hasNetworkError) {
                artifactsStatus.value = "error";
            }
            else {
                artifactsStatus.value = "idle";
            }
        }
        else if (failures.length < 5) {
            artifactsStatus.value = "partial";
        }
        else {
            artifactsStatus.value = "error";
        }
        return { failures, hasNotFound, hasNetworkError, notFoundCount };
    };
    const loadRunEvents = async (projectId) => {
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
    const loadLlmLogs = async (projectId, limit = 200) => {
        llmLogs.value = await fetchLlmLogs(projectId, limit);
    };
    const clearAll = () => {
        artifactsStatus.value = "idle";
        cmlArtifact.value = null;
        cluesArtifact.value = null;
        outlineArtifact.value = null;
        proseArtifact.value = null;
        characterProfilesArtifact.value = null;
        locationProfilesArtifact.value = null;
        temporalContextArtifact.value = null;
        backgroundContextArtifact.value = null;
        hardLogicDevicesArtifact.value = null;
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
        locationProfilesData.value = null;
        temporalContextData.value = null;
        backgroundContextData.value = null;
        hardLogicDevicesData.value = null;
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
        locationProfilesArtifact,
        temporalContextArtifact,
        backgroundContextArtifact,
        hardLogicDevicesArtifact,
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
        locationProfilesData,
        temporalContextData,
        backgroundContextData,
        hardLogicDevicesData,
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
//# sourceMappingURL=projectStore.js.map