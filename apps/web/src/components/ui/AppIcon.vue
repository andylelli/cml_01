<script setup lang="ts">
import { computed } from "vue";
import { ICON_PATHS, SQUARE_JOIN, type IconName } from "./icons";

/**
 * One renderer for the whole glyph set (UI-001 §4).
 *
 * Decorative by default: an icon beside a label is noise to a screen reader, so it is aria-hidden
 * unless a `title` is supplied, at which point it becomes an `img` with an accessible name. Callers
 * that use an icon AS the only content of a button must pass `title`.
 */
const props = withDefaults(
	defineProps<{
		name: IconName;
		/** Pixel size; the glyph grid is 24×24 and scales cleanly from about 14 up. */
		size?: number | string;
		/** Stroke width in grid units. 1.5 is the system default; 1.75 reads better below 18px. */
		weight?: number;
		/** Supplying this makes the icon meaningful rather than decorative. */
		title?: string;
	}>(),
	{ size: 20, weight: 1.5, title: undefined },
);

const path = computed(() => ICON_PATHS[props.name]);
const linejoin = computed(() => (SQUARE_JOIN.includes(props.name) ? "miter" : "round"));
const dimension = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));
</script>

<template>
	<svg
		:width="dimension"
		:height="dimension"
		viewBox="0 0 24 24"
		fill="none"
		:stroke-width="weight"
		stroke="currentColor"
		stroke-linecap="round"
		:stroke-linejoin="linejoin"
		:role="title ? 'img' : undefined"
		:aria-hidden="title ? undefined : 'true'"
		:aria-label="title"
		class="shrink-0"
	>
		<title v-if="title">{{ title }}</title>
		<path :d="path" />
	</svg>
</template>
