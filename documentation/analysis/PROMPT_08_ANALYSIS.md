eport: Chapter 3 retry failure analysis and implementation plan
Executive summary

Chapter 3 did not fail because the model was ignoring the prompt in a general sense. It failed because the prompt/validator contract is mis-specified in a way that makes one required item effectively invisible to the prose model, and because the retry strategy adds pressure without adding enough concrete repair structure.

There are two distinct problems:

clue_early_1 is modeled like a clue ID, but it is actually a placement/visibility rule.
The prose model can write the stopped-clock scene and still fail validation because the validator expects a specific early on-page observation pattern that the prompt does not define concretely enough.

Length control is unstable and misaligned across outline, checklist, validator, and retries.
The scene outline estimated 1000 words, the checklist mentioned a hard floor of 704 and an aim of 1500+, and validation reported against 1300 preferred. Retries raised pressure but did not provide a reliable expansion scaffold. The final attempt likely regressed due to either output instability or extraction/parsing issues.

What happened in the observed run

From the logs:

Attempt 1 failed:

missing clue_early_1

744/1300

Attempt 2 failed:

missing clue_early_1

820/1300

Attempt 3 failed:

missing clue_early_1

882/1300

Attempt 4 failed:

missing clue_early_1

693/704 hard floor

This tells us:

The clue failure is persistent and likely deterministic.

The length issue is not simply “the model kept getting closer”; the final attempt collapsed below the hard floor.

There may be a secondary pipeline issue on the final attempt: truncation, malformed JSON, extraction loss, or a different reporting layer.

Root cause analysis
1) clue_early_1 is underdefined for the prose model

Current model-facing setup treats these as separate obligations:

clue_early_1

clue_1

clue_2

But semantically, clue_early_1 is not really a distinct clue. It appears to mean:

the stopped clock must be directly observed

early in the chapter

visibly on-page

likely with explicit detective processing

That is a scene-structure requirement, not a separate story fact.

The model already sees:

clue_1: clock shows 11:10 PM

clue_2: clock was manipulated

So it can satisfy the story and still fail the validator if the early observation is not rendered in the exact form the validator expects.

2) The retries speak validator language instead of prose language

Retry prompts currently say things like:

missing required clue obligation for clue_early_1

add an on-page clue observation moment

add a detective processing line

This is still too abstract. The repair prompts should tell the prose model exactly what to do in-story:

Beatrice crosses the library to the stopped clock

she looks at it directly

the prose explicitly says it reads “ten minutes past eleven”

in the next paragraph she explicitly says or thinks it may have been manipulated and may mislead them

Without this, the model keeps collapsing clue_early_1 into the already-mentioned clock clue.

3) Length requirements are inconsistent across the stack

The current layers send conflicting signals:

outline scene estimate: 1000

checklist hard floor: 704

checklist aim: 1500+

validator preferred target: 1300

This is a bad control system. The model is being told several different truths at once.

For one-scene chapters in particular, the outline estimate matters a lot. If the outline says 1000, many models will implicitly target around that number even if later text says “aim higher.”

4) Retry accumulation may be degrading performance

Each retry appends more instructions while retaining all previous layers. On smaller models this can:

reduce generation headroom

make the prompt harder to resolve

increase brittleness

sometimes shorten output unexpectedly

This likely contributed to the final-attempt instability.

5) Final-attempt count regression suggests a possible extraction/parsing bug

The attempt progression went 744 → 820 → 882, then apparently dropped to 693 on attempt 4.

That is suspicious. Possible causes:

model output was genuinely shorter

JSON malformed, so validator extracted only part of content

output truncated

different reporting layers counted differently

serializer escaped or clipped content

This needs verification in code.

Implementation requirements
A. Redesign the model-facing clue contract
Problem

Do not expose clue_early_1 to the prose model as if it were a standalone clue ID.

Fix

Split the current requirement into:

Observation requirement

Fact requirement

Inference requirement

Placement requirement

New internal representation

Use something like this in your prompt builder and validator mapping:

{
  "required_observations": [
    {
      "id": "clock_direct_observation_early",
      "description": "Beatrice directly observes the stopped library clock early in the chapter.",
      "must_occur_by": "first_25_percent"
    }
  ],
  "required_facts": [
    {
      "id": "clock_reads_11_10",
      "description": "The clock reads \"ten minutes past eleven\"."
    },
    {
      "id": "clock_time_may_be_misleading",
      "description": "Beatrice explicitly considers that the clock may have been manipulated and may mislead them about the time of death."
    }
  ]
}
Instruction to coder

Implement a translation layer so validator-facing IDs can remain internal, but model-facing prompts always convert them into concrete narrative obligations.

B. Make the initial prompt concrete enough to pass without retries
Problem

The initial run is too dependent on retries to clarify structure.

Fix

The initial prompt must explicitly require a specific early two-paragraph clue block.

Instruction to coder

Update the initial Chapter 3 prompt generation so the system/user prompt contains these requirements in prose terms:

In the first quarter of the chapter, Beatrice Barton must directly observe the stopped clock in the library.

The text must explicitly state that it reads “ten minutes past eleven.”

In the immediately following paragraph, Beatrice must explicitly reason that the clock may have been manipulated and may mislead them about the time of death.

These should be emitted as mandatory story beats, not abstract clue IDs.

C. Align word-count signals across all prompt layers
Problem

The model is receiving contradictory length targets.

Fix

Choose one true generation target and use it everywhere.

Recommendation

If validator preferred minimum is 1300, generator target should be 1450–1550 to provide buffer.

Instruction to coder

For one-scene chapter prompts:

Remove or override scene estimates that are below validator preferred minimum.

Set:

generator_minimum_words = validator_preferred_minimum + 150 to 250

Use that number consistently in:

scene outline

prose requirements

pre-submit checklist

retry prompts

For this case:

validator preferred = 1300

generator minimum should be 1450 or 1500

D. Rewrite retry injections to be repair prompts, not error summaries
Problem

Retries currently restate validation outcomes, but do not force the right prose structure.

Fix

Retries should escalate from:

concrete required beats

to paragraph-level template

to position-constrained mandatory block

Instruction to coder

Replace current retry injections with the following pattern:

Attempt 2 repair template

Use when early clue missing and/or underlength:

Require two separate paragraphs near the beginning:

Paragraph 1: Beatrice physically approaches or studies the clock; explicit phrase “ten minutes past eleven”

Paragraph 2: explicit suspicion that the clock may have been manipulated and may mislead

Require full regeneration, not patch-only language

Require minimum 1400+ words

Attempt 3 repair template

If still failing:

State “Paragraph A” and “Paragraph B” explicitly

Require those paragraphs in the first quarter of the chapter

Raise minimum to 1450

Specify safe expansion methods: action, gesture, silence, reactions, inference dialogue

Attempt 4 repair template

If still failing:

Require the clue block within the first 300 words

Require explicit physical approach to clock

Require exact phrase “ten minutes past eleven”

Require explicit reasoning that displayed time may be misleading

Require 1500+ words

Tell model to rebuild the chapter, not preserve prior wording

Do not keep repeating “clue_early_1” as the main actionable phrase.

E. Strengthen the pre-submit checklist
Problem

The current checklist checks broad goals but not the actual failing structure.

Fix

The checklist should mirror the validator’s real semantics.

Instruction to coder

Replace the generic chapter checklist with a chapter-specific structural checklist, for example:

valid JSON only

chapter content at least 1450 words

opens in the library

before major dialogue, includes 2+ sensory cues and 1+ atmosphere marker

in the first quarter of the chapter, Beatrice directly observes the stopped clock

explicitly states “ten minutes past eleven”

in the immediately following paragraph, Beatrice explicitly suspects manipulation / misleading time

no forbidden seasonal words

locked phrases reproduced exactly

This should be generated dynamically from the validator contract, not hand-maintained separately.

F. Add parser/extraction diagnostics for failed retries
Problem

Attempt 4 may have failed partly because the validator did not see the full chapter content.

Fix

Add instrumentation to compare raw output and extracted content.

Instruction to coder

For every failed generation attempt, log:

raw model response length in characters

raw extracted JSON length

extracted content field length in characters

extracted content word count

JSON parse success/failure

whether output appears truncated

final 300 characters of raw response

final 300 characters of extracted content

Additionally:

persist the full raw model output for every failed attempt

persist the parsed JSON used for validation

record whether validation operated on raw text fallback or parsed JSON field

This will tell us whether attempt 4 was:

genuinely short

clipped

malformed

partially extracted

G. Improve validator logic for narrative clues
Problem

The validator may be too rigid if it expects exact internal IDs or overly narrow wording.

Fix

Validate narrative semantics, not just abstract labels.

Instruction to coder

Define clue_early_1-equivalent satisfaction as a bundle of narrative conditions, such as:

direct observation of the library clock by Beatrice

explicit statement of the displayed time

occurrence within early chapter window

nearby explicit inference that the clock may be unreliable or manipulated

Do not require the generator to somehow “know” the ID itself.

If you need a strict check, use:

structural rules

phrase checks for locked text

paragraph proximity checks

character/action cues

rather than clue-ID semantics alone.

Recommended prompt architecture
1. Initial run

Initial prompt should contain:

core prose rules

explicit narrative obligations for the clock

exact locked phrase instructions

unified word target

output JSON schema

chapter-specific checklist

2. Retry ladder

Retries should escalate like this:

Attempt 2: concrete repair beats

Attempt 3: paragraph template

Attempt 4: mandatory clue block within first N words + rebuild instruction

Each retry should be short and precise. Do not keep appending emotional urgency text.

Suggested prompt text patterns for implementation
Initial-run mandatory block

Use wording equivalent to:

In the first quarter of the chapter, Beatrice Barton must directly observe the stopped clock in the library.

During that observation, explicitly state that it reads “ten minutes past eleven.”

In the immediately following paragraph, Beatrice must explicitly reason that the clock may have been manipulated and may mislead them about the time of death.

Attempt-2 repair block

Use wording equivalent to:

Include a paragraph near the beginning in which Beatrice physically goes to the clock and looks at it directly.

Explicitly state that it reads “ten minutes past eleven.”

In the immediately following paragraph, Beatrice explicitly says or thinks the clock may have been manipulated and may mislead them.

Keep these as two separate paragraphs.

Attempt-3 repair block

Use wording equivalent to:

Paragraph A: Beatrice crosses to the clock, examines it directly, and the prose explicitly states “ten minutes past eleven.”

Paragraph B: in the next paragraph, she explicitly reasons that the clock may have been tampered with and may mislead them about the true time of death.

Attempt-4 repair block

Use wording equivalent to:

Within the first 300 words, include a two-paragraph clue block:

direct physical observation of the clock + explicit phrase “ten minutes past eleven”

explicit reasoning that the clock may have been manipulated and may mislead them

Priority implementation checklist
P0 — must do now

Replace model-facing clue_early_1 instructions with concrete prose obligations

Align word-count target across prompt layers

Rewrite retry prompts to paragraph/block-level repair prompts

Add full raw-output and parsed-content diagnostics for failed runs

P1 — strongly recommended

Refactor validator to distinguish clue facts from placement constraints

Generate chapter-specific pre-submit checklists directly from validator contract

Remove low-value urgency text from retry injections

P2 — nice to have

Add a prompt compiler that turns structured clue specs into:

initial-run prose obligations

retry repair blocks

validator checks

Add buffer logic so generator minimum always exceeds validator preferred minimum by a fixed margin

Expected outcome after implementation

If these changes are made, Chapter 3-type failures should improve in the following ways:

early clue visibility should become much more reliable

retries should actually repair the missing condition instead of restating it

one-scene chapters should stop under-shooting validator targets

final-attempt collapses should become diagnosable rather than mysterious

the validator/model contract will become legible instead of relying on internal clue-ID semantics

Direct instruction block for the coder

Implement the following changes in the prose-generation pipeline:

Do not expose validator-only clue IDs directly to the prose model.
Convert each such ID into concrete narrative obligations with:

who observes

what is observed

exact required phrase, if any

where in chapter it must occur

whether a follow-up inference paragraph is required

For Chapter 3 clock clues, replace clue_early_1 in prompts with a mandatory early two-paragraph sequence:

paragraph 1: Beatrice directly observes the stopped clock; explicit phrase “ten minutes past eleven”

paragraph 2: explicit suspicion that the clock may have been manipulated and may mislead time-of-death inference

Unify word count targets.
If validator preferred minimum is 1300, set prompt minimum to at least 1450.
Update all outline estimates, checklists, and retry prompts to match.

Replace current retry injections with escalating repair templates.
Attempt 2 = concrete beats.
Attempt 3 = paragraph A / paragraph B structure.
Attempt 4 = mandatory two-paragraph clue block within first 300 words and full rebuild instruction.

Improve failure diagnostics.
Persist raw model output and parsed JSON for every failed attempt. Log extracted content word count separately from raw response size. Detect truncation and malformed JSON.

Refactor validator semantics.
Treat early clue visibility as a structured narrative condition, not as a standalone clue ID the model is expected to reason about.

Generate chapter-specific pre-submit checklists from validator requirements.
The checklist must explicitly mention the concrete early clock observation, exact phrase requirement, and separate follow-up inference paragraph.

That is the implementation plan.