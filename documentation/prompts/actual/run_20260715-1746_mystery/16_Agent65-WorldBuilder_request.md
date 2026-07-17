# Actual Prompt Record

- Run ID: `mystery-1784137570721`
- Project ID: ``
- Timestamp: `2026-07-15T17:52:57.133Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `e788cd0334f22874`

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
    "title": "Tidal Timing Trap",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A grand seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "drowning"
    }
  },
  "death_method": "drowned in the ocean",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charming heiress",
      "private_secret": "Involved in a secret affair",
      "motive_seed": "Jealousy over a romantic rivalry",
      "motive_strength": "low",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Ocean access from hotel"
      ],
      "behavioral_tells": [],
      "stakes": "Personal honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Doctor",
      "relationships": [
        "Friend of Eleanor"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Possesses a love letter from Eleanor",
      "motive_seed": "Unrequited love",
      "motive_strength": "moderate",
      "alibi_window": "From 8 to 9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to medical supplies"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Military officer",
      "relationships": [
        "Acquaintance of Eleanor"
      ],
      "public_persona": "Heroic war veteran",
      "private_secret": "Discharged under mysterious circumstances",
      "motive_seed": "Protecting a secret",
      "motive_strength": "low",
      "alibi_window": "Witnessed at the bar",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Ocean access"
      ],
      "behavioral_tells": [],
      "stakes": "Honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Socialite",
      "relationships": [
        "Rival of Eleanor"
      ],
      "public_persona": "Wealthy and glamorous",
      "private_secret": "Harbored resentment towards Eleanor",
      "motive_seed": "Jealousy",
      "motive_strength": "high",
      "alibi_window": "From 8 to 9 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the beach"
      ],
      "behavioral_tells": [],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Hotel staff",
      "relationships": [
        "Friend of Eleanor"
      ],
      "public_persona": "Helpful concierge",
      "private_secret": "Knows about the affair",
      "motive_seed": "Concern for Eleanor's wellbeing",
      "motive_strength": "low",
      "alibi_window": "From 8 to 9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all areas of the hotel"
      ],
      "behavioral_tells": [],
      "stakes": "Employment",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [
        "Investigator of the case"
      ],
      "public_persona": "Diligent investigator",
      "private_secret": "Has a personal stake in solving the case",
      "motive_seed": "Desire for justice",
      "motive_strength": "moderate",
      "alibi_window": "Present at the hotel",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the investigation"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation",
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
      "summary": "In the grand seaside hotel, Eleanor Voss's tragic drowning is shrouded in mystery, as tides and timing conspire to mislead the investigation. Detective Hugo Vane must untangle the web of jealousy and hidden motives before the truth is lost to the waves."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The victim was drowned at low tide, but evidence was manipulated to make it appear she drowned at high tide.",
      "delivery_path": [
        {
          "step": "The body was positioned in the water to mislead investigators."
        },
        {
          "step": "Tide marks were artificially altered to suggest a longer time in the water."
        }
      ]
    },
    "outcome": {
      "result": "The true time of drowning is uncovered, leading to Beatrice Quill's arrest."
    }
  },
  "false_assumption": {
    "statement": "The drowning occurred at high tide, as indicated by the water's reach.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses observed the tide's position and assumed it was the time of death.",
    "what_it_hides": "The victim actually drowned at low tide, with the body positioned to create a false narrative."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch was the last person seen speaking to Eleanor before her disappearance.",
      "He had access to medication that could have incapacitated her."
    ],
    "the_one_flaw": "Dr. Finch's alibi is confirmed by multiple witnesses who saw him attending to a patient during the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A loud argument between Eleanor and Beatrice was heard just before the drowning.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "They were arguing over a trivial matter, which had no bearing on Eleanor's death.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Footprints leading away from the water suggest a struggle.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The footprints were from hotel staff preparing for the evening event, not related to the incident.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "rationale": "All suspects are guests or staff at the hotel, with no outsiders involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Tide charts indicate low tide at the time of drowning",
        "Witness statements about the tide's position"
      ],
      "windows": [
        "Witness accounts claim Eleanor was last seen at 8:30 PM"
      ],
      "contradictions": [
        "The body was found at a different location than where Eleanor was last seen"
      ]
    },
    "access": {
      "actors": [
        "Beatrice Quill",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Hotel balcony",
        "Beach access"
      ],
      "permissions": [
        "Staff access to all areas"
      ]
    },
    "physical": {
      "laws": [
        "Ocean currents affect body positioning"
      ],
      "traces": [
        "Footprints leading away from the beach"
      ]
    },
    "social": {
      "trust_channels": [
        "Guest relations",
        "Friendships"
      ],
      "authority_sources": [
        "Hotel management"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Tide charts displayed in the hotel lobby indicate low tide occurred at 9 PM.",
        "correction": "The victim must have drowned at low tide, contradicting the initial belief of drowning at high tide.",
        "effect": "Narrows the time window for the drowning, eliminating the possibility of high tide drowning.",
        "required_evidence": [
          "Tide charts in the lobby",
          "Witness statements about Eleanor's last sighting"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall seeing Eleanor at 8:30 PM, just before the tide was low.",
        "correction": "This confirms that the victim was still alive when the tide was falling, supporting the low tide theory.",
        "effect": "Eliminates the idea that Eleanor drowned shortly before she was last seen.",
        "required_evidence": [
          "Witness statements confirming Eleanor's presence at 8:30 PM",
          "Previous alibi statements from Dr. Finch"
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints leading away from the water match Beatrice Quill's shoe size.",
        "correction": "This suggests Beatrice was near the scene shortly before the drowning incident.",
        "effect": "Narrows suspicion towards Beatrice as a possible culprit.",
        "required_evidence": [
          "Footprint measurements taken by the detective",
          "Witness statements about Beatrice's whereabouts"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares drown, chart, and display against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are confirm, chart, and display.",
    "pass_condition": "If the evidence from the reenactment does not match the initial assumptions about high tide drowning, it confirms Beatrice's guilt.",
    "evidence_clues": [
      "clue_4",
      "clue_11",
      "clue_culprit_direct_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The tide charts (early) and witness statements (mid) clarify the drowning timing. Step 2: Witness accounts about Eleanor's last sighting (mid) eliminate high tide drowning. Step 3: Footprint evidence (discriminating test) identifies Beatrice as the likely culprit."
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
        "Observe the tide's behavior during the reenactment",
        "Draw conclusion about Beatrice's guilt"
      ],
      "test_type": "temporal"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm his alibi.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Footprint analysis shows no match.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: None",
        "supporting_clues": []
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: From 8 to 9 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence gathered."
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
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_discriminating_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Controlled reenactment evidence"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_5",
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
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
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
    "summary": "Eleanor Voss, a socialite caught in a web of financial despair, struggles to maintain her elegant façade amid mounting debts.",
    "publicPersona": "Eleanor is the epitome of grace and sophistication, gliding through galas and charity events as if she were born to the ballroom. Her laughter rings like delicate chimes, a sound that masks the turmoil beneath her polished exterior.",
    "privateSecret": "Behind her radiant smile lies a secret that gnaws at her soul: she is heavily in debt, relying on her social connections to secure a future that seems increasingly precarious.",
    "motiveSeed": "Desperate to preserve her social standing, Eleanor's financial woes drive her to act in ways that could jeopardize her carefully curated image.",
    "motiveStrength": "moderate",
    "alibiWindow": "Eleanor claims to have been in the dining room from eight until the murder was discovered, her presence noted by many at the gathering.",
    "accessPlausibility": "possible",
    "stakes": "Her reputation and financial stability hang in the balance, pushing her toward choices that may compromise her integrity.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Eleanor speaks with a soft, melodic cadence, often punctuating her sentences with thoughtful pauses. She tends to downplay her circumstances, using light-hearted remarks to deflect probing questions.",
    "signatureTic": "Oh, darling, it's merely a trifling matter!",
    "internalConflict": "Eleanor grapples with a profound fear of losing everything she has worked for, torn between the desire for authenticity and the need to maintain her social façade.",
    "personalStakeInCase": "This crime threatens not only her reputation but also her last chance to secure financial stability through her social connections, making it a matter of survival.",
    "paragraphs": [
      "Eleanor Voss glides through the grand ballroom of the seaside hotel, her gown trailing behind her like the silken waves of the ocean. With a smile that could charm the most hardened of hearts, she exchanges pleasantries with guests, each laugh carefully curated to mask the chaos brewing beneath her poised exterior. Yet, as the evening wears on, the weight of her financial burdens threatens to crush her spirit, and the elegant socialite feels the ground beneath her feet becoming less stable.",
      "In the hushed whispers of the hotel corridors, Eleanor's name is often spoken with reverence, yet she knows that her reputation is built on a precarious foundation. The mounting debts that haunt her are a constant reminder of her fragility, a fear that claws at her insides. The charity events she organizes are less about altruism and more about maintaining an image—one she is terrified of losing. With each gala she attends, she clings to the hope that someone will come to her rescue, that her connections will pull her from the abyss.",
      "Eleanor's thoughts drift to the victim, a woman whose rise in the social hierarchy only exacerbates her own insecurities. With a sigh, she recalls the moments they shared, laughter echoing in the air, but beneath it all was a simmering envy that threatened to bubble over. The thought of being overshadowed by someone so effortlessly successful fills her with dread. The stakes are high, and she knows that the game of social climbing comes with its own set of dangers.",
      "As the night unfolds and the atmosphere thickens with tension, Eleanor finds herself at a crossroads. The murder of her rival shakes her to the core, forcing her to confront not only her fears but also the lengths she might go to protect the life she has built. In the end, it is not just her reputation at stake; it is her very identity, and the choice looms before her like a dark wave ready to crash."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, grapples with her ambitions and the dark paths she has taken to secure her place in the medical community.",
    "publicPersona": "Known for her sharp intellect and unwavering dedication to her patients, Dr. Finch commands respect in the hospital corridors. Her crisp white coat and confident demeanor project an image of competence and authority.",
    "privateSecret": "Behind her professional façade, Mallory engages in underhanded tactics to eliminate her competition, a secret that could unravel her hard-earned reputation.",
    "motiveSeed": "Feeling increasingly threatened by Eleanor's rising influence in the hospital, Mallory's ambition drives her to desperate measures.",
    "motiveStrength": "strong",
    "alibiWindow": "Mallory claims to have attended a medical conference but returned in the evening, leaving a window of opportunity for suspicion.",
    "accessPlausibility": "possible",
    "stakes": "Her professional reputation and aspirations for advancement hang precariously in the balance, pushing her to the edge.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with an authoritative tone, often peppering her conversation with medical jargon. Her sentences are concise, and she rarely indulges in small talk, preferring to get straight to the point.",
    "signatureTic": "You must understand, it's a matter of life and death.",
    "internalConflict": "Mallory wrestles with the ethical implications of her actions, torn between her ambition and the moral compromises she has made along the way.",
    "personalStakeInCase": "The murder of Eleanor threatens not only her career but also the very foundation of her professional integrity, forcing her to confront the cost of her ambition.",
    "paragraphs": [
      "Dr. Mallory Finch strides through the bustling hospital, her mind a whirlwind of thoughts as she navigates the delicate balance between ambition and morality. The respect she has garnered among her peers is hard-earned, but beneath the surface lies a simmering resentment towards those who threaten her ascent. The recent rise of Eleanor Voss in the hospital's social scene has only fueled her envy, and as the stakes grow higher, so too does her desperation.",
      "In hushed tones, Mallory recalls the countless hours spent sabotaging her colleagues, each act cloaked in the guise of professional rivalry. The whispers of her unethical practices echo in her mind, a constant reminder of the lengths she has gone to secure her position. She brushes off the guilt like dust from her coat, convincing herself that the end justifies the means. Yet, with every passing day, the weight of her choices grows heavier, threatening to crush her under their burden.",
      "As the news of Eleanor's murder ripples through the hospital, Mallory's heart races. The very woman she envied is gone, and with her, the chance to confront the shadow that loomed over her career. The fear of exposure grips her; the thought of her secrets coming to light sends chills down her spine. She knows that the investigation could unravel everything she has built, and the stakes have never been higher.",
      "In the depths of her mind, Mallory grapples with the true cost of her ambition. The path she has chosen is fraught with peril, and as she stands on the precipice of discovery, she must decide whether to continue down this dark road or seek redemption before it's too late."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, battles resentment and regret as he navigates the fallout from his past and the murder that threatens to unravel his dignity.",
    "publicPersona": "Ivor presents himself as the quintessential gruff gentleman, a man of honor and service who commands respect with his military bearing. His tales of bravery and sacrifice are met with admiration.",
    "privateSecret": "Deep within, Ivor blames Eleanor for the downfall of his military career, a grudge that festers and clouds his judgment.",
    "motiveSeed": "His envy of Eleanor's wealth and perceived slights against him fuel his resentment, turning him into a man on the edge.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor claims to have been on the beach at the time of the murder, but his solitary alibi lacks corroboration.",
    "accessPlausibility": "easy",
    "stakes": "His dignity and the chance to reclaim his honor are on the line, pushing him to confront the past he cannot escape.",
    "humourStyle": "blunt",
    "humourLevel": 0.2,
    "speechMannerisms": "Ivor's speech is direct and to the point, often laced with a hint of bitterness. He avoids flowery language, preferring to speak plainly and with conviction.",
    "signatureTic": "I've seen worse in the trenches.",
    "internalConflict": "Ivor is torn between his desire for revenge and the understanding that holding onto his grudges only drags him down further into darkness.",
    "personalStakeInCase": "The murder of Eleanor is not just a crime; it is a blow to his already tarnished honor, forcing him to confront the demons of his past.",
    "paragraphs": [
      "Captain Ivor Hale stands at the edge of the beach, the sea breeze tousling his graying hair as he gazes out at the horizon. The waves crash against the shore, a constant reminder of the battles he fought long ago. Yet, unlike the ocean, which ebbs and flows, Ivor's resentment towards Eleanor Voss remains a steady tide, threatening to pull him under. He recalls the moments when he felt her influence seep into his life, a woman whose wealth and connections overshadowed his own achievements.",
      "The memories of his military career, once filled with honor, now feel like a distant echo. Ivor's thoughts drift back to the day he felt betrayed by the very system he had dedicated his life to. Eleanor's rise in society, coupled with her dismissive attitude, stoked the flames of his bitterness. He had fought for his country, yet here he was, outshone by a woman who seemed to glide through life with ease. The injustice gnaws at him, a festering wound that refuses to heal.",
      "When the news of Eleanor's murder reaches his ears, Ivor's heart races with a mix of shock and grim satisfaction. Finally, the woman he blamed for his downfall is gone, yet a part of him feels hollow. The stakes are high; the investigation into her death could expose the grudges he harbors, and the very honor he seeks to reclaim may be forever tarnished by suspicion.",
      "In the depths of his heart, Ivor knows that clinging to his resentment will only drag him further into the abyss. He stands at a crossroads, torn between the desire for vengeance and the yearning to let go of the past. The waves continue their relentless assault on the shore, and he must decide whether to rise above the tide or succumb to its pull."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious journalist, finds herself entangled in a web of ambition and scandal as she pursues the truth behind the murder.",
    "publicPersona": "A rising star in the world of journalism, Beatrice is known for her sharp wit and relentless pursuit of the truth. Her articles are laced with insight and a touch of humor that captivates her readers.",
    "privateSecret": "Beneath her confident exterior lies a dark obsession: she has been stalking Eleanor in hopes of uncovering a scandal that would propel her career.",
    "motiveSeed": "Driven by the desire to expose a juicy story, Beatrice's ambition blinds her to the moral implications of her actions.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims to have been at the bar interviewing guests at the time of the murder, but her presence is unverified.",
    "accessPlausibility": "possible",
    "stakes": "Her career and credibility in journalism hang in the balance, with the potential fallout from the murder threatening to unravel everything she has worked for.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice's speech is lively and animated, often punctuated with clever quips. She has a knack for turning mundane observations into biting commentary, capturing the attention of those around her.",
    "signatureTic": "Truth is stranger than fiction, darling.",
    "internalConflict": "Beatrice grapples with the realization that her ambition may come at the cost of her integrity, forcing her to confront the consequences of her relentless pursuit of success.",
    "personalStakeInCase": "The murder of Eleanor presents a pivotal moment in Beatrice's career, challenging her to choose between ruthless ambition and a deeper understanding of truth.",
    "paragraphs": [
      "Beatrice Quill leans against the bar, her notepad poised and ready as she surveys the room with keen eyes. The grand seaside hotel is alive with chatter, laughter, and the clinking of glasses, but her focus is singular: the story that could catapult her career to new heights. With a sardonic smile, she jots down notes, her mind racing with possibilities. Eleanor Voss, the socialite whose life seemed so perfect, is the perfect subject for her next piece—a scandal waiting to be unearthed.",
      "As Beatrice navigates the crowd, she recalls the countless hours spent trailing Eleanor, capturing snippets of her life in the hopes of revealing a hidden truth. The thrill of the chase invigorates her, yet a nagging doubt lingers in her mind. Has her ambition blinded her to the ethical lines she is crossing? The stakes are high, and the desire for a headline-grabbing story drowns out her conscience.",
      "When the news of Eleanor's murder breaks, Beatrice's heart races—not with grief, but with exhilaration. The very scandal she sought has materialized in the most shocking way. As whispers of suspicion swirl around her, she must tread carefully. The investigation could either elevate her status as a journalist or destroy her credibility forever. The thought of being implicated sends a shiver down her spine, igniting a fierce determination to uncover the truth.",
      "In the days that follow, Beatrice grapples with the duality of her ambition. The murder case forces her to confront the consequences of her relentless pursuit of success. As she digs deeper, she begins to question whether the truths she seeks are worth the cost of her integrity. The lines between ambition and morality blur, and Beatrice must decide whether to continue her quest for glory or embrace a deeper understanding of the human experience."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, the dedicated hotel manager, struggles with feelings of inadequacy as she navigates the pressures of her position and the shadow of Eleanor's influence.",
    "publicPersona": "Sylvia is the heart and soul of the hotel, adored by the staff and guests alike for her unwavering commitment and hard work. Her warm smile and approachable demeanor make her a beloved figure.",
    "privateSecret": "Beneath her cheerful exterior, Sylvia feels overshadowed by Eleanor's control over hotel operations, a secret that festers and fuels her resentment.",
    "motiveSeed": "Her growing frustration with Eleanor's influence drives Sylvia to contemplate actions she would never have imagined.",
    "motiveStrength": "moderate",
    "alibiWindow": "Sylvia claims to have been in her office during the time of the murder but cannot provide solid proof.",
    "accessPlausibility": "easy",
    "stakes": "Her authority and the respect of her team are on the line, making her question her own worth.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with a warm and inviting tone, often punctuating her sentences with self-deprecating humor. She tends to laugh at herself and use light-hearted anecdotes to connect with others.",
    "signatureTic": "Oh, I’m just the manager—what do I know?",
    "internalConflict": "Sylvia wrestles with feelings of inadequacy and the desire to assert herself, torn between her duty to the hotel and her growing resentment towards Eleanor.",
    "personalStakeInCase": "The murder of Eleanor forces Sylvia to confront her own insecurities and the dynamics of power within the hotel, challenging her to reclaim her authority.",
    "paragraphs": [
      "Sylvia Trent moves through the bustling hotel lobby, a warm smile plastered on her face as she greets guests and staff alike. Her dedication to the hotel is palpable, and she pours her heart into every detail, ensuring that each visitor feels welcomed. Yet, beneath the surface, a storm brews. The shadow of Eleanor Voss looms large, casting doubt on Sylvia's own worth. The socialite's influence over hotel operations has left her feeling like an outsider in her own domain.",
      "As she attends to the needs of guests, Sylvia's thoughts drift to the times she felt belittled by Eleanor's presence. The constant comparisons gnaw at her, and the frustration simmers just below her cheerful demeanor. She often brushes off compliments with a laugh, using self-deprecating humor to mask the hurt. 'Oh, I’m just the manager—what do I know?' she quips, but the words echo hollowly in her ears, a reminder of the respect she yearns for.",
      "When the news of Eleanor's murder spreads through the hotel, Sylvia's heart races with conflicting emotions. On one hand, she feels a sense of relief; the woman who overshadowed her is gone. Yet, guilt gnaws at her for even considering such thoughts. The stakes are high; the investigation could unravel her carefully constructed world, and the dynamics of power within the hotel are shifting.",
      "In the days that follow, Sylvia grapples with her feelings of inadequacy, questioning her role as manager. The murder forces her to confront the delicate balance of authority and respect. As she navigates the aftermath, Sylvia must decide whether to reclaim her power or allow the shadows of doubt to continue to eclipse her."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a charismatic art dealer, walks a tightrope between charm and deceit as he navigates the dangerous waters of his illegal dealings.",
    "publicPersona": "Charming and persuasive, Hugo is known for his keen eye for art and his ability to navigate high society with ease. His presence is magnetic, drawing people in as he spins tales of artistry and culture.",
    "privateSecret": "Beneath the charming exterior lies a web of illegal dealings and hidden debts, a secret that threatens to unravel his carefully constructed life.",
    "motiveSeed": "Hugo fears that Eleanor's knowledge of his fraudulent art practices could expose him, a prospect that terrifies him.",
    "motiveStrength": "strong",
    "alibiWindow": "Hugo claims to have been meeting with clients during the time of the murder, but he cannot provide proof.",
    "accessPlausibility": "easy",
    "stakes": "His livelihood and freedom are on the line, forcing him to confront the consequences of his actions.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with a smooth, confident tone, often punctuating his sentences with witty observations. His charm is disarming, and he has a knack for making even the most mundane conversation feel engaging.",
    "signatureTic": "Art is subjective, darling.",
    "internalConflict": "Hugo grapples with the fear of exposure and the moral implications of his actions, torn between maintaining his façade and confronting the truth.",
    "personalStakeInCase": "The murder of Eleanor is not just a crime; it threatens to expose his fraudulent practices and unravel the life he has built, pushing him toward a reckoning.",
    "paragraphs": [
      "Hugo Vane saunters through the grand hotel, his presence commanding attention as he engages guests with a disarming charm. The art dealer thrives in high society, spinning tales of artistry and culture that leave his audience captivated. Yet, beneath the polished surface lies a darker reality—a web of illegal dealings that threatens to unravel everything he has built. The stakes are high, and the fear of exposure looms like a storm cloud over his head.",
      "As he mingles with the elite, Hugo's mind races with thoughts of Eleanor Voss. The socialite's keen eye for detail and connections to the art world make her a potential threat to his carefully curated life. The thought of her knowledge of his fraudulent practices sends shivers down his spine, and he knows that her demise could change the game entirely. 'Art is subjective, darling,' he quips with a wink, but the humor is tinged with desperation.",
      "When the news of Eleanor's murder breaks, Hugo's heart races—not with grief, but with a sense of relief. The woman he feared may have exposed him is gone, yet the implications of her death weigh heavily on his conscience. The investigation could unravel his life, and he must tread carefully, balancing the charm he is known for with the fear that grips him.",
      "In the aftermath, Hugo grapples with the consequences of his actions. The murder forces him to confront the moral implications of his dealings, and he stands at a crossroads. Will he continue down the path of deceit, or will he seek a more honest path, one that could lead to redemption? The choice is his, but the shadows of his past loom large."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Azure Crest Hotel",
    "type": "Hotel",
    "place": "Scarborough",
    "country": "England",
    "summary": "A grand seaside hotel with art deco elegance, overlooking the rugged coastline and shrouded in mystery.",
    "visualDescription": "The Azure Crest Hotel boasts sweeping ocean views, with its bold geometric lines and decorative motifs standing proud against the grey sky. The lobby features polished marble floors, plush velvet furnishings, and a grand chandelier that casts a soft glow over the space. Large windows frame the tumultuous sea beyond, while the scent of salt and damp air permeates the atmosphere.",
    "atmosphere": "A palpable tension lingers in the air, with whispers of uncertainty echoing through the grand halls.",
    "paragraphs": [
      "The Azure Crest Hotel, a majestic structure of art deco design, rises like a sentinel over the cliffs of Scarborough. Its façade, adorned with intricate motifs and bold lines, reflects a bygone era of opulence. Inside, the lobby is a cacophony of muted conversations and the soft clinking of cutlery from the dining area, where guests gaze out at the churning sea. The atmosphere is thick with unspoken words, each guest casting furtive glances at one another, as if the very walls hold secrets.",
      "As the day wanes and the overcast sky darkens, the hotel takes on a more sinister tone. Shadows stretch across the polished marble floors, and the distant sound of waves crashing against the cliffs becomes a haunting backdrop to the evening's events. The scent of damp wood and musty carpets mingles with the salty air, creating a heady mix that heightens the senses. Each corner of the hotel seems to whisper of stories untold, urging guests to uncover the truth buried beneath layers of deception.",
      "With the coastline's isolation weighing heavily on the guests, the Azure Crest Hotel serves as both refuge and prison. The narrow hallways leading to the guest rooms are lined with doors that conceal more than just sleeping quarters; they are portals to hidden lives and clandestine encounters. The employees-only signs guard secrets of their own, hinting at areas where the shadows twist and turn, and the past collides with the present in unexpected ways."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of a coastal climate in early autumn.",
    "timeFlow": "A tense night unfolds over the course of several hours.",
    "mood": "Tense, with an undercurrent of suspicion among guests and staff following a recent incident.",
    "eraMarkers": [
      "Decorative art deco features",
      "Manual typewriters in the reception area",
      "Early radio broadcasting in the lounge"
    ],
    "sensoryPalette": {
      "dominant": "A blend of damp sea air and polished wood",
      "secondary": [
        "Faint scent of cigar smoke",
        "Underlying mustiness of old carpets"
      ]
    },
    "paragraphs": [
      "The atmosphere envelops the Azure Crest Hotel like the heavy mist that clings to the cliffs outside. The scent of damp stone mingles with the salty tang of the ocean, creating a palpable sense of unease. As guests gather in the lobby, their hushed tones and wary glances create a tapestry of suspicion, woven tightly by the recent incident that has cast a shadow over their stay. The flickering gaslights cast wavering shadows, amplifying the tension that hangs in the air, leaving each guest aware that they are not alone.",
      "The overcast sky looms like an oppressive blanket, casting a grey hue over the hotel. The sounds of distant thunder rumble like an ominous warning, while the rhythmic crash of waves against the cliffs serves as a reminder of the isolation that surrounds them. The hotel, with its grand architecture and elegant decor, feels like a stage set for a drama yet to unfold, where every creak of the floorboards and whisper of the wind hints at secrets waiting to be uncovered."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests and staff",
      "visualDetails": "Polished marble floors, velvet furnishings, large windows overlooking the sea",
      "sensoryDetails": {
        "sights": [
          "gleaming chandelier overhead",
          "art deco motifs on walls",
          "guests in elegant attire",
          "turbulent sea through windows",
          "flickering gas lamps casting shadows"
        ],
        "sounds": [
          "soft murmurs of conversation",
          "clinking of glasses",
          "distant thunder rumbling",
          "footsteps echoing on marble",
          "crackling radio in the corner"
        ],
        "smells": [
          "salt air from the ocean",
          "freshly polished wood",
          "cigar smoke lingering",
          "damp wool from coats",
          "scent of old leather"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft velvet upholstery",
          "cool glass of a drink",
          "chill of the ocean breeze",
          "worn leather armrests"
        ]
      },
      "accessControl": "Guests have unrestricted access; staff-only areas are marked and controlled.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light filtering through clouds",
            "shadows dancing on marble floors",
            "wet umbrellas in the lobby",
            "puddles forming outside"
          ],
          "sounds": [
            "steady patter of rain on rooftops",
            "distant thunder rolling",
            "water trickling through gutters",
            "soft laughter from guests",
            "clock ticking in the silence"
          ],
          "smells": [
            "damp earth from the gardens",
            "fresh rain on stone",
            "mildew on old books",
            "cooked breakfast wafting from the kitchen",
            "cool stone walls"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light",
            "shadows creeping across the floor",
            "guests gathered in small groups",
            "faded photographs on the walls",
            "decorative vases on side tables"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the creak of old timbers",
            "soft whispers of conversation",
            "the rustle of newspaper pages",
            "clinking cutlery from the dining area"
          ],
          "smells": [
            "beeswax from candle sconces",
            "dust motes in the air",
            "woodsmoke from the fireplace",
            "faint scent of fresh pastries",
            "old leather from furniture"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting on glass surfaces",
            "long shadows stretching across the lobby",
            "glimmer of silverware on tables",
            "guests mingling in the soft light",
            "ocean waves illuminated by moonlight"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "distant laughter from the bar",
            "soft music from a radio",
            "the crash of waves outside",
            "murmurs of conversation rising and falling"
          ],
          "smells": [
            "scent of candle wax",
            "freshly brewed coffee",
            "tobacco smoke from cigars",
            "cold fireplace ash",
            "hint of perfume in the air"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of the Azure Crest Hotel is a striking blend of elegance and tension. Guests gather beneath the gleaming chandelier, their conversations hushed as they cast wary glances at one another. The polished marble floors reflect the flickering gaslight, creating an atmosphere thick with unspoken words. Outside, the turbulent sea mirrors the unrest within, as the scent of salt and damp wood permeates the air, hinting at secrets buried beneath the surface.",
        "As the evening progresses, the lobby transforms into a stage for intrigue. Shadows dance along the walls, and the soft clinking of glasses punctuates the thick silence. The distant sound of waves crashing against the cliffs serves as a constant reminder of their isolation, while the lingering scent of cigar smoke and polished wood creates a comfortable yet unsettling ambiance. Every guest is acutely aware that the night holds more than just the promise of rest."
      ]
    },
    {
      "id": "dining_room",
      "name": "Oceanview Dining Room",
      "type": "interior",
      "purpose": "Dining area for guests",
      "visualDetails": "Large windows with ocean views, elegant dining tables, and art deco decor.",
      "sensoryDetails": {
        "sights": [
          "elegantly set tables",
          "ocean waves crashing outside",
          "glistening silverware",
          "art deco light fixtures",
          "colorful floral centerpieces"
        ],
        "sounds": [
          "clinking of dishes",
          "soft strains of music",
          "laughter from nearby tables",
          "the rush of the ocean",
          "waitstaff moving quietly"
        ],
        "smells": [
          "freshly baked bread",
          "grilled fish and herbs",
          "simmering sauces",
          "scent of citrus fruits",
          "aroma of coffee brewing"
        ],
        "tactile": [
          "smooth tablecloths under fingers",
          "chill from the ocean breeze",
          "warmth of a freshly served dish",
          "cool glass of iced water",
          "soft leather of the chairs"
        ]
      },
      "accessControl": "Open to all guests during meal times; staff prepare before service.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "grey light falling on tables",
            "wet footprints on the floor",
            "empty tables awaiting guests",
            "clouds hanging low over the sea"
          ],
          "sounds": [
            "rain tapping against glass",
            "soft murmurs of early risers",
            "clatter of dishes in the kitchen",
            "distant thunder rumbling",
            "the rush of waves outside"
          ],
          "smells": [
            "freshly brewed tea",
            "scent of damp wood",
            "cooked breakfast wafting",
            "hint of mildew in the air",
            "smoky aroma from the kitchen"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "guests enjoying afternoon tea",
            "shadows creeping across tables",
            "dishes being cleared away",
            "waves crashing against the rocks"
          ],
          "sounds": [
            "soft laughter and chatter",
            "the clinking of cups",
            "the rustle of napkins",
            "waitstaff moving quietly",
            "the distant sound of seagulls"
          ],
          "smells": [
            "scent of brewed coffee",
            "fresh pastries cooling",
            "ocean air blending with food aromas",
            "spices from the kitchen",
            "faint scent of old books"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of candlelight on tables",
            "guests in evening attire",
            "moonlight reflecting off the ocean",
            "waitstaff moving gracefully",
            "decorative china on the tables"
          ],
          "sounds": [
            "soft music playing in the background",
            "clinking of glasses",
            "murmurs of conversation",
            "the distant crash of waves",
            "the rustle of menus being opened"
          ],
          "smells": [
            "aroma of grilled seafood",
            "scent of rich desserts",
            "fresh herbs and spices",
            "candle wax melting",
            "the warmth of baked bread"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room offers a breathtaking panorama of the crashing waves, where guests gather to indulge in sumptuous meals. The elegantly set tables, adorned with floral centerpieces and shining silverware, create an inviting atmosphere. However, the tension in the air is palpable, as conversations are punctuated by furtive glances towards the windows, where the sea roils with hidden dangers. The scent of fresh bread and grilled fish wafts through the room, mingling with the salty air, setting the stage for both culinary delight and unspoken trepidation.",
        "As the evening unfolds, the dining room transforms into a space of intrigue. Candlelight dances across the tables, casting flickering shadows that seem to whisper secrets. The soft strains of music blend with the distant sound of waves crashing against the cliffs, creating a haunting backdrop for the unfolding drama. Guests exchange knowing looks, the tension thickening with each passing moment, as the aroma of rich seafood and desserts fills the air, hinting at pleasures yet to be revealed."
      ]
    },
    {
      "id": "basement_storage",
      "name": "Basement Storage Room",
      "type": "interior",
      "purpose": "Storage for supplies and linens, restricted access",
      "visualDetails": "Dimly lit room with stacks of boxes and old furniture.",
      "sensoryDetails": {
        "sights": [
          "flickering fluorescent lights",
          "dusty shelves lined with boxes",
          "old furniture covered in sheets",
          "spiderwebs in corners",
          "faded labels on crates"
        ],
        "sounds": [
          "soft dripping of water",
          "creaking floorboards",
          "rustle of fabric in the air",
          "distant echo of footsteps",
          "the hum of an old furnace"
        ],
        "smells": [
          "musty air and mildew",
          "faint scent of old linen",
          "dampness clinging to the walls",
          "faint oil from machinery",
          "scent of dust in the air"
        ],
        "tactile": [
          "rough texture of cardboard boxes",
          "cold metal of shelves",
          "dusty surfaces under fingers",
          "chill from the concrete floor",
          "soft fabric of old linens"
        ]
      },
      "accessControl": "Staff only; accessed with key after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dampness on the floor",
            "puddles forming near the entrance",
            "dark corners of the room",
            "light filtering through cracks"
          ],
          "sounds": [
            "steady drip of water",
            "soft patter of rain outside",
            "muffled voices from above",
            "the rustle of fabric moving",
            "the creak of old pipes"
          ],
          "smells": [
            "damp earth from above",
            "scent of wet cardboard",
            "mildew in the air",
            "faint scent of rust",
            "hint of cleaning solutions"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through cracks",
            "shadows deepening in corners",
            "old furniture casting long silhouettes",
            "dust motes swirling in the air",
            "boxes stacked haphazardly"
          ],
          "sounds": [
            "soft rustling of fabric",
            "distant echoes of footsteps above",
            "the hum of machinery",
            "dripping water in the silence",
            "the creak of the building settling"
          ],
          "smells": [
            "scent of mildew and dust",
            "faint hint of oil",
            "musty air thick with age",
            "hint of cleaning supplies",
            "scent of old wood"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "shadows deepening as dusk falls",
            "flickering light from a single bulb",
            "furniture casting long silhouettes",
            "dust motes illuminated by light",
            "boxes stacked in disarray"
          ],
          "sounds": [
            "the soft hum of the furnace",
            "distant voices from above",
            "the creak of the building settling",
            "rustle of fabric in the dark",
            "the echo of footsteps"
          ],
          "smells": [
            "scent of dust and mildew",
            "faint oil from machinery",
            "hint of damp concrete",
            "scent of old linens",
            "the mustiness of forgotten items"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Basement Storage Room of the Azure Crest Hotel is a dimly lit space that holds the remnants of forgotten supplies and old furniture. Dust hangs in the air, illuminated by flickering fluorescent lights that struggle to keep the shadows at bay. The musty scent of mildew permeates the room, mingling with the faint oil from machinery, creating an atmosphere thick with neglect. This restricted area is rarely visited, making it a perfect hiding place for secrets waiting to be uncovered.",
        "As the evening unfolds, the basement takes on an air of foreboding. The soft drip of water echoes through the silence, while the distant hum of the furnace serves as a reminder of the life above. Shadows deepen in the corners, and the chill from the concrete floor creeps into the bones. Each creak of the floorboards and rustle of fabric seems to whisper of the past, hinting at mysteries concealed within the stacks of boxes and old linens."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "Guest Rooms",
      "type": "interior",
      "purpose": "Private accommodations for guests",
      "visualDetails": "Cozy rooms with ocean views, decorated in art deco style.",
      "sensoryDetails": {
        "sights": [
          "ocean waves visible through windows",
          "art deco furnishings and decor",
          "soft lighting from bedside lamps",
          "elegant curtains fluttering",
          "personal belongings scattered about"
        ],
        "sounds": [
          "waves crashing outside",
          "soft rustle of sheets",
          "distant laughter from the hallway",
          "the hum of the radiator",
          "the ticking of a clock"
        ],
        "smells": [
          "scent of fresh linens",
          "faint perfume lingering in the air",
          "salt air from the ocean",
          "the warmth of old wood",
          "hint of tobacco smoke"
        ],
        "tactile": [
          "softness of the bedspread",
          "cool glass of water on the nightstand",
          "warmth of sunlight streaming in",
          "smooth wood of the furniture",
          "chill from the window"
        ]
      },
      "accessControl": "Guests have access to their own rooms; staff enter for cleaning during the day.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through curtains",
            "rain hitting the window",
            "wet footprints leading to the door",
            "shadows on the walls",
            "puddles forming outside"
          ],
          "sounds": [
            "steady patter of rain",
            "the rush of waves outside",
            "muffled voices in the hall",
            "soft rustle of sheets",
            "the creak of the bed"
          ],
          "smells": [
            "scent of wet wood",
            "faint smell of mildew",
            "fresh linens from the bed",
            "hint of dampness in the air",
            "aroma of breakfast wafting up"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light seeping through curtains",
            "shadows deepening on the floor",
            "personal belongings strewn about",
            "ocean waves crashing outside",
            "distant outline of cliffs"
          ],
          "sounds": [
            "soft rustle of sheets",
            "waves crashing against the shore",
            "distant laughter in the hallway",
            "the ticking of a clock",
            "the hum of the radiator"
          ],
          "smells": [
            "scent of salt air",
            "faint perfume lingering",
            "warm wood from furniture",
            "fresh linens",
            "hint of tobacco smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "moonlight illuminating the room",
            "shadows cast by furniture",
            "the ocean glimmering outside",
            "glow of bedside lamps",
            "personal items reflecting memories"
          ],
          "sounds": [
            "waves softly crashing outside",
            "the ticking of a clock",
            "distant sounds of laughter",
            "soft rustle of sheets",
            "the hum of the radiator"
          ],
          "smells": [
            "scent of fresh linens",
            "faint hint of perfume",
            "warmth of sunlight",
            "salt air from the ocean",
            "the warmth of old wood"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Guest Rooms of the Azure Crest Hotel offer a cozy retreat with stunning views of the ocean. Each room is adorned with art deco furnishings, creating an atmosphere of elegance and comfort. However, beneath the surface, an air of unease lingers as guests settle in for the night. The sound of waves crashing against the cliffs serves as a constant reminder of the isolation that surrounds them, while the scent of fresh linens and salt air fills the space, urging them to uncover the truth hidden within the hotel’s walls.",
        "As evening descends, the rooms transform into sanctuaries of secrecy. Moonlight spills through the windows, casting long shadows that dance across the walls. The ticking of a clock resonates in the silence, each tick a reminder of the time slipping away. The warmth of the sun lingers in the air, mixing with the faint perfume of personal belongings, creating an intimate yet tense atmosphere. Each guest feels the weight of their own secrets, as the ocean’s roar becomes a distant echo of the mysteries waiting to be revealed."
      ]
    }
  ],
  "note": "",
  "cost": 0.0030529273500000003,
  "durationMs": 94066
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1949,
    "month": "May",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "Mild temperatures averaging 60°F (15°C)",
      "Occasional light rain and overcast skies",
      "Blooming flowers and lush greenery in coastal gardens"
    ],
    "daylight": "Days are getting longer with sunset around 8:30 PM, providing ample daylight for evening activities.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner service has concluded.",
    "holidays": [
      "May Day (May 1)",
      "Mother's Day (May 14)"
    ],
    "seasonalActivities": [
      "Spring garden parties and picnics",
      "Taking walks along the beach as the spring blooms emerge",
      "Attending local fairs and community events celebrating the season"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Double-breasted suits in navy or charcoal wool",
        "White dress shirts with wide collars",
        "Fedoras in felt or straw"
      ],
      "casual": [
        "Lightweight cotton or linen shirts",
        "Khaki trousers or shorts",
        "Leather loafers or brogues"
      ],
      "accessories": [
        "Silk ties in bold patterns",
        "Pocket squares for formal attire",
        "Wristwatches with metal bands"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea-length dresses with floral prints",
        "Tailored suits with rounded lapels",
        "Wide-brimmed hats adorned with ribbons"
      ],
      "casual": [
        "Cotton blouses tucked into high-waisted skirts",
        "Capri pants in pastel colors",
        "Ballet flats or low-heeled shoes"
      ],
      "accessories": [
        "Pearl necklaces or bracelets",
        "Clutch purses with decorative closure",
        "Sunglasses with cat-eye frames"
      ]
    },
    "trendsOfTheMoment": [
      "New Look by Christian Dior gaining popularity",
      "Emphasis on feminine silhouettes",
      "Surge in casual wear as leisure activities increase"
    ],
    "socialExpectations": [
      "Women are expected to balance home life and increasing roles in the workforce",
      "Men are often seen as the primary breadwinners",
      "Social gatherings are a reflection of one's status and community involvement"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Marshall Plan is still influencing European recovery efforts",
      "Tensions escalate in the Cold War with the Berlin Blockade ongoing",
      "The United Nations is actively addressing global humanitarian issues"
    ],
    "politicalClimate": "Political tensions are palpable as nations grapple with post-war recovery and the emerging Cold War dynamics.",
    "economicConditions": "The economy is beginning to stabilize, though there are still concerns about inflation and employment rates.",
    "socialIssues": [
      "Rising discussions around civil rights and gender equality",
      "Strikes in various industries as workers demand better conditions",
      "The stigma of mental health issues is still prevalent, especially among veterans"
    ],
    "internationalNews": [
      "The establishment of NATO in April 1949 as a military alliance against potential Soviet aggression",
      "Continued discussions in the UN about decolonization and independence movements",
      "Reports of conflicts in Asia, including tensions in China and Korea"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's hits dominating the airwaves",
        "The rise of jazz and big band music continuing from the war years",
        "Traditional folk songs gaining traction in American culture"
      ],
      "films": [
        "The Third Man (1949) capturing post-war Vienna's intrigue",
        "All the King's Men (1949) highlighting political corruption",
        "A Letter to Three Wives (1949) exploring complex relationships"
      ],
      "theater": [
        "Death of a Salesman by Arthur Miller receiving critical acclaim",
        "A Streetcar Named Desire by Tennessee Williams creating buzz",
        "Musicals like Kiss Me, Kate blending comedy and romance"
      ],
      "radio": [
        "The Shadow, a mystery program, continues to thrill listeners",
        "The Lux Radio Theater presenting adaptations of popular films",
        "Suspense, a series focusing on thrilling stories, is gaining a following"
      ]
    },
    "literature": {
      "recentPublications": [
        "1984 by George Orwell, exploring dystopian themes",
        "The Catcher in the Rye by J.D. Salinger, capturing adolescent angst",
        "The Bell Jar by Sylvia Plath, discussing women's roles and mental health"
      ],
      "popularGenres": [
        "Mystery and detective fiction gaining popularity post-war",
        "Realist fiction reflecting societal changes",
        "Science fiction beginning to emerge as a genre"
      ]
    },
    "technology": {
      "recentInventions": [
        "First commercial television broadcasts expanding entertainment options",
        "The introduction of the transistor radio, making music portable",
        "Developments in jet engine technology revolutionizing air travel"
      ],
      "commonDevices": [
        "Manual typewriters used in homes and offices",
        "Radios as primary sources of news and entertainment",
        "Basic household appliances like toasters and refrigerators becoming more common"
      ],
      "emergingTrends": [
        "Increased interest in consumer electronics",
        "Growth of suburbs as families seek homes outside urban centers",
        "Rising popularity of outdoor leisure activities"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pint of milk: three pence",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "Attending church services on Sundays",
        "Participating in community fairs and picnics",
        "Evening strolls or social gatherings at local parks"
      ],
      "socialRituals": [
        "Sunday family dinners as a tradition",
        "Hosting or attending garden parties in spring",
        "Exchanging gifts for Mother's Day"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "A clear divide between upper, middle, and working classes, influencing social interactions",
      "Class expectations dictate appropriate behavior and attire in public settings"
    ],
    "gender": [
      "Women are increasingly entering the workforce, challenging traditional roles",
      "Expectations still linger for women to maintain household duties",
      "Men are viewed as the primary decision-makers in family and society"
    ],
    "race": [
      "Racial segregation and discrimination remain prevalent in many areas",
      "Emerging discussions about civil rights and equality, particularly in urban centers"
    ],
    "generalNorms": [
      "Politeness and decorum are highly valued in public interactions",
      "Family-oriented values dominate social expectations",
      "Community involvement is seen as a reflection of personal character"
    ]
  },
  "atmosphericDetails": [
    "The scent of blooming lilacs and freshly cut grass wafts through the air, mingling with the sound of waves crashing against the shore.",
    "The muted chatter of guests fills the hotel lobby, accompanied by the soft strains of a jazz band playing in the background.",
    "Occasional raindrops patter against the windows, creating a rhythmic backdrop to the tense conversations and furtive glances exchanged among the guests."
  ],
  "paragraphs": [
    "May 1949 finds the coastal hotel bustling with activity, as guests flock to enjoy the mild spring weather. The days are marked by intermittent rain, with overcast skies that occasionally break to reveal glimmers of sunshine. The scent of blooming flowers and sea salt fills the air, as families prepare for Mother’s Day celebrations and local fairs. Among the guests, an undercurrent of suspicion simmers, heightened by recent unsettling events that have cast a shadow over the hotel's reputation.",
    "Fashion trends reflect the spirit of the times, with men donning double-breasted suits in navy and charcoal, complemented by silk ties and fedoras. Women embrace the New Look, showcasing tea-length dresses adorned with floral patterns, accessorized with pearl necklaces and wide-brimmed hats. The vibrant colors of spring are mirrored in their attire, as they engage in social gatherings, reflecting the shift towards a more relaxed yet elegant approach to dress in the post-war era.",
    "Daily life in May 1949 is characterized by the blending of traditional values with emerging modernity. Families are seen enjoying leisurely strolls along the beach, while others participate in community events celebrating the season. Prices remain relatively affordable, with a loaf of bread costing just four pence. Social rituals, such as Sunday family dinners and garden parties, emphasize communal bonds, yet the tensions of the era linger, particularly surrounding class divisions and the evolving roles of women in society. The atmosphere is charged with a mix of anticipation and unease as the Cold War begins to reshape the global landscape."
  ],
  "note": "",
  "cost": 0.0012829047,
  "durationMs": 26866
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A recent drowning incident at a grand seaside hotel draws together a diverse group of guests and staff, all navigating the pressures of post-war societal shifts and the looming threat of Cold War tensions.",
  "era": {
    "decade": "1940s",
    "socialStructure": "As women increasingly enter the workforce, traditional class dynamics are challenged, creating tension among guests and staff who must navigate changing social norms and expectations."
  },
  "setting": {
    "location": "A grand seaside hotel with art deco architecture",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain, typical of a coastal climate in early autumn."
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
    "id": "tide_chart_time",
    "value": "ten minutes past eleven",
    "description": "The time when the tide reached its peak"
  },
  {
    "id": "tide_low_time",
    "value": "a quarter past one",
    "description": "The time when the tide was lowest"
  },
  {
    "id": "body_discovery_time",
    "value": "twenty past midnight",
    "description": "The time the victim's body was found"
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
      "category": "testimonial"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "early",
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
      "category": "temporal"
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
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_beatrice_quill",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_discriminating_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
