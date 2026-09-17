import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { nextTick } from "vue";
import { beforeEach, describe, expect, it } from "vitest";
import { auditA11y, formatFindings } from "../../../test-utils/a11y";
import { resetSessionState } from "../../../composables/useSessionState";
import WorkshopView from "../../WorkshopView.vue";

/**
 * UI-002 items 25 and 29, together.
 *
 * The console's panels are `v-if`'d, so mounting the view only ever exercised whichever tab happened
 * to be active — which is why the a11y sweep could reach one of six and why a panel could be broken
 * for weeks without a test noticing. These mount the console and visit each tab.
 *
 * They go through the real view rather than mounting a panel with a fabricated context: the context
 * carries 121 members, and a hand-built fake would be a fixture nobody maintains and every one of
 * this repo's "green mutation means the fixture is wrong" lessons applies.
 */

/**
 * Four tabs, not six. Project, Spec and Generate merged into **Build** — they are one linear
 * workflow (open a project, configure the spec, start a run) and splitting them across three tabs
 * meant hopping between them to do a single thing. UI-003 W4.
 */
const MAIN_TABS = ["Build", "Review", "Advanced", "Export"] as const;

/**
 * `mode` and `spec` are module singletons (B13), so they outlive a test. Without this reset the
 * advanced toggle stays on from the previous case and the "hides it until asked" test passes for
 * the wrong reason — or, as happened here, fails for the right one.
 */
beforeEach(() => resetSessionState());

const mountConsole = () =>
	mount(WorkshopView, {
		global: { plugins: [createPinia()], stubs: { "font-awesome-icon": true } },
		attachTo: document.body,
	});

/** Click a main tab by its label and let the panel render. */
const openTab = async (wrapper: ReturnType<typeof mountConsole>, label: string) => {
	const button = wrapper.findAll("button").find((b) => b.text().trim() === label);
	expect(button, `no tab button labelled "${label}"`).toBeTruthy();
	await button?.trigger("click");
	await nextTick();
	await nextTick();
};

describe("workshop panels — every tab renders", () => {
	it.each(MAIN_TABS)("%s", async (label) => {
		const wrapper = mountConsole();
		// Advanced is gated; turn it on so its panel is reachable at all.
		await openTab(wrapper, label);

		// A panel that threw would leave the section empty; a panel that resolved to nothing would
		// too. Either way this is the assertion that catches an extraction mistake.
		expect(wrapper.html().length).toBeGreaterThan(500);
		wrapper.unmount();
	});
});

describe("workshop panels — accessibility", () => {
	it.each(MAIN_TABS)("%s names its controls", async (label) => {
		const wrapper = mountConsole();
		await openTab(wrapper, label);

		const findings = auditA11y(wrapper.element as unknown as ParentNode, { requireHeading: false });
		const named = findings.filter((f) => f.rule === "label" || f.rule === "button-name");
		expect(named, `${label} panel:\n${formatFindings(named)}`).toEqual([]);
		wrapper.unmount();
	});

	it.each(MAIN_TABS)("%s gives data tables scoped headers", async (label) => {
		const wrapper = mountConsole();
		await openTab(wrapper, label);

		const findings = auditA11y(wrapper.element as unknown as ParentNode, { requireHeading: false });
		const tables = findings.filter((f) => f.rule === "table-header");
		expect(tables, `${label} panel:\n${formatFindings(tables)}`).toEqual([]);
		wrapper.unmount();
	});
});

describe("the console shell", () => {
	it("provides the state its panels inject", () => {
		// If the provide were dropped, useWorkshop() throws with a named message rather than a
		// cascade of "cannot read property of undefined" from inside a template.
		expect(() => mountConsole().unmount()).not.toThrow();
	});

	it("reaches the advanced tab group without a toggle", async () => {
		// UI-003 §3: the toggle gated a group from inside a screen that was itself gated on the same
		// flag, and turning it off stranded the user here (B15). Entering the console sets the mode.
		const wrapper = mountConsole();
		await openTab(wrapper, "Advanced");
		expect(wrapper.text()).toContain("CML Viewer");
		wrapper.unmount();
	});
});
