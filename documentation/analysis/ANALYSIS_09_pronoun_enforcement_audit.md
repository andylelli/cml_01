# ANALYSIS_09: Pronoun Enforcement System — Critical Audit

**Date:** 2026-03-15  
**Scope:** All pronoun-correctness mechanisms across the generation and validation pipeline  
**Verdict:** The system is structurally over-engineered for the wrong problem, under-specified for the actual failure mode, and has at least four silent correctness bugs.

---

## 1. System Map — What We Actually Do

The pronoun system has three layers. On paper this looks robust. In practice each layer has independent failure modes that compound.

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: PROMPT PREVENTION                             │
│  Prevent the LLM writing wrong pronouns in the first    │
│  place                                                  │
├─────────────────────────────────────────────────────────┤
│  LAYER 2: DETERMINISTIC REPAIR                          │
│  Post-generation correction before validation           │
├─────────────────────────────────────────────────────────┤
│  LAYER 3: VALIDATION + RETRY                            │
│  Detect surviving errors → trigger LLM regeneration     │
└─────────────────────────────────────────────────────────┘
```

### Layer 1 — Prompt Prevention

| Call path | Pronoun instruction present | Format |
|-----------|----------------------------|--------|
| `buildProsePrompt` system | Yes — IMMUTABLE PRONOUN MAP block | `- Name: he/him/his` |
| `buildProsePrompt` `characterConsistencyRules` | Yes — embedded in critical rules block | inline bullet with examples |
| `buildProsePrompt` pre-checklist (3rd message) | Yes — dialogue tag rule only | prose sentence |
| `buildProsePrompt` prose state section | Yes — CHARACTER PRONOUNS | `• Name: he/him/his` |
| `buildLeanRevisionMessages` system | Yes — CHARACTER MAP + gender alert (Fix 5) | `- Name: he/him/his` |
| `buildLeanRevisionMessages` user directive | Yes — pronounLockLines via `buildRetryRevisionUserDirective` | embedded |
| `buildRetryRevisionPrompt` system | **NO.** Five-line system, zero pronoun instruction. | — |
| `buildRetryRevisionPrompt` user directive | Yes — pronounLockLines | embedded |

**Count of distinct representations of the same pronoun table: 5**  
`he/him/his`, `he/him/his`, `he/him/his`, `he/him/his`, `he/him/his` — identical content, five locations, four different formatting styles.

### Layer 2 — Deterministic Repair (`pronoun-repair.ts`)

Two repair passes run on every chapter before validation:
1. **Sentence-level repair** (`repairPronouns`): if exactly one character is named in a sentence and the sentence contains wrong-gender pronouns, fix them. Follow-up sentences (no named character) inherit the last single-character reference.
2. **Dialogue attribution repair** (`repairDialogueAttributionPronouns`): if the closing-quote pronoun (`she asked`, `he said`) doesn't match the character named before the opening quote (within 300 chars), fix it.

### Layer 3 — Validation (`CharacterConsistencyValidator`)

`findIncorrectPronouns()` runs in two modes:
- **Same-sentence (conservative):** only triggers on explicit subject pronouns matching a structural connector pattern `(?:^|[;:,.!?]\s+|\band\s+|\bbut\s+|\bwhile\s+|\bthough\s+)` — and only when no other character of the same pronoun gender is also named in the sentence.
- **Follow-up sentence (strict):** any wrong-gender pronoun in the sentence following one naming this character is flagged, with no subject-pattern gate.

---

## 2. Failure Mode Taxonomy

### F1 — The Absent Character Problem (root cause of PROMPT_03 failure)

**What happens:** Sharon's ch6 scene has `"characters": ["Sharon Tregothnan"]`. Henri Waldegrave is referenced in Sharon's thoughts ("she remembered Henri standing in the doorway") but is not in the scene cast. The LLM writes an entire chapter in she/her momentum. When Henri comes up, the model continues using she/her because it has just written 1,000 words of female pronouns.

**Why prevention fails:** The IMMUTABLE PRONOUN MAP lists Henri as `he/him/his` but this is sandwiched inside a 4,000-token system message alongside word count rules, era instructions, mystery conventions, and character role data. The model's attention to the pronoun block is diffuse. There is no targetted signal saying "Henri will appear in this chapter but is NOT the POV character — every he/him/his you see refers to Henri, not Sharon."

**Why repair (partially) fixes it:** If the sentence is "Sharon watched as Henri left the room. She wondered what he thought of her" — the repair algorithm sees sentence 1 has both Sharon AND Henri (two characters, mixed gender) → skips repair. Sentence 2 has no named character → inherits last single character. But the last SINGLE-character sentence may have been five sentences earlier. `lastSingleCharacter` is wrong. Result: no repair, validator fires.

**Why the lean revision retry re-fails:** The lean revision system message (after Fix 5) now says `⚠️ MALE CHARACTER PRONOUN ALERT: Henri Waldegrave is MALE. Never write "she"/"her" for him.` This is better. But the model is told to regenerate from scene context alone, with no prior prose to correct — meaning it again generates fresh prose with the same female-momentum bias from the scene framing. The alert is the right idea but is a single additional line in a system message that already warns about pronouns in three other ways. Marginal impact at best.

### F2 — Repair Algorithm's `lastSingleCharacter` Inheritance

**Location:** `pronoun-repair.ts`, `repairPronouns()`, follow-up sentence logic

**The bug:** After a sentence that names exactly one character, the next sentence with no named character inherits that character for pronoun repair. This is directionally correct but fails when the author switches subject mid-paragraph without naming anyone.

**Concrete case:**
```
"Henri muttered under his breath, frustrated."   ← names Henri → lastSingle = Henri
"She reached past him to take the letter."       ← no name → inherits Henri
```
"She" is being repaired → "He" because the repair assumes the follow-up refers to Henri. But if the author means Sharon here, the repair is wrong. The validator will then catch a pronoun error that repair INTRODUCED.

This is not hypothetical — any scene where a male and female character interact without naming them alternately will hit this.

### F3 — `repairDialogueAttributionPronouns` 300-Char Lookback

**Location:** `pronoun-repair.ts`, `repairDialogueAttributionPronouns()`

**The bug:** The function searches at most 300 characters backwards from the closing quote to find who is speaking. In generated prose, dialogue attributions often come at the end of a long paragraph where the speaker was named at the START:

```
"Henri crossed the room and stood before Sharon, his expression unreadable.
He spoke quietly, choosing each word with the precision of a man rehearsing
a speech he had long since memorised. The study felt smaller somehow,
the walls pressing inward with the weight of what was about to be said.

'I know what you found,' he said."    ← 400+ chars since Henri was named
```

At the closing quote, the 300-char lookback finds only the long interior sentences, no named character → repair skips it → validator sees `he said` on a female-attributed quote or vice versa.

### F4 — `her` Disambiguation Heuristic Is Unreliable

**Location:** `pronoun-repair.ts`, `repairPronounsInSegment()`

**The heuristic:**
```typescript
const looksLikePossessive = /^[a-z]/i.test(afterMatch) && 
  !/^(\.|\?|!|,|;|:|and\b|but\b|...)/i.test(afterMatch);
```

"Her" followed by any lowercase word that isn't a listed conjunction → treated as possessive → replaced with "his".

**Concrete case:**
```
"Sharon glanced at her, surprised."  ← "her" followed by "," which IS in the exclusion list
                                         → treated as OBJECT → replaced with "him" ← WRONG
```
vs.
```
"Sharon took her pen from the desk." ← "her" followed by "pen" (noun)
                                         → treated as POSSESSIVE → replaced with "his" ← CORRECT
```

The exclusion list stops at commas but "her, startled" (followed by comma+adj) is object, not possessive. The heuristic is unreliable in any sentence where "her" precedes a comma.

Additionally there is a subtle positional bug: the match index is obtained via `segment.indexOf(match, 0)` which always finds the FIRST occurrence of the match string in the segment, not the current regex match position. In sentences with multiple "her" occurrences this maps afterMatch to the wrong position.

### F5 — Validator Follow-Up Sentence Rule Is Overly Strict

**Location:** `character-validator.ts`, `findIncorrectPronouns()`, follow-up sentence block

**The rule:** A follow-up sentence (no named character) after any sentence naming Character X is checked for wrong-gender pronouns with NO subject-pattern gate — ANY wrong-gender pronoun form triggers an error.

**Why this is wrong:** Literary prose routinely does this:

```
"Henri watched from across the room."   ← names Henri
"She felt his gaze like a weight."      ← no named character
                                         → validator flags "She" as wrong for Henri
```

But "She" correctly refers to Sharon (POV character). The sentence before named Henri but the follow-up switched subjects back to the narrator/POV. The validator has no way to know this and flags a false positive.

This false positive fires even AFTER the repair algorithm correctly skipped this sentence (repair also inherits, but it would have correctly replaced "She" → "He" on Henri's behalf — which is WRONG). So we have a case where:
- Repair wrongly replaces "She" → "He"
- Validator then checks the repaired text and finds "He" correctly matching Henri → passes

Or alternatively:
- Repair skips (doesn't inherit correctly)
- Validator fires false positive
- Retry fires on content that was actually correct prose

### F6 — No Pronoun Instruction in `buildRetryRevisionPrompt` System Message

**Location:** `agent9-prose.ts`, `buildRetryRevisionPrompt()`

The system message is:
```
"CONTEXT: All output is for a Golden Age whodunnit mystery novel..."
"You are a targeted chapter regeneration assistant for mystery fiction."
"Write a fresh chapter that corrects ALL listed errors."
"Keep chapter count/order unchanged and do not add/remove chapters."
"Return JSON only."
```

No pronoun map. No dialogue tag rule. The pronouns are buried in the user directive built by `buildRetryRevisionUserDirective`. The model receives the system message first and has no top-level pronoun constraint.

### F7 — Initial Generation Has No Scene-Scoped Absent-Character Alert

**Location:** `buildProsePrompt()` only

Fix 5 added the gender alert (absent male character alert) to `buildLeanRevisionMessages`. But the FIRST generation happens via `buildProsePrompt`. In multi-scene chapter batches, the gender composition of scene A influences the LLM's pronoun momentum for scene B. There is no per-scene absent-character signal in the initial generation — which is where the first pronoun error typically originates.

### F8 — Pronoun Instruction Redundancy Has Diminishing Returns

Listing the pronoun table in five places in a 6,000-token prompt context does not multiply the constraint by five. Beyond two repetitions, LLMs treat the repeated content as context noise rather than incremental constraint. The actual attention signal on each instance is lower than a single, prominently placed constraint.

More information ≠ more compliance. What matters is **position** (start of message > buried mid-message), **contrast** (a warning that stands out tonally from surrounding text), and **specificity** (named character + named scene context, not just a generic table).

Our pronoun table is always a plain list of names and pronouns, appearing mid-context, surrounded by dozens of other rules. It is exactly the style of instruction that LLMs learn to attend to less.

---

## 3. Correctness Risk Matrix

| Mechanism | Can produce false positive (valid prose flagged as error)? | Can produce false negative (broken prose passes)? |
|-----------|---|----|
| `findIncorrectPronouns` follow-up rule | **YES** (F5: POV switch in follow-up) | Yes (same-sentence subject-pattern gate) |
| `findIncorrectPronouns` same-sentence rule | Rarely | YES (subject-pattern gate filters many real errors) |
| `repairPronouns` inheritance | **YES** (F2: wrong inheritance) | Yes (multi-character sentences skipped) |
| `repairDialogueAttributionPronouns` | Rarely | **YES** (F3: 300-char lookback) |
| `her` disambiguation | **YES** (F4: comma-adjacent case) | Yes (opposite direction) |
| Prompt prevention (F1, F7, F8) | N/A | **YES** (insufficient salience) |

---

## 4. The Actual Root Cause (Not the Proximate Cause)

All the mechanisms above treat the symptom. The root cause is:

**The LLM is generating chapter-length prose in a single pass with global context. Pronoun consistency is a LOCAL operation that degrades over distance.**

In a 1,400-word chapter, the model's attention to a name introduced in sentence 3 has decayed substantially by sentence 47. When a male character is referenced only briefly in a female-POV chapter, he is not in the model's hot context when the prose around him is being generated. The model defaults to the dominant gender register of the surrounding text (she/her) because that is statistically coherent with the recent tokens.

This is not a prompt engineering problem. It is a context window coherence problem. No amount of additional pronoun instructions in the system message repairs this because the instructions are not in the model's active attention at the point of generation.

The correct solution is structural: either constrain what characters can co-appear in a scene, or post-process more aggressively, or verify pronouns at the paragraph level rather than the chapter level.

---

## 5. What Is Working

To be fair:
- The `repairChapterPronouns` pipeline (Layers 1+2 combined) catches a large proportion of unambiguous cases — sentences where exactly one character is named and the mismatch is obvious.
- The dialogue attribution repair correctly handles the common "he said inside quoted speech" pattern.
- Running repair BEFORE validation prevents many false validator errors.
- The validator's same-sentence subject-pattern gate is correctly conservative.
- Fix 5 (absent male character alert in lean revision) is directionally correct and addresses the most common failure mode.

---

## 6. What Should Be Removed

The following are dead weight — they add prompt tokens, create maintenance risk, and demonstrably do not improve outcomes.

### R1 — Remove `CHARACTER PRONOUNS` from the narrative state block (`buildNarrativeStateBlock`)

**Location:** `agent9-prose.ts` ~line 1087  
**What it does:** Emits `\nCHARACTER PRONOUNS — never deviate from these: • Name: he/him/his` into the `NARRATIVE STATE` section of the context.  
**Why it can go:** This is a third copy of the pronoun table that appears deep inside a large JSON-adjacent block. The model has just read it in the `IMMUTABLE PRONOUN MAP` block. Narrative state is for runtime story facts (locked evidence, used openings, revealed clues) — pronoun gender is structural data, not narrative state. Remove the entire pronoun subsection from this function.

### R2 — Remove pronoun repetition from `characterConsistencyRules` inline list

**Location:** `agent9-prose.ts` ~line 1419, the `characterConsistencyRules` string  
**What it does:** Emits a fourth copy: `2. Gender pronouns must match character definition: - Name: he/him/his` as part of the character consistency rules block.  
**Why it can go:** The `IMMUTABLE PRONOUN MAP` block already covers this with stronger framing. The character consistency block is priority `critical` and high-token — it should focus on the unique rules it owns (cast name legality, role-location constraints) and drop the pronoun sub-list entirely. The one-liner `Never switch pronouns mid-story` can be kept as a single sentence rather than a full per-character list.

### R3 — Remove `castSnapshot.pronouns` from the `cmlGroundTruthBlock` JSON snapshot

**Location:** `agent9-prose.ts` ~line 1151, the `castSnapshot` construction in `buildCmlGroundTruthBlock`  
**What it does:** Each cast member in the CML ground truth JSON snapshot includes a `pronouns` field (`"pronouns": "he/him/his"`). This embeds a fifth copy of the pronoun table inside the JSON blob.  
**Why it can go:** The ground truth snapshot exists to anchor story logic — crime mechanism, inference path, clue mapping. Pronoun gender is not a CML logic fact that needs to appear in the case snapshot. The field wastes tokens and is silently ignored by the model in favour of the explicit PRONOUN MAP heading it reads first. Remove `pronouns` from `castSnapshot`.

### R4 — Remove the follow-up sentence block from `findIncorrectPronouns`

**Location:** `character-validator.ts`, `findIncorrectPronouns()`, the `followUpContexts` loop (~line 270)  
**What it does:** Any sentence that immediately follows a sentence naming Character X, and contains no named character at all, is scanned for any wrong-gender pronoun form. Him/her/his are checked, not just subject forms.  
**Why it can go:** This is the primary source of false positives (F5). POV switches between sentences are standard prose — `"Henri looked up. She held her breath."` is correct, but the rule flags `She` and `her` against Henri. The repair algorithm's inheritance model is equivalent in scope and already runs first. If the repair algorithm passes the text, the validator should trust it. The same-sentence check (which is conservative and uses the subject-pattern gate) is sufficient for validation. **Remove the followUpContexts block entirely from `findIncorrectPronouns`.**

---

## 7. What Should Be Consolidated

### C1 — One pronoun table, one location, in the system message

After removing R1, R2, R3 above, the pronoun table appears in exactly two places:
1. **`IMMUTABLE PRONOUN MAP`** block — appended to the developer message in `buildProsePrompt`. This is the right location. Keep it, strengthen it.
2. **Pre-checklist 3rd message** — dialogue tag rule only (one sentence). Keep it; it is correctly scoped.

The result: one authoritative table, one scoped assertion. Everything else is noise.

### C2 — Unify the `buildPronounLockLines` format across all call paths

Currently the pronoun table appears as:
- `- Name: he/him/his` (IMMUTABLE PRONOUN MAP, CHARACTER MAP in lean revision)
- `• Name: he/him/his` (narrative state — to be removed)
- `- Name: he/him/his` (characterConsistencyRules inline — to be removed)
- `"pronouns": "he/him/his"` (JSON snapshot — to be removed)

After the removals, only the dash-list format remains — consistent across `buildProsePrompt` and `buildLeanRevisionMessages`.

### C3 — Merge `buildRetryRevisionPrompt` system into the IMMUTABLE PRONOUN MAP standard

**Location:** `agent9-prose.ts`, `buildRetryRevisionPrompt()` ~line 1967  
**Current:** Five-sentence system with zero pronoun content.  
**Fix:** Append the same `IMMUTABLE PRONOUN MAP` block used by all other paths. This path is a hard-retry route on severe failures — if anything, it needs more constraint, not less.

---

## 8. What Should Replace What's Removed

The freed token budget from R1–R4 should be spent on two targeted improvements.

### N1 — Absent-character alert in `buildProsePrompt` initial generation (per-scene)

**What it is:** For each scene in the batch, identify male characters who are referenced in the outline but are NOT in the scene's `characters` array. Emit a single compact alert line in the system message: `⚠️ Ch6: Henri Waldegrave (MALE, he/him) will be referenced but is NOT the POV character. Every "she"/"her" belongs to Sharon only.`

**Why initial generation, not just lean revision:** Lean revision (Fix 5) added this alert to the retry path. But the error is seeded in the first generation. The lean revision alert is remedial; a generation-time alert is preventive.

**Where to add it:** After the `IMMUTABLE PRONOUN MAP` block in `buildProsePrompt`, before the pre-checklist message. Scoped to each scene in the current batch.

### N2 — Paragraph-boundary reset in `repairPronouns`

**What it is:** `repairPronouns` currently maintains `lastSingleCharacter` across the entire chapter. This causes wrong-gender inheritance across paragraph breaks (F2). The fix: reset `lastSingleCharacter = null` each time the sentence splitter encounters a paragraph boundary (double newline `\n\n`).

**How to implement:** Before splitting into sentences, split first on `\n\n` to get paragraphs, then process each paragraph independently, resetting `lastSingleCharacter` between them. Merge paragraph results to reconstruct the chapter.

**What this replaces:** The current monolithic pass over all sentences. The behaviour within a paragraph is unchanged; only cross-paragraph inheritance is eliminated.

### N3 — Extend dialogue attribution lookback to paragraph-start

**What it is:** Replace the 300-char fixed lookback in `repairDialogueAttributionPronouns` with a lookback to the nearest preceding paragraph break (`\n\n` boundary), with a maximum of 800 chars as a safety cap.

**Why:** Long paragraphs of 400–600 chars of narration before a dialogue line defeat the 300-char limit (F3). Authors name the speaker at paragraph-start, then write a long passage, then close with dialogue — the standard pattern. The paragraph boundary is the semantically correct lookback unit.

### N4 — Fix `her` disambiguation offset bug

**What it is:** In `repairPronounsInSegment`, the `afterMatch` slice uses `segment.indexOf(match, 0)` to locate the current match. When a sentence contains multiple instances of `her`, this always returns the position of the FIRST `her` regardless of which one the regex engine is currently replacing (F4).

**Fix:** The `String.prototype.replace` callback receives the match offset as the 4th argument. Use that offset instead of `indexOf`:
```typescript
return segment.replace(pattern, (match, pronoun: string, _g1: string, offset: number) => {
  const afterMatch = segment.slice(offset + match.length).trimStart();
  ...
```

---

## 9. Revised Architecture (Post-Change)

```
┌─────────────────────────────────────────────────────────────┐
│  PREVENTION (Layer 1) — Single authoritative instruction    │
│                                                             │
│  buildProsePrompt:                                          │
│  1. IMMUTABLE PRONOUN MAP in developer/strict block         │
│     (one table, dialogue tag rule, pronoun mismatch = fail) │
│  2. Per-scene absent-character alert (NEW N1)               │
│  3. Pre-checklist: dialogue tag assertion (kept)            │
│                                                             │
│  buildLeanRevisionMessages:                                 │
│  1. CHARACTER MAP (same format)                             │
│  2. ⚠️ MALE CHARACTER PRONOUN ALERT (Fix 5, kept)           │
│                                                             │
│  buildRetryRevisionPrompt:                                  │
│  1. IMMUTABLE PRONOUN MAP added (NEW C3)                    │
│                                                             │
│  REMOVED: NSD character pronouns (R1)                       │
│  REMOVED: characterConsistencyRules pronoun sub-list (R2)   │
│  REMOVED: castSnapshot.pronouns JSON field (R3)             │
├─────────────────────────────────────────────────────────────┤
│  REPAIR (Layer 2) — More precise, paragraph-scoped          │
│                                                             │
│  repairPronouns:                                            │
│  - Paragraph-boundary reset (NEW N2)                        │
│  - her disambiguation offset fix (NEW N4)                   │
│                                                             │
│  repairDialogueAttributionPronouns:                         │
│  - Paragraph-start lookback, 800-char max (NEW N3)          │
├─────────────────────────────────────────────────────────────┤
│  VALIDATION (Layer 3) — Conservative, no false positives    │
│                                                             │
│  findIncorrectPronouns:                                      │
│  - Same-sentence subject-pattern gate (kept — it's correct) │
│  - Follow-up sentence block (REMOVED R4)                    │
│                                                             │
│  Net: validator catches only unambiguous same-sentence      │
│  errors that passed repair. Repair handles the rest.        │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Change Summary Table

| ID | File | Action | Reason |
|----|------|---------|--------|
| R1 | `agent9-prose.ts` | Remove CHARACTER PRONOUNS from `buildNarrativeStateBlock` | 3rd copy; wrong conceptual location |
| R2 | `agent9-prose.ts` | Remove pronoun sub-list from `characterConsistencyRules` | 4th copy; same block owns cast legality, not pronoun gender |
| R3 | `agent9-prose.ts` | Remove `pronouns` field from `castSnapshot` in `buildCmlGroundTruthBlock` | 5th copy; not a logic fact; wastes JSON tokens |
| R4 | `character-validator.ts` | Remove `followUpContexts` block from `findIncorrectPronouns` | Leading false positive source; repair covers this scope |
| C3 | `agent9-prose.ts` | Add IMMUTABLE PRONOUN MAP to `buildRetryRevisionPrompt` system | Only path with no system-level pronoun instruction |
| N1 | `agent9-prose.ts` | Add per-scene absent-character alert to `buildProsePrompt` | Prevents error at source, not just in retry |
| N2 | `pronoun-repair.ts` | Reset `lastSingleCharacter` at paragraph boundaries | Eliminates cross-paragraph wrong inheritance |
| N3 | `pronoun-repair.ts` | Use paragraph-start lookback in dialogue attribution repair | Fixes long-paragraph speaker identification |
| N4 | `pronoun-repair.ts` | Fix `her` disambiguation to use regex offset, not `indexOf` | Fixes multi-`her` replacement bug |

**Token impact of removals:** R1 (~15 tokens × cast size), R2 (~20 tokens × cast size), R3 (~10 tokens × cast size). For a 5-character cast: ~225 tokens freed per generation call — small but cleanly redirectable to N1.

---

## 11. Summary

The pronoun system has accumulated layers over multiple sessions without a clear model of what failure it is actually preventing. The result is:

- **Prevention layer:** Too diffuse (five formats, buried context). Adding more text will not fix the momentum problem.
- **Repair layer:** Works for clear unambiguous cases. Introduces correctness bugs in mixed-gender scenes and cross-paragraph inheritance.  
- **Validation layer:** Produces false positives (follow-up rule) and false negatives (subject-pattern gate), causing both incorrect retries and missed errors.

The system is not broken because we haven't written enough pronoun instructions. It's broken because (a) the repair and validator are operating at the wrong granularity, (b) the same content is repeated five times diluting the signal of each, and (c) the root cause — LLM attention decay over distance in a long single-pass generation — cannot be fixed by prompting alone.

The changes above: remove 3 redundant copies, remove 1 false-positive rule, fix 3 repair bugs, add 1 targeted prevention signal at the right point (initial generation, per-scene). Total scope: ~9 targeted changes, no architectural rewrites.
