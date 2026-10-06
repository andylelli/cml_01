# ANALYSIS_111 — From here to 90: the code-review close-out, the path, and modules

2026-10-06 · branch `feat/a110-build` · first written at `166adbf9` (£0, a plan); **revised the same day after the owner's
"proceed as you see best … check A_111 for quality and strength and complete parts 1 & 2"**: a quality pass that
corrected four of the first version's claims (§0), Part 1 built and closed, Part 2's first paid step run (P-5, £0.90),
and a v2 engine audit (WF-005, 37 defects) that now leads Part 2. Every claim is labelled MEASURED / INFERRED / ASSUMED.

The owner asked for one plan covering three things: (1) every fix from the code review of 2026-09-25/26, (2) the path to
90, and (3) the modular work in WP-005, with my own view on it.

---

## STATUS

Resumable: each row names its cost, its evidence and its commit.

| id | item | cost | status | commit |
|---|---|---|---|---|
| **CR-a** | owner decision 2 (`CML_IDENTITY_ROLE_WINS`): graded on the archive, 85/85 disagreements go the unified way; tie rule for two `role: victim`; **flipped in `.env.local`** (§2.2) | £0 | DONE | `f93bd216`, `e1427596` |
| CR-b | A6-07: one cast-aware matcher for the blind reader's guess (§2.3) | £0 | DONE | `f93bd216` |
| CR-c | the review's stale pages; **401 of 401 ledger items closed** | £0 | DONE | `e1427596` |
| CR-d | the replay pinned only the OFF branch of what ships: `npm run pin:v2` (§2.4) | £0 | DONE | `c36add04` |
| CR-e | the v2 engine was never reviewed: audited, 37 defects (WF-005) | £0 | AUDITED; fixes are §5 | `e72d99bf` |
| CR-f | read the 82094 ON book | — | **WITHDRAWN**: it predates the fix it was to test (§2.5) | `e72d99bf` |
| CR-g | `AGENT5_CLUE_SPEC_CHECKLIST` paid read | ~£0.95 | DEFERRED: bundle with the puzzle pair (P-8) | — |
| CR-h | injector row "(…reserved for chapter 6)" | £0 | CLOSED: 0 in the four books since 10-02 | — |
| **CR-i** | the victim listed as a suspect to clear in 63 of 71 stored CMLs (normaliser gap-fill); fixed at the source under `CML_A110_UPSTREAM` | £0 | DONE | `f93bd216` |
| P-1 | the exchange line keeps a four-kind act list, reworded | £0 | BUILT; **met**: "pressed her hand against the" 32 → 0 | `ac9c8229` |
| P-2 | strict deletions exempt from `registerNotWorse` | £0 | BUILT; mechanism met (register reverts 45 → 3); **superseded by V-12** (count hits, not a rate) | `ac9c8229` |
| P-3 | newcomers: one operation and their facts | £0 | BUILT; **not met** — four introductions in four consecutive paragraphs; P-3b next | `ac9c8229` |
| P-4 | the date in the opening | £0 | BUILT; **met**: January and 1934 in chapter 1 | `ac9c8229` |
| **P-5** | re-run arm B with P-1..P-4 | £0.90 | **RUN** — 6 of 11 predictions met; SHIP-CHECK still WORTH A LOOK (§3.5) | `f93bd216` (book) |
| P-3b | introductions spread: at least two paragraphs between one and the next | £0 | BUILT | `b21e002f` |
| **V-1…V-20** | the v2 audit fix batch (§5), behind `PROSE_V2_AUDIT_FIXES` (registered `df28e607`) | £0 | **BUILT** — every targeted count 0 with the flag on (§5.1) | `3120c8ff` (A) · `7b9d1190` (B) · `b127268b` (C) · `ec6418d8` (D) |
| **R-1** | the replay check had been red since 2026-10-03 (an unflagged fix, never re-baselined); bisected, and the re-baseline exposed a flags-off leak from A_110 step 1 — fixed; HEAD flags-off replays MATCH at the pre-A_110 tree (§5.2) | £0 | DONE | `8cb2ed56` |
| **R-2** | **no case generated since 2026-10-02 could be prose-redone**: the CML was persisted before Agent 5 filled the test's evidence ids, so a redo hit the pre-prose gate (P-6's first attempt, £0). A resume re-derives the floor; the CML is persisted again after Agents 5 and 6 | £0 | DONE | `adbbbb5a` |
| P-6 | second case, A′ against everything (A_110 arm-B flags + V batch); record and predictions written first | £1.75 | **RUN** — arm C readable (SHIP-CHECK Normal), 8 of 11 met; a self-read predicts 72–76 and names the CASE (`PAIR-82094-P6.md`) | `b8ff5815` (record) · `3c0969f2` (result) |
| P-7 | the owner's external read of P-6's better arm, with the checked read | £0 money | **HELD**: arm C passes the read gate but the self-read predicts 72–76 on case defects the upstream levers address; a read now would score the case, not today's work | — |
| P-8 | puzzle side: one device per case and at most one clock step on a non-temporal axis, behind `AGENT3_ONE_MECHANISM` (§3.4); two-suspect clues designed, not built | £0 build; ~£0.6 harness check | BUILT; harness check RUNNING | `b550cad7` |
| **P-8b** | an innocent's alibi must contain the actual time of death (50% of 215 stored innocent alibis miss it; P-6's self-read's first defect), behind `AGENT3_ALIBI_COVERS`, with an `[A_111 alibi-coverage]` count in every run | £0 | BUILT; in the same harness check | `d7b755ae` |
| P-9 | step-3 bundle (keyness, touch-once, presence penalty) | ~£0.95 | WAITS on P-6 | — |
| P-10 | step-2 upstream full-run pairs (`CML_A110_UPSTREAM`, now with CR-i) | ~£2.30 a case | WAITS on P-7 | — |
| M-0 | = CR-d | £0 | DONE | `c36add04` |
| M-1 | amend WP-005 with the five corrections in §4.3 | £0 | TODO (Part 3) | — |
| M-2…M-5 | K1–K7 | — | WAITS (§4.4) | — |
| D-1, D-2 | PLAN-TO-90 UPDATE 17; A_110's stale status lines | £0 | DONE | `3c609410` |
| D-3, D-4 | CLAUDE.md costs (a v2 run ~£0.95, a prose redo ~£0.9) and "score a redo against a redo"; best read 88 | £0 | DONE | `e1427596` |

---

## 0. The quality pass — what the first version got wrong

Four claims of the first version did not survive the checks run on them. Each is corrected where it stood; this list is
the record.

1. **"Agent 3b writes 5 devices for every case" was offered as evidence of competing mechanisms. It is not.** The 5 are
   candidates. MEASURED (`probes/device-uptake.mjs`, known positive: devices[0] reaches its own CML in 62 of 72; negative
   control: another case's device reaches it in 3 of 360): **51 of 72 CMLs carry one device, 13 carry two or more, 8 none
   detectable.** The sharper fact is in Agent 3's prompt — "Select one primary device (or a coherent hybrid of two)"
   (`agent3-cml.ts:411`) — and §3.3 now rests on it.
2. **The proposed decision-2 tie rule ("keep the member the CML's `death_method` or culpability names") could not
   work.** MEASURED: `death_method` names no cast member in 72 of 72 CMLs; `culpability` names only culprits. §2.2 replaces
   the labelled-sample plan with a grading against Agent 2's own `crimeDynamics` candidates, which needed no labelling.
3. **"The 82094 ON book is readable and tests the chapter-10 fix" was wrong twice over.** The run started 18:30 BST on
   2026-10-02 and the fix (`7501ebf9`) was committed at 19:37 (MEASURED); and it is a fresh run with a different culprit
   and mechanism, not a twin of the 80 read (the self-read, WF-005).
4. **The four-read mean included a book CLAUDE.md forbids reading** (seed 5670, WORTH A LOOK at 7.2× the median). The
   arithmetic in §1.1 now shows both means. One read (09-30) is a redo of an older case, not a fresh v2 book.

Two of the first version's "next steps" also changed meaning once measured: the register guard's rollbacks were a
denominator effect, not "the sentence scores higher" (V2K-01), and the repetition verdict that blocks every A_110 book
rests on restated clock times the editor is forbidden to delete (V2K-04).

---

## 1. Where we are

### 1.1 The reads — MEASURED (`scripts/external-read-ledger.mjs`, 79 manuscripts, 77 with marks)

The best read is **88** (a v2 redo against an older case's upstream; sum 84, offset +4). The last fifteen average 81.4.
Dialogue, pacing and prose have never reached 9.

| read | premise | hook | plot | character | dialogue | atmosphere | clues | pacing | ending | prose | sum |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 09-30 (redo of an older case) | 8 | 8 | 8 | 8 | 8 | 9 | 7 | 8 | 8 | 7 | 79 |
| 10-02 seed 5670 — **WORTH A LOOK, should not have been read** | 8 | 7 | 7 | 7 | 6 | 8 | 7 | 6 | 7 | 5 | 68 |
| 10-02 seed 82094 OFF | 8 | 8 | 7 | 8 | 7 | 9 | 7 | 8 | 6 | 7 | 75 |
| 10-02 bcc0d637 | 8 | 8 | 7 | 8 | 7 | 9 | 7 | 7 | 8 | 6 | 75 |
| **mean of the three readable** | 8.0 | 8.0 | 7.33 | 8.0 | 7.33 | 9.0 | 7.0 | 7.67 | 7.33 | 6.67 | **76.33** |
| **target** (`17-hitting-90/05`) | 9 | 8 | 9 | 9 | 8 | 9 | 9 | 8 | 9 | 8 | **86** |
| **gap** | 1.0 | 0 | **1.67** | 1.0 | 0.67 | 0 | **2.0** | 0.33 | **1.67** | **1.33** | **9.67** |

**MEASURED:** plot, clues and ending hold **5.33 of the 9.67-point gap (55%)**; prose, dialogue and pacing 2.33 (24%);
hook, character and atmosphere — the categories A_110 serves — 1.0 (10%). With the unreadable book included the shares
are 47 / 30 / 15 % of 11.75: the conclusion does not depend on it.

**INFERRED:** A_110 is the path to the owner's "not wooden", which the rubric does not score (A_110 §8). On the reader's
rubric the path to 90 runs through the puzzle first and the prose second.

### 1.2 A_110 — MEASURED (two paid pairs on one case)

- The 2026-10-06 pair (A′ flags off, B with four A_110 flags): points 1–4 on the page; point 5 worse ("pressed her hand
  against the" ×32); SHIP-CHECK WORTH A LOOK.
- P-5 (§3.5): the habit gone (0), the date on the page; SHIP-CHECK still WORTH A LOOK, now on restated clock times.

### 1.3 The code review — MEASURED

`build-ledger.mjs --check`: **401 items, 401 closed** (216 done, 176 withdrawn as moot, 9 duplicates), after decision 2
(§2.2). The engine that ships, v2, was outside it; WF-005 audited it (37 defects).

### 1.4 WP-005 — MEASURED

Designed, not built. Humour still touches 28 files in 7 workspaces (42 in 9 on a broader grep). A_110 touched **38
non-test source files in 6 workspaces** — WP-005's thesis, holding a third time.

---

## 2. Part 1 — the code-review fixes: done

### 2.1 What was left, and what happened to it

| what | outcome |
|---|---|
| A34-02, A1X-01, A34-D10 (shadow) and A6-07 (todo), all on decision 2 | **done** — §2.2, §2.3 |
| stale review pages | **regenerated** — README 34/34, OPEN-QUESTIONS and DECISION-12 marked superseded by the ledger |
| the replay pinned only the OFF branch of what ships | **pinned** — §2.4 |
| the v2 engine never reviewed | **audited** — WF-005; the fixes are §5 |
| the 82094 ON read | **withdrawn** — §2.5 |
| `AGENT5_CLUE_SPEC_CHECKLIST` read | deferred into the puzzle pair (P-8) |
| injector row "(…reserved for chapter 6)" | **closed** — 0 in A′, B, P-5 and the 82094 ON book |
| **new: the victim a suspect to clear (CR-i)** | **fixed at the source** under `CML_A110_UPSTREAM` |

### 2.2 Decision 2, graded — MEASURED (`probes/decision2-graded.mjs`)

The counter the decision waited on counted disagreements; the question was which side is right. Two findings settled it
without a person labelling anything:

1. **The archive count measured the wrong comparison.** `scripts/role-predicate-disagreement.mjs` (587 disagreements)
   compares each old test with the archetype predicate over every role text — not with what the flag ships
   (`isDetectiveMember` / `isVictimMember`: the explicit `role` enum wins, else the archetype).
2. **Graded against a field neither predicate reads** — Agent 2's own `crimeDynamics.victimCandidates` /
   `detectiveCandidates`, where it names one person — over 1,836 (member, kind) rows of the Agent 2 and CML casts:

| site's old test | disagreements | unified right | old right |
|---|---|---|---|
| `.includes('detective')` on `role_archetype ?? role` | 71 | 71 | 0 |
| agent2 `isDetectiveArchetype(roleArchetype)` | 10 | 10 | 0 |
| agent2 `/victim/` on the archetype | 1 | 1 | 0 |
| normalize `roleIncludes(role_archetype,'victim')` | 1 | 1 | 0 |

The live worry (seed 82094: two members marked `role: victim`) was real but narrower than DECISION-12 recorded: Agent 2's
step 6/7 already re-tags exactly one victim, and what the tie decided was WHICH — by list order. **Tie rule** (under the
flag): the member whose archetype says victim or whom `victimCandidates` names wins before list order (tested: on an
untied cast the flag changes nothing). **Flipped:** `CML_IDENTITY_ROLE_WINS=1` in `.env.local` (backup
`.env.local.bak-20261006-decision2`; one line reverts).

### 2.3 A6-07 — MEASURED (`probes/guess-matchers.mjs`)

The blind-reader half was already fixed (A6-D04 under `CML_VERIFIED_FIXES`). The three culprit-guess sites in
`agent6-run.ts` used two-way `includes`. Over 34 distinct stored casts and 3,942 generated (guess, culprit) questions —
full name, title + surname, first name, each ambiguous where another member answers to it — **`includes` answers 202
wrongly** (rejects "Mr. Fenwick" for Charles Fenwick), **`namesMatch` 321** (114 wrong yeses on shared surnames).
`resolveGuessToCastMember` answers by the same specification the questions were generated from, so its zero is by
construction; it is wired at all three sites under the identity flag and logs `[identity-disagree] site=agent6.guess`.

### 2.4 The shipped configuration is now pinned — MEASURED

The five replay fixtures record none of `CML_VERIFIED_FIXES`, `CML_PROMPT_TRIMS`, `CML_IDENTITY_ROLE_WINS` or any A_110
flag. `npm run pin:v2` builds every chapter's writer prompt (no call) for the two v2-prose fixture stores under three
profiles — off, shipped, shipped + arm B's four A_110 flags — and compares sha256s with `eval/replay/v2-prompt-pin.json`.
The three profiles differ (the flags reach the prompt). It also closes V2C-15: the A_110 "OFF is byte-identical" tests
compared unset with `"0"`.

### 2.5 The one readable unread book is not worth reading — MEASURED (WF-005 self-read)

Seed 82094's ON half: a fresh run (culprit Ivor, rotating panel), not a twin of the OFF read (culprit Ottoline, mirror);
started an hour before the fix it was meant to test; "chapter four" in dialogue, "six words" ×6, bare "X cleared."
lines after the reveal, the victim cleared as a suspect, every chapter opening on speech. Predicted 72–77.

---

## 3. Part 2 — the path to 90

### 3.1 The arithmetic

A 90 needs a category sum of 86–87 at the +3 to +4 offset seen at the top of the ledger. The highest sum recorded is
84; every category at its best ever sums to 87; the three readable recent books average 76.33. **INFERRED:** a 90 is a
tail event for any book whose true sum is under ~85 (a read carries ±3); the near target is a *reproducible* 84–86.

### 3.2 Where the gap is, and which work serves it

| categories | gap (§1.1) | work | status |
|---|---|---|---|
| plot, clues, ending | 5.33 | V batch (§5: the reveal window, decisive evidence before the test, the test on the page, the body line after the reveal, clearances on the page, the culprit stop); P-8 (one device, two-suspect clues) | the largest gap; now the first build |
| prose, dialogue, pacing | 2.33 | P-1 (met), V-12 (register hits), V-13 (restated times deletable), P-9 | partly built |
| character, hook, atmosphere | 1.0 | A_110 steps 0–1 (points 1–4 delivered twice), P-3b, P-4 (met), P-10 | delivered on one case |
| premise | 1.0 | nothing in flight | — |

### 3.3 The puzzle — what readers say, and what the cases show

**Readers (MEASURED, the four reads' notes):** three of four ask for the final proof to be tightened or simplified; two
say mechanisms compete ("too many mechanisms compete"; a clock clue against the mirror); one reports an ending
contradiction, one a thin confession.

**The cases (MEASURED):**

- Agent 3 is shown all five devices, twice, and told "select one primary device (or a coherent hybrid of two)". **13 of
  72 CMLs carry two or more** — but **3 of the 4 recently read cases do** (`d0ee7b26`: the ledger and the name-tag swap;
  seed 5670: the clock shift and the logbook forgery; bcc0d637: the fog shadow switch and the ledger masquerade). Under
  the archive's 18% that is P ≈ 0.02. The fourth (82094 OFF) carries one device and the timing thread its reader named.
- Over all read books still matched to a stored case, a hybrid-vs-one test has **6 cases (t 0.63): unmeasured**
  (`probes/hybrid-vs-reads.mjs`). The store keeps 64–72 cases; most reads are of cases it no longer holds.
- The inference path names a clock time in **23 of 34 non-temporal cases** (temporal known positive: 6 of 6); the
  discriminating test in 3 of 34. An alibi uses times legitimately, so 23 is an upper bound on the problem.
- A_110 P.6: 59 of 64 contracts let a reader settle on the culprit before the chapter ahead of the test.
- WF-005 adds contract defects that land on exactly these categories: the reveal's window an innocent's alibi (≥11/64),
  the crime window printed backwards (29/58), decisive evidence first at the test (19/64), the test on someone off the
  page (36/64), "The body: found dead" after the reveal (25/64), clearances off the page (41/64), the false lead's accused
  cleared before the accusation (54/64).

**INFERRED:** the puzzle's marks are lost in two places — cases that carry two mechanisms (upstream, P-8) and contracts
that state the solution's facts wrongly or in the wrong chapter (the V batch, §5). The second is £0 to fix and
measurable on all 64 stored contracts before any run.

### 3.4 P-8 — the puzzle upstream (the next analysis, A_112)

1. **One device** — BUILT behind its own flag, `AGENT3_ONE_MECHANISM`: Agent 3 sees only the primary device (the one the
   locked-fact registry is built from), once, and is told the case has one trick. Counter: devices reaching the CML
   (`probes/device-uptake.mjs`) — two-or-more falls from 13 of 72.
2. **The axis keeps the clock out of the reasoning** — BUILT under the same flag as a count: on a non-temporal axis, at
   most ONE inference step may reason from a clock time. MEASURED first (`probes/time-steps.mjs`, known positive:
   temporal cases 88% of steps): identity 40% of steps (21/52), authority 52% (28/54), spatial 29% (10/35).
3. **Two-suspect clues** (N9's upstream lever): Agent 5 writes clues that fit two suspects, so the reader model stops
   settling early. Counter: A_110 P.6's 59 of 64.

All three are upstream, so their test is a full-run pair (~£2.3 a case), bundled with CR-g's checklist read.

### 3.5 P-5 — the re-run of arm B, scored (run `resume-1791313282573`, £0.90, 47 calls)

Run from the a110-pair worktree at `ac9c8229`, same upstream, same four flags as arm B. **Not a clean isolation of
P-1..P-4** (V2K-05): the chapter-1 opening rank terms (M10, `2ba9e284`) landed after arm B's code and ran here too.

| # | prediction (stated before launch) | A′ | B | P-5 | verdict |
|---|---|---|---|---|---|
| 1 | SHIP-CHECK Normal | 24.5 | 61.2 | **59.8, WORTH A LOOK** | **FAILED** |
| 2 | "pressed her hand against the" ≤ 3 | 0 | 32 | **0** | MET |
| 2b | "pressed" in any form ≤ 33 | 22 | 160 | 38 | **FAILED** (narrowly; 160 → 38) |
| 3 | points 1–4 hold | — | met | first speech para 3; 5/5 introduced; victim's job and age; "We must wait for the police" (no doctor) | MET (police half) |
| 4 | January and 1934 in chapter 1 | 0/1 | 0/0 | **1/1** | MET |
| 5 | no paragraph introduces two; no more than two paragraphs in a row open on an introduction | — | 5 in a row | one per paragraph, **4 in a row**, the facts pasted as appositives | **FAILED** (half) |
| 6 | body-part tail ≤ 76.8 per 10k | 141.8 | 85.4 | **121.2** | **FAILED** |
| 7 | gate ships, no missing-clue failure | — | — | shipped; `clue_missing` 0 | MET |
| 8 | cost £0.85–1.05 | £0.91 | £0.95 | £0.90 | MET |

Also: words 10,557 (A′ 12,839); compressed 0.296, opener entropy 4.63 (A′ 0.332 / 5.40; but two flags-off writes of
this case, A and A′, already differ by 0.018 and 0.61, so page shape is inside one pair's noise); editor 162 applied, 17
rolled back, `registerNotWorse` **3** (arm B 45).

**What it settled:**
- **P-1 works** (the gesture habit 32 → 0; "pressed" 160 → 38). **P-4 works.**
- **P-2 works as a mechanism and does not move the book**: the drafts themselves carry 10–21% tail sentences, and the
  finder only reaches tails 4–15 of a chapter. V-12 (count register hits) supersedes the exemption.
- **P-3 failed in a new way**: the count was obeyed ("one introduction to a paragraph") while the roll call survived as
  four consecutive one-person paragraphs. The next operation is a spacing count (P-3b).
- **The repetition verdict is clock restatement, not a gesture.** P-5's worst spans are one ten-word alibi window
  written six times ("in the cellar between twenty minutes past eight and ten minutes to nine"); the editor sees it
  (`recap` 10, `copied_sentence` 3) and the clock guard reverts any deletion of a restated time (V2K-04 — arm B's
  verdict falls from 60.9 to 47.3 per 10k without clock spans, under the 51.9 threshold).

**Do not read P-5.** SHIP-CHECK says WORTH A LOOK; the next step is the V batch, then P-6.

---

## 4. Part 3 — modules (WP-005): my view (unchanged by the revision)

### 4.1 The short answer

**Yes to the design, not yet to the build, and not as written.** The thesis is right — one set of reader-facing levers
touched 38 files in six workspaces, more than humour's 28 — but K1–K5 move no mark by design, and the one dimension built
and measured is *delivered and not felt* (wit per 10k tripled; Humour stayed 6). The module kit is an investment in the
cost of the *next* dimension, not a lever on the next read, and it belongs after the paid path has settled the files
A_110 and the V batch are still changing.

### 4.2 The line WP-005 does not draw: obligations are core, pleasures are modules

The owner's five needs are moves in WP-005's own classes (place described, B; people introduced and the death responded
to, A; why-here, A; lexicon, D), but none is a *pleasure with a band*: each is a floor every book must meet, placed by an
event in the case, not by a share of a beat budget. **An obligation** has a fixed placement, no band and no share of zero,
and lives in the core contract under a flag; **a module** is an optional pleasure with a band, apportioned placement and
share 0 as its off switch.

### 4.3 Five corrections the paper needs before K1 (M-1) — MEASURED against the tree

(a) Humour reaches the bible (`bible.ts:247–251`) and the brief (`brief.ts:142–200`), which §8.3 and §11.4 forbid to
modules — grandfather the two seams for humour and refuse them to new modules. (b) K2's falsifier ("`grep -rl humour` = 0")
contradicts §11.3's shim rule — reword to "0 outside the module, its tests and a named shim list that may only shrink".
(c) G0 was provable only in a configuration that does not ship — now fixed by `pin:v2` (CR-d), which K1 must also run.
(d) The selector already weights wit at 1 (`selector.ts:101,397`) — grandfather it; new modules start at weight 0.
(e) File references moved (render at `run.ts:377–389`; `agent2b-scoring-adapter.ts` gone); `style-contract`'s
`humourTolerance` is a second humour setting the inventory missed; `reallocateBeats` (`contract.ts:759`) and
`clearTheOpening` (`opening.ts:143`) place beats outside humour's and depth's code and must move with them.

### 4.4 Sequence and gates

| step | when | proof |
|---|---|---|
| M-0 shipped-config pin | **done** (`c36add04`) | `npm run pin:v2` clean |
| M-1 amend WP-005 | now, £0 | the paper's falsifiers can pass on today's tree |
| M-2 K1 | after P-6 (the V batch and A_110 follow-ups edit `run.ts`, `contract.ts`, `brief.ts`) | replay and pin byte-identical; the isolation tool finds nothing |
| M-3 K2, K3 | after M-2 | byte-identical at `classic` and `dry`; the shim list printed |
| M-4 K4, K5 | when a read has scored a band other than `classic` | — |
| M-5 K6 | when a read names character or atmosphere as the shortfall | G0–G2; G3 through the checked read |

Until M-2, one WP-005 rule applies without the directory: declare a lever's vocabulary in one place and render it into
the chapter contract only.

---

## 5. The V batch — the audit's fixes, in the order they serve the gap

One new default-OFF flag, `PROSE_V2_AUDIT_FIXES`, carries every fix that changes a prompt, a selection or an edit;
instrument and hygiene fixes that change neither land unconditionally. Each fix is verified by re-running the WF-005
probe that found it (`documentation/workflow/WF-005-probes/`), over all stored contracts where it applies.

| id | fixes | serves | flag |
|---|---|---|---|
| V-1 | V2C-01 the reveal's window: the interval containing the true time of death that names no innocent; else none | clues, ending | AUDIT_FIXES |
| V-2 | V2C-02 the crime window: two facts in clock order, spelt as THE CLOCK spells them | clues | AUDIT_FIXES |
| V-3 | V2C-03 decisive clue strictly before the test; "already on the page" only from an earlier chapter | clues | AUDIT_FIXES |
| V-4 | V2C-04 the test's innocent on that chapter's page | plot | AUDIT_FIXES |
| V-5 | V2C-05 "The body" line only in the first body chapter, never at or after the reveal | ending | AUDIT_FIXES |
| V-6 | V2C-09 `consequenceFor` rendered from the filtered object | ending | AUDIT_FIXES |
| V-7 | V2C-10 a clearance in a chapter that has the suspect on the page | plot | AUDIT_FIXES |
| V-8 | V2C-11 the false lead's accused not cleared before the accusation | plot | AUDIT_FIXES |
| V-9 | V2C-12 page lists matched on name tokens | character | AUDIT_FIXES |
| V-10 | V2O-01/V2K-03 the culprit predicate: a kill verb with a person as object; no possessive agent; surname only when unique | ending, selection | AUDIT_FIXES |
| V-11 | V2O-02/V2K-02/V2K-10 book-level checks against the book so far plus the segment | selection | AUDIT_FIXES |
| V-12 | V2K-01 `registerNotWorse` counts register HITS (supersedes P-2's exemption) | prose | AUDIT_FIXES |
| V-13 | V2K-04 clock, locked-value and cast-name guards compare SETS, not counts — a restated time may be deleted | prose; the SHIP-CHECK | AUDIT_FIXES |
| V-14 | V2K-07 every never-fall guard compared on its own, not on the sum | all | AUDIT_FIXES |
| V-15 | V2K-08/V2K-11 the gate's clue stop and `clue_missing` on word-bounded, case-specific terms | clues | AUDIT_FIXES |
| V-16 | V2K-06 sentence split aware of closing quotes; V2K-09 orphan-tag and scaffold-word guards | selection | AUDIT_FIXES |
| V-17 | V2C-07 locked facts never cut from THE CLOCK; the count of dropped lines reported | clues | AUDIT_FIXES |
| V-18 | V2O-04 softened retry at the first attempt's temperature; V2O-07 soften once per run | comparability | AUDIT_FIXES |
| V-19 | V2O-03/V2C-06 a prose redo restores the run's locked facts | the instrument | unconditional |
| V-20 | V2O-05/06 checkpoint and run log keyed by the full run id; V2O-08 prose cost reported; V2K-05 the commit in run-params; V2O-09/10/11 | the instrument | unconditional |

Not in the batch (recorded, not built): V2C-08 (one spelling per time — needs the clock parser's vocabulary, the X38
choke point), V2C-13, V2C-14, V2O-09 (latent; it changes the prose artifact's shape and every replay digest), the
writer label in V2O-10 (cosmetic), and the second half of V2O-07 (the checkers judge the unsoftened clue).

### 5.1 What the batch measured — MEASURED (each group's WF-005 probes, re-pointed at its own build, OFF → ON)

| group | result |
|---|---|
| A — the editor's guards | register rollbacks on arm B's own edit lists 45 → 1; restated-time deletions reverted 40 of 42 → 0 (a vanished or new time still reverts 10 → 10); never-fall guard falls 3 of 83 → 0; tags counted though speech follows, in canon, 105 → 1; scaffold rollbacks on the word "contract" 2 → 0. Flags-off identical over 2,608 logged editor calls |
| B — selection and the gate | figurative culprit matches 125 → 0; arm B with every accusation stripped now STOPS (it shipped on "wit had cut"); `book_short` 150/150 → 0; `reveal_unnamed` 25 → 0; the gate's clue stop on another case passes 34/34 → 10/34, on canon 31–33 → 1–3, on its own book 34/34 → 34/34. 17 of 50 picks change |
| C — the contract | over 64 stored cases: wrong reveal window 30 → 0; backward crime window 31 → 0; decisive clue at/after the test 21 → 0; test innocent off the page 36 → 0; body line after the reveal 25 → 0; culprit job line 7 → 0; clearance off the page 41 → 0; accused cleared before accused 54 → 0; names dropped from pages 4 → 0; locked facts cut from THE CLOCK 18 → 0. No contract or trace rule newly violated; flags-off 0 of 512 rows moved |
| D — the instrument | a redo restores the source run's locked facts; a redo's checkpoint and log are its own; prose cost reaches the report; the commit is in run-config; softening once per run at the first attempt's temperature |

The groups also corrected the audit where their replays disagreed: V2K-07 is 3 of 83, not 5 of 89; V2C-02 is 31/58
(two windows cross midnight); V2C-01 is 30/64 wrong windows, not ≥11; V2C-12 is 4/64 (one "referred to" entry); one
of V2K-08's "known negatives" was the same case; V2K-10's "report-only findings explain needs_review" does not hold
(11 of 12 still need review on genuine findings).

### 5.2 The replay had been red for three days — and hid a leak of ours

`npm run replay:check` failed 5 of 5 before any of today's work: MATCH at `a283b422`, NO MATCH from `85c24445`, the
merge of a deliberate, unflagged fix that made `repeat_passage` fire (2026-10-03), never re-baselined. Re-baselining
and replaying the new cassettes at `58f1746c` (the tree before the A_110 build) left exactly one difference: chapter
10's editor prompt for case d0ee7b26 gained a `scaffold_token` on "for the first time in days". **The phrases of
A_110's flag-gated lines had joined the echo vocabulary unconditionally**, so a flags-off book was checked for wording
it was never sent. Fixed (`CONDITIONAL_TEMPLATE_PHRASES` count only when the contract printed them); after it all three
re-baselined fixtures MATCH at `58f1746c` — **flags off, HEAD is byte-identical to the tree before A_110** on those
cases. Two lessons: a red check nobody re-baselines stops being read, and "OFF is byte-identical" tests that build the
contract never see the editor's input.

**P-6 then tests everything at once** on the second case (spatial, `canary_1790962241799`): arm A′ = shipped config;
arm C = shipped + arm B's four A_110 flags + `PROSE_V2_AUDIT_FIXES` + P-3b. Predictions are written in the run record
before launch; the first is SHIP-CHECK Normal on arm C, without which nothing is read.

## 6. Decisions the owner delegated, and what I decided

The owner's instruction was "proceed as you see best with any questions needing answering":

1. **P-5** — run (£0.90); results §3.5.
2. **Decision 2** — flipped on the graded archive (§2.2); one line in `.env.local` reverts it.
3. **CR-f** — not read (§2.5).
4. **CR-e** — audited with four read-only agents, not a workflow (WF-005).
5. **Modules** — the sequence in §4.4 and the obligations/pleasures line in §4.2 stand.
6. **D-3** — CLAUDE.md's costs corrected and the redo-against-redo rule added.
7. **P-6** — held until the V batch lands: spending £1.90 on a second case with the clock guard still forbidding the
   deletions that clear SHIP-CHECK would buy another unreadable book.

## 7. What this plan cannot settle — stated

- **ASSUMED:** three readable recent reads represent the engine; the reader is unrecorded on all 79 (A_110 N10).
- **INFERRED, not shown:** that hybrid devices and the timing thread cost the puzzle marks (the read test has n=6).
- **Unknown:** whether the V batch moves a read at all — every WF-005 measurement is of contracts, prompts and edits.
- **Unknown:** whether a reproducible 84–86 is reachable without a premise change; premise sits at 8 in every recent read.
