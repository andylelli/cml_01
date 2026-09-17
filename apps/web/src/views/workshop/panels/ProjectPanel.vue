<script setup lang="ts">
import { useWorkshop } from "../useWorkshopState";
import TabPanel from "../../../components/TabPanel.vue";

/**
 * Project — Create, load and clear projects.
 *
 * Extracted from WorkshopView (UI-002 item 25). It injects the console state rather than taking
 * props: this panel alone binds 17 values, and a prop signature that wide is not an
 * interface. The block below is the original markup, moved unchanged.
 */
const {
	activeMainTab,
	handleClearStore,
	handleCreateProject,
	handleLoadProject,
	isAdvanced,
	isCreatingProject,
	latestSpecId,
	projectId,
	projectIdInput,
	projectName,
	projectsList,
	scrollToSection,
	selectedProjectId,
	goTo,
	synopsisData,
	synopsisSummary,
} = useWorkshop();
</script>

<template>
	<TabPanel id="project-tab" :active="activeMainTab === 'project'" :lazy="true">
	  <div class="flex flex-col gap-6">

	<div class="rounded-lg border border-line-strong bg-surface-sunken p-4 shadow-sm">
	  <div class="text-sm font-semibold text-frame">Welcome to your Mystery Generator</div>
	  <div class="mt-2 text-sm text-frame">
	    This is your project dashboard. Create a new project, configure your story settings in the Spec tab, then generate your mystery in the Generate tab. All generated content will appear here and in the Review tab.
	  </div>
	</div>

	<div v-if="synopsisData" class="rounded-lg border border-line bg-surface p-6 shadow-sm">
	  <div class="text-sm font-semibold text-ink">Synopsis</div>
	  <div class="mt-2 text-sm text-ink-soft">
	    <strong v-if="synopsisData.title" class="text-ink">{{ synopsisData.title }}</strong>
	    <span :class="synopsisData.title ? 'ml-2' : ''">{{ synopsisSummary }}</span>
	  </div>
	  <div class="mt-3 flex flex-wrap gap-2 text-xs text-ink-soft">
	    <button
	      class="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-soft"
	      @click="scrollToSection('dashboard-details')"
	    >
	      View details below
	    </button>
	    <button
	      class="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-soft"
	      @click="goTo('review', 'clues')"
	    >
	      Open Clue board
	    </button>
	    <button
	      class="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-soft"
	      @click="goTo('review', 'outline')"
	    >
	      Open Outline
	    </button>
	    <button
	      v-if="isAdvanced"
	      class="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-soft"
	      @click="goTo('advanced', 'cml')"
	    >
	      Open CML Viewer
	    </button>
	  </div>
	</div>

	<div class="rounded-lg border border-line bg-surface p-6 shadow-sm">
	  <div class="text-sm font-semibold text-ink">Project setup</div>
	  <div class="mt-4 grid gap-4 md:grid-cols-2">
	    <div>
	      <!-- `for`/`id`: the label was beside the field but not bound to it, so a screen
	           reader announced an unnamed text box. Item 29. -->
	      <label for="ws-project-name" class="text-xs font-semibold text-ink-soft">Project name</label>
	      <input
	        id="ws-project-name"
	        v-model="projectName"
	        class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"
	        placeholder="Golden Age Prototype"
	      />
	    </div>
	    <div class="flex items-end">
	      <button
	        class="rounded-md bg-frame px-4 py-2 text-sm font-semibold text-[--surface] hover:bg-frame disabled:cursor-not-allowed disabled:opacity-60"
	        :disabled="isCreatingProject"
	        @click="handleCreateProject"
	      >
	        <span class="inline-flex items-center gap-2">
	          <font-awesome-icon v-if="isCreatingProject" icon="spinner" spin />
	          {{ isCreatingProject ? "Creating..." : "Create project" }}
	        </span>
	      </button>
	    </div>
	    <div>
	      <label for="ws-project-id" class="text-xs font-semibold text-ink-soft">Load project by ID</label>
	      <input
	        id="ws-project-id"
	        v-model="projectIdInput"
	        class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"
	        placeholder="proj_..."
	      />
	    </div>
	    <div class="flex items-end">
	      <button
	        class="rounded-md border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-ground"
	        @click="handleLoadProject"
	      >
	        Load project
	      </button>
	    </div>
	    <div>
	      <label for="ws-project-select" class="text-xs font-semibold text-ink-soft">Load existing project</label>
	      <select
	        id="ws-project-select"
	        v-model="selectedProjectId"
	        class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"
	      >
	        <option value="">Select a project</option>
	        <option v-for="project in projectsList" :key="project.id" :value="project.id">
	          {{ project.name }} ({{ project.id }})
	        </option>
	      </select>
	    </div>
	    <div class="flex items-end">
	      <button
	        class="rounded-md border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-ground"
	        :disabled="!selectedProjectId"
	        @click="projectIdInput = selectedProjectId; handleLoadProject()"
	      >
	        Load selected
	      </button>
	    </div>
	  </div>
	  <div class="mt-4 flex items-center justify-between rounded-md border border-danger bg-danger-wash px-4 py-3">
	    <div class="text-xs text-danger">
	      Clears saved projects, artifacts, run history, scoring reports, LLM logs, and prompt history.
	    </div>
	    <button
	      class="rounded-md border border-danger bg-surface px-3 py-2 text-xs font-semibold text-danger hover:bg-danger-wash"
	      @click="handleClearStore"
	    >
	      Clear all persistence
	    </button>
	  </div>
	  <div class="mt-3 text-xs text-ink-soft">
	    Project ID: {{ projectId ?? "not created" }} • Spec: {{ latestSpecId ?? "not saved" }}
	  </div>
	</div>

	  </div>
	</TabPanel>
</template>
