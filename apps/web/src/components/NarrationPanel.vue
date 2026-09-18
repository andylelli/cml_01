<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppButton from "./ui/AppButton.vue";
import AudioPlayer from "./AudioPlayer.vue";
import {
	cancelNarration,
	deleteNarration,
	fetchNarration,
	fetchNarrationCast,
	fetchNarrationPlan,
	fetchNarrationStatus,
	fetchNarrationVoices,
	narrationAudioUrl,
	narrationDownloadUrl,
	startNarration,
	type NarrationCastMember,
	type NarrationJob,
	type NarrationPlan,
	type NarrationVoice,
} from "../services/api";

/**
 * Narration: turn the finished manuscript into an audiobook.
 *
 * The cost is shown BEFORE the button that spends it, because a render is real
 * money against a real Azure account and "about 70p" is the kind of thing you
 * want to see rather than discover.
 */
const props = defineProps<{ projectId: string; hasStory: boolean }>();

const status = ref<{ configured: boolean; keySource: string; region: string } | null>(null);
const voices = ref<NarrationVoice[]>([]);
const plan = ref<NarrationPlan | null>(null);
const cast = ref<NarrationCastMember[]>([]);
const job = ref<NarrationJob | null>(null);
const busy = ref(false);
const error = ref<string | null>(null);
const loading = ref(true);

const narratorId = ref("en-GB-RyanNeural");
const multiVoice = ref(false);
const rate = ref("-5%");
const characterVoice = ref<Record<string, string>>({});

let poll: ReturnType<typeof setTimeout> | null = null;

const englishVoices = computed(() => voices.value.filter((v) => v.locale.startsWith("en")));
const narrator = computed(
	() => voices.value.find((v) => v.id === narratorId.value) ?? { id: narratorId.value, kind: "prebuilt" as const, locale: "en-GB" },
);

const rendering = computed(
	() => !!job.value && ["queued", "running", "assembling"].includes(job.value.status),
);
const done = computed(() => job.value?.status === "done" && !!job.value.outputs?.mp3);
const percent = computed(() => {
	const p = job.value?.progress;
	return p?.total ? Math.round((p.done / p.total) * 100) : 0;
});

const money = (gbp?: number, usd?: number) =>
	gbp == null ? "" : `£${gbp.toFixed(2)}${usd != null ? ` ($${usd.toFixed(2)})` : ""}`;

const load = async () => {
	loading.value = true;
	try {
		const [s, v, existing] = await Promise.all([
			fetchNarrationStatus().catch(() => null),
			fetchNarrationVoices().catch(() => ({ voices: [] })),
			fetchNarration(props.projectId).catch(() => ({ job: null })),
		]);
		status.value = s;
		voices.value = v.voices ?? [];
		job.value = existing.job;
		if (rendering.value) schedulePoll();

		if (props.hasStory) {
			plan.value = await fetchNarrationPlan(props.projectId).catch(() => null);
			const c = await fetchNarrationCast(props.projectId).catch(() => null);
			cast.value = c?.cast ?? [];
		}
	} finally {
		loading.value = false;
	}
};

const schedulePoll = () => {
	if (poll) clearTimeout(poll);
	poll = setTimeout(async () => {
		try {
			const { job: latest } = await fetchNarration(props.projectId);
			job.value = latest;
		} catch {
			/* a dropped poll is not a failed render; the next tick retries */
		}
		if (rendering.value) schedulePoll();
	}, 2000);
};

const render = async () => {
	busy.value = true;
	error.value = null;
	try {
		const characterVoices = multiVoice.value
			? cast.value
					.map((person) => {
						const voice = voices.value.find((v) => v.id === characterVoice.value[person.name]);
						return voice ? { name: person.name, aliases: person.aliases ?? [], voice } : null;
					})
					.filter((x): x is { name: string; aliases: string[]; voice: NarrationVoice } => x !== null)
			: [];

		const { job: started } = await startNarration(props.projectId, narrator.value as NarrationVoice, {
			rate: rate.value,
			multiVoice: multiVoice.value,
			characterVoices,
		});
		job.value = started;
		schedulePoll();
	} catch (e) {
		error.value = e instanceof Error ? e.message : String(e);
	} finally {
		busy.value = false;
	}
};

const stop = async () => {
	await cancelNarration(props.projectId).catch(() => null);
	const { job: latest } = await fetchNarration(props.projectId);
	job.value = latest;
};

const discard = async () => {
	if (!confirm("Delete this narration and its audio files?")) return;
	await deleteNarration(props.projectId).catch(() => null);
	job.value = null;
};

onMounted(load);
onBeforeUnmount(() => {
	if (poll) clearTimeout(poll);
});
watch(() => props.projectId, load);
</script>

<template>
	<div class="flex flex-col gap-4">
		<p v-if="loading" class="t-subtitle">Checking the narration…</p>

		<p v-else-if="!status?.configured" class="rounded border border-line bg-surface-sunken px-3 py-2 text-[0.82rem] text-ink-soft">
			Narration needs an Azure Speech key on the API. Set <code>AZURE_SPEECH_KEY</code> and restart.
		</p>

		<template v-else>
			<!-- finished: the player comes first, because that is what you came for -->
			<AudioPlayer
				v-if="done && job"
				:src="narrationAudioUrl(projectId)"
				:title="job.title"
				:chapters="job.outputs?.chapters ?? []"
				:duration-hint="job.durationSeconds"
				:remember-as="projectId"
			/>

			<div v-if="done && job" class="flex flex-wrap items-center gap-2">
				<AppButton size="sm" icon="download" download :href="narrationDownloadUrl(projectId, 'mp3')">
					MP3
				</AppButton>
				<AppButton
					v-if="job.outputs?.m4b"
					size="sm"
					variant="ghost"
					icon="download"
					download
					:href="narrationDownloadUrl(projectId, 'm4b')"
				>
					M4B
				</AppButton>
				<span class="t-subtitle text-[0.72rem]">
					{{ job.durationLabel }}
					<span v-if="job.cost"> · cost {{ money(job.cost.gbp, job.cost.usd) }}</span>
					<span v-if="job.voice?.label || job.voice?.id"> · {{ job.voice.label || job.voice.id }}</span>
				</span>
				<AppButton size="sm" variant="ghost" class="ml-auto" @click="discard">Delete</AppButton>
			</div>

			<p v-if="job?.warnings?.length" class="rounded border border-warn bg-surface-sunken px-3 py-2 text-[0.8rem] text-ink-soft">
				{{ job.warnings.join("; ") }}
			</p>

			<!-- in flight -->
			<div v-if="rendering" class="rounded border border-line bg-surface-sunken p-3">
				<div class="h-1.5 overflow-hidden rounded-full bg-line">
					<div class="h-full bg-accent transition-all" :style="{ width: `${percent}%` }" />
				</div>
				<div class="mt-2 flex flex-wrap items-center gap-2 text-[0.8rem] text-ink-soft">
					<span v-if="job?.status === 'assembling'">Stitching the chapters together…</span>
					<span v-else>{{ job?.progress.done }} / {{ job?.progress.total }} passages · {{ percent }}%</span>
					<span v-if="job?.progress.cachedHits" class="text-ink-faint">
						{{ job.progress.cachedHits }} reused
					</span>
					<AppButton size="sm" variant="ghost" class="ml-auto" @click="stop">Cancel</AppButton>
				</div>
			</div>

			<p
				v-if="job?.status === 'failed' || job?.status === 'cancelled'"
				class="rounded border border-danger bg-danger-wash px-3 py-2 text-[0.82rem] text-danger"
			>
				{{ job.error || "The narration stopped." }}
			</p>

			<!-- setup -->
			<div v-if="!rendering && hasStory" class="flex flex-col gap-3">
				<div class="grid gap-3 sm:grid-cols-2">
					<label class="flex flex-col gap-1">
						<span class="t-subtitle text-[0.72rem]">Narrator</span>
						<select v-model="narratorId" class="rounded border border-line bg-surface px-2 py-1.5 text-[0.85rem]">
							<option v-for="v in englishVoices" :key="v.id" :value="v.id">
								{{ v.name || v.id }} — {{ v.localeName }} ({{ v.gender }})
							</option>
						</select>
					</label>
					<label class="flex flex-col gap-1">
						<span class="t-subtitle text-[0.72rem]">Pace</span>
						<select v-model="rate" class="rounded border border-line bg-surface px-2 py-1.5 text-[0.85rem]">
							<option value="-10%">Slow</option>
							<option value="-5%">Measured — audiobook default</option>
							<option value="">Normal</option>
							<option value="+10%">Brisk</option>
						</select>
					</label>
				</div>

				<label v-if="cast.length" class="flex items-center gap-2 text-[0.85rem] text-ink-soft">
					<input v-model="multiVoice" type="checkbox" />
					Give each character their own voice
					<span class="text-ink-faint">({{ cast.length }} speaking parts found)</span>
				</label>

				<!-- Nothing is auto-assigned: the prose carries no reliable signal for
				     which voice suits whom, and a wrong guess is audible for an hour. -->
				<p v-if="multiVoice && cast.length" class="t-subtitle text-[0.72rem]">
					Choose a voice for each character. Anyone left as “narrator” is read in the narrator's voice.
				</p>

				<ul v-if="multiVoice && cast.length" class="flex flex-col gap-1.5 p-0">
					<li v-for="person in cast" :key="person.name" class="flex flex-wrap items-center gap-2">
						<span class="min-w-[9rem] text-[0.85rem] text-ink">{{ person.name }}</span>
						<span class="t-subtitle text-[0.7rem]">
						{{ person.lines }} lines
					</span>
						<select
							v-model="characterVoice[person.name]"
							class="ml-auto rounded border border-line bg-surface px-2 py-1 text-[0.8rem]"
						>
							<option value="">— narrator —</option>
							<option v-for="v in englishVoices" :key="v.id" :value="v.id">
								{{ v.name || v.id }} ({{ v.gender }})
							</option>
						</select>
					</li>
				</ul>

				<p v-if="plan" class="rounded border border-line bg-surface-sunken px-3 py-2 text-[0.82rem] text-ink-soft">
					<strong class="text-ink">{{ plan.totals.chapters }} chapters</strong>,
					{{ plan.totals.words.toLocaleString() }} words —
					about {{ Math.round(plan.totals.estimatedMinutes) }} minutes of audio.
					Costs roughly <strong class="text-ink">{{ money(plan.estimate.gbp, plan.estimate.usd) }}</strong>
					in Azure synthesis. Re-rendering the same text and voice is free.
				</p>

				<div class="flex flex-wrap items-center gap-2">
					<AppButton
						variant="primary"
						icon="speaker"
						:busy="busy"
						busy-label="Starting…"
						:disabled="!plan"
						@click="render"
					>
						{{ done ? "Render again" : "Narrate this case" }}
					</AppButton>
					<span v-if="!plan" class="t-subtitle text-[0.72rem]">No manuscript to narrate yet.</span>
				</div>
			</div>

			<p v-else-if="!hasStory" class="t-subtitle">
				The story has to be written before it can be read aloud.
			</p>

			<p v-if="error" class="rounded border border-danger bg-danger-wash px-3 py-2 text-[0.82rem] text-danger">
				{{ error }}
			</p>
		</template>
	</div>
</template>
