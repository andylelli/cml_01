# Actual Prompt Record

- Run ID: `run_76027844-c2e6-479b-aecc-4de50f06dcd9`
- Project ID: `proj_3536a346-9c52-4446-8bb0-8abe12fd3857`
- Timestamp: `2026-05-29T17:07:33.509Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `13a4b7b82f78cb94`

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
    "title": "The Tide-Timed Murder: A Transatlantic Enigma",
    "author": "OpenAI Detective",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": [
        "Radio communication ubiquitous",
        "Post-war social adjustments including more women in workforce",
        "Shipboard technology limited to mechanical and early electrical devices",
        "Forensics include blood typing and ballistic analysis",
        "Strict social etiquette and class hierarchy aboard ocean liners"
      ]
    },
    "setting": {
      "location": "Atlantic Ocean",
      "place": "Southampton to New York route",
      "country": "Transatlantic route",
      "institution": "Ocean liner (Passenger liner)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "locked cabin murder with tide-delayed latch mechanism"
    }
  },
  "cast": [
    {
      "name": "Frank Barlow",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Professional rivalry with victim",
        "Acquaintance of Norman Lynton"
      ],
      "public_persona": "Confident shipboard businessman",
      "private_secret": "Was blackmailed by victim",
      "motive_seed": "Blackmail avoidance",
      "motive_strength": "strong",
      "alibi_window": "Between quarter past ten and half past ten",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to victim's deck via passenger corridors",
        "Knowledge of ship schedule"
      ],
      "behavioral_tells": [
        "Nervous when questioned about timing",
        "Avoids direct eye contact"
      ],
      "stakes": "Exposure of illicit business dealings",
      "evidence_sensitivity": [
        "Presence near victim's deck",
        "Knowledge of tide schedules"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Norman Lynton",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Old friend of victim",
        "Rival to Frank Barlow"
      ],
      "public_persona": "Reserved retired naval officer",
      "private_secret": "Harbors resentment over past grievance with victim",
      "motive_seed": "Jealousy and revenge",
      "motive_strength": "moderate",
      "alibi_window": "Reported in smoking room from ten to eleven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access through crew corridors with forged pass",
        "Knowledge of ship layout"
      ],
      "behavioral_tells": [
        "Calm demeanor hides irritation",
        "Glances at watch frequently"
      ],
      "stakes": "Preservation of reputation",
      "evidence_sensitivity": [
        "Smoking room attendance logs",
        "Crew corridor access records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Julie Waldron",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Close confidante of victim",
        "Social acquaintance of Alice Turnbull"
      ],
      "public_persona": "Charming socialite",
      "private_secret": "Had secret financial dealings with victim",
      "motive_seed": "Fear of scandal exposure",
      "motive_strength": "moderate",
      "alibi_window": "Seen at dinner from quarter to ten to quarter past ten",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to victim's cabin floor via passenger elevators",
        "Knowledge of victim's routine"
      ],
      "behavioral_tells": [
        "Flustered when discussing victim",
        "Frequently checks watch"
      ],
      "stakes": "Social standing and financial security",
      "evidence_sensitivity": [
        "Elevator usage logs",
        "Dinner seating arrangements"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Christopher Skelton",
      "age_range": "35-45",
      "role_archetype": "Suspect",
      "relationships": [
        "Crew member, engine room",
        "Disliked by victim for being outspoken"
      ],
      "public_persona": "Hardworking and reserved crew engineer",
      "private_secret": "Held grudge against victim for interference",
      "motive_seed": "Silencing a troublesome passenger",
      "motive_strength": "moderate",
      "alibi_window": "Claimed in engine room from quarter past nine to half past ten",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Crew-only passages",
        "Knowledge of mechanical delays and ship operations"
      ],
      "behavioral_tells": [
        "Avoids social interactions",
        "Often seen repairing latch mechanism"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [
        "Engine room logs",
        "Ship maintenance records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Alice Turnbull",
      "age_range": "28-38",
      "role_archetype": "Detective",
      "relationships": [
        "Friend of Julie Waldron",
        "Observer of crew and passenger interactions"
      ],
      "public_persona": "Sharp-minded passenger and amateur detective",
      "private_secret": "Sensitive to social nuances and mechanical details",
      "motive_seed": "N/A",
      "motive_strength": "N/A",
      "alibi_window": "Present throughout investigation",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to most passenger and crew areas",
        "Interaction with all suspects"
      ],
      "behavioral_tells": [
        "Notices small details others miss",
        "Calm and analytical"
      ],
      "stakes": "Desire to uncover truth and maintain order",
      "evidence_sensitivity": [
        "All passenger and crew records",
        "Victim's cabin clues"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Frank Barlow"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "A mysterious murder aboard a transatlantic ocean liner during a spring crossing. The victim, a passenger whose secrets threatened several others, was found dead in a locked cabin on deck seven. The cabin door's brass latch was still engaged, suggesting no entry after death. The suspects' alibis, shipboard timetables, and environmental factors like tidal pressure and temperature changes interplay to mislead the timeline. Detective Alice Turnbull uncovers a complex mechanism involving thermal expansion delaying the latch release, exposing the real murder time and revealing Frank Barlow as the culprit."
    },
    "accepted_facts": [
      "Victim found dead in locked cabin on deck seven",
      "Brass latch on cabin door was engaged when found",
      "Victim's time of death estimated between quarter past ten and quarter to eleven",
      "Shipboard tide chart pinned in victim's cabin",
      "Bulkhead thermometer on deck seven showed sudden temperature drop at approx. quarter past ten",
      "Hull inspection records note expansion and contraction of hull affecting latch",
      "Passengers and crew have varying alibis and known locations",
      "Victim had secrets threatening multiple suspects"
    ],
    "inferred_conclusions": [
      "Latch engagement delayed by thermal expansion due to tidal pressure",
      "Murder occurred earlier than apparent from door latch state",
      "Only Frank Barlow’s alibi contradicts the corrected timeline",
      "Murderer timed killing to exploit mechanical delay and false timeline"
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The victim was murdered shortly before quarter past ten, but the brass latch on the cabin door, affected by thermal expansion from seawater pressure at deck seven, remained engaged until the tide pressure dropped later. This physical delay created an illusion that no one entered after the estimated time of death, giving a false temporal alibi. The murderer exploited knowledge of the tide timings and hull temperature changes to stage the crime.",
      "delivery_path": [
        {
          "step": "Murder timed to occur just before tide pressure peak around quarter past ten"
        },
        {
          "step": "Victim's cabin door latch remains engaged due to brass thermal expansion and hull compression"
        },
        {
          "step": "Latch only releases after sudden temperature drop as tide subsides, after quarter to eleven"
        },
        {
          "step": "Suspects’ alibis and witness statements based on apparent door status and victim death timing"
        },
        {
          "step": "Detective correlates tide chart, thermometer drop, and hull expansion records to reveal true murder time"
        }
      ]
    },
    "outcome": {
      "result": "The physical law of thermal expansion combined with tidal pressure delays the latch release, misleading the timeline and allowing the culprit Frank Barlow to fabricate an alibi. Detecting this mechanism exposes his guilt."
    }
  },
  "false_assumption": {
    "statement": "The locked cabin door’s engaged latch proves no one entered after the victim’s estimated time of death.",
    "type": "temporal",
    "why_it_seems_reasonable": "The latch was physically engaged when the door was forced open, suggesting it was locked and undisturbed after death, so the murder must have occurred before the last known entry.",
    "what_it_hides": "The latch’s engagement was delayed by thermal expansion caused by tidal water pressure on the hull, so the door could have been opened and the murder committed later than assumed."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Victim’s estimated time of death between quarter past ten and quarter to eleven",
        "Deck seven bulkhead thermometer sudden temperature drop at quarter past ten",
        "Shipboard tide pressure peaks at quarter past ten to quarter to eleven"
      ],
      "windows": [
        "Suspects’ alibis from quarter to ten to half past ten",
        "Latch release delay window due to thermal expansion from quarter past ten to quarter to eleven"
      ],
      "contradictions": [
        "Latch engagement (door locked) vs. victim death time",
        "Suspects’ presence on different decks vs. transit times",
        "Hull temperature drop timing vs. latch release"
      ]
    },
    "access": {
      "actors": [
        "Frank Barlow",
        "Norman Lynton",
        "Julie Waldron",
        "Christopher Skelton",
        "Crew members"
      ],
      "objects": [
        "Victim's cabin door latch",
        "Shipboard tide chart",
        "Deck seven bulkhead thermometer",
        "Hull inspection records"
      ],
      "permissions": [
        "Passenger corridor access",
        "Crew corridor access",
        "Restricted deck access"
      ]
    },
    "physical": {
      "laws": [
        "Thermal expansion of brass latch delays mechanical release",
        "Seawater tidal pressure affects hull compression and temperature",
        "Temperature affects physical dimensions of ship components"
      ],
      "traces": [
        "Bluish patina on brass latch from seawater exposure",
        "Sudden temperature drop recorded on deck seven bulkhead thermometer",
        "Hull expansion and contraction logs"
      ]
    },
    "social": {
      "trust_channels": [
        "Shipboard crew reporting",
        "Passenger witness statements",
        "Crew maintenance logs"
      ],
      "authority_sources": [
        "Ship captain's security protocols",
        "Restricted area access permissions",
        "Crew and passenger manifest records"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The victim’s cabin door latch is made of brass showing a slight bluish patina from seawater exposure.",
        "correction": "Brass thermal expansion due to seawater pressure can delay latch release, meaning the door could have been opened earlier but latch remained engaged.",
        "effect": "Narrows timing window for murder to before latch release delay; eliminates suspects claiming presence after latch release.",
        "required_evidence": [
          "Victim's cabin door latch material and patina observed at crime scene",
          "Hull inspection records noting expansion and contraction measurements",
          "Shipboard tide chart pinned in victim's cabin"
        ],
        "reader_observable": true
      },
      {
        "observation": "Deck seven bulkhead thermometer recorded a sudden temperature drop at quarter past ten.",
        "correction": "Temperature drop correlates with tidal pressure subsiding, triggering brass latch contraction and release after murder time.",
        "effect": "Narrows latch release to after quarter past ten; eliminates suspects claiming presence after this time as alibi contradicts corrected death time.",
        "required_evidence": [
          "Deck seven bulkhead thermometer logs",
          "Shipboard tide chart indicating tidal heights and timings",
          "Victim’s estimated time of death between quarter past ten and quarter to eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "Passenger and crew alibis place Frank Barlow near victim’s deck between quarter past ten and half past ten.",
        "correction": "If the victim died earlier than latch release suggests, Frank Barlow’s alibi is contradicted by physical evidence, implicating him.",
        "effect": "Eliminates Norman Lynton, Julie Waldron, and Christopher Skelton based on their alibis; focuses suspicion on Frank Barlow.",
        "required_evidence": [
          "Frank Barlow's alibi statements and witness testimonies",
          "Victim’s estimated time of death from medical report",
          "Latch release delay inferred from physical evidence"
        ],
        "reader_observable": true
      },
      {
        "observation": "Hull expansion and contraction logs confirm mechanical delay in latch release timed with tidal pressure changes.",
        "correction": "Physical law confirms temporal false assumption about door latch engagement status, validating corrected murder timeline.",
        "effect": "Confirms that the murder was committed before quarter past ten, contradicting original timeline and Frank Barlow’s alibi.",
        "required_evidence": [
          "Hull inspection records",
          "Shipboard tide chart",
          "Victim’s medical death time estimate"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "reenactment",
    "design": "A controlled reenactment is conducted using a replica brass latch and deck seven temperature and tidal pressure conditions to demonstrate the thermal expansion delay in latch release, proving the door could be opened earlier than its engaged state suggests, invalidating Frank Barlow’s alibi.",
    "knowledge_revealed": "The physical delay in latch release caused by tidal pressure and temperature changes falsifies the timeline assumed from the engaged latch, exposing Frank Barlow's presence at the true murder time.",
    "pass_condition": "Reenactment proves latch remains engaged despite door opening before the previously assumed murder time, invalidating alibi and confirming guilt.",
    "evidence_clues": [
      "clue_11",
      "clue_2",
      "clue_core_contradiction_chain"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The brass latch’s patina and hull inspection records reveal thermal expansion delaying latch release, challenging the locked-door assumption. Step 2: The deck seven thermometer’s sudden temperature drop aligns with tide pressure changes, timing latch release after the murder. Step 3: Frank Barlow’s alibi conflicts with the corrected timeline, eliminating other suspects by their verified whereabouts. Step 4: Hull expansion logs confirm the physical mechanism, allowing the reader to deduce the true time of murder and culprit. The reenactment test uses only previously revealed evidence to prove the physical delay and expose Frank Barlow’s guilt."
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
        "Execute reenactment of latch opening under simulated tidal and temperature conditions",
        "Observe latch engagement despite door opening before assumed murder time",
        "Draw conclusion invalidating locked-door time assumption and confirming Frank Barlow's guilt"
      ],
      "test_type": "reenactment"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Norman Lynton",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Verified smoking room attendance logs and witness statements",
        "supporting_clues": [
          "Smoking room attendance logs",
          "Witness testimonies"
        ]
      },
      {
        "suspect_name": "Julie Waldron",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Elevator usage logs and dinner seating arrangement confirmation",
        "supporting_clues": [
          "Elevator usage logs",
          "Dinner seating arrangements"
        ]
      },
      {
        "suspect_name": "Christopher Skelton",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Engine room logs confirming presence during murder time",
        "supporting_clues": [
          "Engine room logs"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of thermal expansion latch delay and alibi contradiction"
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
        "clue_id": "clue_14",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_culprit_direct_frank_barlow",
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
    "name": "Frank Barlow",
    "summary": "A charismatic shipping magnate masking financial desperation beneath his confident exterior.",
    "publicPersona": "Frank Barlow commands attention wherever he goes—a man who built his empire on charm and shrewd business acumen. Onboard, he is the undisputed king of the social scene, effortlessly navigating high society with a wit as sharp as his tailored suits. His booming laugh and commanding presence make him a natural leader, respected and envied in equal measure.",
    "privateSecret": "Beneath the veneer of success, Frank's empire teeters on the brink. His post-war investments have faltered disastrously, leaving him clinging to the hope of securing a critical shipping contract. The victim’s threats to expose the rigged nature of this contract have pushed Frank into a corner—desperation clawing at his pride and sanity.",
    "motiveSeed": "With ruin waiting at the doorstep, the prospect of losing the contract—and the ensuing scandal—made murder seem not only a temptation but a necessary evil to protect his empire and social standing.",
    "motiveStrength": "moderate",
    "alibiWindow": "Frank was seen holding court in the first-class lounge between 8:00 PM and 9:30 PM, though a brief, unaccounted-for absence around 8:45 PM raises eyebrows.",
    "accessPlausibility": "easy",
    "stakes": "His financial empire and social prestige hang in the balance, threatening a catastrophic fall from grace.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Frank speaks with measured confidence, often punctuating his statements with a dry, self-aware wit. His sentences are polished, occasionally laced with ironic understatement, as if daring others to see beyond the surface.",
    "internalConflict": "Frank wrestles with the shame of his failing empire and the moral abyss he teeters on—whether to cling to his public facade or confess and face ruin, fearing that the truth might destroy not just his fortune but his very identity.",
    "personalStakeInCase": "This murder is a crucible for Frank, where his survival depends on silencing threats to his legacy and salvaging a reputation he has spent decades crafting.",
    "paragraphs": [
      "Frank Barlow’s entrance into any room was akin to a rising tide—inevitable, commanding, and impossible to ignore. His charisma was not merely natural but a carefully honed instrument, wielded to charm investors and society alike. On the ship, he was the magnet around which conversations swirled, the man whose smile promised opportunity and whose glance could unsettle rivals. Yet beneath this polished exterior lay a man increasingly haunted by shadows of failure, his confident stride masking a heart pounding with anxiety.",
      "The post-war world had not been kind to Frank’s ventures. Risky investments, once the hallmark of his daring spirit, now threatened to drown him in debt. The lucrative contract linked to the victim was his last lifeline, a slender thread keeping his empire intact. When whispers of the contract’s rigging surfaced, and the victim hinted at exposing the truth, Frank’s desperation grew palpable. The gentlemanly facade began to crack, revealing flashes of panic and steely resolve that unsettled those who thought they knew him.",
      "Though he maintained an alibi in the bustling first-class lounge, a brief gap at 8:45 PM left room for suspicion. It was in these stolen moments that Frank’s darker impulses stirred—the possibility that eliminating the threat could restore order to his crumbling world. Yet, even as he contemplated such extremes, his mind wrestled with the consequences, aware that one misstep could topple not only his fortune but the very foundations of his identity.",
      "Frank’s relationship with the crew and passengers was a delicate dance. To some, he was a patron and protector; to others, a ruthless titan whose ambitions cast long shadows. His dealings with Alice Turnbull, the head stewardess, hinted at alliances forged in secrecy and mutual need, further complicating the web of loyalties aboard the ship. Each conversation, each glance, carried the weight of unspoken bargains and concealed fears.",
      "In the quiet moments away from prying eyes, Frank’s internal battle unfolded—a man torn between the need to preserve his empire and the creeping dread of losing everything. The murder investigation was more than a threat; it was a reckoning. Would he emerge redeemed or be swallowed by the tide of his own making? Only time would tell, but the stakes could not be higher."
    ],
    "order": 1
  },
  {
    "name": "Norman Lynton",
    "summary": "Ambitious communications officer entangled in romance and career-threatening secrets.",
    "publicPersona": "Norman Lynton embodies the eager, polite officer striving to ascend the social ladder. His demeanor is impeccable—courteous, attentive, and ever mindful of the expectations placed upon him by the ship’s elite. To passengers, he is the consummate professional, blending humility with a palpable hunger for recognition.",
    "privateSecret": "Behind this polished exterior lurks a man caught in a web of passion and peril. His clandestine affair with Julie Waldron threatens to unravel his carefully constructed ambitions, a secret that could jeopardize both his career and standing among the aristocracy he so desperately wishes to join.",
    "motiveSeed": "The victim’s knowledge of Norman’s affair with Julie posed a dire threat—exposure would not only end his chance for promotion but also shatter his romantic aspirations, driving him toward drastic measures to protect his future.",
    "motiveStrength": "moderate",
    "alibiWindow": "Norman claimed his presence in the radio room from 8:30 PM to 9:15 PM; however, a ten-minute gap without witnesses leaves his exact whereabouts tantalizingly uncertain.",
    "accessPlausibility": "possible",
    "stakes": "His career trajectory and the fragile romance he nurtures hang precariously in the balance.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Norman’s speech is precise and measured, often peppered with self-effacing observations about class and ambition. He favors polite turns of phrase and sometimes betrays nervousness by repeating key points or softening statements with tentative qualifiers.",
    "internalConflict": "Norman battles the tension between his yearning for social elevation and the genuine affection he feels for Julie, fearful that either pursuit might destroy the other and leave him isolated.",
    "personalStakeInCase": "This case threatens not just Norman’s professional future but the very heart of his personal life, making the stakes profoundly intimate and urgent.",
    "paragraphs": [
      "Norman Lynton moves through the ship’s corridors with the practiced ease of a man who knows his place but dares to dream beyond it. As communications officer, his role is vital yet invisible—he is the unseen thread connecting the vessel to the wider world. His ambitions, however, extend far beyond the radio room; Norman craves recognition and acceptance from the social elite he serves, a yearning that shapes every interaction.",
      "His affair with Julie Waldron is both a balm and a burden. The secrecy required to maintain it fuels a constant undercurrent of anxiety, especially given Julie’s simultaneous entanglement with Frank Barlow. Norman’s dual desires—to climb the social ladder and to protect his romantic relationship—pull him in conflicting directions, leaving him vulnerable and desperate.",
      "The victim’s threat to reveal Norman’s liaison with Julie loomed like a specter over his every move. Exposure would not only end his chances of promotion but irreparably damage his reputation among the passengers and crew. Faced with this, Norman’s resolve wavered; the possibility of silencing the threat grew increasingly compelling, despite the moral cost.",
      "His alibi, centered on the radio room, is shaky. While he claims to have been occupied from 8:30 PM to 9:15 PM, a mysterious ten-minute window remains unaccounted for, inviting suspicion. This gap, combined with his motive and access, places Norman firmly under the investigator’s gaze.",
      "Norman’s inner turmoil is palpable. He is a man caught between worlds—the disciplined structure of the ship’s crew and the glittering allure of high society. His voice, usually steady, sometimes falters when speaking of his hopes and fears, revealing a vulnerability beneath his polished exterior. The unfolding investigation threatens to unravel not only his career but the fragile threads of his heart."
    ],
    "order": 2
  },
  {
    "name": "Julie Waldron",
    "summary": "Charming aspiring actress whose manipulations mask a desperate climb up the social ladder.",
    "publicPersona": "Julie Waldron dazzles the ship’s wealthy passengers with her vivacity and charm, playing the role of the hopeful starlet with practiced ease. Her laughter is infectious, her presence magnetic, and her dreams of stardom fuel her every calculated move among the elite.",
    "privateSecret": "Beneath the glamour lies a woman entangled in a web of deceit—secretly involved with Norman Lynton while emotionally entwined with Frank Barlow, using both men as stepping stones in her relentless social ascent.",
    "motiveSeed": "The victim’s knowledge of Julie’s multiple affairs and manipulations threatened to expose her carefully constructed façade, risking the destruction of her ambitions and social standing, pushing her toward desperate measures.",
    "motiveStrength": "moderate",
    "alibiWindow": "Julie was reportedly engaged in theater rehearsals from 8:00 PM to 9:00 PM, yet she vanished unobserved for approximately fifteen minutes, a gap ripe for suspicion.",
    "accessPlausibility": "possible",
    "stakes": "Her dreams of social ascendance and romantic influence are on the line, fragile and fiercely protected.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Julie’s speech sparkles with wit and subtle barbs, her tone often laced with a playful yet cutting edge. She employs flattery artfully while never hesitating to undercut a rival with a well-placed, seemingly innocent comment.",
    "internalConflict": "Julie is torn between the allure of genuine affection and the cold calculus of ambition, struggling to reconcile her desires with the consequences of her manipulations.",
    "personalStakeInCase": "The murder threatens to shatter the fragile world she has built on charm and deception, forcing Julie to confront the cost of her social climbing.",
    "paragraphs": [
      "Julie Waldron moves with the grace of a performer born for the spotlight, her every gesture choreographed to captivate and enchant. To the wealthy passengers, she is the embodiment of youthful promise and irresistible charm, a starlet in waiting whose dreams shimmer as brightly as the ocean beneath the ship. Yet her smiles conceal a mind always calculating, always adjusting to the shifting tides of opportunity.",
      "Her secret liaisons with both Norman Lynton and Frank Barlow form a precarious triangle, each relationship serving a purpose in her grand design. With Norman, she nurtures a tender, if complicated, romance; with Frank, a connection that offers power and influence. Balancing these entanglements demands a finesse born of desperation and ambition.",
      "The victim’s threat to expose Julie’s affairs was a dagger poised to sever her ascent. Faced with the prospect of social ruin, she toyed with the idea of silencing the threat, aware that such a step would forever alter her path. Her disappearance from rehearsal for fifteen unaccounted minutes provides a shadowy window into her possible involvement, a secret she guards fiercely.",
      "Julie’s humor is a weapon as much as a shield. Her conversations sparkle with polite savagery—compliments that sting, jokes that cut just beneath the surface. This wit masks a vulnerability, a woman grappling with the cost of her ambitions and the loneliness they breed. Her voice carries the tension of someone perpetually balancing on a knife’s edge.",
      "As the investigation unfolds, Julie faces a reckoning. The carefully constructed illusion of charm and control threatens to crumble, demanding choices that pit love against ambition and truth against survival. The tides of fate are shifting, and Julie must decide whether to sink beneath them or learn to navigate their treacherous currents."
    ],
    "order": 3
  },
  {
    "name": "Christopher Skelton",
    "summary": "Disgraced naval officer nursing grudges and seeking to reclaim lost honor through bitter resolve.",
    "publicPersona": "Christopher Skelton is a man weathered by time and disappointment. His gruff demeanor and reserved nature mark him as a relic of a bygone era—a retired naval officer who once commanded respect but now watches the world change with bitter eyes. Among the social elite, he is an outsider, resentful of their ascendancy and the fading of his own stature.",
    "privateSecret": "His animosity toward Frank Barlow runs deep, fueled by past betrayals and a history marred by violent outbursts. This simmering resentment colors his every action and thought, driving him toward drastic measures to reclaim what he believes was stolen.",
    "motiveSeed": "Convinced that the victim was conspiring with Frank to ruin him financially and socially, Christopher saw murder as the only means to restore his honor and survival.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claimed solitary walks on the lower deck between 8:15 PM and 9:00 PM, but the absence of witnesses renders his movements suspiciously opaque.",
    "accessPlausibility": "possible",
    "stakes": "His personal honor and financial survival, fragile threads tethering him to a world slipping away.",
    "humourStyle": "blunt",
    "humourLevel": 0.2,
    "speechMannerisms": "Christopher’s speech is terse and direct, often delivered with a dry, biting tone. He favors short sentences and rarely indulges in pleasantries, his words carrying the weight of a man who has little patience for frivolity.",
    "internalConflict": "He wrestles with bitterness and a desire for redemption, torn between the temptation of violent revenge and the hope for a quieter dignity.",
    "personalStakeInCase": "The murder investigation is a battleground for Christopher’s soul, where the possibility of reclaiming lost honor clashes with the risk of further disgrace.",
    "paragraphs": [
      "Christopher Skelton carries the weight of his past like a shroud, his presence aboard the ship marked by a quiet intensity that unsettles those around him. Once a naval officer of distinction, he now finds himself adrift in a world that no longer values the old codes of honor he cherishes. His gruff exterior conceals a man deeply wounded by betrayal and loss.",
      "His relationship with Frank Barlow is fraught with enmity. Past business dealings left scars—scars that fester with each passing day. Christopher’s history of violent outbursts is whispered among the crew and passengers, painting him as a man capable of dangerous extremes. The victim’s alleged conspiracy with Frank to ruin him only deepened his resolve to fight back by any means necessary.",
      "Christopher’s alibi is as solitary as his nature. Claiming to have walked the lower deck alone during the critical window, he offers no witnesses to confirm his story. This opacity fuels suspicion, casting a shadow over his intentions and movements during the murder.",
      "His humor is sparse but pointed, often manifesting as blunt remarks that cut through pretense. He speaks with the economy of a man who values truth over comfort, unwilling to spare feelings in the pursuit of clarity. This bluntness both alienates and commands respect.",
      "Beneath his bitterness lies a man caught between revenge and redemption. The investigation forces Christopher to confront the possibility that his quest for justice may lead him down a darker path, one that risks consuming the very dignity he seeks to restore. His fate hangs in the balance, poised between the tides of vengeance and honor."
    ],
    "order": 4
  },
  {
    "name": "Alice Turnbull",
    "summary": "Efficient head stewardess balancing loyalty and ambition amid secret entanglements.",
    "publicPersona": "Alice Turnbull is the embodiment of calm efficiency aboard the ship. As head stewardess, she commands respect through quiet competence and a steady hand, maintaining order among crew and passengers with a demeanor that is both approachable and authoritative. Her presence reassures as much as it commands.",
    "privateSecret": "Her covert affair with Frank Barlow and intimate knowledge of his financial woes place her in a precarious position. Skilled at manipulating circumstances to her advantage, Alice navigates the ship’s social currents with subtlety and strategic foresight.",
    "motiveSeed": "The victim’s potential to expose her affair with Frank and their joint schemes threatened not only her job security but her social standing, making the prospect of eliminating the threat a tempting, if dangerous, option.",
    "motiveStrength": "moderate",
    "alibiWindow": "Alice was seen diligently coordinating crew duties in the galley from 8:00 PM to 9:30 PM, though she briefly left her post for about ten minutes near the victim’s cabin, a critical window.",
    "accessPlausibility": "possible",
    "stakes": "Her career and future social leverage depend on maintaining secrecy and control, stakes that could not be higher.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Alice speaks with a practical, no-nonsense tone, often punctuated by dry, self-deprecating remarks that reveal a wry awareness of her own ambitions and limitations. She favors clear, concise language and rarely indulges in sentimentality.",
    "internalConflict": "Alice grapples with the tension between loyalty to Frank and her own ambitions, fearing that exposure would shatter both her career and carefully guarded social standing.",
    "personalStakeInCase": "The unfolding murder threatens to unravel the delicate balance Alice maintains, forcing her to confront the moral cost of her choices and the precariousness of her position.",
    "paragraphs": [
      "Alice Turnbull moves through the ship’s corridors with the assured grace of one accustomed to command without spectacle. As head stewardess, her role is to ensure the smooth functioning of daily life aboard, a task she undertakes with a quiet diligence that earns her respect from crew and passengers alike. Her calm demeanor masks a sharp mind always alert to shifting dynamics.",
      "Her affair with Frank Barlow is a carefully kept secret, known only to a select few. This liaison offers her a glimpse into a world of influence and power, a stark contrast to her origins and the rigid hierarchy she navigates daily. Yet with knowledge comes risk; Frank’s financial troubles and the threat posed by the victim place Alice in a precarious position, balancing loyalty with self-preservation.",
      "On the night of the murder, Alice was seen orchestrating crew duties in the galley area, a role demanding constant attention. However, her brief departure for about ten minutes near the victim’s cabin provides a tantalizing opportunity for involvement. This window, though small, cannot be overlooked in the investigation.",
      "Alice’s humor is understated and self-reflective, often revealing a wry acceptance of the ironies inherent in her position. She deflects tension with dry remarks that hint at her ambition and the compromises she has made, never allowing sentimentality to cloud her judgment.",
      "Internally, Alice battles the pull between ambition and loyalty. The murder investigation threatens to expose not only her affair but also the intricate web of schemes she and Frank have woven. The stakes could not be higher; failure would mean not just dismissal but social disgrace. Her choices in the coming days will define her future, testing the limits of her resolve and cunning."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "SS Ocean Sovereign",
    "type": "Ocean liner (Passenger liner)",
    "place": "Southampton to New York",
    "country": "England / United States",
    "summary": "A grand post-war transatlantic passenger liner navigating the cool Atlantic spring, marked by strict class divisions and confined social spaces, where a murder unfolds amid polite tensions.",
    "visualDescription": "The SS Ocean Sovereign looms large with its gleaming white-painted hull and polished brass fittings. Multiple decks rise tiered above the waterline, each delineated by wrought iron railings and varnished teak promenades. Narrow companionways and stairwells snake between class-segregated cabins, while the bridge’s steel-framed windows offer panoramic views of the endless sea. The funnel emits a steady plume of smoke, and lifeboats hang ready in davits along the upper decks.",
    "atmosphere": "The liner exudes an air of restrained elegance, with the murmur of polite conversations overlaying the hum of steam engines and distant foghorns. The confined spaces and scheduled daily routines sharpen the tension beneath the surface civility.",
    "paragraphs": [
      "The SS Ocean Sovereign, a proud symbol of post-war recovery, sails the storied route from Southampton to New York. Its decks are a microcosm of 1940s society, where passengers cluster by class in their appointed quarters: First Class with plush lounges and formal dining saloons; Second Class with comfortable but modest cabins; and Third Class with spartan accommodations below decks. The ship’s layout is a labyrinth of narrow corridors and stairwells, creating natural choke points where chance encounters and furtive glances occur.",
      "Fog patches drift in from the Atlantic, softening the horizon and dampening the sounds of the sea. The ship’s early radar blinks quietly on the bridge, aiding navigation through the grey expanse. Radio operators tap out telegrams and weather reports, their manual typewriters clicking steadily in cramped cabins. Crew members move with disciplined efficiency, their uniforms crisp, maintaining the rigid order that preserves the social hierarchy onboard.",
      "The atmosphere is a blend of post-war optimism and underlying unease. Women now serve as radio operators and stewardesses, reflecting social shifts, while gentlemen in tailored suits and ladies in elegant dresses mask their anxieties behind courteous smiles. The subtle social tensions simmer beneath the polished veneer, heightened by the isolation of the ocean voyage and the confined quarters shared by strangers.",
      "As the ship traverses the cool Atlantic, the scent of salt air mingles with polished wood, pipe tobacco, and the faint aroma of formal dinners being prepared below decks. The steady rhythm of the engines and the occasional foghorn punctuate the days and nights, while the Atlantic’s vastness isolates the passengers and crew alike, making every shadow and whispered conversation a potential clue in the unfolding mystery."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "cool Atlantic breeze with occasional fog patches typical for spring crossings",
    "timeFlow": "Five days of mounting tension during the ocean crossing",
    "mood": "cozy yet tense, marked by polite social interactions overlaying subtle post-war anxieties and rigid class distinctions",
    "eraMarkers": [
      "Radio telegraphy between ship and shore",
      "Early radar navigation and collision avoidance",
      "Manual typewriters and telegram communication",
      "Steam-powered engines with wartime fuel rationing",
      "Strict class-segregated passenger accommodations",
      "Increased female workforce aboard as radio operators and stewardesses"
    ],
    "sensoryPalette": {
      "dominant": "salt-laden sea air",
      "secondary": [
        "polished teak and brass fittings",
        "faint pipe tobacco smoke",
        "clacking of manual typewriters"
      ]
    },
    "paragraphs": [
      "The cool Atlantic breeze carries the unmistakable tang of salt and seaweed, mingling with the rich scents of varnished teak decks and burnished brass. Occasional fog drifts close, softening the ship’s outlines and muffling the creaks of timber and steel. The hum of the steam engines underpins the constant rhythm of the voyage, while distant foghorns echo faintly across the waves. Within the passenger areas, the muted clatter of china and silverware, the scratch of pen on paper, and the low murmur of refined conversation create a cocoon of genteel order amid the vast ocean isolation.",
      "Time aboard the Ocean Sovereign seems both measured and elastic—minutes marked by the ticking of mantel clocks in the lounges, hours by the scheduled meals and deck promenades. The ship’s early radar and radio equipment add a faint electrical buzz to the background, reminders of modern technology’s uneasy coexistence with tradition. Social rituals and class boundaries dictate movement and interaction, intensifying the subtle tensions that simmer beneath the surface of polite smiles and measured words."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Atlantic Ocean - Crime Site",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "Vast, cold expanse of grey-blue sea under a low-hanging sky; occasional fog banks drifting close; faint outlines of ship’s hull and lifeboats visible at deck level.",
      "sensoryDetails": {
        "sights": [
          "grey Atlantic waves",
          "fog-shrouded horizon",
          "glinting steel lifeboat davits",
          "overcast sky with muted light",
          "rolling swells under cloud cover"
        ],
        "sounds": [
          "lapping sea against hull",
          "distant foghorn blasts",
          "steady chug of steam engines",
          "wind-whistled rigging",
          "water dripping from deck railings"
        ],
        "smells": [
          "briny salt air",
          "cool damp sea spray",
          "faint diesel and coal smoke",
          "wet wood and metal",
          "fresh ocean mist"
        ],
        "tactile": [
          "chill Atlantic breeze on skin",
          "slick wet deck planks",
          "cold metal railings",
          "spray of sea mist",
          "uneven rolling ship motion"
        ]
      },
      "accessControl": "Accessible only to crew on deck and passengers during allowed promenade times; restricted during fog or night for safety; emergency access prioritized.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked deck surfaces",
            "grey light through fog",
            "water pooling in deck crevices"
          ],
          "sounds": [
            "steady rain on metal surfaces",
            "water dripping from rigging",
            "muffled sea waves"
          ],
          "smells": [
            "fresh rain on salt air",
            "damp wood",
            "cool wet metal"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter sea surface",
            "fog patches drifting low",
            "shadowless deck areas"
          ],
          "sounds": [
            "distant foghorn calls",
            "soft wind over waves",
            "creaking ship timbers"
          ],
          "smells": [
            "brine and wet wood",
            "faint coal smoke",
            "moist seaweed"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "pale sunset glow on waves",
            "long ship shadows on deck",
            "starry sky above ocean"
          ],
          "sounds": [
            "gentle sea swell",
            "distant ship whistle",
            "quiet footsteps on deck"
          ],
          "smells": [
            "cool salt breeze",
            "warm wood smoke from galley",
            "faint tobacco smoke"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The crime scene lies on the open deck under the vast Atlantic sky, where the cold sea air bites and fog drifts in unpredictable patches. The ship’s metal rails glisten with salt spray, and the steady rhythm of the engines thrums beneath the feet of those who dare to linger outside the confines of their cabins. Visibility is limited, and the rolling motion of the vessel adds a disorienting element, complicating any investigation.",
        "Isolation is absolute; the endless ocean surrounds the ship, cutting off immediate external help. The foghorn’s mournful blasts punctuate the silence, while the scent of salt and coal smoke hangs heavy. The deck’s narrow walkways and lifeboat davits create natural concealment spots, making the crime scene a challenging space for uncovering clues."
      ]
    },
    {
      "id": "first_class_dining_saloon",
      "name": "First Class Dining Saloon",
      "type": "interior",
      "purpose": "Gathering space and social interactions",
      "visualDetails": "A grand room with polished mahogany paneling, crystal chandeliers casting warm light over white linen-draped tables. Large portholes reveal glimpses of the grey ocean outside. Ornate silverware and fine china set each place with precision.",
      "sensoryDetails": {
        "sights": [
          "gleaming mahogany panels",
          "crystal chandelier prisms",
          "white linen tablecloths",
          "silver cutlery glinting",
          "ocean views through portholes"
        ],
        "sounds": [
          "soft clinking of glasses",
          "murmur of refined conversation",
          "quiet footsteps on carpet",
          "silverware brushing plates",
          "distant ship engine hum"
        ],
        "smells": [
          "rich roast meats",
          "fresh baked bread",
          "polished wood polish",
          "faint perfume",
          "burnt candle wax"
        ],
        "tactile": [
          "smooth polished chair arms",
          "cool crystal glass stems",
          "crisp linen napkins",
          "warm radiators underfoot",
          "heavy silverware weight"
        ]
      },
      "accessControl": "Restricted to First Class passengers during meal times; crew serve and clear promptly; closed off after dinner hours for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on porthole glass",
            "muted daylight through curtains",
            "gleam on polished wood"
          ],
          "sounds": [
            "soft rain tapping glass",
            "quiet conversation murmurs",
            "chairs scraping lightly"
          ],
          "smells": [
            "fresh brewed coffee",
            "warm buttered toast",
            "damp wood polish"
          ],
          "mood": "calm and reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light through portholes",
            "shadows pooling in corners",
            "polished surfaces dulled"
          ],
          "sounds": [
            "low murmur of voices",
            "silverware softly clinking",
            "footsteps on carpet"
          ],
          "smells": [
            "roast beef aroma",
            "faint wood polish",
            "candle wax"
          ],
          "mood": "quiet tension beneath civility"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candle flames flickering",
            "reflections on crystal glass"
          ],
          "sounds": [
            "soft laughter",
            "clinking glasses",
            "quiet ship engine hum"
          ],
          "smells": [
            "rich wine bouquet",
            "burning beeswax candles",
            "perfume and pipe smoke"
          ],
          "mood": "elegant yet charged"
        }
      ],
      "paragraphs": [
        "The First Class Dining Saloon is the social heart of the upper decks, where guests gather nightly beneath glittering chandeliers to dine on sumptuous meals. The polished mahogany and fine linens create an atmosphere of refined luxury, but beneath the surface, conversations hint at post-war anxieties and shifting social orders. The portholes frame the endless, grey sea, a constant reminder of their isolation.",
        "Access here is tightly controlled; only First Class passengers and serving staff enter, ensuring an exclusive environment. The space’s acoustics carry whispers and laughter alike, while the faint hum of the ship’s engines underpins every moment. The saloon’s elegant appointments and carefully maintained order contrast sharply with the simmering tensions that occasionally bubble to the surface."
      ]
    },
    {
      "id": "bridge",
      "name": "Ship’s Bridge",
      "type": "interior",
      "purpose": "Navigation and command center",
      "visualDetails": "A compact, steel-framed room with large windows offering panoramic views of the sea. Early radar screens and navigation instruments line the consoles. The captain’s chair sits centrally, flanked by officers’ stations with maps and logbooks spread out.",
      "sensoryDetails": {
        "sights": [
          "blinking radar screens",
          "gleaming brass instruments",
          "charts and logbooks",
          "steel-framed panoramic windows",
          "flickering oil lamp glow"
        ],
        "sounds": [
          "steady ticking of clocks",
          "radio operator’s Morse code tapping",
          "murmured officer commands",
          "engine hum filtered through walls",
          "steady scratch of pen on paper"
        ],
        "smells": [
          "oiled machinery",
          "fresh ink on paper",
          "leather-bound logbooks",
          "metal and sea air",
          "faint tobacco smoke"
        ],
        "tactile": [
          "cool brass railings",
          "smooth wooden desk surface",
          "leather chair armrests",
          "pressed paper pages",
          "cold steel window frames"
        ]
      },
      "accessControl": "Restricted to captain, officers, and authorized crew; locked when not in use; monitored by ship’s security.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "dim light on instruments",
            "grey sea beyond glass"
          ],
          "sounds": [
            "steady rain patter",
            "radio Morse code tapping",
            "soft officer murmurs"
          ],
          "smells": [
            "damp metal",
            "fresh ink",
            "sea salt"
          ],
          "mood": "focused vigilance"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light through windows",
            "glowing radar screens",
            "shadowed corners"
          ],
          "sounds": [
            "quiet engine hum",
            "pen scratching on logbook",
            "low officer voices"
          ],
          "smells": [
            "machine oil",
            "leather bindings",
            "sea air"
          ],
          "mood": "tense concentration"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "star-filled sky beyond glass",
            "soft instrument lights",
            "reflections on polished brass"
          ],
          "sounds": [
            "radio static",
            "quiet command voices",
            "steady ticking clocks"
          ],
          "smells": [
            "tobacco smoke",
            "ink and paper",
            "cool sea air"
          ],
          "mood": "quiet alertness"
        }
      ],
      "paragraphs": [
        "The bridge is the nerve center of the SS Ocean Sovereign, a compact space dominated by steel and glass. Officers move with quiet precision amid the hum of early radar equipment and the steady tapping of radio Morse code. Panoramic windows frame the vast ocean, allowing vigilant watch over the ship’s course and any approaching hazards.",
        "Access is tightly restricted to senior crew, emphasizing the command hierarchy aboard. The room’s atmosphere is one of focused concentration, where the weight of responsibility for passenger safety and navigation is palpable. The scent of oiled machinery and fresh ink mingles with the briny sea air, underscoring the blend of human effort and technology at the heart of the voyage."
      ]
    },
    {
      "id": "crew_quarters",
      "name": "Crew Quarters",
      "type": "interior",
      "purpose": "Living and resting space for crew members",
      "visualDetails": "A series of narrow, functional cabins below decks with metal-framed bunk beds, small portholes, and shared washbasins. Walls are painted a utilitarian grey, with personal effects tucked into lockers and shelves.",
      "sensoryDetails": {
        "sights": [
          "metal bunk beds",
          "small porthole windows",
          "stacked suitcases and trunks",
          "dim overhead lighting",
          "painted grey bulkheads"
        ],
        "sounds": [
          "quiet snoring",
          "rustling fabric",
          "distant engine thrum",
          "clinking of keys and tools",
          "murmured crew conversations"
        ],
        "smells": [
          "soap and starch",
          "oil and grease",
          "stale sweat",
          "damp fabric",
          "wood polish residue"
        ],
        "tactile": [
          "rough cotton blankets",
          "cool metal bedframes",
          "smooth wooden lockers",
          "hard wooden floorboards",
          "chilly sea air through portholes"
        ]
      },
      "accessControl": "Restricted to crew members; secured from passenger access; entry controlled by senior crew; quiet hours enforced.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "damp bulkhead corners",
            "grey light through portholes",
            "shadows on bunk beds"
          ],
          "sounds": [
            "rain tapping metal roof",
            "soft breathing",
            "distant engine noise"
          ],
          "smells": [
            "wet fabric",
            "soap and starch",
            "oil residue"
          ],
          "mood": "quiet fatigue"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light through portholes",
            "shadows in corners",
            "neatly stacked belongings"
          ],
          "sounds": [
            "soft murmurs",
            "clinking keys",
            "engine hum"
          ],
          "smells": [
            "stale sweat",
            "wood polish",
            "oil and grease"
          ],
          "mood": "weary routine"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm lamp glow",
            "shadows cast by bunks",
            "tidy personal effects"
          ],
          "sounds": [
            "quiet conversations",
            "soft footsteps",
            "distant ship whistle"
          ],
          "smells": [
            "soap and starch",
            "faint tobacco smoke",
            "cool sea air"
          ],
          "mood": "restful respite"
        }
      ],
      "paragraphs": [
        "The crew quarters lie below decks, a utilitarian space of narrow cabins and metal bunks where the ship’s workers find brief respite from their duties. The air is tinged with soap, oil, and the faint musk of long hours on shift. Personal effects are neatly stowed amid the functional grey walls, reflecting the disciplined routine of life at sea.",
        "Access is tightly controlled, with passengers barred entry and quiet hours strictly enforced. The space hums with the distant drone of engines and occasional murmurs between crew, fostering both camaraderie and the weight of collective responsibility. The quarters’ cramped layout and sparse furnishings underscore the physical and social divisions aboard the Ocean Sovereign."
      ]
    }
  ],
  "note": "",
  "cost": 0.0063113100000000005,
  "durationMs": 47160
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "May",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "cool Atlantic breeze typical for spring transatlantic crossings",
      "morning fog patches rolling over the sea surface",
      "temperate days with occasional overcast skies and light showers"
    ],
    "daylight": "Lengthening daylight hours with sunset around 8:30 PM, allowing passengers extended evening activities on deck",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner service in the first-class dining saloon",
    "holidays": [
      "May Day observed in some European ports",
      "Mother's Day celebrated by American passengers on second Sunday of May"
    ],
    "seasonalActivities": [
      "deck promenades to enjoy spring air and ocean vistas",
      "afternoon tea gatherings in the ship’s lounge",
      "bridge games and card tournaments among first-class passengers"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits in navy or charcoal with wide lapels",
        "crisp white dress shirts with starched collars",
        "silk neckties featuring geometric or subtle floral patterns"
      ],
      "casual": [
        "cotton and linen sport jackets with patch pockets",
        "high-waisted pleated trousers in light grey or tan",
        "soft-collared open-neck shirts in pastel shades"
      ],
      "accessories": [
        "fedora hats with ribbon bands",
        "leather gloves and pocket watches",
        "polished oxford dress shoes"
      ]
    },
    "womensWear": {
      "formal": [
        "structured day dresses with nipped waists and mid-calf hems",
        "tailored suit ensembles with pencil skirts and matching jackets",
        "silk scarves and gloves for evening occasions"
      ],
      "casual": [
        "cotton shirtwaist dresses in floral prints",
        "cardigans and light trench coats suitable for cooler decks",
        "berets or small brim hats with veils"
      ],
      "accessories": [
        "pearl necklaces and clip earrings",
        "leather handbags with metal clasps",
        "seamed stockings and T-strap heels"
      ]
    },
    "trendsOfTheMoment": [
      "emphasis on hourglass silhouettes for women with padded shoulders and cinched waists",
      "men favoring broad-shouldered suits influenced by wartime military styles",
      "increasing popularity of pastel colors and floral motifs in spring fashion"
    ],
    "socialExpectations": [
      "men expected to wear hats and gloves in public spaces aboard ship",
      "women required to wear modest dresses and maintain polished appearance in dining and lounging areas",
      "strict etiquette observed during meals and social gatherings emphasizing class distinctions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Berlin Blockade ongoing, intensifying Cold War tensions across Europe",
      "Israel declared independence in May 1948, leading to immediate regional conflict",
      "Marshall Plan aid continues to reshape Western Europe's post-war recovery"
    ],
    "politicalClimate": "Heightened global tension with emerging Cold War dynamics influencing diplomatic conversations aboard international vessels",
    "economicConditions": "Gradual post-war economic recovery with rationing easing but still present in some commodities, reflecting cautious consumer optimism",
    "socialIssues": [
      "women adjusting to a peacetime workforce while facing traditional domestic expectations",
      "racial segregation still enforced in many Western societies, though early civil rights movements gaining attention",
      "class distinctions remain rigid, especially visible in travel accommodations and social events on ocean liners"
    ],
    "internationalNews": [
      "United Nations debates over the situation in Palestine",
      "Truce talks in the Chinese Civil War capturing global interest"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Frank Sinatra - 'Nature Boy'",
        "The Glenn Miller Orchestra - 'Pennsylvania 6-5000'",
        "Doris Day - 'Love Somebody'"
      ],
      "films": [
        "‘The Red Shoes’ (1948) acclaimed for its artistry and color cinematography",
        "‘The Treasure of the Sierra Madre’ (1948) noted for its film noir elements",
        "‘Johnny Belinda’ (1948) known for its social drama"
      ],
      "theater": [
        "‘Mister Roberts’ touring on Broadway",
        "‘Born Yesterday’ popular for its social commentary",
        "‘Death of a Salesman’ in previews, soon to become a landmark"
      ],
      "radio": [
        "‘The Jack Benny Program’ providing comic relief",
        "‘Lux Radio Theatre’ adapting popular films for audiences",
        "‘The Shadow’ thrilling listeners with suspense"
      ]
    },
    "literature": {
      "recentPublications": [
        "‘The Naked and the Dead’ by Norman Mailer (1948)",
        "‘Cry, the Beloved Country’ by Alan Paton (1948)",
        "‘The Big Sleep’ by Raymond Chandler (reprinted and popular in late 1940s)"
      ],
      "popularGenres": [
        "hard-boiled detective fiction",
        "post-war social realism",
        "modernist poetry and plays"
      ]
    },
    "technology": {
      "recentInventions": [
        "Early commercial use of radar on ships for navigation",
        "Introduction of the transistor nearing, though not yet in consumer devices",
        "Development of commercial jet engines underway"
      ],
      "commonDevices": [
        "radio receivers for music and news broadcasts",
        "manual typewriters for correspondence and logs",
        "steam-powered ship engines with emerging diesel auxiliaries"
      ],
      "emergingTrends": [
        "increasing reliance on radio for ship-to-shore communication",
        "improvements in shipboard radar enhancing safety",
        "growing interest in portable recording devices for radio shows"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Dinner in the first-class dining saloon: five to seven dollars per person",
        "Cigarettes pack: twenty-five cents",
        "Postage for telegrams: approximately seventy-five cents per word"
      ],
      "commonActivities": [
        "attending shipboard lectures on post-war geopolitics",
        "playing shuffleboard and deck games",
        "engaging in afternoon bridge tournaments"
      ],
      "socialRituals": [
        "formal after-dinner cocktails in the first-class lounge",
        "daily newspaper readings delivered to cabins"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "First-class passengers strictly separated from lower classes by access and privilege",
      "Crew members expected to maintain deference and professionalism, reinforcing social hierarchies"
    ],
    "gender": [
      "Women balancing traditional domestic roles with increased employment opportunities post-war",
      "Men viewed as primary decision-makers and financial providers",
      "Strict dress codes reinforcing gender roles in public and private ship spaces"
    ],
    "race": [
      "Racial segregation and discrimination prevalent, particularly in American and British contexts",
      "Non-white crew members often relegated to lower-status positions with limited interaction with elite passengers"
    ],
    "generalNorms": [
      "Politeness and reserved behavior expected in social interactions",
      "Smoking permitted in designated areas, with etiquette around manners",
      "Discretion about personal matters, especially scandals, enforced by social codes"
    ]
  },
  "atmosphericDetails": [
    "The faint scent of salt and seaweed mingling with the polished wood and cigar smoke in the first-class lounge",
    "Soft murmur of radio broadcasts blending with the creak of ship timbers and distant foghorns",
    "Evenings tinged with a cool dampness from Atlantic mists rolling over the decks, wrapped in thick wool shawls and whispered conversations"
  ],
  "paragraphs": [
    "May 1948 aboard a transatlantic ocean liner is a time when the world is cautiously stepping into a new era. The cool Atlantic breezes and fog patches typical of spring crossings contribute to a sense of isolation and suspense, perfect for a mystery unfolding amidst the ship’s rigid social order. Passengers, layered in their post-war finery, seek comfort in the familiar rituals of deck promenades and afternoon teas, while the shadow of international tensions—from the Berlin Blockade to the nascent Israeli conflict—filters through hushed conversations and radio broadcasts in the first-class lounge.",
    "Fashion aboard the liner reflects the era’s duality of elegance and wartime practicality. Men favor structured double-breasted suits with wide lapels, silk ties, and fedoras, while women wear sharply tailored dresses emphasizing the hourglass figure, accessorized with pearls and gloves. The strict etiquette aboard ship demands polished appearances and measured manners, reinforcing class distinctions and gender roles that feel increasingly out of step with the social changes underway on land. The atmosphere balances cozy refinement with an undercurrent of tension, as passengers navigate their personal dramas amid the transatlantic voyage.",
    "Daily life aboard the ship is defined by ritual and routine, from formal dinners costing several dollars a head to bridge games and lectures on the evolving geopolitical landscape. Radios hum with popular music by Frank Sinatra and the Glenn Miller Orchestra, while films like 'The Red Shoes' captivate those who gather in the onboard cinema. Yet beneath the veneer of civilized leisure, social attitudes remain conservative—racial segregation persists among crew and passengers, and strict class hierarchies dictate access and interaction. This setting of polished surfaces and concealed anxieties sets a compelling stage for a tide-timed murder that disrupts the fragile order."
  ],
  "note": "",
  "cost": 0.0032615150000000004,
  "durationMs": 42246
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A diverse group of passengers and crew aboard a strict class-segregated transatlantic liner navigate post-war social tensions and rigid etiquette while isolated at sea, creating a pressure-cooker environment for secrets and alliances.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Clear class hierarchy among passengers and crew, with post-war shifts including more women in the workforce, all under strict social protocols and etiquette shaping interactions."
  },
  "setting": {
    "location": "Transatlantic passenger liner crossing the North Atlantic",
    "institution": "Ocean liner (Passenger liner)",
    "weather": "Cool Atlantic breeze with occasional fog patches typical for spring crossings"
  },
  "castAnchors": [
    "Frank Barlow",
    "Norman Lynton",
    "Julie Waldron",
    "Christopher Skelton",
    "Alice Turnbull"
  ],
  "theme": "A classic murder mystery unfolding within a confined, socially stratified setting where polite facades mask deeper anxieties and secrets."
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
    "id": "deck_level",
    "value": "seven",
    "description": "The deck number where the latch mechanism and tide effect occur"
  },
  {
    "id": "temperature_drop",
    "value": "eight degrees Fahrenheit",
    "description": "The recent temperature drop recorded by the bulkhead thermometer"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "spatial",
      "description": "The victim’s cabin door latch is made of brass showing a slight bluish patina from seawater exposure, indicating prolonged contact with the marine environment.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The victim’s cabin latch material and seawater effect",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "spatial",
      "description": "Brass thermal expansion due to seawater pressure can delay latch release, meaning the door could have been opened earlier but the latch remained engaged due to material properties.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Brass thermal expansion delays latch release",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The victim was murdered shortly before quarter past ten, but the brass latch on the cabin door, affected by thermal expansion from seawater pressure, did not release until later, masking the true time of entry.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "Core mechanism of murder timing and latch delay",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "Deck seven bulkhead thermometer recorded a sudden temperature drop at quarter past ten, marking a key environmental change on the ship.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Temperature drop timing on deck seven",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The temperature drop correlates with tidal pressure subsiding, triggering brass latch contraction and releasing the door latch later than the victim’s time of death, overturning the assumption that latch engagement equals time of death.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Temperature and tidal pressure effect on latch timing",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Passenger and crew alibis place Frank Barlow near the victim’s deck between quarter past ten and half past ten, providing a critical temporal window for opportunity.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Frank Barlow’s presence near victim’s deck during relevant time",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "If the victim died earlier than latch release suggests, Frank Barlow’s alibi is contradicted by physical evidence of the victim’s time of death, undermining his stated timeline.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Contradiction of Frank Barlow’s alibi by victim’s earlier death",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "Hull expansion and contraction logs confirm mechanical delay in latch release timed with tidal pressure changes, supporting the delayed latch release theory.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "Hull logs confirming mechanical latch delay",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "Physical law confirms the temporal false assumption about door latch engagement status, validating the correlation between latch release and tidal pressure rather than time of death.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Physical law validating latch timing correction",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "spatial",
      "description": "Brass thermal expansion due to seawater pressure can delay latch release, meaning the door could have been opened earlier but latch remained engaged, overturning the initial assumption that the locked latch proved no entry after death.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "Explicit overturning of false assumption on latch engagement",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_11",
      "category": "temporal",
      "description": "A controlled reenactment is conducted using a replica brass latch and deck seven temperature and tidal pressure data, demonstrating the latch’s delayed release mechanism under real conditions.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Experimental confirmation of latch delay mechanism",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "temporal",
      "description": "Frank Barlow is uniquely linked to the victim’s murder shortly before quarter past ten by his presence near the victim’s deck and knowledge of tidal schedules, distinguishing him from other suspects.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[0]",
      "pointsTo": "Frank Barlow’s unique opportunity and knowledge linking him to murder",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_13",
      "category": "behavioral",
      "description": "Visible evidence of Frank Barlow’s premeditation is found in his efforts to avoid blackmail, indicating motive and planning before the murder.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[1]",
      "pointsTo": "Frank Barlow’s blackmail avoidance as motive",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_14",
      "category": "testimonial",
      "description": "Eliminates Norman Lynton because smoking room attendance logs and crew corridor access records place him away from the victim’s deck during the murder window.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Norman Lynton’s alibi excludes him as suspect",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_15",
      "category": "testimonial",
      "description": "Eliminates Julie Waldron because elevator usage logs and dinner seating arrangements confirm her presence far from the victim’s deck during the critical time.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Julie Waldron’s alibi excludes her as suspect",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_16",
      "category": "testimonial",
      "description": "Eliminates Christopher Skelton because engine room logs and ship maintenance records verify his continuous presence away from the victim’s deck during the murder period.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Christopher Skelton’s alibi excludes him as suspect",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Norman Lynton because smoking room attendance logs and crew corridor access records place him away from the victim’s deck during the murder window, narrowing the solution toward Frank Barlow.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Norman Lynton excluded, focusing suspicion on Frank Barlow",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_frank_barlow",
      "category": "temporal",
      "description": "Direct evidence ties Frank Barlow to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Frank Barlow had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Victim’s estimated time of death between quarter past ten and quarter to eleven remains a late texture detail in the case background.",
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
      "description": "The locked cabin door’s cabin locked is noted as proof that no one entered the victim’s cabin after his death, as the locked was found firmly secured with no signs of tampering.",
      "supportsAssumption": "Locked cabin door’s engaged latch proves no entry after death",
      "misdirection": "This misleads by ignoring material effects on locked timing, focusing solely on locked locked doors."
    },
    {
      "id": "rh_2",
      "description": "Crew statements emphasize that the victim’s cabin door was locked and undisturbed throughout the night, reinforcing the belief that the murder must have occurred before the door was secured.",
      "supportsAssumption": "Locked cabin door’s engaged latch proves no entry after death",
      "misdirection": "This misleads by relying on testimony without considering entered environmental factors affecting proves victims."
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
      "clue_14",
      "clue_15",
      "clue_16",
      "clue_core_elimination_chain",
      "clue_culprit_direct_frank_barlow"
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
  "latencyMs": 30102,
  "cost": 0.005063505
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
