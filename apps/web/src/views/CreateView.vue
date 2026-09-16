<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import FieldNumber from "../components/ui/FieldNumber.vue";
import FieldSelect from "../components/ui/FieldSelect.vue";
import HeroBanner from "../components/ui/HeroBanner.vue";
import OptionGroup from "../components/ui/OptionGroup.vue";
import QuotePanel from "../components/ui/QuotePanel.vue";
import ScriptNote from "../components/ui/ScriptNote.vue";
import StepCard from "../components/ui/StepCard.vue";
import { brand } from "../design/brand";
import { composeTheme, mechanismNote } from "../spec/composeTheme";
import {
	CRIME_METHODS,
	KEY_THEMES,
	STORY_ELEMENTS,
	SURPRISE_ME,
	TWIST_OPTIONS,
	VICTIM_PROFILES,
} from "../spec/flavour";
import {
	CAST_SIZE_MAX,
	CAST_SIZE_MIN,
	DECADE_OPTIONS,
	DETECTIVE_OPTIONS,
	HUMOUR_OPTIONS,
	LENGTH_OPTIONS,
	LOCATION_OPTIONS,
	TONE_OPTIONS,
	type MysterySpec,
} from "../spec/vocabulary";

/**
 * THE CREATION WIZARD — the mood boards, over the pipeline's real vocabulary.
 *
 * Presentational: it owns the flavour fields (which are not spec) and emits a finished spec. All
 * network work belongs to the caller, which is what makes this testable without a server and what
 * keeps the submit path in one place rather than in six.
 */
const spec = defineModel<MysterySpec>({ required: true });

const props = withDefaults(defineProps<{ busy?: boolean; disabled?: boolean }>(), {
	busy: false,
	disabled: false,
});

const emit = defineEmits<{ submit: [MysterySpec] }>();

/* ── flavour: composes into `theme`, never sent as its own field ─────────────────────────────── */

const flavour = reactive({
	keyTheme: SURPRISE_ME,
	victimProfile: SURPRISE_ME,
	method: SURPRISE_ME,
	elements: SURPRISE_ME,
	twist: "no",
});

const castNamesText = ref("");

/** What the pipeline will actually receive as `theme`. Shown to the user — see the note below. */
const composedTheme = computed(() =>
	composeTheme({
		theme: spec.value.theme,
		keyTheme: flavour.keyTheme,
		victimProfile: flavour.victimProfile,
		method: flavour.method,
		elements: flavour.elements,
		wantsTwist: flavour.twist === "yes",
	}),
);

/**
 * The mechanism coupling, surfaced. Free text in `theme` can silently lock the murder method to a
 * family; the user is told rather than finding out by reading the book.
 */
const steer = computed(() => mechanismNote(composedTheme.value));

const showComposed = ref(false);

const onSubmit = () => {
	if (props.busy || props.disabled) return;
	emit("submit", {
		...spec.value,
		theme: composedTheme.value,
		castNames: castNamesText.value
			.split(",")
			.map((name) => name.trim())
			.filter(Boolean),
	});
};
</script>

<template>
	<HeroBanner
		eyebrow="Timeless mysteries · Infinite possibilities"
		title="Set the scene.&#10;We'll do the crime."
		lede="Choose a few details and generate your own original mystery, inspired by the golden age of crime."
	/>

	<div class="shell grid gap-6 py-8 xl:grid-cols-[minmax(0,1fr)_clamp(280px,24vw,340px)]">
		<!-- ── the form ────────────────────────────────────────────────── -->
		<form class="flex flex-col gap-4" @submit.prevent="onSubmit">
			<StepCard :step="1" title="Era" subtitle="When does your mystery take place?">
				<OptionGroup
					v-model="spec.decade"
					name="era"
					legend="Era"
					:options="DECADE_OPTIONS"
				/>
			</StepCard>

			<StepCard :step="2" title="Setting" subtitle="Where does the story unfold?">
				<OptionGroup
					v-model="spec.locationPreset"
					name="setting"
					legend="Setting"
					:options="LOCATION_OPTIONS"
				/>
			</StepCard>

			<StepCard :step="3" title="Tone" subtitle="What kind of mystery shall we create?">
				<OptionGroup v-model="spec.tone" name="tone" legend="Tone" :options="TONE_OPTIONS" />

				<!--
					The humour band. New control: this parameter has been wired through the pipeline
					since A_92 and no UI has ever sent it, so every run started from this app has
					silently used "classic". UI-002 B5.
				-->
				<div class="mt-5 border-t border-line pt-5">
					<p class="t-label mb-2">How much wit?</p>
					<OptionGroup
						v-model="spec.humourLevel"
						name="humour"
						legend="Humour"
						:options="HUMOUR_OPTIONS"
						:min-tile="140"
					/>
				</div>
			</StepCard>

			<StepCard :step="4" title="Characters" subtitle="Who will be involved?">
				<div class="grid gap-4 sm:grid-cols-2">
					<FieldNumber
						v-model="spec.castSize"
						label="Number of characters"
						unit="characters"
						:min="CAST_SIZE_MIN"
						:max="CAST_SIZE_MAX"
						help="Suspects, plus the victim and the detective."
					/>
					<FieldSelect
						v-model="spec.detectiveType"
						label="Who investigates?"
						icon="hat"
						:options="DETECTIVE_OPTIONS"
					/>
				</div>

				<div class="mt-4">
					<label for="cast-names" class="t-label mb-1.5 block">
						Names you'd like used <span class="font-normal text-ink-faint">(optional)</span>
					</label>
					<input
						id="cast-names"
						v-model="castNamesText"
						type="text"
						placeholder="Gerald Jardine, Nora Gaunt, Ambrose Halloway"
						aria-describedby="cast-names-help"
						class="transition-control w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong placeholder:text-ink-faint"
					/>
					<p id="cast-names-help" class="mt-1.5 text-[0.72rem] text-ink-soft">
						Separate with commas. Any you leave out are invented to suit the era.
					</p>
				</div>
			</StepCard>

			<StepCard :step="5" title="The Crime" subtitle="What sets the plot in motion?">
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<FieldSelect
						v-model="flavour.keyTheme"
						label="Motive"
						note=" (optional)"
						icon="tag"
						:options="KEY_THEMES"
					/>
					<FieldSelect
						v-model="flavour.victimProfile"
						label="Victim"
						note=" (optional)"
						icon="person"
						:options="VICTIM_PROFILES"
					/>
					<FieldSelect
						v-model="flavour.method"
						label="Method"
						note=" (optional)"
						icon="flask"
						:options="CRIME_METHODS"
					/>
				</div>
			</StepCard>

			<StepCard :step="6" title="Extra Details" subtitle="Add more flavour, or let fate decide.">
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<FieldSelect
						v-model="flavour.elements"
						label="Specific elements"
						note=" (optional)"
						icon="bookmark"
						:options="STORY_ELEMENTS"
					/>
					<FieldSelect
						v-model="flavour.twist"
						label="Twists"
						note=" (optional)"
						icon="sparkle"
						:options="TWIST_OPTIONS"
					/>
					<FieldSelect
						v-model="spec.targetLength"
						label="Length"
						icon="book"
						:options="LENGTH_OPTIONS"
					/>
				</div>

				<div class="mt-4">
					<label for="theme-text" class="t-label mb-1.5 block">
						Anything else <span class="font-normal text-ink-faint">(optional)</span>
					</label>
					<textarea
						id="theme-text"
						v-model="spec.theme"
						rows="2"
						placeholder="An inheritance nobody wanted."
						class="transition-control w-full resize-y rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong placeholder:text-ink-faint"
					/>
				</div>

				<!--
					Transparency, not decoration: this is verbatim what the pipeline receives. The
					steer note below it surfaces a coupling the user would otherwise discover only by
					reading a book about a clock they never asked for.
				-->
				<div v-if="composedTheme" class="mt-4 rounded border border-line bg-surface-sunken p-3">
					<button
						type="button"
						class="flex w-full items-center gap-2 text-left"
						:aria-expanded="showComposed"
						@click="showComposed = !showComposed"
					>
						<AppIcon
							name="chevronRight"
							:size="14"
							class="text-ink-soft transition-transform duration-150"
							:class="showComposed ? 'rotate-90' : ''"
						/>
						<span class="t-label">What we'll ask for</span>
					</button>
					<p v-if="showComposed" class="mt-2 font-display text-[0.85rem] italic leading-relaxed text-ink">
						{{ composedTheme }}
					</p>
					<p v-if="steer" class="mt-2 flex items-start gap-1.5 text-[0.72rem] leading-snug text-warn">
						<AppIcon name="sparkle" :size="13" class="mt-0.5 shrink-0" />
						<span>{{ steer }}</span>
					</p>
				</div>
			</StepCard>

			<!-- ── submit ──────────────────────────────────────────────── -->
			<div class="flex flex-col items-center gap-4 py-4 sm:flex-row sm:justify-center">
				<AppButton
					type="submit"
					variant="primary"
					icon="dice"
					:busy="busy"
					:disabled="disabled"
					busy-label="Building your mystery…"
				>
					Generate My Mystery
				</AppButton>
				<ScriptNote :text="brand.scriptNote" class="hidden sm:block" />
			</div>

			<p class="t-eyebrow pb-4 text-center">Different suspects. Every time.</p>
		</form>

		<!-- ── the epigraph column (board 1) ───────────────────────────── -->
		<!-- Sticky below the nav: on the board this column is full-height, and letting it scroll away
		     leaves a tall empty gutter beside steps 3-6. `top` clears the sticky header. -->
		<QuotePanel
			class="hidden self-start xl:sticky xl:top-24 xl:block"
			quote="In every house there is a secret, and in every secret, a story."
			:features="[
				{
					icon: 'hat',
					title: 'Original, never-before-seen mysteries',
					detail: 'Every case is generated from scratch and checked against the ones before it.',
				},
				{
					icon: 'book',
					title: 'Inspired by the golden age of crime',
					detail: 'Fair-play clueing: everything the detective knows, you saw first.',
				},
				{
					icon: 'search',
					title: 'For readers, writers and game nights',
					detail: 'Read it as a novel, or play it as a case with suspects and alibis.',
				},
			]"
		/>
	</div>
</template>
