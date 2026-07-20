# Actual Prompt Record

- Run ID: `mystery-1784568348619`
- Project ID: ``
- Timestamp: `2026-07-20T17:29:35.076Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `f3f68ba2e84c7dfd`

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
    "title": "The Clock's Deceit",
    "author": "ChatGPT",
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
      "subtype": "mechanical tampering"
    }
  },
  "death_method": "strangled with a silk scarf",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Sharp-witted and observant",
      "private_secret": "Has a hidden past in military intelligence",
      "motive_seed": "Desire for justice",
      "motive_strength": "strong",
      "alibi_window": "nine to ten PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel corridors",
        "public lounge"
      ],
      "behavioral_tells": [
        "calm under pressure",
        "keen observer"
      ],
      "stakes": "Solving the case to redeem her past",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "witness",
      "relationships": [
        "Former colleague of the victim"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Had a heated argument with the victim earlier",
      "motive_seed": "Professional rivalry",
      "motive_strength": "moderate",
      "alibi_window": "eight to nine PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "medical supplies room",
        "guest quarters"
      ],
      "behavioral_tells": [
        "nervous fidgeting",
        "avoidance of eye contact"
      ],
      "stakes": "Reputation in the medical community",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "suspect",
      "relationships": [
        "Old friend of the victim"
      ],
      "public_persona": "Charismatic and charming",
      "private_secret": "Harbors jealousy towards the victim's success",
      "motive_seed": "Resentment",
      "motive_strength": "moderate",
      "alibi_window": "ten to eleven PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "lobby",
        "hotel terrace"
      ],
      "behavioral_tells": [
        "overly friendly",
        "defensive when questioned"
      ],
      "stakes": "Maintaining his social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [
        "Close friend of the victim"
      ],
      "public_persona": "Elegant and poised",
      "private_secret": "In love with the victim, but he rejected her",
      "motive_seed": "Heartbreak",
      "motive_strength": "strong",
      "alibi_window": "nine to ten PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "guest quarters",
        "hotel library"
      ],
      "behavioral_tells": [
        "frequent tearfulness",
        "outbursts of anger"
      ],
      "stakes": "Emotional vindication",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "suspect",
      "relationships": [
        "Maid at the hotel",
        "Friend of Beatrice"
      ],
      "public_persona": "Diligent and reliable",
      "private_secret": "Overheard a crucial conversation",
      "motive_seed": "Loyalty to Beatrice",
      "motive_strength": "moderate",
      "alibi_window": "eight to nine PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "service areas",
        "guest rooms"
      ],
      "behavioral_tells": [
        "nervous laughter",
        "excessive politeness"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "Businessman",
        "Friend of Captain Hale"
      ],
      "public_persona": "Wealthy and influential",
      "private_secret": "Involved in shady deals",
      "motive_seed": "Potential exposure of secrets",
      "motive_strength": "unknown",
      "alibi_window": "evening",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
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
      "summary": "At a seaside hotel, the murder of Hugo Vane reveals secrets and lies among a group of former military associates, leading Eleanor Voss to uncover the truth behind a rewound clock that misled everyone about the time of death."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock was rewound to make it appear that Hugo Vane was killed at a later time than he actually was.",
      "delivery_path": [
        {
          "step": "Captain Hale rewound the clock in the hotel lobby."
        }
      ]
    },
    "outcome": {
      "result": "The clock showed a time inconsistent with the actual time of death."
    }
  },
  "false_assumption": {
    "statement": "Hugo Vane was alive at ten o'clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses heard the clock chime at ten, indicating he was alive then.",
    "what_it_hides": "The clock was tampered with to create a false timeline."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch had a disagreement with Hugo Vane earlier in the evening.",
      "She was seen near the scene at the time of the murder."
    ],
    "the_one_flaw": "Dr. Finch's alibi is corroborated by several witnesses who saw her in the medical supplies room.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Dr. Finch's heated argument with Hugo earlier.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The argument was about professional matters, not personal animosity.",
      "resolved_in_chapter": 4
    },
    {
      "id": "red_herring_2",
      "description": "Captain Hale's jealousy over Hugo's success.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "Hale admired Hugo and would not resort to murder over jealousy.",
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
    "rationale": "All suspects were present at the hotel and had interactions with the victim."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock in hotel lobby shows incorrect time",
        "Witnesses heard clock chiming at ten"
      ],
      "windows": [
        "Nine PM to ten PM"
      ],
      "contradictions": [
        "Clock shows ten but victim was last seen alive at nine thirty."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale"
      ],
      "objects": [
        "Lobby clock"
      ],
      "permissions": [
        "Hale had access to the clock mechanism."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks cannot run backward without human intervention."
      ],
      "traces": [
        "Worn gears on the clock suggest recent tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Hale's perceived trustworthiness as a friend of the victim."
      ],
      "authority_sources": [
        "Captain Hale was a respected military figure."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the lobby shows a time of ten o'clock, contradicting the timeline.",
        "correction": "The clock must have been tampered with since the victim was last seen alive at nine thirty.",
        "effect": "Narrows time window of death.",
        "required_evidence": [
          "Clock in hotel lobby shows incorrect time",
          "Witnesses heard the clock chiming at ten"
        ],
        "reader_observable": true
      },
      {
        "observation": "Worn gears on the clock indicate recent tampering.",
        "correction": "Only someone with access to the clock could have tampered with it.",
        "effect": "Eliminates all suspects without access to the clock.",
        "required_evidence": [
          "Worn gears suggest recent tampering.",
          "Captain Hale had access to the clock mechanism."
        ],
        "reader_observable": true
      },
      {
        "observation": "Captain Hale appeared nervous when questioned about the clock.",
        "correction": "Hale's nervousness indicates he may have something to hide regarding the clock.",
        "effect": "Narrows suspect pool to Captain Hale.",
        "required_evidence": [
          "Witnesses testify about Hale's nervousness.",
          "Hale's access to the clock is verified."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, lobby, and o'clock against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, acces, and lobby.",
    "pass_condition": "If Hale cannot demonstrate the knowledge, it confirms his guilt.",
    "evidence_clues": [
      "clue_1",
      "clue_culprit_direct_1",
      "clue_7",
      "clue_culprit_direct_captain_ivor_hale"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's incorrect time (early) and witness statements (mid) let the reader see the contradiction. Step 2: The worn gears (mid) and Hale's access confirm the tampering. Step 3: Hale's nervousness (discriminating test) reveals his guilt."
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
      "test_type": "mechanical knowledge check"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her alibi is confirmed by multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her duties kept her occupied during the timeframe.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: nine to ten PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening",
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical evidence inspection"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Corroborated elimination"
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
        "clue_id": "clue_early_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a travel writer with an adventurous spirit, but her recent heartbreak ties her intimately to the murder victim, complicating her quest for truth.",
    "publicPersona": "Charming and sociable, Eleanor has a way of captivating audiences with her tales of far-off places and thrilling escapades. She’s a staple at social gatherings, her laughter ringing out like a bell, drawing people in with her magnetic charisma.",
    "privateSecret": "Beneath her charming exterior lies a heart bruised by betrayal; she had been secretly involved with Hugo, the victim, whose untimely death has left her not only grieving but also entangled in scandal.",
    "motiveSeed": "Eleanor was present for a press event at the hotel when the murder occurred, putting her in the thick of the investigation.",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have been in the hotel restaurant with colleagues from 8 to 9 PM, yet the walls of the establishment could whisper secrets she wishes to keep hidden.",
    "accessPlausibility": "easy",
    "stakes": "Rumors regarding her personal life have begun to tarnish her reputation as a writer, and Eleanor is desperate to clear her name and restore her standing in the literary world.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a rhythmic eloquence, often peppering her conversation with vivid imagery that mirrors her writing style. She tends to use metaphors and similes, making her dialogue engaging yet reflective.",
    "signatureTic": "‘Isn't it just like life?’",
    "internalConflict": "Eleanor grapples with guilt over her relationship with Hugo, feeling that her past choices have led to his demise. She questions whether her own heartache contributed to the tragedy.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it threatens not only her reputation but also the memory of the love she shared with Hugo, a love she now wishes to honor.",
    "paragraphs": [
      "Eleanor Voss was not just a travel writer; she was an explorer of the human condition, weaving tales that transcended the exotic locales she visited. Yet, as she stood in the dimly lit hotel restaurant, the clinking of silverware and hushed whispers around her felt like a cacophony of judgment. The recent death of Hugo Vane, the man she once loved, loomed over her like a storm cloud, casting shadows on her carefully crafted narrative of life. How could she reclaim her story when she was now a character in someone else’s tragedy?",
      "Her charm had always been her armor, but now it felt like a prison. Eleanor was aware of the rumors swirling like autumn leaves around her; whispers of a scandalous affair and the implications of being the lover of a dead man were not easily brushed aside. With every smile she forced, she felt the weight of expectation, her public persona crumbling under the scrutiny of those who once adored her. Each laugh felt like a betrayal to the memory of Hugo, who had filled her heart with both joy and despair.",
      "Eleanor's alibi was solid, yet every tick of the clock reminded her that time was a thief. She had been in the hotel restaurant, surrounded by colleagues, but the very fact that she was present at the scene of the crime felt like a noose tightening around her neck. What if the truth of her relationship with Hugo came to light? Could she bear to face the consequences of her actions? Her heart raced with the knowledge that the answers she sought could unravel her life further.",
      "As she delved deeper into the investigation, Eleanor began to confront her own feelings, realizing that her quest for truth was also a journey of healing. She sought not only to clear her name but to understand the tangled web of relationships that had led to Hugo's death. In the quiet moments, when she allowed herself to reflect, she felt a flicker of hope that perhaps through the chaos, she could find a way to honor Hugo's memory and emerge from the shadows of scandal."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose polished exterior conceals a tumultuous affair, leaving her vulnerable as the investigation unfolds.",
    "publicPersona": "Esteemed for her commitment to her patients and her philanthropic efforts, Dr. Mallory Finch is often seen as a beacon of hope in the community, with a reputation built on years of hard work and dedication.",
    "privateSecret": "However, beneath her professional façade lies a tumultuous secret; she has been entangled in a passionate affair with Captain Hale, a relationship that the victim threatened to expose.",
    "motiveSeed": "Mallory feared that Hugo's revelation of their affair would not only ruin her reputation but also jeopardize her career as a physician.",
    "motiveStrength": "moderate",
    "alibiWindow": "Mallory claims to have been in her office from 7:30 to 9:00 PM, a statement that could be easily verified but also raises questions about her whereabouts during the murder.",
    "accessPlausibility": "possible",
    "stakes": "Her professional reputation is on the line, and the fear of losing everything she has worked for looms large over her.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a calm and measured tone, often using medical jargon that reflects her profession. She occasionally drops sharp, witty remarks, revealing her intelligence and underlying frustration.",
    "signatureTic": "‘It’s a matter of life and death, really.’",
    "internalConflict": "Mallory is torn between her love for Ivor and the guilt of her betrayal, fearing that her choices may have led to Hugo's murder and questioning the morality of her actions.",
    "personalStakeInCase": "This case matters to Mallory not only because of the potential for professional ruin but also due to her complicated feelings for Ivor and the impact of Hugo's death on their lives.",
    "paragraphs": [
      "Dr. Mallory Finch was a woman of science, her life dedicated to healing others, yet the irony of her own emotional wounds was not lost on her. As she moved through the hotel’s corridors, her practiced smile felt like a mask, hiding the chaos brewing beneath the surface. The tension between her professional life and the personal scandal had reached a boiling point, and she could no longer separate the two. Each patient she treated felt like a reminder of her own vulnerabilities, her heart caught in a web of deceit and desire.",
      "Her affair with Captain Hale was a tempestuous secret, one she had convinced herself was worth the risk. Yet, now, with Hugo dead and the threat of exposure looming, she felt the walls closing in. The polished persona she had cultivated was at stake, and the thought of her colleagues discovering her indiscretions made her stomach churn. How could she face her peers, the very people who revered her for her contributions to medicine, if they knew she had allowed passion to cloud her judgment?",
      "Mallory's alibi was a double-edged sword; while it provided her with a semblance of safety, it also left her vulnerable to scrutiny. She had been in her office, but what had she truly been doing? The clock ticked mercilessly as she recalled the moments leading up to the murder. Had she miscalculated the risks? Each second felt like an eternity, and the thought of losing everything she had worked for gnawed at her insides like a relentless parasite.",
      "As the investigation unfolded, Mallory found herself at a crossroads, her internal conflict intensifying. The love she felt for Ivor was genuine, yet the guilt for her affair weighed heavily upon her conscience. The truth was a tangled mess, and she was caught in its grip, struggling to untangle her emotions from the sordid past. Perhaps this tragedy could serve as a catalyst for change, forcing her to confront not only her feelings for Ivor but also the true cost of her choices."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a charming naval officer caught in a love triangle, wrestling with the implications of his affections amidst a brewing scandal.",
    "publicPersona": "Ivor Hale, the gallant naval officer, is celebrated as a war hero, his charm and charisma winning the hearts of many. He navigates social circles with ease, embodying the ideal of bravery and honor.",
    "privateSecret": "Yet beneath the polished exterior lies a conflicted man, torn between his feelings for both Eleanor and Mallory, caught in a chaotic love triangle that threatens to unravel his carefully constructed life.",
    "motiveSeed": "Ivor feared losing both women if Hugo revealed their affair, a potential scandal that could tarnish his reputation.",
    "motiveStrength": "moderate",
    "alibiWindow": "He was seen talking to hotel staff in the lobby at 8:30 PM, a detail that could either serve as an alibi or raise further suspicion about his involvement.",
    "accessPlausibility": "possible",
    "stakes": "His romantic relationships and reputation as a war hero are on the line, and the thought of losing both women drives him to desperation.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Ivor speaks with a confident, almost theatrical flair, often using grandiose gestures. He has a tendency to make light of serious situations, masking his internal turmoil with humor and charm.",
    "signatureTic": "‘Ah, the trials of love!’",
    "internalConflict": "Ivor grapples with guilt over his relationships, feeling torn between his affections for Eleanor and Mallory, and the fear that his actions may have led to Hugo's death.",
    "personalStakeInCase": "This crime matters to Ivor because it threatens to expose not only his romantic involvements but also the very essence of his identity as a hero and a man.",
    "paragraphs": [
      "Captain Ivor Hale was a man of the sea, yet he found himself adrift in a tempest of emotions that threatened to capsize his carefully curated life. The adoration of the public felt like a burden; he was not just a war hero, but a man ensnared in a love triangle that had become increasingly complex. As he navigated the hotel lobby, he wore his charm like armor, but inside, he was a shipwreck waiting to happen, torn between two women who had captured his heart.",
      "His relationship with Mallory was intoxicating, a secret that filled him with both desire and dread. She was a woman of substance, a physician whose intellect challenged him. Yet, the pull toward Eleanor was undeniable; her adventurous spirit and laughter ignited a fire within him that he couldn’t extinguish. Now, with Hugo dead, Ivor felt the walls closing in, the fear of exposure gnawing at his insides like a relentless tide. How could he protect both women without losing himself in the process?",
      "Ivor's alibi was tenuous at best; being seen in the lobby talking to staff did little to shield him from suspicion. Each moment felt like a ticking clock, with every glance exchanged between the hotel guests filled with unspoken accusations. The weight of his choices bore down on him, and the thought of losing both women was a burden he could scarcely bear. Would he be remembered as a hero, or would his personal life become fodder for gossip and scandal?",
      "As the investigation unfolded, Ivor found himself at a crossroads. The truth felt like a double-edged sword, one that could either set him free or plunge him into deeper despair. He longed to confront his feelings and make a choice, yet the fear of the fallout kept him paralyzed. Perhaps this tragedy would force him to reckon with his emotions, and in doing so, he could finally chart a course toward redemption."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a wealthy socialite driven by ambition, whose desire to eclipse Eleanor leads her into a dangerous rivalry that could cost her everything.",
    "publicPersona": "As a wealthy socialite, Beatrice Quill is known for her lavish parties and keen eye for fashion. She thrives on attention, often positioning herself as the center of social gatherings, a queen in her own right.",
    "privateSecret": "Behind her glamorous facade lies a ruthless ambition; Beatrice desires to replace Eleanor as the leading figure in local society, and she has a history of sabotaging rivals to achieve her goals.",
    "motiveSeed": "Believing the victim stood in her way to gain the social spotlight, Beatrice's jealousy has festered into something more sinister.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claims to have been mingling with guests at the hotel bar from 8:00 to 9:00 PM, a statement that could either bolster her claim or expose her deceit.",
    "accessPlausibility": "possible",
    "stakes": "Her social status and upcoming events hinge on her reputation, and the thought of being implicated in a scandal threatens to unravel her carefully constructed world.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with an air of superiority, her sentences often punctuated by sharp observations about others. She has a penchant for sarcasm, and her dialogue reflects her keen awareness of social dynamics.",
    "signatureTic": "‘In my experience…’",
    "internalConflict": "Beatrice wrestles with her desire for social supremacy and the fear that her ambition may lead her down a dark path, questioning whether her actions are worth the cost.",
    "personalStakeInCase": "This case matters to Beatrice because her ambitions are at stake; being implicated in a murder could shatter her dreams of social prominence.",
    "paragraphs": [
      "Beatrice Quill was a woman who thrived on the spotlight, her life a carefully curated performance for all to see. With a laugh that could charm the most stoic of souls, she danced through social events like a butterfly—delicate yet dangerous. But behind the glitz and glamour lay a fierce ambition that burned like a fire, consuming all in its path. Her desire to eclipse Eleanor as the reigning social queen of the seaside town had driven her to the brink, and now, with Hugo dead, the stakes had never been higher.",
      "The whispers of rivalry between her and Eleanor were like a siren's song, luring her into dangerous waters. Beatrice had spent years building her social empire, and the thought of being overshadowed by someone she deemed inferior was intolerable. She had sabotaged rivals before, and as she surveyed the scene at the hotel bar, she felt a rush of adrenaline. Was it possible that Hugo’s death could be the opportunity she needed to solidify her place at the top? The thought both thrilled and terrified her.",
      "Her alibi was a delicate thread, one that could easily unravel if pulled. Mingling with guests at the bar had given her a façade of innocence, but Beatrice knew that appearances could be deceiving. Each glance exchanged with other guests felt like a calculated move in a high-stakes game, and the weight of her ambition pressed down on her like a heavy cloak. The fear of being implicated in a murder loomed over her, a specter that threatened to shatter her carefully constructed world.",
      "As the investigation unfolded, Beatrice found herself at a crossroads, torn between her ambition and the consequences of her actions. She had always believed that the ends justified the means, yet the darkness surrounding Hugo's death forced her to confront the depths of her ambition. Was it worth the price of a life? Perhaps this tragedy would serve as a wake-up call, forcing her to reevaluate her quest for power and the toll it exacted on her soul."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a gracious widow whose philanthropic endeavors mask a deep-seated grudge against the victim, threatening to unravel her carefully maintained legacy.",
    "publicPersona": "Known for her charitable contributions and wisdom, Sylvia Trent is a respected widow in the community, often sought after for her insights and guidance.",
    "privateSecret": "However, beneath her gracious exterior lies a grudge against Hugo, who had once exposed a scandal that tarnished her reputation and hurt her standing in society.",
    "motiveSeed": "Sylvia wished to silence the victim, who threatened to reveal her past and further damage her legacy.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claims to have been in her suite with a friend from 8:15 to 9:15 PM, a statement that could either reinforce her innocence or reveal her duplicity.",
    "accessPlausibility": "easy",
    "stakes": "Her legacy and reputation are at risk of being tarnished, as the repercussions of Hugo's death could expose her past.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.3,
    "speechMannerisms": "Sylvia speaks with a calm, measured tone, often choosing her words with care. Her dialogue is laced with subtle irony, reflecting her awareness of social dynamics and the fragility of reputation.",
    "signatureTic": "‘One must always consider the consequences.’",
    "internalConflict": "Sylvia grapples with her resentment toward Hugo, torn between her desire for revenge and the moral implications of her actions, questioning whether she can move beyond her past.",
    "personalStakeInCase": "This case matters to Sylvia because her carefully maintained legacy is at stake; being implicated in a murder could shatter the facade she has built around her life.",
    "paragraphs": [
      "Sylvia Trent was the embodiment of grace, her presence exuding an air of wisdom that commanded respect among her peers. A widow of considerable means, she dedicated her life to philanthropy, yet beneath the surface, she bore the scars of a past that refused to be forgotten. Hugo Vane, the journalist whose sharp pen had once exposed her deepest secrets, now lay dead, and the implications of his demise weighed heavily on her conscience. Would the truth of her past finally come to light, unraveling the carefully woven tapestry of her life?",
      "Her public persona was one of benevolence, but in the quiet corners of her mind, resentment festered like a wound. The scandal Hugo had uncovered years ago had tarnished her reputation, and she had spent years rebuilding her standing in society. Now, with his death, the specter of that past threatened to resurface, and Sylvia felt a chill run down her spine. The thought of being implicated in a murder was a nightmare she feared could become her reality.",
      "Sylvia's alibi was a fragile shield, one that could easily be pierced by the probing questions of investigators. She had been in her suite, surrounded by a friend, yet the truth of her emotions felt raw and exposed. The clock ticked in her mind, each second a reminder of the precariousness of her situation. She had always believed in the importance of maintaining one's reputation, yet the fear of being revealed as a murderer forced her to confront the darkness within herself.",
      "As the investigation progressed, Sylvia found herself at a crossroads, her internal conflict intensifying. She had long held a grudge against Hugo, yet the moral implications of her desires weighed heavily on her conscience. Could she find a way to move beyond her past, or would the desire for revenge consume her? Perhaps this tragedy could serve as a catalyst for change, forcing her to reevaluate her grudges and the impact they had on her life."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Oceanview Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A seaside retreat blending Art Deco elegance with colonial charm, overlooking the tumultuous waves of the English Channel.",
    "visualDescription": "The Oceanview Hotel stands proudly on a cliffside, its facade a blend of smooth white stucco and ornate stonework. Inside, the grand lobby features sweeping staircases and a polished marble floor, reflecting the muted light of the overcast sky. Large windows frame the crashing waves, while plush seating areas invite hushed conversations.",
    "atmosphere": "A sense of foreboding lingers in the air, punctuated by the distant roar of the sea and the muted chatter of guests, all wrapped in the uncertainty of the post-war world.",
    "paragraphs": [
      "The Oceanview Hotel, perched on the edge of a rugged cliff, offers a breathtaking view of the English Channel. Its elegant Art Deco lines meld seamlessly with colonial accents, creating an inviting yet enigmatic atmosphere. Guests, wrapped in their own thoughts, drift through the grand lobby, where the muted light of the overcast sky casts shifting shadows across the polished marble floor. The salty tang of the ocean air mingles with the faint scent of damp wood, a reminder of the relentless waves battering the shore below.",
      "As the day progresses, a sense of tension fills the air. Whispers of espionage and post-war anxieties weave through conversations, while the sound of rain pattering against the windows adds a layer of intimacy. The hotel, isolated from the bustle of Brighton, feels like a world unto itself, where secrets hide behind closed doors, and every guest is a potential suspect. The staff move with purpose, navigating narrow hallways and restricted areas, their expressions betraying the weight of unspoken truths.",
      "In the evenings, the flickering glow of gas lamps casts a warm light on the faces of weary travelers. The lobby hums with the soft melodies of a radio broadcasting the latest news, mingling with the clinking of glasses from the bar. Outside, the ocean rages against the cliffs, a constant reminder of nature's power and the fragility of human affairs. As the sun sets, the hotel transforms into a haven of intrigue, where each guest holds a story, and the clock ticks ominously, counting down to an inevitable confrontation."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates in the fall",
    "timeFlow": "Days of mounting tension as secrets unravel",
    "mood": "tension and uncertainty, reflecting post-war anxieties and the threat of espionage",
    "eraMarkers": [
      "mechanical typewriters in the lobby",
      "early radio broadcasts from the bar",
      "rationed automobiles parked outside",
      "bicycles chained to railings"
    ],
    "sensoryPalette": {
      "dominant": "salty ocean breeze and damp earth",
      "secondary": [
        "faint perfume of fresh linens",
        "mellow light from gas lamps"
      ]
    },
    "paragraphs": [
      "The atmosphere is thick with the weight of secrets, the salty tang of the ocean mingling with the musty scent of old books in the library. The dim light casts long shadows, creating a sense of uncertainty that permeates every corner of the hotel. With each tick of the clock, the tension builds, echoing the distant crash of waves against the cliffs. Guests exchange furtive glances, their expressions revealing a blend of curiosity and apprehension, as if the very walls are listening.",
      "The sounds of the hotel create a symphony of unease: the rhythmic tick-tock of a large clock in the lobby, the soft rustle of newspapers being read, and the distant murmur of conversations blending into a low hum. Occasionally, the shrill laughter of a guest breaks the tension, only to be swallowed by the oppressive silence that follows. Each moment is a reminder that in this isolated haven, beneath the veneer of civility, lies a world of intrigue and deception."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Grand Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A dimly lit room lined with towering bookshelves, plush armchairs, and a grand fireplace. Dust motes dance in the slivers of light streaming from the windows.",
      "sensoryDetails": {
        "sights": [
          "dusty tomes on dark oak shelves",
          "flickering firelight",
          "heavy velvet curtains",
          "scattered papers on a table"
        ],
        "sounds": [
          "whispering winds outside",
          "soft crackle of the fire",
          "pages turning",
          "distant footsteps in the hallway"
        ],
        "smells": [
          "old leather and musty paper",
          "smoky fireplace ash",
          "freshly polished wood",
          "hint of lavender from a nearby vase"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cold brass doorknob",
          "smooth pages of a book",
          "worn leather armrest"
        ]
      },
      "accessControl": "Accessible to guests during library hours; restricted access to staff after dark; locked during cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-drenched windows",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady drumming on the roof",
            "gentle patter against glass"
          ],
          "smells": [
            "damp earth",
            "mildew on pages",
            "cold stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light across bookshelves",
            "shadows creeping along the floor"
          ],
          "sounds": [
            "silence punctuated by a distant clock",
            "creak of old timbers"
          ],
          "smells": [
            "dust and age",
            "beeswax from polished wood",
            "burning wood smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight casting dancing shadows",
            "glow from the fireplace"
          ],
          "sounds": [
            "gentle crackle of the fire",
            "murmurs of distant conversations"
          ],
          "smells": [
            "warm wood and leather",
            "smoky fireplace",
            "freshly brewed tea"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Library is a sanctuary of knowledge and secrets, where the weight of history rests on every shelf. Dimly lit, it feels both inviting and foreboding, with the flickering light of the fireplace casting dancing shadows upon the walls. Dust hangs in the air, illuminated by the rare bursts of daylight that filter through the heavy velvet curtains. Here, amidst the whispers of the past, a crime has unfolded, leaving behind an atmosphere thick with tension and unanswered questions.",
        "Books lie open on the tables, their pages fluttering as if eager to share their stories. The soft crackle of the fire provides a backdrop to the distant sounds of the hotel, creating a cocoon of isolation. It is in this space that guests have gathered, exchanging hushed conversations, their voices barely rising above the sound of the wind outside. Each creak of the floorboards echoes the uncertainty that pervades the hotel, a reminder that within these walls, nothing is as it seems."
      ]
    },
    {
      "id": "staff_area",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Staff-only area",
      "visualDetails": "A bustling space filled with the clatter of pots and pans, large stoves, and countertops laden with fresh produce.",
      "sensoryDetails": {
        "sights": [
          "gleaming metal utensils",
          "fresh vegetables on wooden counters",
          "steam rising from pots",
          "flour dust on surfaces"
        ],
        "sounds": [
          "clattering dishes",
          "sizzling food on the stove",
          "voices of staff coordinating meal prep",
          "water running at the sink"
        ],
        "smells": [
          "savory herbs and spices",
          "freshly baked bread",
          "scalding milk",
          "smoky bacon"
        ],
        "tactile": [
          "warmth from the oven",
          "rough wooden surfaces",
          "smooth ceramic plates",
          "cool metal handles"
        ]
      },
      "accessControl": "Staff access only; locked after hours; guests may enter only during meal times with permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "steam rising from pots"
          ],
          "sounds": [
            "steady rhythm of chopping",
            "raindrops pattering on the roof"
          ],
          "smells": [
            "freshly ground coffee",
            "cooked bacon",
            "wet earth outside"
          ],
          "mood": "busy anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through windows",
            "shadows on countertops"
          ],
          "sounds": [
            "clattering of utensils",
            "soft murmurs of conversation"
          ],
          "smells": [
            "rich stew simmering",
            "baking pastries",
            "herbs drying on racks"
          ],
          "mood": "hushed urgency"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from overhead lights",
            "tantalizing dishes being prepared"
          ],
          "sounds": [
            "sizzling from frying pans",
            "laughing staff members"
          ],
          "smells": [
            "spices wafting through the air",
            "sweet desserts cooling",
            "freshly cut herbs"
          ],
          "mood": "contented bustle"
        }
      ],
      "paragraphs": [
        "The kitchen is a whirlwind of activity, where the scents of savory dishes mingle with the sounds of clattering pots and pans. Staff members bustle about, their movements choreographed in a dance of efficiency and urgency. The air is thick with the aromas of freshly baked bread and simmering stew, creating an inviting atmosphere that contrasts sharply with the tension brewing in the hotel above. Here, amidst the chaos, secrets are exchanged alongside recipes, whispers of intrigue blending with the sounds of daily life.",
        "As rain patters against the windows, the kitchen feels like a sanctuary, a haven where the outside world's worries are momentarily forgotten. The staff work in a rhythm, their voices a soft hum against the backdrop of sizzling food. Each ingredient, carefully selected, contributes to the meals that will nourish weary guests, but beneath the surface, the kitchen holds its own secrets—those who prepare the meals may know more than they let on, their eyes flickering with knowledge of the events unfolding in the hotel above."
      ]
    },
    {
      "id": "guest_suite",
      "name": "The Oceanfront Suite",
      "type": "interior",
      "purpose": "Guest accommodation",
      "visualDetails": "A luxurious suite with large windows showcasing panoramic ocean views, tasteful furnishings, and elegant decor.",
      "sensoryDetails": {
        "sights": [
          "expansive ocean view from the window",
          "soft pastel colors in decor",
          "delicate china on the dresser",
          "plush carpets underfoot"
        ],
        "sounds": [
          "waves crashing against the cliffs",
          "soft rustling of curtains",
          "distant laughter from the lobby",
          "clock ticking on the mantle"
        ],
        "smells": [
          "fresh linen and lavender",
          "scent of ocean air",
          "hint of lemon polish",
          "faint tobacco smoke"
        ],
        "tactile": [
          "silky bed linens",
          "soft cushions on the sofa",
          "cool glass of a drink",
          "warmth of the sun through the window"
        ]
      },
      "accessControl": "Restricted to guests; locked when unoccupied; cleaning staff access during designated hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey skies through the window",
            "raindrops trickling down the glass"
          ],
          "sounds": [
            "heavy rain against the window",
            "soft sighs of the guests waking"
          ],
          "smells": [
            "damp air mixed with sea salt",
            "fresh coffee brewing",
            "wet earth outside"
          ],
          "mood": "melancholic introspection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through curtains",
            "shadows playing on the walls"
          ],
          "sounds": [
            "soft tick of the clock",
            "muffled voices from the hallway"
          ],
          "smells": [
            "scent of polished wood",
            "fresh flowers on the table",
            "lingering perfume in the air"
          ],
          "mood": "pensive solitude"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset reflecting on the ocean",
            "soft glow of lamps illuminating the room"
          ],
          "sounds": [
            "gentle lapping of waves",
            "distant music from the lobby"
          ],
          "smells": [
            "warm vanilla from candles",
            "freshly cut flowers",
            "scent of aged whiskey"
          ],
          "mood": "romantic suspense"
        }
      ],
      "paragraphs": [
        "The Oceanfront Suite is a study in luxury and tranquility, offering a breathtaking view of the crashing waves below. Large windows invite the sound of the ocean into the room, creating a soothing soundtrack that contrasts with the tension building in the hotel. Tasteful furnishings, adorned with soft pastel colors, create an inviting atmosphere, while the scent of fresh linen and lavender lingers in the air. Here, guests retreat to find solace, yet the weight of unspoken words hangs heavily in the atmosphere.",
        "As the day unfolds, the suite becomes a refuge for deep contemplation, where the sound of ticking clocks serves as a reminder of the passing time. The soft rustle of curtains dances with the ocean breeze, while distant laughter filters in from the lobby, a stark contrast to the isolation felt within these walls. Each evening, as the sun sets over the horizon, the room transforms into a space of romantic suspense, where the ocean's beauty belies the secrets that may be lurking just beyond the door."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Dining Saloon",
      "type": "interior",
      "purpose": "Gathering space for meals",
      "visualDetails": "A grand dining room with large windows overlooking the sea, adorned with elegant chandeliers and fine china.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on crisp white tablecloths",
          "elegant chandeliers casting warm light",
          "ocean waves visible through large windows",
          "decorative floral arrangements"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft laughter and conversation",
          "music from a gramophone",
          "waves crashing against the shore"
        ],
        "smells": [
          "scent of roasted meats",
          "freshly baked bread",
          "rich aroma of wine",
          "fragrant flowers on the tables"
        ],
        "tactile": [
          "smooth tablecloths under fingertips",
          "cool glass of wine",
          "warm bread rolls",
          "soft velvet chairs"
        ]
      },
      "accessControl": "Open to guests during meal times; staff access for setup and cleaning; locked outside of dining hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "raindrops on windowpanes"
          ],
          "sounds": [
            "soft patter of rain",
            "muffled conversation from guests"
          ],
          "smells": [
            "freshly brewed coffee",
            "warm pastries",
            "wet earth outside"
          ],
          "mood": "cozy intimacy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dimly lit tables",
            "shadows playing on the walls"
          ],
          "sounds": [
            "soft notes from the gramophone",
            "whispers of conversation"
          ],
          "smells": [
            "scent of simmering sauces",
            "baking desserts",
            "fresh herbs"
          ],
          "mood": "sophisticated elegance"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "twinkling candlelight",
            "glimmer of ocean waves under moonlight"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "soft strains of music"
          ],
          "smells": [
            "rich aromas of dinner",
            "scent of vanilla from desserts",
            "fresh sea air"
          ],
          "mood": "celebratory joy"
        }
      ],
      "paragraphs": [
        "The Dining Saloon is a grand affair, where elegance meets the comfort of seaside dining. Large windows frame the breathtaking ocean view, while chandeliers cast a warm glow over meticulously set tables. The air is filled with the enticing aromas of roasted meats and freshly baked bread, mingling with the sounds of laughter and clinking cutlery. Each meal becomes an event, a gathering space where guests share stories and secrets, their voices blending with the soft strains of music from a gramophone.",
        "As rain falls outside, the dining room transforms into a cozy retreat, where guests find solace in hearty meals and good company. The atmosphere is intimate, punctuated by the gentle patter of raindrops against the windows. In the evenings, the room takes on a celebratory air, with candlelight flickering against the backdrop of the crashing waves, creating a timeless ambiance that invites both joy and reflection. Here, amidst the laughter and clinking glasses, lies the potential for revelations, as each course brings guests one step closer to uncovering the mysteries that linger in the shadows."
      ]
    }
  ],
  "note": "",
  "cost": 0.00242933295,
  "durationMs": 29864
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "August",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "overcast skies with occasional rain",
      "muggy afternoons",
      "cooler evenings"
    ],
    "daylight": "Long summer evenings, with twilight stretching until eight-thirty, but the clouds often dimming the light.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner service has concluded.",
    "holidays": [
      "National Airborne Day (August 16)"
    ],
    "seasonalActivities": [
      "attending summer fairs or carnivals",
      "picnicking at coastal parks",
      "evening strolls along the beach"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suits in navy blue",
        "crisp white shirts",
        "two-tone dress shoes"
      ],
      "casual": [
        "lightweight cotton trousers",
        "short-sleeve button-up shirts",
        "sandy brown loafers"
      ],
      "accessories": [
        "thin leather belts",
        "pocket squares",
        "wide-brimmed straw hats"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with floral patterns",
        "tailored jackets",
        "satin pumps"
      ],
      "casual": [
        "lightweight sundresses",
        "capri pants paired with fitted tops",
        "comfortable espadrilles"
      ],
      "accessories": [
        "string pearls",
        "wide-brimmed sun hats",
        "colorful silk scarves"
      ]
    },
    "trendsOfTheMoment": [
      "increased use of synthetic fabrics",
      "the popularity of tailored clothing",
      "bold floral prints"
    ],
    "socialExpectations": [
      "men are expected to wear hats outdoors",
      "women should dress elegantly for evening gatherings",
      "formal attire is required for dining at upscale establishments"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the ongoing Berlin Airlift as tensions heighten in Europe",
      "the establishment of the United Nations as a peacekeeping body",
      "the launch of the first commercial television broadcasts in the U.S."
    ],
    "politicalClimate": "A climate of anxiety as the Cold War begins to shape international relations and domestic policies.",
    "economicConditions": "Post-war recovery is underway, but inflation is rising and shortages persist, particularly in housing and consumer goods.",
    "socialIssues": [
      "struggles for civil rights are beginning to gain traction",
      "the role of women in the workforce is being reevaluated",
      "growing concerns over espionage and loyalty during the Red Scare"
    ],
    "internationalNews": [
      "the ongoing strife in Palestine",
      "the partition of India and Pakistan creating geopolitical tensions",
      "the establishment of NATO as a military alliance against the Soviet threat"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's big band hits",
        "Doris Day's romantic ballads",
        "the rise of rhythm and blues"
      ],
      "films": [
        "The Treasure of the Sierra Madre",
        "Key Largo",
        "The Red Shoes"
      ],
      "theater": [
        "The King and I",
        "South Pacific",
        "Death of a Salesman"
      ],
      "radio": [
        "The Jack Benny Program",
        "Suspense",
        "The Shadow"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Catcher in the Rye by J.D. Salinger",
        "The Naked and the Dead by Norman Mailer",
        "The Old Man and the Sea by Ernest Hemingway"
      ],
      "popularGenres": [
        "detective fiction",
        "post-war novels",
        "romantic dramas"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio begins to emerge",
        "early computers are being developed",
        "the first portable typewriters are gaining popularity"
      ],
      "commonDevices": [
        "mechanical typewriters",
        "phonographs",
        "early television sets"
      ],
      "emergingTrends": [
        "the rise of consumer electronics",
        "increased availability of household appliances",
        "greater public access to information through radio and print media"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cup of coffee: six pence",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "dining out at local cafes",
        "visiting the beach for leisure",
        "attending local festivals and fairs"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "evening walks to enjoy the cooler weather",
        "community gatherings at local parks"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a rising middle class emerges with post-war prosperity",
      "class differences are still pronounced, especially in urban areas"
    ],
    "gender": [
      "traditional gender roles are still influential, but women are increasingly expected to balance work and home life",
      "the push for women's rights begins to garner more attention"
    ],
    "race": [
      "racial segregation is still prominent in many areas, yet civil rights movements are beginning to challenge these norms",
      "conversations about race and equality are becoming more public"
    ],
    "generalNorms": [
      "decorum is expected in public spaces",
      "family values are emphasized",
      "community involvement is considered a civic duty"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain-soaked earth mingled with salty ocean air, creating a distinct coastal aroma that permeated the evening.",
    "Flickering shadows danced on the walls of the hotel, as the sound of jazz music wafted through the air, punctuated by the clinking of glasses in the bar.",
    "The low hum of conversation filled the lobby, underscored by the occasional crackle of a radio broadcasting the latest news, reflecting the tension of the times."
  ],
  "paragraphs": [
    "In August 1948, as summer began to wane, the coastal hotel bustled with the last vestiges of vacationers savoring the muggy evenings. Overcast skies often threatened rain, creating a sense of anticipation among the guests, who enjoyed the lingering twilight until nearly eight-thirty. With the Berlin Airlift dominating the news, the atmosphere was thick with post-war anxieties, as whispers of espionage and conflict danced through conversations in the dining room, where diners dressed in their finest summer attire savored the day's catch and cool cocktails.",
    "Fashion was a vibrant reflection of the times; men donned double-breasted navy suits paired with crisp white shirts, while women graced the dining halls in tea-length floral dresses accented with string pearls. The trends leaned towards tailored elegance, with many embracing the bold prints and lightweight fabrics that suited the sultry climate. The social expectations of the day dictated an air of sophistication, even in casual settings, ensuring that every guest was dressed to impress, a nod to the cultural recovery from the war.",
    "Daily life in this period was punctuated by the rhythms of community and family. Sunday dinners were a cherished ritual, with families gathering to break bread, while the local parks buzzed with summer fairs and picnics. Prices remained modest, with a loaf of bread costing merely four pence, allowing families to enjoy simple pleasures. Yet, beneath the surface of this everyday normalcy, the specters of class division and gender expectations lingered, as women increasingly carved out a place in the workforce, all while society clung to traditional values."
  ],
  "note": "",
  "cost": 0.0010740839999999999,
  "durationMs": 13454
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a seaside hotel for a post-war reunion of former military officers and their families becomes a tense affair as secrets and suspicions rise amid the backdrop of Cold War anxieties.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The post-WWII recovery period sees a shift in traditional gender roles with increased female workforce participation, while societal tensions are heightened by Cold War fears and the lingering effects of wartime rationing."
  },
  "setting": {
    "location": "A seaside hotel with a mix of Art Deco and colonial architectural styles, featuring a grand lobby and expansive ocean views.",
    "institution": "hotel",
    "weather": "overcast with occasional rain, typical of coastal climates in the fall"
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
    "id": "time_of_death",
    "value": "ten minutes past eleven",
    "description": "The clock was rewound to show this false time, which does not align with the actual time of death."
  },
  {
    "id": "last_seen_time",
    "value": "twenty minutes past ten",
    "description": "The victim was last seen alive at this time, contradicting the clock's false reading."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 5,
    "mid": 11,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 16,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_2",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
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
      "category": "testimonial"
    },
    {
      "id": "clue_5",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_2",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
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
