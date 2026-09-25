/**
 * 17-hitting-90 P4.2 — a humour style is a MOVE the writer performs, never a label it can print.
 *
 * MEASURED 2026-09-25: Agent 2b's `humourStyle` enum value `polite_savagery` reached the writer as
 * the words "polite savagery" twelve times in one book's prompts (the bible's `Humour:` line, the
 * brief's "funny in one way only", the scene contract's wit beat), and the reader quoted it back as
 * a repeated tag — *"polite savagery … Use each once or twice, not as a recurring tag."* What is
 * shown is copied (A_67). Each style is therefore described as the thing the character DOES, in
 * words no sentence of prose would carry.
 */
const MOVES: Record<string, string> = {
  understatement: "says less than the thing deserves and lets the gap do the work",
  dry_wit: "makes the joke in the same voice as the facts, and keeps a straight face through it",
  polite_savagery: "says the cruellest thing in the room in its most courteous form",
  self_deprecating: "makes the joke at their own expense before anybody else can",
  observational: "notices the one small absurd thing everybody else walked past",
  deadpan: "delivers the absurd line as if reporting the weather",
  sardonic: "mocks with a straight face and half expects to be caught at it",
  blunt: "says the plain thing everybody in the room was avoiding",
};

/** The move for a style; an unknown style falls back to the style's own words, spaces for underscores. */
export const humourMove = (style: unknown): string => {
  const key = String(style ?? "").trim().toLowerCase();
  return MOVES[key] ?? key.replace(/_/g, " ");
};

/** Every move, for the echo finder: none of these should come back as prose either. */
export const HUMOUR_MOVE_PHRASES: ReadonlyArray<string> = Object.values(MOVES);

/**
 * 17-hitting-90 §06 R3 — the move, narrated. The premise above ("words no sentence of prose would
 * carry") was false on run 98dec72a: "her humor at her own expense" x5, "the plain truth everyone else
 * had avoided", "less than the moment deserved", "keeping his face straight", "the cruellest thing in
 * the room" — 15 in one book, against 0 on pair 3 and 1 on pair 2. The narrator names the move instead
 * of letting the line perform it.
 *
 * A narration sentence (outside quotation marks) carrying two of one move's distinctive words, each
 * matched on its first five letters so "cruel"/"cruellest" and "courteous"/"courtesy" meet.
 */
/** Each move's distinctive words as five-letter prefixes, written out: the list is fixed and short. */
/**
 * Each move's core, as one pattern: its own phrase, or two of its words within a short span. Word
 * pairs alone were measured first and read ordinary prose as a label on the older books — "the strain
 * on his face", "caught … face", "no more, no less … the gap" (47 of the first 127 corpus hits).
 */
const MOVE_SIGNATURES: Record<string, RegExp> = {
  understatement: /\b(?:less than|gap between)\b.{0,60}\bdeserv/i,
  dry_wit: /\bstraight face\b|\bface straight\b/i,
  polite_savagery: /\bcruel\w*\b.{0,60}\b(?:courte|polite)|\b(?:courte|polite)\w*\b.{0,60}\bcruel/i,
  self_deprecating: /\b(?:at (?:his|her|their) own expense|joke at (?:his|her|their) own)\b/i,
  observational: /\bsmall absurd\b|\babsurd thing\b/i,
  deadpan: /\babsurd\b.{0,60}\bweather\b/i,
  sardonic: /\bmock\w*\b.{0,60}\bcaught\b/i,
  blunt: /\bplain (?:thing|truth)\b.{0,60}\bavoid/i,
};

/** The move a narration sentence names, or null. */
export const narratedMove = (sentence: string): string | null => {
  const narration = sentence.replace(/["“][^"“”]*(?:["”]|$)/g, " ").replace(/^[^"“]*["”]/, " ");
  for (const [style, signature] of Object.entries(MOVE_SIGNATURES)) {
    if (signature.test(narration)) return MOVES[style]!;
  }
  return null;
};
