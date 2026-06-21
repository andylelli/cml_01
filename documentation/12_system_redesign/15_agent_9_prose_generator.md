# Agent 9 — Prose Generator: A Ground-Up Redesign

> The final synthesis turns a validated proof into a novel — and it is the place where we
> most often break our own correct output, burn 96% of the run's tokens, and let a cosmetic
> linter hard-abort a run while the report reads green. This is the flagship rebuild.

---

## 1. The job to be done

Everything upstream of Agent 9 exists to make Agent 9's job *almost trivial*. By the time
prose generation starts, the mystery is already solved: the CML
([`schema/cml_2_0.schema.yaml`](../../schema/cml_2_0.schema.yaml)) holds the validated
timeline, mechanism, inference path, and solution; the clues exist and are placed (Agent 5); the
fair-play audit has passed (Agent 6); the chapter-by-chapter beats are planned (Agent 7); the cast,
profiles, locations, temporal frame, and world tone are all written down. Agent 9 is the *renderer*.

Its job, stated cleanly:

> **Given a fully-specified logical model and a scene-by-scene plan, write the chapters — and write
> them well — without altering a single fact, leaking a single clue early, or breaking fair-play.**

That is a *constrained generation* problem, not a *creative invention* problem. The creativity
budget was spent upstream on purpose. What Agent 9 owes the reader is: prose quality (voice,
variety, period register, pacing) and **fidelity** (every fact, every clue at its planned moment,
every suspect eliminated exactly when the proof says, nothing revealed before its time).

The crucial design consequence: **fidelity is checkable and quality is judgeable.** Fidelity is a
machine property — "does clue C7 appear by chapter 6, described in a way a reader could use?" is a
question with a yes/no answer. Quality is a judgment — "do these chapters sound samey?" is a
question for a critic, not a regex. The shipped Agent 9 inverts this: it tries to *judge quality
with regexes* (the template linter) and *repair fidelity with deterministic string edits* (grounding
leads, pronoun sweeps). Both inversions are the source of nearly every defect below.

---

## 2. How it works today

The runner is [`apps/worker/src/jobs/agents/agent9-run.ts`](../../apps/worker/src/jobs/agents/agent9-run.ts)
— **5,185 lines, the single largest file in the repository** — orchestrating a generation core split
across [`packages/prompts-llm/src/agent9-prose/`](../../packages/prompts-llm/src/agent9-prose/)
(itself ~900KB across `generate.ts`, `lint.ts`, `prompt-builder.ts`, `clue-validation.ts`,
`deterministic-repair.ts`, `obligation-block.ts`, and a dozen more). The doc still points at a
single `agent9-prose.ts` that no longer exists — the fossil record of how fast this component grew.

The shape of a run:

1. **Per-chapter batched generation.** Chapters are generated in small batches, with a
   `NarrativeState` object carried forward between batches so later chapters "remember" earlier ones.
   Each batch is a fresh LLM call assembled by `prompt-builder.ts` from the CML, outline, cast,
   profiles, locations, temporal context, world document, locked facts, clue distribution, and the
   accumulated narrative state.

2. **The anti-template linter.** After each batch, [`lint.ts`](../../packages/prompts-llm/src/agent9-prose/lint.ts)
   (~1,300 lines) runs a battery of **regex/heuristic** checks: `template_bleed` (two paragraphs
   sharing a 2-word opener, or 3+ sharing a first word; plus weather-preamble openers, room-inventory
   openers, stock-phrase reuse), `opening_style_entropy` (opening-bucket variety), `paragraph_fingerprint`
   (cross-chapter duplicate long paragraphs), `ngram_overlap` (Jaccard similarity against prior
   paragraphs), `intra_chapter_sentence_duplicate`, `debug_note_bleed`, and more.

3. **Class-based retry escalation.** Failures are classified (`classifyFailure` in `generate.ts`)
   into canonical families — `encoding`, `structure`, `completeness`, `continuity`, `clue_timing`,
   `template`, `tone_pacing`, `fair_play` — and retried with one of three modes
   (`surgical_patch`, `targeted_rebuild`, `full_rebuild`), three attempts per batch, with
   convergence detection to stop hammering a non-converging class.

4. **Deterministic post-processing, run *after* validation.**
   `applyDeterministicProsePostProcessing` (line 2181) sanitizes text, normalizes chapter titles,
   conditionally **prepends a "grounding lead"** (`buildDeterministicGroundingLead`, line 349) when
   a chapter's opening lacks an anchor/sensory/atmosphere signal, repairs locked-fact word forms, and
   normalizes location names. `applyDeterministicPronounSweep` (line 2032) does cross-paragraph
   pronoun inheritance. **None of these re-run the validator they claim to satisfy.**

5. **Release gates.** A final pass (line ~4789) accumulates `releaseGateReasons` and `hardStopReasons`:
   temporal contradictions, suspect-elimination failure, clue-visibility divergence, mojibake/encoding
   corruption, investigator-role drift, missing discriminating test scene — any of which can hard-stop
   the run.

Five thousand lines to render a proof that's already been proven. That number is the symptom.

---

## 3. Where it hurts

These are not hypothetical. Each has a shipped failure mode, and several have a run ID in the
codebase comments.

### 3.1 `template_bleed` had no backstop and could kill a run with no story (canonical case)

The model habitually opens consecutive paragraphs with a character's full name — *"Inspector Gray
crossed to the window. Inspector Gray studied the sill."* That trips `template_bleed`'s repeated-opener
check on nearly every first draft ([`lint.ts:285-292`](../../packages/prompts-llm/src/agent9-prose/lint.ts)).
The check emits one issue **per distinct offending opener**, so fixing one opener surfaces the
*next* pre-existing duplicate on the following attempt — the comment in the code literally calls it
"the whack-a-mole that burned the per-chapter retry budget" ([`lint.ts:259-263`](../../packages/prompts-llm/src/agent9-prose/lint.ts)).

Historically this had **no exhaustion backstop**. A cosmetic, perfectly-readable repeated opener
could exhaust all three attempts and **hard-abort the entire run, producing no story at all — while
the report still read green.** This is the canonical "no-backstop gate kills runs" defect of the
whole system. It was eventually fixed (ANALYSIS_44) with an opener-exhaustion bypass
([`generate.ts:3089-3119`](../../packages/prompts-llm/src/agent9-prose/generate.ts)) — a hand-scoped
escape hatch that accepts the batch with a warning *only* when the failure is exclusively the
"repeated content opener" message and nothing else co-occurs. Read that fix carefully and you see the
real problem: we are maintaining a delicate `every(...)`-guarded allowlist of *which cosmetic linter
verdicts are allowed to be ignored*, scoped by literal message-string prefix, because the linter
cannot tell the difference between "samey" and "broken" and we don't trust it to fail safe.

### 3.2 The grounding-lead leak: a "repair" that injected setting metadata into prose

`buildDeterministicGroundingLead` ([line 349](../../apps/worker/src/jobs/agents/agent9-run.ts))
interpolates raw `locationProfiles` fields — `mood`, `weather`, `place`, `sensoryDetails` — into a
sentence template and **prepends it to a chapter** whenever the opening looks under-grounded. When an
upstream field was malformed, the template faithfully rendered the malformation into the *first
sentence of a chapter*: a location-metadata dump like
*"Wynthorpe Manor - Library in … a quiet tension underlies the cozy setting cast."*

Look at what the current code has accreted to defend against its own template (lines 358–396): a
country-stripping cap "never emit the full `Name in Place, Region, Country` chain that leaked in
**run_1d55f7c7**"; a `looksMalformed` check for residual `" - "` dumps, verb-bearing fields, and
run-ons; and a `buildSafeGroundingLead` field-free fallback. That is **three layers of guard around a
deterministic mutation whose entire job is to add a sentence the model didn't write** — a sentence
prepended *after* validation, so none of those guards are themselves validated against the prose
contract. The model wrote a clean opening; we decided it wasn't "grounded" enough by a regex signal
check, and bolted a synthesized sentence onto the front.

### 3.3 The pronoun sweep flipped correct pronouns

`applyDeterministicPronounSweep` ([line 2032](../../apps/worker/src/jobs/agents/agent9-run.ts)) does
cross-paragraph pronoun inheritance. On a split paragraph in **run_1d55f7c7**, that inheritance
**flipped an already-correct female pronoun run to male.** The model's output was correct; the
deterministic repair corrupted it.

The current mitigation is a "monotonic guard" (lines 2061–2077): count wrong-gender mismatches
before and after, and if the sweep *increased* them, discard the swept text. This is a good instinct
applied at the wrong layer — it's a *post-hoc consistency check on a deterministic mutation*, which is
exactly the validation-gated-mutation rule the system keeps re-discovering one bug at a time. But it
only catches the cases its own heuristic mismatch-counter can see; a flip that the counter scores as
neutral still ships. The honest assessment in the code comment says it all: *"if that ever recurs …
keeping the model's pronouns."* We are repairing the model's pronouns and then checking whether we
should have left them alone.

### 3.4 96% of token spend is prose retries

On a baseline run, **prose retries alone were ~96% of total token spend**
([`00_README.md:30`](00_README.md)). Three attempts per batch × many batches, where a large share of
those retries are triggered by *cosmetic* linter verdicts (repeated openers, n-gram overlap, opening
entropy) that have nothing to do with whether the mystery is correct or the prose is readable. Every
retry re-sends a large prompt — CML, outline, profiles, narrative state — to re-render text that was
fundamentally fine. The cost of the entire 15-agent pipeline is dominated by Agent 9 rewriting
acceptable prose to satisfy a regex.

### 3.5 Mutation without re-validation is the unifying defect

3.2 and 3.3 are the same bug wearing two costumes: **a deterministic pass mutated already-clean model
output and shipped it without re-running the validator it claimed to satisfy.** The grounding-lead
injector "satisfies" a grounding-signal check but is never re-checked for leakage. The pronoun sweep
"satisfies" pronoun consistency but (originally) was never re-checked for new mismatches. The release
gates run on the *post-mutation* text, but they check temporal/elimination/encoding properties — not
"did the grounding lead just dump location metadata into chapter 1's first line." There is no
universal law that says *no mutation ships unvalidated*, so we keep relearning it per-mutation, per-bug.

---

## 4. Blue-sky redesign

If I rebuilt Agent 9 from nothing, the renderer would be small, the contract would be precise, and
**no regex would ever judge prose or repair it.** Five moves.

### 4.1 The chapter is a CONTRACT, not a prompt

Today the prompt is a giant pile of context and the model is trusted to infer its obligations.
Instead, each chapter (or scene) receives an **exact, machine-checkable obligation set** derived
mechanically from CML + outline:

```yaml
chapter: 6
beat: "second interrogation — Marlowe's alibi cracks"
present: [Inspector Gray, Marlowe, Mrs. Penn]
location: Library
time_window: { from: "21:10", to: "21:40" }   # must not contradict the timeline
must_surface:
  - clue: C7   # the scorched blotter; reader must be able to USE it here
    as: "physically observed by the POV detective"
  - clue: C8   # Marlowe's contradicted timing
must_not_reveal:
  - solution.culprit
  - clue: C11  # the cipher — belongs to chapter 9
eliminations_allowed: [Mrs. Penn]   # may be cleared here; nobody else yet
forbidden_knowledge:
  - "no character may reference the cellar door before chapter 7"
```

This is generated, not authored — it falls straight out of the validated CML and the Agent 7 plan.
The obligation set is the **only** thing the chapter is checked against. "Did the prose satisfy the
contract?" replaces the grab-bag of `completeness`, `clue_timing`, `continuity`, and `fair_play`
retry families with **one** question against a **machine-checkable** spec. The model is told its
obligations explicitly and up front, in structured form, instead of being asked to reverse-engineer
them from a 40KB context blob.

This is where most of Agent 9's retry machinery *evaporates*: clue-timing and completeness retries
exist because the obligations were implicit and the model guessed wrong. Make them explicit and
checkable and the failure becomes rare and *legible* — "clue C7 not surfaced in chapter 6" is a
precise, fixable complaint, not a Jaccard score.

### 4.2 Validation-gated mutation as an absolute law — better, *no* deterministic prose mutation

The rule, stated as law: **no deterministic pass may alter prose and ship it without re-running the
validator it claims to satisfy and proving it broke nothing else.** That alone would have stopped the
grounding-lead leak and the pronoun flip cold.

But the stronger version is: **eliminate deterministic prose mutation entirely.** A regex is worse at
prose than the model that wrote it. So:

- **Grounding leads:** delete `buildDeterministicGroundingLead` and its three guard layers. If a
  chapter's opening is genuinely under-grounded, that's a *complaint to the model*: "Chapter 3 opens
  without anchoring the reader in place/time/sensory detail — rewrite the opening paragraph." The
  model writes a sentence that fits its own prose. No template, no field interpolation, no leak.
- **Pronoun sweeps:** delete `applyDeterministicPronounSweep`. Pronoun consistency is a *critique*:
  "paragraph 4 refers to Mrs. Penn as 'he'." The model fixes its own pronoun in context — it knows
  the antecedent better than a cross-paragraph inheritance heuristic ever will.
- **Locked-fact word forms, location normalization, title normalization:** the few mutations that are
  *genuinely deterministic and lossless* (e.g. "Chapter 6" → "Chapter 6: The Scorched Blotter" title
  formatting) can stay — but every one of them re-runs validation after mutating, no exceptions.

The default posture flips from *"the model is probably slightly wrong, let's patch it"* to *"the model
is probably right; if it isn't, tell it what's wrong and let it fix its own prose."*

### 4.3 An LLM critic + rewrite loop replaces the regex linters — with a guaranteed best-draft backstop

Retire `lint.ts`'s `template_bleed`, `opening_style_entropy`, `paragraph_fingerprint`, and
`ngram_overlap`. Replace the entire battery with a **model critic**: a separate, cheap LLM pass that
reads the draft and judges what regexes were *trying* to approximate — "do these chapters sound
samey? does every paragraph start the same way? is the voice consistent? is the pacing flat?" — and
emits **specific, located complaints**, which the writer model then addresses in a targeted rewrite.

The critic is *better* than the linter at the exact thing the linter exists for. `template_bleed`
fires on "Inspector Gray. Inspector Gray." but cannot tell that from a deliberate, effective
anaphora; the critic can. The critic never produces a verdict that is *cosmetically* wrong but
*hard-blocking*, because it doesn't block — it advises.

And the law that makes this safe: **a guaranteed accept-best-draft backstop.** A run can *never* die
with no story. The loop always retains the best-scored draft seen so far; if the critic+rewrite cycle
hits its budget without convergence, the pipeline **ships the best draft with a warning**, never
aborts. The opener-exhaustion bypass in `generate.ts:3089` was us inventing this principle by hand for
exactly one linter message string. The redesign makes it the *universal* terminal condition: critique
improves, the backstop guarantees a story.

**Before → after, concretely:**

| Defect (today) | Redesign behavior |
|---|---|
| `template_bleed` repeated-opener whack-a-mole burns 3 attempts, then (pre-ANALYSIS_44) aborts the run | Critic notes "ch.4 paragraphs 2 & 5 both open on the inspector's name"; one targeted rewrite; if still imperfect, ship best draft + warning |
| Grounding lead leaks `"Wynthorpe Manor - Library in …"` into ch.1 line 1 | No injector exists; if grounding is weak, critic asks for a rewritten opening; model writes prose, not a template |
| Pronoun sweep flips correct female pronouns to male (run_1d55f7c7) | No sweep exists; critic flags an actual mis-gendered pronoun if present; model fixes the one it knows is wrong |
| 96% of tokens on cosmetic retries | Most retries gone (contract makes obligations explicit; critic advises instead of hard-blocking); retries that remain are *substantive* |

### 4.4 Long context + global coherence vs per-chapter batching

The per-chapter batch + `NarrativeState` transfer architecture exists because older models couldn't
hold a whole novel in context. A frontier model with a **1M-token context** can. The blue-sky default:

> **Write the whole book in one coherent pass against the full contract set, then refine section-wise
> against critic complaints.** Trade dozens of brittle stateful handoffs (and the entire `NarrativeState`
> serialization/transfer surface, with its continuity-drift failure class) for one whole-draft pass
> plus targeted revision.

Global coherence stops being something we *reconstruct* via state transfer and becomes something the
model simply *has*, because chapter 9 was written with chapter 1 in its actual context, not a summary
of it. The `continuity` retry family — investigator-role drift, forgotten earlier details, contradicted
descriptions — largely dissolves: those are artifacts of the model writing chapter 9 having
"forgotten" chapter 1, which can't happen if both are in context.

Refinement stays section-wise so a critique about chapter 6 rewrites chapter 6, not the book —
cheaper, and it preserves the parts that already work. (Whether the whole book fits in one *output*
call is a token-budget question, not an architecture one; if output limits force segmentation, segment
the *write* but keep the *full prior text in context* for every segment — the opposite of today's
lossy state summary.)

### 4.5 Consume clean upstream contracts

Much of Agent 9's complexity is *importing upstream ambiguity.* The grounding-lead injector exists
because location profiles arrive as loosely-structured sensory bibles that may be malformed. The
clue-timing retry machinery exists because clues arrive without per-scene placement. If Agents 5 and 7
are redesigned to emit **precise per-scene obligations** — "clue C7 is observed by the detective in
chapter 6, described as X" — then Agent 9 *receives* the `must_surface`/`must_not_reveal` contract of
§4.1 instead of *deriving* it heuristically. The renderer gets simpler precisely because the planner
got more precise. Agent 9 should be the *easiest* agent to write, because it's the one with the least
left to decide.

---

## 5. Ripple effects on the rest of the pipeline

- **Agent 7 (Outliner)** becomes the contract author. Its output stops being a prose-y scene plan and
  becomes the structured `must_surface` / `must_not_reveal` / `present` / `eliminations_allowed`
  obligation set per chapter. Agent 9 consumes it verbatim.
- **Agent 5 (Clues)** must emit each clue's *scene placement* and a *prose-facing description* (the
  thing the reader can actually use), not just an ID. This kills Agent 9's `clue-validation.ts`
  semantic-anchor-fallback machinery — there's nothing to fuzzy-match if the placement is explicit.
- **Agent 2c (Location Profiles)** stops being consumed by a string-interpolating template. Either its
  output is structurally guaranteed (constrained decoding) so it *can't* be malformed, or — better,
  per the lazy-texture thesis — sensory texture is generated *in the scene that needs it*, in that
  scene's prose context, by the writer model itself. The grounding-lead injector and its
  `cleanLocationName` / `looksMalformed` guards disappear with it.
- **Agent 6 (Fair-Play Auditor)** and the prose blind-reader: fair-play stops being something we hope
  the prose preserves and re-audit at the end. The `must_not_reveal` contract is checked *as the prose
  is written*. The auditor verifies the *plan* is fair; the renderer is contractually forbidden from
  breaking it.
- **The release gates** shrink to the things that are genuinely terminal and genuinely deterministic
  (encoding corruption, a hard temporal contradiction the checker proves). Everything that's currently
  a release-gate *warning* because a deterministic patch might have caused it goes away with the patches.
- **Scoring/telemetry** (`agent9-scoring-adapter.ts`, `validationDetails`) gets dramatically smaller:
  no `linter` stats block, no `openingStyleEntropyBypasses`, no `retryPackets` convergence diagnostics
  for cosmetic classes. We keep contract-violation telemetry, which is the only kind worth keeping.

---

## 6. How we'd know it worked

Concrete, measurable success criteria — each maps directly to a shipped defect:

1. **Zero runs that die with no story.** The accept-best-draft backstop is a hard invariant. Any run
   that reaches Agent 9 produces a complete book, always. (Today's pre-ANALYSIS_44 hard-abort count
   should be structurally impossible, not merely patched for one message string.)
2. **Zero post-mutation corruption.** No grounding-lead leak, no pronoun flip — because the mutations
   that caused them no longer exist. Tracked as: zero "deterministic pass altered prose and degraded a
   contract property" events, enforced by the validation-gated-mutation law (any surviving mutation
   re-validates or it doesn't ship).
3. **Token-spend collapse.** Prose retries fall from ~96% of run spend to a target where cosmetic
   retries are *zero* and substantive retries (a genuine contract miss) are rare. Measure: tokens
   spent on retries / total prose tokens, and the share of retries triggered by cosmetic vs.
   contract-fidelity causes.
4. **Contract-fidelity = 100% at ship.** Every `must_surface` clue surfaced by its chapter; every
   `must_not_reveal` honored; every elimination at its planned beat. These are machine-checked, so
   this is a number we can put on a dashboard and hold at 100% as a release condition.
5. **Critic-judged quality ≥ linter-era quality.** Blind A/B of redesigned prose vs. shipped prose on
   variety/voice/pacing — the model critic should match or beat the regex linter on the very dimensions
   the linter approximated, with none of the false hard-blocks.
6. **File-size collapse as a proxy for conceptual collapse.** A 5,185-line runner and a 900KB prompt
   package are themselves a defect report. If the redesign can't render a pre-solved proof in an order
   of magnitude less code, it hasn't actually simplified the job — it's hidden the complexity.

---

## 7. Migration path

This is the highest-risk agent to rebuild (it's the one users actually read), so the path is
incremental and reversible — and the existing `AGENT9_REDESIGN_V1` flag proves we already know how to
canary this component.

1. **Make the contract explicit first, change nothing else.** Generate the §4.1 obligation set from
   the existing CML + Agent 7 output and *log* it alongside today's run. Validate that the obligations
   the system already enforces implicitly match the explicit contract. Pure observability; zero
   behavior change. This de-risks everything downstream.
2. **Adopt validation-gated mutation as law immediately.** This is a bug-fix, not a redesign: wrap
   every existing deterministic mutation (grounding lead, pronoun sweep, locked-fact repair) so it
   re-runs the relevant validator and *reverts on regression*. Cheap, ships now, and retroactively
   prevents the entire 3.2/3.3 defect class on the current architecture.
3. **Introduce the model critic in shadow mode.** Run the LLM critic *alongside* the regex linter;
   compare verdicts. Where the critic and linter disagree, the critic is almost always right about
   what matters — collect that evidence. Then promote the critic to primary and demote the linter to
   telemetry, then delete the linter.
4. **Install the accept-best-draft backstop universally.** Generalize the opener-exhaustion bypass
   from "one allowlisted message string" to "the loop always ships the best draft." This makes
   no-story-aborts impossible *before* the bigger architecture changes land — pure safety upside.
5. **Delete deterministic prose mutation.** Replace grounding-lead injection and pronoun sweep with
   critic complaints + model rewrite. By now the critic is trusted and the backstop is in place, so
   this is a deletion, not a rewrite.
6. **Switch to whole-book context with section-wise refinement**, behind a flag, canaried against the
   batched path on quality + token + fidelity metrics. Keep `NarrativeState` transfer alive until the
   whole-context path wins on all three.
7. **Tighten the upstream contracts (Agents 5/7)** so the obligation set arrives clean and Agent 9's
   derivation logic can be deleted rather than maintained. This is the step that makes Agent 9 *small*.

Each step is independently shippable, independently reversible, and each one *removes* defects from
the current system even if the next step never lands.

---

## 8. The pitch in one paragraph

Agent 9's job is the easiest in the pipeline — render a proof that's already been proven — and we
made it the largest, costliest, and most defect-prone component by trying to *judge prose with
regexes* and *repair prose with string edits*. The blue-sky rebuild inverts both mistakes: give each
chapter a precise, machine-checkable **contract** (which clues to surface, which beat, who's present,
what must stay hidden) derived straight from the validated CML and plan; make **fidelity** a checked
property and **quality** a model-critic's judgment; outlaw deterministic prose mutation so we can
*never again* break our own clean output; write the whole book in one coherent long-context pass and
refine it section-wise against specific critiques; and guarantee, as an absolute law, that the loop
**always ships the best draft** so a run can never die with no story while the report reads green. The
result is a renderer that's an order of magnitude smaller, spends a fraction of the tokens, and is
*incapable* of the three worst defects we've shipped — because the code that caused them no longer
exists.

---

## 9. Implementation Plan

> Turning §§1–8 into a build I can start this week: ship the safety laws that stop the shipped defects *first* (no upstream dependency), then collapse the architecture as the upstream contracts land.

### 9.1 Validate the approach first (de-risking spikes)

Before I delete a single line of the linter or the deterministic repairs, I prove the three load-bearing claims on *real shipped-defect data*. Each spike is cheap, needs **no upstream change**, and has an explicit falsification — if it fires, the plan changes, not the schedule.

- **Spike A — critic beats the regex linter.** Pull the corpus of chapters that historically tripped `template_bleed`'s repeated-opener check ([`lint.ts:264-292`](../../packages/prompts-llm/src/agent9-prose/lint.ts)) and the Group A/C checks ([`lint.ts:540-587`](../../packages/prompts-llm/src/agent9-prose/lint.ts)). Run a single cheap LLM critic pass over each; have it emit located complaints. Score: does the critic flag the *genuinely* samey openers and *pass* the deliberate-anaphora / one-off cases the regex hard-blocked?
  - **Falsified if:** the critic misses real repetition the regex caught, or flags clean prose at a rate worse than the regex's false-positive rate. Then the critic is not yet a linter replacement and §9.2's deletion of `lint.ts` is deferred.
- **Spike B — the best-draft backstop guarantees a story.** Build the minimal "retain best-scored draft; on budget exhaustion, ship it with a warning" wrapper around the *existing* batch loop. Replay the runs that historically hard-aborted on a cosmetic opener (the pre-ANALYSIS_44 class, §3.1). 
  - **Falsified if:** any replayed run still produces zero story, *or* the "best" draft selected is materially worse than a mid-loop draft (means my scoring function is wrong). Either kills the universal-backstop framing until the scorer is fixed.
- **Spike C — validation-gated mutation catches the real leaks.** Take the `run_1d55f7c7`-style fixtures: the grounding-lead metadata dump (§3.2) and the pronoun flip (§3.3). Wrap `buildDeterministicGroundingLead` ([`agent9-run.ts:349`](../../apps/worker/src/jobs/agents/agent9-run.ts)) and `applyDeterministicPronounSweep` ([`agent9-run.ts:2032`](../../apps/worker/src/jobs/agents/agent9-run.ts)) in a re-validate-and-revert harness. Confirm the harness *reverts* on exactly the cases that shipped corrupted.
  - **Falsified if:** the post-mutation validator can't actually distinguish the leaked/flipped output from clean output (means the contract property isn't machine-checkable yet, and the §4.2 law has nothing to enforce against — fix the checker before writing the wrapper).

All three spikes share one corpus and one replay rig (§9.4). If any fails, I learn it in days, not after a rewrite.

### 9.2 What gets built — and deleted (components & contracts)

The redesign is mostly **deletion**. The new surface is small and the law-enforcement wrapper is the keystone.

| Build | What it is | Replaces / enables |
|---|---|---|
| `ChapterObligationContract` type | The §4.1 structured `must_surface` / `must_not_reveal` / `present` / `time_window` / `eliminations_allowed` spec, one per chapter | The implicit "infer obligations from a 40KB blob" prompt; the `completeness` + `clue_timing` retry families |
| Validation-gated-mutation wrapper | A single `mutateThenValidate(prose, mutateFn, validator)` that runs the mutation, re-runs the named validator, and **reverts on any regression** | The per-bug monotonic guards ([`agent9-run.ts:2061-2077`](../../apps/worker/src/jobs/agents/agent9-run.ts)); the three guard layers in `buildDeterministicGroundingLead` |
| Best-draft backstop | The universal terminal condition: always retain the best-scored draft; ship it on budget exhaustion, never abort | The message-string-scoped `isOpenerOnlyFailure` allowlist ([`generate.ts:3096-3119`](../../packages/prompts-llm/src/agent9-prose/generate.ts)) and the sibling fingerprint/entropy bypasses |
| LLM critic + targeted rewrite loop | Cheap model pass emitting located complaints → writer addresses them in a scoped rewrite | The `template_bleed` / `opening_style_entropy` / `paragraph_fingerprint` / `ngram_overlap` battery in `lint.ts` |
| Whole-book coherence path | One long-context write against the full contract set, section-wise refinement | Per-chapter batching + the `NarrativeState` transfer surface + the `continuity` retry family |

**Deleted with real paths (the point of the exercise):**

- `buildDeterministicGroundingLead`, `buildSafeGroundingLead`, `cleanLocationName`, `getGroundingSignals`, and the call sites at [`agent9-run.ts:2201` / `:2209`](../../apps/worker/src/jobs/agents/agent9-run.ts). Under-grounding becomes a critic complaint, not a synthesized sentence prepended after validation.
- `applyDeterministicPronounSweep` and its monotonic-guard scaffolding ([`agent9-run.ts:2032-2097`](../../apps/worker/src/jobs/agents/agent9-run.ts)), plus the three call sites at [`:4181` / `:4245` / `:4540`](../../apps/worker/src/jobs/agents/agent9-run.ts). Pronoun errors become a located critique the model fixes in context.
- The cosmetic linter checks in [`lint.ts`](../../packages/prompts-llm/src/agent9-prose/lint.ts) (repeated-opener, Group A weather-preamble, Group C stock-phrase, n-gram, fingerprint, entropy) and the `classifyFailure` families that exist only to retry them (`template`, `tone_pacing`; `completeness` + `clue_timing` collapse into one contract-miss class).
- The exhaustion-bypass allowlist in [`generate.ts:3089-3129`](../../packages/prompts-llm/src/agent9-prose/generate.ts) — subsumed by the universal backstop.
- Once Agent 5 lands its placement contract: `clue-validation.ts`'s semantic-anchor-fallback machinery (nothing to fuzzy-match).

**Chapter I/O contract.** Agent 9 *consumes* `ChapterObligationContract[]` (from Agent 7's beat-grid + Agent 5's derived clue obligations) and *emits* `{ chapters: Chapter[], contractFidelity: FidelityReport, criticVerdicts: Verdict[] }`. No deterministic-mutation telemetry, no `linter` stats block, no `openerBypasses` counter — those telemetry fields ([`agent9-run.ts:3845-3899`](../../apps/worker/src/jobs/agents/agent9-run.ts)) shrink to contract-violation events only.

### 9.3 Dependencies & sequencing

Agent 9 is **downstream of almost everything**, so I split the plan by what each increment *needs* upstream. The safety wins need nothing; the architecture collapse needs the planners.

- **Phase A — Safety laws (no upstream dependency; ship now).** The validation-gated-mutation wrapper, the universal best-draft backstop, and the critic-in-shadow. These run on *today's* batched architecture, against *today's* CML, and each retroactively kills a shipped defect class (§3.1–§3.3) on its own. This is the bulk of the user-visible risk reduction and it depends on no other agent.
- **Phase B — Chapter-as-contract (needs Agents 5 & 7).** The `ChapterObligationContract` only becomes *clean input* once Agent 7 emits the structured beat-grid and Agent 5 emits per-scene clue placement + prose-facing descriptions. Until then I *derive* the contract from existing artifacts and **log it in shadow** (§7.1 of the redesign) to validate the derivation — zero behavior change. The keystone is **Agent 3's proven CML**, which already underwrites every obligation; Agents 5/7 only make the obligations *arrive pre-placed* instead of derived. Agent 2c's lazy sensory texture is a hook this plan *owns* — once it generates texture at prose time, the grounding-lead deletion is fully justified; Agent 2d's `TemporalAnchor` is *read*, never re-derived, to fill `time_window`.
- **Phase C — Whole-book coherence (needs B trusted).** Switch from per-chapter batching to one long-context write + section-wise refinement, behind a flag, canaried on quality + token + fidelity. `NarrativeState` transfer stays alive until the whole-context path wins on all three.

**Clear first increment:** Phase A's wrapper + backstop. It is a bug-fix wearing a redesign's clothes, ships against the current pipeline, and makes "a run dies with no story" *structurally* impossible before anything else lands.

### 9.4 Test & validation strategy

The plan is only credible if its invariants are *machine-enforced*, not asserted in prose.

- **Invariant 1 — No run finishes with zero story.** A pipeline-level assertion: any run reaching Agent 9 returns a complete book. Enforced by the backstop; tested by replaying every historical no-story-abort fixture and asserting non-empty, contract-complete output.
- **Invariant 2 — No deterministic pass ships text it didn't re-validate.** A unit-level guarantee on `mutateThenValidate`: every surviving mutation (locked-fact word forms, title normalization) re-runs its validator or it doesn't ship. Property test: inject a deliberately-corrupting mutation and assert it is reverted.
- **Regression goldens — replay the real shipped defects.** The `run_1d55f7c7` grounding-lead dump and pronoun flip, plus the ANALYSIS_44 opener-exhaustion abort, become permanent regression goldens. This extends the **existing prose benchmark replay (P4)** rather than building new harness; diff on *contract fidelity + blind-reader solvability*, not byte-for-byte prose.
- **Token-spend collapse — measure, don't hope.** Track `retry_tokens / total_prose_tokens` and the cosmetic-vs-substantive split of retries. Target from §6.3: cosmetic retries → **zero**, substantive retries rare. This is the headline metric (today: ~96% retry spend, [`00_README.md:30`](00_README.md)).
- **Critic non-inferiority — blind A/B.** Redesigned prose vs. shipped prose on variety/voice/pacing, judged blind. Promote the critic only when it is non-inferior to the linter era on the dimensions the linter approximated, with strictly fewer false hard-blocks.
- **Canary (P4).** Replay the golden/canary CML corpus through the new path in shadow; gate promotion on the metrics above.

### 9.5 Rollout & rollback

I reuse the canary machinery the codebase already proves works for this component.

- **Flag.** Extend the existing `AGENT9_REDESIGN_V1` env flag ([`agent9-run.ts:2784`](../../apps/worker/src/jobs/agents/agent9-run.ts)) and the `agent9_prose.rollout_flags` block ([`generate.ts:1957-1972`](../../packages/prompts-llm/src/agent9-prose/generate.ts)) with `mutation_revalidation_enabled`, `best_draft_backstop_enabled`, `critic_shadow_enabled`, `critic_primary_enabled`, and `whole_book_context_enabled`. Each Phase flips one flag.
- **Shadow the critic vs. the linter.** Run both, log every disagreement. Where they disagree, the critic is near-always right about what *matters*; collect that evidence before promoting the critic to primary and demoting the linter to telemetry, then deleting it (the §7.3 sequence).
- **Kill criteria (auto-rollback to flag-off).** Any run that ships text a re-validation would have reverted; any backstop ship whose best draft fails a *hard* contract property (a `must_not_reveal` leak — that is never cosmetic); critic false-block rate above the linter baseline during shadow; or a token/fidelity regression on the canary window. Because each Phase is one flag, rollback is a flip with zero data migration.
- **How the legacy path stays.** The batched `NarrativeState` path remains the default until Phase C wins on all three metrics; the deterministic mutations are *wrapped-then-deleted*, not deleted blind — Phase A leaves them in place behind the revalidation wrapper, and only §9.2's deletions remove them once the critic + backstop are trusted.

### 9.6 Open questions to resolve before coding

- **Does long-context whole-book actually beat per-chapter on coherence *and* cost?** Holding the full prior text in context for every segment is the opposite of today's lossy summary, but it inflates input tokens per segment. The §6.3 token-collapse win comes from killing *cosmetic retries*, not from the write topology — I need Phase C's canary to confirm whole-book is at worst token-neutral, or I keep batching and bank only the retry savings.
- **How does the critic avoid its own runaway loop?** The critic advises and the backstop guarantees termination, but an over-eager critic could burn budget chasing diminishing returns. I need a convergence/budget cap on the critic+rewrite cycle and a scoring function whose "best draft so far" is monotone enough that the backstop never ships a regression (the Spike B falsification).
- **How much upstream contract is needed before chapter-as-contract pays off?** Phase B's value is gated on Agents 5/7. If their structured output is delayed, derived-then-shadow-logged contracts still de-risk Phase B, but the `clue-validation.ts` deletion can't happen until Agent 5's placement is authoritative. I need to know the minimum Agent 5/7 contract that lets me delete derivation logic rather than maintain it.

### 9.7 "Ready to build" checklist

- [ ] Defect corpus assembled: `run_1d55f7c7` grounding-lead + pronoun fixtures, ANALYSIS_44 opener-abort fixture, `template_bleed` repeated-opener chapter set.
- [ ] Spikes A/B/C run with explicit pass/fail recorded against their falsification criteria (§9.1).
- [ ] `mutateThenValidate` wrapper specified with a named validator per mutation; revert-on-regression property test written.
- [ ] Best-draft scoring function defined and proven monotone enough for the backstop (Spike B).
- [ ] `ChapterObligationContract` type drafted from existing CML + Agent 7 output; shadow-logged against today's implicit enforcement.
- [ ] New rollout flags added to `AGENT9_REDESIGN_V1` / `rollout_flags`; kill criteria wired to canary telemetry.

**First task / PR:** Land the **validation-gated-mutation wrapper + universal best-draft backstop** (Phase A, §9.3) behind `mutation_revalidation_enabled` + `best_draft_backstop_enabled`, with the §3.2/§3.3/§3.1 fixtures as regression goldens. This makes "a run dies with no story" and "a deterministic pass corrupts clean prose" structurally impossible on the *current* architecture — the highest-value, lowest-risk increment, and the foundation everything else deletes onto.
