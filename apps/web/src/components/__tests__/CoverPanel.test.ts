import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import CoverPanel from "../CoverPanel.vue";
import CoverFigure from "../CoverFigure.vue";
import * as api from "../../services/api";

/**
 * documentation/covers/. The panel is the cover's CONTROLS (the case view owns the cover and shows it at the
 * top). Pinned: it never offers a button that cannot work, it sends the chosen style and reports the request.
 * The figure has three honest states: painting, art without its title, lettered.
 */

vi.mock("../../services/api", () => ({
	fetchCoverStyles: vi.fn(),
	requestCover: vi.fn(async () => {}),
	apiUrl: (p: string) => `http://api${p}`,
}));

const STYLES = [{ id: "deco-portrait", label: "Deco portrait", summary: "One stylised figure.", family: "A" }];

describe("CoverPanel", () => {
	afterEach(() => vi.clearAllMocks());

	it("disables the button and says why when no image model is configured", async () => {
		vi.mocked(api.fetchCoverStyles).mockResolvedValue({ styles: STYLES, image: null, imageError: "OPENAI_API_KEY is unset" });
		const w = mount(CoverPanel, { props: { projectId: "p1", hasStory: true, cover: null } });
		await flushPromises();
		expect(w.text()).toContain("OPENAI_API_KEY is unset");
		expect(w.find("button").attributes("disabled")).toBeDefined();
	});

	it("describes the current cover and offers a remake", async () => {
		vi.mocked(api.fetchCoverStyles).mockResolvedValue({ styles: STYLES, image: { provider: "openai", model: "gpt-image-2" }, imageError: null });
		const w = mount(CoverPanel, {
			props: {
				projectId: "p1",
				hasStory: true,
				cover: { inProgress: false, imageUrl: "/x.png", styles: ["deco-portrait"], framing: "birds-eye", palette: "teal", anchors: { clue_object: "a carriage clock" } },
			},
		});
		await flushPromises();
		expect(w.text()).toContain("birds-eye");
		expect(w.text()).toContain("a carriage clock");
		expect(w.text()).toContain("Make a new cover");
	});

	it("requests a cover in the chosen style and emits requested", async () => {
		vi.mocked(api.fetchCoverStyles).mockResolvedValue({ styles: STYLES, image: { provider: "openai", model: "gpt-image-2" }, imageError: null });
		const w = mount(CoverPanel, { props: { projectId: "p1", hasStory: true, cover: null } });
		await flushPromises();
		await w.find("select").setValue("deco-portrait");
		await w.find("button").trigger("click");
		await flushPromises();
		expect(api.requestCover).toHaveBeenCalledWith("p1", "deco-portrait");
		expect(w.emitted("requested")).toHaveLength(1);
	});
});

describe("CoverFigure", () => {
	it("painting: a placeholder, no image", () => {
		const w = mount(CoverFigure, { props: { cover: { inProgress: true, status: "painting" } } });
		expect(w.find("img").exists()).toBe(false);
		expect(w.text()).toContain("Painting the cover");
	});
	it("art before the title exists is shown, marked 'title to come'", () => {
		const w = mount(CoverFigure, { props: { cover: { inProgress: false, status: "art", lettered: false, imageUrl: "/c.png?v=1" } } });
		expect(w.find("img").attributes("src")).toBe("http://api/c.png?v=1");
		expect(w.text()).toContain("Title to come");
	});
	it("lettered: the image alone; the thumbnail never carries the caption", () => {
		const big = mount(CoverFigure, { props: { cover: { inProgress: false, status: "ready", lettered: true, imageUrl: "/c.png" }, title: "T" } });
		expect(big.text()).not.toContain("Title to come");
		expect(big.find("img").attributes("alt")).toBe("Cover of T");
		const sm = mount(CoverFigure, { props: { size: "sm", cover: { inProgress: false, status: "art", lettered: false, imageUrl: "/c.png" } } });
		expect(sm.text()).not.toContain("Title to come");
	});
});
