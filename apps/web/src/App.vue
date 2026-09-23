<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AppShell from "./components/ui/AppShell.vue";
import type { NavItem } from "./components/ui/types";
import ErrorNotification from "./components/ErrorNotification.vue";
import { useCreateFlow } from "./composables/useCreateFlow";
import { useErrorLog } from "./composables/useErrorLog";
import { useUiState, type Mode } from "./composables/useUiState";
import { logActivity, type Project } from "./services/api";
import { useSessionState } from "./composables/useSessionState";
import type { MysterySpec } from "./spec/vocabulary";
import CaseView from "./views/CaseView.vue";
import CasesView from "./views/CasesView.vue";
import CreateView from "./views/CreateView.vue";
import InspirationView from "./views/InspirationView.vue";
import WorkshopView from "./views/WorkshopView.vue";
import SettingsView from "./views/SettingsView.vue";

/**
 * THE SHELL. Frame, view switch, and the one path from the wizard to a running pipeline.
 *
 * Everything this file used to do — three tab groups, SSE, two polling loops, artifact loading,
 * scoring, PDF export — lives in WorkshopView, which is the same 3,391-line console moved intact.
 * Splitting the console's INTERNALS is a separate job (UI-002 item 25); what this commit fixes is
 * that the console was also the application shell, so every consumer-facing screen had to be a tab
 * inside an operator's instrument.
 */

type ViewId = "create" | "inspiration" | "cases" | "case" | "workshop" | "settings";

const ui = useUiState();
const log = useErrorLog({
	onLogged: (item) =>
		void logActivity({
			projectId: projectId.value,
			scope: "error",
			message: `${item.severity}: ${item.message}`,
			payload: { scope: item.scope, details: item.details },
		}).catch(() => {
			/* the activity log is best-effort; never let it surface as a second error */
		}),
});

const view = ref<ViewId>("create");

// B13: one mode and one spec for the whole app. The console reads the same refs, so a story
// configured in Create is the story the Workshop shows.
const { mode, spec } = useSessionState();
const projectId = ref<string | null>(null);
const projectName = ref("");

/** The case being read. Set by My Cases, and by a generation the moment it starts. */
const openCase = ref<{ id: string; name: string } | null>(null);

const openCaseFile = (project: Project) => {
	openCase.value = { id: project.id, name: project.name };
	view.value = "case";
};

const flow = useCreateFlow({
	existingProjectId: () => null, // every generation opens its own case
	projectName: () => projectName.value || `${spec.value.decade} · ${spec.value.locationPreset}`,
	onActivity: (message, payload) =>
		void logActivity({ projectId: projectId.value, scope: "ui", message, payload }).catch(() => {}),
});

const navItems = computed<NavItem[]>(() => {
	const items: NavItem[] = [
		{ id: "create", label: "Create", icon: "sparkle" },
		{ id: "inspiration", label: "Inspiration", icon: "book" },
		{ id: "cases", label: "My Cases", icon: "bookmark" },
	];
	/**
	 * THE OPEN CASE WAS AN ORPHAN.
	 *
	 * `view === "case"` is where a run is watched — the progress track, and every artifact as it
	 * lands. It had no nav entry, so while a mystery was being written the nav bar showed nothing
	 * selected, and the only way back to it was My Cases → Open. The page you are most likely to
	 * want during the forty minutes a run takes was the one page you could not navigate to.
	 */
	if (openCase.value) {
		items.push({
			id: "case",
			// The case name, but a spec-derived name like "1930s · CountryHouse" can run long in a
			// horizontal bar, so it is trimmed rather than allowed to push the other items around.
			label: openCase.value.name.length > 18 ? `${openCase.value.name.slice(0, 17)}…` : openCase.value.name,
			icon: "book",
		});
	}
	if (mode.value !== "user") items.push({ id: "workshop", label: "Workshop", icon: "gear" });
	if (mode.value !== "user") items.push({ id: "settings", label: "Settings", icon: "spectacles" });
	return items;
});

const persist = () =>
	ui.persist({
		projectName: projectName.value,
		projectId: projectId.value,
		latestSpecId: null,
		spec: spec.value,
		view: view.value,
		mode: mode.value,
	});

watch([view, mode, projectId, projectName], persist);
watch(spec, persist, { deep: true });

const navigate = (id: string) => {
	view.value = id as ViewId;
};

const onGenerate = async (submitted: MysterySpec) => {
	// A_103 B74: `submitted.theme` is the COMPOSED theme (lead + flavour sentences). Writing it back into
	// the shared spec made the next Generate compose on top of it - MEASURED: every flavour sentence
	// doubled on the second run and after a reload, and the "theme (optional)" box showed machine text.
	// The wizard keeps the raw theme; the composed one travels only in the request.
	spec.value = { ...submitted, theme: spec.value.theme };
	log.clear("pipeline");

	const result = await flow.start(submitted);

	if (result.phase === "failed") {
		log.recordFailure({ type: "pipeline" });
		log.add("error", "pipeline", result.message, result.detail);
		return;
	}

	if (result.phase === "started") {
		projectId.value = result.projectId;
		// A_103 B80: the project was created as "<decade> · <location>" (useCreateFlow's projectName) while the
		// nav and the case-file header said "New case" for the whole run. One name, computed the same way.
		openCase.value = { id: result.projectId, name: projectName.value || `${submitted.decade} · ${submitted.locationPreset}` };
		log.add("info", "pipeline", "Your mystery is being written.");
		// Straight to the case file: the run's progress and every artifact as it lands are there.
		view.value = "case";
	}
};

const onRetry = (item: Parameters<typeof log.resolve>[0]) => {
	const action = log.resolve(item);
	if (action?.type === "pipeline") void onGenerate(spec.value);
};

onMounted(() => {
	const saved = ui.hydrate();
	if (!saved) return;
	spec.value = saved.spec;
	mode.value = saved.mode;
	projectId.value = saved.projectId;
	projectName.value = saved.projectName;
	// Workshop is only reachable outside user mode; an old payload could name it regardless.
	const restored = saved.view as ViewId;
	if (restored === "workshop" && saved.mode === "user") return;
	if (restored === "case" && !openCase.value) return; // no case remembered: fall back to Create
	if (["create", "inspiration", "cases", "case", "workshop"].includes(restored)) view.value = restored;
});

/** Escape hatch to the console for anyone who needs it without hunting for a toggle. */
const revealWorkshop = () => {
	mode.value = "advanced";
	view.value = "workshop";
};
</script>

<template>
	<AppShell :items="navItems" :current="view" @navigate="navigate">
		<CreateView
			v-if="view === 'create'"
			v-model="spec"
			:busy="flow.busy.value"
			@submit="onGenerate"
		/>

		<InspirationView v-else-if="view === 'inspiration'" />

		<CasesView
			v-else-if="view === 'cases'"
			:active-project-id="projectId"
			@open="openCaseFile"
			@open-workshop="revealWorkshop"
		/>

		<CaseView
			v-else-if="view === 'case' && openCase"
			:key="openCase.id"
			:project-id="openCase.id"
			:project-name="openCase.name"
			@back="view = 'cases'"
			@open-workshop="revealWorkshop"
		/>

		<WorkshopView v-else-if="view === 'workshop'" @open-create="view = 'create'" />

		<SettingsView v-else-if="view === 'settings'" />
	</AppShell>

	<ErrorNotification :errors="log.errors.value" @dismiss="log.dismiss" @action="onRetry" />
</template>
