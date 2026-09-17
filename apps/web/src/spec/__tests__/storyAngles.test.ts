import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ANGLE_GROUPS, STORY_ANGLES, randomAngle } from "../storyAngles";

/**
 * storyAngles.ts is a COPY of STORY_ANGLES in scripts/run-params.mjs, because that is a .mjs script
 * outside the web app's build. A copy of a list is a divergence waiting to happen (WF-002), and this
 * one is harmful: an angle the UI offers that the generator has never self-tested could carry a
 * substring that locks the murder mechanism.
 *
 * So the real list is parsed out of the generator's own source here. This is the same guard
 * composeTheme.test.ts puts on MECHANISM_FAMILY_KEYWORDS.
 */

const REPO = resolve(__dirname, "../../../../..");
const GENERATOR = resolve(REPO, "scripts/run-params.mjs");

/** The generator's list, read from the generator. Line endings normalised: the file is CRLF here. */
const parseGeneratorAngles = (): string[] => {
	const src = readFileSync(GENERATOR, "utf8").split("\r\n").join("\n");
	const block = src.match(/const STORY_ANGLES = \[\n([\s\S]*?)\n\];/);
	if (!block) throw new Error(`STORY_ANGLES not found in ${GENERATOR}`);
	return block[1]
		.split("\n")
		.map((line) => line.trim().match(/^"(.+)",?$/))
		.filter((m): m is RegExpMatchArray => m !== null)
		.map((m) => m[1]);
};

describe("the angle list matches the generator, exactly", () => {
	it("finds the generator — a parse failure here is about the PROBE, not the lists", () => {
		const fromSource = parseGeneratorAngles();
		expect(fromSource.length, "parsed nothing; the regex or the path is wrong").toBeGreaterThan(50);
		expect(fromSource[0]).toBe("a county cricket eleven and its ageing captain");
	});

	it("has not drifted by a single character", () => {
		expect(STORY_ANGLES).toEqual(parseGeneratorAngles());
	});

	it("carries all 107, and every one distinct", () => {
		expect(STORY_ANGLES).toHaveLength(107);
		expect(new Set(STORY_ANGLES).size).toBe(107);
	});

	it("groups them without losing or inventing any", () => {
		expect(ANGLE_GROUPS.flatMap((g) => g.angles)).toEqual([...STORY_ANGLES]);
		expect(ANGLE_GROUPS).toHaveLength(8);
		for (const group of ANGLE_GROUPS) {
			expect(group.angles.length, `empty group: ${group.category}`).toBeGreaterThan(0);
		}
	});
});

describe("randomAngle", () => {
	it("only ever returns a real angle", () => {
		for (let i = 0; i < 200; i++) expect(STORY_ANGLES).toContain(randomAngle());
	});

	it("does not return the same one every time", () => {
		const seen = new Set(Array.from({ length: 200 }, randomAngle));
		expect(seen.size).toBeGreaterThan(1);
	});
});
