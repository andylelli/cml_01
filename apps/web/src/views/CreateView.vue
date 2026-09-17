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
import { ANGLE_GROUPS, randomAngle } from "../spec/storyAngles";
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

/**
 * THE ANGLE IS NOT THE THEME, and the difference is the reason it is its own step.
 *
 * The theme is the CRIME. The angle is the WORLD the crime happens inside. They are not
 * alternatives — a story has both — and they do not even reach the same agents: Agents 1 and 2
 * read `storyAngle` directly and are never shown the theme, while Agents 2e/3b/3 read the theme
 * and never see the field. The API fans one value out to both (`composeThemeWithAngle`).
 *
 * So it is NOT folded into `composedTheme` here: doing that would send it twice.
 */
const pickAngle = () => {
	spec.value.storyAngle = randomAngle();
};

/** Free text in the angle can lock the murder method just as free text in the theme can. */
const angleSteer = computed(() => mechanismNote(spec.value.storyAngle ?? ""));

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

			<!--
				THE WORLD — its own step, because the angle is the one lever against sameness and it was
				previously unreachable from anywhere a reader goes. It is also the field most easily confused
				with the theme, so the two are separated by a step and the copy says which is which.
			-->
			<StepCard :step="6" title="The World" subtitle="What world does the story move in?">
				<p class="max-w-prose text-[0.86rem] leading-relaxed text-ink-soft">
					The <strong class="font-semibold text-ink">crime</strong> is one thing; the
					<strong class="font-semibold text-ink">world it happens in</strong> is another. A racing
					stable, a by-election, a cathedral restoration — this colours the place, what the characters
					do for a living and what they stand to lose. It is never the murder method.
				</p>
			
				<div class="mt-4">
					<label for="story-angle" class="t-label mb-1.5 block">
						Story angle <span class="font-normal text-ink-faint">(optional)</span>
					</label>
					<div class="flex flex-wrap gap-2">
						<input
							id="story-angle"
							v-model="spec.storyAngle"
							list="create-angle-options"
							aria-describedby="story-angle-help"
							placeholder="a racing stable in the weeks before a classic"
							class="transition-control min-w-0 flex-1 rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong placeholder:text-ink-faint"
						/>
						<AppButton type="button" size="sm" icon="shuffle" @click="pickAngle">Surprise me</AppButton>
						<AppButton
							v-if="spec.storyAngle"
							type="button"
							size="sm"
							variant="ghost"
							@click="spec.storyAngle = ''"
						>
							Clear
						</AppButton>
					</div>
			
					<!-- A datalist, not a 107-row select: it filters as you type and still takes free text. -->
					<datalist id="create-angle-options">
						<template v-for="group in ANGLE_GROUPS" :key="group.category">
							<option v-for="angle in group.angles" :key="angle" :value="angle">{{ group.category }}</option>
						</template>
					</datalist>
			
					<p id="story-angle-help" class="mt-1.5 text-[0.72rem] leading-snug text-ink-soft">
						Pick one, type your own, or leave it blank. Without an angle every mystery tends toward the
						same country house.
					</p>
					<p v-if="angleSteer" class="mt-2 flex items-start gap-1.5 text-[0.72rem] leading-snug text-warn">
						<AppIcon name="sparkle" :size="13" class="mt-0.5 shrink-0" />
						<span>{{ angleSteer }}</span>
					</p>
				</div>
			</StepCard>

			<StepCard :step="7" title="Extra Details" subtitle="Add more flavour, or let fate decide.">
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
						The theme <span class="font-normal text-ink-faint">(optional)</span>
					</label>
					<p id="theme-help" class="mb-2 text-[0.72rem] leading-snug text-ink-soft">
						The <strong class="font-semibold text-ink">crime</strong> — what happens and what hides it.
						Not to be confused with the story angle in step 6, which is the world it happens in.
					</p>
					<textarea
						id="theme-text"
						aria-describedby="theme-help"
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
				<div v-if="composedTheme || spec.storyAngle" class="mt-4 rounded border border-line bg-surface-sunken p-3">
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
					<!--
						Shown separately rather than appended, because the API is what appends it (and passes it as
						its own field besides). Composing it here too would send the angle twice.
					-->
					<p v-if="showComposed && spec.storyAngle" class="mt-2 text-[0.78rem] leading-relaxed text-ink-soft">
						<span class="t-label">Story angle</span> — {{ spec.storyAngle }}
						<span class="block text-[0.72rem] text-ink-faint">
							Goes to the setting and cast directly, and is added to the text above as background.
						</span>
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
