<script setup lang="ts">
import { useWorkshop } from "../useWorkshopState";
import ExportPanel from "../../../components/ExportPanel.vue";
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
	handleDownloadGamePackPdf,
	handleDownloadStoryPdf,
	hardLogicDevicesArtifact,
	isAdvanced,
	isDownloadingGamePackPdf,
	isDownloadingStoryPdf,
	outlineArtifact,
	projectId,
	proseArtifact,
	proseReady,
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

	        <div class="rounded-md border border-line bg-ground p-4">
	          <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Story PDF</div>
	          <div class="t-subtitle mt-1">
	            {{ proseReady ? 'Ready to download' : 'Generate prose first to enable export' }}
	          </div>
	          <button
	            class="mt-3 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-60"
	            :disabled="!proseReady || !projectId || isDownloadingStoryPdf"
	            @click="handleDownloadStoryPdf"
	          >
	            <span class="inline-flex items-center gap-2">
	              <font-awesome-icon v-if="isDownloadingStoryPdf" icon="spinner" spin />
	              Download story PDF
	            </span>
	          </button>
	        </div>
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
