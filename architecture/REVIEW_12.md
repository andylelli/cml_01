# Architecture Review 12 — why there are so many retries

**Written:** 2026-08-19 · **Type:** a diagnosis of the Agent 9 retry loop.
Companion to [REVIEW_11](REVIEW_11.md), which is the live board. [REVIEW_05](REVIEW_05.md) is the tracker.

Measured over **20 runs and 196 chapters** in `logs/llm-prompts-full.jsonl`, plus one run executed for
this review with the X47 craft floor on:

> **Retries are 0.50 per chapter — 4.9 per run — and account for 37% of all prose prompt volume
> (11.3M of 30.9M characters). Prose is the expensive half of the pipeline, so better than a third of
> the money is spent generating chapters again.**
>
> **On the newest run, 8 of 11 retry calls were caused by one word. The case's own evidence list
> names a "Broken spring fragment"; the season validator read `spring` as the season, declared a
> "month/season contradiction (september vs spring)", and forced four chapters to be rewritten twice
> each for correctly describing the murder device.**

---

## 1. The size of it

| | |
|---|---:|
| runs with prose data | 20 |
| chapters generated | 196 |
| retry calls | **98** |
| retries per chapter | **0.50** |
| retries per run | **4.9** |
| first-attempt prompt volume | 19.6M chars |
| **retry prompt volume** | **11.3M chars (37%)** |

Two runs in twenty needed no retry at all — 10 prose calls for 10 chapters, 1.01M chars — against a
worst case of 20 calls and 2.14M. **A bad run costs 2.1× a clean one.** That spread is the useful fact:
the ceiling is not the model's competence, because the same model on the same brief sometimes clears
every chapter first time.

---

## 2. Where they land — and a hypothesis this review had to withdraw

Chapters needing ≥1 retry, across all 20 runs:

```
ch1   █████ 5          ch6   ██████ 6
ch2   ███████ 7        ch7   ██████ 6
ch3   ████ 4           ch8   ██████████ 10
ch4   █████ 5          ch9   ███████████ 11
ch5   ████ 4           ch10  ████████████ 12
```

Chapters 1–7 retry in 20–35% of runs; chapters 8, 9 and 10 in **50–60%**.

**The obvious explanation was tested and failed.** X47 strips context from exactly those back chapters
(`character_contracts` from ch6, `craft_guide` and `judged_on` from ch8), so "the chapters with the
least context retry the most" was the natural reading. The run executed for this review had the craft
floor ON, and its per-chapter budget line confirms the floor did its job — `character_contracts` and
`craft_guide` survive to ch10, where on 08-17 they were dropped at ch6 and ch8:

```
ch   available   dropped
 6      6,585    humour_guide, continuity_context, location_profiles, texture_pool, physical_plausibility
 8      4,983    (same five — craft_guide and character_contracts NOT dropped)
 9      2,778    futile=true → non-craft only; every craft block kept
10        843    futile=true → non-craft only; every craft block kept
```

**Retries went up, not down: 11 retry calls over 10 chapters, the highest in the corpus.** The ch8–10
concentration persisted (5 of 11). So more context did not buy fewer retries, and §2 of this review's
first draft — which offered the X47 link as the likely cause — is withdrawn. Whatever drives the back-
chapter peak, it is not context starvation.

**It also costs.** With `futile=true` the loop now stops at the craft floor, so ch9 shipped 13,847
context tokens where 08-17 shipped 5,737 — a total of 35,069 against a 24,000 budget, where the old
behaviour overshot by 15%. The craft floor triples the overshoot on the two chapters that were already
worst. That is X47 working as designed and it is a real bill; it belongs in the flag's before/after.

---

## 3. The cause that dominates: the story's vocabulary is the validator's vocabulary

Three separate validators, three ordinary words, one pipeline whose canary brief is pinned to
**clock-tampering mysteries**.

### 3.1 `spring` — 8 of 11 retry calls on the newest run

The case's own evidence list, written by Agent 3 and handed to Agent 5:

> *"Taut wire from rooftop to clock back panel — **Broken spring fragment** found near rooftop pulley"*

Agent 9 wrote it up as instructed, and every occurrence of the word in the shipped manuscript is that
object:

> *"A broken **spring** fragment, no larger than a thumbnail, rested near the baseboard"*
> *"a loose wire and a broken **spring**"*
> *"the wire, the broken **spring**, the ledger, the mismatched times"*

The chapter validator then reported, on chapters 2, 3, 4 and 8, twice each:

> `Chapter N has month/season contradiction (september vs spring)`

**Agent 2d's temporal data is correct** — `"month": "September"`, `"season": "fall"`. There is no
contradiction in the case. The contradiction is between the case's physical evidence and a season word
list.

**A guard for this already exists and does not reach the prose.**
[`buildSpringMechanicalRe`](../packages/story-validation/src/temporal-consistency.ts#L123) strips
mechanical-spring collocations before the seasonal test, and its own comment names this exact risk —
*"the load-bearing object in a time-tampering mystery, mentioned in nearly every chapter… it can never
be repaired"*. Tested against the real sentences, with a fresh matcher per case:

```
mechanical=true    "the mainspring had snapped"
mechanical=true    "a coil spring lay beside it"
mechanical=true    "the clock spring was broken"
mechanical=false   "A broken spring fragment, no larger than a thumbnail…"
mechanical=false   "a loose wire and a broken spring"
mechanical=false   "letting her gaze linger on the wire and the spring"
mechanical=false   "The spring fragment, too, was out of place"
mechanical=true?   "cold spring air drifted through the window"  → false, correctly
```

The list is built from mechanism **nouns** (`main`, `coil`, `clock`, `pendulum`…) and winding
**actions** (`wound`, `coiled`, `tensioned`). Prose does neither: it names the part by its **condition**
(*broken*), by a **part noun** (*spring fragment*), and thereafter by the bare definite article
(*the spring*) — which is simply how English refers back to something already introduced.

Lengthening the list is the wrong repair, and the file says so: its own comment calls the previous
round *"the A_60 whack-a-mole: sundial/gnomon had to be added by hand"*. The document-level fact is
already available and unused — **the case's evidence list contains the word `spring`**. When it does,
bare `spring` in that manuscript should read as mechanical unless it carries an unambiguous seasonal
marker (`springtime`, `vernal`, or an adjacent weather/season word), which is the inverse of today's
default and needs no vocabulary at all.

### 3.2 `exposed` — the chapter-1 opener

**Measured on the same run.** Chapter 1 was rejected twice with:

> `Stage-mode outcome failed (discovery_opening): chapter must not contain confession/arrest/solution language.`

The chapter contained no confession, no arrest and no solution. It contained:

> *"The mechanism inside the clock, partially **exposed** where the panel hung ajar, revealed a small
> lever that looked recently moved."*

`RESOLUTION_RE` ([clue-validation.ts:1046](../packages/prompts-llm/src/agent9-prose/clue-validation.ts#L1046))
carries bare `expos(?:ed|es)` among nineteen alternatives, for the sense *"the culprit was exposed"*.
It also carries bare `guilty`, `surrendered`, `condemned` and `named as`. The model was told which rule
it broke and given no way to know which of nineteen tokens matched.

### 3.3 The four aftermath phrases

`aftermath_consequence` is the most frequent retry cause across the whole corpus. Its first test is
([clue-validation.ts:1305](../packages/prompts-llm/src/agent9-prose/clue-validation.ts#L1305)):

```ts
if (/\b(new clue|new evidence|for the first time|newly discovered)\b/i.test(chapterText))
```

Four literal phrases, under a message that makes a structural claim — *"must focus on consequence, not
introduce decisive new mystery evidence"*. Those phrases appear 409 times across 337 corpus
manuscripts (1.2 per book): common English, not a tell.

On the 08-17 run this fired on ch9 twice. The third draft dropped the phrases and is **12.8%
word-similar** to the first, so the model genuinely rewrote rather than reworded — and it is still the
chapter whose structure the cold reader complained about. **Three attempts moved the words and left the
defect**, which is what a phrase test buys when its message describes a shape.

### 3.4 The pattern

This is the third time in two reviews that a validator has named a concept and tested a wordlist.
REVIEW_11 §6 found `GUILT_MARKER` missing a verb for a blow, in a corpus where the death method was a
blow. Here the collisions run the other way — `spring`, `exposed` — but the shape is identical, and it
is not a coincidence: **the canary brief pins the domain to clocks, so the domain's nouns are exactly
the words these lists reach for.**

---

## 4. The retry ladder drops its evidence on the last attempt — deliberately (see §8.4)

Measured across every multi-attempt chapter in the two most recent runs — **12 chapters, 6 for 6 among
those that reached three attempts**:

```
                 attempt 1   attempt 2   attempt 3
rejected draft      —          shown       NOT shown
```

Attempt 2 receives the full rejected chapter (~6,800–11,500 characters). Attempt 3 has it removed and
replaced with two fixed lines, identical regardless of what failed:

```
8. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with
   concrete, observable prose before any deduction beat.
9. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation.
```

The specific validator message IS present on attempts 2 and 3 — this review's first draft claimed
otherwise and was wrong. What the last and most expensive attempt loses is the concrete example. And
for an aftermath chapter the first mitigation line is close to the opposite of what the validator
demands.

---

## 5. The retries that cannot succeed

The 08-17 run's chapter 9 carries this scene purpose from Agent 7:

> **"Clear suspects through alibis and witness verification"**

and is judged by `aftermath_consequence`, whose contract — quoted in its own source comment — forbids
*"per-suspect clearance recitation"* and demands *"consequence and retrospect only"*.

**The outline instructs the chapter to do precisely what the validator rejects.** The model wrote what
it was told, three times, and was refused three times on the same message. In the 08-04 run the same
shape ran to exhaustion on ch9 and ch10 — three attempts each, all failing, shipped anyway.

**2 of 29 recorded failing attempts are exhaustions**, and both are this shape. Exhaustion is rare;
the wasted ladder before it is not.

This is REVIEW_11 §7 from the other end — there diagnosed from the manuscript and the reader's
complaint, here visible as a contract and a validator that were never reconciled.

---

## 6. What this suggests, in cost order

```
FREE
 1  Disambiguate `spring` from the CASE, not from a word list. The case's evidence list already
    contains the word; when it does, bare `spring` is the device unless it carries an
    unambiguous seasonal marker. Biggest single measured win: 8 of 11 retries on one run.   §3.1
 2  Make every wordlist failure name its trigger. "must not contain confession/arrest/solution
    language" is unactionable when the matched token is "exposed"; naming the word and the
    paragraph turns a regeneration into a one-line edit.                                    §3.2
 3  Narrow RESOLUTION_RE and the four aftermath phrases on corpus evidence, the way X49
    narrowed GUILT_MARKER — measure candidates against the corpus before shipping them.     §3.2/3.3
 4  Keep the rejected draft on the final attempt, or document why it is dropped.            §4

NEEDS A DECISION
 5  Reconcile the aftermath contract with the outline that feeds it. Either Agent 7 stops
    scheduling clearances after the reveal, or the validator stops forbidding them.
    `AGENT9_FOLD_SUSPECT_CLEARANCES` (built 07-24, default OFF) is the built form.          §5
 6  X47's craft floor triples the ch9/ch10 budget overshoot and did not reduce retries.
    Whether the craft context is worth the tokens is now a measurable question, not a
    speculative one — and the first evidence is against it.                                 §2
```

Items 1–4 are instrument work: they change no prose contract and remove no obligation.

---

## 7. What would falsify this document

- **§3.1 is wrong if** a run whose case contains no `spring` still shows season-contradiction retries.
  That would make the collision incidental rather than causal.
- **§3.2 is wrong if** the chapter-1 draft was rejected for a token other than `exposed`. It was read
  directly from attempt 2's prompt and contains exactly one `RESOLUTION_RE` match — but one draft is
  one draft.
- **§2 is already the product of one falsification**: the craft-floor hypothesis was tested on a paid
  run and failed. It is recorded rather than deleted, because the next person to notice that the
  starved chapters retry most deserves to know it has been tried.
- **What this document does not establish:** that retries lower quality. Two runs needed none and one
  scored 80; the 86 needed three. The claim here is about **cost and diagnosis**, not about the mark —
  §1's 37% is a measurement, while every causal claim about *where* retries land is co-location.
- **A caveat on the corpus:** shipped manuscripts are the population that PASSED these gates, so they
  cannot measure a false-positive rate. Every false positive named here was read from a rejected draft
  inside the next attempt's prompt, which is the only place they survive.

---

## 8. The block, as built (2026-08-19)

**Gates:** `npm test` green across all 18 workspaces, 0 failures · 32 new tests · every pattern below
chosen by sweeping the corpus, with positive controls that must keep firing.

**Three of the four items shipped. The fourth was already implemented, and §4 above was wrong about
it** — the correction is in §8.4 and left standing rather than deleted.

### 8.1 Item 1 — `spring` is disambiguated from the case

`caseNamesMechanicalSpring(cmlCase)` reads `constraint_space.physical.traces`,
`constraint_space.access.objects`, the mechanism description and delivery path, the discriminating
test, and `death_method`. When any of them contains the word, the seasonal test for `spring` switches
from the bare word to `SPRING_SEASONAL_ONLY_RE`, which requires a marker a clock part cannot carry.

**Verified against the four chapters that actually retried**, running the built code over the shipped
manuscript of `mystery-1787090659145`:

```
ch    before          after
 2    ["spring"]      []     <-- retry avoided
 3    ["spring"]      []     <-- retry avoided
 4    ["spring"]      []     <-- retry avoided
 8    ["spring"]      []     <-- retry avoided
```

**8 of that run's 11 retry calls, removed.** The other six chapters are unchanged.

The seasonal pattern was measured over 171 manuscripts and 487 sentences containing `spring`: it
matches 365, and every sampled match is the season. **The masking risk is real and bounded** — a case
that names a mechanical spring AND writes genuine spring-seasonal prose in a non-spring month would go
unflagged. A test pins the boundary: `"It was September, and the spring air still lingered"` STILL
flags, on a case that names a spring. So does `springtime`, and so does `vernal`.

### 8.2 Item 2 — every wordlist failure now names its trigger

Three messages changed. Each previously restated the rule; each now quotes the words that fired it:

```
before:  chapter must not contain confession/arrest/solution language.
after:   … Triggered by "exposed" in: "…The mechanism inside the clock, partially exposed where
         the panel hung ajar…". Chapter 1 discovers the body; reword just that phrase — if it
         describes a physical thing rather than a person being found out, choose a word that
         cannot read as an accusation.

before:  aftermath chapter must focus on consequence, not introduce decisive new mystery evidence.
after:   … Triggered by the phrase "new evidence" — remove or reword that phrase, and refer to
         evidence already shown rather than presenting it afresh.

before:  Align season wording with month references (september)…
after:   … triggered by spring: "…a broken spring fragment, no larger than a thumbnail…" … If the
         word names a physical object (a clock's spring, a summer house), rename it so it cannot
         read as a season.
```

`analyzeTemporalConsistency` gained a `seasonTriggers` field so the caller has the offending span
rather than only the season name.

### 8.3 Item 3 — both wordlists narrowed on corpus evidence

**`RESOLUTION_RE`.** Bare `expos(ed|es)`, `guilty`, `surrendered`, `unmask(ed)` and `condemned` now
require the construction that carries the resolution meaning — a person or a verdict, never a thing
left uncovered. `confess` gained a carve-out for the Golden-Age discourse marker (*"Though I confess,
I've seen clocks and men both falter"*). Checked against 11 positive controls and 8 measured false
positives; all pass.

**Checked at BOTH call sites before shipping**, because this regex is the negative test for chapter 1
and the POSITIVE test for the reveal chapter, where narrowing risks a false negative. Over the last
two chapters of all 171 manuscripts it now matches **169 where the old one matched 165** — the
narrowed version adds `confession`, the noun, which `confess(?:ed|es)?` never covered. Stricter where
it should be, broader where it counts.

**The aftermath four became three.** Measured over the last two chapters of all 171 manuscripts:

```
new clue            0 occurrences
newly discovered    0 occurrences
new evidence        2 occurrences — both genuinely presenting evidence
for the first time  47 occurrences — and not one is about evidence
```

Every sampled use of the fourth is the register this validator DEMANDS: *"her posture relaxing for the
first time all evening"*, *"for the first time in days, her eyes met his"*, *"the mask of authority
slipped for the first time"*. Consequence and retrospect is what an aftermath chapter owes, and the
phrase English writes it with was being rejected as decisive new evidence. Removed. The other three
are near-zero volume and semantically on target, so they stay.

### 8.4 Item 4 — CORRECTION: it was already implemented, and §4 above is wrong

§4 reported that attempt 3 loses the rejected draft and called the ladder *"undocumented"*. The
observation is right and the characterisation is not. The drop is deliberate, documented at the code
that does it, and **explained to the model in the prompt**. Attempt 3 of the live run receives:

```
Retry mode: FULL_REBUILD.
Attempt context: 3/3 | primary class: fair_play | subcode: stage_mode_outcome.
Why this mode: final-attempt or hard mitigation triggered.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard
  constraints as the source of truth.
```

`buildRetryPromptStrategy` is a considered policy with a computed `rationale`: a final attempt, a
template failure, or a multi-family failure all withhold the prior draft, on the stated grounds that
prior wording is a harmful anchor. Only a single-family failure gets `surgical_patch` with the draft
attached.

**No code change was warranted, and none was made.** One thing in §4 survives as a genuine
observation: the code comment describes *"attempts 2/3 include the previous response… attempt 4+
rebuild"*, while `maxBatchAttempts` is 3 — so the intended "two edit passes then a rebuild" collapses
to one edit pass and a rebuild. That is a comment/config mismatch, not a defect, and it is recorded
here rather than silently corrected in either direction.

### 8.5 What this does not claim

The 8-retry saving is arithmetic on one run's shipped manuscript, not a measured rerun: the same case
would have to be generated again to see it live, and cases are regenerated every run. Nothing here
touches §5's contract-versus-validator clash, which is the retry class no wordlist change can reach.
And the corpus caveat from §7 still holds — shipped manuscripts are the population that PASSED these
gates, so every false positive named here came from a rejected draft, not from the corpus.

---

## 9. Carrying on: two more, both found by settling the run's open questions (2026-08-19)

§8 closed the free block. Two questions were left hanging from the run that produced it — X49 fired
again on ch9, and X52 stayed silent — and answering them turned up one live false certification and
one determinate way to waste a whole run.

**Gates:** `npm test` green across all 18 workspaces, 0 failures · geometry backtest **PASS**,
separation unchanged (68: 9 violations, 80: 6).

### 9.1 The two open questions, answered

**X52 was right to stay silent.** The only culprit-implicating clue on that run
(`clue_19`, *"Staff shift change logs confirm no other suspect had access to the rooftop terrace…
except Hugo Vane"*) is **testimonial**, and X52 excludes testimonial clues by design — a witness
statement cannot be planted as an unremarked object. The essential pass had already planted
`clue_culprit_direct_hugo_vane` at scene 7. A true negative, not a miss.

**X49's ch9 fire is a true positive about a wrongly-bound chapter.** Read directly:

```
manuscript-wide disclosure : met @ chapter 10
ch8 alone                  : unmet
ch9 alone                  : unmet     <- the bound reveal chapter
ch10 alone                 : met       <- "Clearances and Culprit Revealed"
```

Chapter 9 genuinely does not disclose; chapter 10 does. Agent 7.5 said so in the same run —
*"reveal bound to chapter 9 by its beat 'final_trap' but … chapter 10 reads as the disclosure"*. So
unlike the 08-17 case in [REVIEW_11](REVIEW_11.md) §6.1, here the **locator is right and the binding
is wrong**. Both readings now have a worked example, which is the useful outcome: the binding is
sometimes right and sometimes not, and only reading the manuscript settles which.

### 9.2 X59 — the `shot` idiom's third word order, and it was the dangerous one

The disclosure read above initially came back **`met @ chapter 2`**. The sentence responsible:

> *"She **shot** Hugo Vane **a look** that was more tired than accusatory."*

X27 covered `shot a glance` — verb then noun. [REVIEW_11](REVIEW_11.md) §12.2 added `the glance she
shot` — the relative clause. English also writes it **ditransitively**, and that form is the worst of
the three, because it puts a NAME between the verb and the noun. The sentence therefore pairs the
culprit with a guilt verb, which is precisely the conjunction `disclosingSentence` looks for — so the
whole manuscript certified as disclosing in chapter 2, eight chapters before it does.

That is the FALSE CERTIFICATION class [REVIEW_05](REVIEW_05.md) §10.1 exists to prevent, and it was
live. **Not caused by the X49 widening** — the old marker matched this sentence too.

MEASURED before shipping: **25 sentences across 171 manuscripts match the ditransitive form, all 25
are the idiom**, and none was covered by an existing branch. The boundary is clean — a real shooting
has no article-plus-look-noun after the recipient, so *"Hugo Vane shot the man where he stood"* still
discloses. After the fix the same manuscript reports `met @ chapter 10`.

A test of mine failed on the way in, asserting that *"shot the man where he stood"* should NOT
disclose. It should. The test was wrong and the code was right, and the assertion was corrected rather
than the behaviour.

### 9.3 X60 — Agent 4 waives a defect, Agent 9 aborts on it, five paid agents apart

The run before this one aborted with no manuscript. The cause was upstream of everything in §8, and
the way it aborted is its own defect.

```
Agent 4: Auto-revision triggered after 6 attempts (3 revisions)
Agent 4: CML degraded — proceeding with 1 unresolved validation warning(s)
Agent 4 unresolved: CASE.hidden_model.mechanism (apparent_not_covered): …
   … Agents 5, 6, 6.5, 7, 7.5 all run and are all paid …
Agent 9 aborted before prose generation: CML schema validation failed:
   CASE.hidden_model.mechanism (apparent_not_covered): …
```

[agent3-run.ts:254](../apps/worker/src/jobs/agents/agent3-run.ts#L254) deliberately proceeds —
*"Carry the unresolved warnings and PROCEED rather than killing the run"* — and
[agent9-run.ts:3636](../apps/worker/src/jobs/agents/agent9-run.ts#L3636) re-runs the **same
`validateCml`** and throws. Identical error string, opposite policy, **12.8 minutes and ~17 LLM calls
apart**.

For these codes the degrade path can never deliver a story. `apparent_not_covered`, `actual_covered`
and `times_identical` are computed purely from `hidden_model.mechanism` plus the culprit's
`alibi_window`, and nothing between Agent 3 and Agent 9 writes either — `agent3-cml.ts`'s
normalization only fills defaults. The late abort is deterministic, not bad luck.

**FIXED by failing at the cheap end**, which is X38's principle exactly. Scoped to those three codes
rather than to "validation invalid", because the general case genuinely cannot be proven unrepairable
from Agent 3 — downstream passes do repair clues, scenes and cast fields. **This changes no run that
would otherwise have shipped:** every run it stops was already going to die, five agents later.

### 9.4 What is left, and what it needs

The free board is now empty. What remains needs either money or a decision, and neither is mine:

- **Item 5 (decision).** The aftermath contract still contradicts the outline that feeds it (§5). No
  wordlist change reaches that class of retry. `AGENT9_FOLD_SUSPECT_CLEARANCES` is the built form and
  has been default-OFF since 07-24.
- **Item 6 (decision).** X47's craft floor triples the ch9/ch10 budget overshoot and did not reduce
  retries (§2). Whether that context is worth the tokens is now measurable, and the first evidence is
  against it.
- **X38-at-source (paid).** Still [REVIEW_11](REVIEW_11.md) §10's top paid item: the device's own
  arithmetic, fixed where it is authored. It did not fire on the 08-19 run — that case's clocks were
  coherent — so it remains intermittent and unmeasured since 08-17.
