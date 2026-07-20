# Actual Prompt Record

- Run ID: `mystery-1784579381610`
- Project ID: ``
- Timestamp: `2026-07-20T20:37:27.917Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.6599999999999999`
- Max Tokens: `4500`
- Attempt: `retry 2`
- Prompt Hash: `78219b958712f261`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman) — DECEASED, past-tense only, Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman), Hugo Vane (man).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer acted out of desperation to protect a loved one, blurring the lines between right and wrong." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Dr. Mallory Finch is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Dr. Mallory Finch is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Dr. Mallory Finch said, "…"` / `Dr. Mallory Finch turned to him`. RIGHT: `Dr. Mallory Finch had said, weeks before, that…` / `Agnes remembered how Dr. Mallory Finch used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Dr. Mallory Finch beside an action or speech verb. A live dialogue tag or present action for Dr. Mallory Finch is a continuity failure that will be rejected and regenerated.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch (DECEASED), Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: victim (DECEASED — does not appear in any scene, past tense only)
   - Captain Ivor Hale: Authority Figure
   - Beatrice Quill: Dreamer
   - Sylvia Trent: Manipulator
   - Hugo Vane: Deal Maker
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

## Era: June 1946
In the summer of 1946, Europe is still reeling from the aftermath of World War II. The streets are filled with returning soldiers, and communities are slowly rebuilding amidst rising inflation and scarce resources. Social norms are shifting as women enter the workforce, and the lingering memories of wartime struggles create a tension that permeates daily life. The atmosphere is one of cautious optimism but fraught with uncertainty as people navigate the complexities of a changing society.
Emotional register: The dominant emotional state is one of anxious hope, as communities strive for normalcy while grappling with the shadows of their past.
Physical constraints: Rationed petrol limits travel options for many. | Limited public transport hampers communication and movement. | Scarcity of goods affects daily life and purchasing power.
Current tensions (weave into background texture): The Berlin Blockade begins, causing tensions among Allies. | Nuremberg Trials ongoing, spotlighting war crimes. | Labor strikes in various industries over post-war wages.
Wartime context — Many veterans are returning home, struggling to reintegrate into society.: The social fabric is strained as families cope with loss and trauma. Absence effect: The absence of soldiers has left gaps in communities, heightening the sense of loss and uncertainty.

## Season Lock (mandatory — derived from June 1946)
Season: summer. Allowed vocabulary: summer, summery, midsummer
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, autumn, winter and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with summer.

## Story Theme
The story explores how the shadows of the past can haunt individuals, leading them to confront their own demons while seeking redemption amidst deception, and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide.

## Story Emotional Register
Dominant: The story's overall emotional character is one of suspense and revelation amidst personal turmoil.

Arc:
The narrative opens in the grand but decrepit Hotel Le Rivage, where the elegant facade belies a recent murder that has sent shockwaves through the gathered guests. As the investigation unfolds, the initial atmosphere of charm becomes tainted with rising unease, as Eleanor Voss, a local historian, is drawn into the mystery surrounding Dr. Mallory Finch's strangled body. The first clues surface, pointing toward various suspects, but each lead is fraught with emotional costs as Eleanor grapples with her own past connection to the victim. The investigation takes a pivotal turn when Eleanor discovers the clock in Finch's room was tampered with, altering the apparent time of death and complicating the timeline.

This revelation not only shifts the focus of the investigation but also forces Eleanor to confront her motivations for seeking the truth. As pressure mounts, secrets begin to unravel, revealing hidden connections and personal stakes among the suspects that deepen the intrigue. The climax sees a confrontation that forces each character to face their own demons, leading to a resolution that provides closure but at a significant emotional cost. For Eleanor, the journey offers a chance at redemption, yet it also highlights the burden of past failures. As the dust settles, the guests depart the hotel transformed, leaving behind echoes of their secrets and the lingering question of what truly lies beneath the surface of this seemingly idyllic seaside retreat.

## Emotional register at this point in the story
Unease grows as the investigation reveals the complexity of relationships among the guests.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the struggle between the past's shadows and the promise of redemption, as she navigates the complexities of her family's history in a changed world. Her commitment to uncovering the truth reflects a longing for clarity in the midst of societal upheaval.
Era intersection: Eleanor's pursuit of truth amidst deception mirrors the post-war quest for identity and purpose.

### Captain Ivor Hale
Captain Ivor Hale symbolizes the scars of war and the struggle for redemption, as he grapples with PTSD and gambling addiction. His charismatic exterior masks deep vulnerabilities, showcasing the personal battles faced by many returning soldiers.
Era intersection: Ivor's challenges represent the broader societal issues of veteran reintegration and the search for identity in a post-war landscape.

### Beatrice Quill
Beatrice Quill embodies the aspirations and insecurities of a young artist seeking recognition in a tumultuous world. Her fear of losing her artistic identity is a reflection of the broader struggles artists face in a society still healing from conflict.
Era intersection: Beatrice's journey mirrors the artistic renaissance emerging in a recovering society, where creativity is both a refuge and a battleground.

### Sylvia Trent
Sylvia Trent represents the social climbing and envy that can arise in a competitive environment. Her polished charm belies a simmering jealousy, reflecting the struggles of maintaining status in a world where traditional roles are being challenged.
Era intersection: Sylvia's ambitions highlight the shifting social dynamics of the post-war era, where status is increasingly tenuous.

### Hugo Vane
Hugo Vane is a businessman entangled in dubious dealings, representing the moral ambiguities of success in a recovering economy. His facade of respectability masks a web of deceit, echoing the struggles of many in a society grappling with its own integrity.
Era intersection: Hugo's challenges exemplify the ethical dilemmas faced by those navigating the transition from wartime to peacetime practices.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor speaks with a measured cadence, often punctuating her thoughts with historical anecdotes.
[comfortable] Ah, history has a way of repeating itself, doesn’t it? I believe the truth is often hidden in the past.
[evasive] Well, that’s a complicated matter, and it requires a deeper understanding than most are willing to explore.
[stressed] I can’t shake the feeling that if I don’t uncover this truth, I’ll be haunted by it forever.
Humour: Her humor is laced with irony and dry wit, often reflecting her insights into the past.

### Captain Ivor Hale (he/him/his)
Ivor speaks with a commanding presence, often punctuating his sentences with self-deprecating humor.
[comfortable] You should see the other guy—oh wait, that’s me. Just a bit worse for wear.
[evasive] Let’s not dwell on the past; it’s better to focus on the present, wouldn’t you agree?
[stressed] The pressure is mounting, and I can’t afford to lose everything I’ve fought for.
Humour: His self-deprecating humor adds depth to his otherwise serious demeanor.

### Beatrice Quill (she/her/her)
Beatrice speaks with a nervous energy, often punctuating her sentences with self-deprecating humor.
[comfortable] Well, who doesn’t love a little drama in their life? It’s all part of being an artist.
[evasive] I really don’t think it’s relevant—let’s talk about something more interesting, shall we?
[stressed] I just hope this doesn’t ruin everything I’ve worked so hard for.
Humour: Her nervous humor often serves as a defense mechanism against her insecurities.

### Sylvia Trent (she/her/her)
Sylvia speaks with a smooth, polished tone, often lacing her conversations with subtle jabs.
[comfortable] Isn’t it just delightful how the world works? A little chaos can be quite refreshing.
[evasive] Oh, I wouldn’t want to gossip; it’s so unbecoming, don’t you think?
[stressed] I simply cannot afford to be cast aside; I’ve worked too hard for my position.
Humour: Her polite savagery reveals her sharp wit, often masking deeper insecurities.

### Hugo Vane (he/him/his)
Hugo speaks with a directness that brooks no nonsense, often using sharp, clipped sentences.
[comfortable] Let’s not kid ourselves, it’s all about the bottom line in business.
[evasive] That’s a complicated issue; let’s focus on what really matters right now.
[stressed] I can’t afford any more scrutiny; everything I’ve built depends on it.
Humour: His dry humor often reflects a cynical view of the business world.

## Location Registers (scene framing guides)

The Grand Lounge: In the Grand Lounge, the atmosphere is charged with unspoken tension, where laughter feels forced and every whispered conversation carries the weight of secrets. The elegant decor contrasts starkly with the brewing storm of suspicion among the guests, creating a space ripe for intrigue.. Camera angle: As a writer enters this space, they should feel the palpable tension and the contrasting elegance, setting the stage for revelations.. Era: The post-war recovery has brought a mix of optimism and anxiety, influencing interactions among guests.

The Kitchen: The Kitchen is a bustling hub of activity, filled with the aromas of simmering sauces and freshly baked bread. However, amidst the chaos, an undercurrent of pressure and secrecy lurks, as staff navigate their duties while whispers of the murder echo through the walls.. Camera angle: A writer should enter with a sense of urgency, capturing the frenetic energy and hidden tensions that permeate the room.. Era: The strict staff-only access reflects the need for privacy and control in the aftermath of the crime.

The Library: The Library is a sanctuary of quiet reflection, where the flickering flames of the fireplace create a warm, inviting glow. Yet, beneath this serene surface, the air is thick with tension, as the potential for discovery looms in the shadows of forgotten tomes.. Camera angle: As a writer steps into this space, they should feel the contrast between the calm environment and the underlying currents of suspicion.. Era: The era's emphasis on literature and knowledge creates an atmosphere of contemplation amid the chaos of the outside world.

## Humour guidance for this story position (early)
Permission: conditional — condition: if Eleanor uses dry wit
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's dry wit can lighten the mood without undermining the seriousness of the investigation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "The moment when Eleanor discovers the tampered clock sheds light on the motives of all suspects, retroactively coloring their previous interactions with suspicion". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, the earlier conversations among the guests take on new meanings, hinting at deeper connections and hidden agendas". Do not explain significance yet.
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Dr. Finch died at a time when Captain Hale was seen in the dining room.
- Hidden truth to progressively expose (compose in your own words from these elements): clock, intentionally, back, create, false, alibi
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: clock, finch, room, shows, time, quarter, past, nine | corr: suggests, murder, took, place, actually | effect: narrows, timeline, murder
  - Step 2: obs: witnesses, confirm, captain, hale, dining, room, eight, thirty | corr: hale, room, finch, murdered | effect: eliminates, captain, hale, suspect
  - Step 3: obs: faint, scratch, clock, casing, indicating, tampering | corr: suggests, clock, manipulated, misrepresent, time | effect: narrows, scope, suspects, tampered, clock
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, clock, quarter, suggest, claimed, timeline
- Test must rely on already-shown clue IDs: clue_2, clue_core_contradiction_chain, clue_culprit_direct_1
- Fair-play rationale: Step 1: The clock hands and last meal timing establish a timeline contradiction. Step 2: Hale's dining room alibi eliminates him as a suspect. Step 3: The scratch on the clock confirms tampering, leading to the conclusion of Hale's guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a measured cadence, often punctuating her thoughts with historical anecdotes
She has a tendency to raise an eyebrow when skeptical, and her humor is laced with irony.
Eleanor wrestles with the guilt of her past inaction, fearing that her attempts to uncover the truth may not only expose her family’s failings but also her own inadequacies.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a commanding presence, often punctuating his sentences with a self-deprecating humor
He tends to lean in when sharing stories, his voice rich with emotion yet tinged with vulnerability.
Ivor faces the demons of his past, battling the effects of PTSD while grappling with the shame of his addiction, torn between the desire for redemption and the fear of exposure.
Voice colour: Captain Ivor Hale uses self deprecating humour — let it surface in their dialogue where natural, not in every line.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a nervous energy, often punctuating her sentences with self-deprecating humor
She has a tendency to fidget and avoid direct eye contact when discussing her work.
Beatrice grapples with her identity as an artist, torn between her desire for recognition and the fear that she is not good enough, leading her to question her worth.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Sylvia Trent (she/her — NEVER he/him)
Sylvia speaks with a smooth, polished tone, often lacing her conversations with subtle jabs and veiled insults
She has a knack for turning compliments into barbs, showcasing her sharp wit.
Sylvia grapples with her own insecurities, driven by a fear of being cast aside in the social hierarchy, forcing her to confront the lengths she will go to maintain her status.
Voice colour: Sylvia Trent uses polite savagery humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo speaks with a directness that brooks no nonsense, often using sharp, clipped sentences
He is unflinching when discussing business, but his humor is dry and often tinged with cynicism.
Hugo grapples with the moral complexities of his business practices, torn between the pursuit of success and the fear of losing everything he has built.
Voice colour: Hugo Vane uses blunt humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a measured cadence, often punctuating her thoughts with historical anecdotes. She has a tendency to raise an eyebrow when skeptical, and her humor is laced with irony.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Ah, history has a way of repeating itself, doesn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Ah, history has a way of repeating itself, doesn’t it? I believe the truth is often hidden in the past."
  [evasive] "Well, that’s a complicated matter, and it requires a deeper understanding than most are willing to explore."
Humour: dry wit — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Eleanor believes that the truth about the hotel's past is intricately linked to the recent murder, and she is determined to uncover it to redeem herself." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a commanding presence, often punctuating his sentences with a self-deprecating humor. He tends to lean in when sharing stories, his voice rich with emotion yet tinged with vulnerability.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "You should see the other guy—oh wait, that’s me."
Sample voice fragments (match this register and rhythm):
  [comfortable] "You should see the other guy—oh wait, that’s me. Just a bit worse for wear."
  [evasive] "Let’s not dwell on the past; it’s better to focus on the present, wouldn’t you agree?"
Humour: self deprecating — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Captain Ivor Hale): "she knew with certainty she was right"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim had discovered Ivor's financial troubles and threatened to cut him off from the family fortune, a threat that struck at his very identity." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a nervous energy, often punctuating her sentences with self-deprecating humor. She has a tendency to fidget and avoid direct eye contact when discussing her work.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Well, who doesn’t love a little drama in their life?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, who doesn’t love a little drama in their life? It’s all part of being an artist."
  [evasive] "I really don’t think it’s relevant—let’s talk about something more interesting, shall we?"
Humour: sardonic — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "She believed the victim was planning to steal her artistic ideas, a fear that ignited her jealousy and suspicion." — do not surface in Act I.

### Sylvia Trent[SHE]
Voice & mannerisms: Sylvia speaks with a smooth, polished tone, often lacing her conversations with subtle jabs and veiled insults. She has a knack for turning compliments into barbs, showcasing her sharp wit.
SIGNATURE TIC (use sparingly — this is Sylvia Trent's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Isn’t it just delightful how the world works?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Isn’t it just delightful how the world works? A little chaos can be quite refreshing."
  [evasive] "Oh, I wouldn’t want to gossip; it’s so unbecoming, don’t you think?"
Humour: polite savagery — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Sylvia Trent): "she felt a wave of unease"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim planned to cut Sylvia out of an important family event, a potential blow to her standing in society that she could not tolerate." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo speaks with a directness that brooks no nonsense, often using sharp, clipped sentences. He is unflinching when discussing business, but his humor is dry and often tinged with cynicism.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Let’s not kid ourselves, it’s all about the bottom line."
Sample voice fragments (match this register and rhythm):
  [comfortable] "Let’s not kid ourselves, it’s all about the bottom line in business."
  [evasive] "That’s a complicated issue; let’s focus on what really matters right now."
Humour: blunt — deploy occasionally (level 0.4)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "The victim had threatened to reveal Hugo's unethical business dealings to the press, an exposure that could lead to his downfall." — do not surface in Act I.



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

## Texture Pool
Draw on these as opportunities arise — you are not required to use them.

- In the summer of 1946, Europe is still reeling from the aftermath of World War II
- The streets are filled with returning soldiers, and communities are slowly rebuilding amidst rising inflation and scarce resources
- Social norms are shifting as women enter the workforce, and the lingering memories of wartime struggles create a tension that permeates daily life
- The atmosphere is one of cautious optimism but fraught with uncertainty as people navigate the complexities of a changing society.

TEMPORAL CONTEXT:

This story takes place in June 1946 during summer.

Seasonal Atmosphere:
- Weather patterns: overcast with brief sunbreaks, occasional rain showers, cool coastal breezes
- Daylight: Long summer days with daylight lasting into the evening, sunset around nine o'clock.
- Seasonal activities: beach outings with picnics, visits to local fairs and carnivals, evening dances at community centers
- Seasonal occasions: Father's Day (June 16)
- Season: summer

Period Fashion (describe naturally):
- Men formal: lightweight linen suits, dress shirts with short sleeves, hats like fedoras or straw boater hats
- Men casual: khaki shorts, button-up short-sleeved shirts, comfortable loafers
- Men accessories: leather belts, silk ties with geometric patterns, wristwatches with leather bands
- Women formal: sundresses with floral patterns, bolero jackets, pearl necklaces
- Women casual: capri pants, blouses with puff sleeves, comfortable sandals
- Women accessories: wide-brimmed straw hats, matching handbags, delicate gloves

Cultural Context (reference naturally):
- Music/entertainment: 'Rum and Coca-Cola' by The Andrews Sisters, 'The Old Piano Roll Blues' by The Bing Crosby, 'The Gypsy' by The Ink Spots; Films: 'The Best Years of Our Lives', 'It's a Wonderful Life'; Theatre: 'Annie Get Your Gun', 'Carousel'; Radio: 'The Jack Benny Program', 'Suspense'
- Typical prices: Loaf of bread: four pence, Cigarettes (pack): one shilling, Taxi fare across town: two shillings
- Current events: Berlin Blockade begins, causing tensions among Allies; Nuremberg Trials ongoing, spotlighting war crimes
- Literature: 'The Screaming Mimi' by Fredric Brown | 'The Glass Key' by Dashiell Hammett | 'The Postman Always Rings Twice' by James M. Cain | [mystery] | [thriller] | [romance]
- Technology: transistor radio | early commercial television sets | jet engines for military aircraft | vacuum cleaners | cooking ranges | refrigerators
- Daily life: outdoor picnics, community theater visits, local dances at town halls
- Social rituals: Sunday family gatherings, weekly movie nights, afternoon tea parties

Atmospheric Details:
The salty scent of the ocean mingles with the aroma of fresh rain on the pavement, creating a vivid coastal ambiance. The muted chatter of guests in the hotel lobby creates a tension-filled atmosphere, punctuated by distant thunder rumbling. The flicker of early electric lights casts shadows on the wallpaper, enhancing the air of mystery as guests navigate their secrets.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"
- Background details: Radio playing, newspaper headlines, theater posters
- Social commentary: Characters discuss current events naturally
- Class indicators: Aristocrats discuss opera, servants discuss music halls
- Authentic references: Use actual songs, films, events from the specific date

USAGE REQ
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - The clock was set to ten minutes past eight, which was earlier than the actual time of death.: "ten minutes past eight"
    ⛔ FORBIDDEN alternatives: "8:10", "8.10", "eight ten", "eight-ten", "eight past ten", "quarter past eight", "half past eight" — the ONLY acceptable form is "ten minutes past eight"
  - The actual time of death occurred twenty minutes past nine, contradicting the clock's display.: "twenty minutes past nine"
    ⛔ FORBIDDEN alternatives: "9:20", "9.20", "nine twenty", "nine-twenty", "nine past twenty", "quarter past nine", "half past nine" — the ONLY acceptable form is "twenty minutes past nine"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⚠ CENTRAL CONTRADICTION (the heart of the mystery): the two locked values "ten minutes past eight" and "twenty minutes past nine" are NOT two separate facts — they are ONE contradiction (one is a staged appearance, the other the true state; the evidence determines which). If this chapter references both, you MUST present them AS A SINGLE CONTRAST joined by a contrast connective (but / yet / however / could only / whereas) — e.g. "the watch showed the one time, yet the evidence proved it could only have been the other" — making clear which reading is the appearance and which is the truth. NEVER state them as two flat, side-by-side truths — that makes the central clue read as if it contradicts itself.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_culprit_direct_captain_ivor_hale] direct, ties, captain, ivor, hale, mechanism, access, point, before, discriminating, excludes, competing
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: direct, shows, captain, ivor, hale, means, opportunity, narrowing, solution, uniquely, toward, culprit

• [clue_core_contradiction_chain] suggests, murder, took, place, actually
  Category: temporal | Criticality: essential | Supports inference step 1
  Points to: timeline, murder, misrepresented

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • The clock was set to ten minutes past eight, which was earlier than the actual time of death.: "ten minutes past eight"
  • The actual time of death occurred twenty minutes past nine, contradicting the clock's display.: "twenty minutes past nine"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_culprit_direct_captain_ivor_hale — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): clock, manipulated, misrepresent, time | timeline, murder, misrepresented | direct, shows, captain, ivor, hale, means
• Suspects still unresolved: Beatrice Quill[SHE], Sylvia Trent[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "When the room was quiet once more, Eleanor allowed herself a moment of reflection. The evidence was as contradictory as the emotions swirling beneath the surface. Somewhere in the gap between ten minutes past eight and twenty minutes past nine, the truth waite..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Dr. Mallory Finch: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Dr. Mallory Finch crossed the room" / "Dr. Mallory Finch sat on the sofa" / "Dr. Mallory Finch nodded"
  - WRONG: "Dr. Mallory Finch gave testimony" / "Dr. Mallory Finch asked what had happened"
  - CORRECT: "Dr. Mallory Finch had often said..." / "Dr. Mallory Finch's effects were found" / "witnesses recalled Dr. Mallory Finch's habit of..."
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY
═══════════════════════════════════════════════════════════

**CRITICAL: You are writing chapters 3+. Maintain consistency with earlier chapters.**

**Character Names Used in Chapters 1-2:**
Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane

✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.
✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character's canonical name in the list above.

**Setting Vocabulary Established in Earlier Chapters:**
study, library, kitchen, corridor, suite, lounge, lobby, dining room

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: The Frozen Clock
  Events: Eleanor Voss pressed her gloved hand against the cold brass handle and pushed open the door to Dr.
Chapter 2: Chapter 2: Initial Observations
  Events: "The rain hasn't let up, has it?

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"8:00 PM"**
⚠ CONFLICT: other times appear (ten minutes past eight). Use ONLY: "8:00 PM". All others are errors.
✓ RULE: Every reference to the clock MUST use exactly this phrase. No variation permitted.
═══════════════════════════════════════════════════════════


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
Known location profile anchors: Hotel Le Rivage, The Observation Deck, The Grand Lounge, The Kitchen, The Library, Dr. Finch's hotel room
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Hotel Le Rivage", "The Observation Deck", "The Grand Lounge", "The Kitchen", "The Library", "Dr. Finch's hotel room"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "Dr. Finch's hotel room". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]

PRIOR CHAPTER QUALITY OBSERVATIONS:
- Chapter 1 (score 97/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
- Chapter 2 (score 97/100):
  Quality gaps noted: scene grounding weakness
  Address in upcoming chapters: Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
[END INTERNAL DIAGNOSTICS]

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=11673; context=11411; dropped=[humour_guide, location_profiles]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | automobiles with limited production due to wartime rationing | long-distance telephone calls | military-style coded messages | telegram services.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways limiting movement | restricted access to certain floors and back areas | oceanfront cliffs affecting escape routes | staff-only areas such as the kitchen and maintenance rooms | guest rooms requiring key access.
6. Sustain social coherence with this backdrop pressure: A grand seaside hotel hosts a gathering of influential guests, where post-war tensions and shifting social norms create an atmosphere ripe for intrigue and deception.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Plot similarity 0.75 with 'The Second Key' (both involve deception methods in a 1940s setting)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Character similarity 0.70 driven by the presence of a doctor and a captain in both casts, indicating mirrored roles.
10. RETRY MITIGATION: Strict obligation mode is active. Every required clue must be surfaced with concrete, observable prose before any deduction beat.
11. RETRY MITIGATION: Prioritize chronology and identity coherence over stylistic variation for this retry.
12. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Beatrice Quill (Act 3, Scene 5): Alibi confirmed by hotel staff
  Clues: clue_id_1, clue_id_2
- Sylvia Trent (Act 3, Scene 5): Alibi confirmed by hotel staff
  Clues: clue_id_1, clue_id_2
- Hugo Vane (Act 3, Scene 5): Alibi confirmed by hotel staff
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_culprit_direct_captain_ivor_hale must appear in Act 1, Scene 3 via Direct observation

**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected. Follow these specifications precisely.


## ACTIVE CHAPTER MODE CONTRACT (MANDATORY)
Active chapter mode: Suspect Pressure.
Mode required outcomes:
- Reveal fear, motive, lie, loyalty conflict, or secret.
- Suspicion state changes by chapter end.
Forbidden at this stage:
- No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.
Mode-specific narrative balance targets:
- Setting: 5-10%
- Character Pressure: 45-55%
- Evidence Or Alibi Testing: 35-45%

## CHAPTER OUTCOME CONTRACT (MANDATORY)
Batch chapters: 3-3.
Investigation state at start: 3 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

MECHANISM REVEAL GATE (withhold): The discriminating test has NOT happened yet. Show observable clues, contradictions, and suspicions, but do NOT yet explain HOW the concealment mechanism actually works, and do not state outright that it was deliberately rigged — keep the method an open question. Reserve the full explanation for the discriminating-test chapter.

## Asset Self-Report (required)
At the very END of your response, after all prose, add a single line:
<used_assets>era:story:0,era:story:1,era:story:2,era:story:3</used_assets>
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
- Chapter 3:
  - STRUCTURAL ARCHETYPE — Chapter 3 must be: EVIDENCE
      ✓ MUST contain: new physical clue discovered
      ✗ MUST NOT contain: formal accusation
  - Word count: Target 1250 words. Achieve this through plot events, dialogue exchanges, and physical investigation — not through atmospheric repetition or extended internal reflection. Each 200-word segment should contain at minimum one concrete story event (a discovery, a conversation exchange, a physical action or movement). Padding with atmosphere alone is not acceptable.
  - Opening: Begin with a character action, spoken line, or clock/time marker — never a location name or location-description phrase.
  - Scene is set in: Dr. Finch's hotel room — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "When the room was quiet once more, Eleanor allowed herself a moment of reflection. The evidence was as contradictory as the emotions swirling beneath the surface. Somewhere in the gap between ten minutes past eight and t...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • clock, shows, time, quarter, past, nine, actual, death, twenty, minutes [clue_culprit_direct_captain_ivor_hale] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • clock, shows, time, quarter, past, nine, actual, death, twenty, minutes [clue_core_contradiction_chain] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: timeline, murder, misrepresented
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
  - Tonal contrast: include at least one beat of relief or ironic counterpoint. Do not sustain maximum tension for every paragraph.
  - CLUE DISCLOSURE RULE (Stage 2/4):
    Characters may establish access and opportunity but must NOT state the crime method or draw the final clue-to-culprit connection. Investigation without conclusion.
    WRONG: dialogue or narration that directly explains how the crime was committed before Stage 4.
    RIGHT: observation, physical reaction, and logical inference that leaves the mechanism just off-screen.
  - SUSPECT-PRESSURE MODE: do NOT resolve the case in this chapter. No confession, arrest, final accusation, definitive culprit declaration, or case-closed language. End with unresolved pressure: a contradiction, narrowed suspicion, motive pressure, or a new question.
  - ALIBI LOCK: Captain Ivor Hale's established alibi is "8:00 PM to 9:00 PM". Do NOT place Captain Ivor Hale at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Captain Ivor Hale has already made statements in earlier chapters. Any time, location, or claim attributed to Captain Ivor Hale in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions The clock was set to ten minutes past eight, which was earlier than the actual time of death., write exactly: "ten minutes past eight".
  - If this batch mentions The actual time of death occurred twenty minutes past nine, contradicting the clock's display., write exactly: "twenty minutes past nine".
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
Batch chapters: 3-3.
Investigation state at start: 3 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: June (summer).
- Month, season, weather, and time-of-year language in this batch must stay compatible with summer.
- Established timeline fact: 8:00 PM
- Established timeline fact: 9:00 PM
- If referenced, use exact phrase: "ten minutes past eight" (The clock was set to ten minutes past eight, which was earlier than the actual time of death.).
- If referenced, use exact phrase: "twenty minutes past nine" (The actual time of death occurred twenty minutes past nine, contradicting the clock's display.).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: The Frozen Clock
Eleanor Voss pressed her gloved hand against the cold brass handle and pushed open the door to Dr. Mallory Finch’s suite. The corridor behind her was hushed, broken only by the distant echo of rain tapping the windowpanes and the faint murmur of voices below. Inside, the air was thick with the scent of damp stone and a lingering trace of eucalyptus. Pale morning light, filtered by overcast skies, fell in a wan sheet across the carpet, illuminating the scene with a chill that seemed to seep from the very walls.

Dr. Mallory Finch lay sprawled on the floor beside the ornate writing desk, her head turned at an unnatural angle, eyes fixed on some private horizon. The elegant lines of her summer-weight dress, a pale blue with a single pearl button at the throat, were rumpled and askew. A single strand of hair clung to her cheek. The silence in the room was absolute, broken only by the soft tick of the mantel clock—a sound that, in any other setting, might have been reassuring. Now it was a metronome for the unthinkable.

Eleanor’s breath caught as she stepped closer, her shoes sinking into the plush rug. She knelt, careful not to disturb the scene, and studied Dr. Finch’s face. There was no sign of struggle, no violence written across her features, but the stillness was too complete. Eleanor’s gaze drifted to the clock on the mantelpiece, its hands fixed at ten minutes past eight. The hour seemed improbable—she recalled the faint sounds of conversation and movement from this room well after that time last night. A cold suspicion threaded through her: something about the clock was wrong.

As Eleanor straightened, her eyes swept the room for further anomalies. The writing desk was in perfect order, save for a single sheet of notepaper turned askew, and a fountain pen whose cap had rolled to the edge. The window was latched, the curtains drawn back to reveal a view of the storm-darkened sea. The only other sound was the distant rumble of thunder, a reminder that the world outside continued, indifferent to the tragedy within.

Behind her, the door creaked and Captain Ivor Hale entered, his uniform immaculate despite the hour, his expression a study in controlled worry. Captain Ivor Hale, the hotel’s steward and Dr. Finch’s trusted adviser, paused just inside the threshold, his hand tightening around the chain of his pocket watch. He surveyed the body with a soldier’s discipline, but the faint tremor in his jaw betrayed a deeper unease. Eleanor noted the gesture—habitual, perhaps, or a sign of nerves. She wondered what secrets the captain might be guarding, and whether his composure would hold under scrutiny.

Beatrice Quill hovered in the hallway, visible through the open door. Beatrice Quill, a guest known for her dreamy disposition and fondness for poetic turns of phrase, clutched a handkerchief in both hands, her knuckles white. She peered inside with wide, uncertain eyes, her lips parted as if to speak but unable to form words. Beatrice’s connection to Dr. Finch was less formal—she had often been seen in the library, seeking the doctor’s advice on obscure literary matters. Now, her gaze flickered between Eleanor and the body, searching for reassurance and finding none.

Sylvia Trent appeared next, her entrance marked by a purposeful stride and a cool, appraising glance at the tableau. Sylvia Trent, a woman whose reputation for subtle manipulation was whispered about in the hotel’s corridors, wore a tailored linen jacket and the air of someone accustomed to control. She lingered near the window, her posture relaxed but her eyes sharp, taking in every detail. Sylvia’s relationship with Dr. Finch was complicated—there had been arguments, overheard by more than one guest, but also a grudging respect. Sylvia’s voice, when she finally spoke, was low and measured. “It’s dreadful, isn’t it? I suppose you’ll want to know where everyone was last night.” Her tone was almost too casual, as if rehearsed.

Hugo Vane’s presence filled the doorway a moment later, his broad shoulders nearly blocking the light. Hugo Vane, the hotel’s resident deal maker and a man with a knack for being everywhere at once, offered a thin smile that did not reach his eyes. He adjusted the cuffs of his shirt, the faint glint of a gold watch visible beneath the linen. Hugo had been seen in Dr. Finch’s company on several occasions, always negotiating, always pressing for some advantage. Now, he watched Eleanor with a mixture of curiosity and wariness, as if weighing her usefulness in the unfolding drama.

Eleanor drew herself up, smoothing the creases from her skirt. “I’ll need to speak with each of you in turn,” she said, her voice steady despite the tension coiling beneath her ribs. “Until then, I ask that you remain in the lounge. No one is to leave the hotel.” Her tone brooked no argument. The guests exchanged glances, a silent current of suspicion passing between them. Outside, the wind rattled the panes, underscoring the sense of isolation that had settled over Hotel Le Rivage.

Returning her attention to the mantel clock, Eleanor studied the face again. The hands were fixed at ten minutes past eight, yet she could recall hearing Dr. Finch’s laughter echo down the corridor much later in the evening. The contradiction gnawed at her. If the clock was correct, then half the household’s movements made no sense. If it was not, someone had gone to great lengths to create a false impression. She made a mental note to confirm the time with the kitchen staff and to check Dr. Finch’s last meal—details that might anchor the elusive timeline.

For a moment, Eleanor allowed herself to remember Dr. Finch as she had been the day before: brisk, incisive, always a step ahead in conversation. The loss was keen, but there would be time for grief later. Now, the work of unraveling the truth began. She glanced at the assembled guests, each one a knot of secrets and anxieties. The elegant facade of the hotel seemed to close in, its Art Deco lines now a cage rather than a sanctuary.

The low hum of a radio drifted up from the lobby, a news bulletin in clipped French announcing the latest developments in Berlin. Eleanor found the intrusion oddly grounding—a reminder that the world’s troubles extended far beyond these walls. Yet here, in this midsummer morning’s gloom, the only crisis that mattered was the one at her feet.

Eleanor reached for her notebook, the familiar weight of it reassuring in her palm. She began to sketch a quick diagram of the room, noting the position of the body, the clock, and the window. Every detail mattered now. She would catalogue them all, seeking the thread that would unravel the deception. Her mind, trained by years of historical inquiry, sifted through the evidence with methodical care. The past, she knew, had a way of intruding upon the present—sometimes with deadly consequences.

As the guests withdrew to the Grand Lounge, their footsteps muffled by the thick carpet, Eleanor remained alone with Dr. Finch. The silence pressed in, broken only by the relentless ticking of the clock. She stood, brushing a stray hair from her brow, and glanced once more at the face of the woman she had called both friend and rival. There would be questions—so many questions—but for now, only the facts could speak.

Outside, the rain intensified, drumming a steady rhythm against the glass. The day would be long, and the truth, Eleanor suspected, would prove as elusive as the summer sun behind the clouds. But she was resolved: whatever secrets Hotel Le Rivage harbored, she would bring them to light, one contradiction at a time.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Observations
"The rain hasn't let up, has it?" Captain Ivor Hale said quietly, his voice catching the hush that had settled over Dr. Finch's hotel room. The lamps cast a dim glow, their light flickering against the brass fixtures, as Eleanor Voss stood near the mantelpiece. The heavy scent of eucalyptus lingered beneath the sharper odor of rain-soaked linen, and the persistent drumming of water against the windowpanes underscored the uneasy silence. It was still early in the day, the overcast sky outside pressing a pale, uncertain light into the corners of the room.

Eleanor's eyes were drawn again to the clock on the mantel, its hands unwavering at ten minutes past eight. She leaned in, studying the way the minute hand hovered, as if suspended not just in time but in intention. The mechanism inside, she noted, ticked softly, but the hands did not move. Her gaze shifted to the writing desk, where a smaller travel clock sat—its face reading twenty minutes past nine. The two clocks, both present in Dr. Finch's room, offered a contradiction that could not be dismissed. One marked an earlier hour; the other, a later one. The murder, it seemed, was encased within this very discrepancy.

A chill traced Eleanor's spine as she considered what this meant. If the hands on the mantel clock declared ten minutes past eight, yet the travel clock claimed twenty minutes past nine, then something in this room refused to align with the truth. She remembered laughter and movement from the hallway long after eight o'clock; witnesses who might swear to Dr. Finch's presence later still. The discrepancy between the clocks did more than unsettle the timeline—it suggested deliberate confusion, a manipulation of appearances. Someone, she thought, wanted to control the story even as it unfolded.

Behind her, the door creaked open, and Beatrice Quill appeared, clutching her handkerchief. The fabric was already damp from nervous fingers. Beatrice lingered at the threshold, her gaze flickering from the body to the clocks, then to Eleanor. "I—I didn't sleep at all," she murmured, eyes darting away. "That storm... and now this." Her voice trembled, betraying more than fear. Eleanor watched her for a moment, noting the way Beatrice shifted her weight, as if uncertain whether to stay or flee. It was not only grief that unsettled her—it was something closer to guilt, or the fear of being drawn into the web of suspicion.

Sylvia Trent entered with the practiced composure of someone accustomed to scrutiny. Her tailored jacket was immaculate, the pearl buttons catching the lamplight as she surveyed the room with a cool detachment. "Isn’t it just delightful how the world works?" she said, voice smooth but edged. "One moment, everything is in order. The next, chaos." Her eyes paused on Eleanor, then on the clocks, and finally on Captain Ivor Hale. Sylvia's expression was controlled, but her hands betrayed her—fingers tightening over the clasp of her handbag. "You’ll want to know where I was last night, naturally. But I’m afraid I can’t offer much excitement. I was in the library, as usual. Alone, regrettably." The statement was calculated, designed to offer an alibi without inviting further questions.

Hugo Vane followed, his shoes leaving faint damp marks on the carpet. He paused by the window, glancing at the rain before turning to face the others. His gaze was direct, unblinking, yet there was a tension in the set of his jaw. "Let’s not kid ourselves, it’s all about the bottom line," he said, though his voice lacked conviction. "I was in the lounge, nursing a drink and reading the papers—news from Berlin, mostly. Not exactly the night I’d planned." He folded his arms, as if bracing against an unseen threat. Eleanor sensed in him a certain defensiveness, the kind that comes from living too long on the edge of exposure.

Captain Ivor Hale moved to the foot of the bed, hands clasped behind his back. His uniform was still pristine despite the hour, but a faint tremor in his jaw suggested sleeplessness. "Strange business about the clocks," he said, meeting Eleanor’s gaze. "I noticed something similar in the dining room this morning. The clock there had stopped at eight-thirty, which is odd, considering we were all still about. Maybe the storm played tricks on the electrics, or perhaps it’s just a coincidence." He offered a small, self-deprecating smile, but his eyes lingered on the mantel clock, as if searching for reassurance.

Eleanor regarded the group, her mind turning over the details. The contradiction between ten minutes past eight and twenty minutes past nine was too precise to be ignored. Yet Captain Ivor Hale’s mention of the dining room clock introduced a new layer of confusion, muddying the already troubled waters. Was it possible that more than one timepiece had failed, or was someone exploiting the chaos of the storm to cover their tracks? She noted the subtle shifts in posture among the guests: Beatrice’s anxious fidgeting, Sylvia’s controlled poise, Hugo’s defensive stance, and Captain Ivor Hale’s careful neutrality.

A sudden gust of wind rattled the windows, drawing all eyes to the storm outside. For a moment, the room was united in its unease, the boundaries between suspect and investigator blurred by the shared weight of uncertainty. Eleanor broke the silence. "I will need a statement from each of you," she said, voice even. "Please think carefully about when you last saw Dr. Finch, and with whom." Her tone left little room for argument.

As the group dispersed, Eleanor lingered by the mantel, fingers tracing the cool, smooth brass of the clock. The contradiction at the heart of the room—two clocks, two stories—remained unresolved. She caught Beatrice’s eye as the young woman hesitated in the corridor, then slipped away. Sylvia paused at the door, her composure slipping for just an instant before she masked it with a tight smile. Hugo Vane offered no farewell, only a curt nod, while Captain Ivor Hale lingered a moment longer, studying the clock as if it might yield its secrets under scrutiny.

When the room was quiet once more, Eleanor allowed herself a moment of reflection. The evidence was as contradictory as the emotions swirling beneath the surface. Somewhere in the gap between ten minutes past eight and twenty minutes past nine, the truth waited—obscured by fear, by habit, by the intricate dance of appearances. She made a final note in her book, determined to trace the motive behind each mask. Outside, the rain continued its relentless rhythm, and the day pressed forward, unyielding.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "Ivor Hale's alibi of being in the dining room at eight-thirty."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Ivor Hale was in the dining room at eight-thirty, raising questions about his involvement."

# Case Overview
Title: The Clock's Deception
Era: 1940s
Setting: Cannes
Crime: murder (mechanical deception)
Culprit: Captain Ivor Hale
Victim: Dr. Mallory Finch
False assumption: Dr. Finch died at a time when Captain Hale was seen in the dining room.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Cannes). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Cannes" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "sceneNumber": 3,
    "act": 1,
    "title": "Suspect Introductions",
    "setting": {
      "location": "Dr. Finch's hotel room",
      "timeOfDay": "Shortly after the initial observations",
      "atmosphere": "Suspenseful and charged with tension"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "purpose": "Introduce suspects and establish their potential motives",
    "cluesRevealed": [
      "clue_culprit_direct_captain_ivor_hale",
      "clue_core_contradiction_chain"
    ],
    "dramaticElements": {
      "conflict": "Suspects begin to argue about their whereabouts.",
      "tension": "Eleanor feels the pressure of the situation mounting.",
      "microMomentBeats": [
        "Eleanor catches a glimpse of Ivor's nervous fingers, tapping against his thigh."
      ]
    },
    "summary": "The suspects begin to argue as Eleanor introduces herself and questions their whereabouts during the murder. Ivor Hale's alibi is questioned, revealing he was in the dining room at eight-thirty, which seems to absolve him. However, Eleanor notes the oddity of his nervous behavior.",
    "beat": "first_enquiries",
    "estimatedWordCount": 2000,
    "pivotElement": "Ivor Hale's alibi of being in the dining room at eight-thirty.",
    "factEstablished": "Establishes that Ivor Hale was in the dining room at eight-thirty, raising questions about his involvement.",
    "permittedBehavioursByAct": [
      {
        "characterName": "Eleanor Voss",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Captain Ivor Hale",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Sylvia Trent",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Unease grows as the investigation reveals the complexity of relationships among the guests.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor speaks with a measured cadence, often punctuating her thoughts with historical anecdotes."
    },
    "humourGuidance": {
      "permission": "forbidden"
    },
    "eraTextureNote": "Rationed petrol limits travel options for many.; Limited public transport hampers communication and movement.; Scarcity of goods affects daily life and purchasing power.",
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
□ Allowed seasonal words only: summer, summery, midsummer.
□ Forbidden seasonal words: spring, autumn, winter.
□ Chapter 3: the clue [clue_culprit_direct_captain_ivor_hale] (direct, ties, captain, ivor, hale, mechanism, access, point, before, discriminating, excludes, competing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_core_contradiction_chain] (suggests, murder, took, place, actually) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ First chapter in this batch opens by continuing the previous chapter closing beat (same unresolved object, question, movement, or emotional pressure).
□ For every chapter after Chapter 1, include at least one NEW character pressure reveal (fear, motive, lie, loyalty conflict, or victim relationship).
□ Each post-Chapter-1 character reveal changes investigation state (more/less suspicious, lie explained, motive exposed, emotional cost deepened, or investigator understanding updated).
□ No post-Chapter-1 chapter contains static biography-only character paragraphs.
□ Mode check (Suspect Pressure): chapter contains a NEW pressure reveal (fear, motive, lie, loyalty conflict, or secret).
□ Mode check (Suspect Pressure): NO culprit resolution — the chapter must NOT contain a confession, an arrest/'under arrest', 'case closed', 'I accuse'/'I name', or 'the culprit/murderer/killer is/was …'. Build suspicion only; the accusation is reserved for the final reveal.
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

## Message 4 (role=user)

```text
SINGLE-PASS RETRY CONTRACT
Goal: resolve every listed issue for chapter(s) 3 in this one retry.
Retry mode: FULL_REBUILD.
Attempt context: 3/3 | primary class: fair_play.
Why this mode: final-attempt or hard mitigation triggered.

SOURCE OF TRUTH
- Do not preserve sentence structure from the failed draft; use the scene instructions and hard constraints as the source of truth.
- Hard constraints outrank the previous draft: cast/pronoun lock, locked facts, clue obligations, stage-mode rules, and chapter JSON shape.

PRIMARY FAILURES
- Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

REWRITE PLAN
- Treat the scene instructions, cast lock, clue obligations, and locked facts as the source of truth; do not preserve failing wording from the previous draft.
- Rewrite any paragraph touched by a failing issue as a fresh paragraph rather than patching a single sentence.

SUCCESS CHECKLIST
- Every listed issue below is resolved in this single attempt before you answer.
- Primary failure class cleared: fair_play.
- The revised chapter reads as a clean rewrite of the failing parts, not a lightly patched copy of the rejected draft.

OUTPUT RULES
- Return complete corrected JSON for chapter(s) 3 only.
- Do not explain what you changed.
- Do not leave one issue unresolved while fixing another.
- If two instructions conflict, prefer the one that clears the validator and preserves story logic.

TERMINAL RETRY EXECUTION MODE
Scope: chapter(s) 3
Attempt: 3/3 | class: fair_play
Objective: resolve every active validator error in a single pass.
Use failed draft as negative example only. Do not preserve its sentence structures.

ACTIVE ERRORS TO CLEAR
- Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

PACKET MUST-FIX ITEMS
- Resolve fair_play issues before accepting this batch.
- Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.

EXECUTION RULES
- Solve all listed errors together; do not optimize one and regress another.
- Keep cast/pronoun lock, locked facts, clue obligations, and stage-mode outcome consistent.
- Return complete corrected JSON for the target chapter batch only.
- No commentary or explanation outside JSON.

FINAL PRE-SUBMIT CHECK
- Verify every item in ACTIVE ERRORS TO CLEAR is resolved in the returned JSON.
- If any listed error remains unresolved, revise before returning.

RETRY CLASS: fair_play
ATTEMPT: 2/3
MANDATORY FIXES:
- Resolve fair_play issues before accepting this batch.
- Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation), but do NOT reveal HOW the trick worked — withhold the method/causal explanation until the discriminating-test scene or the final reveal.
MITIGATION MODE: tighten_obligation
```
