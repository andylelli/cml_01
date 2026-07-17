# Actual Prompt Record

- Run ID: `mystery-1784150843898`
- Project ID: ``
- Timestamp: `2026-07-15T21:32:06.687Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `6d7029cd8d9be7a3`

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
    "title": "The Echoes of Identity",
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
      "subtype": "poisoning"
    }
  },
  "death_method": "struck with a heavy object",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Accomplished investigator",
      "private_secret": "Struggles with PTSD from war experiences",
      "motive_seed": "Desire for truth",
      "motive_strength": "strong",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Desire to solve the case",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "medical professional",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Involved in a scandal",
      "motive_seed": "Fear of exposure",
      "motive_strength": "moderate",
      "alibi_window": "10:00 PM to 11:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "military officer",
      "relationships": [
        "Colleague of Dr. Finch"
      ],
      "public_persona": "Dignified retired captain",
      "private_secret": "Guilty of a past crime",
      "motive_seed": "Need to protect reputation",
      "motive_strength": "high",
      "alibi_window": "9:30 PM to 10:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "socialite",
      "relationships": [
        "Acquaintance of victim"
      ],
      "public_persona": "Charming socialite",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Jealousy",
      "motive_strength": "weak",
      "alibi_window": "10:00 PM to 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Love and affection",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "staff member",
      "relationships": [
        "Works at the hotel"
      ],
      "public_persona": "Dedicated hotel staff",
      "private_secret": "Hides knowledge of guests' secrets",
      "motive_seed": "Protecting guests' reputations",
      "motive_strength": "moderate",
      "alibi_window": "9:45 PM to 10:45 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Job security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Wealthy patron",
      "private_secret": "Engaged in illicit affairs",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Life",
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
      "summary": "During a stormy night at a grand seaside hotel, Hugo Vane is found dead, his demise obscured by a series of deceptive sounds and mistaken identities. Detective Eleanor Voss must unravel the truth hidden within the echoes of the hotel."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A gramophone set to play a recording of Hugo Vane's voice right before his death, creating an illusion that he was alive when he was actually murdered.",
      "delivery_path": [
        {
          "step": "The gramophone was set by Dr. Finch to play at the time of murder."
        }
      ]
    },
    "outcome": {
      "result": "The alibi fabricated by the gramophone misleads the investigation."
    }
  },
  "false_assumption": {
    "statement": "Hugo Vane was alive and conversing with guests at the time of his death.",
    "type": "identity",
    "why_it_seems_reasonable": "Witnesses heard his voice, creating a false impression of his presence.",
    "what_it_hides": "The actual time of death and the method of murder."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses claimed to have seen Hale near the lounge close to the time of death.",
      "Hale had a known dispute with Vane over a business matter."
    ],
    "the_one_flaw": "Hale's alibi was confirmed by the hotel staff who saw him in the dining room at the time.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken vase was found near the victim's body.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The vase broke during the storm, unrelated to the murder.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A letter from Vane was found in Captain Hale's belongings.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The letter was a business correspondence unrelated to the murder.",
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
    "rationale": "All suspects were present in the hotel during the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [],
      "windows": [
        "9:30 PM to 10:30 PM"
      ],
      "contradictions": [
        "Witnesses claim to have heard Hugo Vane alive at 10:15 PM, conflicting with the time of death."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Gramophone",
        "Vase"
      ],
      "permissions": [
        "Access to the lounge"
      ]
    },
    "physical": {
      "laws": [
        "Sound does not travel through solid walls."
      ],
      "traces": [
        "Footprints near the gramophone."
      ]
    },
    "social": {
      "trust_channels": [
        "Guest relationships",
        "Staff knowledge"
      ],
      "authority_sources": [
        "Hotel management"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses report hearing Hugo Vane's voice in the lounge at ten minutes past ten.",
        "correction": "This conflicts with the medical examiner's report stating Vane died at ten o'clock.",
        "effect": "Narrows the time of death to before the voice was heard, raising suspicion about the gramophone.",
        "required_evidence": [
          "Witness statements about hearing Vane's voice.",
          "Medical examiner's report on time of death."
        ],
        "reader_observable": true
      },
      {
        "observation": "A record found in the gramophone is scratched in a specific pattern.",
        "correction": "This suggests the gramophone was played shortly before the time of death.",
        "effect": "Eliminates the possibility of accidental playback by guests.",
        "required_evidence": [
          "Scratched record found in the gramophone.",
          "Witness accounts of unusual sounds prior to the murder."
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints leading to the gramophone match Dr. Finch's shoes.",
        "correction": "Indicates she had accessed the gramophone shortly before the murder.",
        "effect": "Narrows the suspect pool, implicating Dr. Finch.",
        "required_evidence": [
          "Footprints found near the gramophone.",
          "Dr. Finch's shoe size matches the footprints."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Recreating the sound setup with the gramophone to demonstrate how the recording could mislead people about the victim's presence.",
    "knowledge_revealed": "The revealed facts are gramophone, playback, and witness.",
    "pass_condition": "If the gramophone playback timing matches the established time of death, it implicates Dr. Finch.",
    "evidence_clues": [
      "clue_1",
      "clue_mechanism_visibility_core",
      "clue_2",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements (early) and medical examiner's report (mid) let the reader narrow time of death. Step 2: The scratched record (mid) indicates manipulation. Step 3: Footprints near the gramophone (mid) implicate Dr. Finch."
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
      "test_type": "acoustic evidence"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi by hotel staff.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No evidence connecting her to the crime.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness accounts confirming her location.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence"
    },
    "identity_rules": [
      {
        "character_name": "Eleanor Voss",
        "revealed_in_act": 3,
        "before_reveal_reference": "the detective",
        "after_reveal_reference": "Eleanor"
      },
      {
        "character_name": "Dr. Mallory Finch",
        "revealed_in_act": 3,
        "before_reveal_reference": "the doctor",
        "after_reveal_reference": "Dr. Finch"
      },
      {
        "character_name": "Captain Ivor Hale",
        "revealed_in_act": 3,
        "before_reveal_reference": "the captain",
        "after_reveal_reference": "Captain Hale"
      },
      {
        "character_name": "Beatrice Quill",
        "revealed_in_act": 3,
        "before_reveal_reference": "the socialite",
        "after_reveal_reference": "Beatrice"
      },
      {
        "character_name": "Sylvia Trent",
        "revealed_in_act": 3,
        "before_reveal_reference": "the staff member",
        "after_reveal_reference": "Sylvia"
      },
      {
        "character_name": "Hugo Vane",
        "revealed_in_act": 3,
        "before_reveal_reference": "the victim",
        "after_reveal_reference": "Hugo"
      }
    ],
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
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
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
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Medical examiner's report"
      },
      {
        "clue_id": "clue_mid_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Scratched record"
      },
      {
        "clue_id": "clue_mid_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Footprints"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a respected art gallery owner, is a woman of dual lives: a polished exterior masking financial turmoil and a desperate desire to unearth family secrets.",
    "publicPersona": "Eleanor is the epitome of sophistication, known for her discerning eye in the art world and her unwavering commitment to the community. She hosts elegant exhibitions, drawing in the elite, while maintaining an air of mystery about her own life.",
    "privateSecret": "Beneath her refined facade, Eleanor grapples with mounting debts that compel her to sell valuable artworks in secrecy, risking her reputation and livelihood.",
    "motiveSeed": "Her quest to expose family secrets intertwines with her financial struggles, creating a perilous cocktail of ambition and desperation that threatens to unravel her carefully curated life.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been at her gallery until 10 PM, hosting a late exhibition with prominent patrons, providing her with a plausible cover.",
    "accessPlausibility": "possible",
    "stakes": "Eleanor's reputation and the survival of her business hinge on her ability to navigate this investigation without exposing her vulnerabilities.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her sentences with a wry observation. She tends to employ art-related metaphors, which can either illuminate or obscure her true feelings.",
    "signatureTic": "\"Life, like art, requires a certain brushstroke of boldness.\"",
    "internalConflict": "Eleanor wrestles with the guilt of her financial deceit and the moral implications of her family's hidden truths, fearing that uncovering these secrets could shatter her community standing.",
    "personalStakeInCase": "The crime strikes a personal chord for Eleanor, as it threatens to expose not only her financial troubles but also the dark legacies of her family that she has tried so hard to keep buried.",
    "paragraphs": [
      "Eleanor Voss was no stranger to the art of appearances. With her gallery nestled in the heart of the seaside town, she had cultivated an image of sophistication and taste that was the envy of many. Yet, behind her poised demeanor lay a tempest of financial woes, each painting on her walls a reminder of debts that loomed larger than any canvas. She had taken to selling pieces in secret, slipping them from her collection like whispers in the night, hoping to keep her business afloat while maintaining her reputation as a pillar of the community.",
      "The recent murder of Hugo Vane, a wealthy investor with dubious dealings, sent ripples through her world. Eleanor had not only known him but had also felt the shadow of his ambitions encroaching on her own. The very notion that he might expose her family's secrets struck a chord deep within her, igniting a fierce determination to find the truth. It was not merely about justice for Hugo; it was about preserving her legacy, her artistry, and the fragile facade she had built over the years.",
      "As she delved deeper into the investigation, Eleanor found herself confronted by her own moral compass. Each revelation about the victim and his connections to the town unearthed her own buried truths. The duality of her existence—a respected gallery owner and a woman drowning in secrets—became increasingly precarious. With each lead, she felt the weight of her choices pressing against her, urging her to either confront her past or allow it to consume her.",
      "In her quieter moments, Eleanor pondered the nature of art and identity, often remarking to herself, \"Life, like art, requires a certain brushstroke of boldness.\" But as she stood at the precipice of her own truths, she questioned whether she possessed the courage to paint her own narrative or if she would remain a mere spectator in the gallery of her own life."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a once-promising psychiatrist, returns from military service only to find herself entangled in the very chaos she sought to heal, battling her own demons as she becomes a suspect in a murder investigation.",
    "publicPersona": "Respected for her dedication to veterans, Mallory presents herself as a compassionate healer, often seen with a patient smile that belies her internal struggles.",
    "privateSecret": "Behind the professional facade, she grapples with the haunting memories of war, resorting to self-medication to cope with her PTSD, leaving her emotionally fragile.",
    "motiveSeed": "An unresolved conflict with the victim, who threatened to expose her troubled past, adds a layer of complexity to her already tenuous situation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Mallory claims to have been in her room, engaged in note-taking, during the time of the murder, but the credibility of her alibi is in question.",
    "accessPlausibility": "easy",
    "stakes": "The potential exposure of her past could lead to the ruin of her career and her reputation as a healer, leaving her with nowhere to turn.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory speaks in a soft, measured tone, often avoiding eye contact when discussing her past. Her dialogue is filled with clinical terminology, but cracks appear when her emotions surface, revealing the fragility underneath.",
    "signatureTic": "\"It’s all a matter of perspective, isn't it?\"",
    "internalConflict": "Mallory is torn between her professional integrity and the fear of her past being revealed, battling feelings of worthlessness and guilt over her inability to save those she once treated.",
    "personalStakeInCase": "The investigation strikes at the heart of Mallory's identity; if her past comes to light, it could obliterate the trust she has built with her patients and colleagues, leaving her with nothing.",
    "paragraphs": [
      "Dr. Mallory Finch returned from the battlefield, not of geography but of the mind, where she had once been a beacon of hope for those lost in the shadows of trauma. Yet, the very darkness she sought to dispel had crept into her own life, manifesting as PTSD that clung to her like a shroud. In the wake of Hugo Vane's murder, she felt the weight of scrutiny tightening around her, a noose of suspicion tightening with each passing hour.",
      "In her quiet moments, she often reflected on her life, muttering, \"It’s all a matter of perspective, isn't it?\" A phrase meant to provide solace but now a bitter reminder of her own fractured view of reality. The victim's impending revelation of her troubled past sent her spiraling; her carefully constructed world threatened to collapse under the weight of his words. Driven by fear and desperation, she found herself at the center of a murder investigation, a place she never imagined she would occupy.",
      "As she navigated the murky waters of suspicion, Mallory's clinical training began to falter. The rational mind she had honed in her practice was now clouded by personal turmoil. Each interaction with the other suspects felt like a psychological game, each word laden with double meanings. She struggled to maintain her composure, fighting the urge to succumb to the panic that clawed at her insides, threatening to expose the very truths she sought to bury.",
      "Yet, deep inside, a flicker of resilience remained. The investigation forced her to confront her past, a reckoning that could either lead to her redemption or her complete unraveling. As the walls closed in, Mallory grappled with a profound dilemma: could she reclaim her identity and help others while grappling with her own demons, or would she become a casualty of her own fears?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, finds his steadfast moral compass tested as he faces the specter of familial betrayal and the challenge of a changing world.",
    "publicPersona": "Ivor is seen as a dignified elder, a guardian of tradition and values, earning respect for his unwavering principles and leadership.",
    "privateSecret": "Beneath his stoic exterior lies a hidden will that contradicts his family's expectations, a secret that could ignite disputes over inheritance.",
    "motiveSeed": "His fear of the victim's plans to sell the family estate threatens not only his legacy but also the very values he has sworn to uphold.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor claims to have been walking along the cliffs at the time of death, a solitary figure reflecting on the tides of change.",
    "accessPlausibility": "possible",
    "stakes": "The sanctity of his reputation as the family's protector is at stake, a burden he bears with a heavy heart.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a commanding presence, his voice deep and resonant, often punctuated by anecdotes from his naval days. He occasionally employs dry humor to deflect from his vulnerabilities.",
    "signatureTic": "\"In my day, we didn’t question orders; we followed them. Times have changed, I suppose.\"",
    "internalConflict": "Ivor grapples with the tension between his steadfast beliefs and the shifting values of his family, torn between protecting his legacy and accepting the inevitable changes ahead.",
    "personalStakeInCase": "The investigation threatens not only his reputation but also the values he has upheld for so long, forcing Ivor to confront the reality of his family's evolving dynamics.",
    "paragraphs": [
      "Captain Ivor Hale, a man molded by the rigors of naval life, stood as a pillar of strength in his community. His reputation was built on unwavering moral codes, yet the tides of change threatened to erode the very foundation he had crafted. The murder of Hugo Vane struck a discordant note in the symphony of his life, prompting Ivor to reflect on the complexities of loyalty and legacy.",
      "He often remarked, with a hint of self-deprecation, \"In my day, we didn’t question orders; we followed them. Times have changed, I suppose.\" This sentiment echoed through his thoughts as he grappled with the implications of the victim’s plans to sell the family estate, an act he deemed sacrilege. The prospect of losing the family legacy ignited a fierce protectiveness within him, compelling him to confront the shadows lurking within his own family.",
      "As he walked the cliffs, seeking solace in the rhythm of the waves crashing below, Ivor felt the weight of his hidden will pressing against him. The secret he harbored was a double-edged sword, capable of severing ties with those he loved should it ever come to light. The investigation forced him to consider whether he could maintain his role as protector while grappling with the truth that threatened to unravel his family's narrative.",
      "In the quiet moments of introspection, Ivor realized that the world he had known was shifting beneath his feet. The very values he cherished were being challenged by the younger generation, leaving him torn between the desire to uphold tradition and the need to adapt. As he faced the specter of familial betrayal, he understood that his journey was not simply about protecting a legacy but about reconciling the past with the uncertain future that lay ahead."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious journalist, navigates the treacherous waters of ambition and ethics, seeking the big story that could elevate her career while wrestling with her financial insecurities.",
    "publicPersona": "Beatrice is a dynamic and driven young journalist, known for her tenacity and commitment to uncovering the truth, often charming her way into exclusive interviews.",
    "privateSecret": "Behind her confident exterior lies a struggle with severe financial issues, living beyond her means and desperately trying to maintain appearances.",
    "motiveSeed": "Her belief that the victim was concealing a family scandal presents an opportunity for her to launch her career, intertwining her ambitions with the complexities of the investigation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims to have been interviewing other guests at the time of the murder, but the truth of her whereabouts remains uncertain.",
    "accessPlausibility": "easy",
    "stakes": "The chance to uncover a major story could transform her career, but the ethical implications of her pursuit could also cost her everything.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with an energetic cadence, peppering her conversations with witty remarks and sharp observations. Her dialogue often reflects her youthful idealism, occasionally laced with a biting sarcasm.",
    "signatureTic": "\"You know, the truth is a slippery little fish, isn't it?\"",
    "internalConflict": "Beatrice is torn between her ambition and her ethics, wrestling with the implications of her pursuit for a story that could define her career while risking her integrity.",
    "personalStakeInCase": "The investigation presents Beatrice with an opportunity to elevate her career but also forces her to confront the ethical boundaries she is willing to cross in her pursuit of the truth.",
    "paragraphs": [
      "Beatrice Quill was a name that echoed through the corridors of the seaside hotel, a young journalist with dreams as vast as the ocean. Her ambition was palpable, driving her to chase stories that others deemed too risky. Yet, beneath the surface of her tenacity lay a precarious financial situation, a delicate balancing act of living beyond her means while projecting an image of success. In the wake of Hugo Vane's murder, she saw an opportunity that could launch her career into the stratosphere.",
      "With a sardonic smile, she often quipped, \"You know, the truth is a slippery little fish, isn't it?\" This sentiment encapsulated her approach to journalism; she was determined to catch that elusive truth, even if it meant wading through murky waters. The victim’s rumored secrets tantalized her, presenting a potential scoop that could not only establish her reputation but also alleviate her financial burdens.",
      "As she interviewed guests and pieced together the fragments of the case, Beatrice found herself wrestling with the ethical dilemmas that accompanied her ambition. The line between pursuit and exploitation blurred, and she questioned whether the story was worth the cost to her integrity. Each revelation about the victim's life added layers of complexity to her ambitions, forcing her to confront the implications of her choices.",
      "In the midst of the investigation, Beatrice realized that her pursuit of truth was not merely a career move but a reflection of her values. The stakes were high, and as she navigated the treacherous waters of ambition and ethics, she understood that the story she sought could either elevate her or lead to her downfall. With each passing moment, the weight of her choices loomed larger, challenging her to define what success truly meant in a world where truth and ambition often stood at odds."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a retired teacher and community matriarch, grapples with resentment towards the younger generation while navigating the complexities of family legacy and personal entitlement.",
    "publicPersona": "Sylvia is revered as a beloved elder, known for her kindness, wisdom, and nurturing spirit, often sought after for guidance by the community.",
    "privateSecret": "Beneath her warm exterior, Sylvia harbors deep resentment towards her family, feeling betrayed by their disregard for her contributions and legacy.",
    "motiveSeed": "A falling out with the victim over family inheritance ignites a fierce desire to reclaim what she believes is rightfully hers.",
    "motiveStrength": "moderate",
    "alibiWindow": "Sylvia claims to have been reading in her room during the time of the murder, a solitary pursuit that raises questions about her whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "Her position and legacy within the family are at stake, and she fears being overshadowed by the ambitions of the younger generation.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with a gentle yet firm tone, often using anecdotes and parables to convey her wisdom. She possesses an ability to wield subtle sarcasm, making her observations both poignant and cutting.",
    "signatureTic": "\"Ah, the youth today, so quick to forget their roots!\"",
    "internalConflict": "Sylvia struggles with her feelings of entitlement and resentment towards the younger generation, wrestling with the need to adapt her values while clinging to the traditions she holds dear.",
    "personalStakeInCase": "The investigation threatens her legacy and position within the family, forcing Sylvia to confront the changing dynamics and her own biases against the younger generation.",
    "paragraphs": [
      "Sylvia Trent was the heart of the community, a retired teacher who had nurtured countless minds over the years. Her reputation as a beloved matriarch was built on kindness and wisdom, yet beneath that warm exterior lay a simmering resentment towards her family. She felt overlooked, as if the contributions she had made to their lives had been forgotten in favor of the ambitions of the younger generation. The murder of Hugo Vane, a family connection, opened old wounds and reignited her feelings of betrayal.",
      "With a hint of polite savagery, she would often remark, \"Ah, the youth today, so quick to forget their roots!\" This sentiment reflected her discontent with the changing values around her. The victim's plans for the family estate had sparked a fierce desire within her to reclaim her perceived rightful place in the family hierarchy, a place she felt had been usurped by those who did not appreciate the sacrifices she had made.",
      "As the investigation unfolded, Sylvia found herself at a crossroads, grappling with her feelings of entitlement and the need to adapt to the shifting dynamics of her family. The tension between tradition and progress weighed heavily on her, forcing her to confront her biases against the younger generation. Each interaction with the suspects brought her face-to-face with her own vulnerabilities, revealing the fragility of her carefully constructed identity.",
      "In moments of reflection, Sylvia understood that her legacy was not solely about inheritance but about the values she instilled in the next generation. As she navigated the complexities of familial relationships and her own resentments, she realized that the investigation was not just about uncovering the truth behind the murder; it was also about redefining her place in a world that was evolving without her consent."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a wealthy investor with a charming exterior, conceals a life of illicit dealings that threaten to unravel his carefully crafted public persona.",
    "publicPersona": "Known as a philanthropic figure in the financial world, Hugo is celebrated for his charm and charisma, often seen as a pillar of the community.",
    "privateSecret": "Behind the façade of success lies a web of illicit dealings that could shatter his reputation and destroy the life he has built.",
    "motiveSeed": "His plans to invest in the hotel were undermined by suspicions of foul play, heightening the stakes of his dealings and drawing attention to his questionable ethics.",
    "motiveStrength": "compelling",
    "alibiWindow": "Hugo claimed to have attended a business meeting at the time of his murder, yet the absence of witnesses raises doubts about his whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "The very foundation of his fortune and future investments teetered on the brink of exposure, making him a target in a world where secrets could mean life or death.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Hugo speaks with a confident, almost theatrical flair, often using grandiose language to convey his ideas. His dialogue is punctuated with blunt honesty, revealing a man who is unafraid to confront uncomfortable truths.",
    "signatureTic": "\"In business, as in life, one must always be prepared for the unexpected.\"",
    "internalConflict": "Hugo's ambition drives him, yet he struggles with the ethical implications of his actions, questioning whether his success is worth the moral cost.",
    "personalStakeInCase": "The investigation into his murder threatens not only his reputation but also the very empire he has built, forcing him to confront the consequences of his ambition and ethical choices.",
    "paragraphs": [
      "Hugo Vane was a name that commanded attention, a wealthy investor whose charm and charisma made him a fixture in high society. His philanthropic endeavors painted a picture of a man dedicated to bettering the community, yet beneath that polished veneer lay a labyrinth of illicit dealings that could unravel his carefully constructed world. The murder that claimed his life was a brutal punctuation mark in a narrative filled with ambition and deception.",
      "With a blunt honesty that often caught others off guard, he would declare, \"In business, as in life, one must always be prepared for the unexpected.\" This philosophy guided his dealings, yet it also forced him into a precarious position. As he navigated the murky waters of investments, he found himself ensnared by the very secrets he had sought to keep hidden. The prospect of foul play in his financial dealings loomed large, threatening to expose the truth of his life.",
      "In the days leading up to his murder, Hugo had sensed the tightening grip of scrutiny. The stakes were high, with his entire fortune and future investments hanging in the balance. The investigation into his death would not only reveal the darkness lurking behind his public persona but also challenge the foundations of the empire he had built. As the shadows closed in, he was left to ponder whether the price of success was worth the moral compromises he had made.",
      "Ultimately, Hugo's demise served as a cautionary tale of ambition unchecked, a stark reminder of the fragility of reputation in a world driven by greed and deception. His life, though vibrant and full of promise, ended in a violent clash with the very truths he had tried to evade, leaving behind a legacy that would forever be marred by the echoes of his choices."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seaside Grandeur",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel built in the 1920s, frequented by tourists and local elites, now whispers secrets of its past.",
    "visualDescription": "Art deco architecture with sweeping curves and geometric patterns; expansive windows overlooking the turbulent sea; polished marble floors reflecting muted light; plush velvet furnishings in shades of deep blue and gold.",
    "atmosphere": "A sense of grandeur shadowed by tension, where elegance meets unease.",
    "paragraphs": [
      "The Seaside Grandeur stands as a testament to the elegance of the 1920s, its art deco façade shimmering in the overcast light. The sound of waves crashing against the rocky shore mingles with the distant hum of conversations, creating an atmosphere thick with anticipation. Inside, the polished marble floors and plush furnishings whisper of luxury, yet a tension simmers beneath the surface, as if the very walls hold their breath, waiting for secrets to emerge.",
      "Guests drift through the grand lobby, their laughter tinged with uncertainty, eyes darting toward the expansive windows framing the stormy sea. The distant echo of a radio broadcast fills the air, reminding them of the world outside, where rationed fuel and wartime anxieties loom large. Here, amidst the elegance, the weight of hidden identities and unspoken fears hangs heavily, creating an uneasy camaraderie among those seeking refuge from their pasts.",
      "As evening approaches, the hotel transforms; shadows stretch across the plush carpets, and the flickering candlelight casts dancing patterns on the walls. The scent of damp sea air mixes with the richness of tobacco smoke from the lounge, where guests gather to share stories while glancing around warily, as if expecting the unexpected. The Seaside Grandeur, in all its opulence, becomes a stage for a drama unfolding, where each guest carries their own burden of secrets, waiting for the moment when the truth will finally be revealed."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain showers, typical of coastal climates",
    "timeFlow": "Three days of mounting tension and discovery",
    "mood": "tense and anticipatory, with a sense of unease among guests",
    "eraMarkers": [
      "radio broadcasting in the lounge",
      "rationed fuel for transportation",
      "military radar equipment in the nearby coastal defense"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air mixed with cigarette smoke",
      "secondary": [
        "polished wood and damp stone",
        "rich velvet and aged leather"
      ]
    },
    "paragraphs": [
      "The atmosphere inside The Seaside Grandeur is thick with tension, a palpable energy that seems to vibrate through the air. The salty sea breeze carries whispers of secrets from the ocean, while the heavy scent of smoke lingers in the corners, wrapping around guests like a shroud. Every creak of the floorboards and flicker of the lights feels charged, as if the building itself is alive with anticipation, waiting for the inevitable clash of truths to unfold.",
      "Outside, the overcast sky looms, casting a grey pallor over the bustling promenade. Occasionally, rain showers sweep in, drumming against the windows and sending guests scurrying for cover. Inside, the hotel remains a sanctuary, yet the unease among the guests is unmistakable, each person acutely aware of the shadows lurking just beyond the reach of the light. The tension builds, setting the stage for a mystery that will unravel with the rising tide."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "Expansive space with high ceilings, art deco chandeliers, and a grand staircase leading to upper floors; plush seating areas filled with guests.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "stunning art deco chandeliers",
          "plush velvet armchairs",
          "ocean-view windows"
        ],
        "sounds": [
          "murmurs of conversation",
          "clinking glassware",
          "distant radio broadcasts",
          "soft jazz music"
        ],
        "smells": [
          "freshly polished wood",
          "cigarette smoke",
          "ocean breeze",
          "rich coffee"
        ],
        "tactile": [
          "smooth marble underfoot",
          "cool metal of handrails",
          "soft velvet upholstery",
          "chill of sea air"
        ]
      },
      "accessControl": "Open to guests during day; locked after midnight; staff access for cleaning and maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked marble",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady rain on windows",
            "soft footsteps on damp floors"
          ],
          "smells": [
            "damp earth from the gardens",
            "wet stone and wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light from the cloudy sky",
            "shadows creeping along the carpet"
          ],
          "sounds": [
            "clock ticking in the silence",
            "occasional laughter echoing"
          ],
          "smells": [
            "dust from the neglected corners",
            "faint perfume lingering"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "guests’ silhouettes against windows"
          ],
          "sounds": [
            "soft laughter and chatter",
            "music from the lounge"
          ],
          "smells": [
            "freshly baked bread",
            "scent of whiskey"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Seaside Grandeur is a space that exudes elegance while concealing its share of secrets. High ceilings adorned with art deco chandeliers cast a warm glow over the marble floors, where guests mingle, exchanging pleasantries that barely mask their underlying anxieties. The expansive windows provide a breathtaking view of the tumultuous sea, yet they also serve as a reminder of the storm brewing within the hotel itself. As the murmur of conversations blends with the sound of distant jazz, the tension in the air thickens, hinting at the mysteries waiting to unfold.",
        "In the morning, rain drizzles against the glass, casting a somber light over the lobby. Guests shuffle about, their footsteps muted on the damp marble, the scent of wet earth mingling with the rich aroma of coffee brewing nearby. As the day progresses, the atmosphere shifts; the grey light dulls the vibrant colors, shadows lengthening across the plush carpets, creating an uneasy stillness where every glance and whisper seems laden with unspoken truths."
      ]
    },
    {
      "id": "dining_room",
      "name": "Oceanview Dining Room",
      "type": "interior",
      "purpose": "Dining space for guests",
      "visualDetails": "Elegant dining area with large windows overlooking the sea, adorned with crisp white tablecloths and polished silverware; art deco murals depicting seaside scenes.",
      "sensoryDetails": {
        "sights": [
          "gleaming silver cutlery",
          "elegant floral centerpieces",
          "ocean waves crashing outside",
          "art deco murals on walls"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft chatter of diners",
          "waves crashing on the shore",
          "waitstaff moving quietly"
        ],
        "smells": [
          "fresh seafood and herbs",
          "baked bread and butter",
          "citrus from desserts",
          "tobacco lingering from post-dinner cigars"
        ],
        "tactile": [
          "smooth linen tablecloths",
          "cool glass of water",
          "warm bread rolls",
          "hard wooden chairs"
        ]
      },
      "accessControl": "Open to guests during breakfast, lunch, and dinner; staff access for preparation before and after service.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "water droplets on windows"
          ],
          "sounds": [
            "rain tapping against the glass",
            "low murmurs of breakfast conversations"
          ],
          "smells": [
            "coffee brewing",
            "freshly cooked eggs"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey waves crashing against cliffs",
            "dark clouds creeping over the horizon"
          ],
          "sounds": [
            "soft music playing in the background",
            "occasional laughter from diners"
          ],
          "smells": [
            "rich seafood stew",
            "buttery pastries"
          ],
          "mood": "sombre"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset reflecting on water",
            "candle flames flickering on tables"
          ],
          "sounds": [
            "gentle laughter and conversation",
            "clinking wine glasses"
          ],
          "smells": [
            "grilled fish and herbs",
            "sweet dessert aromas"
          ],
          "mood": "uplifting yet tense"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room offers a stunning panorama of the sea, where guests gather to indulge in culinary delights while the waves crash against the cliffs below. Crisp white tablecloths and polished silverware reflect the elegance of the hotel, yet beneath this façade of sophistication lies an undercurrent of tension. The clinking of cutlery and soft chatter of diners create a symphony of normalcy, yet every laugh seems to echo with a hint of nervousness, as if the guests are acutely aware of the secrets that could surface at any moment.",
        "During the morning, rain drizzles against the windows, casting a melancholic veil over breakfast. The scent of freshly brewed coffee fills the air, mingling with the aroma of cooked eggs and warm bread rolls. As the day wears on, the atmosphere shifts; the overcast sky dulls the vibrant colors of the dining room, and the smell of rich seafood stew wafts through the air, a reminder that even in the most elegant of settings, shadows linger just out of sight."
      ]
    },
    {
      "id": "library",
      "name": "Private Library",
      "type": "interior",
      "purpose": "Clue discovery and private meetings",
      "visualDetails": "Wood-paneled room filled with shelves of books, leather-bound tomes lining the walls; a large fireplace with a crackling fire and comfortable seating arranged around it.",
      "sensoryDetails": {
        "sights": [
          "flickering flames in the fireplace",
          "plush reading chairs",
          "heavy drapes framing the windows"
        ],
        "sounds": [
          "crackling fire",
          "pages turning in the silence",
          "soft whispers of conversation",
          "distant thunder rumbling"
        ],
        "smells": [
          "beeswax polish on wood",
          "old leather and paper",
          "smoky firewood",
          "dusty tomes"
        ],
        "tactile": [
          "soft leather armchair",
          "cool glass of whiskey",
          "warmth from the fire",
          "rough texture of book spines"
        ]
      },
      "accessControl": "Restricted to guests with special permission; staff do not enter unless summoned.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "water droplets on window panes"
          ],
          "sounds": [
            "steady rain against glass",
            "soft rustling of pages"
          ],
          "smells": [
            "damp wood and leather",
            "fresh ink on paper"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light casting shadows",
            "books stacked haphazardly"
          ],
          "sounds": [
            "soft whispering",
            "occasional clock ticking"
          ],
          "smells": [
            "dusty volumes",
            "scent of old parchment"
          ],
          "mood": "suspicious"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from the fireplace",
            "golden light from lamps"
          ],
          "sounds": [
            "soft crackling of the fire",
            "distant echoes of laughter"
          ],
          "smells": [
            "rich tobacco smoke",
            "wood smoke and ash"
          ],
          "mood": "contemplative"
        }
      ],
      "paragraphs": [
        "The Private Library is a sanctuary of knowledge, its wood-paneled walls lined with leather-bound tomes that hold the weight of history. A large fireplace crackles invitingly, casting a warm glow over the plush seating arranged around it. The scent of old leather and paper lingers in the air, mingling with the smoky aroma of the fire. This is a space where secrets can be uncovered, where whispered conversations echo off the walls, and where every shadow holds the potential for revelation.",
        "In the morning, rain patters against the window, creating a soothing backdrop as guests retreat into the library's embrace. The dim light filters through the glass, casting a reflective quality over the room. The steady sound of rain mingles with the rustling of pages, as guests lose themselves in stories, unaware of the drama unfolding just beyond the door. As the day progresses, the atmosphere shifts; the overcast light casts long shadows, and an air of suspicion begins to permeate the space, hinting at the secrets waiting to be unveiled."
      ]
    },
    {
      "id": "clifftop",
      "name": "Clifftop Garden",
      "type": "exterior",
      "purpose": "Gathering space and exterior clue discovery",
      "visualDetails": "A rugged garden perched on the edge of the cliffs, wildflowers and grasses swaying in the wind; a stone path winding through the greenery with a breathtaking view of the sea.",
      "sensoryDetails": {
        "sights": [
          "wildflowers swaying in the breeze",
          "crashing waves against the cliffs",
          "dark clouds looming overhead",
          "stone path winding through greenery"
        ],
        "sounds": [
          "howling wind through the trees",
          "waves crashing on rocks below",
          "distant seagulls calling",
          "rustling leaves"
        ],
        "smells": [
          "salt from the sea",
          "fresh grass and wildflowers",
          "damp earth after rain",
          "smoky scent of burning wood"
        ],
        "tactile": [
          "rough stone path underfoot",
          "cool breeze against the skin",
          "soft petals of flowers",
          "damp moss on rocks"
        ]
      },
      "accessControl": "Accessible to guests during daylight hours; restricted access at night for safety.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked wildflowers",
            "shimmering droplets on leaves"
          ],
          "sounds": [
            "rain tapping on foliage",
            "soft squelch of mud"
          ],
          "smells": [
            "fresh rain on grass",
            "earthy scent of wet soil"
          ],
          "mood": "refreshing yet melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds gathering overhead",
            "waves crashing against the cliffs"
          ],
          "sounds": [
            "wind howling through the trees",
            "distant thunder rumbling"
          ],
          "smells": [
            "ocean salt in the air",
            "freshly cut grass"
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden light",
            "silhouettes of flowers against the sky"
          ],
          "sounds": [
            "gentle waves lapping at the shore",
            "soft whisper of the wind"
          ],
          "smells": [
            "sweet scent of blooming flowers",
            "freshness of the sea air"
          ],
          "mood": "tranquil yet tense"
        }
      ],
      "paragraphs": [
        "The Clifftop Garden offers a breathtaking view, where wildflowers dance in the wind against the backdrop of crashing waves below. The stone path winds through the greenery, leading guests to the edge of the cliffs where the ocean meets the land. Here, the salty air invigorates the senses, yet an undercurrent of tension lingers, as if the very cliffs hold secrets waiting to be discovered. The howling wind and distant calls of seagulls create an atmosphere both wild and beautiful, inviting exploration while hinting at the dangers that lie just beyond the edge.",
        "In the morning, the garden is transformed by rain, droplets clinging to petals and leaves. The fresh scent of wet soil and grass fills the air, providing a sense of renewal even as the clouds loom overhead. As the day progresses, the atmosphere shifts; the darkening skies and crashing waves evoke a sense of foreboding, warning of the storm that reflects the turmoil brewing within the hotel. By evening, as the sun sets, the garden takes on a tranquil quality, yet the tension remains, a reminder that beauty often conceals deeper truths."
      ]
    }
  ],
  "note": "",
  "cost": 0.00252214215,
  "durationMs": 44627
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1946,
    "month": "February",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast with frequent rain showers",
      "chilly winds from the coast",
      "intermittent bursts of sunlight"
    ],
    "daylight": "Short days with twilight settling in by five o'clock, leaving long, shadowy evenings.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel guests unwind after dinner.",
    "holidays": [],
    "seasonalActivities": [
      "Indoor social gatherings and card games among hotel guests",
      "Reading by the fireside in the hotel lounge",
      "Enjoying warm drinks like cocoa or spiced tea"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "navy blue wool suits with wide lapels",
        "white dress shirts with high collars",
        "dark leather dress shoes"
      ],
      "casual": [
        "tweed jackets for warmth",
        "corduroy trousers",
        "soft wool sweaters"
      ],
      "accessories": [
        "felt fedoras",
        "wool scarves",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dresses with floral prints",
        "cashmere cardigans for warmth",
        "periwinkle blue silk blouses"
      ],
      "casual": [
        "high-waisted skirts paired with fitted sweaters",
        "tweed coats for the chilly weather",
        "simple flats adorned with bows"
      ],
      "accessories": [
        "string of pearls",
        "berets or cloche hats",
        "stylish gloves"
      ]
    },
    "trendsOfTheMoment": [
      "Emphasis on practicality in post-war fashion",
      "Use of bold colors as a sign of optimism",
      "Dresses featuring cinched waists and flowing skirts"
    ],
    "socialExpectations": [
      "Men are expected to resume traditional roles as breadwinners",
      "Women increasingly seen in professional roles, yet still expected to maintain homemaker duties",
      "Social gatherings often highlight class and status"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Tensions rise as the Iron Curtain descends over Eastern Europe",
      "The United States continues to support Europe through the Marshall Plan",
      "Reports of veterans struggling with PTSD become more common"
    ],
    "politicalClimate": "A growing divide between capitalist West and communist East, with increasing paranoia about Soviet influence.",
    "economicConditions": "Post-war recovery is slow, with inflation affecting everyday goods and rationing still in place for some items.",
    "socialIssues": [
      "Discussions on veterans' mental health and reintegration into civilian life",
      "Women advocating for equal pay as they remain in the workforce",
      "Racial tensions begin to surface as civil rights movements gain momentum"
    ],
    "internationalNews": [
      "Continued fallout from the Yalta Conference",
      "Emergence of the United Nations as a stabilizing force",
      "Increased military presence in Europe as Cold War begins"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "The Andrews Sisters' popular swing tunes",
        "Duke Ellington's jazz compositions"
      ],
      "films": [
        "The Best Years of Our Lives",
        "It's a Wonderful Life",
        "Notorious"
      ],
      "theater": [
        "Broadway hits such as 'Carousel'",
        "Revival of classic plays like 'A Streetcar Named Desire'",
        "Local productions at regional theaters"
      ],
      "radio": [
        "The Jack Benny Program",
        "Suspense, featuring gripping mystery stories",
        "The Lone Ranger"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Catcher in the Rye by J.D. Salinger",
        "Brave New World by Aldous Huxley",
        "The Little Prince by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Post-war psychological novels",
        "Science fiction as a reflection of societal fears"
      ]
    },
    "technology": {
      "recentInventions": [
        "The first commercially available transistor radios",
        "Advancements in radar technology from military applications",
        "Early television broadcasts becoming more common in urban areas"
      ],
      "commonDevices": [
        "Household radios as the center of family entertainment",
        "Manual typewriters used in offices and homes",
        "Black-and-white televisions emerging in affluent households"
      ],
      "emergingTrends": [
        "Increased interest in consumer electronics",
        "Rise of advertising as a major influence in consumer culture",
        "Growth of suburbs leading to changes in transportation and commuting"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: three pence",
        "Cinema ticket: one shilling"
      ],
      "commonActivities": [
        "Gathering for tea in the afternoons",
        "Attending local dances or social clubs",
        "Shopping for essentials at neighborhood markets"
      ],
      "socialRituals": [
        "Sunday family dinners as a cherished tradition",
        "Evening strolls along seaside promenades",
        "Participating in community events or charity fundraisers"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "A strong emphasis on social class and distinctions persists",
      "Wealthier individuals often maintain exclusive social circles",
      "Economic hardships are felt most acutely among the working class"
    ],
    "gender": [
      "Women are increasingly viewed as equal contributors economically, yet face societal pressure to balance work and home life",
      "Traditional gender roles are challenged but still prevalent in many areas",
      "Women in the workforce are often expected to display femininity while being competent"
    ],
    "race": [
      "Racial segregation remains a contentious issue, especially in the South",
      "Growing awareness and activism for civil rights, particularly among African Americans",
      "Integration efforts in schools and workplaces are met with resistance"
    ],
    "generalNorms": [
      "Politeness and decorum are highly valued in public interactions",
      "Family loyalty and community involvement are seen as essential virtues",
      "Personal privacy is respected, but gossip is rampant among social circles"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the smell of rain-soaked earth, mingling with the rich aroma of freshly brewed coffee in the hotel lounge.",
    "The sound of distant thunder rumbles, promising more rain, while the flickering gas lamps cast a warm glow on the faces of guests huddled around the fireplace.",
    "Whispers of secrets and half-heard conversations linger in the hallways, adding an unsettling tension to the otherwise cozy atmosphere."
  ],
  "paragraphs": [
    "February 1946 unfolds under a blanket of gray skies, with rain pattering against the windows of the coastal hotel where guests seek refuge from the chill. The winter air is sharp, invigorating, and none can escape the tense atmosphere that seems to cloak the hallways. As twilight descends early, the flickering lights within the hotel cast long shadows, making the spaces feel both intimate and claustrophobic. The sound of laughter from the lounge occasionally punctuates the otherwise hushed tones of whispered conversations, as guests gather for warmth and camaraderie while the world outside is shrouded in gloom.",
    "Fashion trends during this period reflect a post-war optimism tempered by the realities of daily life. Men don navy wool suits with wide lapels, their attire complemented by felt fedoras and leather gloves, ready to brave the elements. Women, too, find elegance in their tea-length dresses, adorned with floral prints that offer a splash of color against the otherwise muted winter landscape. Practicality reigns as they layer cashmere cardigans over their outfits, embodying a spirit of resilience and grace in their pursuit of normalcy amidst uncertainty.",
    "Daily life in February 1946 is marked by the resilience of a nation recovering from war. The hotel serves as a microcosm of society, where guests partake in card games by the fire or share stories over mugs of steaming cocoa. Prices remain modest, with a loaf of bread costing just four pence, yet the struggle against inflation is palpable. Social rituals, such as Sunday family dinners, provide a comforting routine, while the evening strolls along the coast offer a momentary escape from the weight of the world outside. Yet, beneath the surface, conversations hint at ongoing societal shifts, with women stepping into professional roles and discussions of racial equality gaining momentum, challenging the status quo."
  ],
  "note": "",
  "cost": 0.00126582885,
  "durationMs": 18378
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense gathering at a grand seaside hotel during a stormy weekend brings together a diverse group of guests and staff, all grappling with the societal shifts of post-war life while secrets and resentments simmer beneath the surface.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has seen women entering the workforce, creating new dynamics, while the looming Cold War heightens anxieties and PTSD awareness among returning soldiers."
  },
  "setting": {
    "location": "A grand seaside hotel built in the 1920s, featuring art deco architecture and expansive ocean views.",
    "institution": "hotel",
    "weather": "overcast with occasional rain showers, typical of coastal climates"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an acoustic method, where a gramophone recording played into a soundproofed room fabricates an alibi for the true moment of death."
}

### LOCKED_FACTS
[
  {
    "id": "gramophone_play_time",
    "value": "ten minutes past eleven",
    "description": "The gramophone recording began playing at this exact time, coinciding with the murder."
  },
  {
    "id": "recording_duration",
    "value": "three minutes",
    "description": "The recording played for this duration, perfectly aligning with the timing of the murder."
  },
  {
    "id": "distance_to_lounge",
    "value": "forty feet",
    "description": "The distance from the gramophone to the lounge where the witnesses were located."
  },
  {
    "id": "pressure_plate_weight",
    "value": "twenty pounds",
    "description": "The weight that triggered the noise mechanism."
  },
  {
    "id": "sound_distraction_time",
    "value": "a quarter past eleven",
    "description": "The time when the crashing noise occurred, misleading witnesses."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 5,
    "mid": 13,
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
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "category": "testimonial"
    },
    {
      "id": "clue_7",
      "placement": "early",
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
      "category": "temporal"
    },
    {
      "id": "clue_mid_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_mid_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_mid_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "physical"
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
