# Actual Prompt Record

- Run ID: `run_477bb27a-9d95-4577-96b8-9f1ce53e9e89`
- Project ID: `proj_d916493c-17b7-4b6a-babb-4c77eb1251aa`
- Timestamp: `2026-07-24T17:24:08.433Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `7984552704243a0b`

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
    "title": "The Sundial’s Frozen Shadow",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Radio common",
        "Early telephones in homes",
        "No television",
        "Typewriters standard",
        "Fingerprinting standard",
        "Basic toxicology",
        "Ballistics analysis emerging",
        "Automobiles reliable",
        "Passenger trains peak",
        "Early commercial aviation",
        "Telephone more common",
        "Telegram faster",
        "Airmail available",
        "Great Depression impact",
        "Class tensions",
        "Fascism rising in Europe",
        "Professional detectives",
        "Forensic science developing"
      ]
    },
    "setting": {
      "location": "English countryside",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Country house estate (Manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "struck with heavy copper sundial gnomon"
    }
  },
  "death_method": "struck with heavy copper sundial gnomon",
  "cast": [
    {
      "name": "Inspector Harold Wren",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [
        "Professional acquaintance of estate staff",
        "Respected investigator in local police"
      ],
      "public_persona": "Calm, methodical detective",
      "private_secret": "Skeptical of initial witness testimonies",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "Entire investigation period",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Solve the case and uphold justice",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Lady Beatrice Ellsworth",
      "age_range": "50-60",
      "role_archetype": "victim",
      "relationships": [
        "Estate owner",
        "Respected matron of the manor"
      ],
      "public_persona": "Formidable and dignified",
      "private_secret": "Had secret quarrels with Charles Pembroke",
      "motive_seed": "Silencing a witness to a past secret",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Life lost",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Charles Pembroke",
      "age_range": "45-55",
      "role_archetype": "Estate Manager",
      "relationships": [
        "Professional with Lady Beatrice",
        "Tense relationship with Simon Clarkson"
      ],
      "public_persona": "Efficient, serious",
      "private_secret": "Had heated argument with victim earlier",
      "motive_seed": "Professional rivalry and fear of exposure",
      "motive_strength": "strong",
      "alibi_window": "Between midday and one o'clock",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to sundial and gardens",
        "Keys to garden gates"
      ],
      "behavioral_tells": [
        "Frequently agitated after victim's death"
      ],
      "stakes": "Potential loss of position and reputation",
      "evidence_sensitivity": [
        "Keys to garden gates",
        "Recent argument with Lady Beatrice"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Margaret Huxley",
      "age_range": "30-40",
      "role_archetype": "Housekeeper",
      "relationships": [
        "Loyal to Lady Beatrice",
        "Resents Charles Pembroke"
      ],
      "public_persona": "Steady, reliable",
      "private_secret": "Knows more about estate disagreements than admitted",
      "motive_seed": "Protecting household secrets",
      "motive_strength": "moderate",
      "alibi_window": "Between noon and two o'clock",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to kitchen and servants’ quarters",
        "Can move in gardens discreetly"
      ],
      "behavioral_tells": [
        "Nervous when questioned about timing"
      ],
      "stakes": "Maintaining household order",
      "evidence_sensitivity": [
        "Knowledge of household schedules"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Simon Clarkson",
      "age_range": "50-60",
      "role_archetype": "Gardener",
      "relationships": [
        "Long service to estate",
        "Disliked by Charles Pembroke"
      ],
      "public_persona": "Gruff, taciturn",
      "private_secret": "Harbors resentment over recent reprimand",
      "motive_seed": "Resentment and anger",
      "motive_strength": "moderate",
      "alibi_window": "Late morning to early afternoon",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to gardens and toolshed",
        "Familiar with sundial location"
      ],
      "behavioral_tells": [
        "Avoids direct answers about whereabouts"
      ],
      "stakes": "Preserving employment and dignity",
      "evidence_sensitivity": [
        "Toolshed access",
        "Reprimand record"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Eleanor Fairchild",
      "age_range": "25-35",
      "role_archetype": "Visiting artiste",
      "relationships": [
        "Friend of Lady Beatrice",
        "Acquainted with Thomas Granger"
      ],
      "public_persona": "Charming and enigmatic",
      "private_secret": "Had a recent argument with Lady Beatrice",
      "motive_seed": "Jealousy and personal grievance",
      "motive_strength": "moderate",
      "alibi_window": "Around midday",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to conservatory and gardens",
        "Seen near victim shortly before death"
      ],
      "behavioral_tells": [
        "Evasive about her movements"
      ],
      "stakes": "Protecting reputation",
      "evidence_sensitivity": [
        "Argument with victim",
        "Presence near sundial"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Thomas Granger",
      "age_range": "35-45",
      "role_archetype": "Estate chauffeur",
      "relationships": [
        "Close to Eleanor Fairchild",
        "Friendly with Margaret Huxley"
      ],
      "public_persona": "Quiet, observant",
      "private_secret": "Knows secrets of household staff",
      "motive_seed": "Protecting personal loyalty",
      "motive_strength": "moderate",
      "alibi_window": "Between 11 a.m. and 1 p.m.",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to vehicles and estate grounds",
        "Can move unnoticed"
      ],
      "behavioral_tells": [
        "Tense when questioned about timing"
      ],
      "stakes": "Preserving employment and friendships",
      "evidence_sensitivity": [
        "Knowledge of staff movements"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Charles Pembroke"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "On a cool autumn morning at the isolated Ellsworth Manor in Yorkshire, Lady Beatrice Ellsworth was found dead, struck by the manor's heavy copper sundial gnomon. Initial witness testimonies and the sundial's shadow suggested she was alive well into the late morning. Inspector Harold Wren's meticulous investigation reveals that thermal contraction of the sundial's copper plate shifted the shadow, misleading everyone about the time of death. This false timeline concealed the murderer’s exact opportunity. Through careful analysis of environmental clues and witness statements, Inspector Wren unravels the true sequence of events, exposing Charles Pembroke, the estate manager, who exploited the manor’s physical and social constraints to commit murder."
    },
    "accepted_facts": [
      "Lady Beatrice was found struck by the sundial’s gnomon.",
      "Witnesses claimed seeing Lady Beatrice alive midmorning based on sundial shadow.",
      "The sundial is made of copper and subject to thermal contraction.",
      "A thermometer on the garden wall read thirty-one degrees Fahrenheit the morning of the murder.",
      "Lady Beatrice’s stopped watch showed a quarter past ten.",
      "The sundial’s copper plate shows slight warping from contraction.",
      "Charles Pembroke had argued with Lady Beatrice earlier that day.",
      "Charles Pembroke had access to the garden and sundial.",
      "Other suspects had alibis or lacked opportunity during the true time of death."
    ],
    "inferred_conclusions": [
      "The sundial’s shadow was delayed by about twenty minutes due to thermal contraction.",
      "Lady Beatrice died earlier than witnesses believed.",
      "The false timeline provided by the sundial shadow concealed the murderer’s window of opportunity.",
      "Charles Pembroke’s alibi does not hold when the sundial timing is corrected.",
      "The motive relates to professional rivalry and silencing Lady Beatrice."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murder was concealed by the physical effect of thermal contraction on the copper sundial plate, delaying the gnomon’s shadow position by about twenty minutes. This delayed shadow misled all witnesses and household members into believing Lady Beatrice was alive later than she truly was, providing the murderer with a hidden window of opportunity. The murderer struck her with the sundial’s heavy gnomon during the early morning chill when the contraction was most pronounced. The subtle physical distortion was overlooked due to trust in the sundial as a time source and witness reliance on the apparent solar time indicated by the shadow.",
      "delivery_path": [
        {
          "step": "Thermal contraction reduces sundial plate size below freezing, shifting shadow delay."
        },
        {
          "step": "Witnesses observe sundial shadow position and report Lady Beatrice alive at incorrect later time."
        },
        {
          "step": "Murderer uses this false timeline to strike Lady Beatrice with sundial gnomon in early morning."
        },
        {
          "step": "Physical clues such as frost on sundial base and thermometer readings reveal contraction effect."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is established to be earlier than believed, eliminating suspects with alibis based on false sundial time and exposing Charles Pembroke’s guilt."
    }
  },
  "false_assumption": {
    "statement": "The victim was alive until at least twenty past ten, as indicated by the sundial’s shadow position and multiple witness sightings in the garden.",
    "type": "temporal",
    "why_it_seems_reasonable": "The sundial’s shadow is a trusted natural clock and multiple witnesses independently correlated their sightings with the shadow's position, giving a convincing timeline.",
    "what_it_hides": "The sundial’s copper plate contracted in the early morning cold, delaying the shadow by about twenty minutes and misleading all about the victim's actual time of death."
  },
  "false_solution": {
    "accused_suspect": "Simon Clarkson",
    "supporting_points": [
      "Simon Clarkson had a recent reprimand and motive for resentment.",
      "He was seen near the gardens around the assumed time of death.",
      "Footprints near the sundial matched his boots."
    ],
    "the_one_flaw": "Simon’s alibi and tool access do not hold up when the true time of death is corrected to earlier, before his presence in the garden.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Footprints found near the sundial appeared fresh and matched Simon Clarkson’s boots, suggesting he was near the victim at the time.",
      "points_at_suspect": "Simon Clarkson",
      "innocent_explanation": "The footprints were older but disturbed by recent garden work; soil compaction and moisture gradient showed they were made earlier than claimed.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "An argument overheard between Lady Beatrice and Eleanor Fairchild shortly before the murder suggested a personal motive.",
      "points_at_suspect": "Eleanor Fairchild",
      "innocent_explanation": "The argument concerned trivial artistic disagreements and did not provide motive or opportunity for murder.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Charles Pembroke",
      "Margaret Huxley",
      "Simon Clarkson",
      "Eleanor Fairchild",
      "Thomas Granger"
    ],
    "rationale": "The manor was isolated with no visitors aside from the listed cast, and the locked grounds and gates prevented outsiders from entering unnoticed."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Lady Beatrice’s stopped watch at quarter past ten",
        "Thermometer reading of thirty-one degrees Fahrenheit at garden wall at 10 a.m."
      ],
      "windows": [
        "Witness sightings between 10:15 and 10:40 a.m.",
        "Charles Pembroke’s alibi from noon onwards"
      ],
      "contradictions": [
        "Sundial shadow indicates later time than stopped watch",
        "Thermometer reading below freezing contradicts expected sundial reading"
      ]
    },
    "access": {
      "actors": [
        "Charles Pembroke",
        "Simon Clarkson",
        "Margaret Huxley",
        "Eleanor Fairchild",
        "Thomas Granger"
      ],
      "objects": [
        "Copper sundial",
        "Garden gates",
        "Keys held by Charles Pembroke"
      ],
      "permissions": [
        "Estate manager Charles Pembroke has keys and garden access",
        "Gardener Simon Clarkson has routine access to gardens",
        "Housekeeper Margaret Huxley has limited garden access"
      ]
    },
    "physical": {
      "laws": [
        "Copper contracts when temperature is below freezing",
        "Sundial shadow position depends on plate size and gnomon position",
        "Thermometer measures ambient temperature"
      ],
      "traces": [
        "Frost crystals on base of sundial",
        "Copper plate warping visible on close inspection",
        "Stopped wristwatch on victim’s body"
      ]
    },
    "social": {
      "trust_channels": [
        "Witness testimony correlating sundial shadow to time",
        "Household schedules and routines",
        "Deference to estate manager’s statements"
      ],
      "authority_sources": [
        "Charles Pembroke’s role as estate manager",
        "Inspector Harold Wren’s investigation",
        "Social hierarchy constraining servant statements"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The thermometer on the garden wall recorded a temperature of thirty-one degrees Fahrenheit at 10 a.m. on the morning of the murder.",
        "correction": "Since the temperature was below freezing, the copper sundial plate would have contracted, causing the gnomon shadow to lag behind true solar time.",
        "effect": "Narrows the time window of death to earlier than the sundial shadow indicates, challenging all witness timings based on the sundial.",
        "required_evidence": [
          "Thermometer reading of thirty-one degrees Fahrenheit at garden wall",
          "Knowledge that copper contracts below freezing (physical law)",
          "Sundial shadow position indicating later time than stopped watch",
          "Frost crystals observed on the sundial base"
        ],
        "reader_observable": true
      },
      {
        "observation": "Lady Beatrice’s wristwatch, found stopped, reads quarter past ten in the morning.",
        "correction": "The victim died at or before this time; the sundial shadow indicating a later time is therefore misleading due to physical contraction effects.",
        "effect": "Eliminates alibis and witness statements that place the victim alive after quarter past ten.",
        "required_evidence": [
          "Stopped wristwatch on Lady Beatrice’s body reading quarter past ten",
          "Witnesses claiming victim alive after quarter past ten based on sundial shadow",
          "Copper sundial plate’s thermal contraction effect",
          "Frost presence on sundial base"
        ],
        "reader_observable": true
      },
      {
        "observation": "Charles Pembroke’s alibi claims he was occupied after eleven, but witnesses place him near the sundial before ten.",
        "correction": "Since the victim died before quarter past ten, Charles Pembroke’s alibi is undermined and he had opportunity to commit the murder.",
        "effect": "Eliminates Charles Pembroke’s alibi, making him prime suspect.",
        "required_evidence": [
          "Charles Pembroke’s claimed alibi after eleven",
          "Witness accounts placing him near sundial before ten",
          "Victim’s stopped watch at quarter past ten",
          "Thermal contraction effect on sundial causing false later shadow time"
        ],
        "reader_observable": true
      },
      {
        "observation": "Copper sundial plate shows slight warping and frost crystals on close inspection.",
        "correction": "Physical evidence confirms that the sundial was subject to thermal contraction, causing the shadow delay that misled witnesses.",
        "effect": "Confirms the false timeline mechanism and supports reevaluation of suspect timelines.",
        "required_evidence": [
          "Copper sundial plate warping",
          "Frost crystals on sundial base",
          "Thermometer reading below freezing",
          "Witnesses correlating sundial shadow with time"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "constraint_proof",
    "design": "By comparing the exact stopped time on Lady Beatrice’s watch with the sundial shadow position and measuring the copper plate contraction from ambient temperature, the test proves the victim’s death occurred earlier than the sundial’s indicated time, invalidating Charles Pembroke’s alibi which depends on the false later timeline.",
    "knowledge_revealed": "The sundial’s physical contraction altered the shadow, misleading timing; Charles Pembroke’s opportunity window aligns with the true earlier time of death.",
    "pass_condition": "Demonstration that Charles Pembroke cannot be innocent as his claimed alibi depends on a false sundial time disproved by physical evidence.",
    "evidence_clues": [
      "clue_thermometer_reading",
      "clue_stopped_watch",
      "clue_sundial_warping",
      "clue_witness_timing_conflict",
      "clue_charles_alibi_conflict",
      "clue_comparing_watch_and_sundial",
      "clue_shadow_time_contradiction",
      "clue_witness_statements"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The thermometer reading and frost on the sundial base expose the contracting copper effect that misleads the timeline (early clues).\nStep 2: The victim’s stopped watch proves death before the assumed sundial time, contradicting witness statements (mid clues).\nStep 3: Witness accounts and alibis are reexamined and Charles Pembroke’s alibi fails (mid to late clues).\nStep 4: Physical inspection of the sundial plate confirms the contraction mechanism (late clue).\nThe discriminating test crystallizes this contradiction using only previously observed evidence, allowing the reader to logically deduce Charles Pembroke’s guilt."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 3,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 4,
      "essential_clues_before_test": true,
      "early_clues_min": 2,
      "mid_clues_min": 1,
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
      "test_type": "constraint_proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Margaret Huxley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by servants’ schedules and absence from garden",
        "supporting_clues": [
          "clue_housekeeper_alibi",
          "clue_servants_schedule"
        ]
      },
      {
        "suspect_name": "Simon Clarkson",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Footprint moisture analysis proves prints were older, eliminating presence during true time of death",
        "supporting_clues": [
          "clue_footprint_moisture",
          "clue_gardener_testimony"
        ]
      },
      {
        "suspect_name": "Eleanor Fairchild",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Argument context and witness statements clear her of motive or opportunity",
        "supporting_clues": [
          "clue_argument_context",
          "clue_witness_statements"
        ]
      },
      {
        "suspect_name": "Thomas Granger",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified by vehicle logs and staff witness",
        "supporting_clues": [
          "clue_vehicle_log",
          "clue_staff_witness"
        ]
      },
      {
        "suspect_name": "Lady Beatrice Ellsworth",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with collected evidence showing sundial contraction and disproved alibi"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_thermometer_reading",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation of garden thermometer"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_shadow_time_contradiction",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_stopped_watch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Inspection of victim’s wristwatch at discovery"
      },
      {
        "clue_id": "clue_struck_wound_observation",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_witness_statements",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Multiple witnesses confirming Eleanor’s presence elsewhere"
      },
      {
        "clue_id": "clue_charles_alibi_conflict",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Cross-examination of Charles Pembroke’s statements"
      },
      {
        "clue_id": "clue_victim_before_quarter_past_ten_contradiction",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_argument_context",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness accounts of argument between Lady Beatrice and Eleanor Fairchild"
      },
      {
        "clue_id": "clue_charles_premeditation_observation",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_comparing_watch_and_sundial",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_charles_pembroke",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_footprint_moisture",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Forensic soil moisture analysis near sundial"
      },
      {
        "clue_id": "clue_gardener_testimony",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Simon Clarkson’s statements about garden activity"
      },
      {
        "clue_id": "clue_housekeeper_alibi",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Housekeeper Margaret Huxley’s alibi testimony"
      },
      {
        "clue_id": "clue_physical_evidence_contradiction",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_servants_schedule",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Review of servants’ daily routine logs"
      },
      {
        "clue_id": "clue_staff_witness",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Staff testimony confirming Thomas Granger’s whereabouts"
      },
      {
        "clue_id": "clue_sundial_warping",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Physical inspection of sundial in garden"
      },
      {
        "clue_id": "clue_vehicle_log",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Chauffeur log entries for Thomas Granger"
      },
      {
        "clue_id": "clue_witness_timing_conflict",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Interviews with household witnesses"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Inspector Harold Wren",
    "summary": "A seasoned Scotland Yard inspector tasked with unraveling the tangled web of motives surrounding Lady Beatrice's murder.",
    "publicPersona": "Inspector Harold Wren is a methodical and composed detective, whose steady hand and calm demeanor have earned him respect across the force. His years of service have honed a meticulous approach, favoring facts over conjecture, and a patience that rarely falters, even under pressure. He projects an aura of quiet authority, his measured voice and deliberate speech putting witnesses and suspects alike at ease.",
    "privateSecret": "Beneath this veneer of impartiality, Harold wrestles with the political pressures exerted by the local aristocracy. Influential voices urge him to suppress certain leads, threatening his commitment to justice with the weight of societal power. This clandestine interference gnaws at his conscience, forcing him to navigate a perilous path between duty and survival within the establishment.",
    "motiveSeed": "N/A - official investigator",
    "motiveStrength": "weak",
    "alibiWindow": "N/A - arrived after murder discovered",
    "accessPlausibility": "impossible",
    "stakes": "His professional reputation and personal integrity hang in the balance as he confronts the tangled loyalties and class tensions that cloud the investigation.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Harold speaks with careful precision, his sentences well-constructed and deliberate. He favors understatement and often employs subtle irony to cut through obfuscation. His tone remains measured, rarely betraying emotion, but his dry wit surfaces in quiet asides that reveal his sharp mind.",
    "signatureTic": "\"One mustn't jump to conclusions, now, must we?\"",
    "internalConflict": "Harold is torn between his unwavering commitment to uncovering the truth and the oppressive political pressures that demand silence on certain leads. This tension fuels a deep fear that exposing the full facts might endanger his career and the fragile order he serves.",
    "personalStakeInCase": "Beyond professional duty, Harold feels compelled to prove that justice is not the privilege of the powerful. The case challenges his belief in the law's impartiality and his own ability to uphold it amidst aristocratic interference.",
    "paragraphs": [
      "Inspector Harold Wren arrived at the Ellsworth estate with the quiet authority of a man accustomed to the shadows of society's upper echelons. His coat buttoned tight against the crisp night air, he surveyed the scene with a practiced eye, noting the subtle disturbances amid the polished veneer. Years in Scotland Yard had taught him to read the unspoken tensions beneath genteel facades, and here, those tensions writhed like restless ghosts.",
      "His methodical approach was both a shield and a weapon. Harold's calm demeanor often disarmed suspects and witnesses, coaxing truths from even the most guarded lips. Yet beneath his composed exterior, an unease simmered—political pressure from the local aristocracy whispered threats, urging him to steer the investigation away from inconvenient revelations. The inspector knew that justice in these parts was a delicate dance, choreographed by power and privilege.",
      "In conversation, Harold’s dry wit emerged sparingly but effectively. When faced with evasions, he would remark with a slight arch of his brow, 'One mustn't jump to conclusions, now, must we?' His tone suggested both patience and a quiet challenge, inviting honesty without confrontation. This subtlety was his hallmark, allowing him to navigate the treacherous social waters without alienating key figures.",
      "The inspector's internal conflict was a constant companion. He feared that exposing the truth might unravel not only the estate’s secrets but also his standing within the force and society at large. Yet, his personal code forbade compromise. Each step forward was a battle between maintaining integrity and succumbing to the silent demands of power—a battle he fought with weary resolve.",
      "This case was more than a professional puzzle; it was a test of Harold’s own convictions. The murder of Lady Beatrice Ellsworth threatened to expose the rot beneath the estate’s polished surface and challenge the very structures Harold had long served. His pursuit of justice was as much about preserving his own soul as it was about solving the crime."
    ],
    "order": 1
  },
  {
    "name": "Lady Beatrice Ellsworth",
    "summary": "The formidable matriarch whose death ignited the unraveling of long-buried secrets within the Ellsworth estate.",
    "publicPersona": "Lady Beatrice Ellsworth was the embodiment of aristocratic dignity and strict stewardship. As the estate’s owner, she commanded respect with an iron will masked by polished manners. Her presence was a steadying force in local society, her sharp gaze and precise speech leaving little room for dissent. She was known for her rigorous management, ensuring the estate's legacy remained intact through turbulent times.",
    "privateSecret": "Secretly, Lady Beatrice had been orchestrating a ruthless reshaping of her will, planning to cut several staff members and even some visitors out of any inheritance. This careful pruning was intended to secure her family’s fortune but risked igniting resentments that simmered beneath the estate’s genteel surface.",
    "motiveSeed": "N/A - victim",
    "motiveStrength": "weak",
    "alibiWindow": "N/A - murdered",
    "accessPlausibility": "possible",
    "stakes": "Her death threatens to shatter the estate’s future and expose the ambitions and grudges she sought to suppress.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Lady Beatrice spoke with measured grace and a clipped precision, her words chosen as carefully as the estate's gardens. She rarely indulged in frivolity, favoring a tone that conveyed authority without overt harshness. Her humor was subtle, often woven into dry observations that hinted at the iron will beneath the polished surface.",
    "signatureTic": "\"One must always consider the long view.\"",
    "internalConflict": "Though outwardly resolute, Lady Beatrice wrestled privately with the loneliness of command and the burdens of preserving her family’s legacy in a changing world.",
    "personalStakeInCase": "Her life’s work—the estate and its future—was at stake. Her death not only ended her reign but unleashed the very tensions she had sought to contain.",
    "paragraphs": [
      "Lady Beatrice Ellsworth was the steady heartbeat of the estate, a woman whose presence filled rooms with an unspoken command. Her voice, calm yet unyielding, carried the weight of generations, and her eyes missed little. To the outside world, she was the very image of a matriarch: dignified, resolute, and unflappable.",
      "Behind closed doors, however, her management bore a sterner edge. The decision to revise her will was not made lightly; it was a calculated move to safeguard her family's fortune against perceived threats from within the household and visiting circles. This secret machination sowed seeds of resentment that would soon bloom in tragic fashion.",
      "Her speech reflected her nature—measured and precise, with a dryness that could cut sharper than any sword. She would often remark, 'One must always consider the long view,' a phrase that encapsulated her approach to life and estate management. There was little room for sentimentality in her world, only the cold calculus of legacy.",
      "Despite her formidable exterior, Lady Beatrice carried the weight of isolation. The responsibilities of her position left little space for companionship or trust, and she bore the loneliness of command with a stiff upper lip. This internal solitude was perhaps her most guarded secret.",
      "Her death sent shockwaves through the estate, unraveling the carefully maintained order she had fought to uphold. It was a rupture not only of life but of the fragile peace that had kept ambitions and grudges at bay."
    ],
    "order": 2
  },
  {
    "name": "Charles Pembroke",
    "summary": "The ambitious estate manager whose loyalty is tested by the threat of losing his promised inheritance.",
    "publicPersona": "Charles Pembroke presents himself as a diligent and loyal steward of the estate, eager to modernize and improve operations. His speech is confident and polished, reflecting his aspirations and education. He carries himself with the assuredness of a man who believes in merit and progress, yet there is an undercurrent of tension beneath his composed exterior.",
    "privateSecret": "Beneath his professional veneer, Charles is gripped by desperation. Lady Beatrice’s recent decision to alter her will jeopardizes the promotion and inheritance he has long counted on. To him, the murder may be the only way to preserve his future and social ascent.",
    "motiveSeed": "Stands to lose his expected promotion and inheritance after Lady Beatrice decided to change her will; murder seen as only way to preserve his future.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claims to have been inspecting the west wing garden from 8:30 pm to 9:15 pm.",
    "accessPlausibility": "easy",
    "stakes": "Losing the chance to secure his place among the landed gentry and the financial security that would come with it.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Charles speaks with a measured cadence, often punctuating his observations with sharp, sometimes ironic remarks about the estate and its traditions. He blends formality with candidness, revealing his pragmatic mind and occasional impatience with antiquated ways.",
    "signatureTic": "\"It's all terribly fascinating, if one cares to look closely.\"",
    "internalConflict": "Charles struggles to reconcile his ambition with a genuine loyalty to the estate and its people, torn between progress and the personal cost of ruthless advancement.",
    "personalStakeInCase": "The outcome of the investigation holds his future in the balance—both his career and his social standing depend on the estate’s stability and his place within it.",
    "paragraphs": [
      "Charles Pembroke navigated the estate with the precision of a man who saw himself as its future architect. His eyes missed no detail, and his hands were ever busy with plans to modernize operations. To him, the estate was more than a workplace; it was the stepping stone to a life he had long envisioned among the gentry.",
      "His speech carried the polish of education and ambition, yet it was tinged with the impatience of a man constrained by tradition. He would often say, 'It's all terribly fascinating, if one cares to look closely,' a phrase that revealed his penchant for subtle critique wrapped in civility.",
      "Beneath his professional demeanor, however, lay a man in quiet turmoil. The news of Lady Beatrice’s revised will struck at the heart of his aspirations. The promotion and inheritance he had counted on suddenly seemed slipping through his fingers, and with them, the future he had painstakingly built in his mind.",
      "This desperation seeded a compelling motive. While outwardly loyal, Charles wrestled with darker thoughts—the possibility that removing Lady Beatrice might be the only way to secure his destiny. This moral crossroads shaped his every action and word, casting a shadow over his otherwise diligent persona.",
      "His alibi, inspecting the west wing garden during the critical time, was plausible but scrutinized. His intimate knowledge of the estate granted him easy access to all quarters, making his presence both natural and suspect. The tension between his ambition and loyalty made him a figure both sympathetic and dangerous."
    ],
    "order": 3
  },
  {
    "name": "Margaret Huxley",
    "summary": "The composed secretary whose simmering frustrations and secrets cast suspicion upon her.",
    "publicPersona": "Margaret is the picture of efficiency and composure, managing Lady Beatrice’s affairs with quiet competence. Her speech is precise and formal, yet she carries an undercurrent of restrained emotion, hinting at the pressure beneath her polished exterior. She maintains a professional distance, carefully measured in her interactions.",
    "privateSecret": "Behind her composed facade, Margaret harbors bitterness over stalled career prospects and conceals minor embezzlement. She knows incriminating details about Lady Beatrice’s plans, and the new will threatens to expose her, providing a motive laced with self-preservation.",
    "motiveSeed": "Weak motive: bitterness over stalled career and potential exposure of her minor embezzlement if Lady Beatrice's new will is enacted.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been organizing estate papers in the main hall between 8:45 pm and 9:05 pm.",
    "accessPlausibility": "possible",
    "stakes": "Risk of losing her position and facing legal consequences, with her carefully maintained reputation in tatters.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.3,
    "speechMannerisms": "Margaret’s speech is crisp and formal, yet her sarcasm surfaces in subtle barbs and pointed comments, often cloaked in polite phrasing. She chooses words with care, using civility as a veil for her sharp observations and veiled resentments.",
    "signatureTic": "\"One mustn't be too hasty to judge, though, wouldn’t you agree?\"",
    "internalConflict": "Margaret is caught between the desire to protect herself and an emerging conscience that questions the cost of silence and deceit.",
    "personalStakeInCase": "Her professional survival is at risk; the investigation threatens to unveil secrets she has guarded jealously, forcing her to confront the consequences of her actions.",
    "paragraphs": [
      "Margaret Huxley moved through the estate’s corridors with the practiced grace of one who had mastered discretion. Her role as Lady Beatrice’s secretary placed her at the nexus of power and secrecy, and she wielded this position with quiet authority. Her voice, always measured, carried an edge that only the keenest listeners discerned.",
      "She was the epitome of professionalism, yet beneath that exterior simmered frustration. Passed over for promotion and burdened by the knowledge of her minor embezzlement, Margaret’s loyalty was complicated. The revision of the will threatened to unravel the delicate balance she maintained between duty and self-interest.",
      "Her humor was a weapon cloaked in politeness. When pressed, she might respond, 'One mustn't be too hasty to judge, though, wouldn’t you agree?'—a phrase that cut through pretense while maintaining an air of civility. This polite savagery was her shield against a world she perceived as unjust.",
      "Her alibi placed her organizing papers in the main hall during the critical window, a claim plausible but uncorroborated beyond her word. This proximity to the victim and intimate knowledge of estate affairs made her both a valuable witness and a suspicious figure.",
      "Internally, Margaret battled the tension between self-preservation and the stirrings of conscience. The unfolding investigation forced her to weigh the cost of silence against the price of truth, a dilemma that threatened to fracture her carefully constructed life."
    ],
    "order": 4
  },
  {
    "name": "Simon Clarkson",
    "summary": "The proud head gardener whose recent humiliation fuels quiet resentment and fear for his future.",
    "publicPersona": "Simon Clarkson embodies the skilled tradesman, dedicated to his craft and proud of the estate’s gardens. His speech is straightforward and earnest, often marked by a no-nonsense tone that reflects his practical nature. He carries himself with the dignity of one who knows his worth despite his station.",
    "privateSecret": "Recently reprimanded by Lady Beatrice over budget cuts, Simon fears dismissal and the loss of his livelihood. His resentment simmers beneath a loyal exterior, providing a weak but tangible motive linked to his status and survival.",
    "motiveSeed": "Weak motive: Resentment over public reprimand and threat of dismissal following Lady Beatrice's austerity measures.",
    "motiveStrength": "weak",
    "alibiWindow": "Was reportedly in the greenhouse from 8:50 pm to 9:10 pm according to a junior gardener.",
    "accessPlausibility": "possible",
    "stakes": "The loss of his job would mean destitution and damage to his reputation among peers, a blow to both pride and survival.",
    "humourStyle": "deadpan",
    "humourLevel": 0.2,
    "speechMannerisms": "Simon’s speech is plain and direct, with little embellishment. He often delivers remarks in a deadpan manner, his tone flat but carrying an undercurrent of dry humor. He tends to avoid unnecessary words, speaking in brief, clipped sentences that convey his no-nonsense attitude.",
    "signatureTic": "\"Well, it is what it is.\"",
    "internalConflict": "Simon wrestles with pride and fear, struggling to maintain dignity while facing the threat of unemployment and social displacement.",
    "personalStakeInCase": "His future depends on the estate’s stability and Lady Beatrice’s favor. Her death threatens to unsettle the delicate balance that preserves his position.",
    "paragraphs": [
      "Simon Clarkson was a man of the earth, his hands as familiar with soil and roots as with the language of restraint. His pride in the estate’s gardens was palpable, and he carried himself with the quiet dignity of a craftsman who knew his worth, even when the world above might not see it.",
      "His speech was plain-spoken and to the point. He would often shrug off concerns with a flat, 'Well, it is what it is,' revealing a deadpan humor that masked deeper anxieties. This simplicity belied the complex emotions simmering beneath—the humiliation of Lady Beatrice’s recent reprimand and the looming threat of dismissal.",
      "Simon’s alibi rested on the testimony of a junior gardener who placed him in the greenhouse during the critical minutes. This plausible presence lent him an air of innocence, though the proximity to the estate and his knowledge of its rhythms meant he could not be dismissed lightly.",
      "His internal conflict was a battle between pride and survival. The possibility of losing his livelihood threatened not only his financial security but the very identity he had forged through years of dedicated work. This tension colored his every action, infusing his quiet demeanor with a guarded edge.",
      "In the unfolding drama of the estate, Simon represented the often overlooked class caught in the crossfire of aristocratic power struggles. His stake was personal and profound—a fight to preserve dignity in a world that could turn on him with a single word."
    ],
    "order": 5
  },
  {
    "name": "Eleanor Fairchild",
    "summary": "The charming socialite niece whose financial desperation and manipulations complicate the estate’s secrets.",
    "publicPersona": "Eleanor Fairchild is a vivacious and polished socialite, fluent in the art of charm and subtle influence. Her speech is florid and animated, peppered with fashionable phrases and a lilting accent that reflects her high society aspirations. She is adept at masking desperation beneath a veneer of confidence.",
    "privateSecret": "Desperate to maintain her lavish lifestyle, Eleanor is suspected of manipulating Lady Beatrice and fears disinheritance under the new will. Her moderate motive suggests murder as a last resort to restore her standing and financial security.",
    "motiveSeed": "Moderate motive: Stands to inherit a significant fortune but fears Lady Beatrice's new will will disinherit her; sees murder as a last resort to restore her status.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been at a formal dinner in the village pub from 8:30 pm to 9:20 pm, but witnesses are uncertain.",
    "accessPlausibility": "possible",
    "stakes": "Her social standing and financial survival depend on the estate’s fortunes and Lady Beatrice’s favor.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor’s speech is lively and often theatrical, with a penchant for sardonic wit. She delights in cutting remarks and double entendres, delivered with a playful smile. Her tone can shift swiftly from coquettish to biting, keeping interlocutors off balance.",
    "signatureTic": "\"Darling, one must play the game to win it.\"",
    "internalConflict": "Eleanor wrestles with the clash between her ambition and the faint stirrings of conscience, torn between ruthless self-interest and the desire for genuine connection.",
    "personalStakeInCase": "The investigation threatens to expose her manipulations and jeopardize her future, forcing her to confront the precariousness of her social climb.",
    "paragraphs": [
      "Eleanor Fairchild entered rooms like a breeze of spring—light, bright, and impossible to ignore. Her laughter tinkled with practiced ease, and her words danced on the edge of flirtation and challenge. She was a socialite through and through, fluent in the unspoken rules of high society and adept at wielding charm like a weapon.",
      "Her florid speech and animated mannerisms masked a sharper edge. Beneath the surface lay a woman desperate to cling to a lifestyle slipping through her fingers. The whispers of disinheritance under Lady Beatrice’s new will fueled her fears and sharpened her wits.",
      "She would often murmur with a sardonic smile, 'Darling, one must play the game to win it,' a phrase that encapsulated her philosophy and the lengths to which she was willing to go. Her wit was both a shield and a sword, allowing her to navigate treacherous waters with grace and guile.",
      "Her alibi, a formal dinner at the village pub, was clouded by uncertain witnesses, leaving her movements during the critical time open to doubt. This ambiguity lent her both plausible innocence and potential guilt.",
      "Internally, Eleanor’s conflict was palpable. The ruthless ambition that drove her was tempered by moments of genuine longing for acceptance and stability. The case forced her to confront the costs of her duplicity and the fragile nature of the world she sought to conquer."
    ],
    "order": 6
  },
  {
    "name": "Thomas Granger",
    "summary": "The unflappable butler whose loyalty masks personal ambitions and concealed scandals.",
    "publicPersona": "Thomas Granger is the archetype of the discreet and dependable butler, managing the estate’s staff with quiet efficiency. His speech is formal and measured, reflecting both his position and a cultivated reserve. He commands respect through calm authority and impeccable manners.",
    "privateSecret": "Harbors resentment over a rescinded promised legacy and fears exposure of a personal scandal. These hidden ambitions and vulnerabilities provide a weak motive tied to financial and social stakes.",
    "motiveSeed": "Weak motive: Potential financial loss and fear of personal scandal exposure if Lady Beatrice survived and enacted new policies.",
    "motiveStrength": "weak",
    "alibiWindow": "Was overseeing dinner preparations in the kitchen and claims multiple staff can attest to his presence from 8:40 pm to 9:00 pm.",
    "accessPlausibility": "easy",
    "stakes": "The loss of promised inheritance and potential ruin of reputation threaten his standing among the staff and his financial security.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Thomas speaks with a polished formality, occasionally punctuated by dry, self-deprecating humor that reveals a wry awareness of his own ambitions and limitations. His tone remains respectful but carries subtle hints of irony when discussing matters of status and duty.",
    "signatureTic": "\"Well, one does what one can, doesn’t one?\"",
    "internalConflict": "Thomas is torn between his duty to the estate and the desire to secure his own future, haunted by the fear that his secrets might surface and undo him.",
    "personalStakeInCase": "The investigation threatens to strip him of both his social standing and financial security, forcing him to carefully balance loyalty with self-interest.",
    "paragraphs": [
      "Thomas Granger moved through the estate like a shadow—present but unassuming, managing the comings and goings of staff with practiced ease. His voice was calm, his words chosen with the care of a man who understood the power of discretion. To the world, he was the perfect butler; to himself, a man balancing ambition and restraint.",
      "His speech was formal, reflecting his station, but laced with dry humor that surfaced in self-deprecating remarks. When pressed, he might say, 'Well, one does what one can, doesn’t one?'—a phrase that conveyed both resignation and a quiet determination.",
      "Beneath the polished exterior, Thomas nursed resentments. The promised legacy from Lady Beatrice had been rescinded, and a personal scandal—carefully concealed—threatened to unravel his carefully maintained reputation. These hidden vulnerabilities gave him a motive, albeit a weak one, tinged with fear and hope.",
      "His alibi was supported by multiple staff who attested to his presence overseeing dinner preparations. This collective testimony lent credibility to his claim, yet the ease of his access to all parts of the estate meant suspicion could not be ruled out.",
      "Thomas’s internal conflict was a study in contrasts. Loyalty to the estate warred with the desire for self-preservation, and the fear of exposure cast a long shadow over his every move. The investigation forced him to weigh his duties against the precariousness of his own position."
    ],
    "order": 7
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Ashcombe Manor",
    "type": "Country house estate (Manor house)",
    "place": "Devonshire village of Netherleigh",
    "country": "England",
    "summary": "Ashcombe Manor is a sprawling English country estate set amidst rolling Devonshire hills, isolated by several miles of rural farmland and dense woodlands, embodying traditional aristocratic grandeur tempered by the era's economic strains.",
    "visualDescription": "A large, stone-faced manor house with mullioned windows framed by creeping ivy; steep slate roofs punctuated by tall brick chimneys; a formal gravel forecourt bordered by clipped yews; extensive walled gardens featuring a sundial centerpiece; scattered outbuildings with weathered timber and slate; estate enclosed by a dry stone wall and dense hedgerows.",
    "atmosphere": "The manor exudes a genteel calm, with an undercurrent of restrained tension, as autumn mists curl through the gardens and the fading light casts long shadows over the gravel paths. The estate’s isolation and formal routines create a closed world where secrets linger beneath polished surfaces.",
    "paragraphs": [
      "Ashcombe Manor stands as a testament to English country tradition, its weathered stone walls and slate roofs rising against the cool Devonshire sky. Ivy clings to the north face, darkening the mullioned windows that catch the last golden rays of an autumn afternoon. The forecourt’s gravel crunches underfoot, bordered by clipped yew hedges meticulously maintained by the staff. Beyond the house, the walled gardens unfold in autumnal decay, the sundial at their center casting a frozen shadow as fog drifts low across the grounds.",
      "The estate’s layout enforces a strict order: servants’ quarters tucked discreetly away, private family wings locked and guarded, and the imposing stone walls and dense hedgerows hemming in the grounds. The air carries the faint scent of damp earth and fallen leaves, mingling with the subtle perfume of late-blooming chrysanthemums. The distant clatter of a motorcar on the gravel drive punctuates the otherwise muted sounds of rustling branches and occasional birdcalls.",
      "Inside, the manor’s dark oak-panelling and heavy draperies absorb the fading daylight, while gas lamps sputter to life in the corridors. The atmosphere is thick with the weight of unspoken tensions—economic uncertainty, shifting social hierarchies, and the looming shadow of international unrest. Each room holds its own secrets, from the locked study lined with leather-bound volumes to the servants’ hall buzzing quietly with whispered conversations.",
      "The surrounding countryside isolates Ashcombe Manor further, with the nearest village several miles distant and accessible only by narrow country lanes. Telephone lines are limited and shared, making urgent communication sporadic. The estate’s gates are locked come nightfall, restricting movement and ensuring the manor remains a closed world where every visitor and resident is scrutinized, and every shadow might conceal a clue."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Cool, damp autumn evening with intermittent fog rolling over the estate grounds",
    "timeFlow": "Three days of mounting tension culminating in the discovery of the crime",
    "mood": "An atmosphere of restrained tension beneath the veneer of genteel calm, influenced by economic hardships of the Great Depression and rising international political unrest",
    "eraMarkers": [
      "Domestic telephones with limited party-line systems",
      "Mechanical typewriters for correspondence",
      "Battery-powered and mains radios for news and entertainment",
      "Private petrol automobiles on estate and local roads",
      "Passenger trains connecting nearby towns and cities"
    ],
    "sensoryPalette": {
      "dominant": "damp earth and fallen leaves mingling with aged stone and wood",
      "secondary": [
        "faint scent of beeswax and aged leather",
        "occasional crackle of a hearth fire",
        "whispering wind through autumn hedgerows"
      ]
    },
    "paragraphs": [
      "The manor and its grounds are steeped in the damp chill of a fading autumn day. Fog drifts in low waves, blurring the edges of the formal gardens and softening the outlines of the outbuildings. The scent of wet earth and decaying leaves mingles with the faint musk of aged stone and weathered timber. Sounds are muted but for the occasional rustle of dry leaves and the distant call of a solitary owl, heightening a sense of isolation and watchfulness.",
      "Inside the house, the atmosphere is thick with the scent of beeswax polish and worn leather, the low crackle of a dying fire in the hearth, and the subdued murmur of voices behind closed doors. Time seems to slow under heavy velvet drapes and beneath dark oak beams, where the past lingers palpably. The estate’s isolation and strict routines create a closed world where every sound and scent carries significance, and secrets seem to gather like the evening fog."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Walled Garden Sundial",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "An enclosed formal garden with high stone walls covered in moss and ivy; a central stone sundial weathered by time; gravel paths lined with late autumn chrysanthemums and drooping roses; scattered wrought-iron benches under bare branches; creeping fog weaving through the garden beds.",
      "sensoryDetails": {
        "sights": [
          "fog-wrapped stone sundial",
          "moss-coated garden walls",
          "fallen amber and russet leaves",
          "drooping late-season blossoms",
          "faint moonlight through bare branches",
          "glimmering dew on gravel paths"
        ],
        "sounds": [
          "soft crunch of footsteps on gravel",
          "distant hoot of a tawny owl",
          "rustling dry leaves in chill breeze",
          "drip of moisture from stone ledges",
          "whisper of fog swirling",
          "far-off clatter of estate gates closing"
        ],
        "smells": [
          "damp earth and rotting leaves",
          "faint bitterness of frost-touched herbs",
          "cold stone warmed slightly by day’s sun",
          "musty scent of moss and ivy",
          "wet iron from garden benches",
          "lingering scent of chrysanthemums"
        ],
        "tactile": [
          "cold rough stone of sundial",
          "moist gravel underfoot",
          "crisp brittle leaves",
          "chill autumn air on skin",
          "damp ivy leaves",
          "weathered wrought iron bench"
        ]
      },
      "accessControl": "Accessible only during daylight hours; garden gates locked at dusk; estate staff monitor entry; visitors require permission; nocturnal access limited and under surveillance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-glazed sundial surface",
            "silvered raindrops on leaves",
            "mist weaving through garden paths",
            "darkened wet stone walls"
          ],
          "sounds": [
            "steady rain pattering on leaves",
            "water dripping from branches",
            "murmur of distant river",
            "soft splash of puddles"
          ],
          "smells": [
            "fresh wet earth",
            "green herbaceous dampness",
            "cold stone after rainfall",
            "musty garden soil"
          ],
          "mood": "brooding and introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light across garden beds",
            "shadows softened by cloud cover",
            "pale leaves scattered on gravel",
            "ivy darkened by moisture"
          ],
          "sounds": [
            "occasional dry leaf rustle",
            "distant church bell toll",
            "faint wind through bare branches",
            "quiet footsteps on gravel"
          ],
          "smells": [
            "earthy dampness",
            "faint herbal notes",
            "cold stone and moss",
            "decaying floral scents"
          ],
          "mood": "quiet tension beneath calm"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "silver moonlight on sundial",
            "crisp outlines of leafless branches",
            "glint of dew on iron benches"
          ],
          "sounds": [
            "soft night breeze",
            "owl calls echoing",
            "distant footsteps fading",
            "rustle of dry leaves"
          ],
          "smells": [
            "cool night air",
            "dry leaves and earth",
            "faint scent of smoke from manor chimneys",
            "chilly stone surfaces"
          ],
          "mood": "tense stillness with watchful quiet"
        }
      ],
      "paragraphs": [
        "The walled garden’s sundial stands sentinel at its center, its stone surface worn smooth by decades of weather and time. Encircled by high, moss-covered walls and tangled ivy, the garden is a hidden enclave within the estate, its formal paths now littered with brittle amber leaves and late-season blooms sagging under the weight of autumn’s chill. Fog curls low, weaving through the flowerbeds and softening the sharp edges of wrought-iron benches and stone ledges.",
        "At dusk, the garden becomes a place of quiet secrets. The sundial’s frozen shadow stretches long across the gravel, and the damp earth exhales the scent of decay mingled with faint herbal notes. Sounds are muted to whispers—the soft crunch of footsteps, the distant hoot of an owl, the drip of moisture from stone surfaces. Access is strictly controlled; gates are locked at twilight, and only trusted staff or visitors with permission may linger here after dark."
      ]
    },
    {
      "id": "library",
      "name": "Manor Library",
      "type": "interior",
      "purpose": "Clue discovery and private reflection",
      "visualDetails": "A spacious room lined with floor-to-ceiling bookshelves filled with leather-bound volumes; dark oak panelling with carved motifs; a large mullioned window overlooking the gardens; a heavy mahogany desk cluttered with papers and a mechanical typewriter; green-shaded banker’s lamps casting pools of light; Persian rugs muffling footsteps.",
      "sensoryDetails": {
        "sights": [
          "glossy leather-bound books",
          "glowing banker’s lamps",
          "dust motes in window light",
          "stacked papers and ledgers",
          "deep mahogany wood grains",
          "rich Persian carpet patterns"
        ],
        "sounds": [
          "soft turning of pages",
          "quiet scratch of pen on paper",
          "faint ticking of ornate clock",
          "occasional creak of settling wood",
          "murmur of distant voices",
          "rustle of heavy curtains"
        ],
        "smells": [
          "aged leather and paper",
          "faint scent of cedarwood polish",
          "musty parchment",
          "subtle tobacco smoke",
          "warm beeswax polish",
          "dry ink and dust"
        ],
        "tactile": [
          "smooth leather book spines",
          "cool brass lamp bases",
          "rough textured paper edges",
          "soft velvet curtain folds",
          "polished wood desk surface",
          "woven rug fibers"
        ]
      },
      "accessControl": "Library locked after dinner; access granted mostly to family and select guests; staff enter only for cleaning during daytime; restricted entry enforces privacy and evidence preservation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through rain-streaked windows",
            "glossy wet leaves visible outside",
            "papers slightly damp at edges"
          ],
          "sounds": [
            "steady rain tapping windowpanes",
            "soft scratch of pen on paper",
            "distant thunder rumble"
          ],
          "smells": [
            "damp earth from open window",
            "fresh rain mingled with old books",
            "slight mustiness from humidity"
          ],
          "mood": "reflective and subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat, muted daylight",
            "shadows softened by cloud cover",
            "glimmer off polished wood"
          ],
          "sounds": [
            "quiet ticking clock",
            "pages turning slowly",
            "soft footsteps on thick rug"
          ],
          "smells": [
            "warm beeswax and dust",
            "faint pipe tobacco",
            "aged paper and ink"
          ],
          "mood": "contemplative with underlying unease"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden lamp light pooling on desk",
            "deep shadows in bookcases",
            "moonlight slanting through window"
          ],
          "sounds": [
            "soft crackle from fireplace",
            "rustling curtains",
            "distant voices muffled downstairs"
          ],
          "smells": [
            "warm beeswax and wood smoke",
            "faint cigar smoke",
            "dry parchment"
          ],
          "mood": "quiet tension and watchfulness"
        }
      ],
      "paragraphs": [
        "The manor library is a sanctuary of knowledge and quiet reflection, its walls lined with shelves of venerable leather-bound tomes. Dark oak panelling carved with floral motifs envelops the room, while a large mullioned window frames the fading gardens outside. The heavy mahogany desk bears the clutter of correspondence—stacked papers, a mechanical typewriter, and ink pots—bathed in the soft glow of green-shaded banker’s lamps.",
        "Here, the scent of aged leather and beeswax polish mingles with the faint trace of tobacco smoke, weaving a tapestry of time and memory. The room’s thick Persian rugs absorb footsteps, muffling sound and encouraging whispered confidences. Access is carefully controlled; after dinner the library is locked, preserving its privacy and the fragile clues concealed within its volumes and papers."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants’ Hall",
      "type": "interior",
      "purpose": "Gathering space and informal exchanges",
      "visualDetails": "A modest room with whitewashed walls, exposed wooden beams, and a large stone hearth; sturdy wooden tables and benches; a well-worn linoleum floor; coat hooks along one wall; a small sideboard with crockery and a kettle; dim gas lighting overhead.",
      "sensoryDetails": {
        "sights": [
          "flickering hearth flames",
          "plain wooden furniture",
          "steam rising from enamel mugs",
          "coats hanging on hooks",
          "worn floorboards near doorway"
        ],
        "sounds": [
          "murmured conversations",
          "clink of crockery",
          "soft laughter and sighs",
          "footsteps on linoleum",
          "hissing of gas lamps",
          "crackling firewood"
        ],
        "smells": [
          "strong tea and boiled potatoes",
          "smoky hearth fire",
          "stale bread and cooking fat",
          "damp woollen coats",
          "faint soap and starch",
          "earthy scent from boots"
        ],
        "tactile": [
          "rough wooden bench surfaces",
          "warm enamel mugs",
          "coarse woollen fabric",
          "smooth stone hearth edge",
          "cool linoleum floor",
          "scuffed leather boots"
        ]
      },
      "accessControl": "Restricted to household staff; family and guests forbidden; entry times governed by strict schedules; informal hub for sharing news and gossip among servants.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through small windows",
            "steam rising from hot mugs",
            "wet coats dripping on hooks"
          ],
          "sounds": [
            "steady rain tapping on roof",
            "soft chatter over breakfast",
            "crackling hearth fire"
          ],
          "smells": [
            "wet earth and peat smoke",
            "strong tea and fresh bread",
            "damp wool and soap"
          ],
          "mood": "busy but subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim gas lamp glow",
            "shadows pooling in corners",
            "empty mugs on tables"
          ],
          "sounds": [
            "quiet footsteps",
            "soft rustling of cloth",
            "distant clatter of kitchenware"
          ],
          "smells": [
            "lingering cooking smells",
            "smoky hearth embers",
            "faint starch and soap"
          ],
          "mood": "tired quietness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm firelight flickering",
            "dark shadows on walls",
            "glossy wooden tables"
          ],
          "sounds": [
            "soft laughter",
            "low voices",
            "crackling fire"
          ],
          "smells": [
            "freshly brewed tea",
            "burning peat",
            "earthy damp coats"
          ],
          "mood": "relaxed camaraderie"
        }
      ],
      "paragraphs": [
        "The servants’ hall is a practical, unpretentious space where the estate’s staff gather between duties. Whitewashed walls and exposed beams frame a large stone hearth, its fire crackling warmly against the chill. Sturdy wooden tables and benches show the wear of daily use, while coats hang in a row along one wall, shedding dampness and earth from outdoor work.",
        "Here, the scent of strong tea, boiled potatoes, and peat smoke mingles with the faint sharpness of soap and starch. Gas lamps cast a dim glow, creating deep shadows and a cozy atmosphere where whispered gossip and quiet laughter flow freely. Access is strictly limited to servants, maintaining the social boundaries that define life within Ashcombe Manor."
      ]
    },
    {
      "id": "estate_gatehouse",
      "name": "Estate Gatehouse",
      "type": "transitional",
      "purpose": "Entry point and security control",
      "visualDetails": "A small stone building with a steep tiled roof and narrow windows; heavy oak doors reinforced with iron studs; a gravel driveway leading to wrought-iron gates flanked by tall stone pillars; lanterns mounted on either side of the entrance; a small enclosed courtyard with a low stone wall.",
      "sensoryDetails": {
        "sights": [
          "weathered stone walls",
          "flickering lantern light",
          "iron-studded oak doors",
          "shadowed gravel driveway",
          "rusted gate hinges",
          "glossy black gate pillars"
        ],
        "sounds": [
          "clank of iron latch",
          "gravel crunching under wheels",
          "distant barking of hounds",
          "soft footsteps on stone",
          "wind whistling through gateposts",
          "creak of wrought-iron gates"
        ],
        "smells": [
          "damp stone and moss",
          "faint smoke from lanterns",
          "leather harness oils",
          "wet gravel and earth",
          "smoke-tinged cold air",
          "horse sweat and hay"
        ],
        "tactile": [
          "cold iron gate bars",
          "rough stone wall texture",
          "smooth worn oak door",
          "chilly night air",
          "coarse gravel underfoot",
          "weathered leather reins"
        ]
      },
      "accessControl": "Gate locked at dusk; guarded by estate staff; visitors must be announced and approved; access strictly controlled to prevent unauthorized entry or exit; patrols frequent the surrounding perimeter.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-slicked stone surfaces",
            "glossy wet gravel",
            "mist clinging to gate pillars"
          ],
          "sounds": [
            "steady rain tapping roof",
            "water dripping from eaves",
            "soft distant hoofbeats"
          ],
          "smells": [
            "wet moss and earth",
            "leather dampened by rain",
            "smoky lantern oil"
          ],
          "mood": "alert and watchful"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light",
            "shadowless stone walls",
            "closed heavy doors"
          ],
          "sounds": [
            "occasional gate creak",
            "rustling leaves",
            "distant voices from manor"
          ],
          "smells": [
            "cold damp stone",
            "faint smoke from lanterns",
            "earth and leather"
          ],
          "mood": "guarded and restrained"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "lanterns casting golden pools",
            "sharp shadows from gateposts",
            "glimmering ironwork"
          ],
          "sounds": [
            "gates creaking slowly",
            "night wind sighing",
            "soft footfalls on gravel"
          ],
          "smells": [
            "cool night air",
            "smoke from lanterns",
            "earth and leather"
          ],
          "mood": "tense vigilance"
        }
      ],
      "paragraphs": [
        "The estate gatehouse stands as the first line of defense for Ashcombe Manor, a stout stone building with narrow windows that peer out onto the winding gravel drive. Heavy oak doors, reinforced with iron studs, guard the entrance, flanked by tall stone pillars supporting wrought-iron gates that creak softly in the wind. Lanterns mounted on either side cast flickering pools of light, lending the courtyard a shadowed, watchful presence.",
        "Access is tightly controlled here; the gates are locked at dusk, and only those with prior approval may pass through. The scent of damp stone and moss mingles with the faint smoke of oil lanterns and the earthy tang of wet gravel. The gatehouse is a hub of alert vigilance, where every sound and shadow is scrutinized to prevent unauthorized entry or exit."
      ]
    }
  ],
  "note": "",
  "cost": 0.007270212,
  "durationMs": 47671
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1931,
    "month": "June",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "generally mild with cool mornings and evenings",
      "occasional drizzles and intermittent fog patches over the countryside",
      "early summer warmth tempered by dampness in the air"
    ],
    "daylight": "Long summer days with sunrise around 4:45 am and sunset near 9:15 pm, providing extended twilight and lingering daylight into late evening",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded and the household settles into quieter routines",
    "holidays": [
      "Whit Monday (Pentecost Monday) observed early June in some regions",
      "Empire Day celebrations lingering in public memory, though less prominent"
    ],
    "seasonalActivities": [
      "early morning garden tending and rose pruning",
      "afternoon croquet matches on the lawn",
      "evening strolls along shaded woodland paths of the estate"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "lightweight wool or flannel suits in muted greys and tans",
        "single-breasted jackets with narrow lapels",
        "linen dress shirts with detachable collars"
      ],
      "casual": [
        "plus-fours or knickerbockers paired with argyle socks",
        "soft-crowned trilby hats",
        "cotton polo shirts or light knit sweaters"
      ],
      "accessories": [
        "silk neckties with geometric patterns",
        "leather brogues polished to a shine",
        "pocket watches with chain fobs"
      ]
    },
    "womensWear": {
      "formal": [
        "light silk or rayon day dresses featuring dropped waists and pleated skirts",
        "delicate lace collars and subtle embroidery detailing",
        "straw cloche hats adorned with ribbons or small flowers"
      ],
      "casual": [
        "calico or cotton print frocks with peter pan collars",
        "knitted cardigans in pastel shades",
        "flat leather T-strap shoes"
      ],
      "accessories": [
        "beaded handbags",
        "gloves of kid leather or cotton",
        "delicate pearl necklaces and simple brooches"
      ]
    },
    "trendsOfTheMoment": [
      "embrace of simpler, less ostentatious styles due to economic pressures",
      "rise of sportswear influencing daywear silhouettes",
      "use of rayon as an affordable alternative to silk"
    ],
    "socialExpectations": [
      "men expected to maintain impeccable grooming and conservative dress even in casual settings",
      "women to balance modesty with emerging freedom in fashion choices",
      "strict adherence to dress codes for different times of day and social occasions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Ongoing global economic strain from the Great Depression deepening unemployment and social unrest",
      "Chancellor Brüning’s austerity measures in Germany heightening tensions across Europe",
      "Britain grappling with budget cuts and debates over public spending and unemployment relief"
    ],
    "politicalClimate": "A tense and uncertain political atmosphere marked by rising extremist movements in Europe, cautious conservatism in Britain, and increasing debate over economic policy responses",
    "economicConditions": "Widespread economic hardship with high unemployment rates, depressed agricultural prices affecting rural estates, and cautious consumer spending among middle and upper classes",
    "socialIssues": [
      "Class divisions exacerbated by economic difficulties",
      "Growing concerns about unemployment and social welfare",
      "Debates on women’s roles as economic contributors versus traditional domestic expectations"
    ],
    "internationalNews": [
      "Japan’s invasion of Manchuria in 1931 causing international condemnation",
      "The League of Nations struggling to enforce peace and economic cooperation"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Duke Ellington – 'Mood Indigo'",
        "Bing Crosby – 'At Your Command'",
        "Al Bowlly – 'Love Is the Sweetest Thing'"
      ],
      "films": [
        "Dr. Jekyll and Mr. Hyde (1931)",
        "City Lights (1931) starring Charlie Chaplin",
        "Mata Hari (1931) with Greta Garbo"
      ],
      "theater": [
        "Noël Coward’s latest revues playing in London",
        "West End productions of classic comedies and emerging modern dramas",
        "Local amateur dramatics and garden parties with musical interludes"
      ],
      "radio": [
        "BBC National Programme delivering news and variety shows",
        "Radio comedy series such as 'ITMA' beginning to gain popularity",
        "Classical music broadcasts and live orchestral concerts"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s 'The Sittaford Mystery' (1931)",
        "Virginia Woolf’s 'The Waves' (1931)",
        "John Galsworthy’s 'End of the Chapter' (1931)"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Modernist literature",
        "Social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "Improved radio receivers becoming household staples",
        "Early development of talking motion pictures",
        "Advances in automotive engineering with more affordable cars"
      ],
      "commonDevices": [
        "Domestic telephones often shared on party lines",
        "Mechanical typewriters for correspondence and administration",
        "Battery-powered radios for evening entertainment"
      ],
      "emergingTrends": [
        "Increased household electrification in rural areas",
        "Growth of cinema-going as popular leisure",
        "Expansion of mass media influencing social attitudes"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 3 pence",
        "Pint of milk: 1 penny",
        "Taxi ride across town: 2 shillings"
      ],
      "commonActivities": [
        "Afternoon tea in drawing rooms or garden terraces",
        "Sunday church services followed by family outings",
        "Estate staff completing daily maintenance and groundskeeping"
      ],
      "socialRituals": [
        "Formal dinner parties with strict seating arrangements",
        "Morning calls and visits by ladies to maintain social connections"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Firm class distinctions govern behavior and speech, especially within estate environments",
      "Servants maintain strict deference and discretion in the presence of gentry"
    ],
    "gender": [
      "Women increasingly balancing traditional domestic roles with subtle social independence",
      "Men expected to demonstrate stoicism and control over emotions",
      "Social mobility limited but slowly evolving amid economic pressures"
    ],
    "race": [
      "Prevailing British imperial attitudes with little public discourse on racial equality",
      "Colonial subjects often viewed through paternalistic or exoticized lenses"
    ],
    "generalNorms": [
      "Etiquette and formality guide most social interactions",
      "Privacy and reputation are highly valued within upper-class circles",
      "Discretion in discussing politics or scandal is expected in mixed company"
    ]
  },
  "atmosphericDetails": [
    "The damp earth and clipped hedges emit a faint scent of moss and wet stone as intermittent fog curls around wrought-iron gates",
    "Crickets chirp steadily while the distant hoot of an owl punctuates the heavy silence of the manor’s grounds at night",
    "Faint strains of a gramophone playing a jazz record float through open windows, mixing with the soft rustle of silk dresses and the muted clink of china"
  ],
  "paragraphs": [
    "June 1931 brings with it the subtle warmth of early summer to the English countryside, though evenings carry a cool dampness that seeps through the manor’s thick stone walls. The estate’s gardens are lush with roses and early blooms, tended meticulously in the morning mist before the sun climbs high. Long daylight hours afford the household ample time for outdoor pastimes such as croquet matches on the lawn or quiet woodland walks, even as intermittent fog rolls over the grounds, lending an ephemeral, ghostly quality to the sprawling estate. This seasonal backdrop contrasts starkly with the underlying tension felt by the residents, shaped by the harsh realities of the Great Depression and the uneasy political rumblings from abroad.",
    "Fashion in June 1931 reflects a restrained elegance born from economic necessity and shifting social mores. Men favor lighter wool suits and knickerbockers for casual estate wear, paired with carefully polished brogues and silk neckties that hint at their social standing without extravagance. Women balance delicate silk day dresses with practical straw cloche hats and beaded handbags, embodying a blend of modesty and subtle glamour. These sartorial choices, governed by strict codes of etiquette, emphasize the desire to maintain dignity and order despite the pervasive uncertainty of the times. The manor’s formal dinners and afternoon teas remain occasions for meticulous dress and adherence to social expectations.",
    "Life within the country house estate in June 1931 is a complex dance of tradition and undercurrents of change. Technological comforts such as party-line telephones and battery-powered radios link the household to the wider world, broadcasting news of political upheaval in Europe and the steady impact of economic austerity at home. Staff move efficiently through their routines, ever mindful of the rigid class hierarchy that governs interactions with the gentry. Meanwhile, the cultural sphere offers brief respite through popular jazz records, cinema outings, and detective novels by authors like Agatha Christie, whose recent work resonates with a public eager for distraction. Social rituals such as formal visits and dinner parties continue to reinforce status and propriety, even as the shadows of uncertainty lengthen in the late evening fog."
  ],
  "note": "Context crafted specifically for June 1931 to capture the interplay of early summer atmosphere, Great Depression pressures, and the genteel but tense world of a British country estate.",
  "cost": 0.0033988959999999993,
  "durationMs": 23851
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst the rigid class divisions and formal routines of a secluded English manor estate during economic and political uncertainty, a diverse group bound by duty and social expectation faces a sudden crisis that disrupts their carefully maintained order.",
  "era": {
    "decade": "1930s",
    "socialStructure": "A strict hierarchy governs interactions between the gentry, senior servants, and staff, emphasizing deference to authority and adherence to formal daily schedules within the manor."
  },
  "setting": {
    "location": "A large, traditionally styled English manor with extensive grounds, multiple outbuildings, and formal gardens, isolated several miles from the nearest village.",
    "institution": "Country house estate (Manor house)",
    "weather": "Cool, damp autumn evening with intermittent fog rolling over the estate grounds"
  },
  "castAnchors": [
    "Inspector Harold Wren",
    "Lady Beatrice Ellsworth",
    "Charles Pembroke",
    "Margaret Huxley",
    "Simon Clarkson",
    "Eleanor Fairchild",
    "Thomas Granger"
  ],
  "theme": "A classic murder mystery exploring the tensions beneath genteel calm, where social expectations and isolation heighten suspicion and challenge loyalties."
}

### LOCKED_FACTS
[
  {
    "id": "ambient_temperature",
    "value": "thirty-one degrees Fahrenheit",
    "description": "Recorded temperature on the garden wall thermometer at morning time of murder"
  },
  {
    "id": "victim_watch_time",
    "value": "a quarter past ten",
    "description": "Stopped time on victim’s pocket watch found on body"
  },
  {
    "id": "observed_sundial_shadow",
    "value": "twenty minutes past ten",
    "description": "Apparent solar time indicated by the sundial’s shadow at murder time"
  },
  {
    "id": "murder_time_estimate",
    "value": "ten minutes to eleven",
    "description": "Inferred actual time of death based on combined clues"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 24,
  "countsByPlacement": {
    "early": 7,
    "mid": 16,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 23,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_thermometer_reading",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_stopped_watch",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_shadow_time_contradiction",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_charles_alibi_conflict",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_victim_before_quarter_past_ten_contradiction",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_sundial_warping",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_physical_evidence_contradiction",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_struck_wound_observation",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_comparing_watch_and_sundial",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_charles_pembroke",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_charles_premeditation_observation",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_housekeeper_alibi",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_servants_schedule",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_footprint_moisture",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_gardener_testimony",
      "placement": "mid",
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
      "id": "clue_witness_timing_conflict",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_vehicle_log",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_staff_witness",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_argument_context",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "physical"
    },
    {
      "id": "clue_witness_statements",
      "placement": "early",
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
