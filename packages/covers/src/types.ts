/**
 * @cml/covers — shared shapes.
 *
 * The pipeline is: story → ANCHORS (one LLM call, spoiler-safe) → style CARD(S) chosen deterministically →
 * BRIEF composed from a template → IMAGE model → TYPESET title band → cover.png.
 * Only the brief reaches the image model; the sample images never do (documentation/covers §1, copyright).
 */

export interface Palette {
  name: string;
  /** Hex inks. The first is treated as the darkest/silhouette ink by convention, not by code. */
  inks: string[];
}

export interface TypeBand {
  position: "top";
  /** framed = a solid band with a rule; full-bleed = lettering straight onto the reserved area. */
  style: "framed" | "full-bleed";
  /** Fraction of the image height reserved for the title. */
  height: number;
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
  type_band: TypeBand;
  title_font: string;
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
  typeBand: TypeBand;
  titleFont: string;
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
