/* ------------------------------------------------------------------ *
 * Prose artifact -> narratable markdown.
 *
 * The store holds prose as
 *   { title, chapters: [{ title, summary, paragraphs: string[] }] }
 * and the rest of this package speaks markdown, so this is the single seam
 * between the pipeline's data and the narrator's text pipeline.
 * ------------------------------------------------------------------ */

const asArray = (v) => (Array.isArray(v) ? v : []);
const asText = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * Chapter summaries are editorial scaffolding, not prose. Narrated, a summary
 * announces what is about to happen and spoils the chapter before it starts -
 * the same class of defect as the run-id front matter that would otherwise
 * have opened every audiobook. Excluded by default, and there is no good
 * reason to pass `includeSummaries`; it exists so the omission is visible.
 */
export function proseToMarkdown(payload, { includeSummaries = false, fallbackTitle } = {}) {
  const src = payload && typeof payload === 'object' ? payload : {};
  const title = asText(src.title) || asText(fallbackTitle) || 'Untitled story';
  const chapters = asArray(src.chapters);

  const lines = [`# ${title}`, ''];
  let spoken = 0;

  chapters.forEach((raw, i) => {
    const chapter = raw && typeof raw === 'object' ? raw : {};
    const heading = asText(chapter.title) || `Chapter ${i + 1}`;
    lines.push(`## ${heading}`, '');

    if (includeSummaries) {
      const summary = asText(chapter.summary);
      if (summary) lines.push(summary, '');
    }

    for (const para of asArray(chapter.paragraphs)) {
      const text = asText(para);
      if (!text) continue;
      lines.push(text, '');
      spoken += 1;
    }
  });

  return {
    markdown: lines.join('\n').trimEnd() + '\n',
    title,
    chapters: chapters.length,
    paragraphs: spoken,
    summariesIncluded: Boolean(includeSummaries),
  };
}

/**
 * Pick the manuscript to narrate from the artifacts on hand.
 * Mirrors the order the PDF route uses, so the audio and the PDF are never
 * quietly built from different versions of the same book.
 */
export function pickProseArtifact(byType, preferredLength) {
  const order = preferredLength
    ? [`prose_${preferredLength}`]
    : ['prose_medium', 'prose_short', 'prose_long', 'prose'];
  for (const type of order) {
    const found = byType[type];
    if (found) return { type, artifact: found };
  }
  if (!preferredLength) return null;
  return pickProseArtifact(byType, null);
}
