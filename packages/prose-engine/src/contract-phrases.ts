/**
 * The fixed wording of the per-chapter contract, owned here so two things can read it: the renderer
 * that puts it in front of the writer, and the checker that looks for it coming back out as prose.
 *
 * THE THREE READS OF 2026-09-22 named our own instructions on the page: "flat answer" x4, "six words
 * or fewer" x3, "delivered a speech" x3 on one book; "unmeant joke" x7 and "the outcome was settled"
 * on another. A_67 said an illustrative phrase in a prompt is reproduced; these are the phrases.
 * The labels are gone from the prompt (see `run.ts`), and what remains is listed here so the
 * instruction-echo checker can catch whatever still comes back.
 */
export const TEMPLATE = {
  opensOnSettledOutcome: "Opens on the settled outcome",
  humanBeat: "one human beat",
  settleInClause: "settle the rest in a clause",
  shownAsAction: "shown as an action and never explained",
  referNotStage: "refer to it, do not stage it again",
  readerCanUse: "A reader must be able to use, from this chapter",
  veryShortAnswer: "the very short answer",
  shortReplyToLongSpeech: "the short reply to a long speech",
  funnierThanMeant: "the line that is funnier than its speaker meant",
  twoExchanges: "Two exchanges this chapter",
} as const;

/** Every template phrase, for the echo checker. */
export const CONTRACT_TEMPLATE_PHRASES: ReadonlyArray<string> = Object.values(TEMPLATE);
