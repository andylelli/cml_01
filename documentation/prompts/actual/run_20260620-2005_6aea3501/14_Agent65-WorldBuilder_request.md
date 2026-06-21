# Actual Prompt Record

- Run ID: `run_6aea3501-f039-4b40-bc33-78b25107ce8b`
- Project ID: `proj_5f4e668b-257b-4fed-87e4-90607f127ab3`
- Timestamp: `2026-06-20T20:08:51.943Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `5db091bc52d8f2d5`

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
    "title": "The Langley Clock Conundrum",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Radio common, early telephones in homes, no television, typewriters standard",
        "Fingerprinting standard, basic toxicology, ballistics analysis emerging",
        "Automobiles more reliable, passenger trains peak, early commercial aviation",
        "Telephone more common, telegrams faster, airmail available",
        "Great Depression impact, class tensions, fascism rising in Europe",
        "Professional detectives emerging, forensic science developing"
      ]
    },
    "setting": {
      "location": "Large country estate with late Victorian manor house",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Manor house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "stabbing with false timeline alibi"
    }
  },
  "cast": [
    {
      "name": "Inspector Harold Finch",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [
        "Official investigator of the Langley estate murder"
      ],
      "public_persona": "Sharp, methodical police inspector with keen observation",
      "private_secret": "Skeptical of upper class appearances but respects justice",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "Present at manor estate throughout investigation",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all manor areas via official capacity"
      ],
      "behavioral_tells": [
        "Observes contradictions with patience",
        "Questions all witnesses impartially"
      ],
      "stakes": "Solve the murder to uphold law and order",
      "evidence_sensitivity": [
        "Physical clues",
        "Witness testimony",
        "Time records"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Margaret Langley",
      "age_range": "30-40",
      "role_archetype": "Daughter of Victim",
      "relationships": [
        "Daughter of the unnamed victim",
        "Sister to Edward Langley"
      ],
      "public_persona": "Composed, socially adept lady of the house",
      "private_secret": "Knows of family scandal and fears exposure",
      "motive_seed": "Protect family reputation from scandal",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been in the drawing room between ten and eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to victim’s study",
        "Presence in manor during timeframe"
      ],
      "behavioral_tells": [
        "Avoids direct questions on family past",
        "Nervous glances at clock during inquiry"
      ],
      "stakes": "Preserve family honor and social standing",
      "evidence_sensitivity": [
        "Time logs",
        "Access records",
        "Witness statements"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Edward Langley",
      "age_range": "35-45",
      "role_archetype": "Son of Victim",
      "relationships": [
        "Son of the unnamed victim",
        "Brother to Margaret Langley"
      ],
      "public_persona": "Brooding, financially strained heir",
      "private_secret": "Deeply in debt, desperate for money",
      "motive_seed": "Financial desperation and potential inheritance",
      "motive_strength": "strong",
      "alibi_window": "Claims to have been in the stables from ten to half past eleven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to victim’s study via servant’s corridor",
        "Movement through stables and grounds"
      ],
      "behavioral_tells": [
        "Irritable when questioned about finances",
        "Defensive about whereabouts"
      ],
      "stakes": "Save himself from financial ruin",
      "evidence_sensitivity": [
        "Stable logs",
        "Servant testimony",
        "Clock timings"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Clara Mitchell",
      "age_range": "25-35",
      "role_archetype": "Maid",
      "relationships": [
        "Servant in manor house",
        "Known to victim and family"
      ],
      "public_persona": "Loyal and hardworking servant",
      "private_secret": "Harbors resentment over poor treatment",
      "motive_seed": "Grudge against victim’s harshness",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been in kitchen cleaning from nine to eleven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to victim’s quarters via servant passages",
        "Movement during servant shifts"
      ],
      "behavioral_tells": [
        "Avoids speaking of victim directly",
        "Fidgety when discussing time of death"
      ],
      "stakes": "Maintain position and avoid suspicion",
      "evidence_sensitivity": [
        "Servant logs",
        "Kitchen staff testimony",
        "Clock examination"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "John Avery",
      "age_range": "50-60",
      "role_archetype": "Butler",
      "relationships": [
        "Head servant and estate manager",
        "Trusted by family"
      ],
      "public_persona": "Stoic and efficient butler",
      "private_secret": "Has secret knowledge of estate affairs",
      "motive_seed": "Protect family secrets and control over estate",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been arranging clocks and schedules from 9:30 to 11:15",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all parts of manor",
        "Control over clock mechanisms"
      ],
      "behavioral_tells": [
        "Calm demeanor masks subtle evasiveness",
        "Keeps detailed logs of staff movements"
      ],
      "stakes": "Preserve family legacy and his own position",
      "evidence_sensitivity": [
        "Clock mechanism",
        "Staff schedules",
        "Key rings"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "John Avery"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "At the Langley estate in autumn 1930s Yorkshire, the family patriarch with a scandalous past is found murdered. The manor clock had stopped at ten minutes past eleven, seemingly fixing the time of death. Family members and servants provide conflicting alibis, all supported by the clock’s time. Inspector Finch uncovers that the clock was deliberately wound backward by forty minutes, exposing a false timeline and revealing the butler’s opportunity to commit the murder while hiding behind the manipulated schedule."
    },
    "accepted_facts": [
      "Victim was stabbed in his study late in the evening",
      "Manor clock stopped at ten minutes past eleven",
      "Butler John Avery claimed to be adjusting clocks between 9:30 and 11:15",
      "Servant Clara Mitchell was cleaning in the kitchen between nine and eleven",
      "Edward Langley was in the stables between ten and half past eleven",
      "Margaret Langley was in the drawing room between ten and eleven",
      "Clock hands show scratches near center pin inconsistent with normal wear",
      "Servant heard clock ticking oddly shortly before stopping",
      "Pendulum bob has a subtle scratch matching marks on clock-winder’s tool",
      "Butler’s detailed schedule conflicts by exactly forty minutes with clock time"
    ],
    "inferred_conclusions": [
      "The manor clock was deliberately wound backward by exactly forty minutes",
      "The time of death was earlier than indicated by the stopped clock",
      "John Avery manipulated the clock to create a false alibi",
      "The true opportunity for murder aligns with the butler’s presence near the clock",
      "Other suspects’ alibis rely on the false clock time and are thus suspect"
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped. This created a false timeline supporting the butler’s alibi and misleading others about the opportunity to commit the murder. Physical evidence on the clock and servant testimonies about its unusual ticking reveal the tampering, exposing the true time of death and the butler’s guilt.",
      "delivery_path": [
        {
          "step": "Butler uses clock-winder tool with a unique scratch to wind back the clock"
        },
        {
          "step": "Clock runs backward 40 minutes, stopping at 11:10 instead of correct time"
        },
        {
          "step": "Servant notices abnormal ticking but assumes nothing"
        },
        {
          "step": "Murder occurs during the true earlier window, unnoticed due to false time"
        },
        {
          "step": "Investigator finds contradictory evidence in clock mechanism and schedules"
        }
      ]
    },
    "outcome": {
      "result": "The false timeline is exposed, eliminating other suspects whose alibis depended on the stopped clock time. John Avery’s premeditated clock tampering and opportunity are proven, confirming his guilt."
    }
  },
  "false_assumption": {
    "statement": "The stopped manor clock’s displayed time accurately indicates the time of the murder.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock is a central, trusted timekeeper in the estate, and all servant schedules and witness testimonies align with its time, giving a consistent timeline.",
    "what_it_hides": "The clock was deliberately wound backward, shifting the timeline by forty minutes and enabling the murderer to commit the crime earlier without suspicion."
  },
  "false_solution": {
    "accused_suspect": "Edward Langley",
    "supporting_points": [
      "Edward's financial desperation and opportunity to access the victim through servant passages",
      "Edward’s claimed alibi at the stables is weak and corroborated only by the clock time"
    ],
    "the_one_flaw": "The stables logbook records Edward entering at half past eleven, forty minutes after the true time of death, disproving his presence at the murder time.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Margaret Langley’s nervous glances at the manor clock and evasiveness when questioned about family scandals.",
      "points_at_suspect": "Margaret Langley",
      "innocent_explanation": "Margaret was anxious about the family’s reputation unrelated to the murder and feared the exposure of old secrets, not involved in the crime.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Clara Mitchell claims to have heard voices near the victim’s study around the supposed time of death.",
      "points_at_suspect": "Clara Mitchell",
      "innocent_explanation": "Clara overheard a heated family argument earlier in the evening but was not near the study at the time of the murder.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Margaret Langley",
      "Edward Langley",
      "Clara Mitchell",
      "John Avery"
    ],
    "rationale": "The manor estate was isolated by weather and social protocol; no outsider had opportunity or access to commit the murder undetected."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Manor clock stopped at ten minutes past eleven",
        "Stable logbook records Edward Langley entering at half past eleven",
        "Butler’s schedule of clock winding from 9:30 to 11:15"
      ],
      "windows": [
        "Victim’s time of death between ten and eleven",
        "Servants’ duties scheduled by manor clock time",
        "Butler’s clock manipulation occurred shortly before clock stopped"
      ],
      "contradictions": [
        "Clock shows later time than servants’ schedule actual time",
        "Stable logbook time conflicts with claimed alibi",
        "Clock hands scratched near center pin inconsistent with normal wear"
      ]
    },
    "access": {
      "actors": [
        "Butler John Avery",
        "Margaret Langley",
        "Edward Langley",
        "Clara Mitchell"
      ],
      "objects": [
        "Manor clock",
        "Clock-winder’s tool",
        "Stable logbook",
        "Key rings"
      ],
      "permissions": [
        "Butler has universal access to manor and clock mechanisms",
        "Servants restricted to specific quarters and times",
        "Family members have access but limited knowledge of clock mechanics"
      ]
    },
    "physical": {
      "laws": [
        "Clock mechanism cannot run backwards without external force",
        "Physical scratches on clock parts indicate tool use"
      ],
      "traces": [
        "Pendulum bob scratch matching clock-winder’s tool",
        "Scratches on clock hands near center pin",
        "Servant’s report of odd ticking sound"
      ]
    },
    "social": {
      "trust_channels": [
        "Servants’ logbooks",
        "Butler’s schedule records",
        "Family social protocol and hierarchy"
      ],
      "authority_sources": [
        "Butler as estate manager and clock keeper",
        "Inspector Finch’s investigative authority"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear.",
        "correction": "The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.",
        "effect": "Narrows suspect pool to those with access to clock mechanism, notably John Avery.",
        "required_evidence": [
          "Clock hands with scratches near center pin",
          "Pendulum bob with matching tool mark scratch",
          "John Avery’s possession of clock-winder’s tool"
        ],
        "reader_observable": true
      },
      {
        "observation": "A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped at ten minutes past eleven.",
        "correction": "The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating all alibis based on the stopped clock time.",
        "effect": "Eliminates alibis dependent on clock time, focusing suspicion on those who could manipulate the clock.",
        "required_evidence": [
          "Servant’s testimony about odd ticking",
          "Manor clock stopped at ten minutes past eleven",
          "Butler John Avery’s schedule involving clock maintenance"
        ],
        "reader_observable": true
      },
      {
        "observation": "The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the true time of death inferred from clock tampering.",
        "correction": "Edward’s claimed alibi at the stables after the murder time is disproved, eliminating him as the murderer.",
        "effect": "Eliminates Edward Langley as suspect.",
        "required_evidence": [
          "Stable logbook entry of Edward Langley at half past eleven",
          "Inferred true time of death before eleven o’clock",
          "Edward’s claimed alibi between ten and half past eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, and he was responsible for winding clocks on the evening of the murder.",
        "correction": "John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window to commit the murder.",
        "effect": "Identifies John Avery as the only suspect with motive, access, and opportunity.",
        "required_evidence": [
          "Butler’s schedule conflicting by forty minutes",
          "Responsibility for clock winding assigned to John Avery",
          "Physical evidence of clock tampering"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled comparison of the manor clock’s scratched hands and pendulum bob with the clock-winder’s tool marks, combined with cross-referencing the butler’s schedule against the stopped clock time, conclusively proves deliberate clock winding backward by John Avery, exposing his false alibi and opportunity to commit the murder.",
    "knowledge_revealed": "The butler’s premeditated clock tampering and manipulation of the timeline is irrefutably established, eliminating all other suspects and confirming his guilt.",
    "pass_condition": "Physical evidence of matching tool marks and schedule conflict conclusively links John Avery to the clock tampering and murder timeframe.",
    "evidence_clues": [
      "clue_1",
      "clue_11",
      "clue_7",
      "clue_3",
      "clue_8",
      "clue_clock_hands_scratches"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The physical scratches on the clock hands and pendulum bob (early clues) establish tampering. Step 2: The servant’s testimony about the odd ticking (mid clues) reveals clock manipulation. Step 3: The stable logbook entries (mid clues) eliminate Edward Langley. Step 4: The butler’s schedule conflict (late clue) links him to the tampering. All clues are presented before the discriminating test, allowing the reader to deduce the true timeline and culprit."
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
        "Execute the discriminating test",
        "Observe the culprit's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Margaret Langley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by multiple servants and schedule alignment",
        "supporting_clues": [
          "clue_margaret_alibi",
          "clue_servant_testimony"
        ]
      },
      {
        "suspect_name": "Edward Langley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Stable logbook entry disproves claimed alibi",
        "supporting_clues": [
          "clue_stable_log",
          "clue_alibi_timing"
        ]
      },
      {
        "suspect_name": "Clara Mitchell",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Kitchen staff testimony confirms presence during murder",
        "supporting_clues": [
          "clue_kitchen_testimony",
          "clue_cleaning_schedule"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with clock tampering evidence and schedule contradictions"
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
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_alibi_timing",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Edward’s testimony and schedule"
      },
      {
        "clue_id": "clue_butler_schedule_conflict",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Discovery of butler’s detailed schedule"
      },
      {
        "clue_id": "clue_margaret_alibi",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Margaret’s statement and servant corroboration"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_servant_odd_ticking",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Servant testimony during questioning"
      },
      {
        "clue_id": "clue_stable_log",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Stable logbook entries"
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
        "clue_id": "clue_13",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Cross-check contradiction"
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
        "clue_id": "clue_cleaning_schedule",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cleaning duty roster"
      },
      {
        "clue_id": "clue_clock_hands_scratches",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation of clock mechanism"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
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
        "clue_id": "clue_culprit_direct_john_avery",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_kitchen_testimony",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Kitchen staff confirming Clara’s presence"
      },
      {
        "clue_id": "clue_pendulum_scratch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Inspector’s close examination of pendulum bob"
      },
      {
        "clue_id": "clue_servant_testimony",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Multiple servants confirm Margaret’s location"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Inspector Harold Finch",
    "summary": "A seasoned Scotland Yard detective whose meticulous mind and steadfast adherence to procedure mask a profound unease about political interference.",
    "publicPersona": "Inspector Finch presents as the archetype of the methodical detective: measured, precise, and unflappable. His reputation for unraveling complex cases is well-earned, and he commands respect with a quiet authority. He speaks with deliberate clarity, often pausing to consider his words as if weighing evidence in real time. To the public and his peers, he is the embodiment of justice executed without prejudice.",
    "privateSecret": "Behind the calm exterior, Finch wrestles with the pressure exerted by his superiors to expedite closure of the Langley case, despite unresolved questions. This political expediency gnaws at his conscience, threatening to compromise the very principles he has built his career upon.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "impossible",
    "stakes": "His career reputation and integrity are at risk if the case is mishandled.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with deliberate enunciation and a measured cadence; often uses dry, understated remarks to punctuate observations. Tends to phrase questions precisely and rarely indulges in small talk, though his rare wry comments reveal a sharp intellect beneath the formal exterior.",
    "internalConflict": "Harold struggles with the moral dilemma of enforcing justice impartially while resisting pressure from powerful figures demanding a swift resolution, fearing that yielding would betray his lifelong commitment to truth.",
    "personalStakeInCase": "The Langley case represents more than a professional challenge; it is a test of Finch’s integrity against political forces that threaten to undermine the rule of law. Failure here could sully his reputation irrevocably and haunt his conscience.",
    "paragraphs": [
      "Inspector Harold Finch arrived at the Langley estate with the air of a man accustomed to bearing heavy burdens. His sharp eyes missed little, scanning the grand Victorian manor and its inhabitants with the quiet intensity of a hawk. Years of service at Scotland Yard had honed his instincts, but the Langley Clock Conundrum was no ordinary case. The whispers of scandal and the weight of aristocratic secrets pressed upon him like the heavy fog rolling over the moors.",
      "Finch’s approach was methodical, his questions precise and his observations meticulous. He was a man who trusted facts above all else, and yet beneath this veneer of certainty lurked a growing unease. Pressure from his superiors to conclude the investigation swiftly clashed with his thorough nature. He knew that giving in would mean sacrificing justice for convenience, a thought that kept him awake in the quiet hours.",
      "Conversations with the Langley family and their retinue revealed the complex web of relationships and old grievances. Finch’s dry wit surfaced occasionally, a subtle tool to disarm suspects or ease tension in the drawing room. Yet, his humour was restrained, never frivolous, always serving a purpose in his pursuit of truth. His speech carried the weight of experience, each word measured, his pauses thoughtful, a man who valued silence as much as speech.",
      "Despite his professional detachment, Finch felt a personal stake in the case. The Langley affair was a crucible testing his principles against the machinations of power. He feared that the truth, if suppressed, would corrode not only the family’s legacy but also the very justice he served. This internal conflict sharpened his resolve, even as it threatened to erode his faith in the system he upheld.",
      "As the investigation unfolded, Finch found himself torn between the cold logic of procedure and the messy realities of human frailty. The inspector’s moral compass wavered in the face of political expediency, yet his commitment to uncovering the truth remained unshaken. The Langley Clock Conundrum was more than a puzzle; it was a test of character, and Finch was determined not to fail."
    ],
    "order": 1
  },
  {
    "name": "Margaret Langley",
    "summary": "The dignified matriarch of the Langley estate, whose poised exterior conceals a secret past that could topple her carefully preserved world.",
    "publicPersona": "Margaret Langley commands respect with the grace of a seasoned socialite and the steely resolve of a woman who has weathered financial storms. She speaks with refined diction, her tone calm and measured, reflecting the weight of responsibility she bears. Her presence fills a room with quiet authority, and her laughter, though rare, is warm and genuine.",
    "privateSecret": "Decades ago, Margaret engaged in a clandestine affair with the victim, a liaison that, if revealed, would devastate her reputation and jeopardize her control over the estate. This shadow from the past haunts her, compelling desperate measures to preserve her legacy.",
    "motiveSeed": "Stands to lose control over the estate if the victim exposes the old scandal; killing was preferred to avoid public disgrace and financial ruin.",
    "motiveStrength": "compelling",
    "alibiWindow": "was attending a dinner in the main hall during the murder, but few can confirm her presence continuously",
    "accessPlausibility": "easy",
    "stakes": "Preservation of family legacy and personal reputation.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Speaks with measured elegance and a soft yet firm tone. Her sentences often carry a subtle irony or gentle understatement, betraying a mind that weighs words as carefully as decisions. She rarely raises her voice, instead using calm authority to command attention.",
    "internalConflict": "Margaret wrestles with guilt over the past affair and the extreme steps taken to silence the victim, torn between protecting her family's name and confronting the moral consequences of her actions.",
    "personalStakeInCase": "The survival of the Langley estate and her personal reputation hinge on the outcome. Exposure of the scandal would unravel decades of hard-won respectability and financial stability.",
    "paragraphs": [
      "Margaret Langley stood at the heart of the family estate like a finely cut gem, polished by years of scrutiny and care. Her hands, though soft, bore the callouses of relentless stewardship. In public, she was the epitome of composure, managing the estate’s affairs with an iron will cloaked in velvet. The guests at the dinner that night would recall her serene presence, though few could vouch for her every moment.",
      "Beneath the surface, Margaret’s mind raced with shadows of a secret long buried. The victim’s knowledge of their past liaison was a threat that could not be allowed to surface. To Margaret, the estate was more than land and bricks; it was the embodiment of her family’s legacy, and she would defend it at any cost. This conviction lent a quiet desperation to her otherwise poised demeanor.",
      "Her speech bore the hallmark of understatement, a subtle weapon she wielded with finesse. When pressed, she would deflect with a gentle smile or a softly spoken quip that hinted at depths unspoken. It was this blend of grace and steel that made her both beloved and feared within the household.",
      "As the investigation progressed, Margaret found herself confronting the consequences of her past, the weight of silence pressing heavier with each revelation. The internal conflict between self-preservation and conscience gnawed at her, yet she remained steadfast. For her, the stakes were not merely personal but ancestral, a burden she bore with resolute dignity.",
      "In the quiet moments away from prying eyes, Margaret pondered the fragile balance between truth and legacy. The Langley Clock Conundrum was not just a mystery of time and death but a reckoning with the ghosts that lingered in the manor’s shadowed halls. Her resolve to protect all she had built would test the limits of her soul."
    ],
    "order": 2
  },
  {
    "name": "Edward Langley",
    "summary": "The disinherited son and fervent political activist whose rebellious spirit masks a simmering resentment and dangerous ambitions.",
    "publicPersona": "Edward Langley is a fiery, outspoken critic of the aristocratic values his family embodies. His speech is direct and impassioned, peppered with rhetorical flourishes that reveal his idealism and disdain for the old order. Among his peers, he is seen as a radical voice, unafraid to challenge convention and stir controversy.",
    "privateSecret": "Bitter over being cut from the inheritance and haunted by youthful indiscretions exposed by the victim, Edward harbors a deep grudge, fueling a desire for revenge and reclamation of his birthright.",
    "motiveSeed": "Seeks revenge and a share of the inheritance; victim threatened to reveal damaging truths that would ruin Edward's political aspirations.",
    "motiveStrength": "strong",
    "alibiWindow": "claims to have been at a political meeting, but no reliable witnesses confirm his presence during the murder time frame",
    "accessPlausibility": "possible",
    "stakes": "Desire to reclaim status and silence threats to his future.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks with sharp, biting sarcasm and quick retorts. His tone often carries a rebellious edge, with a tendency to mock the pretensions of his family and their world. He uses humour as a weapon to unsettle and provoke, never missing an opportunity for a pointed barb.",
    "internalConflict": "Edward struggles to reconcile his radical ideals with lingering familial loyalties and the personal cost of his vendetta, creating a turbulent inner battle between ambition and conscience.",
    "personalStakeInCase": "The murder and its fallout directly impact his future—exposing secrets could both destroy his political career and, paradoxically, offer a path to reclaiming his rightful place.",
    "paragraphs": [
      "Edward Langley strode into the room with the confidence of a man who believed the world ought to bend to his will. His eyes burned with a passionate fire that spoke of sleepless nights spent railing against the injustices of his birthright. To Edward, the Langley estate was a symbol of everything he despised: privilege, hypocrisy, and the stifling weight of tradition.",
      "His speeches at political gatherings were fiery and uncompromising, rallying the disenfranchised with promises of upheaval. Yet beneath the public bravado lay a more personal vendetta. The victim had not only blocked his inheritance but threatened to expose youthful indiscretions that would shatter Edward’s carefully cultivated political image. It was a secret that festered like an open wound, fueling a desire for retribution.",
      "Edward’s sardonic humour was his shield and sword. Conversations with him crackled with sharp wit and biting commentary, often aimed at the absurdities of his family’s world. His speech was rapid and pointed, laced with irony and occasional disdain. Yet, in quieter moments, a shadow of doubt flickered—a hint of the internal conflict that tugged at his conscience.",
      "Despite his claims of being at a political meeting during the murder, the lack of witnesses cast a pall of suspicion. Access to the estate, while not guaranteed, was certainly within the realm of possibility for a man who knew its secrets well. The stakes for Edward were immense; the case’s resolution could either bury him or set him free.",
      "As the investigation unfolded, Edward found himself caught between the ideals that defined him and the personal costs that threatened to consume him. The Langley Clock Conundrum was more than a murder—it was a battleground for his soul, and the outcome would shape his destiny in ways he could scarcely imagine."
    ],
    "order": 3
  },
  {
    "name": "Clara Mitchell",
    "summary": "The loyal family secretary whose unassuming demeanor masks a web of deceit and desperate self-preservation.",
    "publicPersona": "Clara Mitchell is the epitome of discretion and efficiency, her calm voice and steady hands managing the family's affairs with quiet competence. She speaks softly but clearly, often using gentle reassurances to put others at ease. To outsiders, she is the trusted confidante, the invisible thread holding the household together.",
    "privateSecret": "Clara has manipulated estate documents to conceal financial forgeries tied to the victim, a secret that now threatens to unravel her life and livelihood.",
    "motiveSeed": "Feared exposure by the victim who recently threatened to reveal her forgeries to the family lawyer; murder was seen as the only escape.",
    "motiveStrength": "strong",
    "alibiWindow": "was supposedly organizing estate records in the study, alone and unobserved at the time of the murder",
    "accessPlausibility": "easy",
    "stakes": "Avoiding criminal charges and loss of livelihood.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks in a soft, measured tone with an undercurrent of polite sarcasm. Her words often carry a double meaning, delivered with impeccable manners that thinly veil sharp observations. Clara’s humour is subtle, used sparingly to deflect suspicion or assert quiet control.",
    "internalConflict": "Clara wrestles with the guilt of betraying the family she serves and the fear of losing everything if her forgeries are exposed, caught between loyalty and self-preservation.",
    "personalStakeInCase": "Her very freedom and future depend on the case’s outcome; exposure would mean ruin, while silence offers a chance at survival.",
    "paragraphs": [
      "Clara Mitchell moved through the Langley estate with the practiced grace of one who has spent decades mastering the art of invisibility. Her presence was steady and reassuring, the kind that made even the most troubled guest feel that the household was in capable hands. Yet beneath her composed exterior lay a mind constantly calculating, ever watchful.",
      "Her role as secretary was more than clerical; she was gatekeeper of secrets, the keeper of the family’s delicate balance. Among the stacks of estate documents, Clara had concealed more than just papers—she had hidden forgeries that protected the family’s finances, forgeries that the victim had discovered and threatened to expose. The threat to her livelihood was immediate and grave.",
      "Clara’s speech was a study in polite savagery. Her compliments were edged with subtle barbs, and her reassurances often bore an undercurrent of warning. She wielded her impeccable manners like a blade, cutting through pretense with a smile that never quite reached her eyes. Her humour, though gentle, served as a shield against suspicion and a means to assert quiet dominance.",
      "At the time of the murder, Clara claimed to have been alone in the study, organizing records. This alibi was fragile, relying on the absence of witnesses more than solid proof. The ease with which she could access the victim’s quarters made her a person of interest, yet her loyalty to the family complicated the picture.",
      "Internally, Clara was torn between devotion to the Langleys and the instinct for survival. The weight of her deception pressed heavily upon her conscience, but the fear of exposure was a stronger force. The Langley Clock Conundrum was a crucible testing not only the family’s secrets but her own fragile equilibrium."
    ],
    "order": 4
  },
  {
    "name": "John Avery",
    "summary": "A venerable retired military officer and steadfast family friend, whose dedication to tradition conceals a history of compromising loyalties.",
    "publicPersona": "John Avery carries himself with the dignified bearing of a man accustomed to command. His voice is steady and authoritative, imbued with the cadence of military precision. He speaks with measured formality, often invoking principles of honour and duty. To those around him, he is a pillar of stability and a guardian of the old ways.",
    "privateSecret": "Avery once concealed a scandal involving the victim and the family, a secret that now weighs heavily as the victim plans to publish memoirs threatening the established order.",
    "motiveSeed": "Wants to prevent victim’s plans to publish memoirs exposing the family’s past, fearing it would dismantle the old order; considered murder as last resort to protect social stability.",
    "motiveStrength": "moderate",
    "alibiWindow": "was seen walking in the gardens but timing is vague; access to victim’s room was possible but unconfirmed",
    "accessPlausibility": "possible",
    "stakes": "Protecting legacy and social order.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.2,
    "speechMannerisms": "Speaks with formal, deliberate phrasing, occasionally punctuated by dry self-deprecating remarks. His military background informs a direct style, but he tempers it with modesty and a touch of wry humour that surfaces when least expected.",
    "internalConflict": "John grapples with his role in past cover-ups and the fear that changing times will render his lifelong values obsolete, caught between loyalty and the inevitability of change.",
    "personalStakeInCase": "The case threatens to expose secrets that would dismantle the social fabric he has devoted himself to preserving, challenging his identity and purpose.",
    "paragraphs": [
      "John Avery’s presence at the Langley estate was as constant as the ticking of the great clock in the manor’s hall. A retired officer with a lifetime of service behind him, Avery embodied the virtues of discipline and honour. His measured voice carried the weight of experience, and his eyes reflected a mind accustomed to strategic thinking.",
      "To the family and their guests, he was a steadfast friend and advisor, a living link to an era where duty and tradition reigned supreme. Yet beneath this facade lay the burden of past compromises. Avery had once helped conceal a scandal involving the victim and the family, a secret that now threatened to unravel with the victim’s intent to publish revealing memoirs.",
      "His speech was formal and deliberate, each phrase carefully chosen. Occasionally, Avery would interject a dry, self-deprecating comment that revealed a man aware of his own limitations and the absurdities of his world. This rare glimpse of humour lent him a humanising warmth amidst the rigidity.",
      "On the night of the murder, witnesses placed him walking the gardens, though the exact timing lacked precision. His access to the victim’s quarters was plausible but unconfirmed, leaving a shadow of doubt. The stakes were high; Avery feared that the exposure of family secrets would not only disgrace those involved but also signal the end of the social order he cherished.",
      "Caught in a maelstrom of loyalty and inevitability, John Avery faced the Langley Clock Conundrum as a reckoning with his own past. The case challenged his identity and forced him to confront the cost of preserving tradition in a changing world."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Langley Manor",
    "type": "Manor house estate",
    "place": "Langley Green",
    "country": "England",
    "summary": "A late Victorian country estate nestled amid autumnal English countryside, Langley Manor stands as a bastion of fading aristocratic order and simmering tensions.",
    "visualDescription": "A sprawling late Victorian manor of modest architectural detailing, its stone façade weathered and softened by decades of mist and rain. Formal gardens framed by clipped yew hedges and wrought iron fencing stretch outward, while stables and servants’ quarters cluster discreetly behind the main house. Stone walls and wrought iron gates enclose the estate, with gravel drives leading to a gatehouse perched at the sole entrance along a narrow country lane.",
    "atmosphere": "The manor exudes a quiet, reserved dignity, its interiors dimly lit by gas lamps and shaded windows. The social hierarchy is physically echoed in the estate’s layout: servant corridors and family wings separated by locked doors, with the estate’s rhythms dictated by the clock and the weather’s slow, relentless dampening of light and spirits.",
    "paragraphs": [
      "Langley Manor rises from the mist like a relic of a bygone era, its late Victorian stonework etched with creeping ivy and softened by the persistent English drizzle. The formal gardens, once meticulously tended, now bear the weight of autumn’s decay, their gravel paths slick and muted underfoot. Beyond the main house, the stables emit faint sounds of restless horses, while the servants’ quarters remain a hive of discreet activity, their presence carefully partitioned from the family’s refined spaces.",
      "The estate’s stone walls and wrought iron gates form a formidable boundary against the surrounding countryside, funneling all visitors through the gatehouse where strict visitor logs are maintained. This geographic isolation, several miles from the nearest village of Langley Green, ensures that news and help arrive slowly, especially under the frequent fog and drizzle that blanket the land. The manor’s interior is a labyrinth of locked doors and restricted corridors, reflecting the rigid social order that governs movement and access within.",
      "Inside, gas lamps cast flickering shadows across dark oak paneling and faded wallpaper, while the scent of beeswax and cold ash lingers in the drawing room. Early rotary telephones sit on walnut desks in the family study, alongside manual typewriters awaiting correspondence. Radio broadcasts occasionally murmur from the living room’s polished cabinet, providing a tenuous link to the wider world beyond the estate’s stone walls and autumnal gloom.",
      "The residents of Langley Manor move through their days with a measured cadence, shaped by the manor’s clock and the social rituals that both bind and divide them. The Great Depression’s subtle strain is felt in the reduced household staff and the fraying of traditional deference, all under the shadow of an uncertain future as distant geopolitical tensions quietly encroach."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast skies with intermittent drizzle typical of English countryside in autumn, creating damp conditions and muted natural light",
    "timeFlow": "Three days of mounting tension culminating in the discovery of the crime",
    "mood": "Quiet tension underscored by social decorum, as the manor’s inhabitants navigate unspoken class boundaries amid the backdrop of looming geopolitical unrest",
    "eraMarkers": [
      "Radio receivers common in living rooms",
      "Early rotary dial telephones installed in manor offices and family bedrooms",
      "Manual typewriters used for correspondence and record keeping",
      "Reliable petrol-powered automobiles used by estate owners and staff",
      "Passenger trains as primary long-distance travel method",
      "Telephone calls routed through party-line or private estate exchanges",
      "Telegrams sent and received via nearest village telegraph office"
    ],
    "sensoryPalette": {
      "dominant": "damp stone and autumnal earth",
      "secondary": [
        "muted candlelight and beeswax",
        "faint crackle of radio static"
      ]
    },
    "paragraphs": [
      "The persistent drizzle seeps into every crevice of Langley Manor, softening edges and dulling colors. The overcast sky filters a pale, diffuse light through leaded windows, bathing the interiors in a cool, muted glow. Damp stone and autumnal earth scents mingle with the faint warmth of beeswax polish and cold ash. The soft ticking of clocks and the occasional crackle of a radio broadcast punctuate the otherwise hushed atmosphere, where whispered conversations and measured footsteps carry the weight of unspoken secrets.",
      "Outside, the estate’s stone walls and wrought iron gates stand stoic against the creeping fog that swallows the distant countryside. Gravel paths lie slick underfoot, and the rustle of fallen leaves blends with the subdued clatter of hooves in the stables. The air is thick with the scent of damp wood, moss, and the faint trace of tobacco smoke drifting from the study. Movement is deliberate, constrained by social protocol and the manor’s physical labyrinth, each corridor and locked door a barrier between worlds within the estate."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Family Drawing Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A spacious room with dark oak paneling and faded floral wallpaper, furnished with heavy leather armchairs and a large mahogany writing desk. Leaded windows face the formal gardens, filtered by heavy velvet drapes. A grand fireplace dominates one wall, its hearth cold and shadowed.",
      "sensoryDetails": {
        "sights": [
          "flickering gas lamp shadows",
          "rain-streaked leaded windows",
          "dark oak paneling gleaming faintly",
          "worn leather armchairs",
          "heavy velvet drapes drawn partially",
          "polished mahogany desk surface"
        ],
        "sounds": [
          "soft ticking of a mantel clock",
          "distant muffled voices from hall",
          "crackling of cold fireplace ash",
          "gentle rustle of drapes",
          "pages turning quietly",
          "occasional radio static bursts"
        ],
        "smells": [
          "cold beeswax polish",
          "faint tobacco smoke",
          "musty leather and paper",
          "damp wood and stone",
          "trace of stale pipe tobacco",
          "subtle scent of polished brass"
        ],
        "tactile": [
          "smooth leather armrests",
          "cool polished wood desk edges",
          "rough woven upholstery fabric",
          "chill draft from window casement",
          "heavy velvet curtain folds",
          "granular ash residue on hearth"
        ]
      },
      "accessControl": "Access restricted to family members and select guests during daytime; locked after evening gatherings with keys held by the housekeeper and family patriarch.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windowpanes",
            "grey light filtering through drapes",
            "damp garden vistas",
            "dim gas lamp glow"
          ],
          "sounds": [
            "steady rain drumming on roof",
            "soft patter on window ledges",
            "distant horse hooves on gravel",
            "quiet turning of pages"
          ],
          "smells": [
            "damp stone and earth",
            "cold beeswax and ash",
            "wet leather upholstery",
            "faint woodsmoke from hearth"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light across paneling",
            "shadows pooling in corners",
            "dull shine on desk surface",
            "still velvet curtains"
          ],
          "sounds": [
            "quiet ticking clock",
            "soft breathing in silence",
            "creak of settling wood",
            "murmured conversation beyond door"
          ],
          "smells": [
            "beeswax polish",
            "aged paper and leather",
            "faint pipe tobacco",
            "cold stone and damp"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on brass fittings",
            "glint of glassware on side table",
            "soft glow on leather armchairs"
          ],
          "sounds": [
            "mantel clock ticking steadily",
            "low murmurs of conversation",
            "fireplace crackle and snap",
            "footsteps echoing on stone floor"
          ],
          "smells": [
            "warm beeswax and smoke",
            "rich tobacco and pipe ash",
            "polished wood and leather",
            "faint scent of evening tea"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The family drawing room is a sanctuary of faded grandeur, where the weight of tradition presses in the heavy oak paneling and worn leather furnishings. Leaded windows look out onto the damp gardens, their glass streaked with rain and shadowed by the heavy velvet drapes that soften the muted light. The large mahogany desk, cluttered with letters and a manual typewriter, stands as a silent witness to the day’s events.",
        "Within this room, the subtle scents of beeswax polish and tobacco smoke mingle with the chill dampness seeping through stone walls. The quiet ticking of the mantel clock and the occasional crackle from the cold fireplace punctuate the stillness, underscoring the tension that lingers in the air. Access is tightly controlled, with the room locked after evening gatherings, ensuring that only select family members and trusted guests may enter."
      ]
    },
    {
      "id": "library",
      "name": "The Manor Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A narrow, elongated room lined floor-to-ceiling with dark oak bookshelves filled with leather-bound volumes. A heavy Persian rug muffles footsteps, while a large bay window overlooks the east gardens. A brass reading lamp illuminates a worn leather wingback chair beside an antique writing desk.",
      "sensoryDetails": {
        "sights": [
          "rows of aged leather spines",
          "dust motes in filtered daylight",
          "brass lamp glow on wood grain",
          "cracked leather chair upholstery",
          "intricate Persian rug patterns",
          "frosted glass of window panes"
        ],
        "sounds": [
          "soft rustling of pages",
          "quiet scratch of fountain pen",
          "distant ticking of grandfather clock",
          "muted footsteps on rug",
          "gentle sigh of settling wood",
          "faint creak of leather chair"
        ],
        "smells": [
          "musty old books",
          "worn leather bindings",
          "faint scent of ink and paper",
          "polished wood polish",
          "subtle trace of pipe tobacco",
          "dry dust and mothballs"
        ],
        "tactile": [
          "smooth worn leather armrests",
          "rough textured book spines",
          "cool polished wood desktop",
          "soft pile of Persian rug",
          "frosty window glass edges",
          "slightly brittle pages"
        ]
      },
      "accessControl": "Accessible only during daylight hours to family and selected staff; locked at night with keys held by the librarian and housekeeper.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-blurred garden views",
            "dim overcast light",
            "wet leaves against window",
            "shimmering brass reflections"
          ],
          "sounds": [
            "steady rainfall tapping window",
            "soft turning of pages",
            "low hum of distant thunder",
            "quiet scratching of pen"
          ],
          "smells": [
            "damp paper and wood",
            "wet earth from garden",
            "pencil graphite",
            "cold leather"
          ],
          "mood": "contemplative"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on bookshelves",
            "deep shadows between shelves",
            "faint dust motes suspended",
            "soft lamp glow"
          ],
          "sounds": [
            "gentle scratch of pen nib",
            "silence broken by clock ticks",
            "rustle of pages turning",
            "creak of chair leather"
          ],
          "smells": [
            "aged paper and leather",
            "wood polish",
            "faint tobacco smoke",
            "dry dust"
          ],
          "mood": "focused stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm lamplight pools",
            "shadows cast by bookshelves",
            "glint of brass lamp",
            "soft reflection on polished wood"
          ],
          "sounds": [
            "quiet ticking clock",
            "soft sigh of settling house",
            "occasional page turn",
            "leather chair creak"
          ],
          "smells": [
            "warm beeswax",
            "faint pipe tobacco",
            "polished wood",
            "old parchment"
          ],
          "mood": "reflective calm"
        }
      ],
      "paragraphs": [
        "The manor library is a haven of quiet reflection, where the scent of musty books and worn leather envelops visitors in a comforting embrace. Rows of dark oak shelves rise to the ceiling, packed with volumes whose cracked spines and faded gilt lettering speak to decades of careful use. A heavy Persian rug muffles footsteps, while the bay window offers a muted view of the east gardens, often blurred by the persistent autumn drizzle.",
        "Here, the subtle sounds of pages turning and the scratch of a fountain pen on paper punctuate the stillness. The brass reading lamp casts a warm glow over a worn leather wingback chair and an antique writing desk, inviting moments of solitary contemplation. Access is strictly limited to daylight hours, with the room locked at night to preserve both security and the fragile tranquility within."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants’ Hall",
      "type": "interior",
      "purpose": "Gathering space for staff",
      "visualDetails": "A modest, functional room with plain wooden tables and benches, exposed beams overhead, and a large cast-iron stove at one end. Walls are plastered and painted a pale cream, worn by years of bustling activity. A small sideboard holds simple crockery and utensils.",
      "sensoryDetails": {
        "sights": [
          "scuffed wooden floorboards",
          "plain cream plaster walls",
          "flickering stove flames",
          "stacked crockery on sideboard",
          "threadbare bench cushions",
          "worn wooden table surfaces"
        ],
        "sounds": [
          "clatter of dishes",
          "low murmurs and laughter",
          "stove crackling warmly",
          "footsteps on creaking floor",
          "rustle of linen uniforms",
          "clinking of cutlery"
        ],
        "smells": [
          "warm wood smoke",
          "stew and fresh bread",
          "soap and starch",
          "damp woolen uniforms",
          "faint scent of coal smoke",
          "earthy soot"
        ],
        "tactile": [
          "rough wooden bench seats",
          "coarse linen tablecloths",
          "warm stove cast-iron surface",
          "cool stone flagstone floor",
          "scratchy wool uniform fabric",
          "smooth ceramic crockery edges"
        ]
      },
      "accessControl": "Reserved exclusively for household staff during meal times and breaks; locked during family events to maintain separation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through small windows",
            "steam rising from enamel mugs",
            "glowing stove embers"
          ],
          "sounds": [
            "steady rain on roof",
            "soft chatter over breakfast",
            "clink of spoons in mugs",
            "wooden chair scraping floor"
          ],
          "smells": [
            "fresh brewed tea",
            "warm porridge and bread",
            "damp wool and earth",
            "wood smoke"
          ],
          "mood": "busy warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "muted daylight through grimy panes",
            "empty plates stacked neatly",
            "cool shadows under beams",
            "quiet corners of room"
          ],
          "sounds": [
            "distant footsteps in corridors",
            "soft scraping of broom",
            "whispered conversations",
            "wood stove crackle"
          ],
          "smells": [
            "soap and starch",
            "lingering stew aromas",
            "coal smoke faintly",
            "dust and damp wood"
          ],
          "mood": "reserved calm"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm stove glow",
            "shadows dancing on walls",
            "neatly stacked crockery",
            "polished wooden surfaces"
          ],
          "sounds": [
            "low chatter and laughter",
            "clinking cutlery",
            "stove fire popping",
            "soft footsteps on floorboards"
          ],
          "smells": [
            "fresh bread and stew",
            "wood smoke and coal",
            "linen and soap",
            "earthy dampness"
          ],
          "mood": "contented respite"
        }
      ],
      "paragraphs": [
        "The servants’ hall serves as the heart of the household staff’s daily life, a plain but welcoming space where the rigors of duty give way to shared meals and quiet camaraderie. Exposed beams and plastered walls bear the marks of years of bustling activity, while the large cast-iron stove radiates a comforting warmth against the chill of the autumn air creeping in through small windows.",
        "Here, the scents of fresh bread, stew, and wood smoke mingle with the faint traces of coal and damp wool from the staff’s uniforms. The room’s modest furnishings—rough wooden benches and tables, threadbare cushions, and a small sideboard stocked with crockery—reflect the practical needs of its occupants. Access is carefully controlled to maintain the separation between family and servants, preserving the social order that governs life within Langley Manor."
      ]
    },
    {
      "id": "gatehouse",
      "name": "Estate Gatehouse",
      "type": "transitional",
      "purpose": "Security and visitor control point",
      "visualDetails": "A small stone building with a slate roof, situated at the entrance to the estate’s gravel drive. A wrought iron gate stands sentinel, flanked by stone pillars topped with lanterns. Inside, a narrow room contains a visitor logbook, a wooden desk, and a rotary telephone mounted on the wall.",
      "sensoryDetails": {
        "sights": [
          "weathered stone walls",
          "iron gate with rust spots",
          "flickering lantern light",
          "neatly stacked firewood",
          "muddy gravel driveway",
          "worn wooden desk surface"
        ],
        "sounds": [
          "click of gate latch",
          "footsteps crunching gravel",
          "distant carriage wheels",
          "rotary dial telephone clicks",
          "soft murmurs from gatekeeper",
          "rustle of paper pages"
        ],
        "smells": [
          "wet stone and earth",
          "smoke from nearby hearth",
          "oil and grease from gate hinges",
          "leather-bound logbook",
          "cold metal and wood",
          "faint scent of horse sweat"
        ],
        "tactile": [
          "rough stone ledge",
          "cool iron gate bars",
          "smooth worn leather logbook cover",
          "chilled wooden desk edges",
          "cold metal gate latch",
          "weathered slate roof tiles"
        ]
      },
      "accessControl": "Strictly controlled entry point; all visitors must register and be approved by estate staff. Gatehouse staffed 24/7, with keys held by head gardener and estate manager.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-dappled stonework",
            "puddles on gravel",
            "grey mist enveloping gate",
            "dim lantern glow"
          ],
          "sounds": [
            "steady rain on roof slates",
            "water dripping from eaves",
            "soft footfalls on wet gravel",
            "rustling of rain-soaked coats"
          ],
          "smells": [
            "wet earth and stone",
            "damp leather and wood",
            "smoke from hearth",
            "cold metal"
          ],
          "mood": "guarded vigilance"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on stone walls",
            "shadowed corners of gatehouse",
            "still iron gate",
            "muddy driveway patches"
          ],
          "sounds": [
            "quiet ticking of wall clock",
            "occasional gate creak",
            "distant carriage wheels",
            "soft page turning"
          ],
          "smells": [
            "cold stone and earth",
            "leather bindings",
            "woodsmoke faintly",
            "oil and grease"
          ],
          "mood": "watchful stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm lantern light glow",
            "long shadows on gravel",
            "clear sky beyond gate",
            "polished desk surface"
          ],
          "sounds": [
            "soft murmur of voices",
            "gate latch clicking",
            "footsteps on gravel",
            "telephone rotary dial clicks"
          ],
          "smells": [
            "fresh earth and stone",
            "warm woodsmoke",
            "leather and oil",
            "cold metal"
          ],
          "mood": "alert calm"
        }
      ],
      "paragraphs": [
        "The estate gatehouse stands as the first line of defense against the outside world, a modest stone building guarding the wrought iron gates that seal the manor’s gravel drive. Its weathered walls and slate roof bear the stains of countless autumn rains, while the flickering lanterns cast a steady glow over the visitor logbook and rotary telephone within. The gatekeeper’s watchful presence ensures that all arrivals are scrutinized and recorded.",
        "Here, the scents of damp stone, cold metal, and faint woodsmoke mingle with the earthy aroma of the surrounding grounds. The steady rhythm of footsteps crunching on gravel, the click of gate latches, and the soft rustle of rain-soaked coats create a sensory tableau of vigilance and routine. Access is tightly controlled, with the gatehouse staffed around the clock and keys held only by trusted senior estate personnel."
      ]
    }
  ],
  "note": "",
  "cost": 0.007451279999999999,
  "durationMs": 34835
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1931,
    "month": "April",
    "day": 12,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "cool temperatures averaging 45-55°F (7-13°C)",
      "frequent overcast skies with intermittent drizzle",
      "ground damp from overnight showers, occasional fog in mornings"
    ],
    "daylight": "Lengthening spring days with daylight extending until roughly 7:45 pm, twilight lingering softly until nearly 8:30 pm",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded and servants have begun their nightly rounds",
    "holidays": [
      "Easter Sunday (April 5, 1931)",
      "St. George’s Day (April 23, 1931) celebrated modestly in some households"
    ],
    "seasonalActivities": [
      "Tending to early spring gardens, planting pansies and primroses in manor grounds",
      "Afternoon tea gatherings in conservatories or drawing rooms to avoid damp chill",
      "Strolling along estate paths wrapped in light wool coats and scarves during breaks in drizzle"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece wool suits in muted greys and browns with wide lapels",
        "starched detachable collars paired with conservative neckties",
        "leather Oxford shoes polished to a high shine"
      ],
      "casual": [
        "knitted argyle sweaters layered over collared shirts",
        "plus-fours or tweed knickerbockers for outdoor pursuits",
        "soft felt trilby or homburg hats"
      ],
      "accessories": [
        "silver pocket watches with chain fobs",
        "leather driving gloves",
        "silk scarves in subtle patterns"
      ]
    },
    "womensWear": {
      "formal": [
        "bias-cut day dresses with modest dropped waists in pastel shades",
        "cloche hats adorned with narrow ribbons or small flowers",
        "kid leather gloves in cream or pale grey"
      ],
      "casual": [
        "pleated skirts paired with knit cardigans",
        "lightweight trench coats for damp weather",
        "flat-heeled oxford shoes or Mary Janes"
      ],
      "accessories": [
        "small leather handbags with metal clasps",
        "string of pearls or delicate brooches",
        "umbrella with wooden crook handle"
      ]
    },
    "trendsOfTheMoment": [
      "Growing popularity of softer, more natural silhouettes for women replacing rigid flapper styles",
      "Men’s fashion favoring earth-tone tweeds inspired by countryside leisure",
      "Cloche hats remain fashionable but with increasingly understated decoration"
    ],
    "socialExpectations": [
      "Men expected to maintain impeccable grooming and conservative attire reflecting status",
      "Women to embody restrained elegance, with emphasis on modesty and refinement",
      "Servants required to wear traditional livery and exhibit discreet deference"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Britain grappling with the economic fallout of the Great Depression, unemployment rising sharply",
      "Labour Party under Ramsay MacDonald forming National Government coalition in response to crisis",
      "Political instability in Europe with Mussolini consolidating fascist power in Italy"
    ],
    "politicalClimate": "A tense and cautious atmosphere as Britain seeks to stabilize financially while watching growing authoritarian movements abroad; domestic politics marked by compromise and austerity measures",
    "economicConditions": "Severe economic downturn affecting industries and agriculture, estate owners feeling pressure to reduce staff and expenses; rationed spending common among middle and upper classes",
    "socialIssues": [
      "Rising unemployment and poverty in industrial towns",
      "Class distinctions remain rigid but with subtle anxieties about social mobility",
      "Growing discussion around women's roles post-suffrage and economic necessity"
    ],
    "internationalNews": [
      "Japan’s aggression in Manchuria escalating regional tensions",
      "Ongoing diplomatic efforts to enforce disarmament treaties amid fears of future conflict"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Al Bowlly's crooning hits on BBC broadcasts",
        "Duke Ellington’s jazz gaining limited but influential audiences in London clubs",
        "Dance bands playing foxtrots and waltzes at local ballrooms"
      ],
      "films": [
        "‘Dracula’ (1931) starring Bela Lugosi, recently released and causing a stir",
        "‘City Lights’ by Charlie Chaplin, widely admired",
        "British crime dramas shown in provincial cinemas"
      ],
      "theater": [
        "Noël Coward’s plays popular among London society",
        "Operettas and revues in West End theaters",
        "Local amateur dramatics continuing traditional repertoire"
      ],
      "radio": [
        "BBC National Programme delivering news and variety shows",
        "Detective serials gaining a modest following",
        "Classical music concerts broadcast weekly"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s ‘The Sittaford Mystery’ (1931)",
        "Virginia Woolf’s essays in literary journals",
        "D.H. Lawrence’s works continuing to provoke debate"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Modernist literature with social commentary",
        "Historical novels set in British countryside"
      ]
    },
    "technology": {
      "recentInventions": [
        "Improved radio receivers with better sound clarity",
        "Early versions of electric vacuum cleaners becoming available",
        "Automatic telephone exchanges beginning to replace manual switchboards"
      ],
      "commonDevices": [
        "Wind-up gramophones in many drawing rooms",
        "Rotary dial telephones installed in wealthier homes",
        "Manual typewriters standard in offices and manor studies"
      ],
      "emergingTrends": [
        "Increasing reliance on radio for news and entertainment",
        "Early experiments with home electric appliances",
        "Growing adoption of motor cars among upper classes"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 4 pence",
        "Pint of milk: 3 pence",
        "Taxi ride across town: 2 shillings"
      ],
      "commonActivities": [
        "Reading newspapers and listening to radio news broadcasts",
        "Afternoon tea rituals with light cakes and finger sandwiches",
        "Gardening and estate maintenance duties for staff"
      ],
      "socialRituals": [
        "Formal dinner parties with strict seating arrangements",
        "Sunday church attendance followed by family walks on the grounds"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Rigid class hierarchy strongly observed within estates and society at large",
      "Growing unease about economic disparities but no widespread challenge to aristocratic privilege"
    ],
    "gender": [
      "Women balancing traditional domestic expectations with expanding social freedoms",
      "Men expected to embody stoicism and leadership amid economic uncertainty",
      "Emerging scrutiny of women’s roles in workforce and politics"
    ],
    "race": [
      "Predominantly Eurocentric social circles with limited awareness of colonial subjects",
      "Racial attitudes marked by entrenched prejudices common in British society"
    ],
    "generalNorms": [
      "Strict codes of etiquette governing speech, dress, and behavior",
      "Emphasis on discretion and maintaining family reputation",
      "Deference to authority figures and social superiors expected at all times"
    ]
  },
  "atmosphericDetails": [
    "The persistent drizzle muffles footsteps on gravel paths, blending with the distant call of crows in the misty morning air.",
    "Heavy wool curtains absorb the dim daylight filtering through leaded glass windows, casting soft shadows across oak-paneled rooms.",
    "The faint scent of damp earth and freshly brewed tea pervades the manor, underscoring the quiet tension that hums beneath polite conversation."
  ],
  "paragraphs": [
    "April 1931 in the English countryside is a season of tentative renewal, where the lingering chill and frequent drizzle temper the first signs of spring. Manor grounds are sodden but alive with early blooms like primroses and daffodils, tended carefully by gardeners mindful of the estate’s reputation. Days lengthen, allowing for extended afternoon teas in conservatories shielded from damp winds. Despite the natural revival, a subtle unease permeates the air, reflecting both the economic hardships of the Great Depression and the distant rumblings of political unrest across Europe.",
    "Fashion in this moment reflects a careful balance between tradition and subtle modernity. Gentlemen favor earth-toned tweeds and crisp three-piece suits, projecting stability and respectability amid uncertain times, while ladies adopt softer silhouettes with bias-cut dresses and practical yet elegant outerwear suitable for unpredictable spring weather. Accessories are chosen with understated refinement — cloche hats trimmed with narrow ribbons, silk scarves, and polished leather shoes — all signaling adherence to social decorum and class distinctions that remain fiercely observed within the manor’s walls.",
    "Life unfolds with a rhythmic formality underscored by social rituals that reinforce hierarchy and discretion. Evening meals are conducted with strict seating arrangements and subdued conversation, while servants move quietly through dimly lit corridors, their presence a constant but unobtrusive backdrop. Radio broadcasts deliver news of political coalitions and rising fascist movements abroad, seeping into the collective consciousness but rarely discussed openly. Meanwhile, the manor’s inhabitants navigate personal ambitions and unspoken tensions, their interactions shaped by the intertwining pressures of class, gender, and the fragile veneer of civility in a changing world."
  ],
  "note": "This temporal context grounds 'The Langley Clock Conundrum' in a vivid April 1931 English manor setting, capturing the nuanced interplay of seasonal atmosphere, class-conscious fashion, and the socio-political undercurrents essential to a compelling mystery narrative.",
  "cost": 0.0033527599999999998,
  "durationMs": 14589
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "In a remote 1930s English country estate, the Langley family, their guests, and servants are confined by strict class divisions and social decorum amid economic hardship and rising geopolitical tensions, all under the watchful eye of estate staff and Inspector Finch.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Clear class distinctions between landed gentry, guests, and servants shape daily interactions, with economic pressures from the Great Depression affecting employment stability and heightening social anxieties, while awareness of European fascism adds an undercurrent of unease."
  },
  "setting": {
    "location": "English countryside, several miles from nearest village",
    "institution": "Manor house estate",
    "weather": "Overcast skies with intermittent drizzle typical of English countryside in autumn, creating damp conditions and muted natural light"
  },
  "castAnchors": [
    "Inspector Harold Finch",
    "Margaret Langley",
    "Edward Langley",
    "Clara Mitchell",
    "John Avery"
  ],
  "theme": "Navigating hidden tensions and unspoken boundaries within a socially stratified manor during uncertain times, where appearances mask deeper conflicts and loyalties."
}

### LOCKED_FACTS
[
  {
    "id": "clock_reading",
    "value": "ten minutes past eleven",
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "tamper_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The manor clock's hands show signs of tampering rather than natural aging.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating the natural stop time assumption.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating the natural stop time assumption.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the manor clock stopped.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "The stable logbook shows Edward Langley entering the stables at half past eleven, forty minutes after the manor clock stopped.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Edward Langley’s claimed alibi at the stables after the murder time is disproved by the stable logbook, eliminating him as the murderer.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Edward Langley’s claimed alibi at the stables after the murder time is disproved, eliminating him as the murderer.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, showing a deliberate mismatch.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, showing a deliberate mismatch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "behavioral",
      "description": "John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window for the murder.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window for the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_11",
      "category": "physical",
      "description": "A controlled comparison of the manor clock’s scratched hands and pendulum bob with the clock-winder’s tool reveals matching scratch patterns.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "A controlled comparison of the manor clock’s scratched hands and pendulum bob with the clock-winder’s tool confirms tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "temporal",
      "description": "John Avery is uniquely linked to the clock manipulation through the matching scratch patterns and his exclusive access to the clock-winder’s tool.",
      "sourceInCML": "CASE.cast[4].evidence_sensitivity[0]",
      "pointsTo": "John Avery is uniquely identified as the culprit due to his connection with the clock-winder’s tool and the scratch evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_13",
      "category": "behavioral",
      "description": "John Avery’s personal notes reveal intentions to protect family secrets and maintain control over the estate, indicating motive and premeditation.",
      "sourceInCML": "CASE.cast[4].evidence_sensitivity[1]",
      "pointsTo": "John Avery’s premeditation and motive to protect family secrets and control the estate.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_14",
      "category": "testimonial",
      "description": "Clara Mitchell’s alibi is corroborated by kitchen staff testimony and servant logs, eliminating her as a suspect.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Eliminates Clara Mitchell because her alibi is corroborated by multiple witnesses and logs.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Clara Mitchell because her whereabouts during the murder time are confirmed by servant logs and kitchen staff testimony, focusing suspicion on John Avery.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Eliminates Clara Mitchell because her whereabouts during the murder time are confirmed by servant logs and kitchen staff testimony, focusing suspicion on John Avery.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_15",
      "category": "temporal",
      "description": "The stable logbook’s time entry conflicts with Edward Langley’s claimed alibi, disproving his presence at the murder scene.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Edward Langley’s alibi is disproved by the stable logbook, excluding him from suspicion.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_1",
      "category": "temporal",
      "description": "Direct evidence links John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Physical trace and opportunity evidence indicate John Avery had means and opportunity, making this a direct evidence clue for culprit identification. No other eligible suspect, including Clara Mitchell, matches this mechanism-specific evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_john_avery",
      "category": "physical",
      "description": "Direct evidence ties John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines.",
      "sourceInCML": "CASE.cast[4].evidence_sensitivity[0]",
      "pointsTo": "This direct evidence shows John Avery had means and opportunity, narrowing the solution uniquely toward the culprit. No other eligible suspect, including Clara Mitchell, matches this mechanism-specific evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_clock_hands_scratches",
      "category": "behavioral",
      "description": "John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window for the murder.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "John Avery premeditated the clock manipulation to create a false timeline, giving himself a concealed window for the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_pendulum_scratch",
      "category": "temporal",
      "description": "Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, showing a deliberate mismatch.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "Butler John Avery’s detailed schedule conflicts by exactly forty minutes with the manor clock time, showing a deliberate mismatch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_servant_odd_ticking",
      "category": "temporal",
      "description": "The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "The murderer's plan hinged on manipulating the manor clock to show a later time than actual, by winding it backward 40 minutes before it stopped.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_butler_schedule_conflict",
      "category": "temporal",
      "description": "The manor clock’s hands have unusual scratches near the center pin inconsistent with normal wear and tear.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The manor clock's hands show signs of tampering rather than natural aging.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_stable_log",
      "category": "temporal",
      "description": "The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_alibi_timing",
      "category": "testimonial",
      "description": "A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "A servant recalls hearing the manor clock ticking oddly and running backwards shortly before it stopped.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_margaret_alibi",
      "category": "temporal",
      "description": "The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating the natural stop time assumption.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The clock was wound backward deliberately, shifting the timeline by approximately forty minutes, invalidating the natural stop time assumption.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_servant_testimony",
      "category": "temporal",
      "description": "The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The scratches indicate deliberate tampering of the clock mechanism by a tool, contradicting the assumption that the clock stopped naturally.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_kitchen_testimony",
      "category": "temporal",
      "description": "John Avery is uniquely linked to the clock manipulation through the matching scratch patterns and his exclusive access to the clock-winder’s tool.",
      "sourceInCML": "CASE.cast[4].evidence_sensitivity[0]",
      "pointsTo": "John Avery is uniquely identified as the culprit due to his connection with the clock-winder’s tool and the scratch evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_cleaning_schedule",
      "category": "temporal",
      "description": "Direct evidence links John Avery to the mechanism access point before the discriminating test and excludes competing suspect timelines.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Physical trace and opportunity evidence indicate John Avery had means and opportunity, making this a direct evidence clue for culprit identification. No other eligible suspect, including Clara Mitchell, matches this mechanism-specific evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Manor clock stopped at ten minutes past eleven remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The manor displayed accurately at ten trusted past eleven, which matches the time servants reported hearing a scream, suggesting it accurately central.",
      "supportsAssumption": "The stopped manor clock’s displayed time accurately indicates the time of the murder.",
      "misdirection": "This misleads by ignoring the manor and clocks evidence, which show the displayed was manipulated."
    },
    {
      "id": "rh_2",
      "description": "The manor timekeeper’s hands appear worn in a manner consistent with normal use, supporting the idea that the timekeeper estate servant at the time of the murder.",
      "supportsAssumption": "The stopped manor clock’s displayed time accurately indicates the time of the murder.",
      "misdirection": "This misleads by neglecting the unusual scratch patterns and the servant’s testimony about the timekeeper running backwards."
    }
  ],
  "status": "pass",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_mechanism_visibility_core",
      "clue_servant_odd_ticking",
      "clue_butler_schedule_conflict",
      "clue_stable_log",
      "clue_alibi_timing",
      "clue_margaret_alibi"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_core_contradiction_chain",
      "clue_11",
      "clue_12",
      "clue_13",
      "clue_14",
      "clue_core_elimination_chain",
      "clue_15",
      "clue_culprit_direct_1",
      "clue_culprit_direct_john_avery",
      "clue_clock_hands_scratches",
      "clue_pendulum_scratch",
      "clue_servant_testimony",
      "clue_kitchen_testimony",
      "clue_cleaning_schedule"
    ],
    "late": [
      "clue_late_optional_slot_1"
    ]
  },
  "fairPlayChecks": {
    "allEssentialCluesPresent": true,
    "noNewFactsIntroduced": true,
    "redHerringsDontBreakLogic": true
  },
  "latencyMs": 19995,
  "cost": 0.004728624
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
