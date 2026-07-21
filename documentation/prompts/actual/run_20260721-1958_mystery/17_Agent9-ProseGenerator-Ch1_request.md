# Actual Prompt Record

- Run ID: `mystery-1784663896191`
- Project ID: ``
- Timestamp: `2026-07-21T20:04:09.181Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `9bdd5889395abe1a`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman), Hugo Vane (man) — DECEASED, past-tense only.
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane?" If not, remove them.
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of jealousy, believing they were protecting a loved one from betrayal." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY & OPENING HOOK (ROADMAP_TO_80 M2): The murder victim is Hugo Vane. Name them — Hugo Vane — in the FIRST PARAGRAPH; never open with "the victim" or "the body". Open IN MEDIAS RES: the first one or two sentences must land the discovery and the single unsettling CONTRADICTION (the impossible detail that starts the case), seen through the investigator's eyes. Weave sensory and atmosphere detail AROUND that hook — do NOT precede the stakes with a standalone scene-setting/weather preamble. They are found dead — they do not speak, react, or gesture. This is their only physical appearance in the story.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane (DECEASED)
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: Classy Socialite
   - Captain Ivor Hale: War Veteran
   - Beatrice Quill: Social Climber
   - Sylvia Trent: Professional
   - Hugo Vane: victim (DECEASED — does not appear in any scene, past tense only)
   - Never place characters in locations inconsistent with their role

## FIRST-APPEARANCE SUSPECT INTRO CONTRACT (MANDATORY)
When a character below appears for the first time in this batch, their first beat must establish all of the following in natural prose:
1. Public identity (who they are in this household/social world)
2. Connection to the victim
3. Why they matter to the investigation now
4. Surface behaviour plus one subtle suspicious/emotional tell
5. The investigator's immediate read of that behaviour (provisional, not a verdict)
Bad (too thin): "Captain Hale stood nearby."
Good pattern: "Captain Hale, the household steward and the victim's trusted adviser, stood nearest the body. His posture was disciplined, but his hand tightened around his watch chain."
Use subtle pressure cues only. Do not write confessions or explicit guilt declarations in first appearances.

- Eleanor Voss
  Public identity anchor: Local Journalist; detective 
  Connection to victim: Skeptical acquaintances; Eleanor is suspicious of Hugo's business practices.; Eleanor has written unfavorably about Hugo's past dealings, causing friction between them..
  Investigation relevance: is actively driving interviews and credibility checks in this scene.
  Suspicion/pressure cue seed: Desire for closure.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Dr. Mallory Finch
  Public identity anchor: Physician; suspect 
  Connection to victim: Rivals in the community; both are vying for the favor of wealthy patrons.; Their competitive nature has led to public spats and gossip about their ethics..
  Investigation relevance: access plausibility: medium | alibi window: 10:00 PM - 10:30 PM.
  Suspicion/pressure cue seed: Reputation.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Captain Ivor Hale
  Public identity anchor: Retired Navy Captain; suspect 
  Connection to victim: Rival businessmen; both have interests in the same property developments.; Their rivalry has often led to public disagreements over business ethics..
  Investigation relevance: access plausibility: high | alibi window: 10:00 PM - 10:30 PM.
  Suspicion/pressure cue seed: Honor.
  Investigator read: include one immediate observational inference (gesture, gaze target, pause, object grip), but do not state guilt as fact.

- Sylvia Trent
  Public identity anchor: Hotel Manager; suspect 
  Connection to victim: Business associates; both are involved in high-stakes social event
[truncated for prompt budget]

WORLD DOCUMENT (use this as your primary creative context):

## Era: June 1949
In June 1949, the atmosphere is fraught with tension as the world grapples with the aftermath of World War II. The seaside town's hotel, a refuge for vacationers and business travelers alike, is a microcosm of the broader societal shifts. Overcast skies and sporadic rain showers add to the sense of unease, while the whispers of the Cold War loom heavily in the air. Guests navigate the complexities of emerging social norms, with women increasingly taking on roles in the workforce, challenging traditional family dynamics. The hotel echoes with the sounds of laughter juxtaposed against the distant crash of waves, symbolizing both a longing for normalcy and the undercurrents of suspicion and fear that plague the community.
Emotional register: A collective anxiety mixed with a fragile hope as society seeks to rebuild.
Physical constraints: Limited public transport options affected by post-war recovery. | Rationing still impacting daily life. | The hotel’s remote location adds to the feeling of isolation.
Current tensions (weave into background texture): The establishment of NATO in April 1949. | Rising tensions in the Korean Peninsula as North Korea shows military aggression. | Continued investigations into war crimes from WWII.
Wartime context — Many veterans are returning home, grappling with their experiences.: The return of soldiers creates a complex dynamic of expectation and disillusionment. Absence effect: The absence of loved ones lost in the war creates a melancholic undercurrent.

## Season Lock (mandatory — derived from June 1949)
Season: summer. Allowed vocabulary: summer, summery, midsummer
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with summer.

## Story Theme
In the midst of post-war recovery, a mechanical clock-tampering murder reveals the fragility of human secrets and the cost of confronting one's past, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The overall emotional character of the story is one of tension and unease, underpinned by a quest for truth.

Arc:
The emotional journey begins with the heavy atmosphere of the Oceanview Hotel, where a stormy night sets the stage for the chilling discovery of Hugo Vane's body. The initial shock of the murder casts a pall over the guests, as whispers of suspicion ripple through the air. As Eleanor Voss steps into her role as investigator, she finds herself drawn into a web of secrets and lies, uncovering the first clues amid rising tension. Each interview with the suspects reveals layers of complexity, leading to a sense of unease that mounts as false leads emerge, threatening to derail her progress. The pressure intensifies when a pivotal revelation shifts her focus, forcing her to confront not only the mechanics of the murder but also the darker recesses of her own past.

As the investigation reaches its climax, the emotional stakes are at their highest, with the guests' true motivations laid bare amidst a tense confrontation. The climax occurs in a charged atmosphere of accusations and revelations, where the manipulation of time becomes a metaphor for the characters' hidden truths and the costs of their ambitions. Ultimately, as the mystery unravels, each character is left to grapple with the consequences of their actions, leading to a resolution that is both cathartic and haunting. The emotional costs of the murder resonate deeply, leaving Eleanor and the other characters to reflect on their own narratives, as they seek closure in a world forever altered by their choices.

## Emotional register at this point in the story
The atmosphere is thick with anticipation and dread as the murder is discovered.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the shifting landscape of the post-war era as a journalist, grappling with her own traumas from the war. Her role reflects the growing acceptance of women in professional spaces, yet she remains haunted by the ghosts of her past. As she investigates the murder, she embodies the struggle for personal and professional credibility amid societal upheaval.
Era intersection: Her investigation into the murder serves as a metaphor for her quest for truth and healing in a world still reeling from conflict.

### Dr. Mallory Finch
Dr. Mallory Finch presents herself as a respected physician, embodying the post-war ideal of women as both caregivers and professional figures. However, her hidden secrets reveal the darker side of ambition in a changing society. Her fear of exposure reflects the societal pressures many women face as they navigate career and reputation in the aftermath of war.
Era intersection: Mallory's struggles with embezzlement mirror the moral complexities of a society still recovering from the chaos of the war.

### Captain Ivor Hale
Captain Ivor Hale represents the veterans returning to a world that has moved on without them. His dignified exterior masks a simmering resentment from his wartime experiences, making his character a poignant commentary on the challenges faced by soldiers reintegrating into post-war life. His honor is at stake, reflecting the broader theme of legacy in a changing world.
Era intersection: Ivor's internal conflict highlights the struggle to maintain honor in a society that is redefining its values in the wake of war.

### Beatrice Quill
Beatrice Quill embodies the aspirations of a new generation of women seeking independence and success in a still-conservative society. Her ambition is both a strength and a vulnerability, showcasing the risks women take to secure their place in a post-war world. Her fear of exposure due to her affair with the victim reveals the stakes of ambition in a time of shifting social norms.
Era intersection: Beatrice's narrative reflects the evolving role of women in society, as they navigate ambition and personal integrity amidst societal expectations.

### Sylvia Trent
Sylvia Trent, the hotel manager, balances professionalism with the weight of her personal vices. Her involvement in gambling highlights the ongoing struggles with morality and excess that many face during post-war recovery. As a woman in charge, she represents both progress and the complexities that accompany power in a changing world.
Era intersection: Sylvia's secrets point to the hidden struggles many women faced as they reclaimed their independence in a society grappling with the past.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured cadence, often punctuating her observations with a wry smile.
[comfortable] Isn't it fascinating how the truth has a way of revealing itself?
[evasive] Well, you know how it is — sometimes the story writes itself, doesn't it?
[stressed] I just need to find the right angle, but everything feels so... slippery.
Humour: Her dry wit adds a layer of complexity to her interactions.

### Dr. Mallory Finch (she/her/her)
Mallory speaks with an eloquent precision, often employing gentle sarcasm.
[comfortable] Isn't it delightful how ignorance can be so blissful?
[evasive] Oh, I wouldn't worry too much about the past; it has a way of fading, doesn't it?
[stressed] I promise, my integrity is intact, as long as no one looks too closely.
Humour: Her polite savagery often catches others off guard.

### Captain Ivor Hale (he/him/his)
Ivor’s speech is marked by clipped precision, reflecting his military background.
[comfortable] In my day, we faced our battles head-on.
[evasive] It's best not to dwell on past mistakes; they only serve to weigh you down.
[stressed] I assure you, I had no reason to threaten anyone.
Humour: His bluntness often leaves little room for misinterpretation.

### Beatrice Quill (she/her/her)
Beatrice speaks with an animated flair, her words tumbling out in a rush.
[comfortable] Life’s a stage, darling, and I intend to be the star!
[evasive] Oh, you know, just a little harmless gossip — nothing to worry about!
[stressed] What if they find out? My career would be over!
Humour: Her sardonic wit shines through in her remarks.

### Sylvia Trent (she/her/her)
Sylvia speaks in a straight, no-nonsense manner, reflecting her commitment to efficiency.
[comfortable] We all have our little vices; it keeps life interesting.
[evasive] It's simply a matter of managing one's priorities, wouldn't you agree?
[stressed] I don’t have time for this; we need to focus on maintaining order!
Humour: Her deadpan delivery often contrasts with the chaos around her.

## Location Registers (scene framing guides)

The Hotel Lounge: The lounge is imbued with an air of foreboding, where the laughter of guests feels forced against the backdrop of the recent tragedy. Shadows loom large, and the flickering candlelight plays tricks on the mind, amplifying the unease that lingers in every corner.. Camera angle: Entering this space, the writer should focus on the tension that hangs in the air, capturing the delicate balance between hospitality and dread.. Era: The dim lighting reflects the somber mood of the post-war era, where safety feels elusive.

The Grand Dining Room: The Grand Dining Room exudes an air of celebration mixed with an undercurrent of anxiety. Guests dine on sumptuous meals, yet the tension palpable in their hushed conversations hints at the shadows lurking just outside the light of their tables.. Camera angle: The writer should frame this space as a stage where the characters' masks can slip, revealing their deeper fears.. Era: This room symbolizes the contrast between the elegance of post-war dining and the lingering fears of exposure.

Staff Quarters: The Staff Quarters are a stark reminder of the labor required to maintain the hotel's facade. The utilitarian design fosters an atmosphere of muted conversations and tired bodies, where the weight of secrets can feel suffocating amidst the camaraderie of shared struggles.. Camera angle: The writer should portray this area as a hidden world, contrasting with the glamour of the guest areas.. Era: The simplicity of this space reflects the ongoing challenges of post-war life, where workers strive for dignity amidst economic uncertainty.

Beach Access Path: The Beach Access Path offers a deceptive sense of tranquility, where the sound of crashing waves provides a false sense of security. However, the isolation of the beach echoes the characters' internal struggles, reminding them of their vulnerabilities and the secrets they carry.. Camera angle: The writer should capture the juxtaposition of serenity and turmoil, emphasizing the characters' emotional battles.. Era: This secluded stretch symbolizes the longing for escape in a time of uncertainty and fear.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder creates an atmosphere where humor feels inappropriate.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: The murder occurred at the time indicated by the grandfather clock.
- Hidden truth to progressively expose (compose in your own words from these elements): clock, tampered, mislead, investigation
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: grandfather, clock, lobby, shows, time, minutes, past | corr: contradicts, witness, statements, claiming, hugo, alive, clock | effect: narrows, murder, window, before, minutes, past
  - Step 2: obs: clock, pendulum, dust, indicating, hasn, moved, recently | corr: clock, tampered, create, false, time | effect: eliminates, possibility, clock, accurate, time, death
  - Step 3: obs: loose, gear, near, grandfather, clock | corr: gear, indicates, tampering, clock, mechanism | effect: eliminates, mallory, finch, culprit, lacks, clock, tampering, skills
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): comparison, clock, pendulum, motion, staged, reveal, inconsistencies
- Test must rely on already-shown clue IDs: clue_4, clue_11, clue_3
- Fair-play rationale: Step 1: The grandfather clock's time (early) and witness statements (mid) reveal the time conflict. Step 2: The dust on the pendulum (mid) indicates tampering. Step 3: The loose gear (discriminating test) confirms mechanical interference.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured cadence, often punctuating her observations with a wry smile
She has a tendency to ask rhetorical questions, which she answers herself with an ironic twist.
Battles self-doubt and the haunting memories of her wartime experiences, which threaten to undermine her confidence.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Dr. Mallory Finch (she/her — NEVER he/him)
Mallory speaks with an eloquent precision, often employing a gentle sarcasm that reveals her sharp intellect
She has a habit of framing her critiques as compliments, masking her true feelings beneath a veneer of politeness.
Struggles with the fear of being exposed for her embezzlement, which threatens to destroy her reputation and philanthropic endeavors.
Voice colour: Dr. Mallory Finch uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor’s speech is marked by a clipped precision, often reflecting his military background
He speaks with an authoritative tone, rarely indulging in frivolity, but when he does, it is with a stark bluntness that leaves little room for misunderstanding.
Struggles with the resentment of his tarnished legacy, caught between the honor of his past and the shame of his present.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with an animated flair, her words tumbling out in a rush, often punctuated by dramatic pauses
She employs theatrical expressions, making her dialogue feel larger than life, and her sardonic wit shines through in her remarks.
Struggles with the fear of being exposed for her affair and the lengths she is willing to go to protect her career.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks in a straight, no-nonsense manner, often delivering her lines with a dry, unwavering tone
Her words are precise and devoid of embellishment, reflecting her commitment to efficiency.
Struggles with the fear of being exposed for her gambling, torn between her professional responsibilities and her personal indulgences.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured cadence, often punctuating her observations with a wry smile. She has a tendency to ask rhetorical questions, which she answers herself with an ironic twist.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "“Truth is a slippery fish.”"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it fascinating how the truth has a way of revealing itself?"
  [evasive] "Well, you know how it is — sometimes the story writes itself, doesn't it?"
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor was invited to the hotel for a writing retreat." — do not surface in Act I.

### Dr. Mallory Finch[SHE]
Voice & mannerisms: Mallory speaks with an eloquent precision, often employing a gentle sarcasm that reveals her sharp intellect. She has a habit of framing her critiques as compliments, masking her true feelings beneath a veneer of politeness.
SIGNATURE TIC (use sparingly — this is Dr. Mallory Finch's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "“Isn't it delightful how ignorance can be so blissful?”"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it delightful how ignorance can be so blissful?"
  [evasive] "Oh, I wouldn't worry too much about the past; it has a way of fading, doesn't it?"
Humour: polite savagery — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fears that the victim's knowledge of her embezzlement will ruin her reputation." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor’s speech is marked by a clipped precision, often reflecting his military background. He speaks with an authoritative tone, rarely indulging in frivolity, but when he does, it is with a stark bluntness that leaves little room for misunderstanding.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "“In my day, we faced our battles head-on.”"
Sample voice fragments (match this register and rhythm):
  [comfortable] "In my day, we faced our battles head-on."
  [evasive] "It's best not to dwell on past mistakes; they only serve to weigh you down."
Humour: blunt — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Believes the victim was about to publicly expose his past mistakes." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with an animated flair, her words tumbling out in a rush, often punctuated by dramatic pauses. She employs theatrical expressions, making her dialogue feel larger than life, and her sardonic wit shines through in her remarks.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "“Life’s a stage, darling.”"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life’s a stage, darling, and I intend to be the star!"
  [evasive] "Oh, you know, just a little harmless gossip — nothing to worry about!"
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Was desperate to prevent the victim from exposing their affair." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks in a straight, no-nonsense manner, often delivering her lines with a dry, unwavering tone. Her words are precise and devoid of embellishment, reflecting her commitment to efficiency.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "“We all have our little vices.”"
Sample voice fragments (match this register and rhythm):
  [comfortable] "We all have our little vices; it keeps life interesting."
  [evasive] "It's simply a matter of managing one's priorities, wouldn't you agree?"
Humour: deadpan — deploy rarely (level 0.2)
FORBIDDEN phrase (never write for Sylvia Trent): "he was utterly speechless"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fears the victim will reveal her gambling debts to the hotel ownership." — do not surface in Act I.



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
ERA AUTHENTICITY (1940s):

1. FORBIDDEN terms (did not exist):
   ❌ Modern technology

2. REQUIRED period markers (include 2+ per scene):
   ✓ Formal address: Mr./Mrs./Miss/Dr./Sir/Lady
   ✓ Period technology: period-appropriate items
   ✓ Fashion: period clothing

3. Use period-authentic language and social norms

LOCATION PROFILES:

You have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.

Primary Location: The Oceanview Hotel (St. Ives, England)
An elegant seaside hotel with Art Deco flair, popular among vacationers and business travelers, overlooking the tumultuous Atlantic.

Key Locations Available:
- The Hotel Lounge (interior): Crime scene
- The Grand Dining Room (interior): Gathering space
- Staff Quarters (interior): Restricted access area
- Beach Access Path (transitional): Restricted access to the beach

Atmosphere (tonal cue only — do NOT reproduce this phrase verbatim in prose; translate into scene-specific, character-observed sensory language): Tense and mysterious, as guests are unsettled by recent events at the hotel.
Weather: Overcast with occasional rain showers, typical for coastal regions during the spring.

Era markers: Radio broadcasts in the lounge | Rationed automobiles parked outside | Staff in wartime uniforms | Limited public transport schedules

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (St. Ives, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. OPENING GROUNDING (required, first 1-2 paragraphs of EVERY chapter): (a) name the specific location from this list, (b) give at least 2 concrete sensory details (sound, smell, temperature, texture, light/shadow), and (c) one time-of-day or weather/atmosphere detail — BEFORE advancing plot, clues, or the mechanism. Open on the setting and the people in it, not on the puzzle.
8. This matters most in pre-reveal chapters that withhold the mechanism: ground them in setting and character rather than rushing the investigation — a withheld chapter is not an empty one.
9. Do NOT use generic repeated manor/storm filler without profile-specific details; vary the opening location/sense each chapter

SENSORY PALETTE (use 2-3 senses per scene):
The Hotel Lounge (interior):
  - Visual: flickering candlelight casting shadows, rain-streaked windows, art deco murals depicting ocean scenes
  - Sounds: soft jazz playing in the background, clinking of glasses, whispers of anxious conversations
  - Scents: rich tobacco smoke, beeswax from candles, damp sea air
  - Touch: soft velvet upholstery, cool marble underfoot

The Grand Dining Room (interior):
  - Visual: gleaming silverware on crisp white tablecloths, chandeliers sparkling with light, ocean waves crashing against the rocks outside
  - Sounds: clatter of dishes being served, soft murmur of polite conversation, the pop of champagne corks
  - Scents: aromatic herbs and roasted meats, freshly baked pastries, the scent of polished wood
  - Touch: smoothness of fine china, softness of linen napkins

Staff Quarters (interior):
  - Visual: bare walls adorned with schedules, narrow bunks stacked against the walls, faded photos of past employees
  - Sounds: muffled voices from the hallway, the creak of floorboards, the sound of water running
  - Scents: the scent of soap and bleach, faint traces of food, the odor of damp laundry
  - Touch: the rough texture of bunk beds, cold metal of a doorknob

⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM: The above profiles are structural guides only. Generate original prose that evokes these qualities; do not reproduce the exact phrasing or sentence structure of the profile paragraphs.

SCENE OPENING RULE: When opening a scene in a new location, write what the POV character directly observes and physically senses at that
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In June 1949, the atmosphere is fraught with tension as the world grapples with the aftermath of World War II
- The seaside town's hotel, a refuge for vacationers and business travelers alike, is a microcosm of the broader societal shifts
- Overcast skies and sporadic rain showers add to the sense of unease, while the whispers of the Cold War loom heavily in the air
- Guests navigate the complexities of emerging social norms, with women increasingly taking on roles in the workforce, challenging traditional family dynamics
- The hotel echoes with the sounds of laughter juxtaposed against the distant crash of waves, symbolizing both a longing for normalcy and the undercurrents of suspicion and fear that plague the community.

TEMPORAL CONTEXT:

This story takes place in June 1949 during summer.

Seasonal Atmosphere:
- Weather patterns: Overcast skies with sporadic rain showers, Cool breezes from the nearby coast, Humidity typical for coastal regions
- Daylight: Long summer days with twilight stretching into the evening, sunset occurring around nine o'clock.
- Seasonal activities: Strolling along the beachfront promenade, Participating in local summer fairs or carnivals, Enjoying outdoor dining at seaside cafes
- Seasonal occasions: Father's Day (June 19)
- Season: summer

Period Fashion (describe naturally):
- Men formal: Navy blue suit with a light-colored dress shirt, Black leather shoes with polished finish, Silk tie in a geometric pattern
- Men casual: Short-sleeved cotton shirts with floral patterns, Lightweight linen trousers, Canvas loafers
- Men accessories: Fedora hats, Wristwatches with leather straps, Suspenders for a relaxed fit
- Women formal: Tea-length dresses with floral prints, Straw hats adorned with ribbons, Heels with open toes
- Women casual: Cotton blouses paired with high-waisted shorts, Lightweight summer cardigans, Ballet flats in pastel colors
- Women accessories: Pearl necklaces, Clutch purses, Sunglasses with oversized frames

Cultural Context (reference naturally):
- Music/entertainment: 'Some Enchanted Evening' from South Pacific, 'A Little Bird Told Me' by Evelyn Knight, 'Cruising Down the River' by The Four Aces; Films: The Third Man, All the King's Men; Theatre: South Pacific, The King and I; Radio: The Adventures of Sam Spade, Suspense
- Typical prices: Loaf of bread: four pence, Bottle of milk: one shilling, Movie ticket: one shilling sixpence
- Current events: The establishment of NATO in April 1949; Tensions rising in the Korean Peninsula as North Korea shows military aggression
- Literature: 'The Naked and the Dead' by Norman Mailer | 'The Catcher in the Rye' by J.D. Salinger | '1984' by George Orwell | [Mystery and detective fiction] | [Social realism] | [Post-war literature]
- Technology: Transistor radio | Automatic telephone dialing | First commercial jet airliner, the de Havilland Comet | Standard radios in homes | Typewriters still prevalent in offices | Early television sets beginning to appear in households
- Daily life: Visiting local parks for picnics, Attending community events or fairs, Dining at neighborhood diners
- Social rituals: Sunday family dinners, Engaging in weekend outings to the beach, Participating in local sports events

Atmospheric Details:
The salty tang of the ocean air mingles with the scent of rain-soaked pavement. The muted sounds of laughter and conversation echo in the hotel lobby, punctuated by the occasional clap of thunder. Dim lighting casts long shadows in the corners of the elegant dining room, as guests share hushed whispers and furtive glances.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The time displayed on the tampered clock when the murder was staged.: "five minutes to ten"
    ⛔ FORBIDDEN alternatives: "9:55", "9.55", "nine fifty-five", "nine-fifty-five", "nine past fifty-five", "quarter past nine", "half past nine" — the ONLY acceptable form is "five minutes to ten"
  - The true time of death when the pendulum was stopped.: "ten minutes past nine"
    ⛔ FORBIDDEN alternatives: "9:10", "9.10", "nine ten", "nine-ten", "nine past ten", "quarter past nine", "half past nine" — the ONLY acceptable form is "ten minutes past nine"
  - The time when witnesses believed the victim was still alive.: "a quarter to ten"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_mechanism_visibility_core] pendulum, grandfather, clock, stopped, create, false, timeline, hugo, death
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: mechanism, murder, involves, stopping, clock, pendulum

• [clue_culprit_direct_dr_mallory_finch] direct, ties, mallory, finch, mechanism, access, point, before, discriminating, excludes, competing, suspect
  Category: temporal | Criticality: essential | Supports inference step 2
  Points to: direct, shows, mallory, finch, means, opportunity, narrowing, solution, uniquely, toward, culprit, eligible

• [clue_mid_1] grandfather, clock, lobby, shows, time, minutes, past
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: clock, time, altered

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The time displayed on the tampered clock when the murder was staged.: "five minutes to ten"
  • The true time of death when the pendulum was stopped.: "ten minutes past nine"
  • The time when witnesses believed the victim was still alive.: "a quarter to ten"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Suspect cleared: Captain Ivor Hale[HE] — Proving he was checking the time, not tampering.
• Suspect cleared: Beatrice Quill[SHE] — Her infatuation does not equate to murder.
• Suspect cleared: Sylvia Trent[SHE] — Alibi confirmed: 10:00 PM - 10:30 PM
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (opening): Discover the body, confirm the victim, establish the scene. The victim is found dead. They do not speak, react, or gesture. This is their only physical appearance — in all subsequent chapters they exist only in past tense (memory, evidence, testimony).
═══════════════════════════════════════════════════════

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
Known location profile anchors: The Oceanview Hotel, The Hotel Lounge, The Grand Dining Room, Staff Quarters, Beach Access Path, the lobby of the seaside hotel
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Oceanview Hotel", "The Hotel Lounge", "The Grand Dining Room", "Staff Quarters", "Beach Access Path", "the lobby of the seaside hotel"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the lobby of the seaside hotel". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

⛔ ABSOLUTE PRONOUN LOCK — NO EXCEPTIONS

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Dr. Mallory Finch: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Captain Ivor Hale: ALWAYS he/him/his/himself — NEVER she/her/herself
  • Beatrice Quill: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Sylvia Trent: ALWAYS she/her/her/herself — NEVER he/him/his/himself
  • Hugo Vane: ALWAYS he/him/his/himself — NEVER she/her/herself

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
   WRONG: "Eleanor watched Hale; she crossed the room and he frowned." (ambiguous antecedent)
   RIGHT: "Eleanor watched Hale; Hale crossed the room and Eleanor frowned." (explicit)
9. In dialogue attribution, the pronoun refers to the SPEAKE
[truncated for prompt budget]

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=8090; context=12442; dropped=[none]; truncated=[first_appearance_contracts, location_profiles, temporal_context, pronoun_accuracy]

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
- Chapter numbering starts at 1 and increments by 1 per scene.
- Each chapter has 4-8 substantial paragraphs (each 120–180 words) — TARGET ≥ 1250 words — do not stop early.
- Use dark tone and short length guidance.
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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television | radar equipment | long-distance telephone calls | military-style encryption for sensitive information | post-WWII recovery.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | access to the beach restricted to guests | common areas crowded during peak hours | restricted access to staff-only areas | guest identification required for entry.
6. Sustain social coherence with this backdrop pressure: A recent murder at a remote seaside hotel draws together a diverse group of guests and staff, all grappling with the social upheaval of post-war recovery and the pressures of emerging Cold War tensions.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.75 with 'The Second Key' (similar crime type and method)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.80 with 'The Second Key' (similar cast structure and roles)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt
Test type: mechanical comparison

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Proving he was checking the time, not tampering.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Her infatuation does not equate to murder.
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Alibi confirmed: 10:00 PM - 10:30 PM

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence.

**Clue Placement for These Chapters:**
- clue_mechanism_visibility_core must appear in Act 1, Scene 1 via Direct observation

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Discovery Opening.
Mode required outcomes:
- Victim is named explicitly and the body is encountered within the first two paragraphs.
- Major suspects are introduced with relevance and tension.
- First clue is planted without full mechanism explanation.
Forbidden at this stage:
- No culprit reveal.
- No full murder mechanism explanation.
- Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.
Mode-specific narrative balance targets:
- Setting: 15-20%
- Character Introductions: 35-40%
- Discovery Reactions: 25-30%
- First Clue: 10-15%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Sylvia Trent, Beatrice Quill
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3,era:story:4</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- ERA RULE (1940s): NEVER use these anachronistic terms: "internet", "email", "cell phone", "mobile phone", "smartphone", "GPS", "laptop", "digital camera", "text message", "app", "wifi", "bluetooth". Any occurrence will cause the chapter to be rejected.
- STYLE HARD-BAN: NEVER use these phrase families: "clock tower at quarter past three", "near the clock tower at quarter past", "showed quarter past three when the body", "in the formal gardens during the murder", "the hour stood at". Any occurrence triggers rejection/retry.
- STYLE SOFT-BAN: avoid these stock phrases and rewrite them if they appear in draft text: "lips pressed into a thin line", "the household runs smoothly when every cog", "the pressures upon this household are many", "the doctor [Surname] (use Dr. Surname or 'the doctor', never role + bare surname)", "the captain [Surname] (use Captain Surname or 'the captain', never role + bare surname)", "the inspector [Surname] (use Inspector Surname or 'the inspector', never role + bare surname)", "the sergeant [Surname] (use Sergeant Surname or 'the sergeant', never role + bare surname)", "the constable [Surname] (use Constable Surname or 'the constable', never role + bare surname)", "the gentleman [Surname] (use Mr. Surname or 'the gentleman', never role + bare surname)", "the investigation had entered a new phase", "finally coming into focus", "setting the stage for the final confrontation".
- STYLE WATCHLIST: keep these patterns varied and scene-specific: "quarter past three", "three fifteen", "the old bell striking three fifteen", "the chimes echoed just after three-fifteen".
- Chapter 1:
  - STRUCTURAL ARCHETYPE — Chapter 1 must be: DISCOVERY
      ✓ MUST contain: body found / victim identified
      ✗ MUST NOT contain: formal accusation or interrogation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - VICTIM IDENTITY LOCK (MANDATORY): name the victim as "Hugo Vane" in the discovery scene. After first mention, do not use unnamed placeholders such as "the victim" without naming Hugo Vane in the same paragraph.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: the lobby of the seaside hotel — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - INVESTIGATOR ESTABLISHMENT REQUIRED: Eleanor Voss must claim or be recognised as the investigator in this chapter. Establish Eleanor Voss as the detective-in-charge within the first two paragraphs — Eleanor Voss IS the investigator. Do NOT have any character suggest a "real" detective is still coming, or imply that authority has not yet been delegated. Eleanor Voss begins the investigation in this chapter.
  - ⛔ BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only): the victim's body must be physically encountered or described within the first TWO paragraphs. Do NOT spend the opening paragraphs solely on clock examination, atmospheric setup, or character introductions before the body is found. Required Chapter 1 structure: atmosphere (one sentence max) → body/discovery → investigator reaction → suspects → first time-source contradiction.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • pendulum, swinging [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • dust, visible, pendulum [clue_culprit_direct_dr_mallory_finch] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • clock, shows, time, minutes, past [clue_mid_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: clock, time, altered
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - PLANT OBLIGATIONS (incidental appearances): each item below MUST appear in this chapter as a passing physical detail a character sees, handles, or walks past — with its significance UNFLAGGED:
    • pendulum, swinging [plant:clue_early_1]
    • gear, lying, floor [plant:clue_late_1]
    Rules: set dressing only. NO character comments on its importance, NO narrator hint ("little did they know", "something about it seemed off" are FORBIDDEN), NO inference drawn. It simply exists in the scene, naturally. Its significance surfaces in a LATER chapter — planting it casually here is what makes that later reveal feel fair.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 1/4):
    Characters may OBSERVE anomalies (wrong time, missing object, odd detail) but must NOT explain the mechanism, deduce the method, or name the culprit. Discovery and reaction only.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "10:00 PM - 10:30 PM". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
- Locked fact phrase obligations:
  - If this batch mentions The time displayed on the tampered clock when the murder was staged., write exactly: "five minutes to ten".
  - If this batch mentions The true time of death when the pendulum was stopped., write exactly: "ten minutes past nine".
  - If this batch mentions The time when witnesses believed the victim was still alive., write exactly: "a quarter to ten".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

⛔ PRONOUN TABLE — re-check after EVERY paragraph before writing the next:
    Eleanor Voss: she/her/her
    Dr. Mallory Finch: she/her/her
    Captain Ivor Hale: he/him/his
    Beatrice Quill: she/her/her
    Sylvia Trent: she/her/her
    Hugo Vane: he/him/his
  Any sentence containing a pronoun must agree with this table. Correct mismatches before moving on.

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 1-1.
Investigation state at start: 0 clue(s) revealed to reader; approximately 0 unresolved suspect(s).
Must change by end: Introduce cast relevance and plant first clue while keeping culprit unresolved.
Suspect pressure target(s): Dr. Mallory Finch, Captain Ivor Hale, Sylvia Trent, Beatrice Quill
Required new information: First clue observation tied to suspect landscape.
Forbidden reveals at this stage: No culprit reveal. | No full murder mechanism explanation. | Do not state the direction, magnitude, or agent of any clock or device tampering. Characters may only observe that two time sources disagree. "The clock was wound back by forty minutes" must not appear before Chapter 3.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: The clock was last seen working at 9:45 PM.
- Established timeline fact: Hugo was last seen at the gala at 10:00 PM.
- If referenced, use exact phrase: "five minutes to ten" (The time displayed on the tampered clock when the murder was staged.).
- If referenced, use exact phrase: "ten minutes past nine" (The true time of death when the pendulum was stopped.).
- If referenced, use exact phrase: "a quarter to ten" (The time when witnesses believed the victim was still alive.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The grandfather clock showing a time that seems off."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that the time on the grandfather clock is inconsistent with the timeline of events."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Captain Ivor Hale claims to have seen Hugo alive at a quarter to ten, casting doubt on the timeline.

# Case Overview
Title: The Stopped Pendulum
Era: 1940s
Setting: Seaside Hotel
Crime: murder (mechanical tampering)
Culprit: Dr. Mallory Finch
Victim: Hugo Vane
False assumption: The murder occurred at the time indicated by the grandfather clock.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Seaside Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Seaside Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

⛔ PRONOUN LOCK (verify every sentence before writing):
• Eleanor Voss — she/her/her (NEVER he/him)
• Dr. Mallory Finch — she/her/her (NEVER he/him)
• Captain Ivor Hale — he/him/his (NEVER she/her)
• Beatrice Quill — she/her/her (NEVER he/him)
• Sylvia Trent — she/her/her (NEVER he/him)
• Hugo Vane — he/him/his (NEVER she/her)

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the lobby of the seaside hotel",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Sylvia Trent",
      "Beatrice Quill",
      "Hugo Vane"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_mechanism_visibility_core",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_mid_1"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor catches a glimpse of the grandfather clock, its hands frozen in time."
      ]
    },
    "summary": "Eleanor Voss arrives at the seaside hotel to find a tense atmosphere. The body of Hugo Vane is discovered in the lobby, and the shocked guests gather around. As Eleanor processes the scene, she notices the grandfather clock showing a time that seems off, hinting at deeper mysteries.",
    "beat": "gathering",
    "estimatedWordCount": 1250,
    "pivotElement": "The grandfather clock showing a time that seems off.",
    "factEstablished": "Establishes that the time on the grandfather clock is inconsistent with the timeline of events.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Captain Ivor Hale claims to have seen Hugo alive at a quarter to ten, casting doubt on the timeline."
    },
    "emotionalRegister": "The atmosphere is thick with anticipation and dread as the murder is discovered.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured cadence, often punctuating her observations with a wry smile."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited public transport options affected by post-war recovery.; Rationing still impacting daily life.; The hotel’s remote location adds to the feeling of isolation.",
    "locationRegisterNote": "",
    "cluesPlanted": [
      "clue_early_1",
      "clue_late_1"
    ]
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 450 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
□ Chapter 1: the clue [clue_mechanism_visibility_core] (pendulum, grandfather, clock, stopped, create, false, timeline, hugo, death) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: the clue [clue_culprit_direct_dr_mallory_finch] (direct, ties, mallory, finch, mechanism, access, point, before, discriminating, excludes, competing, suspect) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: the clue [clue_mid_1] (grandfather, clock, lobby, shows, time, minutes, past) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Mode check (Discovery/Opening): victim is explicitly named and major suspects are introduced before deep mechanism explanation.
□ Mode check (Discovery/Opening): no culprit reveal and no full murder mechanism explanation.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | she/her/her/herself       | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
  Sylvia Trent         | she/her/her/herself       | [fill in]     | [yes/no]
  Hugo Vane            | he/him/his/himself        | [fill in]     | [yes/no]
□ Return valid JSON only.
```
