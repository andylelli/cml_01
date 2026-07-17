# Actual Prompt Record

- Run ID: `mystery-1784261232496`
- Project ID: ``
- Timestamp: `2026-07-17T04:18:52.622Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `0b44d51b9ff3ddf4`

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
    "title": "The Clockwork Deception",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "suspicious death"
    }
  },
  "death_method": "struck with a heavy object",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "A keen-minded investigator",
      "private_secret": "Struggles with past trauma from the war",
      "motive_seed": "Curiosity for the truth",
      "motive_strength": "strong",
      "alibi_window": "n/a",
      "access_plausibility": "high",
      "opportunity_channels": [
        "investigation"
      ],
      "behavioral_tells": [
        "sharp attention to detail"
      ],
      "stakes": "solving the case to restore her reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Was researching a controversial medical procedure",
      "motive_seed": "N/A",
      "motive_strength": "n/a",
      "alibi_window": "n/a",
      "access_plausibility": "n/a",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "businessman",
      "relationships": [
        "former military colleague of the victim"
      ],
      "public_persona": "Charismatic and authoritative",
      "private_secret": "Has a dark past linked to the victim",
      "motive_seed": "Desire to silence the victim's knowledge",
      "motive_strength": "strong",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel access"
      ],
      "behavioral_tells": [
        "nervous when discussing the victim"
      ],
      "stakes": "Protecting his reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "assistant",
      "relationships": [
        "worked for Dr. Finch"
      ],
      "public_persona": "Dedicated and loyal",
      "private_secret": "Knew about the victim's research",
      "motive_seed": "Fear of exposure",
      "motive_strength": "moderate",
      "alibi_window": "7:45 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel staff access"
      ],
      "behavioral_tells": [
        "defensive when questioned"
      ],
      "stakes": "Her job and reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "guest",
      "relationships": [],
      "public_persona": "Charming and sociable",
      "private_secret": "Has a crush on Captain Hale",
      "motive_seed": "Jealousy",
      "motive_strength": "weak",
      "alibi_window": "8:00 PM to 8:45 PM",
      "access_plausibility": "low",
      "opportunity_channels": [
        "guest access"
      ],
      "behavioral_tells": [
        "excessively friendly"
      ],
      "stakes": "Winning Hale's affection",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "businessman",
      "relationships": [
        "business rival of Captain Hale"
      ],
      "public_persona": "Ruthless and ambitious",
      "private_secret": "Wants to ruin Hale's career",
      "motive_seed": "Professional rivalry",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel access"
      ],
      "behavioral_tells": [
        "arrogant demeanor"
      ],
      "stakes": "Gaining the upper hand in business",
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
      "summary": "A mechanical clock-tampering leads to the mysterious death of Dr. Mallory Finch at a seaside hotel. As the storm brews outside, Eleanor Voss uncovers a web of deceit and hidden motives among the hotel guests."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, witnes, and noted to expose the false timing.",
      "delivery_path": [
        {
          "step": "The clock was rewound and set to an earlier time, misleading investigators."
        }
      ]
    },
    "outcome": {
      "result": "The apparent time of death was manipulated to create an alibi."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred at the time indicated by the hotel clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appeared to be functioning normally, and witnesses corroborated the time.",
    "what_it_hides": "The clock was rewound, creating a false timeline for the murder."
  },
  "false_solution": {
    "accused_suspect": "Hugo Vane",
    "supporting_points": [
      "Witnesses saw him arguing with Dr. Finch shortly before her death.",
      "He stood to gain from her research being suppressed."
    ],
    "the_one_flaw": "He was in the hotel bar during the time of death, as confirmed by multiple witnesses.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A heated argument was overheard between Dr. Finch and Captain Hale.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was about a professional disagreement, not a motive for murder.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A suspicious package was found in the victim's room, leading to speculation of blackmail.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The package contained medical supplies for an unrelated case.",
      "resolved_in_chapter": 5
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
    "rationale": "All suspects were present at the hotel during the time of the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "clock time noted by witnesses",
        "witness statements regarding timelines"
      ],
      "windows": [
        "8:00 PM to 9:00 PM"
      ],
      "contradictions": [
        "Witness A claims the clock struck 8:15 PM, but others heard noises at 8:45 PM."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Hugo Vane"
      ],
      "objects": [
        "the clock",
        "the murder weapon"
      ],
      "permissions": [
        "authorized access to the victim's room"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be tampered with to misrepresent time."
      ],
      "traces": [
        "Fingerprints found on the clock mechanism."
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses agreed on timelines, creating a false sense of security."
      ],
      "authority_sources": [
        "Hotel management's account of the clock's maintenance."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witness A noted the clock striking quarter past eight just before the murder.",
        "correction": "The clock's time indicates the victim was murdered at that time.",
        "effect": "Narrows alibi window to Captain Hale, who claimed he was elsewhere.",
        "required_evidence": [
          "Witness A's statement about the clock time.",
          "Hotel records indicating the clock's last maintenance."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock's mechanism shows signs of recent tampering.",
        "correction": "The clock was altered to misrepresent the time of death.",
        "effect": "Eliminates Beatrice Quill, who had no access to the clock.",
        "required_evidence": [
          "Hotel maintenance records.",
          "Testimony from the hotel manager about clock access."
        ],
        "reader_observable": true
      },
      {
        "observation": "A fine layer of oil was discovered on the clock hands.",
        "correction": "The oil suggests recent handling by someone familiar with clock mechanics.",
        "effect": "Narrows access to Captain Hale and Hugo Vane, who have mechanical knowledge.",
        "required_evidence": [
          "Oil trace found on the clock.",
          "Captain Hale's background in engineering."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Reenact the clock's striking sequence to reveal the discrepancy in the time.",
    "knowledge_revealed": "The clock shows a different time than previously stated by witnesses.",
    "pass_condition": "The clock must strike at an unexpected time, proving it was tampered with.",
    "evidence_clues": [
      "clue_8",
      "clue_core_contradiction_chain",
      "clue_1",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness A's statement (early) indicates the time of death. Step 2: The clock's mechanism tampering (mid) reveals the clock was altered. Step 3: The oil traces (discriminating test) confirm the tampering was intentional."
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
        "Observe the results of the clock’s striking",
        "Draw conclusion about the tampering"
      ],
      "test_type": "mechanical evidence"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her alibi and lack of access to the clock.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness A confirms her location during the murder.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: n/a",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 8:00 PM to 9:30 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of clock tampering."
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_9",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_late_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Examination of the clock mechanism"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a charismatic traveling journalist drawn into a web of intrigue at a seaside hotel, where her quest for truth becomes personal.",
    "publicPersona": "With a pen in hand and a sparkle in her eye, Eleanor is known for her engaging articles that breathe life into local culture. Her ability to charm her way into the hearts of her readers—and her subjects—has made her a beloved figure in the community.",
    "privateSecret": "Beneath her affable exterior, Eleanor has been pursuing a scandal involving the hotel staff, an investigation she has kept under wraps for fear of jeopardizing her reputation.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "She was at the hotel bar during the evening, nursing a drink and mingling with guests.",
    "accessPlausibility": "easy",
    "stakes": "For Eleanor, the stakes are not just about writing a compelling article; they are also tied to her personal integrity as a journalist. She seeks the truth she has been avoiding.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a lively cadence, often punctuating her observations with a wry smile. She tends to ask rhetorical questions that invite reflection rather than demand answers.",
    "signatureTic": "\"Curiosity killed the cat, but satisfaction brought it back.\"",
    "internalConflict": "Eleanor grapples with the fear that exposing the truth could harm innocent people, pitting her journalistic duty against her moral compass.",
    "personalStakeInCase": "This crime matters to Eleanor because it could either validate her instincts as a journalist or expose her own failings in the pursuit of truth.",
    "paragraphs": [
      "Eleanor Voss arrived at the seaside hotel with her usual blend of enthusiasm and trepidation. Known for her engaging articles on local culture, she was not just a journalist; she was a storyteller, weaving narratives that captivated her readers. Yet, beneath her charismatic exterior lay a restless spirit, one that had been investigating a scandal involving the hotel staff for her next piece. The thrill of uncovering a secret was intoxicating, but it came with its own set of burdens.",
      "As she mingled with guests at the hotel bar, Eleanor's sharp eyes scanned the room, ever the observer. She had a knack for making people feel at ease, often drawing them into conversation with her quick wit. \"Curiosity killed the cat, but satisfaction brought it back,\" she would quip, eliciting chuckles while masking her own anxieties. Her probing questions, often rhetorical, revealed her desire to uncover the truth, even when that truth was uncomfortable.",
      "Yet, as the night unfolded and the shadows of scandal loomed larger, Eleanor found herself torn. The investigation she had embarked upon had taken a darker turn, leading her to confront the very truth she had been skirting around. The stakes were no longer just about her next article; they were about her integrity as a journalist. Would she expose the hotel staff's secrets, potentially harming innocent people, or would she protect them and risk her own credibility?",
      "Eleanor's internal conflict simmered beneath her composed facade. She feared that her pursuit of truth could lead to devastating revelations—not just for others but for herself as well. The weight of her choices pressed heavily upon her shoulders as she navigated the treacherous waters of deceit and betrayal, determined to uncover the truth but uncertain of the cost."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, hides a dark secret that could unravel her career and reputation in the tight-knit community.",
    "publicPersona": "With a calm demeanor and a reassuring presence, Dr. Mallory Finch is well-liked in the community, respected for her medical expertise and her dedication to her patients.",
    "privateSecret": "Behind her professional facade, Mallory has engaged in unethical medical practices, driven by greed and a desire to maintain her lifestyle.",
    "motiveSeed": "The victim possessed knowledge of her dubious practices that could lead to the loss of her medical license.",
    "motiveStrength": "strong",
    "alibiWindow": "She claimed to be in her room attending to patients via phone during the murder.",
    "accessPlausibility": "possible",
    "stakes": "Mallory's stakes are high; she must protect her reputation and her medical practice at all costs.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory speaks in a measured, clinical tone, often using medical jargon. When pressed, she becomes defensive, her words clipped and precise.",
    "signatureTic": "\"Let's not complicate things unnecessarily.\"",
    "internalConflict": "Mallory is haunted by the fear that her unethical choices will be exposed, forcing her to confront the moral decay beneath her polished exterior.",
    "personalStakeInCase": "This crime matters to Mallory because it represents the precarious balance of her career; the exposure of her secrets could lead to her downfall.",
    "paragraphs": [
      "Dr. Mallory Finch entered the hotel with an air of authority, her calm demeanor masking the turmoil within. Respected by her peers and well-liked by her patients, she was the epitome of professionalism. Yet beneath that polished exterior lay a woman grappling with the consequences of her choices. Her involvement in unethical medical practices was a well-guarded secret, one that had the potential to unravel her carefully constructed life.",
      "As she mingled with colleagues and guests, Mallory's words were precise and clinical, often laced with medical jargon that only served to highlight her detachment. \"Let's not complicate things unnecessarily,\" she would say, a phrase that became her shield against probing questions. Her ability to maintain composure in social situations had always been her strength, but the mounting pressure of her concealed sins began to weigh heavily on her conscience.",
      "The victim, a former patient, had threatened to expose her practices, a fact that gnawed at her insides. As the night wore on, Mallory found herself increasingly paranoid, acutely aware of the eyes that scrutinized her every move. The stakes rose with each passing moment, the fear of losing her medical license looming over her like a dark cloud. Would her past finally catch up to her, or could she continue to manipulate the narrative in her favor?",
      "Mallory's internal conflict manifested in the fleeting moments of doubt that crept into her mind. She was a woman torn between ambition and morality, the weight of her choices pressing down on her as she faced the possibility of exposure. The facade she had so carefully constructed was at risk of crumbling, and as the shadows deepened, she realized that the truth she had tried to bury might soon be brought to light."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, grapples with the ghosts of his past as he becomes embroiled in a murder investigation that threatens his legacy.",
    "publicPersona": "With a sturdy frame and an authoritative presence, Captain Ivor Hale often reminisces about his naval days, commanding respect from those around him.",
    "privateSecret": "Burdened by PTSD from his service, Ivor's erratic behavior at times puts him at odds with his former self.",
    "motiveSeed": "The victim knew of his wartime actions that could tarnish his reputation, creating a motive steeped in fear.",
    "motiveStrength": "strong",
    "alibiWindow": "He was seen engaging with other guests in the lobby during the evening.",
    "accessPlausibility": "easy",
    "stakes": "Ivor's stakes are high, as he must protect his legacy and reputation from the shadows of his past.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a gruff authority, often punctuating his statements with dry humor. His storytelling is punctuated by vivid imagery, reflecting his naval experiences.",
    "signatureTic": "\"In my day, we faced far worse than this.\"",
    "internalConflict": "Ivor struggles with the memories of his past actions and the possibility of exposure, caught between the man he was and the man he has become.",
    "personalStakeInCase": "This crime matters deeply to Ivor because it threatens to unearth the secrets of his past, jeopardizing the legacy he has fought to uphold.",
    "paragraphs": [
      "Captain Ivor Hale strode into the hotel lobby with the kind of confidence that only a retired naval officer could muster. His sturdy frame and authoritative demeanor commanded respect, but beneath the surface lay a man haunted by the ghosts of his past. The war had left scars that ran deeper than the skin, and the memories of his service often surfaced in moments of weakness. He was a man at war with himself, grappling with the erratic behavior that stemmed from PTSD.",
      "In conversations, Ivor often reminisced about his naval days, weaving tales of valor and courage that captivated his audience. \"In my day, we faced far worse than this,\" he would declare, a sardonic edge to his voice. Yet, as he shared these stories, he could feel the weight of his past actions pressing down on him, threatening to surface at the most inconvenient times. The victim, a man who knew too much about his wartime decisions, had become a ticking time bomb in Ivor's life.",
      "As the evening progressed, Ivor's concern grew. He had seen the victim engaging with other guests, and the realization that the man could expose the dark chapters of his past sent shivers down his spine. The stakes were high; the legacy he had fought to protect was at risk of crumbling. Would he be able to silence the whispers of his past, or was the truth destined to emerge like a specter from the depths?",
      "Ivor's internal conflict was a constant battle, one that left him weary and on edge. He was a man caught between his desire for redemption and the fear of exposure. The weight of his choices loomed over him as he navigated the murky waters of deceit, knowing that the truth about his past could shatter the carefully constructed facade he had built. In the shadows of the hotel, he faced the ultimate test of character, one that would determine whether he could finally confront his demons."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a flamboyant socialite, hides a desperate secret that could shatter her glamorous facade and plunge her into financial ruin.",
    "publicPersona": "With her charm and charisma, Beatrice is the life of any social gathering, captivating those around her with her flamboyant personality and infectious laughter.",
    "privateSecret": "Beneath her glittering exterior, Beatrice is embroiled in deep financial trouble, resorting to embezzlement to maintain her lavish lifestyle.",
    "motiveSeed": "She stands to inherit a significant sum from the victim’s trust fund should the victim die, a motive steeped in desperation.",
    "motiveStrength": "compelling",
    "alibiWindow": "She claimed to be at a dinner party with other guests, surrounded by laughter and clinking glasses.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are nothing less than financial security and the preservation of her social standing.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks in an animated, effervescent manner, often punctuating her sentences with dramatic flair. Her laughter is infectious, but there’s an underlying sharpness to her words.",
    "signatureTic": "\"We mustn't be boring, darling!\"",
    "internalConflict": "Beatrice is torn between her desire for financial security and the moral implications of her actions, struggling to maintain her glamorous image while concealing the truth.",
    "personalStakeInCase": "This crime matters to Beatrice because it could either secure her future or lead to her downfall, hinging on the choices she makes in the coming days.",
    "paragraphs": [
      "Beatrice Quill glided into the hotel lobby like a whirlwind of color and laughter, her flamboyant personality illuminating the dim surroundings. Known for her charm, she was the life of every social gathering, captivating her audience with animated stories and infectious laughter. Yet beneath the glittering facade lay a woman drowning in financial troubles, resorting to embezzlement to maintain the lavish lifestyle she had come to expect.",
      "As she mingled with guests, Beatrice's words flowed like champagne, effervescent and full of life. \"We mustn't be boring, darling!\" she would exclaim, her voice a melodic accompaniment to the clinking of glasses. However, there was a sharpness to her humor, a polite savagery that hinted at the desperation lurking beneath her vibrant exterior. The threat of exposure loomed over her like a dark cloud, casting a shadow over her otherwise glamorous existence.",
      "The murder of the victim had thrown her into a whirlwind of uncertainty. The prospect of inheriting a significant sum from the victim’s trust fund should the worst occur fueled her internal conflict. Beatrice found herself wrestling with the moral implications of her actions, torn between the desire for financial security and the fear of losing everything she held dear. The stakes had never been higher, and she was acutely aware of the precariousness of her situation.",
      "As the night wore on, Beatrice's laughter became increasingly strained, her vibrant exterior cracking under the pressure. The tension in the air was palpable, and she knew that the choices she made in the coming days could either secure her future or lead to her downfall. In the midst of the chaos, she found herself at a crossroads, struggling to navigate the treacherous waters of deceit while desperately trying to maintain the facade of the glamorous socialite she had always been."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, the meticulous hotel manager, hides a scandalous secret that could shatter her career and reputation in the tightly-knit community.",
    "publicPersona": "Known for her efficiency and attention to detail, Sylvia runs a tight ship at the hotel, earning respect from guests and staff alike.",
    "privateSecret": "Sylvia is entangled in a secret relationship with the victim, a scandal that could ruin her career if exposed.",
    "motiveSeed": "The victim threatened to expose their affair, a looming scandal that could jeopardize her position.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claimed to be in her office during the murder, organizing paperwork to maintain her image of diligence.",
    "accessPlausibility": "easy",
    "stakes": "For Sylvia, the stakes are high as she must protect her job security and personal reputation.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with a calm, measured tone, often employing a dry wit to defuse tense situations. She has a tendency to be precise in her language, reflecting her meticulous nature.",
    "signatureTic": "\"Let's keep things professional, shall we?\"",
    "internalConflict": "Sylvia struggles with the tension between her professional obligations and the personal scandal that threatens to unravel her life.",
    "personalStakeInCase": "This crime matters to Sylvia because it could expose her secret relationship and jeopardize her career, forcing her to confront her past decisions.",
    "paragraphs": [
      "Sylvia Trent moved through the hotel with the grace of a seasoned manager, her efficiency and attention to detail earning her respect from staff and guests alike. She was the embodiment of professionalism, running a tight ship with a calm, measured demeanor. Yet, beneath the surface of her meticulously curated life lay a secret that could shatter her career—an affair with the victim that, if exposed, would unleash a scandal of epic proportions.",
      "In her interactions, Sylvia employed a dry wit to navigate the complexities of hotel management. \"Let's keep things professional, shall we?\" she would often remind her staff, a phrase that had become both a mantra and a shield. However, the tension of her secret weighed heavily on her conscience, a constant reminder of the precarious balance she had struck between her personal and professional lives.",
      "As news of the murder spread through the hotel, Sylvia's heart raced. The victim had threatened to expose their affair, a threat that now loomed larger than ever. The stakes were high; her job security and personal reputation hung in the balance. She could feel the walls closing in, the pressure mounting as she tried to maintain her composure in the face of chaos.",
      "Sylvia's internal conflict became increasingly pronounced as she faced the reality of her situation. She was a woman caught between her professional obligations and the personal scandal that threatened to unravel her carefully constructed life. As the investigation unfolded, she was forced to confront the choices she had made, knowing that the truth could either liberate her or lead to her ultimate downfall."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a disillusioned veteran, harbors resentment against the victim for perceived betrayals, complicating his role in the murder investigation.",
    "publicPersona": "Withdrawn and cynical, Hugo is often seen alone at the bar, a shadow of the man he once was, shunning the company of others.",
    "privateSecret": "Hugo harbors deep resentment towards the victim for a perceived betrayal during the war that cost him comrades.",
    "motiveSeed": "He believes the victim sabotaged a mission, leading to devastating consequences, creating a motive steeped in vengeance.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claimed to be out for a walk during the murder, a solitary act that spoke to his withdrawn nature.",
    "accessPlausibility": "possible",
    "stakes": "For Hugo, the stakes are rooted in the desire for redemption and closure for his past.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Hugo speaks in terse, clipped sentences, often avoiding eye contact. His words are heavy with cynicism, revealing a man weary of the world.",
    "signatureTic": "\"What does it matter, anyway?\"",
    "internalConflict": "Hugo struggles with his feelings of betrayal and resentment, caught between his desire for revenge and the possibility of healing.",
    "personalStakeInCase": "This crime matters to Hugo because it represents a chance to confront his past and seek closure for the wounds that have festered within him.",
    "paragraphs": [
      "Hugo Vane sat at the bar, a solitary figure lost in his thoughts, his withdrawn demeanor a testament to the disillusionment that plagued him. Once a soldier, he had returned from the war a shell of the man he had been, burdened by the weight of memories that haunted him. He avoided the company of others, preferring the solace of his drink to the chatter of social gatherings. To him, the world had become a bleak and unforgiving place.",
      "As he sipped his whiskey, Hugo's words were blunt and devoid of embellishment. \"What does it matter, anyway?\" he would mutter when pressed for conversation, a phrase that encapsulated his cynicism. The victim, a man he believed had sabotaged a crucial mission during the war, had become the embodiment of his resentment. The loss of his comrades weighed heavily on his conscience, fueling a desire for vengeance that simmered just beneath the surface.",
      "The murder had stirred something within him, a conflict he could no longer ignore. The stakes were not just about the crime; they were about confronting the ghosts of his past that had haunted him for far too long. Hugo's internal struggle intensified as he grappled with the notion of redemption. Could he find closure for the wounds that had festered within him, or would he remain trapped in a cycle of bitterness and resentment?",
      "As the investigation unfolded, Hugo found himself at a crossroads. He was a man caught between the desire for revenge and the possibility of healing. The crime mattered to him not only as a suspect but as a chance to confront the demons of his past. In the shadows of the hotel, he faced the ultimate test of character, one that would determine whether he could finally reconcile with the choices he had made and the man he had become."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Oceanview Grand Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A luxurious seaside hotel with art deco elegance, frequented by both leisure travelers and business guests seeking respite from the post-war tension.",
    "visualDescription": "The hotel boasts a sweeping facade of smooth white stucco, accented with chrome and glass. Inside, the lobby features soaring ceilings adorned with geometric patterns, plush velvet sofas, and a grand chandelier that casts a warm glow over polished marble floors.",
    "atmosphere": "An unsettling blend of opulence and underlying dread, reflecting the tensions of post-war society.",
    "paragraphs": [
      "The Oceanview Grand Hotel stands defiantly against the turbulent sea, its art deco lines both beautiful and stark against the gray skies. Guests arrive with a mix of anticipation and unease, their laughter echoing through the grand lobby, a stark contrast to the somber whispers of the war that lingers in their minds. The scent of salt air mingles with the rich aroma of freshly brewed coffee, creating an odd comfort in this place of refuge.",
      "As the day wears on, the hotel seems to transform under the weight of the overcast sky. The once vibrant chatter of vacationers is now tinged with anxiety, as the distant rumble of thunder warns of the storm brewing offshore. Outside, the waves crash violently against the cliffs, while inside, the flickering lights cast long shadows, heightening the sense of foreboding that permeates the air.",
      "Evening descends, and the hotel takes on an intimate character, cloaked in the warm glow of lamps and the muffled sounds of conversation. Yet, beneath the surface of this facade of luxury lies an unsettling tension. Guests glance nervously at the staff, aware of the ever-present hierarchy, as the clock ticks down to an unknown reckoning. The Oceanview Grand is not just a hotel; it is a stage for secrets, a place where every smile may hide a deeper truth."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of coastal climates",
    "timeFlow": "Three days of mounting tension, leading to a climactic revelation",
    "mood": "Tense and uncertain, reflecting the post-war societal anxieties",
    "eraMarkers": [
      "Art deco architecture",
      "Post-war automobiles",
      "Radio broadcasts in the lobby"
    ],
    "sensoryPalette": {
      "dominant": "Churning sea and distant thunder",
      "secondary": [
        "Rich coffee and damp earth",
        "Flickering candlelight in the corners"
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of impending rain, heavy and charged with electricity. Waves crash against the cliffs, a constant reminder of nature's raw power, while the distant rumble of thunder echoes the tensions of the human heart. The hotel, with its grand facade, stands resilient yet vulnerable, a sanctuary for those seeking solace from the chaos of the outside world.",
      "As dusk falls, the flickering candlelight casts dancing shadows across the lobby. The chatter of guests fades into a murmur, replaced by the rhythmic tick of the clock, each second amplifying the growing sense of urgency. Outside, the storm brews, and within these walls, secrets lie in wait, ready to surface as the night deepens."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Grand Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A dimly-lit room lined with dark mahogany bookshelves, filled with leather-bound tomes. A large, ornate desk sits in the center, cluttered with papers and a solitary flickering lamp.",
      "sensoryDetails": {
        "sights": [
          "dust motes in the lamplight",
          "shadows creeping along the walls",
          "scattered papers on the desk",
          "weathered books on the shelves"
        ],
        "sounds": [
          "whispering pages turning",
          "soft footsteps on carpet",
          "the ticking of a wall clock",
          "distant thunder rumbling"
        ],
        "smells": [
          "old leather and ink",
          "musty paper",
          "smoke from a nearby fireplace",
          "wet earth seeping through the walls"
        ],
        "tactile": [
          "smooth leather-bound books",
          "cold brass lamp fittings",
          "soft carpet underfoot",
          "worn wooden desk surface"
        ]
      },
      "accessControl": "Accessible to guests during daylight hours; locked at night; staff only has access at all times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked window panes",
            "grey light filtering through curtains",
            "puddles forming outside"
          ],
          "sounds": [
            "steady rain against glass",
            "distant thunder rolling",
            "the creak of old wood"
          ],
          "smells": [
            "damp wood",
            "freshly brewed coffee",
            "wet paper"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light casting dull shadows",
            "faded upholstery on armchairs",
            "a single ray of light breaking through"
          ],
          "sounds": [
            "the clock ticking loudly",
            "the soft rustle of fabric",
            "a faint sound of waves crashing"
          ],
          "smells": [
            "old varnish",
            "dusty leather",
            "the scent of rain-soaked earth"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "dimly lit corners",
            "glimmers of candlelight",
            "long shadows stretching across the floor"
          ],
          "sounds": [
            "the crackle of a fire",
            "muffled voices from the lobby",
            "the distant chirping of crickets"
          ],
          "smells": [
            "smoky wood",
            "warm candle wax",
            "the faint scent of tobacco"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Library is a sanctuary of knowledge, yet it carries an air of foreboding. Shadows stretch across the room, and the flickering light of the solitary lamp creates a dance of uncertainty. Dust motes swirl in the air, illuminated by the dim glow, as if the very history of the hotel is whispering secrets to those who dare to listen. The scent of old leather and ink fills the space, mingling with the dampness that seeps through the walls.",
        "As the storm rages outside, the ticking clock seems to mock the stillness within. Papers scattered across the ornate desk tell tales of urgency and desperation, while the creaking floorboards echo the footsteps of those who tread carefully in search of truth. In this room, where knowledge and mystery intertwine, the line between past and present blurs, leading to a confrontation that is both inevitable and terrifying."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Oceanview Dining Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "An elegant room with large windows offering stunning ocean views, adorned with crystal chandeliers and fine china set for dinner.",
      "sensoryDetails": {
        "sights": [
          "crystal chandeliers glimmering",
          "white tablecloths billowing slightly",
          "waves crashing against the shore"
        ],
        "sounds": [
          "clinking cutlery",
          "soft laughter",
          "the murmur of conversations"
        ],
        "smells": [
          "roasted meat and fresh bread",
          "sea salt and butter",
          "the scent of blooming flowers"
        ],
        "tactile": [
          "smooth porcelain plates",
          "soft linen napkins",
          "cool glassware"
        ]
      },
      "accessControl": "Open to all guests during meal times; staff only during preparation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through rain-streaked windows",
            "empty tables awaiting guests"
          ],
          "sounds": [
            "the soft pitter-patter of rain",
            "distant thunder rumbling"
          ],
          "smells": [
            "freshly baked pastries",
            "coffee brewing",
            "the scent of rain-soaked earth"
          ],
          "mood": "melancholic anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting muted colors",
            "damp tablecloths clinging to chairs"
          ],
          "sounds": [
            "the hum of conversation",
            "the clatter of plates being cleared",
            "the distant crash of waves"
          ],
          "smells": [
            "herbs and spices wafting",
            "freshly cut flowers",
            "the salty breeze from the ocean"
          ],
          "mood": "tense chatter"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling across tables",
            "glimmers of candlelight reflecting off glassware"
          ],
          "sounds": [
            "the gentle strumming of a guitar",
            "laughter ringing through the air",
            "the soft rustling of menus"
          ],
          "smells": [
            "grilled fish and roasted vegetables",
            "the sweet scent of dessert",
            "the warmth of baked bread"
          ],
          "mood": "festive yet uneasy"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room hums with life, the crystal chandeliers casting a warm glow over the elegantly set tables. Guests gather, their conversations a blend of laughter and whispered secrets, as they enjoy the culinary delights prepared by the hotel's talented chefs. The scent of roasted meat and fresh bread wafts through the air, mingling with the salty tang of the ocean just outside. Yet, beneath the surface of this festive atmosphere lies an undercurrent of tension, as unspoken words linger in the corners.",
        "As evening approaches, the room transforms into a haven of light and warmth, the golden glow inviting. Yet, the laughter rings hollow against the backdrop of distant thunder, a reminder of the storm raging outside. With each clink of cutlery, the guests remain acutely aware of the shadows lurking at the periphery of their gathering, each one a potential witness to the unfolding mystery that binds them together."
      ]
    },
    {
      "id": "staff_quarters",
      "name": "Staff Quarters",
      "type": "interior",
      "purpose": "Restricted access area",
      "visualDetails": "A small, utilitarian space with narrow corridors and modest rooms, adorned with the bare necessities for hotel staff.",
      "sensoryDetails": {
        "sights": [
          "dimly lit corridors",
          "faded wallpaper peeling at the edges",
          "uniforms hanging on hooks"
        ],
        "sounds": [
          "soft footsteps on linoleum",
          "whispers of staff sharing secrets",
          "the ticking of a wall clock"
        ],
        "smells": [
          "cleaning supplies and bleach",
          "the faint scent of food from the kitchen",
          "musty air"
        ],
        "tactile": [
          "cold metal door handles",
          "rough fabric of uniforms",
          "smooth linoleum underfoot"
        ]
      },
      "accessControl": "Staff only; locked outside of working hours; guests prohibited.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water dribbling down window panes",
            "shadows of staff moving hurriedly"
          ],
          "sounds": [
            "the patter of rain on the roof",
            "the shuffling of feet",
            "the distant sound of thunder"
          ],
          "smells": [
            "wet earth",
            "clean linens",
            "the scent of damp wood"
          ],
          "mood": "hasty tension"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "gloomy light filtering through small windows",
            "staff moving about in silence"
          ],
          "sounds": [
            "low murmurs of conversation",
            "the creak of floorboards",
            "the soft clattering of dishes"
          ],
          "smells": [
            "freshly cleaned surfaces",
            "the scent of food wafting from the kitchen",
            "dampness in the air"
          ],
          "mood": "suspicious quiet"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft light from a single bulb",
            "hastily arranged supplies on shelves"
          ],
          "sounds": [
            "the distant laughter from the dining room",
            "the soft ticking of a clock",
            "the rustle of uniforms being put away"
          ],
          "smells": [
            "the scent of fading flowers",
            "the lingering aroma of dinner",
            "the sharpness of cleaning products"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Staff Quarters are a world apart from the elegance of the hotel, a space of necessity rather than comfort. Dimly lit corridors echo with the whispers of staff sharing secrets, their voices barely rising above the soft ticking of the clock. The air is thick with the scent of cleaning supplies, a reminder of the ever-present need for order amidst chaos. Here, the sense of urgency is palpable, as each staff member knows their role in the delicate balance of service and secrecy.",
        "As the day draws to a close, the atmosphere shifts. The distant laughter from the dining room serves as a backdrop to the hushed conversations of the staff, each glance shared laden with unspoken worries. The quarters, though modest, hold the weight of countless secrets, each room a potential witness to the mysteries unfolding within the hotel. In this space, the line between servant and guest blurs, as the truth waits to be uncovered."
      ]
    },
    {
      "id": "oceanfront",
      "name": "The Oceanfront Terrace",
      "type": "exterior",
      "purpose": "Outdoor gathering space",
      "visualDetails": "A wide terrace overlooking the turbulent sea, lined with wrought iron railings and scattered seating areas, offering stunning views and fresh sea air.",
      "sensoryDetails": {
        "sights": [
          "waves crashing against the rocks",
          "dark clouds swirling overhead",
          "seagulls circling above"
        ],
        "sounds": [
          "howling wind",
          "the roar of the ocean",
          "distant thunder"
        ],
        "smells": [
          "salt spray and brine",
          "freshly cut grass",
          "the scent of wet sand"
        ],
        "tactile": [
          "cool metal railing",
          "rough stone underfoot",
          "the chill of the sea breeze"
        ]
      },
      "accessControl": "Open to all guests during day; restricted during storms; monitored by staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain falling on the terrace",
            "puddles forming near the edge"
          ],
          "sounds": [
            "the soft patter of raindrops",
            "the distant crash of waves",
            "the rustling of wet leaves"
          ],
          "smells": [
            "damp seaweed",
            "the scent of rain-soaked earth",
            "fresh ocean air"
          ],
          "mood": "melancholic reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds casting shadows",
            "the sea appearing leaden"
          ],
          "sounds": [
            "the wind whipping through the railings",
            "the rhythmic crashing of waves",
            "the distant sound of thunder"
          ],
          "smells": [
            "wet grass",
            "the sharpness of salt air",
            "the scent of rain approaching"
          ],
          "mood": "foreboding tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the sun setting over the horizon",
            "fiery colors reflecting on the water"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "laughter from nearby tables",
            "the soft whisper of the breeze"
          ],
          "smells": [
            "grilled seafood",
            "the sweetness of blooming flowers",
            "the freshness of the evening air"
          ],
          "mood": "tranquil unease"
        }
      ],
      "paragraphs": [
        "The Oceanfront Terrace offers a breathtaking view, yet the crashing waves and howling wind create an unsettling atmosphere. Guests gather here, drawn by the beauty of the sea, but the dark clouds overhead hint at the storm brewing not just in the sky, but within the hotel itself. The scent of salt spray mingles with the damp earth, creating a heady mix that fills the air with tension.",
        "As evening approaches, the terrace transforms into a space of fleeting tranquility, the sunset casting a warm glow over the tumultuous sea. Yet, the laughter of guests is laced with an undercurrent of unease, as each glance at the horizon reminds them of the storm to come. In this moment, the terrace serves as a reminder that beauty and danger often exist side by side, a perfect metaphor for the mysteries that lie within the Oceanview Grand Hotel."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023416074,
  "durationMs": 31577
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1941,
    "month": "July",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "July",
    "weather": [
      "overcast skies with occasional rain showers",
      "humidity clinging to the air",
      "cool breezes from the nearby coast"
    ],
    "daylight": "Long summer days with daylight lasting until around nine o'clock, though clouds often obscure the sun.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when shadows lengthen and the hotel is quiet.",
    "holidays": [
      "Independence Day (July 4) celebrated with parades and fireworks earlier this month"
    ],
    "seasonalActivities": [
      "evening strolls along the beach",
      "attending local fairs and carnivals",
      "picnics in coastal parks"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "white dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "lightweight khaki shorts",
        "button-up short-sleeve shirt",
        "canvas loafers"
      ],
      "accessories": [
        "wide-brimmed fedora",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with floral patterns",
        "pearl necklace",
        "matching clutch purse"
      ],
      "casual": [
        "sleeveless blouse with a high-waisted skirt",
        "cotton sundress",
        "canvas espadrilles"
      ],
      "accessories": [
        "straw sun hat",
        "cat-eye sunglasses",
        "silk scarf tied around the neck"
      ]
    },
    "trendsOfTheMoment": [
      "bold patterns and colors in clothing",
      "increased popularity of practical yet stylish footwear",
      "rise of lightweight fabrics for summer wear"
    ],
    "socialExpectations": [
      "men are expected to wear suits in public settings",
      "women are increasingly seen in the workforce, balancing fashion with practicality",
      "formal events still require adherence to traditional attire codes"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Operation Barbarossa begins as Germany invades the Soviet Union",
      "the U.S. debates the Lend-Lease Act to support allies",
      "tensions rise in the Pacific as Japan prepares for further expansion"
    ],
    "politicalClimate": "The United States is grappling with its role in a world increasingly divided by war, with strong isolationist sentiments clashing with those advocating for intervention.",
    "economicConditions": "The economy is experiencing strain due to wartime production, with rationing beginning to take hold as resources are diverted to the war effort.",
    "socialIssues": [
      "racial segregation and tensions in various states",
      "women's rights and presence in the workforce growing due to wartime needs",
      "the impact of war on family dynamics and community structures"
    ],
    "internationalNews": [
      "British forces face challenges in North Africa against Axis powers",
      "increased aerial bombings in London continue to affect civilian life"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - 'White Christmas'",
        "The Andrews Sisters - 'Boogie Woogie Bugle Boy'",
        "Duke Ellington - 'Take the 'A' Train'"
      ],
      "films": [
        "'Citizen Kane'",
        "'The Maltese Falcon'",
        "'How Green Was My Valley'"
      ],
      "theater": [
        "'The Glass Menagerie'",
        "'Life with Father'",
        "'South Pacific'"
      ],
      "radio": [
        "The Shadow",
        "Fibber McGee and Molly",
        "Lux Radio Theater"
      ]
    },
    "literature": {
      "recentPublications": [
        "'For Whom the Bell Tolls' by Ernest Hemingway",
        "'The Grapes of Wrath' by John Steinbeck",
        "'The Little Prince' by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "detective fiction",
        "war novels",
        "romantic fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first electronic computer, the Z3, developed in Germany",
        "advancements in radar technology for military applications",
        "early television broadcasts begin to emerge in urban areas"
      ],
      "commonDevices": [
        "radios in most households",
        "television sets in affluent homes",
        "telephone exchanges expanded to accommodate war communications"
      ],
      "emergingTrends": [
        "increased use of mechanization in factories",
        "development of military technology",
        "growing interest in home appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Bottle of milk: five pence"
      ],
      "commonActivities": [
        "gathering for community picnics",
        "engaging in local sports leagues",
        "participating in church-related events"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "neighborhood potlucks",
        "evening card games with friends"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased awareness of class disparities due to wartime efforts",
      "working-class solidarity strengthens as more women join the workforce"
    ],
    "gender": [
      "women are increasingly expected to take on roles outside the home",
      "traditional gender roles are being challenged",
      "expectations of femininity remain strong amidst changing dynamics"
    ],
    "race": [
      "racial tensions persist, especially in urban areas",
      "the civil rights movement is gaining momentum",
      "discussions around integration begin in some regions"
    ],
    "generalNorms": [
      "civic duty is highly valued, especially in support of the war",
      "community involvement is encouraged",
      "social gatherings are often focused on shared experiences and support"
    ]
  },
  "atmosphericDetails": [
    "The persistent scent of salt and damp earth hangs in the air, as the overcast sky looms heavily above the coastal hotel.",
    "The sound of distant thunder rumbles, adding an undercurrent of tension to the already charged atmosphere of the evening.",
    "Soft whispers of conversation intermingle with the faint crackle of a radio playing light music, creating an ambiance of unease and uncertainty."
  ],
  "paragraphs": [
    "In July 1941, the coastal hotel buzzes with a mix of anticipation and trepidation. The oppressive humidity fills the air, while dark clouds threaten to unleash a downpour at any moment. Guests, dressed in the latest summer fashions, navigate the lobby with a sense of purpose, yet a palpable tension underlies their interactions. With the looming specter of war casting its shadow, the atmosphere is thick with unspoken worries about loved ones fighting overseas and the uncertainty of the future.",
    "Men in double-breasted suits and women adorned in elegant tea-length dresses find themselves caught between style and the practicalities of life in wartime. The vibrant patterns of their outfits reflect a world striving for normalcy, yet the glances exchanged between strangers reveal a common understanding of the anxiety that pervades their lives. Hats are tipped and smiles exchanged, but there is an underlying urgency to their demeanor, as they navigate the complexities of a society in flux.",
    "Daily life unfolds with a mix of routine and disruption. The sound of laughter echoes from the beach where families gather for picnics, even as whispers of racial tensions and economic strain simmer beneath the surface. Prices for everyday goods fluctuate, with rationing beginning to affect even the simplest luxuries. Sunday dinners and neighborhood gatherings foster a sense of community, but the shadow of the war looms large, influencing conversations and decisions as everyone grapples with their place in an uncertain world."
  ],
  "note": "",
  "cost": 0.001092333,
  "durationMs": 23466
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering of diverse guests at a coastal hotel for a conference becomes a pressure cooker of tension and secrets, exacerbated by post-war anxieties and the isolation of a brewing storm.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Post-WWII trauma has reshaped class dynamics, with increased women in the workforce challenging traditional roles, while the looming Cold War heightens social pressures and mistrust."
  },
  "setting": {
    "location": "A seaside hotel featuring art deco architecture, with a grand lobby and ocean-view rooms.",
    "institution": "hotel",
    "weather": "Overcast with occasional rain, typical of coastal climates."
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
    "id": "clock_time_of_death",
    "value": "ten minutes past eight",
    "description": "The time indicated on the clock at the moment of discovery."
  },
  {
    "id": "witness_clock_time",
    "value": "a quarter to nine",
    "description": "The time a witness states they heard the clock strike."
  },
  {
    "id": "previous_setting_time",
    "value": "seven o'clock",
    "description": "The last known correct setting of the clock before tampering."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 21,
  "countsByPlacement": {
    "early": 8,
    "mid": 12,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 20,
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
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
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
      "category": "behavioral"
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
      "category": "physical"
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
      "id": "clue_9",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_1",
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
      "id": "clue_fp_contradiction_step_1",
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
