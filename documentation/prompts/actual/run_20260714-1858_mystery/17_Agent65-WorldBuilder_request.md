# Actual Prompt Record

- Run ID: `mystery-1784055526685`
- Project ID: ``
- Timestamp: `2026-07-14T19:04:23.879Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `907090137547f1fa`

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
    "title": "Reflections of Deceit",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "An elegant 1940s seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "seaside hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "spatial manipulation"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "An astute and determined investigator",
      "private_secret": "Struggles with self-doubt",
      "motive_seed": "Desire for justice",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal reputation as a detective",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "Work colleague of Ivor Hale"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Had a past affair with a colleague",
      "motive_seed": "Professional rivalry",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation as a doctor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Former military officer",
        "Acquaintance of Mallory"
      ],
      "public_persona": "Charismatic and authoritative",
      "private_secret": "Hides a gambling problem",
      "motive_seed": "Financial desperation",
      "motive_strength": "high",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Shared balcony access"
      ],
      "behavioral_tells": [
        "Nervous when questioned"
      ],
      "stakes": "Financial stability",
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
        "Maid at the hotel",
        "Friend of Mallory"
      ],
      "public_persona": "Friendly and helpful",
      "private_secret": "In love with Ivor Hale",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "10 PM to 11 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Love and reputation",
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
        "Rival doctor of Mallory"
      ],
      "public_persona": "Ambitious and competitive",
      "private_secret": "Harbors resentment towards Mallory",
      "motive_seed": "Professional jealousy",
      "motive_strength": "high",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Career advancement",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Business partner of Mallory"
      ],
      "public_persona": "Charming and smooth-talking",
      "private_secret": "In debt to the wrong people",
      "motive_seed": "To silence Mallory's threats to expose him",
      "motive_strength": "high",
      "alibi_window": "10 PM to 11 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Financial ruin",
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
      "summary": "In a grand seaside hotel, Dr. Mallory Finch is found strangled in her room. As guests navigate their secrets and lies, Eleanor Voss uncovers a web of deception, where a mirror's reflection misleads witness accounts and reveals the true murderer."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A strategically placed mirror creates a false reflection of the victim, misleading witnesses about the location of the crime.",
      "delivery_path": [
        {
          "step": "The murderer positioned the mirror to reflect an image of the victim being attacked from a different angle."
        }
      ]
    },
    "outcome": {
      "result": "The true location of the crime was hidden, leading to false witness statements."
    }
  },
  "false_assumption": {
    "statement": "The victim was attacked from across the room.",
    "type": "spatial",
    "why_it_seems_reasonable": "A witness claims to have seen the attack due to the mirror's reflection.",
    "what_it_hides": "The true position of the attacker, who was actually much closer."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witness saw Hale near the victim's room shortly before the murder.",
      "Hale had a known rivalry with Dr. Finch over hospital positions."
    ],
    "the_one_flaw": "Hale's alibi is confirmed by the hotel staff, who saw him in the lobby at the time of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken bottle was found near the victim.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The bottle was from a previous guest's party and had been discarded.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A note threatening the victim was discovered in Hugo Vane's belongings.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The note was a prank from a friend and not meant seriously.",
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
    "rationale": "All suspects are guests or staff of the hotel, with no outsiders involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "10 PM",
        "11 PM"
      ],
      "windows": [
        "9:30 PM to 10:30 PM"
      ],
      "contradictions": [
        "Witness claims saw attack at 10 PM, but victim's death was confirmed at 10:15 PM."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Captain Ivor Hale",
        "Hugo Vane",
        "Beatrice Quill",
        "Sylvia Trent"
      ],
      "objects": [
        "Mirror in the victim's room",
        "Victim's belongings"
      ],
      "permissions": [
        "Staff had access to the victim's room"
      ]
    },
    "physical": {
      "laws": [
        "Light reflection principles",
        "Sound travel and perception"
      ],
      "traces": [
        "Fingerprints on the mirror",
        "Footprints near the scene"
      ]
    },
    "social": {
      "trust_channels": [
        "Among hotel staff",
        "Guest camaraderie"
      ],
      "authority_sources": [
        "Hotel manager",
        "Local police"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Fingerprints are found on the mirror's surface in the victim's room.",
        "correction": "The fingerprints suggest someone manipulated the mirror.",
        "effect": "Narrows suspect pool to those who accessed the victim's room.",
        "required_evidence": [
          "Fingerprints on the mirror",
          "Access logs showing who entered the victim's room"
        ],
        "reader_observable": true
      },
      {
        "observation": "The angle of the mirror contradicts the witness's account of the attack.",
        "correction": "The reflection of the victim's position conflicts with where the witness claims to have seen the attack.",
        "effect": "Eliminates witness reliability as a source of truth.",
        "required_evidence": [
          "Witness statement about the attack",
          "Position of the mirror and victim's body"
        ],
        "reader_observable": true
      },
      {
        "observation": "An unusual smudge is discovered on the lens of the mirror.",
        "correction": "The smudge indicates recent handling, linking it to the suspect.",
        "effect": "Narrows to suspects who could have handled the mirror shortly before the murder.",
        "required_evidence": [
          "Smudge on the mirror lens",
          "Witness accounts of who was near the mirror"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Setting up a reenactment with the mirror to reveal the true angle of the attack.",
    "knowledge_revealed": "The incorrect angle of witness accounts is proven through the mirror's placement.",
    "pass_condition": "The angle of attack demonstrated by the reenactment contradicts witness statements.",
    "evidence_clues": [
      "clue_12",
      "clue_core_contradiction_chain",
      "clue_5",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Fingerprints on the mirror and access logs (early) narrow suspects. Step 2: The angle of the mirror contradicts witness statements (mid) eliminates witness reliability. Step 3: The smudge links handling to the culprit (discriminating test) reveals Hugo Vane's involvement."
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
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi from hotel staff",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No access to the crime scene at the time of death.",
        "supporting_clues": [
          "clue_id_3"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed location by multiple witnesses.",
        "supporting_clues": [
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
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
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_early_2",
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
        "clue_id": "clue_mid_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Witness statement"
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
        "delivery_method": "Corroborated elimination"
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
        "clue_id": "clue_culprit_direct_hugo_vane",
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
        "clue_id": "clue_mid_1",
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
    "summary": "A traveling journalist with a keen eye for human relationships, Eleanor Voss finds herself entangled in a web of deceit at an elegant seaside hotel.",
    "publicPersona": "Charming and inquisitive, known for her insightful travel pieces that explore human relationships.",
    "privateSecret": "Struggles with unrequited love for Captain Hale, complicating her objectivity.",
    "motiveSeed": "Seeking the truth behind the victim's demise to write a compelling story, but also to prove her worth.",
    "motiveStrength": "moderate",
    "alibiWindow": "Present at the hotel for a feature article, was in the lobby when the murder occurred.",
    "accessPlausibility": "easy",
    "stakes": "Personal redemption and professional success.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her observations with a wry smile. She has a tendency to ask rhetorical questions, drawing her listeners into her thought process.",
    "signatureTic": "Ah, the tangled webs we weave.",
    "internalConflict": "Eleanor grapples with the tension of her unspoken feelings for Captain Hale while desperately seeking the truth in a world where her heart and her career seem at odds.",
    "personalStakeInCase": "This crime is her chance to prove she is more than just a charming writer; it’s an opportunity to reclaim her sense of worth.",
    "paragraphs": [
      "Eleanor Voss stood in the lobby of the seaside hotel, her notepad poised delicately in her hands, a picture of elegance and curiosity. She had come to write about the picturesque surroundings but found herself drawn into a far darker narrative. The murder of Dr. Mallory Finch had transformed her assignment into a perilous quest for truth, one she could not resist. As she listened to the murmurs of the guests, she felt the weight of unexpressed emotions pressing down on her—a heavy cloak of unrequited love for Captain Ivor Hale, who had once swept her into a world of possibilities.",
      "With each new revelation, her heart ached, caught between the allure of a compelling story and the painful reality of her feelings for Hale. The tension was palpable, a silent struggle that clouded her judgment. 'What will it take for you to see me?' she often wondered, not daring to voice the question aloud. Instead, she channeled her energy into her investigation, determined to unearth the truth, not just for her career but to validate her worth in a world that often overlooked her.",
      "As she delved deeper, Eleanor discovered layers of deceit that threatened to consume her. Each suspect held secrets that intertwined with her own, and she found herself entwined in their lives. The stakes were high—her professional success hinged on her ability to unravel the mystery. Yet, with every clue, she felt her heart tugging her in a different direction, urging her to confront her feelings for Hale. 'Ah, the tangled webs we weave,' she mused, a wry smile playing on her lips as she jotted down her thoughts.",
      "In the end, Eleanor knew that the resolution of this case would not only bring her professional triumph but would also force her to confront her own heart. She was no longer just a journalist; she was an investigator in a world where love and betrayal danced dangerously close. The shadows of the hotel whispered secrets, and she was determined to bring them to light, regardless of the cost."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A highly regarded physician with a calm demeanor, Dr. Mallory Finch finds her life spiraling into chaos after her affair becomes a deadly secret.",
    "publicPersona": "Highly regarded local doctor with a calm demeanor, known for her meticulous care.",
    "privateSecret": "Has been in an affair with the victim, who threatened to expose her if she didn’t leave her husband.",
    "motiveSeed": "Fear of scandal and losing her medical practice if the affair became public.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be attending a medical conference in the city at the time of the murder.",
    "accessPlausibility": "unlikely",
    "stakes": "Professionally and personally at risk of exposure.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks in a calm, measured tone, often employing medical jargon to articulate her thoughts. Her voice carries a weight of authority but lacks warmth, reflecting her internal turmoil.",
    "signatureTic": "It's all in the details.",
    "internalConflict": "Dr. Finch is torn between her professional ethics and the personal consequences of her affair, fearing that exposure will ruin her career and life.",
    "personalStakeInCase": "The murder investigation could expose her affair, leading to a loss of her practice and her marriage.",
    "paragraphs": [
      "Dr. Mallory Finch had always prided herself on her meticulous nature, a quality that made her a revered physician in the seaside town. However, that same attention to detail now felt like a noose tightening around her neck. The murder of the victim, who had threatened to expose the affair they shared, sent her into a spiral of panic. She could almost hear the whispers of her colleagues, the judgment that would follow her should the truth come to light. 'It's all in the details,' she often reminded herself, but this time, the details were damning.",
      "As she navigated the hotel corridors, her calm demeanor belied the storm brewing within. She had claimed to be at a medical conference during the murder, but in her heart, she knew that her alibi was as fragile as her reputation. The fear of scandal loomed over her like a dark cloud, threatening to burst at any moment. The thought of losing her practice, the one thing she had built with years of hard work, was unbearable. Her husband remained blissfully unaware of her infidelity, and the thought of exposing him to the fallout felt like a betrayal she could not bear.",
      "Dr. Finch's interactions with the other guests were laced with tension. She maintained her professional facade, offering medical advice with an air of authority, but inside, she was a tempest of guilt and fear. Every glance felt like an accusation, every whispered conversation a reminder of the secret she harbored. The affair had been a fleeting escape, but now it threatened to unravel everything she held dear. The stakes had never been higher, and she was acutely aware that one misstep could lead to her undoing.",
      "In the end, Dr. Finch knew that she had to confront her demons. The investigation would force her to face the consequences of her actions, and as she stood at the precipice of exposure, she realized that her life was about to change irrevocably. She was caught in a web of her own making, and now she had to decide whether to cut herself free or risk everything for the sake of a love that could never be."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired Navy captain with a gallant reputation, Ivor Hale is haunted by his past relationship with the victim and caught in a web of jealousy and regret.",
    "publicPersona": "Gallant and charming, with a reputation as a war hero, struggling to adapt to civilian life.",
    "privateSecret": "Had a past romantic relationship with the victim, which he regrets deeply.",
    "motiveSeed": "Jealousy over the victim's involvement with Dr. Finch, leading to heated arguments.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed he was on a walk along the beach during the time of the murder.",
    "accessPlausibility": "possible",
    "stakes": "Emotional turmoil and potential ruin of his reputation.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a confident, smooth tone, often laced with sardonic remarks. He tends to use military jargon and has a habit of addressing people with a playful, yet pointed, irony.",
    "signatureTic": "This is a fine mess, isn't it?",
    "internalConflict": "Ivor is plagued by guilt and jealousy over his past with the victim, torn between his feelings for her and his resentment towards her choices.",
    "personalStakeInCase": "The investigation threatens to expose his past with the victim, risking his reputation and the chance for a fresh start.",
    "paragraphs": [
      "Captain Ivor Hale stood at the edge of the beach, the salty breeze ruffling his hair, but he felt no relief from the turmoil that churned within. A war hero, he had once commanded respect and admiration, but now he was just a man grappling with ghosts of his past. The murder of the victim brought forth a flood of memories—memories of a love that had once ignited his heart but had long since turned to ash. 'This is a fine mess, isn't it?' he often quipped to himself, the sardonic tone masking the pain beneath.",
      "His alibi was as flimsy as the mist that enveloped the shoreline—he had claimed to be on a walk, but in truth, he had been wrestling with his feelings of jealousy over the victim's relationship with Dr. Finch. The thought of her moving on with someone else was a bitter pill to swallow, and it fueled the anger that had simmered between them. It was a tangled web of emotions, and he found himself caught in it, struggling to break free. Each encounter with the other suspects felt like a calculated chess game, one wrong move could topple his carefully constructed facade.",
      "Ivor's charm was his weapon, and he wielded it with precision. He spoke with a confidence that belied his inner turmoil, often lacing his words with a sardonic edge. He could disarm a room with his wit, but the laughter never reached his eyes. He was acutely aware that the investigation could expose not just his past with the victim but also the scars it had left on his soul. The stakes were high; his reputation as a gallant hero hung in the balance, and he was not ready to let it crumble.",
      "As the investigation unfolded, Ivor knew he had to confront the demons that haunted him. The memories of the victim, their love, and the choices they had made weighed heavily on him. He was not just a suspect; he was a man on the brink of losing everything he held dear. The path ahead was fraught with danger, but perhaps it was time to face the truth, even if it meant unraveling the last threads of the life he once knew."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An eager art student with dreams of romance, Beatrice Quill finds herself embroiled in a tragic love story that shatters her naive ideals.",
    "publicPersona": "Eager and optimistic, with an artistic flair and fascination for romance.",
    "privateSecret": "Was in love with the victim, who dismissed her affections as childish.",
    "motiveSeed": "Felt deeply hurt and betrayed by the victim's rejection and subsequent relationships.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be sketching in a nearby café, but no one can verify her whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "Hurt pride and emotional devastation.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks with a lyrical quality, often punctuating her sentences with whimsical expressions. She has a tendency to daydream aloud, leading her conversations into abstract realms.",
    "signatureTic": "Love is a canvas, and I’m just a paintbrush.",
    "internalConflict": "Beatrice struggles with the painful realization that her idealized vision of love was merely a fantasy, leading her to question her self-worth.",
    "personalStakeInCase": "The murder has shattered her romantic illusions, forcing her to confront the harsh realities of life and love.",
    "paragraphs": [
      "Beatrice Quill wandered through the hotel lobby, her sketchbook clutched tightly to her chest, as if it were a lifeline. The vibrant hues of her imagination often clashed with the stark reality surrounding her. She had come to this seaside haven with dreams of romance and inspiration, but instead found herself entangled in a tragic narrative of loss and betrayal. The murder of the victim had shattered her world, and now she was left grappling with the fragments of her idealized vision of love. 'Love is a canvas, and I’m just a paintbrush,' she often mused, her self-deprecating humor a mask for her heartache.",
      "Her alibi was flimsy at best; she claimed to have been sketching in a nearby café, but no one could vouch for her whereabouts. The sense of betrayal she felt from the victim—the one who had dismissed her affections as childish—left a bitter taste in her mouth. Each interaction with the other guests felt like a reminder of her naivety, as they navigated the murky waters of love and loss with a sophistication she had yet to grasp. The hurt pride she carried weighed heavily on her heart, and she found herself questioning her worth in a world that seemed so unforgiving.",
      "Beatrice's conversations often floated into the realm of dreams, her whimsical expressions contrasting sharply with the grim reality of the murder investigation. She spoke with a lyrical quality, weaving tales of romance and beauty, but deep down, she was a young woman on the brink of emotional devastation. The stakes had never felt higher; each revelation cut deeper, forcing her to confront the painful truth that love was not the fairytale she had envisioned. She felt lost in the chaos, a mere spectator in a drama that had spiraled out of her control.",
      "As the investigation progressed, Beatrice realized that her journey was not just about uncovering the truth behind the murder but also about understanding the complexities of love and loss. She had to reconcile her dreams with the harsh realities of life, and perhaps in doing so, she would find a way to paint a new picture for herself—one that embraced the beauty of imperfection and the lessons learned from heartbreak."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A steely hotel manager with a reputation for organization, Sylvia Trent is forced to confront her moral failings when a murder threatens her livelihood.",
    "publicPersona": "Authoritative and highly organized, maintaining the hotel's reputation.",
    "privateSecret": "Has been skimming money from the hotel funds to support her lavish lifestyle.",
    "motiveSeed": "Potentially losing her position if the victim exposes her financial discrepancies.",
    "motiveStrength": "strong",
    "alibiWindow": "Was supposedly in a meeting with hotel staff during the murder.",
    "accessPlausibility": "easy",
    "stakes": "Job security and personal financial stability.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Sylvia speaks with a no-nonsense tone, often cutting through conversations with blunt remarks. Her words are precise, reflecting her authoritative role, but there's an underlying tension in her voice.",
    "signatureTic": "We can’t afford any slip-ups.",
    "internalConflict": "Sylvia feels the weight of her financial deceit pressing down on her, torn between maintaining her lavish lifestyle and the impending threat of exposure.",
    "personalStakeInCase": "The murder investigation could unravel her carefully constructed life, jeopardizing her job and financial security.",
    "paragraphs": [
      "Sylvia Trent stood at the helm of the hotel, a steely figure of authority amidst the chaos that had erupted following the murder. With her sharp gaze and no-nonsense demeanor, she commanded respect from her staff and guests alike. However, beneath the polished exterior lay a dark secret—she had been skimming from the hotel funds to support her extravagant lifestyle. The victim had threatened to expose her, and now, as she navigated the murky waters of the investigation, Sylvia felt the pressure mounting. 'We can’t afford any slip-ups,' she reminded herself, the words echoing in her mind as if they were a mantra.",
      "Her alibi was crafted with precision; she had claimed to be in a meeting with her staff during the time of the murder. Yet, as the investigation unfolded, she felt the walls closing in around her. The stakes were high—her job security and financial stability hung in the balance. The thought of losing everything she had worked for was unbearable. Sylvia's authoritative voice cut through the tension in the hotel, but internally, she was a tempest of anxiety, desperately trying to maintain control over a situation that threatened to spiral beyond her grasp.",
      "Sylvia's interactions with the guests were marked by a bluntness that often caught them off guard. She spoke with precision, her words devoid of fluff, yet there was an underlying tension in her tone that hinted at her inner turmoil. Each inquiry about the murder felt like a dagger to her heart, a reminder that her carefully constructed life was built on a foundation of deceit. The emotional strain weighed heavily on her, and she was acutely aware that one wrong move could lead to her downfall.",
      "As the investigation progressed, Sylvia knew she had to confront her moral failings. The truth loomed like a shadow over her, threatening to expose not just her financial discrepancies but her very character. She had to navigate the complexities of her choices while maintaining her facade, and in doing so, she realized that the stakes were not just about her job—they were about her very identity. The hotel was her kingdom, and she was determined to protect it at all costs, even if it meant facing the demons of her past."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A cynical private investigator with a hard-nosed reputation, Hugo Vane finds himself caught in a moral quagmire as he navigates the murder investigation.",
    "publicPersona": "A hard-nosed investigator with a reputation for getting results, often at moral costs.",
    "privateSecret": "Was hired by a jealous party to investigate the victim's relationships.",
    "motiveSeed": "Could gain financially from the fallout of the murder investigation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been in his office working on a case.",
    "accessPlausibility": "possible",
    "stakes": "Professional reputation and financial gain.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks in a clipped, direct manner, often punctuating his observations with dry humor. He has a penchant for cynicism and is not afraid to call out the absurdities of life.",
    "signatureTic": "Life’s a mess, isn’t it?",
    "internalConflict": "Hugo struggles with the moral implications of his actions, torn between his desire for financial gain and a sense of justice.",
    "personalStakeInCase": "The investigation represents both a potential financial windfall and a test of his ethical boundaries.",
    "paragraphs": [
      "Hugo Vane leaned against the bar, a cigarette dangling loosely from his fingers, as he surveyed the chaos unfolding around him. A private investigator by trade, he had seen it all—the good, the bad, and the downright absurd. Yet, this murder case felt different, a moral quagmire that threatened to pull him under. Hired by a jealous party to investigate the victim's relationships, he found himself navigating a labyrinth of deceit and betrayal. 'Life’s a mess, isn’t it?' he often muttered, his observational humor a thin veil over his growing unease.",
      "His alibi was a simple one; he claimed to have been in his office, working on another case, but deep down, he knew that the truth was more complicated. The investigation could yield financial rewards, but at what cost? He was caught between the allure of profit and the nagging voice of conscience that whispered of justice. Each interaction with the suspects felt like a chess match, every move calculated yet fraught with ethical implications. He had built a reputation for getting results, but now he questioned whether the ends truly justified the means.",
      "Hugo's speech was clipped and direct, a reflection of his cynical worldview. He often punctuated his observations with dry humor, finding absurdity in the darkest corners of life. It was a defense mechanism, a way to cope with the chaos that surrounded him. As the investigation progressed, he felt the weight of his own choices pressing down on him, forcing him to confront the moral implications of his actions. The stakes were high, and he was no longer just an observer; he was a participant in a deadly game.",
      "In the end, Hugo knew that he had to make a choice. The investigation could lead to financial gain, but at what cost to his integrity? As he delved deeper into the lives of the suspects, he realized that the truth was an elusive creature, one that could slip through his fingers if he wasn't careful. The shadows of the hotel whispered secrets, and he was determined to bring them to light—if only to find redemption in a world that had long since lost its moral compass."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Cliffside Hotel",
    "type": "seaside hotel",
    "place": "Scarborough",
    "country": "England",
    "summary": "An elegant 1940s seaside hotel perched on the cliffs of Scarborough, offering stunning ocean views and a sense of intrigue.",
    "visualDescription": "Art Deco architecture with sweeping curves, large glass windows reflecting the tumultuous sea, and a grand lobby adorned with plush furnishings and intricate moldings.",
    "atmosphere": "Tense and foreboding, filled with whispers of past conflicts and the weight of unspoken secrets.",
    "paragraphs": [
      "The Cliffside Hotel stands resolute against the backdrop of an overcast sky, its Art Deco lines contrasting sharply with the churning grey waters below. Guests peer through the expansive windows, watching the waves crash against the cliffs, while the salty air mingles with the faint scent of polished wood and fading perfume. This is a place where elegance meets unease, where the laughter of patrons feels hollow against the whispers of wartime memories.",
      "Inside, the lobby is a cacophony of muted conversations, the soft clinking of fine china, and the distant hum of a radio broadcasting the latest news. Plush armchairs invite weary travelers to sink into their embrace, yet the atmosphere is thick with tension. Shadows play across the walls, and every creak of the floorboards seems to echo a secret, as if the very building itself is a witness to unspoken treachery.",
      "As evening descends, the hotel transforms. The flickering candlelight casts dancing shadows, revealing fleeting glimpses of the guests' anxious faces. Outside, the rain begins to fall, tapping against the windows like a nervous heartbeat. Each drop carries the weight of stories untold, and the air grows charged with anticipation. In this secluded refuge, isolation reigns, and every soul within is bound by the invisible threads of suspicion and deceit."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of a coastal climate in late autumn",
    "timeFlow": "A weekend filled with mounting tensions and hidden agendas",
    "mood": "tense and suspenseful, influenced by recent wartime events and lingering anxieties about the future",
    "eraMarkers": [
      "radio broadcasts of war updates",
      "early television sets flickering in lounges",
      "rationed public transport schedules",
      "military vehicles parked by the entrance"
    ],
    "sensoryPalette": {
      "dominant": "salty ocean air with a hint of dampness",
      "secondary": [
        "plush upholstery and polished wood",
        "faint scent of tobacco and perfume"
      ]
    },
    "paragraphs": [
      "The air in Scarborough is thick with the scent of brine and the promise of rain, as the Cliffside Hotel stands sentinel over the tumultuous sea. Its elegant facade, a testament to Art Deco design, reflects the grey sky, while inside, the warmth of the lobby offers a stark contrast to the chill outside. Here, the sounds of laughter mingle with the crackle of a nearby radio, broadcasting news that weighs heavily on the hearts of its guests.",
      "As the day wanes, shadows stretch across the polished floor, and the atmosphere shifts. The distant rumble of thunder mirrors the unease that fills the air, creating a palpable tension. Guests exchange furtive glances, the unspoken fears of wartime lingering in their minds. The hotel, with its grand architecture and secluded setting, becomes a microcosm of the world outside — beautiful yet fraught with peril."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "High ceilings adorned with geometric patterns, large glass windows overlooking the tumultuous sea, and plush velvet seating arrangements.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "art deco chandeliers casting soft light",
          "waves crashing against cliffs",
          "guests in elegant attire",
          "flickering shadows from candlelight"
        ],
        "sounds": [
          "soft laughter and murmurs",
          "clinking of glasses",
          "radio crackling with news updates",
          "the distant roar of the ocean",
          "footsteps on polished marble"
        ],
        "smells": [
          "freshly brewed coffee",
          "polished wood and leather",
          "faint tobacco smoke",
          "salt air from the ocean",
          "scent of jasmine from nearby gardens"
        ],
        "tactile": [
          "cool marble underfoot",
          "soft velvet upholstery",
          "smooth brass fixtures",
          "chill of ocean breeze through open windows",
          "warmth from the fireplace"
        ]
      },
      "accessControl": "Open to all guests; monitored by security personnel; staff only after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain drumming on window panes",
            "misty outlines of distant cliffs",
            "wet marble glistening",
            "guests huddled under umbrellas",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady patter of rain",
            "muffled conversations",
            "the crackle of the radio",
            "distant thunder rumbling",
            "splashing footsteps"
          ],
          "smells": [
            "dampness in the air",
            "wet stone and wood",
            "fresh coffee brewing",
            "scent of rain-soaked earth",
            "hint of mildew from the corners"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light casting long shadows",
            "guests in subdued colors",
            "faint outlines of storm clouds",
            "brass fittings reflecting dim light",
            "the ocean roiling beneath a grey sky"
          ],
          "sounds": [
            "silence punctuated by distant voices",
            "the ticking of an old wall clock",
            "soft music from a gramophone",
            "the hum of conversation",
            "the creak of old timbers"
          ],
          "smells": [
            "beeswax from polished surfaces",
            "dust from neglected corners",
            "woodsmoke from the fireplace",
            "scent of old books",
            "faint perfume lingering in the air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "candlelight flickering on tables",
            "guests mingling in the lobby",
            "the ocean shimmering under moonlight",
            "long shadows stretching across the floor"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "laughter rising and falling",
            "soft jazz playing in the background",
            "the rustle of evening attire",
            "the distant crash of waves"
          ],
          "smells": [
            "scent of candle wax",
            "tobacco smoke lingering",
            "freshly baked pastries",
            "the ocean breeze carrying salt",
            "the earthy aroma of wet sand"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of the Cliffside Hotel is a spectacle of elegance, where high ceilings soar above marble floors and art deco chandeliers cast a warm glow. Guests gather here, exchanging pleasantries and furtive glances, while the distant roar of the ocean serves as a constant reminder of the storm outside. The atmosphere is thick with anticipation, as if every whispered conversation holds a secret waiting to be uncovered.",
        "As the day wears on, the lobby transforms. The flickering candlelight creates dancing shadows, and the scent of polished wood mingles with the salty air. The crackle of the radio fills the space with news of the outside world, but here, within these walls, time seems to stand still. The tension is palpable, as guests find themselves drawn into the mysteries that swirl around them, each one a potential suspect in the unfolding drama."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Dining and socializing space for guests",
      "visualDetails": "Large windows framing ocean views, elegantly set tables with fine china, and soft lighting creating an intimate atmosphere.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on crisp white tablecloths",
          "ocean waves crashing against rocks",
          "guests savoring their meals",
          "floral arrangements on tables",
          "twinkling candle flames"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft laughter and chatter",
          "the rustle of napkins",
          "the hum of conversation",
          "the distant roar of the ocean"
        ],
        "smells": [
          "roasted meats and fresh bread",
          "scent of sea salt",
          "aroma of rich desserts",
          "hint of wine and spirits",
          "fresh flowers on the tables"
        ],
        "tactile": [
          "smooth china under fingertips",
          "heavy crystal glasses",
          "soft linen napkins",
          "warmth from nearby candles",
          "cool breeze from open windows"
        ]
      },
      "accessControl": "Open to all guests during meal times; staff access during food preparation hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "foggy view obscured by rain",
            "dim light filtering through clouds",
            "wet surfaces gleaming",
            "empty tables awaiting breakfast",
            "raindrops tracing patterns on windows"
          ],
          "sounds": [
            "soft patter of rain on windows",
            "muffled voices from the kitchen",
            "the clink of dishes being prepared",
            "the distant rumble of thunder",
            "the sizzle of food on the stove"
          ],
          "smells": [
            "freshly baked pastries",
            "brewing coffee",
            "cooked bacon and eggs",
            "scent of damp earth",
            "faint aroma of mildew"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "clouds casting shadows over the room",
            "dim light creating a somber atmosphere",
            "waitstaff moving between tables",
            "the ocean a grey blur outside",
            "faded photographs on the walls"
          ],
          "sounds": [
            "soft murmurs of conversation",
            "the clatter of dishes",
            "the rustle of menus",
            "the creak of chairs",
            "the sound of waves crashing in the distance"
          ],
          "smells": [
            "scent of freshly baked bread",
            "the tang of sea air",
            "aroma of rich sauces",
            "hint of spices in the air",
            "faint floral scent from table arrangements"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight illuminating tables",
            "guests dressed in evening attire",
            "the ocean reflecting the sunset",
            "soft shadows dancing on walls",
            "twinkling stars visible through windows"
          ],
          "sounds": [
            "soft music playing in the background",
            "laughter and clinking glasses",
            "the rustle of fine linen",
            "the sound of waves gently crashing",
            "the tick of a clock in the corner"
          ],
          "smells": [
            "scent of grilled fish",
            "aroma of herbs and spices",
            "freshly opened wine",
            "the sweetness of dessert",
            "the salty tang of the ocean breeze"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Dining Room of the Cliffside Hotel is a feast for the senses, where the scent of roasted meats and fresh bread mingles with the salty air. Guests gather around elegantly set tables, and the soft light creates an intimate atmosphere despite the brewing storm outside. Conversations flow, but beneath the surface lies a current of tension, as each guest savors not only their meal but the mysteries lurking in the shadows.",
        "As the evening wears on, the ambiance shifts. The flicker of candlelight dances across the walls, and the sound of clinking glasses punctuates the air. But even amidst laughter and fine dining, a sense of foreboding lingers. The waves crash against the cliffs outside, echoing the turmoil within, as secrets and suspicions simmer just beneath the surface."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "Guest Rooms",
      "type": "interior",
      "purpose": "Private accommodations for guests",
      "visualDetails": "Tastefully decorated with vintage furnishings, large windows offering ocean views, and shared balconies for each room.",
      "sensoryDetails": {
        "sights": [
          "softly lit lamps casting a warm glow",
          "elegant furnishings in muted tones",
          "ocean waves visible from windows",
          "personal belongings scattered",
          "the outline of a figure in the balcony"
        ],
        "sounds": [
          "the rustle of fabric as guests move",
          "the creaking of floorboards",
          "distant conversations from the hallway",
          "the crash of waves against the cliffs",
          "the soft ticking of a clock"
        ],
        "smells": [
          "scent of sea salt wafting in",
          "fresh linen and soap",
          "hint of perfume lingering",
          "the stale odor of old wood",
          "faint aroma of tobacco"
        ],
        "tactile": [
          "soft bedding against skin",
          "cool glass of the window pane",
          "the chill of the ocean breeze",
          "texture of worn upholstery",
          "smoothness of polished wood"
        ]
      },
      "accessControl": "Restricted to assigned guests only; staff may enter for cleaning during designated hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops racing down the windows",
            "mist obscuring the view",
            "grey light filtering in",
            "clothes draped over chairs",
            "the outline of a figure peering out"
          ],
          "sounds": [
            "steady rhythm of rain",
            "distant thunder rumbling",
            "the soft sigh of someone waking",
            "the creak of old furniture",
            "the rustle of a newspaper"
          ],
          "smells": [
            "fresh linen mixed with dampness",
            "scent of wet earth outside",
            "hint of mildew in the corners",
            "the faint aroma of breakfast wafting up",
            "the salty sea air"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "the ocean appearing as a grey sheet",
            "personal items scattered across the room",
            "the flicker of a distant radio",
            "shadows moving past the door"
          ],
          "sounds": [
            "soft murmurs from neighboring rooms",
            "the ticking of a clock on the wall",
            "the rustle of a newspaper being turned",
            "the crash of waves echoing outside",
            "the creak of the building settling"
          ],
          "smells": [
            "scent of damp wood",
            "the faint odor of old leather",
            "the lingering perfume of a departing guest",
            "the saltiness of ocean air",
            "the aroma of brewed coffee wafting from below"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight illuminating the room",
            "the ocean reflecting the last light",
            "shadows dancing on the walls",
            "the silhouette of a figure on the balcony",
            "the soft glow of lamps"
          ],
          "sounds": [
            "soft music drifting from the lobby",
            "the distant laughter of guests",
            "the sound of the ocean crashing",
            "the rustle of fabric as someone moves",
            "the ticking of a clock"
          ],
          "smells": [
            "scent of fresh linen",
            "the lingering aroma of dinner",
            "the salty breeze from the ocean",
            "the faint hint of perfume",
            "the warmth of candles burning"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Guest Rooms of the Cliffside Hotel are a sanctuary of comfort and elegance, but tonight, they feel charged with an unsettling energy. Softly lit lamps cast a warm glow over vintage furnishings, and the sound of waves crashing against the cliffs fills the air. Each room holds its own secrets, as guests navigate the delicate balance between relaxation and the undercurrents of tension that permeate the hotel.",
        "As the evening unfolds, the atmosphere shifts. The flicker of candlelight creates dancing shadows, and the scent of fresh linen mingles with the salty sea air. Outside, the ocean reflects the last light of day, while inside, the soft ticking of a clock marks the passage of time. In these intimate quarters, the weight of unspoken words and hidden motives becomes almost palpable, as each guest grapples with their own reflections of deceit."
      ]
    },
    {
      "id": "balcony",
      "name": "Shared Balcony",
      "type": "transitional",
      "purpose": "Outdoor space for guests to enjoy views and fresh air",
      "visualDetails": "Narrow walkway with wrought-iron railings, overlooking the ocean, with glimpses of the rugged cliffs below.",
      "sensoryDetails": {
        "sights": [
          "waves crashing against the rocks",
          "distant ships on the horizon",
          "flickering lights from the hotel",
          "clouds gathering in the sky",
          "the outline of guests in silhouette"
        ],
        "sounds": [
          "the roar of the ocean below",
          "the rustle of clothing in the wind",
          "distant laughter from the dining room",
          "the sound of rain beginning to fall",
          "the creak of the balcony underfoot"
        ],
        "smells": [
          "fresh sea air mixed with rain",
          "the scent of damp wood",
          "salt and brine from the ocean",
          "faint aroma of flowers from the gardens",
          "the lingering scent of tobacco"
        ],
        "tactile": [
          "cool metal of the railing",
          "the chill of the ocean breeze",
          "texture of weathered wood underfoot",
          "the dampness of the air",
          "the softness of fabric against skin"
        ]
      },
      "accessControl": "Shared access for guests on the same floor; monitored for security.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops splattering on the railing",
            "fog enveloping the cliffs",
            "dim light filtering through clouds",
            "the ocean a grey blur",
            "the outline of soaked guests"
          ],
          "sounds": [
            "steady patter of rain",
            "the roar of waves crashing",
            "distant thunder rumbling",
            "the rustle of umbrellas",
            "the soft murmur of conversation"
          ],
          "smells": [
            "scent of damp earth",
            "brine from the ocean",
            "fresh rain mixing with salt",
            "the faint aroma of wet flowers",
            "the mustiness of wet wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "clouds casting shadows over the sea",
            "the ocean a dull slate grey",
            "shadows of guests moving about",
            "faint outlines of ships in the distance",
            "the outline of the hotel against the sky"
          ],
          "sounds": [
            "soft murmur of conversation",
            "the crash of waves",
            "the creak of the balcony",
            "the rustle of clothing in the wind",
            "the sound of distant laughter"
          ],
          "smells": [
            "scent of salt and sea",
            "the dampness of the air",
            "aroma of flowers from the gardens",
            "the faint odor of tobacco",
            "the freshness of the ocean breeze"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the sky in hues",
            "the ocean shimmering under fading light",
            "stars beginning to twinkle",
            "the silhouette of guests against the horizon",
            "the flickering lights of the hotel"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "laughter from the dining room",
            "the rustle of leaves in the breeze",
            "the distant sound of music",
            "the soft creaking of the railing"
          ],
          "smells": [
            "scent of warm ocean air",
            "the freshness of the evening breeze",
            "the aroma of dinner wafting up",
            "the faint scent of flowers",
            "the lingering smell of tobacco"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Shared Balcony of the Cliffside Hotel offers a breathtaking view of the ocean, but tonight, it feels more like a precipice than a refuge. Guests stand in silhouette against the fading light, their conversations hushed as they peer out over the churning waves. The air is heavy with the scent of salt and rain, and the distant sound of thunder adds to the sense of impending doom that hangs over the hotel.",
        "As darkness falls, the balcony transforms into a place of secrets. Shadows dance in the flickering light, and the tension between guests becomes palpable. The gentle lapping of the waves below is a stark contrast to the turmoil brewing within, as unspoken words and hidden motives linger in the cool night air, waiting to be revealed."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028016125499999997,
  "durationMs": 60613
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1946,
    "month": "May",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "overcast with occasional rain",
      "mild temperatures around 60°F",
      "coastal breezes bringing humidity"
    ],
    "daylight": "Long spring days with sunset around eight o'clock, allowing for extended evening activities",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, just after dinner service in the hotel",
    "holidays": [
      "May Day (May 1)",
      "Mother's Day (May 12)"
    ],
    "seasonalActivities": [
      "beach strolls",
      "garden parties",
      "voyages on fishing boats"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suit jacket",
        "lightweight wool trousers",
        "dress shirt with a narrow tie"
      ],
      "casual": [
        "button-down short-sleeve shirt",
        "linen slacks",
        "deck shoes"
      ],
      "accessories": [
        "fedora hat",
        "leather belt",
        "pocket square"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with floral patterns",
        "tailored blazer",
        "string of pearls"
      ],
      "casual": [
        "capri pants paired with a fitted blouse",
        "sundress with a wide-brimmed hat",
        "espadrilles"
      ],
      "accessories": [
        "silk scarf",
        "clutch purse",
        "broad-brimmed sun hat"
      ]
    },
    "trendsOfTheMoment": [
      "pastel colors in clothing",
      "emphasis on feminine silhouettes",
      "influence of Hollywood styles"
    ],
    "socialExpectations": [
      "men expected to wear suits for dining",
      "women encouraged to dress elegantly for social events",
      "emphasis on modesty and propriety in public appearances"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Germany's division into East and West is being formalized",
      "the first meeting of the United Nations General Assembly took place in New York",
      "the Nuremberg Trials are entering their final stages"
    ],
    "politicalClimate": "Heightened tensions as nations navigate the aftermath of WWII and the start of the Cold War",
    "economicConditions": "Struggling to rebuild after war; rationing is still in effect for some goods, while consumer spending is rising",
    "socialIssues": [
      "debate over returning soldiers to the workforce",
      "women's rights in employment",
      "racial segregation issues still prevalent"
    ],
    "internationalNews": [
      "US and Soviet Union relations are rapidly deteriorating",
      "decolonization movements gaining momentum in Asia and Africa"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Chattanooga Choo Choo' by Glenn Miller",
        "'Don't Fence Me In' by Bing Crosby",
        "'Ain't That a Kick in the Head?' by Dean Martin"
      ],
      "films": [
        "'The Best Years of Our Lives'",
        "'It's a Wonderful Life'",
        "'The Killers'"
      ],
      "theater": [
        "'Annie Get Your Gun'",
        "'The Glass Menagerie'",
        "'A Streetcar Named Desire'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Shadow'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'Brave New World' by Aldous Huxley",
        "'The Postman Always Rings Twice' by James M. Cain"
      ],
      "popularGenres": [
        "mystery",
        "detective fiction",
        "post-war literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "ballpoint pen",
        "early home refrigerators",
        "television sets gaining popularity"
      ],
      "commonDevices": [
        "radio receivers",
        "black-and-white televisions",
        "simple kitchen appliances"
      ],
      "emergingTrends": [
        "increase in consumer goods production",
        "growth of the automobile industry",
        "advancements in radar technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "attending local fairs",
        "hosting backyard barbecues",
        "family picnics at the beach"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "afternoon tea gatherings",
        "attending church services weekly"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing middle class as economy stabilizes",
      "increased interaction between classes in public spaces"
    ],
    "gender": [
      "women's role in society is evolving post-war",
      "expectations for women to balance home and work"
    ],
    "race": [
      "tensions remain high around civil rights issues",
      "increasing awareness of racial segregation and its impacts"
    ],
    "generalNorms": [
      "emphasis on traditional family values",
      "public decorum is highly valued",
      "increased acceptance of women's independence but still with societal pushback"
    ]
  },
  "atmosphericDetails": [
    "The scent of saltwater mingling with the aroma of blooming flowers fills the air, punctuated by the occasional downpour that leaves the pavement glistening.",
    "Echoes of laughter and clinking glasses from the hotel's dining room carry through the damp evening, creating a backdrop of buoyancy against the tension of the times.",
    "The low hum of a radio broadcasting the latest news weaves through the conversations, interspersed with the sounds of waves crashing against the shore, creating a dissonance between hope and lingering fear."
  ],
  "paragraphs": [
    "In May 1946, the seaside hotel stands as a sanctuary against the backdrop of a world grappling with the aftermath of war. The hotel buzzes with activity; guests wander the hallways, their laughter sometimes swallowed by the ominous clouds that loom overhead. The coastal air is fresh yet heavy with humidity, challenging the vibrant spring blooms that struggle against the occasional rain. Days are long and filled with promise, yet the tension of the recent past lingers in the air, casting a shadow over the joy of the season. The onset of summer brings the hope of leisure, but the specter of uncertainty remains, as guests slip into the familiar routines of beach strolls and evening gatherings, all while the distant rumble of the ocean reminds them of the tumultuous world outside.",
    "Fashion in May 1946 reflects a society still transitioning from wartime austerity to peacetime vibrancy. Men don double-breasted suits paired with lightweight trousers, their fedoras tipped at a jaunty angle, while women embrace tea-length dresses adorned with floral patterns, their ensembles often accented by a string of pearls or a silk scarf. The colors of spring are reflected in the pastels and soft fabrics, creating a lively palette that contrasts with the heavy clouds above. The emphasis on elegance and propriety is pronounced, with expectations that even casual outings require a touch of sophistication. This attention to attire encapsulates the hope and aspiration of a society in reinvention, where every outfit becomes a statement of new beginnings.",
    "As the sun sets and the hotel begins to settle into the evening's calm, the sounds of radio broadcasts fill the air, playing popular tunes from the likes of Glenn Miller and Bing Crosby, while guests gather around tables for dinner. The prices remain reasonable, with a loaf of bread costing a mere four pence and movie tickets still within reach for most. Social rituals are honored, with Sunday family dinners and afternoon teas serving as anchors in a rapidly changing landscape. Yet, the tension of the post-war era permeates daily life; discussions around the dinner table often turn to the future, the struggles of returning soldiers, and the ongoing fight for equality. The mood is a complex tapestry of optimism and apprehension, reflecting a society that is both hopeful and cautious as it navigates the new world."
  ],
  "note": "",
  "cost": 0.00113834655,
  "durationMs": 23339
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "An inheritance dispute among hotel guests, complicated by post-war societal shifts and Cold War tensions, draws a diverse cast into a web of secrets and deception.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The post-WWII adjustment fosters a mix of traditional hierarchies and emerging roles, particularly with women entering the workforce, creating both camaraderie and competition among the guests."
  },
  "setting": {
    "location": "An elegant 1940s seaside hotel overlooking the ocean",
    "institution": "seaside hotel",
    "weather": "overcast with occasional rain, typical of a coastal climate in late autumn"
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
    "value": "forty-five degrees",
    "description": "The precise angle of the mirror that misled the witness."
  },
  {
    "id": "distance_misleading",
    "value": "twelve feet",
    "description": "The distance from the mirror to the victim, creating the illusion of proximity."
  },
  {
    "id": "time_of_crime",
    "value": "ten minutes past ten",
    "description": "The exact time the murder was staged to mislead the timeline."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 21,
  "countsByPlacement": {
    "early": 7,
    "mid": 13,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 20,
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
      "category": "physical"
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
      "category": "testimonial"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
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
      "category": "behavioral"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
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
      "category": "spatial"
    },
    {
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "mid",
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
      "id": "clue_early_2",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_2",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
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
      "category": "spatial"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
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
