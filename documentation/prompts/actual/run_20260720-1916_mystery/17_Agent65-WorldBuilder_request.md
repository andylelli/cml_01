# Actual Prompt Record

- Run ID: `mystery-1784574963400`
- Project ID: ``
- Timestamp: `2026-07-20T19:21:36.944Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `967a9e114c64a3a8`

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
    "title": "The Masquerade of Authority",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A modest seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "impersonation"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "An astute investigator known for her keen intuition.",
      "private_secret": "Struggles with her own past as a war nurse.",
      "motive_seed": "Seeks justice for the victim.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "personal commitment to solving the case.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "colleague of the victim"
      ],
      "public_persona": "Respected doctor with a busy practice.",
      "private_secret": "Has a strained relationship with the victim.",
      "motive_seed": "Professional jealousy.",
      "motive_strength": "moderate",
      "alibi_window": "8 PM to 9 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation in the community.",
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
        "former military colleague"
      ],
      "public_persona": "Charming and charismatic retired captain.",
      "private_secret": "Struggling with post-war trauma.",
      "motive_seed": "Dispute over a business venture.",
      "motive_strength": "moderate",
      "alibi_window": "8 PM to 9 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "financial stability.",
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
        "friend of the victim"
      ],
      "public_persona": "Friendly and sociable waitress at the hotel.",
      "private_secret": "Has a crush on the victim.",
      "motive_seed": "Unrequited love.",
      "motive_strength": "weak",
      "alibi_window": "7 PM to 8 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "emotional well-being.",
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
        "former lover of the victim"
      ],
      "public_persona": "Reserved and mysterious guest.",
      "private_secret": "Hides her past relationship.",
      "motive_seed": "Jealousy over the victim's new relationship.",
      "motive_strength": "strong",
      "alibi_window": "8 PM to 9 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation and emotional closure.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "friend of the cast"
      ],
      "public_persona": "Wealthy and influential guest at the hotel.",
      "private_secret": "Involved in dubious business dealings.",
      "motive_seed": "Financial pressures.",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "unknown",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "life and reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
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
      "summary": "At a modest seaside hotel in Brighton, tensions run high as guests gather for a retreat, only for one of them, Hugo Vane, to be found strangled. Detective Eleanor Voss must navigate a web of impersonation and deceit to uncover the truth behind the murder."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murderer impersonated hotel staff to create a false alibi while committing the crime.",
      "delivery_path": [
        {
          "step": "The murderer wore a costume resembling hotel staff uniforms."
        },
        {
          "step": "Gained access to restricted areas under the guise of authority."
        },
        {
          "step": "Used their position to manipulate witnesses' accounts."
        }
      ]
    },
    "outcome": {
      "result": "The murderer successfully evaded suspicion while committing the crime."
    }
  },
  "false_assumption": {
    "statement": "The murder could not have been committed by a hotel staff member.",
    "type": "authority",
    "why_it_seems_reasonable": "Guests trust hotel staff implicitly, and the presence of authority figures leads to a false sense of security.",
    "what_it_hides": "The true perpetrator is disguising themselves as a staff member."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch was seen near the crime scene shortly before the murder.",
      "She had a professional rivalry with the victim that could provide a motive."
    ],
    "the_one_flaw": "Dr. Finch's alibi was corroborated by multiple witnesses who observed her in the dining room at the time of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Captain Hale's argument with Hugo in the bar.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "They were discussing a business venture that had fallen through, but it was amicable.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Beatrice's late-night shift as a waitress.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "She was working her shift and had no access to the victim's room.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "rationale": "All suspects were present at the hotel during the time of the murder, and no outsiders could have committed the crime."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "8 PM",
        "9 PM"
      ],
      "windows": [
        "7 PM-8 PM",
        "8 PM-9 PM"
      ],
      "contradictions": [
        "Witnesses claim to have seen the victim alive at 8:45 PM, but the murder occurred at 8:30 PM."
      ]
    },
    "access": {
      "actors": [
        "hotel staff",
        "guests"
      ],
      "objects": [
        "victim's room",
        "staff uniforms"
      ],
      "permissions": [
        "staff access to restricted areas"
      ]
    },
    "physical": {
      "laws": [
        "Costume fabric must match hotel uniforms to gain trust."
      ],
      "traces": [
        "Fibers from the costume found at the scene."
      ]
    },
    "social": {
      "trust_channels": [
        "Authority of hotel staff",
        "Social norms of trust among guests"
      ],
      "authority_sources": [
        "Staff uniforms",
        "Hotel management's reputation"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Fibers matching hotel staff uniforms were found at the crime scene.",
        "correction": "The presence of the fibers suggests the murderer wore a staff costume.",
        "effect": "Narrows suspects to those who could access staff uniforms.",
        "required_evidence": [
          "Fibers found at the crime scene",
          "Witness statements about staff uniforms"
        ],
        "reader_observable": true
      },
      {
        "observation": "The hotel staff schedule shows a missing employee during the time of the murder.",
        "correction": "This missing employee could be an impersonator.",
        "effect": "Eliminates suspects who were accounted for in the staff schedule.",
        "required_evidence": [
          "Hotel staff schedule",
          "Witness statements about employee presence"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses inconsistently recall seeing an employee who wasn't on the staff list.",
        "correction": "These inconsistencies indicate that the murderer was impersonating a staff member.",
        "effect": "Narrows the suspect pool further to those who could create a false identity.",
        "required_evidence": [
          "Witness statements",
          "Staff list showing discrepancies"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A staged scenario where the hotel staff is questioned about the missing employee and their impersonation is revealed through inconsistencies.",
    "knowledge_revealed": "The revealed facts are identity, impersonator, and fiber.",
    "pass_condition": "The impersonator fails to provide an alibi corroborated by the staff schedule.",
    "evidence_clues": [
      "clue_5",
      "clue_core_contradiction_chain",
      "clue_4",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The fibers found (early) and witness statements (mid) show the murderer wore a staff costume. Step 2: The missing employee from the staff schedule (mid) narrows suspects. Step 3: Inconsistencies in witness accounts (discriminating test) reveal the impersonator."
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
        "Observe the impersonator's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Verified presence in the bar during the murder.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Documented working hours during the murder.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proven to be in her room at the time.",
        "supporting_clues": [
          "clue_id_7",
          "clue_id_8"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Staff schedule access"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a local innkeeper, balances her warm hospitality with the shadows of her late husband's hidden life.",
    "publicPersona": "Eleanor is the heart of her inn, always smiling and ready to assist guests with local lore or a cup of tea. Her friendly demeanor masks the turmoil within.",
    "privateSecret": "Haunted by her husband's secret affairs, Eleanor fears that the truth will emerge and tarnish her reputation, leaving her vulnerable and alone.",
    "motiveSeed": "Her sense of responsibility for her guests' well-being drives her to uncover the truth behind the murder, lest her inn's reputation suffer.",
    "motiveStrength": "moderate",
    "alibiWindow": "During the murder, she was busy tending to guests in the dining area, allowing her to blend into the crowd.",
    "accessPlausibility": "easy",
    "stakes": "Eleanor's stakes lie in protecting both her reputation and the inn's standing in the community; a scandal could ruin her livelihood.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor's speech is warm and inviting, often peppered with quick, witty remarks that reveal her sharp mind. She tends to speak in a measured pace, allowing her words to linger.",
    "signatureTic": "‘Well, isn't that just the way of it?’",
    "internalConflict": "Eleanor grapples with guilt over her husband's infidelity, fearing that his indiscretions will come to light and ruin her hard-earned reputation.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as she believes the truth could either liberate her from her husband's shadow or trap her in a web of scandal.",
    "paragraphs": [
      "Eleanor Voss stands at the threshold of her modest inn, a beacon of warmth and familiarity on the rugged coastline. Her sunny disposition is an artifice, a carefully crafted mask that conceals the tumult within. Each smile she offers is a silent prayer that her guests will find solace in the safety of her establishment, unaware of the ghosts that haunt her. The specter of her late husband looms large in her heart, a man whose secret affairs threaten to unravel the very fabric of her life.",
      "As she bustles around the dining area, serving breakfast to weary travelers, Eleanor's mind races. The news of the murder sends ripples of anxiety through her. She knows her responsibility extends beyond mere hospitality; she must protect her inn's reputation at all costs. The thought of scandal makes her stomach churn. 'What would they think of me?' she wonders, a pang of dread gripping her. The inn—her sanctuary—could easily become a prison if the truth were to surface.",
      "Eleanor's determination to uncover the truth is fueled by her deep-seated sense of duty. She can't allow the murder to tarnish her guests' experience or the inn's standing in the community. With each passing hour, the pressure mounts. Who among her guests could harbor such darkness? She recalls the whispers of discontent, the subtle glances exchanged over dinner, and wonders if the truth lies hidden in plain sight. 'Well, isn't that just the way of it?' she muses, a hint of dry humor escaping her lips even in the face of despair.",
      "As the investigation unfolds, Eleanor finds herself torn between her role as a caretaker and her desire for personal redemption. The secrets of her past collide with the present, and she realizes that unearthing the truth may also mean confronting her own demons. Will she find the strength to navigate the social tensions that threaten to engulf her, or will she remain shackled by the memory of her husband's betrayal? This case may very well be her chance to reclaim her life—or to lose everything she holds dear."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a well-respected physician whose financial troubles have pushed her into morally ambiguous territory.",
    "publicPersona": "She is known for her dedication to local health issues, often seen as a pillar of the community, offering help and advice.",
    "privateSecret": "Mallory harbors a secret burden of debt from a failed practice, which has led her to consider unethical means to regain her footing.",
    "motiveSeed": "The prospect of financial gain from the victim's life insurance policy looms large in her mind, casting a shadow over her ethics.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claims to have been making rounds at the local clinic, but there's a window of opportunity for her to have slipped away.",
    "accessPlausibility": "possible",
    "stakes": "For Mallory, this crime is a test of her professional integrity and a chance to secure her financial future.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a brisk efficiency, often punctuating her sentences with dry humor about the medical profession and her own misfortunes.",
    "signatureTic": "‘You know, it’s always the patients that keep you guessing.’",
    "internalConflict": "She struggles with the weight of her financial desperation and the moral implications of her potential actions, fearing she may lose herself in the process.",
    "personalStakeInCase": "The murder case represents a critical juncture for Mallory; it could either lead her to financial redemption or plunge her deeper into ethical chaos.",
    "paragraphs": [
      "Dr. Mallory Finch strides through the modest seaside hotel, her white coat a stark contrast against the warm hues of the inn's decor. To the world, she is a beacon of health and hope, a physician who knows the ins and outs of every ailment. Yet beneath her composed exterior lies a tempest of anxiety, fueled by mounting debts from a medical practice that crumbled under the weight of its own expectations. 'You know, it’s always the patients that keep you guessing,' she quips dryly to herself, masking her internal strife with humor.",
      "The murder of Hugo Vane sends shockwaves through her carefully constructed world. As the whispers of the guests grow louder, so does her fear. The victim's life insurance policy could provide a lifeline for her; the thought of it gnaws at her conscience. Could she really contemplate benefiting from someone else's demise? The very notion makes her stomach turn, yet the desperation for financial stability is a powerful motivator. She grapples with the ethical dilemmas that arise, wondering how far she might be willing to go to secure her future.",
      "Mallory's alibi, a routine visit to the clinic, is shaky at best. She could have easily slipped away unnoticed, but the thought of being implicated fills her with dread. The stakes are high; if her connection to the crime is uncovered, it would mean not just the end of her career but also the collapse of the fragile life she has built. Each day she walks the fine line between healer and potential criminal, and the tension is palpable. She finds herself haunted by the question: 'How much of myself am I willing to sacrifice for survival?'",
      "As the investigation unfolds, Mallory faces not only the external pressures of the case but also her own moral compass. The potential for redemption flickers like a candle in the dark, urging her to confront her demons. Will she find the courage to do the right thing, or will the allure of a quick fix lead her down a path of no return? The answer may lie in the very heart of the case—a truth that could either liberate her or seal her fate."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired Navy officer, struggles to maintain his authoritative facade while concealing a web of gambling debts and personal failures.",
    "publicPersona": "He commands respect in the community, known for his imposing presence and leadership qualities.",
    "privateSecret": "Hale hides a history of gambling debts that threaten to unravel his carefully constructed life and a complicated relationship with the victim.",
    "motiveSeed": "The victim's threat to expose Hale's gambling issues creates a potent motive rooted in fear and desperation.",
    "motiveStrength": "strong",
    "alibiWindow": "He was seen playing cards with other guests shortly before the murder, but the timing raises suspicion.",
    "accessPlausibility": "unlikely",
    "stakes": "Hale's stakes are high; he must maintain his status in society and avoid public disgrace at all costs.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Hale speaks with a commanding tone, often cutting to the chase with little room for pleasantries. His words are deliberate, underscored by a sense of urgency.",
    "signatureTic": "‘It’s all just a game, isn’t it?’",
    "internalConflict": "Hale wrestles with shame over his gambling habits and the fear of losing everything he has fought for in life.",
    "personalStakeInCase": "This crime matters to Hale not just for his reputation, but also for the potential exposure of his past failures that could shatter his world.",
    "paragraphs": [
      "Captain Ivor Hale strides through the hotel lobby, a figure of authority wrapped in a façade of confidence. His presence demands attention, and he relishes the respect he commands. Yet behind that imposing exterior lies a man ensnared by the very vices he has fought against. Gambling debts weigh heavily on his conscience, and the shadow of the victim looms larger with each passing moment. ‘It’s all just a game, isn’t it?’ he muses bitterly, the irony not lost on him as he considers the stakes of his current predicament.",
      "The murder of Hugo Vane strikes a nerve deep within Hale. The victim had discovered his gambling issues, a secret that could tarnish his reputation and expose him to public ridicule. The threat of exposure sends him into a frenzy of anxiety. He was seen playing cards just before the murder, a detail that could unravel his carefully constructed alibi. The thought of losing everything he has built—the respect of the community, his standing as a retired officer—fills him with dread.",
      "As he interacts with the guests, Hale's demeanor shifts from authoritative to defensive. He brushes off questions with clipped responses, his mind racing. Each inquiry feels like a dagger probing at his vulnerabilities. The stakes are not just personal; they are a matter of survival. He cannot allow his past to catch up with him, nor can he let the truth surface. The tension between maintaining his status and facing his demons creates a tumultuous internal conflict that he cannot ignore.",
      "The investigation forces Hale to confront the reality of his choices. While he presents himself as a bastion of strength, he is crumbling inside. The fear of public disgrace gnaws at him, and the question lingers: will he find a way to make amends for his past mistakes, or will he continue to hide behind the mask of authority? In the end, the truth may not only determine his fate but could also reveal the man he truly is beneath the layers of pretense."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a charming socialite whose aspirations for high society mask a tumultuous secret that could ruin her standing.",
    "publicPersona": "She is a fashionable and engaging presence, always eager to make connections that elevate her social status.",
    "privateSecret": "Beatrice is entangled in a secret relationship with Captain Hale, a liaison that could jeopardize her standing if exposed.",
    "motiveSeed": "Fear of losing Hale's affection if the victim exposes their affair drives her to desperate measures.",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have been at the bar with friends, but could have slipped away unnoticed.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, her future in high society and her relationship with Hale hinge on the victim's silence.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a charming lilt, often using elaborate language and a playful tone, making her sound both sophisticated and slightly disingenuous.",
    "signatureTic": "‘Oh darling, how dreadfully amusing!’",
    "internalConflict": "She grapples with the fear of losing social standing and love, torn between her ambitions and the reality of her choices.",
    "personalStakeInCase": "This crime matters to Beatrice as it could determine her place in society and her relationship with Captain Hale, both of which are crucial to her identity.",
    "paragraphs": [
      "Beatrice Quill glides through the hotel, a vision of elegance and charm. Her laughter rings through the hallways, drawing attention like a moth to a flame. To the world, she is a socialite with unyielding ambition, but beneath the surface lies a turbulent secret that could unravel her carefully curated life. ‘Oh darling, how dreadfully amusing!’ she exclaims, her tone laced with a polite savagery that masks her true feelings as she navigates the minefield of social interactions.",
      "The murder of Hugo Vane sends ripples of panic through Beatrice's mind. The victim's knowledge of her affair with Captain Hale threatens to expose her to the very society she has worked so hard to ingratiate herself into. The fear of losing Hale's affection gnaws at her, pushing her to contemplate drastic measures. The stakes are impossibly high; if the truth emerges, it would not only ruin her relationship but also obliterate her standing in high society.",
      "As she mingles with other guests, Beatrice's charm becomes a double-edged sword. She flits from conversation to conversation, her laughter tinged with an undercurrent of anxiety. Her alibi, a night spent at the bar with friends, feels tenuous at best. The thought of slipping away unnoticed looms over her like a dark cloud, and she struggles to maintain her composure in the face of mounting suspicion. Each moment feels precarious, as if she could tumble from grace at any moment.",
      "The investigation forces Beatrice to confront the reality of her choices. Her ambition has led her into murky waters, and the truth may very well be her undoing. Will she learn to value genuine connections over superficial status, or will she cling to her ambitions at any cost? As the case unfolds, Beatrice must navigate the treacherous waters of love and ambition, ultimately discovering whether her heart or her social standing will prevail."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a bohemian artist whose unfulfilled aspirations and emotional turmoil cast a shadow over her creative spirit.",
    "publicPersona": "She is seen as an eccentric outsider, often misunderstood yet fiercely passionate about her art.",
    "privateSecret": "Sylvia harbors unrequited feelings for the victim, which complicates her emotions in the wake of the murder.",
    "motiveSeed": "Her anger over the victim's dismissal of her art leads her to consider the unthinkable.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be painting nearby during the murder, but her alibi lacks verification.",
    "accessPlausibility": "possible",
    "stakes": "For Sylvia, the stakes revolve around her artistic career and emotional well-being, both of which hinge on her acceptance in the world.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks in a free-spirited manner, often weaving in poetic imagery and philosophical musings, revealing her artistic soul.",
    "signatureTic": "‘Life is but a canvas, isn’t it?’",
    "internalConflict": "Sylvia struggles with feelings of inadequacy stemming from both her art and her unreciprocated affections, creating a storm of emotional conflict.",
    "personalStakeInCase": "This crime matters to Sylvia as it encapsulates her longing for acceptance and the validation of her artistic worth.",
    "paragraphs": [
      "Sylvia Trent wanders through the hotel, her presence a stark contrast to the polished socialite crowd. An artist at heart, she embodies the spirit of creativity, yet her unfulfilled aspirations weigh heavily on her soul. Often dismissed as eccentric, she feels the sting of isolation acutely. ‘Life is but a canvas, isn’t it?’ she muses, a wistful smile gracing her lips as she considers the beauty and tragedy of existence, even as the world around her feels so bleak.",
      "The murder of Hugo Vane strikes a chord deep within Sylvia. She had long harbored unrequited feelings for him, and the thought of his life cut short leaves her reeling. The anger that simmers beneath the surface is fueled by his dismissive comments about her art, words that echo in her mind like a cruel refrain. Could the depth of her emotions have led her to consider the unthinkable? The very idea terrifies her, yet the pain of rejection is a potent motivator.",
      "As she desperately seeks solace in her painting, Sylvia's alibi becomes a tangled web of uncertainty. She claims to have been nearby, lost in her creative world, but the lack of verification leaves her vulnerable. The stakes are high; the case not only threatens her freedom but also her sense of self-worth as an artist. She grapples with the question: how much of her identity is tied to the acceptance of others? Each stroke of her brush feels heavier, burdened with the weight of her feelings.",
      "The investigation forces Sylvia to confront her insecurities head-on. As she navigates the complexities of her emotions, she must decide whether to embrace authenticity or allow her fears to dictate her path. Will she find the strength to rise above her unfulfilled dreams, or will the shadows of her past continue to haunt her? In the end, the truth may reveal not just the murderer but also the artist she is meant to become."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a wealthy businessman, is a victim whose cutthroat dealings have left a trail of enemies and secrets.",
    "publicPersona": "He is known for his influential presence in the business world, often described as ruthless and cunning.",
    "privateSecret": "Hugo understood the victim was planning to confront him over financial discrepancies that could shatter his empire.",
    "motiveSeed": "The victim's intent to expose Hugo's unethical practices creates a compelling motive for his downfall.",
    "motiveStrength": "compelling",
    "alibiWindow": "He was seen at a local meeting during the time of the murder, but could have easily learned of the event afterward.",
    "accessPlausibility": "possible",
    "stakes": "For Hugo, protecting his business empire and future is paramount, and any threat to that stability is met with ruthless resolve.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Hugo speaks with a clipped, authoritative tone, often using business jargon that reflects his cutthroat nature. He rarely indulges in casual conversation.",
    "signatureTic": "‘This is a matter of business, not pleasure.’",
    "internalConflict": "Hugo's internal conflict lies in his awareness of the consequences of his actions, clashing with his desire for power and control.",
    "personalStakeInCase": "The murder case signifies the culmination of his unethical dealings; it threatens to expose the very foundation of his empire.",
    "paragraphs": [
      "Hugo Vane stands as a formidable figure in the world of business, a man whose influence is matched only by his ruthlessness. He commands attention with his sharp suits and steely gaze, embodying the cutthroat nature of his profession. To the world, he is a titan, but behind that facade lies a man ensnared by his own machinations. 'This is a matter of business, not pleasure,' he often declares, a mantra that underscores his approach to life and relationships alike.",
      "The murder that has rocked the seaside inn sends shockwaves through Hugo's carefully constructed empire. He is acutely aware of the victim's intentions to confront him over financial discrepancies—secrets that could unravel everything he has built. The stakes are impossibly high; any exposure could lead to a catastrophic downfall. The thought sends a shiver down his spine, and he grapples with the implications of his past decisions, knowing that every choice has led him to this moment.",
      "As he navigates the aftermath of the murder, Hugo finds himself caught in a web of suspicion and intrigue. His alibi, a local meeting, feels flimsy at best, and the whispers of discontent grow louder. The fear of losing his empire weighs heavily on him, and he will stop at nothing to protect his interests. The internal conflict rages within him; he knows the lengths to which he has gone for power, yet the thought of losing it all is unbearable. He must remain vigilant, for enemies lurk in every corner.",
      "In the end, Hugo's fate hangs in the balance, a reflection of the ethical choices he has made throughout his life. The murder case is not just a matter of justice; it is a reckoning for a man who has danced on the edge of morality for far too long. As the investigation unfolds, Hugo must confront the reality of his actions—will he find a way to redeem himself, or will he be consumed by the very darkness he has fostered?"
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seaside Retreat Hotel",
    "type": "Hotel",
    "place": "Margate",
    "country": "England",
    "summary": "A modest seaside hotel nestled on a remote stretch of coastline, catering to vacationers and local visitors.",
    "visualDescription": "Art deco façade mixed with coastal charm; weathered wood balconies overlook the turbulent sea; narrow hallways lined with faded floral wallpaper.",
    "atmosphere": "A sense of unease hangs in the air, punctuated by whispers and sidelong glances among the guests.",
    "paragraphs": [
      "The Seaside Retreat Hotel stands at the edge of Margate, its art deco lines softened by years of salt and wind. The faded paint clings to the walls like a memory of better days, while the narrow hallways echo with the footsteps of weary travelers. Guests shuffle past each other, their faces obscured by the shadows cast from the flickering light of brass sconces. Outside, the relentless roar of the waves merges with the distant cries of gulls, creating a backdrop of tension that permeates the air.",
      "Inside, the scent of damp wood and salt lingers, mingling with the faint aroma of cooking from the kitchen, where staff bustle about, unaware of the brewing storm among the guests. The common areas are adorned with coastal motifs, but the decor does little to mask the growing suspicion that fills the rooms. In the dimly lit lounge, a radio crackles with news from the outside world, its static-infused voice barely breaking through the whispers of secrets held too closely.",
      "As the evening sets in, the mood shifts; shadows deepen, and the flickering candlelight throws dancing shapes across the walls. Guests gather, forced into proximity by the limited space, their conversations hushed and wary. Each eye flickers to the entrance, anticipating the arrival of a figure that has yet to appear. The hotel, once a sanctuary, now feels like a trap, its isolation a breeding ground for fear and mistrust.",
      "In this coastal retreat, the past lingers like the salty breeze, and the weight of unspoken words hangs heavy in the air. With the nearest town miles away, help is slow to come, and the sense that something is amiss grows stronger by the hour. As night falls, the hotel transforms into a labyrinth of secrets, where every door could hold a clue and every corner might conceal a truth best left hidden."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast skies with occasional rain, typical of a coastal climate in the late spring.",
    "timeFlow": "Three days of mounting tension and suspicion among guests.",
    "mood": "Tense, with an undercurrent of suspicion among the guests.",
    "eraMarkers": [
      "Flickering radio broadcasting news updates",
      "Early television sets in private rooms",
      "Staff uniforms reflecting post-war practicality",
      "Rationed fuel limiting travel options",
      "Women in the workforce, managing hotel duties"
    ],
    "sensoryPalette": {
      "dominant": "The salty tang of the sea air",
      "secondary": [
        "Faint aroma of cooking from the kitchen",
        "Damp wood and musty carpet scents"
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of brine, each gust of wind a reminder of the unyielding sea just beyond the hotel's walls. As guests navigate the narrow hallways, the sound of their footsteps is swallowed by the oppressive silence, only broken by the occasional crackle of the radio. The atmosphere is heavy with unspoken tension, a feeling that something is lurking just beneath the surface, waiting to be uncovered.",
      "With overcast skies casting a pall over the coastal landscape, the hotel feels more isolated than ever. The occasional rain patters against the windows, a reminder that the outside world is both close and unreachable. Inside, the decor—once vibrant—now seems to echo the weariness of its patrons, each faded floral pattern a testament to the passage of time and the weight of secrets held too tightly."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Dining Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A modest dining area with mismatched tables and chairs; large windows overlook the tumultuous sea.",
      "sensoryDetails": {
        "sights": [
          "flickering candlelight on tables",
          "rain-streaked windows",
          "crumpled tablecloths",
          "shadows dancing on the walls",
          "a solitary chair knocked over"
        ],
        "sounds": [
          "clinking of cutlery",
          "muffled conversations",
          "occasional laughter turning nervous",
          "rain pattering against glass",
          "the distant crash of waves"
        ],
        "smells": [
          "scent of damp wood",
          "faint aroma of overcooked fish",
          "lingering perfume of a guest",
          "musty carpet and old upholstery",
          "salt air mixed with smoke"
        ],
        "tactile": [
          "rough wooden table surface",
          "cold metal cutlery",
          "crumpled napkin in hand",
          "chill from the window draft",
          "smooth glass of water"
        ]
      },
      "accessControl": "Guests allowed during meal times; staff only access for cleaning and setup.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "raindrops tracing lines on the glass",
            "empty chairs at breakfast tables",
            "wet footprints on the floor",
            "damp tablecloths clinging to wooden surfaces"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft whispers among early risers",
            "the clatter of dishes being prepared",
            "the creak of floorboards",
            "distant calls of seagulls"
          ],
          "smells": [
            "freshly brewed coffee aromas",
            "wet earth and stone",
            "damp paper and ink",
            "scent of toast burning slightly",
            "saltiness of the sea air"
          ],
          "mood": "oppressive, with a sense of foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "clouds hanging low over the sea",
            "empty plates on tables",
            "a flickering candle barely illuminating",
            "darkened corners of the room"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "the rustle of napkins being folded",
            "muffled conversations in low tones",
            "the sound of waves crashing outside"
          ],
          "smells": [
            "smoky scent from the kitchen",
            "mildew lingering on the walls",
            "sharp scent of vinegar",
            "faint whiff of old wine",
            "salty breeze mixing with food aromas"
          ],
          "mood": "uneasy stillness, building tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling through windows",
            "shadows growing long across the floor",
            "glimmer of candle flames",
            "distant stars emerging in the sky",
            "the silhouette of guests at tables"
          ],
          "sounds": [
            "laughter ringing out briefly",
            "the tick of a clock in the background",
            "soft music from the radio",
            "the sound of chairs scraping on the floor",
            "the gentle crash of waves outside"
          ],
          "smells": [
            "freshly baked bread",
            "scent of grilled fish",
            "faint floral perfume lingering",
            "warmth of melted butter",
            "the crispness of evening air"
          ],
          "mood": "tense anticipation, secrets waiting to unfold"
        }
      ],
      "paragraphs": [
        "The Dining Room serves as the heart of The Seaside Retreat Hotel, where guests gather to share meals and idle chatter, unaware of the storm brewing beneath the surface. Flickering candlelight casts shadows on the mismatched tables, as the scent of damp wood and overcooked fish fills the air. Conversations, once lively, have turned into hushed whispers, each glance laden with suspicion. The solitary chair knocked over in the corner stands as a silent witness to the tension that has taken root among the patrons.",
        "As the rain patters against the windows, the dim light creates an atmosphere that feels both intimate and claustrophobic. Guests exchange nervous smiles, their laughter turning hollow as they sense the growing unease. The tablecloths, wrinkled and stained, hint at the secrets that linger just below the surface, waiting for the right moment to be revealed. In this room, the Dining Room becomes a stage for the unfolding drama, a place where every meal could lead to revelations or further deception."
      ]
    },
    {
      "id": "manager_office",
      "name": "The Manager's Office",
      "type": "interior",
      "purpose": "Private area for management",
      "visualDetails": "A small, cluttered room filled with paperwork; an old desk with a typewriter and a single window overlooking the beach.",
      "sensoryDetails": {
        "sights": [
          "stacked papers and ledgers",
          "dim light filtering through the window",
          "faded photographs on the walls",
          "a single brass lamp casting shadows",
          "dust motes dancing in the air"
        ],
        "sounds": [
          "the clack of a typewriter",
          "rustling papers",
          "the distant sound of waves",
          "the creak of the chair",
          "muffled voices from outside"
        ],
        "smells": [
          "scent of old paper and ink",
          "faint whiff of musty books",
          "the tang of salt air through the window",
          "cigar smoke lingering in the air",
          "the scent of fresh coffee brewing"
        ],
        "tactile": [
          "rough wood of the desk",
          "cool metal of the typewriter keys",
          "smoothness of parchment paper",
          "the chill from the window draft",
          "the softness of a worn chair cushion"
        ]
      },
      "accessControl": "Staff only; guests prohibited from entering at any time.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light seeping through clouds",
            "raindrops tracing patterns on glass",
            "papers slightly damp from humidity",
            "a flickering lightbulb overhead"
          ],
          "sounds": [
            "steady rain tapping on the roof",
            "the rustle of papers shifting",
            "the clack of the typewriter",
            "distant thunder rumbling",
            "the creak of old wood settling"
          ],
          "smells": [
            "fresh coffee brewing in the pot",
            "the scent of wet earth outside",
            "mustiness of old books",
            "the tang of salt from the sea",
            "smoke curling from a cigar"
          ],
          "mood": "oppressive, filled with tension"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "papers strewn across the desk",
            "dust settling on the windowsill",
            "a clock ticking ominously",
            "the office appearing more cluttered"
          ],
          "sounds": [
            "the clock ticking loudly",
            "the scratch of a pen on paper",
            "muffled voices drifting in",
            "the rustle of a breeze through the window",
            "the creak of the door opening"
          ],
          "smells": [
            "the scent of stale coffee",
            "the mustiness of old documents",
            "the saltiness of the sea air",
            "the lingering aroma of cigar smoke",
            "the faint whiff of cleaning supplies"
          ],
          "mood": "uneasy stillness, a sense of foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling through the window",
            "the office appearing warm and inviting",
            "papers neatly stacked on the desk",
            "the silhouette of a figure at the window",
            "the shadows lengthening on the floor"
          ],
          "sounds": [
            "soft footsteps approaching",
            "the clock ticking steadily",
            "the distant sound of laughter",
            "the rustle of a breeze through the window",
            "the faint sound of waves crashing"
          ],
          "smells": [
            "freshly brewed coffee scent",
            "the tang of salt in the air",
            "the aroma of polished wood",
            "the scent of an old book",
            "the lingering smell of cigar smoke"
          ],
          "mood": "tense anticipation, secrets waiting to be unveiled"
        }
      ],
      "paragraphs": [
        "The Manager's Office is a sanctuary of secrets, a cluttered space filled with papers and ledgers that tell tales of the hotel's history. The dim light filtering through the single window casts long shadows across the desk, where a typewriter sits, its keys worn from years of use. The scent of old paper and cigar smoke lingers in the air, creating an atmosphere of quiet intensity. This is a space where decisions are made and plans are plotted, away from the prying eyes of guests.",
        "As the day progresses, the mood shifts in the office. The ticking of the clock becomes more pronounced, each tick echoing with the weight of unspoken truths. The office, once a refuge, now feels more like a pressure cooker, filled with anticipation and dread. Every rustle of paper and creak of the chair heightens the tension, as if the very walls are listening, waiting for the moment when secrets will spill forth."
      ]
    },
    {
      "id": "lounge_area",
      "name": "The Lounge",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A cozy lounge with worn armchairs and a small bar; large windows provide a view of the sea.",
      "sensoryDetails": {
        "sights": [
          "worn leather armchairs",
          "dimly lit bar with glass shelves",
          "flickering fireplace",
          "coastal decorations on the walls",
          "shadows dancing in the corners"
        ],
        "sounds": [
          "soft jazz playing on the radio",
          "the crackle of the fire",
          "gentle murmurs of conversation",
          "the clinking of glasses",
          "the whisper of the sea breeze"
        ],
        "smells": [
          "scent of aged whiskey",
          "warmth of the fireplace",
          "the aroma of freshly brewed coffee",
          "hint of sea salt in the air",
          "faint scent of tobacco smoke"
        ],
        "tactile": [
          "soft leather of armchair",
          "warmth radiating from the fire",
          "smoothness of the bar counter",
          "the chill of the air near the window",
          "the coarse texture of a wool blanket"
        ]
      },
      "accessControl": "Available to all guests at all times; drinks served until late evening.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "rain tapping against the windows",
            "empty glasses on tables",
            "the fire dimly flickering",
            "the lounge appearing deserted"
          ],
          "sounds": [
            "steady rain drumming on the roof",
            "the crackle of the fire",
            "soft jazz playing faintly",
            "the rustle of newspapers being read",
            "the sound of footsteps approaching"
          ],
          "smells": [
            "freshly brewed coffee",
            "the scent of wet earth outside",
            "the mustiness of damp furniture",
            "the faint aroma of cleaning supplies",
            "the tang of salt from the sea"
          ],
          "mood": "oppressive, with a sense of isolation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "the glow of the fireplace",
            "guests huddled in corners",
            "the bar appearing more inviting",
            "the flickering light from the radio"
          ],
          "sounds": [
            "the soft crackle of the fire",
            "muffled conversations in low tones",
            "the clinking of glasses",
            "the rustle of a newspaper page",
            "the distant sound of waves"
          ],
          "smells": [
            "the scent of tobacco smoke",
            "the warmth of the fireplace",
            "the aroma of whiskey and coffee",
            "the saltiness of the sea air",
            "the faint whiff of damp wood"
          ],
          "mood": "uneasy stillness, a sense of dread"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light flooding the room",
            "the glow of the fireplace casting warmth",
            "guests gathered in small groups",
            "the bar illuminated by soft light",
            "the sea shimmering under the stars"
          ],
          "sounds": [
            "laughter and chatter filling the air",
            "the crackling of the fire",
            "soft jazz playing in the background",
            "the clinking of glasses",
            "the murmur of the sea outside"
          ],
          "smells": [
            "the aroma of cocktails being mixed",
            "the scent of fresh coffee brewing",
            "the warmth of the fireplace",
            "the faint trace of cigarettes",
            "the salty breeze from the ocean"
          ],
          "mood": "tense anticipation, secrets waiting to be revealed"
        }
      ],
      "paragraphs": [
        "The Lounge is the social heart of The Seaside Retreat Hotel, a cozy space where guests gather to escape the chill of the sea and share stories. The worn leather armchairs beckon, their softness a welcome relief from the cool air. A small bar sits in the corner, stocked with bottles that glimmer in the dim light, promising warmth and comfort. As the fireplace crackles, the scent of aged whiskey and tobacco smoke mingles, creating an inviting yet charged atmosphere.",
        "In the evenings, the Lounge transforms as laughter and chatter fill the air, but there is always an undercurrent of tension. Guests exchange glances, their conversations occasionally stalling as they sense the weight of unspoken truths. The flickering fire casts dancing shadows on the walls, and as the night deepens, the room becomes a stage for secrets, where every drink poured could lead to a revelation, and every laugh could mask a hidden fear."
      ]
    }
  ],
  "note": "",
  "cost": 0.00260165565,
  "durationMs": 29050
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "November",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast skies",
      "occasional rain",
      "cool temperatures"
    ],
    "daylight": "Short days with twilight settling by 4:30 PM, often leading to a dim, moody atmosphere.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Thanksgiving (November 28)"
    ],
    "seasonalActivities": [
      "attending local theater productions",
      "participating in charity events for war relief",
      "enjoying indoor social gatherings with card games"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits",
        "tweed blazers",
        "dress shirts with wide lapels"
      ],
      "casual": [
        "corduroy pants",
        "sweaters in muted colors",
        "button-up shirts with rolled sleeves"
      ],
      "accessories": [
        "fedoras",
        "leather gloves",
        "silk ties with geometric patterns"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with cinched waists",
        "satin evening gowns",
        "tailored coats with fur collars"
      ],
      "casual": [
        "A-line skirts paired with fitted blouses",
        "knit sweaters with floral patterns",
        "practical yet stylish shoes with low heels"
      ],
      "accessories": [
        "broad-brimmed hats",
        "string of pearls",
        "gloves reaching to the elbows"
      ]
    },
    "trendsOfTheMoment": [
      "hemlines rising slightly above the knee",
      "military-inspired fashion elements",
      "utilitarian styles due to wartime fabric rationing"
    ],
    "socialExpectations": [
      "increased expectations for women's participation in social events",
      "formal dress codes for evening gatherings",
      "customary respect for authority figures"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the Battle of Britain continues as air raids over London persist",
      "the US remains neutral yet increasingly supportive of Britain through Lend-Lease Act",
      "tensions rise as Nazi forces invade Greece"
    ],
    "politicalClimate": "The atmosphere is charged with uncertainty as the war in Europe rages, with concerns about the US joining the conflict looming over public consciousness.",
    "economicConditions": "Rationing of goods is becoming more entrenched, leading to increased black market activity and a strain on household budgets.",
    "socialIssues": [
      "displacement of families due to the war",
      "growing number of women entering the workforce",
      "increasing anti-communist sentiments"
    ],
    "internationalNews": [
      "reports of Nazi dominance in Europe",
      "allied forces preparing for impending conflicts in North Africa",
      "heightened military mobilization in various nations"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'I'll Be Home for Christmas'",
        "Duke Ellington's swing music",
        "the Andrews Sisters' harmonies"
      ],
      "films": [
        "'Rebecca' directed by Alfred Hitchcock",
        "'The Great Dictator' by Charlie Chaplin",
        "'The Letter' starring Bette Davis"
      ],
      "theater": [
        "'The Glass Menagerie' by Tennessee Williams",
        "'The Little Foxes' by Lillian Hellman",
        "'The King and I' (Broadway debut postponed)"
      ],
      "radio": [
        "The Shadow",
        "Gunsmoke",
        "War of the Worlds replays"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Grapes of Wrath' by John Steinbeck",
        "'For Whom the Bell Tolls' by Ernest Hemingway",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "historical novels",
        "war literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercially available radar systems",
        "early computers designed for military use",
        "advancements in radio technology for clearer transmission"
      ],
      "commonDevices": [
        "table radios in homes",
        "early television sets in affluent households",
        "manual typewriters"
      ],
      "emergingTrends": [
        "increased use of propaganda in media",
        "growing interest in personal computing advancements",
        "development of more sophisticated military technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pound of sugar: one shilling",
        "Train ticket to the next town: two shillings"
      ],
      "commonActivities": [
        "hosting dinner parties",
        "participating in community fundraisers",
        "gathering for card games and dances"
      ],
      "socialRituals": [
        "attending church services on Sundays",
        "engaging in neighborhood watch meetings",
        "participating in wartime scrap drives"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "the upper class continues to maintain social events despite the war",
      "working-class families face increasing hardships"
    ],
    "gender": [
      "women are celebrated for their contributions to the workforce",
      "traditional gender roles are slowly beginning to shift"
    ],
    "race": [
      "racial tensions remain high in urban areas",
      "increased visibility of African American contributions to wartime efforts"
    ],
    "generalNorms": [
      "a sense of duty and patriotism permeates society",
      "growing acceptance of diverse social roles for women",
      "conservative values still hold strong, especially in rural areas"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth mingled with the crispness of falling leaves, creating a rich, nostalgic aroma that filled the air.",
    "The sound of rain against window panes was a constant reminder of the weather’s somber mood, with the occasional rumble of thunder echoing in the distance.",
    "Soft whispers and the clinking of glasses punctuated the tension in the hotel’s lounge, where a mix of laughter and suspicion lingered heavily in the air."
  ],
  "paragraphs": [
    "As November 1940 crept along the calendar, the coastal town was enveloped by a thick blanket of overcast skies and occasional rain, typical for this time of year. The days grew shorter, with twilight descending by 4:30 PM, casting a dim and moody atmosphere over the surroundings. Guests at the hotel found themselves drawn into the warmth of its interior, gathering in small groups, the tension palpable as whispers of the ongoing war and the fate of nations filled the air. Thanksgiving approached, yet the spirit of the holiday seemed muted, overshadowed by the war's relentless grip on everyday life.",
    "Fashion reflected the era's complexities, with men donning double-breasted wool suits and tweed blazers, while women opted for tea-length dresses cinched at the waist, their attire often accentuated by broad-brimmed hats and gloves. The designs were influenced by wartime fabric rationing, leading to innovative use of materials and a shift toward utilitarian styles. Social expectations held firm as evening gatherings called for formal dress, yet a more relaxed approach emerged in casual settings, where corduroy pants and knit sweaters became commonplace.",
    "Daily life in November 1940 was shaped by a mixture of resilience and anxiety. Rationing continued to put pressure on household budgets, with a loaf of bread costing four pence and train tickets to nearby towns priced at two shillings. Despite economic strains, communities came together for charity events and social gatherings, where card games and lively conversations replaced the quiet of homes. Women, increasingly visible in the workforce, were celebrated for their contributions, yet traditional gender roles continued to exert influence, especially in more conservative circles. The atmosphere was charged with the weight of uncertainty as the world teetered on the brink of further conflict."
  ],
  "note": "",
  "cost": 0.00112270455,
  "durationMs": 26207
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of hotel guests, drawn together by the promise of a seaside retreat, becomes ensnared in a web of deception as the pressures of post-war society and the specter of Cold War tensions heighten their suspicions of one another.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The shifting dynamics of women entering the workforce due to WWII create a backdrop of tension and competition, while the early Cold War fosters an atmosphere of distrust and paranoia among the guests."
  },
  "setting": {
    "location": "A modest seaside hotel on a remote stretch of coastline",
    "institution": "Hotel",
    "weather": "Overcast skies with occasional rain, typical of a coastal climate in the late spring."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an impersonation method, where a masquerade of double identity — a disguise exploited to seem to be in two places — breaks the assumed alibi."
}

### LOCKED_FACTS
[
  {
    "id": "light_source_angle",
    "value": "forty-five degrees",
    "description": "The angle of the light source necessary to cast the desired shadow."
  },
  {
    "id": "distance_mirror",
    "value": "ten feet",
    "description": "The distance between the mirror and the light source."
  },
  {
    "id": "hour_of_murder",
    "value": "half past eight",
    "description": "The established time of the murder according to witnesses."
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
  "redHerringCount": 0,
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
      "category": "physical"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
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
      "category": "testimonial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
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
