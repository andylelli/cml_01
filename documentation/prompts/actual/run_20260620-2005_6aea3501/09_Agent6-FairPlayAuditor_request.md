# Actual Prompt Record

- Run ID: `run_6aea3501-f039-4b40-bc33-78b25107ce8b`
- Project ID: `proj_5f4e668b-257b-4fed-87e4-90607f127ab3`
- Timestamp: `2026-06-20T20:07:20.366Z`
- Agent: `Agent6-FairPlayAuditor`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.3`
- Max Tokens: `2500`
- Attempt: `first`
- Prompt Hash: `073401485e05834f`

## Message 1 (role=system)

```text
You are an expert mystery fiction narrative quality auditor. The structural integrity of this mystery has been verified by a deterministic system before this call — all discriminating test evidence clues are present, all inference steps have essential early/mid coverage, and non-culprit eliminations are in place.

Your role is to assess NARRATIVE QUALITY ONLY:
1. Is the discriminating test a genuine inferential test, or does it rely on coincidence, confession, or authority?
2. Does the false assumption feel convincingly planted across the clue trail?
3. Is the solution discoverable by a careful reader who has not been told the answer?
4. Does the clue trail feel fair (evidence before deduction) or like a trick (revelation withheld arbitrarily)?
```

## Message 2 (role=developer)

```text
# Fair Play Audit Context

## Mystery Overview
**Title**: The Langley Clock Conundrum
**Primary Axis / False Assumption Type**: temporal
**Crime**: stabbing with false timeline alibi
**Culprit**: John Avery


## STRUCTURAL STATUS (system-verified — do not re-derive these facts)

All structural checks PASSED before this LLM call:
✓ All discriminating_test.evidence_clues IDs present in early|mid: clue_1, clue_11, clue_7, clue_3
✓ All 4 inference step(s) have essential early|mid coverage: steps 1, 2, 3, 4
✓ Elimination clues present for: Edward Langley, Clara Mitchell

> Your task: assess NARRATIVE QUALITY only (see user request). Do not re-check structural facts above.

---

## Surface Model (What the Reader Is Meant to Believe)
**Narrative**: At the Langley estate in autumn 1930s Yorkshire, the family patriarch with a scandalous past is found murdered. The manor clock had stopped at ten minutes past eleven, seemingly fixing the time of death. Family members and servants provide conflicting alibis, all supported by the clock’s time. Inspector Finch uncovers that the clock was deliberately wound backward by forty minutes, exposing a false timeline and revealing the butler’s opportunity to commit the murder while hiding behind the manipulated schedule.

### Accepted Facts (reader takes these as given)
- Victim was stabbed in his study late in the evening
- Manor clock stopped at ten minutes past eleven
- Butler John Avery claimed to be adjusting clocks between 9:30 and 11:15
- Servant Clara Mitchell was cleaning in the kitchen between nine and eleven
- Edward Langley was in the stables between ten and half past eleven
- Margaret Langley was in the drawing room between ten and eleven
- Clock hands show scratches near center pin inconsistent with normal wear
- Servant heard clock ticking oddly shortly before stopping
- Pendulum bob has a subtle scratch matching marks on clock-winder’s tool
- Butler’s detailed schedule conflicts by exactly forty minutes with clock time

### Inferred Conclusions (reader draws these from accepted facts)
- The manor clock was deliberately wound backward by exactly forty minutes
- The time of death was earlier than indicated by the stopped clock
- John Avery manipulated the clock to create a false alibi
- The true opportunity for murder aligns with the butler’s presence near the clock
- Other suspects’ alibis rely on the false clock time and are thus suspect

---

## Hidden Model (What Is Actually True)
**Mechanism**: The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped. This created a false timeline supporting the butler’s alibi and misleading others about the opportunity to commit the murder. Physical evidence on the clock and servant testimonies about its unusual ticking reveal the tampering, exposing the true time of death and the butler’s guilt.

### Delivery Path
1. Butler uses clock-winder tool with a unique scratch to wind back the clock
2. Clock runs backward 40 minutes, stopping at 11:10 instead of correct time
3. Servant notices abnormal ticking but assumes nothing
4. Murder occurs during the true earlier window, unnoticed due to false time
5. Investigator finds contradictory evidence in clock mechanism and schedules

**Outcome**: The false timeline is exposed, eliminating other suspects whose alibis depended on the stopped clock time. John Avery’s premeditated clock tampering and opportunity are proven, confirming his guilt.

---

## False Assumption
**Statement**: The stopped manor clock’s displayed time accurately indicates the time of the murder.
**Why it seems reasonable**: The clock is a central, trusted timekeeper in the estate, and all servant schedules and witness testimonies align with its time, giving a consistent timeline.
**What it hides**: The clock was deliberately wound backward, shifting the timeline by forty minutes and enabling the murderer to commit the crime earlier without suspicion.

---

## Inference Path (Detective's Logic)
The detective follows these logical steps to reach the solution:

1. **The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear.**: The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally. → Narrows suspect pool to those with access to clock mechanism, notably John Avery.
   **CML authoring notes (scaffold only — NOT formal clue IDs; do not audit against these)**:
   • Clock hands with scratches near center pin
   • Pendulum bob with matching tool mark scratch
   • John Avery’s possession of clock-winder’s tool
2. **A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped at ten minutes past eleven.**: The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating all alibis based on the stopped clock time. → Eliminates alibis dependent on clock time, focusing suspicion on those who could manipulate the clock.
   **CML authoring notes (scaffold only — NOT formal clue IDs; do not audit against these)**:
   • Servant’s testimony about odd ticking
   • Manor clock stopped at ten minutes past eleven
   • Butler John Avery’s schedule involving clock maintenance
3. **The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the true time of death inferred from clock tampering.**: Edward’s claimed alibi at the stables after the murder time is disproved, eliminating him as the murderer. → Eliminates Edward Langley as suspect.
   **CML authoring notes (scaffold only — NOT formal clue IDs; do not audit against these)**:
   • Stable logbook entry of Edward Langley at half past eleven
   • Inferred true time of death before eleven o’clock
   • Edward’s claimed alibi between ten and half past eleven
4. **Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, and he was responsible for winding clocks on the evening of the murder.**: John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window to commit the murder. → Identifies John Avery as the only suspect with motive, access, and opportunity.
   **CML authoring notes (scaffold only — NOT formal clue IDs; do not audit against these)**:
   • Butler’s schedule conflicting by forty minutes
   • Responsibility for clock winding assigned to John Avery
   • Physical evidence of clock tampering

### Discriminating Test
**Method**: trap
**Design**: A controlled comparison of the manor clock’s scratched hands and pendulum bob with the clock-winder’s tool marks, combined with cross-referencing the butler’s schedule against the stopped clock time, conclusively proves deliberate clock winding backward by John Avery, exposing his false alibi and opportunity to commit the murder.
**Reveals**: The butler’s premeditated clock tampering and manipulation of the timeline is irrefutably established, eliminating all other suspects and confirming his guilt.

---

> ⚠️ AUDIT SCOPE — READ BEFORE PROCEEDING:
> The "## Clue Distribution" section below is your SINGLE SOURCE OF TRUTH for all structural checks.
> The "CML authoring notes" items in the Inference Path above are scaffold text — NOT formal clue IDs.
> Do NOT report violations for evidence strings that do not appear as formal clues.
> Only flag violations for clue IDs that are explicitly absent from the Clue ID Manifest below.

---

## Clue ID Manifest (system-generated — use for structural checks)

**discriminating_test.evidence_clues** (must each be present in early|mid distribution):
- clue_1
- clue_11
- clue_7
- clue_3

**All clue IDs by placement**:
- Early: clue_1, clue_2, clue_3, clue_4, clue_mechanism_visibility_core, clue_servant_odd_ticking, clue_butler_schedule_conflict, clue_stable_log, clue_alibi_timing, clue_margaret_alibi
- Mid:   clue_5, clue_6, clue_7, clue_8, clue_core_contradiction_chain, clue_11, clue_12, clue_13, clue_14, clue_core_elimination_chain, clue_15, clue_culprit_direct_1, clue_culprit_direct_john_avery, clue_clock_hands_scratches, clue_pendulum_scratch, clue_servant_testimony, clue_kitchen_testimony, clue_cleaning_schedule
- Late:  clue_late_optional_slot_1

**Essential clues by inference step**:
  Step 1: clue_1(early), clue_2(early), clue_mechanism_visibility_core(early), clue_core_contradiction_chain(mid), clue_servant_odd_ticking(early), clue_butler_schedule_conflict(early), clue_stable_log(early), clue_servant_testimony(mid)
  Step 2: clue_3(early), clue_4(early), clue_alibi_timing(early), clue_margaret_alibi(early)
  Step 3: clue_5(mid), clue_6(mid), clue_11(mid), clue_12(mid), clue_13(mid), clue_14(mid), clue_core_elimination_chain(mid), clue_15(mid), clue_culprit_direct_john_avery(mid), clue_kitchen_testimony(mid)
  Step 4: clue_7(mid), clue_8(mid), clue_culprit_direct_1(mid), clue_clock_hands_scratches(mid), clue_pendulum_scratch(mid), clue_cleaning_schedule(mid)

---

## Clue Distribution
The mystery distributes 29 clues to the reader:

### Early Clues (Act I) - 10 clues
- [essential] temporal →step1 (observation): The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear.
- [essential] temporal →step1 (contradiction): The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.
- [essential] testimonial →step2 (observation): A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped.
- [essential] temporal →step2 (contradiction): The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating the natural stop time assumption.
- [essential] temporal →step1 (observation): The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped.
- [essential] temporal →step1 (observation): The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped.
- [essential] temporal →step1 (observation): The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear.
- [essential] temporal →step1 (contradiction): The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.
- [essential] testimonial →step2 (observation): A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped.
- [essential] temporal →step2 (contradiction): The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating the natural stop time assumption.

### Mid Clues (Act II) - 18 clues
- [essential] temporal →step3 (observation): The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the manor clock stopped.
- [essential] testimonial →step3 (contradiction): Edward Langley’s claimed alibi at the stables after the murder time is disproved by the stable logbook, eliminating him as the murderer.
- [essential] temporal →step4 (observation): Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, showing a deliberate mismatch.
- [essential] behavioral →step4 (contradiction): John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window for the murder.
- [essential] temporal →step1 (contradiction): The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.
- [essential] physical →step3 (observation): A controlled comparison of the manor clock’s scratched hands and pendulum bob with the clock-winder’s tool reveals matching scratch patterns.
- [essential] temporal →step3 (observation): John Avery is uniquely linked to the clock manipulation through the matching scratch patterns and his exclusive access to the clock-winder’s tool.
- [essential] behavioral →step3 (observation): John Avery’s personal notes reveal intentions to protect family secrets and maintain control over the estate, indicating motive and premeditation.
- [essential] testimonial →step3 (elimination): Clara Mitchell’s alibi is corroborated by kitchen staff testimony and servant logs, eliminating her as a suspect.
- [essential] testimonial →step3 (elimination): Eliminates Clara Mitchell because her whereabouts during the murder time are confirmed by servant logs and kitchen staff testimony, focusing suspicion on John Avery.
- [essential] temporal →step3 (contradiction): The stable logbook’s time entry conflicts with Edward Langley’s claimed alibi, disproving his presence at the murder scene.
- [essential] temporal →step4 (observation): Direct evidence links John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines.
- [essential] physical →step3 (observation): Direct evidence ties John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines.
- [essential] behavioral →step4 (contradiction): John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window for the murder.
- [essential] temporal →step4 (observation): Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, showing a deliberate mismatch.
- [essential] temporal →step1 (contradiction): The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.
- [essential] temporal →step3 (observation): John Avery is uniquely linked to the clock manipulation through the matching scratch patterns and his exclusive access to the clock-winder’s tool.
- [essential] temporal →step4 (observation): Direct evidence links John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines.

### Late Clues (Act III) - 1 clues
- [optional] temporal →step4 (observation): Manor clock stopped at ten minutes past eleven remains a late texture detail in the case background.

### Essential Clues (per inference step)
- The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear. (early, step 1)
- The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally. (early, step 1)
- A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped. (early, step 2)
- The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating the natural stop time assumption. (early, step 2)
- The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the manor clock stopped. (mid, step 3)
- Edward Langley’s claimed alibi at the stables after the murder time is disproved by the stable logbook, eliminating him as the murderer. (mid, step 3)
- Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, showing a deliberate mismatch. (mid, step 4)
- John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window for the murder. (mid, step 4)
- The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped. (early, step 1)
- The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally. (mid, step 1)
- A controlled comparison of the manor clock’s scratched hands and pendulum bob with the clock-winder’s tool reveals matching scratch patterns. (mid, step 3)
- John Avery is uniquely linked to the clock manipulation through the matching scratch patterns and his exclusive access to the clock-winder’s tool. (mid, step 3)
- John Avery’s personal notes reveal intentions to protect family secrets and maintain control over the estate, indicating motive and premeditation. (mid, step 3)
- Clara Mitchell’s alibi is corroborated by kitchen staff testimony and servant logs, eliminating her as a suspect. (mid, step 3)
- Eliminates Clara Mitchell because her whereabouts during the murder time are confirmed by servant logs and kitchen staff testimony, focusing suspicion on John Avery. (mid, step 3)
- The stable logbook’s time entry conflicts with Edward Langley’s claimed alibi, disproving his presence at the murder scene. (mid, step 3)
- Direct evidence links John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines. (mid, step 4)
- Direct evidence ties John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines. (mid, step 3)
- John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window for the murder. (mid, step 4)
- Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, showing a deliberate mismatch. (mid, step 4)
- The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped. (early, step 1)
- The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear. (early, step 1)
- The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally. (early, step 1)
- A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped. (early, step 2)
- The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating the natural stop time assumption. (early, step 2)
- The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally. (mid, step 1)
- John Avery is uniquely linked to the clock manipulation through the matching scratch patterns and his exclusive access to the clock-winder’s tool. (mid, step 3)
- Direct evidence links John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines. (mid, step 4)

### Red Herrings
- The manor displayed accurately at ten trusted past eleven, which matches the time servants reported hearing a scream, suggesting it accurately central. (supports: The stopped manor clock’s displayed time accurately indicates the time of the murder.)
- The manor timekeeper’s hands appear worn in a manner consistent with normal use, supporting the idea that the timekeeper estate servant at the time of the murder. (supports: The stopped manor clock’s displayed time accurately indicates the time of the murder.)

---

## Constraint Space
The mystery establishes these constraints:

### Temporal Constraints
- Manor clock stopped at ten minutes past eleven
- Stable logbook records Edward Langley entering at half past eleven
- Butler’s schedule of clock winding from 9:30 to 11:15
- Victim’s time of death between ten and eleven
- Servants’ duties scheduled by manor clock time
- Butler’s clock manipulation occurred shortly before clock stopped
- Clock shows later time than servants’ schedule actual time
- Stable logbook time conflicts with claimed alibi
- Clock hands scratched near center pin inconsistent with normal wear

### Access Constraints
- Butler John Avery
- Margaret Langley
- Edward Langley
- Clara Mitchell
- Manor clock
- Clock-winder’s tool
- Stable logbook
- Key rings
- Butler has universal access to manor and clock mechanisms
- Servants restricted to specific quarters and times
- Family members have access but limited knowledge of clock mechanics

### Physical Evidence
- Clock mechanism cannot run backwards without external force
- Physical scratches on clock parts indicate tool use
- Pendulum bob scratch matching clock-winder’s tool
- Scratches on clock hands near center pin
- Servant’s report of odd ticking sound

### Social Constraints
- Servants’ logbooks
- Butler’s schedule records
- Family social protocol and hierarchy
- Butler as estate manager and clock keeper
- Inspector Finch’s investigative authority

---

## Cast — Alibi, Access & Evidence Sensitivity
- **Inspector Harold Finch**: alibi="Present at manor estate throughout investigation" | access="high" | opportunities: Access to all manor areas via official capacity | evidence_sensitivity: Physical clues, Witness testimony, Time records
- **Margaret Langley**: alibi="Claims to have been in the drawing room between ten and eleven" | access="high" | opportunities: Access to victim’s study; Presence in manor during timeframe | evidence_sensitivity: Time logs, Access records, Witness statements
- **Edward Langley**: alibi="Claims to have been in the stables from ten to half past eleven" | access="medium" | opportunities: Access to victim’s study via servant’s corridor; Movement through stables and grounds | evidence_sensitivity: Stable logs, Servant testimony, Clock timings
- **Clara Mitchell**: alibi="Claims to have been in kitchen cleaning from nine to eleven" | access="medium" | opportunities: Access to victim’s quarters via servant passages; Movement during servant shifts | evidence_sensitivity: Servant logs, Kitchen staff testimony, Clock examination
- **John Avery**: alibi="Claims to have been arranging clocks and schedules from 9:30 to 11:15" | access="high" | opportunities: Access to all parts of manor; Control over clock mechanisms | evidence_sensitivity: Clock mechanism, Staff schedules, Key rings

---

## CML Fair Play Declarations
all_clues_visible: true
no_special_knowledge_required: true
no_late_information: true
reader_can_solve: true
explanation: Step 1: The physical scratches on the clock hands and pendulum bob (early clues) establish tampering. Step 2: The servant’s testimony about the odd ticking (mid clues) reveals clock manipulation. Step 3: The stable logbook entries (mid clues) eliminate Edward Langley. Step 4: The butler’s schedule conflict (late clue) links him to the tampering. All clues are presented before the discriminating test, allowing the reader to deduce the true timeline and culprit.

---

## Quality Controls
**Discriminating test must appear**: early_act3
**Essential clues minimum**: 4 | before discriminating test: true
**Clues per act minimum**: early=2, mid=2, late=1

---

## Clue-to-Scene Mapping (when present)
- clue clue_1: Act 1, Scene 1 (Direct observation)
- clue clue_2: Act 1, Scene 2 (Cross-check contradiction)
- clue clue_3: Act 1, Scene 3 (Witness statement)
- clue clue_4: Act 1, Scene 3 (Cross-check contradiction)
- clue clue_alibi_timing: Act 1, Scene 3 (Edward’s testimony and schedule)
- clue clue_butler_schedule_conflict: Act 1, Scene 3 (Discovery of butler’s detailed schedule)
- clue clue_margaret_alibi: Act 1, Scene 3 (Margaret’s statement and servant corroboration)
- clue clue_mechanism_visibility_core: Act 1, Scene 3 (Direct observation)
- clue clue_servant_odd_ticking: Act 1, Scene 3 (Servant testimony during questioning)
- clue clue_stable_log: Act 1, Scene 3 (Stable logbook entries)
- clue clue_5: Act 2, Scene 1 (Direct observation)
- clue clue_6: Act 2, Scene 2 (Cross-check contradiction)
- clue clue_11: Act 2, Scene 3 (Direct observation)
- clue clue_12: Act 2, Scene 3 (Direct observation)
- clue clue_13: Act 2, Scene 3 (Behavioral observation)
- clue clue_14: Act 2, Scene 3 (Corroborated elimination)
- clue clue_15: Act 2, Scene 3 (Cross-check contradiction)
- clue clue_7: Act 2, Scene 3 (Direct observation)
- clue clue_8: Act 2, Scene 3 (Cross-check contradiction)
- clue clue_cleaning_schedule: Act 2, Scene 3 (Cleaning duty roster)
- clue clue_clock_hands_scratches: Act 2, Scene 3 (Direct observation of clock mechanism)
- clue clue_core_contradiction_chain: Act 2, Scene 3 (Cross-check contradiction)
- clue clue_core_elimination_chain: Act 2, Scene 3 (Corroborated elimination)
- clue clue_culprit_direct_1: Act 2, Scene 3 (Direct observation)
- clue clue_culprit_direct_john_avery: Act 2, Scene 3 (Direct observation)
- clue clue_kitchen_testimony: Act 2, Scene 3 (Kitchen staff confirming Clara’s presence)
- clue clue_pendulum_scratch: Act 2, Scene 3 (Inspector’s close examination of pendulum bob)
- clue clue_servant_testimony: Act 2, Scene 3 (Multiple servants confirm Margaret’s location)
```

## Message 3 (role=user)

```text
# Narrative Quality Audit

Structural integrity has been verified by the system before this call. Do NOT re-check clue presence or inference step coverage.

## Your 4 narrative quality checks

For each check, answer YES or NO and cite specific evidence from the Clue Distribution:

1. **Genuine Inferential Test**: Is the discriminating test a real logical test (the culprit is exposed because only they satisfy a constraint revealed by prior clues), or does it rely on coincidence, confession, or authority? Cite the test design and the prior clue that makes it logically necessary.

2. **False Assumption Planting**: Does the false assumption feel convincingly planted? Are there ≥2 early/mid clues that reinforce the false narrative before it is overturned? Name them.

3. **Reader Solvability**: Could a careful reader, armed only with the early and mid clues in the distribution, reach the correct culprit through observation → correction → elimination before Act III? Trace the chain explicitly.

4. **Clue Trail Fairness**: Does the trail feel fair — evidence before deduction, no arbitrary withholding — or does it feel like a trick? Flag any clue whose timing feels like a cheat.

## Hard fairness contracts (must be enforced)
- Ensure at least one mechanism-visibility clue appears before the discriminating test.
- Reader reasoning must follow observation -> correction -> elimination, without hidden jumps.
- For timing fairness, the test must confirm evidence, not introduce it.
- Treat semantically equivalent clues as valid support when wording differs but mechanism and inference role are identical.

## Quality Bar
- Be thorough and specific.
- Explain exactly what's wrong and how to fix it.

## Micro-exemplars
- Weak detail: "The test works somehow."
- Strong detail: "The trace-comparison test confirms residue already established in early clues."

## Silent Pre-Output Checklist
- Before finalizing, confirm each check cites concrete clue IDs or CML fields.
- Ensure every recommendation is minimal, actionable, and tied to a cited defect.

## Output format

```json
{
  "overallStatus": "pass" | "fail" | "needs-revision",
  "checks": [
    { "rule": "Genuine Inferential Test", "status": "pass|fail|warning", "details": "...", "recommendations": [] },
    { "rule": "False Assumption Planting", "status": "pass|fail|warning", "details": "...", "recommendations": [] },
    { "rule": "Reader Solvability", "status": "pass|fail|warning", "details": "...", "recommendations": [] },
    { "rule": "Clue Trail Fairness", "status": "pass|fail|warning", "details": "...", "recommendations": [] }
  ],
  "violations": [],
  "warnings": [],
  "recommendations": [],
  "summary": "Narrative quality assessment"
}
```

JSON only, no markdown fences.
```
