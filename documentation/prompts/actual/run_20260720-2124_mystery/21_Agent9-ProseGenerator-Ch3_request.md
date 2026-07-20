# Actual Prompt Record

- Run ID: `mystery-1784582686670`
- Project ID: ``
- Timestamp: `2026-07-20T21:34:55.564Z`
- Agent: `Agent9-ProseGenerator-Ch3`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1`
- Temperature: `0.42`
- Max Tokens: `4500`
- Attempt: `first`
- Prompt Hash: `e9fedced42cc447f`

## Message 1 (role=system)

```text
NARRATIVE VOICE: Eleanor Voss[SHE] is the viewpoint character. Unanchored “she/her” or “he/him” without a nearby name refers to Eleanor Voss. Default narrator pronoun: SHE. Never default to “he/his” as the neutral narrator voice unless the POV character is male.

You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: Eleanor Voss (woman), Dr. Mallory Finch (woman), Captain Ivor Hale (man), Beatrice Quill (woman), Sylvia Trent (woman) — DECEASED, past-tense only, Hugo Vane (man).
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
- MORAL COMPLEXITY REQUIREMENT: The mechanism of this crime carries a moral gray area: "The murderer's motive stems from a desperate need to protect a loved one from the victim's imminent betrayal, creating a tragic dilemma." — the culprit reveal and denouement MUST acknowledge this ambiguity. Do not let the ending feel clean or simple. Give the reader at least one moment of uncomfortable sympathy or moral doubt.

- CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named rooms/places. The first sentence must land a character ACTION, a specific sensory detail, or a concrete in-scene moment — not "In the [room], the [room], and the [room]…". Locations enter through what a character does in them, one at a time.
- VICTIM IDENTITY (HARD CONSTRAINT — lint-enforced): Sylvia Trent is the murder victim, already dead before this chapter. They do NOT speak, enter, react, gesture, or appear in any present-tense scene. When Sylvia Trent is referenced at all, it may ONLY be as: (a) physical evidence/the body, or (b) REPORTED memory/testimony — and reported references MUST be framed as recollection, never as a live beat. WRONG: `Sylvia Trent said, "…"` / `Sylvia Trent turned to him`. RIGHT: `Sylvia Trent had said, weeks before, that…` / `Agnes remembered how Sylvia Trent used to…`. Attach an explicit recollection frame ("had", "remembered", "recalled", "before she died", "in life") to any sentence that names Sylvia Trent beside an action or speech verb. A live dialogue tag or present action for Sylvia Trent is a continuity failure that will be rejected and regenerated.

⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.


CRITICAL CHARACTER CONSISTENCY RULES:

1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.
   COMPLETE CAST (no other named characters exist): Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent (DECEASED), Hugo Vane
   - "Mr. Jennings entered the room" → ILLEGAL. Jennings is not in the cast.
   - "Constable Reed took notes" → ILLEGAL. Reed is not in the cast.
   - "A constable took notes" → LEGAL (no name given).

2. Character roles are fixed:
   - Eleanor Voss: Amateur Sleuth / Civilian Investigator
   - Dr. Mallory Finch: The Conflicted Healer
   - Captain Ivor Hale: The Tormented Hero
   - Beatrice Quill: The Ambitious Dreamer
   - Sylvia Trent: victim (DECEASED — does not appear in any scene, past tense only)
   - Hugo Vane: The Enigmatic Outsider
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

## Era: February 1944
Living in February 1944 means navigating the complexities of a society still reeling from the impact of World War II. Daily life is marked by rationing, with essential goods like sugar and fuel in limited supply. The coastal air carries a chill, and the sounds of crashing waves are often mixed with the distant hum of radios broadcasting war news. As people gather to celebrate holidays like Valentine's Day, the atmosphere is charged with an undercurrent of tension, as individuals grapple with both personal and national struggles. The sight of well-dressed couples dining in hotels contrasts starkly with the realities of wartime life, underscoring the resilience and fragility of human connections amid adversity. In this era, social norms shift as women increasingly take on roles traditionally held by men, reflecting a society in flux.
Emotional register: The dominant emotional state is one of resilience tinged with anxiety and uncertainty.
Physical constraints: Limited access to goods due to rationing. | Short daylight hours with sunset around 5:30 PM. | Travel restrictions and heightened security in public spaces. | Limited communication options due to wartime conditions.
Current tensions (weave into background texture): Allied forces are planning for the D-Day invasion. | The Battle of Anzio is ongoing in Italy. | Rationing continues to affect daily life across the UK.
Wartime context — Many men are away at war, leaving women to fill roles in the workforce.: Communities bond over shared sacrifices while coping with the absence of loved ones. Absence effect: The absence of men in families creates a sense of longing and anxiety about their safety.

## Season Lock (mandatory — derived from February 1944)
Season: winter. Allowed vocabulary: winter, wintry, midwinter
Forbidden seasonal words — never use in narration, dialogue, or metaphor: spring, summer, autumn and their adjectival forms.
Every weather description, atmosphere, and time-of-year reference must be consistent with winter.

## Story Theme
In a world shaped by the aftermath of war, the quest for truth reveals hidden desires and the cost of ambition in a murder steeped in deception.

## Story Emotional Register
Dominant: Tense and suspenseful, marked by the interplay of personal desires and the quest for truth.

Arc:
The story begins in the Seabreeze Hotel, where the atmosphere is thick with the scent of salt and the whispers of guests celebrating Valentine's Day. However, the festive air is shattered with the discovery of Sylvia Trent's lifeless body, a vibrant artist whose death sends shockwaves through the coastal community. As Eleanor Voss, the amateur sleuth, delves into the investigation, she navigates the delicate relationships between the suspects, each with their own secrets and motives. The rising unease mounts as she uncovers clues that lead her in circles, revealing the emotional costs of her pursuit. Frustration and doubt ripple through her resolve as she grapples with conflicting feelings for Captain Ivor Hale, whose own struggles with PTSD complicate their connection.

Midway through the investigation, a pivotal revelation about Dr. Mallory Finch’s past with Sylvia shifts Eleanor's focus, illuminating hidden tensions and jealousy. As she confronts the implications of this new information, the story propels toward its climax, where the pressure mounts as Eleanor gathers all the suspects for a final confrontation. In this charged atmosphere, truths are revealed, leading to a dramatic unmasking of the murderer. The resolution leaves each character emotionally changed, as Eleanor must reckon with the consequences of her discovery and the impact it has on her relationships, ultimately questioning what she is willing to sacrifice for truth.

## Emotional register at this point in the story
Eleanor begins her investigation, feeling the emotional weight of her connection to the victim.

## Character Portraits (appearance & era)

### Eleanor Voss
Eleanor Voss embodies the spirit of the 1940s, a time when women began to carve out their space in professions dominated by men. As an amateur sleuth with a background in journalism, she navigates both the complexities of her investigation and her emotional entanglements amid societal shifts. Her determination to uncover the truth reflects the resilience of women during wartime, emerging not just as passive observers but active participants in their narratives.
Era intersection: Eleanor's investigative journey is complicated by her feelings for Captain Hale, highlighting the tension between personal desires and professional integrity.

### Captain Ivor Hale
Captain Ivor Hale represents the archetype of the war hero, burdened by the weight of trauma from his experiences. His stoicism masks the psychological scars left by the battlefield, reflecting the broader struggles of men returning from war. The societal expectation for him to maintain his honor while confronting his vulnerabilities encapsulates the emotional turmoil many veterans faced during this time.
Era intersection: Ivor's relationship with Sylvia and the resulting tensions expose the fragile nature of masculinity in a post-war world.

### Beatrice Quill
Beatrice Quill embodies the ambitious artist navigating the turbulent waters of love and career aspirations during a time of upheaval. Her vibrant personality contrasts with the darker undercurrents of jealousy and betrayal that threaten her future. As women increasingly assert their independence in the arts, Beatrice's struggles reflect the societal shifts that allow for both creativity and conflict in personal relationships.
Era intersection: Beatrice's secret affair with Ivor complicates her ambitions, revealing the sacrifices women make for love in a society where their roles are rapidly evolving.

### Hugo Vane
Hugo Vane represents the competitive spirit of men in journalism, driven by ambition and jealousy. His desire to succeed at all costs reveals the deeper insecurities that lie beneath his charismatic exterior. In a male-dominated field, Hugo's rivalry with Eleanor illustrates the pressures men faced to prove their worth and the moral quandaries that arise in pursuit of success during wartime.
Era intersection: Hugo's actions reveal the darker side of ambition, highlighting how the war amplifies existing rivalries and personal conflicts.

## Character Voices

### Eleanor Voss (she/her/her)
Eleanor's voice carries a fluid cadence, often punctuated by dry wit, reflecting her observant nature.
[comfortable] What’s the story behind that painting? It seems to have layers, much like our lives.
[evasive] Oh, I wouldn’t want to speculate on anyone’s intentions, especially not now.
[stressed] This is more complicated than I imagined; the truth feels just out of reach.
Humour: Eleanor's dry wit can lighten tense moments, although she remains serious about the investigation.

### Captain Ivor Hale (he/him/his)
Ivor's low, gravelly voice conveys a sense of stoicism, often masking deeper emotions.
[comfortable] It’s all in the past, isn’t it? We all have our battles.
[evasive] I don’t recall the details; too much has happened since.
[stressed] I can’t afford to let anyone see my weakness, not now.
Humour: Ivor's serious demeanor leaves little room for humor, reflecting his internal struggles.

### Beatrice Quill (she/her/her)
Beatrice's lively tone is expressive, with dramatic flair that reflects her artistic nature.
[comfortable] Life’s a canvas, isn’t it? We paint our truths with every choice.
[evasive] Oh, it’s just a minor detail; let’s focus on the bigger picture, shall we?
[stressed] I can’t let this ruin my future; I’ve worked too hard for that!
Humour: Beatrice's sardonic humor often surfaces, adding depth to her character during tense moments.

### Hugo Vane (he/him/his)
Hugo has a direct, assertive manner of speaking, often masking his insecurities.
[comfortable] What’s the scoop? I always get the inside story, you know.
[evasive] Let’s not get bogged down in details; I prefer to keep things moving.
[stressed] I can’t let Eleanor outshine me; this is my chance to prove myself!
Humour: Hugo's blunt humor often serves as a defense mechanism against his insecurities.

## Location Registers (scene framing guides)

Grand Lobby: The Grand Lobby feels alive with the chatter of guests, yet an underlying tension lingers as whispers of the recent murder ripple through the air, creating an atmosphere thick with suspicion and intrigue.. Camera angle: Entering the Grand Lobby invites the writer to capture the charged atmosphere, where every interaction may hold a clue to the unfolding drama.. Era: The lavish decor and bustling activity contrast sharply with the ominous reality of a murder mystery unfolding within its walls.

Dining Room: The Dining Room exudes an air of elegance, yet the atmosphere is fraught with tension as guests navigate unspoken fears and the weight of secrets, with every clink of silverware echoing the gravity of the recent murder.. Camera angle: A writer entering the Dining Room should focus on the contrasts between the lavish setting and the undercurrents of anxiety, capturing the essence of a social gathering overshadowed by a crime.. Era: The fine dining experience is tainted by the shadows of war and personal treachery, reflecting the complexities of human relationships during this time.

Kitchen: The Kitchen buzzes with frenetic energy, the air thick with aromas of cooking, yet beneath the surface lies a tension as staff navigate their roles amid the chaos of a murder investigation, where secrets simmer along with the food.. Camera angle: The writer should capture the dynamic interplay of motion and emotion in the Kitchen, where the sounds of cooking mask deeper truths waiting to be uncovered.. Era: The industrious atmosphere highlights the necessity of teamwork amidst the strain of wartime conditions, where every meal prepared feels like a step toward normalcy.

Beach: The Beach appears serene, yet the sound of crashing waves is a constant reminder of the chaos lurking beneath the surface, where laughter mingles with whispers of secrets, creating a hauntingly beautiful backdrop for the unfolding drama.. Camera angle: Entering the Beach scene encourages the writer to explore the juxtaposition of beauty and tension, capturing the duality of the setting as both a place of escape and confrontation.. Era: The coastal setting, while picturesque, is deeply affected by the societal anxieties of the time, where every gathering feels charged with unspoken truths.

## Humour guidance for this story position (early)
Permission: permitted
Characters who may be funny: Eleanor Voss
Permitted forms: dry_wit
Rationale: Eleanor's dry wit can provide levity in an otherwise tense situation.

## Reveal Groundwork (texture — do not explain, only plant)
- Plant one subtle observable beat related to: "Plant one subtle anomaly that can be re-read after the resolution.". Do not explain significance yet.
- Plant one subtle observable beat related to: "Finch earlier conversations where she exhibited nervous behavior, shifting the focus of suspicion". Do not explain significance yet.
- Plant one subtle observable beat related to: "Additionally, the discovery of her fingerprints on the decanter retroactively highlights her access to the poison, altering the investigation's trajectory". Do not explain significance yet.

FAIR-PLAY AND INFERENCE CONTRACT:
- FAIR PLAY CLUE TIMING: Never combine clue discovery and detective deduction in the same chapter. If a clue is first revealed to the reader in chapter N, the detective may only analyze, deduce from, or act on that clue in chapter N+1 or later.
- FAIR PLAY INFORMATION PARITY: The reader must see all clues BEFORE the detective uses them in reasoning. If the detective performs a test or makes a deduction, every piece of evidence supporting that conclusion must have been shown to the reader in earlier chapters.
- FAIR PLAY REVELATION SPACING: In the discriminating test scene, the detective can ONLY use clues that were revealed to the reader at least 1 full chapter earlier. Never introduce new clues or withheld information during the test.
- FAIR PLAY CONFRONTATION: During the final confrontation/revelation, the detective cannot surprise the reader with facts. Every piece of evidence cited must have been visible to the reader in prior chapters.
- Never solve by withheld information. Keep reader-information parity with detective reasoning.
- False assumption in force: Sylvia's death was an unfortunate accident resulting from her known anxiety issues.
- Hidden truth to progressively expose (compose in your own words from these elements): true, cause, death, slow, acting, poison, administered, trusted, source
- Inference path checkpoints to dramatize clearly — compose ENTIRELY in your own sentences from these key terms (reproducing any briefing phrase verbatim FAILS validation):
  - Step 1: obs: decanter, used, serving, dinner, fingerprints, match, finch | corr: indicates, finch, last, person, handle, decanter | effect: eliminates, suspects, access
  - Step 2: obs: witnesses, report, sylvia, complained, bitter, taste, drink | corr: suggests, drink, contained, something, unusual, likely, poison | effect: narrows, investigation, focus, prepared, drink
  - Step 3: obs: finch, exhibits, nervous, behavior, questioned, tincture | corr: nervousness, suggests, role, preparing | effect: narrowing, suspicion, towards, finch
- Discriminating test method: trap
- Discriminating test elements to dramatize (compose ENTIRELY in your own sentences from these — do NOT reproduce any briefing phrase verbatim): discriminating, compares, dinner, decanter, fingerprint, claimed, timeline
- Test must rely on already-shown clue IDs: clue_2, clue_culprit_direct_1, clue_8, clue_fp_contradiction_step_1
- Fair-play rationale: Step 1: Fingerprints on the decanter (early) and witness statements about drink preparation (mid) guide the reader towards Finch's involvement. Step 2: The bitter taste complaint (mid) further narrows suspicion. Step 3: The reenactment test (discriminating test) reveals Finch's concealed knowledge, confirming her guilt.

## Character Reference

### Eleanor Voss (she/her — NEVER he/him)
Eleanor speaks with a fluid cadence, often punctuating her observations with wry remarks
She tends to ask rhetorical questions, drawing others into her thought process.
Eleanor grapples with her feelings for Ivor, torn between her professional integrity and her personal desires, questioning if love can coexist with truth.
Voice colour: Eleanor Voss uses dry wit humour — let it surface in their dialogue where natural, not in every line.

### Captain Ivor Hale (he/him — NEVER she/her)
Ivor speaks with a low, gravelly tone, often choosing his words carefully
He tends to be terse, with moments of deep introspection breaking through his stoicism.
Ivor struggles with the trauma of his experiences and the fear of exposing his vulnerabilities, leading to a deep internal conflict about his identity and worth.

### Beatrice Quill (she/her — NEVER he/him)
Beatrice speaks with a lively and expressive tone, often punctuating her sentences with dramatic flair
She has a tendency to exaggerate for effect, revealing her artistic nature.
Beatrice struggles between her ambition as an artist and the moral implications of her actions, torn between love and career aspirations.
Voice colour: Beatrice Quill uses sardonic humour — let it surface in their dialogue where natural, not in every line.

### Hugo Vane (he/him — NEVER she/her)
Hugo has a direct and assertive manner of speaking, often cutting to the chase with little regard for niceties
He can be sardonic, using sharp wit to mask his insecurities.
Hugo wrestles with his jealousy towards Eleanor and the lengths he is willing to go to secure his place in the journalism world, leading to a moral quandary.
Voice colour: Hugo Vane uses blunt humour — let it surface in their dialogue where natural, not in every line.


## CHARACTER CONTRACTS (binding for this scene)
Each entry below constrains how this character must be written in this chapter.
These override generic style guidance when they conflict.

### Eleanor Voss[SHE]
Voice & mannerisms: Eleanor speaks with a fluid cadence, often punctuating her observations with wry remarks. She tends to ask rhetorical questions, drawing others into her thought process.
SIGNATURE TIC (use sparingly — this is Eleanor Voss's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "What’s the story behind that?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "What’s the story behind that painting? It seems to have layers, much like our lives."
  [evasive] "Oh, I wouldn’t want to speculate on anyone’s intentions, especially not now."
Humour: dry wit — deploy occasionally (level 0.5)
FORBIDDEN phrase (never write for Eleanor Voss): "a surge of determination washed over her"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Drawn to the coastal hotel for a story about wartime resilience and the human condition, Eleanor is determined to uncover the truth behind the murder." — do not surface in Act I.

### Captain Ivor Hale[HE]
Voice & mannerisms: Ivor speaks with a low, gravelly tone, often choosing his words carefully. He tends to be terse, with moments of deep introspection breaking through his stoicism.
SIGNATURE TIC (use sparingly — this is Captain Ivor Hale's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "It’s all in the past, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "It’s all in the past, isn’t it? We all have our battles."
  [evasive] "I don’t recall the details; too much has happened since."
Humour: none — this character plays it straight in all scenes
FORBIDDEN phrase (never write for Captain Ivor Hale): "sighed deeply and felt a sense of peace"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Fears that the victim would reveal personal details about his struggles, damaging his reputation and the honor he fought to uphold." — do not surface in Act I.

### Beatrice Quill[SHE]
Voice & mannerisms: Beatrice speaks with a lively and expressive tone, often punctuating her sentences with dramatic flair. She has a tendency to exaggerate for effect, revealing her artistic nature.
SIGNATURE TIC (use sparingly — this is Beatrice Quill's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "Life’s a canvas, isn’t it?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "Life’s a canvas, isn’t it? We paint our truths with every choice."
  [evasive] "Oh, it’s just a minor detail; let’s focus on the bigger picture, shall we?"
Humour: sardonic — deploy occasionally (level 0.6)
FORBIDDEN phrase (never write for Beatrice Quill): "palpable tension filled the room"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Felt betrayed when the victim threatened to expose the affair and derail her career, pushing her closer to desperation." — do not surface in Act I.

### Hugo Vane[HE]
Voice & mannerisms: Hugo has a direct and assertive manner of speaking, often cutting to the chase with little regard for niceties. He can be sardonic, using sharp wit to mask his insecurities.
SIGNATURE TIC (use sparingly — this is Hugo Vane's alone, never in anyone else's mouth; at most once in this chapter and only where the scene naturally invites it; prefer a varied paraphrase over the verbatim phrase; most chapters should omit it entirely): "What’s the scoop?"
Sample voice fragments (match this register and rhythm):
  [comfortable] "What’s the scoop? I always get the inside story, you know."
  [evasive] "Let’s not get bogged down in details; I prefer to keep things moving."
Humour: blunt — deploy frequently (level 0.7)
FORBIDDEN phrase (never write for Hugo Vane): "she chose her words with great care"
Act 1 behaviour contract: Show normal social behaviour; grief or confusion if appropriate. No guilt signals permitted. Hidden motive: "Wants to ruin Eleanor's credibility, seeing her as a rival in journalism and feeling threatened by her talent." — do not surface in Act I.



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

- Living in February 1944 means navigating the complexities of a society still reeling from the impact of World War II
- Daily life is marked by rationing, with essential goods like sugar and fuel in limited supply
- The coastal air carries a chill, and the sounds of crashing waves are often mixed with the distant hum of radios broadcasting war news
- As people gather to celebrate holidays like Valentine's Day, the atmosphere is charged with an undercurrent of tension, as individuals grapple with both personal and national struggles
- The sight of well-dressed couples dining in hotels contrasts starkly with the realities of wartime life, underscoring the resilience and fragility of human connections amid adversity

TEMPORAL CONTEXT:

This story takes place in February 1944 during winter.

Seasonal Atmosphere:
- Weather patterns: Cool evening with a slight ocean breeze, Overcast skies typical of coastal regions, Chilly temperatures ranging from 35°F to 45°F
- Daylight: Short winter days with sunset around 5:30 PM, leaving early evenings draped in darkness.
- Seasonal activities: Strolling by the beach wrapped in warm coats, Attending local dances or parties in hotel ballrooms, Gathering for intimate dinners in cozy restaurants
- Seasonal occasions: Valentine's Day
- Season: winter

Period Fashion (describe naturally):
- Men formal: Navy blue wool suit with wide lapels, White dress shirt with a stiff collar, Silk tie with geometric patterns
- Men casual: Tweed jacket with elbow patches, Button-down flannel shirt, Heavy wool sweater
- Men accessories: Leather gloves, Fedora hat, Pocket watch
- Women formal: Tea-length evening gown with a fitted bodice, Faux fur stole, String of pearls
- Women casual: Wool cardigan over a patterned dress, High-waisted trousers with a tucked-in blouse, Knee-length A-line skirt
- Women accessories: Cloche hat, Seamed stockings, Leather handbag

Cultural Context (reference naturally):
- Music/entertainment: Bing Crosby - 'Swinging on a Star', Glenn Miller - 'In the Mood', The Andrews Sisters - 'Boogie Woogie Bugle Boy'; Films: 'To Have and Have Not', 'Double Indemnity'; Theatre: 'Oklahoma!', 'The Glass Menagerie'; Radio: 'The Shadow', 'Jack Benny Show'
- Typical prices: Loaf of bread: four pence, A pound of sugar: one shilling, Taxi fare across town: two shillings
- Current events: Allied forces continue to plan for the D-Day invasion; The Battle of Anzio is underway in Italy
- Literature: 'The Thin Man' by Dashiell Hammett | 'The Glass Key' by Dashiell Hammett | 'The Stranger' by Albert Camus | [Mystery] | [Romance] | [War fiction]
- Technology: Radar technology advances in military applications | Development of early computing machines for war logistics | Telephone technology expands with more households acquiring phones | Mechanical typewriters | Radio receivers | Basic electrical appliances
- Daily life: Gathering for tea with friends, Participating in community fundraisers for the war effort, Attending local dances or social clubs
- Social rituals: Saturday night dances at the local hall, Sunday family dinners, Exchanging Valentine's cards on February 14

Atmospheric Details:
The sound of crashing waves mixing with the distant hum of radio broadcasts from nearby hotels. The chilly air carries the faint scent of salt and smoke from nearby chimneys, evoking a sense of warmth and togetherness indoors. Flickering lights from candlelit tables create an ambiance of intimacy and tension, where whispered conversations seem amplified against the quiet backdrop of the coastal night.

FASHION INTEGRATION TECHNIQUES:
- First appearance: Describe outfit to establish class/personality
- Accessories: Gloves, hats, pocket watches, jewelry reveal status
- Time-specific: Different outfits for different times of day
- Character traits: Fastidious dresser vs rumpled appearance
- Action integration: "She tugged at her glove" or "He adjusted his tie"
- Weather appropriate: Overcoats in winter, light linen in summer

CULTURAL TOUCHSTONE INTEGRATION:
- Casual conversation: "Did you hear that new jazz record?" or "I
[truncated for prompt budget]

NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE VALUES (VERBATIM REQUIRED):
The following measured values (times, amounts, measurements) are absolute ground truth. Every time this chapter describes, mentions, or alludes to one — no matter how briefly — it MUST use the exact phrase shown below, character for character. NO paraphrase, approximation, rounding, or synonym is permitted.

FAILURE EXAMPLE: if the locked value is "at thirteen minutes to midnight" and you write "just before midnight" or "around midnight" — that is a HARD FAIL. You must write "at thirteen minutes to midnight". Equally, if the locked value is written in words, such as "ten minutes past eleven", and you convert it to figure-based clock notation — that is also a HARD FAIL. Words stay as words; figure forms are forbidden for word-phrased facts.

CRITICAL — WORD-PHRASED VALUES: If the canonical value is written out in words (e.g. a time like "ten minutes past eleven", or an amount like "forty minutes"), reproduce those exact words. DO NOT convert to figure-based time notation, twenty-four-hour format, or any other numeric shorthand. Correct: "ten minutes past eleven". WRONG: figure-based clock notation or numeric shorthand.

Locked values:
  - the weight of the brooch, affecting its comfort and wear time: "three ounces"
  - the body temperature at which the poison activates: "ninety-eight point six degrees Fahrenheit"
  - the time it takes for the poison to start affecting the victim: "two hours"

If a value has no relevance to this chapter, omit it. But the moment you reference the underlying evidence, only the exact phrase above is acceptable.

⛔ CLUES TO SURFACE IN THESE CHAPTERS — mandatory:
The following evidence MUST be clearly observable to an attentive reader. Do not bury it in atmosphere or passing dialogue. Each clue must be concrete, specific, and noticeable:

• [clue_2] decanter, used, serving, dinner, fingerprints, match, finch
  Category: physical | Criticality: essential | Supports inference step 1
  Points to: finch, involvement, murder, suggested

• [clue_4] witnesses, confirm, sylvia, appeared, unwell, shortly, dinner
  Category: testimonial | Criticality: essential | Supports inference step 2
  Points to: sylvia, condition, raises, suspicion, foul, play

• [clue_7] bitter, residue, bottom, sylvia, glass
  Category: physical | Criticality: essential | Supports inference step 2
  Points to: presence, poison, sylvia, drink

• [clue_culprit_direct_dr_mallory_finch] Direct observation
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_fp_contradiction_step_1] Cross-check contradiction
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

• [clue_mid_1] Witness statement
  Category: structural | Placement: early (Act 1)
  Points to: what this observation reveals about the time or circumstances of the crime.

For each clue above: an attentive reader should be able to find, record, and later use it to reason toward the solution.

═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • the weight of the brooch, affecting its comfort and wear time: "three ounces"
  • the body temperature at which the poison activates: "ninety-eight point six degrees Fahrenheit"
  • the time it takes for the poison to start affecting the victim: "two hours"

CHARACTER PRONOUNS — never deviate from these:
  • Eleanor Voss: she/her/her
  • Dr. Mallory Finch: she/her/her
  • Captain Ivor Hale: he/him/his
  • Beatrice Quill: she/her/her
  • Sylvia Trent: she/her/her
  • Hugo Vane: he/him/his

CLUES ALREADY REVEALED TO READER: clue_culprit_direct_dr_mallory_finch, clue_mid_1, clue_fp_contradiction_step_1, clue_mechanism_visibility_core, clue_core_contradiction_chain — do not reveal these as new information.

INVESTIGATION LOG — WHAT IS ESTABLISHED (do not re-establish, do not repeat):
• Evidence already established (reference only — do NOT restate or quote these; advance beyond them): direct, shows, mallory, finch, means, opportunity | mechanism, murder, involves, decanter, tincture | indicates, finch, last, person, handle, decanter | mechanism, murder, involves, decanter, tincture | indicates, possible, poisoning
• Suspects still unresolved: Captain Ivor Hale[HE], Beatrice Quill[SHE], Hugo Vane[HE]
⚠ The story must move FORWARD from this log. Any beat already listed above is forbidden from repeating.

⚠ THIS CHAPTER'S REQUIRED ADVANCE (early): Interview each suspect — record their claimed whereabouts

CONTINUITY HANDOFF — previous chapter closing beat:
  • "She closed her journal, the snap of the cover decisive. The investigation was no longer a matter of tracing routine; it was a matter of exposing deception. The guests’ alibis, once plausible, now wavered beneath the weight of conflicting timelines and nervous..."
  • The next chapter must open as a continuation of this beat, not as a disconnected reset.

⛔ DEAD CHARACTER — CANNOT APPEAR AS ALIVE:
• Sylvia Trent: murdered before Chapter 1. In ALL chapters from here on:
  - Refer to them ONLY in past tense, only as the victim of the crime
  - NEVER have them: enter a room, speak, respond, gesture, look, nod, or react
  - NEVER describe them as present at any scene, conversation, or confrontation
  - WRONG: "Sylvia Trent crossed the room" / "Sylvia Trent sat on the sofa" / "Sylvia Trent nodded"
  - WRONG: "Sylvia Trent gave testimony" / "Sylvia Trent asked what had happened"
  - CORRECT: "Sylvia Trent had often said..." / "Sylvia Trent's effects were found" / "witnesses recalled Sylvia Trent's habit of..."
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
corridor, lobby, dining room, kitchen

✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.
✓ Do NOT introduce new location types that contradict earlier chapters.

**Recent Chapter Summary (for narrative continuity):**
Chapter 1: Chapter 1: A Chill in the Air
  Events: Eleanor Voss pressed open the heavy door, the cold morning air biting at her cheeks as she stepped into the scene.
Chapter 2: Chapter 2: Initial Reactions
  Events: "It tasted wrong, I tell you," Beatrice Quill insisted, her voice trembling as she stared at the untouched glass on the linen-draped table.

⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.
Double-check every character name against the list above before using it.

**⏱ LOCKED TIME ANCHOR — use verbatim, do not paraphrase:**
Clock time (from the case ground truth): **"Dinner service start"**
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
Known location profile anchors: The Seabreeze Hotel, Grand Lobby, Dining Room, Kitchen, Beach, the hotel parlor
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "The Seabreeze Hotel", "Grand Lobby", "Dining Room", "Kitchen", "Beach", "the hotel parlor"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error. Every time you mention a named location, copy its capitalisation from the list above.
- Chapter 3: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with an explicit time marker — e.g. "That morning…" / "By the time dusk fell…" / "It was nearly four o'clock…" / "On the second day after the discovery…". Time must be in the first clause. Anchor opening in "the hotel parlor". The opening style above governs only your FIRST SENTENCE; the grounding below may land anywhere in the first 2 paragraphs (it need not be sentence one, and never conflicts with the chosen opening style). HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/odor/fragrance/sound/echo/silence/whisper/creak/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/lighting/weather/season/afternoon/midday/noon/midnight/twilight/sunrise/sunset/daylight/sunlight/overcast/cloudy/bright/dark/grey/pale/chill/crisp/drizzle/haze/lamplight/firelight. These are validated requirements, not style suggestions; missing them triggers a retry.

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

PROMPT BUDGET SUMMARY: budget=24000 tokens; fixed=12540; context=10926; dropped=[humour_guide, location_profiles]; truncated=[location_profiles, temporal_context, pronoun_accuracy]

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
4. Integrate at least two concrete era-grounded details per chapter from setting refinement signals: radio broadcasting | early television sets | radar equipment | mechanical typewriters | party-line telephones | military-style encrypted communication.
5. Respect setting movement/access constraints in scene action and alibis: narrow hallways restricting movement | multiple floors with a central staircase | fire escapes leading to the beach | staff-only areas such as the kitchen and maintenance rooms | restricted access to guest rooms without proper identification.
6. Sustain social coherence with this backdrop pressure: A delayed-action poisoning during a tense gathering at a coastal hotel reveals the complex social dynamics shaped by WWII, as heirs and staff navigate shifting roles and hidden resentments.
7. Maintain continuity around these socially central cast anchors where relevant: Eleanor Voss, Dr. Mallory Finch, Captain Ivor Hale, Beatrice Quill, Sylvia Trent, Hugo Vane.
8. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Critical: Plot similarity 0.85 with 'The Second Key' (same poisoning method and unknown motive)
9. Novelty safeguard: avoid reproducing this flagged seed-adjacent pattern in prose expression: Moderate: Character similarity 0.70 with 'The Second Key' (similar cast structure and roles)
10. STORY TO DATE ANTI-COPY RULE: The STORY TO DATE section below is provided for chronological and factual reference ONLY. You MUST NOT copy, lightly rephrase, or structurally echo any sentence or paragraph from prior chapters. Every sentence in this chapter must be original prose unique to this scene. Reusing even a clause from prior chapter text will cause this attempt to fail immediately.

CRITICAL PROSE REQUIREMENTS:

The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.

**Discriminating Test Scene (Act 3, Scene 4):**
Required elements: Execute the discriminating test, Observe the culprit's reaction or result, Draw conclusion about guilt

**Suspect Clearance Scenes:**
- Captain Ivor Hale (Act 3, Scene 5): Proven to be in the office during the time of the murder.
  Clues: clue_id_1, clue_id_2
- Hugo Vane (Act 3, Scene 5): Witnesses confirm he was discussing art with guests when the poison was administered.
  Clues: clue_id_1, clue_id_2
- Beatrice Quill (Act 3, Scene 5): Confirmed to have been in another part of the hotel during the incident.
  Clues: clue_id_1, clue_id_2

**Culprit Revelation Scene (Act 3, Scene 6):**
Method: Confrontation with evidence

**Clue Placement for These Chapters:**
- clue_2 must appear in Act 1, Scene 3 via Direct observation
- clue_4 must appear in Act 1, Scene 3 via Witness statement
- clue_7 must appear in Act 1, Scene 3 via Direct observation
- clue_culprit_direct_dr_mallory_finch must appear in Act 1, Scene 3 via Direct observation
- clue_fp_contradiction_step_1 must appear in Act 1, Scene 3 via Cross-check contradiction
- clue_mid_1 must appear in Act 1, Scene 3 via Witness statement

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
Investigation state at start: 5 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Hugo Vane, Beatrice Quill
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

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
  - Scene is set in: the hotel parlor — reference it naturally within the paragraph, never as your opening phrase.
  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / sunlight / overcast / cloudy / bright / dark / grey / pale / cold / warm / chill / crisp / damp / drizzle / haze / lamplight / firelight. A chapter that omits all of these from its opening paragraph will be rejected.
  - PARAGRAPH OPENER DIVERSITY (MANDATORY — validator enforced): No more than 2 paragraphs in this chapter may begin with "Eleanor" or "Eleanor's" as the first word. You must vary paragraph openings throughout: use sensory observations, another character's name or action, dialogue, object or sound details, or temporal markers. Opening 3 or more paragraphs with "Eleanor" will cause automated rejection.
  - ⛔ MECHANISM SPOILER BAN: Do NOT state how the crime device was manipulated — not the direction, not the magnitude, not who performed it. Characters may only observe that two sources of evidence disagree. The specific method, tamper amount, and perpetrator's action are ALL FORBIDDEN until the reveal. WRONG: "The culprit had altered the device by forty minutes to create a false alibi." RIGHT: "Two independent pieces of evidence gave contradictory readings — a discrepancy neither could yet explain."
  - Continuity bridge: in the first 120 words, visibly connect from the previous chapter's final beat. Carry forward one unresolved element (object, accusation, emotional pressure, or immediate physical action) from: "She closed her journal, the snap of the cover decisive. The investigation was no longer a matter of tracing routine; it was a matter of exposing deception. The guests’ alibis, once plausible, now wavered beneath the weig...".
  - CLUE OBLIGATIONS — each clue below MUST be dramatized, but in YOUR OWN WORDS:
    Render each as something a character SEES, DOES, or SAYS on the page. The bracketed text is a
    DESCRIPTION of the evidence for you — do NOT transcribe it as narration. Copying a clue's
    description sentence verbatim into the prose FAILS validation.
    • fingerprints, decanter, clearly, visible [clue_2] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: finch, involvement, murder, suggested
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • witnesses, sylvia, looking, pale, disoriented [clue_4] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: sylvia, condition, raises, suspicion, foul, play
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • glass, shows, distinct, dark, residue [clue_7] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: presence, poison, sylvia, drink
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • fingerprints, decanter, clearly, visible [clue_culprit_direct_dr_mallory_finch] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      ⛔ SPOILER EMBARGO (pre-reveal chapter): surface ONLY the surface anomaly a character can see/hear/find.
         Do NOT name who it implicates, state the tamper direction or magnitude, or explain the mechanism in this chapter.
         Present it as an unexplained discrepancy; the culprit and method are revealed later.
         Place this OBSERVATION in paragraph 1 or 2 (observation only — no inference about the culprit).
    • decanter, used, serving, dinner, fingerprints, match, finch [clue_fp_contradiction_step_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: indicates, finch, last, person, handle, decanter
      ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear in paragraphs 1 or 2 — no later):
         Paragraph 1: The POV character physically approaches or directly observes this evidence.
           The narration or dialogue explicitly states what is seen (use the exact locked phrase if one applies).
         Paragraph 2 (immediately following): The detective or POV character explicitly reasons
           about what this evidence implies — who it implicates, why it may be unreliable,
           or what inference it supports. This must be a separate full paragraph, not a sentence appended to Paragraph 1.
    • decanter, used, serving, dinner, fingerprints, match, finch [clue_mid_1] ⚠ EARLY PLACEMENT — write this in paragraphs 1 or 2 of the chapter
      Points to: mechanism, murder, involves, decanter, tincture
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
  - ALIBI LOCK: Dr. Mallory Finch's established alibi is "Evening of the murder". Do NOT place Dr. Mallory Finch at any other location or in any other activity during the crime window. Any contradiction is a continuity error that triggers a retry.
  - TESTIMONY CONTINUITY: Dr. Mallory Finch has already made statements in earlier chapters. Any time, location, or claim attributed to Dr. Mallory Finch in THIS chapter must be consistent with those earlier statements. Do NOT introduce a new or different alibi claim — any contradiction is a continuity error.
- Locked fact phrase obligations:
  - If this batch mentions the weight of the brooch, affecting its comfort and wear time, write exactly: "three ounces".
  - If this batch mentions the body temperature at which the poison activates, write exactly: "ninety-eight point six degrees Fahrenheit".
  - If this batch mentions the time it takes for the poison to start affecting the victim, write exactly: "two hours".
- Seasonal vocabulary allow-list: winter, wintry, midwinter.
- Forbidden seasonal words: spring, summer, autumn.

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
Investigation state at start: 5 clue(s) revealed to reader; approximately 3 unresolved suspect(s).
Must change by end: Increase or complicate suspicion through a new pressure revelation — WITHOUT resolving the case: do NOT name, accuse, or extract a confession from the culprit, make an arrest, or declare the case closed (that is reserved for the final reveal).
Suspect pressure target(s): Captain Ivor Hale, Hugo Vane, Beatrice Quill
Required new information: At least one fear/motive/lie/loyalty reveal with investigative consequence.
Forbidden reveals at this stage: No culprit resolution: no confession, no arrest, no 'case closed', no accusation ('I accuse'/'I name'), and never state 'the culprit/murderer/killer is/was …'. The accusation is reserved for the final reveal — build suspicion only.

FROZEN FACT STATE (DO NOT ALTER):
- Timeline anchor: February (winter).
- Month, season, weather, and time-of-year language in this batch must stay compatible with winter.
- Established timeline fact: Dinner service start
- Established timeline fact: Time of collapse
- If referenced, use exact phrase: "three ounces" (the weight of the brooch, affecting its comfort and wear time).
- If referenced, use exact phrase: "ninety-eight point six degrees Fahrenheit" (the body temperature at which the poison activates).
- If referenced, use exact phrase: "two hours" (the time it takes for the poison to start affecting the victim).

STORY TO DATE (REFERENCE ONLY — DO NOT COPY VERBATIM):
- Full prior chapter text is provided below for continuity, factual consistency, and reference accuracy.
- Use this to keep character voice, chronology, clue state, and location continuity aligned with earlier chapters.
- Do not quote, copy, or paraphrase these paragraphs too closely; write fresh prose that remains consistent with them.

--- BEGIN PRIOR CHAPTER 1 ---
Title: Chapter 1: A Chill in the Air
Eleanor Voss pressed open the heavy door, the cold morning air biting at her cheeks as she stepped into the scene. The faint scent of salt mingled with the sharper tang of cleaning spirits, and a hush had settled over the corridor, broken only by the distant, muffled crash of waves against the Brighton shore. Lamplight flickered across the patterned carpet, casting long shadows that seemed to tremble with each step she took. Ahead, the tableau was unmistakable: Sylvia Trent stood rigid, her hands balled at her sides, staring at the lifeless form of Dr. Mallory Finch, who lay sprawled on the floor, her head turned at an unnatural angle toward the wall.

A decanter sat on the low table just beyond Dr. Mallory Finch’s outstretched hand, its glass surface smudged with fingerprints—some fresh, some blurred by nervous hands. The stopper lay beside it, as though it had been wrenched free in haste. A faint residue of something viscous clung to the rim, and the scent of juniper and something medicinal hung in the air. Eleanor’s gaze caught the glint of a teaspoon, abandoned on the carpet, and the half-filled glass beside the body. The fingerprints on the decanter were clearly visible, standing out against the cut crystal like a silent accusation.

Eleanor knelt, careful not to disturb the scene. The fingerprints—so prominent—suggested someone had handled the decanter recently, perhaps during or just before the dinner service. If these marks matched the last person to serve drinks, it would narrow the field considerably. The presence of the tincture and the decanter, both so close to Dr. Mallory Finch, hinted at a mechanism more deliberate than accidental. She would need to confirm whose prints these were, but the implication was clear: access to the decanter was a privilege not afforded to all.

Sylvia Trent’s composure was a fragile mask. Her eyes, wide and glassy, flicked between Eleanor and the body, her lips parted but voiceless. She wore a tea-length dress, the hem trembling as though her legs might give way. The string of pearls at Sylvia’s throat seemed to choke her, and her knuckles were white where she gripped the back of a velvet chair. Eleanor rose, offering a steadying hand, but Sylvia recoiled, her gaze fixed on Dr. Mallory Finch’s lifeless form.

‘She—she was just here. We were talking about the exhibition, and then—’ Sylvia’s voice faltered, the words dissolving into the hush. The tension in the room was palpable, thickened by the knowledge that everyone present had, at some point, been close enough to touch the decanter. The faint scent of herbs clung to the air, mingling with the metallic tang of fear.

The Grand Lobby beyond was silent, save for the soft tread of Captain Ivor Hale as he appeared in the doorway. His uniform was immaculate, navy blue wool pressed to a razor’s edge, but his eyes betrayed a sleepless night. He glanced at Eleanor, then at Sylvia, a muscle working in his jaw. ‘Miss Voss,’ he said quietly, ‘they said you’d arrived. I… didn’t expect to see you so soon.’ He lingered at the threshold, as though reluctant to cross into the room itself.

Beatrice Quill hovered near the window, her silhouette outlined against the grey, wintry light. She clutched a notebook to her chest, fingers drumming a nervous rhythm on its cover. Beatrice’s gaze darted to the decanter, then away, and she busied herself with the curtain cord, twisting it until it threatened to snap. ‘It’s all wrong,’ Beatrice murmured, almost to herself. ‘She was fine at dinner. Laughing. And now…’ Her words trailed off, unfinished.

Hugo Vane arrived last, his overcoat dusted with a fine mist from the sea air. He paused just inside the door, surveying the scene with a measured detachment. His gloved hands remained in his pockets, and his expression was unreadable—a flicker of something like recognition passing over his features as he noted the decanter and the glass. Hugo’s presence was a reminder that not all in the hotel were friends; some were merely observers, and some, perhaps, had secrets to keep.

Eleanor straightened, her own reflection wavering in the polished surface of the decanter. The fingerprints—clearly visible—were a silent testament to the last moments before Dr. Mallory Finch’s collapse. The tincture, the glass, the unnatural stillness of the body: each detail demanded scrutiny. But it was the contradiction that unsettled her most. If Dr. Mallory Finch had poured the drink herself, why were the prints so prominent, so fresh? And if not, who had handled the decanter last, and why?

‘Miss Voss, you’re the only one with a clear head,’ Captain Ivor Hale said, his voice low. ‘We need to know what happened here. The staff are in pieces, and the guests…’ He trailed off, glancing at Sylvia, whose composure was fraying by the second. Eleanor nodded, accepting the role thrust upon her. She was the investigator now—whether by choice or necessity.

A draft crept in from the corridor, carrying with it the scent of damp wool and the distant echo of a radio broadcasting war news. The world outside pressed in, but here, time seemed to have paused, the winter morning frozen around the body of Dr. Mallory Finch. Eleanor’s thoughts churned, sifting through the evidence already before her: the fingerprints, the decanter, the tincture, the glass. Each guest had access. Each had motive, perhaps. But only one had acted.

She moved to the window, glancing out at the grey expanse where sea met sky, the horizon blurred by mist. The reflection of the room behind her was distorted in the glass, the figures within rendered ghostly by the wintry light. Eleanor turned back, her gaze settling on the decanter once more. The fingerprints would tell their own story—if only she could read them.

Sylvia Trent’s composure faltered entirely. She pressed her hands to her face, shoulders shaking. ‘I should have done something,’ she whispered. ‘I should have noticed…’ Her words were lost in the hush, but Eleanor caught the tremor of guilt and grief. It was not accusation, but it was close.

Beatrice Quill stepped forward, her voice barely above a whisper. ‘If you need anything, Miss Voss, I… I kept notes about the dinner. For the exhibition. I can show you, if you think it matters.’ Her offer was earnest, but her eyes betrayed a flicker of something else—fear, perhaps, or the burden of knowledge.

Captain Ivor Hale’s discipline was evident in every line of his posture, but he did not meet Eleanor’s gaze. Instead, he studied the decanter, his brow furrowed. ‘Strange, isn’t it, how something so ordinary can become…’ He left the sentence unfinished, the implication hanging between them.

Hugo Vane remained apart, his silence a shield. He watched the interplay of glances, the subtle shifts in allegiance and suspicion. When Eleanor finally met his eyes, he offered only a small, inscrutable nod—as if to say, the game is afoot, and all are players now.

The morning light grew no warmer as Eleanor began her work. The fingerprints on the decanter, the tincture, the glass—all would need to be catalogued, examined, compared. She would ask questions, listen for what was not said, and trust that the truth, however well hidden, would not remain so forever. For now, the body of Dr. Mallory Finch was the only certainty in a room full of doubts.
--- END PRIOR CHAPTER 1 ---

--- BEGIN PRIOR CHAPTER 2 ---
Title: Chapter 2: Initial Reactions
"It tasted wrong, I tell you," Beatrice Quill insisted, her voice trembling as she stared at the untouched glass on the linen-draped table. The hotel dining room, usually bright with morning chatter, was subdued beneath the overcast light filtering through tall windows. Shadows pooled in the corners, and the soft jazz from the radio barely masked the anxious whispers among the guests. The scent of simmering sauces lingered from the kitchen, clashing with the metallic tang of unease. Eleanor Voss stood at the head of the table, her gloved hand resting on the back of a chair, as she watched Beatrice’s eyes dart from the glass to the decanter that sat, ominously, near the silver tray.

Eleanor’s gaze lingered on the decanter, its cut crystal surface smudged with fingerprints—some fresh, others dulled by the night’s events. The stopper was set askew, as if replaced in haste, and a faint residue clung to the rim. She noted the contradiction: if only Dr. Mallory Finch had poured the drinks, why were so many prints so clear, so recently impressed? Her mind circled the evidence—Sylvia Trent’s complaint about the bitter taste, the visible handling of the decanter, the timing of the collapse. Each detail suggested a deliberate act, not mere accident. The implication was chilling: the mechanism of harm had been set in motion at the dinner table, in plain sight.

The contradiction gnawed at Eleanor. She recalled Beatrice’s words—Sylvia had pressed a napkin to her lips, grimacing, and muttered about the bitterness of her drink. In that moment, the laughter at the table had faltered, replaced by a ripple of concern. But no one had acted, not truly. Now, in the cold morning aftermath, that complaint echoed louder than any accusation. If Sylvia’s drink had tasted off, and the decanter bore the marks of multiple hands, then someone had tampered with more than just the routine of dinner service. The evidence did not align with the assumption of an accident; it hinted at something more calculated.

Captain Ivor Hale stood rigid near the window, his silhouette framed by the wintry light. He wore his navy blue suit, the fabric crisp but his posture betraying fatigue. His fists clenched and unclenched at his sides. "She said it was bitter, yes. But people complain about the food here all the time," he muttered, his tone clipped. Eleanor watched him carefully, noting the way his gaze avoided the decanter. A muscle flickered in his jaw. "I didn’t see who poured her drink. I was talking to Hugo about the blackout curtains. You know how it is—everyone distracted, the staff rushing. It could have been anyone." His words were measured, but the evasion was clear. The room felt colder for it.

Hugo Vane, perched on the edge of a chair, exhaled sharply. "What’s the scoop, Miss Voss? You think one of us slipped something in her glass?" His tone was brisk, almost mocking, but his eyes were sharp. He tapped the table with a forefinger, the sound a nervous metronome. "I saw Beatrice fussing with the flowers, Ivor was by the window, and Sylvia was already complaining before the main course. If you’re after a timeline, you’ll need more than our memories. The clocks in this room don’t even agree—one said half past eight, the other closer to nine. Makes for a tidy mess, doesn’t it?"

Eleanor allowed herself a small, dry smile. "The clocks are unreliable witnesses, Mr. Vane, but people are worse. Still, I’ll take what I can get." She moved to the mantel, where the ornate clock’s hands stood at odds with the wall clock above the sideboard. The discrepancy was striking. If the times could not be trusted, then neither could the stories built upon them. She scribbled a note in her pocket journal, the scratch of her pencil loud in the hush. The contradiction in the timeline was no longer a minor irritation—it was a fissure running through every alibi offered that morning.

Beatrice’s fingers twisted the cord of her notebook, her earlier bravado fading. "I only poured water," she said, her voice softer now. "Sylvia poured her own wine, I think. Or maybe it was Dr. Finch. It all blurs together. I was distracted by the telegram—my brother’s unit is being moved. I’m sorry, I just… I can’t remember exactly." Her confession was genuine, but Eleanor caught the edge of guilt beneath the uncertainty. The war had left everyone fractured, their attention divided between the present and distant fears.

Captain Ivor Hale’s voice was low, almost a growl. "It’s all in the past, isn’t it? We all have our battles." He glanced at Beatrice, then at Eleanor, as if daring her to press further. The tension between them was palpable, a current running beneath the surface. Eleanor noted the defensive posture, the way Ivor’s gaze lingered on the decanter but never quite met her eyes. Was it grief, or something more? The question hung unspoken.

Hugo Vane leaned back, arms crossed. "Let’s not get bogged down in details. If you want to know who had the opportunity, ask the staff who was actually paying attention. The rest of us were just trying to get through another wintry evening without bad news from the radio." His words were flippant, but Eleanor heard the undercurrent of anxiety. Hugo’s bravado was a shield, but one with cracks.

The muted colors of the dining room’s decor—soft golds and faded greens—seemed to absorb the morning’s tension. Shadows pressed against the walls, and the flicker of the chandelier cast uncertain patterns across the white tablecloths. Eleanor’s thoughts returned to the fingerprints on the decanter, the bitter taste complaint, the conflicting clock times. Each clue, considered alone, had pointed to routine or chance. Now, together, they formed a pattern of contradiction. The original meaning—accident, distraction, the chaos of wartime—was giving way to a darker suspicion: someone had manipulated the scene, and the truth was being actively concealed.

Eleanor Voss pressed on to the next concrete detail. The record now held: Witnesses report sylvia complained bitter taste.

That detail shifted the reasoning. Weighed against the rest, Witnesses report sylvia complained bitter taste bent the trail toward Indicates possible poisoning.

She closed her journal, the snap of the cover decisive. The investigation was no longer a matter of tracing routine; it was a matter of exposing deception. The guests’ alibis, once plausible, now wavered beneath the weight of conflicting timelines and nervous recollections. Eleanor’s role was clear: she would have to press harder, listen more closely, and trust that the smallest detail—a misplaced glass, a bitter taste, a clock’s stubborn hands—might unravel the web of lies. The winter light outside had grown no brighter, but inside the dining room, the shadows had shifted. The game was afoot, and Eleanor Voss would not let the truth slip through her fingers.
--- END PRIOR CHAPTER 2 ---

[SCENE COMPLETENESS CONTRACTS — MANDATORY. Each contract below lists what you MUST enact in that chapter. Do not summarise or mention these labels in the prose — enact them organically.]
Chapter 3 (Act 1) completeness contract:
  PIVOT ELEMENT (MANDATORY — write this into the prose, shown not told): "The decanter with Dr. Finch's fingerprints, linking him directly to the crime."
  FACT ESTABLISHED (MANDATORY — reader must know this by chapter end): "Establishes that Dr. Finch had access to the poisoned drink, narrowing down the suspects."

# Case Overview
Title: The Poisoned Palette
Era: 1940s
Setting: Coastal Hotel
Crime: murder (poisoning)
Culprit: Dr. Mallory Finch
Victim: Sylvia Trent
False assumption: Sylvia's death was an unfortunate accident resulting from her known anxiety issues.
Cast: Eleanor Voss (she/her), Dr. Mallory Finch (she/her), Captain Ivor Hale (he/him), Beatrice Quill (she/her), Sylvia Trent (she/her), Hugo Vane (he/him)

Setting Lock: Keep all scenes and descriptions consistent with the stated setting (Coastal Hotel). Do not introduce a different location type. Do not invent an alternative estate name. The only permitted name for this property is "Coastal Hotel" — any other estate name (e.g., "Caldwell Manor", "Ashwood Hall", or any invented proper name) is a continuity error that will be caught and rejected.

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
    "title": "The Investigation Begins",
    "setting": {
      "location": "the hotel parlor",
      "timeOfDay": "Early afternoon",
      "atmosphere": "Intense and focused as the detective begins her work"
    },
    "characters": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Hugo Vane",
      "Beatrice Quill"
    ],
    "purpose": "Initiate the investigation and gather initial clues",
    "cluesRevealed": [
      "clue_2",
      "clue_4",
      "clue_7"
    ],
    "dramaticElements": {
      "conflict": "Eleanor faces resistance from the guests.",
      "tension": "Accusations and mistrust simmer beneath the surface.",
      "microMomentBeats": [
        "Eleanor rubs her temples, overwhelmed by the conflicting stories."
      ]
    },
    "summary": "Eleanor gathers the guests in the parlor to begin her investigation. She observes the decanter used for dinner, which bears fingerprints matching Dr. Finch. Witnesses confirm that Sylvia complained about a bitter taste in her drink shortly before her collapse, and Eleanor discovers a bitter residue at the bottom of Sylvia's glass, raising further questions.",
    "beat": "first_enquiries",
    "estimatedWordCount": 1800,
    "pivotElement": "The decanter with Dr. Finch's fingerprints, linking him directly to the crime.",
    "factEstablished": "Establishes that Dr. Finch had access to the poisoned drink, narrowing down the suspects.",
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
        "characterName": "Hugo Vane",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      },
      {
        "characterName": "Beatrice Quill",
        "behaviour": "Show normal social behaviour; grief or confusion if appropriate."
      }
    ],
    "redHerringPlacement": null,
    "emotionalRegister": "Eleanor begins her investigation, feeling the emotional weight of her connection to the victim.",
    "dominantCharacterNote": {
      "name": "Eleanor Voss",
      "voiceRegister": "Eleanor's voice carries a fluid cadence, often punctuated by dry wit, reflecting her observant nature."
    },
    "humourGuidance": {
      "permission": "conditional",
      "character": "Eleanor Voss",
      "form": "dry_wit",
      "condition": "Eleanor Voss"
    },
    "eraTextureNote": "Limited access to goods due to rationing.; Short daylight hours with sunset around 5:30 PM.; Travel restrictions and heightened security in public spaces.; Limited communication options due to wartime conditions.; Social gatherings are often subject to local curfews.",
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
□ Allowed seasonal words only: winter, wintry, midwinter.
□ Forbidden seasonal words: spring, summer, autumn.
□ Chapter 3: the clue [clue_2] (decanter, used, serving, dinner, fingerprints, match, finch) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_4] (witnesses, confirm, sylvia, appeared, unwell, shortly, dinner) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_7] (bitter, residue, bottom, sylvia, glass) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_culprit_direct_dr_mallory_finch] (direct, ties, mallory, finch, mechanism, access, point, before, discriminating, excludes, competing, suspect) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_fp_contradiction_step_1] (decanter, used, serving, dinner, fingerprints, match, finch) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
□ Chapter 3: the clue [clue_mid_1] (mechanism, relies, tincture, dinner, decanter, expose, false, timing) is placed in the first 25% of the chapter, dramatized in your own words, followed by an explicit inference or suspicion paragraph.
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
