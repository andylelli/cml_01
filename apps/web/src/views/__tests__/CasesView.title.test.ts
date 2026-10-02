import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import CasesView from "../CasesView.vue";

/**
 * A project is named from the spec when it is created ("1930s · SeasideHotel"); the story's title
 * arrives later, in the synopsis. The list showed the spec label for every finished story.
 */
vi.mock("../../services/api", () => ({
	fetchProjects: vi.fn(async () => [
		{ id: "p1", name: "1930s · SeasideHotel", status: "idle", title: "The Shadow on the Lighthouse" },
		{ id: "p2", name: "1940s · CountryHouse", status: "running", title: null },
	]),
	fetchNarrationLibrary: vi.fn(async () => ({ narrations: [] })),
	downloadStoryPdf: vi.fn(async () => new Blob()),
	narrationDownloadUrl: vi.fn(() => ""),
}));

describe("My Cases", () => {
	it("names a finished case by its story title, keeping the spec label beside it", async () => {
		const wrapper = mount(CasesView, {
			props: { activeProjectId: null },
			global: { stubs: { "font-awesome-icon": true } },
		});
		await new Promise((r) => setTimeout(r, 0));
		const rows = wrapper.findAll("li");
		expect(rows[0].find(".font-semibold").text()).toBe("The Shadow on the Lighthouse");
		expect(rows[0].text()).toContain("1930s · SeasideHotel");
		// No title yet: the spec label is the name.
		expect(rows[1].find(".font-semibold").text()).toBe("1940s · CountryHouse");
		wrapper.unmount();
	});
});
