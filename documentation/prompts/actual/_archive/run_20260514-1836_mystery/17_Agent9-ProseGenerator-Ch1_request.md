# Actual Prompt Record

- Run ID: `mystery-1778783763479`
- Project ID: ``
- Timestamp: `2026-05-14T18:41:03.854Z`
- Agent: `Agent9-ProseGenerator-Ch1`
- Operation: `chat_request_full_prompt`
- Model: `GPT-4o-mini`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `fedf27b2e8b364c2`

## Message 1 (role=system)

```text
You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (man), Captain Ivor Hale (man), Beatrice Quill (woman).
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill?" If not, remove them.
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
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. If a sensory phrase (e.g., "air thick with tension", "smell of polished wood") has appeared in any prior chapter, rephrase it entirely. No atmospheric sentence should appear verbatim or near-verbatim in more than one chapter.
- TEMPLATE LEAKAGE BAN: Never emit scaffold prose like "At The [Location] ... the smell of ... atmosphere ripe for revelation". Rewrite any scaffold-like sentence into chapter-specific prose tied to character action.
- TEMPORAL CONSISTENCY: If a month is mentioned (for example, May), season wording in the same timeline must be compatible with that month.
- DENOUEMENT REQUIREMENT: The final chapter of any act or the story must show concrete consequences, not just reflection. At minimum: state what happened to the culprit (arrest, flight, confession), show how relationships changed between surviving characters, and give the detective one moment of personal resolution (relief, regret, or changed understanding). Emotional aftermath is required.
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer was driven by a desperate need to protect their family's reputation, leading the reader to question the morality of their actions." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.


⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.

PRONOUN ACCURACY — MANDATORY CONTINUITY CONTRACT

The following pronouns are locked facts, on the same level as character names
and hard-logic device values. Using the wrong pronoun is a continuity error,
not a style choice.

Canonical pronoun table (subject / object / possessive / reflexive):
  • Eleanor Voss: she/her/her/herself
  • Dr. Mallory Finch: he/him/his/himself
  • Captain Ivor Hale: he/him/his/himself
  • Beatrice Quill: she/her/her/herself

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
   "Graham Worsley excused herself" is a pronoun error regardless of sentence position.
6. In dialogue attribution ("he said", "she replied"), the attribution pronoun must
   agree with the SPEAKER's gender — not the last character named inside the quoted speech.
7. In nested or cleft clauses ("It was she who had…", "It was he that…"), pronoun
   gender must still match the referent character's canonical set in the table.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: character
   - Dr. Mallory Finch: character
   - Captain Ivor Hale: character
   - Beatrice Quill: character
   - Never place characters in locations inconsistent with their role

WORLD DOCUMENT (use this as your primary creative context):

## Era: 1939-07
In July 1939, the English countryside is cloaked in a tapestry of overcast skies, punctuated by the occasional glimmer of sunshine peeking through the clouds. Rain showers come and go, refreshing the vibrant greens of the estate grounds. The long summer evenings stretch into twilight, lending an air of unease as guests at the country house gather for dinner, their conversations revealing apprehensions about the unfolding political landscape in Europe. As tensions rise globally, the atmosphere is thick with unspoken fears, reminiscent of the brooding summer storms that threaten to break. Fashion among the guests reflects a blend of elegance and practicality, with men donning light wool suits, crisp white shirts, and patterned ties, while women grace the scene in tea-length dresses adorned with floral prints and wide-brimmed straw hats. Accessories such as pearl necklaces and leather gloves add an air of sophistication, embodying the glamour of the time while remaining mindful of the economic strains from the Great Depression. The duality of style and circumstance is palpable, as guests navigate the expectations of their social class amidst a backdrop of rising uncertainties. Daily life at the estate flows with an air of tradition, where afternoon tea rituals are punctuated by the clink of china and the aroma of freshly baked scones. Guests partake in garden parties, exchanging pleasantries while subtle glances betray their underlying preoccupations with the world outside. As evening descends, the strains of popular music from the radio fill the air, providing a fleeting escape from the mounting concerns of political strife and class tensions that permeate their conversations. These social rituals, while seemingly mundane, are layered with the weight of expectation and the reality of a rapidly changing world.
Emotional register: A collective anxiety permeates society as the threat of war looms and economic instability lingers.
Physical constraints: Limited transportation due to economic constraints | Communication primarily through letters and early telephones | Social gatherings often confined to the elite due to class divisions
Current tensions (weave into background texture): Rising tensions in Europe as World War II looms | Nazi Germany's aggressive expansionism | Lingering effects of the Great Depression
Wartime context — Increasing enlistment in the military as fears of war rise.: Communities are deeply divided by class and economic status. Absence effect: Families face the emotional toll of having loved ones serve in the military.

## Story Theme
The Clockwork Conspiracy reveals how the pressure of societal expectations can drive individuals to desperate actions, ultimately exposing the fragility of reputation and honor, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: A tense atmosphere filled with suspicion and the weight of societal expectation permeates the narrative.

Arc:
As the elite gather at Little Middleton Manor for a weekend retreat, the air is thick with opulence and unspoken fears. The clock stops ticking at ten minutes past eleven, marking the moment when a murder occurs, sending shockwaves through the guests. Eleanor Voss, determined to prove herself in a male-dominated field, steps into the role of detective, driven by the urgency to protect her family's reputation amidst the swirling rumors of financial instability. As she delves into the investigation, initial clues emerge—witnesses recall the victim's mention of an appointment, heightening the tension as Eleanor confronts her own self-doubt while seeking the truth.

The investigation grows increasingly complex as conflicting accounts arise, leading to a series of false leads that test Eleanor's resolve. With each step forward, the emotional cost weighs heavily on her, as the delicate web of relationships among the guests reveals both alliances and betrayals. Midway through, a pivotal revelation shifts Eleanor's focus: the clock has been tampered with, suggesting a deeper conspiracy at play, implicating those she thought she could trust.

As pressure mounts, the climax unfolds in a tense confrontation where Eleanor must confront Captain Ivor Hale, who has secrets of his own, fueling the emotional stakes. In the chaotic aftermath, the resolution brings forth the painful acknowledgment of the cost of truth; relationships are strained, alliances shattered, and the characters are left grappling with the consequences of their actions. Each of them carries the burden of their choices, reshaped by the events of that fateful night, as the clockwork conspiracy unravels their lives forever.

## Emotional register at this point in the story
The atmosphere is one of opulence intertwined with unspoken fears, setting the stage for the impending tragedy.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss navigates the complexities of a society gripped by uncertainty and class tensions, desperately trying to maintain her family's reputation amidst the whispers of financial ruin. Her role as an amateur sleuth becomes a means to assert her value in a male-dominated world, reflecting the broader struggles faced by women during this era.
Era intersection: Eleanor's private struggle with her family's financial instability mirrors the societal pressures of the 1930s, where the elite grappled with diminishing fortunes.

### Dr. Mallory Finch
Dr. Mallory Finch is a respected figure in a community where traditional values are being challenged by modern medical practices. His fear of being overshadowed by younger doctors speaks to the broader anxieties of a profession in transition, as the threat of exposure looms over his ethical decisions.
Era intersection: Dr. Finch's internal conflict highlights the tension between old and new medical practices, reflecting the societal shifts occurring in the late 1930s.

### Captain Ivor Hale
Captain Ivor Hale grapples with the disillusionment and resentment felt by many veterans as society changes around them. His pride and honor, once celebrated, now clash with the disdain of the upper class, mirroring the broader struggles of class identity in a time of economic despair.
Era intersection: Hale's struggle against social snobbery and his need for respect reflect the societal tensions faced by those who served during the war.

### Beatrice Quill
Beatrice Quill embodies the ambitions and vulnerabilities of a young woman striving for success in a male-dominated literary world. Her desperation to escape her working-class roots and achieve recognition speaks to the challenges faced by women in the 1930s, as they navigate societal expectations and personal aspirations.
Era intersection: Beatrice's quest for literary success reflects the changing roles of women and the pressures of social mobility during this period.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a refined accent, often punctuating her words with a light lilt that conveys both charm and urgency.
[comfortable] Isn't it lovely to gather like this? The gardens are simply enchanting in the summer.
[evasive] Oh, I'm sure it was nothing serious. Just a little misunderstanding between friends.
[stressed] We must find the truth before rumors ruin everything my family has built!
Humour: Eleanor often employs dry wit, offering clever quips that reveal her sharp intellect.

### Dr. Mallory Finch (he/him/his)
Dr. Finch's clipped, precise sentences often carry a hint of sarcasm, reflecting his authoritative yet vulnerable demeanor.
[comfortable] The human body is a fascinating puzzle, isn't it? Every case is a new challenge.
[evasive] I'm certain the rumors are exaggerated; my methods are perfectly sound.
[stressed] If anyone discovers my past, it would ruin everything I've worked for!
Humour: His sardonic humor occasionally surfaces, providing a glimpse of his inner turmoil.

### Captain Ivor Hale (he/him/his)
Captain Hale's commanding tone is often laced with self-deprecating humor, revealing his struggle with self-worth.
[comfortable] Ah, the tales I could tell! The seas were my true home, but this... well, it's something else.
[evasive] I wouldn't worry too much about that; just a passing comment from someone who doesn't know better.
[stressed] I can't let their disdain for veterans tarnish my honor any longer!
Humour: His self-deprecating humor often serves as a mask for deeper frustrations.

### Beatrice Quill (she/her/her)
Beatrice's energetic cadence and rapid-fire dialogue reflect her vivacious spirit and underlying anxiety.
[comfortable] I simply must tell you about the latest plot twist in my story—it's absolutely thrilling!
[evasive] Oh, my past? Just some silly little things that don't matter now, really.
[stressed] What if they find out? My entire future could be at stake!
Humour: Beatrice's sardonic remarks often lighten the mood, masking her deeper fears.

## Location Registers (scene framing guides)

Drawing Room: The drawing room serves as a stage for the unspoken drama among the elite, where each conversation is tinged with suspicion and unease. The opulence of the decor contrasts sharply with the tension in the air, creating a sense of foreboding that envelops the guests.. Camera angle: Entering the drawing room feels like stepping into a carefully crafted tableau, where every glance exchanged carries the weight of secrets.. Era: As the 1930s come to a close, the drawing room reflects a society on edge, caught between tradition and the looming threat of change.

Library: The library is a sanctuary of knowledge and secrets, where the musty smell of old books mingles with a sense of foreboding. Each shadow cast by the flickering lamp hints at hidden truths waiting to be uncovered, creating an atmosphere thick with tension.. Camera angle: Entering the library feels like stepping into a world of forgotten stories, where every book may hold the key to the truth.. Era: The library's collection reflects the intellectual pursuits of the 1930s, yet it also serves as a reminder of the weight of history and the burden of knowledge.

Master Suite: The master suite is an opulent but oppressive space, where the heavy drapes and lavish decor conceal the weight of secrets. The air is thick with tension, as if the walls themselves are burdened by the truths they hide.. Camera angle: Entering the master suite feels like stepping into a realm of shadows, where every corner may reveal a hidden truth.. Era: In the 1930s, the master suite symbolizes both wealth and isolation, reflecting the social dynamics at play within the estate.

Gardens: The gardens are a vibrant yet deceptive sanctuary, where the beauty of blooming flowers masks the potential for intrigue. The air is filled with the fragrance of blossoms, but the winding paths create a maze of secrets that beckon exploration.. Camera angle: Entering the gardens evokes a sense of both tranquility and tension, as the beauty of the landscape belies the secrets it holds.. Era: The gardens reflect the leisure pursuits of the upper class in the 1930s, yet they also serve as a backdrop for the personal struggles faced by the characters.

## Humour guidance for this story position (opening)
Permission: forbidden
Rationale: The gravity of the murder sets a serious tone that does not allow for humor.

FAIR-PLAY AND INFERENCE CONTRACT (from CML logic):
- False assumption in force: The murder occurred after the clock stopped at ten minutes past eleven.
- Hidden truth to progressively expose: The clock was tampered with to mislead the timeline.
- Inference path checkpoints to dramatize clearly (observation -> correction -> effect):
  - Step 1: obs: The clock in the study stopped at ten minutes past eleven, and witnesses heard the victim mention an appointment at twenty minutes past eleven. | corr: The murder could not have happened after the clock stopped. | effect: Eliminates the possibility that the murder occurred after the appointment.
  - Step 2: obs: The shadows cast by the sun indicate that the clock must have been wound back. | corr: The time indicated by the clock is inaccurate due to tampering. | effect: Narrows the investigation focus towards the timekeeping devices.
  - Step 3: obs: The clock mechanism shows signs of tampering with fresh tool marks. | corr: This indicates that someone adjusted the clock to mislead the timeline. | effect: Narrows the suspect pool to those who had access to the clock.
- Discriminating test method: trap
- Discriminating test design constraint: Comparing the tampered clock with the schedule of appointments reveals inconsistencies that can only implicate Captain Ivor Hale.
- Test must rely on already-shown clue IDs: clue_1, clue_2, clue_3, clue_mechanism_visibility_core
- Fair-play rationale: Step 1: The clock's stopping time and appointment references establish the timeline. Step 2: Shadow evidence clarifies the actual time of death. Step 3: Tampering evidence on the clock implicates Captain Hale.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.

## Character Reference

### Eleanor Voss
Eleanor speaks with a refined accent, punctuating her sentences with a light lilt
She often employs clever quips that reveal her sharp intellect, though she maintains a polite demeanor that masks her underlying urgency.
Eleanor is torn between her desire to uphold her family's reputation and the fear that the truth may expose deeper issues that could ruin them. Her moral compass is challenged as she navigates the murky waters of loyalty and honesty.

### Dr. Mallory Finch
Finch speaks in clipped, precise sentences, often laced with a hint of sarcasm
His tone is authoritative, yet there's a flicker of vulnerability that occasionally escapes, especially when discussing his field.
Dr. Finch wrestles with the fear that his traditional methods may no longer suffice in a rapidly evolving medical landscape. The possibility of being exposed as unethical gnaws at his conscience, creating a tension that threatens to unravel him.

### Captain Ivor Hale
Captain Hale speaks with a commanding tone, though his words are often laced with self-deprecating humor
He enjoys telling tales of his past, but there's a wistfulness that permeates his stories, revealing a man who feels out of place.
Captain Hale's sense of honor is in conflict with the reality of his current status as a retired veteran. The public insult he endured has left him grappling with feelings of inadequacy and a desperate need to reclaim his lost dignity.

### Beatrice Quill
Beatrice speaks with an energetic cadence, her words flowing rapidly as she peppers her conversations with clever remarks
Her enthusiasm sometimes leads her to overshare, revealing more than she intends.
Beatrice grapples with the moral implications of her ambition, torn between her desire for success and the fear of losing her integrity. The threat of her past being exposed creates a tension that leaves her feeling vulnerable.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss
Voice & mannerisms: Eleanor speaks with a refined accent, punctuating her sentences with a light lilt. She often employs clever quips that reveal her sharp intellect, though she maintains a polite demeanor that masks her underlying urgency.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn't it lovely to gather like this? The gardens are simply enchanting in the summer."
  [evasive] "Oh, I'm sure it was nothing serious. Just a little misunderstanding between friends."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Driven by a fierce desire to protect her family’s reputation, Eleanor feels an urgent need to uncover the truth behind the recent tragedy. The thought of gossip tarnishing her family’s name propels her into action, as she realizes that the stakes have never been higher." — do not surface in Act I.

### Dr. Mallory Finch
Voice & mannerisms: Dr. Finch speaks in clipped, precise sentences, often laced with a hint of sarcasm. His tone is authoritative, yet there's a flicker of vulnerability that occasionally escapes, especially when discussing his field.
Sample voice fragments (match this register and rhythm):
  [comfortable] "The human body is a fascinating puzzle, isn't it? Every case is a new challenge."
  [evasive] "I'm certain the rumors are exaggerated; my methods are perfectly sound."
Humour: sardonic — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Dr. Mallory Finch): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Dr. Finch fears that the victim was on the verge of exposing unethical practices within his clinic, which would not only ruin his reputation but also threaten his very livelihood and legacy as a physician." — do not surface in Act I.

### Captain Ivor Hale
Voice & mannerisms: Captain Hale speaks with a commanding tone, though his words are often laced with self-deprecating humor. He enjoys telling tales of his past, but there's a wistfulness that permeates his stories, revealing a man who feels out of place.
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, the tales I could tell! The seas were my true home, but this... well, it's something else."
  [evasive] "I wouldn't worry too much about that; just a passing comment from someone who doesn't know better."
Humour: self deprecating — deploy rarely (level 0.3)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim publicly insulted him at a gathering, dealing a blow to his honor that he cannot ignore. The need to reclaim his dignity drives him, as he longs to restore the respect he feels has been stripped away." — do not surface in Act I.

### Beatrice Quill
Voice & mannerisms: Beatrice speaks with an energetic cadence, her words flowing rapidly as she peppers her conversations with clever remarks. Her enthusiasm sometimes leads her to overshare, revealing more than she intends.
Sample voice fragments (match this register and rhythm):
  [comfortable] "I simply must tell you about the latest plot twist in my story—it's absolutely thrilling!"
  [evasive] "Oh, my past? Just some silly little things that don't matter now, really."
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Beatrice believes the victim was about to expose her past, which could jeopardize her aspirations of becoming a successful writer. The thought of her dreams unraveling drives her to desperate measures." — do not surface in Act I.



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

Primary Location: Little Middleton Manor (Little Middleton, England)
A grand estate nestled within the lush English countryside, Little Middleton Manor serves as a retreat for the wealthy elite, shrouded in secrets and intrigue.

Key Locations Available:
- Drawing Room (interior): Gathering space for guests
- Library (interior): Restricted area for staff and select guests; potential source of clues
- Master Suite (interior): Private quarters for the estate's owner; potential crime scene
- Gardens (exterior): Outdoor space for guests; potential hiding spots and meeting places

Atmosphere: Tense and brooding, with an underlying sense of unease among the guests.
Weather: Overcast with occasional rain showers, typical for the English countryside in late spring.

Era markers: Guests converse over the crackling radio, the latest news reports mingling with classical music. | Typewriters clack rhythmically in the study where correspondence is meticulously crafted. | The faint ring of an early telephone can be heard, a reminder of the outside world beyond the estate.

USAGE GUIDELINES:
1. First mention of location: Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities
2. Geographic grounding: Reference the specific place (Little Middleton, England) naturally in dialogue or narrative
3. Action scenes: Integrate physical layout details (access, sightlines, constraints)
4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette
5. Era details: Weave in period markers naturally
6. Consistency: Keep all location descriptions aligned with profiles
7. Each chapter opening must anchor to a named location from this list
8. Include at least 2 sensory cues + 1 atmosphere marker in each chapter opening
9. Do NOT use generic repeated manor/storm filler without profile-specific details

SENSORY PALETTE (use 2-3 senses per scene):
Drawing Room (interior):
  - Visual: Richly patterned rugs cover the polished floor, while framed portraits of stern ancestors gaze down from the walls, their expressions seemingly alive with judgment., A grand piano sits in one corner, its surface gleaming, yet untouched, as if waiting for a performance that may never come.
  - Sounds: The soft murmur of conversation fills the air, punctuated by the occasional clink of teacups, while the distant ticking of the grandfather clock provides an unsettling rhythm., Outside, the wind rustles the leaves, a sound that seems to whisper secrets of its own, mingling with the laughter that feels forced.
  - Scents: The scent of polished wood and leather mingles with the rich aroma of Earl Grey tea, creating an atmosphere of indulgence., A faint trace of tobacco smoke hangs in the air, hinting at the presence of a clandestine conversation that has just taken place.
  - Touch: The cushions of the sofas are soft yet firm, inviting yet concealing the tension that lies beneath the surface., The air is cool and slightly damp, a reminder of the rain that has fallen outside, seeping into the very walls of the manor.

Library (interior):
  - Visual: Dust motes dance in the beams of light filtering through the tall windows, creating an ethereal atmosphere amid the shadows., An ornate globe stands in one corner, its surface worn and faded, hinting at journeys long past.
  - Sounds: The soft rustle of pages turning is almost reverent, as if the books themselves hold secrets waiting to be uncovered., A clock ticks softly in the background, its sound blending with the occasional creak of the house settling, creating a sense of timelessness.
  - Scents: The rich scent of old books permeates the air, mingling with the faint aroma of polished wood and leather., A hint of mustiness lingers, a testament to the ye
[truncated for prompt budget]

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In July 1939, the English countryside is cloaked in a tapestry of overcast skies, punctuated by the occasional glimmer of sunshine peeking through the clouds
- Rain showers come and go, refreshing the vibrant greens of the estate grounds
- The long summer evenings stretch into twilight, lending an air of unease as guests at the country house gather for dinner, their conversations revealing apprehensions about the unfolding political landscape in Europe
- As tensions rise globally, the atmosphere is thick with unspoken fears, reminiscent of the brooding summer storms that threaten to break
- Fashion among the guests reflects a blend of elegance and practicality, with men donning light wool suits, crisp white shirts, and patterned ties, while women grace the scene in tea-length dresses adorned with floral prints and wide-brimmed straw hats

TEMPORAL CONTEXT:

This story takes place in July 1939 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast with intermittent rain showers, humid conditions, occasional bursts of sunshine
- Daylight: Long daylight hours with sunset around nine o'clock, providing a mix of twilight and lingering evening light.
- Seasonal activities: garden parties and picnics, evening strolls in the countryside, attending summer fairs and local festivals
- Seasonal occasions: Independence Day (observed in the United States), no major holidays in the UK
- Season: summer

Period Fashion (describe naturally):
- Men formal: three-piece suit in light wool, crisp white dress shirt, silk tie with geometric patterns
- Men casual: linen trousers with a short-sleeved shirt, lightweight blazer, boater hat for sunny days
- Men accessories: cufflinks in silver or gold, pocket watch with chain, leather gloves
- Women formal: tea-length dress with floral prints, straw hat adorned with ribbons, pearl necklace
- Women casual: cotton blouse paired with a flowing skirt, sundress with a cinched waist, light cardigan for cool evenings
- Women accessories: handbag with intricate beading, silk scarf tied around the neck, sunglasses with oversized frames

Cultural Context (reference naturally):
- Music/entertainment: Glenn Miller's 'In the Mood', Django Reinhardt's jazz stylings, Bing Crosby's crooning; Films: 'The Wizard of Oz', 'Gone with the Wind'; Theatre: 'The Glass Menagerie', revival of classic Shakespeare plays; Radio: BBC news broadcasts, various musical variety shows
- Typical prices: Loaf of bread: four pence, Cinema ticket: one shilling, Taxi fare across town: two shillings
- Current events: rising tensions in Europe as World War II looms; Nazi Germany's aggressive expansionism
- Literature: 'The Grapes of Wrath' by John Steinbeck | 'The Maltese Falcon' by Dashiell Hammett | 'The Old Man and the Sea' by Ernest Hemingway | [detective fiction] | [social realism] | [romantic novels reflecting societal changes]
- Technology: early television broadcasts | improved car designs with streamlined bodies | advancements in radio technology | home radios for entertainment and news | typewriters for correspondence | early telephones with party lines
- Daily life: garden parties with tea and pastries, picnics in local parks, attending village fairs
- Social rituals: afternoon tea served with scones, formal invitations sent for dinner parties, local church gatherings on Sundays

Atmospheric Details:
The air is thick with the scent of wet earth following a summer rain, mingling with the floral aromas from the garden. The distant sounds of thunder rumble ominously, while the chatter of guests at the estate takes on a nervous edge. Curtains drawn against the dim light of the evening create a cozy yet oppressive atmosphere, inviting whispers of secrets and conspiracies.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "D
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED):
The following physical evidence values are absolute ground truth. Every time this chapter describes, mentions, or alludes to the relevant evidence — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked facts:
  - The exact time shown on the stopped clock face: "ten minutes past eleven"
  - The exact amount the clock was wound back: "forty minutes"

If a locked fact has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_1] The clock in the study stopped at ten minutes past eleven, and witnesses heard the victim mention an appointment at twenty minutes past eleven.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: The time of the victim's last known interaction.

• [clue_mechanism_visibility_core] A mechanical clock was tampered with to mislead the timeline of the murder.
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: Reveals the core mechanism of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The exact time shown on the stopped clock face: "ten minutes past eleven"
  • The exact amount the clock was wound back: "forty minutes"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: he/him/his
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
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
Known location profile anchors: Little Middleton Manor, Drawing Room, Library, Master Suite, Gardens, the study
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Little Middleton Manor", "Drawing Room", "Library", "Master Suite", "Gardens", "the study"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with a named character performing a physical action or motion — e.g. "[Name] crossed the threshold…" / "[Name] set down the glass…" / "[Name] rose from the chair…". Anchor opening in "the study". HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark. These are validated requirements, not style suggestions; missing them triggers a retry.

PROMPT BUDGET SUMMARY: budget=32000 tokens; fixed=5334; context=10441; dropped=[none]; truncated=[location_profiles, temporal_context]

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
- Each chapter has 5-8 substantial paragraphs (each 120–180 words) — TARGET ≥ 1250 words — do not stop early.
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

QUALITY GUARDRAILS (MUST SATISFY):
1. FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
2. FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
3. FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
4. FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
5. Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.
6. Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.
7. In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).
8. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasts for news and entertainment | early home telephones with party lines | typewriters for correspondence | telephone systems for local and intercity calls | telegram services for urgent messages | airmail for faster communication with distant contacts.
9. Respect setting movement/access constraints in scene action and alibis: manicured grounds with hedgerows creating natural barriers | multiple access points with restricted areas for guests and staff | interior layout with hidden passages and locked rooms | restricted areas for staff only, such as the library and the master suite | daily routines dictating access to various parts of the house.
10. Sustain social coherence with this backdrop pressure: A wealthy elite gathers at a country house estate for a weekend retreat, where the pressures of the Great Depression and class tensions simmer beneath the surface, creating an atmosphere ripe for intrigue and betrayal.
11. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill.
12. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.80 with 'The Mysterious Affair at Styles' (same crime type and method)
13. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Sign of the Four' (similar cast dynamics)

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the clock's tampering evidence, Draw conclusion about Captain Hale's guilt
Test type: mechanical comparison

**Suspect Clearance Scenes:**
- Dr. Mallory Finch (Act 3, Scene 5): Showing his medical alibi during the time of the murder.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Her alibi is confirmed by multiple eyewitnesses.
  Clues: clue_id_3, clue_id_4

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence of the clock tampering.

**Clue Placement for These Chapters:**
- clue_1 must appear in Act 1, Scene 1 via Direct observation of the stopped clock.

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate. Follow these specifications precisely.


## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3,era:story:4</used_assets>
Replace the list with only the IDs of texture assets you actually used. If you used none, output <used_assets></used_assets>.
```

## Message 2 (role=user)

```text
Write the full prose following the outline scenes.



CHAPTER OBLIGATION CONTRACT (MUST SATISFY):
- Chapter 1:
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Location anchor: the study.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening paragraph will be rejected.
  - CLUE OBLIGATIONS — mandatory prose elements (do NOT omit or bury):
    • The clock in the study stopped at ten minutes past eleven, and witnesses heard the victim mention an appointment at twenty minutes past eleven. [clue_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: The time of the victim's last known interaction.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • A mechanical clock was tampered with to mislead the timeline of the murder. [clue_mechanism_visibility_core] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: Reveals the core mechanism of the crime.
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
- Locked fact phrase obligations:
  - If this batch mentions The exact time shown on the stopped clock face, write exactly: "ten minutes past eleven".
  - If this batch mentions The exact amount the clock was wound back, write exactly: "forty minutes".
- Seasonal vocabulary allow-list: summer, summery, midsummer.
- Forbidden seasonal words: spring, autumn, winter.

FROZEN TIMELINE STATE (DO NOT ALTER):
- Timeline anchor: July (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: The clock stopped at ten minutes past eleven.
- Established timeline fact: Witnesses recall the victim mentioning a meeting at twenty minutes past eleven.
- If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face).
- If referenced, use exact time phrase: "forty minutes" (The exact amount the clock was wound back).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- No previous chapter text exists yet for this batch.

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 1 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The stopped clock showing ten minutes past eleven"
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis."
  RED HERRING (MANDATORY — seed naturally, not flagged as false): [rh_1] Witnesses claim they saw the victim arguing with an unknown figure just before the minutes eleven.

# Case Overview
Title: The Clockwork Conspiracy
Era: 1930s
Setting: Little Middleton
Crime: murder (clock tampering)
Culprit: Captain Ivor Hale
False assumption: The murder occurred after the clock stopped at ten minutes past eleven.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (he/him), Captain Ivor Hale (he/him), Beatrice Quill (she/her)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Little Middleton). Do not introduce a different location type.

Outline scenes:
[
  {
    "sceneNumber": 1,
    "act": 1,
    "title": "Discovery",
    "setting": {
      "location": "the study",
      "timeOfDay": "Morning after the murder",
      "atmosphere": "Tense household awaiting the detective's arrival"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Dr. Mallory Finch",
      "Beatrice Quill"
    ],
    "purpose": "Introduce the crime and detective",
    "cluesRevealed": [
      "clue_1",
      "clue_mechanism_visibility_core"
    ],
    "dramaticElements": {
      "conflict": "Locked room mystery established",
      "tension": "Every suspect had access to the victim",
      "microMomentBeats": [
        "Eleanor stands frozen, staring at the stopped clock, her heart racing."
      ]
    },
    "summary": "In the study, Eleanor Voss discovers the body of the victim, a clock stopped at ten minutes past eleven. The atmosphere is thick with tension as the suspects gather, each reacting to the shocking discovery.",
    "estimatedWordCount": 1800,
    "pivotElement": "The stopped clock showing ten minutes past eleven",
    "factEstablished": "Establishes the victim died no later than eleven past eleven, contradicting three suspects' alibis.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "normal social behaviour; grief or confusion"
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "normal social behaviour; grief or confusion"
      },
      {
        "characterName": "Dr. Mallory Finch",
        "behaviour": "normal social behaviour; grief or confusion"
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "normal social behaviour; grief or confusion"
      }
    ],
    "redHerringPlacement": {
      "redHerringId": "rh_1",
      "placementDetail": "Witnesses claim they saw the victim arguing with an unknown figure just before the minutes eleven."
    },
    "emotionalRegister": "The atmosphere is one of opulence intertwined with unspoken fears, setting the stage for the impending tragedy.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a refined accent, often punctuating her words with a light lilt that conveys both charm and urgency."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Limited transportation due to economic constraints; Communication primarily through letters and early telephones; Social gatherings often confined to the elite due to class divisions",
    "locationRegisterNote": ""
  }
]
```

## Message 3 (role=user)

```text
BEFORE SUBMITTING YOUR JSON — verify this checklist:
□ Each chapter reaches the hard floor of 500 words and aims for 1250 words or more.
□ If you mention locked evidence, you used the exact locked phrase verbatim.
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
□ Chapter 1: "The clock in the study stopped at ten minutes past eleven, and witnesses heard the victim mention an appointment at twenty minutes past eleven." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ Chapter 1: "A mechanical clock was tampered with to mislead the timeline of the murder." is placed in the first 25% of the chapter, followed by an explicit inference or suspicion paragraph.
□ PRONOUN AUDIT — for every character you named in your chapters, list the pronouns you actually used, then verify against the canonical table. Correct any mismatch before outputting. Do NOT include this audit in your JSON output.
  Character            | Canonical     | Used in draft | Match?
  ---------------------|---------------|---------------|-------
  Eleanor Voss         | she/her/her/herself       | [fill in]     | [yes/no]
  Dr. Mallory Finch    | he/him/his/himself        | [fill in]     | [yes/no]
  Captain Ivor Hale    | he/him/his/himself        | [fill in]     | [yes/no]
  Beatrice Quill       | she/her/her/herself       | [fill in]     | [yes/no]
□ Return valid JSON only.
```
