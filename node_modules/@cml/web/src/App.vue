<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import ExportPanel from "./components/ExportPanel.vue";
import {
  createProject,
  downloadGamePackPdf,
  fetchCast,
  fetchCastValidation,
  fetchCml,
  fetchCmlValidation,
  fetchClues,
  fetchCluesValidation,
  fetchHealth,
  fetchFairPlayReport,
  fetchGamePack,
  fetchLatestRun,
  fetchOutline,
  fetchOutlineValidation,
  fetchSampleContent,
  fetchSamples,
  fetchSetting,
  fetchSettingValidation,
  fetchProse,
  fetchRunEvents,
  regenerateArtifact,
  runPipeline,
  saveSpec,
} from "./services/api";
import { subscribeToRunEvents } from "./services/sse";

type Mode = "user" | "advanced" | "expert";
type View = "dashboard" | "builder" | "clues" | "outline" | "samples" | "cml";

const mode = ref<Mode>("user");
const currentView = ref<View>("dashboard");

const isAdvanced = computed(() => mode.value === "advanced" || mode.value === "expert");
const isExpert = computed(() => mode.value === "expert");

const advancedChecked = computed({
  get: () => isAdvanced.value,
  set: (checked: boolean) => handleAdvancedToggle(checked),
});

const expertChecked = computed({
  get: () => isExpert.value,
  set: (checked: boolean) => handleExpertToggle(checked),
});

const setMode = (nextMode: Mode) => {
  mode.value = nextMode;
};

const handleAdvancedToggle = (checked: boolean) => {
  if (checked) {
    if (mode.value !== "expert") {
      setMode("advanced");
    }
    return;
  }
  setMode("user");
};

const handleExpertToggle = (checked: boolean) => {
  if (checked) {
    setMode("expert");
    return;
  }
  setMode("advanced");
};

const setView = (nextView: View) => {
  currentView.value = nextView;
  actionMessage.value = `Viewing ${nextView}`;
};

const healthStatus = ref<"idle" | "ok" | "error">("idle");
const healthMessage = ref("Not checked");
const runStatus = ref("Idle • No active run");
const projectName = ref("Golden Age Prototype");
const projectId = ref<string | null>(null);
const latestSpecId = ref<string | null>(null);
const spec = ref({
  decade: "1930s",
  locationPreset: "CountryHouse",
  tone: "Cozy",
  castSize: 6,
  primaryAxis: "temporal",
});
const actionMessage = ref<string | null>(null);
const cmlArtifact = ref<string | null>(null);
const cluesArtifact = ref<string | null>(null);
const outlineArtifact = ref<string | null>(null);
const proseArtifact = ref<string | null>(null);
const gamePackArtifact = ref<string | null>(null);
const gamePackData = ref<{ title?: string; suspects?: string[]; materials?: string[] } | null>(null);
const settingArtifact = ref<string | null>(null);
const castArtifact = ref<string | null>(null);
const castData = ref<{ suspects?: string[] } | null>(null);
const cluesData = ref<{ summary?: string; items?: Array<{ id: string; category: string; text: string; pointsTo: string; redHerring: boolean; revealChapter?: number }> } | null>(null);
const fairPlayReport = ref<{ summary?: string; checks?: Array<{ id: string; label: string; status: string }> } | null>(null);
const outlineData = ref<{ chapters?: unknown } | null>(null);
const showRedHerrings = ref(true);
const playModeEnabled = ref(false);
const currentChapter = ref(1);
const validationErrors = ref<string[]>([]);
const stepValidation = ref<Record<string, string>>({});
const latestRunEvent = ref<string | null>(null);
const samples = ref<Array<{ id: string; name: string; filename: string }>>([]);
const selectedSample = ref<{ id: string; name: string; content: string } | null>(null);
const sampleError = ref<string | null>(null);
let unsubscribe: (() => void) | null = null;

const filteredClues = computed(() => {
  if (!cluesData.value?.items) return [];
  return cluesData.value.items.filter((item) => {
    const allowRedHerring = showRedHerrings.value || !item.redHerring;
    const allowChapter = !playModeEnabled.value || (item.revealChapter ?? 1) <= currentChapter.value;
    return allowRedHerring && allowChapter;
  });
});

const chapterOptions = computed(() => {
  const chapters = outlineData.value?.chapters;
  if (Array.isArray(chapters) && chapters.length > 0) {
    return chapters.map((_, index) => index + 1);
  }
  return [1, 2, 3];
});

const viewLabel = computed(() => {
  switch (currentView.value) {
    case "dashboard":
      return "Dashboard";
    case "builder":
      return "Builder";
    case "clues":
      return "Clue board";
    case "outline":
      return "Outline";
    case "samples":
      return "Samples";
    case "cml":
      return "CML Viewer";
    default:
      return "Dashboard";
  }
});

const maxChapter = computed(() => chapterOptions.value[chapterOptions.value.length - 1] ?? 1);

const nextChapter = () => {
  if (!playModeEnabled.value) return;
  currentChapter.value = Math.min(currentChapter.value + 1, maxChapter.value);
};

const prevChapter = () => {
  if (!playModeEnabled.value) return;
  currentChapter.value = Math.max(currentChapter.value - 1, 1);
};

watch(chapterOptions, (options) => {
  if (!options.includes(currentChapter.value)) {
    currentChapter.value = options[options.length - 1] ?? 1;
  }
});

const connectSse = () => {
  if (!projectId.value) {
    runStatus.value = "No project • create one first";
    return;
  }
  if (unsubscribe) {
    unsubscribe();
  }
  unsubscribe = subscribeToRunEvents(
    projectId.value,
    (payload) => {
      runStatus.value = `${payload.status} • project ${payload.projectId}`;
    },
    () => {
      runStatus.value = "Disconnected • retrying";
    },
  );
};

const disconnectSse = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
};

const checkHealth = async () => {
  healthStatus.value = "idle";
  try {
    const health = await fetchHealth();
    healthStatus.value = "ok";
    healthMessage.value = `${health.service} • ${health.status}`;
  } catch (error) {
    healthStatus.value = "error";
    healthMessage.value = "API unreachable";
  }
};

const handleCreateProject = async () => {
  actionMessage.value = null;
  try {
    const project = await createProject(projectName.value.trim() || "Untitled project");
    projectId.value = project.id;
    runStatus.value = `idle • project ${project.id}`;
    connectSse();
    actionMessage.value = `Project created (${project.id})`;
  } catch (error) {
    actionMessage.value = "Failed to create project";
  }
};

const handleSaveSpec = async () => {
  if (!projectId.value) {
    actionMessage.value = "Create a project first";
    return;
  }
  actionMessage.value = null;
  try {
    const saved = await saveSpec(projectId.value, spec.value);
    latestSpecId.value = saved.id;
    actionMessage.value = `Spec saved (${saved.id})`;
  } catch (error) {
    actionMessage.value = "Failed to save spec";
  }
};

const loadArtifacts = async () => {
  if (!projectId.value) return;
  const [
    setting,
    cast,
    cml,
    validation,
    clues,
    fairPlay,
    outline,
    prose,
    gamePack,
    settingValidation,
    castValidation,
    cluesValidation,
    outlineValidation,
  ] = await Promise.allSettled([
    fetchSetting(projectId.value),
    fetchCast(projectId.value),
    fetchCml(projectId.value),
    fetchCmlValidation(projectId.value),
    fetchClues(projectId.value),
    fetchFairPlayReport(projectId.value),
    fetchOutline(projectId.value),
    fetchProse(projectId.value),
    fetchGamePack(projectId.value),
    fetchSettingValidation(projectId.value),
    fetchCastValidation(projectId.value),
    fetchCluesValidation(projectId.value),
    fetchOutlineValidation(projectId.value),
  ]);

  settingArtifact.value = setting.status === "fulfilled" ? JSON.stringify(setting.value.payload, null, 2) : null;
  castArtifact.value = cast.status === "fulfilled" ? JSON.stringify(cast.value.payload, null, 2) : null;
  castData.value = cast.status === "fulfilled" ? (cast.value.payload as { suspects?: string[] }) : null;
  cmlArtifact.value = cml.status === "fulfilled" ? JSON.stringify(cml.value.payload, null, 2) : null;
  validationErrors.value =
    validation.status === "fulfilled" && validation.value.payload?.errors
      ? (validation.value.payload.errors as string[])
      : [];
  stepValidation.value = {
    setting:
      settingValidation.status === "fulfilled" && settingValidation.value.payload?.valid ? "ok" : "pending",
    cast: castValidation.status === "fulfilled" && castValidation.value.payload?.valid ? "ok" : "pending",
    clues:
      cluesValidation.status === "fulfilled" && cluesValidation.value.payload?.valid ? "ok" : "pending",
    outline:
      outlineValidation.status === "fulfilled" && outlineValidation.value.payload?.valid ? "ok" : "pending",
  };
  cluesArtifact.value = clues.status === "fulfilled" ? JSON.stringify(clues.value.payload, null, 2) : null;
  cluesData.value = clues.status === "fulfilled" ? (clues.value.payload as typeof cluesData.value) : null;
  fairPlayReport.value = fairPlay.status === "fulfilled" ? (fairPlay.value.payload as typeof fairPlayReport.value) : null;
  outlineArtifact.value = outline.status === "fulfilled" ? JSON.stringify(outline.value.payload, null, 2) : null;
  outlineData.value = outline.status === "fulfilled" ? (outline.value.payload as typeof outlineData.value) : null;
  proseArtifact.value = prose.status === "fulfilled" ? JSON.stringify(prose.value.payload, null, 2) : null;
  gamePackArtifact.value = gamePack.status === "fulfilled" ? JSON.stringify(gamePack.value.payload, null, 2) : null;
  gamePackData.value = gamePack.status === "fulfilled" ? (gamePack.value.payload as typeof gamePackData.value) : null;

  const latestRun = await fetchLatestRun(projectId.value).catch(() => null);
  if (latestRun) {
    const events = await fetchRunEvents(latestRun.id).catch(() => []);
    latestRunEvent.value = events.length ? events[events.length - 1].message : null;
  }
};

const handleRunPipeline = async () => {
  if (!projectId.value) {
    actionMessage.value = "Create a project first";
    return;
  }
  actionMessage.value = null;
  try {
    await runPipeline(projectId.value);
    await loadArtifacts();
    actionMessage.value = "Run started";
  } catch (error) {
    actionMessage.value = "Failed to start run";
  }
};

const handleRegenerate = async (scope: "setting" | "cast" | "clues" | "outline" | "prose") => {
  if (!projectId.value) {
    actionMessage.value = "Create a project first";
    return;
  }
  actionMessage.value = null;
  try {
    await regenerateArtifact(projectId.value, scope);
    await loadArtifacts();
    actionMessage.value = `${scope} regenerated`;
  } catch (error) {
    actionMessage.value = `Failed to regenerate ${scope}`;
  }
};

const handleDownloadGamePackPdf = async () => {
  if (!projectId.value) {
    actionMessage.value = "Create a project first";
    return;
  }
  try {
    const blob = await downloadGamePackPdf(projectId.value);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `game_pack_${projectId.value}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    actionMessage.value = "Failed to download game pack";
  }
};

const loadSamples = async () => {
  sampleError.value = null;
  try {
    samples.value = await fetchSamples();
  } catch (error) {
    sampleError.value = "Failed to load samples";
  }
};

const handleSampleSelect = async (id: string) => {
  sampleError.value = null;
  try {
    selectedSample.value = await fetchSampleContent(id);
  } catch (error) {
    sampleError.value = "Failed to load sample";
  }
};

onMounted(() => {
  checkHealth();
  connectSse();
  loadSamples();
});

onBeforeUnmount(() => {
  disconnectSse();
});
</script>

<template>
  <div class="min-h-screen">
    <div class="flex h-screen">
      <aside class="hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
        <div class="text-lg font-semibold">CML Whodunit Builder</div>
        <nav class="mt-6 space-y-1 text-sm">
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('dashboard')"
          >
            Dashboard
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'builder' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('builder')"
          >
            Builder
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'clues' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('clues')"
          >
            Clues
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'outline' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('outline')"
          >
            Outline
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'samples' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('samples')"
          >
            Samples
          </button>
          <button
            v-if="isAdvanced"
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'cml' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('cml')"
          >
            CML Viewer
          </button>
        </nav>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <div class="text-sm text-slate-500">Project</div>
            <div class="text-lg font-semibold">Golden Age Prototype</div>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <SwitchGroup as="div" class="flex items-center gap-2">
              <SwitchLabel class="text-slate-600">Advanced</SwitchLabel>
              <Switch
                v-model:checked="advancedChecked"
                class="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition data-[checked=true]:bg-slate-900"
              >
                <span class="sr-only">Enable Advanced mode</span>
                <span
                  class="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition data-[checked=true]:translate-x-6"
                />
              </Switch>
            </SwitchGroup>
            <SwitchGroup as="div" class="flex items-center gap-2">
              <SwitchLabel class="text-slate-600">Expert</SwitchLabel>
              <Switch
                v-model:checked="expertChecked"
                class="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition data-[checked=true]:bg-rose-600"
              >
                <span class="sr-only">Enable Expert mode</span>
                <span
                  class="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition data-[checked=true]:translate-x-6"
                />
              </Switch>
            </SwitchGroup>
            <div class="ml-2 text-xs text-slate-500">Mode: {{ mode }}</div>
          </div>
        </header>

        <main class="flex min-h-0 flex-1 gap-6 overflow-hidden bg-slate-50 px-6 py-6">
          <section class="flex min-w-0 flex-1 flex-col gap-6 overflow-auto">
            <div class="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <span class="font-semibold text-slate-700">{{ viewLabel }}</span>
              <span class="ml-2 text-xs text-slate-500">Use the sidebar to switch sections.</span>
            </div>
            <div v-if="currentView === 'dashboard' || currentView === 'builder'" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div class="text-sm font-medium text-slate-500">Status</div>
              <div class="mt-2 text-2xl font-semibold">Ready to generate</div>
              <div class="mt-1 text-sm text-slate-600">
                Choose settings, accept AI suggestions, then run the pipeline. Friendly projections will appear here by default.
              </div>
              <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                    healthStatus === 'ok' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
                  ]"
                >
                  API: {{ healthMessage }}
                </span>
                <button class="text-xs font-semibold text-slate-600 underline" @click="checkHealth">
                  Recheck API
                </button>
                <span v-if="actionMessage" class="text-xs text-slate-500">{{ actionMessage }}</span>
              </div>
              <div class="mt-4 flex flex-wrap gap-3">
                <button
                  class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  @click="handleRunPipeline"
                >
                  Generate
                </button>
                <button
                  class="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  @click="handleSaveSpec"
                >
                  Save draft
                </button>
              </div>
            </div>

            <div v-if="currentView === 'dashboard' || currentView === 'builder'" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Project setup</div>
              <div class="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label class="text-xs font-semibold text-slate-500">Project name</label>
                  <input
                    v-model="projectName"
                    class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Golden Age Prototype"
                  />
                </div>
                <div class="flex items-end">
                  <button
                    class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    @click="handleCreateProject"
                  >
                    Create project
                  </button>
                </div>
              </div>
              <div class="mt-3 text-xs text-slate-500">
                Project ID: {{ projectId ?? "not created" }} • Spec: {{ latestSpecId ?? "not saved" }}
              </div>
            </div>

            <div v-if="currentView === 'dashboard' || currentView === 'builder'" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Spec draft (Phase 1)</div>
              <div class="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label class="text-xs font-semibold text-slate-500">Decade</label>
                  <select v-model="spec.decade" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <option>1930s</option>
                    <option>1940s</option>
                    <option>1950s</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-semibold text-slate-500">Location preset</label>
                  <select v-model="spec.locationPreset" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <option>CountryHouse</option>
                    <option>SeasideHotel</option>
                    <option>Village</option>
                    <option>Liner</option>
                    <option>Theatre</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-semibold text-slate-500">Tone</label>
                  <select v-model="spec.tone" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <option>Cozy</option>
                    <option>Classic</option>
                    <option>Dark</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-semibold text-slate-500">Cast size</label>
                  <input
                    v-model.number="spec.castSize"
                    type="number"
                    min="4"
                    max="12"
                    class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label class="text-xs font-semibold text-slate-500">Primary axis</label>
                  <select v-model="spec.primaryAxis" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <option>temporal</option>
                    <option>spatial</option>
                    <option>identity</option>
                    <option>behavioral</option>
                    <option>authority</option>
                  </select>
                </div>
              </div>
              <div class="mt-4 text-xs text-slate-500">
                This is a minimal spec draft for Phase 1; additional fields will be added in later phases.
              </div>
            </div>

            <div v-if="currentView === 'dashboard'" class="grid gap-6 md:grid-cols-2">
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Setting overview</div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ settingArtifact ? "Setting placeholder stored" : "1936 • Country house • Autumn storm" }}
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Cast cards</div>
                <div v-if="castData?.suspects?.length" class="mt-3 grid gap-2 text-xs text-slate-700">
                  <div
                    v-for="suspect in castData.suspects"
                    :key="suspect"
                    class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div class="text-sm font-semibold">{{ suspect }}</div>
                    <div class="text-[11px] text-slate-500">Role: Suspect • Motive: pending</div>
                  </div>
                </div>
                <div v-else class="mt-2 text-sm text-slate-600">6 suspects • relationship map pending</div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Clue board</div>
                <div class="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div>{{ cluesData?.items?.length ? `${cluesData.items.length} clues` : "No clues generated yet" }}</div>
                  <div class="flex items-center gap-3">
                    <label class="flex items-center gap-2">
                      <input v-model="playModeEnabled" type="checkbox" />
                      Play mode
                    </label>
                    <label v-if="playModeEnabled" class="flex items-center gap-2">
                      <span>Chapter</span>
                      <select v-model.number="currentChapter" class="rounded border border-slate-200 px-2 py-1">
                        <option v-for="chapter in chapterOptions" :key="chapter" :value="chapter">
                          {{ chapter }}
                        </option>
                      </select>
                    </label>
                    <div v-if="playModeEnabled" class="flex items-center gap-2">
                      <button
                        class="rounded border border-slate-200 px-2 py-1 text-[11px]"
                        :disabled="currentChapter <= 1"
                        @click="prevChapter"
                      >
                        Prev
                      </button>
                      <button
                        class="rounded border border-slate-200 px-2 py-1 text-[11px]"
                        :disabled="currentChapter >= maxChapter"
                        @click="nextChapter"
                      >
                        Next
                      </button>
                      <span class="text-[11px] text-slate-400">{{ currentChapter }} / {{ maxChapter }}</span>
                    </div>
                    <label class="flex items-center gap-2">
                      <input v-model="showRedHerrings" type="checkbox" />
                      Show red herrings
                    </label>
                  </div>
                </div>
                <div v-if="filteredClues.length" class="mt-3 space-y-2 text-sm text-slate-700">
                  <div
                    v-for="clue in filteredClues"
                    :key="clue.id"
                    class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div class="flex items-center justify-between text-xs text-slate-500">
                      <span class="uppercase">{{ clue.category }}</span>
                      <span v-if="clue.redHerring" class="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        Red herring
                      </span>
                    </div>
                    <div class="mt-1 text-sm font-medium text-slate-700">{{ clue.text }}</div>
                    <div class="mt-1 text-[11px] text-slate-500">
                      Points to: {{ clue.pointsTo }} · Reveal: Chapter {{ clue.revealChapter ?? 1 }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Outline</div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ outlineArtifact ? "Outline placeholder stored" : "Outline will appear after validation" }}
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Fair-play report</div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ fairPlayReport ? fairPlayReport.summary : "Report will appear after clues" }}
                </div>
                <div v-if="fairPlayReport?.checks?.length" class="mt-3 space-y-1 text-xs text-slate-600">
                  <div v-for="check in fairPlayReport.checks" :key="check.id" class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full" :class="check.status === 'pass' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                    <span>{{ check.label }}</span>
                  </div>
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Game pack</div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ gamePackData?.title ?? "Game pack pending" }}
                </div>
                <div class="mt-2 text-xs text-slate-500">
                  {{ gamePackData?.suspects?.length ?? 0 }} suspects · {{ gamePackData?.materials?.length ?? 0 }} materials
                </div>
                <button
                  class="mt-3 rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!gamePackData || !projectId"
                  @click="handleDownloadGamePackPdf"
                >
                  Download PDF
                </button>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Community templates</div>
                <div v-if="sampleError" class="mt-2 text-xs text-rose-600">{{ sampleError }}</div>
                <div v-else class="mt-3 grid gap-2 text-xs text-slate-600">
                  <button
                    v-for="sample in samples"
                    :key="sample.id"
                    class="rounded-md border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                    @click="handleSampleSelect(sample.id)"
                  >
                    {{ sample.name }}
                  </button>
                </div>
                <pre
                  v-if="selectedSample"
                  class="mt-3 max-h-40 overflow-auto rounded bg-slate-900/5 p-2 text-[11px] text-slate-600"
                >{{ selectedSample.content }}</pre>
              </div>
            </div>

            <div v-if="currentView === 'clues'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Clue board</div>
              <div class="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div>{{ cluesData?.items?.length ? `${cluesData.items.length} clues` : "No clues generated yet" }}</div>
                <div class="flex items-center gap-3">
                  <label class="flex items-center gap-2">
                    <input v-model="playModeEnabled" type="checkbox" />
                    Play mode
                  </label>
                  <label v-if="playModeEnabled" class="flex items-center gap-2">
                    <span>Chapter</span>
                    <select v-model.number="currentChapter" class="rounded border border-slate-200 px-2 py-1">
                      <option v-for="chapter in chapterOptions" :key="chapter" :value="chapter">
                        {{ chapter }}
                      </option>
                    </select>
                  </label>
                  <div v-if="playModeEnabled" class="flex items-center gap-2">
                    <button
                      class="rounded border border-slate-200 px-2 py-1 text-[11px]"
                      :disabled="currentChapter <= 1"
                      @click="prevChapter"
                    >
                      Prev
                    </button>
                    <button
                      class="rounded border border-slate-200 px-2 py-1 text-[11px]"
                      :disabled="currentChapter >= maxChapter"
                      @click="nextChapter"
                    >
                      Next
                    </button>
                    <span class="text-[11px] text-slate-400">{{ currentChapter }} / {{ maxChapter }}</span>
                  </div>
                  <label class="flex items-center gap-2">
                    <input v-model="showRedHerrings" type="checkbox" />
                    Show red herrings
                  </label>
                </div>
              </div>
              <div v-if="filteredClues.length" class="mt-3 space-y-2 text-sm text-slate-700">
                <div
                  v-for="clue in filteredClues"
                  :key="clue.id"
                  class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div class="flex items-center justify-between text-xs text-slate-500">
                    <span class="uppercase">{{ clue.category }}</span>
                    <span v-if="clue.redHerring" class="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      Red herring
                    </span>
                  </div>
                  <div class="mt-1 text-sm font-medium text-slate-700">{{ clue.text }}</div>
                  <div class="mt-1 text-[11px] text-slate-500">
                    Points to: {{ clue.pointsTo }} · Reveal: Chapter {{ clue.revealChapter ?? 1 }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentView === 'outline'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Outline</div>
              <div class="mt-2 text-sm text-slate-600">
                {{ outlineArtifact ? "Outline placeholder stored" : "Outline will appear after validation" }}
              </div>
            </div>

            <div v-if="currentView === 'samples'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Community templates</div>
              <div v-if="sampleError" class="mt-2 text-xs text-rose-600">{{ sampleError }}</div>
              <div v-else class="mt-3 grid gap-2 text-xs text-slate-600">
                <button
                  v-for="sample in samples"
                  :key="sample.id"
                  class="rounded-md border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                  @click="handleSampleSelect(sample.id)"
                >
                  {{ sample.name }}
                </button>
              </div>
              <pre
                v-if="selectedSample"
                class="mt-3 max-h-40 overflow-auto rounded bg-slate-900/5 p-2 text-[11px] text-slate-600"
              >{{ selectedSample.content }}</pre>
            </div>

            <div v-if="currentView === 'cml'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">CML preview</div>
              <pre class="mt-2 max-h-96 overflow-auto rounded bg-slate-900/5 p-2 text-xs text-slate-700">
{{ cmlArtifact ?? "No CML available" }}
              </pre>
            </div>
          </section>

          <aside class="hidden w-80 flex-shrink-0 flex-col gap-4 md:flex">
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Run status</div>
              <div class="mt-2 text-sm text-slate-600">{{ runStatus }}</div>
              <div v-if="latestRunEvent" class="mt-2 text-xs text-slate-500">
                Latest event: {{ latestRunEvent }}
              </div>
              <div class="mt-3 flex gap-2">
                <button class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold" @click="connectSse">
                  Connect
                </button>
                <button class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold" @click="disconnectSse">
                  Disconnect
                </button>
              </div>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Validation</div>
              <div class="mt-2 text-sm text-slate-600">
                {{ cmlArtifact ? "CML stored; validation recorded" : "Checklist will populate after CML validation." }}
              </div>
              <ul v-if="validationErrors.length" class="mt-3 list-disc space-y-1 pl-4 text-xs text-rose-600">
                <li v-for="error in validationErrors" :key="error">{{ error }}</li>
              </ul>
              <div v-if="fairPlayReport?.checks?.length" class="mt-3">
                <div class="text-xs font-semibold text-slate-500">Fair-play report</div>
                <ul class="mt-2 space-y-1 text-xs text-slate-600">
                  <li v-for="check in fairPlayReport.checks" :key="check.id" class="flex items-center gap-2">
                    <span
                      class="h-2 w-2 rounded-full"
                      :class="check.status === 'pass' ? 'bg-emerald-500' : 'bg-amber-500'"
                    ></span>
                    <span>{{ check.label }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Step checks</div>
              <div class="mt-2 text-xs text-slate-600">
                Setting: {{ stepValidation.setting ?? "pending" }} · Cast: {{ stepValidation.cast ?? "pending" }}
              </div>
              <div class="mt-1 text-xs text-slate-600">
                Clues: {{ stepValidation.clues ?? "pending" }} · Outline: {{ stepValidation.outline ?? "pending" }}
              </div>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Setting/Cast</div>
              <div class="mt-2 text-sm text-slate-600">
                {{ settingArtifact ? "Setting stored" : "No setting yet" }} ·
                {{ castArtifact ? "Cast stored" : "No cast yet" }}
              </div>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Regenerate</div>
              <div class="mt-3 grid gap-2">
                <button
                  class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!projectId"
                  @click="handleRegenerate('setting')"
                >
                  Regenerate setting
                </button>
                <button
                  class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!projectId"
                  @click="handleRegenerate('cast')"
                >
                  Regenerate cast
                </button>
                <button
                  class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!projectId"
                  @click="handleRegenerate('clues')"
                >
                  Regenerate clues
                </button>
                <button
                  class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!projectId"
                  @click="handleRegenerate('outline')"
                >
                  Regenerate outline
                </button>
                <button
                  class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!projectId"
                  @click="handleRegenerate('prose')"
                >
                  Regenerate prose
                </button>
              </div>
            </div>
            <ExportPanel
              :project-id="projectId"
              :available="{
                setting: Boolean(settingArtifact),
                cast: Boolean(castArtifact),
                cml: isAdvanced && Boolean(cmlArtifact),
                clues: Boolean(cluesArtifact),
                outline: Boolean(outlineArtifact),
                prose: Boolean(proseArtifact),
                gamePack: Boolean(gamePackArtifact),
                fairPlay: Boolean(fairPlayReport),
              }"
            />
            <div v-if="isAdvanced" class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">CML preview</div>
              <pre class="mt-2 max-h-48 overflow-auto rounded bg-slate-900/5 p-2 text-xs text-slate-700">
{{ cmlArtifact ?? "No CML available" }}
              </pre>
            </div>
          </aside>
        </main>
      </div>
    </div>
  </div>
</template>
