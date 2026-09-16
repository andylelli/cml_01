import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { brand } from "../brand";

/**
 * tokens.css and tailwind.config.cjs carry the same hexes for different consumers (utilities vs
 * `var()`). That duplication is deliberate and documented, so it needs a guard: this test fails the
 * moment one is edited without the other, which is the only way the duplication stays safe.
 */

const root = resolve(__dirname, "../../..");
const css = readFileSync(resolve(root, "src/design/tokens.css"), "utf8");
// tailwind.config.cjs is CommonJS and this package is ESM — createRequire is the supported bridge.
const tw = createRequire(import.meta.url)(resolve(root, "tailwind.config.cjs")) as {
	theme: { extend: { colors: Record<string, string | Record<string, string>> } };
};

/** Pull `--name: #hex;` pairs out of the `:root` block. */
const cssVars = (): Record<string, string> => {
	const rootBlock = css.slice(css.indexOf(":root"), css.indexOf("\n}"));
	const out: Record<string, string> = {};
	for (const m of rootBlock.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{3,8})\s*;/gi)) {
		out[m[1]] = m[2].toLowerCase();
	}
	return out;
};

/** Flatten Tailwind's nested colour object to the same `name` / `name-key` shape as the CSS vars. */
const twColours = (): Record<string, string> => {
	const out: Record<string, string> = {};
	for (const [name, value] of Object.entries(tw.theme.extend.colors)) {
		if (typeof value === "string") {
			out[name] = value.toLowerCase();
			continue;
		}
		for (const [key, hex] of Object.entries(value)) {
			out[key === "DEFAULT" ? name : `${name}-${key}`] = hex.toLowerCase();
		}
	}
	return out;
};

describe("design tokens", () => {
	const vars = cssVars();
	const colours = twColours();

	it("defines every token the design system names", () => {
		// UI-001 §2.1. If a token is dropped, components silently fall back to `inherit`.
		const required = [
			"ground",
			"ground-warm",
			"surface",
			"surface-sunken",
			"frame",
			"frame-deep",
			"frame-tint",
			"accent",
			"accent-hover",
			"accent-wash",
			"badge",
			"badge-ink",
			"ink",
			"ink-soft",
			"ink-faint",
			"line",
			"line-strong",
			"danger",
			"ok",
			"warn",
		];
		for (const token of required) {
			expect(vars[token], `--${token} missing from tokens.css`).toMatch(/^#[0-9a-f]{6}$/);
		}
	});

	it("keeps tokens.css and tailwind.config.cjs in step", () => {
		const drifted: string[] = [];
		for (const [name, hex] of Object.entries(colours)) {
			// `on-frame*` are frame-context aliases of existing values, not separate tokens.
			if (name.startsWith("on-frame")) continue;
			if (vars[name] && vars[name] !== hex) drifted.push(`${name}: css ${vars[name]} vs tailwind ${hex}`);
		}
		expect(drifted).toEqual([]);
	});

	it("keeps --danger distinct from --accent", () => {
		// UI-001 §1: red means the primary action and nothing else. An error that borrows the accent
		// reads as a button, which is precisely the confusion the two-hue rule exists to prevent.
		expect(vars.danger).not.toEqual(vars.accent);
	});

	it("splits the wordmark into lines that rebuild the name", () => {
		expect(brand.nameLines.join(" ")).toBe(brand.name);
	});
});
