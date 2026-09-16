/**
 * FLAVOUR OPTIONS — the board's fields that are NOT spec fields.
 *
 * Method, victim's profile, key theme and specific elements have no place in the spec the API
 * accepts (UI-002 §2). They compose into the free-text `theme` via composeTheme(). They live in
 * their own file, apart from vocabulary.ts, precisely so nobody later mistakes them for pipeline
 * parameters and "wires them up properly" — there is nothing to wire them to.
 *
 * Every list leads with an abstain option whose label composeTheme() recognises and drops, so the
 * default choice adds nothing to the prompt rather than adding the word "surprise".
 */

export interface FlavourOption {
	value: string;
	label: string;
}

/** The label composeTheme() treats as "no preference". Keep in step with ABSTAIN there. */
export const SURPRISE_ME = "Surprise me";

const withAbstain = (options: readonly string[]): readonly FlavourOption[] => [
	{ value: SURPRISE_ME, label: SURPRISE_ME },
	...options.map((label) => ({ value: label, label })),
];

/**
 * Motive. Deliberately abstract nouns — these become "The motive turns on <x>", and a concrete one
 * ("a forged will") would collide with the ledger mechanism family and quietly pick the murder
 * method. See composeTheme's collision note.
 */
export const KEY_THEMES = withAbstain([
	"Jealousy",
	"Greed",
	"Revenge",
	"A reputation to protect",
	"An old debt",
	"Love, badly returned",
	"Inheritance",
	"Blackmail",
]);

export const VICTIM_PROFILES = withAbstain([
	"A wealthy patriarch",
	"A retired actress",
	"A visiting stranger",
	"The family solicitor",
	"A society hostess",
	"A young heir",
	"A servant who knew too much",
	"A rival in business",
]);

/**
 * Method. Note what is NOT here: nothing naming a clock, a tide, a mirror or a gramophone. Those
 * words lock a mechanism family on contact (agent3b-hard-logic-devices.ts), and a casual pick from
 * a dropdown should not overrule the concealment axis. Choosing the mechanism deliberately is a
 * Workshop decision, not a step-5 one.
 */
export const CRIME_METHODS = withAbstain([
	"Poison",
	"A blunt instrument",
	"A fall",
	"A shot",
	"Suffocation",
	"An accident that was not one",
]);

export const STORY_ELEMENTS = withAbstain([
	"Letters nobody should have kept",
	"A missing will",
	"A photograph",
	"A locked room",
	"A servant's testimony",
	"A train timetable",
	"A second body",
	"An alibi that is too good",
]);

export const TWIST_OPTIONS: readonly FlavourOption[] = [
	{ value: "yes", label: "Yes, include a twist" },
	{ value: "no", label: "No, play it straight" },
];
