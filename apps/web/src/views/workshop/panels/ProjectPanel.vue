<script setup lang="ts">
import { useWorkshop } from "../useWorkshopState";

/**
 * Project — open one, and see what is in it.
 *
 * NO LONGER CREATES PROJECTS. A project is created in Create, as part of setting a story up;
 * having a second Create-project button here meant two ways to start the same thing, one of
 * which skipped every story field and produced an empty project the reader then had to
 * configure in a form that also lived in two places (UI-006).
 *
 * What is left is the half the console actually needs: pick an existing project, and the
 * synopsis of the one that is open. `Clear all persistence` moved to Advanced ▸ Operator — it
 * is a destructive diagnostic, not setup, and it was sitting under a heading that invited
 * clicking.
 */
const {
	handleLoadProject,
	isAdvanced,
	latestSpecId,
	projectId,
	projectIdInput,
	projectsList,
	scrollToSection,
	selectedProjectId,
	goTo,
	synopsisData,
	synopsisSummary,
} = useWorkshop();
</script>

<template>
	  <div class="flex flex-col gap-6">

	<div class="rounded-lg border border-line bg-ground-warm p-5">
	  <div class="text-sm font-semibold text-frame">Welcome to your Mystery Generator</div>
	  <div class="mt-2 text-sm text-frame">
	    Open a project to watch it being written and to read everything the pipeline produced. Stories are set up and started under <strong>Create</strong>; everything generated appears under <strong>Build</strong>, and the raw CML, logs and scores under <strong>Inspect</strong>.
	  </div>
	</div>

	<div v-if="synopsisData" class="rounded-lg border border-line bg-surface p-6 shadow-card">
	  <div class="t-section">Synopsis</div>
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
	      @click="goTo('inspect', 'inspect-clues')"
	    >
	      Open Clue board
	    </button>
	    <button
	      class="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-soft"
	      @click="goTo('inspect', 'artifact-outline')"
	    >
	      Open Outline
	    </button>
	    <button
	      v-if="isAdvanced"
	      class="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-soft"
	      @click="goTo('inspect', 'artifact-cml')"
	    >
	      Open CML Viewer
	    </button>
	  </div>
	</div>

	<div class="rounded-lg border border-line bg-surface p-6 shadow-card">
	  <div class="t-section">Open a project</div>
	  <div class="mt-4 grid gap-4 md:grid-cols-2">
	    <div>
	      <label for="ws-project-select" class="text-xs font-semibold text-ink-soft">Existing projects</label>
	      <select
	        id="ws-project-select"
	        v-model="selectedProjectId"
	        class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong"
	      >
	        <option value="">Select a project</option>
	        <option v-for="project in projectsList" :key="project.id" :value="project.id">
	          {{ project.name }} ({{ project.id }})
	        </option>
	      </select>
	    </div>
	    <div class="flex items-end">
	      <button
	        class="transition-control rounded border border-accent bg-accent px-4 py-2 text-[0.88rem] font-medium text-[--surface] hover:border-accent-hover hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-sunken disabled:text-ink-faint"
	        :disabled="!selectedProjectId"
	        @click="projectIdInput = selectedProjectId; handleLoadProject()"
	      >
	        Open
	      </button>
	    </div>
	    <div>
	      <!-- Kept: an operator working from a log line or a run report has an id, not a name. -->
	      <label for="ws-project-id" class="text-xs font-semibold text-ink-soft">Or open by ID</label>
	      <input
	        id="ws-project-id"
	        v-model="projectIdInput"
	        class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong"
	        placeholder="proj_..."
	      />
	    </div>
	    <div class="flex items-end">
	      <button
	        class="transition-control rounded border border-line bg-surface px-4 py-2 text-[0.88rem] font-medium text-ink hover:border-line-strong hover:bg-surface-sunken"
	        :disabled="!projectIdInput"
	        @click="handleLoadProject"
	      >
	        Open by ID
	      </button>
	    </div>
	  </div>
	  <div class="mt-4 text-xs text-ink-soft">
	    Project: {{ projectId ?? "none open" }} • Spec: {{ latestSpecId ?? "not saved" }}
	  </div>
	</div>

	  </div>
</template>
