# 17 — HITTING 90

**Started 2026-09-25.** The goal: an external read of 90 or more. The best this project has ever had
is 87; the last three reads were 86, 85 and 84.

This folder holds the plan and its status. Evidence behind every claim is labelled **MEASURED**,
**INFERRED** or **ASSUMED**, and cited to an analysis document; rules live in `CLAUDE.md`.

| file | what it holds |
|---|---|
| `00_README.md` | the playback, the plan on one page, and the STATUS table |
| `01_engine-decision.md` | keep v1, use v2 — what that means in configuration and code |
| `02_v2-parity.md` | the things v1 does better than v2, measured, and the lever for each |
| `03_depth-and-length.md` | why v2 books run short, and how WP-001's depth operations lengthen them without padding |
| `04_review-weaknesses.md` | every weakness the recent readers named, how often, which mark it costs, and who owns it |
| `05_path-to-90.md` | the arithmetic by category, the phased plan, and how each phase is measured |

---

## THE PLAYBACK — WHAT WAS ASKED, AS UNDERSTOOD

1. **Keep v1, use v2.** v1 stays in the codebase, runnable and unchanged as the reference engine. v2
   becomes the engine the pipeline uses by default. Nothing in v1 is deleted.
2. **Make v2 do everything v1 does better.** The engine pair (A_108) tied, 85 to 84, but split: v1
   was better at *proving the act* (clues 8 against 7, ending 8 against 7); v2 was better at
   *sentences* (prose 8 against 7). v2 has to gain v1's reveal without losing its prose.
3. **Make v2's chapters longer by giving them depth, per WP-001.** v2's books run about 8,000 words
   against v1's 12,600, and every v2 book tapers chapter by chapter. The length should come from the
   white paper's material — unforced choices that would be missed if removed — not from padding.
4. **Fold in the weaknesses the readers keep naming,** and aim the whole programme at a 90.
5. **Record it all here,** as a folder of numbered documents.

---

## THE PLAN ON ONE PAGE

| phase | what | why | cost to test |
|---|---|---|---|
| **0** | Make v2 the default; keep the content-filter retry on for it | the decision above; v2 wrote nothing on a violent case without the retry (A_108 §2) | £0 |
| **1** | **v2 parity** — write in act-sized calls so late chapters stop shrinking; the culprit is the one the proof lands on; the weapon at the confrontation; the mechanism in one sentence; a confession with a concrete reason; fix v2's naming gate and post-reveal chapter titles | every clues/ending mark v2 lost to v1 | v2 prose pairs, ~£0.30 each |
| **2** | **Depth (WP-001)** — one dramatised wound, every suspect's formative incident on the page, one element per chapter that does no job, one chapter away from the drawing room | the categories that have never reached 9 are the personality ones; this is also the length | v2 prose pairs, then one read |
| **3** | **Case faults both engines share** — the fatal wound placed where it kills; an opportunity stated as a window, not an instant; no clue that spells out the plan; no post-reveal scene titled as clearing or revelation | named by the readers on both engines in the same week | harnesses, pennies |
| **4** | **Register** — the lines readers quote, our own labels leaking onto the page, catchphrases shared across characters, and one instrument that points up | prose and dialogue have never reached 9 | pairs and one read |

Each phase ends in a read only when a matched pair has already shown its lever works, and no book
goes to a reader with a fallback chapter or a ship-check warning.

---

## STATUS

One row per item. **Status** is one of: not started · built · measured · read · deferred (with reason)
· withdrawn (with reason). **Commit** names where it landed.

| id | item | status | commit | evidence |
|---|---|---|---|---|
| P0.1 | `PROSE_ENGINE=v2` as the default; v1 left runnable | built | (this commit) | `.env.local`; FLAG-AUDIT row ON |
| P0.2 | `AGENT9_V2_FILTER_SOFTEN=true` with v2 | built | (this commit) | `.env.local`; FLAG-AUDIT row ON |
| P0.3 | the ship-check (repetition, scaffold) reads v2 manuscripts | built | (this commit) | `agent9-v2/ship-check.ts`; known-positive test |
| P1.1 | v2 writes in act-sized calls; late chapters stop tapering | measured: 4-chapter calls move the taper inside each call; chapter-per-call is pair 2 | dae69512 | `02` P1.1, pair 1 `resume-1790332941683` |
| P1.2 | the discriminating test's decisive result lands on the culprit | built | (this commit) | `testSubjects` on the test and reveal contracts |
| P1.3 | the weapon link at the confrontation, from the means-link trace | built | (this commit) | `proof` on the reveal contract; `splitMeansLinkTrace` shared |
| P1.4 | the mechanism in one sentence, as a window not an instant | built | (this commit) | `mechanismOperation`; window from the chronology's interval |
| P1.5 | the confession carries the reason and one concrete wound | built | (this commit) | `revealOperation`: two counted lines |
| P1.6 | v2's naming gate reads a confession and second-person address | built | (this commit) | arm B's chapter-8 sentence is the known positive; `stabbed` added |
| P1.7 | chapters after the reveal carry aftermath titles | built | (this commit) | `revelation` was not `reveal` to the regex; every post-reveal chapter held to the rule |
| P2.1 | O2 — one first-half scene staging culprit and victim in the grievance | not started | | WP-001 §6.1 |
| P2.2 | O1 — every suspect's formative incident reaches the page once | not started | | O1 built upstream, v2 uses one |
| P2.3 | O5 — one element per chapter that does no job, registered high | not started | | |
| P2.4 | one chapter spent away from the drawing room | not started | | WP-001 §5.4 |
| P2.5 | O4 em-dashes: asked for 3 a chapter, 0 on the saved page in both engines — find where they go | fixed | (this commit) | the save path folded `—` to `-` since 2026-07-04; 72 read manuscripts affected (`03` §4) |
| P2.6 | O6 — divergent candidates at one unforced choice (the tic field), measured at £0 | not started | | WP-001 §8 |
| P3.1 | the fatal wound placed where it kills | built — prompt shape + note; harness measurement pending | (this commit) | seed 23403's case said "stabbed with a fencing foil" and a clue said "torn sleeve"; both engines wrote an arm wound from the sleeve |
| P3.2 | an opportunity stated as a window with two ends | built — prompt shape + note | (this commit) | MEASURED: 18 of 67 archived cases carry no window about the act; seed 23403 had one, so its reads' complaint is P1.4's |
| P3.3 | no clue spells out the plan | not started | | A_108 v2 read |
| P3.4 | no post-reveal outline scene titled as clearing or revelation | built — Agent 7 title shape; format example no longer shows a title | (this commit) | MEASURED: 57 of 58 archived outlines title a scene after the trap with a reveal or clearing word; v2 also withholds them at render (P1.7) |
| P3.5 | "twenty minutes past three-five" — trace the clock-to-words step | deferred — v1-only, and v1 is no longer the engine | | `renderClockWords(15:25)` is correct ("twenty-five minutes past three"); INFERRED: v1's time-form rewrite substituted "twenty minutes past three" for "three twenty" inside "three twenty-five"; 0 occurrences in either v2 book |
| P4.1 | v2's editor pass targets the register lines readers quote | not started | | |
| P4.2 | our own labels ("polite savagery") never reach the writer as quotable text | not started | | MEASURED: the label is in the profile and brief 12 times; the reader quoted it |
| P4.3 | no catchphrase shared across characters | not started | | A_108 v1 read |
| P4.4 | one instrument that points up (WP-001 §6.2) | not started | | |

**Next item:** pair 2 — chapter-per-call plus the reveal package — then its read.
