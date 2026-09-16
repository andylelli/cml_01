/**
 * The pipeline's fourteen stages, in the reader's language.
 *
 * The console labels them by agent and artifact — "CML", "Hard Logic", "Novelty Audit", "World
 * Builder" — which is correct for an operator and meaningless to someone waiting for a story. The
 * ids are the same; only the words change, so `deriveStages` stays the single source of what is
 * running and this file never has to know.
 *
 * `blurb` is what the stage is doing, in the present tense, for the line under the track.
 */

export interface ReaderStage {
	id: string;
	label: string;
	blurb: string;
}

export const READER_STAGES: readonly ReaderStage[] = [
	{ id: "setting", label: "The place", blurb: "Choosing where this happens, and when." },
	{ id: "cast", label: "The people", blurb: "Assembling a cast with something to hide." },
	{ id: "background", label: "The world", blurb: "Filling in what everyone already knows." },
	{ id: "hard_logic", label: "The method", blurb: "Working out how it was actually done." },
	{ id: "cml", label: "The crime", blurb: "Building the deception, and what conceals it." },
	{ id: "novelty_audit", label: "Originality", blurb: "Checking this is not a story we've told before." },
	{ id: "clues", label: "The clues", blurb: "Planting what you'll need to solve it." },
	{ id: "fairplay", label: "Fair play", blurb: "Making sure you could reach the answer first." },
	{ id: "profiles", label: "Character", blurb: "Giving each of them a voice and a history." },
	{ id: "location_profiles", label: "The rooms", blurb: "Describing every place the story visits." },
	{ id: "temporal_context", label: "The period", blurb: "Getting the clothes, weather and manners right." },
	{ id: "world_builder", label: "Continuity", blurb: "Binding every detail into one consistent world." },
	{ id: "outline", label: "The shape", blurb: "Ordering the chapters and the reveals." },
	{ id: "prose", label: "The writing", blurb: "Writing it." },
];

const BY_ID = new Map(READER_STAGES.map((s) => [s.id, s]));

/**
 * Reader-facing wording for a stage id. Falls back to the id turned into words rather than to a
 * generic phrase — an unmapped stage should look like an oversight, not read as if it were planned.
 */
export const readerStage = (id: string): ReaderStage =>
	BY_ID.get(id) ?? {
		id,
		label: id.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
		blurb: "",
	};
