<script setup lang="ts">
/**
 * The handwritten line near the submit button ("Clever plots, brighter days").
 *
 * Purely decorative, and treated as such: `aria-hidden`, and it uses a cursive webfont whose
 * absence must cost nothing. If Caveat does not load the fallback is a system script face or plain
 * italic — legible either way, and the layout does not move because nothing is positioned against
 * its metrics.
 */
defineProps<{ text: string }>();
</script>

<template>
	<p class="t-script whitespace-pre-line" aria-hidden="true">
		{{ text }}
		<span class="mt-1 block h-px w-14 bg-line-strong" />
	</p>
</template>
