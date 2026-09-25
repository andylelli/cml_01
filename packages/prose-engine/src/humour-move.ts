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
