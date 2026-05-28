# ANALYSIS_22 — Canary run mystery-1779396354473 failure analysis

**Run date:** 2026-05-21  
**Outcome:** FAILED — `Pipeline failure: Story validation failed: 0 critical, 8 major issues`  
**Stage reached:** Full prose generation + validation (all agents 1–9 completed)

---

## Summary of issues

| # | Issue type | Severity | Count | Chapters |
|---|-----------|----------|-------|---------|
| F1 | `locked_fact_missing_value` — "one distinct scratch" | major | 4 | 1, 6, 7, 9 |
| F2 | `locked_fact_missing_value` — "a quarter past ten" | major | 2 | 8, 10 |
| F3 | `pronoun_drift` — Eleanor Voss | moderate | 3 | 1, 2, 4 |
| F4 | `pronoun_drift` — Beatrice Quill | moderate | 1 | 2 |
| W1 | Agent 3 victim/culprit collision (retry fired) | warning | 1 | — |
| W2 | Novelty similarity 0.82 vs "Mysterious Affair at Styles" | advisory | — | — |

The 8 major issues are F1 (4) + F2 (2) + the two fact failures appear to be the only `major` issues. The `pronoun_drift` is reported as `moderate`, but the pipeline treats **≥5 major** as `needs_revision` and **≥8** as the hard failure threshold. The exact threshold being crossed is 8 majors — this suggests additional issues beyond F1+F2 are also contributing (see section 3 below).

---

## F1 — `locked_fact_missing_value`: "one distinct scratch" (4 chapters)

### What happens
Locked fact: description = "A clear sign of recent tampering on the clock mechanism", canonical = `"one distinct scratch"`.  
Validator fires on chapters 1, 6, 7, 9 — chapters that mention 2+ tokens from the description (`clock`, `tamper`, `mechanism`, `scratch` etc.) but do NOT contain the exact string `"one distinct scratch"`.

### Root cause

**`repairWordFormLockedFacts`** — The repair system handles word-phrased time values and durations. `"one distinct scratch"` matches neither `parseWordFormTime` nor `parseWordFormQuantity`. It falls to the generic verbatim case-insensitive pattern — which only matches exact text occurrences, not synonyms. It cannot repair `"a scratch"`, `"scratch marks"`, `"a notable scratch"`, etc.

**`enforceLockedFactValuePresence`** — The injection template for the `generic` type is **disabled** (template returns `""`):

```typescript
// F3: disabled — produces court-document prose
generic: (_d, _v) => ``,
```

So when the validator finds a chapter with description tokens but no canonical value, there is **no repair mechanism** that can insert `"one distinct scratch"`. The prose LLM is writing synonyms or paraphrases and nothing converts them to the canonical form.

**Scope mismatch** — `annotatedLockedFacts` sets `appearsInChapters` to the FIRST chapter where the associated clue appears (based on keyword overlap). Repair passes are scoped to those chapters only. But the validator fires on ALL chapters with 2+ token matches. Chapters after the first-appearance chapter get no repair coverage.

### Fix options

**Option A (recommended):** In `repairWordFormLockedFacts`, add a synonym/paraphrase pattern list for non-time generic canonicals. For `"one distinct scratch"`, add patterns like `\ba\s+(?:single\s+)?(?:deep\s+|fresh\s+|notable\s+|clear\s+)?scratch(?:es|\s+mark)?\b` → `"one distinct scratch"`.  
This is fact-specific and fragile. Better to:

**Option B (preferred):** Re-enable a safe version of the generic injection template — only when the canonical is a short noun phrase (< 5 words, no digit form). The current F3 disable was added because generic injection produces court-document prose like "The relevant value was established: X." but a better sentence template is available:
```typescript
generic: (d, v) => `${d.charAt(0).toUpperCase() + d.slice(1).trim()} confirmed the detail: ${v}.`,
```

**Option C:** Widen the repair scope — instead of scoping `repairWordFormLockedFacts` and `enforceLockedFactValuePresence` to `appearsInChapters` only, run them on all chapters where 2+ description tokens appear (mirroring the validator's scope logic). This ensures repairs are applied wherever the validator fires.

---

## F2 — `locked_fact_missing_value`: "a quarter past ten" (2 chapters)

### What happens
Locked fact: description = "The last known time the clock was wound before the murder", canonical = `"a quarter past ten"`.  
Fails in chapters 8 and 10.

### Root cause

**`parseWordFormTime`** cannot parse `"a quarter past ten"** because the canonical starts with `"a "`:

```typescript
const quarterPast = lower.match(/^quarter\s+past\s+(\w+)$/);
// "a quarter past ten" → NO MATCH (starts with "a quarter...")
```

Since `parseWordFormTime` returns `null`, the repair system does NOT build digit-form conversion patterns (`10:15 PM` → `"a quarter past ten"`). It falls to the verbatim generic pattern, which only catches exact case variants — not `"10:15 PM"`, `"ten fifteen"`, etc.

`enforceLockedFactValuePresence` does fire (`classifyFactValue("a quarter past ten")` correctly detects `"past"` → returns `'time'`), injecting `"The time was recorded as a quarter past ten."` But:
- The injection is capped at 2 per fact
- Chapters are scoped to `appearsInChapters` (first clue appearance)
- If the first clue chapter ≠ chapters 8 or 10, injections never reach those chapters

### Fix

In `parseWordFormTime`, add a pre-processing step to strip a leading article:

```typescript
const lower = value.toLowerCase().trim().replace(/^(a|an|the)\s+/, '');
```

This makes `"a quarter past ten"` → `"quarter past ten"`, which the existing `quarterPast` pattern then handles correctly, generating proper digit-form repair patterns.

---

## F3/F4 — `pronoun_drift` (4 total, moderate)

### Eleanor Voss in chapters 1, 2, 4 — Beatrice Quill in chapter 2

The `applyDeterministicPronounSweep` pass runs before validation and should repair wrong-gender pronouns. The fact that 4 `pronoun_drift` moderates survive into validation means either:

1. **Competing-entity guard suppressing legitimate repairs** — When a male character (e.g. Captain Hale) is named within 200 characters of a female character's name, the guard flags it as ambiguous and skips repair. If Hale appears in the same paragraph as Eleanor Voss, the repair is suppressed even for unambiguous `he`/`him` attributions to Hale that are near Eleanor's name.

2. **Chapter 1 is the discovery scene** — Eleanor Voss is the murder victim found dead in chapter 1. Other male characters are likely present in the same paragraph. The competing-entity guard is probably suppressing repairs here correctly (ambiguous pronouns ARE expected), but the validator still fires.

3. **Validator cross-paragraph scope** — The `pronoun_drift` check looks within a 200-char window. The repair sweep may operate on individual paragraphs, missing cross-paragraph pronoun attribution chains.

### Assessment

The `pronoun_drift` moderate errors in this run are likely **false positives** from the competing-entity guard's scope — male characters legitimately referenced near female characters. These moderates do not count toward the `major` threshold (they are `moderate`, not `major`). The pipeline's 8-major threshold counts only `major` severities.

**Re-assessment of failure threshold:** If `pronoun_drift` is `moderate` only, then the 8-major failure must come entirely from F1 (4) + F2 (2) = 6 majors. There must be at least 2 more major issues not shown in the terminal excerpt (the errors note `"... and 6 more validation errors (all logged to scoring.jsonl)"`).

---

## W1 — Agent 3 victim/culprit collision retry

### What happened
The retry fired and successfully resolved the collision. However, the exclusion names passed were `"Victim known for their contested inheritance claims, Beatrice Quill"` — the first is a role description from `crimeDynamics.victimCandidates[0]`, not a real character name.

### Why it still worked
The strengthened prompt constraint (`"MUST NOT appear in culpability.culprits[]"`) in the base prompt was the effective fix — the exclusion names were advisory. The LLM respected the base constraint.

### Fix needed
In `agent3-run.ts`, when building `exclusionNames`, fall back to the actual victim character name from the CML cast if `victimCandidates[0]` is not a real character name:

```typescript
const victimNames: string[] = ((ctx.cast as any)?.cast?.crimeDynamics?.victimCandidates ?? [])
  .map(String)
  .filter((n: string) => {
    // Accept only names that match an actual cast character
    const castNames = ((ctx.cast as any)?.cast?.characters ?? []).map((c: any) => String(c.name ?? ''));
    return castNames.some(cn => cn.toLowerCase() === n.toLowerCase());
  });
// Fallback: if victimCandidates produced no valid names, use cast characters with role=victim
if (victimNames.length === 0) {
  const victimFromCast = ((ctx.cast as any)?.cast?.characters ?? [])
    .filter((c: any) => String(c.roleArchetype ?? '').toLowerCase().includes('victim'))
    .map((c: any) => String(c.name ?? ''))
    .filter(Boolean);
  victimNames.push(...victimFromCast);
}
```

---

## W2 — Novelty: 0.82 similarity with "The Mysterious Affair at Styles"

The novelty audit reported `highestSimilarity = 0.82` with `blocking = false`. The theme (inheritance dispute, country manor, 1930s, doctor + military figure) closely mirrors the seed. The canary inputs are fixed, so this is expected for this specific theme configuration. The non-blocking status means this did not cause the pipeline failure.

---

## Priority order for fixes

| Priority | Fix | Effort | Impact |
|----------|-----|--------|--------|
| HIGH | Strip leading article in `parseWordFormTime` | Low (1-line) | Fixes F2 directly |
| HIGH | Re-enable generic injection with safe template | Low (template change) | Fixes F1 partially |
| MEDIUM | Widen repair scope to match validator scope | Medium | Fixes F1+F2 scope mismatch |
| MEDIUM | Fix `culpritExclusionNames` to use real cast names | Low | Robustifies W1 retry |
| LOW | Investigate 6 additional unreported major issues | Medium | Understand full failure depth |

---

## Reproduction note

The collision retry (W1) did NOT prevent the story from completing. The 8-major failure is entirely from locked-fact enforcement gaps (F1/F2). Fixing the `parseWordFormTime` article-stripping and re-enabling generic injection should eliminate at least 6 of the 8 major issues, bringing the run into `passed` or `needs_review` territory.
