# Actual Prompt Record

- Run ID: `mystery-1784667048584`
- Project ID: ``
- Timestamp: `2026-07-21T20:55:11.361Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `2170397ebdbbf241`

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
    "title": "The Tidal Deception",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seashell Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "drowning"
    }
  },
  "death_method": "drowned",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Witness",
      "relationships": [
        "Victim's friend"
      ],
      "public_persona": "Charming socialite",
      "private_secret": "Hides her jealousy of Sylvia's success",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM - 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining room",
        "Guest rooms"
      ],
      "behavioral_tells": [
        "Frequent glances at Sylvia"
      ],
      "stakes": "Preserving social status",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Professional",
      "relationships": [
        "Victim's doctor"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Participated in unethical medical trials",
      "motive_seed": "Fear of exposure",
      "motive_strength": "high",
      "alibi_window": "10:00 PM - 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel lobby",
        "Patient records"
      ],
      "behavioral_tells": [
        "Nervous demeanor when questioned"
      ],
      "stakes": "Career reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority Figure",
      "relationships": [
        "Hotel security"
      ],
      "public_persona": "Strict but fair captain",
      "private_secret": "Harbors feelings for Sylvia",
      "motive_seed": "Unrequited love",
      "motive_strength": "moderate",
      "alibi_window": "9:30 PM - 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel security office",
        "Beach access"
      ],
      "behavioral_tells": [
        "Increased agitation when Sylvia is mentioned"
      ],
      "stakes": "Personal feelings",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Maid",
      "relationships": [
        "Hotel staff"
      ],
      "public_persona": "Obedient and reserved",
      "private_secret": "Is in love with Captain Hale",
      "motive_seed": "Jealousy of Sylvia's attention",
      "motive_strength": "low",
      "alibi_window": "9:00 PM - 11:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Staff quarters",
        "Dining room"
      ],
      "behavioral_tells": [],
      "stakes": "Romantic aspirations",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Friend to Eleanor"
      ],
      "public_persona": "Popular singer",
      "private_secret": "Dealing with blackmail",
      "motive_seed": "Fear of exposure",
      "motive_strength": "high",
      "alibi_window": "9:00 PM - 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Beach",
        "Dining area"
      ],
      "behavioral_tells": [
        "Anxiety about her past resurfacing"
      ],
      "stakes": "Reputation and career",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [
        "Investigator"
      ],
      "public_persona": "Sharp-witted detective",
      "private_secret": "Hides his own insecurities",
      "motive_seed": "Desire for justice",
      "motive_strength": "high",
      "alibi_window": "10:00 PM - 12:00 AM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Throughout the hotel"
      ],
      "behavioral_tells": [],
      "stakes": "Solving the case",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
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
      "summary": "During a stormy night at the Seashell Hotel, singer Sylvia Trent is found drowned by the rising tide. Detective Hugo Vane investigates, uncovering a web of jealousy, secrets, and a carefully orchestrated deception surrounding the timing of her death."
    },
    "accepted_facts": [
      "Sylvia Trent was found drowned near the hotel beach.",
      "High tide was recorded at ten minutes past eleven."
    ],
    "inferred_conclusions": [
      "The drowning was not an accident."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on drown, manipulate, and chart to expose the false timing.",
      "delivery_path": [
        {
          "step": "The tide charts were altered to show a different high tide time."
        },
        {
          "step": "Dr. Mallory Finch manipulated evidence to create an alibi."
        }
      ]
    },
    "outcome": {
      "result": "The victim drowned due to malicious intent rather than an accident."
    }
  },
  "false_assumption": {
    "statement": "Sylvia drowned accidentally during high tide.",
    "type": "temporal",
    "why_it_seems_reasonable": "The tide charts indicated a high tide at the time of her death, suggesting she was swept away by the waves.",
    "what_it_hides": "The actual timing of her death was manipulated to mislead the investigation."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses saw him near the beach during the time of death.",
      "He had a known affection for Sylvia, which could point to jealousy."
    ],
    "the_one_flaw": "The time of death does not match with Captain Hale's alibi, which was corroborated by hotel staff.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses reported hearing a struggle near the beach.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The struggle was actually unrelated to Sylvia and involved two other guests arguing.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A coded message was found indicating Sylvia planned to meet someone on the beach.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The message was about a scheduled medical consultation and had nothing to do with her death.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel and had access to the victim during the time of her death."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "High tide at ten minutes past eleven",
        "Witness reports from the dining area"
      ],
      "windows": [
        "Alibi windows of suspects",
        "Timeline of hotel events"
      ],
      "contradictions": [
        "Witness accounts claiming different timings",
        "Physical evidence contradicting alibis"
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "Tide charts",
        "Victim's belongings",
        "Security logs"
      ],
      "permissions": [
        "Access to the beach area",
        "Authorization to handle victim's belongings"
      ]
    },
    "physical": {
      "laws": [
        "Tide schedules are predictable",
        "Water levels rise uniformly"
      ],
      "traces": [
        "Footprints leading to the beach",
        "Water line on the victim's clothing"
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff's credibility",
        "Witness statements"
      ],
      "authority_sources": [
        "Captain Hale's position as security"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The tide charts found in Sylvia's room indicate high tide was at ten minutes past eleven.",
        "correction": "The timing of the tide suggests Sylvia could have drowned at that time.",
        "effect": "Narrows the timeline of the drowning to around high tide.",
        "required_evidence": [
          "Tide charts found in Sylvia's room",
          "Witness statements about her last seen time"
        ],
        "reader_observable": true
      },
      {
        "observation": "The water line on Sylvia's clothing shows she was submerged at a significant height.",
        "correction": "This height corresponds with the high tide, suggesting she was in the water for a while.",
        "effect": "Narrows the timeline further and suggests foul play.",
        "required_evidence": [
          "Water line on the victim's clothing",
          "Witness accounts of her last seen moments"
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory Finch's alibi does not hold up; she was seen leaving the lobby shortly before high tide.",
        "correction": "This indicates she had the opportunity to manipulate the evidence.",
        "effect": "Eliminates Dr. Mallory Finch as a suspect.",
        "required_evidence": [
          "Witness statements about Dr. Finch's whereabouts",
          "Hotel security logs"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares drown, manipulate, and chart against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are indicate, timing, and chart.",
    "pass_condition": "If Dr. Mallory Finch's timeline cannot align with the tide schedule, she is proven guilty.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_1",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The tide charts (early) and water line on Sylvia's clothing (mid) allow the reader to understand the timing of her drowning. Step 2: Dr. Finch's alibi (mid) is proven false by witness accounts. Step 3: The reenactment shows the contradictions in her timeline (discriminating test)."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 3,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 3,
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
      "test_type": ""
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses corroborate her alibi.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His alibi aligns with security logs.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Beatrice was with other staff during the time.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 9:00 PM - 11:00 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Reenactment results"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A beloved local artist with a vibrant personality, Eleanor conceals a tumultuous past as a war-time spy.",
    "publicPersona": "Eleanor is adored for her whimsical paintings, often capturing the essence of the coastal town in bright hues. Her laughter echoes in the local galleries, and her charm draws patrons like moths to a flame. The locals see her as a free spirit, a beacon of creativity in a world often shrouded in gray.",
    "privateSecret": "Beneath the surface of her cheerful facade lies a woman haunted by the ghosts of her past. Eleanor's days as a war-time spy are a tightly-held secret, one that could unravel her reputation if exposed. The fear of being unmasked looms over her like a dark cloud, threatening to extinguish her artistic flame.",
    "motiveSeed": "The victim, a man with knowledge of her covert activities, is a ticking time bomb. Eleanor fears that his revelation could not only destroy her career but also plunge her into a prison of shame, where her vibrant spirit would wither away.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been immersed in her studio, paintbrush in hand, lost in the world of color at the time of the incident. Yet, the solitude of her art might just be a convenient cover.",
    "accessPlausibility": "possible",
    "stakes": "For Eleanor, the stakes are not just her reputation as an artist but her very freedom to live authentically. The art community, once her sanctuary, now feels like a precarious tightrope.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a lyrical quality, often embellishing her words with artistic metaphors. She has a tendency to pause, as if painting the picture of her thoughts before sharing them.",
    "signatureTic": "Ah, the colors of life are rarely monochrome.",
    "internalConflict": "Eleanor grapples with the burden of her past, torn between her desire to be a celebrated artist and the fear of what her hidden history could mean for her future.",
    "personalStakeInCase": "This crime strikes at the core of her existence; it threatens to unearth her past and extinguish the very light she fought to nurture in her art.",
    "paragraphs": [
      "Eleanor Voss, with her paint-splattered smock and a gaze that dances across the canvas, has long been a staple of the Seashell Hotel's artistic community. Her whimsical paintings breathe life into the walls of the local gallery, capturing the laughter of children at the beach and the serenity of twilight over the ocean. Yet, behind her vibrant exterior lies a shadowy past that could shatter the delicate world she has created. Once a war-time spy, Eleanor now fears the very secrets she buried may rise to the surface, threatening her career and her freedom.",
      "On the night of the murder, Eleanor was found in her studio, the scent of turpentine mingling with the salty air. She claims to have been lost in a world of colors, but the whispers of doubt swirl around her like the sea fog. The victim, with his knowledge of her past, was a threat she could no longer ignore. As she clutched her paintbrush, she wondered if her art could shield her from the truth, or if it would be the very thing that betrays her.",
      "Her laughter, once a soothing balm to those around her, now feels like a brittle facade. The stakes have never been higher; if her secret is revealed, the art world that adored her could just as easily cast her aside. Eleanor's heart races as she contemplates the implications of the murder. The vibrant colors of her life could quickly fade to gray, leaving her in a world devoid of creativity and joy.",
      "As she navigates the murky waters of suspicion, Eleanor's internal conflict deepens. She longs to escape the shadows of her past, yet the fear of exposure keeps her tethered to the very secrets she wishes to forget. The vibrant artist is trapped in a monochrome reality, where the truth could either liberate or destroy her. Her journey through this dark labyrinth of deceit may awaken the spirit of the artist within her, allowing her to paint a new destiny—one where she no longer hides but embraces the complexities of her existence."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A dedicated physician respected in her community, Mallory hides a dangerous addiction that threatens to unravel her life.",
    "publicPersona": "Dr. Mallory Finch is known for her unwavering commitment to her patients, often working late into the night to ensure their well-being. Her reputation as a skilled healer has earned her the trust and admiration of the community. With a warm smile and a reassuring touch, she embodies the ideal of a compassionate doctor.",
    "privateSecret": "Beneath her polished exterior lies a turbulent secret: Mallory is deeply entrenched in a gambling addiction. The debts are piling up, and the risk of losing her medical license looms over her like a guillotine, ready to drop at any moment.",
    "motiveSeed": "The victim, a former patient, had become aware of her addiction and was threatening to expose her. The thought of her career crumbling under the weight of her indiscretions sends shivers down her spine.",
    "motiveStrength": "compelling",
    "alibiWindow": "Mallory claims she was attending a medical conference just a short distance away, where she was supposed to be learning and networking. But the truth is, her mind was elsewhere, perhaps on the next bet she could place.",
    "accessPlausibility": "easy",
    "stakes": "For Mallory, the stakes are monumental. The loss of her practice would mean financial ruin and the shattering of her identity as a respected healer. It is a precarious balance she walks, teetering on the edge of a cliff.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Mallory's speech is often laced with nervous energy, her sentences punctuated by half-hearted jokes that reveal her self-doubt. She tends to speak quickly, as if trying to outrun her own thoughts.",
    "signatureTic": "Well, I suppose that’s one way to gamble with your life.",
    "internalConflict": "Mallory battles with the shame of her addiction, torn between the desire to maintain her facade of a competent doctor and the fear that her secrets will come tumbling down, exposing her failures.",
    "personalStakeInCase": "This case is not just a professional obligation; it’s a personal crisis. The potential fallout from the victim’s revelations threatens to dismantle the very foundation of her life’s work.",
    "paragraphs": [
      "Dr. Mallory Finch stands at the crossroads of her life, a dedicated physician with a heart for healing. Her reputation in the community is sterling—patients flock to her, reassured by her gentle demeanor and sharp intellect. Yet, behind the mask of respectability lies a dark secret, one that could unravel her entire existence. Mallory has become ensnared in a web of gambling addiction, where each wager feels like a desperate bid for control in a life spiraling out of her grasp.",
      "On the night of the murder, Mallory was supposedly attending a medical conference, a gathering of esteemed colleagues where she was to shine. Yet, her mind drifted to the poker tables, the thrill of the game overshadowing her professional duties. The victim, a patient who had begun to suspect her addiction, was a looming threat. The thought of exposure loomed like a storm cloud, threatening to pour down the rain of ruin.",
      "As the investigation unfolds, Mallory's internal conflict intensifies. She feels the weight of her dual life pressing down on her, the fear of losing her practice gnawing at her conscience. The stakes are higher than just her career; they encompass her very identity as a healer. The notion that her addiction could overshadow her years of dedication sends shivers down her spine. Every interaction becomes a potential landmine, each patient a reminder of what she stands to lose.",
      "In her moments of vulnerability, Mallory resorts to self-deprecating humor, attempting to mask her shame with laughter. “Well, I suppose that’s one way to gamble with your life,” she quips, but the truth is far more somber. As the investigation tightens around her, Mallory must confront her addiction head-on, navigating the treacherous waters of guilt and desperation. Will she find the strength to confront her demons, or will she be swallowed whole by the very secrets she struggles to keep hidden?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A gruff retired naval officer, Ivor grapples with resentment and the shadows of his past as a betrayal resurfaces.",
    "publicPersona": "Captain Ivor Hale is a man of stature and respect, known for his gruff demeanor and charismatic storytelling. His military service has earned him admiration, and he commands attention in any room he enters. The local community sees him as a steadfast figure, a man who has weathered storms both at sea and in life.",
    "privateSecret": "Beneath the surface of his tough exterior lies a festering resentment towards the victim, a reminder of a betrayal that cut deep during the war. The scars of the past shape his present, casting a long shadow over his character.",
    "motiveSeed": "The victim was on the verge of exposing Ivor’s wartime misdeeds, a revelation that would tarnish the reputation he has fought so hard to uphold.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor was seen engaged in a heated argument with the victim earlier in the evening, a confrontation that hung in the air like smoke from a cannon.",
    "accessPlausibility": "easy",
    "stakes": "For Ivor, the stakes are not just his reputation but his pride. The thought of being unmasked as a flawed hero is a fate worse than death.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks in a clipped, commanding tone, often cutting to the chase with little regard for pleasantries. His words carry the weight of experience, and he has a tendency to punctuate his sentences with sharp observations.",
    "signatureTic": "In my day, we didn’t have time for nonsense.",
    "internalConflict": "Ivor wrestles with the ghosts of his past, caught between a desire for redemption and the fear of facing the truth about his wartime actions. The betrayal he endured has left him conflicted, and he struggles to reconcile the man he was with the man he wishes to be.",
    "personalStakeInCase": "This case is personal for Ivor; it threatens to expose the darker corners of his history, challenging the image of the honorable captain he has strived to maintain.",
    "paragraphs": [
      "Captain Ivor Hale stands as a formidable figure, a retired naval officer whose presence commands respect. The stories he shares from his days at sea are laced with a blend of pride and sorrow, revealing a man who has faced battles both external and internal. His reputation as a steadfast leader is hard-earned, yet it hangs by a thread, precariously balanced on the edge of a past betrayal that continues to haunt him.",
      "The night of the murder, Ivor found himself embroiled in a heated argument with the victim, a confrontation that left tempers flaring and words exchanged like cannon fire. The victim's impending revelation of Ivor's wartime misdeeds loomed like a specter, threatening to drag his name through the mud. The thought of being unmasked as a flawed hero stirs a deep-rooted resentment within him, a feeling that he has fought too hard to maintain his dignity to let it slip away now.",
      "With each passing moment, Ivor's internal conflict deepens. He grapples with the shadows of his past, torn between the desire for redemption and the fear of facing the truth about his wartime actions. The betrayal he endured during the war has left scars that refuse to heal, and the thought of being exposed terrifies him. He knows that his reputation is at stake, but the battle rages within him as he questions whether he can truly confront the man he was.",
      "Ivor's blunt demeanor often masks the turmoil beneath. “In my day, we didn’t have time for nonsense,” he declares, but the truth is that he is drowning in the very nonsense he wishes to dismiss. As the investigation unfolds, he must confront not only the external threat posed by the murder but also the internal demons that have plagued him for far too long. Can he find the strength to forgive himself, or will he remain shackled to the chains of his past, forever haunted by the specter of betrayal?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An ambitious journalist with dreams of making it big, Beatrice finds herself entangled in a web of deceit and manipulation.",
    "publicPersona": "Beatrice Quill is a passionate journalist known for her tenacity and drive. With a sharp pen and an even sharper mind, she is always on the lookout for her next big story. Her ambition is palpable, and she is well-regarded among her peers for her relentless pursuit of the truth.",
    "privateSecret": "Behind her ambitious facade lies a complicated romantic entanglement with the victim’s estranged sibling. Beatrice's motivations are clouded by her desire for wealth and status, leading her to manipulate those around her.",
    "motiveSeed": "Her relationship with the victim’s sibling has the potential to secure her career, but it also places her in a precarious position as she navigates the treacherous waters of familial loyalty and ambition.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice claims to have been interviewing guests at the hotel during the incident, gathering material for her next article. Yet, the tension between her ambition and her personal life creates a murky backdrop.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are her career trajectory and the personal relationship that could either elevate her status or bring her crashing down.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a lively cadence, often punctuating her observations with a wry smile. She has a knack for turning mundane situations into captivating narratives, drawing her audience in with vivid descriptions.",
    "signatureTic": "Life’s a story waiting to be told.",
    "internalConflict": "Beatrice grapples with the tension between her ambition and her moral compass, torn between the desire for success and the integrity of her craft.",
    "personalStakeInCase": "This case is pivotal for Beatrice; it could either catapult her into the limelight or expose her manipulations, threatening the very foundation of her career.",
    "paragraphs": [
      "Beatrice Quill is a name on the rise in the journalistic world, her ambition driving her to chase stories with fervor. With a quick wit and a sharp pen, she has earned respect among her peers, yet her hunger for success often clouds her judgment. The thrill of the chase propels her forward, but it also leads her into murky waters where integrity and ambition clash. The Seashell Hotel, with its rich tapestry of stories, serves as her backdrop as she seeks her next big break.",
      "On the night of the murder, Beatrice was busy interviewing guests, her mind racing with the possibilities of the narratives unfolding around her. Yet, her connection to the victim’s estranged sibling complicates her motives. The relationship, born out of a desire for wealth and status, places her in a precarious position. Will she manipulate the situation to secure her career, or will her conscience intervene?",
      "As the investigation unfolds, Beatrice finds herself grappling with the tension between her ambition and her moral compass. She is acutely aware that this case could either catapult her into the limelight or expose her manipulations, shattering the very foundation of her career. The stakes have never been higher, and the pressure mounts as she navigates the fine line between ambition and integrity.",
      "With an observational humor that draws people in, Beatrice often remarks, “Life’s a story waiting to be told.” Yet, as she dives deeper into the murky waters of the investigation, she realizes that every story has its consequences. As she faces the reality of her choices, Beatrice must decide if the pursuit of fame is worth the cost of her integrity. Will she rise to the occasion, or will she be swept away by the currents of her own ambition?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A friendly hotel receptionist, Sylvia hides a secret life of deceit that could unravel her world.",
    "publicPersona": "Sylvia Trent is the friendly face at the Seashell Hotel, known for her warm smile and helpful demeanor. Guests find comfort in her presence, and she has a knack for making everyone feel at home. Her charm masks the secrets she keeps hidden beneath the surface.",
    "privateSecret": "Unbeknownst to those around her, Sylvia has been keeping meticulous records of guests' secrets, planning to sell them for profit. Her scheme is a ticking time bomb, and the victim's discovery of her actions threatens to expose her.",
    "motiveSeed": "The victim had discovered her secret and was poised to report her, a revelation that could unravel her carefully constructed life.",
    "motiveStrength": "strong",
    "alibiWindow": "Sylvia claims to have been in the lobby during the time of death, but her ability to slip away unnoticed raises eyebrows.",
    "accessPlausibility": "easy",
    "stakes": "For Sylvia, the stakes are monumental; the loss of her job and freedom hang in the balance as her deceit threatens to surface.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Sylvia speaks with a nervous energy, often punctuating her sentences with awkward laughter. She tends to hedge her words, as if afraid to reveal too much.",
    "signatureTic": "Oh dear, what a tangled web we weave.",
    "internalConflict": "Sylvia wrestles with guilt over her deceitful actions, torn between the desire for financial gain and the fear of losing everything she holds dear.",
    "personalStakeInCase": "This case is critical for Sylvia; it threatens to expose her secret life and destroy the fragile stability she has created.",
    "paragraphs": [
      "Sylvia Trent is the epitome of hospitality at the Seashell Hotel, her friendly smile greeting guests as they enter. Known for her warm demeanor, she has become a beloved fixture, providing comfort to weary travelers. Yet, beneath the surface of her charm lies a darker reality—Sylvia has been keeping tabs on the secrets of the guests, a scheme that could unravel her carefully constructed life. The thrill of her deceit offers a fleeting sense of power, but the shadows of her actions loom large.",
      "On the night of the murder, Sylvia was in the lobby, a seemingly innocent bystander. However, the victim had stumbled upon her records, threatening to expose her secrets. The thought of losing her job and freedom sends a chill down her spine. She is acutely aware that her clandestine activities could lead to her downfall, and the pressure mounts as she navigates the web of deceit she has woven.",
      "As the investigation unfolds, Sylvia's internal conflict deepens. She grapples with the guilt of her actions, torn between the desire for financial gain and the fear of losing everything she holds dear. The stakes are monumental; her entire world hangs in the balance, and the thought of exposure keeps her awake at night. Each interaction becomes fraught with tension, as she wonders if her secret will slip through her fingers.",
      "With a nervous laugh, Sylvia often mutters, “Oh dear, what a tangled web we weave,” a bittersweet acknowledgment of the precariousness of her situation. As the investigation draws closer to her, she must confront the consequences of her deceit. Will she find the courage to come clean, or will she be ensnared in the very web she spun, forever trapped by her own lies?"
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A suave businessman facing financial ruin, Hugo's inheritance hinges on the victim's demise.",
    "publicPersona": "Hugo Vane is the epitome of charm and sophistication, a suave businessman who moves effortlessly through elite circles. His connections and charisma make him a prominent figure in society, and he is often seen at the finest events, exuding confidence and style.",
    "privateSecret": "Beneath the polished exterior, Hugo is teetering on the brink of financial ruin. His inheritance depends on the victim's death, a truth he keeps hidden from those around him.",
    "motiveSeed": "The victim was poised to change the will, cutting Hugo out of the family fortune—a prospect that sends him into a spiral of desperation.",
    "motiveStrength": "strong",
    "alibiWindow": "Hugo claims to have been dining with a group of wealthy friends during the time of the murder, but the possibility of staging his alibi raises questions.",
    "accessPlausibility": "easy",
    "stakes": "For Hugo, the stakes are high; his financial future and societal status hinge on the victim's demise, making him a prime suspect in the investigation.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Hugo speaks with a smooth, confident cadence, often using sarcasm to mask his underlying tension. He has a penchant for grandiose statements that highlight his charm.",
    "signatureTic": "Ah, the price of ambition can be quite steep.",
    "internalConflict": "Hugo is torn between his desire for wealth and the moral implications of his actions. The thought of losing everything drives him to desperate measures, leaving him to question the cost of his ambition.",
    "personalStakeInCase": "This case hits home for Hugo; it threatens to strip away the facade of success he has so carefully constructed, exposing the depths of his desperation.",
    "paragraphs": [
      "Hugo Vane is a figure who embodies the essence of sophistication, moving through social circles with an effortless charm that captivates those around him. His polished demeanor and sharp wit make him a sought-after companion at the finest events. Yet, beneath the veneer of success lies a tumultuous reality—Hugo is on the brink of financial ruin, and the stakes have never been higher. His inheritance, which he once took for granted, now hinges precariously on the life of the victim.",
      "On the night of the murder, Hugo was supposedly dining with a group of wealthy friends, a scene designed to provide him with an alibi. But the truth is far murkier; the victim was about to change the will, cutting Hugo out of the family fortune. The thought of being stripped of his status drives him to the edge, and desperation begins to cloud his judgment.",
      "As the investigation unfolds, Hugo grapples with the internal conflict of his ambitions. He is torn between the desire for wealth and the moral implications of his actions. The notion that he could be implicated in the murder sends chills down his spine, and the pressure mounts as he navigates the investigation, his charming facade beginning to crack under the weight of his secrets.",
      "With a sardonic smile, Hugo often quips, “Ah, the price of ambition can be quite steep.” Yet, the reality of his situation is far from humorous. As the investigation draws closer, he must confront the consequences of his actions, questioning whether the pursuit of wealth is worth the cost of his integrity. Will he find a way to salvage his reputation, or will the ambition that once fueled him lead to his downfall?"
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Seashell Hotel",
    "type": "Hotel",
    "place": "Penzance",
    "country": "England",
    "summary": "A coastal hotel with Art Deco flair, serving as a social hub amidst the tension of post-war life.",
    "visualDescription": "A grand facade of geometric patterns and polished chrome, with sea-blue accents and large glass windows framing breathtaking ocean views. Inside, the lobby boasts a sweeping staircase, elegant chandeliers, and plush furnishings, with guests mingling amid the scent of brine and salt.",
    "atmosphere": "A blend of nostalgia and tension, as the echoes of laughter mingle with unease.",
    "paragraphs": [
      "The Seashell Hotel rises like a beacon against the fog-laden backdrop of Penzance, its Art Deco lines sharp and striking. With each step into the lobby, guests are greeted by the muted hum of conversation and the soft strains of a radio broadcasting the latest news. The scent of salt mingles with the aroma of freshly brewed coffee, creating an intoxicating atmosphere that draws visitors from near and far. Yet, beneath the surface, an undercurrent of anxiety lingers, as whispers of political unrest and shifting societal norms fill the air.",
      "The large dining area offers expansive views of the churning sea, where the waves crash against the rocky shore. Tables adorned with crisp white linens and polished silverware invite patrons to indulge in sumptuous meals, but the conversations are often punctuated by nervous laughter, as the guests grapple with the realities of a world just emerging from the shadows of war. Here, the echoes of clinking glasses and the murmur of distant waves create a juxtaposition of celebration and trepidation.",
      "Upstairs, the guest rooms boast breathtaking views of the ocean, providing a temporary escape from the turmoil outside. Each room is decorated with vintage art deco furnishings, evoking a sense of luxury and comfort. However, as night falls and the fog thickens, the isolation of the hotel becomes palpable. The narrow hallways echo with the sounds of creaking floorboards, and the dim light casts long shadows, creating an atmosphere ripe for secrets to unfold."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Foggy with occasional rain, typical for coastal regions in the summer months.",
    "timeFlow": "A weekend of mounting tension, as secrets unfold and alliances shift.",
    "mood": "Tense, with underlying anxiety due to recent events in the news related to post-war adjustments.",
    "eraMarkers": [
      "Art Deco architecture",
      "Early radio broadcasts",
      "Rationed wartime vehicles"
    ],
    "sensoryPalette": {
      "dominant": "Salt air and polished wood",
      "secondary": [
        "Muted conversations and clinking silverware",
        "Crisp linens and vintage decor"
      ]
    },
    "paragraphs": [
      "The Seashell Hotel stands on the edge of a rocky coastline, where the fog rolls in like a shroud, muffling sounds and blurring the line between land and sea. The salty tang of the ocean fills the air, mingling with the faint scent of burning coal from the kitchen. Time feels suspended here, as if the weight of the world outside has been paused, allowing guests to lose themselves in the comfort of the hotel’s elegant embrace. Yet, the tension is palpable, as the distant crash of waves serves as a reminder of the chaos beyond these walls.",
      "Inside, the hotel is a microcosm of the post-war zeitgeist, where laughter and joy coexist uneasily with the specter of trauma. The glow of early electric lights illuminates the faces of patrons, their expressions a mix of hope and uncertainty. Here, the clatter of dishes and the soft music from a radio create a symphony of everyday life, but beneath it lies a current of apprehension, as guests exchange furtive glances, each one harboring their own secrets."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Hotel Lobby",
      "type": "interior",
      "purpose": "Social gathering space",
      "visualDetails": "Spacious with a grand staircase, plush seating, and a reception desk adorned with fresh flowers.",
      "sensoryDetails": {
        "sights": [
          "chandeliers casting soft light",
          "geometric patterns on the carpet",
          "polished marble floors",
          "glassy ocean views through large windows"
        ],
        "sounds": [
          "murmurs of conversation",
          "clinking of glasses",
          "soft music from a radio",
          "distant laughter"
        ],
        "smells": [
          "freshly brewed coffee",
          "salt air from the ocean",
          "polished wood and leather",
          "a hint of cologne"
        ],
        "tactile": [
          "smooth marble underfoot",
          "plush upholstery of armchairs",
          "cool metal of the reception desk",
          "the weight of a heavy door"
        ]
      },
      "accessControl": "Open to all guests during the day; restricted access after hours for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down windows",
            "grey light filtering through fog",
            "reflections in wet floors"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft whispers among guests",
            "the rustle of newspapers"
          ],
          "smells": [
            "damp wood",
            "freshly brewed tea",
            "overripe fruit from breakfast"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "cloudy sky visible through windows",
            "flickering shadows from the chandeliers"
          ],
          "sounds": [
            "the creak of old furniture",
            "distant thunder rumbling"
          ],
          "smells": [
            "dust from the corners",
            "old leather books",
            "the faint scent of tobacco"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables"
          ],
          "sounds": [
            "soft laughter from the dining area",
            "the ticking of a clock"
          ],
          "smells": [
            "candle wax",
            "warm bread from the kitchen",
            "fresh flowers"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The hotel lobby serves as the heart of the Seashell, where guests mingle and share stories over cups of coffee. The grand staircase spirals upward, flanked by elegant art deco details that hint at a bygone era. Here, the atmosphere is thick with anticipation, as new arrivals bring a fresh wave of curiosity and gossip. Yet, the tension is palpable; every glance exchanged carries the weight of unspoken fears and hidden motives.",
        "As the day wears on, the lobby transforms into a stage for drama, with each character playing their part against the backdrop of the crashing waves outside. The sounds of laughter and the clinking of glasses create a facade of normalcy, but the air crackles with unease. Guests steal furtive glances, as if aware that beneath the surface, the tides of fate are shifting."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Dining and socializing space",
      "visualDetails": "Elegant long tables set with fine china, ocean views framed by large windows, and soft lighting creating an intimate atmosphere.",
      "sensoryDetails": {
        "sights": [
          "crisp white tablecloths",
          "gleaming silverware",
          "vibrant floral centerpieces",
          "ocean waves crashing against rocks"
        ],
        "sounds": [
          "clattering of dishes",
          "muffled conversations",
          "the soft pop of champagne corks",
          "the rustling of napkins"
        ],
        "smells": [
          "roasted meats and rich sauces",
          "freshly baked bread",
          "herbs and spices",
          "the tang of seawater"
        ],
        "tactile": [
          "smooth table surfaces",
          "cold glass of wine",
          "warm bread rolls",
          "soft fabric of napkins"
        ]
      },
      "accessControl": "Open to all guests during meal times; staff only access to kitchens and storage.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "foggy windows obscuring the view",
            "soft light filtering through clouds"
          ],
          "sounds": [
            "rain tapping against the roof",
            "the bustle of breakfast preparation"
          ],
          "smells": [
            "fresh pastries",
            "brewing coffee",
            "the salty breeze"
          ],
          "mood": "cozy warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "clouds hanging low over the sea"
          ],
          "sounds": [
            "the distant crash of waves",
            "the soft hum of conversation"
          ],
          "smells": [
            "smoky aromas from the kitchen",
            "the sweetness of dessert preparations"
          ],
          "mood": "heavy silence"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "the sun setting over the horizon"
          ],
          "sounds": [
            "clinking glasses",
            "the laughter of diners"
          ],
          "smells": [
            "grilled fish",
            "herbs and garlic",
            "the sweet scent of wine"
          ],
          "mood": "festive celebration"
        }
      ],
      "paragraphs": [
        "The dining room of the Seashell Hotel is a place where culinary delights meet social intrigue. Guests gather around long tables, sharing meals that tantalize the senses while engaging in whispered conversations. The atmosphere is rich with the aromas of roasted meats and freshly baked bread, creating a feast for the senses. Yet, as laughter fills the air, a tension simmers just beneath the surface, as patrons exchange glances that suggest more than mere pleasantries.",
        "As the sun sets and the candles are lit, the dining room transforms into an intimate haven. The flickering light dances across the faces of the diners, illuminating secrets hidden in shadows. The clinking of glasses and the soft rustle of linens create a symphony of elegance, yet the air is thick with the weight of unspoken worries. Each meal shared here is a blend of comfort and anxiety, as the world outside grows more uncertain."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "Guest Rooms",
      "type": "interior",
      "purpose": "Private accommodations for guests",
      "visualDetails": "Tastefully decorated with art deco furnishings, large windows offering ocean views, and plush bedding.",
      "sensoryDetails": {
        "sights": [
          "art deco furniture",
          "large windows framed by curtains",
          "neatly made beds",
          "decorative mirrors reflecting light"
        ],
        "sounds": [
          "the distant roar of the ocean",
          "soft sighs of relaxation",
          "the creak of floorboards"
        ],
        "smells": [
          "fresh linen",
          "the scent of sea air",
          "a hint of perfume",
          "dusty corners"
        ],
        "tactile": [
          "soft bedding against skin",
          "cool glass of water",
          "the warmth of sunlight streaming in",
          "the smoothness of polished surfaces"
        ]
      },
      "accessControl": "Guest access only; restricted access for staff during cleaning hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through curtains",
            "raindrops on window panes"
          ],
          "sounds": [
            "rain pattering on rooftops",
            "the rustle of sheets"
          ],
          "smells": [
            "dampness in the air",
            "freshly brewed coffee from downstairs"
          ],
          "mood": "tranquil solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "the ocean churning outside"
          ],
          "sounds": [
            "the wind howling outside",
            "the creak of the building"
          ],
          "smells": [
            "the scent of stale air",
            "the faint smell of cleaning products"
          ],
          "mood": "oppressive isolation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the sun setting on the horizon",
            "stars beginning to twinkle"
          ],
          "sounds": [
            "the distant sound of music from downstairs",
            "the soft whisper of the ocean"
          ],
          "smells": [
            "the scent of salt in the air",
            "the lingering aroma of dinner"
          ],
          "mood": "reflective calm"
        }
      ],
      "paragraphs": [
        "The guest rooms at the Seashell Hotel are sanctuaries of comfort, each one thoughtfully decorated to evoke a sense of tranquility. Large windows frame breathtaking views of the ocean, inviting the sound of crashing waves to fill the space. Here, guests can find solace from the chaos of the world outside, yet the silence is often punctuated by the distant echoes of laughter and whispered secrets that permeate the hotel.",
        "As night descends and the fog thickens, the rooms take on an air of mystery. The soft light from bedside lamps creates a warm glow, contrasting with the chill of the sea air. Each room holds its own stories and secrets, where the weight of the past lingers in the fabric of the furnishings. In this intimate space, guests confront their thoughts, as the world outside fades into a blur of uncertainty."
      ]
    },
    {
      "id": "kitchen",
      "name": "Kitchen",
      "type": "interior",
      "purpose": "Food preparation area for the hotel",
      "visualDetails": "A bustling space filled with stainless steel appliances, large prep tables, and shelves stocked with ingredients.",
      "sensoryDetails": {
        "sights": [
          "steam rising from pots",
          "clattering of pans",
          "colorful vegetables on cutting boards",
          "chefs in white uniforms"
        ],
        "sounds": [
          "the hiss of frying food",
          "the chopping of knives",
          "the clatter of utensils",
          "commanding voices calling orders"
        ],
        "smells": [
          "savory aromas of cooking",
          "fresh herbs",
          "baking bread",
          "the scent of oil"
        ],
        "tactile": [
          "warm surfaces of the stove",
          "cold metal of utensils",
          "rough texture of burlap sacks",
          "smoothness of cutting boards"
        ]
      },
      "accessControl": "Staff access only; no guest entry allowed.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dull light filtering through windows",
            "water droplets on surfaces"
          ],
          "sounds": [
            "the sound of water boiling",
            "the chatter of morning staff"
          ],
          "smells": [
            "freshly baked pastries",
            "brewing coffee",
            "the scent of dampness"
          ],
          "mood": "busy anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "cloudy light casting shadows",
            "ingredients laid out for prep"
          ],
          "sounds": [
            "the rhythmic chopping of vegetables",
            "the hum of refrigeration units"
          ],
          "smells": [
            "rich aromas of stews",
            "the scent of frying onions"
          ],
          "mood": "intense focus"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glowing lights illuminating work areas",
            "the final touches on plated dishes"
          ],
          "sounds": [
            "the laughter of staff",
            "the sound of sizzling"
          ],
          "smells": [
            "the rich scent of desserts",
            "the aroma of grilled meats"
          ],
          "mood": "celebratory hustle"
        }
      ],
      "paragraphs": [
        "The kitchen of the Seashell Hotel is a hive of activity, where the scent of savory dishes mingles with the sound of sizzling pans. Here, chefs work with precision, their movements choreographed to the rhythm of culinary creation. The atmosphere is charged with energy, as the team prepares for the evening service, each dish crafted with care and attention to detail. Yet, amidst the bustle, there is a palpable tension, as whispers of the hotel’s secrets echo in the corners.",
        "As the day progresses, the kitchen transforms into a whirlwind of flavors and aromas, where the clatter of utensils and the hiss of frying food create a symphony of culinary delight. Staff share laughter and camaraderie, but beneath the surface lies an unspoken awareness of the mysteries unfolding within the hotel walls. In this space, food becomes a bridge between guests and their hidden stories, as every meal served carries the weight of the past."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023084984999999997,
  "durationMs": 31091
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1942,
    "month": "January",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "foggy conditions with low visibility",
      "occasional rain showers",
      "chilly winds coming off the coast"
    ],
    "daylight": "Short daylight hours, with the sun setting around 4:30 PM, leaving long evenings enveloped in darkness",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests retire to their rooms or gather in the hotel lounge",
    "holidays": [
      "New Year's Day",
      "Martin Luther King Jr. Day (observed)"
    ],
    "seasonalActivities": [
      "Indoor board games by the fireplace",
      "Winter walks along the beach, despite the chill",
      "Attending local theater productions or dances at the hotel"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits in dark colors",
        "white dress shirts with stiff collars",
        "black leather shoes polished to a shine"
      ],
      "casual": [
        "tweed jackets with elbow patches",
        "corduroy trousers",
        "knit sweaters in muted tones"
      ],
      "accessories": [
        "fedoras or flat caps",
        "silk ties with geometric patterns",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dresses with cinched waists",
        "long-sleeved blouses with high necklines",
        "hats adorned with feathers or flowers"
      ],
      "casual": [
        "knit cardigans over blouses",
        "A-line skirts with patterned designs",
        "ankle boots or practical shoes"
      ],
      "accessories": [
        "string pearls or beaded necklaces",
        "gloved hands for elegant appearances",
        "stylish clutches or handbags"
      ]
    },
    "trendsOfTheMoment": [
      "Utility fashion due to rationing",
      "Bold prints and colors reflecting wartime optimism",
      "Wartime propaganda influencing design choices"
    ],
    "socialExpectations": [
      "Men are expected to display a gallant demeanor",
      "Women are encouraged to work and contribute to the war effort",
      "Social gatherings often revolve around community and support"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "America's entry into World War II following the attack on Pearl Harbor",
      "Mobilization of factories for war production",
      "Increased propaganda about supporting the troops"
    ],
    "politicalClimate": "Heightened national unity in the face of war, with increasing government control over resources",
    "economicConditions": "Rationing of goods like sugar, coffee, and gasoline affecting daily life",
    "socialIssues": [
      "Debate over women's roles in the workforce",
      "Racial segregation and discrimination still prevalent",
      "Concerns about wartime security and espionage"
    ],
    "internationalNews": [
      "Fighting intensifies in the Pacific and North Africa",
      "Allied forces strategizing against Axis powers",
      "Humanitarian crises arising from war-related displacements"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Glenn Miller's big band arrangements",
        "Doris Day's early recordings"
      ],
      "films": [
        "'Casablanca'",
        "'Mrs. Miniver'",
        "'The Maltese Falcon'"
      ],
      "theater": [
        "Broadway shows like 'The Man Who Came to Dinner'",
        "Local performances of wartime comedies"
      ],
      "radio": [
        "'The Shadow'",
        "'Fibber McGee and Molly'",
        "News broadcasts keeping the public informed"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Glass Key' by Dashiell Hammett",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Little Prince' by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "Detective fiction",
        "War literature",
        "Romance novels reflecting wartime sentiment"
      ]
    },
    "technology": {
      "recentInventions": [
        "Radar technology for detecting aircraft",
        "Improvements in radio communication",
        "Advances in military vehicles and weaponry"
      ],
      "commonDevices": [
        "Radio sets in homes and hotels",
        "Typewriters for correspondence",
        "Early telephones for communication"
      ],
      "emergingTrends": [
        "Increased use of women in technical roles",
        "Public interest in scientific advancements related to the war",
        "Developments in aviation technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: three pence",
        "Cinema ticket: one shilling"
      ],
      "commonActivities": [
        "Socializing in local pubs and cafes",
        "Participating in war bond drives",
        "Engaging in community service efforts"
      ],
      "socialRituals": [
        "Weekly Sunday dinners with extended family",
        "Community gatherings for wartime support",
        "Listening to radio shows as a family activity"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Growing awareness of class disparity as the war progresses",
      "Increased solidarity among working-class citizens"
    ],
    "gender": [
      "Women stepping into roles traditionally held by men",
      "Expectations for women to maintain domestic responsibilities alongside work"
    ],
    "race": [
      "Racial tensions exacerbated by war efforts",
      "Calls for civil rights gaining traction in light of wartime contributions by minorities"
    ],
    "generalNorms": [
      "Support for the war effort is paramount",
      "Patriotism is expressed through daily actions and community involvement",
      "Social behaviors reflect a mix of anxiety and optimism"
    ]
  },
  "atmosphericDetails": [
    "The salty scent of the sea mingles with the dampness of fog rolling in from the coast, creating a heavy atmosphere",
    "The sound of distant waves crashing against the rocky shore offers a rhythmic backdrop, interrupted only by occasional laughter or hushed conversations from hotel guests",
    "A palpable tension fills the air, as whispers of war and uncertain futures dominate discussions in the lounge, where the flickering light of a radio casts shadows on the walls"
  ],
  "paragraphs": [
    "January 1942 unfolds in a coastal hotel, where the chill of winter settles in like a lingering fog. The air is thick with moisture, and raindrops occasionally tap against the windowpanes, creating a symphony of sounds that blend with the distant crash of waves. The sun sets early, and by late evening, the hotel becomes a hub of whispered conversations and anxious laughter as guests seek warmth and comfort within its walls. With the world at war, tensions run high, and the atmosphere is imbued with an undercurrent of uncertainty as everyone grapples with the changes around them.",
    "Fashion in this era reflects the duality of wartime resilience and spirit. Men don double-breasted wool suits, often in somber shades, while women wear tea-length dresses adorned with floral patterns, their outfits complemented by elegant hats. While the utility of clothing is paramount, personal expression still thrives in bold prints and colors. Accessories such as leather gloves and silk ties adorn the well-dressed, hinting at a desire for normalcy amidst the chaos of the outside world.",
    "Daily life is marked by rationing and community spirit, with typical prices reflecting the struggles of the time. A loaf of bread costs four pence, and evenings are spent gathered around radios, listening to the latest news or popular radio dramas. Social rituals include Sunday dinners that bring families together, creating a sense of unity and support. As women step into roles within the workforce, the changing social landscape is matched by a growing sense of empowerment, though challenges and discrimination remain. This tension is palpable in every interaction, as the hotel serves as a microcosm of a society on the brink of transformation."
  ],
  "note": "",
  "cost": 0.0011126676000000001,
  "durationMs": 13129
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A coastal hotel hosts a diverse group of guests and staff amid post-war anxieties, where the pressure of social expectations and the specter of recent tragedies converge during a stormy summer.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Post-WWII trauma influences social dynamics, with increased female workforce participation and rising tensions from the Cold War creating a complex web of class and institutional relationships."
  },
  "setting": {
    "location": "A coastal hotel with Art Deco architecture",
    "institution": "Hotel",
    "weather": "Foggy with occasional rain, typical for coastal regions in the summer months."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a tidal-drowning method, where the flood-tide timetable and shifting sea level fix — and falsify — the window in which the victim could have drowned."
}

### LOCKED_FACTS
[
  {
    "id": "victim_watch_time",
    "value": "ten minutes past eleven",
    "description": "The time displayed on the victim's watch at the time of death."
  },
  {
    "id": "tide_height",
    "value": "three feet",
    "description": "The height of the tide at the time the body was found."
  },
  {
    "id": "tide_chart_time",
    "value": "eleven thirty",
    "description": "The predicted time of high tide according to the tide chart."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 6,
    "mid": 12,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
    "optional": 1
  },
  "redHerringCount": 1,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
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
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
