<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppButton from "./ui/AppButton.vue";
import FieldSelect from "./ui/FieldSelect.vue";
import type { Option } from "./ui/types";
import {
	coverImageUrl,
	fetchCover,
	fetchCoverStyles,
	requestCover,
	type CoverInfo,
	type CoverStylesResponse,
} from "../services/api";

/**
 * The book's cover (documentation/covers/). Shows the cover when there is one, and offers to make or
 * remake it in any style from the library. A cover is a post-pass on a finished book: it can be asked
 * for at creation (the "Book cover" select) or here, at any time, for any book with prose.
 *
 * Self-contained on purpose: it owns its own fetching and polling, so the case view only places it.
 */
const props = defineProps<{ projectId: string; hasStory: boolean }>();

const cover = ref<CoverInfo | null>(null);
const library = ref<CoverStylesResponse | null>(null);
const style = ref("auto");
const error = ref<string | null>(null);
const requesting = ref(false);
let poll: ReturnType<typeof setInterval> | null = null;

const styleOptions = computed<Option[]>(() => [
	{ value: "auto", label: "Best fit for this story" },
	...(library.value?.styles ?? []).map((s) => ({ value: s.id, label: s.label })),
]);
const styleHelp = computed(
	() => library.value?.styles.find((s) => s.id === style.value)?.summary ?? "Chosen from the era, setting and tone.",
);
const imageReady = computed(() => !!library.value?.image);
const painting = computed(() => requesting.value || !!cover.value?.inProgress);
const imageSrc = computed(() =>
	cover.value?.path ? coverImageUrl(props.projectId, cover.value.generatedAt ?? "") : null,
);

const stopPoll = () => {
	if (poll) {
		clearInterval(poll);
		poll = null;
	}
};

const load = async () => {
	try {
		cover.value = await fetchCover(props.projectId);
		error.value = null;
	} catch (e) {
		error.value = e instanceof Error ? e.message : String(e);
	}
	if (cover.value?.inProgress && !poll) poll = setInterval(load, 4000);
	if (!cover.value?.inProgress) stopPoll();
};

const make = async () => {
	requesting.value = true;
	error.value = null;
	try {
		await requestCover(props.projectId, style.value);
		cover.value = { ...(cover.value ?? {}), inProgress: true };
		if (!poll) poll = setInterval(load, 4000);
	} catch (e) {
		error.value = e instanceof Error ? e.message : String(e);
	} finally {
		requesting.value = false;
	}
};

onMounted(async () => {
	try {
		library.value = await fetchCoverStyles();
	} catch {
		library.value = null;
	}
	await load();
});
watch(() => props.projectId, load);
onBeforeUnmount(stopPoll);
</script>

<template>
	<div class="grid gap-5 sm:grid-cols-[minmax(0,220px)_1fr]">
		<figure class="m-0">
			<div
				class="flex aspect-[2/3] w-full items-center justify-center overflow-hidden rounded border border-line bg-surface-sunken"
			>
				<img
					v-if="imageSrc && !painting"
					:src="imageSrc"
					alt="The book's cover"
					class="h-full w-full object-cover"
				/>
				<p v-else class="px-4 text-center text-[0.8rem] text-ink-soft">
					{{ painting ? "Painting the cover… about a minute." : "No cover yet." }}
				</p>
			</div>
			<figcaption v-if="cover?.styles?.length && !painting" class="mt-2 text-[0.72rem] text-ink-faint">
				{{ cover.styles.join(" + ") }}<span v-if="cover.palette"> · {{ cover.palette }}</span>
				<span v-if="cover.anchors?.clue_object" class="block">Shows: {{ cover.anchors.clue_object }}</span>
			</figcaption>
		</figure>

		<div class="flex flex-col gap-3">
			<FieldSelect
				v-model="style"
				label="Cover style"
				icon="bookmark"
				:options="styleOptions"
				:help="styleHelp"
				:disabled="painting || !imageReady"
			/>
			<div>
				<AppButton
					size="sm"
					variant="primary"
					icon="sparkle"
					:busy="painting"
					busy-label="Painting…"
					:disabled="!hasStory || !imageReady"
					@click="make"
				>
					{{ imageSrc ? "Make a new cover" : "Make a cover" }}
				</AppButton>
			</div>
			<p v-if="library && !imageReady" class="text-[0.75rem] leading-snug text-warn">
				Covers are unavailable — {{ library.imageError }}
			</p>
			<p v-if="error" class="text-[0.75rem] leading-snug text-danger">{{ error }}</p>
			<p class="text-[0.72rem] leading-snug text-ink-faint">
				The picture is drawn from the opening chapters, with weapons and crime scenes kept off it. The title is
				lettered separately, so it is always spelled right.
			</p>
		</div>
	</div>
</template>
