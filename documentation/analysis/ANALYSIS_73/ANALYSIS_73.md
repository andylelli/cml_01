# ANALYSIS_73 — the plan reviewed against the code, before any of it was built

**Written:** 2026-08-24 · **Trigger:** owner's request — *"please first think through all the changes needed. Review against the code, confirm what really will work."* — asked of [A_72 §10.6](../ANALYSIS_72/ANALYSIS_72.md)'s open items before spending on any of them.

**Type:** OBSERVATIONS ONLY, in two parts. No code was changed, no test suite was run, no pipeline run was executed. Every item is a static read of the tree at `daf2d70b`, recorded so the next increment starts from what the code does rather than from what the plan assumed.

- **[Part I](#1-c1s-second-call-site-is-already-closed) (§1–§10)** — A_72 §10.6's open items, each read against the code that would implement it.
- **[Part II](#part-ii--the-six-lens-sweep) (§11–§18)** — a six-lens code review of source semantics.
- **[Part III](#part-iii--the-second-six-lens-sweep) (§19–§26)** — a second six lenses, aimed at the toolchain, representations, tests and surfaces. **§25 corrects a claim in Part II.**
- **[Part IV](#part-iv--the-whole-tree-defect-sweep-and-the-build-record) (§27–§29)** — a whole-tree defect sweep, and the BUILD RECORD for everything fixed across all four parts.

**Method note, carried from [A_71](../ANALYSIS_71/ANALYSIS_71.md) and [A_72](../ANALYSIS_72/ANALYSIS_72.md):** each claim is **MEASURED** (a check was run over a file or a log and its output is quoted), **INFERRED** (follows from reading the code, not from observing it run), or **UNMEASURABLE HERE** (the artifact needed is not on this machine — see §8).

**The through-line.** A_72's plan was written from the reader's evidence, which was right, and from assumptions about what the code requires, which were not always. Three of its items are materially different once the code is read: **one is already built**, **one is a single prompt line rather than a contract renegotiation**, and **one rests on a precondition that was built in the register A_72 itself falsified.**

---

## 1. C1's second call site is already closed

**MEASURED.** [A_72 §13.1](../ANALYSIS_72/ANALYSIS_72.md) recorded four case facts still carrying leading articles (`"a decorative brass statue"`, `"the kitchen"`, `"the lounge"`, `"the dining room"`) and named it as the missed half of C1. It was committed with the document:

```
agent3-run.ts:745
  .map((f) => ({ ...f, value: stripLeadingArticleFromLockedValue(f.value) }));
```

in `extendLockedFactRegistryWithCaseFacts` ([agent3-run.ts:722](../../../apps/worker/src/jobs/agents/agent3-run.ts#L722)), with the "one capability, two call sites, one wired" note attached. **Nothing to do.** Recorded because it was still being carried as open work.

Also verified: the two patch scripts at the branch tip (`.p3.cjs`, `.sweep.cjs`) were **applied** before commit — `stripFences` in `packages/rubric-score/src/llm-judge.ts` carries the balanced-object scan, and `scripts/axis-sweep.mjs` carries `CANARY_INPUTS` / `producedAxis`. The tree is consistent with itself; those two files are spent scaffolding.

---

## 2. C4 is a prompt line, not a fair-play renegotiation

**This is the largest correction in this document.**

[A_72 §5.1](../ANALYSIS_72/ANALYSIS_72.md) framed the locked-fact tax as a designed tension: *"the contract exists to guarantee fair play — every character must state the critical value identically or the mystery becomes unsolvable"*, and [§10.3](../ANALYSIS_72/ANALYSIS_72.md) specified C4 as a canonical-form-plus-registered-alias scheme, priced as the Tier 1 item that *"touches the fair-play contract"*.

**MEASURED — the validator does not require what the contract asserts it requires.** [`prose-consistency-validator.ts:423`](../../../packages/story-validation/src/prose-consistency-validator.ts#L423):

```
// Missing-value: flag ONCE if the canonical value never appears in any chapter that references it.
if (relevantSceneNumbers.length > 0 && !valueAppearsSomewhere) { … 'locked_fact_missing_value' … }
```

The value must appear **once across the whole story**. There is a test pinning exactly this — `locked-fact-once.test.ts`, *"value required ONCE, not per incidental mention (RC2.1)"*. The only per-scene hard error is `locked_fact_contradicted`, which fires on a recognisably *different* value near the fact's keywords.

**MEASURED — what actually forces fifteen identical dialogue spans is one line of prompt**, in the continuity context injected into every chapter ([`context-management.ts:162`](../../../packages/prompts-llm/src/agent9-prose/context-management.ts#L162)):

```
✓ RULE: Every reference to the clock MUST use exactly this phrase. No variation permitted.
```

**INFERRED, and it is the actionable form of C4:** relaxing that rule to *verbatim at least once per chapter that turns on the fact, natural reference thereafter* requires **no validator change and no alias registry**. Fair play continues to be guaranteed by the two checks that already exist. The expensive half of C4 as specified — registering aliases and teaching a gate to accept them — is not the precondition; it is an optional refinement.

**One constraint the alias vocabulary must respect.** `detectConflictingValue` hard-fails on a different *numeric/time-shaped* value near the keywords. So `"the tide time"` or `"the hour the tide turned"` are safe; **`"eleven-ten"` is not** — it is precisely the shape that check exists to catch. Either keep aliases non-numeric, or teach `checkValueVariants` to accept registered ones. A_72 §10.3's own example list contains one of each.

---

## 3. A1 built a vocabulary, and A2b needs situations

**MEASURED.** [A_72 §10.1](../ANALYSIS_72/ANALYSIS_72.md) specified A1 as an extractor emitting *"the **opening situation** of every previous manuscript (who is present, what is discovered, in what posture) — not the sentence, the situation"*, and called it the precondition without which *"nothing in Workstream A can work"*.

What [`constants/opening-corpus.ts`](../../../packages/prompts-llm/src/constants/opening-corpus.ts) holds:

```
OPENING_CORPUS_MANUSCRIPTS   184
OPENING_OVERUSE_THRESHOLD    0.3333
OVERUSED_OPENING_WORDS       31 words — scent (75.5%), faint (71.7%), against (66.3%),
                             morning (64.1%), pressed (62.5%), damp (60.3%), …
recentOpenings               12 raw first sentences
```

That is a **word-frequency avoid-list plus twelve sample sentences**. It is a genuinely useful measurement — *scent* opening three of every four archived manuscripts is a strong finding — but it is vocabulary and sentence shape, which is the register [§4](../ANALYSIS_72/ANALYSIS_72.md) measured X94 and X95 falsifying, and which [§10.1](../ANALYSIS_72/ANALYSIS_72.md) explicitly warned against: *"It must commit a SITUATION, not a sentence shape."*

**INFERRED — what this means for A2b, stated so it is not discovered mid-build:**

- A2b is still buildable on what exists: the twelve raw openings can be handed to an ideation call as `divergeFrom` and the model asked to infer situations from them. Twelve samples out of 184 manuscripts is a thin corpus for a divergence instruction, but it is not nothing.
- **There is no runtime path that carries a committed opening into chapter 1.** A2a is a rotation *seed* threaded into `buildSceneGroundingChecklist` ([prompt-builder.ts:1996](../../../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L1996)); it commits no content. A2b therefore needs an ideation call, a new artifact, and a new prompt field — it is not a small increment on finished groundwork.
- **Placement is an open design question A_72 answers early.** §10.1 puts the step *"between Agent 1 and Agent 2"*, but a situation naming who is present and what is discovered needs the cast and the device to exist. The orchestrator's stage sequence (`setting` → `cast` → …, [mystery-orchestrator.ts:1168](../../../apps/worker/src/jobs/mystery-orchestrator.ts#L1168)) offers a clean seam either side; after Agent 3b is the one where the situation can be concrete.

---

## 4. The clue injector: the shape is load-bearing, and the upstream is two problems

[A_72 §14.3](../ANALYSIS_72/ANALYSIS_72.md) concluded *"the injector is a floor, and the repair belongs upstream of it, at whatever is producing 18 missing-clue retries in a single run."* That is right, and it under-specifies the upstream in a way that matters.

### 4.1 Why the injector cannot be fixed cosmetically

**MEASURED.** The operand is a de-spoiled key-term bag **by construction** — `composeProseTermPhrase` ([clue-validation.ts:556](../../../packages/prompts-llm/src/agent9-prose/clue-validation.ts#L556)) takes up to six deduped tokens and space-joins them. *"Temporal conflict hale alibi"* is that function working as designed, not malfunctioning.

The surrounding template in [`deterministic-repair.ts`](../../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts) carries four incident scars, each recorded in its own comment:

| constraint | why it is there |
|---|---|
| operands are ≤6-token bags, never spec sentences | no 12-word verbatim run may survive the leakage gate |
| the name-bearing lead and the term-bearing sentences are **structurally separate sentences** | ABORT CLASS #6 — one sentence holding a cast name *and* clue terms made the lifecycle validator read the detective as deceased in ch3, and the run aborted |
| specific adjacencies neutralised (`direct evidence links` → `evidence links directly`, a leading `Eliminates` → `clears`) | control-plane-leakage detector |
| proper-name tokens from non-cast characters stripped | perpetual false-fail retries |

**INFERRED:** turning the operand into a noun phrase reopens all four. Any work here must reduce how often the injector *fires*, not what it writes.

### 4.2 The 18 calls are two different failures

**MEASURED**, `scratchpad/a72-run-20260823.log`. Retry classes on that run:

```
18  missing_clue         9  culprit_unlinked      8  scaffold_not_prose
 6  missing_resolution   3  aftermath_consequence
```

And the three resolved-to-floor events carry **two distinct signatures**:

```
ch4 clue_5   ×2 calls   "regen did not improve the targeted property (score 200, was 200;
                          still failing: missing_clue:clue_5)"
ch7 clue_14  ×2 calls   same signature
ch6 clue_14  ×4 calls   "regen introduced: modified_or_dropped_original_paragraph:1"
```

**The second signature is not a clue failure at all.** [`preserveOriginalParagraphsValidator`](../../../packages/prompts-llm/src/agent9-prose/regen-integration.ts#L243) is exact set-membership over whitespace-normalised paragraphs: **any word changed in any pre-existing paragraph rolls back the entire regen**, including a clue insertion that succeeded. Four paid calls on ch6 died to that guard rather than to the thing they were sent to fix.

The guard exists for a real reason (the `repair.ts:153` lesson — a whole-chapter regen that re-genders a character or alters a locked-fact value in untouched text). **Recorded, not judged:** whether the rejections are protecting the book or discarding good repairs is exactly what is not currently observable, because the rejected candidate is never inspected.

### 4.3 The observation that would separate them, and it is free

**INFERRED.** On each rejected candidate, log (a) which original paragraph went missing, and (b) whether the target clue became present in the candidate anyway. Two facts, no LLM call, no behaviour change. That splits *"the writer cannot plant this clue"* from *"the guard is discarding successful plants"* — and those two have opposite fixes.

The first signature — `score 200, was 200`, meaning two of three checks pass and the clue check still fails after two attempts — cannot be diagnosed from the log alone. See §8.

---

## 5. E1's seam exists; E2 is a decision, not a fix

**E1 — MEASURED, the seam is real.** `generateProse(client: AzureOpenAIClient, …)` ([generate.ts:2036](../../../packages/prompts-llm/src/agent9-prose/generate.ts#L2036)), and sibling agents in the same package already call `client.getCostTracker()` (agent1-setting, agent2b, agent2c). A per-run spend check inside the prose retry loop needs no new plumbing and no interface change.

**E2 — MEASURED, and it is worse than a disagreement between two sums.** The two numbers use **different pricing models**:

| source | prompt tokens | cached tokens | price table |
|---|---|---|---|
| `CostTracker.calculateCost` | full input rate | **recorded, not discounted** (deliberate) | in-package |
| `scripts/run-cost-audit.mjs` | list rate | **0.5×** | its own `PRICES` const |

The cost-tracker's own header records why it refuses to discount: applying one needs Azure's cached-input rate, and *"this file has now been wrong about rates twice"*. Meanwhile the audit script's `0.5` is an undocumented constant — not a measured Azure rate, and not Anthropic's (~0.1× read) either.

**INFERRED:** "one cost number" therefore requires choosing a cache-discount policy and a single price table before any plumbing is worth writing. The measured cache shares are already on file in the tracker's comment — 30–31% of prompt tokens overall, 88–97% on a retry of the same chapter — which is enough to make the choice with, and is also the reason the choice is not cosmetic: at 88–97% cache-served, retries cost dramatically less than the tracker's upper bound implies, and the repeat-call share that [A_72 §7](../ANALYSIS_72/ANALYSIS_72.md) put at 17% of the bill may be materially overstated.

---

## 6. C3's gate is real work, and flipping it alone may trade one defect for another

**MEASURED.** The gate is built and flag-gated (`AGENT9_CROSS_CHAPTER_ECHO`, [generate.ts:3312](../../../packages/prompts-llm/src/agent9-prose/generate.ts#L3312)); the counter runs unconditionally. On the A_72 run it fired **eight times, at counts of 1 to 4 sentences**:

```
4 ×  "cross-chapter sentence echo: 1"      1 ×  "…: 2"
1 ×  "…: 3"                                2 ×  "…: 4"
```

So the echo is real and recurring, and the gate would have work to do.

**INFERRED, and it is why this is recorded rather than recommended:** a linter issue drives a batch retry; retries are what fire the deterministic injector (§4) and what [A_72 §13.5](../ANALYSIS_72/ANALYSIS_72.md) attributed the £1.24 to. Enabling C3 before a governor exists plausibly buys a dialogue improvement with a prose regression and a cost rise. **The ordering constraint is E1 first.** This is the same interaction shape as §4: the retry loop is now a shared resource that several levers draw on without knowing about each other.

---

## 7. A3's edit site, confirmed

**MEASURED.** [A_72 §12.2](../ANALYSIS_72/ANALYSIS_72.md) proposed a sixth requirement in `buildFirstAppearanceContractsBlock`. The five live at [prompt-builder.ts:560](../../../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L560) as a plain string array, and the per-character seed lines at 639–643. A sixth entry is one array insert plus one seed line.

**INFERRED — with one honest caveat.** Every per-character seed the block emits is drawn from a case-function field (`public_persona`, `role`, `access_plausibility`, pressure cue). There is no field carrying a non-case trait, so requirement 6 would ship as an **unseeded instruction** — *invent one* — rather than as data. A_72 already frames whether that suffices as a one-run question; this only records that no data path exists to make it anything else without new upstream work.

---

## 8. What cannot be checked on this machine

**`stories/` is gitignored** (`.gitignore:50`, `:67`), with a single force-added exception (`story_20260814-2033`). The manuscripts, their `chatgpt-review.txt` files, and `logs/llm.jsonl` (`.gitignore:14`, `:68`) live only on the machine that produced them.

What this blocks, precisely:

- **§4.2's first signature.** Distinguishing *"the model did not plant clue_5"* from *"the matcher cannot see it"* requires the ch4 text beside `clue_5`'s observable and `pointsTo`. The matcher's rule is 55% of up to 10 spec tokens with a two-family semantic fallback ([clue-validation.ts:835](../../../packages/prompts-llm/src/agent9-prose/clue-validation.ts#L835)); whether it false-negatives on natural prose is the single most valuable unanswered question in this document, and it is an afternoon's work **on the other laptop**.
- **Any cost re-derivation**, since `run-cost-audit.mjs` reads `logs/llm.jsonl`.

What survived the gitignore and is therefore checkable anywhere: `eval/results/external-read/manifest.json` — 37 reads, 36 with full ten-category tables and the reader's per-category reason. The reads became data (A_72's achievement) in a file that syncs; the manuscripts did not.

---

## 9. Status of A_72 §10.6's free block, as read

| item | A_72 status | this review |
|---|---|---|
| A1 corpus | BUILT | built as **vocabulary**; A2b's stated precondition is not met (§3) |
| C1, C2, C3 | BUILT | confirmed; C1's second call site also closed (§1) |
| C3 gate promotion | separate decision | ordering constraint found — after E1 (§6) |
| E1 governor | not built | seam confirmed, no new plumbing (§5) |
| E2 one cost number | not built | needs a cache-policy decision first (§5) |
| B3 ten contracts | 2 of 10 read | unchanged |
| B1 geometry replay | not built | not examined this pass |
| C4 aliases | not built | **cheaper than specified — one prompt line** (§2) |
| A2b, A3 | not built | A3's edit site confirmed (§7); A2b larger than framed (§3) |

---

## 10. The through-line

A_71 concluded that a detector's read path must be verified against real data rather than against the declared contract. **A_73 is the same screw, turned on the plan rather than on the instruments:**

> **A plan's cost estimate must be verified against the code that will implement it, not against the document that specified it.**

Three items moved on inspection and none moved for the same reason. C4 was priced as a contract renegotiation and is a prompt line, because the gate was assumed to demand what the prompt demands. A2b was priced as an increment on a finished precondition, because the precondition's *name* matched what was built while its *content* did not. E2 was priced as plumbing, because two numbers disagreeing was assumed to mean two sums rather than two pricing models.

**The cheapest guard against the whole class is the one this pass used: before building an item, open the code it lands in and read what is already true there.**

---
---

# PART II — the six-lens sweep

**Written:** 2026-08-24, same day, after the owner asked for *"6 different ways to review code — 6 different aspects that may throw up different bugs / inconsistencies and weaknesses"*, then for each to be run.

**Still observations only.** No code changed, no suite run, no pipeline run. Six lenses, chosen to be non-overlapping — each catches a class the others structurally cannot see:

| # | lens | bug class | §|
|---|---|---|---|
| 1 | two-body sweep | one concept, N implementations that drift | §11 |
| 2 | read-path validation | readers guarding on shapes the data never has | §12 |
| 3 | inert-code audit | capability that exists but never executes | §13 |
| 4 | prompt-as-code | ceilings and contradictions written into prompts | §14 |
| 5 | degradation-path | what ships when a step fails | §15 |
| 6 | second-order interaction | correct alone, harmful together | §16 |

**The pass found something in every lens.** The two with the sharpest consequences are §12 (the novelty ledger may be read from a path nothing writes) and §11.1 (seven bodies of the clearance vocabulary, and the narrowest one drives an injector the reader complains about).

---

## 11. Lens 1 — the two-body sweep

### 11.1 The clearance vocabulary has SEVEN bodies, in five packages, and they are not the same regex

**MEASURED.**

| # | site | shape |
|---|---|---|
| 1 | [`deterministic-repair.ts:66`](../../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L66) `CLEARANCE_TERMS_RE` | base 8 terms |
| 2 | [`lint.ts:512`](../../../packages/prompts-llm/src/agent9-prose/lint.ts#L512) (anonymous) | identical to 1 |
| 3 | [`regen-integration.ts:217`](../../../packages/prompts-llm/src/agent9-prose/regen-integration.ts#L217) `CLEARANCE_TERMS` | + `killer` |
| 4 | [`story-geometry/accept.ts:263`](../../../packages/story-geometry/src/accept.ts#L263) | + `in the clear`, `murderer`, `held`, `is confirmed`, `checks out`, `freed from suspicion`, `above suspicion` |
| 5 | [`character-lifecycle-validator.ts:36`](../../../packages/story-validation/src/character-lifecycle-validator.ts#L36) `CLEARED_RE` | − `not the culprit`, + `held` |
| 6 | [`suspect-closure-validator.ts:11`](../../../packages/story-validation/src/suspect-closure-validator.ts#L11) `ELIMINATION_TERMS` | + `cannot have`, `no opportunity`, `no access`, `impossible for`, `accounted for`, `vouched for`, `beyond suspicion` |
| 7 | [`agent9-run.ts:2332`](../../../apps/worker/src/jobs/agents/agent9-run.ts#L2332) `ELIMINATION_TERMS` | base 8 — a third copy of 1 |

**The widest matcher judges the finished book; the narrowest decides whether prose needs repairing.** Body 6 accepts *"beyond suspicion"* and *"accounted for"*; body 4 accepts *"in the clear"* and *"above suspicion"*; bodies 1, 2 and 7 accept none of those.

**INFERRED, and it is a candidate mechanism for a complaint already on the board.** A chapter that clears a suspect in natural English — *"Hale was in the clear"*, *"her account was vouched for"* — satisfies the story validator and story-geometry, and **fails the Agent-9 presence check**. That is a `suspect_clearance_missing` lint issue on prose that is not defective, which spends a retry and then falls to `applyDeterministicClearancePatch`, whose output is the *"was thoroughly cleared by the evidence; the alibi confirmed"* register that [A_71 §3](../ANALYSIS_71/ANALYSIS_71.md) traced and that two external reads named as the top prose drag.

**This is checkable for free and has not been checked:** count, across the archived manuscripts, how many clearance sentences match body 4 or 6 but not body 1. If that number is non-zero, the injector has been firing on prose that was already correct, and the fix is one shared vocabulary rather than anything in the injector.

### 11.2 Mojibake — the detector was unified, the two repair tables were not

**MEASURED.** X79 unified the *detector*: `MOJIBAKE_PATTERN` is exported from `story-validation` and imported by [`prose-text.ts:16`](../../../apps/worker/src/jobs/agents/agent9/prose-text.ts#L16), with the comment *"See MOJIBAKE_PATTERN for what the divergence cost."* That half held.

**Two independent repair tables remain, and they disagree with each other and with the detector:**

| | [`server.ts:431`](../../../apps/api/src/server.ts#L431) `MOJIBAKE_REPLACEMENTS` | [`save-readable-story.ts:21`](../../../apps/worker/src/jobs/save-readable-story.ts#L21) `MOJIBAKE` |
|---|---|---|
| rules | 9 | 8 |
| `faˆ§ade` → `façade` | **yes** | **no** |
| `â€¦` maps to | `…` (ellipsis char) | `...` (three periods) |
| double-encoded `Ã¢â‚¬â„¢` family | **no** | **no** |

Two consequences, both INFERRED from the tables:

1. **The saved manuscript and the API-rendered manuscript are not the same text.** A `façade` artifact is repaired in one and not the other; every ellipsis differs. The reader reads one of them; the gate judged the other.
2. **The double-encoded family is detect-only.** `MOJIBAKE_PATTERN` matches `Ã¢â‚¬â„¢` and friends, and `hardStopReasons.push("mojibake/encoding artifact remains")` ([agent9-run.ts:7271](../../../apps/worker/src/jobs/agents/agent9-run.ts#L7271)) **aborts the run** on it — while neither repair table can remove it. That is an unrepairable hard stop: the only exit is a regeneration that happens not to reproduce it.

### 11.3 The rest of the sweep

- **`DEATH_RE` is duplicated verbatim** — [`character-lifecycle-validator.ts:33`](../../../packages/story-validation/src/character-lifecycle-validator.ts#L33) and `LIFECYCLE_DEATH_RE` at [`agent9-run.ts:1261`](../../../apps/worker/src/jobs/agents/agent9-run.ts#L1261). Byte-identical today, so this is latent rather than live — but it is the second copy of a heuristic that has already caused a run-killing abort (ABORT CLASS #6).
- **Four price tables.** `CostTracker` (in-package), `run-cost-audit.mjs`, `judge-pairwise.mjs`, `probe-run-token-economics.mjs`. They differ in coverage *and in fallback*: run-cost-audit defaults an unknown model to `gpt-4.1`, judge-pairwise to `gpt-4.1-mini` — a 5× difference in input rate, applied silently.
- **The counter-example worth copying:** `shared/death-method-patterns.ts` is one vocabulary, imported by both `agent3-cml.ts` and `prompt-builder.ts`, each carrying the comment *"ONE vocabulary … This file used to keep its own copy."* That is what §11.1 should become.

---

## 12. Lens 2 — read-path validation

### 12.1 The novelty ledger is read from `cwd`, and the committed launcher makes that a directory nothing writes

**This is the sharpest finding in the pass, because of which agent depends on it.**

**MEASURED.**

```
noveltyLedgerPath()  =  process.env.CML_NOVELTY_LEDGER_PATH
                        ?? path.resolve(process.cwd(), "data", "novelty-ledger.json")
                                                    novelty-ledger.ts:101
loadNoveltyLedger()  =  try { … } catch { return [] }          novelty-ledger.ts:143
```

Both `loadNoveltyLedger` and `appendNoveltyLedger` are called **only by the worker** (`mystery-orchestrator.ts:1049`, `:1705`). The committed launcher starts it as `npm run -w @cml/worker dev` ([start-dev.bat:27](../../../start-dev.bat)), and an npm workspace script runs with **cwd = `apps/worker`**.

On this checkout:

```
apps/worker/data/                     does not exist  (and is NOT gitignored)
data/novelty-ledger.json              does not exist  (root data/ holds only opening-corpus.json)
apps/api/data/novelty-ledger.json     EXISTS, tracked, 7 shipped records
```

**INFERRED:** under the committed launcher the worker resolves a path that does not exist, `loadNoveltyLedger`'s bare `catch { return [] }` swallows the ENOENT, and `priorRunAvoidancePatterns([])` returns nothing — so Agent 3's *"diverge from prior runs"* input is **empty, silently**. The only populated ledger sits under `apps/api`, which is where a process with cwd=`apps/api` would have written it.

**Why it matters more than its size suggests.** [A_72 §2.1](../ANALYSIS_72/ANALYSIS_72.md) established that the novelty apparatus is the pipeline's *only* engine for the quality the reader pays 9s for, and that `premise` holds 7 of the 14 nines ever awarded. If the recency half of its divergence input is empty, the engine has been running on seed divergence alone. That is exactly the A_71 class — *a reader guarding on a path the data never travelled* — sitting on the one mechanism that demonstrably earns marks.

**What this pass canNOT establish:** whether the other laptop has a populated `apps/worker/data/novelty-ledger.json`. It is untracked, so it would not have synced either way. **The check is one `ls` on that machine**, and the fix if confirmed is one line — set `CML_NOVELTY_LEDGER_PATH`, or resolve from a workspace root rather than `cwd`.

Note also the ledger holds **7** records against an archive of 184 manuscripts, so even when found it is a short memory.

### 12.2 What could not be read

The high-value read-path checks — does the 55%-token clue matcher false-negative on natural prose; does the rubric read what it claims — need manuscripts and `logs/llm.jsonl`. Both are gitignored (§8). This lens is ~30% run.

---

## 13. Lens 3 — the inert-code audit

### 13.1 There are two idioms for reading a flag, and an audit that greps one misses ten

**MEASURED.** `process.env.X` appears for 134 distinct variables. A second idiom — an **injected `env` parameter**, `env.X ?? ''`, used so the flag is readable at call time rather than module load — carries 10 more that the first grep never sees:

```
AGENT5_RED_HERRING_FLOOR      AGENT75_GEOMETRY            AGENT75_GEOMETRY_RESOLVE
AGENT7_STRUCTURED_OUTPUT      AGENT9_GEOMETRY_ACCEPTANCE  AGENT9_PROMPT_BUDGET_CRAFT_FLOOR
AGENT9_REGEN_AFTERMATH_REPEAT AGENT9_REGEN_REVEAL_MODIFY  AGENT9_RUBRIC_IN_PROMPT
ALLOW_MULTIPLE_RETRY_GATES
```

That list contains **M6** (`AGENT9_RUBRIC_IN_PROMPT` — the only lever ever aimed at the flat three), **X47's craft floor**, **A_71's red-herring floor**, and the geometry acceptance switch. The injected-`env` idiom is the *correct* one (it is the documented fix for the dotenv-freeze trap); the finding is that the codebase now has two, and any inventory built with one regex is silently short. **My own default-OFF count below is therefore a lower bound, and is quoted as such.**

### 13.2 The flag surface, and where the audit stops

**MEASURED.** ≥38 flags are default-OFF (`?? ''` + truthy test). [`FLAG-AUDIT.md`](../../../architecture/FLAG-AUDIT.md) covers the `AGENT9_*` family well — every one of the **45** `AGENT9_*` flags now in source is named somewhere in it, though its header still states a scope of **33**, so the scope line is stale by twelve.

**The gap is everything else: 22 default-OFF flags across Agents 1, 2, 2b, 2c, 2e, 3b, 4, 5, 6 and 7 have had no equivalent audit** — including `AGENT6_BLIND_READER_BLOCKING`, `AGENT7_MECHANISM_GATE`, `AGENT7_PLANT_BEFORE_REVEAL`, `AGENT7_SCHEDULER_AUTHORITATIVE`, `AGENT5_STRICT_PROMPT_CONTRACTS` and `AGENT2_CONSTRAINED_CAST`. The audit's own method — *unset is not the same as off* — has never been pointed at them.

### 13.3 X47's craft floor is built and dormant

**MEASURED.** `isPromptBudgetCraftFloorEnabled` reads `AGENT9_PROMPT_BUDGET_CRAFT_FLOOR ?? ''` — **default OFF** ([prompt-builder.ts:1330](../../../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L1330)).

The comment above it records the measurement that motivated it: on `mystery-1786999938275`, chapters 8–10 shipped 5,499 / 5,737 / 4,723 tokens of context into 2,585 / 2,191 / 378 of headroom, and the drop loop deleted `craft_guide`, `judged_on`, `character_personality`, `texture_pool` and `world_document` **without ever reaching the budget** — *"All those drops bought was the deletion of the standard the chapter is written to."* Agent 2c's sensory atoms reached two chapters of ten; Agent 6.5's voice contracts reached five.

So the diagnosis is unconditional and the remedy is flag-gated off. **Every reader complaint about thin atmosphere, interchangeable speakers and a sagging back half was made about chapters written with those blocks deleted** — and still is.

### 13.4 A caveat that limits this lens here

`.env.local` on this machine is **byte-identical in key names to `.env.local.example`** — 21 infrastructure keys, no `AGENT*`, no `NOVELTY_*`, no `RUBRIC_JUDGE_MODEL`, no `ANTHROPIC_API_KEY`. It is gitignored, so this is a stub, not the project's configuration.

Two things follow. First, **no claim about what is set can be verified from this machine** — including [PLAN-TO-90 §0b.1](../../../architecture/PLAN-TO-90.md)'s *"`AGENT9_POLISH_PROVIDER=anthropic` is set, the key is configured"*, and [A_72 §2.1](../ANALYSIS_72/ANALYSIS_72.md)'s `NOVELTY_SIMILARITY_THRESHOLD=1.0`. Second, and independent of this laptop: **the committed example config documents none of the behaviour flags**, so the configuration that produced the archived corpus is not reconstructable from the repository by anyone — including a future reinstall of either laptop.

---

## 14. Lens 4 — prompt-as-code

### 14.1 A second character ceiling, and this one is a prohibition

[A_72 §12](../ANALYSIS_72/ANALYSIS_72.md) read `first_appearance_contracts` and found the `character_clarity` ceiling written into it. This pass read the next block down — `character_pressure_contract`, 520 tokens, `priority: critical`, [prompt-builder.ts:802](../../../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L802).

**MEASURED.** It is a better block than §12's — it asks for *fear*, *lie/deception*, *loyalty conflict*. But every permitted revelation must then **do** one of six things, and five of the six are case-functional:

```
- make someone more suspicious      - reveal motive
- make someone less suspicious      - change the investigator's understanding of the case
- explain why someone lied          - deepen the emotional cost of the crime   <- the only non-case one
```

and it closes with a hard constraint:

> *"No character paragraph that only restates occupation/role/persona **without investigative consequence**."*

**INFERRED, and it is an actionable collision.** A_72 §12.2 proposes A3 as a sixth first-appearance requirement: *"One thing about this person that the investigation does not explain — a want, a habit, or a contradiction that would still be true if there had been no murder."* **That is the thing this block forbids.** Ship A3 unamended and the model receives, both at `priority: critical`, an instruction to write a character detail with no investigative consequence and an instruction that character content without investigative consequence is a contract violation.

A_72 §3 concluded the character ladder tops out at *"correct"* because nothing asks for more. **It is stronger than that: one critical-priority block asks for case function, and another critical-priority block prohibits the alternative.** A3 is still the right experiment — it just has a second edit site, and shipping it without that site is a test of contradiction rather than a test of the idea.

### 14.2 The budget squeeze, confirmed as still live

Covered in §13.3 — it belongs to this lens too, because it is a property of the prompt as an artifact: the craft ratio is not shed by a decision, it is shed by array order inside `applyPromptBudgeting`, and the blocks that come first in that order are the flat six's own inputs.

---

## 15. Lens 5 — degradation paths

### 15.1 Eight deterministic writers reach shipped prose; one is counted

**MEASURED.** Functions that can insert or rewrite committed prose without an LLM call:

```
applyDeterministicCluePatch            applyDeterministicDiscriminatingTestPatch
applyDeterministicClearancePatch       enforceLockedFactValuePresence
enforceSuspectEliminationPresence      enforceCulpritEvidencePresence
applyDeterministicPronounSweep         applyDeterministicProsePostProcessing
```

Of these, exactly **one** emits a per-run count: `deterministic_clearance_paste_count` ([agent9-run.ts:5297](../../../apps/worker/src/jobs/agents/agent9-run.ts#L5297)), added by [A_71 §3](../ANALYSIS_71/ANALYSIS_71.md).

**The clue injector has no counter** — and it is the source of the defect the most recent reader named as *"the main reason the polish score stays below 8"* ([A_72 §14.2](../ANALYSIS_72/ANALYSIS_72.md)). Its firing rate is currently visible only by grepping raw run logs for `deterministic floor will apply`, which is how this session measured it at all. **The counter A_71 built for the clearance injector is the exact instrument the clue injector needs, one document later.**

### 15.2 The gate's authority is still inverted, and §11.2 sharpens it

**MEASURED**, and [REVIEW_15](../../../architecture/REVIEW_15.md)'s finding is intact in the current tree:

```
agent9-run.ts:7259   releaseGateReasons.push(...geometryReleaseWarnings);   // never hardStopReasons
agent9-run.ts:7271   hardStopReasons.push("mojibake/encoding artifact remains");
```

Every geometry violation is warning-only; an encoding artifact aborts the run. Combined with §11.2: **the one condition allowed to kill a run is the one with no working repair path.**

---

## 16. Lens 6 — second-order interaction

### 16.1 The retry budget is an unowned shared resource

**INFERRED**, from the mechanisms measured above. Every gate that can fail a batch — the linters (`template_bleed`, `intra_chapter_sentence_duplicate`, `suspect_clearance_missing`, `cross_chapter_sentence_echo`, `banned_phrase`, `ngram_overlap`, …), the clue obligations, the scaffold checks, geometry acceptance — draws from the same per-chapter attempt budget. When it is exhausted, a deterministic floor writes text (§15.1). So:

> **adding a gate does not only add a check — it adds a claim on the budget whose exhaustion is what puts injected prose on the page.**

This is why C3's echo gate is not a free flag flip (§6), and it generalises: `AGENT9_CROSS_CHAPTER_ECHO`, `AGENT9_GEOMETRY_ACCEPTANCE` and `AGENT5_RED_HERRING_FLOOR` are three dormant gates that would each spend from the same pool, and no mechanism accounts for the total. The A_72 run's own numbers are the shape of it: 18 `missing_clue` + 9 `culprit_unlinked` + 8 `scaffold_not_prose` + 6 `missing_resolution` + 3 `aftermath_consequence` = 44 regen calls, £1.24, and one new prose defect class.

### 16.2 Two interactions worth naming before either lever moves

- **Budget squeeze × retries.** A retried chapter is re-prompted with the same context that overflowed the first time (§13.3). Late chapters therefore retry with craft blocks already deleted — so the retry is not a second attempt at the same task, it is an attempt at a *thinner* one. Nothing records that difference.
- **Narrow matcher × injector (§11.1).** If the clearance-vocabulary divergence is real on the archive, then a gate is spending retries on correct prose and then pasting incorrect prose over it. That is a single defect with the same signature as the clue injector, and the same fix shape: widen the read, do not improve the write.

---

## 17. What this pass could not check

- **Anything needing manuscripts or `logs/llm.jsonl`** — the archive check that would confirm §11.1, the clue-matcher false-negative question (§4.2, §12.2), and every cost re-derivation. All gitignored.
- **Anything needing the real `.env.local`** (§13.4) — including whether the dormant flags in §13.1–13.2 are dormant in practice or merely undocumented.
- **B1's geometry replay** — not attempted; it needs the archive.
- **Lens 2 is ~30% run**, lens 5 ~60%; lenses 1, 3, 4 and 6 are static and are complete.

**One `ls` on the other laptop settles §12**, which is the highest-consequence item in this document. That check is: does `apps/worker/data/novelty-ledger.json` exist, and how many records does it hold?

---

## 18. The through-line of the sweep

Part I found that a plan's costs must be verified against the code. Part II found that **the same is true of the code's own claims about itself** — and that the repo's recurring defect has a shape simpler than any of its instances:

> **Every finding in §11–§16 is a boundary where one concept exists twice: two clearance vocabularies, two mojibake tables, two flag idioms, two character contracts, two cost meters, two directories called `data`.**

None of them is a logic error. Each is a place where two things that must agree were written separately and then drifted, or never agreed at all. That is why they survive tests — each body is correct — and why they surface as content defects, cost surprises and stuck rubric categories rather than as exceptions.

**The durable check is not a patch at either body. It is a sweep that asks, for each concept: how many implementations does this have?**

---
---

# PART III — the second six-lens sweep

**Written:** 2026-08-24, same day, at the owner's request for *"another 6 lenses"*. Still observations only; nothing built, nothing run.

Six lenses chosen to be disjoint from §11–§16 — those looked at source semantics, this set looks at **the toolchain, the representations, the tests, and the surfaces**:

| # | lens | bug class | § |
|---|---|---|---|
| 7 | build-artifact skew | source edits that never reach execution | §19 |
| 8 | boundary & representation | units, currency, encoding at the seams | §20 |
| 9 | unreachable logic | conditions that cannot fire | §21 |
| 10 | test validity | tests that cannot detect the bug they cover | §22 |
| 11 | resume & durability | staleness, atomicity, replay | §23 |
| 12 | UI truth | what a human is shown vs what the record says | §24 |

**One of these invalidates a claim in Part II** — see §25.

---

## 19. Lens 7 — build-artifact skew

### 19.1 Nothing runs from source. Everything runs from `dist`.

**MEASURED.**

```
packages/prompts-llm/package.json    "main": "./dist/index.js"
apps/worker/package.json             "dev":  "node dist/index.js"
```

There is no `tsx`, no `ts-node`, no watch mode anywhere in the worker's scripts. **`dev` and production are the same path: compiled output.** A source edit changes nothing until the owning package is rebuilt — which is the documented convention (`worker-consumes-cml-packages-via-dist`, quoted in [A_71 §8](../ANALYSIS_71/ANALYSIS_71.md)) — but it means "I fixed it" and "the fix executes" are two separate events with nothing enforcing the second.

**On this checkout, `dist` predates the entire A_72 cycle:**

| symbol (source) | in `src` | in `dist` |
|---|---|---|
| `cross_chapter_sentence_echo` (C3) | 3 files | **0** |
| `OVERUSED_OPENING_WORDS` (A1) | 2 files | **0** |
| `suspect-clearance-gate` (X93) | 2 files | **0** |
| `inString` (the 08-24 `stripFences` fix) | 1 file | **0** |

`dist` is untracked (0 files under `packages/*/dist` in git), so this is a local build state, not a repo defect. It is recorded because it is the *default* state of any fresh clone, and nothing warns.

### 19.2 There are two definitions of "the build", and they disagree about ten packages

**MEASURED.** The workspace has **14 packages**. `scripts/build-all.mjs` builds all 14 plus api, web and worker — complete.

The committed launcher [`start-app.bat`](../../../start-app.bat) builds **six targets**: `cml`, `story-validation`, `llm-client`, `prompts-llm`, `worker`, `api`. It omits:

```
beat-scheduler   clue-spec      cml-core     device-library   novelty
period-kb        prose-guard    rubric-score story-geometry   style-contract
```

**INFERRED, and two of those omissions are pointed:**

- **`rubric-score`** holds the judge — and the most recent commit on this branch (2026-08-24) fixed `stripFences` there, the bug that cost a paid `claude-opus-5` call and silently shrank the 0b.0 experiment's sample from 8 to 7. A developer who edits the judge and starts the app with the committed launcher runs the old judge.
- **`story-geometry`** holds the acceptance layer that `AGENT9_GEOMETRY_ACCEPTANCE` gates and that [B1](../ANALYSIS_72/ANALYSIS_72.md)'s replay would exercise.

This is §18's disease in the build system: two bodies of one concept — *what constitutes building this project* — written separately, drifted, and neither is wrong at its own call site.

---

## 20. Lens 8 — boundary & representation

### 20.1 The cost tracker stores GBP; the scripts print USD; the field says neither

**MEASURED.** [`cost-tracker.ts`](../../../packages/llm-client/src/cost-tracker.ts) stores **GBP**, with the conversion **pre-multiplied into every per-model constant**:

```
// GPT-4.1 pricing ($2.00/$8.00 per million tokens, converted to GBP at 0.79).
// GPT-4.1-mini pricing ($0.40/$1.60 per million tokens, converted to GBP at 0.79)
// Anthropic list pricing, converted to GBP at the same 0.79 rate used above.
```

The FX rate has **four bodies**: baked into those constants; `GBP_PER_USD = 0.79` in `cost-model-swap.mjs`; an inline `* 0.79` in `judge-pairwise.mjs`; and `--gbp` defaulting to `0.79` in `run-cost-audit.mjs` — where the header already warns *"check the rate, it is not fetched"*.

**INFERRED — this is the mechanism behind the file's own confession.** `cost-tracker.ts` records that it "has now been wrong about rates twice". Because the FX rate is pre-multiplied rather than applied, changing it means hand-editing eight model constants, and a missed one is a per-model error that nothing can detect — there is no unconverted list price left in the file to check against.

And the carrier has no units: `total_cost: number` in both [`scoring/types.ts:161`](../../../packages/story-validation/src/scoring/types.ts#L161) and `apps/web/src/components/types.ts:290`. `run-cost-audit.mjs` calls it *"unlabelled units"* and it is right.

**This extends [§5](#5-e1s-seam-exists-e2-is-a-decision-not-a-fix)'s E2 finding.** The two cost numbers do not merely use different cache policies — **they are in different currencies**, and the disagreement A_71/A_72 measured at "+47%" is within a factor of the FX rate itself (1/0.79 = 1.27). Any reconciliation that does not fix units first will fit a discount policy to a currency error.

---

## 21. Lens 9 — unreachable logic (a negative result, recorded as one)

**MEASURED, and it found nothing.** Searched for vacuous guards across all package and app sources: `.length >= 0`, `|| true`, `&& false`, `if (true)`, `?? true)`. Two hits, both legitimate threshold branches in `agent9-prose-scorer.ts` (`>= 0.7` / `>= 0.4`). Checked `generation-params.ts` for a default sitting outside its own `clampNumber` bounds: none.

**Recorded because a negative result is information.** This codebase's defects are not dead branches or impossible conditions — the logic is sound where it is local. Its defects are at **boundaries**: between two copies, two packages, two currencies, two build definitions, two directories. That is consistent with §18 and it means this lens is low-value here and need not be repeated.

The one genuine instance of the class is already known and is configuration rather than code: `NOVELTY_SIMILARITY_THRESHOLD=1.0` requires 100% similarity to fail, so Agent 8's audit cannot fire ([A_72 §2.1](../ANALYSIS_72/ANALYSIS_72.md)).

---

## 22. Lens 10 — test validity

### 22.1 The suite's best technique is applied to the five smallest vocabularies and none of the large ones

**MEASURED.** Parity/invariant tests already exist, and they are exactly the right idea:

```
mojibake-one-vocabulary.test.ts        opening-grounding-vocabulary.test.ts
primary-axis-vocabulary.test.ts        retry-routing-vocabulary.test.ts
degrade-abort-parity-r12.test.ts
```

**No equivalent test exists for the four multi-body concepts this review found:** the seven-body clearance vocabulary (§11.1), the two-body `DEATH_RE` (§11.3), the four price tables (§11.3), or the four-body FX rate (§20.1). The technique is proven in-repo and has never been pointed at the largest instances.

### 22.2 The ledger test injects the parameter the bug is in

**MEASURED.** `apps/worker/src/__tests__/novelty-ledger.test.ts` passes an explicit `ledgerPath` — a `tmpdir()` file — to **every** call:

```
const ledgerPath = join(tmpdir(), `novelty-ledger-test-${randomUUID()}.json`);
expect(await loadNoveltyLedger(ledgerPath)).toEqual([]);
await appendNoveltyLedger(rec, ledgerPath);
```

`noveltyLedgerPath()` — the defaulting function that resolves against `process.cwd()` and is the whole of §12.1's hazard — **is never called by any test.** The suite proves load and append work; it is structurally incapable of noticing that production looks in the wrong place.

It also pins `loadNoveltyLedger(missingFile) === []` as correct behaviour, so the silent-empty is deliberate and tested. The defect is not the swallow — it is that **nothing distinguishes "no ledger yet" from "wrong path"**, and the test asserts they should look identical.

**The generalisable form:** a test that supplies a dependency by parameter cannot detect a defect in how that dependency is resolved by default. 291 test files against 308 sources is strong coverage of behaviour and says nothing about wiring.

---

## 23. Lens 11 — resume & durability

**MEASURED.** The Agent-9 resume checkpoint carries `chapters`, `narrativeState` and **`promptFingerprints`** ([generate.ts:2079](../../../packages/prompts-llm/src/agent9-prose/generate.ts#L2079)) — a real staleness guard, and better than most.

**INFERRED — but it guards the prompt, not the code.** A fingerprint changes when the prompt text changes. It does not change when a *linter rule*, a *validator threshold* or a *deterministic repair* changes, because none of those appear in the prompt. So a run resumed across a code change keeps committed chapters that the new rules would have rejected, and the resumed book is a mixture of two builds with nothing recording the seam. Given that this project's levers are overwhelmingly linter and repair changes rather than prompt changes, the guard covers the minority case.

**MEASURED.** Persistence is mixed: **19 direct writes** (`writeFileSync` / `await fs.writeFile`) against **9 temp-write-plus-rename** across worker and API job code. `appendNoveltyLedger` is correctly atomic. Whether the other 19 matter depends on which are logs and which are records — not classified in this pass, and worth one.

---

## 24. Lens 12 — UI truth

**MEASURED.** [`ScoreCard.vue:194`](../../../apps/web/src/components/ScoreCard.vue#L194):

```
<div class="mt-1 text-sm font-semibold text-slate-800">${{ report.total_cost.toFixed(3) }}</div>
```

**The one place a human reads the cost prints a dollar sign in front of a number the cost tracker computed in pounds** (§20.1). Every run's cost has been displayed ~27% low and in the wrong currency, to three decimal places of false precision.

It is a one-character defect and it is the perfect specimen for this document: the value is right, the pipeline is right, the type is right, the test asserts `total_cost: 5.45` and passes — and the only human-facing surface says the wrong thing, because the unit lives in a comment in another package.

---

## 25. Correction to Part II §12.1

**§12.1 called `start-dev.bat` "the committed launcher". It is not.** `git status` lists `start-dev.bat` and `dev-shell.ps1` as **untracked** — they were created on this machine during setup. The committed launcher is `start-app.bat`.

What survives the correction, and what changes:

- **Survives:** `apps/worker/package.json` is committed and its `dev` script is `node dist/index.js`; `npm run -w @cml/worker dev` runs with cwd = `apps/worker`; `noveltyLedgerPath()` resolves against `process.cwd()`; `apps/worker/data/` does not exist here while the populated ledger sits under `apps/api/data/`. §12.1's mechanism is unchanged.
- **Changes:** the attribution. The cwd hazard follows from the committed *package script*, not from a launcher the repo ships. And `start-app.bat` — the real committed launcher — **does build before launching** (six of sixteen targets, §19.2), so it is better than the local one, which builds nothing.

Recorded rather than silently edited, because the original claim is the kind this document exists to catch: a conclusion drawn from a file that looked like part of the repo and was not.

---

## 26. The through-line of the second sweep

Part II found one concept implemented twice inside the source. **Part III found the same shape one layer out — in the machinery around the source:**

> **Two definitions of the build. Two currencies. Two path conventions. Two ideas of what a test covers. And in every case the surface that a human actually reads — the app's cost line, the launcher, the passing suite — reports the state of only one of them.**

The pattern that unifies all twelve lenses is not "bugs at boundaries". It is narrower and more useful than that:

> **This project's defects live wherever something was written twice and only one copy is observable.**

The clearance regex that fires is observable; the six that do not are not. The GBP in the tracker is observable in a comment; the `$` in the UI is what a person sees. The `build-all` list is observable to CI; `start-app.bat` is what a developer runs. The injected `ledgerPath` is observable to the test; `process.cwd()` is what production uses.

**So the cheapest general guard is not "find the duplicates" — it is "make the second copy observable".** A parity test (§22.1), a unit on the field (§20.1), a count on the injector (§15.1), a warning when the ledger loads empty (§12.1). Each is smaller than the fix it protects, and each converts a silent divergence into a visible one — which is the only form in which this project has ever managed to fix anything.

---
---

# PART IV — the whole-tree defect sweep, and the build record

**Written:** 2026-08-25, at the owner's request to *"check for bugs, weaknesses and inconsistencies — ALL the code"*, then to fix what was found.

**Coverage, stated so it is not overclaimed.** Mechanical pattern checks ran over **all 308 source files** in `packages/*/src` and `apps/*/src`. Deep reads were ~15 files, chosen by risk. **Not covered:** semantic correctness of the domain logic (whether the fair-play audit establishes fair play is a question no grep answers), Vue component reactivity, and the ~30 `scripts/*.mjs` — which are real code, and where two of Part III's findings already lived.

---

## 27. What the sweep found

| # | Severity | Finding | Fixed |
|---|---|---|---|
| 1 | **High** | No process-level error handling in either app | ✅ |
| 2 | Medium | One defensive idiom, three incompatible answers | ✅ |
| 3 | Medium | Circuit-breaker config has no NaN guard | ✅ |
| 4 | Medium | Two policies for the same missing credential | ✅ |
| 5 | Low | Empty calibration set reads as perfect agreement | recorded, not fixed |
| 6 | Low | Module-level counters assume one run per process | recorded, not fixed |

### 27.1 No process-level handlers (HIGH)

**MEASURED.** `grep "process.on("` across `apps/api/src` and `apps/worker/src` returned **nothing**: no `unhandledRejection`, no `uncaughtException`, no `SIGINT`/`SIGTERM`. The worker's entry point was 17 lines ending in `startWorker().catch(...)` — which handles a failure to *start* and nothing after it.

On Node ≥ 15 an unhandled rejection **terminates the process**. So any rejection escaping a handler anywhere in a ~40-minute, ~£1.10 run killed it with no partial saved and no diagnostic beyond a stack trace, and Ctrl-C did the same.

**This is the complement to [A_71 §1.1](../ANALYSIS_71/ANALYSIS_71.md), not a duplicate of it.** That work made the partial report honest *at write time*. It did not make the write HAPPEN when the process dies abruptly — and the orchestrator's own comment lists the ways it does: *"a crash, a hard-stop whose own save fails, the 0xC0000409 process abort of A_70 §8.5, a power cut"*. Seven of nine reports on disk are stranded partials of exactly that shape.

**Fixed** — `apps/worker/src/process-guards.ts`, installed by both entry points. On the way down it flushes once (10s timeout, so a hung filesystem cannot turn "dying loudly" into "hanging forever"), names the cause, and exits with a distinct code (17 rejection · 18 exception · 19 signal). The flush is a **registry**, not an import: `savePartialReport` is a per-run closure over the aggregator and repository, so the orchestrator registers it where the closure exists and clears it in a new `finally` on `generateMystery`. A stale hook would let a later crash overwrite a finished run's report with the previous run's snapshot.

**Found while fixing:** the API loaded only `.env.local`; the worker loads `.env` then `.env.local` with `override: true`. Two entry points into the same pipeline disagreed about where configuration comes from — and the API is the one that runs `generateMystery` in-process. Now identical.

### 27.2 One idiom, three answers (MEDIUM)

**MEASURED.** Three files hash a `runId`, and each answers a falsy one differently:

```
agent2-cast.ts:167       simpleHash(runId)                    → TypeError (simpleHash reads .length)
temporal-anchor.ts:110   simpleHash(runId || Math.random())   → NON-DETERMINISTIC
name-generator.ts:568    simpleHash(runId || 'default')       → stable fallback
```

The middle one matters most: it silently makes the story's year and month irreproducible, and **matched-pair replay is the only instrument this project owns that can resolve five marks** ([A_72 §10.4](../ANALYSIS_72/ANALYSIS_72.md)). A replay would show a changed setting and unchanged names, with nothing explaining why.

**Fixed, deliberately without changing any value.** `generateSpecificDate` is pinned byte-identical to `agent2d-temporal-context.ts`, and an equivalence claim is worth more than tidiness — so the fallback stays and now *announces itself*, naming the story as unusable for a matched pair. `simpleHash` coerces non-strings, which removes the crash at the third site without altering the hash of any real input.

### 27.3 and 27.4 — two config guards (MEDIUM)

`parseInt(process.env.CIRCUIT_BREAKER_FAILURE_THRESHOLD || "5")` had no NaN guard, and `failures >= NaN` is always false — so a typo **silently disabled the circuit breaker** and the run would hammer a failing endpoint. Fixed with a `Number.isFinite` + positive check that warns and falls back.

`config.defaultModel || process.env.AZURE_OPENAI_DEPLOYMENT_NAME!` asserted non-null on the variable `canary-core.mjs` refuses to default, for a stated reason (X14: *"a probe that silently measures the wrong model is worse than none"*). Same variable, two policies; this one carried `undefined` forward to fail later at the API boundary with a message about a bad request rather than about configuration. Now it throws at construction in the canary's own terms.

**Verified safe rather than assumed safe:** both production factories (`cli-runtime.buildClient`, `jobs/index`) already resolve the model explicitly via `requireAzureDeployment()`, so the throw closes a direct-construction back door and cannot break a real path. Two tests constructed minimal clients to compare cost trackers; they now pass a model, which does not touch what they assert.

---

## 28. What came back clean — the more useful half

| Check | Result |
|---|---|
| Empty `catch {}` blocks | **0** |
| Loose `==` in code | **0** — all 19 hits are inside comments |
| `TODO` / `FIXME` / `HACK` / `XXX` | **0** across 308 files |
| Nested-quantifier regexes (ReDoS) | **0** |
| `.sort()` without comparator | 8 hits, all on strings — correct |
| `while (true)` | 1, properly bounded by `attempts`/`maxRetries` |
| Express routes without a terminating `.catch` | none |
| Division by `.length` | 46 sites, all guarded |
| Floating promises on persistence calls | 2 candidates, both synchronous — false positives |

**Zero TODO markers in 308 files is the finding here.** The bug classes that dominate ordinary codebases are essentially absent, which is consistent with §18 and §26: this project's defects are not local logic errors. They live at boundaries between two copies of one idea — and findings 27.2 and 27.4 are that same shape again, now in a defensive idiom and a config policy rather than in a regex or a price table.

---

## 29. BUILD RECORD — 2026-08-24/25

Everything in Parts I–IV that was fixed, with what was deliberately not.

**Applied and verified:**

| Fix | § |
|---|---|
| Clearance vocabulary: 4 prose-stage bodies → 1 module, + parity test | §11.1, §22.1 |
| Mojibake: one repair table in `@cml/cml`, incl. the double-encoded family that was detect-only | §11.2, §15.2 |
| `DEATH_RE`: second copy removed, imported from story-validation | §11.3 |
| Novelty ledger: workspace-root anchored, legacy locations still read, empty load now warns | §12.1 |
| `NOVELTY_CROSS_RUN` header corrected — it defaults to *shadow*, which is ENGAGED | §12.1 |
| Clue injector: `deterministic_clue_paste_count` telemetry, counted at the splice | §15.1 |
| Paragraph-preservation guard: rejected candidate now named in the log | §4.2, §4.3 |
| `total_cost`: unit documented; UI `$` → `£` | §20.1, §24 |
| `start-app.bat`: six hand-listed targets → `build:all` (it omitted ten packages) | §19.2 |
| `.env.local.example`: behaviour flags documented; missing `AZURE_OPENAI_DEPLOYMENT_NAME` added | §13.4 |
| Machine-specific `C:/CML/...` path in a test → resolved from the module | §22 |
| `FLAG-AUDIT.md` scope line corrected; the 22 un-audited non-Agent-9 flags named | §13.2 |
| Process guards + `.env` load-order parity | §27.1 |
| `runId` idiom: crash removed, non-determinism made loud | §27.2 |
| Circuit-breaker NaN guard; model required at client construction | §27.3, §27.4 |

**Flag-gated, default OFF — behaviour levers that need a run and a read before promotion:**

- **C4** (§2) — `AGENT9_LOCKED_FACT_ALIASES`. Off, the prompt is byte-identical to what shipped. On, the canonical value must be stated exactly once per chapter that turns on it and natural references are allowed after that. No validator change was needed, because the validator never required more.

**Deliberately NOT done, with reasons:**

- **Widening the narrow clearance vocabulary to meet the wide one** (§11.1). Probably right, and it is a behaviour change to gating that must be measured, not assumed. The parity test now fails if anyone does it accidentally.
- **C3's echo gate** (§6) — ordering constraint: after a cost governor, not before.
- **A2b / A3** (§3, §14.1) — features, not fixes. A3 additionally needs its second edit site: `character_pressure_contract` forbids exactly what A3 would ask for.
- **E2's cache policy** (§5, §20.1) — a decision about cached-token pricing and one price table, not a code task. The unit half is fixed; the policy half is the owner's.
- **Findings 5 and 6** (§27) — recorded above; neither is wrong today.

**Verification.** `build:all` clean across all 16 packages. Test suites: cml 107 · llm-client 108 · prompts-llm 1,177 (7 skipped, needs credentials) · story-validation 497 · worker 664 · api 27 · web 174 — **~2,754 passing**. Two failures remain, both pre-existing and environmental: `fixed-seed-benchmark.replay.test.ts` and `report-invariants.replay.test.ts` read `validation/quality-report-*.json` fixtures that are gitignored and absent on this machine. They failed identically before any of this work.

**Not verified, and it cannot be here.** No pipeline run. This machine's `.env.local` is the example stub (placeholder key, no deployment name), and `canary-core.mjs` correctly refuses rather than measuring an unattributable model. The two new instruments — the clue-paste count and the paragraph-guard warning — report for the first time on the next real run, which is also the run that would split §4.2's 18 `missing_clue` retries into their two actual causes.
