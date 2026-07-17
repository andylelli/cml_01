# Actual Prompt Record

- Run ID: `mystery-1784240688362`
- Project ID: ``
- Timestamp: `2026-07-16T22:28:17.941Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `bc223552a7211d57`

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
    "title": "Death in the Tea Room",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Coastal Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "poisoning"
    }
  },
  "death_method": "poisoned with a botanical toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Astute investigator",
      "private_secret": "Struggles with self-doubt",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "during the tea party",
      "access_plausibility": "high",
      "opportunity_channels": [
        "observing guests",
        "interacting with staff"
      ],
      "behavioral_tells": [
        "calm under pressure"
      ],
      "stakes": "solving the murder",
      "evidence_sensitivity": [
        "sensitive to clues"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "friend of Eleanor",
        "medical advisor"
      ],
      "public_persona": "Reputable physician",
      "private_secret": "Had a secret affair",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "during the tea party",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [
        "appeared healthy before collapse"
      ],
      "stakes": "none (deceased)",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Friend",
      "relationships": [
        "former military",
        "acquaintance of Dr. Finch"
      ],
      "public_persona": "Charming and sociable",
      "private_secret": "Resentful of Dr. Finch's success",
      "motive_seed": "jealousy",
      "motive_strength": "moderate",
      "alibi_window": "during the tea party",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "served tea",
        "access to kitchen"
      ],
      "behavioral_tells": [
        "defensive when questioned"
      ],
      "stakes": "maintaining reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Acquaintance",
      "relationships": [
        "works with Dr. Finch"
      ],
      "public_persona": "Eager assistant",
      "private_secret": "Had a crush on Dr. Finch",
      "motive_seed": "unrequited love",
      "motive_strength": "weak",
      "alibi_window": "during the tea party",
      "access_plausibility": "high",
      "opportunity_channels": [
        "served tea",
        "frequent interaction"
      ],
      "behavioral_tells": [
        "nervous around Captain Hale"
      ],
      "stakes": "none",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Guest",
      "relationships": [
        "friend of Dr. Finch"
      ],
      "public_persona": "Socialite",
      "private_secret": "Involved in a business venture with Dr. Finch",
      "motive_seed": "financial interests",
      "motive_strength": "high",
      "alibi_window": "during the tea party",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "shared drinks",
        "personal conversations"
      ],
      "behavioral_tells": [
        "overly defensive about finances"
      ],
      "stakes": "personal investment",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Hotel Manager",
      "relationships": [
        "overseeing the event"
      ],
      "public_persona": "Polite and attentive",
      "private_secret": "Hiding debts",
      "motive_seed": "financial desperation",
      "motive_strength": "weak",
      "alibi_window": "during the tea party",
      "access_plausibility": "high",
      "opportunity_channels": [
        "control over staff"
      ],
      "behavioral_tells": [
        "sweaty during questioning"
      ],
      "stakes": "keeping hotel reputation",
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
      "summary": "During a dreary afternoon at a coastal hotel, Dr. Mallory Finch collapses during tea, leading to an investigation uncovering jealousy, personal betrayal, and a clever poison mechanism."
    },
    "accepted_facts": [
      "Dr. Mallory Finch attended the tea party.",
      "Guests reported Dr. Finch was engaging until her sudden illness.",
      "Captain Hale was in close proximity to Dr. Finch during tea."
    ],
    "inferred_conclusions": [
      "The poison was ingested during the tea party.",
      "The timing of symptoms suggests a delayed reaction.",
      "Captain Hale had the motive and opportunity."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The poison from a rare flower was brewed in the tea, taking hours to show symptoms.",
      "delivery_path": [
        {
          "step": "The tea is served to guests at precisely half past five."
        },
        {
          "step": "Dr. Finch consumes the tea without knowledge of its contents."
        },
        {
          "step": "Symptoms manifest hours later, leading to misattributed timing."
        }
      ]
    },
    "outcome": {
      "result": "Dr. Finch's death is misattributed to natural causes due to the delayed reaction of the poison."
    }
  },
  "false_assumption": {
    "statement": "Dr. Finch died from natural causes due to her known health issues.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses recall her engaging and healthy demeanor moments before collapse.",
    "what_it_hides": "The true timing and method of poisoning, obscured by social interactions."
  },
  "false_solution": {
    "accused_suspect": "Sylvia Trent",
    "supporting_points": [
      "Sylvia had financial dealings with Dr. Finch and stood to gain from her death.",
      "Witnesses noted Sylvia seemed nervous during tea."
    ],
    "the_one_flaw": "Sylvia had been seen conversing with Dr. Finch continuously, making it unlikely she could poison her directly.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Captain Hale was seen mixing the tea.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was merely serving and had no knowledge of the poison.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Dr. Finch had a history of sudden health issues.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "Her previous health issues were unrelated to her sudden collapse from poison.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the tea party and had the opportunity to poison Dr. Finch."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "tea served at half past five",
        "Dr. Finch collapsed at six"
      ],
      "windows": [
        "symptoms appeared two hours after ingestion"
      ],
      "contradictions": [
        "Witnesses claim Dr. Finch was healthy moments before collapse."
      ]
    },
    "access": {
      "actors": [
        "Captain Hale",
        "Hugo Vane"
      ],
      "objects": [
        "tea set",
        "kitchen supplies"
      ],
      "permissions": [
        "Hugo Vane had access to all areas of the hotel."
      ]
    },
    "physical": {
      "laws": [
        "Poison effects manifest after a delay."
      ],
      "traces": [
        "Tea set with residue of rare flower."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust the hotel staff implicitly."
      ],
      "authority_sources": [
        "Hugo Vane as hotel manager has authority over all operations."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Guests noted Dr. Finch engaging in conversation before her collapse.",
        "correction": "This indicates she did not show signs of distress until after tea.",
        "effect": "Narrows the timeline of poisoning to within tea service.",
        "required_evidence": [
          "Guests' statements about Dr. Finch's demeanor",
          "Time of tea service"
        ],
        "reader_observable": true
      },
      {
        "observation": "The tea set was found with residue from the rare flower.",
        "correction": "This confirms the presence of the poison in the tea consumed by Dr. Finch.",
        "effect": "Eliminates the possibility of natural causes as the sole reason for her symptoms.",
        "required_evidence": [
          "Evidence of the rare flower's residue in the tea set",
          "Reports of the flower's toxic effects"
        ],
        "reader_observable": true
      },
      {
        "observation": "Captain Hale mixed the tea but claimed it was prepared by the staff.",
        "correction": "This discrepancy suggests he may have tampered with the tea.",
        "effect": "Narrows suspicion towards Captain Hale.",
        "required_evidence": [
          "Hale's testimony about tea preparation",
          "Witness accounts of Hale's actions"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares service, noted, and engag against the claimed timeline.",
    "knowledge_revealed": "The residue in the tea set and Hale's proximity during service prove he had the opportunity and means to poison.",
    "pass_condition": "If Hale cannot explain the residue found in the tea set, he is identified as the culprit.",
    "evidence_clues": [
      "clue_culprit_direct_1",
      "clue_3",
      "clue_4",
      "clue_culprit_direct_captain_ivor_hale"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements (early) confirm Dr. Finch's health before the tea. Step 2: The residue found (mid) points to poisoning. Step 3: Hale's contradictory claims during the test (discriminating test) reveal his guilt."
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
      "test_type": "behavioral"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Beatrice was serving the tea and had no access to the poison.",
        "supporting_clues": [
          "serving records"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Sylvia's conversation with Dr. Finch ruled out her involvement during the tea.",
        "supporting_clues": [
          "conversation testimony"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Hugo's managerial responsibilities kept him from direct contact with the tea.",
        "supporting_clues": [
          "staff testimony"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: during the tea party",
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
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_6",
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
    "summary": "A traveling journalist with a penchant for uncovering the truth, Eleanor Voss finds herself navigating a web of deceit and danger at a coastal hotel where a murder has just occurred.",
    "publicPersona": "Charming and inquisitive, known for her insightful articles on social issues.",
    "privateSecret": "Struggles with an addiction to alcohol, often using it to cope with her past traumas.",
    "motiveSeed": "Curiosity about the affluent guests and a desire to write a compelling story.",
    "motiveStrength": "moderate",
    "alibiWindow": "Present at the hotel for a guest article when the murder occurred.",
    "accessPlausibility": "easy",
    "stakes": "Her reputation as a journalist hinges on uncovering the truth behind the murder.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Eleanor speaks with a keen edge, often peppering her observations with a sardonic undertone. She has a habit of raising an eyebrow when she questions someone's motives.",
    "signatureTic": "Well, isn't that just delightful?",
    "internalConflict": "Eleanor battles with her addiction, which often clouds her judgment and leads her to question her own capabilities as a journalist.",
    "personalStakeInCase": "This crime matters to Eleanor because it could define her career, offering a chance to redeem herself from the shadows of her past.",
    "paragraphs": [
      "Eleanor Voss stood at the edge of the hotel terrace, the salty breeze tousling her hair as she gazed out at the tumultuous waves crashing against the rocks below. It was a picturesque setting, the kind that promised tranquility, yet the air was thick with tension and the scent of blood. A murder had transpired in the very tea room she was meant to write about, and as a journalist, her curiosity was piqued. But beneath her charming exterior lay a tumultuous sea of personal demons, primarily her struggle with alcohol, which often beckoned her with its siren call.",
      "With her notepad in hand, Eleanor approached the gathered guests, her charm woven into every inquiry. 'What a delightful gathering we have here,' she quipped, masking her inner turmoil with a veneer of professionalism. Yet, as she listened to the hushed whispers and furtive glances, she couldn't shake the feeling that the murder was not merely an unfortunate event but a key to unraveling a greater story — one that might just save her floundering reputation.",
      "As she delved deeper into the lives of the hotel’s affluent guests, Eleanor found herself grappling with the allure of their world, a world filled with excess and secrets. Her motive for investigating the murder was twofold: the desire to write a compelling story and the need to confront her own past. Each drink she turned to for solace was a reminder of her failures, and she felt the weight of every sip pressing down on her resolve. Could she truly uncover the truth without succumbing to her addiction?",
      "Eleanor's journey through the murky waters of this investigation would force her to confront not only the suspects but also the shadows lurking within her own mind. With each lead she followed, she felt the thrill of the chase rekindle her passion for journalism. If she could piece together the puzzle of the murder, perhaps she could also find a way to piece together her fragmented life."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected physician with a dark secret, Dr. Mallory Finch’s ambition has led her down a treacherous path that culminates in murder.",
    "publicPersona": "Respected doctor with a no-nonsense attitude; advocates for women's health.",
    "privateSecret": "Has been conducting unauthorized experiments on patients to advance her career.",
    "motiveSeed": "Believes the victim threatened her reputation by exposing her unethical practices.",
    "motiveStrength": "strong",
    "alibiWindow": "In the operating room at the time of the murder, but could have left briefly.",
    "accessPlausibility": "possible",
    "stakes": "Loss of her medical license and career if her secret is revealed.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks in clipped, precise sentences, her tone often bordering on harsh. When pressed, her voice takes on a defensive edge, and her eyes narrow with irritation.",
    "signatureTic": "I have no time for foolishness.",
    "internalConflict": "Dr. Finch is haunted by the fear of losing everything she has worked for, grappling with the moral implications of her experiments.",
    "personalStakeInCase": "The murder investigation threatens to expose her unethical practices, which could destroy her career and reputation.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the operating room, her hands steady as she navigated the delicate procedure. To the outside world, she was the epitome of professionalism, a dedicated physician committed to her patients. Yet, beneath her practiced facade lay a tempest of ambition and desperation. The recent murder had sent ripples through the community, but for her, it was a personal crisis — a threat to everything she had built through questionable means.",
      "As she scrubbed her hands and prepared to step out, her mind raced with thoughts of the victim. How dare she threaten to expose the truth? Mallory’s heart raced with the fear of discovery. She had been conducting unauthorized experiments, pushing the boundaries of ethics in her pursuit of medical advancement. The stakes were higher than ever, and the walls were closing in around her.",
      "When the police arrived, Dr. Finch's demeanor remained icy and controlled. 'I have no time for foolishness,' she snapped at the officers, her patience wearing thin. She recounted her alibi with precision, though a flicker of doubt gnawed at her. What if she had left the operating room, even for a moment? The thought was unbearable. The fear of losing her medical license loomed over her like a dark cloud, threatening to rain down ruin.",
      "As the investigation unfolded, Mallory found herself trapped in a web of her own making. Each question posed by the detective felt like a dagger, pricking at her carefully constructed walls. The truth was a double-edged sword — it could either set her free or plunge her deeper into darkness. In the midst of her internal battle, she began to realize that the consequences of her ambition might just be the end of her career."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A charismatic retired naval officer, Captain Ivor Hale's past is riddled with secrets that threaten to surface in the wake of a murder investigation.",
    "publicPersona": "A charismatic military man with strong opinions on loyalty and duty.",
    "privateSecret": "Was involved in smuggling operations during the war and fears exposure.",
    "motiveSeed": "The victim was threatening to expose his wartime activities, risking his reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be at the bar, but no one can confirm his whereabouts during the murder.",
    "accessPlausibility": "possible",
    "stakes": "His past could ruin his current life and relationships.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Captain Hale speaks with a booming, authoritative voice, often punctuating his statements with a hearty laugh. He has a tendency to tell long-winded stories, often losing his audience along the way.",
    "signatureTic": "In my day, we knew how to handle such matters!",
    "internalConflict": "Captain Hale grapples with the guilt of his past actions and the fear of their repercussions on his present life.",
    "personalStakeInCase": "The murder investigation threatens to expose his wartime activities, which could tarnish his reputation and ruin his relationships.",
    "paragraphs": [
      "Captain Ivor Hale stood at the hotel bar, a glass of whiskey in hand, his back straight and posture proud. He was a man who commanded respect, both from his peers and the guests who frequented the hotel. His booming laughter could often be heard echoing through the corridors, a remnant of his days in the navy. Yet, beneath that charismatic exterior lay a heart gripped by fear — fear of exposure, of being unmasked as a fraud.",
      "The murder had sent shockwaves through the hotel, but for Hale, it was a personal crisis. The victim had threatened to reveal his involvement in smuggling operations during the war, a dark chapter he had hoped to bury forever. 'In my day, we knew how to handle such matters!' he would boast, masking the guilt that gnawed at him. But the truth was, he was terrified of what would happen if his past came to light.",
      "As the investigation unfolded, Hale found himself cornered by the very people he once commanded. His alibi was flimsy at best, and he could feel the walls closing in. The laughter that once flowed so freely now felt like a distant memory, replaced by the weight of his secrets. He watched as the detective navigated the room, noting every detail with hawk-like precision, and felt a chill run down his spine.",
      "Confronted with the possibility of losing everything he had built, Ivor knew he had to face his past. The investigation would force him to confront the choices he had made and the lives he had affected. Perhaps it was time to embrace honesty, to shed the facade he had so carefully constructed. But could he do it before the truth unraveled him?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A quiet hotel staff member, Beatrice Quill harbors resentment and desperation that may lead her down a dark path in the wake of a murder.",
    "publicPersona": "Quiet and diligent, but often overlooked by guests and management.",
    "privateSecret": "Resents her low pay and feels exploited, leading to petty theft from guests.",
    "motiveSeed": "The victim had threatened to report her thefts, risking her job.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be cleaning a room but had access to the crime scene.",
    "accessPlausibility": "easy",
    "stakes": "Her job and dignity are on the line if she is discovered.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Beatrice speaks softly, often trailing off as if unsure of herself. She has a habit of fidgeting with her hands when nervous, and her sentences are often punctuated with hesitant laughter.",
    "signatureTic": "Oh, I’m just a nobody.",
    "internalConflict": "Beatrice is torn between her desire for respect and her actions that undermine her dignity.",
    "personalStakeInCase": "This murder investigation could cost her not just her job, but her chance to reclaim her dignity.",
    "paragraphs": [
      "Beatrice Quill moved through the hotel with the quiet grace of someone who had learned to blend into the background. She was diligent in her work, yet often overlooked by both guests and management alike. The recent murder had thrown her into a spotlight she never desired. 'Oh, I’m just a nobody,' she would say, a self-deprecating smile on her lips, masking the resentment that simmered just beneath the surface.",
      "Her low pay and feelings of exploitation had driven her to petty theft, a desperate attempt to reclaim some semblance of control in her life. But now, with the victim threatening to report her, Beatrice felt the walls closing in. She had claimed to be cleaning a room during the murder, but the truth was, she had access to the crime scene. The thought of being discovered sent shivers down her spine. What would happen if her thefts were revealed? Would she lose everything?",
      "As the investigation unfolded, Beatrice found herself caught in a web of fear and guilt. She listened to the whispers of the guests, their eyes darting towards her as she served them tea. The tension in the air was palpable, and she felt as if the weight of the world was resting on her shoulders. Each question posed by the detective felt like a dagger, slicing through her fragile facade.",
      "Yet, in the midst of her turmoil, Beatrice began to realize that she could no longer hide in the shadows. This investigation was her chance to step into the light, to reclaim her dignity and confront her choices. Perhaps it was time to stop being a nobody and start demanding the respect she deserved. But could she face the consequences of her actions, or would she crumble under the pressure?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "An elegant socialite with a hidden jealousy, Sylvia Trent's rivalry with the victim reveals darker layers of her character in the wake of murder.",
    "publicPersona": "Elegant and charismatic, often seen hosting social events.",
    "privateSecret": "Jealous of the victim's recent success and relationship with a wealthy benefactor.",
    "motiveSeed": "Felt threatened by the victim's increasing influence in their social circle.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be at a dinner event, but rumors suggest she left early.",
    "accessPlausibility": "possible",
    "stakes": "Her social standing and influence could diminish if she loses her connections.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Sylvia speaks with an air of sophistication, her words carefully chosen. She often employs biting sarcasm, and her laughter can be both charming and cutting.",
    "signatureTic": "How quaint.",
    "internalConflict": "Sylvia struggles with her jealousy and the realization that her social standing is built on superficiality.",
    "personalStakeInCase": "The murder investigation threatens her social standing, as losing influence could mean losing her identity.",
    "paragraphs": [
      "Sylvia Trent glided through the hotel lobby, every inch the sophisticated socialite. Her laughter rang like music, charming those around her, yet beneath the surface lay a simmering jealousy that threatened to boil over. The recent murder had sent shockwaves through her carefully curated social circle, and she felt the icy fingers of dread clutching her heart. How quaint, she thought, that a life built on appearances could be so easily unraveled by a single death.",
      "As the investigation unfolded, Sylvia found herself frequently glancing towards the detective, her mind racing with thoughts of how the victim had threatened to expose her insecurities. The victim's recent success and blossoming relationship with a wealthy benefactor felt like a personal affront. She had always prided herself on being the center of attention, and now she was merely a suspect in a murder investigation.",
      "Her alibi was shaky at best, as rumors swirled that she had left the dinner event early. 'You know how it is, darling,' she would say with a practiced smile, masking her anxiety with biting sarcasm. But deep down, she could feel the walls closing in. The thought of losing her social standing was unbearable; it would mean losing her identity, the very essence of who she believed herself to be.",
      "As she grappled with her feelings of jealousy, Sylvia began to realize that her life had been built on a foundation of superficiality. The investigation was forcing her to confront the true nature of her relationships and the emptiness that lay beneath the glamour. Would she emerge from this ordeal with a newfound understanding of friendship, or would she remain trapped in the cycle of envy and rivalry?"
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A wealthy businessman with a charming facade, Hugo Vane’s manipulative nature and unethical dealings put him at the center of the murder investigation.",
    "publicPersona": "Charming and affluent, known for his philanthropic endeavors.",
    "privateSecret": "Engaged in unethical business dealings and has a history of ruinous decisions.",
    "motiveSeed": "The victim had discovered his financial misconduct and planned to reveal it.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be on the phone during the murder, but call records are unclear.",
    "accessPlausibility": "easy",
    "stakes": "His reputation and financial empire are at risk if exposed.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Hugo speaks with a smooth, confident tone, often interjecting playful sarcasm into his conversations. He has a tendency to lean in closer when making a point, creating an air of intimacy.",
    "signatureTic": "Isn't that just the way?",
    "internalConflict": "Hugo wrestles with the fear of losing his empire and the realization that his manipulative tactics may lead to his downfall.",
    "personalStakeInCase": "The murder investigation threatens to expose his unethical business practices, risking the collapse of his financial empire.",
    "paragraphs": [
      "Hugo Vane stood in the hotel’s grand foyer, exuding charm and affluence. His polished shoes gleamed under the chandelier’s light, and his smile could disarm even the most skeptical of hearts. Yet, behind that charming facade lurked a manipulative opportunist, one whose unethical dealings had begun to catch up with him. The recent murder had thrown his world into chaos, and he could feel the ground shifting beneath his feet.",
      "As whispers of the investigation spread, Hugo found himself at the center of scrutiny. The victim had discovered his financial misconduct, a revelation that could ruin him. 'Isn't that just the way?' he would say with a sardonic grin, masking the panic that bubbled beneath the surface. His alibi was flimsy at best, a phone call that could easily be disputed, and he felt the noose tightening around his neck.",
      "In conversations, Hugo's playful sarcasm often danced on the edge of danger, but it was a shield he wielded to deflect suspicion. He leaned in closer when making a point, creating an illusion of intimacy that often disarmed those around him. But with each passing moment, he felt the weight of his secrets pressing down harder, threatening to crush him under their burden.",
      "As the investigation unfolded, Hugo was forced to confront the reality of his actions. The empire he had built on manipulation and deceit was at risk of collapsing, and he could no longer hide behind his charm. Would he be able to navigate the treacherous waters of this investigation and salvage his reputation, or would he be swallowed by the very greed that had driven him?"
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seaside Retreat Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "An elegant coastal hotel, a refuge for weary travelers and socialites alike, now steeped in mystery.",
    "visualDescription": "Art Deco architecture with sweeping curves, polished chrome fixtures, and ocean-view terraces. Grand lobby with a sweeping staircase and crystal chandeliers, adorned with sea-themed murals.",
    "atmosphere": "A blend of elegance and unease, where the ocean's roar meets the whispers of intrigue.",
    "paragraphs": [
      "The Seaside Retreat Hotel stands proudly on the edge of the Brighton coast, its Art Deco façade glistening under the overcast sky. The rhythmic crashing of waves below harmonizes with the muffled conversations of guests inside, each word laced with tension from recent wartime events. This once-bustling haven for leisure now feels like a stage set for secrets, where every guest carries their own burdens, and shadows linger longer than they should.",
      "Inside, the lobby's polished marble floors reflect the dim glow of brass sconces, casting flickering light across the faces of the guests. The scent of saltwater mingles with the rich aroma of brewed tea, an attempt to mask the underlying currents of anxiety. The hotel, with its narrow hallways and carefully guarded private rooms, creates an atmosphere ripe for intrigue, where every corner may hide a clue, and every guest a suspect.",
      "As the rain patters softly against the windows, the sound blends with the distant hum of a radio broadcasting news from the frontlines. Outside, the ocean churns with a restless energy, echoing the inner turmoil of those within. Each creak of the wooden floorboards feels like a heartbeat, a reminder that time is slipping away and mysteries are waiting to be unraveled.",
      "In this isolated coastal refuge, the interplay of light and shadow reveals more than just the stunning views; it unveils the complexities of human emotion, the weight of unspoken words. The Seaside Retreat Hotel is not just a backdrop—it is a character in its own right, holding secrets that may very well lead to a deadly revelation."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with intermittent rain, typical for coastal regions",
    "timeFlow": "Days passing with a sense of urgency and foreboding.",
    "mood": "tension-filled due to recent events in the war and personal conflicts among guests",
    "eraMarkers": [
      "radio broadcasting news from the frontlines",
      "rationed automobiles parked outside",
      "period-appropriate fashion styles"
    ],
    "sensoryPalette": {
      "dominant": "The salty tang of the sea air",
      "secondary": [
        "A hint of brewed tea",
        "Faint notes of damp wood"
      ]
    },
    "paragraphs": [
      "The hotel exudes a sense of history, its walls whispering tales of bygone eras. The salty tang of the sea air wafts through the open windows, mingling with the faint aroma of brewed tea, a staple among the tea-drinking guests. Yet, beneath this veneer of elegance lies a current of anxiety, as the tension-filled atmosphere hints at deeper troubles lurking just beneath the surface.",
      "As guests gather in the opulent lounge, the sound of laughter is often interrupted by the crackling of the radio, broadcasting news from the frontlines. The intermittent rain taps against the windows, creating a rhythm that mirrors the growing unease among the patrons. Here, in this coastal sanctuary, the weight of the world outside presses in, and the shadows lengthen with each passing hour."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Tea Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Softly lit with art deco chandeliers, elegant tables draped in white linen, and ocean-view windows.",
      "sensoryDetails": {
        "sights": [
          "gleaming teacups on polished trays",
          "intricate wallpaper patterns",
          "ocean waves crashing outside",
          "shadowy corners near the windows"
        ],
        "sounds": [
          "clinking of porcelain",
          "muffled conversations",
          "soft rustle of linens",
          "drip of rain on window sills"
        ],
        "smells": [
          "freshly brewed Earl Grey",
          "sweet pastries cooling",
          "salt from the sea",
          "faint perfume lingering in the air"
        ],
        "tactile": [
          "smooth porcelain teacups",
          "soft linen tablecloths",
          "cool glass window panes",
          "worn velvet chairs"
        ]
      },
      "accessControl": "Guests only during tea service; staff enter for cleaning before and after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "raindrops tracing patterns on glass"
          ],
          "sounds": [
            "steady patter of rain",
            "distant thunder rumbling"
          ],
          "smells": [
            "wet earth",
            "fresh pastries baking",
            "sea brine"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light",
            "shadows pooling in corners"
          ],
          "sounds": [
            "the soft ticking of an old clock",
            "distant laughter fading"
          ],
          "smells": [
            "steeping tea leaves",
            "scent of damp wood",
            "old books"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "flickering candlelight",
            "shadows dancing on the walls"
          ],
          "sounds": [
            "the whisper of silk dresses",
            "soft jazz music from the radio"
          ],
          "smells": [
            "vanilla and citrus from desserts",
            "smoky tobacco from guests' pipes"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Tea Room is a sanctuary of elegance, adorned with art deco chandeliers that cast a warm glow over the delicate teacups and silver trays. The scent of freshly brewed Earl Grey mingles with the salty tang of the ocean, creating an atmosphere both inviting and deceptive. As guests gather for afternoon tea, the sound of clinking porcelain and hushed conversations fills the air, masking the tension that simmers just beneath the surface.",
        "Yet, in the shadows of the room, secrets lurk. The proximity of the tables allows for whispered exchanges, furtive glances, and the exchange of knowing smiles that can shift in an instant. A single dropped teacup can shatter the carefully constructed facade, sending ripples of anxiety through the gathering. It is here, amidst the elegance, that the crime will unfold, forever altering the course of the Seaside Retreat Hotel."
      ]
    },
    {
      "id": "lobby",
      "name": "Hotel Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Expansive with high ceilings, decorated with large murals and plush seating areas.",
      "sensoryDetails": {
        "sights": [
          "ornate chandeliers",
          "colorful murals depicting seaside scenes",
          "polished marble floors",
          "guests in period attire"
        ],
        "sounds": [
          "soft chatter of guests",
          "footsteps echoing on marble",
          "the rustle of newspapers",
          "the hum of a distant radio"
        ],
        "smells": [
          "freshly polished wood",
          "scent of floral arrangements",
          "hint of burnt toast from the kitchen"
        ],
        "tactile": [
          "smooth marble underfoot",
          "plush velvet cushions",
          "cold metal of door handles",
          "warmth of the fireplace"
        ]
      },
      "accessControl": "Open to all guests and staff; monitored by reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "cloudy light filtering through windows",
            "shadows of raindrops on the floor"
          ],
          "sounds": [
            "rain tapping on the roof",
            "muffled laughter from the dining area"
          ],
          "smells": [
            "fresh coffee brewing",
            "wet umbrellas stored by the door"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim lighting casting soft shadows",
            "guests clustered in groups"
          ],
          "sounds": [
            "the ticking of a clock",
            "occasional bursts of laughter"
          ],
          "smells": [
            "dust from old books",
            "smell of tea wafting from the Tea Room"
          ],
          "mood": "suspenseful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of candles on side tables",
            "guests in evening attire"
          ],
          "sounds": [
            "soft music from a gramophone",
            "quiet conversations"
          ],
          "smells": [
            "citrus from cocktails",
            "scent of polished wood"
          ],
          "mood": "inviting yet tense"
        }
      ],
      "paragraphs": [
        "The hotel lobby is a grand space that welcomes guests with its high ceilings and ornate chandeliers. Colorful murals depicting seaside scenes adorn the walls, adding a touch of whimsy to the otherwise formal atmosphere. Plush seating areas invite weary travelers to rest, while the polished marble floors reflect the soft glow of light, creating an elegant yet somewhat eerie ambiance.",
        "As guests mingle, the soft chatter fills the air, punctuated by the distant hum of a radio broadcasting news updates. The scent of fresh flowers competes with hints of burnt toast from the kitchen, creating a sensory overload that masks the underlying tension. Each footstep echoes on the marble, a reminder that secrets are best kept hidden, especially in such an exposed space."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "Guest Rooms",
      "type": "interior",
      "purpose": "Private quarters",
      "visualDetails": "Cozy yet elegant, with floral wallpaper, thick carpets, and ocean views.",
      "sensoryDetails": {
        "sights": [
          "floral-patterned drapes",
          "soft lighting from bedside lamps",
          "ocean waves visible through windows",
          "personal belongings scattered about"
        ],
        "sounds": [
          "gentle rustle of curtains",
          "distant crashing of waves",
          "clock ticking softly on the wall",
          "muffled voices from the hallway"
        ],
        "smells": [
          "fresh linen",
          "scent of lavender from potpourri",
          "salty breeze from the ocean"
        ],
        "tactile": [
          "soft, thick carpets underfoot",
          "cool glass of windows",
          "plush bedspread",
          "smooth edges of bedside tables"
        ]
      },
      "accessControl": "Guests only; staff must knock and announce themselves before entry.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through curtains",
            "water droplets on window panes"
          ],
          "sounds": [
            "steady rain pattering on the roof",
            "soft sighs of waking guests"
          ],
          "smells": [
            "freshly brewed coffee",
            "scent of damp earth from outside"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "furniture arranged for comfort"
          ],
          "sounds": [
            "the ticking of a clock",
            "whispers from the hallway"
          ],
          "smells": [
            "dust from untouched corners",
            "faint perfume lingering in the air"
          ],
          "mood": "claustrophobic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candles flickering on nightstands",
            "ocean waves glimmering in moonlight"
          ],
          "sounds": [
            "gentle lapping of waves",
            "soft music playing from a radio"
          ],
          "smells": [
            "scent of jasmine from outside",
            "cool breeze wafting in"
          ],
          "mood": "romantic yet tense"
        }
      ],
      "paragraphs": [
        "The guest rooms of The Seaside Retreat Hotel offer a cozy refuge, adorned with floral-patterned drapes that frame the ocean views. Soft lighting from bedside lamps casts a warm glow, inviting guests to unwind from the day’s tensions. The gentle rustle of curtains in the sea breeze and the distant crashing of waves create a soothing backdrop, yet the atmosphere feels charged with unspoken words and hidden agendas.",
        "As guests retreat to their rooms, the scents of fresh linen and lavender potpourri fill the air, mingling with the salty breeze that seeps through the windows. Each room, while private, holds the weight of secrets and the potential for revelation. The ticking clock serves as a reminder that time is of the essence, and outside, the world continues to turn, indifferent to the mysteries unfolding within these walls."
      ]
    },
    {
      "id": "ocean_cliffs",
      "name": "Oceanfront Cliffs",
      "type": "exterior",
      "purpose": "Isolation and escape route",
      "visualDetails": "Dramatic cliffs dropping into crashing waves, with rocky outcroppings and sparse vegetation.",
      "sensoryDetails": {
        "sights": [
          "crashing waves against rocks",
          "seabirds circling overhead",
          "clouds swirling ominously",
          "wildflowers clinging to the cliffside"
        ],
        "sounds": [
          "roar of the ocean",
          "whistle of the wind",
          "calls of seabirds",
          "distant rumble of thunder"
        ],
        "smells": [
          "salt air mixed with seaweed",
          "fresh rain on stone",
          "earthy scent of wet moss"
        ],
        "tactile": [
          "rough texture of the cliff face",
          "cool breeze against skin",
          "wet rocks underfoot",
          "hard ground beneath shoes"
        ]
      },
      "accessControl": "Limited access; paths are treacherous and not well-marked.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "mist rising from the ocean",
            "grey clouds hovering low"
          ],
          "sounds": [
            "pattering raindrops on rocks",
            "distant thunder"
          ],
          "smells": [
            "fresh rain on stone",
            "wet earth",
            "scent of sea spray"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark waves crashing against cliffs",
            "heavy clouds looming"
          ],
          "sounds": [
            "roaring surf",
            "wind howling around outcroppings"
          ],
          "smells": [
            "wet stone",
            "salty sea air",
            "scent of damp vegetation"
          ],
          "mood": "menacing"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting orange hues over water",
            "silhouettes of cliffs against the sky"
          ],
          "sounds": [
            "gentle lapping of waves",
            "soft whispers of the wind"
          ],
          "smells": [
            "warmth of the setting sun",
            "scent of wildflowers"
          ],
          "mood": "serene yet ominous"
        }
      ],
      "paragraphs": [
        "The oceanfront cliffs rise dramatically, their rugged faces jutting out over the crashing waves below. Seabirds circle overhead, their calls mingling with the roar of the ocean, creating a cacophony that is both exhilarating and intimidating. Sparse vegetation clings to the rocky outcroppings, swaying in the wind, while the salty sea air fills the lungs with each breath.",
        "As the weather shifts, the cliffs take on a different character. In the morning rain, mist rises from the ocean, creating an ethereal atmosphere that feels almost otherworldly. The overcast afternoons bring a sense of menace, the dark waves crashing violently against the rocks, a reminder of nature's fury. Yet, in the clear evening light, the cliffs transform, bathed in the warm hues of sunset, offering a deceptive calm that belies the tension simmering within the hotel just a stone's throw away."
      ]
    }
  ],
  "note": "",
  "cost": 0.00225701025,
  "durationMs": 39426
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1949,
    "month": "May",
    "day": null,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "overcast with occasional rain",
      "cool coastal breezes",
      "mild temperatures around 12-15°C (54-59°F)"
    ],
    "daylight": "Days are gradually lengthening, with twilight lasting until nearly nine o'clock at night, providing a soft glow that contrasts with the grey skies.",
    "time_of_day_of_crime": "Late afternoon — between three and five o'clock, during a lull in the day's activities.",
    "holidays": [
      "May Day (1st May)",
      "Victoria Day (Canada, 23rd May)"
    ],
    "seasonalActivities": [
      "attending local spring fairs",
      "enjoying tea in gardens despite the weather",
      "participating in Maypole dances"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "tailored white dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed blazer",
        "button-up shirt with rolled sleeves",
        "slacks in light grey"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "sleeveless floral tea dress",
        "tailored jacket with shoulder pads",
        "string of pearls"
      ],
      "casual": [
        "lightweight cardigan",
        "ankle-length skirt",
        "blouse with a Peter Pan collar"
      ],
      "accessories": [
        "small clutch purse",
        "wide-brimmed straw hat",
        "scarf tied at the neck"
      ]
    },
    "trendsOfTheMoment": [
      "the popularity of pastel colors",
      "influence of Hollywood glamour on everyday fashion",
      "use of synthetic fibers in clothing"
    ],
    "socialExpectations": [
      "men typically wear hats when outdoors",
      "women are expected to maintain a certain level of modesty",
      "social gatherings emphasize formality"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "tensions rise in Eastern Europe with the Berlin Blockade continuing",
      "the formation of NATO in April 1949",
      "the start of the Great Migration of African Americans to northern cities"
    ],
    "politicalClimate": "A climate characterized by increased suspicion and hostility between the East and West, as the Cold War begins to take shape.",
    "economicConditions": "Post-war recovery is underway, yet rationing persists in many countries, causing strain on the economy and daily lives.",
    "socialIssues": [
      "returning veterans struggling to reintegrate",
      "women's rights in the workforce becoming more prominent",
      "racial tensions as civil rights movements begin to gain traction"
    ],
    "internationalNews": [
      "the partition of India and Pakistan leading to increased refugee movements",
      "the rise of communism in Eastern Europe causing concern for Western nations"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Frank Sinatra's 'I've Got a Crush on You'",
        "Nat King Cole's 'Nature Boy'",
        "The Andrews Sisters' 'Rum and Coca-Cola'"
      ],
      "films": [
        "'All the King's Men'",
        "'The Third Man'",
        "'The Heiress'"
      ],
      "theater": [
        "'A Streetcar Named Desire'",
        "'Death of a Salesman'",
        "'The Glass Menagerie'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Lone Ranger'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'1984' by George Orwell",
        "'The Naked and the Dead' by Norman Mailer",
        "'Fahrenheit 451' by Ray Bradbury"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "science fiction",
        "post-war realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial television broadcasts begin in the UK",
        "the introduction of the microwave oven",
        "early computers like the ENIAC are in use"
      ],
      "commonDevices": [
        "radio sets are prevalent in homes",
        "black-and-white television sets are starting to become popular",
        "typewriters are common in offices"
      ],
      "emergingTrends": [
        "growing interest in automotive technology",
        "the rise of consumer electronics",
        "the beginning of the space race with early rocketry experiments"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: four pence",
        "a pint of milk: three pence",
        "bus fare: two pence"
      ],
      "commonActivities": [
        "enjoying afternoon tea",
        "playing croquet in gardens",
        "congregating in cafes for conversation"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "weekly bridge nights among friends",
        "attending church services regularly"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a growing divide between the upper and working classes",
      "increased mobility for the middle class",
      "aspirations for upward mobility are common"
    ],
    "gender": [
      "women are increasingly seen as equals in the workplace",
      "traditional gender roles still influence family life",
      "there's a growing push for women's rights"
    ],
    "race": [
      "racial segregation is still prevalent in many areas",
      "the civil rights movement is beginning to gain momentum",
      "increased awareness of racial equality issues"
    ],
    "generalNorms": [
      "politeness and decorum are highly valued",
      "civility in public spaces is expected",
      "community engagement is encouraged"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain-soaked earth mingles with the aroma of freshly brewed tea, creating a comforting yet tense atmosphere in the tea room.",
    "Muffled conversations and clinking teacups reverberate against the backdrop of distant thunder, heightening the sense of unease among the guests.",
    "The dim light filters through the heavy curtains, casting elongated shadows that dance ominously as the storm outside rages on."
  ],
  "paragraphs": [
    "May 1949 unfolds in a coastal town, where spring's arrival is marked by overcast skies and intermittent rain. As guests gather in the hotel’s tea room, the atmosphere is charged with tension, stemming from both the lingering echoes of war and personal conflicts simmering beneath the surface. The mild temperatures, hovering around 12-15°C, prompt a mix of light jackets and floral tea dresses, while the sound of raindrops against the windows creates a rhythmic backdrop to whispered conversations and occasional laughter that feels forced.",
    "Fashion trends are a blend of practicality and post-war elegance. Men sport tailored navy suits with silk ties, while women wear pastel-colored tea dresses adorned with floral patterns, embodying a spirit of renewal despite the weight of the past. Accessories like fedora hats and string pearls reflect a desire for sophistication, even in the face of everyday difficulties. The hotel itself becomes a microcosm of society, where traditional norms meet the emerging realities of modern life, particularly as women assert their presence in the workforce.",
    "Daily life in this coastal town is punctuated by social rituals such as afternoon tea, where the community gathers to discuss the latest news, including the rising tensions in Eastern Europe and the impact of the post-war economy. With the price of a loaf of bread at four pence and bus fares at two pence, the community is coping with the remnants of rationing while yearning for better days. As the guests sip their tea, the conversation flows from mundane topics to the murmurs of political unrest, reflecting the changing tides of societal attitudes towards gender, class, and race."
  ],
  "note": "",
  "cost": 0.00109715595,
  "durationMs": 14874
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a coastal hotel for a post-war reunion reveals deep-seated tensions among guests, exacerbated by the pressures of a changing society and the lingering shadows of conflict.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has shifted class dynamics, with women entering the workforce and societal expectations evolving, creating an atmosphere of both opportunity and anxiety."
  },
  "setting": {
    "location": "A coastal hotel featuring Art Deco architecture, designed for leisure and social gatherings, with views of the ocean.",
    "institution": "hotel",
    "weather": "overcast with intermittent rain, typical for coastal regions"
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
    "value": "half past six",
    "description": "The victim was confirmed dead at this time."
  },
  {
    "id": "time_last_seen",
    "value": "half past five",
    "description": "Witnesses last saw the victim alive at this time."
  },
  {
    "id": "toxin_effect_time",
    "value": "three hours",
    "description": "The toxic effects of the flower take this long to appear."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 7,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 16,
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
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "early",
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
      "category": "behavioral"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
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
      "category": "testimonial"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
