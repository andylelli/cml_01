# Actual Prompt Record

- Run ID: `run_cdcf28d9-b08b-429d-bc7a-d50f3da66bd3`
- Project ID: `proj_60ea64d0-8bbf-4c6a-a528-7798eeaafb92`
- Timestamp: `2026-07-17T20:10:07.985Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `5ec1f7a1bd40c6b2`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Inspector Harold Bramwell[HE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Inspector Harold Bramwell. Default narrator pronoun: HE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Inspector Harold Bramwell (man), Lady Evelyn Stanhope (woman) — DECEASED, past-tense only, Charles Stanhope (man), Margaret Lyle (woman), James Archer (man), Beatrice Collins (woman), Dr. Philip Marsh (man).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Inspector Harold Bramwell, Lady Evelyn Stanhope, Charles Stanhope, Margaret Lyle, James Archer, Beatrice Collins, Dr. Philip Marsh?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.
⚠️ BEFORE YOU WRITE each chapter, also ask yourself: "Am I using the correct pronouns for every character — she/her for women, he/him for men?" If not, correct it before writing a single word.
⛔ GENDER IS NON-NEGOTIABLE: The gender of every character is shown above. Use the correct pronouns at all times — a woman is always she/her, a man is always he/him. Never swap, default, or guess.

Rules:
- Do not introduce new facts beyond the CML and outline.
- Preserve all clues, alibis, and the core mystery logic.
- Maintain strict setting fidelity to the specified location and era.
- Write immersive, sensory-rich prose that transports readers to the setting
- Include scene-setting passages that establish atmosphere, time, and place
- Use varied sentence structure and sophisticated vocabulary
- Show character emotions through actions and dialogue, not just telling
- Create distinct character voices and personalities based on their profiles
- ⛔ ANTI-EXPOSITORY DIALOGUE (ROADMAP_TO_80 M3 — HIGH PRIORITY): No character may state evidence, an alibi, a timeline, or a clearance as a flat report. Dialogue must carry SUBTEXT — characters deflect, evade, hedge, imply, or push back; the investigator INFERS what is not said. A line that exists only to relay a fact the reader needs is forbidden: route that fact to narration or have a character resist/qualify it. Each speaking character must sound distinct (diction, rhythm, what they avoid) — a reader should attribute a line without its tag. Replace "I was in the kitchen at eleven, the cook will confirm" with evasion under pressure that the inspector must read.
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. If a sensory phrase (e.g., "air thick with tension", "smell of polished wood") has appeared in any prior chapter, rephrase it entirely. No atmospheric sentence should appear verbatim or near-verbatim in more than one chapter.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation". Rewrite any scaffold-like sentence into chapter-specific prose tied to character action.
- TEMPLATE PRECONDITION (STRICT): Before returning JSON, self-check every paragraph for reused scaffold patterns and high-overlap phrasing from prior chapters. If any paragraph resembles template scaffold language, DISCARD that paragraph and rewrite it from a different sentence skeleton before output. Do not return until all paragraphs pass this precondition.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The culprit exploited a natural event to mask their deed, but the victim’s own secret activities led to this fatal timing error." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.
- ⚠ MECHANISM–ENVIRONMENT EXCEPTION (the central clue depends on it): the mystery's mechanism requires direct, unobstructed sunlight and clear skies (the shadow / solar reading cannot form under cloud), but the established setting is "Overcast autumn day with intermittent drizzle, dampening outdoor sounds and preserving subtle footprints · Late afternoon, shadows lengthening as daylight fades, creating pockets of gloom in estate corridors" (note "Overcast"). At the clue-critical moment, render a BRIEF, JUSTIFIED local exception — a short, explicitly-noted break in the prevailing conditions (e.g. "a brief clearing in the Overcast") — so the mechanism can operate WITHOUT contradicting the established weather. Do not silently ignore the Overcast, and do not present the mechanism as if the conditions were always favourable.
- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Lady Evelyn Stanhope is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Lady Evelyn Stanhope is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Lady Evelyn Stanhope said, "…"` / `Lady Evelyn Stanhope turned to him`. RIGHT: `Lady Evelyn Stanhope had said, weeks before, that…` / `Agnes remembered how Lady Evelyn Stanhope used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Lady Evelyn Stanhope beside an action or speech verb. A live dialogue tag or present action for Lady Evelyn Stanhope is a continuity failure that will be rejected and regenerated.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Inspector Harold Bramwell, Lady Evelyn Stanhope (DECEASED), Charles Stanhope, Margaret Lyle, James Archer, Beatrice Collins, Dr. Philip Marsh
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Inspector Harold Bramwell: Police Detective / Inspector
   - Lady Evelyn Stanhope: victim (DECEASED — does not appear in any scene, past tense only)
   - Charles Stanhope: Ambitious Heir
   - Margaret Lyle: Efficient Administrator
   - James Archer: Traditionalist Senior Staff
   - Beatrice Collins: Ambitious Young Assistant
   - Dr. Philip Marsh: Reserved Medical Professional
   - Never place characters in locations inconsistent with their role

## POST-CHAPTER-1 CHARACTER PRESSURE CONTRACT (MANDATORY)
After Chapter 1, character content must not read as biography or static profile recap.
Character beats must carry pressure and case movement.
Apply this contract to every chapter in this batch.

For each chapter after Chapter 1, reveal at least one NEW character truth about one of:
- fear
- motive
- lie/deception
- loyalty conflict
- relationship to the victim

That character development must do at least one of the following:
- make someone more suspicious
- make someone less suspicious
- explain why someone lied
- reveal motive
- deepen the emotional cost of the crime
- change the investigator's understanding of the case

Hard constraints:
- No character paragraph that only restates occupation/role/persona without investigative consequence.
- No static biography dumps after Chapter 1.
- The investigator must register the pressure shift in-scene (through observation, questioning, or revised theory).

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1931 May
Living in May 1931 in rural Yorkshire, the world is marked by the lingering chill and dampness of early spring. The estate’s sprawling gardens and Tudor Revival architecture stand solemn beneath overcast skies, with frequent light rain muting footsteps and preserving delicate traces in the earth. Men and women dress in restrained elegance, reflecting both tradition and the economic strains of the Great Depression. Inside the manor, the steady clatter of typewriters and the crackle of radios blend with whispered political anxieties about austerity measures and international instability. The household’s rigid social order governs every interaction, with domestic staff carefully navigating their defined roles under watchful eyes. Outside, the slow rumble of automobiles and distant church bells mark the passage of time in a world poised on the edge of change, where social rituals endure even as economic hardship tightens its grip.
Emotional register: A pervasive tension tinged with guarded resilience and an undercurrent of unease colors daily life at the estate.
Physical constraints: Limited communication technology: rotary telephones on party lines and manual typewriters dominate correspondence. | Travel constrained to petrol-powered automobiles and steam trains, slowing external assistance. | Social protocol restricts movement within the estate, with segregated servant passages and locked private quarters. | Mechanical clocks and sundials are relied upon but subject to environmental and mechanical limitations.
Current tensions (weave into background texture): The British economy struggles with rising unemployment and austerity debates under Ramsay MacDonald’s National Government. | Political unease grows due to international tensions, especially Japan’s aggression in Manchuria. | Economic hardship intensifies class divisions, heightening anxiety within landed estates.
Wartime context — This pre-war period sees no active military service impacting the estate; many men remain at home amid political and economic uncertainties.: Traditional class structures and gender roles remain intact, although subtle shifts in attitudes begin to emerge against a backdrop of social strain. Absence effect: The absence of wartime mobilization keeps family members present but heightens anxieties about economic survival and political unrest.

## Season Lock (mandatory — derived from 1931 May)
Season: spring. Allowed vocabulary: spring, vernal, springtime
Forbidden seasonal words — never use in narration, dialogue, or metaphor: summer, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with spring.

## Story Theme
This story explores how rigid social hierarchies and the manipulation of time—both mechanical and social—can obscure truth and justice within a confined aristocratic estate, revealing the fragility of appearances under pressure.

## Story Emotional Register
Dominant: A mounting tension of suspicion and constrained revelation pervades the narrative, underscored by a pervasive sense of social unease and the oppressive weight of deception.

Arc:
The story opens with a heavy atmosphere of shock and solemnity as Lady Evelyn Stanhope’s murder is discovered in the quiet manor courtyard. The damp autumn day, shadowless sundial, and muffled sounds create a setting thick with foreboding and silent questions. Initial interviews reveal conflicting witness statements and apparent contradictions, sowing seeds of doubt and unease among the household and the investigator alike. Inspector Bramwell’s calm, methodical approach begins to peel back layers of social protocol and surface truths, but early false leads—especially suspicions cast on James Archer—heighten tension and emotional strain within the close-knit estate.

As the investigation deepens, a pivotal moment arises when Bramwell uncovers mechanical tampering with the manor’s library clock, challenging the reliability of established timelines. This revelation reshapes the entire case, casting new suspicion and forcing a reassessment of alibis and motives. The inspector’s internal struggle intensifies, grappling with political pressures and his own commitment to justice amid the estate’s rigid social fabric.

The second pivot occurs as the cloud cover’s effect on the sundial’s shadow is scientifically understood, exposing the false timing that misled witnesses. This natural phenomenon, combined with the mechanical interference and manipulated servant schedules, reveals a sophisticated deception at the heart of the murder. The emotional stakes rise sharply as the truth threatens to unravel the carefully maintained order and implicate Charles Stanhope deeply.

In the pre-climax, mounting pressure from social expectations and political influence weigh heavily on Bramwell, while Charles’s brittle charm gives way to stress under interrogation. The confrontation scene crackles with tension as evidence of clock tampering and sundial contradictions are laid bare, culminating in the shattering of the false timeline and the exposure of guilt.

The resolution carries a somber emotional tone: justice is served, but not without cost. Bramwell faces a bittersweet victory tinged with the.

## Emotional register at this point in the story
Rising suspicion and confusion arise from conflicting witness statements and the seeming reliability of the sundial.

## Character Portraits (appearance & era)

### Inspector Harold Bramwell
Inspector Bramwell embodies the cautious pragmatism of a seasoned Scotland Yard detective navigating the complexities of a 1930s British manor. He is deeply aware of the political forces shaping justice, especially amid the pressures from influential estate patrons. His calm demeanor and methodical approach reflect a professional tempered by decades witnessing societal shifts and institutional challenges. The growing tensions of the Great Depression and rising political unrest weigh on his conscience as he balances duty with external influences.
Era intersection: Bramwell’s struggle with political interference and his commitment to impartiality mirror the era’s broader conflicts between tradition and reform.

### Charles Stanhope
Charles epitomizes the ambitious, debt-ridden heir striving to navigate the financial and political turbulence of the early 1930s. His confident and sardonic exterior masks the vulnerability wrought by mounting debts and a precarious future in politics. The era’s economic restrictions and social expectations collide with his personal desperation, driving him to manipulate both mechanical time and family trust to secure his ambitions.
Era intersection: His private financial struggles and political aspirations are direct products of the 1931 economic austerity and social upheaval.

## Character Voices

### Inspector Harold Bramwell (he/him/his)
Measured, deliberate, and quietly ironic, Inspector Bramwell speaks with calm authority and a subtle dry wit.
[comfortable] One mustn’t jump to conclusions, now, must we? Let us consider the facts carefully before proceeding.
[evasive] I am still gathering all the necessary details; it would be premature to speculate without evidence.
[stressed] The pressures here are considerable, but justice demands we look beyond appearances, no matter the cost.
Humour: Bramwell’s dry wit punctuates tense moments with understated irony, offering a subtle levity without undermining seriousness.

### Charles Stanhope (he/him/his)
Confident and urbane with a sardonic edge, Charles’s speech blends polished rhetoric with sharp wit and occasional impatience.
[comfortable] Isn’t it curious how fortune favors the bold? One must seize opportunity when it presents itself.
[evasive] I fail to see how these trivial details pertain to the matter at hand; surely there are more pressing concerns.
[stressed] The consequences of these accusations are quite severe; I assure you, I have much at stake here.
Humour: Charles’s sardonic humour veils his inner anxieties, using rhetorical questions and pointed sarcasm to deflect scrutiny.

## Location Registers (scene framing guides)

Manor Courtyard by the Sundial: This courtyard feels like a frozen moment in time, where the damp cold and overcast gloom deepen a sense of isolation and secret tension. The moss-covered sundial, slick and shadowless, serves as a silent witness to betrayal and hidden machinations, its stillness contrasting with the undercurrent of unrest among those who traverse the wet cobbles.. Camera angle: Approach with a sense of reverence and unease, attuned to the contrast between beauty and menace in this confined space.. Era: Access is tightly controlled during daylight with strict visitor logs reflecting 1930s estate security protocols.

Manor Library: The library is a contemplative refuge where knowledge and secrets intermingle. The scent of aged leather and the quiet tick of the brass clock create an atmosphere thick with anticipation and scrutiny, inviting deep reflection amid shadows and fading daylight.. Camera angle: Enter with a steady, investigative gaze, alert to subtle clues hidden in the interplay of light and shadow.. Era: Access is limited to family and trusted staff, emphasizing social hierarchies and control over information.

Servants’ Hall: This modest space hums with the quiet resilience of those who labor unseen. The warmth of the cast-iron stove contrasts with the weariness of daily routine, fostering a fragile camaraderie amid whispered concerns and the ever-present pressure of social order.. Camera angle: Observe with empathetic distance, noting the layered social dynamics beneath the everyday chatter.. Era: Restricted to domestic staff during work hours, reflecting rigid household segregation.

Estate Gatehouse: The gatehouse stands as a sentinel between worlds, its stone walls and iron bars symbolizing the boundary between the estate’s insular order and the uncertain external environment. The dim oil lamp light and rustling papers evoke a mood of watchful vigilance and contained tension.. Camera angle: Approach with caution, sensing the watchfulness and control exerted at this threshold.. Era: Strict visitor verification and locked gates after dusk underscore the era’s security concerns.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Inspector Harold Bramwell, Margaret Lyle, James Archer
Permitted forms: dry_wit, polite_savagery, deadpan
Rationale: Early interrogations allow subtle wit and irony to relieve tension and develop character dynamics without disrespecting the crime.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "The discovery of mechanical tampering in the library reveals the calculated manipulation of time, which reframes the seemingly solid alibis and household schedules introduced mid-story". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, the servant ledger’s overlapping and inconsistent entries gain significance as deliberate cover-ups, clarifying why initial suspect accusations were misdirected and highlighting the intricate social engineering behind the murder’s concealment". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The victim was seen alive precisely at quarter past two by multiple witnesses, confirmed by the sundial’s shadow.
- Hidden truth to progressively expose (compose in your own words from these elements): brief, cloud, cover, erased, sundial, shadow, making, impossible, confirm, time, thus, concealing
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: sundial, surface, near, garden, shows, shadow, mark, quarter, past, despite, witness, claims | corr: dense, cloud, bank, moment, prevented, sundial, casting, shadow, invalidating, claimed, time | effect: narrows, victim, time, death, before, quarter, past, eliminating, suspects, relying, timeline
  - Step 2: obs: library, clock, pendulum, scratch, marks, inside, casing, time, lags, real, fifteen, minutes | corr: pendulum, impeded, deliberately, causing, clock, show, inaccurate, time, creating, false, timeline, alibis | effect: eliminates, suspects, whose, alibis, depend, clock, displayed, time
  - Step 3: obs: servant, ledger, entries, shifts, show, overlapping, times, inconsistent, handwriting | corr: ledger, altered, rounding, errors, overlapping, shifts, support, false, timeline, cover, suspect, absence | effect: narrows, opportunity, window, confirming, charles, stanhope, presence, garden, before, quarter, past, eliminating
  - Step 4: obs: charles, stanhope, uniquely, possesses, knowledge, clock, mechanisms, opportunity, tamper, library, pendulum, latch | corr: charles, engineer, mechanical, interference, creating, false, timeline | effect: identifies, charles, stanhope, suspect, means, manipulate, physical, timekeeping, devices
- Discriminating test method: constraint_proof
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): timed, comparison, staged, manor, library, clock, external, time, standard, using, sundial, replicated
- Test must rely on already-shown clue IDs: clue_12, clue_21, clue_13
- Fair-play rationale: Step 1: The sundial’s shadow absence (early clues) and weather journal (mid clues) reveal the false timing of victim sighting. Step 2: The scratched clock pendulum and butler’s testimony (mid clues) expose mechanical tampering. Step 3: The servant ledger’s overlapping times (mid clues) confirm manipulated schedules. Step 4: Charles Stanhope’s unique mechanical knowledge and access (early and mid clues) isolate him as the only suspect capable of the tampering. The discriminating test employs these known facts to prove the false timeline and guilt.

## Character Reference

### Inspector Harold Bramwell (he/him — NEVER she/her)
Bramwell speaks with measured deliberation, his sentences carefully constructed and often laced with subtle irony
He rarely wastes words, but when he does, his dry wit surfaces — a quiet, knowing remark that punctuates tense moments
His tone remains polite but firm, embodying the composed authority of a man who’s seen much and trusts little.
Bramwell struggles with the moral tension between his duty to uncover the truth and the political pressure to deliver a convenient resolution, fearing that bending to influence would betray his life's work.
Voice colour: Inspector Harold Bramwell uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Charles Stanhope (he/him — NEVER she/her)
Charles speaks with confident flair, often employing sharp, sardonic wit that veils his inner anxieties
His tone is polished yet edged with impatience, and he frequently uses rhetorical questions and pointed sarcasm to deflect probing inquiries
His manner is urbane but occasionally brittle under stress.
Charles grapples with the moral cost of ambition, torn between loyalty to family and the ruthless pursuit of his political dreams, haunted by what he might have done to secure his future.
Voice colour: Charles Stanhope uses sardonic humour — let it surface in their dialogue where natural, not in every line.



PHYSICAL PLAUSIBILITY REQUIREMENTS:

All physical evidence must obey real-world physics:

1. VIABLE Evidence by Location:
   Interior: fingerprints, torn fabric, overturned furniture, blood spatter, documents
   Exterior (calm): secured items, structural damage, witness observations
   Exterior (storm): NO trace evidence survives - use only structural damage or interior evidence

2. IMPLAUSIBLE Evidence (DO NOT USE):
   ❌ Footprints on wooden deck (treated wood doesn't retain prints)
   ❌ Footprints in rain/storm (washed away immediately)
   ❌ Metal embedded in hardwood (requires bullet velocity, not human force)
   ❌ Light objects in storm (blown away)

3. For struggle evidence use:
   ✓ Overturned furniture, torn clothing, scattered items, defensive wounds
   ❌ Objects embedded in hard surfaces, shattered steel/iron
ERA AUTHENTICITY (1930s):

1. FORBIDDEN terms (did not exist):
   ❌ Modern technology

2. REQUIRED period markers (include 2+ per scene):
   ✓ Formal address: Mr./Mrs./Miss/Dr./Sir/Lady
   ✓ Period technology: period-appropriate items
   ✓ Fashion: period clothing

3. Use period-authentic language and social norms

LOCATION PROFILES:

You have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.

Primary Location: Stanhope Manor Estate (Ashcombe Vale, England)
An imposing Tudor Revival manor house set within formal gardens and dense woodlands, Stanhope Manor dominates the isolated Ashcombe Vale countryside, its grandeur shadowed by mounting tension and guarded secrets.

Key Locations Available:
- Manor Courtyard by the Sundial (exterior): Crime scene
- Manor Library (interior): Clue discovery and private consultation
- Servants’ Hall (interior): Staff gathering and informal exchanges
- Estate Gatehouse (transitional): Visitor verification and access control

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Cozy yet tense, with underlying social unease reflecting economic hardship and political unrest abroad
Weather: Overcast autumn day with intermittent drizzle, dampening outdoor sounds and preserving subtle footprints

Era markers: Rotary-dial domestic telephones with shared party lines | Manual typewriters for correspondence and record keeping | Petrol-powered automobiles owned by the estate family

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Ashcombe Vale, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
Manor Courtyard by the Sundial (exterior):
  - Visual: moss-clad stone sundial, wet cobbled courtyard stones, drizzle-dappled linden branches
  - Sounds: soft patter of autumn drizzle, damp leaves rustling in breeze, faint distant church bell tolls
  - Scents: cold damp stone and moss, wet earth and fallen leaves, faint smoke from distant chimneys
  - Touch: slick mossy sundial surface, cold wet cobblestones underfoot

Manor Library (interior):
  - Visual: dark oak bookshelves crammed with volumes, golden glow from shaded desk lamp, dust motes in filtered daylight
  - Sounds: soft scratch of pen on paper, quiet turning of brittle pages, distant ticking of brass clock
  - Scents: musty leather bindings, faint scent of old parchment, smoky cedarwood from shelves
  - Touch: smooth polished wood desk surface, rough grain of leather book covers

Servants’ Hall (interior):
  - Visual: worn wooden benches and tables, faded calendar pinned to wall, scuffed floorboards
  - Sounds: clinking of tin cups, soft murmur of hushed conversation, steady crackle from stove
  - Scents: boiling tea and damp wool, stove smoke and burnt toast, earthy scent of laundry soap
  - Touch: rough wooden bench surfaces, warm cast-iron stove heat

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- Living in May 1931 in rural Yorkshire, the world is marked by the lingering chill and dampness of early spring
- The estate’s sprawling gardens and Tudor Revival architecture stand solemn beneath overcast skies, with frequent light rain muting footsteps and preserving delicate traces in the earth
- Men and women dress in restrained elegance, reflecting both tradition and the economic strains of the Great Depression
- Inside the manor, the steady clatter of typewriters and the crackle of radios blend with whispered political anxieties about austerity measures and international instability
- The household’s rigid social order governs every interaction, with domestic staff carefully navigating their defined roles under watchful eyes

TEMPORAL CONTEXT:

This story takes place in May 1931 during spring.

Seasonal Atmosphere:
- Weather patterns: mild temperatures averaging 50-60°F (10-15°C), frequent overcast skies with occasional light rain showers, damp mornings with lingering morning dew on lawns and garden beds
- Daylight: Increasing daylight hours with sunset around 8:30 pm, allowing for extended outdoor activities in the early evening
- Seasonal activities: Planting and tending to spring flower beds, particularly tulips and bluebells, Organizing and attending afternoon garden parties or tea on the manor's terrace, Early morning walks on estate grounds to enjoy emerging greenery and bird song
- Seasonal occasions: May Day (May 1) celebrated with traditional dances and maypole festivities, Ascension Day (may vary, often in May) observed by some in the community, Early preparations for Whitsun (Pentecost) approaching at month's end
- Season: spring

Period Fashion (describe naturally):
- Men formal: Single-breasted wool suits in muted grays and browns with narrow lapels, Starched detachable collars paired with silk neckties featuring geometric Art Deco patterns, Two-tone Oxford shoes with leather wingtips
- Men casual: Lightweight tweed jackets with elbow patches, Knitted v-neck sweaters layered over collared shirts, Flat caps or trilby hats for outdoor wear
- Men accessories: Pocket watches with chain attachments, Leather gloves in dark brown or black, Silk pocket squares with subtle paisley prints
- Women formal: Drop-waist day dresses in floral prints or pastel silk, featuring pleated skirts, Cloche hats decorated with ribbons or small feathers, Kid leather gloves and matching low-heeled pumps
- Women casual: Lightweight gabardine skirts paired with blouses having Peter Pan collars, Short-sleeved cardigans in soft colors, Simple straw hats for garden use
- Women accessories: Beaded handbags or small leather purses, Delicate pearl necklaces or brooches, Silk scarves tied around the neck or hat

Cultural Context (reference naturally):
- Music/entertainment: Duke Ellington’s orchestral jazz numbers gaining popularity, Bing Crosby’s crooning beginning to influence British tastes, Classical music concerts featuring works by Ravel and Debussy; Films: ‘City Lights’ (1931) by Charlie Chaplin admired for its blend of comedy and pathos, ‘Dracula’ (1931) introduces the horror genre to wide audiences; Theatre: West End productions of Noël Coward’s plays drawing sophisticated audiences, Revues featuring variety acts and music hall stars remain popular; Radio: The BBC Home Service broadcasts news, drama, and classical music, Comedy programs like ‘Band Waggon’ begin captivating listeners
- Typical prices: Loaf of bread: 4 pence, Pint of milk: 1 penny, Taxi ride across town: approximately 2 shillings
- Current events: British economy struggles from the ongoing Great Depression, with rising unemployment and industrial unrest; May 1931 sees political unease as Ramsay MacDonald’s National Government debates budget cuts and austerity
- Literature: Agatha Christie’s ‘The Sittaford Mystery’ (1931) enjoyed by mystery readers | Virginia Woolf’s ‘The Waves’ (1931) pushes modernist boundaries | Daphne du Maurier’s early works gaining attention in literary circles | [Mystery and detective fiction] | [Modernist experimental novels] | [Romantic and historical fiction]
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - Exact time when sundial shadow vanished due to cloud cover: "a quarter past two"
  - Temperature recorded in the garden coinciding with the shadowless period: "forty-five degrees Fahrenheit"
  - Sun’s horizontal angle relative to the sundial at the critical time: "ninety-five degrees east of true north"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "forty-five degrees Fahrenheit" and "ninety-five degrees east of true north" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_11] body, discovery, scene, victim, puncture, wound, consistent, being, stabbed, letter, opener, blood
  Category: physical | Criticality: essential | Supports inference step 1
  Points to: indicates, manner, death, stabbing, letter, opener

• [clue_3] library, clock, pendulum, scratch, marks, inside, casing, time, lags, real, several, minutes
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: suggests, pendulum, interference, causing, false, clock, time

• [clue_4] pendulum, impeded, deliberately, causing, clock, show, inaccurate, time, creating, false, timeline
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: deliberate, clock, tampering, falsify, timeline

• [clue_mechanism_visibility_core] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • Exact time when sundial shadow vanished due to cloud cover: "a quarter past two"
  • Temperature recorded in the garden coinciding with the shadowless period: "forty-five degrees Fahrenheit"
  • Sun’s horizontal angle relative to the sundial at the critical time: "ninety-five degrees east of true north"

CHARACTER PRONOUNS — never deviate from these:
  • Inspector Harold Bramwell: he/him/his
  • Lady Evelyn Stanhope: she/her/her
  • Charles Stanhope: he/him/his
  • Margaret Lyle: she/her/her
  • James Archer: he/him/his
  • Beatrice Collins: she/her/her
  • Dr. Philip Marsh: he/him/his

CLUES ALREADY REVEALED TO READER: clue_1, clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): discredits, witness, claim, time, using, sundial | surfaces, core, mechanism, detail, cloud, cover | overturns, false, assumption, sundial, shadow, time
• Suspects still unresolved: Margaret Lyle[SHE], James Archer[HE], Beatrice Collins[SHE], Dr. Philip Marsh[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "The drizzle slackened, and for a moment the garden seemed to hold its breath. Bramwell stepped back from the sundial, his shoes leaving faint impressions in the moss at its base. The contradiction at the heart of the case had been exposed: the sundial, trusted..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Lady Evelyn Stanhope: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Lady Evelyn Stanhope crossed the room" / "Lady Evelyn Stanhope sat on the sofa" / "Lady Evelyn Stanhope nodded"
  - WRONG: "Lady Evelyn Stanhope gave testimony" / "Lady Evelyn Stanhope asked what had happened"
  - CORRECT: "Lady Evelyn Stanhope had often said..." / "Lady Evelyn Stanhope's effects were found" / "witnesses recalled Lady Evelyn Stanhope's habit of..."
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Inspector Harold Bramwell, Lady Evelyn Stanhope, Charles Stanhope, Margaret Lyle, James Archer

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
garden, study, library, manor, estate, flat

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Sundial’s Silent Witness
  Events: Bramwell’s gaze, trained by years of habit, swept the immediate scene.
Chapter 2: Chapter 2: Conflicting Time
  Events: "You’re certain you saw the shadow, Mr.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Quarter past two sundial shadow disappearance"**
✓ RULE: Every reference to the clock MUST use exactly this phrase. No variation permitted.
═══════════════════════════════════════════════════════════


HUMOUR & WIT GUIDELINES (Golden Age Mystery Style):

Humour is STRUCTURAL, not decorative. Every humorous moment must serve at least one purpose: hide information, reveal character, control pacing, provide tonal contrast, expose social truth, or sharpen the final reveal.

TONE: Balance classical structure with modern-clean, restrained, irony-aware voice. Aim for crisp prose, controlled formality, mildly sharpened dryness. Think: polite language, ruthless implication.

APPROVED HUMOUR STYLES (use all of these naturally throughout):
1. UNDERSTATEMENT (primary tool) - Increase seriousness by pretending not to. Example: "The evening deteriorated somewhat after the stabbing."
2. DRY OBSERVATIONAL WIT - Draw humour from human behaviour. Example: "Everyone preferred harmony. This required extensive dishonesty."
3. POLITE SAVAGERY - Maintain civility while delivering verbal incision. Example: "He was devoted to principle," said the solicitor. "His own," said the detective.
4. CHARACTER-DRIVEN CONTRAST - Humour from personality friction (literal vs dramatic, pragmatic vs romantic, rigid vs modern). Never farce, always friction.
5. PRECISION CRUELTY (sparingly) - Short, exact, devastating. Example: "He had the moral backbone of warm custard." Use rarely for maximum impact.

ADVANCED TECHNIQUE - PUZZLE CAMOUFLAGE: Readers lower their analytical guard when amused. Hide key habits in jokes, plant timeline clues in sarcasm, mask technical details with mild mockery. The joke makes the fact feel harmless.

SOCIAL X-RAY: Use humour to expose class blindness, moral hypocrisy, gender expectations, inheritance absurdity, respectability theatre. Let irony reveal, not preach.

DETECTIVE VOICE: The detective should rarely laugh, occasionally observe, almost never banter. Deliver one devastatingly mild remark per major scene. Example: "I do not accuse you. I merely observe that facts appear less cooperative in your presence."

RHYTHM: Tension -> Dry remark -> Silence -> Investigation resumes. Never stack jokes. Never let humour dominate a scene. Small, controlled, regular infusions.

BALANCE: For every 3 pages of investigation, insert 1 understated observation. If readers would laugh loudly, it is too much. Aim for the quiet exhale through the nose.

RUNNING GAGS AS STRUCTURE: Introduce a recurring minor joke casually, repeat it, then make it central to the solution. Reader reaction: Amusement -> Recognition -> Admiration.

EMOTIONAL HUMOUR: Humour can mask vulnerability. Example: "He disliked arguments. They implied things might change." Modern emotional subtlety inside classical tone.

FORBIDDEN: Humour at the moment of corpse discovery, in physical description of the dead, during genuine grief, in the core logical explanation. No broad parody, no farce, no anachronistic sarcasm, no characters existing only for comic relief, no humour that weakens intellectual tension.

GUIDING PRINCIPLE: Do not try to be funny. Try to be exact. Exactness produces dryness. Dryness produces intelligence. Intelligence produces quiet amusement. Quiet amusement is the perfect companion to murder.

WHODUNNIT CRAFT GUIDELINES (Emotional Depth & Soul):

These principles ensure the mystery has emotional resonance, not just logical mechanics.

1. THE MURDER MUST MEAN SOMETHING: The death should destabilize emotional ecosystems. Show who loved the victim, who depended on them, who is secretly relieved. Use telling details ("Her coffee was still warm") rather than clinical statements ("The body was found at half past seven").

2. GIVE EVERY SUSPECT A WOUND: People kill because of shame, fear, love, desperation, pride, protection, or revenge. Beyond motive, give each suspect a private longing, a contradiction, a vulnerability unrelated to the crime. Readers should think: "I do not want it to be them."

3. THE DETECTIVE NEEDS A PERSONAL STAKE: The external mystery should echo an internal one. Perhaps they see themselves in the victim, the case mirrors a past failure, or they are avoiding something in their own life.

4. ADD MOMENTS THAT DO NOT ADVANCE THE PLOT: Include micro-moments that create texture: a suspect making tea too slowly, a trembling hand lighting a cigarette, someone staring too long at a family photo. These pauses make the story feel alive.

5. LET EMOTION LEAK INTO DIALOGUE: Avoid clinical information exchange. Write subtext-rich dialogue where characters do not always say what they mean. Example: "You think I would lie about that?" "I think people lie when they are scared." "I am not scared." "Your hands say otherwise."

6. RAISE MORAL COMPLEXITY: The most soulful mysteries make readers uncomfortable. What if the victim was not entirely good? What if the killer had a reason that almost makes sense? If the reader finishes thinking "I do not know how I feel about that," you have succeeded.

7. SENSORY ATMOSPHERE AS SOUL: Use recurring sensory anchors (the smell of lilies from the funeral, rain tapping like nervous fingers) to build mood. Atmosphere is not decoration; it is the story breathing.

8. LET SOMEONE BREAK: At least once, someone should crack: cry unexpectedly, laugh hysterically, confess something unrelated, admit they are tired. Emotion destabilizes the procedural rhythm and makes the story human.

9. MAKE THE REVEAL HURT: The best reveals do not just surprise; they wound. The reveal should recontextualize earlier tenderness, expose a betrayal, or force the detective to confront something personal. If the reveal only satisfies logic, it feels clinical. If it rearranges relationships, it feels human.

SCENE GROUNDING CHECKLIST (MUST FOLLOW):
Known location profile anchors: Stanhope Manor Estate, Manor Courtyard by the Sundial, Manor Library, Servants’ Hall, Estate Gatehouse, Stanhope Manor library
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Stanhope Manor Estate", "Manor Courtyard by the Sundial", "Manor Library", "Servants’ Hall", "Estate Gatehouse", "Stanhope Manor library"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "Stanhope Manor library". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 98/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 98/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Inspector Harold Bramwell: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Lady Evelyn Stanhope: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Charles Stanhope: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Margaret Lyle: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • James Archer: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Beatrice Collins: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Dr. Philip Marsh: ALWAYS he/him/his/himself — NEVER she/her/herself

This rule overrides stylistic choice. If you are unsure which pronoun to use for a character,
re-read their name above. There is no character in this story with ambiguous gender.

MANDATORY PRE-OUTPUT CHECK: Before generating the JSON, re-read every sentence
that contains a pronoun and verify it against the table. If any mismatch is found,
correct it before outputting. This check is not optional.

Rules:
1. Every sentence is subject to this table — no exceptions for dialogue, reflection,
   narration, or attribution.
2. When characters of different genders appear in the same sentence and a pronoun
   could refer to more than one of them, use the character's name instead of a pronoun
   to eliminate ambiguity entirely.
3. A pronoun must never migrate from one character to another across a semicolon,
   comma splice, or consecutive sentence — even when the same pronoun gender applies
   to multiple characters.
4. "Her" takes two grammatical functions — both are exclusively female:
   • Indirect object (before the/a/an/another): "he told her the truth", "gave her a letter"
   • Possessive determiner (before a noun): "her coat", "her voice"
   For a MALE character: use "him" (indirect object) or "his" (possessive). Never "her".
5. Reflexive pronouns (himself/herself/themselves) must match the table above.
6. In dialogue attribution ("he said", "she replied"), the attribution pronoun must
   agree with the SPEAKER's gender — not the last character named inside the quoted speech.
7. In nested or cleft clauses ("It was she who had…", "It was he that…"), pronoun
   gender must still match the referent character's canonical set in the table.
8. When multiple characters of different genders appear in the same sentence, use the character's
   name instead of a pronoun to eliminate ambiguity:
   WRONG: "Lady watched Bramwell; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Lady watched Bramwell; Bramwell crossed the roo
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=11897; context=11837; dropped=[none]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

# Prose Output Schema
Return JSON with this structure:

{
  "status": "draft",
  "tone": "classic|modern|atmospheric",
  "chapters": [
    {
      "title": "Chapter title",
      "summary": "1-2 sentence summary",
      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]
    }
  ],
  "cast": ["Name 1", "Name 2"],
  "note": "",
  "audit": {
    "locked_fact_phrases": "present in paragraph N | absent",
    "season_words_used": "list seasonal words used in this batch | none",
    "discriminating_test_present": "yes: chapter N paragraph M | no",
    "required_clues_present": "clue_id or description: chapter N paragraph M | absent",
    "early_observation_present": "description: chapter N paragraph M (first 25%) | absent",
    "early_inference_present": "yes: paragraph immediately following observation | no"
  }
}

The audit field is a self-check only. Fill it honestly. It will be stripped before storage.

Requirements:
- Write exactly one chapter per outline scene (1 total).
- Chapter numbering starts at 3 and increments by 1 per scene.
- Each chapter has 4-8 substantial paragraphs (each 120–180 words) — TARGET ≥ 1250 words — do not stop early.
- Use classic tone and short length guidance.
- Reflect the outline summary in each chapter.
- Keep all logic consistent with CML (no new facts).
- Chapter title format: EVERY chapter title MUST follow exactly "Chapter N: [Descriptive title]" (e.g. "Chapter 1: The Frozen Clock"). Do NOT use number-only ("Chapter 1") or title-only ("The Frozen Clock") formats — mixed formats are a validation error.

WORD COUNT CONTRACT (NON-NEGOTIABLE):
- Target: 1250 words per chapter. Do not stop before reaching this threshold.
- Overshoot rather than undershoot. When in doubt, write one more paragraph.
- Expand with concrete action beats, clue-linked dialogue, and sensory detail.
- Never pad with recap, repeated atmosphere, or generic filler.

NOVEL-QUALITY PROSE REQUIREMENTS:

1. SCENE-SETTING: Every chapter MUST open with the following in the FIRST TWO PARAGRAPHS — this is a VALIDATION REQUIREMENT and chapters that omit it are retried:
   (a) 2+ sensory words from: smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim
   (b) 1+ atmosphere/time word from: rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark
   (c) A named location anchor from the setting profiles

   Then establish time of day, weather, and lighting; describe the location using sensory details; set mood and atmosphere before advancing plot beats.
   Example structure: "The <MONTH> <TIME> brought <WEATHER> to <LOCATION>. In the <ROOM>, <LIGHTING> while <SENSORY_DETAIL>. <CHARACTER>'s <OBJECT> <ACTION>."

   Generate new descriptions using actual location and character names from the provided profiles.

2. SHOW, DON'T TELL: Use concrete details and actions
   ❌ "She was nervous."
   ✓ "Her fingers twisted the hem of her glove, the silk threatening to tear. A bead of perspiration traced down her temple despite the cool morning air."
   - Body language reveals emotion
   - Actions reveal character
   - Environment reflects internal state

3. VARIED SENTENCE STRUCTURE:
   - Mix short, punchy sentences with longer, flowing ones
   - Use sentence rhythm to control pacing
   - Short sentences for tension, longer for description
   - Paragraph variety: Some 2 lines, some 8 lines

4. DIALOGUE THAT REVEALS CHARACTER:
   - Each character has distinct speech patterns (see character profiles)
   - Use dialogue tags sparingly (action beats instead)
   - Subtext: characters don't always say what they mean
   - Class/background affects vocabulary and formality
   - Tension through what's NOT said
   Example structure: "<DIALOGUE>," <CHARACTER> said, <ACTION_BEAT>.

   Use only character names from the provided cast list.

5. SENSORY IMMERSION:
   - Include multiple senses per scene (2-3 minimum)
   - Period-specific sensory details from location/temporal profiles
   - Tactile details create immediacy
   - Use sensory palette provided in location profiles
   - Vary sensory focus: visual → auditory → olfactory → tactile

6. PARAGRAPH STRUCTURE:
   - Opening: Hook with action, dialogue, or atmospheric detail
   - Middle: Develop scene, reveal information, build tension
   - Closing: End with revelation, question, or transition
   - Each paragraph should advance story or deepen character

7. PACING VARIATION:
   - Action scenes: Short paragraphs (2-4 lines), quick succession
   - Investigation scenes: Moderate length (4-6 lines), methodical rhythm
   - Atmospheric scenes: Longer paragraphs (6-8 lines), detailed description
   - Revelation scenes: Build slowly with long paragraphs, climax with short punch

8. EMOTIONAL SUBTEXT & TENSION:
   - Characters have hidden secrets/stakes (see character profiles)
   - Every interaction carries subtext based on relationships
   - Build tension through: pauses, interrupted speech, avoided topics, body language
   - Mystery atmosphere: Suspicion, unease, watchfulness
   - Use weather/atmosphere to mirror emotional tension

QUALITY GUIDELINES (strongly preferred):
1. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
2. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
3. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio receivers common in main rooms | domestic telephones with rotary dials, often shared party lines | manual typewriters for correspondence and record keeping | telephone calls routed through local exchange with potential delays | telegrams sent and received at nearest town post office | letters and telegrams primary long-distance communication.
5. Respect setting movement/access constraints in scene action and alibis: main house with locked private quarters and restricted servant areas | estate grounds extensive, limiting rapid movement between outbuildings | weather patterns typical of temperate British countryside affecting outdoor activity | estate isolation results in delayed arrival of external assistance | strict permissions required to enter private family rooms.
6. Sustain social coherence with this backdrop pressure: Amid economic strain and rising political tensions, the landed Stanhope family and their loyal domestic staff are confined within the rigidly controlled manor estate, where social hierarchies and strict household protocols intensify underlying unease.
7. Maintain continuity around these socially central cast anchors where relevant: Inspector Harold Bramwell, Lady Evelyn Stanhope, Charles Stanhope, Margaret Lyle, James Archer, Beatrice Collins.
8. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the timed comparison between the manor clock and the sundial under replicated conditions, Observe the clock lag and sundial shadow absence, Draw conclusion about Charles Stanhope’s guilt
Test type: constraint_proof

**Suspect Clearance Scenes:**
- Margaret Lyle (Act 3, Scene 5): Confirmed alibi by multiple servants and ledger consistency
  Clues: Servant ledger with overlapping shifts and mismatched ink, Housekeeper Margaret Lyle’s control over staff schedules
- James Archer (Act 3, Scene 5): Alibi confirmed by witness statements and timing constraints
  Clues: Butler James Archer’s testimony on clock’s irregular ticking, Displaced clock weights found unevenly hanging
- Beatrice Collins (Act 3, Scene 5): Alibi verified through nursery records and weather journal
  Clues: Witness statements, Weather journal noting fleeting cloud cover
- Dr. Philip Marsh (Act 3, Scene 5): Medical report timing excludes opportunity
  Clues: Medical report, Timing of injury

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with mechanical clock tampering evidence and sundial shadow contradiction

**Clue Placement for These Chapters:**
- clue_11 must appear in Act 1, Scene 3 via Direct observation
- clue_3 must appear in Act 1, Scene 3 via Direct observation
- clue_4 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_mechanism_visibility_core must appear in Act 1, Scene 3 via Direct observation

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Clue Reinterpretation.
Mode required outcomes:
- State original clue meaning and revised meaning.
- Show suspect implications and theory update.
Forbidden at this stage:
- Do not introduce decisive new evidence from nowhere.
Mode-specific narrative balance targets:
- Setting: 5-10%
- Character Reaction: 25-35%
- Clue Reinterpretation: 55-65%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 3-3.
Investigation state at start: 3 clue(s) revealed to reader; approximately 4 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Charles Stanhope
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

MECHANISM REVEAL GATE (withhold): The discriminating test has NOT happened yet. Show observable clues, contradictions, and suspicions, but do NOT yet explain HOW the concealment mechanism actually works, and do not state outright that it was deliberately rigged — keep the method an open question. Reserve the full explanation for the discriminating-test chapter.

## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3,era:story:4</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- ERA RULE (1930s): NEVER use these anachronistic terms: "computer", "internet", "email", "cell phone", "mobile phone", "smartphone", "GPS", "laptop", "digital camera", "text message", "app", "wifi", "bluetooth", "jet plane". Any occurrence will cause the chapter to be rejected.
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder", "the hour stood at". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)", "the investigation had entered a new phase", "finally coming into focus", "setting the stage for the final confrontation".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Stanhope Manor library — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Inspector" or "Inspector's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Inspector" will cause automated rejection.
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "The drizzle slackened, and for a moment the garden seemed to hold its breath. Bramwell stepped back from the sundial, his shoes leaving faint impressions in the moss at its base. The contradiction at the heart of the cas...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • victim, body, shows, puncture, wound, blood, pooling, torn, garment, near [clue_11] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: indicates, manner, death, stabbing, letter, opener
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • inside, library, clock, casing, scratch, marks, pendulum, time, lags, actual [clue_3] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: suggests, pendulum, interference, causing, false, clock, time
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • shows, deliberate, impediment, pendulum, movement [clue_4] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: deliberate, clock, tampering, falsify, timeline
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • brief, dense, cloud, obscured, exactly, quarter, past [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 3/4):
    Characters may draw inferences and name partial conclusions but must NOT state the full mechanism or name the culprit directly. The detective may suspect but not confirm.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Charles Stanhope's established alibi is "Two to four o’clock afternoon". Do NOT place Charles Stanhope at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Charles Stanhope has already made statements in earlier chapters. Any time, location, or claim attributed to Charles Stanhope in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
  - Sensory obligation — use at least two of: warm lamplight glow, dark window panes reflecting interior | typewriter keys clicking, radio broadcasts faintly | burning wood smoke. Mood: focused intensity.
- Locked fact phrase obligations:
  - If this batch mentions Exact time when sundial shadow vanished due to cloud cover, write exactly: "a quarter past two".
  - If this batch mentions Temperature recorded in the garden coinciding with the shadowless period, write exactly: "forty-five degrees Fahrenheit".
  - If this batch mentions Sun’s horizontal angle relative to the sundial at the critical time, write exactly: "ninety-five degrees east of true north".
- Seasonal vocabulary allow-list: spring, vernal, springtime.
- Forbidden seasonal words: summer, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Inspector Harold Bramwell: he/him/his
    Lady Evelyn Stanhope: she/her/her
    Charles Stanhope: he/him/his
    Margaret Lyle: she/her/her
    James Archer: he/him/his
    Beatrice Collins: she/her/her
    Dr. Philip Marsh: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 3-3.
Investigation state at start: 3 clue(s) revealed to reader; approximately 4 unresolved suspect(s).
Must change by end: Reframe prior clue meaning and update suspect implications.
Suspect pressure target(s): Charles Stanhope
Required new information: Earlier clue gets revised meaning with explicit theory update.
Forbidden reveals at this stage: Do not introduce decisive new evidence from nowhere.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: May (spring).
- Month, season, weather, and time-of-year language in this batch must stay compatible with spring.
- Established timeline fact: Quarter past two sundial shadow disappearance
- Established timeline fact: Library clock pendulum obstruction between 1:45 and 3:00
- Established timeline fact: Servants’ ledger shift times from 1:30 to 4:00
- If referenced, use exact phrase: "a quarter past two" (Exact time when sundial shadow vanished due to cloud cover).
- If referenced, use exact phrase: "forty-five degrees Fahrenheit" (Temperature recorded in the garden coinciding with the shadowless period).
- If referenced, use exact phrase: "ninety-five degrees east of true north" (Sun’s horizontal angle relative to the sundial at the critical time).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Sundial’s Silent Witness
Inspector Harold Bramwell stepped onto the slick flagstones of the Stanhope Manor garden near the sundial, the cold dampness of the late spring morning seeping through the soles of his shoes. A faint drizzle hung in the overcast air, muting the usual birdsong and lending a muffled hush to the courtyard. The scent of wet earth mingled with the sharper tang of moss rising from the ancient stone, and the only sound was the distant, hollow echo of a church bell marking the hour. Before Bramwell, Lady Evelyn Stanhope lay sprawled at the base of the moss-clad sundial, her silk day dress darkened by the moisture and the blood that had spread in a slow, chilling bloom across her side. The ornate letter opener, its handle glinting dully in the grey light, protruded from beneath her ribs—a jarring intrusion upon the ordered serenity of the estate.

Bramwell’s gaze, trained by years of habit, swept the immediate scene. The sundial’s surface—worn smooth by decades of Yorkshire rain—should have cast a precise shadow at this hour, yet now it was eerily blank, the gnomon’s tip failing to mark any division on the stone. The engraved numerals, usually so reliable for the household’s routines, were rendered useless by the diffuse, shadowless light. And yet, as Bramwell knelt beside Lady Evelyn Stanhope, the low murmur of voices behind him carried a persistent refrain: several witnesses insisted they had seen her alive at exactly a quarter past two, the time supposedly confirmed by the sundial’s shadow. He noted the contradiction, his mind already cataloguing the first fissure in the day’s account.

He straightened, careful not to disturb the hem of Lady Evelyn Stanhope’s skirt where it brushed the damp cobbles. The air was thick with a kind of brittle expectancy, as if the garden itself awaited a pronouncement. Bramwell’s eyes lingered on the sundial, the absence of its shadow more eloquent than any testimony. If the sun had been obscured—if a dense bank of cloud had passed over at precisely a quarter past two—then the certainty of that time, so confidently cited, was undermined. The sundial’s blank face became not a confirmation, but a silent rebuke to the witnesses’ claims. He made a note to inquire further, aware that the mechanics of time at Stanhope Manor might prove as unreliable as its inhabitants.

Charles Stanhope, the estate’s heir and Lady Evelyn’s husband, stood a pace back from the body, his posture rigid beneath the clinging drizzle. The cut of his wool suit—fashionably narrow at the lapels, but rumpled now—spoke of a man accustomed to control, yet his right hand gripped the edge of the sundial with white-knuckled tension. His gaze avoided Bramwell’s, flickering instead toward the house, as if calculating the distance to sanctuary. "This is a ghastly business, Inspector," Charles said, voice low and edged with a brittle composure. "My wife was—she was well, only an hour ago. I fail to see how such a thing could happen here, of all places." The words were measured, but the tremor in his jaw betrayed more than shock: Bramwell registered the effort it took for Charles to keep his tone even, and the way his thumb traced the sundial’s inscription as if seeking reassurance.

Bramwell acknowledged Charles Stanhope with a nod, his own voice steady. "Order and safety are rarely as robust as we wish, Mr. Stanhope. I will require a clear account of the morning’s events—particularly the movements of all who were present." He let the request hang, watching for the flicker of resistance or evasion. Charles’s lips compressed, and he adjusted his cufflinks with unnecessary precision. "I was in the study from two until four," Charles replied, not meeting Bramwell’s eyes. "I believe several of the staff can confirm as much. The household runs on routine, Inspector. You’ll find nothing amiss there." The assertion was delivered with the polish of a man used to public inquiry, but Bramwell noted the haste with which Charles retreated into the formality of his alibi.

A faint shuffle drew Bramwell’s attention to the edge of the garden, where Margaret Lyle, the estate’s administrator, hovered with a ledger pressed tightly to her chest. Her posture was composed, yet her eyes darted between Bramwell and Lady Evelyn Stanhope’s still form. "I—I was overseeing the accounts in the Servants’ Hall," she offered, her voice barely above a whisper. "Lady Evelyn asked for privacy this morning. She said she wished to walk among the bluebells before luncheon." Margaret’s knuckles whitened on the ledger, and Bramwell caught the subtle tremor in her hand as she spoke. He filed it away—a woman accustomed to managing crises, but shaken by the violence that had invaded her orderly domain.

James Archer, the senior staff member, appeared next, his heavy tread muffled by the sodden grass. He removed his flat cap with a slow, deliberate motion, eyes fixed on the ground. "I saw Lady Evelyn by the sundial at a quarter past two, Inspector. The shadow was clear as anything—could set your watch by it. She waved to me from across the path." His words were delivered with the certainty of a man who believed in the infallibility of routine, but Bramwell’s attention returned to the sundial’s blank face. The testimony, so confidently given, now seemed less a fact than a ritual, repeated to ward off uncertainty.

Bramwell rose, surveying the gathering cluster of faces—Charles Stanhope, Margaret Lyle, James Archer—each bearing their own version of composure, each marked by a private unease. The drizzle had intensified, beading on the leather spines of the gardening tools left beside the path, and the cold pressed insistently through Bramwell’s coat. He addressed the group, his tone measured. "I shall need to speak to each of you in turn. For now, no one is to leave the grounds. The circumstances demand thoroughness, not haste." His words were met with a ripple of assent, subdued and wary.

A brief lull settled over the garden, broken only by the soft patter of rain on stone and the distant clatter of a typewriter from the manor’s library window. The estate’s routines, so carefully maintained, were unraveling at the seams. Bramwell knelt once more by Lady Evelyn Stanhope, examining the placement of the letter opener and the angle of her fall. There was no sign of a struggle—the violence had been swift, almost clinical. Her eyes, half-open, seemed fixed on the sundial, as if seeking an answer that had been denied her in life.

Bramwell’s mind returned to the sundial’s blankness, the absence of a shadow at the critical moment. If a dense, low-hanging cloud had passed over at precisely a quarter past two, then the witnesses’ certainty was built on illusion. The garden’s silence, the drizzle, the cold—all conspired to erase the markers of time, leaving only uncertainty in their wake. He would need to reconstruct the day’s events with care, aware that the first and most trusted witness—the sundial itself—might have been rendered unreliable by nothing more than the vagaries of spring weather.

He rose, brushing a fleck of moss from his trouser leg, and signaled for the others to return to the house. The investigation, he knew, would be a contest not only against deception but against the subtle betrayals of memory and routine. As Bramwell cast a final glance at Lady Evelyn Stanhope, the weight of the manor’s silence pressed in, promising that the answers would not yield themselves easily. For now, the only certainty was the chill in the air and the shadow that should have been, but was not.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Conflicting Time
"You’re certain you saw the shadow, Mr. Archer?" Bramwell’s voice cut through the chill drizzle as he advanced once more toward the sundial, his shoes scraping softly against the damp stone. The air in the Manor garden and sundial area was heavy with moisture, the scent of rain-soaked moss rising as if the earth itself exhaled. A faint, persistent drizzle blurred the outlines of the linden branches above, their leaves trembling in the pale daylight. Bramwell paused by the sundial, its surface slick and gleaming, and studied the blank stone: not a trace of shadow marked the divisions, though the engraved numerals caught what little light filtered through the overcast sky. He knelt, fingertips brushing the cold, rough edge, his gaze flicking from the sundial’s gnomon to the cloud bank overhead—a dense, unbroken wall of grey that had, at "a quarter past two," wholly obscured the sun. The silence was broken only by the distant, muffled clatter of a typewriter from an open window, the estate’s routines continuing in uneasy counterpoint.

The implication pressed in with quiet force. If the sundial had been rendered mute by that cloud bank at "a quarter past two," then the certainty of the witnesses—James Archer’s confident assertion, Charles Stanhope’s composed agreement—was built on sand. Bramwell straightened, his coat shedding beads of rain, and let his eyes linger on the faces gathered nearby. The sundial, so often the estate’s arbiter of routine, had failed them at the critical moment. The timeline, once anchored by the supposed reliability of its shadow, now drifted into ambiguity. Someone, Bramwell reasoned, was either mistaken or had seized upon the sundial’s reputation to lend weight to a lie. The contradiction was no longer a subtle fissure—it was a fault line, and it ran directly beneath the feet of all who claimed certainty.

Charles Stanhope shifted his weight, the movement slight but telling. His gaze, which had been fixed on the house’s distant windows, darted back to the sundial and then to Bramwell. "You must understand, Inspector, the household depends on that sundial for everything—luncheon, the gardener’s rota, even Lady Evelyn’s walks. It’s never failed us before." Charles’s tone was measured, but the edge of impatience was unmistakable, as if he resented the necessity of doubt. He adjusted the cuff of his wool jacket, the gesture too precise to be casual. "I was in the study, as I said. The servants saw me. If the sundial was… unreliable, well, perhaps the weather is to blame. But you’ll find the routine was observed, as always." The words were polished, but Bramwell caught the flicker of something else—anxiety, perhaps, or the first tremor of fear.

A gust of wind rattled the linden leaves, scattering droplets across the cold stone. Margaret Lyle, standing just beyond the sundial’s plinth, clutched her ledger more tightly to her chest. Her eyes, red-rimmed but dry, darted from Charles to Bramwell. "Lady Evelyn said she wanted solitude this morning," Margaret murmured, her voice barely rising above the whisper of rain. "She dismissed me before two. I was in the Servants’ Hall, checking the accounts." The ledger’s cover, battered and stained, bore the marks of years of careful use. Bramwell noted the way Margaret’s thumb worried at a frayed corner, her composure brittle beneath the surface. "I saw James pass by the window just after two. He was carrying the post." Margaret’s statement was precise, but the tremor in her hand betrayed her nerves.

James Archer, cap in hand, shifted from foot to foot. "I’d stake my pension on it, sir. The shadow was there. Lady Evelyn waved to me—she was standing just so, by the gnomon. I remember because the bell had just finished striking the quarter. You could set your watch by it." His certainty was absolute, but Bramwell’s attention lingered on the sundial’s blank face. The man’s faith in routine was touching, but faith was not evidence. The drizzle intensified, beading on James’s cap and the shoulders of his worn jacket. Bramwell let the silence stretch, watching for the moment when certainty might crack.

The garden’s hush was broken by the faint, metallic click of a window latch above, followed by the distant drone of a radio—some BBC announcer’s clipped vowels drifting down through the rain. Bramwell turned to Charles Stanhope, who stood rigid as a statue, his jaw clenched. "You say you were in the study from two until four. Can anyone confirm you never left?" Bramwell’s tone was mild, but the question hung between them like a blade. Charles’s lips curled in a semblance of a smile. "If you wish to question the staff, Inspector, you’ll find their recollections quite reliable. I have nothing to hide." Yet his eyes slid away from Bramwell’s, and his hand returned to the sundial’s inscription, tracing the letters with a distracted, almost desperate precision.

A moment’s silence, thick with the scent of wet earth and the underlying tension of withheld truths, settled over the group. Bramwell’s mind worked methodically: the sundial’s authority had been invoked to anchor a timeline, but the weather had intervened, erasing the very evidence upon which so much certainty depended. The contradiction was not a minor error; it was a deliberate or unconscious manipulation of routine. If the sun had not cast a shadow at "a quarter past two," then Lady Evelyn Stanhope’s last sighting could not be fixed with the confidence the witnesses claimed. The timeline was now fluid, and with it, the boundaries of guilt and innocence.

He let his gaze travel from Charles to Margaret, then to James, weighing the subtle shifts in posture and tone. Charles’s brittle composure, Margaret’s anxious precision, James’s unwavering faith—all revealed more than their words. The pressure of the moment was beginning to tell, and Bramwell recognized the first cracks in the estate’s carefully maintained order. He made a mental note to examine the household’s clocks and ledgers, aware that the manipulation of time—both mechanical and social—might prove the key to unraveling the day’s events.

The drizzle slackened, and for a moment the garden seemed to hold its breath. Bramwell stepped back from the sundial, his shoes leaving faint impressions in the moss at its base. The contradiction at the heart of the case had been exposed: the sundial, trusted for decades, had betrayed them all at the critical moment. The investigation would now turn on the question of who had exploited that betrayal, and why. As Bramwell signaled for the group to disperse, the weight of suspicion settled most heavily on Charles Stanhope, whose polished denials and restless gaze betrayed a man for whom routine had become a trap rather than a refuge. The contest between deception and truth had begun in earnest.
--- END PRIOR CHAPTER 2 ---

# Case Overview
Title: The Sundial’s Silent Hour at Stanhope Manor
Era: 1930s
Setting: Stanhope Manor Estate
Crime: murder (stabbing with letter opener)
Culprit: Charles Stanhope
Victim: Lady Evelyn Stanhope
False assumption: The victim was seen alive precisely at quarter past two by multiple witnesses, confirmed by the sundial’s shadow.
Cast: Inspector Harold Bramwell (he/him), Lady Evelyn Stanhope (she/her), Charles Stanhope (he/him), Margaret Lyle (she/her), James Archer (he/him), Beatrice Collins (she/her), Dr. Philip Marsh (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Stanhope Manor Estate). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Stanhope Manor Estate" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Inspector Harold Bramwell — he/him/his (NEVER she/her)
• Lady Evelyn Stanhope — she/her/her (NEVER he/him)
• Charles Stanhope — he/him/his (NEVER she/her)
• Margaret Lyle — she/her/her (NEVER he/him)
• James Archer — he/him/his (NEVER she/her)
• Beatrice Collins — she/her/her (NEVER he/him)
• Dr. Philip Marsh — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 3,
    "act": 1,
    "title": "The Library Clock and the Wound",
    "setting": {
      "location": "Stanhope Manor library",
      "timeOfDay": "Midday",
      "atmosphere": "Quiet, with an undercurrent of suspicion"
    },
    "characters": [
      "Inspector Harold Bramwell",
      "Charles Stanhope"
    ],
    "purpose": "Reveal physical evidence and early contradictions in timekeeping",
    "cluesRevealed": [
      "clue_11",
      "clue_3",
      "clue_4"
    ],
    "dramaticElements": {
      "conflict": "Physical evidence contradicts witness timeline",
      "tension": "Scratch marks on clock suggest tampering",
      "microMomentBeats": [
        "Bramwell pauses, noting the bloodstain’s pattern with a furrowed brow"
      ]
    },
    "summary": "Bramwell inspects the victim’s puncture wound consistent with a letter opener and notes the torn garment. He then examines the library clock, discovering scratch marks inside the casing and an irregular pendulum causing the clock to lag and then accelerate, suggesting deliberate interference with the timekeeping.",
    "beat": "first_enquiries",
    "estimatedWordCount": 2000,
    "emotionalRegister": "Rising suspicion and confusion arise from conflicting witness statements and the seeming reliability of the sundial.",
    "dominantCharacterNote": {
      "name": "Inspector Harold Bramwell",
      "voiceRegister": "Measured, deliberate, and quietly ironic, Inspector Bramwell speaks with calm authority and a subtle dry wit."
    },
    "humourGuidance": {
      "permission": "conditional",
      "condition": "Only if tone supports it"
    },
    "eraTextureNote": "Limited communication technology: rotary telephones on party lines and manual typewriters dominate correspondence.; Travel constrained to petrol-powered automobiles and steam trains, slowing external assistance.; Social protocol restricts movement within the estate, with segregated servant passages and locked private quarters.; Mechanical clocks and sundials are relied upon but subject to environmental and mechanical limitations.; Weather conditions such as overcast skies and drizzle affect visibility and sound, preserving physical clues but obscuring natural time markers.",
    "locationRegisterNote": "",
    "mechanismRevealAllowed": false
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: spring, vernal, springtime.
□ Forbidden seasonal words: summer, autumn, winter.
□ Chapter 3: the clue [clue_11] (body, discovery, scene, victim, puncture, wound, consistent, being, stabbed, letter, opener, blood) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_3] (library, clock, pendulum, scratch, marks, inside, casing, time, lags, real, several, minutes) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_4] (pendulum, impeded, deliberately, causing, clock, show, inaccurate, time, creating, false, timeline) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_mechanism_visibility_core] (brief, dense, cloud, cover, quarter, past, erased, sundial, shadow, making, witnesses, mistakenly) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Clue Reinterpretation): chapter states prior clue meaning and revised meaning with explicit theory change.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Inspector Harold Bramwell | he/him/his/himself        | [fill in]     | [yes/no]
  Lady Evelyn Stanhope | she/her/her/herself       | [fill in]     | [yes/no]
  Charles Stanhope     | he/him/his/himself        | [fill in]     | [yes/no]
  Margaret Lyle        | she/her/her/herself       | [fill in]     | [yes/no]
  James Archer         | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Collins     | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Philip Marsh     | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```
