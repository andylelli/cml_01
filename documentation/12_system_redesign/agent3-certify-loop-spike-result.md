# Agent 3 — live certify-loop spike result (§9.1 steps 2–3)

> The last unverified falsification criterion of the keystone bet: **can the real model read a
> `SOLUTION_NOT_UNIQUE` counterexample from the deterministic certifier and converge — via a
> propose→verify→repair loop — to a clean fair-play certificate, in bounded turns, without
> cheating?**
>
> **Verdict: GO.** After two cheap, predicted harness fixes, both available models converge in a
> single turn. The story below is the honest before/after — the first round failed, the failure was
> diagnosed precisely, and the fix flipped it to a clean pass.

- Harness: [`scripts/cml-core-certify-loop.mjs`](../../scripts/cml-core-certify-loop.mjs)
  (`node --use-system-ca scripts/cml-core-certify-loop.mjs`, Azure creds from `.env`).
- Loop: the pure, unit-tested [`runCertifyLoop`](../../packages/cml-core/src/repair-loop.ts).
- Case: the §4.6 clock-set-fast BROKEN fixture. Certifier = ground truth; the model is only the proposer.

## Round 1 — the naive harness FAILED (and that was informative)

Driving the §4.6 broken case (`SOLUTION_NOT_UNIQUE: {vale, carrow}`) with an add-only action space:

| Model | Outcome | What happened |
|---|---|---|
| `gpt-4o-mini` (minimal prompt) | NO — `no_progress` | Placed Vale in the **kitchen** (reachable → no alibi); looped. |
| `gpt-4o-mini` (world-rules scaffold) | NO — `no_progress` | Turn 1 *correct* (`vale@away` flipped uniqueness) but couldn't do the 2nd bookkeeping step; looped. |
| `gpt-4o-mini` (+ `eliminate_suspect` op) | NO — `no_progress` | `vale@away [480,492]` **contradicted the existing "Vale boarded the station train" clue** → timeline engine: *"vale is in two places at once."* Looped. |
| **`gpt-4.1`** (same) | NO — `no_progress` | **Identical** failure: `vale@away` → same timeline contradiction → looped. |

The decisive diagnosis: both models proposed a *locally-valid* alibi (a precluding location covering
the window) that *globally contradicted* a clue already in evidence. The **timeline engine caught it
every time**, and the loop stopped cleanly with **no false certificate**:

```
turn 1: ok=false  timeline: vale is in two places at once: station [492,492] and away [480,492].
turn 2: ok=false  timeline: vale is in two places at once: station [492,492] and away [480,492].
```

This falsified the naive "hand the model the checker and it converges" assumption and pinpointed
that the gap was the **harness/action space**, not raw model capability (a strong model, `gpt-4.1`,
failed the same way).

## The two fixes (predicted, then built)

1. **An `extend_presence` action** ([`repair-loop.ts`](../../packages/cml-core/src/repair-loop.ts)):
   widens a suspect's **existing** presence at a location to cover the window (or adds one if none),
   then attaches it to the eliminating step. Because it *extends a known whereabouts* rather than
   inventing a new one, it **cannot create a "two places at once" contradiction by construction.**
2. **Reconcile-with-evidence feedback** in the harness: surface each spare suspect's known
   whereabouts ("Vale is already placed at: station → EXTEND it to cover [480,492]") and, on a
   timeline contradiction, explicitly steer the model to extend rather than invent.

Both are covered by a new offline test (`extend_presence` converges in one turn with a clean
re-certify and a single, widened presence) — **34 cml-core tests green.**

## Round 2 — clean GO on BOTH models

```
############# gpt-4o-mini #############
  turn 1: model → extend_presence (vale@station [480,492])
  turn 1: ok=true
RESULT: converged=true turns=1 stoppedReason=converged
  final certificate: ok=true uniqueAmong=[carrow]
  independent re-certify of the model's output: ok=true
GO/NO-GO: GO — the model read the counterexample and converged to a certificate.

############# gpt-4.1 #############
  turn 1: model → extend_presence (vale@station [480,492])
  → converged=true turns=1, ok=true, uniqueAmong=[carrow], GO
```

Both models — *including the weak `gpt-4o-mini`* — made exactly the right move in **one turn**:
extend Vale's **station** presence to cover the window (the station-master fact, reconciling with
the boarding clue instead of contradicting it). That is precisely the §4.6 repair.

## Verdict — the keystone bet holds

- **Checker decides (step 1):** proven — golden + adversarial corpus, robust enough to catch a
  *second-order* contradiction in the model's own naive repair (Round 1).
- **Model reads the counterexample and proposes the right repair (step 2):** proven — both models
  extend the station presence.
- **The loop converges in bounded turns without cheating (step 3):** proven — 1 turn; suspects never
  deleted; independent re-certify always agrees; offline guards cover oscillation/budget/give-up.

The earlier `NO` was a harness gap, not a capability wall: two small, predicted fixes flipped it to a
clean GO on every model available here. **The LLM proposes; the solver disposes; and the loop
converges to a proof.**

## Broadened coverage (update)

The keystone now spans more than the single temporal case. The engines were generalised to model
**capability/access** eliminations (locked-room keys, unique-means knowledge) alongside alibi-timing,
with golden fixtures for a locked-room, a unique-means, and a mixed 6-suspect circle (41 cml-core
tests green). The live loop has since converged **in one turn on a capability case too**:

```
CML_LOOP_CASE=locked, gpt-4.1:
  turn 1: model → establish_capability (dunmore lacks key_to_study)
  → converged=true, ok=true, uniqueAmong=[reeve]   GO
```

So there are now live GOs on **two distinct fair-play structures** (temporal `extend_presence`;
capability `establish_capability`) across the available models.

## Honest caveats

- **Available Azure models** (`gpt-4o-mini`, `gpt-4.1`; the redesign's stated target Opus 4.8 was not
  deployed here, but `gpt-4.1` passing is strong evidence). Two structures are now covered live;
  richer mechanisms (identity swaps, multi-step substitution) are future work.
- The fix moves a slice of work from model to solver (`extend_presence` does the attach
  bookkeeping) — the §9.6 #4 "what the LLM proposes vs what the solver fills" line, drawn
  deliberately toward the solver. The model still supplies the *logic*: which suspect, which
  precluding location, which covering interval.

## Bottom line

The keystone's hard, decidable half is **real and robust**; the propose→verify→repair loop is
**sound and converges**; and the open work is now the *next* increments on the §7 ladder (broader
cases, the typed core emitted under constrained decoding, then flipping the exit condition) — not
the foundational bet, which is **proven**.
