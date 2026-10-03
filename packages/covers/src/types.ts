/**
 * @cml/covers — shared shapes.
 *
 * The pipeline is: story → ANCHORS (one LLM call, spoiler-safe) → style CARD(S) from the story's decade, drawn
 * from a seed → BRIEF composed from a template, INCLUDING the exact title → IMAGE model letters it as part of the
 * picture → a vision TITLE CHECK reads it back (one repaint on a misspelling) → cover.png.
 * Only the brief reaches the image model; the sample images never do (documentation/covers §1, copyright).
 */

export interface Palette {
  name: string;
  /** Hex inks. The first is treated as the darkest/silhouette ink by convention, not by code. */
  inks: string[];
}


/** One style card — library/cover-styles/cards/<id>.yaml. Every field is an operation, not a resemblance. */
export interface StyleCard {
  id: string;
  label: string;
  family: string;
  summary: string;
  medium: string;
  palette_rule: string;
  palettes: Palette[];
  composition: string[];
  motifs: string[];
  figure_treatment: string;
  /** The decades the look belongs to, e.g. ["1940s"]. A story only draws cards from its own (or the nearest) decade. */
  decades: string[];
  /**
   * How the IMAGE MODEL letters the title, as period operations. Owner 2026-10-03: the title is painted as part
   * of the cover, never typeset afterwards — so this is the card's typography.
   */
  lettering: string;
  title_position: "top" | "bottom" | "either";
  avoid: string[];
  suits: { axis: string[]; tone: string[]; location: string[] };
}

/** What a story contributes. Everything but `title` and `openingText` is optional. */
export interface StoryCoverInput {
  title: string;
  author?: string;
  era?: string;
  locationPreset?: string;
  tone?: string;
  primaryAxis?: string;
  storyAngle?: string;
  /** Free-text setting description (e.g. from the CML or world document). */
  setting?: string;
  /**
   * Chapters 1–2 only. The cover must not reveal the culprit or the method, so the anchors are drawn
   * from the opening, which a reader sees before any solution — spoiler-safe by construction.
   */
  openingText: string;
  /**
   * What `openingText` is. "opening" (default): chapters 1–2 of a finished book. "setting": the run's setting
   * artifact (Agent 1), so a cover can be painted FIRST, while the book is written — it carries no crime.
   */
  source?: "opening" | "setting";
}

/** The visual facts the cover is built from — the LLM's only job. */
export interface CoverAnchors {
  place: string;
  place_details: string[];
  time_of_day: string;
  weather: string;
  season: string;
  /** One object that appears in the opening chapters and can be drawn (the first accepted candidate). */
  clue_object: string;
  /** Every candidate that passed the crime filter — a cover draws one at random. Older anchors files lack it. */
  clue_candidates?: string[];
  mood: string;
  /** A figure seen in the opening, described without a name, or null. */
  figure: string | null;
  era_details: string[];
  /**
   * The decade the TEXT sets the story in ("1940s"), or null. Used to stay true to the decade when the run gives
   * no era (MEASURED 2026-10-03: a UI story with no run-params drew a 1930s card for a book of unknown era).
   */
  decade?: string | null;
  /** Candidates the crime filter refused (anchors.ts CRIME_OBJECT_RE / CRIME_PLACE_RE). */
  rejected?: string[];
  /** "llm" when the model supplied them, "fallback" when they were derived from the inputs alone. */
  source: "llm" | "fallback";
}

/**
 * One cover's draw: a card or a blend (palette + medium from `primary`, layout + motifs from `secondary`), plus
 * the framing (what/where), two mystery touches, the light and the object — all from one seeded rng.
 */
export interface StyleChoice {
  primary: StyleCard;
  secondary?: StyleCard;
  palette: Palette;
  framing?: import("./framings.js").Framing;
  touches?: string[];
  light?: string;
  /** One of the anchors' accepted objects. */
  object?: string;
}

export interface CoverBrief {
  id: string;
  styles: string[];
  palette: string;
  framing: string;
  /** The rng seed for the whole call — pass it back (`--seed`) to reproduce these covers. */
  seed?: number;
  prompt: string;
  /** The exact title the image was asked to letter. */
  title: string;
  inks: string[];
}

export interface ImageRequest {
  prompt: string;
  /** "1024x1536" — portrait 2:3. */
  size: string;
  quality: "low" | "medium" | "high";
}

export interface ImageResult {
  png: Buffer;
  provider: string;
  model: string;
  usage?: Record<string, unknown>;
  latencyMs: number;
}

export interface ImageClient {
  readonly provider: string;
  readonly model: string;
  generate(req: ImageRequest): Promise<ImageResult>;
}

/** The structural slice of @cml/llm-client's ChatCapableClient this package needs. */
export interface CoverChatClient {
  chat(options: {
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
    logContext?: { runId: string; projectId: string; agent: string };
  }): Promise<{ content: string; cost?: number }>;
}

export interface CoverRecord {
  briefId: string;
  /** The vision read-back of the lettered title (title-check.ts). Absent when no checker ran. */
  titleCheck?: { ok: boolean; read: string; attempts: number };
  styles: string[];
  palette: string;
  framing?: string;
  briefPath: string;
  artPath?: string;
  coverPath?: string;
  error?: string;
  image?: { provider: string; model: string; quality: string; latencyMs: number; usage?: Record<string, unknown> };
}

export interface CoverManifest {
  title: string;
  generatedAt: string;
  dryRun: boolean;
  /** Reproduce with the same anchors + style spec + this seed. */
  seed: number;
  anchors: CoverAnchors;
  covers: CoverRecord[];
  /** The cover the pipeline treats as THE cover (first successful), relative to the out dir. */
  primary?: string;
}
