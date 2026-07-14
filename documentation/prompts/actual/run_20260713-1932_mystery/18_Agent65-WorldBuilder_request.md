# Actual Prompt Record

- Run ID: `mystery-1783971161277`
- Project ID: ``
- Timestamp: `2026-07-13T19:38:08.406Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `c385a85479fca774`

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
    "title": "The Delayed Deception",
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
      "subtype": "delayed-action poison"
    }
  },
  "death_method": "poisoned with a botanical toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "friend of the victim"
      ],
      "public_persona": "Intelligent and observant",
      "private_secret": "Struggles with self-doubt",
      "motive_seed": "Desire to uncover the truth",
      "motive_strength": "strong",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel staff",
        "guest interactions"
      ],
      "behavioral_tells": [
        "calm under pressure"
      ],
      "stakes": "Solve the murder",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "doctor",
      "relationships": [
        "acquaintance of the victim"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Has a gambling problem",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "Evening of the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "medical supplies",
        "hotel kitchen"
      ],
      "behavioral_tells": [
        "nervous around questions about the victim"
      ],
      "stakes": "Reputation and freedom",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "military officer",
      "relationships": [
        "former colleague of the victim"
      ],
      "public_persona": "Commanding and authoritative",
      "private_secret": "Haunted by wartime decisions",
      "motive_seed": "Unresolved past conflict",
      "motive_strength": "moderate",
      "alibi_window": "Dinner time",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel dining room"
      ],
      "behavioral_tells": [
        "agitated when discussing the victim"
      ],
      "stakes": "Honor and redemption",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "hotel staff",
      "relationships": [
        "friend of the victim"
      ],
      "public_persona": "Cheerful and helpful",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Jealousy",
      "motive_strength": "weak",
      "alibi_window": "Evening of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel kitchen",
        "guest rooms"
      ],
      "behavioral_tells": [
        "overly eager to help"
      ],
      "stakes": "Love and loyalty",
      "evidence_sensitivity": [
        "low"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "friend of Eleanor Voss"
      ],
      "public_persona": "Charming and sociable",
      "private_secret": "Had a secret affair",
      "motive_seed": "N/A",
      "motive_strength": "N/A",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "rival",
      "relationships": [
        "business competitor of the victim"
      ],
      "public_persona": "Cunning and ambitious",
      "private_secret": "Involved in shady dealings",
      "motive_seed": "Rivalry and envy",
      "motive_strength": "strong",
      "alibi_window": "Dinner time",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel dining room",
        "kitchen"
      ],
      "behavioral_tells": [
        "defensive when questioned"
      ],
      "stakes": "Wealth and reputation",
      "evidence_sensitivity": [
        "high"
      ],
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
      "summary": "In a foggy seaside hotel, a vibrant guest, Sylvia Trent, dies mysteriously after a celebratory dinner. As Eleanor Voss investigates, she uncovers a cunning plot involving delayed-action poison, leading to shocking revelations about jealousy and rivalry."
    },
    "accepted_facts": [
      "Sylvia Trent was found dead in her room shortly after dinner.",
      "Guests reported seeing her drink from a glass during the meal.",
      "Eleanor Voss is determined to solve the mystery."
    ],
    "inferred_conclusions": [
      "The cause of death was not natural.",
      "The murder involved premeditated planning."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A slow-acting poison was administered via a drink, taking effect after the victim consumed a specific dish.",
      "delivery_path": [
        {
          "step": "Poison was mixed in the drink served to Sylvia."
        },
        {
          "step": "The specific dish consumed two hours later triggered the lethality."
        }
      ]
    },
    "outcome": {
      "result": "Sylvia died from the poison after eating a specific dish."
    }
  },
  "false_assumption": {
    "statement": "Sylvia must have ingested the poison shortly before her death.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses saw her drinking during dinner, leading to the assumption that her death was immediate.",
    "what_it_hides": "The poison was designed to take effect hours later, obscuring the true timeline of events."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch was present during the dinner and had access to medical supplies.",
      "Witnesses reported seeing him act nervously when questioned."
    ],
    "the_one_flaw": "Dr. Finch was actively treating another guest in a different part of the hotel when Sylvia died.",
    "refuted_in_chapter": 5
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A missing bottle of herbal tincture found in the kitchen.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The tincture was for a legitimate medical purpose and had no connection to the murder.",
      "resolved_in_chapter": 4
    },
    {
      "id": "red_herring_2",
      "description": "A guest claims to have seen Hugo Vane arguing with Sylvia earlier in the evening.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The argument was over a trivial matter unrelated to her death.",
      "resolved_in_chapter": 5
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
    "rationale": "All suspects were present at the hotel and had interactions with the victim."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner time",
        "Time of death"
      ],
      "windows": [
        "Two-hour window post-dinner"
      ],
      "contradictions": [
        "Witnesses claim Sylvia was healthy during dinner.",
        "Medical records show no sign of prior health issues."
      ]
    },
    "access": {
      "actors": [
        "Hugo Vane",
        "Dr. Mallory Finch"
      ],
      "objects": [
        "Poison bottle",
        "Tincture"
      ],
      "permissions": [
        "Access to kitchen",
        "Medical supplies"
      ]
    },
    "physical": {
      "laws": [
        "Poison takes time to show effects"
      ],
      "traces": [
        "Glass with residue of the poison"
      ]
    },
    "social": {
      "trust_channels": [
        "Friendship among guests",
        "Professional respect"
      ],
      "authority_sources": [
        "Doctor's orders",
        "Hotel management"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses reported seeing Sylvia drink from her glass right before dinner.",
        "correction": "This suggests the poison was not ingested immediately before death, but could have been in her drink.",
        "effect": "Narrows the timeline for when the poison could have been administered.",
        "required_evidence": [
          "Witness statements about the dinner timeline",
          "Glass with residues found in the room"
        ],
        "reader_observable": true
      },
      {
        "observation": "The timing of Sylvia's symptoms aligns with the second course of dinner.",
        "correction": "This indicates that the poisoning occurred earlier, allowing time for the poison to take effect.",
        "effect": "Eliminates the assumption that she was poisoned just before death.",
        "required_evidence": [
          "Dinner menu with the second course timing",
          "Witness accounts of her condition post-dinner"
        ],
        "reader_observable": true
      },
      {
        "observation": "The herbal tincture found in the kitchen was identified as harmless.",
        "correction": "This rules out the tincture as a source of the poison.",
        "effect": "Eliminates Dr. Mallory Finch as a suspect, as he had no means to poison Sylvia.",
        "required_evidence": [
          "Tincture analysis report",
          "Kitchen inventory records"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares dinner, witness, and report against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are poison, witness, and report.",
    "pass_condition": "If anyone shows symptoms after consuming the dish, they are implicated.",
    "evidence_clues": [
      "clue_9",
      "clue_culprit_direct_1",
      "clue_1",
      "clue_culprit_direct_hugo_vane"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements and glass residue clarify the drinking timeline. Step 2: Symptoms aligning with the second course suggest earlier poisoning. Step 3: Tincture analysis eliminates Dr. Finch."
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
        "clearance_method": "Tincture analysis clears him",
        "supporting_clues": [
          "clue_early_1",
          "clue_mid_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed during dinner service",
        "supporting_clues": [
          "clue_mid_1",
          "clue_late_1"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No motive found for conflict",
        "supporting_clues": [
          "clue_mid_2",
          "clue_late_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
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
        "clue_id": "clue_1",
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
        "clue_id": "clue_culprit_direct_hugo_vane",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Medical report analysis"
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
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
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
    "summary": "Eleanor Voss, a local artist, finds herself entangled in a murder mystery that threatens to expose her deepest financial woes.",
    "publicPersona": "Eleanor is a radiant presence at the seaside hotel, captivating guests with her vivid coastal landscapes and charming conversations. Her laughter echoes through the halls as she mingles effortlessly with patrons, her artistic passion shining through her every word.",
    "privateSecret": "Beneath her charming exterior lies a harrowing truth: Eleanor is drowning in debt from failed art shows, a fact that gnaws at her spirit. The weight of financial instability feels like a noose tightening around her neck, and the victim's blackmail regarding her financial troubles adds to her desperation.",
    "motiveSeed": "The blackmail cuts deep, as the victim knew of Eleanor's financial struggles and used that knowledge to manipulate her. The fear of exposure looms large, intertwining Eleanor's artistic aspirations with her darkest secrets.",
    "motiveStrength": "compelling",
    "alibiWindow": "Eleanor is in the hotel lobby from 8 PM to 10 PM, a period during which multiple guests can vouch for her presence.",
    "accessPlausibility": "With easy access to the hotel and its many nooks and crannies, Eleanor's ability to slip away unnoticed is not in question.",
    "stakes": "If the case remains unsolved, Eleanor risks being implicated in the murder, a fate that would shatter her already fragile world and extinguish her hopes of artistic redemption.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her observations with a wry smile. She has a penchant for metaphor, often relating her thoughts to the art she creates, and occasionally indulges in self-deprecating humor about her financial situation.",
    "signatureTic": "\"Art is meant to provoke, but I seem to provoke debt instead.\"",
    "internalConflict": "Caught between her artistic ambitions and the crushing weight of her debts, Eleanor grapples with feelings of inadequacy. The fear of being trapped in a life of mediocrity fuels her drive to solve the mystery, but it also leaves her questioning her own worth.",
    "personalStakeInCase": "The murder investigation is not just a distraction; it is a lifeline. Eleanor’s financial troubles mean that solving this case could redeem her reputation, allowing her to escape the suffocating grip of debt.",
    "paragraphs": [
      "Eleanor Voss is a woman of contrasts, embodying both the vibrant brushstrokes of her art and the shadowy depths of her financial despair. At the seaside hotel, she is known for her captivating landscapes, each canvas a window into her soul. Yet, behind the charming smile lies a tumultuous reality, one defined by mounting debts and the noose of blackmail that threatens to ensnare her.",
      "On the surface, Eleanor's life appears idyllic, filled with laughter and the camaraderie of hotel patrons. But as she swirls her paintbrush, she cannot escape the haunting knowledge that the victim held the key to her financial ruin. The very art that brings her joy has become a double-edged sword, exposing her vulnerabilities to the world. The blackmail, a cruel twist of fate, forces Eleanor to confront her fears head-on.",
      "As the investigation unfolds, Eleanor feels the weight of desperation pressing down on her. If she cannot unravel the mystery, she risks being implicated in the murder, a fate that would seal her artistic ambitions in a coffin of shame. The stakes are high, and the pressure mounts as she navigates the treacherous waters of deception and betrayal, determined to prove her worth.",
      "In the quiet moments, Eleanor reflects on her past failures and the ghosts that haunt her artistry. Each stroke of her brush becomes a cathartic release, a way to channel her fears into something tangible. Yet, as the investigation deepens, she realizes that she must confront not only the mystery at hand but also the insecurities that have plagued her for far too long. Will she emerge from the shadows of her debts, or will the weight of her secrets drown her ambitions?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, finds her carefully crafted reputation threatened by a secret affair that intertwines her fate with that of the victim.",
    "publicPersona": "With an air of sophistication and a commitment to her patients, Dr. Mallory Finch is a pillar of the community. Her charitable endeavors and polished demeanor earn her the respect of many, as she navigates social engagements with grace and poise.",
    "privateSecret": "However, behind the façade lies a tumultuous secret: Mallory had a passionate affair with the victim. The guilt of her betrayal weighs heavily on her, and the threat of exposure could shatter her marriage and tarnish her reputation.",
    "motiveSeed": "The fear of being publicly humiliated and losing her social standing drives Mallory to desperate measures. The victim's knowledge of their affair is an ever-present specter, haunting her every thought.",
    "motiveStrength": "strong",
    "alibiWindow": "Mallory claims to have been in her office until 9 PM, but her alibi remains uncorroborated, leaving room for doubt.",
    "accessPlausibility": "As a physician, Mallory has access to various areas of the hotel, making her movements plausible yet suspicious.",
    "stakes": "The stakes are monumental; losing her reputation would not only devastate her marriage but also obliterate her standing in the community, a fate she cannot bear.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a refined elegance, her words carefully chosen to maintain her image. She often employs a sharp wit, using humor to mask her inner turmoil, and has a tendency to deflect personal questions with a practiced smile.",
    "signatureTic": "\"Oh, darling, life is far too short for mediocrity!\"",
    "internalConflict": "The affair with the victim has left Mallory in a moral quandary. She must confront the consequences of her actions and the guilt that eats away at her conscience, torn between her desires and the need to preserve her family.",
    "personalStakeInCase": "This murder investigation strikes at the heart of Mallory's existence; it could expose her darkest secret, forcing her to reckon with the choices she has made and the life she has built on shaky foundations.",
    "paragraphs": [
      "Dr. Mallory Finch is a woman of contradictions, balancing the demands of her profession with the complexities of her personal life. In the public eye, she is a beacon of hope, a trusted physician who dedicates her time to charitable causes. Yet, beneath the polished exterior lies a tumultuous secret, one that could unravel her carefully constructed life.",
      "The affair with the victim was a reckless choice, one fueled by passion but marred by guilt. Each encounter was a dangerous dance, a thrilling escape from the constraints of her marriage. However, the thrill has turned to dread as the victim's knowledge of their liaison looms like a dark cloud, threatening to burst at any moment and rain down ruin on Mallory's reputation.",
      "As the investigation unfolds, Mallory feels the walls closing in. Her alibi is fragile, and the whispers of suspicion grow louder. The fear of exposure gnaws at her, leaving her on edge. If the truth comes to light, she risks losing everything she holds dear—the trust of her husband, her social standing, and the respect she has worked so hard to earn.",
      "In moments of solitude, Mallory grapples with her choices. The desire for redemption battles with her fear of consequence, and the weight of her secret feels heavier with each passing day. She must confront the reality of her actions and the potential fallout. Will she find a way to navigate the chaos, or will the truth unravel her life in ways she never imagined?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired Navy officer, wrestles with past regrets and unrequited love, finding himself entangled in a murder investigation that threatens his dignity.",
    "publicPersona": "Ivor is a gruff yet respected figure within the community, often seen sharing tales of his naval exploits with anyone willing to listen. His commanding presence is softened by a certain charm, making him a beloved local character.",
    "privateSecret": "Beneath the surface, Ivor harbors deep-seated feelings for the victim, feelings that were never reciprocated. The pain of rejection festers within him, leading to a bitterness that colors his interactions.",
    "motiveSeed": "The emotional turmoil stemming from his unrequited love for the victim fuels a desire for revenge, a dangerous cocktail of pride and regret that could lead him down a dark path.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor was at the bar from 8:30 PM to 9:30 PM, though he left briefly to return to his room, creating a gap in his alibi.",
    "accessPlausibility": "As a retired captain, Ivor has a certain level of access within the hotel, allowing him to move around without raising suspicion.",
    "stakes": "His pride is on the line, and the emotional turmoil of rejection threatens to expose him as a failure, something he cannot bear.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks with a gravelly timbre, often punctuated by a dry chuckle. His stories are peppered with naval jargon, and he has a tendency to downplay his own feelings with humor, masking his vulnerabilities.",
    "signatureTic": "\"Well, I suppose I’ll just sail on through this one, won’t I?\"",
    "internalConflict": "Ivor wrestles with the bitterness of unrequited love and the longing for closure. The murder investigation forces him to confront his past emotions and the reality of his situation, leaving him torn between revenge and acceptance.",
    "personalStakeInCase": "The investigation is not just about solving a murder; it is a personal reckoning for Ivor. He must come to terms with his feelings for the victim and find a way to move forward, lest he be trapped in a cycle of bitterness.",
    "paragraphs": [
      "Captain Ivor Hale is a man defined by his past, a retired Navy officer whose glory days are but distant memories. In the community, he is a beloved storyteller, regaling anyone who will listen with tales of high seas and daring adventures. But beneath the gruff exterior lies a heart burdened by unrequited love, a secret that haunts him.",
      "His feelings for the victim were never acknowledged, a painful truth that has left Ivor feeling rejected and bitter. The emotional turmoil of longing for someone who has chosen another stings more than any naval battle he ever faced. Now, with the murder investigation unfolding, the stakes have never been higher. The specter of revenge looms, threatening to overshadow his sense of honor.",
      "As the investigation progresses, Ivor's alibi becomes a point of contention. The brief absence from the bar raises questions, and doubt creeps into his mind. The fear of being seen as a failure gnaws at him, and he grapples with the desire to confront his past while also protecting his dignity.",
      "In quiet moments, Ivor reflects on the choices he has made, the love he never confessed, and the bitterness that has consumed him for far too long. The investigation forces him to confront these demons, pushing him to find closure and redefine his future. Will he find the strength to move beyond the shadows of his past, or will he remain anchored in a sea of regret?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a glamorous socialite, is driven by ambition and jealousy, leading her to become embroiled in a murder investigation that could shatter her carefully constructed image.",
    "publicPersona": "Known for her lavish parties and eye-catching attire, Beatrice thrives on attention and admiration. Her social calendar is filled with events, and she is often the center of attention, relishing the spotlight.",
    "privateSecret": "However, beneath the glitz and glamour lies a darker side; Beatrice has long envied the victim's success and has actively worked to sabotage her art career, driven by a relentless desire to outshine others.",
    "motiveSeed": "The jealousy that fuels Beatrice's ambition is a dangerous motivator, and the murder investigation could expose her underhanded tactics.",
    "motiveStrength": "moderate",
    "alibiWindow": "While Beatrice was seen mingling with other guests from 8 PM to 10 PM, no one can confirm her exact whereabouts, leaving doubt in the air.",
    "accessPlausibility": "With her social status granting her easy access to various hotel areas, Beatrice can navigate the space without raising suspicion.",
    "stakes": "Her aspirations and social reputation hinge on her ability to maintain her image; exposure could ruin her standing in the community.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an effervescent charm, her words often laced with biting sarcasm. She enjoys turning conversations into performances, using humor to deflect and distract from her insecurities.",
    "signatureTic": "\"Oh darling, it's not envy; it's merely a desire for improvement!\"",
    "internalConflict": "The ambition that drives Beatrice is a double-edged sword. As she navigates the investigation, she must confront her jealousy and the lengths she is willing to go to secure her place at the top, grappling with the emptiness that ambition brings.",
    "personalStakeInCase": "This murder investigation represents a critical juncture for Beatrice; failure to distance herself from suspicion could obliterate her carefully curated image, forcing her to confront the truth about her ambitions.",
    "paragraphs": [
      "Beatrice Quill is a vision of glamour and ambition, a socialite who thrives on the admiration of others. Wherever she goes, the spotlight follows, and her lavish parties are the stuff of legends. With a penchant for theatrics, Beatrice plays her role to perfection, captivating audiences with her charm and wit. Yet, lurking beneath the surface is a fierce envy that simmers just out of sight.",
      "The victim's success has long been a thorn in Beatrice's side, a constant reminder of her own insecurities. Fueled by jealousy, she has resorted to underhanded tactics to undermine the victim's career, a dangerous game that could backfire at any moment. The murder investigation presents a reckoning, a chance for Beatrice to either rise above her envy or spiral deeper into the abyss.",
      "As the investigation unfolds, Beatrice finds herself under scrutiny. While she mingles effortlessly with guests, the doubt surrounding her alibi hangs heavy in the air. The fear of exposure looms large, threatening to unravel her carefully constructed facade. Every smile becomes a mask, every laugh a shield against the truth that could destroy her.",
      "In the quiet moments, Beatrice reflects on her ambitions and the emptiness that accompanies them. The pursuit of social standing has come at a cost, leaving her questioning the authenticity of her relationships. The investigation forces her to confront the reality of her jealousy and the lengths she is willing to go to achieve her dreams. Will she learn to value genuine connections, or will her ambition continue to consume her?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, the hotel manager, finds herself at the center of a love triangle, grappling with the consequences of her secret relationship as the murder investigation unfolds.",
    "publicPersona": "Dedicated and competent, Sylvia is the backbone of the hotel, ensuring that guests have an impeccable experience. Her professionalism is respected, though she often feels underappreciated for her efforts.",
    "privateSecret": "Behind her competent exterior lies a secret relationship with the victim's fiancé, a fact that creates a web of emotional conflict for Sylvia.",
    "motiveSeed": "The fear of losing her relationship and the jealousy of the victim's presence fuel a complicated emotional landscape, leading to potential outbursts.",
    "motiveStrength": "weak",
    "alibiWindow": "Sylvia was managing the front desk during the critical hours, but no one can verify her exact timeline, leaving her actions open to interpretation.",
    "accessPlausibility": "As the hotel manager, Sylvia has easy access to all areas of the property, allowing her to move about without raising suspicion.",
    "stakes": "Her relationship is at risk, and the fear of losing both love and credibility weighs heavily on her shoulders.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with a calm, measured tone, often using dry humor to cope with the pressures of her job. She has a tendency to make astute observations about the guests and their behaviors, often reflecting on the absurdity of human nature.",
    "signatureTic": "\"You’d be surprised how often people misplace their priorities.\"",
    "internalConflict": "Sylvia is torn between her feelings for the victim's fiancé and the guilt that comes from her secret relationship. The murder investigation forces her to confront the consequences of her choices and the possibility of losing everything she holds dear.",
    "personalStakeInCase": "The murder investigation becomes a pivotal moment for Sylvia; it could expose her relationship, forcing her to reckon with the choices she has made and the impact on her professional life.",
    "paragraphs": [
      "Sylvia Trent is a dedicated hotel manager, a woman whose life revolves around ensuring that every guest has a perfect experience. Her commitment to her work is unwavering, yet she often finds herself feeling underappreciated. The hotel’s success is her pride, but beneath the surface lies a secret that could shatter her carefully maintained façade.",
      "The relationship with the victim's fiancé is a double-edged sword, a source of both joy and turmoil for Sylvia. The thrill of their connection is overshadowed by the guilt that gnaws at her conscience. As the investigation unfolds, the fear of exposure looms large, threatening to unravel everything she has built both personally and professionally.",
      "During the critical hours of the investigation, Sylvia is managing the front desk, her calm demeanor masking the tempest of emotions within. While she interacts with guests, the weight of her secret feels heavier with each passing moment. The fear of losing her relationship and the potential fallout from the murder investigation create an internal conflict that threatens to consume her.",
      "In quiet moments, Sylvia reflects on her choices and the absurdity of human nature. She often observes the guests with a keen eye, finding humor in their quirks while grappling with her own moral dilemmas. The investigation forces her to confront the consequences of her actions, leaving her to ponder whether love is worth the risk. Will she find a way to navigate the chaos, or will her choices lead to her undoing?"
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a cynical writer, finds himself embroiled in a murder investigation that challenges his perceptions of love, betrayal, and ambition.",
    "publicPersona": "Known for his sharp tongue and biting critiques, Hugo is a writer who navigates the world with a cynical eye. His wit is often cutting, and he has a reputation for exposing the flaws in society and art.",
    "privateSecret": "However, beneath the façade of cynicism lies a vulnerable heart; Hugo had secretly funded the victim's projects, hoping for a romantic relationship that never materialized, leaving him feeling betrayed.",
    "motiveSeed": "The betrayal felt by Hugo when the victim chose someone else over him after investing time and money into her work creates a volatile mix of emotions that could lead him to desperate actions.",
    "motiveStrength": "strong",
    "alibiWindow": "Hugo was in the lounge from 8 PM to 9:30 PM, though he left for a walk during that time, leaving a gap in his whereabouts.",
    "accessPlausibility": "As a writer, Hugo has access to various areas of the hotel, allowing him to move around with relative ease.",
    "stakes": "His pride and financial investment are on the line, and the fear of losing both drives him to confront the reality of his feelings.",
    "humourStyle": "deadpan",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks in a measured, almost monotone voice, often delivering his observations with a dry, deadpan humor. His dialogue is laced with sarcasm, and he has a tendency to dissect conversations with a critical eye.",
    "signatureTic": "\"Ah, the tragedy of unrequited love—such a cliché, isn't it?\"",
    "internalConflict": "Hugo wrestles with the bitterness of betrayal and the longing for genuine connection. The murder investigation forces him to confront his feelings, leaving him torn between cynicism and the desire for love.",
    "personalStakeInCase": "The murder investigation is a critical moment for Hugo; it could expose his hidden investments and the vulnerabilities he has kept buried, forcing him to confront the complexities of his own heart.",
    "paragraphs": [
      "Hugo Vane is a writer known for his cutting critiques of society, navigating the world with a keen eye and a sharp pen. His cynicism is a shield, a way to protect himself from the vulnerabilities that lie beneath the surface. Yet, as he observes the world around him, he cannot escape the reality of his own unfulfilled desires.",
      "The secret funding of the victim's projects was a desperate attempt to connect, a misguided hope for a romantic relationship that never came to fruition. The betrayal he feels is palpable, a bitter aftertaste that colors his interactions with others. As the murder investigation unfolds, Hugo finds himself grappling with feelings of anger and loss, unsure of how to navigate the emotional minefield.",
      "His alibi is shaky, and the gaps in his timeline raise suspicions. The fear of exposure intertwines with his pride, forcing him to confront the consequences of his investments. The stakes are high, and the investigation becomes a mirror reflecting his own shortcomings and desires.",
      "In quiet moments, Hugo reflects on the nature of love and betrayal, dissecting his own feelings with the same critical eye he applies to his writing. The investigation challenges his perceptions, pushing him to confront the complexities of human connection. Will he find a way to reconcile his cynicism with the longing for genuine love, or will he remain trapped in the cycle of bitterness?"
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Cliffside Haven Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel with Art Deco elegance, perched precariously on a cliff overlooking the tumultuous sea.",
    "visualDescription": "The hotel boasts sweeping views of the ocean, large windows framed by geometric patterns, and a lobby adorned with plush velvet seating and polished marble floors. The exterior features bold, angular lines typical of Art Deco design, with ornate railings and sea-glass mosaics catching the light.",
    "atmosphere": "A blend of luxury and tension, where the beauty of the setting contrasts sharply with the underlying unease.",
    "paragraphs": [
      "Perched above the crashing waves, the Cliffside Haven Hotel stands as both a sanctuary and a prison. Its Art Deco facade gleams in the muted light of a fog-laden dawn, geometric patterns casting shadows that dance across the polished marble of the lobby. The scent of salt and rain mingles with the faint aroma of tobacco from the plush seating areas, where guests whisper of secrets in hushed tones. Outside, the relentless ocean roars, a constant reminder of the isolation that envelops this coastal retreat.",
      "Inside, the atmosphere shifts from the grandeur of the lobby to the narrow hallways that wind like serpents through the building. Each corner turned reveals glimpses of the sea, but the sound of crashing waves is often drowned out by the crackle of a distant radio, broadcasting news that feels far away. The staff move with purpose, their access to the service elevators and back rooms strictly controlled, creating an air of mystery around the hotel's inner workings. Guests are watched, secrets are kept, and the weight of post-war uncertainty hangs heavy in the air.",
      "As evening descends, the hotel transforms; candlelight flickers in the dining room, casting long shadows that stretch across the tables. The scent of freshly prepared seafood mingles with the dampness seeping in from the coastal fog. Conversations rise and fall, punctuated by the occasional clink of cutlery against fine china. Yet, beneath the surface of this elegant facade, tensions simmer, and the knowledge that something is amiss lingers like the salty mist clinging to the cliffs."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Foggy with occasional rain, typical of coastal climates, limiting visibility and creating an air of mystery.",
    "timeFlow": "Days of mounting tension as secrets unravel and suspicions grow.",
    "mood": "Tense and suspenseful, reflecting the post-war uncertainty and the lingering effects of wartime experiences.",
    "eraMarkers": [
      "Ubiquitous radios playing news broadcasts",
      "Early television sets flickering in guest rooms",
      "Post-war automobile boom visible in the parking lot"
    ],
    "sensoryPalette": {
      "dominant": "Salty ocean air with a hint of rain",
      "secondary": [
        "Faint tobacco smoke lingering in the lobby",
        "Aromatic seafood wafting from the dining room"
      ]
    },
    "paragraphs": [
      "The Cliffside Haven Hotel breathes an atmosphere of elegance intertwined with unease. As the fog rolls in from the sea, it cloaks the hotel in a shroud of mystery, muffling the sound of crashing waves and leaving guests feeling isolated from the world. The air is thick with the scent of salt and dampness, a reminder of the tumultuous ocean just beyond the windows. Inside, the soft glow of lamps illuminates plush seating areas, where whispered conversations hint at secrets that lie just beneath the surface.",
      "Every creak of the floorboards and rustle of fabric echoes the tension in the air. The hotel's design, with its narrow hallways and strategic sightlines, creates moments of concealment and revelation, making every corner a potential stage for intrigue. In this post-war haven, the past lingers like smoke in the air, and the uncertainty of the future presses upon the hearts of those who seek refuge within its walls."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests and staff",
      "visualDetails": "A spacious area dominated by a sweeping staircase, adorned with Art Deco motifs, plush seating, and large ocean-facing windows.",
      "sensoryDetails": {
        "sights": [
          "geometric patterns on walls",
          "glimmering chandelier",
          "large bay windows",
          "plush velvet chairs",
          "elegant reception desk"
        ],
        "sounds": [
          "soft chatter of guests",
          "clinking glasses from the bar",
          "distant radio playing music",
          "footsteps on polished marble",
          "occasional laughter"
        ],
        "smells": [
          "freshly brewed coffee",
          "tobacco smoke",
          "sea breeze mingling with perfume",
          "polished wood",
          "dampness from the ocean"
        ],
        "tactile": [
          "smooth marble floor",
          "soft velvet upholstery",
          "cool brass fixtures",
          "polished wooden surfaces",
          "chill from the ocean breeze"
        ]
      },
      "accessControl": "Open to all guests; staff-only areas lead to service elevators and back rooms.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "misty view of the ocean",
            "damp marble floor",
            "grey light filtering through clouds",
            "shadows cast by furniture"
          ],
          "sounds": [
            "steady rain against windows",
            "distant thunder",
            "soft whispers",
            "the creak of the lobby doors",
            "the ticking of a clock"
          ],
          "smells": [
            "wet stone",
            "freshly brewed tea",
            "damp wood",
            "salt from the sea",
            "faint mildew"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "shadows creeping across the floor",
            "faded colors of upholstery",
            "guests with serious expressions",
            "empty chairs"
          ],
          "sounds": [
            "silence punctuated by footsteps",
            "distant waves crashing",
            "soft rustle of newspapers",
            "clattering of dishes",
            "the hum of conversation"
          ],
          "smells": [
            "beeswax polish",
            "dust in the air",
            "dark roast coffee",
            "cigarette smoke",
            "ocean brine"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from lamps",
            "glimmer of the ocean in the sunset",
            "guests dressed for dinner",
            "twinkling lights from the bar"
          ],
          "sounds": [
            "clinking of cutlery",
            "distant music from the radio",
            "laughter from the dining area",
            "the rustle of silk dresses",
            "the tick of a wall clock"
          ],
          "smells": [
            "freshly baked bread",
            "grilled fish",
            "sweet perfume",
            "citrus from cocktails",
            "smoky wood"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby is the heart of the Cliffside Haven Hotel, a spacious area where guests gather to exchange pleasantries or observe one another through the lens of suspicion. The sweeping staircase and large bay windows provide a grand entrance, yet the atmosphere is often thick with unspoken tension. Geometric patterns adorn the walls, reflecting the Art Deco style, while plush velvet chairs invite both comfort and concealment. The scent of coffee and tobacco lingers, a reminder of the secrets shared and the stories untold.",
        "As guests filter in and out, the lobby serves as a stage for intrigue, where every whispered conversation can carry weight. The soft hum of a distant radio mixes with the sound of rain tapping against the windows, creating a soundtrack of uncertainty. Here, the interplay of light and shadow can reveal or obscure, making it the perfect setting for a mystery to unfold."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Formal dining area for guests",
      "visualDetails": "Elegantly set tables with crisp white linens, crystal glassware, and a backdrop of large windows showcasing ocean views.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware",
          "elegant floral centerpieces",
          "large windows overlooking the sea",
          "artfully arranged dishes",
          "soft candlelight"
        ],
        "sounds": [
          "clinking of glasses",
          "soft music playing",
          "murmurs of conversation",
          "the rustle of napkins",
          "the scrape of chairs"
        ],
        "smells": [
          "grilled seafood",
          "fresh herbs",
          "butter melting on warm bread",
          "candle wax",
          "faint perfume"
        ],
        "tactile": [
          "cool glass of wine",
          "smooth linen tablecloth",
          "crisp napkin against the skin",
          "polished wood chair",
          "warmth of candlelight"
        ]
      },
      "accessControl": "Open to all guests during meal times; staff only after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "darkened windows with raindrops",
            "dim light from overhead fixtures",
            "empty tables awaiting guests",
            "damp floor reflecting light",
            "faded floral arrangements"
          ],
          "sounds": [
            "soft patter of rain",
            "quiet clinking of dishes",
            "muffled voices from the lobby",
            "the hum of the refrigerator",
            "the distant sound of waves"
          ],
          "smells": [
            "wet earth",
            "freshly baked pastries",
            "coffee brewing",
            "citrus from cleaning products",
            "dampness in the air"
          ],
          "mood": "somber anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "cloudy light filtering through windows",
            "shadows on the tablecloths",
            "guests sitting in silence",
            "half-empty wine glasses",
            "fading decor"
          ],
          "sounds": [
            "low conversations",
            "clattering of forks",
            "the rustle of menus",
            "sudden laughter",
            "the ticking of a wall clock"
          ],
          "smells": [
            "roasted meats",
            "fresh baked goods",
            "herbs and spices",
            "cigarette smoke",
            "salt from the sea"
          ],
          "mood": "tension-filled silence"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of candlelight on tables",
            "sparkling glassware reflecting light",
            "guests in evening attire",
            "ocean view illuminated by moonlight",
            "decorative wall sconces"
          ],
          "sounds": [
            "laughter and chatter",
            "soft music playing",
            "clinking of ice in drinks",
            "the rustle of dresses",
            "the crackle of the fireplace"
          ],
          "smells": [
            "grilled meats and seafood",
            "sweet desserts",
            "freshly brewed coffee",
            "candle smoke",
            "the scent of the ocean"
          ],
          "mood": "elegant excitement"
        }
      ],
      "paragraphs": [
        "The Dining Room at the Cliffside Haven Hotel is a place of both indulgence and intrigue. With its elegant tables set for dinner, adorned with crisp linens and glimmering glassware, it is a stage for culinary delights and whispered conversations. The large windows provide a breathtaking view of the ocean, yet they also serve as a reminder of the isolation that can trap guests within the hotel’s walls. Here, the scent of grilled seafood mingles with candle wax, creating an atmosphere that is both inviting and tense.",
        "As the sun sets and the candlelight flickers, the room becomes alive with soft laughter and the clinking of silverware. Yet, beneath the surface of the meal, tension simmers, as guests exchange glances and speculate about the events unfolding around them. Each dish served is a moment of pause, a chance to reflect on the mysteries that lie just beyond the window, where the ocean churns and secrets are kept."
      ]
    },
    {
      "id": "staff_quarters",
      "name": "Staff Quarters",
      "type": "interior",
      "purpose": "Living area for hotel staff",
      "visualDetails": "A modest space with simple furnishings, a shared kitchen, and personal touches from the staff.",
      "sensoryDetails": {
        "sights": [
          "worn wooden tables",
          "cramped bunk beds",
          "faded photographs on the walls",
          "simple kitchen appliances",
          "laundry hanging to dry"
        ],
        "sounds": [
          "soft chatter among staff",
          "clattering of dishes",
          "the hum of the refrigerator",
          "footsteps on wooden floors",
          "the rustle of laundry"
        ],
        "smells": [
          "cooked meals",
          "clean linens",
          "faint scent of soap",
          "dust in the air",
          "the lingering aroma of coffee"
        ],
        "tactile": [
          "rough wood surfaces",
          "cool metal of utensils",
          "soft fabric of worn clothes",
          "warmth from the kitchen stove",
          "chill from the drafts"
        ]
      },
      "accessControl": "Restricted to staff only; guests not permitted.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through windows",
            "water droplets on glass",
            "staff preparing for the day",
            "cluttered tables",
            "the hum of activity"
          ],
          "sounds": [
            "rain pattering on the roof",
            "soft laughter",
            "clinking of cutlery",
            "the whir of a kettle",
            "the rustle of newspapers"
          ],
          "smells": [
            "wet earth",
            "freshly brewed coffee",
            "cooked breakfast",
            "dampness in the air",
            "faint scent of mildew"
          ],
          "mood": "busy anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light in the room",
            "staff relaxing during a break",
            "hanging laundry moving slightly",
            "piles of laundry",
            "old furniture"
          ],
          "sounds": [
            "muffled conversations",
            "distant voices from the lobby",
            "the ticking of a clock",
            "the clanking of pots",
            "the creaking of floorboards"
          ],
          "smells": [
            "clean linens",
            "cooked meals",
            "faint scent of sweat",
            "dust in the air",
            "the aroma of coffee"
          ],
          "mood": "weary stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft light from lamps",
            "staff gathered around a table",
            "the glow of the stove",
            "the flicker of a radio",
            "distant ocean view from the window"
          ],
          "sounds": [
            "laughter and conversation",
            "the crackle of the radio",
            "the clink of glasses",
            "the rustle of newspapers",
            "the sound of waves crashing"
          ],
          "smells": [
            "cooked dinner",
            "freshly baked bread",
            "scent of cleaning products",
            "the lingering aroma of tobacco",
            "the scent of the ocean"
          ],
          "mood": "relaxed camaraderie"
        }
      ],
      "paragraphs": [
        "The Staff Quarters of the Cliffside Haven Hotel are a world apart from the elegance of the guest areas. This modest space is filled with the sounds of laughter and chatter, as employees share meals and stories from their day. The simple furnishings bear the marks of wear, and personal touches like photographs and mementos reflect the lives of those who work here. The scent of cooked meals mingles with the faint aroma of coffee, creating a warm and inviting atmosphere amidst the bustle of preparations for the evening rush.",
        "As evening falls, the light in the quarters softens, casting a cozy glow over the worn wooden tables. Here, the staff unwind, their camaraderie evident in the easy laughter and shared stories. Yet, even in this sanctuary, the weight of the hotel’s secrets looms large, and whispers of intrigue often travel through the air, just as the scent of the ocean drifts in through the open windows."
      ]
    },
    {
      "id": "clifftop_balcony",
      "name": "Clifftop Balcony",
      "type": "exterior",
      "purpose": "Viewing area overlooking the ocean",
      "visualDetails": "An open balcony with wrought iron railings, offering breathtaking views of the sea and sky, surrounded by rocky cliffs.",
      "sensoryDetails": {
        "sights": [
          "crashing waves below",
          "seagulls soaring overhead",
          "dark clouds gathering on the horizon",
          "sunset painting the sky",
          "rocky cliffs jutting out"
        ],
        "sounds": [
          "crashing surf",
          "howling wind",
          "calls of seagulls",
          "the distant rumble of thunder",
          "the rustle of leaves"
        ],
        "smells": [
          "salty sea air",
          "fresh rain",
          "wet stone",
          "the scent of wildflowers",
          "the earthy aroma of damp soil"
        ],
        "tactile": [
          "cool metal of the railing",
          "rough texture of stone",
          "chill of the ocean breeze",
          "softness of grass underfoot",
          "moisture from the sea air"
        ]
      },
      "accessControl": "Open to guests, but isolated from the main hotel, providing a sense of solitude.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey sky heavy with clouds",
            "raindrops glistening on the railing",
            "mist rising from the sea",
            "pools of water collecting on the balcony",
            "damp grass below"
          ],
          "sounds": [
            "steady rain on the balcony",
            "distant thunder",
            "the thrum of wind",
            "soft splashes of water",
            "the rustle of leaves"
          ],
          "smells": [
            "wet earth",
            "fresh rain",
            "the scent of seaweed",
            "dampness in the air",
            "the faint aroma of wildflowers"
          ],
          "mood": "isolated melancholy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "waves crashing relentlessly",
            "gulls circling overhead",
            "clouds hanging low",
            "the horizon fading into grey"
          ],
          "sounds": [
            "constant roar of the sea",
            "the howling wind",
            "the distant sound of thunder",
            "the rustle of grass",
            "the occasional call of a bird"
          ],
          "smells": [
            "salt in the air",
            "the scent of wet stone",
            "faint smoke from a distant fire",
            "the earthy aroma of damp soil",
            "the lingering scent of seaweed"
          ],
          "mood": "foreboding tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "the ocean reflecting colors",
            "the silhouette of cliffs against the sky",
            "stars beginning to twinkle",
            "the glow of the hotel lights"
          ],
          "sounds": [
            "gentle lapping of waves",
            "whispers of the wind",
            "soft calls of night birds",
            "the distant laughter from the hotel",
            "the rustling of leaves"
          ],
          "smells": [
            "fresh sea air",
            "the scent of blooming flowers",
            "coolness of the evening",
            "the lingering aroma of dinner",
            "the faint scent of wood smoke"
          ],
          "mood": "peaceful solitude"
        }
      ],
      "paragraphs": [
        "The Clifftop Balcony offers a breathtaking view of the tumultuous sea below, where waves crash against the rocky cliffs in a symphony of sound. Here, the salty air is thick with moisture, and the scent of wildflowers mingles with the brine of the ocean. The wrought iron railings provide a sturdy barrier against the elements, yet they also offer a sense of freedom to those who stand and gaze out at the horizon. This is a place of contemplation, where the weight of secrets can be momentarily forgotten amidst nature’s beauty.",
        "As the sun begins to set, the balcony transforms under the golden hues of twilight. The distant laughter from the hotel drifts up, mingling with the soft whispers of the wind. Yet, even in this serene setting, an undercurrent of tension remains palpable, as if the very cliffs hold the secrets of those who have come before. It is a place where solitude reigns, yet the echoes of the hotel’s mysteries linger like shadows in the fading light."
      ]
    }
  ],
  "note": "",
  "cost": 0.0027532527,
  "durationMs": 53457
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "July",
    "day": null,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "July",
    "weather": [
      "foggy mornings with occasional rain",
      "cool breezes from the coast",
      "overcast skies limiting visibility"
    ],
    "daylight": "Long summer days with sunset around eight-thirty PM, although fog can obscure the evening light.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the fog thickens and visibility decreases.",
    "holidays": [
      "Independence Day (July 4th)"
    ],
    "seasonalActivities": [
      "beach outings and picnics",
      "local fairs and community gatherings",
      "evening strolls along the promenade"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suits in navy or charcoal",
        "white dress shirts with wide collars",
        "polished leather shoes"
      ],
      "casual": [
        "lightweight cotton trousers",
        "short-sleeved button-up shirts",
        "suspenders for a relaxed yet stylish look"
      ],
      "accessories": [
        "fedoras or trilby hats",
        "silk ties in bold patterns",
        "leather gloves for evening wear"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with floral prints",
        "fitted bodices and full skirts",
        "lightweight cardigans for cover"
      ],
      "casual": [
        "simple cotton blouses with puffed sleeves",
        "A-line skirts in pastel colors",
        "tailored shorts for warm days"
      ],
      "accessories": [
        "wide-brimmed hats adorned with ribbons",
        "string of pearls or simple gold jewelry",
        "handbags with intricate stitching"
      ]
    },
    "trendsOfTheMoment": [
      "utilitarian fashion influenced by wartime rationing",
      "increasing popularity of bold prints and colors",
      "influence of Hollywood glamour on everyday wear"
    ],
    "socialExpectations": [
      "men are expected to be the primary breadwinners",
      "women increasingly take on roles in offices and factories",
      "courtesy and chivalry remain important in social interactions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "D-Day landings in Normandy earlier in June have shifted the war's momentum",
      "the United States is ramping up production of military equipment and supplies",
      "debates in Congress regarding post-war reconstruction plans"
    ],
    "politicalClimate": "A sense of urgency surrounds the war effort, with citizens rallying behind troops overseas while grappling with the uncertainty of the post-war future.",
    "economicConditions": "Rationing continues across various goods, leading to a black market for luxury items, while wartime production keeps unemployment low.",
    "socialIssues": [
      "integration of women into the workforce",
      "return of veterans and their reintegration into civilian life",
      "growing tensions between the US and USSR"
    ],
    "internationalNews": [
      "reports of Soviet advances on the Eastern Front",
      "increasing number of displaced persons across Europe",
      "alliances shifting as nations prepare for post-war negotiations"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - 'I'll Be Seeing You'",
        "Glenn Miller - 'In the Mood'",
        "The Andrews Sisters - 'Boogie Woogie Bugle Boy'"
      ],
      "films": [
        "'To Have and Have Not'",
        "the adaptation of 'Gaslight'",
        "'The Miracle of Morgan's Creek'"
      ],
      "theater": [
        "Broadway productions showcasing wartime themes",
        "local plays tackling social issues post-war",
        "vaudeville acts drawing crowds"
      ],
      "radio": [
        "‘The Jack Benny Program’",
        "'The Shadow'",
        "'Suspense' featuring mystery and thrill"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Glass Menagerie' by Tennessee Williams",
        "'The Corn is Green' by Emlyn Williams",
        "'The Little Prince' by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "detective fiction",
        "war novels",
        "social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "improvements in radar technology",
        "the development of the first electronic computers",
        "advancements in military aviation"
      ],
      "commonDevices": [
        "radios in most households",
        "early model television sets in affluent homes",
        "simple household appliances like toasters and refrigerators"
      ],
      "emergingTrends": [
        "increasing use of synthetic materials due to wartime scarcity",
        "growing interest in automobile ownership post-war",
        "early adoption of consumer electronics"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "Milk: six pence per pint",
        "Movie ticket: one shilling"
      ],
      "commonActivities": [
        "attending community events or fairs",
        "gathering for barbecues or picnics",
        "visiting local beaches or parks"
      ],
      "socialRituals": [
        "weekly church gatherings",
        "evening strolls in parks with family",
        "community potlucks to foster neighborly ties"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing divide between the affluent and the working class",
      "growing awareness of class struggles among the populace"
    ],
    "gender": [
      "traditional gender roles are being challenged",
      "women's contributions to the workforce are increasingly recognized",
      "men returning from war face readjustment to civilian expectations"
    ],
    "race": [
      "racial segregation remains prevalent in many areas",
      "growing civil rights movements begin to take shape"
    ],
    "generalNorms": [
      "politeness and decorum are highly valued",
      "family-oriented activities dominate social life",
      "community involvement is seen as a civic duty"
    ]
  },
  "atmosphericDetails": [
    "The salty tang of the sea air mixes with the dampness of the fog, creating an elusive, almost ghostly ambiance.",
    "Strains of popular wartime music waft from radios, blending with the sound of laughter and chatter from nearby beachgoers.",
    "The distant rumble of thunder hints at an approaching storm, while the soft patter of rain on rooftops adds to the tension of the evening."
  ],
  "paragraphs": [
    "In July 1944, the coastal town's atmosphere buzzes with a mix of anticipation and trepidation. Fog rolls in from the ocean, wrapping the streets in a shroud that limits visibility and enhances the feeling of uncertainty. As Independence Day celebrations fade into memory, the mood is tempered by the ongoing war, with families still waiting anxiously for loved ones abroad. The evenings stretch long, with the sun setting late, casting a muted glow over gatherings in the local parks, where children play and adults discuss the latest news from the front lines.",
    "Fashion during this summer is a reflection of both wartime austerity and the desire for expression. Men don double-breasted suits in dark hues, with polished shoes and stylish fedoras, while women embrace tea-length dresses adorned with floral patterns, their outfits complemented by elegant hats and pearls. This season sees a mix of utilitarian pieces and Hollywood glamour, as the public seeks to maintain a sense of normalcy amidst the chaos of war. The streets are alive with color, yet the fog often mutes even the brightest of outfits, underscoring the tension that lingers in the air.",
    "Daily life remains both routine and filled with tension, as families navigate the challenges of rationing and the economic conditions of war. Local fairs and community gatherings offer brief respites from the worries of the world, as neighbors come together to share food and stories. Prices reflect the ongoing scarcity, with a loaf of bread costing four pence and movie tickets drawing crowds at one shilling. Social rituals such as church gatherings and evening walks in the park serve as anchors in a shifting landscape, while the looming threat of the unknown casts a shadow over even the most joyful moments."
  ],
  "note": "",
  "cost": 0.0011330022,
  "durationMs": 14330
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A delayed-action poison murder unfolds at a coastal hotel, where the convergence of post-war trauma and social upheaval forces a diverse group of guests and staff to confront hidden loyalties and secrets.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is increasingly female, reflecting shifting gender roles, while the societal backdrop is marked by Cold War tensions and the psychological scars of war, creating a pressure cooker of suspicion among the hotel's guests and staff."
  },
  "setting": {
    "location": "A seaside hotel on a cliffside overlooking the ocean.",
    "institution": "hotel",
    "weather": "Foggy with occasional rain, limiting visibility and enhancing the air of mystery."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a delayed-action poison method, where the toxicology and dosage timing conceal when the fatal dose was actually administered."
}

### LOCKED_FACTS
[
  {
    "id": "time_of_death",
    "value": "two hours",
    "description": "The poison becomes lethal exactly two hours after ingestion."
  },
  {
    "id": "food_interaction_time",
    "value": "twenty minutes past eight",
    "description": "The victim consumed the food that triggered the poison at twenty minutes past eight."
  },
  {
    "id": "herb_identification",
    "value": "the specific herb",
    "description": "The herb residue found in the victim's glass was the key ingredient in the poison."
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
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "testimonial"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "temporal"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "early",
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
      "placement": "early",
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
