# Roadmap from 82 — everything outstanding, in order

**Written:** 2026-08-25, after the first run of the credentialed era returned **82/100**
(`story_20260825-1838`, the rewound lobby clock — the 38th read in the ledger).

**Supersedes nothing.** [PLAN-TO-90](PLAN-TO-90.md) remains the strategic argument and
[REVIEW_05](REVIEW_05.md) remains the X-tracker. This is the *action list*: what is built, what is
gated, what is unbuilt, and the order to spend in — consolidating A_72's workstreams, A_73's five
review parts, and what the 08-25 read just proved.

---

## 0. Where the number actually is

```
best ever              86   (08-06 weighted pendulum, sum 83 · 08-17 reversed pendulum, sum 82)
previous run           85   (08-23 hourglass, sum 80, premise 9 + clues 9)
THIS run               82   (08-25 lobby clock, sum 77, NO 9s at all)
reader's own forecast  87-89  for this manuscript with its six named fixes applied

a FLOOR of 90 needs a category sum of 88 = eight 9s and two 8s, EVERY run
best-ever-in-every-category sums to 85 and projects to 88.9
five categories have never scored a 9 in 38 reads
```

**The gap is not defects.** Every item in §2 below removes a defect and moves a 7 to an 8. The
reader's own forecast with *all* of them applied is 87–89. The last marks need §4.

---

## 1. Step 1 — DONE (2026-08-25)

- [x] Credentials working. **The endpoint had `/openai/v1` appended**, so every call 404'd
      regardless of key or deployment; the client appends `/openai/deployments/...` itself. Bare host
      restored, backup at `.env.local.bak-20260825`.
- [x] Baseline run with Opus 5 post-pass polish: **£1.78**, 49 calls, 2/10 batches retried,
      shadow rubric 82, external read 82.
- [x] Read parsed and merged into the ledger as `read-20260825-1838`.

**What the baseline established, beyond the mark:**

- **Cross-run novelty ran for the first time.** The A_73 §12.1 ledger fix works —
  `diverging from 7 recent run(s)`. It had been silently reading an empty corpus.
- **The clue-paste counter fired for the first time** (A_73 §15.1): 1 paste this run.
- **Opus polish is live**: `polish routed to Anthropic model claude-opus-5`, 14 calls, $0.52 of the bill.

---

## 2. Step 2 — the defect-removal run, in sub-steps

**One run, four flags, because they target four different categories and are therefore still
attributable from a single read.** ~£1.78 + one read.

### 2a. Set the flags

```
AGENT9_FOLD_SUSPECT_CLEARANCES=true   # X93
AGENT9_CLEARANCE_AT_END=true          # A_73 §34
AGENT9_LOCKED_FACT_ALIASES=true       # A_73 §2 (C4)
AGENT9_CONTINUITY_SPAN=true           # A_73 §30
```

- [ ] **2a-i · `AGENT9_FOLD_SUSPECT_CLEARANCES`** — targets **prose**, the run's worst mark (6).
      The 08-25 reader quoted the clearance injector verbatim and called it *"not fiction … a
      generated evidence-summary fragment … this alone knocks prose/polish down hard."* A_72 §4
      measured X93 making that complaint disappear from a read. **It is off right now.**
- [ ] **2a-ii · `AGENT9_CLEARANCE_AT_END`** — same defect, different axis: stops the block landing
      at paragraph 2 where it pre-empts the chapter's scene. Pair with 2a-i, not instead of it.
- [ ] **2a-iii · `AGENT9_LOCKED_FACT_ALIASES`** — targets **dialogue** (7, and 8 exactly once in 38
      reads). The validator only ever required the canonical value ONCE per story; the repetition
      came from one prompt line.
- [ ] **2a-iv · `AGENT9_CONTINUITY_SPAN`** — targets **pacing/ending**. The reader's problem #2 is
      *"the final reveal repeats itself after Beatrice confesses"*; continuity currently records one
      sentence per chapter, sampled from the part where nothing has happened yet.

### 2b. Do NOT set these in the same run

- [ ] **`AGENT9_CROSS_CHAPTER_ECHO`** — spends from the retry budget, and retries are what fire the
      injectors and drive cost (A_73 §6). Wait for a cost governor.
- [ ] **`AGENT9_CRITICAL_BLOCK_CAPS`** — worth testing, but it changes *which* context survives under
      pressure, so a mark that moves cannot be attributed alongside four prose levers. Its own run.

### 2c. Run and read

- [ ] Rebuild first (`npm run build:all`) — `dev` runs compiled output with no watch, and a stale
      `dist` silently executes yesterday's code (A_73 §19.1). **Do not edit source while it runs.**
- [ ] `node scripts/canary-core.mjs`, then `node scripts/external-read-ledger.mjs --write`.
- [ ] Predicted, so it can be falsified: **prose 6→8, dialogue 7→8, pacing 8, sum 77→80±2.**
      If prose does not move, the clearance injector is not the cause and §34 is wrong.

### 2d. Two instruments to read from the same run — free

- [ ] **`deterministic_clue_paste_count` and the clearance count** — with 2a-i/ii on, both should
      fall. They are in the report diagnostics now.
- [ ] **The paragraph-guard warning** (`[A_73] regen REJECTED by paragraph-preservation guard`) —
      splits A_73 §4.2's `missing_clue` retries into "the model can't plant it" vs "the guard threw
      away a good repair". Still unanswered.

---

## 3. Confirmed defects with no flag — build these

- [ ] **3a · `entity_pronoun_drift_count` is wrong, and now proven so by a human.** This run
      reported **0** while the same log said *"15 pronoun issue(s) remain after deterministic
      rescue"* and the reader found Finch — pinned **female** in the canary inputs — written as
      *"his expression composed"* and *"he"* in Chapter 1. `findings-20260529-run-f30.md` predicted
      exactly this. **A metric that reports 0 on a defect a reader can see in chapter 1 is worse
      than no metric.** Fix the counter before trusting any pronoun result.
- [ ] **3b · `clearance_over_budget` has NO REPAIR PATH.** The gate fired on ch10 of this run
      (*"3 sentences against a budget of 2"*) and the log says plainly that no pass can trim a
      register. Either build the trim pass or stop raising a violation nothing can act on.
- [ ] **3c · The gate saw three of the reader's six problems and shipped anyway.** `clearance_over_budget`,
      `reveal_times_not_stated` (the reader's problem #3, *"the true murder time needs one crisp
      sentence"*), `method_signature_absent`. That is REVIEW_15's finding with a fourth data point.
      Decide gate authority — [B1](PLAN-TO-90.md), open across five documents now.
- [ ] **3d · Motive planted too late** — reader problem #5. The torn note appears only in the
      aftermath. This is [X69](REVIEW_05.md), the motive's concrete noun, still unbuilt.
- [ ] **3e · The weapon proves the method, not the culprit** — reader problem #6. No existing
      machinery; new.

---

## 4. The distinctiveness engine — the only route to a 9

**This run scored zero 9s, and the reader said why: *"the mechanism is simpler."*** Everything in §2
and §3 gets to ~87–89. This is what gets past it.

- [ ] **4a · Regenerate the opening corpus where the archive lives.** `RECENT_OPENING_SITUATIONS`
      ships empty — `stories/` is gitignored, so it cannot be built from a fresh clone.
      `node scripts/build-opening-corpus.mjs --write` on the machine that has the manuscripts.
      **A2b refuses to run without it** (`openingCorpusReady`), by design.
- [ ] **4b · Wire the A2b ideation call into the pipeline.** The module is built
      (`agent9-prose/opening-ideation.ts`: five divergent candidate *situations*, one design-tier
      call ~$0.02, deterministic distinctness filter, `AGENT9_OPENING_IDEATION`). What remains is
      the plumbing: call it after Agent 3b, thread the winner through `ProseGenerationInputs`, render
      the block for chapter 1 only.
- [ ] **4c · A3, the character signature** — and it needs TWO edit sites, not one.
      `character_pressure_contract` (priority `critical`) forbids *"character paragraph that only
      restates occupation/role/persona without investigative consequence"*, which is what A3 asks
      for. Shipping A3 alone tests a contradiction (A_73 §14.1).
- [ ] **4d · CAUTION, new evidence.** This run diverged from 7 prior cases for the first time and
      produced a *less* distinctive device. The ledger holds 7 clock-family cases, so "diverge from
      these" shuffled it to another clock trick. **Divergence from a monoculture stays inside the
      monoculture.** A2b's corpus and Agent 3b's `divergeFrom` both need a way to push *out* of a
      family, not just off a member. n=1 — but it is the first evidence on the question.

---

## 5. Cost — now measured, not projected

```
this run                 £1.78  ($2.26, 49 calls)
  Agent9-ProseGenerator   $0.91   40%
  Agent9-PostPassPolish   $0.52   23%   <- Opus 5
  repeat calls            $0.47   21%   <- zero-repeat floor is £1.41/run
```

- [ ] **5a · The £1 target is gone at Opus polish.** £1.78 is 62% above the £1.10 the boards budget
      against. Decide: keep Opus polish, drop to Sonnet 5, or restrict polish to fewer chapters.
- [ ] **5b · `run-cost-audit.mjs` undercounts rework** (backlog §1b) — every repair pass has its own
      agent label, so the first call of each is booked as fresh work. The 21% is a floor.
- [ ] **5c · E1, the per-run cost governor** — unbuilt, and now the direct lever on a 21% tail.
- [ ] **5d · E2, one cost number** — needs a cache-policy and currency decision, not code.
      `CostTracker` is GBP; `run-cost-audit.mjs` defaults USD; four bodies of the 0.79 rate.

---

## 6. Sequence, and what each costs

```
NOW, free
  2a    set the four flags                                       free
  2c    rebuild, run, read                                   ~£1.78 + a reader
  2d    read both instruments off the same run                    free
  3a    fix entity_pronoun_drift_count                            free
  4a    regenerate the opening corpus (needs the archive)          free
---- the defect-removal ceiling is now known ----
  3b    clearance trim pass, or drop the violation                 free
  3c    the gate-authority decision (B1)                    free + a replay
  4b    wire A2b                                     free build, ~£1.78 to verify
  4c    A3, both edit sites                           free build, ~£1.78 to verify
---- only now can a 9 appear where there has never been one ----
  5c    cost governor                                              free
  D1*   PAIRED VARIANCE PROBE, 2 runs      ~£3 + 2 reads  <- budget-reduced; see A_74 §6.2.
        Two runs BOUND the spread; they cannot measure a floor or a variance. Decision rule is
        written in advance: sum-gap >=4 kills single-run attribution outright, 2-3 makes it
        marginal, <=1 makes it provisionally defensible.
```

---

## 7. What would falsify this

- **§2 is wrong if** prose does not move off 6 with the two clearance flags on. The reader quoted
  that injector as the single largest polish drag; if removing it changes nothing, the complaint was
  never the cause.
- **§4 is wrong if** A2b ships and `opening_hook` stays at 8 with a props inventory. That is
  A_72 §10.1's own falsification, and it reopens the generation-model question with real evidence.
- **§4d is wrong if** the next divergent run produces a device the reader calls distinctive. One run
  is not a finding.
- **The whole list is wrong about 90 if** the paired probe returns a sum-gap of 4 or more. Then
  run-to-run variance dominates every lever here, single-run attribution is dead, and the work is
  reliability-only until a design exists that can see past the noise. Note the asymmetry: a LARGE gap
  settles this, a small one does not — two samples can agree by luck.
