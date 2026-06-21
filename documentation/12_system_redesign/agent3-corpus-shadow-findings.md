# Agent 3 — corpus shadow measurement (findings)

> The §9.5 "killer measurement": run the new [`@cml/cml-core`](../../packages/cml-core/) fair-play
> engines over every already-shipped CML we can find, via a best-effort parser from today's stringy
> fields into the typed core, and report **how many cases the checker can even run on — and of
> those, how many it would fail.**
>
> Reproduce: `node scripts/cml-core-shadow.mjs` (see [the script](../../scripts/cml-core-shadow.mjs)).

## Method

- **Corpus (6 distinct shipped CMLs).** Collected from `data/store.json` artifacts (`payload.CASE`)
  + captured `Agent3-CMLGenerator` responses under `documentation/prompts/actual/` (5 historical
  runs recovered from git history into `scripts/.corpus-cache/`, plus the live run). Deduplicated by
  `title|suspects|culprit`.
- **Best-effort parser** (deliberately lossy — that is the point). For each CML it tries to extract
  the typed core: suspects (from `closed_circle.suspects`, else cast minus victim/detective), the
  named culprit (`culpability.culprits[0]`), a machine crime window (English-time parsing of
  `constraint_space.time` / `hidden_model`), per-suspect **timed precluding alibis** (a parseable
  time **and** a specific elsewhere-location in `alibi_window`), and **structured eliminations**
  (an inference step whose text names a non-culprit suspect with elimination language).
- A case is **uniqueness-checkable** only if a crime window plus a precluding timed alibi for each
  non-culprit suspect can be extracted — i.e. enough structure to actually run the engine.
- **Engine control:** the same run certifies the typed §4.6 fixtures (`broken.ok=false`,
  `repaired.ok=true`) to prove the checker works *when the data is structured* — isolating the
  corpus's shape as the variable.

## Headline

| Measure | Result |
|---|---|
| Shipped CMLs analysed | **6** |
| Uniqueness-**checkable** today (machine time + access) | **0 / 6 (0%)** |
| → **NOT** machine-checkable for fair-play uniqueness | **6 / 6 (100%)** |
| Machine-timed precluding alibis, corpus-wide | **0** (0/4, 0/3, 0/3, 0/4, 0/3, 0/6) |
| Structured eliminations in the inference path | 0 in 5/6; 1/4 in the newest |
| Engine control (typed fixtures) | broken=fail, repaired=pass ✓ |

Secondary, **structural-lite** signals (computable even on prose CML — no times needed):

| Signal | Cases |
|---|---|
| CML ships with **no named culprit at all** (`culprits: []`) | **2 / 6** |
| Named culprit not among the suspects | 0 / 6 |
| Inference path never names the (named) culprit | 2 / 6 |
| Path does **not** address every other suspect (incomplete elimination) | **6 / 6** |
| No `discriminating_test.evidence_clues` | 1 / 6 |

## Interpretation

The uniqueness engine **works** (the control passes), but it **cannot run on a single shipped
case**: today's CML encodes alibis, timeline, and eliminations as **prose** (`alibi_window:
"Present at manor estate throughout"`; inference `effect: "Narrows ... notably John Avery"`), so the
per-suspect timed presence facts the checker needs **do not exist as data** — zero, across the whole
corpus, even after a robust best-effort parse.

This is a **stronger** result than the redesign anticipated. The plan expected to report "X% of
shipped cases are non-unique." Instead the finding is: **fair-play today is not merely *unverified*
but *unverifiable*** — 100% of shipped cases. You cannot measure whether the clues entail the
culprit uniquely, because the clues' logical content was never represented in a checkable form.

And the structural-lite signals — runnable even on prose — already expose real defects the
schema-only gate passed: **2/6 cases ship with no named culprit**, and **6/6 inference paths fail to
even mention every non-culprit suspect**, so by the weakest possible "does the reasoning rule
everyone else out?" test, *every* shipped case is incomplete.

This is the justification for the typed core, made concrete: it moves the load-bearing logic from
prose into a structure where "does it solve, uniquely?" is **decidable** — exactly what the §4.6
golden proves is possible once the data is typed.

## Caveats (honest scope)

- **Small corpus (6).** Most historical reports/captures were deleted from the working tree; this is
  what survived on disk + in git. The *qualitative* result (0% machine-checkable; 0 timed alibis
  corpus-wide) is a property of the CML **shape**, not of corpus size — every case fails the same way
  for the same structural reason.
- **The parser is intentionally lossy.** Its job is to extract whatever machine logic exists; it
  found essentially none. A more aggressive NL parser could guess at times, but guessing
  reintroduces exactly the unverifiability the typed core is meant to remove.
- **Schema drift observed:** older (gpt-4o-mini) CMLs have **no `closed_circle` block at all** and
  inconsistent cast role labels — itself a signal that the stringy contract was never load-bearing.

## Next steps (per the plan)

1. The remaining §9.1 falsification criterion — **can Opus 4.8 read a `SOLUTION_NOT_UNIQUE`
   counterexample and converge via `tool_use`?** — needs live-model work (the only un-run spike step).
2. Then §7's ladder: emit the typed core alongside the prose under constrained decoding (P2), run
   the engines as a non-blocking diagnostic, flip the exit condition to the certificate, and retire
   `normalizeCml` / the backfill gate.
