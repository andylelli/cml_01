# Actual Prompt Record

- Run ID: `mystery-1784060164809`
- Project ID: ``
- Timestamp: `2026-07-14T20:20:53.532Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `99602cf4290e21c1`

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
    "title": "Tidal Timing Trap",
    "author": "Agent 5",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "drowning"
    }
  },
  "death_method": "drowned",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp and observant woman",
      "private_secret": "Carries the burden of a past failure in solving a case",
      "motive_seed": "Desire for redemption",
      "motive_strength": "strong",
      "alibi_window": "10:00 PM to 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Clearing her conscience",
      "evidence_sensitivity": [],
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
      "private_secret": "Had a secret affair with Captain Hale",
      "motive_seed": "Conflict of interest",
      "motive_strength": "unknown",
      "alibi_window": "10:00 PM to 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Maintaining reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Suspect",
      "relationships": [
        "Had an affair with the victim"
      ],
      "public_persona": "Charismatic naval officer",
      "private_secret": "Has gambling debts",
      "motive_seed": "Desire to silence the victim",
      "motive_strength": "moderate",
      "alibi_window": "10:00 PM to 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Beach access"
      ],
      "behavioral_tells": [],
      "stakes": "Avoiding disgrace",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Suspect",
      "relationships": [
        "Close friend of the victim"
      ],
      "public_persona": "Compassionate and caring nurse",
      "private_secret": "Knew about the affair",
      "motive_seed": "Jealousy over the victim's relationships",
      "motive_strength": "low",
      "alibi_window": "10:00 PM to 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Protecting her friendship",
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
        "Acquaintance of the victim"
      ],
      "public_persona": "Mysterious traveler",
      "private_secret": "Hiding her true identity",
      "motive_seed": "Unrevealed past with the victim",
      "motive_strength": "unknown",
      "alibi_window": "10:00 PM to 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Maintaining anonymity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Hotel owner"
      ],
      "public_persona": "Wealthy and influential",
      "private_secret": "Under pressure from investors",
      "motive_seed": "Financial gain from insurance",
      "motive_strength": "moderate",
      "alibi_window": "10:00 PM to 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel grounds"
      ],
      "behavioral_tells": [],
      "stakes": "Preserving his business",
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
      "summary": "During a reunion at a modest seaside hotel, Dr. Mallory Finch is found drowned shortly after a violent wave crashes against the shore. Detective Eleanor Voss must navigate the tides of deception as she uncovers a web of jealousy, secrets, and a calculated plan to mislead the investigation."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The victim was drowned and weighted down using a heavy anchor, making it appear as though she drowned naturally during high tide.",
      "delivery_path": [
        {
          "step": "The victim was approached while alone on the beach."
        },
        {
          "step": "An anchor was tied to the victim's leg."
        },
        {
          "step": "The victim was pushed into the water."
        },
        {
          "step": "The anchor kept her submerged until the tide receded."
        }
      ]
    },
    "outcome": {
      "result": "The victim's drowning was disguised as an accident."
    }
  },
  "false_assumption": {
    "statement": "Dr. Mallory Finch drowned during high tide at approximately quarter past eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses recalled seeing her near the water just before high tide, leading to a belief she was swept away by the waves.",
    "what_it_hides": "The actual time of death was much earlier, facilitated by the anchor."
  },
  "false_solution": {
    "accused_suspect": "Hugo Vane",
    "supporting_points": [
      "Hugo was the last person seen speaking to the victim before her death.",
      "He has a financial motive as the hotel owner."
    ],
    "the_one_flaw": "There is no concrete link between Hugo and the beach at the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A stormy night caused unusual wave activity.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The storm was documented, and Beatrice was tending to guests in the hotel.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Witnesses recall seeing Sylvia near the beach before the incident.",
      "points_at_suspect": "Sylvia Trent",
      "innocent_explanation": "Sylvia was merely taking a walk as part of her routine, not involved in the events leading to the drowning.",
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
    "rationale": "All individuals were at the hotel during the incident, and no outsiders had access."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "High tide peaked at quarter past eleven."
      ],
      "windows": [
        "Possible time of death from ten to eleven."
      ],
      "contradictions": [
        "Witnesses claim the victim was seen alive shortly before high tide."
      ]
    },
    "access": {
      "actors": [
        "Captain Hale",
        "Beatrice Quill",
        "Sylvia Trent",
        "Hugo Vane"
      ],
      "objects": [
        "The anchor used to weigh down the victim."
      ],
      "permissions": [
        "Access to the beach was unrestricted at night."
      ]
    },
    "physical": {
      "laws": [
        "The tide rises predictably, affecting timing of events."
      ],
      "traces": [
        "Wet sand near the dune indicates disturbance."
      ]
    },
    "social": {
      "trust_channels": [
        "Witness accounts can be misleading."
      ],
      "authority_sources": [
        "Local tide charts, which were manipulated."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall hearing loud waves crashing violently at quarter past eleven.",
        "correction": "The loud waves indicate the high tide coincided with a significant event.",
        "effect": "Narrows the time of death window.",
        "required_evidence": [
          "Witness statements about wave activity.",
          "Tide charts showing high tide at quarter past eleven."
        ],
        "reader_observable": true
      },
      {
        "observation": "The victim's clothing shows signs of quick immersion, not prolonged exposure.",
        "correction": "The condition of the clothing suggests she entered the water shortly before being found.",
        "effect": "Eliminates the possibility of drowning occurring at high tide.",
        "required_evidence": [
          "The victim's wet clothing.",
          "Witnesses' timing of when they last saw her."
        ],
        "reader_observable": true
      },
      {
        "observation": "An anchor was found tied to the victim's leg.",
        "correction": "The anchor indicates foul play, suggesting she was weighted down to keep her submerged.",
        "effect": "Narrows suspects to those with access to heavy objects.",
        "required_evidence": [
          "The anchor's weight and condition.",
          "Witness accounts of who was near the beach."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the timing of the tide schedule with the victim's clothing condition proves she could not have drowned at high tide.",
    "knowledge_revealed": "The timing of the death contradicts witness accounts.",
    "pass_condition": "Determining that the victim was drowned much earlier than quarter past eleven.",
    "evidence_clues": [
      "clue_4",
      "clue_3",
      "clue_core_contradiction_chain",
      "clue_id_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witnesses recall wave activity (early) and the tide chart (mid) narrow the time of death. Step 2: The victim's clothing condition (mid) eliminates the possibility of drowning at high tide. Step 3: The anchor found with the victim (discriminating test) confirms foul play."
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
      "test_type": "temporal analysis"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Documented alibi from hotel logs.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness statements confirming her routine.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 10:00 PM to 11:30 PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 10:00 PM to 11:30 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of timing and anchor."
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Clothing condition"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_11",
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
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Anchor condition"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A retired schoolteacher turned amateur sleuth, Eleanor Voss embodies wisdom and compassion, yet harbors secrets that threaten her carefully crafted public persona.",
    "publicPersona": "A well-respected figure in the community, known for her wisdom and kindness.",
    "privateSecret": "Has been struggling with a secret affair with a much younger local artist.",
    "motiveSeed": "Eleanor was at the hotel for a quiet retreat and felt compelled to investigate the murder due to her strong sense of justice.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in her room reading when the murder occurred",
    "accessPlausibility": "possible",
    "stakes": "Eleanor seeks to prove her worth beyond her age and societal expectations.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a measured tone, often using gentle sarcasm to mask her deeper emotions. She has a tendency to pause thoughtfully before responding, as if weighing her words carefully.",
    "signatureTic": "Well, I suppose that's one way to look at it.",
    "internalConflict": "Eleanor grapples with the duality of her life: the respectable image she projects versus the thrill of her secret affair, which she fears could shatter her reputation.",
    "personalStakeInCase": "This crime matters to Eleanor because it challenges her to step out of her comfort zone and assert herself in a world that often dismisses older women.",
    "paragraphs": [
      "Eleanor Voss, a woman of quiet strength, has spent her life nurturing young minds as a schoolteacher. Now in her late forties, she finds herself at a seaside hotel, seeking solace and perhaps a moment of reflection. Yet, the tranquility she craves is shattered by the murder that unfolds before her eyes. With a keen sense of justice, she cannot simply stand by; she must investigate, not just for the victim, but for herself. The thrill of sleuthing rekindles the fire within her, a fire she thought had dimmed with age.",
      "Behind her kind smile lies a secret that weighs heavily on her heart. Eleanor is entangled in an affair with a much younger local artist, a relationship that fills her with both joy and guilt. She knows that if the truth were to surface, it would obliterate her carefully maintained reputation as a pillar of the community. Yet, in this moment of chaos, she feels a surge of empowerment, a desire to prove that she is more than just a retired teacher. The investigation becomes her means of reclaiming her identity.",
      "As she delves deeper into the investigation, Eleanor encounters resistance from those who wish to protect their own interests. The stakes rise, and with them, her resolve. She finds herself at odds with the very society that once revered her, as they question her motives and abilities. Each clue she uncovers feels like a step towards liberation, yet the shadows of her secret affair loom large, threatening to engulf her in scandal. Eleanor must navigate this treacherous terrain, balancing her quest for justice with the fear of exposure.",
      "In the end, Eleanor's journey is not just about solving the murder; it's about confronting her own limitations and societal expectations. As she pieces together the truth, she discovers that her worth is not defined by her age or her past but by her courage to confront the darkness within and around her. With each revelation, she finds herself inching closer to empowerment, ready to embrace a new chapter in her life, one where she is not just a former schoolteacher but a formidable investigator in her own right."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A talented physician caught in a web of ambition and resentment, Dr. Mallory Finch's passion for her patients masks a simmering frustration with the barriers she faces in her career.",
    "publicPersona": "A dedicated doctor respected for her work, passionate about her patients' well-being.",
    "privateSecret": "Resents being overlooked for promotions in favor of male colleagues.",
    "motiveSeed": "Mallory stood to gain funding for her clinic if Eleanor's influential connections were severed.",
    "motiveStrength": "moderate",
    "alibiWindow": "was seen in the hotel’s lounge around the time of the murder",
    "accessPlausibility": "possible",
    "stakes": "Mallory wishes to break barriers in a male-dominated field.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a brisk, no-nonsense tone, often punctuating her observations with dry humor. She tends to use medical jargon casually, making her sound both authoritative and relatable.",
    "signatureTic": "Let's not sugarcoat this.",
    "internalConflict": "Mallory struggles with feelings of inadequacy and anger at a system that consistently undermines her capabilities, leading her to question her own worth.",
    "personalStakeInCase": "The murder investigation forces Mallory to confront her ambitions and the lengths she might go to secure her future in a profession that often sidelines women.",
    "paragraphs": [
      "Dr. Mallory Finch stands at the crossroads of ambition and frustration. A respected physician in her thirties, she has dedicated her life to her patients, yet the accolades she deserves continue to elude her, overshadowed by male colleagues. At the seaside hotel, she seeks a moment of respite, but instead finds herself entangled in a murder investigation that threatens to unravel the delicate threads of her professional life. The stakes are high, and for Mallory, they are personal.",
      "Beneath her composed exterior lies a simmering resentment. Mallory has fought tirelessly for recognition, only to be repeatedly sidelined in favor of less qualified men. This injustice fuels her desire for success, but it also breeds bitterness that she must confront. As she navigates the murky waters of the investigation, she feels the weight of her ambitions pressing down on her, an uncomfortable reminder of what she stands to lose if the truth about Eleanor's murder is revealed.",
      "When confronted with Eleanor's influential connections, Mallory's motives become clouded by ambition. She realizes that severing those ties could provide her with the funding she desperately needs for her clinic. But as the investigation unfolds, she grapples with her own ethical dilemmas. Is she willing to sacrifice her integrity for the sake of her career? The question gnaws at her, forcing Mallory to examine the lengths to which she is willing to go to achieve her dreams.",
      "In the end, Mallory's journey is not just about the murder; it's about the fight for her own identity and place in a male-dominated field. As the investigation unfolds, she learns that collaboration may be the key to overcoming the barriers she faces. Through the chaos, she discovers that true strength lies not in ambition alone, but in the courage to challenge the status quo and forge her own path forward."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer grappling with the ghosts of his past, Captain Ivor Hale's stern demeanor belies the inner turmoil stemming from wartime decisions and societal changes.",
    "publicPersona": "A stern yet fair former officer, proud of his service and moral principles.",
    "privateSecret": "Struggles with PTSD and has unresolved guilt about wartime decisions.",
    "motiveSeed": "Ivor felt betrayed by Eleanor's opinions on post-war values, fearing they undermined his legacy.",
    "motiveStrength": "strong",
    "alibiWindow": "was on the beach walking his dog when the murder occurred",
    "accessPlausibility": "easy",
    "stakes": "Ivor must protect his reputation and traditional values in a changing society.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor's speech is direct and authoritative, often laced with military jargon. He tends to speak in short, clipped sentences, reflecting his no-nonsense attitude.",
    "signatureTic": "That’s how it is, plain and simple.",
    "internalConflict": "Ivor wrestles with guilt from his past decisions during the war, leading to a deep-seated fear of being perceived as outdated in a rapidly changing world.",
    "personalStakeInCase": "The murder investigation forces Ivor to confront his own insecurities and the shifting values of a society he fought to protect.",
    "paragraphs": [
      "Captain Ivor Hale, a man of the sea, carries the weight of his past like an anchor. In his late fifties, he presents himself as a stern yet fair figure, commanding respect from those around him. However, beneath this exterior lies a man haunted by the ghosts of wartime decisions that continue to plague his conscience. As he walks the beach with his dog, he finds solace in the rhythmic crashing of waves, a temporary escape from the turmoil within. Yet, the tranquility is shattered when a murder occurs at the hotel, forcing Ivor to confront the very ideals he holds dear.",
      "Ivor's moral principles are challenged by Eleanor Voss's progressive views on post-war values. He feels betrayed by her opinions, fearing that they undermine the legacy he fought to uphold. The stakes are high for Ivor, as he grapples with the shifting tides of societal change. He is determined to protect his reputation, but the investigation threatens to expose the fragility of his beliefs. Each revelation feels like a personal attack, pushing him further into a corner where he must confront the truth of his own vulnerabilities.",
      "With every passing moment, Ivor's internal conflict deepens. The PTSD he struggles with manifests in moments of rage and despair, leaving him vulnerable and defensive. As he navigates the investigation, he becomes increasingly aware of the generational divide between himself and those around him. The values he once championed seem outdated, and he fears that he will be left behind in a world that no longer holds his ideals in high regard. The murder investigation serves as a catalyst for Ivor to confront these fears head-on.",
      "Ultimately, Ivor's journey is about adaptation and acceptance. As the investigation unfolds, he begins to recognize the importance of understanding different perspectives. It is through this process that he may find redemption, learning to bridge the gap between tradition and progress. In the face of the murder, Ivor must confront not only the truth about the crime but also the truths about himself, leading to a profound transformation that challenges his very understanding of honor and legacy."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An aspiring writer struggling with self-doubt, Beatrice Quill's vibrant ideals clash with the stifling expectations of her upbringing, pushing her toward rebellion.",
    "publicPersona": "A vibrant and outspoken young woman, advocating for progressive ideals.",
    "privateSecret": "Struggles with self-doubt and fears she lacks talent.",
    "motiveSeed": "Beatrice felt Eleanor was stifling her creative potential, claiming she was too naive.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in a heated discussion with Mallory during the time of the murder",
    "accessPlausibility": "unlikely",
    "stakes": "Beatrice desires validation as a writer and independence from her family's expectations.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice has a fluid and expressive way of speaking, often punctuating her points with dramatic flair. She tends to use sarcasm liberally, reflecting her rebellious spirit.",
    "signatureTic": "Oh, please, as if that would happen.",
    "internalConflict": "Beatrice battles with the fear that her dreams of becoming a writer are unattainable, leading to feelings of inadequacy and frustration.",
    "personalStakeInCase": "The murder investigation forces Beatrice to confront her fears of inadequacy and the expectations placed on her by her family, prompting her to seek her own voice.",
    "paragraphs": [
      "Beatrice Quill, a fiery young woman in her twenties, is an aspiring writer with dreams as grand as the ocean waves crashing against the shore. Yet, beneath her vibrant exterior lies a tumultuous sea of self-doubt. She finds herself at the hotel, eager to escape the suffocating expectations of her family, only to be drawn into a murder that threatens to drown her aspirations. The stakes rise as she realizes that Eleanor Voss, the very woman she views as a barrier to her creative freedom, has become the victim of a heinous crime.",
      "In her interactions with others, Beatrice exudes confidence, yet her inner monologue is filled with insecurity. She often resorts to sarcasm as a defense mechanism, masking her fears with biting wit. When Eleanor's opinions clash with her own ideals, Beatrice feels the sting of inadequacy. The belief that she is too naive to understand the complexities of the world weighs heavily on her, pushing her toward rebellion against the very authority figures she once admired. The murder investigation becomes a catalyst for her to confront these feelings head-on.",
      "As Beatrice engages in heated discussions with Mallory, her frustrations bubble to the surface. In those moments, she feels alive, her passion igniting like a spark in dry tinder. Yet, the fear of being dismissed as just another young idealist lingers. The stakes are high for Beatrice, as she seeks validation not only from others but from herself. The investigation forces her to examine her motivations and desires, challenging her to find her voice amidst the chaos.",
      "Ultimately, Beatrice's journey is about self-discovery and empowerment. As the investigation unfolds, she learns that her dreams are valid, and her voice deserves to be heard. Through the turmoil of the murder, she begins to embrace her creativity and challenge the expectations placed upon her. In the end, Beatrice Quill emerges not just as an aspiring writer, but as a woman ready to carve her own path, unafraid to confront the world with her words."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A wealthy widow wielding her influence like a weapon, Sylvia Trent's charm masks a manipulative nature driven by a desire to control her family's fate.",
    "publicPersona": "A charming and influential socialite, known for her generosity and community work.",
    "privateSecret": "Has been using her wealth to manipulate family dynamics to her advantage.",
    "motiveSeed": "Sylvia wanted to ensure Eleanor's influence was curtailed to protect her own interests in the family inheritance.",
    "motiveStrength": "compelling",
    "alibiWindow": "was in her suite entertaining guests during the murder",
    "accessPlausibility": "possible",
    "stakes": "Sylvia is driven by her desire to maintain control over her family and estate.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia's speech is polished and refined, often laced with subtle sarcasm. She has a way of making cutting remarks sound almost complimentary, reflecting her manipulative nature.",
    "signatureTic": "How delightful, isn't it?",
    "internalConflict": "Sylvia grapples with the fear of losing control over her family's legacy, leading her to make increasingly desperate choices.",
    "personalStakeInCase": "The investigation threatens to expose her manipulations, forcing Sylvia to confront the consequences of her actions.",
    "paragraphs": [
      "Sylvia Trent, a woman of wealth and influence, glides through the hotel like a ship through calm waters. In her sixties, she is the epitome of a charming socialite, known for her philanthropy and community involvement. Yet, beneath this polished exterior lies a cunning mind, adept at manipulating those around her to secure her family's interests. As the murder of Eleanor Voss unfolds, Sylvia's carefully crafted facade begins to crack, revealing the ruthless nature that drives her.",
      "Sylvia's public persona is one of warmth and generosity, yet her private life is a different story. She wields her wealth like a weapon, using it to control family dynamics and maintain her grip on the family estate. The stakes are high for her; Eleanor's influence poses a direct threat to her ambitions. As the investigation progresses, Sylvia becomes increasingly aware of the precariousness of her position. Each interaction feels like a game of chess, where she must outmaneuver those who threaten her carefully constructed world.",
      "In her conversations, Sylvia's polite savagery shines through. She has a knack for delivering compliments that cut deep, masking her true intentions behind a veil of charm. Yet, as the investigation intensifies, her manipulations begin to unravel. The fear of exposure looms large, and Sylvia finds herself grappling with the consequences of her actions. Can she maintain control over her family's legacy, or will the truth about her machinations come to light?",
      "Ultimately, Sylvia's journey is one of reckoning. As the investigation unfolds, she must confront the reality of her manipulative nature and the damage it has wrought. In a world where power dynamics shift like the tides, Sylvia Trent must navigate the treacherous waters of her own making. The murder investigation forces her to reevaluate her priorities, leading her to a crossroads where she must choose between maintaining her control or embracing a more honest path forward."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "An ambitious entrepreneur with a charming facade, Hugo Vane hides financial struggles that threaten his business empire, forcing him to navigate a web of deceit.",
    "publicPersona": "A charismatic businessman with a growing reputation for his ventures.",
    "privateSecret": "Hides financial struggles that threaten his business empire.",
    "motiveSeed": "Hugo sought to eliminate Eleanor, who was pushing for community initiatives that threatened his profit margins.",
    "motiveStrength": "moderate",
    "alibiWindow": "was seen in the hotel bar chatting with guests at the time of the murder",
    "accessPlausibility": "easy",
    "stakes": "Hugo aims to secure his financial future and maintain his business's status.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo's speech is smooth and persuasive, often peppered with casual charm. He uses humor to deflect tension, relying on self-deprecation to disarm those around him.",
    "signatureTic": "Just my luck, really.",
    "internalConflict": "Hugo is torn between his ambition and the ethical implications of his actions, leading him to question his own values.",
    "personalStakeInCase": "The murder investigation threatens to expose his financial struggles, forcing Hugo to confront the consequences of prioritizing profit over ethics.",
    "paragraphs": [
      "Hugo Vane, a man with a silver tongue and a charming smile, navigates the world of business with an air of confidence that masks his inner turmoil. In his thirties, he presents himself as a successful entrepreneur, yet the reality is far more complicated. As he mingles with guests at the hotel bar, the facade he has built is threatened by the murder of Eleanor Voss, a woman whose community initiatives put his profit margins at risk. The stakes have never been higher for Hugo as he grapples with the implications of the crime.",
      "Beneath the surface, Hugo's financial struggles loom like dark clouds on the horizon. He has cultivated an image of success, but the truth is that his business empire teeters on the brink of collapse. The murder investigation becomes a source of anxiety, as it threatens to expose his vulnerabilities. With every passing moment, he feels the pressure to maintain his reputation, using humor as a shield against the mounting tension. His self-deprecating remarks serve to deflect suspicion, but they also highlight the cracks in his carefully constructed persona.",
      "As the investigation unfolds, Hugo must confront the ethical dilemmas that accompany his ambition. He realizes that his desire for financial security has led him down a path of deceit, and the murder of Eleanor brings these issues to a head. The stakes are not just about his business, but about his integrity as well. Can he reconcile his ambition with the values he claims to uphold? The answer to this question becomes increasingly elusive as the investigation progresses.",
      "Ultimately, Hugo's journey is one of self-discovery and accountability. As he navigates the murky waters of the investigation, he begins to understand that true success is not solely measured by profit margins, but by the impact he has on his community. The murder investigation forces him to reevaluate his priorities, leading to a transformation that challenges his understanding of ambition and ethical responsibility. In the end, Hugo Vane must decide what kind of legacy he wishes to leave behind."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Ocean’s Edge Hotel",
    "type": "hotel",
    "place": "Clovelly",
    "country": "England",
    "summary": "A modest Art Deco hotel perched above the rugged coastline, offering both tranquil views and hidden tensions among its guests.",
    "visualDescription": "Streamlined Art Deco façade gleaming in silver and seafoam hues; large windows framing jagged cliffs and turbulent waves; a small private beach with weathered wooden steps leading down to the sand.",
    "atmosphere": "A blend of coastal beauty and underlying dread, tainted by recent wartime memories.",
    "paragraphs": [
      "The Ocean’s Edge Hotel stands defiantly against the crashing waves of Clovelly's coastline, its Art Deco architecture a stark contrast to the rugged natural landscape. Guests gaze out from their windows, watching the relentless tides that mirror the turmoil of their own lives. The air is filled with the salty tang of the sea, mixed with the faint scent of damp wood from the hotel's weather-beaten exterior. Overhead, the sky looms heavy with clouds, casting a pall over the cheerful seaside retreat.",
      "Inside, the hotel is a labyrinth of narrow hallways and staircases, with plush carpeting muffling footsteps. The décor, while charming in its vintage elegance, feels bruised by the weight of secrets and whispered conversations. Flickering gas lamps cast a warm glow, but shadows cling to the corners, hinting at the tensions that simmer just below the surface. The distant sound of the ocean is a constant reminder of the isolation of this place, where help may not come easily in times of need.",
      "As evening falls, the atmosphere thickens with unease. Guests gather in the small lounge, where a crackling radio broadcasts news from the outside world, a reminder of the war's far-reaching impact. Laughter rings hollow over clinking glasses, and furtive glances reveal the underlying distrust among strangers. The scent of cigarette smoke mingles with the briny air, while the steady tick of the wall clock marks the passage of time, each second a reminder that danger may be closer than it appears."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with a chance of rain, typical for coastal areas in the Fall",
    "timeFlow": "Three days of mounting tension, with secrets unraveling at each turn",
    "mood": "tense and suspenseful, heightened by recent wartime memories and social unrest",
    "eraMarkers": [
      "radio broadcasts of wartime news",
      "rationed fuel for local travel",
      "military cryptography discussions among guests"
    ],
    "sensoryPalette": {
      "dominant": "salty sea breeze and damp wood",
      "secondary": [
        "flickering candlelight and shadows",
        "muffled voices and distant waves"
      ]
    },
    "paragraphs": [
      "The hotel is a reflection of the era, a blend of elegance and the harsh realities of wartime life. Guests arrive weary from travel, each carrying their own burden of secrets and sorrows. The sound of waves crashing against the rocky shore serves as both a comfort and a menace, reminding all that isolation can breed desperation. With every passing hour, the tension in the air thickens, as if the ocean itself is holding its breath, waiting for the storm to break.",
      "A pervasive sense of unease fills the hotel, where the laughter of guests is undercut by the unspoken fears of the day. As night descends, shadows creep into the corners, and the flickering lights seem to dim in sympathy with the growing dread. The scent of the sea mingles with the warmth of the hearth, creating an atmosphere both cozy and foreboding. Here, amidst the whispers of the past and the crashing waves, a mystery unfolds, drawing all who enter deeper into its grip."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Private Beach Cove",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "Secluded cove with jagged rocks and shifting sands; a battered lifeboat lies half-buried in the sand.",
      "sensoryDetails": {
        "sights": [
          "dark waves lapping at the shore",
          "scattered seashells glistening in the sand",
          "weathered driftwood strewn about",
          "overcast sky casting a grey pall"
        ],
        "sounds": [
          "crashing waves echoing in the distance",
          "seagulls screeching overhead",
          "the whisper of wind through grass",
          "distant rumble of thunder"
        ],
        "smells": [
          "scent of wet seaweed",
          "briny air with undertones of decay",
          "fresh rain on sand",
          "damp earth after a storm"
        ],
        "tactile": [
          "cold, wet sand underfoot",
          "sharp edges of broken shells",
          "chill breeze biting at skin",
          "smooth, slippery rocks"
        ]
      },
      "accessControl": "Limited access; only staff and select guests allowed to approach the cove, particularly after dusk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey mist shrouding the coastline",
            "puddles forming in the sand",
            "damp rocks glistening in the rain"
          ],
          "sounds": [
            "steady patter of rain on water",
            "dripping droplets from rocks",
            "soft thud of waves against the shore"
          ],
          "smells": [
            "fresh rain mingling with salt",
            "moist earth and sea grass",
            "damp wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadowy cliffs looming above",
            "dark clouds roiling in the distance",
            "faint outlines of distant ships"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "sudden flurry of wind",
            "waves crashing with urgency"
          ],
          "smells": [
            "sour sea air",
            "wet stones and driftwood",
            "lingering scent of rain"
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glistening horizon at sunset",
            "long shadows stretching across the sand",
            "stars beginning to peek through"
          ],
          "sounds": [
            "gentle lapping of waves",
            "whispers of the night wind",
            "distant laughter from the hotel"
          ],
          "smells": [
            "fresh, crisp sea air",
            "night-blooming flowers nearby",
            "cool earth"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Private Beach Cove, a hidden gem of the Ocean’s Edge Hotel, offers both beauty and danger. With its rugged coastline and tumultuous waters, it serves as a focal point for the unfolding mystery. The cove's isolation creates a chilling atmosphere, as the sounds of the crashing waves drown out any cries for help. Here, the secrets of the hotel guests converge, leading to a discovery that will alter the course of their lives forever.",
        "The shifting sands conceal more than just shells and driftwood; they hide the evidence of a crime that has shaken the hotel to its core. As the tide ebbs and flows, it leaves behind traces of what transpired in the shadows. The cove feels alive, a witness to the events that transpire around it, holding its secrets tightly as the winds whip around the cliffs."
      ]
    },
    {
      "id": "lounge_area",
      "name": "Lounge Bar",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Dimly lit room with leather armchairs and a polished mahogany bar; Art Deco murals adorn the walls.",
      "sensoryDetails": {
        "sights": [
          "soft glow of lamp light",
          "bottles glimmering on the bar shelves",
          "stacks of newspapers left on tables",
          "potted ferns lining the windows"
        ],
        "sounds": [
          "clinking glasses and low chatter",
          "crackling of the fireplace",
          "soft jazz music playing on the radio",
          "the distant hum of conversation"
        ],
        "smells": [
          "rich smell of aged whiskey",
          "scent of fresh coffee",
          "cigar smoke lingering in the air",
          "damp wool from patrons' coats"
        ],
        "tactile": [
          "smooth leather upholstery",
          "cool glass in hand",
          "warmth of the fireplace nearby",
          "soft carpet underfoot"
        ]
      },
      "accessControl": "Open to all guests, but staff monitoring for disturbances or heated conversations.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through rain-streaked windows",
            "empty chairs waiting for guests",
            "water droplets cascading down glass"
          ],
          "sounds": [
            "soft patter of rain against the roof",
            "occasional rustle of newspapers",
            "the crackling of the fireplace"
          ],
          "smells": [
            "fresh coffee brewing",
            "damp wood and leather",
            "scent of wet earth"
          ],
          "mood": "somber and reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the bar",
            "glow of the fireplace battling the gloom",
            "dim reflections in glass surfaces"
          ],
          "sounds": [
            "buzz of conversation rising and falling",
            "quiet laughter punctuating the air",
            "the clinking of ice in drinks"
          ],
          "smells": [
            "smoky hints of wood-fire",
            "scent of citrus from cocktails",
            "faint whiff of mildew from damp corners"
          ],
          "mood": "uneasy camaraderie"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft candlelight flickering on tables",
            "glint of stars through the windows",
            "shadows of guests mingling"
          ],
          "sounds": [
            "the gentle strum of a guitar",
            "murmurs of intimate conversations",
            "ice clinking in glasses"
          ],
          "smells": [
            "sweet aroma of desserts",
            "scent of polished wood",
            "freshly squeezed lemons"
          ],
          "mood": "intimate and conspiratorial"
        }
      ],
      "paragraphs": [
        "The Lounge Bar serves as the heart of the Ocean’s Edge Hotel, a gathering place for guests seeking warmth and companionship. Here, the atmosphere shifts with each visitor, reflecting their hidden fears and desires. The soft jazz music plays a soothing backdrop to the conversations that often veer into whispers as secrets are exchanged. The flickering light from the fireplace casts dancing shadows, creating an intimate setting that can quickly turn suspicious.",
        "As dusk descends, the bar fills with laughter and clinks of glass, but an air of tension lingers just beneath the surface. Conversations become more hushed, with glances exchanged that hold more meaning than words. Every patron seems to carry an unspoken story, and as the drinks flow, so do the secrets, weaving a complex tapestry of intrigue that binds guests together in a delicate balance of trust and deception."
      ]
    },
    {
      "id": "staff_kitchen",
      "name": "Staff Kitchen",
      "type": "interior",
      "purpose": "Food preparation and staff area",
      "visualDetails": "Functional space with stainless steel appliances and a large wooden table; cluttered with pots and pans.",
      "sensoryDetails": {
        "sights": [
          "gleaming metal surfaces and utensils",
          "boxes of rationed goods stacked high",
          "faint steam rising from pots"
        ],
        "sounds": [
          "clattering of dishes in the sink",
          "the hiss of boiling water",
          "voices of staff in hushed tones",
          "the creak of the floorboards"
        ],
        "smells": [
          "scent of frying onions",
          "freshly baked bread cooling",
          "sharp tang of vinegar",
          "faint aroma of cleaning supplies"
        ],
        "tactile": [
          "cool metal of utensils",
          "rough texture of burlap sacks",
          "warmth of a stove",
          "smoothness of wooden table"
        ]
      },
      "accessControl": "Restricted to kitchen staff and select management; guests not permitted unless accompanied by staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering in from small windows",
            "water droplets running down glass",
            "staff huddled around the stove"
          ],
          "sounds": [
            "soft patter of rain against the roof",
            "sizzle of bacon in the pan",
            "chatter of staff preparing breakfast"
          ],
          "smells": [
            "aroma of fresh coffee brewing",
            "scent of warm pastries",
            "sharp tang of lemon juice"
          ],
          "mood": "busy and industrious"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "cloudy light casting a gray hue",
            "half-prepared meals waiting on the counter",
            "shelves lined with canned goods"
          ],
          "sounds": [
            "the whir of a mixer",
            "clattering of pots",
            "low hum of conversation among staff"
          ],
          "smells": [
            "scent of simmering soup",
            "faint smell of burnt toast",
            "strong aroma of spices"
          ],
          "mood": "tense and hurried"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of overhead lights",
            "staff bustling about in preparation",
            "dishes stacked for cleaning"
          ],
          "sounds": [
            "clanging of pots and pans",
            "muffled laughter from the dining room",
            "the ticking of a wall clock"
          ],
          "smells": [
            "freshly cooked dinner filling the air",
            "scent of herbs and spices",
            "lingering aroma of cleaning products"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Staff Kitchen is the beating heart of the Ocean’s Edge Hotel, a place where chaos meets culinary creativity. Staff move swiftly, keeping to their roles while the atmosphere buzzes with urgency and purpose. In this confined space, whispers of gossip and laughter mingle with the aromas of hearty meals, creating a sense of camaraderie among the crew. Yet, beneath the surface, there are tensions; secrets are shared in fleeting glances and hushed tones, reminding all that the hotel is not just a refuge, but also a stage for intrigue.",
        "As evening approaches, the kitchen transforms into a whirlwind of activity, preparing for the influx of guests. The smells of food waft through the hotel, drawing patrons to the dining room, but within the kitchen, the atmosphere remains charged. Staff exchange knowing looks, aware of the events unfolding outside, where the sea thrums with a darker energy. The kitchen, while bustling with life, becomes a hotbed for secrets, where every cutting board and pot holds the potential for revelation."
      ]
    }
  ],
  "note": "",
  "cost": 0.0046288588500000005,
  "durationMs": 85636
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1946,
    "month": "November",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast skies",
      "cool breezes",
      "occasional rain showers"
    ],
    "daylight": "Daylight wanes early, with sunset around five o'clock, casting long shadows in the late afternoon.",
    "time_of_day_of_crime": "Late evening — between eight and ten o'clock at night, as guests gather or retreat to their rooms.",
    "holidays": [
      "Thanksgiving (November 28)"
    ],
    "seasonalActivities": [
      "fall harvest festivals",
      "preparation for Thanksgiving dinners",
      "coastal walks along the beach to enjoy the crisp air"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "crisp white dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed jacket",
        "corduroy trousers",
        "wool sweaters"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "wristwatch with a metal strap"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a fitted waist",
        "pearl necklace",
        "duster coat"
      ],
      "casual": [
        "tweed skirt",
        "cashmere cardigan",
        "blouse with lace details"
      ],
      "accessories": [
        "felt hat adorned with a ribbon",
        "matching handbag",
        "gloves"
      ]
    },
    "trendsOfTheMoment": [
      "bold patterns in clothing",
      "increased use of synthetic fabrics",
      "military-inspired fashion elements"
    ],
    "socialExpectations": [
      "men still expected to wear hats outdoors",
      "women encouraged to wear dresses even in casual settings",
      "formal dining etiquette is still strictly observed"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "United Nations establishes the International Military Tribunal for the Far East",
      "Winston Churchill delivers his 'Iron Curtain' speech in the U.S.",
      "British Prime Minister Clement Attlee announces a nationalization of major industries"
    ],
    "politicalClimate": "A tense atmosphere as nations adjust to post-war realities and rebuild, with the Cold War beginning to cast a long shadow.",
    "economicConditions": "Struggling economies, rationing still in place for many goods, but signs of recovery with the Marshall Plan beginning to take effect in Europe.",
    "socialIssues": [
      "housing shortages exacerbated by returning soldiers",
      "racial tensions rising in urban areas",
      "women's rights movements gaining traction"
    ],
    "internationalNews": [
      "tensions rising in Palestine as Jewish immigration increases",
      "strikes in various European countries over labor disputes"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Duke Ellington's jazz compositions",
        "Frank Sinatra's popular ballads"
      ],
      "films": [
        "'It's a Wonderful Life'",
        "'The Best Years of Our Lives'",
        "'Notorious'"
      ],
      "theater": [
        "'Annie Get Your Gun'",
        "'Carousel'",
        "'The King and I'"
      ],
      "radio": [
        "The Jack Benny Program",
        "Fibber McGee and Molly",
        "The Shadow"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'The Stranger' by Albert Camus",
        "'Animal Farm' by George Orwell"
      ],
      "popularGenres": [
        "detective fiction",
        "post-war literature",
        "science fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "early computer prototypes",
        "improvements in jet engine technology"
      ],
      "commonDevices": [
        "bicycles for transportation",
        "wireless radios for entertainment",
        "early black-and-white televisions"
      ],
      "emergingTrends": [
        "increased automation in factories",
        "rise of consumer goods marketing",
        "adoption of plastics in household items"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: three pence",
        "Movie ticket: one shilling"
      ],
      "commonActivities": [
        "family gatherings for Thanksgiving",
        "community events celebrating the harvest",
        "visiting local markets"
      ],
      "socialRituals": [
        "Sunday church services",
        "weekly family dinners",
        "participation in local charity events"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing mobility for the working class",
      "the middle class expanding due to wartime jobs",
      "lingering class distinctions in social settings"
    ],
    "gender": [
      "women encouraged to work but still expected to manage the home",
      "traditional roles in marriage still prevalent",
      "growing recognition of women's contributions during the war"
    ],
    "race": [
      "increasing awareness of civil rights issues",
      "racial segregation still a norm in many areas",
      "growing tensions in urban centers"
    ],
    "generalNorms": [
      "formal etiquette in public settings",
      "importance of community involvement",
      "conformity to social roles expected"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and sea salt fills the air, mingling with the faint aroma of wood smoke from nearby chimneys.",
    "The sound of waves crashing against the shore echoes in the distance, a reminder of the coastal setting as clouds loom overhead.",
    "A chill in the air carries whispers of gossip and tension among hotel guests, each wary of the secrets that lie beneath their polished exteriors."
  ],
  "paragraphs": [
    "On a dreary November evening in 1946, the coastal hotel stands as a refuge against the encroaching cold, its overcast skies hinting at the rain to come. Guests gather in the dimly lit lobby, their conversations punctuated by the occasional crackle of a radio broadcasting news of international tensions and domestic unease. The scent of wood smoke mingles with the salty breeze, setting a backdrop of unease that mirrors the memories of wartime struggles still fresh in many minds. As the sun sinks low, casting long shadows across the lobby, the atmosphere thickens with suspense — a perfect stage for the unfolding mystery.",
    "Fashion trends of the time are evident as guests navigate the hotel corridors; men in tailored navy suits, their fedoras a nod to a bygone era of formality, while women don tea-length dresses with delicate pearl necklaces, their carefully styled hair framing faces marked by the weight of recent history. The influence of the war is palpable, reflected in the bold patterns and military-inspired elements of their clothing. Each outfit tells a story, a blend of resilience and the desire for normalcy in a world still grappling with the aftermath of conflict.",
    "Daily life in November 1946 is marked by preparation for Thanksgiving, with families scrambling to secure turkeys and canned goods still rationed from the war. The chatter of community events fills the air, as neighbors gather to celebrate the harvest, a bittersweet reminder of what was lost and what is hoped for in the future. Prices reflect the ongoing recovery, with a loaf of bread costing four pence, a testament to the economic conditions still felt by many. In this intricate tapestry of life, class distinctions linger, but the shared experiences of war have begun to blur the lines, creating a complex social fabric ripe for exploration."
  ],
  "note": "",
  "cost": 0.00107134665,
  "durationMs": 14035
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a seaside hotel for a wartime reunion unites former soldiers, nurses, and their families, while the looming threat of social change and the specter of past traumas create an atmosphere of tension and mistrust.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII has shifted class dynamics, with women stepping into roles traditionally held by men, creating a complex interplay of power, loyalty, and social expectation among the guests."
  },
  "setting": {
    "location": "A modest seaside hotel featuring Art Deco architecture",
    "institution": "hotel",
    "weather": "overcast with a chance of rain"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a tidal-drowning method, where the flood-tide timetable and shifting sea level fix — and falsify — the window in which the victim could have drowned."
}

### LOCKED_FACTS
[
  {
    "id": "high_tide_time",
    "value": "a quarter past eleven",
    "description": "The exact time of high tide when the victim could have drowned."
  },
  {
    "id": "tide_rise_rate",
    "value": "three feet per hour",
    "description": "The rate at which the tide rises, impacting the timing of the drowning."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 8,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
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
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "testimonial"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "supporting",
      "category": "elimination"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_2",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_3",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
