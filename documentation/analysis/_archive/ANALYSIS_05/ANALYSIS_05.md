# ANALYSIS_05 - Two-Pass Review of Prompt Issues and Fix Strategy

Date: 2026-04-25  
Scope: Deep analysis of the failure class, comparison against the v6 reference, and a staged fix plan.  
Constraint: No runtime code changes in this step.

## High-Level Summary

The system is failing not because the prompt is weak in general, but because too much structural correctness is still being delegated to prompt prose and model compliance.

Compared with v6, the current production path has drifted in two important ways:
1. It layers more run-shaped contracts directly into the default prompt path.
2. It still uses late repair behavior in Agent 6 that can synthesize meta-style clues from audit language.

That combination creates an unstable architecture:
- Agent 5 is over-constrained in natural language.
- Agent 6 is still asked to help rescue broken clue graphs.
- The hard-stop gate remains correct, so the pipeline aborts when the model does not satisfy all structural proof requirements.

The durable fix is not "more prompt text." It is to restore v6-style template discipline, move proof-critical rules into deterministic validation, and keep Agent 6 as an auditor rather than a primary structural repair engine.

## Pass 1 - Problem Diagnosis and v6 Comparison

## 1. What v6 got right

The v6 reference was strong because it emphasized a pass-first essential evidence chain:
1. mechanism visibility before the discriminating test,
2. contradiction of the false assumption before the test,
3. elimination logic before the test,
4. concrete case evidence rather than meta-audit language,
5. fail-fast status while still requiring a best-effort non-empty clue set.

This is the right philosophy. The model should be guided toward a concrete, solvable chain, while the system retains hard checks for failure.

## 2. Clause-by-clause v6 vs current template diff

The current production template is not a different philosophy from v6. It is mostly a v6-derived superset with extra run-shaped clauses and retry protocol text layered into the default path.

## 2.1 Clauses that are materially the same

These core clauses are preserved from v6 in the current Agent 5 template:
1. do not invent facts,
2. do not emit meta-audit clues,
3. keep essential solving clues early or mid,
4. require fixed IDs for mechanism visibility, contradiction chain, and elimination chain,
5. require discriminating evidence IDs to appear exactly,
6. require source-path legality and bracket-index leaf formatting,
7. require per-step mapped coverage and contradiction coverage,
8. require fail-fast status when structural contracts are broken,
9. require anti-collapse best-effort non-empty clue output,
10. require structured retry self-check when correction targets are provided.

Conclusion:
- the foundation is still recognizably v6.
- the current problem is not loss of the v6 core.

## 2.2 Clauses added beyond clean v6 default behavior

The current production template adds several clause families on top of the v6 core.

### A. Fair-play feedback preamble in the default prompt path

Current template injects a Fair Play Audit Feedback section and recommendations into the developer prompt when feedback is present.

Impact:
- useful for remediation,
- but it begins mixing template doctrine with dynamic retry-state context.

### B. V5 deterministic source mapping block

Current template includes a high-priority block with:
1. explicit source shortlist,
2. exact ID-to-source mapping,
3. exact step coverage floor,
4. suspect parity floor,
5. direct culprit-evidence floor,
6. late-clue floor.

Impact:
- these are valid constraints,
- but in v6 they are better understood as deterministic payload or validator state, not default prompt prose.

### C. V6 rule names embedded into the user prompt

Current template explicitly names:
1. V6 CULPRIT RULE,
2. V6 LATE-CLUE RULE.

Impact:
- useful for traceability,
- but it turns the user prompt into a layered changelog of historical hardening waves rather than a clean stable template.

### D. Retry protocol expansion

Current template appends:
1. correction target restatement,
2. structured correction payload,
3. hard retry contract,
4. optional explicit red-herring rewrite instructions.

Impact:
- v6 supported retry guidance,
- current production has expanded it into a second protocol living inside the same prompt surface.

### E. Micro-exemplars and extra style constraints

Current template includes weak/strong examples and extra presentation constraints in the same prompt body.

Impact:
- low direct harm,
- but contributes to instruction density and attention competition.

## 2.3 Net clause assessment

Clause-level conclusion:
1. current production has not abandoned v6,
2. current production has overloaded v6,
3. most drift is additive rather than subtractive,
4. the additive drift is what makes the prompt less stable and less generic.

This matters because a template can become worse without removing any good clauses, simply by stacking too many differently-scoped requirements into the same natural-language surface.

## 3. Where current production has drifted from clean v6 behavior

### 2.1 Prompt overload

The current Agent 5 prompt builder contains:
1. broad generic hardening,
2. V2 contracts,
3. V5 deterministic source mapping blocks,
4. V6 culprit and late-clue rules,
5. structured retry payloads,
6. hard retry contract text.

This is not just "strict." It is stacked instruction density.

Effect:
- the model is asked to satisfy too many differently-scoped rules at once,
- static template rules and run-specific payload rules are interleaved,
- retry instructions start to resemble a second protocol layered on top of the first.

### 2.2 Deterministic contracts are still expressed as prompt prose

The key correctness rules are structural:
1. legal source paths,
2. exact ID-to-source mappings,
3. per-step contradiction coverage,
4. discriminating evidence readiness,
5. suspect parity,
6. pre-test visibility.

These should be machine-enforced invariants. Instead, many are still being communicated as natural-language instructions inside the prompt.

Effect:
- the model can produce text that is locally plausible but globally non-compliant,
- retries become negotiation rather than deterministic correction,
- a prompt can look excellent on paper and still fail structurally.

### 2.3 Production path is more run-shaped than the clean v6 baseline

The v6 comparison documents already identified the desired direction: template parity with v6 static clauses, while avoiding extra strict first-pass payload injection in the default path.

The live production path now supports strict first-pass prompt feedback objects and merges them into Agent 5 calls when enabled.

That is useful as an experiment, but architecturally it changes the problem shape:
- the prompt stops being a reusable template and becomes a case-specific contract dump,
- correctness depends on how well the model obeys a large run-shaped instruction set,
- the default mental model shifts from "generic template + validation" to "prompt-enforced determinism," which is brittle.

### 2.4 Agent 6 still performs meta-style rescue

Agent 6 contains repair behavior that can synthesize clues from audit violation language.

This is the clearest anti-v6 pattern still present.

Why it is harmful:
1. audit prose is not evidence,
2. a clue derived from violation wording may satisfy timing shape without restoring true reader-solvable logic,
3. the system can appear to repair visibility while actually weakening narrative-natural causality.

This is how you end up with structurally noisy clue sets that still fail the final audit.

### 2.5 Repair is happening too late

The orchestrator gate is correctly strict. The problem is that the system waits too long to discover that the clue graph is not truly solvable.

Current shape:
1. Agent 5 generates,
2. deterministic cleanup patches some issues,
3. Agent 6 audits and may attempt rescue,
4. final structural gate blocks.

The correct shape should be:
1. build strict machine-readable contract,
2. Agent 5 generates,
3. deterministic validator accepts or rejects,
4. only validated outputs go to Agent 6 audit.

## 4. Root cause in one sentence

The current architecture still relies on LLM obedience for proof-critical structure and then tries to repair failures too late with partially meta-driven mechanisms.

## Pass 2 - Staged Fix Strategy

## Step 1 - Freeze the canonical v6 baseline

Goal:
- define the canonical static template that production should match in spirit and clause ordering.

What to keep from v6:
1. pass-first essential chain,
2. no meta clues,
3. fail-fast with best-effort clue output,
4. concrete evidence grounding,
5. clear separation between essential solving clues and optional late texture.

What not to preserve in the default template path:
1. historical hardening labels inside user prompt text,
2. exact run-shaped ID-to-path mapping prose,
3. expanded retry payload doctrine in the first-pass template.

Why first:
- without a frozen baseline, every later fix risks mixing new logic with existing prompt drift.

## Step 2 - Split template from contract payload

Goal:
- keep a generic reusable prompt template,
- move run-specific strictness into a separate deterministic contract object.

Template should contain only:
1. role,
2. output schema,
3. invariant behavioral rules,
4. high-level solving philosophy.
5. stable retry semantics only at the level of protocol, not run payload detail.

Contract payload should contain only:
1. allowed source paths,
2. required IDs,
3. required mappings,
4. per-step floors,
5. placement floors,
6. discriminating evidence requirements.

Why this matters:
- it reduces prompt overload,
- it makes the template reusable,
- it makes failures attributable to explicit contract violations instead of vague instruction non-compliance.

Template-level keep/remove decision:
1. keep v6 invariant clauses verbatim or near-verbatim when they describe timeless behavior,
2. remove V5 source shortlist prose from the default template,
3. remove exact ID-to-path mapping prose from the default template,
4. move direct culprit and late-clue exact-slot floors into contract payload fields,
5. keep retry scaffolding generic and inject only narrow violation data.

## Step 3 - Make contract enforcement deterministic before Agent 6

Goal:
- do not ask Agent 6 to discover basic structural defects that Agent 5 outputs can be machine-validated for immediately.

Deterministic checks should cover:
1. source legality,
2. source format,
3. ID exactness,
4. per-step mapped coverage,
5. per-step contradiction coverage,
6. suspect elimination parity,
7. pre-test readiness for discriminating evidence,
8. prohibition of meta-audit clue text.

Why this is the biggest leverage fix:
- it changes the system from "prompt says obey this" to "system verifies this."

## Step 4 - Simplify retry into bounded delta repair

Goal:
- retries should fix explicit machine-readable defects, not re-open the whole clue design problem.

Retry inputs should be:
1. violation code,
2. affected clue IDs,
3. allowed replacement scope,
4. unchanged sections to preserve.

Retry should not:
1. restate the full doctrine,
2. inject large new narrative instructions,
3. re-argue the entire fair-play contract.
4. restate exact first-pass contract payload sections unless the retry specifically changes them.

Why:
- every extra retry layer increases entropy and makes outcomes less reproducible.

## Step 5 - Remove meta clue synthesis from Agent 6

Goal:
- Agent 6 should not convert audit language into clue text.

Allowed Agent 6 behavior:
1. audit,
2. classify failure type,
3. produce structured repair feedback,
4. trigger upstream revision when needed.

Disallowed Agent 6 behavior:
1. emit clues whose primary content comes from violation phrasing,
2. patch visibility by inventing "reader-visible" statements disconnected from concrete CML evidence.
3. emit parity-bridge or inference-step backstop clues whose text is framed as pre-test / reader-visible / step-number scaffolding instead of case evidence.

Why:
- this is the most direct way to stop meta repairs from masking unresolved logic problems.

## Step 6 - Re-scope Agent 6 as judge plus structured router

Goal:
- keep Agent 6 authoritative for fairness judgment, but not responsible for inventing proof structure.

Practical role:
1. if deterministic contracts fail, Agent 6 should not be called yet,
2. if deterministic contracts pass but fairness still fails, Agent 6 should emit typed failure context for upstream revision,
3. if fairness passes, orchestration proceeds.

Why:
- this restores clean separation of responsibilities.

## Step 7 - Roll out in logical order

Recommended order:
1. freeze v6 baseline,
2. simplify default template,
3. add deterministic pre/post Agent 5 validation,
4. bound retry scope,
5. remove Agent 6 meta synthesis,
6. validate against replay and full run,
7. only then consider optional stricter first-pass contract experiments.

## Fixes grouped by logical workstream

## Workstream A - Template discipline

Summary:
- restore one generic default template aligned to v6 intent.

Includes:
1. freeze canonical template sections,
2. keep v6 invariant clauses as the stable base,
3. remove mixed-scope instruction layering,
4. remove run-specific source shortlist prose from default path,
5. keep static clauses stable across runs.

## Workstream B - Deterministic contract layer

Summary:
- move proof-critical requirements out of prose and into machine-checkable payloads and validators.

Includes:
1. path whitelist,
2. mapping contracts,
3. coverage floors,
4. discriminating-evidence timing,
5. direct culprit exact-slot requirements,
6. late-clue exact-slot requirements,
7. anti-meta validation.

## Workstream C - Retry redesign

Summary:
- make retry small, typed, and bounded.

Includes:
1. violation-code-driven correction,
2. targeted ID rewrite scope,
3. preserved unaffected clues,
4. capped retry budget.

## Workstream D - Agent 6 decontamination

Summary:
- remove meta clue repair and keep Agent 6 focused on fair-play judgment.

Includes:
1. stop audit-language clue synthesis,
2. keep typed audit output,
3. route repair back upstream.

## Workstream E - Validation and rollout

Summary:
- prove parity with v6 and stability in real runs before any broader rollout.

Includes:
1. prompt snapshot parity checks,
2. replay validation,
3. canary/full run validation,
4. telemetry confirmation that warnings and synthetic rescue behavior decline.

## Final Recommendation

Do not start by adding more prompt clauses.

Start by treating the current template as an overloaded superset of v6, not as a missing-v6 problem.

Then:
1. keep the v6 invariant core,
2. strip additive run-shaped contract prose out of the default template,
3. move those exact constraints into deterministic payloads and validators,
4. reduce retry to bounded delta repair,
5. remove Agent 6 meta rescue.

That sequence addresses the real root cause instead of continuing to harden the prompt surface itself.
