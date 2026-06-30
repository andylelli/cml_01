# Actual Prompt Record

- Run ID: `run_bee5da27-8113-4876-9b8e-7807ad123346`
- Project ID: `proj_24cb9046-5c82-4239-9988-c1d26fe1ad16`
- Timestamp: `2026-06-30T08:35:48.869Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `c269f0f0823071da`

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
    "title": "The Hearth's Slow Betrayal",
    "author": "CML Specialist",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Basic forensic toxicology and fingerprinting available",
        "Mechanical clocks common but no electronic timekeeping",
        "Social hierarchies strictly enforced in country estates",
        "Formal daily schedules and meal times observed",
        "Limited telephone and telegram communication"
      ]
    },
    "setting": {
      "location": "Langley Manor, Little Middleton, Yorkshire",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "country house estate (manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "delayed locked-room death by blunt force"
    }
  },
  "death_method": "struck with a heavy fireplace poker",
  "cast": [
    {
      "name": "Edith Langley",
      "age_range": "50s",
      "role_archetype": "victim",
      "relationships": [
        "Wife of Giles Langley",
        "Family matriarch"
      ],
      "public_persona": "Respected and dignified lady of the manor",
      "private_secret": "Was aware of serious financial troubles",
      "motive_seed": "Discovered incriminating evidence of blackmail against her",
      "motive_strength": "high",
      "alibi_window": "Locked alone in her room from quarter past nine to ten",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Private quarters",
        "Locked room access"
      ],
      "behavioral_tells": [
        "Reserved",
        "Often late to dinner"
      ],
      "stakes": "Risked estate ruin and social disgrace",
      "evidence_sensitivity": [
        "Lock dust",
        "Fireplace temperature",
        "Mantel thermometer"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Giles Langley",
      "age_range": "50s",
      "role_archetype": "Family patriarch",
      "relationships": [
        "Husband of Edith Langley",
        "Father of Agnes Fairchild"
      ],
      "public_persona": "Stern but fair landowner",
      "private_secret": "Struggling with debts and secret gambling losses",
      "motive_seed": "Feared exposure of financial ruin by Edith",
      "motive_strength": "moderate",
      "alibi_window": "In the library at quarter to ten",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Manor hallways",
        "Library access"
      ],
      "behavioral_tells": [
        "Tense",
        "Avoids direct eye contact"
      ],
      "stakes": "Estate survival and reputation",
      "evidence_sensitivity": [
        "Library clock",
        "Witness testimony"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Agnes Fairchild",
      "age_range": "30s",
      "role_archetype": "Daughter",
      "relationships": [
        "Daughter of Giles and Edith Langley"
      ],
      "public_persona": "Socialite and aspiring artist",
      "private_secret": "Secret engagement to Reggie Harcourt",
      "motive_seed": "Feared Edith would forbid marriage",
      "motive_strength": "moderate",
      "alibi_window": "Seen in the garden at quarter past nine",
      "access_plausibility": "low",
      "opportunity_channels": [
        "Gardens",
        "Servants' corridors"
      ],
      "behavioral_tells": [
        "Nervous laughter",
        "Avoids discussing plans"
      ],
      "stakes": "Love and personal freedom",
      "evidence_sensitivity": [
        "Garden sundial",
        "Witness accounts"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Reggie Harcourt",
      "age_range": "30s",
      "role_archetype": "Guest and fiancé",
      "relationships": [
        "Engaged to Agnes Fairchild",
        "Close family friend"
      ],
      "public_persona": "Charming and confident gentleman",
      "private_secret": "Has gambling debts unknown to family",
      "motive_seed": "Wished to silence Edith who threatened to reveal his debts",
      "motive_strength": "high",
      "alibi_window": "Claimed to be in the stables at quarter past nine",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Stables",
        "Servants' corridors"
      ],
      "behavioral_tells": [
        "Impatient",
        "Defensive when questioned"
      ],
      "stakes": "Financial survival and reputation",
      "evidence_sensitivity": [
        "Stable clock",
        "Footwear marks"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Mabel Thorne",
      "age_range": "40s",
      "role_archetype": "Housekeeper",
      "relationships": [
        "Long-time staff member",
        "Loyal to family"
      ],
      "public_persona": "Stern but reliable housekeeper",
      "private_secret": "Dislikes Reggie Harcourt intensely",
      "motive_seed": "Resents Reggie's influence on Agnes",
      "motive_strength": "low",
      "alibi_window": "Busy in the kitchen from quarter past nine",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Kitchen",
        "Household corridors"
      ],
      "behavioral_tells": [
        "Sharp-eyed",
        "Quick-tempered"
      ],
      "stakes": "Job security and household order",
      "evidence_sensitivity": [
        "Kitchen logs",
        "Servants' testimonies"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Felix Dryden",
      "age_range": "40s",
      "role_archetype": "Detective",
      "relationships": [
        "Family friend and investigator"
      ],
      "public_persona": "Methodical and sharp investigator",
      "private_secret": "Knows Giles Langley's gambling secret",
      "motive_seed": "None, acts professionally",
      "motive_strength": "none",
      "alibi_window": "Present throughout investigation",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Entire manor"
      ],
      "behavioral_tells": [
        "Calm",
        "Inquisitive"
      ],
      "stakes": "Justice and truth",
      "evidence_sensitivity": [
        "All case evidence"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Reggie Harcourt"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "At Langley Manor during a damp spring evening, Edith Langley is found dead in her locked room, struck fatally with a fireplace poker. All signs suggest the locked door was forced open before the murder, but the timing of events and witness statements conflict. The family and guests each have motives and alibis that seem to rule them out. Detective Felix Dryden must unravel the truth hidden within the manor's rigid schedules, the hearth’s slow thermal lock, and the deceptive timing of events to uncover the killer."
    },
    "accepted_facts": [
      "Edith Langley was found dead in her locked room with a fatal blow from the fireplace poker.",
      "The door was locked from inside and the bolt was disturbed before the time witnesses claimed entry.",
      "The hearth fire was barely lit at the claimed entry time, as noted by the housekeeper and mantel thermometer.",
      "Witnesses claim the door was forced open shortly after quarter past nine.",
      "Reggie Harcourt claimed to be at the stables at quarter past nine, but stable clock shows inconsistent times.",
      "Agnes Fairchild was seen in the garden around quarter past nine.",
      "Giles Langley was in the library around quarter to ten, confirmed by his watch and the library clock.",
      "Mabel Thorne was busy in the kitchen during the alleged murder time, supported by kitchen logs."
    ],
    "inferred_conclusions": [
      "The door bolt could not have been forced open at the stated time due to the thermal expansion delay.",
      "The actual murder time was later than witnesses assumed, after the hearth had heated the bolt sufficiently.",
      "Reggie's alibi is weakened by stable clock inconsistencies and log contradictions.",
      "The sundial shadow in the garden confirms Agnes's presence at the time claimed but rules her out for the murder timing.",
      "Giles's alibi is supported by mechanical and social timing evidence.",
      "Mabel's kitchen presence is verified, excluding her from opportunity."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The brass bolt securing Edith's door was designed to expand and unlock gradually as the hearth fire warmed. The fire was lit shortly before quarter past nine but took at least an hour to heat the bolt enough to release it. Witnesses mistakenly believed the door was forced open immediately after lighting the fire, creating a false timeline. The culprit exploited this by committing the murder after the door unlocked naturally, giving the illusion of forced entry earlier.",
      "delivery_path": [
        {
          "step": "Culprit lit the hearth fire shortly before quarter past nine, intending to delay the door bolt release."
        },
        {
          "step": "By timing the fire's gradual heating, culprit ensured bolt would unlock about an hour later without forced entry."
        },
        {
          "step": "Culprit entered the room after the bolt released naturally and struck Edith fatally with the poker."
        },
        {
          "step": "Witnesses' mistaken timing of forced entry concealed the real murder time."
        }
      ]
    },
    "outcome": {
      "result": "The culprit's manipulation of the door bolt timing and misleading witness statements concealed the true murder time, allowing Reggie Harcourt to commit the crime under the guise of a locked room and false timeline."
    }
  },
  "false_assumption": {
    "statement": "The door bolt was forced open immediately after the hearth fire was lit, indicating the murder occurred shortly after quarter past nine.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses noticed the door unlocked shortly after the fire lighting and assumed immediate forced entry, supported by disturbed lock dust and hurried footsteps.",
    "what_it_hides": "The door bolt actually released much later due to thermal expansion, shifting the murder time to nearly an hour after the fire was lit."
  },
  "false_solution": {
    "accused_suspect": "Giles Langley",
    "supporting_points": [
      "He had motive to silence Edith due to financial ruin fears.",
      "His alibi in the library is not strongly corroborated beyond his own watch and a single clock."
    ],
    "the_one_flaw": "The timing of the door bolt release and hearth temperature contradict the immediate forced entry needed for Giles to have committed the murder at the alleged time.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Giles Langley's watch stopped briefly during the evening, causing confusion over his exact whereabouts.",
      "points_at_suspect": "Giles Langley",
      "innocent_explanation": "The watch was stopped due to mechanical issues unrelated to the murder; library clock and servant testimony confirm Giles's presence.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Footwear marks near the stables suggest someone hurried away at the time Reggie claimed to be there.",
      "points_at_suspect": "Reggie Harcourt",
      "innocent_explanation": "Marks were made by stable hands earlier in the day; no definitive proof ties Reggie to the murder scene at that time.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Giles Langley",
      "Agnes Fairchild",
      "Reggie Harcourt",
      "Mabel Thorne"
    ],
    "rationale": "The manor's isolation, locked doors, and staff testimony ensure only these residents and guests had the opportunity and means to commit the murder. No outsiders had access or motive."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Fire lit shortly before quarter past nine",
        "Library clock shows quarter to ten",
        "Stable clock manipulated but shows roughly quarter past nine"
      ],
      "windows": [
        "Door bolt releases only after one hour of hearth heating",
        "Murder must occur after door bolt unlocks",
        "Alibis span between quarter past nine and quarter to ten"
      ],
      "contradictions": [
        "Witnesses claim forced entry immediately after fire lighting but hearth temperature and soot line contradict early bolt release",
        "Stable clock time contradicts Reggie's claimed stable presence",
        "Library clock and Giles's watch differ from suspect statements"
      ]
    },
    "access": {
      "actors": [
        "Giles Langley",
        "Agnes Fairchild",
        "Reggie Harcourt",
        "Mabel Thorne"
      ],
      "objects": [
        "Fireplace poker",
        "Locked bedroom door with brass bolt",
        "Hearth fire and mantel thermometer"
      ],
      "permissions": [
        "Family and guests access to manor rooms",
        "Staff access to kitchens and stables"
      ]
    },
    "physical": {
      "laws": [
        "Thermal expansion of brass bolt delays unlocking",
        "Fireplace heating is gradual, not instantaneous",
        "Soot deposition indicates fire duration and intensity"
      ],
      "traces": [
        "Fine soot line on bolt plate",
        "Polished inner edge wear on bolt",
        "Mantel thermometer gradual temperature rise"
      ]
    },
    "social": {
      "trust_channels": [
        "Servants' coordinated testimonies",
        "Family formal meal and activity schedules"
      ],
      "authority_sources": [
        "Housekeeper's testimony on fire lighting",
        "Butler's report on door bolt condition"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The mantel thermometer shows a gradual temperature rise, reaching a peak only about an hour after the hearth fire was lit.",
        "correction": "The door bolt could not have released immediately after the fire lighting since thermal expansion requires sustained heat over time.",
        "effect": "Narrows the possible murder time to at least an hour after fire lighting, eliminating suspects with alibis during that period.",
        "required_evidence": [
          "Mantel thermometer readings from the hearth",
          "Housekeeper Mabel Thorne's testimony about fire lighting time",
          "Physical analysis of soot line on the brass bolt latch"
        ],
        "reader_observable": true
      },
      {
        "observation": "Stable clock records and horse exercise logs show activity inconsistent with Reggie Harcourt's claimed presence at the stables at quarter past nine.",
        "correction": "Reggie's alibi is unreliable, making him a prime suspect for having opportunity to be near the manor during the murder window.",
        "effect": "Eliminates Reggie's alibi, opening the opportunity window for him.",
        "required_evidence": [
          "Stable clock time readings",
          "Horse exercise logs from stable hands",
          "Reggie Harcourt's own testimony claiming stable presence"
        ],
        "reader_observable": true
      },
      {
        "observation": "A fine soot line on the door bolt's latch plate shows uneven heating with a polished inner edge, consistent with gradual thermal expansion rather than forced immediate unlocking.",
        "correction": "The door bolt was not forced open quickly but unlocked naturally after sufficient heat, contradicting witness statements of immediate forced entry.",
        "effect": "Eliminates suspects relying on immediate forced entry timelines, particularly Giles Langley.",
        "required_evidence": [
          "Close-up inspection of brass bolt latch",
          "Butler's report on door bolt dust disturbance",
          "Witness statements claiming immediate forced entry"
        ],
        "reader_observable": true
      },
      {
        "observation": "The garden sundial shadow angle and length recorded by servants at quarter past nine contradict their claims that Edith was alive well past that time.",
        "correction": "Edith was already incapacitated or dead before noon, supporting the delayed murder timing after the hearth unlocked the door bolt.",
        "effect": "Excludes Agnes Fairchild and others with alibis in the garden at quarter past nine from suspicion during the murder time window.",
        "required_evidence": [
          "Garden sundial shadow sketch and measurements",
          "Servants' statements about seeing Edith alive after quarter past nine",
          "Weather diary noting clearing of overcast sky after murder"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "constraint_proof",
    "design": "Compare the mantel thermometer temperature curve and soot line on the door bolt latch against the witness testimony of forced entry time, combined with stable clock logs and horse exercise records, to demonstrate that the door bolt could not have been forced open at the stated time and Reggie Harcourt's alibi is false. This controlled timing reconstruction exposes the impossibility of the false timeline and singles out Reggie as the only suspect present during the actual murder window.",
    "knowledge_revealed": "Proves the door bolt's delayed unlocking due to thermal expansion and invalidates the stated forced entry time, confirming Reggie's presence and opportunity to commit the murder after the bolt released naturally.",
    "pass_condition": "Reggie's claimed alibi fails the timing constraints established by physical evidence and logs, and the door bolt could not have opened before the fire sufficiently heated it.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_4",
      "clue_1",
      "clue_fp_contradiction_step_2",
      "clue_5",
      "clue_mantel_thermometer"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The mantel thermometer reading and soot line on the bolt (early clues) establish the delayed unlocking mechanism. Step 2: Stable clock and horse exercise logs (mid clues) reveal Reggie's alibi inconsistency. Step 3: Bolt latch wear and witness statements (mid clues) contradict the forced entry timing, eliminating Giles. Step 4: Garden sundial and weather diary (early clues) confirm time of incapacitation, excluding Agnes. The discriminating test synthesizes these known facts to identify Reggie as the culprit."
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
      "mid_clues_min": 2,
      "late_clues_min": 0
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
        "Execute the timing reconstruction comparing mantel thermometer, soot line, and stable clock logs",
        "Observe Reggie Harcourt's inability to justify his stable presence at the critical time",
        "Draw conclusion about Reggie's guilt based on timing contradictions"
      ],
      "test_type": "constraint_proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Giles Langley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Verified library presence by clock and servant testimony",
        "supporting_clues": [
          "clue_library_clock",
          "clue_servant_testimony_giles"
        ]
      },
      {
        "suspect_name": "Agnes Fairchild",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Garden sundial shadow timing and witness accounts confirm innocence",
        "supporting_clues": [
          "clue_garden_sundial",
          "clue_servant_witness_agnes"
        ]
      },
      {
        "suspect_name": "Mabel Thorne",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Kitchen logs and servants' testimony confirm kitchen presence",
        "supporting_clues": [
          "clue_kitchen_log",
          "clue_servant_testimony_mabel"
        ]
      },
      {
        "suspect_name": "Edith Langley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: Locked alone in her room from quarter past nine to ten",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with physical evidence of door bolt timing and stable clock contradictions"
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_10",
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
        "clue_id": "clue_garden_sundial",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Measurement and drawing of garden sundial shadow"
      },
      {
        "clue_id": "clue_library_clock",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Observation of library clock and Giles's watch"
      },
      {
        "clue_id": "clue_soot_line_bolt",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Close inspection of door bolt soot and wear"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Corroborated elimination"
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
        "clue_id": "clue_culprit_direct_reggie_harcourt",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_kitchen_log",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Kitchen activity log showing Mabel's presence"
      },
      {
        "clue_id": "clue_mantel_thermometer",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation of hearth thermometer readings"
      },
      {
        "clue_id": "clue_servant_testimony_giles",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Servants confirm Giles's presence in library"
      },
      {
        "clue_id": "clue_servant_testimony_mabel",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Servants confirm Mabel's kitchen presence"
      },
      {
        "clue_id": "clue_servant_witness_agnes",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Servants note Agnes in garden"
      },
      {
        "clue_id": "clue_stable_clock_logs",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Stable clock inspection and horse exercise logs review"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Edith Langley",
    "summary": "The venerable matriarch of Langley Manor, Edith is a bastion of tradition whose discovery of a family scandal threatens to unravel the legacy she has long protected.",
    "publicPersona": "Edith Langley, aged between fifty-five and sixty-five, commands the Langley estate with an iron will softened only by her resolute commitment to family values and social propriety. To the outside world, she is the very embodiment of dignity, a guardian of heritage who refuses to allow modernity to erode the venerable customs of Yorkshire’s landed gentry. Her sharp gaze and deliberate manner convey a woman accustomed to control, whose word is law within the manor’s ancient walls.",
    "privateSecret": "Beneath her composed exterior, Edith harbored a secret that gnawed at her conscience: the discovery of a forged will dating back decades, a document that secured the family fortune under false pretenses. She intended to expose this scandal, no matter the cost, believing that truth must ultimately prevail, even if it meant shaking the foundations of her own bloodline.",
    "motiveSeed": "N/A - victim",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "possible",
    "stakes": "Her death jeopardizes the family inheritance and exposes secrets long buried.",
    "humourStyle": "understatement",
    "humourLevel": 0.1,
    "speechMannerisms": "Edith speaks with measured, deliberate phrasing, often pausing to consider her words carefully. Her tone is formal but never harsh, laden with genteel restraint and the occasional dry observation about the follies of youth or modern times. She rarely raises her voice, preferring a calm but firm delivery that commands respect.",
    "signatureTic": "‘One mustn’t rush to judgment.’",
    "internalConflict": "Edith wrestles with the weight of legacy versus the imperative of truth, fearing that revealing the forged will might dismantle the family she has dedicated her life to preserving.",
    "personalStakeInCase": "As the victim whose death precipitates the unraveling of family secrets, Edith’s life and decisions form the very heart of the mystery. Her legacy and the scandal she uncovered compel the investigation and threaten to tear her family apart.",
    "paragraphs": [
      "Edith Langley is the very soul of Langley Manor, a woman whose presence fills the great house with an air of unyielding tradition. Her days are spent overseeing the estate’s affairs and maintaining the social order that has defined her family for generations. Yet beneath her composed exterior lies a steely resolve to confront a dark family secret that has festered in silence for far too long.",
      "Her discovery of the forged will was not merely a legal quandary but a moral reckoning. Edith viewed the deception as a stain upon the family’s honor and was determined to bring the truth into the light, regardless of the personal cost. This secret gave her a quiet urgency that set her apart from the other inhabitants of the manor, who remained blissfully unaware of the storm gathering beneath the surface.",
      "Despite her formidable reputation, Edith was not immune to loneliness. The burden of leadership and the knowledge she carried isolated her, making her wary of confidences. She trusted few, and those she did were bound by an unspoken code of discretion. Her interactions often bore a subtle edge of warning, as if daring others to challenge the status quo she upheld so fiercely.",
      "Her death is not merely a tragic event but a symbolic fracture in the Langley legacy. The manner in which she met her end—quiet, unassuming, yet profoundly disruptive—mirrors the slow unraveling of the family’s carefully constructed façade. Edith’s legacy, both as a matriarch and a keeper of secrets, becomes the fulcrum upon which the investigation pivots."
    ],
    "order": 1
  },
  {
    "name": "Giles Langley",
    "summary": "The ambitious and modern-minded heir, Giles is caught between his desire to forge a new future and the shadow of a scandal that threatens to strip him of everything.",
    "publicPersona": "Giles Langley, in his thirties, strides through Langley Manor with the confident air of a man determined to break free from the past. As a progressive entrepreneur, he champions modernization and innovation, often clashing with the old guard who cling to tradition. His casual yet purposeful manner suggests a man who believes in shaping his own destiny, unburdened by the weight of ancestral expectations.",
    "privateSecret": "Beneath this veneer of forward-thinking ambition lies a desperate man. Giles knows that if Edith exposes the forged will, his claim to the estate—and with it his fortune and social standing—would evaporate. This knowledge fuels a fierce determination to silence her, a motive born of fear and self-preservation rather than mere greed.",
    "motiveSeed": "Stands to lose estate inheritance if Edith exposes forged will; killing her prevents financial ruin.",
    "motiveStrength": "compelling",
    "alibiWindow": "Left the smoking room from 9:00 to 9:15 PM",
    "accessPlausibility": "easy",
    "stakes": "Loses family fortune and social standing if Edith lives and reveals secrets.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Giles speaks with brisk efficiency, his tone often edged with sardonic humour. His sentences are clipped but articulate, occasionally punctuated by a wry quip or ironic observation. He shows impatience with archaic customs and is prone to undercutting pomposity with a subtle jab.",
    "signatureTic": "‘Let’s not pretend we’re living in the past.’",
    "internalConflict": "Giles struggles to reconcile his genuine desire to modernize the estate with the darker impulses his desperation has awakened, questioning where ambition ends and betrayal begins.",
    "personalStakeInCase": "The case threatens to destroy his dreams and the future he envisions for the family estate. His very identity as heir hangs in the balance, making the outcome deeply personal.",
    "paragraphs": [
      "Giles Langley embodies the restless spirit of change, a man eager to cast off the shackles of tradition that have long defined Langley Manor. His vision for the estate is one of innovation and progress, a stark contrast to the staid conservatism championed by his mother. This clash of ideals fuels much of the tension within the household.",
      "Yet Giles’s modernity masks a man cornered by circumstance. The forged will represents not just a legal threat but an existential one. Should Edith reveal the truth, his status as heir would be nullified, leaving him bereft of fortune and influence. This looming peril drives a desperation that threatens to override his better judgment.",
      "His alibi—stepping away from the smoking room briefly—places him near the scene of the crime, a fact that does not escape the sharp eyes of the investigator. Giles’s access to the victim is unchallenged, and his motive is as clear as it is compelling. Still, beneath the surface lies a complexity of emotions: fear, ambition, and a conflicted loyalty to a family he wishes to both honor and escape.",
      "As the investigation unfolds, Giles must confront the consequences of his actions and choices. His journey is one of self-discovery, testing whether his aspirations can survive the revelations of betrayal and whether he can emerge from the shadow of his mother’s legacy intact."
    ],
    "order": 2
  },
  {
    "name": "Agnes Fairchild",
    "summary": "The steadfast family secretary whose loyalty masks a desperate attempt to protect herself from ruin.",
    "publicPersona": "Agnes Fairchild, in her fifties, is the epitome of discretion and unwavering service. Her long tenure as the Langley family secretary has earned her a reputation for loyalty and reliability. She moves through the manor with quiet efficiency, her presence a constant though unobtrusive fixture in the household’s daily rhythm.",
    "privateSecret": "However, Agnes’s steadfastness conceals a vulnerability: Edith’s knowledge of Agnes’s involvement in the forged will and other misdeeds has left her vulnerable to blackmail. The threat of exposure would destroy her professional standing and personal reputation, a fate she is determined to avoid at all costs.",
    "motiveSeed": "Feared exposure by Edith which would ruin her reputation; killing was seen as the only escape.",
    "motiveStrength": "strong",
    "alibiWindow": "Was seen in the kitchen preparing tea from 8:45 to 9:20 PM",
    "accessPlausibility": "possible",
    "stakes": "Risked losing her lifelong position and personal reputation.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Agnes’s speech is polished and formal, often laced with subtle barbs and a sharp wit that surfaces in moments of tension. She employs courteous phrases that thinly veil her disdain or skepticism, delivering her lines with a poised yet cutting elegance.",
    "signatureTic": "‘One must always mind one’s own affairs.’",
    "internalConflict": "Agnes is torn between her loyalty to the family she has served for decades and the primal instinct for self-preservation that drives her to consider desperate measures.",
    "personalStakeInCase": "Her future and reputation are on the line; the case threatens to unmask her past and unravel the carefully maintained facade of her loyalty.",
    "paragraphs": [
      "Agnes Fairchild is the unseen hand that has guided Langley Manor’s affairs behind the scenes for years. Her knowledge of the family’s inner workings is encyclopedic, and her discretion has been rewarded with trust and respect. Yet this very knowledge has become a double-edged sword, binding her to secrets that could destroy her if revealed.",
      "The forged will is more than a legal document to Agnes; it is a symbol of her complicity and the danger that lurks should the truth come to light. Edith’s blackmail placed her in a perilous position, forcing a choice between honesty and survival. The stakes are high: exposure would mean the end of her career and social disgrace.",
      "Her alibi, while seemingly solid with witnesses in the kitchen, leaves open the possibility of a brief window to act. Agnes’s access to the victim is plausible, given her role and familiarity with the manor’s layout. The tension between her outward composure and inner turmoil adds a layer of complexity to her character.",
      "Throughout the investigation, Agnes’s sharp tongue and polished demeanor mask a woman grappling with fear and regret. Her story is one of loyalty tested by betrayal, and the choices she makes reveal the fragile balance between duty and self-interest."
    ],
    "order": 3
  },
  {
    "name": "Reggie Harcourt",
    "summary": "A retired military officer whose honorable exterior conceals a desperate attempt to bury a scandalous past.",
    "publicPersona": "Reggie Harcourt, now in his sixties, carries himself with the disciplined bearing of a man forged by years of military service. His speech is formal and precise, reflecting a life governed by order and duty. As a trusted advisor to the Langley family, he is seen as a pillar of stability and traditional values.",
    "privateSecret": "Yet Reggie harbors a secret that undermines his impeccable reputation: a youthful affair with Edith Langley that, if exposed, would ruin his standing in society. The fear of this revelation drives him to consider extreme measures to protect his name and legacy.",
    "motiveSeed": "Feared Edith revealing their affair, which would ruin his reputation; killing was a desperate measure.",
    "motiveStrength": "strong",
    "alibiWindow": "Was walking alone in the garden from 8:50 to 9:10 PM",
    "accessPlausibility": "possible",
    "stakes": "Risked public disgrace and loss of social position.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Reggie speaks with a deliberate cadence, choosing his words carefully and often employing military jargon or aphorisms. His tone is calm and authoritative, with little room for levity. He tends to answer questions succinctly, preferring to maintain a controlled and measured presence.",
    "signatureTic": "‘Discretion is the better part of valor.’",
    "internalConflict": "Reggie wrestles with the shame of his past indiscretions and the fear that his carefully cultivated honor will be irrevocably tarnished.",
    "personalStakeInCase": "The investigation threatens to unearth a scandal that could destroy not just his reputation but the very identity he has built since his retirement.",
    "paragraphs": [
      "Reggie Harcourt’s life has been shaped by discipline and a rigid moral code, forged in the crucible of military service. His role as family advisor places him at the heart of Langley Manor’s social order, where he is both respected and relied upon for counsel. Yet beneath this veneer of respectability lies a secret that haunts him.",
      "His youthful affair with Edith Langley is a scandal that, if revealed, would shatter his standing in the tight-knit circles of Yorkshire’s elite. The fear of exposure has cast a long shadow over his twilight years, driving him to desperate contemplation. His alibi—walking alone in the garden—offers some distance from the crime scene but does not entirely absolve him.",
      "Reggie’s measured speech and controlled demeanor mask a man burdened by guilt and anxiety. His use of military aphorisms serves as a shield against vulnerability, a way to maintain composure in the face of mounting pressure. He is a man caught between the honor he cherishes and the secrets he fears.",
      "As the inquiry progresses, Reggie must confront the consequences of his past and decide whether to uphold the code of silence or embrace the truth, no matter the personal cost. His story is one of regret, courage, and the painful reckoning with one’s own history."
    ],
    "order": 4
  },
  {
    "name": "Mabel Thorne",
    "summary": "The ambitious governess whose outsider status and fear of dismissal drive her towards desperate actions.",
    "publicPersona": "Mabel Thorne, aged between twenty-five and thirty-five, presents herself as the epitome of polite ambition. Her manners are impeccable, her speech carefully cultivated to blend deference with a subtle assertion of self-worth. As the newly appointed governess, she navigates the corridors of Langley Manor with a mixture of hope and cautious calculation.",
    "privateSecret": "Mabel’s confidence belies a growing anxiety: Edith had begun to mistrust her and was planning to replace her. This threat to her position imperils not only her livelihood but her aspirations for social advancement, pushing her towards a panicked and fatal decision.",
    "motiveSeed": "Feared losing employment and social ascent if Edith removed her; killing was a panicked act.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be reading in the library from 9:00 to 9:30 PM",
    "accessPlausibility": "unlikely",
    "stakes": "Loses chance for social mobility and financial security.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Mabel speaks plainly and directly, often eschewing ornamentation for clear, concise statements. Her tone can be brusque, revealing impatience or frustration beneath her polite exterior. She tends to avoid small talk, preferring to get straight to the point, which can come across as refreshingly honest or somewhat abrupt.",
    "signatureTic": "‘Let’s not beat around the bush.’",
    "internalConflict": "Mabel grapples with the tension between her ambition and the ethical boundaries she is willing to cross, haunted by the consequences of her actions.",
    "personalStakeInCase": "Her future depends on maintaining her position and reputation within the household; the case threatens to expose her vulnerabilities and ambitions.",
    "paragraphs": [
      "Mabel Thorne is the newcomer in Langley Manor, a governess whose presence is both a breath of fresh air and a source of subtle unease. Her straightforward manner and youthful energy contrast sharply with the faded grandeur of the estate and its inhabitants. She approaches her role with determination, eager to prove her worth and secure a place in high society.",
      "Yet beneath her poised exterior simmers a well of anxiety. Edith’s growing mistrust and plans to dismiss her strike at the heart of Mabel’s ambitions. The governess’s fear of losing her foothold in the family’s world fuels a desperation that clouds her judgment and leads to rash decisions.",
      "Her claim of being engrossed in the library offers an alibi that is difficult to verify conclusively. The unlikelihood of her access to the victim’s private quarters adds complexity to her involvement, yet the motive she harbors cannot be dismissed lightly. Mabel’s blunt speech and candid admissions reveal a woman caught between hope and despair.",
      "As the investigation unfolds, Mabel confronts the harsh realities of social mobility and the costs of ambition. Her journey is a poignant exploration of the outsider’s struggle within a rigid class structure and the moral dilemmas faced when survival is at stake."
    ],
    "order": 5
  },
  {
    "name": "Felix Dryden",
    "summary": "The astute and discreet inquiry agent tasked with unraveling the tangled web of Langley Manor’s secrets.",
    "publicPersona": "Felix Dryden, aged forty to fifty, carries the air of a man accustomed to navigating the shadows of high society’s scandals. His demeanor is sharp and independent, marked by a keen intellect and a quiet confidence. Hired for his discretion and investigative acumen, he moves through the manor with a professional detachment that belies his deep engagement with the case.",
    "privateSecret": "Felix was engaged by Edith’s solicitor to conduct a delicate inquiry away from the prying eyes of the police and press. His involvement is a testament to the family’s desire to keep matters discreet, preserving reputation above all else.",
    "motiveSeed": "N/A - detective",
    "motiveStrength": "weak",
    "alibiWindow": "Not present at the manor before the crime; arrived after discovery.",
    "accessPlausibility": "impossible",
    "stakes": "Professional reputation and client trust hinge on solving the case discreetly.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Felix’s speech is precise and measured, peppered with dry observations that reveal sharp insight into human nature. He favors understatement and often uses irony to highlight contradictions. His tone is calm and unhurried, a steadying presence amid the manor’s turmoil.",
    "signatureTic": "‘Curious, isn’t it?’",
    "internalConflict": "Felix wrestles with the challenge of balancing thorough investigation with the delicate social dynamics at play, fearing that uncovering the truth may cause irreparable damage.",
    "personalStakeInCase": "Beyond professional duty, Felix’s reputation as a discreet and effective investigator depends on resolving the case without igniting scandal, making the outcome deeply consequential.",
    "paragraphs": [
      "Felix Dryden arrives at Langley Manor as an outsider, tasked with peeling back layers of secrecy that have long shielded the family from scrutiny. His approach is methodical, relying on observation and deduction rather than confrontation. He listens more than he speaks, gathering fragments of truth from the carefully guarded conversations and subtle gestures of the household’s inhabitants.",
      "His role is complicated by the manor’s entrenched social codes and the family’s insistence on discretion. Felix must tread lightly, balancing the pursuit of justice with the preservation of reputations. This delicate dance requires not only intellect but emotional intelligence and tact.",
      "Felix’s dry wit surfaces in moments of quiet reflection, often punctuating tense exchanges with ironic remarks that underscore the absurdity of human folly. His signature phrase, ‘Curious, isn’t it?’ serves as a gentle prod to those around him, inviting reconsideration of accepted truths.",
      "As the investigation progresses, Felix gains the trust of some family members while arousing suspicion in others. His internal struggle revolves around the fear that exposing the full truth may shatter fragile alliances and irrevocably alter lives. Yet he remains committed to uncovering what lies beneath the hearth’s slow betrayal."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Langley Manor",
    "type": "country house estate (manor house)",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling Tudor-style manor nestled in the damp Yorkshire countryside, Langley Manor stands as a bastion of genteel tradition amid subtle social tensions and economic uncertainty.",
    "visualDescription": "Half-timbered gables and leaded glass windows punctuate dark stone walls; steep pitched roofs gather rain into deep gutters; ivy-clad chimneys rise above manicured lawns bordered by clipped yew hedges; gravel drives wind past ancient oaks toward the stables and servants' quarters.",
    "atmosphere": "An imposing yet inviting estate, Langley Manor balances the warmth of hearth fires with the chill of looming secrets, its stately rooms and shadowed corridors steeped in the quiet hum of 1930s country life.",
    "paragraphs": [
      "Langley Manor’s great Tudor façade towers above the rolling Yorkshire moors, its timber-framed wings framing a central stone hall that has seen centuries of family history. The estate’s expansive grounds are divided by ancient hedgerows and stone walls, creating secluded gardens, a stable yard, and separate quarters for household staff. The private drive, lined with wet gravel and puddled ruts, connects the manor to the distant village of Little Middleton, accessible only by a single narrow lane.",
      "Inside, the manor’s interiors reflect a careful balance of comfort and formality. Heavy oak paneling and richly woven tapestries adorn the main reception rooms, while the family’s private quarters remain locked and inviolate behind heavy doors. Electric lighting flickers occasionally due to the aging wiring, casting dancing shadows on the polished brass fixtures and Persian rugs. The servants’ areas, accessed through hidden staircases and back corridors, bustle quietly with the measured routine of domestic service.",
      "The estate’s isolation is palpable: mist often curls low over the gardens in the early morning, muffling sounds and curtailing sightlines. Visitors must announce themselves at the gatehouse where the estate’s chauffeur and housekeeper maintain logs and enforce strict access controls. The surrounding countryside, soaked with spring rains, hums with the distant clang of the village train and the occasional hum of a petrol engine on the private drive.",
      "Despite its grandeur, Langley Manor carries an undercurrent of tension — economic pressures weigh on the family’s fortune, and social hierarchies dictate rigid interactions between the landed gentry and the loyal household staff. This uneasy balance is mirrored in the manor’s atmosphere, where the comforting crackle of hearth fires contrasts with the sharp whisper of secrets held behind closed doors."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "damp and overcast typical of English spring, with intermittent drizzle and low mist in the early morning",
    "timeFlow": "Three days of mounting tension as secrets unravel and alliances shift",
    "mood": "a blend of genteel calm underscored by subtle tensions reflecting social and economic pressures of the era",
    "eraMarkers": [
      "domestic electric lighting with occasional outages",
      "rotary dial telephones on party-line exchanges",
      "manual typewriters for correspondence and records",
      "battery-powered portable radios for news and entertainment",
      "petrol-powered automobiles maintained by estate chauffeur",
      "passenger trains connecting nearest town and regional centers",
      "telegram dispatches sent via nearest town telegraph office"
    ],
    "sensoryPalette": {
      "dominant": "damp stone walls mingled with crackling hearth-fire",
      "secondary": [
        "rain-drummed roof slates",
        "wood smoke blending with cold beeswax"
      ]
    },
    "paragraphs": [
      "Langley Manor nestles in a landscape softened by persistent spring rain, its ancient stone and timber soaked with moisture that deepens the shadows under gabled roofs. The scent of wet earth and woodsmoke lingers in the air, mingling with the faint, lingering aroma of beeswax polish. Inside, the occasional flicker of electric bulbs casts a warm but unreliable glow, while the low murmur of voices and the distant clatter of rain on slate create a subdued symphony of estate life. The steady drip of water from gutters and the rustle of damp leaves add to the sense of isolation and slow passage of time.",
      "The manor’s atmosphere is one of restrained elegance touched by the practical realities of the 1930s. Formality governs social interactions, yet beneath the surface, tensions simmer quietly. The estate’s isolation, combined with the weather’s damp chill, fosters a mood both contemplative and watchful. Every creak of timber and faint shuffle in the corridors hints at unseen movements and hidden stories, while the gardens and stables lie muted beneath the grey sky, waiting for the day’s events to unfold."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Langley Manor Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A large oak-paneled room lined with floor-to-ceiling shelves heavy with leather-bound volumes; a massive stone fireplace dominates the far wall, its hearth cold and dark; heavy velvet drapes hang partly drawn over leaded glass windows overlooking the misty gardens; a large mahogany desk cluttered with papers and a manual typewriter sits near the center.",
      "sensoryDetails": {
        "sights": [
          "dust motes in fading daylight",
          "glossy leather spines on books",
          "brass reading lamps with crackling bulbs",
          "heavy velvet curtains drawn half-closed",
          "dark oak furniture polished to a dull sheen"
        ],
        "sounds": [
          "soft ticking of an antique mantel clock",
          "distant rolling thunder muted by thick walls",
          "occasional creak of settling timber",
          "rustle of paper from scattered documents",
          "faint whisper of rain against windowpanes"
        ],
        "smells": [
          "musty parchment and old leather",
          "cold stone hearth dust",
          "faint trace of pipe tobacco smoke",
          "aged beeswax polish",
          "subtle hint of damp wood"
        ],
        "tactile": [
          "smooth worn leather armchair",
          "rough grain of oak desk surface",
          "chill from cold stone fireplace",
          "velvet curtain edges soft to touch",
          "heavy brass drawer handles cool under fingers"
        ]
      },
      "accessControl": "Restricted to family members and select staff; locked when unoccupied; visitors require permission and accompaniment; library keys held by housekeeper and master of the house.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked leaded glass",
            "grey light filtering through curtains",
            "damp garden glimpsed beyond window"
          ],
          "sounds": [
            "steady rain drumming on roof slates",
            "soft water trickling through gutters",
            "muffled footsteps on stone floor"
          ],
          "smells": [
            "damp parchment",
            "wet stone",
            "faint woodsmoke from distant chimney"
          ],
          "mood": "oppressive and contemplative"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light across shelves",
            "shadows pooling in corners",
            "glimmering brass lamp reflections"
          ],
          "sounds": [
            "quiet turning of pages",
            "soft ticking clock",
            "distant murmur of voices downstairs"
          ],
          "smells": [
            "beeswax polish",
            "aged leather",
            "faint pipe tobacco"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm candlelight flickering on woodwork",
            "long shadows stretching across floor",
            "glow from fireplace embers"
          ],
          "sounds": [
            "crackling fire",
            "clock chimes marking the hour"
          ],
          "smells": [
            "smoke and wax",
            "warm leather",
            "damp earth faint at window"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Langley Manor Library is a sanctuary of quiet reflection and concealed knowledge, its walls lined with centuries of books whose worn spines hint at secrets long kept. The heavy oak desk, cluttered with letters and ledgers, suggests a place where private correspondence might reveal hidden motives. The cold stone hearth, presently unlit, casts a shadowed gloom that deepens the room’s air of mystery. Access is tightly controlled, ensuring the room remains undisturbed except by those with authority, making it a prime location for clandestine meetings or the discovery of crucial evidence.",
        "Here, the interplay of light and shadow is subtle yet penetrating: the flicker of candlelight or the unreliable electric bulbs throw the polished surfaces into sharp relief, while the muffled sounds of rain or the distant household create a cocoon of isolation. The scent of aged leather and faint tobacco smoke lingers, evoking the presence of past readers and whispered confidences. Every creak and rustle in the silence feels laden with meaning, and the cool stone and velvet textures invite close inspection, perfect for uncovering hidden clues or overheard conversations."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants’ Hall",
      "type": "interior",
      "purpose": "Gathering space for household staff",
      "visualDetails": "A modest, low-ceilinged room with whitewashed walls and a large cast-iron stove in one corner; long wooden tables and benches fill the space; narrow windows with simple linen curtains overlook the kitchen yard; shelves lined with enamelware and crockery line one wall.",
      "sensoryDetails": {
        "sights": [
          "glowing stove embers",
          "glossy enamel jugs and plates",
          "flickering oil lamp flames",
          "plain wooden furniture worn smooth",
          "linen curtains fluttering at window"
        ],
        "sounds": [
          "clatter of crockery",
          "murmured conversation",
          "footsteps on flagstone floor",
          "whispered orders and laughter",
          "creaking of bench wood"
        ],
        "smells": [
          "boiling stew and baking bread",
          "soapy water and lemon polish",
          "smoke from stove firewood",
          "freshly laundered linens",
          "earthy scent from boots"
        ],
        "tactile": [
          "rough wooden bench edges",
          "warm stove metal",
          "smooth enamel surfaces",
          "coarse linen fabric",
          "cool flagstone underfoot"
        ]
      },
      "accessControl": "Restricted to household staff; family and guests prohibited; entrance via kitchen and back corridors; staff must keep to schedules and report for duties promptly.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through damp linen curtains",
            "steam rising from enamel pots"
          ],
          "sounds": [
            "steady rain tapping windowpanes",
            "soft chatter of waking staff"
          ],
          "smells": [
            "freshly baked bread",
            "wet earth from boots"
          ],
          "mood": "busy and anticipatory"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "muted light on polished wood",
            "shadows pooling beneath tables"
          ],
          "sounds": [
            "quiet scrubbing of pots",
            "murmured instructions"
          ],
          "smells": [
            "soap and lemon polish",
            "smoke from stove"
          ],
          "mood": "steady and industrious"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from stove fire",
            "reflections on enamelware"
          ],
          "sounds": [
            "soft laughter",
            "distant closing of kitchen doors"
          ],
          "smells": [
            "hearty stew",
            "smoke and soot"
          ],
          "mood": "relaxed and communal"
        }
      ],
      "paragraphs": [
        "The Servants’ Hall is a practical and well-worn space where the household staff gather for meals and brief respites from their duties. Its modest furnishings and low ceilings create an atmosphere of functional warmth, anchored by the cast-iron stove that radiates steady heat through the often-chilly days. The room’s proximity to the kitchens and discreet back corridors ensures that staff movements remain efficient and largely unseen by the family and guests.",
        "Within the hall, the sounds of crockery clatter and muted conversations mingle with the rich smells of baking bread and simmering stew, grounding the space in the rhythms of daily domestic life. The tactile roughness of wooden benches and the smooth coldness of enamelware contrast with the warmth of the stove and the coarse fabric of linen curtains. This room, though humble, is a vital node in the estate’s social hierarchy, where loyalty and information quietly circulate."
      ]
    },
    {
      "id": "estate_gardens",
      "name": "Estate Gardens",
      "type": "exterior",
      "purpose": "Outdoor grounds for leisure and concealment",
      "visualDetails": "Formal parterres edged with clipped boxwood, gravel paths winding through rose beds and herbaceous borders; a stone sundial stands at the center of a circular lawn; wrought iron benches and a small glass conservatory are tucked among mature yew trees; high hedges and wrought iron gates separate the gardens from the wider estate.",
      "sensoryDetails": {
        "sights": [
          "glossy green boxwood hedges",
          "damp gravel paths",
          "dappled sunlight through yew branches",
          "frosted glass of conservatory panes"
        ],
        "sounds": [
          "soft rustle of leaves in breeze",
          "distant chirping of garden birds",
          "footsteps crunching on gravel",
          "buzz of early bees",
          "gentle clink of garden tools"
        ],
        "smells": [
          "freshly turned earth",
          "damp moss and leaf mold",
          "heady scent of roses",
          "herbaceous lavender and thyme",
          "wet stone and iron"
        ],
        "tactile": [
          "rough bark of yew trunks",
          "cool smooth stone of sundial",
          "gritty gravel underfoot",
          "chilly wrought iron bench"
        ]
      },
      "accessControl": "Open to family and invited guests during daylight hours; estate staff maintain the gardens but avoid presence during social visits; garden gates locked at dusk to prevent wandering.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-speckled rose petals",
            "grey skies above clipped hedges"
          ],
          "sounds": [
            "steady patter of raindrops on leaves",
            "water dripping from eaves"
          ],
          "smells": [
            "wet earth and moss",
            "fresh rain on foliage"
          ],
          "mood": "quiet and introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "muted floral colors",
            "shadows softened by cloud cover"
          ],
          "sounds": [
            "distant birdcalls",
            "soft breeze stirring leaves"
          ],
          "smells": [
            "herbal scents",
            "damp stone"
          ],
          "mood": "calm yet watchful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm sunset glow on foliage",
            "long shadows from hedges"
          ],
          "sounds": [
            "evening insect hum",
            "soft rustle of grass"
          ],
          "smells": [
            "cool evening air",
            "faint scent of night-blooming flowers"
          ],
          "mood": "peaceful with underlying tension"
        }
      ],
      "paragraphs": [
        "The estate gardens offer a serene yet structured outdoor space, where clipped boxwood hedges and carefully tended rose beds create an ordered beauty against the backdrop of Yorkshire’s damp spring. Gravel paths wind thoughtfully between flower borders and mature yew trees, leading to secluded benches and a quaint glass conservatory. The gardens serve as both a place of leisure for the family and guests and a potential site for furtive meetings or hidden observations.",
        "The sensory experience here is richly layered: the cool touch of wrought iron benches, the soft petals of roses dampened by rain, and the earthy scent of moss and freshly turned soil combine to evoke both calm and alertness. The gardens’ high hedges and locked gates enforce a sense of privacy and containment, while the subtle sounds of birdsong and rustling leaves provide a natural soundtrack that belies the human tensions simmering beneath the surface."
      ]
    },
    {
      "id": "stable_yard",
      "name": "Stable Yard",
      "type": "transitional",
      "purpose": "Service and transport hub; clue discovery",
      "visualDetails": "A cobbled courtyard enclosed by weathered stone stables with heavy wooden doors; tack rooms and haylofts rise above; oil lamps hang beside doorways; the scent of leather harnesses and fresh hay fills the air; a petrol-powered estate car is parked near the carriage house.",
      "sensoryDetails": {
        "sights": [
          "glinting brass harness buckles",
          "oil lamp pools of yellow light",
          "piled straw bales",
          "dark wooden stable doors",
          "gleaming estate car bodywork"
        ],
        "sounds": [
          "soft nickers and hoofbeats",
          "clatter of horseshoes on cobbles",
          "faint clink of metal tack",
          "distant clatter of carriage wheels",
          "occasional creak of wooden beams"
        ],
        "smells": [
          "fresh hay and horse sweat",
          "warmed leather",
          "horse dung mingled with earth",
          "oil and petrol fumes",
          "wood smoke from nearby chimneys"
        ],
        "tactile": [
          "rough horsehair brush bristles",
          "cool metal of bridle bits",
          "coarse rope halters",
          "smooth polished car paint",
          "cold stone cobbles"
        ]
      },
      "accessControl": "Restricted to stablehands, chauffeur, and authorized staff; family members may pass through but do not loiter; gates locked at night; service entrances separate from main house.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "wet cobbles glistening",
            "rain dripping from eaves"
          ],
          "sounds": [
            "steady rain tapping leather",
            "soft snorts from horses"
          ],
          "smells": [
            "damp hay",
            "wet leather"
          ],
          "mood": "brisk and utilitarian"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "muted light on stable walls",
            "shadows beneath beams"
          ],
          "sounds": [
            "hoofsteps on cobbles",
            "quiet murmuring of stablehands"
          ],
          "smells": [
            "oil and earth",
            "warm leather"
          ],
          "mood": "steady and watchful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "flickering lamp light",
            "deep shadows in corners"
          ],
          "sounds": [
            "distant carriage wheels",
            "soft horse breathing"
          ],
          "smells": [
            "smoke and petrol",
            "fresh hay"
          ],
          "mood": "quiet anticipation"
        }
      ],
      "paragraphs": [
        "The stable yard forms a vital transitional space between the manor’s formal world and the practical demands of estate life. Enclosed by timeworn stone walls and heavy wooden doors, it hums with the quiet energy of horses and the steady work of stablehands. The presence of the estate’s petrol-powered car alongside traditional tack and haylofts underscores the era’s blend of old and new.",
        "This area is rich in sensory contrasts: the rough texture of horsehair brushes and the cool gleam of polished car paint, the earthy scents of hay and leather mingling with faint petrol fumes. The stable yard’s relative seclusion and complex access routes make it a plausible site for secret meetings or the concealment of evidence, while the rhythmic sounds of hoofbeats and clinking metal create a subtle, living soundtrack."
      ]
    }
  ],
  "note": "",
  "cost": 0.006929879999999999,
  "durationMs": 58543
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1935,
    "month": "October",
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "damp and overcast skies with persistent drizzle",
      "early morning low mists blanketing the countryside",
      "cool temperatures averaging 8-12°C (46-54°F) with occasional chilly winds"
    ],
    "daylight": "shortening autumn days with sunset around 6:15 pm, twilight lingering until 7 pm",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Harvest Festival celebrations in rural parishes",
      "All Saints' Day observed on November 1st with preparatory gatherings"
    ],
    "seasonalActivities": [
      "Gathering and curing root vegetables and apples from the estate's orchards",
      "Preparing the manor's fireplaces and chimneys for winter",
      "Hosting afternoon tea with spiced cakes and warming drinks by the fire"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece tweed suits with wide lapels",
        "double-breasted overcoats in deep browns or greys",
        "felt fedora hats with wide brims"
      ],
      "casual": [
        "knitted pullovers paired with wool trousers",
        "corduroy jackets for outdoor country wear",
        "leather brogues or sturdy ankle boots"
      ],
      "accessories": [
        "silk neckties in muted plaids or stripes",
        "pocket watches on chains",
        "leather gloves for chillier mornings"
      ]
    },
    "womensWear": {
      "formal": [
        "long-sleeved silk blouses with Peter Pan collars",
        "mid-calf length wool skirts with gentle pleats",
        "fitted tailored coats with velvet collars"
      ],
      "casual": [
        "knitted twinsets in autumnal shades",
        "beret hats or cloche styles adapted for cooler weather",
        "leather lace-up boots or oxfords"
      ],
      "accessories": [
        "leather handbags with metal clasps",
        "silk scarves with floral or geometric patterns",
        "brown or beige gloves trimmed with fine stitching"
      ]
    },
    "trendsOfTheMoment": [
      "return to earth-tone color palettes inspired by the countryside",
      "emphasis on practicality mixed with subtle elegance",
      "hats remain essential outdoors but styles are slightly softened"
    ],
    "socialExpectations": [
      "men expected to maintain a dignified appearance reflecting social status",
      "women to dress modestly with attention to seasonal appropriateness",
      "staff uniforms strictly regulated to distinguish rank and role"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Abyssinian Crisis escalating tensions following Italy’s invasion of Ethiopia in October 1935",
      "King George V addressing the nation to bolster morale amid economic uncertainty",
      "Widespread debate in Parliament over rearmament and national defense policies"
    ],
    "politicalClimate": "The United Kingdom navigates a precarious balance of appeasement and preparedness with rising international threats, while domestic politics focus on recovery from the Great Depression's lingering effects.",
    "economicConditions": "Unemployment remains stubbornly high in industrial regions, though rural estates face pressure to reduce staff and expenses; agricultural prices have stabilized but incomes are modest.",
    "socialIssues": [
      "Class tensions heightened by economic disparity and differing political sympathies",
      "Growing public discourse on women’s roles amid changing labor dynamics",
      "Concern over youth delinquency and the influence of emerging mass media"
    ],
    "internationalNews": [
      "League of Nations struggles to respond effectively to Italy’s aggression in East Africa",
      "Treaty talks and disarmament conferences continue amid escalating military buildups"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby’s crooning hits gaining popularity in Britain",
        "British dance bands such as Jack Hylton’s Orchestra",
        "Jazz influences blending with traditional dance hall tunes"
      ],
      "films": [
        "‘The 39 Steps’ directed by Alfred Hitchcock, a popular thriller released in 1935",
        "‘Bride of Frankenstein’ captivating audiences with gothic horror",
        "‘Top Hat’ starring Fred Astaire and Ginger Rogers, showcasing elegant dance numbers"
      ],
      "theater": [
        "Noël Coward’s plays continuing to charm London audiences",
        "West End productions mixing light comedy with social commentary",
        "Local amateur dramatics flourishing in country towns"
      ],
      "radio": [
        "BBC Home Service broadcasts including ‘In Town Tonight’",
        "Serial dramas and mystery shows gaining loyal listeners",
        "News bulletins providing updates on international crises"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s ‘Death in the Clouds’ released earlier in 1935",
        "Evelyn Waugh’s ‘A Handful of Dust’ gaining critical attention",
        "George Orwell’s essays addressing social inequities"
      ],
      "popularGenres": [
        "Crime and detective fiction",
        "Social satire and commentary",
        "Romantic and historical novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "Improved domestic electric lighting fixtures becoming standard in country houses",
        "Battery-powered portable radios allowing news access beyond urban centers",
        "Enhanced rotary dial telephones with party-line systems"
      ],
      "commonDevices": [
        "Manual typewriters for household and estate correspondence",
        "Electric irons and vacuum cleaners in wealthier homes",
        "Gramophones playing 78 rpm records"
      ],
      "emergingTrends": [
        "Increasing use of radio for entertainment and information",
        "Slow adoption of motor vehicles on country estates",
        "Experimentation with home electric appliances for labor saving"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 4 pence",
        "Pint of milk: 2 pence",
        "Taxi ride across town: approximately 2 shillings"
      ],
      "commonActivities": [
        "Morning strolls on the estate grounds before breakfast",
        "Afternoon tea gatherings with seasonal cakes and preserves",
        "Evening card games or reading by the fireside"
      ],
      "socialRituals": [
        "Formal dinner service beginning promptly at 8 pm",
        "Staff attendance at the morning briefing and evening lock-up"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Firm adherence to hierarchical distinctions between gentry, guests, and servants",
      "Widespread acceptance of patronage roles, though with underlying economic anxieties"
    ],
    "gender": [
      "Expectation for women to maintain decorum and manage domestic spheres",
      "Men as primary decision-makers and estate stewards",
      "Emerging discussions on women’s suffrage and workforce participation, tempered by traditional roles"
    ],
    "race": [
      "Predominantly white British social environment with limited exposure to colonial diversity on estates",
      "Racial attitudes reflecting imperialist views common in 1930s Britain"
    ],
    "generalNorms": [
      "Discretion and reserve highly valued in social interactions",
      "Politeness and formal address customary among all classes",
      "Private matters kept within family and trusted circle"
    ]
  },
  "atmosphericDetails": [
    "The persistent patter of drizzle dampens the gravel paths and softens footsteps on the estate grounds.",
    "A faint woodsmoke aroma drifts from the manor’s chimneys, mingling with the crisp, earthy scent of fallen leaves.",
    "The muted glow of electric lamps flickers through stained glass windows as dusk falls early, casting long shadows inside the grand hall."
  ],
  "paragraphs": [
    "October 1935 in the English countryside brings a pervasive dampness and chill, with low morning mists veiling the manor’s sprawling grounds. The estate is alive with autumnal preparations—orchards yield their last apples, and the kitchen staff busily cure root vegetables for winter stores. With sunsets drawing in by early evening, the great house readies its fireplaces to cast warm, dancing light across oak-paneled rooms, where the household’s genteel calm belies underlying economic and social pressures of the mid-1930s.",
    "Fashion on the estate reflects practical elegance: men don sturdy tweed suits and double-breasted overcoats, their felt hats shielding them from the drizzle, while women favor long-sleeved silk blouses paired with wool skirts and tailored coats trimmed in velvet. Accessories like leather gloves and silk scarves complete ensembles that balance refinement with readiness for the season’s chill. Social expectations underscore these choices, as appearance signals status and decorum amid a world quietly unsettled by international tensions and domestic austerity.",
    "Culturally, the manor’s inhabitants are attuned to the era’s vibrant entertainments—radio dramas and dance band tunes fill the drawing room, while cinema outings feature Hitchcock thrillers and Astaire’s latest musical. Newspapers carry grave reports of Italy’s invasion of Ethiopia, framing conversations at the dinner table alongside debates over national defense and economic recovery. Daily life revolves around routines: morning walks in the mist, afternoon teas by the fire, and formal dinners marked by punctuality and discretion. Beneath the polished surface, shifting social attitudes and the weight of tradition intertwine, creating a rich tapestry of an England poised on the cusp of change."
  ],
  "note": "",
  "cost": 0.0032772359999999998,
  "durationMs": 40194
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amid the economic strains of the Great Depression, the Langley family and their close associates gather at their isolated Tudor manor where rigid class distinctions and formal routines mask simmering tensions and fragile alliances.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Strict class hierarchies separate family, guests, and domestic staff, with formal daily rituals enforcing discretion and reserve, while economic pressures threaten traditional estate stability."
  },
  "setting": {
    "location": "A large Tudor-style manor house several miles from the nearest village, surrounded by expansive grounds including gardens, stables, and staff quarters.",
    "institution": "Country house estate (manor house)",
    "weather": "Damp and overcast typical of English spring, with intermittent drizzle and low morning mist."
  },
  "castAnchors": [
    "Edith Langley",
    "Giles Langley",
    "Agnes Fairchild",
    "Reggie Harcourt",
    "Mabel Thorne",
    "Felix Dryden"
  ],
  "theme": "The delicate balance of genteel calm and underlying social and economic tensions shapes interactions, where appearances and discretion are paramount amid a close-knit, scrutinizing household."
}

### LOCKED_FACTS
[
  {
    "id": "fire_lit_time",
    "value": "ten minutes past seven at night",
    "description": "The exact time the hearth fire was kindled as recorded by the butler."
  },
  {
    "id": "door_bolt_release_time",
    "value": "a quarter past eight at night",
    "description": "The time when the brass bolt latch would have expanded enough to retract the door bolt."
  },
  {
    "id": "room_temperature_peak",
    "value": "eighty-five degrees Fahrenheit",
    "description": "The maximum temperature reached in the locked room due to the hearth fire."
  },
  {
    "id": "distance_hearth_to_bolt",
    "value": "fourteen inches",
    "description": "Physical separation between hearth and door bolt latch."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 28,
  "countsByPlacement": {
    "early": 7,
    "mid": 21,
    "late": 0
  },
  "countsByCriticality": {
    "essential": 28
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
      "placement": "mid",
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
      "category": "temporal"
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
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "id": "clue_mantel_thermometer",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_soot_line_bolt",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_stable_clock_logs",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_reggie_harcourt",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_library_clock",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_servant_testimony_giles",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_garden_sundial",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_servant_witness_agnes",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_kitchen_log",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_servant_testimony_mabel",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_4",
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
