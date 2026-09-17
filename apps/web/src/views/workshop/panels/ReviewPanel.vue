<script setup lang="ts">
import { useWorkshop } from "../useWorkshopState";
import ContentSkeleton from "../../../components/ContentSkeleton.vue";
import ProseReader from "../../../components/ProseReader.vue";
import TabPanel from "../../../components/TabPanel.vue";
import VirtualList from "../../../components/VirtualList.vue";

/**
 * Review — Every artifact the pipeline produced.
 *
 * Extracted from WorkshopView (UI-002 item 25). It injects the console state rather than taking
 * props: this panel alone binds 31 values, and a prop signature that wide is not an
 * interface. The block below is the original markup, moved unchanged.
 */
const {
	activeMainTab,
	activeReviewTab,
	artifactsStatus,
	availableProseVersions,
	backgroundContextData,
	castData,
	chapterOptions,
	characterProfilesData,
	cluesData,
	currentChapter,
	filteredClues,
	handleDownloadAllProseVersions,
	handleDownloadStoryPdf,
	hardLogicDevicesData,
	isAdvanced,
	isDownloadingAllVersions,
	isDownloadingStoryPdf,
	isRunning,
	isStartingRun,
	locationProfilesData,
	mode,
	outlineData,
	playModeEnabled,
	progress,
	projectId,
	proseData,
	runProgressLabel,
	selectedProseLength,
	settingData,
	showRedHerrings,
	temporalContextData,
} = useWorkshop();
</script>

<template>
	<TabPanel id="review-tab" :active="activeMainTab === 'review'" :lazy="true">
	  <div class="flex flex-col gap-6">

	<div class="rounded-lg border border-line bg-ground-warm p-5">
	  <div class="text-sm font-semibold text-frame">Review Generated Content</div>
	  <div class="mt-2 text-sm text-frame">
	    <span v-if="activeReviewTab === 'cast'">Review character profiles with public and private details.</span>
	    <span v-else-if="activeReviewTab === 'background'">Review setting, place, and period context for the mystery backdrop.</span>
	    <span v-else-if="activeReviewTab === 'hardLogic'">Inspect generated hard-logic devices that ground the mystery mechanism.</span>
	    <span v-else-if="activeReviewTab === 'locations'">Explore detailed location profiles with sensory details and atmosphere.</span>
	    <span v-else-if="activeReviewTab === 'temporal'">View the specific date, era, fashion, culture, and historical context.</span>
	    <span v-else-if="activeReviewTab === 'clues'">Browse all clues with red herring filtering and play mode to reveal by chapter.</span>
	    <span v-else-if="activeReviewTab === 'outline'">View the story structure broken down by chapters and events.</span>
	    <span v-else-if="activeReviewTab === 'prose'">Read the full narrative story text.</span>
	  </div>
	</div>

	<!-- Run in progress banner -->
	<div v-if="isRunning || isStartingRun" class="flex items-center gap-3 rounded-lg border border-line-strong bg-surface-sunken px-4 py-3 text-sm text-frame">
	  <font-awesome-icon icon="spinner" spin class="flex-shrink-0" />
	  <div>
	    <span class="font-semibold">Run in progress</span>
	    <span class="ml-1 text-frame">— {{ runProgressLabel }}</span>
	  </div>
	</div>

	<div v-if="activeReviewTab === 'cast'" class="rounded-lg border border-line bg-surface p-6 shadow-card">
	  <div>
	    <div class="flex items-center justify-between">
	      <div class="t-section">Character Profiles</div>
	      <div class="text-xs text-ink-soft">{{ castData?.suspects?.length || characterProfilesData?.profiles?.length || 0 }} total cast</div>
	    </div>
	    <div class="t-subtitle mt-1">
	      {{ characterProfilesData?.note ?? "Character profiles are derived from the cast." }}
	    </div>
	    <!-- Loading skeleton while cast data is being generated -->
	    <ContentSkeleton
	      v-if="!characterProfilesData && (isRunning || isStartingRun || artifactsStatus === 'loading')"
	      class="mt-4"
	      :rows="5"
	    />
	    <div v-if="characterProfilesData?.profiles?.length" class="mt-4 space-y-3">
	      <details
	        v-for="profile in characterProfilesData.profiles"
	        :key="profile.name"
	        class="rounded-md border border-line bg-ground px-3 py-2"
	      >
	        <summary class="cursor-pointer text-sm font-semibold text-ink">
	          {{ profile.name }}
	        </summary>
	        <div class="mt-2 space-y-3 text-sm text-ink-soft">
	          <p v-if="profile.summary" class="italic">{{ profile.summary }}</p>
	          <div v-if="profile.publicPersona" class="text-xs text-ink-soft">
	            <span class="font-semibold">Public:</span> {{ profile.publicPersona }}
	          </div>
	          <div v-if="profile.humourStyle && profile.humourStyle !== 'none'" class="mt-1 flex flex-wrap items-center gap-2 text-xs">
	            <span class="rounded-full bg-warn-wash px-2 py-0.5 text-warn">
	              {{ profile.humourStyle.replace(/_/g, ' ') }}
	            </span>
	            <span v-if="typeof profile.humourLevel === 'number'" class="text-ink-faint">
	              {{ profile.humourLevel >= 0.7 ? 'Frequently witty' : profile.humourLevel >= 0.4 ? 'Occasionally witty' : 'Rarely witty' }}
	            </span>
	            <span class="inline-flex items-center gap-0.5" :title="`Humour level: ${profile.humourLevel}`">
	              <span v-for="n in 5" :key="n" class="inline-block h-1.5 w-3 rounded-sm" :class="n <= Math.round((profile.humourLevel || 0) * 5) ? 'bg-warn' : 'bg-surface-sunken'"></span>
	            </span>
	          </div>
	          <div v-else-if="profile.humourStyle === 'none'" class="mt-1 text-xs text-ink-faint italic">
	            Plays it straight — no humour
	          </div>
	          <div v-if="profile.speechMannerisms" class="t-subtitle mt-1">
	            <span class="font-semibold">Voice:</span> {{ profile.speechMannerisms }}
	          </div>
	          <div v-if="isAdvanced" class="space-y-1 text-xs text-ink-soft">
	            <div v-if="profile.privateSecret"><span class="font-semibold">Private:</span> {{ profile.privateSecret }}</div>
	            <div v-if="profile.motiveSeed"><span class="font-semibold">Motive:</span> {{ profile.motiveSeed }}</div>
	            <div v-if="profile.alibiWindow"><span class="font-semibold">Alibi:</span> {{ profile.alibiWindow }}</div>
	            <div v-if="profile.accessPlausibility"><span class="font-semibold">Access:</span> {{ profile.accessPlausibility }}</div>
	            <div v-if="profile.stakes"><span class="font-semibold">Stakes:</span> {{ profile.stakes }}</div>
	          </div>
	          <div
	            v-else-if="profile.privateSecret || profile.motiveSeed || profile.alibiWindow || profile.accessPlausibility || profile.stakes"
	            class="text-xs text-ink-faint"
	          >
	            Private details hidden. Enable Advanced mode to view.
	          </div>
	          <p v-for="(para, idx) in profile.paragraphs" :key="`${profile.name}-para-${idx}`">{{ para }}</p>
	        </div>
	      </details>
	    </div>
	    <div v-else class="mt-4 text-sm text-ink-soft">Profiles will appear after generation.</div>
	  </div>
	</div>

	<div v-if="activeReviewTab === 'locations'" class="rounded-lg border border-line bg-surface p-6 shadow-card">
	  <div class="flex items-center justify-between">
	    <div class="t-section">Location Profiles</div>
	    <div class="text-xs text-ink-soft">
	      {{ locationProfilesData ? `${locationProfilesData.keyLocations?.length || 0} key locations` : 'Not generated' }}
	    </div>
	  </div>

	  <ContentSkeleton v-if="!locationProfilesData && (isRunning || isStartingRun || artifactsStatus === 'loading')" class="mt-4" :rows="5" />
	  <div v-else-if="locationProfilesData" class="mt-4 space-y-6">
	    <!-- Primary Location -->
	    <div v-if="locationProfilesData.primary" class="rounded-md border border-line bg-ground p-4">
	      <div class="flex items-center justify-between">
	        <div class="text-sm font-semibold text-ink">{{ locationProfilesData.primary.name }}</div>
	        <span class="rounded bg-surface-sunken px-2 py-0.5 text-xs text-frame">Primary</span>
	      </div>
	      <div class="t-subtitle mt-1">
	        {{ locationProfilesData.primary.type }}
	        <span v-if="locationProfilesData.primary.place || locationProfilesData.primary.country" class="text-ink-faint"> • </span>
	        <span v-if="locationProfilesData.primary.place">{{ locationProfilesData.primary.place }}</span>
	        <span v-if="locationProfilesData.primary.place && locationProfilesData.primary.country">, </span>
	        <span v-if="locationProfilesData.primary.country">{{ locationProfilesData.primary.country }}</span>
	      </div>
	      <p class="mt-2 text-sm italic text-ink-soft">{{ locationProfilesData.primary.summary }}</p>
	      <div class="mt-3 space-y-2 text-sm text-ink-soft">
	        <p v-for="(para, idx) in locationProfilesData.primary.paragraphs" :key="`primary-${idx}`">{{ para }}</p>
	      </div>
	    </div>

	    <!-- Atmosphere -->
	    <div v-if="locationProfilesData.atmosphere" class="rounded-md border border-line bg-warn-wash p-4">
	      <div class="t-section">Atmosphere</div>
	      <div class="mt-2 grid gap-2 text-xs">
	        <div><span class="font-semibold text-ink-soft">Mood:</span> {{ locationProfilesData.atmosphere.mood }}</div>
	        <div><span class="font-semibold text-ink-soft">Weather:</span> {{ locationProfilesData.atmosphere.weather }}</div>
	        <div v-if="locationProfilesData.atmosphere.eraMarkers?.length">
	          <span class="font-semibold text-ink-soft">Era Markers:</span>
	          <span class="ml-1">{{ locationProfilesData.atmosphere.eraMarkers.join(', ') }}</span>
	        </div>
	        <div v-if="locationProfilesData.atmosphere.sensoryPalette?.length">
	          <span class="font-semibold text-ink-soft">Sensory Palette:</span>
	          <span class="ml-1">{{ locationProfilesData.atmosphere.sensoryPalette.join(', ') }}</span>
	        </div>
	      </div>
	    </div>

	    <!-- Key Locations -->
	    <div v-if="locationProfilesData.keyLocations?.length" class="space-y-3">
	      <div class="t-section">Key Locations</div>
	      <details
	        v-for="(location, idx) in locationProfilesData.keyLocations"
	        :key="`location-${idx}`"
	        class="rounded-md border border-line bg-surface p-3"
	      >
	        <summary class="cursor-pointer text-sm font-semibold text-ink">
	          {{ location.name }} <span class="text-xs font-normal text-ink-soft">({{ location.type }})</span>
	        </summary>
	        <div class="mt-2 space-y-3">
	          <p class="text-sm italic text-ink-soft">{{ location.description }}</p>
	          <div class="space-y-2 text-sm text-ink-soft">
	            <p v-for="(para, paraIdx) in location.paragraphs" :key="`loc-${idx}-para-${paraIdx}`">{{ para }}</p>
	          </div>
	          <div v-if="location.sensoryDetails" class="rounded bg-ground p-2 text-xs">
	            <div class="font-semibold text-ink">Sensory Details:</div>
	            <div v-if="location.sensoryDetails.sights?.length" class="mt-1">
	              <span class="font-semibold text-ink-soft">Sights:</span> {{ location.sensoryDetails.sights.join(', ') }}
	            </div>
	            <div v-if="location.sensoryDetails.sounds?.length" class="mt-1">
	              <span class="font-semibold text-ink-soft">Sounds:</span> {{ location.sensoryDetails.sounds.join(', ') }}
	            </div>
	            <div v-if="location.sensoryDetails.smells?.length" class="mt-1">
	              <span class="font-semibold text-ink-soft">Smells:</span> {{ location.sensoryDetails.smells.join(', ') }}
	            </div>
	            <div v-if="location.sensoryDetails.tactile?.length" class="mt-1">
	              <span class="font-semibold text-ink-soft">Tactile:</span> {{ location.sensoryDetails.tactile.join(', ') }}
	            </div>
	          </div>
	          <div v-if="location.accessibility" class="rounded bg-ground p-2 text-xs">
	            <div class="font-semibold text-ink">Access:</div>
	            <div class="mt-1">
	              <span class="font-semibold text-ink-soft">Public:</span> {{ location.accessibility.publicAccess ? 'Yes' : 'No' }}
	            </div>
	            <div v-if="location.accessibility.whoCanEnter?.length" class="mt-1">
	              <span class="font-semibold text-ink-soft">Who can enter:</span> {{ location.accessibility.whoCanEnter.join(', ') }}
	            </div>
	            <div v-if="location.accessibility.restrictions?.length" class="mt-1">
	              <span class="font-semibold text-ink-soft">Restrictions:</span> {{ location.accessibility.restrictions.join(', ') }}
	            </div>
	          </div>
	        </div>
	      </details>
	    </div>
	  </div>
	  <div v-else class="mt-4 text-sm text-ink-soft">Location profiles will appear after generation.</div>

	</div>

	<div v-if="activeReviewTab === 'background'" class="rounded-lg border border-line bg-surface p-6 shadow-card">
	  <div class="flex items-center justify-between">
	    <div class="t-section">Story Background</div>
	    <div class="text-xs text-ink-soft">Background context</div>
	  </div>

	  <ContentSkeleton v-if="!(backgroundContextData || settingData || locationProfilesData || temporalContextData) && (isRunning || isStartingRun || artifactsStatus === 'loading')" class="mt-4" :rows="4" />
	  <div v-else-if="backgroundContextData || settingData || locationProfilesData || temporalContextData" class="mt-4 space-y-4">
	    <div v-if="backgroundContextData?.backdropSummary" class="rounded-md border border-line bg-ground p-3 text-sm text-ink">
	      {{ backgroundContextData.backdropSummary }}
	    </div>
	    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
	      <div class="rounded-md border border-line bg-ground p-3">
	        <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Setting</div>
	        <div class="mt-1 text-sm text-ink">{{ backgroundContextData?.setting?.location ?? settingData?.locationPreset ?? "Not generated" }}</div>
	        <div class="t-subtitle mt-1">{{ backgroundContextData?.setting?.institution ?? "Institution pending" }}</div>
	      </div>
	      <div class="rounded-md border border-line bg-ground p-3">
	        <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Atmosphere</div>
	        <div class="mt-1 text-sm text-ink">{{ backgroundContextData?.setting?.weather ?? settingData?.weather ?? locationProfilesData?.atmosphere?.weather ?? "Not generated" }}</div>
	        <div class="t-subtitle mt-1">{{ locationProfilesData?.atmosphere?.mood ?? "Mood pending" }}</div>
	      </div>
	      <div class="rounded-md border border-line bg-ground p-3">
	        <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Period</div>
	        <div class="mt-1 text-sm text-ink">
	          {{ backgroundContextData?.era?.decade ?? (temporalContextData ? `${temporalContextData.specificDate.month} ${temporalContextData.specificDate.year}` : "Not generated") }}
	        </div>
	        <div class="t-subtitle mt-1">{{ backgroundContextData?.era?.socialStructure ?? temporalContextData?.specificDate?.era ?? "Era pending" }}</div>
	      </div>
	    </div>

	    <div v-if="backgroundContextData?.castAnchors?.length" class="rounded-md border border-line bg-surface p-4">
	      <div class="t-section">Cast anchors</div>
	      <div class="mt-2 flex flex-wrap gap-2 text-xs">
	        <span
	          v-for="name in backgroundContextData.castAnchors"
	          :key="name"
	          class="rounded-full border border-line bg-ground px-2 py-1 text-ink-soft"
	        >
	          {{ name }}
	        </span>
	      </div>
	    </div>

	    <div v-if="locationProfilesData?.primary" class="rounded-md border border-line bg-surface p-4">
	      <div class="t-section">Primary location</div>
	      <div class="t-subtitle mt-1">
	        {{ locationProfilesData.primary.name }}
	        <span v-if="locationProfilesData.primary.place"> • {{ locationProfilesData.primary.place }}</span>
	        <span v-if="locationProfilesData.primary.country">, {{ locationProfilesData.primary.country }}</span>
	      </div>
	      <p class="mt-2 text-sm text-ink-soft">{{ locationProfilesData.primary.summary }}</p>
	    </div>

	    <div v-if="temporalContextData?.paragraphs?.length" class="rounded-md border border-line bg-surface p-4">
	      <div class="t-section">Backdrop notes</div>
	      <p class="mt-2 text-sm text-ink-soft">{{ temporalContextData.paragraphs[0] }}</p>
	    </div>
	  </div>
	  <div v-else class="mt-4 text-sm text-ink-soft">Background context will appear after generation.</div>

	</div>

	<div v-if="activeReviewTab === 'hardLogic'" class="rounded-lg border border-line bg-surface p-6 shadow-card">
	  <div class="flex items-center justify-between">
	    <div class="t-section">Hard-Logic Devices</div>
	    <div class="text-xs text-ink-soft">{{ hardLogicDevicesData?.devices?.length || 0 }} devices</div>
	  </div>

	  <ContentSkeleton v-if="!hardLogicDevicesData && (isRunning || isStartingRun || artifactsStatus === 'loading')" class="mt-4" :rows="5" />
	  <div v-else-if="hardLogicDevicesData" class="mt-4 space-y-4">
	    <div v-if="hardLogicDevicesData.overview" class="rounded-md border border-line bg-ground p-3 text-sm text-ink-soft">
	      {{ hardLogicDevicesData.overview }}
	    </div>
	    <details
	      v-for="(device, idx) in hardLogicDevicesData.devices"
	      :key="`${device.title}-${idx}`"
	      class="rounded-md border border-line bg-surface p-3"
	    >
	      <summary class="cursor-pointer text-sm font-semibold text-ink">
	        {{ device.title }}
	        <span class="ml-2 text-xs font-normal text-ink-soft">({{ device.principleType.replace('_', ' ') }})</span>
	      </summary>
	      <div class="mt-3 space-y-2 text-sm text-ink-soft">
	        <div><span class="font-semibold text-ink">Core principle:</span> {{ device.corePrinciple }}</div>
	        <div><span class="font-semibold text-ink">Surface illusion:</span> {{ device.surfaceIllusion }}</div>
	        <div><span class="font-semibold text-ink">Underlying reality:</span> {{ device.underlyingReality }}</div>
	        <div><span class="font-semibold text-ink">Why it is not a trope:</span> {{ device.whyNotTrope }}</div>
	        <div><span class="font-semibold text-ink">Variation:</span> {{ device.variationEscalation }}</div>
	        <div v-if="device.mechanismFamilyHints?.length">
	          <span class="font-semibold text-ink">Mechanism hints:</span>
	          {{ device.mechanismFamilyHints.join(', ') }}
	        </div>
	        <div v-if="device.modeTags?.length">
	          <span class="font-semibold text-ink">Mode tags:</span>
	          {{ device.modeTags.join(', ') }}
	        </div>
	        <div v-if="device.fairPlayClues?.length">
	          <div class="font-semibold text-ink">Fair-play clues</div>
	          <ul class="ml-4 mt-1 list-disc text-xs text-ink-soft">
	            <li v-for="(clue, clueIdx) in device.fairPlayClues" :key="`${device.title}-clue-${clueIdx}`">{{ clue }}</li>
	          </ul>
	        </div>
	      </div>
	    </details>
	  </div>
	  <div v-else class="mt-4 text-sm text-ink-soft">Hard-logic devices will appear after generation.</div>

	</div>

	<div v-if="activeReviewTab === 'temporal'" class="rounded-lg border border-line bg-surface p-6 shadow-card">
	  <div class="flex items-center justify-between">
	    <div class="t-section">Era & Cultural Context</div>
	    <div v-if="temporalContextData" class="text-xs text-ink-soft">
	      {{ temporalContextData.specificDate.month }} {{ temporalContextData.specificDate.year }}
	    </div>
	  </div>

	  <ContentSkeleton v-if="!temporalContextData && (isRunning || isStartingRun || artifactsStatus === 'loading')" class="mt-4" :rows="5" />
	  <div v-else-if="temporalContextData" class="mt-4 space-y-6">
	    <!-- Specific Date -->
	    <div class="rounded-md border border-line bg-surface-sunken p-4">
	      <div class="t-section">Specific Date</div>
	      <div class="mt-2 text-sm text-ink-soft">
	        <span class="font-semibold">{{ temporalContextData.specificDate.month }}</span>
	        <span v-if="temporalContextData.specificDate.day"> {{ temporalContextData.specificDate.day }},</span>
	        {{ temporalContextData.specificDate.year }}
	        <span class="text-xs text-ink-soft">({{ temporalContextData.specificDate.era }})</span>
	      </div>
	    </div>

	    <!-- Narrative Paragraphs -->
	    <div v-if="temporalContextData.paragraphs?.length" class="space-y-2 text-sm text-ink-soft">
	      <p v-for="(para, idx) in temporalContextData.paragraphs" :key="`temp-para-${idx}`">{{ para }}</p>
	    </div>

	    <!-- Seasonal Context -->
	    <div v-if="temporalContextData.seasonal" class="rounded-md border border-line bg-ok-wash p-4">
	      <div class="t-section">Seasonal Context</div>
	      <div class="mt-2 space-y-2 text-xs">
	        <div><span class="font-semibold text-ink-soft">Season:</span> {{ temporalContextData.seasonal.season }}</div>
	        <div><span class="font-semibold text-ink-soft">Daylight:</span> {{ temporalContextData.seasonal.daylight }}</div>
	        <div v-if="temporalContextData.seasonal.weather?.length">
	          <span class="font-semibold text-ink-soft">Weather:</span> {{ temporalContextData.seasonal.weather.join(', ') }}
	        </div>
	        <div v-if="temporalContextData.seasonal.holidays?.length">
	          <span class="font-semibold text-ink-soft">Holidays:</span> {{ temporalContextData.seasonal.holidays.join(', ') }}
	        </div>
	        <div v-if="temporalContextData.seasonal.seasonalActivities?.length">
	          <span class="font-semibold text-ink-soft">Activities:</span> {{ temporalContextData.seasonal.seasonalActivities.join(', ') }}
	        </div>
	      </div>
	    </div>

	    <!-- Fashion -->
	    <details v-if="temporalContextData.fashion" class="rounded-md border border-line bg-surface-sunken p-3">
	      <summary class="cursor-pointer text-sm font-semibold text-ink">Fashion & Attire</summary>
	      <div class="mt-3 space-y-3 text-xs">
	        <div>
	          <div class="font-semibold text-ink-soft">Men's Formal:</div>
	          <div class="ml-2 mt-1">{{ temporalContextData.fashion.mensWear.formal?.join(', ') }}</div>
	        </div>
	        <div>
	          <div class="font-semibold text-ink-soft">Men's Casual:</div>
	          <div class="ml-2 mt-1">{{ temporalContextData.fashion.mensWear.casual?.join(', ') }}</div>
	        </div>
	        <div>
	          <div class="font-semibold text-ink-soft">Women's Formal:</div>
	          <div class="ml-2 mt-1">{{ temporalContextData.fashion.womensWear.formal?.join(', ') }}</div>
	        </div>
	        <div>
	          <div class="font-semibold text-ink-soft">Women's Casual:</div>
	          <div class="ml-2 mt-1">{{ temporalContextData.fashion.womensWear.casual?.join(', ') }}</div>
	        </div>
	        <div v-if="temporalContextData.fashion.trendsOfTheMoment?.length">
	          <div class="font-semibold text-ink-soft">Trends:</div>
	          <div class="ml-2 mt-1">{{ temporalContextData.fashion.trendsOfTheMoment.join(', ') }}</div>
	        </div>
	      </div>
	    </details>

	    <!-- Current Affairs -->
	    <details v-if="temporalContextData.currentAffairs" class="rounded-md border border-line bg-danger-wash p-3">
	      <summary class="cursor-pointer text-sm font-semibold text-ink">Current Affairs</summary>
	      <div class="mt-3 space-y-2 text-xs">
	        <div v-if="temporalContextData.currentAffairs.politicalClimate">
	          <div class="font-semibold text-ink-soft">Political Climate:</div>
	          <div class="ml-2 mt-1">{{ temporalContextData.currentAffairs.politicalClimate }}</div>
	        </div>
	        <div v-if="temporalContextData.currentAffairs.economicConditions">
	          <div class="font-semibold text-ink-soft">Economic Conditions:</div>
	          <div class="ml-2 mt-1">{{ temporalContextData.currentAffairs.economicConditions }}</div>
	        </div>
	        <div v-if="temporalContextData.currentAffairs.majorEvents?.length">
	          <div class="font-semibold text-ink-soft">Major Events:</div>
	          <ul class="ml-4 mt-1 list-disc">
	            <li v-for="(event, idx) in temporalContextData.currentAffairs.majorEvents" :key="`event-${idx}`">{{ event }}</li>
	          </ul>
	        </div>
	      </div>
	    </details>

	    <!-- Cultural Context -->
	    <details v-if="temporalContextData.cultural" class="rounded-md border border-line bg-warn-wash p-3">
	      <summary class="cursor-pointer text-sm font-semibold text-ink">Cultural Context</summary>
	      <div class="mt-3 space-y-3 text-xs">
	        <div v-if="temporalContextData.cultural.entertainment">
	          <div class="font-semibold text-ink-soft">Entertainment:</div>
	          <div class="ml-2 mt-1 space-y-1">
	            <div v-if="temporalContextData.cultural.entertainment.popularMusic?.length">
	              <span class="font-semibold">Music:</span> {{ temporalContextData.cultural.entertainment.popularMusic.join(', ') }}
	            </div>
	            <div v-if="temporalContextData.cultural.entertainment.films?.length">
	              <span class="font-semibold">Films:</span> {{ temporalContextData.cultural.entertainment.films.join(', ') }}
	            </div>
	            <div v-if="temporalContextData.cultural.entertainment.theater?.length">
	              <span class="font-semibold">Theater:</span> {{ temporalContextData.cultural.entertainment.theater.join(', ') }}
	            </div>
	          </div>
	        </div>
	        <div v-if="temporalContextData.cultural.technology">
	          <div class="font-semibold text-ink-soft">Technology:</div>
	          <div class="ml-2 mt-1 space-y-1">
	            <div v-if="temporalContextData.cultural.technology.commonDevices?.length">
	              <span class="font-semibold">Common Devices:</span> {{ temporalContextData.cultural.technology.commonDevices.join(', ') }}
	            </div>
	            <div v-if="temporalContextData.cultural.technology.recentInventions?.length">
	              <span class="font-semibold">Recent Inventions:</span> {{ temporalContextData.cultural.technology.recentInventions.join(', ') }}
	            </div>
	          </div>
	        </div>
	        <div v-if="temporalContextData.cultural.dailyLife">
	          <div class="font-semibold text-ink-soft">Daily Life:</div>
	          <div class="ml-2 mt-1 space-y-1">
	            <div v-if="temporalContextData.cultural.dailyLife.typicalPrices?.length">
	              <span class="font-semibold">Typical Prices:</span> {{ temporalContextData.cultural.dailyLife.typicalPrices.join(', ') }}
	            </div>
	            <div v-if="temporalContextData.cultural.dailyLife.socialRituals?.length">
	              <span class="font-semibold">Social Rituals:</span> {{ temporalContextData.cultural.dailyLife.socialRituals.join(', ') }}
	            </div>
	          </div>
	        </div>
	      </div>
	    </details>

	    <!-- Atmospheric Details -->
	    <div v-if="temporalContextData.atmosphericDetails?.length" class="rounded-md border border-line bg-ground p-4">
	      <div class="t-section">Atmospheric Details</div>
	      <ul class="ml-4 mt-2 list-disc space-y-1 text-xs text-ink-soft">
	        <li v-for="(detail, idx) in temporalContextData.atmosphericDetails" :key="`atm-${idx}`">{{ detail }}</li>
	      </ul>
	    </div>
	  </div>
	  <div v-else class="mt-4 text-sm text-ink-soft">Temporal context will appear after generation.</div>

	</div>

	<div v-if="activeReviewTab === 'clues'" class="rounded-lg border border-line bg-surface p-6 shadow-card">
	  <div class="flex items-center justify-between">
	    <div>
	      <div class="t-section">Clue Board</div>
	      <div class="t-subtitle mt-1">{{ cluesData?.items?.length || 0 }} total clues</div>
	    </div>
	    <div class="flex items-center gap-3 text-xs">
	      <label class="flex items-center gap-1">
	        <input v-model="showRedHerrings" type="checkbox" class="h-3 w-3" />
	        Show red herrings
	      </label>
	      <label class="flex items-center gap-1">
	        <input v-model="playModeEnabled" type="checkbox" class="h-3 w-3" />
	        Play mode
	      </label>
	      <select v-if="playModeEnabled" v-model="currentChapter" class="rounded border border-line px-2 py-1">
	        <option v-for="ch in chapterOptions" :key="ch" :value="ch">Chapter {{ ch }}</option>
	      </select>
	    </div>
	  </div>
	  <ContentSkeleton
	    v-if="!cluesData && (isRunning || isStartingRun || artifactsStatus === 'loading')"
	    class="mt-4"
	    :rows="6"
	  />
	  <div v-else-if="filteredClues.length" class="mt-4">
	    <VirtualList :items="filteredClues" :estimated-item-height="80" :overscan="4">
	      <template #default="{ item: clue }">
	        <div
	          class="mb-2 rounded-md border px-3 py-2 text-sm"
	          :class="clue.redHerring ? 'border-warn bg-warn-wash' : 'border-line bg-surface'"
	        >
	          <div class="font-semibold text-ink">{{ clue.category }}</div>
	          <div class="mt-1 text-ink-soft">{{ clue.text }}</div>
	          <div class="t-subtitle mt-1">
	            Points to: {{ clue.pointsTo }}
	            <span v-if="clue.revealChapter"> • Reveal: Ch.{{ clue.revealChapter }}</span>
	          </div>
	        </div>
	      </template>
	    </VirtualList>
	  </div>
	  <div v-else class="mt-4 text-sm text-ink-soft">No clues yet. Generate to create them.</div>
	</div>

	<div v-if="activeReviewTab === 'outline'" class="rounded-lg border border-line bg-surface p-6 shadow-card">
	  <div class="flex items-center justify-between">
	    <div class="t-section">Story Outline</div>
	    <div class="text-xs text-ink-soft">{{ outlineData?.chapters?.length || 0 }} chapters</div>
	  </div>
	  <ContentSkeleton v-if="!(outlineData?.chapters?.length) && (isRunning || isStartingRun || artifactsStatus === 'loading')" class="mt-4" :rows="5" />
	  <div v-else-if="outlineData && outlineData.chapters && outlineData.chapters.length" class="mt-4 space-y-4">
	    <div v-for="(chapter, idx) in outlineData.chapters" :key="idx" class="border-l-2 border-line-strong pl-4">
	      <div class="text-sm font-semibold text-ink">Chapter {{ idx + 1 }}: {{ chapter.title || 'Untitled' }}</div>
	      <div class="mt-1 text-sm text-ink-soft">{{ chapter.summary || chapter.description || 'No summary available' }}</div>
	      <div v-if="chapter.events && chapter.events.length" class="t-subtitle mt-1">
	        {{ chapter.events.length }} event(s)
	      </div>
	    </div>
	  </div>
	  <div v-else class="mt-4 text-sm text-ink-soft">No outline yet. Generate to create it.</div>

	</div>

	<div v-if="activeReviewTab === 'prose'">
	  <div class="mb-4 flex items-center justify-between gap-3">
	    <div v-if="availableProseVersions.length > 1" class="flex items-center gap-2">
	      <label for="f-pdf-version" class="text-xs font-semibold text-ink-soft">PDF version:</label>
	      <select id="f-pdf-version" v-model="selectedProseLength" class="rounded-md border border-line px-3 py-1 text-xs">
	        <option v-for="length in availableProseVersions" :key="length" :value="length">
	          {{ length === 'short' ? 'Short (15-25K)' : length === 'medium' ? 'Medium (40-60K)' : 'Long (70-100K)' }}
	        </option>
	      </select>
	    </div>
	    <div class="flex items-center gap-2">
	      <button
	        v-if="availableProseVersions.length > 1"
	        class="transition-control rounded border border-line bg-surface px-3 py-1.5 text-[0.8rem] font-medium text-ink hover:border-line-strong hover:bg-surface-sunken disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-surface"
	        :disabled="!proseData || !projectId || isDownloadingAllVersions"
	        @click="handleDownloadAllProseVersions"
	      >
	        Export all versions
	      </button>
	      <button
	        class="transition-control rounded border border-line bg-surface px-3 py-1.5 text-[0.8rem] font-medium text-ink hover:border-line-strong hover:bg-surface-sunken disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-surface"
	        :disabled="!proseData || !projectId || isDownloadingStoryPdf"
	        @click="handleDownloadStoryPdf"
	      >
	        <span class="inline-flex items-center gap-2">
	          <font-awesome-icon v-if="isDownloadingStoryPdf" icon="spinner" spin />
	          Export story PDF
	        </span>
	      </button>
	    </div>
	  </div>
	  <ProseReader v-if="proseData" :prose="proseData" />
	  <div v-else class="rounded-lg border border-line bg-surface p-6 text-center text-sm text-ink-soft">
	    No story text yet. Generate to create it.
	  </div>
	</div>
	  </div>
	</TabPanel>
</template>
