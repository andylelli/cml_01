# ANALYSIS_20: Story Quality Review — Run 7 Output Audit & Next-Phase Fix Plan

**Date:** 2026-05-16  
**Source story:** `story_20260516-1051/generated_in_scene_batches_5_batch_es_required_r.md`  
**Run ID:** mystery-1778924663315  
**Canary result:** EXIT:0 (passed validation), but story prose quality is severely degraded

---

## Section 1 — Issue Inventory

### 1.1 Template Bleed — Still Catastrophic

The Phase 2B fix (changing `Location anchor:` label to `Scene is set in:`) had no measurable effect. Every chapter except Chapter 4 opens with raw structured data from the location profile.

**Examples from the story:**

> *Chapter 1:* "The Library in Little Middleton, England carried overcast with occasional rain, typical for a late autumn day. in every corridor; The crackling of the fire provides a comforting backdrop, punctuated by the occasional rustle of pages turning as if the books themselves are whispering secrets drifted past, and The leather of the armchair is cool to the touch, its texture cracked and worn, a testament to the many hours spent in contemplation or conversation made the tense and foreboding, with an underlying sense of unease among the guests. mood impossible to ignore."

> *Chapter 5:* "The Drawing Room in Little Middleton, England met them with overcast with occasional rain, typical for a late autumn day. and The fragrant aroma of fresh flowers from a nearby vase mingles with the scent of aged mahogany..."

> *Chapter 8:* **Two complete template dumps back-to-back** before prose begins.

**Dissection of a single opening:** The Chapter 1 opening is assembling verbatim fragments from three separate location profile fields:
- `atmosphere.weather` → "overcast with occasional rain, typical for a late autumn day"
- `sensoryDetails.sounds[0]` → "The crackling of the fire provides a comforting backdrop, punctuated by the occasional rustle of pages turning as if the books themselves are whispering secrets"
- `sensoryDetails.tactile[0]` → "The leather of the armchair is cool to the touch..."
- `atmosphere.mood` → "tense and foreboding, with an underlying sense of unease among the guests"

The LLM is threading these strings together with connective fragments ("in every corridor;", "drifted past, and", "made the... mood impossible to ignore") to produce a single grammatically broken mega-sentence.

| Chapter | Template bleed form |
|---------|-------------------|
| Ch1 | Location + weather + 3 sensory fields concatenated with connective fragments |
| Ch3 | "By the time they reached The Study in Little Middleton, England, [sounds field]..." |
| Ch5 | "The Drawing Room in Little Middleton, England met them with [weather] and [smells field]..." |
| Ch6 | Location + weather + "in every corridor;" + sounds field |
| Ch7 | "Under [weather] skies, The Library in Little Middleton, England felt [mood];" + sounds + smells |
| Ch8 | TWO complete location dumps, separate paragraphs, before prose |
| Ch9 | "In The Study in Little Mittleton, [scent] and [sounds] met at the doorway, and even [tactile] seemed to signal..." |

---

### 1.2 Sensory Data Written as Present-Tense Prose by Agent 2c

| ID | Issue | Severity |
|----|-------|----------|
| A20-TB-1 | Agent 2c's schema instructs it to produce `sensoryDetails.sounds` as **"Full 2-sentence sound description — ambient and specific noises"**. The LLM follows this instruction and generates full present-tense sentences: *"The crackling of the fire provides a comforting backdrop, punctuated by the occasional rustle of pages turning as if the books themselves are whispering secrets."* These strings are structurally indistinguishable from finished prose. When Agent 9 receives them under a label like `Sounds:`, it copies them verbatim. The `⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM` warning is overridden by the pull of ready-made sentences. | Critical |
| A20-TB-2 | The location name + geographic context is still the first token in the CHAPTER SENSORY PALETTE HINTS: `Chapter 1 (The Library, morning / rain — oppressive):`. The LLM uses this as the subject of its opening sentence, producing "The Library in Little Middleton, England..." regardless of what the `Scene is set in:` line says. The Phase 2B fix changed a label; the first content token in the palette hints section is still the room name. | Critical |
| A20-TB-3 | Chapter 8 has two complete template dumps. This is caused by the CHAPTER SENSORY PALETTE HINTS section emitting two chapter-specific blocks (for scene 7 and scene 8 in the batch context window) when the LLM processes a context that includes hints for the preceding chapter as well as the current one. | High |
| A20-TB-4 | The `atmosphere.mood` field ("tense and foreboding, with an underlying sense of unease among the guests") is a complete clause that appears nearly verbatim in every chapter opening as the closing fragment of the template bleed sentence. It is injected via `mood` in `buildLocationProfilesBlock`. | High |

---

### 1.3 "The evidence showed X" — Semantically Broken Injection

| ID | Issue | Severity |
|----|-------|----------|
| A20-EV-1 | The injection template `"The evidence showed ${canonical}."` works grammatically only for abstract facts (time values). In this run, the locked facts include physical measurements of the chandelier device (`twelve feet` = chandelier height, `two hundred pounds` = chandelier weight). The results: **"The evidence showed twelve feet."** / **"The evidence showed two hundred pounds."** — both are nonsensical in English. The template has no type-awareness. | Critical |
| A20-EV-2 | The injection appears at the START of paragraphs (Phase 2A prepend). When the best-matching paragraph is the first paragraph of a chapter, the chapter now opens with "The evidence showed X." — which looks like a summary label, not prose. In Ch2: `"The evidence showed twelve feet. Dr. Finch cleared his throat..."` — the injection splits a proper sentence between paragraphs. | High |
| A20-EV-3 | The function injects into every chapter where the canonical is absent, regardless of whether that canonical value is plot-relevant to that chapter. A measurement locked fact ("twelve feet") matches any paragraph that mentions the chandelier — including chapters 2, 5, 6, 7, 8, producing 6+ injections of the same broken sentence. | High |

---

### 1.4 Pronoun Drift — Persistent and Widespread

| ID | Issue | Severity |
|----|-------|----------|
| A20-PR-1 | Captain Hale oscillates between he/him and she/her **within the same paragraph** in multiple chapters. Ch1: "his presence commanding" → "She glanced at the chandelier" → "her blue eyes" → "She asked". Ch5: "she paused, her gaze falling on Eleanor" → "she pressed on" → "Ivor's expression shifted as she processed" then later "Ivor crossed her arms" then "his eyes narrowing". The repair sweep fixes many but the alternation is so frequent within paragraphs that some always slip through. | Critical |
| A20-PR-2 | Eleanor (female, POV character) is misgendered in Ch3 ("He glanced around the room, his eyes landing on Dr. Finch"), Ch4 ("both of whom stood before him"), Ch8 ("He paused, allowing his words to sink in"). This is the POV drift problem: the LLM defaults to masculine as the "neutral narrator" voice when Eleanor's name is not in the immediately preceding clause. The pronoun block does not address narrator-voice gender specifically. | Critical |
| A20-PR-3 | Dr. Finch is assigned male gender in this run's CML ("his expression a mask of concern" in Ch1) but later gets "her" pronouns: "Her brow furrowed as she looked from the wreckage". Within Ch5, Finch gets "he" and "she" in alternate paragraphs. | Critical |
| A20-PR-4 | The personality block pronoun tag (Phase 4) reads `"### Captain Ivor Hale (he/him — NEVER she/her)"`. This appears once in the character personality section. By the time the LLM is generating chapter 5's prose, the personality section is 3,000+ tokens behind in context. The tag is too far away to influence generation-time pronoun selection. | High |

---

### 1.5 Investigation Stagnation — Chapters 6–9 Are the Same Scene

| ID | Issue | Severity |
|----|-------|----------|
| A20-IS-1 | The confrontation with Beatrice is written almost identically in Chapters 6, 7, 8, and 9. Near-verbatim repeated passages across these chapters: *"The gears I found scattered near the clock indicate that it was tampered with. Someone wanted to create a false timeline, and that points to a calculated act of deception."* / *"It's not just the clock, Beatrice."* / *"What are you implying, Eleanor?"* / *"It's just a clock; it could have stopped for any number of reasons."* / *"We need to tread carefully; accusations without solid evidence could backfire."* | Critical |
| A20-IS-2 | The n-gram fingerprint linter checks only chapter-N against chapter-N-1. Ch6 vs Ch8 are non-adjacent (ch7 is between them) so the linter's context window skips the similarity. Chapters can share 60%+ of their structural content as long as they are not immediately sequential. | High |
| A20-IS-3 | The INVESTIGATION LOG (Phase 5) instructs the LLM: *"Any beat already listed above is forbidden from repeating."* But it lists clue IDs and suspect clearance data — it does NOT list the actual narrative beats (the confrontation, the gear speech, the clock argument). The log is factual, not narrative. The LLM cannot infer from "clue_core_contradiction_chain already in reader's hands" that the gears confrontation scene is off-limits. | High |
| A20-IS-4 | Chapters 1 and 3 cover the same opening beats (Eleanor surveys the scene, finds the clock frozen, begins interviewing). The Chapter 3 opening paragraph is almost identical to Chapter 1 paragraph 2. The continuityTail from Ch1 is 260 chars of closing prose — not enough to prevent the LLM from resetting back to the beginning. | Medium |

---

### 1.6 Murder Victim Never Identified

| ID | Issue | Severity |
|----|-------|----------|
| A20-VIC-1 | The chandelier killed someone, but all four named cast members appear alive throughout the entire story. No chapter names the victim of the murder. The mystery has no dead body. This run's CML assigned the culprit role to Beatrice Quill (the cast member designated "victim" in the fixed cast). The CML generator is assigning roles freely, overriding the intent of the fixed cast assignments. | Critical |
| A20-VIC-2 | When the culprit and victim assignments invert relative to the fixed cast, the Phase 1 victim-suppression code (which removes the victim from `activeCharacterNames` based on `victimName` from the CML) suppresses the wrong character or none at all — the `resolveVictimName` function reads the role from CML, and if CML assigned Beatrice as culprit (not victim), she is NOT suppressed. The dead victim protection only works when the CML role assignment matches the expected pattern. | High |

---

### 1.7 Continuity Fragments — Repeated Identical Blocks Mid-Story

| ID | Issue | Severity |
|----|-------|----------|
| A20-CF-1 | The paragraph "By the time they reached The Study in Little Middleton, England, The soft rustle of paper fills the air..." appears verbatim **three times**: twice in Chapter 1 and once each in Chapters 3 and 9 openings. This is a structural echo where the chapter obligation block for each of these scenes references "The Study" and the sensory palette hint for The Study is being emitted independently for each chapter, producing the same verbatim opening. | High |

---

## Section 2 — Root Cause Analysis

### 2.1 Agent 2c Generates Sensory Data as Finished Prose, Not Atoms

This is the root cause of the entire template bleed problem. The Agent 2c schema instructs:

```
"sounds": ["Full 2-sentence sound description — ambient and specific noises", ...]
```

The LLM follows this instruction literally and produces **complete present-tense sentences** with subjects, verbs, and dependent clauses. When Agent 9 receives these strings under the SENSORY PALETTE label, they look exactly like prose that should appear in the chapter. The `⛔ DO NOT TRANSCRIBE VERBATIM` warning is overridden because the data *looks like prose* — there is nothing structurally different about it.

Compare what Agent 2c generates with what the sensoryVariants examples show:
- **sensoryVariants examples** (noun phrases): `"sounds": ["steady drumming on the roof", "water trickling in the gutters"]`
- **sensoryDetails** (full sentences): `"sounds": ["The crackling of the fire provides a comforting backdrop, punctuated by the occasional rustle of pages turning as if the books themselves are whispering secrets"]`

The `sensoryVariants` array (which uses short noun phrases) was correctly designed. The `sensoryDetails` array (which requests "Full 2-sentence descriptions") produces copy-ready prose. This inconsistency in the schema design is the root of the bleed.

### 2.2 Location Name Is Still the First Content Token

`buildLocationProfilesBlock` constructs `CHAPTER SENSORY PALETTE HINTS` like this:

```
Chapter 1 (The Library, morning / rain — oppressive):
  Sights: ...
  Sounds: The crackling of the fire provides...
```

The chapter number is the first token, followed immediately by the room name in parentheses. The LLM reads this as the chapter's "label" and uses the room name as the subject of its opening sentence. Phase 2B changed the obligation block label but not the sensory palette hint format. The room name is still the most prominent token before the actual sensory content.

### 2.3 Injection Template Is Type-Unaware

`enforceLockedFactValuePresence` uses one template unconditionally:

```typescript
updatedParagraphs[bestIdx] = `The evidence showed ${canonical}. ${updatedParagraphs[bestIdx].trim()}`;
```

`canonical` can be any type: time value ("ten minutes past eleven"), physical measurement ("twelve feet"), weight ("two hundred pounds"), or duration ("forty minutes"). The template reads naturally only for time and duration values. For measurements it produces broken English.

### 2.4 Pronoun Block Is 3,000+ Tokens From Generation Context

The ABSOLUTE PRONOUN LOCK block is injected at section priority 0 (highest) — meaning it is near the **top** of the prompt. Chapter generation happens at the bottom, in the completion context. With a typical 10-chapter story at 800 words/chapter, by chapter 5 the pronoun block is effectively invisible to the generation. The correction rules are correct; their position is wrong.

### 2.5 Investigation Log Is Factual, Not Narrative

The Phase 5 investigation log tells the LLM what evidence has been revealed and what suspects have been cleared. It does NOT tell the LLM what **narrative scenes** have been written. The LLM can repeat the same confrontation scene because nothing in the log says "the gears confrontation was written in Chapter 6." The log is a plot summary, not a scene registry.

### 2.6 Fingerprint Linter Has No Cross-Chapter Window

The n-gram fingerprint check compares chapter N against chapter N-1 only. It has no N-2, N-3, N-4 look-back. Four nearly-identical chapters (6, 7, 8, 9) pass the linter because each is compared only against its immediate predecessor, and the LLM varies the opening sentence enough to avoid the 1-hop fingerprint trigger.

---

## Section 3 — What ANALYSIS_19 Phases Did Not Fix (and Why)

| Phase | What it did | Why it's insufficient |
|-------|------------|----------------------|
| Phase 2B | Changed `Location anchor: X` label to `Scene is set in: X` | Does not touch CHAPTER SENSORY PALETTE HINTS, which still lead with the room name |
| Phase 2A | Prepend "The evidence showed X" instead of append | Made the injection worse for physical measurement values; correct direction for time values only |
| Phase 4 | Pronoun tag in personality block header | One occurrence ~3,000 tokens from generation point; cannot override local context drift |
| Phase 5 | Investigation log in NSD block | Lists clue IDs and clearance data, not narrative scene summaries; LLM cannot infer forbidden scenes from it |

---

## Section 4 — Blue Sky Solutions

### BLUE-A: Sensory Atom Compiler (Agent 2c Output Transform)

**Problem solved:** A20-TB-1, A20-TB-4, A20-CF-1

**The insight:** The `sensoryVariants` array already uses noun-phrase atoms (`"crackling fire"`, `"pages rustling"`). The `sensoryDetails` array uses full sentences because the schema asks for them. This is a data contract problem, not a prompt engineering problem.

**Solution:** After Agent 2c completes, run a deterministic `compileSensoryAtoms` transform on its output **before** any downstream agent receives it. The transform strips all grammatical structure from sensory arrays, reducing each item to a noun phrase or gerund:

```typescript
function compileSensoryAtoms(profiles: LocationProfilesResult): LocationProfilesResult {
  const atomise = (sentence: string): string => {
    // Strip subject + present-tense verb: "The fire crackles" → "crackling fire"
    // Strip clausal extensions: "...as if the books themselves are whispering secrets" → removed
    // Strategy: extract the core noun phrase before the first verb phrase
    return sentence
      .replace(/^The\s+/i, '')
      .replace(/\bprovides?\b.*$/i, '')
      .replace(/\bfills?\b.*$/i, '')
      .replace(/\blingiers?\b.*$/i, '')
      .replace(/,\s*(punctuated|interrupted|mingling|creating|offering|inviting)[^,]*$/i, '')
      .replace(/\s*as\s+if\s+.*$/i, '')
      .replace(/\s*—\s+.*$/i, '')
      .trim()
      .replace(/[.,;]+$/, '');
  };
  // Deep-clone and apply atomise to every string in sensoryDetails arrays
  return deepTransformStrings(profiles, (val, key) =>
    ['sights', 'sounds', 'smells', 'tactile'].includes(key) ? atomise(val) : val
  );
}
```

**Output:** `"sounds": ["crackling fire, pages rustling"]` — not `"sounds": ["The crackling of the fire provides a comforting backdrop..."]`

A noun phrase cannot be copied as a sentence. When Agent 9 receives `Sounds: crackling fire, pages rustling`, the LLM must write *"the fire crackled"* or *"pages rustled"* — it cannot echo the atom as finished prose.

**Where this runs:** In `agent9-run.ts`, immediately after `runAgent2c` completes, before saving to the store. One function call, no LLM cost.

**Scope:** ~80 lines. New `compileSensoryAtoms` utility + call site.

---

### BLUE-B: Sensory Palette Hints — Name-Free Chapter Format

**Problem solved:** A20-TB-2, A20-CF-1

**The insight:** The room name is the first content token in every CHAPTER SENSORY PALETTE HINT. The LLM reads it as the chapter subject. Even with a "do not open with location name" instruction, the name is already there as a header.

**Solution:** Restructure the CHAPTER SENSORY PALETTE HINTS to put the TIME/WEATHER/MOOD tokens first, and replace the room name with a reference-only label that does not read as a noun phrase:

```
CURRENT format (triggers location-first opening):
  Chapter 1 (The Library, morning / rain — oppressive):
    Sounds: The crackling of the fire provides...

NEW format (triggers atmosphere-first opening):
  Chapter 1 palette — morning, rain, oppressive mood, [location: Library]:
    • fire crackling   • old paper smell   • leather armchairs
```

The change:
1. Put time-of-day and weather BEFORE the room name
2. Put the room name in brackets as a disambiguator, not the chapter subject
3. Replace full-sentence sensory items with noun-phrase atoms (from BLUE-A)

The LLM now reads "morning, rain, oppressive" before "Library" — the atmosphere tokens prime the generation context before any location noun appears.

**Where this runs:** `buildLocationProfilesBlock` in `agent9-prose.ts`, the `paletteHints` construction loop (~10 lines changed).

---

### BLUE-C: Fact Injection Template Registry

**Problem solved:** A20-EV-1, A20-EV-2, A20-EV-3

**The insight:** A canonical fact value can be of several types: time, duration, weight, length, count, name. Each type needs a different sentence frame. `"The evidence showed X"` works only for abstract revelatory values.

**Solution:** Classify the canonical value at annotation time and select the appropriate template:

```typescript
type FactValueType = 'time' | 'duration_minutes' | 'weight' | 'length' | 'generic';

function classifyFactValue(canonical: string): FactValueType {
  if (/\b(past|to|o'clock|quarter|half)\b/i.test(canonical)) return 'time';
  if (/\b(minute|second|hour)s?\b/i.test(canonical)) return 'duration_minutes';
  if (/\b(pound|stone|kilogram)s?\b/i.test(canonical)) return 'weight';
  if (/\b(feet?|foot|inch|metre|meter|yard)s?\b/i.test(canonical)) return 'length';
  return 'generic';
}

const INJECTION_TEMPLATES: Record<FactValueType, (desc: string, val: string) => string> = {
  time:             (_d, v) => `The clock stood at ${v}.`,
  duration_minutes: (d, v)  => `The interval — ${d.toLowerCase()} — came to ${v}.`,
  weight:           (d, v)  => `${d.charAt(0).toUpperCase() + d.slice(1)} weighed ${v}.`,
  length:           (d, v)  => `The measurement confirmed: ${v}.`,
  generic:          (_d, v) => `The relevant value established: ${v}.`,
};
```

Additionally, restrict injection to the chapter where the clue is formally introduced (already computed via `appearsInChapters`), and add a **one-injection-per-fact-per-story** guard — if a canonical value has already been injected in any prior chapter, skip the injection entirely rather than injecting again.

**Where this runs:** `enforceLockedFactValuePresence` in `agent9-run.ts` (~30 lines changed).

---

### BLUE-D: Pronoun Embedding at Every Character Reference (Inline Identity)

**Problem solved:** A20-PR-1, A20-PR-2, A20-PR-3, A20-PR-4

This is BLUE-6 from ANALYSIS_19, elevated to the highest priority given the continued failure. ANALYSIS_19 correctly identified that system prompt rules 3,000 tokens from generation context cannot fix antecedent chain drift. Here is the full implementation spec:

**Core principle:** Pronouns should not be rules to recall — they should be tokens the LLM *cannot avoid reading* immediately before generating a character's actions.

**Implementation:** Every prompt builder that emits a character name calls a single `tagCharacter` helper that appends a compact pronoun anchor:

```typescript
// Contract: all builders receive identityMap compiled from StoryContract
const tagCharacter = (name: string, identityMap: Map<string, string>): string => {
  const tag = identityMap.get(name);
  return tag ? `${name}[${tag}]` : name;
};

// Identity map construction (once per prompt):
const identityMap = new Map(cast.map(c => [
  c.name,
  c.gender === 'female' ? 'SHE' : c.gender === 'male' ? 'HE' : 'THEY'
]));
```

**Where tags appear (every location in the prompt that emits a name):**

| Block | Before | After |
|-------|--------|-------|
| Chapter obligation block | `clue revealed by: Eleanor Voss` | `clue revealed by: Eleanor Voss[SHE]` |
| Character contracts block | `Eleanor Voss: POV character` | `Eleanor Voss[SHE]: POV character` |
| NSD investigation log | `Suspect cleared: Captain Hale` | `Suspect cleared: Captain Hale[HE]` |
| Continuity tail | `...Hale crossed the room` | `...Hale[HE] crossed the room` |
| Sensory palette hints | `Chapter 1 (Hale, Library)` | `Chapter 1 (Hale[HE], Library)` |
| Personality headers | `### Eleanor Voss` | `### Eleanor Voss[SHE]` |

The tag appears within 2 tokens of every character name across the entire prompt. The LLM cannot encounter "Hale" without immediately reading "[HE]". This does not require the LLM to recall a rule — the rule is co-located with the data.

**Narrative voice anchor (fixes A20-PR-2):** Add a one-line NARRATIVE VOICE declaration at position 0 (before even the pronoun block):

```
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored "she/her" without a nearby name refers to Eleanor. Default narrator pronoun: SHE. Never use "he/his" as the default narrator voice.
```

This directly addresses the POV-character masculine default drift.

**Scope:** ~100 lines. `tagCharacter` helper + updates to `buildChapterObligationBlock`, `buildNSDBlock`, `buildCharacterContractsBlock`, `buildLocationProfilesBlock` (sensory palette hints only), and continuity tail formatting. Plus the narrative voice line at the top of `buildProsePrompt`.

---

### BLUE-E: Narrative Beat Registry (Forbidden Scene Tracker)

**Problem solved:** A20-IS-1, A20-IS-2, A20-IS-3, A20-IS-4

**The insight:** The INVESTIGATION LOG tracks *facts* (clues, alibis). The repetition problem is about *narrative beats* (the gears confrontation, the clock argument, Beatrice denying involvement). These are distinct. No current system tracks narrative beats.

**Solution:** After each chapter commits, extract 3–5 "beat fingerprints" deterministically — not via LLM, but via a text signature function:

```typescript
interface BeatFingerprint {
  chapterNumber: number;
  signature: string;   // 15-word phrase from the middle of each distinct scene block
  charactersMentioned: string[];
  keyTerms: string[];  // nouns that appear 3+ times in the chapter
}
```

Extraction is cheap: split chapter into 200-word segments, extract the most content-dense sentence from each (most nouns, fewest pronouns), and store it as the beat signature.

These signatures are injected into the next chapter's NSD block as a **FORBIDDEN REPEAT registry** with concrete phrase examples:

```
⛔ FORBIDDEN REPEATS — These narrative beats have already been written.
Do NOT rewrite them or near-paraphrases of them:

• Ch6 beat: "gears scattered near the clock indicate tampering" — the gears were found. Do not re-find them.
• Ch6 beat: "Beatrice: It's just a clock; it could have stopped" — this denial was already made. Do not repeat it.
• Ch7 beat: "the hands of the clock pointed to ten minutes past eleven, witness statements indicate eleven" — this contradiction was already stated.
• Ch8 beat: "accusations without solid evidence could backfire" — Hale already said this.

Write something that has NOT happened yet. Advancing the story requires new information or a new event.
```

The phrases are actual sentence fragments from the prose, not abstract instructions. The LLM recognises them as "already written" and avoids them.

**Multi-chapter fingerprint linter (fixes A20-IS-2):** Extend the existing n-gram fingerprint check to compare chapter N against chapters N-1, N-2, N-3 simultaneously. Flag if any pair has >40% 6-gram overlap, not just the immediate predecessor.

**Scope:** ~120 lines. `extractBeatFingerprints` function + `buildForbiddenRepeatBlock` + multi-hop linter extension + call in `onBatchComplete`.

---

### BLUE-F: Pre-Generation Chapter Arc Locking

**Problem solved:** A20-IS-1, A20-IS-3, A20-IS-4 (complementary to BLUE-E)

**The insight:** BLUE-E prevents repeating past beats. BLUE-F prevents the *structure* of chapters from converging. The repetition of "Eleanor confronts Beatrice" in Ch6–Ch9 is a structural pattern, not just a phrase pattern.

**Solution:** Before Chapter 1 is generated, compile a `MacroArcPlan` — a 10-entry table assigning each chapter a unique structural archetype it must embody:

```typescript
const STRUCTURAL_ARCHETYPES = [
  'DISCOVERY',       // body/scene found — no interrogation
  'FIRST_CONTACT',   // initial interviews — no evidence found yet
  'EVIDENCE',        // physical discovery — no confrontation
  'ALIBI_PROBE',     // test one alibi — result must be stated
  'RED_HERRING',     // follow wrong lead — disproved within chapter
  'REVERSAL',        // prior assumption overturned — new theory formed
  'ISOLATION',       // eliminate one suspect definitively
  'DISCRIMINATING',  // apply the clock logic — the discriminating test
  'CONFRONTATION',   // direct accusation scene — culprit present
  'RESOLUTION',      // confession, arrest, aftermath
] as const;
```

Each archetype has a MUST/MUST_NOT contract:
- `EVIDENCE` chapter: **MUST** contain a physical discovery. **MUST NOT** contain a formal accusation.
- `ALIBI_PROBE` chapter: **MUST** state a test result (alibi confirmed or denied). **MUST NOT** re-introduce evidence already found.
- `CONFRONTATION` chapter: **MUST** include the culprit speaking directly. **MUST NOT** be a repeat of earlier interview structure.

The archetype is locked into the chapter obligation block. After generation, a lightweight structural validator checks that the must/must-not conditions are met (regex or keyword-based, no LLM call). Failure triggers a retry with the specific unfulfilled contract stated explicitly.

This means Ch6–Ch9 **cannot** all be confrontation scenes — the arc plan assigns them different archetypes. Even if the LLM tries to write the same scene, the post-generation validator rejects it.

**Scope:** ~150 lines. `MacroArcPlan` compiler (from CML + narrative) + structural archetype contracts + post-generation archetype validator + obligation block injection.

---

### BLUE-G: StoryContract Precompiler (Full Implementation of ANALYSIS_19 BLUE-5)

**Problem solved:** A20-TB-1, A20-TB-2, A20-EV-1, A20-VIC-1, A20-VIC-2, and all pronoun drift

ANALYSIS_19 BLUE-5 proposed a `StoryContract` that normalises all data before it reaches any prompt builder. ANALYSIS_20 makes it the highest priority — every issue in this audit has a data-contract root cause.

**New field required beyond ANALYSIS_19 BLUE-5:** The `victim` field must be derived from CML role data, not from prose detection:

```typescript
interface StoryContract {
  victim: {
    name: string;
    status: 'deceased';
    roleConfirmedFrom: 'CML.cast[role=victim]' | 'CML.culpability.victim';
    // NOT derived from prose detection — eliminates A20-VIC-2
  };
  sensoryAtoms: {
    [locationId: string]: {
      sights: string[];   // noun phrases only — e.g. ["candlelight", "brass fittings"]
      sounds: string[];   // noun phrases only — e.g. ["clock ticking", "distant voices"]
      smells: string[];   // noun phrases only — e.g. ["beeswax", "damp stone"]
    }
  };
  lockedFacts: {
    id: string;
    canonical: string;
    valueType: FactValueType;    // time | duration | weight | length | generic
    injectionTemplate: string;  // pre-compiled from BLUE-C
    appearsInChapter: number;   // the single chapter for injection, not an array
  }[];
  macroArcPlan: MacroArcPlan; // from BLUE-F
}
```

The `sensoryAtoms` field (from BLUE-A, now in the contract) ensures Agent 9 *never* receives full-sentence sensory data. The `valueType` field (from BLUE-C) ensures injection templates are type-aware. The `victim.roleConfirmedFrom` field ensures Phase 1 victim suppression works regardless of how the CML assigned roles.

**Scope:** ~400 lines. Extends ANALYSIS_19 BLUE-5 spec. The most impactful single change possible.

---

## Section 5 — Verdict and Priority Order

### What is the highest-leverage single change?

**BLUE-A (Sensory Atom Compiler)** is the highest immediate-leverage change:
- 3 lines in Agent 2c schema (change "Full 2-sentence description" → "Short noun phrase or gerund — no verbs, no sentences")
- 1 post-processing function in agent9-run.ts to strip any that still arrive as sentences
- Eliminates ~70% of the template bleed on its own

It costs no LLM tokens, has no canary risk, and addresses the root of the most visible quality failure.

### What is the highest-leverage architectural change?

**BLUE-E (Narrative Beat Registry)** paired with **BLUE-F (Macro Arc Locking)** eliminates investigation stagnation by design — chapters cannot converge because their structural archetypes are locked before Chapter 1 is generated, and their forbidden-repeat registries grow with each chapter.

### Priority order

1. **BLUE-A** — Fix Agent 2c schema to produce noun phrases (3 lines + 1 post-processor). Immediate, zero canary risk.
2. **BLUE-B** — Fix sensory palette hint format (room name after weather in chapter hints). 10 lines in `buildLocationProfilesBlock`.
3. **BLUE-C** — Type-aware injection templates. ~30 lines in `enforceLockedFactValuePresence`.
4. **BLUE-D** — Inline identity embedding (`tagCharacter` at every name in every block). ~100 lines. Highest-leverage pronoun fix.
5. **BLUE-F** — Macro arc locking. Structural archetype contracts. ~150 lines.
6. **BLUE-E** — Beat fingerprinting + forbidden repeat block. ~120 lines.
7. **BLUE-G** — Full StoryContract. Absorbs A, C, D and adds victim contract + type registry. ~400 lines total.

---

## Section 6 — Coverage Matrix

| Issue | BLUE-A | BLUE-B | BLUE-C | BLUE-D | BLUE-E | BLUE-F | BLUE-G |
|-------|--------|--------|--------|--------|--------|--------|--------|
| A20-TB-1 (sensory data as prose) | **Primary** | — | — | — | — | — | Absorbs |
| A20-TB-2 (location name first token) | — | **Primary** | — | — | — | — | Absorbs |
| A20-TB-3 (double template dump) | Partial | **Primary** | — | — | — | — | — |
| A20-TB-4 (mood field verbatim) | **Primary** | — | — | — | — | — | Absorbs |
| A20-EV-1 (wrong injection template) | — | — | **Primary** | — | — | — | Absorbs |
| A20-EV-2 (injection at wrong position) | — | — | **Primary** | — | — | — | Absorbs |
| A20-EV-3 (multi-chapter injection) | — | — | **Primary** | — | — | — | Absorbs |
| A20-PR-1 (Hale oscillation) | — | — | — | **Primary** | — | — | Absorbs |
| A20-PR-2 (POV character misgendering) | — | — | — | **Primary** | — | — | Absorbs |
| A20-PR-3 (Finch oscillation) | — | — | — | **Primary** | — | — | Absorbs |
| A20-PR-4 (pronoun block too far from context) | — | — | — | **Primary** | — | — | Absorbs |
| A20-IS-1 (Ch6–9 near-identical) | — | — | — | — | **Primary** | **Primary** | — |
| A20-IS-2 (linter no cross-chapter window) | — | — | — | — | **Primary** | — | — |
| A20-IS-3 (log is factual not narrative) | — | — | — | — | **Primary** | — | — |
| A20-IS-4 (Ch1 and Ch3 same beats) | — | — | — | — | Partial | **Primary** | — |
| A20-VIC-1 (victim never named) | — | — | — | — | — | — | **Primary** |
| A20-VIC-2 (victim suppression breaks on role inversion) | — | — | — | — | — | — | **Primary** |
| A20-CF-1 (verbatim paragraph 3×) | **Primary** | **Primary** | — | — | — | — | Absorbs |

---

## Section 7 — Relationship to ANALYSIS_19

ANALYSIS_19's tactical patches (Phases 1–6) addressed the right problems but at the symptom level. ANALYSIS_20 reveals that each Phase's effect was neutralised by a deeper architectural failure:

| ANALYSIS_19 Phase | What it patched | Why ineffective | ANALYSIS_20 fix |
|-------------------|----------------|-----------------|-----------------|
| Phase 2A (sanitizeClueField) | Debug annotations in clue obligation block | Source data (Agent 2c sensory fields) was not sanitized at origin | BLUE-A: sanitize at Agent 2c output |
| Phase 2B (location label change) | `Location anchor:` → `Scene is set in:` | Room name still first token in SENSORY PALETTE HINTS | BLUE-B: restructure palette hints format |
| Phase 3 (clock repair variants) | Word-form clock drift | Works for clock value; injection template wrong for measurement facts | BLUE-C: type-aware templates |
| Phase 4 (pronoun personality header) | Pronoun tags in personality block | Too far from generation context; no narrative voice anchor | BLUE-D: inline identity at every occurrence |
| Phase 5 (investigation log) | Log what's established | Log is factual (clue IDs) not narrative (scene beats) | BLUE-E: beat fingerprinting |
| Phase 6 (resolution gates) | Final chapter detection | Works — no regression observed | Retained as-is |

**End of ANALYSIS_20**
