import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { describe, expect, it } from "vitest";
import CreateView from "../CreateView.vue";
import { defaultSpec, type MysterySpec } from "../../spec/vocabulary";
import { STORY_ANGLES } from "../../spec/storyAngles";

/**
 * THE ANGLE ON THE CREATE PAGE.
 *
 * It is a step of its own — "The World" — rather than another field in Extra Details, because it is
 * the field most easily mistaken for the theme. The theme is the CRIME; the angle is the WORLD the
 * crime happens in. They are not alternatives: a story has both, and they do not even reach the same
 * agents.
 *
 * The consequence tested hardest below is the one a reader cannot see: the angle must be emitted as
 * its OWN field and must NOT be folded into `theme`. The API appends it to the theme itself
 * (`composeThemeWithAngle`), so composing it here as well would send it twice.
 */

const mountView = (spec: MysterySpec = defaultSpec()) => {
	const model = ref(spec);
	return mount(CreateView, {
		props: { modelValue: model.value, "onUpdate:modelValue": (v: MysterySpec) => (model.value = v) },
		global: { stubs: { "font-awesome-icon": true } },
	});
};

const submitted = (wrapper: ReturnType<typeof mountView>): MysterySpec => {
	const events = wrapper.emitted("submit");
	expect(events, "nothing was submitted").toBeTruthy();
	return (events as unknown[][])[0][0] as MysterySpec;
};

describe("the angle is on the Create page", () => {
	it("has its own step, named so the difference is legible", () => {
		const wrapper = mountView();
		const headings = wrapper.findAll("h2").map((h) => h.text());
		expect(headings.some((h) => h.includes("The World")), "no World step").toBe(true);
		expect(wrapper.find("#story-angle").exists()).toBe(true);
	});

	it("explains what an angle is, and what it is not", () => {
		const text = mountView().text();
		expect(text).toContain("the world it happens in");
		expect(text).toContain("It is never the murder method.");
	});

	it("names the theme and points at the difference, instead of calling it 'Anything else'", () => {
		const wrapper = mountView();
		const text = wrapper.text();
		expect(text).toContain("The theme");
		expect(text).toContain("Not to be confused with the story angle");
		expect(text, "the old unnamed label is still there").not.toContain("Anything else");
	});

	it("offers all 107 angles, and takes free text too", async () => {
		const wrapper = mountView();
		const options = wrapper.findAll("#create-angle-options option");
		expect(options.map((o) => o.attributes("value"))).toEqual([...STORY_ANGLES]);

		// A datalist input accepts anything, which is what `run-params.mjs --angle "<text>"` does.
		await wrapper.find("#story-angle").setValue("a lighthouse relief crew");
		await wrapper.find("form").trigger("submit");
		expect(submitted(wrapper).storyAngle).toBe("a lighthouse relief crew");
	});

	it("fills a real angle on Surprise me", async () => {
		const wrapper = mountView();
		const button = wrapper.findAll("button").find((b) => b.text().trim() === "Surprise me");
		expect(button, "no Surprise me").toBeTruthy();
		await button?.trigger("click");
		await nextTick();

		expect(STORY_ANGLES).toContain((wrapper.find("#story-angle").element as HTMLInputElement).value);
	});
});

describe("the angle is sent as its own field, never folded into the theme", () => {
	/**
	 * THE DOUBLE-SEND TRAP. `onSubmit` replaces `theme` with `composedTheme` — the flavour fields
	 * folded into one string. If the angle were folded in there too it would arrive twice, because
	 * the API appends it as well. These pin that it is not.
	 */
	it("emits storyAngle separately and leaves the theme text alone", async () => {
		const wrapper = mountView();
		await wrapper.find("#story-angle").setValue("a by-election in a market town");
		await wrapper.find("#theme-text").setValue("A locked study");
		await wrapper.find("form").trigger("submit");

		const spec = submitted(wrapper);
		expect(spec.storyAngle).toBe("a by-election in a market town");
		expect(spec.theme).toContain("A locked study");
		expect(spec.theme, "the angle was folded into the theme; the API will send it twice")
			.not.toContain("by-election");
	});

	it("carries an angle even when nothing else was filled in", async () => {
		const wrapper = mountView();
		await wrapper.find("#story-angle").setValue("a travelling circus");
		await wrapper.find("form").trigger("submit");
		expect(submitted(wrapper).storyAngle).toBe("a travelling circus");
	});

	it("sends an empty angle when the reader chose none", async () => {
		const wrapper = mountView();
		await wrapper.find("form").trigger("submit");
		expect(submitted(wrapper).storyAngle).toBe("");
	});
});

describe("the preview tells the truth about both", () => {
	const openPreview = async (wrapper: ReturnType<typeof mountView>) => {
		const toggle = wrapper.findAll("button").find((b) => b.text().includes("What we'll ask for"));
		expect(toggle, "no preview disclosure").toBeTruthy();
		await toggle?.trigger("click");
		await nextTick();
	};

	it("shows the angle as its own line, not glued onto the theme text", async () => {
		const wrapper = mountView();
		await wrapper.find("#story-angle").setValue("a cathedral restoration");
		await nextTick();
		await openPreview(wrapper);

		expect(wrapper.text()).toContain("a cathedral restoration");
		expect(wrapper.text()).toContain("Goes to the setting and cast directly");
	});

	it("opens for an angle alone, when there is no theme to preview", async () => {
		const wrapper = mountView();
		await wrapper.find("#story-angle").setValue("a rowing regatta and the crew's coach");
		await nextTick();
		expect(
			wrapper.findAll("button").some((b) => b.text().includes("What we'll ask for")),
			"the preview stayed hidden, so the angle was invisible",
		).toBe(true);
	});
});

describe("the mechanism collision note, on the angle too", () => {
	it("warns when free text would lock the murder method", async () => {
		const wrapper = mountView();
		await wrapper.find("#story-angle").setValue("a clockmaker's workshop in the old quarter");
		await nextTick();
		expect(wrapper.text()).toContain("steer the murder method toward a clock or timepiece");
	});

	it("says nothing for a listed angle, which the generator has self-tested", async () => {
		const wrapper = mountView();
		await wrapper.find("#story-angle").setValue("a county cricket eleven and its ageing captain");
		await nextTick();
		expect(wrapper.text()).not.toContain("steer the murder method");
	});
});
