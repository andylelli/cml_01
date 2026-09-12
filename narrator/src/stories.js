import fs from 'node:fs/promises';
import path from 'node:path';
import { REPO_ROOT } from './config.js';
import { countWords } from './text.js';

/* Convenience: the CML pipeline already writes finished books to
 * <repo>/stories/<run>/<name>.md, so offer them directly rather than making
 * you find and upload a file you already have. */

const STORIES_DIR = path.join(REPO_ROOT, 'stories');

export async function listStories({ limit = 60 } = {}) {
  let runs = [];
  try {
    runs = await fs.readdir(STORIES_DIR, { withFileTypes: true });
  } catch {
    return { available: false, dir: STORIES_DIR, stories: [] };
  }

  const found = [];
  for (const run of runs) {
    if (!run.isDirectory()) continue;
    const runDir = path.join(STORIES_DIR, run.name);
    let files = [];
    try {
      files = await fs.readdir(runDir);
    } catch {
      continue;
    }
    for (const f of files) {
      if (!f.toLowerCase().endsWith('.md')) continue;
      const full = path.join(runDir, f);
      let stat;
      try {
        stat = await fs.stat(full);
      } catch {
        continue;
      }
      found.push({
        id: `${run.name}/${f}`,
        run: run.name,
        file: f,
        bytes: stat.size,
        modified: stat.mtime.toISOString(),
      });
    }
  }

  found.sort((a, b) => b.modified.localeCompare(a.modified));
  const slice = found.slice(0, limit);

  // Word counts only for what we actually show - reading every book is slow.
  for (const s of slice) {
    try {
      const text = await fs.readFile(path.join(STORIES_DIR, s.id), 'utf8');
      s.words = countWords(text);
      const h1 = /^#\s+(.+)$/m.exec(text);
      s.title = h1 ? h1[1].trim() : s.file.replace(/\.md$/i, '').replace(/_/g, ' ');
    } catch {
      s.words = 0;
      s.title = s.file;
    }
  }

  return { available: true, dir: STORIES_DIR, stories: slice, total: found.length };
}

/** Read one story, refusing any id that escapes the stories directory. */
export async function readStory(id) {
  const full = path.resolve(STORIES_DIR, id);
  const rel = path.relative(STORIES_DIR, full);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    const err = new Error('Story path is outside the stories directory.');
    err.status = 400;
    throw err;
  }
  const text = await fs.readFile(full, 'utf8');
  const h1 = /^#\s+(.+)$/m.exec(text);
  return { text, title: h1 ? h1[1].trim() : path.basename(full, '.md').replace(/_/g, ' ') };
}
