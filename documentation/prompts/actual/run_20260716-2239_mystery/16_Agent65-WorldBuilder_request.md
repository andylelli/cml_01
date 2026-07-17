# Actual Prompt Record

- Run ID: `mystery-1784241582701`
- Project ID: ``
- Timestamp: `2026-07-16T22:43:50.780Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `73795b6802d5762c`

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
    "title": "The Chime of Deceit",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A vintage seaside hotel with Art Deco architecture",
      "place": "Brighton",
      "country": "England",
      "institution": "seaside hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical death"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A renowned sleuth with a keen eye for detail",
      "private_secret": "Struggles with self-doubt after a failed case",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel lobby",
        "dining area"
      ],
      "behavioral_tells": [
        "observant",
        "methodical"
      ],
      "stakes": "Desire to prove her skills after past failures",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A respected doctor known for her research",
      "private_secret": "Had a secret affair with Captain Hale",
      "motive_seed": "inheritance",
      "motive_strength": "unknown",
      "alibi_window": "Last seen at 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel library"
      ],
      "behavioral_tells": [
        "nervous around Captain Hale"
      ],
      "stakes": "Maintaining reputation and secrecy",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Suspect",
      "relationships": [
        "affair with Dr. Finch"
      ],
      "public_persona": "A charming naval officer",
      "private_secret": "Desperate to keep his affair hidden",
      "motive_seed": "Jealousy and fear of exposure",
      "motive_strength": "strong",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "ocean-view balcony"
      ],
      "behavioral_tells": [
        "fidgety when questioned"
      ],
      "stakes": "Protecting his reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [
        "friend of Dr. Finch"
      ],
      "public_persona": "A lively young woman enjoying her time at the hotel",
      "private_secret": "Knew about the affair and was angry at Dr. Finch",
      "motive_seed": "Rivalry over Captain Hale's affection",
      "motive_strength": "moderate",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "dining area"
      ],
      "behavioral_tells": [
        "overly cheerful"
      ],
      "stakes": "Winning over Captain Hale",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "old acquaintance of Dr. Finch"
      ],
      "public_persona": "A poised and assertive woman",
      "private_secret": "Had a falling out with Dr. Finch long ago",
      "motive_seed": "Resentment from past grievances",
      "motive_strength": "weak",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel library"
      ],
      "behavioral_tells": [
        "calm under pressure"
      ],
      "stakes": "Proving herself after being overlooked",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A wealthy businessman with an interest in the hotel",
      "private_secret": "Has dealings with Captain Hale",
      "motive_seed": "Financial gain from hotel ownership",
      "motive_strength": "strong",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "dining area"
      ],
      "behavioral_tells": [
        "overly polite"
      ],
      "stakes": "Maintaining his business interests",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
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
      "summary": "During a charity gala at a vintage seaside hotel, Dr. Mallory Finch is found dead, strangled. The clock in the lobby has been tampered with, leading investigators to believe she died much earlier than she actually did. Detective Eleanor Voss must untangle the web of deceit and uncover the true timing of the murder."
    },
    "accepted_facts": [
      "Dr. Finch was last seen alive at half past nine.",
      "The clock in the hotel lobby was showing ten minutes past nine."
    ],
    "inferred_conclusions": [
      "Dr. Finch could not have been killed at the time the clock indicated."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanical clock's hands were rotated back to mislead investigators about the time of death.",
      "delivery_path": [
        {
          "step": "Captain Hale tampered with the clock after Dr. Finch was murdered."
        }
      ]
    },
    "outcome": {
      "result": "The clock misled investigators, allowing the true time of death to be obscured."
    }
  },
  "false_assumption": {
    "statement": "Dr. Mallory Finch was killed at ten minutes past nine, as indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock showed a clear time, and she was last seen shortly before.",
    "what_it_hides": "The actual time of death was much later, after she had been seen alive."
  },
  "false_solution": {
    "accused_suspect": "Beatrice Quill",
    "supporting_points": [
      "Beatrice had a rivalry with Dr. Finch over Captain Hale.",
      "Witnesses saw her near the library at the time of death."
    ],
    "the_one_flaw": "Witnesses also confirmed Beatrice was in the dining area just before the clock was tampered with.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses claim to have seen Captain Hale arguing with Dr. Finch.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was a misunderstanding; they were discussing a medical case.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A broken piece of string was found near Dr. Finch's body.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The string was from a decorative item in the lobby, unrelated to the murder.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the gala and had potential motives."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "last seen at half past nine",
        "clock shows ten minutes past nine"
      ],
      "windows": [
        "9 PM to 10 PM"
      ],
      "contradictions": [
        "Witnesses heard the clock chime at unexpected intervals.",
        "Dr. Finch was seen alive after the time indicated by the clock."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale"
      ],
      "objects": [
        "mechanical clock"
      ],
      "permissions": [
        "access to the lobby after hours"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical devices can be tampered with"
      ],
      "traces": [
        "scratch marks on clock mechanism"
      ]
    },
    "social": {
      "trust_channels": [
        "relationships between suspects"
      ],
      "authority_sources": [
        "hotel management"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock's hands show ten minutes past nine, but Dr. Finch was last seen at half past nine.",
        "correction": "Dr. Finch could not have been killed at ten minutes past nine.",
        "effect": "Narrows timeline of death to after half past nine.",
        "required_evidence": [
          "The clock shows ten minutes past nine.",
          "Witnesses confirm Dr. Finch was last seen alive at half past nine."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall hearing the clock chime unexpectedly.",
        "correction": "The clock's chime indicates it may have been tampered with.",
        "effect": "Suggests the clock was adjusted to mislead investigators.",
        "required_evidence": [
          "Witnesses report hearing the clock chime at odd intervals.",
          "The clock's hands show signs of recent manipulation."
        ],
        "reader_observable": true
      },
      {
        "observation": "Scratch marks on the clock's mechanism suggest recent tampering.",
        "correction": "Captain Hale had access to the clock and opportunity to tamper with it.",
        "effect": "Narrows suspicion toward Captain Hale.",
        "required_evidence": [
          "Scratch marks are visible on the clock mechanism.",
          "Captain Hale was seen in the lobby shortly before the murder."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "constraint_proof",
    "design": "Comparing the clock's time with the timeline of events shows the clock was tampered with.",
    "knowledge_revealed": "The revealed facts are clock, minut, and narrow.",
    "pass_condition": "If the clock shows a time inconsistent with witness statements.",
    "evidence_clues": [
      "clue_8",
      "clue_1",
      "clue_4",
      "clue_culprit_direct_captain_ivor_hale"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time (early) and witness last seen (mid) establish a timeline. Step 2: Unexpected chimes (mid) indicate tampering. Step 3: Scratch marks (discriminating test) reveal Captain Hale's tampering."
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
        "Observe the clock's manipulation evidence",
        "Draw conclusion about Captain Hale's guilt"
      ],
      "test_type": "constraint_proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm she was in the dining area.",
        "supporting_clues": [
          "red_herring_1",
          "red_herring_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her alibi is corroborated by other guests.",
        "supporting_clues": [
          "red_herring_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proves he was in the dining area during the murder.",
        "supporting_clues": [
          "red_herring_1"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: Last seen at 9:30 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confronted with the clock's tampering evidence."
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
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_clock_time",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation of the clock"
      },
      {
        "clue_id": "clue_scratch_marks",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Inspection of the clock"
      },
      {
        "clue_id": "clue_witness_last_seen",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
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
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_unexpected_chime",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness recounting chimes"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a traveling journalist, is drawn into a web of intrigue when a murder occurs at the seaside hotel she is investigating. Her charming demeanor masks a complex past that intertwines with the victim's life.",
    "publicPersona": "Charming and inquisitive, Eleanor is known for her insightful articles and captivating stories.",
    "privateSecret": "Eleanor struggles with the guilt of having had a brief affair with the victim's spouse years ago.",
    "motiveSeed": "Eleanor wants to uncover the truth behind the murder for a compelling story and vindication.",
    "motiveStrength": "strong",
    "alibiWindow": "arrived at the hotel two days prior to the crime",
    "accessPlausibility": "easy",
    "stakes": "Eleanor risks losing her reputation if she fails to solve the murder.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a fluidity that reflects her journalistic background, often punctuating her observations with a raised eyebrow or a slight smirk, as if she’s both the storyteller and the audience.",
    "signatureTic": "‘What’s the story?’",
    "internalConflict": "Eleanor is haunted by her past actions, fearing that the truth of her former affair will surface and tarnish her reputation.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as it represents a chance for redemption and a way to confront her past mistakes.",
    "paragraphs": [
      "Eleanor Voss stepped into the vintage seaside hotel, the salty breeze tousling her auburn hair as she surveyed the opulent Art Deco surroundings. The grand chandelier seemed to sparkle with secrets, and she felt an inexplicable pull toward the unfolding drama. Known for her captivating articles, Eleanor had always prided herself on unveiling the truth, but now, she found herself entangled in a narrative far more personal than she had anticipated.",
      "As she mingled with the other guests, her charm was undeniable, yet beneath the surface lay a tumultuous sea of guilt. Years ago, she had succumbed to a brief affair with the spouse of the victim, a secret that now threatened to surface with the murder. The thought gnawed at her, a reminder that her quest for truth could lead to her own undoing. The stakes were high — not just for the victim, but for her own reputation as a journalist and as a woman.",
      "With each interaction, Eleanor's dry wit surfaced, often disarming those around her. 'What’s the story?' she would quip, her tone light, even as the gravity of the situation weighed heavily on her shoulders. The investigation was not merely about uncovering the murderer; it was about seeking vindication for her past and reclaiming her narrative. But would the truth set her free, or would it ensnare her further?",
      "Eleanor's alibi was solid; she had arrived at the hotel two days before the murder, yet the access she had to the crime scene and the people involved was both a blessing and a curse. The more she uncovered, the deeper her internal conflict grew. Would the revelation of her past affair with the victim's spouse serve as a catalyst for redemption, or would it drown her in a tide of scandal? As she navigated the murky waters of deceit, Eleanor knew one thing: to find the murderer, she must first confront the darkest corners of her own heart."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a well-respected physician whose nurturing nature masks a tumultuous inner life. As a victim of murder, her own secrets become pivotal to unraveling the truth behind her death.",
    "publicPersona": "Respected and nurturing, Dr. Finch is well-liked in the community.",
    "privateSecret": "She had been secretly in love with the victim for years, despite her marriage.",
    "motiveSeed": "Dr. Finch feels the victim was about to reveal the truth of their past affair, threatening her marriage.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in surgery at the time of death; exact timing unverified",
    "accessPlausibility": "possible",
    "stakes": "Her marriage could be at stake if the affair is exposed.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks with a calm, measured tone, often using medical jargon that reflects her professional background. She has a tendency to avoid personal topics, redirecting conversations back to her patients or medical practice.",
    "signatureTic": "‘Let’s focus on the facts.’",
    "internalConflict": "Dr. Finch is torn between her feelings for the victim and her loyalty to her husband, fearing the consequences of her unacknowledged love.",
    "personalStakeInCase": "The murder matters to Dr. Finch as it threatens to expose her hidden love and jeopardize her marriage, forcing her to confront her true feelings.",
    "paragraphs": [
      "Dr. Mallory Finch was regarded as a pillar of the community, her nurturing presence a balm to those in need. Yet beneath the surface of her calm demeanor lay a tempest of emotion, one that had been brewing for years. Her secret love for the victim, a man who had captivated her heart despite her marriage, was a truth she had buried deep, fearing the repercussions it could unleash. As the news of the murder spread, so too did the shadows of her unspoken feelings.",
      "In her surgical scrubs, Dr. Finch was a figure of authority, her voice steady as she guided her team through procedures with precision. 'Let’s focus on the facts,' she would insist, a mantra that kept her grounded amid chaos. But the irony was not lost on her; while she could save lives, she felt utterly powerless to confront her own tangled emotions. The timing of her alibi, being in surgery at the moment of the murder, was a double-edged sword — it could protect her, or it could unravel the very fabric of her existence.",
      "As the investigation unfolded, Dr. Finch’s internal conflict intensified. She feared that the victim had intended to reveal their past, a disclosure that would shatter her marriage and expose her heart. The stakes were more than professional; they were deeply personal. Caught between love and loyalty, she grappled with the idea of losing everything she had worked to build. Her husband, a good man, deserved the truth, but could she bear to shatter his world?",
      "In the quiet moments, when she was alone with her thoughts, Dr. Finch would reflect on the choices that led her here. The vibrant life she had built was now overshadowed by the specter of her feelings for the victim. As she became aware of the implications of the murder, she realized that the investigation could lead to her own reckoning. Would she find the strength to confront the truth, or would she remain shackled to her secrets forever?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, appears to be a figure of respect and authority, but beneath his polished exterior lies a web of deceit that could cost him everything.",
    "publicPersona": "A distinguished and authoritative figure, Ivor commands respect and admiration.",
    "privateSecret": "He has been embezzling money from a trust fund meant for the victim's family.",
    "motiveSeed": "Ivor stands to lose his financial security if the victim discovers his theft.",
    "motiveStrength": "compelling",
    "alibiWindow": "was out for a stroll on the beach during the time of the murder",
    "accessPlausibility": "possible",
    "stakes": "His reputation and finances are in jeopardy.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a commanding presence, his words deliberate and measured. He often employs a sardonic edge, particularly when discussing matters of morality or ethics, revealing a sharp wit beneath his naval decorum.",
    "signatureTic": "‘In my experience…’",
    "internalConflict": "Ivor grapples with the weight of his deceit, fearing the fallout if his embezzlement is discovered, while also wrestling with the morality of his actions.",
    "personalStakeInCase": "The murder investigation is crucial for Ivor, as exposure of his embezzlement could lead to his downfall and tarnish his legacy.",
    "paragraphs": [
      "Captain Ivor Hale stood on the beach, the waves crashing rhythmically against the shore, a stark contrast to the turmoil within. A retired naval officer, he was a man of stature and respect, yet the very foundation of his reputation was crumbling beneath the weight of his secrets. He had embezzled funds from a trust meant for the victim's family, a betrayal that gnawed at his conscience even as he savored the comforts it provided. 'In my experience,' he often mused, 'one must navigate the waters of life with a keen eye for opportunity.'",
      "But now, Ivor found himself adrift, the stakes of his actions rising with the tide. The murder of the victim could unravel everything he had built, and the thought sent a chill down his spine. He had been out for a stroll during the time of the murder, a seemingly innocent alibi that could just as easily be his undoing. If the truth emerged, he would lose more than just his finances; he would lose the respect he had cultivated over decades.",
      "His public persona demanded a façade of authority, yet Ivor often allowed himself sardonic humor as a coping mechanism. 'Ah, the morality of men — a fickle thing, isn’t it?' he would quip, masking the turmoil beneath his polished exterior. Yet, every jest felt like a dagger, reminding him of the fragility of his situation. The investigation loomed like a storm on the horizon, and he could feel the winds shifting.",
      "As the days passed and the investigation unfolded, Ivor grappled with the moral implications of his actions. He questioned whether the financial security he had sought was worth the risk of losing everything he held dear. Would he be forced to confront the consequences of his deceit, or could he navigate this treacherous waters without being swept away? The answer lay in the shadows of the past, and Ivor was determined to steer clear of the rocks."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a glamorous socialite, lives for the spotlight but harbors a secret engagement with the victim that threatens her carefully curated life.",
    "publicPersona": "Beatrice is a glamorous presence at social events, always seeking the attention of the wealthy.",
    "privateSecret": "She had a secret engagement with the victim, hoping to secure a substantial inheritance.",
    "motiveSeed": "Beatrice feared losing her place in high society if the victim ended their relationship.",
    "motiveStrength": "weak",
    "alibiWindow": "was at a dinner party across the hotel at the time of the murder",
    "accessPlausibility": "possible",
    "stakes": "Beatrice may lose her social standing and lifestyle.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a theatrical flair, often punctuating her sentences with dramatic gestures. Her tone can shift quickly from charming to cutting, reflecting her ambition and desire for status.",
    "signatureTic": "‘One must always play the part.’",
    "internalConflict": "Beatrice is torn between her ambition and the fear of losing her social standing, leading her to question the value of her relationships.",
    "personalStakeInCase": "The murder investigation matters to Beatrice as it threatens her carefully constructed life and the potential loss of her engagement.",
    "paragraphs": [
      "Beatrice Quill swept into the hotel like a summer storm, all glamour and glitz, her laughter ringing like a bell in the ears of the wealthy elite. She thrived on attention, a socialite whose every move was calculated to captivate and enthrall. Yet beneath the surface of her sparkling exterior lay a secret engagement with the victim, a fact that could unravel her carefully curated life. 'One must always play the part,' she often reminded herself, a mantra that both empowered and ensnared her.",
      "As she mingled at the dinner party, her sardonic wit was on full display. 'Oh darling, what a dreadful affair!' she would exclaim, her tone dripping with faux concern, masking the turmoil that lurked within. Beatrice feared losing her place in high society should the victim end their relationship, and the stakes felt higher than ever. The murder had thrown her world into chaos, and she found herself questioning the very foundation of her ambitions.",
      "With an alibi that placed her at a dinner party across the hotel during the time of the murder, she felt a fleeting sense of relief. Yet, the truth of her secret engagement loomed like a specter, threatening to expose her vulnerabilities. Beatrice was no stranger to manipulation, yet the idea of losing everything she had worked for sent shivers down her spine. The investigation was not merely an inconvenience; it was a potential catastrophe for her social standing.",
      "As the days wore on, Beatrice grappled with her ambition versus the authenticity of her relationships. The murder investigation forced her to confront the lengths she would go to maintain her status. Would she cling to her facade, or would the truth of her engagement lead her to reevaluate her values? In a world where appearances were everything, Beatrice stood at a crossroads, one that could redefine her narrative forever."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a local artist, grapples with jealousy towards the victim, whose success has overshadowed her own artistic aspirations.",
    "publicPersona": "Sylvia is known for her passionate artworks and progressive views.",
    "privateSecret": "She harbors jealousy towards the victim for stealing her chance at a prestigious art show.",
    "motiveSeed": "Sylvia felt the victim's influence blocked her artistic advancement and was prepared to sabotage her.",
    "motiveStrength": "weak",
    "alibiWindow": "was painting in her studio during the time of death; no witnesses",
    "accessPlausibility": "unlikely",
    "stakes": "Her career could suffer irreparable damage.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Sylvia speaks with a raw honesty, often punctuated by self-deprecating remarks. Her tone is earnest, reflecting her passion for art and her frustrations with her career.",
    "signatureTic": "‘It’s just a brush with failure, really.’",
    "internalConflict": "Sylvia struggles with her jealousy and resentment towards the victim, fearing that her artistic dreams are slipping away.",
    "personalStakeInCase": "The murder investigation is significant for Sylvia, as it forces her to confront her artistic aspirations and the jealousy that clouds her judgment.",
    "paragraphs": [
      "Sylvia Trent stood in her studio, paintbrush in hand, surrounded by canvases that bore the marks of her passion. As a local artist, she was known for her fiery spirit and progressive views, yet beneath that public persona lay a simmering jealousy that threatened to consume her. The victim's recent success had overshadowed her own artistic aspirations, and Sylvia felt the sting of inadequacy with every passing day. 'It’s just a brush with failure, really,' she would quip, trying to mask her bitterness with humor.",
      "Her alibi was shaky at best; she had been painting in her studio at the time of the murder, with no witnesses to corroborate her story. The thought of being implicated in the crime sent a wave of anxiety through her. What if the investigation unearthed her resentment? What if her jealousy turned into something far more sinister? The stakes felt impossibly high, and Sylvia grappled with the fear that her career could suffer irreparable damage.",
      "As the investigation unfolded, Sylvia’s internal conflict deepened. She realized that her jealousy towards the victim had morphed into a dangerous fixation, one that could derail her entire future. The desire for recognition had blinded her to the reality of her own talent, and the murder investigation forced her to confront the demons she had long avoided. Would she succumb to her darker impulses, or could she find a way to channel her frustrations into something constructive?",
      "In the quiet moments, when she was alone with her thoughts, Sylvia would reflect on the nature of her art and what it truly meant to her. Was it worth sacrificing her integrity for the sake of ambition? The investigation had become a mirror, reflecting not only the darkness of her jealousy but also the potential for growth. As she navigated the complexities of the case, Sylvia stood at a crossroads, one that could either lead her to self-destruction or to a newfound clarity in her artistic journey."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a shrewd real estate developer, is driven by greed and ambition, but the murder of the victim threatens to unravel his carefully constructed plans.",
    "publicPersona": "Hugo is known for his shrewd business tactics and lavish lifestyle.",
    "privateSecret": "He had sought a partnership with the victim, which had just been rejected.",
    "motiveSeed": "Hugo's lucrative business plans were thwarted by the victim's refusal to cooperate.",
    "motiveStrength": "moderate",
    "alibiWindow": "attended a meeting with potential investors at the time of death; timing is vague",
    "accessPlausibility": "possible",
    "stakes": "His financial dealings depend on successful partnerships.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks in a direct, no-nonsense manner, often cutting through pleasantries to get to the point. His tone is assertive, and he tends to use industry jargon that reflects his business acumen.",
    "signatureTic": "‘Nothing personal, just business.’",
    "internalConflict": "Hugo struggles with the consequences of his greed, questioning whether his ambition is worth the cost of his integrity.",
    "personalStakeInCase": "The murder investigation is critical for Hugo, as it jeopardizes his financial interests and could expose his ruthless business practices.",
    "paragraphs": [
      "Hugo Vane was a man who thrived on ambition, his life a tapestry woven from shrewd business tactics and a lavish lifestyle. As a real estate developer, he had built an empire, yet the recent murder of the victim threatened to unravel everything he had worked for. Just days before the crime, the victim had rejected his proposal for a lucrative partnership, a blow that sent Hugo reeling. 'Nothing personal, just business,' he often reminded himself, a mantra that masked the anxiety creeping into his mind.",
      "At the time of the murder, Hugo had been attending a meeting with potential investors, an alibi that felt increasingly tenuous with each passing hour. The timing of the meeting was vague, and he could sense the scrutiny of those around him. The stakes were high; if the investigation revealed his ruthless dealings, it could spell disaster for his career. Hugo was no stranger to risk, but this was a game with far higher consequences than any he had faced before.",
      "His blunt manner of speaking often startled those who crossed his path. He cut through pleasantries with an assertiveness that left little room for doubt. 'We’re here to make money, not friends,' he would declare, his tone unwavering. Yet, as the murder investigation unfolded, he found himself questioning the very foundation of his ambition. Was it worth sacrificing integrity for profit, or was he merely a pawn in a game far larger than himself?",
      "As the days dragged on and the investigation deepened, Hugo grappled with his internal conflict. He feared the potential fallout of his actions, yet the allure of success was intoxicating. The murder had thrown his world into chaos, forcing him to confront the consequences of his greed. In a landscape where trust was fleeting and partnerships were precarious, Hugo stood at a crossroads, one that would ultimately define not just his career, but who he was as a person."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Oceanic Splendor",
    "type": "seaside hotel",
    "place": "Chesil Beach",
    "country": "England",
    "summary": "A vintage seaside hotel with Art Deco elegance, overlooking the turbulent waters of Chesil Beach, where the crashing waves hide secrets beneath their frothy surface.",
    "visualDescription": "Art Deco architecture adorned with intricate patterns; a grand chandelier casting a warm glow over polished marble floors; ocean-view balconies framed by elegant ironwork; a dining area with large windows offering sweeping views of the turbulent sea.",
    "atmosphere": "A tense atmosphere filled with unspoken suspicions and hidden motives among the hotel's guests.",
    "paragraphs": [
      "The Oceanic Splendor stands resolute against the windswept cliffs of Chesil Beach, its Art Deco facade gleaming with an air of faded glamour. The hotel, a refuge for weary travelers, invites guests to lose themselves in its luxurious comforts, yet an undercurrent of tension permeates the air. The lobby, with its grand chandelier, casts flickering shadows on the marble floor, hinting at secrets waiting to be uncovered.",
      "Through the large dining room windows, the restless sea thrashes against the shore, its rhythmic crashing echoing the unease felt within. Guests sit at linen-draped tables, their conversations hushed and guarded, eyes darting to the balcony where the stormy weather isolates them further from the outside world. The scent of salt and dampness mingles with the rich aroma of roasted meats and freshly baked bread, creating an illusion of comfort amidst the growing anxiety.",
      "As the day wanes, the dim light of the setting sun struggles to penetrate the thick clouds, casting a pall over the hotel. The sound of distant thunder rumbles like a warning, and the flicker of candlelight dances in the shadows. Each room holds its own stories, but the whispers of deceit grow louder, resonating against the walls of the elegant establishment. In this haven of luxury, danger lurks just beneath the surface, waiting for the opportune moment to strike."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical for coastal regions",
    "timeFlow": "Three days of mounting tension and suspicion",
    "mood": "tense, with an undercurrent of suspicion among guests",
    "eraMarkers": [
      "Art Deco furnishings and decor",
      "Radio broadcasts filling the lobby",
      "Military rationing notices in the dining area"
    ],
    "sensoryPalette": {
      "dominant": "Briny sea air and damp wood",
      "secondary": [
        "Worn leather and polished marble",
        "Flickering candlelight and soft shadows"
      ]
    },
    "paragraphs": [
      "The Oceanic Splendor, a vintage seaside hotel, stands proudly against the rugged coastline of Chesil Beach. Its Art Deco architecture, with sweeping curves and geometric elegance, creates a striking silhouette against the tumultuous sky. Inside, the lobby's grand chandelier casts a warm glow, illuminating the polished marble floors and inviting guests into a world of luxury and intrigue. Yet, the salty tang of the sea and the distant sound of crashing waves serve as constant reminders of the storm brewing both outside and within.",
      "As the rain begins to fall, the atmosphere thickens with tension. The scent of damp wood and brine permeates the air, mingling with the aroma of hearty meals served in the dining area. Guests, gathered around linen-clad tables, whisper conspiratorially, their eyes flickering toward the ocean-view balconies where the storm's fury reflects their own inner turmoil. Shadows lengthen as evening descends, the flickering candlelight casting an eerie glow that heightens the sense of unease, enveloping the hotel in an air of impending dread."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Grand Dining Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Elegant Art Deco design with ocean views; long tables set with fine china; a large fireplace with a mantle adorned with nautical decor.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware reflecting candlelight",
          "heavy drapes framing the ocean view",
          "intricate murals depicting sea life",
          "shadows pooling in corners"
        ],
        "sounds": [
          "clinking glasses and hushed whispers",
          "the crackle of the fireplace",
          "the distant roar of the ocean",
          "the soft thud of footsteps on polished floor"
        ],
        "smells": [
          "roasted meats and rich gravies",
          "freshly baked bread",
          "damp wood and sea air",
          "a hint of cigarette smoke"
        ],
        "tactile": [
          "smooth linen tablecloths",
          "cold marble underfoot",
          "polished wood of the chair arms",
          "chill of the ocean breeze through the open balcony door"
        ]
      },
      "accessControl": "Accessible to all guests during meal times; staff-only access to the kitchen and serving areas; closed off after hours for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through rain-streaked windows",
            "wet tablecloths glistening in the dim light"
          ],
          "sounds": [
            "steady drumming of rain on the roof",
            "soft murmurs of guests at breakfast"
          ],
          "smells": [
            "freshly brewed coffee",
            "damp earth from the garden",
            "the scent of rain on the ocean"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dulling colors",
            "the flicker of candle flames in the gloom"
          ],
          "sounds": [
            "silence punctuated by the ticking clock",
            "the creak of the dining room door"
          ],
          "smells": [
            "cooked fish and herbs",
            "dust gathering on untouched tables",
            "the musty scent of old books"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering against the walls",
            "the horizon glowing with the last light of day"
          ],
          "sounds": [
            "gentle waves lapping against the shore",
            "the laughter of guests mingling with the clink of glasses"
          ],
          "smells": [
            "grilled meats and aromatic spices",
            "the sweet scent of desserts",
            "the faint whiff of salt air"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Dining Room serves as the heart of The Oceanic Splendor, a stage where the drama of the guests unfolds. Its elegant Art Deco design, with sweeping lines and nautical motifs, creates an atmosphere of sophistication, yet the air is thick with unspoken tension. Long tables adorned with gleaming silverware and fine china invite guests to partake in sumptuous meals, but the flickering candlelight casts unsettling shadows that seem to whisper of hidden secrets.",
        "As the storm brews outside, the dining room becomes a refuge for those seeking warmth and comfort. Yet, the sounds of clinking glasses and hushed conversations are punctuated by the distant roar of the ocean, a reminder of the chaos lurking just beyond the walls. This juxtaposition of luxury and menace sets the stage for the unfolding mystery—a place where every guest is both a participant and a suspect."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "Dark wood shelves lined with books; a large bay window overlooking the sea; plush armchairs arranged for quiet reading.",
      "sensoryDetails": {
        "sights": [
          "dust motes dancing in the sunlight",
          "leather-bound volumes lining the shelves",
          "the flicker of a nearby lamp",
          "the patterned carpet underfoot"
        ],
        "sounds": [
          "soft rustle of pages turning",
          "the ticking of a grandfather clock",
          "the distant crash of waves",
          "the creak of the old floorboards"
        ],
        "smells": [
          "old paper and leather",
          "the mustiness of forgotten tomes",
          "freshly polished wood",
          "the faint scent of lavender"
        ],
        "tactile": [
          "rough texture of aged book covers",
          "softness of plush armchair cushions",
          "coolness of the window glass",
          "the smooth surface of the reading table"
        ]
      },
      "accessControl": "Open to all guests during daylight hours; staff may reserve books for guests; locked after hours for privacy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops trickling down the window",
            "dim light filtering through clouds"
          ],
          "sounds": [
            "gentle patter of rain on the roof",
            "the whisper of pages turning"
          ],
          "smells": [
            "freshly brewed tea",
            "damp wood and earth",
            "the scent of wet paper"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "the glow of a single lamp illuminating a reading nook"
          ],
          "sounds": [
            "the soft ticking of a clock",
            "the occasional creak of the shelves"
          ],
          "smells": [
            "old leather and ink",
            "the musty aroma of forgotten stories",
            "the faint scent of dust"
          ],
          "mood": "mysterious"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling through the window",
            "the silhouettes of books against the fading light"
          ],
          "sounds": [
            "the gentle rustle of pages",
            "the distant laughter from the dining room"
          ],
          "smells": [
            "the rich scent of aged paper",
            "the warmth of candle wax",
            "the faint aroma of fresh flowers"
          ],
          "mood": "calm before the storm"
        }
      ],
      "paragraphs": [
        "The Library, a sanctuary of knowledge and solace, invites guests to escape into the world of words. Dark wood shelves cradle leather-bound volumes, their spines worn from years of reading. A large bay window offers a view of the tumultuous sea, where waves crash against the shore, mirroring the storm brewing within the hotel. Plush armchairs are arranged invitingly, perfect for quiet contemplation or clandestine meetings, but the atmosphere is heavy with unspoken tension.",
        "As the rain begins to fall, the Library becomes a refuge for those seeking solace from the storm. Dust motes dance in the dim light, and the soft rustle of pages turning breaks the silence, accompanied by the ticking of the grandfather clock. In this hallowed space, secrets linger between the lines of the books, waiting for the right eyes to uncover them. Here, every whispered conversation may hold a clue, every shadow a hidden truth."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Isolation and concealment",
      "visualDetails": "Open terrace with wrought iron railings; panoramic views of the coastline; scattered lounge chairs and potted plants.",
      "sensoryDetails": {
        "sights": [
          "storm clouds gathering overhead",
          "the churning sea far below",
          "the distant flash of lightning",
          "twisting vines climbing the railings"
        ],
        "sounds": [
          "howling wind whipping through the terrace",
          "the roar of waves crashing",
          "the distant rumble of thunder",
          "the creak of the terrace underfoot"
        ],
        "smells": [
          "fresh sea air tinged with rain",
          "the earthy scent of wet soil",
          "the faint aroma of blooming flowers",
          "the metallic scent of approaching storms"
        ],
        "tactile": [
          "cold metal of the railings",
          "smooth stone tiles underfoot",
          "the chill of the wind against skin",
          "the rough texture of potted plants"
        ]
      },
      "accessControl": "Restricted access; open to guests during the day but locked at night; staff can access for maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey skies and heavy clouds",
            "raindrops pooling on the terrace"
          ],
          "sounds": [
            "steady rain drumming on the tiles",
            "the distant crash of waves"
          ],
          "smells": [
            "damp earth and wet stone",
            "the fresh scent of rain on the sea"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "the sea merging with the horizon"
          ],
          "sounds": [
            "the wind howling past",
            "the distant sound of seagulls"
          ],
          "smells": [
            "sea salt and dampness",
            "the scent of wet foliage"
          ],
          "mood": "isolated"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the sky",
            "stars beginning to twinkle above"
          ],
          "sounds": [
            "the soft lapping of waves",
            "the distant laughter from the dining room"
          ],
          "smells": [
            "the fresh scent of the ocean",
            "the faint aroma of evening flowers"
          ],
          "mood": "suspenseful"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers an expansive view of Chesil Beach, its wrought iron railings framing the tumultuous sea and sky. Here, guests can escape the confines of the hotel, yet the isolation becomes palpable as storm clouds gather overhead. The terrace, with its scattered lounge chairs and potted plants, creates an inviting atmosphere, but the howling wind and distant thunder serve as reminders of the brewing storm, both in nature and among the guests.",
        "As evening falls, the terrace transforms into a place of suspense. The scent of fresh sea air fills the lungs, mingling with the earthy aroma of the wet soil. Here, secrets can be exchanged in whispers, and the shadows cast by the fading light create opportunities for concealment. Yet, with every gust of wind and roll of thunder, the tension escalates, leaving guests to wonder what truths might be revealed before the night is through."
      ]
    },
    {
      "id": "staff_quarters",
      "name": "Staff Quarters",
      "type": "interior",
      "purpose": "Backstage area for operations",
      "visualDetails": "Simple furnishings with utilitarian design; small kitchen area; a bulletin board filled with notices.",
      "sensoryDetails": {
        "sights": [
          "faded wallpaper peeling at the edges",
          "dim lighting from a single bulb",
          "stacked linens in the corner",
          "the clutter of cleaning supplies"
        ],
        "sounds": [
          "soft chatter among staff members",
          "the clatter of dishes being washed",
          "the hum of the refrigerator",
          "the creak of floorboards"
        ],
        "smells": [
          "cleaning solution and disinfectant",
          "the aroma of leftover meals",
          "the scent of fresh linens",
          "the faint odor of dampness"
        ],
        "tactile": [
          "rough texture of old wooden tables",
          "the chill of the concrete floor",
          "the softness of freshly laundered towels",
          "the weight of a heavy apron"
        ]
      },
      "accessControl": "Restricted to hotel staff; accessible during shifts and for cleaning; off-limits to guests.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water pooling on the floor",
            "staff hurrying in with umbrellas"
          ],
          "sounds": [
            "the patter of rain against the windows",
            "the rustle of wet clothing"
          ],
          "smells": [
            "the strong scent of damp fabric",
            "the aroma of brewing coffee"
          ],
          "mood": "busy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping in from the windows",
            "the flicker of fluorescent lights"
          ],
          "sounds": [
            "the distant sound of clinking dishes",
            "the chatter of staff members"
          ],
          "smells": [
            "the scent of cleaning products",
            "the lingering aroma of lunch"
          ],
          "mood": "chaotic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light spilling from the kitchen",
            "staff gathering around the table"
          ],
          "sounds": [
            "laughter and conversation",
            "the sizzle of food being prepared"
          ],
          "smells": [
            "the rich aroma of dinner being cooked",
            "the scent of freshly baked bread"
          ],
          "mood": "relaxed"
        }
      ],
      "paragraphs": [
        "The Staff Quarters serve as the beating heart of The Oceanic Splendor, a bustling hub where the hotel staff prepare for the day ahead. With simple furnishings and a utilitarian design, the space is functional yet filled with the energy of those who toil behind the scenes. Faded wallpaper and dim lighting create a stark contrast to the elegance of the guest areas, while the sounds of clattering dishes and soft chatter fill the air.",
        "As the rain pours outside, the Staff Quarters become a whirlwind of activity. The scent of cleaning solutions mingles with the aroma of brewing coffee, while staff members hurry in with wet clothing, their laughter echoing through the cramped space. Here, secrets are shared over quick conversations, and the atmosphere is charged with the anticipation of the day's events, where every moment could lead to revelations that shake the very foundations of the hotel."
      ]
    }
  ],
  "note": "",
  "cost": 0.00242451,
  "durationMs": 44207
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "June",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "overcast skies with intermittent rain showers",
      "cool breezes off the ocean",
      "high humidity typical of coastal areas"
    ],
    "daylight": "Long days with daylight lasting until nearly nine o'clock, creating a twilight that lingers in the evening air.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the rain begins to fall again.",
    "holidays": [
      "Father's Day (June 20)"
    ],
    "seasonalActivities": [
      "visiting nearby beaches for picnics",
      "evening strolls along the boardwalk",
      "attending local fairs and summer concerts"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "seersucker suits",
        "lightweight cotton dress shirts",
        "straw boater hats"
      ],
      "casual": [
        "short-sleeved button-ups",
        "linen trousers",
        "deck shoes"
      ],
      "accessories": [
        "silk ties",
        "suspenders",
        "colorful pocket squares"
      ]
    },
    "womensWear": {
      "formal": [
        "sundresses with floral patterns",
        "lightweight evening gowns",
        "bolero jackets"
      ],
      "casual": [
        "capri pants",
        "blouses with puffed sleeves",
        "platform sandals"
      ],
      "accessories": [
        "wide-brimmed hats",
        "string pearl necklaces",
        "floral hairpins"
      ]
    },
    "trendsOfTheMoment": [
      "increased use of pastels in summer fashion",
      "the popularity of playsuits",
      "the emergence of the 'new look' silhouette"
    ],
    "socialExpectations": [
      "traditional gender roles are being challenged",
      "expectation for women to be more independent",
      "growing acceptance of casual dress in social settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the Berlin Blockade intensifies tensions in Europe",
      "the formation of NATO as a counter to Soviet influence",
      "the establishment of the Marshall Plan aiding European recovery"
    ],
    "politicalClimate": "A climate of suspicion and uncertainty prevails as the Cold War begins to reshape international relations.",
    "economicConditions": "Economic recovery is underway, but rationing still affects certain goods, and there is a struggle to stabilize the post-war economy.",
    "socialIssues": [
      "discussions on civil rights begin to surface",
      "veterans returning to civilian life face integration challenges",
      "the roles of women in society and the workforce continue to evolve"
    ],
    "internationalNews": [
      "news of the establishment of the state of Israel",
      "tensions in Palestine escalate",
      "the Korean War looms on the horizon"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's big band tunes",
        "Doris Day's romantic ballads",
        "Nat King Cole's jazz standards"
      ],
      "films": [
        "'The Treasure of the Sierra Madre'",
        "'Key Largo'",
        "'The Naked City'"
      ],
      "theater": [
        "'South Pacific' debuts on Broadway",
        "'Annie Get Your Gun' continues to draw crowds",
        "'The Glass Menagerie' captures audiences"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Adventures of Superman'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Naked and the Dead' by Norman Mailer",
        "'The Catcher in the Rye' by J.D. Salinger",
        "'The Member of the Wedding' by Carson McCullers"
      ],
      "popularGenres": [
        "post-war realism",
        "detective fiction",
        "psychological thrillers"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "the first commercial television broadcasts",
        "advancements in aviation technology"
      ],
      "commonDevices": [
        "table radios",
        "black-and-white television sets",
        "wall-mounted telephones"
      ],
      "emergingTrends": [
        "growing popularity of household appliances",
        "increased use of plastic in manufacturing",
        "the rise of consumer electronics"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Pint of milk: three pence"
      ],
      "commonActivities": [
        "going to the beach for sunbathing",
        "attending social dances",
        "playing lawn games like croquet"
      ],
      "socialRituals": [
        "Sunday family gatherings for dinner",
        "afternoon tea served at hotels",
        "weekly church services"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing awareness of class disparities",
      "increased mobility among the working class"
    ],
    "gender": [
      "women are increasingly seen in roles outside the home",
      "traditional expectations of homemaking are being challenged"
    ],
    "race": [
      "early civil rights movements begin to take shape",
      "racial segregation remains prevalent in many areas"
    ],
    "generalNorms": [
      "the importance of propriety in public life",
      "the shift towards more casual social norms"
    ]
  },
  "atmosphericDetails": [
    "The smell of salty sea air mingles with the scent of damp earth from the recent rain.",
    "The sound of waves crashing against the rocky shore provides a rhythmic backdrop to the murmurs of guests in the hotel.",
    "A sense of tension hangs thick in the air as whispers of discontent and suspicion circulate among the guests."
  ],
  "paragraphs": [
    "June 1948 at the seaside hotel is marked by an overcast sky, with rain intermittently drizzling down upon the coastal landscape. The air is thick with humidity, and the scent of sea salt mingles with the dampness of the earth. Guests are seen huddling under awnings, sharing uneasy glances, while the sound of waves crashing against the rocks echoes the tension that simmers beneath the surface. Long summer evenings beckon visitors to stroll along the boardwalk, yet the mood remains heavy, as the recent political upheavals in Europe cast a shadow over vacationing families.",
    "Amidst this uneasy backdrop, fashion reflects a blend of practicality and post-war optimism. Men don lightweight seersucker suits and straw boater hats, while women embrace vibrant sundresses adorned with floral patterns, their wide-brimmed hats providing shade from the occasional sun. Casual attire is becoming more accepted, with men opting for short-sleeved button-ups and women wearing capri pants and blouses. The emphasis on comfort hints at a societal shift, as expectations around gender roles begin to evolve in the wake of wartime experiences.",
    "Daily life in June 1948 is characterized by a blend of old traditions and new freedoms. Families gather for Sunday dinners, while afternoon tea is a cherished social ritual at the hotel, where laughter and light conversation bubble beneath the surface of a brewing storm. Prices reflect a recovering economy, with a loaf of bread costing four pence and a movie ticket priced at one shilling. Yet, conversations often drift to the pressing issues of the day—the Berlin Blockade, civil rights, and the growing awareness of class disparities. It is a moment of change, as old norms clash with the new realities of a world still healing from the scars of war."
  ],
  "note": "",
  "cost": 0.0010733019,
  "durationMs": 18312
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a vintage seaside hotel for a charity event unites a diverse group of guests, each navigating the societal shifts of post-WWII life while tensions rise amidst whispers of deceit and ambition.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has reshaped gender roles, with women increasingly in the workforce, creating new class dynamics and social pressures that heighten competition and suspicion among guests."
  },
  "setting": {
    "location": "A vintage seaside hotel with Art Deco architecture",
    "institution": "seaside hotel",
    "weather": "overcast with occasional rain"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a mechanical clock-tampering method, where a rewound timepiece staged the apparent time of death."
}

### LOCKED_FACTS
[
  {
    "id": "clock_time",
    "value": "ten minutes past nine",
    "description": "The clock shows ten minutes past nine at the time of the investigation."
  },
  {
    "id": "last_seen_time",
    "value": "half past ten",
    "description": "The victim was last seen at half past ten."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 7,
    "mid": 11,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "testimonial"
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
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_clock_time",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_witness_last_seen",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_unexpected_chime",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_scratch_marks",
      "placement": "early",
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
