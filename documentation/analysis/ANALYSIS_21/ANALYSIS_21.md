# ANALYSIS_21: Regression Audit — May 20 Session Changes

**Date:** 2026-05-21  
**Scope:** All code changes made in the May 20 session; assessed against ChatGPT reviews of the three stories generated that day.  
**Verdict: REGRESSION. Score dropped 64 → 60 → 48 across three sequential runs. Net loss of 16 points from baseline.**

---

## Score Timeline

| Story | Run Time | Score | Status |
|-------|----------|-------|--------|
| `story_20260520-1846` | Earliest (baseline) | **64/100** | Best of session |
| `story_20260520-2018` | After early fixes | **60/100** | −4 pts |
| `story_20260520-2339` | After P3–P15 full set | **48/100** | −12 more pts = **−16 from baseline** |

---

## Section 1 — Changes Made in the May 20 Session

Cross-referenced from `stories/story_20260520-2018/review-analysis.md` (the planning doc for that session).

| ID | Change | File | Status in review-analysis doc |
|----|--------|------|-------------------------------|
| P1 | Cast pronoun lock (`buildPronounAccuracyBlock`) | `agent9-prose.ts` | Done |
| P2 | Ledger exposition forbidden (`DEBUG_NOTE_PATTERNS`) | `agent9-prose.ts` | Done |
| P3 | Template opening phrases / boilerplate — Groups A+B+C | `agent9-prose.ts` | Done |
| P4 | Chapter-beat uniqueness gate (`USED_BEATS`) | `agent9-prose.ts` | Done |
| P5 | Clue-stage embargo (`clueStageForRun`) | `agent9-prose.ts` | Done |
| P6 | DT chapter: NEW OBSERVABLE FACT REQUIRED | `agent9-prose.ts` | Done |
| P7 | Reveal completeness checklist | `agent9-prose.ts` | Done |
| P8 | Motive + kill statement required in confession | `agent9-prose.ts` | Done |
| P9 | Pronoun resolution in confession | `agent9-prose.ts` | Done |
| P10 | Cross-chapter phrase frequency lint | `agent9-prose.ts` | Done |
| P11 | Timeline lock in obligation block | `agent9-prose.ts` | Done |
| P12 | Victim alibi forbidden lint gate | `agent9-prose.ts` | Done |
| P13 | Alibi consistency lock (`culpritAlibiLock`) | `agent9-prose.ts` | Done |
| P14 | Clue-stage enforcement | `agent9-prose.ts` | Done |
| P15 | Clue-disclosure embargo per chapter | `agent9-prose.ts` | Done |
| P16 | Confrontation escalation rule | `agent9-prose.ts` | Done |
| – | `min_ratio: 0.5 → 0.45` | `generation-params.yaml` | Done |
| – | `promptTargetWords` rename | `agent9-prose.ts` | Done |
| FixA | `classifyOpeningStyle` multi-word name fix | `narrative-state.ts` + `prose-consistency-validator.ts` | Done |
| FixB | Temperature escalation on n-gram retries | `agent9-prose.ts` | Done |

### 1.2 — Changes to Implement Now

Derived from Section 3. Ordered by priority. F1–F3 are low-effort and directly address the 16-point regression; implement these first before any canary run.

| ID | Action | File | Line(s) | Priority | Status |
|----|--------|------|---------|----------|--------|
| F1 | In `enforceCulpritEvidencePresence`: scan Chapter 1 for death-marker sentences before injecting for any culprit; skip + log error if culprit appears dead | `agent9-run.ts` | 918 | 🔴 Critical | ✅ Done |
| F1b | In `agent3-run.ts`: post-generation check that no `culpability.culprits[]` member has `role: "victim"` in the cast; fail fast with error if found | `agent3-run.ts` | — | 🔴 Critical | ✅ Done |
| F2 | Disable `INJECTION_TEMPLATES[duration_minutes]` (or rewrite to non-ledger prose); verify obligation block alone is sufficient for timing values | `agent9-run.ts` | 735 | 🔴 Critical | ✅ Done |
| F3 | Disable `INJECTION_TEMPLATES[generic]` — return empty string; skip injection when sentence is empty | `agent9-run.ts` | 738 | 🔴 Critical | ✅ Done |
| F4 | In the deferred template gate: split linter issues by type; only defer `opening_style_entropy`; add `paragraph_fingerprint` and `ngram_overlap` to `batchErrors` even when `hasNarrativeHardErrors` is true | `agent9-prose.ts` | ~7144 | 🟠 High | ✅ Done |
| F5a | Add explicit noun-phrase format constraint to Agent 2c system prompt for `sensoryDetails` fields | `agent2c-location-profiles.ts` | ~161 | 🟠 High | ✅ Done |
| F5b | Add post-parse validation in Agent 2c runner: flag any `sensoryDetails` string containing a conjugated verb and log warnings | `agent2c-run.ts` | — | 🟠 High | ✅ Done |
| F6a | Append compact PRONOUN TABLE to every chapter's obligation block, derived from `cmlCase.cast` inside `buildChapterObligationBlock` | `agent9-prose.ts` | buildChapterObligationBlock | 🟡 Medium | ✅ Done |
| F6b | Add per-paragraph instruction to the pronoun table reminder: "re-check after EVERY paragraph before writing the next" | `agent9-prose.ts` | obligation block | 🟡 Medium | ✅ Done |

**Implementation order:** F1 → F2 → F3 (all in `agent9-run.ts`, can be done together) → F4 (`agent9-prose.ts`) → F5a/F5b (`agent2c`) → F6a/F6b (`agent9-prose.ts`) → F1b (`agent3-run.ts`).

---

## Section 2 — Regression Findings

### 2.1 CRITICAL: `enforceLockedFactValuePresence` injects ledger-style sentences that bypass all linting

**Severity:** Critical regression  
**Files:** `apps/worker/src/jobs/agents/agent9-run.ts` (lines 733–743, `INJECTION_TEMPLATES`)

The `INJECTION_TEMPLATES` map produces sentences that are **structurally identical to the debug-note patterns P2 was meant to block**:

| Template | Sentence produced | Issue |
|----------|------------------|-------|
| `time` | `The time was recorded as ten minutes past eleven.` | Appears verbatim in every story; ChatGPT reviews call this "reads like a case-note" |
| `duration_minutes` | `The interval — the exact amount the clock was wound back — came to forty minutes.` | **Identical to** the sentence P2 adds to `DEBUG_NOTE_PATTERNS`; forbidden by linter but **re-injected by post-processor** |
| `generic` | `The relevant value was established: twenty degrees Fahrenheit.` | Appears in `story_20260520-2339` Ch6; directly called out as problematic |

**Root cause of circular failure:** Fix P2 adds these patterns to `DEBUG_NOTE_PATTERNS` so the model can't write them. But `enforceLockedFactValuePresence` runs **after validation**, in post-processing. It re-injects the same banned sentences into the finished story. The linter never sees the post-processed output.

**Evidence in story_20260520-2339:**
- Ch1: `"The interval - the exact amount the clock was wound back - came to forty minutes."`
- Ch2: `"The time was recorded as ten minutes past eleven."`
- Ch5: `"The time was recorded as ten minutes past eleven."`
- Ch6: `"The relevant value was established: twenty degrees Fahrenheit."`

P2 reduced these patterns during generation; `enforceLockedFactValuePresence` restored them afterwards. The net effect is **zero improvement** in the final output.

**Fix direction:** The `duration_minutes` and `generic` templates must be rewritten as natural prose, or disabled entirely if the obligation-block system already ensures these values appear. The `time` template is borderline acceptable only for clock values; even that should be absorbed into context prose.

---

### 2.2 CRITICAL: `enforceCulpritEvidencePresence` injects accusation for the dead victim when CML inverts roles

**Severity:** Critical regression — directly causes the 48-point story  
**Files:** `apps/worker/src/jobs/agents/agent9-run.ts` (line 918, `enforceCulpritEvidencePresence`)

**What happened in `story_20260520-2339`:**
1. Agent 3 (CML generator) assigned "Beatrice Quill" as the culprit despite the cast specifying her as a named cast member (not specifically locked as victim)
2. The LLM wrote Chapter 1 with Beatrice dead: `"Eleanor Voss stood frozen in the doorway, her breath catching at the sight of Beatrice's lifeless form."`
3. The canary log shows: `[Agent 9] enforceCulpritEvidencePresence: injected sentence for "Beatrice Quill".`
4. This injects `"Beatrice Quill was responsible, and the evidence placed the matter beyond all reasonable doubt."` into Chapter 9
5. Result: **Beatrice is simultaneously dead in Chapter 1 and the accused culprit in Chapter 9**

**ChatGPT review reaction:** Scored Character clarity **2/10**; Ending/reveal **2/10**; overall **48/100** — the worst score of the session.

**Key quote from ChatGPT review:**  
> *"The accusation line is impossible: 'You had the opportunity to tamper with the clock before Beatrice's death,' said to Beatrice herself."*

**No guard exists against victim-culprit identity collision.** `enforceCulpritEvidencePresence` reads the culprit list directly from CML; it does not cross-check against `resolveVictimName` or `detectVictimAlive` results.

**Fix direction:** Before `enforceCulpritEvidencePresence` injects for a culprit name, check whether that name appears dead (using `detectVictimAlive` logic in reverse, i.e., `detectVictimDead`). If the CML culprit is also found dead in the prose, skip injection and log a critical warning instead. Separately, Agent 3 must be constrained: when the canary input specifies a cast list, the culprit must come from the non-victim members.

---

### 2.3 HIGH: `duration_minutes` injection template is **identical to the sentence P2 forbids**

**Severity:** High — directly undermines Fix P2  
**Details:** See §2.1. Reproducing here for emphasis.

```typescript
// INJECTION_TEMPLATES['duration_minutes'] — agent9-run.ts line 737
duration_minutes: (d, v) => `The interval — ${d.toLowerCase()} — came to ${v}.`,
```

The forbidden `DEBUG_NOTE_PATTERNS` in `agent9-prose.ts` (Fix P2) specifically blocks sentences matching this pattern during generation. But the injection template produces the verbatim pattern in post-processing. P2 created a false signal of improvement during canary runs (the validation step passes because the model didn't write the sentence) while the injector restores it afterward.

---

### 2.4 HIGH: Deferred template gate allows stock phrases through when narrative errors exist

**Severity:** High  
**Evidence from canary log:**
```
[Agent 9] Deferred template hard-gate for ch7 attempt 1/6 while narrative hard errors remain.
[Agent 9] Deferred template hard-gate for ch9 attempt 6/6 while narrative hard errors remain.
```

When a chapter has unresolved narrative hard errors (missing clue, pronoun drift, etc.), the template hard-gate is deliberately deferred to avoid blocking the chapter from converging at all. The model fixes the narrative error on the next attempt, but the chapter that was accepted at attempt 4–6 may contain stock phrases because the template gate wasn't enforced during those retry attempts.

**Observed repeated phrases in `story_20260520-2339` despite Fix P10:**
- `"The metronome of time pulsed with quiet insistence, a whisper of urgency hung in the air, and with it, the chance to uncover the truth before it was too late."` — appears verbatim in Ch2, Ch3, Ch4, Ch5 (4 times)
- `"Let's recount our last interactions with Beatrice. Every detail matters, no matter how small."` — appears in Ch3 and Ch4
- `"We need to be honest with each other if we're going to get to the bottom of this."` — Ch2, Ch4

**Root cause:** Fix P10 added cross-chapter phrase frequency lint, but it only fires on the template hard-gate which is **deferred** whenever narrative errors exist. These phrases originate from the model's baseline "mystery story" training pattern. Once the deferred gate lifts (often never, at attempt 4–6), the chapter is accepted.

**Fix direction:** Apply the stock-phrase frequency lint non-deferably for phrases appearing ≥ 3 times across the story. Cap it at ~2 occurrences. Don't defer for phrases that are LLM boilerplate, only for genuine prose errors.

---

### 2.5 HIGH: Location template bleed from Agent 2c unfixed — now also appearing as mixed scene context

**Severity:** High (unchanged from ANALYSIS_20)  
**Evidence in `story_20260520-2339`:**
- Ch5: `"In The Library in Little Middleton, England, crackling fire in the hearth and beeswax and cold ash set the tone; worn leather armchair ran beneath it all, and the overcast with intermittent rain outside pressed the tense mood inward."`

ANALYSIS_20 identified that `agent2c-location-profiles.ts` instructs Agent 2c to produce `sensoryDetails.sounds` as "Full 2-sentence sound descriptions." These arrive as finished prose sentences which Agent 9 copies verbatim. None of the P3–P15 fixes addressed Agent 2c. The ANALYSIS_20 Phase 1 fix (change schema to noun phrases) was **not implemented**.

This bleed pattern **cannot be fixed purely in Agent 9** because by the time Agent 9 receives the data, it looks like prose. The root must be fixed in Agent 2c.

---

### 2.6 MEDIUM: Captain Hale pronoun drift persists despite Fix P1 — repair count not decreasing

**Severity:** Medium — auto-repair masks but doesn't eliminate  
**Evidence from canary log (story_20260520-2339 run):**
- Ch5: 14 pronoun corrections required (attempt 1), 14 again (attempt 2), 8 (attempt 3), 9 (attempt 4)
- Ch6: 18 corrections (attempt 1), 18 (attempt 2)
- Ch7: 1 correction (attempt 1)
- Ch8: 8 corrections (attempt 1), 9 (attempt 2), 9 (attempt 3), 5 (attempt 4), 5 (attempt 5)

The correction count does not decrease across retries for Chapters 5–8. This means Fix P1 (the pronoun lock in the obligation block) is not reaching the model's generation phase for these chapters, likely because the pronoun lock is far in the context window behind chapter-specific instructions, or because the 4-cast all-female situation plus one male creates a systematic confusion when all three female characters are in the same scene.

**Escaped errors in `story_20260520-2339` final prose:**
- Ch1: `"Captain Hale, equally pale, shifted uneasily beside him, his military composure faltering"` — "beside him" is grammatically wrong (Hale is the subject)
- Ch1: `"the doctor moved closer, his heart racing"` — Dr. Finch is female; "his" is wrong
- Ch2: `"the eyes of both Eleanor and Hale upon him"` — "him" should be "her" (referring to Mallory)

Fix P1 is blocking failures at the validation stage (causing retries) but is not preventing the model from generating wrong pronouns. The auto-repair is catching ~60% but missing ~40%. Sentences inside multi-character paragraphs with pronoun antecedent ambiguity still slip through.

---

### 2.7 MEDIUM: Clock mechanism stated immediately in Chapter 1 — clue-stage embargo not effective

**Severity:** Medium  
**Evidence:**  
Ch1 of `story_20260520-2339` contains verbatim:
> *"The interval - the exact amount the clock was wound back - came to forty minutes... The mechanism relied on clock, tamper, and The Study to expose the false timing. This scratch suggested that the clock had been manipulated recently, a deliberate act that could change everything."*

Fix P5 added a clue-stage embargo (`clueStageForRun`). The embargo was meant to prevent full mechanism disclosure in Chapter 1. However:
1. The injection templates (§2.1) are re-inserting mechanism language post-validation
2. The obligation block embargo applies to clue IDs, not to the general mechanism description
3. The model is still using "explain the mechanism upfront" as its default Chapter 1 pattern

ChatGPT review (story_20260520-2018, 2339): Both dock points for "clock explanation too blunt in Ch1."

---

### 2.8 LOW: `FixA` (`classifyOpeningStyle` multi-word names) is working but was insufficient alone

**Severity:** Low — intended effect partially achieved  
**Evidence:** The canary log for the last run still shows entropy 0.00 on Ch3 attempt 1. This means the classifier still encounters cases where the first three chapters all open with `general-descriptive` style (or all with `character-action`). Fix A helped but the issue persists because the model often generates all chapters with the same opening pattern regardless.

The real fix for entropy requires **explicit diverse-opening instructions** in the obligation block, not just a better classifier. If the model writes the same opening structure every time, a better classifier still computes 0.00 entropy.

---

## Section 3 — Priority Fix Queue

Listed by expected score impact and confidence level.

| # | Fix | Root Issue | Expected Impact | File(s) | Effort |
|---|-----|-----------|-----------------|---------|--------|
| F1 | Guard `enforceCulpritEvidencePresence` against dead victims | §2.2 | +10 pts (eliminates fatal story logic failure) | `agent9-run.ts` | Low |
| F2 | Rewrite `INJECTION_TEMPLATES[duration_minutes]` to natural prose or disable | §2.1 / §2.3 | +4 pts (eliminates ledger sentence re-injection) | `agent9-run.ts` | Low |
| F3 | Rewrite `INJECTION_TEMPLATES[generic]` — or disable generic injection | §2.1 | +2 pts | `agent9-run.ts` | Low |
| F4 | Make stock-phrase frequency lint non-deferrable for ≥3 occurrences | §2.4 | +3 pts | `agent9-prose.ts` | Medium |
| F5 | Fix Agent 2c schema to produce noun phrases, not full sentences | §2.5 | +5 pts (eliminates location bleed at source) | `agent2c-location-profiles.ts` | Medium |
| F6 | Move pronoun lock to per-paragraph obligation (not just chapter header) | §2.6 | +3 pts | `agent9-prose.ts` | Medium |

**Priority order:** F1 and F2/F3 are immediate — they directly explain the 16-point regression. F4 and F5 attack remaining problems from the baseline 64 score.

---

### F1 — Guard `enforceCulpritEvidencePresence` against dead victims

**File:** `apps/worker/src/jobs/agents/agent9-run.ts`  
**Location:** `enforceCulpritEvidencePresence` function, line 918. Called at post-processing lines 2617–2618, and again at lines 2657–2658.

**Current behaviour:**
```typescript
export const enforceCulpritEvidencePresence = (prose: any, cml: any): any => {
  const culprits: string[] = Array.isArray(cml?.CASE?.culpability?.culprits)
    ? cml.CASE.culpability.culprits.map(...)
    : [];
  // No victim check — injects for any culprit name regardless of whether they appear dead
  return injectSentenceIfAbsent(prose, culprits, ...);
};
```

**Problem:** When the CML generator assigns a character who dies in Chapter 1 as the culprit, this function still injects `"${culprit} was responsible, and the evidence placed the matter beyond all reasonable doubt."` into Chapter 9. The victim is simultaneously dead in Chapter 1 and accused in Chapter 9.

**Fix:** Before injecting for a culprit, scan the first chapter's paragraphs for any sentence that names that character alongside a death-marker. `resolveVictimName` is already imported at line 25 — use it to get the CML-declared victim, but also add a lightweight prose scan for culprit names near death vocabulary (`lifeless|body|dead|found.*dead|died|killed`) in Chapter 1 specifically. If a match exists for a culprit's name, skip injection for that culprit and log a critical warning.

**Concrete implementation:**
```typescript
// At the top of enforceCulpritEvidencePresence, before calling injectSentenceIfAbsent:
const DEATH_RE = /\b(lifeless|body|dead|found dead|died|killed|corpse|murder victim)\b/i;
const ch1Text = (prose.chapters?.[0]?.paragraphs ?? [] as string[]).join(' ');
const liveCulprits = culprits.filter((culprit) => {
  const surname = extractSurname(culprit);
  const culpritRE = new RegExp(`\\b${surname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  // If culprit name appears within 200 chars of a death marker in ch1, they are the victim
  const match = ch1Text.match(culpritRE);
  if (!match) return true;
  const idx = match.index ?? 0;
  const window = ch1Text.slice(Math.max(0, idx - 200), idx + 200);
  if (DEATH_RE.test(window)) {
    console.error(`[Agent 9] enforceCulpritEvidencePresence: SKIPPED injection for "${culprit}" — appears dead in Chapter 1. CML culprit assignment is invalid.`);
    return false;
  }
  return true;
});
// Then pass liveCulprits instead of culprits to injectSentenceIfAbsent
```

**Separate follow-up (Agent 3 constraint):** The longer-term fix is to add a validation rule in `agent3-run.ts` or `agent3b-run.ts` that checks after CML generation: if any `culpability.culprits[]` member is also named as the character found dead in `prose_requirements.victim` or has `role: "victim"` in the cast, treat it as a schema violation and trigger a retry. This prevents the corrupted CML from reaching Agent 9 at all.

**Score impact:** Eliminates the 48-point floor entirely. Any story where CML inverts the victim/culprit relationship is currently unrecoverable; this guard makes it survivable.

---

### F2 — Rewrite `INJECTION_TEMPLATES[duration_minutes]`

**File:** `apps/worker/src/jobs/agents/agent9-run.ts`  
**Location:** `INJECTION_TEMPLATES` const, line 733–741. `duration_minutes` template is line 735.

**Current template:**
```typescript
duration_minutes: (d, v) => `The interval — ${d.toLowerCase()} — came to ${v}.`,
```

**Problem:** This is lexically identical to the sentence pattern that Fix P2 added to `DEBUG_NOTE_PATTERNS` in `agent9-prose.ts`. P2 blocks the model from writing this during generation; the injector then restores it in post-processing. The linter never sees the post-processed output, so the final story contains the banned sentence.

The `duration_minutes` template fires when `canonical` contains "minute/second/hour" — i.e., for any timing-related locked fact. This covers the core clock-tampering mechanism and is therefore the single most common injection in a clock-mystery story.

**Fix option A — Disable entirely:**  
Set `duration_minutes` to the same no-op return as a disabled template: simply don't inject and let the obligation block handle it. This is safe because `enforceLockedFactValuePresence` is a backstop, not the primary mechanism. The obligation block already instructs the model to state the locked fact value explicitly in the relevant chapter.

**Fix option B — Rewrite to natural prose:**  
If disabling causes visible omissions in the output, replace with a form that embeds the fact in a natural observation rather than a ledger sentence:
```typescript
duration_minutes: (d, v) => `The calculation — ${d.toLowerCase()} — came to ${v} in total.`,
// → Too similar to current. Better:
duration_minutes: (d, v) => `${d.charAt(0).toUpperCase() + d.slice(1)} accounted for ${v}, no more.`,
```
Even this risks reading as case-note prose. **Recommendation: disable first and verify the obligation block alone is sufficient.**

**Score impact:** Directly removes a sentence that ChatGPT reviews flag by name in every story. Estimated +4 pts in prose quality (Style / Atmosphere categories).

---

### F3 — Rewrite or disable `INJECTION_TEMPLATES[generic]`

**File:** `apps/worker/src/jobs/agents/agent9-run.ts`  
**Location:** `INJECTION_TEMPLATES` const, line 738.

**Current template:**
```typescript
generic: (_d, v) => `The relevant value was established: ${v}.`,
```

**Problem:** `generic` is the catch-all for any locked fact not matching time/duration/weight/length. In `story_20260520-2339`, this produced `"The relevant value was established: twenty degrees Fahrenheit."` verbatim in Chapter 6. ChatGPT review explicitly quoted this line as reading like a lab report.

The `generic` type fires for anything classified as non-time/non-duration/non-weight/non-length — most commonly temperatures, percentages, distances, and abstract numeric values. These facts rarely benefit from post-hoc injection; if the obligation block failed to include them, the injector will not produce meaningful prose.

**Fix:** Disable the `generic` template entirely. If the obligation block fails to surface a generic locked value, it is better to accept the omission than to insert a court-document sentence. The `weight` and `length` templates (`"${d} weighed ${v}."` / `"The measurement confirmed: ${v}."`) are borderline but contextually readable for physical evidence; leave those for now.

**Concrete change:**
```typescript
// Before:
generic: (_d, v) => `The relevant value was established: ${v}.`,
// After (returns empty string → caller checks length before injecting):
generic: (_d, _v) => ``,
```
Then in `enforceLockedFactValuePresence`, skip injection when `sentence.trim().length === 0`.

**Score impact:** Removes the most artificial-sounding sentence type from the output. Combined with F2, eliminates all ledger-style post-processing injections.

---

### F4 — Make stock-phrase frequency lint non-deferrable for ≥3 occurrences

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Location:** Lines 7073–7165, the template hard-gate block inside the per-chapter attempt loop.

**Current behaviour (lines 7144–7147):**
```typescript
if (hasNarrativeHardErrors) {
  console.warn(`[Agent 9] Deferred template hard-gate for ch${batchLabel} ...`);
  // linterIssues are NOT added to batchErrors — template gate is silently skipped
} else {
  batchErrors.push(...linterIssues.map((issue) => issue.message));
}
```

When `hasNarrativeHardErrors` is true (missing clue, pronoun drift, etc.), the entire template linter result is discarded. This means a chapter can pass the retry loop with n-gram overlap, paragraph fingerprints, or repeated phrases — as long as it also has a narrative hard error that eventually resolves.

**Problem:** Chapters 2–5 in `story_20260520-2339` contain the same phrase verbatim four times because each chapter had a narrative hard error on attempt 1, so the deferred gate never fired and the phrase accumulated across all four chapters without triggering a retry.

**Fix:** Separate phrase-frequency violations from style-entropy violations in the deferred gate. Style-entropy (`opening_style_entropy`) is correctly deferrable — it depends on multi-chapter context and may resolve naturally. But exact-phrase repetition (`paragraph_fingerprint`, `ngram_overlap`, `intra_chapter_sentence_duplicate`) should never be deferred past attempt 2 even when narrative errors exist.

**Concrete change:**
```typescript
if (hasNarrativeHardErrors) {
  // Defer entropy failures (multi-chapter context needed) but never defer
  // fingerprint/overlap violations — a repeated phrase is wrong regardless
  // of whether the chapter also has a narrative error.
  const nonDeferrableIssues = linterIssues.filter(
    (issue) => issue.type !== 'opening_style_entropy'
  );
  if (nonDeferrableIssues.length > 0) {
    batchErrors.push(...nonDeferrableIssues.map((issue) => issue.message));
  }
  if (linterIssues.length > nonDeferrableIssues.length) {
    console.warn(`[Agent 9] Deferred opening-style entropy for ch${batchLabel} attempt ${attempt}/${maxBatchAttempts} while narrative hard errors remain.`);
  }
} else {
  batchErrors.push(...linterIssues.map((issue) => issue.message));
}
```

**Score impact:** Prevents boilerplate phrase accumulation during chapters with concurrent narrative failures. Estimated +3 pts across Style/Prose quality categories.

---

### F5 — Fix Agent 2c schema to produce noun phrases, not full sentences

**File:** `packages/prompts-llm/src/agent2c-location-profiles.ts`  
**Location:** System prompt at line 158; schema example `sensoryDetails` block at approximately line 208.

**Current schema example (the output spec Agent 2c reads):**
```json
"sensoryDetails": {
  "sights": ["candlelight on dark oak", "rain-streaked window panes"],
  "sounds": ["crackling fire", "pages turning in the silence"],
  "smells": ["beeswax and cold ash", "damp stone and old leather"],
  "tactile": ["worn leather armchair", "chill draft from the casement"]
}
```

The examples above are noun phrases. However, the `sensoryVariants` block in the same schema uses longer forms (`"steady drumming on the roof"`, `"water trickling in the gutters"`) which are gerund phrases. Agent 2c inconsistently generates both short noun phrases and full sentences; the latter arrive in Agent 9 as finished prose sentences that get copied verbatim.

**The bleed evidence from §2.5:**
```
"crackling fire in the hearth and beeswax and cold ash set the tone; worn leather armchair ran beneath it all"
```
This is a concatenation of multiple `sensoryDetails` values into a run-on clause, caused by Agent 9 embedding `sensoryDetails` values directly as prose fragments.

**Fix — Two changes required:**

1. Add an explicit format constraint to the system prompt at line 161:
   > `- All sensoryDetails fields (sights, sounds, smells, tactile) must be short noun phrases of 3–7 words. Do NOT write full sentences or clauses. WRONG: "The clock ticked heavily in the silence." RIGHT: "heavy clock-tick", "dusty mantel silence".`

2. Add format validation in `agent2c-run.ts` (wherever Agent 2c output is processed): after parsing the JSON, scan `sensoryDetails` arrays for any string containing a conjugated verb (`/\b(is|are|was|were|has|have|set|ran|stood|made|gave|filled|hung)\b/i`). If found, either strip the verb form or flag it for model retry.

**Score impact:** Eliminates the most visible form of Agent 2c bleed. Without this, Agent 9 cannot fix the problem — the corrupted data arrives pre-formatted as prose. Estimated +5 pts (Atmosphere / Setting clarity categories).

---

### F6 — Move pronoun lock to per-paragraph obligation

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Location:** `buildPronounAccuracyBlock` (line 3014) and the chapter obligation block builder.

**Current behaviour:** The 10-rule pronoun lock (`buildPronounAccuracyBlock`) is included once in the chapter prompt as a `priority: 'critical'` context block. For short chapters it is close to the generation instruction; for chapters with heavy prior-context (Ch5+), it can be 2,000+ tokens away from the generation instruction.

**Evidence from §2.6:** Repair counts of 14–18 per attempt on Chapters 5–8 do not decrease across retries. The model is not registering the pronoun table for these chapters.

**Fix:** Add a compact inline pronoun table reminder inside the paragraph-level obligation block — not a full repetition of the 10-rule contract, just the cast-specific table. The obligation block already exists per chapter; adding 3–4 lines to its template costs ~50 tokens and puts the gender anchors directly adjacent to the generation instruction for every paragraph.

**Concrete addition to the obligation block template:**
```
PRONOUN TABLE (re-check after every paragraph):
${pronounTable}
No pronoun may appear without matching the table above.
```

Where `pronounTable` is the same table already computed in `buildPronounAccuracyBlock`. This requires passing the pre-computed `pronounTable` string into the obligation block builder rather than rebuilding it.

**Secondary fix — per-paragraph reminder instruction:**  
Add a sentence to the paragraph-level instruction: `"After writing each paragraph, re-verify every pronoun against the table before writing the next."` This directly targets the "Chapter 5+ drift" pattern where the model produces correct pronouns for the first 3–4 paragraphs then drifts.

**Score impact:** Estimated +3 pts. The current fix (P1) reduces pronoun errors; this fix should reduce the repair count from 14–18 to ≤3 per chapter for cast compositions where the model drifts in later chapters.

---

## Section 4 — What Actually Improved (Changes That Worked)

For balance: not all P3–P15 changes regressed.

| Change | Evidence it worked |
|--------|-------------------|
| FixB temperature escalation | N-gram overlap failures now resolve within 4 attempts; no total failure |
| Chapter-beat uniqueness gate (P4) | No direct evidence of exact confrontation repeat in 2339 (though the chapter CONTENT is still repetitive) |
| DT chapter new-fact requirement (P6) | Ch7 in 2339 does include a temperature-measurement new fact |
| Motive + kill statement (P8) | Ch9 in 2339 has a resolution sentence (injected, but present) |
| FixA classifier | Entropy failure recovers by attempt 4 (not attempt 1) |
| `min_ratio 0.45` | No word-count floor failures in 2339 run |

---

## Section 5 — Architectural Observation

The core regression pattern is a **validation bypass via post-processing injection.** Every gate added to the validation loop (P2–P15) improves what the model generates during inference. But `enforceLockedFactValuePresence` and `enforceCulpritEvidencePresence` run **after** the validation loop, in post-processing. They can insert any sentence — including sentences that would fail the very linting rules added in P2–P15 — with no quality check.

The architecture allows validators and post-processors to work at cross-purposes:
- Validator blocks: "The interval... came to forty minutes."
- Post-processor injects: "The interval... came to forty minutes."

**Recommendation:** Any sentence injected by a post-processor should either:
(a) be passed through the linter before being appended to the chapter, or  
(b) be a prose template written by a human (not a formula) that reads naturally in context.

---

## Section 6 — Issues NOT Caused by May 20 Changes (Pre-Existing)

These appeared in the 1846 baseline too and are not regressions from yesterday.

| Issue | Present in 1846? | Status |
|-------|-----------------|--------|
| Victim never named in Ch1 | Yes | Partially mitigated by Fix 10c; still present |
| "Waiting for the investigator" phrase | Yes | Partially mitigated; reduced not eliminated |
| Estate name oscillation | Yes | Fixed by A4 (one name locked) |
| DT chapter weak/no test | Yes | Partially mitigated by P6/A2 |
| Timeline cross-chapter inconsistency | Yes | Partially mitigated by P11 |
