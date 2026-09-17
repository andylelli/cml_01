# WP-002 — USING THE COMPETITOR STORY TO IMPROVE OUR MYSTERY GENERATOR

**An integration assessment of a reader's parameter guide: romance, social texture, humour, prose
polish and investigative structure, mapped onto what this pipeline already does, measured against its
archive, and reduced to a kit.**
2026-09-17 · internal figures MEASURED from `data/store.json` (66 projects, 58 with clues) and the read
ledger · the reader's guide reproduced in §11 · external sources in §9

---

## ABSTRACT

A competitor's AI-written mystery was read by the same external reader who scores ours, and the reader
wrote back a parameter guide: fourteen top-level controls, a romance module, a social-world module, a
humour table, a review checklist, four presets and a worked parameter block. The story itself is not
on disk (**ASSUMED**: this paper works from the reader's account of it, not from the text). The reader's
own summary of why the competitor's book works is worth keeping whole: *it is not only an
investigation.* It carries romance, social hierarchy, professional competence, institutional stakes,
humour and a reparative aftermath, and the reader's advice is *"not to copy the plot, but to
parameterize the craft moves."*

**The claim.**

> **The guide names the right categories and mostly the wrong controls.** The seven strengths it
> lists in the competitor's book are, one for one, the categories this project's readers have never
> given a 9 (WP-001 §1). But of its fourteen top-level parameters, six are stated as rates or scores,
> which this model does not comply with; four already exist here as countable operations and did not
> move the reader's mark on their own; one — genre blend — is a different product; and **three are
> genuinely missing and are where the marks are**: professional expertise as the engine of clue
> discovery, a social stake per suspect that is not the alibi, and the scope of the aftermath's
> repair. A relationship arc is a fourth, buildable as a band and not a slider, and it is the one that
> most changes the genre contract, so it goes last and defaults off.

Stated so it can be wrong: **a matched pair carrying K1 and K2 of the kit (§5) should move the
reader's `Mystery clues / evidence logic` and `Character Life / Relationship Richness` marks by at
least one point each against the same upstream.** If it does not, the missing controls were not the
lever and this paper's ordering is wrong.

**The measurements that decide the ordering** (all MEASURED, §3):

| what the reader wants | what the archive holds |
|---|---|
| the protagonist's professional skill unlocking ≥3 clues | **8 of 1,167** archived clues name a word of the detective's occupation, in 2 of 58 projects; the clue schema has **no field** for who discovers a clue or by what skill |
| a distinct expertise per protagonist | **31 of 58** detectives are a *Retired Schoolteacher* — the worked example in Agent 2's own amateur-sleuth line, reproduced (A_67's rule, again) |
| a romantic or relationship arc that advances the case | **758** relationship pairs already generated, **233** involving the detective, **162** at high tension, **85** carrying romance or marriage vocabulary — and no chapter is ever asked to do anything with one |
| humour that is character-specific | already a parameter (`humourLevel`, four bands, shapes owned by register); the last read still marked Humour / Wit **6/10** |
| characters with a life outside the alibi | formative incident, depth beat, private longing, tic ban all built; the last read: *"most characters still function mainly as alibi holders"*, **6/10** |

Sections 1–2 place the guide against the pipeline. Section 3 is the measurements. Section 4 applies
the compliance law to every control the reader proposed. Section 5 is the kit, ordered by evidence,
each item with its flag, its instrument and its falsifier. Section 6 renders the reader's presets in
this project's own parameter file. Section 7 is what not to do, with the receipt for each.

---

## 1. WHAT THE READER SAW, IN THIS PROJECT'S TERMS

The reader's seven strengths, against the category each would be marked under and this project's
best mark ever in that category (WP-001 §1, 34 full-table reads; the two newest categories were added
to the rubric at this project's request in September and have two reads):

| competitor strength (reader) | rubric category it lands in | our best ever | our last read (seed 50862) |
|---|---|---|---|
| opening voice — theme and social conflict, not weather or a body | Opening hook | 8 | 7 |
| professional competence solves document and material clues | Mystery clues / evidence logic | 9 (once) | **5** |
| romantic/social tension over method and ethics | Character clarity · Dialogue | 8 · 8 | 7 · 7 |
| a social world with institutions, money, press, reputation | Atmosphere / setting · Premise | 9 · 9 | 8 · 8 |
| human cost — witnesses treated as people | Character Life / Relationship Richness | 6 (n=2) | 6 |
| humour from status, expertise and precision | Humour / Wit | 6 (n=2) | 6 |
| an aftermath that changes titles, trusts, homes, a future | Ending / reveal | 9 (twice) | 6 |

**INFERRED from the two tables together:** the competitor is strong in exactly the categories where
this project is capped at 8 or below and has stayed there — clues, character, dialogue, the ending
and the two new categories. It is not obviously stronger in premise or atmosphere, where this project
already reaches 9. That is the useful shape of the comparison: the competitor's book is not better
everywhere; it is better where the reader has been telling this project it is weak, and the reader
has now said what it is doing instead.

---

## 2. THE CROSSWALK — EVERY PROPOSED CONTROL AGAINST WHAT EXISTS

The reader's fourteen top-level parameters and six social sub-parameters, each with its form (an
**operation** the model can count, or a **statistic** it cannot), what this pipeline already has,
and a verdict. Flags are as registered in `architecture/FLAG-AUDIT.md`; states are from `.env.local`
on 2026-09-17.

| reader's control | form | what exists here | state | verdict |
|---|---|---|---|---|
| `GENRE_BLEND` (cosy / fair-play / romantic suspense / social thriller / hybrid) | label | the pipeline IS a fair-play generator: Agent 6's fair-play report, the blind reader, geometry (7.5), the reveal contracts all assume it | fixed | **DECLINE** (§7.1) |
| `ROMANCE_INTENSITY` 0–5 | scale | nothing; 233 detective relationship pairs are generated and reach Agent 9 as text under `AGENT9_RELATIONSHIP_CONTENT` (A_89 D1) | — | **BUILD as a band** (K5) |
| `ROMANCE_FUNCTION` (banter / ethical conflict / forced collaboration / protective restraint / …) | operation set | nothing | — | **BUILD** with K5 |
| `SOCIAL_WORLD_DENSITY` low/med/high | statistic | `storyAngle` (`scripts/run-params.mjs` STORY_ANGLES, 2026-09-07) gives two characters an occupation, history or stake from a named world; `locationPreset`; the `authority` axis | ON | **CONVERT** to countable stakes (K2) |
| `PROFESSIONAL_EXPERTISE_CLUES` 1–5 | operation | `occupation` on every cast member; the amateur-sleuth line asks for *"the specific skill … that gives them a unique angle"*; **no** clue field names a discoverer or a skill | — | **BUILD** (K1) |
| `HUMOUR_MODE` (none / light dry wit / brittle drawing-room / romantic banter / social satire) | label over operations | `humourLevel` ∈ none/dry/classic/sharp (`humour-level.ts`, A_92); nine per-character styles (`HUMOUR_STYLES`); shapes owned by register (`AGENT9_SHAPE_BY_REGISTER`, A_95 M4) | ON | **EXISTS**; the tonal families become prerequisites (K4) |
| `HUMOUR_FREQUENCY` low/med/high | statistic | the band already resolves to `beatEvery` — which chapters carry a wit beat (every / every third / none) | ON | **EXISTS as an operation**; decline the rate |
| `CHARACTER_LIFE_SCORE_TARGET` 1–10 | score | `AGENT2B_FORMATIVE_INCIDENT` (A_91 F2), `AGENT9_DEPTH_BEAT` + `AGENT9_DEPTH_TRAIT_ONLY` (A_96 F9), `privateLonging`, `physicalMannerisms`, `AGENT2B_TIC_TEMPLATE_BAN`, `AGENT2_SHARED_HISTORY_EVENT` | ON | **EXISTS as operations**; decline the score (§7.3) |
| `WIT_PROFILE_BY_CHARACTER` (investigator dry · suspect brittle · worker blunt · elite polished · romantic lead precise) | operation | per-character `humourStyle`/`humourLevel` assigned by Agent 2b under the band's directive; shapes by register | ON | **EXISTS**; add by-ROLE defaults (K4) |
| `EVIDENCE_CHAIN_TYPE` (physical / documentary / testimony / institutional / mixed) | label | `Clue.category` ∈ temporal/spatial/physical/behavioral/testimonial; `evidenceType`; `supportsInferenceStep` — the inference path is a ladder by construction | fixed | **EXISTS**; "documentary" and "institutional" are not categories — note only |
| `FAIR_PLAY_STRICTNESS` loose/moderate/strict | label | strict, everywhere, by design; A_89 B2: *"fair play is the one thing the pipeline may not trade away"* | fixed | **EXISTS**; decline loosening (§7.2) |
| `HUMAN_COST_VISIBILITY` low/med/high | statistic | aftermath job C (one memory of the victim that is not evidence); `AGENT9_CLEARING_HUMAN_BEAT` (clear the person, not the alibi) | ON | **CONVERT** to one witness operation (K2.3) |
| `AFTERMATH_SCOPE` (personal / relational / household / institutional / legal / public) | operation set | `AGENT9_AFTERMATH_POSITIVE_JOB` A–D (settled outcome, two survivors two changes, one memory, one place resuming); `consequenceFor` on the `revelation` beat (A_95 M6); `AGENT9_AFTERMATH_SCENE_PURPOSE` | ON | **BUILD the scope** (K3); the shapes exist at household scale only |
| `PROSE_POLISH_LEVEL` plain/atmospheric/literary-commercial/ornate | label | the LLM polish pass; `AGENT9_REGISTER_BAN` (A_95 M1) names the chapter's own worst sentences; machine-register rate is the only validated predictor (ρ −0.60) | ON | **DECLINE as a parameter** (§7.4) |
| `SOCIAL_ARENA` (hotel / manor / theatre / …) | label | `locationPreset` + `storyAngle` | ON | **EXISTS** |
| `STATUS_PRESSURE` (reputation, inheritance, class, patronage, career, marriage, institution survival) | operation | `AGENT2_MOTIVE_KIND_ROTATION` (8 kinds, culprit only); `stakes` and `personalStakeInCase` on every profile, 54% of which mention the crime (A_91 §2) | ON | **BUILD** the per-suspect social stake (K2.1) |
| `PUBLIC_GAZE` (none / gossip / press / police / donors / board / …) | operation | nothing | — | **BUILD**, optional field of K2 |
| `INSTITUTIONAL_STAKES` (estate, school, theatre, foundation, parish, museum, company) | operation | `storyAngle` names a world; nothing says what the crime threatens beyond one person | — | **BUILD** (K2.2) |
| `SOCIAL_LANGUAGE_STYLE` (clipped formal / brittle witty / bureaucratic / blunt / aristocratic deadpan) | operation | Agent 2b's VOICE DISTINCTNESS block already spreads registers *("one terse and clipped, one florid and digressive, one warm and plain-spoken …")* | ON | **EXISTS** |
| `REPAIR_TARGET` (title restored / trust rebuilt / institution changed / record corrected / victim honoured) | operation | see `AFTERMATH_SCOPE` | — | **BUILD** with K3 |
| opening voice — *"theme + setting + wound + voice"* in the first line | operation | `AGENT9_OPENING_FRESHNESS`, `AGENT9_OPENING_STYLE_PER_STORY`; A_82 P1 removed the templated opener; X94/X95 removed the coded ones | ON | **PARTLY**; the wound is not asked for (K6) |

**Tally.** Fourteen top-level controls: six rates or scores, four existing operations, three missing,
one declined. The six rates are not discarded — §4 converts each to a countable ask, and three of them
(social density, human cost, romance) become K2 and K5.

---

## 3. FIVE MEASUREMENTS THAT DECIDE WHAT TO BUILD

Every figure below was computed on 2026-09-17 over `data/store.json` by a script that read each
project's latest `cast` and `clues` artifacts. A negative result from a fresh probe is a claim about
the probe (CLAUDE.md) — so each probe was checked against a known positive: the occupation matcher
finds the seven `Senior Chemist` clues it should, and the relationship reader finds the 758 pairs the
A_85 F6 work counted.

### 3.1 Expertise never reaches a clue — and 31 detectives share one occupation

| | |
|---|---|
| projects with a cast and a clue set | 58 |
| clues | 1,167 |
| clues whose text names a word of the DETECTIVE's occupation | **8** (in 2 projects) |
| clues whose text names a word of ANY cast member's occupation | 148 (13%) |
| fields on an archived clue | `id, category, description, observable, inference, pointsTo, sourceInCML, placement, criticality, evidenceType, supportsInferenceStep` — **none names a discoverer or a skill** |
| detectives with the role *amateur sleuth / civilian investigator* | 44 of 58 |
| of those, occupation *Retired Schoolteacher* | **31** |

**MEASURED, and two findings in one table.** First: the reader's *"professional competence as the
engine of clue discovery"* is not a thing this pipeline can do badly — it is a thing it does not do.
No field carries it, and the prose has no instruction to stage a discovery through a skill; the 8
clues that touch the detective's occupation belong to the two books whose detective was a *Senior
Chemist at the Hotel Laboratory*, where the case itself was chemical.

Second: the amateur-sleuth line in `agent2-cast.ts` offers *"a retired schoolteacher, a nosy vicar, a
sharp-witted spinster, a travelling journalist, a young doctor, a gentleman of leisure"* as
illustration, and **the first item was taken 31 times in 44**. This is A_67's rule at the level of a
character's whole profession: illustrative content in a prompt is reproduced, not adapted. It means
that even where a skill lever existed, seventy per cent of the corpus would be exercising a
schoolteacher's, and it fixes the form of K1 before it is designed — the skill must be DERIVED from
the story angle and the axis, and the prompt must carry no example of one.

### 3.2 The relationship arc's raw material is already generated

| | |
|---|---|
| projects with a cast | 66 |
| relationship pairs (`cast.relationships.pairs`) | 758 |
| pairs that involve the detective | **233** (3.5 per book) |
| pairs at `tension: high` | 162 |
| pairs whose `relationship` or `sharedHistory` uses romance or marriage vocabulary | **85** (11%) |
| chapters asked to do anything with a pair | 0 |

**MEASURED.** Agent 2 already writes the detective into three or four relationships per book, a
quarter of all pairs are at high tension, and one in nine carries a courtship, an engagement, an
affair or a marriage. Since A_89 D1 (`AGENT9_RELATIONSHIP_CONTENT`) the relationship sentence reaches
every Agent 9 prompt as content rather than being discarded at 40 characters — but it reaches the
prompt as BACKGROUND. Nothing is a per-chapter ask, in the form the wit beat and the depth beat take:
*this chapter, this pair, one thing changes.* That is the whole of K5's design, and it is why K5 costs
little to build: the data exists, the delivery pattern exists, only the operation is missing.

### 3.3 Humour is already a parameter, and the mark did not move

| instrument | canon (11 novels) | ours (20 books) | run 95041 (band `classic`) |
|---|---|---|---|
| wit density per 10k words (`wit-density.ts`) | median 41.4, floor 20.6 | median 11.4 | **29.6** |

**MEASURED** (A_92, A_96 §5.2). The band, the wit beat, the two shapes and the register-owned shapes
tripled the instrument between seed 50862 and seed 95041. The reader's Humour / Wit mark on the last
read book stayed at 6: *"detectable dry wit, especially Bertram/Nora/Theodora, but uneven and
sometimes mechanical."* Two things in the reader's guide address exactly the *mechanical* half. The
humour-by-role table (investigator dry · elite polished · worker blunt · expert pedantic · romantic
lead literal) is a rule for WHO gets which register, which Agent 2b currently decides freely under
the band's directive; and the guide's placement rule — *"humour should usually appear under pressure:
interrogation, gala, evidence handling, social confrontation, aftermath"* — is a WHERE, which the wit
beat leaves to the model. Both are operations. Neither is built (K4).

### 3.4 Character life: the machinery exists and the reader still sees alibi holders

**MEASURED** (A_91 §2, A_93): before the formative incident existed, 3% of 378 archived characters
carried a past-time marker and 1 of 378 carried origin, incident and stance together; 54% of
`personalStakeInCase` values mention the crime. After it: the beats reach the page (A_91 telemetry),
and the reader on seed 50862 still wrote *"most characters still function mainly as alibi holders"*.

**INFERRED.** The formative incident is a wound the character HAD; the reader's `STATUS_PRESSURE` is
a thing the character stands to LOSE NOW, socially, that is not the murder charge — reputation,
patronage, a marriage, a post, an institution's survival. The pipeline has the first and not the
second, and the second is what makes a suspect behave like a person under investigation rather than
like an alibi with a name. That is K2.1, and it is an operation: one named thing, per suspect.

### 3.5 The aftermath does its four jobs at household scale

**MEASURED** (A_86 items 1 and 5; A_95 M6): `AGENT9_AFTERMATH_POSITIVE_JOB` asks for four countable
things — the settled outcome opens the chapter; two survivors, two changes; one memory of the victim
that is not evidence; one place resuming ordinary use — and `consequenceFor` on the `revelation` beat
names whose life the closing scene shows changed. The reader's aftermath list — *"titles, trusts,
names, homes, the couple's future"* — is the same shape one scale up: an institution, a public record,
a legal standing. Nothing lets a run ask for that scale (K3).

---

## 4. THE COMPLIANCE LAW, APPLIED TO THE GUIDE

**This model complies with OPERATIONS and ignores STATISTICS** (CLAUDE.md; VoiceSpec asked for
22.0-word sentences and got 15.86 in 0 of 10 chapters; asked for 19.5 got 15.01; asked for
semicolons got 5→13). Every rate the reader proposes is therefore restated as the countable thing that
would produce it, before anything is built:

| reader's rate or score | the operation that stands in for it |
|---|---|
| `ROMANCE_INTENSITY` 0–5 | a **band** — none / subtext / attraction / resolved — each resolving to which beats are permitted (a look held, a vulnerability exchanged, a touch, a choice made) and in which chapters, exactly as `humourLevel` resolves to `beatEvery` |
| `HUMOUR_FREQUENCY` low/med/high | already `beatEvery` ∈ {0, 3, 1} |
| `CHARACTER_LIFE_SCORE_TARGET` 8+ | per chapter: ONE trait shown in ordinary business (built); ONE social stake made visible for ONE named suspect (K2) |
| `SOCIAL_WORLD_DENSITY` high | ONE institution the crime threatens, named at Agent 1/3; ONE thing each suspect stands to lose socially, named at Agent 2b; ONE public-gaze channel if the story has one (K2) |
| `HUMAN_COST_VISIBILITY` high | ONE scene per book in which a witness's testimony costs THEM something, shown (K2.3) |
| `PROFESSIONAL_EXPERTISE_CLUES` 3 | already a count — keep it: three clues carry `unlockedBy` (K1) |
| `PROSE_POLISH_LEVEL` literary-commercial | none; the polish pass and the register ban already name specific sentences to rewrite, which is the only form that has moved the register rate |
| `AFTERMATH_SCOPE` institutional | ONE record, title, post or institution shown changed in the final chapter (K3) |

The reader's own checklist already understands this: *"cap repeated catchphrases"*, *"require that
every romantic beat also changes trust, evidence access, or character agency"*, *"at least 3 clues"*
are operations, and they survive the conversion untouched.

---

## 5. THE KIT

Ordered by the evidence in §3, not by the reader's emphasis. Every item is flag-gated, default OFF,
registered in `FLAG-AUDIT.md`, read at call time (ADR-0004), and every new run parameter must be added
to `ALLOWED_INPUT_KEYS` in `scripts/canary-loop/canary-input-overrides.mjs`, which is a silent filter
that dropped `humourLevel` and `seed` for a run each before A_95 found it. Costs are in prompt tokens
against a 56,000 ceiling with the fixed prefix at ~23,600 by chapter 10 (A_91); a run is ~£1.15 and a
matched pair ~£0.45. No item carries a worked example in its prompt — §3.1 is the receipt.

### K1 — Professional expertise as the engine of clue discovery

*The reader:* "Give each protagonist a domain skill and require it to unlock at least 3 clues. The
skill must affect what they notice, how they speak, what tools they use, and how they disagree with
the investigator. Do not treat the profession as biography only."

| | |
|---|---|
| Agent 2 (`AGENT2_PROTAGONIST_SKILL`) | the detective — and, when `detectiveType` is `amateur`, ONE second cast member — gets a `skill` field: a concrete competence with a vocabulary, three tools or materials it handles, and one thing it lets them notice that nobody else would. DERIVED from `storyAngle` and `primaryAxis` (a spatial case wants a surveyor's or a stage carpenter's skill; an authority case a clerk's or an archivist's); the prompt names the derivation and **no example** |
| Agent 5 (`AGENT5_CLUE_UNLOCKED_BY`) | a new optional field on `Clue`, `unlockedBy: { name, skill }`, required on at least THREE essential clues; the `observable` of such a clue must be something only that skill can read (a material behaviour — ink feathering, a plaster patch, a mis-set bearing) |
| Agent 9 (`AGENT9_EXPERTISE_DISCOVERY`) | for a chapter that owns an `unlockedBy` clue, the clue obligation says: the discovery is STAGED through the skill — the character uses a named tool or handles a named material, says one thing in the skill's vocabulary, and the investigator (if another character) has to be told what it means. Three countable things, no example |
| instrument | deterministic: for each `unlockedBy` clue, does the paragraph that carries the clue's key terms also carry ≥2 of the skill's vocabulary tokens? Reported per book beside the wit and turn lines. Known-positive: the two Senior Chemist books score >0 today |
| prediction | the next read's `Mystery clues / evidence logic` (5 on the last two reads) rises by ≥1; the instrument reads ≥3 of 3 on a run with the flags on |
| falsifier | instrument ≥3/3 and the mark unchanged over two reads: the skill reached the page and did not matter, and K1 is a prose lever mis-sold as a clue lever |
| cost | ~120 tokens per chapter that owns such a clue; one Agent 2 field; one Agent 5 field |
| risk | the skill becoming the murder method (a chemist's poison); the Agent 2 line says background, not mechanism, as the story-angle line already does |

**Why first.** It is the only item on the list that touches the category the reader marks lowest
(clues, 5/10 twice), it is a count already, and the archive says it has never been tried.

### K2 — Social stakes: what each suspect stands to lose, and what the crime threatens

*The reader:* "Each suspect or witness should have something to lose socially, not only legally."
"Set social-density level and required institutions." "Require victim/witness dignity scenes and
non-extractive testimony."

| | |
|---|---|
| K2.1 Agent 2b (`AGENT2B_SOCIAL_STAKE`) | a profile field `standsToLose`: ONE named thing, social not legal — a post, a patron, an engagement, a licence, a place in a household — and WHO could take it. Must not be the murder charge and must not restate `personalStakeInCase` (the restatement check A_89 D1 uses for relationships, reused) |
| K2.2 Agent 3 (`AGENT3_INSTITUTION_AT_STAKE`) | `constraint_space.social.institution_at_stake`: the ONE institution the crime threatens beyond a person (the estate, the school, the theatre, the hotel's licence), and what happens to it if the truth is buried and if it is told. Optional `public_gaze`: the ONE channel that watches (gossip / press / board / police). Both reach Agent 9 as run-stable context |
| K2.3 Agent 9 (`AGENT9_STAKE_BEAT`) | per investigation chapter, ONE named non-culprit's `standsToLose` is shown ON THE PAGE as a thing they do or refuse to do because of it — rotated by chapter number like the depth beat, never the same suspect twice; and ONCE per book, a witness's testimony visibly costs them something (the human-cost operation) |
| Agent 9 (aftermath) | the institution's fate is one of the four aftermath jobs' allowed subjects (feeds K3) |
| instrument | A_91-style telemetry: for each suspect, do the distinctive words of `standsToLose` appear in a chapter where the suspect is named? Reported as `n/N stakes reached the page` |
| prediction | `Character Life / Relationship Richness` (6, 6) rises by ≥1; the reader's sentence *"function mainly as alibi holders"* does not recur |
| falsifier | stakes reach the page (≥5 of 6) and the mark holds at 6 across two reads |
| cost | ~80 tokens per chapter; one Agent 2b field; two case fields; a schema entry (optional, so a case without them still validates) |
| relation to open work | A_95 M5's dated motive has not arrived at the page; `standsToLose` is the same ask on the suspects that M5 makes of the culprit, and the two should be measured on one run |

### K3 — Aftermath scope

*The reader:* "The ending changes titles, trusts, names, homes, and the couple's future." "Add
restorative resolution parameter: personal, legal, institutional, relational."

| | |
|---|---|
| parameter | `aftermathScope` in `run-params.mjs`, drawn from {household, relational, institutional, public}, `--aftermath` to pin; `household` is today's behaviour and is weighted 2 of 5 so half the corpus stays comparable |
| Agent 7 | `consequenceFor` (A_95 M6) gains a sibling on the `revelation` beat: `repairTarget` — the ONE thing outside a person that the closing scene shows changed, chosen to match the scope |
| Agent 9 (`AGENT9_AFTERMATH_SCOPE`) | the positive job gains **E** for scopes above household: ONE record, title, post, lease, trust or institution shown changed — a document signed, a name struck or entered, a door reopened under a new sign — as a physical action in the final chapter. Job B's two survivors must include the `consequenceFor` character |
| instrument | does the final chapter carry the distinctive words of `repairTarget`? One line |
| prediction | `Ending / reveal` (6 on the last read; 9 twice ever) rises by ≥1 on scopes above household |
| falsifier | the ending mark unchanged while the instrument says the repair reached the page |
| cost | ~60 tokens, final chapter only |

### K4 — Humour by role, and where it is allowed to happen

*The reader:* the humour-by-role table; "humour should usually appear under pressure"; "cap repeated
catchphrases."

| | |
|---|---|
| Agent 2b (`AGENT2B_STYLE_BY_ROLE`) | defaults by ROLE, applied unless the band forbids the style: investigator → `dry_wit`; the socially highest character → `polite_savagery`; the working character → `blunt`; the K1 expert → `deadpan` (the guide's "professional pedantry" is deadpan about tools and terms); a K5 romantic lead → `understatement`. The band still decides which styles exist at all |
| Agent 9 | the wit beat's placement is named: the beat is asked for in the chapter's scene of PRESSURE — an interview, a confrontation, evidence handled — and skipped elsewhere, in the same sentence that already skips it at a body, a grief or the mechanism |
| what is NOT added | the guide's tonal families as a mode. "Romantic banter" is K5's shapes between the pair; "professional pedantry" is K1's expert in `deadpan`; "social satire" is K2's stakes in `polite_savagery`. Each family is a consequence of a lever, not a lever |
| instrument | `wit-density.ts` unchanged; the reader's Humour / Wit mark |
| prediction | the reader's word *"mechanical"* does not recur; wit density ≥ 41 (canon median) on a `sharp` run |
| falsifier | density ≥ 41 and the mark ≤ 6: the instrument counts shapes and the reader is marking something the shapes do not carry (A_94 §8 already suspects this) |
| cost | none at Agent 9 beyond a clause; the by-role defaults are a table in Agent 2b |

### K5 — A relationship arc, as a band

*The reader:* "The couple do not stop the plot to become romantic. They become intimate through
method: examining papers, arguing over ethics, preserving wet ledgers, choosing when to trust." "Every
romantic beat must either reveal a wound, shift trust, or change access to evidence."

| | |
|---|---|
| parameter | `relationshipArc` ∈ none / subtext / attraction / resolved (**never a 0–5**); default `none`, so nothing changes for a caller that does not ask, exactly as `humourLevel` defaults to `classic` |
| Agent 2 (`AGENT2_RELATIONSHIP_ARC`) | when the band is above `none`: ONE pair is designated `arcPair` — the detective and one non-culprit — with a `method_disagreement` (the reader's *ethical conflict*: private preservation vs chain of custody; discretion vs the record; the household vs the law) and a `function` drawn from {forced_collaboration, protective_restraint, rivals_to_allies}. The pair is chosen from the pairs Agent 2 already writes (§3.2), so no new relationship is invented. The culprit is never the arc partner unless `storyAngle` asks for a betrayal plot — a rule, because a reader who has been given a romance and then a culprit has been given two books |
| Agent 9 (`AGENT9_RELATIONSHIP_BEAT`) | per chapter from the second to the penultimate, ONE beat for the pair, permitted by band: `subtext` — a disagreement about method, and one of them noticing the other's competence, and nothing said; `attraction` — adds one exchange of a wound each (each character's `formativeIncident` is the material, which is what that field was built for), one moment of physical closeness that arises from the WORK (over a document, a ledger, a lock); `resolved` — adds a choice made in the final chapter with an exit in it (the reader's *"lease with equal notice rights; love without trapping"*). Every beat must do ONE of three things — change trust, change access to evidence, or change who decides — and the prompt says which the chapter owes. No example lines: the reader's are exactly the shape A_67 says would be reproduced |
| validation | the pair's beats must not name the register ("tension", "chemistry", "attraction") in narration — the same ban the wit shapes carry; the arc partner cannot be cleared by the detective's testimony alone (fair play) |
| instrument | per chapter, does the pair appear in a paragraph together with a trust/access/decision verb? `n/N chapters` beside the wit line; and the read's `Character Life / Relationship Richness` |
| prediction | on a `subtext` run, Dialogue and Character Life each rise by ≥1; on `attraction`, Character Life by ≥2 |
| falsifier | the beats reach the page and `Mystery clues` falls: the arc competed with the puzzle, which is the genre-contract risk this item was placed last for |
| cost | ~150 tokens per chapter; the largest in the kit |

**Why last, and why a band.** The competitor's book is, on the reader's own account, closest to
*"glossy romantic suspense"*; this project's readers score fair-play Golden Age. The library holds
the transfer evidence (§9): *The Moonstone* and *The Sign of the Four* both carry a courtship that
advances through the investigation and resolves in the last chapter, so the arc is inside the canon
and not a genre change — at `attraction` and below. `resolved` is the competitor's register, and it
should be a read of its own against a `none` pair before it is ever the default.

### K6 — The opening line owes a wound

*The reader:* "Parameterize a first-line goal: theme + setting + wound + voice."

Small, and cheap: the chapter-1 obligation already forbids opening on a location or the weather
(A_82 P1) and asks for a character doing one concrete thing. Add ONE countable clause under
`AGENT9_OPENING_WOUND`: the first paragraph shows a named character WANTING or REFUSING something
that costs them, before any death is mentioned. No example (the previous example was copied ten of
ten times). Instrument: the reader's Opening hook mark (7; best ever 8, never 9 — WP-001).

### K7 — The reader's checklist, as sub-questions

The reader proposes ten review questions and eight updated categories. **Do not add categories**
(§7.6). Add the ten questions to the read prompt as sub-checks under the categories they belong to,
which is how Humour / Wit and Character Life arrived. Two of them are already instruments here:
*"scaffold leaks such as 'the investigation pivoted'"* is A_84's finding and the machine-register
instrument; *"can the key parameters be read backward from the finished story?"* is the
`run-params.json` sidecar (A_86 item 72) plus the one test this paper adds to the ship-check — **a
parameter that cannot be read back from the book did not reach the page**, which is how VoiceSpec
was found dead (`voice-spec-is-a-dead-lever`).

### Order, bundles and reads

| bundle | levers | chapters touched | how it is settled |
|---|---|---|---|
| 1 | K1 + K2 | investigation chapters (2–8) | a matched pair on a seed whose case has a physical mechanism; then a read scored by category |
| 2 | K3 + K4 + K6 | chapter 1, the wit chapters, chapter 10 | bundled because they touch different chapters from bundle 1 (CLAUDE.md: bundle levers that touch different chapters so one read scores several) |
| 3 | K5 at `subtext` | chapters 2–9 | its own pair against `none`, and a read; `attraction` only after `subtext` has a mark |

---

## 6. THE READER'S PRESETS, IN THIS PROJECT'S PARAMETER FILE

`scripts/run-params.mjs` draws every parameter from a seed and writes
`scripts/generated/run-params-<seed>.yaml`. The reader's four presets, in those terms — existing keys
as they are, proposed keys marked:

| reader's preset | `humourLevel` | `relationshipArc` (K5) | `aftermathScope` (K3) | K1 skill clues | K2 stakes | where it sits |
|---|---|---|---|---|---|---|
| Classic fair-play mystery | `dry` or `classic` | `none` | `household` | 3 | on | today's default, plus K1/K2 |
| Hybrid cosy with emotional depth | `classic` | `subtext` | `household` or `relational` | 3 | on | **the target this paper recommends** — the reader's own words: *"best target for improving current short drafts without abandoning puzzle form"* |
| Social-system mystery | `dry` | `none` or `subtext` | `institutional` or `public` | 3 | on, with `institution_at_stake` required | the `authority` axis's natural preset |
| Glossy romantic suspense | `sharp` | `attraction` or `resolved` | `relational` + `institutional` | 3 | on | the competitor's register; a deliberate experiment, never a random draw |

The reader's worked block, translated. Existing keys are live today; proposed keys are the kit's:

```yaml
# existing
primaryAxis: authority
locationPreset: seaside_hotel
tone: "Dark"
detectiveType: amateur
narrativeStyle: atmospheric
targetLength: short
humourLevel: classic          # A_92 — none | dry | classic | sharp
storyAngle: "a motor-racing team and its star driver"   # the reader's "speed trial"
# proposed (this paper)
expertiseClues: 3             # K1 — clues that carry unlockedBy
socialStakes: true            # K2 — standsToLose per suspect; institution_at_stake on the case
aftermathScope: institutional # K3 — household | relational | institutional | public
relationshipArc: subtext      # K5 — none | subtext | attraction | resolved
```

What the reader's block asks for that has no key and needs none: `HUMOUR_MODE=light_dry_wit +
professional_sarcasm` is `humourLevel: classic` with K4's role defaults and a K1 expert;
`EVIDENCE_CHAIN_TYPE=physical + documentary + testimony` is what `Clue.category` already distributes;
`FAIR_PLAY_STRICTNESS=strict` is the only setting there is.

---

## 7. WHAT NOT TO DO — WITH THE RECEIPT FOR EACH

### 7.1 Do not build `GENRE_BLEND`

Every gate in this pipeline assumes a fair-play mystery: Agent 6's report, the blind reader, the
discriminating-test evidence check, the geometry contract, the reveal obligations, the clue-presence
floor. A "social thriller" or "romantic suspense" mode is not a parameter on this product; it is a
second product whose validators would have to be written from nothing. The competitor's strengths
transfer as the four levers above WITHOUT a blend, and §9 shows the canon already contains them.

### 7.2 Do not loosen fair play

A_89 B2 counted the clue-obligation load rather than capping it for one reason: *"dropping an
obligation would drop a clue from the book, and fair play is the one thing the pipeline may not trade
away."* The matched pair that retired `AGENT9_CLUE_OWNERSHIP_BY_PAGE` (A_90 §13) is the receipt: a
lever that reduced repetition by retiring sixteen obligations came back with *"reveal uses evidence
not planted earlier"* as a rubric cap. `FAIR_PLAY_STRICTNESS` stays at the only value it has.

### 7.3 Do not ask for a score, a density or a level

`CHARACTER_LIFE_SCORE_TARGET=8`, `SOCIAL_WORLD_DENSITY=high`, `HUMOUR_FREQUENCY=medium`,
`HUMAN_COST_VISIBILITY=high`, `PROSE_POLISH_LEVEL=literary-commercial` — each is a rate, and the
receipts are the project's oldest: VoiceSpec reached every prompt and was ignored, settled in ONE run
(`voice-spec-is-a-dead-lever`); the humour guide asked for one observation per three pages and a
whole book carried 3–5 understatement markers (A_91). Every one of these has a countable form (§4)
and only the countable form is built.

### 7.4 Do not add a prose-polish parameter

The register rate is the only validated predictor of the score (ρ −0.60 headline, −0.71 character
clarity, n=34) and it has moved twice: when the polish pass was given the chapter's own worst
sentences by number (`AGENT9_REGISTER_BAN`, discard rate 54%→0%), and never when it was given an
adjective. A label like *literary-commercial* is an adjective.

### 7.5 Do not put the reader's example lines in a prompt

*"I am not guessing. I am qualifying."* *"You make romance sound like municipal zoning."* *"How kind
of you to mistake attendance for bravery."* They are good lines and they are exactly what would be
reproduced: A_67 (the worked example copied 45 of 45 times as a scene coordinate), the retired
schoolteacher 31 of 44 (§3.1), *"She did not elaborate"* ten times from a prohibition that quoted it
(A_96 B1), *"Six words."* spoken aloud from an instruction that counted words. Every prompt in the
kit is written without an example, and the tic-template ban (A_91 F3, 23%→0 of 7) is the model for
how a ban on the exhausted forms replaces one.

### 7.6 Do not add headline scoring categories

The reader proposes eight; two of them are already on the table at this project's request. The
rubric cannot rank two books (`rubric-cannot-rank-two-books`: no judge separates 86 from 81), and the
ordinal judge resolves ten marks, not five. More categories add columns, not resolution. The ten
checklist questions go in as sub-checks (K7); the categories stay.

### 7.7 Do not build all of it at once, or measure it on one run

Six of seven defects in A_96's own fix batch were found by running the code, four of them
regressions of the fix's own defect; a single canary run is confounded (`canary-k2-single-run-confounded`).
Bundles of levers that touch DIFFERENT chapters are fine and cheaper — one read scores several — but
each bundle is settled by a matched pair (`RESUME_REDO=prose`, byte-identical upstream) before a fresh
run, and K5 gets its own.

---

## 8. THE MEASUREMENT PLAN

| instrument | exists | measures | reads beside |
|---|---|---|---|
| wit density | yes (`wit-density.ts`) | four shapes per 10k | the band's target |
| machine register | yes | the only validated predictor | the polish pass |
| turn density | yes (A_95 M6, strengthened A_96 F6) | does the middle point elsewhere | — |
| A_91 beats telemetry | yes | formative trait and tic on the page | — |
| **expertise-clue count** | K1 | `unlockedBy` clues staged through the skill's vocabulary | clue obligations |
| **stakes on the page** | K2 | `standsToLose` distinctive words in a chapter naming the suspect | A_91 beats line |
| **repair on the page** | K3 | `repairTarget` words in the final chapter | aftermath contract |
| **pair beats** | K5 | the pair together with a trust/access/decision verb, per chapter | — |
| **read-back** | K7 | every `run-params.json` key that has a page-level trace, found or not | the ship-check |

Reads are scored by category on the existing table; the predictions in §5 name the category and the
size of the move, and the falsifiers name the shape of the null result. Recompute every correlation
against the ledger with `words >= 8000` (CLAUDE.md).

---

## 9. SOURCES, AND AN HONEST NOTE ON TRANSFER

**The reader's guide.** An LLM reader's account of one competitor story, delivered 2026-09-17,
reproduced in §11. It is evidence about what one reader values and about one book; it is not a
corpus and it is not the story, which this project has not seen (ASSUMED throughout that the reader
described it accurately). Its value here is that the same reader scores this project's books, so its
vocabulary of praise is the vocabulary the marks are given in.

**This project's own record.** WP-001 (personality is the residue of unforced choice; the five
categories never given a 9); A_91 (wit and depth as per-chapter operations); A_92 (the humour band);
A_94 (the shapes; the 80/100 regression); A_95 (M1–M6, the road to 88–90); A_96 (the bug list and
its fixes); A_89 D1 (the relationship cap that discarded 99% of relationships); A_85 F6 (the shared
history must name an event); A_86 items 1, 4, 5 (the aftermath's positive job, the motive kind, the
clearing human beat).

**The canon in `library/texts/`, and what transfers.** Twelve texts, all pre-1930, none of them the
Sayers or Allingham that the reader's romantic register descends from. But the kit's four levers are
each present in the library:

- *The Case of Oscar Brodski* (Freeman, 1912): Thorndyke is the professional expert as clue engine in
  its purest form — the case is solved by a scientist reading materials a policeman cannot. K1 is a
  hundred years old. **Transfers directly.**
- *The Moonstone* (Collins, 1868): Franklin Blake and Rachel Verinder's courtship advances through the
  investigation, is blocked by what one of them will not say, and resolves in the last chapter; *The
  Sign of the Four* (Doyle, 1890): Watson and Mary Morstan, attraction through shared danger, resolved
  by a proposal that the puzzle's outcome makes possible. K5 at `attraction` and `resolved` is inside
  the genre's founding texts. **Transfers, with the caution that in both the investigator is not the
  romantic lead** — Cuff and Holmes stay outside it — which is a shape K5 should offer (`arcPair` need
  not include the detective) and the reader's competitor, on their account, does not.
- *The Big Bow Mystery* (Zangwill, 1892): the press, the coroner's inquest and the public meeting are
  the social arena; the crime threatens a movement, not only a man. K2's institution and public gaze.
  **Transfers.**
- *The Leavenworth Case* (Green, 1878): inheritance, reputation and a household's standing are what
  every suspect stands to lose. K2.1. **Transfers.**

What does not transfer from the reader's guide without a read: the competitor's *register* — glossy,
contemporary, aphoristic. The reader marks this project against a Golden Age rubric, and the canon
above is drier than the competitor. So the kit takes the competitor's STRUCTURES (expertise, stakes,
repair, an arc) and leaves its voice to the band and the polish pass, which is where voice is
measured here.

---

## 10. SUMMARY FOR SOMEONE BUILDING SOMETHING ELSE

- When a reader praises a rival, map the praise onto the categories your readers mark, and build
  where your marks are capped, not where the rival is loudest.
- A parameter guide from an LLM reader will mix operations and rates. Convert every rate to the
  countable thing that would produce it before building anything; a rate reaches every prompt and
  moves nothing.
- Measure the archive first. Two of this paper's four levers turned out to be fields that do not
  exist (a clue's discoverer; a suspect's social stake), one turned out to be data already generated
  and never asked for (758 relationship pairs), and one turned out to be built and still marked 6.
- A worked example in a prompt is a template: thirty-one retired schoolteachers in forty-four books.
  Derive, forbid the exhausted forms, and never illustrate.
- Put the new thing in the form your one working delivery pattern already takes — here, *this
  chapter, this character, one countable thing* — and give it an instrument the day it ships.
- Default the genre-changing lever off and give it its own read.

---

## 11. APPENDIX — THE READER'S GUIDE, AS RECEIVED

The guide's parameter tables are reproduced in §2 (crosswalk), §4 (rates), §5 (romance moves, social
parameters, humour-by-role, evidence techniques, prompt modules) and §6 (presets and the worked
block); its review checklist and updated categories are in K7. Its executive summary, verbatim, is
the sentence this paper is built on:

> The competitor story works because it is not only an investigation. It combines a stylish
> property-fraud mystery with romance, social hierarchy, professional competence, institutional
> stakes, humour, and a reparative aftermath. The lesson is not to copy the plot, but to parameterize
> the craft moves that make it feel polished and human.

And its bottom line, which this paper agrees with in every clause but the last five words:

> The key move is to turn those strengths into explicit parameters, then review each finished story
> against them. For your current mystery pipeline, the biggest gains will come from adding
> ROMANCE_INTENSITY, SOCIAL_WORLD_DENSITY, PROFESSIONAL_EXPERTISE_CLUES, HUMOUR_MODE, and
> AFTERMATH_SCOPE as first-class controls.

`HUMOUR_MODE` is already a first-class control here and has not moved the mark; the archive says the
gains are in the other four, in the order expertise, stakes, aftermath, arc.
