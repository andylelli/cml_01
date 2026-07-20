# Actual Prompt Record

- Run ID: `mystery-1784578387267`
- Project ID: ``
- Timestamp: `2026-07-20T20:16:34.783Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `f770b3d3eac881ce`

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
    "author": "Agent 6",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Vintage Seaside Hotel",
      "place": "Cliffside Hotel",
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
      "role_archetype": "Guest",
      "relationships": [],
      "public_persona": "Charming socialite",
      "private_secret": "Hiding a past relationship with the victim",
      "motive_seed": "Fear of being exposed",
      "motive_strength": "moderate",
      "alibi_window": "7:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Ocean view balcony"
      ],
      "behavioral_tells": [],
      "stakes": "Social reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Professional",
      "relationships": [],
      "public_persona": "Respected doctor",
      "private_secret": "Financial troubles",
      "motive_seed": "Greed for the victim's investment",
      "motive_strength": "high",
      "alibi_window": "7:00 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel clinic"
      ],
      "behavioral_tells": [
        "nervous habits"
      ],
      "stakes": "Financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority Figure",
      "relationships": [],
      "public_persona": "Dignified captain",
      "private_secret": "Former naval officer with a grudge",
      "motive_seed": "Desire for revenge against the victim",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Pier access"
      ],
      "behavioral_tells": [
        "defensive when questioned"
      ],
      "stakes": "Personal honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Hotel Staff",
      "relationships": [],
      "public_persona": "Helpful concierge",
      "private_secret": "Admires the victim",
      "motive_seed": "Jealousy over the victim's attention",
      "motive_strength": "low",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Reception area"
      ],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Astute investigator",
      "private_secret": "Personal ties to the victim",
      "motive_seed": "Seeking justice for a friend",
      "motive_strength": "high",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Investigative access"
      ],
      "behavioral_tells": [],
      "stakes": "Personal integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Wealthy businessman",
      "private_secret": "Involved in shady deals",
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
      "summary": "During a charity gala at a vintage seaside hotel, Hugo Vane is found drowned just off the coast. As tensions rise, Detective Sylvia Trent uncovers a web of deceit surrounding the tide's schedule and the motives of those present."
    },
    "accepted_facts": [
      "Hugo Vane was seen last near the shore before his body was discovered.",
      "Witnesses reported the tide was unusually low at the time of death.",
      "A tide chart was found altered in the hotel's records."
    ],
    "inferred_conclusions": [
      "The timing of the drowning does not align with the tide chart.",
      "There are discrepancies in the alibis of key suspects."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical device misaligned the tide timing, creating a false window for the victim's drowning.",
      "delivery_path": [
        {
          "step": "The device was hidden in the hotel's clock tower, manipulating the tide schedule."
        },
        {
          "step": "The device misled guests into believing the tide was at a different level."
        }
      ]
    },
    "outcome": {
      "result": "Hugo Vane drowned while the tide was actually low, concealed by the misalignment."
    }
  },
  "false_assumption": {
    "statement": "Hugo Vane drowned during a sudden high tide.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses described the tide as high, and the stormy weather suggested a rapid rise.",
    "what_it_hides": "The actual time of drowning was manipulated by a clock device."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses saw him near the shore arguing with the victim.",
      "His alibi was weak as he had access to the pier."
    ],
    "the_one_flaw": "The timing of the argument does not align with when the drowning occurred.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses reported a loud argument between Hugo and Captain Hale just before the drowning.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was about a fishing dispute, not related to the drowning.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A broken fishing rod was found near the shore.",
      "points_at_suspect": "Eleanor Voss",
      "innocent_explanation": "The rod belonged to a guest who had left the area earlier.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "rationale": "All suspects were present at the hotel for the charity gala, and no outsiders had access."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "7:00 PM - 9:00 PM"
      ],
      "windows": [
        "8:00 PM - 8:30 PM"
      ],
      "contradictions": [
        "Witnesses claim the tide was high, but records show it was low."
      ]
    },
    "access": {
      "actors": [
        "Hotel staff",
        "Guests"
      ],
      "objects": [
        "Tide charts",
        "Fishing equipment"
      ],
      "permissions": [
        "Access to the clock tower",
        "Access to the pier"
      ]
    },
    "physical": {
      "laws": [
        "Tides follow a predictable schedule."
      ],
      "traces": [
        "Footprints leading from the shore to the hotel."
      ]
    },
    "social": {
      "trust_channels": [
        "Guest relations with hotel staff."
      ],
      "authority_sources": [
        "Captain Hale's word as an authority figure."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall seeing the tide unusually low just before Hugo's drowning.",
        "correction": "The tide was low, contradicting claims of a high tide drowning.",
        "effect": "Narrows the suspect list by eliminating the assumption of a high tide.",
        "required_evidence": [
          "Witness statements about tide level",
          "Tide chart discrepancies"
        ],
        "reader_observable": true
      },
      {
        "observation": "A mechanical device was discovered in the clock tower that alters tide timings.",
        "correction": "The device manipulated the perceived timing of the tide's peak.",
        "effect": "Eliminates the theory of an accidental drowning due to natural causes.",
        "required_evidence": [
          "Mechanical device found in the clock tower",
          "Witnesses claiming the device's presence"
        ],
        "reader_observable": true
      },
      {
        "observation": "The old tide chart shows significant discrepancies compared to the actual tide.",
        "correction": "The altered tide chart was used to mislead about the drowning conditions.",
        "effect": "Narrows focus to those who had access to alter the documents.",
        "required_evidence": [
          "Comparison of altered tide chart and original",
          "Access logs showing who was in the office"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Recreating the timeline of events by comparing witness statements with the tide chart discrepancies.",
    "knowledge_revealed": "The discrepancies indicate the timing was manipulated, proving premeditation.",
    "pass_condition": "If the timeline shows a mismatch with the tide schedule, it confirms the crime was premeditated.",
    "evidence_clues": [
      "clue_5",
      "clue_6",
      "clue_culprit_direct_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements about tide levels and the tide chart discrepancies allow the reader to deduce the timing of the drowning. Step 2: The discovery of the device in the clock tower confirms manipulation of the tide timing. Step 3: Analysis of the altered tide chart highlights premeditation."
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
        "Observe the timeline reconstruction",
        "Draw conclusion about manipulation"
      ],
      "test_type": ""
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified by hotel staff.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by other guests.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Footage showing her in the lobby.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence from the tide manipulation."
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_10",
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
        "clue_id": "clue_id_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_6",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "delivery_method": "Direct observation"
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
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_5",
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
    "summary": "Eleanor Voss, the poised hotel manager, exudes an air of respectability, yet harbors a tumultuous secret that threatens to unravel her carefully constructed life.",
    "publicPersona": "Respected and poised, Eleanor is known for her impeccable management of the vintage seaside hotel.",
    "privateSecret": "Eleanor had a hidden affair with the victim that ended badly, leaving her with lingering resentment.",
    "motiveSeed": "Eleanor feared the victim would expose their past affair during a staff meeting, damaging her reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "was in the office from eight to nine-thirty",
    "accessPlausibility": "easy",
    "stakes": "Eleanor's career hinges on her reputation at the hotel.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Eleanor speaks with measured precision, her words chosen carefully, often laced with subtle sarcasm when discussing the absurdities of hotel management.",
    "signatureTic": "Ah, the joys of hospitality.",
    "internalConflict": "Eleanor grapples with guilt over the affair, torn between her past desires and her present need for respectability.",
    "personalStakeInCase": "The murder investigation could expose her sordid past, potentially costing her the hotel and her reputation.",
    "paragraphs": [
      "As the sun dipped below the horizon, casting long shadows across the vintage seaside hotel, Eleanor Voss stood behind the reception desk, her fingers dancing across the polished wood. She was the embodiment of grace under pressure, her every move calculated to maintain the facade of a perfect hotel manager. Yet, beneath her composed exterior lay a tempest of emotions, stirred by the specter of a past she desperately wanted to forget. The affair with Hugo Vane had been intoxicating, a brief escape from the tedium of her daily life, but it had soured, leaving her with a bitter taste of regret.",
      "Eleanor's mind raced as she recalled the last confrontation with the victim. He had threatened to expose their affair, his voice dripping with disdain as he made it clear that he would not hesitate to ruin her reputation. The thought of her colleagues whispering behind her back, the snickers at the staff meetings, was enough to send her into a spiral of anxiety. 'Ah, the joys of hospitality,' she would often quip, masking her fears with dry humor, but inside, she was a ticking time bomb, ready to explode at any moment.",
      "When the news of the murder broke, Eleanor felt a strange mix of relief and dread. The threat had been eliminated, but at what cost? She knew she had to tread carefully; suspicion could easily fall upon her. The police would be scrutinizing her alibi, which, while solid, felt precarious. She had been in her office during the time of death, but the walls of that office had heard many secrets, and she feared that they might betray her. With every passing moment, the stakes grew higher, and Eleanor found herself caught in a web of deception, her heart racing with every inquiry.",
      "As she navigated the treacherous waters of suspicion and guilt, Eleanor faced a choice: to seek redemption for her past mistakes or to allow the darkness to consume her. The hotel was not just her workplace; it was her sanctuary, and she would do anything to protect it. But with every new revelation about the murder, the walls began to close in, and Eleanor realized that her carefully constructed life was teetering on the edge of collapse. Would she rise to the occasion or succumb to the shadows of her past?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, the town's dedicated physician, presents a compassionate facade, but beneath it lies a tangled web of malpractice and desperation.",
    "publicPersona": "Compassionate and dedicated, Mallory is the town's trusted physician, known for her medical expertise.",
    "privateSecret": "Mallory is hiding a history of medical malpractice that could resurface with the victim's death.",
    "motiveSeed": "The victim had been threatening to reveal Mallory's past malpractice to the medical board.",
    "motiveStrength": "moderate",
    "alibiWindow": "attended a charity event from six to eight",
    "accessPlausibility": "possible",
    "stakes": "Her medical license is at risk, and exposure could ruin her career.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Mallory's speech is often punctuated by nervous laughter, and she tends to hedge her statements with qualifiers, revealing her inner turmoil.",
    "signatureTic": "Well, that’s just my luck, isn’t it?",
    "internalConflict": "Mallory is haunted by the fear that her past mistakes will come to light, threatening her identity as a healer.",
    "personalStakeInCase": "The murder investigation could expose her malpractice history, destroying her career and reputation.",
    "paragraphs": [
      "Dr. Mallory Finch had always prided herself on being the town's pillar of health, a compassionate healer devoted to her patients. But as she stood in front of the mirror, adjusting her collar before the charity event, she couldn't shake the feeling that her carefully curated image was about to shatter. The whispers of malpractice that had haunted her for years were no longer just hushed rumors; they were a ticking time bomb, ready to explode with the death of Hugo Vane. 'Well, that’s just my luck, isn’t it?' she often mused, her self-deprecating humor a thin veil over her growing anxiety.",
      "At the charity event, surrounded by well-meaning townsfolk, Mallory felt the weight of their expectations pressing down on her. She smiled and laughed, but inside, she was a tempest of worry. The victim had threatened to reveal her past, and the implications were dire. The medical board would not take kindly to her history, and the thought of losing her license sent chills down her spine. As she engaged in small talk, her mind raced with thoughts of how she could possibly navigate this impending disaster.",
      "When the news of Hugo's murder reached her, Mallory's heart sank. Part of her felt relief that the threat had been eliminated, but the other part felt a gnawing dread. The police would undoubtedly look into her past, and her alibi—attending a charity event—felt flimsy at best. 'If only I could just disappear,' she thought, her self-deprecating humor turning into a desperate plea for escape. The stakes had never been higher, and the façade of her life threatened to crumble with each passing moment.",
      "As the investigation unfolded, Mallory found herself at a crossroads. Would she confront her past and seek redemption, or would she allow her desperation to lead her down a darker path? The town trusted her, but trust could easily turn to suspicion, and she was painfully aware of how quickly a reputation could be destroyed. In the shadows of her guilt, Mallory recognized that the truth might be her only salvation, but the fear of exposure loomed larger than ever."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, embodies the stern discipline of military life, but his past involvement in illicit activities threatens to unravel his honor.",
    "publicPersona": "A stern and disciplined figure, Ivor is respected for his military service and unwavering principles.",
    "privateSecret": "Ivor was involved in an illicit arms deal during WWII that the victim discovered and threatened to expose.",
    "motiveSeed": "The victim was about to inform authorities about Ivor's wartime activities.",
    "motiveStrength": "strong",
    "alibiWindow": "was on the beach walking his dog from seven to eight-thirty",
    "accessPlausibility": "possible",
    "stakes": "Ivor's honor and freedom are at stake if the truth about his past comes out.",
    "humourStyle": "blunt",
    "humourLevel": 0.5,
    "speechMannerisms": "Ivor speaks in a commanding tone, with clipped sentences that reflect his military background, often punctuated by blunt observations.",
    "signatureTic": "There’s no room for error.",
    "internalConflict": "Ivor struggles with the weight of his past decisions, torn between his sense of honor and the fear of losing everything.",
    "personalStakeInCase": "The investigation could expose his wartime activities, jeopardizing not only his freedom but also the respect he has earned.",
    "paragraphs": [
      "Captain Ivor Hale had always been a man of principle, his life defined by the rigid codes of the military. As he walked along the beach, his dog trotting obediently beside him, he reflected on the stark contrast between his public persona and the dark secrets he held. 'There’s no room for error,' he often reminded himself, but the truth was that his past was a minefield, and Hugo Vane had been the one holding the detonator. The threat of exposure hung over him like a storm cloud, dark and foreboding.",
      "The news of Hugo's murder hit Ivor like a cannonball. While others might have felt horror or sorrow, he felt a cold sense of pragmatism. The victim had been a loose end, one he had intended to tie up himself. Now, with the police investigating, he needed to navigate this treacherous situation with the precision of a naval operation. His alibi—walking his dog—was solid, but he knew that the truth could surface at any moment, and the stakes had never been higher.",
      "As he returned home, Ivor couldn't shake the feeling of being hunted. The walls of his home, once a sanctuary, now felt like a cage, closing in around him. He had fought for honor in the war, yet here he was, embroiled in a scandal that threatened to strip him of everything he had earned. His past actions loomed large, and he was torn between the desire to protect his reputation and the reality of his choices. 'You reap what you sow,' he thought bitterly, the weight of his decisions pressing heavily on his conscience.",
      "With each passing hour, Ivor found himself grappling with the question of redemption. Could he confront his past and seek a path toward honor, or would he be consumed by the very shadows he had tried to escape? The investigation was a reminder that secrets have a way of surfacing, and in the end, it was not just his freedom at stake but the legacy he would leave behind. As he prepared for the inevitable confrontation with the truth, Ivor steeled himself for a battle that would determine not only his fate but the very essence of his being."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a vibrant fashion designer, masks her financial struggles with charm, but the threat of losing her investor looms large over her dreams.",
    "publicPersona": "Beatrice is charming and trendy, known for her innovative designs and vibrant personality.",
    "privateSecret": "Beatrice was in debt due to her failed fashion line, and the victim was her investor who threatened withdrawal.",
    "motiveSeed": "The victim's decision to withdraw funding would have ruined Beatrice's career.",
    "motiveStrength": "weak",
    "alibiWindow": "was at a fitting from eight to nine",
    "accessPlausibility": "possible",
    "stakes": "Beatrice's dream of becoming a renowned designer hangs by a thread.",
    "humourStyle": "observational",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively cadence, often punctuating her thoughts with dramatic flair and observational humor about the world of fashion.",
    "signatureTic": "Can you believe it?",
    "internalConflict": "Beatrice is torn between her ambition and the fear of failure, haunted by the possibility of losing everything she has worked for.",
    "personalStakeInCase": "The investigation could jeopardize her dreams and future in the fashion industry, forcing her to confront her financial reality.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of charm, her vibrant personality lighting up any room she entered. As a fashion designer, she thrived on creativity and innovation, but beneath the surface, her life was a chaotic tapestry of debt and desperation. The victim, Hugo Vane, had been her investor, the lifeline she desperately needed to keep her fashion line afloat. 'Can you believe it?' she would exclaim, her observational humor a mask for the turmoil bubbling beneath her glamorous exterior. Losing him would mean losing everything she had worked so hard to achieve.",
      "At a fitting, surrounded by bolts of fabric and sketches of her latest designs, Beatrice tried to focus on her work, but her mind was clouded with worry. Hugo had threatened to withdraw funding, and the thought of being left with a failed line haunted her. Each stitch felt like a reminder of her precarious situation, and she couldn't escape the feeling that time was running out. The vibrant colors of her designs clashed with the gray clouds gathering in her mind, and she struggled to maintain her usual buoyancy.",
      "When the news of Hugo's murder reached her, Beatrice felt a jolt of shock, quickly followed by a wave of guilt. While others mourned, she couldn't help but feel an overwhelming sense of relief. The threat was gone, but the implications of his death weighed heavily on her conscience. The police would undoubtedly scrutinize her alibi—at a fitting during the time of death—and she feared that her financial struggles would come to light, exposing her vulnerabilities to the world.",
      "As the investigation unfolded, Beatrice found herself at a crossroads. Would she rise to the challenge and fight for her dreams, or would she let her fears consume her? The world of fashion was unforgiving, and she knew that the stakes had never been higher. In the shadows of her ambition, Beatrice grappled with the reality of her situation, determined to navigate the treacherous waters of suspicion while clinging to the hope of a brighter future. In a world where appearances were everything, she would need to summon every ounce of creativity and resilience to survive."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, an investigative journalist, is driven by her quest for truth, but her recent conflict with the victim threatens to derail her career.",
    "publicPersona": "Sylvia is sharp and opinionated, known for her insightful articles and relentless pursuit of the truth.",
    "privateSecret": "Sylvia had recently uncovered a scandal involving the victim, leading to tension between them.",
    "motiveSeed": "The victim had threatened to sue her for defamation if she published the story.",
    "motiveStrength": "compelling",
    "alibiWindow": "was interviewing guests from eight to nine",
    "accessPlausibility": "easy",
    "stakes": "Sylvia's career and credibility as a journalist are on the line.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a confident tone, her words flowing with clarity and precision, often laced with sharp observations about the world around her.",
    "signatureTic": "Truth is a slippery thing.",
    "internalConflict": "Sylvia struggles with the fear that her pursuit of truth may have led to unintended consequences, blurring the lines between justice and vengeance.",
    "personalStakeInCase": "The investigation could jeopardize her career and credibility, forcing her to confront the consequences of her actions.",
    "paragraphs": [
      "Sylvia Trent had made a name for herself as a sharp and opinionated journalist, her relentless pursuit of truth earning her both accolades and enemies. As she paced her cluttered office, the weight of her recent conflict with Hugo Vane loomed large. She had uncovered a scandal involving him, a story that could have made her career, but now it felt like a double-edged sword. 'Truth is a slippery thing,' she often remarked, her dry wit a defense against the chaos that threatened to engulf her. Hugo had threatened to sue her for defamation, and the stakes had never been higher.",
      "While interviewing guests at a charity event, Sylvia's mind raced with thoughts of her article and the potential consequences of publishing it. The tension between herself and Hugo had simmered to a boiling point, and now, with his murder, she felt a mix of dread and curiosity. The police would undoubtedly look into her past interactions with him, and her alibi—interviewing guests—was solid, but the shadows of suspicion crept closer. The investigation could unravel everything she had worked for, and the fear of being labeled as a suspect gnawed at her.",
      "When the news broke, Sylvia felt a strange sense of loss amid the chaos. Hugo had been a compelling figure, and while their relationship had been fraught with tension, she couldn't deny the impact he had on her career. Now, with him gone, she was forced to confront the reality that her pursuit of truth might have inadvertently led to his demise. The lines between justice and vengeance blurred, and Sylvia found herself grappling with the moral implications of her work. Was she a seeker of truth or a harbinger of destruction?",
      "As the investigation unfolded, Sylvia faced the challenge of proving her worth as a journalist while navigating the murky waters of suspicion. The stakes were personal—her career and credibility hung in the balance. In the quest for truth, she realized that the path was fraught with peril, and the consequences of her actions could lead to her downfall. Would she rise to the occasion and uncover the truth behind Hugo's murder, or would her biases cloud her judgment, leading her down a dark path she couldn't escape?"
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Oceancrest Hotel",
    "type": "hotel",
    "place": "Dovercourt",
    "country": "England",
    "summary": "A vintage seaside hotel with Art Deco design, perched on cliffs overlooking the turbulent North Sea.",
    "visualDescription": "The Oceancrest Hotel boasts sweeping ocean views, with its bold geometric lines and polished chrome accents reflecting the fading glamour of the 1940s. The grand lobby features a high ceiling adorned with intricate murals, and plush velvet furnishings arranged around a central chandelier, casting a dim, golden light.",
    "atmosphere": "A sense of foreboding lingers in the air as the sea churns below, echoing the tension that grips the guests within.",
    "paragraphs": [
      "The Oceancrest Hotel stands defiantly against the backdrop of a stormy sky, its Art Deco façade a relic of a more glamorous time. Guests arriving through the heavy oak doors are greeted by the muted hum of a radio broadcasting the latest news, a constant reminder of the world beyond the cliffs. The air is thick with the scent of salt and dampness, mingling with the faint aroma of old tobacco lingering from the smoking lounge. Each step on the polished marble floor reverberates through the cavernous lobby, where the hushed conversations of anxious guests create an atmosphere laden with unspoken fears.",
      "As the clouds gather ominously overhead, the lobby's grand windows frame the churning sea, waves crashing violently against the rocks below. The muted light casts long shadows, making the narrow hallways seem even more confining. Guests move cautiously, exchanging glances filled with suspicion, as whispers of a recent tragedy circulate. The hotel’s isolation amplifies the sense of dread, with stormy weather threatening to cut off communication with the outside world. Alone in their rooms, guests are left to ponder their secrets, while the staff, bound by strict protocols, navigate the tension with wary eyes.",
      "In the evenings, the atmosphere shifts as the sun dips below the horizon, the hotel transforming into a stage for secrets and intrigue. Flickering gas lamps cast a warm glow, but the shadows seem to deepen, cloaking the corners of the grand lobby. The sound of distant thunder rumbles through the air, a reminder of the tempest brewing outside. Guests gather in small groups, their voices low as they speculate about the recent events that have cast a pall over their seaside retreat. The hotel, once a sanctuary, now feels like a gilded cage, with unseen dangers lurking just out of sight."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with a chance of rain",
    "timeFlow": "Three days of mounting tension as secrets unfold",
    "mood": "tense and anxious due to recent events",
    "eraMarkers": [
      "ubiquitous radios playing news broadcasts",
      "Art Deco design elements",
      "restricted staff-only areas"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and damp wood",
      "secondary": [
        "flickering gas lamps",
        "distant thunder rumbling"
      ]
    },
    "paragraphs": [
      "The air is heavy with anticipation, thick with the scent of brine and wet earth as storm clouds loom. The sound of waves crashing against the cliffs below mixes with the low hum of radios, broadcasting both music and grim tidings from the outside world. In this vintage hotel, the weight of history and the specter of war linger in the corners, giving each moment a sense of urgency and dread.",
      "As guests move through the ornate lobbies and narrow hallways, the tension is palpable – whispers echo in the dim light, secrets exchanged in furtive glances. The isolation of the hotel, perched on the cliffside, becomes a character in itself, amplifying the sense of entrapment and desperation as the storm approaches, both outside and within."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "High ceiling with ornate murals, plush velvet furniture, polished marble floors",
      "sensoryDetails": {
        "sights": [
          "flickering gas lamps",
          "dimly lit chandeliers",
          "ornate Art Deco motifs",
          "sea views through large windows",
          "shadows of anxious guests"
        ],
        "sounds": [
          "murmurs of hushed conversations",
          "the crackle of radio broadcasts",
          "distant thunder rumbling",
          "footsteps echoing on marble",
          "the creak of old wooden furniture"
        ],
        "smells": [
          "salt air from the ocean",
          "damp wood and mildew",
          "old tobacco smoke",
          "polished marble and leather",
          "faint perfume lingering in the air"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft velvet upholstery",
          "cold metal of brass fittings",
          "chill from the open windows",
          "textured wallpaper peeling at the edges"
        ]
      },
      "accessControl": "Guests check in at the front desk; staff access required for cleaning and maintenance; restricted areas after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light filtering through clouds",
            "puddles forming in the lobby",
            "faded floral arrangements",
            "wet footprints on marble"
          ],
          "sounds": [
            "steady drumming of rain",
            "water dripping from eaves",
            "the rustle of newspapers",
            "the hum of a radio in the background",
            "the creak of the lobby doors"
          ],
          "smells": [
            "damp earth and seaweed",
            "mold and mildew",
            "freshly brewed coffee",
            "wet stones",
            "old paper and ink"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat, grey light",
            "shadows creeping along the floor",
            "ghostly reflections in glass",
            "figures silhouetted against the windows",
            "dust motes dancing in the air"
          ],
          "sounds": [
            "silence punctuated by a distant clock",
            "the rustle of heavy curtains",
            "soft footfalls on marble",
            "the low hum of conversation",
            "the clicking of heels on the floor"
          ],
          "smells": [
            "beeswax from polished surfaces",
            "dust and aged wood",
            "the faint scent of rain",
            "cigar smoke lingering",
            "the aroma of tea brewing"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering in sconces",
            "glistening sea under moonlight",
            "glint of silverware on tables",
            "guests dressed in evening attire"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "laughter from the dining room",
            "distant music from a radio",
            "the clinking of glasses",
            "the soft rustle of evening gowns"
          ],
          "smells": [
            "candle wax melting",
            "freshly baked bread",
            "cooked seafood wafting",
            "the scent of cologne",
            "the aroma of rich desserts"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby, with its soaring ceilings and plush furnishings, serves as the heart of the Oceancrest Hotel. It is here that the recent tragedy unfolded, shrouded in whispers and frantic glances. Guests gather beneath the gilded chandeliers, their faces etched with concern as they attempt to piece together the events of that fateful night. The flickering gas lamps cast shadows that seem to dance with secrets, while the distant rumble of thunder outside mirrors the turmoil within the hotel's walls.",
        "As rain begins to patter against the windows, the atmosphere thickens with tension. The scent of damp wood and salt air mixes with the faint aroma of tobacco lingering in the corners. The lobby, once a welcoming space, now feels like a trap, each creak of the floor echoing the growing anxiety of its inhabitants. Guests exchange furtive glances, their conversations hushed as they speculate about the mystery that has taken hold of their seaside retreat."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Elegant furnishings, large bay windows with ocean views, dark wood paneling",
      "sensoryDetails": {
        "sights": [
          "richly patterned upholstery",
          "large bay windows overlooking the sea",
          "dark wood paneling",
          "portraits of past guests",
          "flickering firelight"
        ],
        "sounds": [
          "crackling fireplace",
          "soft laughter",
          "clinking of tea cups",
          "the rustle of newspapers",
          "the distant sound of waves crashing"
        ],
        "smells": [
          "freshly brewed tea",
          "smoky wood from the fireplace",
          "faded leather books",
          "hint of floral arrangements",
          "the scent of polished wood"
        ],
        "tactile": [
          "soft cushions on armchairs",
          "warmth from the fireplace",
          "smooth wood surfaces",
          "cool glass of window panes",
          "textured fabric of curtains"
        ]
      },
      "accessControl": "Open to guests during daylight hours; staff only access after 10 PM.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft light through rain-soaked windows",
            "mist rolling in from the sea",
            "water droplets on glass",
            "puddles forming outside",
            "the grey horizon"
          ],
          "sounds": [
            "gentle patter of rain",
            "the distant sound of thunder",
            "the crackle of a fire starting",
            "soft voices discussing the weather",
            "the rustle of newspapers"
          ],
          "smells": [
            "fresh rain on foliage",
            "the scent of wet earth",
            "the aroma of breakfast wafting",
            "smoky wood igniting",
            "the faint perfume of flowers"
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "shadows creeping across the room",
            "the sea appearing leaden",
            "faded photographs on the walls",
            "glistening surfaces from the rain"
          ],
          "sounds": [
            "the ticking of a clock",
            "the rustle of heavy curtains",
            "soft conversations",
            "the distant sound of waves crashing",
            "the occasional cough"
          ],
          "smells": [
            "the scent of damp wood",
            "the aroma of old books",
            "freshly brewed tea",
            "the faint smell of mildew",
            "the scent of polished surfaces"
          ],
          "mood": "pensive"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from the fireplace",
            "the glow of lamps casting shadows",
            "the sparkling sea under moonlight",
            "guests gathered in small groups",
            "the flicker of candle flames"
          ],
          "sounds": [
            "soft music playing",
            "the crackle of the fire",
            "laughter and chatter",
            "the clinking of glasses",
            "the distant sound of waves"
          ],
          "smells": [
            "the scent of burning logs",
            "the aroma of dinner being served",
            "the freshness of sea air",
            "the faint scent of cologne",
            "the fragrance of blooming flowers"
          ],
          "mood": "cozy warmth"
        }
      ],
      "paragraphs": [
        "The Drawing Room, with its elegant décor and inviting ambiance, offers a respite for guests seeking solace from the storm outside. Here, the crackling fireplace offers warmth, and the scent of freshly brewed tea fills the air, mingling with the faint aroma of old leather books lining the shelves. Large bay windows frame the tumultuous sea, where waves crash in an endless rhythm, providing a stark contrast to the tranquility within. Guests gather in small clusters, their voices low as they share hushed conversations, the tension palpable as they navigate the recent events that have cast a shadow over their retreat.",
        "As the afternoon wears on, the dim light filtering through the clouds turns the room into a sanctuary of shadows. The sound of rain pattering against the windows creates a soothing backdrop to the anxious whispers, while the flickering firelight dances across the faces of the guests, revealing fleeting expressions of concern and curiosity. The Drawing Room, once a place of laughter and camaraderie, now feels like a stage for secrets and suspicions, as everyone wonders who among them may hold the key to the mystery unraveling in their midst."
      ]
    },
    {
      "id": "staff_quarters",
      "name": "Staff Quarters",
      "type": "interior",
      "purpose": "Restricted access area",
      "visualDetails": "Simple furnishings, utilitarian decor, narrow hallways",
      "sensoryDetails": {
        "sights": [
          "bare walls with peeling paint",
          "dimly lit corridors",
          "functional furniture",
          "locked cabinets",
          "staff-only signs"
        ],
        "sounds": [
          "muffled footsteps",
          "whispers among staff",
          "the creak of old floorboards",
          "the sound of doors opening",
          "distant laughter from the lobby"
        ],
        "smells": [
          "cleaning supplies",
          "the scent of old wood",
          "cooked meals from the kitchen",
          "dampness in the air",
          "the faint odor of mildew"
        ],
        "tactile": [
          "rough wooden floorboards",
          "cool metal of door handles",
          "stiff bedding on cots",
          "textured fabric of uniforms",
          "hard wooden chairs"
        ]
      },
      "accessControl": "Restricted to hotel staff only; guests prohibited from entering without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light struggling through windows",
            "dripping water from eaves",
            "wet floors",
            "staff huddled in corners"
          ],
          "sounds": [
            "the sound of rain pounding on the roof",
            "the rustle of uniforms",
            "soft voices discussing chores",
            "the distant sound of thunder",
            "the clatter of dishes from the kitchen"
          ],
          "smells": [
            "the aroma of coffee brewing",
            "the scent of damp earth",
            "cleaning products lingering",
            "the faint smell of cooking",
            "the metallic scent of old pipes"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light filtering through windows",
            "staff moving quickly through hallways",
            "shadows pooling in corners",
            "the clutter of cleaning supplies",
            "the distant view of the sea"
          ],
          "sounds": [
            "the clanging of pots and pans",
            "soft chatter among staff",
            "the rustle of cleaning rags",
            "the distant sound of guests laughing",
            "the creaking of old furniture"
          ],
          "smells": [
            "the scent of fresh linens",
            "the aroma of cleaning solutions",
            "the faint smell of food",
            "the dampness of the walls",
            "the odor of old wood"
          ],
          "mood": "busy urgency"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light from overhead bulbs",
            "shadows lengthening in the corners",
            "staff relaxing after hours",
            "the glow of the setting sun",
            "the distant view of the sea"
          ],
          "sounds": [
            "soft laughter among staff",
            "the clinking of dishes",
            "the hum of conversations",
            "the distant sound of waves",
            "the creaking of the building settling"
          ],
          "smells": [
            "the aroma of dinner being served",
            "the scent of fresh bread",
            "the lingering smell of cleaning products",
            "the warmth of cooked food",
            "the faint scent of flowers from the lobby"
          ],
          "mood": "relaxed camaraderie"
        }
      ],
      "paragraphs": [
        "The Staff Quarters, tucked away from the guests' eyes, offer a glimpse into the lives of those who keep the hotel running. The narrow hallways are dimly lit, with peeling paint and utilitarian decor that speaks to a life of service. Here, staff members gather, exchanging whispers and glances filled with understanding, their faces reflecting the weight of the recent tragedy. The scent of cleaning supplies mingles with the aroma of food wafting from the kitchen, creating an atmosphere that is both familiar and fraught with tension.",
        "As the rain drums steadily against the roof, the urgency of the staff's duties grows. The sound of pots clanging and soft conversations fills the air, a stark contrast to the hushed tones of the guests above. In this hidden world, secrets are shared in the shadows, and the camaraderie among the staff serves as a lifeline amidst the growing unease. The Staff Quarters, often overlooked, become a crucial backdrop to the unfolding mystery, as those who work behind the scenes hold the key to the truth."
      ]
    },
    {
      "id": "ocean_view_balcony",
      "name": "Ocean View Balcony",
      "type": "exterior",
      "purpose": "Isolation and observation point",
      "visualDetails": "Expansive views of the sea, wrought iron railing, weathered wooden floor",
      "sensoryDetails": {
        "sights": [
          "vast sea stretching to the horizon",
          "waves crashing against the cliffs",
          "glistening wet balcony floor",
          "clouds swirling overhead",
          "seagulls soaring in the wind"
        ],
        "sounds": [
          "roaring waves below",
          "howling wind",
          "distant calls of seabirds",
          "the rustle of fabric in the breeze",
          "the creaking of the balcony railing"
        ],
        "smells": [
          "fresh sea air",
          "salt spray from the ocean",
          "the scent of rain on the breeze",
          "the aroma of wet wood",
          "the faint smell of sunscreen"
        ],
        "tactile": [
          "rough texture of weathered wood",
          "cold metal of the railing",
          "soft fabric of a coat against the wind",
          "the chill of ocean spray",
          "the warmth of the sun breaking through clouds"
        ]
      },
      "accessControl": "Accessible to all guests during daylight; restricted access during storms.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "drops of rain glistening on the railing",
            "mist obscuring the view",
            "dark sea churning",
            "puddles forming on the balcony"
          ],
          "sounds": [
            "steady rain hitting the balcony",
            "the roar of waves amplified",
            "wind howling through gaps",
            "distant thunder rolling",
            "the flutter of wet clothing"
          ],
          "smells": [
            "damp seaweed",
            "the scent of rain-soaked earth",
            "freshness of wet air",
            "the briny smell of the ocean",
            "the faint aroma of wet stones"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "clouds casting shadows over the sea",
            "the horizon blending into the grey sky",
            "waves crashing with a dull thud",
            "seagulls circling overhead",
            "the balcony slick with moisture"
          ],
          "sounds": [
            "the crashing of waves",
            "the rustling of wind through grass",
            "the occasional call of a gull",
            "the distant sound of conversations",
            "the creaking of the balcony underfoot"
          ],
          "smells": [
            "the salty scent of the ocean",
            "the coolness of sea air",
            "the aroma of wet wood",
            "the faint smell of fish from the market",
            "the scent of damp grass"
          ],
          "mood": "gloomy contemplation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting gold on the waves",
            "the sky painted in hues of orange and pink",
            "the glimmer of stars beginning to appear",
            "the silhouette of cliffs against the fading light",
            "the deep blue of the sea"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant laughter from guests",
            "the soft rustle of leaves in the breeze",
            "the occasional call of a seabird",
            "the creaking of the balcony railing"
          ],
          "smells": [
            "the scent of salt in the air",
            "the fresh aroma of evening dew",
            "the fragrance of blooming flowers",
            "the faint smell of sunscreen",
            "the warmth of the setting sun"
          ],
          "mood": "serene yet tense"
        }
      ],
      "paragraphs": [
        "The Ocean View Balcony offers an expansive vista of the turbulent sea, where waves crash against the cliffs with relentless force. Here, guests often retreat for solitude, seeking solace in the beauty of nature while grappling with their thoughts. The wrought iron railing, weathered by the elements, provides a vantage point that is both breathtaking and precarious. As storm clouds gather overhead, the atmosphere shifts, with the salty air thickening and the distant sound of thunder echoing the turmoil within the hotel.",
        "In the mornings, the balcony is drenched in rain, the landscape shrouded in mist, lending an air of foreboding. The sound of rain mingles with the roar of the sea, creating a symphony of nature that heightens the sense of isolation. As the day progresses, the grey skies cast an eerie pall over the ocean, and the balcony becomes a place for contemplation, where guests ponder the mysteries unfolding within the hotel. Even as the sun sets, casting a golden hue over the waves, an undercurrent of tension remains, reminding all who stand there that beauty can often mask darker truths."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028609218,
  "durationMs": 34734
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1949,
    "month": "March",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "March",
    "weather": [
      "overcast with a chance of rain",
      "cool temperatures ranging from 40 to 55 degrees Fahrenheit",
      "occasional gusts of wind"
    ],
    "daylight": "Days are gradually lengthening, with sunset around six o'clock in the evening, allowing for a glimmer of light even in the late hours.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after the hotel dining room has emptied.",
    "holidays": [
      "Easter Sunday falls at the end of the month on March 27"
    ],
    "seasonalActivities": [
      "attending local spring festivals",
      "spring cleaning in homes",
      "enjoying the early blooms in public parks"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "white dress shirt with a narrow tie",
        "black leather shoes"
      ],
      "casual": [
        "tweed blazer with gray trousers",
        "button-up shirt with rolled sleeves",
        "brown loafers"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "silver cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length floral dress",
        "tailored wool coat",
        "matching gloves and handbag"
      ],
      "casual": [
        "pencil skirt with a fitted blouse",
        "cardigan sweater",
        "simple ballet flats"
      ],
      "accessories": [
        "string of pearls",
        "wide-brimmed hat",
        "silk scarf"
      ]
    },
    "trendsOfTheMoment": [
      "bold floral patterns",
      "tailored silhouettes",
      "use of pastel colors in clothing"
    ],
    "socialExpectations": [
      "men are expected to wear suits for formal occasions",
      "women increasingly wear practical yet stylish outfits for work",
      "social gatherings often involve a dress code"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Tensions rise as the Iron Curtain tightens over Eastern Europe",
      "The Marshall Plan continues to aid European recovery",
      "The first session of the United Nations General Assembly is underway"
    ],
    "politicalClimate": "The political landscape is fraught with anxiety as the Cold War begins to shape international relations, with an ongoing arms race and ideological battles.",
    "economicConditions": "Post-war recovery is in full swing, though rationing still impacts certain goods, and inflation concerns are starting to surface.",
    "socialIssues": [
      "Gender roles are shifting as women remain in the workforce post-war",
      "Civil rights movements begin to gain traction",
      "Labor strikes occur sporadically due to economic pressures"
    ],
    "internationalNews": [
      "Soviet Union's actions in Eastern Europe draw criticism",
      "Tensions over the Berlin Blockade continue to simmer",
      "NATO discussions are beginning to take shape"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Tennessee Waltz' by Patti Page",
        "'Mule Train' by Frankie Laine",
        "'Aba Daba Honeymoon' by Debbie Reynolds and Carleton Carpenter"
      ],
      "films": [
        "'The Third Man'",
        "'All the King's Men'",
        "'The Naked City'"
      ],
      "theater": [
        "'Death of a Salesman'",
        "'South Pacific'",
        "'The Glass Menagerie'"
      ],
      "radio": [
        "'The Shadow'",
        "'Suspense'",
        "'The Jack Benny Program'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'1984' by George Orwell",
        "'The Catcher in the Rye' by J.D. Salinger",
        "'Fahrenheit 451' by Ray Bradbury"
      ],
      "popularGenres": [
        "mystery",
        "science fiction",
        "social commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "the first commercial jet airliner",
        "early computer prototypes"
      ],
      "commonDevices": [
        "vacuum cleaners",
        "television sets",
        "automatic washing machines"
      ],
      "emergingTrends": [
        "growth of suburban living",
        "increasing use of home appliances",
        "early adoption of color television"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Pint of milk: six pence"
      ],
      "commonActivities": [
        "gathering for community events",
        "enjoying picnics as the weather warms",
        "visiting local markets"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "community dances",
        "weekly church services"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "A growing middle class is emerging post-war",
      "There is a divide between urban and rural lifestyles",
      "Class distinctions are still pronounced in social settings"
    ],
    "gender": [
      "Women have taken on more roles in the workforce and are seeking greater independence",
      "Traditional gender roles are being challenged",
      "Expectations for women to balance work and family life are increasing"
    ],
    "race": [
      "Tensions are rising regarding civil rights, especially in the Southern United States",
      "Integration efforts are met with resistance",
      "Awareness of racial inequality is growing among the populace"
    ],
    "generalNorms": [
      "Conformity is valued, yet there is a burgeoning desire for individuality",
      "Social gatherings often require a certain decorum",
      "Community involvement is encouraged"
    ]
  },
  "atmosphericDetails": [
    "The air is filled with the scent of damp earth as the spring thaw begins, mingling with the faint smell of smoke from distant chimneys.",
    "The soft patter of raindrops against the hotel windows creates a rhythmic backdrop, punctuating the anxious conversations of guests gathered in the lounge.",
    "The muted colors of the overcast sky cast a somber tone over the bustling hotel lobby, where whispers of recent political unrest hang heavy in the air."
  ],
  "paragraphs": [
    "March 1949 ushers in the cool, damp breath of spring, as the overcast sky looms heavy with the promise of rain. Tension thrums through the air of the hotel, where guests, wrapped in tailored coats and floral dresses, discuss the latest news from Europe. The Iron Curtain has drawn tighter, and whispers of unrest ripple through the crowd as they sip their tea, casting furtive glances at one another, the atmosphere thick with unspoken worry.",
    "Fashion in this era reflects the duality of post-war life; men don crisp, double-breasted suits paired with polished shoes, while women embrace bold floral patterns in their tea-length dresses. Accessories like fedora hats and string pearls add a touch of elegance, even amidst the anxiety of the times. The hotel, with its muted decor and flickering lights, serves as a microcosm of society, showcasing the evolving roles of men and women as they navigate a world still reeling from the impacts of war.",
    "Daily life in March 1949 is filled with the remnants of wartime rationing, yet there is a sense of optimism as communities come together for spring festivals. Families gather for Sunday dinners, and community dances enliven the evenings. However, the specter of social issues looms large, with conversations about civil rights and gender equality bubbling just beneath the surface. As guests at the hotel engage in polite conversation, their minds are preoccupied with the shifting landscape of their world, making every encounter feel charged with both uncertainty and hope."
  ],
  "note": "",
  "cost": 0.0010841209500000002,
  "durationMs": 21558
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a vintage seaside hotel for a charity gala becomes fraught with tension as the specter of recent tragedies and societal upheaval looms over the attendees, binding them in shared anxiety and suspicion.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII has reshaped class dynamics, with women entering the workforce and tensions rising amid the early Cold War, creating a charged atmosphere of uncertainty and competition."
  },
  "setting": {
    "location": "A vintage seaside hotel perched on a cliffside overlooking the ocean",
    "institution": "hotel",
    "weather": "overcast with a chance of rain"
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
    "id": "tide_peak_time",
    "value": "ten minutes past twelve",
    "description": "The actual time the tide reached its peak on the day of the drowning."
  },
  {
    "id": "victim_fall_time",
    "value": "twenty past midnight",
    "description": "The specific time that the victim was last seen alive."
  },
  {
    "id": "tide_chart_date",
    "value": "the thirteenth of July",
    "description": "The date referenced for the tide chart discrepancies."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 22,
  "countsByPlacement": {
    "early": 7,
    "mid": 14,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 21,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
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
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "physical"
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
      "category": "behavioral"
    },
    {
      "id": "clue_10",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
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
      "category": "spatial"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_id_3",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_id_4",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_id_6",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
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
      "category": "spatial"
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
