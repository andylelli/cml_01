# Actual Prompt Record

- Run ID: `mystery-1778523031529`
- Project ID: ``
- Timestamp: `2026-05-11T18:14:31.369Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `3e5fb781cfb70d5d`

## Message 1 (role=system)

```text
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
  - You must not invent any new character secrets, new relationships, or new backstory beyond
    what is in the provided inputs.
  - You must not name the culprit identity or describe any clue in specific forensic detail.
  - Every locked fact (exact times, distances, quantities, measurements) must appear in this
    document exactly as given — not paraphrased, not rounded, not changed.
  - Character voice sketches must be consistent with the speechMannerisms and humourStyle
    from the character profiles. A character with humourStyle: "none" must not produce wit.
  - The historical moment section must reason from the specific year and month provided.
    It must not be a general description of the decade. A reviewer should be able to
    identify the approximate date from the historicalMoment section alone.
  - All text fields must be written as if addressed to a novelist about to write this story:
    purposeful, not bureaucratic; specific, not generic.
  - storyEmotionalArc.arcDescription MUST be at least 300 words across multiple paragraphs.
    A single-paragraph summary is insufficient regardless of word count — the emotional
    journey must unfold across clearly distinct paragraphs.
    Trace opening → rising tension → first turn → mid → second turn → climax → resolution.
  - FIRST-PASS CONTRACT: satisfy storyTheme, revealImplications, and arcDescription minimum lengths in the initial response; do not rely on deterministic fallback expansion.
  - humourPlacementMap: every entry (all 12 scene positions) MUST include a non-empty
    "rationale" string. This applies to "forbidden" entries too — explain WHY it is forbidden.
    Omitting rationale on any entry will cause schema validation failure.
  - FIRST-PASS CONTRACT: include all required humourPlacementMap scene positions exactly once in the initial response.

You will produce a single JSON object. Return only the JSON. No preamble, no commentary.
```

## Message 2 (role=user)

```text
## INPUTS

### CASE
{
  "meta": {
    "title": "The Clockwork Deception",
    "author": "ChatGPT",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Stately Manor House",
      "country": "England",
      "institution": "country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "timed murder"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Wealthy socialite and astute observer",
      "private_secret": "Struggles with financial instability",
      "motive_seed": "Desire to protect her family's reputation",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal and familial reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "medical expert",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Financial troubles from bad investments",
      "motive_seed": "Desire to eliminate a financial rival",
      "motive_strength": "moderate",
      "alibi_window": "one hour before murder",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "military officer",
      "relationships": [],
      "public_persona": "Heroic war veteran",
      "private_secret": "Hidden gambling debts",
      "motive_seed": "Desire to cover financial misconduct",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Honor and financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "housekeeper",
      "relationships": [],
      "public_persona": "Loyal domestic worker",
      "private_secret": "In love with one of the suspects",
      "motive_seed": "Desire to protect her beloved",
      "motive_strength": "low",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal relationships",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Dr. Mallory Finch"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a family reunion at a grand manor, a wealthy benefactor is found dead, triggering an investigation led by Eleanor Voss. As the clock ticks, she uncovers a carefully orchestrated scheme involving a clock tampering that misleads the timeline of the murder."
    },
    "accepted_facts": [
      "The victim was found dead at ten minutes past eleven.",
      "A mechanical clock was found tampered with, showing the incorrect time."
    ],
    "inferred_conclusions": [
      "The time of death was altered to create an alibi."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was wound back to fabricate an alibi for Dr. Mallory Finch.",
      "delivery_path": [
        {
          "step": "The clock was manually adjusted to show the incorrect time."
        }
      ]
    },
    "outcome": {
      "result": "The murder appears to have occurred at a different time than it actually did."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred after the last known sighting of the victim.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses last saw the victim at a time that aligns with the clock's incorrect reading.",
    "what_it_hides": "The actual time of death was much earlier, due to the tampering."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Last witness sighting at quarter past ten",
        "Victim's body discovered at ten minutes past eleven"
      ],
      "windows": [
        "Time of death believed to be between ten and eleven"
      ],
      "contradictions": [
        "The clock showed ten minutes past eleven, but was tampered with to mislead."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Eleanor Voss",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The clock",
        "The victim"
      ],
      "permissions": [
        "All actors had access to the manor."
      ]
    },
    "physical": {
      "laws": [
        "Clock mechanisms can be adjusted and tampered."
      ],
      "traces": [
        "No fingerprints found on the clock except for Dr. Mallory Finch."
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor Voss as a trusted family member"
      ],
      "authority_sources": [
        "Dr. Mallory Finch as the physician"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past eleven.",
        "correction": "The time on the clock cannot be trusted due to tampering.",
        "effect": "Narrows the time of death to earlier than indicated.",
        "required_evidence": [
          "Victim's body discovered at ten minutes past eleven",
          "Witness testimony claiming last sighting was at quarter past ten"
        ],
        "reader_observable": true
      },
      {
        "observation": "A note indicating the time of murder was found at the scene.",
        "correction": "The note conflicts with the clock's reading, suggesting tampering.",
        "effect": "Eliminates the assumption the murder occurred after the last sighting.",
        "required_evidence": [
          "The clock shows ten minutes past eleven",
          "The note states the murder occurred at half past ten"
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock's winding key was discovered in Dr. Mallory Finch's possession.",
        "correction": "Dr. Mallory Finch had the means to tamper with the clock.",
        "effect": "Eliminates Dr. Mallory Finch's alibi as he had access to the clock.",
        "required_evidence": [
          "Clock shows signs of recent tampering",
          "Dr. Mallory Finch's fingerprints on the clock"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled reenactment is conducted where the clock is checked against witness statements of the last sighting.",
    "knowledge_revealed": "The clock's tampering contradicts the established timeline.",
    "pass_condition": "If Dr. Mallory Finch's alibi fails to align with the evidence presented.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_core_contradiction_chain",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock indicates a false time (early) and the last sighting (mid) suggests an earlier death. Step 2: The conflicting note (mid) shows the murder couldn't have happened after the sighting. Step 3: The clock key found with Dr. Finch (discriminating test) confirms his access and tampering."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 3,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 3,
      "essential_clues_before_test": true,
      "early_clues_min": 2,
      "mid_clues_min": 2,
      "late_clues_min": 1
    },
    "discriminating_test_requirements": {
      "timing": "early_act3",
      "must_reference_inference_step": true
    }
  },
  "prose_requirements": {
    "discriminating_test_scene": {
      "act_number": 3,
      "scene_number": 4,
      "required_elements": [
        "Execute the discriminating test",
        "Observe the outcome of the reenactment",
        "Draw conclusion about Dr. Mallory Finch's guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proving he was in the stables during the murder",
        "supporting_clues": [
          "Witness testimony from stable hands"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 6,
        "clearance_method": "Documented alibi during the murder",
        "supporting_clues": [
          "Housemaid's log entry"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 7,
      "revelation_method": "Confrontation with evidence of clock tampering"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Found note at the scene"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Discovery of the winding key"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a local historian and amateur sleuth, is known for her charm and eccentricity. Beneath her knowledgeable exterior lies a determined investigator seeking truth amidst scandal.",
    "publicPersona": "Eleanor is often seen as a whimsical character, her passion for local history drawing in both admiration and bemusement from the townsfolk. She has a knack for weaving stories from the past, making her a beloved figure in Little Middleton, albeit one with a reputation for being a bit odd.",
    "privateSecret": "In the shadows of her charming persona, Eleanor has been meticulously piecing together a scandal involving the victim and a powerful local family. The weight of this secret hangs heavily on her, as she fears it could tarnish her own reputation if exposed.",
    "motiveSeed": "Eleanor is driven by a fierce desire to unveil the truth behind the scandal, not just for the sake of justice but to protect her own standing in the community.",
    "motiveStrength": "strong",
    "alibiWindow": "Her alibi is solid; she was in the library, engrossed in research between seven and eight when the crime occurred.",
    "accessPlausibility": "Given her role as a local historian, Eleanor has easy access to various places in town, including the victim's home where the crime took place.",
    "stakes": "The stakes for Eleanor are high—uncovering the truth could either exonerate her from suspicion or plunge her into disgrace.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a melodic cadence, often punctuating her sentences with historical anecdotes. She has a tendency to use anachronistic phrases, lending a whimsical charm to her otherwise serious discussions.",
    "internalConflict": "Eleanor grapples with the fear that her pursuit of truth may lead to her own downfall, as the scandal she investigates could reflect poorly on her integrity.",
    "personalStakeInCase": "This crime matters deeply to Eleanor, as it intertwines with her own reputation and the legacy she wishes to leave in Little Middleton.",
    "paragraphs": [
      "Eleanor Voss stood amidst the dusty tomes of the Little Middleton library, her fingers tracing the spines of books that whispered secrets of a bygone era. To the casual observer, she appeared a mere eccentric, a woman whose love for local history bordered on obsession. Yet, beneath her charming exterior lay a keen intellect and an insatiable curiosity that drove her into the depths of a scandal that could threaten her very standing in the community.",
      "Her public persona, adorned with the trappings of quaint eccentricity, served as a delightful mask. Eleanor was the town's storyteller, weaving tales that captivated children and adults alike. However, as she delved deeper into the life of the victim, she uncovered threads of deceit that entangled not only the elite but also her own reputation. The thought of being implicated in the very scandal she sought to expose gnawed at her conscience, a constant reminder that knowledge could be a double-edged sword.",
      "As she pieced together the puzzle, Eleanor's wit often emerged as her shield. 'You see, history repeats itself,' she would quip, 'but rarely does it come with a warning label.' It was this dry humor that endeared her to some but alienated others who viewed her as a mere oddity. In her heart, she longed for respect, to be seen not just as the quirky historian but as a formidable investigator capable of unveiling the truth.",
      "But as the clock ticked closer to the moment of revelation, Eleanor faced a moral quandary. Would she expose the scandal, potentially shattering the lives of those involved, including herself? The weight of her secret pressed upon her, a burden she could no longer bear alone. The stakes had risen, and Eleanor knew that the truth, once unearthed, would demand a price far greater than she had anticipated."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, presents himself as a dedicated doctor committed to his patients. However, lurking beneath his polished exterior is a man ensnared by his own ethical transgressions.",
    "publicPersona": "Known for his charitable work, Mallory is often the first to volunteer for community health initiatives. His reputation as a caring physician is well-established, and he carries himself with an air of confidence that inspires trust in his patients.",
    "privateSecret": "Despite his public image, Mallory has been involved in unethical medical experiments funded by the victim, a truth that could unravel his life and career.",
    "motiveSeed": "The fear of exposure looms large for Mallory, as the potential fallout from his malpractice could lead to the loss of his practice and the respect he has built over the years.",
    "motiveStrength": "compelling",
    "alibiWindow": "Mallory claimed to be attending to a patient at the time of the crime, but whispers of his presence at the stables shortly before the incident cast doubt on his story.",
    "accessPlausibility": "As a physician, Mallory has plausible access to many areas in town, but his presence at the stables raises questions about his true intentions.",
    "stakes": "For Mallory, the stakes are nothing short of his career and reputation. He must navigate the treacherous waters of his past choices while maintaining the façade of a devoted doctor.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a measured tone, often employing medical jargon that can sound intimidating to the uninitiated. He has a tendency to soften his more sinister remarks with a genteel smile, masking the darkness beneath his words.",
    "internalConflict": "Mallory wrestles with guilt over his unethical practices, torn between his ambition and the ethical standards he once upheld. The fear of losing everything he has built weighs heavily on his conscience.",
    "personalStakeInCase": "This crime resonates with Mallory on a personal level, as the potential exposure of his past could shatter the life he has meticulously constructed in Little Middleton.",
    "paragraphs": [
      "Dr. Mallory Finch strode through the bustling streets of Little Middleton, his well-tailored suit and confident demeanor painting him as the epitome of a caring physician. To the townsfolk, he was a beacon of hope, the man who healed their ailments and offered comfort in times of distress. Yet beneath this polished exterior lurked a darkness that threatened to engulf him, a secret so profound it could dismantle the very foundation of his career.",
      "His involvement in unethical medical experiments, funded by the victim, had become a precarious balancing act. Mallory often found himself caught in a web of lies, his conscience whispering reminders of the moral decay he had embraced for the sake of ambition. 'After all,' he would often jest with a sardonic smile, 'medicine is merely a gamble—some of us just play for higher stakes.' This polite savagery masked his internal conflict, a desperate attempt to maintain control over a spiraling situation.",
      "As he navigated the treacherous terrain of the investigation, Mallory's alibi became a double-edged sword. While he claimed to be with a patient, the whispers of his presence at the stables painted a different picture. The stakes were high, and as the walls began to close in, he realized that the truth could no longer remain buried. The fear of exposure gnawed at him, a relentless reminder of the precariousness of his position.",
      "In the quiet moments, when the weight of his choices pressed heavily upon him, Mallory contemplated the man he had become. Would he continue down this path of deception, or could he find redemption in the truth? As he faced the consequences of his actions, the lines between right and wrong blurred, leaving him to grapple with the haunting question: at what cost do we protect our secrets?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired military officer, embodies charisma and charm, yet beneath his gregarious exterior lies a man wrestling with past betrayals and a thirst for revenge.",
    "publicPersona": "Ivor is the life of the party, effortlessly drawing people into his orbit with his stories of military valor and adventure. His commanding presence and infectious laughter make him a favorite among the social elite of Little Middleton.",
    "privateSecret": "Beneath the surface, Ivor harbors deep resentment towards the victim, whose betrayal had a profound impact on his military career, leaving scars that have yet to heal.",
    "motiveSeed": "The desire for revenge drives Ivor, as he seeks to confront the very person who played a pivotal role in his downfall, hoping to reclaim a sense of honor lost.",
    "motiveStrength": "strong",
    "alibiWindow": "While he claimed to be socializing with guests, witnesses reported seeing Ivor arguing with the victim shortly before the crime took place.",
    "accessPlausibility": "Ivor's status as a retired officer grants him a semblance of access, but his confrontational nature raises questions about his intentions during the event.",
    "stakes": "For Ivor, the stakes are personal and deeply rooted in his sense of honor. He seeks closure for the betrayal that has haunted him for years.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a commanding voice, often punctuating his tales with dramatic flair. His sardonic humor comes through in ironic comments about his past, reflecting the bitterness he feels towards those who have wronged him.",
    "internalConflict": "Ivor grapples with the tension between his charismatic public persona and the dark desires for revenge that simmer beneath the surface. He is torn between the man he presents to the world and the vengeful spirit he struggles to contain.",
    "personalStakeInCase": "This crime strikes a personal chord for Ivor, as it represents an opportunity to confront the past and seek the justice he believes he deserves.",
    "paragraphs": [
      "Captain Ivor Hale entered the grand hall with the swagger of a man who had once commanded battalions, his laughter echoing through the room. To the guests of Little Middleton, he was a charismatic figure, regaling them with tales of his military exploits. Yet, behind that charming façade lay a man consumed by the bitterness of betrayal, a past that haunted him like a specter in the night.",
      "His public persona painted him as a jovial soul, the life of every gathering, but those who looked closely could see the flicker of resentment in his eyes. The victim's betrayal had not only tarnished his military career but had also stripped him of his sense of honor. In moments of sardonic reflection, Ivor would remark, 'Life is but a series of unfortunate events, often orchestrated by those we least expect.' Such jests belied the turmoil that raged within him, a tempest of unresolved anger and a thirst for revenge.",
      "As the investigation unfolded, Ivor's alibi became a point of contention. While he claimed to be mingling with guests, the whispers of his heated argument with the victim painted a different picture. The stakes had risen, and as the shadows of his past loomed larger, he felt the pull of destiny urging him to confront the very person who had wronged him. The desire for revenge transformed into a desperate need for closure, a chance to restore the honor that had been stripped away.",
      "In the quiet moments, when the laughter faded and the echoes of his past grew louder, Ivor faced a reckoning. Would he succumb to the darkness that beckoned or find a way to reclaim his life? The crime that unfolded before him was not merely an investigation; it was a battleground for his soul, a chance to confront the ghosts of his past and emerge victorious."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious journalist, is determined to carve her name in the world of writing. However, her pursuit of success leads her down a treacherous path of blackmail and deceit.",
    "publicPersona": "Beatrice is seen as an aspiring writer with a talent for uncovering secrets, often charming her way into the confidence of her subjects. Her vivacious personality and keen intellect make her a rising star in the local journalism scene.",
    "privateSecret": "Unbeknownst to her colleagues, Beatrice has been blackmailing the victim over a scandal involving embezzlement, a risky venture that could either launch her career or destroy her.",
    "motiveSeed": "Her ambition drives her to seek financial gain through extortion, coupled with a fear of losing her chance at a big break in the competitive world of journalism.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claimed to be in her room writing, but her presence near the crime scene shortly before the incident raises suspicions.",
    "accessPlausibility": "As a journalist, Beatrice has plausible access to various locations in town, making her movements appear legitimate, though her motives are suspect.",
    "stakes": "For Beatrice, the stakes are high; her career and financial stability depend on the success of her schemes and the secrets she uncovers.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a lively rhythm, often punctuating her statements with clever observations. She has a penchant for dramatic flair, making her storytelling engaging while subtly revealing her true intentions.",
    "internalConflict": "Beatrice wrestles with the moral implications of her actions, torn between her ambition and the ethical boundaries she is willing to cross to achieve her dreams.",
    "personalStakeInCase": "This crime matters to Beatrice as it represents both a potential career-making opportunity and a test of her moral compass in the face of temptation.",
    "paragraphs": [
      "Beatrice Quill flitted through the corridors of Little Middleton's social scene like a butterfly, her vibrant personality drawing attention wherever she went. To the townsfolk, she was the embodiment of ambition, an aspiring journalist with a knack for uncovering secrets. Yet, behind her charming smile lay a web of deceit, one that could unravel her carefully constructed facade at any moment.",
      "Her public persona was a dazzling display of confidence and wit, as she often regaled her colleagues with tales of her latest exploits. 'In journalism,' she would quip, 'the truth is often stranger than fiction, provided you have the right angle.' This observational humor masked the darker reality of her life—a secret entanglement with the victim that involved blackmail over embezzlement, a risk that could either launch her career or lead to her downfall.",
      "As the investigation unfolded, Beatrice found herself at a crossroads. While she claimed to be diligently writing in her room at the time of the crime, her presence near the scene just before the incident raised eyebrows. The stakes were high, and the thrill of the chase only fueled her desire to uncover the truth. Yet, the moral implications of her actions loomed large, casting a shadow over her ambitions.",
      "In the quiet moments, when the adrenaline faded, Beatrice grappled with her conscience. Would she continue down this treacherous path, or could she find a way to redefine her ambitions without sacrificing her integrity? The crime that had shaken Little Middleton was not just a story to be told; it was a reflection of her own journey, a chance to confront the choices she had made and determine the woman she truly wished to become."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Middleton Manor",
    "type": "country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Middleton Manor, a grand estate steeped in history, serves as a backdrop for a web of intrigue and deception, its beauty concealing dark secrets.",
    "visualDescription": "The manor stands as a testament to Victorian and Edwardian elegance, its stone façade adorned with intricate woodwork, large bay windows, and a sprawling terrace that overlooks meticulously manicured formal gardens.",
    "atmosphere": "A palpable tension hangs in the air, with the grandeur of the estate overshadowed by recent unsettling events.",
    "paragraphs": [
      "Nestled several miles from the quaint village of Little Middleton, Middleton Manor rises majestically from the rolling English countryside. The estate is encircled by a wrought-iron fence, its intricate designs glinting with a damp sheen from the intermittent rain. A long, winding driveway leads to the grand entrance, where gas lamps flicker against the grey sky, casting a warm glow on the wet flagstones. The gardens, once vibrant with blooms, now appear subdued, their colors muted by the oppressive clouds overhead, creating a somber atmosphere that hints at the secrets hidden within.",
      "As one steps inside, the air thickens with the scent of polished wood and freshly cut flowers, remnants of a once-celebrated garden party. Inside, the drawing room boasts high ceilings adorned with ornate plasterwork, while the plush carpets muffle footsteps, creating an eerie silence punctuated only by the distant ticking of a grand clock. The heavy draperies, drawn tight against the windows, block out the chill of the rain, rendering the space a cocoon of warmth yet stifling in its confinement. Shadows dance along the walls as the light from a single chandelier casts elongated shapes, adding to the sense of unease that lingers in the air.",
      "The estate's isolation from the outside world is palpable, with the nearest town offering little respite from the growing tension. Staff members move quietly through the house, their conversations hushed, as if speaking above a whisper might shatter the delicate facade of normalcy. The kitchen, filled with the smell of baking bread and simmering stew, contrasts sharply with the unease of the drawing room. Here, the household staff exchange worried glances, acutely aware of the gravity of the events unfolding around them. Outside, the lake reflects the brooding sky, its still waters hiding the tumultuous undercurrents of mystery that threaten to engulf the manor.",
      "As dusk descends, the atmosphere shifts, thickening with anticipation. The estate, now enveloped in shadow, takes on a sinister quality. The family members, gathered for dinner, converse in tense tones, their laughter strained and forced. The clinking of silverware against porcelain echoes through the halls, a reminder of the elegance that once characterized their lives. Outside, the rain falls steadily, creating a rhythmic backdrop that heightens the sense of urgency. The clock ticks louder, marking not only the passage of time but the encroaching darkness that threatens to unravel the very fabric of their lives."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "overcast with intermittent rain, typical for a British summer",
    "timeFlow": "The events unfold over a tense weekend, with each hour steeped in mounting suspense and uncertainty.",
    "mood": "tense and mysterious, heightened by recent events in Europe",
    "eraMarkers": [
      "An antique radio crackles softly in the background, broadcasting news of the world beyond the manor's walls.",
      "The household's early telephone, a rotary model, sits unused on the side table, a reminder of the isolation they face.",
      "Typewriters clatter in the study as the family secretary works diligently, the rhythmic tapping underscoring the tension in the air."
    ],
    "sensoryPalette": {
      "dominant": "The heavy scent of damp earth and polished wood fills the air, a reminder of the estate's grandeur and decay.",
      "secondary": [
        "The faint aroma of tobacco smoke wafts from the study, mingling with the floral notes from the drawing room.",
        "The distant sound of rain tapping against the windows creates a melancholic symphony that echoes throughout the manor."
      ]
    },
    "paragraphs": [
      "The atmosphere within Middleton Manor is thick with unspoken tension, the kind that seems to cling to the walls like the dampness from the rain outside. As the clock strikes each hour, it reverberates through the halls, a constant reminder of the time slipping away and the secrets that may soon be revealed. The air is heavy with anticipation, as if the very structure of the house is holding its breath, waiting for the next twist in the unfolding drama.",
      "Outside, the gardens, once a vibrant display of color, now appear muted and shadowy under the overcast sky. The delicate scent of wet grass and blooming flowers is tinged with the metallic smell of rain-soaked earth, creating an atmosphere that is both refreshing and oppressive. The sound of droplets falling from the eaves creates a rhythmic backdrop to the mounting tension, while the distant rumble of thunder hints at a storm brewing, mirroring the turmoil within the estate."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The drawing room is a large, elegantly appointed space, with dark wood paneling and plush furniture arranged around a grand fireplace. A large bay window overlooks the gardens, now hidden behind heavy drapes, while a grand piano stands in the corner, untouched and gathering dust.",
      "sensoryDetails": {
        "sights": [
          "The flickering light of a chandelier casts dancing shadows across the ornate wallpaper, highlighting the intricate patterns that adorn the room.",
          "A dark stain on the plush carpet near the fireplace hints at a recent disturbance, while a forgotten teacup rests precariously on the edge of a side table."
        ],
        "sounds": [
          "The soft crackle of the fireplace is the only sound that breaks the heavy silence, punctuated by the occasional drip of water from the window ledge.",
          "Outside, the persistent patter of rain creates a rhythmic backdrop, echoing the tension that fills the room."
        ],
        "smells": [
          "The rich scent of polished mahogany mingles with the faint aroma of tobacco smoke, remnants of a recent gathering that now feels like a distant memory.",
          "A hint of dampness lingers in the air, a reminder of the rain-soaked world outside."
        ],
        "tactile": [
          "The plush carpet feels soft and yielding underfoot, contrasting sharply with the cold, hard surface of the marble fireplace.",
          "As one brushes against the embroidered upholstery, the fabric feels both luxurious and slightly worn, a testament to years of gatherings and secrets shared."
        ]
      },
      "accessControl": "Access to the drawing room is restricted to family members and invited guests. Staff are only permitted during scheduled events, and the room is locked at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-streaked windows blur the view of the gardens, creating a melancholic atmosphere that envelops the room.",
            "The soft light of dawn filters through the heavy curtains, casting a muted glow over the dark wood furniture."
          ],
          "sounds": [
            "The steady drumming of rain against the window creates a soothing yet oppressive soundscape that fills the air.",
            "Occasional gusts of wind cause the branches outside to scrape against the glass, adding an eerie undertone."
          ],
          "smells": [
            "The damp earth permeates the air, mingling with the scent of wet wood and the faint aroma of fresh flowers from the garden.",
            "A lingering hint of mildew suggests that the room has not been properly aired out."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light fills the room, casting shadows without edges, creating an unsettling ambiance.",
            "The heavy drapes remain drawn, blocking out any hint of sunlight, adding to the oppressive atmosphere."
          ],
          "sounds": [
            "Silence reigns, broken only by the distant ticking of the grandfather clock, each tick echoing through the stillness.",
            "The creak of old timbers settling under the weight of the afternoon adds a layer of tension to the air."
          ],
          "smells": [
            "The smell of beeswax from the polished furniture mingles with the stale air, creating a heavy, cloying scent.",
            "Dust hangs in the air, thick enough to taste, a reminder of the secrets that linger in the corners."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the walls, catching on the brass fittings and casting long, dancing shadows across the floor.",
            "The rich colors of the wallpaper appear deeper in the warm glow, creating an inviting yet foreboding atmosphere."
          ],
          "sounds": [
            "The soft tick of a mantel clock fills the air, marking the passage of time as the evening stretches on.",
            "Distant voices from below stairs murmur, creating a backdrop of tension that underscores the gathering in the drawing room."
          ],
          "smells": [
            "The scent of melting candle wax mingles with the rich aroma of tobacco smoke, creating a comforting yet charged atmosphere.",
            "The faint smell of cold fireplace ash lingers in the air, a reminder of warmth that has long since faded."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room, once a place of lively conversation and laughter, now stands as a crime scene shrouded in mystery. The plush carpet, once vibrant, is marred by a dark stain that tells a silent story, while the flickering candlelight casts an unsettling glow over the room. The air is thick with tension, every shadow seeming to whisper secrets. As the clock ticks ominously on the mantelpiece, the atmosphere becomes charged, the weight of unspoken words hanging heavy in the air, demanding to be uncovered.",
        "With the rain outside creating a rhythmic backdrop, the drawing room feels like a world apart, isolated from the chaos of the outside. The muted colors and heavy drapes amplify the sense of confinement, while the lingering scent of tobacco smoke adds an air of sophistication that belies the tension within. Each detail, from the forgotten teacup to the dark stain on the carpet, beckons to be examined, hinting at the unraveling mystery that awaits."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is a grand room lined with floor-to-ceiling bookshelves filled with leather-bound volumes, their spines embossed with gilded titles. A large mahogany desk sits in the center, surrounded by plush armchairs, while a rolling ladder leans against the shelves, inviting exploration.",
      "sensoryDetails": {
        "sights": [
          "Sunlight filters through tall windows, illuminating dust motes that dance in the air, creating a serene yet haunting atmosphere.",
          "Rich mahogany furniture contrasts with the deep green of the wallpaper, creating a cozy yet imposing environment."
        ],
        "sounds": [
          "The soft rustle of pages turning fills the air, mingling with the distant sound of rain tapping against the windows.",
          "The creak of the ladder as it slides across the shelves adds an element of anticipation, echoing softly in the stillness."
        ],
        "smells": [
          "The musty scent of old books hangs in the air, mingling with the fresh aroma of polished wood and a hint of leather.",
          "A faint trace of tobacco smoke lingers from the previous occupant, adding a layer of intrigue to the space."
        ],
        "tactile": [
          "The smooth, cool surface of the desk invites touch, while the worn leather of the armchairs provides a sense of comfort amidst the looming mystery.",
          "As fingers brush against the spines of the books, the texture of the embossed titles feels both familiar and inviting, yet tinged with the weight of history."
        ]
      },
      "accessControl": "The library is accessible to family members and select guests, while staff require permission from the estate manager to enter. The doors are locked at night to protect the valuable collection.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Dampness clings to the windows, blurring the view outside, while the soft light creates a moody ambiance within.",
            "Books appear more vibrant in the diffused light, their colors deepened by the overcast sky."
          ],
          "sounds": [
            "The rhythmic patter of rain against the window creates a soothing background, mingling with the soft rustle of pages turning.",
            "Occasional thunder rumbles in the distance, adding a sense of urgency to the quiet atmosphere."
          ],
          "smells": [
            "The heavy scent of wet paper and damp wood fills the air, creating a rich, earthy aroma that is both comforting and foreboding.",
            "A trace of mildew hints at neglected corners, suggesting that secrets may be hidden among the shelves."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat, grey light fills the room, casting muted shadows that give the library an air of somber reflection.",
            "The deep green wallpaper absorbs the light, enhancing the sense of isolation in the vast space."
          ],
          "sounds": [
            "Silence reigns, broken only by the occasional creak of the building settling, a reminder of the library's age and history.",
            "The soft sound of a book sliding from the shelf echoes in the stillness, a reminder of the mysteries yet to be uncovered."
          ],
          "smells": [
            "The musty scent of old books hangs heavily in the air, mingling with the aroma of polished wood, creating a comforting yet suffocating atmosphere.",
            "Hints of dust dance in the air, creating a texture that is both tangible and invisible, adding to the library's enigmatic charm."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers on the desk, illuminating the pages of an open book, casting long shadows that stretch across the room.",
            "The warm glow creates a stark contrast against the cool darkness outside, heightening the sense of intimacy and secrecy."
          ],
          "sounds": [
            "The crackle of a nearby fire adds warmth to the atmosphere, creating a cozy sound that belies the tension in the air.",
            "Distant voices from the drawing room murmur softly, their tones barely audible, a reminder of the life outside this sanctuary of knowledge."
          ],
          "smells": [
            "The rich aroma of burning wood mingles with the scent of old paper, creating a comforting yet charged atmosphere.",
            "A hint of leather from the book bindings evokes a sense of nostalgia, reminding one of the stories held within."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary of knowledge and secrets, stands as a testament to the family's lineage and their hidden truths. Shelves brimming with leather-bound tomes line the walls, each book a silent witness to the events that have transpired within these walls. The air is thick with the scent of aged paper and polished wood, creating a comforting yet stifling atmosphere. As one runs their fingers along the spines of the books, the weight of history is palpable, hinting at the mysteries that may lie within their pages.",
        "In the quiet of the library, the outside world fades away, leaving only the soft rustle of pages turning and the distant sound of rain. The large mahogany desk sits invitingly in the center, surrounded by plush armchairs that offer a sense of warmth amidst the looming shadows. Here, in this space filled with stories and knowledge, the truth awaits discovery, beckoning those willing to delve into the depths of the estate's past."
      ]
    },
    {
      "id": "stable",
      "name": "The Stable",
      "type": "exterior",
      "purpose": "Gathering space",
      "visualDetails": "The stable is a charming, weathered building, with timber beams and a slate roof, surrounded by a cobblestone courtyard. Horses are kept in spacious stalls, and the smell of hay and leather permeates the air, creating a rustic yet inviting atmosphere.",
      "sensoryDetails": {
        "sights": [
          "Sunlight dapples through the trees, casting playful shadows across the cobblestone courtyard, where horses graze lazily.",
          "The stable doors, painted a faded green, swing open to reveal well-kept stalls, each adorned with the names of the horses etched into wooden plaques."
        ],
        "sounds": [
          "The soft whinny of horses and the rustle of hay create a soothing soundtrack, punctuated by the occasional clatter of hooves on cobblestones.",
          "Distant birds chirp cheerfully, their songs mingling with the sounds of the stable, creating a harmonious atmosphere."
        ],
        "smells": [
          "The rich scent of fresh hay mingles with the earthy aroma of horse manure, creating a distinctly rural fragrance that evokes nostalgia.",
          "Hints of leather from saddles and harnesses hang in the air, adding to the rustic charm of the stable."
        ],
        "tactile": [
          "The rough texture of the cobblestones contrasts with the soft feel of hay underfoot, creating a sensory experience that is both grounding and inviting.",
          "As one strokes the horses' coats, the warmth of their bodies and the smoothness of their fur provide a comforting connection to the animals."
        ]
      },
      "accessControl": "The stable is accessible to family members, staff responsible for the horses, and guests with prior permission. It is locked at night to ensure the safety of the animals.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops bead on the stable roof, creating a rhythmic patter as they fall, while the courtyard glistens with moisture.",
            "The horses stand under cover, their coats shiny and damp, creating a picturesque scene against the grey backdrop."
          ],
          "sounds": [
            "The sound of rain hitting the cobblestones creates a gentle drumming that calms the atmosphere inside the stable.",
            "Occasional snorts and whinnies from the horses mix with the soft patter of rain, creating a symphony of nature."
          ],
          "smells": [
            "The fresh scent of rain-soaked hay fills the air, mingling with the earthy aroma of the stable, creating a refreshing yet heavy scent.",
            "A hint of dampness lingers, suggesting that the stable may need airing out after the rain."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The stable appears more subdued under the flat, grey sky, its colors muted and shadows deepened.",
            "Horses stand quietly in their stalls, their breathing steady as they await the return of their handlers."
          ],
          "sounds": [
            "The soft rustle of hay being moved fills the air, creating a gentle background noise that contrasts with the stillness outside.",
            "The distant sound of thunder rumbles, adding a sense of foreboding to the atmosphere."
          ],
          "smells": [
            "The familiar scent of hay and leather is thick in the air, creating a comforting yet heavy aroma that envelops the space.",
            "Hints of sweat from the horses mingle with the earthy smells, creating a rich tapestry of scents that evoke the stable's rustic charm."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The setting sun casts a warm glow over the stable, illuminating the horses' coats and creating a picturesque scene.",
            "Shadows stretch long across the courtyard as the last light of day fades, adding a sense of calm and tranquility."
          ],
          "sounds": [
            "The quiet sounds of the horses munching hay create a peaceful atmosphere, punctuated by the occasional whinny as they interact.",
            "The soft rustle of leaves in the evening breeze adds a gentle melody to the serene setting."
          ],
          "smells": [
            "The sweet scent of hay fills the air, mingling with the fresh aroma of the evening, creating a comforting atmosphere.",
            "Hints of leather and earthiness linger, reminding one of the connection to the animals that reside within."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The stable, a rustic haven for the estate's horses, stands proudly at the edge of the property, surrounded by a cobblestone courtyard. Timber beams and a slate roof give it a charming, weathered appearance, while the sound of gentle whinnies and rustling hay fills the air. As one steps inside, the rich scent of fresh hay and leather envelops the senses, creating a comforting yet lively atmosphere. The stalls, each marked with the names of the horses, are filled with warmth and life, a stark contrast to the tension brewing within the manor.",
        "During the evening, as the sun sets and shadows stretch across the courtyard, the stable takes on a serene quality. Horses graze lazily, their coats shimmering in the fading light, while the air is filled with the sweet scent of hay and the earthy aroma of the stable. This tranquil space, however, holds its own secrets, as whispers of conversations and the occasional rustle of movement hint at the tension that lingers just beyond its doors."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028772155499999998,
  "durationMs": 43913
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1933,
    "month": "July",
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "July",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "cool breezes"
    ],
    "daylight": "Long, cloudy days with occasional bright spells, sunset around nine o'clock at night.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the house has fallen into a tense silence.",
    "holidays": [
      "The British Empire Exhibition (ongoing at Wembley)"
    ],
    "seasonalActivities": [
      "garden parties",
      "picnics in the park",
      "attending outdoor theater performances"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece suit in light grey",
        "white linen waistcoat",
        "bow tie"
      ],
      "casual": [
        "tweed jacket",
        "light cotton trousers",
        "casual loafers"
      ],
      "accessories": [
        "flat cap",
        "pocket watch",
        "dress cane"
      ]
    },
    "womensWear": {
      "formal": [
        "sleeveless evening gown in pastel colors",
        "long pearl necklace",
        "clutch purse"
      ],
      "casual": [
        "tea dress with floral patterns",
        "light cardigan",
        "straw hat"
      ],
      "accessories": [
        "silk gloves",
        "parasol",
        "brooch"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "lightweight fabrics for summer wear",
      "emphasis on elegance and simplicity"
    ],
    "socialExpectations": [
      "social status dictated by wealth",
      "women expected to dress modestly yet stylishly",
      "men to exhibit gallantry and decorum in public"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "increasing tensions in Europe due to the rise of fascism",
      "British economy struggling with high unemployment",
      "debates on the effectiveness of the New Deal in America"
    ],
    "politicalClimate": "The political landscape is unstable, with rising extremism and social unrest affecting public sentiment and class relations.",
    "economicConditions": "The Great Depression is creating a chasm between the affluent and working classes, leading to growing discontent among the populace.",
    "socialIssues": [
      "class disparity and tensions",
      "women's rights movements gaining traction",
      "anti-fascist sentiments increasing across Europe"
    ],
    "internationalNews": [
      "Hitler's consolidation of power in Germany",
      "Italy's alignment with fascist regimes",
      "growing concerns over potential military conflicts"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'We're in the Money' by Ginger Rogers",
        "'Night and Day' by Cole Porter",
        "Bing Crosby's crooning melodies"
      ],
      "films": [
        "'King Kong'",
        "'The Invisible Man'",
        "the latest Charlie Chaplin film"
      ],
      "theater": [
        "'The Royal Family'",
        "'The Front Page'",
        "Shakespeare's plays in outdoor venues"
      ],
      "radio": [
        "The BBC News Hour",
        "variety shows featuring popular musicians",
        "drama series capturing contemporary issues"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Brave New World' by Aldous Huxley",
        "'The Glass Key' by Dashiell Hammett",
        "'Murder in the Cathedral' by T.S. Eliot"
      ],
      "popularGenres": [
        "mystery",
        "social commentary",
        "science fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "early television sets",
        "improvements in radio technology",
        "advancements in home telephones"
      ],
      "commonDevices": [
        "typewriters in offices",
        "wireless radios in homes",
        "rotary dial telephones"
      ],
      "emergingTrends": [
        "increased use of forensic methods in criminal investigations",
        "home inventions for convenience",
        "growing interest in modernist designs"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "afternoon tea with friends",
        "visiting art galleries",
        "dancing at local halls"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "attending church services",
        "participating in community gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased resentment toward the wealthy",
      "social mobility still limited",
      "class distinctions evident in social events"
    ],
    "gender": [
      "traditional roles still prevalent",
      "women beginning to assert independence",
      "expectation for women to find suitable marriages"
    ],
    "race": [
      "prejudice remains strong in many areas",
      "emerging awareness of racial equality issues",
      "rising anti-Semitism in Europe"
    ],
    "generalNorms": [
      "courtesy and decorum expected in social settings",
      "importance placed on appearances",
      "growing acceptance of modern ideas, albeit slowly"
    ]
  },
  "atmosphericDetails": [
    "The heavy scent of damp earth mingles with the sweetness of blooming roses, their colors muted by the overcast sky.",
    "The distant sound of rain pattering against the windows creates an eerie stillness, heightening the tension within the grand estate.",
    "Occasional flashes of lightning illuminate the darkened hallways, casting ominous shadows that seem to breathe life into the house's secrets."
  ],
  "paragraphs": [
    "In July 1933, the British summer is marked by cool temperatures and frequent rain, shrouding the countryside in a mist of tension and uncertainty. The estate, often bustling with activity, now feels eerily quiet as the clouds loom overhead. The gardens, vibrant yet drenched, play host to the occasional garden party, albeit under the threat of a sudden downpour, revealing the precarious balance of social life in this volatile time. With Europe teetering on the edge of political chaos, the atmosphere is thick with unease, as guests whisper of the shifting tides of power and looming war.",
    "Fashion reflects the era's blend of elegance and practicality, with men donning light grey three-piece suits, complemented by crisp white linen waistcoats and bow ties for evening events. Women, too, adopt the trends of the moment, favoring sleeveless gowns in pastel hues for formal occasions, while their casual attire consists of tea dresses adorned with floral patterns. The social expectations dictate a modest yet stylish presentation; women accessorize with silk gloves and parasols, while men carry their flat caps and pocket watches with a sense of pride. Each detail is a reflection of their status, as class distinctions remain painfully evident.",
    "Daily life in July 1933 is shaped by the harsh realities of the Great Depression, with a loaf of bread costing four pence and cinema tickets priced at one shilling. Families gather for Sunday dinners, sharing stories of their dwindling fortunes, while community gatherings provide a respite from their struggles. The emergence of women's rights movements is slowly altering societal views, yet traditional roles persist. Amidst it all, the radio crackles with the voices of entertainers and news broadcasters, offering a glimpse into a world beyond their own, as the tension of the age hangs palpably in the air, ready to explode at any moment."
  ],
  "note": "",
  "cost": 0.0010566171,
  "durationMs": 13102
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the estate for a family reunion amidst the economic turmoil of the Great Depression strains relationships and unveils hidden resentments among the wealthy and their staff.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The wealthy face increasing scrutiny and tension from the working class, while political unrest in Europe heightens anxieties about loyalty and privilege."
  },
  "setting": {
    "location": "A large, stately manor house set within expansive grounds, featuring formal gardens, a stable, and a small lake.",
    "institution": "country house estate",
    "weather": "overcast with intermittent rain, typical for a British summer"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "Golden Age country-house murder driven by a mechanical clock-tampering method."
}

### LOCKED_FACTS
[
  {
    "id": "clock_reading",
    "value": "ten minutes past eleven",
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "tamper_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time of the murder is indicated.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "A note indicating the time of murder was found at the scene.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "The time of murder is documented.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The time on the clock cannot be trusted due to tampering.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Indicates possible manipulation of time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The clock's winding key was discovered in Dr. Mallory Finch's possession.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "Links Dr. Mallory Finch to the tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Dr. Mallory Finch had the means to tamper with the clock.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Establishes motive and opportunity.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she was seen at the café at the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "Eleanor Voss has a corroborated alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The note conflicts with the clock's reading, suggesting tampering.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Indicates a discrepancy in the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock was wound back to fabricate an alibi for Dr. Mallory Finch.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Reveals the method of tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "physical",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "behavioral",
      "description": "Dr. Mallory Finch exhibited nervous behavior when questioned about the clock.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[1]",
      "pointsTo": "Suggests guilt or knowledge of wrongdoing.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was on duty at the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale has a corroborated alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Last witness sighting at quarter past ten remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Witnesses reported hearing a loud argument from the victim's office just after the last sighting.",
      "supportsAssumption": "The murder must have occurred after the last known sighting of the victim.",
      "misdirection": "This suggests the murder happened later than it did, misleading the investigation."
    },
    {
      "id": "rh_2",
      "description": "A broken window was found in the study, leading some to believe an intruder was responsible.",
      "supportsAssumption": "The murder must have occurred after the last known sighting of the victim.",
      "misdirection": "This could imply an outside party was involved, diverting attention from the true culprit."
    }
  ],
  "status": "fail",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_1",
      "clue_2"
    ],
    "mid": [
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_core_elimination_chain",
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_6",
      "clue_7"
    ],
    "late": [
      "clue_late_optional_slot_1"
    ]
  },
  "fairPlayChecks": {
    "allEssentialCluesPresent": true,
    "noNewFactsIntroduced": true,
    "redHerringsDontBreakLogic": true
  },
  "latencyMs": 17718,
  "cost": 0.004490166449999999
}

---

## OUTPUT INSTRUCTIONS

Produce a single JSON object with ALL of the following fields.

Return the JSON object directly — no preamble, no markdown fences, no commentary.

MANDATORY FIELD LENGTHS:
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- storyEmotionalArc.arcDescription: MINIMUM 300 words, target 350 words. This is an emotional map
  of the full story journey — not a one-paragraph summary. It must trace the emotional register from
  opening chapter through rising tension to climax and resolution. Multiple paragraphs expected.
  A response shorter than 300 words will fail the quality gate. Count your words.
- revealImplications: MINIMUM 90 words. Three earlier scenes, each revisited with one full sentence
  of analysis. Aim for 120 words.
- storyTheme: MINIMUM 25 words. Write a complete sentence with a subject, main clause, and a nuanced
  qualifier about the story's deeper meaning. Not a title, a noun phrase, or a fragment.
  A storyTheme shorter than 25 words will fail the quality gate.
- SELF-CHECK CONTRACT (INTERNAL): before returning JSON, verify the minimum lengths and required scene-position coverage are already satisfied on this first pass.

Required structure:
{
  "status": "final",
  "storyTheme": "<one sentence — story's deeper meaning, not a plot summary>",
  "historicalMoment": {
    "specificDate": "<year and month from TEMPORAL_CONTEXT exactly>",
    "eraRegister": "<200-300 words: what is it like to live through this specific moment>",
    "currentTensions": ["<3-5 concrete current-event pressures at this date>"],
    "physicalConstraints": ["<3-6 era-specific physical constraints on movement and communication>"],
    "emotionalRegister": "<one sentence: dominant collective emotional state at this date>",
    "wartimeServiceContext": { "serviceStatus": "...", "socialTexture": "...", "absenceEffect": "..." }
  },
  "characterPortraits": [
    {
      "name": "<exact name from CASE.cast>",
      "portrait": "<80-120 words: this character's relationship to the historical moment>",
      "eraIntersection": "<one sentence: how their private situation intersects with the historical moment>"
    }
  ],
  "characterVoiceSketches": [
    {
      "name": "<exact name from CASE.cast>",
      "voiceDescription": "<one sentence: how this character sounds and speaks — functional, no labels>",
      "fragments": [
        { "register": "comfortable", "text": "<2-4 lines of actual speech, no attribution>" },
        { "register": "evasive", "text": "<2-4 lines of actual speech>" },
        { "register": "stressed", "text": "<2-4 lines of actual speech>" }
      ],
      "humourNote": "<one sentence — include only if humourLevel > 0 in profiles>"
    }
  ],
  "locationRegisters": [
    {
      "locationId": "<must match a keyLocation id from LOCATION_PROFILES>",
      "name": "<location name>",
      "emotionalRegister": "<60-100 words: what it feels like to be here in this story>",
      "eraNote": "<one sentence: era-specific constraint on this location — optional>",
      "cameraAngle": "<one sentence: emotional stance for a writer entering this space>"
    }
  ],
  "storyEmotionalArc": {
    "dominantRegister": "<one sentence: story's overall emotional character>",
    "arcDescription": "<300-400 words: emotional map of the journey, not a plot summary>",
    "turningPoints": [
      { "position": "opening", "emotionalDescription": "<one sentence>" },
      { "position": "early", "emotionalDescription": "<one sentence>" },
      { "position": "first_turn", "emotionalDescription": "<one sentence>" },
      { "position": "mid", "emotionalDescription": "<one sentence>" },
      { "position": "second_turn", "emotionalDescription": "<one sentence>" },
      { "position": "pre_climax", "emotionalDescription": "<one sentence>" },
      { "position": "climax", "emotionalDescription": "<one sentence>" },
      { "position": "resolution", "emotionalDescription": "<one sentence>" }
    ],
    "endingNote": "<one sentence: what emotional register does the ending carry>"
  },
  "humourPlacementMap": [
    { "scenePosition": "opening_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "first_investigation",  "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "body_discovery",       "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "first_interview",      "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "domestic_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "mid_investigation",    "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "second_interview",     "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "tension_scene",        "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "pre_climax",           "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "discriminating_test",  "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "revelation",           "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "resolution",           "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" }
  ],
  "breakMoment": {
    "character": "<non-culprit, non-detective cast member>",
    "scenePosition": "<one of the 12 humour positions — best at tension_scene or pre_climax>",
    "form": "<specific: how loss of control manifests>",
    "narrativeFunction": "<one sentence: why this moment matters>"
  },
  "revealImplications": "<90-150 words: 2-3 earlier story moments the final revelation will retroactively recolour>",
  "validationConfirmations": {
    "noNewCharacterFacts": true,
    "noNewPlotFacts": true,
    "castComplete": true,
    "eraSpecific": true,
    "lockedFactsPreserved": true,
    "humourMapComplete": true
  }
}

IMPORTANT RULES for humourPlacementMap:
- "body_discovery", "discriminating_test", "revelation": ALWAYS "forbidden". No exceptions.
- "tension_scene", "pre_climax": "forbidden" unless a character has humourLevel > 0.7 AND no direct threat/violence. Then "conditional" with explicit condition.
- Characters with humourLevel < 0.3 must NOT appear in permittedCharacters.
- The detective may appear in permittedCharacters only for "domestic_scene" and "resolution", and only with "understatement" or "dry_wit".
- All 12 scene positions must be present in humourPlacementMap.

IMPORTANT: characterPortraits and characterVoiceSketches must each have exactly one entry per cast member in CASE.cast, in the same order.
```
