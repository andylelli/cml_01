/**
 * ONE SENTENCE SPLITTER FOR EVERY CHECKER.
 *
 * The checkers each split on `(?<=[.!?])\s+`, which ends a sentence at every honorific. A Golden Age
 * cast is made of them: on the first fresh v2 book (run 98dec72a) `"Order, Mr. Wentworth insists,"`
 * was said three times and the catchphrase checker counted it zero times, because "Mr." cut the
 * quotation in two and neither half matched a quoted line. MEASURED on that book.
 *
 * A boundary is a terminal mark, optionally closed by a quotation mark or bracket, then whitespace,
 * then something that can open a sentence — a capital, a digit or an opening quotation mark — and
 * the word before the mark is not an abbreviation or a single initial.
 */

const ABBREVIATIONS = new Set(
  (
    "mr mrs ms messrs mme mlle dr st prof rev revd fr capt col gen lt sgt insp supt cmdr maj hon sr jr " +
    "no nos vol pp ch fig esq bros co"
  ).split(" "),
);

const BOUNDARY = /([.!?]+)(["'”’)\]]*)(\s+)(?=["'“‘(\[]?[A-Z0-9])/g;

export const splitSentences = (text: string): string[] => {
  const source = String(text ?? "");
  const out: string[] = [];
  let start = 0;
  for (const match of source.matchAll(BOUNDARY)) {
    const end = (match.index ?? 0) + match[1]!.length + match[2]!.length;
    if (match[1] === ".") {
      const before = source.slice(start, match.index).match(/([A-Za-z]+)$/)?.[1] ?? "";
      if (ABBREVIATIONS.has(before.toLowerCase())) continue;
      if (/^[A-Z]$/.test(before)) continue; // an initial: "J. Pike"
    }
    const sentence = source.slice(start, end).trim();
    if (sentence) out.push(sentence);
    start = end + match[3]!.length;
  }
  const tail = source.slice(start).trim();
  if (tail) out.push(tail);
  return out;
};

/**
 * Six-word runs said twice inside ONE paragraph (six catches the restated opening, "she returned to
 * the ladder base"; over the v2-era books it adds one hit in two, against seven). The matched pair on run 98dec72a (read 74) carried
 * six, and none was a whole repeated sentence: a clause doubled inside a sentence ("his shoes catching
 * on the thick Persian carpet …, his shoes catching on …"), a spoken line put at the front of its
 * paragraph and left in place too, a sentence restated as the next one's opening. A run that is a
 * clock value is the locked form a time must take, and is left alone.
 */
const CLOCK_RUN =
  /\bo'clock\b|\b(?:half|quarter) (?:past|to)\b|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|forty|fifty)(?:-\w+)? (?:minutes )?(?:past|to) (?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|midnight|noon)\b/;
export const repeatedRuns = (paragraph: string, size = 6): string[] => {
  const words = String(paragraph ?? "").toLowerCase().replace(/[^a-z'\s]/g, " ").split(/\s+/).filter(Boolean);
  const seen = new Map<string, number>();
  for (let i = 0; i + size <= words.length; i += 1) {
    const run = words.slice(i, i + size).join(" ");
    seen.set(run, (seen.get(run) ?? 0) + 1);
  }
  return [...seen].filter(([run, n]) => n > 1 && !CLOCK_RUN.test(run)).map(([run]) => run);
};
