# Actual Prompt Record

- Run ID: `mystery-1779909096008`
- Project ID: ``
- Timestamp: `2026-05-27T19:17:52.556Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `8d499a5a4c965476`

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
    "title": "The Clock's Reversal: A Manor Murder Mystery",
    "author": "Golden Age Specialist",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "No modern forensic methods beyond fingerprinting and basic toxicology",
        "Mechanical clocks and sundials are relied upon for timekeeping",
        "Social and class divisions strictly observed in manor house",
        "Communication via telephone and telegrams only"
      ]
    },
    "setting": {
      "location": "Woolverton Manor",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Manor house on country estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "clock-tampering aided time-window murder"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [
        "Family friend of the Woolverton estate",
        "Respected by staff and gentry alike"
      ],
      "public_persona": "Sharp, observant amateur sleuth",
      "private_secret": "Has mechanical clock repair knowledge from childhood",
      "motive_seed": "Desire to uncover truth and protect innocent",
      "motive_strength": "moderate",
      "alibi_window": "Present at manor from morning until late evening",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Freely moves about manor",
        "Visits servants' quarters and main house"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Not easily misled by appearances"
      ],
      "stakes": "Protect reputation and justice",
      "evidence_sensitivity": [
        "Mechanical clues",
        "Witness statements",
        "Time records"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Family friend, physician",
      "relationships": [
        "Longtime friend of victim",
        "Respected member of local community"
      ],
      "public_persona": "Dedicated, calm doctor",
      "private_secret": "Hides knowledge of victim's recent financial troubles",
      "motive_seed": "Protect estate from scandal",
      "motive_strength": "moderate",
      "alibi_window": "Claims attending a patient at village from half-past ten to noon",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Visits manor regularly",
        "Has access to private study"
      ],
      "behavioral_tells": [
        "Occasional nervousness when questioned",
        "Answers carefully"
      ],
      "stakes": "Maintain social standing",
      "evidence_sensitivity": [
        "Testimonies",
        "Time records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "45-55",
      "role_archetype": "Retired Military, Estate Trustee",
      "relationships": [
        "Trusted by victim",
        "Known for strict discipline"
      ],
      "public_persona": "Stoic, authoritative",
      "private_secret": "Resents victim’s plans to sell estate land",
      "motive_seed": "Prevent estate sale",
      "motive_strength": "strong",
      "alibi_window": "Claims to have been inspecting stables from ten to eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to stables and grounds",
        "Free movement within manor"
      ],
      "behavioral_tells": [
        "Irritable when pressed",
        "Reserved in conversation"
      ],
      "stakes": "Preserve estate integrity",
      "evidence_sensitivity": [
        "Physical traces",
        "Access logs"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Head Servant",
      "relationships": [
        "Loyal to estate",
        "Knows household routines intimately"
      ],
      "public_persona": "Efficient, no-nonsense",
      "private_secret": "Harbors resentment over wage cuts",
      "motive_seed": "Financial grievance",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been ringing meal bell at noon",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all servant quarters",
        "Controls the meal bell mechanism"
      ],
      "behavioral_tells": [
        "Defensive when questioned about bell timings",
        "Avoids eye contact"
      ],
      "stakes": "Protect staff welfare",
      "evidence_sensitivity": [
        "Bell mechanism",
        "Staff logs"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "At Woolverton Manor, the Unnamed Head of Estate is found dead. The mechanical clock in the study shows the time as ten minutes past eleven, supported by servants’ testimony placing the death near that time. However, contradictions in servant logs and clock mechanism clues lead Detective Eleanor Voss to suspect the clock was tampered with. Through careful examination of time records, mechanical wear, and servant statements, the true time of death is revealed to be nearly forty minutes later, exposing Captain Ivor Hale’s attempt to manufacture an alibi by reversing the clock’s escapement drum. A discriminating test with the clock’s winding key and timing reconstruction confirms his guilt."
    },
    "accepted_facts": [
      "The clock in the study stopped at ten minutes past eleven",
      "Servants testify the death occurred shortly before eleven-fifteen",
      "Captain Hale claims to have been inspecting stables between ten and eleven",
      "A key matching the clock winding mechanism found in an unexpected drawer",
      "Unusual scratch marks on the back plate of the clock near winding keyhole"
    ],
    "inferred_conclusions": [
      "The clock was manually wound backward after the murder to create a false time",
      "Servants’ footsteps recorded in logs contradict the claimed time of death",
      "Captain Hale’s stable inspection alibi falls outside corrected time window",
      "Only Captain Hale had motive, access, and opportunity to manipulate the clock"
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock’s escapement drum was reversed and rewound manually, winding back the displayed time by forty minutes. This exploited the physical properties of the escapement mechanism, causing the clock face to show an earlier time after the murder. The timing illusion misled servants and investigators, enabling the culprit to fabricate an alibi. Mechanical wear, scratch marks near the winding keyhole, and contradictory servant logs expose the deception.",
      "delivery_path": [
        {
          "step": "Captain Hale accessed the study during his stable inspection window."
        },
        {
          "step": "He used a hidden key to reverse the escapement drum, winding the clock backward."
        },
        {
          "step": "This created a false time window suggesting the murder occurred earlier."
        },
        {
          "step": "Servants and witnesses relied on the false clock time and meal bell timing."
        },
        {
          "step": "Contradictory logs and mechanical clues ultimately reveal the tampering."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is established as nearly forty minutes later than the clock shows, invalidating Captain Hale’s alibi and confirming his guilt."
    }
  },
  "false_assumption": {
    "statement": "The mechanical clock’s displayed time accurately indicates the time of death.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock stopped at ten minutes past eleven, corroborated by multiple servant testimonies and the stopped pendulum, making it appear an accurate time anchor.",
    "what_it_hides": "The clock was manually wound backward after the murder, creating a false earlier time window that obscures the actual later time of death."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock face in study stopped at 11:10",
        "Servants’ log entries for footsteps at 11:30",
        "Captain Hale's claimed stable inspection from 10:00 to 11:00",
        "Meal bell ringing recorded at 12:00"
      ],
      "windows": [
        "Apparent time of death: 11:10 - 11:15",
        "Actual time of death: between 11:45 and 11:55"
      ],
      "contradictions": [
        "Footsteps recorded after 11:10 contradict clock’s stopped time",
        "Captain Hale’s alibi outside actual time window",
        "Clock face time contradicts mechanical wear evidence"
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Dr. Mallory Finch",
        "Beatrice Quill",
        "Eleanor Voss"
      ],
      "objects": [
        "Mechanical clock in study",
        "Clock winding key",
        "Servants' meal bell mechanism"
      ],
      "permissions": [
        "Captain Hale has access to study and stable",
        "Beatrice Quill controls meal bell",
        "Dr. Finch visits study occasionally",
        "Eleanor Voss is free to move throughout manor"
      ]
    },
    "physical": {
      "laws": [
        "Clock escapement drum can be reversed manually to wind back time",
        "Mechanical wear leaves traceable scratch marks near winding keyhole",
        "Pendulum stopping position is fixed by escapement state"
      ],
      "traces": [
        "Scratch marks on clock back plate",
        "Key matching winding mechanism found in drawer",
        "Footprints inconsistent with claimed timelines"
      ]
    },
    "social": {
      "trust_channels": [
        "Servants’ testimonies regarding clock and death time",
        "Captain Hale’s reputation as trustee",
        "Dr. Finch’s medical observations"
      ],
      "authority_sources": [
        "Captain Hale’s trustee role",
        "Estate staff hierarchy",
        "Detective Eleanor Voss’s investigation authority"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The mechanical clock in the study is stopped at ten minutes past eleven, but servants’ logs record footsteps near the study at half past eleven.",
        "correction": "The death could not have occurred at the clock’s displayed time since servants were active well after that time.",
        "effect": "Narrows the time of death window to after 11:10, eliminating alibis based on earlier time.",
        "required_evidence": [
          "Mechanical clock face stopped at ten minutes past eleven",
          "Servants’ log entries showing footsteps at 11:30",
          "Servants’ testimony about clock time",
          "Captain Hale’s claimed inspection window 10:00-11:00"
        ],
        "reader_observable": true
      },
      {
        "observation": "Unusual scratch marks are found on the back plate of the clock near the winding keyhole, and a key matching the clock’s winding mechanism is found hidden in a drawer not normally used for the clock key.",
        "correction": "The clock was likely manually wound backward after the murder using the hidden key, causing the displayed time to be falsified.",
        "effect": "Narrows suspect pool to those with access to study and knowledge of clock mechanism; eliminates suspects without such access.",
        "required_evidence": [
          "Scratch marks on clock back plate near winding keyhole",
          "Clock winding key found in unexpected drawer",
          "Captain Hale’s access to study",
          "Eleanor Voss’s knowledge of clock mechanisms"
        ],
        "reader_observable": true
      },
      {
        "observation": "Captain Hale’s alibi places him inspecting stables between ten and eleven, but the actual time of death is inferred to be near half past eleven based on servants’ footsteps and meal bell timing.",
        "correction": "Captain Hale’s alibi does not cover the true time of death, contradicting his claimed whereabouts.",
        "effect": "Eliminates Captain Hale’s alibi and increases suspicion on him as the culprit.",
        "required_evidence": [
          "Captain Hale’s claimed stable inspection from 10:00 to 11:00",
          "Servants’ log entries placing activity at 11:30",
          "Meal bell ringing recorded at 12:00",
          "Clock tampering evidence"
        ],
        "reader_observable": true
      },
      {
        "observation": "The pendulum of the clock is stopped in an unusual position inconsistent with the displayed time, indicating the escapement mechanism was manually reversed recently.",
        "correction": "The physical state of the clock’s escapement confirms manual reversal, supporting the hypothesis of deliberate clock manipulation.",
        "effect": "Confirms the timing illusion and implicates the person who manipulated the clock.",
        "required_evidence": [
          "Stopped pendulum position inconsistent with clock face",
          "Mechanical clock escapement design knowledge",
          "Scratch marks on clock back plate",
          "Hidden winding key location"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled test is arranged in the study where the clock’s winding key is used to attempt to rewind the escapement drum under observation. The presence of scratch marks and the pendulum’s unusual stopping position are demonstrated to be inconsistent with normal winding, proving deliberate reversal. This test exposes the impossibility of the clock’s displayed time being truthful and invalidates Captain Hale’s alibi that depended on this false timeline.",
    "knowledge_revealed": "The manual reversal of the clock escapement and the resulting false time window are conclusively proven, directly linking Captain Hale to the tampering and the murder time.",
    "pass_condition": "If the clock escapement can be reversed only by deliberate manual action leaving characteristic marks and the pendulum position matches the reversed state, the test passes and confirms guilt.",
    "evidence_clues": [
      "clue_scratch_marks",
      "clue_winding_key",
      "clue_pendulum_position",
      "clue_servants_log",
      "clue_8",
      "clue_2"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Servants’ logs (early) contradict the stopped clock time, exposing the false time window. Step 2: Mechanical evidence of scratch marks and hidden winding key (mid) reveal tampering. Step 3: Captain Hale’s alibi discrepancy (mid) eliminates his claimed timeline. Step 4: Pendulum stopping position (late) confirms manual reversal. The discriminating test uses only these previously presented clues to prove the tampering and guilt."
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
      "early_clues_min": 1,
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
        "Execute the clock winding reversal test",
        "Demonstrate scratch marks and pendulum position",
        "Reveal Captain Hale’s guilt based on timing contradiction"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by village patient records and servants’ testimony",
        "supporting_clues": [
          "Servant testimony of Dr. Finch's absence from manor",
          "Patient visit records at village"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Servant logs and meal bell mechanics proving no access to clock",
        "supporting_clues": [
          "Bell mechanism inspection records",
          "Servants’ log on meal bell timings"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Continuous presence at manor and no access to clock tampering",
        "supporting_clues": [
          "Eleanor’s testimony and presence logs",
          "Clock mechanism knowledge without opportunity"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with mechanical evidence and timing contradictions"
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
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_servants_log",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Servants’ logs and footprints contradictory to clock time"
      },
      {
        "clue_id": "clue_winding_key",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Discovery of winding key in drawer"
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
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
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
        "clue_id": "clue_pendulum_position",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Physical inspection of pendulum stopping position"
      },
      {
        "clue_id": "clue_scratch_marks",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Observation of clock back plate scratches"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A retired schoolmistress turned amateur sleuth, Eleanor Voss is a genteel lady whose sharp intellect and intimate knowledge of Woolverton Manor’s history make her a formidable investigator.",
    "publicPersona": "Eleanor is regarded in local society as a dignified and erudite woman, respected for decades of devoted teaching and community service. Her genteel manners, measured speech, and quietly commanding presence grant her entrée to the most exclusive circles. She is often seen as the embodiment of steadfast propriety, a pillar of the community whose counsel is sought in matters both educational and social.",
    "privateSecret": "Beneath this polished exterior, Eleanor harbors a simmering resentment towards the victim’s family. She witnessed firsthand the ruin they wrought upon her own kin during a scandalous affair decades earlier—a ruin that left scars not easily healed. This history fuels a private bitterness that she guards carefully, lest it tarnish her reputation or cloud her judgment.",
    "motiveSeed": "N/A - Investigator",
    "motiveStrength": "weak",
    "alibiWindow": "Present in the main hall during the murder, ostensibly chatting with guests.",
    "accessPlausibility": "easy",
    "stakes": "Eleanor’s social standing and personal closure are entwined with unearthing the truth long buried beneath layers of family secrets and genteel facades. This case offers her a chance to reconcile past grievances and restore a measure of justice to a community she cherishes.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, favoring precise diction and a touch of ironic understatement. Her humor surfaces in subtle asides and clever turns of phrase, often delivered with a faint, knowing smile that invites reflection rather than laughter.",
    "internalConflict": "Eleanor wrestles with the duality of her role: the desire to maintain her genteel reputation while confronting the harsh truths about those she once considered friends. She fears that pursuing the truth might reopen old wounds or alienate her from the society she has long served.",
    "personalStakeInCase": "This investigation is more than a puzzle; it is Eleanor’s opportunity to bring to light the injustices that have haunted her family and to assert her own agency in a world that has often silenced women of her station.",
    "paragraphs": [
      "Eleanor Voss arrives at Woolverton Manor with the quiet confidence of one accustomed to observing rather than being observed. Her years as a schoolmistress have sharpened her powers of deduction and patience, qualities she now employs to navigate the tangled relationships of the manor’s inhabitants. While the police regard her as little more than a curious bystander, Eleanor’s insight into the household’s history grants her access to secrets others overlook.",
      "Her interactions are marked by gentle probing and a subtle challenge to the assumptions held by the local gentry. She listens more than she speaks, allowing her sharp mind to piece together clues from seemingly innocuous remarks and gestures. The genteel veneer she presents masks a steely determination to uncover the truth, even if it unsettles those around her.",
      "Eleanor’s humour is dry and restrained, often a shield against the emotional toll of revisiting painful memories. She employs irony with finesse, gently exposing pretensions and hypocrisies without overt confrontation. Her wit endears her to some and disarms others, proving an invaluable tool in her amateur sleuthing.",
      "Despite her social grace, Eleanor is haunted by the legacy of the scandal that destroyed her family’s standing. This internal conflict imbues her pursuit of justice with a personal urgency, as she seeks to restore dignity not only to the victim but to herself. The case becomes a crucible in which her loyalty, courage, and sense of morality are tested.",
      "Her presence at the manor during the murder is no accident; Eleanor’s keen observations of the guests and staff provide a framework for unraveling the complex motives at play. She understands that truth in Woolverton is often concealed beneath layers of politeness and tradition, and she is determined to peel back those layers, no matter the cost."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A private physician with a reputation for discretion, Dr. Mallory Finch is a woman caught between professional duty and personal secrets that could unravel her carefully constructed life.",
    "publicPersona": "Mallory Finch commands respect as a competent and discreet doctor, trusted by the upper classes to tend to their most delicate ailments. Her calm demeanor and measured speech convey assurance, while her presence commands an unspoken authority. She is often the confidante of families, maintaining a veil of confidentiality that is as much a part of her practice as her medical skill.",
    "privateSecret": "Beneath this professional exterior lies a clandestine affair with the victim’s heir, a liaison fraught with risk. The victim had threatened to expose the relationship and disinherit the heir, jeopardizing Mallory’s career and social aspirations. The stakes are high, and the secret weighs heavily on her conscience.",
    "motiveSeed": "Stands to lose her clandestine relationship and the future financial security promised by the victim’s heir if the victim blocks their union; the victim had threatened to reveal the affair and disinherit the heir.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to be attending an emergency call in the village clinic during the murder but no direct witnesses confirm.",
    "accessPlausibility": "possible",
    "stakes": "Mallory’s reputation, career prospects, and dreams of social mobility hinge on keeping her affair secret and preserving the family’s internal balance. Exposure could mean ruin on multiple fronts.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Mallory’s speech is precise and measured, often tinged with clinical detachment. She employs understatement as a defense, rarely revealing more than necessary. Her humor is subtle, often manifesting as quiet irony or a wry observation delivered with a calm, steady gaze.",
    "internalConflict": "Mallory is torn between her professional ethics and personal desires. She fears that uncovering the truth will destroy not only her career but also the fragile happiness she has found. The possibility of betrayal and exposure casts a shadow over her every decision.",
    "personalStakeInCase": "This case is a crucible wherein Mallory’s career, reputation, and personal life hang in precarious balance. Protecting her secret is paramount, yet the truth threatens to surface, forcing her to weigh loyalty against self-preservation.",
    "paragraphs": [
      "Dr. Mallory Finch moves through Woolverton Manor with the quiet confidence of one accustomed to discretion. Her role as the private physician grants her access denied to most, yet she remains an enigma to many. She speaks softly but with authority, her carefully chosen words concealing a mind always calculating risks and opportunities.",
      "Her affair with the victim’s heir is a secret she guards with vigilance, aware that its revelation could topple the delicate social structures supporting her ambitions. This secret colors her interactions, imbuing her with a tension barely concealed beneath her professional poise.",
      "Mallory’s alibi is as neat as her surgical instruments—she claims to have been summoned to an emergency at the village clinic, a statement met with polite acceptance but lacking verification. This ambiguity fuels suspicion, though she maintains an air of calm innocence.",
      "Her humor is restrained, a shield against the emotional turmoil beneath. She wields understatement as a weapon, letting the weight of her words linger in the air, inviting others to read between the lines. Her dry wit surfaces only in moments of quiet reflection or subtle repartee.",
      "Caught between loyalty to her patient, affection for the heir, and the imperatives of her own survival, Mallory navigates a perilous path. The murder investigation threatens to expose not just the killer but the fragile secrets she has so carefully concealed."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired military officer turned estate manager, Captain Ivor Hale is a man clinging to lost prestige and desperate to preserve his status within the local gentry.",
    "publicPersona": "Captain Hale carries himself with the discipline and bearing of a once-honored officer. His speech is formal, punctuated by a commanding tone that demands respect. To some, he is a stalwart guardian of tradition; to others, a social climber whose ambitions betray a restless dissatisfaction with his diminished circumstances.",
    "privateSecret": "Financially dependent on the victim’s goodwill, Hale recently learned of plans to replace him with a more loyal steward. This revelation threatened his livelihood and social standing, driving him to desperate measures to halt the changes.",
    "motiveSeed": "Facing financial ruin and loss of status, he killed to prevent the victim from finalizing changes that would leave him destitute and disgraced; believed silence was the only option to regain control.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be inspecting stables but no independent confirmation; some servants saw him near the victim’s study shortly before the murder.",
    "accessPlausibility": "easy",
    "stakes": "Hale’s identity and future within the gentry depend on maintaining control of the estate. Losing his position would mean not only financial ruin but social exile.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "His manner of speaking is formal with a military precision, occasionally undercut by self-deprecating remarks that reveal a man aware of his fall from grace. He favors clipped sentences but softens when recounting personal disappointments, often employing dry humor to mask vulnerability.",
    "internalConflict": "Hale is torn between pride in his former military career and the bitter reality of his diminished role. His desperation to retain status conflicts with a growing awareness that his actions may irreparably damage his reputation and conscience.",
    "personalStakeInCase": "The murder threatens to expose his financial dependence and desperation. Hale’s future, social identity, and sense of self are all imperiled by the investigation’s outcome.",
    "paragraphs": [
      "Captain Ivor Hale strides through Woolverton Manor with the stiff bearing of a man accustomed to command, yet his eyes betray a simmering anxiety. Once a decorated officer, he now manages the estate with a mixture of discipline and simmering resentment, aware that his position is precarious.",
      "His speech is marked by a formal cadence, reminiscent of military orders, yet punctuated by moments of wry self-commentary. He often deflects with humor, joking about his fall from grace while secretly fearing the loss of everything he holds dear.",
      "The knowledge that the victim intended to replace him with a more loyal steward struck Hale like a blow. Financial ruin and social exile loomed, and the prospect of silence as a weapon became a desperate temptation. His movements on the night of the murder—claimed to be inspecting the stables—are shadowed by uncertainty, with servants noting his proximity to the victim’s study.",
      "Hale’s humor serves as a fragile shield, a way to acknowledge his vulnerabilities without succumbing to despair. His self-deprecating quips often mask a deeper turmoil, as he grapples with pride, fear, and the consequences of his choices.",
      "Caught between the remnants of his former glory and the harsh realities of his present, Hale’s internal struggle fuels both his actions and his regrets. The investigation threatens to strip away the last vestiges of his dignity, forcing him to confront the man he has become."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A charming socialite and aspiring writer, Beatrice Quill navigates the treacherous waters of high society with ambition and a hidden desperation.",
    "publicPersona": "Beatrice presents herself as a vivacious and gracious lady, eager to secure a place among the upper class through charm and strategic alliances. Her speech is lively and engaging, sprinkled with contemporary slang and a practiced ease that conceals the tensions beneath.",
    "privateSecret": "Secretly burdened by debts to local moneylenders, Beatrice is desperate to secure a wealthy marriage. The victim’s threat to cut off her familial financial support over a past scandal has pushed her to the brink, fueling fears that her carefully constructed future might crumble.",
    "motiveSeed": "Desperate to prevent the victim from exposing her financial desperation and ruin her chances at marriage into nobility, she believed that silencing the victim was her only option.",
    "motiveStrength": "moderate",
    "alibiWindow": "Says she was entertaining guests in the drawing room, but some guests recall her absence during critical moments.",
    "accessPlausibility": "possible",
    "stakes": "Her social ascent and financial survival depend on maintaining a façade of respectability and securing a prosperous match. Exposure would mean social ruin and the collapse of her ambitions.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with a quick, urbane rhythm, often employing sharp wit and pointed remarks masked as compliments. Her humor cuts just beneath the surface, a social weapon wielded with grace and precision. She favors clever repartee and is adept at turning awkward moments to her advantage.",
    "internalConflict": "Beatrice struggles to reconcile her desperate financial situation with the polished image she projects. The fear of exposure clashes with her determination to ascend socially, creating a tension that sharpens her cunning and heightens her anxiety.",
    "personalStakeInCase": "This case is pivotal for Beatrice’s future; the revelation of her debts or scandal would shatter her social prospects and condemn her to ruin. The stakes could not be higher for her carefully nurtured ambitions.",
    "paragraphs": [
      "Beatrice Quill glides through the drawing room with practiced charm, greeting guests with a smile that hides the turmoil beneath. Her aspirations to join the nobility through marriage fuel every calculated word and gesture, yet the weight of secret debts gnaws at her composure.",
      "Her laughter is bright but sometimes tinged with a sharpness that unsettles those unaccustomed to her brand of wit. She wields polite savagery like a finely honed blade, delivering compliments that sting and observations that expose social pretenses with elegant cruelty.",
      "The victim’s recent threats to cut off her family’s financial support have pushed Beatrice to a desperate edge. Though she claims to have been entertaining guests in the drawing room during the murder, some recall her unexplained absences, sowing seeds of doubt about her whereabouts.",
      "Her speech dances between urbane sophistication and cutting insight, revealing a woman who knows the rules of society yet refuses to be its victim. Beatrice’s internal conflict between vulnerability and ambition sharpens her instincts, making her both a formidable social player and a fragile one.",
      "As the investigation unfolds, Beatrice’s carefully constructed façade begins to crack. The fear of exposure battles with her hunger for advancement, forcing her to navigate a perilous path where one misstep could mean total ruin."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Woolverton Manor",
    "type": "Manor house on country estate",
    "place": "Cotswold Hills",
    "country": "England",
    "summary": "A grand 18th-century country manor set amidst rolling farmland and ancient woodlands, Woolverton Manor stands isolated several miles from the nearest village, its vast estate marked by formal gardens, stables, and separate servants' quarters.",
    "visualDescription": "Stone façades weathered to soft grey, mullioned windows framed by climbing ivy, slate roofs punctuated by tall chimneys, and wrought-iron gates guarding the long gravel drive lined with ancient oaks. The formal gardens are trimmed with box hedges and rose beds, while the stables and servants’ wing lie discreetly behind the main house, connected by cobbled paths.",
    "atmosphere": "The manor exudes a brooding dignity, its interiors shadowed by heavy draperies and polished dark wood. Outside, mist clings to the grounds, and the stillness is broken only by distant hooves or the rustle of autumn leaves.",
    "paragraphs": [
      "Woolverton Manor sits proudly atop a gentle rise in the Cotswold Hills, its stone walls steeped in history and the weight of tradition. The estate stretches widely, hemmed in by farmland and ancient woodlands, providing a natural barrier that insulates the household from the outside world. The approach follows a winding gravel drive, flanked by towering oaks and maples whose leaves are turning burnt amber and crimson in the early autumn chill. At the gatehouse, wrought-iron gates stand sentinel, their rusted ironwork intricate yet forbidding.",
      "Inside, the manor’s vast rooms speak of faded grandeur. The entrance hall’s flagstone floor is worn smooth by generations of polished boots, while portraits of stern-faced ancestors loom over visitors. Heavy velvet curtains mute the daylight, and the scent of beeswax polish mingles with the faint trace of pipe tobacco. The drawing room, with its deep armchairs and crackling fire, is a refuge from the damp chill outside, where the family gathers around a radio set broadcasting the evening news. The library offers a quieter retreat, walls lined with leather-bound volumes and a manual typewriter resting on a polished desk, ready for correspondence or record-keeping.",
      "The servants’ quarters are tucked away to the rear, a modest cluster of rooms and a communal hall that buzzes with activity at dawn and dusk. Access between the family wings and staff areas is carefully controlled by locked doors and keys, ensuring privacy and order. Outside the house, the stables are robust and utilitarian, their timbered walls sheltering horses whose restless neighs sometimes pierce the night. The gardens, though neatly kept, carry the tang of damp earth and decaying leaves, with the scent of late-blooming roses faint on the air.",
      "The estate’s isolation is both a safeguard and a source of unease. The nearest village lies several miles away, accessible only by narrow country lanes often slick with rain or mud. Telephone communication depends on a rural exchange, and party-line calls require patience and discretion. Automobiles are reliable but must navigate the winding roads carefully, especially when fog rolls down from the hills, shrouding the manor in a ghostly veil. This blend of remoteness and tradition casts a tense atmosphere over Woolverton Manor, where the weight of unspoken secrets and social expectation hangs as heavily as the autumn mists."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Typical early autumn with intermittent rain and fog affecting visibility",
    "timeFlow": "Three days of mounting tension culminating in the unraveling of secrets",
    "mood": "Tense undercurrents of class anxiety and economic uncertainty pervade the household",
    "eraMarkers": [
      "Domestic telephones with party-line exchanges",
      "Radio broadcasts common in sitting rooms",
      "Manual typewriters for correspondence and record-keeping",
      "Reliable petrol automobiles on country roads",
      "Passenger trains connecting nearest towns",
      "Telephone calls subject to operator assistance and occasional delays",
      "Telegrams sent via nearest town offices"
    ],
    "sensoryPalette": {
      "dominant": "Damp earth and aging wood",
      "secondary": [
        "Faint pipe tobacco and beeswax polish",
        "Rustling autumn leaves and distant hoofbeats"
      ]
    },
    "paragraphs": [
      "The manor’s atmosphere is thick with the scent of damp earth seeping through stone walls and the faint trace of beeswax polish lingering on dark wood panelling. Outside, the intermittent rain softens the landscape, while fog drifts silently through the ancient oaks and hedgerows, muffling sounds and obscuring sightlines. Within the house, the crackling fire and low murmur of radio broadcasts provide a fragile comfort against the chill and isolation. The tactile sensation of worn leather armchairs and heavy velvet curtains under fingertips contrasts with the cold draft that sneaks beneath doorways, a reminder of the estate’s vastness and the secrets it harbours.",
      "Social tensions weave through the manor’s spaces like the autumn mists outside, invisible yet palpable. The hum of servants’ footsteps on stone corridors, the rustle of silk gowns in the drawing room, and the occasional sharp ring of a telephone on a party line all punctuate the uneasy stillness. The faint clatter of typewriter keys in the library echoes the urgency of hidden correspondence, while the distant neighing of horses and the creak of stable doors anchor the house to its rural setting. This layered sensory tapestry shapes a mood of suspense and foreboding, where every shadow and whispered conversation might conceal a clue or a threat."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Woolverton Manor Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Tall oak bookcases lined with leather-bound volumes, a large polished desk with a green-shaded banker’s lamp, heavy velvet drapes drawn over mullioned windows, and a faded Persian rug covering worn flagstones.",
      "sensoryDetails": {
        "sights": [
          "flickering lamplight on polished wood",
          "dust motes in slanting window beams",
          "rows of leather-bound books",
          "crumpled papers on desk surface",
          "dark velvet curtains drawn tight",
          "glint of brass lamp fittings"
        ],
        "sounds": [
          "soft ticking of grandfather clock",
          "distant rain tapping windowpanes",
          "pages rustling in stillness",
          "quiet creak of settling floorboards",
          "low murmur of voices far below"
        ],
        "smells": [
          "aged leather and parchment",
          "faint pipe tobacco smoke",
          "musty wood polish",
          "cold stone and damp mortar"
        ],
        "tactile": [
          "smooth oak desk surface",
          "rough leather book spines",
          "velvet curtain folds",
          "cool brass lamp stand",
          "chilled flagstone floor"
        ]
      },
      "accessControl": "Library is locked after dinner; family members and select staff hold keys. Strictly off-limits to visitors except under supervision.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windowpanes",
            "grey light filtering curtains",
            "wet leaves pressed to glass"
          ],
          "sounds": [
            "steady rain drumming roof slates",
            "water trickling in gutters",
            "soft rustle of damp foliage"
          ],
          "smells": [
            "damp earth and stone",
            "mildew and old paper",
            "cold woodsmoke faintly"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light on bookshelves",
            "shadowless corners",
            "faint glimmer on brass fittings"
          ],
          "sounds": [
            "silence broken by clock ticking",
            "soft creak of settling timbers",
            "distant muted voices"
          ],
          "smells": [
            "beeswax polish",
            "dust and old leather",
            "woodsmoke from hearth"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on woodgrain",
            "glowing embers in fireplace"
          ],
          "sounds": [
            "tick of mantel clock",
            "whispered footsteps on floorboards",
            "distant voices from hall"
          ],
          "smells": [
            "candle wax and tobacco",
            "cold fireplace ash",
            "faint scent of lavender sachets"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library is a sanctuary of knowledge and secrecy, its tall oak shelves heavy with leather-bound tomes and brittle manuscripts. The polished desk, cluttered with papers and an old manual typewriter, serves as a silent witness to the manor’s hidden correspondences. Heavy velvet drapes shut out the fading daylight, casting the room into a pool of lamplight that flickers against the worn Persian rug and flagstone floor. The air holds the combined scents of aged leather, pipe tobacco, and faint wood polish, mingling with the subtle chill that seeps from the stone walls.",
        "Access to this room is tightly controlled, the heavy door locked after dinner each evening to preserve privacy and security. Only family members and trusted staff hold keys, ensuring that the library remains a place of quiet study and confidential dealings. The steady tick of the grandfather clock and the muffled sounds of rain or distant voices create a tense backdrop, where even the smallest noise seems amplified. This combination of sensory details and restricted access makes the library a focal point for discovery and concealment within Woolverton Manor."
      ]
    },
    {
      "id": "drawing_room",
      "name": "Woolverton Manor Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Spacious room with high ceilings, gilded mirrors reflecting crystal chandeliers, deep armchairs upholstered in faded floral fabric, and a large fireplace framed by carved oak mantelshelf.",
      "sensoryDetails": {
        "sights": [
          "glimmering crystal chandelier",
          "gold-framed ancestral portraits",
          "faded floral upholstery",
          "glowing fire embers",
          "glossy mahogany furniture"
        ],
        "sounds": [
          "crackling firewood",
          "soft rustle of silk gowns",
          "low hum of conversation",
          "distant radio broadcast",
          "clinking china cups"
        ],
        "smells": [
          "burning oak and pine",
          "freshly brewed tea",
          "worn velvet and dust",
          "faint scent of lavender",
          "polished wood and wax"
        ],
        "tactile": [
          "soft velvet armrests",
          "smooth porcelain teacups",
          "warm hearthstone edges",
          "cool polished wood surfaces",
          "heavy drapery folds"
        ]
      },
      "accessControl": "Open to family members and guests during daytime and early evening; staff prepare and clear under supervision; no access after lights out.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through rain-streaked windows",
            "glowing embers in fireplace",
            "damp garden views"
          ],
          "sounds": [
            "steady rain on roof",
            "soft fire crackle",
            "murmured domestic activity"
          ],
          "smells": [
            "damp wool and leather",
            "smoky firewood",
            "freshly brewed coffee"
          ],
          "mood": "contemplative quiet"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on gilded mirrors",
            "shadows pooling in corners",
            "flickering firelight"
          ],
          "sounds": [
            "low murmur of voices",
            "pages turning softly",
            "distant clock ticking"
          ],
          "smells": [
            "worn velvet",
            "tea and biscuits",
            "woodsmoke"
          ],
          "mood": "reserved calm"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "chandelier light sparkling",
            "long shadows on wallpaper",
            "firelight dancing on floor"
          ],
          "sounds": [
            "soft laughter",
            "quiet piano notes",
            "crackling hearth"
          ],
          "smells": [
            "candle wax",
            "tobacco smoke",
            "warm leather"
          ],
          "mood": "tense conviviality"
        }
      ],
      "paragraphs": [
        "The drawing room is the heart of social life within Woolverton Manor, where family and guests gather amid the soft glow of chandeliers and the welcoming warmth of a roaring fire. Gilded mirrors and ancestral portraits line the walls, reflecting the flickering light and lending the room an air of faded opulence. Deep armchairs upholstered in worn floral fabric invite repose, while the polished mahogany furniture gleams under careful maintenance. The scent of burning oak mingles with freshly brewed tea, creating a comforting atmosphere despite the undercurrent of tension.",
        "This space is carefully managed by the household staff, who prepare and clear the room according to the strict routines of the manor. Access is open during the day and early evening for family and visitors, but the room is secured after lights out to maintain privacy and order. The subtle interplay of sounds — from the crackle of firewood to the murmur of conversations and distant radio broadcasts — adds layers to the room’s ambiance, making it a vital setting for both convivial gatherings and whispered confidences."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants' Hall",
      "type": "interior",
      "purpose": "Staff gathering and work space",
      "visualDetails": "A modest, functional room with wooden tables and benches, stone floors, and simple cupboards lining the walls. A large cast-iron stove dominates one corner, and a small window looks out onto the service yard.",
      "sensoryDetails": {
        "sights": [
          "rough-hewn wooden tables",
          "stacked metal plates and cups",
          "flickering stove flames",
          "plain earthenware jugs",
          "worn stone floor slabs"
        ],
        "sounds": [
          "clatter of dishes",
          "murmured conversations",
          "footsteps on stone floor",
          "whispered orders",
          "creak of heavy wooden door"
        ],
        "smells": [
          "cooked meat and vegetables",
          "soapy water and starch",
          "smoke from stove fire",
          "damp woolen uniforms",
          "sour bread and ale"
        ],
        "tactile": [
          "rough wooden bench seats",
          "cool stone floor",
          "warm stove metal",
          "coarse linen cloths",
          "smooth ceramic crockery"
        ]
      },
      "accessControl": "Restricted to household staff only; entry controlled by housekeeper; no family or visitors permitted.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through small window",
            "steam rising from stove"
          ],
          "sounds": [
            "rain drumming on roof",
            "soft chatter among staff",
            "clinking of utensils"
          ],
          "smells": [
            "wet wool and earth",
            "smoke and cooking stew",
            "starch and soap"
          ],
          "mood": "busy industriousness"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on wooden surfaces",
            "shadowed corners",
            "dull gleam of crockery"
          ],
          "sounds": [
            "quiet conversation",
            "footsteps pacing floor",
            "rustling cloth"
          ],
          "smells": [
            "clean linen",
            "smoke and broth",
            "damp earth"
          ],
          "mood": "steady routine"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm stove glow",
            "shadows stretching long",
            "neatly stacked utensils"
          ],
          "sounds": [
            "soft laughter",
            "distant clock toll",
            "quiet settling sounds"
          ],
          "smells": [
            "cooked meat",
            "wood smoke",
            "freshly laundered cloth"
          ],
          "mood": "tired contentment"
        }
      ],
      "paragraphs": [
        "The servants’ hall is a hub of practical activity and quiet camaraderie, set apart from the family’s elegant rooms by heavy oak doors and stone walls. Its plain wooden tables and benches bear the marks of daily use, while the large cast-iron stove provides warmth and a place to prepare simple meals. The small window offers a view of the service yard, where horses are tended and deliveries arrive. The air is redolent of cooking stew, soap, and damp wool, underscoring the contrast between the staff’s working life and the manor’s refined spaces.",
        "Access is strictly limited to household staff, under the watchful eye of the housekeeper. Here, the rhythms of the day are dictated by routine and necessity, punctuated by the clatter of dishes and whispered instructions. The sensory environment changes with the light and weather — from the grey morning rain filtering through the window to the warm stove glow in the evening — but the sense of steady industry remains constant, anchoring the manor’s unseen backbone."
      ]
    },
    {
      "id": "manor_gardens",
      "name": "Woolverton Manor Gardens",
      "type": "exterior",
      "purpose": "Outdoor setting for leisure and secret meetings",
      "visualDetails": "Formal flowerbeds edged with clipped box hedges, winding gravel paths bordered by late-blooming roses and chrysanthemums, an ornamental stone fountain at the garden’s centre, and dense woodland enclosing the grounds.",
      "sensoryDetails": {
        "sights": [
          "glossy leaves on hedges",
          "grey stone fountain basin",
          "fallen amber leaves on paths",
          "shifting shadows among trees"
        ],
        "sounds": [
          "rustling autumn leaves",
          "distant birdcalls",
          "soft splash of fountain water",
          "footsteps on gravel paths",
          "whispering breeze through branches"
        ],
        "smells": [
          "wet earth and moss",
          "faint floral perfume",
          "damp wood and leaf litter",
          "fresh rain on stone",
          "smoke from distant chimneys"
        ],
        "tactile": [
          "rough bark of ancient trees",
          "smooth cold stone surfaces",
          "crunch of gravel underfoot",
          "soft petals and thorny stems",
          "cool damp air on skin"
        ]
      },
      "accessControl": "Open to family and guests during daylight hours; staff maintain grounds early morning and late evening; enclosed by wooden fencing and woodland.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on flower petals",
            "grey sky over trimmed hedges",
            "pools forming on gravel"
          ],
          "sounds": [
            "steady rain on leaves",
            "dripping water from branches",
            "soft splash in fountain"
          ],
          "smells": [
            "wet earth and moss",
            "fresh rain on stone",
            "damp foliage"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on stone fountain",
            "shadowless garden paths",
            "misted leaves"
          ],
          "sounds": [
            "rustling dry leaves",
            "distant birdcalls",
            "soft footfalls on gravel"
          ],
          "smells": [
            "earth and leaf litter",
            "faint floral notes",
            "smoke from chimneys"
          ],
          "mood": "quiet contemplation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "long shadows through trees",
            "soft glow on stone fountain",
            "twilight sky over hedges"
          ],
          "sounds": [
            "whispering breeze",
            "distant owl calls",
            "footsteps on gravel"
          ],
          "smells": [
            "cool air and moss",
            "night-blooming flowers",
            "smoke drifting from chimneys"
          ],
          "mood": "secretive anticipation"
        }
      ],
      "paragraphs": [
        "The gardens of Woolverton Manor offer a tranquil refuge from the house’s interior tensions, their formal layout softened by the encroaching wildness of autumn. Box hedges, meticulously clipped, frame flowerbeds where late roses and chrysanthemums cling to life beneath a sky often grey with rain or fog. A stone fountain, moss-flecked and quietly trickling, occupies the garden’s centre, providing a gentle counterpoint to the rustling leaves and distant birdcalls. Beyond the formal grounds, dense woodland rises, its shadowed paths both a natural boundary and a place for whispered meetings away from prying eyes.",
        "Access to the gardens is granted to family and guests during daylight hours, while staff maintain the grounds in the early morning and late evening. Enclosed by wooden fencing and the protective embrace of trees, the gardens are a liminal space where secrets can be exchanged under the cover of mist or twilight. The sensory interplay of damp earth, floral perfume, and the cool touch of stone surfaces enhances the mood of quiet contemplation or tense anticipation, depending on the hour and weather — making the gardens a vital setting within Woolverton Manor’s unfolding mystery."
      ]
    }
  ],
  "note": "",
  "cost": 0.00696306,
  "durationMs": 61663
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1931,
    "month": "December",
    "day": 12,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "December",
    "weather": [
      "Cold, damp air with frequent intermittent rain",
      "Heavy early morning fogs rolling over the countryside",
      "Occasional frosts at night, with muddy grounds around the estate"
    ],
    "daylight": "Short winter days with sunset around 4:15 pm, twilight fading quickly into long, dark evenings",
    "time_of_day_of_crime": "Late evening — between 9 and 11 pm, after the household has retired to the drawing room",
    "holidays": [
      "Christmas Day (December 25th)",
      "Boxing Day (December 26th)"
    ],
    "seasonalActivities": [
      "Preparing and decorating the manor with holly, ivy, and mistletoe",
      "Hosting formal Christmas dinners and carol singing evenings in the great hall",
      "Engaging in charity collections or local church events for the poor"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Three-piece wool suits in dark hues with waistcoats and starched detachable collars",
        "Double-breasted overcoats made of heavy tweed or camelhair",
        "Silk cravats or knitted ties and pocket watches with chain fobs"
      ],
      "casual": [
        "Knitted wool sweaters and plus-fours for country walks",
        "Corduroy trousers paired with woolen shirts",
        "Heavy leather brogues or ankle boots"
      ],
      "accessories": [
        "Felt homburg hats",
        "Wool scarves and leather gloves",
        "Leather briefcases or driving gloves for motoring"
      ]
    },
    "womensWear": {
      "formal": [
        "Evening gowns with bias-cut silk or velvet, often with fur stoles or collars",
        "Tailored wool coats with broad shoulders and fur trim",
        "Cloche hats decorated with feathers or ribbons"
      ],
      "casual": [
        "Knit cardigans and wool skirts for daytime wear",
        "Blouses with Peter Pan collars paired with mid-calf skirts",
        "Practical ankle boots or low-heeled shoes"
      ],
      "accessories": [
        "Elbow-length kid leather gloves",
        "Beaded handbags and pearl necklaces",
        "Fur muffs and knitted wool hats"
      ]
    },
    "trendsOfTheMoment": [
      "The continued popularity of the flapper silhouette with a slightly longer hemline",
      "Luxurious use of fur trims and accessories as a sign of wealth",
      "Growing influence of Hollywood glamour on evening wear"
    ],
    "socialExpectations": [
      "Men expected to maintain formal manners and dress for dinner and social occasions",
      "Women to embody modesty combined with subtle sophistication in their attire",
      "Strict dress codes for servants distinguishing them clearly from the gentry"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The global economic strain of the Great Depression deepens, with rising unemployment in Britain",
      "Political instability with Ramsay MacDonald’s National Government continuing austerity measures",
      "Unrest among coal miners and industrial workers amid wage disputes and strikes"
    ],
    "politicalClimate": "A tense and uncertain atmosphere marked by economic hardship, government austerity, and fears of social unrest",
    "economicConditions": "Widespread unemployment and poverty, especially in industrial areas, with country estates feeling the pinch on finances and staffing",
    "socialIssues": [
      "Class tensions heightened due to economic disparities",
      "Debates on social welfare reforms and unemployment relief",
      "Growing awareness of women's evolving social roles amid economic challenges"
    ],
    "internationalNews": [
      "Japan’s invasion of Manchuria in late 1931 causing international concern",
      "The ongoing effects of the global depression on European economies and trade"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby – 'Dream a Little Dream of Me'",
        "Duke Ellington – 'It Don’t Mean a Thing (If It Ain’t Got That Swing)'",
        "Al Bowlly – 'Love Is the Sweetest Thing'"
      ],
      "films": [
        "Dr. Jekyll and Mr. Hyde (1931)",
        "Frankenstein (1931)",
        "City Lights (1931) starring Charlie Chaplin"
      ],
      "theater": [
        "Noël Coward’s 'Cavalcade' continues its success",
        "Ivor Novello’s musical 'Glamorous Night'",
        "Agatha Christie’s play 'Alibi' popular in London theatres"
      ],
      "radio": [
        "BBC Home Service’s daily news and variety programs",
        "Children’s Hour featuring storytelling and music",
        "Dance Music broadcasts featuring popular dance bands"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s 'The Sittaford Mystery' (1931)",
        "Virginia Woolf’s 'The Waves' (1931)",
        "Dashiell Hammett’s 'The Glass Key' (1931)"
      ],
      "popularGenres": [
        "Detective and mystery fiction",
        "Modernist literature exploring psychological themes",
        "Romantic fiction and social comedies"
      ]
    },
    "technology": {
      "recentInventions": [
        "Improvements in radio receivers making broadcasts more accessible",
        "Development of safer automobiles with hydraulic brakes",
        "Advancements in household electric appliances like vacuum cleaners"
      ],
      "commonDevices": [
        "Domestic telephones with party-line systems",
        "Manual typewriters for office and personal use",
        "Battery-powered radios for family listening"
      ],
      "emergingTrends": [
        "Increased availability of motorcars in rural areas",
        "Growing popularity of recorded music on 78 rpm discs",
        "Use of fingerprinting becoming standard in police investigations"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 3 pence",
        "Pint of milk: 1 penny",
        "Daily newspaper: 1 penny"
      ],
      "commonActivities": [
        "Listening to evening radio programs by the fireplace",
        "Writing letters using fountain pens or typewriters",
        "Attending church services and local social gatherings"
      ],
      "socialRituals": [
        "Formal after-dinner tea and conversation in the drawing room",
        "Observing strict protocol for servants serving meals"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Firm adherence to class distinctions between gentry, tenant farmers, and servants",
      "Growing anxiety among upper classes about maintaining traditional social order"
    ],
    "gender": [
      "Expectations for women to uphold domestic roles despite emerging social freedoms",
      "Men viewed as primary breadwinners with emphasis on public stature",
      "Subtle shifts as some women engage more in employment or public life due to economic necessity"
    ],
    "race": [
      "Limited awareness of racial issues in rural England; imperial attitudes remain prevalent",
      "Minority communities largely marginalized and invisible in countryside settings"
    ],
    "generalNorms": [
      "Emphasis on discretion and propriety in speech and behavior",
      "Strict observance of social etiquette within households and communities",
      "Conservative values dominate social and family life"
    ]
  },
  "atmosphericDetails": [
    "The sharp scent of damp earth and burning coal smoke filling cold country air",
    "Heavy wool curtains drawn early against the creeping darkness and chill",
    "The faint ticking of grandfather clocks echoing through drafty manor corridors",
    "Occasional crackle from the hearth fire mixing with muffled footsteps on wooden floors",
    "Murmurs of conversation punctuated by the distant tolling of church bells in the fog"
  ],
  "paragraphs": [
    "December 1931 in rural England casts a cold, somber veil over the manor estate, where early evening fog rolls thickly across muddy grounds and the damp air clings to woolen coats and fur collars. The short daylight hours retreat behind a gray sky by mid-afternoon, plunging the great house into long, dark evenings lit by flickering gas lamps and roaring hearth fires. As Christmas approaches, the household busies itself with traditional preparations—holly and mistletoe adorn the heavy wood paneling, while carolers gather in the village, their voices faintly carrying on the chilled wind. Yet beneath the festive exterior, tensions simmer, sharpened by the economic pressures of the Great Depression and the rigid class divides that govern every interaction within the estate.",
    "The fashion of December 1931 reflects both austerity and elegance, with men favoring heavy tweeds and tailored three-piece suits paired with starched collars and silk cravats, their overcoats thick and practical against the winter chill. Women, meanwhile, balance the era’s hallmark flapper silhouettes with longer hemlines and luxurious furs, their evening gowns in rich silks and velvets contrasting with knitted daywear and tailored coats trimmed in fur. Accessories such as cloche hats, kid leather gloves, and pearl necklaces complete their ensembles, embodying a subtle yet unmistakable nod to Hollywood glamour despite the country’s economic hardships. Servants wear plainly cut uniforms in muted colors, their presence a constant reminder of the household’s strict social hierarchy.",
    "Daily life in the manor is governed by routine and social protocol, with formal dinners followed by after-dinner tea and quiet conversation beside the fire. Radio broadcasts offer a connection to the wider world, bringing news of political austerity measures, international tensions, and popular entertainment like Bing Crosby’s melodies or Agatha Christie’s latest mysteries. Outside the estate, widespread unemployment and industrial unrest cast a shadow over the countryside, stirring unease among landowners and tenants alike. Yet even amid these undercurrents, the rhythms of village church services, charity events, and seasonal festivities provide a semblance of normalcy and community cohesion.",
    "The manor’s atmosphere is dense with sensory details unique to this early winter night: the faint crackle of logs in the fireplace mingles with the ticking of ornate clocks, the muffled footfalls on polished floorboards, and the distant chimes of church bells through the damp fog. The scent of burning coal and woodsmoke blends with the crispness of cold air seeping through leaded windows, while the heavy curtains and tapestries absorb sound, creating a quiet tension in the air. In this intimate setting, the subtle interplay of light and shadow, warmth and chill, tradition and unease sets the perfect stage for a mystery to unfold—one where the past’s secrets might be whispered through the ticking of the clock as the year draws to a close.",
    "This December evening thus reflects a moment poised between old-world stability and modern uncertainty, where fashion, social mores, and cultural life cling to familiar forms even as economic hardship and political unrest erode the foundations beneath. Within the manor’s walls, the interplay of class, gender expectations, and the shadow of the wider world’s troubles create a charged atmosphere, ripe for intrigue and revelation. The ticking clock, the looming holiday, and the enveloping winter night combine to frame a mystery deeply anchored in the precise textures and tensions of December 1931."
  ],
  "note": "The temporal context is carefully crafted to reflect the realities of December 1931 rural England, matching the manor house setting and incorporating authentic fashion, social dynamics, and cultural references relevant to that specific moment in the early 1930s.",
  "cost": 0.003738675,
  "durationMs": 44016
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "In a socially stratified 1930s manor isolated by geography and economic hardship, the gentry and their staff navigate rigid routines and mutual suspicions intensified by class tensions and restricted access, uniting this cast under the shadow of a mechanical-clock murder.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Marked class distinctions separate the gentry, estate staff, and local tenants, with formalized interactions and strict schedules underpinning daily life amid Great Depression-driven economic anxieties."
  },
  "setting": {
    "location": "A large country house with extensive grounds including gardens, stables, and servants’ quarters, several miles from the nearest village surrounded by farmland.",
    "institution": "Manor house on country estate",
    "weather": "Typical early autumn with intermittent rain and fog affecting visibility"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "Classic Golden Age country-house mystery emphasizing mechanical ingenuity and fair-play deduction within a tense, class-conscious household under economic strain."
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
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock’s escapement drum was reversed and rewound manually, winding back the displayed time by forty minutes, exploiting the physical mechanism of the clock’s escapement.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[3]",
      "pointsTo": "Reader-visible mechanism detail appears before the discriminating test.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The death could not have occurred at the clock’s displayed time since servants were active well after that time, as footsteps were recorded at eleven thirty, contradicting the stopped clock reading of ten minutes past eleven.",
      "sourceInCML": "CASE.constraint_space.time.contradictions[0]",
      "pointsTo": "Explicitly overturns the false assumption that the clock’s displayed time indicates the time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because her alibi from ten to twelve is corroborated by staff logs and no physical evidence contradicts her presence elsewhere, narrowing suspicion toward Captain Ivor Hale.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Explicitly eliminates Dr. Mallory Finch with corroborated alibi and narrows the solution toward Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The mechanical clock in the study is stopped at ten minutes past eleven, but servants’ logs record footsteps well after that time, indicating the clock was not working at the time of death.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "The clock’s displayed time is inconsistent with actual activity times.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Unusual scratch marks are found on the back plate of the clock near the winding keyhole, and a key matching the winding mechanism is found in a drawer, suggesting tampering.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "Physical evidence of manual interference with the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The clock was likely manually wound backward after the murder using the hidden key, causing the displayed time to be inaccurate by forty minutes.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Supports the hypothesis of manual winding backward tampering.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "Captain Hale’s alibi places him inspecting stables between ten and eleven, but the actual time of death is after eleven thirty, outside his claimed alibi window.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale’s alibi does not cover the true time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Captain Hale’s alibi does not cover the true time of death, contradicting his claimed whereabouts and placing suspicion on him.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Contradicts Captain Ivor Hale’s alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The pendulum of the clock is stopped in an unusual position inconsistent with the displayed time, indicating the clock was tampered with after the murder.",
      "sourceInCML": "CASE.constraint_space.physical.traces[1]",
      "pointsTo": "Physical state of the clock inconsistent with displayed time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "The physical state of the clock’s escapement confirms manual reversal, supporting the hypothesis of tampering to mislead the time of death.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Physical evidence confirming manual winding backward.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "A controlled test is arranged in the study where the clock’s winding key is used to attempt to rewind the clock, confirming the mechanism can be reversed manually.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[0]",
      "pointsTo": "Evidence needed before the discriminating test can be understood.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "Captain Ivor Hale is uniquely linked to the clock’s escapement reversal by traces of his fingerprints on the winding key and clock mechanism.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "Points to Captain Ivor Hale as the only suspect with access and physical trace to the clock’s mechanism.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "behavioral",
      "description": "Captain Ivor Hale’s personal papers include notes expressing his intent to prevent the estate sale, showing motive and premeditation.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[1]",
      "pointsTo": "Observable evidence of Captain Ivor Hale's premeditation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because staff logs confirm her presence in the kitchen at the time of death, corroborated by multiple witnesses.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Explicitly eliminates Beatrice Quill with corroborated alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_12",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because her alibi is corroborated by staff logs and witness statements, while Captain Ivor Hale’s timeline and physical evidence contradict his alibi.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Eliminates Dr. Mallory Finch and narrows suspicion to Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_scratch_marks",
      "category": "temporal",
      "description": "A controlled test is arranged in the study where the clock’s winding key is used to attempt to rewind the clock, confirming the mechanism can be reversed manually.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[0]",
      "pointsTo": "Evidence needed before the discriminating test can be understood.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_winding_key",
      "category": "temporal",
      "description": "Unusual scratch marks are found on the back plate of the clock near the winding keyhole, and a key matching the winding mechanism is found in a drawer, suggesting tampering.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "Physical evidence of manual interference with the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_pendulum_position",
      "category": "temporal",
      "description": "The pendulum of the clock is stopped in an unusual position inconsistent with the displayed time, indicating the clock was tampered with after the murder.",
      "sourceInCML": "CASE.constraint_space.physical.traces[1]",
      "pointsTo": "Physical state of the clock inconsistent with displayed time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_servants_log",
      "category": "temporal",
      "description": "The clock was likely manually wound backward after the murder using the hidden key, causing the displayed time to be inaccurate by forty minutes.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Supports the hypothesis of manual winding backward tampering.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "temporal",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock face in study stopped at eleven ten in the morningremains a late texture detail in the case background.",
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
      "description": "The mechanical accurately’s mechanical time is consistent with the stopped pendulum position, suggesting the accurately stopped naturally at ten minutes past eleven.",
      "supportsAssumption": "The mechanical clock’s displayed time accurately indicates the time of death.",
      "misdirection": "This misleads by ignoring the scratch marks and stopped winding evidence, which show tampering."
    },
    {
      "id": "rh_2",
      "description": "The corroborated’s minutes time matches the eleven’ meal bell ringing at noon, implying the corroborated was accurate around the time of death.",
      "supportsAssumption": "The mechanical clock’s displayed time accurately indicates the time of death.",
      "misdirection": "This misleads by conflating unrelated events and ignoring the multiple evidence of servant winding."
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
      "clue_mechanism_visibility_core",
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_winding_key",
      "clue_servants_log"
    ],
    "mid": [
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_11",
      "clue_12",
      "clue_scratch_marks",
      "clue_pendulum_position",
      "clue_culprit_direct_captain_ivor_hale"
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
  "latencyMs": 38079,
  "cost": 0.004783845
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
