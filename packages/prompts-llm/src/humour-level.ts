/**
 * HUMOUR LEVEL — a story parameter, in the same family as tone and era.
 *
 * Until now humour was decided entirely inside the pipeline: Agent 2b chose each character's style
 * and level, and Agent 9 asked for one wit beat in every chapter. Nothing let a caller say "I want a
 * dry book" or "I want a sharp one", and nothing connected that wish to a number.
 *
 * ── WHY FOUR BANDS AND NOT A SLIDER ──────────────────────────────────────────────────────────────
 *
 * A slider would be a RATE, and this model complies with countable operations and ignores rates
 * (VoiceSpec asked for 22.0-word sentences and got 15.86, in 0 of 10 chapters). Each band therefore
 * resolves to two countable things: which STYLES the cast may be given, and in which CHAPTERS a wit
 * beat is asked for. Both are integers by the time they reach a prompt.
 *
 * ── THE BANDS ARE ANCHORED TO THE CANON, NOT INVENTED ────────────────────────────────────────────
 *
 * `wit-density.ts` measures four structural shapes and is calibrated over the 11 real Golden Age
 * novels: canon median 41.4 per 10k, canon floor 20.6, our own median 11.4. `classic` is the band
 * that targets the canon median, because that is what the genre actually does. The others sit
 * deliberately either side of it.
 *
 * `classic` is the DEFAULT and reproduces today's behaviour exactly: every chapter carries a beat and
 * no style is withheld. An absent or unrecognised value resolves to it, so nothing changes for any
 * caller that does not ask.
 */

export const HUMOUR_LEVELS = ["none", "dry", "classic", "sharp"] as const;
export type HumourLevel = (typeof HUMOUR_LEVELS)[number];

export const DEFAULT_HUMOUR_LEVEL: HumourLevel = "classic";

export interface HumourBand {
  level: HumourLevel;
  /** One line for the Agent 2b prompt: how much wit this cast carries. */
  castDirective: string;
  /** The styles Agent 2b may assign. Empty means every style is permitted. */
  permittedStyles: readonly string[];
  /** A wit beat is asked for in chapters where `chapterNumber % beatEvery === 0` — 1 means every chapter. */
  beatEvery: number;
  /** What `wit-density.ts` should read on a book written to this band, for the report. */
  targetPer10k: number;
}

const MILD = ["understatement", "deadpan", "self_deprecating"] as const;

export const HUMOUR_BANDS: Record<HumourLevel, HumourBand> = {
  none: {
    level: "none",
    castDirective:
      "This book carries NO humour. Every character takes humourStyle \"none\" and humourLevel 0.0. " +
      "They are earnest, tense or grief-stricken throughout. Do not soften this for any character.",
    permittedStyles: ["none"],
    beatEvery: 0,
    targetPer10k: 0,
  },
  dry: {
    level: "dry",
    castDirective:
      "This book is DRY rather than witty. At most TWO characters may be humorous at all, and neither " +
      "above humourLevel 0.3; every other character takes \"none\" and 0.0. Permitted styles are the " +
      "mild ones only — understatement, deadpan, self_deprecating. No character is a comic presence.",
    permittedStyles: MILD,
    beatEvery: 3,
    targetPer10k: 20,
  },
  classic: {
    level: "classic",
    castDirective: "",
    permittedStyles: [],
    beatEvery: 1,
    targetPer10k: 41,
  },
  sharp: {
    level: "sharp",
    castDirective:
      "This book is SHARP. At least THREE characters are humorous, at least one of them at " +
      "humourLevel 0.7 or above, and the sharper registers are wanted — polite_savagery, sardonic, " +
      "dry_wit, blunt. At least one character still takes \"none\": the contrast is what makes the " +
      "others land, and a cast where everybody is funny is a cast where nobody is.",
    permittedStyles: ["polite_savagery", "sardonic", "dry_wit", "blunt", "observational", "none"],
    beatEvery: 1,
    targetPer10k: 60,
  },
};

/** Anything absent or unrecognised is `classic`, which is today's behaviour. */
export const resolveHumourLevel = (value: unknown): HumourLevel => {
  const raw = String(value ?? "").trim().toLowerCase();
  return (HUMOUR_LEVELS as readonly string[]).includes(raw) ? (raw as HumourLevel) : DEFAULT_HUMOUR_LEVEL;
};

export const humourBand = (value: unknown): HumourBand => HUMOUR_BANDS[resolveHumourLevel(value)];

/** Does this chapter carry a wit beat under this band? */
export const chapterCarriesWitBeat = (value: unknown, chapterNumber: number): boolean => {
  const { beatEvery } = humourBand(value);
  if (beatEvery <= 0) return false;
  return Math.max(1, chapterNumber) % beatEvery === 0;
};
