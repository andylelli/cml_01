<script setup lang="ts">
import { computed } from "vue";
import { useWorkshop } from "../useWorkshopState";
import { ANGLE_GROUPS, randomAngle } from "../../../spec/storyAngles";
import { mechanismNote } from "../../../spec/composeTheme";

/**
 * Spec — The story specification sent to the pipeline.
 *
 * Extracted from WorkshopView (UI-002 item 25). It injects the console state rather than taking
 * props: this panel alone binds 4 values, and a prop signature that wide is not an
 * interface. The block below is the original markup, moved unchanged.
 */
const {
	castNamesInput,
	handleSuggestTheme,
	spec,
} = useWorkshop();

/**
 * THE ANGLE — the world the crime happens inside, as opposed to the crime.
 *
 * It is a separate spec field rather than something to type into the theme, because it travels by
 * a different route: Agents 1 and 2 read `storyAngle` directly and are never shown the theme at
 * all, while Agents 2e/3b/3 read the theme and never see the field. The API fans one value out to
 * both (`composeThemeWithAngle`, server.ts). MEASURED: before that existed the API never sent the
 * field, so those two prompt blocks had never once fired for a run started from this app.
 */
const pickRandomAngle = () => {
	spec.value.storyAngle = randomAngle();
};

/**
 * The angle is appended to the theme, and the theme is read by SUBSTRING matchers that lock the
 * murder device onto a family — "championship" contains "ship". The 107 listed angles are
 * self-tested against those matchers by the generator; free text is not, so it gets the same note
 * the theme field would give. A note, never an error: sometimes it is exactly what is wanted.
 */
const angleSteer = computed(() => mechanismNote(spec.value.storyAngle ?? ""));
</script>

<template>
	  <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
	    <div class="t-section">Story Specification</div>
	    <div class="mt-4 text-sm text-ink-soft">
	      Configure your mystery story settings. These specifications will guide the AI generation.
	    </div>
	    <div class="mt-6 grid gap-4 md:grid-cols-2">
	      <div id="field-setting">
	        <label for="field-decade" class="text-xs font-semibold text-ink-soft">Decade</label>
	        <select id="field-decade" v-model="spec.decade" class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong">
	          <option>1930s</option>
	          <option>1940s</option>
	          <option>1950s</option>
	        </select>
	      </div>
	      <div id="field-location">
	        <label for="field-locationPreset" class="text-xs font-semibold text-ink-soft">Location preset</label>
	        <select id="field-locationPreset" v-model="spec.locationPreset" class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong">
	          <option>CountryHouse</option>
	          <option>SeasideHotel</option>
	          <option>Village</option>
	          <option>Liner</option>
	          <option>Theatre</option>
	        </select>
	      </div>
	      <div id="field-tone">
	        <label for="f-tone" class="text-xs font-semibold text-ink-soft">Tone</label>
	        <select id="f-tone" v-model="spec.tone" class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong">
	          <option>Cozy</option>
	          <option>Classic</option>
	          <option>Dark</option>
	        </select>
	        <!-- B4: server.ts:675 also flips narrativeStyle to "atmospheric" when tone is
	             Dark. Surfacing the coupling, not changing it — that is a pipeline call. -->
	        <div class="mt-1 text-[11px] text-ink-faint">
	          <strong>Dark</strong> also sets the narrator to <em>atmospheric</em>.
	        </div>
	      </div>
	      <div id="field-humourLevel">
	        <label for="f-humour-band" class="text-xs font-semibold text-ink-soft">Humour band</label>
	        <select id="f-humour-band" v-model="spec.humourLevel" class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong">
	          <option value="none">None — no character is funny</option>
	          <option value="dry">Dry — at most two, understated</option>
	          <option value="classic">Classic — a beat each chapter (default)</option>
	          <option value="sharp">Sharp — three wits, one unkind</option>
	        </select>
	        <!-- B5: wired through Agent 2b and Agent 9 since A_92 and never sent by any UI.
	             Absent resolves to "classic" silently (humour-level.ts:87), so every run
	             started from this app has used that band whether or not it was wanted. -->
	        <div class="mt-1 text-[11px] text-ink-faint">
	          Sets which humour styles the cast may take and how often a wit beat is asked for.
	        </div>
	      </div>
	      <div class="md:col-span-2">
	        <label for="f-theme" class="text-xs font-semibold text-ink-soft">Theme (optional)</label>
	        <div class="mt-2 flex flex-wrap gap-2">
	          <input
	          	id="f-theme"
	            v-model="spec.theme"
	            class="flex-1 rounded-md border border-line px-3 py-2 text-sm"
	            placeholder="A charity gala with hidden rivalries"
	          />
	          <button
	            class="transition-control rounded border border-line bg-surface px-3 py-1.5 text-[0.8rem] font-medium text-ink hover:border-line-strong hover:bg-surface-sunken"
	            type="button"
	            @click="handleSuggestTheme"
	          >
	            Suggest theme
	          </button>
	        </div>
	        <div class="mt-1 text-[11px] text-ink-faint">
	          Optional. Adds a thematic jolt to steer the mystery.
	        </div>
	      </div>
	      <div class="md:col-span-2">
	        <label for="f-story-angle" class="text-xs font-semibold text-ink-soft">Story angle (optional)</label>
	        <div class="mt-2 flex flex-wrap gap-2">
	          <input
	            id="f-story-angle"
	            v-model="spec.storyAngle"
	            list="story-angle-options"
	            class="flex-1 rounded-md border border-line px-3 py-2 text-sm"
	            placeholder="a racing stable in the weeks before a classic"
	          />
	          <button
	            class="transition-control rounded border border-line bg-surface px-3 py-1.5 text-[0.8rem] font-medium text-ink hover:border-line-strong hover:bg-surface-sunken"
	            type="button"
	            @click="pickRandomAngle"
	          >
	            Surprise me
	          </button>
	          <button
	            v-if="spec.storyAngle"
	            class="transition-control rounded border border-line bg-surface px-3 py-1.5 text-[0.8rem] font-medium text-ink-soft hover:border-line-strong hover:bg-surface-sunken"
	            type="button"
	            @click="spec.storyAngle = ''"
	          >
	            Clear
	          </button>
	        </div>
	      
	        <!--
	          A datalist rather than a 107-row select: it filters as you type, and it still accepts free
	          text, which is what `run-params.mjs --angle "<text>"` does. The listed 107 are the ones the
	          generator self-tests against the mechanism matchers.
	        -->
	        <datalist id="story-angle-options">
	          <template v-for="group in ANGLE_GROUPS" :key="group.category">
	            <option v-for="angle in group.angles" :key="angle" :value="angle">{{ group.category }}</option>
	          </template>
	        </datalist>
	      
	        <div class="mt-1 text-[11px] text-ink-faint">
	          The world the story draws on — sport, the services, politics, the arts, invention, crime,
	          trade, institutions. It colours the setting, the cast's occupations and the motive. It is
	          not the murder method, and the pipeline is told so.
	        </div>
	        <div v-if="angleSteer" class="mt-1.5 rounded border border-warn bg-warn-wash px-2 py-1 text-[11px] text-warn">
	          {{ angleSteer }}
	        </div>
	      </div>
	      <div id="field-cast">
	        <label for="field-castSize" class="text-xs font-semibold text-ink-soft">Cast size</label>
	        <input
	          id="field-castSize"
	          v-model.number="spec.castSize"
	          type="number"
	          min="4"
	          max="12"
	          class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong"
	        />
	        <div class="mt-1 text-[11px] text-ink-faint">
	          Suspects &amp; witnesses. The detective is always added as an extra character (+1).
	        </div>
	      </div>
	      <div id="field-detectiveType">
	        <label for="f-detective-type" class="text-xs font-semibold text-ink-soft">Detective type</label>
	        <select id="f-detective-type" v-model="spec.detectiveType" class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong">
	          <option value="police">Police Inspector / Detective</option>
	          <option value="private">Private Investigator</option>
	          <option value="amateur">Amateur / Layperson</option>
	        </select>
	        <div class="mt-1 text-[11px] text-ink-faint">
	          Amateur lets the AI invent anyone — a vicar, a schoolteacher, a nosy neighbour&hellip;
	        </div>
	      </div>
	      <div class="md:col-span-2">
	        <label for="f-cast-names" class="text-xs font-semibold text-ink-soft">Cast names (comma-separated)</label>
	        <input
	        	id="f-cast-names"
	          v-model="castNamesInput"
	          class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong"
	          placeholder="Avery, Blair, Casey, Dana, Ellis, Finley"
	        />
	        <div class="mt-1 text-[11px] text-ink-faint">
	          Optional. If provided, the cast list will use these names.
	        </div>
	      </div>
	      <div>
	        <label for="f-primary-axis" class="text-xs font-semibold text-ink-soft">Primary axis</label>
	        <select id="f-primary-axis" v-model="spec.primaryAxis" class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong">
	          <option>temporal</option>
	          <option>spatial</option>
	          <option>identity</option>
	          <option>behavioral</option>
	          <option>authority</option>
	        </select>
	      </div>
	      <div>
	        <label for="f-story-length" class="text-xs font-semibold text-ink-soft">Story length</label>
	        <select id="f-story-length" v-model="spec.targetLength" class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong">
	          <option value="short">Short (15-25K words)</option>
	          <option value="medium">Medium (40-60K words)</option>
	          <option value="long">Long (70-100K words)</option>
	        </select>
	        <div class="mt-1 text-[11px] text-ink-faint">
	          Story length affects scene count and narrative pacing.
	        </div>
	      </div>
	      <div>
	        <label for="f-prose-batch-size" class="text-xs font-semibold text-ink-soft">Prose batch size</label>
	        <input
	        	id="f-prose-batch-size"
	          v-model.number="spec.proseBatchSize"
	          type="number"
	          min="1"
	          max="10"
	          class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong"
	        />
	        <div class="mt-1 text-[11px] text-ink-faint">
	          Chapters generated per LLM call (1–10). Higher = fewer API calls but coarser retries. Default: 1.
	        </div>
	      </div>
	    </div>
	    <div class="mt-4 text-xs text-ink-soft">
	      This is a minimal spec draft for Phase 1; additional fields will be added in later phases.
	    </div>
	  </div>
</template>
