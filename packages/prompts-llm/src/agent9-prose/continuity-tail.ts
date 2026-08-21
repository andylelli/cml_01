/**
 * Keep atmosphere out of the continuity tail, so the next chapter does not echo it.
 *
 * The tail is the prior-chapter summary fed forward into the next chapter's prompt. Its job is
 * continuity of PLOT; an atmosphere phrase carried in it is an invitation to repeat that phrase, and
 * repeated atmosphere is one of the things external reads notice.
 *
 * ⚠️ MEASURED 2026-08-20, and the list below is ARBITRARY — recorded here because it had no comment
 * at all and the next person should not mistake it for a considered vocabulary.
 *
 * Across 191 archived manuscripts these five occur 316 times in 110 of them, so this fires often and
 * is not dead code. But ranking every candidate atmosphere phrase by corpus frequency puts the list
 * at five of the top ten, and lets the other five through — including the joint-MOST repeated:
 *
 *     122  cold air        <- not banned
 *     122  coal smoke         banned
 *      81  pale light      <- not banned
 *      76  damp air        <- not banned
 *      75  grey light      <- not banned
 *      71  damp earth         banned
 *      68  spring rain        banned
 *      50  salt air           banned
 *      43  night air       <- not banned
 *       5  sea fog            banned
 *
 * It is also SETTING-SPECIFIC in a generator whose setting is a parameter: "salt air" and "sea fog"
 * are seaside, "coal smoke" is industrial, "damp earth" rural, "spring rain" a season. On a story
 * this list does not fit, the mechanism does nothing; on one it half-fits, it strips half the echoes.
 *
 * **The shape is probably wrong, not just the contents.** A list cannot be completed — the right rule
 * is repetition ("has this phrase already gone forward in an earlier tail?"), which needs no
 * vocabulary and works in any setting. That is a design change with a real false-positive surface
 * (some repetition is deliberate motif), so it is left as a decision rather than made here. Widening
 * the list instead would only move the arbitrary line.
 *
 * This matters more than its size suggests: `atmosphere` is one of the three categories that has
 * never moved off 8 and has never drawn a reader complaint (REVIEW_13 §2.3), and this is one of the
 * very few mechanisms in the pipeline that touches it at all.
 */
const CONTINUITY_TAIL_BANNED_ATMOSPHERE_RE = /\b(salt air|damp earth|coal smoke|spring rain|sea fog)\b/gi;

export const sanitizeContinuityTailForPrompt = (rawTail: string): string => {
  const normalized = rawTail.replace(/\s+/g, " ").trim();
  if (!normalized) return normalized;

  const sentences = (normalized.match(/[^.!?]+[.!?]*/g) ?? [normalized])
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const filtered = sentences.filter((sentence) => {
    CONTINUITY_TAIL_BANNED_ATMOSPHERE_RE.lastIndex = 0;
    return !CONTINUITY_TAIL_BANNED_ATMOSPHERE_RE.test(sentence);
  });
  if (filtered.length > 0) {
    return filtered.join(" ").replace(/\s+/g, " ").trim();
  }

  CONTINUITY_TAIL_BANNED_ATMOSPHERE_RE.lastIndex = 0;
  return normalized
    .replace(CONTINUITY_TAIL_BANNED_ATMOSPHERE_RE, "the surrounding air")
    .replace(/\s+/g, " ")
    .trim();
};
