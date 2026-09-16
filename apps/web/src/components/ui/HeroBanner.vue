<script setup lang="ts">
/**
 * The illustrated band under the nav.
 *
 * UI-001 §4: the art is a SLOT and its absence is a designed state, not a fallback. The boards'
 * hero illustrations are bespoke and this repo has none; a stock image would be worse than the
 * typographic treatment below, which is why that is what ships.
 *
 * The decorative rules and wash are drawn in CSS so the banner costs no network request and cannot
 * flash an empty box while an asset loads.
 */
withDefaults(
	defineProps<{
		title: string;
		lede?: string;
		eyebrow?: string;
		/** Tightens the band for interior pages. */
		compact?: boolean;
	}>(),
	{ lede: undefined, eyebrow: undefined, compact: false },
);
</script>

<template>
	<div class="hero relative overflow-hidden border-b border-line bg-ground-warm">
		<div
			class="relative mx-auto flex max-w-shell flex-col gap-5 px-4 sm:px-6 md:flex-row md:items-center"
			:class="compact ? 'py-8' : 'py-12 md:py-16'"
		>
			<div class="min-w-0 flex-1">
				<p v-if="eyebrow" class="t-eyebrow mb-3">{{ eyebrow }}</p>
				<h1 class="t-display max-w-[18ch] whitespace-pre-line">{{ title }}</h1>
				<p v-if="lede" class="t-subtitle mt-4 max-w-[46ch] text-[0.95rem]">{{ lede }}</p>
				<slot name="actions" />
			</div>

			<!-- Supply artwork here when a designer provides it; the layout reserves nothing when empty. -->
			<div v-if="$slots.art" class="shrink-0"><slot name="art" /></div>
		</div>
	</div>
</template>

<style scoped>
/**
 * A very low-contrast set of diagonals, reading as paper stock rather than as a pattern. Kept under
 * 3% alpha: anything stronger competes with the display serif sitting on top of it.
 */
.hero::before {
	content: "";
	position: absolute;
	inset: 0;
	background-image: repeating-linear-gradient(
		-45deg,
		rgba(43, 43, 40, 0.022) 0 1px,
		transparent 1px 11px
	);
	pointer-events: none;
}

/* A warm bloom from the right, standing in for the boards' illustration light. */
.hero::after {
	content: "";
	position: absolute;
	inset: 0;
	background: radial-gradient(
		62% 120% at 88% 40%,
		rgba(217, 185, 120, 0.3) 0%,
		rgba(217, 185, 120, 0) 70%
	);
	pointer-events: none;
}
</style>
