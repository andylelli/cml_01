# Actual Prompt Record

- Run ID: `run_f90e5f09-fc85-42df-ac3f-0b2046c0c3e1`
- Project ID: `proj_8c4c19d0-23d6-4802-8d0c-6786100ca9b3`
- Timestamp: `2026-07-13T18:31:15.042Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `555c6d30a860e80e`

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
    "title": "The Garden Sundial Enigma",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Fingerprinting standard",
        "Basic toxicology available",
        "Thermal expansion physical laws known",
        "No modern electronics or post-1945 science",
        "Telephone and telegram communication common"
      ]
    },
    "setting": {
      "location": "Wentworth Manor",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Country house estate (Manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "brass latch delayed gate bolt murder"
    }
  },
  "death_method": "struck with a heavy brass garden gate bolt",
  "cast": [
    {
      "name": "Inspector Evelyn Harcourt",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [
        "Professional acquaintance of Wentworth family",
        "Respected by upper class and servants alike"
      ],
      "public_persona": "Sharp, methodical, calm investigator",
      "private_secret": "Harbors personal doubts about justice in class-divided society",
      "motive_seed": "None (investigator)",
      "motive_strength": "none",
      "alibi_window": "Present at manor throughout investigation",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Full access to manor grounds",
        "Authority to question all inhabitants"
      ],
      "behavioral_tells": [
        "Persistent focus on physical evidence",
        "Avoids social bias"
      ],
      "stakes": "Professional reputation, personal commitment to truth",
      "evidence_sensitivity": [
        "Physical traces",
        "Witness testimony",
        "Mechanical devices"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Lady Beatrice Wentworth",
      "age_range": "45-55",
      "role_archetype": "victim",
      "relationships": [
        "Wife of Charles Wentworth",
        "Known tensions with Margot Sinclair"
      ],
      "public_persona": "Respected matriarch, dignified hostess",
      "private_secret": "Had a secret tryst planned at stables midday",
      "motive_seed": "None (victim)",
      "motive_strength": "none",
      "alibi_window": "N/A (deceased)",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Charles Wentworth",
      "age_range": "50-60",
      "role_archetype": "Family patriarch",
      "relationships": [
        "Husband of Lady Beatrice",
        "Rivalry with Robert Hensley"
      ],
      "public_persona": "Stoic, authoritative lord of manor",
      "private_secret": "Financial troubles hidden from family",
      "motive_seed": "Jealousy and financial desperation",
      "motive_strength": "high",
      "alibi_window": "Claims to have been in study from noon to two pm",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to manor grounds and garden gate",
        "Knowledge of latch mechanism through estate maintenance"
      ],
      "behavioral_tells": [
        "Short temper when questioned",
        "Avoids discussing financial matters"
      ],
      "stakes": "Control of estate, reputation",
      "evidence_sensitivity": [
        "Gate latch knowledge",
        "Presence near garden gate"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Margot Sinclair",
      "age_range": "35-45",
      "role_archetype": "Family friend/guest",
      "relationships": [
        "Close friend to Lady Beatrice",
        "Strained relationship with Charles Wentworth"
      ],
      "public_persona": "Charming socialite, confidante",
      "private_secret": "Blackmailed victim over past indiscretion",
      "motive_seed": "Fear of exposure",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been in the library from one to two pm",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to manor interior",
        "Could access garden via servants’ entrance"
      ],
      "behavioral_tells": [
        "Nervous when questioned about whereabouts",
        "Avoids mentioning midday activities"
      ],
      "stakes": "Social standing, secret preservation",
      "evidence_sensitivity": [
        "Library access",
        "Servants’ testimonies"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Robert Hensley",
      "age_range": "40-50",
      "role_archetype": "Estate manager",
      "relationships": [
        "Disliked by Charles Wentworth",
        "Trusted by servants"
      ],
      "public_persona": "Reliable, hardworking manager",
      "private_secret": "Resentful of aristocratic family’s treatment of staff",
      "motive_seed": "Silent grudge and desire for reform",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been in the stables from eleven to one pm",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to garden gate and grounds",
        "Familiarity with gate mechanisms"
      ],
      "behavioral_tells": [
        "Avoids eye contact during questioning",
        "Seldom socializes with family or guests"
      ],
      "stakes": "Job security, social justice",
      "evidence_sensitivity": [
        "Stable records",
        "Gate latch knowledge"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Vivian Clarke",
      "age_range": "25-35",
      "role_archetype": "Maid",
      "relationships": [
        "Close to servants’ hall group",
        "Admires Lady Beatrice"
      ],
      "public_persona": "Dutiful, quiet servant",
      "private_secret": "Witnessed suspicious meeting in stables",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "Serving dinner from six to eight pm",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to servants’ hall and stables",
        "Movement around manor grounds"
      ],
      "behavioral_tells": [
        "Hesitates when questioned about midday activities",
        "Corrects own timeline inconsistencies"
      ],
      "stakes": "Employment, loyalty",
      "evidence_sensitivity": [
        "Servants’ hall testimony",
        "Footprint observations"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "James Porter",
      "age_range": "30-40",
      "role_archetype": "Butler",
      "relationships": [
        "Manages household staff",
        "Loyal servant to Wentworth family"
      ],
      "public_persona": "Efficient, composed butler",
      "private_secret": "Knowledge of gate latch’s brass thermal properties",
      "motive_seed": "Protecting family reputation",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been in kitchen from noon to two pm",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all manor areas including garden gate",
        "Technical knowledge of estate mechanisms"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Avoids direct answers about gate’s latch timing"
      ],
      "stakes": "Family’s honor, personal loyalty",
      "evidence_sensitivity": [
        "Gate latch mechanism",
        "Kitchen and garden access"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "James Porter"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "At Wentworth Manor, Lady Beatrice Wentworth is found dead, struck by a heavy brass garden gate bolt. Witnesses unanimously claim to have seen her enter the garden grounds at noon, but physical evidence and mechanical timing contradict this. Inspector Evelyn Harcourt uncovers a deception embedded in the thermal expansion delay of the garden gate’s brass latch, exposing a false timeline created by manipulated memories and overlooked physical laws. Through careful reconstruction and social scrutiny, the truth emerges: the butler, James Porter, exploited the garden gate’s delayed bolt release to commit murder, hiding the true time of death and misdirecting suspicion."
    },
    "accepted_facts": [
      "Lady Beatrice was last seen entering the garden grounds near the sundial at noon according to witnesses",
      "The garden gate’s bolt latch is made of brass and subject to thermal expansion",
      "A garden thermometer recorded 78 degrees Fahrenheit when the gate was last closed",
      "The brass latch shows thermal stress lines and soot discoloration consistent with recent heating",
      "Multiple servants recall the victim in the servants’ hall at early evening",
      "Footprints in fresh mud near the stables contradict the servants’ timeline",
      "James Porter had technical knowledge of the gate latch’s properties",
      "Lady Beatrice’s body was struck with the detached garden gate bolt"
    ],
    "inferred_conclusions": [
      "The garden gate bolt could not have been released before forty-five minutes past one due to thermal expansion",
      "The victim was killed after the gate bolt release, contradicting the noon entry testimony",
      "Servants’ memories formed a false consensus aligning with a fabricated timeline",
      "James Porter’s opportunity and knowledge uniquely enabled him to exploit the gate’s mechanical delay",
      "The true time of death was in early afternoon, not noon nor early evening"
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The garden gate’s brass bolt latch delays the gate release until the afternoon heat causes sufficient thermal expansion. Witnesses falsely assume the gate opened at noon because they saw the victim near the gate around that time, but the bolt physically could not unlatch until after 1:45 pm. James Porter, knowing this mechanism, exploited the delay to stage the entry time and conceal the murder’s true timing, tricking the servants into forming a false collective memory about the victim’s last whereabouts, thus hiding his culpability.",
      "delivery_path": [
        {
          "step": "James Porter studies the thermal properties of the brass latch and the garden thermometer readings."
        },
        {
          "step": "He manipulates the garden gate to release the bolt latch only after the temperature peaks post-1:45 pm."
        },
        {
          "step": "He kills Lady Beatrice using the heavy detached brass bolt shortly after the latch releases."
        },
        {
          "step": "Servants’ repeated discussions and social interactions create a false consensus timeline placing the victim in the servants’ hall at early evening."
        },
        {
          "step": "Inspector Harcourt uncovers the thermal expansion delay and the cognitive bias in servant testimony to reconstruct the true timeline."
        }
      ]
    },
    "outcome": {
      "result": "The physical impossibility of the gate opening at noon disproves all alibis relying on that timeline. Only James Porter had the knowledge and access to exploit this mechanical delay, revealing him as the murderer."
    }
  },
  "false_assumption": {
    "statement": "The garden gate was opened at noon as all household members and guests saw Lady Beatrice entering the grounds then.",
    "type": "temporal",
    "why_it_seems_reasonable": "Multiple independent witnesses, including servants and family, reported seeing the victim near the garden gate at midday, aligning with normal daily schedules and no apparent motive to lie.",
    "what_it_hides": "It conceals the physical fact that the brass latch bolt could not unlatch before 1:45 pm due to thermal expansion, making the noon entry impossible and masking the true time of death."
  },
  "false_solution": {
    "accused_suspect": "Charles Wentworth",
    "supporting_points": [
      "Charles had a strong motive due to financial desperation and rivalry with Robert Hensley.",
      "His alibi of being in the study from noon to two pm is shaky and uncorroborated."
    ],
    "the_one_flaw": "The physical evidence of the garden gate’s bolt thermal delay proves entry at noon could not happen, making Charles’s timeline impossible.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Margot Sinclair’s nervousness and evasive answers about her whereabouts at midday suggest guilt.",
      "points_at_suspect": "Margot Sinclair",
      "innocent_explanation": "Margot was anxious due to fear of blackmail exposure unrelated to the murder and had no access to the garden gate mechanism.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Fresh muddy footprints near the stable door imply the victim was there recently, contradicting some testimonies.",
      "points_at_suspect": "Robert Hensley",
      "innocent_explanation": "Robert had watered the yard early that morning, and the footprints are older than they appear due to soil moisture and evaporation patterns.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Charles Wentworth",
      "Margot Sinclair",
      "Robert Hensley",
      "James Porter",
      "Vivian Clarke",
      "Inspector Evelyn Harcourt"
    ],
    "rationale": "The isolated manor estate with limited access and strict schedules ensures no outsider could have entered or committed the murder unnoticed."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Witnesses see Lady Beatrice near garden gate at noon",
        "Garden thermometer reads 78°F at last gate closure",
        "Thermal expansion of brass latch begins releasing bolt at 1:45 pm"
      ],
      "windows": [
        "Gate cannot open before 1:45 pm without forced entry",
        "Servants’ hall presence claimed at early evening"
      ],
      "contradictions": [
        "Witnesses assert gate opened at noon but latch physical properties forbid it",
        "Servants’ timeline conflicts with fresh mud footprints near stables"
      ]
    },
    "access": {
      "actors": [
        "James Porter",
        "Charles Wentworth",
        "Robert Hensley",
        "Margot Sinclair",
        "Vivian Clarke"
      ],
      "objects": [
        "Garden gate with brass bolt latch",
        "Garden thermometer",
        "Heavy detached brass bolt"
      ],
      "permissions": [
        "Only estate staff and family have unrestricted access to garden gate",
        "James Porter uniquely understands latch’s thermal behavior"
      ]
    },
    "physical": {
      "laws": [
        "Thermal expansion of brass delay bolt release until afternoon heat peak",
        "Soil moisture evaporation rate affects footprint freshness",
        "Brass latch shows thermal stress lines and soot discoloration indicating heating"
      ],
      "traces": [
        "Soot discoloration on latch",
        "Footprints in mud near stables",
        "Polished brass showing wear consistent with latch operation"
      ]
    },
    "social": {
      "trust_channels": [
        "Household servants’ shared memory",
        "Family and guest eyewitness testimony"
      ],
      "authority_sources": [
        "Inspector Harcourt’s investigative authority",
        "James Porter’s role as butler and gate mechanism custodian"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The brass latch bolt on the garden gate shows thermal stress lines and soot discoloration consistent with recent heating.",
        "correction": "The latch must have been heated to a temperature sufficient to cause thermal expansion, indicating the bolt could not have released before the afternoon heat peak.",
        "effect": "Narrows the possible gate opening time to after 1:45 pm, eliminating the noon entry claim.",
        "required_evidence": [
          "Physical examination of garden gate brass latch bolt",
          "Garden thermometer reading 78 degrees Fahrenheit at last closure",
          "Witness statements claiming gate opened at noon",
          "Thermal expansion physical law for brass"
        ],
        "reader_observable": true
      },
      {
        "observation": "Multiple household servants independently recall seeing Lady Beatrice in the servants’ hall at early evening but exhibit minor inconsistencies and hesitations when recounting details.",
        "correction": "Servants’ memories have formed a false consensus due to social reinforcement, masking the victim’s actual earlier death time.",
        "effect": "Eliminates the early evening timeline, indicating a cognitive bias in testimony.",
        "required_evidence": [
          "Servants’ hall eyewitness accounts",
          "Victim’s diary entry about a secret midday meeting at stables",
          "Fresh mud footprints near stables inconsistent with early evening presence",
          "Servants’ corrections and hesitations during questioning"
        ],
        "reader_observable": true
      },
      {
        "observation": "James Porter possesses unique technical knowledge of the garden gate’s brass latch thermal behavior and was seen near the gate at early afternoon.",
        "correction": "Only James Porter had the means and opportunity to exploit the latch’s delayed release to stage the murder timeline.",
        "effect": "Narrows the suspect pool to James Porter.",
        "required_evidence": [
          "James Porter’s testimony and role as butler",
          "Known technical knowledge of gate latch mechanism",
          "Witness accounts placing Porter near garden gate",
          "Physical evidence of latch mechanism requiring expertise"
        ],
        "reader_observable": true
      },
      {
        "observation": "The victim’s body was struck with the heavy detached brass bolt from the garden gate.",
        "correction": "The murder weapon is directly linked to the garden gate mechanism, confirming the murder occurred after the bolt was released post-1:45 pm.",
        "effect": "Confirms that the time of death cannot be earlier than the latch release, eliminating all earlier timelines.",
        "required_evidence": [
          "Victim’s wound characteristics",
          "Detached heavy brass garden gate bolt as weapon",
          "Thermal expansion delay evidence",
          "Witness time claims for victim’s presence"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "constraint_proof",
    "design": "Demonstrate by controlled temperature simulation and gate latch observation that the garden gate’s bolt cannot be released before 1:45 pm, contradicting witness statements. Then cross-reference servants’ timeline inconsistencies and James Porter’s exclusive latch knowledge to prove only he could have exploited this delay to commit the murder.",
    "knowledge_revealed": "The physical impossibility of the gate’s noon opening combined with cognitive bias in servant testimony and James Porter’s unique access definitively proves his guilt.",
    "pass_condition": "The gate latch remains locked at temperatures below threshold despite attempts to open, invalidating the noon entry claim and exposing the false timeline.",
    "evidence_clues": [
      "clue_12",
      "clue_13",
      "clue_5"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Physical evidence of the garden gate’s brass latch thermal stress and thermometer readings (early) establish the gate’s opening time window. Step 2: Servants’ inconsistent testimonies about the victim’s whereabouts (mid) reveal cognitive bias and false memory. Step 3: James Porter’s unique technical knowledge and proximity to the gate (mid) narrow the suspect pool. Step 4: The victim’s wound and use of the detached brass bolt (late) confirm timing and weapon. The discriminating test synthesizes these clues to prove the physical impossibility of the assumed timeline, enabling the reader to deduce the culprit fairly."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 4,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 5,
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
        "Execute the gate latch temperature simulation to prove time constraint",
        "Discuss servants’ memory inconsistencies and timeline contradictions",
        "Highlight James Porter’s unique knowledge and proximity",
        "Conclude with logical elimination of all suspects except Porter"
      ],
      "test_type": "constraint_proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Charles Wentworth",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Verified study alibi with servant testimony and lack of physical evidence",
        "supporting_clues": [
          "Witness statement of Charles in study",
          "No physical evidence linking Charles to garden gate"
        ]
      },
      {
        "suspect_name": "Margot Sinclair",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Explanation of nervousness as unrelated blackmail fear, no access to gate mechanism",
        "supporting_clues": [
          "Margot’s testimony",
          "Lack of opportunity for gate manipulation"
        ]
      },
      {
        "suspect_name": "Robert Hensley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Stable footprint explanation and alibi verification",
        "supporting_clues": [
          "Stable hand note on watering",
          "Mud drying pattern evidence"
        ]
      },
      {
        "suspect_name": "Vivian Clarke",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed serving dinner alibi and lack of motive or access",
        "supporting_clues": [
          "Dinner serving schedule",
          "No technical knowledge"
        ]
      },
      {
        "suspect_name": "Lady Beatrice Wentworth",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A (deceased)",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with physical evidence of thermal delay, servants’ false memories, and James Porter’s unique expertise"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_11",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_13",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_16",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_17",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_18",
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_james_porter",
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
    "name": "Inspector Evelyn Harcourt",
    "summary": "A seasoned Scotland Yard detective whose sharp intuition and unyielding integrity guide her through the tangled social intrigues of Wentworth Manor.",
    "publicPersona": "Inspector Harcourt is known throughout the force as a methodical and respected detective, unflappable in the face of pressure and unrelenting in her pursuit of truth. She commands respect with a quiet authority and an analytical mind honed by years of experience.",
    "privateSecret": "Despite her reputation for certainty, Evelyn wrestles privately with the pressure from her superiors to close the case swiftly, even as she harbors doubts about the superficial evidence presented. This conflict gnaws at her, threatening the integrity she prizes.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "impossible",
    "stakes": "Her professional reputation and personal ethics are on the line amid a politically charged investigation that could define or derail her career.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Evelyn speaks with measured precision, her tone crisp yet unpretentious. She often punctuates observations with a subtle dry wit, revealing a mind that sees beneath the surface but refrains from unnecessary levity. Her sentences are economical, occasionally interrupted by thoughtful pauses as she weighs her words carefully.",
    "signatureTic": "\"Let’s not jump to conclusions just yet.\"",
    "internalConflict": "Evelyn grapples with the tension between her duty to solve the case expediently and her instinctive distrust of the easy answers favored by her superiors. This moral quandary strains her resolve, as she fears that yielding to external pressures may betray the truth and her own principles.",
    "personalStakeInCase": "This investigation strikes close to home as it unfolds within the rarefied world she respects but also mistrusts. The balance between upholding justice and navigating the subtle codes of the aristocracy tests her convictions, making the case a crucible for her career and conscience.",
    "paragraphs": [
      "Inspector Evelyn Harcourt arrived at Wentworth Manor with the quiet confidence borne of decades on the force. Her reputation as a detective who could unravel even the most convoluted mysteries preceded her, and the manor’s inhabitants quickly learned that she was a woman not to be trifled with. Beneath her composed exterior, Evelyn’s mind worked tirelessly, piecing together fragments of evidence with meticulous care.",
      "Though outwardly unshaken, Evelyn harbored a private unease. Her superiors, eager for a swift resolution, pressed her to accept the apparent facts, but she sensed deeper currents beneath the surface. The pressure to conform to political expectations clashed with her own scruples, and the inspector found herself walking a tightrope between authority and integrity.",
      "Her speech was a study in restraint, each word chosen with care and delivered in a tone that blended formality with a hint of dry humour. She had little patience for frivolity but wielded wit as a scalpel, dissecting statements and exposing contradictions with a deftness that unsettled suspects and witnesses alike.",
      "Evelyn’s internal struggle was palpable; the fear that acquiescing to external demands might compromise the truth weighed heavily on her. Yet, her commitment to justice was unwavering, and she knew that the outcome of this investigation would reverberate far beyond the manor’s walls. The case was not merely a professional challenge but a test of her very character."
    ],
    "order": 1
  },
  {
    "name": "Lady Beatrice Wentworth",
    "summary": "The formidable matriarch of Wentworth Manor whose death ignites a storm of secrets and resentments among her family and staff.",
    "publicPersona": "Lady Beatrice is the embodiment of aristocratic dignity, known for her strict adherence to etiquette and unwavering commitment to tradition. Her commanding presence and sharp mind earned her respect and a measure of fear within the estate.",
    "privateSecret": "Behind closed doors, she was orchestrating a plan to disinherit her nephew Charles, intending to expose his financial misdeeds and protect the family legacy from ruin.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A (deceased)",
    "accessPlausibility": "impossible",
    "stakes": "Her death threatens to unravel the carefully maintained family legacy and bring to light dark secrets long buried beneath the manor’s polished veneer.",
    "humourStyle": "understatement",
    "humourLevel": 0.1,
    "speechMannerisms": "Lady Beatrice’s manner of speaking is formal and measured, imbued with the gravitas befitting her station. She rarely indulges in levity, and when she does, it is with a dry understatement that underscores her authority. Her voice carries the cadence of old-world discipline, punctuated by precise enunciation and a cool reserve.",
    "signatureTic": "\"One must always maintain decorum.\"",
    "internalConflict": "Though outwardly resolute, Lady Beatrice privately wrestled with the loneliness of her position and the burden of safeguarding a family legacy fraught with internal strife. Her determination to uphold tradition often isolated her, sowing seeds of resentment among those closest to her.",
    "personalStakeInCase": "As the victim, her death is the catalyst for the unfolding drama, her hidden plans and stern judgments casting long shadows over those left behind. The preservation of her vision for Wentworth Manor hangs in the balance.",
    "paragraphs": [
      "Lady Beatrice Wentworth was the very image of aristocratic authority, her presence commanding attention in every room she entered. To the world, she was the steadfast guardian of the Wentworth estate, a woman whose word was law and whose traditions were sacrosanct. Her strict etiquette and unwavering standards earned her the respect of family and staff alike, though few dared to cross her.",
      "Yet beneath her formidable exterior lay a woman burdened by the weight of secrets. She had uncovered her nephew’s embezzlement and was quietly preparing to strip him of his inheritance, a move that would have shattered his ambitions and exposed the family’s fractures. This private crusade consumed her thoughts, even as she maintained her poised facade.",
      "Her speech reflected her nature: formal, deliberate, and laced with a dry, understated humour that surfaced only in rare moments. She wielded language as a tool of control, each word chosen to reinforce her authority and maintain the delicate social order she so fiercely protected.",
      "Though she projected strength, Lady Beatrice’s internal world was one of isolation and vigilance. The very traditions she upheld left her estranged from those she sought to protect, and her impending death would unleash the suppressed tensions that simmered beneath the manor’s polished surface."
    ],
    "order": 2
  },
  {
    "name": "Charles Wentworth",
    "summary": "The charming yet restless heir apparent whose ambition and desperation to conceal his fraud make him the prime suspect.",
    "publicPersona": "Charles presents himself as a modernizer eager to breathe new life into the estate, his charm and confidence masking a restless and calculating nature.",
    "privateSecret": "He has been embezzling funds from the estate and stands to inherit everything, but Lady Beatrice’s plans to disinherit him and expose his crimes threaten to ruin him, giving him a compelling motive for murder.",
    "motiveSeed": "Murder to prevent exposure and secure inheritance.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed presence in the stables from 7:30 PM to 9:00 PM, uncorroborated by witnesses.",
    "accessPlausibility": "easy",
    "stakes": "His inheritance, social standing, and freedom from prosecution are all at risk, making the stakes deeply personal.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Charles speaks with a smooth confidence, often deploying sardonic remarks that thinly veil his impatience and ambition. His tone can shift from playful banter to sharp retorts, reflecting a restless energy and a penchant for deflecting probing questions with wit.",
    "signatureTic": "\"Well, if that isn’t the twist of the evening.\"",
    "internalConflict": "Beneath his suave exterior, Charles is tormented by the fear of exposure and the desperation to maintain his facade. He struggles to reconcile his desire for respectability with the reckless choices that imperil his future.",
    "personalStakeInCase": "The case is a matter of survival for Charles; the outcome will determine whether he ascends to power or falls into disgrace and ruin.",
    "paragraphs": [
      "Charles Wentworth carries himself with the ease of a man accustomed to privilege, his charm a carefully honed weapon in the social battles of the manor. He speaks with a sardonic edge that betrays his impatience with the old guard and a restless ambition that pushes him toward modernizing the estate — but at a cost.",
      "His private life is a tangled web of deceit; embezzlement of estate funds has become his desperate means to maintain appearances and finance his plans. The looming threat of Lady Beatrice’s disinheritance and exposure drives him to extremes, casting a shadow over his polished demeanor.",
      "When questioned, Charles’s speech dances between wry humour and sharp deflections, a tactic to keep others off balance. His sardonic quips often punctuate tense moments, serving as both shield and sword in the social arena.",
      "Internally, he wrestles with the growing chasm between his ambitions and the moral compromises they demand. The stakes are nothing less than his inheritance and freedom, and as suspicion mounts, so too does his desperation."
    ],
    "order": 3
  },
  {
    "name": "Margot Sinclair",
    "summary": "The devoted lady’s companion whose concealed passions and resentments entangle her deeply in the manor’s dark secrets.",
    "publicPersona": "Margot is seen as the epitome of discretion and poise, a loyal companion who navigates the intricate social codes with grace and subtlety.",
    "privateSecret": "She harbors a secret love for Charles and resents Lady Beatrice’s control, fearing exposure of a past scandal tied to the family, giving her a strong motive to want Lady Beatrice removed.",
    "motiveSeed": "Desire to free herself and Charles from oppressive control and conceal her own scandal.",
    "motiveStrength": "strong",
    "alibiWindow": "Alone in the garden around the estimated time of death, with no witnesses to confirm.",
    "accessPlausibility": "easy",
    "stakes": "Margot’s love, social freedom, and escape from a tarnished past are all on the line, making her deeply invested in the outcome.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Margot’s speech is elegant and measured, her words often laced with polite savagery — subtle barbs delivered with a smile that never quite reaches her eyes. She employs a refined vocabulary, speaking with a deliberate grace that conceals sharp intelligence and simmering resentment.",
    "signatureTic": "\"How utterly predictable.\"",
    "internalConflict": "Margot is torn between her loyalty to Lady Beatrice and her forbidden love for Charles, compounded by the fear that her own shadowed past could be exposed, forcing her into a moral and emotional tightrope walk.",
    "personalStakeInCase": "The resolution of the case will determine whether she can break free from the constraints imposed upon her and claim a future aligned with her desires rather than her past.",
    "paragraphs": [
      "Margot Sinclair moves through the halls of Wentworth Manor with the grace of one born to servitude yet yearning for more. Her role as Lady Beatrice’s companion masks a tempest of emotions — a secret love for Charles and a simmering resentment of the matriarch’s iron grip over their lives.",
      "Her presence in the garden alone at the time of the murder offers no alibi, and her poised exterior belies the turmoil beneath. Margot’s past, shadowed by scandal linked to the family, haunts her, making the stakes of the investigation intensely personal.",
      "Her speech is a study in contrasts: polished and genteel, yet peppered with subtle, cutting remarks that reveal a mind quick to judge and slow to forgive. She wields polite savagery as a social weapon, disarming and unsettling those who cross her path.",
      "Caught between love and loyalty, Margot’s internal conflict fuels her actions. The case is her crucible, holding the promise of liberation or the threat of ruin, depending on which truths come to light."
    ],
    "order": 4
  },
  {
    "name": "Robert Hensley",
    "summary": "The estate manager whose loyal facade conceals a bitter grudge and secret complicity in the estate’s darker dealings.",
    "publicPersona": "Robert is respected by the staff for his efficiency and loyalty, a steady hand in the daily workings of Wentworth Manor, though his demeanor carries a hint of subdued bitterness.",
    "privateSecret": "He harbors resentment for Lady Beatrice’s dismissal of his father and secretly supports Charles financially, positioning himself as a player in the estate’s power struggles.",
    "motiveSeed": "Views Lady Beatrice as an obstacle to change and his own social advancement, making her removal advantageous.",
    "motiveStrength": "moderate",
    "alibiWindow": "Oversaw staff in the kitchen wing with several servants confirming his presence until 8:45 PM.",
    "accessPlausibility": "possible",
    "stakes": "His hopes for vindication, social mobility, and financial gain hinge on the outcome, entangling him in the manor’s shifting loyalties.",
    "humourStyle": "deadpan",
    "humourLevel": 0.2,
    "speechMannerisms": "Robert’s speech is blunt and unembellished, delivered in a flat, deadpan tone that rarely betrays emotion. He uses short sentences and minimal inflection, giving the impression of a man who prefers facts over flourishes, often employing dry, understated humour when he does speak.",
    "signatureTic": "\"That’s how it stands.\"",
    "internalConflict": "Robert struggles with his loyalty to the estate and his simmering resentment towards the aristocracy, caught between duty and ambition in a world that offers limited avenues for advancement.",
    "personalStakeInCase": "His involvement in the estate’s affairs and personal grudges make the case a pivotal moment; the outcome could elevate or destroy his standing within the manor’s hierarchy.",
    "paragraphs": [
      "Robert Hensley carries out his duties with a quiet efficiency, managing the estate’s affairs with a steady hand that commands respect from the staff. Yet beneath his professional exterior lies a man nursing old wounds — the unjust dismissal of his father by Lady Beatrice left scars that have never fully healed.",
      "His loyalty to Charles Wentworth goes beyond mere duty; Robert provides financial support to the nephew, seeing in him a vehicle for change and a chance to climb the social ladder himself. This clandestine alliance entangles him in the estate’s darker machinations.",
      "Robert’s manner of speaking is unadorned and deadpan, his words often curt and delivered without inflection. When humour surfaces, it is dry and understated, hinting at a cynicism born of years navigating the rigid class structures of the manor.",
      "Internally, Robert is torn between a sense of obligation and a desire for personal advancement. The case forces him to confront these conflicting loyalties, with his future hanging precariously in the balance."
    ],
    "order": 5
  },
  {
    "name": "Vivian Clarke",
    "summary": "A glamorous journalist whose ambition and blackmail scheme entangle her in the deadly intrigues of Wentworth Manor.",
    "publicPersona": "Vivian is an outspoken socialite and family friend, often viewed as an outsider striving to penetrate the elite circles with charm and relentless ambition.",
    "privateSecret": "She has been blackmailing Lady Beatrice over a past indiscretion to gain access to the estate’s secrets, fearing exposure that would ruin her social aspirations.",
    "motiveSeed": "Murder to protect her blackmail scheme and secure her position in high society.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be writing alone in the library, with no witnesses to confirm.",
    "accessPlausibility": "possible",
    "stakes": "Her entry into elite society and protection from scandal depend on the case’s outcome, making her deeply invested.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Vivian speaks with a directness that borders on brusqueness, her tone often clipped and businesslike. She wastes little time on pleasantries, preferring to get straight to the point, and her humour is blunt, occasionally biting, revealing a sharp mind unafraid to challenge others.",
    "signatureTic": "\"Let’s cut to the chase.\"",
    "internalConflict": "Vivian wrestles with the fear that her carefully constructed facade will crumble, exposing her vulnerabilities and destroying the social ambitions she has fought so hard to achieve.",
    "personalStakeInCase": "The investigation threatens to unravel her schemes and derail her ascent into high society, making it a matter of personal survival.",
    "paragraphs": [
      "Vivian Clarke moves through the manor’s social labyrinth with the confidence of one who knows the value of information and the power of secrets. As a journalist and family friend, she is both insider and outsider, her glamorous exterior masking a calculating mind.",
      "Her blackmail of Lady Beatrice over a long-buried indiscretion has granted her access to the estate’s inner workings, but the threat of exposure looms large. Vivian’s fear of scandal drives her to desperation, making her a suspect with a clear motive.",
      "Her speech is forthright and blunt, eschewing niceties for efficiency. When she employs humour, it is sharp and unvarnished, often catching others off guard with its candour.",
      "The stakes for Vivian are immense; the case represents not only a professional challenge but a personal battle to maintain control over her narrative and secure her place among the elite."
    ],
    "order": 6
  },
  {
    "name": "James Porter",
    "summary": "The dependable gardener whose quiet demeanor conceals a painful secret and a desperate motive.",
    "publicPersona": "James is known as a quiet and reliable presence in the gardens of Wentworth Manor, respected for his dedication and discretion.",
    "privateSecret": "He once had a secret affair with Lady Beatrice, resulting in a child given up for adoption. He fears the scandal’s exposure and believes Lady Beatrice might reveal the truth, motivating him to silence her.",
    "motiveSeed": "Protecting his hidden family and reputation by preventing Lady Beatrice from exposing their past.",
    "motiveStrength": "moderate",
    "alibiWindow": "Seen in the greenhouse until 8:30 PM, after which he left unobserved.",
    "accessPlausibility": "possible",
    "stakes": "His secret family and personal reputation hang in the balance, making the case deeply personal and fraught with risk.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "James speaks in a modest, unassuming manner, often downplaying his own importance with a self-deprecating tone. His speech is slow and deliberate, peppered with pauses and a soft-spoken humility that contrasts with the gravity of his secret.",
    "signatureTic": "\"I’m just a simple man, after all.\"",
    "internalConflict": "James is torn between loyalty to Lady Beatrice and the fear that the past he tried to bury will destroy everything he holds dear. His desperation to protect his secret child weighs heavily on him.",
    "personalStakeInCase": "The investigation threatens to expose his hidden past and shatter the quiet life he has fought to maintain, making the outcome a matter of survival for him and his family.",
    "paragraphs": [
      "James Porter tends the gardens of Wentworth Manor with a quiet devotion, his presence as steady and unobtrusive as the plants he nurtures. Known for his discretion, he is a figure few pay much attention to, yet beneath his humble exterior lies a man burdened by a secret that could upend the estate’s fragile equilibrium.",
      "Years ago, a clandestine affair with Lady Beatrice resulted in a child whom James reluctantly gave up for adoption. The fear that this secret might come to light — and the potential ruin it would bring — haunts him, coloring his every action with a shadow of anxiety.",
      "His speech is modest and self-effacing, marked by a gentle cadence and a habit of downplaying his significance. His humour, when it surfaces, is tinged with self-deprecation, a shield against the weight of his fears.",
      "Caught between loyalty and desperation, James’s internal conflict reaches a crescendo as the investigation threatens to unearth the past he has long sought to conceal. The stakes are nothing less than the safety and future of his hidden family."
    ],
    "order": 7
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Wentworth Manor",
    "type": "Country house estate (Manor house)",
    "place": "Little Ashcombe",
    "country": "England",
    "summary": "Wentworth Manor is a sprawling, isolated estate nestled miles from the nearest village, surrounded by dense woods and expansive gardens. Its multiple wings house family, guests, and servants, with strict access controls preserving privacy and social order.",
    "visualDescription": "A grand brick-and-stone manor with steep slate roofs and tall chimneys, the house’s wings fan out irregularly around a gravel forecourt. Ivy climbs weathered stone walls, and leaded glass windows glint faintly in the autumn gloom. The formal gardens feature clipped yew hedges and a central sundial, while dense woods and a small lake border the estate’s edges.",
    "atmosphere": "The manor exudes old-world solidity, its glowing hearths and polished wood contrasting with the chill outdoors. Fog frequently drifts through the grounds, muting colors and sound, lending an air of quiet suspense to daily routines. Social formality and economic caution weigh heavily beneath the genteel surface.",
    "paragraphs": [
      "Wentworth Manor sits secluded in the quiet English countryside near Little Ashcombe, its architecture a layered testament to centuries of family legacy. The main house’s rough-hewn stone and brickwork rise under slate roofs, punctuated by tall chimneys that exhale thin smoke into the damp air. Ivy tendrils cling to the walls, their dark green leaves glistening with moisture. The grounds are extensive, with formal gardens laid out in geometric patterns around the centerpiece sundial, and beyond them, thick woods and a small lake that isolate the estate further from the outside world.",
      "Inside, the manor is a study in contrasts between warmth and chill. Heavy oak paneling and Persian rugs absorb the flickering firelight from grand hearths, while the distant ticking of grandfather clocks marks measured time. The family wing contains richly upholstered furniture and delicate porcelain, accessible only to residents and select guests. Servants move quietly through their designated quarters and corridors, their footsteps muffled on threadbare carpets. The pervasive scent of polished wood, beeswax, and pipe tobacco mingles with the occasional sharp tang of coal smoke.",
      "Communication within the manor relies on the era’s technology — a radio receiver hums softly in the drawing room, while a rotary telephone on a carved side table connects via a party-line, limiting privacy. Correspondence is typed on manual typewriters in the study, where letters and telegrams arrive sporadically from the nearby village, connected by unreliable roads. Economic caution is evident in the modest use of petrol for automobiles, which sit idle in the stable yard when not needed for necessary travel.",
      "Despite the outward comfort, an undercurrent of tension threads through the estate. The Great Depression’s shadow is felt in the careful budgeting and social frictions between family, guests, and servants. The pervasive fog and autumn chill accentuate the manor’s isolation, as secrets seem to linger in the corners of shadowed rooms and beneath the garden’s cold stone sundial."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Chilly and damp typical of an English autumn, with intermittent fog reducing visibility outdoors",
    "timeFlow": "Three days of mounting tension culminating in revelation",
    "mood": "Cozy yet tense, with the comfort of hearth fires and familiar routines contrasting against underlying social anxieties and external political unrest",
    "eraMarkers": [
      "Radio receivers common in main living rooms",
      "Domestic telephones connected via party-line exchanges",
      "Manual typewriters standard for correspondence and record-keeping",
      "Reliable petrol-powered automobiles for estate and local travel",
      "Passenger trains serve nearest town; schedules impact communication speed",
      "Telephone communication limited by party-line privacy concerns",
      "Telegrams routed through nearest village office"
    ],
    "sensoryPalette": {
      "dominant": "smoky hearth-fire and damp earth",
      "secondary": [
        "clipped yew hedges and cold stone",
        "rustling autumn leaves and distant church bells"
      ]
    },
    "paragraphs": [
      "The estate’s pervasive dampness saturates every surface, blending the scent of wet earth with the acrid smoke of coal fires burning low in their hearths. Fog coils among the clipped hedges and over the sundial, softening edges and muting footsteps on gravel paths. Inside, the low murmur of radio voices and the creak of settling wood create a cocoon of sound around the manor’s occupants, while the faint aroma of pipe tobacco and beeswax polish mark the passage of daily ritual.",
      "Outside, the brittle rustle of autumn leaves is punctuated by distant church bells tolling the hour, their sound swallowed quickly by the heavy air. The chill presses in through leaded windows, encouraging retreat to warm interiors where polished wood and glowing fires offer comfort. Yet beneath this surface lies a taut atmosphere, as the estate’s social hierarchies and economic worries intertwine with the mystery that shadows the sundial’s cold stone face."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Garden Sundial",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A circular stone sundial stands at the garden's geometric center, surrounded by clipped yew hedges and gravel paths dampened by recent rain. Moss clings to its pedestal, and the engraved hour lines are worn but visible. Nearby, fallen leaves scatter over wrought iron benches and a small stone birdbath.",
      "sensoryDetails": {
        "sights": [
          "glossy wet yew leaves",
          "moss-covered sundial pedestal",
          "rain-darkened gravel paths",
          "scattered brown autumn leaves",
          "faint morning fog drifting"
        ],
        "sounds": [
          "soft rustling of dry leaves",
          "distant church bells tolling",
          "occasional drip from wet branches",
          "far-off owl hooting",
          "whispering breeze through hedges"
        ],
        "smells": [
          "damp earth and decaying leaves",
          "cold stone and moist moss",
          "faint scent of wet wood smoke",
          "crisp autumn air with pine hints",
          "slight tang of cold metal"
        ],
        "tactile": [
          "rough cold stone surface",
          "slick moss patches under fingertips",
          "chill damp gravel underfoot",
          "crisp brittle leaf edges",
          "cool metal of wrought iron bench"
        ]
      },
      "accessControl": "Garden locked after dusk; family and trusted staff allowed daytime access; guests restricted to main paths; servants clear leaves early morning",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked sundial surface",
            "glimmering wet leaves",
            "fog-laden garden beds",
            "pools on gravel paths"
          ],
          "sounds": [
            "steady rain pattering",
            "water dripping from branches",
            "muffled footsteps on wet gravel"
          ],
          "smells": [
            "wet earth and stone",
            "fresh rain on leaves",
            "damp moss and wood"
          ],
          "mood": "oppressive and secretive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light on stone",
            "shadows softened by fog",
            "dampened colors in garden"
          ],
          "sounds": [
            "soft breeze through hedges",
            "distant church bell toll",
            "rustling dry leaves"
          ],
          "smells": [
            "earth and decaying foliage",
            "cold stone and moss",
            "smoky wood fire faint"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "long shadows from sundial",
            "moonlight on wet leaves",
            "glint of dew on grass"
          ],
          "sounds": [
            "night insects chirping",
            "distant owl calls",
            "soft rustle of breeze"
          ],
          "smells": [
            "cool night air",
            "fresh pine and earth",
            "faint smoke from hearths"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The garden sundial forms the estate’s serene yet somber heart, its cold stone surface mottled with moss and weathered by decades of autumn rains. Surrounded by meticulously clipped yew hedges and soft beds of damp earth, the sundial’s presence commands quiet reflection amid the rustling leaves and distant church bells.",
        "Beneath the shifting fog and intermittent rain, the sundial’s worn hour lines catch faint glimmers of light, while the gravel paths around it retain the imprint of recent footsteps. The chill dampness clings to the stone and iron benches nearby, lending a tactile sharpness to the garden’s stillness. Here, secrets seem etched as deeply as the sundial’s markings, waiting for the right moment to reveal themselves."
      ]
    },
    {
      "id": "library",
      "name": "Wentworth Manor Library",
      "type": "interior",
      "purpose": "Clue discovery and private study",
      "visualDetails": "A rectangular room lined with tall oak bookshelves filled with leather-bound volumes, the library features a large stained-glass window casting muted colored light. A heavy mahogany desk, green-shaded banker’s lamp, and leather armchairs cluster near a stone fireplace with a low-burning coal fire.",
      "sensoryDetails": {
        "sights": [
          "rows of worn leather spines",
          "stained-glass window hues",
          "flickering coal firelight",
          "polished oak desk surface",
          "stacked papers and ink bottles"
        ],
        "sounds": [
          "crackling low coal fire",
          "soft page turning",
          "occasional scratching of pen",
          "distant ticking of clock",
          "muffled footsteps on carpet"
        ],
        "smells": [
          "aged paper and leather",
          "wax polish on wood",
          "smoky coal embers",
          "faint ink and dust",
          "subtle cedarwood scent"
        ],
        "tactile": [
          "smooth polished wood edges",
          "soft leather armchair cushions",
          "cool glass ink bottle",
          "rough-textured paper pages",
          "warm hearthstone surface"
        ]
      },
      "accessControl": "Family and select guests have daytime access; locked after dinner; staff permitted for cleaning before dawn; study materials restricted to family",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering stained glass",
            "rain-spattered windowpanes",
            "shadows shifting by firelight"
          ],
          "sounds": [
            "steady rain tapping window",
            "soft turning of pages",
            "pen scratching on paper"
          ],
          "smells": [
            "wet stone and leather",
            "damp wood polish",
            "fresh ink on paper"
          ],
          "mood": "quiet focus"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "muted light on book spines",
            "glow from green lamp shade",
            "shadows pooling in corners"
          ],
          "sounds": [
            "clock ticking steadily",
            "rustle of pages",
            "fire crackling softly"
          ],
          "smells": [
            "old paper and beeswax",
            "smoky embers",
            "wood polish"
          ],
          "mood": "pensive calm"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight flickering on walls",
            "stained-glass colors deepened",
            "shadows lengthening"
          ],
          "sounds": [
            "soft footsteps on carpet",
            "clock ticking near silence",
            "pages softly rustling"
          ],
          "smells": [
            "coal smoke and wood polish",
            "aged leather",
            "fresh ink"
          ],
          "mood": "reflective tension"
        }
      ],
      "paragraphs": [
        "The library’s oak shelves rise to the ceiling, heavy with leather-bound books whose spines bear the faded titles of classical literature and estate records. A stained-glass window filters the muted light, casting a kaleidoscope of colors across the polished mahogany desk and the soft leather armchairs gathered near the hearth. The low coal fire crackles steadily, offering warmth against the chill seeping through the stone walls.",
        "Within this sanctuary of knowledge and quiet, the scent of aged paper mingles with wax polish and the faint smokiness of embers. The occasional scratch of pen on paper and the ticking of a distant clock punctuate the stillness. Every surface, from the smooth desk edges to the warm hearthstone, invites lingering touch and thoughtful investigation, making it a crucial site for uncovering hidden clues."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants' Hall",
      "type": "interior",
      "purpose": "Gathering space for household staff",
      "visualDetails": "A long, low-ceilinged room with simple wooden tables and benches, the hall is lit by a single hanging oil lamp and a small fireplace with smoldering embers. Plain stone walls are adorned with practical hooks and shelves holding cleaning tools and uniforms.",
      "sensoryDetails": {
        "sights": [
          "rough wooden tables and benches",
          "flickering oil lamp glow",
          "worn stone walls",
          "stacked brooms and brushes",
          "threadbare curtains at small windows"
        ],
        "sounds": [
          "soft murmur of quiet conversation",
          "clinking of tin cups",
          "crackling low fireplace embers",
          "scraping of chairs on stone floor",
          "occasional distant footsteps"
        ],
        "smells": [
          "stale cooking smoke",
          "earthy damp stone",
          "clean linen and soap",
          "wood ash and soot",
          "faint scent of boiled vegetables"
        ],
        "tactile": [
          "rough worn wooden bench",
          "cool stone floor underfoot",
          "scratched table surfaces",
          "coarse linen uniforms",
          "warmth from small hearth"
        ]
      },
      "accessControl": "Restricted to household staff; locked during family and guest events; cleaning scheduled early morning and late evening; no visitors allowed",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through small windows",
            "oil lamp flickering weakly",
            "damp stone walls glistening"
          ],
          "sounds": [
            "rain tapping on windowpanes",
            "quiet conversation",
            "fireplace crackling softly"
          ],
          "smells": [
            "damp stone and soap",
            "smoky ash",
            "freshly boiled porridge"
          ],
          "mood": "weary but settled"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim diffuse light",
            "shadows pooling in corners",
            "oil lamp unlit"
          ],
          "sounds": [
            "muffled footsteps",
            "rustling cloth",
            "distant clinking"
          ],
          "smells": [
            "soap and damp linen",
            "wood ash",
            "faint cooking aromas"
          ],
          "mood": "quiet anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm firelight glow",
            "darkened windows",
            "shadows dancing on walls"
          ],
          "sounds": [
            "soft chatter",
            "fire crackling",
            "chairs scraping"
          ],
          "smells": [
            "smoky hearth",
            "clean linen",
            "earthy stone"
          ],
          "mood": "relaxed camaraderie"
        }
      ],
      "paragraphs": [
        "The servants’ hall is a humble refuge beneath low ceilings, furnished with rough-hewn wooden tables and benches scarred by years of use. A single oil lamp hangs from a ceiling beam, casting flickering light over the worn stone walls and the practical shelves holding brushes and uniforms. A small fireplace, its embers smoldering low, offers modest warmth against the autumn chill.",
        "Here, the household staff gather in quiet moments between duties, their voices low and subdued. The air carries the mingled scents of soap, wood ash, and the faint remnants of boiled vegetables, while the cool stone floor and coarse linen uniforms remind one of the room’s plain functionality. It is a world apart from the manor’s polished elegance, yet vital to the estate’s daily rhythm."
      ]
    },
    {
      "id": "main_entrance_hall",
      "name": "Main Entrance Hall",
      "type": "interior",
      "purpose": "Reception and arrival point",
      "visualDetails": "A grand double-height space with a sweeping stone staircase, polished marble floors, and a large wrought-iron chandelier suspended from the ceiling. Portraits of ancestors line the paneled walls, and a heavy oak door with brass fittings leads outside. A party-line telephone sits on a carved side table near a coat rack.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floor",
          "ornate wrought-iron chandelier",
          "oil portraits in gilded frames",
          "polished brass door fittings",
          "glossy oak paneling"
        ],
        "sounds": [
          "echo of footsteps on stone",
          "soft creak of staircase wood",
          "distant murmur of voices",
          "ringing of party-line telephone",
          "rustle of heavy curtains"
        ],
        "smells": [
          "polished wood and beeswax",
          "cool stone and leather",
          "faint scent of pipe tobacco",
          "fresh cut flowers in vase",
          "slight hint of damp outdoors"
        ],
        "tactile": [
          "smooth marble floor underfoot",
          "cool brass door handle",
          "polished oak banister",
          "heavy woolen curtains",
          "glossy leather-bound visitor book"
        ]
      },
      "accessControl": "Entrance locked and guarded after dusk; family and guests permitted daytime arrival; servants enter through separate door; deliveries left at gatehouse",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-splattered entrance door",
            "grey light through windows",
            "reflections on marble floor"
          ],
          "sounds": [
            "steady rain on roof",
            "telephone ringing faintly",
            "footsteps on wet stone"
          ],
          "smells": [
            "wet leather and beeswax",
            "fresh cut flowers",
            "cold stone"
          ],
          "mood": "formal and expectant"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "soft shadows under chandelier",
            "dim reflections on floor",
            "portraits in muted light"
          ],
          "sounds": [
            "distant low voices",
            "stairs creaking gently",
            "telephone quiet"
          ],
          "smells": [
            "pipe tobacco",
            "polished wood",
            "damp stone"
          ],
          "mood": "restrained welcome"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from chandelier",
            "shadows on oak paneling",
            "glint of brass fittings"
          ],
          "sounds": [
            "soft murmur of arrival",
            "footsteps echoing",
            "telephone silent"
          ],
          "smells": [
            "faint pipe smoke",
            "beeswax polish",
            "fresh flowers"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The main entrance hall impresses visitors with its soaring double-height ceiling and polished marble floors that gleam under the ornate wrought-iron chandelier. Heavy oak paneling and gilded ancestral portraits line the walls, evoking the manor’s long lineage. A large brass-handled door opens onto the gravel forecourt, the threshold between the outside world and the estate’s controlled interior.",
        "A carved side table holds a rotary telephone connected to the party-line, its faint ringing a reminder of distant conversations and urgent messages. The scent of beeswax polish mingles with cold stone and the faint trace of pipe tobacco smoke, while the rustle of heavy woolen curtains softens the space’s acoustics. Access is carefully monitored, with the door locked after dusk and entrance reserved for family, guests, and authorized personnel."
      ]
    }
  ],
  "note": "",
  "cost": 0.006951051999999998,
  "durationMs": 67245
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1936,
    "month": "January",
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "chilly temperatures hovering around freezing overnight and early morning",
      "dampness from persistent mist and occasional light rain",
      "intermittent dense fog reducing visibility outdoors, especially in the mornings and evenings"
    ],
    "daylight": "short winter days with sunrise around 8:15 AM and sunset near 4:15 PM, leaving long, dark evenings",
    "time_of_day_of_crime": "late evening—between nine and eleven at night, after the household has gathered by the hearth and radio broadcasts have ended",
    "holidays": [
      "New Year's Day (January 1st)",
      "Twelfth Night (January 6th)"
    ],
    "seasonalActivities": [
      "afternoon indoor card games and bridge parties by the fire",
      "morning walks on the estate grounds during brief daylight hours",
      "preparing and enjoying hearty stews and hot drinks to combat the cold"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits in charcoal or navy with wide lapels",
        "silk cravats or ties paired with starched white dress shirts",
        "felt homburg hats for outdoor formal occasions"
      ],
      "casual": [
        "knitted wool sweaters layered under tweed jackets",
        "corduroy trousers with buttoned suspenders",
        "leather brogue shoes polished to a shine"
      ],
      "accessories": [
        "leather gloves lined with wool",
        "pocket watches with chain attachments",
        "wool scarves in muted plaids"
      ]
    },
    "womensWear": {
      "formal": [
        "bias-cut silk evening gowns with long sleeves and modest necklines",
        "fur-trimmed coats in mink or fox worn over dresses",
        "cloche hats adorned with feathers or velvet ribbons"
      ],
      "casual": [
        "knee-length wool skirts paired with tailored knit cardigans",
        "blouses with peter pan collars and subtle puff sleeves",
        "leather ankle boots with low heels"
      ],
      "accessories": [
        "long gloves reaching mid-forearm for formal events",
        "beaded evening bags",
        "delicate pearl necklaces and brooches"
      ]
    },
    "trendsOfTheMoment": [
      "return to longer hemlines for women's dresses after mid-1930s short styles",
      "men favoring broader shoulders and tapered waists in suits",
      "popularization of natural makeup tones emphasizing eyebrows and lips"
    ],
    "socialExpectations": [
      "men to wear hats and gloves outdoors as a mark of respectability",
      "women expected to maintain modesty and elegance in dress, especially in formal settings",
      "strict adherence to formality during evening gatherings, including dress codes and conversation decorum"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Edward VIII ascends the British throne in January following King George V's death",
      "Rising political tensions in Europe with the remilitarization of the Rhineland by Germany",
      "Ongoing economic recovery efforts from the Great Depression impacting rural estates"
    ],
    "politicalClimate": "A period of cautious optimism mixed with uncertainty as Britain mourns a king and welcomes a young new monarch, while international tensions hint at looming conflict",
    "economicConditions": "Slow but uneven recovery from the Great Depression; landed gentry face financial pressures leading to conservative household budgets and reliance on estate income",
    "socialIssues": [
      "class distinctions remain rigid despite economic hardships",
      "increasing debate about workers’ rights in rural and urban areas",
      "concerns over youth unemployment and emigration"
    ],
    "internationalNews": [
      "Italy's ongoing invasion of Abyssinia causing diplomatic strain",
      "Japanese expansion in East Asia alarming global powers"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby – 'Pennies from Heaven'",
        "Duke Ellington – 'Caravan'",
        "Gracie Fields – 'Sally'"
      ],
      "films": [
        "‘The Great Ziegfeld’ (1936, previewed in some cities)",
        "‘Modern Times’ (Charlie Chaplin, 1936 UK release)",
        "‘My Man Godfrey’ (popular American comedy, screened in London cinemas)"
      ],
      "theater": [
        "Noël Coward’s ‘Tonight at 8.30’ revivals",
        "West End productions of Shakespeare’s ‘Hamlet’",
        "Musical revues featuring dancing and jazz influences"
      ],
      "radio": [
        "BBC Home Service broadcasting news and drama",
        "‘In Town Tonight’ variety program",
        "serial dramas such as ‘Dick Barton: Special Agent’ in early development"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s ‘Murder in the Mews’ (1936)",
        "T.E. Lawrence’s posthumous letters collection",
        "Virginia Woolf’s essays and occasional lectures"
      ],
      "popularGenres": [
        "detective and mystery fiction",
        "modernist literary works",
        "historical romance novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "improvements in radio receiver designs for clearer sound",
        "introduction of electric refrigerators for affluent households",
        "development of early color film processes in cinema"
      ],
      "commonDevices": [
        "manual typewriters for correspondence and record keeping",
        "party-line telephones shared between neighboring estates",
        "wind-up gramophones for music playback"
      ],
      "emergingTrends": [
        "increased radio listenership shaping public opinion and entertainment",
        "growing use of motorcars among upper classes",
        "early experiments with home electric appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 4 pence",
        "Coal scuttle refill: 1 shilling 6 pence",
        "Taxi ride across town: 2 shillings"
      ],
      "commonActivities": [
        "daily household prayers or grace before meals",
        "afternoon tea with servants and family",
        "evening reading by lamplight or fireplace"
      ],
      "socialRituals": [
        "formal dinner parties with strict seating arrangements",
        "Sunday church attendance and post-service socializing"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "landed gentry viewed as custodians of tradition and rural order",
      "servants expected to be deferential and discreet, maintaining invisibility except when summoned"
    ],
    "gender": [
      "men as heads of household with responsibility for estate management",
      "women to embody grace, modesty, and social diplomacy",
      "young women’s prospects heavily tied to advantageous marriages"
    ],
    "race": [
      "predominantly white British social sphere with little racial diversity in rural estates",
      "colonial attitudes prevalent in discussions of Empire and foreign news"
    ],
    "generalNorms": [
      "strict etiquette governs interactions between social classes",
      "privacy highly valued, especially concerning family matters",
      "public displays of emotion are restrained and decorous"
    ]
  },
  "atmosphericDetails": [
    "the sharp scent of burning coal mingled with faint traces of damp earth from the garden",
    "the crackling of logs in the hearth providing warmth against the biting cold outside",
    "the muffled ticking of a grandfather clock echoing in the dimly lit drawing room"
  ],
  "paragraphs": [
    "January 1936 in rural England is a time of stark winter stillness, where the short daylight hours give way quickly to long, dark evenings. The air is damp and cold, heavy with intermittent fog that clings to the sprawling gardens of the country estate. Inside the manor house, hearth fires are stoked frequently, casting flickering shadows on wood-paneled walls and providing a cozy refuge from the chill. The household observes traditional seasonal rituals—afternoon teas, card games by the fire, and the quiet hum of the BBC radio broadcasts filling the main drawing room with news and drama. Despite the familiar comforts, an undercurrent of tension persists, fueled by political uncertainty following the recent death of King George V and the ascension of Edward VIII, as well as growing unease over international conflicts.",
    "Fashion in this precise moment reflects a balance of elegance and practicality. Men don sharply tailored double-breasted suits with broad shoulders and narrow waists, complementing their outfits with felt homburg hats and wool scarves to combat the cold. Women favor bias-cut silk gowns trimmed with fur for formal occasions, while their daywear includes knee-length wool skirts and soft knit cardigans, designed both for style and warmth. Accessories such as long gloves, pearl brooches, and beaded evening bags reinforce the social expectations of decorum and refinement, especially during the many formal gatherings held within the manor. The era’s trends emphasize modesty and sophistication, mirroring the household’s careful adherence to established social codes.",
    "Daily life at the estate is regimented and steeped in ritual. Meals are formal affairs, with precise seating arrangements reflecting the rigid class distinctions between family members, guests, and servants. The servants maintain a discreet presence, their movements quiet and purposeful as they tend to the needs of the household. Radio programs provide a shared cultural touchstone, while literature by popular mystery authors like Agatha Christie circulates among the family and guests, adding a layer of intrigue to the winter months. Outside, the estate workers manage the grounds despite the weather’s challenges, and conversations occasionally turn to the wider world’s unrest—the growing threats in Europe and the Empire’s uncertain future. Against this backdrop, the manor’s cozy atmosphere belies the tension simmering just beneath its polished surface."
  ],
  "note": "All details have been carefully chosen to reflect January 1936 specifically within an English country estate setting, ensuring historical accuracy and narrative richness for a mystery fiction environment.",
  "cost": 0.003410588,
  "durationMs": 25902
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst the economic strains of the Great Depression, the aristocratic Wentworth family, their guests, and loyal staff are confined within the isolated manor where rigid class distinctions and strict social protocols heighten tensions under the watchful eye of Inspector Harcourt.",
  "era": {
    "decade": "1930s",
    "socialStructure": "A hierarchical society sharply divided by class, with aristocratic family members and affluent guests maintaining formal distance from servant staff, all constrained by economic caution and strict etiquette that govern daily interactions."
  },
  "setting": {
    "location": "A large, isolated English manor house several miles from the nearest village",
    "institution": "Country house estate (Manor house)",
    "weather": "Chilly and damp autumn with intermittent fog reducing outdoor visibility"
  },
  "castAnchors": [
    "Inspector Evelyn Harcourt",
    "Lady Beatrice Wentworth",
    "Charles Wentworth",
    "Margot Sinclair",
    "Robert Hensley",
    "Vivian Clarke",
    "James Porter"
  ],
  "theme": "A classic murder mystery exploring the interplay of social class, economic hardship, and hidden tensions within a confined country estate setting."
}

### LOCKED_FACTS
[
  {
    "id": "gate_bolt_release_time",
    "value": "forty-five minutes past one in the afternoon",
    "description": "Exact time when the brass bolt latch releases due to thermal expansion"
  },
  {
    "id": "garden_temperature",
    "value": "seventy-eight degrees Fahrenheit",
    "description": "Temperature at which the latch begins significant thermal expansion"
  },
  {
    "id": "gate_distance_from_house",
    "value": "twenty-five yards",
    "description": "Distance from the manor’s main door to the garden gate, relevant to travel time"
  },
  {
    "id": "sun_position_noon_angle",
    "value": "seventy degrees",
    "description": "Solar elevation angle at true noon on the day of the murder"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 6,
    "mid": 12,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
    "optional": 1
  },
  "redHerringCount": 0,
  "clues": [
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_2",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "temporal"
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
      "category": "testimonial"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_11",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_13",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_14",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_15",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_16",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_17",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_18",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_james_porter",
      "placement": "mid",
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
