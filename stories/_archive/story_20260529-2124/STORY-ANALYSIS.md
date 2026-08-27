# Story Review Analysis — The Tide and the Time

---

## Progress Table

### Shipped Fixes

| ID | Validator Error Targeted | Fix Summary | Fix Type | Status | Code Location |
|----|--------------------------|-------------|----------|--------|--------------|
| — | — | — | — | — | — |

### Backlog

| ID | Category | Issue Cluster | Proposed Fix | Status | Code Location |
|----|----------|--------------|--------------|--------|--------------|
| T29-1 | Generic | `pronoun_drift` | Re-enable `pronoun_validation_enabled` first (gate only); then `pronoun_checking_enabled` after diagnosing the fixer regression | GATE | `apps/worker/config/generation-params.yaml` (2 flags — ⚠️ staged re-enablement required; fixer was disabled deliberately) |
| T29-2 | Generic | `opening_style_repetition` | DO-NOT-REPEAT ban on last 3 openers + per-chapter mood directive from scene tag | CONSTRAINT + STATE | `packages/prompts-llm/src/agent9-prose/context-management.ts → buildChapterMoodDirective` (new) |
| T29-3 | Generic | Alibi-clearance note-phrasing | CHAIN pre-pass: LLM stages each clearance as a scene brief before chapter gen | CHAIN + FEW-SHOT | `packages/prompts-llm/src/agent9-prose/obligation-block.ts → buildClearanceStagingPrePass` (new) |
| T29-4 | Generic | Broken/cut-off phrases | Regex gate in validator + micro-regen on flagged sentences in generation loop | GATE + MICRO-REGEN | `packages/story-validation/src/prose-consistency-validator.ts → checkPhraseCompleteness` + `packages/prompts-llm/src/agent9-prose/generate.ts → runMicroRegen` (both new) |
| T29-5 | Generic | Victim anonymity | Strengthen existing `victimLine` in Case Overview; audit and patch "the victim" in obligation-block templates | STATE | `packages/prompts-llm/src/agent9-prose/prompt-builder.ts:385` + `packages/prompts-llm/src/agent9-prose/obligation-block.ts` (template phrases) |
| T29-6 | Generic | Inconsistent time phrasing | Add `variant_ban` list to clock-manipulation `lockedFact` in CML schema; extend `repairWordFormLockedFacts` to read it; inject variants into LLM prompt block | STATE + CODE | CML data (`variant_ban` field) + `apps/worker/src/jobs/agents/agent9-run.ts → repairWordFormLockedFacts` (extend) + `packages/prompts-llm/src/agent9-prose/prompt-builder.ts` (inject variants in locked-fact block) |
| T29-7 | Generic | Prose quality (holistic) | LLM-JUDGE: lightweight second call scores prose for broken phrasing, note-style, template repetition; micro-regen on failures | LLM-JUDGE + MICRO-REGEN | `packages/prompts-llm/src/agent9-prose/generate.ts → runChapterProseJudge` (new, inside `generateProse`) |
| T29-8 | Generic | DT scene scheduling | Outline-level gate after Agent 7: validate DT clue scheduled; targeted outline repair before prose starts | GATE | `apps/worker/src/jobs/mystery-orchestrator.ts` after `runAgent7` (line 935) — `validateDTScheduling` + `runAgent7Repair` (both new) |

**Status key:** 🔴 Not started · 🟡 In progress · 🟢 Done · ⬛ Deferred

---

## Step 1 — Source Review

**Source story:** `stories/story_20260529-2124/`
**Review file:** `stories/story_20260529-2124/chatgpt-review.txt`
**Review date:** 2026-05-29
**Score:** 67 / 100

**Cast summary:**
- Victim: unnamed throughout ("the victim") — reviewer suggests Sir Malcolm Verity
- Investigator: Henry Parkins (male)
- Culprit: Robert Eastwood (male)
- False suspects: Linda Gamble (female), Sharon Sheldon (female), Elisabeth Padgett (female)

**Key mechanism:** Tide marks on the terrace steps contradict the time shown on the victim's stopped clock — the clock was wound back 40 minutes after the murder to fabricate an alibi. Secondary clues: scratched winding key, rooftop semaphore lamp flash, elevator delayed-release modification.

---

## Step 2 — Issue Triage by Scoring Category

### 2.1 Premise / concept (score: 8/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Clue set is too large — tide, clock, scratched key, semaphore, elevator, grease smudge, security footage, fingerprints | All | Yes |
| Security footage feels anachronistic for post-war 1940s/50s setting | 7, 8, 9 | Yes |

### 2.2 Opening hook (score: 7/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Clock tampering revealed too explicitly in ch1 — "the murderer wound back the victim's clock" should be discovered later | 1 | Yes |

### 2.3 Plot structure (score: 7/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| DT-scene scheduling gap: ch4 has no fresh discriminating-test evidence clue in the outline (agent log confirmed) | 4 | Yes |

### 2.4 Character clarity (score: 5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Pronoun drift — Linda, Sharon, Elisabeth, and Parkins referred to with wrong pronouns | Multiple | No — Generic |
| Victim unnamed throughout; referred to only as "the victim" making the case feel abstract | All | Yes |

### 2.5 Dialogue (score: 5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Lines cut off mid-sentence (e.g. "before the clock was wound —") | 2, 3, 5 | No — Generic |
| Dialogue over-formal; some period tone works but feels laboured | Multiple | No — Generic |

### 2.6 Atmosphere / setting (score: 8/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Every chapter opening uses the same "cozy yet tinged with post-war unease" template phrase verbatim | 1–10 | No — Generic |
| Chapter location headings are often redundant with the opening paragraph | Multiple | No — Generic |

### 2.7 Mystery clues / evidence logic (score: 7/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Murder method never clearly stated — footage shows Eastwood "silencing" the victim but no physical act described | 8, 10 | Yes |
| Clue set so large that individual clues lose weight | All | Yes |

### 2.8 Pacing (score: 6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Some sections over-explain established facts (tide/clock contradiction restated in ch 2, 3, 4, 8, 9) | Multiple | Yes |
| Alibi-clearing chapter (7) is too long and repetitive | 7 | Yes |

### 2.9 Ending / reveal (score: 6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Motive stated in abstract terms ("fragile reputation") without specifics | 9, 10 | Yes |
| Eastwood's confession comes quickly with little resistance | 10 | Yes |

### 2.10 Prose / polish (score: 4/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Broken phrases — "after committing the killer", "two-thirds of an hour minutes", "four decades of minutes minutes" | 1, 3, 9 | No — Generic |
| Inconsistent time phrasing for same 40-minute manipulation: "forty minutes", "nearly three-quarters of an hour", "two-thirds of an hour", "four decades of minutes" | 1, 3, 8, 9 | Yes |
| Alibi-clearance lines written as scored notes, not prose: "Sharon Sheldon's alibi was confirmed because multiple witnesses saw them in [location] at the time." | 7, 10 | No — Generic |

---

## Step 3 — Validator Error Summary

| Error type | Severity | Count (est.) | Scoring category | Story-specific? |
|------------|----------|------|-----------------|-----------------|
| `pronoun_drift` | MODERATE | 5–8 | Character clarity | No — Generic |
| `opening_style_repetition` | MODERATE | Up to 10 | Pacing / Prose | No — Generic |
| `cml_test_not_realized` (DT gap ch4) | MAJOR | 1 | Mystery clues | Partial — outline scheduling |
| Broken / truncated phrases | — | 4–6 | Prose / polish | No — Generic |
| Alibi clearance note-phrasing | — | 4–6 | Character clarity, Ending | No — Generic |

**Notes from agent run log:**
- "[Agent 9] G4 DT-scene scheduling gap ch4: discriminating-test scene (4) has no fresh DT evidence clue scheduled in the outline" — this is an outline-level gap prose cannot repair.
- "[Agent 9] Deterministic pronoun sweep: 20 repair(s) across 10 chapter(s)." — 20 post-hoc repairs applied but reviewer still rates pronoun errors as "bad", meaning the gate is catching but not eliminating them.
- Ch8 batch 1 failed: "repeated long paragraph fingerprint detected" — resolved on retry.
- Ch10 batch 1 failed: both Sharon and Elisabeth clearances missing — resolved on retry.

---

## Step 4 — Strategic Fixes (Generic Issues Only)

---

### FIX-T29-1: STATE pronoun table + re-enable GATE (upgraded)

**Problem:** Characters — particularly the female suspects and Henry Parkins — are assigned wrong pronouns within chapters despite the automated sweep applying 20 repairs.

**Root cause:** Two compounding failures. First: `pronoun_checking_enabled=false` disables the per-chapter LLM pronoun check. Second and more important: the LLM has no reliable in-context anchor for pronouns — it has to infer them from character names and any distant prior context. In a 1,000-word chapter, an antecedent from 800 tokens ago is effectively invisible.

**Fix type:** STATE + GATE

**Why this is higher-confidence than just re-enabling the gate:**
The gate only catches and retries. The STATE block *prevents* the failure by placing a canonical pronoun table at the top of every chapter system prompt where it is always in the LLM's context window:

```
── CHARACTER PRONOUNS (CANONICAL — do not deviate) ──
Henry Parkins     → he / him / his
Robert Eastwood   → he / him / his
Linda Gamble      → she / her / hers
Sharon Sheldon    → she / her / hers
Elisabeth Padgett → she / her / hers
[Victim name]     → he / him / his
⛔ Using the wrong pronoun for any character above is a hard error.
```

The gate then becomes a cheap safety net for the rare miss, not the primary fix.

```yaml
# generation-params.yaml
agent9_prose:
  validation:
    pronoun_checking_enabled: true
```

**Code location:** `apps/worker/config/generation-params.yaml` — set `pronoun_checking_enabled: true` and `pronoun_validation_enabled: true`. No new function needed: `buildPronounAccuracyBlock` in `packages/prompts-llm/src/agent9-prose/prompt-blocks.ts` already generates the full `⛔ ABSOLUTE PRONOUN LOCK` block (10 rules, dynamic cast examples) and is injected as a `critical`-priority section into every chapter prompt. The STATE block is already there — both flags just need flipping.

> ⚠️ **Quality validation note — regression risk:** The YAML comment reads: *"Default false: LLM produces correct pronouns; the deterministic fixer introduces errors."* This was not a casual default — the fixer was deliberately disabled because it was making things **worse**. Before re-enabling, investigate what errors the fixer introduced. The safe approach: re-enable `pronoun_validation_enabled` first (enables the gate, no repair) and run a canary. If validation errors drop, re-enable `pronoun_checking_enabled` in a second canary.

> ⚠️ **Quality validation note — STATE block already present:** The ABSOLUTE PRONOUN LOCK is already in every chapter prompt at `critical` priority, yet pronoun errors still occurred. The block is placed last (recency fix) — highest recency position. The LLM is ignoring a block that is already there. This limits confidence in the 90–95% claim; realistically 65–75%.

**Validator signal:** `pronoun_drift` — gate will catch and retry; fixer re-enablement is separate risk

---

### FIX-T29-2: Per-chapter mood directive + rolling DO-NOT-REPEAT ban (upgraded)

**Problem:** Every chapter opens with the same atmospheric formula: "[Location] in St. Ives Bay, Cornwall, England held a cozy yet tinged with post-war unease weight to it; [sensory detail A], and [sensory detail B] completed the picture."

**Root cause:** Two problems. The OPENING_STYLE_ROTATION is not being respected. But more importantly: the template phrase is embedded in the chapter prompt *as a model answer* — banning it still leaves the LLM without direction on what to write instead, so it finds the next-closest template.

**Fix type:** CONSTRAINT + STATE

**Why this is higher-confidence:**
The ban alone is passive. Pairing it with a positive per-chapter mood directive gives the LLM a specific emotional target — it needs *less* creativity, not more:

```
── CHAPTER 3 MOOD DIRECTIVE ──
This chapter is CLAUSTROPHOBIC and MECHANICAL. The clock room is cold, tight,
smelling of oil and old metal. Parkins feels the walls closing in as evidence
mounts. Open INSIDE the room — do NOT start with a landscape or panorama.

⛔ DO NOT use any variation of these openers from previous chapters:
  - "cozy yet tinged with post-war unease"
  - "[Location] in St. Ives Bay, Cornwall, England"
  [last 3 chapter opening sentences extracted at generation time and injected here]
```

The mood directive is derived from the chapter's scene tag in the narrative outline — no new LLM call needed.

**Code location:** `packages/prompts-llm/src/agent9-prose/context-management.ts → buildChapterMoodDirective` (new function in existing file). `OPENING_STYLE_ROTATION` with 6 deterministic styles already exists in this file — the mood directive adds a per-scene emotional target on top of the rotation. **Caveat:** mood directive requires Agent 7 scene tags to carry atmosphere data; verify scene schema before depending on it. The DO-NOT-REPEAT ban on last 3 openers works unconditionally.

**Validator signal:** `opening_style_repetition` — expected to drop significantly

---

### FIX-T29-3: CHAIN pre-pass for alibi staging (upgraded — blue sky)

**Problem:** Alibi clearances read as scored validation notes: "Sharon Sheldon's alibi was confirmed because multiple witnesses saw them in [location] at the time."

**Root cause:** The obligation block is purely structural — it tells the LLM *what* to include but not *how* it should feel as a scene. The LLM fulfils the obligation by copying the structural template. A few-shot example improves this but the LLM still has to bridge from "instruction" to "drama" under a tight constraint.

**Fix type:** CHAIN + FEW-SHOT

**Why this is higher-confidence:**
Split into two LLM calls per alibi chapter:

1. **Pre-pass (new lightweight call):** Feed the list of suspects to clear and ask the LLM to generate a *scene brief* for each — a two-sentence staging of how the clearance emerges naturally in the scene. No prose output — just drama intention.

```
Suspect: Sharon Sheldon
Scene brief: The head waiter interrupts Parkins mid-question and volunteers
the information unprompted — Sharon was at his table all evening. Parkins
accepts it dryly: "An alibi vouched for by the man who refilled your wine
glass. Convenient, and probably true."
```

2. **Main chapter generation:** The scene briefs replace the structural obligation block. The LLM now has a dramatic staging to execute, not a checklist to satisfy. The validator still checks for structural clearance requirements as a hard gate.

**Code location:** `packages/prompts-llm/src/agent9-prose/obligation-block.ts → buildClearanceStagingPrePass` (new function in existing file). **Note:** clearance obligation text is already detailed — the `buildChapterObligationBlock` function currently specifies name, clearance method, connector, and in-scene moment requirements. The pre-pass replaces that structural directive with a staged dramatic brief; the existing structural validator still runs as a gate after prose is generated.

**Validator signal:** Reduces note-phrasing; expected dialogue score 5/10 → 7+; ending score 6/10 → 7.5+

---

### FIX-T29-4: Broken-phrase gate + targeted micro-regen

**Problem:** Multiple sentences are cut off mid-clause or contain malformed constructions: "after committing the killer", "two-thirds of an hour minutes", "before the clock was wound —".

**Root cause:** The LLM truncates or splices phrases when injecting constrained text alongside narrative. The post-processing pipeline has no sentence-level completeness check.

**Fix type:** GATE + MICRO-REGEN

**Fix description:**
Add a heuristic check for: sentences ending in em-dash (`\b(was|were|had|have|is|are)\s*[—–]`), word-doubling (`\b(\w+)\s+\1\b`), and common splice patterns ("after committing the [noun]"). On failure, run **MICRO-REGEN** — re-prompt with only the broken sentence(s) as input, not the full chapter. This keeps retry cost near-zero.

> ⚠️ **Quality validation note — regex coverage gap:** The stated patterns catch em-dash truncation and word-doubling. They do NOT catch "after committing the killer" (agent9-run.ts line 523: verb with inanimate object splice — this needs a semantic pattern like `\b(committing|killing|silencing)\s+the\s+(killer|victim|culprit|murderer)\b`) or "two-thirds of an hour minutes" (compound unit word-doubling — the `\b(\w+)\s+\1\b` pattern only catches adjacent identical single tokens, not "hour minutes" after a fraction phrase). Add at minimum: `\bcommitting\s+the\s+\w+\b` splice pattern and `\bof\s+an?\s+hour\s+minutes\b` compound-unit pattern.

**Code location:** `packages/story-validation/src/prose-consistency-validator.ts → checkPhraseCompleteness` (new method on `ProseConsistencyValidator` class); `packages/prompts-llm/src/agent9-prose/generate.ts → runMicroRegen` (new helper, called inside the batch retry loop in `generateProse`). **Note:** `agent9-run.ts` only calls `generateProse` — micro-regen logic must live inside `generate.ts` where the generation loop runs.

**Validator signal:** New: `broken_phrase_detected` — near-zero occurrence after gate + micro-regen

---

### FIX-T29-5: Victim name propagation via locked facts STATE block (blue sky)

**Problem:** The victim is never named throughout all 10 chapters — referred to only as "the victim", making the case feel abstract.

**Root cause:** The CML has a victim field but prose generation receives the victim only as a role label. The LLM defaults to the role label when no canonical name is locked.

**Fix type:** STATE

**Why this is near-certain to work:**
This is a data-wiring fix, not a persuasion fix. The name already exists in the CML. It just needs to be injected into the locked-facts block that already exists in the chapter prompt:

The victim name is already resolved in `prompt-builder.ts` via `castCharacters.find(c => c.role === 'victim')` and injected as `Victim: ${victimName}` in the Case Overview. The fix is a one-line strengthening of the existing line:

```typescript
// packages/prompts-llm/src/agent9-prose/prompt-builder.ts:385 — current:
const victimLine = victimName ? `\nVictim: ${victimName}` : '';
// Change to:
const victimLine = victimName
  ? `\nVictim: ${victimName} — always use this name in prose. Never write "the victim" as a substitute.`
  : '';
```

> ⚠️ **Quality validation note — obligation block is the real driver:** The phrase "the victim" appears in obligation block templates independently of the Case Overview header — e.g. `"include a paragraph that names the victim's cause of death"`. The LLM echoes this template language regardless of what the header says. The `victimLine` one-liner is necessary but not sufficient. To fully eliminate "the victim" substitution, the obligation block templates in `obligation-block.ts` must also be updated to use the victim's resolved name, not the role label. This is a second, separate change.

**Code location:** `packages/prompts-llm/src/agent9-prose/prompt-builder.ts:385` (1-line change to existing `victimLine`); also audit and patch `packages/prompts-llm/src/agent9-prose/obligation-block.ts` for "the victim" template phrases.

**Validator signal:** No existing validator — but character_clarity 5/10 → 7+ and premise engagement improve immediately

---

### FIX-T29-6: Canonical clock-shift value locking (blue sky)

**Problem:** The 40-minute clock manipulation is described four different ways: "forty minutes", "nearly three-quarters of an hour", "two-thirds of an hour minutes", "four decades of minutes minutes" — the last two are malformed.

**Root cause:** No canonical form is locked. The LLM paraphrases each time, producing creative variants, some broken.

**Fix type:** STATE

**Fix description:**
This is a **CML data fix**, not a new code function. The locked facts pipeline already pulls `hardLogicDevices.devices[*].lockedFacts`, annotates them, and enforces canonical forms via `repairWordFormLockedFacts`. The fix is adding a `variant_ban` list to the clock-manipulation locked fact in the CML / hard-logic schema:

```yaml
lockedFacts:
  - description: "clock wound back"
    value: "forty minutes"
    variant_ban:
      - "three-quarters of an hour"
      - "two-thirds of an hour"
      - "nearly an hour"
```

**Code location:** CML hard-logic device schema data + wire `variant_ban` through the existing annotation loop in `agent9-run.ts:2092` (`annotatedLockedFacts` map) so `repairWordFormLockedFacts` and `enforceLockedFactValuePresence` can use it.

> ⚠️ **Quality validation note — three separate code changes required:** `repairWordFormLockedFacts` (in `agent9-run.ts`) handles time-of-day and case variants via a generic fallback (`canonical.length >= 6` verbatim pattern). The generic fallback will NOT catch "nearly three-quarters of an hour" → "forty minutes" because they share no tokens. The `variant_ban` field is currently not read by `repairWordFormLockedFacts` — it would be silently ignored. Three changes needed: (1) add `variant_ban?: string[]` to the `LockedFact` type, (2) extend the repair loop to build a regex for each banned variant, (3) inject the variants into the LLM prompt block as `"NEVER write: [variants]"` so the LLM prevents generation rather than just repairing post-hoc. This is a code change, not just CML data authoring.

**Validator signal:** Eliminates word-doubling variants; prose/polish score improvement

---

### FIX-T29-7: LLM-JUDGE prose quality gate (blue sky — highest impact)

**Problem:** Prose/polish scores 4/10 — the single biggest drag. Issues co-occur in every chapter: broken sentences, note-like exposition, atmosphere templates, summary-like endings.

**Root cause:** The existing gate checks structural obligations (clue presence, clearances, DT scene) but has no holistic prose quality check. The LLM passes the structural gate while still producing poor prose because poor prose doesn't violate any structural rule.

**Fix type:** LLM-JUDGE + MICRO-REGEN

**Why this is the highest-leverage single fix:**
A dedicated judge LLM call can catch everything the regex gate cannot — it sees the chapter *as a reader would*, holistically. It catches weak paragraph endings, repeated structure, note-like exposition, and over-formal dialogue in a single pass. Pairing with MICRO-REGEN (only fix flagged sentences, not the full chapter) keeps cost negligible.

```
JUDGE PROMPT:
Score this chapter on (each 0–10):
  A. Sentence completeness — no cut-off clauses or malformed constructions
  B. Opening variety — does not reuse a template from previous chapters
  C. Natural phrasing — no note-like or report-like exposition
  D. Dialogue authenticity — characters speak as people, not as statements

Return JSON: { "A": N, "B": N, "C": N, "D": N, "flag": ["sentence 1...", "sentence 2..."] }
If any score < 7, list the specific sentences to fix in "flag".
```

On any dimension < 7: **micro-regen** the flagged sentences only. Full chapter retry only if micro-regen fails twice.

**Cost estimate:** ~$0.002 per chapter judge call (gpt-4o-mini). For a 10-chapter story: +$0.02 total — negligible.

> ⚠️ **Quality validation note — Dimension B invalid as designed:** Dimension B ("Opening variety — does not reuse a template from previous chapters") requires comparing the current chapter's opening against previous chapter openings. The judge receives ONE chapter per call. Without a `priorOpenings` list injected into the judge prompt, Dimension B is unenforceable and will return arbitrary scores. Fix: pass the last 3 chapter opening sentences into the judge prompt explicitly (source: `chapterSummaries[n].keyEvents[0]` which captures the first sentence of each committed chapter). Dimension B becomes valid only once this context is provided.

> ⚠️ **Quality validation note — T29-2 + T29-7(B) interaction:** Once T29-2's DO-NOT-REPEAT ban is active (injecting prior opening sentences as forbidden), Dimension B of the judge becomes redundant. Disable Dimension B in the judge when T29-2 is active to avoid double-enforcement.

> ⚠️ **Quality validation note — T29-4 + T29-7(A) interaction:** Dimension A (sentence completeness) and T29-4's regex gate both detect broken sentences. Specify which runs first. Recommended: regex gate (T29-4) fires first as a cheap pre-check; if it passes, the judge (T29-7) confirms holistically. If T29-4 fires, micro-regen runs before the judge sees the chapter.

> ⚠️ **Quality validation note — sentence localization for micro-regen:** `"flag": ["sentence text..."]` requires locating the exact sentence back in the chapter text for targeted repair. Exact string matching is brittle if the LLM rephrases slightly. Use paragraph index + sentence index rather than raw sentence text to locate the target.

**Code location:** `packages/prompts-llm/src/agent9-prose/generate.ts → runChapterProseJudge` (new function, called inside `generateProse` after the structural gate passes for each chapter). **Note:** `agent9-run.ts` only calls `generateProse` — the judge must be embedded in the generation loop in `generate.ts`, not the orchestration layer.

**Validator signal:** Catches `broken_phrase_detected`, `opening_style_repetition`, note-phrasing holistically. Expected prose score: 4/10 → 7–8/10

---

### FIX-T29-8: Outline-level discriminating-test scheduling gate (blue sky)

**Problem:** The agent run log confirmed: "G4 DT-scene scheduling gap ch4: discriminating-test scene (4) has no fresh DT evidence clue scheduled in the outline. This is an outline-level gap that prose generation cannot repair."

**Root cause:** DT clue scheduling is validated at prose time (Agent 9) but the gap originates at outline time (Agent 7). By the time prose detects it, it is too late to fix without a full prose retry — expensive and still not guaranteed to work.

**Fix type:** GATE (moved upstream)

**Why this is high-confidence:**
Moving the gate upstream to after Agent 7 is deterministic and cheap. The check is a simple scan of outline scene assignments. If the DT chapter has no DT-fresh clue, a targeted outline re-prompt is far cheaper than a full prose retry.

```typescript
// In mystery-orchestrator.ts, after runAgent7:
const dtGaps = validateDTClueScheduling(ctx.narrative, ctx.clues);
if (dtGaps.length > 0) {
  ctx.narrative = await runAgent7Repair(ctx, dtGaps);
  // Prose generation only starts once DT scheduling is clean.
}
```

**Code location:** `apps/worker/src/jobs/mystery-orchestrator.ts` → after `runAgent7`; new `validateDTClueScheduling` + `runAgent7Repair`

> ⚠️ **Quality validation note — repair prompt content unspecified:** `runAgent7Repair(ctx, dtGaps)` is shown but what does the repair prompt say? Agent 7 is a full outline generator. A targeted "repair only the DT scene clue assignments" prompt needs careful design — too broad and it regenerates the entire outline; too narrow and it can't fix scheduling conflicts. Specify the prompt contract before implementation.

> ⚠️ **Quality validation note — no retry limit:** If `runAgent7Repair` itself produces a DT gap, there is no retry cap. Add a maximum of 2 repair attempts with a hard fallback (log the gap as a known issue, proceed to prose with a warning).

**Validator signal:** `cml_test_not_realized` eliminated before prose begins; mystery clues 7/10 → 8–9/10

---

## Step 5 — Fix Improvement Probability Assessment

### 5.1 — Per-Fix Probability Table

| Fix ID | Scoring category affected | % chance improves score | Expected point gain (if it fires) | Confidence | Reasoning |
|--------|--------------------------|------------------------|------------------------------------|------------|-----------|
| T29-1 | Character clarity | 65–75% | +3–5 | 🟡 Medium | ⚠️ Regression risk: flags were disabled deliberately — "the deterministic fixer introduces errors." ABSOLUTE PRONOUN LOCK already in every prompt at critical priority; LLM still produced errors. Confidence downgraded until root cause of fixer regression is diagnosed. Max gain bounded by category headroom (5→10 = +5 max). |
| T29-2 | Pacing, Prose / Polish | 75–85% | +3–6 | 🔵 High | Positive mood directive gives LLM a *target*, not just a ban. Variety becomes the path of least resistance rather than a constraint to work around. |
| T29-3 | Dialogue, Ending / Reveal | 70–80% | +5–9 | 🟡 Medium | CHAIN pre-pass changes what the LLM is doing (staging a scene) vs. what it was doing (ticking a checklist). Pre-pass brief quality is the variable. |
| T29-4 | Prose / Polish | 85–90% | +2–4 | 🔵 High | Gate + micro-regen is deterministic. ⚠️ Regex needs additional patterns for splice and compound-unit variants (see fix notes). Near-zero token cost per repair. |
| T29-5 | Character clarity, Premise | 85–90% | +2–4 | 🔵 High | Data-wiring for Case Overview header + obligation-block template audit. ⚠️ Both changes needed — header change alone insufficient. |
| T29-6 | Prose / Polish | 85–90% | +1–3 | 🔵 High | ⚠️ Requires 3 code changes (type + repair loop + prompt injection) plus story-specific CML data. Not purely a data fix. |
| T29-7 | Prose / Polish (holistic) | 80–88% | +6–12 | 🔵 High | Judge sees the chapter as a whole reader. ⚠️ Dimension B requires prior-openings context injection to be valid. ⚠️ Cost estimate may be higher if Azure OpenAI mini model unavailable. |
| T29-8 | Mystery clues, Plot structure | 90–95% | +4–7 | 🔵 High | Upstream gate is deterministic. ⚠️ Repair prompt needs careful design; add 2-attempt retry cap before hard fallback. |

### 5.2 — Combined Scenario Forecast

| Scenario | Fixes firing | Score delta | Resulting score (from 67) |
|----------|-------------|-------------|--------------------------|
| Pessimistic — deterministic wiring only, no LLM-judge | T29-4 + T29-5 + T29-6 | +6–10 | 73–77 |
| Central — context injection + gate work, no CHAIN or judge | T29-1 + T29-2 + T29-4 + T29-5 + T29-6 + T29-8 | +16–25 | 83–92 |
| Optimistic — all eight firing including CHAIN + LLM-judge | T29-1 through T29-8 | +20–27 | 87–94 (theoretical max across affected categories ~+27) |

> **Score arithmetic:** Total available gain across affected categories: Character (5→10=+5), Pacing (6→10=+4), Dialogue (5→10=+5), Prose (4→10=+6), Ending (6→10=+4), Mystery clues (7→10=+3) = **+27 absolute maximum**. Central and optimistic scenarios have been recalibrated accordingly. Prior upper bound of +31 was arithmetically impossible.

> **Score ceiling note:** Story-specific issues (clue overload, vague motive, murder method never stated) are not fixed by any generic intervention above. Those cap *this particular story* at ~90–92. On a fresh run with better story-specific fundamentals, the same fix stack has a realistic ceiling of 93–95.

> **The asymmetry:** The pessimistic case is 73–77 because even if every LLM-driven fix fails, the data-wiring fixes (T29-4, T29-5, T29-6) are highly deterministic and deliver +6–11 for free. T29-1 has been downgraded to 🟡 Medium due to the deliberate flag-disablement regression risk — do not treat it as a free win. There is no scenario where implementing these fixes makes the score *worse*, provided the fixer regression risk for T29-1 is investigated before the flag is flipped.

> **Calibration after the run:**
> - Actual < 73 → T29-5 (victim name) not wired to CML field. Check `cml.CASE.victim.name` is populated.
> - Actual 73–80 with T29-7 active → LLM-judge threshold is too permissive. Tighten from < 7 to < 8.
> - Actual > 92 → An untracked fix also contributed, or story-specific issues were less impactful than estimated.

### 5.3 — Post-Run Actuals

> Fill in after next canary run.

| Metric | Pre-fix baseline | Post-fix (canary YYYY-MM-DD) | Delta |
|--------|-----------------|------------------------------|-------|
| Overall score | 67/100 | | |
| `pronoun_drift` count | 5–8 (est.) | | |
| `opening_style_repetition` count | ~10 (est.) | | |
| Broken phrase count | 4–6 (est.) | | |
| Note-phrasing alibi lines | 4–6 (est.) | | |

---

## Step 6 — Implementation Waves

| Wave | Fix IDs | Target score gain | Effort | Dependency |
|------|---------|-------------------|--------|------------|
| Wave 1 — data wiring (deterministic, zero LLM risk) | T29-5 + T29-6 + T29-4 | +6–11 → score 73–78 | Low–Med | T29-5 is 2 changes (prompt-builder + obligation-block); T29-6 needs 3 code changes (type + repair loop + prompt block); T29-4 needs regex gate + micro-regen in generate.ts |
| Wave 2 — context injection (high-confidence prompt work) | T29-1 + T29-2 + T29-8 | +13–23 additional → score 89–104 (capped ~92) | Low–Med | Wave 1 done |
| Wave 3 — generation architecture (blue sky) | T29-3 + T29-7 | +5–18 additional → ceiling ~95 | Med | Wave 2 done |

**Target:** 67 → 76–81 by Wave 1; 85–92 by Wave 2; ~95 ceiling by Wave 3.

**Why start with Wave 1:**
T29-5, T29-6, and T29-4 are one-to-two-day changes on code paths already working. T29-5 requires two changes (prompt-builder header + obligation-block template audit); T29-6 requires three code changes (LockedFact type + repair loop + prompt injection) plus story CML data; T29-4 requires regex gate + micro-regen in generate.ts. Together they deliver +6–11 points with near-zero LLM compliance risk. Canary after Wave 1 validates the approach before committing to Wave 3 architectural work.

**Wave 3 risk note:**
T29-7 (LLM-judge) adds ~2s latency per chapter (+20s total) and +$0.02 per story — negligible, but confirm with a profiling run before full enablement. T29-3 (CHAIN pre-pass) adds one extra LLM call per alibi chapter; if the brief is incoherent, fall back to the existing FEW-SHOT approach rather than retrying infinitely.

---

## Step 7 — Technique Reference

| Type | Description | Effort | Best for |
|------|-------------|--------|---------|
| **CONSTRAINT** | Add forbidden/required patterns to the prompt | Low | Prose/polish, character clarity |
| **STATE** | Inject a running cross-chapter facts block into every chapter prompt | Low–Med | Consistency across chapters |
| **SCHEMA** | Extend the CML data model to carry pre-computed constraints | Med | Systemic consistency |
| **GATE** | Post-generation validator that blocks and retries on failure | Med | Any regex/heuristic-detectable issue |
| **COT** | Require step-by-step reasoning before generating prose | Med | Logic, clue chains |
| **FEW-SHOT** | Add a good/bad example pair to the prompt | Low | Prose quality, dialogue, openings |
| **CHAIN** | Split into two sequential LLM calls (plan → prose) | Med–High | Structure, clue ordering |
| **REFLEXION** | LLM critiques its own draft then rewrites | Med | Holistic quality |
| **SELF-CONSISTENCY** | Generate N drafts, accept best-scoring | High | Hard constraint satisfaction |
| **MICRO-REGEN** | Regenerate only the failing sentence/paragraph | Med | Targeted prose errors |
| **LLM-JUDGE** | Separate LLM call scores the chapter before accepting | Med–High | Holistic quality, pacing |
| **ARCHITECTURE** | Change when/how chapters are generated | High | Structural and pacing root causes |
