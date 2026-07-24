# Actual Prompt Record

- Run ID: `run_e68c8118-f1d2-497a-a95a-73d7a66a4287`
- Project ID: `proj_035fdeda-92e1-4613-b170-1ffba5c017a1`
- Timestamp: `2026-07-24T12:33:06.231Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `cf0b49a2a46a6f3d`

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
    "title": "The Manor Clock’s Silent Betrayal",
    "author": "Assistant AI",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "No modern forensic technology beyond fingerprinting and basic toxicology",
        "No electronic communication beyond telephone and radio",
        "Social hierarchy strictly observed among gentry and servants",
        "Limited social mobility and formal daily schedules"
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
      "subtype": "stabbed with ceremonial dagger"
    }
  },
  "death_method": "stabbed with ceremonial dagger",
  "cast": [
    {
      "name": "Inspector Evelyn Harcourt",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [
        "Professional acquaintance of Lady Beatrice Marwood",
        "Respected by the household staff"
      ],
      "public_persona": "Calm, methodical police inspector",
      "private_secret": "Has doubts about her own judgment under social pressure",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "Present at manor from late afternoon onwards",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Careful observation",
        "Reserved demeanor"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [
        "Household statements",
        "Physical time evidence"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Lady Beatrice Marwood",
      "age_range": "50-60",
      "role_archetype": "victim",
      "relationships": [
        "Matriarch of Marwood family",
        "Mother of Annabelle Marwood"
      ],
      "public_persona": "Respected, dignified estate owner",
      "private_secret": "Had secret disputes with family members",
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
      "name": "Charles Fenwick",
      "age_range": "45-55",
      "role_archetype": "Family Friend",
      "relationships": [
        "Old friend of Lady Beatrice",
        "Uncle figure to Annabelle"
      ],
      "public_persona": "Charming, confident gentleman",
      "private_secret": "Financially strained; secret debts",
      "motive_seed": "To silence Lady Beatrice who refused to help financially",
      "motive_strength": "high",
      "alibi_window": "Claims to be in the library from quarter past four to quarter to six",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Library access",
        "Garden paths"
      ],
      "behavioral_tells": [
        "Nervous glances",
        "Sudden defensiveness"
      ],
      "stakes": "Financial ruin if exposed",
      "evidence_sensitivity": [
        "Library ledger",
        "Witness statements"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Annabelle Marwood",
      "age_range": "25-30",
      "role_archetype": "Daughter",
      "relationships": [
        "Daughter of Lady Beatrice",
        "Sister to no other family members"
      ],
      "public_persona": "Graceful and dutiful",
      "private_secret": "Secret affair with Simon Hastings",
      "motive_seed": "Protect family reputation from scandal",
      "motive_strength": "moderate",
      "alibi_window": "Claims to be in her room from quarter past four to six",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Servants’ corridors",
        "Guest wing"
      ],
      "behavioral_tells": [
        "Avoids eye contact",
        "Fidgeting"
      ],
      "stakes": "Preserving social standing",
      "evidence_sensitivity": [
        "Letter correspondence",
        "Room access logs"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Harold Grimshaw",
      "age_range": "30-40",
      "role_archetype": "Estate Manager",
      "relationships": [
        "Responsible for manor operations",
        "Known to all staff"
      ],
      "public_persona": "Reliable and stern",
      "private_secret": "Resents Lady Beatrice’s strictness",
      "motive_seed": "Desire to gain control over estate affairs",
      "motive_strength": "moderate",
      "alibi_window": "Claims to be supervising servants in kitchen between quarter past four and half past five",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Servants quarters",
        "Kitchen",
        "Household corridors"
      ],
      "behavioral_tells": [
        "Short temper",
        "Impatient"
      ],
      "stakes": "Career advancement",
      "evidence_sensitivity": [
        "Servants’ timetables",
        "Bell chime records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Margaret Cox",
      "age_range": "50-60",
      "role_archetype": "Housekeeper",
      "relationships": [
        "Head of household staff",
        "Long-serving loyal employee"
      ],
      "public_persona": "Strict but fair",
      "private_secret": "Had conflict with Lady Beatrice over servant treatment",
      "motive_seed": "Wanting to improve servant conditions by removing Lady Beatrice’s control",
      "motive_strength": "moderate",
      "alibi_window": "Claimed to be in the servant’s hall from quarter past four to quarter to six",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Servants’ hall",
        "Household corridors"
      ],
      "behavioral_tells": [
        "Cold stare",
        "Quiet resentment"
      ],
      "stakes": "Improving staff welfare",
      "evidence_sensitivity": [
        "Servants’ statements",
        "Household ledger"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Simon Hastings",
      "age_range": "28-35",
      "role_archetype": "Visitor",
      "relationships": [
        "Secret lover of Annabelle Marwood",
        "Unknown to Lady Beatrice"
      ],
      "public_persona": "Polite and reserved guest",
      "private_secret": "Wants to marry Annabelle but is penniless",
      "motive_seed": "Fear of scandal ending relationship",
      "motive_strength": "high",
      "alibi_window": "Claims to be in the stables between quarter past four and six",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Stables",
        "Garden paths"
      ],
      "behavioral_tells": [
        "Avoids questions about past",
        "Unsteady hands"
      ],
      "stakes": "Relationship survival",
      "evidence_sensitivity": [
        "Stable logs",
        "Correspondence with Annabelle"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Charles Fenwick"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "At the grand Marwood estate in Little Middleton, Lady Beatrice Marwood is found stabbed in her study late afternoon. The manor’s grandfather clock, chiming at quarter past five, seems to fix the murder time. All household members reference the clock’s chimes to establish alibis, but subtle tampering of the clock’s pendulum has shifted actual time, concealing the true timing and culprit. Inspector Evelyn Harcourt must unravel the temporal paradox to reveal the murderer among the family and staff."
    },
    "accepted_facts": [
      "Lady Beatrice was found stabbed in her locked study shortly after the grandfather clock chimed quarter past five",
      "All household members heard the clock chimes and rely on them for timing",
      "Charles Fenwick was seen entering the library around quarter past four",
      "Annabelle Marwood claims to be in her room from quarter past four to six",
      "Harold Grimshaw was supervising servants in the kitchen during the murder hour",
      "Margaret Cox was in the servants' hall according to her testimony",
      "Simon Hastings claims to have been at the stables during the key time period"
    ],
    "inferred_conclusions": [
      "The grandfather clock was tampered with to run fast by about thirty seconds per hour",
      "The official murder time based on chimes is shifted earlier than actual time",
      "Charles Fenwick’s alibi is compromised by this time distortion",
      "Only one suspect could have knowledge and opportunity to tamper with the clock",
      "The true murder occurred shortly after the fifth chime, not exactly at quarter past five"
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The manor’s grandfather clock pendulum was subtly tampered by adjusting a concealed screw on its brass bob, shortening the effective pendulum length and increasing its swing frequency. This caused the clock to run fast by approximately thirty seconds per hour, advancing all chimes and misleading all household members' timing references. The murderer exploited this to fabricate an alibi relying on the chimes’ time. The tampering was executed using a specialized watchmaking tool uniquely possessed by Charles Fenwick, who had knowledge of horology.",
      "delivery_path": [
        {
          "step": "Charles Fenwick secretly accessed the clock’s mechanism during afternoon rounds."
        },
        {
          "step": "Using a concealed watchmaker’s screwdriver, he adjusted the pendulum screw on the brass bob."
        },
        {
          "step": "This adjustment shortened the pendulum's effective length, increasing the clock’s swing rate."
        },
        {
          "step": "The clock consequently ran fast by about thirty seconds per hour, shifting chime times."
        },
        {
          "step": "All household members heard the clock chimes, basing their timelines on this shifted time, thus masking the true murder time."
        }
      ]
    },
    "outcome": {
      "result": "The temporal distortion created by the clock’s tampering allowed Charles Fenwick to murder Lady Beatrice and construct an alibi based on the false official time, evading suspicion until the temporal paradox was resolved."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred precisely when the manor clock chimed quarter past five, as all household members testified hearing the chimes.",
    "type": "temporal",
    "why_it_seems_reasonable": "All witnesses heard the clock chime, a trusted and central timekeeper in the household, anchoring their alibis to this exact time.",
    "what_it_hides": "The clock was running fast due to pendulum tampering, so the chimes were ahead of real time, causing a temporal shift that masked the actual murder moment."
  },
  "false_solution": {
    "accused_suspect": "Annabelle Marwood",
    "supporting_points": [
      "Annabelle had motive to protect family reputation and opportunity in her room near the study.",
      "Her nervous behavior and secret affair with Simon Hastings create suspicion."
    ],
    "the_one_flaw": "The timeline based on the accurate clock chimes cannot accommodate her access to the study at the claimed time after the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Annabelle’s secret correspondence with Simon Hastings suggests a motive of concealment.",
      "points_at_suspect": "Annabelle Marwood",
      "innocent_explanation": "The letters were innocent love notes, and she was unaware of the murder timing confusion.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Harold Grimshaw’s bitter argument overheard by servants with Lady Beatrice earlier the day.",
      "points_at_suspect": "Harold Grimshaw",
      "innocent_explanation": "The argument was about estate management, unrelated to the murder and not during the murder time window.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Charles Fenwick",
      "Annabelle Marwood",
      "Harold Grimshaw",
      "Margaret Cox",
      "Simon Hastings"
    ],
    "rationale": "The manor was isolated with no visitors entering or leaving during the relevant time; all staff and family are accounted within the property, making an outsider culprit impossible."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Grandfather clock chimes quarter past five",
        "Household dinner scheduled for six o'clock"
      ],
      "windows": [
        "Murder occurred between quarter past five and six",
        "Servants' shift changes at quarter past four and half past five"
      ],
      "contradictions": [
        "Clock chimes time differs from actual time by ~30 seconds per hour",
        "Witness statements rely on chime time conflicting with physical evidence of movement"
      ]
    },
    "access": {
      "actors": [
        "Charles Fenwick",
        "Annabelle Marwood",
        "Harold Grimshaw",
        "Margaret Cox",
        "Simon Hastings"
      ],
      "objects": [
        "Grandfather clock",
        "Ceremonial dagger",
        "Library ledger",
        "Stable logs"
      ],
      "permissions": [
        "Charles Fenwick has library and clock room access",
        "Annabelle has guest wing access",
        "Harold manages servants and kitchen",
        "Margaret oversees servants’ hall"
      ]
    },
    "physical": {
      "laws": [
        "Pendulum swing period depends on length and bob weight",
        "Clock speed increases as pendulum length shortens"
      ],
      "traces": [
        "Faint scratch on pendulum brass bob",
        "Minute hand misaligned with dial markers",
        "Servant’s note on clock running oddly"
      ]
    },
    "social": {
      "trust_channels": [
        "Household reliance on grandfather clock chimes for time",
        "Servants’ shift routine and bell chimes",
        "Family deference to Lady Beatrice"
      ],
      "authority_sources": [
        "Lady Beatrice’s estate management",
        "Harold Grimshaw’s operational control",
        "Inspector Harcourt’s police authority"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "A servant’s note mentions the grandfather clock was ‘running oddly’ earlier that afternoon, with a faint scratch found on the pendulum’s brass bob.",
        "correction": "The clock pendulum had been tampered with, causing it to run faster than standard time.",
        "effect": "Narrows time constraint, revealing official chime time is shifted earlier than real time.",
        "required_evidence": [
          "Servant’s note referencing ‘clock running oddly’",
          "Faint scratch on pendulum brass bob",
          "Grandfather clock chimes at quarter past five"
        ],
        "reader_observable": true
      },
      {
        "observation": "The minute hand on the grandfather clock dial is subtly misaligned with the dial markers, inconsistent with clock chimes.",
        "correction": "The clock’s minute hand does not correctly represent the true time, confirming a time distortion.",
        "effect": "Eliminates suspects relying on exact chime time for alibis without allowance for clock distortion.",
        "required_evidence": [
          "Minute hand misaligned with dial markers",
          "Household members heard clock chimes at quarter past five",
          "Charles Fenwick’s stated alibi relying on chime time"
        ],
        "reader_observable": true
      },
      {
        "observation": "Charles Fenwick uniquely possesses a watchmaker’s screwdriver, discovered in his belongings and known for his horological knowledge.",
        "correction": "Only Charles Fenwick had means and knowledge to tamper with the clock pendulum.",
        "effect": "Narrows culprit eligibility exclusively to Charles Fenwick based on means-discriminator.",
        "required_evidence": [
          "Charles Fenwick’s possession of watchmaker’s screwdriver",
          "His horological knowledge from past apprenticeship",
          "Access to the clock room"
        ],
        "reader_observable": true
      },
      {
        "observation": "The timing of Lady Beatrice’s death, deduced by wound characteristics and blood drying, is later than the official chime time, by approximately twenty minutes.",
        "correction": "The murder occurred after the clock’s fifth chime, not exactly at quarter past five as assumed.",
        "effect": "Narrows the murder window and invalidates alibis based strictly on the shifted chime time.",
        "required_evidence": [
          "Wound drying rate indicating later killing time",
          "Clock chime timing discrepancy",
          "Conflicting servant testimonies referencing time"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "constraint_proof",
    "design": "An examination and controlled measurement of the grandfather clock’s pendulum swing period, compared against a standard timepiece and the servant’s note timestamps, demonstrates the clock runs fast by thirty seconds per hour, proving Charles Fenwick’s tampered timeline and invalidating his alibi dependent on chime times.",
    "knowledge_revealed": "This test exposes the temporal distortion caused by pendulum tampering and confirms only Fenwick had means and motive to exploit this, sealing his guilt.",
    "pass_condition": "The measured pendulum swing confirms the clock’s accelerated timing by the exact amount required to reconcile the shifted timeline with Fenwick’s fabricated alibi.",
    "evidence_clues": [
      "clue_odd_clock_note",
      "clue_pendulum_scratch",
      "clue_minute_hand_misalignment",
      "clue_fenwick_tool_possession",
      "clue_wound_timing",
      "clue_examination_controlled_measurement",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_charles_fenwick"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The servant’s note about the clock and pendulum scratch allows identification of tampering. Step 2: The clock minute hand misalignment confirms the altered timing, negating some suspects’ alibis. Step 3: Fenwick’s unique possession of horological tools and access links him specifically to the tampering means. Step 4: The wound drying analysis dates the murder later than official time, exposing the alibi fabrication. Together these clues allow the reader to logically deduce Fenwick’s guilt before the discriminating test."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 4,
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
        "Execute the controlled pendulum timing measurement",
        "Compare results to standard timepiece and servant note timestamps",
        "Observe Charles Fenwick’s reaction to temporal contradiction",
        "Draw conclusion of guilt based on measured clock tampering"
      ],
      "test_type": "constraint_proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Annabelle Marwood",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Demonstration of genuine alibi through guest wing logs and servant support",
        "supporting_clues": [
          "Letter correspondence",
          "Room access logs"
        ]
      },
      {
        "suspect_name": "Harold Grimshaw",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Verification of presence supervising kitchen staff during the timeframe",
        "supporting_clues": [
          "Servants timetables",
          "Bell chime records"
        ]
      },
      {
        "suspect_name": "Margaret Cox",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Servants’ hall attendance logs and supportive testimonies",
        "supporting_clues": [
          "Household ledger",
          "Servants’ statements"
        ]
      },
      {
        "suspect_name": "Simon Hastings",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Stable logs confirming presence during critical period",
        "supporting_clues": [
          "Stable logs",
          "Correspondence with Annabelle"
        ]
      },
      {
        "suspect_name": "Lady Beatrice Marwood",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Inspector Harcourt confronts Charles Fenwick with clock tampering evidence and alibi contradiction"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_odd_clock_note",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation of servant’s written note"
      },
      {
        "clue_id": "clue_pendulum_scratch",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Inspection of grandfather clock pendulum bob"
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
        "clue_id": "clue_minute_hand_incorrect_time",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_minute_hand_misalignment",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Investigation of clock face and hands"
      },
      {
        "clue_id": "clue_puncture_wound_ceremonial_dagger",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fenwick_tool_possession",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Search of Charles Fenwick’s belongings"
      },
      {
        "clue_id": "clue_culprit_direct_charles_fenwick",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_early_contradiction_pendulum_tampered",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_eliminate_annabelle_marwood_narrow",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_eliminate_harold_grimshaw",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_eliminate_margaret_cox",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_eliminate_simon_hastings",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_examination_controlled_measurement",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fenwick_premeditation_silence",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_fenwick_unique_means_skill",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_murder_time_after_fifth_chime",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_wound_timing",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Forensic assessment of Lady Beatrice’s wound drying"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Inspector Evelyn Harcourt",
    "summary": "A methodical Scotland Yard detective grappling with self-doubt, tasked with unraveling a tangled web of secrets in the Marwood estate.",
    "publicPersona": "Inspector Harcourt is the epitome of professional poise and sharp intellect. Known for her discretion and tenacity, she approaches each case with a meticulous eye and an unwavering commitment to justice. Within the corridors of power, her name commands respect, yet she maintains a humble, almost austere presence that belies her sharp mind.",
    "privateSecret": "Beneath her composed exterior, Evelyn wrestles with lingering doubts born from a past case failure that shook her confidence. This shadow haunts her judgments, making her second-guess instincts that once guided her decisively.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "impossible",
    "stakes": "She must solve the case to restore not only her professional credibility but also to reclaim her personal confidence, which the case threatens to erode further.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Evelyn speaks with measured precision, her sentences clipped yet graceful. She often punctuates her observations with a wry, understated quip, revealing a keen intellect that masks a cautious vulnerability. Her tone is formal but never stiff, and she prefers economy of words, allowing her sharp wit to do the heavy lifting.",
    "signatureTic": "\"Let's not jump to conclusions just yet.\"",
    "internalConflict": "Haunted by a previous investigative failure, she fears that this case might expose her lingering self-doubt, threatening her sense of professional worth and identity.",
    "personalStakeInCase": "Beyond duty, Evelyn sees this investigation as a chance at redemption—solving the Manor Clock case would silence the doubts that have shadowed her career and prove to herself that her instincts remain sound.",
    "paragraphs": [
      "Inspector Evelyn Harcourt arrived at the Marwood estate with the weight of expectation pressing on her shoulders. Her reputation as a methodical and discreet detective preceded her, yet beneath her calm exterior, she grappled with the ghosts of a prior case that had slipped through her fingers. Every detail here mattered; she knew that the truth was buried beneath layers of social etiquette and unspoken resentments.",
      "Her approach was clinical but empathetic, probing the rigid class structures and subtle tensions that permeated the household. Evelyn’s conversations were laced with a dry wit that often caught suspects off guard, a delicate balancing act between formality and subtle challenge. Though she rarely revealed her inner turmoil, her questions betrayed a mind restless with self-doubt.",
      "The estate was a microcosm of secrets, each individual holding pieces of a puzzle that threatened to unravel the very fabric of the Marwood legacy. Evelyn’s keen mind sifted through alibis and motives with relentless precision, yet she remained painfully aware that any misstep could deepen her own insecurities. Each lead was a test, not just of her skill, but of her ability to trust her instincts once more.",
      "Despite the pressure, Evelyn maintained an unwavering commitment to justice. Her self-deprecating humor surfaced in quiet moments, a shield against the fear that the truth might elude her again. The Manor Clock’s silent betrayal was not just a mystery of murder but a crucible for her own redemption.",
      "Navigating the estate’s labyrinth of secrets and social expectations, Evelyn sought not only to solve a crime but to reclaim the confidence that had once made her a formidable detective. Her journey would reveal the delicate interplay between duty, doubt, and the enduring pursuit of truth."
    ],
    "order": 1
  },
  {
    "name": "Lady Beatrice Marwood",
    "summary": "The formidable matriarch of the Marwood estate, her death sparks a storm of secrets threatening the family’s future.",
    "publicPersona": "Lady Beatrice commands respect with a stern social demeanor befitting her station. Known for her philanthropy and unwavering commitment to tradition, she embodies the steadfast dignity expected of an English country estate owner. Her presence is both imposing and authoritative, a pillar of the community.",
    "privateSecret": "She had uncovered a scandalous secret regarding an heir’s illegitimacy and was poised to expose it, potentially upending the family’s carefully maintained social order.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "possible",
    "stakes": "Her death threatens to unravel the future of the Marwood estate, shaking the foundations of social order and family legacy.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Lady Beatrice’s speech is formal, measured, and laced with a genteel understatement. She often employs a dry, ironic tone that hints at sharp intelligence beneath her composed exterior. Her sentences are carefully constructed, reflecting a woman accustomed to command and control.",
    "signatureTic": "\"One must maintain decorum, even in the face of adversity.\"",
    "internalConflict": "Though outwardly unyielding, she privately wrestled with the burden of secrets that threatened to disgrace her family, balancing duty against the desire for truth.",
    "personalStakeInCase": "As the victim, her death is the fulcrum of the mystery, but her hidden intentions to reveal family secrets imbue the case with deeper social and personal ramifications.",
    "paragraphs": [
      "Lady Beatrice Marwood stood as the unshakable matriarch of the estate, a figure whose very presence demanded respect and order. Her philanthropic endeavors masked a steely resolve to preserve the family’s honor at any cost. Yet beneath her composed exterior lay the weight of secrets that gnawed at her conscience.",
      "Her discovery of an illegitimate heir threatened to tarnish the Marwood name, and she had resolved to bring this truth to light. It was a decision that placed her at odds with those who preferred the comfortable illusions of lineage and inheritance. Her death, sudden and violent, cast a shadow over the estate, igniting tensions long suppressed.",
      "In conversation, Lady Beatrice’s voice carried the subtle sting of irony, a weapon wielded with precision to maintain control. Her insistence on decorum was both a shield and a sword, reflecting a woman who understood the precarious balance between appearance and reality.",
      "Her murder not only silenced her but disrupted the delicate social fabric she had so carefully maintained. The estate’s future now hung in the balance, as those closest to her grappled with the implications of her secrets and the void left by her absence.",
      "Though she no longer walked the halls of the manor, Lady Beatrice’s presence lingered in the whispers and suspicions that filled the air. Her legacy, fraught with scandal and steadfast dignity, set the stage for a drama that would test loyalties and reveal the true cost of silence."
    ],
    "order": 2
  },
  {
    "name": "Charles Fenwick",
    "summary": "The loyal estate manager caught between professional duty and a clandestine affair that could ruin everything.",
    "publicPersona": "Charles is the dedicated, efficient steward of the Marwood estate, trusted implicitly by Lady Beatrice. He carries himself with quiet confidence, embodying the ideal servant-manager who keeps the estate’s wheels turning smoothly.",
    "privateSecret": "He is secretly involved in an affair with Lady Beatrice’s niece, Annabelle, a liaison that threatens to expose him and jeopardize his position.",
    "motiveSeed": "Fearing that exposure of his affair and rumors of mismanagement would cost him his livelihood, he saw Lady Beatrice’s death as a grim solution to preserve his standing.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was seen in the servant quarters between 8:30 and 9:15 pm",
    "accessPlausibility": "easy",
    "stakes": "Losing his job would mean financial ruin and social disgrace, a fall from grace he is desperate to avoid.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Charles speaks with a polished, urbane tone, often veiling sharp observations beneath courteous language. His sentences flow smoothly, occasionally punctuated with a cutting remark delivered with a disarming smile. He navigates conversations with a practiced ease that masks underlying tensions.",
    "signatureTic": "\"One must mind the company one keeps, eh?\"",
    "internalConflict": "He is torn between loyalty to the estate and his personal desires, fearful that either path could lead to ruin.",
    "personalStakeInCase": "Charles’s very future depends on the outcome; the investigation threatens to expose his affair and dismantle the life he has painstakingly built within the estate’s walls.",
    "paragraphs": [
      "Charles Fenwick managed the Marwood estate with the precision of a man who understood that his livelihood depended on discretion and efficiency. His reputation for dedication earned him Lady Beatrice’s trust, though beneath the surface simmered a secret that could undo him.",
      "His affair with Annabelle Marwood was a dangerous dance, fraught with risk in a world that prized appearances above all. The threat of discovery hung over him like a guillotine, especially as whispers of mismanagement began to circulate, casting shadows on his competence.",
      "In conversation, Charles wielded polite savagery like a shield and a weapon. His remarks, often wrapped in courteous phrasing, could slice through pretense with subtle cruelty. This duality made him both an effective manager and a formidable presence within the household.",
      "Caught in a web of conflicting loyalties, Charles struggled to reconcile his personal desires with the demands of his position. The murder investigation intensified this struggle, forcing him to confront the precariousness of his existence and the cost of secrets kept too long.",
      "His story is one of ambition and vulnerability, illustrating the fragile balance between social standing and private passion in the shadowy corridors of the English countryside."
    ],
    "order": 3
  },
  {
    "name": "Annabelle Marwood",
    "summary": "The rebellious niece whose bohemian spirit masks desperate debts and a possible motive for murder.",
    "publicPersona": "Annabelle is a free-spirited, bohemian artist who often clashes with her aunt’s strict values. She embodies youthful rebellion and a yearning for independence within the confines of aristocratic expectations.",
    "privateSecret": "She is burdened by heavy gambling debts and is desperate to secure her inheritance early, viewing Lady Beatrice’s death as a swift means to that end.",
    "motiveSeed": "A changed will would grant her substantial inheritance sooner; legal battles would be slow and uncertain, making death a quicker solution.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to be painting alone in the west wing studio from 8:00 to 9:30 pm",
    "accessPlausibility": "possible",
    "stakes": "Exposure of her debts would mean financial ruin and social exile, threats she finds unbearable.",
    "humourStyle": "blunt",
    "humourLevel": 0.7,
    "speechMannerisms": "Annabelle’s speech is direct and forthright, often cutting through social niceties with blunt honesty. She speaks quickly and with a youthful energy, sometimes tinged with sarcasm and impatience. Her words reflect a rebellious spirit unwilling to be restrained by convention.",
    "signatureTic": "\"Look, I’m not here to sugarcoat anything.\"",
    "internalConflict": "She wrestles with the guilt of her financial desperation and the moral implications of potentially benefiting from her aunt’s death.",
    "personalStakeInCase": "The outcome will determine whether she can escape a life shadowed by debt and scandal or face ruin and exile from the only world she knows.",
    "paragraphs": [
      "Annabelle Marwood’s bohemian flair was a stark contrast to the rigid formality of the Marwood estate. An aspiring artist with a sharp tongue, she often found herself at odds with the expectations imposed by her aristocratic upbringing. Yet beneath her rebellious exterior lay a woman cornered by mounting debts and dwindling options.",
      "Her gambling addiction was a secret kept from polite society, one that threatened to unravel her future. The prospect of inheriting early was a temptation too great to ignore, and the slow grind of legal disputes seemed an unbearable delay. In her mind, the death of Lady Beatrice was a grim but efficient solution.",
      "Her speech was refreshingly blunt, a weapon against the pretenses she despised. She had little patience for euphemisms or social niceties, often cutting conversations short with sharp retorts. This candor made her both a breath of fresh air and a source of tension within the household.",
      "Yet Annabelle was not without remorse. The moral weight of her desires clashed with the rebellious freedom she sought, creating a storm of internal conflict. She walked a precarious line between ambition and conscience, the stakes nothing less than her entire future.",
      "Her narrative is one of youthful defiance shadowed by desperation, a poignant exploration of the costs of freedom within the gilded cage of aristocracy."
    ],
    "order": 4
  },
  {
    "name": "Harold Grimshaw",
    "summary": "The family lawyer whose forged will and secret dealings place him under a cloud of suspicion.",
    "publicPersona": "Harold is a respected solicitor, entrusted with the delicate affairs of the Marwood family. His demeanor is polished and professional, embodying the image of a man devoted to law and order.",
    "privateSecret": "He had forged a codicil to the will benefiting a hidden client, a deception Lady Beatrice was close to uncovering.",
    "motiveSeed": "Exposure would mean career ruin and criminal charges; murder was a desperate act to prevent disgrace.",
    "motiveStrength": "strong",
    "alibiWindow": "Attended a local charity meeting between 7:45 and 9:00 pm, verified by two unrelated witnesses",
    "accessPlausibility": "possible",
    "stakes": "His entire professional reputation and freedom hang in the balance.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Harold speaks with a calm, deliberate cadence, carefully choosing words to convey control and authority. His tone is often understated, with a subtle dryness that hints at his calculating nature. He rarely raises his voice, preferring to influence through quiet persuasion.",
    "signatureTic": "\"It’s merely a matter of perspective.\"",
    "internalConflict": "He struggles to reconcile his professional ethics with the greed and fear driving his actions, haunted by the risk of exposure.",
    "personalStakeInCase": "The investigation threatens to destroy his career and freedom, making the stakes profoundly personal and immediate.",
    "paragraphs": [
      "Harold Grimshaw was the quintessential family solicitor, a man whose polished exterior masked a labyrinth of deceit. Entrusted with the Marwood family’s legal affairs, he had crossed a line few would dare approach—he forged a codicil to the will to benefit a mysterious client.",
      "Lady Beatrice’s growing suspicions placed him in grave danger. The potential unraveling of his scheme was a threat not only to his livelihood but to his very liberty. In his mind, the murder was a calculated risk to silence the one person who could expose him.",
      "His speech was a study in understatement, each carefully measured phrase veiling the storm beneath. He wielded language like a scalpel, dissecting conversations with a quiet, dry wit that unsettled those unprepared for his subtle barbs.",
      "Caught between greed and the remnants of professional pride, Harold’s internal conflict was palpable. The fear of losing everything gnawed at him, yet he clung to a veneer of control, hoping to navigate the investigation unscathed.",
      "His story is a cautionary tale of ambition corrupted, where the pursuit of gain leads to moral decay and desperate choices."
    ],
    "order": 5
  },
  {
    "name": "Margaret Cox",
    "summary": "The devoted head housekeeper whose loyalty masks simmering resentment and secrets withheld.",
    "publicPersona": "Margaret is a pillar of the household staff, respected for her unwavering loyalty and strict management of domestic affairs. She commands the servants with an iron will softened by genuine care.",
    "privateSecret": "She harbors deep resentment toward Lady Beatrice for past humiliations and deliberately withheld crucial information about the household’s activities on the night of the murder.",
    "motiveSeed": "Her desire for revenge after years of mistreatment provided a weak but present motive; the murder was a final act of defiance.",
    "motiveStrength": "weak",
    "alibiWindow": "Was organizing the dining room settings from 8:15 to 9:00 pm, seen by several staff members",
    "accessPlausibility": "easy",
    "stakes": "Her position and self-worth are intimately tied to the estate’s order, making the upheaval deeply personal.",
    "humourStyle": "deadpan",
    "humourLevel": 0.2,
    "speechMannerisms": "Margaret’s speech is plain and unadorned, delivered in a steady, deadpan tone that conveys both authority and weary resignation. She rarely indulges in small talk, preferring blunt statements that leave little room for misunderstanding.",
    "signatureTic": "\"I see to it that things run as they should.\"",
    "internalConflict": "She battles between loyalty to the family and a simmering anger over past slights, struggling to maintain composure while nursing quiet rebellion.",
    "personalStakeInCase": "The murder threatens the household’s stability, and by extension, her place within it, making the investigation a matter of personal survival.",
    "paragraphs": [
      "Margaret Cox was the backbone of the Marwood household, a woman whose authority over the servants was absolute yet tempered with a genuine concern for their welfare. Her loyalty to the family was unquestioned, but beneath her dutiful exterior lay a reservoir of resentment.",
      "Years of subtle humiliations at Lady Beatrice’s hands had left their mark, fostering a quiet bitterness that she kept carefully hidden. On the night of the murder, Margaret withheld information about household movements, a choice born of simmering defiance rather than malice.",
      "Her speech was marked by a deadpan delivery, each word measured and deliberate. She eschewed embellishment, preferring to convey her thoughts in straightforward, unvarnished terms. This bluntness made her both respected and somewhat feared among the staff.",
      "Margaret’s internal conflict was a delicate balancing act—maintaining loyalty while silently rebelling against the very authority she served. The upheaval following Lady Beatrice’s death threatened not only the estate’s order but also her own sense of identity and security.",
      "Her story reveals the complexities of service and power within the estate, where devotion and resentment intertwine in the shadows of tradition."
    ],
    "order": 6
  },
  {
    "name": "Simon Hastings",
    "summary": "The charming journalist whose investigation into aristocratic scandals may have provoked deadly consequences.",
    "publicPersona": "Simon is an affable and inquisitive journalist, invited to the estate to chronicle the lives of the English aristocracy. His charm and curiosity make him a welcome yet occasionally intrusive presence.",
    "privateSecret": "He was investigating a damaging scandal involving Lady Beatrice and intended to publish revelations that could devastate reputations.",
    "motiveSeed": "Lady Beatrice’s murder would silence immediate exposure, allowing him to manipulate the story for personal gain and career advancement.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be interviewing staff in the gardens between 8:00 and 9:00 pm, but no witnesses fully confirm.",
    "accessPlausibility": "possible",
    "stakes": "His career hinges on the success or failure of the exposé, making the stakes intensely personal and professionally defining.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Simon speaks with a relaxed, conversational tone, peppered with wry observations and a natural storytelling flair. His manner is approachable, often using rhetorical questions and casual asides to engage listeners and disarm suspicion.",
    "signatureTic": "\"Isn’t it curious how things unfold?\"",
    "internalConflict": "He wrestles with the ethical ambiguity of exploiting tragedy for personal gain, torn between journalistic integrity and ambition.",
    "personalStakeInCase": "The unfolding scandal and its resolution will make or break his career, entwining his fate with the estate’s darkest secrets.",
    "paragraphs": [
      "Simon Hastings arrived at the Marwood estate with the enthusiasm of a man eager to uncover stories that would captivate the public. His charm and easy manner quickly made him a familiar figure among the staff and family alike, though his probing questions sometimes aroused wariness.",
      "His investigation into Lady Beatrice’s private affairs uncovered a scandal that promised to shake the foundations of aristocratic respectability. The potential for a career-defining exposé was tantalizing, yet fraught with ethical pitfalls.",
      "Simon’s speech was marked by a relaxed cadence, often punctuated with rhetorical flourishes and wry asides that revealed a keen observer of human nature. His humour was subtle, used judiciously to diffuse tension or highlight ironies.",
      "Despite his outward confidence, Simon grappled with the moral complexities of his role. The line between uncovering truth and exploiting tragedy blurred, leaving him uncertain of the path he should take.",
      "His narrative embodies the tension between ambition and conscience, a man caught between the allure of professional success and the costs it may exact on those involved."
    ],
    "order": 7
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Blackthorn Manor",
    "type": "Country house estate (Manor house)",
    "place": "Ashcombe Heath",
    "country": "England",
    "summary": "Blackthorn Manor is a sprawling 18th-century estate nestled in the secluded rural expanse of Ashcombe Heath. Surrounded by dense hedgerows and ancient stone walls, the manor and its outbuildings stand as a bastion of genteel tradition amid encroaching modern anxieties.",
    "visualDescription": "A vast stone manor with mullioned windows and steep slate roofs, punctuated by tall chimneys and climbing ivy. The formal gardens boast neatly clipped yews and rose beds, while gravel drives wind past a gatehouse and servants’ quarters. Outbuildings cluster near the orchard, with a looming clock tower visible from the main hall.",
    "atmosphere": "A place of quiet refinement and layered secrets, where the ticking of the great manor clock echoes through shadowed corridors and autumn mists curl across manicured lawns. Beneath the polished veneer, tensions simmer amid the economic strains and political whispers of the 1930s.",
    "paragraphs": [
      "Blackthorn Manor rises solemnly above the rolling fields of Ashcombe Heath, its weathered stone walls softened by creeping ivy and the muted golds and reds of early autumn foliage. The estate is bordered by thick hawthorn hedges and low stone walls, hemming in the manor’s extensive grounds and limiting casual passage. Gravel paths wind through formal gardens of yew topiaries and late-blooming roses, while a tall clock tower stands sentinel near the east wing, its silent face marking time in the shadow of recent tragedy.",
      "Inside, heavy oak paneling and richly woven tapestries line the long corridors, punctuated by brass sconces and the occasional flicker of candlelight. The main hall, with its sweeping staircase and imposing fireplace, channels visitors inward, while servant passages and discrete doorways maintain the strict social order of the household. The air carries the faint scent of polished wood, beeswax, and the underlying chill of stone floors, mingling with the distant murmur of party-line telephone conversations and the occasional hum of a petrol car arriving at the gate.",
      "The estate’s isolation is both a refuge and a trap; the nearest village lies several miles away, accessible only by narrow country lanes or the infrequent passenger train. The gatehouse guards all arrivals, logging visitors and enforcing the family’s strict privacy. Servants move in measured rhythms, their duties choreographed to the manor’s daily schedule, while family members and guests navigate the social protocols with practiced ease, their conversations shadowed by the era’s economic uncertainties and the ominous political climate beyond the estate’s boundaries.",
      "As twilight deepens, fog creeps across the lawns and the manor’s silhouette blurs against a darkening sky. The great clock’s hands remain stubbornly still, a silent betrayal in the stillness, while inside, the interplay of light and shadow casts long secrets across the polished floors and heavy draperies."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Typical early autumn weather in rural England, cool with intermittent drizzle affecting outdoor movement and evidence preservation.",
    "timeFlow": "Three days of mounting tension culminating in a late-night revelation.",
    "mood": "A cozy yet tense atmosphere underscored by economic uncertainty of the Great Depression and the rising political tensions in Europe, lending unease beneath genteel appearances.",
    "eraMarkers": [
      "Petrol touring cars on winding county roads",
      "Domestic telephone lines with party-line exchanges",
      "Manual typewriters for correspondence and record-keeping",
      "Battery-powered radios common in sitting rooms",
      "Passenger trains connecting nearest towns",
      "Occasional telegrams sent via nearest town telegraph office"
    ],
    "sensoryPalette": {
      "dominant": "the crisp scent of damp earth and fallen leaves mingled with polished wood and candle wax",
      "secondary": [
        "the muted patter of drizzle on slate roofs",
        "the distant rumble of a petrol engine on gravel",
        "the faint crackle of a radio broadcast in the drawing room"
      ]
    },
    "paragraphs": [
      "The manor breathes with the quiet dignity of a bygone era, its spaces filled with the scent of beeswax-polished wood and the sharp tang of autumn leaves dampened by persistent drizzle. The air carries a subtle tension, woven through the muffled footsteps on stone floors and the distant echoes of voices constrained by social decorum. Outside, the weather dulls colors and muffles sounds, adding a veil of secrecy to every shadowed corner and twisting pathway.",
      "Within this setting, time feels both measured and strained. The steady ticking of clocks contrasts with the uneasy silences that fall between conversations, while the outside world’s political unrest seeps through the manor’s walls in whispered rumors and the crackling voice of a battery-powered radio. The estate’s isolation sharpens every sound and scent, making each detail a clue and every interaction a potential betrayal."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Manor Orchard",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A secluded orchard enclosed by dense hawthorn hedges, with gnarled apple trees heavy with late-season fruit. Fallen leaves carpet the uneven earth, and a narrow gravel path leads from the kitchen garden to a small wooden tool shed at the orchard’s far edge.",
      "sensoryDetails": {
        "sights": [
          "damp fallen leaves and bruised apples",
          "mist-shrouded hedgerows",
          "weathered wooden tool shed",
          "grey sky through bare branches",
          "muddy ruts in gravel path",
          "droplets clinging to cobwebs"
        ],
        "sounds": [
          "soft pattering of drizzle",
          "distant crow cawing",
          "rustling of wind in branches",
          "squelching footsteps on wet earth",
          "faint creak of shed door hinge"
        ],
        "smells": [
          "musty earth and rotting fruit",
          "wet wood and moss",
          "sharp tang of autumn leaves",
          "cold damp air with faint smoke",
          "acrid scent of crushed grass"
        ],
        "tactile": [
          "slick bark of apple trees",
          "cold damp soil underfoot",
          "rough weathered wood of shed",
          "chill breeze on exposed skin",
          "wet gravel crunching beneath shoes"
        ]
      },
      "accessControl": "Restricted to family members and select staff; gatehouse logs any visitors; orchard locked at dusk; tool shed accessible only to groundskeepers during daylight.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-beaded leaves and branches",
            "grey mist hanging low",
            "puddles pooling on gravel path",
            "waterlogged fallen apples",
            "dull overcast sky"
          ],
          "sounds": [
            "steady rain drumming on leaves",
            "soft drip from hedgerow branches",
            "muffled footsteps in mud",
            "distant low thunder rumble"
          ],
          "smells": [
            "fresh wet earth",
            "damp moss and wood",
            "cool rain-scented air",
            "faint smoke from distant chimneys"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pale light through branches",
            "shadowless orchard floor",
            "grey clouds thick over horizon",
            "wet leaves darkened by moisture"
          ],
          "sounds": [
            "wind stirring leaves softly",
            "occasional bird call",
            "distant footsteps on gravel",
            "rustle of hedgerow leaves"
          ],
          "smells": [
            "earthy dampness",
            "decaying fruit",
            "moist wood and bark"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "fading amber light on branches",
            "deepening blue sky",
            "soft glow on tool shed"
          ],
          "sounds": [
            "distant hoot of owl",
            "rustling leaves in breeze",
            "soft crunch of footsteps",
            "insects beginning night chorus"
          ],
          "smells": [
            "cool crisp air",
            "drying leaves",
            "faint earthiness"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The manor orchard lies quietly secluded behind a thick barrier of hawthorn hedges, its gnarled apple trees heavy with late-season fruit and draped in the damp shroud of early autumn mist. The gravel path that winds through the trees is slick with rain and littered with bruised apples and fallen leaves, muffling footsteps and concealing subtle traces beneath its sodden carpet. At the orchard’s edge, a small weathered tool shed stands half-hidden under creeping ivy, its wooden door warped by years of weather.",
        "This remote corner of the estate is rarely visited except by groundskeepers and a few trusted family members, its isolation lending a fragile veil of secrecy. The cool dampness clings to skin and clothing, while the musty scent of rotting fruit blends with the sharp tang of autumn leaves and cold earth. The orchard’s dense hedgerows block sightlines to the main house, making it a place where shadows can lengthen unnoticed and whispered conversations might go unheard."
      ]
    },
    {
      "id": "main_hall",
      "name": "Manor Main Hall",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "An expansive room with polished oak floors and towering panelled walls hung with ancestral portraits. A grand staircase curves upwards beneath a stained-glass window, and heavy velvet drapes frame tall mullioned windows overlooking the gardens.",
      "sensoryDetails": {
        "sights": [
          "flickering brass wall sconces",
          "glossy oak staircase banister",
          "deep red velvet curtains",
          "oil portraits in gilded frames",
          "polished marble fireplace surround"
        ],
        "sounds": [
          "echoing footsteps on oak floor",
          "soft murmur of distant voices",
          "crackling fire in hearth",
          "gentle ticking of grandfather clock",
          "rustle of silk and wool gowns"
        ],
        "smells": [
          "burning wood smoke",
          "polished oak and beeswax",
          "rich leather-bound books",
          "faint scent of lavender sachets",
          "warm hearth embers"
        ],
        "tactile": [
          "smooth cool marble hearth",
          "soft velvet drapes",
          "polished wood banister",
          "worn leather armchair",
          "heavy wool carpet underfoot"
        ]
      },
      "accessControl": "Open to family and guests during social hours; servants enter discreetly for service; locked after midnight except for household staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through stained glass",
            "damp sheen on stone threshold",
            "dim glow from wall sconces"
          ],
          "sounds": [
            "soft rain tapping on windowpanes",
            "muffled footsteps on wet gravel outside",
            "crackling low fire"
          ],
          "smells": [
            "damp stone and polished wood",
            "smoke from recently lit fire"
          ],
          "mood": "reflective calm"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dulling oil portraits",
            "shadows pooling in corners"
          ],
          "sounds": [
            "quiet conversation murmurs",
            "soft rustle of fabric"
          ],
          "smells": [
            "warm beeswax polish",
            "faint tobacco smoke"
          ],
          "mood": "restrained formality"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "bright firelight flickering on walls",
            "long shadows stretching across floor"
          ],
          "sounds": [
            "gentle ticking of clock",
            "low voices and laughter"
          ],
          "smells": [
            "rich leather",
            "burning oak logs"
          ],
          "mood": "warm conviviality"
        }
      ],
      "paragraphs": [
        "The manor’s main hall commands attention with its soaring panelled walls and the grand staircase that sweeps upward beneath a jewel-toned stained-glass window. Portraits of stern ancestors gaze down from gilded frames, their painted eyes catching the flicker of brass sconces and the warm glow of the hearth. Velvet curtains in deep crimson drape the tall windows, softening the chill that seeps in from the autumn mists outside.",
        "Throughout the day, the hall serves as the estate’s social heart, where family and guests gather beneath the watchful silence of generations past. The polished oak floors reflect muted footfalls and the rustle of fine fabrics, while the scent of beeswax polish mingles with burning wood smoke, creating a comforting yet formal atmosphere. At night, the space quiets, the grandfather clock’s ticking marking the passage of time in the growing shadows."
      ]
    },
    {
      "id": "servants_quarters",
      "name": "Servants' Quarters",
      "type": "interior",
      "purpose": "Staff living and work area",
      "visualDetails": "A modest, dimly lit corridor lined with plain wooden doors leading to small bedrooms and a communal sitting room. Walls are painted a faded cream, scuffed and worn from years of use. A narrow staircase connects to the kitchen below.",
      "sensoryDetails": {
        "sights": [
          "flickering oil lamps",
          "worn wooden floorboards",
          "threadbare carpets",
          "simple iron bedsteads",
          "line-dried laundry hanging"
        ],
        "sounds": [
          "soft murmurs and whispered conversations",
          "clinking of china from kitchen below",
          "creaking floorboards",
          "distant clatter of silverware",
          "muffled footsteps on stairs"
        ],
        "smells": [
          "soapy water and starch",
          "simmering stew from kitchen",
          "faint scent of lavender soap",
          "damp woolen clothing",
          "smoke from kitchen hearth"
        ],
        "tactile": [
          "rough cotton sheets",
          "chilly stone walls",
          "scuffed wooden chair seats",
          "cool metal bed frames",
          "stiff wool uniforms"
        ]
      },
      "accessControl": "Restricted to household staff; family and guests prohibited; entrance monitored by housekeeper; curfew enforced after 10pm.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light through small windows",
            "water droplets on windowpanes",
            "glossy wet boots by door"
          ],
          "sounds": [
            "steady rain on roof slates",
            "soft chatter preparing for day",
            "clinking teaspoons"
          ],
          "smells": [
            "freshly boiled water",
            "damp linen",
            "smoke from kitchen fire"
          ],
          "mood": "quiet industriousness"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows lengthening in corridor",
            "flickering lamp flames"
          ],
          "sounds": [
            "muttering voices",
            "distant chopping in kitchen"
          ],
          "smells": [
            "starch and soap",
            "cooked vegetables"
          ],
          "mood": "weary routine"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm lamplight pools",
            "darkened windows"
          ],
          "sounds": [
            "soft sighs",
            "whispered gossip"
          ],
          "smells": [
            "damp wool",
            "embers in hearth"
          ],
          "mood": "tired camaraderie"
        }
      ],
      "paragraphs": [
        "The servants’ quarters lie in a quieter wing of the manor, far from the polished grandeur of the family’s living spaces. Narrow corridors lined with scuffed wooden doors open into small, sparsely furnished bedrooms and a communal sitting room where staff gather in stolen moments of rest. The air is thick with the mingled scents of soap, simmering stew, and faint smoke drifting up from the kitchen hearth below.",
        "Flickering oil lamps cast long shadows on faded cream walls, revealing years of wear and the quiet endurance of those who live here. The atmosphere is one of tired industry, the steady rhythm of duties and whispered conversations punctuating the long days and enforced curfews. Though humble, this space holds its own secrets and alliances, far removed from the estate’s formal social rituals."
      ]
    },
    {
      "id": "wine_cellar",
      "name": "Wine Cellar",
      "type": "transitional",
      "purpose": "Clue discovery",
      "visualDetails": "A cool subterranean chamber with stone walls lined by rows of wooden racks filled with dusty bottles. Low vaulted ceilings and wrought iron sconces provide dim, flickering light. The floor is uneven flagstone, damp to the touch, with faint traces of spilled wine staining the mortar.",
      "sensoryDetails": {
        "sights": [
          "dust-covered glass bottles",
          "flickering candlelight shadows",
          "moss growing in stone crevices",
          "spilled dark red stains",
          "rusted metal cellar door hinges"
        ],
        "sounds": [
          "drip of water from ceiling",
          "soft echo of footsteps",
          "candle flame flicker",
          "distant muffled voices overhead",
          "rustle of wine labels"
        ],
        "smells": [
          "musty damp stone",
          "aged oak barrels",
          "rich scent of fermenting grapes",
          "faint tang of vinegar",
          "old leather and dust"
        ],
        "tactile": [
          "cold rough stone walls",
          "slick wine-stained floor patches",
          "smooth glass bottle necks",
          "cool metal door handle",
          "crumbling mortar texture"
        ]
      },
      "accessControl": "Strictly limited access; family cellar key held by estate steward; servants enter only for stock inventory; locked at all other times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim filtered light through small grating",
            "water droplets on stone"
          ],
          "sounds": [
            "steady drip from ceiling",
            "distant rain on roof"
          ],
          "smells": [
            "damp stone and earth",
            "musty cellar air"
          ],
          "mood": "chilling secrecy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flickering candle shadows",
            "dark corners in racks"
          ],
          "sounds": [
            "soft echoing footsteps",
            "rustle of labels"
          ],
          "smells": [
            "rich oak and dust",
            "faint grape fermentation"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm candle glow",
            "shimmering bottle reflections"
          ],
          "sounds": [
            "quiet crackle of flame",
            "distant muffled voices"
          ],
          "smells": [
            "aged leather",
            "dry stone and wine"
          ],
          "mood": "ominous stillness"
        }
      ],
      "paragraphs": [
        "Beneath the manor lies the wine cellar, a cool and shadowed chamber where rows of ancient wooden racks cradle dusty bottles of vintage port and claret. The low vaulted ceiling and rough stone walls absorb the flickering candlelight, casting dancing shadows across spilled wine stains and moss-grown crevices. The uneven flagstone floor is damp in places, betraying the cellar’s subterranean secrets.",
        "Access is tightly controlled, with only the estate steward and select servants permitted entry. The air is thick with the scent of fermenting grapes and old oak barrels, mingling with the musty chill of damp stone. Here, in the silence punctuated only by the drip of water and the rustle of labels, clues long hidden may await discovery beneath layers of dust and shadow."
      ]
    }
  ],
  "note": "",
  "cost": 0.006897332,
  "durationMs": 48898
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1930,
    "month": "December",
    "day": 12,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "December",
    "weather": [
      "chilly temperatures often hovering around freezing overnight",
      "frequent overcast skies with intermittent drizzle or light sleet",
      "dampness lingering in the air and on leafless trees"
    ],
    "daylight": "short days with dusk settling by around 4 pm, limited daylight hours fostering an early evening atmosphere",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded and the household has settled",
    "holidays": [
      "Christmas preparations underway throughout the month",
      "Boxing Day celebrated on December 26th",
      "Advent season observed with church services and household rituals"
    ],
    "seasonalActivities": [
      "decorating the manor with holly, ivy, and mistletoe",
      "attending local Christmas fairs or church carol services",
      "warming by the fireside with brandy or hot cider after brisk country walks"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "single-breasted wool suits with narrow lapels in dark hues",
        "crisp white detachable collars paired with silk ties",
        "long overcoats made of heavy tweed or camel hair"
      ],
      "casual": [
        "knitted wool vests layered under jackets",
        "corduroy trousers popular for country wear",
        "leather brogue boots suitable for muddy estate grounds"
      ],
      "accessories": [
        "felt homburg hats",
        "leather gloves lined with wool",
        "pocket watches on chain"
      ]
    },
    "womensWear": {
      "formal": [
        "long velvet evening gowns with dropped waistlines",
        "fur-trimmed coats in rich shades like burgundy or forest green",
        "lace or silk gloves extending past the wrist"
      ],
      "casual": [
        "knitted wool sweaters paired with calf-length skirts",
        "felt cloche hats adorned with subtle ribbons or feathers",
        "thick wool stockings and leather ankle boots"
      ],
      "accessories": [
        "beaded handbags",
        "brooches featuring Art Deco motifs",
        "fur stoles or muffs for outdoor warmth"
      ]
    },
    "trendsOfTheMoment": [
      "continued influence of Art Deco geometric patterns on fabrics and jewelry",
      "return to more tailored, sober silhouettes reflecting economic caution",
      "luxurious textures like velvet and fur reserved for winter formal occasions"
    ],
    "socialExpectations": [
      "men expected to maintain impeccable grooming and punctuality",
      "women to exhibit modesty with appropriate winter attire and poise",
      "strict adherence to class decorum in dress and behavior, especially in country estates"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Great Depression deepens, impacting British industry and unemployment rates",
      "Labour government under Ramsay MacDonald faces criticism over austerity measures",
      "Growing concerns in Britain regarding political instability in Europe, particularly the rise of extremist movements in Germany and Italy"
    ],
    "politicalClimate": "A tense and uncertain atmosphere prevails, with cautious government policies aimed at economic stabilization amid increasing international unease.",
    "economicConditions": "Widespread unemployment and wage cuts affect working classes; rural estates feel pressure to maintain traditional lifestyles despite financial constraints.",
    "socialIssues": [
      "Class disparities sharpen due to economic hardship",
      "Debates on social welfare reforms gain prominence",
      "Women's roles are evolving slowly but still constrained by traditional expectations"
    ],
    "internationalNews": [
      "Italy's invasion of Ethiopia is looming, stirring diplomatic tensions",
      "Germany's political fragmentation grows as the Nazi party gains traction"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's early crooning records gaining popularity",
        "Duke Ellington's jazz orchestras captivating London audiences",
        "Traditional British carols experiencing a seasonal revival"
      ],
      "films": [
        "‘All Quiet on the Western Front’ (1930) still widely viewed and discussed",
        "‘Anna Christie’ starring Greta Garbo released earlier in the year",
        "British film ‘The Informer’ (1930) noted for its gritty realism"
      ],
      "theater": [
        "West End productions of Noel Coward's plays continue to draw elite audiences",
        "Pantomime performances popular during the Christmas season",
        "Shakespearean revivals staged in regional theaters"
      ],
      "radio": [
        "BBC Home Service broadcasts nightly news and music programs",
        "Variety shows featuring comedy sketches and musical acts",
        "Children's hour with storytelling and educational content"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s ‘The Murder at the Vicarage’ (published earlier in 1930)",
        "Virginia Woolf's essays and novels continue to influence literary circles",
        "T.S. Eliot’s poetry gaining critical acclaim"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Modernist literature",
        "Social commentary novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "Early developments in sound film technology continuing to evolve",
        "Improved battery radios becoming household staples",
        "Advances in forensic fingerprinting techniques"
      ],
      "commonDevices": [
        "Rotary dial telephones on party lines",
        "Manual typewriters in offices and homes",
        "Petrol-powered automobiles used primarily by upper classes"
      ],
      "emergingTrends": [
        "Wireless radio gaining influence on public opinion and entertainment",
        "Automobile ownership slowly increasing in rural areas",
        "Home heating improving with coal and gas central heating installations"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 4 pence",
        "Coal scuttle refill: 1 shilling 6 pence",
        "Taxi ride across town: approximately 2 shillings"
      ],
      "commonActivities": [
        "Morning walks in the estate grounds before breakfast",
        "Afternoon tea served punctually with staff attendance",
        "Evening gatherings around the fireplace with radio broadcasts"
      ],
      "socialRituals": [
        "Formal dinners requiring strict dress codes and seating arrangements",
        "Sunday church attendance followed by family luncheon"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Rigid adherence to social hierarchy, with stark divides between gentry and servants",
      "Economic hardship causing some erosion of traditional deference but not openly challenged"
    ],
    "gender": [
      "Women expected to maintain domestic roles and uphold family reputation",
      "Men as primary breadwinners under pressure from economic uncertainty",
      "Emerging but limited acceptance of women’s increased participation in public life"
    ],
    "race": [
      "Predominantly white British social context with limited awareness or integration of racial diversity",
      "Imperial attitudes still pervasive in upper-class circles"
    ],
    "generalNorms": [
      "Politeness and reserve valued in public and private interactions",
      "Privacy of the household strictly maintained, especially in country estates",
      "Reputation and discretion around scandal paramount"
    ]
  },
  "atmosphericDetails": [
    "The faint scent of burning coal mingles with crisp winter air dampened by drizzle",
    "Crackling fires cast flickering shadows on paneled walls and heavy velvet drapes",
    "The ticking of grandfather clocks and distant hoot of owls punctuate the manor's quiet nights"
  ],
  "paragraphs": [
    "December 1930 in rural England brings a cold, damp winter settling over country estates. The biting chill and persistent drizzle turn gravel paths to muddy tracks, limiting outdoor excursions but encouraging cozy retreats indoors. Short winter days fade early, with dusk arriving by mid-afternoon, encouraging the household to gather around roaring fires as darkness envelopes the manor. Christmas is approaching, and preparations such as holly decorations and carol rehearsals provide brief warmth and cheer amid the economic gloom of the Great Depression. The political landscape adds an undercurrent of unease, as news of growing extremism abroad filters through the evening radio broadcasts.",
    "Fashion in this early winter reflects both practicality and the desire for understated elegance. Men don heavy overcoats of tweed and camel hair over sharply tailored suits, their attire completed with felt homburg hats and leather gloves, signaling their station and sobriety in uncertain times. Women favor velvet gowns and fur-trimmed coats for formal occasions, while daywear consists of knitted sweaters paired with calf-length skirts and cloche hats, balancing warmth with the period’s emerging modernity. Accessories such as Art Deco-inspired brooches and beaded handbags nod to current trends, yet social expectations maintain strict decorum, especially within a manor’s microcosm of class distinctions.",
    "Daily life within the manor adheres to a strict regimen: morning walks along the estate’s leafless avenues, punctuated by punctilious meals served by attentive staff. The social rituals of afternoon tea and formal dinners provide structure and continuity amidst wider societal instability. The staff's movements and duties are tightly choreographed, ensuring the estate functions seamlessly despite the economic pressures visible in the cautious austerity of household budgets. News from the outside world—government austerity measures, rising unemployment, and political tensions in Europe—filters in through newspapers and the BBC radio, casting a shadow over the genteel facades and underscoring the fragile veneer of stability on the estate."
  ],
  "note": "This temporal context is carefully constructed to root the mystery firmly in December 1930 rural England, capturing the interplay of seasonal atmosphere, social hierarchy, and the broader historical moment.",
  "cost": 0.0033398039999999996,
  "durationMs": 24270
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst strict class divisions and economic strain, the Marwood family, their staff, and visitors are confined to a remote English manor where social protocols and estate duties heighten tensions and scrutiny following a sudden tragedy.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Rigid class distinctions separate gentry, staff, and visitors, with formal routines and deference to hierarchy intensified by the Great Depression's economic pressures and limited social mobility."
  },
  "setting": {
    "location": "A large English manor house set in extensive grounds with outbuildings, servant quarters, and formal gardens.",
    "institution": "Country house estate (Manor house)",
    "weather": "Typical early autumn in rural England—cool with intermittent drizzle affecting outdoor movement and evidence preservation."
  },
  "castAnchors": [
    "Inspector Evelyn Harcourt",
    "Lady Beatrice Marwood",
    "Charles Fenwick",
    "Annabelle Marwood",
    "Harold Grimshaw",
    "Margaret Cox",
    "Simon Hastings"
  ],
  "theme": "A cozy yet tense classic murder mystery where genteel appearances mask underlying anxieties shaped by social hierarchy and economic uncertainty."
}

### LOCKED_FACTS
[
  {
    "id": "clock_running_fast_by",
    "value": "thirty seconds per hour",
    "description": "The grandfather clock’s pendulum alteration caused it to run fast by thirty seconds every hour"
  },
  {
    "id": "murder_time_per_clock",
    "value": "ten minutes past eleven",
    "description": "The chimes marking the claimed time of death"
  },
  {
    "id": "actual_murder_time",
    "value": "nine minutes and thirty seconds past eleven",
    "description": "The real time of murder deduced from pendulum drift"
  },
  {
    "id": "distance_to_pendulum_bob",
    "value": "fourteen inches",
    "description": "Length of the pendulum from pivot to bob center"
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
    "essential": 21,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_odd_clock_note",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_pendulum_scratch",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_minute_hand_misalignment",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_fenwick_tool_possession",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_charles_fenwick",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_wound_timing",
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
      "id": "clue_eliminate_harold_grimshaw",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_eliminate_margaret_cox",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_eliminate_simon_hastings",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_eliminate_annabelle_marwood_narrow",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_puncture_wound_ceremonial_dagger",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_examination_controlled_measurement",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_early_contradiction_pendulum_tampered",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fenwick_unique_means_skill",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_fenwick_premeditation_silence",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_murder_time_after_fifth_chime",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "physical"
    },
    {
      "id": "clue_minute_hand_incorrect_time",
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
