# Actual Prompt Record

- Run ID: `mystery-1784139037942`
- Project ID: ``
- Timestamp: `2026-07-15T18:17:56.988Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `d571adfe26952ea8`

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
    "title": "The Mirror's Deception",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A grand, somewhat worn seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "seaside hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "optical manipulation"
    }
  },
  "death_method": "shot",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp-minded investigator known for her keen observations",
      "private_secret": "Struggles with the trauma of her wartime experiences",
      "motive_seed": "Curiosity about the truth behind the murder",
      "motive_strength": "strong",
      "alibi_window": "Evening of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Investigating the hotel scene"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Analytical demeanor"
      ],
      "stakes": "Solving the case to redeem her reputation",
      "evidence_sensitivity": [
        "Sensitive to optical clues"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Witness",
      "relationships": [],
      "public_persona": "A respected physician",
      "private_secret": "Had a secret relationship with the victim",
      "motive_seed": "Protecting her reputation",
      "motive_strength": "moderate",
      "alibi_window": "Witnessed the incident",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Present at the scene"
      ],
      "behavioral_tells": [
        "Nervous when discussing the victim"
      ],
      "stakes": "Avoiding scandal",
      "evidence_sensitivity": [
        "Witness testimony"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A war hero with a mysterious past",
      "private_secret": "Knew too much about the hotel's dark dealings",
      "motive_seed": "None; he is the victim",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "unknown",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A charming socialite",
      "private_secret": "In debt and desperate",
      "motive_seed": "Financial gain",
      "motive_strength": "moderate",
      "alibi_window": "Around the time of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Seen near the scene"
      ],
      "behavioral_tells": [
        "Overly eager to help"
      ],
      "stakes": "Avoiding exposure of her debts",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "The hotel manager",
      "private_secret": "Hiding a financial scandal",
      "motive_seed": "Protecting her business",
      "motive_strength": "strong",
      "alibi_window": "Claims to be in her office",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Has keys to all areas"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Keeping her business afloat",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A wealthy traveler",
      "private_secret": "Obsessed with Captain Hale's past",
      "motive_seed": "Personal vendetta",
      "motive_strength": "strong",
      "alibi_window": "Claims to have been at dinner",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Seen arguing with the victim"
      ],
      "behavioral_tells": [
        "Restless and agitated"
      ],
      "stakes": "Revenge",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Beatrice Quill"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In a grand seaside hotel, Captain Ivor Hale is found shot dead amidst a gathering of guests. As Eleanor Voss investigates, she uncovers a web of deceit where reflections and misdirections obscure the truth."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A carefully placed mirror and lens create a false reflection, leading witnesses to misinterpret the direction of the culprit's movement.",
      "delivery_path": [
        {
          "step": "The mirror is angled to reflect the entrance, misleading the witness."
        },
        {
          "step": "The lens distorts the view, making it appear as if the culprit entered from the wrong direction."
        }
      ]
    },
    "outcome": {
      "result": "Witnesses misidentify the culprit's entry point, implicating an innocent party."
    }
  },
  "false_assumption": {
    "statement": "Witnesses believe they saw the culprit enter through the main entrance.",
    "type": "spatial",
    "why_it_seems_reasonable": "The mirror's angle makes the entrance appear as the true entry point.",
    "what_it_hides": "The actual route taken by the real culprit."
  },
  "false_solution": {
    "accused_suspect": "Sylvia Trent",
    "supporting_points": [
      "She had access to all areas of the hotel.",
      "Witnesses claim she was seen near the victim just before the murder."
    ],
    "the_one_flaw": "Her alibi is confirmed by multiple guests who saw her in the dining room during the time of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A gun found in Beatrice Quill's possession.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The gun belonged to her late father, a war veteran, and was not functional.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Witnesses report a loud argument between Captain Hale and Hugo Vane.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The argument was about a trivial matter and occurred long before the murder.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the time of the murder, and there are no outsiders involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [],
      "windows": [],
      "contradictions": []
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Beatrice Quill",
        "Sylvia Trent",
        "Hugo Vane"
      ],
      "objects": [
        "the mirror",
        "the lens",
        "the gun"
      ],
      "permissions": [
        "Eleanor Voss has the right to investigate all areas",
        "Sylvia Trent has keys to all rooms"
      ]
    },
    "physical": {
      "laws": [
        "Optics laws regarding reflection and distortion"
      ],
      "traces": [
        "Scratches on the floor near the mirror"
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses trust Dr. Mallory Finch's testimony"
      ],
      "authority_sources": [
        "Sylvia Trent's position as hotel manager"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The mirror in the dining area shows fresh adjustment marks.",
        "correction": "The fresh marks indicate it was recently altered to mislead the view.",
        "effect": "Narrows suspect pool to those with access to the dining area.",
        "required_evidence": [
          "Mirror shows fresh adjustment marks",
          "Witness accounts mention seeing reflections"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses describe seeing the culprit enter from the main entrance.",
        "correction": "This contradicts the layout of the room as confirmed by the mirror's position.",
        "effect": "Eliminates the main entrance as the entry point for the real culprit.",
        "required_evidence": [
          "Witness account of the entrance",
          "Layout of the dining area"
        ],
        "reader_observable": true
      },
      {
        "observation": "Scratches on the floor lead away from the mirror towards the service entrance.",
        "correction": "The scratches indicate the culprit moved towards the service entrance, not the main entrance.",
        "effect": "Narrows down the suspect who could access the service entrance.",
        "required_evidence": [
          "Scratches on the floor",
          "Witness accounts of people near the service entrance"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Reenacting the scene with the mirror adjusted to its original position to reveal the true sightline.",
    "knowledge_revealed": "Witnesses will see that their perceptions were altered by the mirror.",
    "pass_condition": "If the witness descriptions change based on the original mirror position, it confirms their earlier misinterpretation.",
    "evidence_clues": [
      "clue_3",
      "clue_4",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The mirror's adjustment marks (early) and witness descriptions (mid) let the reader understand the misleading view. Step 2: The scratched floor pattern (mid) indicates true movement direction. Step 3: The reenactment (discriminating test) confirms the misinterpretation of entry."
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
        "Observe the witnesses' reactions",
        "Draw conclusion about the misinterpretation"
      ],
      "test_type": "spatial"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi by multiple guests",
        "supporting_clues": [
          "red_herring_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm she was in the dining room during the murder.",
        "supporting_clues": [
          "false_solution"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Argument was trivial and occurred before the murder.",
        "supporting_clues": [
          "red_herring_1"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence from the reenactment."
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
        "clue_id": "clue_10",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_9",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_13",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
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
    "summary": "Eleanor Voss is a charming tea shop owner whose warm hospitality masks her dire financial troubles.",
    "publicPersona": "Eleanor is the heart of the hotel, known for her delightful teas and the welcoming atmosphere of her shop, where locals and travelers alike gather. Her smile is genuine, but her eyes betray a flicker of worry, hinting at the burdens she carries beneath her charming façade.",
    "privateSecret": "Beneath her warm exterior, Eleanor grapples with crippling debt from a loan shark, threatening not just her business but her very livelihood. The pressure weighs heavily on her, pushing her to the brink of desperation.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "Eleanor was present throughout the evening, serving guests and maintaining her usual routine.",
    "accessPlausibility": "Eleanor has easy access to all areas of the hotel, often seen flitting from the kitchen to the dining hall and back.",
    "stakes": "Her business reputation and financial future hinge on her ability to solve the mystery, as failure could lead to her losing everything she has built.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a warm, inviting tone, often punctuating her sentences with light-hearted observations. She has a tendency to engage in playful banter, using her wit to ease the tension of the moment.",
    "signatureTic": "‘Well, isn’t that just the tea kettle calling the pot black?’",
    "internalConflict": "Eleanor is torn between her need for financial stability and her desire to uphold her integrity, fearing that her secrets may lead to ruin.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as it could save her business and protect her from the looming threat of her shady investor.",
    "paragraphs": [
      "Eleanor Voss stood in the bustling kitchen of her tea shop, the air thick with the fragrant aroma of freshly brewed tea and baked goods. Her hands moved deftly as she prepared for the evening rush, a practiced smile plastered across her face. Yet behind those warm hazel eyes lay a tempest of anxiety. A loan shark’s looming shadow haunted her every thought, threatening to upend the life she had painstakingly built.",
      "As she served a group of patrons, her mind raced. She was well aware that the murder of Captain Ivor Hale could unravel the delicate tapestry of her existence. The hotel was not just a place of work; it was her sanctuary. Each cup of tea she poured was a reminder of the community she cherished. But with her business teetering on the edge, Eleanor felt compelled to take on the role of investigator, despite the risks involved.",
      "Eleanor’s charm was her armor, and she wielded it with precision. In her interactions with guests and staff, she employed dry wit to defuse tension and foster camaraderie. ‘Well, isn’t that just the tea kettle calling the pot black?’ she quipped, drawing laughter even in the face of adversity. Yet, as she navigated the complex social dynamics of her wealthy patrons, she found herself questioning how long she could maintain the façade without revealing her vulnerabilities.",
      "As the investigation unfolded, Eleanor realized that the stakes had never been higher. She was not just fighting for her business; she was fighting for her identity. The notion of losing everything was a specter that haunted her dreams. With each clue uncovered, she felt the weight of her choices pressing down on her, forcing her to confront the truth of her situation. In the end, Eleanor understood that the only path to redemption lay in unraveling the mystery that threatened to consume her."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose hidden past threatens to unravel her career.",
    "publicPersona": "With a reputation for her dedication to helping veterans recover from their injuries, Dr. Mallory Finch is a pillar of the community, often lauded for her compassion and skill. However, beneath her professional veneer lies a tumultuous personal history that could jeopardize everything she has worked for.",
    "privateSecret": "Mallory had a brief romantic fling with the victim, Captain Ivor Hale, a fact she is desperate to keep hidden from her colleagues and the community, fearing the scandal would destroy her career.",
    "motiveSeed": "The fear of exposure looms large, as Mallory is acutely aware that Ivor's death could lead to whispers about their past relationship, potentially tarnishing her hard-earned reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "Mallory left the dining area at 8:45 and returned at 9:15, a window that raises suspicions about her whereabouts during the time of the murder.",
    "accessPlausibility": "Given her position as a physician, Mallory has plausible access to various areas of the hotel, particularly in emergencies.",
    "stakes": "Her professional reputation and future in the community are at stake, as any hint of scandal could lead to the end of her career.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with an air of authority, often using medical jargon that she occasionally punctuates with sardonic remarks. Her delivery is precise, reflecting her scientific background, yet she allows herself moments of dry humor when the tension rises.",
    "signatureTic": "‘One must always consider the prognosis, even in matters of the heart.’",
    "internalConflict": "Dr. Finch is caught in a web of guilt and fear, as the echoes of her past relationship with Ivor haunt her, forcing her to grapple with the consequences of her actions.",
    "personalStakeInCase": "The murder investigation is not just a professional duty for Mallory; it is a personal reckoning that could determine her future in the community she has fought so hard to serve.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the edge of the dining area, her gaze fixed on the empty seat that had once been occupied by Captain Ivor Hale. The warmth of her professional persona masked the turmoil brewing beneath the surface. She was respected, admired even, yet the specter of their past loomed over her like a dark cloud, threatening to engulf her in scandal. The thought of exposure sent a shiver down her spine.",
      "As she moved through the hotel, Mallory’s mind raced with the implications of Ivor's death. ‘One must always consider the prognosis, even in matters of the heart,’ she mused dryly, her sardonic humor a shield against the mounting pressure. The loss of Ivor was not just a personal tragedy; it was a potential catastrophe for her career. The whispers of their past relationship could spiral into a full-blown scandal, tarnishing her reputation and undoing years of hard work.",
      "Her alibi was precarious, a mere thirty minutes that could easily be scrutinized. Mallory had left the dining area at 8:45, her mind preoccupied with thoughts of Ivor and the secrets they shared. The return at 9:15 felt like an eternity, each moment stretching into doubt. What if someone had seen them? What if someone had overheard their hushed conversations? The weight of her choices pressed down upon her, a reminder of the fragility of her carefully constructed life.",
      "As the investigation unfolded, Mallory found herself at a crossroads. The truth of her past and the reality of her present collided in a chaotic dance, forcing her to confront the consequences of her decisions. Would she allow fear to dictate her actions, or would she take control of her narrative? In the end, Mallory understood that the only way to reclaim her future was to confront the shadows of her past."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, is a war hero whose unrequited love for Eleanor Voss complicates his life.",
    "publicPersona": "Known for his gruff exterior and no-nonsense attitude, Captain Ivor Hale is a revered figure, a war hero whose bravery is celebrated. Yet, behind the façade lies a man wrestling with deep-seated emotions, particularly his feelings for Eleanor Voss, the tea shop owner.",
    "privateSecret": "Ivor harbors a secret love for Eleanor, feeling betrayed by her growing friendship with the victim, which fuels his jealousy and resentment.",
    "motiveSeed": "Ivor believes that the victim's presence and influence threaten his chances with Eleanor, igniting a fierce jealousy that clouds his judgment.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor was in the bar from 8:30 until 9:00, a time frame that places him close to the scene of the crime.",
    "accessPlausibility": "As a retired naval officer, Ivor has easy access to various areas of the hotel, particularly the bar where he often spends his time.",
    "stakes": "His chance at love and redemption after the war hangs in the balance, as the murder investigation could expose his feelings and lead to dire consequences.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks plainly and directly, with little embellishment. He often uses simple, unadorned language, favoring short, clipped sentences that reflect his no-nonsense approach to life.",
    "signatureTic": "‘Straight to the point, that’s how I like it.’",
    "internalConflict": "Ivor grapples with a tumultuous mix of jealousy and regret, torn between his feelings for Eleanor and the bitterness he feels towards the victim.",
    "personalStakeInCase": "The investigation is deeply personal for Ivor, as it could determine not only his future with Eleanor but also force him to confront his feelings and vulnerabilities.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, the amber liquid in his glass reflecting the dim light of the hotel. His gruff demeanor often deterred idle chatter, but his mind was a tempest of emotions, particularly regarding Eleanor Voss. ‘Straight to the point, that’s how I like it,’ he often told those who dared to engage him in conversation. Yet, his heart was less straightforward, tangled in unrequited love and jealousy.",
      "The news of Ivor's friend’s murder sent shockwaves through the hotel, forcing him to confront the reality of his feelings for Eleanor. Her growing friendship with the victim gnawed at him, a bitter reminder of what he could never have. The thought of losing her to another man was unbearable, igniting a fierce jealousy that threatened to consume him. Ivor felt trapped in a war of emotions, one he had fought valiantly against for far too long.",
      "His alibi was solid, or so he thought. He had been in the bar from 8:30 until 9:00, a timeframe that placed him dangerously close to the murder. The weight of suspicion hung heavy in the air, and Ivor found himself questioning whether his feelings for Eleanor could lead him down a dark path. Would he be seen as a man of honor or as a jealous fool? The uncertainty gnawed at him, and he knew he would have to confront the truth of his emotions if he hoped to clear his name.",
      "As the investigation unfolded, Ivor realized that the stakes were higher than he had anticipated. This was not just about solving a murder; it was about his chance at love and redemption after the war. The shadows of his past lingered, and he was forced to confront the possibility that his jealousy might have dire consequences. In the end, Ivor understood that he had to choose between letting his feelings for Eleanor guide him or allowing bitterness to cloud his judgment."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious socialite whose ruthless pursuit of status often leads her to sabotage others.",
    "publicPersona": "An ambitious socialite with an eye for high society, Beatrice Quill is known for her charm and elegance. She moves through the hotel like a queen surveying her court, always seeking opportunities to elevate her status among the elite.",
    "privateSecret": "Beneath her polished exterior, Beatrice has been secretly sabotaging Eleanor's business to curry favor with wealthier patrons, a dangerous game that could backfire spectacularly.",
    "motiveSeed": "Her desire to eliminate competition stems from a relentless ambition to secure a prominent position in society, one that she believes is rightfully hers.",
    "motiveStrength": "strong",
    "alibiWindow": "Beatrice was seen in the lobby at 9:10, a time that raises questions about her whereabouts during the murder.",
    "accessPlausibility": "As a socialite, Beatrice has plausible access to various areas of the hotel, often mingling with guests and patrons alike.",
    "stakes": "Her social ambitions depend on her ability to outmaneuver others, and the murder investigation could expose her underhanded tactics.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an air of sophistication, often using elaborate language and subtle barbs hidden within compliments. She has a penchant for dramatic pauses and theatrical gestures, making her presence impossible to ignore.",
    "signatureTic": "‘One must do what one must for the sake of progress.’",
    "internalConflict": "Beatrice is torn between her ambition and the consequences of her actions, grappling with the realization that her ruthless tactics may lead to her downfall.",
    "personalStakeInCase": "The murder investigation presents a personal stake for Beatrice, as her ambitions could be thwarted if her underhanded dealings are uncovered.",
    "paragraphs": [
      "Beatrice Quill glided through the hotel lobby, her elegant attire perfectly tailored to reflect her status as a socialite. With a smile that could charm the most discerning of patrons, she exuded confidence and grace. Yet, beneath the surface, a tempest of ambition churned. ‘One must do what one must for the sake of progress,’ she often mused, justifying the lengths she would go to in order to secure her place among the elite.",
      "Her rivalry with Eleanor Voss had reached a boiling point, and Beatrice had resorted to sabotaging her tea shop in a desperate bid to eliminate competition. The thrill of outmaneuvering others fueled her ambition, but as the murder investigation unfolded, Beatrice found herself grappling with the consequences of her actions. The stakes had never been higher, and the potential fallout could unravel everything she had worked to achieve.",
      "At 9:10, Beatrice had been seen in the lobby, a seemingly innocuous detail that now cast suspicion on her whereabouts during the murder. She was all too aware that her alibi was thin, and the whispers of her underhanded tactics could resurface at any moment. The delicate balance of her carefully curated life teetered on the edge, and Beatrice was determined to maintain her façade at all costs.",
      "As the investigation progressed, Beatrice’s internal conflict intensified. She was forced to confront the reality that her ambition could lead to her downfall. Would she continue to play the game, risking everything for the sake of status, or would she reconsider her tactics and seek a more honorable path? In the end, Beatrice understood that the pursuit of power could come at a steep price, one she might not be willing to pay."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is an investigative journalist whose relentless pursuit of the truth often puts her career at risk.",
    "publicPersona": "Known for her sharp articles and strong opinions, Sylvia Trent is a formidable journalist who does not shy away from controversy. Her reputation for uncovering scandals has made her both respected and feared in the industry.",
    "privateSecret": "Sylvia had been investigating the victim for a potential scandal that could ruin her career, a dangerous endeavor that now places her in the crosshairs of suspicion.",
    "motiveSeed": "Fearing that the victim will ruin her reputation before she can publish her explosive story, Sylvia is desperate to protect her credibility.",
    "motiveStrength": "moderate",
    "alibiWindow": "Sylvia was interviewing a guest from 8:50 to 9:20, a window that raises doubts about her involvement in the murder.",
    "accessPlausibility": "Her role as a journalist gives Sylvia plausible access to various areas of the hotel, particularly when pursuing leads.",
    "stakes": "Her career and credibility as a journalist are at stake, and the investigation could determine the future of her professional life.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks in a direct and assertive manner, often peppering her statements with sharp observations about the people and situations around her. Her language is concise, reflecting her journalistic background, yet she allows for moments of dry humor.",
    "signatureTic": "‘The truth is rarely as simple as it seems.’",
    "internalConflict": "Sylvia is torn between her principles as a journalist and the ambition that drives her, struggling with the possibility that her pursuit of the truth may lead to her downfall.",
    "personalStakeInCase": "The murder investigation is a personal matter for Sylvia, as it threatens to derail her career and expose her vulnerabilities in a competitive industry.",
    "paragraphs": [
      "Sylvia Trent surveyed the hotel lobby with a discerning eye, her instincts honed from years of investigative journalism. ‘The truth is rarely as simple as it seems,’ she often remarked, a mantra that guided her through the murky waters of her profession. Yet, as she stood amidst the chaos of the murder investigation, she found herself questioning whether the truth would be her salvation or her undoing.",
      "The stakes had never been higher. Her investigation into the victim for a potential scandal had put her in a precarious position, one that could lead to professional ruin if exposed. Sylvia had been interviewing a guest from 8:50 to 9:20, a time that could easily be scrutinized, casting doubt on her innocence. The fear of losing her credibility gnawed at her, a relentless reminder that the world of journalism was unforgiving.",
      "As she navigated the hotel, Sylvia’s observational humor emerged as a coping mechanism. She had a knack for finding the absurd in the mundane, often using her sharp wit to diffuse tense situations. Yet, the gravity of the murder hung heavily over her, and she felt the weight of her choices pressing down. Would she risk everything for the sake of a story, or would she prioritize her integrity in a cutthroat industry?",
      "As the investigation unfolded, Sylvia’s internal conflict deepened. She was forced to confront the reality that her ambition could lead to her downfall. The pursuit of truth was a noble endeavor, yet it came with risks that could shatter her carefully constructed life. In the end, Sylvia understood that the very principles she fought for might be the same ones that could lead her to ruin."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a flamboyant playwright whose secret financial arrangements threaten to unravel his life.",
    "publicPersona": "Known for his extravagant lifestyle and charm, Hugo Vane is a wealthy playwright who delights in the limelight. His flamboyant personality and theatrical flair make him a favorite among the elite, but beneath the surface lies a turbulent world of secrets.",
    "privateSecret": "Hugo was in a secret financial arrangement with the victim that could expose him, a dangerous link that places him squarely in the crosshairs of suspicion.",
    "motiveSeed": "The need to silence the victim, who threatened to reveal their dealings, drives Hugo to desperate measures to protect his reputation.",
    "motiveStrength": "compelling",
    "alibiWindow": "Hugo claimed to be in his room working on a script from 8:00 onwards, a claim that raises eyebrows given the timing of the murder.",
    "accessPlausibility": "As a prominent figure in the hotel, Hugo has plausible access to various areas, particularly his own room and the bar.",
    "stakes": "His reputation and financial security depend on keeping his secrets hidden, and the investigation threatens to expose everything he has built.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with an effusive style, often punctuating his sentences with grand gestures and self-deprecating humor. He has a tendency to embellish his stories, drawing his audience in with theatrical flair.",
    "signatureTic": "‘Ah, the irony of it all!’",
    "internalConflict": "Hugo grapples with the consequences of living a double life, torn between the flamboyant persona he presents to the world and the darker realities he hides.",
    "personalStakeInCase": "The murder investigation poses a personal threat to Hugo, as exposure of his secret dealings could lead to the collapse of his career and financial ruin.",
    "paragraphs": [
      "Hugo Vane lounged in the plush confines of his hotel room, surrounded by the trappings of success yet haunted by the specter of his hidden life. ‘Ah, the irony of it all!’ he often exclaimed, a self-deprecating chuckle following his words. His flamboyant persona captivated audiences, but the truth of his financial arrangements with the victim cast a shadow over his carefully constructed façade.",
      "As a playwright, Hugo reveled in the drama of life, yet the stakes of the murder investigation were all too real. The victim’s death threatened to expose the secrets he had worked tirelessly to keep hidden. His alibi of working on a script from 8:00 onwards was flimsy at best, and he could feel the weight of suspicion bearing down on him.",
      "In social settings, Hugo’s effusive nature often drew people in, but the truth was he felt like a jester in a court of kings, always performing yet never truly belonging. He spoke with grand gestures, his laughter ringing out like music, yet underneath it all lay a profound sense of insecurity. The fear of losing everything he had built loomed large, and he was acutely aware that the truth could unravel his life in an instant.",
      "As the investigation unfolded, Hugo’s internal conflict intensified. He was forced to confront the reality of his double life, torn between the vibrant persona he projected and the darker truths he concealed. In the end, Hugo understood that the only way to protect his reputation and financial security was to navigate the treacherous waters of the investigation with cunning and wit, all while maintaining the charm that had made him a beloved figure in society."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Crestview Hotel",
    "type": "seaside hotel",
    "place": "Scarborough",
    "country": "England",
    "summary": "A grand seaside hotel, worn yet elegant, offering a blend of Art Deco charm and traditional coastal allure.",
    "visualDescription": "The Crestview Hotel boasts a sweeping façade of faded coral stucco, its rounded corners softened by time. Inside, the lobby is adorned with polished marble floors and an ornate chandelier, casting a warm glow over the well-worn furnishings. Large windows frame the tumultuous sea, their glass slightly fogged from the salty air.",
    "atmosphere": "A blend of nostalgia and tension, as guests navigate hidden agendas amidst the crashing waves.",
    "paragraphs": [
      "The Crestview Hotel, perched precariously on the edge of Scarborough's rugged coastline, emanates an air of faded grandeur. Its once-vibrant exterior, now muted by salt and time, hints at the lively gatherings of a more prosperous era. Guests wander through the expansive lobby, where the scent of damp sea air mingles with the lingering aroma of aged wood and polished brass. Shadows dance across the marble floor, reflecting the flickering light of a nearby gas lamp, as whispers of intrigue ripple through the gathering crowd.",
      "As the overcast sky looms, casting a grey pall over the hotel, the sound of waves crashing against the cliffs fills the air, a constant reminder of nature's might. An occasional gust of wind rattles loose shutters, while the distant call of seagulls adds an element of unease. Patrons gather in the dining area, their conversations a mixture of strained laughter and hushed tones, as they eye one another warily, each suspecting the other of harboring secrets.",
      "In the evenings, the atmosphere becomes thick with tension. Guests retreat to their rooms, the sound of doors clicking shut echoing through the narrow hallways. The dimly lit corridors, lined with framed photographs of the hotel’s storied past, feel both intimate and isolating. Staff members, clad in crisp uniforms, move quietly, their presence a reminder of the rigid social hierarchy that governs the hotel. Each creak of the floorboards seems to amplify the silence, as guests ponder their next move in this game of deception."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical for coastal regions in the early fall",
    "timeFlow": "A weekend of mounting tension and intrigue",
    "mood": "tense and uncertain, with an air of suspicion among the guests",
    "eraMarkers": [
      "mechanical typewriters clacking in the lobby office",
      "early radio broadcasts crackling in the dining room",
      "rationed public transport schedules posted in the foyer"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and damp wood",
      "secondary": [
        "flickering candlelight",
        "overlapping conversations"
      ]
    },
    "paragraphs": [
      "The Crestview Hotel stands as a solitary sentinel against the raging sea, its once-vibrant colors faded by the relentless winds and waves. Within its walls, a sense of history lingers, as if the very air is thick with the stories of those who have passed through. The sound of the ocean crashing against the cliffs below serves as a constant reminder of the isolation that envelops the hotel, heightening the tension among its guests.",
      "As evening descends, the atmosphere grows heavier, the flickering lights casting long shadows that seem to stretch and reach for the secrets hidden within. The scent of damp stone and old leather fills the air, a reminder of the hotel's age and the lives intertwined within its corridors. Each creak of the floorboards echoes like a whisper, urging caution as guests navigate the delicate balance between truth and deception."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Expansive marble floors, ornate chandelier, faded Art Deco furnishings",
      "sensoryDetails": {
        "sights": [
          "flickering gas lamps",
          "ornate ceiling moldings",
          "weathered leather armchairs",
          "large bay windows"
        ],
        "sounds": [
          "murmurs of conversation",
          "clinking of silverware",
          "footsteps on marble",
          "the crackle of a radio"
        ],
        "smells": [
          "damp sea air",
          "polished wood",
          "old leather",
          "faint perfume"
        ],
        "tactile": [
          "smooth marble underfoot",
          "cold metal of railings",
          "soft leather upholstery",
          "crisp linen napkins"
        ]
      },
      "accessControl": "Open to all guests; staff access limited to cleaning before breakfast and after dinner.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady drumming on the roof",
            "muffled conversations from the dining area"
          ],
          "smells": [
            "freshly brewed coffee",
            "damp earth",
            "mildew in corners"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadowy corners",
            "dimly lit corners of the lobby"
          ],
          "sounds": [
            "the ticking of a clock",
            "soft laughter from the bar"
          ],
          "smells": [
            "beeswax from candle holders",
            "dusty bookshelves",
            "freshly polished wood"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering",
            "glimmering glassware on tables"
          ],
          "sounds": [
            "distant laughter from the dining room",
            "the soft murmur of the ocean"
          ],
          "smells": [
            "candle wax",
            "smoky fireplace",
            "cooked fish"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Crestview Hotel serves as the heart of the establishment, a place where guests congregate to exchange pleasantries, and perhaps, secrets. Glistening marble floors stretch beneath a grand chandelier, which casts a warm glow over the faded elegance of the furnishings. As patrons enter, the scent of damp sea air mingles with the lingering fragrance of polished wood and leather, creating a comforting yet charged atmosphere. The soft crackle of a radio in the corner provides a backdrop of distant news, a reminder of the wider world beyond the hotel's walls.",
        "Guests drift through the lobby, some exchanging polite smiles, others casting wary glances. The sound of footsteps echoes against the marble, each step a reminder of the tension that hangs in the air like a thick fog. The dim light casts shadows that seem to dance with every flicker, while the distant roar of the ocean outside serves as a reminder of the isolation that envelops them. Here, amidst the whispers and laughter, the stage is set for secrets to unfold."
      ]
    },
    {
      "id": "dining_area",
      "name": "The Dining Room",
      "type": "interior",
      "purpose": "Dining and social gathering",
      "visualDetails": "Large bay windows with ocean views, elegant table settings, and muted wallpaper",
      "sensoryDetails": {
        "sights": [
          "ocean waves crashing outside",
          "waitstaff in crisp uniforms",
          "flickering candle flames"
        ],
        "sounds": [
          "clinking glasses",
          "the rustle of napkins",
          "soft piano music",
          "the ocean's roar"
        ],
        "smells": [
          "roasting meat",
          "freshly baked bread",
          "sea salt",
          "cooked vegetables"
        ],
        "tactile": [
          "cool glassware",
          "soft linen napkins",
          "smooth table surfaces",
          "warmth from the fireplace"
        ]
      },
      "accessControl": "Open to guests during meal hours; staff-only access outside of these times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey skies through the windows",
            "raindrops on the glass"
          ],
          "sounds": [
            "the patter of rain",
            "soft murmurs of guests starting their day"
          ],
          "smells": [
            "freshly brewed coffee",
            "bacon sizzling",
            "mildew from the damp air"
          ],
          "mood": "dreary anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "shadows across the tables"
          ],
          "sounds": [
            "clattering of dishes",
            "quiet conversations"
          ],
          "smells": [
            "beeswax candles",
            "fish stew",
            "fresh herbs"
          ],
          "mood": "suspicious quiet"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off glasses",
            "decorative centerpieces"
          ],
          "sounds": [
            "laughter and chatter",
            "the soft strumming of a guitar"
          ],
          "smells": [
            "grilled seafood",
            "roasted vegetables",
            "sweet dessert"
          ],
          "mood": "tense celebration"
        }
      ],
      "paragraphs": [
        "The Dining Room at The Crestview Hotel is an elegant space, where guests gather to indulge in hearty meals while gazing out at the tumultuous sea. The large bay windows offer a panoramic view of the crashing waves, while the flickering candlelight casts a warm glow over the finely set tables adorned with crisp linens and polished silverware. The air is thick with the aroma of roasted meats and freshly baked bread, enticing diners as they settle into their seats.",
        "As the dining experience unfolds, the sounds of clinking glasses and hushed conversations fill the air, creating a symphony of social interaction. Yet, beneath the surface, an undercurrent of tension simmers, as guests exchange furtive glances and whispers, each one acutely aware of the others’ presence. The atmosphere is charged, as secrets linger just beneath the surface of polite conversation, waiting to be uncovered amidst the clatter of dishes and the distant roar of the ocean."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "The Guest Rooms",
      "type": "interior",
      "purpose": "Private quarters for guests",
      "visualDetails": "Simple decor, faded floral wallpaper, and small balconies overlooking the sea",
      "sensoryDetails": {
        "sights": [
          "faded floral wallpaper",
          "dimly lit bedside lamps",
          "ocean view from the balcony",
          "worn rugs on wooden floors"
        ],
        "sounds": [
          "the distant crashing of waves",
          "soft rustle of curtains",
          "occasional footsteps in the hallway",
          "the ticking of a clock"
        ],
        "smells": [
          "stale air",
          "old books",
          "salt from the sea breeze",
          "faint lavender"
        ],
        "tactile": [
          "cool metal doorknobs",
          "soft blankets",
          "worn wooden furniture",
          "the breeze from the balcony"
        ]
      },
      "accessControl": "Access limited to registered guests; staff may enter only for cleaning by request.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through raindrop-specked windows",
            "wet balcony railing"
          ],
          "sounds": [
            "steady rain on the roof",
            "distant thunder"
          ],
          "smells": [
            "damp wood",
            "freshly washed linens",
            "mildew"
          ],
          "mood": "claustrophobic confinement"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping along the walls",
            "flickering candlelight"
          ],
          "sounds": [
            "the creak of floorboards",
            "quiet whispers from nearby rooms"
          ],
          "smells": [
            "old leather",
            "faint tobacco smoke",
            "faintly sweet perfume"
          ],
          "mood": "isolated suspense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelit bedside table",
            "stars beginning to twinkle outside"
          ],
          "sounds": [
            "gentle waves lapping against the shore",
            "wind rustling through the curtains"
          ],
          "smells": [
            "freshly brewed tea",
            "scented candles",
            "salt in the air"
          ],
          "mood": "tense reflection"
        }
      ],
      "paragraphs": [
        "The Guest Rooms of The Crestview Hotel offer a semblance of comfort amidst the chaos of the outside world. With their simple decor and faded floral wallpaper, they provide a cozy retreat for weary travelers. Each room features a small balcony overlooking the churning sea, where the sound of waves crashing against the cliffs creates a soothing yet haunting backdrop. The air is thick with the scent of salt and old books, a reminder of the stories that have unfolded within these walls.",
        "As night falls, the atmosphere shifts, shadows creeping along the walls as candlelight flickers softly. The ticking of a clock fills the silence, a constant reminder of the passing time. Each creak of the floorboards echoes like a whisper, urging guests to remain vigilant. In this intimate space, secrets are held close, and the tension of unspoken words hangs heavy in the air, waiting to be released."
      ]
    },
    {
      "id": "balcony",
      "name": "The Oceanfront Balcony",
      "type": "exterior",
      "purpose": "Private space for guests to enjoy the view",
      "visualDetails": "Wrought iron railings, weathered wooden flooring, and a panoramic view of the ocean",
      "sensoryDetails": {
        "sights": [
          "crashing waves below",
          "distant horizon fading into mist",
          "seagulls circling overhead",
          "faded deck chairs"
        ],
        "sounds": [
          "roaring surf",
          "whistling wind",
          "occasional gull calls",
          "the soft rustle of leaves"
        ],
        "smells": [
          "salty sea air",
          "fresh fish from the market",
          "wet wood",
          "faint floral scent from nearby gardens"
        ],
        "tactile": [
          "cold metal of railings",
          "rough wooden boards underfoot",
          "gentle breeze on the skin",
          "warmth of the sun"
        ]
      },
      "accessControl": "Access limited to guests from their rooms; staff not permitted.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked balcony",
            "grey clouds overhead"
          ],
          "sounds": [
            "heavy drops falling",
            "wind howling"
          ],
          "smells": [
            "damp earth",
            "wet wood",
            "ocean spray"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds gathering",
            "waves crashing against the rocks"
          ],
          "sounds": [
            "the roar of the ocean",
            "whispers of wind"
          ],
          "smells": [
            "seaweed",
            "salt in the air",
            "wet stone"
          ],
          "mood": "foreboding silence"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "stars beginning to appear"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant laughter of guests"
          ],
          "smells": [
            "grilled seafood",
            "freshly cut grass",
            "salt and sea"
          ],
          "mood": "reflective calm"
        }
      ],
      "paragraphs": [
        "The Oceanfront Balcony of The Crestview Hotel offers an escape from the tension that simmers within. With wrought iron railings framing a breathtaking view of the tumultuous sea, it provides a space for guests to breathe in the salty air and momentarily forget their troubles. The weathered wooden floorboards creak underfoot, while the sound of crashing waves below creates a rhythmic symphony, lulling the mind into a tranquil state.",
        "As the day unfolds, the atmosphere shifts dramatically. In the morning, rain-soaked and grey, the balcony feels isolated, a melancholic retreat as the wind howls around the building. In the afternoon, dark clouds gather, casting a shadow over the ocean, while the distant roar of the waves serves as a reminder of the storm brewing within the hotel. By evening, however, the clear sky reveals a stunning sunset, casting golden hues over the water, inviting guests to reflect on the day’s secrets as they sip their drinks and gaze into the horizon."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023238798000000003,
  "durationMs": 71383
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "January",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "overcast skies",
      "occasional rain",
      "cold winds from the sea"
    ],
    "daylight": "Short winter days with limited sunlight, with twilight creeping in as early as four o'clock in the afternoon.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the hotel is quiet and the guests retreat to their rooms.",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "attending winter social events at the hotel",
      "brisk walks along the beach in warm coats",
      "playing board games by the fireplace"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool suits",
        "double-breasted blazers",
        "silk ties with geometric patterns"
      ],
      "casual": [
        "wool sweaters",
        "tweed trousers",
        "heavy overcoats"
      ],
      "accessories": [
        "fedora hats",
        "gloves",
        "scarves"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dresses with fitted waists",
        "fur-trimmed evening gowns",
        "long gloves"
      ],
      "casual": [
        "knitted cardigans",
        "A-line skirts",
        "practical ankle boots"
      ],
      "accessories": [
        "cloche hats",
        "pearls",
        "stylish handbags"
      ]
    },
    "trendsOfTheMoment": [
      "war-inspired utilitarian fashion",
      "emphasis on practicality and warmth",
      "bold colors contrasted with subdued tones"
    ],
    "socialExpectations": [
      "men expected to be the primary breadwinners",
      "women increasingly encouraged to work in various sectors",
      "formal decorum maintained in public spaces"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Allied forces prepare for the Normandy invasion",
      "Franklin D. Roosevelt's administration focuses on war production",
      "Tensions escalate with the Soviet Union over post-war Europe plans"
    ],
    "politicalClimate": "A divided world grappling with the implications of World War II, with rising concerns over the Soviet influence in Eastern Europe.",
    "economicConditions": "Rationing continues sharply impacting daily life, though wartime production has increased job opportunities.",
    "socialIssues": [
      "Return of soldiers adjusting to civilian life",
      "Women facing scrutiny in the workforce",
      "Discussions on civil rights for minority groups"
    ],
    "internationalNews": [
      "Reports of heavy fighting in the Pacific theater",
      "Conversations about the establishment of the United Nations post-war",
      "Growing anti-fascist movements in Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'I'll Be Home for Christmas'",
        "Duke Ellington's jazz compositions",
        "Glenn Miller's big band hits"
      ],
      "films": [
        "'Double Indemnity'",
        "'Laura'",
        "'To Have and Have Not'"
      ],
      "theater": [
        "Broadway productions of 'Oklahoma!'",
        "the growing popularity of wartime dramas"
      ],
      "radio": [
        "'The Shadow'",
        "'Suspense'",
        "'The Jack Benny Program'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Glass Menagerie' by Tennessee Williams",
        "'Brave New World' by Aldous Huxley",
        "'The Little Prince' by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "detective fiction",
        "war stories",
        "domestic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "improvements in radar technology",
        "advancements in aircraft design",
        "the spread of early television"
      ],
      "commonDevices": [
        "mechanical typewriters",
        "crank telephones",
        "radio sets"
      ],
      "emergingTrends": [
        "the rise of consumer goods after rationing eases",
        "early adoption of synthetic fabrics"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A dozen eggs: one shilling",
        "A gallon of gasoline: two shillings"
      ],
      "commonActivities": [
        "writing letters to servicemen abroad",
        "attending community dances",
        "participating in war bond drives"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "weekly bridge nights",
        "New Year's resolutions gathering"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Growing tension between working and upper classes",
      "Changing dynamics as more women join the workforce"
    ],
    "gender": [
      "Women are increasingly seen in roles outside the home",
      "Men are expected to return to their pre-war jobs",
      "Debates on women's rights are beginning to surface"
    ],
    "race": [
      "Increased awareness of racial inequalities",
      "Civil rights movements gaining traction in urban areas"
    ],
    "generalNorms": [
      "Emphasis on community and patriotism",
      "Cautious optimism about the future",
      "Skepticism regarding international alliances"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp wood and salt lingered in the air, with the sound of waves crashing against the nearby rocks.",
    "The low hum of a radio broadcast filled the hotel lounge, punctuated by the crackling sound of static and occasional announcements about the war.",
    "Guests whispered in hushed tones, casting wary glances at each other, the flickering candlelight casting shadows that danced ominously across the walls."
  ],
  "paragraphs": [
    "In January 1944, the seaside hotel stood resolute against the relentless winter weather, with overcast skies and a chill that seeped through the walls. Guests, bundled in heavy coats and scarves, gathered by the fireplace, sharing stories as the occasional rain tapped against the windows, mirroring their uncertain moods. The days were short, with twilight settling in by four o'clock, creating an atmosphere ripe for secrets and half-truths as shadows grew longer inside the hotel, where whispers of wartime anxieties hung like the smoke from their coal fires.",
    "Fashion during this winter reflected both the practical needs of wartime and the lingering elegance of pre-war styles. Men donned tailored wool suits and double-breasted blazers, while women adorned themselves in elegant tea dresses and fur-trimmed coats. Accessories like fedora hats and cloche hats were common, completing looks that balanced utility with a sense of occasion. The tension of the era seeped into their attire; every detail spoke of resilience amidst uncertainty, while vibrant colors punctuated the otherwise muted tones of winter's palette.",
    "Daily life in January 1944 revolved around the rhythms of wartime living. Rationing continued to shape consumption, with bread costing four pence and a dozen eggs priced at one shilling. Community activities like dances and war bond drives brought people together, while the tradition of family dinners on Sundays remained a cherished norm. Women increasingly took up roles in the workforce, challenging traditional gender expectations, while men returning from service faced the daunting task of reintegration. Amidst the backdrop of social change, the seaside hotel became a melting pot of ideas and emotions, where the past and present collided in a tapestry of hope and disquiet."
  ],
  "note": "",
  "cost": 0.0010598758500000001,
  "durationMs": 31842
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense gathering of hotel guests, each grappling with personal secrets and societal pressures, converges under the scrutiny of a murder investigation fueled by post-war anxieties and shifting gender roles.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The era is marked by women entering the workforce, post-war trauma, and the burgeoning tensions of the Cold War, creating a backdrop of societal change and personal conflict."
  },
  "setting": {
    "location": "A grand, somewhat worn seaside hotel overlooking the ocean.",
    "institution": "seaside hotel",
    "weather": "overcast with occasional rain, typical for coastal regions in the early fall."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an optical method, where a mirror-and-lens reflection falsified a witness's sightline across the room."
}

### LOCKED_FACTS
[
  {
    "id": "mirror_angle",
    "value": "thirty degrees",
    "description": "The angle of the mirror causing the optical illusion."
  },
  {
    "id": "witness_distance",
    "value": "ten feet",
    "description": "The distance from the witness to the mirror."
  },
  {
    "id": "dining_area_length",
    "value": "twenty-five feet",
    "description": "The length of the dining area."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 16,
  "countsByPlacement": {
    "early": 6,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 15,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
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
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_9",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_10",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_13",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_culprit_direct_beatrice_quill",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "physical"
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
