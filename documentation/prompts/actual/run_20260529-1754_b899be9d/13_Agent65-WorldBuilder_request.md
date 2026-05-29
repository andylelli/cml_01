# Actual Prompt Record

- Run ID: `run_b899be9d-52f0-4b6f-82e0-56738ec002b4`
- Project ID: `proj_4bc2b278-05d2-4e0f-9335-262d2eb30155`
- Timestamp: `2026-05-29T18:01:45.219Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `9f5cfd7d7904e9c2`

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
    "title": "The Backwound Clock Mystery on the Atlantic",
    "author": "CML Specialist",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1950s",
      "realism_constraints": [
        "Mechanical ship clocks standard",
        "Radio communication protocols established",
        "Ship ventilation systems scheduled",
        "Strict class segregation aboard liners",
        "Cold War social paranoia present"
      ]
    },
    "setting": {
      "location": "Atlantic Ocean",
      "place": "Southampton to New York route",
      "country": "International waters",
      "institution": "ocean liner"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "time-distorted cabin murder"
    }
  },
  "cast": [
    {
      "name": "Detective Inspector Clara Benson",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [
        "Professional acquaintance of Captain Finch",
        "Respectful observer of social classes aboard"
      ],
      "public_persona": "Sharp, methodical investigator",
      "private_secret": "Haunted by unsolved Cold War espionage case",
      "motive_seed": "Professional duty",
      "motive_strength": "moderate",
      "alibi_window": "Between quarter to eleven and quarter past eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Ship public spaces",
        "Authorized cabin visits",
        "Bridge during investigations"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Observes clock and timeline details carefully"
      ],
      "stakes": "Solve murder before arrival",
      "evidence_sensitivity": [
        "Clock mechanism details",
        "Crew testimony"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Edward Langley",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Husband to Marjorie Langley",
        "Known to victim for scandalous past"
      ],
      "public_persona": "Wealthy businessman",
      "private_secret": "Involved in Cold War financial scandal",
      "motive_seed": "Silencing victim over scandal",
      "motive_strength": "strong",
      "alibi_window": "Claimed to be in first-class lounge between ten and eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "First-class lounges",
        "Victim's cabin access via steward",
        "Public decks"
      ],
      "behavioral_tells": [
        "Nervous when questioned about timing",
        "Avoids clock-related questions"
      ],
      "stakes": "Preserve reputation and freedom",
      "evidence_sensitivity": [
        "Witness statements on movement",
        "Clock time discrepancies"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Marjorie Langley",
      "age_range": "45-55",
      "role_archetype": "Suspect",
      "relationships": [
        "Wife of Edward Langley",
        "Friend of Helen Carmichael"
      ],
      "public_persona": "Reserved socialite",
      "private_secret": "Aware of husband's scandal, fears public exposure",
      "motive_seed": "Protect husband's secret and social standing",
      "motive_strength": "moderate",
      "alibi_window": "Claimed to be at bridge lounge between ten and eleven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Bridge lounge",
        "Public promenades",
        "Victim's cabin indirect access"
      ],
      "behavioral_tells": [
        "Anxious when discussing husband's whereabouts",
        "Keeps close to Helen Carmichael"
      ],
      "stakes": "Maintain social position",
      "evidence_sensitivity": [
        "Witness accounts of bridge lounge presence",
        "Timing of interactions with Helen Carmichael"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Harold Finch",
      "age_range": "55-65",
      "role_archetype": "Suspect",
      "relationships": [
        "Ship's captain",
        "Has wartime secret known to victim"
      ],
      "public_persona": "Authoritative and disciplined",
      "private_secret": "Wartime incident concealed from crew",
      "motive_seed": "Prevent victim from revealing secret",
      "motive_strength": "strong",
      "alibi_window": "On bridge between ten and eleven fifteen",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Bridge",
        "Restricted access areas",
        "Crew quarters"
      ],
      "behavioral_tells": [
        "Firm control over ship's clock maintenance",
        "Tense during questioning about clock"
      ],
      "stakes": "Protect personal and professional legacy",
      "evidence_sensitivity": [
        "Captain's log entries",
        "Clock maintenance records",
        "Crew testimony about clock chimes"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Helen Carmichael",
      "age_range": "35-45",
      "role_archetype": "Victim",
      "relationships": [
        "Friend of Marjorie Langley",
        "Confidant of Edward Langley’s scandal and Captain Finch’s secret"
      ],
      "public_persona": "Charming socialite",
      "private_secret": "Held critical knowledge linking suspects",
      "motive_seed": "Victim",
      "motive_strength": "N/A",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Captain Harold Finch"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "A murder aboard a transatlantic ocean liner unsettles the rigid social order and Cold War tensions. A victim with dangerous knowledge is found dead in her cabin. The ship’s clock has been tampered with, misleading witnesses and investigators about the timeline. Detective Inspector Clara Benson must unravel the time distortions and social facades to reveal the culprit before the ship reaches New York."
    },
    "accepted_facts": [
      "Victim Helen Carmichael was found dead in her starboard cabin.",
      "Ship’s bulkhead clock stopped at ten minutes past eleven.",
      "Witnesses heard clock chimes at conflicting times.",
      "Captain Finch controls clock maintenance and logs.",
      "Edward Langley has a scandal known to the victim.",
      "Captain Finch has a wartime secret known to the victim.",
      "Victim’s last known activity was near the ship’s starboard promenade.",
      "Bridge hatch locking mechanism has a timed delay."
    ],
    "inferred_conclusions": [
      "The ship’s clock was deliberately wound back by approximately forty minutes.",
      "The murder occurred later than the stopped clock time indicates.",
      "Captain Finch manipulated the clock and used the timing confusion to create a false alibi.",
      "Edward Langley’s scandal and Marjorie Langley’s anxiety are motives but their alibis and access reduce culpability.",
      "The social hierarchy and class-restricted zones influenced witness perceptions and access.",
      "The victim was poisoned by a slow coal gas leak timed with ventilation cycles.",
      "The culprit exploited the ship’s mechanical and social systems to hide the murder timing."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "Captain Harold Finch reversed the ship’s bulkhead clock gear train, winding it back by forty minutes to create misleading temporal evidence. This caused witnesses to believe the murder occurred earlier than it did. Simultaneously, Finch exploited ventilation shutdowns to allow a slow coal gas leak in the victim’s starboard cabin, causing delayed poisoning. The locked bridge hatch’s timing mechanism and social class-based access further concealed his movements and delayed discovery.",
      "delivery_path": [
        {
          "step": "Captain Finch manually reversed the ship’s clock gear train during a scheduled maintenance window."
        },
        {
          "step": "He coordinated ventilation shutdowns to increase coal gas concentration in the victim’s cabin."
        },
        {
          "step": "He used the timed locking bridge hatch to simulate locked-room conditions."
        },
        {
          "step": "Witnesses misread event timing due to clock reversal and confusing chimes."
        },
        {
          "step": "Detective Benson uncovers clock tampering, ventilation logs, and social access contradictions."
        }
      ]
    },
    "outcome": {
      "result": "Captain Harold Finch is exposed as the sole murderer, having created a false timeline and exploited shipboard mechanical and social systems to mask his crime."
    }
  },
  "false_assumption": {
    "statement": "The ship’s bulkhead clock shows the true time of death and the timeline of events can be trusted based on it.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock is a visible, authoritative timekeeper on the ship, and witnesses confirm its chimes, lending credibility to its stopped time indicating the murder moment.",
    "what_it_hides": "That the clock was deliberately wound backward, falsifying the timeline and causing all timing-based alibis and witness statements to be misaligned."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Ship’s bulkhead clock stopped at ten minutes past eleven",
        "Captain’s log entries timestamped between ten and eleven fifteen",
        "Ventilation shutdown schedules logged hourly",
        "Victim last seen alive near starboard promenade at approximately eleven forty"
      ],
      "windows": [
        "Maintenance window for clock winding reversal between ten to ten thirty",
        "Victim’s poisoning window between eleven and midnight",
        "Crew shift change at eleven fifteen"
      ],
      "contradictions": [
        "Clock shows time forty minutes earlier than actual ship time",
        "Witnesses heard clock chimes at times inconsistent with clock face",
        "Captain’s log notes irregular clock operation yet reports on schedule",
        "Ventilation shutdown timings contradict victim’s sudden death appearance"
      ]
    },
    "access": {
      "actors": [
        "Captain Harold Finch",
        "Edward Langley",
        "Marjorie Langley",
        "Detective Clara Benson",
        "Crew members"
      ],
      "objects": [
        "Ship’s bulkhead clock",
        "Victim’s cabin",
        "Bridge locked hatch",
        "Ventilation control panel"
      ],
      "permissions": [
        "Captain controls clock maintenance and bridge access",
        "First-class passengers access limited to lounges and promenade",
        "Crew members restricted to designated quarters",
        "Detective allowed investigation access ship-wide"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks cannot run backward without manual intervention",
        "Coal gas accumulates during ventilation shutdown",
        "Locked bridge hatch uses mechanical counterweight with time delay"
      ],
      "traces": [
        "Scratch marks on clock winding keyhole",
        "Oil stains inconsistent with normal maintenance on clock",
        "Residual coal gas smell near victim’s cabin vent",
        "Wear marks on bridge hatch locking mechanism"
      ]
    },
    "social": {
      "trust_channels": [
        "Crew testimony on clock chimes and ventilation",
        "Passenger statements regarding victim’s last sightings",
        "Captain’s log as authoritative record",
        "Class-based assumptions about access and presence"
      ],
      "authority_sources": [
        "Captain’s control over ship’s systems",
        "Crew hierarchy and access permissions",
        "Detective’s investigative authority"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "A ship’s clock winding key is found with a faint scratch around the hole, unusual oil stains, and the clock stopped at ten minutes past eleven.",
        "correction": "The scratch and oil stains indicate manual forced reverse winding, causing the clock to show an artificially earlier time than actual.",
        "effect": "Narrows timing window; eliminates any alibis strictly relying on the stopped clock time.",
        "required_evidence": [
          "Scratch marks on clock winding keyhole",
          "Oil stains inconsistent with normal maintenance on ship’s bulkhead clock",
          "Ship’s bulkhead clock stopped at ten minutes past eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "Crew members testify hearing clock chimes at times conflicting with the stopped clock face, and the Captain’s log notes irregular clock operation but reports times consistent with normal schedule.",
        "correction": "The clock chimes and log discrepancies prove the clock time was falsified, and actual ship time was later than indicated by the clock face.",
        "effect": "Eliminates suspects whose alibis depend on the false clock time; tightens the actual murder time to after eleven twenty.",
        "required_evidence": [
          "Crew testimony about hearing clock chimes at conflicting hours",
          "Captain’s log entry noting irregular clock operation",
          "Ship’s bulkhead clock stopped at ten minutes past eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "Ventilation shutdown logs show repeated hourly shutdowns increasing coal gas concentration near the victim’s starboard cabin, and residual gas smell is detected near the cabin vent.",
        "correction": "The victim was poisoned gradually by coal gas, with poisoning symptoms appearing delayed and inconsistent with sudden death at the stopped clock time.",
        "effect": "Narrows time of death to after ventilation shutdowns began; eliminates suspects with alibis prior to that window.",
        "required_evidence": [
          "Crewman’s log showing ventilation shutdown schedules",
          "Residual coal gas smell detected near victim’s cabin vent",
          "Victim’s last meal timing inconsistent with sudden death"
        ],
        "reader_observable": true
      },
      {
        "observation": "Wear marks on the bridge hatch locking mechanism and a ship engineer’s report describe a mechanical counterweight with a timed locking delay allowing the hatch to lock automatically after a delay.",
        "correction": "This mechanism allowed the culprit to exit the bridge after committing the murder and lock the hatch, creating a false locked-room scenario.",
        "effect": "Eliminates suspects who could not access or exit the bridge within the time delay; implicates Captain Finch who controlled bridge access.",
        "required_evidence": [
          "Wear marks on bridge hatch locking mechanism",
          "Ship engineer’s report on hatch counterweight maintenance",
          "Captain’s log entries showing presence on bridge"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled clock comparison test is staged where the ship’s bulkhead clock winding mechanism is analyzed alongside the Captain’s personal chronometer and crew chime testimonies, demonstrating the forty-minute backward winding and disproving all alibis reliant on the stopped clock time. This test exposes the Captain’s manipulation of the clock and the resulting false timeline.",
    "knowledge_revealed": "The test reveals the mechanical impossibility of the clock’s stopped time being accurate and confirms the Captain’s tampering, invalidating his alibi and confirming his guilt.",
    "pass_condition": "The Captain fails to explain the mechanical evidence of forced reverse winding and inconsistent clock chimes, thereby confirming his guilt.",
    "evidence_clues": [
      "clue_11",
      "clue_mechanism_visibility_core",
      "clue_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The scratched winding keyhole and oil stains (early clues) reveal clock tampering. Step 2: Crew chimes testimony and Captain’s log discrepancies (mid clues) prove the clock’s time falsehood. Step 3: Ventilation shutdown logs and residual gas smell (mid clues) reveal delayed poisoning, narrowing death timing. Step 4: Bridge hatch wear and engineer’s report (late clues) show mechanical delay allowing culprit escape. The discriminating test uses the clock tampering evidence from steps 1 and 2 to definitively expose the Captain’s guilt."
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
        "Execute the controlled clock comparison test",
        "Demonstrate the forty-minute backward winding and invalid alibis",
        "Conclude Captain Finch’s guilt from mechanical evidence"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Edward Langley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by multiple first-class passenger witnesses and timing inconsistent with actual murder window",
        "supporting_clues": [
          "Witness statements on Edward Langley’s presence in first-class lounge",
          "Ventilation shutdown logs"
        ]
      },
      {
        "suspect_name": "Marjorie Langley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Bridge lounge alibi corroborated by crew and timing contradicting murder window",
        "supporting_clues": [
          "Witness accounts of Marjorie Langley’s bridge lounge presence",
          "Captain’s log entries"
        ]
      },
      {
        "suspect_name": "Detective Inspector Clara Benson",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Continuous investigation presence and no opportunity or motive",
        "supporting_clues": [
          "Detective’s access logs",
          "Witness statements"
        ]
      },
      {
        "suspect_name": "Helen Carmichael",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation using clock tampering evidence and ventilation poisoning timeline"
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
        "clue_id": "clue_12",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_13",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_14",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "clue_id": "clue_culprit_direct_captain_harold_finch",
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
    "name": "Detective Inspector Clara Benson",
    "summary": "A meticulous Scotland Yard inspector tasked with unraveling a complex murder aboard an ocean liner, balancing her professional prowess against internal doubts and external pressures.",
    "publicPersona": "Detective Inspector Clara Benson carries herself with the calm assurance of a seasoned investigator. Her reputation for methodical precision and a sharp intellect precedes her, earning respect in a male-dominated police force. She is known to approach every case with a measured, almost scholarly diligence, rarely letting emotion cloud her judgment.",
    "privateSecret": "Beneath this composed exterior lies a simmering uncertainty about her chosen career path, exacerbated by the weight of postwar gender expectations. She fears that the political machinations within the police department may jeopardize her hard-earned standing, and that this case could either solidify or shatter her legacy.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "easy",
    "stakes": "This investigation is a pivotal moment in her career, one that could either crown her as a distinguished detective or force her into professional obscurity.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Clara speaks with precise enunciation and a deliberate pace, favoring concise, almost clinical phrasing. Her dry wit surfaces as subtle, often sardonic remarks that reveal her keen observation but rarely offend. She employs understatement as a tool to deflect personal vulnerability, often punctuating tense moments with a quietly ironic quip.",
    "internalConflict": "Clara wrestles with the fear that her career, built against considerable odds, might unravel due to forces beyond her control—namely, institutional sexism and political interference. This tension colors her interactions and fuels a relentless drive to prove her worth.",
    "personalStakeInCase": "Unlike other investigations, this case strikes close to home; success would affirm her place in a profession still skeptical of women, while failure could mean the premature end of her tenure and the dashed hopes of breaking glass ceilings.",
    "paragraphs": [
      "Detective Inspector Clara Benson boards the Atlantic liner with a practiced eye, noting every detail from the polished decks to the nervous glances exchanged among the passengers. Her reputation as a meticulous solver of complex puzzles precedes her, yet she remains quietly aware of the precarious position she occupies within Scotland Yard’s hierarchy. The postwar era has not been kind to women in her profession, and Clara feels the weight of every judgmental glance and whispered doubt.",
      "As the investigation unfolds, Clara’s calm exterior is tested by the undercurrents of political intrigue swirling around the case. She recognizes that her methods and decisions are under scrutiny not only from her peers but from the very men whose approval she must secure. Her dry wit becomes a shield, a way to navigate conversations laced with subtle condescension and veiled threats, allowing her to maintain composure while probing for the truth.",
      "Her interactions with suspects are marked by a keen observational skill, reading beneath the surface of polite denials and rehearsed alibis. Clara’s questions are precise, her tone measured, but there is an edge of quiet impatience when faced with obfuscation. She is not merely unraveling a murder; she is fighting to affirm her own professional legitimacy in a milieu that often doubts her capabilities.",
      "Throughout, Clara struggles with moments of self-doubt, wondering if the sacrifices demanded by her career have been worth the personal cost. Yet, the case offers her a chance at vindication—a chance to cement her legacy as a detective who can outwit even the most guarded secrets. The Atlantic voyage becomes a crucible, testing not only her detective skills but her resilience against the subtle forces that seek to undermine her.",
      "In the end, Clara’s determination is as much about justice for the victim as it is about proving to herself and others that a woman can command authority and respect in the shadowed corridors of crime and power. Her dry wit and precise speech mask a profound internal struggle, making her pursuit of truth a deeply personal endeavor as much as a professional one."
    ],
    "order": 1
  },
  {
    "name": "Edward Langley",
    "summary": "A dignified retired shipping magnate whose past sins cast a long shadow, facing the threat of exposure that could unravel his family’s fortune and social standing.",
    "publicPersona": "Edward Langley presents himself as the epitome of aristocratic dignity, his bearing unshaken by the passage of time. Once a titan of the shipping industry, he commands respect through his authoritative presence and cultivated manners. His voice carries the gravitas of decades spent navigating both business and high society.",
    "privateSecret": "Beneath this venerable facade lies a dark secret: the cover-up of a fatal accident aboard one of his vessels many years prior. The victim’s family has recently reemerged, threatening to bring the scandal into the public eye. This looming revelation threatens to shatter the carefully constructed legacy and fortune he has spent a lifetime building.",
    "motiveSeed": "The possibility of losing his family fortune and the respect of his peers provides a compelling motive to silence anyone who might expose the truth. The victim, now dead, had been blackmailing Edward in a desperate bid for restitution, making Edward’s potential involvement in the murder all the more plausible.",
    "motiveStrength": "compelling",
    "alibiWindow": "Was in his private suite resting from seasickness between 8:00 PM and 9:30 PM",
    "accessPlausibility": "possible",
    "stakes": "Preserving the family fortune and his social standing is paramount; exposure would not only ruin him financially but also irreparably damage the Langley name.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Edward speaks with measured, deliberate tones, favoring traditional phrasing and formal constructions. His humor is subtle, often employing understatement to downplay uncomfortable truths or deflect probing questions. He occasionally allows a dry, ironic comment to surface, revealing his awareness of the precariousness of his situation.",
    "internalConflict": "Edward is tormented by the consequences of his past actions, caught between the desire to maintain his reputation and the guilt of having concealed a tragedy. This internal struggle manifests as a guarded demeanor and moments of brittle defensiveness.",
    "personalStakeInCase": "This case threatens not only his wealth but the very legacy he intends to leave behind. The unraveling of his past sins could mean the end of the Langley dynasty as he knows it, making the stakes intensely personal.",
    "paragraphs": [
      "Edward Langley inhabits his private suite with the air of a man accustomed to command, yet the seasickness that has confined him there is a tangible reminder of his mortal vulnerabilities. His mind, however, remains sharp and alert, constantly calculating the risks posed by the resurfacing scandal that could undo decades of careful reputation management.",
      "Throughout the voyage, Edward maintains a composed exterior, but those close enough to observe detect a flicker of unease beneath his stately demeanor. The threat of exposure weighs heavily, and he is acutely aware that any misstep could be fatal to his social standing. His interactions are marked by a courteous but firm insistence on propriety, masking a simmering anxiety.",
      "His subtle use of understatement serves as a defense mechanism, minimizing the gravity of the situation when questioned. Yet, his eyes betray the turmoil of a man who has long borne the burden of a secret that could destroy everything he holds dear. The delicate balance between denial and admission is a tightrope he walks with practiced skill.",
      "Edward’s motives for silencing the victim are grounded in the preservation of legacy, a theme that resonates deeply with him. The prospect of losing his family fortune and the respect of his peers is not merely a financial concern but a blow to his identity and life’s work. This internal conflict adds layers of complexity to his character, making him more than a mere antagonist.",
      "As the investigation progresses, Edward must confront the possibility that his carefully constructed world is crumbling. The collision between past misdeeds and present consequences forces him to examine the cost of his silence and the sacrifices made to protect his name. His journey is one of reckoning, shadowed by regret and the fear of disgrace."
    ],
    "order": 2
  },
  {
    "name": "Marjorie Langley",
    "summary": "A rebellious modernist artist caught between her avant-garde aspirations and the weight of family expectations, harboring secret resentments and hidden financial backers.",
    "publicPersona": "Marjorie Langley is known for her outspoken nature and avant-garde artistry, a stark contrast to her father’s traditionalist worldview. She carries herself with a confident defiance, challenging societal norms both in her art and personal demeanor. Her reputation as a modernist has earned her both admirers and detractors.",
    "privateSecret": "Unbeknownst to most, Marjorie is secretly financed by a mysterious patron intent on undermining her family’s conservative influence in the arts world. This leverage weighs heavily on her conscience, especially as her personal ambitions conflict with familial loyalty.",
    "motiveSeed": "Her simmering resentment toward her father’s attempts to control her career and personal life is further inflamed by the discovery that he plans to disinherit her in favor of a distant relative. This betrayal fuels a moderate motive to act against him.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was at the third-class smoking lounge sketching alone from 7:45 PM to 9:00 PM",
    "accessPlausibility": "unlikely",
    "stakes": "Marjorie’s artistic freedom and financial independence hang in the balance, intertwined with her need to assert autonomy against a patriarchal legacy.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "She speaks with sharp, quick cadence, often punctuating her sentences with biting sarcasm. Marjorie’s dialogue brims with sardonic wit, frequently challenging others with pointed observations and irreverent quips that expose hypocrisies. Her tone is informal but incisive, reflecting her rebellious spirit.",
    "internalConflict": "Marjorie grapples with guilt over the leverage her secret patronage gives her, torn between using it to advance her cause and the ethical compromises it entails. She struggles to reconcile her desire for self-expression with the bonds of family loyalty and the secrets that threaten to divide them.",
    "personalStakeInCase": "Beyond professional ambition, this case is deeply personal; it threatens to expose fractures within her family and force her to confront painful truths about her father and herself. The outcome could redefine her identity and place within the Langley legacy.",
    "paragraphs": [
      "Marjorie Langley’s presence on the liner is as striking as her canvases—bold, unorthodox, and unapologetically defiant. She moves through the ship with a restless energy, her eyes constantly scanning, her mind always turning ideas over. Her art challenges the old guard, and so does she, embodying the tensions between tradition and modernity.",
      "Her time spent sketching alone in the third-class smoking lounge is a deliberate act of rebellion, distancing herself from the gilded confines of first-class society and her father’s shadow. It is here that her sardonic humor surfaces, a weapon to deflect probing questions and mask deeper insecurities. She wields wit like a brushstroke—precise, sharp, and evocative.",
      "The revelation of her secret patronage complicates her position, injecting a layer of ethical ambiguity into her ambitions. Marjorie is acutely aware that her financial independence is not solely her own achievement but a strategic move in a larger game of influence. This knowledge weighs on her conscience, fueling moments of self-reproach amidst her outward bravado.",
      "Her resentment toward her father is palpable, especially given his plans to disinherit her. This betrayal is a wound she nurses privately, coloring her interactions and hardening her resolve. Yet, beneath the sardonic exterior lies a young woman wrestling with the conflicting demands of loyalty, ambition, and the desire for authentic self-expression.",
      "As the mystery deepens, Marjorie is forced to confront the fractures within her family and the secrets that bind them. The case becomes a crucible for her evolving identity, challenging her to navigate the treacherous waters between rebellion and reconciliation. Her wit and rebellious spirit may be her greatest assets—or her undoing."
    ],
    "order": 3
  },
  {
    "name": "Captain Harold Finch",
    "summary": "A steadfast ship captain whose disciplined exterior conceals a wartime past threatened by exposure, struggling to balance duty with personal survival.",
    "publicPersona": "Captain Harold Finch commands respect through his steady demeanor and strict adherence to discipline. He is the embodiment of authority aboard the Atlantic liner, maintaining order with an unyielding sense of responsibility. His reputation as a reliable and honorable officer is well established among crew and passengers alike.",
    "privateSecret": "Behind this veneer lies a secret wartime operation, one that the victim threatened to reveal. Exposure would not only tarnish his postwar honors but also jeopardize his pension and standing. This secret casts a long shadow over his otherwise impeccable record.",
    "motiveSeed": "The fear of losing everything he has built compels him to consider silencing the victim permanently, a strong motive rooted in self-preservation and the defense of his legacy.",
    "motiveStrength": "strong",
    "alibiWindow": "Reportedly on the bridge overseeing ship operations continuously from 8:30 PM to 9:30 PM",
    "accessPlausibility": "easy",
    "stakes": "His reputation and lifelong honor are at stake, making the outcome of the investigation a matter of personal survival as much as justice.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Finch’s speech is measured and formal, tinged with a modest self-deprecation that surfaces in moments of candor. He often uses nautical metaphors and downplays his own role with wry asides, reflecting a man who carries the burden of command with humility and occasional dry humor.",
    "internalConflict": "Harold is caught between his sense of duty and the instinct for self-preservation, wrestling with ethical compromises that haunt him. The threat of exposure forces him to question the very principles he has lived by.",
    "personalStakeInCase": "This case is a crucible testing not only his professional honor but the survival of the identity he has cultivated since the war. The potential loss of pension and accolades would leave him adrift, a man stripped of purpose and respect.",
    "paragraphs": [
      "Captain Harold Finch presides over the Atlantic liner with the calm authority of a man who has weathered storms both literal and figurative. His disciplined approach to shipboard life commands respect, and his presence on the bridge is a reassuring constant for crew and passengers alike. Yet beneath this steady surface lies an anxiety born of secrets best left buried.",
      "The wartime operation that haunts him is a specter he has long kept hidden, a chapter of his life that clashes with the honorable image he projects. The victim’s threat to expose this past is a direct challenge to his carefully maintained reputation, stirring fears that ripple beneath his composed exterior.",
      "His alibi places him on the bridge during the critical hour, but the ease with which he might have left unnoticed is a detail not lost on the detective. Harold’s self-deprecating humor occasionally surfaces as he jokes about the unpredictability of life at sea, yet these moments thinly veil the tension that underpins his every decision.",
      "The captain’s internal struggle is profound—duty to his ship and crew versus the instinct to protect himself at all costs. This moral conflict colors his interactions and influences the subtle shifts in his demeanor, revealing a man grappling with the consequences of past choices.",
      "As the investigation unfolds, Harold must navigate the treacherous waters between upholding justice and safeguarding his own legacy. His story is one of honor tested by circumstance, a man forced to reconcile the demands of command with the shadows of his history."
    ],
    "order": 4
  },
  {
    "name": "Helen Carmichael",
    "summary": "A charming young socialite whose elegant facade conceals a scandalous affair threatening her social standing, caught in the crossfire of secrets and suspicions.",
    "publicPersona": "Helen Carmichael epitomizes grace and charm, a rising figure in high society known for her wit and penchant for gossip. Her presence lights up the first-class ballroom, where she moves with effortless poise and an engaging smile that masks deeper anxieties.",
    "privateSecret": "Beneath the polished veneer, Helen is secretly involved in an affair with a crew member, a liaison that could shatter her family’s expectations and social reputation if revealed.",
    "motiveSeed": "A minor quarrel with the victim over the threat of disclosure of her affair provides a weak motive rooted in fear of personal ruin rather than financial gain.",
    "motiveStrength": "weak",
    "alibiWindow": "Attending a formal dance in the first-class ballroom from 8:00 PM until 9:15 PM",
    "accessPlausibility": "unlikely",
    "stakes": "Preserving her social reputation and family approval is paramount, making the stakes intensely personal in a world governed by appearances and expectations.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Helen’s speech is polished and genteel, laced with subtle barbs and clever retorts delivered with a smile that disarms. Her humor often takes the form of polite savagery, a refined wit that cuts just deep enough to unsettle without offending outright, revealing a mind both sharp and guarded.",
    "internalConflict": "Helen struggles with the tension between her desires and the rigid social codes she must uphold. The fear of scandal and ostracism creates a constant undercurrent of anxiety that tempers her outward charm.",
    "personalStakeInCase": "The case threatens to expose her secret affair, risking not only her social standing but the approval and affection of her family, making the outcome deeply personal.",
    "paragraphs": [
      "Helen Carmichael glides through the first-class ballroom with the practiced ease of one born into privilege. Her laughter is light, her conversation sparkling, yet beneath the surface lies a careful calculation to maintain the image expected of her. The threat of exposure casts a shadow over her otherwise radiant demeanor.",
      "Her relationship with the crew member is a carefully guarded secret, one that could unravel the delicate fabric of her social world. The victim’s knowledge and the quarrel they shared inject a strain of fear and urgency into her interactions, prompting a defensive alertness beneath her poised exterior.",
      "Helen’s use of polite savagery in conversation serves as both armor and weapon, allowing her to deflect probing questions with a smile and a cutting remark. Her wit is a social dance as intricate as any waltz, designed to keep others at bay while asserting control over the narrative.",
      "The internal conflict she faces is palpable: the desire to live authentically clashes with the suffocating demands of class and family expectations. This tension shapes her behavior, making moments of vulnerability rare and carefully concealed.",
      "As the investigation progresses, Helen’s personal stakes become increasingly apparent. The potential unraveling of her secret threatens to upend not just her reputation but her very place within the social order. Her story is one of survival within a gilded cage, where appearances are everything and secrets are the currency of power."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "SS Britannia",
    "type": "ocean liner",
    "place": "Southampton to New York Atlantic crossing",
    "country": "United Kingdom",
    "summary": "A grand 1950s ocean liner ferrying passengers across the North Atlantic, marked by strict class divisions and the isolation of the open sea.",
    "visualDescription": "The SS Britannia looms large with its gleaming white hull trimmed in deep navy, three tall funnels billowing smoke, and rows of portholes glinting against the grey Atlantic backdrop. The upper decks boast polished teak promenades with brass railings, while the interiors feature rich mahogany paneling, brass fixtures, and period Art Deco furnishings. Narrow corridors snake between staterooms segregated by class, and the bridge rises above with its banks of dials and radio equipment.",
    "atmosphere": "A floating microcosm of 1950s society, the liner hums with restrained conversations, the clink of fine china in dining saloons, and the distant drone of engines beneath the steel decks. Outside, the restless sea and intermittent fog shroud the ship in a veil of uncertainty, while strict access controls and class-based segregation enforce a rigid social order amid the tense undercurrents of Cold War unease.",
    "paragraphs": [
      "The SS Britannia cuts a stately figure against the churning North Atlantic, her decks slick with sea spray and the sky heavy with overcast clouds. Passengers wrapped in tailored coats and fur collars stroll the promenade deck, their breath misting in the cool air. Below, the polished wood-paneled interiors echo with muted footsteps and the soft murmur of genteel conversation, punctuated by the occasional clatter of silverware in the grand dining saloon.",
      "Movement aboard is dictated by strict schedules and class boundaries; first-class passengers luxuriate in spacious cabins and exclusive lounges, while the steerage classes cluster in more modest quarters below decks. The labyrinthine corridors and narrow stairwells create natural bottlenecks, with crew members stationed to enforce access restrictions to the bridge, engine rooms, and supply areas. The hum of the ship’s massive engines vibrates through the steel hull, a constant reminder of the vessel’s power and isolation.",
      "Technological marvels of the era are on display: a room-sized computer housed near the communication center processes navigational data, while transistor radios buzz quietly in officers’ pockets. In the public lounges, black-and-white television sets flicker with newsreels, offering a distant glimpse of a world beyond the ocean’s vast expanse. Yet, despite these modern touches, the liner remains a place where social hierarchies and Cold War tensions simmer beneath a veneer of postwar civility.",
      "As the ship sails deeper into the Atlantic, fog banks roll in thick and sudden, muting the horizon and tightening the sense of confinement among passengers and crew alike. The relentless sea and unpredictable weather conspire to slow the passage of time, heightening anxieties and sharpening the focus on the mysterious events unfolding within the ship’s steel confines."
    ]
  },
  "atmosphere": {
    "era": "1950s",
    "weather": "Cool, overcast North Atlantic conditions with intermittent fog and choppy seas influencing visibility and movement.",
    "timeFlow": "A tense week-long crossing marked by gradual escalation of suspicion and constrained interactions.",
    "mood": "Tense undercurrent of unease reflecting Cold War anxieties, with social formalities masking underlying personal conflicts among passengers.",
    "eraMarkers": [
      "room-sized early computers in ship’s navigation center",
      "transistor radios common among passengers and crew",
      "black-and-white television sets in public lounges",
      "strict class-based accommodations and access restrictions",
      "radio telegraphy for ship-to-shore communication"
    ],
    "sensoryPalette": {
      "dominant": "salt-laden sea air mingled with engine oil and polished wood",
      "secondary": [
        "distant foghorns and creaking steel",
        "clinking fine china and muted voices"
      ]
    },
    "paragraphs": [
      "The atmosphere aboard the SS Britannia is thick with the mingled scents of salt air, engine oil, and polished mahogany. The steady drone of the ship’s engines vibrates through the steel decks, punctuated by the occasional blare of foghorns and the creak of metal under strain. Passengers wrapped against the chill breeze exchange guarded glances, their voices low and measured, as the ever-present fog weaves a spectral shroud around the vessel.",
      "Inside, the ship’s Art Deco interiors offer a stark contrast to the harshness outside: the warm glow of brass lamps, the muted clatter of fine china, and the soft rustle of evening gowns create an air of genteel civility. Yet beneath this polished surface, a palpable tension lingers, fed by the rigid social divisions and the shadow of global political unease. Time seems to stretch and contract with the passing fog banks, each moment heavy with unspoken suspicion."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Promenade Deck at Night",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A narrow, wind-swept teak deck bordered by brass railings, dimly lit by scattered deck lamps casting pools of yellow light on rain-darkened wood. The vast, fog-obscured sea stretches endlessly beyond the rail, broken only by the ship’s wake.",
      "sensoryDetails": {
        "sights": [
          "fog-shrouded horizon",
          "glinting brass railings",
          "wet teak planks",
          "faint deck lamp halos",
          "ship’s wake frothing white",
          "shadowed figures passing"
        ],
        "sounds": [
          "chill Atlantic wind",
          "lapping waves against hull",
          "distant foghorn moan",
          "creaking steel underfoot",
          "distant muffled voices",
          "soft footsteps on wood"
        ],
        "smells": [
          "briny sea spray",
          "damp wood and salt",
          "engine oil faint trace",
          "cool night air",
          "tobacco smoke waft",
          "wet canvas awning"
        ],
        "tactile": [
          "slick rain-soaked wood",
          "cold brass railing",
          "biting sea breeze",
          "moist fog settling",
          "rough canvas edges",
          "chilled leather coat"
        ]
      },
      "accessControl": "Open to all passengers during daylight; restricted to crew and escorted guests after dark; security patrols monitor for unauthorized presence.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked brass railings",
            "grey light across wet teak",
            "fog drifting low",
            "water pooling in deck seams",
            "pale sky beyond sea",
            "damp ropes coiled neatly"
          ],
          "sounds": [
            "steady rain tapping wood",
            "water dripping from awnings",
            "soft splash of waves",
            "distant crew calls",
            "rain-muted footsteps",
            "occasional gull cry"
          ],
          "smells": [
            "damp wood and salt",
            "fresh rain on canvas",
            "seaweed and brine",
            "wet leather gloves",
            "cool mist",
            "faint engine oil"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter sky",
            "glossy wet wood",
            "shadows without edges",
            "fog creeping over rail",
            "grey waves rolling",
            "empty deck benches"
          ],
          "sounds": [
            "distant foghorn",
            "soft wind gusts",
            "creaking steel joints",
            "footsteps echoing faintly",
            "quiet murmurs",
            "water slapping hull"
          ],
          "smells": [
            "briny air",
            "damp wood",
            "cold metal",
            "tobacco smoke faint",
            "oil and grease",
            "wet canvas"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flicker from below decks",
            "stars faint above fog line",
            "dark sea blending horizon",
            "glint of brass fittings",
            "silhouetted figures leaning rail"
          ],
          "sounds": [
            "soft wind whisper",
            "distant laughter below",
            "clock ticking faintly",
            "waves gently lapping",
            "quiet footsteps",
            "rustle of coats"
          ],
          "smells": [
            "cool night air",
            "salty breeze",
            "tobacco and pipe smoke",
            "cold fireplace ash",
            "damp wood",
            "faint engine warmth"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The promenade deck at night is a narrow, exposed stretch of teak bordered by cold brass railings, slick with sea spray and rain. Pools of yellow light from scattered deck lamps cast a muted glow, barely penetrating the thick fog that clings to the ship’s edges. The endless dark sea beyond seems to swallow sound and light alike, broken only by the ship’s steady wake frothing white in the water.",
        "This isolated vantage point offers few places to hide, but the shifting fog and uneven lighting create fleeting shadows and concealments. The wind bites through coats, carrying the sharp tang of salt and engine oil, while the creak of steel and soft footsteps echo with an eerie intimacy. After dark, access is tightly controlled, with security patrols ensuring only authorized persons traverse this vulnerable stretch of the ship."
      ]
    },
    {
      "id": "first_class_dining_salon",
      "name": "First-Class Dining Saloon",
      "type": "interior",
      "purpose": "Gathering space and social hub",
      "visualDetails": "An elegant room with high ceilings, polished mahogany paneling, large oval windows revealing the roiling sea, and crystal chandeliers casting sparkling light over white linen-draped tables and fine china. Upholstered chairs in deep burgundy velvet line the long tables.",
      "sensoryDetails": {
        "sights": [
          "crystal chandelier sparkle",
          "polished mahogany walls",
          "white linen tablecloths",
          "silver cutlery gleaming",
          "glassy ocean vistas",
          "fine porcelain settings"
        ],
        "sounds": [
          "soft classical piano",
          "tinkling cutlery",
          "low murmured conversation",
          "chairs scraping polished floor",
          "quiet laughter",
          "clinking glassware"
        ],
        "smells": [
          "rich roast meat aroma",
          "freshly baked bread",
          "polished wood scent",
          "subtle perfume",
          "burning beeswax candles",
          "fine tobacco smoke"
        ],
        "tactile": [
          "smooth polished tabletop",
          "soft velvet upholstery",
          "cool porcelain plates",
          "heavy silverware weight",
          "warm candle wax",
          "crisp linen napkins"
        ]
      },
      "accessControl": "Restricted to first-class passengers during meal times; crew serve under supervision; entry barred to lower classes except by invitation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through windows",
            "raindrops tracing glass",
            "dim chandelier glow",
            "empty polished tables",
            "wet ship deck visible",
            "shiny silverware reflections"
          ],
          "sounds": [
            "rain tapping windows",
            "soft footsteps on carpet",
            "quiet chair movements",
            "distant engine hum",
            "murmured greetings",
            "piano notes sparse"
          ],
          "smells": [
            "fresh brewed coffee",
            "warm bread",
            "damp wood polish",
            "light perfume",
            "burning candle wax",
            "sea air faint"
          ],
          "mood": "restrained calm"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light filtering windows",
            "reflections on polished wood",
            "white tablecloths crisp",
            "silverware arranged neatly",
            "dark ocean beyond glass",
            "shadowed corners"
          ],
          "sounds": [
            "soft piano melodies",
            "low conversational murmurs",
            "silverware clinking",
            "chairs shifting gently",
            "clock ticking faintly",
            "distant ship bell"
          ],
          "smells": [
            "roast meat scent",
            "fresh bread",
            "polished wood",
            "faint perfume",
            "candle wax",
            "subtle tobacco"
          ],
          "mood": "polished unease"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm chandelier glow",
            "refined table settings",
            "deep shadows",
            "moonlight on ocean",
            "glittering glassware",
            "rich mahogany sheen"
          ],
          "sounds": [
            "piano playing softly",
            "gentle laughter",
            "quiet conversations",
            "silverware tapping plates",
            "chairs scraping wood",
            "faint ship engine hum"
          ],
          "smells": [
            "roast game aroma",
            "fresh bread",
            "beeswax candles",
            "fine perfume",
            "tobacco smoke",
            "warm polished wood"
          ],
          "mood": "luxurious tension"
        }
      ],
      "paragraphs": [
        "The first-class dining saloon is the epitome of mid-century ocean liner elegance, its polished mahogany walls and sparkling crystal chandeliers creating an atmosphere of refined luxury. Large oval windows frame the restless Atlantic, their glass occasionally streaked by rain, while the carefully arranged tables gleam under the soft glow of candlelight. The room hums with quiet conversation and the gentle clatter of fine china, a social stage for the ship’s most privileged passengers.",
        "Access is tightly controlled, with only first-class passengers and their invited guests permitted entry during scheduled meal times. Waitstaff in crisp uniforms glide between tables, serving rich roast meats and freshly baked breads, the scents mingling with subtle perfumes and the faint trace of tobacco smoke. Despite the polished veneer, an undercurrent of tension threads through the room, as whispered alliances and veiled glances hint at the secrets lurking beneath the genteel surface."
      ]
    },
    {
      "id": "navigation_bridge",
      "name": "Navigation Bridge",
      "type": "interior",
      "purpose": "Crew-only operational center and restricted area",
      "visualDetails": "A compact, steel-framed room perched high above the decks, filled with banks of dials, radio telegraphy equipment, and a large wooden wheel. Portholes offer panoramic views of the fog-enshrouded sea, while the low hum of electrical machinery fills the space.",
      "sensoryDetails": {
        "sights": [
          "glowing instrument panels",
          "flickering radio dials",
          "wooden ship’s wheel",
          "foggy sea vistas",
          "maps and charts pinned",
          "glimmer of polished brass"
        ],
        "sounds": [
          "radio static crackle",
          "soft hum of machinery",
          "footsteps on metal deck",
          "murmured officer commands",
          "distant ship bell",
          "switch toggling clicks"
        ],
        "smells": [
          "machine oil and grease",
          "damp metal",
          "old paper and ink",
          "faint cigarette smoke",
          "sea salt air",
          "clean linen uniforms"
        ],
        "tactile": [
          "cool metal railings",
          "smooth wooden wheel rim",
          "rough paper maps",
          "buttons and switches",
          "sturdy leather chair",
          "chilly window glass"
        ]
      },
      "accessControl": "Strictly limited to ship’s officers and authorized crew; locked and guarded at all times; no passenger access permitted.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked portholes",
            "dim instrument glow",
            "wet deck reflections",
            "grey sea beyond glass",
            "charts damp at edges",
            "fog swirling outside"
          ],
          "sounds": [
            "steady rain patter",
            "radio static bursts",
            "soft footsteps",
            "officer murmurs",
            "switch clicks",
            "engine drone"
          ],
          "smells": [
            "wet metal",
            "machine oil",
            "damp paper",
            "sea salt",
            "cigarette smoke",
            "cool air"
          ],
          "mood": "focused vigilance"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light",
            "instrument lights steady",
            "maps spread out",
            "fog pressing on glass",
            "shadows in corners",
            "brass fittings gleam"
          ],
          "sounds": [
            "low machinery hum",
            "radio chatter",
            "footsteps pacing",
            "quiet commands",
            "clock ticking",
            "engine vibration"
          ],
          "smells": [
            "machine grease",
            "old paper",
            "sea salt",
            "linen uniforms",
            "smoky tobacco",
            "cool metal"
          ],
          "mood": "tense concentration"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "instrument panel glow",
            "stars reflected in glass",
            "dark sea horizon",
            "charts illuminated",
            "brass polish gleam",
            "shadowed officer faces"
          ],
          "sounds": [
            "soft radio static",
            "quiet voices",
            "switch toggles",
            "engine hum",
            "clock ticking",
            "footsteps"
          ],
          "smells": [
            "machine oil",
            "clean linen",
            "sea air",
            "cigarette smoke",
            "paper and ink",
            "cool metal"
          ],
          "mood": "alert calm"
        }
      ],
      "paragraphs": [
        "The navigation bridge, perched high above the decks, is a compact control hub bristling with instruments and radio telegraphy equipment. The wooden wheel stands central, polished smooth by years of use, surrounded by glowing dials and flickering lights that monitor the ship’s course through the fog-bound Atlantic. Portholes frame the swirling sea and mist, offering a panoramic but often obscured view.",
        "Access here is tightly restricted, limited to the captain and authorized officers who maintain constant vigilance. The low hum of machinery and the crackle of radio static fill the air, mingling with the scent of machine oil, damp metal, and old paper charts. The bridge’s steel walls enclose a tense atmosphere of focused concentration, where every decision bears on the safety of the ship and the unfolding mystery."
      ]
    },
    {
      "id": "crew_quarters",
      "name": "Crew Quarters and Mess Hall",
      "type": "interior",
      "purpose": "Crew living space and informal gathering area",
      "visualDetails": "A utilitarian, cramped space below decks with rows of narrow bunks, lockers, and a modest mess hall furnished with simple wooden tables and benches. Walls are painted in muted grey-green, with small portholes admitting limited light.",
      "sensoryDetails": {
        "sights": [
          "stacked narrow bunks",
          "metal lockers lined up",
          "worn wooden tables",
          "faded paint on walls",
          "dim porthole light",
          "scattered personal effects"
        ],
        "sounds": [
          "clatter of cutlery",
          "low crew chatter",
          "footsteps on metal floor",
          "rustling of uniforms",
          "distant engine thrum",
          "occasional laughter"
        ],
        "smells": [
          "stale tobacco smoke",
          "sweat and soap",
          "hot stew aroma",
          "oil and grease",
          "damp paint",
          "wood polish faint"
        ],
        "tactile": [
          "rough wooden benches",
          "scratchy wool uniforms",
          "cool metal lockers",
          "hard bunk mattresses",
          "scarred tabletop surfaces",
          "chilly sea air seep"
        ]
      },
      "accessControl": "Restricted to crew members; passengers barred; entry monitored by senior crew; off-duty hours allow informal congregation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through portholes",
            "wet floor patches",
            "steam rising from mugs",
            "uniforms hung damp",
            "scratched tables",
            "dim overhead bulbs"
          ],
          "sounds": [
            "rain tapping metal",
            "mugs clinking",
            "soft crew voices",
            "footsteps pacing",
            "occasional cough",
            "distant engine drone"
          ],
          "smells": [
            "hot coffee",
            "damp wool",
            "soap and sweat",
            "oil residue",
            "stale smoke",
            "wet wood"
          ],
          "mood": "weary camaraderie"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light through portholes",
            "scuffed floors",
            "folded uniforms",
            "empty benches",
            "worn paint",
            "quiet corners"
          ],
          "sounds": [
            "soft chatter",
            "cutlery scraping",
            "footsteps fading",
            "metal lockers closing",
            "engine hum",
            "wood creaking"
          ],
          "smells": [
            "stale tobacco",
            "wood polish",
            "hot stew",
            "oil and grease",
            "soap",
            "cool damp air"
          ],
          "mood": "tired routine"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm lamp glow",
            "neatly stacked trays",
            "folded clothes",
            "shadows on walls",
            "cleaned tables",
            "darkened portholes"
          ],
          "sounds": [
            "quiet conversation",
            "soft laughter",
            "footsteps approaching",
            "metal clinking",
            "occasional cough",
            "engine hum steady"
          ],
          "smells": [
            "smoke and stew",
            "soap and sweat",
            "clean linen",
            "oil residue",
            "warm wood",
            "sea air faint"
          ],
          "mood": "restful respite"
        }
      ],
      "paragraphs": [
        "Below decks, the crew quarters are a stark contrast to the passenger luxury above. Narrow bunks line the cramped walls, each with a small locker for personal belongings, while the mess hall offers a modest refuge with worn wooden tables and benches. Faded paint and dim portholes lend a muted atmosphere, broken only by the steady drone of engines and the occasional burst of laughter among the men and women who keep the ship running.",
        "Access is strictly reserved for crew, with senior officers monitoring entry to maintain order. Here, away from the polished veneer of passenger spaces, the crew share weary camaraderie amid the smells of hot stew, tobacco smoke, and machine oil. The quarters provide a vital setting for informal gatherings, whispered confidences, and the undercurrents of tension that ripple beneath the ship’s disciplined surface."
      ]
    }
  ],
  "note": "",
  "cost": 0.007347790000000002,
  "durationMs": 63192
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1959,
    "month": "September",
    "day": 14,
    "era": "1950s"
  },
  "seasonal": {
    "season": "fall",
    "month": "September",
    "weather": [
      "cool, damp air typical of North Atlantic transitional autumn",
      "overcast skies with intermittent fog banks reducing visibility",
      "choppy seas causing restless ship movement and occasional spray"
    ],
    "daylight": "days shortening with sunset around 7:20 PM, producing long, gray twilight periods",
    "time_of_day_of_crime": "late evening, between 9 and 11 PM, when most passengers have retired to their cabins or lounges",
    "holidays": [
      "Labor Day (first Monday of September)",
      "Rosh Hashanah beginning late September (varies yearly)"
    ],
    "seasonalActivities": [
      "shipboard deck strolls wrapped in light coats to fend off damp chill",
      "evening cocktail hours in the lounge with jazz or crooner performances",
      "bridge games and card tournaments organized in social rooms"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "single-breasted suits in muted grays and navy with narrow lapels",
        "slim-cut dress trousers paired with crisp white dress shirts",
        "silk ties featuring geometric and abstract patterns popular in late 1950s"
      ],
      "casual": [
        "cardigans layered over button-down shirts in earth tones",
        "khaki trousers or slacks with casual loafers",
        "lightweight trench coats for damp sea weather"
      ],
      "accessories": [
        "fedora hats with narrow brim and ribbon band",
        "leather gloves often worn on deck during cooler evenings",
        "chrome wristwatches with modest dial faces"
      ]
    },
    "womensWear": {
      "formal": [
        "hourglass silhouette dresses with fitted bodices and flared skirts hitting mid-calf",
        "tailored wool coat dresses in autumnal hues like mustard and olive",
        "pearl necklaces and small structured handbags"
      ],
      "casual": [
        "sweater sets paired with pencil skirts or pedal pushers",
        "beret hats or small brimmed hats worn with veils for formal daytime wear",
        "silk scarves tied at the neck or in the hair"
      ],
      "accessories": [
        "white gloves for formal occasions and social events",
        "cat-eye glasses with tortoiseshell frames",
        "compact lipstick cases and powder compacts in evening clutch bags"
      ]
    },
    "trendsOfTheMoment": [
      "emphasis on sleek, clean lines reflecting modernist influences in tailoring",
      "use of synthetic fabrics like nylon blends becoming common in casual wear",
      "growing popularity of transistor radios as personal accessories"
    ],
    "socialExpectations": [
      "men expected to maintain polished appearance and formal manners in public spaces",
      "women encouraged to project femininity through dress and demeanor, especially in mixed company",
      "strict observance of class distinctions reflected in dress codes and social interactions aboard ship"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Soviet Luna 2 probe crashes on the Moon in September 1959, heightening Cold War space race tensions",
      "US President Eisenhower announces increased defense spending amid fears of Soviet missile advancements",
      "British decolonization efforts continue with recent independence of Madagascar in June 1959"
    ],
    "politicalClimate": "Heightened Cold War anxiety dominates international relations, with espionage fears percolating even in leisure environments; a pervasive undercurrent of mistrust colors social exchanges among global travelers.",
    "economicConditions": "Postwar economic boom continues in Western countries, fostering consumerism and travel industries; however, inflation concerns and uneven prosperity add subtle tensions.",
    "socialIssues": [
      "Civil Rights Movement gaining momentum in the US, though largely distant from ocean liner passengers’ immediate concerns",
      "Class stratification remains rigid, with pronounced divisions between first-class and steerage passengers aboard liners",
      "Nuclear proliferation fears impact public consciousness and popular media"
    ],
    "internationalNews": [
      "NASA announces plans for manned spaceflight, sparking public fascination",
      "Tensions in Berlin escalate as East German border restrictions tighten"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Frank Sinatra - 'High Hopes'",
        "The Platters - 'Smoke Gets in Your Eyes'",
        "Ray Charles - 'What’d I Say'"
      ],
      "films": [
        "North by Northwest (1959) – Hitchcock’s thriller captivating audiences",
        "Some Like It Hot (1959) – popular comedy starring Marilyn Monroe",
        "Ben-Hur (1959) – epic historical drama generating Oscar buzz"
      ],
      "theater": [
        "The Sound of Music – Broadway hit gaining traction",
        "A Raisin in the Sun – addressing race and family dynamics",
        "West Side Story – in previews, heralding a new era of musical theater"
      ],
      "radio": [
        "The Jack Benny Program – staple variety comedy",
        "Dragnet – police procedural reflecting crime realities",
        "Fibber McGee and Molly – popular family sitcom"
      ]
    },
    "literature": {
      "recentPublications": [
        "Harlan Ellison’s early sci-fi stories gaining notice",
        "Allen Ginsberg’s 'Howl' soon to challenge literary conventions",
        "John Updike’s debut works emerging in literary circles"
      ],
      "popularGenres": [
        "detective and noir fiction",
        "science fiction exploring space and technology",
        "psychological thrillers reflecting Cold War anxieties"
      ]
    },
    "technology": {
      "recentInventions": [
        "transistor radio making portable music and news accessible",
        "early computer systems installed in government and corporate facilities",
        "color television testing underway but black-and-white remains dominant"
      ],
      "commonDevices": [
        "room-sized mainframe computers in specialized locations",
        "black-and-white TV sets in public lounges on ocean liners",
        "portable transistor radios owned by many passengers"
      ],
      "emergingTrends": [
        "increased miniaturization of electronic devices",
        "growing public fascination with space exploration technology",
        "advances in forensic science such as improved light microscopy"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "cocktail in lounge: $0.75",
        "postage stamp: 4 cents",
        "movie ticket: $1.00"
      ],
      "commonActivities": [
        "passengers attending evening social events and dances",
        "deck promenades to enjoy fresh sea air despite chill",
        "playing bridge or cards in common rooms"
      ],
      "socialRituals": [
        "formal dinner seating by passenger class and social rank",
        "afternoon tea served in first-class lounges"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Clear demarcations between first-class luxury and lower-class accommodations underscore social hierarchy aboard ship",
      "Passengers generally observe polite distance across class boundaries, reinforcing social stratification"
    ],
    "gender": [
      "Women expected to maintain ladylike comportment and dress in public, especially during formal events",
      "Men assume roles of protector and social leader, often dominating conversations and decision-making",
      "Emerging subtle shifts in women’s fashion hint at desire for greater independence but constrained by social norms"
    ],
    "race": [
      "Segregation and racial prejudice remain socially ingrained, though less overt in international maritime settings",
      "Minority passengers often relegated to lower-class accommodations and service roles"
    ],
    "generalNorms": [
      "Etiquette and decorum strictly observed in public spaces, masking interpersonal tensions",
      "Privacy highly valued, particularly among upper classes, complicating investigations and rumor circulation",
      "Cold War paranoia encourages discreet suspicion but discourages overt accusations"
    ]
  },
  "atmosphericDetails": [
    "The salt-tinged fog rolls in thickly off the Atlantic, muffling footsteps and cloaking the ship's decks in a damp, heavy silence.",
    "The low hum of the ship’s engines blends with the distant chatter of passengers in muted tones, punctuated by occasional bursts of jazz drifting from the lounge.",
    "A pervasive chill seeps through the fabric of coats and gloves, while the scent of polished wood and expensive tobacco lingers in the air."
  ],
  "paragraphs": [
    "September 1959 on a North Atlantic ocean liner presents a setting thick with the tension of geopolitical unease and the genteel rituals of postwar luxury travel. The weather is characteristically cool and overcast, with intermittent fogs that reduce visibility and heighten a sense of isolation at sea. Days grow shorter, and twilight lingers in a muted gray palette, reflecting the subdued mood among passengers who are acutely conscious of the world's Cold War anxieties. Social formalities reign aboard the ship, with passengers adhering to strict class distinctions and polished manners that mask a simmering undercurrent of personal and political unease.",
    "Fashion aboard the liner echoes the era's refined but evolving tastes. Men favor slim, tailored suits with narrow lapels and geometric silk ties, while casual wear includes cardigans and lightweight trench coats suitable for the damp deck air. Women exhibit hourglass silhouettes in mid-calf dresses and tailored coat dresses in autumnal colors, complemented by pearls, gloves, and cat-eye glasses. The prevalence of transistor radios as personal accessories signals the dawn of portable technology, while black-and-white televisions offer communal entertainment in public lounges. Evening cocktail hours and bridge games provide structured social activity, preserving the veneer of civility amid the subtle tensions.",
    "Daily life aboard reflects the era’s economic prosperity and social stratifications. Cocktails cost under a dollar, postage stamps are a mere four cents, and movie tickets remain affordable at one dollar, underscoring the accessibility of leisure for the well-heeled traveler. Rituals such as formal dining by class and afternoon tea reinforce the passenger hierarchy, while common activities like deck promenades and card games fill the hours. Social attitudes are shaped by rigid class and gender expectations; women maintain ladylike decorum, men uphold protective roles, and racial prejudices persist quietly below the surface. These dynamics, layered with Cold War paranoia and the omnipresent threat of nuclear conflict, create a charged atmosphere ripe for mystery and intrigue."
  ],
  "note": "Temporal context fully aligned with September 1959 North Atlantic ocean liner setting, integrating accurate fashion, social, cultural, and political details to serve as a vivid backdrop for the mystery narrative.",
  "cost": 0.0035032550000000003,
  "durationMs": 39416
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A diverse group of passengers and crew aboard a transatlantic ocean liner are confined by strict class divisions and Cold War-era social pressures, creating a tense atmosphere where secrets and suspicions simmer beneath formal interactions.",
  "era": {
    "decade": "1950s",
    "socialStructure": "Postwar social stratification is sharply reflected in rigid passenger classes aboard the liner, while Cold War paranoia and nuclear anxiety subtly influence behavior and heighten mistrust among individuals from varying social standings."
  },
  "setting": {
    "location": "A large passenger liner crossing the North Atlantic",
    "institution": "Ocean liner",
    "weather": "Cool, overcast with intermittent fog and choppy seas limiting visibility and movement"
  },
  "castAnchors": [
    "Detective Inspector Clara Benson",
    "Edward Langley",
    "Marjorie Langley",
    "Captain Harold Finch",
    "Helen Carmichael"
  ],
  "theme": "A classic murder mystery where social facades and Cold War tensions collide within the confined, class-segregated environment of an isolated ocean liner."
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
      "description": "A ship’s clock winding key is found with a faint scratch around the hole, unusual oil stains, and traces of forced manipulation.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Indicates tampering with the ship’s clock winding mechanism to alter time display.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The scratch and oil stains on the clock winding key indicate manual forced reverse winding, causing the clock to show an artificially earlier time than actual.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Overturns the assumption that the clock shows true time; proves clock time was falsified.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "Crew members testify hearing clock chimes at times conflicting with the stopped clock face, and the captain’s log entries show time discrepancies.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Shows that the clock chimes were heard at times inconsistent with the clock’s displayed time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The clock chimes and log discrepancies prove the clock time was falsified, and actual ship time was later than the clock’s face indicates.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Contradicts the false assumption that the clock’s face shows real time of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Ventilation shutdown logs show repeated hourly shutdowns increasing coal gas concentration near the victim’s cabin vent.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Indicates environmental conditions that could cause gradual poisoning by coal gas.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The victim was poisoned gradually by coal gas, with poisoning symptoms appearing delayed and inconsistent with sudden death at the clock’s stopped time.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Contradicts the assumption that death occurred exactly at the clock’s stopped time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "physical",
      "description": "Wear marks on the bridge hatch locking mechanism and a ship engineer’s report describe a mechanical latch allowing remote locking.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "Shows how the culprit could exit the bridge and lock the hatch behind them.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "This locking mechanism allowed the culprit to exit the bridge after committing the murder and lock the hatch remotely, preventing immediate pursuit.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Overturns the assumption that the bridge hatch was locked by someone else after the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "Captain Harold Finch reversed the ship’s bulkhead clock gear train, winding it back by forty minutes to create misleading temporal evidence.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "Surfaces the core mechanism of temporal falsification linked to Captain Harold Finch.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The scratch and oil stains indicate manual forced reverse winding, causing the clock to show an artificially earlier time than actual, disproving the clock’s reliability.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Explicitly overturns the false assumption that the clock’s time is accurate.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Edward Langley because his alibi is corroborated by multiple crew members placing him on the starboard promenade between eleven and eleven forty, inconsistent with the murder timeline.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Excludes Edward Langley as the culprit based on solid alibi evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_9",
      "category": "testimonial",
      "description": "Eliminates Marjorie Langley because witness accounts place her in the bridge lounge during the time of the murder, making her involvement impossible.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Excludes Marjorie Langley as the culprit with corroborated witness testimony.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_10",
      "category": "behavioral",
      "description": "Captain Harold Finch took steps to prevent the victim from revealing a secret by intercepting messages and restricting access to the victim’s cabin.",
      "sourceInCML": "CASE.cast[3].evidence_sensitivity[1]",
      "pointsTo": "Shows Captain Harold Finch’s premeditation and motive to silence the victim.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "temporal",
      "description": "A controlled clock comparison test is staged where the ship’s bulkhead clock winding mechanism is observed to confirm the possibility of reverse winding and time falsification.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Provides observable evidence of the clock manipulation mechanism before the discriminating test.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "testimonial",
      "description": "Crew members testify that they heard clock chimes at times inconsistent with the clock face, supporting the falsification of the clock time.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "Supports the contradiction that the clock time was manipulated.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_13",
      "category": "testimonial",
      "description": "Captain Harold Finch’s log entries note irregular clock operation yet report events on schedule, indicating awareness and use of the falsified clock time.",
      "sourceInCML": "CASE.cast[3].evidence_sensitivity[0]",
      "pointsTo": "Links Captain Harold Finch directly to the clock manipulation and timeline falsification.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_14",
      "category": "physical",
      "description": "Residual coal gas smell near the victim’s cabin vent matches the ventilation shutdown logs, indicating poisoning by coal gas accumulation.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "Physical evidence supports the poisoning theory and delayed death timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_captain_harold_finch",
      "category": "temporal",
      "description": "Direct evidence ties Captain Harold Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Harold Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Ship’s bulkhead clock stopped at ten minutes past eleven remains a late texture detail in the case background.",
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
      "description": "The ship’s bulkhead bulkhead timeline exactly at ten minutes past eleven, suggesting the time of death is accurate as shown on the bulkhead face.",
      "supportsAssumption": "The ship’s bulkhead clock shows the true time of death and the timeline of events can be trusted based on it.",
      "misdirection": "This misleads by ignoring the ships and oil stain evidence and the possibility of bulkhead manipulation, which are unrelated to the bulkhead’s stopping time."
    },
    {
      "id": "rh_2",
      "description": "Crew members report the ship’s bulkhead visible was maintained regularly and appeared in good working order before the murder, supporting trust in its time display.",
      "supportsAssumption": "The ship’s bulkhead clock shows the true time of death and the timeline of events can be trusted based on it.",
      "misdirection": "This misleads by focusing on routine maintenance and ignoring the deliberate trusted based and events marks that falsify the visible’s displayed time."
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
      "clue_12"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
      "clue_9",
      "clue_10",
      "clue_11",
      "clue_13",
      "clue_14",
      "clue_culprit_direct_captain_harold_finch"
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
  "latencyMs": 41273,
  "cost": 0.005069035
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
