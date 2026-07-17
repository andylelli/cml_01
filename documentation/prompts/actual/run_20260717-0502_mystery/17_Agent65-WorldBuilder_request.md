# Actual Prompt Record

- Run ID: `mystery-1784264575381`
- Project ID: ``
- Timestamp: `2026-07-17T05:07:18.525Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `86ffe554321c14fd`

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
    "title": "The Delayed Tides of Deceit",
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
      "subtype": "delayed-action poisoning"
    }
  },
  "death_method": "poisoned with a botanical toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charming socialite",
      "private_secret": "In financial distress due to gambling debts",
      "motive_seed": "Financial stability",
      "motive_strength": "moderate",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Her reputation and social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "35-45",
      "role_archetype": "Medical professional",
      "relationships": [
        "Friend of Eleanor"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Has a hidden romantic interest in Eleanor",
      "motive_seed": "Jealousy",
      "motive_strength": "weak",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Treating Eleanor"
      ],
      "behavioral_tells": [
        "Nervous when questioned about Eleanor"
      ],
      "stakes": "Emotional distress",
      "evidence_sensitivity": [
        "Medical records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Military officer",
      "relationships": [
        "Old friend of Eleanor"
      ],
      "public_persona": "Heroic war veteran",
      "private_secret": "Has a gambling problem",
      "motive_seed": "Financial gain",
      "motive_strength": "moderate",
      "alibi_window": "7 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Visiting Eleanor to discuss finances"
      ],
      "behavioral_tells": [
        "Avoids eye contact when questioned"
      ],
      "stakes": "Financial ruin",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Hotel staff",
      "relationships": [
        "Works closely with Eleanor"
      ],
      "public_persona": "Diligent maid",
      "private_secret": "Knows about Eleanor's debts",
      "motive_seed": "Desire for revenge on Eleanor for past insults",
      "motive_strength": "moderate",
      "alibi_window": "7 PM to 9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Cleaning Eleanor's room"
      ],
      "behavioral_tells": [
        "Defensive when questioned about Eleanor"
      ],
      "stakes": "Personal reputation",
      "evidence_sensitivity": [
        "Cleaning schedule"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Guest",
      "relationships": [
        "Acquaintance of Eleanor"
      ],
      "public_persona": "Elegant socialite",
      "private_secret": "In a feud with Eleanor over social standing",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "low",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Fidgety when discussing Eleanor"
      ],
      "stakes": "Social status",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [
        "Investigating Eleanor's death"
      ],
      "public_persona": "Sharp-witted investigator",
      "private_secret": "Has a history with the hotel",
      "motive_seed": "Professional integrity",
      "motive_strength": "strong",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Solving the case",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
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
      "summary": "In the glamour of a seaside hotel, Eleanor Voss succumbs to a delayed-action poison, prompting Detective Hugo Vane to unravel a web of jealousy, financial distress, and hidden motives among the guests and staff."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on poison, natural, and half-empty to expose the false timing.",
      "delivery_path": [
        {
          "step": "The poison is administered through a drink served by Beatrice Quill, timed to activate after several hours."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor Voss's death is ruled a murder, revealing Beatrice Quill as the culprit."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss died from a heart attack due to her known health issues.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses recall Eleanor often complaining of chest pains and fatigue.",
    "what_it_hides": "The true cause of death, which is the delayed-action poison administered by Beatrice."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses claim they saw Captain Hale arguing with Eleanor the night she died.",
      "Captain Hale was seen leaving the hotel shortly after Eleanor's death."
    ],
    "the_one_flaw": "Captain Hale had a solid alibi, confirmed by multiple witnesses who saw him at a charity event during the time of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A bottle of heart medication found in Eleanor's room.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The medication was prescribed to Eleanor for her heart condition, but it was not the cause of her death.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A broken clock found in the hotel lobby.",
      "points_at_suspect": "Sylvia Trent",
      "innocent_explanation": "The clock was damaged during a storm that evening, unrelated to the timing of Eleanor's death.",
      "resolved_in_chapter": 5
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
    "rationale": "All suspects were present at the hotel during the time of the murder, and no outsiders had access."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Eleanor's last known interaction at 9 PM",
        "Death at 11 PM"
      ],
      "windows": [
        "8 PM to 10 PM"
      ],
      "contradictions": [
        "Dr. Finch's claim of being with Eleanor during the time of death conflicts with witness accounts placing him elsewhere."
      ]
    },
    "access": {
      "actors": [
        "Beatrice Quill"
      ],
      "objects": [
        "Poison bottle",
        "Eleanor's drink"
      ],
      "permissions": [
        "Staff access to guest rooms"
      ]
    },
    "physical": {
      "laws": [
        "The poison requires time to build up to a lethal dose"
      ],
      "traces": [
        "Footprints leading from the beach to Eleanor's room"
      ]
    },
    "social": {
      "trust_channels": [
        "Friendship between Eleanor and Dr. Finch"
      ],
      "authority_sources": [
        "Hotel management's trust in Beatrice Quill"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "A half-empty bottle of poison found in Beatrice's cleaning cart.",
        "correction": "This poison's presence in Beatrice's cart suggests she had access to it.",
        "effect": "Narrows suspect pool by implicating Beatrice Quill.",
        "required_evidence": [
          "Bottle found in Beatrice's cart",
          "Eleanor's drink was served by Beatrice"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report seeing Beatrice enter Eleanor's room shortly before her death.",
        "correction": "Beatrice had the opportunity to administer the poison while cleaning.",
        "effect": "Eliminates other suspects by confirming Beatrice's access.",
        "required_evidence": [
          "Staff schedule showing Beatrice on duty that evening",
          "Witness statements about Beatrice's presence in the room"
        ],
        "reader_observable": true
      },
      {
        "observation": "Test results reveal Eleanor had high levels of the poison in her bloodstream.",
        "correction": "The presence of poison directly contradicts the heart attack theory.",
        "effect": "Eliminates the assumption of natural causes.",
        "required_evidence": [
          "Toxicology report confirming poison levels",
          "Medical records showing Eleanor's condition prior to death"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A staged reenactment where Beatrice is asked to serve a similar drink to a guest while the detective observes her actions.",
    "knowledge_revealed": "The poison is identified through residual tests on the drink served by Beatrice.",
    "pass_condition": "If the same poison is found in the drink served, it confirms Beatrice's means.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_1",
      "clue_2",
      "clue_fp_contradiction_step_2",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The poison bottle (early) and witness testimony (mid) suggest Beatrice's access. Step 2: Toxicology results (early) eliminate natural causes. Step 3: The reenactment (discriminating test) confirms Beatrice's connection to the poison."
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
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by multiple witnesses",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm his presence at a charity event during the murder time.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi corroborated by hotel staff.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence showing Beatrice's guilt"
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
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
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Discriminating test execution"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, the charismatic manager of the seaside hotel, is known for her warm hospitality, yet beneath her polished exterior lies a web of hidden debts and familial expectations.",
    "publicPersona": "Eleanor is revered by the guests for her charming demeanor and dedication to service, often seen orchestrating events that make the hotel a favored escape for weary travelers.",
    "privateSecret": "Beneath the surface of her welcoming smile, Eleanor is grappling with crippling debts incurred during the war, a burden she has kept secret from her colleagues and guests alike.",
    "motiveSeed": "Her potential inheritance, tied to the hotel's legacy, could be a beacon of hope amidst her financial turmoil.",
    "motiveStrength": "moderate",
    "alibiWindow": "She was last seen in the hotel dining room during the evening, attending to guests.",
    "accessPlausibility": "Eleanor had access to all areas of the hotel, making her presence felt in every corner.",
    "stakes": "Her family's legacy and the reputation of the hotel hang in the balance, with every whisper of scandal threatening her carefully constructed world.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Eleanor speaks with a gentle cadence, often punctuating her sentences with soft laughter. She enjoys using metaphors related to the sea, reflecting her environment.",
    "signatureTic": "‘After all, the tide will always turn.’",
    "internalConflict": "Eleanor battles feelings of inadequacy and guilt, aware that her financial struggles might soon be exposed, potentially ruining her reputation and the hotel she cherishes.",
    "personalStakeInCase": "Eleanor's demise would not only shatter her dreams but also jeopardize the future of the hotel, a place that symbolizes her family's history.",
    "paragraphs": [
      "Eleanor Voss is the heart and soul of the seaside hotel, a beacon of warmth amidst the brisk coastal winds. Guests flock to her, drawn not just by the allure of the ocean but by the charm of her presence. She knows their names, their preferences, and even their secrets, weaving an intricate tapestry of hospitality that keeps the hotel thriving. Yet, hidden behind her radiant smile lies a tarnished reality, one that would shatter the very image she has crafted.",
      "The war has left scars that run deeper than the ocean's abyss, leaving Eleanor burdened with debts that cling to her like barnacles to a ship's hull. She has become adept at disguising her financial woes, masking them under layers of charm and professionalism. But as whispers of her struggles begin to surface, she feels the weight of her secrets threatening to pull her under. The tide of her life is shifting, and she can sense the danger lurking just beneath the surface.",
      "Despite her outward confidence, Eleanor wrestles daily with the fear of exposure. The hotel's reputation is her legacy, and she is determined to protect it at all costs. In her heart, she knows that if her debts were to come to light, it would not only tarnish her name but also destroy the very foundation of her family's establishment. She dreams of a day when the burden will be lifted, yet the thought of inheritance is laced with dread—a reminder of the ties that bind her to her past.",
      "As the sun sets on the horizon, casting long shadows through the hotel corridors, Eleanor's fate hangs precariously in the balance. She stands at the precipice of a storm, where her choices could lead to redemption or ruin. With every decision, she risks losing not just her reputation but the very essence of who she is. In a world where trust is as fickle as the tides, Eleanor must navigate the treacherous waters of deceit that threaten to engulf her."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, the town's esteemed physician, harbors a dark side that could unravel her carefully cultivated reputation as a charitable healer.",
    "publicPersona": "Known for her philanthropic endeavors and medical expertise, Dr. Finch is a staple in the community, often seen as a compassionate figure dedicated to the wellbeing of her patients.",
    "privateSecret": "In the shadows of her practice, she conducts illegal experiments, driven by an insatiable need to prove her superiority over her male counterparts in the medical field.",
    "motiveSeed": "Eleanor's threat to expose her unethical practices after receiving treatment becomes a catalyst for Mallory's desperate actions.",
    "motiveStrength": "strong",
    "alibiWindow": "Dr. Finch claims to have been at the hospital from 8 PM until 10 PM, surrounded by patients and staff.",
    "accessPlausibility": "While her alibi is plausible, her medical knowledge gives her the means to manipulate situations to her advantage.",
    "stakes": "The very core of her career and reputation hangs in the balance, as exposure could lead to her professional downfall.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a clinical precision, often punctuating her sentences with sardonic remarks. She has a habit of using medical jargon even in casual conversations, which can alienate her listeners.",
    "signatureTic": "‘In the grand scheme of things, it’s merely a matter of perspective.’",
    "internalConflict": "Mallory is torn between her ambition and the moral implications of her actions, constantly grappling with the fear that her secrets will be unveiled, leading to her professional ruin.",
    "personalStakeInCase": "The threat of Eleanor exposing her unethical practices not only jeopardizes her career but also her standing as a respected figure in the community.",
    "paragraphs": [
      "Dr. Mallory Finch strides through the hotel like a queen surveying her domain, her presence commanding respect and admiration. With a sharp mind and a sharper tongue, she has built a reputation as the town's most trusted physician. Yet, beneath her polished facade lies a tumultuous sea of ambition and desperation. Mallory believes that to be a woman in her field requires not just skill, but a ruthless edge that she is willing to embrace, even if it means crossing ethical lines.",
      "In the dimly lit corners of her office, Mallory conducts experiments that would make most doctors recoil in horror. Driven by a desire to outshine her male colleagues, she pushes the boundaries of her practice, convinced that the ends justify the means. Each success feeds her ego, but the weight of her secret looms larger with every passing day. The fear of exposure gnaws at her, a constant reminder that her carefully constructed empire is built on shaky ground.",
      "When Eleanor Voss, her recent patient, begins to question her methods, Mallory feels the walls closing in. The threat of exposure is a specter that haunts her, compelling her to act with increasing desperation. She recognizes that losing Eleanor's goodwill could unravel everything she has worked for, her career hanging by a thread. In a world where reputation is everything, Mallory is prepared to do whatever it takes to protect her secrets, even if it means committing the unthinkable.",
      "As the evening darkens, Mallory finds herself at a crossroads, weighing her ambitions against the moral decay of her actions. The stakes are higher than ever, and the game of cat and mouse has begun. With Eleanor's life hanging in the balance, Mallory must navigate the treacherous waters of deceit, where one misstep could shatter her world. The clock is ticking, and she knows that the truth, once unleashed, can be a formidable adversary."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, carries the weight of his past, haunted by memories that threaten to consume him, while his dignified exterior masks a turbulent interior.",
    "publicPersona": "With a commanding presence and a wealth of war stories, Captain Hale is a respected figure among the guests, often seen as a beacon of wisdom and strength.",
    "privateSecret": "His struggle with PTSD and a past marred by wartime atrocities leave him vulnerable, blackmailed over secrets that could destroy his reputation.",
    "motiveSeed": "Eleanor's discovery of his blackmail situation becomes a catalyst for his actions, as she threatens to expose him.",
    "motiveStrength": "compelling",
    "alibiWindow": "He was playing cards with guests from 9 PM until 11 PM, a seemingly solid alibi.",
    "accessPlausibility": "As a respected guest, Captain Hale had free access to all areas of the hotel, making it easy for him to maneuver.",
    "stakes": "His integrity and freedom are at stake, with the potential fallout from exposure threatening to unravel his life.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Ivor speaks in a slow, deliberate manner, often punctuating his stories with self-deprecating humor. He has a tendency to reflect on the past, using anecdotes to illustrate his points.",
    "signatureTic": "‘Ah, the follies of youth, how they haunt us.’",
    "internalConflict": "Ivor grapples with feelings of guilt and shame over his past actions, wrestling with the fear that his secrets will come to light and that he will be judged for them.",
    "personalStakeInCase": "The potential exposure of his past threatens not only his reputation but also the fragile peace he has built in his retirement.",
    "paragraphs": [
      "Captain Ivor Hale is a man of the sea, a retired naval officer whose life has been marked by valor and sacrifice. Guests at the hotel admire him, captivated by his tales of bravery and the camaraderie of war. Yet, behind the dignified facade lies a man tormented by the ghosts of his past. Ivor carries the weight of memories that threaten to drown him, memories of choices made in the heat of battle that continue to haunt him long after the guns have fallen silent.",
      "The scars of war run deep, and Ivor struggles with the demons of PTSD that claw at his mind. He is a man divided, seeking solace in the stories he tells while battling the reality of his experiences. The blackmailer who preys on his vulnerabilities knows just how to manipulate him, using his past as leverage to extract favors. When Eleanor, through her keen observations, begins to piece together the truth, Ivor feels the walls closing in, a tempest brewing within.",
      "In the evenings, as the hotel buzzes with laughter and camaraderie, Ivor finds himself playing cards with guests. It is a semblance of normalcy, a distraction from the turmoil that simmers beneath. Yet, he knows that Eleanor's discovery could unravel everything he has built. The threat of exposure looms large, and he feels the desperate urge to protect his integrity, even if it means resorting to dire measures. The stakes have never been higher, and the weight of his secrets feels heavier than the anchor of a battleship.",
      "As the night deepens, Ivor stands at a crossroads, torn between the man he has become and the soldier he once was. The tides of fate are shifting, and he knows that one wrong move could lead to his undoing. In a world where honor is often overshadowed by deceit, Ivor must confront his past, facing the consequences of his actions before they consume him entirely. The battle within him rages on, and the question remains: can he find redemption before it is too late?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, the ambitious hotel receptionist, finds herself at the intersection of loyalty and ambition, harboring resentment for the woman she believes has stifled her career.",
    "publicPersona": "Seen as a friendly and eager-to-please employee, Beatrice is often the first point of contact for guests, embodying the hotel's welcoming spirit.",
    "privateSecret": "Underneath her sunny disposition, Beatrice harbors deep-seated resentment towards Eleanor for overlooking her for promotions, believing her hard work has been in vain.",
    "motiveSeed": "Her belief that Eleanor actively sabotaged her career propels Beatrice into a dangerous mindset, seeing her as an obstacle to her ambitions.",
    "motiveStrength": "moderate",
    "alibiWindow": "She tidied the lobby from 8 PM until 9 PM before claiming a break.",
    "accessPlausibility": "As a receptionist, Beatrice has access to various areas of the hotel, allowing her to navigate the premises with ease.",
    "stakes": "Her career advancement and sense of self-worth are on the line, pushing her towards increasingly desperate actions.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks with a youthful eagerness, often punctuating her words with exaggerated enthusiasm. She has a tendency to drop sarcastic remarks when she feels slighted.",
    "signatureTic": "‘Oh, the things we do for success!’",
    "internalConflict": "Beatrice is torn between her desire for recognition and her loyalty to Eleanor, feeling the pressure of ambition pull her in conflicting directions.",
    "personalStakeInCase": "The fallout from Eleanor's demise could either propel Beatrice into a position of power or leave her feeling more insignificant than ever.",
    "paragraphs": [
      "Beatrice Quill stands behind the reception desk, a smile plastered on her face as she greets guests with an enthusiasm that could light up the darkest of rooms. She embodies the spirit of the hotel, always eager to assist and please. Yet, beneath the surface, a storm brews. Beatrice feels overlooked, her hard work dismissed in favor of Eleanor's polished charm. Each day, she battles the gnawing resentment of being passed over for promotions, believing that Eleanor has been the architect of her stifled ambitions.",
      "As she tidies the lobby, Beatrice's mind races with thoughts of what could have been. She is acutely aware of the power dynamics at play, and the perception that she is merely a cog in the machine angers her. The idea that Eleanor has actively sabotaged her career fuels a fire within her, pushing her to consider drastic measures. In a world where ambition often tramples over loyalty, Beatrice finds herself teetering on the edge of a precipice, where one misstep could lead to a downfall she cannot afford.",
      "During her shifts, Beatrice often resorts to sardonic humor to cope with her frustrations. She cracks jokes about the guests and their quirks, yet the laughter feels hollow. The pressure to succeed weighs heavily on her shoulders, and she begins to fantasize about the power she could wield if only Eleanor were out of the picture. The thought is intoxicating, yet the moral implications gnaw at her conscience. She is caught in a web of conflicting desires, yearning for recognition while grappling with the loyalty she has towards her employer.",
      "As the evening unfolds, Beatrice's internal battle intensifies. The line between ambition and betrayal blurs, and she finds herself contemplating the unthinkable. The stakes are high, and the potential fallout from Eleanor's demise could either elevate Beatrice to the heights of success or plunge her into the depths of despair. In the shadows of the hotel, Beatrice stands at a crossroads, her future hanging in the balance as she contemplates the price of ambition."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a determined journalist, is driven by her ambition and the desperate need for a breakthrough story, yet her ethics are put to the test when her path crosses with Eleanor's.",
    "publicPersona": "As a sharp and insightful journalist, Sylvia is known for her investigative prowess, often exposing corruption and injustice in her articles.",
    "privateSecret": "Financial struggles since the war have left Sylvia desperate for a big story to revitalize her career, pushing her to consider unethical avenues.",
    "motiveSeed": "Eleanor's refusal to grant her an interview could be the tipping point for Sylvia, leading her to take drastic measures.",
    "motiveStrength": "strong",
    "alibiWindow": "She claimed to be in her room writing from 9 PM onward, a solitary endeavor.",
    "accessPlausibility": "While she is a hotel guest, her access to restricted areas is limited, making her involvement less plausible.",
    "stakes": "Her professional credibility and financial stability are on the line, pushing her to the brink of ethical compromise.",
    "humourStyle": "blunt",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a directness that can be jarring, often cutting through pleasantries with sharp observations. She tends to use concise language, emphasizing her points with conviction.",
    "signatureTic": "‘The truth is a double-edged sword.’",
    "internalConflict": "Sylvia grapples with the tension between her drive for success and the moral implications of her actions, fearing that her ambition might lead her to a dark place.",
    "personalStakeInCase": "The fallout from Eleanor's demise could either provide Sylvia with her much-needed story or plunge her deeper into obscurity.",
    "paragraphs": [
      "Sylvia Trent strides into the hotel with purpose, her eyes scanning the room for any hint of a story. As an investigative journalist, she thrives on uncovering the truth, but the weight of financial struggles hangs heavy on her shoulders. The war has left her scrambling for assignments, and the desperation for a breakthrough story gnaws at her. She is determined to make her mark, yet the ethics of her profession begin to blur as she contemplates the lengths she might go to for success.",
      "When Eleanor Voss declines her request for an interview, Sylvia feels the sting of rejection. To her, it's not just a missed opportunity; it's a challenge to her integrity. She knows that Eleanor's connections could expose corruption within the hotel, a story that could catapult her career back into the limelight. The refusal ignites a fire within Sylvia, pushing her to consider whether bending the rules might be worth it. The truth is a double-edged sword, and she must decide how much she is willing to sacrifice.",
      "Sylvia's blunt demeanor often alienates those around her, yet it is this very quality that drives her ambition. She speaks her mind, cutting through the layers of pleasantries that others hide behind. But as she sits in her room, pen in hand, the weight of her choices bears down on her. The solitude of her writing is interrupted by thoughts of what Eleanor's demise could mean for her career. The stakes are high, and she knows that the line between right and wrong is perilously thin.",
      "As night falls, Sylvia finds herself at a crossroads, torn between her ambition and her conscience. The potential fallout from Eleanor's demise could either be her ticket back to relevance or a plunge into ethical despair. In a world where the truth can be manipulated, Sylvia must confront the darkness within herself, weighing her quest for success against the moral compass that has guided her thus far. The tide of her fate is shifting, and she stands on the brink of a decision that could change everything."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a well-connected local businessman, navigates the treacherous waters of reputation and ambition, harboring secrets that could unravel his carefully curated image.",
    "publicPersona": "As a generous benefactor to the hotel, Hugo is seen as a pillar of the community, often engaging with guests and ensuring their needs are met.",
    "privateSecret": "His investments in the hotel are failing, and he has been relying on Eleanor's influence to salvage his business, which puts him in a precarious position.",
    "motiveSeed": "The potential inheritance tied to Eleanor could provide a lifeline for his failing ventures.",
    "motiveStrength": "moderate",
    "alibiWindow": "He was present in the hotel during the evening, mingling with guests.",
    "accessPlausibility": "As a well-connected businessman, Hugo has easy access to all areas of the hotel.",
    "stakes": "His reputation and the future of his investments are on the line, pushing him to consider drastic measures.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks with a relaxed charm, often using anecdotes to illustrate his points. He has a tendency to lean into humor, deflecting tension with light-hearted banter.",
    "signatureTic": "‘Ah, but that’s just business, isn’t it?’",
    "internalConflict": "Hugo grapples with the fear of failure, as the prospect of losing everything he has built looms large, forcing him to confront the consequences of his ambition.",
    "personalStakeInCase": "The implications of Eleanor's demise could either rescue his failing investments or seal his fate as a pariah in the community.",
    "paragraphs": [
      "Hugo Vane is the embodiment of charm, weaving through the hotel like a seasoned diplomat, his laughter echoing in the hallways. As a local businessman, he has cultivated an image of generosity, often seen as the benefactor who ensures the hotel's continued success. Yet, beneath the polished exterior lies a man wrestling with the specter of failure. His investments are crumbling, and he knows that Eleanor's support is his last lifeline, a thread that could either save him or pull him under.",
      "In conversations, Hugo employs observational humor, using anecdotes to keep the mood light and engaging. He is adept at deflecting tension, a skill honed from years of navigating the complexities of business relationships. However, the facade is beginning to crack. The pressure of his failing ventures looms over him like a dark cloud, and he can feel the whispers of doubt creeping into his mind. The stakes are higher than ever, and he knows that Eleanor's potential inheritance could be his salvation.",
      "As the evening unfolds, Hugo finds himself mingling with guests, each laugh a temporary reprieve from the gnawing anxiety that threatens to consume him. He is aware that his reputation is on the line, and the community's perception of him hangs by a thread. In a world where success is measured by wealth, losing everything he has built would be a fate worse than death. The thought of becoming a pariah in the very community he has worked to nurture sends chills down his spine.",
      "In the shadows of the hotel, Hugo stands at a crossroads, the weight of his choices pressing heavily upon him. The implications of Eleanor's demise could either provide the lifeline he desperately needs or seal his fate as an outcast. As he navigates the treacherous waters of ambition and reputation, Hugo must confront the darkness that lurks beneath his charming exterior. The tides of fate are shifting, and he knows that one wrong move could change everything."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Grand Azure Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand Art Deco hotel overlooking the churning sea, where glamour meets the shadows of wartime wear.",
    "visualDescription": "The Grand Azure Hotel features sweeping curves and elegant geometric lines typical of Art Deco design, with tarnished brass fixtures and a faded mural depicting serene seascapes. The lobby is adorned with a cracked marble floor and plush, albeit worn, furnishings that whisper of past splendor. Large glass windows frame the tumultuous sea, offering a view of crashing waves and distant ships, while the scent of salt hangs in the air.",
    "atmosphere": "A tense and foreboding ambience, filled with the echoes of whispered conversations and the distant roar of the ocean.",
    "paragraphs": [
      "As guests step through the heavy glass doors of The Grand Azure Hotel, they are greeted by an intoxicating blend of nostalgia and unease. The lobby, with its high ceilings and muted colors, exudes an air of faded elegance, while the sound of the crashing waves outside serves as a constant reminder of the storm brewing both in the skies and among the guests. The atmosphere is thick with tension, as the lingering effects of the war cast a pall over the once-celebrated establishment.",
      "Chandeliers hang above, their light flickering intermittently as the wind howls outside, rattling the windows. The once-proud furnishings, now displaying signs of age, bear witness to the countless stories and secrets exchanged within these walls. Guests move cautiously, aware of the narrow hallways that lead to their rooms, each turn offering a glimpse of furtive glances and hushed tones.",
      "In the evenings, the soft hum of the radio fills the air, broadcasting distant news of the world beyond the hotel’s confines. Guests gather in the lounge, sipping rationed spirits, their laughter tinged with an undercurrent of suspicion. The isolation of the coastal location heightens their sense of vulnerability, as the storm outside intensifies, cutting off any hope of outside assistance.",
      "The Grand Azure stands as a monument to a bygone era, its beauty marred by the scars of war, yet it remains a refuge for those seeking solace or escape. But beneath its glamorous facade lies a web of deceit, where the waves crash against the shore, echoing the hidden tensions that threaten to unravel the lives of all who stay within."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of coastal regions in the 1940s, creating a moody and tense environment.",
    "timeFlow": "Three days of mounting tension as guests navigate secrets and suspicions.",
    "mood": "Tense and suspenseful, with an air of distrust among guests due to recent events in the world.",
    "eraMarkers": [
      "Faded Art Deco furnishings",
      "Radio broadcasts of war news",
      "Rationed gasoline for travel",
      "Women in the workforce",
      "Limited access to outside communication"
    ],
    "sensoryPalette": {
      "dominant": "Salt air mixed with damp wood",
      "secondary": [
        "Faint perfume of fading glamour",
        "Cold metallic tang of the sea"
      ]
    },
    "paragraphs": [
      "The Grand Azure Hotel is steeped in an atmosphere of nostalgia, where the salty breeze mingles with the scent of damp wood and aged leather. As rain lashes against the windows, the sound of waves crashing becomes a haunting melody, echoing the turmoil within. The very air is thick with secrets, as guests navigate the hallways, their footsteps muffled by the plush carpeting, each corner shrouded in shadows that conceal more than just the decor.",
      "Distant voices murmur in the lounge, accompanied by the crackling of the radio broadcasting updates from the outside world. The flickering light of candle sconces casts a warm glow, contrasting with the chill that seeps through the walls, a reminder of the storm raging outside. The hotel feels like a sanctuary and a trap, an elegant prison where trust is as scarce as the rationed spirits served at the bar."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Broken Promenade",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A cracked stone walkway lined with weathered benches, overlooking the turbulent sea. The railing is splintered, and a solitary lantern flickers in the wind.",
      "sensoryDetails": {
        "sights": [
          "crashing waves against rocks",
          "dark clouds swirling overhead",
          "flickering lantern light",
          "distant silhouettes of ships",
          "scattered seaweed on the stones"
        ],
        "sounds": [
          "thunderous ocean roar",
          "howling wind through the railings",
          "crunch of gravel underfoot",
          "distant gulls crying",
          "dripping water from the rail"
        ],
        "smells": [
          "brine and seaweed",
          "wet stone and moss",
          "scent of rain on sand",
          "faint whiff of tobacco",
          "decaying driftwood"
        ],
        "tactile": [
          "cold metal of the railing",
          "rough stone underfoot",
          "wet chill of sea spray",
          "smoothness of a polished lantern",
          "pebbles shifting beneath shoes"
        ]
      },
      "accessControl": "Restricted to guests only during daylight hours; staff patrol after dusk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey mist rolling in",
            "water pooling on stones",
            "shadowy outlines of distant ships"
          ],
          "sounds": [
            "steady patter of rain",
            "waves crashing in rhythm",
            "soft whispers of the wind"
          ],
          "smells": [
            "fresh rain on sand",
            "damp earth and salt",
            "mildew from nearby rocks"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat, leaden sky",
            "waves frothing in agitation",
            "gulls circling above"
          ],
          "sounds": [
            "silence broken by waves",
            "creaking wood of the promenade",
            "a distant foghorn sounding"
          ],
          "smells": [
            "sour sea air",
            "wet driftwood",
            "smoky remnants of a nearby fire"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "waves sparkling under twilight",
            "shadows lengthening along the promenade"
          ],
          "sounds": [
            "the gentle lapping of water",
            "soft laughter from the hotel",
            "the distant tolling of a bell"
          ],
          "smells": [
            "sweet scent of blooming nightflowers",
            "freshness of the sea breeze",
            "faint aroma of grilled seafood"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Broken Promenade stands as a stark reminder of the ocean's might, with its cracked stones and splintered railings. The air is thick with the scent of salt and damp earth, while the relentless roar of the waves creates a backdrop of tension. This is where the guests gathered to escape the confines of the hotel, yet it is also where secrets were exchanged and dark intentions brewed.",
        "In the shadows of the flickering lantern, whispers of discontent and furtive glances abound. The solitude of the promenade offers both a refuge and a stage for deceit, where the crashing waves seem to drown out the truth. As the storm approaches, the atmosphere thickens, and the sense of dread settles in, foreshadowing the unraveling of hidden agendas."
      ]
    },
    {
      "id": "lounge",
      "name": "The Sapphire Lounge",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious lounge adorned with plush velvet seating and a grand piano in the corner. Art Deco patterns embellish the walls, while a large bay window offers an expansive view of the ocean.",
      "sensoryDetails": {
        "sights": [
          "gleaming piano keys",
          "plush velvet cushions",
          "glittering glassware on tables",
          "geometric wall patterns",
          "flickering candles casting shadows"
        ],
        "sounds": [
          "soft jazz playing from the piano",
          "murmurs of conversation",
          "clinking of glasses",
          "the rustle of silk dresses",
          "distant laughter"
        ],
        "smells": [
          "rich scent of cigar smoke",
          "hint of perfume in the air",
          "freshly polished wood",
          "cooked seafood from the kitchen",
          "faint aroma of coffee"
        ],
        "tactile": [
          "smoothness of polished tables",
          "softness of velvet upholstery",
          "cool glass of a drink",
          "warmth of a nearby fire",
          "roughness of the piano keys"
        ]
      },
      "accessControl": "Open to all guests, monitored by hotel staff during service hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through curtains",
            "raindrops streaming down windows",
            "empty chairs awaiting guests"
          ],
          "sounds": [
            "soft patter of rain on glass",
            "distant thunder rumbling",
            "the creaking of furniture"
          ],
          "smells": [
            "freshly brewed coffee",
            "moist air from outside",
            "the scent of damp wood"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "glistening glassware on tables",
            "flickering flames in the hearth"
          ],
          "sounds": [
            "soft jazz filling the air",
            "the rustle of newspapers",
            "a distant clock ticking"
          ],
          "smells": [
            "warm pastries from the kitchen",
            "scent of polished wood",
            "lingering perfume of guests"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off glass",
            "glimmer of stars outside",
            "guests mingling in elegant attire"
          ],
          "sounds": [
            "lively chatter and laughter",
            "the click of heels on the floor",
            "a soft tune from the piano"
          ],
          "smells": [
            "exotic spices from the kitchen",
            "freshly cut flowers",
            "the rich scent of whiskey"
          ],
          "mood": "vibrant yet cautious"
        }
      ],
      "paragraphs": [
        "The Sapphire Lounge is a sanctuary of elegance, where guests gather to sip cocktails and escape the weight of the world outside. The plush velvet seating invites relaxation, while the gentle strains of jazz from the piano create an intimate atmosphere. Yet, beneath the surface of laughter and conversation, an undercurrent of suspicion flows, as glances are exchanged, and secrets linger in the air like the faint scent of cigar smoke.",
        "As the evening unfolds, the lounge transforms into a stage for hidden agendas and whispered confessions. The flickering candlelight dances over the faces of the guests, revealing fleeting expressions of joy and worry. Each clink of glass echoes a promise or a threat, as the tension thickens with every passing moment, leaving all who linger on the edge of their seats."
      ]
    },
    {
      "id": "library",
      "name": "The Reading Room",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A dimly lit room lined with tall bookshelves filled with dusty tomes, a heavy oak table at the center surrounded by mismatched chairs.",
      "sensoryDetails": {
        "sights": [
          "dust motes floating in the air",
          "faded leather-bound books",
          "a large globe in the corner",
          "flickering candlelight",
          "shadows pooling in corners"
        ],
        "sounds": [
          "soft rustle of pages turning",
          "the creak of old wood",
          "distant whispers from the hallway",
          "the ticking of an old clock",
          "the sigh of settling books"
        ],
        "smells": [
          "musty scent of old paper",
          "beeswax from candles",
          "faint aroma of polished wood",
          "dampness from the sea air",
          "the tang of ink"
        ],
        "tactile": [
          "rough texture of old pages",
          "smoothness of polished table",
          "cold metal of a candle holder",
          "warmth of a woolen blanket",
          "softness of a worn armchair"
        ]
      },
      "accessControl": "Locked after hours; accessible to guests during daylight with staff supervision.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through rain-soaked windows",
            "shadows shifting with the light",
            "wet books on the table"
          ],
          "sounds": [
            "steady rain tapping on glass",
            "the rustle of pages turning",
            "the soft drip of water"
          ],
          "smells": [
            "fresh scent of rain",
            "damp paper",
            "the mustiness of old books"
          ],
          "mood": "reflective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadowy corners of the room",
            "dim light casting long shadows",
            "the glint of a hidden object"
          ],
          "sounds": [
            "the ticking of an old clock",
            "soft whispers from outside",
            "the creaking of the floorboards"
          ],
          "smells": [
            "scent of aged paper",
            "faint aroma of ink",
            "the musty air of neglect"
          ],
          "mood": "suspenseful anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight casting flickering shadows",
            "the glow of a warm fire",
            "a hidden letter on the table"
          ],
          "sounds": [
            "the crackle of a fire",
            "soft whispers of conversation",
            "the distant echo of laughter"
          ],
          "smells": [
            "scent of burning wood",
            "the richness of leather",
            "the faint sweetness of old books"
          ],
          "mood": "tense focus"
        }
      ],
      "paragraphs": [
        "The Reading Room serves as a refuge for those seeking knowledge and solace amidst the storm. Dimly lit and lined with towering shelves, it exudes an air of mystery, each book a potential key to uncovering secrets. The scent of musty paper and beeswax candles fills the air, inviting guests to linger and explore the depths of the stories held within. Yet, the atmosphere is charged, as the ticking clock marks the passage of time, echoing the urgency of hidden truths waiting to be revealed.",
        "As guests sift through the pages of dusty tomes, the quiet rustle of paper seems to whisper of secrets long buried. Shadows dance in the flickering candlelight, concealing more than just the furniture. Every creak of the old floorboards sends a shiver down the spine, as the weight of the past presses in, reminding all who enter that knowledge can be both a weapon and a shield in the unfolding drama."
      ]
    },
    {
      "id": "staff_area",
      "name": "The Servants’ Quarters",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A cramped, utilitarian space with simple wooden furniture and a small kitchen area, tucked away behind the main hotel.",
      "sensoryDetails": {
        "sights": [
          "faded photographs on the walls",
          "rustic wooden tables",
          "sparse bedding on bunks",
          "a small stove in the corner",
          "scattered tools and cleaning supplies"
        ],
        "sounds": [
          "clinking of dishes",
          "soft chatter among staff",
          "the hum of the stove",
          "distant laughter from the lobby",
          "the rustle of uniforms"
        ],
        "smells": [
          "scent of boiled vegetables",
          "faint whiff of cleaning supplies",
          "musty air from the small windows",
          "the tang of sweat",
          "lingering aroma of tobacco"
        ],
        "tactile": [
          "rough texture of wooden tables",
          "smoothness of metal utensils",
          "warmth of the stove",
          "coolness of the tiled floor",
          "softness of worn uniforms"
        ]
      },
      "accessControl": "Staff only; access controlled by head housekeeper; guests forbidden.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops streaking the window",
            "water pooling on the floor",
            "dim light filtering through clouds"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft chatter of staff",
            "the rustle of wet uniforms"
          ],
          "smells": [
            "earthy scent of rain",
            "the tang of cleaning supplies",
            "the mustiness of damp air"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "dull light from a single bulb",
            "the flicker of a candle"
          ],
          "sounds": [
            "the ticking of a clock",
            "muffled voices from the lobby",
            "the clatter of dishes"
          ],
          "smells": [
            "scent of washing powder",
            "faint aroma of stale food",
            "the musty air of the quarters"
          ],
          "mood": "suspenseful silence"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of the setting sun",
            "shadows lengthening in the room",
            "the flicker of a candle"
          ],
          "sounds": [
            "the distant sound of music",
            "the murmur of conversation",
            "the rustle of cleaning supplies"
          ],
          "smells": [
            "scent of fresh linens",
            "the warmth of cooked meals",
            "the lingering aroma of tobacco"
          ],
          "mood": "cautious camaraderie"
        }
      ],
      "paragraphs": [
        "The Servants’ Quarters lie hidden from the guests’ view, a cramped space where the staff share secrets and stories. The air is thick with the scent of boiled vegetables and cleaning supplies, a stark contrast to the glamour of the hotel above. Faded photographs on the walls tell tales of past employees, while the sound of soft chatter provides a backdrop to the daily routines of those who keep the hotel running.",
        "As the evening draws near, the atmosphere shifts, filled with a sense of camaraderie tempered by the weight of unspoken tensions. The flickering candlelight casts shadows on the walls, hiding the worries and fears that accompany their work. In this confined space, the staff hold the keys to secrets that could unravel the delicate façade of The Grand Azure, making the quarters a hotbed of intrigue and potential discovery."
      ]
    }
  ],
  "note": "",
  "cost": 0.0025617685500000003,
  "durationMs": 34030
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1945,
    "month": "April",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "Overcast skies with frequent rain showers",
      "Cool breezes from the coast",
      "Occasional bursts of sunshine breaking through clouds"
    ],
    "daylight": "Days are becoming longer with daylight extending into the evening, but the coastal fog often rolls in, making the atmosphere feel moody.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the hotel is quieter and shadows loom large.",
    "holidays": [
      "Easter (April 1, 1945)"
    ],
    "seasonalActivities": [
      "Spring cleaning in local homes",
      "Visiting coastal beaches despite the chill",
      "Attending church services for Easter celebrations"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Three-piece suits with waistcoats in muted colors",
        "Fedoras or trilby hats",
        "Leather shoes polished to a shine"
      ],
      "casual": [
        "Cotton shirts with rolled-up sleeves",
        "Trousers with wide cuffs",
        "Wool sweaters for added warmth"
      ],
      "accessories": [
        "Silk ties in conservative patterns",
        "Pocket squares for suits",
        "Leather gloves for the chilly evenings"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea-length dresses with floral prints",
        "Tailored jackets with nipped waists",
        "Cloche hats adorned with ribbons"
      ],
      "casual": [
        "A-line skirts paired with fitted blouses",
        "Cardigans for layering",
        "Flat-heeled shoes or low pumps"
      ],
      "accessories": [
        "Pearl necklaces and earrings",
        "Handbags with structured designs",
        "Scarves for hair or neck embellishments"
      ]
    },
    "trendsOfTheMoment": [
      "Utility clothing still popular due to wartime rationing",
      "Bright colors returning to spring fashion",
      "Emphasis on feminine styles as women assert their presence post-war"
    ],
    "socialExpectations": [
      "Men are expected to maintain a formal appearance even in casual settings",
      "Women are encouraged to embrace new roles in the workforce while maintaining traditional femininity",
      "Social gatherings often center around discussions of the war's aftermath and future uncertainties"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The war in Europe is nearing its end with the fall of Berlin imminent",
      "The United Nations is being formed to promote peace",
      "Tensions rise in the Pacific as the U.S. prepares for a potential invasion of Japan"
    ],
    "politicalClimate": "The atmosphere is tense as the world awaits the outcome of the final battles in Europe, with political discussions focusing on post-war reconstruction and peace treaties.",
    "economicConditions": "Rationing is still in effect, but the economy is beginning to shift as the war effort winds down, leading to uncertainty about job security and inflation.",
    "socialIssues": [
      "The integration of returning soldiers into civilian life",
      "Women's rights gaining traction as they prove their capabilities in the workforce",
      "Racial tensions and civil rights movements beginning to surface"
    ],
    "internationalNews": [
      "Reports of Allied forces liberating concentration camps",
      "The Yalta Conference outcomes influencing post-war Europe",
      "Increasing discussions around the use of the atomic bomb in Japan"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'Don't Fence Me In'",
        "The Ink Spots' 'If I Didn't Care'",
        "Nat King Cole's 'Straighten Up and Fly Right'"
      ],
      "films": [
        "'The Lost Weekend' exploring the struggles of addiction",
        "'Mildred Pierce' showcasing women's resilience",
        "'The Clock' illustrating romance amidst the stresses of war"
      ],
      "theater": [
        "The original Broadway production of 'Carousel'",
        "Revival of 'Oklahoma!' drawing crowds",
        "'The Glass Menagerie' creating waves in the drama scene"
      ],
      "radio": [
        "'The Jack Benny Program' providing comic relief",
        "News broadcasts detailing war updates",
        "'Suspense', a series delivering thrilling mystery stories"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'The Great Gatsby' by F. Scott Fitzgerald (reprints due to war)",
        "'The Member of the Wedding' by Carson McCullers"
      ],
      "popularGenres": [
        "Mystery and detective fiction gaining popularity",
        "Realist novels reflecting societal changes",
        "War literature capturing the human experience amidst conflict"
      ]
    },
    "technology": {
      "recentInventions": [
        "The atomic bomb, highlighting the end of WWII",
        "Advancements in radar technology",
        "Early computers beginning to emerge for military use"
      ],
      "commonDevices": [
        "Table radios for entertainment and news",
        "Early television sets, although limited programming is available",
        "Automobiles, though fuel rationing limits usage"
      ],
      "emergingTrends": [
        "Increased interest in consumer goods as the war ends",
        "The rise of fast food as a quick option for busy families",
        "Home appliances becoming more common in post-war households"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "A pint of milk: two pence",
        "A weekly newspaper: six pence"
      ],
      "commonActivities": [
        "Gathering for tea and conversation",
        "Participating in community events like church picnics",
        "Taking walks along the coast despite the chill"
      ],
      "socialRituals": [
        "Sunday family gatherings after church services",
        "Weekly dance nights at local halls",
        "Neighborhood watch meetings discussing safety and community concerns"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Growing emphasis on class mobility as the war changes traditional roles",
      "Increased scrutiny of the wealthy amidst widespread hardship",
      "Community support networks forming among lower and middle classes"
    ],
    "gender": [
      "Women are increasingly seen as equals in the workforce",
      "Men returning from war struggle with adjusting to women's new roles",
      "Traditional gender roles are being challenged as women assert independence"
    ],
    "race": [
      "Racial segregation remains, but discussions of equality are beginning",
      "The Harlem Renaissance has shifted perceptions of Black culture",
      "Increased visibility of civil rights activism"
    ],
    "generalNorms": [
      "Privacy is valued, but suspicion runs high due to the war",
      "Community involvement is encouraged to foster relationships",
      "Conformity in behavior is expected, but rebellion is quietly brewing among youth"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain-soaked earth mingles with the salty coastal air, creating a heavy atmosphere that clings to the skin.",
    "The distant sound of waves crashing against the shore blends with the murmur of guests speaking in hushed tones, each word laden with unspoken fears.",
    "Candles flicker in the dimly lit hotel lobby, casting long shadows that dance across the walls, reminiscent of the uncertainties swirling in the hearts of the patrons."
  ],
  "paragraphs": [
    "In April 1945, the air is thick with tension as the world holds its breath, waiting for the final acts of a brutal war. The coastal hotel, with its overcast skies and occasional rain, becomes a refuge for weary travelers, yet it is also a cauldron of whispered suspicions. Each guest carries their own burdens, from memories of battle to hopes for a peaceful future, all while the rhythmic sound of waves crashing against the shore serves as a constant reminder of nature's indifference to human woes.",
    "Fashion reflects the complexities of the era, with men donning three-piece suits and fedoras, presenting a facade of normalcy amidst chaos. Women, asserting their presence in the workforce, embrace tea-length dresses and tailored jackets, showcasing their resilience and style. The cloche hats and pearl accessories they wear symbolize a return to femininity, even as they navigate new societal roles. This juxtaposition of traditional and modern sensibilities permeates the hotel, where guests eye each other with a mix of admiration and distrust.",
    "Daily life carries on with a rhythm that feels both familiar and foreign. Prices remain stable, but the specter of rationing lingers, leading to quiet conversations about the challenges of post-war recovery. Social rituals, such as Sunday family gatherings and neighborhood watch meetings, foster a sense of community, yet the undercurrent of suspicion leads to cautious interactions. As guests gather for tea or dance in the hotel ballroom, laughter often masks the anxiety that simmers just below the surface, reminding all that the world outside is in flux, and trust is a rare commodity."
  ],
  "note": "",
  "cost": 0.0012067802999999998,
  "durationMs": 26278
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A delayed-action poisoning at a seaside hotel brings together a diverse group of guests and staff, all navigating the tensions of post-war society and the uncertainties of the Cold War.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Class dynamics are shifting as women enter the workforce, while societal suspicion and anxiety over global tensions create an atmosphere of distrust."
  },
  "setting": {
    "location": "A seaside hotel on a remote stretch of coastline",
    "institution": "hotel",
    "weather": "Overcast with occasional rain, typical of coastal regions"
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
    "id": "sandy_footprints",
    "value": "forty feet",
    "description": "Distance from the beach to the victim's room"
  },
  {
    "id": "plant_extraction_time",
    "value": "two hours",
    "description": "Time taken for the poison to become active after ingestion"
  },
  {
    "id": "bottle_content",
    "value": "thirty ounces",
    "description": "Volume of the poison bottle found"
  },
  {
    "id": "victim_death_time",
    "value": "ten minutes past midnight",
    "description": "Time of the victim's death as recorded"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 21,
  "countsByPlacement": {
    "early": 8,
    "mid": 12,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
    "supporting": 3,
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
      "criticality": "supporting",
      "category": "spatial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "supporting",
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
      "category": "physical"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "supporting",
      "category": "testimonial"
    },
    {
      "id": "clue_9",
      "placement": "early",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_10",
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
      "id": "clue_culprit_direct_beatrice_quill",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_late_1",
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
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "placement": "early",
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
