<script setup lang="ts" generic="T extends string">
import AppIcon from "./AppIcon.vue";
import type { IconName } from "./icons";

/**
 * The boards' row of illustrated, selectable tiles (Era, Setting, Tone).
 *
 * ── TWO DELIBERATE DEPARTURES FROM THE BOARD (UI-001 §5) ──────────────────────────────────────
 *
 * 1. The board indicates selection by BORDER COLOUR ALONE, which fails WCAG 1.4.1. Selection also
 *    shows a check glyph, so the state survives greyscale and colour blindness.
 * 2. These are real radio inputs in a fieldset, not clickable divs. Arrow-key navigation, the
 *    accessible name, and the group semantics all come free and correct; a div with role="radio"
 *    would have to reimplement all three and would get one of them wrong.
 *
 * The input is visually hidden rather than `display:none` — a hidden input is not focusable, which
 * would silently remove the whole group from the keyboard.
 */
export interface Option<V extends string> {
	value: V;
	label: string;
	hint?: string;
	icon: string;
}

const props = defineProps<{
	/** Radio group name; must be unique on the page. */
	name: string;
	legend: string;
	options: readonly Option<T>[];
	/** Minimum tile width before the row wraps. Narrower for dense groups. */
	minTile?: number;
}>();

const model = defineModel<T>({ required: true });
</script>

<template>
	<fieldset class="m-0 border-0 p-0">
		<legend class="sr-only">{{ legend }}</legend>
		<div
			class="grid gap-2.5"
			:style="{ gridTemplateColumns: `repeat(auto-fit, minmax(${props.minTile ?? 128}px, 1fr))` }"
		>
			<label
				v-for="option in options"
				:key="option.value"
				class="transition-control relative flex cursor-pointer flex-col items-center gap-1.5 rounded border px-3 py-3.5 text-center"
				:class="
					model === option.value
						? 'border-accent bg-accent-wash'
						: 'border-line bg-surface hover:border-line-strong'
				"
			>
				<input
					v-model="model"
					type="radio"
					:name="name"
					:value="option.value"
					class="sr-only"
				/>

				<!-- Selected marker. Colour alone is not a state. -->
				<span
					v-if="model === option.value"
					class="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[--surface]"
					aria-hidden="true"
				>
					<AppIcon name="check" :size="11" :weight="2.75" />
				</span>

				<AppIcon
					:name="(option.icon as IconName)"
					:size="26"
					:weight="1.4"
					:class="model === option.value ? 'text-accent' : 'text-ink-soft'"
				/>

				<span
					class="text-[0.82rem] leading-tight"
					:class="model === option.value ? 'font-semibold text-ink' : 'font-medium text-ink'"
				>
					{{ option.label }}
				</span>

				<span v-if="option.hint" class="text-[0.7rem] leading-snug text-ink-soft">
					{{ option.hint }}
				</span>
			</label>
		</div>
	</fieldset>
</template>

<style scoped>
/* Visually hidden but still focusable — see the note above about display:none. */
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}

/* The focus ring belongs on the tile, not on the invisible input. */
label:has(input:focus-visible) {
	box-shadow: var(--focus-ring);
	border-color: var(--accent);
}
</style>
