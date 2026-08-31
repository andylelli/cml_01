# WF-001 — ch9/ch10 root cause

**Run:** `wf_7fefb661-6df` · **Date:** 2026-08-30
**Agents:** 10 · **Subagent tokens:** 1,386,850 · **Tool uses:** 451 · **Duration:** 47.7 min
**Script:** `ch910-root-cause-wf_7fefb661-6df.js`
**Shape:** 4 parallel traces → prompt-log evidence → 4 adversarial refuters → synthesis

---

## The question

Why do the last two chapters both walk the innocent suspects and re-clear them? An external reader
had made the same complaint on three manuscripts: *"Chapter 10 does not reveal the culprit. It
re-clears Beatrice, Sylvia, and Hugo almost line by line."* Three fix attempts had failed.

Three structural hypotheses were already dead before the workflow started (finale has no material
t=0.18; a dedicated clearing chapter INVERTED at t=−2.79; reveal-promising title t=0.77), so the
brief was explicitly told not to re-derive them.

## THE ROOT CAUSE — we ordered it, then rejected chapters that omitted it

**MEASURED** over 557 Agent-9 prose prompts in `logs/llm-prompts-full.jsonl`:

```
prompts carrying "SUSPECT CLEARANCE REQUIRED (MANDATORY)": 172
by chapter:  ch8=37   ch9=74   ch10=61   — and never ch1–7
```

On the complained-about run the **byte-identical suspect list** went to Ch8, Ch9 AND Ch10, while
Ch10's prompt simultaneously carried the aftermath contract forbidding per-suspect recitation. A
per-chapter lint gate (`suspect_clearance_missing`, `lint.ts:520-568`) then **regenerates any chapter
that omits the roll-call**.

That is why three rounds of prohibition text failed: **a prohibition cannot beat a gate that
regenerates the chapter until the thing is present.**

## The cause of the cause — found one level below the workflow

The existing exclusivity in `obligation-block.ts` depends on exact CML/outline coordinate matching.
That match essentially never happens:

```
clearance refs matching an outline scene:  1 of 116  (1%)
books where ANY ref matches             :  1 of 29   (3%)
```

The CML numbers scenes against a nominal ~6-scene story (act 3, scene 5); the outline numbers them
globally (act 3, scenes 8–10). **Incompatible by construction**, so the exact-match branch is dead
code and every book falls through to `/clear|alibi|ruled out|eliminat/`, which matches every late
chapter. An ownership latch alone would NOT have helped — it would have latched onto coordinates
resolving to nothing.

## What was ruled out

- **`SuspectClosureValidator` is NOT the cause.** It validates per-SUSPECT over the WHOLE manuscript
  (`story.scenes.some(...)`, `suspect-closure-validator.ts:111`); one satisfying chapter anywhere
  retires a suspect for the run. Verified: 22 of 28 stored manuscripts still pass with BOTH final
  chapters deleted.
- **The geometry `clearanceBudget` is a ceiling, not a floor** (`accept.ts:1048`).

## Fixes built

| fix | file | flag |
|---|---|---|
| Clearance ownership resolved once per book — ordinal-within-act reconciliation, prefers a chapter that signals clearing, one owner per suspect, finale structurally ineligible | `packages/prompts-llm/src/agent9-prose/clearance-ownership.ts` (new) | `AGENT9_CLEARANCE_OWNERSHIP` |
| Applied as a filter on BOTH the prompt and the lint gate so they cannot disagree | `obligation-block.ts`, `deterministic-repair.ts` | same |
| Clearance budget counted the victim and detective as suspects (`c?.role` always undefined; `roleOf` 8 lines below reads all three spellings). Budget 5 instead of 3 — and the complained-about chapter had exactly 5 clearance sentences, so the gate could never bind | `packages/story-geometry/src/derive.ts` | `STORY_GEOMETRY_ROLE_FIELD_FIX` |
| Validator demanded the murder VICTIM be cleared, with no repair path (the injector's list excluded victims since A_68). 2 of 2 corpus-wide validation failures | `packages/story-validation/src/suspect-closure-validator.ts` | unconditional |

**Verified on the failing run:** flag off → ch8/9/10 all ordered AND gated; flag on → only ch9
("Clearing the Innocent"), both sides agreeing. Across 29 books: 92 refs owned, 0 books where the
finale owns a clearance. Closure-validator failures 2 → 0.

## Benefit

- Removes a defect the reader named in **three separate reads**, at source rather than by instruction.
- Unblocks two runs that previously died demanding the corpse be cleared.
- Makes the clearance cap able to bind for the first time.

## What it could not determine

Whether removing the mandate actually stops the model re-clearing. Prompt and gate are verified
clean; behaviour is not. That needs a run.
