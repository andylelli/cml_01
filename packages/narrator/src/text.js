/* ------------------------------------------------------------------ *
 * Story text -> chapters -> synthesis chunks -> SSML.
 *
 * Azure caps one real-time synthesis request at 10 minutes of audio, so a
 * 10k-word story cannot go over in one piece. Chunking is therefore not an
 * optimisation, it is the only way the request succeeds - and it is what
 * makes progress, caching and resume possible.
 * ------------------------------------------------------------------ */

const SCENE_BREAK = /^\s*(?:\*\s*\*\s*\*|-\s*-\s*-|___|\*{3,}|#{3,})\s*$/;

/**
 * Private-use sentinels marking emphasis through the whole text pipeline.
 *
 * Italics in the prose are not decoration to be deleted - in a fair-play
 * mystery the stressed word is frequently the clue ("she said she SAW him").
 * Marking them here lets ssml.js turn them into <emphasis> after escaping,
 * instead of throwing the author stress away.
 */
export const EM_OPEN = '\uE000';
export const EM_CLOSE = '\uE001';
export const ST_OPEN = '\uE002';
export const ST_CLOSE = '\uE003';

/** Strip emphasis markers - they must never reach a word or char count. */
export function withoutMarkers(s) {
  return String(s).replace(/[\uE000-\uE006]/g, '');
}

/** Markdown -> speakable plain text. A narrator must not read "**" aloud. */
export function stripMarkdown(line) {
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')           // images: drop entirely
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')        // links: keep the label
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')          // code spans
    .replace(/(\*\*\*|___)(.*?)\1/g, `${ST_OPEN}$2${ST_CLOSE}`)  // bold+italic
    .replace(/(\*\*|__)(.*?)\1/g, `${ST_OPEN}$2${ST_CLOSE}`)     // bold
    .replace(/(?<![\w*])\*(?!\s)([^*]+?)(?<!\s)\*(?![\w*])/g, `${EM_OPEN}$1${EM_CLOSE}`) // italic
    .replace(/^\s{0,3}>\s?/, '')                    // blockquote marker
    .replace(/^\s{0,3}[-*+]\s+/, '')                // bullet marker
    .replace(/ /g, ' ')
    .trimEnd();
}

/**
 * Split a story into chapters on markdown headings.
 * An H1 is treated as the book title, H2/H3 as chapters. A story with no
 * headings at all becomes a single untitled chapter rather than failing.
 */
export function parseChapters(raw) {
  const lines = String(raw).replace(/\r\n/g, '\n').split('\n');
  const chapters = [];
  let title = null;
  let current = null;

  const push = () => {
    if (current && current.blocks.length) chapters.push(current);
    current = null;
  };

  let paragraph = [];
  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(' ').replace(/\s+/g, ' ').trim();
    if (text && current) current.blocks.push({ type: 'p', text });
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);

    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      const text = stripMarkdown(heading[2]).trim();
      if (level === 1 && !title && chapters.length === 0 && !current) {
        title = text;
        continue;
      }
      push();
      current = { title: text, blocks: [] };
      continue;
    }

    if (!current) current = { title: null, blocks: [] };

    if (SCENE_BREAK.test(line)) {
      flushParagraph();
      current.blocks.push({ type: 'break' });
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      continue;
    }

    paragraph.push(stripMarkdown(line).trim());
  }
  flushParagraph();
  push();

  return {
    title,
    chapters: chapters.map((c, i) => ({
      index: i,
      title: c.title || `Chapter ${i + 1}`,
      titled: Boolean(c.title),
      blocks: c.blocks,
    })),
  };
}

/** Split an over-long paragraph on sentence boundaries, never mid-sentence. */
function splitSentences(text, maxChars) {
  const sentences = text.match(/[^.!?]+(?:[.!?]+["')\]]*|$)\s*/g) || [text];
  const out = [];
  let buf = '';
  for (const s of sentences) {
    if (buf && buf.length + s.length > maxChars) {
      out.push(buf.trim());
      buf = '';
    }
    if (s.length > maxChars) {
      // A single sentence longer than the cap: fall back to a hard word split.
      if (buf.trim()) out.push(buf.trim());
      buf = '';
      let words = s.split(/\s+/);
      let line = '';
      for (const w of words) {
        if (line.length + w.length + 1 > maxChars) {
          out.push(line.trim());
          line = '';
        }
        line += w + ' ';
      }
      if (line.trim()) buf = line;
      continue;
    }
    buf += s;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

/**
 * Pack a chapter's blocks into chunks under maxChars.
 * Chunks never straddle a chapter, so every chapter gets its own audio file.
 */
export function chunkChapter(chapter, maxChars) {
  const chunks = [];
  let blocks = [];
  let size = 0;

  const flush = () => {
    if (!blocks.length) return;
    chunks.push({ blocks });
    blocks = [];
    size = 0;
  };

  if (chapter.titled) {
    blocks.push({ type: 'heading', text: chapter.title });
    size += chapter.title.length + 1;
  }

  for (const b of chapter.blocks) {
    if (b.type === 'break') {
      if (blocks.length) blocks.push(b);
      continue;
    }
    if (b.text.length > maxChars) {
      flush();
      for (const piece of splitSentences(b.text, maxChars)) {
        chunks.push({ blocks: [{ type: 'p', text: piece }] });
      }
      continue;
    }
    if (size + b.text.length > maxChars) flush();
    blocks.push(b);
    size += b.text.length + 1;
  }
  flush();

  return chunks.map((c, i) => ({
    ...c,
    index: i,
    chars: c.blocks.reduce((n, b) => n + (b.text ? withoutMarkers(b.text).length : 0), 0),
    text: c.blocks.map((b) => b.text || '').filter(Boolean).join('\n\n'),
  }));
}

/**
 * An untitled block before the first real chapter is front matter - a run id,
 * a generation date, a byline. Narrated, it becomes the opening line of the
 * audiobook, which is why it is detected rather than left to the reader.
 *
 * The guard matters: a pasted story with no headings at all is ONE untitled
 * chapter, and must never be mistaken for front matter and dropped.
 */
export function markFrontMatter(chapters) {
  const hasTitledChapter = chapters.some((c) => c.titled);
  return chapters.map((c) => ({
    ...c,
    isFrontMatter: c.index === 0 && !c.titled && hasTitledChapter,
  }));
}

/** Everything the UI needs to show before a single character is paid for. */
export function planStory(raw, { maxChunkChars = 2400, skipFrontMatter = true } = {}) {
  const { title, chapters } = parseChapters(raw);
  const planned = markFrontMatter(
    chapters.map((ch) => {
      const chunks = chunkChapter(ch, maxChunkChars);
      return {
        index: ch.index,
        title: ch.title,
        titled: ch.titled,
        chunks,
        chars: chunks.reduce((n, c) => n + c.chars, 0),
        words: chunks.reduce((n, c) => n + countWords(c.text), 0),
      };
    })
  ).map((c) => ({ ...c, skipped: skipFrontMatter && c.isFrontMatter }));

  const counted = planned.filter((c) => !c.skipped);
  const chars = counted.reduce((n, c) => n + c.chars, 0);
  const words = counted.reduce((n, c) => n + c.words, 0);
  return {
    title,
    chapters: planned,
    totals: {
      chapters: counted.length,
      chunks: counted.reduce((n, c) => n + c.chunks.length, 0),
      chars,
      words,
      // 150 wpm is a typical audiobook narration pace.
      estimatedMinutes: Math.round((words / 150) * 10) / 10,
    },
  };
}

export function countWords(s) {
  const m = withoutMarkers(s).trim().match(/\S+/g);
  return m ? m.length : 0;
}
