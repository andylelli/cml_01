# Actual Prompt Record

- Run ID: `mystery-1784665751813`
- Project ID: ``
- Timestamp: `2026-07-21T20:33:34.076Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `dee70fa8a88f79d4`

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
    "title": "Masquerade of Authority",
    "author": "Your Name",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "poisoning"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Astute investigator",
      "private_secret": "Struggles with self-doubt",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel staff access"
      ],
      "behavioral_tells": [
        "Keen observer of detail"
      ],
      "stakes": "Desire for justice",
      "evidence_sensitivity": [
        "High"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Involved in a controversial medical trial",
      "motive_seed": "inheritance",
      "motive_strength": "unknown",
      "alibi_window": "evening",
      "access_plausibility": "unknown",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Retired naval officer",
      "private_secret": "Hiding a war-time secret",
      "motive_seed": "Fear of exposure",
      "motive_strength": "high",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining room access"
      ],
      "behavioral_tells": [
        "Nervous when questioned"
      ],
      "stakes": "Personal safety",
      "evidence_sensitivity": [
        "Low"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Socialite",
      "private_secret": "In love with a married man",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining room access"
      ],
      "behavioral_tells": [
        "Overly charming"
      ],
      "stakes": "Love",
      "evidence_sensitivity": [
        "Medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Hotel maid",
      "private_secret": "Has a crush on a wealthy guest",
      "motive_seed": "Desire for wealth",
      "motive_strength": "low",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Staff access to all areas"
      ],
      "behavioral_tells": [
        "Eager to please"
      ],
      "stakes": "Financial stability",
      "evidence_sensitivity": [
        "High"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Wealthy businessman",
      "private_secret": "Involved in shady dealings",
      "motive_seed": "Financial gain",
      "motive_strength": "high",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining room access"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Business reputation",
      "evidence_sensitivity": [
        "Medium"
      ],
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
      "summary": "During a masquerade ball at a seaside hotel, Dr. Mallory Finch is found strangled in her room. As Eleanor Voss investigates, she uncovers a web of impersonation and hidden motives, leading her to the true identity of the killer."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on disguis, witness, and woman to expose the false timing.",
      "delivery_path": [
        {
          "step": "Hugo Vane arranges for a look-alike to impersonate Dr. Finch during the ball."
        },
        {
          "step": "He uses his knowledge of the hotel's layout to mislead witnesses."
        },
        {
          "step": "The impersonator provides a false alibi by being seen in the lobby."
        }
      ]
    },
    "outcome": {
      "result": "Hugo Vane is revealed as the murderer."
    }
  },
  "false_assumption": {
    "statement": "The victim was seen alive in the lobby at the time of the murder.",
    "type": "authority",
    "why_it_seems_reasonable": "Witnesses trusted the impersonator's authority as they looked like the victim.",
    "what_it_hides": "The impersonator was not the real Dr. Mallory Finch."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses recall seeing Captain Hale arguing with Dr. Finch shortly before her death.",
      "He had access to her room as a former naval officer."
    ],
    "the_one_flaw": "The timing of Hale's departure from the dining room contradicts the timeline of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken vase near the victim's room suggests a struggle.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The vase was accidentally knocked over by a hotel staff member during the ball.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A hidden letter found in Dr. Finch's room appears to indicate blackmail.",
      "points_at_suspect": "Sylvia Trent",
      "innocent_explanation": "The letter was meant for a different recipient and was mistakenly left behind.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the event, and no outsiders were involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "8:00 PM",
        "9:00 PM"
      ],
      "windows": [
        "8:15 PM - 8:45 PM"
      ],
      "contradictions": [
        "Witnesses state Dr. Finch was alive in the lobby at 8:30 PM, while the murder occurred at 8:45 PM."
      ]
    },
    "access": {
      "actors": [
        "Hotel staff",
        "Guests"
      ],
      "objects": [
        "Dr. Finch's room",
        "Dining room"
      ],
      "permissions": [
        "Staff access to guest areas"
      ]
    },
    "physical": {
      "laws": [
        "No evidence of forced entry into the victim's room"
      ],
      "traces": [
        "Footprints leading away from the crime scene"
      ]
    },
    "social": {
      "trust_channels": [
        "Witness authority",
        "Hotel reputation"
      ],
      "authority_sources": [
        "Hotel management",
        "Local law enforcement"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses saw a woman in a striking red dress resembling Dr. Finch in the lobby at 8:30 PM.",
        "correction": "This indicates the possibility of impersonation, as Dr. Finch was killed later.",
        "effect": "Narrows the suspect pool to those capable of impersonation.",
        "required_evidence": [
          "Witness statements about the woman's appearance and actions.",
          "Dr. Finch's known schedule."
        ],
        "reader_observable": true
      },
      {
        "observation": "The red dress worn by the impersonator was found in the laundry room.",
        "correction": "This dress was not accounted for in Dr. Finch's belongings, implying premeditated disguise.",
        "effect": "Eliminates Beatrice Quill as the impersonator due to size inconsistency.",
        "required_evidence": [
          "Description of the dress from witnesses.",
          "List of clothing items belonging to Dr. Finch."
        ],
        "reader_observable": true
      },
      {
        "observation": "A footprint matching the impersonator's shoe size was found outside Dr. Finch's room.",
        "correction": "This footprint does not match any of the suspects except Hugo Vane.",
        "effect": "Narrows the suspect pool down to Hugo Vane.",
        "required_evidence": [
          "Shoe size of the impersonator.",
          "Footprint analysis report."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares witness, woman, and strik against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are impersonation, witness, and woman.",
    "pass_condition": "If Hugo Vane cannot provide an explanation for the contradiction, he is proven to be the murderer.",
    "evidence_clues": [
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core",
      "clue_culprit_direct_1",
      "clue_fp_contradiction_step_1",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements about the red dress (early) and Dr. Finch's schedule (mid) indicate the possibility of impersonation. Step 2: The dress in the laundry (mid) eliminates Beatrice Quill as the impersonator. Step 3: The footprint analysis (discriminating test) points directly to Hugo Vane."
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
        "clearance_method": "Alibi confirmed by multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Dress size mismatch.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Letter's true recipient identified.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening",
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
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_culprit_direct_hugo_vane",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_late_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Discriminating test"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
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
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_1",
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
        "clue_id": "clue_fp_elimination_beatrice_quill",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_sylvia_trent",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_mid_1",
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
    "summary": "A retired teacher turned amateur sleuth, Eleanor Voss is known for her sharp wit and keen observations, yet she grapples with a terminal illness that casts a shadow over her investigative pursuits.",
    "publicPersona": "A respected former teacher known for her sharp wit and keen observations.",
    "privateSecret": "Struggles with a terminal illness and fears leaving her family without support.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "present at the hotel for a reunion",
    "accessPlausibility": "easy",
    "stakes": "Desires to uncover family secrets for her own peace of mind.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a clear, measured tone, often lacing her observations with dry humour. She tends to use literary references to illustrate her points, revealing her background as an educator.",
    "signatureTic": "Ah, the plot thickens.",
    "internalConflict": "Fears that her illness will leave her family unprepared and in disarray, pushing her to seek closure and understanding.",
    "personalStakeInCase": "Eleanor’s investigation is driven by her desire to leave her family with a sense of clarity and resolution, rather than lingering questions.",
    "paragraphs": [
      "Eleanor Voss stands at the edge of the hotel balcony, the salty breeze ruffling her hair as she gazes out at the tumultuous sea. The reunion she had anticipated with a mix of excitement and trepidation has turned into something darker — a murder that has shaken the very foundation of her family. Once a respected educator, Eleanor now finds herself donning the hat of an amateur sleuth, her sharp wit serving as her greatest asset in navigating the murky waters of familial secrets.",
      "Behind her public persona lies a woman grappling with a terminal illness, a truth she conceals from those she loves. The fear of leaving her family adrift without her guidance gnaws at her, compelling her to uncover the hidden truths that may offer them solace. Each step she takes in her investigation is laden with the weight of her own mortality, a constant reminder that time is not on her side. 'Ah, the plot thickens,' she muses, her voice tinged with a bitter irony that only those who have faced such realities can understand.",
      "Eleanor's access to the family dynamics is seamless, as she has always been a keen observer of human nature. The reunion had promised a chance to reconnect, but now it feels more like a gathering of suspects. As she engages with her family, she employs her dry wit to mask the turmoil within. She understands that her journey is not just about solving the mystery; it is also about confronting her own fears and the legacy she wishes to leave behind.",
      "In the shadows of the investigation, Eleanor finds herself wrestling with the implications of her findings. The secrets she unearths threaten to disrupt the fragile equilibrium of her family, and she must decide whether the truth is worth the potential fallout. Her internal conflict intensifies as she navigates this treacherous path, knowing that each revelation could alter the course of her family's future. Yet, deep down, she yearns for peace — for herself and for those she holds dear."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A progressive physician, Dr. Mallory Finch is caught in the crosshairs of familial expectations and her own aspirations, ultimately becoming the victim of a deadly plot.",
    "publicPersona": "A progressive doctor advocating for women's rights in medicine.",
    "privateSecret": "Hides her resentment towards her wealthy family's expectations and her desire to break free from them.",
    "motiveSeed": "Might lose her inheritance if the victim's will is updated to exclude her.",
    "motiveStrength": "moderate",
    "alibiWindow": "In surgery during the time of the murder.",
    "accessPlausibility": "possible",
    "stakes": "Dr. Finch wishes to prove her worth apart from her lineage and secure her financial future.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks in a precise, clinical manner, often using medical jargon that can alienate those outside her profession. She rarely indulges in humour, focusing instead on the gravity of her work and her frustrations.",
    "signatureTic": "It's a matter of life and death.",
    "internalConflict": "Struggles with the duality of her identity as both a doctor and a woman caught in the snare of her family's expectations.",
    "personalStakeInCase": "Dr. Finch's personal stake in the investigation lies in her desire to assert her independence and prove her worth outside her family's shadow.",
    "paragraphs": [
      "Dr. Mallory Finch stands in the sterile environment of the hospital, the smell of antiseptic hanging in the air like a shroud. As a physician, she has dedicated her life to advocating for women's rights in medicine, yet the weight of her family's expectations looms over her like a dark cloud. Her public persona as a progressive doctor is a façade that hides the resentment she feels towards the life mapped out for her by her wealthy lineage. 'It's a matter of life and death,' she often reminds her patients, but in her own life, it feels as though she is suffocating beneath the pressure of familial obligations.",
      "On the fateful night of the murder, Dr. Finch is in surgery, her hands steady and precise as she navigates the complexities of her work. Yet, even in the operating room, her mind wanders to the consequences of her family’s influence over her life. The thought of losing her inheritance if the victim's will is updated to exclude her gnaws at her, feeding her internal conflict. She is caught between the desire to break free and the fear of being cast aside, a mere shadow in her family's legacy.",
      "While she may have an alibi, the question of motive hangs heavy in the air. Dr. Finch is determined to prove her worth apart from her lineage, but as the investigation unfolds, she realizes that her aspirations are intertwined with the deadly secrets of her family. The stakes are high; her financial future depends on the outcome of this investigation, and the thought of losing everything she has fought for is unbearable. With each revelation, she feels the walls closing in, and the pressure to conform threatens to overwhelm her.",
      "In the shadows of her own ambition, Dr. Finch's journey becomes one of reconciliation. She must confront not only the murder that has shaken her family but also her own conflicting desires. As the investigation deepens, she grapples with the reality of her situation, striving to carve out her identity while navigating the treacherous waters of family loyalty and expectation."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired Navy officer with a gruff exterior, Captain Ivor Hale is burdened by guilt from his past, leading him to become a prime suspect in the murder investigation.",
    "publicPersona": "A gruff yet honorable former naval captain with a strong sense of duty.",
    "privateSecret": "Carries guilt over a past incident that cost lives, which he blames the victim for exposing.",
    "motiveSeed": "Wants to prevent the victim from revealing damaging information about his past.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be on the hotel balcony at the time.",
    "accessPlausibility": "easy",
    "stakes": "Captain Hale wishes to protect his reputation and past from being tarnished.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Captain Hale's speech is characterized by a gravelly tone and a tendency to speak in short, clipped sentences. He often uses military jargon and self-deprecating remarks that reveal his inner turmoil.",
    "signatureTic": "Duty calls.",
    "internalConflict": "Haunted by guilt over a past decision that led to loss of life, he struggles to reconcile that guilt with his desire to protect his reputation.",
    "personalStakeInCase": "Captain Hale’s investigation is driven by a need to confront his past and protect the legacy he wishes to leave behind.",
    "paragraphs": [
      "Captain Ivor Hale leans against the railing of the hotel balcony, his steely gaze fixed on the horizon. The ocean waves crash against the rocks below, a fitting metaphor for the turmoil within him. A retired Navy officer, Hale has always prided himself on his sense of duty, yet that very sense has now placed him in the crosshairs of a murder investigation. His gruff exterior hides a burden of guilt that weighs heavily on his conscience — a past incident that cost lives, one that he blames the victim for exposing. 'Duty calls,' he mutters to himself, as if trying to remind himself of the honorable path he has always walked.",
      "As the investigation unfolds, Hale's access to the family dynamics becomes increasingly evident. He had claimed to be on the balcony at the time of the murder, but the truth is more complicated. The victim had threatened to reveal secrets that could tarnish his reputation, and the thought of his past being laid bare fills him with dread. With each passing moment, he feels the walls closing in, his self-deprecating humour serving as a shield against the weight of his guilt. He often chuckles darkly about his own failures, masking the shame that lingers just beneath the surface.",
      "The stakes are high for Captain Hale, as he grapples with the reality that he may be implicated in a crime he did not commit. The desire to protect his reputation and the memory of those he lost drives him to take action, yet the fear of exposure looms large. He must confront not only the specter of his past but also the current crisis that threatens to unravel everything he has worked for. Each revelation during the investigation forces him to face the uncomfortable truths he has long tried to bury.",
      "As he navigates this treacherous path, Captain Hale finds himself at a crossroads. He must decide whether to protect his own interests or to seek redemption for the past that haunts him. The investigation is not just about the murder; it is also about his own journey towards forgiveness and acceptance. In the end, he realizes that the only way to move forward is to confront the ghosts of his past and find a way to reconcile the man he was with the man he wishes to be."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An ambitious aspiring writer, Beatrice Quill is caught between her feelings for Captain Hale and her desire to make a name for herself, leading her to become a suspect in the murder investigation.",
    "publicPersona": "An ambitious young woman seeking her voice in a changing world.",
    "privateSecret": "Has been secretly in love with Captain Hale, creating tension with the victim, who disapproves.",
    "motiveSeed": "Could have wanted to eliminate the victim as an obstacle to her romantic pursuit.",
    "motiveStrength": "moderate",
    "alibiWindow": "In her room writing during the evening.",
    "accessPlausibility": "possible",
    "stakes": "Beatrice aims to establish herself as a writer and assert her independence.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice's speech is characterized by a youthful exuberance and a tendency to use irony and sarcasm. She often engages in playful banter, particularly when discussing her ambitions.",
    "signatureTic": "What’s a girl gotta do?",
    "internalConflict": "Torn between her romantic feelings for Captain Hale and her aspirations as a writer, she struggles to find her own identity.",
    "personalStakeInCase": "Beatrice's involvement in the investigation stems from her desire to prove her worth and independence in a male-dominated world.",
    "paragraphs": [
      "Beatrice Quill sits in her dimly lit hotel room, the clatter of her typewriter echoing off the walls like a heartbeat. An aspiring writer, she is determined to carve out her voice in a world that often stifles young women. The murder that has transpired at the hotel casts a long shadow over her ambitions, yet it also provides her with a twisted sense of inspiration. 'What’s a girl gotta do?' she quips to herself, her sardonic humour a defense against the chaos surrounding her.",
      "Caught in a web of unrequited love, Beatrice finds herself drawn to Captain Hale, the gruff naval officer whose past remains shrouded in mystery. Her feelings for him create a tension with the victim, who openly disapproves of their connection. As the investigation unfolds, Beatrice grapples with her emotions, questioning whether her romantic pursuits are worth the potential fallout. She wonders if eliminating the victim could be a means to assert her independence, but the thought frightens her, leading to a tangled internal conflict.",
      "Her alibi claims she was in her room writing during the time of the murder, but the truth is more complicated. Beatrice's ambition battles against her feelings, and she fears that her aspirations may be overshadowed by her infatuation. The stakes are high; establishing herself as a writer is paramount, yet the investigation forces her to confront the darker aspects of her desires. With each twist and turn, she feels the pressure mounting, her sardonic wit becoming both a shield and a weapon.",
      "As Beatrice navigates the investigation, she realizes that her journey is not just about uncovering the truth but also about discovering who she is. The tangled emotions surrounding her feelings for Captain Hale and her aspirations as a writer force her to confront the complexities of her identity. In the end, Beatrice must decide whether to pursue love or to forge her own path, embracing the independence she so desperately craves."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A wealthy widow with a shrewd mind, Sylvia Trent is a power broker entangled in a web of financial deceit, making her a prime suspect in the murder investigation.",
    "publicPersona": "A shrewd, influential matriarch who controls family wealth.",
    "privateSecret": "Has been embezzling funds from the family estate to support her own investments.",
    "motiveSeed": "Fears exposure of her financial misdeeds if the victim decides to take control of the estate.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be attending a charity event at the time.",
    "accessPlausibility": "unlikely",
    "stakes": "Sylvia wishes to maintain her lavish lifestyle and the family's reputation.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Sylvia speaks with a refined elegance, often using double entendres and veiled insults. Her tone is smooth, with a hint of condescension that belies her true intentions.",
    "signatureTic": "Money makes the world go round.",
    "internalConflict": "Struggles with the fear of losing control over her family's wealth and the consequences of her embezzlement.",
    "personalStakeInCase": "Sylvia's personal stake in the investigation stems from her desire to protect her lavish lifestyle and the family reputation she has meticulously crafted.",
    "paragraphs": [
      "Sylvia Trent glides through the hotel lobby, her presence commanding attention as she weaves between guests with the grace of a queen. A wealthy widow, she has built her reputation as a shrewd matriarch, a power broker who controls the family wealth with an iron fist. Yet, beneath the polished exterior lies a woman entangled in a web of financial deceit. 'Money makes the world go round,' she often muses, her polite savagery evident in her choice of words, as she navigates the dynamics of family and power.",
      "On the night of the murder, Sylvia claimed to be attending a charity event, a convenient alibi that raises eyebrows among those who know her well. The truth is more sinister; she has been embezzling funds from the family estate to support her own investments, a risk that could expose her to ruin if the victim decides to take control of the estate. The stakes are high, and the fear of losing her lavish lifestyle looms large, casting a shadow over her every interaction.",
      "Sylvia's access to the family's affairs is undeniable, yet her influence is often masked by her genteel demeanor. She wields her power with a subtle ferocity, manipulating those around her to maintain her grip on the family's wealth. Her conversations are laced with double entendres, veiled insults that reveal her true nature. As the investigation unfolds, she finds herself walking a tightrope, balancing the need to protect her secrets with the desire to maintain her façade of respectability.",
      "In the depths of her internal conflict, Sylvia grapples with the consequences of her actions. The fear of exposure gnaws at her, while the allure of wealth and power continues to tempt her. She must navigate the treacherous waters of the investigation, all while maintaining the illusion of control. Ultimately, she faces a reckoning that will force her to confront the lengths she will go to preserve her legacy and the family name she has so carefully crafted."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A charming businessman with a hidden agenda, Hugo Vane is a con artist embroiled in a deadly scheme, making him a compelling suspect in the murder investigation.",
    "publicPersona": "A charming entrepreneur with a rising reputation in the business world.",
    "privateSecret": "Is actually a con artist planning to exploit the victim's family for financial gain.",
    "motiveSeed": "Stands to gain financially if the victim is out of the way and he can manipulate the estate.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claims to have been meeting clients, but no witnesses were present.",
    "accessPlausibility": "possible",
    "stakes": "Hugo aims to secure his financial future through deceit.",
    "humourStyle": "blunt",
    "humourLevel": 0.6,
    "speechMannerisms": "Hugo speaks with a confident, almost cocky demeanor, often using blunt language to get straight to the point. His charm is disarming, masking his true intentions.",
    "signatureTic": "Let’s cut to the chase.",
    "internalConflict": "Struggles with the morality of his actions as a con artist, torn between ambition and the consequences of his deceit.",
    "personalStakeInCase": "Hugo's involvement in the investigation stems from his desire to secure his financial future and maintain his carefully crafted image.",
    "paragraphs": [
      "Hugo Vane leans against the bar, the soft glow of the chandelier reflecting in his eyes as he surveys the hotel lobby. A charming businessman with a rising reputation, he knows how to work a room, his smile disarming even the most skeptical of guests. Yet, beneath that polished exterior lies a con artist with a hidden agenda, ready to exploit the victim's family for his own financial gain. 'Let’s cut to the chase,' he often says, his bluntness a façade that masks the calculating mind beneath.",
      "On the night of the murder, Hugo claims to have been meeting clients, but the absence of witnesses raises questions about his alibi. The stakes are high; if the victim is out of the way, he stands to gain significantly, manipulating the estate to secure his financial future. As the investigation unfolds, Hugo's charming demeanor begins to crack, revealing the internal conflict he faces. He is torn between his ambition and the morality of his actions, the weight of deceit pressing heavily upon him.",
      "His access to the family's affairs is plausible, and he plays his role well, charming those around him while keeping his true intentions hidden. Yet, as the investigation intensifies, he finds himself in a precarious position, where the line between ambition and greed blurs. The stakes escalate, and Hugo realizes that his carefully crafted image is at risk of being shattered, leaving him vulnerable to the very consequences he seeks to avoid.",
      "In the end, Hugo must confront the reality of his choices. The investigation forces him to reckon with the consequences of his deceit and the lengths he is willing to go to secure his future. As he navigates the treacherous landscape of lies and betrayal, he must decide whether to continue down the path of manipulation or to seek redemption, even if it means sacrificing the ambitions that have driven him thus far."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Mariner's Retreat",
    "type": "Hotel",
    "place": "Whitby",
    "country": "England",
    "summary": "A coastal hotel with art deco elegance, overlooking the tumultuous North Sea, frequented by both tourists and locals.",
    "visualDescription": "The Mariner's Retreat is a striking art deco structure, its white stucco façade contrasting with the jagged cliffs behind. Tall, narrow windows frame the ocean view, while geometric patterns adorn the entrance and balconies. Inside, polished wood and brass fixtures gleam under the soft glow of pendant lights, and a grand staircase spirals upwards, leading to the upper floors.",
    "atmosphere": "A blend of elegance and tension, the hotel is a sanctuary for weary travelers yet hums with unease amidst whispers of recent disturbances.",
    "paragraphs": [
      "The Mariner's Retreat stands resolute against the crashing waves of the North Sea, its art deco lines sharp against the brooding sky. Inside, the air is thick with a mixture of sea salt and polished wood, punctuated by the distant sound of a radio broadcasting updates from the front. Guests, wrapped in heavy coats, move quietly through the lobby, their faces reflecting the weight of wartime anxiety. The flickering light from the sconces casts elongated shadows, creating a sense of foreboding as the evening descends.",
      "In the dining area, the clinking of silverware competes with the murmurs of conversation, where locals and travelers alike exchange stories of the tumultuous world outside. The scent of roasted meats and buttered vegetables wafts through the air, momentarily distracting from the underlying tension. Yet, as the rain begins to patter against the windows, the atmosphere shifts, and the rhythmic sound becomes a backdrop to hushed tones discussing the latest rumors of espionage and betrayal.",
      "Upstairs, the narrow hallways are lined with plush carpets that muffle footsteps, enhancing the sense of isolation. Each guest room is a sanctuary, yet the thin walls carry whispers of secrets and fears. The staff-only areas are strictly controlled, accessible only with keycards, adding to the sense of surveillance that permeates the hotel. As night envelops the coast, the ocean's roar becomes a reminder of the dangers lurking just beyond the safety of the Mariner's Retreat."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of a coastal climate",
    "timeFlow": "Three days of escalating tension as secrets unravel.",
    "mood": "Tense, as guests are aware of recent local disturbances and wartime anxieties",
    "eraMarkers": [
      "Art deco architecture",
      "Radio broadcasting news updates",
      "Rationed wartime vehicles in the parking lot"
    ],
    "sensoryPalette": {
      "dominant": "A salty tang of ocean air mixed with polished wood",
      "secondary": [
        "The warmth of candlelight flickering",
        "The distant sound of waves crashing"
      ]
    },
    "paragraphs": [
      "The atmosphere inside the Mariner's Retreat is a palpable mix of elegance and anxiety, with the scent of damp sea air mingling with polished wood and brass. The overcast sky outside casts a muted light through the tall windows, creating a somber ambiance that reflects the weight of the world outside. Guests move about with an air of caution, their eyes darting to the windows as if expecting the storm to bring more than just rain.",
      "As night falls, the hotel transforms under the flickering glow of gas lamps. Conversations grow hushed, and the crackle of the radio seems to amplify the tension in the air. The distant sound of the ocean provides a relentless reminder of the isolation that defines this coastal haven, while the scent of rain-soaked earth creeps in through the cracks, reminding all within that nature, much like the mysteries that unfold, cannot be contained."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Ocean View Lounge",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Sophisticated lounge with oversized windows overlooking the sea; plush velvet sofas and low tables create an intimate setting.",
      "sensoryDetails": {
        "sights": [
          "dimly lit with soft amber glow",
          "ocean waves crashing against cliffs"
        ],
        "sounds": [
          "soft jazz playing on a radio",
          "the murmur of concerned guests"
        ],
        "smells": [
          "rich tobacco smoke",
          "sea-salt and damp upholstery"
        ],
        "tactile": [
          "cool glass of a cocktail",
          "soft velvet cushions"
        ]
      },
      "accessControl": "Accessible to all guests; closed off to staff after midnight for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "water droplets racing down glass"
          ],
          "sounds": [
            "steady drumming on the roof",
            "low thunder in the distance"
          ],
          "smells": [
            "wet stone and seaweed",
            "freshly brewed coffee"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim lighting casting long shadows",
            "glistening wet surfaces"
          ],
          "sounds": [
            "distant gulls crying",
            "the soft rustle of newspapers"
          ],
          "smells": [
            "cooked fish and chips",
            "lingering perfume"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candle flames flickering",
            "stars beginning to twinkle outside"
          ],
          "sounds": [
            "the tick of an ornate clock",
            "laughter and conversation rising"
          ],
          "smells": [
            "grilled meats and spices",
            "ocean breeze carrying salt"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Ocean View Lounge, once a place of laughter and camaraderie, has become a scene of chaos and confusion. Plush velvet sofas now witness the aftermath of a sudden tragedy, the air thick with the scent of tobacco and the salty tang of the sea. Guests gather in clusters, their faces pale and anxious, as whispers of the incident ripple through the room. The elegant decor contrasts sharply with the tension in the air, where every glance towards the ocean seems to hold a hidden fear.",
        "As the rain begins to patter against the windows, a sense of foreboding settles over the lounge. The soft jazz playing on the radio feels eerily out of place, a haunting backdrop to the unfolding mystery. Shadows dance across the walls, and the flickering candlelight provides little comfort. All eyes are drawn to the ocean, where the waves crash relentlessly, echoing the turmoil within the hotel."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Grand Dining Room",
      "type": "interior",
      "purpose": "Gathering space for meals and conversations",
      "visualDetails": "Expansive room with tall windows and elegant chandeliers; tables dressed in crisp white linens.",
      "sensoryDetails": {
        "sights": [
          "elegant chandeliers casting warm light",
          "freshly arranged floral centerpieces"
        ],
        "sounds": [
          "clinking of silverware",
          "soft laughter and chatter"
        ],
        "smells": [
          "roasted meats and spices",
          "freshly baked bread"
        ],
        "tactile": [
          "smooth linen tablecloths",
          "warm porcelain plates"
        ]
      },
      "accessControl": "Open to all guests during meal times; staff only allowed during preparation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light through rain-splattered windows",
            "water pooling on the floor"
          ],
          "sounds": [
            "soft drumming of rain",
            "the distant sound of waves"
          ],
          "smells": [
            "freshly brewed coffee",
            "cooked eggs and bacon"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the room",
            "dust motes illuminated by light"
          ],
          "sounds": [
            "quiet conversations",
            "the rustle of newspaper pages"
          ],
          "smells": [
            "freshly prepared dishes",
            "a hint of cleaning products"
          ],
          "mood": "reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glimmering candlelight",
            "elegant table settings"
          ],
          "sounds": [
            "clinking glasses",
            "music from a gramophone"
          ],
          "smells": [
            "sweet desserts baking",
            "aromatic herbs"
          ],
          "mood": "celebratory"
        }
      ],
      "paragraphs": [
        "The Grand Dining Room, with its tall windows and elegant chandeliers, serves as the heart of the Mariner's Retreat. Here, guests gather to share meals and stories, the atmosphere filled with the aroma of roasted meats and freshly baked bread. The sound of clinking silverware creates a comforting rhythm, while laughter dances through the air. Yet, beneath the surface, an undercurrent of tension lingers, as whispers of recent events circulate with every bite.",
        "As evening falls, the room transforms under the soft glow of candlelight, casting flickering shadows on the walls. The conversations grow more animated, but the tension is palpable; each guest seems to be waiting for something to happen. The scent of sweet desserts wafts through the air, mingling with the salty breeze from the ocean, creating a bittersweet reminder of the world outside the hotel walls."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Quiet space for reading and reflection",
      "visualDetails": "A cozy room filled with dark wooden shelves, lined with books; a large bay window overlooks the sea.",
      "sensoryDetails": {
        "sights": [
          "dark wooden shelves overflowing with books",
          "narrow shadows along the corridor"
        ],
        "sounds": [
          "pages turning softly",
          "the rustle of a newspaper"
        ],
        "smells": [
          "old leather and dusty pages",
          "freshly brewed tea"
        ],
        "tactile": [
          "soft fabric of armchairs",
          "coolness of a porcelain teacup"
        ]
      },
      "accessControl": "Open to all guests during the day; locked at night to preserve silence.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through grey clouds",
            "puddles forming outside"
          ],
          "sounds": [
            "gentle patter of rain",
            "the rustling of wet leaves"
          ],
          "smells": [
            "damp wood and mildew",
            "freshly baked scones"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the pages",
            "dust motes floating in the air"
          ],
          "sounds": [
            "the creak of floorboards",
            "soft whispers of guests"
          ],
          "smells": [
            "old books and polished wood",
            "freshly brewed coffee"
          ],
          "mood": "contemplative"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on the shelves",
            "stars twinkling outside"
          ],
          "sounds": [
            "the soft tick of a clock",
            "the crackle of a fire in the hearth"
          ],
          "smells": [
            "smoky warmth of the fireplace",
            "a hint of chocolate"
          ],
          "mood": "serene"
        }
      ],
      "paragraphs": [
        "The Library of the Mariner's Retreat is a sanctuary of quiet, its dark wooden shelves lined with books that whisper stories of old. The large bay window offers a view of the roiling sea, where waves crash against the cliffs, a constant reminder of the world's chaos outside. Inside, the air is rich with the smell of old leather and dusty pages, and the soft fabric of the armchairs invites guests to sink into their embrace. Here, one can escape the tumultuous reality, if only for a moment.",
        "In the late afternoon, as shadows play across the room, the Library becomes a refuge for those seeking solace. The soft rustle of pages turning and the distant sound of rain tapping against the window create an atmosphere of introspection. Guests sip on freshly brewed tea, the warmth of their cups contrasting with the coolness of the ocean air. Yet, even in this sanctuary, the tension of the outside world seeps through the cracks, reminding all who enter that secrets linger just beneath the surface."
      ]
    }
  ],
  "note": "",
  "cost": 0.0018564446999999999,
  "durationMs": 22116
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "February",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "Overcast skies with frequent rain showers",
      "Chilly breezes cutting through damp air",
      "Occasional bursts of sunshine breaking through gray clouds"
    ],
    "daylight": "Daylight is short, with the sun setting around five o'clock in the evening, casting long shadows and an early twilight.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests retreat to their rooms or gather in the dimly lit lounge.",
    "holidays": [
      "Valentine's Day (February 14)"
    ],
    "seasonalActivities": [
      "Indoor gatherings and dances at local venues to escape the winter chill",
      "Thematic events celebrating Valentine's Day, such as masquerade balls and charity auctions",
      "Cozy evenings spent by the fireplace, listening to the radio or reading"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Navy blue wool suits with wide lapels",
        "White dress shirts with stiff collars",
        "Silk ties featuring geometric patterns"
      ],
      "casual": [
        "Khaki trousers paired with wool sweaters",
        "Tweed jackets for warmth and style",
        "Leather shoes polished to a high shine"
      ],
      "accessories": [
        "Fedoras or caps to ward off the cold and add flair",
        "Leather gloves for warmth and sophistication",
        "Pocket watches, a common sight among gentlemen"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea-length dresses with cinched waists and flowing skirts",
        "Faux fur stoles or wraps for evening events",
        "Pearl necklaces as a staple accessory"
      ],
      "casual": [
        "Woolen cardigans over fitted blouses",
        "A-line skirts paired with knee-high boots",
        "Hats adorned with feathers or flowers for daytime outings"
      ],
      "accessories": [
        "Clutch bags for evening wear",
        "Silk scarves tied around the neck or head",
        "Brooches to add a touch of elegance"
      ]
    },
    "trendsOfTheMoment": [
      "Emphasis on practicality in clothing due to wartime rationing",
      "Use of brighter colors and patterns as a form of escapism",
      "Continued popularity of vintage styles from the 1930s"
    ],
    "socialExpectations": [
      "Men expected to be chivalrous and respectful towards women, especially in formal settings",
      "Women increasingly stepping into roles traditionally held by men, including in the workforce",
      "Social gatherings often serve as a platform for war-related discussions and support for troops"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Allies' successful landings in Italy have boosted morale",
      "The ongoing Battle of the Atlantic intensifies as U-boats threaten shipping lanes",
      "Discussion of the Yalta Conference, where Allied leaders plan post-war Europe"
    ],
    "politicalClimate": "Tensions are rising as nations grapple with the realities of war and its aftermath, with alliances shifting and post-war plans being laid.",
    "economicConditions": "Rationing remains in place, affecting daily life; however, the economy is recovering as factories shift from wartime production to peacetime goods.",
    "socialIssues": [
      "Debates on women's rights and their roles in the workforce",
      "Concerns over returning soldiers and their reintegration into society",
      "Growing awareness of racial issues, particularly as minorities serve in the military"
    ],
    "internationalNews": [
      "Reports on the progress of the war in Europe and the Pacific",
      "Focus on humanitarian efforts for displaced persons due to the conflict",
      "Increased propaganda efforts to maintain public morale"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "The Andrews Sisters' upbeat tunes",
        "Glenn Miller's big band sound"
      ],
      "films": [
        "Casablanca, a tale of love and sacrifice during wartime",
        "Meet Me in St. Louis, highlighting family and home life",
        "The Song of Bernadette, exploring themes of faith and perseverance"
      ],
      "theater": [
        "Broadway hits like Oklahoma! capturing the spirit of the time",
        "War-themed plays garnering attention for their resonance with audiences",
        "Vaudeville acts providing lighthearted entertainment"
      ],
      "radio": [
        "The Shadow, a thrilling mystery program",
        "War news broadcasts keeping citizens informed",
        "Comedy shows like Jack Benny's program providing much-needed laughter"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Fountainhead by Ayn Rand, exploring individualism",
        "The Thin Man by Dashiell Hammett, a classic detective story",
        "The Diary of a Young Girl by Anne Frank, highlighting the experiences of youth during war"
      ],
      "popularGenres": [
        "Mystery and detective fiction reflecting societal tensions",
        "Romantic novels providing escapism",
        "War literature detailing the human experience of conflict"
      ]
    },
    "technology": {
      "recentInventions": [
        "The first programmable computer, Mark I, is making waves in tech circles",
        "Radar technology is being enhanced for military applications",
        "Advancements in medical technology for treating war injuries"
      ],
      "commonDevices": [
        "Table radios as a central feature in homes for news and entertainment",
        "Television sets being introduced but not yet widespread",
        "Typewriters as essential tools for communication and documentation"
      ],
      "emergingTrends": [
        "Increased use of military technology in civilian applications post-war",
        "The start of consumer interest in home appliances as production ramps up",
        "Growing fascination with the emerging field of aviation"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pound of sugar: six pence",
        "A pint of milk: three pence"
      ],
      "commonActivities": [
        "Attending community dances and social events",
        "Listening to the radio for news and entertainment",
        "Participating in volunteer efforts to support the troops"
      ],
      "socialRituals": [
        "Evening gatherings around the radio to listen to music or news",
        "Valentine's Day celebrations with themed parties and gifts"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "The upper class maintains a sense of privilege despite war's toll",
      "Middle-class values emphasize hard work and community support",
      "The working class sees an increase in opportunities as women enter the workforce"
    ],
    "gender": [
      "Women are increasingly recognized for their contributions in the workforce",
      "Traditional gender roles are challenged as families adapt to wartime needs",
      "Men are expected to return to their roles as providers after the war"
    ],
    "race": [
      "Racial segregation remains a contentious issue, particularly in the South",
      "Increased visibility of African Americans serving in the military",
      "Growing civil rights movements begin to take shape"
    ],
    "generalNorms": [
      "Civility in public interactions, with an emphasis on polite behavior",
      "Patriotism is a strong sentiment, with many supporting the war effort",
      "Community solidarity is fostered through shared experiences and challenges"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and fresh rain mingles with the aroma of wood smoke from nearby chimneys, creating a comforting yet tense atmosphere.",
    "The sound of distant thunder rolls in occasionally, echoing the unease among the hotel guests as they whisper about the latest war news.",
    "The flickering lights of the hotel lobby cast long shadows, heightening the sense of intrigue as guests don their masks for the evening's masquerade ball."
  ],
  "paragraphs": [
    "February 1944 brings a chill to the coastal town, where the weather is often overcast with intermittent rain showers. The atmosphere within the grand hotel is charged with the tension of wartime anxieties, as guests gather in the dimly lit lounge, sharing hushed conversations about recent disturbances in the area. The short daylight hours leave many feeling restless, prompting indoor activities that include gatherings around the radio or participating in festive events for Valentine's Day. The masquerade ball planned for the 15th serves as a welcome distraction from the grim realities of the ongoing war, where elaborate masks and formal attire allow for a brief escape into a world of elegance and intrigue.",
    "Fashion in February 1944 reflects the duality of wartime practicality and the yearning for beauty. Men don navy wool suits with wide lapels, complemented by crisp white shirts and silk ties, while women embrace tea-length dresses with cinched waists, often accessorized with faux fur stoles and pearl necklaces. The colors are brighter than the dreary winter surroundings, a testament to the human spirit’s resilience amid adversity. As guests prepare for the masquerade, the hotel buzzes with the sound of laughter and the rustle of dresses, while the scent of floral arrangements fills the air, creating an enchanting atmosphere of mystery and allure.",
    "Daily life continues under the shadow of the war, with rationing affecting everything from food to clothing. Guests at the hotel discuss the prices of everyday items, like a loaf of bread costing four pence and a pint of milk three pence, while participating in community events that support the troops. Social rituals such as gathering around the radio become vital lifelines, connecting individuals to the world outside. The roles of men and women are evolving, with women stepping into jobs traditionally held by men, which adds another layer of complexity to the social fabric. The masquerade, with its promise of anonymity and excitement, presents a perfect opportunity for guests to navigate these changing dynamics while embracing the thrill of the unknown."
  ],
  "note": "",
  "cost": 0.00139252905,
  "durationMs": 32279
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A masquerade ball at a coastal hotel draws a diverse group of guests, each grappling with the societal upheaval of WWII while secrets and disguises threaten to unravel their carefully constructed lives.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Class dynamics are shifting as women enter the workforce and wartime pressures create a tense atmosphere, forcing individuals to navigate both personal and societal expectations."
  },
  "setting": {
    "location": "A seaside hotel",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain"
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
    "id": "clock_time_lobby",
    "value": "ten minutes past nine",
    "description": "The time the witness claims to have seen the victim in the lobby."
  },
  {
    "id": "clock_time_murder",
    "value": "a quarter past nine",
    "description": "The time of death as determined by the coroner."
  },
  {
    "id": "ring_found",
    "value": "one unique ring",
    "description": "The unusual ring found on the impersonator, linking them to the victim."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 22,
  "countsByPlacement": {
    "early": 8,
    "mid": 13,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 20,
    "supporting": 1,
    "optional": 1
  },
  "redHerringCount": 2,
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
      "category": "spatial"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_6",
      "placement": "early",
      "criticality": "supporting",
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
      "id": "clue_fp_elimination_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_fp_elimination_beatrice_quill",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_fp_elimination_sylvia_trent",
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
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_1",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
