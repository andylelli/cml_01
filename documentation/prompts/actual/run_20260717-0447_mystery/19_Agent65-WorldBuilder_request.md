# Actual Prompt Record

- Run ID: `mystery-1784263668428`
- Project ID: ``
- Timestamp: `2026-07-17T04:52:39.196Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `02657340d3272434`

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
    "title": "The Illusion of Authority",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "a seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "impersonation"
    }
  },
  "death_method": "struck with a heavy object",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A well-known socialite",
      "private_secret": "Involved in a secret affair",
      "motive_seed": "Fear of exposure",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "30-40",
      "role_archetype": "Doctor",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Resentful of the victim's social status",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Authority figure",
      "relationships": [],
      "public_persona": "Retired naval officer",
      "private_secret": "Involved in blackmail",
      "motive_seed": "Financial gain",
      "motive_strength": "high",
      "alibi_window": "10:00 PM to 10:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Financial security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Maid",
      "relationships": [],
      "public_persona": "Hotel staff",
      "private_secret": "Knows more than she lets on",
      "motive_seed": "Protecting a secret",
      "motive_strength": "low",
      "alibi_window": "9:30 PM to 10:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Job security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Socialite",
      "relationships": [],
      "public_persona": "Friend of the victim",
      "private_secret": "Jealous of Eleanor's status",
      "motive_seed": "Rivalry",
      "motive_strength": "moderate",
      "alibi_window": "10:00 PM to 10:15 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Social standing",
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
      "private_secret": "Has a personal connection to the victim",
      "motive_seed": "Personal attachment",
      "motive_strength": "low",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Justice for Eleanor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
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
      "summary": "On a stormy night at a seaside hotel, Eleanor Voss is found dead, struck with a heavy object. Hugo Vane investigates the complex relationships and hidden motives among the guests, ultimately revealing a cunning impersonation that distorts authority and misleads witnesses."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on impersonat, murder, and witnes to expose the false timing.",
      "delivery_path": [
        {
          "step": "Captain Hale disguises himself in Eleanor's clothing and leaves the hotel to create a false timeline."
        },
        {
          "step": "Witnesses misidentify him as Eleanor due to the storm and poor visibility."
        },
        {
          "step": "He returns to the hotel, allowing the real murder to go unnoticed."
        }
      ]
    },
    "outcome": {
      "result": "The true identity of the murderer is revealed as Captain Hale, who manipulated perceptions of authority."
    }
  },
  "false_assumption": {
    "statement": "The hotel manager was present during the murder, ensuring no one could leave or enter unnoticed.",
    "type": "authority",
    "why_it_seems_reasonable": "The staff are convinced of the manager's constant presence due to his reputation.",
    "what_it_hides": "The manager had left unexpectedly, creating a window for the murder."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch had access to the victim and a motive rooted in jealousy.",
      "Witnesses recall seeing her near the scene shortly before the murder."
    ],
    "the_one_flaw": "Her alibi is corroborated by hospital records showing she was attending to a patient at the time.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses claim to have seen Dr. Finch arguing with Eleanor the night of the murder.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "They were discussing Eleanor's health, not an argument.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A broken vase found near the scene, suggesting a struggle.",
      "points_at_suspect": "Sylvia Trent",
      "innocent_explanation": "The vase was broken earlier during a party.",
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
    "rationale": "All suspects were present at the hotel and had the opportunity, while no outsiders could have committed the crime."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "9:00 PM",
        "10:00 PM"
      ],
      "windows": [
        "9:30 PM to 10:15 PM"
      ],
      "contradictions": [
        "Witnesses saw the hotel manager present, yet he was recorded leaving at 9:45 PM."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Dr. Mallory Finch"
      ],
      "objects": [
        "Heavy object used in murder",
        "Eleanor's clothing"
      ],
      "permissions": [
        "Access to the victim's room"
      ]
    },
    "physical": {
      "laws": [
        "Visibility is reduced during storms."
      ],
      "traces": [
        "Footprints leading to the beach that don’t match any suspect’s shoe."
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff trust the manager’s authority."
      ],
      "authority_sources": [
        "Witnesses rely on the hotel manager's presence."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witness statements incorrectly claim the hotel manager was present during the murder.",
        "correction": "The manager had left at 9:45 PM, creating a window for the murder.",
        "effect": "Narrows suspect pool to those present after 9:45 PM.",
        "required_evidence": [
          "Staff records showing the manager's absence.",
          "Witness accounts contradicting manager's timeline."
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints leading away from the scene mismatch the size of any suspect.",
        "correction": "The footprints were likely planted to mislead the investigation.",
        "effect": "Eliminates all suspects except Captain Hale, who has access.",
        "required_evidence": [
          "Footprints appear to be from a different shoe size.",
          "Witness who saw a different person in the area."
        ],
        "reader_observable": true
      },
      {
        "observation": "A hat with Captain Hale's initials is found near the murder scene.",
        "correction": "This indicates Hale was present and involved in the impersonation.",
        "effect": "Narrows focus to Captain Hale as the primary suspect.",
        "required_evidence": [
          "The hat found near the scene.",
          "Previous witness descriptions matching Hale's attire."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares witnes, timelin, and statement against the claimed timeline.",
    "knowledge_revealed": "The hat's initials confirm Hale's identity during the impersonation.",
    "pass_condition": "If Hale's clothing is found matching the disguise, it proves he made the impersonation.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_10",
      "clue_culprit_direct_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Staff records and witness statements (early) allow the reader to establish the manager's absence. Step 2: Footprints and witness descriptions (mid) eliminate other suspects. Step 3: The hat's discovery (late) directly implicates Captain Hale, culminating in the discriminating test that confirms the disguise."
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
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Hospital records confirm her whereabouts during the murder.",
        "supporting_clues": [
          "hospital records",
          "witness testimonies"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness testimony reveals she was at the party.",
        "supporting_clues": [
          "party attendance records",
          "multiple witness accounts"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Beatrice’s alibi as a maid checked by other staff confirms her absence.",
        "supporting_clues": [
          "staff schedules",
          "witness statements"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_10",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_hat_initials",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Found near the scene"
      },
      {
        "clue_id": "clue_manager_absence",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_footprints",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness account"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a well-respected hotel manager whose charm masks a hidden life of financial deceit. As she navigates the treacherous waters of her embezzlement, her carefully curated reputation hangs by a thread.",
    "publicPersona": "Well-respected and charming, Eleanor is known for her hospitality and keen management skills, attracting a loyal clientele.",
    "privateSecret": "Eleanor has been embezzling hotel funds to support a side business that caters to wealthy clients.",
    "motiveSeed": "inheritance",
    "motiveStrength": "moderate",
    "alibiWindow": "evening",
    "accessPlausibility": "possible",
    "stakes": "High – she stands to lose both reputation and wealth.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Eleanor speaks with a warm, inviting tone, often peppering her conversations with light-hearted quips. She has a tendency to soften her voice when discussing uncomfortable topics.",
    "signatureTic": "Oh dear, how terribly unfortunate!",
    "internalConflict": "Eleanor grapples with guilt over her dishonesty, fearing that her secrets will unravel and expose her to the very people she seeks to impress.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as it threatens not only her financial stability but also her carefully cultivated reputation in the community.",
    "paragraphs": [
      "Eleanor Voss, the esteemed manager of the seaside hotel, wore her charm like a well-tailored gown, smoothing over the rough edges of her hidden life. Known for her keen management skills and impeccable hospitality, she attracted a loyal clientele who revered her as a pillar of the community. Yet beneath the polished surface lay a web of deceit spun from desperation, as she embezzled hotel funds to support a lavish side business catering to the wealthy elite. A secret life that could shatter her carefully constructed world.",
      "As the sun dipped below the horizon, casting long shadows across the hotel lobby, Eleanor found herself entwined in an internal conflict that gnawed at her conscience. Each smile she shared with guests felt like a mask slipping further from her face, threatening to expose the truth of her financial misdeeds. The stakes were high, and she could sense the noose tightening around her neck, as if the very walls she had built to protect herself were now closing in.",
      "In her mind, Eleanor often rehearsed the conversation that would reveal her secret, a confession that would either liberate her or lead to her downfall. She envisioned the shocked faces of her loyal patrons, the whispers that would echo through the hotel halls, and the irrevocable damage to her reputation. 'Oh dear, how terribly unfortunate!' she would say, feigning lightness to mask the weight of her truths. But deep down, she knew that the truth was a beast that could not be tamed.",
      "As she navigated the evening hours, her alibi felt tenuous at best. The guests were already inebriated, their laughter echoing through the hallways, oblivious to the storm brewing within her. Eleanor's access to the hotel’s finances granted her the perfect cover, yet the very thing that had empowered her now felt like a ticking time bomb. With every passing moment, she felt the walls of her sanctuary begin to crumble, and the question loomed: would her secrets remain hidden, or would they drag her down into the depths of despair?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose dedication to her patients hides a turbulent personal life. As she faces the end of a passionate, yet secretive relationship with Eleanor, desperation clouds her judgment.",
    "publicPersona": "A dedicated doctor often consulted by the local elite, known for her intelligence and compassion.",
    "privateSecret": "Mallory has been involved in a secret relationship with Eleanor, one that Eleanor has decided to end.",
    "motiveSeed": "Desperation over losing a key personal relationship and the potential public embarrassment could drive her to murder.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in her office until 10 PM, but no one can verify the time she left.",
    "accessPlausibility": "possible",
    "stakes": "High – personal relationship with victim ties her to the crime.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with a calm, measured tone, often punctuating her sentences with dry observations. Her speech reflects her medical background, occasionally slipping into technical jargon when discussing her work.",
    "signatureTic": "Well, isn’t that just the way of things?",
    "internalConflict": "Mallory is torn between her professional composure and the emotional chaos stemming from her relationship with Eleanor, fearing the public fallout of their affair.",
    "personalStakeInCase": "The murder of Eleanor strikes Mallory deeply, as it not only threatens the love she cherished but also the potential for scandal that could ruin her career.",
    "paragraphs": [
      "Dr. Mallory Finch was a beacon of intelligence and compassion, revered by the local elite for her medical expertise. Yet beneath her composed exterior lay a tempest of emotions, fueled by a secret relationship with Eleanor Voss that had taken a dark turn. As Eleanor expressed her desire to end their affair, Mallory felt the ground beneath her shift, her heart racing with thoughts of what losing Eleanor could mean for her both personally and professionally.",
      "In the sterile confines of her office, Mallory often found solace in her work, immersing herself in the needs of her patients. But the impending loss of Eleanor clouded her judgment, infusing her days with a sense of desperation that felt foreign to her usually steady demeanor. 'Well, isn’t that just the way of things?' she would mutter to herself, an attempt to inject levity into her spiraling thoughts, though the weight of her heartache lingered like a fog.",
      "As the evening of the murder unfolded, Mallory's alibi was as fragile as the glass vials that lined her office shelves. She had claimed to be working late, but with no one to verify her whereabouts, the truth of her desperation loomed large. The thought of Eleanor’s lifeless body ignited a fierce anger within her, mingled with the fear of being implicated in a crime she didn’t commit. The stakes were high; the possibility of public embarrassment loomed like a dark cloud over her future.",
      "Confrontation was never Mallory's strong suit, yet the unraveling of her relationship with Eleanor forced her to reckon with her emotions. Would she be compelled to act upon her despair, or would she find a way to channel her pain into something more constructive? The lines between love and violence began to blur, and as the sun set on the hotel, the shadows of their past lingered, threatening to engulf her entirely."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired Navy officer, carries the weight of unfulfilled ambition and bitterness towards Eleanor. His dignified demeanor masks a simmering resentment that could lead to violent consequences.",
    "publicPersona": "Dignified and commanding, Ivor is admired for his service and leadership.",
    "privateSecret": "He resents Eleanor for not promoting him to a management position, believing his military experience deserves more recognition.",
    "motiveSeed": "Ivor is bitter over Eleanor's refusal to support his promotion at the hotel, and an argument escalated to a breaking point.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to be taking a walk along the beach around the time of the murder, but no witnesses confirm his intentions.",
    "accessPlausibility": "easy",
    "stakes": "Moderate – his frustration could lead him to act rashly.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a commanding presence, his words often laced with a sardonic edge. He has a tendency to use military jargon, especially when discussing his past experiences.",
    "signatureTic": "You know how the sea can be.",
    "internalConflict": "Ivor struggles with feelings of inadequacy and resentment, torn between his past accomplishments and present disappointments.",
    "personalStakeInCase": "The murder of Eleanor serves as a catalyst for Ivor's unresolved anger and feelings of betrayal, intertwining with his desire for recognition.",
    "paragraphs": [
      "Captain Ivor Hale, a retired Navy officer, commanded respect with his dignified demeanor and storied past. Yet, beneath the surface of his polished exterior lay a simmering resentment, particularly towards Eleanor Voss, whose refusal to promote him had ignited a fire of bitterness within him. He believed that his military experience deserved recognition, and her dismissal felt like a slap to the face, a betrayal that festered in the shadows of his mind.",
      "As the sun dipped beneath the horizon, casting a golden glow on the seaside hotel, Ivor found himself pacing the beach, wrestling with his thoughts. 'You know how the sea can be,' he would mutter to himself, a sardonic smile playing on his lips, as he recalled the many battles fought and won. Yet, unlike the sea, the battles of his current life felt far from victorious. The weight of frustration bore down on him, and the prospect of confrontation loomed like the storm clouds gathering on the horizon.",
      "The night of the murder, Ivor's alibi hung in the air like a ship lost at sea. He claimed to have taken a walk along the beach, yet no witnesses could confirm his intentions. With every step he took, his mind replayed the argument with Eleanor, the words exchanged laced with venom and despair. He could feel the pull of his emotions, threatening to tip him over the edge into a dark abyss. The stakes were moderate but rising; his frustration could easily lead to rash decisions.",
      "As Ivor faced the consequences of his actions, he found himself at a crossroads. Would he allow his bitterness to consume him, or would he rise above the petty grievances that had once defined him? The shadows of his past loomed large, and as he stood on the precipice of a decision, the question echoed in his mind: could he reclaim his dignity, or would he fall victim to the very resentment he had nurtured?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a charming socialite whose glamorous facade hides her ruthless ambition. As she navigates the treacherous waters of blackmail, her desperation could push her to commit unspeakable acts.",
    "publicPersona": "Charming and glamorous, Beatrice is always seen at the right events and known for her networking prowess.",
    "privateSecret": "She has been blackmailing Eleanor over her financial misdeeds in exchange for favors.",
    "motiveSeed": "Beatrice could lose her status and connections if Eleanor were to expose her manipulations.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be meeting new clients for her social events, but they can’t verify her time frame.",
    "accessPlausibility": "possible",
    "stakes": "High – her social standing could collapse if secrets come to light.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a refined, melodic tone, often using elaborate phrases to convey her thoughts. She has a penchant for grand gestures and dramatic pauses, embellishing her stories.",
    "signatureTic": "Oh, darling, how scandalous!",
    "internalConflict": "Beatrice grapples with the fear of losing her social status and the lengths she is willing to go to protect it.",
    "personalStakeInCase": "The murder of Eleanor could unravel Beatrice's carefully constructed social facade, jeopardizing her standing among the elite.",
    "paragraphs": [
      "Beatrice Quill, the epitome of charm and glamour, navigated the social elite with the grace of a swan gliding across a pond. Yet beneath her polished exterior lay a ruthless ambition that drove her every move. With a reputation for networking prowess, she thrived on the connections she cultivated, but her recent foray into blackmailing Eleanor Voss over financial misdeeds threatened to topple her carefully curated world. Oh, darling, how scandalous! she would exclaim, feigning innocence, while her heart raced at the thought of exposure.",
      "As the evening unfolded, Beatrice's mind swirled with thoughts of her alibi, a flimsy tale of meeting new clients that could easily unravel. The stakes were high; if Eleanor were to reveal her manipulations, Beatrice's social standing would collapse like a house of cards. She often found herself caught in a web of her own making, the threads of deceit tightening around her as she weighed her options. Her melodious voice would mask her anxiety, but inside, she felt the pressure mounting.",
      "With each passing hour, Beatrice's desperation grew. The thought of losing her status among the elite gnawed at her, pushing her to consider the unthinkable. What lengths would she go to protect her reputation? As she mingled with guests, her laughter rang hollow, a facade that could shatter at any moment. Her signature tic, a playful flourish of drama, belied the turmoil brewing beneath the surface, as she skillfully danced around the truths she feared would destroy her.",
      "As the night wore on, Beatrice grappled with her internal conflict, torn between her ambition and the moral implications of her actions. Would she be willing to cross any line to secure her place among the elite, or would the weight of her choices crush her beneath its burden? In the fading light of the seaside hotel, the shadows of her ambitions loomed large, casting doubt on the very foundation of her glamorous existence."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is an investigative journalist known for her tenacity and willingness to push boundaries. As she faces the pressure of a major story, her ethical compass wavers dangerously in the wake of Eleanor's murder.",
    "publicPersona": "Known for her tenacity and ability to dig up dirt, Sylvia is both respected and feared in social circles.",
    "privateSecret": "Sylvia has been employing unethical tactics to get ahead in her career, including sabotaging competitors.",
    "motiveSeed": "Eleanor's existence threatens Sylvia’s chance at an exclusive story that could define her career.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been interviewing hotel guests until late, but the guests were distracted.",
    "accessPlausibility": "unlikely",
    "stakes": "High – a major story is on the line, putting pressure on her journalistic ethics.",
    "humourStyle": "deadpan",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia's speech is direct and incisive, often devoid of embellishments. She has a knack for asking pointed questions and rarely shies away from confrontation.",
    "signatureTic": "What’s the real story here?",
    "internalConflict": "Sylvia wrestles with her ethical boundaries, torn between her ambition and the moral implications of her actions.",
    "personalStakeInCase": "The murder of Eleanor could jeopardize Sylvia’s career-defining story, forcing her to confront her own moral failings.",
    "paragraphs": [
      "Sylvia Trent, an investigative journalist with a reputation for tenacity, strode through the halls of the seaside hotel like a hawk on the hunt. Known for her ability to dig up dirt, she commanded both respect and fear in the social circles she navigated. Yet beneath her confident exterior lay a growing unease, as the existence of Eleanor Voss threatened to derail her chance at an exclusive story that could define her career. What's the real story here? she often pondered, her mind racing with the implications of the truth.",
      "As the evening wore on, Sylvia found herself grappling with her internal conflict. The stakes were high; a major story was on the line, but the pressure to maintain her journalistic integrity gnawed at her. She had employed unethical tactics to get ahead, including sabotaging competitors, and with Eleanor's murder, the moral implications of her actions began to weigh heavily on her conscience. Her deadpan demeanor masked the turmoil brewing within, as she sought to navigate the treacherous waters of ambition and ethics.",
      "Claims of interviewing hotel guests until late echoed in her mind, yet the distractions of the evening left her alibi hanging by a thread. The guests were more concerned with their own affairs, oblivious to the significance of her inquiries. Sylvia's direct and incisive speech often cut through the noise, yet now she found herself questioning her approach. The thought of being implicated in a murder investigation filled her with dread, forcing her to confront the shadowy corners of her ambition.",
      "With each passing moment, Sylvia felt the walls closing in, her ethical boundaries wavering dangerously. Would she be forced to confront her own moral failings in the wake of this tragedy, or would she find a way to exploit the chaos to her advantage? As the truth loomed on the horizon, the shadows of her past decisions cast a long and foreboding shadow over her future, leaving her to wonder if the price of success was worth the cost of her integrity."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a wealthy businessman whose shrewd exterior hides a history of financial fraud. As he navigates the murky waters of Eleanor's murder, his secrets threaten to unravel his empire.",
    "publicPersona": "A shrewd businessman with a keen eye for opportunity, often seen mingling with the elite.",
    "privateSecret": "Hugo has a history of financial fraud and knows Eleanor's secret, fearing her would expose him.",
    "motiveSeed": "Eleanor threatened to reveal his financial secrets, which would ruin his business and reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been in a meeting with clients, but they were merely acquaintances.",
    "accessPlausibility": "easy",
    "stakes": "Very High – his entire empire relies on secrecy.",
    "humourStyle": "blunt",
    "humourLevel": 0.2,
    "speechMannerisms": "Hugo speaks in a direct, no-nonsense manner, often cutting to the chase without unnecessary embellishments. He has a habit of using business jargon, reflecting his background.",
    "signatureTic": "Let's not beat around the bush.",
    "internalConflict": "Hugo grapples with the fear of exposure and the potential collapse of his empire, torn between maintaining his façade and the risk of losing everything.",
    "personalStakeInCase": "Eleanor's murder poses a direct threat to Hugo's empire, as her knowledge of his financial misdeeds could bring about his downfall.",
    "paragraphs": [
      "Hugo Vane, a wealthy businessman with a reputation for shrewdness, navigated the social elite with the ease of a seasoned player. Yet behind the polished veneer lay a history of financial fraud that could crumble his empire at any moment. As he mingled with the elite, the threat of exposure loomed large, particularly with Eleanor Voss holding the key to his secrets. Let's not beat around the bush, he would often say, masking his anxiety with a façade of confidence.",
      "The night of Eleanor's murder found Hugo in a precarious position, as his alibi rested on a flimsy claim of meeting clients—mere acquaintances who could not vouch for his whereabouts. The stakes were very high; his entire empire relied on secrecy, and the thought of Eleanor revealing his financial misdeeds sent a chill down his spine. The pressure mounted, forcing him to confront the very foundation of his success, built on a house of cards.",
      "As the evening unfolded, Hugo's blunt demeanor belied the chaos brewing beneath the surface. He often cut to the chase, leaving little room for pleasantries, yet the weight of his secrets pressed heavily on him. The fear of exposure gnawed at him, and he found himself grappling with the potential collapse of everything he had built. Each interaction felt like a tightrope walk, teetering between maintaining his façade and risking it all in the pursuit of power.",
      "In the aftermath of the murder, Hugo faced a crossroads that would determine his fate. Would he be able to maintain his power and cover up his deeds, or would the truth come crashing down, leaving him to reckon with the consequences of his actions? The shadows of his past loomed large, and as he contemplated his next move, the question remained: how far would he go to protect his empire from the impending storm?"
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seaside Elegance Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "An Art Deco seaside hotel, a blend of luxury and intrigue, perched on the cliffs of Brighton, overlooking the turbulent sea.",
    "visualDescription": "The hotel features sweeping ocean views framed by geometric Art Deco lines; polished brass fixtures gleam under muted lighting; plush velvet lounges invite guests to linger; expansive windows reveal crashing waves below.",
    "atmosphere": "A tense atmosphere, filled with whispers and furtive glances as guests navigate the looming threat of recent events.",
    "paragraphs": [
      "The Seaside Elegance Hotel stands defiantly against the tumultuous waves, its Art Deco façade a stark contrast to the darkening skies. Inside, the air is thick with the scent of salt and damp fabric, a reminder of the storm brewing just beyond the shoreline. Guests, once carefree, now move with a sense of caution, exchanging hushed words and furtive glances as they navigate the opulent yet claustrophobic halls. The soft crackle of the radio in the lounge fills the silence, announcing the latest news, while the distant roar of the ocean serves as a constant reminder of their isolation.",
      "As the day wanes, the hotel's atmosphere shifts, shadows lengthening across the plush carpets. The flickering gas lamps create a warm, golden glow that belies the tension simmering just beneath the surface. Guests gather in small clusters, their laughter strained, as they attempt to distract themselves from the unease that hangs in the air. Outside, the wind howls, rattling the windows and reminding them of the storm's approach. The hotel, once a sanctuary of leisure, now feels like a gilded cage, each corner hiding secrets waiting to be uncovered.",
      "In the depths of the hotel, the crime scene emerges—a secluded corner of the terrace, where the ocean’s fury meets the fragile tranquility of the evening. The rain begins to patter against the glass, echoing the unease of the guests within. As the staff flit about, their movements swift and purposeful, the tension mounts. Every whispered conversation, every glance exchanged, becomes a thread in the intricate web of mystery that envelops the Seaside Elegance Hotel, each guest a potential suspect in the unfolding drama."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with intermittent rain, typical of coastal weather patterns",
    "timeFlow": "Days of mounting tension, leading to a climactic confrontation",
    "mood": "tense and suspenseful, as guests are on edge due to recent events",
    "eraMarkers": [
      "Art Deco design elements",
      "Radio broadcasting announcements",
      "Limited access to public transportation",
      "Post-war economic recovery"
    ],
    "sensoryPalette": {
      "dominant": "The salty tang of the ocean mixed with dampness",
      "secondary": [
        "Warmth of flickering gas lamps",
        "Soft rustle of velvet upholstery"
      ]
    },
    "paragraphs": [
      "The atmosphere within the Seaside Elegance Hotel is a palpable mix of tension and anticipation, the salty air swirling with whispers of uncertainty. Overhead, the dark clouds loom, casting a shadow over the once-vibrant social gatherings that defined the hotel. Guests, dressed in their finest post-war attire, find themselves drawn together by unease rather than camaraderie, their laughter replaced by anxious murmurs as they navigate the narrow hallways, each corner holding the potential for revelation or ruin.",
      "As night falls, the moody ambiance deepens, punctuated by the rhythmic sound of rain against the windows. The flicker of gas lamps casts dancing shadows that seem to mirror the guests' own uncertainties. The scent of damp wood mingles with that of freshly brewed tea, creating a cocoon of warmth, yet the chill of the unknown seeps in, reminding everyone that even the most elegant of places can harbor darkness. Within this luxurious setting, every glance, every whisper, becomes part of a larger puzzle, each guest a piece of a mystery waiting to unfold."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "An open-air terrace overlooking the crashing waves; wrought iron railings glisten with moisture; scattered furniture suggests recent gatherings.",
      "sensoryDetails": {
        "sights": [
          "dark clouds rolling over the horizon",
          "waves crashing against the cliffside",
          "wet iron furniture glistening",
          "flickering lanterns casting shadows",
          "distant lights of the town below"
        ],
        "sounds": [
          "howling wind through the railings",
          "distant thunder rumbling",
          "waves crashing violently",
          "soft murmurs from guests below",
          "the rustle of wet leaves"
        ],
        "smells": [
          "salt of the ocean air",
          "damp earth and seaweed",
          "cold rain on stone",
          "faint scent of cigarette smoke",
          "fresh linen from the hotel"
        ],
        "tactile": [
          "chill of the ocean breeze",
          "smooth wet railing under fingertips",
          "cold damp stone underfoot",
          "rough texture of weathered wood",
          "soft fabric of an umbrella against skin"
        ]
      },
      "accessControl": "Accessible to guests during daylight hours; locked at night; staff-only access for maintenance; requires guest key for entry.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "raindrops racing down glass",
            "muddy footprints leading away",
            "soft mist rising from the ocean",
            "bare branches swaying"
          ],
          "sounds": [
            "steady patter of rain",
            "soft thud of waves hitting rocks",
            "distant calls of gulls",
            "whispers of guests from below",
            "creaking of the terrace underfoot"
          ],
          "smells": [
            "fresh rain on stone",
            "scent of wet grass",
            "damp wood",
            "mildew from the furniture",
            "cold air filling the lungs"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light over the ocean",
            "shadows creeping across the terrace",
            "silhouettes of guests against the sky",
            "glistening droplets on surfaces",
            "faded colors of the landscape"
          ],
          "sounds": [
            "the distant crash of waves",
            "the creak of the terrace underfoot",
            "muffled voices from the hotel",
            "the rustle of fabric in the wind",
            "the faint ticking of a clock"
          ],
          "smells": [
            "wet stone",
            "salt and brine",
            "cigarette smoke lingering",
            "scent of damp fabric",
            "freshly brewed coffee wafting"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset hues reflecting on the water",
            "long shadows stretching across the terrace",
            "glow of lanterns lighting the space",
            "flickering shadows against the walls",
            "stars beginning to twinkle"
          ],
          "sounds": [
            "the soft crash of waves",
            "distant laughter from the dining room",
            "the tick of a clock inside",
            "whispers of the wind",
            "the crackle of a distant radio"
          ],
          "smells": [
            "freshly cut flowers",
            "scent of warm pastries",
            "faint whiff of perfume",
            "salt air mixing with smoke",
            "cool evening breeze"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace serves as a chilling reminder of the events that have transpired. With its breathtaking views of the angry sea, the terrace was once a place of laughter and light. Now, it stands as a silent witness to the unfolding mystery. The wet iron railings glisten ominously under the dim light, while the scent of salt and dampness fills the air, a constant reminder of the storm brewing both outside and within the hotel. Guests tread cautiously, their eyes darting around as they try to piece together the fragments of the night.",
        "As the evening wears on, the terrace transforms under the flickering lanterns. Shadows dance along the walls, creating an unsettling atmosphere that heightens the tension. The sound of waves crashing against the cliff echoes a warning, while the chill of the ocean breeze sends shivers down spines. With the isolation of the hotel making outside assistance nearly impossible, the terrace becomes both a stage and a prison, where the truth waits to be uncovered amidst the whispers and secrets."
      ]
    },
    {
      "id": "lobby",
      "name": "Lobby Lounge",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Spacious area with high ceilings adorned with Art Deco chandeliers; plush seating arranged for socializing; large windows framing the ocean view.",
      "sensoryDetails": {
        "sights": [
          "art deco chandeliers casting warm light",
          "ornate patterns on the carpet",
          "guests in elegant attire",
          "vintage radios on side tables",
          "ocean view through large windows"
        ],
        "sounds": [
          "soft chatter of guests",
          "clinking of glasses",
          "the rustling of newspapers",
          "gentle music from a gramophone",
          "the creak of wooden floors"
        ],
        "smells": [
          "freshly brewed coffee",
          "scent of polished wood",
          "hint of tobacco smoke",
          "fragrant flowers in vases",
          "warmth of baked goods"
        ],
        "tactile": [
          "soft fabric of armchairs",
          "cool marble of the reception desk",
          "smoothness of polished wood",
          "warmth of a cozy blanket",
          "crispness of a newspaper"
        ]
      },
      "accessControl": "Open to all guests; monitored by staff; accessible at all hours; often crowded during social events.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "guests with umbrellas",
            "drops sliding down windows",
            "wet shoes on the floor",
            "newspapers drying on tables"
          ],
          "sounds": [
            "soft pitter-patter of rain",
            "muffled conversations",
            "the hum of the heating system",
            "occasional laughter from nearby tables",
            "the rustle of wet coats"
          ],
          "smells": [
            "earthy scent of rain",
            "freshly baked croissants",
            "the aroma of strong tea",
            "scent of damp wool",
            "notes of citrus from breakfast"
          ],
          "mood": "cozy warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows stretching across the floor",
            "guests sipping tea in clusters",
            "grey light dimming the ambiance",
            "glossy magazines on tables",
            "staff moving discreetly"
          ],
          "sounds": [
            "murmurs of conversation",
            "clinking of china",
            "the rustle of fabric",
            "the faint crackle of a radio",
            "soft footsteps across the carpet"
          ],
          "smells": [
            "scent of fresh pastries",
            "blended aroma of coffee and tea",
            "hint of floral arrangements",
            "subtle waft of cleaning supplies",
            "freshly polished wood"
          ],
          "mood": "sombre reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of lamps illuminating faces",
            "elegant dresses and suits",
            "the sun setting outside",
            "glasses raised in toasts",
            "smiling faces in conversation"
          ],
          "sounds": [
            "laughter ringing through the air",
            "soft music playing",
            "the clinking of glasses",
            "the murmur of many conversations",
            "the rustle of evening gowns"
          ],
          "smells": [
            "scent of rich wines",
            "freshly cut flowers",
            "the warmth of baked bread",
            "notes of perfume and cologne",
            "the aroma of hearty meals"
          ],
          "mood": "festive camaraderie"
        }
      ],
      "paragraphs": [
        "The Lobby Lounge of the Seaside Elegance Hotel serves as a microcosm of the social dynamics at play. With its high ceilings and elegant decor, it invites guests to unwind, yet a sense of unease permeates the air. The soft chatter and the clinking of glasses create an illusion of normalcy, masking the tension brewing beneath the surface. Guests, dressed in their finest, gather around the plush seating, but their conversations are laced with caution, each word weighed against the backdrop of recent events.",
        "As the day shifts into evening, the atmosphere in the lobby transforms. The warm glow of the chandeliers casts a welcoming light, but the laughter feels forced, and the smiles are tinged with anxiety. The scent of freshly baked goods mingles with the faint aroma of tobacco, drawing guests together even as their thoughts linger on the unsettling occurrences. The Lobby Lounge becomes a stage where secrets are shared and hidden, as the mystery unfolds in the shadows of the elegant space."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Grand Dining Room",
      "type": "interior",
      "purpose": "Social gatherings and meals",
      "visualDetails": "Opulent dining space with long tables set for formal meals; large windows offering sweeping ocean views; ornate chandeliers hanging from the ceiling.",
      "sensoryDetails": {
        "sights": [
          "shimmering crystal glassware",
          "glowing candles flickering",
          "staff in formal uniforms",
          "a grand piano in the corner"
        ],
        "sounds": [
          "clattering of cutlery",
          "soft music from the piano",
          "laughter echoing off the walls",
          "murmurs of conversation",
          "the rustle of tablecloths"
        ],
        "smells": [
          "aroma of roasted meats",
          "scent of fresh herbs",
          "hint of wine and cheese",
          "fragrant flowers on the tables",
          "warmth of baked bread"
        ],
        "tactile": [
          "smoothness of polished silverware",
          "softness of linen napkins",
          "coolness of crystal glassware",
          "weight of heavy plates",
          "texture of fine tablecloths"
        ]
      },
      "accessControl": "Open to all guests during meal times; reservations recommended; staff-only access for kitchen and service areas; closed after dinner.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft light filtering through rain",
            "staff moving about with trays",
            "guests peering out at the weather",
            "the glimmer of raindrops on windows"
          ],
          "sounds": [
            "soft clinking of breakfast dishes",
            "the hum of conversation",
            "occasional laughter",
            "the distant sound of rain on the roof",
            "the rustle of newspapers"
          ],
          "smells": [
            "scent of brewing coffee",
            "warmth of freshly baked pastries",
            "aroma of sizzling bacon",
            "fresh fruit laid out",
            "the tang of orange juice"
          ],
          "mood": "inviting comfort"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light dimming the room",
            "guests sipping coffee at tables",
            "staff clearing dishes",
            "windows fogged by humidity",
            "glossy menus on tables"
          ],
          "sounds": [
            "soft murmurs of conversation",
            "the clink of cups",
            "the rustle of tablecloths",
            "the faint sound of rain outside",
            "the ticking of a clock"
          ],
          "smells": [
            "scent of rich chocolate cake",
            "the aroma of brewed tea",
            "freshly baked bread",
            "hint of citrus from desserts",
            "subtle scent of cleaning supplies"
          ],
          "mood": "sombre reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of candles illuminating tables",
            "guests in formal attire",
            "the sun setting outside",
            "the reflection of lights on glassware",
            "staff moving gracefully"
          ],
          "sounds": [
            "laughter filling the air",
            "the soft notes of a piano",
            "clinking of glasses in toasts",
            "the hum of conversation",
            "the rustle of evening gowns"
          ],
          "smells": [
            "aroma of gourmet dishes",
            "scent of fine wine",
            "freshly baked rolls",
            "the fragrance of flowers",
            "warmth of spices in the air"
          ],
          "mood": "elegant celebration"
        }
      ],
      "paragraphs": [
        "The Grand Dining Room is the heart of the Seaside Elegance Hotel, where guests gather to indulge in culinary delights. Its opulent decor, complete with shimmering chandeliers and elegantly set tables, invites a sense of grandeur. Yet, beneath the surface, a current of tension flows as hushed conversations and furtive glances betray the unease among diners. The clattering of cutlery and the soft music from the piano create an atmosphere of refinement, but the shadows of recent events linger in the air, adding an edge to the evening's festivities.",
        "As the day transitions into evening, the dining room transforms into a realm of elegance. The flickering candlelight casts soft shadows, while the scent of gourmet dishes fills the space. Laughter mingles with the sound of clinking glasses in toasts, yet the mood is tinged with apprehension. Each guest's smile holds a secret, their eyes revealing more than they intend. In this grand setting, the stage is set for both celebration and revelation, as the mystery surrounding the Seaside Elegance Hotel unfolds amidst the clinking of glasses and the rustling of fine linens."
      ]
    },
    {
      "id": "beach_access",
      "name": "Secluded Beach Access",
      "type": "exterior",
      "purpose": "Private entry to the beach",
      "visualDetails": "Narrow, winding path leading from the hotel to the beach; rocky cliffs on either side; overgrown vegetation obscures the entrance.",
      "sensoryDetails": {
        "sights": [
          "narrow path winding through cliffs",
          "tangled roots and vines",
          "the ocean crashing below",
          "seagulls diving overhead",
          "hidden nooks along the path"
        ],
        "sounds": [
          "waves crashing on the shore",
          "rustling leaves in the wind",
          "calls of seagulls overhead",
          "the creak of wooden steps",
          "distant laughter from beachgoers"
        ],
        "smells": [
          "scent of damp earth",
          "briny ocean air",
          "fresh greenery",
          "the lingering scent of sunscreen",
          "faint whiff of fish"
        ],
        "tactile": [
          "rough texture of the path",
          "smooth pebbles underfoot",
          "cool mist from the ocean",
          "softness of moss along the edge",
          "the chill of the wind"
        ]
      },
      "accessControl": "Requires a key for entry; monitored by staff; closed during storms; not accessible to all guests.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "mist rising from the wet ground",
            "raindrops on leaves",
            "clouds hanging low",
            "dark rocks glistening",
            "waves crashing with force"
          ],
          "sounds": [
            "heavy rain pattering on leaves",
            "the roar of waves",
            "distant thunder rumbling",
            "soft squelch of mud underfoot",
            "the rustle of wet foliage"
          ],
          "smells": [
            "earthy scent of wet soil",
            "fresh rain on grass",
            "the saltiness of the sea",
            "scent of wet stones",
            "the tang of seaweed"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey skies above",
            "waves crashing against rocks",
            "scattered shells on the sand",
            "gulls circling overhead",
            "cliffs looming in the background"
          ],
          "sounds": [
            "constant crash of waves",
            "wind howling through the cliffs",
            "the faint sound of laughter",
            "the rustle of sand being blown",
            "distant calls of seabirds"
          ],
          "smells": [
            "scent of damp seaweed",
            "briny air mixed with rain",
            "freshness of the ocean",
            "the scent of wet sand",
            "the lingering aroma of fish"
          ],
          "mood": "eerie isolation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light reflecting off the water",
            "silhouetted cliffs against the sunset",
            "waves lapping gently at the shore",
            "seagulls flying low",
            "the path glowing in twilight"
          ],
          "sounds": [
            "gentle lapping of waves",
            "distant voices from the beach",
            "the wind whispering through grass",
            "the soft crunch of sand underfoot",
            "the rustle of evening breezes"
          ],
          "smells": [
            "warmth of the setting sun",
            "scent of salt in the air",
            "freshness of night-blooming flowers",
            "the lingering aroma of grilled food",
            "the coolness of evening dew"
          ],
          "mood": "serene yet unsettling"
        }
      ],
      "paragraphs": [
        "The Secluded Beach Access provides a narrow path to the ocean, shrouded in the dense foliage of the cliffs. This hidden entrance, known only to a few, leads to a rugged stretch of sand where the waves crash violently against the rocks. The scent of brine and damp earth fills the air, while the sound of crashing waves drowns out any whispers of conversation. Here, the isolation is palpable; a perfect setting for secrets to unfold or for someone to disappear without a trace.",
        "As the evening approaches, the path takes on an otherworldly quality. The golden light of the setting sun illuminates the cliffs, while the sounds of the ocean create a soothing rhythm. Yet, beneath this serene surface lies a tension, as the secluded nature of the beach allows for hidden encounters and clandestine meetings. The air is thick with anticipation, as the waves crash and recede, mirroring the ebb and flow of the mysteries that linger just out of sight."
      ]
    }
  ],
  "note": "",
  "cost": 0.00293535165,
  "durationMs": 44272
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1949,
    "month": "January",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "cool temperatures around 40°F"
    ],
    "daylight": "Short days with twilight settling around 4:30 PM, leaving a lingering chill in the air as darkness envelops the streets early.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel guests gather in the lounge.",
    "holidays": [
      "New Year's Day"
    ],
    "seasonalActivities": [
      "indoor games and card tournaments",
      "visits to local theaters for winter performances",
      "enjoying hot drinks by the fireplace"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "dark wool suit with narrow lapels",
        "crisp white dress shirt",
        "silk tie in muted colors"
      ],
      "casual": [
        "tweed jacket",
        "flannel trousers",
        "corduroy cap"
      ],
      "accessories": [
        "leather gloves",
        "classic fedora",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "vintage tea-length dress with a fitted bodice",
        "silk scarf tied at the neck",
        "peacoat for warmth"
      ],
      "casual": [
        "tweed skirt with a knitted sweater",
        "woolen cardigan",
        "ankle boots"
      ],
      "accessories": [
        "faux fur stole",
        "beret",
        "string of pearls"
      ]
    },
    "trendsOfTheMoment": [
      "tailored silhouettes for both men and women",
      "emphasis on practicality and warmth",
      "use of bold colors in evening wear"
    ],
    "socialExpectations": [
      "men are expected to wear suits in public",
      "women are encouraged to dress elegantly even for casual outings",
      "social gatherings revolve around formal etiquette"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The establishment of NATO in April 1949",
      "The beginning of the Cold War tensions in Europe",
      "The ongoing discussions in the United Nations regarding the Korean Peninsula"
    ],
    "politicalClimate": "A divided Europe with increasing tensions between the Western powers and the Soviet Union, leading to a palpable sense of unease among citizens.",
    "economicConditions": "Post-war recovery is underway, but rationing continues for many goods, with inflation creeping into everyday life.",
    "socialIssues": [
      "increased job opportunities for women",
      "racial segregation debates in the U.S.",
      "rising tensions in Eastern Europe affecting global stability"
    ],
    "internationalNews": [
      "The partition of India and Pakistan leading to humanitarian crises",
      "The establishment of Israel in the coming months causing geopolitical shifts",
      "Political unrest in Greece affecting British and American interests"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Frank Sinatra's big band hits",
        "The Andrews Sisters' harmonies"
      ],
      "films": [
        "'The Third Man'",
        "'All the King's Men'",
        "'The Heiress'"
      ],
      "theater": [
        "'Death of a Salesman'",
        "'A Streetcar Named Desire'"
      ],
      "radio": [
        "'The Shadow'",
        "'Suspense'",
        "'Fibber McGee and Molly'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'1984' by George Orwell",
        "'The Naked and the Dead' by Norman Mailer",
        "'The Catcher in the Rye' by J.D. Salinger"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "literary fiction",
        "social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "early computers for military use",
        "the first commercial jet airliner prototypes"
      ],
      "commonDevices": [
        "radio receivers in most homes",
        "early television sets becoming more popular",
        "household appliances like electric refrigerators"
      ],
      "emergingTrends": [
        "the rise of television as a new medium",
        "increasingly sophisticated forensic techniques",
        "the beginning of the space race with early rocket technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "attending social clubs and dances",
        "participating in community events",
        "visiting local cafes for social gatherings"
      ],
      "socialRituals": [
        "afternoon tea with friends",
        "formal dinner parties",
        "weekly church services"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Upper classes remain detached from the struggles of the working class",
      "Middle class values of propriety and hard work are emphasized"
    ],
    "gender": [
      "Women are increasingly seen in roles traditionally held by men",
      "Expectations for women to maintain domestic roles while working"
    ],
    "race": [
      "Continued segregation in many areas, particularly in the U.S.",
      "Emerging awareness of civil rights issues"
    ],
    "generalNorms": [
      "Politeness and decorum are highly valued",
      "Social status often defined by occupation and wealth",
      "Community involvement is encouraged and seen as a civic duty"
    ]
  },
  "atmosphericDetails": [
    "The sound of rain gently tapping against the hotel windows, creating a rhythmic backdrop to whispered conversations.",
    "The faint aroma of wet wool and tobacco smoke lingers in the air, a reminder of the damp coastal weather.",
    "A low murmur of tension fills the lounge, where guests eye each other warily, their faces illuminated by the flickering glow of the fireplace."
  ],
  "paragraphs": [
    "In January 1949, the coastal town is shrouded in a damp chill, with overcast skies and intermittent rain casting a shadow over the hotel’s guests. The early twilight hours bring about an unsettling atmosphere; it’s a time when secrets seem to linger in the air as the smell of wet wool mixes with the warmth of the flickering fireplace inside. Guests gather in the lounge, each one casting furtive glances, their faces cloaked in apprehension after a series of unsettling events that have occurred in recent weeks.",
    "Fashion reflects the era's transitional nature, with men seen in tailored wool suits, their narrow lapels and muted silk ties a testament to post-war austerity. Women adorn themselves in vintage tea-length dresses, complete with fitted bodices and elegant peacoats, while faux fur stoles add an air of sophistication. This attention to appearance is a social expectation, as propriety and elegance are as important as ever in a society recovering from the turmoil of war.",
    "Daily life is infused with an undercurrent of tension, as the remnants of World War II still echo in the collective consciousness. Prices for basic goods are rising, yet social gatherings continue, with afternoon teas and formal dinner parties serving as excuses to maintain connections amid uncertainty. The introduction of new technologies, such as the transistor radio, stirs intrigue and conversation, while the lingering impact of the conflict shapes attitudes toward race and gender, with women increasingly stepping into roles that challenge traditional norms."
  ],
  "note": "",
  "cost": 0.0010511423999999998,
  "durationMs": 18153
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A seaside hotel hosts a gathering of guests during a storm, where the pressures of post-war recovery and shifting gender roles create a tense atmosphere, complicating trust and identity.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is increasingly inclusive of women, reflecting a societal shift, while class tensions simmer as economic recovery from WWII influences social dynamics."
  },
  "setting": {
    "location": "A coastal hotel on a cliff overlooking the ocean",
    "institution": "hotel",
    "weather": "overcast with intermittent rain"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an impersonation method, where a masquerade of double identity — a disguise exploited to seem to be in two places — breaks the assumed alibi."
}

### LOCKED_FACTS
[
  {
    "id": "witness_time",
    "value": "ten minutes past eleven",
    "description": "The time the witness claims they saw the suspect leaving."
  },
  {
    "id": "mirror_angle",
    "value": "thirty degrees",
    "description": "The angle at which the reflection created the illusion of two people."
  },
  {
    "id": "hat_initials",
    "value": "K.T.",
    "description": "The initials found on the hat that led to the identity confusion."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 18,
  "countsByPlacement": {
    "early": 7,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
    "optional": 1
  },
  "redHerringCount": 2,
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
      "category": "spatial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
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
      "category": "testimonial"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_10",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_11",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_manager_absence",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_footprints",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_hat_initials",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
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
