# Actual Prompt Record

- Run ID: `run_425dbb22-2e5e-4f39-86a6-7935a3c3830b`
- Project ID: `proj_8d84e7a9-9798-4656-8c29-73c856049d93`
- Timestamp: `2026-07-27T20:55:36.768Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `bc6535b8b5664f10`

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
    "title": "The Frosted Hourglass Mystery",
    "author": "GPT-4 Detective",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Early telephone technology",
        "Basic forensic toxicology and fingerprinting",
        "No modern digital technology",
        "Social hierarchies and formal etiquette at English country estates"
      ]
    },
    "setting": {
      "location": "Winthrope Manor Estate",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Manor house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "blunt force trauma with a heavy antique paperweight"
    }
  },
  "death_method": "struck with a heavy antique paperweight",
  "cast": [
    {
      "name": "Inspector Helen Marwood",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [
        "Professional acquaintance of Edward Winthrope",
        "Respected by manor staff"
      ],
      "public_persona": "Methodical and observant police inspector",
      "private_secret": "Harbors a personal dislike for class hypocrisy",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Official investigation access",
        "Interviews and manor visits"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Questions social norms"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [
        "Sensitive to contradictions in testimony"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Lady Beatrice Winthrope",
      "age_range": "50-60",
      "role_archetype": "victim",
      "relationships": [
        "Wife of Edward Winthrope",
        "Patron of estate staff"
      ],
      "public_persona": "Respected matriarch of the estate",
      "private_secret": "Harbored grudges against certain staff",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "N/A",
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
      "name": "Charles Montague",
      "age_range": "45-55",
      "role_archetype": "Estate Manager",
      "relationships": [
        "Reports directly to Edward Winthrope",
        "Manages staff and schedules"
      ],
      "public_persona": "Efficient and loyal manager",
      "private_secret": "Financial troubles and gambling debts",
      "motive_seed": "Blackmail threat from victim",
      "motive_strength": "strong",
      "alibi_window": "Between quarter past six and half past six",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to study and hourglass",
        "Knowledge of staff routines"
      ],
      "behavioral_tells": [
        "Nervous glances",
        "Avoids direct answers"
      ],
      "stakes": "Job security and financial survival",
      "evidence_sensitivity": [
        "Knowledge of manor schedules",
        "Access to hourglass"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Margaret Hensley",
      "age_range": "30-40",
      "role_archetype": "Lady's Maid",
      "relationships": [
        "Personal attendant to Lady Beatrice",
        "Close to Clara Simmons"
      ],
      "public_persona": "Devoted and discreet",
      "private_secret": "Secretly involved with James Fletcher",
      "motive_seed": "Jealousy over favoritism",
      "motive_strength": "moderate",
      "alibi_window": "Between quarter past five and six",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to victim’s chambers",
        "Knowledge of hourglass location"
      ],
      "behavioral_tells": [
        "Tense around Charles Montague",
        "Subtle evasions"
      ],
      "stakes": "Position at manor and personal reputation",
      "evidence_sensitivity": [
        "Presence near hourglass",
        "Witness to victim’s last movements"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Edward Winthrope",
      "age_range": "55-65",
      "role_archetype": "Estate Owner",
      "relationships": [
        "Husband of Lady Beatrice",
        "Employer of all staff"
      ],
      "public_persona": "Stoic and authoritative",
      "private_secret": "Strained marriage and secret debts",
      "motive_seed": "Desire to conceal family scandal",
      "motive_strength": "strong",
      "alibi_window": "Between six and half past six",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to study and hourglass",
        "Authorized to alter schedules"
      ],
      "behavioral_tells": [
        "Restrained anger",
        "Avoids discussing marriage"
      ],
      "stakes": "Family reputation and estate control",
      "evidence_sensitivity": [
        "Control over clock and schedules"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Clara Simmons",
      "age_range": "25-35",
      "role_archetype": "Cook",
      "relationships": [
        "Works closely with James Fletcher",
        "Knows staff schedules"
      ],
      "public_persona": "Steady and hardworking",
      "private_secret": "Knows about secret meetings in study",
      "motive_seed": "Protecting staff secrets",
      "motive_strength": "moderate",
      "alibi_window": "Between six and quarter to seven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to kitchen and pantry",
        "Occasional entry to study"
      ],
      "behavioral_tells": [
        "Protective of staff",
        "Avoids gossip"
      ],
      "stakes": "Job security and staff loyalty",
      "evidence_sensitivity": [
        "Knowledge of study meetings",
        "Observed unusual hourglass placement"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "James Fletcher",
      "age_range": "35-45",
      "role_archetype": "Gardener",
      "relationships": [
        "Romantic involvement with Margaret Hensley",
        "Respected by staff"
      ],
      "public_persona": "Reserved and dependable",
      "private_secret": "Discovered victim’s secret",
      "motive_seed": "Silencing a witness to family scandal",
      "motive_strength": "strong",
      "alibi_window": "Between quarter past six and seven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to garden and estate grounds",
        "Occasional entry through side door"
      ],
      "behavioral_tells": [
        "Avoids discussing evening whereabouts",
        "Fidgety with hands"
      ],
      "stakes": "Avoiding scandal and losing position",
      "evidence_sensitivity": [
        "Knowledge of garden gate latch",
        "Presence near manor grounds"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Charles Montague"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "On a cool autumn evening at the Winthrope Manor Estate, Lady Beatrice Winthrope was found dead in her study, struck with a heavy antique paperweight. The apparent timeline, anchored by the hourglass timer on the mantelpiece, indicated she died nearly thirty minutes before discovery. However, Inspector Helen Marwood uncovers a deceptive temporal illusion caused by the frozen condensation inside the sealed hourglass delaying sand flow, leading to a false assumption about the time of death. Through careful investigation of staff routines, physical clues, and subtle contradictions in timing, the inspector reveals Charles Montague’s desperate attempt to conceal his blackmail motive by tampering with the manor’s hourglass to create a misleading timeline."
    },
    "accepted_facts": [
      "Lady Beatrice Winthrope was discovered dead in her study at approximately half past seven in the evening.",
      "The hourglass on the mantelpiece appeared to have finished its sand flow, suggesting death occurred around half past six.",
      "All servants consistently testified to seeing Lady Beatrice alive shortly before half past six.",
      "The manor’s temperature was recorded at forty-four degrees Fahrenheit that evening.",
      "Charles Montague had access to the study and was under financial pressure.",
      "The garden gate latch was heard by multiple staff at half past six."
    ],
    "inferred_conclusions": [
      "The hourglass’s sand flow was delayed due to freezing condensation inside the glass, causing a false time reading.",
      "The actual time of death was closer to half past seven, not half past six.",
      "The consistent servant testimonies and the auditory evidence of the garden gate latch were influenced by cognitive bias and environmental factors, creating a misleading timeline.",
      "Charles Montague manipulated the hourglass’s environment to create a false timeline supporting his alibi.",
      "Other staff members’ alibis and testimonies align with the corrected timeline, eliminating them as suspects."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The sealed hourglass on the study mantelpiece contained trapped moisture that condensed and froze overnight due to the cold room temperature, causing thermal contraction of the glass and temporarily blocking sand flow. This physical effect delayed the sand from running at the true time of death, producing the false impression that Lady Beatrice died thirty minutes earlier than she actually did. Charles Montague exploited this natural physical law by subtly lowering the room temperature before the murder to ensure the condensation froze, creating a temporal misdirection. The manor’s staff and witnesses were unaware of this and thus accepted the false time reading as fact.",
      "delivery_path": [
        {
          "step": "Charles Montague lowered the study room temperature by leaving the window slightly ajar during the evening."
        },
        {
          "step": "Condensation inside the hourglass froze, contracting the glass and temporarily blocking sand flow."
        },
        {
          "step": "Lady Beatrice was murdered at actual time closer to half past seven, but the hourglass indicated half past six."
        },
        {
          "step": "Witnesses’ consistent testimonies and auditory cues reinforced the false timeline, hiding the true time of death."
        }
      ]
    },
    "outcome": {
      "result": "The false time reading delayed suspicion and misled alibis until Inspector Marwood’s logical deductions and physical evidence exposed the temporal misdirection and revealed Charles Montague as the murderer."
    }
  },
  "false_assumption": {
    "statement": "The hourglass on the mantelpiece ran its sand normally and accurately marked the time of Lady Beatrice’s death at half past six.",
    "type": "temporal",
    "why_it_seems_reasonable": "The hourglass appeared intact and completely empty of sand, all servants agreed the victim was alive shortly before half past six, and the manor’s auditory cues matched this timeline.",
    "what_it_hides": "The hourglass sand flow was delayed by frozen condensation caused by low room temperature, producing a false earlier death time and masking the actual murder time closer to half past seven."
  },
  "false_solution": {
    "accused_suspect": "James Fletcher",
    "supporting_points": [
      "James Fletcher was seen near the garden gate at half past six when the gate latched, apparently providing opportunity.",
      "His nervous behavior and evasiveness suggested guilt."
    ],
    "the_one_flaw": "The auditory evidence of the garden gate latch was influenced by echo and wind direction, causing a misperception of timing that invalidates James Fletcher’s supposed opportunity.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "James Fletcher was seen near the garden gate around half past six, suggesting he had opportunity to commit the murder.",
      "points_at_suspect": "James Fletcher",
      "innocent_explanation": "Wind direction shifted causing witnesses to misjudge the timing of the garden gate latch sound; James was actually away from the study at the murder time.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Margaret Hensley displayed tense behavior and subtle evasions during questioning, implying possible motive and concealment.",
      "points_at_suspect": "Margaret Hensley",
      "innocent_explanation": "Her tension arose from personal relationship complications unrelated to the murder; she was occupied in the servants’ quarters during the murder.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Charles Montague",
      "Margaret Hensley",
      "Edward Winthrope",
      "Clara Simmons",
      "James Fletcher"
    ],
    "rationale": "All other persons including Inspector Marwood and Lady Beatrice are either investigator or victim; all suspects had access and motive constrained within the manor estate; no outsiders had opportunity due to estate isolation and locked gates."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Half past six: Hourglass indicates death time",
        "Half past seven: Body discovered",
        "Quarter past six: Margaret Hensley last saw Lady Beatrice alive",
        "Half past six: Garden gate latch sound heard"
      ],
      "windows": [
        "Between quarter past six and half past seven: Possible murder window",
        "Between quarter past five and six: Margaret Hensley's alibi window",
        "Between six and half past six: Edward Winthrope's alibi window"
      ],
      "contradictions": [
        "Hourglass empty but room temperature too low for normal sand flow",
        "Servants' consistent testimony conflicts with physical evidence of delayed sand flow",
        "Garden gate latch time conflicts with corrected time of death"
      ]
    },
    "access": {
      "actors": [
        "Charles Montague",
        "Margaret Hensley",
        "Edward Winthrope",
        "Clara Simmons",
        "James Fletcher"
      ],
      "objects": [
        "Sealed hourglass",
        "Heavy antique paperweight",
        "Garden gate latch",
        "Study room window"
      ],
      "permissions": [
        "Charles Montague: Full access to study and hourglass",
        "Edward Winthrope: Authorized access and control over room scheduling",
        "Margaret Hensley: Access to victim's chambers",
        "James Fletcher: Access to garden and side door",
        "Clara Simmons: Kitchen and occasional study access"
      ]
    },
    "physical": {
      "laws": [
        "Thermal contraction of glass with freezing moisture delays sand flow",
        "Auditory perception affected by wind direction and echo in garden",
        "Sand flow in hourglass can be physically blocked by condensation"
      ],
      "traces": [
        "Minute frost crystals inside hourglass glass surface",
        "Damp spot on hourglass base matching condensation pattern",
        "Faint scratch on study window latch consistent with deliberate slight opening"
      ]
    },
    "social": {
      "trust_channels": [
        "Servants' overlapping shifts and testimonies",
        "Formal reporting to estate manager",
        "Lady Beatrice’s interactions with personal attendant"
      ],
      "authority_sources": [
        "Edward Winthrope’s estate ownership",
        "Charles Montague’s managerial role",
        "Inspector Marwood’s police authority"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The hourglass on the study mantelpiece contains minute frost crystals visible on the inner glass surface.",
        "correction": "The presence of frost crystals indicates condensation froze inside the hourglass, causing temporary blockage of sand flow.",
        "effect": "Narrows the possible time of death to after the hourglass stopped flowing; eliminates assumptions about normal hourglass timing.",
        "required_evidence": [
          "Minute frost crystals inside hourglass glass surface",
          "Temperature reading of the study room at forty-four degrees Fahrenheit",
          "Hourglass empty of sand despite cold temperature"
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint scratch on the study room window latch indicates it was left slightly ajar during the evening.",
        "correction": "A slightly open window allowed cold air in, lowering the room temperature enough to freeze moisture inside the hourglass.",
        "effect": "Narrows access and opportunity to suspects with study room access and knowledge; eliminates suspects without study access.",
        "required_evidence": [
          "Faint scratch on study window latch",
          "Access permissions showing Charles Montague and Edward Winthrope have study access",
          "Temperature readings showing low room temperature"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses agree the garden gate latched at half past six, but wind direction logs show a shift causing echo distortions at that time.",
        "correction": "The auditory perception of the gate latch time was misjudged due to environmental acoustics, invalidating the timeline based on gate sounds.",
        "effect": "Eliminates James Fletcher from suspect pool based on faulty timing assumptions.",
        "required_evidence": [
          "Wind direction logs showing shift during evening",
          "Servant testimony expressing confusion about gate closing time",
          "Garden gate latch sound heard by multiple witnesses"
        ],
        "reader_observable": true
      },
      {
        "observation": "Charles Montague was observed near the study shortly before half past seven and had motive due to blackmail threats from Lady Beatrice.",
        "correction": "Charles had both motive and opportunity within the corrected timeline of the murder after the hourglass stopped flowing.",
        "effect": "Identifies Charles Montague as the narrowed prime suspect.",
        "required_evidence": [
          "Charles Montague’s financial troubles and blackmail motive",
          "Charles Montague’s access to study and hourglass",
          "Witness accounts placing Charles near study at corrected murder time"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "constraint_proof",
    "design": "A controlled temperature test is conducted by placing a sealed hourglass identical to the manor's in a cold room at forty-four degrees Fahrenheit and then warming it to room temperature to observe the delay of sand flow caused by frozen condensation, proving the hourglass reading was artificially delayed and invalidating the assumed time of death.",
    "knowledge_revealed": "The revealed facts are hourglas, study, and mantelpiece.",
    "pass_condition": "If the hourglass at low temperature shows delayed sand flow identical to the manor hourglass, the original timeline is invalid, confirming the murder occurred later than initially believed.",
    "evidence_clues": [
      "clue_12",
      "clue_mechanism_visibility_core",
      "clue_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The frost crystals and low room temperature (early clues) reveal the physical cause for the hourglass delay. Step 2: The scratched window latch and documented room temperature (mid clues) link the suspect’s access and opportunity. Step 3: Wind direction logs and servant notes (mid clues) correct the auditory timeline, clearing James Fletcher. Step 4: Charles Montague’s presence and motive (late clues) focus suspicion. The discriminating test recreates the hourglass delay, confirming the false timeline and identifying Charles as culprit."
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
        "Execute the controlled temperature hourglass test",
        "Observe the delayed sand flow caused by frozen condensation",
        "Draw conclusion about the false elapsed time reading",
        "Link test results to Charles Montague’s manipulation"
      ],
      "test_type": "constraint_proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "James Fletcher",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Invalidation of auditory timeline by wind and echo analysis",
        "supporting_clues": [
          "Wind direction logs showing shift during evening",
          "Servant testimony on gate latch confusion"
        ]
      },
      {
        "suspect_name": "Margaret Hensley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi matching servants' shift overlapping and personal attestations",
        "supporting_clues": [
          "Servants’ shift logs",
          "Margaret’s testimony and demeanor analysis"
        ]
      },
      {
        "suspect_name": "Edward Winthrope",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmation via formal scheduled meetings",
        "supporting_clues": [
          "Estate meeting logs",
          "Witness statements confirming Edward’s presence"
        ]
      },
      {
        "suspect_name": "Clara Simmons",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Kitchen attendance records and lack of study access",
        "supporting_clues": [
          "Kitchen logs",
          "Access permissions"
        ]
      },
      {
        "suspect_name": "Lady Beatrice Winthrope",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with physical evidence and temporal contradiction exposed by hourglass test"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_core_contradiction_chain",
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
        "clue_id": "clue_19",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_20",
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
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_charles_montague",
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
    "name": "Inspector Helen Marwood",
    "summary": "A seasoned Scotland Yard detective navigating the treacherous waters of aristocratic privilege while seeking justice.",
    "publicPersona": "Inspector Helen Marwood projects an air of unwavering professionalism, her sharp mind and no-nonsense approach earning grudging respect even among the highborn. She is methodical and precise, never allowing sentiment to cloud her judgement, and is known for her clipped speech and keen eye for detail.",
    "privateSecret": "Beneath her steely exterior, Helen wrestles with the political pressure from her superiors who urge a quiet resolution to protect the upper class, forcing her to balance her duty against the subtle demands of society’s elite.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "impossible",
    "stakes": "Her professional reputation and the principle of justice itself hang in the balance, challenged by the societal constraints that seek to shield the guilty among the gentry.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks in measured, economical sentences with a sharpness that cuts through obfuscation. Employs subtle irony and dry observations, often delivering pointed remarks that reveal more than they say. Avoids unnecessary embellishment, preferring clarity and precision.",
    "signatureTic": "\"Let’s be clear,\"",
    "internalConflict": "Helen struggles with the tension between her commitment to impartial justice and the covert political pressures to protect the aristocracy, fearing that yielding would betray her own principles and the victim’s memory.",
    "personalStakeInCase": "This investigation represents more than a case; it is a test of her integrity and resolve to uphold justice in a world where power and privilege often shield wrongdoing.",
    "paragraphs": [
      "Inspector Helen Marwood arrived at Winthrope Manor with the weight of her experience evident in every step. Years at Scotland Yard had honed her instincts, yet the manor’s opulence and the delicate social tapestry presented a new challenge. She was no stranger to high society, but the unspoken rules that governed it were obstacles she had to navigate with care.",
      "Her interactions with the estate’s inhabitants were marked by a cool professionalism that sometimes bordered on aloofness. She listened more than she spoke, her sharp eyes missing nothing, from furtive glances to the hesitation in a well-rehearsed alibi. Humor, when it surfaced, was dry and understated—a weapon to defuse tension or expose pretense.",
      "Behind closed doors, Helen’s mind wrestled with the subtle pressures exerted by her superiors. They preferred the scandal to be buried quietly, the aristocracy’s reputation preserved. Yet Helen’s moral compass pointed unerringly toward truth, no matter how uncomfortable. This internal battle added a layer of urgency and unease to her work.",
      "As the investigation unfolded, Helen found herself confronting not only the suspects but also her own doubts and fears. The case was a crucible testing her resolve—would she bend to the invisible forces shielding the guilty, or would she uphold the law with unflinching courage? The answer would define her career and conscience.",
      "Her speech was precise, her questions incisive, and her demeanor unyielding. ‘Let’s be clear,’ she would say, cutting through evasions with surgical efficiency. This phrase became her hallmark, a reminder to all that beneath the genteel veneer of Winthrope Manor, the truth would not be obscured."
    ],
    "order": 1
  },
  {
    "name": "Lady Beatrice Winthrope",
    "summary": "The elegant and philanthropic matriarch of Winthrope estate, whose death unveils secrets threatening the family’s legacy.",
    "publicPersona": "Lady Beatrice was the embodiment of grace and dignity, a beloved figure in society known for her charitable endeavors and impeccable bearing. She spoke with measured warmth and a cultivated accent, commanding respect and admiration effortlessly.",
    "privateSecret": "Behind the polished facade, she harbored a painful secret: her intention to disinherit her secret lover, Charles Montague, upon uncovering his deceit, a decision that would upheave the estate’s inheritance and social standing.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "impossible",
    "stakes": "Her planned will would not only alter fortunes but threaten to expose scandalous liaisons, endangering the family’s carefully curated reputation.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Speaks with refined poise and a gentle cadence, often employing subtle understatement to convey meaning. Her words carry a quiet authority, and she chooses them with care, revealing depth beneath her composed surface.",
    "signatureTic": "\"One must simply endure,\"",
    "internalConflict": "Lady Beatrice wrestled with the conflict between protecting the family name and following her own heart, knowing that truth might bring ruin yet feeling compelled to act with integrity.",
    "personalStakeInCase": "Though the victim, her choices and secrets are the fulcrum upon which the entire mystery pivots, her death a catalyst for upheaval within the estate and society.",
    "paragraphs": [
      "Lady Beatrice Winthrope moved through the grand halls of her estate with a serene elegance that belied the storm brewing beneath. Her philanthropic reputation was a shield she wielded skillfully, masking the personal turmoil of love and betrayal that shadowed her final days.",
      "Her voice was soft yet firm, a melody of cultivated restraint. She often employed understatement, a hallmark of her aristocratic upbringing, to veil the sharpness of her convictions. ‘One must simply endure,’ she would murmur when confronted with hardship, a phrase that encapsulated her stoic determination.",
      "The revelation of her plan to disinherit Charles Montague was a secret she guarded jealously, aware that its exposure could fracture the estate’s delicate social order. Her private struggle between duty and desire was a silent drama played out in whispered confidences and furtive glances.",
      "Her death cast a long shadow, unraveling the threads of secrecy and ambition that entwined the household. Though she was absent, her presence was felt in every whispered accusation and every guarded confession, her choices shaping the fates of those left behind.",
      "Her genteel speech and composed demeanor made her a figure both admired and enigmatic, the quintessential matriarch whose final act would unsettle the very foundations of Winthrope Manor."
    ],
    "order": 2
  },
  {
    "name": "Charles Montague",
    "summary": "The ambitious estate manager entangled in a secret affair, whose social climbing masks desperate stakes.",
    "publicPersona": "Charles presents as the consummate professional—efficient, loyal, and unflappable. His speech is polished, with a practiced ease that suggests confidence and control, befitting a man aspiring beyond his station.",
    "privateSecret": "His clandestine relationship with Lady Beatrice is driven by a desire to transcend his humble origins, but the discovery of his true ambitions threatens his future and standing.",
    "motiveSeed": "His entire social ascent and financial security depend on Lady Beatrice’s silence and survival; exposure would shatter his dreams.",
    "motiveStrength": "compelling",
    "alibiWindow": "Was supposedly managing the stables from 8 PM to 9 PM, yet no witnesses can confirm this, leaving his alibi tenuous.",
    "accessPlausibility": "easy",
    "stakes": "Charles’s future hinges on maintaining the façade of loyalty and discretion, with everything to lose if his ambitions are revealed.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "His tone is smooth and urbane, with a penchant for veiled barbs and subtle sarcasm delivered with a courteous smile. He often employs genteel irony, masking sharp observations beneath polite conversation.",
    "signatureTic": "\"Naturally,\"",
    "internalConflict": "Charles grapples with the tension between genuine affection for Lady Beatrice and the ruthless calculation required to secure his place among the elite, fearing exposure will undo all he has worked for.",
    "personalStakeInCase": "The investigation threatens not only his freedom but the very future he has schemed to build, making the stakes intensely personal and urgent.",
    "paragraphs": [
      "Charles moved through the manor with the easy confidence of a man accustomed to control, yet beneath the polished exterior lurked a restless ambition. His role as estate manager was both a platform and a cage, offering proximity to power but reminding him constantly of his origins.",
      "His speech was laced with polite savagery—compliments that cut like knives, and irony wrapped in silk. ‘Naturally,’ he would say, as if the most inconvenient truths were mere inconveniences easily brushed aside. This manner endeared him to some and alienated others, revealing a complex social tactician.",
      "The secret affair with Lady Beatrice was both his greatest triumph and his gravest risk. He coveted the social elevation it promised but knew the precariousness of his position should the truth emerge. His alibi, managing the stables alone, was a fragile shield against suspicion.",
      "Charles’s internal struggle was palpable—a man torn between love and ambition, loyalty and self-preservation. Each interaction was a calculated move in a game whose stakes were his very future, and failure was unthinkable.",
      "In the shadowed corners of Winthrope Manor, Charles’s polished veneer sometimes cracked, revealing the desperation beneath the charm and wit. His story was one of aspiration shadowed by the ever-present threat of downfall."
    ],
    "order": 3
  },
  {
    "name": "Margaret Hensley",
    "summary": "The devoted lady’s maid whose unrequited love and jealousy fuel a complex emotional tempest.",
    "publicPersona": "Margaret appears as the faithful and diligent maid, her speech plain and earnest, marked by a slight nervousness that betrays her deeper turmoil. She is careful with words, often hedging and softening statements.",
    "privateSecret": "Her concealed passion for Lady Beatrice and hatred for Charles Montague’s intrusion into her mistress’s affections drive her darker impulses.",
    "motiveSeed": "Fearing dismissal upon Lady Beatrice’s marriage and resenting Charles, Margaret’s jealousy provides a motive to disrupt their relationship and remove his influence.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been cleaning the east wing between 8:30 PM and 9 PM, but the open windows might have allowed movement unnoticed.",
    "accessPlausibility": "possible",
    "stakes": "Her livelihood and emotional world depend on Lady Beatrice’s favor, entwining professional survival with personal obsession.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Margaret’s speech is hesitant, often punctuated by little laughs to mask discomfort. She uses fillers and repeats herself when nervous, with a tendency to downplay her own feelings through modesty and self-effacement.",
    "signatureTic": "\"I mean, it’s just that...\"",
    "internalConflict": "Margaret is torn between loyalty to her mistress and the corrosive jealousy that clouds her judgment, fearing the loss of both love and livelihood.",
    "personalStakeInCase": "The outcome threatens her place in the household and the fragile hope she clings to, making the investigation a personal crucible of emotion and survival.",
    "paragraphs": [
      "Margaret moved quietly through the manor’s corridors, her hands busy with dusters and cloths but her mind restless. Her devotion to Lady Beatrice was genuine, yet shadowed by a painful jealousy that she struggled to conceal even from herself.",
      "Her speech betrayed her inner turmoil—hesitant and self-effacing, she would often begin explanations with, ‘I mean, it’s just that...’ as if searching for words to express feelings she scarcely admitted. This nervous cadence contrasted with the precise efficiency of her duties.",
      "The knowledge of Lady Beatrice’s affair with Charles was a wound that festered in silence. Margaret’s fear of dismissal and her resentment towards Charles’s influence created a volatile mix of emotions, driving her to contemplate desperate measures.",
      "Her alibi was plausible but fragile; the open windows of the east wing left room for doubt. This ambiguity mirrored her own conflicted state—caught between duty, desire, and the dangerous allure of revenge.",
      "Margaret’s story is one of unspoken longing and the painful reckoning that comes when love is unreturned. Her journey through the investigation may lead to acceptance or a darker path fueled by obsession."
    ],
    "order": 4
  },
  {
    "name": "Edward Winthrope",
    "summary": "The stern elder brother, protector of family honor, whose rigid values clash with the changing tides.",
    "publicPersona": "Edward speaks with a clipped, military precision, his tone authoritative and sometimes brusque. His words are measured, reflecting his background as a retired army officer and his sense of duty to uphold tradition.",
    "privateSecret": "His simmering resentment at Lady Beatrice’s plans to redistribute the estate and his disdain for her lover’s lowly status fuel a dangerous determination to preserve the family legacy at all costs.",
    "motiveSeed": "Strong desire to prevent scandal and maintain aristocratic control, making him a formidable suspect with both motive and means.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been drinking at the village pub from 7 PM to 9 PM, but witness accounts are vague and imprecise regarding timing.",
    "accessPlausibility": "possible",
    "stakes": "His identity and honor are intertwined with the estate’s preservation, making the crime deeply personal and a fight for the old order.",
    "humourStyle": "blunt",
    "humourLevel": 0.2,
    "speechMannerisms": "Edward’s speech is terse and direct, often cutting to the heart of matters without ornament. He uses military jargon occasionally and can come across as intimidating. His humor is sparse and blunt, sometimes unintentionally harsh.",
    "signatureTic": "\"That’s non-negotiable,\"",
    "internalConflict": "He battles the fear that the family’s legacy will be irreparably damaged by change, struggling to reconcile love for his sister with his rigid principles.",
    "personalStakeInCase": "The investigation threatens the future of the Winthrope name and his place within it, making the stakes intensely personal and emotional.",
    "paragraphs": [
      "Edward Winthrope carried himself with the bearing of a man accustomed to command, his every word heavy with the weight of tradition and discipline. His speech was clipped, reflecting years in the army, and he did not suffer fools gladly.",
      "He was openly critical of Lady Beatrice’s intentions, viewing her plans as reckless and a betrayal of the family’s honor. ‘That’s non-negotiable,’ he would assert, leaving no room for debate when it came to the estate’s legacy.",
      "His resentment towards Charles Montague was no secret; to Edward, the estate manager was an interloper, a social climber unworthy of the family’s trust. This disdain fueled his motive, making him a suspect with both passion and principle.",
      "His alibi, time spent drinking at the village pub, was supported only by uncertain memories, leaving gaps that invited suspicion. These ambiguities mirrored his own internal struggle—between loyalty to blood and the fear of losing control.",
      "Edward’s blunt manner could alienate allies and intimidate foes, but beneath the stern exterior lay a man grappling with profound loss and the shifting sands of a changing world. His role in the mystery is that of a guardian fighting to preserve a fading order."
    ],
    "order": 5
  },
  {
    "name": "Clara Simmons",
    "summary": "The pragmatic housekeeper whose knowledge of secrets and quiet control make her a key figure in the household’s fragile balance.",
    "publicPersona": "Clara’s manner is straightforward and no-nonsense, her voice steady and calm. She commands respect through competence rather than charm, speaking plainly and without affectation.",
    "privateSecret": "She is privy to illicit affairs and financial troubles but guards these confidences carefully to maintain her position and influence within the household.",
    "motiveSeed": "Fears that Lady Beatrice’s reforms would expose her complicity and jeopardize her livelihood, providing a subtle yet real motive.",
    "motiveStrength": "weak",
    "alibiWindow": "Was overseeing kitchen staff from 8 PM to 9 PM, a timeline confirmed by multiple witnesses, making her involvement less likely.",
    "accessPlausibility": "unlikely",
    "stakes": "Her control over the household’s order and her own security depend on the stability Lady Beatrice maintained, making the crime a threat to her carefully managed world.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Clara’s speech is plainspoken and pragmatic, often punctuated by dry observations about human nature and the quirks of aristocratic life. She uses humour sparingly but effectively to lighten tense moments.",
    "signatureTic": "\"Well, you see,\"",
    "internalConflict": "She balances loyalty to the family with the need to protect herself, often questioning how far complicity can be tolerated before survival demands sacrifice.",
    "personalStakeInCase": "The investigation threatens the delicate order she maintains and the secrets she guards, making the outcome vital for her continued influence.",
    "paragraphs": [
      "Clara Simmons moved through the manor with quiet authority, her presence steadying the household’s daily rhythm. Her voice was calm, her words chosen with the economy of someone accustomed to managing crises without fuss.",
      "She was the keeper of secrets, aware of illicit liaisons and financial strains yet bound by a tacit agreement to preserve appearances. ‘Well, you see,’ she would begin, delivering dry observations that cut through pretension with understated wit.",
      "Her alibi was solid; overseeing the kitchen staff left little room for doubt about her whereabouts during the crucial hour. Yet her knowledge of the estate’s hidden troubles made her a figure of interest—someone who might act to protect her own position.",
      "Clara’s internal conflict centered on the tension between loyalty and self-preservation. She understood the precariousness of her role and the dangers of exposure, walking a fine line between silence and survival.",
      "Her pragmatic humour and steady presence made her a pillar amid the storm, a confidante whose insights might prove invaluable or incriminating as the investigation unfolded."
    ],
    "order": 6
  },
  {
    "name": "James Fletcher",
    "summary": "The ambitious young lawyer whose discovery of forged documents entangles him in dangerous intrigue.",
    "publicPersona": "James is eager and articulate, speaking with the polished enthusiasm of a solicitor keen to impress. His tone is confident but sometimes slides into nervousness when pressed, revealing the pressure of his precarious position.",
    "privateSecret": "He recently uncovered forged will documents implicating powerful family members, a secret that could upend the estate’s future and his career.",
    "motiveSeed": "Had much to gain if the victim’s death prevented exposure of the forgeries, both financially and professionally.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been drafting contracts alone in his office from 8 PM to 9 PM, but no witnesses can confirm this solitary alibi.",
    "accessPlausibility": "possible",
    "stakes": "His reputation and career advancement depend on controlling sensitive information, making the crime a pivotal moment in his ambitions.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "James speaks with youthful energy, often using legal jargon and formal phrases. He occasionally stumbles over words when nervous, and his enthusiasm can verge on over-eagerness. His humour surfaces as witty observations about social pretensions.",
    "signatureTic": "\"If I may say so,\"",
    "internalConflict": "James wrestles with the ethical dilemma of exposing corruption versus protecting his career, fearing the consequences of either path.",
    "personalStakeInCase": "His future hinges on the outcome; the case is both a professional trial and a moral crossroads.",
    "paragraphs": [
      "James Fletcher approached the investigation with a blend of youthful zeal and cautious calculation. His speech was peppered with legal phrases, and he often prefaced statements with, ‘If I may say so,’ betraying both eagerness and a desire to appear respectful.",
      "His recent discovery of forged documents concerning the estate’s will placed him in a precarious position. The knowledge was a double-edged sword—potential leverage for advancement or a dangerous secret that could ruin him if mishandled.",
      "His alibi, solitary and uncorroborated, left room for suspicion, and his nervous energy sometimes betrayed the weight of his predicament. Despite this, he maintained a veneer of professionalism, keen to impress both the family and the inspector.",
      "James’s humour was subtle, often manifesting as pointed remarks about the eccentricities of aristocratic behavior, a coping mechanism for the pressures he faced. Beneath the surface, he wrestled with the moral implications of his choices, caught between ambition and conscience.",
      "His role in the mystery is that of a young man at a crossroads, whose decisions could alter not only his destiny but the fate of Winthrope Manor itself."
    ],
    "order": 7
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Winthrope Manor Estate",
    "type": "Manor house estate",
    "place": "Ashcombe Vale",
    "country": "England",
    "summary": "An imposing 1930s country manor nestled in the remote Ashcombe Vale, surrounded by farmland and dense woodland, where rigid social order and isolation converge beneath autumn mists.",
    "visualDescription": "A sprawling stone manor crowned with tall chimneys and leaded glass mullioned windows, encircled by high ivy-clad stone walls and wrought iron gates. The estate’s gravel drives wind between clipped yews and ancient oaks, leading to outbuildings including stables and staff quarters, all set against a backdrop of rolling fields fading into fog.",
    "atmosphere": "The manor exudes a genteel yet somber presence, its grand facades softened by creeping mist and the muted palette of autumn. Isolation deepens as dusk falls, with distant woodlands swallowing sound and the intermittent drip of drizzle on slate roofs punctuating the stillness.",
    "paragraphs": [
      "Winthrope Manor Estate sits several miles from the nearest village, its formidable stone walls and wrought iron gates a steadfast barrier against the encroaching wilds of Ashcombe Vale. The manor’s architecture is a study in restrained elegance: tall chimneys pierce a slate roof, while leaded glass windows reveal flickering candlelight within. Gravel drives curve through precisely clipped yew hedges, guiding visitors past ancient oaks and through gardens that hum quietly with autumn’s decay.",
      "Inside, the manor’s interior is a tapestry of dark oak panelling, plush yet faded upholstery, and heavy drapes that dampen the chill drafts seeping through the thick stone walls. The atmosphere is layered with the scent of polished brass, worn leather, and the faint mustiness of aged paper. Rooms are partitioned to maintain strict social hierarchies, with locked private chambers and discreet servant passages ensuring the separation of classes and secrets alike.",
      "The estate’s isolation is palpable; the nearest steam train station lies miles away, and telephone communications rely on a domestic wired party-line system that often compromises privacy. Petrol touring cars are rare sights on the narrow country roads, while telegrams and letters remain the principal means of urgent communication. As autumn evenings draw in, intermittent drizzle and fog cloak the grounds, heightening the sense of seclusion and latent tension beneath the manor’s genteel surface.",
      "Daily life unfolds with ritual precision, governed by formal schedules and etiquette that reinforce the social order. The staff quarters bustle with quiet efficiency before dawn, while the drawing room hosts subdued gatherings where economic uncertainty and subtle class anxieties simmer beneath polite conversation. In such a setting, every creak of floorboard or whispered footfall carries weight, and the frost-laden hourglass of fate ticks inexorably."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "cool autumn evening with intermittent drizzle typical of English countryside",
    "timeFlow": "Three days of mounting tension unfolding from late afternoon through the deepening night",
    "mood": "quiet, tense undercurrent beneath genteel social interactions, reflecting economic uncertainty and subtle class anxiety",
    "eraMarkers": [
      "domestic wired telephones with party-line exchanges",
      "manual typewriters for correspondence and record-keeping",
      "battery-powered portable radios for news and entertainment",
      "petrol touring cars on estate and country roads",
      "passenger steam trains connecting nearest town and city hubs",
      "telegrams sent via nearest post office with typical delays",
      "telephone calls subject to party-line privacy limitations"
    ],
    "sensoryPalette": {
      "dominant": "damp stone and wood smoke",
      "secondary": [
        "faint candle wax and leather",
        "rustling autumn leaves and distant rain"
      ]
    },
    "paragraphs": [
      "The cool autumn air carries the persistent scent of damp stone and wood smoke from manor chimneys, mingling with the faint sweetness of candle wax and aged leather. Outside, rain softly drums on slate roofs while rustling leaves scatter across gravel drives. The intermittent drizzle blurs the edges of the sprawling estate, wrapping it in a whispering hush that deepens the isolation and sharpens the senses.",
      "Within the manor, the muted crackle of a hearth fire competes with the occasional creak of floorboards and the hushed murmur of voices observing strict etiquette. The faint mechanical clatter of a manual typewriter and the distant buzz of a battery-powered radio punctuate moments of stillness. These layered sounds and scents create a tapestry of a world poised delicately between tradition and change, where every detail hints at secrets waiting beneath the surface."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Winthrope Manor Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A high-ceilinged room lined with dark oak bookshelves filled with leather-bound volumes, a large Persian rug muffling footsteps, and tall leaded glass windows facing the misty gardens. A heavy mahogany desk sits near a flickering brass lamp, papers strewn about.",
      "sensoryDetails": {
        "sights": [
          "flickering brass lamp glow",
          "shadowed bookshelves and spines",
          "rain-streaked leaded glass windows",
          "scattered typed manuscripts",
          "dust motes in pale lamplight",
          "deep burgundy Persian rug"
        ],
        "sounds": [
          "soft patter of rain outside",
          "quiet rustle of paper",
          "occasional creak of settling wood",
          "distant ticking of a mantel clock",
          "faint crackle of dying fire"
        ],
        "smells": [
          "musty leather bindings",
          "old polished wood",
          "faint ink and paper",
          "smoky embers from hearth",
          "damp autumn leaves"
        ],
        "tactile": [
          "smooth cool brass lamp base",
          "rough leather book covers",
          "worn velvet armchair",
          "crisp typed paper edges",
          "chilled stone hearth surround"
        ]
      },
      "accessControl": "Access restricted to family and select staff during daylight hours; locked at night with only housekeeper and butler holding keys; entry logged at gatehouse.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through rain",
            "wet garden foliage visible",
            "damp wooden floorboards",
            "glossy spines glistening faintly"
          ],
          "sounds": [
            "steady rain tapping windowpanes",
            "water dripping from eaves",
            "soft rustle of turning pages",
            "muffled footsteps on carpet"
          ],
          "smells": [
            "fresh rain on stone",
            "wet earth and moss",
            "damp paper and ink",
            "cool wood polish"
          ],
          "mood": "somber introspection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter daylight",
            "shadows pooling in corners",
            "dust settling on surfaces",
            "dim lamplight unlit"
          ],
          "sounds": [
            "silence broken by distant clock chime",
            "soft sighs of wind outside",
            "pages softly turning",
            "creaking leather armchair"
          ],
          "smells": [
            "aged leather and dust",
            "woodsmoke faint on breeze",
            "old paper and ink",
            "slightly stale air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm candlelight flicker",
            "glint of brass fittings",
            "moonlight through window panes"
          ],
          "sounds": [
            "crackling fire in hearth",
            "soft ticking clock",
            "whispered voices from corridor",
            "rustle of fabric"
          ],
          "smells": [
            "burning beeswax candles",
            "smoky fireplace ash",
            "rich leather and old paper",
            "faint scent of pipe tobacco"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Winthrope Manor Library is a sanctuary of quiet contemplation, its walls lined with towering shelves of leather-bound tomes that absorb the flickering glow of a brass lamp. The heavy Persian rug softens footsteps, while the tall leaded glass windows frame the misty gardens beyond, muffling the faint patter of rain. Scattered papers and typed manuscripts lie abandoned on a mahogany desk, hinting at interrupted thoughts and secrets.",
        "This room’s atmosphere is thick with the scent of musty leather and aged wood, mingled with the faint trace of ink and smoldering fire embers. The tactile contrast between smooth brass, rough book covers, and crisp paper edges underlines the manor’s blend of elegance and hidden tension. Access is tightly controlled, with keys held only by trusted staff, ensuring the room remains a guarded repository of knowledge and mystery."
      ]
    },
    {
      "id": "servants_quarters",
      "name": "Servants’ Quarters",
      "type": "interior",
      "purpose": "Staff living and working area",
      "visualDetails": "A narrow corridor with peeling wallpaper and simple wooden doors leading to small, sparsely furnished rooms. A communal wash basin stands at one end, with a dim gas fixture overhead. The area is functional, worn by years of constant use.",
      "sensoryDetails": {
        "sights": [
          "faded floral wallpaper",
          "scuffed wooden floorboards",
          "dim gaslight flickering",
          "threadbare woollen blankets",
          "stacked enamel washbasins"
        ],
        "sounds": [
          "clinking of metal utensils",
          "low murmurs and hushed footsteps",
          "creaking bedframes",
          "soft rustle of coarse fabric",
          "distant clatter from kitchens"
        ],
        "smells": [
          "stale soap and damp linen",
          "boiling stew and frying fat",
          "smoky kitchen hearth",
          "faint scent of mothballs",
          "damp wool and earth"
        ],
        "tactile": [
          "rough cotton bedcovers",
          "cool iron bedframes",
          "chipped enamel basin edges",
          "grainy plaster walls",
          "worn wooden chair seats"
        ]
      },
      "accessControl": "Staff-only area; visitors strictly prohibited. Entry monitored by housekeeper; off-limits after lights-out hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through small panes",
            "damp patches on walls",
            "glossy floorboards"
          ],
          "sounds": [
            "steady rain on roof",
            "soft footsteps on wood",
            "clinking breakfast utensils"
          ],
          "smells": [
            "freshly boiled water",
            "wet wool and soap",
            "smoke from kitchen fire"
          ],
          "mood": "quiet industriousness"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "muted daylight filtering in",
            "shadows in corners",
            "faded wallpaper textures"
          ],
          "sounds": [
            "distant chopping and frying",
            "low conversation",
            "occasional cough"
          ],
          "smells": [
            "boiling stew",
            "damp fabric",
            "smoky hearth"
          ],
          "mood": "weary routine"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "flickering gaslight",
            "long shadows down hallway",
            "glints on worn floorboards"
          ],
          "sounds": [
            "soft sighs and whispers",
            "creaking bedsprings",
            "distant closing doors"
          ],
          "smells": [
            "cold dampness",
            "soap residue",
            "smoky embers"
          ],
          "mood": "tired quiet"
        }
      ],
      "paragraphs": [
        "The Servants’ Quarters form a stark contrast to the manor’s opulence, consisting of narrow corridors lined with faded wallpaper and simple wooden doors leading to cramped, functional rooms. The dim flicker of gaslight barely illuminates the scuffed floorboards and threadbare furnishings, underscoring years of hard, unrelenting work.",
        "Here, the air is thick with the mingled scents of soap, damp linen, and the ever-present smoke from the kitchen hearth. Sounds of clinking utensils and hushed voices whisper through the corridors, evoking a world of quiet diligence and exhaustion. Access is tightly controlled, preserving the strict division between the staff’s world and that of the gentry."
      ]
    },
    {
      "id": "manor_gardens",
      "name": "Winthrope Manor Gardens",
      "type": "exterior",
      "purpose": "Outdoor gathering and clue discovery",
      "visualDetails": "Expansive formal gardens enclosed by high stone walls, featuring gravel paths bordered by neatly clipped box hedges, with autumnal flowerbeds fading to russet and gold. Ancient oaks and beeches stand sentinel, their leaves whispering in the cool breeze.",
      "sensoryDetails": {
        "sights": [
          "rust-red and gold foliage",
          "glossy wet gravel paths",
          "stone statues moss-covered",
          "grey sky reflected in garden pond",
          "fallen leaves spiraling softly"
        ],
        "sounds": [
          "whispering wind through leaves",
          "soft crunch of gravel underfoot",
          "distant call of a thrush",
          "drip of water from stone fountain",
          "rustle of small animals in undergrowth"
        ],
        "smells": [
          "earthy damp soil",
          "decaying leaves",
          "faint scent of late roses",
          "cold wet stone",
          "pine resin and moss"
        ],
        "tactile": [
          "rough bark of ancient trees",
          "cold smooth stone statues",
          "moist fallen leaves",
          "crisp autumn air on skin",
          "gritty gravel under shoes"
        ]
      },
      "accessControl": "Open to family and guests during daylight; locked gates after dusk; groundskeeper patrols regularly.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-dappled leaves",
            "mist rising from soil",
            "dull grey sky"
          ],
          "sounds": [
            "steady drizzle on foliage",
            "water dripping from branches",
            "soft splash in puddles"
          ],
          "smells": [
            "fresh rain on earth",
            "wet moss and stone",
            "damp leaves"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on leaves",
            "shadows muted on paths",
            "cloudy sky"
          ],
          "sounds": [
            "rustling leaves in breeze",
            "distant bird calls",
            "soft footsteps"
          ],
          "smells": [
            "moist earth",
            "faint floral decay",
            "pine resin"
          ],
          "mood": "reflective stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light on foliage",
            "long shadows from trees",
            "glint of moon on pond"
          ],
          "sounds": [
            "night insects stirring",
            "soft rustle of leaves",
            "distant owl call"
          ],
          "smells": [
            "crisp autumn air",
            "cool wet stone",
            "pine and moss"
          ],
          "mood": "quiet contemplation"
        }
      ],
      "paragraphs": [
        "The Winthrope Manor Gardens unfold as a carefully curated natural retreat, enclosed by high stone walls that shelter an array of clipped box hedges and fading autumn flowerbeds. Gravel paths wind past moss-covered statues and ancient oaks, their russet and gold leaves whispering secrets on the cool breeze. The garden pond mirrors the often-grey sky, adding a reflective calm to the surroundings.",
        "The scent of damp earth and decaying leaves mingles with faint notes of late-blooming roses and pine resin, while the soft crunch of footsteps on gravel and the gentle drip of water from stone fountains create a subtle soundscape. Access is governed by locked gates after dusk, with the groundskeeper’s regular patrols ensuring the gardens remain a place of quiet solace and occasional discovery."
      ]
    },
    {
      "id": "gatehouse",
      "name": "Estate Gatehouse",
      "type": "transitional",
      "purpose": "Entry control and visitor reception",
      "visualDetails": "A compact stone building adjacent to wrought iron gates, with a small glazed porch and a narrow window for visitor interaction. A wooden desk cluttered with visitor logs, telegrams, and a rotary telephone occupies the interior.",
      "sensoryDetails": {
        "sights": [
          "flickering gas lamp outside",
          "weathered stone walls",
          "stacked telegrams on desk",
          "rotary telephone handset",
          "iron gate mechanics"
        ],
        "sounds": [
          "creaking iron gates",
          "ringing party-line telephone",
          "footsteps on gravel",
          "rustle of paper",
          "distant carriage wheels"
        ],
        "smells": [
          "cold damp stone",
          "oil and grease from gate hinges",
          "faint tobacco smoke",
          "aged paper and ink",
          "wet leather gloves"
        ],
        "tactile": [
          "rough stone walls",
          "smooth polished wood desk",
          "cold iron gate bars",
          "crisp paper edges",
          "worn leather gloves"
        ]
      },
      "accessControl": "Monitored entry point; all visitors logged and screened; staff and residents have keyed access; gate locked after dusk except for emergencies.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-slicked stone path",
            "fog enveloping gatehouse",
            "water droplets on iron bars"
          ],
          "sounds": [
            "steady rain on roof",
            "dripping water from eaves",
            "soft gravel crunch"
          ],
          "smells": [
            "wet stone and earth",
            "damp leather",
            "cold morning air"
          ],
          "mood": "gloomy vigilance"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on stonework",
            "shadows beneath eaves",
            "pale sky"
          ],
          "sounds": [
            "occasional distant carriage",
            "soft rustle of papers",
            "muffled voices"
          ],
          "smells": [
            "oil and grease",
            "dusty paper",
            "faint tobacco"
          ],
          "mood": "watchful alertness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm gas lamp glow",
            "long shadows on gravel",
            "glint of brass fittings"
          ],
          "sounds": [
            "quiet footsteps",
            "distant hoot of owl",
            "soft gate creak"
          ],
          "smells": [
            "cool night air",
            "faint smoke",
            "aged leather"
          ],
          "mood": "tense expectation"
        }
      ],
      "paragraphs": [
        "The estate’s gatehouse stands sentinel beside wrought iron gates, a modest stone structure weathered by years of exposure to Ashcombe Vale’s autumn rains. Its small glazed porch shelters a wooden desk cluttered with visitor logs, telegrams, and a rotary telephone connected to the manor’s party-line system. Outside, a flickering gas lamp casts dancing shadows on the damp gravel.",
        "The gatehouse serves as the primary threshold between the outside world and the manor’s secluded domain. Entry is closely monitored, with all visitors logged and screened before admission. The sounds of creaking iron and distant carriage wheels mingle with the faint scent of tobacco smoke and oil from gate hinges, creating an atmosphere of watchful vigilance that intensifies as dusk falls."
      ]
    }
  ],
  "note": "",
  "cost": 0.006821491999999999,
  "durationMs": 39777
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1938,
    "month": "December",
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "December",
    "weather": [
      "Chill air with frequent intermittent drizzle typical of the English countryside",
      "Foggy mornings with low visibility over frost-hardened grass",
      "Overcast skies with brief pale winter sunlight"
    ],
    "daylight": "Short winter days with daylight from about 8:15 AM to 4:00 PM, dusk settling by late afternoon",
    "time_of_day_of_crime": "Late evening—between nine and eleven at night, when the manor has quieted after dinner and guests have retired to drawing rooms",
    "holidays": [
      "Christmas Day, December 25th",
      "Boxing Day, December 26th",
      "St. Nicholas Day, December 6th (less commonly celebrated in England but recognized by some families)"
    ],
    "seasonalActivities": [
      "Trimming the manor’s Christmas tree with handmade and imported glass ornaments",
      "Gathering indoors for fireside storytelling and card games after dark",
      "Attending or hosting formal Christmas dinners and charity balls within the local gentry"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Dark single-breasted suits in worsted wool with peaked lapels",
        "Starched white detachable collars paired with silk cravats or conservative ties",
        "Polished leather Oxford shoes with spats for outdoor wear"
      ],
      "casual": [
        "Tweed sports jackets with elbow patches for estate walks",
        "Knitted wool argyle socks paired with sturdy brogues",
        "Heavy wool overcoats with velvet collars for cold weather"
      ],
      "accessories": [
        "Pocket watches with engraved silver cases",
        "Felt trilby hats or homburgs",
        "Leather gloves lined with cashmere"
      ]
    },
    "womensWear": {
      "formal": [
        "Long-sleeved evening gowns in deep jewel tones with modest shoulder pads",
        "Fur-trimmed coats made of mink or fox for travel and outdoor events",
        "Beaded clutch purses and silk stockings with seams"
      ],
      "casual": [
        "Wool jersey day dresses with pleated skirts and Peter Pan collars",
        "Knitted wool cardigans and scarves in muted colors",
        "Sturdy leather ankle boots with low heels"
      ],
      "accessories": [
        "Cloche hats decorated with velvet ribbons or feathers",
        "Pearl necklaces and brooches featuring Art Deco motifs",
        "Long leather gloves for formal outings"
      ]
    },
    "trendsOfTheMoment": [
      "Return to more conservative and tailored silhouettes after mid-decade experimentation",
      "Popularity of fur trims and accessories as status symbols despite economic caution",
      "Widespread use of knitted wool garments for warmth and practicality"
    ],
    "socialExpectations": [
      "Men expected to wear formal attire for evening events and maintain impeccable grooming",
      "Women required to dress modestly yet elegantly, reflecting family standing",
      "Servants and staff to wear designated uniforms and deferential behavior at all times"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Munich Agreement signed in late September 1938, heightening anxiety over European peace",
      "Growing debate in Britain over rearmament and military preparedness",
      "Economic pressures from lingering Great Depression effects causing estate financial strain"
    ],
    "politicalClimate": "A tense yet outwardly calm Britain, balancing appeasement policies with rising fears of war; Conservative government under Neville Chamberlain focusing on peace but facing criticism",
    "economicConditions": "Slow recovery with high unemployment in industrial areas; landed gentry increasingly reliant on reduced estate incomes and cautious investments",
    "socialIssues": [
      "Class tensions heightened by economic uncertainty but public decorum maintained",
      "Discussion around women’s roles evolving with more entering workforce but traditional expectations prevail",
      "Concerns about social unrest and political extremism in Europe influencing local attitudes"
    ],
    "internationalNews": [
      "Reports on Nazi Germany’s aggressive expansion and rhetoric against Czechoslovakia",
      "Coverage of the Spanish Civil War’s nearing conclusion and impacts on European politics"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby – 'Small Fry'",
        "Glenn Miller Orchestra – 'Pennsylvania 6-5000'",
        "Vera Lynn – early recordings gaining popularity"
      ],
      "films": [
        "The Adventures of Robin Hood (starring Errol Flynn)",
        "Bringing Up Baby (Katharine Hepburn and Cary Grant comedy)",
        "You Can’t Take It With You (Frank Capra's comedy)"
      ],
      "theater": [
        "Noël Coward’s plays continuing to draw London audiences",
        "West End productions of light musical comedies and revues",
        "Serious drama reflecting social tensions gaining modest attention"
      ],
      "radio": [
        "BBC Home Service’s 'Monday Night at Seven' variety program",
        "Children’s Hour featuring storytelling and educational content",
        "News bulletins emphasizing European developments and domestic affairs"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s 'Appointment with Death' (1938)",
        "George Orwell’s 'Homage to Catalonia' (published 1938)",
        "Daphne du Maurier’s 'Rebecca' nearing completion, to be published 1938/39"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Social realist novels addressing contemporary issues",
        "Romantic fiction with escapist themes"
      ]
    },
    "technology": {
      "recentInventions": [
        "Early development of jet engine prototypes",
        "Advancements in radio transmission clarity and portable sets",
        "Improvements in domestic electric appliances like toasters and irons"
      ],
      "commonDevices": [
        "Wired telephones with manual switchboard exchanges",
        "Manual typewriters for correspondence and record-keeping",
        "Battery-powered portable radios for news and entertainment"
      ],
      "emergingTrends": [
        "Increased household electrification in suburban and rural homes",
        "Growing popularity of radio as primary family entertainment source",
        "Early experiments with television broadcasts, though not yet widespread"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 4 pence",
        "Coal scuttle refill: 1 shilling 6 pence",
        "Taxi ride across town: 2 shillings"
      ],
      "commonActivities": [
        "Morning letters and telegrams sent from local post offices",
        "Afternoon tea served in drawing rooms",
        "Evening gatherings around the fireplace for reading or radio listening"
      ],
      "socialRituals": [
        "Formal Christmas dinner with multiple courses and family toasts",
        "Exchange of modest but carefully chosen gifts among family and close friends"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Rigid class hierarchy strictly observed within the manor and local society",
      "Gentry feel increasing pressure to maintain appearances despite financial worries"
    ],
    "gender": [
      "Women expected to uphold standards of domesticity and decorum, though some enter workforce",
      "Men seen as family heads and public decision-makers, bearing responsibility for estate",
      "Social acceptance of gender roles remains conservative, with limited mobility"
    ],
    "race": [
      "British society predominantly Eurocentric with limited awareness or inclusion of other races",
      "Colonial attitudes persist, with subtle social barriers remaining intact"
    ],
    "generalNorms": [
      "Politeness and formal etiquette govern all social interactions, especially in upper classes",
      "Public restraint favored, with private tensions often concealed behind genteel facades",
      "Conservative values emphasize duty, tradition, and social order despite underlying uncertainties"
    ]
  },
  "atmosphericDetails": [
    "The faint scent of burning coal smoke drifting through frosty, damp air around the manor grounds",
    "Soft echoes of footsteps on gravel paths muffled by wet leaves and the occasional distant hoot of an owl",
    "The warm glow of gas lamps and candlelight casting long shadows in richly paneled drawing rooms"
  ],
  "paragraphs": [
    "December 1938 in the English countryside is a season of muted austerity beneath the glitter of holiday tradition. The manor estate endures chill, fog-laden mornings and persistent drizzle that darkens the leaf-strewn grounds. Daylight is brief, fading by mid-afternoon into early dusk, prompting families and staff alike to draw close to crackling fires. Christmas preparations fill the manor with a mixture of warmth and tension, as the gentry strive to uphold festive gaiety amid whispered concerns over Europe’s escalating uncertainties and the estate’s tightening purse strings.",
    "Fashion in this late 1930s winter favors tailored conservatism. Men wear dark worsted suits and velvet-collared overcoats, their attire punctuated by polished Oxfords and felt trilbies, projecting an image of control and dignity. Women’s evening gowns shimmer with jewel tones and fur trims, balancing elegance with the practicality of knitted wool day dresses and sturdy boots for estate walks. Accessories such as pearl brooches and leather gloves complete ensembles that reflect both status and the era's cautious restraint, while servants maintain strict uniform standards, reinforcing social order within the manor’s walls.",
    "The cultural atmosphere is defined by a blend of escapism and anxiety. Families gather around the wireless to listen to Bing Crosby’s latest tunes or catch BBC bulletins recounting the uneasy peace after Munich. The cinema offers a welcome distraction with films like 'The Adventures of Robin Hood' providing heroic fantasy. Meanwhile, literature and theater explore more serious themes, mirroring social tensions beneath polished surfaces. Daily life unfolds in measured rituals—afternoon tea, formal dinners, and the exchange of carefully chosen Christmas gifts—each a quiet assertion of tradition amid the undercurrent of economic caution and looming geopolitical threats."
  ],
  "note": "This temporal context anchors the mystery firmly in December 1938 England, capturing the interplay of seasonal weather, social stratification, and the fraught historical moment before World War II.",
  "cost": 0.0034365,
  "durationMs": 29302
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amid economic strain and rigid class divides, the residents and staff of an isolated 1930s English manor are bound by strict social codes and estate routines that heighten tensions when a murder disrupts their fragile order.",
  "era": {
    "decade": "1930s",
    "socialStructure": "A hierarchical society where the gentry and their staff observe formal etiquette and daily routines, with economic caution shaping interactions and underlying anxiety about maintaining status and livelihood."
  },
  "setting": {
    "location": "A large country estate in the English countryside, several miles from the nearest village, surrounded by farmland and woodland.",
    "institution": "Manor house estate with controlled access via gatehouse, designated staff and resident areas, and monitored schedules for movement within the grounds.",
    "weather": "Cool autumn evening with intermittent drizzle typical of the English countryside."
  },
  "castAnchors": [
    "Inspector Helen Marwood",
    "Lady Beatrice Winthrope",
    "Charles Montague",
    "Margaret Hensley",
    "Edward Winthrope",
    "Clara Simmons",
    "James Fletcher"
  ],
  "theme": "A classic murder mystery exploring the fragile balance of class, duty, and economic uncertainty within a closed, genteel community."
}

### LOCKED_FACTS
[
  {
    "id": "room_temperature",
    "value": "forty-four degrees Fahrenheit",
    "description": "Ambient temperature at the time the hourglass was found."
  },
  {
    "id": "hourglass_frost_thickness",
    "value": "one sixteenth of an inch",
    "description": "Thickness of frost layers inside the hourglass glass."
  },
  {
    "id": "actual_death_time",
    "value": "twenty minutes past ten",
    "description": "The true time of death revealed after correcting the hourglass delay."
  },
  {
    "id": "hourglass_declared_time",
    "value": "ten minutes past nine",
    "description": "The false death time indicated by the hourglass sand level."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 22,
  "countsByPlacement": {
    "early": 7,
    "mid": 14,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 20,
    "supporting": 1,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "spatial"
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
      "category": "temporal"
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
      "category": "physical"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_charles_montague",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_14",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "id": "clue_19",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_20",
      "placement": "mid",
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
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "supporting",
      "category": "testimonial"
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
