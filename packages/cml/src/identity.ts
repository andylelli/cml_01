/**
 * Name matching across a cast: word-bounded and surname-aware, never a raw substring ("Ann" must not match
 * "Joanna"). CR-12 (A1X-01): moved verbatim from apps/worker/src/jobs/agents/identity-match.ts so every
 * package can use the one body.
 */

import { escapeRegExp as escapeRegExpLiteral } from "./text-patterns.js";

/** Last whitespace-separated token, lower-cased — the surname for "Ada Blythe" → "blythe". */
export const surname = (value: string | undefined): string =>
  String(value ?? "").trim().split(/\s+/).pop()?.toLowerCase() ?? "";


/**
 * Exact (case-insensitive) match OR shared surname. Deliberately NOT a raw substring match —
 * `"Ann".includes`-style logic false-positives on "Joanna"/"Annabelle". Mirrors prose-blind-reader's
 * surname matcher.
 */
export const namesMatch = (a: string | undefined, b: string | undefined): boolean => {
  const x = String(a ?? "").trim().toLowerCase();
  const y = String(b ?? "").trim().toLowerCase();
  if (!x || !y) return false;
  if (x === y) return true;
  const sa = surname(x);
  const sb = surname(y);
  return Boolean(sa) && sa === sb;
};

/**
 * Does `text` mention the person `name` as a WHOLE WORD (not a substring)? Matches the full name
 * (word-bounded) or, failing that, the surname (≥3 chars, word-bounded) so "A porter cleared Ada
 * Blythe" or "...cleared Blythe" both count, but "Annabelle" never matches suspect "Ann".
 */
export const nameAppearsAsWord = (name: string | undefined, text: string | undefined): boolean => {
  const n = String(name ?? "").trim();
  const t = String(text ?? "");
  if (!n || !t) return false;
  if (new RegExp(`\\b${escapeRegExpLiteral(n)}\\b`, "i").test(t)) return true;
  const sn = surname(n);
  if (sn.length >= 3) {
    return new RegExp(`\\b${escapeRegExpLiteral(sn)}\\b`, "i").test(t);
  }
  return false;
};

/**
 * A6-07 (CR-12) — which cast member a free-text guess names, or null when it names nobody or is ambiguous.
 *
 * Agent 6 compared a blind reader's guess with the culprit by two-way `includes`, which fails both ways: it rejects
 * "Mr. Montague" for "Charles Montague", and accepts "Reginald Gresham" for "Reginald Gresham Jr." (the second name
 * contains the first). Resolved here against the whole cast, in order: the exact name (titles dropped); the longest cast
 * name the guess contains as whole words; then a surname, with its suffix, that one member alone carries; then a first
 * name one member alone carries. Anything a second member could answer to is ambiguous, and an ambiguous guess names
 * nobody.
 */
const TITLE = /^(?:mr|mrs|ms|miss|master|dr|doctor|sir|dame|lady|lord|captain|capt|colonel|col|major|inspector|sergeant|constable|reverend|rev|father|professor|prof|the)$/;
const SUFFIX = /^(?:jr|sr|junior|senior|ii|iii|iv)$/;
const wordsOfName = (value: string): string[] =>
  String(value ?? "").toLowerCase().replace(/[^a-z'\s-]/g, " ").split(/\s+/).filter(Boolean).filter((w) => !TITLE.test(w));
const partsOfName = (value: string): { words: string[]; first: string; last: string; suffix: string } => {
  const words = wordsOfName(value);
  const suffix = words.length > 1 && SUFFIX.test(words[words.length - 1]!) ? words[words.length - 1]! : "";
  const core = suffix ? words.slice(0, -1) : words;
  return { words, first: core[0] ?? "", last: core[core.length - 1] ?? "", suffix };
};
const containsWords = (hay: string[], needle: string[]): boolean => {
  if (needle.length === 0 || needle.length > hay.length) return false;
  for (let i = 0; i + needle.length <= hay.length; i += 1) if (needle.every((w, j) => hay[i + j] === w)) return true;
  return false;
};

export const resolveGuessToCastMember = (guess: string | undefined, castNames: ReadonlyArray<string>): string | null => {
  const g = partsOfName(String(guess ?? ""));
  if (g.words.length === 0) return null;
  const cast = castNames.map((name) => ({ name, ...partsOfName(name) })).filter((m) => m.words.length > 0);
  const only = <T extends { name: string }>(xs: T[]): string | null => (xs.length === 1 ? xs[0]!.name : null);

  const exact = cast.filter((m) => m.words.join(" ") === g.words.join(" "));
  if (exact.length > 0) return only(exact);

  const contained = cast.filter((m) => containsWords(g.words, m.words));
  if (contained.length > 0) {
    const longest = Math.max(...contained.map((m) => m.words.length));
    return only(contained.filter((m) => m.words.length === longest));
  }

  const bySurname = cast.filter((m) => m.last && g.words.includes(m.last) && m.suffix === g.suffix && m.words.length > 1);
  if (bySurname.length > 0) return only(bySurname);

  const byFirst = cast.filter((m) => m.first && g.first === m.first);
  return only(byFirst);
};

/** Does the guess name `member` (and nobody else in the cast)? */
export const guessNamesMember = (guess: string | undefined, member: string | undefined, castNames: ReadonlyArray<string>): boolean => {
  const named = resolveGuessToCastMember(guess, castNames);
  return named !== null && named === String(member ?? "").trim();
};
