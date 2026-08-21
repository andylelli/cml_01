/**
 * Prose text sanitation — S4, second tranche (REVIEW_03 item 6).
 *
 * Everything here is a pure string transform on generated prose: mojibake repair, illegal control
 * characters, wrapped-paragraph normalisation, adjacent-word doubling, and the readability split
 * that keeps a chapter from shipping as one 3,000-character block.
 *
 * WHY IT LEFT `agent9-run.ts`. These functions have no dependency on the run, the context, the
 * client, or any flag — the file's orchestration function neither defines nor needs them, it just
 * calls them. `sanitizeProseText` and the two exported patterns are re-exported from `agent9-run.ts`
 * so every existing import path (and every test) keeps working unchanged.
 */

// ONE mojibake vocabulary — this file used to keep a second, shorter copy, and it is the one the
// release-gate HARD STOP reads. See MOJIBAKE_PATTERN for what the divergence cost.
import { MOJIBAKE_PATTERN } from "@cml/story-validation";

// ============================================================================
// Prose text sanitization helpers
// ============================================================================

const proseMojibakeReplacements: Array<[RegExp, string]> = [
  [/Ã¢â‚¬â„¢/g, "\u2019"],
  [/Ã¢â‚¬Ëœ/g, "\u2018"],
  // eslint-disable-next-line no-control-regex
  [/Ã¢â‚¬Å"|Ã¢â‚¬\x9d/g, "\u201D"],
  [/Ã¢â‚¬"|Ã¢â‚¬â€/g, "\u2014"],
  [/Ã¢â‚¬â€œ/g, "\u2013"],
  [/Ã¢â‚¬Â¦/g, "\u2026"],
  [/faË†Â§ade|fa\u02c6\u00a7ade/g, "fa\u00e7ade"],
  [/â€™/g, "\u2019"],
  [/â€˜/g, "\u2018"],
  // eslint-disable-next-line no-control-regex
  [/â€œ|â€\x9d/g, "\u201C"],
  [/â€"|â€"/g, "\u2014"],
  [/â€"/g, "\u2013"],
  [/â€¦/g, "\u2026"],
  [/â\u0080\u0099/g, "\u2019"],
  [/â\u0080\u0098/g, "\u2018"],
  [/â\u0080\u009c|â\u0080\u009d/g, "\u201C"],
  [/â\u0080\u0093/g, "\u2013"],
  [/â\u0080\u0094/g, "\u2014"],
  [/â\u0080\u00a6/g, "\u2026"],
  [/â\u0080\u00a2/g, "\u2022"],
  [/Ã\u201a/g, ""],
  [/Â/g, ""],
  [/\uFFFD/g, ""],
];

export const illegalControlCharPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
// persistentMojibakePattern: detects sequences that survived the replacement table above.
// Used as a hard-stop check after the chapter is written to disk — if any of these
// multibyte mojibake fragments appear, the repair table failed and the prose must be rejected.
export const persistentMojibakePattern =
  MOJIBAKE_PATTERN; // eslint-disable-line no-control-regex

export const normalizeWrappedParagraphText = (text: string) => {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim())
    .filter((block) => block.length > 0);
  return blocks.join("\n\n");
};

export const splitIntoFallbackChunks = (text: string, maxLength: number): string[] => {
  const fallbackChunks: string[] = [];
  let remaining = text.trim();
  while (remaining.length > maxLength) {
    const splitAt = remaining.lastIndexOf(" ", maxLength);
    const safeSplit = splitAt > Math.floor(maxLength * 0.55) ? splitAt : maxLength;
    fallbackChunks.push(remaining.slice(0, safeSplit).trim());
    remaining = remaining.slice(safeSplit).trim();
  }
  if (remaining.length > 0) fallbackChunks.push(remaining);
  return fallbackChunks.filter(Boolean);
};

export const splitLongParagraphForReadability = (paragraph: string, maxLength = 900): string[] => {
  const normalized = paragraph.trim();
  if (!normalized) return [];
  if (normalized.length <= maxLength) return [normalized];

  const sentences = normalized
    .split(/(?<=[.!?]["'\u201D\u2019]?)\s+(?=[A-Z0-9"\u201C\u2018])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return splitIntoFallbackChunks(normalized, maxLength);
  }

  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxLength && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  if (chunks.length <= 1 && normalized.length > maxLength) {
    return splitIntoFallbackChunks(normalized, maxLength);
  }

  return chunks;
};

/**
 * Words that may legitimately appear doubled in English prose and must NOT be collapsed by the
 * adjacent-duplicate sweep in sanitizeProseText: "he had had enough", "the fact that that happened",
 * the cleft "what it is is…". Everything else (e.g. "the the", "soft soft") is treated as an artefact.
 */
export const VALID_DOUBLED_WORDS = new Set(["had", "that", "is"]);

export const sanitizeProseText = (value: unknown) => {
  let text = typeof value === "string" ? value : value == null ? "" : String(value);
  text = text.normalize("NFC");
  for (const [pattern, replacement] of proseMojibakeReplacements) {
    text = text.replace(pattern, replacement);
  }
  return text
    .replace(/^Generated in scene batches\b.*$/gim, "")
    // Collapse accidental adjacent duplicate words ("the the" → "the", "soft soft" → "soft"),
    // preserving the first word's case and the grammatical doublings in VALID_DOUBLED_WORDS.
    // The trailing \b stops false positives where a word merely prefixes the next ("the thermometer").
    .replace(/\b(\w+)\s+\1\b/gi, (match, word: string) =>
      VALID_DOUBLED_WORDS.has(word.toLowerCase()) ? match : word,
    )
    // Fix possessive+article bleed: "my The Study" → "the Study"; "in my The Library" → "in the Library"
    .replace(/\b(my|your|his|her|our|their)\s+(The|A|An)\s+/gi, (_, _poss, art) => `${art.toLowerCase()} `)
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(illegalControlCharPattern, "")
    .replace(/\u00A0/g, " ")
    .replace(/\t/g, " ")
    .replace(/\r\n/g, "\n")
    // Dialogue punctuation normalization
    .replace(/"([^"]*)"/g, "\u201C$1\u201D")
    .replace(/(\w)'(\w)/g, "$1\u2019$2")
    .replace(/--/g, "\u2014")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+$/gm, "")
    .trim();
};

export const enforceReadableParagraphFlow = (paragraphs: string[]): string[] => {
  let normalized = paragraphs
    .map((paragraph) => normalizeWrappedParagraphText(sanitizeProseText(paragraph)))
    .flatMap((paragraph) => paragraph.split(/\n{2,}/))
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .flatMap((paragraph) => splitLongParagraphForReadability(paragraph));

  let guard = 0;
  while (normalized.length < 3 && guard < 4) {
    const longestIndex = normalized.reduce(
      (bestIdx, paragraph, idx, arr) =>
        paragraph.length > arr[bestIdx].length ? idx : bestIdx,
      0,
    );
    const longest = normalized[longestIndex] ?? "";
    if (longest.length < 500) break;

    const splitChunks = splitLongParagraphForReadability(
      longest,
      Math.max(280, Math.floor(longest.length / 2)),
    );
    if (splitChunks.length <= 1) break;

    normalized = [
      ...normalized.slice(0, longestIndex),
      ...splitChunks,
      ...normalized.slice(longestIndex + 1),
    ];
    guard += 1;
  }

  return normalized;
};
