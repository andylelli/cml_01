# Actual Prompt Record

- Run ID: `mystery-1784569235134`
- Project ID: ``
- Timestamp: `2026-07-20T17:45:42.237Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `5a13422e60703e4f`

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
    "title": "The Clock's Deception",
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
      "subtype": "mechanical tampering"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Intelligent and observant hotel guest",
      "private_secret": "She has a past connection to the victim.",
      "motive_seed": "Concern for the victim's safety",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM - 9:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel lobby",
        "guest rooms"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Keen observer"
      ],
      "stakes": "Desire to reveal the truth",
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
      "private_secret": "Involved in a controversial treatment",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "evening",
      "access_plausibility": "medium",
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
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Charismatic naval officer",
      "private_secret": "Harbors resentment towards the victim",
      "motive_seed": "Personal rivalry",
      "motive_strength": "strong",
      "alibi_window": "9:00 PM - 9:20 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel bar",
        "victim's room"
      ],
      "behavioral_tells": [
        "Nervous when questioned",
        "Avoids eye contact"
      ],
      "stakes": "Reputation and career",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Charming socialite",
      "private_secret": "Secretly in love with Captain Hale",
      "motive_seed": "Jealousy over the victim's influence",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM - 9:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel lobby",
        "guest rooms"
      ],
      "behavioral_tells": [
        "Flirts with Captain Hale",
        "Gives evasive answers"
      ],
      "stakes": "Desire for Captain Hale's affection",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "60-70",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Elderly widow with a sharp tongue",
      "private_secret": "Knew the victim's secrets",
      "motive_seed": "Anger over past grievances",
      "motive_strength": "weak",
      "alibi_window": "9:00 PM - 9:15 PM",
      "access_plausibility": "low",
      "opportunity_channels": [
        "hotel dining room"
      ],
      "behavioral_tells": [
        "Loud and outspoken",
        "Quick to judge others"
      ],
      "stakes": "Revenge for slights",
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
      "public_persona": "Wealthy businessman",
      "private_secret": "Seeking to ruin Dr. Finch's reputation",
      "motive_seed": "Financial gain from the victim's downfall",
      "motive_strength": "strong",
      "alibi_window": "9:10 PM - 9:25 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel office",
        "guest rooms"
      ],
      "behavioral_tells": [
        "Calm demeanor",
        "Displays arrogance"
      ],
      "stakes": "Financial interests",
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
      "summary": "In a grand seaside hotel, the respected Dr. Mallory Finch is found dead under mysterious circumstances. As the guests gather to unravel the truth, Eleanor Voss, a keen detective, discovers that the apparent time of death has been tampered with, leading to a complex web of motives and deceptions."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, victim, and twenty to expose the false timing.",
      "delivery_path": [
        {
          "step": "The murderer rewinds the clock after committing the crime."
        },
        {
          "step": "The clock shows a time that corresponds with the victim's known whereabouts."
        }
      ]
    },
    "outcome": {
      "result": "The investigation leads to the uncovering of the tampered clock as the key evidence."
    }
  },
  "false_assumption": {
    "statement": "The victim was killed shortly after 9:00 PM.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses recall hearing the clock chime shortly after 9:00 PM, aligning with the timeline of the murder.",
    "what_it_hides": "The clock was tampered with to mislead the investigation."
  },
  "false_solution": {
    "accused_suspect": "Hugo Vane",
    "supporting_points": [
      "Hugo was seen arguing with Dr. Finch earlier in the evening.",
      "Hugo's alibi appears weak due to conflicting witness statements."
    ],
    "the_one_flaw": "Hugo's alibi can be verified by the hotel staff who confirm his whereabouts at the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Captain Hale's nervous behavior when questioned.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He is simply anxious due to the chaos of the situation.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A letter found in the victim's room suggesting an affair.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The letter was written by a previous patient and had nothing to do with the murder.",
      "resolved_in_chapter": 5
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
    "rationale": "All suspects were present at the hotel, and no outsiders could have accessed the victim's room."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "9:00 PM",
        "9:30 PM"
      ],
      "windows": [
        "9:00 PM - 9:30 PM"
      ],
      "contradictions": [
        "Clock shows 9:20 PM but witnesses heard it chime at 9:00 PM."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Sylvia Trent",
        "Hugo Vane"
      ],
      "objects": [
        "victim's room",
        "mechanical clock"
      ],
      "permissions": [
        "Access to the victim's room is limited to hotel guests."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be rewound to alter time display."
      ],
      "traces": [
        "Fingerprint evidence on the clock's casing."
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff were instructed to keep guest movements confidential."
      ],
      "authority_sources": [
        "Management reports indicate the clock was last checked at 8:45 PM."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the victim's room shows twenty minutes past nine when discovered.",
        "correction": "This indicates that the time of death may have been manipulated.",
        "effect": "Narrows the time of death to before the clock was discovered.",
        "required_evidence": [
          "The clock shows twenty minutes past nine.",
          "Witnesses recall the clock chiming at an unusual hour."
        ],
        "reader_observable": true
      },
      {
        "observation": "A missing key to the clock's mechanism is found in Captain Hale's jacket.",
        "correction": "This suggests that Captain Hale had the means to tamper with the clock.",
        "effect": "Eliminates other suspects from being able to rewind the clock.",
        "required_evidence": [
          "The missing key was found in Captain Hale's jacket.",
          "Witness testimony indicates Captain Hale was present in the victim's room."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall seeing Captain Hale near the clock just before the murder.",
        "correction": "This strengthens the case against Captain Hale as the possible murderer.",
        "effect": "Narrows the suspect pool to Captain Hale.",
        "required_evidence": [
          "Witnesses state they saw Captain Hale near the clock.",
          "The timeline indicates he had access to the victim's room before the murder."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the clock's time with witness statements and Captain Hale's alibi proves that the timeline was manipulated.",
    "knowledge_revealed": "The clock was tampered with to mislead the investigation.",
    "pass_condition": "The evidence shows inconsistencies that only Captain Hale's access could explain.",
    "evidence_clues": [
      "clue_2",
      "clue_1",
      "clue_core_contradiction_chain",
      "clue_fp_contradiction_step_3"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock showing twenty minutes past nine (early) and witness statements (mid) reveal the time of death manipulation. Step 2: The missing key found in Captain Hale's jacket (mid) indicates potential tampering. Step 3: Witness accounts placing Hale near the clock (discriminating test) confirm his culpability."
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
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by hotel staff",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness states she was in the dining room during the murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed presence at a business meeting at the time.",
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Witness testimony"
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
        "clue_id": "clue_7",
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
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
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
        "clue_id": "clue_id_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Key found in jacket"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a charming hotelier, navigating the tumultuous waters of community expectations and personal burdens.",
    "publicPersona": "Eleanor is the epitome of grace, often found hosting lavish events at her seaside hotel, her laughter echoing through the halls. The locals adore her, seeing her as a beacon of resilience in a post-war world.",
    "privateSecret": "Behind her warm smile lies a constant worry about her hotel’s financial future, a burden that weighs heavily on her heart as she struggles to keep her family legacy afloat.",
    "motiveSeed": "inheritance",
    "motiveStrength": "weak",
    "alibiWindow": "Eleanor was present during the event as an invited guest, mingling with the attendees and ensuring everything ran smoothly.",
    "accessPlausibility": "easy",
    "stakes": "The future of her family’s hotel and her own reputation in the community hang in the balance, should the truth unravel.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a melodic tone, often using subtle sarcasm to lighten serious topics, her words flowing like the waves outside her hotel’s windows.",
    "signatureTic": "‘Ah, the joys of hospitality!’",
    "internalConflict": "Eleanor grapples with feelings of inadequacy, torn between her desire to maintain her family’s legacy and the fear of failure looming over her.",
    "personalStakeInCase": "This crime matters deeply to Eleanor, as her hotel is not just a business; it represents her family's history and her own identity.",
    "paragraphs": [
      "Eleanor Voss stood at the helm of her hotel, the sound of the waves crashing against the shore a constant reminder of both beauty and turmoil. With a smile that could light a dark room, she had mastered the art of charm, hosting soirées that brought the community together. Yet, behind that facade lay a woman burdened by the weight of financial uncertainty, her heart aching with every bill that piled high on her desk. The war had taken so much, and now it threatened to take the very foundation of her life.",
      "As she mingled with guests at yet another event, Eleanor couldn't help but overhear whispers of the victim's recent troubles. She felt a pang of guilt; the thought of inheritance crossed her mind, a fleeting notion quickly dismissed. Her family had built this hotel with love and sacrifice, not for the sake of profit but for community. Yet, the idea lingered like a shadow, casting doubt on her intentions.",
      "Eleanor's instincts kicked in when she sensed the tension rising in the room. The laughter felt forced, and the smiles didn’t reach the eyes. It was then she decided to step into the role of a sleuth, not merely to uncover the truth but to protect her family's legacy. Her access to the hotel and its guests was easy; she knew every corner of the establishment like the back of her hand. But the deeper she dug, the more she feared what secrets lay beneath the surface.",
      "In her quest for answers, Eleanor wrestled with her insecurities. She had always been the dependable one, the one people turned to in times of need. But now, as she navigated the murky waters of suspicion and betrayal, she felt adrift. Would she be able to confront her fears and embrace her role in the community she cherished? Or would the truth threaten to unravel everything she held dear?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated physician with a hidden affair that could shatter her world.",
    "publicPersona": "Recognized for her unwavering commitment to her patients, Mallory is seen as a pillar of the community, often praised for her compassionate care.",
    "privateSecret": "Beneath her professional exterior, she harbors a tumultuous secret: an affair with the victim's spouse, a betrayal that could ruin her reputation and career.",
    "motiveSeed": "jealousy",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have been in her office attending to patients during the time of death, a plausible cover for her whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "Should her affair be revealed, she risks not only her career but the love she has cultivated in secrecy.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory speaks with a calm, measured tone, often punctuated by medical jargon that reveals her professional background, but when pressed, her voice can tremble with barely contained emotion.",
    "signatureTic": "‘In my experience…’",
    "internalConflict": "Mallory is tormented by guilt and fear; her affair could destroy her professional life and the love she has for her partner, leaving her in a moral quagmire.",
    "personalStakeInCase": "The murder investigation threatens to expose her affair, putting everything she has worked for at risk, forcing her to confront her own conscience.",
    "paragraphs": [
      "Dr. Mallory Finch sat in her office, the weight of her secret pressing down on her like a leaden shroud. Known for her compassionate approach to medicine, she had built a reputation as a healer, a role she cherished deeply. But beneath this facade lay a heart entangled in a web of deceit, torn between duty and desire. Her affair with the victim's spouse was a dangerous liaison, one that could shatter her carefully constructed life.",
      "As the news of the murder spread through the community, Mallory felt a chill creep down her spine. She had been in her office, attending to patients, yet the memory of stolen moments with her lover haunted her thoughts. The fear of exposure gnawed at her insides, a relentless reminder that the truth had a way of clawing its way to the surface, no matter how deeply it was buried.",
      "With every interaction, Mallory’s mind raced. What if someone discovered the truth? The stakes were impossibly high; her career, her dignity, her heart — all hanging by a thread. She had dedicated her life to healing others, yet here she was, embroiled in a scandal that could destroy everything she valued. The weight of her guilt was suffocating, and as she navigated the investigation, she felt like a patient in her own hospital, desperate for a cure.",
      "In the days that followed, Mallory was forced to confront her actions and the consequences they entailed. The investigation became a mirror reflecting her own choices, and she found herself wrestling with the morality of her affair. Would she find a way to redeem herself, or would the truth unravel her life in a way she could never have anticipated? The clock was ticking, and with it, the chance for redemption slipped further from her grasp."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a charismatic war hero whose past is as troubled as his present.",
    "publicPersona": "With tales of valor and heroism, Ivor is the toast of the town, a retired naval officer whose charm and charisma draw people to him.",
    "privateSecret": "Beneath the facade of a war hero lies a man grappling with failure, hiding a bankrupt business venture that has left him financially reliant on his wife.",
    "motiveSeed": "financial security",
    "motiveStrength": "compelling",
    "alibiWindow": "Ivor claims to have been at a social gathering in another part of the hotel during the murder, a story that could unravel under scrutiny.",
    "accessPlausibility": "unlikely",
    "stakes": "His social standing and financial security are at risk if his secrets come to light, leaving him vulnerable in a world where reputation is everything.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a booming voice, often punctuating his stories with dramatic flair, but when discussing personal matters, his tone softens, revealing his vulnerability.",
    "signatureTic": "‘In the end, it’s all about survival.’",
    "internalConflict": "Ivor struggles with the fading glory of his past; the hero who once commanded respect now feels the weight of his failures, battling pride and shame.",
    "personalStakeInCase": "The investigation threatens to expose his financial troubles and tarnish his heroic image, forcing him to confront the man he has become.",
    "paragraphs": [
      "Captain Ivor Hale was a man of stories, his voice booming like the cannons he once commanded. The war hero basked in the adoration of his community, sharing tales of bravery that captivated his audience. Yet, the truth was far less glamorous. Beneath the surface, he wrestled with the demons of failure, his once-thriving business now a shadow of its former self. Reliant on his wife for financial stability, he wore his charm like armor, hiding the cracks beneath.",
      "As the murder unfolded, Ivor found himself caught in a web of suspicion. He had been at a social gathering, but the details of that evening blurred in his mind. What if someone questioned his alibi? The thought sent a shiver down his spine. His reputation was everything; without it, he was just a man with a tarnished past, a relic of a bygone era.",
      "The stakes were high, and Ivor felt the pressure mounting. He had always been the brave one, the one who faced danger head-on, yet now he found himself cornered by the very people who once admired him. The thought of exposure, of losing the respect of his community, gnawed at him, pushing him deeper into a corner of desperation.",
      "In the end, Ivor knew he had to confront the reality of his situation. The investigation forced him to reckon with his failures and the man he had become. Could he find a way to reclaim his dignity, or would he remain a prisoner of his past? The clock was ticking, and every moment brought him closer to a reckoning he could no longer avoid."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious young journalist navigating the treacherous waters of truth and ambition.",
    "publicPersona": "With an insatiable curiosity, Beatrice is known for her determination to uncover the truth, often seen as a bright spark in the otherwise staid community.",
    "privateSecret": "She has been secretly writing a tell-all piece about the hotel, threatening to expose damaging stories that could shake the community to its core.",
    "motiveSeed": "fame",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice was interviewing guests in another area of the hotel during the incident, a plausible excuse that could easily be tested.",
    "accessPlausibility": "possible",
    "stakes": "Her journalistic ambitions are at stake, and the risk of failing in her quest for truth looms large, threatening her reputation.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks rapidly, her enthusiasm spilling over into her dialogue, often peppered with ironic observations that reveal her youthful idealism and naivety.",
    "signatureTic": "‘The truth is a slippery thing.’",
    "internalConflict": "Beatrice grapples with the implications of her ambition; the desire to expose the truth clashes with the potential harm it could cause to innocent lives.",
    "personalStakeInCase": "The murder investigation offers Beatrice a chance to elevate her career, but it also forces her to confront the ethical dilemmas of her ambition.",
    "paragraphs": [
      "Beatrice Quill was a whirlwind of energy, her enthusiasm for journalism palpable as she darted through the hotel, notebook in hand. The young journalist was determined to uncover the truth behind the murder, her ambition propelling her forward like a ship sailing into a storm. Yet, hidden beneath her exuberance was a secret: she had been penning a tell-all piece about the hotel, a revelation that could devastate the very community she sought to expose.",
      "As she conducted interviews with guests, Beatrice couldn’t shake the feeling that her ambition might lead her down a dangerous path. The thrill of uncovering secrets was intoxicating, yet the weight of what those secrets could mean for others pressed heavily on her conscience. Would her quest for fame blind her to the potential consequences of her actions?",
      "Her alibi was solid; she had been in another area of the hotel during the incident, but that did little to quell the doubts creeping into her mind. The stakes were high, and she found herself questioning if the truth was worth the risk of ruining lives. Beatrice had always believed in the power of journalism to bring about change, but what if her pursuit of the story led to destruction?",
      "In the days that followed, Beatrice's resolve was tested. The investigation forced her to confront the ethical dilemmas that came with her ambition. Could she balance the desire to expose the truth with the responsibility of protecting those around her? As the clock ticked down, she realized that the slippery nature of truth could lead to unforeseen consequences, and she had to decide how far she was willing to go for her career."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a glamorous socialite hiding financial troubles behind her polished facade.",
    "publicPersona": "A trendsetter and glamorous figure in high society, Sylvia is often seen at the most exclusive events, captivating everyone with her charm.",
    "privateSecret": "Beneath the glitz lies a woman struggling with financial woes, hiding a failed business deal with the victim that could expose her vulnerabilities.",
    "motiveSeed": "anger",
    "motiveStrength": "weak",
    "alibiWindow": "She claimed to be at a charity event at the time of the murder, a story that could be easily verified.",
    "accessPlausibility": "easy",
    "stakes": "Sylvia fears losing her social standing and the façade she has built, which could crumble if her financial troubles are revealed.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with an elegant cadence, her words carefully chosen, often laced with subtle sarcasm that reveals her sharp wit beneath the polished surface.",
    "signatureTic": "‘One must always keep up appearances.’",
    "internalConflict": "Sylvia wrestles with the fear of losing her status in society, torn between maintaining her image and facing the reality of her financial situation.",
    "personalStakeInCase": "The murder investigation threatens to expose her financial struggles, forcing her to confront the truth about her life and choices.",
    "paragraphs": [
      "Sylvia Trent glided through the hotel like a queen surveying her domain, her presence commanding attention from all who crossed her path. A socialite at heart, she thrived in the spotlight, her laughter ringing like chimes in the wind. Yet, beneath her glamorous exterior lay a woman grappling with the harsh realities of life. A failed business deal with the victim had left her finances in tatters, a truth she concealed behind a carefully crafted facade.",
      "As news of the murder spread, Sylvia felt the ground shift beneath her feet. She had been at a charity event, her alibi solid, yet the nagging fear of exposure loomed over her like a dark cloud. What if someone connected the dots? The stakes were high, and the thought of losing her social standing sent shivers down her spine. Maintaining appearances was everything; without it, she was nothing.",
      "Sylvia's conversations were laced with polite savagery, her wit a weapon she wielded with grace. Yet, as she navigated the investigation, she found herself on edge. The murder investigation threatened to peel back the layers of her carefully constructed life, exposing the vulnerabilities she had worked so hard to hide. Would she be able to keep her secrets intact, or would the truth bring her crashing down?",
      "In the end, Sylvia knew she had to confront her fears. The investigation forced her to grapple with the reality of her situation, and she began to question what truly mattered. Would she continue to live a lie for the sake of appearances, or could she find the courage to embrace honesty and vulnerability? The clock was ticking, and with each passing moment, the truth felt closer than ever."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a tortured artist whose unrequited love spirals into obsession.",
    "publicPersona": "Known for his emotional depth and artistic brilliance, Hugo is often sought after for commissions, his paintings reflecting a profound sensitivity.",
    "privateSecret": "In love with the victim, his heartache has turned into a dangerous obsession, leaving him vulnerable to the consequences of unfulfilled desire.",
    "motiveSeed": "passion",
    "motiveStrength": "moderate",
    "alibiWindow": "Hugo claimed to be in his studio, working on a painting, a solitary excuse that could be verified by his surroundings.",
    "accessPlausibility": "possible",
    "stakes": "His reputation and emotional stability are at stake, as the unraveling of his feelings could lead to public disgrace.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Hugo speaks with a raw intensity, his words often spilling out in a torrent, reflecting his emotional turmoil and passion for art.",
    "signatureTic": "‘Art is life, and life is pain.’",
    "internalConflict": "Hugo struggles with the line between love and obsession, haunted by his unreciprocated feelings, leaving him in a constant state of turmoil.",
    "personalStakeInCase": "The murder investigation threatens to expose his feelings for the victim, forcing him to confront the depths of his obsession and its consequences.",
    "paragraphs": [
      "Hugo Vane was a man of contradictions, his artistic soul entwined with a heart that beat for the one person who would never return his affection. Known for his emotional depth, his paintings captured the essence of beauty and pain, yet within him lay a tempest of unrequited love. The victim had ignited a flame in his heart, one that burned brightly yet left him scorched and yearning.",
      "As the murder unfolded, Hugo found himself grappling with the weight of his emotions. He had been in his studio, pouring his heart into a canvas, yet the knowledge that the woman he loved had been taken from him sent him spiraling into despair. The police questioned his whereabouts, and he felt the walls closing in, the truth of his feelings threatening to expose him to a world that wouldn’t understand.",
      "His alibi was solid, yet the stakes felt impossibly high. Should his feelings for the victim come to light, he risked losing not only his reputation but also his emotional stability. In moments of clarity, he realized that his passion had morphed into an obsession, blurring the line between love and madness. Each brushstroke on the canvas became a reflection of his turmoil, a desperate cry for understanding.",
      "In the days that followed, Hugo was forced to confront the reality of his emotions. The investigation was a mirror, reflecting his deepest fears and desires. Could he find a way to separate love from obsession, or would he remain trapped in a cycle of heartache? As the clock ticked on, he realized that the answers he sought might lead to a truth he was not ready to face."
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
    "summary": "A large, somewhat opulent seaside hotel with Art Deco architecture, featuring a grand lobby and ocean-view rooms.",
    "visualDescription": "The Grand Seaside Hotel boasts a façade of gleaming white stucco, accented with geometric motifs and chrome detailing. Inside, a sweeping staircase spirals down from a high ceiling adorned with intricate plasterwork, while polished marble floors reflect the soft glow of ornate chandeliers. Ocean views dominate the expansive windows, framing the turbulent sea below.",
    "atmosphere": "A blend of elegance and tension, where the beauty of the surroundings contrasts sharply with the underlying sense of danger.",
    "paragraphs": [
      "The Grand Seaside Hotel stands majestically against the backdrop of a brooding sky, its Art Deco lines sharp and defined. The rhythmic crash of waves against the cliffs below is a constant reminder of nature's fury, while the hotel’s polished surfaces reflect a bygone era of glamour. Guests bustle through the lobby, their laughter mingling with the faint crackle of a radio playing distant wartime news, creating an atmosphere thick with anticipation and unspoken fears.",
      "The scent of saltwater and damp wood permeates the air, a reminder of the relentless coastal weather that shapes life in Brighton. As the rain drizzles against the windows, guests huddle under the ornate awning, exchanging hushed whispers and furtive glances, as if the very walls of the hotel harbor secrets. The hotel’s isolation, perched high on the cliffs, adds to the chill of the evening, amplifying the sense of unease that hangs heavily around its opulent corners.",
      "In the evenings, the hotel transforms under the flickering glow of gas lamps, casting long shadows that dance along the polished floors. The distant sound of piano music wafts from the lounge, where weary travelers seek solace with a drink in hand. Yet, beneath this veneer of comfort lies the unsettling knowledge that the hotel is not just a refuge from the storm, but also a stage for deception and intrigue."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of a coastal climate",
    "timeFlow": "Three days of mounting tension, leading to a climactic revelation.",
    "mood": "tense and suspenseful, with a sense of underlying danger",
    "eraMarkers": [
      "radio broadcasts of wartime news",
      "rationed wartime vehicles parked outside",
      "early television sets flickering in lounge corners",
      "military uniforms among guests"
    ],
    "sensoryPalette": {
      "dominant": "the briny tang of the sea mixed with polished wood",
      "secondary": [
        "soft glow of gas lamps",
        "whispers of hidden conversations"
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of salt and dampness, a reminder of the hotel’s precarious cliffside location. Polished wood and brass fittings gleam dully under the overcast sky, while the distant sound of waves crashing echoes through the corridors, creating a dissonant lullaby that both comforts and unnerves. The pulse of the hotel beats with the rhythm of the sea, yet within its walls, whispers of conspiracy and intrigue weave through the air like a shroud.",
      "As guests navigate the narrow hallways, the echo of their footsteps mingles with the occasional creak of the building settling into the stormy night. The oppressive weight of the atmosphere is palpable, as if the very walls are eavesdropping on secrets exchanged in hushed tones. Each room holds its own mysteries, and the isolation of the hotel creates a sense of entrapment, where every glance and gesture may conceal a hidden agenda."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Oceanview Suite",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Luxuriously appointed room with ocean views, heavy drapes, and a large, ornate bed.",
      "sensoryDetails": {
        "sights": [
          "heavy drapes billowing slightly",
          "cracked mirror reflecting dim light",
          "scattered papers on the floor",
          "ocean waves crashing below"
        ],
        "sounds": [
          "distant thunder rumbling",
          "waves crashing against the cliff",
          "faint ticking of a clock",
          "rustle of fabric in the breeze"
        ],
        "smells": [
          "saltwater mingling with perfume",
          "dampness from the sea air",
          "faint tobacco smoke",
          "old wood and varnish"
        ],
        "tactile": [
          "soft silk sheets",
          "cold marble floor",
          "rough texture of the hand-painted wallpaper",
          "chill from the open window"
        ]
      },
      "accessControl": "Restricted to hotel staff and law enforcement; guest access limited to check-in hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "water pooling on the balcony"
          ],
          "sounds": [
            "steady rain against the window",
            "distant thunder rumbling"
          ],
          "smells": [
            "freshly fallen rain",
            "damp linens",
            "moldy corners"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "heavy clouds obscuring the sun"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the creak of old timbers"
          ],
          "smells": [
            "beeswax from candles",
            "dusty air",
            "cold stone"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on the walls",
            "long shadows stretching across the floor"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "distant laughter from the lounge"
          ],
          "smells": [
            "candle wax",
            "freshly brewed coffee",
            "scent of the ocean"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanview Suite, once a haven of luxury, now bears the scars of a violent confrontation. Heavy drapes hang limply, their once vibrant colors dulled by the weight of secrets. Scattered papers litter the floor, remnants of a struggle that will haunt the hotel’s corridors. The faint aroma of saltwater mingles with something far more sinister, a scent that hints at the chaos that unfolded within these walls.",
        "As the waves crash relentlessly against the cliff below, the room feels both isolated and exposed, a sanctuary turned prison. The ticking clock on the mantle counts down the moments until the truth is revealed, each tick echoing like a heartbeat in the silence. Shadows cling to the corners, and the chill from the open window carries whispers of the past, urging the living to confront the darkness that lurks just beyond the threshold."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Expansive space with high ceilings, grand staircase, and a central chandelier.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate chandelier casting warm light",
          "large potted ferns",
          "guests mingling in clusters"
        ],
        "sounds": [
          "murmur of conversations",
          "clinking of glasses",
          "piano music playing softly",
          "footsteps echoing on marble"
        ],
        "smells": [
          "freshly polished wood",
          "scent of flowers from arrangements",
          "cigar smoke wafting",
          "hint of cologne"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft upholstery of chairs",
          "coolness of metal railings",
          "warmth of sunlight through windows"
        ]
      },
      "accessControl": "Open to all guests and visitors; monitored by hotel staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked entrance",
            "cloudy light filtering in"
          ],
          "sounds": [
            "raindrops tapping on the roof",
            "soft chatter of guests"
          ],
          "smells": [
            "wet pavement outside",
            "fresh coffee brewing",
            "scent of pastries from the kitchen"
          ],
          "mood": "cozy and inviting"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim lighting casting shadows",
            "guests huddled close"
          ],
          "sounds": [
            "quiet conversations",
            "the rustle of newspapers"
          ],
          "smells": [
            "scent of damp wool",
            "freshly brewed tea",
            "wood polish"
          ],
          "mood": "somber and reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of chandeliers",
            "guests laughing and clinking glasses"
          ],
          "sounds": [
            "lively music from the lounge",
            "cheerful laughter"
          ],
          "smells": [
            "scent of fine wine",
            "cooked meat from the kitchen",
            "fresh flowers"
          ],
          "mood": "festive and lively"
        }
      ],
      "paragraphs": [
        "The Grand Lobby is the heart of the hotel, where guests converge under the watchful eye of the ornate chandelier. Marble floors gleam underfoot as laughter and conversation create a lively atmosphere, punctuated by the soft strains of a piano. Here, the tension of the outside world seems to fade, if only for a moment, as people gather to share stories and drinks, oblivious to the dark secrets that linger just beyond the lobby's doors.",
        "Yet, as the day wanes and the shadows deepen, an unsettling air settles over the space. The whispers of guests grow hushed, and the laughter feels strained, as if the very walls are listening. The blend of familiar scents—polished wood and fresh flowers—gives way to a more sinister undertone, a reminder that even in this gathering place, danger lurks just out of sight."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Oceanview Dining Room",
      "type": "interior",
      "purpose": "Dining and socializing space",
      "visualDetails": "Elegant dining area with large windows overlooking the sea, adorned with fine table settings.",
      "sensoryDetails": {
        "sights": [
          "elegantly set tables",
          "large windows framing stormy seas",
          "gleaming silverware",
          "fresh flowers as centerpieces"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft conversations",
          "waves crashing in the distance",
          "the rustle of napkins"
        ],
        "smells": [
          "aroma of roasted meats",
          "scent of baked bread",
          "freshly brewed coffee",
          "subtle perfume of guests"
        ],
        "tactile": [
          "smooth tablecloths",
          "cold glassware",
          "soft leather of dining chairs",
          "warmth of food on the plate"
        ]
      },
      "accessControl": "Open during meal hours; reservations required; restricted access to staff-only kitchen.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through windows",
            "raindrops trickling down glass"
          ],
          "sounds": [
            "soft patter of rain",
            "quiet clinking of breakfast dishes"
          ],
          "smells": [
            "freshly brewed coffee",
            "toasted bread",
            "scent of wet earth"
          ],
          "mood": "serene and reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "heavy clouds visible through windows"
          ],
          "sounds": [
            "the murmur of conversation",
            "soft music playing in the background"
          ],
          "smells": [
            "scent of baking pastries",
            "faint sea air",
            "dusty corners"
          ],
          "mood": "melancholic and introspective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelit tables",
            "glow of sunset over the ocean"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "the hum of conversation"
          ],
          "smells": [
            "rich aroma of grilled seafood",
            "sweet notes of dessert",
            "scent of the ocean breeze"
          ],
          "mood": "elegant and celebratory"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room offers a breathtaking panorama of the turbulent sea, framed by large windows that seem to invite the storm inside. Guests are greeted by elegantly set tables, each adorned with fresh flowers and gleaming silverware, evoking an atmosphere of refined sophistication. As the aroma of roasted meats wafts through the air, the sounds of clinking cutlery and soft conversations create a symphony of indulgence, momentarily distracting from the tension that simmers beneath the surface.",
        "However, as the storms outside rage, a sense of foreboding creeps into the room. The laughter feels forced, and glances exchanged between diners carry the weight of unspoken words. The rich scents of the meal mingle with the salty breeze, creating a complex tapestry of sensations that heighten the awareness of danger lurking just beyond the dining room's elegant facade."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Private area for guests and staff",
      "visualDetails": "Intimate room lined with bookshelves, a large desk, and a fireplace.",
      "sensoryDetails": {
        "sights": [
          "walls lined with leather-bound books",
          "large oak desk cluttered with papers",
          "flickering fireplace",
          "comfortable armchairs"
        ],
        "sounds": [
          "crackling fire",
          "pages turning",
          "soft footsteps on carpet",
          "whispers of conversation"
        ],
        "smells": [
          "old books and leather",
          "smoky fireplace",
          "fresh ink from pens",
          "scent of polished wood"
        ],
        "tactile": [
          "soft leather chair",
          "cool surface of the desk",
          "rough texture of book spines",
          "warmth from the fire"
        ]
      },
      "accessControl": "Access restricted to guests with permission; staff entry allowed only for cleaning and maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "gloomy light filtering through curtains",
            "wet books on the desk"
          ],
          "sounds": [
            "rain pattering against the window",
            "soft crackle of the fire"
          ],
          "smells": [
            "scent of damp wood",
            "faint mustiness of books",
            "freshly brewed tea"
          ],
          "mood": "introspective and quiet"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "dust motes dancing in the air"
          ],
          "sounds": [
            "the ticking of a clock",
            "soft rustle of paper"
          ],
          "smells": [
            "scent of old leather",
            "faint aroma of tea",
            "dust"
          ],
          "mood": "somber and contemplative"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight dancing on the walls",
            "glow of a reading lamp"
          ],
          "sounds": [
            "the rustle of a newspaper",
            "distant laughter from the lobby"
          ],
          "smells": [
            "scent of warm wood",
            "smoky aroma from the fire",
            "freshly brewed coffee"
          ],
          "mood": "thoughtful and serene"
        }
      ],
      "paragraphs": [
        "The Study is a sanctuary of quiet contemplation, where the weight of the world feels distant. Surrounded by leather-bound books and the comforting crackle of a fire, the room exudes an air of scholarly elegance. The large oak desk is cluttered with papers, hinting at the secrets and schemes that may have unfolded within these four walls, while the flickering fire casts a warm glow that belies the tension brewing outside.",
        "As evening descends, the shadows grow longer, and the atmosphere shifts. The scent of old books mingles with the smoky aroma of the fireplace, creating a cocoon of comfort that contrasts sharply with the danger lurking beyond the hotel’s façade. Here, in this intimate space, the echoes of whispered conversations linger, and the truth remains just out of reach, waiting to be uncovered."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023121482999999996,
  "durationMs": 28859
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "December",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "December",
    "weather": [
      "overcast with intermittent rain",
      "cool temperatures averaging around 40°F",
      "frequent gusts of wind"
    ],
    "daylight": "Short days with daylight fading by four o'clock in the afternoon, casting long shadows in the early evening",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the hotel is quiet and dimly lit",
    "holidays": [
      "Christmas",
      "New Year's Eve"
    ],
    "seasonalActivities": [
      "attending holiday parties",
      "visiting Christmas markets",
      "participating in community charity events"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suit",
        "tweed overcoat",
        "silk tie"
      ],
      "casual": [
        "corduroy trousers",
        "button-down flannel shirt",
        "slim-fit sweater"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket square"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a fitted waist",
        "long-sleeve evening gown",
        "tailored coat"
      ],
      "casual": [
        "wool skirt and blouse combination",
        "knit cardigan",
        "simple cotton dress"
      ],
      "accessories": [
        "cloche hat",
        "string of pearls",
        "stylish gloves"
      ]
    },
    "trendsOfTheMoment": [
      "utilitarian fashion due to wartime restrictions",
      "increased popularity of bold colors",
      "accessorizing with vintage items"
    ],
    "socialExpectations": [
      "men expected to wear formal attire for evening events",
      "women encouraged to dress elegantly even for casual outings",
      "social gatherings centered around wartime solidarity"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Battle of Britain continues, with air raids causing ongoing tension",
      "US debates entry into the war amid rising isolationist sentiments",
      "Nazi occupation of Europe affecting international relations"
    ],
    "politicalClimate": "Tense, with the UK engaged in a prolonged conflict and increasing fears of German expansionism",
    "economicConditions": "Rationing affecting food and clothing, with essential goods becoming scarce",
    "socialIssues": [
      "displacement of families due to war",
      "women's roles in the workforce expanding",
      "racial tensions heightened due to wartime propaganda"
    ],
    "internationalNews": [
      "US and Britain discussing military support for the Allies",
      "reports of atrocities in occupied countries",
      "rising tensions between the US and Japan as war looms in the Pacific"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby – 'White Christmas'",
        "Glenn Miller – 'In the Mood'",
        "Doris Day – 'Sentimental Journey'"
      ],
      "films": [
        "'The Great Dictator'",
        "'Rebecca'",
        "'The Letter'"
      ],
      "theater": [
        "'The Glass Menagerie'",
        "'The King and I'",
        "'Annie Get Your Gun'"
      ],
      "radio": [
        "The Shadow",
        "Orson Welles' Mercury Theatre",
        "Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Grapes of Wrath' by John Steinbeck",
        "'For Whom the Bell Tolls' by Ernest Hemingway",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "war fiction",
        "social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "first radar equipment used in military applications",
        "early development of the electronic computer",
        "improvements in radio broadcasting technology"
      ],
      "commonDevices": [
        "radio sets in many households",
        "early television sets in affluent homes",
        "telephones becoming standard in urban areas"
      ],
      "emergingTrends": [
        "increased use of propaganda in media",
        "emergence of war-related technology",
        "growing interest in home entertainment such as radio and film"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Coal scuttle refill: one shilling sixpence",
        "Taxi across town: two shillings"
      ],
      "commonActivities": [
        "gathering for tea in the afternoons",
        "participating in air raid drills",
        "volunteering for war efforts"
      ],
      "socialRituals": [
        "holiday gatherings with family and friends",
        "community singing and caroling",
        "charity drives for soldiers and their families"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased solidarity among the working class due to shared wartime experiences",
      "growing class tensions as resources become scarce"
    ],
    "gender": [
      "women's contributions in the workforce are increasingly recognized",
      "traditional gender roles being challenged as women take on non-traditional jobs",
      "expectation for women to maintain appearance despite war hardships"
    ],
    "race": [
      "increased awareness of racial inequalities exacerbated by war",
      "some progress in racial integration, particularly in urban areas"
    ],
    "generalNorms": [
      "emphasis on community and mutual support",
      "heightened sense of patriotism",
      "social gatherings focused on wartime themes"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain-soaked earth mingles with the aroma of pine trees as holiday decorations adorn the streets.",
    "The sound of distant air raid sirens echoes, a constant reminder of the war lurking just beyond the horizon.",
    "Dimly lit hotel lobbies filled with murmurs of anxious conversations and the clinking of glasses as patrons seek solace in each other's company."
  ],
  "paragraphs": [
    "December 1940 finds the coastal town shrouded in a blanket of overcast skies, with rain occasionally drizzling down, creating a somber yet festive atmosphere. The streets are adorned with twinkling Christmas lights and pine garlands, setting a stark contrast against the backdrop of an ongoing war. With daylight fading by four o'clock, the town feels enveloped in an early evening gloom, where shadows stretch across the pavement and the sounds of distant air raid sirens serve as a reminder of the world's perils. Hotel lobbies, dimly lit, become gathering places for those seeking warmth and companionship as they navigate the complexities of wartime life.",
    "In this winter season, fashion reflects both the utilitarian needs of the time and a desire for elegance. Men don double-breasted wool suits and stylish tweed overcoats, often topped with fedora hats and accessorized with leather gloves to ward off the chill. Women embrace tea-length dresses with fitted waists, complemented by cloche hats and elegant gloves to showcase their resilience and grace amid adversity. The growing trend of incorporating bold colors into clothing offers a glimmer of vibrancy against the gray winter backdrop, as social expectations insist on maintaining appearances even in the face of struggle.",
    "Daily life is marked by both routine and adjustment, as families gather for tea in the afternoons, exchanging news and stories. The sounds of community singing and caroling echo through the streets during the holiday season, fostering a sense of camaraderie and hope. Prices for essential goods fluctuate under wartime rationing, with a loaf of bread costing four pence and coal for heating becoming a precious commodity. Social rituals, such as holiday gatherings and charity drives, encourage a spirit of giving and solidarity among the townspeople, as they navigate the challenges posed by the ongoing conflict."
  ],
  "note": "",
  "cost": 0.0010892046,
  "durationMs": 14232
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering of hotel guests and staff during a time of social upheaval and suspicion, as the war's aftermath fuels tensions and hidden agendas among the elite.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Class distinctions are blurred by the war's impact, with women entering the workforce and a growing unease about international relations, creating a pressure cooker of ambition and rivalry."
  },
  "setting": {
    "location": "A large, somewhat opulent seaside hotel overlooking the ocean",
    "institution": "hotel",
    "weather": "overcast with occasional rain, typical of a coastal climate"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a mechanical clock-tampering method, where a rewound timepiece staged the apparent time of death."
}

### LOCKED_FACTS
[
  {
    "id": "clock_time_at_discovery",
    "value": "twenty minutes past nine",
    "description": "The exact time displayed on the tampered clock when found."
  },
  {
    "id": "witness_clock_chime",
    "value": "half past eight",
    "description": "Witnesses recall the clock chiming at this time, contradicting the tampering."
  },
  {
    "id": "victims_last_seen_time",
    "value": "ten minutes past nine",
    "description": "The last known sighting of the victim before their time of death."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 18,
  "countsByPlacement": {
    "early": 6,
    "mid": 11,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
    "optional": 1
  },
  "redHerringCount": 1,
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
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_2",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
