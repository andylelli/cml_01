# Actual Prompt Record

- Run ID: `mystery-1784474957442`
- Project ID: ``
- Timestamp: `2026-07-19T15:32:25.700Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `a591613b7418e8ea`

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
    "title": "The Delayed Poisoning",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Dilapidated Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "delayed-action poisoning"
    }
  },
  "death_method": "poisoned with a botanical extract",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A meticulous investigator with a keen eye for detail.",
      "private_secret": "Has a hidden past as a wartime operative.",
      "motive_seed": "Justice for the victim.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Desire to solve the case and bring justice.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Expert",
      "relationships": [
        "Victim's doctor"
      ],
      "public_persona": "Respected physician with a calm demeanor.",
      "private_secret": "Has been prescribed a rare botanical extract for personal use.",
      "motive_seed": "Professional rivalry.",
      "motive_strength": "moderate",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to hotel kitchen"
      ],
      "behavioral_tells": [
        "Inconsistent information about the victim's health"
      ],
      "stakes": "Reputation at stake.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Military Veteran",
      "relationships": [
        "Former colleague of the victim"
      ],
      "public_persona": "Stoic and honorable.",
      "private_secret": "Carries trauma from the war that affects his judgment.",
      "motive_seed": "Jealousy over the victim's success.",
      "motive_strength": "strong",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "low",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Nervous when discussing the victim's past"
      ],
      "stakes": "Honor and reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Victim",
      "relationships": [],
      "public_persona": "Charming and sociable.",
      "private_secret": "Had a secret relationship with the victim.",
      "motive_seed": "Desire for revenge over a personal slight.",
      "motive_strength": "moderate",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to hotel kitchen"
      ],
      "behavioral_tells": [
        "Defensive when questioned about her past with the victim"
      ],
      "stakes": "Emotional turmoil.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Friendly and approachable.",
      "private_secret": "Had been blackmailing another guest.",
      "motive_seed": "Fear of exposure.",
      "motive_strength": "strong",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to hotel kitchen"
      ],
      "behavioral_tells": [],
      "stakes": "Life and reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Rival Businessman",
      "relationships": [
        "Business rival of the victim"
      ],
      "public_persona": "Cunning and ambitious.",
      "private_secret": "Planned to eliminate the victim to take over her business.",
      "motive_seed": "Professional jealousy.",
      "motive_strength": "strong",
      "alibi_window": "7 PM to 9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Evasive when questioned about the victim's recent activities"
      ],
      "stakes": "Financial power.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Hugo Vane"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In a dilapidated seaside hotel, the charming Sylvia Trent is found dead, apparently from natural causes. However, as Detective Beatrice Quill investigates, she uncovers a web of jealousy, rivalry, and the sinister use of delayed-action poison."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The poison, a rare botanical extract, is carefully dosed to coincide with moments when the victim's metabolic rate is at its slowest, leading to a delayed reaction that masks the true time of poisoning.",
      "delivery_path": [
        {
          "step": "Hugo Vane administers the poison in the victim's drink during dinner."
        }
      ]
    },
    "outcome": {
      "result": "Sylvia's death is initially attributed to natural causes, but later revealed as murder."
    }
  },
  "false_assumption": {
    "statement": "The victim died from natural causes due to her fragile health.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses noted the victim's complaints about her health, implying a natural decline.",
    "what_it_hides": "The calculated administration of poison that exploits her health complaints."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch prescribed the same botanical extract found at the scene.",
      "Witnesses saw her near the victim shortly before death."
    ],
    "the_one_flaw": "The poison was not in the prescribed dosage but was added to the victim's drink by someone else.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A bottle of rare botanical extract is found in Dr. Finch's possession.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The extract was prescribed to her for personal use.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Witnesses heard an argument between Sylvia and Hugo just before her death.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "Their argument was about business matters, unrelated to the poisoning.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present in the hotel at the time of the murder and had access to the victim."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner time at 8 PM.",
        "Time of death around 9:30 PM."
      ],
      "windows": [
        "Dr. Finch's alibi window from 9 PM to 10 PM.",
        "Hugo's alibi window from 7 PM to 9 PM."
      ],
      "contradictions": [
        "Witnesses claim to have seen Sylvia alive at 9:15 PM."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Hugo Vane"
      ],
      "objects": [
        "The victim's drink",
        "The rare botanical extract"
      ],
      "permissions": [
        "All suspects had access to the hotel kitchen."
      ]
    },
    "physical": {
      "laws": [
        "The poison's effects depend on the victim's metabolic rate."
      ],
      "traces": [
        "Presence of the poison in the victim's bloodstream."
      ]
    },
    "social": {
      "trust_channels": [
        "Victim's trust in Dr. Finch as her physician."
      ],
      "authority_sources": []
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "A half-empty glass found near the victim's body contains remnants of a rare botanical extract.",
        "correction": "The extract indicates intentional poisoning rather than natural causes.",
        "effect": "Narrows suspect pool to those with access to the extract.",
        "required_evidence": [
          "The glass found near the victim's body.",
          "The bottle of rare botanical extract in Dr. Finch's possession."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses claim they heard Sylvia complaining about her health earlier that evening.",
        "correction": "Her complaints were exploited by the murderer to mask the true nature of her death.",
        "effect": "Eliminates the idea she was simply unwell.",
        "required_evidence": [
          "Witness statements about her health complaints.",
          "Time of death around 9:30 PM."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Finch's alibi places her in the kitchen during the time of death.",
        "correction": "Her presence in the kitchen allows for access to the victim's drink for poisoning.",
        "effect": "Reinforces the possibility of her involvement.",
        "required_evidence": [
          "Dr. Finch's alibi from 9 PM to 10 PM.",
          "Access to the kitchen."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A staged dinner is set up to observe reactions when a similar botanical extract is introduced, revealing knowledge of the poison's effects.",
    "knowledge_revealed": "The revealed facts are extract, suspect, and half-empty.",
    "pass_condition": "Only the true culprit displays knowledge of the poison's delayed effects.",
    "evidence_clues": [
      "clue_4",
      "clue_1",
      "clue_mechanism_visibility_core",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The glass with botanical extract (early) and witness statements (mid) show intentional poisoning. Step 2: Dr. Finch's alibi (mid) reinforces her possible access. Step 3: The staged dinner (discriminating test) reveals who knows about the poison."
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
        "Observe the reactions of the suspects"
      ],
      "test_type": "knowledge of the poison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Lack of any motive and inconsistent access to the victim's drink.",
        "supporting_clues": [
          "clue_mid_2",
          "clue_early_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm he was in the lobby when the poisoning occurred.",
        "supporting_clues": [
          "clue_mid_3",
          "clue_early_3"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 9 PM to 10 PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 8 PM to 10 PM",
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Found in the victim's room."
      },
      {
        "clue_id": "clue_early_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements."
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
        "delivery_method": "Witness statement."
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_hugo_vane",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "The glass found near the victim."
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
        "delivery_method": "Dr. Finch's alibi."
      },
      {
        "clue_id": "clue_mid_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness account."
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, the diligent hotel manager, is caught in a web of desperation and financial ruin, threatening to unravel the very establishment she has worked to uphold.",
    "publicPersona": "Eleanor commands respect with her poised demeanor and infectious charm. Guests are drawn to her hospitality, and her ability to maintain the hotel’s facade of grandeur, even as the walls threaten to crumble around her, is nothing short of impressive.",
    "privateSecret": "Beneath the polished exterior, Eleanor is drowning in a sea of debt, the result of a series of ill-fated investments. Her heart races at the thought of losing the hotel, the only legacy she has left, and the looming inheritance from the victim is her only hope for salvation.",
    "motiveSeed": "With the victim's influence over the inheritance, Eleanor feels the ground beneath her shift. The prospect of losing everything drives her to the edge, igniting a fierce desperation that clouds her judgment.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been preparing for the evening dinner service, a task that demands her utmost attention and allows her to slip into the shadows unnoticed.",
    "accessPlausibility": "easy",
    "stakes": "Her financial stability hangs in the balance, and the future of the hotel rests on her shoulders, intensifying the pressure she faces.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her sentences with a subtle sarcasm that betrays her underlying tension. She has a penchant for using euphemisms, often glossing over unpleasant truths with a smile.",
    "signatureTic": "‘One must always keep the guests happy, don’t you think?’",
    "internalConflict": "Eleanor grapples with her fear of failure, haunted by the thought of disappointing those who depend on her and the weight of her financial decisions. The possibility of betrayal looms large, casting shadows on her relationships.",
    "personalStakeInCase": "The crime threatens not only her livelihood but her very identity; without the hotel, she fears she will be lost in a world that no longer needs her.",
    "paragraphs": [
      "Eleanor Voss stands at the helm of the dilapidated seaside hotel, a figure of authority amidst the crumbling walls. With her carefully curated charm, she greets guests as if they were old friends, expertly masking the storm brewing within. Each polite smile is a shield against the financial chaos threatening to engulf her. She knows that beneath the veneer of hospitality lies a fragile empire, one that could shatter with a single misstep.",
      "As the evening approaches, Eleanor’s thoughts turn to the victim, whose impending inheritance is a double-edged sword. The prospect of financial rescue is tantalizing, yet it stirs a deep-seated fear of losing her grasp on the hotel to someone who seems to hold all the cards. She recalls the countless nights spent poring over ledgers, the dread of seeing red ink swirl in her mind like a tempest. The hotel is her life, and the thought of losing it is unbearable.",
      "In the solitude of the kitchen, Eleanor prepares for dinner service, her mind racing. Each chopped onion becomes a symbol of her mounting anxiety, and the smell of garlic wafting through the air serves as a reminder of the stakes at play. She must maintain the illusion of control while her world spirals, fearing that any slip could lead to her undoing. The guests are blissfully unaware of the storm brewing, and she intends to keep it that way.",
      "Yet, as the clock ticks closer to dinner, Eleanor can’t shake the feeling that someone is watching, waiting for the moment she falters. Her heart races, and she questions her instincts. Are the whispers of her desperation audible to those around her? She knows she must tread carefully, balancing the delicate act of hospitality with the growing tension of her financial ruin. In this game of survival, trust is a luxury she can no longer afford."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a passionate physician entangled in a web of secrets and betrayal, her carefully curated life threatened by the very fabric of her choices.",
    "publicPersona": "As a new doctor in town, Mallory is dedicated and driven, known for her tireless commitment to women's health. Patients trust her, and her reputation as a competent physician is steadily rising, making her an integral part of the community.",
    "privateSecret": "Beneath her professional facade lies a scandalous affair with a wealthy benefactor, a secret that could shatter her career if exposed. The benefactor's ties to the victim create a precarious situation, one she fears could unravel her carefully constructed life.",
    "motiveSeed": "The victim’s threat to expose their affair looms large, casting a dark shadow over Mallory’s ambitions. The thought of losing financial support for her clinic, and the ensuing scandal, drives her to desperation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Mallory claims to have been at the clinic, attending to a patient, a busy schedule that allows her to slip away from scrutiny.",
    "accessPlausibility": "possible",
    "stakes": "Her career, reputation, and the future of her clinic depend on her ability to navigate this labyrinth of deceit and betrayal.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with a brisk, confident tone, often laced with irony. She has a habit of raising her eyebrow when making a particularly cutting remark, as if daring her audience to respond.",
    "signatureTic": "‘You can’t cure ignorance, but I can certainly try.’",
    "internalConflict": "Mallory is torn between her desire for success and the guilt of her choices. She wrestles with the moral implications of her affair and the lengths she will go to protect her reputation, fearing that the truth will cost her everything.",
    "personalStakeInCase": "The crime puts her career and reputation on the line; the exposure of her affair could derail her ambitions and shatter her dreams of becoming a respected physician.",
    "paragraphs": [
      "Dr. Mallory Finch strides through the hotel lobby, her presence commanding yet tinged with an undercurrent of anxiety. As a newcomer in town, she has worked tirelessly to establish her reputation. Patients adore her, and she is seen as a beacon of hope for women's health. Yet, beneath the surface, a tempest brews. The affair with her benefactor looms like a dark cloud, threatening to unleash a storm that could ruin everything.",
      "She recalls the moment she first crossed paths with the victim, a chance encounter that quickly spiraled into a tangled web of secrets. The victim, with her keen intuition, sensed the hidden truths lurking beneath Mallory's confident exterior. Now, the threat of exposure hangs over Mallory like a guillotine, and the stakes have never been higher. She must tread carefully, balancing her dual life while maintaining the facade of a dedicated physician.",
      "While attending to patients, Mallory's mind races with the implications of the victim's threat. The clinic, her passion and purpose, is at risk of crumbling beneath the weight of scandal. She navigates each appointment with precision, but the tension is palpable. The thought of losing her financial support, her reputation, and the very essence of who she is gnaws at her insides.",
      "As she prepares to leave the clinic for the evening, Mallory glances at her reflection, a fleeting moment of self-doubt creeping in. Who is she becoming? The affair has become a double-edged sword, promising both financial security and the potential for devastating fallout. She knows she must confront her choices, but the fear of what lies ahead paralyzes her. In this game of secrets, trust is a luxury she can no longer afford."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, wrestles with the ghosts of his past while striving to redefine his legacy amidst the chaos of a faltering hotel.",
    "publicPersona": "Ivor is a disciplined and respected figure, known for his strong opinions and unwavering principles. His presence commands attention, and he is often seen as a bastion of traditional values in a rapidly changing world.",
    "privateSecret": "Haunted by the memories of war, Ivor struggles with PTSD, leading to a volatile temperament that clashes with his disciplined exterior. The weight of his experiences shapes his interactions, often leaving him isolated and misunderstood.",
    "motiveSeed": "Ivor believes the victim is a roadblock to his vision of transforming the hotel into a haven for naval veterans, igniting a fierce resentment that bubbles beneath his surface.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor claims to have been in the hotel’s library, seeking solace in books, a refuge from the chaos around him.",
    "accessPlausibility": "possible",
    "stakes": "His vision for the hotel and his legacy as a captain, now intertwined with the future of the establishment, are at stake.",
    "humourStyle": "deadpan",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks in a clipped, authoritative tone, often punctuating his statements with a sharp edge. He has a tendency to use nautical metaphors, which sometimes leave others bewildered.",
    "signatureTic": "‘A ship without a captain is doomed to drift.’",
    "internalConflict": "Ivor grapples with the ghosts of his past, the memories of wartime horrors that refuse to fade. His struggle to adapt to a world that seems to have moved on weighs heavily on him, creating a tension that threatens to erupt.",
    "personalStakeInCase": "The crime jeopardizes his vision for the hotel, a place where he hopes to create a sanctuary for veterans. Losing this dream would mean losing a part of himself.",
    "paragraphs": [
      "Captain Ivor Hale stands in the hotel’s library, surrounded by dusty tomes and the ghosts of his past. A retired naval officer, he has always been a man of discipline, a rock in the tumultuous sea of life. Yet, beneath the surface, the remnants of war cling to him like barnacles, weighing him down. The memories of his service haunt him, and the shadows of PTSD threaten to consume him, leaving him at odds with the world around him.",
      "As he pores over a book, his mind drifts to the victim, a woman he believes is undermining his vision for the hotel. The idea of transforming it into a retreat for naval veterans has become a personal mission, yet the victim’s influence looms large, creating a barrier he cannot breach. The resentment churns within him, mingling with the guilt of his past, and he struggles to reconcile his anger with the desire for progress.",
      "Ivor's interactions with others are often fraught with tension, his authoritative tone masking the vulnerability beneath. He speaks in clipped phrases, his words sharp as a sailor's knife. Those who cross his path are often met with a cold stare, a reminder that he is not a man to be trifled with. The nautical metaphors slip into his speech, leaving others bewildered, but they provide him with a sense of comfort, a connection to a world he once commanded.",
      "As the evening approaches, Ivor wrestles with the duality of his existence—the captain who once commanded a ship now adrift in a sea of uncertainty. The hotel represents more than a business; it is a lifeline to a purpose he desperately seeks. The crime threatens to unravel his dreams, and he fears that, like a ship without a captain, he may be doomed to drift aimlessly into the abyss."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious journalist, finds herself entangled in a web of secrets, seeking the truth while grappling with her own moral compass.",
    "publicPersona": "As an outsider in the community, Beatrice is known for her tenacity and ambition, unearthing stories that challenge the status quo. Her reputation as a journalist precedes her, and she is often seen as a force to be reckoned with.",
    "privateSecret": "Beneath her ambitious exterior lies a hidden agenda—she is researching the dark history of the victim’s family, hoping to expose long-buried secrets for a sensational article that could propel her career.",
    "motiveSeed": "To Beatrice, the victim represents a barrier to uncovering a scandal that could bring her fame and recognition, igniting an insatiable thirst for the truth.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims to have been interviewing guests in the lobby, gathering information for her article, a task that keeps her in the public eye.",
    "accessPlausibility": "possible",
    "stakes": "Her career hinges on the potential for a groundbreaking story, and the crime could either elevate her or destroy her.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an animated cadence, her words flowing like a river. She has a tendency to interject witty observations, often using irony to punctuate her points, and her laughter is both infectious and sharp.",
    "signatureTic": "‘Isn’t it fascinating how the truth hides in plain sight?’",
    "internalConflict": "Beatrice wrestles with the ethics of her ambition, torn between her desire for recognition and the potential harm her investigation could cause. She fears that in her quest for the truth, she may lose sight of the human stories behind the headlines.",
    "personalStakeInCase": "The crime represents a pivotal moment in her career; uncovering the truth could either solidify her reputation or lead to her downfall, forcing her to confront the consequences of her ambition.",
    "paragraphs": [
      "Beatrice Quill strides through the hotel lobby, her eyes scanning the room for potential stories. An ambitious journalist, she thrives on the thrill of discovery, unearthing secrets that others would prefer to keep buried. Her reputation for challenging the status quo precedes her, and she relishes the role of the outsider, often finding herself at odds with the established norms of the community. Yet, beneath the bravado lies a gnawing conflict, one that threatens to derail her ambitions.",
      "The victim looms large in Beatrice’s mind, a barrier to the sensational article she hopes to write. The dark history of the family fascinates her, and the potential for a scandal that could catapult her career is intoxicating. She sees the truth as a prize to be won, yet the ethics of her pursuit weigh heavily on her conscience. In her quest for recognition, she fears losing sight of the human stories that lie beneath the surface, a tension that gnaws at her spirit.",
      "As she interviews guests in the lobby, Beatrice’s animated speech flows like a river, her laughter sharp and infectious. She interjects witty observations, her sardonic humor a shield against the weight of her ambition. Each conversation is a dance, a careful negotiation of information that could lead to the breakthrough she craves. Yet, the thrill of the chase is tinged with the realization that the truth can be a double-edged sword, capable of inflicting damage.",
      "As the night falls, Beatrice reflects on the stakes of her investigation. The crime represents a pivotal moment in her career, a chance to solidify her reputation or risk it all for the sake of an article. The tension between ambition and ethics looms large, and she knows that the choices she makes in the coming days will shape not only her career but her understanding of the truth itself."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "The late Sylvia Trent, a beloved retired schoolteacher, becomes the catalyst for revealing long-buried family secrets, her death echoing through the lives of those she left behind.",
    "publicPersona": "Known for her kindness and nurturing spirit, Sylvia was a beloved figure in the community, her dedication to education leaving a lasting impact on generations of students.",
    "privateSecret": "Unbeknownst to her family, Sylvia had drafted a hidden will that favored a charity over her own kin, a decision that would rock the foundations of her family’s legacy.",
    "motiveSeed": "Her new will threatened to disinherit her family, igniting tensions that simmered just beneath the surface of familial love.",
    "motiveStrength": "strong",
    "alibiWindow": "Sylvia was attending a book club meeting from six to eight, surrounded by friends who could vouch for her whereabouts.",
    "accessPlausibility": "impossible",
    "stakes": "Her death brings her family’s hidden grievances to light, forcing them to confront the truths they had long avoided.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Sylvia spoke with a gentle, nurturing tone, often using inclusive language that made her listeners feel valued. Her words were carefully chosen, reflecting her dedication to education and the well-being of those around her.",
    "signatureTic": "‘Education is the key to understanding.’",
    "internalConflict": "Though she appeared calm and nurturing, Sylvia harbored doubts about her family’s values and their ability to accept her choices. The juxtaposition of her public persona and private decisions creates a tension that underscores her relationships.",
    "personalStakeInCase": "Her death serves as a catalyst for her family’s reckoning, forcing them to confront their past and the hidden truths that threaten to fracture their bonds.",
    "paragraphs": [
      "Sylvia Trent, a retired schoolteacher, was the embodiment of kindness, her nurturing spirit leaving a mark on all who crossed her path. Known for her dedication to education, she was a beloved figure in the community, often seen as a guiding light for her students. Yet, beneath the gentle facade lay a complexity that few could see. Her decisions, particularly one involving a hidden will, would soon unravel the very fabric of her family’s legacy.",
      "With her passing, the community mourns the loss of a cherished soul, yet the echoes of her choices resonate with those she left behind. The hidden will, favoring a charity over her own kin, ignites tensions that simmered just beneath the surface of familial love. The stakes are high; her death forces her family to confront the grievances they had long buried, revealing a landscape fraught with resentment and unspoken truths.",
      "Though Sylvia was known for her gentle demeanor, she wrestled with doubts about her family’s values. The juxtaposition of her nurturing public persona and the private decisions she made forms a tension that lingers in the air like a thick fog. She had hoped her choices would reflect her commitment to education and understanding, but the reality of her family’s reaction looms ominously on the horizon.",
      "As the investigation unfolds, Sylvia’s death serves as a catalyst for her family’s reckoning, forcing them to confront the truths they had long avoided. The revelations that follow will not only reshape their relationships but will also challenge the very notion of legacy, leaving a trail of unanswered questions in the wake of her absence."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a charismatic real estate developer, finds his ambitious plans unraveling amidst a backdrop of financial ruin and desperation.",
    "publicPersona": "Hugo is known for his charm and business acumen, a charismatic figure with bold plans for development that often leave others in awe of his vision.",
    "privateSecret": "Beneath the suave exterior lies a man in financial trouble, depending on the victim's estate to cover debts that threaten to obliterate his reputation.",
    "motiveSeed": "Hugo’s desperation for the victim's support in a lucrative development deal tied to the estate drives him to contemplate drastic measures.",
    "motiveStrength": "strong",
    "alibiWindow": "Hugo claims to have been meeting with investors, a gathering that keeps him in the public eye and away from suspicion.",
    "accessPlausibility": "possible",
    "stakes": "His business reputation and financial stability hang in the balance, creating a sense of urgency that fuels his actions.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with a smooth, engaging tone, often punctuated by a knowing smile. His dialogue flows effortlessly, laced with clever observations and a keen awareness of his surroundings.",
    "signatureTic": "‘Everything is negotiable, my dear.’",
    "internalConflict": "Hugo grapples with the consequences of his greed, torn between ambition and the moral implications of his actions. The pressure of financial ruin looms large, creating a tension that threatens to unravel his carefully constructed life.",
    "personalStakeInCase": "The crime jeopardizes not only his business reputation but also his very identity, forcing him to confront the consequences of his ambition and the lengths he will go to secure his future.",
    "paragraphs": [
      "Hugo Vane stands at the precipice of his ambitions, a charismatic real estate developer whose charm has often been his greatest asset. Yet, beneath the polished exterior lies a man teetering on the brink of financial ruin. The stakes have never been higher, and the pressure to secure the victim's support for a lucrative development deal looms large, driving him to consider actions he once deemed unthinkable.",
      "As he navigates the hotel, Hugo’s smooth, engaging tone captivates those around him. He weaves clever observations into conversations, his knowing smile disarming even the most skeptical listeners. But beneath the charm lies a tumultuous sea of desperation, a fear of losing everything he has worked for. The victim’s influence over the estate feels like a noose tightening around his neck, and the thought of losing it all ignites a fierce urgency within him.",
      "While meeting with investors, Hugo maintains an air of confidence, but the undercurrents of anxiety tug at him relentlessly. He knows that the success of his plans hinges on the victim’s support, and the reality of his financial troubles gnaws at his insides. The tension between ambition and morality becomes a battleground in his mind, as he weighs the consequences of his actions against the potential for success.",
      "In the quiet moments, when the charm fades, Hugo grapples with the consequences of his greed. The crime threatens to unravel not just his business reputation but the very fabric of who he is. He knows that the lengths he is willing to go to secure his future may lead him down a path from which there is no return, leaving him to confront the haunting question of what he is truly willing to sacrifice for success."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seaward Hotel",
    "type": "hotel",
    "place": "Cromer",
    "country": "England",
    "summary": "A dilapidated seaside hotel on a remote stretch of the coast, catering to weary post-war tourists seeking respite.",
    "visualDescription": "The Seaward Hotel features a crumbling façade of faded pastels, a once-grand entrance adorned with chipped Art Deco motifs. Inside, narrow hallways snake through the building, leading to a lobby dominated by a cracked marble floor and discolored velvet armchairs. Large windows reveal the tumultuous sea, with salt-streaked panes blurring the view of crashing waves.",
    "atmosphere": "The air is thick with the scent of dampness and decay, while the sound of distant thunder echoes through the lobby, enhancing the feeling of unease.",
    "paragraphs": [
      "The Seaward Hotel stands defiantly against the relentless Atlantic, its once-vibrant colors now dulled by years of salt and rain. Jagged edges of Art Deco architecture jut awkwardly into the sky, a stark reminder of a more glamorous past. Inside, the lobby is a blend of faded grandeur and neglect, with its cracked marble floors and weary furniture whispering tales of long-forgotten guests. An old radio crackles softly in the corner, broadcasting news of rationing and recovery, mingling with the low hum of anxious conversations.",
      "Guests shuffle through the narrow hallways, their footsteps echoing against the peeling wallpaper, a symphony of whispers and shuffling feet. Rumors of strange occurrences swirl like the mist outside, wrapping around the shoulders of weary travelers. Staff scurry between the kitchen and the laundry, their movements hurried and secretive, as if they are part of an unspoken agreement to keep the hotel’s secrets hidden. With every creak of the wooden floors, a sense of foreboding thickens the air.",
      "As the evening descends, the hotel’s character shifts. Shadows play tricks on the mind, stretching across the disheveled lobby as the last light of day fades. The scent of damp wood and sea salt permeates the air, mixing with the faint aroma of stale tobacco from the guests’ long-forgotten cigars. Outside, the waves crash violently against the shore, a reminder of nature’s fury, while inside, the tension rises, leaving guests to question their safety within the crumbling walls."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of coastal climates, creating a damp and chilly environment.",
    "timeFlow": "Days filled with unease, punctuated by unsettling nights.",
    "mood": "Tense and uneasy, with guests whispering rumors of strange occurrences in the hotel.",
    "eraMarkers": [
      "old radio playing news broadcasts",
      "manual typewriters in the front office",
      "rationed fuel leading to limited travel"
    ],
    "sensoryPalette": {
      "dominant": "Dampness and decay",
      "secondary": [
        "Faded elegance",
        "Whispers of the past"
      ]
    },
    "paragraphs": [
      "The air is heavy with the scent of damp wood and salt, creating an oppressive atmosphere that clings to every surface. The distant sound of thunder rumbles as rain patters against the windows, creating a rhythm that adds to the tension within the hotel. Soft whispers fill the corridors as guests share their fears and rumors, their voices mingling with the crackle of the radio announcing news of the outside world, a stark reminder of the post-war reality outside.",
      "As night falls, the hotel transforms; shadows deepen, and the flickering of gas lamps casts a ghostly glow on the peeling wallpaper. The scent of mildew and dust rises with every breath, mixing with the tang of the sea air. The sound of crashing waves becomes a constant reminder of the isolation, while the faint echo of laughter from the bar feels like an intrusion on the gathering darkness."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A dimly lit room lined with dusty bookshelves, the air thick with must and neglect. A single oil lamp flickers on a large oak table, casting shadows that dance across the faded wallpaper.",
      "sensoryDetails": {
        "sights": [
          "flickering oil lamp light",
          "dark wood furniture",
          "cobwebs in corners",
          "cracked window panes"
        ],
        "sounds": [
          "whispers echoing off the walls",
          "pages rustling in the silence",
          "the creak of old floorboards",
          "distant thunder rumbling",
          "the ticking of a wall clock"
        ],
        "smells": [
          "musty tomes and old paper",
          "faint scent of mildew",
          "smoke from burnt matches",
          "damp wood and leather",
          "wet earth from outside"
        ],
        "tactile": [
          "cold leather-bound books",
          "rough wooden table surface",
          "chill from the cracked window",
          "soft dust coating the shelves",
          "worn fabric of the armchair"
        ]
      },
      "accessControl": "Accessible only to guests during daylight; locked at night. Staff enter for cleaning and maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "soft grey light filtering in",
            "shadows stretching across the floor",
            "wet pages of an open book",
            "water pooling on the window sill"
          ],
          "sounds": [
            "steady rain tapping on glass",
            "the rustle of wet pages",
            "muffled voices from the hallway",
            "the thud of a book dropped",
            "the distant crash of waves"
          ],
          "smells": [
            "fresh rain on stone",
            "damp paper and ink",
            "the musty scent of old books",
            "wet earth and moss outside",
            "the faint aroma of brewed tea"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light through clouds",
            "shadows growing longer",
            "dust motes dancing in the air",
            "the clock's hands creeping forward",
            "a single book lying open"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the soft rustle of a page turning",
            "the creak of the floor underfoot",
            "the wind howling outside",
            "the ticking of time"
          ],
          "smells": [
            "old leather and dust",
            "the faint scent of tobacco",
            "beeswax polish on furniture",
            "damp fabric from the armchair",
            "the musty scent of neglected books"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the last light of day fading",
            "the glow of the oil lamp flickering",
            "the silhouettes of books against the wall",
            "a window revealing a starry sky"
          ],
          "sounds": [
            "the soft tick of the clock",
            "the distant sound of laughter",
            "the crackle of the oil lamp wick",
            "the rustle of a visitor's coat",
            "the whisper of the wind outside"
          ],
          "smells": [
            "warm oil from the lamp",
            "the scent of polished wood",
            "the faint aroma of old spices",
            "the cool night air seeping in",
            "the lingering scent of smoke"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library is a refuge of sorts, but today it feels like a tomb. Dusty shelves line the walls, their tomes filled with forgotten stories and secrets. An oil lamp flickers weakly on the large oak table, casting ghostly shadows that dance across the faded wallpaper. The air is thick with the musty scent of old paper and mildew, creating an oppressive atmosphere that weighs heavily on anyone who enters. In the corner, a single chair sits abandoned, its fabric worn and frayed, hinting at late-night conversations now turned to whispers of dread.",
        "As the rain begins to patter against the window, the library transforms into a sanctuary of secrets. The sound of rustling pages echoes softly, interrupted only by the distant rumble of thunder. A sense of foreboding hangs in the air, as if the walls themselves are listening to the hushed debates of the guests. Here, in this dimly lit room, the truth lurks among the shadows, waiting to be uncovered."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Dining Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A large room with long tables set for dinner, adorned with tarnished silverware and chipped china. The walls are decorated with faded maritime paintings, and large windows overlook the tumultuous sea.",
      "sensoryDetails": {
        "sights": [
          "tarnished silverware gleaming dimly",
          "faded maritime paintings",
          "stormy sea visible through windows",
          "cracked floor tiles"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft murmurs of conversation",
          "the scrape of chairs",
          "the distant crash of waves",
          "the whir of the ceiling fan"
        ],
        "smells": [
          "roasted meat and vegetables",
          "faint scent of salt from the sea",
          "the aroma of baked bread",
          "musty air from the old building",
          "the lingering scent of wine"
        ],
        "tactile": [
          "cold metal of cutlery",
          "rough texture of the tablecloth",
          "smooth china plates",
          "the chill of the sea breeze",
          "the warmth of a nearby candle flame"
        ]
      },
      "accessControl": "Open to guests during meal times; staff-only access before and after service for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through windows",
            "water droplets clinging to the glass",
            "empty tables awaiting guests",
            "the sea a dull slate grey",
            "a lone seagull perched outside"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "the distant crash of waves",
            "the clinking of dishes in the kitchen",
            "muffled conversations from staff",
            "the rustle of a newspaper"
          ],
          "smells": [
            "freshly baked pastries",
            "the scent of brewing coffee",
            "the tang of salt in the air",
            "the musty smell of wet wood",
            "the aroma of cleaning supplies"
          ],
          "mood": "melancholic stillness"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "tables set for dinner",
            "faded colors of the paintings",
            "the sea churning outside",
            "the flicker of candle flames"
          ],
          "sounds": [
            "the soft murmur of guests",
            "the rustle of napkins",
            "the clatter of plates",
            "the distant call of seagulls",
            "the whirr of the kitchen in the background"
          ],
          "smells": [
            "aroma of simmering stew",
            "the scent of baked goods",
            "the tang of fresh herbs",
            "the musty air of the room",
            "the faint aroma of wine"
          ],
          "mood": "tension in the air"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "the last rays of sun reflecting off the sea",
            "shadows dancing on the walls",
            "the warmth of the room"
          ],
          "sounds": [
            "laughter and conversation",
            "the clinking of glasses",
            "the distant sound of music from a radio",
            "the crackle of a fire in the hearth",
            "the gentle surf outside"
          ],
          "smells": [
            "the rich aroma of dinner",
            "the scent of wine and spirits",
            "the warmth of baked bread",
            "the salty tang of the ocean",
            "the faint scent of flowers from a centerpiece"
          ],
          "mood": "festive yet uneasy"
        }
      ],
      "paragraphs": [
        "The dining room is a blend of faded elegance and haunting beauty. Long tables are set with tarnished silverware and chipped china, creating a stark contrast against the backdrop of stormy seas visible through the large windows. The air is thick with the aroma of roasted meats and baked bread, mingling with the faint scent of salt from the ocean. Guests gather here, their voices a soft murmur against the clinking of cutlery, as they share meals and secrets alike. The flickering candlelight casts dancing shadows on the walls, adding to the room's enigmatic charm.",
        "As the evening progresses, laughter and conversation fill the air, a temporary reprieve from the tension that has settled over the hotel. Yet, beneath the surface, unease simmers, as guests exchange wary glances and hushed whispers. The distant crash of waves serves as a reminder of the isolation surrounding them, a world away from the comforts of home. In this room, where meals are shared and stories are spun, the truth lingers just out of reach, waiting for the right moment to surface."
      ]
    },
    {
      "id": "staff_kitchen",
      "name": "The Staff Kitchen",
      "type": "interior",
      "purpose": "Food preparation and staff meetings",
      "visualDetails": "A cramped space filled with old appliances, worn countertops, and shelves stocked with mismatched crockery. The air is thick with steam and the scent of cooking.",
      "sensoryDetails": {
        "sights": [
          "cramped space with old appliances",
          "worn countertops covered in flour",
          "shelves stocked with mismatched dishes",
          "flickering fluorescent lights",
          "the steam rising from pots"
        ],
        "sounds": [
          "clattering of pots and pans",
          "the hiss of boiling water",
          "staff chatting in low tones",
          "the thump of food being dropped",
          "the whir of an old refrigerator"
        ],
        "smells": [
          "scent of frying onions",
          "the aroma of fresh bread",
          "steam rising from boiling pots",
          "the tang of spices",
          "the musty scent of old food storage"
        ],
        "tactile": [
          "rough texture of the countertops",
          "cold metal of the fridge",
          "warmth from the stove",
          "sticky flour on hands",
          "the chill of the morning air seeping through cracks"
        ]
      },
      "accessControl": "Restricted to kitchen staff and management; locked after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "steam rising from boiling pots",
            "the dim light filtering through the window",
            "staff hurriedly preparing breakfast",
            "water droplets on the glass",
            "the clutter of pans and utensils"
          ],
          "sounds": [
            "the rush of water in the sink",
            "the sizzle of bacon in the pan",
            "the chatter of staff preparing meals",
            "the sound of knives chopping",
            "the distant sound of rain hitting the roof"
          ],
          "smells": [
            "the scent of fresh coffee brewing",
            "the aroma of frying bacon",
            "the tang of citrus",
            "the musty smell of the old kitchen",
            "the warmth of baked goods"
          ],
          "mood": "busy and chaotic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows on surfaces",
            "pots simmering on the stove",
            "staff moving quickly between counters",
            "an open cookbook on the table",
            "the clutter of ingredients everywhere"
          ],
          "sounds": [
            "the clatter of utensils",
            "the soft murmur of conversation",
            "the hiss of the stove",
            "the sound of a knife chopping",
            "the faint buzz of a radio"
          ],
          "smells": [
            "the aroma of simmering stew",
            "the scent of fresh herbs",
            "the musty air of the kitchen",
            "the lingering smell of previous meals",
            "the sweetness of desserts baking"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of lights in the kitchen",
            "the steam rising from pots",
            "a well-worn kitchen table",
            "the reflection of the kitchen in a shiny pot"
          ],
          "sounds": [
            "the laughter of staff winding down",
            "the clinking of dishes being cleaned",
            "the gentle hum of conversation",
            "the sound of pots being put away",
            "the distant crackle of the radio"
          ],
          "smells": [
            "the rich aroma of dinner preparations",
            "the scent of garlic and herbs",
            "the warm scent of baked bread",
            "the smell of cleaning supplies",
            "the faint aroma of lingering meals"
          ],
          "mood": "relaxed and jovial"
        }
      ],
      "paragraphs": [
        "The staff kitchen is a cramped and bustling space, filled with the sounds of clattering pots and the hiss of boiling water. Old appliances line the walls, their surfaces worn and familiar, as staff members move quickly between counters, preparing meals for the guests. The air is thick with steam and the rich scent of frying onions, a comforting yet chaotic atmosphere that serves as the heart of the hotel. Here, secrets are exchanged alongside recipes, and the camaraderie of the staff is palpable amid the clatter of utensils.",
        "As evening approaches, the kitchen transforms into a hub of activity, laughter echoing off the walls as staff wind down from a long day. The warm glow of lights casts a welcoming ambiance, while the scent of freshly baked bread fills the air, mingling with the aromas of simmering dinners. Yet, beneath the jovial surface, tension simmers; whispers of the day's events linger in the corners, as staff exchange wary glances, knowing they are part of a mystery that unfolds beyond their kitchen doors."
      ]
    },
    {
      "id": "roof_access",
      "name": "The Roof Access",
      "type": "transitional",
      "purpose": "Restricted access for maintenance and observation",
      "visualDetails": "A narrow staircase leads to the rooftop, where a weathered wooden door creaks open to reveal a view of the turbulent sea and the distant horizon, framed by a rickety railing.",
      "sensoryDetails": {
        "sights": [
          "narrow, winding staircase",
          "weathered wooden door",
          "storm clouds gathering in the distance",
          "the churning sea below",
          "the rusted railing at the edge"
        ],
        "sounds": [
          "the creaking of the door",
          "the howling wind",
          "the distant crash of waves",
          "the flutter of loose shingles",
          "the echo of footsteps on stairs"
        ],
        "smells": [
          "the salty tang of the sea",
          "fresh rain in the air",
          "the scent of old wood",
          "the musty smell of the stairwell",
          "the faint aroma of smoke from the chimney"
        ],
        "tactile": [
          "rough texture of the wooden door",
          "cool metal of the railing",
          "chill of the wind on skin",
          "the dampness of the air",
          "the creak of worn steps underfoot"
        ]
      },
      "accessControl": "Access restricted to maintenance staff; guests prohibited. Monitored by front desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked stairs",
            "dark clouds looming above",
            "water pooling at the base of the door",
            "the sea grey and angry",
            "the distant outline of a lighthouse"
          ],
          "sounds": [
            "the steady patter of rain",
            "water dripping from the eaves",
            "the roar of waves crashing",
            "the rustle of leaves in the wind",
            "the distant call of a foghorn"
          ],
          "smells": [
            "fresh rain mingling with salt",
            "the scent of damp earth",
            "the musty smell of the stairwell",
            "the crispness of the ocean air",
            "the faint aroma of wet wood"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "the sea churning with whitecaps",
            "the horizon blurred by mist",
            "the silhouette of gulls overhead"
          ],
          "sounds": [
            "the roar of the ocean",
            "the howling wind",
            "the creaking of the railing",
            "the distant sound of thunder",
            "the rustle of loose shingles"
          ],
          "smells": [
            "the salty tang of the sea",
            "the scent of damp wood",
            "the mustiness of the stairway",
            "the ozone of impending storms",
            "the faint aroma of smoke from chimneys"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the sun setting on the horizon",
            "the sea shimmering with orange hues",
            "the stars beginning to twinkle",
            "the rickety railing silhouetted against the sky",
            "the distant lights of the hotel glowing"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "the soft rustle of leaves",
            "the distant laughter from below",
            "the creak of the wooden door",
            "the whisper of the wind"
          ],
          "smells": [
            "the fresh scent of the ocean",
            "the aroma of evening air",
            "the faint smell of smoke from fireplaces",
            "the tang of salt in the breeze",
            "the coolness of night settling in"
          ],
          "mood": "quiet contemplation"
        }
      ],
      "paragraphs": [
        "The roof access is a hidden passage, marked by a narrow staircase that winds its way up to the top. A weathered wooden door creaks open to reveal a breathtaking view of the tumultuous sea, framed by a rickety railing. Here, the salty tang of the ocean fills the air, mingling with the scent of damp wood. The sounds of crashing waves below create a constant reminder of the stormy weather, while the chill of the wind sends shivers down the spine. This space is one of isolation, a vantage point that offers both beauty and danger.",
        "As the evening draws near, the atmosphere shifts. The sun sets on the horizon, casting a warm glow over the sea, while the stars begin to twinkle overhead. The distant laughter from below drifts up, a stark contrast to the solitude of the roof. Yet, with the beauty comes a sense of foreboding; this space, though serene, holds the potential for secrets and revelations that could unravel the mysteries lurking within the hotel."
      ]
    }
  ],
  "note": "",
  "cost": 0.0029899683,
  "durationMs": 32446
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "November",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast with occasional rain",
      "chilly coastal winds",
      "dampness in the air"
    ],
    "daylight": "Short days with twilight falling by 5 PM, creating an early evening darkness.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the hotel is quiet, except for muffled whispers.",
    "holidays": [
      "Armistice Day (November 11)"
    ],
    "seasonalActivities": [
      "visiting local markets for seasonal produce",
      "attending remembrance services for Armistice Day",
      "indoor social gatherings at the hotel"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits",
        "white dress shirts with high stiff collars",
        "dark overcoats"
      ],
      "casual": [
        "tweed jackets",
        "corduroy trousers",
        "knitted sweaters"
      ],
      "accessories": [
        "fedora hats",
        "leather gloves",
        "silk ties"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with cinched waists",
        "tailored wool coats",
        "periwinkle blue evening gowns"
      ],
      "casual": [
        "A-line skirts paired with fitted blouses",
        "knit cardigans",
        "practical ankle boots"
      ],
      "accessories": [
        "string of pearls",
        "wide-brimmed hats",
        "gloves"
      ]
    },
    "trendsOfTheMoment": [
      "bold colors in evening wear",
      "use of vintage fabrics due to wartime rationing",
      "longer hemlines as a nod to post-war aspirations"
    ],
    "socialExpectations": [
      "men expected to wear hats outdoors",
      "women encouraged to maintain a polished appearance even at home",
      "courteous behavior emphasized in public settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Allied forces making advances in Europe",
      "discussions of post-war planning gaining traction",
      "growing concern over the Soviet Union's influence"
    ],
    "politicalClimate": "Increasingly anxious atmosphere as the war nears its end, with shifting alliances and a burgeoning Cold War sentiment.",
    "economicConditions": "Rationing continues, affecting availability of goods, but there is a sense of anticipation for the economic boom post-war.",
    "socialIssues": [
      "struggles with returning soldiers adjusting to civilian life",
      "women's roles in the workforce being debated",
      "racial tensions in urban areas due to migration patterns"
    ],
    "internationalNews": [
      "Nuremberg Trials beginning preparations",
      "discussions of the United Nations being established",
      "rumors of espionage and covert operations surfacing"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "The Andrews Sisters' upbeat tunes",
        "Duke Ellington's jazz performances"
      ],
      "films": [
        "'Going My Way' featuring Bing Crosby",
        "'Meet Me in St. Louis'",
        "'The Miracle of Morgan's Creek'"
      ],
      "theater": [
        "Broadway shows like 'Oklahoma!'",
        "local vaudeville acts",
        "community theater productions"
      ],
      "radio": [
        "The Jack Benny Program",
        "Fibber McGee and Molly",
        "news programs reporting on the war"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Fountainhead' by Ayn Rand",
        "'The Glass Menagerie' by Tennessee Williams",
        "detective novels by Raymond Chandler"
      ],
      "popularGenres": [
        "mystery",
        "romance",
        "war fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "improved radio technology for clearer broadcasts",
        "advancements in military radar",
        "the beginnings of computer development at Bletchley Park"
      ],
      "commonDevices": [
        "radios in homes and public spaces",
        "manual typewriters in offices",
        "early television sets in affluent households"
      ],
      "emergingTrends": [
        "increased radio listenership",
        "growing interest in television as a future medium",
        "early computer technology being developed for war purposes"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: four pence",
        "a pint of milk: five pence",
        "movie ticket: one shilling"
      ],
      "commonActivities": [
        "gathering at local pubs to discuss the war",
        "participating in community service initiatives",
        "watching radio shows live at community centers"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "community remembrance activities for Armistice Day"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing divide between urban and rural populations",
      "class distinctions still evident but less pronounced due to shared wartime experiences"
    ],
    "gender": [
      "women stepping into roles traditionally held by men",
      "debate over women's rights increasingly prominent"
    ],
    "race": [
      "racial segregation still prevalent in many areas",
      "growing civil rights movements beginning to stir"
    ],
    "generalNorms": [
      "politeness and decorum emphasized in public life",
      "emphasis on community support and unity during wartime"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of damp earth and the faint aroma of burning wood from the hotel's fireplace.",
    "Whispers of concern and intrigue flow through the hotel's corridors, blending with the sound of rain hitting the windows.",
    "The dim light casts long shadows on the walls, creating a sense of unease as guests navigate the labyrinth of the hotel."
  ],
  "paragraphs": [
    "In November 1944, as the chill of fall settles in, the coastal hotel becomes a refuge for weary travelers escaping the tensions of wartime life. Overcast skies loom overhead, with rain occasionally drumming against the windows, providing a melancholic backdrop for the whispers of guests who are drawn together by rumors of strange occurrences. The air is heavy with anticipation, as Armistice Day has just passed, stirring memories and hopes for peace amidst the ongoing conflict in Europe. The dampness in the air only adds to the sense of unease, as shadows deepen with the early arrival of night in this coastal retreat.",
    "Fashion in this era reflects the complexities of a world at war; men adorn themselves in well-tailored wool suits, their overcoats draped elegantly over their shoulders, while women don tea-length dresses accented by pearls, exuding both grace and resilience. The vibrant colors of their clothing stand out against the drab backdrop of post-war rationing, signaling a yearning for normalcy and a return to elegance. In the hotel, guests are often seen adjusting their hats or smoothing their gloves, adhering to the social expectations of the time, where every detail of appearance is a nod to traditional values.",
    "Daily life during this period is marked by the echoes of history and the promise of change. Guests at the hotel recount stories of wartime sacrifice over hearty meals that often consist of rationed ingredients. For many, the price of a loaf of bread is a constant reminder of the material hardships faced during the war. Social rituals, such as Sunday family dinners and community remembrance services, play an important role in preserving connections amidst the chaos. As discussions of post-war plans begin to circulate, the atmosphere is charged with both hope and trepidation, reflecting the duality of a society on the brink of transformation."
  ],
  "note": "",
  "cost": 0.0010865976,
  "durationMs": 12539
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of disparate guests at a dilapidated seaside hotel find themselves entwined in a web of suspicion as the lingering effects of WWII and Cold War tensions amplify their fears and secrets.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The war has shifted traditional roles, with women like Sylvia Trent stepping into workforce positions while men like Captain Ivor Hale grapple with the trauma of service, creating a volatile mix of ambition and anxiety among the hotel’s guests."
  },
  "setting": {
    "location": "A dilapidated seaside hotel on a remote stretch of coast",
    "institution": "hotel",
    "weather": "Overcast with occasional rain, creating a damp and chilly environment."
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
    "id": "wine_cellar_temp",
    "value": "fifty degrees",
    "description": "The wine cellar's temperature affects the poison's potency."
  },
  {
    "id": "meal_timetable",
    "value": "three hours after dinner",
    "description": "The poison's effect is timed to occur at this interval."
  },
  {
    "id": "victim_weight",
    "value": "one hundred and fifty pounds",
    "description": "The victim's weight is critical for calculating the poison dosage."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 8,
    "mid": 11,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 19,
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
      "category": "testimonial"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_2",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
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
      "id": "clue_mid_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_early_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_early_3",
      "placement": "early",
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
