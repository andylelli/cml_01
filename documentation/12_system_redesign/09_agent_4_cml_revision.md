# Agent 4 — CML Validator / Revision: A Ground-Up Redesign

> Stop re-rolling the whole proof to patch one broken line. Make the validator a checker, the fixer a surgeon, and the whole loop an inner phase of Agent 3 — so most of these calls never happen at all.

*Written by Claude. First person throughout. This is the Agent 4 entry in the blue-sky redesign series; it assumes the shared CML-first framing from the Agent 3 document and refers back to it.*

## 1. The job to be done

Agent 3 emits a CML document — the structured logical model of the mystery. Before any of that logic reaches a clue planner, an outliner, or a prose writer, **something has to prove it is actually well-formed and internally consistent.** That is the job to be done:

1. **Catch** every way the CML can be wrong — missing required fields, bad enum values, wrong types (schema/shape), *and* the deeper fair-play violations: inference steps with no concrete reader-visible evidence, a discriminating test grounded in facts the reader was never shown, detective-only "signals of guilt" standing in for proof (logic).
2. **Repair** it so it passes — without destroying the creative content that was already correct, and without quietly introducing a *new* error somewhere a previous pass had gotten right.
3. **Do both cheaply**, because this is the loop the rest of the pipeline waits on, and it is the loop that — by the project's own admission in config — churns the most calls.

That is genuinely valuable work. My quarrel is not with the job. It is with the shape: today the catcher is a deterministic checker, the repairer is an LLM regenerating the *entire* document, and the two are bolted together in a retry loop whose budget was cut for cost, not correctness.

## 2. How it works today

There is no `agent4-run.ts` and no `runAgent4` export. Agent 4 is an **embedded sub-routine of Agent 3**, and I found it in exactly three places:

- **The validator** — [`packages/cml/src/validator.ts`](../../packages/cml/src/validator.ts), exported as `validateCml`. This is deterministic: it loads [`schema/cml_2_0.schema.yaml`](../../schema/cml_2_0.schema.yaml), walks required fields / types / enums, then runs the *logic* checks (abstract-evidence patterns, detective-only-behavior patterns, grounding stop-words). It returns `{ valid, errors[] }`.
- **The fixer** — [`packages/prompts-llm/src/agent4-revision.ts`](../../packages/prompts-llm/src/agent4-revision.ts), exported as `reviseCml`, with `buildRevisionPrompt` building the LLM call. This is where the loop lives.
- **The caller** — [`packages/prompts-llm/src/agent3-cml.ts`](../../packages/prompts-llm/src/agent3-cml.ts). After Agent 3's own generation loop, it calls `validateCml(normalized)` (~line 1186); on failure it calls `reviseCml(...)` (~line 1256) and, if that succeeds, marks the result `revisedByAgent4: true`.

The scoring penalty lives in [`apps/worker/src/jobs/agents/agent3-run.ts`](../../apps/worker/src/jobs/agents/agent3-run.ts) (~line 211): `const cmlQualityScore = cmlRevisedByAgent4 ? 60 : 100;`. Needing Agent 4 at all costs the CML 40 quality points.

The `reviseCml` loop itself (one iteration):

1. `buildRevisionPrompt` categorizes errors (`missingRequired`, `typeErrors`, `allowedValueErrors`, `groundingErrors`) and groups them by section path, then asks the LLM to **"Return the COMPLETE, corrected CML as valid JSON."**
2. Parse: `JSON.parse` → `jsonrepair` fallback → brace-slice fallback → sanitized-YAML fallback (`js-yaml`).
3. **`normalizeCml`** — a large deterministic pass (lines ~385–740) that *mutates the LLM's output after the fact*: forces `CML_VERSION`, fills meta/era/setting/crime_class defaults, normalizes every cast enum, synthesizes `required_evidence` from constraint-space anchors when steps lack it, runs `groundDiscriminatingKnowledgeRevealed`, canonicalizes evidence-clue IDs, and synthesizes `fair_play.explanation`.
4. `validateCml(normalized)`. Pass → return. Fail → feed the new error set back, `attempt++`, loop.
5. Budget: `agent4_cml_validator.generation.default_max_attempts` in [`apps/worker/config/generation-params.yaml`](../../apps/worker/config/generation-params.yaml) (line ~101), `temp 0.5`, `max_tokens 8000`. On exhaustion: **it throws.**

Two things to flag explicitly because they shape the redesign:

- **The "fix" is two fixers fighting.** The LLM regenerates the whole document; then `normalizeCml` deterministically overwrites large parts of it. When a run "passes after Agent 4," it is often the deterministic `normalizeCml` defaults — not the model — that crossed the finish line. That is the GENERATE→NORMALIZE→PAD→PATCH masking pattern the shared context warns about, happening *inside the validator's own repair loop*.
- **The config comment is the smoking gun.** Right above `default_max_attempts: 3`: *"Token-efficiency: lowered 5→3 … the CML revision loop was a major call-count churner."* The budget is a cost dial, not a correctness one.

## 3. Where it hurts

**Whole-CML rewrites for local errors.** A single bad enum on `cast[3].motive_strength`, or two steps missing `required_evidence`, triggers a request to regenerate the *entire* CASE block as JSON. That is enormous output for a tiny defect, and every regenerated token is a token that can be re-rolled *wrong*. There is no guarantee that fixing `cast[3]` leaves `cast[0]`'s passing `discriminating_test` untouched — the model is free to "improve" things nobody asked it to touch. We pay full output cost to put correctness *at risk*.

**Churn is the headline cost, and it compounds.** The loop runs up to 3 LLM round-trips, each at `max_tokens: 8000`, each re-sending the full invalid CML plus accumulated errors. This sits *inside* Agent 3, which has its own retry loop — so a hard CML triggers Agent-3 retries × Agent-4 revisions. The shared context calls this loop out by name as the biggest call-count churner, and the response was to *cap it lower*, which leads directly to:

**The budget was cut for cost, not correctness.** Lowering 5→3 doesn't make CML more correct in 3 passes; it makes the loop *give up sooner*. And `reviseCml` doesn't gracefully degrade on exhaustion — it `throw`s. So a CML that merely "ran out of revisions" doesn't ship a flawed-but-usable model; it kills the run. (Compare the no-backstop gates the shared context warns about — this is one.) Meanwhile the runs that *do* squeak through often do so on `normalizeCml`'s deterministic placeholders ("A dated document anchors the event timing."), which is "passing validation" without "being right."

**Schema errors and logic errors are conflated.** `categorizeErrors` separates them in the *prompt*, but the *repair mechanism* is identical: ask the LLM to regenerate everything. A missing `license` field and a fair-play grounding violation are completely different animals — one is a shape defect a machine can fill deterministically or a constrained decoder can make *impossible*, the other genuinely needs a logic checker's verdict. Treating them the same wastes the model on busywork and under-serves the hard cases.

**Post-LLM mutation with no re-validation of the *creative* delta.** `normalizeCml` runs, *then* `validateCml` runs — so the schema is re-checked. But `normalizeCml` is also rewriting narrative-adjacent fields (synthesizing evidence, rewriting fair-play explanations) and there is no check that those deterministic substitutions are *good*, only that they're *valid*. Valid placeholder evidence still passes the schema and still makes a worse mystery.

## 4. Blue-sky redesign

If I could rebuild this from scratch, I would **stop treating Agent 4 as an agent.** It becomes the *verify-and-repair inner loop of Agent 3* — the same recommendation I make in the Agent 3 redesign, viewed from this side. Generation and verification are one phase with one budget and one owner. Here is the concrete shape.

### 4.1 Split the work by error *kind*, not by error *path*

The single most important change: **route by what kind of wrongness it is.**

- **Schema / shape errors → make them unrepresentable.** Missing required fields, wrong types, bad enums — these should *never reach a repair loop* because the generator should not be able to emit them. Opus 4.8 supports **structured outputs** (`output_config.format` with a JSON schema) and **strict tool use** (`strict: true`). If Agent 3 generates the CML as a constrained, schema-validated structured output, the entire `missingRequired` / `typeErrors` / `allowedValueErrors` family is *eliminated at the source*. There is no enum to normalize because the decoder cannot produce an invalid enum. Whole categories of `validateCml` errors — and the corresponding `normalizeCml` defaulting — simply vanish.
- **Logic / fair-play errors → keep the deterministic checker, drop the LLM-opinion repair.** The genuinely hard checks (is every inference step backed by concrete reader-visible evidence? is the discriminating test grounded? is "proof" actually proof and not a guilty reaction?) are *not* schema-shaped. They need a **checker, not an LLM opinion** — and we already have one in `validateCml`. Keep it. What changes is the repair: instead of "regenerate everything," we do targeted patches (4.2) and re-run the checker *only on the touched region plus global invariants*.

This split also fixes the masking problem. `normalizeCml`'s job today is half "fill schema defaults" (which constrained decoding makes obsolete) and half "synthesize evidence with placeholders" (which is the part that quietly ships bad mysteries). Once shape errors can't occur, the only thing left to repair is logic — and logic should never be repaired with a deterministic placeholder. If a step truly has no concrete evidence, that is a *generation* failure to surface, not a hole to paper over.

### 4.2 Targeted patch / diff revision instead of whole-CML regeneration

When a logic error survives constrained generation, repair it **surgically**:

1. The checker already produces error paths (`CASE.inference_path.steps[2].required_evidence`, `CASE.discriminating_test.knowledge_revealed`). Use them. `groupErrorsBySection` already extracts these — today it only formats them into a prompt; tomorrow they *scope the edit*.
2. Hand the model **only the failing sub-structure** plus the read-only context it needs (the relevant constraint-space anchors, the surrounding steps), and ask for a **patch** to that sub-structure — via a tool call whose input schema *is* the shape of that sub-structure. Strict tool use guarantees the patch is well-formed.
3. **Apply the patch in code**, not by trusting the model to re-emit the whole document. The model touches `steps[2].required_evidence`; everything else is byte-for-byte preserved because the code never let the model rewrite it.
4. **Re-validate the touched region + the global invariants only.** We don't need to re-run every check; we need to confirm (a) the patched node now passes, and (b) no *global* invariant (clue-to-scene mapping coverage, fair-play explanation referencing all steps) regressed. Scoped re-validation is fast and, crucially, *bounded* — a patch to one step cannot silently break another step, because the other step's bytes never changed.

This is the antidote to "no guarantee a fix doesn't break a passing part." If the model can only edit the failing node, a passing node is *structurally safe*.

**A worked example.** Suppose `validateCml` returns:

```
CASE.inference_path.steps[2].required_evidence[0] not grounded in reader-visible inference evidence: "the killer's hidden motive"
```

- **Today:** the entire CASE block is re-generated as JSON at `max_tokens: 8000`; `normalizeCml` then runs `isAbstractEvidence` and, finding the placeholder, *replaces the whole `required_evidence` array* with synthesized anchors like `"A dated document anchors the event timing."` — generic, mystery-agnostic, and now permanently part of the logic.
- **Redesigned:** the repair tool is invoked with input schema `{ required_evidence: string[2..4] }`, scoped to `steps[2]`, given the step's `observation`/`correction` and the live `constraint_space` anchors as read-only context, with the instruction "replace the one ungrounded entry with a concrete, reader-visible fact drawn from this case's established constraints." The model returns a 1-element patch. Code splices it into `steps[2].required_evidence[0]`. Scoped re-validation confirms that index now grounds and that `fair_play.explanation` still references Step 3. One small call, no collateral, no generic placeholder.

### 4.3 Make revision rare by constraining at the source

The cheapest revision is the one that never runs. Two levers, both upstream:

- **Generate against the solver (Agent 3 redesign).** If Agent 3 builds the CML against a constraint solver / checker as it generates — so the deduction chain is *correct by construction* — then most logic errors never occur and Agent 4's loop fires on the rare residue, not the common case. The churn problem dissolves because the volume dissolves.
- **Constrained decoding for shape (4.1).** Eliminates the entire schema-error class before any loop.

When revision *does* run, it is a targeted patch on a genuinely hard logic defect — exactly the case worth spending a model call on.

### 4.4 Absorb Agent 4 into Agent 3's inner loop

Given the above, "Agent 4" stops being a distinct thing. The pipeline phase becomes:

> **Agent 3: generate (constrained) → verify (deterministic checker) → patch (targeted, if needed) → re-verify (scoped) → emit.**

One owner, one budget, one place where the CML's correctness is the explicit contract. `validateCml` remains a shared library function (the checker). `reviseCml` becomes `patchCmlNode` — much smaller, no whole-document regeneration, no `normalizeCml` shadow-rewrite. The `revisedByAgent4` flag and the 60-vs-100 penalty become a count of *how many targeted patches were needed* — a far more honest signal than a binary "did the giant rewrite loop fire."

### 4.5 Degrade, don't die

Whatever the budget, exhaustion must **never `throw` and kill the run.** If targeted patching can't resolve a logic defect in N attempts, emit the best CML we have, attach the unresolved errors as structured warnings on the context, and let a downstream phase (or a human review queue) decide. A mystery with one weak inference step is recoverable; a dead run is not. The budget then becomes a true cost dial that we can tune *without* the side effect of aborting hard cases.

## 5. Ripple effects on the rest of the pipeline

- **Agent 3** absorbs the loop. Its redesign and this one are the same redesign from two sides: the solver-backed generation that makes revision rare is *its* job; this document is what's left over when that job is done well.
- **Agent 5 (Clues)** benefits directly. Today `normalizeCml` canonicalizes `discriminating_test.evidence_clues` partly *so Agent 5 doesn't have to reseed from late-only clues* (the code says so). With targeted patches preserving real model-authored evidence IDs instead of deterministic placeholders, Agent 5 inherits cleaner, intentional clue references.
- **Agent 6 (Fair-Play)** gets a CML whose `fair_play.explanation` was authored to reference real steps, not synthesized by string-joining `Step N:` prefixes. Less to second-guess.
- **Scoring** changes character: from a binary penalty for "the rewrite loop fired" to a graded count of targeted patches — more informative, less punitive, and not triggered by harmless schema fills that no longer exist.
- **Cost / token budget** drops sharply where it hurts most. The "major call-count churner" stops re-sending 8K-token whole-document regenerations; patches are small inputs and small outputs.

## 6. How we'd know it worked

- **Schema-error rate from generation → ~0.** With constrained decoding, `validateCml` should essentially never report a `missingRequired` / `typeError` / `allowedValueError` from Agent 3 output. Track it; a nonzero rate means the schema-to-decoder binding has a gap.
- **Revision-trigger rate falls and patches replace rewrites.** Measure (a) fraction of runs that need *any* logic repair, and (b) average bytes changed per repair. Today (b) is effectively "the whole CASE block"; success is a small, bounded diff.
- **Zero placeholder evidence in shipped CML.** Grep shipped CML for `normalizeCml`'s tell-tale strings (`"A dated document anchors the event timing."`, `"A physical trace corroborates…"`). The redesign should make these impossible because deterministic placeholder synthesis is gone.
- **No runs die in revision.** The throw-on-exhaustion path produces zero aborted runs; instead, unresolved-logic warnings appear on the context and correlate with downstream review.
- **No regression-introduced-by-fix.** Instrument scoped re-validation: a patch that causes a *previously passing* node to fail should be impossible by construction; if telemetry ever shows it, the patch isolation has a leak.
- **Token spend on this phase drops** materially as a share of the run, per the existing cost tracker (`byAgent["Agent4-Revision"]`).

## 7. Migration path

I'd sequence this so nothing breaks and each step is independently shippable:

1. **Make `validateCml` the sole source of truth, and stop `reviseCml` from throwing.** Smallest, highest-leverage change: on budget exhaustion, return the best-so-far CML with structured warnings instead of `throw`. This alone removes the no-backstop run-killer. (Touches `agent4-revision.ts` loop tail and the `agent3-cml.ts` call site.)
2. **Introduce constrained/structured-output generation in Agent 3** for the CML shape. As schema errors disappear from real traffic, prune the now-dead branches of `normalizeCml` (the schema-defaulting half) — keep only what isn't yet covered, behind a feature flag so you can compare.
3. **Replace whole-CML regeneration with `patchCmlNode`.** Add a targeted-patch tool keyed off the checker's error paths; apply patches in code; re-validate scoped. Run it *alongside* the old whole-rewrite path under a flag and diff outcomes on a corpus before switching the default.
4. **Delete the placeholder-evidence synthesis.** Once patches author real evidence, remove `fallbackEvidence` and the synthesized-`fair_play.explanation` path. This is the step that converts "passes validation" into "is actually right."
5. **Formally fold the phase into Agent 3.** Rename the flag/score from "revised by Agent 4" to "patch count," update the doc set, and retire the notion of Agent 4 as a separate agent.
6. **Re-tune the budget as a pure cost dial** now that exhaustion is graceful and patches are cheap — and verify the 5→3 cut no longer has *any* correctness side effect.

Throughout, `validateCml` stays put as a library function — every step above is additive or subtractive around it, never a rewrite of the checker itself.

## 8. The pitch in one paragraph

Agent 4 today is a deterministic checker bolted to an LLM that regenerates the entire CML to fix a single broken field, in a loop whose budget was cut for cost and which *kills the run* when it runs out — and which often "passes" only because a deterministic normalizer quietly papered the hole with generic placeholders. I'd rebuild it as the verify-and-repair inner loop of Agent 3: make schema errors **unrepresentable** with constrained decoding so they never reach a loop; keep the deterministic checker for the genuinely hard fair-play logic that needs a *checker, not an opinion*; repair what's left with **targeted patches** scoped to the failing node and re-validated locally, so a fix can't break a passing part; make revision **rare** by generating against a solver upstream; and **degrade gracefully** instead of throwing. The result is fewer calls, smaller calls, no placeholder mysteries, no dead runs — and an honest signal of how much repair a CML actually needed.

## 9. Implementation Plan

> This is an *absorb* plan: Agent 4 has no future as a standalone agent. Sections 1–8 are the vision; here is how I'd fold the checker into Agent 3's inner loop and replace the whole-CML rewrite with a node-scoped patch mechanism — sequenced strictly after the Agent 3 typed core exists, and de-risked so each increment is provably better than what it replaces.

### 9.1 Validate the approach first (de-risking spikes)

I will not write a patch engine until I've proven, on real failing CML, that a node-scoped edit plus *scoped* re-validation actually fixes a `validateCml` error without regenerating the whole document and without breaking any other invariant. Two spikes, both throwaway, both run before any production code:

- **Spike A — "patch beats rewrite" on one real error.** Pull a real failing CML from the report corpus (the deleted `apps/api/data/reports/.../run_*.json` artifacts are exactly this; or capture one fresh by disabling `normalizeCml`). Take a single `CASE.inference_path.steps[i].required_evidence not grounded...` error from [`validateCml`](../../packages/cml/src/validator.ts). By hand, in a script: (a) slice out only `steps[i]`, (b) hand the model *only that sub-structure* plus the live `constraint_space` anchors as read-only context, (c) splice the returned `required_evidence` array back into the parsed object in code, (d) re-run `validateCml` on the whole doc. **Falsification:** if the scoped patch can't ground that one entry, or if re-validation shows a *different* node newly failing (proving edits leak), the "structurally safe patch" thesis in §4.2 is wrong and I stop here.
- **Spike B — size the win.** Before optimizing, measure. Grep the cost tracker / logs for `Agent4-Revision` events and count, over the last N runs: how often `reviseCml` fired at all, how many *attempts* per fire, average `validation.errors.length` going in, and what fraction of "passes" were carried by `normalizeCml` defaults vs. the model (instrument by diffing the model output against the normalized output). **Falsification:** if revisions are already rare and cheap in real traffic, the whole patch mechanism is premature and the only change worth shipping is §9.2's degrade-don't-die fix.

I expect Spike B to confirm the config comment ("major call-count churner") and Spike A to confirm patches are safe. If either fails, the plan changes shape — that's the point of running them first.

### 9.2 What gets built — and deleted (components & contracts)

The headline is that this section *deletes more than it builds*. The build is small because the platform (Agent 3's typed core, constrained decoding) does the heavy lifting.

**Built:**

| Component | What it is | Replaces |
|---|---|---|
| `patchCmlNode(node, error, readOnlyContext)` | A scoped repair: a strict tool call whose input schema *is* the shape of the failing sub-structure; the patch is applied **in code** by splicing into the parsed object, never by re-emitting the document | `reviseCml`'s whole-CML regeneration loop |
| Scoped re-validation | After a patch, re-run `validateCml` and assert (a) the patched path now passes and (b) no global invariant (`validateCrossReferences`, fair-play step coverage) regressed vs. the pre-patch certificate | the implicit "re-validate everything and hope" in the current loop |
| Graceful-degrade exit | On budget exhaustion, **return best-so-far CML + structured `unresolvedLogicWarnings` on the context** instead of `throw` | the `throw new Error("CML revision failed after N attempts")` at the loop tail |
| Constrained shape generation (Agent 3) | CML emitted as a schema-validated structured output / strict tool call, so `missingRequired` / `typeErrors` / `allowedValueErrors` are unrepresentable | the entire schema-defaulting half of `normalizeCml` |

**Deleted (this is the real win):**

- `reviseCml`'s whole-CML regeneration prompt + loop in [`agent4-revision.ts`](../../packages/prompts-llm/src/agent4-revision.ts) — the "Return the COMPLETE, corrected CML as valid JSON" instruction and its multi-attempt retry.
- The **60-vs-100 penalty hack** in [`agent3-run.ts`](../../apps/worker/src/jobs/agents/agent3-run.ts) (`cmlRevisedByAgent4 ? 60 : 100`), replaced by a graded *patch count*.
- **`normalizeCml`'s placeholder-evidence synthesis** — `fallbackEvidence` (the `"A dated document anchors the event timing."` / `"A physical trace corroborates…"` generators), the synthesized `fair_play.explanation` string-join, and the schema-default tree. These are the lines that turn "passes validation" into "ships a worse mystery." Patches author *real* evidence; nothing papers the hole.

**Contract for a patch (the invariant that makes this safe):**

> A patch may only mutate the byte range of the node named by the error path. After application, `validateCml(doc)` MUST show the named path passing AND MUST NOT show any previously-passing path failing. If it can't satisfy both, the patch is rejected and the attempt counts toward the budget — it is never silently applied.

`validateCml` stays exactly where it is, a shared library function. Everything above is additive or subtractive *around* the checker, never a rewrite of it.

### 9.3 Dependencies & sequencing

**This plan is downstream of — really, part of — the Agent 3 redesign.** It cannot start until the keystone work lands, because targeted patches are meaningless without addressable nodes, and constrained shape-generation is the prerequisite that empties half of `normalizeCml`.

Hard prerequisites, in order:

1. **Agent 3 typed CML core + checker library (Shared Platform P1).** Provides *addressable nodes* — the thing a patch scopes to — and is the single source of truth for "what is wrong." Without it there is nothing to address a patch *to*.
2. **Constrained-decoding / structured-output infra (P2).** Deletes the schema-shape error class at the source. Until this exists, `normalizeCml`'s defaulting can't be safely removed.
3. **Validation-gated-mutation discipline (P3).** The contract in §9.2 *is* P3 applied to CML patches.

Because Agent 3 (and Agent 5) generate-against-a-solver work lands first, **the volume of revisions should already be trending toward zero by the time I build the patch engine** — which is why Spike B's measurement matters: I may be building a smaller mechanism than today's churn suggests.

**Ordered phases (each independently shippable):**

- **Phase 0 (ships now, no dependencies):** the degrade-don't-die change from §9.2. Smallest, highest-leverage: stop `reviseCml` throwing on exhaustion; return best-so-far + warnings. Removes the no-backstop run-killer regardless of everything downstream.
- **Phase 1 (after P2):** turn on constrained shape-generation in Agent 3; behind a flag, prune the dead `normalizeCml` schema-default branches as the schema-error rate hits ~0 in shadow traffic.
- **Phase 2 (after P1):** introduce `patchCmlNode` for logic errors, keyed off `validateCml`'s error paths; run it *alongside* the old rewrite path under a flag, diff outcomes on the corpus.
- **Phase 3:** delete placeholder-evidence synthesis; flip the score from binary penalty to patch-count; retire "Agent 4" as a concept.

**First increment:** Phase 0 — it's a few lines at the loop tail and the call site, depends on nothing, and stops killing runs today.

### 9.4 Test & validation strategy

- **Core invariant — a patch never reduces the global validity certificate.** Capture `validateCml(doc).errors` as a *set* before and after each patch. The test asserts: `fixedPaths ⊇ {target}` AND `newlyFailingPaths == ∅`. This is the "fix N, don't regress M" property, made executable: if a patch ever makes a previously-passing path fail, the test fails and the patch is rejected by construction (§9.2 contract).
- **Patch isolation test.** Apply a patch to `steps[i]`, then byte-compare every *other* node against the pre-patch document — they must be identical. This is what makes "a passing node is structurally safe" a checked claim, not a hope.
- **Revision-call-count regression metric.** Treat the Spike B numbers as a baseline and gate on them: total `patchCmlNode` invocations per run, attempts-per-fire, and bytes-changed-per-repair must *not* regress run over run. Bytes-changed-per-repair going *up* toward "whole CASE block" is the early warning that the patch scope is leaking back into a rewrite.
- **Zero-placeholder assertion.** A corpus test greps shipped CML for the deleted `fallbackEvidence` strings (`"A dated document anchors…"`, `"A physical trace corroborates…"`) — must be zero, proving the synthesis path is gone, not dormant.
- **Schema-error-rate canary.** With constrained decoding on, `validateCml` should report ~0 `missingRequired` / `typeError` / `allowedValueError` from Agent 3 output; a nonzero rate flags a schema-to-decoder binding gap.
- **Golden/canary replay (P4).** Replay the captured-failure corpus through patch-mode and confirm each historically-rewritten CML now resolves with a small bounded diff (or degrades cleanly with a warning) — no regressions on the goldens.

### 9.5 Rollout & rollback

- **Flag everything.** `cmlRepairMode: "rewrite" | "patch" | "shadow"`. Default stays `rewrite` until the canary is green.
- **Shadow first.** In `shadow`, run *both* the legacy whole-CML `reviseCml` (authoritative, ships its result) and the new `patchCmlNode` path (logged only), and diff: did patch-mode resolve the same errors? Did it touch fewer bytes? Did it ever introduce a new failure? Promote to `patch` only when, on a representative corpus, patch-mode matches-or-beats rewrite on resolution rate and strictly beats it on bytes-changed.
- **Rollback is a flag flip** to `rewrite`, since `reviseCml` stays in the tree until Phase 3 deletion. The degrade-don't-die change (Phase 0) has no rollback risk — returning best-so-far + warnings is strictly safer than throwing.
- **Kill criteria — revert to `rewrite` immediately if:** (a) patch-mode's error-resolution rate is below rewrite's on the canary, (b) the patch-isolation test ever observes a previously-passing node failing in real traffic (telemetry leak), or (c) bytes-changed-per-repair trends toward whole-document, signalling the scope discipline has broken.

### 9.6 Open questions to resolve before coding

- **Granularity of addressable nodes.** What's the right patch unit — a single `required_evidence[k]` entry, the whole `steps[i]` object, or the `inference_path`? Too fine and one logical defect needs many patches; too coarse and we drift back toward rewrite. This depends on how the Agent 3 typed core exposes node addresses; resolve *with* the keystone, not after.
- **When must a patch escalate to regeneration?** Some logic defects are genuinely non-local (e.g., the entire inference chain is unsound, not one step). Define the trip-wire: if a patch's read-only context would have to include more than K sibling nodes, or if scoped re-validation keeps surfacing *new* paths after each patch, escalate to a bounded Agent-3 re-generation of that subtree rather than fighting it node-by-node.
- **How to bound patch iterations.** The budget today is `default_max_attempts: 3` in [`generation-params.yaml`](../../apps/worker/config/generation-params.yaml), a cost dial that doubles as a kill switch. Once exhaustion degrades instead of throwing (§9.2), what's the right N — counted per-error, per-node, or per-document? My lean: per-document attempt budget with a per-node retry cap, so one stubborn node can't starve the rest.

### 9.7 "Ready to build" checklist

- [ ] Spike A green: a node-scoped patch + scoped re-validation fixes one real `validateCml` grounding error with zero collateral node changes.
- [ ] Spike B numbers captured: today's revision-call volume, attempts-per-fire, and normalizer-vs-model "pass" attribution recorded as the baseline.
- [ ] Agent 3 keystone confirmed landed: typed core (addressable nodes) + checker library + P2 constrained decoding available.
- [ ] Patch contract (§9.2) written as an executable test: `fixedPaths ⊇ {target}` ∧ `newlyFailingPaths == ∅` ∧ non-target nodes byte-identical.
- [ ] `cmlRepairMode` flag wired with `rewrite` default and a `shadow` diff path.
- [ ] Canary corpus assembled from captured-failure reports for golden replay.

**First task / PR:** *Phase 0 — make exhaustion graceful.* Change [`reviseCml`](../../packages/prompts-llm/src/agent4-revision.ts)'s loop tail to return `{ cml: bestSoFar, validation, unresolvedLogicWarnings }` instead of `throw`, and update the [`agent3-cml.ts`](../../packages/prompts-llm/src/agent3-cml.ts) call site (~line 1256) to attach those warnings to the context and proceed. One small PR, no platform dependency, and it stops a "ran out of revisions" CML from killing the whole run starting today.
