/**
 * A SMALL ACCESSIBILITY AUDITOR, so item 29 is an instrument rather than an afternoon of looking.
 *
 * It checks four things that are (a) mechanically decidable, (b) genuinely broken in this app when
 * they are broken, and (c) cheap. It is deliberately NOT a WCAG suite: a checker that reports forty
 * advisory findings gets muted, and a muted checker is worse than none.
 *
 * What it does NOT check, and why:
 *   - contrast — needs computed styles, and happy-dom is not a browser (it silently drops `var()`
 *     with a fallback on a standard property). Contrast is measured in the browser instead.
 *   - focus order — needs layout.
 *   - anything requiring a real accessibility tree.
 */

export interface A11yFinding {
	rule: "label" | "button-name" | "heading" | "table-header";
	detail: string;
}

const attr = (el: Element, name: string): string => el.getAttribute(name)?.trim() ?? "";

/** Does this control have an accessible name by any of the supported routes? */
export const hasAccessibleName = (el: Element, root: ParentNode): boolean => {
	if (attr(el, "aria-label")) return true;
	if (attr(el, "aria-labelledby")) return true;
	if (attr(el, "title")) return true;

	const id = el.getAttribute("id");
	if (id) {
		// `CSS.escape` is not in happy-dom's older builds; ids here are author-controlled, so a
		// straight attribute match is both sufficient and safe.
		const labels = Array.from(root.querySelectorAll("label[for]"));
		if (labels.some((l) => l.getAttribute("for") === id)) return true;
	}

	return el.closest?.("label") !== null && el.closest?.("label") !== undefined;
};

const describe = (el: Element): string => {
	const id = el.getAttribute("id");
	const placeholder = attr(el, "placeholder");
	const type = attr(el, "type");
	const bits = [id ? `#${id}` : "", placeholder ? `"${placeholder}"` : "", type].filter(Boolean);
	return `${el.tagName.toLowerCase()}${bits.length ? ` (${bits.join(" ")})` : ""}`;
};

export interface AuditOptions {
	/** Skip the heading rule for a fragment that legitimately has none (a bare control, say). */
	requireHeading?: boolean;
}

/**
 * Returns every finding. An empty array is a pass; the array itself is the failure message, which is
 * why findings carry a `detail` naming the element rather than just a count.
 */
export const auditA11y = (root: ParentNode, options: AuditOptions = {}): A11yFinding[] => {
	const findings: A11yFinding[] = [];

	// 1 — every control the user types into or chooses from has a name.
	for (const field of Array.from(root.querySelectorAll("input, select, textarea"))) {
		const type = attr(field, "type");
		// Hidden inputs and the radio inputs inside a wrapping <label> are named by their wrapper.
		if (type === "hidden") continue;
		if (!hasAccessibleName(field, root)) {
			findings.push({ rule: "label", detail: describe(field) });
		}
	}

	// 2 — a button whose content is an icon needs a name of its own.
	for (const button of Array.from(root.querySelectorAll("button"))) {
		const text = (button.textContent ?? "").trim();
		if (text.length > 0) continue;
		if (!hasAccessibleName(button, root)) {
			findings.push({ rule: "button-name", detail: (button.outerHTML ?? "").slice(0, 80) });
		}
	}

	// 3 — a view with no heading has no structure to navigate by.
	if (options.requireHeading !== false) {
		const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
		if (headings.length === 0) {
			findings.push({ rule: "heading", detail: "no heading element anywhere in this view" });
		}
	}

	// 4 — a data table needs header cells, and they need a scope.
	for (const table of Array.from(root.querySelectorAll("table"))) {
		const headers = Array.from(table.querySelectorAll("th"));
		if (headers.length === 0) {
			findings.push({ rule: "table-header", detail: "table with no <th>" });
			continue;
		}
		const unscoped = headers.filter((th) => !attr(th, "scope"));
		if (unscoped.length > 0) {
			findings.push({
				rule: "table-header",
				detail: `${unscoped.length} of ${headers.length} <th> without scope`,
			});
		}
	}

	return findings;
};

/** Formats findings for an assertion message that names what to fix. */
export const formatFindings = (findings: A11yFinding[]): string =>
	findings.map((f) => `  [${f.rule}] ${f.detail}`).join("\n");
