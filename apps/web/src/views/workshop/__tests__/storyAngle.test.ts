import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { nextTick } from "vue";
import { beforeEach, describe, expect, it } from "vitest";
import { resetSessionState, useSessionState } from "../../../composables/useSessionState";
import { STORY_ANGLES } from "../../../spec/storyAngles";
import WorkshopView from "../../WorkshopView.vue";

/**
 * THE ANGLE IN THE CONSOLE.
 *
 * Mounted through the real view rather than against a fabricated context, for the reason
 * panels.test.ts gives: the context carries 121 members and a hand-built fake is a fixture nobody
 * maintains. It also catches the failure mode a typecheck cannot — `<script setup>` registering
 * something the template then cannot resolve, which is a runtime-only error.
 */

beforeEach(() => resetSessionState());

const mountConsole = () =>
	mount(WorkshopView, {
		global: { plugins: [createPinia()], stubs: { "font-awesome-icon": true } },
		attachTo: document.body,
	});

const openBuild = async (wrapper: ReturnType<typeof mountConsole>) => {
	const button = wrapper.findAll("button").find((b) => b.text().trim() === "Build");
	expect(button, "no Build tab").toBeTruthy();
	await button?.trigger("click");
	await nextTick();
	await nextTick();
};

describe("the story angle control", () => {
	it("is on the Build tab, beside the theme", async () => {
		const wrapper = mountConsole();
		await openBuild(wrapper);

		const field = wrapper.find("#f-story-angle");
		expect(field.exists(), "no story angle field").toBe(true);
		expect(wrapper.text()).toContain("Story angle");
		wrapper.unmount();
	});

	it("offers every one of the 107 angles the generator uses", async () => {
		const wrapper = mountConsole();
		await openBuild(wrapper);

		const options = wrapper.findAll("#story-angle-options option");
		expect(options).toHaveLength(107);

		const values = options.map((o) => o.attributes("value"));
		expect(values).toEqual([...STORY_ANGLES]);
		wrapper.unmount();
	});

	it("names the category on each option, so the list is navigable", async () => {
		const wrapper = mountConsole();
		await openBuild(wrapper);

		const labels = new Set(wrapper.findAll("#story-angle-options option").map((o) => o.text()));
		expect(labels.has("Sport")).toBe(true);
		expect(labels.size).toBe(8);
		wrapper.unmount();
	});

	it("writes what is typed into the spec, not into the theme", async () => {
		const { spec } = useSessionState();
		const wrapper = mountConsole();
		await openBuild(wrapper);

		await wrapper.find("#f-story-angle").setValue("a by-election in a market town");

		expect(spec.value.storyAngle).toBe("a by-election in a market town");
		// The two are separate fields on purpose — they reach different agents.
		expect(spec.value.theme).toBe("");
		wrapper.unmount();
	});

	it("fills in a real angle on Surprise me", async () => {
		const { spec } = useSessionState();
		const wrapper = mountConsole();
		await openBuild(wrapper);

		const button = wrapper.findAll("button").find((b) => b.text().trim() === "Surprise me");
		expect(button, "no Surprise me button").toBeTruthy();
		await button?.trigger("click");

		expect(STORY_ANGLES).toContain(spec.value.storyAngle);
		wrapper.unmount();
	});

	it("can be cleared, and the clear only appears when there is something to clear", async () => {
		const { spec } = useSessionState();
		const wrapper = mountConsole();
		await openBuild(wrapper);

		expect(wrapper.findAll("button").some((b) => b.text().trim() === "Clear"), "Clear shown while empty").toBe(false);

		await wrapper.find("#f-story-angle").setValue("a travelling circus");
		await nextTick();

		const clear = wrapper.findAll("button").find((b) => b.text().trim() === "Clear");
		expect(clear, "no Clear button once an angle is set").toBeTruthy();
		await clear?.trigger("click");
		expect(spec.value.storyAngle).toBe("");
		wrapper.unmount();
	});
});

describe("the mechanism collision note", () => {
	/**
	 * The angle is appended to the theme, and the theme is read by SUBSTRING matchers that lock the
	 * murder device onto a family. The 107 listed angles are self-tested against those matchers by the
	 * generator; free text is not. The note exists so the coupling is visible — it is a note, never an
	 * error, because sometimes steering the mechanism is exactly what is wanted.
	 */
	it("says nothing for an angle that steers nothing", async () => {
		const wrapper = mountConsole();
		await openBuild(wrapper);
		await wrapper.find("#f-story-angle").setValue("a county cricket eleven and its ageing captain");
		await nextTick();

		expect(wrapper.text()).not.toContain("will steer the murder method");
		wrapper.unmount();
	});

	it("warns when free text would lock the mechanism", async () => {
		const wrapper = mountConsole();
		await openBuild(wrapper);
		await wrapper.find("#f-story-angle").setValue("a clockmaker's workshop in the old quarter");
		await nextTick();

		expect(wrapper.text()).toContain("steer the murder method toward a clock or timepiece");
		wrapper.unmount();
	});

	it("catches the substring trap, not just the whole word", async () => {
		// "championship" contains "ship"; this is the class of collision the generator self-tests for.
		const wrapper = mountConsole();
		await openBuild(wrapper);
		await wrapper.find("#f-story-angle").setValue("a poisonous rivalry between two rose growers");
		await nextTick();

		expect(wrapper.text()).toContain("steer the murder method toward poison");
		wrapper.unmount();
	});
});
