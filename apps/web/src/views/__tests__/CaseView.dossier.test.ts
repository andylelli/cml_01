import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CaseView from "../CaseView.vue";
import { useProjectStore } from "../../stores/projectStore";

/**
 * THE DEFECT THIS EXISTS TO PREVENT.
 *
 * The Places card rendered `location.description` and walked `location.accessibility`. Neither
 * exists in the payload — the pipeline emits `purpose`, `visualDetails`, `paragraphs`,
 * `sensoryDetails` and a plain-string `accessControl`. The card therefore drew nothing, silently,
 * for as long as it had existed, and `vue-tsc` was clean the whole time: an absent optional property
 * is not a type error, and the TYPE agreed with the template rather than with the payload.
 *
 * A component that renders nothing looks exactly like a component that renders correctly. So the
 * fixtures below are shaped like the real payload and every field is asserted to REACH the screen.
 * If the field names drift again, this fails instead of the case file quietly emptying.
 */

vi.mock("../../services/api", () => ({
	fetchProjectStatus: vi.fn(async () => ({ projectId: "p1", status: "idle" })),
	downloadStoryPdf: vi.fn(async () => new Blob()),
}));

const LOCATIONS = {
	primary: {
		name: "Thornfield Hall",
		summary: "A house that has outlived its money.",
		paragraphs: ["The east wing has been shut since the war."],
	},
	keyLocations: [
		{
			id: "library",
			name: "The Library",
			type: "interior",
			purpose: "Crime scene", // SPOILER — the one location field that leaks.
			visualDetails: "Oak shelves to the ceiling, one ladder on a brass rail.",
			paragraphs: ["Nobody reads here. The books are for being seen to own."],
			sensoryDetails: {
				sights: ["dust in the window light"],
				sounds: ["a clock two rooms away"],
				smells: ["pipe smoke", "damp paper"],
				tactile: ["cold leather"],
			},
			accessControl: "Locked after ten; the housekeeper holds the only key.", // SPOILER
		},
	],
	atmosphere: { mood: "Watchful", weather: "Rain since Tuesday", timeFlow: "Slow" },
};

const PROFILES = {
	status: "ok",
	profiles: [
		{
			name: "Charles Fenwick",
			summary: "A gentleman careful with his reputation.",
			publicPersona: "Affable and always exactly where he says he was.",
			speechMannerisms: "Long sentences ending in a question he answers himself.",
			internalConflict: "Wants to be thought decent more than he wants to be decent.",
			signatureTic: '"Well now, let us be reasonable about this."',
			humourStyle: "dry_wit",
			privateSecret: "SECRET-THE-AFFAIR",
			motiveSeed: "MOTIVE-THE-EXPOSURE",
			stakes: "STAKES-HIS-MARRIAGE",
			personalStakeInCase: "STAKE-IN-CASE",
			alibiWindow: "ALIBI-NINE-TO-TEN",
			accessPlausibility: "ACCESS-HAD-A-KEY",
			// MEASURED: on a real payload this restates privateSecret almost verbatim.
			paragraphs: ["PARAGRAPH-THAT-RESTATES-THE-SECRET"],
		},
	],
};

const mountCase = () =>
	mount(CaseView, {
		props: { projectId: "p1", projectName: "A Test Case" },
		global: { stubs: { "font-awesome-icon": true } },
	});

const settled = async () => new Promise((r) => setTimeout(r, 0));

const reveal = async (wrapper: ReturnType<typeof mountCase>) => {
	const toggle = wrapper.findAll("button").find((b) => b.text().includes("Show me the solution"));
	expect(toggle, "no spoiler toggle").toBeTruthy();
	await toggle?.trigger("click");
};

describe("the safe tier reaches the screen", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		localStorage.clear();
		const store = useProjectStore();
		store.loadRunEvents = vi.fn(async () => {}) as never;
		store.loadArtifacts = vi.fn(async () => {}) as never;
		store.locationProfilesData = LOCATIONS as never;
		store.characterProfilesData = PROFILES as never;
	});

	afterEach(() => vi.clearAllMocks());

	it("draws every safe location field — the ones that used to be blank", async () => {
		const wrapper = mountCase();
		await settled();
		const text = wrapper.text();

		for (const expected of [
			"Thornfield Hall",
			"The east wing has been shut since the war.",
			"The Library",
			"Oak shelves to the ceiling, one ladder on a brass rail.",
			"Nobody reads here. The books are for being seen to own.",
			"dust in the window light", // sensoryDetails.sights
			"pipe smoke · damp paper", // smells, joined
			"Watchful · Rain since Tuesday · Slow", // atmosphere
		]) {
			expect(text, `not rendered: ${expected}`).toContain(expected);
		}
		wrapper.unmount();
	});

	it("draws every safe character field — it used to show three of seventeen", async () => {
		const wrapper = mountCase();
		await settled();
		const text = wrapper.text();

		for (const expected of [
			"Charles Fenwick",
			"A gentleman careful with his reputation.",
			"Affable and always exactly where he says he was.",
			"Long sentences ending in a question he answers himself.",
			"Wants to be thought decent more than he wants to be decent.",
			"Well now, let us be reasonable about this.",
			"dry wit", // humourStyle, underscores replaced
		]) {
			expect(text, `not rendered: ${expected}`).toContain(expected);
		}
		wrapper.unmount();
	});

	it("strips the payload's own quotation marks from the tic", async () => {
		const wrapper = mountCase();
		await settled();
		// The template supplies its own; the payload arrives already quoted.
		expect(wrapper.text()).not.toContain('""Well now');
		wrapper.unmount();
	});
});

describe("the bonus tier stays shut until it is asked for", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		localStorage.clear();
		const store = useProjectStore();
		store.loadRunEvents = vi.fn(async () => {}) as never;
		store.loadArtifacts = vi.fn(async () => {}) as never;
		store.locationProfilesData = LOCATIONS as never;
		store.characterProfilesData = PROFILES as never;
	});

	afterEach(() => vi.clearAllMocks());

	/** Every field spec/spoilers.ts calls a spoiler, plus the two location ones. */
	const HELD_BACK = [
		"SECRET-THE-AFFAIR",
		"MOTIVE-THE-EXPOSURE",
		"STAKES-HIS-MARRIAGE",
		"STAKE-IN-CASE",
		"ALIBI-NINE-TO-TEN",
		"ACCESS-HAD-A-KEY",
		"PARAGRAPH-THAT-RESTATES-THE-SECRET",
		"Crime scene",
		"Locked after ten; the housekeeper holds the only key.",
	];

	it("holds back all of it by default", async () => {
		const wrapper = mountCase();
		await settled();
		const text = wrapper.text();
		for (const secret of HELD_BACK) {
			expect(text, `leaked before the toggle: ${secret}`).not.toContain(secret);
		}
		wrapper.unmount();
	});

	it("gives all of it up on the one control, and nothing is unreachable", async () => {
		const wrapper = mountCase();
		await settled();
		await reveal(wrapper);
		const text = wrapper.text();
		for (const secret of HELD_BACK) {
			expect(text, `unreachable even after revealing: ${secret}`).toContain(secret);
		}
		wrapper.unmount();
	});

	it("keeps the safe tier visible when the bonus tier opens", async () => {
		const wrapper = mountCase();
		await settled();
		await reveal(wrapper);
		expect(wrapper.text()).toContain("Affable and always exactly where he says he was.");
		expect(wrapper.text()).toContain("Oak shelves to the ceiling, one ladder on a brass rail.");
		wrapper.unmount();
	});
});

describe("a case the pipeline has not finished", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		localStorage.clear();
		const store = useProjectStore();
		store.loadRunEvents = vi.fn(async () => {}) as never;
		store.loadArtifacts = vi.fn(async () => {}) as never;
	});

	afterEach(() => vi.clearAllMocks());

	it("shows no Places or People card rather than empty ones", async () => {
		const wrapper = mountCase();
		await settled();
		expect(wrapper.text()).not.toContain("The Places");
		expect(wrapper.text()).not.toContain("The People");
		wrapper.unmount();
	});

	it("falls back to bare names when the cast exists but the profiles do not", async () => {
		const store = useProjectStore();
		store.castData = { suspects: ["Charles Fenwick", "Beatrice Fenwick"] } as never;
		const wrapper = mountCase();
		await settled();
		expect(wrapper.text()).toContain("The People");
		expect(wrapper.text()).toContain("Beatrice Fenwick");
		wrapper.unmount();
	});

	it("omits a location's optional fields rather than drawing empty labels", async () => {
		const store = useProjectStore();
		store.locationProfilesData = {
			keyLocations: [{ name: "The Scullery", paragraphs: [] }],
		} as never;
		const wrapper = mountCase();
		await settled();
		expect(wrapper.text()).toContain("The Scullery");
		// No orphaned sense headings for a place with no sensory detail.
		for (const term of ["Sights", "Sounds", "Smells", "Touch"]) {
			expect(wrapper.text(), `orphaned label: ${term}`).not.toContain(term);
		}
		wrapper.unmount();
	});
});
