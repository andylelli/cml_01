# ANALYSIS_108 — v1 or v2: one case, two prose engines, two reads

**2026-09-24.** Asked: do both — fix the v1 injector trigger and run v1, run v2 — then work out
which engine is better. Built as a **matched pair**: one full run on a fresh seed with the v1 writer,
then the same project's prose stage re-run with `PROSE_ENGINE=v2`. The case, clues, outline and
geometry are byte-identical between the arms; only the prose engine differs.

---

## §0 THE PAIR

| | arm A — v1 | arm B — v2 |
|---|---|---|
| seed | 23403, spatial: a room that appears sealed but is not | same |
| setting | seaside hotel, 1920s, dark; police detective; classic narrative and humour; 6 cast; angle: a fencing academy with a rivalry between its two masters | same |
| run | `mystery-1790272530598`, then `resume-1790274123040` (chapter 6 redone) | `resume-1790274659348` (the first attempt, `resume-1790274273032`, wrote nothing — §2) |
| project | `canary_1790272530595` | same |
| cost | $1.293 for the run, plus one chapter | about $0.30 |
| manuscript | `stories/story_20260924-1923/resumed_resume_1790274123040.md` | `stories/story_20260924-1935/resumed_resume_1790274659348.md` |

**Case, shared by both:** Desmond Kestrel stabbed Katherine Quayle with a fencing foil. The means-link
held on a concealment that is not a clock: *"[A_102 means-link] PROVES THE ACT: Fencing foil: fresh
blood and handling marks in victim's room — Desmond Kestrel [used by inference step 1]"*. Geometry:
chapter 8 the reveal, 9 and 10 aftermath.

## §1 ARM A, MEASURED BEFORE THE READ

- **Fallback on the first run:** chapter 6, unbalanced quotation marks — traced to the sanitizer
  deleting an interrupted speech's tail (A_106 §5); fixed and re-measured 9 of 132 → 0; chapter 6
  redone in one attempt.
- After the redo: no fallback, repetition 28.8 per 10k (normal), no scaffold residual, injector lines
  in the book **0**, rubric 68 (capped "reveal uses evidence not planted earlier").
- Chapter 8 names the killer, ties him to the foil through his glove and the key hidden in the foil;
  chapter 9's prompt carried **no** mandatory clearance and chapter 9 re-clears nobody.
- One line a reader may flag: *"Hector Gaunt is cleared. Witnesses confirm he was in the billiard room"*
  — a flat, report-style clearance in chapter 8.

## §2 ARM B, MEASURED BEFORE THE READ

**The first attempt wrote nothing.** All three v2 writer drafts were refused by Azure's content filter
on the prompt — `violence: medium`. The v1 writer wrote the same case, a fencing-foil stabbing, chapter
by chapter without one refusal. v2 packs the whole case into one ~31,000-character brief; its violent
wording runs at **24.9 per 10,000 characters against v1's 13.0**. That is itself a finding about the
engines: **on a violent case, v2's single-brief design trips the filter and v1's chapter prompts do
not.** MEASURED.

**The fix,** designed against those counts as `llm-client/content-filter.ts` asked: on a content-filter
refusal only, `chat` retries once with the graphic words softened (stabbed→killed, blood→stains,
wound→mark) and one line saying the facts are unchanged. Flag `AGENT9_V2_FILTER_SOFTEN`, default off,
set for this arm only. The second attempt: every refused call got through after softening 15 words
(writer) and 5 (editor), and v2 wrote the book.

| | arm A — v1 | arm B — v2 |
|---|---|---|
| words | 12,652 | **8,044** |
| shortest chapter | 1,096 | **414** (ch10; ch9 466, ch8 676) |
| names the killer with a verb of killing | yes — 3 sentences | **no** — v2's own gate: *"no chapter at or after the reveal names Desmond Kestrel as the murderer"*; confirmed by reading: *"Desmond Kestrel, you alone could have used the cave's secret window… The evidence leads to you"* |
| the culprit's answer and reason | yes | **no** — *"Desmond's eyes flickered, but he made no reply"* |
| weapon link at the reveal | glove and the key hidden in his foil | the foil and key laid out as evidence |
| clearances after the reveal | none | chapter 9 is titled "Clearing the Innocent" |
| unresolved defects its own checks report | unaccounted clock times | 3 timing contradictions, a clock value off the table, a clue too early, a flat reveal |
| repetition | locked facts and alibi windows restated ("seven feet above the rocky shore" ×6), a catchphrase ×4; ship-check 28.8 per 10k, normal | low; the v1 ship-check does not run on v2 |
| shadow rubric | 68 | 66 |

**Before any read, on this case, v1 is ahead on everything the pipeline can measure except
repetition.** v2's book is 37% shorter, its last three chapters run 414–676 words, and it never tells
the reader who did it — the complaint A_102 spent this whole effort removing.

## §3 THE READS

**Prediction, recorded before either read:** v1 higher, on `ending` and `clues`; the v2 read says the
culprit is never named; the v2 read may credit leaner prose.

| category | v1 | v2 |
|---|---|---|
| premise | 9 | 9 |
| opening hook | 8 | 8 |
| plot structure | 8 | 8 |
| character clarity | 8 | 8 |
| dialogue | 8 | 8 |
| atmosphere | 9 | 9 |
| **clues / evidence logic** | **8** | 7 |
| pacing | 8 | 8 |
| **ending / reveal** | **8** | 7 |
| **prose / polish** | 7 | **8** |
| character life | 8 | 8 |
| humour / wit | 8 | 8 |
| **headline** | **85** | **84** |

**Against the prediction:**

- **v1 higher, on ending and clues — held,** by one mark each. The reader's reason is specific: in v1
  the culprit himself performs the climb that proves the route; in v2 Bertram does it, which *"proves
  the method is possible, but not that Desmond could do it."*
- **v2 credited for prose — held:** *"cleaner, more polished… better dialogue and polish."*
- **"The v2 read says the culprit is never named" — FAILED.** The reader named Desmond without
  difficulty and quoted a confession with a motive, *"Had I not acted, she would have ruined me…"*,
  which my probe missed (no verb of killing) and v2's own final gate also missed. **v2's STOP line
  was a false alarm for a reader.** The reader's complaint was different: the confession is too brief.

**Shared by both books, so owned by the case, not the engine:** the 3:20 low tide read as an instant
rather than a window; the fatal wound placed in the upper arm; chapter 9 recapping alibis. That last
one matters for A_107: v1's chapter 9 carried no mandatory clearance block, yet the reader still saw
alibi recaps — the outline's own scene 9, titled *"Clearing the Innocent"*, drives them without an
obligation. The veto removed the order; the title still asks.

**v1's prose losses are the pipeline's register:** *"The truth remained elusive"*, *"The room held its
breath"*, *"The evidence is complete"*, and *"the six words slicing through his own speech"* — a word
count in narration, which the short-answer rule forbids in terms.

## §4 WHICH IS BETTER, AND HOW SURE

**Neither, on this pair.** 85 against 84 is inside one read's ±3 marks, and the rule set before the
reads was that a gap under ~7 marks is not a winner. The categories split exactly as predicted: v1 is
better at proving the act, v2 is better at sentences.

**The tiebreak is not quality, it is cost and what each needs.**

| | v1 | v2 |
|---|---|---|
| prose cost on this case | most of a $1.29 run | about $0.30 |
| length | 12,652 words | 8,044 words |
| what it lost marks on | scaffold register spread across the book | one chapter's proof: who performs the test, a two-line confession |
| robustness | wrote a violent case unaided | needed the content-filter retry to write at all |

**MEASURED on one pair; INFERRED beyond it.** One pair cannot rank two engines, and
[[rubric-cannot-rank-two-books]] applies to reads too. What this pair does settle: v2 is not worse than
v1 on the reader's marks, costs a fraction of it, and loses on things that live in one chapter's
contract; v1 loses on things spread across every chapter.
