<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import HeroBanner from "../components/ui/HeroBanner.vue";
import ProgressTrack from "../components/ui/ProgressTrack.vue";
import StepCard from "../components/ui/StepCard.vue";
import { downloadStoryPdf, fetchProjectStatus } from "../services/api";
import { deriveProgress, deriveStages } from "../run/timeline";
import { useProjectStore } from "../stores/projectStore";

/**
 * A CASE, READABLE — the half of the consumer product that did not exist.
 *
 * Before this, pressing Generate took you to a list where a case said "Being written" beside a
 * spinner, and when it finished the only thing you could do was download a PDF. Everything the
 * pipeline produces on the way — the setting, the period, the rooms, the people and their voices —
 * was reachable only from the operator console, behind an advanced-mode toggle. MEASURED: the
 * consumer path called 3 of the 28 artifact endpoints.
 *
 * Nothing here is new data or a new endpoint. It is the same store the console reads, shown in the
 * reader's language and with the spoilers held back.
 *
 * ── THE SPOILER RULE ──────────────────────────────────────────────────────────────────────────
 *
 * `privateSecret`, `motiveSeed`, `alibiWindow` and the clue list give away the solution. A dossier
 * that opens with the culprit's motive is not a dossier, it is an answer sheet. They sit behind one
 * deliberate control that defaults CLOSED and remembers its state per case, so the operator who
 * wants everything is one click away and the reader is not ambushed.
 */

const props = defineProps<{ projectId: string; projectName?: string }>();
const emit = defineEmits<{ back: []; openWorkshop: [] }>();

const store = useProjectStore();
const {
	settingData,
	castData,
	synopsisData,
	proseData,
	characterProfilesData,
	locationProfilesData,
	temporalContextData,
	backgroundContextData,
	cluesData,
	runEventsData,
} = storeToRefs(store);

const status = ref<string>("unknown");
const loading = ref(true);
const error = ref<string | null>(null);

let poll: ReturnType<typeof setInterval> | null = null;

const isRunning = computed(() => status.value === "running");
const stages = computed(() => deriveStages(runEventsData.value ?? []));
const progress = computed(() => deriveProgress(runEventsData.value ?? []));
const hasFailed = computed(() => stages.value.some((s) => s.status === "failed"));

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

/* ── spoilers ────────────────────────────────────────────────────────────────────────────────── */

const spoilerKey = computed(() => `cml_spoilers_${props.projectId}`);
const showSpoilers = ref(false);

const readSpoilerPreference = () => {
	try {
		showSpoilers.value = window.localStorage.getItem(spoilerKey.value) === "1";
	} catch {
		showSpoilers.value = false;
	}
};

const toggleSpoilers = () => {
	showSpoilers.value = !showSpoilers.value;
	try {
		window.localStorage.setItem(spoilerKey.value, showSpoilers.value ? "1" : "0");
	} catch {
		/* a lost preference is not worth an error */
	}
};

/* ── loading ─────────────────────────────────────────────────────────────────────────────────── */

const refresh = async () => {
	try {
		const [projectStatus] = await Promise.all([
			fetchProjectStatus(props.projectId),
			store.loadRunEvents(props.projectId),
			// The console passes includeCml for its CML viewer; a reader has no use for it.
			store.loadArtifacts(props.projectId, { includeCml: false }),
		]);
		status.value = projectStatus.status;
		error.value = null;
	} catch (e) {
		error.value = `Could not read this case: ${message(e)}`;
	} finally {
		loading.value = false;
	}
	syncPoll();
};

/** Poll only while the pipeline is actually working. */
const syncPoll = () => {
	if (isRunning.value && !poll) {
		poll = setInterval(refresh, 4000);
		return;
	}
	if (!isRunning.value && poll) {
		clearInterval(poll);
		poll = null;
	}
};

const downloading = ref(false);

const download = async () => {
	downloading.value = true;
	try {
		const blob = await downloadStoryPdf(props.projectId);
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${(title.value || "mystery").replace(/[^\w-]+/g, "_")}.pdf`;
		document.body.appendChild(link);
		link.click();
		link.remove();
		requestAnimationFrame(() => URL.revokeObjectURL(url));
	} catch (e) {
		error.value = `Could not download: ${message(e)}`;
	} finally {
		downloading.value = false;
	}
};

/* ── derived ─────────────────────────────────────────────────────────────────────────────────── */

const title = computed(() => synopsisData.value?.title || props.projectName || "Untitled case");

const when = computed(() => {
	const t = temporalContextData.value;
	if (!t?.specificDate) return null;
	const { day, month, year } = t.specificDate;
	return [day ? `${day}` : null, month, year].filter(Boolean).join(" ");
});

const profiles = computed(() => characterProfilesData.value?.profiles ?? []);
const places = computed(() => locationProfilesData.value?.keyLocations ?? []);
const chapters = computed(() => proseData.value?.chapters ?? []);

/** The four senses a location records, as labelled lines, skipping any it does not have. */
const senses = (place: { sensoryDetails?: Record<string, string[] | undefined> }) =>
	(
		[
			["Sights", "sights"],
			["Sounds", "sounds"],
			["Smells", "smells"],
			["Touch", "tactile"],
		] as const
	)
		.map(([term, key]) => ({ term, value: (place.sensoryDetails?.[key] ?? []).join(" · ") }))
		.filter((s) => s.value.length > 0);

const atmosphere = computed(() => {
	const a = locationProfilesData.value?.atmosphere;
	if (!a) return null;
	return [a.mood, a.weather, a.timeFlow].filter(Boolean).join(" · ") || null;
});

/**
 * The held-back half of a profile, in reading order — what they hide, then why, then whether they
 * could have. Empty fields are dropped rather than rendered as a blank line.
 */
const secretsOf = (person: {
	privateSecret?: string;
	motiveSeed?: string;
	stakes?: string;
	personalStakeInCase?: string;
	alibiWindow?: string;
	accessPlausibility?: string;
}) =>
	(
		[
			["Hiding", person.privateSecret],
			["Motive", person.motiveSeed],
			["Stands to lose", person.stakes],
			["At stake in this case", person.personalStakeInCase],
			["Alibi", person.alibiWindow],
			["Could have", person.accessPlausibility],
		] as const
	)
		.map(([term, value]) => ({ term, value: (value ?? "").trim() }))
		.filter((f) => f.value.length > 0);

/** Tics arrive quoted in the payload; the template supplies its own quotation marks. */
const stripQuotes = (text: string) => text.replace(/^["“'‘\s]+|["”'’\s]+$/g, "");

/** Something to read, as opposed to a case still being assembled. */
const hasStory = computed(() => chapters.value.length > 0);

const readingChapter = ref(0);

onMounted(() => {
	readSpoilerPreference();
	void refresh();
});

watch(() => props.projectId, () => {
	loading.value = true;
	readingChapter.value = 0;
	readSpoilerPreference();
	void refresh();
});

onBeforeUnmount(() => {
	if (poll) {
		clearInterval(poll);
		poll = null;
	}
});
</script>

<template>
	<HeroBanner compact eyebrow="Case file" :title="title" :lede="synopsisData?.summary" />

	<div class="shell flex flex-col gap-4 py-8">
		<!-- ── where you are ───────────────────────────────────────────── -->
		<div class="flex flex-wrap items-center gap-2">
			<AppButton size="sm" variant="ghost" icon="chevronLeft" @click="emit('back')">
				All cases
			</AppButton>
			<span class="t-subtitle text-[0.75rem]">{{ projectId }}</span>
			<span class="ml-auto flex gap-2">
				<AppButton size="sm" icon="shuffle" @click="refresh">Refresh</AppButton>
				<AppButton
					v-if="hasStory"
					size="sm"
					variant="primary"
					icon="book"
					:busy="downloading"
					busy-label="Preparing…"
					@click="download"
				>
					Download
				</AppButton>
			</span>
		</div>

		<p
			v-if="error"
			class="rounded border border-danger bg-danger-wash px-3 py-2 text-[0.82rem] text-danger"
		>
			{{ error }}
		</p>

		<p v-if="loading" class="t-subtitle">Opening the case file…</p>

		<!-- ── progress, while it is being written ─────────────────────── -->
		<ProgressTrack
			v-if="!loading && (isRunning || hasFailed)"
			:stages="stages"
			:percent="progress.percent"
			:label="progress.label"
			:failed="hasFailed"
		/>

		<!-- ── the dossier, appearing as each piece lands ──────────────── -->

		<StepCard
			v-if="backgroundContextData || settingData"
			icon="globe"
			title="The Setting"
			subtitle="Where this happens, and what everyone already knows."
		>
			<p v-if="backgroundContextData?.backdropSummary" class="reader">
				{{ backgroundContextData.backdropSummary }}
			</p>
			<dl class="mt-4 grid gap-3 sm:grid-cols-3">
				<div v-if="settingData?.decade || backgroundContextData?.era?.decade">
					<dt class="t-label">Era</dt>
					<dd class="m-0 text-[0.9rem]">{{ settingData?.decade ?? backgroundContextData?.era?.decade }}</dd>
				</div>
				<div v-if="backgroundContextData?.setting?.institution">
					<dt class="t-label">Institution</dt>
					<dd class="m-0 text-[0.9rem]">{{ backgroundContextData.setting.institution }}</dd>
				</div>
				<div v-if="settingData?.weather ?? backgroundContextData?.setting?.weather">
					<dt class="t-label">Weather</dt>
					<dd class="m-0 text-[0.9rem]">{{ settingData?.weather ?? backgroundContextData?.setting?.weather }}</dd>
				</div>
			</dl>
		</StepCard>

		<StepCard
			v-if="temporalContextData"
			icon="clock"
			title="The Period"
			:subtitle="when ? `Set on ${when}.` : undefined"
		>
			<dl class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<div v-if="temporalContextData.seasonal?.season">
					<dt class="t-label">Season</dt>
					<dd class="m-0 text-[0.9rem]">{{ temporalContextData.seasonal.season }}</dd>
				</div>
				<div v-if="temporalContextData.seasonal?.daylight">
					<dt class="t-label">Daylight</dt>
					<dd class="m-0 text-[0.9rem]">{{ temporalContextData.seasonal.daylight }}</dd>
				</div>
				<div v-if="temporalContextData.seasonal?.weather?.length">
					<dt class="t-label">Weather</dt>
					<dd class="m-0 text-[0.9rem]">{{ temporalContextData.seasonal.weather.join(", ") }}</dd>
				</div>
				<div v-if="temporalContextData.seasonal?.holidays?.length">
					<dt class="t-label">In season</dt>
					<dd class="m-0 text-[0.9rem]">{{ temporalContextData.seasonal.holidays.join(", ") }}</dd>
				</div>
			</dl>
		</StepCard>

		<!-- ── THE PLACES · safe to read before the book ──────────────── -->
		<StepCard
			v-if="locationProfilesData"
			icon="house"
			title="The Places"
			:subtitle="locationProfilesData.primary?.name"
		>
			<p v-if="locationProfilesData.primary?.summary" class="reader">
				{{ locationProfilesData.primary.summary }}
			</p>
			<div v-if="locationProfilesData.primary?.paragraphs?.length" class="reader mt-3 max-w-prose">
				<p v-for="(para, i) in locationProfilesData.primary.paragraphs" :key="i" class="mb-3">{{ para }}</p>
			</div>

			<!--
				Everything drawn here is safe before the book — MEASURED, 20 of 21 location fields scanned
				clean. `purpose` is the exception: it reads "Crime scene", so it is gated.
			-->
			<ul v-if="places.length" class="mt-5 flex flex-col gap-3 p-0">
				<li v-for="place in places" :key="place.name" class="list-none rounded border border-line bg-ground-warm p-4">
					<p class="flex flex-wrap items-baseline gap-2">
						<span class="font-display text-[0.98rem] font-semibold">{{ place.name }}</span>
						<span v-if="place.type" class="t-subtitle text-[0.72rem]">{{ place.type }}</span>
						<span
							v-if="showSpoilers && place.purpose"
							class="rounded-sm bg-warn-wash px-1.5 py-0.5 text-[0.68rem] font-semibold text-warn"
						>{{ place.purpose }}</span>
					</p>
					<p v-if="place.visualDetails" class="mt-1.5 text-[0.85rem] leading-relaxed text-ink">{{ place.visualDetails }}</p>
					<div v-if="place.paragraphs?.length" class="reader mt-2.5 max-w-prose text-[0.92rem]">
						<p v-for="(para, i) in place.paragraphs" :key="i" class="mb-2.5">{{ para }}</p>
					</div>
					<dl v-if="senses(place).length" class="mt-3 grid gap-2 sm:grid-cols-2">
						<div v-for="sense in senses(place)" :key="sense.term">
							<dt class="t-label">{{ sense.term }}</dt>
							<dd class="m-0 text-[0.8rem] leading-snug text-ink-soft">{{ sense.value }}</dd>
						</div>
					</dl>
					<p
						v-if="showSpoilers && place.accessControl"
						class="mt-3 rounded border border-warn bg-warn-wash p-2.5 text-[0.8rem] leading-snug"
					>
						<span class="t-label !text-warn">Who can get in</span> — {{ place.accessControl }}
					</p>
				</li>
			</ul>

			<p v-if="atmosphere" class="mt-4 border-t border-line pt-4 text-[0.85rem] leading-relaxed text-ink-soft">
				<span class="t-label">Atmosphere</span> — {{ atmosphere }}
			</p>
		</StepCard>

		<!-- ── THE PEOPLE ────────────────────────────────────────────── -->
		<StepCard
			v-if="profiles.length || castData?.suspects?.length"
			icon="people"
			title="The People"
			:subtitle="`${profiles.length || castData?.suspects?.length || 0} in the house`"
		>
			<ul v-if="!profiles.length" class="flex flex-wrap gap-2 p-0">
				<li
					v-for="name in castData?.suspects ?? []"
					:key="name"
					class="list-none rounded-sm border border-line bg-ground-warm px-2.5 py-1 text-[0.82rem]"
				>{{ name }}</li>
			</ul>

			<ul v-else class="flex flex-col gap-3 p-0">
				<li v-for="person in profiles" :key="person.name" class="list-none rounded border border-line bg-ground-warm p-4">
					<p class="flex flex-wrap items-baseline gap-2">
						<span class="font-display text-[1rem] font-semibold">{{ person.name }}</span>
						<span v-if="person.humourStyle && person.humourStyle !== 'none'" class="t-subtitle text-[0.72rem]">
							{{ person.humourStyle.replace(/_/g, " ") }}
						</span>
					</p>

					<p v-if="person.summary" class="mt-1.5 text-[0.86rem] leading-relaxed">{{ person.summary }}</p>
					<p v-if="person.publicPersona" class="mt-2 text-[0.82rem] leading-snug text-ink-soft">
						<span class="t-label">In public</span> — {{ person.publicPersona }}
					</p>
					<p v-if="person.speechMannerisms" class="mt-1.5 text-[0.82rem] leading-snug text-ink-soft">
						<span class="t-label">Speaks</span> — {{ person.speechMannerisms }}
					</p>
					<p v-if="person.internalConflict" class="mt-1.5 text-[0.82rem] leading-snug text-ink-soft">
						<span class="t-label">Torn between</span> — {{ person.internalConflict }}
					</p>
					<p v-if="person.signatureTic" class="mt-2 font-display text-[0.9rem] italic text-ink">
						{{ stripQuotes(person.signatureTic) }}
					</p>

					<!--
						The long profile sits WITH the secrets, not with the background. It looks like harmless
						colour and is not: measured on a real payload, a suspect's second paragraph opens with
						the contents of `privateSecret`. See spec/spoilers.ts.
					-->
					<div v-if="showSpoilers" class="mt-3 rounded border border-warn bg-warn-wash p-3">
						<div v-if="person.paragraphs?.length" class="reader max-w-prose text-[0.9rem]">
							<p v-for="(para, i) in person.paragraphs" :key="i" class="mb-2.5">{{ para }}</p>
						</div>
						<dl v-if="secretsOf(person).length" class="flex flex-col gap-1.5 border-t border-warn pt-2.5" :class="person.paragraphs?.length ? 'mt-2' : ''">
							<div v-for="fact in secretsOf(person)" :key="fact.term" class="text-[0.82rem] leading-snug">
								<dt class="t-label !text-warn inline">{{ fact.term }}</dt>
								<dd class="m-0 inline"> — {{ fact.value }}</dd>
							</div>
						</dl>
					</div>
				</li>
			</ul>
		</StepCard>
		<StepCard
			v-if="hasStory"
			icon="book"
			title="The Story"
			:subtitle="`${chapters.length} chapters`"
		>
			<div class="flex flex-wrap gap-1.5">
				<button
					v-for="(chapter, index) in chapters"
					:key="index"
					type="button"
					class="transition-control rounded-sm border px-2.5 py-1 text-[0.78rem]"
					:class="
						readingChapter === index
							? 'border-accent bg-accent-wash font-semibold'
							: 'border-line bg-surface hover:border-line-strong'
					"
					:aria-current="readingChapter === index ? 'true' : undefined"
					@click="readingChapter = index"
				>
					{{ index + 1 }}
				</button>
			</div>

			<article v-if="chapters[readingChapter]" class="mt-5">
				<h3 class="t-display-sm">{{ chapters[readingChapter].title }}</h3>
				<div class="reader mt-3 max-w-prose">
					<p v-for="(para, i) in chapters[readingChapter].paragraphs" :key="i" class="mb-4">
						{{ para }}
					</p>
				</div>
			</article>
		</StepCard>

		<!-- ── spoilers ────────────────────────────────────────────────── -->
		<div class="rounded-lg border border-line bg-surface p-5 shadow-card">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<div class="min-w-0">
					<h2 class="t-section">The Solution</h2>
					<p class="t-subtitle mt-0.5">
						Motives, secrets, alibis and the clue list. Hidden until you ask.
					</p>
				</div>
				<AppButton
					:icon="showSpoilers ? 'close' : 'search'"
					:variant="showSpoilers ? 'secondary' : 'danger'"
					size="sm"
					:aria-pressed="showSpoilers"
					@click="toggleSpoilers"
				>
					{{ showSpoilers ? "Hide the solution" : "Show me the solution" }}
				</AppButton>
			</div>

			<div v-if="showSpoilers && cluesData?.items?.length" class="mt-4">
				<p v-if="cluesData.summary" class="reader mb-3">{{ cluesData.summary }}</p>
				<ul class="flex flex-col gap-1.5 p-0">
					<li
						v-for="clue in cluesData.items"
						:key="clue.id"
						class="flex list-none items-start gap-2 rounded border border-line bg-ground-warm px-3 py-2 text-[0.82rem]"
					>
						<AppIcon
							:name="clue.redHerring ? 'shuffle' : 'fingerprint'"
							:size="14"
							class="mt-0.5 shrink-0"
							:class="clue.redHerring ? 'text-warn' : 'text-ok'"
						/>
						<span class="min-w-0">
							{{ clue.text }}
							<span v-if="clue.redHerring" class="t-subtitle text-[0.72rem]"> — a red herring</span>
						</span>
					</li>
				</ul>
			</div>

			<p v-else-if="showSpoilers" class="t-subtitle mt-4">
				No clue list yet — it is written partway through the run.
			</p>
		</div>

		<!-- ── nothing yet ─────────────────────────────────────────────── -->
		<div
			v-if="!loading && !isRunning && !hasStory && !profiles.length && !backgroundContextData"
			class="rounded-lg border border-dashed border-line-strong p-10 text-center"
		>
			<p class="t-subtitle mx-auto max-w-[40ch]">
				Nothing has been written for this case yet.
			</p>
			<AppButton class="mt-4" size="sm" variant="ghost" icon="gear" @click="emit('openWorkshop')">
				Open it in the Workshop
			</AppButton>
		</div>
	</div>
</template>

<style scoped>
/* Reading type: serif, longer measure, looser leading — not interface type. */
.reader {
	font-family: var(--font-display);
	font-size: 0.98rem;
	line-height: 1.7;
	color: var(--ink);
}
</style>
