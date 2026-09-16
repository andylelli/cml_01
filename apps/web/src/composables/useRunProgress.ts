import { computed, onScopeDispose, ref, type Ref } from "vue";

/**
 * RUN PROGRESS — the SSE subscription, the two polling loops, and the run-completion state machine.
 *
 * ── WHY THIS IS TESTABLE, HAVING ONCE BEEN CALLED UNTESTABLE ──────────────────────────────────
 *
 * UI-002 §9 deferred this on the grounds that "a run completed", "a run failed" and "the stream
 * dropped and came back" need a live API and Azure credentials. That was WRONG, and the correction
 * is the reason this file exists: every one of those branches is entered through a CALLBACK THIS
 * COMPOSABLE HANDS OUT. A test calls `onStatus({ status: "running" })` and then
 * `onStatus({ status: "idle" })` and the completion path runs exactly as it does in production.
 * Only the wire needs a server, and the wire is `services/sse.ts` — thirty lines, and not where the
 * bugs are.
 *
 * So `subscribe` is injected rather than imported. That is the whole of what makes the state
 * machine reachable from a test.
 *
 * ── B1, WHICH A SPLIT LIKE THIS IS EXACTLY HOW YOU LOSE ───────────────────────────────────────
 *
 * A_73 had to retrofit unmount cleanup into the old App.vue after BOTH intervals were found still
 * firing against a destroyed component. Moving them into a composable is precisely the change that
 * re-introduces that, so ownership of both timers lives here, `dispose()` clears both, and
 * `pendingTimers()` exists so a test can assert it rather than trust it.
 */

export type ProjectStatus = "running" | "idle" | (string & {});

export interface RunStatusPayload {
	status: ProjectStatus;
}

/** The unsubscribe function `subscribeToRunEvents` returns. */
export type Unsubscribe = () => void;

export type SubscribeFn = (
	projectId: string,
	onStatus: (payload: RunStatusPayload) => void | Promise<void>,
	onError: () => void,
	onReconnect: () => void,
) => Unsubscribe;

/**
 * The status line, as literals in one place. The old code compared `runStatus.value` against
 * `"Building your mystery..."` by hand in one branch — a string equality against a message written
 * three hundred lines away, which is a rename waiting to break a state transition silently.
 */
export const RUN_STATUS = {
	idle: "Ready to generate",
	noProject: "Create a project to begin",
	building: "Building your mystery...",
	done: "All set. Explore your results.",
	stopped: "Generation stopped before completion. Check run history and retry.",
	reconnecting: "Reconnecting...",
} as const;

export const EVENTS_POLL_MS = 3000;
export const QUALITY_POLL_MS = 8000;

/** Steps that mean the run ended badly. */
const FAILURE_STEPS = new Set(["pipeline_error", "run_failed"]);

export interface RunProgressDeps {
	/** Injected so the state machine is reachable from a test. */
	subscribe: SubscribeFn;
	/** Refresh run events; must resolve AFTER the store has the latest events. */
	loadRunEvents: () => Promise<void>;
	/** The step of the most recent run event, read after `loadRunEvents` resolves. */
	latestEventStep: () => string | undefined;
	loadScoringReport: () => Promise<unknown> | void;
	loadScoringHistory: () => Promise<unknown> | void;
	pollArtifacts: () => void;
	/** True when the quality panel is on screen; the 8s poll is otherwise pointless traffic. */
	shouldPollQuality: () => boolean;
	notify: (severity: "info" | "warning", message: string, detail?: string) => void;
	logActivity: (message: string) => void;
}

export const useRunProgress = (deps: RunProgressDeps) => {
	const runStatus = ref<string>(RUN_STATUS.idle);
	const lastProjectStatus = ref<string | null>(null);
	const isStartingRun = ref(false);
	const pendingRunId = ref<string | null>(null);

	const isRunning = computed(() => lastProjectStatus.value === "running");

	let unsubscribe: Unsubscribe | null = null;
	let eventsInterval: ReturnType<typeof setInterval> | null = null;
	let qualityInterval: ReturnType<typeof setInterval> | null = null;

	/* ── polling ─────────────────────────────────────────────────────────────────────────────── */

	const startEventsPolling = (): void => {
		if (eventsInterval) return;
		eventsInterval = setInterval(() => void refreshRunEvents(), EVENTS_POLL_MS);
	};

	const stopEventsPolling = (): void => {
		if (!eventsInterval) return;
		clearInterval(eventsInterval);
		eventsInterval = null;
	};

	const startQualityPolling = (): void => {
		if (qualityInterval) return;
		qualityInterval = setInterval(() => {
			// Gated at FIRE time, not at START time: the panel can open and close during a run, and
			// starting the timer only when it happens to be open would miss the common case.
			if (deps.shouldPollQuality()) void deps.loadScoringReport();
		}, QUALITY_POLL_MS);
	};

	const stopQualityPolling = (): void => {
		if (!qualityInterval) return;
		clearInterval(qualityInterval);
		qualityInterval = null;
	};

	/** Follows `isRunning`: the quality poll runs while a run is in flight and at no other time. */
	const syncQualityPolling = (): void => {
		if (isRunning.value) startQualityPolling();
		else stopQualityPolling();
	};

	/* ── the state machine ───────────────────────────────────────────────────────────────────── */

	const refreshRunEvents = async (): Promise<void> => {
		await deps.loadRunEvents();
	};

	const onRunFinished = async (): Promise<void> => {
		isStartingRun.value = false;
		stopEventsPolling();
		await deps.loadRunEvents();

		const failed = FAILURE_STEPS.has(deps.latestEventStep() ?? "");

		if (failed) {
			runStatus.value = RUN_STATUS.stopped;
			deps.notify("warning", "Generation stopped before completion", "Open History/Logs for details, then retry.");
			deps.logActivity("run_failed");
			// A failed run can still have written a partial report with useful phase scores, so the
			// report is fetched on BOTH branches — this is deliberate, not a copy-paste.
			void deps.loadScoringReport();
			void deps.loadScoringHistory();
			return;
		}

		runStatus.value = RUN_STATUS.done;
		deps.pollArtifacts();
		void deps.loadScoringReport();
		void deps.loadScoringHistory();
		deps.notify("info", "Your mystery is ready.");
		deps.logActivity("run_completed");
	};

	const onStatus = async (payload: RunStatusPayload): Promise<void> => {
		const previous = lastProjectStatus.value;
		lastProjectStatus.value = payload.status;
		syncQualityPolling();

		if (payload.status === "running") {
			runStatus.value = RUN_STATUS.building;
			startEventsPolling();
			return;
		}

		if (previous === "running" && payload.status === "idle") {
			await onRunFinished();
			return;
		}

		// An idle heartbeat while the line still reads "building" and nothing is starting: the run is
		// over and we never saw it start (a reload mid-run, most often).
		if (payload.status === "idle" && !isStartingRun.value && runStatus.value === RUN_STATUS.building) {
			runStatus.value = RUN_STATUS.idle;
		}
	};

	/* ── connection ──────────────────────────────────────────────────────────────────────────── */

	const connect = (projectId: string | null): void => {
		if (!projectId) {
			runStatus.value = RUN_STATUS.noProject;
			return;
		}

		// Reconnecting without dropping the old subscription is how you end up with two streams both
		// driving the state machine.
		unsubscribe?.();

		unsubscribe = deps.subscribe(
			projectId,
			onStatus,
			() => {
				runStatus.value = RUN_STATUS.reconnecting;
			},
			() => {
				// Do not stamp "ready" over a run that is still going — the stream dropping says
				// nothing about the pipeline (U-6).
				if (lastProjectStatus.value !== "running") runStatus.value = RUN_STATUS.idle;
			},
		);
	};

	const disconnect = (): void => {
		unsubscribe?.();
		unsubscribe = null;
		stopEventsPolling();
	};

	/** Clears the subscription and BOTH timers. Idempotent. B1 lives or dies here. */
	const dispose = (): void => {
		disconnect();
		stopQualityPolling();
	};

	onScopeDispose(dispose, true);

	return {
		runStatus,
		lastProjectStatus,
		isStartingRun,
		pendingRunId,
		isRunning,
		connect,
		disconnect,
		dispose,
		startEventsPolling,
		stopEventsPolling,
		syncQualityPolling,
		refreshRunEvents,
		/** Test seam: how many of the two intervals are live. */
		pendingTimers: () => (eventsInterval ? 1 : 0) + (qualityInterval ? 1 : 0),
		/** Test seam: whether a subscription is open. */
		isConnected: () => unsubscribe !== null,
	};
};

export type RunProgress = ReturnType<typeof useRunProgress>;
