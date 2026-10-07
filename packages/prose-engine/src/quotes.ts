/**
 * A_111 — a quotation the page cannot parse: an opening quote while one is already open, or a closing quote while none
 * is, inside one paragraph. (Speech that runs across a paragraph break opens each paragraph and closes only the last;
 * paragraphs are scanned on their own, so that convention is never counted.)
 *
 * MEASURED on the arm-D book: its reveal shipped as `the motion deliberate. "Adela looked from Ivor to Harriet, her
 * voice steady. "You killed Cecil Thorne."` — the writer's draft was clean ("Let it be clear: Ivor Yardley killed Cecil
 * Thorne."); an editor repair of a `flat_reveal` finding wrote the nested quote, and no guard measured it. Arm A′ (read
 * 88) shipped 14 such paragraphs, e.g. `""The killer entered…` and `"The rest is dust and years. Adela traced…`.
 *
 * A straight quote is classified by what FOLLOWS it: before a letter, a digit, an opening mark or an ellipsis it opens;
 * otherwise it closes — so `circumstances—"` at a paragraph's end and `mean—" before` both close.
 */
const OPENS_BEFORE = /[A-Za-z0-9‘'“…("]/;

/** The quotation defects in one paragraph. */
export const paragraphQuoteDefects = (paragraph: string): number => {
  let defects = 0;
  let open = false;
  for (let i = 0; i < paragraph.length; i += 1) {
    const c = paragraph[i];
    if (c !== '"' && c !== "“" && c !== "”") continue;
    const next = i + 1 < paragraph.length ? paragraph[i + 1]! : " ";
    const opener = c === "“" || (c === '"' && OPENS_BEFORE.test(next));
    if (opener) {
      if (open) defects += 1;
      open = true;
    } else {
      if (!open) defects += 1;
      open = false;
    }
  }
  return defects;
};

/** The quotation defects in a text of paragraphs separated by blank lines (or an array of paragraphs). */
export const quoteDefects = (text: string | ReadonlyArray<string>): number =>
  (typeof text === "string" ? text.split(/\n\s*\n/) : text).reduce((n, p) => n + paragraphQuoteDefects(p), 0);
