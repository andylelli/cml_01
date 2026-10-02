import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import CoverPanel from "../CoverPanel.vue";
import * as api from "../../services/api";

/**
 * documentation/covers/. The behaviours worth pinning: the panel never offers a button that cannot work
 * (no image model → disabled, with the reason), it shows a cover when there is one, and asking for one
 * sends the chosen style.
 */

vi.mock("../../services/api", () => ({
	fetchCoverStyles: vi.fn(),
	fetchCover: vi.fn(),
	requestCover: vi.fn(async () => {}),
	coverImageUrl: (id: string, v = "") => `/api/projects/${id}/cover.png?v=${v}`,
}));

const STYLES = [{ id: "deco-portrait", label: "Deco portrait", summary: "One stylised figure.", family: "A" }];

const mountPanel = () => mount(CoverPanel, { props: { projectId: "p1", hasStory: true } });

describe("CoverPanel", () => {
	afterEach(() => vi.clearAllMocks());

	it("disables the button and says why when no image model is configured", async () => {
		vi.mocked(api.fetchCoverStyles).mockResolvedValue({ styles: STYLES, image: null, imageError: "OPENAI_API_KEY is unset" });
		vi.mocked(api.fetchCover).mockResolvedValue(null);
		const w = mountPanel();
		await flushPromises();
		expect(w.text()).toContain("OPENAI_API_KEY is unset");
		expect(w.find("button").attributes("disabled")).toBeDefined();
	});

	it("shows the cover image when one exists", async () => {
		vi.mocked(api.fetchCoverStyles).mockResolvedValue({ styles: STYLES, image: { provider: "openai", model: "gpt-image-2" }, imageError: null });
		vi.mocked(api.fetchCover).mockResolvedValue({
			inProgress: false, path: "stories/x/cover.png", styles: ["deco-portrait"], palette: "teal", generatedAt: "t1",
			anchors: { clue_object: "a carriage clock" },
		});
		const w = mountPanel();
		await flushPromises();
		expect(w.find("img").attributes("src")).toBe("/api/projects/p1/cover.png?v=t1");
		expect(w.text()).toContain("a carriage clock");
		expect(w.text()).toContain("Make a new cover");
	});

	it("requests a cover in the chosen style and shows it painting", async () => {
		vi.mocked(api.fetchCoverStyles).mockResolvedValue({ styles: STYLES, image: { provider: "openai", model: "gpt-image-2" }, imageError: null });
		vi.mocked(api.fetchCover).mockResolvedValue(null);
		const w = mountPanel();
		await flushPromises();
		await w.find("select").setValue("deco-portrait");
		await w.find("button").trigger("click");
		await flushPromises();
		expect(api.requestCover).toHaveBeenCalledWith("p1", "deco-portrait");
		expect(w.text()).toContain("Painting the cover");
		w.unmount();
	});
});
