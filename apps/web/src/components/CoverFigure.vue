<script setup lang="ts">
import { computed } from "vue";
import { apiUrl, type CoverInfo } from "../services/api";

/**
 * The book's cover as a picture — at the top of a case, and as a thumbnail in the cases list
 * (documentation/covers/). Covers are made FIRST in a run, so this has three honest states:
 * painting (a placeholder), art without its title yet ("title to come"), and the finished, lettered cover.
 */
const props = withDefaults(
	defineProps<{
		cover: CoverInfo | null;
		/** "lg" for the case view, "sm" for a list thumbnail. */
		size?: "lg" | "sm";
		title?: string;
	}>(),
	{ size: "lg", title: "" },
);

const src = computed(() => (props.cover?.imageUrl ? apiUrl(props.cover.imageUrl) : null));
const painting = computed(() => !src.value && (props.cover?.inProgress || props.cover?.status === "painting"));
const failed = computed(() => !src.value && props.cover?.status === "failed");
const untitled = computed(() => !!src.value && props.cover?.lettered === false);
const alt = computed(() => (props.title ? `Cover of ${props.title}` : "The book's cover"));
</script>

<template>
	<figure
		class="relative m-0 overflow-hidden rounded border border-line bg-surface-sunken"
		:class="size === 'sm' ? 'aspect-[2/3] w-12 shrink-0' : 'aspect-[2/3] w-full shadow-card'"
	>
		<img v-if="src" :src="src" :alt="alt" class="h-full w-full object-cover" loading="lazy" />

		<div
			v-else-if="painting"
			class="flex h-full w-full animate-pulse items-center justify-center bg-surface-sunken p-2 text-center"
			role="status"
		>
			<span v-if="size === 'lg'" class="text-[0.78rem] leading-snug text-ink-soft">
				Painting the cover…<br />it appears here while the story is written.
			</span>
			<span v-else class="sr-only">Painting the cover</span>
		</div>

		<div v-else-if="failed && size === 'lg'" class="flex h-full w-full items-center justify-center p-3 text-center">
			<span class="text-[0.75rem] leading-snug text-ink-faint">No cover this time.</span>
		</div>

		<!-- Painted before the book has a name: the band is left plain and lettered when the title exists. -->
		<figcaption
			v-if="untitled && size === 'lg'"
			class="absolute inset-x-0 top-0 bg-black/45 px-2 py-1.5 text-center text-[0.7rem] uppercase tracking-[0.2em] text-white"
		>
			Title to come
		</figcaption>
	</figure>
</template>
