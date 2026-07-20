# Actual Prompt Record

- Run ID: `mystery-1784570276364`
- Project ID: ``
- Timestamp: `2026-07-20T18:03:13.108Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `e6b6b5eed820aa35`

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
    "title": "The Delayed Deception",
    "author": "Agent 9",
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
      "subtype": "delayed-action poison"
    }
  },
  "death_method": "poisoned with a botanical extract",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Caring and observant hotel manager",
      "private_secret": "Struggles with the pressures of post-war life",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "night of the incident",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel management duties",
        "access to all rooms"
      ],
      "behavioral_tells": [
        "calm under pressure",
        "often seen taking notes"
      ],
      "stakes": "Need to maintain hotel's reputation",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Harbored secrets about medical practices",
      "motive_seed": "inheritance",
      "motive_strength": "unknown",
      "alibi_window": "n/a",
      "access_plausibility": "n/a",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspicious guest",
      "relationships": [],
      "public_persona": "Charming but secretive",
      "private_secret": "Has a past with the victim",
      "motive_seed": "Jealousy from unrequited affection",
      "motive_strength": "high",
      "alibi_window": "dinner time",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "guest access to hotel rooms"
      ],
      "behavioral_tells": [
        "nervousness when discussing Dr. Finch"
      ],
      "stakes": "Protecting his reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Hotel staff",
      "relationships": [],
      "public_persona": "Helpful and friendly",
      "private_secret": "Knew about Dr. Finch's secrets",
      "motive_seed": "Fear of exposure",
      "motive_strength": "moderate",
      "alibi_window": "after dinner",
      "access_plausibility": "high",
      "opportunity_channels": [
        "staff access to all areas"
      ],
      "behavioral_tells": [
        "eager to please",
        "fidgety when questioned"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Young guest",
      "relationships": [],
      "public_persona": "Innocent and naive",
      "private_secret": "Had a secret crush on Dr. Finch",
      "motive_seed": "Desperation for attention",
      "motive_strength": "low",
      "alibi_window": "during the event",
      "access_plausibility": "low",
      "opportunity_channels": [
        "wasn't in the vicinity"
      ],
      "behavioral_tells": [
        "overly enthusiastic",
        "quick to defend others"
      ],
      "stakes": "Personal reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Mysterious guest",
      "relationships": [],
      "public_persona": "Reserved and observant",
      "private_secret": "Has connections with questionable individuals",
      "motive_seed": "Potential blackmail",
      "motive_strength": "high",
      "alibi_window": "after the incident",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "guest access to hotel facilities"
      ],
      "behavioral_tells": [
        "avoids eye contact",
        "often seen writing notes"
      ],
      "stakes": "Maintaining a cover",
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
      "summary": "In the overcast coastal town of Brighton, a respected physician, Dr. Mallory Finch, is found dead in her hotel room. As the hotel manager, Eleanor Voss must navigate through a web of jealousy, secrets, and unrequited love to unveil the truth behind the delayed-action poison that killed Dr. Finch."
    },
    "accepted_facts": [
      "Dr. Mallory Finch was found dead in her hotel room.",
      "The cause of death was determined to be poisoning.",
      "Several guests had access to Dr. Finch's room."
    ],
    "inferred_conclusions": [
      "The murderer had to have a motive related to Dr. Finch.",
      "The poison was administered in a manner that delayed its effects."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on poison, victim, and floor to expose the false timing.",
      "delivery_path": [
        {
          "step": "The key appears ordinary, but contains a hidden compartment that releases poison upon contact with moisture."
        },
        {
          "step": "The poison is a botanical extract that requires a specific temperature to dissolve and become lethal, which aligns with the humidity levels in the victim's room."
        }
      ]
    },
    "outcome": {
      "result": "The poison was absorbed through the key used by the victim, leading to her untimely death."
    }
  },
  "false_assumption": {
    "statement": "Dr. Mallory Finch's death was due to a sudden health crisis.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses noted her fatigue and stress prior to the incident.",
    "what_it_hides": "The true nature of the poisoning mechanism and the motive behind it."
  },
  "false_solution": {
    "accused_suspect": "Beatrice Quill",
    "supporting_points": [
      "Beatrice was in the kitchen before the dinner where Dr. Finch fell ill.",
      "Witnesses heard Beatrice arguing with Dr. Finch days before the incident."
    ],
    "the_one_flaw": "Beatrice was seen with a solid alibi during the poisoning window.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses reported seeing Captain Hale near Dr. Finch's room shortly before her death.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was delivering a message from another guest.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Hugo Vane's mysterious phone calls raised suspicion.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "He was discussing business matters unrelated to Dr. Finch.",
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
    "rationale": "All suspects were present at the hotel at the time of the incident."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dr. Finch's last known movements before dinner",
        "Time of death determined by the coroner"
      ],
      "windows": [
        "Dinner service time and the time of symptoms onset"
      ],
      "contradictions": [
        "Witnesses claim Dr. Finch was seen healthy prior to dinner, contradicting her sudden death."
      ]
    },
    "access": {
      "actors": [
        "All suspects had access to Dr. Finch's room."
      ],
      "objects": [
        "The key to Dr. Finch's room was missing just before her death."
      ],
      "permissions": [
        "Staff had access to guest rooms for maintenance."
      ]
    },
    "physical": {
      "laws": [
        "The botanical poison requires moisture to activate."
      ],
      "traces": [
        "Residue of the poison was found on the key."
      ]
    },
    "social": {
      "trust_channels": [
        "Staff generally trusted guests to behave appropriately."
      ],
      "authority_sources": [
        "Hotel management had authority over room access."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The key to Dr. Finch's room was found on the floor near her bed, slightly damp.",
        "correction": "The key must have been involved in the poisoning based on its condition.",
        "effect": "Narrows the potential method of poisoning to the use of the key.",
        "required_evidence": [
          "The key was found damp from a spilled drink.",
          "The hotel manager recalls that the key was left out to dry after being used."
        ],
        "reader_observable": true
      },
      {
        "observation": "A residue consistent with the botanical poison is found on the key.",
        "correction": "The residue indicates that the key was used to deliver the poison to Dr. Finch.",
        "effect": "Eliminates the possibility of natural causes for Dr. Finch's death.",
        "required_evidence": [
          "A small residue of the poison is detected on the key.",
          "The victim's symptoms began shortly after key usage."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses confirm that Captain Hale was seen near Dr. Finch’s room shortly before her death.",
        "correction": "While suspicious, he was actually delivering a message and could not have poisoned her.",
        "effect": "Eliminates Captain Hale from culpability.",
        "required_evidence": [
          "Witnesses heard Captain Hale delivering a message.",
          "He was seen leaving the vicinity before Dr. Finch’s symptoms began."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled reenactment is staged where the key is used under conditions of humidity to see if it releases poison.",
    "knowledge_revealed": "The revealed facts are poison, confirm, and floor.",
    "pass_condition": "If the reenactment shows the key releasing poison, it implicates the murderer as the only one with access to it.",
    "evidence_clues": [
      "clue_6",
      "clue_core_contradiction_chain",
      "clue_1",
      "clue_damp_key"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The damp key (early) and its residue (mid) reveal the poisoning mechanism. Step 2: Witness consistency (mid) eliminates Captain Hale. Step 3: The reenactment (discriminating test) confirms the poisoned key implicates the true culprit."
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
        "Observe the key's reaction with moisture",
        "Draw conclusion about guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by hotel logs showing her duties.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her alibi is verified through other guests.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Business calls confirmed unrelated to Dr. Finch.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: n/a",
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_damp_key",
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
        "clue_id": "clue_residue",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Found during investigation"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_8",
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
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_reenactment",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Controlled test"
      },
      {
        "clue_id": "clue_witness_testimony",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness accounts"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A travel journalist caught between her adventurous spirit and the haunting shadows of her past, Eleanor finds herself drawn into a deadly intrigue at a seaside hotel.",
    "publicPersona": "Charming and adventurous, known for her captivating stories of distant lands.",
    "privateSecret": "Struggles with her own unfulfilled dreams and a sense of loss from the war.",
    "motiveSeed": "Invited to cover a luxury conference at the hotel, she feels drawn to uncover the truth behind the events.",
    "motiveStrength": "moderate",
    "alibiWindow": "arrived at the hotel two days prior to the murder",
    "accessPlausibility": "easy",
    "stakes": "a chance to elevate her career by uncovering a sensational story",
    "humourStyle": "dry_wit",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with an engaging rhythm, often weaving in anecdotes from her travels. She has a tendency to punctuate her observations with ironic quips that reveal her keen perception of human nature.",
    "signatureTic": "Well, it's not exactly a tropical paradise, is it?",
    "internalConflict": "Haunted by the ghosts of her unfulfilled ambitions, Eleanor grapples with the fear that her life may never hold the excitement she craves.",
    "personalStakeInCase": "The murder offers her a chance to reclaim her sense of purpose and make a name for herself in a world that often overlooks her.",
    "paragraphs": [
      "Eleanor Voss arrived at the seaside hotel with the kind of bright-eyed enthusiasm that could only come from a mind filled with dreams of adventure. But beneath her charming exterior lay the weight of unfulfilled aspirations and a nagging sense of loss, remnants of a world torn apart by war. As a travel journalist, she had always been drawn to stories that transported her far from the mundane, but now she found herself in a location that felt both foreign and achingly familiar.",
      "The conference she was covering promised luxury and glamour, but as the days wore on, Eleanor sensed an undercurrent of tension among the guests. It was during one of her casual conversations that she first heard whispers of the victim, a prominent figure in mental health advocacy whose ideas threatened to overshadow her own. The thought of uncovering the truth behind the murder ignited a flicker of hope within her—a chance not only to write the story of a lifetime but to confront her own fears about failure.",
      "Eleanor's investigative instincts kicked in, her keen eye for detail sharpened by years of navigating foreign landscapes. As she delved deeper into the lives of the guests, she found herself entangled in a web of secrets and resentments. A part of her relished the thrill of the chase, but another part trembled at the thought of what might be revealed. Would the truth set her free, or would it ensnare her in a darkness she couldn't escape?",
      "With each new revelation, Eleanor felt the weight of her own shortcomings pressing down on her. The shadows of her past, the dreams she had let slip away, loomed larger than ever. Yet, as she pieced together the fragments of a story that threatened to consume her, she began to realize that perhaps the real mystery lay not in the murder itself, but in her own journey toward self-discovery. Could she confront the ghosts of her past and emerge stronger, or would the darkness of her fears swallow her whole?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected psychiatrist with a carefully curated public persona, Dr. Mallory Finch harbors deep-seated resentment and fears that her career may crumble under the weight of a rival's growing influence.",
    "publicPersona": "Respected in her field, always composed and rational.",
    "privateSecret": "Harbors resentment towards those who belittle her profession, especially men.",
    "motiveSeed": "Felt threatened by the victim's growing influence on mental health advocacy, which could overshadow her career.",
    "motiveStrength": "moderate",
    "alibiWindow": "in a meeting with patients during the estimated time of death",
    "accessPlausibility": "possible",
    "stakes": "losing her reputation and professional credibility if the victim's ideas took precedence",
    "humourStyle": "blunt",
    "humourLevel": 0.2,
    "speechMannerisms": "Dr. Finch speaks with a clinical precision, often punctuating her observations with terse remarks. She has a tendency to dismiss emotional responses, favoring rational discourse, and rarely indulges in humor unless it's subtly sardonic.",
    "signatureTic": "Let's not waste time on sentimentality.",
    "internalConflict": "Struggles with the fear that her professional worth is tied solely to the opinions of others, particularly in a male-dominated field.",
    "personalStakeInCase": "The victim's death threatens to unravel the delicate balance of her career, forcing her to confront both her biases and her insecurities.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the precipice of her carefully constructed life, a respected psychiatrist whose composed demeanor belied the turbulence beneath. In her world of clinical precision, emotions were a weakness, and she had learned to navigate the male-dominated field with a blend of intelligence and steely resolve. Yet, the growing influence of her rival, the victim, had ignited a resentment that simmered just below the surface.",
      "As she sat in her office, the walls adorned with accolades and degrees, Mallory's thoughts drifted to the recent conference where the victim had confidently challenged her views on mental health. It was a moment that had left her reeling, her professional credibility hanging in the balance. The whispers of a new paradigm in psychiatry threatened to overshadow her contributions, and the fear of becoming obsolete gnawed at her insides.",
      "The day of the murder, she had been in a meeting with patients, her alibi seemingly solid. But as the investigation unfolded, the threads of her carefully woven narrative began to fray. Mallory found herself grappling with the unsettling realization that her resentment had blinded her to the potential of collaboration. Could her disdain for the victim's methods be rooted in her own insecurities? The thought was as unsettling as it was illuminating.",
      "With each revelation about the murder, Mallory's internal conflict intensified. The fear of losing her reputation clashed with the desire to embrace a more progressive approach to her field. In the depths of her mind, the question lingered: could she confront her biases and learn to accept that strength could come from collaboration rather than competition? The unraveling of the case may very well lead her down a path of self-discovery she had long avoided."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer grappling with PTSD and the shifting societal landscape, Captain Ivor Hale's bravado masks deep insecurities and a personal grudge against the victim.",
    "publicPersona": "Bravely served in the war, now a local hero.",
    "privateSecret": "Struggles with PTSD and feels emasculated by the changing roles of women post-war.",
    "motiveSeed": "Holds a personal grudge against the victim for disrespecting his authority at a social gathering.",
    "motiveStrength": "moderate",
    "alibiWindow": "playing cards with fellow guests at the estimated time of death",
    "accessPlausibility": "unlikely",
    "stakes": "Fear of losing his status in the community and being replaced by younger, more progressive individuals.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a commanding presence, often punctuating his statements with dry, self-deprecating humor. His speech carries a weight of authority, yet he occasionally slips into vulnerable admissions that reveal his inner turmoil.",
    "signatureTic": "I suppose that's just the way the tide turns.",
    "internalConflict": "Struggles with feelings of inadequacy and the fear that he no longer holds relevance in a rapidly changing world.",
    "personalStakeInCase": "The murder threatens his carefully curated image of respect and authority, forcing him to confront his fears of irrelevance.",
    "paragraphs": [
      "Captain Ivor Hale, once a figure of authority and bravery on the high seas, now found himself adrift in a world that seemed to have left him behind. The war had bestowed upon him a hero's status, but the specter of PTSD loomed large, casting shadows over his bravado. He often masked his insecurities with self-deprecating humor, but beneath the surface lay a man grappling with feelings of emasculation in a society that was rapidly evolving.",
      "At the seaside hotel, Ivor had been playing cards with fellow guests during the estimated time of the murder, a façade of camaraderie that belied the turmoil within. The victim, a woman who had openly challenged his authority at a social gathering, had become a focal point of his resentment. Her growing influence in the community threatened not only his status but also the very foundation of the world he had fought to protect.",
      "As he navigated the investigative murmurings surrounding the murder, Ivor felt the weight of suspicion pressing down upon him. The memories of his time in the navy haunted him, and the thought of being accused of a crime he did not commit sent shivers down his spine. It was a cruel twist of fate, one that forced him to confront not only the possibility of losing his reputation but also the deeper fear of becoming obsolete in a world that no longer revered the old guard.",
      "With each revelation, Ivor's internal conflict intensified. The murder investigation had become a mirror reflecting his own insecurities. Could he reconcile his past with the present, or would he continue to cling to a fading idea of masculinity? As the tides of change surged around him, Ivor found himself at a crossroads, faced with the choice to either adapt or be swept away by the currents of progress."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A fashion designer on the brink of success, Beatrice Quill struggles with financial pressures and the fear of failure as she navigates the treacherous waters of the fashion industry.",
    "publicPersona": "Fashion-forward and modern, often seen as a trendsetter.",
    "privateSecret": "Struggling with debts and fears of failure in her business.",
    "motiveSeed": "The victim had criticized her designs publicly, risking her future in the industry.",
    "motiveStrength": "moderate",
    "alibiWindow": "at a show rehearsal during the time of the murder",
    "accessPlausibility": "possible",
    "stakes": "Needs to secure her reputation to keep her fledgling business afloat.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with an artistic flair, often using vivid imagery and metaphors to describe her designs. Her humor is laced with a sardonic edge, reflecting her awareness of the industry's fickleness.",
    "signatureTic": "It's all just a matter of style, darling.",
    "internalConflict": "Battles with the fear that her worth is tied to her success in a cutthroat industry, leading to emotional withdrawal from those around her.",
    "personalStakeInCase": "The murder threatens her reputation in the fashion world, forcing her to confront her own insecurities and the potential for failure.",
    "paragraphs": [
      "Beatrice Quill floated through the halls of the seaside hotel like a breath of fresh air, a fashion designer whose creativity knew no bounds. Yet, beneath the surface of her trendsetting persona lay a tumultuous undercurrent of fear. The whispers of debt and failure echoed in her mind, a constant reminder that the world of fashion was as fickle as the tides outside her window.",
      "At the recent conference, the victim had publicly criticized her designs, a moment that had felt like a dagger to her heart. As she prepared for a show rehearsal during the time of the murder, Beatrice was acutely aware that her future in the industry hung by a thread. The stakes had never been higher, and the pressure to succeed weighed heavily on her shoulders. Would her artistic vision be enough to secure her place in a world that demanded perfection?",
      "The murder investigation unfolded around her like a dramatic runway show, filled with intrigue and suspicion. Beatrice's sardonic wit often surfaced in her interactions, a defense mechanism against the harsh realities of her industry. Yet, as she navigated the treacherous waters of the investigation, she realized that her emotional withdrawal from others was only deepening her isolation.",
      "With each new piece of information, Beatrice found herself confronting her internal conflict head-on. The fear of failure was a relentless specter, urging her to either rise above the criticism or succumb to the weight of her insecurities. In a world where style reigned supreme, could she find the strength to embrace her true self and redefine her worth beyond the accolades of others?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A governess with a nurturing spirit, Sylvia Trent hides a tumultuous past as a war nurse, struggling with the emotional scars of her experience and the pressures of societal expectations.",
    "publicPersona": "Compassionate and nurturing, beloved by children and families.",
    "privateSecret": "Has a hidden past as a war nurse, leading to PTSD and emotional withdrawal.",
    "motiveSeed": "Resented the victim for pressuring her to conform to traditional expectations of a woman.",
    "motiveStrength": "moderate",
    "alibiWindow": "looking after the children of guests at the hotel during the murder time",
    "accessPlausibility": "possible",
    "stakes": "Fears losing her job if her past comes to light.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with a gentle cadence, often infusing her observations with warmth and empathy. Her humor is subtle, often arising from her keen observations about human nature and societal norms.",
    "signatureTic": "Life has a way of surprising us, doesn't it?",
    "internalConflict": "Struggles with her past experiences and the societal pressures that dictate her role as a woman, leading to emotional withdrawal.",
    "personalStakeInCase": "The murder investigation threatens to unearth her hidden past, forcing her to confront her trauma and redefine her identity.",
    "paragraphs": [
      "Sylvia Trent moved through the hotel with the grace of someone who had spent years nurturing the spirits of others, her gentle demeanor endearing her to both children and families alike. Yet, beneath the surface of her compassion lay a tumultuous past as a war nurse, a history that had left her with emotional scars and the weight of PTSD. As she attended to the children of guests during the murder, her heart raced with the fear of being discovered.",
      "The victim, a woman who embodied the very expectations Sylvia had long resented, had pressured her to conform to traditional ideals of femininity. In the quiet moments between her duties, Sylvia found herself grappling with the resentment that bubbled beneath her nurturing exterior. Could she ever escape the confines of societal expectations, or was she forever bound by the chains of her past?",
      "As the investigation unfolded, Sylvia's observational humor surfaced, a subtle defense against the turmoil within. She often found herself commenting on the absurdities of the situation, using her keen insight to navigate the complexities of human nature. Yet, each quip was tinged with a deeper sadness, a reminder of the emotional withdrawal that had become her shield.",
      "With each revelation surrounding the murder, Sylvia's internal conflict deepened. The fear of losing her job weighed heavily on her, but the potential for confronting her past offered a glimmer of hope. Could she find the strength to embrace her true self, to redefine her identity beyond the expectations placed upon her? In a world fraught with danger and uncertainty, Sylvia stood at a crossroads, poised to either reclaim her life or remain a prisoner of her own history."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A powerful investor teetering on the brink of financial ruin, Hugo Vane's ruthless ambition conceals a desperate fear of losing everything he's built.",
    "publicPersona": "Powerful and shrewd, a figure of wealth and influence.",
    "privateSecret": "Worried about his collapsing investments and was rumored to be in financial trouble.",
    "motiveSeed": "The victim threatened to expose his financial misdeeds, which would ruin him.",
    "motiveStrength": "strong",
    "alibiWindow": "attending a dinner with other guests at the time of the murder",
    "accessPlausibility": "unlikely",
    "stakes": "His entire financial empire and reputation are at stake.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks with a calculated eloquence, often laced with an undercurrent of sarcasm. His dialogue is polished, reflecting his status, but he occasionally lets slip a more savage edge when pressed.",
    "signatureTic": "Ah, the cost of ambition, wouldn't you agree?",
    "internalConflict": "Wrestles with the fear that his relentless pursuit of wealth has led him to a precipice of ruin, forcing him to confront the emptiness of his success.",
    "personalStakeInCase": "The murder investigation threatens to expose his financial misdeeds, and the stakes could cost him not only his fortune but also his reputation.",
    "paragraphs": [
      "Hugo Vane moved through the hotel with the air of a man accustomed to power and influence, his polished demeanor masking the turmoil roiling beneath. As a prominent investor, he had built an empire on ambition and ruthlessness, but the specter of financial ruin loomed large. The whispers of his collapsing investments haunted him, and the victim's threat to expose his misdeeds sent shivers down his spine.",
      "At the dinner party during the estimated time of the murder, Hugo had played the part of the charming tycoon, but inside, he was a man wrestling with desperation. The façade of wealth was cracking, and the fear of losing everything he had built consumed him. Each calculated word was a reminder of the high stakes he faced, not just in business but in the very essence of his identity.",
      "As the investigation unfolded, Hugo's polite savagery came to the fore. He spoke with a calculated eloquence, his sarcasm a thin veil for the anxiety that gnawed at him. The walls of his world were closing in, and with each new piece of evidence, he felt the noose tightening around his throat. Could he maintain control, or would the truth unravel everything he had fought to preserve?",
      "In the depths of his internal conflict, Hugo confronted the emptiness of his success. The relentless pursuit of wealth had led him to a precipice, where the cost of ambition threatened to consume him. The murder investigation offered a moment of reckoning—a chance to reassess his values and consider whether the price of his ambition was worth the risk of losing it all."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Grand Seaside Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel with Art Deco elegance, overlooking the turbulent sea.",
    "visualDescription": "The hotel boasts sweeping curves and geometric designs, with polished chrome accents and large glass windows framing the roaring ocean. Inside, the lobby features a grand chandelier, marble floors, and plush seating areas that invite whispered conversations.",
    "atmosphere": "An air of suspicion coupled with the salty tang of the sea creates a palpable tension among the guests.",
    "paragraphs": [
      "The Grand Seaside Hotel stands majestically atop the cliffs of Brighton, its Art Deco façade glimmering against the brooding sky. Waves crash against the rocks below, sending sprays of saltwater into the air, mingling with the scent of damp earth and polished wood. Guests bustle in and out of the lobby, but beneath the surface, a current of unease flows, fueled by recent whispers of deception and betrayal.",
      "The lobby is a world of contrasts, where the elegance of the roaring twenties meets the stark realities of the 1940s. Radio broadcasts crackle from hidden speakers, filling the space with distant news of the war. A group of women in tailored suits huddle together, their laughter seeming forced, while a man in a tweed jacket leans against the marble column, eyes scanning the room for familiar faces.",
      "As the day drifts toward dusk, the atmosphere thickens with tension. The grand chandelier casts flickering shadows across the lobby, creating pockets of secrecy. Outside, the overcast sky threatens rain, and the wind howls around the corners of the building, reminiscent of the turmoil brewing within. Each guest carries their own secrets, and the hotel, with its narrow hallways and hidden corners, is a labyrinth of potential clues waiting to be uncovered."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with a chance of rain, typical for coastal towns",
    "timeFlow": "Three days of mounting tension as secrets unfold",
    "mood": "Tense and secretive, with whispers of recent events unsettling the guests",
    "eraMarkers": [
      "Art Deco architecture and design",
      "Radio broadcasts filling the air",
      "Wartime rationing impacting guest services"
    ],
    "sensoryPalette": {
      "dominant": "Salty sea air mixed with polished wood",
      "secondary": [
        "Distant radio news reports",
        "Flickering chandelier light"
      ]
    },
    "paragraphs": [
      "The scent of salt and damp earth fills the air as the waves crash against the cliffs, an ever-present reminder of the ocean's power. Inside the hotel, polished wood and fresh linen create a stark contrast, while the faint sound of a distant radio crackles with news from the front lines. Guests move through the lobby, their conversations hushed, as if afraid to disturb the atmosphere thick with secrets.",
      "As the day wanes, the flicker of the chandelier casts dancing shadows, each flicker hinting at hidden truths. The tension in the air is palpable, with the salty breeze sneaking in through the cracks, carrying whispers of betrayal and deception. The grand hotel, with its sweeping views and elegant design, becomes a character in itself, holding the stories of those who dwell within its walls."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Ocean View Lounge",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Floor-to-ceiling windows overlooking the turbulent sea, plush velvet seating, and glass-topped tables.",
      "sensoryDetails": {
        "sights": [
          "cracked glass from the storm",
          "dark wine stains on the carpet",
          "flickering candlelight",
          "ocean waves crashing against rocks",
          "overturned chair near the window"
        ],
        "sounds": [
          "howling wind outside",
          "muffled voices from the lobby",
          "clinking glasses",
          "crackling fireplace",
          "distant thunder rumbling"
        ],
        "smells": [
          "damp sea air",
          "spilled wine and mildew",
          "smoky fireplace ash",
          "scent of old leather",
          "faint floral perfume"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cold glass surface",
          "worn wooden table edge",
          "chill from the open window",
          "smooth polished bar counter"
        ]
      },
      "accessControl": "Accessible to guests until midnight; staff-only access after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "raindrops streaking the windows",
            "mist over the sea",
            "dimly lit lounge",
            "wet floor reflecting light"
          ],
          "sounds": [
            "steady patter of rain",
            "distant thunder",
            "low murmurs of conversation",
            "faint music from a radio",
            "splashing waves against the cliff"
          ],
          "smells": [
            "fresh rain on pavement",
            "ocean brine mixed with wet earth",
            "faint scent of coffee",
            "mildew from damp corners",
            "smoky remnants of last night's fire"
          ],
          "mood": "oppressive and heavy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light filtering through clouds",
            "waves crashing with increased fury",
            "shadows creeping across the room",
            "faded wallpaper peeling",
            "darkened corners"
          ],
          "sounds": [
            "silence punctuated by the wind",
            "the creak of old beams",
            "distant thunder rolling",
            "soft whispers of guests",
            "clinking of ice in glasses"
          ],
          "smells": [
            "scent of damp wood",
            "beeswax from candles",
            "sour wine from spilled drinks",
            "old leather from the bar stools",
            "faint tobacco smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting orange hues",
            "glittering lights from the hotel",
            "long shadows stretching across the floor",
            "waves sparkling in the evening light",
            "guests mingling with drinks"
          ],
          "sounds": [
            "laughter and chatter",
            "soft jazz from a gramophone",
            "crackling of the fireplace",
            "clinking of glasses",
            "distant seagulls calling"
          ],
          "smells": [
            "scent of fresh seafood",
            "subtle perfume",
            "warmth of the fireplace",
            "scent of polished wood",
            "faint floral notes from arrangements"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Ocean View Lounge, usually a haven for relaxation, has turned into a stage for deception. The storm outside has battered the windows, leaving droplets cascading down the glass, while inside, shadows play tricks on the mind. The plush seating, now marred by dark wine stains, holds lingering whispers of the events that transpired here. A flickering candle illuminates the overturned chair near the window, a silent witness to the chaos.",
        "As guests enter, the atmosphere thickens with tension, the smell of damp sea air mingling with the remnants of spilled wine. The crackling fireplace offers little comfort as muffled voices from the lobby echo through the room. Each sound is amplified, a reminder that secrets are being kept, and the truth waits just beyond the reach of the flickering candlelight."
      ]
    },
    {
      "id": "staff_area",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Staff-only area",
      "visualDetails": "Industrial appliances, stainless steel countertops, and a large wooden table for meal prep.",
      "sensoryDetails": {
        "sights": [
          "gleaming metal pots and pans",
          "flour dust settling on surfaces",
          "hanging herbs drying",
          "flickering fluorescent lights",
          "stacks of rationed food supplies"
        ],
        "sounds": [
          "clattering of dishes",
          "hissing of gas flames",
          "water running in the sink",
          "soft voices of staff",
          "the ticking of a wall clock"
        ],
        "smells": [
          "scent of fresh bread baking",
          "fried onions and garlic",
          "sharp tang of vinegar",
          "musty storage room",
          "cleaning solutions"
        ],
        "tactile": [
          "cold metal of countertops",
          "rough texture of burlap sacks",
          "smooth wooden table surface",
          "warmth from the oven",
          "sticky residue on hands"
        ]
      },
      "accessControl": "Access restricted to kitchen staff; guests prohibited.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked windows",
            "steam rising from boiling pots",
            "ingredients lined up for breakfast",
            "shadows from flickering lights",
            "puddles forming outside"
          ],
          "sounds": [
            "steady drip from the roof",
            "sizzling bacon on the stove",
            "soft chatter among staff",
            "clanging of pots",
            "the hum of the fridge"
          ],
          "smells": [
            "freshly brewed coffee",
            "cooked eggs and bacon",
            "scent of wet earth",
            "clean linen",
            "faint hint of citrus"
          ],
          "mood": "busy and chaotic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "dishes piled high in the sink",
            "empty prep tables",
            "food cooling on racks",
            "hanging herbs swaying slightly"
          ],
          "sounds": [
            "soft clinks of utensils",
            "the hum of the oven",
            "quiet whispers among staff",
            "the ticking of the clock",
            "occasional laughter"
          ],
          "smells": [
            "scent of simmering stew",
            "fresh herbs",
            "cleaning solution",
            "old wood",
            "faint traces of burnt food"
          ],
          "mood": "tired and tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of overhead lights",
            "cooked dishes being plated",
            "staff bustling about",
            "windows darkening with night",
            "food being arranged for service"
          ],
          "sounds": [
            "clattering of cutlery",
            "bubbling pots",
            "voices calling out orders",
            "the whir of the mixer",
            "soft music playing in the background"
          ],
          "smells": [
            "aroma of roasted meats",
            "freshly baked pastries",
            "scent of herbs and spices",
            "cleaning solution",
            "warmth of the oven"
          ],
          "mood": "focused and industrious"
        }
      ],
      "paragraphs": [
        "The Kitchen, a hive of activity, buzzes with the energy of staff preparing meals for the guests. Gleaming metal pots hang overhead, reflecting the flickering fluorescent lights, while the scent of fresh bread wafts through the air, mingling with the sharp tang of vinegar from the pantry. Flour dust settles quietly on surfaces, remnants of a busy morning as the kitchen staff chat softly, their laughter a welcome distraction from the storm outside.",
        "As the day progresses, the atmosphere shifts within the kitchen. The once-busy space becomes a scene of controlled chaos, with dishes piling high and simmering pots bubbling away. The staff moves with purpose, navigating through the dimly lit area, the sounds of clattering dishes and sizzling food creating a familiar rhythm. Yet, beneath it all, an undercurrent of tension simmers, as whispers of the day's events linger in the air."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "Luxurious furnishings, large windows with ocean views, and an ornate fireplace.",
      "sensoryDetails": {
        "sights": [
          "opulent drapes framing the windows",
          "gleaming brass fittings",
          "ornate fireplace mantle",
          "artwork lining the walls",
          "elegantly arranged seating"
        ],
        "sounds": [
          "murmurs of conversation",
          "crackling fire",
          "distant sounds of the ocean",
          "soft music playing",
          "the rustle of newspaper"
        ],
        "smells": [
          "scent of polished wood",
          "faint floral arrangements",
          "smoky firewood",
          "old books",
          "citrus from tea"
        ],
        "tactile": [
          "soft velvet cushions",
          "smooth wooden table surface",
          "cold marble of the fireplace",
          "warmth from the fire",
          "textured wallpaper"
        ]
      },
      "accessControl": "Open to guests during the day; locked at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked windows",
            "soft light filtering through clouds",
            "damp floor reflecting light",
            "shadows from the drapes",
            "flowers drooping in vases"
          ],
          "sounds": [
            "steady rain pattering against glass",
            "soft whispers of guests",
            "the rustle of newspapers",
            "the crackling of the fire",
            "the ticking of an ornate clock"
          ],
          "smells": [
            "fresh rain mingling with floral scents",
            "scent of polished wood",
            "smoky remnants from the fireplace",
            "faint aroma of breakfast from below",
            "damp earth"
          ],
          "mood": "quiet and contemplative"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "faded wallpaper peeling",
            "gloomy reflections in the glass",
            "furniture arranged in intimate clusters",
            "artwork dimly lit"
          ],
          "sounds": [
            "murmurs of conversation",
            "soft music playing",
            "distant sounds of the ocean",
            "the creak of old wood",
            "the rustle of fabric"
          ],
          "smells": [
            "scent of stale tea",
            "old books and leather",
            "smoky scent from the fireplace",
            "dusty corners",
            "faint floral notes"
          ],
          "mood": "melancholic and introspective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light from lamps",
            "flickering flames in the fireplace",
            "guests gathered around",
            "elegant decor casting shadows",
            "the ocean shimmering under moonlight"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "soft piano music",
            "the crackle of the fire",
            "gentle waves lapping at the shore",
            "distant conversations"
          ],
          "smells": [
            "scent of rich tobacco",
            "warmth of the fire",
            "freshly brewed tea",
            "smoky wood from the fireplace",
            "faint perfume"
          ],
          "mood": "inviting yet tense"
        }
      ],
      "paragraphs": [
        "The Drawing Room is a lavish retreat, where guests gather to unwind and exchange pleasantries. Opulent drapes frame the large windows, allowing glimpses of the tumultuous sea beyond. The scent of polished wood mingles with the faint floral arrangements, creating an inviting atmosphere. As the evening approaches, the flickering flames of the fireplace cast dancing shadows on the walls, adding to the room's allure.",
        "Yet, beneath the surface of elegance lies an undercurrent of tension. Guests murmur in hushed tones, their laughter tinged with unease. The distant sounds of the ocean crashing against the cliffs serve as a reminder of the storm brewing outside, while the warmth of the room contrasts sharply with the chill of secrets waiting to be uncovered."
      ]
    },
    {
      "id": "balcony",
      "name": "The Seaside Balcony",
      "type": "exterior",
      "purpose": "Observation point and escape route",
      "visualDetails": "Wrought iron railing, sweeping views of the ocean, and comfortable seating.",
      "sensoryDetails": {
        "sights": [
          "vast ocean stretching to the horizon",
          "seagulls soaring overhead",
          "waves crashing against cliffs",
          "clouds rolling in",
          "sunset painting the sky"
        ],
        "sounds": [
          "crashing waves below",
          "wind rustling through leaves",
          "distant calls of seagulls",
          "soft laughter from guests",
          "the hum of the ocean"
        ],
        "smells": [
          "salty sea breeze",
          "fresh air with a hint of rain",
          "damp earth from the cliffs",
          "scent of blooming flowers",
          "smoky remnants from the fireplace"
        ],
        "tactile": [
          "cool metal of the railing",
          "soft cushions on the chairs",
          "smooth stone underfoot",
          "gentle breeze against the skin",
          "warmth from the setting sun"
        ]
      },
      "accessControl": "Accessible to all guests during the day; locked at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds blanketing the sky",
            "raindrops splattering on the stone",
            "mist rising over the ocean",
            "damp flowers swaying"
          ],
          "sounds": [
            "steady drumming of rain",
            "waves crashing violently",
            "the rustle of wet leaves",
            "distant thunder",
            "soft whispers of guests"
          ],
          "smells": [
            "fresh rain mingling with sea air",
            "scent of wet earth",
            "sharp tang of ozone",
            "faint floral notes",
            "damp wood"
          ],
          "mood": "foreboding and anxious"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light over the ocean",
            "waves crashing against the cliffs",
            "dark clouds gathering",
            "seagulls circling overhead",
            "glistening wet stones"
          ],
          "sounds": [
            "soft lapping of waves",
            "the wind howling",
            "distant thunder rumbling",
            "the rustle of clothing",
            "quiet conversations"
          ],
          "smells": [
            "scent of brine and seaweed",
            "fresh air with damp earth",
            "faint hint of rain",
            "smoky remnants from the hotel",
            "scent of blooming flowers"
          ],
          "mood": "tense and melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting orange hues",
            "stars beginning to twinkle",
            "waves glittering under moonlight",
            "the horizon blending into darkness",
            "guests enjoying the view"
          ],
          "sounds": [
            "gentle waves lapping",
            "soft laughter",
            "the hum of distant conversations",
            "the rustle of clothing in the breeze",
            "the creaking of the balcony"
          ],
          "smells": [
            "scent of salt and sea air",
            "fresh blooms from nearby gardens",
            "smoky wood from the fireplace",
            "the warmth of the sun",
            "faint traces of dinner"
          ],
          "mood": "romantic yet tense"
        }
      ],
      "paragraphs": [
        "The Seaside Balcony offers breathtaking views of the ocean, a place where guests can escape the confines of the hotel. Wrought iron railings frame the space, and comfortable seating invites relaxation amidst the salty breeze. As the sun sets, the horizon lights up with hues of orange and pink, casting a warm glow over the scene. Yet, the crashing waves below and the distant calls of seagulls serve as a stark reminder of the storm brewing within the hotel.",
        "In the morning, the balcony takes on a different character. Rain-soaked and shrouded in mist, it becomes a place of solitude, where the sound of rain mingles with the crashing waves. Each droplet carries a hint of foreboding, as if the weather reflects the secrets held within the hotel walls. The scent of damp earth and fresh rain fills the air, adding to the tension that lingers, waiting to be unveiled."
      ]
    }
  ],
  "note": "",
  "cost": 0.00266370225,
  "durationMs": 33380
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "November",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast skies",
      "chilly winds",
      "occasional drizzle"
    ],
    "daylight": "Days are short, with the sun setting around 4:30 PM, leaving long shadows and a sense of early evening gloom.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests settle into their rooms.",
    "holidays": [
      "Thanksgiving (approaching on the fourth Thursday)"
    ],
    "seasonalActivities": [
      "preparing for Thanksgiving meals",
      "visiting local markets for seasonal produce",
      "gathering for bonfire night celebrations"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suits in dark wool",
        "tweed overcoats",
        "fedora hats"
      ],
      "casual": [
        "corduroy trousers",
        "knit sweaters",
        "flannel shirts"
      ],
      "accessories": [
        "silk ties",
        "leather gloves",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with fitted waists",
        "velvet evening gowns",
        "tailored jackets"
      ],
      "casual": [
        "sweater sets",
        "A-line skirts",
        "corduroy slacks"
      ],
      "accessories": [
        "perched hats",
        "string of pearls",
        "gloves"
      ]
    },
    "trendsOfTheMoment": [
      "bright, bold colors in evening wear",
      "practical yet stylish hats",
      "influence of Dior's 'New Look' on feminine silhouettes"
    ],
    "socialExpectations": [
      "men expected to don hats when outdoors",
      "women encouraged to dress elegantly even for casual outings",
      "social gatherings emphasizing post-war camaraderie"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "intensifying Cold War tensions",
      "inauguration of President Truman's Fair Deal policies",
      "increased labor strikes across various industries"
    ],
    "politicalClimate": "A divided nation grappling with the implications of a post-war world, marked by anxiety over communism and economic recovery.",
    "economicConditions": "Continued inflation affecting daily goods, while some sectors experience growth, particularly manufacturing.",
    "socialIssues": [
      "struggles for civil rights gaining momentum",
      "women's roles in the workforce under scrutiny",
      "rising tensions over housing shortages"
    ],
    "internationalNews": [
      "Berlin Blockade continues to affect East-West relations",
      "UN peacekeeping missions being discussed",
      "India's recent independence causing shifts in colonial attitudes"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - 'White Christmas'",
        "Doris Day - 'Que Sera, Sera'",
        "Nat King Cole - 'Nature Boy'"
      ],
      "films": [
        "'The Treasure of the Sierra Madre'",
        "'The Best Years of Our Lives'",
        "'Key Largo'"
      ],
      "theater": [
        "'South Pacific'",
        "'A Streetcar Named Desire'",
        "'The King and I'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'The Shadow'",
        "'The Lone Ranger'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Naked and the Dead' by Norman Mailer",
        "'The Old Man and the Sea' by Ernest Hemingway",
        "'The Catcher in the Rye' by J.D. Salinger"
      ],
      "popularGenres": [
        "post-war realism",
        "mystery and detective fiction",
        "social commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "transistor radio",
        "first commercial jet airliner",
        "automated telephone exchanges"
      ],
      "commonDevices": [
        "black-and-white television sets",
        "reel-to-reel tape recorders",
        "early calculators"
      ],
      "emergingTrends": [
        "growing fascination with home appliances",
        "advancements in automotive technology",
        "increased radio listenership"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Dozen eggs: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "attending local dances",
        "hosting dinner parties",
        "participating in community charity events"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "gathering for neighborhood bonfires",
        "sharing wartime stories over drinks"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "greater acceptance of upward mobility",
      "increased scrutiny on wealth disparity"
    ],
    "gender": [
      "women celebrated for wartime contributions, yet expected to return to traditional roles",
      "growing push for women's rights in employment"
    ],
    "race": [
      "racial segregation still prevalent in many areas",
      "beginning of civil rights activism gaining visibility"
    ],
    "generalNorms": [
      "emphasis on community and family cohesion",
      "social gatherings as a means of escape from post-war stress",
      "expectation of politeness and decorum in public behavior"
    ]
  },
  "atmosphericDetails": [
    "The smell of damp earth and fallen leaves lingers in the air, mixing with the faint scent of smoke from nearby fireplaces.",
    "The sound of rain tapping against windowpanes creates an almost haunting backdrop, punctuated by snippets of hushed conversations from the hotel lounge.",
    "Dim lighting casts flickering shadows across the walls, creating an intimate yet tense atmosphere as guests exchange nervous glances."
  ],
  "paragraphs": [
    "November 1948 brings a chill to the coastal town, characterized by overcast skies and the scent of impending rain. As Thanksgiving approaches, the air is thick with anticipation; families and friends are preparing for festive gatherings amidst the backdrop of a nation grappling with post-war uncertainties. The days are fleetingly short, with sunset arriving as early as 4:30 PM, leaving the hotel guests cloaked in an uneasy twilight, as whispers of recent unsettling events circulate through the hallways.",
    "In this time of shifting fashion, men are seen in double-breasted suits of dark wool, complemented by tweed overcoats, while women embrace the elegant silhouette of tea-length dresses, often adorned with pearls. The influence of Christian Dior's 'New Look' is apparent, with women opting for cinched waists and flowing skirts, a reflection of both hope and the desire for normalcy after the war. Accessories such as silk ties and perched hats enhance the sophistication, while practical knit sweaters and corduroy trousers dominate casual settings, merging style with comfort.",
    "Daily life in November 1948 is colored by the duality of post-war recovery and the anxieties of the Cold War. While the economy is strained, with inflation impacting everyday goods, the community finds solace in social rituals like Sunday family dinners and neighborhood bonfires, fostering connections amidst uncertainty. The recent election of President Truman and his Fair Deal policies have stirred discussions, while civil rights issues loom larger on the horizon. The atmosphere is charged with a mix of hope and apprehension, as the past's shadows linger over the future's promises."
  ],
  "note": "",
  "cost": 0.0010481443499999999,
  "durationMs": 12450
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering of hotel guests and staff, strained by the pressures of post-war life and shifting societal roles, becomes a crucible for secrets and betrayals as they navigate the tension of a recent death under suspicious circumstances.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII has led to women entering the workforce in unprecedented numbers, creating a complex social dynamic where traditional roles are challenged amidst the trauma of war."
  },
  "setting": {
    "location": "A grand seaside hotel built in the early 1920s, featuring Art Deco architecture with ocean views and a sprawling lobby.",
    "institution": "hotel",
    "weather": "Overcast with a chance of rain, typical for coastal towns"
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
    "id": "key_temperature",
    "value": "eighty degrees Fahrenheit",
    "description": "The temperature in the victim's room at the time of poisoning."
  },
  {
    "id": "key_time",
    "value": "ten minutes past eleven",
    "description": "The time when the victim last used the key before being poisoned."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 6,
    "mid": 13,
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
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_damp_key",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_residue",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_witness_testimony",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_reenactment",
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
      "category": "testimonial"
    },
    {
      "id": "clue_fp_contradiction_step_2",
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
