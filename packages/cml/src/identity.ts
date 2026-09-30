/**
 * Name matching across a cast: word-bounded and surname-aware, never a raw substring ("Ann" must not match
 * "Joanna"). CR-12 (A1X-01): moved verbatim from apps/worker/src/jobs/agents/identity-match.ts so every
 * package can use the one body.
 */

/** Last whitespace-separated token, lower-cased — the surname for "Ada Blythe" → "blythe". */
export const surname = (value: string | undefined): string =>
  String(value ?? "").trim().split(/\s+/).pop()?.toLowerCase() ?? "";

const escapeRegExpLiteral = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
