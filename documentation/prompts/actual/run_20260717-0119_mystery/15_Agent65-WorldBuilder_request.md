# Actual Prompt Record

- Run ID: `mystery-1784251155946`
- Project ID: ``
- Timestamp: `2026-07-17T01:22:42.270Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `0ab44ee8a7908191`

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
    "title": "The Clock of Deceit",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A grand seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charming socialite",
      "private_secret": "Involved in a clandestine affair",
      "motive_seed": "Jealousy",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Social reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Friend of the victim"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Had a feud with the victim",
      "motive_seed": "Professional rivalry",
      "motive_strength": "medium",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Medical supplies"
      ],
      "behavioral_tells": [
        "Nervous when questioned"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Acquaintance of the victim"
      ],
      "public_persona": "Retired naval officer",
      "private_secret": "Owes money to the victim",
      "motive_seed": "Financial desperation",
      "motive_strength": "low",
      "alibi_window": "7 PM to 9 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Personal items"
      ],
      "behavioral_tells": [],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [
        "Friend of the victim"
      ],
      "public_persona": "Aspiring actress",
      "private_secret": "Infatuated with the victim's lover",
      "motive_seed": "Jealousy",
      "motive_strength": "medium",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Theater props"
      ],
      "behavioral_tells": [
        "Fidgeting when lying"
      ],
      "stakes": "Love interest",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Rival to the victim"
      ],
      "public_persona": "Socialite",
      "private_secret": "Has hidden ties to the victim",
      "motive_seed": "Rivalry",
      "motive_strength": "high",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Guest room access"
      ],
      "behavioral_tells": [],
      "stakes": "Social reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [
        "Friend of the victim"
      ],
      "public_persona": "Private investigator",
      "private_secret": "Has a crush on the victim",
      "motive_seed": "Desire for justice",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
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
      "summary": "In a grand seaside hotel, Eleanor Voss is found strangled, with her death staged by a tampered clock to throw suspicion upon her friends. As detective Hugo Vane navigates the tangled web of motives, he must uncover the truth hidden behind a false timeline."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, dining, and minut to expose the false timing.",
      "delivery_path": [
        {
          "step": "The murderer rewound the hotel clock to create a false timeline."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor's death appears to have occurred much earlier than it actually did."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss died at ten minutes to eight.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock in the dining room shows the time as ten minutes to eight.",
    "what_it_hides": "The actual time of death was much later, after the clock was tampered with."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch was seen arguing with Eleanor earlier in the evening.",
      "Her access to medical supplies makes her a suspect."
    ],
    "the_one_flaw": "Dr. Finch was attending to a patient in another room at the time of the murder, verified by a witness.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A bloody handkerchief found in Dr. Finch's bag.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The handkerchief belonged to a patient she treated earlier.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Witnesses report seeing Beatrice Quill near the scene.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "Beatrice was simply looking for Eleanor to invite her to a show.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "rationale": "All suspects were present at the hotel during the time of the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The time on the clock at the dining room"
      ],
      "windows": [
        "8 PM to 9 PM"
      ],
      "contradictions": [
        "Witnesses heard the clock strike at different intervals."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Sylvia Trent"
      ],
      "objects": [
        "The tampered clock",
        "The victim's room"
      ],
      "permissions": [
        "All suspects had access to the dining room."
      ]
    },
    "physical": {
      "laws": [
        "A mechanical clock can only show one time at a time."
      ],
      "traces": [
        "Scratches on the clock casing."
      ]
    },
    "social": {
      "trust_channels": [
        "The hotel's staff",
        "Acquaintances of the victim"
      ],
      "authority_sources": [
        "Hotel management"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the dining room shows the time as ten minutes to eight.",
        "correction": "The clock has been tampered with to mislead the time of death.",
        "effect": "Narrows constraint to the time of death being later than indicated.",
        "required_evidence": [
          "The clock in the dining room",
          "Witnesses recall hearing the clock strike at different times"
        ],
        "reader_observable": true
      },
      {
        "observation": "Scratches on the clock casing indicate recent tampering.",
        "correction": "The clock was altered to mislead the investigation.",
        "effect": "Eliminates the assumption that Eleanor died at ten minutes to eight.",
        "required_evidence": [
          "Scratches on the clock casing",
          "Witnesses heard the clock strike at different times"
        ],
        "reader_observable": true
      },
      {
        "observation": "An old newspaper article found in Eleanor's room mentions an event occurring at the staged time of death.",
        "correction": "The article shows a discrepancy with the tampered clock's time.",
        "effect": "Narrows down that the murder was staged around a false timeline.",
        "required_evidence": [
          "The old newspaper article",
          "Witness statements about the event"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Compare the clock's time with the witness statements about when they heard it strike.",
    "knowledge_revealed": "The inconsistencies indicate the clock was tampered with.",
    "pass_condition": "If the time on the clock and witness statements do not match, it reveals the deception.",
    "evidence_clues": [
      "clue_11",
      "clue_3",
      "clue_5"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time and witness statements allow the reader to see the first inconsistency. Step 2: The scratches reveal tampering, removing the assumption of the time of death. Step 3: The newspaper article exposes the motive for staging the timeline."
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
        "Observe the culprit's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": ""
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified by hotel staff.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness confirms she was at the theater.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness confirms she was with another guest.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Found in the victim's room"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
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
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, the charismatic hotel manager, is a woman torn between her polished public persona and the crumbling financial reality of her establishment.",
    "publicPersona": "Charismatic and efficient, known for her hospitality and organizational skills.",
    "privateSecret": "Struggling with financial instability due to the hotel's declining reputation.",
    "motiveSeed": "Wants to maintain control over the hotel and fears losing it if the victim's inheritance is revealed.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in her office at the time of the murder, but could have left unnoticed.",
    "accessPlausibility": "easy",
    "stakes": "If the victim's will is executed, she stands to lose her position and livelihood.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a polished, yet occasionally sharp tone, her words carefully chosen to maintain her authority. She often employs rhetorical questions to assert her point, revealing her strategic thinking.",
    "signatureTic": "‘Isn’t it just delightful how life unfolds?’",
    "internalConflict": "Eleanor grapples with a profound fear of failure, haunted by the thought of losing her family's legacy and the hotel that has been her life’s work.",
    "personalStakeInCase": "This crime is not just about her professional reputation; it represents her very identity and livelihood, as the hotel is the last remnant of her family's legacy.",
    "paragraphs": [
      "Eleanor Voss is a woman of contradictions. On the surface, she presents herself as the epitome of grace and efficiency, her smile a mask for the chaos that brews beneath. Managing the grand seaside hotel has become both her passion and her prison. With every guest she welcomes, she fights a silent battle against the creeping shadows of financial ruin. The hotel, once a jewel of the coast, is now teetering on the edge of collapse, and Eleanor feels the pressure to maintain her facade even as her world crumbles.",
      "Despite her charm, Eleanor's heart races at the thought of the victim's inheritance potentially revealing her own financial instability. The idea of losing control over the hotel fuels her desperation. She knows that if the victim's will is executed, her life’s work could slip through her fingers. Her public persona as the warm and inviting manager masks a fierce determination to protect her territory at any cost. Every interaction is a chess match, and Eleanor is determined to be the last one standing.",
      "In the moments when she is alone, Eleanor allows herself a glimpse of the truth: the hotel is not just a business; it’s her sanctuary, a connection to her past. Memories of laughter and family gatherings echo through the halls, but they are now overshadowed by the threat of financial ruin. Eleanor's internal conflict gnaws at her, a constant reminder of her failures and fears. She feels as if she is standing on the precipice, teetering between the life she has built and the abyss of obscurity that awaits her.",
      "As the investigation unfolds, Eleanor's dry wit emerges as a shield against the mounting tension. She uses humor to deflect inquiries and keep others at bay, but inside, she is a tempest of anxiety and regret. She must confront not only the secrets she has kept but also the choices that have led her to this moment. The clock of deceit is ticking, and Eleanor knows that time is running out to save herself and the hotel she has fought so hard to protect."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a dedicated physician, finds her moral compass challenged as her past affair with the victim threatens to unravel her life.",
    "publicPersona": "Respected and caring doctor, known for her dedication to her patients.",
    "privateSecret": "Had an affair with the victim, which could damage her reputation.",
    "motiveSeed": "Fear of being exposed for the affair and losing her medical license.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was at the hospital during the murder but has no receipts to confirm her presence.",
    "accessPlausibility": "possible",
    "stakes": "Her career and reputation are at risk if the affair is disclosed.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a measured tone, often pausing to choose her words carefully. Her sentences are laced with a hint of sarcasm, revealing her underlying tension as she navigates the emotional landscape of her past.",
    "signatureTic": "‘Isn’t it ironic how life has a way of biting back?’",
    "internalConflict": "Dr. Finch struggles with guilt over her affair and the potential consequences it could have on her career, leaving her torn between her professional ethics and personal desires.",
    "personalStakeInCase": "This crime is deeply personal for Mallory, as it threatens not just her career but her integrity as a physician, forcing her to confront the choices she made.",
    "paragraphs": [
      "Dr. Mallory Finch stands at the crossroads of her life, a respected physician whose dedication to her patients is overshadowed by a secret that could shatter her reputation. The affair with the victim was a moment of passion that spiraled into a web of deception, and now the repercussions loom large over her professional future. Mallory’s public persona is that of a caring doctor, but beneath the surface lies a turmoil that she can no longer ignore.",
      "As the investigation unfolds, Mallory’s observational humor serves as a coping mechanism. She often finds herself making sardonic comments about the absurdities of life, especially when faced with the reality of her situation. Yet, each laugh is tinged with bitterness, a reminder of the choices she made and the potential fallout. Her alibi, a visit to the hospital, hangs by a thread, and the fear of exposure gnaws at her insides like a relentless predator.",
      "Mallory’s internal conflict intensifies as she grapples with guilt and the fear of losing her medical license. The thought of being branded a hypocrite in the eyes of her colleagues is unbearable, and yet she feels a strange sense of liberation in acknowledging her flaws. The affair, while reckless, was also a reflection of her yearning for connection in a world that often feels cold and clinical. Now, she must confront the consequences of her actions and decide what she truly values.",
      "As she navigates the treacherous waters of the investigation, Mallory finds herself questioning her priorities. Is her career worth sacrificing her integrity? The clock is ticking, and she knows that the truth will eventually come to light. With each passing moment, the weight of her secret becomes heavier, and she must decide whether to embrace her past or let it destroy her future."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, faces the demons of his past as his gambling addiction threatens to unravel his carefully constructed life.",
    "publicPersona": "A stoic leader with a commendable record, respected by his peers.",
    "privateSecret": "Hiding a gambling addiction that has led him into debt.",
    "motiveSeed": "Desperate to pay off his debts, he fears the victim's inheritance will expose his troubles.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be on a walk along the beach during the murder.",
    "accessPlausibility": "possible",
    "stakes": "His personal debts could ruin his reputation and future.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks with a deliberate cadence, his words often laced with a sense of irony. He occasionally employs self-deprecating humor, using it to diffuse tension and mask his vulnerabilities.",
    "signatureTic": "‘Well, that’s the sea for you—unpredictable and often unforgiving.’",
    "internalConflict": "Ivor is torn between his past as a respected officer and the shame of his present, struggling with the weight of his gambling addiction and the fear of being exposed.",
    "personalStakeInCase": "This crime threatens to expose his gambling debts, putting his reputation as a leader at risk and forcing him to confront the reality of his choices.",
    "paragraphs": [
      "Captain Ivor Hale, a man once revered for his bravery, now finds himself adrift in a sea of regret. The stoic exterior he presents to the world is a fragile facade, masking the turmoil of his gambling addiction that has ensnared him in a web of debt. Though he carries the title of a retired naval officer with pride, the reality of his situation is a far cry from the commendable record he once held. Ivor’s life has become a delicate balancing act, and the stakes have never been higher.",
      "Ivor’s self-deprecating humor often surfaces in conversations, a way to deflect attention from the shadows lurking in his past. He speaks of the unpredictability of the sea, drawing parallels to his own life, but beneath the jest lies a profound sadness. Each gamble he takes is a desperate attempt to regain control, yet it only deepens his despair. The victim's inheritance looms over him like a storm cloud, threatening to expose his struggles and unravel the last remnants of his dignity.",
      "As the investigation unfolds, Ivor's internal conflict becomes more pronounced. He grapples with the shame of his addiction, torn between the man he once was and the failure he has become. The thought of being outed as a gambler is a nightmare he cannot bear. He knows that if the truth surfaces, it will shatter not only his reputation but also the respect of those who look up to him. The weight of his choices is a constant reminder of the man he wishes to be versus the man he has become.",
      "In the face of adversity, Ivor must confront his demons head-on. The clock is ticking, and each passing moment brings him closer to the truth being revealed. He knows that redemption is not easily won, but perhaps this case offers him a chance to reclaim his honor. As he navigates the treacherous waters of the investigation, Ivor must find the courage to confront his past mistakes and seek a path toward redemption before it’s too late."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a vibrant artist, struggles with the confines of her financial dependency on the victim, yearning for independence in her craft.",
    "publicPersona": "A vibrant and ambitious artist known for her unique style.",
    "privateSecret": "Has been financially backed by the victim, leading to feelings of indebtedness.",
    "motiveSeed": "Felt trapped in a controlling agreement with the victim that limited her artistic freedom.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be in her room painting, but had no witnesses.",
    "accessPlausibility": "possible",
    "stakes": "Her artistic career hinges on breaking free from the victim's shadow.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively, animated tone, often punctuating her sentences with bursts of enthusiasm. Her sardonic wit reveals her frustration with her circumstances and her desire to break free.",
    "signatureTic": "‘Art is supposed to set you free, but it feels more like a cage sometimes.’",
    "internalConflict": "Beatrice wrestles with feelings of indebtedness to the victim, torn between gratitude for the support and resentment for the constraints it has placed on her creativity.",
    "personalStakeInCase": "This crime is pivotal for Beatrice, as it represents her chance to reclaim her artistic autonomy and redefine her career outside the victim's influence.",
    "paragraphs": [
      "Beatrice Quill is a whirlwind of color and creativity, yet beneath her vibrant exterior lies a turmoil that threatens to stifle her artistic spirit. Known for her unique style, she has garnered attention in the art world, but it comes at a price. Financially backed by the victim, Beatrice feels the weight of indebtedness hanging over her like a dark cloud. The support that once felt like a lifeline has transformed into a binding contract, limiting her freedom to express herself fully.",
      "Her sardonic humor is a defense mechanism, often surfacing in her conversations as a way to mask the frustration she feels toward her situation. Beatrice’s words dance with irony, reflecting her struggle to break free from the constraints imposed by the victim. She longs for artistic independence, yet the ties that bind her also offer a semblance of security in a world rife with uncertainty. The murder brings with it a twisted sense of hope—perhaps this is her chance to finally step out of the shadows.",
      "As the investigation unfolds, Beatrice finds herself at a crossroads. The stakes are high; if the victim’s will is executed, she could lose the opportunity to redefine her artistic career. The thought of being trapped in a controlling agreement makes her skin crawl, and she is determined to assert her independence, even if it means facing the consequences of her actions. Her internal conflict grows as she grapples with gratitude and resentment, questioning whether the support she once cherished has become a gilded cage.",
      "In the midst of chaos, Beatrice must confront her fears and embrace her true artistic vision. The clock of deceit ticks on, and with each passing moment, she realizes that her future hinges on the truth of the victim’s death. Will she seize the opportunity to liberate herself, or will she remain shackled to a past that no longer serves her? As the investigation unfolds, Beatrice must navigate the treacherous waters of ambition, identity, and the cost of freedom."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, an ambitious journalist, finds herself caught between her quest for truth and the moral implications of exposing the victim's secrets.",
    "publicPersona": "An ambitious journalist known for her investigative articles.",
    "privateSecret": "Has been researching the victim’s past, uncovering damaging secrets.",
    "motiveSeed": "Wanted the victim's story to expose corruption and boost her career.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be interviewing witnesses in the lobby during the murder.",
    "accessPlausibility": "unlikely",
    "stakes": "Her career depends on this story, but the victim could ruin her plans.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Sylvia speaks in a direct and unembellished manner, often cutting to the chase without unnecessary pleasantries. Her bluntness reflects her determination, but also her internal conflict about the morality of her pursuit.",
    "signatureTic": "‘The truth is rarely pretty, but it’s the only thing worth chasing.’",
    "internalConflict": "Sylvia is torn between her ambition and her conscience, grappling with the potential harm her exposure of the victim's secrets could cause to others.",
    "personalStakeInCase": "This crime is pivotal for Sylvia, as it represents her chance to advance her career, but at the risk of damaging the lives of those involved.",
    "paragraphs": [
      "Sylvia Trent is a journalist driven by ambition, her sights set on uncovering the truth no matter the cost. Her public persona is that of a relentless investigator, known for her hard-hitting articles that expose corruption and injustice. However, beneath the tough exterior lies a woman grappling with the moral implications of her pursuits. The victim’s secrets, which she has been diligently researching, hold the key to a story that could catapult her career, but at what price?",
      "Sylvia’s blunt speech reflects her determination to cut through the noise and get to the heart of the matter. She rarely indulges in small talk, preferring to dive straight into the facts. Yet, as the investigation unfolds, she finds herself questioning the ethics of her ambition. The thought of potentially harming others in her quest for the truth weighs heavily on her conscience, creating an internal conflict that she cannot ignore. The clock is ticking, and she must decide whether to pursue the story or protect those who may be affected.",
      "As she interviews witnesses and pieces together the puzzle, Sylvia’s drive for success clashes with her sense of morality. The stakes are high; the victim's secrets could destroy lives, and she is left to grapple with the consequences of her actions. The allure of a headline-grabbing story is intoxicating, but she knows that the truth is rarely pretty. Each revelation comes with a cost, and she must weigh her ambition against the potential fallout.",
      "In the end, Sylvia must confront the shadows of her own ambition. The case becomes not just about the victim’s secrets but also about her own integrity. As the investigation unfolds, she is forced to reflect on what it truly means to be a journalist and the responsibilities that come with the pursuit of truth. The clock of deceit ticks onward, urging her to make a choice that could define her career and her conscience."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a suave businessman, navigates a web of shady dealings as he grapples with the consequences of the victim's death on his financial future.",
    "publicPersona": "A suave and persuasive businessman with a vision for the future.",
    "privateSecret": "Has been involved in shady dealings that could come to light if the victim's will is executed.",
    "motiveSeed": "Stands to gain financially if the victim's estate is contested, as he has pending deals reliant on it.",
    "motiveStrength": "compelling",
    "alibiWindow": "Was supposedly meeting with potential investors in a different part of the hotel.",
    "accessPlausibility": "possible",
    "stakes": "His financial reputation and future projects are at stake.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Hugo speaks with a smooth, polished cadence, his words carefully chosen to charm and persuade. His humor is often laced with a biting edge, revealing a cunning intellect and a willingness to manipulate.",
    "signatureTic": "‘One must always keep an eye on the prize, wouldn’t you agree?’",
    "internalConflict": "Hugo grapples with the moral implications of his shady dealings, aware that the victim's death could expose his unethical practices and jeopardize his ambitions.",
    "personalStakeInCase": "This crime is crucial for Hugo, as it could either solidify his financial empire or unravel it completely, forcing him to confront his own ethical boundaries.",
    "paragraphs": [
      "Hugo Vane is a man of ambition, his suave demeanor masking a labyrinth of shady dealings that could unravel at any moment. As a persuasive businessman, he knows how to charm his way into the hearts and wallets of others, but the victim's death presents a new set of challenges. The stakes are high; if the victim's will is executed, it could expose the underbelly of his operations and threaten everything he has built.",
      "With a polite savagery that cuts through the pleasantries, Hugo navigates conversations with ease, his smooth words often hiding a razor-sharp intellect. He is a master manipulator, aware that every interaction is a potential opportunity to tilt the scales in his favor. Yet, beneath the polished surface lies a man wrestling with the consequences of his actions. The clock is ticking, and he knows that time is running out to secure his future.",
      "Hugo’s internal conflict emerges as he grapples with the moral implications of his shady dealings. While he stands to gain financially from the victim's estate being contested, he is also aware of the ethical boundaries he is willing to cross. The allure of wealth and power is intoxicating, but the fear of exposure looms large. Each moment brings him closer to the brink, and he must decide whether to continue down a path of deceit or seek a more honorable route.",
      "As the investigation unfolds, Hugo finds himself at a crossroads. The victim's death could either solidify his empire or bring it crashing down. The clock of deceit ticks on, urging him to make choices that will define not only his financial future but also his moral compass. In a world where ambition often trumps integrity, Hugo must confront the reality of his actions and decide what kind of legacy he truly wants to leave behind."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seaside Grandeur Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand Art Deco hotel overlooking the tumultuous sea, harboring secrets within its elegant walls.",
    "visualDescription": "The hotel boasts sweeping curves and geometric patterns in its architecture, with polished chrome accents and expansive windows framing the ocean view. Inside, the central courtyard features lush greenery and a fountain, while opulent chandeliers illuminate the dining room with a warm glow.",
    "atmosphere": "The atmosphere is thick with tension, secrets whispering through the ornate corridors and echoing in the vast dining hall.",
    "paragraphs": [
      "The Seaside Grandeur Hotel stands as a monument to elegance against the backdrop of crashing waves and a brooding sky. Its Art Deco architecture, with bold lines and intricate designs, invites guests into a world of luxury. The scent of salt air mingles with the faint aroma of fresh pastries from the kitchen, creating an intoxicating allure. Yet beneath the polished surface lies an undercurrent of unease, with shadows lurking in the corners of its grand hallways.",
      "As guests traverse the narrow hallways, the sound of their footsteps is muffled by the thick carpet, a stark contrast to the roaring sea outside. The occasional creak of the building adds to the atmosphere, whispering tales of those who have come and gone. Locked doors and restricted access heighten the sense of mystery, as if the hotel itself harbors secrets best left undisturbed. Each room, with its ocean view, holds its own story, waiting to be uncovered.",
      "In the central courtyard, the fountain's water dances in the cool breeze, while the soft rustle of palm leaves creates a soothing backdrop. Yet, the overcast sky casts a pall over the scene, as if nature itself is holding its breath in anticipation of the events to unfold. Guests gather for dinner, the clinking of cutlery and murmurs of conversation punctuating the air, but the tension is palpable, a reminder that not all is as it seems within these walls.",
      "As the evening deepens, the hotel transforms under the flickering glow of gas lamps, shadows stretching and bending in the dim light. The scent of wood smoke from the fireplace mingles with the aroma of rich food, creating an inviting yet foreboding ambiance. With the nearest town miles away, isolation reigns, leaving guests to confront their own demons as well as the mysteries hidden within the Seaside Grandeur Hotel."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional drizzle, typical of coastal climates",
    "timeFlow": "Three days of mounting tension as secrets unfold",
    "mood": "tense and suspenseful, with an air of secrecy",
    "eraMarkers": [
      "early radio broadcasts in the lounge",
      "rationed wartime vehicles parked outside",
      "military radar equipment on the roof",
      "women in tailored suits entering the workforce"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and dampness",
      "secondary": [
        "rich aroma of roasted meats",
        "faint scent of polished wood and leather"
      ]
    },
    "paragraphs": [
      "The air is heavy with the scent of brine and dampness, a reminder of the ocean's relentless presence. The overcast sky casts a grey filter over the hotel, creating a somber yet captivating atmosphere. Inside, the flickering lights of the gas lamps juxtapose the shadows, illuminating the faces of guests with an eerie glow. The sound of the waves crashing against the cliffs is a constant reminder of the isolation that envelops the hotel, a sanctuary for secrets and intrigue.",
      "As night falls, the tension escalates, with the echoes of laughter and clinking glasses in the dining room masking the whispers of discontent and suspicion. Each creak of the floorboards seems amplified in the silence that follows, as if the hotel itself is listening. The distant sound of thunder adds to the atmosphere, a portent of the storm brewing not just in the skies but within the hearts of those gathered under the opulent chandeliers."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Grand Dining Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Elegantly set tables with crisp white linens, glinting silverware, and tall floral arrangements. Large windows overlook the tumultuous sea, casting shifting shadows.",
      "sensoryDetails": {
        "sights": [
          "gleaming chandeliers overhead",
          "waves crashing against the shore",
          "floral centerpieces on tables",
          "dark wood paneling absorbing light"
        ],
        "sounds": [
          "clinking glasses and cutlery",
          "murmurs of tense conversation",
          "distant thunder rumbling",
          "the crashing of waves outside"
        ],
        "smells": [
          "rich aroma of roasted meats",
          "freshly baked bread",
          "hint of citrus from the centerpiece",
          "smoky scent from the fireplace"
        ],
        "tactile": [
          "cool linen tablecloths",
          "smooth porcelain plates",
          "stiffness of formal attire",
          "warmth of the fireplace nearby"
        ]
      },
      "accessControl": "Guests allowed during meal times; staff access for cleaning and preparation; locked after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-speckled windows",
            "soft morning light filtering through",
            "table settings glistening with moisture",
            "wet floor reflecting chandelier light"
          ],
          "sounds": [
            "steady drumming of rain on the roof",
            "quiet rustle of napkins",
            "distant thunder rumbling",
            "soft whispers echoing"
          ],
          "smells": [
            "freshly brewed coffee",
            "wet earth from outside",
            "cooked bacon and eggs",
            "faint mildew from the dampness"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "shadows creeping along the walls",
            "guests in muted colors",
            "plates of food slowly cooling"
          ],
          "sounds": [
            "silence broken by distant clock ticking",
            "the creak of old timbers",
            "muffled laughter from the bar",
            "the sound of waves growing louder"
          ],
          "smells": [
            "earthy scent of damp wood",
            "simmering stew from the kitchen",
            "dusty aroma of old books",
            "faint whiff of tobacco smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "darkening sky through windows",
            "the glow of brass fittings"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "soft piano music from the corner",
            "distant laughter from the terrace",
            "the quiet rustle of dresses"
          ],
          "smells": [
            "candle wax melting",
            "freshly cut flowers",
            "grilled fish wafting from the kitchen",
            "cold fireplace ash lingering"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Dining Room, with its soaring ceilings and elegant chandeliers, serves as the heart of the Seaside Grandeur Hotel. Here, guests gather to share meals, but the atmosphere is fraught with tension and unspoken words. The sound of cutlery clinks against porcelain, punctuated by the low murmur of conversations, some light and others weighted with suspicion. The ocean's roar outside serves as a constant reminder of the storm brewing both in the skies and amongst the guests.",
        "As the evening unfolds, the room transforms under the warm glow of candlelight, shadows dancing along the walls. The scents of gourmet dishes intermingle with the salty air, creating an intoxicating environment. Yet, the underlying unease is palpable, as glances are exchanged and secrets simmer beneath the surface, waiting for the right moment to erupt."
      ]
    },
    {
      "id": "staff_area",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Staff-only area for food preparation",
      "visualDetails": "Stainless steel appliances and large wooden counters, bustling with chefs and staff. A large pantry door stands ajar, revealing shelves stocked with rationed goods.",
      "sensoryDetails": {
        "sights": [
          "steam rising from pots",
          "chefs in white uniforms",
          "gleaming knives on cutting boards",
          "shelves stocked with canned goods"
        ],
        "sounds": [
          "clattering pots and pans",
          "sizzling on the stove",
          "laughter and shouts among staff",
          "the hum of the refrigerator"
        ],
        "smells": [
          "savory aroma of herbs and spices",
          "freshly baked pastries",
          "smoky scent of grilled meats",
          "clean scent of soap and disinfectant"
        ],
        "tactile": [
          "heat radiating from the oven",
          "smooth countertops",
          "rough texture of burlap sacks",
          "cool metal of refrigerator doors"
        ]
      },
      "accessControl": "Staff only; locked after hours; entry requires a keycard.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on the window",
            "staff hurrying with umbrellas",
            "steam from cooking pots",
            "piles of fresh ingredients"
          ],
          "sounds": [
            "pattering of rain on the roof",
            "shouts of orders from the head chef",
            "the clattering of dishes",
            "the hiss of frying food"
          ],
          "smells": [
            "freshly brewed coffee",
            "scent of wet earth from outside",
            "smoky aroma of bacon",
            "sweet scent of pastries cooling"
          ],
          "mood": "busy urgency"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through windows",
            "chefs moving in a choreographed dance",
            "pans simmering on the stove"
          ],
          "sounds": [
            "the hum of appliances",
            "the soft clatter of utensils",
            "the sizzle of food cooking",
            "distant thunder rumbling outside"
          ],
          "smells": [
            "aroma of simmering sauces",
            "freshly baked bread cooling",
            "spicy scent of herbs",
            "faint metallic scent of the kitchen"
          ],
          "mood": "tense focus"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "kitchen lights casting a warm glow",
            "staff preparing for the dinner rush",
            "dishes being arranged on carts",
            "fresh herbs laid out on counters"
          ],
          "sounds": [
            "the soft hiss of the oven",
            "laughter echoing between staff",
            "the distant sound of guests chatting"
          ],
          "smells": [
            "scent of grilled meats",
            "sweet aroma of desserts",
            "freshly chopped vegetables",
            "clean scent of soap from washing hands"
          ],
          "mood": "anticipatory excitement"
        }
      ],
      "paragraphs": [
        "The kitchen bustles with energy, a sharp contrast to the quiet elegance of the dining room. Staff move swiftly, expertly navigating the tight space, while the savory aromas of freshly prepared dishes fill the air. The sounds of sizzling pans and clattering utensils create a symphony of activity, underscored by the occasional shout from the head chef. Here, in this chaotic haven, secrets are whispered amid the clamor, and the tension of the hotel seems to seep into every corner.",
        "As the evening approaches, the atmosphere thickens with the anticipation of the dinner service. The kitchen is a whirlwind of motion, with staff preparing dishes that will soon be served to the guests. The scents of grilled meats and sweet pastries mingle, creating a tantalizing olfactory landscape. Yet, amidst the excitement, a sense of unease lingers, as if the kitchen too is a stage for the unfolding drama of the evening."
      ]
    },
    {
      "id": "rooftop",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Restricted access area with ocean views",
      "visualDetails": "A spacious terrace with wrought iron railings, overlooking the crashing waves below. Potted plants line the edges, and a small table is set for two.",
      "sensoryDetails": {
        "sights": [
          "waves crashing against the rocks",
          "seagulls soaring overhead",
          "clouds swirling in the sky",
          "flickering lights of the hotel below"
        ],
        "sounds": [
          "the roar of the ocean",
          "whistling wind through the railings",
          "distant laughter from guests",
          "the soft rustle of plants"
        ],
        "smells": [
          "saltiness of the sea air",
          "fresh scent of blooming flowers",
          "faint aroma of smoke from below",
          "coolness of evening dew"
        ],
        "tactile": [
          "cold metal of the railing",
          "rough texture of stone tiles",
          "gentle breeze on the skin",
          "moisture from the evening air"
        ]
      },
      "accessControl": "Restricted to staff and authorized guests; locked after sunset.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "puddles forming on the tiles",
            "damp potted plants",
            "mist obscuring the horizon"
          ],
          "sounds": [
            "steady patter of rain on the tiles",
            "the distant crash of waves",
            "soft whispers of staff",
            "the rustle of wet leaves"
          ],
          "smells": [
            "fresh scent of wet earth",
            "dampness in the air",
            "salt from the ocean",
            "faint whiff of flowers"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds gathering overhead",
            "waves crashing violently below",
            "dim light casting shadows",
            "stillness in the air"
          ],
          "sounds": [
            "the low rumble of thunder",
            "the roar of the ocean",
            "the soft rustle of leaves",
            "the distant sound of voices"
          ],
          "smells": [
            "scent of rain approaching",
            "saltiness of the sea",
            "faint aroma of wet stone",
            "the earthy scent of soil"
          ],
          "mood": "foreboding tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "stars twinkling in the sky",
            "moonlight reflecting on the waves",
            "soft glow of lights from the hotel",
            "silhouettes of guests enjoying the view"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant sound of music",
            "the rustle of a light breeze"
          ],
          "smells": [
            "fresh scent of night-blooming flowers",
            "saltiness of the sea air",
            "coolness of evening dew",
            "faint hint of smoke from below"
          ],
          "mood": "romantic intrigue"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers a breathtaking view of the ocean, a stark contrast to the tension brewing within the hotel. Here, the salty air fills the lungs, and the sound of crashing waves creates a rhythmic backdrop, lulling guests into a false sense of calm. Potted plants sway gently in the breeze, offering a touch of color against the starkness of the sea. Yet, this space is not just for relaxation; it holds secrets that could unravel the very fabric of the hotel.",
        "As the sun sets, the terrace transforms into a realm of intrigue, shadows dancing in the dim light. The scent of blooming flowers mingles with the salty air, creating an intoxicating atmosphere. Guests gather, exchanging whispers and glances, unaware that the very walls of the hotel may be listening. The rooftop becomes a stage for clandestine meetings, where alliances are formed and secrets are shared under the watchful gaze of the stars."
      ]
    },
    {
      "id": "lobby",
      "name": "The Hotel Lobby",
      "type": "interior",
      "purpose": "Main entrance and gathering space",
      "visualDetails": "Spacious with high ceilings, adorned with elegant furnishings and a grand staircase leading to the upper floors. A large reception desk welcomes guests.",
      "sensoryDetails": {
        "sights": [
          "grand staircase winding upwards",
          "ornate light fixtures hanging",
          "plush seating areas",
          "large potted plants in corners"
        ],
        "sounds": [
          "soft chatter of guests",
          "footsteps echoing on marble",
          "the hum of conversation",
          "the distant sound of a radio playing"
        ],
        "smells": [
          "freshly polished wood",
          "scent of floral arrangements",
          "faint whiff of perfume",
          "clean scent of disinfectant"
        ],
        "tactile": [
          "smooth marble floor",
          "soft upholstery of chairs",
          "cool metal of reception bell",
          "rough texture of potted plant leaves"
        ]
      },
      "accessControl": "Open to all guests and visitors; monitored by staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on the windows",
            "staff drying off umbrellas",
            "dim light filtering through clouds",
            "puddles forming at the entrance"
          ],
          "sounds": [
            "the patter of rain on the roof",
            "the soft murmur of guests",
            "the clinking of keys at the desk",
            "the distant sound of thunder"
          ],
          "smells": [
            "fresh scent of rain-soaked earth",
            "the aroma of brewed coffee",
            "faint scent of wet wood",
            "the clean smell of disinfectant"
          ],
          "mood": "quiet anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "gloomy light filtering through",
            "shadows lengthening in corners",
            "guests wrapped in heavy coats",
            "the flickering light of the reception desk"
          ],
          "sounds": [
            "the murmur of hushed conversations",
            "the rustle of newspapers",
            "the sound of footsteps echoing",
            "the distant crack of thunder"
          ],
          "smells": [
            "scent of dampness in the air",
            "the aroma of hot soup from the kitchen",
            "faint whiff of tobacco smoke",
            "the clean scent of disinfectant"
          ],
          "mood": "sombre reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from the lobby lights",
            "guests mingling in small groups",
            "the grand staircase illuminated",
            "the darkening sky outside"
          ],
          "sounds": [
            "laughter and chatter filling the space",
            "the soft music playing in the background",
            "the rustle of evening attire",
            "the gentle ringing of the reception bell"
          ],
          "smells": [
            "scent of fresh flowers",
            "the aroma of baked goods",
            "faint whiff of perfume",
            "the clean scent of disinfectant"
          ],
          "mood": "welcoming warmth"
        }
      ],
      "paragraphs": [
        "The hotel lobby serves as the first impression for every guest, a grand space filled with light and elegance. High ceilings adorned with ornate light fixtures create an inviting atmosphere, while plush seating areas offer comfort for weary travelers. The grand staircase spirals upwards, a focal point that beckons exploration of the upper floors. Yet, beneath the surface of hospitality lies an undercurrent of tension, with glances exchanged and hushed conversations hinting at secrets waiting to be uncovered.",
        "As the evening unfolds, the lobby transforms into a hub of activity, with guests mingling and laughter filling the air. The scent of fresh flowers and baked goods wafts through the space, creating a warm ambiance. However, the soft hum of the radio in the background provides a stark reminder of the world outside, where tensions still linger from the recent war. The lobby, while welcoming, remains a crossroads of intrigue, where the past and present collide in unexpected ways."
      ]
    }
  ],
  "note": "",
  "cost": 0.00289155405,
  "durationMs": 40803
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "March",
    "day": null,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "March",
    "weather": [
      "overcast with occasional drizzle",
      "chill in the air from lingering winter",
      "mild temperatures in the low fifties"
    ],
    "daylight": "Days beginning to lengthen, with sunset around six-thirty in the evening, creating a dim twilight.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner service has concluded.",
    "holidays": [
      "St. Patrick's Day (March 17)"
    ],
    "seasonalActivities": [
      "spring cleaning in homes",
      "preparation for Easter celebrations",
      "garden planting begins in warmer areas"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "white dress shirt with a stiff collar",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "wool cardigan sweater",
        "tweed trousers",
        "oxford shoes"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a cinched waist",
        "pencil skirt with a matching blouse",
        "tailored coat with shoulder pads"
      ],
      "casual": [
        "sweater set in pastel colors",
        "A-line skirt",
        "ballet flats"
      ],
      "accessories": [
        "string of pearls",
        "clutch handbag",
        "wide-brimmed hat"
      ]
    },
    "trendsOfTheMoment": [
      "utility clothing due to fabric rationing",
      "bold patterns in textiles",
      "increased popularity of shoulder pads in women's fashion"
    ],
    "socialExpectations": [
      "men expected to be the primary breadwinners",
      "women's roles expanding into the workforce",
      "traditional norms of courtship still prevalent"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Allied forces gaining ground in Europe",
      "Intensified bombings in Berlin",
      "The Manhattan Project making strides in atomic research"
    ],
    "politicalClimate": "The atmosphere is charged with anticipation; the Allies are poised for significant advances against Axis forces, yet the threat of espionage looms large.",
    "economicConditions": "Rationing continues to affect everyday life, with shortages of goods leading to black markets and increased prices.",
    "socialIssues": [
      "gender equality in the workplace",
      "racial segregation debates",
      "war trauma affecting veterans and families"
    ],
    "internationalNews": [
      "Reports of the Yalta Conference discussions on post-war Europe",
      "Growing tensions between the US and the Soviet Union"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'I'll Be Seeing You'",
        "Glenn Miller's 'In the Mood'",
        "The Andrews Sisters' 'Boogie Woogie Bugle Boy'"
      ],
      "films": [
        "'To Have and Have Not'",
        "'Laura'",
        "'Since You Went Away'"
      ],
      "theater": [
        "Broadway plays featuring wartime themes",
        "revues showcasing popular music and dance"
      ],
      "radio": [
        "'The Shadow' — a popular mystery show",
        "'Suspense' — featuring thrilling stories",
        "'Amos 'n' Andy' — a comedic series"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Stranger' by Albert Camus",
        "'The Glass Bead Game' by Hermann Hesse",
        "'Brave New World' by Aldous Huxley"
      ],
      "popularGenres": [
        "detective fiction",
        "war novels",
        "romance centered around wartime experiences"
      ]
    },
    "technology": {
      "recentInventions": [
        "improved radar systems for military use",
        "advancements in radio communication",
        "early developments in television broadcasting"
      ],
      "commonDevices": [
        "radio sets as a main source of entertainment",
        "telephone lines expanding into rural areas",
        "typewriters still prevalent in offices"
      ],
      "emergingTrends": [
        "increased use of military technology in civilian life",
        "growing interest in personal radios"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Dozen eggs: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "participating in community war bond drives",
        "attending church services on Sundays",
        "visiting local cinemas for the latest films"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "Friday night dances at community halls"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing divide between the working class and upper class",
      "increased solidarity among working-class communities"
    ],
    "gender": [
      "women are increasingly accepted in roles traditionally held by men",
      "but still face backlash for stepping outside traditional roles"
    ],
    "race": [
      "racial segregation remains a contentious issue in many areas",
      "increased activism for civil rights beginning to emerge"
    ],
    "generalNorms": [
      "strong sense of patriotism",
      "community support for war efforts",
      "cautious optimism about the future"
    ]
  },
  "atmosphericDetails": [
    "The sound of distant thunder mingles with the soft patter of rain against the hotel windows, creating a backdrop of tension.",
    "The faint smell of damp earth and blooming flowers wafts in with the spring air, promising renewal amidst the chaos of war.",
    "Inside the hotel, whispers of clandestine meetings and furtive glances fill the rooms, as guests navigate secrets hidden beneath polished exteriors."
  ],
  "paragraphs": [
    "In March 1944, the coastal air is heavy with the scent of rain, overcast skies casting a grey pallor over the bustling hotel. The occasional drizzle mingles with the crisp chill of early spring, as guests hurry along the sidewalk, their hats pulled low and collars turned up against the damp. The longer days bring a hint of warmth, but the atmosphere carries an unmistakable tension, as the world outside continues to be shaped by the brutal realities of war and the secrets that lie within these walls.",
    "Fashion in this era reflects the duality of wartime necessity and emerging trends. Men don tailored double-breasted suits and silk ties, while women favor tea-length dresses cinched with belts, showcasing their figures against the backdrop of utility clothing. Accessories like fedora hats and string of pearls enhance the elegance of the time, even as the specter of rationing looms large. The hotel lobby is a parade of styles, each outfit telling its own story of resilience and aspiration amidst adversity.",
    "Daily life continues to unfold with a mix of routine and rebellion. Prices are rising due to rationing, yet social rituals persist, with families gathering for Sunday dinners and couples dancing the night away at local halls. The community is unified in support of the war effort, with war bond drives pulling together citizens from all walks of life. Yet, beneath the surface, discussions about gender roles and racial equality simmer, as society grapples with the changes wrought by conflict and the hope for a better future."
  ],
  "note": "",
  "cost": 0.00104501595,
  "durationMs": 21737
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A mechanical clock-tampering murder unfolds at a grand seaside hotel, where post-WWII tensions and shifting gender roles force a diverse cast of characters into a web of suspicion and secrecy.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of the war has led to a redefined social order, with women entering the workforce and a heightened sense of mistrust amid emerging Cold War anxieties."
  },
  "setting": {
    "location": "A grand seaside hotel with Art Deco architecture overlooking the beach.",
    "institution": "hotel",
    "weather": "overcast with occasional drizzle, typical of coastal climates"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a mechanical clock-tampering method, where a rewound timepiece staged the apparent time of death."
}

### LOCKED_FACTS
[
  {
    "id": "clock_time_of_death",
    "value": "ten minutes past nine",
    "description": "The time displayed on the tampered clock at the moment of the murder."
  },
  {
    "id": "clock_strike_time",
    "value": "nine o'clock",
    "description": "The actual time the clock struck at the moment of death, as corroborated by a witness."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 6,
    "mid": 12,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "physical"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "testimonial"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
      "criticality": "essential",
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
