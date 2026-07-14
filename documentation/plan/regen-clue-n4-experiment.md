# AGENT9_REGEN_CLUE — N≥4 A/B experiment protocol

**Flag under test:** `AGENT9_REGEN_CLUE` (LLD Appendix B; migration step 2 / P3.3).
**LLD row:** [`agent9-first-principles-LLD.md`](./agent9-first-principles-LLD.md) §12 Phase P3, §6.4, §9 step 2.
**Goal of the flag:** replace the **A1 deterministic clue/inference-surfacing injector** (which ships template scaffolding — the A_59 #1 mole) with a **scoped in-scene LLM regen** that plants the missing clue as dramatized prose, before the deterministic A1 patch runs. Wiring is default-off in [`generate.ts:2081/2628`](../../packages/prompts-llm/src/agent9-prose/generate.ts#L2628).
**Status:** staged, not yet run. This doc + `scripts/exp-regen-clue-*.mjs` are the harness; the run itself needs live LLM and is triggered manually.

---

## 1. Why a *paired* design (matched by construction)

Memory `canary-k2-single-run-confounded`: single runs lie, and **chapter count + opening-naming dominate** the K2 score. A between-cases A/B (fresh pipeline per arm) confounds the flag with those two factors. So we do not compare two fresh runs.

Instead we compare **the same case, prose-generated twice** — Agent 9 replayed over identical hydrated upstream artifacts (same Agent-7 outline ⇒ identical chapter count, identical opening), with the flag the *only* difference:

```
for each prior run R in the N-set:
    control_R   = runAgent9(hydrate(R))      with AGENT9_REGEN_CLUE unset
    treatment_R = runAgent9(hydrate(R))      with AGENT9_REGEN_CLUE=true
    pair (control_R, treatment_R) is matched by construction
```

`scripts/canary-agent-boundary.mjs --agent 9 --runId R` already does the hydrate-then-`runAgent9`. The flag is read from `process.env` at prose time, so toggling the env between the two invocations is the entire manipulation. N≥4 distinct prior runs give N matched pairs; case diversity across the N provides power without reintroducing the confound *within* a pair.

**This is a within-case paired test — strictly stronger than the N≥4 the LLD asks for**, because it removes the two dominant nuisance variables rather than balancing them.

---

## 2. The N-set (inputs the manual runner supplies)

Pick **≥4 prior run folders** under `documentation/prompts/actual/run_*` that:
- reached **Agent 7** with a **valid `narrative_outline`** (so Agent 9 hydrates without re-synthesising the outline — re-synthesis would spend LLM and break the "identical outline" match), and
- span a **range of chapter counts** (e.g. one ~8, two ~10, one ~12) so the result is not a single-length artefact.

> Note: `run_01150a9f` (the beat-abort this branch just fixed) is **not** eligible — its Agent-7 output is invalid. Generate fresh hydratable runs first (a couple of `npm run canary:core` passes now that the beat abort is fixed), or use existing complete runs.

The runner takes the list explicitly: `--runIds R1,R2,R3,R4`.

---

## 3. Arms & what each run emits

Each arm is one `canary-agent-boundary --agent 9` invocation with `CANARY_PROSE_DUMP_PATH` set. The boundary harness writes a dump JSON (see §5) containing the shipped prose, cast genders, Agent-9 cost/duration, the release-gate summary, and warnings. The orchestrator also captures child **stdout**, from which it parses the regen telemetry lines:
- `[Agent 9] regen-clue planted [clue_x, …] in chN` — a clue the regen dramatized (A1 patch suppressed for it).
- `[Agent 9] regen-clue UNRESOLVED chN clue_x: <reason>` — a clue the regen could not plant (fell through to the deterministic floor).

---

## 4. Metrics & the acceptance gate

Computed by `scripts/exp-regen-clue-analyze.mjs` (pure, offline, unit-tested). Per pair and aggregated over the N.

### Primary — the flag's contract (must improve or hold)
| Metric | Source | Gate |
|---|---|---|
| **A1 scaffold occurrences** (`A1:*` rules) | `detectScaffoldNotProse` (`@cml/prose-guard`) over shipped prose | treatment **≤** control per pair; aggregate treatment A1 total **→ 0** (the whole point) |
| **Clue presence** (release-gate clue-visibility / obligation hard-stops) | dumped `validationReport` release-gate summary | treatment hard-stop count **≤** control (no clue dropped by regen) |
| **Regen efficacy** | parsed stdout | `planted ≥ 1` on cases that had A1 injections in control; `unresolved` logged, not silent |

### Guardrails — no regression (LLD P3 acceptance)
| Metric | Source | Gate |
|---|---|---|
| **Total scaffold hits** (all rules) | `detectScaffoldNotProse` | treatment ≤ control aggregate |
| **Pronoun signals** | pronoun/misgender strings in dumped `warnings` + release-gate reasons; descriptive gendered-token totals | treatment introduces **no new** pronoun/misgender signal vs control (guards the known whole-chapter re-gender scar, LLD §6.4 risk a). NB: an absolute per-chapter misgender *count* needs the pipeline's antecedent-resolving pronoun verifier and is confirmed on the scored full run, not fabricated here. |
| **Release-gate hard-stops (any)** | dumped `validationReport` | treatment ≤ control |
| **Agent-9 cost** | dumped `agent9CostUsd` | aggregate treatment ≤ **2×** control (regens are cheap; §8 budget) |
| **Chapter count / word parity** | dump | per pair: chapter count identical (match sanity); words within ±20% |

### Secondary — needs the scored full pipeline (documented, not gated here)
The K2 **prose rubric ↑** is the ultimate P3 acceptance signal, but the boundary harness runs with `enableScoring:false`, so it is *not* computed here. The deterministic proxies above (A1 leakage removed, clue presence held, pronouns/cost safe) are the flag-scoped gate; the full K2 delta is confirmed on a scored full-pipeline arm as a follow-up before flipping default-on.

### Verdict
`PASS` iff every Primary gate holds **and** no Guardrail regresses across the aggregate. Any pair that regresses a guardrail is surfaced individually (the regen for that case is the thing to inspect — likely an unresolved clue that floored, or a paragraph-scope miss).

---

## 5. Dump JSON shape (written by the boundary harness)

Written to `CANARY_PROSE_DUMP_PATH` when set (additive, env-gated; unset ⇒ today's behaviour):

```jsonc
{
  "runId": "…", "agent": "9",
  "regenClueEnabled": true,                 // process.env.AGENT9_REGEN_CLUE at prose time
  "chapterCount": 10, "totalWords": 21840,
  "chapters": [{ "index": 1, "title": "…", "text": "…" }],
  "cast": [{ "name": "…", "gender": "male" }],
  "agent9CostUsd": 0.31, "agent9DurationMs": 128000,
  "releaseGate": { "status": "…", "hardStops": ["…"], "warnings": ["…"] },
  "warnings": ["…"]                          // full ctx.warnings
}
```

---

## 6. How to run (manual, live LLM)

```bash
# 0. (once) make sure dist is current
npm run build:all

# 1. run the paired A/B over ≥4 hydratable prior runs
node scripts/exp-regen-clue-ab.mjs --runIds R1,R2,R3,R4 --out results/regen-clue-ab

# 2. analyze the paired dumps → verdict table + PASS/FAIL
node scripts/exp-regen-clue-analyze.mjs --in results/regen-clue-ab
```

`exp-regen-clue-ab.mjs` runs each runId **twice** (control then treatment), writing
`results/regen-clue-ab/<runId>.control.json` / `.treatment.json` (dump + captured stdout signals).
`exp-regen-clue-analyze.mjs` reads the pairs and prints the §4 verdict.

**Offline pre-flight (no LLM, safe to run now):**
```bash
node --check scripts/exp-regen-clue-ab.mjs
node --check scripts/exp-regen-clue-analyze.mjs
node --test scripts/exp-regen-clue/__tests__
```

---

## 7. Decision after the run
- **PASS** → flip `AGENT9_REGEN_CLUE=true` in the canary env, run one scored full-pipeline confirmation for the K2 prose delta (§4 secondary), then default-on; proceed to P4 (convert A2 next — LLD §12 P4 order).
- **FAIL / mixed** → inspect the regressing pairs' regen output (unresolved clues, paragraph-scope misses); the flag stays off; iterate `runClueRegenPass` / `makeRegenFn`, re-run.
