# 02 — v2 PARITY: WHAT v1 DOES BETTER, AND THE LEVER FOR EACH

Source: the two reads of seed 23403 (A_108 §3–§4), v1 `stories/story_20260924-1923`, v2
`stories/story_20260924-1935`, same case byte for byte. Each row names what the v2 reader said, what v1
does instead, and the operation that gives v2 the same thing. Operations are stated as **countable
things done**, because this model obeys those and ignores rates (CLAUDE.md; A_102 §7–§9).

---

## P1.1 — Late chapters shrink

**MEASURED.** Every v2 book tapers:

| book | chapter words, 1 → 10 |
|---|---|
| arm B, seed 23403 | 1244 915 1092 839 858 765 737 676 466 414 |
| arm A, same case, v1 | 1563 1271 1261 1192 1165 1423 1121 1297 1184 1096 |

The four A_101 v2 books show the same slope, ending in the 350–650 range.

**MEASURED cause, in part.** `planSegments` (`packages/prose-engine/src/segments.ts:57`) writes the
whole book in ONE call when its estimate fits inside 80% of the writer's 32,768-token cap. A ten-chapter
book at ~1,000 words × 1.45 tokens is ~14,500 — so it always fits, and the log for arm B shows a single
segment `S0`. The brief asks for "at least 12 paragraphs of four sentences in each chapter"
(`brief.ts:239`); one call honours that early and compresses as it goes.

**INFERRED:** the taper is the model spending its sense of the whole on the opening. v1, which writes
chapter by chapter, has no taper.

**Lever:** write in act-sized segments always — `CHAPTERS_PER_ACT_SEGMENT = 4`, three calls for a
ten-chapter book — behind a flag. Each segment gets the prior chapters' summaries (`priorChapters`
already exists). **Prediction:** the last three chapters' mean rises from 519 words to over 850, and
the book from 8,044 to over 10,000, with the same brief. One v2 prose pair, ~£0.30, settles it.

If segmenting alone does not lift the end, the fallback is per-chapter paragraph counts in each
chapter's own brief line, not the book-level sentence.

## P1.2 — The proof lands on the wrong person

**Reader (v2):** *"the reenactment uses the wrong person… That proves the method is possible, but not
that Desmond could do it."* In v1, each suspect attempts the climb and only Desmond succeeds; the
reader called it *"one of the better recent proof scenes."*

**MEASURED:** v2's brief states the discriminating test's design but never who performs it or on whom
its result lands.

**Lever:** one line in the test chapter's brief, as a shape: *"The test is attempted by `<innocent
suspect>`, who fails at `<the physical step>`; then by `<culprit>`, who does it. Write both
attempts."* The innocent and the step come from the case's `discriminating_test` and clearances; the
culprit from `culpritName`. **Prediction:** the reveal chapter shows the culprit performing, or being
forced to perform, the step.

## P1.3 — No weapon link at the confrontation

**v1** carries it: `buildNameAndReasonLines` and the weapon-in-hand checklist in `discriminating.ts`,
fed by `splitMeansLinkTrace` from the A_102 means-link trace — *"Fencing foil: fresh blood and
handling marks in victim's room — Desmond Kestrel."*

**v2** lays the foil and key out "as evidence" (A_108 §2), with no line tying them to the culprit's
hand.

**Lever:** reuse `splitMeansLinkTrace` in v2's reveal brief: *"At the confrontation the investigator
names `<weapon>`, what was found on it (`<trace>`), and ties it to `<culprit>` in one sentence."* Same
code, second caller.

## P1.4 — The mechanism, and the time, in one sentence

**All three recent reads** asked for it (86, 85, 84). The v1 read: *"We treated low tide as a single
moment instead of a window."* The v2 read: *"The cave did not open for an instant at 3:20. It was
usable for several minutes."*

**Lever, both engines:** the reveal carries one sentence naming the mechanism, and — when the case
has an opportunity time — the window it opened and the window it closed, **as two clock values**. v1
has the mechanism line (A_107 §5); neither engine has the two-ended window. The window's ends come
from the case (`constraint_space.time`) and the temporal agent; see P3.2 for the case-side half.

## P1.5 — The confession is too brief

**Reader (v2):** *"Desmond's confession is too brief… it needs one more line naming the emotional
collapse."* v1 read: *"I protected Hector Gaunt because I owed him everything"* — praised.

**MEASURED:** v2's `revealOperation` (`brief.ts`) already asks for the name, a verb of killing, and a
culprit answer that carries the reason. The draft complied with the first two and gave the answer as
silence: *"Desmond's eyes flickered, but he made no reply"* (first arm-B draft).

**Lever:** make the answer a counted thing — *"The culprit then speaks twice: once naming what the
victim was about to do to them, once naming what they had spent their life protecting."* Both slots
come from the case (`motive`, the culprit's `formativeIncident`), which ties this to WP-001 O1/O2.

## P1.6 — v2's naming gate is a false alarm

**MEASURED** (A_108 §3): v2's gate said *"no chapter at or after the reveal names Desmond Kestrel as the
murderer"*; the v2 reader named Desmond as culprit without hesitation. The gate misses second-person
accusation (*"Desmond Kestrel, you alone could have…"*) and confession.

**Lever:** the gate accepts an accusation addressed to the culprit by name and a confession in the
culprit's own voice. A test pins the arm-B chapter 8 text as a positive. £0.

## P1.7 — Post-reveal chapters carry reveal titles

**Reader (v2):** *"Chapter 10 is called The Revelation, but the revelation already happened."* Both
engines titled chapter 9 "Clearing the Innocent".

**MEASURED:** the titles are the outline's scene titles, printed. Case-side fix in P3.4; v2-side, the
writer is told the chapter's ROLE (`aftermath`) and titles it from what happens in it.

---

## What v2 keeps that v1 lacks

Recorded so no parity change removes it:

- **prose 8** on a matched pair — the first 8 either engine earned on the same case;
- **low repetition** — v1 restated "seven feet above the rocky shore" six times; v2 did not;
- **wit that arises from situation** — the v2 reader quoted three lines and called them better than
  *"repeated catchphrases in weaker drafts"*;
- **cost** — about a quarter of v1's prose bill.

**A parity change that costs v2 its prose mark is a regression**, even if clues and ending rise.
