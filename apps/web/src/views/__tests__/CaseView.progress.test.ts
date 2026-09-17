import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CaseView from "../CaseView.vue";
import { useProjectStore } from "../../stores/projectStore";
import { deriveProgress, deriveStages } from "../../run/timeline";

/**
 * "Does the progress update as generation progresses?"
 *
 * A live run costs money and forty minutes, so this drives the same inputs a run produces: run
 * events arriving in order. Everything downstream — the percentage, the stage list, the reader-facing
 * labels — is a pure function of those events, so feeding them IS the test.
 */

vi.mock("../../services/api", () => ({
	fetchProjectStatus: vi.fn(async () => ({ projectId: "p1", status: "running" })),
	downloadStoryPdf: vi.fn(async () => new Blob()),
}));

/** The events a real run emits, in the order the orchestrator emits them. */
const RUN = [
	{ step: "pipeline_started", message: "Starting mystery generation pipeline" },
	{ step: "setting", message: "Designing the setting" },
	{ step: "setting_done", message: "Setting complete" },
	{ step: "cast", message: "Designing the cast" },
	{ step: "cast_done", message: "Cast designed" },
	{ step: "cml", message: "Generating CML" },
	{ step: "cml_done", message: "CML validated" },
	{ step: "clues", message: "Distributing clues" },
	{ step: "clues_done", message: "Clues distributed" },
	{ step: "prose", message: "Writing chapter 6 of 10" },
];

describe("run progress is a pure function of the events", () => {
	it("rises monotonically as the run proceeds", () => {
		const percents = RUN.map((_, i) => deriveProgress(RUN.slice(0, i + 1)).percent);
		for (let i = 1; i < percents.length; i++) {
			expect(percents[i], `fell at event ${i}: ${RUN[i].step}`).toBeGreaterThanOrEqual(percents[i - 1]);
		}
		expect(percents[0]).toBeLessThan(percents[percents.length - 1]);
	});

	it("carries the pipeline's own message as the label", () => {
		// slice(0, 9) ends on `clues_done`, the highest-percentage event so far.
		expect(deriveProgress(RUN.slice(0, 9))).toEqual({ percent: 65, label: "Clues distributed" });
	});

	it("marks stages complete in order, and names the one running", () => {
		const early = deriveStages(RUN.slice(0, 3));
		expect(early.find((s) => s.id === "setting")?.status).toBe("complete");
		expect(early.find((s) => s.id === "prose")?.status).toBe("pending");

		const late = deriveStages(RUN);
		expect(late.find((s) => s.id === "clues")?.status).toBe("complete");
		expect(late.find((s) => s.id === "prose")?.status).toBe("running");
	});

	it("marks the running stage failed when the run dies there", () => {
		const failed = deriveStages([...RUN, { step: "pipeline_error", message: "Prose generation failed" }]);
		expect(failed.find((s) => s.id === "prose")?.status).toBe("failed");
	});
});

describe("CaseView shows that progress, and updates as events arrive", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		localStorage.clear();
		const store = useProjectStore();
		store.loadRunEvents = vi.fn(async () => {}) as never;
		store.loadArtifacts = vi.fn(async () => {}) as never;
		store.runEventsData = [] as never;
	});

	afterEach(() => vi.clearAllMocks());

	const mountCase = () =>
		mount(CaseView, {
			props: { projectId: "p1", projectName: "A Case" },
			global: { stubs: { "font-awesome-icon": true } },
		});

	it("renders the track while the run is going", async () => {
		const store = useProjectStore();
		store.runEventsData = RUN.slice(0, 5) as never;
		const wrapper = mountCase();
		await new Promise((r) => setTimeout(r, 0));
		await nextTick();

		const bar = wrapper.find('[role="progressbar"]');
		expect(bar.exists(), "no progress bar while running").toBe(true);
		expect(Number(bar.attributes("aria-valuenow"))).toBeGreaterThan(0);
		wrapper.unmount();
	});

	it("advances when more events arrive — without remounting", async () => {
		const store = useProjectStore();
		store.runEventsData = RUN.slice(0, 3) as never;
		const wrapper = mountCase();
		await new Promise((r) => setTimeout(r, 0));
		await nextTick();

		const read = () => Number(wrapper.find('[role="progressbar"]').attributes("aria-valuenow"));
		const before = read();

		// What the 4s poll does: refresh the store's events.
		store.runEventsData = RUN as never;
		await nextTick();

		expect(read(), "the bar did not move when new events landed").toBeGreaterThan(before);
		wrapper.unmount();
	});

	it("names the current stage in the reader's words, not the pipeline's", async () => {
		const store = useProjectStore();
		store.runEventsData = RUN as never;
		const wrapper = mountCase();
		await new Promise((r) => setTimeout(r, 0));
		await nextTick();

		// The running stage's blurb is the line under the bar — the console shows the agent name.
		expect(wrapper.text()).toContain("Writing it.");
		// The operator labels must not leak into the reader's view.
		for (const operatorWord of ["Hard Logic", "CML", "Novelty Audit", "World Builder", "Fair-play"]) {
			expect(wrapper.text(), `operator label "${operatorWord}" leaked`).not.toContain(operatorWord);
		}
		wrapper.unmount();
	});

	it("polls while running and stops when it is not", async () => {
		vi.useFakeTimers();
		const store = useProjectStore();
		const wrapper = mountCase();
		await vi.advanceTimersByTimeAsync(0);

		const calls = () => (store.loadRunEvents as ReturnType<typeof vi.fn>).mock.calls.length;
		const initial = calls();
		await vi.advanceTimersByTimeAsync(9000); // two 4s ticks
		expect(calls(), "no polling while the run is going").toBeGreaterThan(initial);

		wrapper.unmount();
		const afterUnmount = calls();
		await vi.advanceTimersByTimeAsync(12000);
		expect(calls(), "still polling after unmount").toBe(afterUnmount);
		vi.useRealTimers();
	});
});
