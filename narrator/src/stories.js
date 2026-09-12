import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { REPO_ROOT, config } from './config.js';
import { countWords } from './text.js';

/* ------------------------------------------------------------------ *
 * The story picker, gated on the external read score.
 *
 * A book is only offered for narration once a reader has scored it at or above
 * the threshold. The score comes from the chatgpt-review.txt sitting next to
 * the manuscript, parsed by the pipeline's OWN parser - not a second copy.
 *
 * That parser matters: it distinguishes the stated mark from the read's
 * FORECAST ("with the timing clarified this could reach 89-91/100"), and a
 * category table from a chapter-by-chapter review whose sections each end in a
 * bare "Mark: 6/10". A naive /100 match records the aspiration as the score.
 * Re-implementing it here would be exactly the divergence that WF-002 warns
 * about, and here the copy would feed a WRITE: which books get narrated.
 * ------------------------------------------------------------------ */

const STORIES_DIR = path.join(REPO_ROOT, 'stories');
const LEDGER = path.join(REPO_ROOT, 'scripts', 'external-read-ledger.mjs');

let parserPromise = null;

/**
 * Load the pipeline's read parser. Failure is reported, never swallowed - if
 * the score cannot be read, the gate fails CLOSED rather than quietly offering
 * every unscored draft.
 */
async function loadParser() {
  if (!parserPromise) {
    parserPromise = import(pathToFileURL(LEDGER).href)
      .then((m) => {
        if (typeof m.parseExternalRead !== 'function') {
          throw new Error('external-read-ledger.mjs has no parseExternalRead export');
        }
        return m.parseExternalRead;
      })
      .catch((e) => {
        parserPromise = null;
        throw new Error(`Could not load the score parser (${LEDGER}): ${e.message}`);
      });
  }
  return parserPromise;
}

/** The external read for one story folder, if a reader has left one. */
async function scoreFor(folderPath, parse) {
  let names = [];
  try {
    names = await fs.readdir(folderPath);
  } catch {
    return { score: null, reviewFile: null, reason: 'unreadable folder' };
  }
  const review = names.find((f) => /^chatgpt/i.test(f) && /\.(txt|md)$/i.test(f));
  if (!review) return { score: null, reviewFile: null, reason: 'no external read' };

  try {
    const parsed = parse(await fs.readFile(path.join(folderPath, review), 'utf8'));
    return {
      score: typeof parsed.final === 'number' ? parsed.final : null,
      derived: Boolean(parsed.finalDerived),
      reviewFile: review,
      reason: parsed.final == null ? 'read has no headline score' : null,
      problems: parsed.problems || [],
    };
  } catch (e) {
    return { score: null, reviewFile: review, reason: `unparsable read: ${e.message}` };
  }
}

/**
 * List narratable stories.
 * `includeUnscored` deliberately requires an explicit opt-in, so the default
 * path can only ever offer books that cleared the bar.
 */
export async function listStories({ limit = 60, includeUnscored = false } = {}) {
  const minScore = config().minStoryScore;

  let runs = [];
  try {
    runs = await fs.readdir(STORIES_DIR, { withFileTypes: true });
  } catch {
    return { available: false, dir: STORIES_DIR, stories: [], minScore };
  }

  let parse;
  try {
    parse = await loadParser();
  } catch (e) {
    // Fail closed: no parser means no verified scores, so offer nothing.
    return {
      available: true,
      dir: STORIES_DIR,
      stories: [],
      minScore,
      parserError: e.message,
    };
  }

  const all = [];
  for (const run of runs) {
    if (!run.isDirectory() || run.name.startsWith('_')) continue;
    const runDir = path.join(STORIES_DIR, run.name);

    let files = [];
    try {
      files = await fs.readdir(runDir);
    } catch {
      continue;
    }
    const md = files.filter((f) => f.toLowerCase().endsWith('.md'));
    if (!md.length) continue;

    const rated = await scoreFor(runDir, parse);

    for (const f of md) {
      const full = path.join(runDir, f);
      let stat;
      try {
        stat = await fs.stat(full);
      } catch {
        continue;
      }
      all.push({
        id: `${run.name}/${f}`,
        run: run.name,
        file: f,
        bytes: stat.size,
        modified: stat.mtime.toISOString(),
        ...rated,
      });
    }
  }

  all.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || b.modified.localeCompare(a.modified));

  const passing = all.filter((s) => typeof s.score === 'number' && s.score >= minScore);
  const belowThreshold = all.filter((s) => typeof s.score === 'number' && s.score < minScore);
  const unscored = all.filter((s) => typeof s.score !== 'number');

  const shown = (includeUnscored ? all : passing).slice(0, limit);

  // Word counts only for what is actually offered - reading every book is slow.
  for (const s of shown) {
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

  return {
    available: true,
    dir: STORIES_DIR,
    minScore,
    stories: shown,
    counts: {
      total: all.length,
      passing: passing.length,
      belowThreshold: belowThreshold.length,
      unscored: unscored.length,
    },
    // Named so the UI can say exactly what was withheld and why.
    withheld: [
      ...belowThreshold.map((s) => ({ id: s.id, score: s.score, reason: `scored ${s.score}` })),
      ...unscored.map((s) => ({ id: s.id, score: null, reason: s.reason || 'no score' })),
    ],
  };
}

/**
 * Read one story, refusing any id that escapes the stories directory AND any
 * story that has not cleared the score gate. The check is repeated here on
 * purpose: the picker is a convenience, this is the actual enforcement point.
 */
export async function readStory(id, { enforceScore = true } = {}) {
  const full = path.resolve(STORIES_DIR, id);
  const rel = path.relative(STORIES_DIR, full);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    const err = new Error('Story path is outside the stories directory.');
    err.status = 400;
    throw err;
  }

  if (enforceScore) {
    const minScore = config().minStoryScore;
    const parse = await loadParser();
    const rated = await scoreFor(path.dirname(full), parse);
    if (typeof rated.score !== 'number') {
      const err = new Error(
        `"${path.basename(id)}" has no external read score (${rated.reason}). Only stories scoring ${minScore}+ can be narrated.`
      );
      err.status = 422;
      throw err;
    }
    if (rated.score < minScore) {
      const err = new Error(
        `"${path.basename(id)}" scored ${rated.score}. Only stories scoring ${minScore}+ can be narrated.`
      );
      err.status = 422;
      throw err;
    }
  }

  const text = await fs.readFile(full, 'utf8');
  const h1 = /^#\s+(.+)$/m.exec(text);
  return { text, title: h1 ? h1[1].trim() : path.basename(full, '.md').replace(/_/g, ' ') };
}
