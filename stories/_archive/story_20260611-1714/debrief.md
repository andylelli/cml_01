# Run Debrief — story_20260611-1714
**Run ID:** mystery-1781198079693  
**Date:** Wed 11 Jun 2026, 17:14–17:31 UTC  
**Model:** gpt-4.1-mini (all agents)  
**Theme:** Golden Age country-house murder, mechanical clock-tampering method, 1940s Seaside Hotel  
**Cast:** Eleanor Voss (detective), Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill (culprit)  
**Victim:** Ashcroft, hotel owner

---

## 1. Run Summary

All 15 pipeline agents completed. The story passed every structural gate. The run
was aborted at the final release gate by a **false positive** in the placeholder-leakage
check: "a gentleman Ashcroft" (the victim's prose introduction) matched a regex pattern
designed to catch template tokens. This has since been fixed.

### Pipeline Timing

| Phase | Duration | Notes |
|---|---|---|
| Agents 1–8 (structure) | ~10 min | All passed first attempt |
| Agent 9 prose (10 ch.) | ~6.5 min | Ch9 required 1 retry (fingerprint linter) |
| Atmosphere repair | ~20 sec | 9 chapters repaired |
| Release gate | FAIL | False positive — now fixed |

### Per-Chapter Data

| Ch | Title | Words | System Score |
|---|---|---|---|
| 1 | Discovery of the Victim | 1,203 | 91 |
| 2 | Clock Contradictions | 1,239 | 91 |
| 3 | Tidal Clock Details and Suspect Access | 1,160 | 91 |
| 4 | Shift Schedule Anomalies | 1,289 | 90 |
| 5 | Beatrice's Motive and Alibi | 977 | 90 |
| 6 | Suspects' Alibis Begin to Crumble | 1,047 | 91 |
| 7 | Clock Mechanism and Salt Residue Analysis | 839 | 94 |
| 8 | Discriminating Test: The Temporal Trap | 1,161 | 95 |
| 9 | Suspect Clearances | 1,199 | 90 (retry) |
| 10 | Confrontation and Culprit Revelation | 864 | 92 |
| **Total** | | **10,978** | **Cumulative: 96** |

---

## 2. Score Analysis — System vs External

| Measure | Value |
|---|---|
| System cumulative prose score | **96/100** |
| External review (ChatGPT) | **~69/100** |
| Gap | **27 points** |

This gap is the single most important fact in this debrief. The system scores look
excellent; the human reader experience is mediocre. The scoring system is
measuring structural compliance (clue placement, word counts, locked fact phrases,
season vocabulary, chapter beat contracts) but is **not measuring actual prose
quality**, narrative tension, or reader experience. The external score is the
more useful signal.

The ChatGPT reviewer estimated that the best available fixes would take this to
**74–76/100**, not 80. Getting to 80 would require improvements beyond what the
reviewer identified, including changes to how the pipeline shapes the prose itself.

---

## 3. Full Story Analysis

### 3.1 Strengths

- **Concept is strong.** Tidal water clock vs mechanical clock is a genuinely
  distinctive device. The spring tide as an independent timekeeper is elegant.
- **Clue chain is coherent.** Tidal clock → torn schedule → elevator footprints
  → clock access → motive → confession is a working mystery progression.
- **Character pressure is present.** Beatrice's motive (blackmail + environmental
  threat + promises turned threats) is more rounded than a generic secret.
- **Atmosphere is competent.** Fog, coal smoke, salt air, Atlantic waves all
  establish the 1940s coastal hotel well.
- **Fair play holds.** The discriminating test is delivered (Ch8), evidence clues
  are distributed, false suspects are cleared with evidence not convenience.

### 3.2 Issues by Chapter

**Chapter 1** — Worst chapter in the story. Three separate problems compound:
  - The full mechanism is explained on page 1 ("The culprit wound back the main
    mechanical clock by forty minutes to fabricate an earlier time of death").
    This reads as narration leaking puzzle answers rather than a detective
    discovering them.
  - The body is the seventh paragraph. The story opens with clock analysis, then
    atmospheric description, then suspects, then finally a corpse. Classical
    mystery structure: body → reaction → suspects → first clue.
  - Two instances of "the doctor Finch" and "the captain Hale" — role + surname
    constructions that the release gate was designed to catch (and did, but for
    the wrong name).

**Chapter 2** — Functional but repetitive. Beatrice's insistence on the main clock
  is good. Dr. Finch's lines are generic. Several sentences end without resolution
  ("There is no reason to doubt its ", "as if holding onto discipline itself"). These
  look like the LLM truncating sentences before a closing quote.

**Chapter 3** — Solid. Tidal clock physical evidence (six ounces salt residue, tool
  marks) is well handled. Dialogue with Beatrice is the best in the book so far.
  The chapter ends with the atmosphere repair variant ("forty minutes to fabricate
  an earlier time of death" → "by forty minutes") still feeling expository.

**Chapter 4** — Best structural chapter. Shift schedule anomaly and elevator
  footprints are convincingly shown. Eleanor's exchange with Beatrice is sharp.
  Minor: first paragraph is a verbatim continuation of Ch3's final sentence,
  creating a jarring seam.

**Chapter 5** — Short (977 words, 22% below ideal). Beatrice's emotional reveal
  ("He promised me a future here") is the emotional high point of the story but
  the chapter ends abruptly with minimal consequence or scene change.

**Chapter 6** — Functional. Clears Finch and Hale competently. The summarising
  paragraph ("The evidence excludes Dr. Mallory Finch and Captain Ivor Hale")
  reads more like a dossier than dialogue.

**Chapter 7** — Short (839 words, 16% below ideal). Captain Hale's self-
  deprecating joke lands well — the one moment of genuine character voice.
  The chapter repeats several sentences from Ch3 near-verbatim (tidal clock
  water level, salt residue).

**Chapter 8** — Best chapter. The discriminating test is properly staged as a
  public demonstration. All four suspects present. Evidence comparison made
  explicit. Chapter scores 95 system / reviewer would agree it works.

**Chapter 9** — Structurally redundant. Clears the same two suspects again (already
  cleared in Ch6 and Ch8). The chapter triggered a fingerprint linter failure on
  the first attempt because it contains many of the same paragraph openings as Ch8.
  On second attempt it reads slightly better but still covers the same narrative ground.

**Chapter 10** — Good confession but two problems:
  - Beatrice explains the concealment but not the killing: "I confronted him in
    Guest Room 207… When he refused, I acted in desperation." No specific act.
  - The clearance summaries ("Dr. Mallory Finch was cleared because…", "As for
    myself, Eleanor Voss was present…") are presented as narrated report language,
    not dramatised dialogue. The last sentence is borderline self-parody.

### 3.3 Global Prose Issues

- **Role-title phrasing:** "the doctor Finch", "the captain Hale" appears 5+ times.
  Likely driven by the LLM hedging between proper name and title when uncertain
  which to use.
- **Unfinished sentences:** At least 6 sentences terminate mid-clause before a
  closing quote mark ("to uncover the ", "depends on it. ", "above reproach ").
  These appear to be token-limit truncation artefacts.
- **Atmosphere recycling:** "coal smoke", "salt tang", "Atlantic waves", "tidal
  clock", "springtime fog" appear in every chapter without variation. The atmosphere
  repair pass replaces some but not the structural over-reliance on them.
- **Repetition of the mechanism summary:** The phrase "wound back by forty minutes
  to fabricate an earlier time of death" (or its repairs) appears in every chapter
  from 3 onwards, often in contexts where the reader already knows it. This
  functions as a drilled-in reminder rather than revelation.
- **Passive investigation voice:** Eleanor frequently "resolves to", "makes a note
  to", "will verify" — future tense deferred action. The story has relatively few
  moments where she actually does something decisive onscreen.

---

## 4. Improvement Proposals

Target: raise external score from ~69 to ~80. Realistic ceiling with current
architecture: probably 74–78. Getting to 80 requires changes at the prompting
level, not just story fixes.

Changes are grouped by type. Each has a **likelihood score** (0–10) for actually
moving the external score, where 10 = near certain improvement, 1 = unlikely to
help despite seeming reasonable.

### Type A — Structural / Outline Changes (pre-prose, Agent 3/7)

| # | Change | Likelihood | Notes |
|---|---|---|---|
| A1 | Reorder Ch1 structure: body → suspects → first clock contradiction (no explanation). Block mechanism reveal until Ch3+. | 7/10 | High value but requires Agent7 outline to enforce the ordering constraint explicitly. The LLM will default to over-explanation without a hard constraint. |
| A2 | Replace Ch9 (Suspect Clearances) with a distinct function: a second-act pressure scene where Eleanor is wrong about something, or Beatrice makes an active move. | 6/10 | Ch9 is the weakest chapter because it has no new story function. A different scene type here would help pacing materially. But generating a structurally different replacement risks breaking the fair-play gate. |
| A3 | Add victim's first name in the CML (e.g. Julian Ashcroft) so all agents use it consistently from the start. | 5/10 | Low-effort, high-clarity. Unlikely to raise score significantly on its own but removes the "gentleman Ashcroft" awkwardness and helps Ch1. |
| A4 | Extend Ch5 and Ch7 outlines. Both are ~15–20% under the 1000-word ideal. The outline should require a specific character interaction or evidence test to fill the space. | 4/10 | Word count alone does not improve quality. However, short chapters often mean abbreviated character moments. Hard to predict outcome. |

### Type B — Prose Prompt Constraints (Agent 9)

| # | Change | Likelihood | Notes |
|---|---|---|---|
| B1 | Add a hard-ban on mechanism summary statements in Ch1 and Ch2 (block phrases like "wound back by X minutes", "fabricate an earlier time"). Only the clock contradiction fact may appear; causation is forbidden until Ch3. | 8/10 | This directly fixes the single biggest fairness/pacing problem. Risk: the LLM may strip useful Ch1 content trying to comply, leaving it sparse. |
| B2 | Add a chapter-level contract: Ch1 must introduce the victim by full name, with the body in the first two paragraphs. | 6/10 | Directly addresses the "body arrives late" problem. Requires enforcement in the chapter obligation contract. Likelihood moderate because it competes with the current discovery_opening balance targets. |
| B3 | Ban role-title constructions in the style hard-ban list: "the doctor [Surname]", "the captain [Surname]". | 7/10 | Simple and precise. The phrase-family detection is already in place; this just adds the pattern. Low risk of side-effects. |
| B4 | Add a hard requirement in Ch10 that the confession must contain a specific physical action (verb + object): strike, push, stab, etc. No confession passes validation without it. | 7/10 | The vague confession is a consistent problem across runs. A validation constraint here is more reliable than a prose instruction. |
| B5 | Ban the clearance-report format in Ch10. Require that eliminations are delivered as dramatised dialogue, not summary narration. Add a validation check: if a paragraph starts with a character name + "was cleared because", flag it. | 6/10 | Addresses a real reader experience problem. Enforcement is tricky — validation needs to be semantic, not just pattern-matching, to avoid false positives. |
| B6 | Add Ch9 to the "redundancy check": validate that Ch9 does not re-state any conclusion already stated in Ch8. Flag repeated paragraph fingerprints cross-chapter (not just within-chapter). | 5/10 | The current fingerprint check is within-chapter only. Cross-chapter redundancy is a known gap. Implementation is non-trivial; the improvement is real but uncertain. |

### Type C — Scoring / Calibration

| # | Change | Likelihood | Notes |
|---|---|---|---|
| C1 | Add a sentence-completion check to the validator: flag any paragraph that ends immediately before a closing quote mark with a sentence fragment (under 8 words, no terminal punctuation). | 7/10 | The unfinished sentences appear to be a consistent token-limit artefact. This would catch them deterministically and trigger a retry. Risk: may increase retry rates significantly. |
| C2 | Reduce the system's internal prose score weighting for "locked fact phrases present" — this is driving artificially high scores for chapters that repeatedly drill the mechanism. Rebalance toward variety and sentence completeness. | 5/10 | Requires understanding the scoring rubric in detail and rebalancing it. Could introduce new failure modes. Honest assessment: the scoring rubric is complex enough that changes here often have unexpected side-effects. |
| C3 | Run the story through an external evaluation call (a separate LLM judge prompt, not the generating model) before reporting the cumulative score. Use the delta between self-score and judge-score as a calibration signal. | 6/10 | Would surface the system/external gap per run. Does not fix the underlying quality problems but gives better visibility. Moderate implementation cost. |

### Type D — Atmosphere / Polish

| # | Change | Likelihood | Notes |
|---|---|---|---|
| D1 | Reduce the atmosphere repair target list to only the most overused phrases (currently it replaces any instance; it should only fire above a frequency threshold). This prevents mechanical churning of the same phrases into slightly different forms ("freight lift platform" / "muddy marks"). | 4/10 | The atmosphere repair currently makes micro-changes. More targeted throttling would reduce noise but is unlikely to raise the external score by more than 1–2 points. |
| D2 | Inject the world document's character voice sketches more explicitly into the chapter contract, particularly for Beatrice. Her "polite savagery" voice is defined but barely used. | 4/10 | Might improve dialogue distinctiveness. Hard to enforce without a new validation signal. Realistic impact: small. |

---

## 5. Realistic Path to 80/100

The ChatGPT reviewer's ceiling estimate for fixes visible to the reader is 74–76.
Getting to 80 requires closing the gap between what the system can produce and what
the system's prompt can compel.

**Conservative scenario (fixes B1, B3, B4, C1, A3):**
Mechanism spoiler removed from Ch1, role-title phrasing eliminated, confession has
specific act, unfinished sentences caught, victim gets a name.  
Estimated improvement: +4–6 points. New range: **73–75/100.**

**Optimistic scenario (above + A2, B2, B5, A1):**
Ch1 reordered with body first, Ch9 replaced, clearances dramatised, outline enforces
no-spoiler constraint.  
Estimated improvement: +8–11 points. New range: **77–80/100.**

The optimistic scenario requires significant pipeline changes (outline generation,
chapter contract updates, validation additions). It is feasible but multi-week work.
The conservative scenario is 2–3 days of targeted fixes.

---

## 6. Difficulties and Limitations

**6.1 The LLM does not reliably follow complex prose contracts.**
When a chapter contract has 15+ constraints (forbidden phrases, required outcomes,
balance targets, locked facts, mode checklist), the model satisfices rather than
optimises. Adding more rules yields diminishing returns and sometimes regression
(fixing one issue breaks another).

**6.2 Self-scoring is not human-scoring.**
The current system uses the same model family to score prose that generated it.
This creates an in-group bias: the model awards high marks for outputs that look
like what it would produce. The 27-point gap in this run is not unusual; it has
appeared in previous runs too. This is a structural limitation of LLM-as-judge.

**6.3 The atmosphere repair pass is superficial.**
It replaces surface-level repeated phrases but cannot address structural repetition
(e.g. the same plot beat appearing in Ch8 and Ch9). Meaningful repetition requires
either: (a) upstream outline changes that forbid redundancy, or (b) a full chapter
rewrite rather than phrase substitution.

**6.4 Unfinished sentences are a token-limit artefact, not a prompt compliance failure.**
The LLM is hitting context or output token limits mid-sentence, particularly in
later chapters where context is long. Increasing max_tokens mitigates it but raises
cost; the current max_batch_size=10 with proseBatchSize=1 means each chapter already
has a large context window. This is partly architectural.

**6.5 Ch9 redundancy is partly the outline's fault.**
Agent 7 created "Suspect Clearances" as a discrete chapter even though the clearances
are handled in Ch6 and Ch8. The issue originates in the narrative outline, not the
prose. Fixing it in Agent 9 alone (e.g., adding a cross-chapter fingerprint check)
treats the symptom. The root fix is Agent 7 generating a structurally distinct
chapter purpose for that slot.

**6.6 Realistic scoring ceiling.**
With the current model (gpt-4.1-mini) and current architecture, an honest ceiling
for external prose score is probably **78–82/100**. Reaching 90+ would require
a more capable base model or a fundamentally different generation approach.

---

## 7. Five Novel Approaches to the Improvement Process

These are ideas that have not been tried in this codebase. Each is described
independently of the current pipeline.

**7.1 Adversarial Chapter Auditor**
After each chapter is generated, run a second LLM call with a deliberately
adversarial prompt: "You are a hostile critic. Find three things wrong with this
chapter as fiction." Use the output not to rewrite but to construct targeted retry
directives. This gives the retry a specific human-legible target rather than a
statistical fingerprint signal. Risk: the auditor itself may be miscalibrated. Cost:
doubles the LLM calls for chapters that would otherwise pass.

**7.2 Skeleton-First Generation**
Instead of generating full prose chapters in one shot, generate a chapter skeleton
first: a numbered list of beats (3–8 per chapter), each one sentence. Validate the
skeleton against the chapter contract (right clues, no spoilers, correct stage mode).
Then expand each beat into prose in a separate, smaller call. This gives structural
control without requiring the LLM to simultaneously manage plot, character, and prose
quality. Cost: 2× calls per chapter. Benefit: separates "what happens" from "how
it reads".

**7.3 Comparative Reference Injection**
Build a small library of 10–15 "gold standard" paragraphs from actual Golden Age
mysteries (public domain). Inject 1–2 relevant reference paragraphs into the system
prompt for each chapter as style anchors: "Write in the style of this passage."
The references could rotate by chapter type (discovery, interrogation, confrontation).
This is a fundamentally different approach to style control than phrase banning.
Risk: the model may plagiarise surface structure rather than internalising the style.
Legal: public domain only.

**7.4 Human-in-the-Loop Micro-Edit Gate**
After prose generation and before the release gate, present a one-paragraph diff
to the user for the 3 weakest chapters (by chapter score) and allow targeted manual
edits or override instructions ("Ch1: delete paragraphs 3–4, add body in para 1").
The system then reconstructs the final story incorporating those edits without
regenerating the full pipeline. This acknowledges that LLM prose at this length
requires human editorial judgment and builds that in as a first-class feature rather
than a workaround.

**7.5 Cross-Run Quality Vector**
Treat each run as a data point. After each run, record a structured "quality vector":
mechanism revealed too early (Y/N), body placement (paragraph index), role-title
count, unfinished sentence count, Ch9 redundancy flag, external score (if reviewed).
Over 10–20 runs, build a simple regression model: which input features (castSize,
theme complexity, targetLength, feature flags) correlate with quality vector
improvements? This turns the canary loop into a systematic experiment rather than
an ad-hoc improvement process. The current run-review process exists but is
qualitative; a structured vector makes it quantitative.

---

## 8. Summary of Priorities

| Priority | Change | Type | Likelihood |
|---|---|---|---|
| 1 | Ban mechanism spoiler in Ch1–2 (B1) | Prompt | 8/10 |
| 2 | Ban role-title constructions (B3) | Prompt | 7/10 |
| 3 | Require specific physical act in confession (B4) | Validation | 7/10 |
| 4 | Flag sentence-fragment truncations (C1) | Validation | 7/10 |
| 5 | Reorder Ch1: body first, clocks second (B2+A1) | Outline+Prompt | 6/10 |
| 6 | Victim full name in CML (A3) | Upstream | 5/10 |
| 7 | Dramatise clearances in Ch10 (B5) | Prompt | 6/10 |
| 8 | Replace Ch9 function (A2) | Outline | 6/10 |

**No changes are implemented in this document.** This is analysis only.

---

## 9. Implementation Log

All 8 priority changes were implemented after this debrief was written.

| Priority | Change | File(s) Modified | Status |
|---|---|---|---|
| 1 | Ban mechanism spoiler Ch1–2 (B1) | `generation-params.yaml`, `obligation-block.ts` | ✅ Done |
| 2 | Ban role-title constructions (B3) | `banned-phrases.ts`, `agent9-run.ts` | ✅ Done |
| 3 | Require specific killing act (B4) | `generation-params.yaml` | ✅ Done |
| 4 | Flag sentence-fragment truncations (C1) | `lint.ts`, `types.ts` | ✅ Done |
| 5 | Ch1 body-first + mechanism ban at outline level (B2+A1) | `obligation-block.ts`, `agent7-narrative.ts` | ✅ Done |
| 6 | Victim full name resolved from cast in Agent 7 (A3) | `agent7-narrative.ts` | ✅ Done |
| 7 | Dramatise clearances in Ch10 (B5) | `generation-params.yaml` | ✅ Done |
| 8 | Penultimate scene must have distinct function (A2) | `agent7-narrative.ts` | ✅ Done |
