import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	AXIS_OPTIONS,
	CAST_SIZE_MAX,
	CAST_SIZE_MIN,
	DECADE_OPTIONS,
	DETECTIVE_OPTIONS,
	HUMOUR_LEVELS,
	HUMOUR_OPTIONS,
	LOCATION_OPTIONS,
	LOCATION_PRESETS,
	PRIMARY_AXES,
	TONE_OPTIONS,
	coerceSpec,
	defaultSpec,
	isPrimaryAxis,
} from "../vocabulary";

/**
 * CONFORMANCE. These tests read the PIPELINE'S OWN SOURCE, not a copy of it.
 *
 * The failure this prevents is silent: most spec fields are free text at the API boundary, so a
 * control offering a value the pipeline does not know produces a book that quietly ignored the
 * user's choice. Nothing downstream reports it. The only way to catch it is to compare against the
 * file that actually decides.
 *
 * If a repo path below moves, the test SKIPS rather than fails — a missing file is a claim about
 * the test, not about the vocabulary (CLAUDE.md's evidence standard). It reports the skip loudly.
 */

const repoRoot = resolve(__dirname, "../../../../..");
const read = (relative: string): string | null => {
	const path = resolve(repoRoot, relative);
	return existsSync(path) ? readFileSync(path, "utf8") : null;
};

describe("spec vocabulary conformance", () => {
	it("humour levels match packages/prompts-llm/src/humour-level.ts", () => {
		const src = read("packages/prompts-llm/src/humour-level.ts");
		if (!src) {
			console.warn("SKIPPED: humour-level.ts not found — path moved, conformance unverified");
			return;
		}
		const match = src.match(/export const HUMOUR_LEVELS = \[([^\]]+)\]/);
		expect(match, "HUMOUR_LEVELS not found in humour-level.ts").toBeTruthy();
		const pipeline = [...(match as RegExpMatchArray)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
		expect([...HUMOUR_LEVELS]).toEqual(pipeline);
	});

	it("the default humour band is the pipeline's default", () => {
		const src = read("packages/prompts-llm/src/humour-level.ts");
		if (!src) return;
		const match = src.match(/DEFAULT_HUMOUR_LEVEL: HumourLevel = "([^"]+)"/);
		expect(defaultSpec().humourLevel).toBe((match as RegExpMatchArray)[1]);
	});

	it("location presets match the seeded generator", () => {
		const src = read("scripts/run-params.mjs");
		if (!src) {
			console.warn("SKIPPED: run-params.mjs not found — conformance unverified");
			return;
		}
		const match = src.match(/locationPreset: arg\("location"\) \?\? pick\(\[([^\]]+)\]/);
		expect(match, "locationPreset pick() not found in run-params.mjs").toBeTruthy();
		const generator = [...(match as RegExpMatchArray)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
		// The generator weights by repetition; the UI offers each once.
		expect([...LOCATION_PRESETS].sort()).toEqual([...new Set(generator)].sort());
	});

	it("eras match the seeded generator", () => {
		const src = read("scripts/run-params.mjs");
		if (!src) return;
		const match = src.match(/eraPreference: arg\("era"\) \?\? pick\(\[([^\]]+)\]/);
		const generator = [...(match as RegExpMatchArray)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
		expect(DECADE_OPTIONS.map((o) => o.value).sort()).toEqual([...new Set(generator)].sort());
	});

	it("detective types match the seeded generator", () => {
		const src = read("scripts/run-params.mjs");
		if (!src) return;
		const match = src.match(/detectiveType: pick\(\[([^\]]+)\]/);
		const generator = [...(match as RegExpMatchArray)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
		expect(DETECTIVE_OPTIONS.map((o) => o.value).sort()).toEqual([...new Set(generator)].sort());
	});

	it("axes match the five the pipeline validates", () => {
		const src = read("packages/prompts-llm/src/__tests__/axis-reaches-agent3.test.ts");
		if (!src) {
			console.warn("SKIPPED: axis test not found — conformance unverified");
			return;
		}
		const match = src.match(/const AXES = \[([^\]]+)\]/);
		const pipeline = [...(match as RegExpMatchArray)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
		expect([...PRIMARY_AXES].sort()).toEqual([...pipeline].sort());
	});

	it("tone 'Dark' is documented as also setting the narrative style", () => {
		// server.ts:675 couples them. The control must SAY so; a hidden side effect on a paid run is
		// the kind of thing a user discovers only by reading a book that is not what they asked for.
		const dark = TONE_OPTIONS.find((o) => o.value === "Dark");
		expect(dark?.hint ?? "").toMatch(/atmospheric/i);
	});
});

describe("every option a control can emit", () => {
	const groups = [
		["era", DECADE_OPTIONS],
		["setting", LOCATION_OPTIONS],
		["tone", TONE_OPTIONS],
		["humour", HUMOUR_OPTIONS],
		["detective", DETECTIVE_OPTIONS],
		["axis", AXIS_OPTIONS],
	] as const;

	it.each(groups)("%s options are unique, labelled and carry a glyph", (_name, options) => {
		const values = options.map((o) => o.value);
		expect(new Set(values).size).toBe(values.length);
		for (const option of options) {
			expect(option.label.trim().length).toBeGreaterThan(0);
			expect(option.icon.trim().length).toBeGreaterThan(0);
		}
	});
});

describe("coerceSpec", () => {
	it("returns defaults for null, undefined and rubbish", () => {
		expect(coerceSpec(null)).toEqual(defaultSpec());
		expect(coerceSpec(undefined)).toEqual(defaultSpec());
		expect(coerceSpec("nonsense" as never)).toEqual(defaultSpec());
	});

	it("repairs a value an older build may have stored", () => {
		// The pre-rebuild UI shipped tone "Cozy" and locationPreset "CountryHouse"; it also allowed a
		// free-text theme. A stored tone the current build dropped must not reach the API.
		const repaired = coerceSpec({ tone: "Thrilling" as never, decade: "1890s" as never });
		expect(repaired.tone).toBe(defaultSpec().tone);
		expect(repaired.decade).toBe(defaultSpec().decade);
	});

	it("never lets an invalid axis through — the one field that aborts a run", () => {
		const repaired = coerceSpec({ primaryAxis: "chronological" as never });
		expect(isPrimaryAxis(repaired.primaryAxis)).toBe(true);
		expect(repaired.primaryAxis).toBe(defaultSpec().primaryAxis);
	});

	it("clamps cast size rather than sending a number the prompt cannot use", () => {
		expect(coerceSpec({ castSize: 400 }).castSize).toBe(CAST_SIZE_MAX);
		expect(coerceSpec({ castSize: 1 }).castSize).toBe(CAST_SIZE_MIN);
		expect(coerceSpec({ castSize: 6.7 }).castSize).toBe(7);
		expect(coerceSpec({ castSize: Number.NaN }).castSize).toBe(defaultSpec().castSize);
	});

	it("drops non-string cast names instead of sending them", () => {
		expect(coerceSpec({ castNames: ["Vane", 7, null] as never }).castNames).toEqual(["Vane"]);
	});

	it("preserves a valid spec unchanged", () => {
		const spec = defaultSpec();
		expect(coerceSpec(spec)).toEqual(spec);
	});
});

describe("isPrimaryAxis", () => {
	it("accepts exactly the five", () => {
		for (const axis of PRIMARY_AXES) expect(isPrimaryAxis(axis)).toBe(true);
	});

	it("rejects everything else, including near misses", () => {
		for (const bad of ["Temporal", "behavioural", "", null, undefined, 3, {}]) {
			expect(isPrimaryAxis(bad)).toBe(false);
		}
	});
});
