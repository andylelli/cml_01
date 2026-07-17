# Actual Prompt Record

- Run ID: `mystery-1784258290481`
- Project ID: ``
- Timestamp: `2026-07-17T03:22:52.541Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `99a2aab19e7308cf`

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
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Brighton",
      "place": "Grand Seaside Hotel",
      "country": "England",
      "institution": "hotel"
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
      "public_persona": "Charming socialite",
      "private_secret": "Involved in a secret affair",
      "motive_seed": "Fear of scandal",
      "motive_strength": "strong",
      "alibi_window": "Not applicable",
      "access_plausibility": "low",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation at stake",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Reputable physician",
      "private_secret": "Obsessed with uncovering the truth",
      "motive_seed": "Professional duty",
      "motive_strength": "moderate",
      "alibi_window": "Witnessed at the hotel",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Authority figure",
      "relationships": [],
      "public_persona": "Respected naval officer",
      "private_secret": "Has a gambling problem",
      "motive_seed": "Debt pressure",
      "motive_strength": "moderate",
      "alibi_window": "Uncertain timing in the evening",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation and finances",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Innocent bystander",
      "relationships": [],
      "public_persona": "Friendly hotel staff",
      "private_secret": "Sees more than she lets on",
      "motive_seed": "None",
      "motive_strength": "weak",
      "alibi_window": "Stable during the incident",
      "access_plausibility": "medium",
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
      "role_archetype": "Rival",
      "relationships": [],
      "public_persona": "Socialite with connections",
      "private_secret": "Jealous of Eleanor's charm",
      "motive_seed": "Professional jealousy",
      "motive_strength": "moderate",
      "alibi_window": "Spotted in the dining area",
      "access_plausibility": "high",
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
      "role_archetype": "Accomplice",
      "relationships": [],
      "public_persona": "Charming businessman",
      "private_secret": "Involved in shady dealings",
      "motive_seed": "Financial gain",
      "motive_strength": "strong",
      "alibi_window": "Unaccounted for during the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Wealth and freedom",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Hugo Vane"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In the grand seaside hotel, Eleanor Voss is found drowned during what was believed to be high tide. However, as Dr. Mallory Finch investigates, she uncovers a web of deceit involving manipulated tide schedules and hidden motives among the guests."
    },
    "accepted_facts": [
      "Eleanor Voss was discovered drowned at the beach.",
      "Witnesses report the tide was unusually low at the time of her death.",
      "Captain Ivor Hale was seen near the beach during the timeframe."
    ],
    "inferred_conclusions": [
      "Eleanor's death was not a simple drowning.",
      "The tide schedule may have been tampered with."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A hidden system of pipes redirected water from the beach, creating the illusion of high tide.",
      "delivery_path": [
        {
          "step": "Pipes were concealed in the utility room, draining water away."
        },
        {
          "step": "Hotel logs indicate unusual water levels."
        },
        {
          "step": "Mechanical noises were reported near the beach during the incident."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor was drowned at a manipulated low tide, disguised as a drowning during high tide."
    }
  },
  "false_assumption": {
    "statement": "Eleanor drowned while swimming during high tide.",
    "type": "temporal",
    "why_it_seems_reasonable": "Tide tables indicated high tide at the time of her death.",
    "what_it_hides": "The true tide level was manipulated to create an alibi."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses saw Hale near the beach during the time of death.",
      "Hale was known to have a conflict with Eleanor."
    ],
    "the_one_flaw": "Hale was accounted for at the dining area just before the incident.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A conflicting witness statement claims Eleanor was seen arguing with Captain Hale just before her death.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was a misunderstanding about a social engagement, resolved by other witnesses.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Eleanor's personal effects contained a threatening letter.",
      "points_at_suspect": "Sylvia Trent",
      "innocent_explanation": "The letter was from a previous social encounter, unrelated to her death.",
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
    "rationale": "All suspects were guests or staff at the hotel during the incident."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Tide tables showing high tide at the time of death",
        "Witness statements claiming the tide was high"
      ],
      "windows": [
        "The time frame of the incident",
        "The operational hours of the beach patrol"
      ],
      "contradictions": [
        "Witnesses recall seeing Eleanor on the beach when the tide was low",
        "Hotel logs show inconsistent water levels"
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Hugo Vane",
        "Dr. Mallory Finch"
      ],
      "objects": [
        "Pipes hidden in the utility room",
        "Tide tables",
        "Beach patrol logs"
      ],
      "permissions": [
        "Access to utility areas was restricted to staff",
        "Hale had authority as a naval officer"
      ]
    },
    "physical": {
      "laws": [
        "Water levels rise and fall according to gravitational forces",
        "Physical barriers can redirect water flow"
      ],
      "traces": [
        "Mechanical traces from the pipes",
        "Footprints leading away from the beach"
      ]
    },
    "social": {
      "trust_channels": [
        "Perceived trust in Captain Hale as a naval officer",
        "Social dynamics among guests"
      ],
      "authority_sources": [
        "Hotel management's account of the event",
        "Witness testimonies"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witness statements indicate Eleanor was last seen near the beach at a time when the tide was low.",
        "correction": "The statements contradict the tide tables that suggest she drowned at high tide.",
        "effect": "Narrows the timeline of Eleanor's death.",
        "required_evidence": [
          "Witness statements about Eleanor's last seen location",
          "Tide tables showing expected tide levels"
        ],
        "reader_observable": true
      },
      {
        "observation": "Hotel logs indicate unusual water levels on the night of Eleanor's death.",
        "correction": "The logs suggest tampering with the tide levels.",
        "effect": "Eliminates the assumption of a drowning at high tide.",
        "required_evidence": [
          "Hotel logs showing water level readings",
          "Witness accounts of mechanical noises"
        ],
        "reader_observable": true
      },
      {
        "observation": "Pipes leading to the beach were found in the utility room.",
        "correction": "The pipes could redirect water, creating a false high tide scenario.",
        "effect": "Narrows suspect access to those who could manipulate the water flow.",
        "required_evidence": [
          "The pipes in the utility room",
          "Witness statements about mechanical sounds"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Testing the tide schedule against the hotel logs and mechanical evidence to reveal the manipulation of water levels.",
    "knowledge_revealed": "The timing of the mechanical sounds coincides with the expected tide schedule, confirming manipulation.",
    "pass_condition": "If the evidence shows a contradiction between the expected and actual tide levels, it implicates the culprit.",
    "evidence_clues": [
      "clue_3",
      "clue_5",
      "clue_12",
      "clue_parity_bridge"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "All clues, such as the tide tables and water level logs, are presented early, allowing the reader to deduce the manipulation before the final reveal."
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
        "Observe the evidence of tide manipulation",
        "Draw conclusion about guilt"
      ],
      "test_type": "tide manipulation evidence"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses place him in the dining area during the critical timeframe",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "She was on duty and has stable witness accounts.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her alibi is confirmed by multiple guests.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: Not applicable",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of tide manipulation."
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
        "clue_id": "clue_parity_bridge",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Witness statement"
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
        "delivery_method": "Behavioral observation"
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
        "clue_id": "clue_culprit_direct_hugo_vane",
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
        "clue_id": "clue_early_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Hotel logs"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss was a socialite, known for her charm and philanthropic efforts, but beneath her polished exterior lay a tumultuous struggle with gambling debts that threatened her very existence.",
    "publicPersona": "Charming hostess known for her philanthropic endeavors.",
    "privateSecret": "Struggles with gambling debts that could ruin her social standing.",
    "motiveSeed": "Her upcoming expose on the hotel's dark past threatened many guests.",
    "motiveStrength": "strong",
    "alibiWindow": "was hosting a charity dinner when the murder occurred.",
    "accessPlausibility": "impossible",
    "stakes": "She stood to lose her reputation and friends if her secrets came out.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Eleanor spoke with a melodious cadence, often punctuating her sentences with soft laughter that never quite reached her eyes, as if she were trying to convince herself of her own happiness.",
    "signatureTic": "It's all for a good cause, isn't it?",
    "internalConflict": "Eleanor battles with the guilt of her debts and the fear of being exposed, all while maintaining the facade of a perfect life.",
    "personalStakeInCase": "Eleanor's death would not only shatter her social standing but also expose the very secrets she fought to protect.",
    "paragraphs": [
      "Eleanor Voss floated through the opulent halls of the Brighton hotel like a ghost in a gilded cage, a figure draped in elegance yet suffocating under the weight of her hidden debts. To the world, she was a dazzling socialite, a beacon of philanthropy, but behind closed doors, desperation gnawed at her insides. Each invitation she sent out was a plea for acceptance, a thin veneer over the cracks that threatened to consume her. The charity dinner she hosted was a lavish affair, yet it was all a ruse; the deeper she sank into her gambling debts, the more extravagant her parties became, a desperate attempt to mask her unraveling life.",
      "The upcoming expose she was preparing on the hotel's shadowy past could have been her ticket to redemption, a chance to reclaim her narrative. Yet, as she mingled with the guests, laughter bubbling forth like champagne, the gnawing fear of what her revelations could unleash haunted her. She had unwittingly stirred a hornet's nest, and those who had much to lose were watching her every move. Eleanor's charm was her armor, but it would not shield her from the repercussions of what she had set in motion.",
      "As the evening wore on and the clinking of glasses filled the air, Eleanor's mind raced with thoughts of what could happen if her debts were revealed. Friends would turn to enemies, her social standing would evaporate like mist in the morning sun, and the life she had carefully crafted would crumble to dust. The stakes were higher than she had ever imagined, and the thought of losing everything was a bitter pill to swallow. Yet, she smiled, for that was what was expected of her.",
      "In the end, Eleanor Voss was a woman caught between the confines of her own making and the dark secrets she harbored. Her life was a performance, one that had become increasingly difficult to maintain. As she prepared for the evening's festivities, she could not shake the feeling that the very act of hosting might be what led to her downfall. Little did she know, her final act was about to unfold in a way she could never have anticipated."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, finds herself entwined in a web of deceit as she grapples with her hidden affair with the victim's husband, while seeking justice for Eleanor Voss.",
    "publicPersona": "Respected doctor with a calm demeanor, often giving sound advice.",
    "privateSecret": "Affair with the victim's husband, which could ruin her career.",
    "motiveSeed": "Concern over the victim's increasing influence and public revelations about her past.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was examining guests after a minor incident during the dinner.",
    "accessPlausibility": "easy",
    "stakes": "Her professional reputation and personal life hang in the balance.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Dr. Finch spoke with a precision that mirrored her surgical skills, often punctuating her observations with sardonic remarks that revealed her acerbic wit. She had a habit of raising an eyebrow when delivering particularly sharp comments, as if daring her audience to challenge her insights.",
    "signatureTic": "Ah, the human condition, isn't it?",
    "internalConflict": "Mallory wrestles with the guilt of her affair and the fear of exposure, torn between her professional duty and personal desires.",
    "personalStakeInCase": "The murder of Eleanor Voss threatens to unravel her carefully constructed life, exposing her affair and jeopardizing her career.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the periphery of the charity dinner, her keen eyes taking in the scene with a mixture of detachment and curiosity. A physician by trade, she was accustomed to observing the human condition, but tonight felt different. Eleanor Voss, the victim, had always been the center of attention, a shimmering star in the social firmament, yet as Mallory glanced at her, she saw the cracks beneath the surface. Behind the facade of charm and philanthropy lay a woman burdened by secrets, much like herself.",
      "As she mingled among the guests, Mallory's mind wandered to her own hidden truth—the affair with Eleanor's husband. It was a dangerous liaison, one that could cost her not only her reputation but also her career. The stakes were higher than ever, with every whispered word and sidelong glance a reminder of the precariousness of her situation. Mallory had always been the voice of reason, offering sound advice to those around her, yet here she was, ensnared in the very chaos she sought to untangle.",
      "Her alibi during the murder was solid enough, having been occupied with a minor incident in the lobby, but the gnawing fear of exposure loomed large. What if someone connected the dots? What if Eleanor's death unraveled the very fabric of her life? With each passing moment, the weight of her secret grew heavier, and the desire to seek justice for Eleanor became intertwined with her own survival.",
      "In the depths of her professional demeanor, a flicker of resolve ignited. Mallory understood that uncovering the truth behind Eleanor's murder might not only serve justice but also provide her with the closure she desperately needed. As she navigated the treacherous waters of the investigation, she found herself grappling with a moral dilemma—could she remain impartial while harboring such a dangerous secret? The answer was as elusive as the truth itself, but one thing was clear: she would not let fear dictate her actions any longer."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer with a storied past, finds his unresolved feelings for Eleanor Voss reignited amidst the chaos of her murder investigation.",
    "publicPersona": "A gruff yet charming man who tells tall tales of the sea.",
    "privateSecret": "Once had a romantic affair with Eleanor that ended badly.",
    "motiveSeed": "Resentment over Eleanor's betrayal and fear of being exposed.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the bar during the incident but no one can confirm the exact timing.",
    "accessPlausibility": "possible",
    "stakes": "His pride and lingering feelings for Eleanor could drive him to desperation.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor spoke with a gravelly voice, each word tinged with the salt of the sea. His stories flowed like the tides, punctuated by hearty laughter that often belied the pain lurking beneath. He had a tendency to embellish his tales, but there was an undeniable sincerity behind his bravado.",
    "signatureTic": "Aye, the sea teaches you many things.",
    "internalConflict": "Ivor struggles with the bitterness of past betrayal while grappling with a desire for redemption and closure.",
    "personalStakeInCase": "Eleanor's murder dredges up old wounds, forcing Ivor to confront his past and the unresolved feelings he harbors for her.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, a glass of whiskey in hand, his weathered face betraying little of the turmoil brewing within. The sea had always been his refuge, a place where he could escape the ghosts of his past, but tonight, the memories of Eleanor Voss crashed over him like a relentless tide. Their affair had been a tempest, one that left scars on both their hearts, and now, with her murder hanging over the hotel like a dark cloud, Ivor found himself reevaluating the choices that had led them to this moment.",
      "To the world, he was a gruff yet charming figure, regaling patrons with tales of naval exploits and daring adventures, but beneath the bravado lay a man wrestling with resentment. Eleanor's betrayal had cut deep, leaving him feeling like a ship tossed in a storm. As he sipped his drink, Ivor could not shake the feeling that their paths had crossed for a reason, and the investigation into her death stirred feelings he thought long buried. The stakes were higher than mere pride; it was a matter of the heart.",
      "His alibi was shaky at best—he had been in the bar during the incident, but the precise timing was lost to the haze of whiskey and memories. Ivor understood the danger of being a suspect, yet a part of him welcomed the scrutiny. Perhaps it was time to confront the past and seek closure, not just for Eleanor, but for himself. The weight of his unresolved feelings pressed upon him, and the thought of being implicated in her murder was almost a relief, a chance to finally address the demons that haunted him.",
      "With each passing moment, Ivor felt the pull of justice beckoning him. The investigation was not merely about solving a crime; it was about redemption, about finding a way to forgive himself for the choices he had made. As he prepared to delve deeper into the mystery surrounding Eleanor's death, he knew that the journey would force him to confront not only the truth of what happened but also the truth of who he had become."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious journalist, is torn between her desire for a sensational story and her growing conscience as she navigates the murky waters of Eleanor Voss's murder.",
    "publicPersona": "Ambitious reporter eager to break the next big story.",
    "privateSecret": "Hoping to use any scandal for personal gain in her career.",
    "motiveSeed": "Desperate to uncover secrets for a sensational article that could launch her career.",
    "motiveStrength": "weak",
    "alibiWindow": "Was in the lobby pitch for an article to the hotel manager.",
    "accessPlausibility": "easy",
    "stakes": "Her career depends on her being seen as a credible journalist.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice's speech was quick and lively, often laced with nervous energy. She had a tendency to punctuate her points with self-deprecating humor, frequently downplaying her ambitions while revealing the intense drive beneath her surface. Her voice was enthusiastic, almost breathless, as if she were always on the brink of the next big scoop.",
    "signatureTic": "I’m just a humble journalist, after all.",
    "internalConflict": "Beatrice grapples with the ethical implications of her ambition, torn between opportunism and genuine concern for justice.",
    "personalStakeInCase": "Eleanor's murder presents a career-defining opportunity, yet Beatrice fears crossing the line from journalist to vulture.",
    "paragraphs": [
      "Beatrice Quill stood in the hotel lobby, her heart racing with the thrill of potential. As a journalist, she was always on the lookout for the next big story, and the murder of Eleanor Voss was a tantalizing morsel that could catapult her career to new heights. Yet, as she pitched her ideas to the hotel manager, a nagging voice in the back of her mind reminded her of the ethical line she was tiptoeing. Was she truly seeking justice for Eleanor, or simply a sensational headline?",
      "Her public persona painted her as an ambitious reporter, eager to uncover the truth, but the reality was far more complicated. Beatrice was desperate to prove herself, to be seen as a credible journalist in a world dominated by men. The stakes were high; her career depended on her ability to navigate the murky waters of scandal without getting swept away. But with each new revelation, she felt the weight of her own conscience pressing down on her.",
      "In moments of self-doubt, Beatrice often turned to humor as a coping mechanism, cracking jokes about her own ambition while masking the intensity of her drive. 'I’m just a humble journalist, after all,' she would say with a wry smile, yet the truth was that she wanted more than just to be humble; she wanted to be recognized. The thought of using Eleanor’s tragic end for personal gain gnawed at her, yet the allure of a career-defining article was hard to resist.",
      "As the investigation unfolded, Beatrice found herself grappling with the implications of her choices. Would she be willing to sacrifice her integrity for success? The line between journalist and opportunist blurred, and with each passing moment, she felt the pull of her ambition clashing with her conscience. In the end, she would have to decide what kind of journalist she wanted to be—and whether the truth was worth the price of her soul."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, the hotel owner, is torn between her desire to protect her family business and the ethical dilemmas posed by Eleanor Voss's investigation into her hotel's financial troubles.",
    "publicPersona": "A charismatic leader known for her tirelessly improving the hotel.",
    "privateSecret": "Has been hiding financial troubles from the family.",
    "motiveSeed": "Eleanor's investigation could lead to the hotel's financial ruin.",
    "motiveStrength": "weak",
    "alibiWindow": "Was in a meeting with staff but cannot pinpoint her exact movements.",
    "accessPlausibility": "possible",
    "stakes": "The future of her family business is uncertain, and Eleanor's secrets could destroy it.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia spoke with an air of authority, her voice smooth and commanding, yet there was an underlying sharpness that hinted at her tenacity. She had a penchant for using genteel language to deliver biting critiques, often leaving her listeners unsure of whether to laugh or cringe.",
    "signatureTic": "Business is a matter of survival, dear.",
    "internalConflict": "Sylvia grapples with the fear of losing her family's legacy and the moral implications of her financial decisions.",
    "personalStakeInCase": "Eleanor's murder threatens to expose the financial troubles Sylvia has hidden, jeopardizing her family's hotel legacy.",
    "paragraphs": [
      "Sylvia Trent surveyed the bustling hotel lobby, her heart heavy with the weight of responsibility. As the owner, she had dedicated her life to improving the establishment, yet beneath the polished surface lay a foundation of financial instability. The investigation into Eleanor Voss's murder threatened to expose the very secrets she had worked so hard to conceal. Sylvia was known for her charisma and leadership, but she felt the walls closing in on her, each inquiry a reminder of the precariousness of her position.",
      "While she projected an image of confidence, the reality was far more complicated. Sylvia's public persona was that of a tireless leader, yet behind closed doors, she faced mounting pressure to save her family's legacy. The stakes were high; Eleanor's revelations could lead to the financial ruin of the hotel, a fate Sylvia could not bear to contemplate. As she navigated the intricate web of lies and truths, she felt the burden of her choices pressing down on her.",
      "Sylvia's speech was marked by an elegant authority, yet there was a sharpness to her words that could cut. 'Business is a matter of survival, dear,' she would say, a polite façade masking the intensity of her resolve. Beneath her genteel exterior lay a fierce determination to protect what was rightfully hers, even if it meant crossing moral boundaries. The thought of being implicated in Eleanor's death was almost a relief; it would provide a distraction from the financial chaos that threatened to engulf her.",
      "As the investigation unfolded, Sylvia found herself grappling with the ethical dilemmas of her actions. Could she continue to hide her family's financial troubles while seeking justice for Eleanor? The line between survival and morality blurred, and with each passing moment, she felt the pull of desperation. In the end, Sylvia would have to confront not only the truth behind Eleanor's murder but also the truth of her own choices and the legacy she wished to leave behind."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, an eccentric millionaire, is consumed by a vendetta against Eleanor Voss, believing that her downfall would serve as justice for past grievances against his family.",
    "publicPersona": "Eccentric millionaire with a fondness for theatrics.",
    "privateSecret": "Has a vendetta against Eleanor over a long-ago incident involving his family.",
    "motiveSeed": "Believes that Eleanor's downfall would be justice for past grievances.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claims to have been in his suite watching the waves but has no witnesses.",
    "accessPlausibility": "easy",
    "stakes": "His family's honor and legacy matter to him above all.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Hugo spoke with a theatrical flair, his sentences punctuated by grand gestures and exaggerated expressions. He had a penchant for hyperbole, often making his points with a bluntness that left little room for interpretation.",
    "signatureTic": "Justice must be served, don't you think?",
    "internalConflict": "Hugo struggles with his obsession for revenge, questioning whether it will truly bring him peace.",
    "personalStakeInCase": "Eleanor's murder represents a chance to reclaim his family's honor, but Hugo must confront the consequences of his vendetta.",
    "paragraphs": [
      "Hugo Vane lounged in his suite, the waves crashing against the shore a mere backdrop to the tempest brewing within him. An eccentric millionaire with a flair for the dramatic, he had always been drawn to the theatrics of life, yet nothing compared to the drama unfolding with Eleanor Voss's murder. To him, it was not merely a crime; it was a chance for justice—a reckoning for the grievances his family had suffered at Eleanor's hands.",
      "His public persona was one of flamboyance, a man who reveled in the attention of the elite. Yet behind the curtain of his extravagance lay a bitter truth: he harbored a vendetta that consumed him. The stakes were personal; Eleanor's downfall was not just about revenge, it was about restoring his family's honor. 'Justice must be served, don't you think?' he would declare, his tone blunt and unyielding, as if the answer were already written in the stars.",
      "Hugo's alibi was flimsy at best; he claimed to have been in his suite, gazing out at the waves, yet with no witnesses to corroborate his story, suspicion loomed large. The ease with which he could access the hotel only intensified the scrutiny surrounding him. As the investigation unfolded, he felt the weight of his obsession pressing down on him, a relentless tide that threatened to drown him in his own desires.",
      "As he navigated the murky waters of the investigation, Hugo found himself questioning the very nature of justice. Would avenging his family's grievances truly bring him peace, or would it only deepen the chasm of his own discontent? In the end, he would have to confront not only the truth behind Eleanor's murder but also the truth of his own motivations and the legacy he wished to leave behind."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seabreeze Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel with Art Deco elegance, set against the tumultuous backdrop of post-war uncertainty.",
    "visualDescription": "The Seabreeze Hotel features gleaming chrome accents and geometric motifs, with expansive windows offering sweeping views of the churning sea. The lobby showcases a grand staircase, polished marble floors, and plush seating areas adorned with vibrant textiles. Guest rooms vary in luxury, from modest accommodations with vintage furnishings to opulent suites draped in silk and satin, each with its own view of the turbulent ocean.",
    "atmosphere": "A blend of glamour and unease, reflecting the contrast between the hotel's elegance and the shadows of war lingering in the air.",
    "paragraphs": [
      "The Seabreeze Hotel rises majestically along the Brighton coastline, its Art Deco architecture gleaming against the slate-grey sky. Large windows frame the tumultuous sea, where waves crash against the rocky shore, sending sprays of saltwater into the air. Inside, the lobby hums with the low murmur of conversation, punctuated by the occasional clink of silverware from the dining room. Yet, an undercurrent of tension weaves through the atmosphere, as guests whisper about recent events, casting furtive glances at one another, each hiding secrets behind polite smiles.",
      "Visitors of every sort fill the hotel, from weary travelers seeking respite to those drawn by the allure of a vibrant social scene. The dining areas boast panoramic views, where patrons sip tea while watching the stormy ocean churn. The scent of fresh seafood mingles with the briny air, creating an intoxicating blend that both entices and unsettles. Despite the hotel’s opulence, there is an oppressive weight in the air, a reminder of the war's toll and the societal changes it has wrought, as women now occupy roles once reserved for men, adding complexity to their interactions.",
      "As evening descends, the hotel's ambiance shifts; shadows deepen, and the flickering light from gas lamps casts an otherworldly glow over the lobby. Guests retreat to their rooms, some to rest, while others remain restless, drawn to the bar's dim light and the soft strains of a radio playing the latest wartime ballads. Outside, the sound of distant thunder mirrors the growing tension within the hotel's walls, hinting at the storm brewing not just in the skies but in the lives of those who seek refuge within."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of coastal climates, affecting visibility and outdoor activities.",
    "timeFlow": "Days filled with mounting suspense and whispered secrets.",
    "mood": "Tense and suspenseful, influenced by wartime trauma and the uncertainty of post-war life.",
    "eraMarkers": [
      "Ubiquitous radios playing nostalgic tunes",
      "Art Deco furnishings reflecting the pre-war elegance",
      "Men in suits, women in floral dresses",
      "Rationed supplies in dining menus"
    ],
    "sensoryPalette": {
      "dominant": "A crisp, salty breeze from the ocean",
      "secondary": [
        "The warmth of polished wood and leather",
        "The lingering scent of fresh seafood"
      ]
    },
    "paragraphs": [
      "The atmosphere at The Seabreeze Hotel is a complex tapestry woven from the threads of history, each guest a character in a larger narrative of survival and adaptation. The hotel's architecture, with its sweeping curves and bold lines, reflects a bygone era of confidence now shadowed by uncertainty. The air is thick with the scent of salt and sea, mingling with the faint notes of perfume and cologne, creating an intoxicating blend that both entices and unsettles.",
      "As the rain drizzles against the windows, a signature of Brighton's coastal climate, the hotel feels both a sanctuary and a prison. Guests seek solace in the familiar comforts of the lobby and dining areas, yet the weight of their pasts hangs heavily upon them. The radio crackles with voices of the outside world, carrying news that feels distant yet ever-present, reminding everyone that the chaos of war still echoes in their lives, even amidst the elegance of the hotel."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious area with Art Deco design, marble floors, and a grand chandelier casting a warm glow over plush seating.",
      "sensoryDetails": {
        "sights": [
          "gleaming mosaic floor",
          "ornate glass chandelier",
          "elegantly dressed guests",
          "large ocean-view windows",
          "framed vintage photographs"
        ],
        "sounds": [
          "murmurs of conversation",
          "clinking of glasses",
          "distant radio music",
          "footsteps on marble",
          "the rustle of silk"
        ],
        "smells": [
          "freshly brewed coffee",
          "blooming jasmine from vases",
          "polished wood and leather",
          "the briny scent of the sea",
          "citrus from cocktails"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft velvet upholstery",
          "chilly ocean breeze from open windows",
          "warmth from the fireplace",
          "cool metal of the chandelier chain"
        ]
      },
      "accessControl": "Guests can access the lobby freely; staff-only areas are restricted and require special permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "wet marble glistening"
          ],
          "sounds": [
            "raindrops tapping on windows",
            "soft laughter",
            "rustling newspaper pages",
            "distant thunder",
            "the hum of the heater"
          ],
          "smells": [
            "damp earth from the rain",
            "fresh pastries from the kitchen",
            "scent of wet wool",
            "mildew from the old books",
            "the lingering aroma of coffee"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light flooding the space",
            "dark clouds looming outside",
            "patrons huddled in small groups"
          ],
          "sounds": [
            "quiet conversations",
            "the ticking of a clock",
            "occasional laughter",
            "the rustle of cloth",
            "the faint sound of waves"
          ],
          "smells": [
            "beeswax from polished surfaces",
            "the earthy scent of tea",
            "smoky hints of cigars",
            "dust from old books",
            "the scent of wet grass"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm candlelight flickering",
            "glimmers of stars through windows"
          ],
          "sounds": [
            "soft jazz playing from the radio",
            "clinking of ice in glasses",
            "quiet chatter",
            "the crackle of the fireplace",
            "the distant sound of the sea"
          ],
          "smells": [
            "the rich scent of aged whiskey",
            "warmth of baked goods",
            "the fresh scent of linens",
            "a hint of tobacco",
            "the fragrance of night-blooming flowers"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Seabreeze Hotel is an opulent yet welcoming space, where guests gather to exchange pleasantries or plot their next moves. Polished marble floors stretch beneath the feet of elegantly dressed patrons, the sound of footsteps echoing against the high ceilings adorned with intricate Art Deco patterns. A massive chandelier dangles overhead, its glass prisms catching the light in a dazzling display, creating a warm ambiance that contrasts sharply with the chill of the coastal winds.",
        "As visitors enter, they are greeted by the intoxicating aroma of freshly brewed coffee and pastries wafting from the adjacent dining area, mingling with the saltiness of the sea air. Plush velvet seating invites guests to linger, while large windows frame sweeping views of the turbulent ocean beyond, serving as a constant reminder of the stormy weather that often envelops Brighton. The mood shifts with the time of day, each moment bringing a new layer of complexity to the conversations that unfold within its walls."
      ]
    },
    {
      "id": "dining_area",
      "name": "Ocean View Dining Room",
      "type": "interior",
      "purpose": "Dining space",
      "visualDetails": "A large room with panoramic windows overlooking the sea, elegantly set tables with fine china and cutlery.",
      "sensoryDetails": {
        "sights": [
          "panoramic ocean views",
          "elegant table settings",
          "crystal glassware sparkling",
          "waiters in crisp uniforms",
          "floral centerpieces"
        ],
        "sounds": [
          "clinking of cutlery",
          "murmurs of conversation",
          "waves crashing outside",
          "soft piano music",
          "the rustle of menus"
        ],
        "smells": [
          "roasted meats and fresh seafood",
          "baking bread",
          "herbs and spices",
          "the scent of polished furniture",
          "sweet desserts"
        ],
        "tactile": [
          "smooth tablecloths",
          "cool glass of water",
          "warmth from nearby dishes",
          "the weight of silver cutlery",
          "firm upholstery of chairs"
        ]
      },
      "accessControl": "Guests dine during meal hours; staff restrict access during cleaning times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light through rainy windows",
            "water droplets sliding down glass",
            "faint reflections of guests"
          ],
          "sounds": [
            "soft patter of rain",
            "clinking dishes",
            "the low murmur of conversations",
            "the sizzling of breakfast",
            "the distant sound of thunder"
          ],
          "smells": [
            "freshly brewed coffee",
            "the scent of eggs cooking",
            "damp sea air",
            "toasted bread",
            "the aroma of citrus"
          ],
          "mood": "cozy warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light spilling into the room",
            "guests wrapped in conversation",
            "the ocean matching the sky's hue"
          ],
          "sounds": [
            "soft piano playing",
            "the gentle rustle of linens",
            "the sound of waves crashing",
            "quiet laughter",
            "the clinking of glasses"
          ],
          "smells": [
            "scent of fresh seafood",
            "the aroma of rich sauces",
            "the sweetness of pastries",
            "the tangy scent of salads",
            "the mustiness of old books"
          ],
          "mood": "reflective solitude"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelit tables casting flickering shadows",
            "the sun setting over the ocean",
            "guests toasting with wine glasses"
          ],
          "sounds": [
            "the crackle of candles",
            "soft murmurs of intimacy",
            "the soundtrack of the sea",
            "distant laughter",
            "the clinking of ice in glasses"
          ],
          "smells": [
            "the rich aroma of wine",
            "the scent of grilled meats",
            "the sweetness of desserts",
            "the fragrance of fresh flowers",
            "the scent of sea salt"
          ],
          "mood": "romantic tension"
        }
      ],
      "paragraphs": [
        "The Ocean View Dining Room is a breathtaking haven where the sights and sounds of the seaside meld with the elegance of fine dining. Guests are seated at tables adorned with crisp white linens, gleaming silverware, and delicate china, each setting offering a view of the tumultuous sea beyond. The room buzzes with the laughter and chatter of patrons, punctuated by the soft melodies of the piano, creating an atmosphere that is both sophisticated and inviting.",
        "As meals are served, the savory scents of roasted meats and grilled fish waft through the air, mingling with the freshness of sea breezes that occasionally break through the windows. The experience is doubly heightened as the weather often reflects the moods of those dining; on stormy days, the intimate ambiance draws couples closer, while sunny afternoons invite lively conversations and animated toasts. Each meal becomes a tapestry of flavors and emotions, with the ocean as a constant backdrop, both calming and chaotic."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "Luxury Guest Rooms",
      "type": "interior",
      "purpose": "Accommodation for guests",
      "visualDetails": "Tastefully decorated rooms with plush furnishings, ocean views, and luxurious amenities.",
      "sensoryDetails": {
        "sights": [
          "elegantly draped windows",
          "ornate mirrors reflecting light",
          "delicate floral arrangements",
          "well-stocked writing desks",
          "sumptuous bedding"
        ],
        "sounds": [
          "the soft whoosh of the sea",
          "muffled conversations from the hallway",
          "distant laughter",
          "the rustling of curtains",
          "the ticking of a clock"
        ],
        "smells": [
          "fresh linens and cotton",
          "the scent of lavender",
          "sea air wafting in",
          "the aroma of polished wood",
          "the faint hints of perfume"
        ],
        "tactile": [
          "soft, plush carpets underfoot",
          "cool silk sheets",
          "the weight of a heavy duvet",
          "smooth wooden furniture",
          "the chill of the ocean breeze through an open window"
        ]
      },
      "accessControl": "Guests access their rooms with provided keys; staff can enter during scheduled cleaning hours only.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light seeping through curtains",
            "raindrops on window panes",
            "puddles forming on the balcony"
          ],
          "sounds": [
            "the steady rhythm of rain",
            "the soft sound of waves crashing",
            "the rustling of sheets",
            "the faint drip of water",
            "the distant sound of thunder"
          ],
          "smells": [
            "the refreshing scent of rain",
            "the aroma of wet earth",
            "the faint hint of damp wood",
            "the fragrance of fresh flowers",
            "the scent of brewed tea"
          ],
          "mood": "introspective tranquility"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "cloudy skies reflected in the window",
            "shadows dancing on the walls",
            "books scattered across a desk"
          ],
          "sounds": [
            "the low murmur of voices from below",
            "the sound of a clock ticking",
            "the gentle rustle of paper",
            "the distant crashing of waves",
            "the creaking of floorboards"
          ],
          "smells": [
            "the freshness of open windows",
            "the scent of old books",
            "the aroma of coffee brewing",
            "the lingering scent of perfume",
            "the mustiness of the room"
          ],
          "mood": "restless solitude"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden hues of sunset through the window",
            "flickering candle flames",
            "shadowy figures moving outside"
          ],
          "sounds": [
            "the distant laughter from the bar",
            "the soft sound of waves",
            "the rustling of sheets",
            "the ticking of a clock",
            "the gentle creak of the bedframe"
          ],
          "smells": [
            "the sweet scent of flowers",
            "the aroma of candle wax",
            "the freshness of a sea breeze",
            "the faint scent of tobacco",
            "the warmth of wood"
          ],
          "mood": "romantic intrigue"
        }
      ],
      "paragraphs": [
        "The Luxury Guest Rooms at The Seabreeze Hotel offer an inviting retreat for travelers seeking comfort and elegance. Each room is meticulously designed, adorned with plush furnishings and tasteful decor that reflects the era’s opulence. Large windows provide spectacular views of the churning sea, where guests can watch the waves crash against the shore, creating a mesmerizing backdrop for their stay.",
        "Inside, the atmosphere is tranquil yet charged with unspoken tensions. The soft sounds of the ocean intermingle with the gentle rustle of sheets and the ticking of clocks, creating a soothing soundscape that belies the storm brewing outside. The scent of fresh linens mingling with the salt air creates an intoxicating environment, inviting guests to linger in their rooms, lost in thought or entangled in whispered conversations, as secrets unfold amidst the elegant surroundings."
      ]
    },
    {
      "id": "staff_area",
      "name": "Staff-Only Service Corridor",
      "type": "transitional",
      "purpose": "Service access for hotel staff",
      "visualDetails": "A narrow, dimly lit corridor lined with service doors, leading to storage areas and staff facilities.",
      "sensoryDetails": {
        "sights": [
          "flickering fluorescent lights",
          "stacks of cleaning supplies",
          "sparse decorations",
          "shadows lingering in corners",
          "metal service carts"
        ],
        "sounds": [
          "muffled voices from guest areas",
          "the creaking of floorboards",
          "the clatter of carts",
          "doors opening and closing",
          "faint humming of machinery"
        ],
        "smells": [
          "cleaning products and polish",
          "dampness from the sea air",
          "the mustiness of storage",
          "the scent of old linens",
          "the faint aroma of food"
        ],
        "tactile": [
          "cool concrete flooring",
          "rough edges of service carts",
          "smooth metal doorknobs",
          "the chill of the air conditioning",
          "the weight of cleaning supplies"
        ]
      },
      "accessControl": "Restrict access to staff only; guest entry is strictly prohibited.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water pooling in corners",
            "foggy windows",
            "dim light filtering through"
          ],
          "sounds": [
            "the sound of rain on the roof",
            "the shuffling of feet",
            "the rustle of uniforms",
            "the clinking of metal"
          ],
          "smells": [
            "the scent of wet earth",
            "cleaning product fumes",
            "the stale odor of old linens",
            "the aroma of fresh coffee",
            "the dampness of the air"
          ],
          "mood": "hushed urgency"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dust motes dancing in the air",
            "the glow of a single bulb"
          ],
          "sounds": [
            "the buzz of fluorescent lights",
            "the distant chatter of guests",
            "the clatter of dishes",
            "the sound of footsteps echoing",
            "the creak of the old building"
          ],
          "smells": [
            "the scent of cleaning agents",
            "the mustiness of old supplies",
            "the aroma of food wafting from the kitchen",
            "the freshness of linens",
            "the faint smell of mildew"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the soft glow of lamps",
            "half-open doors leading to dark rooms",
            "shadows moving quickly"
          ],
          "sounds": [
            "the rustle of uniforms",
            "the sound of distant conversations",
            "the clatter of equipment",
            "the faint hum of air conditioning",
            "the echo of footsteps"
          ],
          "smells": [
            "the scent of polished wood",
            "the aroma of dinner service",
            "the freshness of linens",
            "the lingering scent of cleaning products",
            "the mustiness of storage"
          ],
          "mood": "suspenseful secrecy"
        }
      ],
      "paragraphs": [
        "The Staff-Only Service Corridor is a hidden artery of The Seabreeze Hotel, a narrow passage lined with service doors and dimly lit by flickering fluorescent lights. Here, the hustle and bustle of hotel operations take place away from the eyes of guests, where staff navigate the tight space with practiced efficiency. Metal carts laden with cleaning supplies and linens are often stacked against the walls, creating a sense of organized chaos that belies the luxury visible just beyond the corridor's entrance.",
        "This hidden space is filled with the sounds of muffled conversations and the clatter of carts, while the sharp scents of cleaning agents and damp linens permeate the air. The corridor feels both utilitarian and secretive; it serves as a threshold between the grand hotel experience and the unseen labor that sustains it. The access is strictly controlled, with guests forbidden from entering, enhancing the sense of mystery surrounding the lives of those who work tirelessly behind the scenes."
      ]
    }
  ],
  "note": "",
  "cost": 0.007326061049999999,
  "durationMs": 73417
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1947,
    "month": "June",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "overcast skies with intermittent rain showers",
      "cool breezes from the nearby coastline",
      "temperatures hovering around 60-70°F"
    ],
    "daylight": "Long summer days with twilight extending into the evening, though visibility is often muted by cloud cover.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, with the sound of raindrops against the hotel windows creating an eerie atmosphere.",
    "holidays": [
      "Father's Day (June 15)"
    ],
    "seasonalActivities": [
      "visiting seaside piers and enjoying fish and chips",
      "attending local fairs with carnival games",
      "participating in summer evening dances at community halls"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suits in light fabrics",
        "crisp white dress shirts with wide collars",
        "fedora hats in muted tones"
      ],
      "casual": [
        "lightweight khaki trousers paired with short-sleeve button-up shirts",
        "sherbet-colored polo shirts",
        "canvas loafers or deck shoes"
      ],
      "accessories": [
        "silk ties with playful patterns",
        "wristwatches with leather straps",
        "cufflinks with understated designs"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with floral prints",
        "fitted jackets with padded shoulders",
        "wide-brimmed hats adorned with ribbons"
      ],
      "casual": [
        "sundresses made of cotton in pastel shades",
        "capri pants paired with fitted blouses",
        "comfortable espadrilles for summer outings"
      ],
      "accessories": [
        "string pearls or simple gold chains",
        "colorful silk scarves tied at the neck",
        "stylish handbags with structured silhouettes"
      ]
    },
    "trendsOfTheMoment": [
      "increased popularity of A-line silhouettes for women",
      "broadening acceptance of bold colors and patterns in menswear",
      "the rise of leisure suits for casual wear"
    ],
    "socialExpectations": [
      "men expected to be the breadwinners, while women increasingly take on professional roles",
      "social events often segregated by class, with a focus on propriety and decorum",
      "family-oriented gatherings becoming more common post-war"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the Marshall Plan is underway, aiding European recovery",
      "growing tensions between the United States and the Soviet Union, marking the height of the Cold War",
      "the first nuclear test by the United States in the Pacific, raising fears of global conflict"
    ],
    "politicalClimate": "A world still reeling from the fallout of World War II with increasing paranoia about communism and the spread of Soviet influence.",
    "economicConditions": "Mixed economic recovery in the U.S., with some industries booming while others lag behind; inflation begins to rise.",
    "socialIssues": [
      "racial segregation and civil rights movements gaining traction in the U.S.",
      "debates over women's roles in society as more women enter the workforce",
      "displacement of returning soldiers and their reintegration challenges"
    ],
    "internationalNews": [
      "the establishment of the United Nations and its efforts for global peace",
      "the partition of India leading to widespread violence and migration",
      "the emergence of Israel as a nation, causing geopolitical unrest"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's crooning hits",
        "the upbeat rhythms of big band music",
        "Ella Fitzgerald's jazz standards"
      ],
      "films": [
        "It's a Wonderful Life",
        "Gentleman's Agreement",
        "The Best Years of Our Lives"
      ],
      "theater": [
        "The Glass Menagerie by Tennessee Williams",
        "Death of a Salesman by Arthur Miller",
        "Annie Get Your Gun"
      ],
      "radio": [
        "The Jack Benny Program",
        "Suspense, a popular mystery anthology",
        "The Shadow"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Catcher in the Rye by J.D. Salinger",
        "The Fountainhead by Ayn Rand",
        "The Old Man and the Sea by Ernest Hemingway"
      ],
      "popularGenres": [
        "detective fiction",
        "post-war literature exploring trauma and identity",
        "romantic novels reflecting changing societal norms"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercially available microwave oven",
        "advancements in radar technology for civilian use",
        "the introduction of the first transistor aiding in radio technology"
      ],
      "commonDevices": [
        "tabletop radios becoming a staple in households",
        "early television sets featuring limited programming",
        "typewriters and carbon paper for business and personal use"
      ],
      "emergingTrends": [
        "growing interest in consumer electronics",
        "the beginning of the baby boom generation",
        "rise of suburban living and car ownership"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Pint of milk: five pence"
      ],
      "commonActivities": [
        "family picnics at local parks",
        "visiting the seaside for leisure and relaxation",
        "attending community events and dances"
      ],
      "socialRituals": [
        "family Sunday dinners, often including roast meat and seasonal vegetables",
        "neighborhood barbecues during warm evenings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "pervasive respect for upper-class lifestyles, though the middle class is expanding",
      "increased scrutiny of class distinctions and calls for equality",
      "an emerging sense of solidarity among working-class communities"
    ],
    "gender": [
      "traditional gender roles still in place, but women increasingly pushing boundaries",
      "growing acceptance of women in professional roles, yet societal expectations remain",
      "debates around women's rights gaining momentum"
    ],
    "race": [
      "racial segregation remains entrenched in many parts of the U.S.",
      "emerging awareness and activism for civil rights among minority groups",
      "persistent stereotypes and discrimination affecting daily life"
    ],
    "generalNorms": [
      "emphasis on family values and community involvement",
      "growing individualism post-war, with a focus on personal success",
      "increasingly liberal attitudes towards social behaviors"
    ]
  },
  "atmosphericDetails": [
    "The scent of saltwater mingled with the earthy aroma of rain-soaked pavement fills the air.",
    "The sound of distant thunder rolls as hotel guests shuffle through dimly lit corridors, whispers of uncertainty hanging in the atmosphere.",
    "Flickering shadows cast by the golden glow of table lamps create a sense of unease, contrasting with the vibrant summer colors of the season."
  ],
  "paragraphs": [
    "In June 1947, the coastal town feels the weight of its post-war existence, where the weather matches the mood: overcast skies and rain showers casting a pall over the summer festivities. The long twilight hours, typically filled with the laughter of children playing outside and families gathering for picnics, are instead punctuated by the melancholy sounds of raindrops against hotel windows. The scent of saltwater, mingling with the damp earth, fills the air as guests navigate the hotel’s dimly lit corridors, all too aware of the tensions brewing just beyond the horizon.",
    "Fashion in this summer of 1947 reflects a society in transition. Men don lightweight double-breasted suits in muted shades, often topped with a stylish fedora, while women opt for tea-length dresses adorned with floral patterns, their outfits complemented by wide-brimmed hats. The emerging A-line silhouette symbolizes a return to femininity after the war, while the acceptance of bold colors signifies a new era of expression and personal style. Accessories, from silk ties to pearl necklaces, add a touch of elegance to everyday attire, even amidst the uncertainty of the times.",
    "Daily life is a mix of routine and ritual, with families gathering for Sunday dinners and neighborhood barbecues, where the aroma of grilled meats mingles with laughter and chatter. The prices reflect a modest economy: a loaf of bread costs four pence, while a pint of milk is five pence. As radio shows like 'The Jack Benny Program' entertain listeners, the cultural landscape is dotted with local fairs and seaside visits, yet there is an underlying current of tension regarding social issues, from civil rights to the roles of women in a changing workforce. It is a summer of contrasts, where the vibrancy of life continues to emerge against a backdrop of uncertainty."
  ],
  "note": "",
  "cost": 0.00128459925,
  "durationMs": 21892
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of guests and staff at a grand seaside hotel confront the tensions of post-war life while a mysterious drowning incident stirs suspicions and hidden motives among them.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII has reshaped family dynamics, with women increasingly in the workforce and societal pressures mounting amid Cold War anxieties."
  },
  "setting": {
    "location": "A grand seaside hotel with Art Deco architecture",
    "institution": "hotel",
    "weather": "Overcast with occasional rain, typical of coastal climates"
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
    "id": "high_tide_time",
    "value": "ten minutes past eleven",
    "description": "The time when the tide was believed to be at its highest."
  },
  {
    "id": "water_level_difference",
    "value": "two feet",
    "description": "The manipulated height difference of the water at the crime scene."
  },
  {
    "id": "pipe_length",
    "value": "thirty yards",
    "description": "The length of the drainage pipe that redirected water."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 3,
    "mid": 16,
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
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "spatial"
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
      "category": "behavioral"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_early_2",
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
      "id": "clue_mid_2",
      "placement": "mid",
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
      "id": "clue_parity_bridge",
      "placement": "early",
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
