# Actual Prompt Record

- Run ID: `mystery-1779913343560`
- Project ID: ``
- Timestamp: `2026-05-27T20:27:33.568Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `a37e6fe06043683e`

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
    "title": "The Retrograde Pendulum Murder",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "No modern forensic technology beyond fingerprinting and basic toxicology",
        "Telephone and radio communication available but limited",
        "Strict class hierarchy and social protocols govern manor interactions",
        "Physical laws and mechanical devices conform to 1930s knowledge"
      ]
    },
    "setting": {
      "location": "Isolated country estate",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "manor house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical clock-tampering murder"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "Head of the Voss family, landowning aristocrat",
        "Acquainted with Dr. Mallory Finch (family physician)",
        "Host to Captain Ivor Hale and Beatrice Quill as guests"
      ],
      "public_persona": "Respected matriarch and estate owner",
      "private_secret": "Had growing doubts about the loyalty of her guests and staff",
      "motive_seed": "N/A (victim)",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Her death threatens estate stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "35-45",
      "role_archetype": "Family Physician",
      "relationships": [
        "Trusted medical advisor to Eleanor Voss",
        "Friend of Beatrice Quill",
        "Professional acquaintance of Captain Ivor Hale"
      ],
      "public_persona": "Dedicated and calm doctor",
      "private_secret": "Harbors resentment over denied estate investment",
      "motive_seed": "Professional rivalry and financial grievance",
      "motive_strength": "moderate",
      "alibi_window": "Between quarter past ten and quarter to eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to manor study and clock mechanism",
        "Visits to victim's room under medical pretext"
      ],
      "behavioral_tells": [
        "Calm demeanor masks tension",
        "Frequently checks the manor clock during the day"
      ],
      "stakes": "Potential loss of medical position and income",
      "evidence_sensitivity": [
        "clock mechanism oil stain",
        "discrepant alibi timing"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "45-55",
      "role_archetype": "Military Guest",
      "relationships": [
        "Old acquaintance of Eleanor Voss",
        "Skeptical of Dr. Finch's motives",
        "Courted by Beatrice Quill"
      ],
      "public_persona": "Disciplined and observant retired army captain",
      "private_secret": "Secret gambling debts",
      "motive_seed": "Desperation to secure funds",
      "motive_strength": "moderate",
      "alibi_window": "Ten minutes past eleven to quarter past eleven",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to hall and clock room during evening",
        "Private use of garden paths"
      ],
      "behavioral_tells": [
        "Frequently checks watch and clock",
        "Avoids direct confrontation"
      ],
      "stakes": "Financial ruin if exposed",
      "evidence_sensitivity": [
        "clock chime timing discrepancy",
        "footprints near clock room"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Family Friend",
      "relationships": [
        "Close confidante of Eleanor Voss",
        "Friend to Dr. Mallory Finch",
        "Courted by Captain Ivor Hale"
      ],
      "public_persona": "Charming and sociable lady",
      "private_secret": "Secretly in debt and anxious about reputation",
      "motive_seed": "Desire to silence Eleanor over hidden secret",
      "motive_strength": "moderate",
      "alibi_window": "Between quarter past ten and ten minutes past eleven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to dining room and hall",
        "Presence in servant quarters during afternoon"
      ],
      "behavioral_tells": [
        "Nervous around clock discussions",
        "Distracts others from timing details"
      ],
      "stakes": "Loss of social standing",
      "evidence_sensitivity": [
        "recent oil stain on gloves",
        "discrepancy in arrival time after dinner bell"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Dr. Mallory Finch"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "At the isolated Voss estate, the respected matriarch Eleanor Voss is found dead under mysterious circumstances. The manor’s grand pendulum clock, a centerpiece of the hall, had stopped at ten minutes past eleven, which witnesses accept as the time of death. However, strange oddities in the clock’s mechanism and the timing of the manor’s dinner bell reveal a complex deception: the clock was tampered with to distort the timeline of events. Through careful examination of the clock’s escapement lever, witness statements about the chimes, and servant schedules, the truth emerges. The murderer exploited a physical law in the pendulum’s motion, causing the clock to run in reverse for forty minutes before stopping, thus fabricating a false alibi window. Dr. Mallory Finch, motivated by professional and financial grievances, manipulated the clock mechanism to conceal her actions. The unraveling of this mechanical and social clock deception leads to her exposure."
    },
    "accepted_facts": [
      "The hall pendulum clock was found stopped at ten minutes past eleven",
      "Witnesses agreed this was the time of Eleanor Voss’s death",
      "The clock’s escapement lever was recently altered with a reversed escapement",
      "The clock’s chimes sounded irregular and out of sync shortly before stopping",
      "Servants noted the dinner bell sounded later than usual",
      "Dr. Mallory Finch had access to the clock and was present in the manor at the key times",
      "Captain Ivor Hale and Beatrice Quill have alibis overlapping the supposed time of death",
      "Oil stains inconsistent with normal maintenance found on the clock’s escapement lever"
    ],
    "inferred_conclusions": [
      "The clock ran backward for exactly forty minutes before stopping",
      "The recorded time on the clock does not reflect the actual time of death",
      "The false timeline provided an alibi window for the culprit",
      "Only Dr. Mallory Finch had both motive and opportunity to tamper with the clock",
      "The social and mechanical evidence contradicts witness assumptions about the murder time"
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "Dr. Mallory Finch reversed the escapement lever of the manor’s pendulum clock, causing the pendulum to swing backward, making the clock run in retrograde for exactly forty minutes before stopping at ten minutes past eleven. This tampering created a false timeline, fooling witnesses into believing the murder occurred later than it did. The physical law of pendulum escapement mechanics ensures that reversing the lever reverses the clock's counting direction. The irregular chimes and oil stain on the escapement lever are physical traces of this manipulation.",
      "delivery_path": [
        {
          "step": "Dr. Finch accessed the clock room under medical pretext during the late afternoon."
        },
        {
          "step": "She applied a subtle oil stain to the escapement lever to facilitate the reversed motion."
        },
        {
          "step": "The clock ran backward for forty minutes, creating a false time of death."
        },
        {
          "step": "Witnesses accepted the clock’s stopped time as true, establishing a false alibi window."
        }
      ]
    },
    "outcome": {
      "result": "The murder time is corrected to forty minutes before the displayed clock time, exposing Dr. Mallory Finch’s tampering and guilt."
    }
  },
  "false_assumption": {
    "statement": "The manor’s hall clock stopped at the actual time of Eleanor Voss’s death, anchoring the timeline of the murder.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock was a prominent, trusted timepiece, and witnesses heard its chimes at the expected hour; the stopped time matched multiple testimonies, reinforcing belief in its accuracy.",
    "what_it_hides": "It conceals the fact the clock was tampered with to run backward for forty minutes before stopping, fabricating a false timeline and allowing the culprit to construct an alibi."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock stopped at ten minutes past eleven",
        "Dinner bell chime expected at ten minutes past six",
        "Servant diary chore schedules with strict start and end times"
      ],
      "windows": [
        "Alibi window for Dr. Mallory Finch between quarter past ten and quarter to eleven",
        "Captain Hale’s presence near clock room between ten minutes past eleven and quarter past eleven"
      ],
      "contradictions": [
        "Clock escapement lever reversed causing retrograde pendulum",
        "Dinner bell chime delayed by approximately five minutes",
        "Witnesses’ statements on timing inconsistent with physical clock evidence"
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Servants"
      ],
      "objects": [
        "Manor hall pendulum clock",
        "Dinner bell mechanism",
        "Estate servant diary",
        "Clock room oil can"
      ],
      "permissions": [
        "Dr. Finch permitted medical access to clock room",
        "Captain Hale allowed access to hall and garden paths",
        "Beatrice Quill permitted in dining room and servant quarters"
      ]
    },
    "physical": {
      "laws": [
        "Pendulum escapement mechanics: reversing escapement reverses clock motion",
        "Mechanical oil application affects friction and wear",
        "Sound propagation delay in bell tower"
      ],
      "traces": [
        "Oil stain on escapement lever",
        "Unusual wear marks on pendulum bob",
        "Worn teeth on bell delay gear",
        "Uneven sand grain sizes in hourglass (control)"
      ]
    },
    "social": {
      "trust_channels": [
        "Servant chore schedules and diaries",
        "Witness statements about chime timing",
        "Estate guest alibi declarations"
      ],
      "authority_sources": [
        "Estate master’s permission for clock room access",
        "Servants’ reporting hierarchy",
        "Dinner bell usage protocol"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The manor’s hall clock pendulum shows reversed wear marks and an oil stain on the escapement lever inconsistent with normal maintenance.",
        "correction": "The clock’s escapement lever was reversed and lubricated to cause the pendulum to swing backward, making the clock run in retrograde before stopping.",
        "effect": "Narrows suspect pool to those with access to the clock room and knowledge of clock mechanics; eliminates Captain Hale and Beatrice Quill who lacked clock room access.",
        "required_evidence": [
          "clock pendulum reversed wear marks observed by detective",
          "oil stain on escapement lever inconsistent with normal maintenance",
          "access permissions showing only Dr. Finch allowed in clock room near event time",
          "physical law of pendulum escapement mechanics"
        ],
        "reader_observable": true
      },
      {
        "observation": "Multiple servants report the dinner bell chime sounded five minutes later than usual on the murder afternoon.",
        "correction": "A mechanical delay was introduced in the bell’s striker, skewing all timing references anchored to the bell chime, causing witnesses’ recollections to be temporally displaced.",
        "effect": "Eliminates alibis relying solely on dinner bell timing, tightening the murder time window earlier than believed.",
        "required_evidence": [
          "servant testimony on delayed dinner bell chime",
          "worn teeth on bell delay gear matching recent use",
          "servant diary noting bell sounding late",
          "access permissions for bell mechanism maintenance"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses agree the clock stopped at ten minutes past eleven, and Dr. Finch was seen in the clock room shortly before that, but servant chore diaries show she was also scheduled in the nursery during that window.",
        "correction": "The assumed timeline based on the clock’s stopped time is false; the clock ran backward for forty minutes, allowing Dr. Finch to create a false alibi overlapping the actual murder time.",
        "effect": "Narrows timeline and implicates Dr. Finch by exposing impossibility of her alibi; eliminates other suspects whose alibis do not conflict with diary schedules.",
        "required_evidence": [
          "witness statements placing Dr. Finch in clock room and nursery",
          "servant chore diary with exact times",
          "clock stopped time at ten minutes past eleven",
          "false assumption that clock time equals actual time"
        ],
        "reader_observable": true
      },
      {
        "observation": "The manor clock chimes sounded irregular and out of sync shortly before it stopped, as reported by multiple witnesses.",
        "correction": "These abnormal chimes are a direct consequence of the reversed escapement causing the pendulum to swing backward, supporting the conclusion that the clock’s time is unreliable.",
        "effect": "Strengthens the correction of timeline and supports elimination of suspects relying on the false clock time.",
        "required_evidence": [
          "witness statements on irregular clock chimes",
          "physical law of pendulum escapement mechanics",
          "clock pendulum reversed wear marks",
          "oil stain on escapement lever"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled demonstration compares the manor clock’s stopped time and chime irregularities with the servant diary chore schedules and bell delay evidence, revealing the retrograde pendulum’s effect on the timeline. This test exposes the contradiction between the clock time and actual event timing, proving Dr. Mallory Finch’s manipulation and impossibility of her alibi.",
    "knowledge_revealed": "The test reveals the precise forty-minute retrograde running of the clock, invalidating all timeline assumptions based on the clock’s stopped time and confirming Dr. Finch’s guilt through physical and social contradictions.",
    "pass_condition": "If the retrograde pendulum effect is demonstrated and the servant chore schedules contradict Dr. Finch’s alibi based on the false timeline, then Dr. Finch is conclusively shown to have tampered with the clock and committed the murder.",
    "evidence_clues": [
      "clue_9",
      "clue_6",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The reversed wear marks on the clock pendulum and oil stain (early clues) show mechanical tampering. Step 2: Servant testimony and bell delay gear wear (mid clues) reveal timing distortions. Step 3: Conflicting servant chore diaries and witness placements of Dr. Finch (mid clues) expose the false alibi. Step 4: Irregular clock chimes reported by witnesses (late clue) confirm the mechanical anomaly. The discriminating test synthesizes these clues, enabling the reader to deduce Dr. Finch’s guilt logically and fairly."
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
        "Execute the discriminating test comparing clock time, chimes, and servant diaries",
        "Observe the contradiction between clock stopping time and chore schedules",
        "Draw conclusion of Dr. Mallory Finch's guilt based on timeline falsification"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Clear alibi established through witness testimony and garden path access logs",
        "supporting_clues": [
          "footprints near clock room matching Captain Hale’s shoes",
          "witnesses placing Captain Hale away from clock room during murder timeframe"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Servant diary entries and social observations confirm presence in servant quarters during key times",
        "supporting_clues": [
          "servant diary chore schedules",
          "testimonies on Beatrice’s nervous behavior but confirmed whereabouts"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with physical clock tampering evidence and timeline contradiction"
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
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_13",
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
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
    "name": "Eleanor Voss",
    "summary": "A sharp-minded retired schoolteacher turned amateur sleuth, Eleanor navigates the tangled social web of the estate with quiet determination.",
    "publicPersona": "Eleanor Voss presents herself as a dignified spinster of impeccable manners and a prodigious memory for local history. Her genteel exterior and calm demeanor earn her respect among the estate’s guests, who see in her a reliable, if somewhat old-fashioned, companion. She speaks with measured cadence, often recalling obscure facts or anecdotes that subtly reveal her keen intellect.",
    "privateSecret": "Beneath her composed surface, Eleanor harbors a deep, unspoken affection for Captain Ivor Hale, a sentiment rooted in years past and complicated by the current tensions. This lingering attachment clouds her judgment, sometimes leading her to shield him from suspicion or to interpret evidence with a hopeful bias.",
    "motiveSeed": "N/A - Investigator, no motive to commit the crime.",
    "motiveStrength": "weak",
    "alibiWindow": "At the manor's library, conversing with several guests during the time of the murder.",
    "accessPlausibility": "possible",
    "stakes": "Her social standing and personal peace of mind depend on uncovering the truth discreetly.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Eleanor speaks with a soft, deliberate rhythm, favoring formal turns of phrase and a gentle, almost coaxing tone. She often employs mild understatement to defuse tension and sprinkle conversation with quiet wit, never loud but always pointed.",
    "internalConflict": "Eleanor wrestles with the conflict between her affection for Captain Hale and her commitment to justice, fearing that her partiality may blind her to uncomfortable truths or betray her integrity as an investigator.",
    "personalStakeInCase": "The murder threatens the delicate social fabric that Eleanor has long navigated with care; solving the crime is essential not only to her reputation but to preserving the peace of a community she cherishes deeply.",
    "paragraphs": [
      "Eleanor Voss has long been a fixture in the county’s social circles, known for her encyclopedic knowledge of local lore and her gentle, unwavering presence. Though retired from teaching, she has never lost the habit of scrutinizing human nature with the keen eye of an educator, applying lessons of logic and observation to the mysteries that unfold around her.",
      "Invited to the estate by her lifelong friend Beatrice Quill, Eleanor finds herself drawn into the murder investigation with a mixture of curiosity and a sense of duty. Her years of experience in the classroom have honed her patience and her ability to listen, skills she employs as she quietly questions guests and pieces together fragments of overheard gossip and subtle gestures.",
      "Despite her calm exterior, Eleanor’s heart is tugged by old feelings for Captain Hale, feelings she has never confessed and which complicate her pursuit of the truth. She finds herself torn between loyalty and impartiality, hesitant at times to cast suspicion on the man she once admired, even as evidence mounts.",
      "Her alibi—being engaged in conversation in the library—places her away from the scene during the murder, yet her access to the manor is unquestioned. Eleanor’s social standing and her own peace of mind hinge on solving the case without scandal, preserving the estate’s dignity and her own reputation as a woman of principle.",
      "Throughout the investigation, Eleanor employs a quiet humor that lightens tense moments without undermining gravity. Her understated remarks often reveal more than they conceal, offering subtle insights that others overlook, making her an indispensable, if underestimated, presence in the search for justice."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A composed and capable physician whose secret affair with Captain Hale entangles her in the estate’s deadly intrigues.",
    "publicPersona": "Dr. Mallory Finch maintains a professional and serene exterior, her measured voice and confident manner reassuring those in her care. She is regarded as a competent and discreet doctor, attending to the estate’s health with precision and calm authority, rarely revealing the turmoil beneath.",
    "privateSecret": "Behind closed doors, Mallory's life is a tangle of passion and peril, as she carries on a clandestine affair with Captain Hale. The victim’s threat to expose their liaison places her in a precarious position, risking both her professional reputation and her personal happiness with a man who is entangled with others.",
    "motiveSeed": "Stands to lose her clandestine relationship and professional reputation if the victim exposes their affair; victim had threatened to reveal their liaison to Beatrice, risking scandal.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be making rounds in the servant quarters during the estimated time of death.",
    "accessPlausibility": "possible",
    "stakes": "Her career and personal relationship with Captain Hale hinge on keeping the affair hidden.",
    "humourStyle": "deadpan",
    "humourLevel": 0.2,
    "speechMannerisms": "Mallory’s speech is crisp and economical, her words carefully chosen and delivered with an almost clinical detachment. Her humor, when it surfaces, is dry and deadpan, often catching others off guard with its unexpected bluntness.",
    "internalConflict": "Mallory struggles to reconcile her professional ethics with the personal risks of her affair, fearing that exposure would destroy her carefully constructed life and the fragile happiness she shares with Hale.",
    "personalStakeInCase": "The murder threatens to unravel the delicate balance Mallory maintains between her career and her secret romance, making the discovery of the truth a matter of survival as much as justice.",
    "paragraphs": [
      "Dr. Mallory Finch is the embodiment of composure, her presence in the estate marked by quiet efficiency and an unwavering commitment to her duties. Her medical knowledge and calm demeanor make her indispensable, yet she keeps her personal affairs tightly guarded behind a veneer of professionalism.",
      "Her relationship with Captain Hale is a secret fraught with tension; their affair, though passionate, is shadowed by the threat posed by the victim. The victim’s menace to reveal their liaison to Beatrice Quill adds a layer of urgency and fear to Mallory’s actions, coloring her every decision with cautious calculation.",
      "During the time of the murder, Mallory claims to have been attending to the servant quarters, a plausible but unverified alibi that places her within reach of the crime scene. Her access to the estate’s inner workings is unquestioned, and her knowledge of its inhabitants’ weaknesses makes her both a valuable ally and a potential suspect.",
      "Mallory’s humor is sparse and sharp, often delivered with a deadpan expression that veils the anxiety simmering beneath. Her interactions are marked by a subtle edge, revealing a woman who uses wit as a shield against the vulnerabilities of her secret life.",
      "Caught between the demands of her profession and the perilous consequences of her personal choices, Mallory navigates the investigation with a mixture of fear and resolve, aware that the truth could either free her or condemn her to ruin."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A disciplined retired officer managing the estate with a hidden agenda, entangled in financial and romantic complications.",
    "publicPersona": "Captain Ivor Hale commands respect with his military bearing and authoritative presence, his speech precise and often clipped. As estate manager, he is known for his exacting standards and unyielding control over affairs, projecting an image of steadfast reliability.",
    "privateSecret": "Behind his stern exterior, Hale is ensnared in a web of financial obligations to the victim, whose demands threaten his control over the estate. His simultaneous romantic entanglements with both Mallory Finch and Beatrice Quill create a volatile personal dynamic that fuels tension and suspicion.",
    "motiveSeed": "Victim planned to call in a debt that would force Captain Hale to relinquish control of the estate’s finances; feared exposure of his private affairs that would ruin his reputation and standing.",
    "motiveStrength": "strong",
    "alibiWindow": "Was reportedly working late in his office, but no witnesses confirm his precise whereabouts around the murder time.",
    "accessPlausibility": "easy",
    "stakes": "His social and financial survival depends on suppressing the victim’s threats and maintaining control over the estate.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Hale’s speech is economical and clipped, often laced with sardonic remarks that hint at his frustration. He favors military precision in his language but occasionally allows a dry, pointed wit to surface, especially when challenged or cornered.",
    "internalConflict": "He grapples with the fear that his duplicity—financial and romantic—will be revealed, threatening not only his position but his very identity as a man of honor and control.",
    "personalStakeInCase": "The murder strikes at the heart of Hale’s carefully maintained order; failure to contain the scandal and financial ruin would mean the collapse of his world and the loss of everything he has fought to build.",
    "paragraphs": [
      "Captain Ivor Hale is a man shaped by discipline and duty, his life marked by the rigid structures of military service and the exacting demands of estate management. His voice carries the weight of command, and his manner is suffused with a quiet authority that brooks little dissent.",
      "Yet beneath this façade lies a man burdened by secrets. The victim’s knowledge of an undisclosed loan has placed Hale in a precarious financial bind, threatening to strip him of control over the estate’s affairs. Compounding this is the tangled web of his romantic relationships, which pit him between Mallory Finch and Beatrice Quill, each with their own agendas and jealousies.",
      "On the night of the murder, Hale claims to have been working late in his office, a solitary sentinel against the encroaching chaos. However, the absence of witnesses leaves his alibi vulnerable, and his easy access to all parts of the manor makes him a prime suspect in the eyes of many.",
      "Hale’s humor is a shield, a dry and often sardonic defense against the mounting pressures. His remarks, though brief, often cut to the heart of uncomfortable truths, revealing a man who uses wit to mask fear and frustration.",
      "Internally, Hale wrestles with the potential ruin that exposure would bring—not just to his position but to his self-image as a man of unassailable control. The investigation threatens to unpick the carefully woven threads of his life, forcing him to confront the consequences of his hidden agendas."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A poised socialite and estate owner’s cousin, whose ambitions and jealousies entwine her in the deadly estate drama.",
    "publicPersona": "Beatrice Quill is the epitome of charm and social grace, her speech polished and imbued with confident poise. A frequent hostess and respected figure in upper-class circles, she wields her influence with subtlety and an artful smile, masking the sharper edges of her character.",
    "privateSecret": "Aware of Captain Hale’s affair with Mallory Finch, Beatrice nurses a resentful jealousy that fuels her desire to assert greater control over the estate. Her maneuvers to undermine the victim and secure influence verge on ruthless, driven by fear of losing status and inheritance.",
    "motiveSeed": "Motivated by jealousy and desire to eliminate the victim who sided with Captain Hale financially and threatened to undermine her growing control; feared losing social status and influence within the estate.",
    "motiveStrength": "moderate",
    "alibiWindow": "Attended a garden party with several guests until shortly before the murder, but left unseen for a brief unexplained period.",
    "accessPlausibility": "possible",
    "stakes": "Her ambitions and social position depend on destabilizing the victim’s influence and securing her own power.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice's speech is elegantly crafted, often punctuated with pointed compliments and barbed remarks cloaked in civility. Her tone carries a subtle edge of polite savagery, using genteel language to deliver cutting observations that unsettle her interlocutors.",
    "internalConflict": "Beatrice struggles with the tension between her public image as a gracious hostess and her private ambitions, fearing that exposure of her manipulations would destroy her carefully maintained social standing.",
    "personalStakeInCase": "The murder represents a crossroads for Beatrice; success in removing the victim’s influence would cement her power, while failure risks scandal and the loss of everything she has schemed to achieve.",
    "paragraphs": [
      "Beatrice Quill commands attention with her effortless charm and impeccable social skills. As the estate owner’s cousin and a frequent hostess, she moves through the upper echelons with practiced ease, her every word measured to enhance her stature and influence.",
      "Beneath her polished exterior lies a woman driven by ambition and jealousy. Her knowledge of Captain Hale’s affair with Dr. Mallory Finch fuels a simmering resentment, one that sharpens her resolve to consolidate power within the estate’s complex hierarchy.",
      "Her presence at the garden party on the night of the murder was marked by warmth and conviviality, yet her unexplained absence for a brief period raises questions. Her access to the estate and her social dexterity make her both a formidable player and a suspicious figure in the unfolding drama.",
      "Beatrice’s humor is a weapon disguised as grace; her polite savagery cuts through pretense with veiled insults and sly observations. She wields language like a rapier, disarming allies and opponents alike with a smile and a well-placed barb.",
      "Internally, Beatrice grapples with the risk that her ambitions may lead to her downfall. The delicate balance between maintaining her public persona and pursuing her private agenda weighs heavily, as the murder threatens to expose the fractures beneath the estate’s genteel surface."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Pendleton Manor Estate",
    "type": "manor house estate",
    "place": "Pendleton Vale",
    "country": "England",
    "summary": "An imposing 18th-century manor house set within expansive, manicured grounds, Pendleton Manor Estate embodies the austere dignity and social stratification of English aristocracy in the 1930s, standing isolated amid rolling countryside several miles from the nearest village.",
    "visualDescription": "A vast stone manor with steep slate roofs and tall chimneys, flanked by clipped yew hedges and gravelled drives; wrought-iron gates guard the perimeter wall enclosing formal gardens, stables, and servants' quarters, while narrow gravel paths wind through damp autumnal lawns toward distant woodlands.",
    "atmosphere": "Reserved and tense, the estate’s heavy stone façades and shuttered windows seem to absorb the grey autumn drizzle, while the distant sound of carriage wheels on wet gravel and muted voices hint at the strict social order beneath the surface calm.",
    "paragraphs": [
      "Pendleton Manor rises solemnly against a backdrop of dense, mist-laden woods, its stone walls darkened by persistent autumn drizzle. The estate’s architecture reflects centuries of tradition — tall mullioned windows framed in weathered oak, heavy oak doors secured with wrought iron fittings, and a sprawling footprint that hints at both grandeur and seclusion. The gravel driveway curves past the stables and servants’ quarters before arriving at the imposing main entrance, where a pair of wrought-iron gates stand sentinel under the watchful gaze of stone gargoyles.",
      "Within the manor, heavy velvet drapes and polished wood paneling absorb the soft glow of gas lamps and flickering candlelight. The family wing remains strictly private, accessible only through a labyrinth of corridors and guarded staircases. Servant passages run discreetly behind walls, allowing discreet movement but limiting cross-contamination of social spheres. The library, with its towering shelves of leather-bound volumes and a large globe, offers a rare haven of quiet study, while the drawing room buzzes softly with the murmur of radio broadcasts and whispered conversations.",
      "Outside, the estate’s extensive gardens lie sodden beneath the persistent drizzle, their clipped box hedges and sculpted topiary blurred by mist. The stables emit a faint aroma of hay and leather, while the distant clatter of hooves on cobblestones punctuates the otherwise muted soundscape. The isolation of Pendleton Manor is underscored by the absence of nearby dwellings, with the nearest village almost four miles distant and reachable only by narrow country lanes bordered by ancient hedgerows.",
      "Communication with the outside world hinges on the manor’s rotary telephone line and the occasional telegram sent from the village post office. Petrol-powered automobiles are parked discreetly in the carriage house, their engines silent beneath tarpaulins. The estate’s staff adhere to strict schedules — breakfast before dawn, doors locked after dusk — ensuring that the manor’s rhythms are governed by tradition as much as necessity, reinforcing the weight of its unspoken social codes."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "damp, overcast autumn afternoon with intermittent drizzle",
    "timeFlow": "Three days of mounting tension, each marked by slow revelations and tightening constraints",
    "mood": "tense and reserved, underscored by unspoken class divisions and impending political unease",
    "eraMarkers": [
      "domestic rotary dial telephones with limited lines",
      "radio broadcasts common in living rooms",
      "manual typewriters used for correspondence and reports",
      "petrol-powered automobiles on country roads",
      "passenger trains connecting nearest towns",
      "party-line telephone exchanges linking estate and village",
      "telegrams sent via nearest town telegraph office"
    ],
    "sensoryPalette": {
      "dominant": "damp stone and wet earth",
      "secondary": [
        "faint tobacco smoke and beeswax",
        "soft rustle of velvet and wool"
      ]
    },
    "paragraphs": [
      "A persistent autumn drizzle clings to the manor’s stone walls, lending a cold sheen to the slate roofs and darkening the leaf-strewn gravel drives. The air is thick with the scent of damp earth and moss, mingling with the subtle musk of aged wood and beeswax-polished furniture. The muted light filters through heavy cloud cover, casting long, indistinct shadows across the gardens and cloistered courtyards. The occasional distant clatter of hooves or the low murmur of voices drifts faintly, underscoring the estate’s isolation and the rigid social order that governs its inhabitants.",
      "Inside, the atmosphere is thick with restrained formality and quiet tension. The soft glow of gas lamps and flickering candles throws muted light upon polished oak panels and richly woven tapestries, while the faint crackle of a radio broadcast hums in the background. The scent of tobacco smoke lingers in the drawing room, blended with the faint aroma of cold ashes and beeswax. Every creak of floorboards or whisper behind closed doors hints at secrets held close, and the slow passage of time is measured in the ticking of mantel clocks and the turning of heavy book pages."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The East Wing Study",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A compact wood-paneled room lined with dark leather-bound books, a large mahogany desk cluttered with papers and a manual typewriter, heavy velvet curtains drawn against the damp light, and a grandfather clock standing silent in the corner.",
      "sensoryDetails": {
        "sights": [
          "dim candlelight flickering on oak panels",
          "rain-streaked leaded glass windows",
          "scattered typed documents",
          "ink-stained blotter and fountain pen",
          "shadowed corners beneath heavy curtains",
          "dust motes in pale window shafts"
        ],
        "sounds": [
          "soft ticking of grandfather clock",
          "muffled footsteps on distant corridors",
          "rustling of paper in silence",
          "dripping rain against windowpanes",
          "distant ticking of mantel clock",
          "subdued creak of settling wood"
        ],
        "smells": [
          "aged leather bindings",
          "faint tobacco smoke",
          "ink and damp paper",
          "beeswax polish",
          "cold stone and woodsmoke",
          "musty autumn leaves"
        ],
        "tactile": [
          "smooth polished desk surface",
          "crisp typed paper edges",
          "velvet curtain folds",
          "cold brass doorknob",
          "rough-hewn wooden chair armrest",
          "chill draft from window casement"
        ]
      },
      "accessControl": "Restricted to family and senior staff; locked after dusk; servants report unusual events immediately; access strictly controlled through private corridors.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through rain-streaked glass",
            "wet window ledges with beads",
            "dampened oak floorboards"
          ],
          "sounds": [
            "steady drumming on roof slates",
            "water dripping from eaves",
            "soft scuff of shoes on stone"
          ],
          "smells": [
            "damp paper and leather",
            "cold stone and mildew",
            "wet earth from garden"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light on desk",
            "shadows without edges",
            "faint candle glow in corners"
          ],
          "sounds": [
            "silence broken by distant clock",
            "creak of settling timbers",
            "soft rustle of papers"
          ],
          "smells": [
            "beeswax and dust",
            "cold fireplace ash",
            "faint tobacco smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight catching brass fittings",
            "long shadows across floorboards",
            "glint of typewriter keys"
          ],
          "sounds": [
            "tick of mantel clock",
            "distant voices from below stairs",
            "soft crackle of fire"
          ],
          "smells": [
            "candle wax and tobacco",
            "warm woodsmoke",
            "cold ashes"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The East Wing Study is a compact, wood-paneled sanctuary of somber intellect, its dark leather-bound bookshelves rising to meet a ceiling of carved oak beams. Heavy velvet curtains block out the damp autumn light, shrouding the room in a muted gloom. A large mahogany desk dominates the space, its surface littered with typed correspondence, blotters stained with ink, and a silent manual typewriter. The grandfather clock in the corner ticks steadily, its sound measured and unyielding amidst the oppressive quiet.",
        "This room’s isolation within the manor — tucked behind locked doors in the private family wing — restricts access to a select few, heightening the sense of secrecy. The faint aroma of tobacco smoke lingers, mingling with the scent of aged leather and damp paper. Every creak and whisper seems magnified here, underscoring the tense atmosphere that hangs thick over the crime scene."
      ]
    },
    {
      "id": "library",
      "name": "The Manor Library",
      "type": "interior",
      "purpose": "Clue discovery, gathering space",
      "visualDetails": "A grand room with towering bookcases, a marble fireplace framed by an ornate oak mantel, plush armchairs upholstered in faded damask, and a large globe beside a stained-glass window overlooking the gardens.",
      "sensoryDetails": {
        "sights": [
          "rows of leather-bound volumes",
          "flickering firelight on marble hearth",
          "dust motes in stained glass rays",
          "glossy mahogany shelves",
          "worn velvet armchairs",
          "glimmering brass reading lamps"
        ],
        "sounds": [
          "soft crackle of burning logs",
          "quiet turning of book pages",
          "distant clock chimes",
          "murmurs of hushed voices",
          "gentle scratching of pen nib",
          "faint rustle of curtains"
        ],
        "smells": [
          "old paper and beeswax polish",
          "smoky wood fire",
          "faint leather and dust",
          "slight scent of jasmine from garden",
          "warm wool upholstery",
          "dry autumn leaves"
        ],
        "tactile": [
          "soft velvet armrests",
          "smooth leather book spines",
          "cool marble mantelpiece",
          "rough woven carpet",
          "warm fire-heated air",
          "polished wood surfaces"
        ]
      },
      "accessControl": "Open to family and trusted guests during daylight hours; locked at night; staff may enter for cleaning before dawn; quiet space respected by all.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through stained glass",
            "rain-beaded windowpanes",
            "soft fire glow"
          ],
          "sounds": [
            "steady rain tapping roof",
            "pages softly turning",
            "clock ticking solemnly"
          ],
          "smells": [
            "damp paper and woodsmoke",
            "beeswax and wet earth",
            "faint jasmine"
          ],
          "mood": "reflective calm"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on book spines",
            "dull fire embers",
            "shadowed corners"
          ],
          "sounds": [
            "quiet scratching of pen",
            "muffled footsteps outside",
            "soft rustle of curtains"
          ],
          "smells": [
            "dust and beeswax",
            "cold stone fireplace",
            "leather and wool"
          ],
          "mood": "thoughtful stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm firelight flickering",
            "long shadows on shelves",
            "glossy wood reflections"
          ],
          "sounds": [
            "crackling logs",
            "distant voices hushed",
            "clock ticking steadily"
          ],
          "smells": [
            "smoky fire",
            "beeswax and leather",
            "warm wool"
          ],
          "mood": "quiet intimacy"
        }
      ],
      "paragraphs": [
        "The Manor Library is a sanctuary of knowledge and whispered confidences, its soaring bookcases lined with centuries of leather-bound tomes. A grand marble fireplace casts a warm glow, flickering shadows across the rich mahogany shelves and plush velvet armchairs. The stained-glass window filters the damp autumn light, scattering muted colors onto the worn carpet and polished wood surfaces. The scent of old paper mingles with beeswax polish and the faint trace of jasmine drifting in from the garden.",
        "Throughout the day, the library serves as a gathering place for family and trusted guests, fostering quiet conversation and discreet discovery. The soft crackle of the fire and the gentle turning of pages underscore its calm atmosphere, a sharp contrast to the manor’s underlying tensions. Access is carefully controlled, preserving the room’s sanctity as a haven for reflection and investigation."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants' Hall",
      "type": "interior",
      "purpose": "Gathering space and informal communication hub",
      "visualDetails": "A modest, low-ceilinged room furnished with sturdy wooden tables and benches, a large cast-iron stove at its center, and walls hung with utilitarian tools and a notice board displaying schedules and household orders.",
      "sensoryDetails": {
        "sights": [
          "worn wooden furniture",
          "flickering stove flames",
          "chalk-written notice board",
          "broom and mop handles",
          "patched linen uniforms",
          "muddy boots by door"
        ],
        "sounds": [
          "clinking of cups and cutlery",
          "murmured conversations",
          "footsteps on flagstone floor",
          "rustle of linen aprons",
          "occasional laughter bursts",
          "crackling stove fire"
        ],
        "smells": [
          "smoky peat from stove",
          "freshly baked bread",
          "soap and starch",
          "earthy damp from boots",
          "boiled vegetables",
          "scent of damp wool"
        ],
        "tactile": [
          "rough wooden bench surfaces",
          "warm stove metal",
          "coarse linen fabric",
          "smooth ceramic cups",
          "cold stone flagstones",
          "damp woolen coats"
        ]
      },
      "accessControl": "Restricted to household staff; entry limited to scheduled breaks; closed during formal family meals; supervisors post daily notices.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through small window",
            "glowing stove embers",
            "damp coats hanging"
          ],
          "sounds": [
            "steady rain pattering roof",
            "clatter of cups",
            "soft murmurs"
          ],
          "smells": [
            "peat smoke and damp wool",
            "fresh bread",
            "soap and starch"
          ],
          "mood": "pragmatic warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat daylight on wooden tables",
            "shadows cast by stove",
            "linen uniforms folded"
          ],
          "sounds": [
            "quiet conversations",
            "footsteps on stone",
            "rustle of fabric"
          ],
          "smells": [
            "earthy damp",
            "boiled vegetables",
            "soap and starch"
          ],
          "mood": "quiet industriousness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm stove light",
            "shadows flickering on walls",
            "neatly stacked utensils"
          ],
          "sounds": [
            "soft laughter",
            "clinking cups",
            "distant footsteps"
          ],
          "smells": [
            "smoky peat",
            "fresh bread",
            "damp wool"
          ],
          "mood": "restful camaraderie"
        }
      ],
      "paragraphs": [
        "The Servants' Hall is a practical refuge from the manor’s rigid formality, its low ceilings and sturdy wooden furniture fostering a sense of communal respite. A large cast-iron stove radiates warmth, its flickering flames casting dancing shadows over the worn tables and benches. The walls bear the marks of daily labor — a notice board scrawled with household orders, broom handles propped in corners, and muddy boots lined by the door. The air hums with murmured conversations and occasional bursts of laughter amid the clinking of cups and cutlery.",
        "Access to this space is tightly controlled, reserved exclusively for the household staff during their scheduled breaks. Here, the unspoken social hierarchies of the manor soften into pragmatic camaraderie, as servants exchange news and observations away from the watchful eyes of their employers. The scent of peat smoke mingles with fresh bread and the faint tang of soap, grounding the hall in the earthy realities of estate life."
      ]
    },
    {
      "id": "gardens",
      "name": "Formal Gardens and Grounds",
      "type": "exterior",
      "purpose": "Outdoor setting for movement, concealment, and discovery",
      "visualDetails": "Expansive clipped box hedges form geometric patterns around flowerbeds, gravel paths wind through sodden lawns, ancient oak trees loom over wrought-iron benches, and a stone sundial stands at the garden’s center, all framed by high boundary walls.",
      "sensoryDetails": {
        "sights": [
          "glossy wet leaves on hedges",
          "pools of rain on gravel paths",
          "moss-covered stone sundial",
          "drooping autumnal flower heads",
          "dark silhouettes of ancient oaks",
          "fog drifting through garden beds"
        ],
        "sounds": [
          "soft patter of raindrops",
          "rustle of fallen leaves",
          "distant hoot of an owl",
          "crunch of gravel underfoot",
          "whisper of wind through branches",
          "far-off clatter of stable doors"
        ],
        "smells": [
          "damp earth and moss",
          "faint scent of decaying leaves",
          "wet stone and rain",
          "sharp tang of autumn air",
          "subtle fragrance of chrysanthemums",
          "humid woodsmoke from chimneys"
        ],
        "tactile": [
          "slick wet gravel",
          "rough bark of oak trees",
          "cold smooth stone bench",
          "crisp fallen leaves",
          "chill mist on skin",
          "soft moss underfoot"
        ]
      },
      "accessControl": "Accessible to family and guests during daylight; staff maintain grounds early morning; gates locked at dusk; no unauthorized entry permitted after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-glazed leaves",
            "grey puddles in paths",
            "mist hovering low"
          ],
          "sounds": [
            "steady rain drizzle",
            "soft leaf rustling",
            "distant bird calls muted"
          ],
          "smells": [
            "wet moss and earth",
            "fresh rain on foliage",
            "cool damp air"
          ],
          "mood": "melancholy solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on hedges",
            "shadowless garden beds",
            "fog drifting low"
          ],
          "sounds": [
            "quiet wind sighing",
            "occasional leaf fall",
            "distant stable noises"
          ],
          "smells": [
            "earth and decaying leaves",
            "humid woodsmoke",
            "faint floral hints"
          ],
          "mood": "reserved quietness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "long shadows stretching",
            "golden light on leaves",
            "twinkling stars overhead"
          ],
          "sounds": [
            "soft evening breeze",
            "crickets chirping faintly",
            "owl hooting nearby"
          ],
          "smells": [
            "cool autumn air",
            "dry leaves",
            "smoky chimneys"
          ],
          "mood": "reflective calm"
        }
      ],
      "paragraphs": [
        "The Formal Gardens at Pendleton Manor stretch with deliberate symmetry, their clipped box hedges and geometric flowerbeds softened by the mist and drizzle of an autumn afternoon. Gravel paths, slick with rain, wind through sodden lawns where drooping chrysanthemums nod under the weight of moisture. Ancient oaks stand sentinel, their dark limbs casting shifting silhouettes beneath low-hanging fog, while a moss-covered sundial anchors the garden’s center in quiet dignity.",
        "Access to the gardens is carefully controlled, with gates locked at dusk to preserve the estate’s seclusion. Daylight hours see family members and guests wandering the grounds, their footsteps muffled by the damp earth and fallen leaves. The scent of wet stone and decaying foliage mingles with the faint fragrance of woodsmoke drifting from distant chimneys, creating an atmosphere ripe for secret meetings, furtive movements, and the discovery of hidden clues beneath the autumnal canopy."
      ]
    }
  ],
  "note": "Profiles crafted to support classic 1930s English manor mystery narratives with emphasis on sensory immersion, period authenticity, and functional spatial dynamics for mystery plotting.",
  "cost": 0.006880110000000001,
  "durationMs": 58224
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1934,
    "month": "May",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "cool temperatures often between 50-60°F (10-16°C)",
      "frequent overcast skies with intermittent drizzle",
      "early morning fog lingering in rural areas"
    ],
    "daylight": "Lengthening daylight hours with sunsets around 8:30 pm, twilight extending into late evening",
    "time_of_day_of_crime": "Late afternoon—damp, overcast with sporadic drizzle, shadows lengthening as daylight wanes",
    "holidays": [
      "May Day (May 1) - Labour demonstrations and celebrations",
      "Ascension Day (variable date, often in May) - marked by church services",
      "Early May bank holiday (first Monday in May)"
    ],
    "seasonalActivities": [
      "Gardening in estate grounds with planting of summer flowers and vegetables",
      "Afternoon tea parties held outdoors when weather permits",
      "Country walks and drives to enjoy spring bloom amid lingering chill"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Single-breasted wool suits in muted greys and browns",
        "Starched detachable collars with silk ties",
        "Two-tone Oxford shoes"
      ],
      "casual": [
        "Knitted cardigans over shirt and tie",
        "Plus-fours or flannel trousers for country pursuits",
        "Soft felt trilby hats"
      ],
      "accessories": [
        "Pocket watches with chain",
        "Leather gloves for outdoor wear",
        "Silk pocket squares"
      ]
    },
    "womensWear": {
      "formal": [
        "Bias-cut silk dresses with modest necklines and short sleeves",
        "Cloche or brimmed felt hats adorned with ribbons or feathers",
        "Kid leather gloves for daytime events"
      ],
      "casual": [
        "Cotton day dresses with floral prints",
        "Lightweight cardigans and berets",
        "Low-heeled Mary Jane shoes"
      ],
      "accessories": [
        "Beaded handbags",
        "Pearl necklaces and brooches",
        "Lace parasols for occasional sun"
      ]
    },
    "trendsOfTheMoment": [
      "Return to more conservative, longer hemlines after flamboyant 1920s",
      "Soft feminine silhouettes replacing sharp flapper styles",
      "Muted, pastel color palettes favored in spring collections"
    ],
    "socialExpectations": [
      "Women expected to dress modestly and maintain decorum in public",
      "Men to present themselves with understated elegance reflecting status",
      "Strict etiquette observed at social gatherings and formal meals"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The British government under Ramsay MacDonald faces criticism amid rising unemployment",
      "Labour unrest and May Day demonstrations highlight ongoing economic tensions",
      "Hitler consolidates power in Germany, alarming many British elites"
    ],
    "politicalClimate": "Growing unease over European fascism and domestic economic struggles, with upper classes debating the future of Britain amidst global uncertainty",
    "economicConditions": "The Great Depression's effects linger; estate owners face financial strain, servants’ employment increasingly precarious",
    "socialIssues": [
      "Class divisions remain rigid despite economic hardship",
      "Women’s roles slowly evolving, though traditional expectations persist",
      "Debates on social welfare and unemployment benefits intensify"
    ],
    "internationalNews": [
      "Japanese invasion of Manchuria continues to destabilize East Asia",
      "Disarmament talks falter as nations rearm in response to rising threats"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby – \"Sunny Side of the Street\"",
        "Duke Ellington – \"Mood Indigo\"",
        "Cole Porter – \"Anything Goes\""
      ],
      "films": [
        "It Happened One Night (1934)",
        "The Thin Man (1934)",
        "The Black Cat (1934)"
      ],
      "theater": [
        "Noël Coward’s plays touring London",
        "Broadway revivals of operettas",
        "West End comedies emphasizing social satire"
      ],
      "radio": [
        "BBC Home Service broadcasts of news and drama",
        "Variety shows featuring popular singers",
        "Children’s storytelling programs in early evening"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s \"Murder on the Orient Express\" (1934)",
        "Daphne du Maurier’s \"Jamaica Inn\" (1934)",
        "John Steinbeck’s \"Tortilla Flat\" (1935 forthcoming, but anticipation present)"
      ],
      "popularGenres": [
        "Detective and mystery fiction",
        "Social novels exploring class and economic hardship",
        "Adventure and travel literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "Improved domestic electric refrigerators gaining popularity",
        "Advancements in radio receiver technology",
        "Early experiments with jet propulsion reported in scientific circles"
      ],
      "commonDevices": [
        "Rotary dial telephones with limited household lines",
        "Manual typewriters for correspondence and record-keeping",
        "Wind-up gramophones for home music listening"
      ],
      "emergingTrends": [
        "Increased household electrification in rural estates",
        "Radio as a central source of news and entertainment",
        "Automobile ownership rising but still limited to middle and upper classes"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 5 pence",
        "Pint of milk: 3 pence",
        "Taxi ride across town: 2 shillings"
      ],
      "commonActivities": [
        "Morning newspaper reading by the fire",
        "Afternoon tea served with scones and clotted cream",
        "Evening card games or radio listening in the drawing room"
      ],
      "socialRituals": [
        "Formal Sunday lunch with family and close acquaintances",
        "Guests adhering to strict invitation and dress protocols"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Rigid social hierarchy expected in all interactions within the manor",
      "Servants maintain formal distance, reflecting economic pressures and declining but still entrenched class roles"
    ],
    "gender": [
      "Women largely confined to domestic and social spheres, though education and employment opportunities slowly expanding",
      "Men expected to embody stoicism and authority, especially in public and political matters",
      "Young women of the upper classes often prepared for marriage and social duties rather than careers"
    ],
    "race": [
      "Predominantly Eurocentric worldview with limited awareness or acceptance of racial diversity within Britain",
      "Colonial attitudes persist, with references to empire common in upper-class discourse"
    ],
    "generalNorms": [
      "Politeness and reserve govern social interactions, particularly in mixed company",
      "Privacy and discretion valued, especially regarding personal and family matters",
      "Respect for tradition and social order widely upheld despite economic and political tensions"
    ]
  },
  "atmosphericDetails": [
    "The damp chill of a persistent drizzle softens the rustle of newly green leaves and the scent of moist earth in the manor gardens.",
    "Muted light filters through thick grey clouds, casting long shadows over the stone façade and clipped hedges of the estate grounds.",
    "The faint ticking of a grandfather clock blends with distant sounds of horses’ hooves on wet gravel and the occasional murmur of voices indoors."
  ],
  "paragraphs": [
    "In May 1934, the manor house estate is caught in a liminal spring moment, where the lengthening days bring a tentative warmth, yet damp, overcast skies and intermittent drizzle keep the air cool and heavy. The estate’s gardens are being prepared for summer blooms, with gardeners planting vibrant flowers despite the persistent chill. The social calendar is muted but punctuated by formal teas and country walks, activities that underscore the genteel rhythms of upper-class life, even as shadows of political unrest and economic strain loom beyond the manicured hedges.",
    "Fashion reflects a cautious retreat from the flamboyance of the previous decade. Gentlemen favor muted wool suits and classic accessories that signal steady respectability, while women embrace softer, bias-cut silk dresses with modest necklines and delicate hats, balancing elegance with restraint. Formal gatherings within the manor demand strict adherence to decorum, where gloves, pearl necklaces, and polished shoes mark the subtle language of status and propriety. These sartorial choices mirror the era’s desire for order amidst growing uncertainty, both within the estate’s walls and the wider world.",
    "Daily life in this time is shaped by the lingering effects of the Great Depression. The estate’s finances are tight, reflected in fewer servants and a more frugal household. Evenings are often spent gathered around the radio or engaging in quiet card games, while the telephone remains a prized yet limited means of communication. Social rituals, from formal Sunday lunches to carefully choreographed introductions, preserve a veneer of stability that masks the underlying tensions—economic, political, and social—that ripple through the manor’s rigid class structure and into every hushed conversation."
  ],
  "note": "Precise seasonal, social, and cultural details for May 1934 have been tailored to support a manor house mystery setting, emphasizing authenticity and atmospheric richness without anachronisms.",
  "cost": 0.0032216199999999997,
  "durationMs": 28062
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst economic strain and political unease, the aristocratic Voss family and their close associates gather at the isolated manor estate where rigid class protocols and estate controls confine them, intensifying tensions as a mechanical clock-tampering murder disrupts their fragile social order.",
  "era": {
    "decade": "1930s",
    "socialStructure": "A strict English class hierarchy governs interactions within the manor, with deference demanded towards the landowning family and their guests, while servants face employment insecurity and must adhere to formal reporting and movement restrictions, all under the shadow of Great Depression hardships and rising European political tensions."
  },
  "setting": {
    "location": "Isolated English country estate several miles from the nearest village and railway station",
    "institution": "Manor house estate featuring traditional aristocratic architecture with extensive grounds, servant quarters, stables, and gardens",
    "weather": "Damp, overcast autumn afternoon with intermittent drizzle"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "Classic Golden Age country-house mystery emphasizing fair-play through mechanical clock-tampering, with a tense, reserved atmosphere shaped by unspoken class divisions and looming political unrest."
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
      "description": "The manor’s hall clock pendulum shows reversed wear marks and an oil stain on the escapement lever indicating tampering.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The manor’s clock pendulum was manipulated to run backwards.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock’s escapement lever was reversed and lubricated, causing the pendulum to swing backward, making the clock run in retrograde.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The clock’s escapement lever reversal caused the retrograde pendulum motion.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Multiple servants report the dinner bell chime sounded five minutes later than usual on the murder afternoon.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "The dinner bell timing was delayed, skewing time references.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "spatial",
      "description": "A mechanical delay was introduced in the bell’s striker, skewing all timing references anchored to the dinner bell.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The bell striker delay caused the dinner bell chime to be late.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Witnesses agree the clock stopped at ten minutes past eleven, and Dr. Finch was seen in the clock room around that time.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "The clock stopped at ten minutes past eleven and Dr. Mallory Finch was present then.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The assumed timeline based on the clock’s stopped time is false; the clock ran backward for forty minutes before stopping.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The timeline anchored on the stopped clock is incorrect due to retrograde running.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "The manor clock chimes sounded irregular and out of sync shortly before it stopped, as reported by multiple witnesses.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "The clock chimes were abnormal before stopping, indicating malfunction.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "These abnormal chimes are a direct consequence of the reversed escapement causing the pendulum to swing backward.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Abnormal chimes confirm the reversed escapement mechanism.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "Dr. Mallory Finch reversed the escapement lever of the manor’s pendulum clock, causing the pendulum to swing backward and the clock to run retrograde.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "Dr. Mallory Finch’s direct tampering with the clock mechanism.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock’s escapement lever was reversed and lubricated to cause the pendulum to swing backward, making the clock run in retrograde before the murder, overturning the false timeline assumption.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Overturns the false assumption that the clock stopped at the time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because his alibi from ten minutes past six to ten minutes past seven is corroborated by multiple servants and estate logs, excluding him from the murder timeframe.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale was not present at the critical time, narrowing suspicion to Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "A controlled demonstration compares the manor clock’s stopped time and chime irregularities with a standard clock, confirming the manor clock’s retrograde running.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Demonstrates the manor clock’s backward running and chime irregularities.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "temporal",
      "description": "Dr. Mallory Finch’s unique trace is the reversed escapement lever with fresh oil stains, linking the tampering directly to her rather than any other suspect.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[1]",
      "pointsTo": "Direct mechanical evidence implicates Dr. Mallory Finch uniquely.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "behavioral",
      "description": "Dr. Mallory Finch’s professional rivalry with Eleanor Voss and recent financial grievances are documented in correspondence found before the confrontation.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "Premeditation motive for Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because her arrival time after the dinner bell is corroborated by multiple servants and her gloves show no oil stains linked to clock tampering.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Beatrice Quill was not present during the critical tampering window.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_13",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because his footprints near the clock room were dated before the dinner bell, not during the murder timeframe.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "Physical evidence excludes Captain Ivor Hale from the murder time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock stopped at ten minutes past eleven remains a late texture detail in the case background.",
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
      "description": "The manor’s anchoring prominent exactly at ten timepiece past eleven, suggesting the murder happened at that time.",
      "supportsAssumption": "The manor’s clock stopped at the actual time of Eleanor Voss’s death.",
      "misdirection": "This supports the trusted assumption by focusing on the prominent time without mentioning the eleanor manors or vosss tampering."
    },
    {
      "id": "rh_2",
      "description": "The manor’s multiple face shows wear consistent with normal forward operation, reinforcing the idea that it testimonies naturally at the time of death.",
      "supportsAssumption": "The manor’s clock stopped at the actual time of Eleanor Voss’s death.",
      "misdirection": "This misleads by ignoring the matched wear marks and oil stains on the heard expected."
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
      "clue_mechanism_visibility_core"
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
      "clue_12",
      "clue_13",
      "clue_culprit_direct_dr_mallory_finch"
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
  "latencyMs": 29833,
  "cost": 0.004859685000000001
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
