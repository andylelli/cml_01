# 06 — THE FIRST FRESH READ: 69

**2026-09-25.** Run `run_98dec72a` (story `story_20260925-1318`, *The Shadows of Ashford Manor*) was the
first fresh case written by v2, and it read **69**. Pair 3 (`resume-1790335377015`), four hours earlier,
read **88**. This document is what the 69 says about the system, and the £0 work it produced.

**The rule for everything below (the user's, 2026-09-25): changes are holistic to every axis. Nothing
here is fitted to the Ashford Manor case.** Every fix is a checker, a guard or a brief line that runs
on every book, and every checker is shown against a known-negative as well as a known-positive.

---

## 1. Why 69, when the last read was 88

### 1.1 The 88 measured one case; the 69 measured the system

MEASURED from the review files in `stories/`:

| | reads | range |
|---|---|---|
| fresh runs, 2026-08-02 → 09-16 | 34 | 68–86, mostly 76–85 |
| resumes of seed 23403 (tidal cave), 09-16 → 09-25 | 9 | 80 → 88 |
| **run 98dec72a, fresh, identity axis** | 1 | **69** |

v2 was chosen on seed 23403 (A_108) and tuned on it through three prose pairs the same morning. Every
read since 16 September was that case. CLAUDE.md already says *choose the next seed by AXIS until every
axis has three reads*; the programme did not. **INFERRED:** most of the 19-point gap is the case and
the generalisation, not a regression — the 69 is about ten below the fresh-run level, not nineteen
below the best.

It was also the first book through four changes that had only met harnesses: P2.1 (the staged wound),
P3.1 (the wound site), P3.2 (the act window) and P3.4 (scene titles). MEASURED: the run started 12:01
UTC, after `f63f7b4d` (11:45 UTC). Whether the worker's `dist` was rebuilt is **ASSUMED** — the run log
is on the laptop (`logs/`, gitignored), and `documentation/prompts/actual/run_20260925-1201_98dec72a/`
is indexed but ignored.

### 1.2 What the reader named, and where each came from

| the reader's complaint | on the page, MEASURED | source |
|---|---|---|
| "a gesture that carried nothing the plot needed" — meta-text | ×3 | `brief.ts` O5: "…an exchange that **carries nothing the plot needs**" |
| "the survivors changed in concrete ways" — outline language | ×1 | `brief.ts` aftermath: "gives two named survivors one **concrete change** each … the place **resuming ordinary use**" |
| repeated catchphrases | "that's the way of things" ×5, "cut to the chase" ×5, "Order, Mr. Wentworth insists" ×3 | `bible.ts:180` "Says, in their own way: <tic>" — given to every chapter call, owned by none |
| repeated "Inspector, [clue]…" lines that sound like notes | **23** lines opening by addressing the investigator (pair 3: **2**, both real questions) | `bible.ts` clue list: "as something somebody sees, finds **or says**", next to the clue's `observable` — which Agent 5 often writes as a conclusion (§2) |
| duplicated lines | 3 passages, **all inside one chapter** (pair 3: 0) | a speech closed and restarted mid-paragraph after a stray quotation mark — the shape of an edit whose replacement carried the next sentence (INFERRED; the log would settle it) |
| "spoke at length" and the like | "spoke at length" ×7, "answer was brief"/"reply was short" ×6, "answered with four words" ×2 | `brief.ts` wit shapes: "somebody **speaks at length**…"; pair 3 printed it ×7 too |
| too many mechanisms | the discriminating test compounds two proofs (ladder dust **and** letter delivery times); the premise stacks impersonation, forged credentials, forged passes and forged letters | the case (Agent 3), before a word of prose — `data/novelty-ledger.json` |
| "Dr. Langley's alibi is confirmed" — the victim | ×1 | open (§5) |

### 1.3 Why the checkers let it through — four faults, all general

MEASURED over the 227 saved books of 8,000+ words, with a golden contract standing in for each book's own:

1. **Anchoring discarded every checker quote under eight words.** "Evelyn's answer was brief." was
   found and thrown away. On the 69: 5 of 12 operation announcements lost; on the corpus: 45
   operation, 141 abstract-subject and 9 scaffold findings.
2. **The sentence splitter ended a sentence at every honorific.** "Order, Mr. Wentworth insists" was
   said three times and counted zero: "Mr." cut the quotation in two.
3. **`copied_sentence` only looked across chapters.** All three of the 69's duplicates were inside
   one; it reported none.
4. **The echo checker matches verbatim n-grams.** "carries nothing the plot needs" in the brief does not
   match "carried nothing the plot needed" on the page — the tense changed and "nothing"/"the" are stop
   words.

And one hole in the edit guards: the validator compares the **sum** of guard scores, so a splice that
repeats a sentence carrying a name raises `castNamesIntact` by what it takes from any duplicate
measure, and nothing reverts it.

---

## 2. The clue observable is often a conclusion

MEASURED on the four golden cases (`eval/golden/`, all temporal): many `observable` fields are not
things anyone can see — *"Records and possessions confirm Charles Fenwick's exclusive access and tools
for clock tampering"*, *"Timeline correction based on hourglass frost blockage and Charles's presence"*,
*"Physical and timing evidence contradicts the assumption of correct clock time."* A conclusion can
only be SAID, and the brief offers "says" as one of the three ways to show a clue. On the 69 that is
the report-to-the-inspector line: *"Inspector, the ink composition of forged letter unavailable before
half past eleven."*

---

## 3. What WP-001 says about it

- O5 ("one thing that isn't doing a job") and the wit shapes came back **announced instead of
  performed**. The writer printed the operation's *purpose*. The general rule: a brief line states the
  act, never the reason for it, and carries no noun a narrator can lift (plot, case, survivors, length).
- The stock line is §4.3's template ratchet at the scale of a character: a line guaranteed to be
  available to every chapter is a line that recurs.
- §7 binds the fixes: detect and report, never gate; no deterministic scrubber — the editor (an LLM)
  makes every change, under the guards.

---

## STATUS

| id | item | status | commit | evidence |
|---|---|---|---|---|
| F1 | one abbreviation-aware sentence splitter for the checkers (`sentences.ts`) | built | (this commit) | "Order, Mr. Wentworth insists" ×3: 0 → found. The draft selector keeps its own splitter: its instruments are calibrated on it |
| F2 | a checker quote under eight words is widened by its neighbours, not discarded | built | (this commit) | the 69: discarded 5 → 0; corpus: 195 → 0 |
| F3 | `copied_sentence` reports a repeat inside one chapter | built | (this commit) | the 69: 0 → 3 of 3; pair 3: 0 → 0; corpus: 40 of 227 books carry one (mostly v1 injector lines) |
| F4 | a catchphrase said with an address added counts as the same line | built | (this commit) | "Let's cut to the chase, Inspector" joins "Let's cut to the chase"; two different lines sharing words stay apart (test) |
| F5 | `operation_narrated` reads "answered with four words" | built | (this commit) | the 69: ×2, was unmatched |
| F6 | edit guard `noNewDuplicate`, as a violation per duplicated sentence | built | (this commit) | the ch-4 splice shape is reverted; a repair, even partial, is never a new violation (test) |
| F7 | the echo checker tolerates inflection | not started | | |
| F8 | the brief states acts, not purposes: O5, the aftermath, the wit shapes | not started | | |
| F9 | each stock line owned by one chapter | not started | | |
| F10 | a clue put on the page as an act; a checker for a clue recited as dialogue | not started | | |
| F11 | compound discriminating tests against the read, over the whole ledger | not started | | |
| F12 | the read ledger by axis and by fresh/resume | not started | | |

**Deferred or withdrawn, with the reason:**

| id | item | why |
|---|---|---|
| D1 | make every guard exact per guard, not a sum | **would cause harm.** `castNamesIntact` counts name *occurrences*, so an exact rule reverts every deletion of a named sentence — which is the repair `operation_narrated` asks for ("Charles Wentworth spoke at length, his words carefully chosen."). How often the sum lets such repairs through today needs the run log. Only the new duplicate guard is exact (F6) |
| D2 | skip quoted measurements in the catchphrase checker | MEASURED 106 of 206 corpus hits are quoted clock values or measures, but 2 of 52 on v2-era books; not worth a change |
