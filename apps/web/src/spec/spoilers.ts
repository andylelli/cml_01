import type { CharacterProfile } from "../components/types";

/**
 * WHAT MAY BE READ BEFORE THE BOOK, AND WHAT MAY NOT.
 *
 * The case file is meant to work twice: as background a reader can have going in, and as a bonus
 * dossier afterwards. That only holds if the split is right, and the split is NOT obvious from the
 * field names.
 *
 * ── THE MEASUREMENT THAT SETTLED IT ───────────────────────────────────────────────────────────
 *
 * `paragraphs` reads like harmless colour — five paragraphs of prose about a character's life. On a
 * real payload, one suspect's second paragraph began:
 *
 *   "His affair with Annabelle Marwood was a dangerous dance, fraught with risk…"
 *
 * which is verbatim what `privateSecret` holds. The long-form profile CONTAINS the secret. It is
 * excellent bonus material and it cannot be shown before the book.
 *
 * Locations are the opposite: 20 of 21 fields scanned clean, and only `purpose` leaked — it reads
 * "Crime scene".
 *
 * `leaksInto()` below is how that stays true rather than becoming a stale comment.
 */

/** Character fields a reader may see before reading the story. */
export const SAFE_CHARACTER_FIELDS = [
	"name",
	"summary",
	"publicPersona",
	"speechMannerisms",
	"signatureTic",
	"internalConflict",
	"humourStyle",
] as const satisfies readonly (keyof CharacterProfile)[];

/** Character fields that give the answer away. The bonus dossier. */
export const SPOILER_CHARACTER_FIELDS = [
	"privateSecret",
	"motiveSeed",
	"motiveStrength",
	"alibiWindow",
	"accessPlausibility",
	"stakes",
	"personalStakeInCase",
	"paragraphs",
] as const satisfies readonly (keyof CharacterProfile)[];

/** Location fields that give something away. Everything else about a place is safe. */
export const SPOILER_LOCATION_FIELDS = ["purpose"] as const;

/**
 * Words that mean the text is talking about the crime rather than the world. Used to scan location
 * text, where the giveaway is a noun rather than a whole field.
 */
export const CRIME_WORDS =
	/\b(crime scene|murder(?:ed|er)?|the body|victim|weapon|killed|strangl\w*|poison(?:ed|ing)?|stabb\w*|struck down)\b/i;

/**
 * Does `safeText` give away anything in `secretText`?
 *
 * Compares distinctive words — proper nouns and long words — rather than whole strings, because a
 * secret is rarely quoted verbatim; it is paraphrased. Returns the shared terms so a failure names
 * what leaked instead of only that something did.
 */
export const leaksInto = (safeText: string, secretText: string): string[] => {
	if (!safeText || !secretText) return [];

	// Words worth caring about: capitalised names, or anything long enough to be specific.
	const distinctive = (text: string): Set<string> => {
		const out = new Set<string>();
		for (const word of text.split(/[^\p{L}\p{N}'’-]+/u)) {
			if (word.length < 5) continue;
			if (STOPWORDS.has(word.toLowerCase())) continue;
			out.add(word.toLowerCase());
		}
		return out;
	};

	const secret = distinctive(secretText);
	const safe = distinctive(safeText);
	return [...secret].filter((w) => safe.has(w));
};

/**
 * Long words that carry no information about a specific secret. Without these, every comparison
 * matches on "would", "threatens", "position" and the check becomes noise.
 */
const STOPWORDS = new Set([
	"would", "could", "should", "their", "there", "these", "those", "which", "while", "where",
	"about", "after", "before", "being", "between", "during", "through", "under", "within",
	"threatens", "threatening", "position", "himself", "herself", "themselves", "something",
	"everything", "anything", "nothing", "because", "however", "though", "always", "never",
	"secret", "secretly", "private", "hidden",
]);

/** Split a profile into what may be shown now and what is held back. */
export const partitionProfile = (profile: CharacterProfile) => {
	const safe: Partial<CharacterProfile> = {};
	const spoiler: Partial<CharacterProfile> = {};
	for (const key of SAFE_CHARACTER_FIELDS) {
		const value = profile[key];
		if (value !== undefined && value !== null && value !== "") (safe as Record<string, unknown>)[key] = value;
	}
	for (const key of SPOILER_CHARACTER_FIELDS) {
		const value = profile[key];
		const empty = value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
		if (!empty) (spoiler as Record<string, unknown>)[key] = value;
	}
	return { safe, spoiler };
};
