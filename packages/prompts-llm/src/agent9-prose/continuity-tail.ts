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
