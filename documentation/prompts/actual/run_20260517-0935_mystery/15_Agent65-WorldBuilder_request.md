# Actual Prompt Record

- Run ID: `mystery-1779010504524`
- Project ID: ``
- Timestamp: `2026-05-17T09:38:01.656Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `8c8f6414c68d03a2`

## Message 1 (role=system)

```text
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
  - storyEmotionalArc.arcDescription is your most important output field. Budget your tokens
    for it before writing shorter fields. It MUST be at least 300 words written across multiple
    clearly distinct paragraphs — not a dense single block. Trace the full emotional journey:
    opening atmosphere → rising unease → first investigative turn → mid-story revelation →
    second pivot → pre-climax pressure → climax → resolution. A response shorter than 300 words
    will fail validation. Count your words before finalising this field.
  - JSON arrays must contain ONLY objects of the specified type. Never add strings, notes,
    comments, or placeholder text inside characterPortraits, characterVoiceSketches,
    locationRegisters, humourPlacementMap, or any other array field.
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
    "title": "The Clock of Lies",
    "author": "ChatGPT",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "aristocratic intrigue"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "early 30s",
      "role_archetype": "detective",
      "relationships": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "public_persona": "Intelligent and observant",
      "private_secret": "Haunted by past failures in investigations",
      "motive_seed": "Desire for redemption",
      "motive_strength": "strong",
      "alibi_window": "None during the incident",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all areas of the estate"
      ],
      "behavioral_tells": [
        "Calm demeanor under pressure"
      ],
      "stakes": "Prove her detective skills",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "late 40s",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Financial troubles due to the Depression",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "10:45 - 11:15 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Cared for the victim's health"
      ],
      "behavioral_tells": [
        "Nervous when discussing the murder"
      ],
      "stakes": "Maintain reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "mid 50s",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Beatrice Quill"
      ],
      "public_persona": "Charming war veteran",
      "private_secret": "Involved in smuggling during the Depression",
      "motive_seed": "Fear of exposure",
      "motive_strength": "strong",
      "alibi_window": "10:30 - 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Frequent visits to the victim"
      ],
      "behavioral_tells": [
        "Too friendly with the victim"
      ],
      "stakes": "Avoid arrest",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "late 20s",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "public_persona": "The victim's devoted assistant",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "10:30 - 11:15 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Served the victim dinner"
      ],
      "behavioral_tells": [
        "Avoids eye contact when questioned"
      ],
      "stakes": "Protect her love",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Eleanor Voss"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a stormy evening at a country estate, a wealthy aristocrat is found dead, and all indications point towards a carefully orchestrated murder involving tampered clocks and hidden motives."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock was wound back to frame the time of the murder.",
      "delivery_path": [
        {
          "step": "The clock was adjusted to show an earlier time than the actual murder."
        }
      ]
    },
    "outcome": {
      "result": "The culprit created a false timeline to evade suspicion."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred when the clock showed ten minutes past eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock's position and the victim's routine suggest a timeline.",
    "what_it_hides": "The clock was tampered with to mislead investigators."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Victim's last known movements",
        "Clock's position"
      ],
      "windows": [
        "10:30 PM to 11:15 PM"
      ],
      "contradictions": [
        "Witness hears the clock chime at an odd hour",
        "The clock shows ten minutes past eleven but was heard chiming at a different time."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "Clock",
        "Victim's diary",
        "Dining room"
      ],
      "permissions": [
        "Free access to the estate for all suspects"
      ]
    },
    "physical": {
      "laws": [
        "Principles of mechanical clocks"
      ],
      "traces": [
        "Dust on the clock indicating recent tampering",
        "Footprints leading to the clock"
      ]
    },
    "social": {
      "trust_channels": [
        "Public persona of the suspects",
        "Aristocratic friendships"
      ],
      "authority_sources": [
        "Victim's established relationships"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the entrance hall shows ten minutes past eleven.",
        "correction": "The clock's time cannot be trusted as it may have been tampered with.",
        "effect": "Narrows investigation to the clock's mechanism.",
        "required_evidence": [
          "Witness states the clock chimed at an odd hour",
          "Footprints in the dust leading to the clock"
        ],
        "reader_observable": true
      },
      {
        "observation": "The victim's diary shows scheduled appointments at 10:30 PM.",
        "correction": "The victim was due to meet someone before the time shown on the clock.",
        "effect": "Eliminates the possibility that the murder occurred at the clock's indicated time.",
        "required_evidence": [
          "Victim's diary entry for the meeting",
          "Witnesses confirm the victim was alive before the clock's time"
        ],
        "reader_observable": true
      },
      {
        "observation": "A heavy candlestick was found near the clock.",
        "correction": "The candlestick could have been used to tamper with the clock mechanism.",
        "effect": "Narrows suspicion towards those who had access to the clock.",
        "required_evidence": [
          "The candlestick shows signs of being recently moved",
          "No fingerprints on the clock face"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Re-enact the timing of the murder while observing the clock's chime.",
    "knowledge_revealed": "The clock does not chime at the expected time, indicating tampering.",
    "pass_condition": "If the clock chimes at an unexpected hour, the tampering is confirmed.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_5",
      "clue_7"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's odd chime timing (early) and dust footprints (mid) show it was tampered with. Step 2: The victim's diary entry (mid) reveals the murder's timeline contradicts the clock. Step 3: The heavy candlestick near the clock hints at tampering, confirmed in the test."
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
        "Observe the clock's chime",
        "Draw conclusion about tampering"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi through diary",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Footprints contradict his presence",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 10:30 - 11:15 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with the tampered clock evidence"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_eleanor_voss",
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
    "summary": "A local historian with a penchant for unearthing the past, Eleanor Voss is determined to uncover the truth behind a murder that threatens her reputation.",
    "publicPersona": "Eleanor is a well-respected member of Little Middleton, known for her extensive knowledge of local history. With her meticulous attention to detail and unwavering dedication, she often leads the local history society’s meetings, captivating the community with tales from yesteryear.",
    "privateSecret": "Beneath her polished exterior lies a scandalous affair with a member of the gentry that she has buried deep within her past, fearing that revelation would shatter the trust she has built.",
    "motiveSeed": "Eleanor is driven by a need to vindicate her past mistakes, believing that solving this murder could restore her standing in the eyes of her peers and herself.",
    "motiveStrength": "strong",
    "alibiWindow": "From seven until nine, Eleanor was attending a local history society meeting, a gathering that could provide her a shield against suspicion.",
    "accessPlausibility": "easy",
    "stakes": "The stakes are high; Eleanor’s reputation and the trust of the community hang in the balance as she seeks to prove her worth and face her past.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her sentences with historical anecdotes. Her wit emerges subtly, often cloaked in a veneer of propriety.",
    "internalConflict": "Eleanor grapples with guilt over her past indiscretions, fearing that her history might resurface to haunt her just as she strives for redemption.",
    "personalStakeInCase": "This crime matters to Eleanor because it presents a chance to reclaim her tarnished reputation and confront the ghosts of her past.",
    "paragraphs": [
      "Eleanor Voss stood at the helm of the local history society, her fingers tracing the delicate spine of a dusty tome. The air was thick with the scent of old parchment, and the gathered members hung on her every word, their eyes alight with curiosity. Yet, behind her calm demeanor lay a storm of anxiety. The recent murder in Little Middleton had stirred not only the community but also the shadows of her own past. Could the truth about the victim unravel her carefully woven tapestry of respectability?",
      "As she left the society meeting, Eleanor’s thoughts drifted to the gentry she had once entangled herself with. The affair had been a reckless folly, a spark of passion that had ignited her otherwise staid life. Now, it loomed like a specter, threatening to rise from the depths of her memory. What if the investigation uncovered her secret? Would the community still look upon her with admiration, or would they cast her aside as a fallen woman?",
      "Determined to prove her worth, Eleanor plunged into the investigation with fervor. She meticulously gathered clues, piecing together the fragments of the victim’s life. Each revelation felt like a personal triumph, yet the deeper she delved, the more her internal conflict festered. The guilt of her past weighed heavily on her heart, and the fear that it would resurface haunted her every step. Would she be able to solve the murder before the truth of her own history came to light?",
      "With each interaction, Eleanor maintained her composure, employing her dry wit to navigate the treacherous waters of suspicion. Her knowledge of local lore became her shield; she wielded it deftly, hoping to deflect attention from her own secrets. But as the investigation progressed, the stakes escalated. The truth, once a distant curiosity, now felt like a ticking clock, counting down to the moment when everything would unravel. Eleanor knew she had to confront her past, not only for her own redemption but for the sake of the community that had once embraced her."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "An ambitious physician entangled in unethical practices, Dr. Mallory Finch navigates the treacherous waters of high society while fearing exposure.",
    "publicPersona": "Dr. Finch is portrayed as a dedicated and ambitious doctor, striving to establish himself among the elite of Little Middleton, where his charm and intellect often win him admirers.",
    "privateSecret": "Behind the charming facade, he engages in unethical medical practices, risking everything for fame and fortune, a secret he guards fiercely.",
    "motiveSeed": "His primary fear lies in the potential exposure of his practices if the victim, a former patient, reveals his dark secrets.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claimed to be in his study, ostensibly working on patient records from eight until ten, a claim that could be easily scrutinized.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Dr. Finch are high; his career and social status depend on maintaining the illusion he has crafted, and any crack in that facade could lead to his downfall.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a polished eloquence, often laced with a sardonic undertone. He has a habit of peppering his conversations with medical jargon, which he sometimes uses to elevate his status.",
    "internalConflict": "Mallory wrestles with a profound conflict between his ambition and his ethics, fearing that his reckless choices will lead to his ultimate ruin.",
    "personalStakeInCase": "This crime matters to Mallory because exposure could dismantle his carefully curated life, forcing him to confront the consequences of his actions.",
    "paragraphs": [
      "Dr. Mallory Finch stood in his study, the dim light casting shadows across the stacks of patient records that lay strewn about. He had always prided himself on his ambition, but tonight, a sense of dread gnawed at him. The recent murder of a former patient had sent ripples through the community, and he couldn’t shake the feeling that the tide might soon turn against him. The secrets he harbored were a double-edged sword; they fueled his rise but threatened to cut him down if revealed.",
      "With a sardonic twist of his lips, Mallory considered the irony of his situation. Here he was, a man who had clawed his way into the upper echelons of society, now trapped in a web of deceit of his own making. He recalled the patient who had threatened to disclose his unethical practices. The very thought sent a chill down his spine. If the truth emerged, it would not only ruin his career but also expose him to the scorn of the very society he had sought to impress.",
      "As whispers of the investigation swirled around him, Mallory maintained his charming persona, deftly navigating conversations with the local elite. He employed a veneer of confidence, often masking his anxiety with sardonic jests. Yet, behind closed doors, he felt the walls closing in. Each laugh and smile felt like a mask slipping, revealing the chaos beneath. He was a man on the edge, balancing precariously between the life he desired and the truth that threatened to consume him.",
      "The stakes grew higher with each passing day. The investigation was relentless, and as he observed the detectives piecing together the clues, he felt a mix of admiration and trepidation. Could they uncover his secrets? Could they connect the dots and expose his misdeeds? The clock was ticking, and Mallory knew he had to find a way to protect his reputation while confronting the moral decay that had taken root in his soul. The question loomed: would he rise above the darkness or be swallowed by it?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired military officer grappling with his past, Captain Ivor Hale navigates the complexities of a murder investigation while battling his inner demons.",
    "publicPersona": "Captain Hale is a figure of respect, known for his war stories and the wisdom that comes from a life steeped in military service.",
    "privateSecret": "Beneath his stoic exterior lies a man haunted by PTSD, struggling with violent tendencies that threaten to unravel his carefully maintained composure.",
    "motiveSeed": "He harbors resentment towards the victim, who once publicly humiliated him, a wound that has festered over time.",
    "motiveStrength": "moderate",
    "alibiWindow": "He was taking a long evening walk in the gardens from seven to nine, a claim that offers little proof of his whereabouts.",
    "accessPlausibility": "unlikely",
    "stakes": "Captain Hale's mental health and stability hang in the balance, as the truth about his past and present threatens to surface.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks in a measured tone, often punctuating his stories with self-deprecating remarks. His sentences are deliberate, reflecting the discipline of a military man.",
    "internalConflict": "Ivor struggles with the ghosts of his past, battling feelings of inadequacy and rage that threaten his sense of self.",
    "personalStakeInCase": "This crime matters deeply to Ivor as it could expose the fragility of his mental state, forcing him to confront the demons he has long suppressed.",
    "paragraphs": [
      "Captain Ivor Hale paced the gardens of his estate, the moonlight casting long shadows that mirrored the tumult within. Once a man of stature and respect, he now felt like a ghost of his former self. The recent murder had stirred memories he wished to forget, memories of a humiliation inflicted by the very victim whose life had been snuffed out. Ivor often recounted his war stories with a self-deprecating chuckle, but beneath the humor lay a raw wound that had never healed.",
      "As he walked, Ivor grappled with the conflicting emotions that surged within him. The world had moved on, yet he remained tethered to the battlefield of his mind, where echoes of past trauma haunted him. The victim’s taunts still rang in his ears, a cruel reminder of his perceived failures. He had buried his anger deep, but now it threatened to resurface, and the murder investigation felt like a catalyst for a reckoning he was not prepared to face.",
      "In public, Ivor maintained the facade of a dignified veteran, regaling those around him with tales of valor and bravery. Yet, in the solitude of his thoughts, he felt the weight of his vulnerability. His self-deprecating humor served as a shield, deflecting the probing questions of those who sought to understand him. But as the investigation progressed, he could sense the scrutiny intensifying, and the fear of exposure loomed large. What if the truth about his mental state came to light? Would the community still respect him, or would they cast him aside as a broken man?",
      "The stakes had never been higher. Ivor knew that confronting his past was the only way forward, yet the path was fraught with peril. The murder investigation was an unwelcome reminder of the fragility of his existence. As he wandered through the gardens, lost in thought, he realized that the resolution of this case could either lead him to healing or plunge him deeper into despair. The clock was ticking, and Ivor was running out of time to find his place in a world that had long since moved on."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A charming socialite with a manipulative edge, Beatrice Quill navigates the world of high society while concealing her desperate financial situation.",
    "publicPersona": "Beatrice is the epitome of a charming socialite, known for hosting extravagant parties and captivating the attention of the elite.",
    "privateSecret": "Behind her glamorous facade lies a woman drowning in debt due to gambling, desperately seeking a wealthy marriage to secure her future.",
    "motiveSeed": "The death of the victim stands to benefit her significantly, freeing her from the shackles of financial burdens that threaten her lifestyle.",
    "motiveStrength": "strong",
    "alibiWindow": "She was seen mingling with guests in the ballroom from eight to ten, a scene that could easily be fabricated.",
    "accessPlausibility": "easy",
    "stakes": "Her future and financial security depend on maintaining her social standing, making the stakes incredibly high.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with an engaging, melodic tone, often using flattery and charm to disarm others. Her humor is sharp, often wrapped in a veneer of politeness.",
    "internalConflict": "Beatrice struggles with the duality of her public persona and her private reality, torn between her desires and the lengths she is willing to go to achieve them.",
    "personalStakeInCase": "This crime matters to Beatrice because it could provide her with the financial freedom she so desperately seeks, allowing her to escape her current predicament.",
    "paragraphs": [
      "Beatrice Quill glided through the ballroom, a vision of elegance and charm, her laughter ringing out like music amidst the clinking of glasses. To the untrained eye, she was the quintessential socialite, effortlessly captivating her audience with tales of grandeur and wit. Yet, behind the sparkling facade, a tumultuous reality lurked. Drowning in debt from her reckless gambling habits, Beatrice had become a master of deception, her smile concealing a desperation that threatened to unravel her world.",
      "As she mingled with the guests, Beatrice’s mind raced with thoughts of the recent murder that had cast a shadow over her social circle. The victim’s death could change everything for her, liberating her from the financial shackles that bound her to a life of pretense. She had long dreamt of marrying into wealth, a goal that now felt tantalizingly close yet perilously out of reach. The stakes had never been higher, and she felt the pressure mounting with each passing moment.",
      "With a polite savagery that was her trademark, Beatrice navigated conversations with ease, deploying flattery and charm to disarm those around her. Her humor was sharp, often laced with an undercurrent of cynicism, a reflection of her keen awareness of the superficiality of high society. Yet, beneath her polished exterior lay a woman torn between her desires and the lengths she was willing to go to achieve them. The murder investigation had become a catalyst for her ambitions, and she was determined to seize the opportunity it presented.",
      "As whispers of the investigation reached her ears, Beatrice felt a mix of excitement and trepidation. What if the truth of the murder revealed her own financial struggles? What if her carefully constructed world crumbled before her eyes? The tension was palpable, and as she twirled through the ballroom, she knew she had to maintain her poise while plotting her next move. The clock was ticking, and Beatrice understood that the resolution of this case could either secure her future or plunge her into a world of chaos."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Little Middleton Manor",
    "type": "Country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Little Middleton Manor is a sprawling estate surrounded by manicured gardens and dense woodlands, steeped in secrets and class tensions.",
    "visualDescription": "The manor is an imposing structure with red-brick facades, tall chimneys, and multi-paned windows that reflect the gloom of the overcast skies. A grand entrance hall boasts a sweeping staircase, while intricate woodwork and antique furnishings whisper of a bygone era.",
    "atmosphere": "The air is thick with unspoken words and hidden motives, each corner of the house echoing with the weight of secrets.",
    "paragraphs": [
      "Little Middleton Manor stands like a sentinel in the English countryside, its red-brick walls cloaked in ivy. The sprawling structure, with its multiple wings and tall chimneys, looms against the backdrop of a grey sky, a testament to wealth and privilege. The manicured gardens are meticulously maintained, yet the dense woodlands surrounding the estate offer a stark contrast, their shadows hinting at the mysteries that lie within. As the autumn leaves rustle in the chill breeze, the manor exudes an unsettling stillness, broken only by the distant call of a crow.",
      "Inside, the grand entrance hall welcomes visitors with its polished floorboards and ornate plasterwork. Gas lamps flicker weakly in the corners, casting a dim light that dances across the faces of portraits lining the walls. The air is heavy with the scent of beeswax from the candle sconces and the faint odor of damp stone. Narrow hallways branch off from the hall, leading to locked doors that guard the secrets of the family. Each creak of the floorboards reverberates through the house, as if the manor itself is alive, holding its breath in anticipation of the unfolding drama.",
      "As the day wears on, the atmosphere grows tenser, reflecting the class tensions rising among the estate's inhabitants. Conversations are hushed, glances exchanged furtively, with every footstep echoing the unspoken fears that linger in the air. The sound of a typewriter clacking in the study punctuates the silence, a reminder of the correspondence being forged in the shadows. The estate, though grand, feels increasingly isolated, with the nearest village several miles away, leaving its occupants at the mercy of their own secrets and suspicions.",
      "With the onset of evening, the manor transforms. Candlelight flickers against the walls, casting long shadows that seem to reach out like fingers. The scent of burning wood mixes with the lingering aroma of damp earth from the gardens. Outside, the rain begins to fall softly, each drop a reminder of the growing unease within the walls. As night descends, the manor stands shrouded in darkness, a bastion of secrets and lies, waiting for the truth to be uncovered."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical of the English countryside in autumn.",
    "timeFlow": "Three days of mounting tension leading to a climactic confrontation.",
    "mood": "Tense and foreboding, reflecting the underlying class tensions and recent local events.",
    "eraMarkers": [
      "Petrol automobiles on gravel roads",
      "Typewriters in use for correspondence",
      "Domestic wiring for lighting with frequent outages"
    ],
    "sensoryPalette": {
      "dominant": "Damp earth and wood smoke",
      "secondary": [
        "Candles burning",
        "Faint scent of old leather",
        "Creaking floorboards"
      ]
    },
    "paragraphs": [
      "The dense atmosphere of Little Middleton Manor is palpable, each room steeped in a sense of history and the weight of unspoken words. The air is thick with the scent of wood smoke mingling with damp earth, while the flickering candlelight casts a warm yet eerie glow across the polished surfaces. Outside, the overcast sky looms heavily, threatening rain that seems to echo the tension inside. The sound of distant thunder rumbles ominously, as if nature itself is warning of the storm to come.",
      "Inside the manor, every creak of the floorboards and whisper of the wind through the trees adds to the sense of unease. Conversations are hushed, glances exchanged with caution, as the characters navigate the complexities of their relationships. The smell of beeswax candles competes with the musty scent of old books in the library, where shadows dance among the shelves, hiding secrets waiting to be uncovered. The atmosphere is charged with anticipation, as the clock ticks inexorably toward the revelation of truth hidden within the walls."
    ]
  },
  "keyLocations": [
    {
      "id": "entrance_hall",
      "name": "Grand Entrance Hall",
      "type": "interior",
      "purpose": "Gathering space and first point of entry",
      "visualDetails": "A vast hall with a sweeping staircase, ornate plasterwork, and gas lamps flickering in the dim light.",
      "sensoryDetails": {
        "sights": [
          "Polished wood floorboards",
          "Ornate plaster ceiling",
          "Portraits in heavy frames",
          "Gas lamps casting flickering light",
          "Grand staircase with a red carpet"
        ],
        "sounds": [
          "Footsteps echoing on wood",
          "Distant ticking of a clock",
          "Whispers of conversation",
          "Creaking of old timbers",
          "Rain tapping against the windows"
        ],
        "smells": [
          "Beeswax from candle sconces",
          "Dust from the air",
          "Damp stone",
          "Old leather from furniture",
          "Freshly polished wood"
        ],
        "tactile": [
          "Smooth wood of the bannister",
          "Chill draft from the entrance",
          "Worn fabric of the red carpet",
          "Coolness of the stone walls",
          "Weight of the heavy doors"
        ]
      },
      "accessControl": "Access is granted to all guests, but the doors to private wings remain locked until evening.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streaking the windows",
            "Grey light filtering through clouds",
            "Puddles forming on the floor",
            "Glistening floorboards",
            "Muted colors of the portraits"
          ],
          "sounds": [
            "Steady drumming of rain on the roof",
            "Water trickling down the walls",
            "Distant thunder rumbling",
            "Whispers of the house settling",
            "Creak of the front door"
          ],
          "smells": [
            "Damp earth from the gardens",
            "Mildew in the corners",
            "Cold stone from the walls",
            "Fresh rain on foliage",
            "Faint scent of wood smoke"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light casting no shadows",
            "Dust motes floating in the air",
            "Gloomy atmosphere in the corners",
            "Faded colors of the furnishings",
            "Candlelight struggling to pierce the gloom"
          ],
          "sounds": [
            "Silence interrupted by a clock ticking",
            "Distant creaking of the floorboards",
            "Soft murmurs from the drawing room",
            "Wind rustling through the trees",
            "Occasional drip of water from the eaves"
          ],
          "smells": [
            "Beeswax and dust from the candles",
            "Old wood and leather",
            "Chilly air wafting in",
            "Faint scent of damp paper",
            "Lingering aroma of tobacco"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight reflecting off polished surfaces",
            "Long shadows cast by the staircase",
            "Brass fittings gleaming in the light",
            "Warm glow from the fireplace",
            "Guests mingling under dim light"
          ],
          "sounds": [
            "Ticking of the mantel clock",
            "Distant laughter from the drawing room",
            "Soft crackling of the fire",
            "Clinking of glasses",
            "Murmur of voices in conversation"
          ],
          "smells": [
            "Candle wax melting",
            "Tobacco smoke lingering",
            "Cold fireplace ash",
            "Faint scent of dinner wafting",
            "Old book leather binding"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Entrance Hall of Little Middleton Manor serves as the first impression for all who enter. With its sweeping staircase and ornate plasterwork, it is both grand and imposing. Gas lamps flicker in the dim light, casting a warm glow that contrasts sharply with the chill in the air. The hall is a gathering space, where conversations begin and secrets are exchanged under the watchful eyes of the portraits that line the walls. Each footstep echoes, a reminder of the house's history and the weight of its occupants' lives.",
        "As the day progresses, the hall becomes a stage for the unfolding drama. The sound of rain tapping against the windows creates a rhythm that mirrors the tension building within the manor. Guests move cautiously, aware of the unspoken rules that govern their interactions. The scent of beeswax mingles with the mustiness of old leather, creating an atmosphere that is both inviting and foreboding. The access to various wings of the house is restricted, with doors leading to private areas remaining locked, heightening the sense of intrigue and secrecy."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery and research",
      "visualDetails": "Walls lined with towering bookshelves filled with dusty tomes, a large mahogany table at the center, and a plush armchair tucked in a corner.",
      "sensoryDetails": {
        "sights": [
          "Dusty books lining the shelves",
          "Rich mahogany furniture",
          "Leather-bound volumes stacked high",
          "A globe in the corner",
          "Flickering candlelight"
        ],
        "sounds": [
          "Pages turning in silence",
          "Soft rustle of paper",
          "Distant clock ticking",
          "Whispers of conversation from outside",
          "Creaking of the floorboards"
        ],
        "smells": [
          "Old paper and leather",
          "Dust motes in the air",
          "Faint scent of wood polish",
          "Musty aroma of forgotten books",
          "Hints of tobacco smoke"
        ],
        "tactile": [
          "Worn leather armchair",
          "Smooth surface of the table",
          "Coolness of the stone walls",
          "Textured spines of old books",
          "Chill draft from the window"
        ]
      },
      "accessControl": "Restricted to family members and invited guests; locked after sundown.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops on window panes",
            "Soft grey light filtering in",
            "Books glistening with moisture",
            "Shadows deepening in corners",
            "Puddles forming on the floor"
          ],
          "sounds": [
            "Steady rain drumming on the roof",
            "Soft thud of a book closing",
            "Distant rumble of thunder",
            "Whispers of the wind outside",
            "Creaking of old wood"
          ],
          "smells": [
            "Damp earth from outside",
            "Mildew in the corners",
            "Cold air wafting in",
            "Faint scent of wet paper",
            "Lingering aroma of old tobacco"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light casting no shadows",
            "Dust motes swirling in the air",
            "Books casting elongated shadows",
            "Faded colors of the upholstery",
            "Candle flames flickering weakly"
          ],
          "sounds": [
            "Silence interrupted by a clock ticking",
            "Soft whispers of pages turning",
            "Distant laughter from the hall",
            "Wind rustling against the windows",
            "Creaking of the shelves"
          ],
          "smells": [
            "Old paper and leather bindings",
            "Dusty air filled with history",
            "Faint scent of beeswax",
            "Lingering aroma of old tobacco",
            "Cold air mixing with warmth"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight illuminating the room",
            "Shadows dancing on the walls",
            "Books glinting in the light",
            "Rich colors of the upholstery",
            "A warm glow from the fireplace"
          ],
          "sounds": [
            "Crackling of the fire",
            "Soft laughter from outside",
            "Ticking of a clock",
            "Rustle of a page turning",
            "Distant voices echoing in the hall"
          ],
          "smells": [
            "Warmth of burning wood",
            "Scent of fresh parchment",
            "Faint whiff of tobacco",
            "Hints of beeswax",
            "Aged leather from books"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library of Little Middleton Manor is a treasure trove of knowledge and secrets. Towering bookshelves are filled with dusty tomes, their spines cracked and worn from years of use. A large mahogany table stands at the center, cluttered with papers and half-finished letters, while a plush armchair sits invitingly in the corner, perfect for quiet contemplation or clandestine meetings. The room is illuminated by flickering candlelight, casting shadows that dance among the rows of books, creating a sense of mystery and intrigue.",
        "As guests enter the library, they are enveloped in the rich scents of old paper and leather, mingling with the faint aroma of tobacco smoke lingering in the air. The soft rustle of pages turning fills the silence, punctuated only by the distant ticking of a clock. This is a space of discovery, where clues may be hidden among the volumes, waiting for the right eyes to uncover them. However, access to this sanctuary of knowledge is strictly controlled, with the doors locked after sundown, heightening the sense of secrecy that permeates the manor."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space for social interaction",
      "visualDetails": "Elegantly furnished with plush seating, a grand piano in the corner, and large windows offering views of the gardens.",
      "sensoryDetails": {
        "sights": [
          "Ornate furniture with rich fabrics",
          "Grand piano with polished surface",
          "Large windows framing the gardens",
          "Candle sconces illuminating the room",
          "Richly patterned rugs on the floor"
        ],
        "sounds": [
          "Soft music from the piano",
          "Laughter and conversation",
          "Clinking of glasses",
          "Creak of the floorboards",
          "Distant sound of rain against the windows"
        ],
        "smells": [
          "Fresh flowers from the garden",
          "Scent of polished wood",
          "Hints of tobacco smoke",
          "Faint aroma of tea brewing",
          "Warmth of the fireplace"
        ],
        "tactile": [
          "Soft upholstery of the chairs",
          "Coolness of the glass windowpanes",
          "Smooth surface of the piano",
          "Warmth of the fire",
          "Textured fabric of the rugs"
        ]
      },
      "accessControl": "Open to guests during social gatherings; private access restricted at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streaming down the windows",
            "Dim light filtering through clouds",
            "Flowers drooping from the rain",
            "Shadows deepening in corners",
            "Wet rugs absorbing moisture"
          ],
          "sounds": [
            "Steady rhythm of rain on the roof",
            "Soft music from the piano",
            "Quiet conversation among guests",
            "Creaking of the furniture",
            "Distant thunder rumbling"
          ],
          "smells": [
            "Fresh scent of rain-soaked flowers",
            "Dampness in the air",
            "Faint aroma of brewing tea",
            "Hints of smoke from the fireplace",
            "Scent of polished wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light reflecting off surfaces",
            "Dust motes swirling in the air",
            "Muted colors of the furnishings",
            "Candle flames flickering",
            "Guests moving about in shadow"
          ],
          "sounds": [
            "Silence interrupted by laughter",
            "Soft music playing in the background",
            "Clinking of glasses",
            "Whispers of conversation",
            "Creaking of the floorboards"
          ],
          "smells": [
            "Warmth of the fireplace",
            "Hints of lavender from the garden",
            "Scent of polished wood",
            "Faint aroma of tobacco",
            "Lingering smell of tea"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight illuminating the room",
            "Guests mingling under soft glow",
            "Reflections of light on the piano",
            "Shadows playing on the walls",
            "Glimmer of glasses in hand"
          ],
          "sounds": [
            "Soft music from the piano",
            "Laughter filling the air",
            "Clinking of glasses",
            "Whispers and secrets exchanged",
            "Crackling of the fire"
          ],
          "smells": [
            "Scent of fresh flowers",
            "Warmth of the fireplace",
            "Hints of tobacco smoke",
            "Aroma of baked goods",
            "Faint scent of tea brewing"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Drawing Room of Little Middleton Manor is an elegant space designed for social interaction. Plush seating invites guests to relax, while a grand piano stands in the corner, ready for impromptu performances. Large windows frame views of the meticulously landscaped gardens, allowing natural light to filter in, even on the gloomiest of days. Candle sconces cast a warm glow, creating an inviting yet intimate atmosphere where secrets can be shared and alliances forged.",
        "As the day unfolds, the room fills with laughter and conversation, the sound of clinking glasses punctuating the air. The scent of fresh flowers mingles with the warmth of the fireplace, providing a comforting backdrop to the tensions that simmer just beneath the surface. Though open to guests during social gatherings, access to the Drawing Room becomes more restricted at night, as the shadows deepen and the secrets of Little Middleton Manor begin to stir."
      ]
    },
    {
      "id": "servants_quarters",
      "name": "Servants' Quarters",
      "type": "interior",
      "purpose": "Living space for staff and hidden observations",
      "visualDetails": "A narrow corridor leads to small rooms with simple furnishings, a communal area for meals, and a staircase leading to the main house.",
      "sensoryDetails": {
        "sights": [
          "Faded wallpaper peeling at the edges",
          "Small rooms with minimal furnishings",
          "A communal table set for meals",
          "Staircase leading upwards",
          "Dim lighting from a single bulb"
        ],
        "sounds": [
          "Soft murmurs of conversation",
          "Clinking of dishes",
          "Footsteps on the stairs",
          "Rustling of fabric",
          "Distant laughter from the main house"
        ],
        "smells": [
          "Faint scent of cooking",
          "Dust in the air",
          "Old wood and fabric",
          "Hints of laundry soap",
          "Lingering aroma of tobacco"
        ],
        "tactile": [
          "Worn wooden floors",
          "Cool metal of door handles",
          "Rough fabric of uniforms",
          "Smoothness of the communal table",
          "Chill draft from the stairway"
        ]
      },
      "accessControl": "Access is restricted to staff; family members avoid this area.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops tapping against the windows",
            "Dim light filtering through clouds",
            "Puddles forming on the floor",
            "Wet shoes left by the door",
            "Shadows deepening in corners"
          ],
          "sounds": [
            "Steady rain drumming on the roof",
            "Murmurs of staff preparing breakfast",
            "Soft thud of food being set on the table",
            "Creaking of the ceiling above",
            "Distant thunder rumbling"
          ],
          "smells": [
            "Freshly baked bread wafting",
            "Scent of damp earth outside",
            "Hints of laundry soap",
            "Old wood and fabric",
            "Lingering aroma of tobacco"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light casting no shadows",
            "Dust motes swirling in the air",
            "Faded colors of the furnishings",
            "Dim lighting from a single bulb",
            "Shadows deepening in corners"
          ],
          "sounds": [
            "Silence interrupted by distant laughter",
            "Clinking of dishes being washed",
            "Soft murmurs of conversation",
            "Footsteps echoing on the stairs",
            "Rustle of fabric being folded"
          ],
          "smells": [
            "Scent of warm bread cooling",
            "Dusty air filled with history",
            "Faint aroma of laundry soap",
            "Hints of tobacco lingering",
            "Cold air mixing with warmth"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Soft glow from a single bulb",
            "Shadows playing on the walls",
            "Dimly lit corridor leading to the stairs",
            "Faint light from the main house",
            "Guests moving about above"
          ],
          "sounds": [
            "Soft chatter among staff",
            "Clinking of dishes being cleared",
            "Footsteps on the stairs",
            "Distant laughter from the drawing room",
            "Rustling of fabric"
          ],
          "smells": [
            "Aroma of evening meals being prepared",
            "Faint scent of tobacco lingering",
            "Hints of laundry soap",
            "Cold air mixing with warmth",
            "Faint scent of damp earth"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Servants' Quarters of Little Middleton Manor are a stark contrast to the grandeur of the main house. A narrow corridor leads to small, sparsely furnished rooms, where staff find rest after long hours of work. A communal area serves as the hub for meals and conversations, the air filled with soft murmurs and the clinking of dishes. Dim lighting from a single bulb casts shadows that dance along the worn wooden floors, creating an atmosphere of secrecy and hidden observations.",
        "As the day unfolds, the sounds of the staff preparing meals echo softly in the quarters. The scent of freshly baked bread mingles with the lingering aroma of tobacco, creating a comforting yet oppressive atmosphere. Access is strictly controlled; family members rarely venture into this part of the estate, leaving the servants to navigate their own dynamics. The distance from the main house adds to the sense of isolation, as whispers of secrets and suspicions fill the air, waiting to spill over into the grander world above."
      ]
    }
  ],
  "note": "",
  "cost": 0.005313848100000001,
  "durationMs": 36173
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1939,
    "month": "February",
    "day": 14,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "chilly winds"
    ],
    "daylight": "Days are short, with dusk settling in around five o'clock in the evening, often leaving the countryside dim and dreary.",
    "time_of_day_of_crime": "Late evening — between eight and ten o'clock at night, when the house is quiet and shadows loom larger.",
    "holidays": [
      "Valentine's Day on February 14"
    ],
    "seasonalActivities": [
      "strolling amidst the bare trees",
      "indoor card games by the fire",
      "attending local dances or soirées"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool suits",
        "high-collared shirts",
        "double-breasted waistcoats"
      ],
      "casual": [
        "corduroy trousers",
        "tweed jackets",
        "knit sweaters"
      ],
      "accessories": [
        "Homburg hats",
        "leather gloves",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with fitted waists",
        "long silk gloves",
        "fur-trimmed coats"
      ],
      "casual": [
        "knitted cardigans",
        "A-line skirts",
        "blouses with Peter Pan collars"
      ],
      "accessories": [
        "feathered hats",
        "beaded handbags",
        "string of pearls"
      ]
    },
    "trendsOfTheMoment": [
      "emphasis on tailored lines for both men and women",
      "the rise of Art Deco influences",
      "the popularity of darker, more muted colors"
    ],
    "socialExpectations": [
      "men expected to wear hats in public",
      "women encouraged to maintain modesty in dress",
      "strict etiquette at social gatherings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "tensions rising in Europe with the impending threat of World War II",
      "debates in the British Parliament over defense spending",
      "the impact of the Munich Agreement still felt among the populace"
    ],
    "politicalClimate": "The political atmosphere is charged, with fears of fascism growing and many advocating for a stronger defense policy.",
    "economicConditions": "The economy is slowly recovering from the depths of the Great Depression, but class divisions remain pronounced.",
    "socialIssues": [
      "unemployment still a concern",
      "women's rights movements gaining momentum",
      "increased anti-Semitic sentiments in parts of Europe"
    ],
    "internationalNews": [
      "Germany's reoccupation of the Rhineland",
      "Italy's invasion of Albania",
      "the U.S. neutrality acts debated in Congress"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'In the Mood' by Glenn Miller",
        "'Moonlight Serenade' by Glenn Miller",
        "'The Lady Is a Tramp' by Ella Fitzgerald"
      ],
      "films": [
        "'Gone with the Wind'",
        "'The Wizard of Oz'",
        "'Mr. Smith Goes to Washington'"
      ],
      "theater": [
        "'The Cat and the Canary'",
        "'The Man Who Came Back'",
        "'The Royal Family'"
      ],
      "radio": [
        "'The Shadow'",
        "'The Lone Ranger'",
        "'Fibber McGee and Molly'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Grapes of Wrath' by John Steinbeck",
        "'Of Mice and Men' by John Steinbeck",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "social commentary",
        "romantic fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the automatic dishwasher",
        "the ballpoint pen",
        "the electric washing machine"
      ],
      "commonDevices": [
        "petrol-powered cars",
        "radio sets",
        "typewriters"
      ],
      "emergingTrends": [
        "rise of home appliances",
        "increased radio broadcasting",
        "early developments in aviation technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: three pence",
        "Movie ticket: one shilling"
      ],
      "commonActivities": [
        "visiting local markets",
        "attending community dances",
        "playing bridge or whist with friends"
      ],
      "socialRituals": [
        "afternoon tea gatherings",
        "Sunday church services",
        "family dinners featuring multiple courses"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "class distinctions are strictly upheld",
      "wealthy individuals often patronize the arts",
      "working class faces ongoing struggles"
    ],
    "gender": [
      "women are beginning to step into more public roles but are still expected to maintain traditional family duties",
      "men are viewed as primary breadwinners",
      "women's fashion reflects a balance of modern and traditional values"
    ],
    "race": [
      "racial tensions exist, particularly regarding immigration debates",
      "colonial attitudes towards non-European races persist",
      "cultural contributions of minorities often overlooked"
    ],
    "generalNorms": [
      "politeness and decorum are valued in public settings",
      "gossip and reputation are crucial in social circles",
      "social mobility is difficult but increasingly desired"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth clings to the air, mingling with the faint aroma of wood smoke from the hearth.",
    "The distant sound of raindrops tapping against the windowpanes creates a rhythm of unease, amplifying the tension within the estate.",
    "Flickering candlelight casts elongated shadows on the walls, enhancing the feeling of being watched in every corner of the dimly lit rooms."
  ],
  "paragraphs": [
    "February 1939 casts a heavy blanket of gray over the English countryside, where the chill of winter lingers even as whispers of spring begin to stir. The air is filled with the scent of damp earth, a reminder of the recent rains that have swept through, and the overcast skies often leave townspeople feeling listless. As dusk approaches around five o'clock, the shadows deepen, and the isolation of a country house estate feels more pronounced, creating an atmosphere ripe for secrets and mysteries.",
    "Fashion in this era reflects both the somber tones of the season and the social expectations of the time. Men sport tailored wool suits, often complemented by Homburg hats and leather gloves, while women are adorned in tea-length dresses with fitted waists and fur-trimmed coats, their appearances polished and proper. The use of muted colors prevails, echoing the societal tensions and the realities of life in a country grappling with its class divisions and the threat of war looming just beyond the horizon.",
    "Daily life in February 1939 is marked by a mixture of routine and rising anxiety. Afternoon tea is a cherished ritual, where neighbors gather to share news and gossip, often punctuated by laughter that masks the undercurrents of discontent and fear. The prices of everyday items, such as a loaf of bread for four pence, highlight the economic recovery still in its infancy, and community dances provide a brief respite from the harsh realities outside. Yet, as the world edges closer to conflict, tensions within society are palpable, especially among the class divisions that define existence in this moment."
  ],
  "note": "",
  "cost": 0.00106404705,
  "durationMs": 12797
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the estate for a wealthy benefactor's will reading draws together heirs and staff, all under the strain of economic hardship and rising class tensions exacerbated by recent local unrest.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression has intensified class divisions, creating resentment among the lower classes towards the affluent, while the threat of fascist ideologies looms over Europe, influencing societal dynamics."
  },
  "setting": {
    "location": "A large, sprawling manor house set in the English countryside, surrounded by manicured gardens and dense woodlands.",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain, typical of the English countryside in autumn."
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
      "description": "The clock in the entrance hall shows ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Indicates the time displayed by the clock at the crime scene.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock's time cannot be trusted as it may have been tampered with.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Suggests the clock might not reflect the actual time of the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "The victim's diary shows scheduled appointments at ten thirty in the evening.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Indicates the victim had plans that contradict the clock's time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The victim was due to meet someone before the time shown on the clock.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Contradicts the timeline suggested by the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "A heavy candlestick was found near the clock.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Could be a potential murder weapon or tampering tool.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The candlestick could have been used to tamper with the clock mechanism.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Suggests a method of altering the clock's time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "A mechanical clock was wound back to frame the time of the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "Reveals the method used to manipulate the clock's time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock's time cannot be trusted as it may have been tampered with.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Overturns the assumption that the clock displays the correct time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was seen at the hospital during the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Dr. Mallory Finch has a corroborated alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Witnesses heard the clock chime at an odd hour.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[1]",
      "pointsTo": "Suggests that the clock may not be accurate.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "behavioral",
      "description": "Eleanor Voss was seen acting nervously around the time of the murder.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "Indicates potential guilt or premeditation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was attending a meeting during the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale has a corroborated alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_10",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was seen leaving the house before the murder occurred.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Beatrice Quill has a corroborated alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "category": "physical",
      "description": "Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Victim's last known movements remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [],
  "status": "fail",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_core_elimination_chain",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_culprit_direct_eleanor_voss"
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
  "latencyMs": 11313,
  "cost": 0.0030092601
}

---

## OUTPUT INSTRUCTIONS

Produce a single JSON object with ALL of the following fields.

Return the JSON object directly — no preamble, no markdown fences, no commentary.

ARRAYS RULE: Every array field (characterPortraits, characterVoiceSketches, locationRegisters,
humourPlacementMap) must contain ONLY the specified object type. Do NOT include strings, notes,
comments, or extra placeholder entries anywhere inside an array. Each array element must be a
valid JSON object conforming to the schema below.

MANDATORY FIELD LENGTHS:
- storyEmotionalArc.arcDescription: MINIMUM 300 words (target 350).
  This is the most important field. Plan your token budget for it FIRST.
  Write multiple distinct paragraphs tracing the full emotional journey:
    Para 1 — Opening atmosphere and the weight of the initial crime
    Para 2 — Rising investigation: first clues, first false leads, emotional cost
    Para 3 — Mid-story pivot: something changes the investigator's direction
    Para 4 — Second turn: a revelation recolours earlier events
    Para 5 — Pre-climax and climax: mounting pressure and confrontation
    Para 6 — Resolution: what the ending costs emotionally for each character
  A single dense paragraph will fail the validation gate regardless of word count. Count your words.
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
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
