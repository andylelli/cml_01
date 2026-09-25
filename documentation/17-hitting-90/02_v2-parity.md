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
book at ~1,000 words × 1.45 tokens is ~14,500 — so it always fits. **MEASURED: 17 of 17 v2 runs in the
prompt log wrote in one segment, `S0`.** No flag exists to force act-sized calls; P1.1 builds one. The brief asks for "at least 12 paragraphs of four sentences in each chapter"
(`brief.ts:239`); one call honours that early and compresses as it goes.

**INFERRED:** the taper is the model spending its sense of the whole on the opening. v1, which writes
chapter by chapter, has no taper.

**Lever:** write in act-sized segments always — `CHAPTERS_PER_ACT_SEGMENT = 4`, three calls for a
ten-chapter book — behind a new flag. **The risk it carries:** the one-call design was chosen for
whole-book coherence (A_99 §10.5); if segmenting costs the prose 8, that is the first stopping
condition in `05` §4. Each segment gets the prior chapters' summaries (`priorChapters`
already exists). **Prediction:** the last three chapters' mean rises from 519 words to over 850, and
the book from 8,044 to over 10,000, with the same brief. One v2 prose pair, ~£0.30, settles it.

**MEASURED 2026-09-25 — pair 1 (`resume-1790332941683`, about $0.45):** three calls of four
chapters. Words by chapter **1003 1012 869 803 | 983 880 734 554 | 1022 755** — each call starts near
1,000 and falls, and chapter 9, first of its call with eight chapters of context behind it, is the
longest chapter in the book. Book 8,615 (arm B 8,044); chapters 8–10 mean 777 (predicted over 850);
speech openings in chapters 7–10: 7 (predicted at least 12). **Predictions 2–4 failed. The taper is a
property of position within a call, not of the call's length.** The per-chapter paragraph line already
sits in every scene contract, so a per-chapter ask is not the lever either.

**Next:** one chapter per call — `PROSE_V2_SEGMENT_CHAPTERS=1`, v1's unit, which v1 shows does not
taper — bundled with the reveal package as pair 2. The two are measured by counts that do not
overlap: words per chapter for the segmenting, the six reveal predictions for the package.

**MEASURED 2026-09-25 — pair 2 (`resume-1790333881166`, $1.01 for the prose stage):** one chapter a
call, ten calls. Words by chapter **1205 1255 1576 1157 1340 1529 1289 1342 1415 1200 = 13,308** —
no taper, no chapter under 1,157; v1 on the same case wrote 12,652. Speech-opening paragraphs 87
(arm B 45; chapters 7–10: 22 against the predicted 12); sentences over thirty words 74 (arm B 38);
em-dashes on the saved page 111 (arm B 0, the fold removed). Repetition 9.5 per 10k, normal. All
30 writer calls were refused once and passed softened. **Every length prediction held. The taper was
position within a call, and one chapter a call puts every chapter first.** The cost of the prose
stage rose from ~$0.45 to ~$1.01 — v2's cost advantage over v1 is mostly gone; what it bought is
5,000 words and the brief's per-chapter asks honoured in every chapter. `PROSE_V2_SEGMENT_CHAPTERS=1`
is the default from this commit.

**The reveal package on pair 2, read by me (chapter 8):** the foil sentence — *"found in her room
with fresh stains and distinct handling marks, but those marks match precisely the grip of Desmond
Kestrel's gloved hand"*; the mechanism with both clock values — *"between twenty minutes past three
and half past three, the only window when the way was open"*; *"Desmond Kestrel killed Katherine
Quayle"*; two confession lines (the executorship she was about to remove; losing the Academy).
Desmond performs the climb; Hector sizes the drop and declines it with his alibi — the innocent's
attempt is a look, not a climb. Chapter 10 is "The Last Routine". Predictions 1–6 held, the first of
them partly.

**What pair 2 also showed, read by me (chapters 8–10):** sixteen humour LABELS printed as narration
(*"polite savagery brightening his tone"*, *"dry wit failing him"*, *"deadpan as ever"*) — P4.2, built
after the launch; the wit operations narrated as they are performed (*"the answer clipped to four
words"*, *"spoke at length"* ×4, *"the line minimal but final"*); *"battered"* twenty times; chapter 9
re-clearing all three suspects with their clock values under the shown title "Clearing the
Innocent" — the clearing title is now withheld after the reveal and the closure line asks for one
sentence per suspect. Pair 3 carries those fixes before any reader sees the book.

Also MEASURED on pair 1: all nine writer calls were refused once and passed softened; the selector
chose the shortest draft in 2 of 3 segments (3099 over 3938 and 3877; 1737 over 1950 and 1983), but
over all eight v2 segments on record it chose the longest in 5 — not systematic.

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
