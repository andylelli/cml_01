<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppButton from "./ui/AppButton.vue";
import AppIcon from "./ui/AppIcon.vue";
import type { NarrationChapter } from "../services/api";

/**
 * An audiobook player, not a media element with a skin.
 *
 * What that actually means here: a 70-minute narration is listened to in
 * sittings, so the position is remembered per source and offered back rather
 * than silently restored — being dropped into the middle of a chapter with no
 * explanation is worse than starting again. Skips are 15s back / 30s forward,
 * the audiobook convention, because the thing you missed is usually a sentence
 * and the thing you want to skip is usually a paragraph.
 *
 * Seeking depends on the server answering HTTP Range; without it the scrub bar
 * is decorative.
 */
const props = withDefaults(
	defineProps<{
		src: string;
		title?: string;
		/** Chapter offsets let one file behave like a chaptered book. */
		chapters?: NarrationChapter[];
		/** Key for remembering the position; omit to not remember at all. */
		rememberAs?: string;
		durationHint?: number;
	}>(),
	{ title: undefined, chapters: () => [], rememberAs: undefined, durationHint: undefined },
);

const audio = ref<HTMLAudioElement | null>(null);
const playing = ref(false);
const current = ref(0);
const duration = ref(props.durationHint ?? 0);
const buffered = ref(0);
const rate = ref(1);
const error = ref<string | null>(null);
const resumeAt = ref<number | null>(null);
const scrubbing = ref(false);

const RATES = [0.75, 1, 1.25, 1.5, 1.75];

const storeKey = computed(() => (props.rememberAs ? `narration-pos:${props.rememberAs}` : null));

const clock = (s: number) => {
	if (!Number.isFinite(s) || s < 0) return "0:00";
	const total = Math.floor(s);
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const sec = total % 60;
	return h > 0
		? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
		: `${m}:${String(sec).padStart(2, "0")}`;
};

const elapsed = computed(() => clock(current.value));
const remaining = computed(() => clock(Math.max(0, duration.value - current.value)));
const percent = computed(() => (duration.value ? (current.value / duration.value) * 100 : 0));
const bufferedPercent = computed(() => (duration.value ? (buffered.value / duration.value) * 100 : 0));

/** The chapter the playhead is inside, by start offset. */
const activeChapter = computed(() => {
	if (!props.chapters.length) return -1;
	let found = -1;
	props.chapters.forEach((c, i) => {
		if (typeof c.startSeconds === "number" && current.value >= c.startSeconds - 0.25) found = i;
	});
	return found;
});

const toggle = async () => {
	const el = audio.value;
	if (!el) return;
	error.value = null;
	try {
		if (el.paused) await el.play();
		else el.pause();
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Could not start playback.";
	}
};

const seekTo = (seconds: number) => {
	const el = audio.value;
	if (!el || !Number.isFinite(seconds)) return;
	el.currentTime = Math.max(0, Math.min(seconds, duration.value || seconds));
	current.value = el.currentTime;
};

const nudge = (by: number) => seekTo(current.value + by);

const jumpToChapter = (index: number) => {
	const chapter = props.chapters[index];
	if (!chapter || typeof chapter.startSeconds !== "number") return;
	seekTo(chapter.startSeconds);
	resumeAt.value = null;
	if (audio.value?.paused) void toggle();
};

const setRate = (value: number) => {
	rate.value = value;
	if (audio.value) audio.value.playbackRate = value;
};

/* ---- the scrub bar: a range input, so it is keyboard and screen-reader native ---- */

const onScrubInput = (event: Event) => {
	scrubbing.value = true;
	current.value = Number((event.target as HTMLInputElement).value);
};
const onScrubCommit = (event: Event) => {
	seekTo(Number((event.target as HTMLInputElement).value));
	scrubbing.value = false;
};

/* ---- position memory ---- */

const remember = () => {
	if (!storeKey.value || !duration.value) return;
	try {
		// Near the end is "finished", not "resume at 69:58".
		if (current.value > 15 && duration.value - current.value > 20) {
			localStorage.setItem(storeKey.value, String(Math.floor(current.value)));
		} else {
			localStorage.removeItem(storeKey.value);
		}
	} catch {
		/* private browsing and blocked storage must not break playback */
	}
};

const readRemembered = () => {
	if (!storeKey.value) return;
	try {
		const raw = localStorage.getItem(storeKey.value);
		const at = raw ? Number(raw) : 0;
		if (at > 15) resumeAt.value = at;
	} catch {
		/* ignore */
	}
};

const resume = () => {
	if (resumeAt.value == null) return;
	seekTo(resumeAt.value);
	resumeAt.value = null;
	void toggle();
};

const startOver = () => {
	resumeAt.value = null;
	try {
		if (storeKey.value) localStorage.removeItem(storeKey.value);
	} catch {
		/* ignore */
	}
};

/* ---- element events ---- */

const onLoaded = () => {
	const el = audio.value;
	if (!el) return;
	if (Number.isFinite(el.duration) && el.duration > 0) duration.value = el.duration;
	el.playbackRate = rate.value;
};

const onTime = () => {
	const el = audio.value;
	if (!el || scrubbing.value) return;
	current.value = el.currentTime;
	if (Number.isFinite(el.duration) && el.duration > 0) duration.value = el.duration;
	const ranges = el.buffered;
	if (ranges.length) buffered.value = ranges.end(ranges.length - 1);
};

const onError = () => {
	error.value = "The audio could not be loaded. It may still be rendering, or the file has been removed.";
	playing.value = false;
};

let rememberTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
	readRemembered();
	rememberTimer = setInterval(remember, 5000);
});

onBeforeUnmount(() => {
	remember();
	if (rememberTimer) clearInterval(rememberTimer);
});

// A new render of the same case is a different recording; forget where we were.
watch(
	() => props.src,
	() => {
		current.value = 0;
		duration.value = props.durationHint ?? 0;
		playing.value = false;
		error.value = null;
		readRemembered();
	},
);
</script>

<template>
	<div class="rounded-lg border border-line bg-surface-sunken p-4">
		<audio
			ref="audio"
			:src="src"
			preload="metadata"
			class="hidden"
			@loadedmetadata="onLoaded"
			@timeupdate="onTime"
			@progress="onTime"
			@play="playing = true"
			@pause="playing = false"
			@ended="playing = false"
			@error="onError"
		/>

		<div class="flex items-center gap-3">
			<button
				type="button"
				class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-on-frame transition hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
				:aria-label="playing ? 'Pause' : 'Play'"
				@click="toggle"
			>
				<AppIcon :name="playing ? 'pause' : 'play'" class="h-5 w-5" />
			</button>

			<div class="min-w-0 flex-1">
				<p v-if="title" class="truncate text-[0.9rem] font-medium text-ink">{{ title }}</p>
				<p class="t-subtitle text-[0.72rem]">
					{{ elapsed }} <span class="text-ink-faint">/ −{{ remaining }}</span>
					<span v-if="activeChapter >= 0" class="text-ink-faint">
						· {{ chapters[activeChapter]?.title }}
					</span>
				</p>
			</div>

			<div class="flex shrink-0 items-center gap-1">
				<AppButton size="sm" variant="ghost" @click="nudge(-15)">−15s</AppButton>
				<AppButton size="sm" variant="ghost" @click="nudge(30)">+30s</AppButton>
			</div>
		</div>

		<!-- scrub -->
		<div class="relative mt-3">
			<div class="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-line">
				<div class="h-full bg-line-strong" :style="{ width: `${bufferedPercent}%` }" />
				<div class="-mt-1.5 h-full bg-accent" :style="{ width: `${percent}%` }" />
			</div>
			<input
				type="range"
				min="0"
				:max="duration || 0"
				step="0.5"
				:value="current"
				:aria-label="`Seek within ${title || 'the narration'}`"
				:aria-valuetext="`${elapsed} of ${clock(duration)}`"
				class="relative w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent"
				@input="onScrubInput"
				@change="onScrubCommit"
			/>
		</div>

		<div class="mt-2 flex flex-wrap items-center gap-2">
			<span class="t-subtitle text-[0.7rem]">Speed</span>
			<button
				v-for="r in RATES"
				:key="r"
				type="button"
				class="rounded border px-2 py-0.5 text-[0.75rem] transition"
				:class="
					rate === r
						? 'border-accent bg-accent-wash text-ink'
						: 'border-line text-ink-soft hover:border-line-strong'
				"
				:aria-pressed="rate === r"
				@click="setRate(r)"
			>
				{{ r }}×
			</button>
		</div>

		<!-- resume is offered, never done silently -->
		<div
			v-if="resumeAt !== null"
			class="mt-3 flex flex-wrap items-center gap-2 rounded border border-line bg-surface px-3 py-2 text-[0.8rem]"
		>
			<span class="text-ink-soft">You stopped at {{ clock(resumeAt) }}.</span>
			<AppButton size="sm" @click="resume">Resume</AppButton>
			<AppButton size="sm" variant="ghost" @click="startOver">Start over</AppButton>
		</div>

		<p
			v-if="error"
			class="mt-3 rounded border border-danger bg-danger-wash px-3 py-2 text-[0.8rem] text-danger"
		>
			{{ error }}
		</p>

		<details v-if="chapters.length > 1" class="mt-3">
			<summary class="cursor-pointer text-[0.8rem] text-ink-soft">
				{{ chapters.length }} chapters
			</summary>
			<ol class="mt-2 flex flex-col gap-0.5 p-0">
				<li v-for="(chapter, i) in chapters" :key="chapter.file">
					<button
						type="button"
						class="flex w-full items-baseline gap-2 rounded px-2 py-1 text-left text-[0.82rem] transition hover:bg-accent-wash"
						:class="i === activeChapter ? 'bg-accent-wash font-medium text-ink' : 'text-ink-soft'"
						:disabled="typeof chapter.startSeconds !== 'number'"
						@click="jumpToChapter(i)"
					>
						<span class="w-6 shrink-0 tabular-nums text-ink-faint">{{ i + 1 }}</span>
						<span class="min-w-0 flex-1 truncate">{{ chapter.title }}</span>
						<span v-if="chapter.durationSeconds" class="shrink-0 tabular-nums text-ink-faint">
							{{ clock(chapter.durationSeconds) }}
						</span>
					</button>
				</li>
			</ol>
		</details>
	</div>
</template>
