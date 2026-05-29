# Actual Prompt Record

- Run ID: `run_ba1a1b06-9e59-4c37-87fa-5a9b4226982e`
- Project ID: `proj_f9c43a08-325d-48fd-be1f-607a6b78dcf2`
- Timestamp: `2026-05-28T20:42:34.386Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `a5daab062455beee`

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
    "title": "Murder on the Atlantic Passage: The Engine Room Clockback",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": [
        "Mechanical clocks subject to vibration",
        "Shipboard social hierarchies strictly enforced",
        "Limited forensic technology: blood typing, ballistics, basic chemical analysis",
        "Wartime rationing and restricted communication"
      ]
    },
    "setting": {
      "location": "Atlantic Ocean",
      "place": "Southampton to New York route",
      "country": "International Waters",
      "institution": "Ocean liner (Passenger liner)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "engine room clockback timing error"
    }
  },
  "cast": [
    {
      "name": "Tadhg Cahill",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Crew colleague of Arthur Murphy",
        "Disliked James Healy for past grievance"
      ],
      "public_persona": "Quiet, diligent ship engineer",
      "private_secret": "Resentful of victim's influence over crew assignments",
      "motive_seed": "Professional rivalry and grudges",
      "motive_strength": "moderate",
      "alibi_window": "Between ten minutes past ten and quarter past eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Engine room access",
        "Maintenance schedule overlap"
      ],
      "behavioral_tells": [
        "Nervous when questioned about engine room schedule",
        "Avoids discussing victim"
      ],
      "stakes": "Risk of demotion if implicated",
      "evidence_sensitivity": [
        "Access logs",
        "Clock mechanism",
        "Crew testimony"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "James Healy",
      "age_range": "50-60",
      "role_archetype": "victim",
      "relationships": [
        "Respected senior officer",
        "Known to have conflicts with Tadhg Cahill"
      ],
      "public_persona": "Commanding and respected first officer",
      "private_secret": "Had secret disagreements with crew members",
      "motive_seed": "N/A - victim",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Arthur Murphy",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Crew engineer working with Tadhg Cahill",
        "Had tense exchange with victim days before"
      ],
      "public_persona": "Brash but competent engineer",
      "private_secret": "Concealed unauthorized engine room access",
      "motive_seed": "Resentment over victim's reprimands",
      "motive_strength": "moderate",
      "alibi_window": "Between quarter to ten and ten to eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Engine room access",
        "Maintenance schedule"
      ],
      "behavioral_tells": [
        "Evasive about whereabouts during engine room check",
        "Defensive when questioned"
      ],
      "stakes": "Possible dismissal",
      "evidence_sensitivity": [
        "Engine room logs",
        "Witness statements",
        "Mechanical parts"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Valerie Flanagan",
      "age_range": "25-35",
      "role_archetype": "Suspect",
      "relationships": [
        "Second-class passenger",
        "Seen near engine room stairwell"
      ],
      "public_persona": "Polite and observant passenger",
      "private_secret": "Disguised personal vendetta against victim",
      "motive_seed": "Silencing victim over past affair",
      "motive_strength": "strong",
      "alibi_window": "Between ten and eleven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Stairwell access",
        "Engine room proximity"
      ],
      "behavioral_tells": [
        "Keeps to herself, avoids crew",
        "Unusual knowledge of engine room routines"
      ],
      "stakes": "Risk of scandal exposure",
      "evidence_sensitivity": [
        "Passenger movement logs",
        "Witness sightings",
        "Personal correspondence"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Joan Kavanagh",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [
        "Independent investigator aboard ship",
        "Respected by crew and passengers"
      ],
      "public_persona": "Sharp-minded detective",
      "private_secret": "Hides personal trauma from wartime",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Full ship access",
        "Social contacts among crew and passengers"
      ],
      "behavioral_tells": [
        "Meticulous note-taking",
        "Persistent questioning"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [
        "All available evidence",
        "Crew and passenger interviews"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Tadhg Cahill"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "On a transatlantic ocean liner, senior officer James Healy is found dead. The ship's engine room clock shows the murder occurred shortly before the scheduled eleven o'clock engine check. Initial assumptions place the time of death at ten minutes past eleven, matching the victim's last known movements. However, detective Joan Kavanagh uncovers a temporal contradiction involving the ship's engine vibrations that manipulated the engine room clock, revealing the true time of death was nearly an hour earlier. Through careful deduction, the culprit is identified as Tadhg Cahill, exploiting the faulty clock to conceal his actions during the engine room's busiest period."
    },
    "accepted_facts": [
      "Victim James Healy was last officially seen alive around ten minutes past eleven.",
      "The engine room clock shows ten minutes past eleven but is stopped.",
      "Ship logs record engine vibrations peaking just before eleven o'clock.",
      "Crew members report seeing the victim alive after the apparent time of death.",
      "A worn gear inside the engine room clock mechanism is loose.",
      "Tadhg Cahill and Arthur Murphy had access to the engine room during the relevant time.",
      "Valerie Flanagan was seen near the engine room stairwell between ten and eleven.",
      "Joan Kavanagh is investigating with full access to ship areas."
    ],
    "inferred_conclusions": [
      "The engine room clock's minute hand slipped backward forty minutes due to vibration.",
      "The murder occurred close to ten-thirty, not ten past eleven as assumed.",
      "Tadhg Cahill had opportunity and motive to exploit the clock's malfunction to create a false timeline.",
      "Arthur Murphy's alibi and movement eliminate him as the culprit.",
      "Valerie Flanagan's access was limited and timing inconsistent with murder opportunity."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The ship's engine room clock suffered a mechanical failure caused by the intense vibrations of the main engine, causing the minute hand to slip backward exactly forty minutes due to a loosened gear. This created a false appearance that the murder occurred at ten minutes past eleven, while in reality, the victim was killed nearly an hour earlier. The culprit, Tadhg Cahill, exploited this temporal distortion to mask his presence in the engine room and fabricate an alibi.",
      "delivery_path": [
        {
          "step": "Loosened gear inside engine room clock allows minute hand to slip backward."
        },
        {
          "step": "Peak engine vibrations at a quarter to eleven trigger the slip."
        },
        {
          "step": "Victim seen alive after the apparent clock time of death."
        },
        {
          "step": "Culprit uses false clock time to mislead witnesses and alibi."
        }
      ]
    },
    "outcome": {
      "result": "Revealing the clockback exposes the true timeline, identifying Tadhg Cahill as the murderer who manipulated the temporal evidence to conceal his crime."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred shortly before the eleven o'clock engine check, as indicated by the engine room clock stopped at ten minutes past eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "The engine room clock is the official timekeeper for ship operations, and witnesses base their timelines on it. The victim's last sighting matches this time, reinforcing the assumption.",
    "what_it_hides": "That the clock's minute hand slipped backward nearly forty minutes due to mechanical failure caused by engine vibrations, causing a false timeline and hiding the actual earlier time of murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Engine room clock stopped at ten minutes past eleven",
        "Ship logs record engine vibrations peaking at a quarter to eleven",
        "Victim seen alive after ten minutes past eleven"
      ],
      "windows": [
        "Tadhg Cahill's access to engine room between ten and eleven",
        "Arthur Murphy's logged presence in engine room between quarter to ten and ten to eleven",
        "Valerie Flanagan's presence near engine room stairwell between ten and eleven"
      ],
      "contradictions": [
        "Victim alive after engine room clock stopped",
        "Clock shows later time than victim's actual death",
        "Engine vibration peak coincides with clock malfunction"
      ]
    },
    "access": {
      "actors": [
        "Tadhg Cahill",
        "Arthur Murphy",
        "Valerie Flanagan",
        "Joan Kavanagh"
      ],
      "objects": [
        "Engine room clock",
        "Engine room access logs",
        "Ship logs"
      ],
      "permissions": [
        "Crew engine room access",
        "Passenger stairwell access"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks subject to gear slippage under vibration",
        "Ship engine vibrations peak at scheduled maintenance times"
      ],
      "traces": [
        "Worn loose gear in engine room clock",
        "Stopped clock pendulum",
        "Engine vibration records"
      ]
    },
    "social": {
      "trust_channels": [
        "Crew testimony",
        "Passenger witness statements",
        "Ship log entries"
      ],
      "authority_sources": [
        "Ship captain's orders",
        "Engineering department schedules",
        "Detective Joan Kavanagh's investigation"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The engine room clock's minute hand is visibly stopped at ten minutes past eleven, and inspection shows a small, worn gear inside is loose.",
        "correction": "The clock likely malfunctioned, causing the minute hand to slip backward due to mechanical looseness and vibrations.",
        "effect": "Narrows the actual time of death to earlier than ten minutes past eleven.",
        "required_evidence": [
          "Engine room clock stopped at ten minutes past eleven",
          "Visible loose worn gear inside clock mechanism",
          "Ship logs recording peak engine vibrations at quarter to eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "Ship logs record engine vibrations peaking at a quarter to eleven, coinciding precisely with the time the clock's gear could slip backward.",
        "correction": "The clock's backward slip was triggered by engine vibrations at quarter to eleven, creating a false later time reading.",
        "effect": "Eliminates suspects relying on the official clock time for alibis, such as Arthur Murphy.",
        "required_evidence": [
          "Ship logs recording engine vibrations peaking at quarter to eleven",
          "Victim seen alive after ten minutes past eleven by crew members",
          "Arthur Murphy's alibi window between quarter to ten and ten to eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "Crew members report seeing James Healy alive after the apparent time of death shown by the stopped clock.",
        "correction": "The victim was alive after the time the clock indicates, showing that the murder happened earlier than assumed.",
        "effect": "Narrows the murder window to before the clock slipped, implicating those present in the engine room between ten and eleven, particularly Tadhg Cahill.",
        "required_evidence": [
          "Crew testimony of victim alive after ten minutes past eleven",
          "Engine room clock stopped at ten minutes past eleven",
          "Tadhg Cahill's access to engine room between ten and eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "Tadhg Cahill had motive related to professional rivalry and was nervous when questioned about the engine room schedule.",
        "correction": "His opportunity and behavior suggest he exploited the clock malfunction to conceal the murder timing.",
        "effect": "Eliminates Valerie Flanagan and Arthur Murphy as culprits, focusing suspicion on Tadhg Cahill.",
        "required_evidence": [
          "Tadhg Cahill's nervous behavior and opportunity",
          "Valerie Flanagan's limited access and inconsistent timing",
          "Arthur Murphy's alibi and recorded movements"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled reenactment compares the stopped engine room clock's gear condition and vibration logs with the crew's sightings of the victim alive after the clock's indicated time, proving the clock slipped backward. This exposes Tadhg Cahill's false alibi based on the incorrect timeline.",
    "knowledge_revealed": "The engine room clock's mechanical failure caused a false timeline that Tadhg Cahill exploited to commit the murder and evade detection.",
    "pass_condition": "Only Tadhg Cahill's timeline is invalidated by the clock slip, confirming his guilt.",
    "evidence_clues": [
      "clue_11",
      "clue_4",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The stopped engine room clock and visible loose gear (early clues) reveal a mechanical failure. Step 2: Ship logs of engine vibrations and crew sightings (mid clues) contradict the apparent time of death. Step 3: Crew testimony of victim alive after the clock's time (mid clues) narrows the murder window. Step 4: Behavioral observations and access logs (late clues) eliminate other suspects, implicating Tadhg Cahill. The discriminating test synthesizes these clues to prove the temporal falsification and identify the culprit."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 3,
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
        "Execute the discriminating test",
        "Observe the culprit's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Arthur Murphy",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Verified alibi via engine room access logs and timing",
        "supporting_clues": [
          "Arthur Murphy's alibi window",
          "Ship logs recording engine vibrations",
          "Crew testimony"
        ]
      },
      {
        "suspect_name": "Valerie Flanagan",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Limited access and inconsistent presence near engine room stairwell",
        "supporting_clues": [
          "Passenger movement logs",
          "Witness sightings",
          "Ship whistle timing"
        ]
      },
      {
        "suspect_name": "James Healy",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of clockback and timeline contradiction"
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
        "clue_id": "clue_15",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_16",
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
        "delivery_method": "Cross-check contradiction"
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
        "clue_id": "clue_culprit_direct_tadhg_cahill",
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
    "name": "Tadhg Cahill",
    "summary": "A composed ship’s doctor whose calm exterior masks a dangerous secret debt, driving him to desperate measures.",
    "publicPersona": "Tadhg Cahill is the embodiment of steady reassurance aboard the ship. His measured voice and steady hands have comforted many a seasick passenger and soothed anxious nerves. Always the consummate professional, he wields his medical knowledge with quiet confidence, inspiring trust even among the most fretful travelers.",
    "privateSecret": "Behind this veneer lies a man shackled by gambling debts owed to unsavory acquaintances who have hitched a perilous ride on the Atlantic passage. To cover his losses, he has illicitly borrowed medical supplies to resell, skirting the edges of legality and morality.",
    "motiveSeed": "When the victim uncovered Cahill’s unauthorized appropriation of supplies, threatening to expose him, Tadhg saw no option but to silence the threat permanently, especially after attempts to bribe or intimidate the victim failed.",
    "motiveStrength": "compelling",
    "alibiWindow": "In the infirmary attending a seasick passenger between 8:30 and 9:15 pm",
    "accessPlausibility": "easy",
    "stakes": "Loss of career and potential prison time; financial ruin",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with deliberate calm and precision, often punctuating tense moments with understated irony. Uses medical jargon sparingly but with effect, and has a habit of softening sharp truths with a wry smile or a quiet chuckle.",
    "internalConflict": "Torn between the oath to save lives and the desperate need to protect himself from ruin, Cahill wrestles with guilt and fear, knowing each lie deepens his moral quagmire.",
    "personalStakeInCase": "This case is not merely professional; it is a crucible in which his entire future, reputation, and freedom hang precariously. Failure means public disgrace and imprisonment, while success demands confronting his own failings.",
    "paragraphs": [
      "Tadhg Cahill carries the weight of responsibility with a practiced ease that belies the turmoil beneath. To the passengers, he is a pillar of calm in the rolling uncertainty of the sea, dispensing remedies and quiet counsel with equal measure. His medical bag is as much a symbol of trust as the steady hands that wield its instruments.",
      "Yet, beyond the infirmary’s door, Cahill’s life is shadowed by debts that gnaw at his conscience and threaten his livelihood. The subtle desperation that drove him to pilfer supplies for resale now casts a pall over every interaction, making each smile a mask and every gesture calculated.",
      "When the victim threatened to unravel Cahill’s secret, the doctor’s world teetered. Attempts to buy silence failed, and the specter of exposure loomed large. Murder, unthinkable and abhorrent, became the dark path he deemed necessary to preserve all he had left.",
      "Throughout the investigation, Cahill’s wit emerges as a shield—a dry, restrained humor that both distances him from his fears and invites a rare glimpse of the man beneath. His speech is measured, often laced with gentle irony, revealing a mind attuned to nuance despite the storm within.",
      "Caught between the Hippocratic oath and the demands of survival, Cahill’s internal conflict is palpable. The doctor must decide whether to succumb to his vices or rise above them, with the case forcing a reckoning that could either break or redeem him."
    ],
    "order": 1
  },
  {
    "name": "James Healy",
    "summary": "A gruff retired businessman whose desire to control his legacy drives him to dark extremes.",
    "publicPersona": "James Healy is the archetype of the stern patriarch, his voice gravelly and his demeanor unyielding. Among the first-class passengers, he commands respect through a blend of old-fashioned manners and a palpable presence that brooks no nonsense.",
    "privateSecret": "Beneath this facade, Healy harbors a secret will that disinherits his children in favor of an enigmatic beneficiary, a move that would upend the family’s established order and fortunes.",
    "motiveSeed": "The victim threatened to expose this new will to the family solicitor, jeopardizing Healy’s carefully laid plans. To protect his social standing and financial empire, he saw murder as a regrettable but necessary measure.",
    "motiveStrength": "strong",
    "alibiWindow": "Attending a private card game in the lounge from 8:00 to 9:30 pm",
    "accessPlausibility": "possible",
    "stakes": "Preserving wealth and controlling family legacy",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Speaks in clipped, deliberate tones with a penchant for dry, understated remarks. Rarely wastes words, but when he does, his comments carry a weight that lingers. Occasionally lapses into gruff aphorisms reflecting his old-school values.",
    "internalConflict": "Healy wrestles with the corrosive effects of his deception, fearing the collapse of his family’s unity and the legacy he has strived to build, even as he justifies his actions as necessary.",
    "personalStakeInCase": "The case strikes at the heart of Healy’s identity and pride. Preserving his wealth and family name is paramount, making the stakes deeply personal and fraught with emotional complexity.",
    "paragraphs": [
      "James Healy’s presence is unmistakable: a man carved from the traditions of a bygone era, his voice a rumble of authority and his gaze unflinching. To many aboard, he is the embodiment of steadfastness, a bulwark against the uncertainties of the journey.",
      "Yet beneath this formidable exterior lies a man wrestling with secrets that threaten to unravel the very fabric of his existence. His clandestine will, drafted in shadows, aims to cut out his own children, a betrayal that weighs heavily on his conscience.",
      "The victim’s threats to reveal this secret sent Healy into a spiral of desperation. Faced with the prospect of public disgrace and loss of control over his legacy, murder emerged as a grim solution to an intolerable problem.",
      "In conversation, Healy’s humor is sparse but cutting, delivered with a dry wit that underscores his disdain for frivolity. His speech is economical, each word chosen for maximum impact, reflecting a mind honed by decades of business and social maneuvering.",
      "Internally, Healy grapples with the consequences of his duplicity. The fear that his actions may fracture his family and tarnish his name clashes with his determination to preserve what he has built, creating a tension that colors every decision he makes."
    ],
    "order": 2
  },
  {
    "name": "Arthur Murphy",
    "summary": "A charming social climber whose hidden lineage threatens to topple his ambitions.",
    "publicPersona": "Arthur Murphy presents himself as an eager, affable gentleman, quick with a smile and a compliment. His charm is his currency, and he spends it lavishly, hoping to curry favor with the upper echelons of society aboard the ship.",
    "privateSecret": "Unbeknownst to others, Arthur is the illegitimate son of the victim, a fact that, if revealed, would shatter his carefully constructed social facade but also position him as heir.",
    "motiveSeed": "The victim planned to disclose Arthur’s true parentage publicly, jeopardizing his social aspirations and standing. Murder became the desperate recourse to protect both reputation and inheritance.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be reading in his cabin from 8:15 to 9:00 pm but no witnesses",
    "accessPlausibility": "possible",
    "stakes": "Social acceptance and financial security",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Speaks with a quick rhythm and a hint of mockery, often employing sardonic remarks to deflect probing questions. His language is polished but occasionally slips into biting sarcasm, revealing his underlying cynicism.",
    "internalConflict": "Arthur is torn between his yearning for acceptance among the elite and the moral weight of silencing his own blood. His ambition clashes with guilt, fueling a turbulent inner struggle.",
    "personalStakeInCase": "The case is a crucible for Arthur’s identity. The outcome will determine whether he can ascend the social ladder or be forever condemned by his origins.",
    "paragraphs": [
      "Arthur Murphy is the consummate social climber, his every gesture and word crafted to impress. He moves through the ship’s corridors with a practiced ease, a smile always at the ready to charm potential allies and patrons.",
      "Yet beneath this polished veneer lies a secret that could dismantle his carefully curated world. As the illegitimate son of the victim, Arthur’s lineage is both a curse and a coveted prize, threatening to expose him to scorn or elevate him to unexpected heights.",
      "The victim’s threat to reveal this truth forced Arthur into a corner. Murder, though abhorrent, appeared the only means to safeguard his ambitions and secure a future free from social disgrace.",
      "His humor is sharp and sardonic, a shield against vulnerability. His speech dances between polished eloquence and cutting sarcasm, often leaving interlocutors uncertain whether to be amused or wary.",
      "Caught between desire and conscience, Arthur’s internal conflict is a tempest. The need for acceptance wars with the guilt of betrayal, making every choice a perilous step on a knife’s edge."
    ],
    "order": 3
  },
  {
    "name": "Valerie Flanagan",
    "summary": "A graceful heiress ensnared between societal expectations and a forbidden love.",
    "publicPersona": "Valerie Flanagan is the picture of elegance and poise, admired by her social circle for her philanthropic endeavors and gracious manners. Her presence at any event lends it a sparkle of high society charm.",
    "privateSecret": "Hidden from the world, Valerie is engaged in a clandestine affair with a crew member—a liaison that, if exposed, would scandalize her family and jeopardize her impending inheritance.",
    "motiveSeed": "The victim intended to reveal her secret affair to her controlling family, threatening her social standing and financial future. Having failed to negotiate, Valerie considered murder a last, desperate option.",
    "motiveStrength": "moderate",
    "alibiWindow": "Attending a formal dinner with multiple witnesses from 8:00 to 9:30 pm",
    "accessPlausibility": "unlikely",
    "stakes": "Preserving wealth and personal freedom",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks with refined diction and a measured cadence, often employing polite but barbed remarks that reveal her sharp intellect. Her humor is subtle, delivered with a smile that never quite reaches her eyes.",
    "internalConflict": "Valerie struggles to reconcile her genuine desires with the rigid expectations imposed by her family and society, fearing the loss of both love and legacy.",
    "personalStakeInCase": "This crime threatens to uproot Valerie’s carefully balanced world. The stakes are not merely financial but touch on her autonomy and identity within a constricting social order.",
    "paragraphs": [
      "Valerie Flanagan moves through the ship’s grand salons with effortless grace, her every gesture a study in refined elegance. To the world, she is the benevolent heiress, a paragon of virtue and charm whose presence uplifts any gathering.",
      "Yet beneath the surface lies a woman caught in a delicate web of secrets. Her forbidden affair with a crew member is a fragile flame, one that could scorch her reputation and family ties if ever revealed.",
      "The victim’s threat to expose this liaison cast a long shadow over Valerie’s future. Attempts to dissuade or bargain failed, leaving her to contemplate drastic measures to protect both love and legacy.",
      "Her humor is a weapon of subtlety, wielded with polite savagery. Her remarks, while courteous, often carry an undercurrent of sharpness that hints at the steel beneath her silk.",
      "Internally, Valerie is a battleground of conflicting loyalties—between heart and duty, freedom and expectation. The case forces her to confront the price she is willing to pay for both.",
      "Her alibi, solid and witnessed, places her far from the scene, but the emotional turmoil she harbors adds layers of complexity to her involvement."
    ],
    "order": 4
  },
  {
    "name": "Joan Kavanagh",
    "summary": "A methodical detective whose pursuit of truth is shadowed by past failures and personal doubt.",
    "publicPersona": "Inspector Joan Kavanagh is the epitome of professionalism—methodical, incisive, and unwavering in her dedication to justice. Her reputation for integrity precedes her, and her sharp intuition is widely respected among peers and passengers alike.",
    "privateSecret": "Despite her formidable exterior, Kavanagh harbors lingering doubts about the justice system, rooted in a past case where failure led to tragic consequences. This personal scar fuels both her drive and her inner turmoil.",
    "motiveSeed": "N/A - Investigator",
    "motiveStrength": "weak",
    "alibiWindow": "N/A - On duty throughout the crime timeframe",
    "accessPlausibility": "easy",
    "stakes": "Career reputation and personal ethics",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with clear, precise diction and measured pacing, often interjecting observations that reveal keen insight into human nature. Her humor is subtle and dry, used sparingly to defuse tension or highlight irony.",
    "internalConflict": "Kavanagh struggles with the weight of past mistakes, questioning whether justice can truly be served and fearing that uncovering the truth may expose uncomfortable realities.",
    "personalStakeInCase": "This case represents a chance for redemption and affirmation of her principles. The integrity of the investigation and its outcome bear heavily on her sense of self and professional identity.",
    "paragraphs": [
      "Inspector Joan Kavanagh commands attention not through bluster but by the quiet force of her presence. Her every action is deliberate, her mind a steel trap for detail and nuance. Passengers and crew alike sense that beneath her calm lies a relentless pursuit of truth.",
      "Her career, marked by commendations and hard-earned respect, is nevertheless shadowed by a haunting failure—a case where justice was miscarried, leaving a stain on her conscience that she carries like a hidden scar.",
      "Throughout the investigation, Kavanagh’s demeanor remains composed, her keen observations cutting through layers of deception. She employs a dry, observational wit that surfaces just enough to remind others of the absurdities inherent in human nature.",
      "Her speech is precise and measured, each word chosen for clarity and effect. She listens as intently as she speaks, often pausing to consider before delivering insights that reveal both intellect and empathy.",
      "The internal conflict she grapples with is profound: the fear that exposing the truth may not lead to justice, and the dread that the system she serves is flawed. Yet, this very doubt steels her resolve to see the case through.",
      "For Kavanagh, this investigation is more than a professional duty—it is a personal crucible. Success would reaffirm her faith in justice; failure would deepen wounds she has long sought to heal."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "SS Atlantic Passage",
    "type": "Ocean liner (Passenger liner)",
    "place": "Southampton to New York",
    "country": "England/USA",
    "summary": "A grand mid-1940s transatlantic passenger liner navigating between Southampton and New York, offering segregated accommodations and tightly controlled crew quarters amid wartime austerity.",
    "visualDescription": "A towering steam-powered vessel with multiple decks rising above a choppy Atlantic, the SS Atlantic Passage boasts polished brass fittings, polished teak promenade decks, and rows of portholes revealing glimpses of interior life. The narrow corridors and stairwells snake through segregated passenger classes, while the engine room hums beneath, encased in steel and pipes.",
    "atmosphere": "The liner carries a tense yet hopeful air, its interiors a blend of post-war austerity and lingering luxury. The cold Atlantic air seeps through portholes and deck hatches, contrasting with the warm glows of period lighting and the rhythmic pulse of the ship’s engines, underscored by the distant foghorns and the occasional crackle of radio transmissions.",
    "paragraphs": [
      "The SS Atlantic Passage cleaves through the cold North Atlantic, her hull slicing through choppy waves beneath a slate-grey sky mottled with intermittent fog. The ship’s decks are alive with the murmur of passengers wrapped in heavy coats, their breath visible in the brisk air. Brass railings gleam faintly under the pale light filtering through the mist, while the sound of the ship’s engines resonates deep within, a constant mechanical heartbeat.",
      "Inside, the vessel’s layout enforces rigid social boundaries: first-class passengers enjoy spacious cabins and a polished dining saloon adorned with art deco flourishes, while second and third-class quarters are more utilitarian, their narrower corridors and lower ceilings amplifying the sense of confinement. Crew-only areas, including the engine room and bridge, are secured behind locked doors and guarded stairwells, their harsh fluorescent lights and metallic clangs a stark contrast to the softer ambiance above.",
      "The atmosphere is tinged with post-war tension; radio operators relay coded military messages alongside passenger communications, and the early radar system’s faint blips on the navigation bridge speak to both technological progress and wartime vigilance. The ship’s schedule regulates the movement of passengers and crew alike, each step measured and controlled, underscoring the isolation of the liner as it journeys across vast, unforgiving seas.",
      "Throughout the voyage, the cold ocean mist mingles with the scents of polished wood, tobacco smoke, and the faint tang of coal smoke from the funnels. The persistent hum of the engines and the occasional foghorn punctuate the quiet moments, crafting a cocoon of sound and sensation that both comforts and unnerves those aboard."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Cold North Atlantic sea conditions with intermittent fog and choppy waves",
    "timeFlow": "Three days of mounting tension crossing the Atlantic",
    "mood": "A cozy yet tense ambiance, marked by lingering war anxieties and the hope of post-war normalcy",
    "eraMarkers": [
      "Radio communication throughout the ship",
      "Early radar systems primarily for navigation",
      "Mechanical typewriters for record-keeping",
      "Steam-powered ocean liners with restricted fuel use",
      "Limited automobile presence in port cities due to wartime rationing",
      "Long-distance radio calls with possible delays",
      "Coded military messages influencing ship communications",
      "Telegram services available at ports"
    ],
    "sensoryPalette": {
      "dominant": "Cold sea air mingled with coal smoke",
      "secondary": [
        "Mechanical hum of ship engines",
        "Brass fittings and polished wood interiors"
      ]
    },
    "paragraphs": [
      "The SS Atlantic Passage is enveloped in a bracing coldness that seeps into every corner, from the damp steel decks slick with sea spray to the fogged portholes dimly revealing the stormy ocean beyond. The persistent hum of the steam engines vibrates through the ship’s framework, mingling with the sharp tang of coal smoke and the faint scent of tobacco drifting from the first-class smoking lounge. This sensory blend creates an atmosphere both invigorating and claustrophobic, a reminder of the vast isolation at sea.",
      "Within the ship’s interiors, the interplay of light and shadow is carefully calibrated: brass fittings catch the flicker of gas lamps, while polished teak surfaces reflect the muted glow. The narrow corridors echo footsteps and hushed conversations, punctuated by the distant clatter of typewriters and the occasional crackle of radio transmissions. Outside, the foghorn’s mournful call cuts through the thick air, underscoring the ship’s solitary passage through a cold and often unforgiving ocean."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Atlantic Ocean - Open Decks",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "Open upper deck slick with sea spray under a grey, fog-shrouded sky; lifeboats secured along the rails; distant horizon blurred by mist and waves; scattered deck furniture damp and unoccupied.",
      "sensoryDetails": {
        "sights": [
          "fog-wreathed steel railings",
          "choppy grey ocean waves",
          "dripping lifeboat davits",
          "pale dawn light through mist",
          "slick wooden deck planks",
          "swirling sea spray"
        ],
        "sounds": [
          "distant foghorn blasts",
          "lapping waves against hull",
          "whistling cold wind",
          "creaking metal fittings",
          "occasional gull cries"
        ],
        "smells": [
          "briny salt air",
          "damp seaweed tang",
          "coal smoke faintly drifting",
          "wet timber",
          "ozone from sea spray"
        ],
        "tactile": [
          "slick cold deck planks",
          "biting ocean breeze",
          "rough steel railings",
          "damp canvas of deck chairs"
        ]
      },
      "accessControl": "Restricted to crew during rough weather; passengers allowed during daylight hours under supervision; closed at night for safety.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked steel rails",
            "grey mist obscuring horizon",
            "puddles on deck planks"
          ],
          "sounds": [
            "steady raindrops on metal",
            "water dripping from rigging",
            "distant thunder roll"
          ],
          "smells": [
            "wet salt air",
            "fresh rain on wood",
            "cold dampness"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light on waves",
            "fog drifting over railings",
            "dark clouds low overhead"
          ],
          "sounds": [
            "wind sighing through rigging",
            "waves slapping hull",
            "metal creaking softly"
          ],
          "smells": [
            "salty sea brine",
            "coal smoke faint on breeze",
            "damp wood"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset on water",
            "long shadows across deck",
            "stars emerging overhead"
          ],
          "sounds": [
            "soft lapping of waves",
            "distant foghorn echoes",
            "quiet footsteps on planks"
          ],
          "smells": [
            "cool sea air",
            "faint tobacco smoke",
            "dried salt on wood"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The open decks of the Atlantic Passage are exposed to the relentless North Atlantic elements, their steel railings slick with salt spray and the wooden planks darkened by dampness. Fog often drifts low, blurring the boundary between sea and sky, while the distant horizon remains an uncertain, shifting line. The chill wind whistles around the ship’s superstructure, carrying with it the sharp scents of brine and coal smoke.",
        "Access is tightly controlled, with passengers allowed only during daylight and under supervision, while crew maintain vigilance for safety in rough weather. The isolation of this space, combined with limited visibility and the ever-present roar of the sea, creates an atmosphere ripe for secrets and unseen movements — an ideal setting for a crime to unfold unseen."
      ]
    },
    {
      "id": "engine_room",
      "name": "Engine Room",
      "type": "interior",
      "purpose": "Clue discovery and crew operations",
      "visualDetails": "A cavernous steel chamber throbbing with the pulse of massive steam engines, surrounded by pipes and gauges that gleam with oil and soot. Narrow catwalks and grated floors offer limited footing, while overhead steam pipes hiss intermittently, casting shadows in the flickering electric lamps.",
      "sensoryDetails": {
        "sights": [
          "glowing red furnace doors",
          "shimmering steam clouds",
          "gleaming brass pressure gauges",
          "dark oily steel beams",
          "flickering overhead lamps",
          "grated metal walkways"
        ],
        "sounds": [
          "steady churning of engines",
          "hissing steam bursts",
          "clanking of metal tools",
          "distant rhythmic thumps",
          "echoing footfalls on grates"
        ],
        "smells": [
          "hot metal and oil",
          "coal smoke and soot",
          "damp steam and grease",
          "burnt coal dust"
        ],
        "tactile": [
          "warm vibrating steel surfaces",
          "rough oily handrails",
          "slick greasy floors",
          "hot furnace radiance"
        ]
      },
      "accessControl": "Restricted to engineering crew and select officers; locked bulkhead doors; entry logged and monitored by radio.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "steam clouds thickened by humidity",
            "dim electric lamps flickering"
          ],
          "sounds": [
            "steady engine hum",
            "intermittent steam hisses",
            "rain drumming faintly on hull"
          ],
          "smells": [
            "damp coal dust",
            "hot oil",
            "wet steel"
          ],
          "mood": "tense industriousness"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows cast by piping",
            "faint glow from furnace doors"
          ],
          "sounds": [
            "constant mechanical drone",
            "tools clanking",
            "footsteps echoing"
          ],
          "smells": [
            "burnt coal",
            "hot metal",
            "grease and oil"
          ],
          "mood": "focused vigilance"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm furnace glow",
            "steam drifting in light beams"
          ],
          "sounds": [
            "steady engine pulse",
            "soft metal tapping",
            "distant ship creaks"
          ],
          "smells": [
            "hot iron",
            "coal smoke",
            "greasy steam"
          ],
          "mood": "quiet intensity"
        }
      ],
      "paragraphs": [
        "The engine room thrums with relentless mechanical energy, its vast steel structures suffused with heat and soot. Pipes snake overhead, releasing hissing bursts of steam that catch the flickering electric lights and cast restless shadows. The air is thick with the acrid scent of coal smoke and hot oil, while the continuous drone of the engines forms a constant, almost hypnotic backdrop.",
        "Entry is strictly controlled, limited to engineering personnel and select officers, with access secured behind heavy bulkhead doors and monitored by radio. The confined, labyrinthine layout of grated walkways and catwalks offers narrow sightlines and numerous hiding places, making it a crucial location for both the ship’s operation and the mystery’s unfolding clues."
      ]
    },
    {
      "id": "first_class_dining_salon",
      "name": "First-Class Dining Saloon",
      "type": "interior",
      "purpose": "Gathering space for passengers and social interactions",
      "visualDetails": "An elegant room adorned with polished wood paneling, brass wall sconces casting warm amber light, and large portholes framing the restless ocean. Tables are set with crisp white linens, fine china, and crystal glassware, while art deco motifs decorate ceiling moldings and upholstery.",
      "sensoryDetails": {
        "sights": [
          "gleaming brass sconces",
          "polished walnut panels",
          "crystal glassware sparkling",
          "white linen tablecloths",
          "art deco ceiling moldings",
          "soft amber lighting"
        ],
        "sounds": [
          "quiet clinking of silverware",
          "murmured conversations",
          "soft jazz from gramophone",
          "footsteps on polished floor",
          "rustling of napkins"
        ],
        "smells": [
          "freshly polished wood",
          "rich coffee and pastries",
          "light tobacco smoke",
          "sea salt faint outside"
        ],
        "tactile": [
          "smooth polished table surfaces",
          "soft velvet upholstery",
          "cool crystal glass rims",
          "fine linen textures"
        ]
      },
      "accessControl": "Restricted to first-class passengers during meal times; crew permitted for service; closed outside scheduled hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through portholes",
            "water droplets on glass"
          ],
          "sounds": [
            "soft rain pattering",
            "low conversation hum",
            "gramophone faintly playing"
          ],
          "smells": [
            "fresh coffee",
            "warm pastries",
            "damp wood"
          ],
          "mood": "quiet comfort"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "diffuse muted daylight",
            "shadows soft and blurred"
          ],
          "sounds": [
            "clinking cutlery",
            "soft footsteps",
            "gentle conversation"
          ],
          "smells": [
            "tea and biscuits",
            "polished wood",
            "faint sea breeze"
          ],
          "mood": "restrained elegance"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm amber glow",
            "candlelight flickering",
            "reflections on glassware"
          ],
          "sounds": [
            "soft jazz melodies",
            "low laughter",
            "silverware gently tapping"
          ],
          "smells": [
            "rich tobacco",
            "roast meats",
            "burning beeswax"
          ],
          "mood": "sophisticated warmth"
        }
      ],
      "paragraphs": [
        "The first-class dining saloon exudes refined elegance, its polished walnut paneling and brass sconces casting a warm, inviting glow. Large portholes offer shifting views of the restless ocean, their glass occasionally beaded with rain. The room buzzes softly with the murmur of well-dressed passengers, the clink of fine china, and the gentle strains of a gramophone playing jazz.",
        "Access is tightly controlled, reserved for first-class passengers during scheduled meals, with attentive crew circulating to serve coffee, pastries, and later, sumptuous dinners. The sensory interplay of crisp linens, rich aromas, and soft lighting creates an atmosphere both comfortable and exclusive, the perfect backdrop for social intrigue and whispered confidences."
      ]
    },
    {
      "id": "crew_quarters_corridor",
      "name": "Crew Quarters Corridor",
      "type": "interior",
      "purpose": "Crew passage and informal gathering",
      "visualDetails": "A narrow, dimly lit corridor lined with steel bulkheads and heavy wooden doors to cramped cabins. Faint electric bulbs cast a cold, pale light along the length of the passage, highlighting worn paint and polished brass door plaques. The corridor is punctuated by stairwell access points and secured hatches.",
      "sensoryDetails": {
        "sights": [
          "flickering electric bulbs",
          "worn steel bulkhead paint",
          "brass door plaques",
          "scuffed wooden door edges",
          "narrow stairwell openings",
          "dim emergency exit signs"
        ],
        "sounds": [
          "distant muffled voices",
          "footsteps on metal grates",
          "clinking keys",
          "faint hum of ventilation"
        ],
        "smells": [
          "stale sweat and soap",
          "engine oil faintly",
          "damp metal",
          "washed canvas uniforms"
        ],
        "tactile": [
          "cold steel handrails",
          "rough painted walls",
          "heavy brass doorknobs",
          "scuffed wooden flooring"
        ]
      },
      "accessControl": "Restricted to crew members only; locked from passenger areas; access monitored by officers during shifts.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light through porthole",
            "wet footprints on floor"
          ],
          "sounds": [
            "rain tapping on hull",
            "low murmurs",
            "keys jingling softly"
          ],
          "smells": [
            "damp metal",
            "fresh soap",
            "coal dust"
          ],
          "mood": "quiet vigilance"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pale light",
            "shadowed corners"
          ],
          "sounds": [
            "footsteps pacing",
            "distant engine hum",
            "soft conversation"
          ],
          "smells": [
            "engine oil",
            "stale sweat",
            "wet canvas"
          ],
          "mood": "tense routine"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "pale bulb glow",
            "long shadows"
          ],
          "sounds": [
            "soft creaks",
            "quiet voices",
            "door clicks"
          ],
          "smells": [
            "washed uniforms",
            "coal smoke faint",
            "fresh soap"
          ],
          "mood": "reserved calm"
        }
      ],
      "paragraphs": [
        "The crew quarters corridor is a utilitarian artery within the ship, narrow and dimly lit by flickering electric bulbs that cast cold pools of light along steel bulkheads. Heavy wooden doors lead to cramped cabins, their scuffed edges bearing witness to the constant passage of busy hands. The air carries the mingled scents of engine oil, damp metal, and soap, a testament to the crew’s ceaseless labor and brief respites.",
        "Access is strictly limited to crew members, with locked doors separating this corridor from passenger areas and officers monitoring movements during shift changes. The corridor’s cramped, shadowed atmosphere fosters whispered conversations and furtive glances, making it a place where secrets circulate as readily as orders."
      ]
    }
  ],
  "note": "",
  "cost": 0.006191230000000001,
  "durationMs": 50504
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "March",
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "March",
    "weather": [
      "chilly North Atlantic temperatures around 35-45°F (2-7°C)",
      "intermittent dense sea fog especially during early mornings and evenings",
      "choppy, restless waves with occasional strong gusts of wind"
    ],
    "daylight": "Daylight hours slowly lengthening with sunrise around 6:30 AM and sunset near 6:00 PM, but heavy cloud cover often dims natural light",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner service in the ship’s dining saloon",
    "holidays": [
      "St. Patrick’s Day (March 17)"
    ],
    "seasonalActivities": [
      "passengers gathering in the ship’s lounge for afternoon tea and card games",
      "crew members performing routine engine room maintenance amid cold, damp conditions",
      "watch officers navigating carefully through fog using early radar and radio signals"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "single-breasted wool suits with broad shoulders and tapered waists",
        "three-piece suits featuring waistcoats and ties in muted tones",
        "fedora hats with wide brims and felt bands"
      ],
      "casual": [
        "heavy knitted sweaters layered beneath trench coats or pea coats",
        "woolen slacks often paired with leather boots",
        "knitted scarves and gloves for warmth on deck"
      ],
      "accessories": [
        "leather gloves",
        "pocket watches on chains",
        "silk neckties featuring geometric or stripe patterns"
      ]
    },
    "womensWear": {
      "formal": [
        "tailored wool dresses with padded shoulders and nipped-in waists",
        "knee-length skirts paired with fitted blouses and small hats",
        "fur stoles or collars for added warmth and elegance"
      ],
      "casual": [
        "knitted cardigans and wool skirts",
        "stockings with back seams and sensible leather shoes",
        "berets or cloche hats popular among younger women"
      ],
      "accessories": [
        "leather handbags with metal clasps",
        "silk scarves tied around the neck or hair",
        "gloves made of kid leather or wool"
      ]
    },
    "trendsOfTheMoment": [
      "strong shoulder silhouettes in women's dresses influenced by wartime tailoring",
      "men’s fashion favoring practicality with an underlying elegance despite material rationing",
      "increasing popularity of practical outerwear due to cold weather and wartime travel"
    ],
    "socialExpectations": [
      "men expected to wear hats and gloves in public spaces aboard the ship",
      "women required to maintain a polished, modest appearance reflecting their social class",
      "strict adherence to class separation in clothing styles and access to ship areas"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Phoney War ongoing in Europe with Britain and France in a tense stalemate against Nazi Germany",
      "The British Royal Navy enforcing blockades in the Atlantic to disrupt German supply lines",
      "Rising concern over U-boat activity threatening Atlantic shipping routes"
    ],
    "politicalClimate": "A tense wartime atmosphere marked by cautious optimism but growing anxiety over escalating conflict and its impact on civilian life and travel",
    "economicConditions": "War-driven rationing affecting consumer goods availability, but shipping lines remain vital for transporting essential personnel and goods",
    "socialIssues": [
      "Class distinctions sharply felt aboard passenger liners, with strict segregation of cabins and amenities",
      "Women increasingly employed in service roles yet facing societal pressure to uphold traditional femininity",
      "Wartime censorship and propaganda influencing news and interpersonal trust"
    ],
    "internationalNews": [
      "Germany’s occupation of Denmark and Norway heightening fears of further European invasion",
      "The Soviet Union and Germany still officially non-belligerent under their 1939 Pact"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller - 'In the Mood'",
        "Bing Crosby - 'Only Forever'",
        "Duke Ellington - 'Cotton Tail'"
      ],
      "films": [
        "Rebecca (released March 1940)",
        "The Grapes of Wrath (released March 1940)",
        "The Great Dictator (upcoming release April 1940)"
      ],
      "theater": [
        "The Philadelphia Story transferring from Broadway to London",
        "Noël Coward’s productions embodying sharp wit and social commentary",
        "Variety acts and musical revues staged aboard some ocean liners for passenger entertainment"
      ],
      "radio": [
        "The Jack Benny Program",
        "Fibber McGee and Molly",
        "The Shadow"
      ]
    },
    "literature": {
      "recentPublications": [
        "Ernest Hemingway’s 'For Whom the Bell Tolls' (serialized early 1940)",
        "Agatha Christie’s 'Sad Cypress' (published 1940)",
        "John Steinbeck’s 'The Grapes of Wrath' (published early 1940)"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "War and adventure novels",
        "Social realism and political literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "Early naval radar systems for navigation and detection",
        "Improved radio transmitters aboard ships for long-distance communication",
        "Mechanical typewriters with improved portability"
      ],
      "commonDevices": [
        "Shipboard radio receivers",
        "Mechanical clocks and chronometers for navigation",
        "Electric lighting throughout passenger and crew areas"
      ],
      "emergingTrends": [
        "Increasing reliance on radio communication for safety and coordination",
        "Development of early electronic detection devices for naval warfare",
        "Wider availability of mass-produced consumer radios in cabins"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Dinner in first-class dining saloon: 7 shillings 6 pence",
        "Deck chair rental per day: 1 shilling",
        "Postcard to mainland: 2 pence"
      ],
      "commonActivities": [
        "Afternoon tea and card games in first-class lounges",
        "Crew conducting drills and maintenance in challenging sea conditions",
        "Passengers reading newspapers and listening to radio broadcasts"
      ],
      "socialRituals": [
        "Formal dining seating arranged by class and rank",
        "Evening dress codes enforced in public spaces"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Rigid social hierarchy strictly observed aboard ocean liners, reflecting broader British society",
      "First-class passengers maintain distance from lower classes, with clear segregation of spaces"
    ],
    "gender": [
      "Women expected to uphold decorum and elegance, even when working in service roles",
      "Men often hold positions of authority aboard ship, reinforcing traditional gender roles",
      "Emerging acceptance of women’s contributions to the war effort tempered by conservative social norms"
    ],
    "race": [
      "Racial segregation and prejudice prevalent, particularly among crew and service staff",
      "Limited interaction between passengers of different ethnic backgrounds, reflecting colonial-era attitudes"
    ],
    "generalNorms": [
      "Strict etiquette governs interactions, with formal greetings and protocol observed",
      "Privacy and discretion highly valued, especially among elite passengers",
      "Wartime vigilance encourages suspicion and careful observation of strangers"
    ]
  },
  "atmosphericDetails": [
    "The steady clatter of the engine room machinery overlaid by the occasional foghorn’s mournful call",
    "The cold, salty tang of the sea air mixing with the warmth of polished wood and cigar smoke in the smoking lounge",
    "Dim lighting casting long shadows in narrow corridors, creating an intimate yet tense ambiance among passengers"
  ],
  "paragraphs": [
    "March 1940 aboard a North Atlantic ocean liner offers a unique blend of harsh natural conditions and refined human endeavor. The cold sea air, punctuated by intermittent fog and brisk winds, presses against the ship’s steel hull as it plies the restless waters. Passengers, bundled in wool and furs against the chill, move carefully along slick decks or retreat to the warm, polished interiors. The lengthening days bring a muted light filtered through heavy cloud cover, while the ship’s early radar and radio systems hum quietly in the background, a testament to the modern technologies cautiously employed during these uncertain times.",
    "Fashion aboard the liner reflects both the constraints and elegance of wartime 1940. Men favor practical yet stylish wool suits with broad shoulders, complemented by fedora hats and leather gloves, balancing formality with the need for warmth. Women’s attire features tailored wool dresses with padded shoulders and fur accents, combined with knitted accessories and modest hats that signify their class and composure. These sartorial choices reinforce the strict social codes governing behavior and appearance aboard the ship, where each passenger’s status is carefully displayed and observed.",
    "Daily life is marked by rituals that offer comfort amid the underlying tension of global conflict. Formal dining, afternoon teas with card games, and radio programs like The Jack Benny Show punctuate the passengers’ days, while the crew maintains the engine room’s relentless pulse through cold and fog. News from Europe—reports of German advances and naval blockades—casts a shadow of anxiety, fueling whispered conversations about the war’s trajectory. Social boundaries are sharply drawn, with servants and lower-class passengers maintaining distance from the elite, even as all share the common uncertainty of a world on the brink."
  ],
  "note": "All information is historically accurate and specific to March 1940, balancing the shipboard setting with broader wartime context, reflecting both social and technological realities of the time.",
  "cost": 0.01012306,
  "durationMs": 64181
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst strict class divisions and wartime tensions aboard a transatlantic ocean liner, passengers and crew are bound by formal etiquette and confined social roles while isolated at sea.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Rigid class hierarchy separates first, second, and third-class passengers and crew, with women often in service roles; wartime anxieties and emerging social shifts create underlying tension within formal social expectations."
  },
  "setting": {
    "location": "North Atlantic Ocean",
    "institution": "Passenger ocean liner operating transatlantic routes",
    "weather": "Cold sea conditions with intermittent fog and choppy waves"
  },
  "castAnchors": [
    "Tadhg Cahill",
    "James Healy",
    "Arthur Murphy",
    "Valerie Flanagan",
    "Joan Kavanagh"
  ],
  "theme": "A classic murder mystery exploring social tensions and hidden secrets beneath a cozy yet tense veneer aboard a segregated ocean liner."
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
  },
  {
    "id": "peak_vibration_time",
    "value": "a quarter to eleven",
    "description": "Time when engine vibrations peaked causing gear slip"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The engine room clock's minute hand is visibly stopped at ten minutes past eleven, and inspection shows the pendulum is halted.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The exact stopped time of the engine room clock indicating the apparent time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock likely malfunctioned, causing the minute hand to slip backward due to mechanical looseness and vibrations.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Initial assumption that the clock's stopped time might be unreliable due to mechanical failure.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The ship's engine room clock suffered a mechanical failure caused by the intense vibrations of the main engine, causing the minute hand to slip backward.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Core mechanism of the clock's malfunction linked to engine vibrations.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Ship logs record engine vibrations peaking at a quarter to eleven, coinciding precisely with the time the clock's minute hand slipped backward.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Temporal alignment of engine vibrations with the clock malfunction.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The clock's backward slip was triggered by engine vibrations at quarter to eleven, creating a false impression of the murder time.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Contradiction to the initial assumption about the clock's stopped time accurately indicating death time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Crew members report seeing James Healy alive after the apparent time of death shown by the stopped clock at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Testimonial evidence that the victim was alive after the clock stopped.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The victim was alive after the time the clock indicates, showing that the murder happened earlier than the clock's stopped time.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Contradiction to the assumption that the murder occurred at the clock's stopped time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "behavioral",
      "description": "Tadhg Cahill had motive related to professional rivalry and was nervous when questioned about the engine room clock and access logs.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "Behavioral evidence linking Tadhg Cahill to motive and suspicious conduct.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "His opportunity and behavior suggest he exploited the clock malfunction to conceal the murder timing, manipulating the engine room clock's mechanism.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Contradiction that Tadhg Cahill used the clock's malfunction as a cover for the murder time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock likely did not malfunction randomly; detailed inspection shows the minute hand's slip was caused by external manipulation, overturning the false assumption of mere mechanical looseness.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Explicit overturning of the false assumption that the clock malfunction was accidental.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_11",
      "category": "temporal",
      "description": "A controlled reenactment compares the stopped engine room clock's gear condition and vibration logs, confirming the minute hand's slip aligns with engine vibrations and not normal operation.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Experimental evidence supporting the clock malfunction mechanism linked to vibrations.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "temporal",
      "description": "Tadhg Cahill is uniquely linked to the ship's engine clock through his exclusive access and knowledge of its mechanism, distinguishing him from others.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[1]",
      "pointsTo": "Direct linkage of Tadhg Cahill to the clock mechanism and opportunity.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_13",
      "category": "behavioral",
      "description": "Visible evidence of Tadhg Cahill's premeditation includes documented professional rivalry and grudges against James Healy, noted in ship's personnel files.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[0]",
      "pointsTo": "Premeditation motive visible to the reader before confrontation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Arthur Murphy because his alibi is corroborated by engine room logs and multiple witness statements placing him away from the engine room during the critical time window.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Exclusion of Arthur Murphy as suspect based on solid alibi and corroboration.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_15",
      "category": "testimonial",
      "description": "Eliminates Valerie Flanagan because passenger movement logs and witness sightings confirm her presence on the upper deck during the murder timeframe.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Exclusion of Valerie Flanagan as suspect based on verified alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_16",
      "category": "testimonial",
      "description": "Eliminates Arthur Murphy because his alibi is corroborated by engine room logs and witness statements, narrowing the solution toward culprit Tadhg Cahill.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Explicit elimination of Arthur Murphy and narrowing focus on Tadhg Cahill.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_tadhg_cahill",
      "category": "temporal",
      "description": "Direct evidence ties Tadhg Cahill to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Tadhg Cahill had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Engine room clock stopped at ten minutes past eleven remains a late texture detail in the case background.",
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
      "description": "The murder occurred shortly before the stopped o'shortly check check, as indicated by the check room shortly stopped at ten minutes past stopped, supported by several crew members recalling the victim's last known whereabouts.",
      "supportsAssumption": "The murder occurred shortly before the eleven o'clock engine check.",
      "misdirection": "This misleads by focusing on eyewitness official unrelated to the shortly's oclock failure, avoiding mention of the shortly's minutes mechanism."
    },
    {
      "id": "rh_2",
      "description": "The victim's last meal was served just before timelines o'timekeeper, suggesting the murder occurred shortly thereafter, consistent with the stopped witnesses room timekeeper time.",
      "supportsAssumption": "The murder occurred shortly before the eleven o'clock engine check.",
      "misdirection": "This misleads by linking the murder time to routine meal victims, without involving the timekeeper's operations issues or vibration effects."
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
      "clue_mechanism_visibility_core",
      "clue_3",
      "clue_4"
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
      "clue_core_elimination_chain",
      "clue_15",
      "clue_16",
      "clue_culprit_direct_tadhg_cahill"
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
  "latencyMs": 32633,
  "cost": 0.004828875
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
