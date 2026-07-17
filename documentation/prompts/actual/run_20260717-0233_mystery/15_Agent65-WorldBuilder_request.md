# Actual Prompt Record

- Run ID: `mystery-1784255628503`
- Project ID: ``
- Timestamp: `2026-07-17T02:37:37.214Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `ec385294960c032f`

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
    "title": "The Veil of Deceit",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Brighton",
      "place": "seaside hotel",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "delayed-action poison"
    }
  },
  "death_method": "poisoned with a botanical toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [
        "Dr. Mallory Finch (Victim)",
        "Captain Ivor Hale (Rival)"
      ],
      "public_persona": "Respected investigator known for keen insight",
      "private_secret": "Has a past connection with the victim",
      "motive_seed": "Personal",
      "motive_strength": "low",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel corridors",
        "Public areas"
      ],
      "behavioral_tells": [
        "Sharp observations",
        "Calm demeanor"
      ],
      "stakes": "Solving the case for her reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "Eleanor Voss (Detective)",
        "Hugo Vane (Colleague)"
      ],
      "public_persona": "Respected physician with a calm demeanor",
      "private_secret": "Struggled with professional rivalry",
      "motive_seed": "Professional envy",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Private consultations",
        "Public areas"
      ],
      "behavioral_tells": [
        "Nervous habits",
        "Distracted"
      ],
      "stakes": "Reputation as a doctor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Rival",
      "relationships": [
        "Eleanor Voss (Rival)"
      ],
      "public_persona": "Charismatic military officer",
      "private_secret": "Harbors jealousy towards Dr. Finch's success",
      "motive_seed": "Professional rivalry",
      "motive_strength": "high",
      "alibi_window": "evening before murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel bar",
        "Private consultations"
      ],
      "behavioral_tells": [
        "Overly friendly",
        "Defensive"
      ],
      "stakes": "Professional standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Friend",
      "relationships": [
        "Dr. Mallory Finch (Friend)",
        "Sylvia Trent (Friend)"
      ],
      "public_persona": "Supportive friend",
      "private_secret": "Knew about Finch's rivalry with Hale",
      "motive_seed": "Concern for Finch",
      "motive_strength": "low",
      "alibi_window": "evening before murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel corridors",
        "Public areas"
      ],
      "behavioral_tells": [
        "Sympathetic",
        "Curious"
      ],
      "stakes": "Protecting Finch",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Acquaintance",
      "relationships": [
        "Beatrice Quill (Friend)"
      ],
      "public_persona": "Young and enthusiastic",
      "private_secret": "Inexperienced in social dynamics",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "evening before murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel bar",
        "Public areas"
      ],
      "behavioral_tells": [
        "Naive",
        "Eager to please"
      ],
      "stakes": "Social acceptance",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Colleague",
      "relationships": [
        "Dr. Mallory Finch (Colleague)"
      ],
      "public_persona": "Competitive physician",
      "private_secret": "Resented Finch's success",
      "motive_seed": "Professional jealousy",
      "motive_strength": "high",
      "alibi_window": "evening before murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Consultation rooms",
        "Public areas"
      ],
      "behavioral_tells": [
        "Concealed animosity",
        "Inconsistent statements"
      ],
      "stakes": "Career advancement",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Captain Ivor Hale"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In a seaside hotel, Dr. Mallory Finch is found dead, seemingly from natural causes, but the truth lies hidden in the shadows of jealousy and rivalry."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on poison, temperature, and record to expose the false timing.",
      "delivery_path": [
        {
          "step": "Hale acquired the poison from a local herbalist"
        },
        {
          "step": "Hale stored the poison in the hotel bar's refrigerator"
        },
        {
          "step": "Hale served Finch the poisoned drink during their last meeting"
        }
      ]
    },
    "outcome": {
      "result": "Dr. Mallory Finch dies from the delayed effects of the poison."
    }
  },
  "false_assumption": {
    "statement": "Dr. Mallory Finch's death was due to natural causes after a night of heavy drinking.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses saw Finch enjoying drinks and socializing, leading to speculation about intoxication.",
    "what_it_hides": "The calculated administration of poison masked by social behavior."
  },
  "false_solution": {
    "accused_suspect": "Hugo Vane",
    "supporting_points": [
      "Hugo was seen arguing with Finch earlier that day.",
      "Witnesses report Hugo leaving the bar shortly before Finch's collapse."
    ],
    "the_one_flaw": "Hugo had a strong alibi from several witnesses who were with him during the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses report a heated argument between Finch and Hale the night before the murder.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was over professional disputes, not related to Finch's death.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A broken glass was found near Finch’s body.",
      "points_at_suspect": "Eleanor Voss",
      "innocent_explanation": "The glass was part of the room service that Finch ordered earlier, not related to the murder.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the murder, and no outsiders had access."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Midnight temperature drop",
        "Evening before the murder"
      ],
      "windows": [
        "Between 10 PM and Midnight"
      ],
      "contradictions": [
        "Witnesses claim Finch was in good spirits just before death"
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale"
      ],
      "objects": [
        "Poison",
        "Drinks in the bar"
      ],
      "permissions": [
        "Access to the bar's refrigerator"
      ]
    },
    "physical": {
      "laws": [
        "Toxic effects of the poison dependent on temperature"
      ],
      "traces": [
        "Temperature records from the bar's refrigerator"
      ]
    },
    "social": {
      "trust_channels": [
        "Professional relationships among doctors"
      ],
      "authority_sources": [
        "Hotel management regarding bar access"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Temperature records show a drop to forty-eight degrees Fahrenheit at midnight.",
        "correction": "The temperature drop indicates the poison could have activated during this time.",
        "effect": "Narrows administration window to the evening before Finch's death.",
        "required_evidence": [
          "Temperature records from the hotel bar",
          "Time of death recorded by hotel staff"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses saw Hale serving Finch a drink just hours before his death.",
        "correction": "This establishes Hale's opportunity to poison Finch.",
        "effect": "Narrows suspects to those present at the bar.",
        "required_evidence": [
          "Witness statements about Hale's interactions with Finch",
          "Drink orders made by Finch"
        ],
        "reader_observable": true
      },
      {
        "observation": "A half-empty glass found in Finch's room contains traces of the toxin.",
        "correction": "This confirms that Finch ingested the poison from a drink served by Hale.",
        "effect": "Eliminates other suspects who had no access to Finch's room.",
        "required_evidence": [
          "Forensic report on the glass contents",
          "Location of the glass in Finch's room"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares confirm, drink, and temperature against the claimed timeline.",
    "knowledge_revealed": "The bartender confirms Hale was the last person to serve Finch before his death.",
    "pass_condition": "Hale cannot provide an alibi for the time Finch consumed the drink.",
    "evidence_clues": [
      "clue_10",
      "clue_5",
      "clue_6"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The temperature records reveal a critical timing detail regarding poison activation. Step 2: Witness accounts of Hale serving Finch narrow the focus to his potential involvement. Step 3: The toxicology report from the glass validates the poison's presence, leading to Hale's guilt."
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
        "Observe the bartender's confirmation",
        "Draw conclusion about Hale's guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Beatrice was with Sylvia during the time of the murder.",
        "supporting_clues": [
          "witness_statement_3",
          "witness_statement_4"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Sylvia was seen chatting with Beatrice, corroborating her alibi.",
        "supporting_clues": [
          "witness_statement_5",
          "witness_statement_6"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening before murder",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence showing Hale's guilt."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
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
    "summary": "Eleanor Voss is a tenacious journalist haunted by her past romance with the victim, driving her to uncover the truth behind the murder.",
    "publicPersona": "Eleanor presents herself as a sharp-eyed reporter known for her investigative skills and community involvement. Her articles often blend hard facts with the human stories behind them, making her a well-respected figure in Brighton.",
    "privateSecret": "She has a romantic past with the victim, which complicates her feelings about the case. This hidden history makes her more than just a reporter; it intertwines her heart with her investigation.",
    "motiveSeed": "Desires to uncover the truth for her own peace of mind, especially due to her past with the victim. The unresolved feelings linger like a shadow over her work, pushing her to seek closure.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the lobby interviewing guests at the time of the murder, providing her with a plausible reason to not be present at the scene.",
    "accessPlausibility": "easy",
    "stakes": "Her personal closure and professional integrity are at stake. If she fails to solve the case, it could haunt her, both personally and in her career.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Eleanor speaks with a rhythmic cadence, often pausing for emphasis. She has a tendency to use metaphors related to journalism, making her dialogue both engaging and insightful.",
    "signatureTic": "‘Truth is a slippery fish.’",
    "internalConflict": "Eleanor grapples with guilt over her past relationship with the victim, fearing that her emotions may cloud her judgment as she investigates.",
    "personalStakeInCase": "This crime matters personally because resolving her feelings about the victim is essential for Eleanor’s emotional health and her ability to move forward in life.",
    "paragraphs": [
      "Eleanor Voss stood in the hotel lobby, her sharp eyes scanning the room filled with whispers and hurried footsteps. The murder of Dr. Mallory Finch had sent shockwaves through Brighton, and as a local journalist, Eleanor felt the weight of the community's expectations on her shoulders. Yet, there was more to her than just a professional obligation; the victim was someone she once loved, a connection that complicated every lead she pursued.",
      "With every conversation she conducted, Eleanor wrestled with the ghosts of their past. Memories of laughter and shared dreams clashed against the harsh reality of death and betrayal. She often found herself lost in thought, questioning whether her pursuit of the truth was for the community or for herself. The fine line between her professional duty and personal desire blurred, making her investigation a delicate dance of emotions.",
      "Eleanor's colleagues admired her tenacity, but they were unaware of the turmoil that raged within her. She was determined to uncover the truth, yet the specter of her past loomed large. Often, she would catch herself staring at the hotel’s elegant decor, recalling how she had once envisioned a future with Mallory. Now, that future lay shattered, and all that remained was a need for closure that consumed her.",
      "As she delved deeper into the investigation, Eleanor found herself confronting not just the circumstances of Mallory's death but her own unresolved feelings. Each suspect presented a new angle, a new layer of intrigue, but the heart of the matter remained her own tangled emotions. The truth, she realized, was not just about finding a murderer; it was about reconciling with her past and discovering who she was in the wake of loss."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch was a respected physician whose compassion masked a simmering jealousy towards the victim's success.",
    "publicPersona": "Respected doctor known for her compassion and dedication to her patients. She had a reputation for going the extra mile, often attending to the less fortunate without a second thought.",
    "privateSecret": "Harbored jealousy towards the victim’s successful career and their close ties with influential locals. Beneath her polished exterior lay a deep-seated resentment that festered over the years.",
    "motiveSeed": "Felt overshadowed by the victim’s prominence in the community and feared losing patients to her reputation. Mallory's envy was a silent poison that threatened to unravel her carefully constructed life.",
    "motiveStrength": "weak",
    "alibiWindow": "was in her office, tending to a patient at the time of the murder, offering her a legitimate excuse.",
    "accessPlausibility": "possible",
    "stakes": "Her standing in the community could diminish if it became known she was envious. The revelation of her feelings could tarnish her reputation as a compassionate healer.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory speaks with a calm, measured tone, often using technical jargon typical of the medical profession. Her speech lacks levity, reflecting her serious nature and the burden of her secrets.",
    "signatureTic": "‘It’s all about the patient.’",
    "internalConflict": "Mallory wrestles with her feelings of inadequacy and jealousy, fearing that her emotions may lead her to act against her principles.",
    "personalStakeInCase": "This crime matters to Mallory because her professional reputation is on the line, and the exposure of her envy could shatter her standing in Brighton's medical community.",
    "paragraphs": [
      "Dr. Mallory Finch sat in her office, the weight of the world pressing down on her shoulders. She was known for her dedication and compassion, yet beneath that polished facade lay a tumult of jealousy and resentment. The recent murder of the vivacious victim sent ripples through her life, awakening feelings she had long buried. The whispers of the community gnawed at her, and she felt the suffocating grip of envy tighten around her throat.",
      "In her quiet moments, Mallory would reflect on her career. Despite her success, she felt overshadowed by the victim's charisma and influence. The way people gravitated towards the victim, seeking her advice and companionship, only deepened Mallory's insecurities. She had devoted her life to healing others, yet she couldn't shake the feeling that she was merely a shadow in someone else's spotlight.",
      "As she tended to her patients, Mallory forced herself to focus on their needs, pushing aside her own turmoil. Yet, the thought that her envy could be laid bare haunted her. If anyone were to discover her true feelings, it could ruin her reputation and her career. The community's perception of her as a compassionate healer was fragile, and she feared the consequences of her jealousy becoming public knowledge.",
      "Now, with the murder investigation unfolding, Mallory faced a crossroads. The tangled web of emotions and secrets threatened to unravel everything she had worked for. As the scrutiny increased, she felt the walls closing in around her. Would she find a way to confront her feelings and reclaim her identity, or would her envy lead her down a path of self-destruction?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired navy officer whose dignified exterior hides a scandalous affair with the victim.",
    "publicPersona": "A dignified gentleman with a strong sense of duty and loyalty. He is often seen as a pillar of the community, respected for his service and gentlemanly behavior.",
    "privateSecret": "He once had an affair with the victim during the war, which he has kept hidden from his wife. The weight of this secret gnaws at him, a constant reminder of his past indiscretions.",
    "motiveSeed": "The victim threatened to expose their affair, which could ruin his reputation and marriage. The fear of losing everything he held dear drove him to desperation.",
    "motiveStrength": "strong",
    "alibiWindow": "was on a walk along the beach during the murder, a plausible cover for his whereabouts.",
    "accessPlausibility": "easy",
    "stakes": "His marriage and reputation are at stake if the affair becomes public. The thought of his wife discovering the truth fills him with dread.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks with a measured, authoritative tone, often punctuating his sentences with self-deprecating remarks that reveal his internal struggles. He tends to reflect on his past choices with a hint of regret.",
    "signatureTic": "‘A gentleman never forgets his duties.’",
    "internalConflict": "Ivor grapples with guilt over his past affair, fearing that the truth will destroy his marriage and tarnish his legacy.",
    "personalStakeInCase": "This crime matters to Ivor because the potential exposure of his affair threatens his family life and the honor he has built over the years.",
    "paragraphs": [
      "Captain Ivor Hale walked along the beach, the salty breeze tugging at his coat as he contemplated the storm brewing in his life. A retired navy officer, he had always prided himself on his sense of duty and loyalty. Yet, beneath the surface of his dignified exterior lay a scandal that could unravel everything he held dear. The recent murder of the victim, a woman he once loved, forced him to confront the ghosts of his past.",
      "In the quiet moments, Ivor would reflect on his affair with the victim during the war, a time when passion had consumed him. Now, that passion felt like a curse, a secret that threatened to destroy the life he had built with his wife. The victim's threat to expose their relationship had sent him into a spiral of fear and desperation, compelling him to consider desperate measures to protect his reputation.",
      "As he engaged with the community, Ivor maintained his facade of respectability, but the weight of his secret loomed large. He often caught himself musing about the man he had been, and the decisions that had led him to this point. Each self-deprecating remark he made was a thin veil, a way to shield himself from the truth that lay just beneath the surface.",
      "With the investigation into the murder gaining momentum, Ivor faced a reckoning. The prospect of his affair being revealed sent chills down his spine. Would he be able to navigate the treacherous waters of his past without losing everything? The stakes were higher than ever, and as he pondered his next steps, Ivor knew that the path to redemption would be fraught with challenges."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a naive hotel maid whose ambitions are clouded by envy of the victim's glamorous lifestyle.",
    "publicPersona": "A naive young woman with ambitions of moving up in the world. Her bubbly personality often masks her insecurities and aspirations.",
    "privateSecret": "She secretly idolizes the victim and resents her for the unattainable lifestyle. Beatrice's admiration is tinged with bitterness, creating a conflict within her.",
    "motiveSeed": "Her envy of the victim's life leads her to fantasize about a life without her. The allure of a glamorous existence fuels her daydreams.",
    "motiveStrength": "weak",
    "alibiWindow": "was cleaning a guest room near the time of the murder, providing her with a plausible reason for not being involved.",
    "accessPlausibility": "possible",
    "stakes": "Her dreams of a better life could shatter if her resentment is discovered. The thought of her feelings being exposed terrifies her.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a youthful exuberance, often punctuating her sentences with a sardonic twist. She has a tendency to use exaggerated expressions, reflecting her vivid imagination and aspirations.",
    "signatureTic": "‘Life’s a stage, and I’m just trying to find my role.’",
    "internalConflict": "Beatrice struggles with her feelings of inadequacy and envy, torn between idolizing the victim and resenting her for the life she cannot attain.",
    "personalStakeInCase": "This crime matters to Beatrice because the potential exposure of her feelings could jeopardize her dreams of social mobility and her fragile self-image.",
    "paragraphs": [
      "Beatrice Quill flitted through the hotel corridors, her hands busy with cleaning supplies as she daydreamed of a life far removed from her current reality. A naive young maid, she often found herself lost in the fantasies of grandeur and glamour that surrounded her. The victim, with her effortless charisma and luxurious lifestyle, was the embodiment of everything Beatrice longed for, yet her admiration was tinged with a bitter resentment that gnawed at her.",
      "In her mind, Beatrice often staged elaborate scenarios where she stepped into the victim's shoes, living a life filled with elegance and admiration. Yet, reality always crashed down around her, reminding her of the stark difference between her dreams and her everyday existence. The envy she harbored was a double-edged sword, fueling her aspirations while simultaneously threatening to consume her.",
      "Beatrice's conversations often danced between innocence and sarcasm, a reflection of her internal conflict. She would laugh off her feelings of inadequacy, masking her true emotions with a sardonic wit that belied her youth. Yet, beneath the surface, she feared the day her resentment might spill over, shattering her carefully constructed facade.",
      "As the murder investigation unfolded, Beatrice found herself at a crossroads. Her dreams of a better life hung in the balance, and the thought of her feelings being discovered filled her with dread. The stakes were higher than ever, and as she grappled with her emotions, she realized that the path to self-discovery would require confronting both her envy and her aspirations head-on."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a glamorous socialite whose jealousy towards the victim threatens to unravel her carefully crafted image.",
    "publicPersona": "A glamorous figure in high society, known for her charm and wit. Sylvia effortlessly navigates the social scene, often hosting lavish events and gathering the elite around her.",
    "privateSecret": "Feels betrayed by the victim for stealing her fiancé. Beneath her polished exterior lies a seething resentment that could erupt at any moment.",
    "motiveSeed": "The victim’s success and social standing overshadowed Sylvia, causing intense jealousy. The betrayal cut deep, and Sylvia's heart was a battlefield of emotions.",
    "motiveStrength": "moderate",
    "alibiWindow": "was at a charity luncheon across town during the murder, a plausible excuse that could shield her from suspicion.",
    "accessPlausibility": "unlikely",
    "stakes": "Her social standing and romantic prospects are jeopardized if her jealousy is revealed. The risk of losing her status in high society terrifies her.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Sylvia speaks with a refined elegance, often lacing her words with biting undertones. Her dialogue is peppered with clever quips that reveal her sharp wit and social awareness.",
    "signatureTic": "‘Oh darling, isn’t life just a delightful mess?’",
    "internalConflict": "Sylvia struggles with feelings of betrayal and jealousy, caught between her desire to maintain her social facade and the truth that threatens to unravel her.",
    "personalStakeInCase": "This crime matters to Sylvia because the potential exposure of her jealousy could dismantle the carefully constructed image she has built in society.",
    "paragraphs": [
      "Sylvia Trent glided through the charity luncheon, her presence commanding attention as she mingled with Brighton's elite. A glamorous socialite, she was the epitome of charm and sophistication, yet beneath the polished exterior lay a tempest of emotions. The recent murder of the victim, a woman she felt had betrayed her, sent shockwaves through her carefully curated world.",
      "In hushed conversations, Sylvia often reflected on how the victim had stolen her fiancé, a betrayal that cut deeper than any knife. The victim's success only served to amplify Sylvia's feelings of inadequacy, casting a shadow over her own accomplishments. Jealousy simmered just beneath the surface, a dangerous undercurrent that threatened to engulf her if left unchecked.",
      "Sylvia's speech was a dance of politeness and savagery, her words wrapped in layers of charm yet often laced with sharp critiques. She navigated social interactions with the finesse of a seasoned diplomat, but the tension within her was palpable. The fear of being exposed as envious gnawed at her, a secret that could dismantle her standing in high society.",
      "As the murder investigation unfolded, Sylvia faced a reckoning. The potential for her jealousy to be revealed loomed large, and she knew that her social standing was at stake. Would she be able to confront her feelings and reclaim her identity beyond the constraints of her social status, or would the truth of her emotions lead to her downfall?"
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a cunning hotel owner whose ambition drives him to skimming profits, but a murder investigation threatens to expose his misdeeds.",
    "publicPersona": "A shrewd businessman known for his ambition and charm. He is often seen as a charismatic leader in the hotel industry, admired for his business acumen.",
    "privateSecret": "He has been skimming profits and fears the victim could expose him. The weight of his deceit is a constant burden he carries.",
    "motiveSeed": "The victim discovered his financial misdeeds and threatened to go public, pushing him into a corner where desperation could lead to drastic measures.",
    "motiveStrength": "compelling",
    "alibiWindow": "was in a meeting with a supplier during the murder, a cover that could protect him if questioned.",
    "accessPlausibility": "unlikely",
    "stakes": "His business and financial future hinge on keeping his criminal activities hidden. The thought of losing everything he has built terrifies him.",
    "humourStyle": "blunt",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with straightforwardness, often cutting to the chase with little regard for decorum. His dialogue is marked by a sense of urgency, reflecting his ambitious nature.",
    "signatureTic": "‘Money talks, and I listen.’",
    "internalConflict": "Hugo grapples with the consequences of his greed, fearing that the truth of his actions will lead to his downfall.",
    "personalStakeInCase": "This crime matters to Hugo because the potential exposure of his financial misdeeds could jeopardize his entire business empire.",
    "paragraphs": [
      "Hugo Vane leaned against the polished mahogany of his hotel’s front desk, the weight of ambition heavy on his shoulders. A cunning businessman, he had built his empire on charm and shrewd decisions, yet beneath the surface lay a dark secret. The recent murder of the victim, who had threatened to expose his financial misdeeds, sent shockwaves through his carefully constructed world.",
      "In the business realm, Hugo was known for his straightforwardness, often cutting through the fluff to get to the heart of matters. Yet, the stakes had never been higher. The victim's threat loomed large, a specter that haunted him day and night. He knew that if the truth came to light, it would not only shatter his reputation but also dismantle everything he had worked for.",
      "As he navigated conversations with suppliers and staff, Hugo's bluntness was a double-edged sword. He had always prided himself on his ability to read people, but now, paranoia crept in. The fear of being discovered gnawed at him, forcing him to consider desperate measures to protect his interests. Every interaction felt like a game of chess, and he was acutely aware that one wrong move could lead to checkmate.",
      "With the murder investigation gaining momentum, Hugo faced a reckoning. The pressure to maintain his facade mounted, and he knew that the truth of his actions could come crashing down at any moment. Would he find a way to navigate this treacherous landscape without losing everything, or would his greed ultimately lead to his undoing?"
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seafront Grand Hotel",
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A glamorous Art Deco hotel overlooking the turbulent sea, harboring secrets behind its gleaming façade.",
    "visualDescription": "The hotel showcases a striking Art Deco design with geometric patterns, polished chrome details, and a sweeping entrance. Inside, a grand lobby with a sweeping staircase and ocean-facing windows sets a lavish tone, while narrow corridors lined with plush carpets lead to the guest rooms.",
    "atmosphere": "An air of elegance shrouded in tension, where every whisper holds a secret.",
    "paragraphs": [
      "The Seafront Grand Hotel stands as a monument of Art Deco elegance against the grey skies of Brighton, its polished chrome and glass façade reflecting the restless waves of the sea. Inside, the grand lobby invites guests to linger, with its sweeping staircase and plush velvet seating, though an undercurrent of suspicion weaves through the air. The scent of polished wood and saltwater mingles, creating an atmosphere both inviting and foreboding, as if the hotel itself harbors secrets within its walls.",
      "Soft murmurs and the crackling of old radios fill the lobby, where guests gather in small, tense groups, their conversations punctuated by nervous laughter. Each footstep echoes along the narrow corridors, amplifying the feeling of isolation as the storm clouds gather outside. The distant sound of waves crashing against the shore serves as a reminder of the storm brewing within the hotel, where every guest is a potential suspect.",
      "As the afternoon drags on, the hotel becomes a stage for intrigue, with the grand dining room filled with the clinking of silverware and hushed whispers. Outside, the ocean roars, but inside, the atmosphere is thick with unspoken words and hidden glances. The scent of rich food and dampness from the sea permeates the air, promising a night filled with unexpected revelations, as the hotel prepares to unveil the mysteries it holds."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with a chance of rain, typical for coastal areas in late spring.",
    "timeFlow": "Days of mounting tension, leading to a climactic revelation.",
    "mood": "Tense, with an undercurrent of suspicion among guests.",
    "eraMarkers": [
      "Radios playing soft music in guest rooms",
      "Early television flickering in the common areas",
      "Public address announcements about dinner times"
    ],
    "sensoryPalette": {
      "dominant": "Scent of salt and polished wood",
      "secondary": [
        "Distant crashing waves",
        "Muffled conversations and laughter"
      ]
    },
    "paragraphs": [
      "The lobby of The Seafront Grand Hotel is a cacophony of rich textures and muted colors, where the scent of salt and polished wood envelops guests as they enter. Overhead, the grand chandelier casts a warm glow, illuminating the intricate Art Deco details that adorn the walls. Outside, the ocean churns restlessly, mirroring the tension that hangs in the air, as guests exchange cautious glances amidst the soft hum of radios playing in the background.",
      "As the sun dips lower, the atmosphere shifts, with whispers of conspiracy filling the narrow corridors. The distant sound of waves crashing against the shore blends with the low murmurs of guests discussing the latest rumors, while the scent of damp sea air infiltrates the hotel, creating a sense of impending revelation. Each creak of the floorboards and flutter of curtains serves as a reminder that within these walls, secrets are waiting to be uncovered."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Oceanview Lounge",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A lavish lounge with sweeping ocean views, adorned with plush furniture and rich draperies.",
      "sensoryDetails": {
        "sights": [
          "glistening ocean through large windows",
          "luxurious velvet armchairs",
          "art deco chandeliers casting shadows",
          "dark wood bar with polished brass fittings"
        ],
        "sounds": [
          "whispers of guests at tables",
          "ice clinking in glasses",
          "soft jazz playing on the radio",
          "waves crashing against the rocks"
        ],
        "smells": [
          "scent of aged whiskey",
          "freshly polished wood",
          "sea salt and dampness",
          "cigarette smoke lingering in corners"
        ],
        "tactile": [
          "cool leather armrests",
          "soft velvet under fingertips",
          "chill from the ocean breeze",
          "smooth glass of a cocktail"
        ]
      },
      "accessControl": "Open to guests during operating hours; staff only after hours for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "glossy rain-soaked windows",
            "grey light filtering in",
            "water droplets sliding down glass",
            "clouds hanging low over the sea"
          ],
          "sounds": [
            "steady rain tapping against windows",
            "muffled conversations echoing",
            "the distant rumble of thunder",
            "soft jazz barely audible"
          ],
          "smells": [
            "damp wood and mildew",
            "fresh rain on the ocean",
            "wet stone and salt air",
            "lingering scent of cigars"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "dark clouds looming outside",
            "silhouettes of guests against the windows",
            "empty glasses on tables"
          ],
          "sounds": [
            "the ticking of a clock",
            "soft laughter turning anxious",
            "a distant crash of waves",
            "the rustle of newspapers"
          ],
          "smells": [
            "dust mingling with sea air",
            "pungent scent of whiskey",
            "freshly brewed coffee",
            "hint of burnt toast from the kitchen"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset reflecting on water",
            "glowing lights of the lounge",
            "long shadows stretching across the floor",
            "glimmer of stars beginning to appear"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "laughter carrying from outside",
            "the soft clinking of glasses",
            "a distant band playing music"
          ],
          "smells": [
            "scent of fresh seafood",
            "warmth of baked bread",
            "citrus from cocktails",
            "the salty breeze wafting in"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanview Lounge, with its plush velvet seating and sweeping views of the churning sea, serves as the backdrop for the unfolding drama. The glistening ocean reflects the dim light of the chandeliers, while the scent of aged whiskey mingles with the salty air, creating an intoxicating atmosphere. Guests gather in hushed tones, their eyes darting toward the bar, where the tension thickens as the evening progresses. Each whisper seems to echo, bouncing off the dark wood and plush furnishings, amplifying the sense of unease.",
        "As the evening wears on, the lounge transforms into a stage for secrets, with every shadow hiding a potential clue. The sound of ice clinking in glasses punctuates the air, blending with the distant crash of waves, creating a symphony of tension. The scent of fresh seafood wafts through from the dining room, but it does little to quell the mystery brewing within the walls of the hotel, where every guest is a suspect and every glance holds the weight of suspicion."
      ]
    },
    {
      "id": "library",
      "name": "The Grand Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A dark, wood-paneled room filled with leather-bound books and comfortable reading nooks.",
      "sensoryDetails": {
        "sights": [
          "tall shelves of dusty books",
          "flickering candlelight",
          "ornate furniture with rich upholstery",
          "stacks of newspapers on tables"
        ],
        "sounds": [
          "soft rustle of pages",
          "the ticking of an old clock",
          "distant thunder rumbling",
          "the crackle of a fire in the hearth"
        ],
        "smells": [
          "musty scent of old books",
          "smoky aroma of burning wood",
          "hint of polished mahogany",
          "subtle fragrance of leather"
        ],
        "tactile": [
          "smooth leather book covers",
          "cool wooden desk surface",
          "soft woolen throw blankets",
          "the chill of drafty corners"
        ]
      },
      "accessControl": "Accessible to guests during the day; locked at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops tracing patterns on windows",
            "grey light filtering through glass",
            "clouds casting shadows inside",
            "pages dampened by humidity"
          ],
          "sounds": [
            "steady patter of rain",
            "muffled conversations from outside",
            "occasional thunderclap",
            "the crackle of the fire"
          ],
          "smells": [
            "dampness mingling with old paper",
            "the earthy scent of rain-soaked wood",
            "fresh coffee brewing nearby",
            "the musty odor of forgotten tomes"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "dust motes dancing in the air",
            "faded photographs on the walls",
            "the glow of a desk lamp"
          ],
          "sounds": [
            "the ticking clock marking time",
            "soft footsteps on the carpet",
            "the rustle of a newspaper",
            "the snap of a book closing"
          ],
          "smells": [
            "the scent of old ink",
            "faint whiff of tobacco",
            "the sweetness of dried flowers",
            "the tang of fresh paper"
          ],
          "mood": "reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light from the fireplace",
            "shadows stretching across the floor",
            "a cozy reading nook inviting exploration",
            "the glow of a table lamp illuminating a book"
          ],
          "sounds": [
            "the crackle of the fire",
            "soft murmurs of guests",
            "the flutter of pages turning",
            "the distant sound of laughter"
          ],
          "smells": [
            "the rich scent of burning wood",
            "the aroma of fresh coffee",
            "the musk of leather bindings",
            "the sweetness of pastries from the kitchen"
          ],
          "mood": "cozy warmth"
        }
      ],
      "paragraphs": [
        "The Grand Library, with its dark wood paneling and shelves overflowing with leather-bound volumes, invites guests into a world of secrets. Flickering candlelight dances across the spines of books, casting shadows that seem to whisper forgotten tales. The air is thick with the musty scent of old paper and polished mahogany, creating an atmosphere that feels both comforting and eerily introspective. Here, amongst the stacks, guests find refuge from the tension outside, but the weight of unspoken truths lingers in the air.",
        "As a storm brews outside, the soft rustling of pages turning fills the room, mingling with the distant rumble of thunder. The crackle of the fire provides warmth, while the ticking clock marks the passage of time, reminding all that secrets cannot remain hidden forever. With every creak of the floorboards, the library stands as a silent witness to the unfolding drama, where every book may hold a clue to the mystery that envelops the hotel."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Grand Dining Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "An expansive room with large windows overlooking the sea, elegantly set tables, and art deco décor.",
      "sensoryDetails": {
        "sights": [
          "large windows framing the ocean view",
          "art deco murals on the walls",
          "crystal chandeliers illuminating the space"
        ],
        "sounds": [
          "clinking of cutlery on plates",
          "murmurs of conversation",
          "the rustle of tablecloths",
          "the occasional laughter of guests"
        ],
        "smells": [
          "aroma of freshly baked bread",
          "scent of roasted meats",
          "hint of wine swirling in glasses",
          "fresh flowers adorning the tables"
        ],
        "tactile": [
          "smooth linen tablecloths",
          "cold glass of wine",
          "warmth of freshly baked rolls",
          "the coolness of silverware"
        ]
      },
      "accessControl": "Open for breakfast, lunch, and dinner; closed for private events.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops trickling down window panes",
            "grey light spilling into the room",
            "empty tables awaiting guests",
            "the reflection of clouds in water"
          ],
          "sounds": [
            "soft pitter-patter of rain",
            "muffled laughter from the lobby",
            "the sound of a coffee pot pouring"
          ],
          "smells": [
            "scent of brewing coffee",
            "the warmth of baked pastries",
            "freshly squeezed juice",
            "the tang of wet earth outside"
          ],
          "mood": "somber anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows on tables",
            "clouds obscuring the sun",
            "waitstaff moving quietly between tables",
            "a solitary flower arrangement in the center"
          ],
          "sounds": [
            "the soft rustle of napkins",
            "the distant sound of waves crashing",
            "the murmur of conversations rising and falling"
          ],
          "smells": [
            "the aroma of simmering sauces",
            "the scent of fresh herbs",
            "the sweetness of desserts being prepared",
            "the tang of citrus in the air"
          ],
          "mood": "tense quiet"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset spilling through windows",
            "tables adorned with flickering candles",
            "glimmering silverware catching the light",
            "guests in evening attire laughing"
          ],
          "sounds": [
            "the clink of glasses raised in toast",
            "soft music playing in the background",
            "laughter echoing off the walls",
            "the sound of chairs scraping on the floor"
          ],
          "smells": [
            "the rich scent of roasted meats",
            "sweet aroma of desserts",
            "freshly baked bread wafting",
            "the fragrance of wine filling the air"
          ],
          "mood": "celebratory tension"
        }
      ],
      "paragraphs": [
        "The Grand Dining Room, with its expansive windows overlooking the tumultuous sea, is a sight to behold. Each table is elegantly set with fine china and crystal glassware, while the art deco murals add a touch of glamour to the ambiance. As guests gather for meals, the sounds of clinking cutlery and murmured conversations create a lively atmosphere, yet there is a palpable tension in the air, as if each guest is acutely aware of the secrets they carry.",
        "As the evening progresses, the golden light from the sunset spills through the windows, casting a warm glow over the dining room. The aroma of roasted meats and freshly baked bread fills the air, mingling with the laughter of guests. Yet, beneath the celebratory surface, an undercurrent of anxiety flows, as the hotel prepares to reveal its dark secrets, and every bite of food feels like a step deeper into the mystery."
      ]
    },
    {
      "id": "staff_area",
      "name": "The Staff Quarters",
      "type": "interior",
      "purpose": "Restricted area for staff",
      "visualDetails": "A utilitarian space with simple furnishings, located away from guest areas.",
      "sensoryDetails": {
        "sights": [
          "plain wooden furniture",
          "faded photographs on the walls",
          "locked cabinets for supplies",
          "stacked linens in the corner"
        ],
        "sounds": [
          "soft chatter among staff members",
          "the rustle of uniforms being adjusted",
          "the creaking of floorboards",
          "the distant clatter of dishes"
        ],
        "smells": [
          "scent of laundry detergent",
          "faint aroma of food cooking",
          "the mustiness of unventilated space",
          "the tang of cleaning supplies"
        ],
        "tactile": [
          "rough texture of uniforms",
          "cool metal of doorknobs",
          "soft fabric of linens",
          "the chill of drafty corners"
        ]
      },
      "accessControl": "Restricted to hotel staff only; no guest access allowed.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through small windows",
            "water droplets clinging to glass",
            "staff hurriedly preparing for the day",
            "a mop leaning against the wall"
          ],
          "sounds": [
            "the soft patter of rain outside",
            "the clatter of plates being stacked",
            "hushed voices discussing tasks",
            "the creak of a door opening"
          ],
          "smells": [
            "freshly laundered linens",
            "the scent of coffee brewing",
            "the tang of cleaning products",
            "the earthy aroma of wet pavement outside"
          ],
          "mood": "hasty urgency"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "staff moving quickly between tasks",
            "the flicker of overhead lights"
          ],
          "sounds": [
            "the sound of footsteps echoing",
            "the rustle of papers",
            "the distant sound of laughter from guests",
            "the soft hum of conversation"
          ],
          "smells": [
            "the scent of cleaning products",
            "the aroma of food being prepared",
            "the mustiness of the room",
            "the faint odor of dampness"
          ],
          "mood": "busy tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light spilling from the kitchen",
            "staff relaxing after a long day",
            "the glow of a single bulb overhead",
            "the reflection of moonlight outside"
          ],
          "sounds": [
            "the distant laughter of guests",
            "the clink of dishes being washed",
            "the soft chatter of staff unwinding"
          ],
          "smells": [
            "the scent of the evening meal",
            "the comforting aroma of baked goods",
            "the freshness of evening air",
            "the tang of citrus from cleaning supplies"
          ],
          "mood": "relaxed camaraderie"
        }
      ],
      "paragraphs": [
        "The Staff Quarters, tucked away from the guests' prying eyes, are a stark contrast to the opulence of the hotel. Simple wooden furniture fills the space, adorned with faded photographs of past staff members who once walked the same halls. The scent of laundry detergent lingers in the air, mingling with the faint aroma of food cooking from the kitchen. Here, staff members share whispers and laughter, but the tension remains palpable as they navigate the secrets surrounding the hotel.",
        "As the evening approaches, the atmosphere shifts, with staff members unwinding after a long day. The soft chatter and laughter echo in the quarters, providing a brief respite from the tension that permeates the hotel. Yet, even in this sanctuary, the weight of hidden truths hangs heavy, reminding them that their lives are intricately woven into the fabric of the mystery that unfolds around them."
      ]
    }
  ],
  "note": "",
  "cost": 0.002828595,
  "durationMs": 40220
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1946,
    "month": "June",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "overcast skies",
      "increased humidity",
      "light rain showers expected"
    ],
    "daylight": "Long summer evenings with twilight stretching into late hours, daylight fading around nine o'clock.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests unwind after dinner.",
    "holidays": [
      "Flag Day (June 14)"
    ],
    "seasonalActivities": [
      "beach outings on sunny days",
      "evening strolls along the boardwalk",
      "attending local fairs or carnivals"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "lightweight linen suits",
        "narrow ties made of silk",
        "button-up dress shirts with French cuffs"
      ],
      "casual": [
        "short-sleeved cotton shirts",
        "khaki trousers",
        "deck shoes"
      ],
      "accessories": [
        "fedora hats",
        "leather belts",
        "wristwatches with metal bands"
      ]
    },
    "womensWear": {
      "formal": [
        "sundresses with floral prints",
        "short-sleeved blouses with high-waisted skirts",
        "lightweight evening gowns"
      ],
      "casual": [
        "capri pants",
        "cotton blouses",
        "cardigans"
      ],
      "accessories": [
        "straw hats adorned with ribbons",
        "pearl necklaces",
        "sunglasses with oversized frames"
      ]
    },
    "trendsOfTheMoment": [
      "rise of the 'New Look' silhouette by Dior",
      "popularity of bold prints",
      "influence of Hollywood glamour on everyday fashion"
    ],
    "socialExpectations": [
      "women expected to manage both home and work",
      "men encouraged to return to traditional roles",
      "social gatherings focused on maintaining appearances"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the United Nations is actively involved in post-war recovery efforts",
      "the Nuremberg Trials are ongoing, emphasizing justice for war crimes",
      "strikes in various industries as workers demand better wages"
    ],
    "politicalClimate": "Tensions remain high due to cold war beginnings, with the U.S. taking a leading role in European recovery.",
    "economicConditions": "The economy is beginning to stabilize but is still marked by inflation and shortages in some goods.",
    "socialIssues": [
      "debate over civil rights and racial equality",
      "growing awareness of women's rights in the workplace",
      "the struggle of veterans reintegrating into civilian life"
    ],
    "internationalNews": [
      "tensions in Korea as the U.S. and Soviet Union assert influence",
      "rebuilding efforts in Europe continue under the Marshall Plan"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'It's Been a Long, Long Time'",
        "The Ink Spots' 'I Don't Want to Set the World on Fire'",
        "Duke Ellington's big band music"
      ],
      "films": [
        "'The Best Years of Our Lives'",
        "'It's a Wonderful Life'",
        "'Notorious'"
      ],
      "theater": [
        "'Annie Get Your Gun'",
        "'The King and I'",
        "'Carousel'"
      ],
      "radio": [
        "Fibber McGee and Molly",
        "The Jack Benny Program",
        "The Shadow"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Stranger' by Albert Camus",
        "'The Glass Menagerie' by Tennessee Williams",
        "'The Catcher in the Rye' by J.D. Salinger"
      ],
      "popularGenres": [
        "detective fiction",
        "romantic novels",
        "post-war literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "commercial television broadcasts begin to gain popularity",
        "the introduction of the electric washing machine",
        "automobiles featuring automatic transmission"
      ],
      "commonDevices": [
        "radios in every home",
        "early television sets in common areas",
        "public address systems in venues"
      ],
      "emergingTrends": [
        "increased availability of consumer goods",
        "growth of suburban living",
        "advent of mass media shaping public opinion"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: two pence",
        "Movie ticket: one shilling"
      ],
      "commonActivities": [
        "going to the beach on weekends",
        "attending community picnics",
        "visiting local fairs or dances"
      ],
      "socialRituals": [
        "weekly family dinners",
        "neighborhood block parties",
        "Sunday church services"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing class mobility for some, while others remain entrenched in poverty",
      "a growing middle class begins to emerge"
    ],
    "gender": [
      "women are increasingly seen in the workforce, yet traditional gender roles persist",
      "expectations for domesticity still loom for many women"
    ],
    "race": [
      "racial tensions are prevalent, especially in urban areas",
      "the beginning of the Civil Rights Movement is subtly emerging"
    ],
    "generalNorms": [
      "family-oriented values dominate social life",
      "an emphasis on propriety and decorum in public settings",
      "social events serve as status markers"
    ]
  },
  "atmosphericDetails": [
    "The scent of saltwater mixed with the faint aroma of popcorn wafts through the hotel lobby as guests mingle, their voices a low hum against the backdrop of the radio playing soft jazz.",
    "The air is thick with humidity, and the distant rumble of thunder hints at an impending summer storm, raising the tension among the hotel guests, as whispers of secrets and suspicions linger in every corner.",
    "Outside, the flickering neon lights of the boardwalk amusements reflect off wet pavement, casting an eerie glow that contrasts with the warm, inviting interiors of the hotel, where the tension is palpable."
  ],
  "paragraphs": [
    "In June 1946, the coastal hotel buzzes with energy, yet beneath the cheerful facade lies an atmosphere fraught with unease. Overcast skies loom above, a harbinger of the rain that might soon fall, while the sounds of the ocean crash rhythmically against the shore. Guests, still recovering from the war's aftermath, are drawn to the hotel's common areas, where they share stories of loss and hope over drinks, their laughter punctuated by the occasional somber note of remembrance. With Flag Day just passed, a sense of national pride persists, even as looming clouds might threaten the day’s festivities.",
    "Fashion during this summer is a reflection of the times, with men opting for lightweight linen suits that breathe against the humid air, while women adorn themselves in floral sundresses that flutter around their knees. Accessories such as pearl necklaces and straw hats complete the ensemble, showcasing a post-war desire to return to elegance and normalcy. Yet, the tension is evident in the way these outfits are worn—hastily put together, as if to mask deeper anxieties. The hotel’s guests are dressed for leisure, but their minds are occupied with the shadows of their recent pasts.",
    "Daily life in the hotel is a microcosm of broader societal shifts—families gather for meals, while workers return from nearby factories, their clothing stained with the evidence of hard labor. Prices are still reasonable, with bread at four pence and movie tickets at one shilling, but the threat of inflation is ever-present. As guests engage in social rituals like community picnics and block parties, they navigate the complexities of post-war life, grappling with the remnants of old societal norms while inching toward a more modern era. The evening air is thick with the promise of rain, a perfect backdrop for the mysterious events waiting to unfold within the hotel's walls."
  ],
  "note": "",
  "cost": 0.0011148835499999999,
  "durationMs": 11856
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense gathering at a seaside hotel for a post-war reunion reveals deep-seated rivalries and secrets among the guests, as social pressures from class disparities and shifting gender roles create a volatile atmosphere.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Post-war recovery mindset with women entering the workforce, leading to class stratification and heightened social tensions."
  },
  "setting": {
    "location": "A seaside hotel with Art Deco architecture",
    "institution": "Hotel",
    "weather": "Overcast with a chance of rain, typical for coastal areas in late spring."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a delayed-action poison method, where the toxicology and dosage timing conceal when the fatal dose was actually administered."
}

### LOCKED_FACTS
[
  {
    "id": "temperature_drop",
    "value": "forty-eight degrees Fahrenheit",
    "description": "The temperature at which the poison activates."
  },
  {
    "id": "activation_time",
    "value": "two hours",
    "description": "The time required for the toxin to become lethal after exposure to low temperatures."
  },
  {
    "id": "time_of_death",
    "value": "midnight",
    "description": "The approximate time of death that aligns with the temperature drop."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 15,
  "countsByPlacement": {
    "early": 4,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 14,
    "optional": 1
  },
  "redHerringCount": 0,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    }
  ]
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
