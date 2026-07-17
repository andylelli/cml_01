# Actual Prompt Record

- Run ID: `mystery-1784146189809`
- Project ID: ``
- Timestamp: `2026-07-15T20:14:40.102Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `e5a6e83949dddd85`

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
    "title": "The Clock of Deceit",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Cliffside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "seaside hotel"
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
      "public_persona": "A determined investigator known for her sharp intellect.",
      "private_secret": "Struggles with societal expectations of women post-war.",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "solving the case to prove her capabilities.",
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
      "public_persona": "Respected doctor with a promising future.",
      "private_secret": "Had been researching a controversial topic.",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "her reputation and legacy.",
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
      "public_persona": "A war hero with a strong moral code.",
      "private_secret": "Struggles with PTSD from his service.",
      "motive_seed": "Jealousy over Dr. Finch's research success.",
      "motive_strength": "moderate",
      "alibi_window": "7:30 to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining room"
      ],
      "behavioral_tells": [
        "Nervous when discussing the victim."
      ],
      "stakes": "His reputation as a hero.",
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
      "public_persona": "Charming socialite with connections.",
      "private_secret": "Has a secret relationship with Captain Hale.",
      "motive_seed": "Fear of losing Hale's affection.",
      "motive_strength": "high",
      "alibi_window": "7:30 to 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Ballroom"
      ],
      "behavioral_tells": [
        "Avoids eye contact when questioned."
      ],
      "stakes": "Her romantic future.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "An ambitious young woman working in the hotel.",
      "private_secret": "Desires to be more than just a hotel staff.",
      "motive_seed": "Wants to prove herself.",
      "motive_strength": "low",
      "alibi_window": "7:30 to 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel staff areas"
      ],
      "behavioral_tells": [
        "Eager to please others."
      ],
      "stakes": "Career advancement.",
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
      "public_persona": "A successful businessman with a keen interest in art.",
      "private_secret": "Has been involved in questionable deals.",
      "motive_seed": "Possibly involved in the victim's controversial research.",
      "motive_strength": "moderate",
      "alibi_window": "7:30 to 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining room"
      ],
      "behavioral_tells": [
        "Too calm when discussing the crime."
      ],
      "stakes": "Financial reputation.",
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
      "summary": "During a gala at the Cliffside Hotel, Dr. Mallory Finch is found dead, apparently strangled. Eleanor Voss, a determined investigator, must untangle a web of lies, jealousy, and ambition. The key to solving the case lies in a tampered clock that misleads the apparent time of death."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A clock was rewound to create a false narrative about the time of death, indicating it occurred earlier than it actually did.",
      "delivery_path": [
        {
          "step": "The murderer rewound the clock thirty minutes before the murder."
        }
      ]
    },
    "outcome": {
      "result": "The clock's tampering misleads the investigation and creates a false timeline."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred at the time indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock shows a specific time that aligns with the witness statements.",
    "what_it_hides": "The actual time of death was later than indicated."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Captain Hale was seen arguing with Dr. Finch earlier in the evening.",
      "Witnesses recall Hale leaving the dining room just before the clock indicated the time of death."
    ],
    "the_one_flaw": "Hale's alibi for the time of death is corroborated by multiple witnesses in the dining room.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A loud argument heard in the dining room just before the murder.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was about a trivial matter and did not escalate.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Footprints leading away from the crime scene.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The footprints belonged to hotel staff attending to the gala.",
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
    "rationale": "All suspects are guests or staff at the hotel with access to the victim."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The clock shows ten minutes past seven."
      ],
      "windows": [
        "Witnesses recall Dr. Finch dining until at least seven forty."
      ],
      "contradictions": [
        "Witnesses heard the argument at seven thirty, conflicting with the clock's indication."
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
        "The clock",
        "Dining room access"
      ],
      "permissions": [
        "Hotel staff had access to the clock."
      ]
    },
    "physical": {
      "laws": [
        "The clock's mechanism allows for tampering."
      ],
      "traces": [
        "Fingerprints on the clock's face."
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff are trusted to manage the event."
      ],
      "authority_sources": [
        "Captain Hale's reputation as a war hero grants him trust."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock shows ten minutes past seven.",
        "correction": "The time displayed does not match witness recollections of Dr. Finch dining until seven forty.",
        "effect": "Narrows the timeline of the murder.",
        "required_evidence": [
          "The clock shows ten minutes past seven.",
          "Witnesses recall Dr. Finch dining until seven forty."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses heard an argument at seven thirty.",
        "correction": "The argument occurred before the clock indicated the time of death.",
        "effect": "Eliminates the possibility of the argument being the cause of the death.",
        "required_evidence": [
          "Witnesses heard the argument at seven thirty.",
          "The clock shows ten minutes past seven."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock's winding key shows signs of wear.",
        "correction": "The wear indicates recent tampering to reset the clock.",
        "effect": "Narrows suspect pool to those with access to the clock.",
        "required_evidence": [
          "The clock's winding key shows signs of wear.",
          "The clock was accessed by hotel staff."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A comparison of the clock's winding key wear and access records reveals only hotel staff could have accessed the clock.",
    "knowledge_revealed": "The revealed facts are clock, tamper, and minut.",
    "pass_condition": "If the wear aligns with access by hotel staff, the suspect is implicated.",
    "evidence_clues": [
      "clue_5",
      "clue_12",
      "clue_6"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1 establishes the clock's time discrepancy with witness statements. Step 2 clarifies the timing of the argument was inconsistent with the murder timing. Step 3 reveals the clock's tampering, indicating opportunity. The discriminating test confirms only hotel staff could have accessed the clock."
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
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi corroborated by multiple guests.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Hotel records show her duties during the murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His location is confirmed by other guests.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical evidence examination"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_4",
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a traveling journalist whose charm masks a turbulent past entwined with the victim. Her pursuit of truth in the wake of murder becomes a path fraught with personal stakes.",
    "publicPersona": "Charming and observant, Eleanor is well-regarded for her insightful articles on travel and society.",
    "privateSecret": "Eleanor once had a brief romance with the victim, which ended bitterly when she discovered the victim's deceit.",
    "motiveSeed": "She seeks to uncover the truth behind the murder to clear her own name, as she was seen arguing with the victim earlier.",
    "motiveStrength": "strong",
    "alibiWindow": "arrived at the hotel two hours before the murder and was in the dining room until the crime was reported",
    "accessPlausibility": "easy",
    "stakes": "Eleanor risks losing her credibility as a journalist.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a fluid cadence, often using irony to soften the edges of her observations. She has a tendency to ask rhetorical questions as a conversational tool.",
    "signatureTic": "‘Truth is a curious thing, isn’t it?’",
    "internalConflict": "Eleanor grapples with guilt over her past relationship with the victim, questioning whether her feelings cloud her judgment as she seeks justice.",
    "personalStakeInCase": "This crime matters to Eleanor because her reputation as a journalist hinges on her credibility, which could be irrevocably damaged if she’s implicated.",
    "paragraphs": [
      "Eleanor Voss strode through the luxurious halls of the Cliffside Hotel, her mind a tempestuous whirl of emotions. The murder of Dr. Mallory Finch had sent ripples through the social elite, but for Eleanor, it was personal. Once entangled in a passionate affair with the victim, she had been lured into a world of deceit, only to find herself cast aside when the truth surfaced. Now, she was determined to uncover the layers of betrayal that led to Mallory's demise, not only to seek justice but to salvage her own fractured reputation.",
      "Despite her charming demeanor, Eleanor's mind was a labyrinth of doubt and regret. She had argued with Mallory just hours before the murder, and the lingering whispers of suspicion threatened to engulf her. Each inquiry she made felt like a step closer to unearthing the truth, yet also a step further from the woman she had once loved. Her journalist's instincts urged her to dig deeper, while the shadows of her past loomed ominously, reminding her of the fine line between seeking truth and seeking revenge.",
      "As she navigated the intricacies of the investigation, Eleanor found herself challenged not only by the other suspects but by the very memories of her time with Mallory. The woman she had admired was now a ghost, and Eleanor was haunted by the choices they both had made. Her determination to clear her name became entwined with the desire to confront her past, leading her into a dangerous game where every revelation threatened to unravel the fabric of her current life.",
      "With each clue she uncovered, Eleanor's resolve hardened. The stakes were high—her credibility as a journalist, her emotional stability, and the haunting memories that could either bind her to the past or free her to embrace a new future. The clock was ticking, and as the pressure mounted, she realized that the truth she sought was not just about solving a murder; it was about reclaiming her identity in a world built on deception."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose public persona masks a life riddled with financial despair and scandal. Her secrets make her a tragic victim in a web of deceit.",
    "publicPersona": "A respected doctor known for her charitable work and commitment to the community.",
    "privateSecret": "Mallory is deeply in debt due to failed investments and is involved in a scandal that could ruin her reputation.",
    "motiveSeed": "Desperate to escape her financial troubles, she believed the victim was about to expose her misdeeds.",
    "motiveStrength": "moderate",
    "alibiWindow": "claims to have been treating a patient during the murder, but is vague on details",
    "accessPlausibility": "possible",
    "stakes": "Mallory’s career and financial security are on the line.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory's speech is precise and clinical, reflecting her profession, often punctuated by a slight tremor when discussing personal matters. She avoids eye contact when feeling cornered.",
    "signatureTic": "‘I’m afraid that’s not a topic for discussion.’",
    "internalConflict": "Mallory is torn between her professional façade and the sinking realization that her life is built on lies, leading to a profound sense of shame.",
    "personalStakeInCase": "This crime matters to Mallory because exposure of her financial troubles could ruin her career and destroy her reputation as a trusted physician.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the precipice of her career, her reputation teetering on the edge of ruin. As a respected physician, she had dedicated her life to healing, yet the shadows of her financial misdeeds loomed larger than any patient she had ever treated. The murder that had claimed her life was a cruel twist of fate; she had been on the verge of exposure, grappling with debts that threatened to swallow her whole. In her final moments, she had clung to the hope that her secrets would remain hidden.",
      "Behind her composed exterior lay a mind consumed by turmoil. Mallory had made choices that had led her down a dark path, and now, as a victim, she was forced to reckon with the consequences of her actions. The weight of her financial troubles pressed heavily on her shoulders, and the fear of being outed as a fraud gnawed at her insides. The irony was not lost on her; a healer brought low by her own failings, unable to save herself from the impending doom.",
      "In the moments leading up to her murder, Mallory had been treating a patient—a vague alibi that felt increasingly flimsy. The details eluded her, slipping through her fingers like sand. She had always prided herself on her meticulous nature, yet now, her life felt like a house of cards, ready to collapse with the slightest breeze. The whispers of scandal echoed in her mind, and the thought of being exposed as a charlatan was more terrifying than death itself.",
      "Mallory’s final moments were a cacophony of regret and fear. As she lay lifeless, the truth of her dual existence remained buried with her. The world would remember her as a charitable doctor, unaware of the desperate measures she had taken to maintain that façade. In death, she became a victim not only of murder but of her own choices, leaving behind a tangled web of secrets that would haunt those who dared to unravel it."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer whose sense of honor is marred by a personal betrayal. His past conflicts with the victim reveal a complex character steeped in loyalty and resentment.",
    "publicPersona": "Ivor is admired for his bravery during the war and his work with veterans.",
    "privateSecret": "He harbors resentment towards the victim for a betrayal concerning a romantic interest years ago.",
    "motiveSeed": "Ivor felt betrayed by the victim’s actions, which undermined his reputation in their social circle.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the ballroom conversing with guests during the murder, but few can confirm his whereabouts",
    "accessPlausibility": "possible",
    "stakes": "Ivor's honor and legacy in the community are at stake.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a commanding presence, his words often tinged with a dry humor that masks deeper grievances. He tends to use military metaphors to illustrate his points.",
    "signatureTic": "‘It’s a hard truth, but we must face it.’",
    "internalConflict": "Ivor struggles with feelings of betrayal and the desire to uphold his honor, caught between loyalty to his past and the need for personal integrity.",
    "personalStakeInCase": "This crime matters to Ivor because it threatens to tarnish the legacy he built after the war, one where honor is paramount.",
    "paragraphs": [
      "Captain Ivor Hale, a man of principle and valor, found himself ensnared in a web of suspicion that threatened to unravel the very fabric of his reputation. Once a decorated naval officer, he was now a relic of a bygone era, admired for his bravery yet haunted by the shadows of betrayal. The murder of Dr. Mallory Finch was not just a tragedy; it was a reminder of the complexities of human relationships, particularly his fraught history with the victim.",
      "Years ago, Ivor had been betrayed by Mallory in a matter of the heart, and the wounds had never fully healed. The sense of honor that had guided him through the war now felt like a double-edged sword. He was torn between the loyalty he once held and the resentment that had festered over time. The thought of their shared social circle whispering about his past failures filled him with a mix of anger and regret, threatening to expose him in ways he had long sought to bury.",
      "In the ballroom, Ivor's presence commanded attention, yet he felt the weight of scrutiny from those around him. His alibi, a conversation with guests, was flimsy at best; few could vouch for his whereabouts during the crucial moments of the murder. As he navigated the crowd, his mind raced with the implications of being a suspect. The very honor he had fought to uphold now felt precarious, as though it could be shattered by mere gossip or conjecture.",
      "As he grappled with his feelings towards Mallory, Ivor began to recognize that the path to redemption lay not only in confronting his past but also in redefining what honor meant to him. The stakes had never been higher; the murder investigation threatened to tarnish his legacy, and Ivor was determined to protect the honor he had fought so hard to establish. In a world where betrayal lurked in every corner, he realized that the true battle was not with Mallory’s ghost but with the echoes of his own choices."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a socialite whose sharp wit and charm mask a desperate need for validation. Her envy of the victim's status drives her into a dangerous game of manipulation.",
    "publicPersona": "Beatrice is a darling of high society, attending all the right parties and known for her sharp wit.",
    "privateSecret": "She is involved in a love triangle that could ruin her reputation if exposed.",
    "motiveSeed": "Jealous of the victim’s superiority in social standing, Beatrice feared losing her position in elite circles.",
    "motiveStrength": "moderate",
    "alibiWindow": "was seen mingling with other guests in the ballroom at the time of the murder",
    "accessPlausibility": "easy",
    "stakes": "Beatrice's social status and romantic prospects are at risk.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a playful lilt, often using sarcasm to mask her insecurities. She has a tendency to drop names of influential figures to bolster her standing.",
    "signatureTic": "‘Oh darling, you know how it is in our circles.’",
    "internalConflict": "Beatrice is torn between her desire for social acceptance and the realization that her manipulations may lead to her downfall.",
    "personalStakeInCase": "This crime matters to Beatrice because her social standing and potential romantic entanglements hinge on the outcome of the investigation.",
    "paragraphs": [
      "Beatrice Quill floated through the ballroom like a butterfly, her laughter ringing like chimes amidst the clinking of glasses. To the public eye, she was the epitome of high society, a darling of the elite whose sharp wit and charm captivated all. But beneath the surface, Beatrice was a tightly wound coil of jealousy and insecurity, especially when it came to Dr. Mallory Finch. The victim’s effortless grace and superior social standing threatened to eclipse Beatrice’s own ambitions, and the thought of losing her status was unbearable.",
      "The love triangle that ensnared her was a closely guarded secret, one that could unravel her carefully constructed persona. Beatrice found herself walking a tightrope, balancing her desires with the fear of exposure. Each interaction with Mallory felt like a game of chess, where one wrong move could lead to checkmate. The stakes were high, and Beatrice was determined to maintain her position in the social hierarchy, even if it meant resorting to manipulation.",
      "As the news of Mallory's murder spread, Beatrice's mind raced with the implications. She had mingled with the guests during the time of the murder, but the whispers of suspicion began to swirl around her like a tempest. The thought of being implicated sent shivers down her spine; she couldn’t afford to lose everything she had worked for. The facade she maintained was cracking, and the pressure to appear unaffected only intensified her anxiety.",
      "In the days that followed, Beatrice found herself at a crossroads. The investigation thrust her into a perilous position, forcing her to confront the very nature of her desires. Was her pursuit of social acceptance worth the price of her integrity? As secrets began to unravel, Beatrice realized that the game she had been playing could lead to her own undoing—one that could shatter her carefully curated world in an instant."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a fashion designer whose creative brilliance is shadowed by a dark secret of plagiarism. Her fear of exposure drives her deeper into a world of deceit.",
    "publicPersona": "Sylvia is renowned for her innovative designs and has a growing influence in the fashion world.",
    "privateSecret": "Her recent success is built on plagiarizing designs from the victim.",
    "motiveSeed": "Sylvia feared the victim would expose her for stealing ideas, which could devastate her career.",
    "motiveStrength": "strong",
    "alibiWindow": "was in her hotel room sketching during the murder, but the room was not monitored",
    "accessPlausibility": "unlikely",
    "stakes": "Sylvia’s career and artistic integrity are threatened.",
    "humourStyle": "deadpan",
    "humourLevel": 0.2,
    "speechMannerisms": "Sylvia speaks with a measured tone, often choosing her words carefully as if she’s always aware of the scrutiny around her. She rarely indulges in humor, preferring a serious demeanor.",
    "signatureTic": "‘Art is a reflection of our true selves.’",
    "internalConflict": "Sylvia battles guilt and fear, knowing that her success is built on a foundation of theft, leading to a moral crisis.",
    "personalStakeInCase": "This crime matters to Sylvia because exposure of her plagiarism could obliterate her career and artistic reputation.",
    "paragraphs": [
      "Sylvia Trent sat in her hotel room, surrounded by sketches that whispered of brilliance and deceit. As a fashion designer, she had climbed to new heights of success, yet the foundation of her achievements was built on borrowed ideas—stolen from the very woman who had just been murdered. Dr. Mallory Finch had been more than a victim; she had been Sylvia’s muse, and now her death left a void filled with fear and uncertainty. The fashion world was unforgiving, and Sylvia knew that exposure would lead to her ruin.",
      "With each passing hour, Sylvia’s anxiety mounted. The police investigation loomed like a dark cloud over her creative spirit, suffocating her with the weight of her guilt. She had been sketching in her room during the murder, a flimsy alibi that could crumble under scrutiny. The knowledge that her success was tainted gnawed at her conscience, and the fear of being unmasked as a fraud threatened to overshadow her talent. She had always believed that art was a reflection of one's true self, yet here she was, a mere shadow masquerading as a visionary.",
      "Sylvia’s demeanor was often serious, her words chosen with a precision that belied her inner turmoil. She had long since abandoned humor as a coping mechanism, preferring to maintain a facade of professionalism. But the truth was a relentless specter, haunting her every thought. Would the world see her as the artist she aspired to be, or would they uncover the thief hiding behind the curtain? The stakes were high, and the fear of losing everything made her desperate to keep her secrets hidden.",
      "As the investigation unfolded, Sylvia found herself at a crossroads, a moment that could define her career and her integrity. The fear of exposure was palpable, yet the desire to create and be recognized for her own talent burned within her. She had to confront the reality of her choices and the lengths she would go to preserve her art. The clock was ticking, and with each tick, the truth threatened to unravel the life she had so carefully constructed."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a wealthy investor whose charm masks a web of shady dealings. His motives are steeped in greed, and the murder creates a perfect storm of danger for his empire.",
    "publicPersona": "Hugo is powerful and influential, often seen at high-profile events, admired for his financial acumen.",
    "privateSecret": "He is involved in shady business deals that the victim knew too much about.",
    "motiveSeed": "Hugo stands to benefit financially from the victim's silence regarding his illegal activities.",
    "motiveStrength": "strong",
    "alibiWindow": "claims he was in a phone meeting during the murder, but the call is unrecorded",
    "accessPlausibility": "easy",
    "stakes": "Hugo's fortune and reputation are threatened.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Hugo speaks with a smooth, confident tone, often peppering his dialogue with clever quips that reveal a razor-sharp wit. He enjoys playing the role of the charming rogue.",
    "signatureTic": "‘In the world of finance, honesty is often a luxury.’",
    "internalConflict": "Hugo is torn between his insatiable greed and the fear that his empire could collapse at any moment due to exposure of his misdeeds.",
    "personalStakeInCase": "This crime matters to Hugo because the fallout from the murder could unravel his carefully constructed empire and expose his illegal dealings.",
    "paragraphs": [
      "Hugo Vane leaned against the bar, the epitome of charm and sophistication, yet beneath the polished exterior lay a labyrinth of deceit. As a wealthy investor, he had thrived in a world where power and influence reigned supreme. The murder of Dr. Mallory Finch was a storm brewing on the horizon—a tempest that could shatter the very foundations of his empire. He had much to lose; the victim knew too much about his shady dealings, and the thought of exposure sent a chill down his spine.",
      "In the moments leading up to the murder, Hugo had claimed to be occupied with a phone meeting, yet the absence of any recorded evidence left a gaping hole in his alibi. As he mingled with guests, his mind raced with the implications of being linked to the crime. The stakes had never been higher; his fortune and reputation were on the line. The whispers of suspicion that followed him felt like vultures circling, waiting for the moment of reckoning.",
      "Hugo's speech was smooth, each word carefully crafted to portray an image of confidence and control. His quips often masked his anxiety, a polite savagery that belied the turmoil within. He relished in the role of the charming rogue, using humor as a shield against the encroaching darkness. Yet, as the investigation unfolded, he found himself grappling with the reality that his greed had led him to this precarious precipice.",
      "The fallout from Mallory's murder threatened not only his financial stability but also the carefully constructed façade he had maintained for years. As the clock ticked down on the investigation, Hugo realized that the time for clever words and charm was running out. He would have to confront the consequences of his actions and the dangerous game he had played for far too long—one that could ultimately lead to his undoing."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Cliffside Hotel",
    "type": "seaside hotel",
    "place": "Scarborough",
    "country": "England",
    "summary": "A grand art deco hotel perched on a cliff, overlooking the turbulent sea, frequented by both tourists and the local elite.",
    "visualDescription": "The hotel boasts sweeping terraces adorned with wrought iron balustrades, large windows framed in polished mahogany, and a façade of shimmering sea-green tiles. Inside, the lobby features a grand staircase, plush velvet seating, and an ornate chandelier that casts a warm glow over the marble floors.",
    "atmosphere": "A blend of grandeur and tension, where elegance masks the underlying anxieties of a nation recovering from war.",
    "paragraphs": [
      "Perched precariously on the edge of a rugged cliff, the Cliffside Hotel stands as a monument to the era’s opulence, a place where the crashing waves below seem to echo the whispers of secrets held within its walls. The salty breeze carries with it the scent of the ocean, mingling with the faint aroma of freshly brewed tea served in delicate china. Guests meander through the spacious lobby, their laughter ringing out against the backdrop of the rhythmic surf, while the distant sound of a radio crackles with news of the world beyond their coastal retreat.",
      "Inside the hotel, art deco motifs dance across the walls, a celebration of geometric shapes and bold colors that invites guests to revel in the luxury of the moment. However, beneath the surface, an air of unease lingers—a reminder of the societal shifts occurring outside. The ballroom, often bustling with elegantly dressed patrons, now serves as a stage for whispered conversations and veiled glances, as the shadows of recent conflicts loom large over the festivities.",
      "As evening falls, the hotel transforms. Candlelight flickers in the dining room, casting dancing shadows over the faces of diners lost in their own thoughts. The sound of a distant clock strikes the hour, each chime echoing the tension that hangs in the air. Outside, the waves crash violently against the rocks, a reminder of nature's unpredictability, much like the secrets harbored within the hotel’s opulent walls."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain showers, common along the coast in early spring",
    "timeFlow": "Three days of mounting tension as the mystery unfolds",
    "mood": "tense due to the underlying social tensions from recent global conflicts",
    "eraMarkers": [
      "Art deco architecture and decor",
      "Radio broadcasting in the lobby",
      "Rationed fuel for transportation"
    ],
    "sensoryPalette": {
      "dominant": "Salt air and candle wax",
      "secondary": [
        "Polished mahogany and velvet",
        "Ocean waves and distant thunder"
      ]
    },
    "paragraphs": [
      "The Cliffside Hotel stands sentinel over the tumultuous sea, its grandeur juxtaposed against the bleakness of the weather. Overhead, dark clouds loom, casting a shadow over the vibrant colors of the hotel’s façade. Within, the sounds of laughter and clinking glasses are punctuated by the crackle of the radio, broadcasting news from a world grappling with change. The air is thick with the scent of salt and damp stone, reminding all who enter that while they may seek refuge, the outside world remains ever present.",
      "As guests retreat to their rooms for the night, the atmosphere shifts. The flickering flames of candles cast long shadows, and the scent of beeswax mingles with the faint aroma of tobacco smoke. Outside, the waves crash violently against the cliffs, a reminder of the storm brewing both in the skies and within the hotel’s walls. Secrets abound, and as the clock ticks steadily towards midnight, the tension becomes palpable, setting the stage for a night that will change everything."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Cliffside Terrace",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A narrow ledge overlooking the ocean, adorned with wrought iron railings, slick with rain.",
      "sensoryDetails": {
        "sights": [
          "dark sea churning below",
          "flickering lanterns casting shadows",
          "wet stone underfoot",
          "clouds rolling in from the horizon"
        ],
        "sounds": [
          "crashing waves against the cliffs",
          "distant thunder rumbling",
          "wind howling through the railings",
          "the flutter of a loose flag"
        ],
        "smells": [
          "salt-laden air",
          "damp earth and moss",
          "wet iron from the railings",
          "faint perfume lingering"
        ],
        "tactile": [
          "slick stone surface",
          "cold metal railing",
          "chill of the ocean breeze",
          "rough texture of the cliff edge"
        ]
      },
      "accessControl": "Restricted to hotel guests; only accessible via the dining room exit.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "raindrops splattering on stone"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft whispers of the sea"
          ],
          "smells": [
            "damp wood",
            "fresh rain on earth",
            "cold stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "shimmering wet stones"
          ],
          "sounds": [
            "wind rustling through grass",
            "occasional gull cries"
          ],
          "smells": [
            "wet seaweed",
            "brine and algae",
            "mildew"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset colors reflected on water",
            "long shadows stretching across the terrace"
          ],
          "sounds": [
            "gentle lapping of waves",
            "distant laughter from the dining room"
          ],
          "smells": [
            "smoky barbecue from the kitchen",
            "freshly cut grass",
            "cool evening air"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Cliffside Terrace juts out precariously, a narrow ledge offering stunning views of the tumultuous sea below. Its wrought iron railings, slick with rain, provide little comfort to those who stand too close to the edge. The air is thick with the scent of salt and damp earth, each gust of wind carrying with it the whispers of secrets yet to be uncovered. As guests gather for a breath of fresh air, the tension is palpable, the sounds of crashing waves echoing the turmoil brewing beneath the surface.",
        "In the dim light of morning, the terrace takes on a somber tone. Raindrops splatter against the stone, creating a rhythm that seems to sync with the anxious hearts of those who tread upon it. The distant rumble of thunder serves as a reminder of the storm brewing, both in the skies and within the hotel. Here, at the edge of the world, the line between safety and danger blurs, setting the stage for the unfolding mystery."
      ]
    },
    {
      "id": "dining_room",
      "name": "Grand Dining Room",
      "type": "interior",
      "purpose": "Gathering space and dining",
      "visualDetails": "An expansive room with tall windows, adorned with crystal chandeliers and elegant table settings.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware and crystal glasses",
          "ornate chandeliers casting warm light",
          "colorful floral arrangements on tables",
          "polished wooden floors reflecting light"
        ],
        "sounds": [
          "clinking of glasses",
          "soft murmur of conversation",
          "rustle of tablecloths",
          "distant piano music"
        ],
        "smells": [
          "roasted meats and fresh bread",
          "sweet aroma of desserts",
          "rich coffee and tea",
          "citrus from fruit garnishes"
        ],
        "tactile": [
          "smooth tablecloths under fingertips",
          "cool metal of cutlery",
          "soft upholstery of dining chairs",
          "warmth of candle flames"
        ]
      },
      "accessControl": "Open to all guests during meal times; private events restrict access.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "misty windows with raindrops",
            "soft morning light filtering in"
          ],
          "sounds": [
            "distant patter of rain",
            "quiet laughter from early risers"
          ],
          "smells": [
            "freshly baked pastries",
            "strong coffee brewing",
            "citrus from breakfast fruits"
          ],
          "mood": "comforting warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across tables",
            "dimmed chandelier lights"
          ],
          "sounds": [
            "quiet conversations",
            "soft piano notes"
          ],
          "smells": [
            "herbal tea brewing",
            "spices from the kitchen",
            "freshly baked scones"
          ],
          "mood": "contemplative"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of candlelight on tables",
            "golden light from chandeliers"
          ],
          "sounds": [
            "lively conversations",
            "laughter ringing through the room"
          ],
          "smells": [
            "savory dishes being served",
            "sweet floral scents from centerpieces",
            "warmth of baked goods"
          ],
          "mood": "festive celebration"
        }
      ],
      "paragraphs": [
        "The Grand Dining Room is a masterpiece of art deco design, where guests gather to indulge in sumptuous meals while soaking in the elegance that surrounds them. Tall windows frame the picturesque views of the ocean, while the soft glow of crystal chandeliers casts a warm light over the polished tables. The air is filled with the rich aromas of roasted meats, fresh bread, and the sweet scent of pastries, drawing guests into a world of culinary delight. However, beneath the surface of laughter and clinking glasses lies an undercurrent of tension, as whispered conversations hint at unease.",
        "As evening descends, the dining room transforms into a scene of celebration. Candlelight flickers on each table, illuminating the faces of those gathered, their laughter mingling with the soft notes of a distant piano. The scent of savory dishes and sweet desserts fills the air, creating an intoxicating atmosphere. Yet, as the clock ticks on, the shadows deepen, and the conversations grow hushed, as if the very walls of the hotel are listening to the secrets being exchanged."
      ]
    },
    {
      "id": "ballroom",
      "name": "Ornate Ballroom",
      "type": "interior",
      "purpose": "Event space for gatherings and dances",
      "visualDetails": "A lavishly decorated space with a polished dance floor and gilded mirrors reflecting light.",
      "sensoryDetails": {
        "sights": [
          "gilded mirrors reflecting flickering lights",
          "elegant drapery flowing from the ceiling",
          "intricate patterns on the dance floor",
          "sparkling chandeliers overhead"
        ],
        "sounds": [
          "soft music playing from a gramophone",
          "the swish of gowns and shoes on the floor",
          "laughter and chatter from guests",
          "clinking glasses"
        ],
        "smells": [
          "freshly polished wood",
          "flowers from centerpieces",
          "cologne and perfume",
          "exotic spices from hors d'oeuvres"
        ],
        "tactile": [
          "smooth wood of the dance floor",
          "cool glass of champagne flutes",
          "soft fabric of gowns brushing against skin",
          "warmth of bodies moving together"
        ]
      },
      "accessControl": "Closed during private events; accessible to guests during public dances.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "damp reflections in gilded mirrors",
            "soft light filtering through drapery"
          ],
          "sounds": [
            "rain pattering against windows",
            "quiet hushed voices"
          ],
          "smells": [
            "wet fabric",
            "fresh flowers",
            "musty air"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows lengthening on the dance floor",
            "dimly lit chandeliers"
          ],
          "sounds": [
            "soft murmurs of conversation",
            "slow waltz music playing"
          ],
          "smells": [
            "scent of polished wood",
            "hint of perfume lingering in the air",
            "fresh flowers"
          ],
          "mood": "wistful nostalgia"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sparkling lights reflecting on the dance floor",
            "guests twirling in elegant gowns"
          ],
          "sounds": [
            "upbeat music playing",
            "laughter and applause filling the air"
          ],
          "smells": [
            "rich food aromas",
            "sweet perfumes",
            "smoky incense from candles"
          ],
          "mood": "joyous celebration"
        }
      ],
      "paragraphs": [
        "The Ornate Ballroom is a dazzling display of elegance, with gilded mirrors reflecting the soft glow of chandeliers above. The polished dance floor beckons couples to glide across it, while the air is thick with the scent of fresh flowers and the sound of laughter mingling with music. However, as the evening unfolds, the atmosphere shifts, shadows creeping into the corners as secrets are whispered and glances exchanged, hinting at the complexities that lie beneath the surface of this seemingly perfect gathering.",
        "As guests arrive for an evening of revelry, the ballroom comes alive. Laughter echoes against the walls, and the sound of soft music fills the air, enticing couples to take to the floor. The warmth of bodies moving together creates a palpable energy, yet the scent of perfume mingled with the rich aromas of exquisite hors d'oeuvres serves as a reminder that not all is as it seems. In this space of celebration, the tension of unspoken truths hangs heavy, creating an atmosphere ripe for revelation."
      ]
    },
    {
      "id": "kitchen",
      "name": "Hotel Kitchen",
      "type": "interior",
      "purpose": "Food preparation area",
      "visualDetails": "A bustling kitchen filled with gleaming utensils and large ovens, the air thick with the scent of cooking.",
      "sensoryDetails": {
        "sights": [
          "stainless steel counters gleaming under lights",
          "chefs bustling around with ingredients",
          "pots steaming on the stove",
          "fresh produce stacked in crates"
        ],
        "sounds": [
          "clattering of pots and pans",
          "sizzling on the stove",
          "voices of kitchen staff communicating",
          "water running in the sink"
        ],
        "smells": [
          "rich broth simmering",
          "freshly baked bread",
          "herbs and spices wafting",
          "smoky aromas from the grill"
        ],
        "tactile": [
          "smooth stainless steel surfaces",
          "warmth radiating from the oven",
          "rough texture of burlap sacks",
          "coolness of fresh vegetables"
        ]
      },
      "accessControl": "Staff-only access; guests prohibited unless on a special tour.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "steam rising from hot dishes",
            "damp ingredients being prepped"
          ],
          "sounds": [
            "soft chatter of morning staff",
            "water dripping from the eaves outside"
          ],
          "smells": [
            "freshly brewed coffee",
            "warm pastries baking",
            "scent of herbs being chopped"
          ],
          "mood": "energetic and bustling"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "pans lined up for dinner service"
          ],
          "sounds": [
            "clattering of cutlery",
            "sizzling from the grill",
            "urgent calls from chefs"
          ],
          "smells": [
            "savory dishes being prepared",
            "spices filling the air",
            "the scent of cleaning agents"
          ],
          "mood": "frantic preparation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glimmering lights reflecting off polished surfaces",
            "preparation for the evening meal"
          ],
          "sounds": [
            "soft music playing in the background"
          ],
          "smells": [
            "rich aromas of dinner cooking",
            "sweet scents of desserts",
            "fresh herbs being chopped"
          ],
          "mood": "calm before the storm"
        }
      ],
      "paragraphs": [
        "The Hotel Kitchen is a whirlwind of activity, filled with the sounds and smells of culinary creation. Stainless steel counters gleam under the bright lights, while chefs bustle about, their movements choreographed by years of practice. The air is thick with the scent of rich broths simmering and freshly baked bread, enticing all who pass by. However, the frenetic energy also hints at the pressures of high-stakes service, where any misstep could lead to disaster.",
        "As the day progresses, the kitchen transforms into a cacophony of sounds and scents. The clattering of pots and pans fills the air, accompanied by the sizzling of food on the grill. Shadows dance across the surfaces, cast by the overhead lights, creating an atmosphere of urgency. Yet, beneath the chaos lies a sense of camaraderie among the staff, each member playing their part in the delicate ballet of dinner service, a world away from the tensions brewing in the dining area."
      ]
    }
  ],
  "note": "",
  "cost": 0.00240899835,
  "durationMs": 50056
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1946,
    "month": "February",
    "day": 14,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool coastal winds"
    ],
    "daylight": "Short days with limited sunlight, as twilight descends around five o'clock in the evening",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Valentine's Day on February 14th"
    ],
    "seasonalActivities": [
      "strolling along the beach in rain gear",
      "attending indoor dances at the hotel",
      "visiting local cafes for warm drinks"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suit in navy",
        "white dress shirt with a starched collar",
        "black oxford shoes"
      ],
      "casual": [
        "tweed jacket with elbow patches",
        "corduroy trousers",
        "woolen sweater"
      ],
      "accessories": [
        "fedora hat",
        "silk tie",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "full-length evening gown with a cinched waist",
        "pearl necklace",
        "stiletto heels"
      ],
      "casual": [
        "woolen skirt and knitted cardigan",
        "checked blouse",
        "ankle boots"
      ],
      "accessories": [
        "clutch purse",
        "beret hat",
        "faux fur stole"
      ]
    },
    "trendsOfTheMoment": [
      "cinched waistlines in women's dresses",
      "military-inspired details in men's fashion",
      "use of bold prints and colors"
    ],
    "socialExpectations": [
      "men are expected to be chivalrous and courteous",
      "women are entering the workforce and gaining independence",
      "social gatherings often have strict etiquette"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the beginning of the Cold War tensions",
      "the establishment of the United Nations in 1945",
      "the ongoing recovery from World War II in Europe"
    ],
    "politicalClimate": "Heightened tensions between the East and West, with the UK and US solidifying alliances against Soviet influence",
    "economicConditions": "Post-war scarcity causing rising prices and rationing still in effect, although some recovery is evident in urban areas",
    "socialIssues": [
      "housing shortages due to returning veterans",
      "gender roles evolving as women seek jobs",
      "racial tensions increasing with migration patterns"
    ],
    "internationalNews": [
      "the Marshall Plan discussions begin to aid European recovery",
      "the Nuremberg Trials are concluding"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'I'll Be Seeing You' by Bing Crosby",
        "'Don't Fence Me In' by Bing Crosby and The Andrews Sisters",
        "'Ain't That a Kick in the Head' by Dean Martin"
      ],
      "films": [
        "'The Best Years of Our Lives'",
        "'It’s a Wonderful Life'",
        "'Notorious'"
      ],
      "theater": [
        "'The Glass Menagerie'",
        "'Carousel'",
        "'Annie Get Your Gun'"
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
        "'The Stranger' by Albert Camus",
        "'The Postman Always Rings Twice' by James M. Cain"
      ],
      "popularGenres": [
        "detective fiction",
        "romantic novels",
        "post-war literature exploring trauma"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "early computers in experimental stages",
        "first commercial television broadcasts"
      ],
      "commonDevices": [
        "vacuum tubes in radios",
        "typewriters",
        "cameras with film"
      ],
      "emergingTrends": [
        "increased use of plastics in everyday items",
        "advancements in radar technology from military use to civilian applications"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A cup of coffee: six pence",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "gathering for tea in the afternoon",
        "visiting the seaside for leisure walks",
        "participating in community dances at the local hall"
      ],
      "socialRituals": [
        "formal dining etiquette during meals",
        "exchanging Valentine's gifts on February 14th"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a growing middle class is emerging post-war",
      "class distinctions are still pronounced but challenged by increased mobility"
    ],
    "gender": [
      "women's roles are evolving, with more women in the workforce",
      "traditional expectations of femininity are being questioned"
    ],
    "race": [
      "increased awareness of civil rights issues",
      "racial segregation still prevalent in many areas, sparking debates"
    ],
    "generalNorms": [
      "courtesy and manners are highly valued",
      "community involvement is encouraged",
      "individualism is on the rise post-war"
    ]
  },
  "atmosphericDetails": [
    "The salty breeze carries the scent of the ocean, mingling with the dampness of the rain-soaked streets.",
    "The rhythmic sound of waves crashing against the shore offers a haunting backdrop, as the shadows lengthen in the dim light.",
    "Inside the seaside hotel, the flickering glow of candles casts dancing shadows on the walls, where whispers of secrets linger in the air."
  ],
  "paragraphs": [
    "February 1946 finds the seaside hotel nestled against the rugged coastline, cloaked in overcast skies and the threat of rain. This winter month brings cool winds, and twilight descends early, creating an atmosphere of tension and anticipation. Guests at the hotel, perhaps seeking solace or distraction from the lingering effects of the recent world conflict, gather in the dimly lit lounge, exchanging polite conversation while the sound of the ocean echoes outside. Valentine's Day is just around the corner, a time when romance is often in the air, yet the weight of the Cold War looms heavy, casting a pall over the festivities.",
    "Fashion trends in this post-war period reflect a mix of practicality and emerging glamour. Men don double-breasted wool suits, paired with polished black oxfords, while women dress in elegant full-length evening gowns cinched at the waist, adorned with pearls and stiletto heels. The use of bold prints and military-inspired details in both men’s and women’s clothing illustrates a society in flux, grappling with the remnants of war while simultaneously yearning for normalcy. As the evening unfolds, the guests at the hotel embody a blend of the past's formality and the future's aspirations, with accessories like fedora hats and faux fur stoles adding an air of sophistication to the gathering.",
    "Daily life along the coast during this winter month is marked by a mixture of routine and social engagement. Prices reflect the post-war economy, with a loaf of bread costing four pence and a cup of coffee six pence. The locals and hotel guests alike indulge in warm drinks at the café, while community dances bring people together to share laughter and music. Social rituals, such as formal dining etiquette and exchanging Valentine's gifts, highlight the importance of tradition amidst change. As some women step into the workforce, their newfound independence is subtly reshaping societal expectations, creating a dynamic social landscape where old norms are challenged and redefined."
  ],
  "note": "",
  "cost": 0.0010813836,
  "durationMs": 16072
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A private gala at a cliffside hotel brings together a diverse group of guests, all navigating the tensions of post-war society while vying for attention and favor in a world reshaped by conflict.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The shifting dynamics of class and gender roles, with women increasingly entering the workforce and societal pressures mounting from Cold War anxieties."
  },
  "setting": {
    "location": "A grand, art deco hotel perched on a cliff overlooking the ocean",
    "institution": "seaside hotel",
    "weather": "overcast with occasional rain showers"
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
    "id": "time_of_death",
    "value": "ten minutes past twelve",
    "description": "The clock was set to this time after being rewound."
  },
  {
    "id": "actual_time_of_death",
    "value": "twelve minutes past twelve",
    "description": "The victim died at this actual time, verified by a witness."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 5,
    "mid": 14,
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
      "category": "temporal"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
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
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "temporal"
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
      "category": "physical"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_early_2",
      "placement": "mid",
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
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
