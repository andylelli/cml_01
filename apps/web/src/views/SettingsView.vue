<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import HeroBanner from "../components/ui/HeroBanner.vue";
import StepCard from "../components/ui/StepCard.vue";
import {
	archiveLogs,
	clearStore,
	deleteArchive,
	fetchProjects,
	fetchStorage,
	trimStoreLogs,
	deleteProjectCompletely,
	type Project,
	type StorageReport,
} from "../services/api";

/**
 * SETTINGS — the admin surface that did not exist, and whose absence cost a paid run.
 *
 * ── WHY THIS PAGE EXISTS ──────────────────────────────────────────────────────────────────────
 *
 * The API died of `JavaScript heap out of memory` partway through a run, taking the run with it.
 * The cause was ordinary housekeeping that nothing surfaced and nobody could act on without a shell:
 * the JSON store had reached 39.7 MB — 12.7 MB of it an activity log with no bound — and the store
 * is re-serialised IN FULL on every write. The case file polls 20 endpoints every 4 seconds during a
 * run, so that was five 39.7 MB serialisations a second. Meanwhile the prompt log had reached
 * 202 MB.
 *
 * None of those numbers appeared anywhere in the product.
 *
 * ── ARCHIVE IS THE DEFAULT; DELETE IS DELIBERATE ──────────────────────────────────────────────
 *
 * Eleven analysis scripts read those log files, and `run-cost-audit.mjs` is the only trustworthy
 * budget instrument in the project — `report.total_cost` under-reports by 7×. Deleting them destroys
 * the evidence for every past run. So archiving moves files aside and keeps them; deleting is a
 * separate, per-file action that says what it is about to destroy and asks first.
 */

const report = ref<StorageReport | null>(null);
const projects = ref<Project[]>([]);
const loading = ref(true);
const busy = ref<string | null>(null);
const error = ref<string | null>(null);
const note = ref<string | null>(null);

/** What the user must type to confirm the irreversible ones. Nothing else will do. */
const confirmText = ref("");
const confirming = ref<string | null>(null);

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

const mb = (bytes: number) => {
	if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
	if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
	return `${bytes} B`;
};

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "—");

const refresh = async () => {
	try {
		const [storage, list] = await Promise.all([fetchStorage(), fetchProjects().catch(() => [])]);
		report.value = storage;
		projects.value = list;
		error.value = null;
	} catch (e) {
		error.value = `Could not read storage: ${message(e)}`;
	} finally {
		loading.value = false;
	}
};

onMounted(refresh);

/** Run one admin action, reporting what it actually did rather than "done". */
const run = async (key: string, action: () => Promise<string>) => {
	busy.value = key;
	note.value = null;
	error.value = null;
	try {
		note.value = await action();
		await refresh();
	} catch (e) {
		error.value = message(e);
	} finally {
		busy.value = null;
		confirming.value = null;
		confirmText.value = "";
	}
};

const liveTotal = computed(() => (report.value?.live ?? []).reduce((n, f) => n + f.bytes, 0));
const archivedTotal = computed(() => (report.value?.archived ?? []).reduce((n, f) => n + f.bytes, 0));

/**
 * The store size is the one figure here that is not about disk. It is re-serialised on every write,
 * so it is the per-request cost — and it is what exhausted the heap.
 */
const storeVerdict = computed(() => {
	const bytes = report.value?.store.bytes ?? 0;
	if (bytes > 25 * 1048576) return { tone: "danger", text: "Large enough to slow every request and risk the heap." };
	if (bytes > 10 * 1048576) return { tone: "warn", text: "Getting heavy. Trimming the activity log is the cheap win." };
	return { tone: "ok", text: "Healthy." };
});

const onArchive = () =>
	run("archive", async () => {
		const result = await archiveLogs();
		if (result.moved.length === 0) return "Nothing to archive — the live logs are already empty.";
		const total = result.moved.reduce((n, f) => n + f.bytes, 0);
		return `Archived ${result.moved.length} file${result.moved.length === 1 ? "" : "s"} (${mb(total)}). They are recreated on the next run.`;
	});

const onTrimLogs = () =>
	run("trim", async () => {
		const { removed } = await trimStoreLogs();
		return `Removed ${removed.toLocaleString()} activity-log entries from the store. Projects, specs, runs and artifacts untouched.`;
	});

const onDeleteArchive = (name: string) =>
	run(`del:${name}`, async () => {
		const { bytes } = await deleteArchive(name);
		return `Deleted ${name} (${mb(bytes)}). This cannot be undone.`;
	});

const onDeleteProject = (project: Project) =>
	run(`proj:${project.id}`, async () => {
		const r = await deleteProjectCompletely(project.id);
		return `Deleted "${project.name}" — ${r.artifacts} artifacts, ${r.specs} specs, ${r.runs} runs.`;
	});

const onClearStore = () =>
	run("clear", async () => {
		const { cleared } = await clearStore();
		return `Cleared ${cleared.length} stores: ${cleared.join(", ")}.`;
	});

/** Test-suite leftovers: these were created when the API tests wrote to the real store. */
const TEST_NAMES = /^(Export|Test|No Run|Spec|Run|Regen|PDF|Log|Clear|Mode|Validate|Angle) Project$/;
const testProjects = computed(() => projects.value.filter((p) => TEST_NAMES.test(p.name)));
</script>

<template>
	<HeroBanner
		compact
		eyebrow="Settings"
		title="Housekeeping"
		lede="What the app is storing, what it costs, and what you can safely get rid of."
	/>

	<div class="shell flex flex-col gap-4 py-8">
		<p v-if="error" class="rounded border border-danger bg-danger-wash px-3 py-2 text-[0.85rem] text-danger">
			{{ error }}
		</p>
		<p v-if="note" class="rounded border border-ok bg-ok-wash px-3 py-2 text-[0.85rem] text-ink">
			{{ note }}
		</p>
		<p v-if="loading" class="t-subtitle">Reading storage…</p>

		<template v-if="report">
			<!-- ── the store ────────────────────────────────────────────── -->
			<StepCard icon="bookmark" title="The case store" :subtitle="report.store.path">
				<p class="max-w-prose text-[0.86rem] leading-relaxed text-ink-soft">
					Every project, spec, run and artifact lives in one JSON file. It is rewritten
					<strong class="text-ink">in full on every write</strong>, so its size is not disk usage — it is
					the cost of every single request. This is what exhausted the server's memory partway through a
					paid run.
				</p>

				<div class="mt-4 flex flex-wrap items-baseline gap-3">
					<span class="font-display text-[1.6rem] font-semibold tabular-nums">{{ mb(report.store.bytes) }}</span>
					<span
						class="rounded-sm px-2 py-0.5 text-[0.72rem] font-semibold"
						:class="{
							'bg-danger-wash text-danger': storeVerdict.tone === 'danger',
							'bg-warn-wash text-warn': storeVerdict.tone === 'warn',
							'bg-ok-wash text-ok': storeVerdict.tone === 'ok',
						}"
					>{{ storeVerdict.text }}</span>
				</div>

				<dl class="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
					<div v-for="(value, key) in report.store.counts" :key="key">
						<dt class="t-label">{{ key }}</dt>
						<dd class="m-0 text-[0.95rem] tabular-nums text-ink">{{ value.toLocaleString() }}</dd>
					</div>
				</dl>

				<div class="mt-5 flex flex-wrap gap-2">
					<AppButton
						size="sm"
						icon="minus"
						:busy="busy === 'trim'"
						busy-label="Trimming…"
						@click="onTrimLogs"
					>
						Trim activity log
					</AppButton>
					<span class="self-center text-[0.75rem] text-ink-faint">
						Drops diagnostics only. Keeps every project, spec, run and artifact.
					</span>
				</div>
			</StepCard>

			<!-- ── live logs ────────────────────────────────────────────── -->
			<StepCard icon="nib" title="Live logs" :subtitle="`${mb(liveTotal)} across ${report.live.length} file${report.live.length === 1 ? '' : 's'}`">
				<p class="max-w-prose text-[0.86rem] leading-relaxed text-ink-soft">
					The pipeline appends to these for as long as it runs, and nothing rotates them. Archiving moves
					them aside with a timestamp; they are recreated on the next write, so it is safe at any time —
					though doing it mid-run splits that run's prompts across two files.
				</p>

				<ul v-if="report.live.length" class="mt-4 flex flex-col gap-2 p-0">
					<li
						v-for="file in report.live"
						:key="file.name"
						class="flex list-none flex-wrap items-baseline justify-between gap-2 rounded border border-line bg-ground-warm px-3 py-2"
					>
						<span class="font-mono text-[0.8rem]">{{ file.name }}</span>
						<span class="flex items-baseline gap-3">
							<span class="text-[0.75rem] text-ink-faint">{{ when(file.modified) }}</span>
							<span class="text-[0.85rem] font-semibold tabular-nums">{{ mb(file.bytes) }}</span>
						</span>
					</li>
				</ul>
				<p v-else class="mt-3 text-[0.82rem] text-ink-soft">
					No live logs — they will appear on the next run.
				</p>

				<AppButton
					class="mt-4"
					size="sm"
					icon="shuffle"
					:disabled="report.live.length === 0"
					:busy="busy === 'archive'"
					busy-label="Archiving…"
					@click="onArchive"
				>
					Archive live logs
				</AppButton>
			</StepCard>

			<!-- ── archives ─────────────────────────────────────────────── -->
			<StepCard
				icon="bookmark"
				title="Archived logs"
				:subtitle="`${mb(archivedTotal)} across ${report.archived.length} file${report.archived.length === 1 ? '' : 's'}`"
			>
				<p class="max-w-prose text-[0.86rem] leading-relaxed text-ink-soft">
					Kept, not needed day to day. Eleven analysis scripts read these — including the cost audit, which
					is the only trustworthy figure for what a run actually cost. Deleting one destroys the evidence
					for the runs it covers.
				</p>

				<ul v-if="report.archived.length" class="mt-4 flex flex-col gap-2 p-0">
					<li
						v-for="file in report.archived"
						:key="file.name"
						class="list-none rounded border border-line bg-ground-warm px-3 py-2"
					>
						<div class="flex flex-wrap items-baseline justify-between gap-2">
							<span class="font-mono text-[0.8rem]">{{ file.name }}</span>
							<span class="flex items-baseline gap-3">
								<span class="text-[0.85rem] font-semibold tabular-nums">{{ mb(file.bytes) }}</span>
								<AppButton
									size="sm"
									variant="ghost"
									@click="confirming = confirming === `del:${file.name}` ? null : `del:${file.name}`"
								>
									Delete
								</AppButton>
							</span>
						</div>

						<!-- Confirmation in place: says what goes, and cannot be clicked through by habit. -->
						<div
							v-if="confirming === `del:${file.name}`"
							class="mt-2 rounded border border-danger bg-danger-wash p-3 text-[0.8rem]"
						>
							<p class="m-0 text-danger">
								Permanently delete <strong>{{ file.name }}</strong> ({{ mb(file.bytes) }})? This cannot be
								undone, and any past-run analysis that needs it will no longer be possible.
							</p>
							<div class="mt-2 flex gap-2">
								<AppButton
									size="sm"
									variant="danger"
									:busy="busy === `del:${file.name}`"
									busy-label="Deleting…"
									@click="onDeleteArchive(file.name)"
								>
									Yes, delete it
								</AppButton>
								<AppButton size="sm" variant="ghost" @click="confirming = null">Cancel</AppButton>
							</div>
						</div>
					</li>
				</ul>
				<p v-else class="mt-3 text-[0.82rem] text-ink-soft">Nothing archived yet.</p>
			</StepCard>

			<!-- ── projects ─────────────────────────────────────────────── -->
			<StepCard
				v-if="testProjects.length"
				icon="people"
				title="Test-suite leftovers"
				:subtitle="`${testProjects.length} projects`"
			>
				<p class="max-w-prose text-[0.86rem] leading-relaxed text-ink-soft">
					These were created by the API test suite back when it wrote to the real store. They clutter
					<em>My Cases</em> and add to every write. Deleting one removes it and all its artifacts.
				</p>
				<ul class="mt-4 flex flex-wrap gap-2 p-0">
					<li v-for="project in testProjects" :key="project.id" class="list-none">
						<AppButton
							size="sm"
							variant="ghost"
							:busy="busy === `proj:${project.id}`"
							busy-label="Deleting…"
							@click="onDeleteProject(project)"
						>
							{{ project.name }} ✕
						</AppButton>
					</li>
				</ul>
			</StepCard>

			<!-- ── the irreversible one ─────────────────────────────────── -->
			<div class="rounded-lg border border-danger bg-danger-wash p-5">
				<div class="flex items-center gap-2">
					<AppIcon name="close" :size="16" class="text-danger" />
					<h2 class="t-section !text-danger">Clear everything</h2>
				</div>
				<p class="mt-2 max-w-prose text-[0.85rem] leading-relaxed text-danger">
					Removes every project, spec, run, artifact, scoring report and log. Finished stories already
					written to <code class="font-mono text-[0.8rem]">stories/</code> stay on disk; everything the app
					knows about them does not.
				</p>

				<AppButton
					v-if="confirming !== 'clear'"
					class="mt-3"
					size="sm"
					variant="danger"
					@click="confirming = 'clear'; confirmText = ''"
				>
					Clear all persistence
				</AppButton>

				<div v-else class="mt-3">
					<label for="confirm-clear" class="block text-[0.8rem] font-semibold text-danger">
						Type <code class="font-mono">DELETE EVERYTHING</code> to confirm
					</label>
					<div class="mt-2 flex flex-wrap gap-2">
						<input
							id="confirm-clear"
							v-model="confirmText"
							class="min-w-0 flex-1 rounded border border-danger bg-surface px-3 py-2 text-[0.85rem] outline-none"
							autocomplete="off"
						/>
						<AppButton
							size="sm"
							variant="danger"
							:disabled="confirmText !== 'DELETE EVERYTHING'"
							:busy="busy === 'clear'"
							busy-label="Clearing…"
							@click="onClearStore"
						>
							Clear
						</AppButton>
						<AppButton size="sm" variant="ghost" @click="confirming = null">Cancel</AppButton>
					</div>
				</div>
			</div>

			<div class="flex justify-end">
				<AppButton size="sm" variant="ghost" icon="shuffle" @click="refresh">Refresh</AppButton>
			</div>
		</template>
	</div>
</template>
