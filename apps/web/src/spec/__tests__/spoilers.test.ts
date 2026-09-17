import { describe, expect, it } from "vitest";
import type { CharacterProfile } from "../../components/types";
import {
	CRIME_WORDS,
	SAFE_CHARACTER_FIELDS,
	SPOILER_CHARACTER_FIELDS,
	leaksInto,
	partitionProfile,
} from "../spoilers";

/**
 * The case file is meant to be readable twice — as background going in, and as a bonus dossier
 * afterwards. That only works if the split is correct, and the split is not obvious from the field
 * names: `paragraphs` sounds like colour and is not.
 *
 * The fixture below is lifted from proj_035fdeda-92e1-4613-b170-1ffba5c017a1 (MEASURED, this
 * session, via /api/projects/:id/character-profiles). It is here rather than in a snapshot because
 * it is the evidence for the rule, and a rule whose evidence is deleted becomes a comment.
 */
const FENWICK = {
	name: "Charles Fenwick",
	summary: "A gentleman of the town, careful with his reputation.",
	publicPersona: "Affable, unhurried, and always exactly where he says he was.",
	speechMannerisms: "Long sentences that end in a question he answers himself.",
	signatureTic: '"Well now, let us be reasonable about this."',
	internalConflict: "Wants to be thought decent more than he wants to be decent.",
	humourStyle: "dry_wit",
	privateSecret: "His affair with Annabelle Marwood threatens to destroy his standing with Beatrice.",
	motiveSeed: "Exposure would cost him the Marwood account and his marriage.",
	paragraphs: [
		"Charles Fenwick had learned early that a pleasant manner opens more doors than a good name.",
		"His affair with Annabelle Marwood was a dangerous dance, fraught with risk, and he had begun to suspect Beatrice knew.",
	],
} as unknown as CharacterProfile;

describe("the safe tier and the bonus tier do not overlap", () => {
	it("puts every field on exactly one side", () => {
		const both = SAFE_CHARACTER_FIELDS.filter((f) => (SPOILER_CHARACTER_FIELDS as readonly string[]).includes(f));
		expect(both, "a field cannot be both safe and a spoiler").toEqual([]);
	});

	it("partitions a real profile into the two tiers", () => {
		const { safe, spoiler } = partitionProfile(FENWICK);
		expect(Object.keys(safe).sort()).toEqual(
			["humourStyle", "internalConflict", "name", "publicPersona", "signatureTic", "speechMannerisms", "summary"],
		);
		expect(Object.keys(spoiler).sort()).toEqual(["motiveSeed", "paragraphs", "privateSecret"]);
	});

	it("omits fields the pipeline did not produce, rather than showing empty labels", () => {
		const sparse = { name: "A Name", summary: "", paragraphs: [] } as unknown as CharacterProfile;
		const { safe, spoiler } = partitionProfile(sparse);
		expect(Object.keys(safe)).toEqual(["name"]);
		expect(spoiler).toEqual({});
	});
});

describe("leaksInto — why `paragraphs` is a spoiler", () => {
	/**
	 * THE MEASUREMENT. `paragraphs` was on the safe side of an earlier draft of this file, on the
	 * reasoning that prose about a character's upbringing gives nothing away. It does: the second
	 * paragraph of this real profile restates `privateSecret` almost word for word.
	 */
	it("catches the real leak, and names what leaked", () => {
		const secret = FENWICK.privateSecret ?? "";
		const prose = (FENWICK.paragraphs ?? []).join(" ");
		expect(leaksInto(prose, secret).sort()).toEqual(["affair", "annabelle", "beatrice", "marwood"]);
	});

	it("passes the fields that are actually safe", () => {
		const secret = FENWICK.privateSecret ?? "";
		for (const field of ["summary", "publicPersona", "speechMannerisms", "internalConflict", "signatureTic"] as const) {
			expect(leaksInto(String(FENWICK[field] ?? ""), secret), `${field} leaked`).toEqual([]);
		}
	});

	it("catches a paraphrase, not only a quotation", () => {
		expect(leaksInto("Annabelle had not been seen since Tuesday.", "The affair with Annabelle is the motive."))
			.toEqual(["annabelle"]);
	});

	it("does not fire on shared connective words", () => {
		expect(leaksInto("He would always be somewhere between duty and comfort.",
			"She threatens to expose something about his position, though nothing is proven."))
			.toEqual([]);
	});

	it("is empty when either side is missing", () => {
		expect(leaksInto("", "a secret")).toEqual([]);
		expect(leaksInto("some text", "")).toEqual([]);
	});
});

describe("CRIME_WORDS — how a location gives itself away", () => {
	/**
	 * Locations are the opposite case: 20 of 21 fields on the real payload scanned clean, and the one
	 * that leaked did so through a single noun. `purpose` read "Crime scene".
	 */
	it("fires on the field that actually leaked", () => {
		expect(CRIME_WORDS.test("Crime scene")).toBe(true);
	});

	it("fires on the other ways the payload names it", () => {
		for (const phrase of ["where the body was found", "the murder weapon", "the victim's room", "she was poisoned"]) {
			expect(CRIME_WORDS.test(phrase), `missed: ${phrase}`).toBe(true);
		}
	});

	it("leaves ordinary description alone", () => {
		for (const phrase of [
			"A long drawing room with french windows onto the terrace.",
			"Servants use the back stair; guests do not.",
			"The library smells of pipe smoke and damp paper.",
		]) {
			expect(CRIME_WORDS.test(phrase), `false positive: ${phrase}`).toBe(false);
		}
	});
});
