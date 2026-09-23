import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import CreateView from "../CreateView.vue";
import { defaultSpec, type MysterySpec } from "../../spec/vocabulary";

/**
 * These assert BEHAVIOUR and never class names. UI-002 §7: a test pinning `bg-[#B03A2E]` pins the
 * design, which is the thing being changed — it would have to be rewritten by every restyle and so
 * protects nothing.
 */

const mountView = (spec: Partial<MysterySpec> = {}) =>
	mount(CreateView, {
		props: { modelValue: { ...defaultSpec(), ...spec }, "onUpdate:modelValue": () => {} },
	});

const submitted = (wrapper: ReturnType<typeof mountView>): MysterySpec => {
	const events = wrapper.emitted("submit");
	expect(events, "no submit emitted").toBeTruthy();
	return (events as unknown[][])[0][0] as MysterySpec;
};

describe("CreateView", () => {
	it("renders all seven numbered steps", () => {
		const wrapper = mountView();
		const headings = wrapper.findAll("h2").map((h) => h.text());
		expect(headings).toHaveLength(7);
		// "The World" is the angle, and it is a step of its own rather than a field inside Extra
		// Details: it is the one lever against every mystery being the same country house, and it is
		// the field most easily confused with the theme, so the two are kept a step apart.
		for (const title of ["Era", "Setting", "Tone", "Characters", "The Crime", "The World", "Extra Details"]) {
			expect(headings.some((h) => h.includes(title)), `missing step: ${title}`).toBe(true);
		}
	});

	it("numbers each step for screen readers, not just visually", () => {
		// The tan circle is aria-hidden, so without this the steps have no order in the a11y tree.
		const wrapper = mountView();
		expect(wrapper.find("h2").text()).toMatch(/Step 1\./);
	});

	it("offers a humour control — the parameter no UI has ever sent", () => {
		// UI-002 B5. humourLevel is wired through the pipeline (A_92) and was never exposed, so every
		// run started from this app silently used the "classic" band.
		const wrapper = mountView();
		const humour = wrapper.findAll('input[name="humour"]');
		// A_103 B85: "auto" first - it is the default, and it is what lets the pipeline (or the axis flag) choose.
		expect(humour).toHaveLength(5);
		expect(humour.map((i) => i.attributes("value"))).toEqual(["auto", "none", "dry", "classic", "sharp"]);
	});

	it("renders option groups as real radio inputs, not clickable divs", () => {
		// UI-001 §5: arrow-key navigation and group semantics come free and correct from the
		// platform; a div with role=radio has to reimplement all of it.
		const wrapper = mountView();
		for (const name of ["era", "setting", "tone", "humour"]) {
			const inputs = wrapper.findAll(`input[type="radio"][name="${name}"]`);
			expect(inputs.length, `group ${name} is not radios`).toBeGreaterThan(1);
		}
	});

	it("shows the selected state by more than colour", () => {
		// WCAG 1.4.1. The board indicates selection by border colour alone.
		const wrapper = mountView({ decade: "1940s" });
		const checked = wrapper.find('input[name="era"][value="1940s"]');
		expect((checked.element as HTMLInputElement).checked).toBe(true);
		// The tile carrying the checked input also carries a marker element.
		const tile = checked.element.closest("label");
		expect(tile?.querySelector("svg")).toBeTruthy();
	});

	it("emits the spec with the composed theme, not the raw parts", async () => {
		const wrapper = mountView();
		await wrapper.find("form").trigger("submit");
		const spec = submitted(wrapper);
		// Nothing was chosen, so nothing is asserted about the story and the API's own default stands.
		expect(spec.theme).toBe("");
	});

	it("folds the flavour fields into theme", async () => {
		const wrapper = mountView();
		const selects = wrapper.findAll("select");
		// Step 5's first select is Motive.
		const motive = selects.find((s) =>
			s.findAll("option").some((o) => o.text() === "Jealousy"),
		);
		expect(motive, "motive select not found").toBeTruthy();
		await motive?.setValue("Jealousy");
		await wrapper.find("form").trigger("submit");

		expect(submitted(wrapper).theme).toContain("The motive turns on jealousy");
	});

	it("does not send 'Surprise me' as a story instruction", async () => {
		const wrapper = mountView();
		await wrapper.find("form").trigger("submit");
		expect(submitted(wrapper).theme.toLowerCase()).not.toContain("surprise");
	});

	it("parses cast names from a comma list and drops the gaps", async () => {
		const wrapper = mountView();
		await wrapper.find("#cast-names").setValue("Gerald Jardine,  Nora Gaunt ,, ");
		await wrapper.find("form").trigger("submit");
		expect(submitted(wrapper).castNames).toEqual(["Gerald Jardine", "Nora Gaunt"]);
	});

	it("warns when free text would steer the murder method", async () => {
		// The coupling is real and invisible: `theme` is read by a substring matcher that locks a
		// mechanism family. The user should not discover it by reading the book.
		const wrapper = mountView();
		await wrapper.find("#theme-text").setValue("a grandfather clock in the hall");
		expect(wrapper.text()).toContain("steer the murder method toward a clock");
	});

	it("says nothing about steering when there is nothing to say", async () => {
		const wrapper = mountView();
		await wrapper.find("#theme-text").setValue("an inheritance nobody wanted");
		expect(wrapper.text()).not.toContain("steer the murder method");
	});

	it("tells the user that Dark also changes the narrator", async () => {
		// server.ts:675 couples them. A hidden side effect on a paid run is not acceptable.
		const wrapper = mountView();
		expect(wrapper.text()).toContain("atmospheric");
	});

	it("does not submit while busy", async () => {
		const wrapper = mount(CreateView, {
			props: { modelValue: defaultSpec(), "onUpdate:modelValue": () => {}, busy: true },
		});
		await wrapper.find("form").trigger("submit");
		expect(wrapper.emitted("submit")).toBeFalsy();
	});

	it("does not submit while disabled", async () => {
		const wrapper = mount(CreateView, {
			props: { modelValue: defaultSpec(), "onUpdate:modelValue": () => {}, disabled: true },
		});
		await wrapper.find("form").trigger("submit");
		expect(wrapper.emitted("submit")).toBeFalsy();
	});

	it("keeps the stepper buttons out of the form's submit path", () => {
		// A bare <button> inside a <form> submits. "Add a suspect" starting a paid pipeline run is
		// exactly the class of bug this rebuild exists to remove.
		const wrapper = mountView();
		const bare = wrapper.findAll("form button").filter((b) => !b.attributes("type"));
		expect(bare).toHaveLength(0);
	});

	it("has exactly one submit button", () => {
		const wrapper = mountView();
		expect(wrapper.findAll('button[type="submit"]')).toHaveLength(1);
	});

	it("labels every select and text input", () => {
		const wrapper = mountView();
		for (const field of [...wrapper.findAll("select"), ...wrapper.findAll('input[type="text"]')]) {
			const id = field.attributes("id");
			expect(id, "field has no id, so no label can point at it").toBeTruthy();
			expect(
				wrapper.find(`label[for="${id}"]`).exists(),
				`no label for #${id}`,
			).toBe(true);
		}
	});
});
