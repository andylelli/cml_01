<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AppShell from "./components/ui/AppShell.vue";
import type { NavItem } from "./components/ui/types";
import ErrorNotification from "./components/ErrorNotification.vue";
import { useCreateFlow } from "./composables/useCreateFlow";
import { useErrorLog } from "./composables/useErrorLog";
import { useUiState, type Mode } from "./composables/useUiState";
import { logActivity } from "./services/api";
import { coerceSpec, type MysterySpec } from "./spec/vocabulary";
import CasesView from "./views/CasesView.vue";
import CreateView from "./views/CreateView.vue";
import InspirationView from "./views/InspirationView.vue";
import WorkshopView from "./views/WorkshopView.vue";

/**
 * THE SHELL. Frame, view switch, and the one path from the wizard to a running pipeline.
 *
 * Everything this file used to do — three tab groups, SSE, two polling loops, artifact loading,
 * scoring, PDF export — lives in WorkshopView, which is the same 3,391-line console moved intact.
 * Splitting the console's INTERNALS is a separate job (UI-002 item 25); what this commit fixes is
 * that the console was also the application shell, so every consumer-facing screen had to be a tab
 * inside an operator's instrument.
 */

type ViewId = "create" | "inspiration" | "cases" | "workshop";

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
const mode = ref<Mode>("user");
const spec = ref<MysterySpec>(coerceSpec(null));
const projectId = ref<string | null>(null);
const projectName = ref("");

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
	if (mode.value !== "user") items.push({ id: "workshop", label: "Workshop", icon: "gear" });
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
	spec.value = submitted;
	log.clear("pipeline");

	const result = await flow.start(submitted);

	if (result.phase === "failed") {
		log.recordFailure({ type: "pipeline" });
		log.add("error", "pipeline", result.message, result.detail);
		return;
	}

	if (result.phase === "started") {
		projectId.value = result.projectId;
		log.add("info", "pipeline", "Your mystery is being written. Follow it in My Cases.");
		view.value = "cases";
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
	if (["create", "inspiration", "cases", "workshop"].includes(restored)) view.value = restored;
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
			@open-workshop="revealWorkshop"
		/>

		<WorkshopView v-else-if="view === 'workshop'" />
	</AppShell>

	<ErrorNotification :errors="log.errors.value" @dismiss="log.dismiss" @action="onRetry" />
</template>
