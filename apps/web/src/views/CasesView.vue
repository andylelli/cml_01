<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import HeroBanner from "../components/ui/HeroBanner.vue";
import StepCard from "../components/ui/StepCard.vue";
import {
	downloadStoryPdf,
	fetchNarrationLibrary,
	fetchProjects,
	narrationDownloadUrl,
	type NarrationSummary,
	type Project,
} from "../services/api";

/**
 * The case list: what has been generated, what is still being written, and how to read it.
 *
 * ── THE POLL, AND WHY IT IS OWNED HERE ────────────────────────────────────────────────────────
 *
 * A case in progress needs its status refreshed. The interval is created on mount and cleared on
 * unmount in the same component — the pairing A_73 had to retrofit into the old App.vue after both
 * of its intervals were found still firing against a destroyed component. It also stops itself when
 * nothing is running, so an idle tab is not polling a local API every five seconds forever.
 */

const props = defineProps<{ activeProjectId: string | null }>();
const emit = defineEmits<{ openWorkshop: []; open: [Project] }>();

const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const downloading = ref<string | null>(null);

/**
 * Which cases have audio. Fetched once for the whole list rather than per row:
 * asking each row would be N requests to render a page that mostly says "no".
 */
const narrations = ref<Record<string, NarrationSummary>>({});
const loadNarrations = async () => {
	try {
		const { narrations: list } = await fetchNarrationLibrary();
		narrations.value = Object.fromEntries(list.map((n) => [n.projectId, n]));
	} catch {
		/* audio is an extra here; the list must render without it */
	}
};

let poll: ReturnType<typeof setInterval> | null = null;

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

const anyRunning = computed(() => projects.value.some((p) => p.status === "running"));

const load = async () => {
	try {
		projects.value = await fetchProjects();
		error.value = null;
	} catch (e) {
		error.value = `Could not load your cases: ${message(e)}`;
	} finally {
		loading.value = false;
	}
	syncPoll();
};

/** Poll only while something is actually running. */
const syncPoll = () => {
	if (anyRunning.value && !poll) {
		poll = setInterval(load, 5000);
		return;
	}
	if (!anyRunning.value && poll) {
		clearInterval(poll);
		poll = null;
	}
};

const download = async (project: Project) => {
	downloading.value = project.id;
	try {
		const blob = await downloadStoryPdf(project.id);
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${project.name.replace(/[^\w-]+/g, "_") || "mystery"}.pdf`;
		document.body.appendChild(link);
		link.click();
		link.remove();
		// Revoking immediately can cancel the download in some browsers; one frame is enough.
		requestAnimationFrame(() => URL.revokeObjectURL(url));
	} catch (e) {
		error.value = `Could not download "${project.name}": ${message(e)}`;
	} finally {
		downloading.value = null;
	}
};

const statusLabel = (status?: string) =>
	status === "running" ? "Being written" : status === "idle" ? "Ready" : (status ?? "Unknown");

onMounted(() => {
	void load();
	void loadNarrations();
});

onBeforeUnmount(() => {
	if (poll) {
		clearInterval(poll);
		poll = null;
	}
});
</script>

<template>
	<HeroBanner
		compact
		eyebrow="My Cases"
		title="Every case you've opened."
		lede="Mysteries in progress and mysteries finished. Nothing here is generated twice the same way."
	/>

	<div class="shell py-8">
		<StepCard icon="bookmark" title="Case Files" :subtitle="`${projects.length} on file`">
			<p v-if="loading" class="t-subtitle">Reading the files…</p>

			<div
				v-else-if="projects.length === 0"
				class="rounded border border-dashed border-line-strong p-8 text-center"
			>
				<p class="t-subtitle max-w-[38ch] mx-auto">
					No cases yet. Head to Create, choose a few details, and the first one will appear here.
				</p>
			</div>

			<ul v-else class="flex flex-col gap-2 p-0">
				<li
					v-for="project in projects"
					:key="project.id"
					class="flex list-none flex-col gap-3 rounded border px-4 py-3 sm:flex-row sm:items-center"
					:class="
						project.id === props.activeProjectId
							? 'border-accent bg-accent-wash'
							: 'border-line bg-surface'
					"
				>
					<AppIcon
						:name="project.status === 'running' ? 'gear' : 'bookmark'"
						:size="18"
						:class="[
							project.status === 'running' ? 'animate-spin text-warn' : 'text-ink-soft',
						]"
					/>

					<!-- The whole name opens the case. A row you can only download from was the entire
					     consumer experience of a finished mystery until CaseView existed. -->
					<button
						type="button"
						class="min-w-0 flex-1 text-left"
						@click="emit('open', project)"
					>
						<span class="block truncate text-[0.92rem] font-semibold underline-offset-2 hover:underline">
							{{ project.name }}
						</span>
						<span class="t-subtitle block text-[0.75rem]">
							{{ statusLabel(project.status) }}
							<span v-if="project.createdAt"> · {{ new Date(project.createdAt).toLocaleString() }}</span>
							<span v-if="narrations[project.id]" class="text-ink-faint">
								· narrated, {{ narrations[project.id].durationLabel }}
							</span>
						</span>
					</button>

					<AppButton size="sm" icon="chevronRight" @click="emit('open', project)">
						{{ project.status === "running" ? "Follow" : "Open" }}
					</AppButton>

					<!-- Audio only appears once a narration exists; the player lives in the case. -->
					<AppButton
						v-if="narrations[project.id]"
						size="sm"
						variant="ghost"
						icon="speaker"
						download
						:href="narrationDownloadUrl(project.id, 'mp3')"
					>
						Audio
					</AppButton>

					<AppButton
						size="sm"
						variant="ghost"
						icon="book"
						:busy="downloading === project.id"
						busy-label="Preparing…"
						:disabled="project.status === 'running'"
						@click="download(project)"
					>
						Download
					</AppButton>
				</li>
			</ul>

			<p
				v-if="error"
				class="mt-3 rounded border border-danger bg-danger-wash px-3 py-2 text-[0.8rem] text-danger"
			>
				{{ error }}
			</p>

			<div class="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
				<AppButton size="sm" icon="shuffle" @click="load">Refresh</AppButton>
				<AppButton size="sm" variant="ghost" icon="gear" @click="emit('openWorkshop')">
					Open the Workshop
				</AppButton>
				<span class="t-subtitle text-[0.72rem]">
					Clues, outline, validation and run logs for a case in progress.
				</span>
			</div>
		</StepCard>
	</div>
</template>

<style scoped>
.animate-spin {
	animation: spin 1.4s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
