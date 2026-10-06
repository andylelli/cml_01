# ANALYSIS_111 — From here to 90: the code-review close-out, the path, and modules

2026-10-06 · branch `feat/a110-build` at `166adbf9` · **no code changed; £0 spent** · sources: three read-only surveys
of this tree (the code review's ledger, the path-to-90 records, WP-005 against the code), and the £0 measurements in
§1–§4, each run for this document and each labelled.

The owner asked for one plan covering three things: (1) every fix from the code review of 2026-09-25/26, (2) the path to 90,
and (3) the modular work in WP-005, with my own view on it.

---

## STATUS

Resumable: each row names its cost and what decides it. "this commit" is replaced by the hash in the next.

| id | item | cost | needs | status | commit |
|---|---|---|---|---|---|
| **CR-a** | owner decision 2 (`CML_IDENTITY_ROLE_WINS`): replace "flip after N runs" with a labelled sample and a tie rule (§2.2) | £0 | owner: accept the rule | PROPOSED | — |
| CR-b | A6-07 (the blind reader is told the detective and victim are suspects) | £0 | CR-a | BLOCKED on CR-a | — |
| CR-c | regenerate the review's stale status pages (README tracker, OPEN-QUESTIONS, DECISION-12 status, OWNER-DECISIONS appendix) | £0 | — | TODO | — |
| **CR-d** | **the replay pins a configuration that does not ship** (§2.3): add a shipped-config pin | £0 | — | TODO | — |
| CR-e | a code review of the v2 engine, which the review never covered | £0 money; a multi-agent workflow | owner: opt in to a workflow | PROPOSED | — |
| **CR-f** | read the 82094 ON half, the only readable unread book (§2.4) | £0 money | owner: the read | READY | — |
| CR-g | `AGENT5_CLUE_SPEC_CHECKLIST` paid read | ~£1.15 | owner | DEFERRED: bundle with P-8 | — |
| CR-h | injector row "(…reserved for chapter 6)" | £0 | the next pair's prompt log | OPEN: check at P-5 | — |
| **P-1** | restore the exchange line's examples (§3.4 A1) | £0 | — | TODO | — |
| **P-2** | strict deletions exempt from `registerNotWorse`, proven offline on arm B's edits first (A2) | £0 | — | TODO | — |
| P-3 | introductions: at most two per paragraph, facts rather than a sentence to paste (A3) | £0 | — | TODO | — |
| P-4 | the date in the opening contract (A4) | £0 | — | TODO | — |
| **P-5** | re-run arm B on bcc0d637 with P-1..P-4 | ~£0.95 | owner: yes, with parameters | WAITS | — |
| P-6 | second case: the A′/B pair on the spatial canary (A_110 P.3) | ~£1.90 | owner | WAITS on P-5 | — |
| P-7 | the external read of the better B arm, with the checked read (`scripts/checked-read.mjs`) | £0 money | owner; SHIP-CHECK Normal and no fallback chapter | WAITS on P-6 | — |
| **P-8** | puzzle side: the one-mechanism probe and the two-suspect-clue design (§3.5) | £0 | — | TODO: the next analysis | — |
| P-9 | step-3 bundle pair (`PROSE_V2_KEYNESS_FINDING`, `_TOUCH_ONCE`, `_PRESENCE_PENALTY`) | ~£0.95 | owner | WAITS on P-5 | — |
| P-10 | step-2 upstream (`CML_A110_UPSTREAM`), full-run pairs on two cases | ~£4.60 | owner | WAITS on P-7 | — |
| M-0 | = CR-d (the shipped-config pin is the precondition of every module move) | £0 | — | TODO | — |
| M-1 | amend WP-005 with the five corrections in §4.3 | £0 | — | TODO | — |
| M-2 | K1: registry, isolation tool, seam interfaces, zero modules | £0 | M-0, M-1; A_110's files settled (after P-6) | WAITS | — |
| M-3 | K2 humour, K3 depth | £0 | M-2 | WAITS | — |
| M-4 | K4 apportioner, K5 report and the `dimensions` spec field | £0 | M-3 | DEFERRED: no read has scored a band | — |
| M-5 | K6/K7, the first new modules | £0.45–£1.15 each | a read that names character or atmosphere as the shortfall | DEFERRED | — |
| D-1 | PLAN-TO-90 has no entry for the 2026-10-06 pair: UPDATE 17 | £0 | — | DONE | this commit |
| D-2 | A_110's STATUS still says "nothing here has been read by a paid run" | £0 | — | DONE | this commit |
| D-3 | CLAUDE.md prices a prose redo at ~£0.45; a v2 arm is ~£0.9 (MEASURED twice: £0.91, £0.95) | £0 | owner: CLAUDE.md is theirs | PROPOSED | — |
| D-4 | `17-hitting-90/00_README.md` line 4 says the best read is 87; it is 88 | £0 | — | TODO | — |

---

## 1. Where we are

### 1.1 The reads — MEASURED (`scripts/external-read-ledger.mjs`, 79 manuscripts, 77 with marks)

- **The best read is 88** (`read-20260925-1240`: a v2 redo against an older case's upstream). Its category sum is 84,
  with an offset of +4.
- **The last fifteen reads average 81.4.** The fresh v2 books read 69, 74, 84, 78, 80 and 82.
- **Dialogue, pacing and prose have never reached 9.** Hook and character have reached it once each.

The four reads since 2026-09-30, against the target book in `17-hitting-90/05` (sum 86, which reads 89–91 at an offset
of +3 to +5):

| | premise | hook | plot | character | dialogue | atmosphere | clues | pacing | ending | prose | sum |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 09-30 | 8 | 8 | 8 | 8 | 8 | 9 | 7 | 8 | 8 | 7 | 79 |
| 10-02 (seed 5670) | 8 | 7 | 7 | 7 | 6 | 8 | 7 | 6 | 7 | 5 | 68 |
| 10-02 (82094 OFF) | 8 | 8 | 7 | 8 | 7 | 9 | 7 | 8 | 6 | 7 | 75 |
| 10-02 (bcc0d637) | 8 | 8 | 7 | 8 | 7 | 9 | 7 | 7 | 8 | 6 | 75 |
| **mean** | 8.0 | 7.75 | 7.25 | 7.75 | 7.0 | 8.75 | 7.0 | 7.25 | 7.25 | 6.25 | **74.25** |
| **target** | 9 | 8 | 9 | 9 | 8 | 9 | 9 | 8 | 9 | 8 | **86** |
| **gap** | 1.0 | 0.25 | **1.75** | 1.25 | 1.0 | 0.25 | **2.0** | 0.75 | **1.75** | **1.75** | **11.75** |

**MEASURED:** the gap to the target is 11.75 category points. Plot, clues and ending account for 5.5 of them (47%).
Prose, dialogue and pacing account for 3.5 (30%). Hook, character and atmosphere, the three categories the owner's
A_110 points serve, account for 1.75 (15%).

**INFERRED:** A_110 is for the owner's read, which the rubric does not score (A_110 §8: the rubric scores none of the
owner's first four points). On the reader's rubric, the path to 90 runs mainly through the puzzle and the prose.

### 1.2 A_110 — MEASURED (`PAIR-bcc0d637-2026-10-06.md`, one case, three arms, £1.86)

- Every A_110 item is built behind a default-OFF flag.
- With four of them on, the writer delivered the owner's points 1–4 on the page: the place before the first line of
  speech, five of five people introduced, the victim's job and age, and police and a doctor sent for. Arm A′, with
  every flag off, delivered none of them.
- **Point 5 got worse.** Arm B's draft says "pressed her hand against the" 32 times; A′ says it 0 times. Arm B's
  SHIP-CHECK is WORTH A LOOK at 61.2 per 10k, so it must not go to a reader.
- **Confirmed for this document (MEASURED in the pair worktree's prompt log):** the D5 exchange-line wording reached
  44 of arm B's writer prompts. The old wording, with its examples, reached 42 of A′'s. So B's writer never saw the
  examples, which is the premise of the pair's inferred cause.
- **Also MEASURED here:** `PROSE_V2_KEYNESS_FINDING` (M8, off in the pair) ranks "she pressed her hand" second in B's
  book, ×11 against a canon count of 2. The finding that exists to catch this habit does catch it.

### 1.3 The code review — MEASURED (`documentation/code-review/tools/build-ledger.mjs --check`)

`ledger ok: 401 items, 397 closed` (212 done, 176 withdrawn as moot, 9 duplicates).

- **Four items are open, and all four wait on one owner decision:** CR-12's identity module, `CML_IDENTITY_ROLE_WINS`.
- 145 of the withdrawals are v1 code that was deleted on 2026-10-01 (owner decision 1).
- **The engine that ships, v2, was never reviewed.** The review's README says it "needs its own pass".

### 1.4 WP-005 — MEASURED (the survey of the tree against the paper)

- **Designed, not built.** There is no `modules/` directory, no registry, no isolation tool and no apportioner.
- **Humour has not shrunk.** The paper's grep still finds 28 files in 7 workspaces. A broader grep finds 42 files in 9.
- **A_110 itself touched 38 non-test source files in 6 workspaces** (`git diff --name-only` from the merge base to
  `e874035a`, excluding tests and dist): prose-engine 17, prompts-llm 7, worker 5, cml 4, llm-client 3, prose-guard 2.
- **INFERRED:** the newest set of reader-facing levers spread further than humour did. That is WP-005's thesis, holding
  for a third time.

---

## 2. Part 1 — the code-review fixes: what is left, and what I would do

### 2.1 What is left, all of it

| what | where it stands | what I would do |
|---|---|---|
| A34-02, A1X-01, A34-D10 (built, in shadow), A6-07 (todo) | blocked on owner decision 2 | §2.2 |
| the review's status pages | stale: the README tracker says 30 of 34 (CR-16 shows wip, CR-28 and CR-34 deferred); OPEN-QUESTIONS says "34 remain"; the OWNER-DECISIONS appendix says "62 open" | CR-c: regenerate; £0 |
| the replay harness | pins the OFF branch of the flags that ship ON | §2.3, CR-d |
| the v2 engine | never reviewed; A_110 then changed 17 prose-engine files | CR-e |
| the seed-82094 pair | the ON half is unread; it is readable | §2.4, CR-f |
| `AGENT5_CLUE_SPEC_CHECKLIST` | waits on its own paid read | CR-g: fold into P-8's puzzle pair rather than buy a read for it alone |
| the injector row "(…reserved for chapter 6)" | attributed to the model paraphrasing an instruction | CR-h: grep P-5's prompt log and draft for it; £0 |

### 2.2 Decision 2 needs a labelled sample, not more runs

**MEASURED today:** `scripts/role-predicate-disagreement.mjs` finds **587 disagreements over 2,617 archived cast
members**, across five predicate pairs (the largest is `.includes('detective')` at 200). The live counter across the
82094 pair found 3, all at `agent2.victim`. In each, the model had marked two members `role: victim`.

"Flip after N runs" counts how often the two answers differ. The archive has already counted that, 587 times.
**What nobody has measured is which answer is right.**

The CML holds no victim field independent of the role text. **MEASURED** on the newest CML: the `CASE` keys are meta,
`death_method`, cast, `culpability` and the solution models, and the victim is known only through `role_archetype`. So
the archive cannot grade itself; a person has to.

**Proposed rule (CR-a):**

1. Draw 40 disagreements, stratified over the five predicate pairs.
2. Label each by reading its case: is this member the victim or the detective? About an hour, £0.
3. Add the tie rule the live counter asks for: when two members carry `role: victim`, keep the one the case's
   `death_method` or culpability text names, and count the tie.
4. Flip `CML_IDENTITY_ROLE_WINS` if the unified predicate is right in at least 36 of the 40.

The flip unblocks all four open items.

### 2.3 The replay pins a configuration that does not ship — MEASURED

`scripts/replay-stage.mjs --env` removes every registered flag and applies only the fixture's recorded environment.

- **The five fixtures in `eval/replay/` record 146–147 environment keys, and none of them is `CML_VERIFIED_FIXES`,
  `CML_PROMPT_TRIMS` or any A_110 flag.**
- Since 2026-10-02, `.env.local` sets `CML_VERIFIED_FIXES=1` and `CML_PROMPT_TRIMS=1`.

So `npm run replay:check` proves that the OFF branch of the shipped flags is byte-identical. **Nothing pins the ON
branch, which is what runs.** `reallocateBeats`, the closest thing in the tree to WP-005's K4, sits under
`PROSE_V2_CONTRACT_FIXES` and is unprotected the same way.

**Fix (CR-d), cheapest first:**

1. Add a dry-mode digest: `PROSE_V2_DRY` builds every v2 prompt without a call. Hash the prompts under the shipped
   environment on the two v2-prose fixtures' stores, and commit the digest. £0, and it pins prompts but not outputs.
2. Record the next paid prose redo (P-5) as a cassette fixture under its own environment. That pins outputs as well,
   at no extra cost, because the run is being paid for anyway.

**A WP-005 move is only as safe as this pin** (§4.3 c).

### 2.4 The one readable unread book — CR-f

`stories/story_20261002-1855/` is the ON half of the seed-82094 pair (spatial, 1950s, CountryHouse). DECISION-12
records its SHIP-CHECK as Normal at 1.5 per 10k, with no fallback chapter, and it has not been read.

Its OFF half read **80**, with ending **6**. The reader called chapter 10's contradiction the biggest flaw and wrote
"87–89 with chapter 10 corrected". The injector audit traced that contradiction to our own contract, which put the
arrested culprit on the page in the aftermath. It was fixed behind `CML_VERIFIED_FIXES` in `7501ebf9`, and that flag
is ON in the ON half.

**Prediction for the read:**

- no arrested culprit acting in the aftermath;
- ending ≥ 7;
- headline within ±7 of 80, since a smaller difference is unmeasured (`rubric-cannot-rank-two-books`).

This read costs no run. It scores a decision already shipped, and it adds a spatial read, an axis that has one.

---

## 3. Part 2 — the path to 90

### 3.1 The arithmetic

- **A 90 needs a category sum of 86–87** at the +3 to +4 offset seen at the top of the ledger. That means 9s in
  premise, plot, character, atmosphere, clues and ending, and 8s elsewhere.
- **The highest sum ever recorded is 84.** Every category at its best ever sums to 87.
- **The fresh v2 books average 74.25 over the last four reads** (§1.1).
- **INFERRED:** with a read's ±3 noise, a 90 is a tail event for any book whose true sum is under about 85. The
  realistic near target is a *reproducible* sum of 84–86, which turns 88s into the expected case and makes a 90
  possible.

### 3.2 Where the gap is, by category, and which work serves it

| categories | gap (§1.1) | work that serves it | status |
|---|---|---|---|
| plot, clues, ending | 5.5 | P-8 (one mechanism, two-suspect clues); `PROSE_V2_SCHEDULE` (N9 + M9); the ending-contract fix under `CML_VERIFIED_FIXES` | the least built |
| prose, dialogue, pacing | 3.5 | P-1/P-2 (point-5 repair); P-9 (keyness, touch-once, presence penalty); the selector ranks | built, unproven; one regression open |
| character, hook, atmosphere | 1.75 | A_110 steps 0–1 (delivered in the pair), P-3, P-4, step 2 upstream (P-10) | delivered on one case |
| premise | 1.0 | upstream novelty (WP-004); nothing in flight | — |

### 3.3 What the readers say about the puzzle — MEASURED (the four reads' notes, `chatgpt-review.txt`)

- **Three of the four ask for the final proof to be tightened or simplified:** "the final timing statement needs
  tightening"; "the dagger/Kenneth proof needs strengthening"; "the final proof needs simplification".
- **Two of the four say mechanisms compete:** a clock clue competing with the mirror on the spatial case, and "too many
  mechanisms compete" on the identity case.
- One reports an ending contradiction (fixed since, §2.4), and one a thin confession.

The upstream measurements agree with the readers:

- **Agent 3b writes exactly 5 devices for every case: 79 of 79 stored** (MEASURED).
- **A_110 P.6:** 59 of 64 contracts let the reader model settle on the culprit before the chapter ahead of the test,
  because about six culprit facts must surface before it.
- **MEASURED today:**
  - Known positive: on the 6 temporal cases, the inference path names a clock time in 6 of 6, the discriminating test
    in 4 of 6, and 22% of clues carry one.
  - On the 34 non-temporal cases, the discriminating test names a clock time in only 3 of 34. But the inference path
    names one in **23 of 34**: identity 8 of 13, authority 11 of 13, spatial 4 of 8.
  - Axes are joined from specs and `run-params` cast names; 32 cases have no recorded axis.
- **INFERRED:**
  - The cases are over-determined.
  - In two-thirds of non-temporal cases, a timing thread rides along in the reasoning. That thread is what the
    readers call a competing mechanism.
  - A_83 found the same thing in July: "NO check compares any artifact to primaryAxis".
  - An alibi uses times legitimately, so the 23 is an upper bound on the problem, not a count of it.

### 3.4 The order, with costs and predictions

**Stage A: the point-5 repair. £0 to build, generic to any case.**

- **A1 (P-1).** Restore the exchange line's examples and keep D5's other three lines.
  - "A different act each time" is a qualifier this model drops (A_102 §7). Better still, give the slot a shape: the
    contract assigns each chapter two act kinds from the list, rotated. That is an operation, not a variety request.
- **A2 (P-2).** Exempt *strict deletions* from `registerNotWorse`, meaning edits where the replacement is the find
  text with a span removed.
  - The guard reverted 45 of B's 53 rolled-back edits.
  - Its instrument has a slope of zero against the reads since 2026-09-01 (WP-006 §3.2), and `register_sentence` is
    anti-calibrated in v2.
  - **Verify offline first:** re-apply B's editor edit lists from the pair worktree's prompt log through `dist`'s
    `applyEditList`, with and without the exemption, and report the body-part tail per 10k. If the exemption does not
    bring the fall to ≥ 65 per 10k on B's own edits, A2 is not the lever and the re-run should not carry it.
- **A3 (P-3).** At most two introductions per paragraph. Give the writer the occupation and the relation as fields,
  never as a sentence. Arm B pasted Eleanor's appositive from the contract nearly word for word.
- **A4 (P-4).** Put the date in the opening contract. Today the where-and-when line is in the bible, and the opening
  names the place only.

**Stage B: P-5, the re-run of arm B on bcc0d637 (~£0.95, the owner's yes).**

- Same upstream, same four flags, plus A1–A4. `PROSE_V2_BOOK_FIRST` stays out, so the re-run isolates the repair.
- Predictions:
  - SHIP-CHECK Normal;
  - "pressed" in any form ≤ 1.5× A′ (A′ 22);
  - points 1–4 still met;
  - month and year in chapter 1;
  - no paragraph of chapter 1 introducing more than two people;
  - body-part tail per 10k falls ≥ 65 against A′ *if* A2 passed its offline check.
- Record the run as a replay cassette (CR-d, step 2).

**Stage C: P-6, the second case (~£1.90).**

- A′ and B on the spatial canary (`canary_1790962241799`), as A_110 P.3 requires. Nothing is accepted on one case.

**Stage D: P-7, the read (£0 money, the owner).**

- Read the better B arm only if its SHIP-CHECK is Normal and it has no fallback chapter. Ask the checked read's yes/no
  questions in the same session.
- Predictions:
  - character ≥ 8 and hook ≥ 8;
  - plot, clues and ending not lower than the case's earlier read (82: plot 7, clues 7, ending 8);
  - the checked read agrees with the probe on at least 4 of 6.
- A disagreement on a question means no mark can register that point, and the owner's own read is its only judge.

**Stage E: P-8, the puzzle side (£0 now; a paid pair later). The largest gap, and the least built.**

- The next analysis, A_112, starts from the 23-of-34 count and the 5-devices-every-time count. It asks three things:
  1. Classify each inference step in the 34 non-temporal cases as time-dependent or not. Do the four complaint books
     carry time-dependent steps on a non-temporal axis? This is the probe, with temporal cases as the known positive.
  2. Can Agent 3 be told which kind of fact its axis lets the inference path lean on? That would be an operation keyed
     to `primaryAxis`, the comparison A_83 found that no check makes.
  3. Can Agent 5 write clues that fit two suspects, so the reader model stops settling early? This is N9's upstream
     lever.
- `PROSE_V2_SCHEDULE` belongs in this stage's pair, not P-9's, because it moves clue chapters.

**Stage F: P-9, the step-3 bundle (~£0.95).**

- `PROSE_V2_KEYNESS_FINDING`, `PROSE_V2_TOUCH_ONCE` and `PROSE_V2_PRESENCE_PENALTY` on top of P-5's arm. All three act
  on repetition across the whole book.
- Predictions:
  - compressed ratio and opener entropy move toward canon, in the direction P-5's arm B did not;
  - M8's ranked phrases fall by ≥ half.

**Stage G: P-10, step 2 upstream (~£4.60).**

- Full-run pairs on two cases for `CML_A110_UPSTREAM`. It changes Agent 2b, 2c and 7 output, so a prose-only pair
  cannot carry it.

**Budget through stage D: ~£2.85. Through G, with the P-8 pair: ~£9.5.** Every paid step needs the owner's yes with its
full parameters stated first (CLAUDE.md).

### 3.5 What I would not do

- **Send arm B to a reader.** Its SHIP-CHECK forbids it.
- **Read P-9's levers alone.** They touch every chapter. Bundle them, and let the book's own instruments score them.
- **Flip `CML_IDENTITY_ROLE_WINS` on a count of runs.** More runs cannot say which answer is right (§2.2).
- **Treat A_110 as the path to 90 on the rubric.** It is the path to the owner's "not wooden". On the reader's
  categories it can close at most 15% of the gap (§1.1).

---

## 4. Part 3 — modules (WP-005): my view

### 4.1 The short answer

**Yes to the design, not yet to the build, and not as written.**

- **The thesis is right, and A_110 is the newest proof.** One set of reader-facing levers touched 38 source files in six
  workspaces, more than humour's 28 (§1.4). Every new owner request will cost the same until a dimension has a home.
- **K1–K5 move no mark by design.** They are byte-identical moves. The one dimension already built and measured is
  *delivered and not felt*: wit per 10k tripled and the reader's Humour mark stayed at 6 (WP-005 §1.4).
- **So the module kit is an investment in the cost of the *next* dimension, not a lever on the next read.** It belongs
  after the paid path has settled the A_110 files, not alongside it.

### 4.2 The line WP-005 does not draw: obligations are core, pleasures are modules

The owner's five needs (A_110) are moves in WP-005's own classes:

- place described, class B;
- people introduced and the death responded to, class A;
- why-here, class A;
- lexicon, class D.

But none of them is a *pleasure with a band*. Each is a floor every book must meet, and each is placed by an event
in the case (chapter 1, a person's first appearance, the discovery chapter), not by a share of a beat budget.

WP-005's apportioner places by share and has no notion of an event-anchored move. **I would write that line into the
paper:**

- **an obligation** has a fixed placement, no band and no share of zero, and lives in the core contract under a flag;
- **a module** is an optional pleasure with a band, apportioned placement and share 0 as its off switch.

A_110 stays core. Humour, depth and the twenty-six others are modules. Without the line, every floor the owner asks for
will look like a candidate module, and the registry will grow a second placement system inside it.

### 4.3 Five corrections the paper needs before K1 (M-1) — MEASURED against the tree

**(a) Humour reaches the bible and the brief, not only the chapter contract.**

- `bible.ts:247–251` writes a "Humour:" line per character, and `brief.ts:142–200` lists the wit chapters and register
  asks.
- The paper's render seam covers the contract only, and §8.3 and §11.4 forbid module output in the bible and the brief.
- So K2 cannot be a pure move. Either add bible and brief seams, grandfathered for humour and refused to new modules,
  or retire humour's bible line first as a behaviour change with its own pair. I would grandfather: retiring it is a
  prose change nobody has asked for.

**(b) K2's falsifier contradicts §11.3's shim rule.**

- "`grep -rl humour` outside the module = 0" cannot pass while `humourStyle` and `humourLevel` stay top-level for the
  Agent 2b and 6.5 scorers.
- Reword it: 0 outside the module, its tests and a named shim list, and the list may only shrink.

**(c) G0 is proven against the wrong configuration** (§2.3). A move proven byte-identical with the shipped flags off
proves nothing about the book that ships. M-0 (CR-d) must land first.

**(d) The selector already weights wit at 1** (`selector.ts:101,397`, with its target from the band). §11.6's "module
features at weight 0" cannot apply to humour without changing which draft wins. Grandfather it, like the bible line,
and apply weight 0 to new modules only.

**(e) The file references have moved.**

- The render is at `run.ts:377–389`, not `:281`.
- `agent2b-scoring-adapter.ts` no longer exists.
- `style-contract`'s `humourTolerance` (0–3) is a second humour setting the inventory missed; it must be merged or
  retired in K2.
- Two placements now happen outside humour's and depth's own code, and both would be lost in a registry loop that
  ignored them:
  - `reallocateBeats` (contract.ts:759) handles wit and depth in one function under `PROSE_V2_CONTRACT_FIXES`;
  - `clearTheOpening` (opening.ts:143) moves chapter 1's depth beat.
- `reallocateBeats` should be pulled out of the broad flag into its own before K4, since it is K4's seed: load-based
  carriers, the role mask and nearest-chapter relocation.

### 4.4 Sequence and gates

| step | when | proof | why then |
|---|---|---|---|
| M-0 shipped-config pin | now, £0 | the dry-mode digest is green on the shipped env and on the A_110-B env | it protects the shipped book regardless of modules |
| M-1 amend WP-005 | now, £0 | the paper's falsifiers can pass on today's tree | a falsifier that cannot pass is not a falsifier |
| M-2 K1 | after P-6 | replay and digest byte-identical; the isolation tool finds nothing | A_110's follow-ups edit `run.ts`, `contract.ts` and `brief.ts`; a move beside a change in the same files breaks "move, then change" (WP-005 §11.2) at the branch level |
| M-3 K2, K3 | after M-2 | byte-identical at `classic` and `dry`; the shim list printed | — |
| M-4 K4, K5 | when a read has scored a band other than `classic` | — | no read has ever been made of a `dry` book, so the apportioner's one behaviour change has nothing to regress against or improve |
| M-5 K6 | when a read names character or atmosphere as the shortfall | WP-005 G0–G2; G3 through the checked read | the checked read (A_110 §39.2) is the G3 instrument WP-005 lacked: a yes/no question about the move, compared with its recogniser |

**Until M-2, one WP-005 rule applies to every new lever without the directory:** declare the lever's vocabulary in one
place and render it into the chapter contract only. A_110's specimen trims (`PROMPT_SPECIMEN_TRIMS`) and the
echo-derived instruction checks are already that rule, applied by hand.

---

## 5. Decisions only the owner can make

1. **P-5**: the re-run of arm B (~£0.95), once P-1..P-4 are built. I will state the full parameters before launch.
2. **CR-a**: the decision-2 rule — 40 labelled disagreements, flip at 36 of 40, plus the two-victims tie rule.
3. **CR-f**: read the 82094 ON half.
4. **CR-e**: whether to run a code review of the v2 engine as a multi-agent workflow.
5. **Modules**: the sequence in §4.4, and the line between obligations and modules in §4.2.
6. **D-3**: CLAUDE.md's ~£0.45 figure for a prose redo. A v2 arm is ~£0.9.

## 6. What this plan cannot settle — stated

- **ASSUMED:** the four reads since 2026-09-30 represent the fresh v2 engine. They are four books, the reader is
  unrecorded on all 79 (A_110 N10), and the means carry ±3 per read.
- **INFERRED, not shown:** that the timing thread is what readers call a competing mechanism. P-8's probe decides it.
- **Unknown:** whether a reproducible 84–86 is reachable without a premise change. Premise has sat at 8 in all four
  recent reads, and nothing in flight serves it.
