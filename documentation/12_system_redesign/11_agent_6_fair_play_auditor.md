# Agent 6 — Fair-Play Auditor: A Ground-Up Redesign

> Stop asking one LLM to grade another LLM's logic. Prove solvability with a deterministic checker, and repurpose the reader-simulator from a pass/fail gate into a panel that tells us how hard, and how fair, the case *feels*.

I'm Claude. This is my blue-sky redesign of Agent 6, the agent that decides whether a finished case is "fair play" — whether a reader, given only what the prose will let them see, could in principle deduce the solution before the detective reveals it. I've read the current implementation closely ([`agent6-run.ts`](../../apps/worker/src/jobs/agents/agent6-run.ts), [`agent6-escalation-policy.ts`](../../apps/worker/src/jobs/agents/agent6-escalation-policy.ts), the [agent doc](../03_Agents/11_agent_6_fair_play_auditor.md), and the [generation params](../../apps/worker/config/generation-params.yaml)). The design is clever in places and exhausting in others, and the core problem is a category error I want to fix at the root.

---

## 1. The job to be done

Fair play, in the Golden Age sense, is a *property of the logical model plus its clue exposure*, not a vibe. Concretely, a case is fair iff:

1. **Information parity** — every fact the detective uses in the reveal is visible to the reader beforehand (no withheld evidence, no off-page knowledge).
2. **Temporal availability** — each load-bearing clue appears in the prose *before* the inference step that consumes it, and before the discriminating test that resolves the case.
3. **Logical deducibility** — the visible clues, chained by the inference path, actually *entail* the stated solution. Each step is supported by evidence the reader has.
4. **Solution uniqueness** — the visible evidence eliminates every non-culprit; the culprit is the *only* suspect consistent with all clues.
5. **Difficulty calibration (the soft half)** — it should be *solvable but not trivial*: hard enough to be satisfying, not so obscure that a sharp reader has no realistic path.

Items 1–4 are **formal, deterministic, ground-truth** properties of the CML + clue set. Item 5 is **experiential and stochastic** — it lives in a human (or simulated) reader's head. The single most important design decision for this agent is to **stop conflating these two kinds of question**. Today's Agent 6 treats all five as one fuzzy LLM judgement call, and pays for it.

The deliverable Agent 6 owes the pipeline: *a verdict that the case is provably solvable, plus a calibrated read on how hard and how fair it feels* — emitted as guidance the prose agents (7, 9) can trust and act on.

---

## 2. How it works today

The current Agent 6 is actually three machines bolted together, and it's worth being precise about each because the redesign keeps one, repurposes one, and deletes one.

**(a) A deterministic structural pre-audit.** Before any LLM call, [`runDeterministicStructuralAudit`](../../apps/worker/src/jobs/agents/agent6-run.ts) (lines ~677–818) already does real formal work: it checks that every `discriminating_test.evidence_clues` ID is present in `early|mid` placement, that each inference step has at least one essential `early|mid` clue (`supportsInferenceStep`), that each non-culprit has an elimination clue, and that some evidence clue names the culprit in `pointsTo`. This is the *seed of the right idea* — a checker that establishes truth before the model speaks. It also injects deterministic backstops: a "parity bridge" clue (`ensureParityBridgeClue`) and "critical fair-play backstop clues" (`ensureCriticalFairPlayBackstopClues`).

**(b) An LLM audit.** [`auditFairPlay`](../../packages/prompts-llm/src/agent6-fairplay.ts) runs at temperature 0.3, receiving the surface model, hidden model, false assumption, inference steps, discriminating test, clue timeline, and constraint space. It returns a `FairPlayAuditResult` with `overallStatus` (`pass | fail | needs-revision`), `checks[]`, `violations[]` (with `critical|moderate|minor` severity), `warnings`, and `recommendations`. Status maps to a score: pass=100, needs-revision=70, fail=45. The audit runs in a loop (`max_fair_play_attempts: 2`) that regenerates clues via Agent 5 with `fairPlayFeedback` between attempts.

**(c) A blind-reader gate.** [`blindReaderSimulation`](../../packages/prompts-llm/src/agent6-fairplay.ts) (temp 0.2) is a *second LLM* that sees only the clue set (what the reader would see), is told the cast names and the false assumption, and tries to *solve the case*. It returns `suspectedCulprit`, `confidenceLevel` (`certain|likely|uncertain|impossible`), `reasoning`, and `missingInformation`. It "passes" if the suspected culprit matches the real one **and** confidence ≥ `likely`. On failure it runs up to `max_remediation_cycles: 1` of targeted clue regeneration — and if it *still* fails, **it throws and kills the run** ([`agent6-run.ts`](../../apps/worker/src/jobs/agents/agent6-run.ts) line ~1731).

**(d) An escalation policy.** [`agent6-escalation-policy.ts`](../../apps/worker/src/jobs/agents/agent6-escalation-policy.ts) classifies failures into `clue_coverage | inference_path_abstract | constraint_space_insufficient | clue_only`, maintains a `STRUCTURAL_ESCALATION_RULES` set, and decides whether to escalate all the way back to Agent 4 (CML revision via Agent 3 path) and re-run clues + audit. Layered on top: a `max_retry_cost_usd: 0.15` budget tracker, `max_total_attempts_with_targeted_regen: 3`, three tiers of warning sets (`transient-progress`, `transient-diagnostic`, `persistent-risk`), and synthesized-upstream-context fallbacks for when the escalation can't find real setting/cast artifacts.

That's a lot of control flow for one quality gate. The runner is ~95KB.

---

## 3. Where it hurts

**An LLM grading an LLM is not an oracle.** The audit and the blind reader are both Claude calls scoring Claude's output. When the blind reader "fails to solve," that can mean (i) the case is genuinely unfair, or (ii) *this one sampling got unlucky* — it fixated on a red herring, mis-parsed a clue, or pattern-matched the wrong cliché. When it "solves," that can mean (i) the clues genuinely entail the answer, or (ii) it guessed the butler because it's a country house in the 1930s and got lucky. **Neither outcome is evidence about the actual logical structure of the case.** A single stochastic sample is being treated as ground truth about a *deterministic* property. That's the category error.

**The stochastic gate has real teeth — it kills runs.** The blind-reader failure path *throws* (line ~1731). So a sampling artifact in a 1500-token, temp-0.2 single-shot solve can abort a fully-built, logically-sound case. This is exactly the "no-backstop gate kills runs" pathology flagged across the pipeline. We're letting a coin-flip veto an engineering artifact.

**The remediation loop can corrupt as much as it fixes.** When the blind reader fails, the fix is to regenerate clues (Agent 5) with feedback like "add a unique mechanism link to the culprit" and re-audit. But clue regeneration mutates the artifact the structural audit already blessed, and the `requiredCluePhrases` / `requiredReplacements` injections push Agent 5 toward *spelling out* the answer — which trivializes difficulty to satisfy a confidence threshold. We risk dumbing the mystery down to make a nervous simulated reader more "confident." That's optimizing the wrong variable.

**The escalation policy is accreted complexity standing in for a missing guarantee.** `classifyFairPlayFailure`, the structural-rule set, the cost budget, the three warning tiers, the synthesized-context fallbacks — all of it exists because *we don't actually know whether the case is solvable*, so we built an elaborate apparatus to react to an LLM's guess about it. Most of this machinery would be unnecessary if solvability were *proven upstream and at the source*. The escalation back to Agent 4 is especially telling: Agent 6 is reaching back four agents to fix structural logic that should never have left Agent 3/4 broken.

**The deterministic audit it already has is under-trusted and bolted on as a "pre-audit."** The most reliable component — the deterministic checker — is treated as a *preprocessor that feeds the LLM*, not as the authority. The comments even say "the LLM is then responsible only for narrative quality" — but then the LLM's `overallStatus` still drives scoring and escalation, and the stochastic blind reader can still throw. The truth-teller is in the room but not in charge.

---

## 4. Blue-sky redesign

My thesis in one line: **a deterministic checker owns *correctness* (truth); a diverse panel of LLM reader-simulators owns *difficulty and felt-fairness* (calibration); and the two never trade places.**

### 4.1 The Solvability Checker — deterministic, the source of truth

Promote the existing deterministic audit from "pre-audit helper" to **the verdict-issuing core**, and make it a genuine deducibility + uniqueness prover. Because of the upstream redesigns (Agent 3 generates a logic graph; Agent 5 emits clues with explicit `supportsInferenceStep`, `placement`, `pointsTo`, `criticality`), the checker has everything it needs to operate on structured data rather than prose:

- **Build the visible-evidence set V.** Take every clue the reader will see, ordered by placement (`early → mid → late`), each tagged with which inference step it supports and which suspect(s) it implicates or eliminates.
- **Replay the inference path over V.** For each step in `inference_path.steps`, confirm every item in `required_evidence` is satisfied by a clue *already visible at or before that step's position*. A step that consumes evidence the reader hasn't seen yet is a **temporal-availability violation** — deterministic, no LLM needed.
- **Run elimination to a fixpoint.** Start with all suspects "open." Apply each visible elimination clue. Assert that after the last clue *before the discriminating test*, exactly the non-culprits are eliminated and the culprit remains — i.e. **uniqueness**. If two suspects survive, the case is under-determined (unfair-too-hard / ambiguous). If the culprit is eliminated, it's contradictory. Both are hard failures with precise diagnostics.
- **Check information parity directly.** Every fact cited in `discriminating_test`, `hidden_model.mechanism`, and the reveal must trace to a clue in V. Anything in the reveal not grounded in V is withheld information — flagged with the exact unmatched fact.

The output is a **machine-checkable proof object**: "Solution = X. Eliminated {A,B,C,D} by clues {c3, c7, c11, c2}, each visible by chapter N. Culprit X uniquely survives. Every reveal fact grounded in V. PASS." Or a precise failure: "Step 4 consumes `tide_table` evidence first visible at `late`; reader cannot perform this deduction at the test." This is reproducible, fast, free, and *true*. It replaces `overallStatus` as the correctness verdict entirely.

Crucially: **if the Agent 3 + Agent 5 redesigns make logic provably fair at the source** (each emits artifacts the checker can validate as it builds), then the checker here is mostly a *confirmation* pass — a final assertion that nothing downstream broke the proof. It should almost always pass, because correctness was guaranteed before the prose stage. When it *fails*, that's a real upstream bug, and the right response is a clean, narrow signal back to Agent 3/5 — not a four-agent escalation cascade.

### 4.2 The Reader Panel — stochastic, for difficulty and experience only

Here's where the blind reader belongs: **not as a gate, as a sensor.** Once the checker has *proven* the case is solvable, the only remaining question is the soft one: *how hard is it, and does it feel fair?* That question is inherently human and stochastic, so I embrace the stochasticity instead of fighting it.

Replace the single pass/fail blind reader with a **panel of N diverse reader-simulators** (e.g. N=4–5), run in parallel, each given only V and a different *persona/strategy*:

- **The methodical deducer** — works the timeline and alibis systematically.
- **The intuitive guesser** — goes on character and motive vibes, samples at higher temperature.
- **The genre-savvy veteran** — knows the tropes, suspicious of the obvious.
- **The literal reader** — only uses explicitly stated facts, no leaps.
- **The distracted reader** — lower effort, models someone who misses subtle clues.

We collect their guesses and confidences and compute **calibration statistics**, never a binary gate:

- **Solve rate** (fraction of panel that named the real culprit) → a *difficulty score*. 5/5 = too easy; 0/5 = probably too obscure (worth a human look, not an auto-kill); ~2–4/5 = a satisfying sweet spot.
- **Convergence on wrong suspects** → reveals an *unintended* red herring that's too strong, or a misleading clue.
- **Common `missingInformation` across the panel** → the *experiential* gaps (different from formal gaps): where a real reader would feel cheated even though the logic technically closes.
- **The reasoning paths** → where readers get stuck, which becomes guidance for Agent 7/9 on pacing and emphasis.

Because the checker already guarantees the answer *is* derivable, a low panel solve rate no longer means "unfair" — it means "hard," which is *information*, not a failure. We surface it as metadata (`difficulty: hard`, `experiential_warnings: [...]`) and let it flow downstream, optionally feeding a *deliberate* difficulty target the user picked.

### 4.3 What remains for the LLM (and what dies)

The LLM keeps the work it's genuinely good at and loses the work it's bad at:

- **Keeps:** judging *experiential* fairness — "the dying-message clue is technically present but so cryptic no human would catch it," "the alibi-breaking detail is buried in a paragraph about wallpaper." These are prose-craft and salience judgements the checker can't make. Also keeps: writing the human-readable *explanation* of the proof for the report.
- **Loses:** being the correctness oracle. No more `overallStatus`-as-truth. No more single-sample veto. No more clue-regen loops triggered by one model's uncertainty.

**Deleted entirely once correctness is guaranteed upstream:**

- The whole [`agent6-escalation-policy.ts`](../../apps/worker/src/jobs/agents/agent6-escalation-policy.ts) classification + escalation-to-Agent-4 machinery. If the checker fails, we emit a typed structural defect and route it to the *one* responsible upstream agent (3 or 5), once, with the exact proof obligation that failed — no four-way classification, no synthesized-context fallback.
- The `max_retry_cost_usd` budget tracker and the three warning tiers — there's almost nothing left to retry, because we're confirming a proof, not negotiating with a stochastic grader.
- The blind-reader `throw` path. The panel can *never* kill a run; it only annotates.
- The clue-regeneration-on-blind-failure loop that risks trivializing the mystery.

### 4.4 Concrete example: checker vs panel division

Say the case turns on a tide table: the culprit claimed to cross the causeway at 9pm, but the tide table (a clue) shows it was submerged 8–10pm, so only someone with a boat (the culprit, who owns one — another clue) could have reached the island.

- **The Checker** verifies, deterministically: clue `tide_table` is placed `mid` (visible before the reveal); clue `boat_ownership` is `early`; inference step 3 (`required_evidence: [tide_table, boat_ownership]`) is satisfiable at its position; applying both eliminates all four non-boat-owners; the culprit uniquely survives; the reveal cites only these visible facts. **PASS — proven solvable.** No LLM involved. If `tide_table` were placed `late`, the checker emits: *"Temporal-availability violation: step 3 needs `tide_table`, first visible at `late`; reader cannot deduce at test."* — a precise, actionable, true defect.

- **The Panel** then reports: methodical deducer and veteran solved it (used the tide table); the intuitive guesser blamed the victim's business rival (strong motive, wrong); the literal reader missed it because the boat-ownership clue was phrased as a passing remark about "his weekend hobby." **Solve rate 2/5 → difficulty: hard-but-fair.** Experiential signal: *"`boat_ownership` is logically load-bearing but narratively buried; consider giving it more salience in prose."* That note goes to Agent 9 — it does **not** trigger a clue regen and does **not** fail the case, because the logic is already proven sound.

This is the whole design in miniature: the checker says *true*, the panel says *hard, and here's where a reader stumbles*. They answer different questions and never overrule each other.

---

## 5. Ripple effects on the rest of the pipeline

- **Agent 3 / Agent 4 (CML).** The big win. If Agent 3 builds the logic as a checkable graph and the checker runs *there*, the case arrives at Agent 6 already proven. Agent 6's escalation-back-to-Agent-4 path — the most expensive control flow in the pipeline — largely disappears. Agent 6 becomes a confirmation, not a rescue mission.
- **Agent 5 (Clues).** The checker's contract becomes Agent 5's spec: every clue carries `supportsInferenceStep`, `placement`, `pointsTo`, and an explicit eliminates/implicates tag, because the checker *requires* them to replay the proof. This tightens Agent 5's output and removes the fuzzy `fairPlayFeedback` regen loop in favour of precise, typed proof obligations ("step 4 needs a visible clue eliminating suspect B before the test").
- **Agent 7 (Outliner) & Agent 9 (Prose).** They gain two new, *trustworthy* inputs: the proof object (guaranteed solvable — they can place clues confidently) and the experiential signals (which clues are buried, where readers stall). Agent 9's salience decisions get grounded in panel data instead of guesswork.
- **Cost & latency.** The checker is ~free and fast. The panel is N parallel small calls instead of an audit + blind reader + remediation loops + possible Agent-4 re-run. Net: fewer LLM tokens, far less serial control flow, and no catastrophic run-killing throws. The "token churn dominates" pathology shrinks here.
- **Difficulty becomes a product knob.** Because the panel emits a solve-rate, the user's chosen difficulty ("standard / increase / extreme") becomes a *target the panel measures against*, not a vibe. Agent 6 can report "you asked for hard; panel solve rate 1/5 — delivered."

---

## 6. How we'd know it worked

- **Run-kill rate from Agent 6 drops to ~0.** No more stochastic vetoes aborting sound cases. Any kill is a genuine, reproducible checker failure pointing at a specific upstream defect.
- **Checker pass rate on first arrival climbs toward 100%** as the Agent 3/5 redesigns land — measuring whether correctness really is guaranteed at the source. A falling first-arrival pass rate is an early-warning that upstream regressed.
- **Determinism check:** re-run Agent 6 on the same case 10× — the *verdict* (correctness) must be identical every time. (Today it isn't, because a stochastic blind reader can flip it.) This is a literal, testable invariant.
- **Difficulty calibration tracks reality:** correlate panel solve-rate with human-reader solve-rate on a sample set. If the panel says "2/5" and humans land near there, the calibration is honest. This is the only place we *want* to validate against humans, because it's the only genuinely experiential claim.
- **Escalation volume → near zero.** Count CML re-revisions triggered by Agent 6 before vs after. The accreted escalation machinery should go quiet, proving it was compensating for a missing guarantee.
- **No silent trivialization:** track whether difficulty drifts *down* over a run (it used to, when the blind-reader loop spelled out answers). With the loop gone, difficulty should be stable and intentional.

---

## 7. Migration path

I'd stage this so the deterministic core takes over *before* the LLM machinery is removed — never the reverse.

1. **Harden the checker into a real prover.** Extend `runDeterministicStructuralAudit` from its four placement checks into the full deducibility + uniqueness replay (§4.1). Emit the proof object. Run it in *shadow* alongside the current LLM verdict and log disagreements. This is pure additive code; nothing changes behaviourally yet.
2. **Make the checker authoritative for correctness.** Flip `overallStatus`-as-truth over to the checker's verdict. The LLM audit keeps running but is demoted to "experiential notes only." Watch the disagreement log shrink as the upstream contracts tighten.
3. **Defang the blind-reader gate.** Remove the `throw` (line ~1731) first — that's the highest-risk, lowest-value behaviour. The blind reader becomes advisory immediately, even before the panel exists.
4. **Build the panel.** Add the N-persona parallel reader-simulators, compute solve-rate and experiential signals, emit them as metadata. Retire the single blind reader.
5. **Delete the escalation policy.** Once the checker is authoritative *and* the Agent 3/5 redesigns guarantee correctness upstream, remove [`agent6-escalation-policy.ts`](../../apps/worker/src/jobs/agents/agent6-escalation-policy.ts), the cost-budget tracker, the warning tiers, and the synthesized-context fallbacks. Replace with: one typed defect → one upstream route → one retry.
6. **Re-point downstream consumers.** Update Agent 7 and Agent 9 to consume the proof object + experiential signals instead of `FairPlayAuditResult.overallStatus`.

Each step is independently shippable and reversible, and the dangerous LLM behaviours (the throw, the trivializing regen loop) die early.

---

## 8. The pitch in one paragraph

Agent 6 today is an LLM grading an LLM's logic, with a second stochastic LLM holding a veto that can kill a perfectly sound case, wrapped in an escalation apparatus that exists only because nobody actually *knows* whether the case is solvable. Fair play has two halves that we keep confusing: **correctness**, which is a deterministic property of the clues and the inference path and should be *proven* by a checker (the existing structural audit, grown into a real deducibility + uniqueness prover) — and **difficulty**, which is genuinely experiential and stochastic and belongs to a *panel* of diverse reader-simulators whose disagreement is the signal, not the noise. Let the checker own truth and let the panel measure feel; let the checker fail loudly and precisely to one upstream agent, and let the panel only ever *annotate*, never abort. Once correctness is guaranteed at the source, almost everything else in this 95KB runner — the escalation classifier, the cost budget, the three warning tiers, the run-killing gate, the trivializing regen loop — simply evaporates, and Agent 6 becomes what it always should have been: a proof check followed by a difficulty reading.

---

## 9. Implementation Plan

> Sections 1–8 argue the redesign; this section is how I'd actually de-risk and ship it — proving the gate is unreliable before I delete it, and making the checker authoritative before I defang anything.

### 9.1 Validate the approach first (de-risking spikes)

The whole thesis rests on one empirical claim: **the blind reader is a stochastic sample being treated as a deterministic verdict.** Before I touch a line of production control flow, I want that claim to be *measured*, not asserted — because if the blind reader turns out to be stable, the redesign is over-engineering.

- **Spike A — measure blind-reader variance (the falsifiable core).** Pick one fixed, already-built case (a frozen `ctx.cml` + `ctx.clues` from a real run report under [`apps/api/data/reports/`](../../apps/api/data/reports/)). Call [`blindReaderSimulation`](../../packages/prompts-llm/src/agent6-fairplay.ts) — the same one wired in at [`agent6-run.ts`](../../apps/worker/src/jobs/agents/agent6-run.ts) line ~1579 — **N=20 times** with no other change. Record `suspectedCulprit`, `confidenceLevel`, and the `blindPasses` boolean (the exact pass logic lives at lines ~1587–1594). Compute the **false-veto rate**: the fraction of runs where `blindPasses === false` on a case the checker can prove solvable. *Hypothesis to falsify:* "the verdict is identical every time." If even 2/20 flip, the gate is provably unreliable and the run-killing throw at line ~1732 is indefensible. If 20/20 agree, I stop and reconsider — the category error might be theoretical only.
- **Spike B — prototype the deterministic verdict on the same case.** Take the existing [`runDeterministicStructuralAudit`](../../apps/worker/src/jobs/agents/agent6-run.ts) (line ~677) and run it 20× on that same frozen case. It must return a **byte-identical** `StructuralAuditResult` every time (it's pure over `cml` + `clues`, so this should hold trivially — but I want the contrast on the same page as Spike A). The deliverable is one table: *blind reader flipped K/20 times; checker flipped 0/20.* That table is the entire justification for the redesign.
- **Spike C — gap analysis: what can't the current audit prove yet?** The current audit does four placement checks (§2a). The full prover needs temporal-availability replay over `inference_path.steps` and elimination-to-fixpoint (§4.1). On 5–10 historical cases, hand-check: does the structured data (`supportsInferenceStep`, `placement`, `pointsTo`, `criticality`) actually carry enough to replay the proof? If Agent 5 isn't emitting clean tags yet, that's a dependency I surface to 9.3 — not a blocker I discover mid-build.

Exit criterion for the spikes: a measured false-veto rate > 0, plus a confirmed-deterministic checker on the same inputs. Without that, I don't proceed.

### 9.2 What gets built — and deleted (components & contracts)

| Component | Status | Notes |
|---|---|---|
| **Solvability Checker** (grown from `runDeterministicStructuralAudit`) | **Grow** | Extend the four placement checks into temporal-availability replay + elimination-to-fixpoint + parity tracing (§4.1). Emits a `SolvabilityProof` object (see contract below). |
| **Reader Panel** (N=4–5 personas) | **Build** | Wraps `blindReaderSimulation` per persona, run in parallel; aggregates into a `DifficultyReport`. Produces difficulty/experiential metadata, never a pass/fail. |
| `agent6-escalation-policy.ts` (`classifyFairPlayFailure`, `STRUCTURAL_ESCALATION_RULES`, `shouldEscalateStructuralCmlRevision`, cost budget, warning tiers) | **Delete** | Replaced by: one typed checker defect → one upstream route (Agent 3 or 5) → one retry. |
| The run-killing `throw` at line ~1732 | **Delete** | The panel can never abort a run. This dies *first* (see 9.3) — highest-risk, lowest-value. |
| The blind-reader remediation/clue-regen loop (lines ~1607–1730) and `fairPlayFeedback`-driven Agent 5 regen | **Delete** | This is the trivializing loop. Once correctness is proven upstream, there's nothing to remediate. |
| `auditFairPlay`'s `overallStatus`-as-truth → score mapping | **Demote** | LLM audit keeps producing *experiential notes only*; correctness verdict comes from the checker. |
| `ensureParityBridgeClue` / `ensureCriticalFairPlayBackstopClues` (backstop-clue synthesis) | **Delete (coordinated)** | Redundant once Agent 5 derives clues from `inference_path` (see 9.3 — coordinate, don't unilaterally remove). |

**The `SolvabilityProof` contract (the new deliverable):**

```ts
interface SolvabilityProof {
  solvable: boolean;
  culprit: string;
  eliminated: Array<{ suspect: string; byClue: string; visibleByPlacement: "early" | "mid" }>;
  temporalViolations: Array<{ stepIndex: number; needsClue: string; firstVisibleAt: string }>;
  parityViolations: Array<{ revealFact: string; unmatchedIn: "V" }>;
  // when !solvable: exactly one typed defect routed to exactly one upstream agent
  defect?: { obligation: string; owner: "agent3" | "agent5" };
}
```

The `DifficultyReport` is its sibling — `solveRate`, `difficulty: "trivial" | "easy" | "hard" | "obscure"`, `wrongConvergence`, `experiential_warnings[]` — and flows downstream to Agents 7/9 as guidance, not as a gate.

### 9.3 Dependencies & sequencing

**KEYSTONE = Agent 3.** The Solvability Checker *is* a superset of Agent 3's deducibility + uniqueness engines. I reuse those engines; I do not re-implement a parallel prover here. If Agent 3's redesign lands the checkable logic graph and runs the proof *at the source*, Agent 6's checker becomes a thin confirmation pass. So the build order is gated on Agent 3's checker library (P1 typed CML core).

**Agent 5 coordination (deletion, not duplication).** Agent 5 derives clues from the `inference_path`; once that lands, Agent 6's backstop-clue synthesis (`ensureParityBridgeClue`, `ensureCriticalFairPlayBackstopClues`) and structural re-computation are redundant. Deleting them is a *coordinated* change — I don't pull them until Agent 5's contract guarantees every clue carries `supportsInferenceStep` / `placement` / `pointsTo` / `criticality`, because the checker *requires* those tags to replay the proof.

**Ordered phases:**

1. **Checker-as-truth (additive, no behavior change).** Grow `runDeterministicStructuralAudit` into the full prover behind a flag; run it in *shadow* alongside today's LLM verdict; log disagreements. Nothing changes behaviorally.
2. **Flip authority.** Make the checker's verdict authoritative for correctness; demote `auditFairPlay.overallStatus` to experiential notes.
3. **Demote the blind reader to the panel.** *First* remove the throw (line ~1732) so the blind reader is advisory immediately; *then* fan it out into the N-persona panel producing the `DifficultyReport`.
4. **Delete the escalation policy** once the checker is authoritative *and* Agent 3/5 guarantee correctness upstream.
5. **Re-point Agents 7/9** onto `SolvabilityProof` + `DifficultyReport`.

**First increment:** Phase 1, shadow-only — additive, reversible, ships behind a flag with zero behavioral change. It's also where I bank the disagreement log that justifies every later deletion. P2 structured-output for the panel verdicts (typed `DifficultyReport`) follows once the panel exists in Phase 3.

### 9.4 Test & validation strategy

- **The core invariant (a literal test):** *a CML the checker certifies as solvable NEVER fails on a stochastic reader's bad day.* Re-run Agent 6 on the same certified case 10× — the **correctness verdict must be byte-identical every time**, regardless of what any panel persona guesses. This is the determinism check from §6 turned into an assertion. It's the single test that proves the category error is fixed.
- **Panel disagreement surfaces difficulty, never pass/fail.** Test that a low solve rate (0–1/5) on a *checker-certified* case produces `difficulty: obscure` + an `experiential_warning`, and **does not** set any failure flag, throw, or trigger clue regen. A test that asserts "panel split → run continues" is the guardrail against regressing into the old gate.
- **Checker correctness fixtures.** Hand-built CMLs with known defects: a `tide_table` placed `late` must produce exactly one `temporalViolations` entry; two surviving suspects must produce a uniqueness failure; a reveal fact ungrounded in V must produce exactly one `parityViolations` entry. These are pure-function tests — fast, free, deterministic.
- **Canary on historical kills.** Replay (P4 golden/canary harness) the runs the blind reader **killed** — pull frozen cases from [`apps/api/data/reports/`](../../apps/api/data/reports/) where the throw fired. For each, assert the checker now *certifies* it (proving the kill was a false veto), or produces a *precise, reproducible* defect (proving it was a real upstream bug, not a coin flip). A clean canary set is the empirical proof that run-kill rate drops to ~0.

### 9.5 Rollout & rollback

- **Flag:** `agent6_checker_authoritative` (default off). Off = today's behavior exactly; on = checker owns correctness, panel annotates, throw is gone.
- **Shadow mode:** run checker + panel *alongside* today's gate without acting on them. Log, for every run: did the old gate kill it? did the checker certify it? did the panel split? The headline metric is **"runs the old gate killed that the checker certifies"** — every one of those is a sound case the old system was aborting. P3 discipline applies throughout: no clue-regen that mutates the artifact without re-proving.
- **Kill criteria (roll back to flag-off if):** the checker certifies a case that a downstream human review judges genuinely unfair (a real false-certify — far more dangerous than a false-veto, so this is a hard stop); OR the shadow disagreement log *grows* instead of shrinking as Agent 3/5 land (signals upstream isn't actually guaranteeing correctness yet); OR panel latency/cost regresses beyond the budget the old audit+blind+remediation path consumed.
- **Promotion:** flip the flag on per-environment only after the canary set (9.4) is green and the shadow false-certify count is zero across a meaningful run volume.

### 9.6 Open questions to resolve before coding

- **Panel size & diversity.** Is N=4–5 enough to make solve rate a stable difficulty signal, or does the per-persona variance (Spike A) demand more samples per persona? Are the five personas (methodical / intuitive / veteran / literal / distracted) actually *decorrelated*, or do three of them collapse to the same strategy? Cheap to test: run the panel on Spike A's case and look at inter-persona agreement.
- **Difficulty → user-facing label.** How does `solveRate` map to the product's "standard / increase / extreme" knob? Is 2–4/5 really the "satisfying" band, and does it correlate with *human* solve rate (the one place §6 says we should validate against humans)? Until we have that correlation, the label is a guess.
- **Residual experiential soft gates.** The checker proves logic; the panel measures feel. Is there any experiential condition that should remain a *soft* gate — e.g. "0/5 panel solve rate on a case the user asked to be *easy*" routed to a human, not auto-killed? I want to enumerate which experiential signals are pure metadata vs. which warrant a (non-fatal) flag, before I delete the last vestige of gating.

### 9.7 "Ready to build" checklist

- [ ] Spike A run: blind-reader variance measured on a fixed case (N≥20); false-veto rate recorded and > 0.
- [ ] Spike B run: checker confirmed byte-identical on the same case; the contrast table exists.
- [ ] Spike C: structured-data gap analysis done; any Agent 5 tagging gaps surfaced to the Agent 5 owner.
- [ ] Agent 3 checker-library reuse boundary agreed (what Agent 6 imports vs. re-implements — answer should be "imports everything").
- [ ] Agent 5 deletion coordinated: backstop-clue synthesis removal gated on Agent 5's clue-derivation contract.
- [ ] `SolvabilityProof` and `DifficultyReport` schemas reviewed by Agents 7/9 consumers (P2 structured output).
- [ ] Canary set assembled: historical runs the blind-reader throw killed, pulled from `apps/api/data/reports/`.
- [ ] Flag `agent6_checker_authoritative` scaffolded (default off) with shadow logging wired.
- [ ] **FIRST PR:** *Instrument blind-reader variance (the Spike A harness, landed as a repeatable script) and ship the `SolvabilityProof` verdict schema as a typed contract — additive, no behavior change, flag-off.* This bank the evidence and lock the contract before any deletion touches the runner.
