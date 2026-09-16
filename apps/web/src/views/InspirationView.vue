<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import HeroBanner from "../components/ui/HeroBanner.vue";
import StepCard from "../components/ui/StepCard.vue";
import { fetchSampleContent, fetchSamples, type SampleSummary } from "../services/api";

/**
 * Sample mysteries, read in the app.
 *
 * The boards' "Inspiration" nav item, backed by the samples endpoints that already existed and were
 * reachable only from a dropdown inside the operator console (UI-002 §3).
 */

const samples = ref<SampleSummary[]>([]);
const selected = ref<{ id: string; name: string; content: string } | null>(null);
const loadingList = ref(true);
const loadingId = ref<string | null>(null);
const error = ref<string | null>(null);

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

const loadList = async () => {
	loadingList.value = true;
	error.value = null;
	try {
		samples.value = await fetchSamples();
	} catch (e) {
		error.value = `Could not load the samples: ${message(e)}`;
	} finally {
		loadingList.value = false;
	}
};

const open = async (sample: SampleSummary) => {
	loadingId.value = sample.id;
	error.value = null;
	try {
		selected.value = await fetchSampleContent(sample.id);
		// Send focus to the reader so a keyboard user is not left at the bottom of the list.
		requestAnimationFrame(() => document.getElementById("sample-reader")?.focus());
	} catch (e) {
		error.value = `Could not open "${sample.name}": ${message(e)}`;
	} finally {
		loadingId.value = null;
	}
};

onMounted(loadList);
</script>

<template>
	<HeroBanner
		compact
		eyebrow="Inspiration"
		title="Cases worth reading twice."
		lede="Finished mysteries from the archive. Read one for the shape of it, then build your own."
	/>

	<div class="shell grid gap-6 py-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
		<StepCard icon="book" title="The Archive" :subtitle="`${samples.length} cases on file`">
			<p v-if="loadingList" class="t-subtitle">Opening the archive…</p>

			<p v-else-if="samples.length === 0" class="t-subtitle">
				No samples on file yet. Generate a mystery and it will appear here.
			</p>

			<ul v-else class="flex flex-col gap-1.5 p-0">
				<li v-for="sample in samples" :key="sample.id" class="list-none">
					<button
						type="button"
						class="transition-control flex w-full items-center gap-2.5 rounded border px-3 py-2.5 text-left"
						:class="
							selected?.id === sample.id
								? 'border-accent bg-accent-wash'
								: 'border-line bg-surface hover:border-line-strong'
						"
						:aria-current="selected?.id === sample.id ? 'true' : undefined"
						@click="open(sample)"
					>
						<AppIcon
							:name="loadingId === sample.id ? 'gear' : 'bookmark'"
							:size="16"
							:class="[
								loadingId === sample.id ? 'animate-spin' : '',
								selected?.id === sample.id ? 'text-accent' : 'text-ink-soft',
							]"
						/>
						<span class="min-w-0 flex-1 truncate text-[0.88rem] font-medium">{{ sample.name }}</span>
					</button>
				</li>
			</ul>

			<p v-if="error" class="mt-3 rounded border border-danger bg-danger-wash px-3 py-2 text-[0.8rem] text-danger">
				{{ error }}
			</p>

			<AppButton class="mt-3" size="sm" icon="shuffle" @click="loadList">Refresh</AppButton>
		</StepCard>

		<article
			v-if="selected"
			id="sample-reader"
			tabindex="-1"
			class="rounded-lg border border-line bg-surface p-6 shadow-card sm:p-8"
		>
			<h2 class="t-display-sm mb-5">{{ selected.name }}</h2>
			<div class="reader max-w-prose whitespace-pre-wrap">{{ selected.content }}</div>
		</article>

		<div
			v-else
			class="flex items-center justify-center rounded-lg border border-dashed border-line-strong p-10 text-center"
		>
			<p class="t-subtitle max-w-[34ch]">
				Choose a case from the archive to read it here.
			</p>
		</div>
	</div>
</template>

<style scoped>
/* Reading type, not interface type: longer measure, looser leading, serif. */
.reader {
	font-family: var(--font-display);
	font-size: 1rem;
	line-height: 1.75;
	color: var(--ink);
}

.animate-spin {
	animation: spin 1.4s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
