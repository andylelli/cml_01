<script setup lang="ts">
import { useWorkshop } from "../useWorkshopState";
import ArtifactStatusDashboard from "../../../components/ArtifactStatusDashboard.vue";
import ContentSkeleton from "../../../components/ContentSkeleton.vue";
import DebugPanel from "../../../components/DebugPanel.vue";
import ErrorLogPanel from "../../../components/ErrorLogPanel.vue";
import PhaseBreakdownTable from "../../../components/PhaseBreakdownTable.vue";
import RunHistory from "../../../components/RunHistory.vue";
import ScoreCard from "../../../components/ScoreCard.vue";
import ScoreTrendChart from "../../../components/ScoreTrendChart.vue";
import TabPanel from "../../../components/TabPanel.vue";
import VirtualList from "../../../components/VirtualList.vue";
import AppButton from "../../../components/ui/AppButton.vue";
import AppIcon from "../../../components/ui/AppIcon.vue";

/**
 * INSPECT — is it any good, and what went wrong (UI-009).
 *
 * This was two tabs over fourteen sub-tabs: Review (eight) and Advanced (six). Review rendered
 * artifacts that CaseView already shows a reader and that Advanced already dumps raw, and only two
 * of its eight sections had a control at all. Six display-only sections went; the Clue Board came
 * here because filtering red herrings is the one genuinely diagnostic thing you could do there.
 *
 * One page, five sections, a jump bar. The jump bar is not a new idea — the Run tab already made
 * this trade and its comment says why.
 */
const {
	activeMainTab,
	artifactEntries,
	artifactsStatus,
	backgroundContextArtifact,
	castArtifact,
	characterProfilesArtifact,
	chapterOptions,
	clearErrors,
	handleClearStore,
	cluesArtifact,
	cluesData,
	cmlArtifact,
	currentChapter,
	debugLogs,
	errors,
	filteredClues,
	gamePackArtifact,
	handleArtifactView,
	hardLogicDevicesArtifact,
	isAdvanced,
	isRunning,
	isScoringReportLoading,
	isStartingRun,
	latestRunId,
	llmLogs,
	locationProfilesArtifact,
	outlineArtifact,
	playModeEnabled,
	proseArtifact,
	runEventsData,
	runProgressLabel,
	scoringHistory,
	scoringReport,
	settingArtifact,
	showRedHerrings,
	temporalContextArtifact,
} = useWorkshop();

/** Every artifact, with the anchor `handleArtifactView` jumps to. */
const artifacts = [
	{ id: "setting", label: "Setting", value: settingArtifact },
	{ id: "cast", label: "Cast", value: castArtifact },
	{ id: "character_profiles", label: "Character profiles", value: characterProfilesArtifact },
	{ id: "location_profiles", label: "Location profiles", value: locationProfilesArtifact },
	{ id: "temporal_context", label: "Temporal context", value: temporalContextArtifact },
	{ id: "background_context", label: "Background context", value: backgroundContextArtifact },
	{ id: "hard_logic_devices", label: "Method (hard-logic devices)", value: hardLogicDevicesArtifact },
	{ id: "cml", label: "CML", value: cmlArtifact },
	{ id: "clues", label: "Clues", value: cluesArtifact },
	{ id: "outline", label: "Outline", value: outlineArtifact },
	{ id: "prose", label: "Prose", value: proseArtifact },
	{ id: "game_pack", label: "Game pack", value: gamePackArtifact },
];

const sections = [
	{ id: "inspect-quality", label: "Quality" },
	{ id: "inspect-clues", label: "Clues" },
	{ id: "inspect-artifacts", label: "Artifacts" },
	{ id: "inspect-logs", label: "Logs" },
	{ id: "inspect-history", label: "History" },
];
</script>

<template>
	<TabPanel id="inspect-tab" :active="activeMainTab === 'inspect'" :lazy="true">
		<div class="flex flex-col gap-6">
			<nav aria-label="Inspect sections" class="flex flex-wrap items-center gap-2">
				<span class="t-eyebrow">Jump to</span>
				<a
					v-for="s in sections"
					:key="s.id"
					:href="`#${s.id}`"
					class="transition-control rounded-sm border border-line bg-surface px-2.5 py-1 text-[0.78rem] font-medium text-ink no-underline hover:border-line-strong hover:bg-surface-sunken"
				>
					{{ s.label }}
				</a>
			</nav>

			<!-- ── quality ───────────────────────────────────────────── -->
			<section id="inspect-quality" class="scroll-mt-24 space-y-4">
				<div
					v-if="isRunning || isStartingRun"
					class="flex items-center gap-3 rounded-lg border border-line-strong bg-surface-sunken px-4 py-3 text-sm text-frame"
				>
					<AppIcon name="gear" :size="16" class="shrink-0 animate-spin" />
					<div>
						<span class="font-semibold">Run in progress</span>
						<span class="ml-1 text-frame">— {{ runProgressLabel }}</span>
					</div>
				</div>

				<div
					v-if="isScoringReportLoading && !scoringReport"
					class="rounded-lg border border-line bg-surface p-6 text-center text-sm text-ink-soft"
				>
					Loading quality report…
				</div>
				<template v-else>
					<div
						v-if="!scoringReport && (isRunning || isStartingRun)"
						class="rounded-lg border border-line bg-surface p-6 text-center text-sm text-ink-soft"
					>
						Generating — scores for each stage will appear here as they complete.
					</div>
					<template v-else>
						<div
							v-if="scoringReport && (scoringReport as unknown as Record<string, unknown>).in_progress === true && (isRunning || isStartingRun)"
							class="flex items-center gap-2 rounded-lg border border-warn bg-warn-wash px-4 py-2 text-sm text-warn"
						>
							<AppIcon name="gear" :size="14" class="shrink-0 animate-spin" />
							<span>Partial scores — updating as each stage completes</span>
						</div>
						<ScoreCard :report="scoringReport" :loading="isScoringReportLoading" />
						<PhaseBreakdownTable v-if="scoringReport" :phases="scoringReport.phases" />
						<ScoreTrendChart v-if="scoringHistory.length >= 2" :history="scoringHistory" />
					</template>
				</template>
			</section>

			<!-- ── clues: the one diagnostic view worth keeping from Review ── -->
			<section id="inspect-clues" class="scroll-mt-24 rounded-lg border border-line bg-surface p-6 shadow-card">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h2 class="t-section">Clue board</h2>
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
						<select
							v-if="playModeEnabled"
							v-model="currentChapter"
							aria-label="Reveal clues up to chapter"
							class="rounded border border-line px-2 py-1"
						>
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
			</section>

			<!-- ── artifacts ─────────────────────────────────────────── -->
			<section id="inspect-artifacts" class="scroll-mt-24 flex flex-col gap-4">
				<ArtifactStatusDashboard
					:artifacts="artifactEntries"
					:is-running="isRunning || isStartingRun"
					@view="handleArtifactView"
				/>
				<div class="rounded-lg border border-line bg-surface p-6 shadow-card">
					<h2 class="t-section">Raw artifacts</h2>
					<div class="t-subtitle mt-1">
						Exactly what the pipeline saved. The readable version of a finished case is under
						<strong>My Cases</strong>.
					</div>
					<div class="mt-4 space-y-4 text-xs">
						<div v-for="a in artifacts" :id="`artifact-${a.id}`" :key="a.id" class="scroll-mt-24">
							<div class="font-semibold text-ink-soft">{{ a.label }}</div>
							<pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ a.value ?? "Not available" }}</pre>
						</div>
					</div>
				</div>
			</section>

			<!-- ── logs ──────────────────────────────────────────────── -->
			<section id="inspect-logs" class="scroll-mt-24 flex flex-col gap-4">
				<ErrorLogPanel :errors="errors" @clear="clearErrors()" />
				<div class="rounded-lg border border-line bg-surface p-6 shadow-card">
					<h2 class="t-section">LLM log entries</h2>
					<div class="t-subtitle mt-1">
						Operational log entries (model, tokens, cost, latency). Raw prompts are not stored.
					</div>
					<div v-if="llmLogs.length" class="mt-4 space-y-2 text-xs">
						<div
							v-for="(entry, idx) in llmLogs"
							:key="`${entry.timestamp}-${idx}`"
							class="rounded border border-line bg-ground px-3 py-2"
						>
							<div class="flex flex-wrap items-center justify-between gap-2 text-ink-soft">
								<span class="font-semibold text-ink">{{ entry.agent }}</span>
								<span>{{ entry.operation }}</span>
								<span>{{ entry.model }}</span>
								<span v-if="entry.totalTokens">{{ entry.totalTokens }} tokens</span>
								<span v-if="entry.estimatedCost">${{ entry.estimatedCost.toFixed(4) }}</span>
							</div>
							<div class="mt-1 text-[11px] text-ink-soft">
								{{ entry.timestamp }} • {{ entry.projectId }} • {{ entry.runId }}
							</div>
							<div v-if="entry.errorMessage" class="mt-1 text-[11px] text-danger">
								{{ entry.errorMessage }}
							</div>
						</div>
					</div>
					<div v-else class="mt-4 text-sm text-ink-soft">No activity yet. Run generation to see entries.</div>
				</div>
				<DebugPanel v-if="isAdvanced" :logs="debugLogs" />
			</section>

			<!-- ── history ───────────────────────────────────────────── -->
			<section id="inspect-history" class="scroll-mt-24">
				<RunHistory v-if="runEventsData.length" :events="runEventsData" :run-id="latestRunId ?? undefined" />
				<div v-else class="rounded-lg border border-line bg-surface p-6 text-center text-sm text-ink-soft">
					No run history available
				</div>
			</section>

			<!-- Destructive, so it sits at the bottom of the diagnostics page rather than anywhere
			     near the button that starts a run. -->
			<div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger bg-danger-wash px-4 py-3">
				<div class="text-xs text-danger">
					Clears saved projects, artifacts, run history, scoring reports, LLM logs and prompt history.
					This cannot be undone.
				</div>
				<AppButton size="sm" variant="danger" @click="handleClearStore">
					Clear all persistence
				</AppButton>
			</div>
		</div>
	</TabPanel>
</template>
