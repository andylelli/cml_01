<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";
import {
  createProject,
  fetchCml,
  fetchClues,
  fetchHealth,
  fetchOutline,
  fetchProse,
  runPipeline,
  saveSpec,
} from "./services/api";
import { subscribeToRunEvents } from "./services/sse";

type Mode = "user" | "advanced" | "expert";

const mode = ref<Mode>("user");

const isAdvanced = computed(() => mode.value === "advanced" || mode.value === "expert");
const isExpert = computed(() => mode.value === "expert");

const setMode = (nextMode: Mode) => {
  mode.value = nextMode;
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
let unsubscribe: (() => void) | null = null;

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

const handleRunPipeline = async () => {
  if (!projectId.value) {
    actionMessage.value = "Create a project first";
    return;
  }
  actionMessage.value = null;
  try {
    await runPipeline(projectId.value);
    const [cml, clues, outline, prose] = await Promise.allSettled([
      fetchCml(projectId.value),
      fetchClues(projectId.value),
      fetchOutline(projectId.value),
      fetchProse(projectId.value),
    ]);
    cmlArtifact.value = cml.status === "fulfilled" ? JSON.stringify(cml.value.payload, null, 2) : null;
    cluesArtifact.value = clues.status === "fulfilled" ? JSON.stringify(clues.value.payload, null, 2) : null;
    outlineArtifact.value = outline.status === "fulfilled" ? JSON.stringify(outline.value.payload, null, 2) : null;
    proseArtifact.value = prose.status === "fulfilled" ? JSON.stringify(prose.value.payload, null, 2) : null;
    actionMessage.value = "Run started";
  } catch (error) {
    actionMessage.value = "Failed to start run";
  }
};

onMounted(() => {
  checkHealth();
  connectSse();
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
          <button class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium text-slate-900 hover:bg-slate-100">
            Dashboard
          </button>
          <button class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium text-slate-900 hover:bg-slate-100">
            Builder
          </button>
          <button class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium text-slate-900 hover:bg-slate-100">
            Clues
          </button>
          <button class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium text-slate-900 hover:bg-slate-100">
            Outline
          </button>
          <button class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium text-slate-900 hover:bg-slate-100">
            Samples
          </button>
          <button
            v-if="isAdvanced"
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium text-slate-900 hover:bg-slate-100"
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
                :checked="isAdvanced"
                @update:checked="(checked) => setMode(checked ? 'advanced' : 'user')"
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
                :checked="isExpert"
                @update:checked="(checked) => setMode(checked ? 'expert' : 'user')"
                class="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition data-[checked=true]:bg-rose-600"
              >
                <span class="sr-only">Enable Expert mode</span>
                <span
                  class="inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition data-[checked=true]:translate-x-6"
                />
              </Switch>
            </SwitchGroup>
          </div>
        </header>

        <main class="flex min-h-0 flex-1 gap-6 overflow-hidden bg-slate-50 px-6 py-6">
          <section class="flex min-w-0 flex-1 flex-col gap-6 overflow-auto">
            <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
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

            <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
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

            <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
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

            <div class="grid gap-6 md:grid-cols-2">
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Setting overview</div>
                <div class="mt-2 text-sm text-slate-600">1936 • Country house • Autumn storm</div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Cast cards</div>
                <div class="mt-2 text-sm text-slate-600">6 suspects • relationship map pending</div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Clue board</div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ cluesArtifact ? "Clues placeholder stored" : "No clues generated yet" }}
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Outline</div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ outlineArtifact ? "Outline placeholder stored" : "Outline will appear after validation" }}
                </div>
              </div>
            </div>
          </section>

          <aside class="hidden w-80 flex-shrink-0 flex-col gap-4 md:flex">
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Run status</div>
              <div class="mt-2 text-sm text-slate-600">{{ runStatus }}</div>
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
            </div>
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
