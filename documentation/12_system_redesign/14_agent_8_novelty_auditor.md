# Agent 8 — Novelty Auditor: A Ground-Up Redesign

> Stop auditing novelty after the fact with magic numbers. Make novelty a constraint the generator obeys by construction — checked cheaply at the skeleton stage, guarding against the seeds, the genre's clichés, and our own past output.

This is my (Claude's) opinionated redesign of Agent 8. I read the current implementation, the config, and the orchestration that drives it before writing a word; section 2 says exactly where each fact came from. The vision in sections 4–8 is mine.

## 1. The job to be done

The pipeline ships with a SEED CML library ([`examples/`](../../examples/) — fifteen public-domain whodunits: *The Moonstone*, *The Mysterious Affair at Styles*, *Trent's Last Case*, *The Big Bow Mystery*, and so on). Those seeds are **structural inspiration only** — the system must never reproduce one. Agent 8 is the guard that enforces this.

The *actual* job is broader than "don't copy a seed." A fair-play whodunit generator that runs hundreds of times has three distinct novelty failure modes, and only the first is about the seeds:

1. **Seed echo** — the generated CML is structurally a paraphrase of *The Moonstone* (same axis, same false-assumption pattern, same discriminating test).
2. **Genre cliché** — the CML reaches for a tired trope that is *not* in any seed: the butler did it, the twin switch, the secret-will motive, the "it was all staged" reveal. The seeds don't contain these, so a seed-only check is blind to them.
3. **Cross-run mode collapse** — run #200 quietly resembles run #50. No single seed is matched, but the *system* has a house style and keeps producing the same kind of case. This is invisible to any check that only looks at the seeds.

A real novelty auditor protects against all three. The current one protects against (at most) the first — and, as section 2 shows, in production it protects against nothing at all.

## 2. How it works today

**Where I found it.** There is no `apps/worker/src/jobs/agents/agent8-run.ts`. The novelty audit is a prompt builder plus a deterministic scorer in [`packages/prompts-llm/src/agent8-novelty.ts`](../../packages/prompts-llm/src/agent8-novelty.ts), invoked from inside Agent 3's runner — [`apps/worker/src/jobs/agents/agent3-run.ts`](../../apps/worker/src/jobs/agents/agent3-run.ts), in the block beginning `// ── Agent 8: Novelty Audit`. Config types and defaults live in [`packages/story-validation/src/generation-params.ts`](../../packages/story-validation/src/generation-params.ts) (`Agent8NoveltyConfig`, `agent8_novelty`), and the live values ship in [`apps/worker/config/generation-params.yaml`](../../apps/worker/config/generation-params.yaml).

**The flow.** After Agent 3 generates and Agent 4 revises a full CML, `auditNovelty()` builds a three-part prompt (system + developer + user), summarizes the generated CML and every seed into a compact text block (`summarizeCML`), and asks an LLM at `temperature 0.3`, `max_tokens 2500`, JSON mode, to score similarity across five weighted dimensions. The model's numbers are then **re-normalized deterministically** in code: each dimension is clamped to `[0,1]`, `overallSimilarity` is recomputed from the configured weights (the model's own overall is discarded), the highest-similarity seed wins, and `status` is recalculated from threshold logic — the LLM's verdict is advisory; the math is authoritative.

**The weights and thresholds** (`agent8_novelty.params` in the YAML):

```yaml
thresholds:
  similarity_threshold_default: 1.1   # ← above 1.0
  fail_delta: 0.1
weighting:
  plot: 0.3
  character: 0.25
  setting: 0.15
  solution: 0.25
  structural: 0.05
```

**On `fail`,** Agent 3 regenerates the CML once with strengthened divergence constraints assembled from the prior `violations` / `warnings` / `recommendations` / `mostSimilarSeed`, then re-audits. After that, policy: `NOVELTY_HARD_FAIL=true` aborts, otherwise the `fail` is downgraded to a warning and the run continues.

**The detail that matters most.** `agent3-run.ts` computes `shouldSkipNovelty = skipNoveltyCheck || similarityThreshold >= 1`, and the shipped default is `1.1`. The auditor *also* defends itself: in `agent8-novelty.ts`, a configured threshold that is not `> 0 && < 1` collapses back to `0.9`. So the live config disables the audit entirely (`1.1 >= 1` → skip), while the prompt builder would silently treat the same `1.1` as `0.9` if it ever ran. **Today, the most expensive novelty machinery in the pipeline is dark code.** That is the single most important fact about Agent 8 as it stands.

## 3. Where it hurts

**(a) It is a post-hoc gate on the most expensive artifact.** The audit runs *after* a full CML has been generated (Agent 3, `temp 0.7`, `max_tokens 8000`) and revised (Agent 4, up to 5 attempts at `max_tokens 8000`). If it fails, the remedy is to throw that work away and regenerate the *whole* CML — again at full cost — then re-audit. We pay for the most elaborate possible artifact and only *then* ask whether the idea was novel. Novelty is a property of the *idea* (axis + mechanism + false-assumption shape), which is fixed long before the CML is fleshed out. Checking it at the end is checking it at the most expensive possible moment.

**(b) The numbers are unprincipled.** A `similarity_threshold_default` of `1.1` cannot be a real threshold — similarity is in `[0,1]`, so `1.1` is unreachable and the gate can never fire. It's a soft "off" switch wearing a number's clothes. `fail_delta: 0.1` is a fudge with no derivation. The weights `0.3 / 0.25 / 0.15 / 0.25 / 0.05` look authoritative but I can find no calibration behind them — no dataset of human "too similar / fine" judgments they were fit to. And `structural: 0.05` quietly says structure barely matters to novelty, which is backwards for a system whose entire premise is that **structure is what carries a mystery's identity.** Worse, the model is asked to emit five fine-grained decimals (`plotSimilarity: 0.55`, `characterSimilarity: 0.70`…) that the code then re-weights — false precision on top of a guess.

**(c) Seed-only blindness.** Similarity is measured *exclusively* against the seed set. It cannot see genre clichés that aren't in the seeds (the butler, the twin, the will), and it has no memory of prior runs, so it cannot detect the system converging on a house style across hundreds of generations. The two novelty failures a *shipping* system will actually hit at scale — cliché and mode collapse — are precisely the two this design cannot detect.

**(d) It rates surface, not structure.** `summarizeCML` extracts names, eras, crime descriptions, motive strings. The model is then nudged toward catching "same or similar character names," "same era + location." But name and era collisions are trivial to avoid and trivial to fix; they are not where novelty lives. Two cases can share zero names and one be a structural clone of the other (same axis, same false assumption, same discriminating-test family). The thing we most need to detect is the thing the summary most obscures.

## 4. Blue-sky redesign

If I rebuilt this from scratch for Claude Opus 4.8 (`claude-opus-4-8`, 1M context, $5/$25 per MTok, native structured outputs and tool use, prompt caching at ~0.1× read cost), I would stop thinking of Agent 8 as a *gate* and start thinking of it as **a novelty budget the whole front of the pipeline is built to satisfy.** Five moves.

### 4.1 Novelty as a generation-time constraint

The cheapest rejected idea is the one never elaborated. Instead of letting Agent 1–3 invent freely and then policing the result, I distill the seed library — once — into an **abstract "do-not-reproduce" ledger** and hand it to the generator *as an input constraint*.

A one-time offline pass reads every seed and emits, per seed, an abstract structural fingerprint — *not* surface text:

- **primary axis** (temporal / spatial / identity / epistemic …)
- **mechanism family** (locked-room-by-key, alibi-fabrication, impersonation, poison-substitution …)
- **false-assumption pattern** (the reader's load-bearing wrong belief: "locked room ⇒ suicide," "the body's identity is what it appears")
- **discriminating-test shape** (how the truth is finally forced: physical trace, timetable contradiction, behavioral tell)
- **inference shape** (the skeleton of the deduction, abstracted away from props)

This ledger is small, stable, and **cached** (Opus 4.8 prompt caching makes re-sending it on every run nearly free — well above the 4096-token minimum cacheable prefix). The Era/Setting and CML agents receive it framed as: *"These abstract patterns are already taken. Produce something whose axis + mechanism + false-assumption shape is not a member of this set."* Novelty becomes a property the generator is steering toward from token one, not a verdict imposed at the end. The constraint is also far more legible than a regenerate-with-violations retry, because it names the *abstract* thing to avoid, not the surface symptom.

### 4.2 Check at the cheap structural-skeleton stage, not on the full CML

I would insert novelty's *first* checkpoint before the full CML exists — on a **structural skeleton**: a tiny JSON object carrying exactly the five fingerprint fields above (axis, mechanism family, false-assumption pattern, discriminating-test shape, inference shape) plus a one-line premise. That object is a few hundred tokens, not 8000.

Novelty is decided on the skeleton. If the skeleton is too close to a seed (or a cliché, or a prior run — see below), we regenerate *the skeleton* — cheap — and only elaborate into a full CML once the skeleton has cleared. The expensive Agent 3/4 work runs **on an idea already known to be novel.** This is the single biggest cost win in the redesign: the reject-and-retry loop moves from "throw away an 8000-token CML" to "throw away a 300-token skeleton."

### 4.3 A semantic structural-similarity signal, not a name-matcher

The comparison should be over the *abstract structure*, and there are two honest ways to do it. I'd use both, in a cheap-to-expensive cascade:

1. **Embedding pre-filter (deterministic, fast).** Embed each seed/cliché/prior fingerprint and the candidate fingerprint, and take cosine similarity over the *abstract* fields. The first-party Claude API has no embeddings endpoint (and `tiktoken` is the wrong tokenizer for Claude — use `count_tokens` for sizing), so this leg uses an external embedding model or a feature-hashed structural vector; it is a coarse, free triage that flags "suspiciously close to *something*."

2. **LLM structural judge (only on the candidates the pre-filter flags).** For anything the pre-filter rates near a neighbor, Opus 4.8 makes a single structured-output judgment: *given these two abstract structures, are they the same mystery wearing different clothes?* — returning a small enum (`distinct` / `variation` / `clone`) plus the specific shared structural element, via `output_config.format` so it's schema-valid by construction (no JSON-parse-or-throw). This is reasoning about *inference shape*, which is exactly what Opus 4.8 is good at and exactly what cosine-over-surface-text misses.

The judge runs on a handful of flagged neighbors, not the whole library every time, so it's cheap. And it judges *sameness of structure*, not *decimal of surface overlap* — which is the actual question.

### 4.4 Cliché and cross-run guards as first-class corpora

The seed library is one of **three** things to diverge from. I'd give the auditor two more corpora, treated identically to the seeds:

- **A genre-cliché ledger** — a curated, human-readable list of fair-play tropes that are *not* in the seeds but the model will reach for anyway: butler-did-it, evil twin / impersonation-as-twist, secret-will / surprise-heir motive, "the detective did it," "it was staged," séance-fakery. Each entry is one abstract fingerprint, in the same shape as a seed fingerprint. The skeleton check runs against this ledger too. When the model proposes the butler, we catch it at the skeleton stage and tell it *why* and *what abstract pattern to avoid* — for free.

- **A cross-run novelty store** — every *shipped* skeleton's fingerprint, appended to a small persistent store keyed by axis + mechanism family. Each new skeleton is checked against the last *N* shipped runs. If run #200's skeleton collides with run #50's, we catch mode collapse the moment it starts, not never. This is the guard the current design structurally cannot have, because it only ever looks at the static seed set. The store is append-only, tiny (one fingerprint per run), and itself becomes part of the cached "already-taken" context.

With these, "novelty" finally means what a reader means by it: *not like the classics, not like the clichés, and not like the last twenty things this system made.*

### 4.5 An explainable report that replaces the magic numbers

I would delete `similarity_threshold_default: 1.1`, `fail_delta: 0.1`, and the five-way weight vector outright, and replace the numeric verdict with a **structured, explainable novelty report**:

```json
{
  "verdict": "distinct | variation | clone",
  "nearest": { "corpus": "seed|cliche|prior_run", "id": "the_moonstone",
               "relation": "shares false-assumption pattern 'locked-room ⇒ suicide'" },
  "shared_structure": ["false_assumption_pattern", "discriminating_test_shape"],
  "divergence_directive": "Keep the spatial axis but change the false assumption: the room is not the puzzle — the timeline is."
}
```

The decision is a **typed verdict the model reasons its way to**, not a weighted average crossing an arbitrary line. `clone` ⇒ regenerate the skeleton with the `divergence_directive` as an explicit constraint. `variation` ⇒ allowed, but logged with its nearest neighbor so a human can audit drift. `distinct` ⇒ proceed. If we ever *do* want a tunable knob, it's one honest, nameable thing — "how many shared structural axes before we call it a variation" — a small integer with an obvious meaning, calibrated against a handful of human "too similar / fine" labels, not five opaque decimals summing to 1.0 by coincidence. Every decision now carries its reason, which is what makes it trustworthy and tunable instead of a black box that happens to be switched off.

### 4.6 Concrete example

*Skeleton proposed by the generator:* axis = **spatial**; mechanism = **locked-room-by-spare-key**; false-assumption = **"locked room ⇒ suicide"**; discriminating test = **physical trace (left-handed bloodstain)**; premise = "Lord stabbed in a locked study at thirteen-to-midnight."

- **Seed check:** the embedding pre-filter flags *The Moonstone* and *The Big Bow Mystery* as near neighbors. The LLM judge inspects the abstract structures and returns `variation` against *The Big Bow Mystery* — **shared false-assumption pattern** "locked room ⇒ self-inflicted." Relation logged.
- **Cliché check:** mechanism = spare-key-relock is on the cliché ledger ("locked room undone by a duplicate key"). Verdict escalates to `clone`.
- **Report:** `divergence_directive: "Keep the locked room as a red herring, but the room must not be the lock on the truth — make the false assumption about *when*, not *where*. Drop the spare-key relock; it's a genre cliché."*
- **Outcome:** the **skeleton** is regenerated (cheap) with that directive. The generator returns a temporal-axis idea where the locked room is incidental and the real false assumption is a misread timetable. *That* skeleton clears all three corpora, and only then does Agent 3 spend 8000 tokens elaborating it. No full CML was ever wasted.

Compare today: this same case would generate a complete CML and a complete Agent-4 revision first, *then* (if the gate weren't disabled) score `0.62` against *The Moonstone*, pass the `0.9` bar, and ship — the spare-key cliché entirely undetected, because it isn't in the seeds.

## 5. Ripple effects on the rest of the pipeline

- **Agent 1 (Era&Setting) and Agent 3 (CML)** gain the abstract "do-not-reproduce" ledger as a cached input. They produce more novel structures by construction, which means **fewer regenerations downstream** — the cost saving compounds.
- **A new cheap skeleton stage** appears between cast/setting and full CML generation. It's small and fast, and it's where the novelty decision now lives. Agent 3 stops owning the novelty audit; it just receives a pre-cleared skeleton.
- **Agent 3's regeneration loop shrinks dramatically.** The expensive "regenerate the whole CML on novelty fail" path largely disappears, replaced by "regenerate the cheap skeleton." Agent 3's retry budget can be re-pointed at *logical* failures (Agent 4 validation) rather than novelty.
- **A persistent cross-run store** is introduced — one fingerprint appended per shipped run. New infrastructure, but tiny, and it's what finally lets the system measure its own diversity over time.
- **The seed library ([`examples/`](../../examples/)) gains a derived artifact:** the abstract fingerprint ledger, regenerated only when seeds change. The raw YAML seeds stop being shoved through `summarizeCML` on every run.
- **Reporting** changes from a similarity decimal to an explainable verdict with a nearest-neighbor and a reason — better signal for the run report and for any human reviewing drift.

## 6. How we'd know it worked

- **The gate is actually on.** The threshold is no longer `1.1`; the audit runs on every generation. (Step zero: today it is dark.)
- **Cost per rejected idea drops by ~25×** — measured as tokens spent before a too-similar idea is caught. A flagged skeleton is a few hundred tokens; a flagged full CML is the 8000-token Agent-3 artifact plus its Agent-4 revisions.
- **Cliché catch rate > 0.** Seed an eval set with deliberate clichés (butler, twin, secret will) and confirm the skeleton check flags them — something the current seed-only design catches *none* of, by construction.
- **Cross-run diversity stays flat or rises over a long batch.** Generate 200 cases; measure pairwise structural similarity across the *outputs* (axis × mechanism-family distribution entropy). The current system has no way to even observe this; the redesign should keep the distribution from collapsing.
- **Every ship decision carries a reason.** 100% of novelty verdicts have a nearest-neighbor and a named shared-structure list. Zero unexplained numeric rejections.
- **Human agreement.** On a labeled sample of "too similar / fine," the `distinct/variation/clone` verdict should track human judgment better than the old weighted score did — and we can actually measure that now, because the verdict is categorical and explained.

## 7. Migration path

1. **Turn the light on, safely.** First, decouple "is the audit enabled" from a magic threshold. Today `similarity_threshold >= 1` doubles as the off-switch *and* the threshold. Add an explicit `enabled` flag so we can run the existing audit in **shadow mode** (log the verdict, don't act) without it aborting runs. This immediately tells us what the current audit *would* say — data we don't have today.
2. **Build the fingerprint ledger.** Offline pass over [`examples/`](../../examples/) → abstract fingerprints (axis, mechanism family, false-assumption pattern, discriminating-test shape, inference shape). Pure derived artifact; no pipeline change yet.
3. **Add the skeleton stage in shadow.** Have Agent 3 emit the skeleton fingerprint *before* full generation and log it, without yet gating on it. Validate that the skeleton's fields are stable and that the embedding pre-filter + LLM judge produce sane neighbors.
4. **Flip the skeleton check to active** for `clone` verdicts only (the high-confidence ones), regenerating the skeleton. Keep `variation` as log-only at first.
5. **Introduce the cliché ledger and cross-run store** as additional corpora once the seed path is trusted.
6. **Delete the dead numbers.** Remove `similarity_threshold_default`, `fail_delta`, and the five-way weight vector from config and from `auditNovelty()`'s deterministic re-scoring. Replace the `Agent8NoveltyConfig` shape with the verdict/threshold-integer shape. Update `agent3-run.ts` to consume the verdict instead of `highestSimilarity`.
7. **Keep the regeneration hook, change its trigger.** Agent 3 already knows how to regenerate-with-constraints on novelty fail; re-point that machinery from "full-CML regenerate on numeric fail" to "skeleton regenerate on `clone` verdict." The orchestration scaffolding is reused; only what it acts on changes.

Each step is independently shippable and observable, and step 1 alone is worth doing tomorrow regardless of the rest.

## 8. The pitch in one paragraph

Agent 8 today is an expensive, seed-only, magic-number gate that runs *after* the costliest artifact in the pipeline is already built — and in production it's switched off by a threshold of `1.1` that can never fire. I'd replace it with novelty as a **generation-time constraint**: distill the seeds into an abstract "do-not-reproduce" ledger, hand it to the generator up front, and check novelty on a cheap **structural skeleton** before any full CML is elaborated — comparing *abstract structure* (axis, mechanism family, false-assumption pattern, inference shape) with a fast embedding pre-filter and a precise Opus 4.8 structural judge, against not just the seeds but a **genre-cliché ledger** and a **cross-run store** of everything we've already shipped. The output is an explainable verdict — `distinct / variation / clone` with a named nearest neighbor and a concrete divergence directive — not a weighted decimal crossing an arbitrary line. Novelty stops being a late, blind, dark tax and becomes a cheap, sighted property the system is built to satisfy.

## 9. Implementation Plan

> Sections 1–8 are the vision; this is how I'd actually land it without breaking a live pipeline — and the very first move is to stop the audit from being dark code.

### 9.1 Validate the approach first (de-risking spikes)

I won't write a line of the new architecture until three cheap spikes have de-risked it. **The first one is not optional and not new code — it's confirming the bug.**

1. **Baseline spike: prove the audit is off, then turn it on in shadow.** Today [`agent3-run.ts`](../../apps/worker/src/jobs/agents/agent3-run.ts) computes `shouldSkipNovelty = Boolean(ctx.inputs.skipNoveltyCheck) || similarityThreshold >= 1` (line ~257), and the live [`generation-params.yaml`](../../apps/worker/config/generation-params.yaml) ships `similarity_threshold_default: 1.1`. Note `1.1` is even clamped to `1.0` by `clampNumber(..., 0, 1)` in [`generation-params.ts`](../../packages/story-validation/src/generation-params.ts) (line ~1155) — and `1.0 >= 1` still skips. Meanwhile [`agent8-novelty.ts`](../../packages/prompts-llm/src/agent8-novelty.ts) (lines ~77–80) silently rewrites any threshold outside `(0,1)` back to `0.9`, and its own math (line ~418) hard-codes `if (similarityThreshold >= 1) status = "pass"`. The spike: drop the threshold to a real value (e.g. `0.85`) on a scratch config, run ~10 generations, and confirm `auditNovelty` actually fires and produces verdicts. **Output: a one-page note of what the existing audit *would have said* on real runs — data we have never collected.** This is worth a day on its own.
2. **Abstract-structure extraction spike.** Hand Opus 4.8 a handful of seed CMLs and ask it (structured output) to emit the five-field fingerprint — axis, mechanism family, false-assumption pattern, discriminating-test shape, inference shape. Then hand it a *skeleton* (the same five fields + a one-line premise, a few hundred tokens) for a candidate idea. Confirm the fields are stable across reruns and that two humans agree the extracted axis/mechanism are right. **Falsification: if extraction is noisy (same seed → different axis on rerun), the whole skeleton-stage premise collapses and I stop here.**
3. **Clone-caught-at-skeleton spike (the money shot).** Take a known seed (say *The Big Bow Mystery*), write a deliberate structural paraphrase of it as a *skeleton only*, and run the abstract-structure compare against the seed fingerprints. **The spike succeeds iff the clone is flagged from the skeleton alone, before any 8000-token elaboration. Falsification: if the abstract features can't separate that planted clone from a genuinely `distinct` skeleton, embeddings-over-structure is the wrong signal and I escalate to the LLM judge earlier (or rethink the feature set) before building anything.**

If spike 1 doesn't reproduce the dark-code behavior, my model of the system is wrong and everything downstream is suspect — so it runs first.

### 9.2 What gets built — and deleted (components & contracts)

**Built (new):**

| Component | Home (proposed) | Contract |
|---|---|---|
| **Abstract-pattern extractor** | `packages/prompts-llm/src/novelty/fingerprint.ts` | `extractFingerprint(cmlOrSkeleton) → Fingerprint` (the five abstract fields; structured output, schema-valid by construction) |
| **Abstract-pattern ledger** | derived artifact, e.g. `examples/.fingerprints.json` (regenerated when seeds change) | `Fingerprint[]` over the 14 seed CMLs in [`examples/`](../../examples/) (`*_cml2.yaml`) + a hand-authored **genre-cliché ledger** (`packages/prompts-llm/data/cliche-ledger.yaml`) in the same `Fingerprint` shape |
| **Cross-run store** | new shared infra, append-only (file/KV keyed by `axis + mechanism_family`) | `appendShipped(fingerprint)` / `recentShipped(N) → Fingerprint[]`; one row per shipped run |
| **Skeleton-stage gate** | `packages/prompts-llm/src/novelty/skeleton-gate.ts` | `judgeNovelty(skeleton, ledger, store) → NoveltyVerdict`; embedding pre-filter → Opus 4.8 structural judge on flagged neighbors only |
| **Explainable verdict** | the `NoveltyVerdict` type | `{ verdict: "distinct"|"variation"|"clone", nearest: {corpus,id,relation}, shared_structure: string[], divergence_directive: string }` (P2 structured output) |
| **Generation-time constraint** | the ledger, injected into Agent 1/3 prompts (cached) | "These abstract patterns are taken; don't reproduce their axis + mechanism + false-assumption shape." |

**Deleted (with real paths):**

- `similarity_threshold_default` and `fail_delta` from [`generation-params.ts`](../../packages/story-validation/src/generation-params.ts) (`Agent8NoveltyConfig.params.thresholds`, defaults at line ~510) and from [`generation-params.yaml`](../../apps/worker/config/generation-params.yaml) — the `1.1` magic number dies here.
- The five-way `weighting` vector (`plot/character/setting/setting/solution/structural`) from both the config type and `auditNovelty()`'s deterministic `computeOverallSimilarity`/`clamp` re-scoring ([`agent8-novelty.ts`](../../packages/prompts-llm/src/agent8-novelty.ts) lines ~368–415).
- The self-defending clamp at lines ~77–80 of `agent8-novelty.ts` (the disagreeing `→ 0.9` rewrite) and the `if (similarityThreshold >= 1)` short-circuit at line ~418 — both vanish because the verdict is categorical, not a thresholded decimal.
- The **post-hoc full-CML regenerate-and-re-audit** path in [`agent3-run.ts`](../../apps/worker/src/jobs/agents/agent3-run.ts) (the `runNoveltyAudit(candidate)` retry on full CMLs) — replaced by cheap skeleton regeneration upstream.
- `summarizeCML` (the surface-text name/era extractor) and `NoveltyAuditResult.similarityScores` go away; nothing downstream should read `highestSimilarity` anymore.

**Contract that holds the line:** Agent 3 stops *owning* novelty. It receives a pre-cleared skeleton and a `divergence_directive` and elaborates; it never sees a similarity decimal again.

### 9.3 Dependencies & sequencing

**Keystone = Agent 3.** Everything hinges on Agent 3 gaining a *staged* generation: emit the cheap skeleton fingerprint first, gate on it, then elaborate the full CML only on a cleared skeleton. The do-not-reproduce ledger is fed *into* Agent 1/3 generation as a cached constraint, and **Agent 3b (device library) is itself a novelty lever** — mechanism-family diversity in the device library directly widens the space of `distinct` skeletons, so the cliché ledger and 3b should share a vocabulary of mechanism families.

Shared-platform dependencies: **P1 typed CML core** (the abstract structural skeleton is a typed sub-object that lives here); **P2 structured-output infra** (the `NoveltyVerdict` and `Fingerprint` come back schema-valid, killing the JSON-parse-or-throw in `auditNovelty`); the **new abstract-pattern ledger + cross-run store** I spec above; **P4 golden/canary replay** for regression.

**Ordered phases:**

1. **P0 — Turn the light on (no new arch).** Add an explicit `enabled` flag decoupled from the threshold; run today's audit in **shadow** (log verdict, never abort). Ships independently, gives us baseline data. *This is the first increment.*
2. **P1 — Ledger.** Offline extractor over the 14 seeds → `Fingerprint[]`. Pure derived artifact; no pipeline change.
3. **P2 — Skeleton stage in shadow.** Agent 3 emits the skeleton fingerprint before full generation; log neighbors from embedding pre-filter + LLM judge; don't gate yet.
4. **P3 — Activate on `clone` only.** Regenerate the *skeleton* on `clone`; `variation` stays log-only.
5. **P4 — Add cliché ledger + cross-run store** as additional corpora once the seed path is trusted.
6. **P5 — Delete the dead numbers** (9.2) and re-point Agent 3's regen hook from full-CML to skeleton.

**First increment:** P0 — the `enabled` flag + shadow mode. It requires *no* new architecture, is independently shippable, and finally collects the data the dark code has been hiding.

### 9.4 Test & validation strategy

- **Invariant (the load-bearing test): a seed-clone skeleton is ALWAYS flagged before elaboration.** Golden test: for each of the 14 seeds, feed its own fingerprint back as a candidate skeleton → must return `clone`/`variation`, never `distinct`, and must do so without any full-CML generation occurring (assert the elaborate step never ran).
- **Cliché ledger catches the canon.** A fixture set of deliberate clichés — butler-did-it, evil-twin/impersonation, secret-will/surprise-heir, "the detective did it," "it was staged," séance-fakery — each must be flagged at the skeleton stage. Today's seed-only design catches *zero* of these; the test asserts `> 0`, ideally all.
- **Cross-run repetition detected.** Append N near-identical shipped fingerprints to the store, then submit an N+1th collider → must flag mode collapse against a prior run, not just a seed.
- **Verdict is explainable.** Schema test: every `NoveltyVerdict` has a non-empty `nearest`, `shared_structure`, and `divergence_directive`. Zero unexplained rejections — assert no decision is a bare number.
- **Determinism floor.** Re-extracting a fixed seed's fingerprint twice yields the same axis + mechanism family (the spike-2 invariant, promoted to a CI test).
- **Canary (P4 harness):** replay a frozen set of historical runs through the new path; alert if the verdict distribution shifts unexpectedly or if a previously-shipped run now reads `clone` (signals over-aggressive judging).

### 9.5 Rollout & rollback

- **Flag:** `NOVELTY_MODE = off | shadow | active` (env + config). `off` = today's behavior, `shadow` = log verdicts without acting, `active` = gate on `clone`. Default ships at `shadow`.
- **Shadow first:** run both the generation-time constraint (ledger in the prompt) and the skeleton check in shadow for a full batch; compare logged verdicts against any human spot-checks before flipping to `active`.
- **Re-enable a *working* gate:** the rollback target is not "the old `1.1` gate" — that gate never worked. `active` mode with `clone`-only gating is the first genuinely-on novelty check the system has had.
- **Rollback:** flip `NOVELTY_MODE=shadow` (or `off`) — instant, config-only, no redeploy of generation logic. The skeleton stage still *emits* its fingerprint for the cross-run store even in shadow, so we keep collecting diversity data while gating is off.
- **Kill criteria:** if `active` mode raises the full-pipeline regeneration rate instead of lowering it, or if canary shows previously-good runs flipping to `clone` at > a small rate, revert to `shadow` and treat it as a judge-calibration bug.

### 9.6 Open questions to resolve before coding

- **What abstract features define "structure"?** The five fields (axis, mechanism family, false-assumption pattern, discriminating-test shape, inference shape) are my proposal — but are they *separable and sufficient*? Spike 2 must validate that they don't collapse into each other and that they actually carry a mystery's identity.
- **How do we seed the cliché ledger?** Hand-author the first dozen tropes, or mine them from a corpus? Hand-authored is honest and auditable; I lean that way for v1, but who owns curation and how it grows is open.
- **Cross-run store retention & scope.** All-time, or a rolling window of the last N shipped runs? Per-project or global? Append-only is clear; *what we compare against* (and how old fingerprints age out so the system can legitimately revisit an axis later) is not.
- **Embeddings vs LLM compare, where exactly?** The Claude API has no embeddings endpoint, so the pre-filter needs an external embedding model or a feature-hashed structural vector. Spike 3 decides whether the cheap pre-filter is good enough to triage, or whether we just run the Opus 4.8 structural judge against all ~14 seeds + cliché ledger directly (small N — it may be cheap enough to skip embeddings entirely).
- **Where does the skeleton physically live** in Agent 3's staged flow, and what's the contract if elaboration later *drifts* from the cleared skeleton (does the full CML get re-fingerprinted)?

### 9.7 "Ready to build" checklist

- [ ] Spike 1 done: reproduced the dark-code skip on the live config and captured baseline "what the audit would say" data.
- [ ] Spike 2 done: fingerprint extraction validated as stable on seeds.
- [ ] Spike 3 done: a planted seed-clone skeleton is caught pre-elaboration.
- [ ] `Fingerprint` and `NoveltyVerdict` schemas agreed (P1/P2).
- [ ] Cliché-ledger curation owner named; first dozen tropes drafted.
- [ ] Cross-run store retention/scope decided (9.6).
- [ ] `NOVELTY_MODE` flag spec'd; default `shadow`.
- [ ] Deletion list (9.2) reviewed so nothing downstream still reads `highestSimilarity`.

**First task / PR:** *Fix the disabled-threshold bug and spec the abstract-pattern schema.* Concretely: add the `NOVELTY_MODE = off|shadow|active` flag to [`agent3-run.ts`](../../apps/worker/src/jobs/agents/agent3-run.ts) and [`generation-params.ts`](../../packages/story-validation/src/generation-params.ts), decoupling "is the audit on" from `similarityThreshold >= 1`; default it to `shadow` so the existing audit finally *runs and logs* on real generations without aborting them; and land the `Fingerprint` TypeScript type as the schema the whole redesign is built on. One PR, no new model calls in anger, and it ends three years of dark code.
