# Actual Prompt Record

- Run ID: `mystery-1784662295274`
- Project ID: ``
- Timestamp: `2026-07-21T19:35:17.345Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `3f8c4f7d5d406fbb`

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
    "title": "Tidal Deception",
    "author": "Golden Age Mystery Writer",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "seaside hotel"
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
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charismatic socialite",
      "private_secret": "Involved in a scandalous affair",
      "motive_seed": "Jealousy from a rival",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM to 8:30 PM",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation and relationships",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical professional",
      "relationships": [],
      "public_persona": "Respected doctor",
      "private_secret": "Involved in a professional rivalry",
      "motive_seed": "Professional jealousy",
      "motive_strength": "moderate",
      "alibi_window": "7:00 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical records room"
      ],
      "behavioral_tells": [
        "Nervousness around authority"
      ],
      "stakes": "Career reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "45-55",
      "role_archetype": "Authority figure",
      "relationships": [],
      "public_persona": "Naval officer",
      "private_secret": "Has a past with the victim",
      "motive_seed": "Unrequited love",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM to 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Seaside terrace"
      ],
      "behavioral_tells": [
        "Emotionally volatile"
      ],
      "stakes": "Emotional stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Friend of the victim",
      "relationships": [
        "Close friend of Eleanor"
      ],
      "public_persona": "Socialite",
      "private_secret": "Envious of Eleanor's popularity",
      "motive_seed": "Desire for attention",
      "motive_strength": "moderate",
      "alibi_window": "7:00 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Social gatherings"
      ],
      "behavioral_tells": [
        "Overly complimentary"
      ],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Rival",
      "relationships": [
        "Former lover of Captain Hale"
      ],
      "public_persona": "Sophisticated artist",
      "private_secret": "Holds a grudge against Eleanor",
      "motive_seed": "Jealousy over Captain Hale",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Art studio"
      ],
      "behavioral_tells": [
        "Cold demeanor"
      ],
      "stakes": "Revenge",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Private investigator",
      "private_secret": "Seeking the truth behind the facade",
      "motive_seed": "Professional integrity",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM to 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Observant and analytical"
      ],
      "stakes": "Professional reputation",
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
      "summary": "At a grand seaside hotel during a foggy evening, social tensions rise as Eleanor Voss is discovered drowned. The investigation uncovers a tangled web of jealousy, rivalry, and deception, all masked by the deceptive nature of the tide."
    },
    "accepted_facts": [
      "Eleanor Voss was found drowned at sea.",
      "The tide was low during the party.",
      "Witnesses heard a commotion shortly before the body was discovered."
    ],
    "inferred_conclusions": [
      "Eleanor could not have drowned at the claimed time."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murderer manipulated the tide schedule to create the illusion that Eleanor drowned during the party.",
      "delivery_path": [
        {
          "step": "Eleanor was pushed into the water just before the tide began to rise."
        },
        {
          "step": "The murderer adjusted the tide gauge to mislead witnesses."
        }
      ]
    },
    "outcome": {
      "result": "The murderer created a false timeline of Eleanor's death."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss drowned during the party as the tide was high.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses reported hearing a loud argument and saw Eleanor near the water shortly before the party ended.",
    "what_it_hides": "The tide was actually low at that time, revealing the true timeline."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses saw him arguing with Eleanor before her death.",
      "He was the last person seen near the water."
    ],
    "the_one_flaw": "The tide level contradicts the timeline of the drowning.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witness testimony places Captain Hale near the water during the argument.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was trying to pull her back from the edge as she stumbled.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A broken piece of jewelry found at the scene.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "She lost it during a scuffle with Eleanor earlier in the evening.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel and had motives related to Eleanor."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "7:00 PM - Party begins",
        "8:30 PM - Eleanor found"
      ],
      "windows": [
        "7:30 PM - 8:00 PM - Alleged drowning time"
      ],
      "contradictions": [
        "Witnesses recall the tide was low during the party.",
        "Eleanor's body was found after the tide had risen."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Tide gauge",
        "Ocean"
      ],
      "permissions": [
        "Access to the terrace"
      ]
    },
    "physical": {
      "laws": [
        "Tide levels fluctuate based on moon phases."
      ],
      "traces": [
        "Footprints leading to the water."
      ]
    },
    "social": {
      "trust_channels": [
        "Witness credibility"
      ],
      "authority_sources": [
        "Hotel manager's timeline"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall Eleanor arguing with Captain Hale near the water's edge.",
        "correction": "This suggests a confrontation occurred shortly before her death.",
        "effect": "Narrows the time window for Eleanor's drowning.",
        "required_evidence": [
          "Witness statements about the argument",
          "Location of the argument near the water"
        ],
        "reader_observable": true
      },
      {
        "observation": "The tide gauge shows low water levels during the party.",
        "correction": "This contradicts the claim that Eleanor drowned during the high tide.",
        "effect": "Eliminates the possibility of drowning at the claimed time.",
        "required_evidence": [
          "Tide gauge readings",
          "Hotel logbook with tide schedule"
        ],
        "reader_observable": true
      },
      {
        "observation": "A tide schedule indicates low tide at the time of the party.",
        "correction": "Eleanor could not have drowned at the claimed time due to low tide.",
        "effect": "Confirms the timeline manipulation by the murderer.",
        "required_evidence": [
          "Tide schedule log",
          "Witness accounts of tide levels"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "constraint_proof",
    "design": "Comparing the tide schedule with witness accounts reveals the impossibility of drowning during the party.",
    "knowledge_revealed": "The tide was low, contrary to witness claims, indicating manipulation.",
    "pass_condition": "If the drowning occurred at the claimed time, the tide levels would contradict the evidence.",
    "evidence_clues": [
      "clue_4",
      "clue_11",
      "clue_12",
      "clue_id_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements about the argument (early) and tide gauge readings (mid) establish the timeline inconsistency. Step 2: The tide schedule indicates Eleanor could not have drowned at the claimed time (mid). Step 3: Comparing this against witness accounts during the discriminating test reveals the manipulation."
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
        "Observe the evidence of tide levels and witness statements",
        "Draw conclusion about the timeline"
      ],
      "test_type": "constraint proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness testimony about his actions during the alleged drowning",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi proving she was not near the water at the time",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Evidence of her separate activities during the party",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 7:00 PM to 8:30 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of tide manipulation"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_11",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_9",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_id_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation of tide gauge"
      },
      {
        "clue_id": "clue_id_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witnesses discussing the argument"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_10",
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
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Corroborated elimination"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
        "clue_id": "clue_id_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Tide schedule log"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is an art curator whose charm hides a simmering resentment beneath the surface, particularly towards a victim who threatened her carefully curated reputation.",
    "publicPersona": "Charming and sophisticated, Eleanor is a connoisseur of art, renowned for her discerning eye and well-placed connections in the upper echelons of society.",
    "privateSecret": "Beneath her polished exterior, Eleanor harbors deep-seated resentment towards the victim, who continually overshadowed her career achievements.",
    "motiveSeed": "The victim's impending plans to expose Eleanor's dubious dealings in the art world present a direct threat to her reputation.",
    "motiveStrength": "compelling",
    "alibiWindow": "Eleanor claims to have been in a private meeting during the murder timeframe, but the details of her alibi remain suspect.",
    "accessPlausibility": "possible",
    "stakes": "With her reputation and career on the line, Eleanor faces the potential collapse of her carefully constructed world.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a refined cadence, often deploying sharp wit to deflect probing inquiries, and her laughter can be both melodic and cutting, depending on her audience.",
    "signatureTic": "Oh, darling, the art world is simply ruthless.",
    "internalConflict": "Eleanor grapples with the moral implications of her past actions, torn between the allure of deceit and the possibility of redemption.",
    "personalStakeInCase": "This crime threatens to unravel Eleanor's carefully curated life, forcing her to confront the consequences of her choices.",
    "paragraphs": [
      "Eleanor Voss glided through the crowded hotel lobby, her presence a beacon of elegance amidst the chaos of whispers and furtive glances. She was the epitome of sophistication, her keen eye for art making her a revered figure in high society. Yet, beneath the polished veneer lay a tempest of resentment, directed towards a victim who had the audacity to eclipse her achievements in the art world.",
      "The victim's threat to expose Eleanor's underhanded dealings felt like a noose tightening around her neck. As she navigated the delicate dance of social interactions, Eleanor's laughter rang out, melodic yet tinged with an edge, a façade she had perfected over the years. 'Oh, darling, the art world is simply ruthless,' she would say, masking her inner turmoil with wit sharp enough to cut glass.",
      "In the quiet moments, far from the bustling gatherings, Eleanor wrestled with her conscience. The allure of deceit was intoxicating, but the stakes were higher than she had ever imagined. The thought of losing her reputation, of being unmasked, sent shivers down her spine. Would she continue down this treacherous path, or was it time to seek redemption from the shadows of her past?",
      "As the investigation unfolded, Eleanor found herself at a crossroads. The very crime that threatened to destroy her was also an opportunity—a chance to confront her own moral failings and emerge from the shadows. The question lingered: could she cast aside her resentment and reclaim her integrity, or would the pursuit of ambition lead her to irrevocable ruin?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected psychiatrist whose progressive views mask a troubled past, now threatened by the specter of exposure from the victim.",
    "publicPersona": "Known for her forward-thinking approach to mental health, Dr. Mallory Finch commands respect in her field, often seen as a beacon of hope for her patients.",
    "privateSecret": "However, lurking beneath the surface is a history of unethical practices that could shatter her career, particularly with the victim poised to reveal the truth.",
    "motiveSeed": "The victim's intention to publish a damaging article about Mallory's past unethical practices serves as a catalyst for her potential involvement.",
    "motiveStrength": "strong",
    "alibiWindow": "Mallory was attending a conference but returned early to the hotel, raising questions about her whereabouts during the murder.",
    "accessPlausibility": "possible",
    "stakes": "The specter of losing her medical license looms large, threatening to tarnish the career she has worked so hard to build.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks in a measured tone, her words carefully chosen, often laced with a subtle irony that reveals her sharp intellect when least expected.",
    "signatureTic": "Ah, the mind, a labyrinth of secrets.",
    "internalConflict": "Mallory is plagued by guilt over her past, wrestling with the fear of exposure and the potential collapse of her professional life.",
    "personalStakeInCase": "This crime is personal for Mallory; the risk of losing her license and reputation forces her to confront the darkness she has tried to bury.",
    "paragraphs": [
      "Dr. Mallory Finch stood poised at the intersection of respectability and ruin, her reputation as a progressive psychiatrist a fragile facade. Known for her groundbreaking views on mental health, she was a beacon of hope for many. But shadows lurked behind her polished exterior, a history of unethical practices that could unravel everything she had built.",
      "As whispers of the victim's intention to publish a damning article about her past circulated, Mallory felt the ground shift beneath her. 'Ah, the mind, a labyrinth of secrets,' she would quip, masking her unease with a veneer of dry humor. Yet, the stakes were alarmingly high; the thought of losing her medical license sent tremors of fear coursing through her.",
      "Her alibi, attending a conference, offered a flimsy shield against the encroaching darkness. The early return to the hotel, however, cast doubt on her whereabouts during the crucial moments of the murder. Mallory's mind raced, a whirlwind of thoughts battling for dominance—could she trust her instincts, or was she merely a puppet in a game of chance?",
      "In the quiet confines of her thoughts, Mallory wrestled with guilt and the weight of her past. The investigation forced her to confront the very demons she had sought to suppress. This was more than just a professional crisis; it was a reckoning. The question loomed: would she allow fear to dictate her choices, or would she muster the courage to reclaim her integrity, even if it meant facing the truth she had long evaded?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer, a figure of stoic honor whose dark wartime secrets threaten to unravel his reputation as a local hero.",
    "publicPersona": "Regarded as a war hero, Captain Ivor Hale carries himself with stoic honor, a man of few words whose presence commands respect.",
    "privateSecret": "Yet, beneath the surface lies a dark secret involving a wartime betrayal that the victim had discovered, casting a shadow over his legacy.",
    "motiveSeed": "The victim's intention to reveal Ivor's past betrayal in an upcoming book poses a significant threat to his esteemed reputation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor claims to have been on the terrace when the murder occurred, but the truth of his whereabouts remains murky.",
    "accessPlausibility": "easy",
    "stakes": "Ivor's standing in the community is at stake, risking the honor he has built over a lifetime.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Ivor speaks in a low, gravelly voice, his words deliberate and measured, often punctuated by long silences that carry more weight than his speech.",
    "signatureTic": "Honor is a heavy burden.",
    "internalConflict": "Ivor is haunted by guilt over his wartime actions, torn between the desire to protect his legacy and the truth of his past.",
    "personalStakeInCase": "The revelation of his dark secret could obliterate the reputation he has fought to uphold, forcing him to confront the ghosts of his past.",
    "paragraphs": [
      "Captain Ivor Hale stood as a paragon of stoic honor, a retired naval officer whose reputation as a war hero was celebrated in the community. His presence was commanding, a man whose few words carried the weight of experience and authority. Yet, beneath the surface of this esteemed figure lay a dark secret, a betrayal from his past that had been unearthed by the victim.",
      "As the whispers of the victim's intentions to expose his wartime actions circulated, Ivor felt the ground beneath him shift. 'Honor is a heavy burden,' he would mutter, a phrase that resonated with the gravity of his situation. The alibi he offered—an evening spent on the terrace—did little to assuage the doubts that loomed over him.",
      "The stakes were painfully clear: his standing in the community was at risk, a precarious cliff upon which he was teetering. Ivor's mind raced as he contemplated the consequences of exposure. The honor he had fought for could dissolve into dust, leaving only the remnants of betrayal in its wake.",
      "In the solitude of his thoughts, Ivor wrestled with guilt, a specter from his past that refused to be silenced. The investigation forced him to confront the choices he had made, the price of his honor. Would he allow the truth to consume him, or could he find a way to reconcile his past with the man he aspired to be?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious journalist whose desire for recognition masks a bitter past with the victim, igniting a complex web of motives.",
    "publicPersona": "An up-and-coming journalist, Beatrice is eager to make a name for herself in the competitive world of reporting, known for her tenacity and ambition.",
    "privateSecret": "However, her once-romantic relationship with the victim ended in bitterness, leaving her with unresolved emotions that cloud her judgment.",
    "motiveSeed": "The victim's threat to expose Beatrice's sensationalist reporting tactics serves as a potential catalyst for her involvement in the crime.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice claims to have been gathering information at a bar during the murder, though the details of her alibi remain vague.",
    "accessPlausibility": "unlikely",
    "stakes": "Her career could be irreparably damaged if the truth about her tactics were to surface, jeopardizing her ambitions.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice's speech is often punctuated by a sardonic edge, her words flowing with a blend of confidence and underlying vulnerability, revealing her complex emotions.",
    "signatureTic": "In this business, it's all about the story.",
    "internalConflict": "Beatrice grapples with unresolved feelings towards the victim, torn between ambition and the remnants of a past love that complicates her motives.",
    "personalStakeInCase": "The potential exposure of her unethical tactics threatens not only her career but also her self-worth, forcing her to navigate the murky waters of ambition and ethics.",
    "paragraphs": [
      "Beatrice Quill was a force to be reckoned with in the world of journalism, her ambition a double-edged sword that drove her to excel. Eager to make a name for herself, she often found herself at the forefront of competitive reporting, her tenacity admired by some and criticized by others. Yet, beneath the surface of her confidence lay a turbulent past with the victim—once a romantic partner, now a source of unresolved bitterness.",
      "In her sardonic manner, Beatrice would often quip, 'In this business, it's all about the story,' masking the turmoil that roiled within. The victim's threat to expose her sensationalist reporting tactics loomed large, a specter that could obliterate her burgeoning career. As she navigated the treacherous waters of the investigation, the stakes felt impossibly high.",
      "Her alibi, a bar gathering intended to collect information, felt flimsy at best. The details were murky, and the whispers of suspicion clung to her like a second skin. Beatrice's mind raced as she struggled to reconcile her ambition with the remnants of a past love that complicated her motives. Was she driven by the desire for recognition, or was there something deeper, more personal at play?",
      "As the investigation unfolded, Beatrice found herself at a crossroads, forced to confront the reality of her choices. The potential exposure of her unethical tactics threatened to shatter her self-worth, a reckoning that demanded she navigate the fine line between ambition and ethics. Would she rise above the chaos, or would the shadows of her past consume her?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a wealthy socialite whose manipulative charm conceals a dark secret of embezzlement, now threatened by the victim's discovery.",
    "publicPersona": "A fixture in high society, Sylvia is known for her lavish gatherings and influential connections, embodying the essence of wealth and privilege.",
    "privateSecret": "However, beneath her glamorous facade lies a secret—she has been embezzling funds from her charitable organization, a transgression that the victim had uncovered.",
    "motiveSeed": "The victim's threat to inform the authorities about Sylvia's embezzlement poses a significant risk to her opulent lifestyle.",
    "motiveStrength": "strong",
    "alibiWindow": "Sylvia claims to have been hosting guests in her suite, but the truth of her activities during the murder remains questionable.",
    "accessPlausibility": "easy",
    "stakes": "The collapse of her lavish lifestyle hangs in the balance, a risk that could shatter the illusion of her social standing.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia's speech is marked by a polished elegance, interspersed with dry humor that reveals her sharp intellect and cunning nature.",
    "signatureTic": "Charity begins at home, wouldn't you agree?",
    "internalConflict": "Sylvia is torn between maintaining her status and the growing weight of guilt over her embezzlement, a conflict that threatens her carefully constructed world.",
    "personalStakeInCase": "This crime is personal; the threat of exposure could dismantle her entire life, forcing her to confront the consequences of her actions.",
    "paragraphs": [
      "Sylvia Trent floated through the social gatherings like a shimmering apparition, a wealthy socialite whose presence was synonymous with opulence. Known for her extravagant soirées and influential connections, she embodied the essence of privilege. Yet, beneath the glamorous veneer lay a dark secret—embezzlement from her own charitable organization, a transgression that had been uncovered by the victim.",
      "With a dry wit that often caught others off guard, Sylvia would quip, 'Charity begins at home, wouldn't you agree?' masking the turmoil that gnawed at her conscience. The victim's threat to inform the authorities loomed over her like a dark cloud, casting shadows on her lavish lifestyle and the façade she had built.",
      "Her alibi—a gathering of guests in her suite—felt tenuous at best, and whispers of suspicion began to swirl around her. The stakes were alarmingly high; the collapse of her opulent lifestyle was imminent, a risk that could shatter the illusion of her social standing. Sylvia's mind raced as she contemplated the consequences of exposure, the weight of her deceit pressing down like a leaden shroud.",
      "As the investigation unfolded, Sylvia faced an internal conflict that threatened to unravel her carefully constructed world. The desire to maintain her status clashed with the growing weight of guilt over her actions. Would she continue to manipulate her way out of trouble, or would she find the courage to confront the truth, even if it meant sacrificing everything she held dear?"
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is the diligent hotel manager caught in a web of ethical dilemmas, struggling to maintain the façade of his establishment while confronting a murder investigation.",
    "publicPersona": "Known for his meticulous attention to detail, Hugo Vane runs the hotel with an iron fist, ensuring that every aspect operates smoothly.",
    "privateSecret": "However, he has been covering up incidents at the hotel to protect its reputation, a secret that weighs heavily on his conscience.",
    "motiveSeed": "Under pressure from investors to maintain the hotel's pristine image, Hugo's actions are driven by a desire to protect his career.",
    "motiveStrength": "moderate",
    "alibiWindow": "Hugo claims to have been in the kitchen during the murder, handling a catering issue, a statement that invites scrutiny.",
    "accessPlausibility": "possible",
    "stakes": "Hugo's career and the hotel's reputation hang in the balance, a precarious position he must navigate carefully.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks in a calm, collected manner, often employing observational humor that reflects his keen awareness of the absurdities around him.",
    "signatureTic": "It’s all in the details, wouldn’t you say?",
    "internalConflict": "Hugo grapples with the ethical dilemmas of his actions, torn between loyalty to the hotel and the truth that threatens to surface.",
    "personalStakeInCase": "This crime is personal; the integrity of his hotel and his career are at stake, forcing him to confront the very secrets he has tried to bury.",
    "paragraphs": [
      "Hugo Vane was the diligent hotel manager, a man whose meticulous attention to detail ensured that every facet of the establishment ran like clockwork. Known for his iron-fisted approach, he commanded respect from both staff and guests alike. Yet, beneath the surface of his professional demeanor lay a web of ethical dilemmas, a secret that threatened to unravel the very foundation of his career.",
      "As the murder investigation began to unfold, Hugo found himself caught in a precarious position. 'It’s all in the details, wouldn’t you say?' he would remark, employing observational humor as a defense mechanism against the rising tide of scrutiny. Yet, the pressure from investors to maintain the hotel's pristine image weighed heavily on his conscience, compelling him to cover up incidents that could tarnish its reputation.",
      "His alibi—busy in the kitchen during the murder—invited questions, and the stakes were alarmingly high. The integrity of the hotel and his career hung in the balance, a precarious tightrope he must navigate with caution. Hugo's mind raced as he contemplated the consequences of exposure, the truth threatening to shatter the façade he had worked so hard to uphold.",
      "In the quiet moments of reflection, Hugo wrestled with his internal conflict, torn between loyalty to the hotel and the moral imperative to confront the truth. The investigation forced him to confront the very secrets he had sought to bury. Would he continue to protect the image of the establishment at all costs, or would he find the courage to embrace honesty, even if it meant risking everything he held dear?"
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Crestview Hotel",
    "type": "seaside hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel overlooking the churning waters of the English Channel, steeped in the glamour and mystery of the 1940s.",
    "visualDescription": "Art Deco façade adorned with geometric patterns, expansive glass windows reflecting the turbulent sea, and a sprawling terrace filled with wrought-iron furniture.",
    "atmosphere": "A blend of elegance and tension, embodying the weight of wartime secrets.",
    "paragraphs": [
      "The Crestview Hotel stands resolutely against the backdrop of the restless sea, its Art Deco architecture a striking contrast to the grey, overcast skies. The air is thick with the salty tang of the ocean, mingling with the faint whiff of damp stone from the hotel’s weathered exterior. Inside, the lavish lobby is a cacophony of muted voices and the soft clinking of glasses from the bar, where patrons seek solace from the grim realities of the outside world. The atmosphere is electric, a palpable tension lingering like the fog outside, as guests whisper conspiratorially, each harboring their own secrets.",
      "As evening descends, the hotel’s ornate chandeliers cast flickering shadows across the polished marble floors, creating an eerie play of light that dances with the shadows of the past. The sounds of the crashing waves echo through the corridors, a constant reminder of the isolation that envelops the hotel. Outside, the terrace, once filled with laughter and sunlight, now stands empty, save for the haunting whisper of the wind that carries the scent of brine and mystery. Here, amidst the elegance, lies an undercurrent of anxiety, as guests grapple with the uncertainties of a world at war.",
      "Each room in The Crestview seems to hold its breath, the echoes of past conversations lingering in the air like the faint scent of tobacco and perfume. The narrow hallways, dimly lit by antique sconces, create a sense of confinement, making every corner feel like a potential hiding place for secrets or danger. The hotel’s isolation from the nearby town intensifies the feeling of entrapment, as guests find themselves not only at the mercy of the tides but also of the intricate web of deceit that weaves through the very fabric of the hotel."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "foggy and overcast, typical of coastal climates",
    "timeFlow": "Three days of mounting tension and suspense",
    "mood": "tense and suspenseful, with underlying anxiety from recent wartime events",
    "eraMarkers": [
      "Art Deco architecture",
      "radio broadcasts crackling in the lounge",
      "rationed wartime vehicles parked outside",
      "early television set flickering in the drawing room"
    ],
    "sensoryPalette": {
      "dominant": "salty ocean air and tension",
      "secondary": [
        "flickering candlelight",
        "soft jazz from the bar"
      ]
    },
    "paragraphs": [
      "The Crestview Hotel is steeped in an atmosphere of muted elegance, where the salty tang of the ocean mingles with the faint aroma of damp wood and old leather. Outside, the crashing waves provide a constant backdrop, their rhythmic pulse echoing the unease of the guests within. The fog rolls in thick, obscuring the horizon and wrapping the hotel in an embrace of mystery, creating an uncanny sense of isolation amidst the war-torn backdrop of 1940s England.",
      "Inside, the air is charged with unspoken words and hidden glances, as patrons gather in the lounge, seeking refuge from the world outside. The soft strains of a jazz piano echo through the space, punctuated by the clinking of glasses and the murmur of hushed conversations. Every corner of the hotel whispers secrets, and the flickering candlelight casts shadows that seem to dance with the ghosts of the past, heightening the sense of suspense that permeates the atmosphere."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "High ceilings adorned with crystal chandeliers, marble floors reflecting the muted light, plush seating arranged for conversation.",
      "sensoryDetails": {
        "sights": [
          "crystal chandeliers glimmering",
          "velvet drapes framing windows",
          "art deco sculptures lining walls",
          "polished marble floors reflecting light"
        ],
        "sounds": [
          "soft jazz playing in the background",
          "muffled chatter of guests",
          "footsteps echoing on marble",
          "the clinking of glasses at the bar"
        ],
        "smells": [
          "freshly polished wood",
          "old leather and tobacco",
          "faint floral perfume",
          "damp stone from the entrance"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft velvet upholstery",
          "cool metal of the bar counter",
          "warmth of the fireplace nearby"
        ]
      },
      "accessControl": "Open to all guests, staff-only access restricted to behind the bar.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through windows",
            "water droplets on glass surfaces"
          ],
          "sounds": [
            "steady patter of rain on the roof",
            "soft murmurs of early guests"
          ],
          "smells": [
            "damp earth from outside",
            "fresh coffee brewing",
            "wet stone"
          ],
          "mood": "melancholic tranquility"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "empty armchairs awaiting patrons"
          ],
          "sounds": [
            "the ticking of an antique clock",
            "the rustle of newspapers being read"
          ],
          "smells": [
            "old paper and ink",
            "faint whiff of tobacco smoke",
            "dust motes in the air"
          ],
          "mood": "suspenseful stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft candlelight illuminating faces",
            "glimmering glasses on the bar"
          ],
          "sounds": [
            "laughter breaking the tension",
            "the faint sound of waves crashing"
          ],
          "smells": [
            "cooked seafood from the kitchen",
            "the aroma of fine whiskey",
            "fresh flowers in vases"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Crestview Hotel is a feast for the senses, where the high ceilings adorned with crystal chandeliers create an air of opulence. Guests gather in plush seating, their conversations a blend of laughter and hushed whispers, as the soft jazz music floats through the air, mingling with the rich aroma of old leather and polished wood. The marble floors, cool beneath one's feet, reflect the muted light filtering through the velvet drapes, casting a warm glow over the space. Yet, beneath the surface glamour lies a palpable tension, as secrets swirl like the fog outside.",
        "As day turns to evening, the lobby transforms into a haven of flickering candlelight, where shadows dance across the walls, revealing glimpses of art deco sculptures that seem to watch over the proceedings. The sound of clinking glasses punctuates the air, a reminder of the refuge sought within these walls from the chaos of the outside world. Each guest carries their own burdens, their expressions betraying the weight of unspoken fears as they navigate the delicate balance of camaraderie and suspicion."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Ocean View Dining Room",
      "type": "interior",
      "purpose": "Dining and socializing",
      "visualDetails": "Floor-to-ceiling windows offering panoramic views of the ocean, elegantly set tables with shimmering cutlery, and soft lighting creating an intimate atmosphere.",
      "sensoryDetails": {
        "sights": [
          "panoramic views of crashing waves",
          "soft flicker of candlelight",
          "art deco wall murals"
        ],
        "sounds": [
          "clinking of cutlery against plates",
          "soft conversations and laughter",
          "the distant roar of the ocean",
          "waiters gliding between tables"
        ],
        "smells": [
          "aroma of grilled seafood",
          "freshly baked bread",
          "light scent of citrus",
          "faint hint of white wine"
        ],
        "tactile": [
          "smooth linen tablecloths",
          "cool glassware in hand",
          "warmth of the fireplace",
          "soft velvet seating"
        ]
      },
      "accessControl": "Open to guests during meal times; staff-only access during off-hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey skies reflected in glass",
            "raindrops tracing patterns on windows"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "muffled sounds from the kitchen"
          ],
          "smells": [
            "freshly brewed coffee",
            "warm pastries in the oven",
            "the tang of salt in the air"
          ],
          "mood": "cozy comfort"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "empty tables awaiting guests"
          ],
          "sounds": [
            "the rustle of napkins being prepared",
            "the faint sound of waves crashing"
          ],
          "smells": [
            "fresh herbs and spices",
            "the aroma of simmering sauces",
            "the scent of damp earth"
          ],
          "mood": "anticipatory stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues across the room",
            "glimmers of glass reflecting candlelight"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "the soft strumming of a guitar"
          ],
          "smells": [
            "grilled seafood and garlic",
            "the scent of rich desserts",
            "the aroma of coffee brewing"
          ],
          "mood": "elegant celebration"
        }
      ],
      "paragraphs": [
        "The Ocean View Dining Room is a breathtaking space, where floor-to-ceiling windows frame the tumultuous sea, providing an ever-changing backdrop to the dining experience. Tables are elegantly set with shimmering cutlery, each place adorned with crisp white linens that beckon guests to linger. As the aroma of grilled seafood wafts through the air, it mingles with the faintest hint of citrus, creating a tantalizing invitation to indulge. The soft glow of candlelight casts an intimate atmosphere, drawing guests into a world where time seems to stand still, yet the tension is ever-present.",
        "As the evening unfolds, laughter and the clinking of glasses fill the room, a stark contrast to the whispers of secrets that ripple just beneath the surface. The distant roar of the ocean serves as a constant reminder of the isolation that surrounds the hotel, while the warmth of the fireplace offers a comforting embrace amidst the growing unease. Each bite of the exquisite cuisine is savored, yet the unspoken words hang heavy in the air, as diners navigate the delicate line between camaraderie and suspicion, each contemplating the mysteries that lie within the hotel's walls."
      ]
    },
    {
      "id": "crime_scene",
      "name": "The Seaside Terrace",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "Sprawling terrace overlooking the crashing waves, wrought-iron furniture scattered about, and a view obscured by thick fog.",
      "sensoryDetails": {
        "sights": [
          "crashing waves below",
          "shadows of furniture in the fog",
          "dark clouds heavy with rain",
          "flickering lanterns casting dim light"
        ],
        "sounds": [
          "roaring ocean waves",
          "whispering wind through the railing",
          "distant calls of seabirds",
          "the creaking of wrought iron"
        ],
        "smells": [
          "damp sea air",
          "faint scent of salt and decay",
          "wet stone from the terrace",
          "the mustiness of old wood"
        ],
        "tactile": [
          "cold metal of the furniture",
          "rough texture of stone underfoot",
          "chill of the evening air",
          "wetness of the fog on skin"
        ]
      },
      "accessControl": "Restricted access after dark; only staff and police allowed during investigation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "damp terrace glistening with rain",
            "grey clouds hanging low",
            "puddles forming near the edge"
          ],
          "sounds": [
            "steady drumming of rain on the terrace",
            "soft splash of water against stone"
          ],
          "smells": [
            "fresh rain and seaweed",
            "the scent of wet earth",
            "faint aroma of wet wood"
          ],
          "mood": "oppressive gloom"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dulling colors",
            "shadows stretching long across the terrace"
          ],
          "sounds": [
            "the distant crash of waves",
            "the rustle of fog rolling in"
          ],
          "smells": [
            "salt and brine",
            "the musty scent of fog",
            "faint whiff of decay from the sea"
          ],
          "mood": "foreboding unease"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "stars beginning to twinkle overhead",
            "the horizon glowing with sunset"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "the distant laughter from the dining room"
          ],
          "smells": [
            "the scent of night-blooming jasmine",
            "cool ocean breeze",
            "the lingering aroma of dinner"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Seaside Terrace is a haunting tableau, where wrought-iron furniture stands sentinel against the backdrop of the crashing waves below. The fog rolls in thick, obscuring the view and creating an unsettling atmosphere, as shadows dance and flicker in the dim light of lanterns. The air is heavy with the scent of damp stone and decay, a reminder of the ocean's relentless grip on the land. Here, secrets are whispered and mysteries await uncovering, as the wind carries the weight of unspoken fears across the terrace.",
        "As night falls, the terrace becomes a stage for tension, where every creak of the furniture and whisper of the wind seems to echo with the ghosts of the past. The cold metal of the chairs bites at the skin, while the chill of the evening air wraps around like a shroud. It is here that the boundaries between safety and danger blur, and the truth lies hidden just beneath the surface, waiting for its moment to be revealed in the flickering shadows."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "Dark wood shelves filled with dusty tomes, plush armchairs for reading, and a large window overlooking the terrace.",
      "sensoryDetails": {
        "sights": [
          "dusty tomes lining dark wood shelves",
          "faded upholstery on armchairs",
          "golden light from reading lamps",
          "the silhouette of the terrace outside"
        ],
        "sounds": [
          "the rustle of pages turning",
          "the soft creak of old wood",
          "distant waves crashing",
          "the ticking of a clock"
        ],
        "smells": [
          "old paper and leather",
          "the mustiness of forgotten stories",
          "the faint aroma of polished wood",
          "the scent of fresh ink"
        ],
        "tactile": [
          "rough texture of aged spines",
          "softness of well-worn armchairs",
          "cold surface of the reading table",
          "the chill of the evening air seeping in"
        ]
      },
      "accessControl": "Access limited to guests during daylight hours; staff-only access after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops tracing patterns on the window",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady rhythm of rain against glass",
            "soft whispers of guests"
          ],
          "smells": [
            "freshly brewed tea",
            "the scent of damp wood",
            "the musty smell of old books"
          ],
          "mood": "introspective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows on shelves",
            "the flicker of a candle's flame"
          ],
          "sounds": [
            "the rustle of turning pages",
            "distant thunder rumbling"
          ],
          "smells": [
            "the scent of aged paper",
            "the aroma of burning wax",
            "the faint smell of mildew"
          ],
          "mood": "suspenseful anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden glow from reading lamps",
            "shadows stretching across the floor"
          ],
          "sounds": [
            "the crackle of a fire in the fireplace",
            "the distant laughter from the lobby"
          ],
          "smells": [
            "the scent of fresh ink and paper",
            "the warmth of cedar wood",
            "the aroma of evening tea"
          ],
          "mood": "quiet reflection"
        }
      ],
      "paragraphs": [
        "The Library of The Crestview Hotel is a sanctuary of knowledge and mystery, where the dark wood shelves are laden with dusty tomes that whisper stories of the past. Plush armchairs invite guests to sink into their embrace, while a large window offers a glimpse of the terrace, shrouded in fog. The air is thick with the rich scents of old paper and leather, mingling with the faint aroma of polished wood. Here, the ticking of the clock marks the passage of time, as guests immerse themselves in the pages of forgotten tales, unaware that their own stories are unfolding just outside.",
        "As the day wanes, the library transforms into a cocoon of introspection, illuminated by the golden glow of reading lamps that cast flickering shadows across the room. The rustle of pages turning and the soft creak of old wood create a symphony of solitude, while the distant crash of waves serves as a constant reminder of the world beyond. In this quiet refuge, the air is thick with unspoken thoughts, and the scent of fresh ink lingers in the air, hinting at secrets waiting to be uncovered amidst the tomes."
      ]
    }
  ],
  "note": "",
  "cost": 0.00250910715,
  "durationMs": 33829
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1943,
    "month": "January",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "foggy and overcast",
      "chilly winds from the sea",
      "occasional light rain"
    ],
    "daylight": "Short daylight hours, with sunrise around 8:00 AM and sunset by 4:30 PM, creating an early dusk.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when shadows lengthen and the hotel is quiet.",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "brisk walks along the beach",
      "indoor games by the fireplace",
      "visits to local markets for winter produce"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suit",
        "tweed overcoat",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "corduroy trousers",
        "knitted sweaters",
        "button-up flannel shirts"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "wool scarf"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a fitted waist",
        "tailored wool coat",
        "pearl necklace"
      ],
      "casual": [
        "sweater sets",
        "high-waisted skirts",
        "broad-brimmed felt hats"
      ],
      "accessories": [
        "clutch handbag",
        "simple brooch",
        "silk scarf"
      ]
    },
    "trendsOfTheMoment": [
      "bold patterns and colors in textile design",
      "utilitarian styles gaining popularity",
      "influence of Hollywood glamour"
    ],
    "socialExpectations": [
      "men are expected to wear hats outdoors",
      "women should maintain modesty in dress",
      "formal gatherings require elegant attire"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Allied forces planning the invasion of Europe",
      "widespread rationing affecting daily life",
      "intensifying air raids in Europe"
    ],
    "politicalClimate": "The United States is heavily involved in World War II, with a focus on supporting Allied nations.",
    "economicConditions": "Rationing of food and goods continues, impacting consumer choices and lifestyles.",
    "socialIssues": [
      "women's roles in the workforce are changing",
      "discussions about civil rights are beginning to emerge",
      "racial tensions due to wartime segregation"
    ],
    "internationalNews": [
      "Battle of Stalingrad marks a turning point on the Eastern Front",
      "U.S. Navy expanding operations in the Pacific"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'I'll Be Seeing You' by Bing Crosby",
        "'Don't Sit Under the Apple Tree' by The Andrews Sisters",
        "'In the Mood' by Glenn Miller"
      ],
      "films": [
        "'Casablanca'",
        "'For Whom the Bell Tolls'",
        "'The Ox-Bow Incident'"
      ],
      "theater": [
        "'The Glass Menagerie'",
        "'The Skin of Our Teeth'",
        "'The Little Foxes'"
      ],
      "radio": [
        "'The Shadow'",
        "'The Jack Benny Program'",
        "'The Fred Allen Show'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Fountainhead' by Ayn Rand",
        "'The Little Prince' by Antoine de Saint-Exupéry",
        "'The Catcher in the Rye' (serial publication)"
      ],
      "popularGenres": [
        "detective fiction",
        "war novels",
        "romantic fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first practical radar systems",
        "improved military vehicles",
        "advancements in synthetic rubber"
      ],
      "commonDevices": [
        "early television sets",
        "transistor radios",
        "mechanical typewriters"
      ],
      "emergingTrends": [
        "emphasis on wartime innovations",
        "growth of broadcast media",
        "development of military technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pack of cigarettes: one shilling",
        "Coal scuttle refill: one shilling sixpence"
      ],
      "commonActivities": [
        "homemade meals due to rationing",
        "gathering for radio shows",
        "participation in local community events"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "holiday gatherings in communal spaces",
        "formal dances at local halls"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "middle class values are emphasized",
      "working class struggles are recognized",
      "increased focus on community support"
    ],
    "gender": [
      "women are stepping into roles traditionally held by men",
      "expectations of femininity remain strong",
      "debates about women's rights begin to surface"
    ],
    "race": [
      "racial segregation is still prevalent",
      "discussions about equality gain traction",
      "increased visibility of Black soldiers in the war"
    ],
    "generalNorms": [
      "conformity is valued",
      "patriotism is emphasized",
      "community involvement is encouraged"
    ]
  },
  "atmosphericDetails": [
    "The salty scent of the ocean mingles with dampness in the air, creating a heavy atmosphere.",
    "The sound of distant waves crashing against the rocks is occasionally broken by the low murmur of conversation from hotel guests.",
    "The flickering light of oil lamps casts shadows on the walls, enhancing the sense of mystery and unease."
  ],
  "paragraphs": [
    "January 1943 is a month steeped in the chill of winter along the coastal hotel, where fog lingers over the sea, obscuring the horizon and heightening the air of suspense. The overcast skies cast a gray pallor over the landscape, with short days and long, dark evenings. The hotel, typically bustling with the chatter of guests, now holds a tense quiet, punctuated only by the murmur of radio broadcasts discussing the latest war developments. Guests wrapped in wool coats and scarves gather around the fireplace, their faces illuminated by the flickering flames, sharing stories that blend with the hum of wartime anxiety.",
    "Fashion trends of the time reflect both the ongoing war and a desire for elegance. Men wear double-breasted wool suits paired with silk ties featuring geometric patterns, while women don tea-length dresses accentuated by tailored wool coats and pearl necklaces. The atmosphere is a blend of utilitarian styles and Hollywood glamour, with women opting for sweater sets and high-waisted skirts, completing their looks with brooches and silk scarves. This contrast highlights the struggle between the harsh realities of wartime life and the pursuit of beauty and sophistication.",
    "Daily life in January 1943 revolves around the challenges of rationing and the societal shifts brought on by the war. A loaf of bread costs four pence, while a pack of cigarettes runs one shilling—luxuries that many indulge in sparingly. Families gather for Sunday dinners, sharing the few resources they have amidst the spirit of community. As women increasingly join the workforce, traditional roles are being redefined, leading to subtle shifts in social norms. The rituals of life continue, with local events fostering a sense of togetherness in a world filled with uncertainty."
  ],
  "note": "",
  "cost": 0.00105205485,
  "durationMs": 13579
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a grand seaside hotel for a post-war charity event draws together a diverse group, all grappling with societal changes and personal secrets, while the looming threat of a tidal drowning complicates their fates.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The class dynamics are shifting as women enter the workforce, creating tension among traditional roles, while the shared trauma of war and Cold War anxieties heighten social pressures."
  },
  "setting": {
    "location": "A grand seaside hotel with expansive views of the ocean and a sprawling terrace.",
    "institution": "seaside hotel",
    "weather": "foggy and overcast, typical of coastal climates"
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
    "id": "tide_schedule",
    "value": "seven feet",
    "description": "The tide reached seven feet at the time of the claimed drowning."
  },
  {
    "id": "gala_start_time",
    "value": "eight o'clock in the evening",
    "description": "The gala started at eight o'clock in the evening."
  },
  {
    "id": "low_tide_time",
    "value": "six o'clock in the evening",
    "description": "The tide was at its lowest point at six o'clock in the evening."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 7,
    "mid": 12,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 19,
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
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_9",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_11",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_2",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_3",
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
