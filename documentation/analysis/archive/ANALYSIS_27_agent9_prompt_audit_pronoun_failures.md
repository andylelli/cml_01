# ANALYSIS_27 — Agent9 Prompt Audit: Pronoun Validation Failures

**Date:** 2026-01-01  
**Status:** Complete  
**Scope:** All 9 runs that produced pronoun validation failures  
**Depends on:** ANALYSIS_26 (validator overhaul)

---

## 1. Overview

Nine runs triggered pronoun validation errors. After auditing the agent9 system
prompts and the actual generated prose, these failures split into two categorically
different root causes:

| Category | Runs | Count | Root Cause |
|----------|------|-------|------------|
| A — Binary-gender false positive | c349e4ed, 40c175ac, 5707046b, 5d7d5b79, 63d32a0a, 66a135ca, 88f0a139, b440ddbf | 8 | Validator defect, not LLM failure |
| B — Non-binary genuine LLM error | a4819da5 | 1 | Prompt insufficient for non-binary case |

---

## 2. Prompt Anatomy: Two Observed Variants

Inspection of `llm-prompts-full.jsonl` reveals two distinct forms of pronoun
guidance in agent9 system prompts.

### Variant 1 — Comprehensive (observed: run_c349e4ed)

```
PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table:
  • Raymond Dixon: he/him/his
  • Janet Blundell: she/her/her
  • Katherine Hurst: she/her/her
  • Susan Hunt: she/her/her
  • Andrew Hoare: he/him/his

Rules:
1. Every sentence is subject to this table — no exceptions for dialogue,
   reflection, narration, or attribution.
2. When two or more characters of different genders are present in the same
   sentence and a pronoun could refer to more than one of them, use the
   character's name instead of the pronoun to eliminate ambiguity.
3. A pronoun that belongs to one character must never migrate to another
   character in a neighbouring clause — especially across a semicolon or comma
   splice.
4. "Her" as a possessive and "her" as an object pronoun are both female forms.
   Do not use "her" for a male character in either function.
5. "They/them/their" as singular non-binary pronouns are fully valid — use
   them throughout.
6. In dialogue attribution ("he said", "she replied"), the pronoun must agree
   with the speaker, even when the speaker is named immediately before the
   attribution tag.
7. In nested clauses ("It was she who had…"), pronoun gender must still match
   the referent.
```

### Variant 2 — Budget-reduced (observed: run_66a135ca, run_a4819da5, and others)

```
PRONOUNS — never deviate from these:
  • Paul Wenlock: he/him/his
  • Alastair Gilmore: he/him/his
  • Cynthia Layton: she/her/her
  • Audrey Kibble: she/her/her
  • Barry Fairfax: he/him/his

════════════════════════════════════════════

SCENE GROUNDING CHECKLIST (MUST FOLLOW):
...
PROMPT BUDGET SUMMARY: budget=6200 tokens; fixed=3628; context=1943;
dropped=[humour_guide, craft_guide, location_profiles, temporal_context];
truncated=[character_personality, location_profiles, temporal_context]
```

Variant 2 appears when the prompt builder is under token budget pressure. The
seven-rule explanatory contract is replaced by a bare bullet list with no
enforcement rationale. Sections dropped include `character_personality`, which
normally reinforces character identity through descriptions and internal voice.

---

## 3. Category A — Binary-Gender False Positives (8 runs)

### 3.1 The Cross-Attribution Signature

Every binary-gender "error" follows the same pattern. Consider run_66a135ca scene 1:

| Character | Expected | Flag |
|-----------|----------|------|
| Paul Wenlock | he/him/his | found `her` |
| Alastair Gilmore | he/him/his | found `her` |
| Cynthia Layton | she/her/her | found `his` |
| Audrey Kibble | she/her/her | found `his` |

Both male characters are flagged for a female pronoun AND both female characters
are flagged for a male pronoun — in the **same scene**. This symmetry is the
diagnostic signature of cross-attribution, not LLM misgendering. The pronouns
were correct; the validator was attributing them to the wrong character.

The same pattern holds across all 8 runs:

```
run_c349e4ed  scene 6:  Raymond Dixon (he) → she, her   (3 female chars in scene)
              scene 9:  Andrew Hoare (he) → she          (female chars in scene)
              scenes 14-19: both male chars → she/her   (females present)

run_40c175ac  scene 4:  Roger Tamblyn (he) → she, her   (Wenna Nance present)
                        Wenna Nance (she) → his          (Dennis Benny present)

run_5707046b  scene 2:  Clifford Fairfax (he) → she, her
                        Jennifer Selby (she) → his
              scene 3:  Edwin Ashby (he) → her
                        Helen Wenlock (she) → he, his

run_5d7d5b79  scene 4:  Philip Mowbray (he) → she, her
                        Ann Waldegrave (she) → his

run_63d32a0a  scene 1:  Francis Tarrant (he) → she, her
                        Muriel Ashby (she) → his

run_66a135ca  scene 1:  Paul Wenlock (he) → her          (see above)
              scene 10: Paul Wenlock (he) → her
                        Audrey Kibble (she) → he, him, his

run_88f0a139  scene 9:  Christopher Trembath (he) → she, her
                        Alan Gaved (he) → she, her
                        Nessa Knuckey (she) → he, his

run_b440ddbf  scene 1:  Sidney Colton (he) → her
                        Ellen Wellow (she) → his
```

### 3.2 Validator Root Cause

The old `findIncorrectPronouns` method checked entity presence in a **single
sentence** only. Given:

> "Katherine opened the door. She turned to Raymond."

If only sentence 2 was evaluated for sentence 2, the entity "Katherine" was not
in the search window, so the validator found no competing female entity and
flagged Raymond for `she`. The LLM prose was perfectly correct.

This was fixed in **ANALYSIS_26** by passing `precedingContext` (all scene
sentences from scene start through the current sentence) to
`isOwnedByCompetingEntity`. The binary-gender false positives are eliminated
by that fix.

### 3.3 Prompt Status for Category A

Both Variant 1 (comprehensive) and Variant 2 (budget-reduced) prompts were
present across the 8 runs. Neither format caused the false positives. The LLM
wrote correct prose in all cases. The prompt was not the problem.

---

## 4. Category B — Non-Binary Genuine LLM Failure (run_a4819da5)

### 4.1 Cast and Error Profile

**Cast** (all 5 characters non-binary, they/them/their):
- Geraint James
- Claire Llewellyn
- Tegwen Bowen
- Owen Jones
- Jennifer Richards

**Errors — 10 unique violations across 3 scenes:**

| Scene | Character | Expected | Found |
|-------|-----------|----------|-------|
| 1 | Claire Llewellyn | they/them/their | she, her |
| 1 | Tegwen Bowen | they/them/their | she, her |
| 1 | Owen Jones | they/them/their | her, his |
| 1 | Jennifer Richards | they/them/their | her, his |
| 2 | Claire Llewellyn | they/them/their | she, her |
| 2 | Tegwen Bowen | they/them/their | her |
| 2 | Jennifer Richards | they/them/their | she, her |
| 3 | Claire Llewellyn | they/them/their | she, her |
| 3 | Tegwen Bowen | they/them/their | her |
| 3 | Owen Jones | they/them/their | she, her |

This is **not** a false positive. The generated story (`stories/project_proj_608df4dd-11c0-4c58-a727-2dc72519f721.txt`) confirms the LLM wrote binary pronouns throughout:

> *"Claire Llewellyn stood near the fireplace, **her** fingers nervously twisting the ring on **her** finger, a habit **she** had developed during times of stress."*

> *"Tegwen Bowen stepped into the room, **her** heart weighed down by the news **she** had just received."*

Every non-binary character received she/her or his — the LLM defaulted to
binary gendered prose and ignored they/them/their entirely.

### 4.2 Prompt Root Causes

The run_a4819da5 prompt used **Variant 2** (budget-reduced format):

```
PRONOUNS — never deviate from these:
  • Geraint James: they/them/their
  • Claire Llewellyn: they/them/their
  • Tegwen Bowen: they/them/their
  • Owen Jones: they/them/their
  • Jennifer Richards: they/them/their
```

Four compounding failures produced the LLM error:

**Failure 1 — No rationale for singular they.**  
The bullet table states what pronouns to use but not why or how. A fully
binary cast needs no further explanation; LLMs have strong priors for he/she
with named individuals. Non-binary characters need the rule made explicit:
*"they/them/their are used here as singular pronouns for a single person."*
This rule exists in Variant 1 (Rule 5) but was absent in this prompt.

**Failure 2 — Budget trimming cut character personality.**  
Character personality descriptions typically reinforce pronoun identity by
having each character think, speak, and act in ways consistent with their
presented identity. With `character_personality` truncated, the only pronoun
anchor was the bullet table. One short instruction cannot override the LLM's
billions of training tokens of binary-gendered prose.

**Failure 3 — "Never deviate" is a prohibition frame, not a usage frame.**  
"Never deviate from these" tells the LLM not to change something, implying
the listed pronouns are unusual alternatives. The comprehensive contract tells
the LLM that the table *is* the ground truth to write from. The framing
difference matters for a case where the LLM's default is the opposing choice.

**Failure 4 — All five cast members non-binary.**  
Every previous character the LLM has encountered in training is binary-gendered
in isolation. A cast of five they/them characters is an extreme edge case. The
instruction weight needed to hold five non-binary characters is higher than for
one — and this run had the lightest available instruction set.

### 4.3 Comparative Finding

run_c349e4ed and run_a4819da5 represent opposite ends of instruction quality:

| Dimension | run_c349e4ed (Variant 1) | run_a4819da5 (Variant 2) |
|-----------|--------------------------|--------------------------|
| Pronoun guidance format | 7-rule contract + table | Bullet table only |
| sections dropped | None observed | humour_guide, craft_guide, location_profiles, temporal_context |
| character_personality | Full | Truncated |
| Outcome | False positives only (LLM correct) | Genuine all-cast misgendering |

The better the instruction, the better the LLM output. The Category A runs
produced correct prose despite mixed instruction quality — binary gendered
prose is the LLM's natural default, so any amount of instruction confirms it.
Non-binary prose requires active combat against that default.

---

## 5. Conclusions

### 5.1 Fix completeness

The **ANALYSIS_26 validator fix** fully addresses Category A. The preceding-
context guard eliminates binary-gender cross-attribution false positives by
checking entity presence across all scene sentences up to the current one.

Category B (run_a4819da5) would still fail even after ANALYSIS_26, because
those are genuine LLM errors, not validator false positives.

### 5.2 Required prompt changes

**Change 1 — Protect pronoun guidance from budget reduction.**  
The pronoun block must be a fixed section (not droppable, not truncatable).
A 200-token pronoun contract is less wasteful than a 0-score run. The budget
logic must treat pronoun guidance as infrastructure, not content.

**Change 2 — Always use Variant 1 (the 7-rule contract).**  
The compressed bullet list format must be retired. The comprehensive contract
with Rules 1–7 provides the enforcement rationale the LLM needs. This applies
to binary-gender casts too — the rules prevent real misgendering in long runs
and complex multi-character scenes.

**Change 3 — Add a non-binary warning block.**  
When any cast member uses they/them/their, include a dedicated block:

```
⚠ NON-BINARY PRONOUN WARNING ⚠
The following characters use singular they/them/their. "They", "them", and
"their" are used here to refer to ONE person, not a group. Never use she/her
or he/him for these characters in any context — narration, dialogue, or
attribution.
  • [list of non-binary characters]
```

This block must appear both in the system message and be repeated in the
user message preamble for every chapter, to counteract the LLM's strong
binary-gender defaults.

**Change 4 — Reinforce pronoun identity in character personality.**  
Each non-binary character's personality description should open with a
pronoun statement: *"[Name] uses they/them/their pronouns. Write every
reference to [Name] using they/them/their, treating these as fully natural
singular forms."* This section must not be truncated for non-binary casts.

### 5.3 Two-tier remediation timeline

| Tier | Action | Status |
|------|--------|--------|
| 1 | Validator preceding-context fix (ANALYSIS_26) | ✅ Complete |
| 2 | Agent9 prompt — protect pronoun budget, upgrade to 7-rule contract, add non-binary warning block | Future |

---

## 6. Appendix — Full Error Inventory

| Run | Scene | Character | Expected | Found |
|-----|-------|-----------|----------|-------|
| c349e4ed | 6 | Raymond Dixon | he/him/his | she, her |
| c349e4ed | 9 | Andrew Hoare | he/him/his | she |
| c349e4ed | 14 | Andrew Hoare | he/him/his | she, her |
| c349e4ed | 15 | Raymond Dixon | he/him/his | she |
| c349e4ed | 16 | Andrew Hoare | he/him/his | she, her |
| c349e4ed | 19 | Raymond Dixon | he/him/his | her |
| c349e4ed | 19 | Andrew Hoare | he/him/his | her |
| a4819da5 | 1 | Claire Llewellyn | they/them/their | she, her |
| a4819da5 | 1 | Tegwen Bowen | they/them/their | she, her |
| a4819da5 | 1 | Owen Jones | they/them/their | her, his |
| a4819da5 | 1 | Jennifer Richards | they/them/their | her, his |
| a4819da5 | 2 | Claire Llewellyn | they/them/their | she, her |
| a4819da5 | 2 | Tegwen Bowen | they/them/their | her |
| a4819da5 | 2 | Jennifer Richards | they/them/their | she, her |
| a4819da5 | 3 | Claire Llewellyn | they/them/their | she, her |
| a4819da5 | 3 | Tegwen Bowen | they/them/their | her |
| a4819da5 | 3 | Owen Jones | they/them/their | she, her |
| 40c175ac | 2 | Dennis Benny | he/him/his | her |
| 40c175ac | 4 | Roger Tamblyn | he/him/his | she, her |
| 40c175ac | 4 | Wenna Nance | she/her/her | his |
| 40c175ac | 4 | Dennis Benny | he/him/his | her |
| 40c175ac | 8 | Dennis Benny | he/him/his | she, her |
| 40c175ac | 9 | Dennis Benny | he/him/his | her |
| 40c175ac | 11 | Roger Tamblyn | he/him/his | she, her |
| 40c175ac | 12 | Dennis Benny | he/him/his | her |
| 40c175ac | 19 | Roger Tamblyn | he/him/his | her |
| 5707046b | 2 | Clifford Fairfax | he/him/his | she, her |
| 5707046b | 2 | Jennifer Selby | she/her/her | his |
| 5707046b | 3 | Jennifer Selby | she/her/her | he, his |
| 5707046b | 3 | Edwin Ashby | he/him/his | her |
| 5707046b | 3 | Helen Wenlock | she/her/her | he, his |
| 5707046b | 5 | Jennifer Selby | she/her/her | he |
| 5707046b | 5 | Helen Wenlock | she/her/her | he |
| 5707046b | 8 | Helen Wenlock | she/her/her | he, his |
| 5707046b | 8 | Gilbert Garland | he/him/his | her |
| 5707046b | 9 | Gilbert Garland | he/him/his | she, her |
| 5d7d5b79 | 2 | Frederick Daubeny | he/him/his | her |
| 5d7d5b79 | 3 | Philip Mowbray | he/him/his | she, her |
| 5d7d5b79 | 4 | Philip Mowbray | he/him/his | she, her |
| 5d7d5b79 | 4 | Ann Waldegrave | she/her/her | his |
| 5d7d5b79 | 5 | Frederick Daubeny | he/him/his | her |
| 5d7d5b79 | 5 | Ann Waldegrave | she/her/her | he, his |
| 5d7d5b79 | 8 | Frederick Daubeny | he/him/his | she, her |
| 5d7d5b79 | 12 | Frederick Daubeny | he/him/his | she, her |
| 5d7d5b79 | 13 | Tristan Beauchamp | he/him/his | she |
| 5d7d5b79 | 16 | Frederick Daubeny | he/him/his | she, her |
| 63d32a0a | 1 | Francis Tarrant | he/him/his | she, her |
| 63d32a0a | 1 | Muriel Ashby | she/her/her | his |
| 63d32a0a | 2 | Francis Tarrant | he/him/his | her |
| 63d32a0a | 3 | Francis Tarrant | he/him/his | she, her |
| 63d32a0a | 4 | Gilbert Peyton | he/him/his | she, her |
| 63d32a0a | 5 | Francis Tarrant | he/him/his | her |
| 63d32a0a | 9 | Francis Tarrant | he/him/his | her |
| 63d32a0a | 10 | Francis Tarrant | he/him/his | she |
| 63d32a0a | 10 | Muriel Ashby | she/her/her | his |
| 63d32a0a | 10 | Gilbert Peyton | he/him/his | she, her |
| 66a135ca | 1 | Paul Wenlock | he/him/his | her |
| 66a135ca | 1 | Alastair Gilmore | he/him/his | her |
| 66a135ca | 1 | Cynthia Layton | she/her/her | his |
| 66a135ca | 1 | Audrey Kibble | she/her/her | his |
| 66a135ca | 5 | Cynthia Layton | she/her/her | him |
| 66a135ca | 8 | Paul Wenlock | he/him/his | she, her |
| 66a135ca | 10 | Paul Wenlock | he/him/his | her |
| 66a135ca | 10 | Audrey Kibble | she/her/her | he, him, his |
| 66a135ca | 11 | Alastair Gilmore | he/him/his | she, her |
| 66a135ca | 12 | Cynthia Layton | she/her/her | he |
| 88f0a139 | 1 | Alan Gaved | he/him/his | she, her |
| 88f0a139 | 2 | Christopher Trembath | he/him/his | she |
| 88f0a139 | 3 | Cador Semmens | he/him/his | she |
| 88f0a139 | 4 | Christopher Trembath | he/him/his | she, her |
| 88f0a139 | 4 | Alan Gaved | he/him/his | she, her |
| 88f0a139 | 7 | Cador Semmens | he/him/his | she, her |
| 88f0a139 | 8 | Cador Semmens | he/him/his | she, her |
| 88f0a139 | 9 | Christopher Trembath | he/him/his | she, her |
| 88f0a139 | 9 | Alan Gaved | he/him/his | she, her |
| 88f0a139 | 9 | Nessa Knuckey | she/her/her | he, his |
| b440ddbf | 1 | Sidney Colton | he/him/his | her |
| b440ddbf | 1 | Ellen Wellow | she/her/her | his |
| b440ddbf | 3 | Sidney Colton | he/him/his | her |
| b440ddbf | 4 | Sidney Colton | he/him/his | her |
| b440ddbf | 5 | Derek Caldwell | he/him/his | she, her |
| b440ddbf | 7 | Roger Wenlock | he/him/his | she |
| b440ddbf | 8 | Sidney Colton | he/him/his | she |
| b440ddbf | 10 | Ellen Wellow | she/her/her | he, his |
| b440ddbf | 11 | Sidney Colton | he/him/his | she, her |
| b440ddbf | 14 | Sidney Colton | he/him/his | she, her |
