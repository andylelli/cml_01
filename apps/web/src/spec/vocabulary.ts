/**
 * THE SPEC VOCABULARY — one source of truth for every value the pipeline accepts.
 *
 * Sourced from apps/api/src/server.ts:673-697 and the packages it hands to. Documented with its
 * provenance in documentation/ui/UI-002-rebuild-plan.md §2.
 *
 * ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────────────────────────
 *
 * Most of these fields are FREE TEXT at the API boundary. An unrecognised `tone` or `humourLevel`
 * does not fail — it silently resolves to a default, and the user gets a book that quietly ignored
 * what they chose. A control offering a value not listed here is therefore a control that lies, and
 * nothing downstream will ever tell you.
 *
 * `primaryAxis` is the exception and the opposite danger: an unrecognised value THROWS at pipeline
 * init, aborting a paid run. It is never rendered as free text anywhere in the UI.
 *
 * Every options array below is `as const` and drives both the controls and the conformance test in
 * __tests__/vocabulary.test.ts.
 */

export interface SpecOption<T extends string> {
	value: T;
	/** What the user reads. The boards use period labels, the API wants its own tokens. */
	label: string;
	/** One short line under the label, where the control has room for it. */
	hint?: string;
	/** Named glyph from components/ui/icons. */
	icon: string;
}

/* ── ERA ─────────────────────────────────────────────────────────────────────────────────────── */

export const DECADES = ["1920s", "1930s", "1940s", "1950s"] as const;
export type Decade = (typeof DECADES)[number];

export const DECADE_OPTIONS: readonly SpecOption<Decade>[] = [
	{ value: "1920s", label: "1920s", hint: "Jazz age, new money", icon: "city" },
	{ value: "1930s", label: "1930s", hint: "The classic decade", icon: "motorcar" },
	{ value: "1940s", label: "1940s", hint: "Wartime and after", icon: "aeroplane" },
	{ value: "1950s", label: "1950s", hint: "The long afternoon", icon: "liner" },
] as const;

/* ── SETTING ─────────────────────────────────────────────────────────────────────────────────── */

/**
 * The five real presets. The mood boards show "City" and "Train", which are not presets — the
 * setting agent would improvise from the free text and the choice would mean less than it appears
 * to. Rejected in UI-002 §2.
 */
export const LOCATION_PRESETS = ["CountryHouse", "SeasideHotel", "Village", "Liner", "Theatre"] as const;
export type LocationPreset = (typeof LOCATION_PRESETS)[number];

export const LOCATION_OPTIONS: readonly SpecOption<LocationPreset>[] = [
	{ value: "CountryHouse", label: "Country House", hint: "Weekend party, locked wing", icon: "house" },
	{ value: "SeasideHotel", label: "Seaside Hotel", hint: "Out of season, half full", icon: "lamp" },
	{ value: "Village", label: "Village", hint: "Everyone knows everyone", icon: "church" },
	{ value: "Liner", label: "Ocean Liner", hint: "Six days from any police force", icon: "liner" },
	{ value: "Theatre", label: "Theatre", hint: "Two audiences, one of them lying", icon: "masks" },
] as const;

/* ── TONE ────────────────────────────────────────────────────────────────────────────────────── */

/**
 * Three, not the boards' five. "Humorous" is not a tone — it is `humourLevel: sharp`, a separate
 * parameter with its own control below. "Thrilling" has no backend meaning at all.
 *
 * NOTE the coupling: `tone: "Dark"` ALSO flips `narrativeStyle` to `atmospheric` at server.ts:675.
 * The control surfaces this rather than hiding it; changing the coupling is a pipeline decision.
 */
export const TONES = ["Classic", "Cozy", "Dark"] as const;
export type Tone = (typeof TONES)[number];

export const TONE_OPTIONS: readonly SpecOption<Tone>[] = [
	{ value: "Classic", label: "Classic", hint: "Golden age, played straight", icon: "pipe" },
	{ value: "Cozy", label: "Cosy", hint: "Warm, village-scaled", icon: "teacup" },
	{ value: "Dark", label: "Dark", hint: "Also sets an atmospheric narrator", icon: "moon" },
] as const;

/* ── HUMOUR ──────────────────────────────────────────────────────────────────────────────────── */

/**
 * NEW CONTROL. `humourLevel` has been accepted by the API and wired through Agent 2b and Agent 9
 * since A_92, and no UI has ever sent it. Absent or unrecognised resolves to `classic`, which is the
 * behaviour every run had before the parameter existed (packages/prompts-llm/src/humour-level.ts:87).
 *
 * The hints below are the bands' real, countable effects — not flavour text.
 */
// A_103 B85: "auto" is "not chosen". The wizard used to send "classic" on every run, and the resolver
// returns an explicit value before it consults AGENT2B_BAND_BY_AXIS - so the flag could never fire
// for a UI run. The API maps "auto" to undefined; the pipeline's own fallback is still "classic".
export const HUMOUR_LEVELS = ["auto", "none", "dry", "classic", "sharp"] as const;
export type HumourLevel = (typeof HUMOUR_LEVELS)[number];

export const HUMOUR_OPTIONS: readonly SpecOption<HumourLevel>[] = [
	{ value: "auto", label: "Auto", hint: "Let the pipeline choose (classic unless a flag varies it by axis)", icon: "gear" },
	{ value: "none", label: "None", hint: "Earnest throughout; no character is funny", icon: "nib" },
	{ value: "dry", label: "Dry", hint: "At most two light touches, understated", icon: "spectacles" },
	{ value: "classic", label: "Classic", hint: "What the genre does — a beat each chapter", icon: "book" },
	{ value: "sharp", label: "Sharp", hint: "Three wits, one of them unkind", icon: "masks" },
] as const;

export const DEFAULT_HUMOUR_LEVEL: HumourLevel = "auto";

/* ── DETECTIVE ───────────────────────────────────────────────────────────────────────────────── */

export const DETECTIVE_TYPES = ["police", "private", "amateur"] as const;
export type DetectiveType = (typeof DETECTIVE_TYPES)[number];

export const DETECTIVE_OPTIONS: readonly SpecOption<DetectiveType>[] = [
	{ value: "amateur", label: "Amateur", hint: "A guest who notices things", icon: "spectacles" },
	{ value: "private", label: "Private enquiry agent", hint: "Engaged, and resented", icon: "hat" },
	{ value: "police", label: "Police inspector", hint: "Official, and out of his depth", icon: "badge" },
] as const;

/* ── LENGTH ──────────────────────────────────────────────────────────────────────────────────── */

export const TARGET_LENGTHS = ["short", "medium", "long"] as const;
export type TargetLength = (typeof TARGET_LENGTHS)[number];

export const LENGTH_OPTIONS: readonly SpecOption<TargetLength>[] = [
	{ value: "short", label: "Short", hint: "A sitting", icon: "book" },
	{ value: "medium", label: "Medium", hint: "An evening", icon: "book" },
	{ value: "long", label: "Long", hint: "A weekend", icon: "book" },
] as const;

/* ── NARRATIVE STYLE ─────────────────────────────────────────────────────────────────────────── */

export const NARRATIVE_STYLES = ["classic", "modern", "atmospheric"] as const;
export type NarrativeStyle = (typeof NARRATIVE_STYLES)[number];

/* ── AXIS — the one that aborts a run ────────────────────────────────────────────────────────── */

/**
 * The concealment axis. An unrecognised value THROWS at pipeline init (server.ts:683 and the
 * comment above it), so this is never a free-text field and never defaulted from user input.
 * Operator-only: it is a craft decision, not a reader-facing one.
 */
export const PRIMARY_AXES = ["temporal", "spatial", "identity", "behavioral", "authority"] as const;
export type PrimaryAxis = (typeof PRIMARY_AXES)[number];

export const AXIS_OPTIONS: readonly SpecOption<PrimaryAxis>[] = [
	{ value: "temporal", label: "Temporal", hint: "When it happened is not when it seemed", icon: "clock" },
	{ value: "spatial", label: "Spatial", hint: "Where someone was is not where they were", icon: "compass" },
	{ value: "identity", label: "Identity", hint: "Who someone is, is not who they are", icon: "masks" },
	{ value: "behavioral", label: "Behavioural", hint: "What was done is not what it looked like", icon: "footprint" },
	{ value: "authority", label: "Authority", hint: "Who may be believed, and why", icon: "badge" },
] as const;

/* ── THE SHAPE SENT TO THE API ───────────────────────────────────────────────────────────────── */

export interface MysterySpec {
	decade: Decade;
	locationPreset: LocationPreset;
	tone: Tone;
	theme: string;
	/**
	 * The WORLD the crime happens inside — "a racing stable", "a by-election". Separate from
	 * `theme` because it travels by a different route: Agents 1 and 2 read `storyAngle` directly and
	 * are never shown the theme, while Agents 2e/3b/3 read the theme and never see the field. The API
	 * fans one value out to both. Empty string means no angle.
	 */
	storyAngle: string;
	castSize: number;
	castNames: string[];
	detectiveType: DetectiveType;
	primaryAxis: PrimaryAxis;
	targetLength: TargetLength;
	humourLevel: HumourLevel;
	proseBatchSize: number;
}

export const CAST_SIZE_MIN = 4;
export const CAST_SIZE_MAX = 10;

export const defaultSpec = (): MysterySpec => ({
	decade: "1930s",
	locationPreset: "CountryHouse",
	tone: "Classic",
	theme: "",
	storyAngle: "",
	castSize: 6,
	castNames: [],
	detectiveType: "amateur",
	primaryAxis: "temporal",
	targetLength: "medium",
	humourLevel: DEFAULT_HUMOUR_LEVEL,
	proseBatchSize: 1,
});

/**
 * Runtime guard for the one field that aborts a run. Used at submit, not just at render, because a
 * spec can also arrive from localStorage written by an older build.
 */
export const isPrimaryAxis = (value: unknown): value is PrimaryAxis =>
	typeof value === "string" && (PRIMARY_AXES as readonly string[]).includes(value);

/** Everything else degrades silently, so a bad stored value is repaired rather than sent. */
export const coerceSpec = (stored: Partial<MysterySpec> | null | undefined): MysterySpec => {
	const base = defaultSpec();
	if (!stored || typeof stored !== "object") return base;

	const pick = <T extends string>(options: readonly T[], value: unknown, fallback: T): T =>
		typeof value === "string" && (options as readonly string[]).includes(value) ? (value as T) : fallback;

	const castSize = Number(stored.castSize);

	return {
		decade: pick(DECADES, stored.decade, base.decade),
		locationPreset: pick(LOCATION_PRESETS, stored.locationPreset, base.locationPreset),
		tone: pick(TONES, stored.tone, base.tone),
		theme: typeof stored.theme === "string" ? stored.theme : base.theme,
		storyAngle: typeof stored.storyAngle === "string" ? stored.storyAngle : base.storyAngle,
		castSize: Number.isFinite(castSize)
			? Math.min(CAST_SIZE_MAX, Math.max(CAST_SIZE_MIN, Math.round(castSize)))
			: base.castSize,
		castNames: Array.isArray(stored.castNames) ? stored.castNames.filter((n) => typeof n === "string") : [],
		detectiveType: pick(DETECTIVE_TYPES, stored.detectiveType, base.detectiveType),
		primaryAxis: pick(PRIMARY_AXES, stored.primaryAxis, base.primaryAxis),
		targetLength: pick(TARGET_LENGTHS, stored.targetLength, base.targetLength),
		humourLevel: pick(HUMOUR_LEVELS, stored.humourLevel, base.humourLevel),
		proseBatchSize: Number.isFinite(Number(stored.proseBatchSize)) ? Number(stored.proseBatchSize) : base.proseBatchSize,
	};
};
