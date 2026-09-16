import { effectScope } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	EVENTS_POLL_MS,
	QUALITY_POLL_MS,
	RUN_STATUS,
	useRunProgress,
	type RunProgressDeps,
	type RunStatusPayload,
} from "../useRunProgress";

/**
 * These are the branches UI-002 §9 called unreachable without a live API and Azure credentials.
 * Every one of them is entered through a callback the composable hands to `subscribe`, so a test
 * drives them directly. The deferral was wrong; this file is the correction.
 */

interface Harness {
	progress: ReturnType<typeof useRunProgress>;
	deps: RunProgressDeps;
	/** Push a status down the fake stream, exactly as the server would. */
	emit: (status: string) => Promise<void>;
	dropStream: () => void;
	restoreStream: () => void;
	unsubscribed: () => number;
	dispose: () => void;
	setLatestStep: (step: string | undefined) => void;
}

const harness = (): Harness => {
	let onStatus: ((p: RunStatusPayload) => void | Promise<void>) | null = null;
	let onError: (() => void) | null = null;
	let onReconnect: (() => void) | null = null;
	let unsubscribes = 0;
	let latestStep: string | undefined;

	const deps: RunProgressDeps = {
		subscribe: (_projectId, status, error, reconnect) => {
			onStatus = status;
			onError = error;
			onReconnect = reconnect;
			return () => {
				unsubscribes += 1;
			};
		},
		loadRunEvents: vi.fn(async () => {}),
		latestEventStep: () => latestStep,
		loadScoringReport: vi.fn(async () => {}),
		loadScoringHistory: vi.fn(async () => {}),
		pollArtifacts: vi.fn(),
		shouldPollQuality: vi.fn(() => true),
		notify: vi.fn(),
		logActivity: vi.fn(),
	};

	const scope = effectScope();
	const progress = scope.run(() => useRunProgress(deps)) as ReturnType<typeof useRunProgress>;
	progress.connect("proj_1");

	return {
		progress,
		deps,
		emit: async (status: string) => {
			await onStatus?.({ status });
		},
		dropStream: () => onError?.(),
		restoreStream: () => onReconnect?.(),
		unsubscribed: () => unsubscribes,
		dispose: () => scope.stop(),
		setLatestStep: (step) => {
			latestStep = step;
		},
	};
};

describe("useRunProgress — connection", () => {
	it("says so when there is no project, and opens nothing", () => {
		const scope = effectScope();
		const progress = scope.run(() =>
			useRunProgress({ ...harness().deps, subscribe: () => () => {} }),
		) as ReturnType<typeof useRunProgress>;

		progress.connect(null);
		expect(progress.runStatus.value).toBe(RUN_STATUS.noProject);
		expect(progress.isConnected()).toBe(false);
		scope.stop();
	});

	it("drops the previous subscription before opening another", () => {
		// Two live streams both driving one state machine is the failure this prevents.
		const h = harness();
		expect(h.unsubscribed()).toBe(0);
		h.progress.connect("proj_2");
		expect(h.unsubscribed()).toBe(1);
		h.dispose();
	});
});

describe("useRunProgress — the run lifecycle", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("goes to building and starts polling when a run starts", async () => {
		const h = harness();
		await h.emit("running");

		expect(h.progress.runStatus.value).toBe(RUN_STATUS.building);
		expect(h.progress.isRunning.value).toBe(true);

		vi.advanceTimersByTime(EVENTS_POLL_MS);
		expect(h.deps.loadRunEvents).toHaveBeenCalled();
		h.dispose();
	});

	it("completes: stops polling, loads artifacts, and says it is ready", async () => {
		const h = harness();
		await h.emit("running");
		h.setLatestStep("prose_done");
		await h.emit("idle");

		expect(h.progress.runStatus.value).toBe(RUN_STATUS.done);
		expect(h.deps.pollArtifacts).toHaveBeenCalledOnce();
		expect(h.deps.notify).toHaveBeenCalledWith("info", "Your mystery is ready.");
		expect(h.deps.logActivity).toHaveBeenCalledWith("run_completed");
		h.dispose();
	});

	it("fails: warns, does NOT load artifacts, and still fetches the partial report", async () => {
		// A failed run can have written a partial report with usable phase scores. Fetching it on
		// both branches is deliberate.
		const h = harness();
		await h.emit("running");
		h.setLatestStep("pipeline_error");
		await h.emit("idle");

		expect(h.progress.runStatus.value).toBe(RUN_STATUS.stopped);
		expect(h.deps.pollArtifacts).not.toHaveBeenCalled();
		expect(h.deps.logActivity).toHaveBeenCalledWith("run_failed");
		expect(h.deps.loadScoringReport).toHaveBeenCalled();
		expect(h.deps.loadScoringHistory).toHaveBeenCalled();
		h.dispose();
	});

	it("treats run_failed the same as pipeline_error", async () => {
		const h = harness();
		await h.emit("running");
		h.setLatestStep("run_failed");
		await h.emit("idle");
		expect(h.progress.runStatus.value).toBe(RUN_STATUS.stopped);
		h.dispose();
	});

	it("reads the latest step AFTER the events have been refreshed", async () => {
		// Reading it before would decide success or failure from the previous run's last event.
		const order: string[] = [];
		const h = harness();
		(h.deps.loadRunEvents as ReturnType<typeof vi.fn>).mockImplementation(async () => {
			order.push("load");
		});
		const original = h.deps.latestEventStep;
		h.deps.latestEventStep = () => {
			order.push("read");
			return original();
		};

		await h.emit("running");
		order.length = 0;
		await h.emit("idle");

		expect(order.indexOf("load")).toBeLessThan(order.indexOf("read"));
		h.dispose();
	});

	it("clears isStartingRun when the run ends", async () => {
		const h = harness();
		h.progress.isStartingRun.value = true;
		await h.emit("running");
		await h.emit("idle");
		expect(h.progress.isStartingRun.value).toBe(false);
		h.dispose();
	});

	it("stops the 3s poll once the run ends", async () => {
		const h = harness();
		await h.emit("running");
		await h.emit("idle");
		(h.deps.loadRunEvents as ReturnType<typeof vi.fn>).mockClear();

		vi.advanceTimersByTime(EVENTS_POLL_MS * 4);
		expect(h.deps.loadRunEvents).not.toHaveBeenCalled();
		h.dispose();
	});

	it("does not fire the completion path on an idle that follows an idle", async () => {
		// Only a running -> idle TRANSITION is a completion. An idle heartbeat is not.
		const h = harness();
		await h.emit("idle");
		await h.emit("idle");
		expect(h.deps.pollArtifacts).not.toHaveBeenCalled();
		expect(h.deps.notify).not.toHaveBeenCalled();
		h.dispose();
	});

	it("recovers the status line after a reload mid-run", async () => {
		const h = harness();
		await h.emit("running");
		h.progress.isStartingRun.value = false;
		// A fresh page never saw the run start, so `previous` is not "running" on its first idle.
		h.progress.lastProjectStatus.value = null;
		await h.emit("idle");
		expect(h.progress.runStatus.value).toBe(RUN_STATUS.idle);
		h.dispose();
	});
});

describe("useRunProgress — the stream dropping", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("says it is reconnecting when the stream errors", async () => {
		const h = harness();
		h.dropStream();
		expect(h.progress.runStatus.value).toBe(RUN_STATUS.reconnecting);
		h.dispose();
	});

	it("clears the reconnecting line on recovery when nothing is running", () => {
		const h = harness();
		h.dropStream();
		h.restoreStream();
		expect(h.progress.runStatus.value).toBe(RUN_STATUS.idle);
		h.dispose();
	});

	it("does NOT stamp 'ready' over a run that is still going (U-6)", async () => {
		// The stream dropping says nothing about the pipeline.
		const h = harness();
		await h.emit("running");
		h.dropStream();
		h.restoreStream();
		expect(h.progress.runStatus.value).not.toBe(RUN_STATUS.idle);
		h.dispose();
	});
});

describe("useRunProgress — the quality poll", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("polls only while a run is in flight", async () => {
		const h = harness();
		vi.advanceTimersByTime(QUALITY_POLL_MS * 2);
		expect(h.deps.loadScoringReport).not.toHaveBeenCalled();

		await h.emit("running");
		vi.advanceTimersByTime(QUALITY_POLL_MS);
		expect(h.deps.loadScoringReport).toHaveBeenCalled();
		h.dispose();
	});

	it("checks the panel is open at FIRE time, not at start time", async () => {
		// The panel can open and close during a run; gating at start would miss the common case.
		const h = harness();
		(h.deps.shouldPollQuality as ReturnType<typeof vi.fn>).mockReturnValue(false);
		await h.emit("running");

		vi.advanceTimersByTime(QUALITY_POLL_MS);
		expect(h.deps.loadScoringReport).not.toHaveBeenCalled();

		(h.deps.shouldPollQuality as ReturnType<typeof vi.fn>).mockReturnValue(true);
		vi.advanceTimersByTime(QUALITY_POLL_MS);
		expect(h.deps.loadScoringReport).toHaveBeenCalled();
		h.dispose();
	});

	it("does not stack a second interval when running is seen twice", async () => {
		const h = harness();
		await h.emit("running");
		await h.emit("running");
		expect(h.progress.pendingTimers()).toBe(2); // one events, one quality — not three
		h.dispose();
	});
});

describe("useRunProgress — B1, the leak A_73 had to retrofit", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("clears BOTH intervals and the subscription on scope disposal", async () => {
		// Moving these timers into a composable is precisely the change that re-introduces the leak,
		// so this is asserted rather than trusted.
		const h = harness();
		await h.emit("running");
		expect(h.progress.pendingTimers()).toBe(2);
		expect(h.progress.isConnected()).toBe(true);

		h.dispose();

		expect(h.progress.pendingTimers()).toBe(0);
		expect(h.progress.isConnected()).toBe(false);
		expect(h.unsubscribed()).toBe(1);
	});

	it("fires nothing after disposal", async () => {
		const h = harness();
		await h.emit("running");
		h.dispose();
		(h.deps.loadRunEvents as ReturnType<typeof vi.fn>).mockClear();
		(h.deps.loadScoringReport as ReturnType<typeof vi.fn>).mockClear();

		vi.advanceTimersByTime(QUALITY_POLL_MS * 5);

		expect(h.deps.loadRunEvents).not.toHaveBeenCalled();
		expect(h.deps.loadScoringReport).not.toHaveBeenCalled();
	});

	it("is idempotent", async () => {
		const h = harness();
		await h.emit("running");
		h.progress.dispose();
		expect(() => h.progress.dispose()).not.toThrow();
		expect(h.progress.pendingTimers()).toBe(0);
	});
});
