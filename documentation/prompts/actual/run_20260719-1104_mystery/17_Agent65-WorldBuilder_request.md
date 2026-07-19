# Actual Prompt Record

- Run ID: `mystery-1784459072380`
- Project ID: ``
- Timestamp: `2026-07-19T11:08:21.398Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `2d0a5df03fdf6e64`

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
    "title": "The Timed Deception",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Brighton",
      "place": "coastal hotel",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A charming socialite known for her philanthropic efforts.",
      "private_secret": "Involved in a scandalous affair.",
      "motive_seed": "Jealousy from a rival.",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Her reputation and social standing.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "30-40",
      "role_archetype": "Doctor",
      "relationships": [
        "Eleanor's confidante"
      ],
      "public_persona": "Respected physician with a keen interest in local health.",
      "private_secret": "Has a strong dislike for Eleanor's social influence.",
      "motive_seed": "Professional jealousy.",
      "motive_strength": "moderate",
      "alibi_window": "7:30 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Medical access to hotel rooms"
      ],
      "behavioral_tells": [],
      "stakes": "Professional reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Naval Officer",
      "relationships": [
        "Acquaintance of Eleanor"
      ],
      "public_persona": "Charismatic officer with a decorated military past.",
      "private_secret": "Harbors unrequited feelings for Eleanor.",
      "motive_seed": "Desire to eliminate rivals for Eleanor's affection.",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Military access to restricted areas"
      ],
      "behavioral_tells": [],
      "stakes": "Love and honor.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Socialite",
      "relationships": [
        "Rival of Eleanor"
      ],
      "public_persona": "Fierce social competitor.",
      "private_secret": "Determined to ruin Eleanor's reputation.",
      "motive_seed": "Jealousy and rivalry.",
      "motive_strength": "high",
      "alibi_window": "7:45 PM to 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Social vengeance.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "40-50",
      "role_archetype": "Hotel Manager",
      "relationships": [],
      "public_persona": "Efficient manager of the hotel.",
      "private_secret": "Hides a financial dispute with Eleanor.",
      "motive_seed": "Financial pressure.",
      "motive_strength": "moderate",
      "alibi_window": "7:30 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all rooms"
      ],
      "behavioral_tells": [],
      "stakes": "Financial stability.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp and observant investigator.",
      "private_secret": "Has a personal connection to the victim.",
      "motive_seed": "Desire to protect Eleanor's legacy.",
      "motive_strength": "low",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional integrity.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Beatrice Quill"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "At a charity gala in a coastal hotel, Eleanor Voss is found strangled, her death masked by a rewound clock that misleads the investigation. As secrets unravel, the true timing of her murder becomes the key to revealing the killer."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was rewound to show a false time of death.",
      "delivery_path": [
        {
          "step": "The murderer rewinds the clock after committing the crime."
        }
      ]
    },
    "outcome": {
      "result": "The apparent time of death is misrepresented."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss was murdered just before dinner, as indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock shows a specific time that aligns with the dinner schedule.",
    "what_it_hides": "The actual murder occurred hours earlier, allowing for the killer to manipulate the timeline."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch had access to the victim's medical history, which could imply motive.",
      "Witnesses claim she was near Eleanor shortly before dinner."
    ],
    "the_one_flaw": "Dr. Finch's alibi is corroborated by multiple guests who saw her at the dinner table when the murder occurred.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses see Dr. Finch arguing with Eleanor before the gala.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The argument was over a medical matter, not personal animosity.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "The clock shows a time that aligns with dinner preparations.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The clock was tampered with post-murder, misleading the timeline.",
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
    "rationale": "All suspects were present at the gala, and no outsiders had access to the hotel during the event."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner was scheduled for 8:00 PM",
        "Eleanor was found at 9:00 PM"
      ],
      "windows": [
        "7:30 PM to 9:00 PM"
      ],
      "contradictions": [
        "Clock shows 8:30 PM but victim's watch stopped at 6:20 PM"
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Sylvia Trent"
      ],
      "objects": [
        "The mechanical clock",
        "The victim's watch",
        "The hotel guest book"
      ],
      "permissions": [
        "Access to all guest rooms",
        "Access to the clock in the lobby"
      ]
    },
    "physical": {
      "laws": [
        "The clock's mechanism allows for rewinding"
      ],
      "traces": [
        "Oil smudges on the clock's hands",
        "Loose winding mechanism"
      ]
    },
    "social": {
      "trust_channels": [
        "Professional relationships",
        "Social rivalries"
      ],
      "authority_sources": [
        "Hotel management",
        "Medical professionals"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the hotel lobby shows half past eight.",
        "correction": "This suggests the murder occurred shortly before dinner.",
        "effect": "Narrows the timeline of the murder to just before 8:00 PM.",
        "required_evidence": [
          "The clock showing 8:30 PM",
          "Eleanor was found at 9:00 PM"
        ],
        "reader_observable": true
      },
      {
        "observation": "Eleanor's watch was found stopped at twenty minutes past six.",
        "correction": "This indicates she was alive well before the clock's indicated time.",
        "effect": "Eliminates the possibility of her being murdered just before dinner.",
        "required_evidence": [
          "Eleanor's watch showing 6:20 PM",
          "Witness testimony about her activities until 7:30 PM"
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock's hands have smudges of oil not consistent with normal maintenance.",
        "correction": "This implies recent tampering with the clock.",
        "effect": "Narrows the suspect pool to those with access to the clock.",
        "required_evidence": [
          "Close inspection of the clock",
          "Hotel maintenance logs showing no recent repairs"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report dinner was delayed due to missing dishes.",
        "correction": "This allows the murderer to commit the crime while guests were distracted.",
        "effect": "Narrows the opportunity window for suspects.",
        "required_evidence": [
          "Guest statements about the dinner delay",
          "Telegram sent to the kitchen about a late arrival"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the clock's oil smudges and loose mechanism against the maintenance records reveals that only Beatrice had the opportunity and means to tamper with it.",
    "knowledge_revealed": "No other suspects had the mechanical knowledge to rewind the clock.",
    "pass_condition": "Proving that Beatrice had access to the clock during the murder timeframe.",
    "evidence_clues": [
      "clue_culprit_direct_1",
      "clue_2",
      "clue_12",
      "clue_culprit_direct_beatrice_quill"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock shows a time inconsistent with Eleanor's actual watch. Step 2: The oil marks and loose mechanism reveal tampering. Step 3: The dinner delay allows for the murder to occur unnoticed."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 4,
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
      "test_type": "mechanical comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Guest testimonies confirm her alibi during the murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Evidence of his presence at the gala with multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Hotel records showing she was overseeing the kitchen during the timeframe.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 8:00 PM to 9:00 PM",
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
        "clue_id": "clue_10",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_11",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_13",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements about the dinner delay"
      },
      {
        "clue_id": "clue_7",
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
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation of the clock"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation of Eleanor's watch"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
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
        "clue_id": "clue_fp_contradiction_step_4",
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
    "summary": "Eleanor Voss is a respected hotel owner whose charm masks a past stained by dishonor. As secrets threaten to unravel her carefully constructed life, she must confront the shadows of her choices.",
    "publicPersona": "Respected businesswoman known for her hospitality and charm.",
    "privateSecret": "Hiding a tarnished past involving embezzlement during the war.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "possible",
    "stakes": "The future of her hotel and reputation are at stake.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Eleanor speaks with a warm, inviting tone, often using flowery language when engaging guests, but her words can turn clipped and precise when discussing business matters.",
    "signatureTic": "‘One must always keep the doors open, don’t you think?’",
    "internalConflict": "Eleanor grapples with the weight of her past embezzlement, fearing that exposure could dismantle the life she's built.",
    "personalStakeInCase": "This crime threatens not only her hotel but also the fragile facade of respectability she's fought to maintain.",
    "paragraphs": [
      "Eleanor Voss stood at the threshold of her hotel, the morning sun casting a golden hue over the well-manicured gardens. To the guests, she was the epitome of grace—a refined businesswoman who welcomed all with open arms. Yet beneath this polished exterior lay a history marred by deception, a past she had buried deep within the confines of her mind. The war had left scars not just on the world but on her spirit, and she had made choices that now felt like chains dragging her down.",
      "As she greeted the latest arrivals, a flicker of anxiety sparked in her chest. The hotel was her sanctuary, a place where she could redefine herself. But whispers of her past embezzlement lingered like ghosts in the corners of her mind, threatening to resurface. Eleanor's charm could only mask her secrets for so long. Each smile felt like a mask slipping further from her grasp, revealing the truth beneath—a truth she was desperate to conceal.",
      "The stakes had never been higher; the future of her hotel depended on her ability to keep her past at bay. Every guest was a potential witness, every conversation an opportunity for shadows to emerge. Yet, as the days wore on, Eleanor sensed the walls closing in. The very foundation of her life was at risk, and with it, the reputation she had painstakingly built. It was a precarious balance, one that left her heart racing and her mind spiraling into darkness.",
      "In the quiet moments, when the hotel fell silent, Eleanor would often find herself standing by the window, staring out at the ocean waves that mirrored the turmoil within her. She longed for escape, for a return to a time before the war, before the choices that had led her down this treacherous path. But she knew that confronting her past was inevitable; the only question was whether she would emerge unscathed or be consumed by the very secrets she sought to hide."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a progressive physician whose ambition is overshadowed by a bitter past with Eleanor Voss. As the stakes rise, she must navigate her feelings of betrayal and the consequences of her actions.",
    "publicPersona": "Progressive doctor advocating for women's health.",
    "privateSecret": "Had a secret affair with Eleanor that ended bitterly.",
    "motiveSeed": "Believes Eleanor planned to eliminate her from her life and legacy.",
    "motiveStrength": "strong",
    "alibiWindow": "Was in the kitchen preparing medications from 8:00 PM to 9:00 PM.",
    "accessPlausibility": "possible",
    "stakes": "Her career and reputation could be ruined if Eleanor's secrets are revealed.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with a sharp, incisive tone, often peppering her dialogue with dry humor and sarcasm. She has a tendency to dissect conversations, leaving no room for fluff.",
    "signatureTic": "‘Oh, the irony of life, isn’t it?’",
    "internalConflict": "Dr. Finch is torn between her lingering feelings for Eleanor and the anger over being cast aside, fearing that her professional ambitions may be derailed by personal vendettas.",
    "personalStakeInCase": "This crime could expose her past relationship with Eleanor, jeopardizing her career and the respect she has fought to gain.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the hotel kitchen, her hands deftly measuring out dosages of medication, a stark contrast to the chaos brewing outside. The scent of antiseptic lingered in the air, mingling with the bitterness of her memories. She had once shared a passionate affair with Eleanor Voss, a connection that had promised to transcend the ordinary. But like all things too good to be true, it had crumbled, leaving behind shards of resentment that cut deeper than any surgical knife.",
      "With each passing moment, Mallory felt the weight of her past pressing down on her. Eleanor had been more than a lover; she had been a muse, an inspiration for the progressive doctor fighting for women's health. Yet, as their relationship soured, so too did Mallory's ambition. She believed Eleanor had plans to erase her from the narrative of her life, and the thought alone ignited a fire of rage within her. Killing Eleanor? It felt like an absurd, yet tantalizing, escape from the suffocating grip of betrayal.",
      "Mallory’s sharp wit often served as her shield, a way to deflect the emotional turmoil that raged inside. 'Oh, the irony of life, isn’t it?' she would quip, masking her pain with humor. Yet, beneath the sarcasm lay a deep-seated fear: that the revelation of her past with Eleanor would undo everything she had worked for. Her reputation as a forward-thinking doctor hinged on maintaining an image of professionalism, and the thought of scandal loomed like a dark cloud over her ambitions.",
      "As she navigated the intricate dance of hospital politics, the stakes grew higher. Mallory knew she had to confront her feelings for Eleanor if she hoped to regain control over her life. The investigation into Eleanor's death would force her to face the ghosts of their relationship—both the love and the betrayal. Would she rise above the ashes of her past, or would she be consumed by the very emotions she had tried to bury?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer whose war hero status conceals a life riddled with gambling debts. As he grapples with his tarnished reputation, the stakes of Eleanor's death become painfully personal.",
    "publicPersona": "Former war hero, now a respected elder in the community.",
    "privateSecret": "Gambling debts that Eleanor was threatening to expose.",
    "motiveSeed": "Killing Eleanor would silence her threat to ruin his reputation.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to be on a walk by the beach from 8:30 PM to 10:00 PM.",
    "accessPlausibility": "easy",
    "stakes": "His legacy and financial security are at risk due to Eleanor's knowledge.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks in a gravelly voice, often adopting a formal tone that betrays his military background. He frequently uses self-deprecating humor, especially when discussing his past.",
    "signatureTic": "‘A man’s gotta do what a man’s gotta do, right?’",
    "internalConflict": "Ivor struggles with the duality of his public image as a war hero and the private shame of his debts, fearing that exposure will shatter both.",
    "personalStakeInCase": "The revelation of Eleanor's knowledge about his debts could destroy his reputation and legacy, which he has fought to uphold.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the railing, the salty breeze from the ocean tousling his thinning hair. To the world, he was a hero—a man who had served his country with valor. But beneath that facade lay a man shackled by the chains of his own making. Gambling debts had crept into his life like a thief in the night, and Eleanor Voss had become the keeper of his darkest secret. The threat of exposure loomed over him, a shadow that threatened to eclipse his hard-won respect.",
      "‘A man’s gotta do what a man’s gotta do, right?’ he often chuckled, masking his shame with humor. Yet, the laughter felt hollow, echoing against the walls of his conscience. The thought of killing Eleanor crossed his mind, not out of malice, but desperation. If she were to reveal his debts, his carefully constructed legacy would crumble, leaving him a mere footnote in the annals of history. The weight of his choices pressed down on him, a constant reminder of the man he had become.",
      "As the evening deepened, Ivor took to walking the beach, seeking solace in the rhythmic crashing of waves. The act of walking had become his ritual, a way to clear his mind and escape the mounting pressure of his debts. Yet, with every step, he felt the sands of time slipping away. He was a respected elder in the community, but the truth of his financial ruin gnawed at him, threatening to unravel the very fabric of his existence.",
      "The stakes had never been higher, and the investigation into Eleanor’s death brought a chilling clarity to his situation. Would he find redemption, or would his past mistakes consume him whole? In the depths of his heart, Ivor knew he had to confront the truth—not just about Eleanor, but about himself. Only then could he hope to reclaim his honor and perhaps, in the process, discover what it truly meant to be a hero."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an aspiring writer whose ambition drives her to the edge of ethical boundaries. As she navigates the complexities of her family's secrets, the investigation into Eleanor's death forces her to confront her own values.",
    "publicPersona": "Idealistic and ambitious, seeking inspiration for her first novel.",
    "privateSecret": "Planning to reveal family secrets in her book, potentially damaging Eleanor's reputation.",
    "motiveSeed": "Killing Eleanor would protect her family's secrets and her publishing debut.",
    "motiveStrength": "moderate",
    "alibiWindow": "In her room writing from 9:00 PM to 10:00 PM.",
    "accessPlausibility": "possible",
    "stakes": "Her career could take off or flop based on her storytelling choices.",
    "humourStyle": "observational",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an earnest and passionate tone, often infusing her dialogue with vivid imagery as she describes her writing process. She tends to get carried away in her enthusiasm, leading to long-winded explanations.",
    "signatureTic": "‘It’s all about the story, isn’t it?’",
    "internalConflict": "Beatrice wrestles with the morality of her writing, torn between ambition and the potential harm her revelations could cause to those she cares about.",
    "personalStakeInCase": "The outcome of this investigation could determine whether her novel becomes a success or leads to the ruin of her family's reputation.",
    "paragraphs": [
      "Beatrice Quill sat in her dimly lit room, surrounded by crumpled drafts and ink-stained pages. The flickering candlelight danced against the walls, casting shadows that mirrored the turmoil within her. As an aspiring writer, she yearned for inspiration, but the weight of her family's secrets loomed larger than any plot twist she could concoct. The impending publication of her first novel was both a dream and a nightmare, a delicate balance between ambition and the potential fallout of her words.",
      "‘It’s all about the story, isn’t it?’ she mused aloud, tapping her pen against her chin. Beatrice had planned to weave her family's history into her narrative, a tapestry of secrets that could captivate readers. But as she delved deeper, she realized that revealing Eleanor’s past could jeopardize not only her career but also the very foundation of her family’s reputation. The thought sent shivers down her spine, igniting an internal battle between her ambition and her loyalty.",
      "The investigation into Eleanor’s death thrust Beatrice into the spotlight, a position she had not anticipated. With every twist and turn, she felt the weight of her choices pressing down on her. Killing Eleanor? The mere notion felt absurd, yet the implications of her secrets threatened to unravel everything she held dear. As she navigated the complexities of her family’s legacy, Beatrice found herself at a crossroads, forced to confront the ethical boundaries of her art.",
      "In her quieter moments, Beatrice grappled with the fear of failure. Would her novel soar to great heights, or would it crash and burn, taking her family’s name with it? The stakes had never been higher, and as the investigation unfolded, she realized that her journey as a writer was not just about words on a page; it was about the very essence of truth and the consequences of revealing it. Would she find her voice or lose herself in the process?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a socialite whose charm masks a deep-seated resentment toward Eleanor Voss. As she navigates the intricacies of high society, the stakes of Eleanor's death could alter her social standing forever.",
    "publicPersona": "Charming and influential, with ties to wealthy patrons.",
    "privateSecret": "Resentful of Eleanor's success and holding a longstanding grudge.",
    "motiveSeed": "Killing Eleanor would remove her competition for social status and inheritance.",
    "motiveStrength": "strong",
    "alibiWindow": "Seen mingling with guests from 9:15 PM to 10:30 PM.",
    "accessPlausibility": "easy",
    "stakes": "Her position in society and future income would be threatened.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia's speech is polished and eloquent, often laced with subtle jabs and double meanings. She has a flair for dramatic pauses and can shift from warm to icy in an instant.",
    "signatureTic": "‘Oh, darling, you simply must understand…’",
    "internalConflict": "Sylvia grapples with her envy of Eleanor's success, torn between her desire for social dominance and the emptiness of her ambitions.",
    "personalStakeInCase": "The outcome of this investigation could either solidify her position in society or expose the depths of her rivalry with Eleanor.",
    "paragraphs": [
      "Sylvia Trent glided through the hotel’s grand ballroom, her presence commanding attention like a maestro conducting an orchestra. To the guests, she was the epitome of grace and charm, a socialite with connections that could open doors. Yet beneath that polished veneer lay a cauldron of resentment simmering just below the surface. Eleanor Voss had been her rival for too long, a thorn in her side that threatened to undermine her carefully curated image.",
      "‘Oh, darling, you simply must understand…’ she would say, her voice dripping with sweetness, while her eyes sparkled with a predatory gleam. Sylvia had always been the one to play the game, and she had learned to wield her words like weapons. The thought of killing Eleanor was not born from a place of cold-blooded ambition; rather, it was the culmination of years of envy and frustration, a desperate attempt to reclaim her status in a society that had begun to overlook her.",
      "As she mingled with guests, her laughter rang like crystal chimes, masking the turmoil that churned within her. The stakes had never been higher; Eleanor’s death could either pave the way for Sylvia’s ascension or expose the emptiness of her ambitions. The very thought sent a thrill of excitement through her veins, yet she couldn’t shake the gnawing fear that her carefully constructed world was on the brink of collapse.",
      "In the quiet moments, when the laughter faded and the lights dimmed, Sylvia confronted the truth of her desires. Was this life of social maneuvering truly fulfilling, or was it merely a gilded cage? The investigation into Eleanor's death forced her to reassess her motivations, pushing her to confront the darkness that lurked beneath her polished exterior. Would she find a way to rise above the ashes of rivalry, or would she become ensnared in the very web she had spun?"
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a charismatic entrepreneur turned detective, whose pursuit of truth is complicated by his own financial struggles. As he unravels the mystery, he must confront his own motivations and values.",
    "publicPersona": "Charismatic businessman with a knack for opportunities.",
    "privateSecret": "Owes money to Ivor and has been investigating Eleanor's past.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "Arrived at the hotel shortly before the crime was discovered.",
    "accessPlausibility": "easy",
    "stakes": "His financial future is tied to the hotel, and he seeks the truth.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks with a confident cadence, often punctuating his dialogue with wry observations and a hint of sarcasm. He has a tendency to weave in anecdotes that reveal his charm.",
    "signatureTic": "‘Life’s a puzzle, and I fancy myself a good solver.’",
    "internalConflict": "Hugo struggles with the dichotomy of his public persona as a successful entrepreneur and the reality of his financial troubles, fearing that the truth could shatter his carefully crafted image.",
    "personalStakeInCase": "The truth behind Eleanor’s death could determine the future of his business interests, making this investigation deeply personal.",
    "paragraphs": [
      "Hugo Vane strode into the hotel with an air of confidence, his presence igniting curiosity among the guests. As a charismatic entrepreneur, he had built a reputation for spotting opportunities where others saw obstacles. But beneath the charm lay a man burdened by financial woes, a truth he carefully concealed from the world. The investigation into Eleanor’s death was not merely a professional obligation; it was a chance to uncover the secrets that could either save or ruin him.",
      "‘Life’s a puzzle, and I fancy myself a good solver,’ he often quipped, a dry smile playing on his lips. Hugo had always approached challenges with a sense of humor, using wit as both a shield and a weapon. Yet, as he delved deeper into the investigation, he found himself grappling with the complexities of human nature and the blurred lines of morality. The stakes were high; the truth behind Eleanor's death could either bolster his business or expose him to the very creditors he feared.",
      "His alibi was as murky as the motives of those around him. Arriving at the hotel shortly before the crime was discovered, he felt the weight of suspicion pressing down on him. The investigation forced him to confront his own values and motivations, pushing him to question the lengths he would go to in order to preserve his success. In a world where deception reigned, could he remain true to himself?",
      "As the pieces of the puzzle began to fall into place, Hugo realized that the investigation was more than just about finding the truth; it was about understanding who he truly was beneath the facade of the charismatic entrepreneur. Would he emerge from the shadows of his financial troubles, or would the truth he sought unravel everything he had worked so hard to build?"
    ],
    "order": 6
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
    "summary": "A coastal hotel blending Art Deco and Colonial styles, overlooking the turbulent sea.",
    "visualDescription": "A grand facade of white stucco and curved balconies, framed by palm trees; the interior boasts polished marble floors and brass fixtures, echoing the elegance of a bygone era.",
    "atmosphere": "A palpable tension hangs in the air, intensified by the sounds of the sea and the whispers of unsettled guests.",
    "paragraphs": [
      "Perched on the rugged cliffs of Brighton, The Oceanview Hotel stands as a testament to the glamour of the 1940s, where Art Deco lines meet Colonial accents. The rhythmic crash of waves against the rocky shore creates a constant, haunting backdrop, while the occasional drizzle blurs the horizon. Guests stroll the promenade, their faces twisted in anxious contemplation, as they steal glances at the gathering storm clouds. Inside, the brass railings glint under dim lighting, and conversations murmur like the tide, filled with suspicion and unease.",
      "The hotel lobby, adorned with plush velvet furnishings, exudes an air of faded opulence. An antique radio crackles softly in the corner, broadcasting the latest news of the war, while the scents of beeswax polish and damp sea air mingle in an unsettling harmony. Narrow hallways wind through the building, their corners obscured by shadows, inviting whispered secrets and furtive glances. A vintage elevator creaks to life, offering access to the upper floors, but even the sound feels foreboding, echoing the unease that grips the hotel.",
      "As evening descends, the atmosphere thickens with anticipation. Guests gather in the lounge, their hushed tones punctuated by the occasional clink of glasses and the distant laughter of staff. The dim light casts long shadows, warping familiar faces into uncertain shapes. Outside, palm trees sway against the wind, their rustling leaves confounding the sense of isolation that surrounds the hotel. Within these walls, every glance carries weight, and every door creak hints at secrets waiting to be uncovered. The Oceanview Hotel is not just a refuge; it is a stage for the unfolding mystery."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional drizzle",
    "timeFlow": "A few days of mounting tension and suspicion",
    "mood": "tension-filled as guests are unsettled by recent events",
    "eraMarkers": [
      "radio broadcasting in common rooms",
      "rationed petrol for civilian vehicles",
      "early television sets in select suites"
    ],
    "sensoryPalette": {
      "dominant": "salty sea breeze and anxious murmurs",
      "secondary": [
        "damp wood and polished brass",
        "flickering candlelight and muted conversations"
      ]
    },
    "paragraphs": [
      "The Oceanview Hotel sits on the precipice of the sea, its white facade stark against the grey sky. The salty air mingles with the scent of damp stone, creating a bracing atmosphere that invigorates yet unsettles. Inside, the whispers of guests fill the air, each word thick with tension as they speculate on recent happenings. Flickering candlelight casts dancing shadows across the walls, where photographs of guests long gone seem to watch over the unfolding drama.",
      "In the corners of the hotel, the sounds of the outside world filter in – the relentless crash of the waves, the distant wail of a foghorn, the creak of old timbers shifting with the wind. The sense of isolation grows as the drizzle intensifies, obscuring the view of the coastline. Within these walls, the hotel becomes a microcosm of fear and distrust, where every glance holds unspoken questions and every creak of the floorboards hints at secrets waiting to be discovered."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Hotel Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Marble floors reflecting low chandelier light, plush velvet seating arranged in intimate clusters.",
      "sensoryDetails": {
        "sights": [
          "gleaming brass fixtures",
          "softly flickering candles",
          "lush potted palms",
          "framed photographs of past guests"
        ],
        "sounds": [
          "soft chatter of guests",
          "crackling radio announcements",
          "clinking glasses from the bar",
          "the rustle of newspapers",
          "a distant piano melody"
        ],
        "smells": [
          "beeswax polish and damp air",
          "freshly brewed coffee",
          "cigar smoke lingering",
          "old leather and varnish",
          "salt from the ocean breeze"
        ],
        "tactile": [
          "smooth marble underfoot",
          "plush velvet cushions",
          "cool brass handrails",
          "the chill of ocean air",
          "soft woolen throws draped over chairs"
        ]
      },
      "accessControl": "Open to all guests; monitored by front desk staff at all hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets on window panes",
            "grey light filtering through curtains",
            "shadows lengthening with the dawn",
            "faded carpet patterns",
            "staff bustling with umbrellas"
          ],
          "sounds": [
            "steady rain tapping on glass",
            "distant thunder rumbling",
            "the hum of the refrigerator",
            "the shuffle of feet on wet floors",
            "the low murmur of early risers"
          ],
          "smells": [
            "wet earth and damp carpet",
            "freshly baked pastries",
            "the scent of brewing tea",
            "slightly musty air from hidden nooks",
            "scent of polished wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_clear",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dull sunlight behind clouds",
            "guests casting long shadows",
            "potted plants swaying gently",
            "flickering candlelight casting shapes",
            "golden light reflecting off furniture"
          ],
          "sounds": [
            "the ticking of a clock",
            "muffled conversations in the background",
            "the rustle of newspapers",
            "the clinking of cups",
            "the distant sound of waves crashing"
          ],
          "smells": [
            "freshly polished wood",
            "scent of old books",
            "lingering cigar smoke",
            "sweet perfume from guests",
            "beeswax candles melting"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_tension",
          "timeOfDay": "evening",
          "weather": "mild",
          "sights": [
            "dimly lit room illuminated by lamps",
            "shadows creeping along the walls",
            "glimmers of gold on upholstery",
            "guests shifting nervously in their seats",
            "the glow of candlelight reflecting off glass"
          ],
          "sounds": [
            "the low hum of conversation",
            "the crackle of a fire in the hearth",
            "the distant sound of waves crashing",
            "the chime of a clock striking",
            "the rustling of evening dresses"
          ],
          "smells": [
            "warm wood and leather",
            "scent of burning logs",
            "the aroma of roasted chestnuts",
            "sweet scent of desserts being served",
            "the tang of salt air"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The lobby of The Oceanview Hotel serves as the heartbeat of the establishment, where guests gather to share stories and secrets. The marble floors gleam under the soft glow of chandeliers, casting a warm ambiance amidst the chill of the sea air. Plush velvet seating arrangements invite quiet conversations, while the occasional crackle from the antique radio reminds everyone of the world beyond the hotel’s walls. Guests linger here, their expressions a mixture of anxiety and curiosity, as they exchange furtive glances and whispered theories about the unfolding mystery.",
        "In the mornings, the lobby transforms under the weight of rain; the world outside blurs into a watercolor of greys and blues. Guests shuffle in, shaking off their umbrellas, while the comforting smell of freshly brewed coffee mingles with the damp air. As the day progresses, the sunlight struggles to pierce through the clouds, casting a muted light that softens the edges of conversations, wrapping everyone in an uneasy stillness. But as evening approaches, the lobby shifts again, shadows deepening as guests’ nerves fray. The atmosphere becomes charged with tension, every flicker of candlelight and every hushed whisper echoing the unspoken fears that linger within these walls."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "Elegant tables set with fine china, silver cutlery glinting under soft lighting; walls adorned with nautical-themed decor.",
      "sensoryDetails": {
        "sights": [
          "tables lined with crisp white linens",
          "polished silverware catching light",
          "vibrant floral arrangements",
          "nautical paintings adorning walls",
          "soft glow of sconces"
        ],
        "sounds": [
          "clinking glasses and laughter",
          "soft classical music playing",
          "the rustle of napkins",
          "the sizzling of dishes being served",
          "muffled voices mingling"
        ],
        "smells": [
          "roasted meats and rich sauces",
          "freshly baked bread",
          "aromatic herbs and spices",
          "the scent of polished wood",
          "the tang of citrus"
        ],
        "tactile": [
          "smooth linen tablecloths",
          "cool metal cutlery",
          "warm bread rolls from the oven",
          "the heft of crystal glassware",
          "soft leather seat cushions"
        ]
      },
      "accessControl": "Open during dining hours; staff-only access to kitchen areas.",
      "sensoryVariants": [
        {
          "id": "morning_brunch",
          "timeOfDay": "morning",
          "weather": "clear",
          "sights": [
            "sunlight streaming through windows",
            "fresh fruit displays on tables",
            "coffee brewing in the corner",
            "staff setting up for service",
            "brightly colored flowers in vases"
          ],
          "sounds": [
            "the clatter of dishes",
            "laughter of children",
            "the sound of coffee pouring",
            "soft chatter among guests",
            "the rustle of menus being opened"
          ],
          "smells": [
            "freshly brewed coffee",
            "warm pancakes with syrup",
            "the scent of bacon sizzling",
            "sweet pastries cooling",
            "the aroma of herbal teas"
          ],
          "mood": "cheerful and lively"
        },
        {
          "id": "afternoon_tea",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds looming outside",
            "guests wrapped in shawls",
            "dim light filtering through windows",
            "the flicker of candle flames"
          ],
          "sounds": [
            "the sound of teacups clinking",
            "soft whispers of conversation",
            "the rustle of newspapers",
            "the distant sound of rain",
            "the creaking of floorboards"
          ],
          "smells": [
            "aromatic tea leaves",
            "sweet pastries and cakes",
            "the scent of lemon zest",
            "freshly baked scones",
            "the faint scent of tobacco"
          ],
          "mood": "introspective and subdued"
        },
        {
          "id": "evening_dinner",
          "timeOfDay": "evening",
          "weather": "mild",
          "sights": [
            "candlelight flickering on tables",
            "guests in formal attire",
            "serving staff moving gracefully",
            "the reflection of chandeliers in glass",
            "dark shadows lurking in corners"
          ],
          "sounds": [
            "the hum of conversation",
            "the clatter of plates being cleared",
            "soft music filling the air",
            "the sound of wine being poured",
            "the distant crash of waves"
          ],
          "smells": [
            "the aroma of grilled fish",
            "rich sauces complementing meat",
            "the scent of roasted vegetables",
            "the tang of sea salt",
            "the sweet smell of dessert"
          ],
          "mood": "elegant yet tense"
        }
      ],
      "paragraphs": [
        "The Dining Room at The Oceanview Hotel is a blend of elegance and comfort, where guests are invited to indulge in sumptuous meals while overlooking the tumultuous sea. Tables are set with crisp white linens, each adorned with glimmering silverware and vibrant floral arrangements that brighten the atmosphere. The air is rich with the aromas of roasted meats and freshly baked bread, drawing guests in like a siren’s call. As laughter and conversation fill the space, the tension of recent events seems to subside, if only for a moment, before the shadows of unease creep back in.",
        "During the evening service, the ambience shifts; candlelight flickers across the room as guests sink into their velvet chairs, their expressions a mixture of delight and apprehension. The sound of waves crashing against the cliffs below provides a constant reminder of the storm brewing outside. Each course served is met with an undercurrent of speculation and curiosity, as guests exchange glances and whispers. The Dining Room becomes a stage for hidden intentions, where every bite carries the weight of secrets yet to be revealed."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "Rooftop Terrace",
      "type": "exterior",
      "purpose": "Clue discovery and isolation",
      "visualDetails": "Panoramic views of the coastline, wrought iron railings, and comfortable lounge chairs scattered about.",
      "sensoryDetails": {
        "sights": [
          "endless horizon meeting the sea",
          "clouds drifting lazily overhead",
          "the distant outline of ships",
          "flickering lights of the hotel below",
          "the sway of palm trees in the breeze"
        ],
        "sounds": [
          "the crash of waves against rocks",
          "the rustle of palm fronds",
          "the distant echo of laughter",
          "the soft hum of the wind",
          "the creaking of the terrace railing"
        ],
        "smells": [
          "salt air mingling with jasmine",
          "the scent of damp wood",
          "faint traces of sunscreen",
          "the aroma of grilled seafood",
          "the lingering smell of rain"
        ],
        "tactile": [
          "cool metal of the railings",
          "soft cushions on lounge chairs",
          "the warm stone beneath bare feet",
          "gentle wind brushing against skin",
          "the chill of evening air"
        ]
      },
      "accessControl": "Restricted access; open only to guests after sunset, with staff monitoring entry.",
      "sensoryVariants": [
        {
          "id": "morning_sunrise",
          "timeOfDay": "morning",
          "weather": "clear",
          "sights": [
            "golden rays illuminating the sea",
            "birds soaring against a bright sky",
            "the sun climbing over the horizon",
            "dewdrops glistening on surfaces",
            "the first guests arriving with coffee"
          ],
          "sounds": [
            "the distant call of gulls",
            "the gentle lapping of waves",
            "the sound of chairs being arranged",
            "the soft murmur of early risers",
            "the rustle of newspapers"
          ],
          "smells": [
            "freshly brewed coffee wafting",
            "the scent of morning dew",
            "the faint aroma of blossoms",
            "the tang of salt on the breeze",
            "the lingering scent of rain"
          ],
          "mood": "hopeful and serene"
        },
        {
          "id": "afternoon_breeze",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey clouds rolling in",
            "the sun struggling to break through",
            "waves crashing against the rocks",
            "guests lounging under umbrellas",
            "the silhouette of the hotel against the sky"
          ],
          "sounds": [
            "the distant rumble of thunder",
            "the soft whisper of the wind",
            "the rustling of palm leaves",
            "the clinking of glasses from below",
            "the sound of laughter echoing"
          ],
          "smells": [
            "the scent of damp earth",
            "faint whiffs of cologne",
            "the tang of salt and sea",
            "the aroma of grilled dishes wafting",
            "the hints of jasmine in the air"
          ],
          "mood": "foreboding and tense"
        },
        {
          "id": "evening_twilight",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "twinkling stars emerging in the sky",
            "the glow of city lights below",
            "the horizon painted in shades of orange",
            "guests gathering for nightcap drinks",
            "the silhouette of palm trees against the sky"
          ],
          "sounds": [
            "the distant crash of waves",
            "the soft laughter of guests",
            "the sound of ice clinking in glasses",
            "the rustle of clothing in the breeze",
            "the chirping of crickets beginning"
          ],
          "smells": [
            "the aroma of night-blooming flowers",
            "the scent of cocktails being served",
            "the tang of salt air",
            "the faint smell of smoke from a distant fire",
            "the lingering scent of evening rain"
          ],
          "mood": "suspenseful and charged"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers a breathtaking view of the coastline, a tranquil escape from the mounting tension within the hotel. Guests often retreat here, seeking solace beneath the sprawling sky, where the horizon meets the crashing waves. Wrought iron railings encircle the space, and comfortable lounge chairs invite relaxation, though unease lingers in the air. The scent of salt mingles with the heady aroma of jasmine, while the soft sounds of laughter below carry up on the wind, creating a blend of serenity and anticipation.",
        "As dusk approaches, the terrace transforms into a stage for whispered conversations and fleeting glances. The sky deepens into vibrant hues, the sea reflecting the palette of twilight. Guests gather for nightcaps, their laughter punctuated by the distant crash of waves and the rustle of palm fronds. But beneath the surface calm, a sense of foreboding lingers, as if the very air holds secrets waiting to be uncovered. The Rooftop Terrace, with its stunning vistas, becomes a place of both refuge and revelation, where the truth may emerge from the shadows."
      ]
    },
    {
      "id": "crime_scene",
      "name": "The Beachfront",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A rocky outcrop at the edge of the beach, littered with debris and washed-up seaweed; ominous waves crashing in the distance.",
      "sensoryDetails": {
        "sights": [
          "dark rocks glistening with seawater",
          "scattered debris and broken shells",
          "foamy waves crashing violently",
          "the distant outline of a lifeguard tower",
          "clouds gathering ominously overhead"
        ],
        "sounds": [
          "loud crash of waves",
          "the wind howling through rocks",
          "the distant wail of sirens",
          "the rustle of seaweed",
          "the echo of footsteps on wet sand"
        ],
        "smells": [
          "briny sea air",
          "the scent of decaying seaweed",
          "a hint of smoke from nearby fires",
          "the musty smell of damp earth",
          "the metallic tang of blood"
        ],
        "tactile": [
          "rough texture of wet stones",
          "sharp edges of broken shells",
          "cold wind biting at skin",
          "the chill of the wet sand",
          "the dampness of sea spray"
        ]
      },
      "accessControl": "Restricted access; cordoned off by police tape, only investigators allowed.",
      "sensoryVariants": [
        {
          "id": "morning_mist",
          "timeOfDay": "morning",
          "weather": "misty",
          "sights": [
            "thick fog obscuring the horizon",
            "wet rocks glistening like jewels",
            "the vague outline of a boat",
            "seagulls swooping low",
            "drifting seaweed in the surf"
          ],
          "sounds": [
            "the muffled crash of waves",
            "distant foghorns sounding",
            "the squawking of gulls",
            "the drip of water from rocks",
            "the soft whisper of the tide"
          ],
          "smells": [
            "damp wood and sea brine",
            "the earthy scent of wet sand",
            "the faint smell of fish",
            "the aroma of fresh salt air",
            "the pungent odor of seaweed"
          ],
          "mood": "eerie and suspenseful"
        },
        {
          "id": "afternoon_storm",
          "timeOfDay": "afternoon",
          "weather": "stormy",
          "sights": [
            "dark clouds swirling overhead",
            "lightning illuminating the sea",
            "waves crashing violently against rocks",
            "the shoreline littered with debris",
            "flashes of light reflecting off water"
          ],
          "sounds": [
            "the roar of thunder",
            "the crash of waves",
            "the howling wind whipping through the rocks",
            "the distant sirens of emergency vehicles",
            "the rumble of rolling thunder"
          ],
          "smells": [
            "the scent of rain-soaked earth",
            "the tang of ozone in the air",
            "the musty smell of wet rocks",
            "the salty sea spray",
            "the acrid odor of smoke from fires"
          ],
          "mood": "chaotic and urgent"
        },
        {
          "id": "evening_twilight",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the sunset casting a golden glow",
            "waves lapping gently at the shore",
            "the last light of day fading",
            "the silhouette of the coastline",
            "the glint of stars beginning to appear"
          ],
          "sounds": [
            "the distant call of seabirds",
            "the gentle lapping of waves",
            "the rustle of leaves in the breeze",
            "the soft whisper of the tide",
            "the echo of distant laughter"
          ],
          "smells": [
            "the salty tang of the ocean",
            "the aroma of grilled seafood from nearby restaurants",
            "the scent of damp earth",
            "the fresh smell of evening air",
            "the fading scent of smoke from bonfires"
          ],
          "mood": "tense and foreboding"
        }
      ],
      "paragraphs": [
        "The Beachfront, where the land meets the restless sea, is the scene of a chilling crime. Dark rocks jut out from the shore, glistening with seawater and flanked by scattered debris and broken shells. The waves crash violently against the rocks, a constant reminder of nature’s power. As investigators comb through the area, the scent of briny sea air mixes uncomfortably with the metallic tang of blood, creating an atmosphere thick with tension and fear. Police tape flutters in the wind, cordoning off the area as curious onlookers gather, their faces etched with concern.",
        "In the early morning, a thick mist blankets the beachfront, rendering the world an eerie shadow of itself. The muffled crash of waves and the distant sound of foghorns create an unsettling soundtrack, while seagulls swoop low, their cries echoing in the stillness. The wet rocks glisten like jewels, hiding secrets beneath their rough surfaces. As the day progresses, dark clouds roll in, threatening a storm that mirrors the chaos of the investigation. Each crashing wave seems to echo the urgency of the search, a race against time to uncover the truth hidden within the depths of the ocean."
      ]
    }
  ],
  "note": "",
  "cost": 0.0087644733,
  "durationMs": 58684
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "October",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "overcast skies with frequent drizzle",
      "mild temperatures ranging from 50 to 60 degrees Fahrenheit",
      "occasional gusts of wind sweeping through coastal areas"
    ],
    "daylight": "Days are noticeably shorter, with twilight settling around six o'clock in the evening.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests settle in for the night.",
    "holidays": [
      "Halloween (October 31)"
    ],
    "seasonalActivities": [
      "attending local harvest festivals featuring hayrides and pumpkin picking",
      "gathering for evening bonfires on the beach",
      "taking long walks along the coast to enjoy the autumn scenery"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "wool suits with wide lapels",
        "crisp white dress shirts",
        "silk neckties with geometric patterns"
      ],
      "casual": [
        "herringbone-patterned sport coats",
        "tweed flat caps",
        "corduroy trousers"
      ],
      "accessories": [
        "leather gloves",
        "breathable wool scarves",
        "silver cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "tailored dresses with cinched waists and flared skirts",
        "fitted blouses with high collars",
        "wool coats with large buttons"
      ],
      "casual": [
        "knitted cardigans with floral patterns",
        "A-line skirts",
        "tweed jackets"
      ],
      "accessories": [
        "felt hats adorned with feathers",
        "beaded handbags",
        "string of pearls"
      ]
    },
    "trendsOfTheMoment": [
      "the popularity of Art Deco style in decor",
      "increased interest in functional fashion due to wartime restrictions",
      "utilitarian materials becoming more common in everyday wear"
    ],
    "socialExpectations": [
      "men expected to wear hats when outdoors",
      "women encouraged to present a polished appearance in public",
      "social events held to reflect one’s status and class"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Battle of Britain continues, with air raids affecting morale in coastal areas",
      "The U.S. Congress debates further aid to Britain amidst its ongoing conflict with Germany",
      "Reports of rationing affecting food and clothing supplies become more common across Europe"
    ],
    "politicalClimate": "Tensions are high as countries prepare for potential conflict across Europe, with Britain steadfast in its resistance against Nazi Germany.",
    "economicConditions": "The economy is strained due to wartime efforts, with rationing affecting daily life and increased government spending on military resources.",
    "socialIssues": [
      "Women's roles in the workforce are expanding due to men being enlisted, creating both opportunities and societal pushback",
      "Post-war trauma leads to increased mental health discussions, though stigma remains prevalent",
      "Class divisions are highlighted by differences in access to resources during rationing"
    ],
    "internationalNews": [
      "Reports of the Blitz in London causing widespread destruction and displacement",
      "Allied forces preparing strategies for potential invasions in Europe",
      "Growing concerns over espionage and secrecy affecting public trust"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'I'll Be Seeing You'",
        "The Andrews Sisters' 'Boogie Woogie Bugle Boy'",
        "Duke Ellington's 'Mood Indigo'"
      ],
      "films": [
        "'The Great Dictator'",
        "'The Letter'",
        "'The Thief of Bagdad'"
      ],
      "theater": [
        "'The Man Who Came Back'",
        "'The Royal Family'",
        "'The Skin of Our Teeth'"
      ],
      "radio": [
        "The Shadow",
        "Fibber McGee and Molly",
        "The Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "'For Whom the Bell Tolls' by Ernest Hemingway",
        "'The Grapes of Wrath' by John Steinbeck",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "war literature",
        "social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "the radar system for military applications",
        "the first mass-produced television sets",
        "improvements in military aircraft technology"
      ],
      "commonDevices": [
        "radio sets in homes and public spaces",
        "typewriters in offices",
        "early model cars"
      ],
      "emergingTrends": [
        "increased use of propaganda in media",
        "home cooking and preservation techniques due to rationing",
        "the rise of films addressing societal issues"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: four pence",
        "a pint of milk: three pence",
        "bus fare across town: two pence"
      ],
      "commonActivities": [
        "attending local dances to raise funds for the war effort",
        "participating in community service projects",
        "gathering for tea and discussions about the war"
      ],
      "socialRituals": [
        "afternoon tea gatherings",
        "Friday night card games among hotel guests"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "There is a noticeable divide in attitudes between the working class and upper class, particularly in social settings.",
      "Wealth is increasingly scrutinized as many face hardships."
    ],
    "gender": [
      "Women are stepping into roles previously held by men, but societal expectations still pressure them to maintain femininity.",
      "There is admiration for women's contributions to the workforce, yet traditional roles linger."
    ],
    "race": [
      "Racial tensions persist, with discussions around civil rights beginning to surface, albeit cautiously.",
      "Minorities face barriers in employment and social acceptance."
    ],
    "generalNorms": [
      "Social decorum is highly valued, with etiquette dictating behavior in public.",
      "Conformity to societal norms is expected, but cracks are beginning to show in the face of change."
    ]
  },
  "atmosphericDetails": [
    "The salty scent of the ocean mingles with the earthy aroma of damp leaves, creating a distinct coastal fall atmosphere.",
    "The sound of rain tapping against the window sets a somber tone, echoing the tensions felt among hotel guests.",
    "Flickering candlelight casts unsettling shadows in the hotel's parlor as conversations grow hushed, reflecting the unease of the times."
  ],
  "paragraphs": [
    "In October 1940, the coastal hotel stands as a refuge amidst the turmoil of a world at war. Overcast skies loom above, with a chill in the air that hints at the impending winter. Guests shuffle about, their footsteps muffled by the plush carpets as they gather in the common areas, seeking warmth and camaraderie while the rain drizzles outside. The atmosphere is thick with tension, as whispers of the ongoing Battle of Britain and the darker shadows of the continent seep into their conversations, dampening spirits even as the last remnants of fall festivities linger in the air.",
    "Fashion at this time is a blend of practicality and elegance, as men don wool suits and crisp shirts, their neckties a splash of color against the dull backdrop of the season. Women, too, embrace the chic yet functional, with tailored dresses that emphasize their figures and wool coats to ward off the autumn chill. Accessories such as hats and gloves complete their ensembles, reflecting both the class divisions and the evolving societal roles as more women step into the workforce, trying to balance style with their new responsibilities.",
    "Daily life in this coastal town is marked by rituals of resilience. The sounds of radio broadcasts fill the hotel’s common room, with guests tuning in to hear the latest war news while sipping tea. Prices have risen due to rationing, and conversations often revolve around the latest strategies for managing limited supplies. Yet, there are moments of levity—card games and community dances serve as distractions from the harsh realities outside, creating a fragile sense of normalcy amidst the uncertainty. However, the underlying unease remains palpable, as the guests are acutely aware of the changes in societal norms and the weight of their collective anxieties."
  ],
  "note": "",
  "cost": 0.00117041265,
  "durationMs": 11096
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense gathering at a coastal hotel for a charity gala reveals deep class divisions and personal rivalries, exacerbated by the recent war and shifting gender roles.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is evolving with women stepping into roles traditionally held by men, while post-war trauma creates a backdrop of unease and heightened social pressures among the upper class."
  },
  "setting": {
    "location": "a coastal hotel with scenic ocean views",
    "institution": "hotel",
    "weather": "overcast with occasional drizzle"
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
    "value": "half past eight",
    "description": "The clock showed this time, misleading the investigation."
  },
  {
    "id": "victim_watch_time",
    "value": "twenty minutes past six",
    "description": "The victim's watch was found stopped, indicating a different time of death."
  },
  {
    "id": "oil_smudge",
    "value": "three smudges",
    "description": "Three distinct oil smudges were found on the clock's mechanism."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 22,
  "countsByPlacement": {
    "early": 8,
    "mid": 13,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 20,
    "supporting": 1,
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
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "early",
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
      "category": "testimonial"
    },
    {
      "id": "clue_7",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "supporting",
      "category": "physical"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_10",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_11",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_13",
      "placement": "early",
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
      "id": "clue_culprit_direct_beatrice_quill",
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
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_4",
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
