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
