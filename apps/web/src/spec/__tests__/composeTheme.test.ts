import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	MECHANISM_FAMILY_KEYWORDS,
	composeTheme,
	detectMechanismFamilies,
	mechanismNote,
} from "../composeTheme";

describe("composeTheme", () => {
	it("returns empty when nothing is supplied, so the API's own default stands", () => {
		// server.ts:678 substitutes "A classic murder mystery". Sending our own copy of that default
		// would give two places to change it and one of them would eventually be missed.
		expect(composeTheme({})).toBe("");
		expect(composeTheme({ theme: "   " })).toBe("");
	});

	it("leads with the user's own theme text", () => {
		expect(composeTheme({ theme: "An inheritance nobody wanted" })).toBe(
			"An inheritance nobody wanted.",
		);
	});

	it("does not double a full stop the user already typed", () => {
		expect(composeTheme({ theme: "A death at the fête." })).toBe("A death at the fête.");
	});

	it("labels each part so the agents cannot confuse a motive with a mechanism", () => {
		const theme = composeTheme({ keyTheme: "Jealousy", victimProfile: "A wealthy patriarch" });
		expect(theme).toContain("The motive turns on jealousy");
		expect(theme).toContain("The victim is a wealthy patriarch");
	});

	it("treats 'Surprise me' and its neighbours as no preference", () => {
		// These are literal option labels on board 1. If they leaked into the string the pipeline
		// would faithfully write a story about being surprised.
		for (const abstain of ["Surprise me", "surprise me", "Let fate decide", "None", "any"]) {
			expect(composeTheme({ method: abstain })).toBe("");
		}
	});

	it("asks for a twist as an operation, not as an adjective", () => {
		// CLAUDE.md: this model complies with OPERATIONS and ignores STATISTICS. "Make it twisty" is
		// the shape that does nothing; "something believed in the first half must mean something
		// else" is a countable thing done.
		const theme = composeTheme({ wantsTwist: true });
		expect(theme).toMatch(/first half/i);
		expect(theme).toMatch(/without contradicting/i);
	});

	it("omits the twist sentence when not asked for", () => {
		expect(composeTheme({ wantsTwist: false, keyTheme: "Greed" })).not.toMatch(/reversal/i);
	});

	it("collapses whitespace so a pasted value cannot deform the prompt", () => {
		expect(composeTheme({ theme: "A  ruined\n\nreputation" })).toBe("A ruined reputation.");
	});

	it("composes every part in a stable order", () => {
		const theme = composeTheme({
			theme: "Old money, new grudges",
			keyTheme: "Revenge",
			victimProfile: "A retired actress",
			method: "A fall",
			elements: "letters and a missing will",
			wantsTwist: true,
		});
		expect(theme.indexOf("Old money")).toBeLessThan(theme.indexOf("motive turns on"));
		expect(theme.indexOf("motive turns on")).toBeLessThan(theme.indexOf("victim is"));
		expect(theme.indexOf("victim is")).toBeLessThan(theme.indexOf("method involves"));
		expect(theme.indexOf("method involves")).toBeLessThan(theme.indexOf("Work in"));
		expect(theme.indexOf("Work in")).toBeLessThan(theme.indexOf("reversal"));
	});
});

describe("mechanism family detection", () => {
	it("mirrors the pipeline's table exactly", () => {
		// A copy of a matcher is a divergence waiting to happen (WF-002). This is the guard.
		const path = resolve(__dirname, "../../../../../packages/prompts-llm/src/agent3b-hard-logic-devices.ts");
		if (!existsSync(path)) {
			console.warn("SKIPPED: agent3b-hard-logic-devices.ts not found — mirror unverified");
			return;
		}
		const src = readFileSync(path, "utf8");
		const block = src.slice(
			src.indexOf("const MECHANISM_FAMILY_KEYWORDS"),
			src.indexOf("};", src.indexOf("const MECHANISM_FAMILY_KEYWORDS")),
		);

		const pipeline: Record<string, string[]> = {};
		for (const line of block.split("\n")) {
			const m = line.match(/^\s{2}(\w+):\s*\[(.+)\],\s*$/);
			if (m) pipeline[m[1]] = [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
		}

		expect(Object.keys(pipeline).length, "parsed no families — the parser is wrong").toBeGreaterThan(0);
		expect(MECHANISM_FAMILY_KEYWORDS).toEqual(pipeline);
	});

	it("finds a family a scenic detail would silently lock", () => {
		expect(detectMechanismFamilies("a grandfather clock in the hall")).toEqual(["clock"]);
		expect(detectMechanismFamilies("a mirror above the fireplace")).toEqual(["optics"]);
	});

	it("matches by substring, exactly as the pipeline does", () => {
		// "horolog" matches "horological"; "embezzl" matches "embezzlement". A word-boundary mirror
		// would under-report the coupling and the note would go quiet when it mattered.
		expect(detectMechanismFamilies("his horological collection")).toEqual(["clock"]);
		expect(detectMechanismFamilies("years of embezzlement")).toEqual(["ledger"]);
	});

	it("reports several families when the text touches several", () => {
		expect(detectMechanismFamilies("a poisoned cup beside the gramophone").sort()).toEqual([
			"acoustic",
			"poison",
		]);
	});

	it("is quiet on ordinary text", () => {
		expect(detectMechanismFamilies("an inheritance nobody wanted")).toEqual([]);
		expect(detectMechanismFamilies("")).toEqual([]);
	});

	it("writes a readable note, and nothing at all when there is nothing to say", () => {
		expect(mechanismNote("an inheritance nobody wanted")).toBeNull();
		expect(mechanismNote("a grandfather clock")).toBe(
			"These details will steer the murder method toward a clock or timepiece.",
		);
		expect(mechanismNote("a poisoned cup beside the gramophone")).toBe(
			"These details will steer the murder method toward poison and a recording or sound.",
		);
	});

	it("catches the collision class the seeded generator's self-test was built for", () => {
		// "championship" contains "ship"; here the equivalent is innocuous-looking free text that
		// carries a stem. The point is that the UI SEES it, not that it forbids it.
		expect(detectMechanismFamilies("a dispute over the temperature in the greenhouse")).toEqual([
			"thermal",
		]);
	});
});
