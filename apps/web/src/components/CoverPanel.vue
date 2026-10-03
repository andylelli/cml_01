<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AppButton from "./ui/AppButton.vue";
import FieldSelect from "./ui/FieldSelect.vue";
import type { Option } from "./ui/types";
import { fetchCoverStyles, requestCover, type CoverInfo, type CoverStylesResponse } from "../services/api";
import { stylesForDecade } from "../spec/coverStyles";

/**
 * The cover's CONTROLS (documentation/covers/): pick a style and make — or remake — the cover. The picture
 * itself is shown at the top of the case (CoverFigure); the case view owns the cover state and polls it,
 * so this component only asks and reports. Every request is a fresh draw, so a remake never repeats.
 */
const props = defineProps<{ projectId: string; hasStory: boolean; cover: CoverInfo | null; decade?: string | null }>();
const emit = defineEmits<{ requested: [] }>();

const library = ref<CoverStylesResponse | null>(null);
const style = ref("auto");
const error = ref<string | null>(null);
const requesting = ref(false);

const styleOptions = computed<Option[]>(() => [
	{ value: "auto", label: "Surprise me — best fits likelier" },
	// True to the decade: only this story's decade's styles (the server applies the same rule to "auto").
	...stylesForDecade(library.value?.styles ?? [], props.decade).map((s) => ({ value: s.id, label: s.label })),
]);
const styleHelp = computed(
	() => library.value?.styles.find((s) => s.id === style.value)?.summary ?? "A random style, weighted toward the era, setting and tone.",
);
const imageReady = computed(() => !!library.value?.image);
const painting = computed(() => requesting.value || !!props.cover?.inProgress || props.cover?.status === "painting");
const hasCover = computed(() => !!props.cover?.imageUrl);

const make = async () => {
	requesting.value = true;
	error.value = null;
	try {
		await requestCover(props.projectId, style.value);
		emit("requested");
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
});
</script>

<template>
	<div class="flex flex-col gap-3">
		<p v-if="cover?.styles?.length" class="text-[0.8rem] text-ink-soft">
			This one: {{ cover.styles.join(" + ") }}<span v-if="cover.framing"> · {{ cover.framing }}</span
			><span v-if="cover.palette"> · {{ cover.palette }}</span>
			<span v-if="cover.anchors?.clue_object" class="block text-ink-faint">Shows: {{ cover.anchors.clue_object }}</span>
			<span v-if="cover.titleCheck && !cover.titleCheck.ok" class="block text-warn">
				The title may be misspelled on this cover (read back as "{{ cover.titleCheck.read }}") — try a new one.
			</span>
		</p>
		<div class="grid gap-3 sm:grid-cols-[minmax(0,320px)_auto] sm:items-end">
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
					{{ hasCover ? "Make a new cover" : "Make a cover" }}
				</AppButton>
			</div>
		</div>
		<p v-if="library && !imageReady" class="text-[0.75rem] leading-snug text-warn">
			Covers are unavailable — {{ library.imageError }}
		</p>
		<p v-if="error" class="text-[0.75rem] leading-snug text-danger">{{ error }}</p>
		<p class="text-[0.72rem] leading-snug text-ink-faint">
			Every cover is a fresh draw in a style of the story's own decade: composition, palette and light change each
			time. The title is painted into the picture and read back to check its spelling. A cover made during the run
			is drawn from the setting alone; one made here from the opening chapters, with weapons kept off it.
		</p>
	</div>
</template>
