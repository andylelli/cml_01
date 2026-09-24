# ANALYSIS_107 — The reveal after the 86: where the weapon link lived, and what removing the list cost

**2026-09-24.** Step 2 of the plan after the 86 read of seed 18179: the reader's two cheapest notes —
cut chapter 9's numbered proof list after chapter 8's confession, and say in one sentence which clock
effect made the false hour. Both turned out to be less cheap than they looked, and one would have
deleted the thing the read was praising. Every change was measured on one-chapter redos of the read
book. Code comments cite this document as A_107.

---

## §1 THE WEAPON LINK LIVED IN THE LIST THE READER WANTED CUT

In the read book, and in every redo since, the only reveal-time sentence tying the culprit to the knife
was **item eight of chapter 9's numbered proof list** — *"Eighth, the birdwatcher's knife: last
disturbed in the barn, bearing fresh handling marks that match Gerald Thorne's grip."* Chapter 5 has
Gerald staring at the knife, nothing more. **MEASURED**, sentence by sentence across four manuscripts.

Cutting the list as asked would have removed the link the reader credited with `clues` 8 — the whole
point of A_102. **Not cut until the link lived in chapter 8.**

**Why it was not in chapter 8.** The knife clue (`clue_culprit_direct_gerald_thorne`) is not among the
discriminating test's four `evidence_clues` and has no `clue_to_scene_mapping` entry. The
confrontation was never asked to use it.

**Fix (`discriminating.ts`).** When the case carries a weapon-first means-link trace naming the
culprit, the discriminating-test checklist requires the investigator to connect culprit and weapon
aloud, before any admission. The trace is split into weapon, finding and name
(`splitMeansLinkTrace`, three tests) rather than quoted whole — a long quoted span gets copied and
then rejected by the verbatim-copy gate, which caused one earlier fallback.

**Measured** on a chapter-8 redo (`resume-1790266290519`): paragraph 6, spoken to Gerald — *"That
leaves you… The birdwatcher's knife, last disturbed by you in the barn, bears fresh handling marks"*;
his admission comes in paragraph 8. **The link now lands in the confrontation, before the admission.**
My first probe said zero: it required his name in the same sentence, and dialogue addressed to
someone says "you". A claim about the probe, recorded as one.

## §2 WHY CHAPTER 9 RE-CLEARED EVERYONE — NOT THE CAUSE I FIRST NAMED

Chapter 9's prompt carried *SUSPECT CLEARANCE REQUIRED (MANDATORY)*. **I first said the X32 fold had
kept the clearance job in scene 9. That was wrong:** on this run the fold kept it in scene 7, before
the test. The case has no `suspect_clearance_scene` either.

**The actual owner** is clearance ownership (`clearance-ownership.ts`, `AGENT9_CLEARANCE_OWNERSHIP`,
on). It prefers a chapter whose title signals clearing, and bars only the **final** chapter. Scene 9
was titled *"Suspect Clearances"* and followed the `final_trap` in scene 8, so it took ownership
after the reveal. The geometry had already labelled chapter 9 **aftermath**, and its own resolver's
comment names "revelation" as the aftermath beat.

**Fix.** The final-chapter veto is widened to **every chapter after the reveal**, the reveal found by
story-geometry's own exported `resolveRevealChapter` over the outline both callers already share, so
the prompt side and the deterministic-repair side cannot disagree. When an act has no eligible
chapter left, ownership walks back to the last eligible chapter in the book rather than leave a
suspect unowned. Outlines without beats resolve the reveal to the last chapter and are unchanged —
the twelve existing tests pass untouched. **This reverses the module's recorded preference** for a
later "Clearing the Innocent" chapter over "The Final Trap"; the reversal and the 86 read's evidence
are recorded in the code where the preference was argued.

**Measured** on a chapter-9 redo (`resume-1790267008122`): the mandatory clearance block is **absent**
from chapter 9's prompt; chapter 9 has **0** numbered proof items and **0** re-clearing sentences;
repetition **9.3 per 10k**, the lowest this book has had; no fallback.

## §3 AND THE BOOK STOPPED NAMING THE KILLER

The geometry then warned: *"Chapter 8 is the reveal, and no paragraph names Gerald Thorne as the person
who did it"* and *"does not state why the culprit did it."* Counting attribution sentences (name plus
a verb of killing, or an equivalent) across the four manuscripts:

| book | attribution by chapter | ch8 motive sentences |
|---|---|---|
| the read book (86) | ch8: 2, ch9: 1 | 3 |
| after the ch8 quote-guard redo | ch9: 1 | 1 |
| after the ch8 weapon-line redo | ch9: 1 | 1 |
| after the ch9 clearance redo | **none** | 1 |

**Each fix was right on its own terms and together they produced a book that never says who did
it** — the X22 wall, 35% of shipped v1 books. The regen that clears the injector's paragraphs
dramatized them without keeping the attribution, and chapter 9's list was the last naming sentence.

**The structural cause.** The geometry treats the discriminating-test chapter as the reveal
(`resolveRevealChapter` takes the `final_trap` beat), but v1's reveal contract never reaches it: the
reveal and discriminating-test contracts are mutually exclusive by construction. **Fix:** the
discriminating-test checklist carries v2's `revealOperation` — one sentence, spoken aloud, with the
culprit's name and a verb of killing; then the culprit's own answer, carrying the reason
(`buildNameAndReasonLines`, two tests). Measured in §4.

## §4 THE CHAPTER-8 REDO WITH THE NAME AND THE REASON

`resume-1790267402163`, against the clean checkpoint with the new fallout chapter 9 kept.

| | after the ch9 redo | after this ch8 redo |
|---|---|---|
| ch8 names the culprit with a verb of killing | none in the book | **2** — *"You killed Dr. Ivor Jardine"* |
| ch8 ties the culprit to the knife | 1 | **2** |
| ch8 gives the reason | *"I did what was necessary"* | *"When he threatened to restrict your access to the farm, you chose silence over ruin"* |
| geometry reveal warnings | culprit not named; motive absent | **both cleared** |
| ch9 numbered proof items | 0 | 0 |
| repetition per 10k | 9.3 | **8.5** |
| fallback | none | none |

**Every structural note from the 86 read is now met in one book** — the link at the confrontation, the
name and the reason there, no proof list after the confession, chapter 9 as fallout. **MEASURED.**

**What still stops it going to a reader:** chapter 8's first draft failed validation and was retried,
the repair path inserted the discriminating-test injector's three paragraphs, and the regen cleared
only one of them. The ship-check caps the rubric at 65 (prose ≤ 4) and a reader would quote them. The
regen cleared all three on one chapter-8 redo in four; the trigger is the repair path's insertion on
a first-draft failure, not the prose. **That trigger is the next lever**, and it belongs to the v1
writer only — v2 has no such injector. The 11 pronoun issues the gate reported are not from the new
instruction: chapter 8 has no sentence giving Gerald the wrong pronoun.

## §5 THE MECHANISM SENTENCE — PARTIAL

The checklist asks the investigator to say once which physical sign produced the false reading and
which only betrays the tampering. The redo wrote *"The clock was forced backward, its strike delayed,
to display 'a quarter past ten'"* — both effects bundled as causes of the display, which is the
confusion the reader named. **Partial, not fixed.**

## §6 TWO DEFECTS IN MY OWN INSTRUMENT, FOUND ON THE WAY

- **The redo corrupted the checkpoint.** Each redo appended its rewritten chapter after the ten it had
  loaded, so the checkpoint reached 16 chapters, its run id was overwritten, and every later redo
  silently rebuilt on the ORIGINAL chapters (the loader keeps the first ten) — including the original
  fallback chapter 1. **None of those redo books was read, and no result above depends on their
  chapter 1.** Fixed: `onBatchComplete` places each chapter at its own position. The corrupted file
  is kept aside; a clean checkpoint was rebuilt from the read book with the new chapter 8, and after
  the chapter-9 redo it still holds ten chapters with chapter 9 replaced in place.
- **Resume run reports overwrite each other.** Every resume on the same day writes
  `run_<date>_resume-1.json`, so a redo's report is lost at the next redo. The numbers here were read
  immediately after each run. Not fixed; a provenance gap for anyone reading later.
