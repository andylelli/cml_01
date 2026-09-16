import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CaseView from "../CaseView.vue";
import { useProjectStore } from "../../stores/projectStore";

/**
 * The spoiler rule is the behaviour worth pinning here: a dossier that opens with the culprit's
 * motive is an answer sheet. Everything else in this view is a rendering of store data.
 */

vi.mock("../../services/api", () => ({
	fetchProjectStatus: vi.fn(async () => ({ projectId: "p1", status: "idle" })),
	downloadStoryPdf: vi.fn(async () => new Blob()),
}));

const PROFILES = {
	status: "ok",
	profiles: [
		{
			name: "Inspector Evelyn Harcourt",
			summary: "A methodical detective.",
			publicPersona: "Professional poise.",
			privateSecret: "SECRET-SHE-IS-HIDING",
			motiveSeed: "MOTIVE-FOR-THE-KILLING",
			alibiWindow: "ALIBI-BETWEEN-NINE-AND-TEN",
			speechMannerisms: "Clipped.",
			paragraphs: [],
		},
	],
};

const mountCase = () =>
	mount(CaseView, {
		props: { projectId: "p1", projectName: "A Test Case" },
		global: { stubs: { "font-awesome-icon": true } },
	});

describe("CaseView — the spoiler rule", () => {
	beforeEach(() => {
		const pinia = createPinia();
		setActivePinia(pinia);
		localStorage.clear();
		const store = useProjectStore();
		// Stub the loaders: this test is about what is RENDERED, not about fetching. Cast because
		// `loadArtifacts` resolves a LoadSummary the view never reads — the typecheck gate is right
		// to ask, and a fabricated summary would be a fixture nobody maintains.
		store.loadRunEvents = vi.fn(async () => {}) as never;
		store.loadArtifacts = vi.fn(async () => {}) as never;
		store.characterProfilesData = PROFILES as never;
		store.cluesData = {
			summary: "The clue summary",
			items: [{ id: "c1", category: "physical", text: "A CLUE", pointsTo: "x", redHerring: false }],
		} as never;
	});

	afterEach(() => vi.clearAllMocks());

	it("shows the public half of a profile", async () => {
		const wrapper = mountCase();
		await new Promise((r) => setTimeout(r, 0));
		expect(wrapper.text()).toContain("Inspector Evelyn Harcourt");
		expect(wrapper.text()).toContain("Professional poise.");
		wrapper.unmount();
	});

	it("hides motive, secret and alibi by default", async () => {
		const wrapper = mountCase();
		await new Promise((r) => setTimeout(r, 0));
		const text = wrapper.text();
		expect(text).not.toContain("SECRET-SHE-IS-HIDING");
		expect(text).not.toContain("MOTIVE-FOR-THE-KILLING");
		expect(text).not.toContain("ALIBI-BETWEEN-NINE-AND-TEN");
		wrapper.unmount();
	});

	it("hides the clue list by default", async () => {
		const wrapper = mountCase();
		await new Promise((r) => setTimeout(r, 0));
		expect(wrapper.text()).not.toContain("A CLUE");
		wrapper.unmount();
	});

	it("reveals all of it when asked, and only then", async () => {
		const wrapper = mountCase();
		await new Promise((r) => setTimeout(r, 0));

		const toggle = wrapper.findAll("button").find((b) => b.text().includes("Show me the solution"));
		expect(toggle, "no spoiler toggle").toBeTruthy();
		await toggle?.trigger("click");

		const text = wrapper.text();
		expect(text).toContain("SECRET-SHE-IS-HIDING");
		expect(text).toContain("MOTIVE-FOR-THE-KILLING");
		expect(text).toContain("ALIBI-BETWEEN-NINE-AND-TEN");
		expect(text).toContain("A CLUE");
		wrapper.unmount();
	});

	it("remembers the choice per case, not globally", async () => {
		const wrapper = mountCase();
		await new Promise((r) => setTimeout(r, 0));
		await wrapper.findAll("button").find((b) => b.text().includes("Show me the solution"))?.trigger("click");

		expect(localStorage.getItem("cml_spoilers_p1")).toBe("1");
		// A different case must not inherit it.
		expect(localStorage.getItem("cml_spoilers_p2")).toBeNull();
		wrapper.unmount();
	});

	it("survives storage being unavailable", async () => {
		vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new DOMException("QuotaExceededError");
		});
		const wrapper = mountCase();
		await new Promise((r) => setTimeout(r, 0));
		const toggle = wrapper.findAll("button").find((b) => b.text().includes("Show me the solution"));
		expect(() => toggle?.trigger("click")).not.toThrow();
		wrapper.unmount();
		vi.restoreAllMocks();
	});
});
