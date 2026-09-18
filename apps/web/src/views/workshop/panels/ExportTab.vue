<script setup lang="ts">
import { useWorkshop } from "../useWorkshopState";
import AppButton from "../../../components/ui/AppButton.vue";
import ExportPanel from "../../../components/ExportPanel.vue";
import NarrationPanel from "../../../components/NarrationPanel.vue";
import TabPanel from "../../../components/TabPanel.vue";

/**
 * Export — Download the story and the game pack.
 *
 * Extracted from WorkshopView (UI-002 item 25). It injects the console state rather than taking
 * props: this panel alone binds 20 values, and a prop signature that wide is not an
 * interface. The block below is the original markup, moved unchanged.
 */
const {
	activeMainTab,
	castArtifact,
	characterProfilesArtifact,
	cluesArtifact,
	cmlArtifact,
	fairPlayReport,
	gamePackArtifact,
	gamePackData,
	gamePackReady,
	availableProseVersions,
	handleDownloadAllProseVersions,
	handleDownloadGamePackPdf,
	handleDownloadStoryPdf,
	hardLogicDevicesArtifact,
	isAdvanced,
	isDownloadingAllVersions,
	isDownloadingGamePackPdf,
	isDownloadingStoryPdf,
	outlineArtifact,
	projectId,
	proseArtifact,
	proseReady,
	selectedProseLength,
	settingArtifact,
} = useWorkshop();
</script>

<template>
	<TabPanel id="export-tab" :active="activeMainTab === 'export'" :lazy="true">
	  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
	    <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
	      <div class="t-section">Export your mystery</div>
	      <div class="mt-2 text-sm text-ink-soft">
	        Download artifacts as JSON, or export reader-ready PDFs when available.
	      </div>

	      <div class="mt-5 grid gap-4 sm:grid-cols-2">
	        <div class="rounded-md border border-line bg-ground p-4">
	          <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Game pack PDF</div>
	          <div class="t-subtitle mt-1">
	            {{ gamePackReady ? 'Ready to download' : 'Generate content first to enable export' }}
	          </div>
	          <button
	            class="mt-3 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-60"
	            :disabled="!gamePackData || !projectId || isDownloadingGamePackPdf"
	            @click="handleDownloadGamePackPdf"
	          >
	            <span class="inline-flex items-center gap-2">
	              <font-awesome-icon v-if="isDownloadingGamePackPdf" icon="spinner" spin />
	              Download game pack PDF
	            </span>
	          </button>
	        </div>

	        <!-- The version picker and "all versions" were duplicated on Review ▸ Prose, which is
	             gone (UI-009). Downloads belong together, so they landed here. -->
	        <div class="rounded-md border border-line bg-ground p-4">
	          <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Story PDF</div>
	          <div class="t-subtitle mt-1">
	            {{ proseReady ? 'Ready to download' : 'Generate prose first to enable export' }}
	          </div>

	          <div v-if="availableProseVersions.length > 1" class="mt-3 flex items-center gap-2">
	            <label for="f-pdf-version" class="text-xs font-semibold text-ink-soft">Version</label>
	            <select
	              id="f-pdf-version"
	              v-model="selectedProseLength"
	              class="rounded-md border border-line bg-surface px-3 py-1 text-xs"
	            >
	              <option v-for="length in availableProseVersions" :key="length" :value="length">
	                {{ length === 'short' ? 'Short (15-25K)' : length === 'medium' ? 'Medium (40-60K)' : 'Long (70-100K)' }}
	              </option>
	            </select>
	          </div>

	          <div class="mt-3 flex flex-wrap gap-2">
	            <AppButton
	              size="sm"
	              icon="download"
	              :busy="isDownloadingStoryPdf"
	              busy-label="Preparing…"
	              :disabled="!proseReady || !projectId"
	              @click="handleDownloadStoryPdf"
	            >
	              Story PDF
	            </AppButton>
	            <AppButton
	              v-if="availableProseVersions.length > 1"
	              size="sm"
	              variant="ghost"
	              icon="download"
	              :busy="isDownloadingAllVersions"
	              busy-label="Preparing…"
	              :disabled="!proseReady || !projectId"
	              @click="handleDownloadAllProseVersions"
	            >
	              All versions
	            </AppButton>
	          </div>
	        </div>
	      </div>

	      <!-- Audio sits with the other exports rather than in a tab of its own:
	           it is the same manuscript in a third format, next to PDF and JSON. -->
	      <div class="mt-6 border-t border-line pt-5">
	        <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Audiobook</div>
	        <div class="t-subtitle mt-1 mb-3">
	          {{ proseReady
	            ? 'Narrate the manuscript, play it here, or download the file.'
	            : 'Generate prose first to enable narration' }}
	        </div>
	        <NarrationPanel
	          v-if="projectId"
	          :project-id="projectId"
	          :has-story="Boolean(proseReady)"
	        />
	        <p v-else class="t-subtitle">Open or create a project first.</p>
	      </div>
	    </div>

	    <ExportPanel
	      :project-id="projectId"
	      :available="{
	        setting: Boolean(settingArtifact),
	        cast: Boolean(castArtifact),
	        characterProfiles: Boolean(characterProfilesArtifact),
	        hardLogicDevices: Boolean(hardLogicDevicesArtifact),
	        cml: isAdvanced && Boolean(cmlArtifact),
	        clues: Boolean(cluesArtifact),
	        outline: Boolean(outlineArtifact),
	        prose: Boolean(proseArtifact),
	        gamePack: Boolean(gamePackArtifact),
	        fairPlay: Boolean(fairPlayReport),
	      }"
	    />
	  </div>
	</TabPanel>
</template>
