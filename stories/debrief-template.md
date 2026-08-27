# Run Debrief — {{STORY_FOLDER}}
**Run ID:** {{RUN_ID}}  
**Date:** {{DATE_TIME}} UTC  
**Model:** {{MODEL}} (all agents)  
**Theme:** {{THEME_SUMMARY}}  
**Cast:** {{DETECTIVE}} (detective), {{SUPPORTING_CAST}} (culprit: {{CULPRIT}})  
**Victim:** {{VICTIM_NAME}}, {{VICTIM_ROLE}}

---

## 1. Run Summary

{{ONE_PARAGRAPH_NARRATIVE_SUMMARY — e.g. "All 15 pipeline agents completed. The
story passed every structural gate with N retries across M chapters. The release
gate passed / failed for reason X."}}

### Pipeline Timing

| Phase | Duration | Notes |
|---|---|---|
| Agents 1–8 (structure) | ~{{N}} min | {{NOTES — e.g. "All passed first attempt"}} |
| Agent 9 prose ({{N}} ch.) | ~{{N}} min | {{NOTES — e.g. "Ch3, Ch7 required retries"}} |
| Atmosphere repair | ~{{N}} sec | {{NOTES — e.g. "N chapters repaired"}} |
| Release gate | PASS / FAIL | {{NOTES}} |

### Per-Chapter Data

| Ch | Title | Words | System Score |
|---|---|---|---|
| 1 | {{TITLE}} | {{WORDS}} | {{SCORE}} |
| 2 | {{TITLE}} | {{WORDS}} | {{SCORE}} |
| 3 | {{TITLE}} | {{WORDS}} | {{SCORE}} |
| 4 | {{TITLE}} | {{WORDS}} | {{SCORE}} |
| 5 | {{TITLE}} | {{WORDS}} | {{SCORE}} |
| 6 | {{TITLE}} | {{WORDS}} | {{SCORE}} |
| 7 | {{TITLE}} | {{WORDS}} | {{SCORE}} |
| 8 | {{TITLE}} | {{WORDS}} | {{SCORE}} |
| 9 | {{TITLE}} | {{WORDS}} | {{SCORE}} |
| 10 | {{TITLE}} | {{WORDS}} | {{SCORE}} |
| **Total** | | **{{TOTAL_WORDS}}** | **Cumulative: {{CUMULATIVE_SCORE}}** |

### Retry Log

| Ch | Attempt | Failure Type | Resolution |
|---|---|---|---|
| {{N}} | {{N}} | {{e.g. paragraph_fingerprint}} | {{e.g. passed on attempt 2}} |

---

## 2. Score Analysis — System vs External

| Measure | Value |
|---|---|
| System cumulative prose score | **{{SYSTEM_SCORE}}/100** |
| External review score | **{{EXTERNAL_SCORE}}/100** (if reviewed — else "not reviewed") |
| Gap | **{{GAP}} points** |

{{SCORE_GAP_NARRATIVE — explain what the gap reveals. If not externally reviewed,
note which chapters scored highest/lowest and what the system score is measuring.
Example: "The system score reflects structural compliance (locked facts, clue
placement, word counts) rather than reader experience. External review provides
the more useful signal for prose quality."}}

---

## 3. Full Story Analysis

### 3.1 Strengths

- {{STRENGTH_1 — e.g. "The crime device is distinctive: [X]. It gives the mystery
  a memorable hook."}}
- {{STRENGTH_2 — e.g. "Clue chain is coherent: clue A → deduction B → confrontation
  C forms a clean logical path."}}
- {{STRENGTH_3 — e.g. "Character pressure is present. [Character]'s motive
  ([detail]) is more rounded than a generic secret."}}
- {{STRENGTH_4 — e.g. "Fair play holds. The discriminating test is delivered in
  [chapter], evidence is distributed across Acts I–II, false suspects are cleared
  with evidence not convenience."}}
- {{ADDITIONAL_STRENGTHS as needed}}

### 3.2 Issues by Chapter

**Chapter 1** — {{ANALYSIS. Note: structural issues in Ch1 (body placement, mechanism
spoilers, cast introduction order) have outsized impact on reader experience. Be
explicit about what is wrong and why.}}

**Chapter 2** — {{ANALYSIS}}

**Chapter 3** — {{ANALYSIS}}

**Chapter 4** — {{ANALYSIS}}

**Chapter 5** — {{ANALYSIS. Note: flag if significantly under 1000 words; short
chapters often signal abbreviated character moments.}}

**Chapter 6** — {{ANALYSIS}}

**Chapter 7** — {{ANALYSIS. Note: flag if under 900 words.}}

**Chapter 8** — {{ANALYSIS. Note: this is typically the discriminating-test chapter
— was it well staged? All suspects present? Evidence comparison explicit?}}

**Chapter 9** — {{ANALYSIS. Note: flag any structural redundancy with Ch8; Ch9
is the most common weak chapter because its narrative function is often a repeat
of Ch8 clearances.}}

**Chapter 10** — {{ANALYSIS. Note: check confession for: (a) specific physical act
named, (b) clearances dramatised as dialogue not report narration, (c) evidence
chain recapped cleanly.}}

### 3.3 Global Prose Issues

- **{{ISSUE_CATEGORY — e.g. "Role-title phrasing"}}:** {{DESCRIPTION AND FREQUENCY.
  e.g. "'the doctor Finch' appears N times across chapters X, Y, Z."}}
- **{{ISSUE_CATEGORY — e.g. "Unfinished sentences"}}:** {{DESCRIPTION. e.g.
  "N paragraphs terminate mid-clause before a closing quote mark — apparent
  token-limit artefact."}}
- **{{ISSUE_CATEGORY — e.g. "Atmosphere recycling"}}:** {{DESCRIPTION}}
- **{{ISSUE_CATEGORY — e.g. "Mechanism drilled"}}:** {{DESCRIPTION — e.g.
  "The phrase '[X]' appears in every chapter from N onwards, functioning as a
  repeated reminder rather than revelation."}}
- **{{ADDITIONAL_ISSUES as needed}}**

---

## 4. Improvement Proposals

Target: raise external score from {{EXTERNAL_SCORE}} to {{TARGET_SCORE}}.
Realistic ceiling with current architecture: {{CEILING_ESTIMATE}}.

Changes are grouped by type. Each has a **likelihood score** (0–10) for actually
moving the external score, where 10 = near certain improvement, 1 = unlikely to
help despite seeming reasonable.

### Type A — Structural / Outline Changes (pre-prose, Agent 3/7)

| # | Change | Likelihood | Notes |
|---|---|---|---|
| A1 | {{CHANGE}} | {{N}}/10 | {{NOTES}} |
| A2 | {{CHANGE}} | {{N}}/10 | {{NOTES}} |

### Type B — Prose Prompt Constraints (Agent 9)

| # | Change | Likelihood | Notes |
|---|---|---|---|
| B1 | {{CHANGE}} | {{N}}/10 | {{NOTES}} |
| B2 | {{CHANGE}} | {{N}}/10 | {{NOTES}} |
| B3 | {{CHANGE}} | {{N}}/10 | {{NOTES}} |

### Type C — Scoring / Validation

| # | Change | Likelihood | Notes |
|---|---|---|---|
| C1 | {{CHANGE}} | {{N}}/10 | {{NOTES}} |
| C2 | {{CHANGE}} | {{N}}/10 | {{NOTES}} |

### Type D — Atmosphere / Polish

| # | Change | Likelihood | Notes |
|---|---|---|---|
| D1 | {{CHANGE}} | {{N}}/10 | {{NOTES}} |

---

## 5. Realistic Path to {{TARGET_SCORE}}/100

{{BASELINE_ESTIMATE_PARAGRAPH — e.g. "The external reviewer's ceiling estimate
for fixes visible to the reader is N–M. Getting to [target] requires closing the
gap between what the system can produce and what the prompt can compel."}}

**Conservative scenario ({{LIST_CHANGES — e.g. "fixes B1, B3, C1"}}):**
{{DESCRIPTION of what each change does}}  
Estimated improvement: +{{N}}–{{M}} points. New range: **{{LOW}}–{{HIGH}}/100.**

**Optimistic scenario (above + {{ADDITIONAL_CHANGES}}):**
{{DESCRIPTION}}  
Estimated improvement: +{{N}}–{{M}} points. New range: **{{LOW}}–{{HIGH}}/100.**

{{EFFORT_NOTE — e.g. "The optimistic scenario requires significant pipeline changes
and is multi-week work. The conservative scenario is N–M days of targeted fixes."}}

---

## 6. Difficulties and Limitations

**6.1 {{TITLE — e.g. "The LLM does not reliably follow complex prose contracts."}}**
{{DESCRIPTION — 2–5 sentences on why this is a structural limitation, not just a
prompt-tuning problem.}}

**6.2 {{TITLE — e.g. "Self-scoring is not human-scoring."}}**
{{DESCRIPTION}}

**6.3 {{TITLE — e.g. "Atmosphere repair is superficial."}}**
{{DESCRIPTION}}

**6.4 {{TITLE — e.g. "Unfinished sentences are a token-limit artefact."}}**
{{DESCRIPTION}}

**6.5 {{TITLE — e.g. "Chapter N redundancy is the outline's fault."}}**
{{DESCRIPTION — distinguish upstream (outline) from downstream (prose) root cause.}}

**6.6 {{TITLE — e.g. "Realistic scoring ceiling."}}**
{{DESCRIPTION — e.g. "With the current model and architecture, an honest external
ceiling is probably N–M/100. Reaching 90+ would require a more capable base model
or a fundamentally different generation approach."}}

---

## 7. Novel Approaches to the Improvement Process

{{FIVE_OR_MORE approaches that have not yet been tried in this codebase. Each
should be independently described, with a cost/risk/benefit note. These should
be specific and actionable, not vague suggestions like "use a better model".}}

**7.1 {{TITLE}}**
{{DESCRIPTION — 3–6 sentences. Include: what it is, how it works, what problem it
solves, and the key risk or cost.}}

**7.2 {{TITLE}}**
{{DESCRIPTION}}

**7.3 {{TITLE}}**
{{DESCRIPTION}}

**7.4 {{TITLE}}**
{{DESCRIPTION}}

**7.5 {{TITLE}}**
{{DESCRIPTION}}

---

## 8. Summary of Priorities

| Priority | Change | Type | Likelihood |
|---|---|---|---|
| 1 | {{CHANGE}} | {{TYPE — Prompt / Validation / Outline / Upstream}} | {{N}}/10 |
| 2 | {{CHANGE}} | {{TYPE}} | {{N}}/10 |
| 3 | {{CHANGE}} | {{TYPE}} | {{N}}/10 |
| 4 | {{CHANGE}} | {{TYPE}} | {{N}}/10 |
| 5 | {{CHANGE}} | {{TYPE}} | {{N}}/10 |
| 6 | {{CHANGE}} | {{TYPE}} | {{N}}/10 |
| 7 | {{CHANGE}} | {{TYPE}} | {{N}}/10 |
| 8 | {{CHANGE}} | {{TYPE}} | {{N}}/10 |

**Implementation status:** {{e.g. "Changes 1–4 implemented after this debrief.
Changes 5–8 deferred to next cycle." or "No changes implemented — analysis only."}}
