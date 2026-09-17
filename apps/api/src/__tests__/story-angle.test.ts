import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { ANGLE_FRAMING, composeThemeWithAngle, createServer } from "../server.js";

/**
 * THE DEFECT THIS CLOSES.
 *
 * `storyAngle` has been a first-class pipeline input since it was added — declared on
 * `MysteryGenerationInputs` (mystery-orchestrator.ts:197) with dedicated prompt blocks in
 * agent1-setting.ts:204 and agent2-cast.ts:561, because Agents 1 and 2 are never shown the theme.
 *
 * MEASURED: `grep -rn storyAngle apps/api/src` returned NOTHING. The API never built it into
 * `inputs`, so every run started from any UI had `ctx.inputs.storyAngle === undefined` and those two
 * blocks never fired. Only the seeded path reached them, because canary-core.mjs passes its whole
 * YAML straight through (`const inputs = canaryInputConfig.inputs`).
 *
 * Same shape as humourLevel (A_92): wired end to end in the pipeline, never sent by anything.
 */

const REPO = resolve(__dirname, "../../../..");
const GENERATOR = resolve(REPO, "scripts/run-params.mjs");

describe("the framing sentence matches the generator, verbatim", () => {
	/**
	 * run-params.mjs:592 appends the angle to the theme with a fixed sentence. That sentence is load
	 * bearing: without it the angle displaces the concealment, because the theme is read by substring
	 * matchers that lock the murder device onto a family, so a world offered as scenery is taken as a
	 * method. Two copies of it is a divergence waiting to happen (WF-002), so this reads the real one.
	 */
	const generatorFraming = (): string => {
		const src = readFileSync(GENERATOR, "utf8").split("\r\n").join("\n");
		const block = src.match(/params\.theme \+= ([\s\S]*?);\n/);
		if (!block) throw new Error(`the angle append was not found in ${GENERATOR}`);
		// Concatenated template literals: take what is inside the backticks and join them.
		const pieces = [...block[1].matchAll(/`([^`]*)`/g)].map((m) => m[1]);
		if (pieces.length === 0) throw new Error("no template literals in the angle append");
		return pieces.join("");
	};

	it("finds the generator's append — a failure here is about the PROBE, not the strings", () => {
		const framing = generatorFraming();
		expect(framing, "parsed nothing").toContain("Story angle:");
		expect(framing).toContain("murder mechanism");
	});

	it("produces exactly what the generator produces, for the same angle", () => {
		const angle = "a racing stable in the weeks before a classic";
		// The generator's line, with its ${storyAngle} interpolation resolved.
		const expected = generatorFraming().replace("${storyAngle}", angle);
		const ours = composeThemeWithAngle("A locked-room murder.", angle);

		expect(ours).toBe(`A locked-room murder.${expected}`);
	});

	it("keeps the sentence itself byte-identical", () => {
		const expectedFraming = generatorFraming()
			.replace(" Story angle: ${storyAngle}.", "");
		expect(ANGLE_FRAMING).toBe(expectedFraming);
	});
});

describe("composeThemeWithAngle", () => {
	it("leaves the theme alone when there is no angle", () => {
		expect(composeThemeWithAngle("A poisoning at the fete.", undefined)).toBe("A poisoning at the fete.");
		expect(composeThemeWithAngle("A poisoning at the fete.", "   ")).toBe("A poisoning at the fete.");
	});

	it("falls back to the same default the spec has always had", () => {
		expect(composeThemeWithAngle(undefined, undefined)).toBe("A classic murder mystery");
		expect(composeThemeWithAngle("", undefined)).toBe("A classic murder mystery");
	});

	it("still applies the angle when the user typed no theme", () => {
		const composed = composeThemeWithAngle("", "a by-election in a market town");
		expect(composed.startsWith("A classic murder mystery Story angle: a by-election in a market town.")).toBe(true);
		expect(composed).toContain("NOT the murder mechanism");
	});

	it("does not double the full stop on an angle that has one", () => {
		expect(composeThemeWithAngle("A theme.", "a cathedral restoration.")).not.toContain("restoration..");
	});

	it("names the angle before framing it, so the phrase leads", () => {
		const composed = composeThemeWithAngle("A theme.", "a travelling circus");
		expect(composed.indexOf("a travelling circus")).toBeLessThan(composed.indexOf("background colour"));
	});
});

describe("the spec carries storyAngle across the API", () => {
	const app = createServer();

	it("round-trips it, so a saved spec can start a run with it", async () => {
		const created = await request(app).post("/api/projects").send({ name: "Angle Project" });
		const angle = "a racing stable and the stable lad who sees everything";

		await request(app)
			.post(`/api/projects/${created.body.id}/specs`)
			.send({ decade: "1930s", locationPreset: "CountryHouse", theme: "A locked room.", storyAngle: angle });

		const latest = await request(app).get(`/api/projects/${created.body.id}/specs/latest`);
		expect(latest.status).toBe(200);
		expect(latest.body.spec.storyAngle, "the angle did not survive the round trip").toBe(angle);
	});
});
