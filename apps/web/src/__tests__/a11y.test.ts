import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it } from "vitest";
import { auditA11y, formatFindings } from "../test-utils/a11y";
import { defaultSpec } from "../spec/vocabulary";
import CaseView from "../views/CaseView.vue";
import CasesView from "../views/CasesView.vue";
import CreateView from "../views/CreateView.vue";
import InspirationView from "../views/InspirationView.vue";
import WorkshopView from "../views/WorkshopView.vue";

/**
 * UI-002 item 29, as a gate rather than an inspection.
 *
 * The Workshop cases were RED when this was written — three unlabelled fields and no heading element
 * anywhere in the view — which is the only reason to trust the rule. A checker written after the
 * fixes proves it agrees with the fixes.
 */

const audit = (html: ParentNode, label: string, opts = {}) => {
	const findings = auditA11y(html, opts);
	expect(findings, `${label}\n${formatFindings(findings)}`).toEqual([]);
};

/**
 * `any` on the component, deliberately: this helper mounts four components with incompatible prop
 * types, and the alternative — `as never` — types `props` as `undefined` and fails the typecheck.
 * The props are checked by each caller's own view test; here only the rendered DOM matters.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mountIn = (component: any, props: Record<string, unknown> = {}) =>
	mount(component, {
		props,
		global: { plugins: [createPinia()], stubs: { "font-awesome-icon": true } },
		attachTo: document.body,
	});

describe("accessibility — the consumer views", () => {
	it("CreateView names every control and carries headings", () => {
		const wrapper = mountIn(CreateView, {
			modelValue: defaultSpec(),
			"onUpdate:modelValue": () => {},
		});
		audit(wrapper.element as unknown as ParentNode, "CreateView");
		wrapper.unmount();
	});

	it("InspirationView", () => {
		const wrapper = mountIn(InspirationView);
		audit(wrapper.element as unknown as ParentNode, "InspirationView");
		wrapper.unmount();
	});

	it("CasesView", () => {
		const wrapper = mountIn(CasesView, { activeProjectId: null });
		audit(wrapper.element as unknown as ParentNode, "CasesView");
		wrapper.unmount();
	});

	it("CaseView", () => {
		const wrapper = mountIn(CaseView, { projectId: "proj_test", projectName: "A Test Case" });
		audit(wrapper.element as unknown as ParentNode, "CaseView");
		wrapper.unmount();
	});
});

describe("accessibility — the operator console", () => {
	it("names every field on the default tab", () => {
		// Was RED: the project-name input, the load-by-id input and the project select all relied on
		// nearby text that was not a <label for>.
		const wrapper = mountIn(WorkshopView);
		const findings = auditA11y(wrapper.element as unknown as ParentNode, { requireHeading: false });
		const labels = findings.filter((f) => f.rule === "label");
		expect(labels, `unlabelled fields:\n${formatFindings(labels)}`).toEqual([]);
		wrapper.unmount();
	});

	it("carries a heading so the view has structure", () => {
		// Was RED: the console had no h1-h6 anywhere. "WORKSHOP" was a styled div.
		const wrapper = mountIn(WorkshopView);
		const headings = (wrapper.element as unknown as ParentNode).querySelectorAll("h1,h2,h3,h4,h5,h6");
		expect(headings.length).toBeGreaterThan(0);
		wrapper.unmount();
	});

	it("gives every icon-only button a name", () => {
		const wrapper = mountIn(WorkshopView);
		const findings = auditA11y(wrapper.element as unknown as ParentNode, { requireHeading: false });
		const unnamed = findings.filter((f) => f.rule === "button-name");
		expect(unnamed, `unnamed buttons:\n${formatFindings(unnamed)}`).toEqual([]);
		wrapper.unmount();
	});
});

describe("the auditor itself", () => {
	// A checker that has never reported anything is a claim about the checker.
	const fragment = (html: string): ParentNode => {
		const host = document.createElement("div");
		host.innerHTML = html;
		return host;
	};

	it("reports an unlabelled field", () => {
		const findings = auditA11y(fragment("<h1>x</h1><input type='text'>"));
		expect(findings.map((f) => f.rule)).toContain("label");
	});

	it("accepts each of the four naming routes", () => {
		for (const html of [
			"<h1>x</h1><label for='a'>Name</label><input id='a'>",
			"<h1>x</h1><input aria-label='Name'>",
			"<h1>x</h1><span id='l'>Name</span><input aria-labelledby='l'>",
			"<h1>x</h1><label>Name<input></label>",
		]) {
			expect(auditA11y(fragment(html)), html).toEqual([]);
		}
	});

	it("reports an icon-only button but not a labelled one", () => {
		expect(auditA11y(fragment("<h1>x</h1><button><svg/></button>")).map((f) => f.rule)).toContain(
			"button-name",
		);
		expect(auditA11y(fragment("<h1>x</h1><button aria-label='Close'><svg/></button>"))).toEqual([]);
	});

	it("reports a view with no heading", () => {
		expect(auditA11y(fragment("<p>hello</p>")).map((f) => f.rule)).toContain("heading");
		expect(auditA11y(fragment("<p>hello</p>"), { requireHeading: false })).toEqual([]);
	});

	it("reports a table whose headers have no scope", () => {
		expect(
			auditA11y(fragment("<h1>x</h1><table><tr><th>A</th></tr></table>")).map((f) => f.rule),
		).toContain("table-header");
		expect(
			auditA11y(fragment("<h1>x</h1><table><tr><th scope='col'>A</th></tr></table>")),
		).toEqual([]);
	});

	it("ignores hidden inputs", () => {
		expect(auditA11y(fragment("<h1>x</h1><input type='hidden'>"))).toEqual([]);
	});
});
