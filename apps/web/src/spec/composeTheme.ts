/**
 * THEME COMPOSITION — the board's optional fields, turned into the one free-text field the pipeline
 * actually reads.
 *
 * Board 1 asks for Method, Victim's profile, Key themes, Twists and Specific elements. None of those
 * is a spec field (UI-002 §2). Rather than drop them or wire them to nothing, they compose into
 * `theme`, which Agent 1 and Agent 3 genuinely read — the same technique `scripts/run-params.mjs`
 * uses to fold a story angle into the theme.
 *
 * ── WHY THE FRAMING SENTENCES MATTER ──────────────────────────────────────────────────────────
 *
 * A bare concatenation ("Jealousy. A wealthy patriarch. A locked study.") gives the pipeline no way
 * to tell a MOTIVE from a SETTING DETAIL from a MECHANISM, and the agents will guess. Each part is
 * therefore labelled in the composed string, which is what run-params.mjs discovered it had to do
 * with the story angle: without "this is background colour, NOT the murder mechanism", the angle
 * displaced the concealment.
 *
 * ── THE COLLISION HAZARD ──────────────────────────────────────────────────────────────────────
 *
 * `theme` is read by a SUBSTRING matcher in agent3b-hard-logic-devices.ts that locks the murder
 * mechanism to a family. A user typing "a grandfather clock in the hall" as a scenic detail silently
 * commits the story to a clock mechanism. That is not a bug to suppress — sometimes it is exactly
 * what the user wants — but it must be VISIBLE, so `detectMechanismFamilies` powers a note in the
 * UI rather than a validation error. This is the same class of trap as "championship" containing
 * "ship", which the seeded generator's --self-test exists to catch.
 */

export interface ThemeParts {
	/** The free-text theme the user typed, if any. Always leads. */
	theme?: string;
	/** Board: "Key themes" — jealousy, greed, revenge. */
	keyTheme?: string;
	/** Board: "Victim's profile" — a wealthy patriarch, a retired actress. */
	victimProfile?: string;
	/** Board: "Method" — poison, a fall, a blunt instrument. "Surprise me" means omit. */
	method?: string;
	/** Board: "Twists" — whether to ask for a late reversal. */
	wantsTwist?: boolean;
	/** Board: "Specific elements" — letters, a missing will, a photograph. */
	elements?: string;
}

const clean = (value: string | undefined): string => (value ?? "").trim().replace(/\s+/g, " ");

/** Values meaning "no preference". Matched case-insensitively; these never enter the string. */
const ABSTAIN = new Set(["", "surprise me", "let fate decide", "no preference", "any", "none"]);

const isAbstain = (value: string): boolean => ABSTAIN.has(value.toLowerCase());

const part = (value: string | undefined, frame: (v: string) => string): string | null => {
	const v = clean(value);
	return !v || isAbstain(v) ? null : frame(v);
};

/**
 * Compose the parts into one theme string.
 *
 * Returns "" when nothing was supplied — the API substitutes "A classic murder mystery"
 * (server.ts:678), and sending our own version of that default would only make the two drift.
 */
export const composeTheme = (parts: ThemeParts): string => {
	const sentences: string[] = [];

	const lead = clean(parts.theme);
	if (lead && !isAbstain(lead)) sentences.push(lead.replace(/\.?$/, "."));

	const fragments = [
		part(parts.keyTheme, (v) => `The motive turns on ${v.toLowerCase()}`),
		part(parts.victimProfile, (v) => `The victim is ${v.toLowerCase()}`),
		part(parts.method, (v) => `The method involves ${v.toLowerCase()}`),
		part(parts.elements, (v) => `Work in ${v.toLowerCase()}`),
	].filter((f): f is string => f !== null);

	if (fragments.length > 0) sentences.push(`${fragments.join(". ")}.`);

	if (parts.wantsTwist) {
		sentences.push(
			"Carry a late reversal: something the reader believed in the first half must be shown to mean " +
				"something else, without contradicting anything already established.",
		);
	}

	return sentences.join(" ").trim();
};

/* ── mechanism-family collision detection ───────────────────────────────────────────────────── */

/**
 * A MIRROR of MECHANISM_FAMILY_KEYWORDS in packages/prompts-llm/src/agent3b-hard-logic-devices.ts:74.
 *
 * apps/web does not depend on @cml/prompts-llm, so this is a copy — and a copy of a matcher is a
 * divergence waiting to happen (WF-002). It is guarded: __tests__/composeTheme.test.ts parses the
 * real table out of that source file and fails if the two differ by a single stem.
 */
export const MECHANISM_FAMILY_KEYWORDS: Record<string, readonly string[]> = {
	clock: ["clock", "chime", "pendulum", "timepiece", "horolog", "clockwork", "winding key"],
	tide: ["tide", "tidal", "drown", "flood tide", "sea level", "water level", "sluice"],
	poison: ["poison", "toxin", "venom", "arsenic", "cyanide", "toxicolog", "dosage"],
	acoustic: ["acoustic", "gramophone", "phonograph", "recording", "soundproof", "echo chamber"],
	optics: ["mirror", "optical", "reflection", "lens", "prism", "refraction"],
	ledger: ["ledger", "forgery", "forged", "embezzl", "account book", "bookkeep"],
	thermal: ["thermal", "heat expansion", "temperature", "expansion of", "fahrenheit", "furnace"],
	impersonation: ["impersonat", "disguise", "masquerade", "double identity"],
};

/** Human-readable names for the note shown beside the field. */
export const FAMILY_LABELS: Record<string, string> = {
	clock: "a clock or timepiece",
	tide: "a tide or flooding",
	poison: "poison",
	acoustic: "a recording or sound",
	optics: "mirrors or optics",
	ledger: "forged accounts",
	thermal: "heat or temperature",
	impersonation: "impersonation",
};

/**
 * Which mechanism families this text would lock, by the same substring rule the pipeline uses.
 * Case-insensitive, substring — NOT word-boundary — because that is what the pipeline does, and a
 * stricter mirror here would under-report the real coupling.
 */
export const detectMechanismFamilies = (text: string): string[] => {
	const hay = (text ?? "").toLowerCase();
	if (!hay) return [];
	return Object.entries(MECHANISM_FAMILY_KEYWORDS)
		.filter(([, stems]) => stems.some((stem) => hay.includes(stem)))
		.map(([family]) => family);
};

/**
 * The sentence shown under the field when the composed theme would steer the mechanism. Returns
 * null when there is nothing to say — this is a note, never an error.
 */
export const mechanismNote = (theme: string): string | null => {
	const families = detectMechanismFamilies(theme);
	if (families.length === 0) return null;
	const named = families.map((f) => FAMILY_LABELS[f] ?? f);
	const list =
		named.length === 1
			? named[0]
			: `${named.slice(0, -1).join(", ")} and ${named[named.length - 1]}`;
	return `These details will steer the murder method toward ${list}.`;
};
