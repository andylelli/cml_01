# Actual Prompt Record

- Run ID: `mystery-1779998607579`
- Project ID: ``
- Timestamp: `2026-05-28T20:09:53.478Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `3983129ccc4f37d1`

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
    "title": "The Wound-Back Pendulum Mystery",
    "author": "GPT-4 Golden Age Specialist",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Mechanical clocks are common and well-understood",
        "Forensic science includes fingerprinting and ballistics",
        "Social hierarchy and etiquette strictly govern manor life",
        "No modern technology beyond telephones and early radios"
      ]
    },
    "setting": {
      "location": "Voss Manor House",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Country house estate (Manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical clock tampering causing false death time"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [
        "Daughter of the unnamed manor matriarch",
        "Respected by staff, distant from Captain Ivor Hale"
      ],
      "public_persona": "Intelligent, composed lady of the house",
      "private_secret": "Has been secretly investigating the manor’s tensions",
      "motive_seed": "Desire to uncover the truth behind her mother’s death",
      "motive_strength": "strong",
      "alibi_window": "Was in the library from ten to midnight",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all manor rooms",
        "Regular presence in manor at night"
      ],
      "behavioral_tells": [
        "Quiet observation",
        "Tends to question servants closely"
      ],
      "stakes": "Resolve family mystery and restore manor peace",
      "evidence_sensitivity": [
        "Clock mechanism details",
        "Servants’ testimonies",
        "Victim’s personal effects"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Local doctor and longtime family friend",
      "relationships": [
        "Trusted by family",
        "Frequent visitor to manor"
      ],
      "public_persona": "Calm, rational physician",
      "private_secret": "Has undisclosed financial troubles",
      "motive_seed": "Blackmail threat from victim’s estate manager",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been attending to a patient in village from 10:30 to 11:45",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access through servant’s entrance",
        "Visits allowed during evening"
      ],
      "behavioral_tells": [
        "Nervous when questioned about timing",
        "Avoids discussing watch details"
      ],
      "stakes": "Protect reputation and financial stability",
      "evidence_sensitivity": [
        "Servants’ schedules",
        "Clock timing contradictions",
        "Doctor’s pocket watch"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "45-55",
      "role_archetype": "Retired military officer and family friend",
      "relationships": [
        "Close to Eleanor Voss",
        "Dislikes Dr. Finch"
      ],
      "public_persona": "Authoritative and straightforward",
      "private_secret": "Resents victim’s financial decisions",
      "motive_seed": "Jealousy over victim’s estate management",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been in the stables from 10 to 11:30",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to stables and servants’ quarters",
        "Often seen roaming grounds at night"
      ],
      "behavioral_tells": [
        "Defensive when questioned",
        "Claims ignorance of clock details"
      ],
      "stakes": "Hopes to influence estate future",
      "evidence_sensitivity": [
        "Stable hand testimony",
        "Clock chiming inconsistencies",
        "Pendulum spring residue"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Manor housekeeper",
      "relationships": [
        "Loyal to Voss family",
        "Resents Captain Hale’s treatment of staff"
      ],
      "public_persona": "Strict, efficient housekeeper",
      "private_secret": "Has overheard disputes about victim’s will",
      "motive_seed": "Protecting family reputation",
      "motive_strength": "moderate",
      "alibi_window": "Was preparing evening meal in kitchen from 9:45 to 11:15",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all servant quarters and kitchen",
        "Knows clock maintenance schedule"
      ],
      "behavioral_tells": [
        "Frequently observes clock when nervous",
        "Mentions unusual clock chimes"
      ],
      "stakes": "Maintain household order and her position",
      "evidence_sensitivity": [
        "Clock pendulum condition",
        "Servants’ testimony about timing",
        "Kitchen utensils and meal logs"
      ],
      "culprit_eligibility": "eligible",
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
      "summary": "At the isolated Voss Manor in 1930s Yorkshire, the sudden death of the manor matriarch appears timed by the stopped grandfather clock at ten minutes past eleven. The household's rigid routines and tight schedules suggest a straightforward timeline. Yet, subtle contradictions in clock chimes, shadow measurements, and servant testimonies reveal a deliberate tampering of the clock’s pendulum suspension spring, causing the clock to lag behind real time by forty minutes. Dr. Mallory Finch's alibi and financial troubles come under suspicion as Eleanor Voss unravels a complex temporal deception exploiting mechanical, social, and cognitive biases to mask the true time of death and the culprit’s opportunity."
    },
    "accepted_facts": [
      "The grandfather clock stopped at ten minutes past eleven.",
      "The manor matriarch was found dead near the clock room.",
      "Servants heard the clock chime thirteen times at midnight.",
      "A watch on the victim’s desk showed twenty past midnight.",
      "Stable hands reported an unusual visitor earlier than the supposed time of death.",
      "The pendulum suspension spring shows deformation and oily residue.",
      "Dinner plates in the kitchen show no signs of recent use at the supposed time.",
      "Dr. Mallory Finch was seen near the manor during the critical time window."
    ],
    "inferred_conclusions": [
      "The grandfather clock was deliberately tampered to slow the pendulum swing, causing a false indication of time.",
      "The victim actually died around twenty past midnight, not at ten minutes past eleven.",
      "Dr. Mallory Finch’s alibi based on the forged clock time is invalid.",
      "Captain Ivor Hale and Beatrice Quill’s alibis are consistent with the corrected timeline.",
      "Dr. Finch is the only suspect with both motive and opportunity during the true time window."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murderer physically tampered with the grandfather clock’s pendulum suspension spring, applying a slight deformation and an oily lubricant to slow its oscillation. This caused the clock hands to advance slower than real time, making the clock stop at what appeared to be ten minutes past eleven when in fact the actual time was about twenty minutes past midnight. This temporal distortion concealed the true time of death, allowing the murderer to establish a false alibi based on the clock time. The mechanism exploits physical laws governing pendulum motion, cognitive biases trusting the manor clock’s accuracy, and social expectations of strict routines.",
      "delivery_path": [
        {
          "step": "Murderer accesses clock room during evening to deform pendulum suspension spring with oily residue."
        },
        {
          "step": "Murder occurs after actual midnight, but clock shows earlier time."
        },
        {
          "step": "Servants and family rely on faulty clock time to establish timeline."
        },
        {
          "step": "Physical evidence (deformed spring, oily residue) and contradictory testimonies reveal the tampering."
        }
      ]
    },
    "outcome": {
      "result": "The false timeline initially misleads all but the observant detective, who uses mechanical and social evidence to expose the true time of death and identify Dr. Mallory Finch as the culprit who manipulated the clock to mask her presence at the manor."
    }
  },
  "false_assumption": {
    "statement": "The grandfather clock’s stopped time accurately marks the victim’s time of death at ten minutes past eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock is a well-known, trusted timepiece regularly maintained and prominently displayed; servants and family rely on its stopped time and chimes as a reliable temporal anchor.",
    "what_it_hides": "The clock was deliberately tampered with to slow the pendulum, causing the hands to lag behind actual time by about forty minutes, thus falsifying the time of death and allowing the murderer to establish a misleading alibi."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock stopped at ten minutes past eleven",
        "Servants heard thirteen chimes at midnight",
        "Victim’s wristwatch stopped at twenty past midnight"
      ],
      "windows": [
        "Dr. Finch claims absence 10:30 to 11:45",
        "Captain Hale in stables 10:00 to 11:30",
        "Beatrice Quill in kitchen 9:45 to 11:15"
      ],
      "contradictions": [
        "Clock chimes thirteen times, impossible for correct clock",
        "Victim’s wristwatch indicates later time than stopped clock",
        "Stable hand reports visitor after supposed death time"
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Eleanor Voss"
      ],
      "objects": [
        "Grandfather clock",
        "Victim’s wristwatch",
        "Kitchen utensils",
        "Stable doors"
      ],
      "permissions": [
        "Dr. Finch allowed in servant’s entrance and clock room",
        "Captain Hale has access to stables and grounds",
        "Beatrice Quill has unrestricted access to kitchen and clock room",
        "Eleanor Voss has access to all manor rooms"
      ]
    },
    "physical": {
      "laws": [
        "Pendulum period proportional to square root of length and suspension elasticity",
        "Mechanical interference slows pendulum swing",
        "Clock hands lag when pendulum slowed"
      ],
      "traces": [
        "Oily residue on pendulum suspension spring",
        "Slight deformation of pendulum suspension spring",
        "No disturbance on kitchen plates at assumed meal time"
      ]
    },
    "social": {
      "trust_channels": [
        "Reliance on manor clock for timing",
        "Servants’ adherence to strict schedules",
        "Witness statements about clock chimes and activity"
      ],
      "authority_sources": [
        "Manor matriarch’s trusted status",
        "Eleanor Voss’s authority in household",
        "Dr. Finch’s social standing as family doctor"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The grandfather clock’s pendulum suspension spring shows a slight deformation and oily residue inconsistent with normal maintenance.",
        "correction": "The clock was physically tampered with, altering its pendulum swing and causing the clock to run slower than real time.",
        "effect": "Narrows the time of death window; invalidates reliance on the clock’s stopped time.",
        "required_evidence": [
          "Pendulum suspension spring with deformation and oily residue",
          "Manor clock stopped at ten minutes past eleven",
          "Beatrice Quill’s testimony about clock maintenance schedule"
        ],
        "reader_observable": true
      },
      {
        "observation": "Servants report hearing thirteen chimes at midnight, an impossible occurrence for the manor clock.",
        "correction": "The clock’s chimes are inconsistent with normal operation, indicating tampering and unreliable timekeeping.",
        "effect": "Eliminates the accepted timeline based on the clock’s chimes, tightening temporal constraints.",
        "required_evidence": [
          "Servants’ testimony of thirteen chimes at midnight",
          "Standard clock chime pattern knowledge",
          "Eleanor Voss’s questioning of servants"
        ],
        "reader_observable": true
      },
      {
        "observation": "A watch found on the victim’s desk stopped at twenty past midnight, conflicting with the clock’s stopped time.",
        "correction": "The victim’s personal watch indicates a later time of death than the manor clock, supporting the conclusion that the clock was running slow.",
        "effect": "Eliminates suspects whose alibis cover the time before twenty past midnight, specifically Captain Ivor Hale and Beatrice Quill.",
        "required_evidence": [
          "Victim’s wristwatch stopped at twenty past midnight",
          "Captain Hale’s alibi in stables 10:00 to 11:30",
          "Beatrice Quill’s alibi in kitchen 9:45 to 11:15"
        ],
        "reader_observable": true
      },
      {
        "observation": "Stable hands report seeing an unusual visitor near the stables after the supposed time of death based on the clock.",
        "correction": "An unauthorized presence at the manor grounds at the true time of death, inconsistent with Captain Hale’s claimed presence and the false timeline.",
        "effect": "Narrows suspect opportunity to those present around actual midnight, implicating Dr. Mallory Finch.",
        "required_evidence": [
          "Stable hand testimony of unusual visitor",
          "False timeline based on stopped clock",
          "Dr. Finch’s alibi claims 10:30 to 11:45 absence"
        ],
        "reader_observable": true
      },
      {
        "observation": "Dinner plates found in the kitchen show no signs of having been used during the assumed time of death based on the clock.",
        "correction": "The assumed time for the evening meal is incorrect, supporting the corrected later timeline of death.",
        "effect": "Eliminates Beatrice Quill’s motive based on meal schedule and confirms timing shift.",
        "required_evidence": [
          "Unused dinner plates in kitchen at assumed meal time",
          "Beatrice Quill’s alibi during meal preparation",
          "Corrected timeline from clock tampering evidence"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled comparison of the manor clock’s pendulum suspension spring with a reference spring under identical conditions reveals the deformation and oily residue that slow the pendulum’s swing. Concurrently, a public recounting of the servants’ thirteen chimes and the victim’s stopped wristwatch time exposes the contradiction in the timeline. This trap forces Dr. Mallory Finch to confront the physical impossibility of her alibi based on the false clock time.",
    "knowledge_revealed": "Exposes the clock tampering mechanism and disproves Dr. Finch’s alibi by showing the clock’s hands lag behind actual time, revealing her presence at the manor during the true time of death.",
    "pass_condition": "Dr. Finch fails to explain the clock’s mechanical alteration and the contradictory timing evidence, confirming her guilt.",
    "evidence_clues": [
      "clue_11",
      "clue_1",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The pendulum spring deformation and oily residue (early clues) allow the reader to suspect clock tampering. Step 2: The servants’ testimony of thirteen chimes (mid clues) contradicts normal clock function. Step 3: The victim’s wristwatch stopped at twenty past midnight (mid clues) conflicts with the clock’s stopped time, invalidating alibis based on the false timeline. Step 4 and 5: Stable hands’ unusual visitor report and unused dinner plates (late clues) narrow suspects. The discriminating test synthesizes these clues to expose the mechanism and culprit."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 4,
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
        "Execute the controlled comparison of pendulum springs",
        "Present servants’ testimony of thirteen chimes",
        "Show victim’s wristwatch stopped time contradiction",
        "Conclude Dr. Finch’s alibi is invalid"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Stable hands’ testimony and consistent alibi during corrected timeline",
        "supporting_clues": [
          "Stable hand testimony of unusual visitor distinct from Hale",
          "Hale’s presence in stables 10:00 to 11:30"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Unused dinner plates and kitchen activity logs confirm alibi during corrected timeline",
        "supporting_clues": [
          "Unused dinner plates at assumed meal time",
          "Beatrice’s kitchen presence 9:45 to 11:15"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Library presence and no contradictions in timing",
        "supporting_clues": [
          "Eleanor’s alibi in library 10:00 to midnight",
          "No evidence contradicting her timeline"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with clock tampering evidence, servants’ testimonies, and victim’s wristwatch time"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
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
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_13",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_14",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_15",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A retired schoolteacher with a sharp mind and a deep knowledge of Voss family history, Eleanor Voss is an amateur sleuth drawn into the mystery by her sense of justice and personal ties to the estate’s legacy.",
    "publicPersona": "Eleanor presents herself as a dignified and respectable spinster, known throughout the county for her unwavering dedication to education and the preservation of local history. Her manner is precise and courteous, and she moves through social circles with the assured grace of one accustomed to being both observer and advisor.",
    "privateSecret": "Beneath her composed exterior lies a secret bond she once shared with the victim’s late spouse, a closeness that granted her access to hidden family documents—among them, a paper that could upend the estate’s inheritance. This knowledge weighs heavily on her conscience, compelling her to tread carefully.",
    "motiveSeed": "N/A - Investigator",
    "motiveStrength": "weak",
    "alibiWindow": "Present in the manor library throughout the evening, engaged in private study.",
    "accessPlausibility": "possible",
    "stakes": "Eleanor is driven by a fierce desire to protect the estate’s legacy from being corrupted by greed or prejudice. Her investigation is fueled by a commitment to justice and the hope that truth will preserve not only property but dignity.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Eleanor speaks with measured calm and an educated tone, often employing gentle irony and understatement. She favors precise diction and occasionally peppers her observations with dry, subtle witticisms that catch listeners unawares.",
    "internalConflict": "Haunted by her secret knowledge of the family document, Eleanor struggles with the fear that revealing it might shatter the fragile peace of the household—or worse, betray a trust long held sacred.",
    "personalStakeInCase": "Her intimate connection to the victim’s late spouse and her role as guardian of the family’s history give Eleanor a personal imperative to see justice done, lest the estate fall into ruin or dishonour.",
    "paragraphs": [
      "Eleanor Voss arrived at Voss Manor as a guest invited to oversee the education of the victim’s young relative, a role that placed her in the heart of the household’s private affairs. Her sharp eyes missed little, and her quiet presence often went unnoticed until she chose to speak, at which point her words carried the weight of experience and insight.",
      "Her reputation as a retired schoolteacher lent her a veneer of harmlessness, but beneath that lay a mind honed by years of study and a passion for uncovering truth. Eleanor’s knowledge of local history and the Voss family’s tangled past gave her a unique vantage point, allowing her to connect dots others overlooked.",
      "Throughout the evening of the murder, Eleanor was ensconced in the manor’s library, ostensibly absorbed in private study. Yet, she was ever alert to the moods and movements around her, quietly piecing together the puzzle from whispered conversations and subtle gestures.",
      "Despite her outward calm, Eleanor carried the burden of a secret: a hidden family document she once glimpsed, which held the power to change the course of inheritance. The fear of its revelation caused her to hesitate, torn between protecting the family’s dignity and exposing the truth that might save justice.",
      "Her humour, delicate and understated, often served as a shield when conversations turned tense. She wielded irony with a light touch, preferring to let others reveal their follies through their own words rather than direct confrontation.",
      "In the end, Eleanor’s pursuit of truth was not merely academic; it was a matter of honour. She sought to ensure that the legacy of Voss Manor was preserved not only in bricks and mortar but in the moral fabric of those who would inherit it."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "The family’s trusted physician, Dr. Mallory Finch balances professional composure with private resentments, her loyalty tested as the estate’s future hangs in the balance.",
    "publicPersona": "Dr. Finch is the epitome of calm professionalism, a figure respected by both family and staff for her dedication and medical expertise. She carries herself with quiet authority, her presence a reassuring constant in the estate’s affairs.",
    "privateSecret": "Beneath her composed exterior simmers a deep resentment over the denial of partnership in the family’s medical practice. The victim’s plan to replace her with an outsider threatened not only her career but her standing within the social hierarchy she has painstakingly navigated.",
    "motiveSeed": "Stands to lose her unofficial position and access to the family if a new heir gains control; victim planned to replace her with an outsider.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be attending to an emergency at the nearby village clinic during the time of the murder.",
    "accessPlausibility": "possible",
    "stakes": "Dr. Finch risks professional and social demotion if the estate changes hands. Her desire to maintain influence within the family circle fuels a simmering tension beneath her professional facade.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Her speech is precise and measured, often laced with dry, cutting remarks that reveal her sharp intellect. She employs clinical phrasing but occasionally betrays a sardonic edge when discussing the follies of those around her.",
    "internalConflict": "Dr. Finch wrestles with the conflict between her Hippocratic duty to do no harm and the personal grudges that color her view of the family’s power struggles. The fear of losing her place fuels a quiet bitterness that she struggles to contain.",
    "personalStakeInCase": "The murder threatens to upend the established order that has secured her privileged position. Maintaining her role within the family’s inner circle is as much a matter of survival as it is ambition.",
    "paragraphs": [
      "For years, Dr. Mallory Finch served as the steadfast physician to the Voss family, a role she embraced with professional pride and an eye for detail. Her calm demeanor and assured competence made her a trusted figure within the estate, and her medical opinions were rarely questioned.",
      "Yet beneath this veneer of devotion lay a simmering resentment. The family’s refusal to grant her partnership in their medical practice stung deeply, a slight she nursed in private. The victim’s recent plans to bring in an outsider threatened to sever her already tenuous hold on influence.",
      "On the night of the murder, Dr. Finch claimed to be attending an emergency at the village clinic, a plausible alibi that nonetheless raised questions given the timing. Her access to the manor was unquestioned, and her knowledge of the household’s routines gave her ample opportunity.",
      "Her humour, dry and often sardonic, surfaced in quiet moments—an ironic comment on the foibles of the family or a wry observation about human nature. It was a shield, and occasionally a weapon, in a world where social standing was precarious.",
      "Caught between her professional oath and personal ambitions, Dr. Finch’s inner turmoil deepened as the investigation unfolded. The potential loss of status gnawed at her, threatening to unravel the carefully constructed balance she maintained.",
      "In the end, her struggle was not merely for power but for recognition in a world that often overlooked the quiet strength behind the white coat."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired military officer and estate manager, Captain Ivor Hale is a man of discipline whose secret lineage and desperate ambitions drive him toward dangerous choices.",
    "publicPersona": "Captain Hale carries himself with the rigid authority of a soldier, commanding respect through his disciplined manner and unwavering control of the estate’s operations. His presence is imposing, and his word often carries the weight of command.",
    "privateSecret": "He is the illegitimate son of the family patriarch, a truth recently uncovered and threatening to disinherit him. Desperate to secure the recognition and wealth denied by birthright, he views the victim’s removal as his only path to inheritance.",
    "motiveSeed": "Stands to inherit the estate if the victim, who planned to cut him out, is removed; murder chosen over legal battle which he fears losing.",
    "motiveStrength": "compelling",
    "alibiWindow": "Was supposedly inspecting the stables, but no witnesses confirm his presence during the critical window.",
    "accessPlausibility": "easy",
    "stakes": "For Hale, the stakes are nothing less than social acceptance and financial security. His ambition to rise above his illegitimate status fuels a desperation that clouds his rigid exterior.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "His speech is clipped and formal, reflecting his military background, but he occasionally undercuts his sternness with self-deprecating remarks. He favors direct statements and rarely indulges in small talk, though his rare humor reveals a weary, human side.",
    "internalConflict": "Hale struggles with the tension between loyalty to the family that rejected him and the ambition that drives him to desperate acts. His rigid discipline clashes with the chaos of his concealed identity and the moral cost of his choices.",
    "personalStakeInCase": "The murder represents his chance to claim a place long denied. Failure means not only loss of wealth but the permanent denial of his legitimacy and social standing.",
    "paragraphs": [
      "Captain Ivor Hale’s military bearing and methodical management of Voss Manor earned him respect and authority, yet beneath the surface lay a man haunted by secrets. The recent discovery of his illegitimate birth threatened to unravel the fragile claim he had on the family’s goodwill.",
      "His role as estate manager gave him unfettered access to the property and its inhabitants, a position he wielded with the precision of a seasoned officer. Yet his ambitions extended beyond mere management; he sought recognition and inheritance that society denied him by birth.",
      "On the night of the murder, Hale claimed to be inspecting the stables, a routine task that lacked witnesses to corroborate his presence during the critical timeframe. This absence of an alibi cast a long shadow over his otherwise impeccable record.",
      "Though his exterior was stern and unyielding, Hale’s humour emerged in moments of self-deprecation, a subtle acknowledgment of the ironies that fate had dealt him. These glimpses of vulnerability hinted at the internal battle between duty and desire.",
      "His secrecy about his lineage and his fear of disinheritance drove him to contemplate drastic measures, viewing the victim’s removal as the only viable path to securing his future.",
      "Caught between the rigid discipline of his military past and the unpredictable demands of family intrigue, Hale’s journey is one of conflicted loyalties and desperate ambition, making him both a formidable suspect and a tragic figure."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Polished and ambitious, Beatrice Quill is the personal secretary to the victim whose secret embezzlement and fear of exposure place her at the heart of suspicion.",
    "publicPersona": "Beatrice is known for her efficiency and discretion, a polished professional who navigates the household’s complex social landscape with grace. Her ambition is masked behind a veneer of calm competence.",
    "privateSecret": "She has been embezzling funds from the estate and lives in constant fear that the victim’s discovery of her crimes will lead to disgrace and loss of position. The threat of exposure pushed her towards desperate considerations.",
    "motiveSeed": "Fears losing her lucrative position and facing disgrace if victim exposed her theft; considered bribery but felt murder was safer given the victim’s resolve.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be organizing documents in her quarters, but a servant saw her near the victim’s study shortly before the murder.",
    "accessPlausibility": "easy",
    "stakes": "Beatrice’s social standing and financial security depend on maintaining her role within the estate’s elite. Exposure would mean ruin, and she is willing to go to great lengths to protect herself.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice’s speech is polished and measured, often laced with subtle, cutting remarks disguised as polite conversation. She has a talent for veiled sarcasm and uses humour to manipulate and deflect, maintaining control in tense situations.",
    "internalConflict": "Her ambition clashes with guilt and fear, creating a tension between her calculated self-preservation and the moral cost of her actions. She battles the risk of exposure and the desire to rise socially, each feeding her anxiety.",
    "personalStakeInCase": "The crime is a direct threat to her livelihood and carefully constructed social position. Survival depends on keeping her secrets buried and navigating the investigation with cunning.",
    "paragraphs": [
      "Beatrice Quill’s role as personal secretary placed her at the nexus of the estate’s daily affairs, a position she exploited with quiet ambition. Her polished exterior concealed a web of deceit, woven through embezzlement that she hoped would remain undiscovered.",
      "Her efficiency and discretion earned her the victim’s trust, but that trust was a double-edged sword. The victim’s discovery of inconsistencies in the accounts put Beatrice in a perilous position, forcing her to consider drastic measures to protect herself.",
      "On the night of the murder, Beatrice claimed to be organizing documents in her quarters, a plausible alibi undermined by a servant’s observation of her near the victim’s study shortly before the fatal event. This contradiction cast suspicion in her direction.",
      "Her humour, sharp and polite, often veiled cutting barbs aimed at those she deemed obstacles. She wielded sarcasm like a blade, maintaining an outward calm while subtly destabilizing others through conversation.",
      "Internally, Beatrice wrestled with fear and ambition. The risk of exposure was a specter that haunted her every move, yet her desire to secure a place among the estate’s elite drove her to calculated risks.",
      "Her story is one of social climbing shadowed by desperation, where every measured word and gesture conceals a battle between self-preservation and the costs of deceit."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Voss Manor",
    "type": "Country house estate (Manor house)",
    "place": "Ashcombe Vale",
    "country": "England",
    "summary": "A sprawling and isolated English manor house set deep within the autumnal countryside of Ashcombe Vale, Voss Manor is a bastion of tradition and social hierarchy, its stately walls enclosing secrets beneath a veneer of genteel respectability.",
    "visualDescription": "The manor rises with stone façades weathered to soft grey, tall mullioned windows framed by creeping ivy, and steep slate roofs capped with ornate chimneys. Its formal gardens are geometrically trimmed, bordered by clipped yew hedges and gravel paths glistening with recent rain. Servants’ quarters and stables lie discreetly to the east, separated by a low stone wall and wrought iron gates. The main entrance is guarded by a gatehouse with lanterns flickering under overcast skies, beyond which gravel drives wind through ancient oaks and maples stained with autumn gold.",
    "atmosphere": "The estate’s isolation is palpable, the dense woodland and rolling moors hemming in the manor like a fortress. The air carries the scent of damp earth and fallen leaves, pierced occasionally by the sharp tang of woodsmoke from distant chimneys. Within its walls, a rigid social order prevails, underscored by the muted ticking of grandfather clocks and the quiet shuffle of servants’ footsteps on polished floorboards. The looming political unrest beyond the estate’s boundaries seeps in subtly, casting shadows over the genteel routines and whispered conversations in drawing rooms heavy with damask curtains.",
    "paragraphs": [
      "Voss Manor stands several miles from the nearest village of Ashcombe, nestled in a fold of the rolling English countryside where mist often clings to the tree line at dawn. The approach along the estate road is long and lined with towering chestnut trees whose leaves, turning amber and rust, carpet the gravel drives. The manor’s stone façade is softened by creeping ivy and the delicate tracery of leaded windows. Its architectural presence is both grand and forbidding, a testament to centuries of landed gentry heritage.",
      "Inside, the house is a labyrinth of high-ceilinged rooms adorned with dark oak paneling and heavy tapestries depicting pastoral scenes. The drawing room, with its deep armchairs and roaring stone fireplace, offers a refuge from the chill autumn air. Nearby, the library is lined with leather-bound volumes and illuminated by gas lamps whose flickering flames cast dancing shadows on the walls. The servants’ wing, connected by a narrow corridor, is a stark contrast—functional, with worn pine floors and the faint scent of soap and starch.",
      "The estate grounds are expansive, featuring formal gardens with clipped yews, gravel paths glistening after showers, and a small orchard where late apples hang heavy on the branches. The stables, to the east, are busy with the occasional clatter of hooves and low neighs, the scent of hay mingling with damp wood. Beyond the gardens, dense woods and heather-covered moorland stretch into the distance, creating natural barriers that isolate the manor from casual visitors and limit access after dusk.",
      "Social routines at Voss Manor are rigidly observed. Family members occupy private suites beyond the main hall, their comings and goings discreetly noted by attentive staff. Visitors must announce themselves at the gatehouse, where the estate’s steward keeps a meticulous log. The rotary dial telephone in the hall connects to a party-line shared with neighboring estates, necessitating whispered discretion. Radio broadcasts crackle intermittently, bringing news of the wider world into the insulated estate, while petrol touring cars wait silently in the coach house, ready for excursions into the nearby market town or the railway station several miles away."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast skies with intermittent rain typical of English countryside in autumn",
    "timeFlow": "Three days of mounting tension as the mystery unfolds amidst tightening social pressures and encroaching political unease",
    "mood": "Underlying tension due to economic uncertainty and social hierarchy pressures, compounded by the looming threat of political unrest in Europe",
    "eraMarkers": [
      "Domestic rotary dial telephones with party-line connections",
      "Radio broadcasts as primary home entertainment and news source",
      "Manual typewriters for correspondence and record keeping"
    ],
    "sensoryPalette": {
      "dominant": "Damp autumnal earth and woodsmoke",
      "secondary": [
        "Crackling hearth fires and ticking clocks",
        "Rustling leaves and distant horse hooves"
      ]
    },
    "paragraphs": [
      "The air at Voss Manor is thick with the scent of damp earth and fallen leaves, mingled with the faint smoke from wood-burning hearths. Overhead, leaden clouds press low, casting a muted grey light that dulls the manor’s stone walls and deepens shadows beneath ancient oaks. The steady drip of rain from eaves onto gravel paths punctuates the quiet, while distant sounds of hooves and the occasional bark of a dog break the stillness. Inside, the scent of beeswax polish and old leather pervades the panelled rooms, where the tick of grandfather clocks marks the slow passage of time.",
      "Within the manor’s walls, the atmosphere is one of constrained formality and simmering unease. The rigid social order is palpable in the measured footsteps of servants and the hushed tones of family members. The crackle of a fire in the drawing room contrasts with the faint static of a radio broadcast drifting through the hallways. Outside, the gardens glisten with rain, their clipped hedges and gravel paths slick and deserted. The natural isolation of the estate, combined with the weather’s damp chill, creates a sense of enclosure, as if the manor itself is holding its breath against an unseen threat."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Voss Manor Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A lofty wood-paneled room lined with tall bookcases filled with leather-bound volumes, a heavy oak desk cluttered with papers, and gas lamps casting a warm but flickering glow. Tall windows overlook the formal gardens, their panes streaked with rain. Persian rugs muffle footsteps on the polished floor.",
      "sensoryDetails": {
        "sights": [
          "flickering gas lamp flames",
          "rain-streaked leaded windows",
          "rows of leather-bound books",
          "dark oak desk clutter",
          "shadowed corners and shelves",
          "glossy Persian rugs"
        ],
        "sounds": [
          "crackling fire embers",
          "pages rustling softly",
          "distant ticking grandfather clock",
          "faint radio static hum",
          "soft footsteps on rug",
          "murmured voices beyond door"
        ],
        "smells": [
          "old leather bindings",
          "beeswax polish",
          "cold stone chimney",
          "woodsmoke and ash",
          "aged paper and dust",
          "faint pipe tobacco"
        ],
        "tactile": [
          "smooth polished desk surface",
          "rough book spines",
          "soft thick rug underfoot",
          "cool glass window pane",
          "warm glow from fire",
          "heavy velvet curtain folds"
        ]
      },
      "accessControl": "Access strictly limited to family members and senior staff during daylight hours; locked at night with key held by the steward; visitors require escort and invitation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "dim grey light filtered through curtains",
            "wet garden foliage glimpsed outside"
          ],
          "sounds": [
            "steady rain tapping glass",
            "soft crackle of dying fire",
            "distant thunder roll"
          ],
          "smells": [
            "damp stone",
            "cold ashes",
            "musty paper"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light",
            "shadows pooling in corners",
            "glint of brass lamp fittings"
          ],
          "sounds": [
            "clock ticking steadily",
            "pages turning quietly",
            "wood settling sounds"
          ],
          "smells": [
            "beeswax polish",
            "dust motes in air",
            "smoky hearth"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on wood",
            "glow from fireplace embers"
          ],
          "sounds": [
            "soft crackling fire",
            "distant voices from hall",
            "mantel clock ticking"
          ],
          "smells": [
            "warm beeswax",
            "pipe tobacco smoke",
            "cool fireplace ash"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library at Voss Manor is a sanctum of knowledge and secrets, its tall bookcases and heavy oak desk forming a stage for the unfolding mystery. The flickering gas lamps cast uneven light that sets shadows dancing along the richly paneled walls. Outside, rain patters relentlessly against the tall windows, blurring the view of the precisely trimmed gardens. The air is thick with the scent of aged leather and beeswax, mingling with the faintest trace of pipe smoke.",
        "Within this room, the tension is palpable—each creak of floorboards or rustle of pages seems amplified in the heavy silence. The fire’s glow offers warmth but also throws long shadows that seem to conceal more than they reveal. Access is tightly controlled, with only trusted family members and senior staff allowed entry during the day, and the door kept locked after dusk. It is here that crucial clues lie hidden beneath a veneer of genteel calm."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants’ Hall",
      "type": "interior",
      "purpose": "Gathering space for staff and informal information exchange",
      "visualDetails": "A modest, functional room with plain pine tables and benches, a large cast-iron stove dominating one corner. Walls are painted a utilitarian cream, hung with simple notices and schedules. A small window looks out onto the service yard, framed by coarse linen curtains.",
      "sensoryDetails": {
        "sights": [
          "plain pine tables and benches",
          "cast-iron stove glowing red",
          "coarse linen curtains",
          "chalked duty rosters on wall",
          "stacked wooden chairs",
          "mottled sunlight through window"
        ],
        "sounds": [
          "murmured conversations",
          "clinking of china cups",
          "soft footsteps on wooden floor",
          "stove crackling warmly",
          "distant clatter from kitchen",
          "rustle of linen aprons"
        ],
        "smells": [
          "strong black tea",
          "soapy water and starch",
          "smoke from stove",
          "fresh baked bread",
          "earthy dampness from yard",
          "clean cotton and linen"
        ],
        "tactile": [
          "rough wooden bench",
          "warm cast-iron stove surface",
          "coarse linen fabric",
          "smooth china cup rims",
          "solid pine tabletop",
          "cool draft from open door"
        ]
      },
      "accessControl": "Restricted to household staff only; no family members permitted except the steward; entry monitored by housekeeper.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through curtains",
            "steam rising from teacups",
            "wet boot prints on floor"
          ],
          "sounds": [
            "steady rain on roof",
            "soft chatter among staff",
            "stove hissing faintly"
          ],
          "smells": [
            "fresh bread baking",
            "strong tea aroma",
            "damp earth wafting in"
          ],
          "mood": "busy but subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light through window",
            "shadows under tables",
            "stacked chairs in corner"
          ],
          "sounds": [
            "quiet murmurs",
            "wood creaking softly",
            "distant clatter from kitchen"
          ],
          "smells": [
            "soapy water",
            "linen starch",
            "smoke from stove"
          ],
          "mood": "weary routine"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm stove glow",
            "long shadows stretching",
            "moonlight through window"
          ],
          "sounds": [
            "soft conversation",
            "stove crackling",
            "footsteps fading away"
          ],
          "smells": [
            "cool night air",
            "freshly laundered linen",
            "embers and ash"
          ],
          "mood": "quiet reflection"
        }
      ],
      "paragraphs": [
        "The servants’ hall is the heart of the household staff’s daily life, a plain and practical space where informal news and gossip circulate alongside the clink of china and the warmth of the cast-iron stove. Its pine tables and benches bear the marks of countless meals and whispered confidences. The small window, curtained in coarse linen, offers a glimpse of the service yard where boots and carts come and go under the persistent autumn rain.",
        "Though modest in appearance, the hall is a crucible of information and quiet alliances. Staff adhere to strict schedules displayed on chalkboards, yet the room pulses with the undercurrent of personal loyalties and tensions. Access is strictly limited to servants, with the housekeeper overseeing entry, ensuring that the social order is maintained and that the family’s secrets remain guarded behind closed doors."
      ]
    },
    {
      "id": "formal_gardens",
      "name": "Formal Gardens",
      "type": "exterior",
      "purpose": "Outdoor setting for gatherings, potential concealment, and clue discovery",
      "visualDetails": "Expansive terraces with clipped yew hedges forming geometric patterns, stone balustrades edging gravel paths, and beds of late-blooming chrysanthemums and asters. Garden benches and wrought iron seats are scattered beneath ancient oaks and maples shedding golden leaves.",
      "sensoryDetails": {
        "sights": [
          "glossy wet gravel paths",
          "clipped yew hedges",
          "fallen amber leaves",
          "stone balustrades slick with rain",
          "late autumn flowers",
          "iron garden seats"
        ],
        "sounds": [
          "dripping water from leaves",
          "rustling dry leaves",
          "distant crow caws",
          "soft footfalls on gravel",
          "whispering autumn breeze",
          "faint church bells"
        ],
        "smells": [
          "wet earth and leaf mold",
          "crisp autumn air",
          "faint scent of chrysanthemums",
          "damp stone",
          "smoke from distant chimneys",
          "freshly cut grass"
        ],
        "tactile": [
          "cold stone bench surface",
          "rough bark of oak trees",
          "crunch of dry leaves",
          "slick gravel underfoot",
          "chill breeze on skin",
          "damp moss on walls"
        ]
      },
      "accessControl": "Accessible to family and invited guests during daylight; locked gates after dusk restrict entry; estate staff patrol regularly.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-dappled leaves",
            "glossy wet stone surfaces",
            "grey sky reflected in puddles"
          ],
          "sounds": [
            "steady rain drip",
            "water trickling off leaves",
            "soft splash of footsteps"
          ],
          "smells": [
            "wet earth",
            "damp foliage",
            "fresh rain scent"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on hedges",
            "muted flower colors"
          ],
          "sounds": [
            "rustling leaves",
            "distant church clock",
            "bird calls muffled"
          ],
          "smells": [
            "damp soil",
            "faint woodsmoke",
            "crisp air"
          ],
          "mood": "quiet contemplation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "long shadows from trees",
            "moonlight glinting on stone",
            "glowing windows of manor"
          ],
          "sounds": [
            "soft rustle of leaves",
            "night insects chirping",
            "distant owl hoot"
          ],
          "smells": [
            "cool night air",
            "damp moss",
            "smoke from chimneys"
          ],
          "mood": "tense expectancy"
        }
      ],
      "paragraphs": [
        "The formal gardens of Voss Manor stretch out from the main house in carefully designed geometric patterns, their clipped yew hedges and gravel paths slick with autumn rain. Stone balustrades, darkened by moisture, outline terraces where chrysanthemums and asters bloom late into the season. Ancient oaks and maples stand sentinel, their branches shedding a carpet of golden leaves that crunch softly underfoot.",
        "These gardens serve as both a place of quiet reflection and a setting for social gatherings, though their expansive layout and secluded corners also offer opportunities for concealment and clandestine meetings. Access is tightly regulated; gates lock at dusk and estate staff patrol the grounds, preserving the boundary between the orderly world of the manor and the wild moorland beyond."
      ]
    },
    {
      "id": "gatehouse_entrance",
      "name": "Gatehouse Entrance",
      "type": "transitional",
      "purpose": "Controlled access point to estate; monitoring visitor arrivals and departures",
      "visualDetails": "A sturdy stone and timber structure flanking the main iron gates, with a small lantern hanging above the arched doorway. Gravel drive leads inward, bordered by trimmed hedges and sentinel oaks. A wooden bench and a log book rest on a small table inside, where the gatekeeper records all comings and goings.",
      "sensoryDetails": {
        "sights": [
          "iron estate gates",
          "glowing lantern light",
          "neatly trimmed hedges",
          "muddy gravel drive",
          "weathered wooden bench",
          "yellowed visitor log pages"
        ],
        "sounds": [
          "creaking iron hinges",
          "footsteps crunching gravel",
          "distant carriage wheels",
          "rustling leaves",
          "low murmur of voices",
          "gatekeeper’s pen scratching"
        ],
        "smells": [
          "wet wood and stone",
          "earthy dampness",
          "smoke from nearby hearth",
          "leather gloves",
          "horse sweat",
          "fresh autumn air"
        ],
        "tactile": [
          "cold iron gate bars",
          "rough stone walls",
          "smooth wooden table surface",
          "chilly autumn breeze",
          "worn leather gloves",
          "damp gravel underfoot"
        ]
      },
      "accessControl": "Strictly controlled; entry only by invitation or estate business; gatekeeper maintains visitor log; no unauthorised access permitted after dusk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-dappled gates",
            "grey sky overhead",
            "muddy gravel splashes"
          ],
          "sounds": [
            "steady rain on roof",
            "footsteps splashing puddles",
            "distant thunder"
          ],
          "smells": [
            "wet earth",
            "smoke from hearth",
            "damp leather"
          ],
          "mood": "watchful vigilance"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on gates",
            "shadows beneath eaves",
            "visitor log open"
          ],
          "sounds": [
            "pen scratching pages",
            "soft footsteps",
            "rustling leaves"
          ],
          "smells": [
            "stone and wood",
            "fresh autumn air",
            "smoke faintly rising"
          ],
          "mood": "guarded routine"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "lantern glow",
            "closed iron gates"
          ],
          "sounds": [
            "quiet night breeze",
            "occasional distant carriage",
            "gatekeeper’s low voice"
          ],
          "smells": [
            "cool night air",
            "smoke from hearth",
            "damp stone"
          ],
          "mood": "tense watchfulness"
        }
      ],
      "paragraphs": [
        "The gatehouse marks the threshold between the wider world and the secluded estate of Voss Manor. Its sturdy stone and timber construction stands firm against the persistent autumn rain and chill winds. A single lantern casts a warm glow over the iron gates, while inside, a small wooden table holds the visitor log where the gatekeeper diligently records every arrival and departure.",
        "This controlled entry point enforces the strict social order and security of the manor, allowing only invited guests or authorised personnel through its gates. After dusk, the gates are firmly closed, and the gatekeeper’s watchful presence is the last line of defence against intrusion. The gravel drive beyond winds through ancient oaks and trimmed hedges, leading inward to the heart of the estate."
      ]
    }
  ],
  "note": "",
  "cost": 0.006879715,
  "durationMs": 66944
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1938,
    "month": "September",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "September",
    "weather": [
      "overcast skies with low, heavy clouds",
      "intermittent light to moderate rain showers typical of the English countryside",
      "cool, damp mornings with occasional fog in low-lying areas"
    ],
    "daylight": "daylight hours shortening, with sunset around 7:30 pm, twilight lingering until 8 pm",
    "time_of_day_of_crime": "late evening — between nine and eleven at night, after the manor's dinner service",
    "holidays": [
      "Harvest Festival (local church and village celebrations)",
      "Michaelmas (September 29th, traditional quarter day)"
    ],
    "seasonalActivities": [
      "harvesting and gathering crops such as apples and hops on the estate grounds",
      "preparing for autumn hunts and shooting parties",
      "attending village fairs and church bazaars marking the end of summer"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece wool tweed suits in earth tones",
        "double-breasted blazers with wide lapels",
        "stiff collared shirts with silk ties featuring geometric patterns"
      ],
      "casual": [
        "knitted argyle vests worn over dress shirts",
        "plus-fours or flannel trousers with suspenders",
        "soft felt hats such as homburgs or trilbies"
      ],
      "accessories": [
        "leather Oxford shoes polished to a high shine",
        "pocket watches with chain fobs",
        "silk pocket squares and leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "bias-cut silk evening dresses with modest necklines and capped sleeves",
        "tailored wool coat dresses with padded shoulders",
        "matching cloche hats decorated with feathers or veiling"
      ],
      "casual": [
        "cotton shirtwaist blouses paired with mid-calf pleated skirts",
        "knitted twinsets in muted autumn colors",
        "sturdy leather brogues or low-heeled pumps"
      ],
      "accessories": [
        "beaded handbags with metal frames",
        "silk scarves worn at the neck or tied in hair",
        "long gloves of kid leather or fine wool"
      ]
    },
    "trendsOfTheMoment": [
      "emphasis on structured tailoring with defined shoulders",
      "popularization of earth tones and muted color palettes reflecting autumn moods",
      "accessorizing with delicate jewelry such as brooches and simple pearl earrings"
    ],
    "socialExpectations": [
      "men expected to wear hats and gloves when outdoors or visiting",
      "women to maintain modesty with covered arms and hemlines below the knee in public",
      "strict etiquette governing dress codes for different times of day and social occasions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Munich Agreement negotiations underway, causing anxiety about the threat of war",
      "British government debates rearmament amidst pacifist public opinion",
      "Economic uncertainty persists with unemployment still elevated despite some recovery"
    ],
    "politicalClimate": "Mounting tension across Europe with appeasement policies dominating UK politics; domestic unease about potential conflict and national security",
    "economicConditions": "Lingering effects of the Great Depression with cautious consumer spending; rural estates facing pressures to modernize or scale down operations",
    "socialIssues": [
      "class tensions exacerbated by economic disparities on country estates",
      "debates on women’s evolving roles beyond domestic spheres",
      "concerns about immigration and national identity amid rising international unrest"
    ],
    "internationalNews": [
      "Hitler’s annexation of the Sudetenland looming as a critical flashpoint",
      "Spanish Civil War continues, drawing international attention and volunteers"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby – 'Thanks for the Memory'",
        "Glenn Miller – 'Pennsylvania 6-5000'",
        "Duke Ellington – 'Mood Indigo'"
      ],
      "films": [
        "The Adventures of Robin Hood starring Errol Flynn",
        "Bringing Up Baby with Katharine Hepburn and Cary Grant",
        "You Can't Take It With You, a popular screwball comedy"
      ],
      "theater": [
        "Noël Coward's plays running in London’s West End",
        "Agatha Christie's 'Appointment with Death' debuting on stage",
        "Musical revues featuring popular dance and comedy acts"
      ],
      "radio": [
        "BBC Home Service broadcasting news and serialized dramas",
        "Variety shows featuring music hall entertainers",
        "Mystery and detective serials gaining popularity among listeners"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s 'And Then There Were None' (published earlier in 1938)",
        "Graham Greene’s 'Brighton Rock' serialized in literary magazines",
        "Daphne du Maurier’s 'Rebecca' gaining critical acclaim"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "historical romance",
        "social realism addressing contemporary class struggles"
      ]
    },
    "technology": {
      "recentInventions": [
        "improvements in radio receiver design for clearer broadcasts",
        "introduction of more efficient domestic electric appliances such as vacuum cleaners",
        "advances in ballistics analysis used by police for firearm identification"
      ],
      "commonDevices": [
        "rotary dial telephones connected via party lines",
        "manual typewriters for correspondence and record keeping",
        "wind-up wristwatches and mechanical clocks"
      ],
      "emergingTrends": [
        "increased reliance on radio as the primary source of news and entertainment",
        "early adoption of home refrigerators replacing iceboxes",
        "growing interest in motor cars among upper-middle classes"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of white bread: 4 pence",
        "Pint of milk: 1.5 pence",
        "Taxi ride across town: 2 shillings"
      ],
      "commonActivities": [
        "afternoon tea rituals in the drawing room",
        "weekly market visits for fresh produce and goods",
        "church attendance on Sundays and community gatherings"
      ],
      "socialRituals": [
        "formal dinners following strict seating and serving protocols",
        "Sunday afternoon walks on the estate grounds for socializing and exercise"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "landed gentry maintain strict social distance from domestic staff and local workers",
      "growing awareness and subtle resentment of class disparities amid economic hardship"
    ],
    "gender": [
      "women expected to embody decorum and domestic skills, though more pursue education and employment",
      "men bear responsibility as heads of households and community figures",
      "emerging feminist discussions met with cautious conservatism in rural areas"
    ],
    "race": [
      "prevailing British imperial attitudes with limited awareness of multiculturalism",
      "social segregation and exclusion of non-white individuals common in rural England"
    ],
    "generalNorms": [
      "emphasis on politeness, discretion, and maintaining appearances",
      "strict adherence to social etiquette in public and private spheres",
      "gossip and reputation carry significant weight within country house society"
    ]
  },
  "atmosphericDetails": [
    "damp earth and fallen leaves scent the manor’s extensive gardens and woodland edges",
    "soft pattering of rain on leaded glass windows punctuates quiet evenings by the fireplace",
    "the ticking of a large grandfather clock and the distant hoot of an owl underscore the estate’s stillness",
    "the murmur of a distant radio broadcast blends with the crackling of the coal fire in the drawing room",
    "the rustle of silk gowns and the scrape of polished leather shoes echo through the high-ceilinged corridors"
  ],
  "paragraphs": [
    "September 1938 in the English countryside carries a weight of uneasy anticipation beneath its autumnal veneer. The manor house estate, surrounded by dense groves and rolling fields, is cloaked in a persistent overcast sky, the air heavy with moisture from frequent, intermittent rains. Daylight wanes earlier each evening, with a chill creeping into the damp air that urges residents indoors to the warmth of roaring fires. Outside, laborers harvest the last fruits of summer, gathering apples and preparing fields for the coming winter, while within the manor, the rigid social order continues to govern daily life with meticulous formality.",
    "Fashion in this moment reflects the sober mood of the times: men don tailored tweed suits with broad shoulders and neatly knotted ties, while women favor bias-cut silk dresses that balance elegance with a modest, structured silhouette. Accessories like felt homburg hats and silk scarves complete their ensembles, reinforcing social roles and expectations. The cultural atmosphere is alive with the sounds of Bing Crosby’s latest hits on the radio and the excitement of recent West End theatrical premieres. Yet beneath the surface, the political tensions of the Munich crisis and the threat of war cast long shadows over the genteel routines of country living.",
    "Daily life unfolds within a framework of strict etiquette and social rituals. Formal dinners proceed with exacting precision, servants attending with quiet efficiency while guests exchange measured conversation and veiled observations. The manor’s rotary telephone, linked by party line, occasionally breaks the silence to summon urgent messages from London or local authorities. Amidst this, the community grapples with the lingering economic uncertainties of the Depression era, subtly shifting class dynamics, and the pervasive anxiety about a world edging toward conflict. The scent of damp leaves and coal fires, the ticking of clocks, and the murmur of distant radio broadcasts combine to create an atmosphere both intimate and fraught with latent tension."
  ],
  "note": "",
  "cost": 0.00334407,
  "durationMs": 34623
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "The rigid social hierarchy and economic strain on the isolated Voss estate force the landed gentry, their trusted staff, and local affiliates into tense coexistence under strict protocols, where every interaction is shadowed by financial uncertainty and the looming unrest beyond the manor walls.",
  "era": {
    "decade": "1930s",
    "socialStructure": "A strict class system divides the landed gentry, estate staff, and local workers, all bound by formal etiquette and daily routines, while the Great Depression intensifies underlying class tensions and economic anxieties within the estate."
  },
  "setting": {
    "location": "A large, isolated English country manor house surrounded by formal gardens, stables, and servant quarters",
    "institution": "Country house estate (Manor house)",
    "weather": "Overcast skies with intermittent autumn rain typical of the English countryside"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "A classic Golden Age country-house mystery where mechanical clock tampering reveals hidden motives and secrets, set against a backdrop of social rigidity and economic tension that shapes every interaction and suspicion within the estate."
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
  },
  {
    "id": "chime_count",
    "value": "thirteen",
    "description": "The number of chimes heard at midnight, an impossible count"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "physical",
      "description": "The grandfather clock’s pendulum suspension spring shows a slight deformation and oily residue inconsistent with normal wear.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Indicates physical tampering with the clock’s pendulum mechanism.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock was physically tampered with, altering its pendulum swing and causing the clock to run slower than real time by forty minutes.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Overturns the assumption that the clock’s stopped time marks the true time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "Servants report hearing thirteen chimes at midnight, an impossible occurrence for the manor clock which normally chimes twelve times.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Suggests the clock’s chimes were manipulated, indicating tampering.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The clock’s chimes are inconsistent with normal operation, confirming tampering and unreliable timekeeping.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Contradicts the assumption that the clock’s chimes mark correct time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "A watch found on the victim’s desk stopped at twenty past midnight, conflicting with the grandfather clock’s stopped time of ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Indicates the victim’s time of death was later than the clock’s stopped time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The victim’s personal watch indicates a later time of death than the manor clock, supporting the corrected timeline over the clock’s stopped time.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Contradicts the false assumption that the clock’s stopped time is accurate.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Stable hands report seeing an unusual visitor near the stables after the supposed time of death based on the clock’s stopped time.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "Suggests unauthorized presence inconsistent with the false timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "An unauthorized presence at the manor grounds at the true time of death contradicts Captain Ivor Hale’s claimed timeline.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Contradicts Captain Ivor Hale’s alibi and timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_9",
      "category": "physical",
      "description": "Dinner plates found in the kitchen show no signs of having been used during the assumed time of death, indicating the evening meal time was earlier than supposed.",
      "sourceInCML": "CASE.inference_path.steps[4].observation",
      "pointsTo": "Supports a later corrected timeline of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 5,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "temporal",
      "description": "The assumed time for the evening meal is incorrect, supporting the corrected later timeline of death rather than the false earlier timeline.",
      "sourceInCML": "CASE.inference_path.steps[4].correction",
      "pointsTo": "Contradicts the false assumption about the timeline based on meal timing.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 5,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "physical",
      "description": "The murderer physically tampered with the grandfather clock’s pendulum suspension spring, applying a slight deformation and an oily lubricant residue.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "Surfaces the core tampering mechanism before the discriminating test.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock was physically tampered with, altering its pendulum swing and causing the clock to run slower than real time, invalidating the clock’s stopped time as the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "Explicitly overturns the false assumption that the clock’s stopped time marks the victim’s time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because stable hand testimony and clock chiming inconsistencies corroborate his absence from the manor grounds at the true time of death, narrowing suspicion toward Dr. Mallory Finch.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Excludes Captain Ivor Hale based on corroborated alibi and evidence, focusing suspicion on Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_11",
      "category": "physical",
      "description": "A controlled comparison of the manor clock’s pendulum suspension spring with a reference spring under identical conditions reveals the manor clock’s spring has been altered.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Provides concrete physical evidence of tampering before the discriminating test.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "behavioral",
      "description": "A blackmail threat from the victim’s estate manager to Dr. Mallory Finch is found, showing premeditation and motive.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[2]",
      "pointsTo": "Shows Dr. Mallory Finch’s motive and planning before confrontation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_13",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because kitchen utensil logs and servants’ testimony confirm her absence from the manor during the corrected time of death.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Excludes Beatrice Quill based on corroborated alibi and evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 5,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_14",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because stable hand testimony and clock chiming inconsistencies corroborate his absence, narrowing the solution toward Dr. Mallory Finch.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Explicitly excludes Captain Ivor Hale and focuses suspicion on Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_15",
      "category": "physical",
      "description": "Dr. Mallory Finch’s unique trace of oily lubricant on the pendulum suspension spring matches a preparation detail known only to him, linking him to the tampering.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[1]",
      "pointsTo": "Directly links Dr. Mallory Finch to the tampering mechanism.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
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
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock stopped at ten minutes past eleven remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 5,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The grandfather grandfather’s stopped time at ten minutes past eleven is supported by the butler’s log noting the grandfather stopped at that exact time with no disturbances.",
      "supportsAssumption": "The grandfather clock’s stopped time accurately marks the victim’s time of death at ten minutes past eleven.",
      "misdirection": "This misleads by relying on official logs without considering physical stopped and ignores the oily residue and deformation which reveal the true mechanism."
    },
    {
      "id": "rh_2",
      "description": "Servants recall the grandfather accurately’s stopped time at ten minutes past eleven as the last time they saw the accurately functioning normally before the murder.",
      "supportsAssumption": "The grandfather clock’s stopped time accurately marks the victim’s time of death at ten minutes past eleven.",
      "misdirection": "This misleads by emphasizing witness memory over physical evidence, ignoring the impossible thirteen marks and the victim’s minutes stopped eleven."
    }
  ],
  "status": "pass",
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
      "clue_mechanism_visibility_core"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
      "clue_11",
      "clue_12",
      "clue_13",
      "clue_14",
      "clue_15",
      "clue_culprit_direct_dr_mallory_finch"
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
  "latencyMs": 44676,
  "cost": 0.00530722
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
