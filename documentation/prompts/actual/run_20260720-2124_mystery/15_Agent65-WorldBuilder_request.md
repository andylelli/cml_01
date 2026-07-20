# Actual Prompt Record

- Run ID: `mystery-1784582686670`
- Project ID: ``
- Timestamp: `2026-07-20T21:30:18.746Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `1e18dca9327abb6a`

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
    "title": "The Poisoned Palette",
    "author": "Anonymous",
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
      "public_persona": "An observant hotel guest and amateur sleuth.",
      "private_secret": "Has a background in chemistry.",
      "motive_seed": "Concern for friend.",
      "motive_strength": "moderate",
      "alibi_window": "Evening of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining room",
        "Lobby"
      ],
      "behavioral_tells": [
        "Calm demeanor",
        "Observant nature"
      ],
      "stakes": "Seeking justice for Sylvia.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Expert",
      "relationships": [],
      "public_persona": "Respected physician with a keen interest in toxicology.",
      "private_secret": "Has a history with the victim.",
      "motive_seed": "Fear of exposure.",
      "motive_strength": "high",
      "alibi_window": "Evening of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Medical supply room",
        "Dining room"
      ],
      "behavioral_tells": [
        "Nervous gestures",
        "Avoids eye contact"
      ],
      "stakes": "Maintaining professional reputation.",
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
      "public_persona": "Former naval officer, now a hotel manager.",
      "private_secret": "Struggling with post-war trauma.",
      "motive_seed": "Desire to maintain order.",
      "motive_strength": "low",
      "alibi_window": "Evening of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining room",
        "Hotel office"
      ],
      "behavioral_tells": [
        "Authoritative tone",
        "Defensive posture"
      ],
      "stakes": "Preserving the hotel's reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Friend of the Victim",
      "relationships": [],
      "public_persona": "Charming and social, often hosting gatherings.",
      "private_secret": "In love with the victim's partner.",
      "motive_seed": "Jealousy.",
      "motive_strength": "moderate",
      "alibi_window": "Evening of the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining room",
        "Lounge area"
      ],
      "behavioral_tells": [
        "Eager to please",
        "Overly friendly"
      ],
      "stakes": "Possibility of romance with Hugo.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "25-35",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "An artist known for her vibrant paintings.",
      "private_secret": "Harbored doubts about her relationships.",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "evening",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Art Dealer",
      "relationships": [],
      "public_persona": "Ambitious and charismatic.",
      "private_secret": "Involved in a secret affair.",
      "motive_seed": "Fear of losing Sylvia.",
      "motive_strength": "high",
      "alibi_window": "Evening of the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining room",
        "Art studio"
      ],
      "behavioral_tells": [
        "Flamboyant gestures",
        "Warm smile"
      ],
      "stakes": "Protecting his relationship with Sylvia.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
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
      "summary": "In a charming coastal hotel, a vibrant artist named Sylvia Trent is found dead after a lavish dinner. As Eleanor Voss delves into the mystery, she uncovers a web of secrets, jealousy, and a carefully disguised poison that has led to Sylvia's demise."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on tincture, dinner, and decanter to expose the false timing.",
      "delivery_path": [
        {
          "step": "Dr. Finch prepares the tincture with the poison well before dinner."
        },
        {
          "step": "The tincture is poured into a decanter, which resembles others in the dining room."
        },
        {
          "step": "Sylvia unwittingly consumes the poison, leading to her delayed symptoms."
        }
      ]
    },
    "outcome": {
      "result": "Sylvia Trent dies from the effects of the poison after several hours."
    }
  },
  "false_assumption": {
    "statement": "Sylvia's death was an unfortunate accident resulting from her known anxiety issues.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses noted her anxious demeanor before dinner, leading to the assumption her death was stress-related.",
    "what_it_hides": "The true cause of her death was the slow-acting poison administered through a trusted source."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Captain Hale was the last to see Sylvia alive, having a brief conversation before dinner.",
      "Guests report that Hale appeared unusually anxious that evening."
    ],
    "the_one_flaw": "Captain Hale was seen in the hotel office preparing for the dinner service at the time of Sylvia's collapse.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Eleanor finds a suspicious herbal book in Dr. Finch's room.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The book was a gift from a colleague and unrelated to the murder.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Hugo is seen arguing with Sylvia shortly before dinner.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The argument was about an art piece, not their relationship.",
      "resolved_in_chapter": 7
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
    "rationale": "All suspects are guests or staff at the hotel, ensuring no outsiders were involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner service start",
        "Time of collapse"
      ],
      "windows": [
        "Between dinner and collapse"
      ],
      "contradictions": [
        "Symptoms appeared too late for anxiety-induced death."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Eleanor Voss",
        "Hugo Vane"
      ],
      "objects": [
        "Decanter",
        "Tincture"
      ],
      "permissions": [
        "Finch had access to the medical supplies."
      ]
    },
    "physical": {
      "laws": [
        "The poison was slow-acting, contradicting immediate reaction claims."
      ],
      "traces": [
        "Fingerprints on the decanter were only from Finch."
      ]
    },
    "social": {
      "trust_channels": [
        "Guest relations among hotel staff and patrons."
      ],
      "authority_sources": [
        "Dr. Finch's status as a doctor provided trust."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The decanter used for serving dinner has fingerprints that match Dr. Finch.",
        "correction": "This indicates that Dr. Finch was the last person to handle the decanter.",
        "effect": "Eliminates other suspects who did not have access.",
        "required_evidence": [
          "Decanter fingerprint evidence.",
          "Witness accounts of Finch handling the decanter."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report that Sylvia complained about a bitter taste in her drink.",
        "correction": "This suggests that her drink contained something unusual, likely the poison.",
        "effect": "Narrows investigation focus to those who prepared her drink.",
        "required_evidence": [
          "Witness statements about Sylvia's complaints.",
          "Observation of drink preparation at the table."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Finch exhibits nervous behavior when questioned about the tincture.",
        "correction": "Her nervousness suggests she may have had a role in preparing it.",
        "effect": "Narrowing suspicion towards Dr. Finch.",
        "required_evidence": [
          "Witness observation of Finch's behavior.",
          "Previous knowledge of her expertise in toxicology."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares dinner, decanter, and fingerprint against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are decanter, indicat, and dinner.",
    "pass_condition": "If Dr. Finch exhibits anxiety similar to the night of the incident.",
    "evidence_clues": [
      "clue_2",
      "clue_culprit_direct_1",
      "clue_8",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Fingerprints on the decanter (early) and witness statements about drink preparation (mid) guide the reader towards Finch's involvement. Step 2: The bitter taste complaint (mid) further narrows suspicion. Step 3: The reenactment test (discriminating test) reveals Finch's concealed knowledge, confirming her guilt."
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
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proven to be in the office during the time of the murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm he was discussing art with guests when the poison was administered.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed to have been in another part of the hotel during the incident.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
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
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a charming traveling journalist drawn to the coastal hotel for a story, but her affections for Captain Ivor Hale complicate her investigation.",
    "publicPersona": "Charming and observant, Eleanor is known for her engaging stories about life along the coast, captivating audiences with her vivid prose and keen insights into human nature.",
    "privateSecret": "She is secretly in love with Captain Ivor Hale, which complicates her professional judgment and leads her to question her objectivity in the investigation.",
    "motiveSeed": "Drawn to the coastal hotel for a story about wartime resilience and the human condition, Eleanor is determined to uncover the truth behind the murder.",
    "motiveStrength": "moderate",
    "alibiWindow": "Present at the hotel for the entire duration of the event, providing her with ample opportunity to gather information.",
    "accessPlausibility": "easy",
    "stakes": "Eleanor seeks to prove her worth as a journalist and uncover the truth for her story, while also wrestling with her feelings for Ivor.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a fluid cadence, often punctuating her observations with wry remarks. She tends to ask rhetorical questions, drawing others into her thought process.",
    "signatureTic": "What’s the story behind that?",
    "internalConflict": "Eleanor grapples with her feelings for Ivor, torn between her professional integrity and her personal desires, questioning if love can coexist with truth.",
    "personalStakeInCase": "This crime matters to Eleanor not only for her career but also because it could impact her relationship with Ivor, whom she desires to support.",
    "paragraphs": [
      "Eleanor Voss's heart raced with the thrill of the chase, the promise of a new story lingering in the air like the salty breeze from the ocean. She had arrived at the coastal hotel with the intention of capturing the essence of wartime resilience, but the murder of Sylvia Trent had thrust her into a web of intrigue far more complex than she had anticipated. With her keen eye for detail, Eleanor had always been able to weave narratives that resonated, but this time, the stakes felt more personal.",
      "As she navigated the corridors of the hotel, Eleanor's thoughts were often interrupted by the presence of Captain Ivor Hale. His rugged charm and haunted gaze stirred something within her that she struggled to suppress. She had always admired his bravery, but now, with the specter of scandal looming, her professional instincts battled against her romantic inclinations. How could she remain objective when every glance he cast her way ignited a flicker of hope and despair?",
      "Determined to uncover the truth, Eleanor immersed herself in conversations with other guests, her charm disarming their defenses. Yet, beneath her engaging exterior lay a simmering conflict; she feared that revealing the truth could jeopardize her burgeoning relationship with Ivor. What if his secrets, intertwined with the victim's fate, came to light? Would she be the one to expose him, or would she protect the man she loved, even at the cost of her integrity?",
      "In her pursuit of justice, Eleanor found herself peeling back layers of deceit, each revelation a brushstroke on the canvas of her story. She was driven not just by ambition, but by a desire to honor the memory of the victim and to prove to herself that she was more than just a woman in love; she was a journalist capable of unearthing the truth, no matter the personal cost. As the investigation deepened, Eleanor knew she would have to confront her feelings and decide what kind of story she would ultimately tell."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician with a hidden past, struggling to protect her reputation while haunted by guilt over a secret affair with the victim.",
    "publicPersona": "Respected and compassionate, Dr. Finch is a pillar of the community, known for her dedication to her patients and her unwavering support for the local populace.",
    "privateSecret": "She recently had a clandestine affair with the victim, Eleanor's friend Beatrice, which complicates her professional life and threatens to unravel her carefully constructed reputation.",
    "motiveSeed": "Resentful over the victim's decision to expose their affair in a public scandal, Dr. Finch finds herself cornered by her own emotions.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be in her office but was unaccounted for during the actual crime, leaving room for doubt.",
    "accessPlausibility": "possible",
    "stakes": "Her reputation and career are at risk if the truth about the affair comes out, pushing her into a desperate position.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks in a measured tone, often using medical jargon that she softens with a touch of irony. Her laughter is rare but sharp, revealing her inner turmoil.",
    "signatureTic": "Well, that’s a rather unfortunate diagnosis, isn’t it?",
    "internalConflict": "Dr. Finch is torn between her professional obligations and her personal desires, grappling with guilt for the affair and fear of exposure.",
    "personalStakeInCase": "This case matters to Dr. Finch because her reputation is on the line; if her affair is revealed, it could destroy her career and her standing in the community.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the edge of the hotel's grand dining room, her gaze flitting between the guests and the shadows that loomed over her reputation. Known for her compassionate care, she had become a trusted figure in the community, yet beneath her polished exterior lay a tumult of secrets. The recent murder of Sylvia Trent had rattled her, not only because of the loss but due to the tangled threads of her own life that intertwined with the victim's.",
      "The affair with Beatrice Quill had been thrilling yet fraught with peril, a moment of passion in an otherwise disciplined existence. Dr. Finch had thought they were safe, that their secret was shielded by the walls of the hotel and the trust they had built. But Sylvia's presence threatened to expose everything, and now, with her death, the specter of scandal loomed larger than ever. Guilt gnawed at her, a relentless reminder of the choices she had made.",
      "As she navigated the investigation, Dr. Finch's mind raced with the implications of each question asked and every glance exchanged. She was acutely aware of the whispers that followed her, the way eyes darted away when she entered a room. The very thought of being implicated in the murder sent chills down her spine. What if someone discovered the truth about her relationship with Beatrice? Would her colleagues still respect her? Would her patients trust her?",
      "With each passing moment, Dr. Finch found herself at a crossroads, torn between the desire to protect herself and the need to confront her own demons. The investigation became a mirror, reflecting her fears and desires back at her. In a world where her compassion was her greatest asset, she now faced the possibility that it could also be her undoing. As she grappled with the weight of her choices, Dr. Finch knew that the truth, no matter how painful, was the only remedy for her fractured soul."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a war hero haunted by his past, struggling with PTSD while trying to navigate the murky waters of suspicion following the murder of Sylvia Trent.",
    "publicPersona": "A war hero celebrated for bravery, Ivor carries the weight of his experiences, often appearing stoic but internally battling his demons.",
    "privateSecret": "He has been struggling with PTSD and was secretly meeting with the victim for support, complicating his relationship with both the victim and Eleanor.",
    "motiveSeed": "Fears that the victim would reveal personal details about his struggles, damaging his reputation and the honor he fought to uphold.",
    "motiveStrength": "strong",
    "alibiWindow": "Reported to have been on the beach, but unverified during the critical time, leaving him vulnerable to suspicion.",
    "accessPlausibility": "possible",
    "stakes": "Ivor risks losing his honor and being deemed unfit for service if his vulnerabilities are exposed, heightening his sense of desperation.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Ivor speaks with a low, gravelly tone, often choosing his words carefully. He tends to be terse, with moments of deep introspection breaking through his stoicism.",
    "signatureTic": "It’s all in the past, isn’t it?",
    "internalConflict": "Ivor struggles with the trauma of his experiences and the fear of exposing his vulnerabilities, leading to a deep internal conflict about his identity and worth.",
    "personalStakeInCase": "This case matters to Ivor because the truth could shatter the fragile facade he has built around his honor, making him confront the very issues he wishes to hide.",
    "paragraphs": [
      "Captain Ivor Hale stood against the backdrop of the crashing waves, the rhythmic sound mirroring the turmoil within him. A celebrated war hero, he had always been the embodiment of courage, yet the shadows of his past haunted him relentlessly. The recent murder of Sylvia Trent had pulled him into a whirlpool of suspicion, and the weight of his own secrets felt heavier than the medals adorning his uniform.",
      "In his private moments, Ivor had sought solace in the company of Sylvia, a connection born not only of shared experiences but a mutual understanding of their struggles. But now, with her death, he was left to grapple with the fear that she would have revealed the depths of his torment. The thought gnawed at him, a reminder that vulnerability could be perceived as weakness in a world that celebrated strength.",
      "As the investigation unfolded, Ivor found himself entangled in a web of suspicion, each question posed a dagger to his already fragile state. He was aware of the whispers that surrounded him, the glances that lingered too long. How could he defend himself when the truth felt like an anchor dragging him down? He had fought for his country, yet here he was, battling an enemy far more insidious: his own mind.",
      "In the depths of his turmoil, Ivor recognized a deeper truth; he was not just fighting for his honor, but for the chance to redefine himself. The investigation forced him to confront not only the specter of the murder but the shadows of his past. As he stood at the precipice of revelation, Ivor knew that the path to redemption would require him to face the darkness within, to reclaim his identity from the ashes of fear and shame."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious artist caught in a web of betrayal and longing, struggling to protect her dreams while grappling with her secret relationship with Captain Ivor Hale.",
    "publicPersona": "An up-and-coming artist, Beatrice is vibrant with a promising future ahead, celebrated for her creativity and passion.",
    "privateSecret": "She was in a secret relationship with Ivor, which she believed would lead to marriage, complicating her emotions amidst the investigation.",
    "motiveSeed": "Felt betrayed when the victim threatened to expose the affair and derail her career, pushing her closer to desperation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be in her room painting but doesn't remember the exact timing, leaving her account vulnerable.",
    "accessPlausibility": "easy",
    "stakes": "Beatrice's career and dreams are at stake if the truth about her relationship with Ivor comes to light, forcing her to confront her ambitions.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively and expressive tone, often punctuating her sentences with dramatic flair. She has a tendency to exaggerate for effect, revealing her artistic nature.",
    "signatureTic": "Life’s a canvas, isn’t it?",
    "internalConflict": "Beatrice struggles between her ambition as an artist and the moral implications of her actions, torn between love and career aspirations.",
    "personalStakeInCase": "This case matters to Beatrice because her future in the art world is on the line; if her relationship with Ivor is exposed, it could ruin her career before it even begins.",
    "paragraphs": [
      "Beatrice Quill stood in her room, paintbrush in hand, staring at the canvas before her. Each stroke was an attempt to capture the vibrant chaos of her emotions, yet the colors felt muted compared to the turmoil in her heart. An up-and-coming artist, she had always dreamed of a future filled with acclaim and recognition, but the murder of Sylvia Trent had cast a long shadow over her aspirations.",
      "Her relationship with Captain Ivor Hale had been a whirlwind of passion and secrecy, an intoxicating dance that promised to lead to marriage. But now, with the specter of exposure looming, Beatrice felt the weight of betrayal pressing down on her. Sylvia had threatened to reveal their affair, and the thought of her dreams crumbling under the weight of scandal was unbearable. She had worked too hard to let it all slip away.",
      "As she navigated the investigation, Beatrice found herself oscillating between defiance and despair. Her vibrant personality often masked the turmoil within, yet moments of vulnerability slipped through, revealing the cracks in her façade. She was determined to protect her dreams, even if it meant making difficult choices. But how far was she willing to go to safeguard her future? Would she sacrifice her integrity for the sake of ambition?",
      "With each interaction, Beatrice painted a portrait of resilience, yet her heart ached for the love she had found in Ivor. The investigation forced her to confront the reality of her choices, to weigh the cost of ambition against the longing for connection. As she stood on the precipice of a new chapter, Beatrice knew that the brushstrokes of her life would be defined by the choices she made in the face of adversity."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, the victim, was a hotel owner known for her hospitality, but her financial struggles and secrets led to her untimely demise.",
    "publicPersona": "Welcoming and shrewd, Sylvia is known for her hospitality and keen business acumen, maintaining a façade of control amidst the chaos.",
    "privateSecret": "Sylvia is struggling financially and fears the victim's presence could expose her mismanagement, leaving her vulnerable to scandal.",
    "motiveSeed": "Wants to protect her hotel and reputation from the victim's potential negative influence, highlighting her desperation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been in the dining room catering to guests but was unaccounted for, raising suspicions about her whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "Her financial stability and standing in the community are at risk if her issues come to light, complicating her relationship with her guests.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Sylvia speaks with a polished, authoritative tone, often using business jargon that reflects her role as a hotel owner. Her words are carefully chosen, revealing little of her inner turmoil.",
    "signatureTic": "Let’s keep this under wraps, shall we?",
    "internalConflict": "Sylvia struggles with the fear of exposure and the pressure to maintain her business, torn between her responsibilities and her personal ethics.",
    "personalStakeInCase": "This case matters to Sylvia because her financial stability is on the line; if her mismanagement is revealed, it could destroy her reputation and business.",
    "paragraphs": [
      "Sylvia Trent, the vibrant soul behind the coastal hotel, was known for her warm hospitality, creating an atmosphere where guests felt at home. Yet beneath her welcoming exterior lay a tumult of financial struggles and hidden secrets. The recent murder had shaken the very foundation of her establishment, and as the investigation unfolded, Sylvia felt the walls closing in around her.",
      "With each passing day, the pressure mounted. She had always prided herself on her keen business acumen, yet the reality of her mismanagement threatened to unravel everything she had built. As rumors swirled and guests whispered, Sylvia found herself grappling with the fear that the truth would come to light, jeopardizing her standing in the community.",
      "In her moments of solitude, Sylvia reflected on the choices that had led her to this point. The need to protect her hotel had driven her to make decisions that now haunted her. She had hoped to shield her business from the victim's potential influence, but now it seemed like a futile endeavor. Each interaction felt like a tightrope walk, where one misstep could lead to disaster.",
      "As the investigation continued, Sylvia was forced to confront the reality of her situation. She had built a reputation as a pillar of the community, yet now she stood on shaky ground, her future hanging in the balance. The stakes had never been higher, and as she navigated the treacherous waters of suspicion, Sylvia knew she would have to make difficult choices to protect her legacy."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is an ambitious journalist driven by jealousy and rivalry, willing to go to great lengths to undermine Eleanor while navigating the murky waters of the investigation.",
    "publicPersona": "A charismatic and ambitious journalist, Hugo has a reputation for getting the scoop, often charming his way into exclusive stories.",
    "privateSecret": "He was previously involved with Eleanor and is jealous of her new success, fueling his desire to ruin her credibility.",
    "motiveSeed": "Wants to ruin Eleanor's credibility, seeing her as a rival in journalism and feeling threatened by her talent.",
    "motiveStrength": "strong",
    "alibiWindow": "Unaccounted for during key moments, claiming to be networking with guests, raising questions about his whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "His career is on the line if he fails to secure a significant story, pushing him to consider drastic measures.",
    "humourStyle": "blunt",
    "humourLevel": 0.7,
    "speechMannerisms": "Hugo has a direct and assertive manner of speaking, often cutting to the chase with little regard for niceties. He can be sardonic, using sharp wit to mask his insecurities.",
    "signatureTic": "What’s the scoop?",
    "internalConflict": "Hugo wrestles with his jealousy towards Eleanor and the lengths he is willing to go to secure his place in the journalism world, leading to a moral quandary.",
    "personalStakeInCase": "This case matters to Hugo because if Eleanor's reputation is tarnished, it could clear his path to success, making him question his ethics.",
    "paragraphs": [
      "Hugo Vane leaned against the bar, a glass of whiskey in hand, surveying the room with a predatory gaze. A journalist known for his charm and cunning, he had always been one step ahead of the competition. But now, as he watched Eleanor Voss bask in the attention of the guests, a familiar pang of jealousy twisted in his gut. She had once been his partner, but now she was his rival, and he couldn't shake the feeling that she was out to eclipse him.",
      "The murder of Sylvia Trent had thrown the coastal hotel into chaos, and Hugo saw an opportunity to turn the situation to his advantage. He knew that if he could undermine Eleanor's credibility, it would not only elevate his own standing but also settle the score for their past. The stakes were high, and he was willing to do whatever it took to secure the scoop that would define his career.",
      "As the investigation unfolded, Hugo's mind raced with possibilities. He was unaccounted for during key moments, but he spun tales of networking with guests, masking his true intentions. Each interaction was a game, a dance of deception where he played his cards close to his chest. He was acutely aware that every move he made could either solidify his position or lead to his downfall.",
      "Yet, beneath the bravado lay a simmering conflict. Hugo wrestled with the realization that his actions could have dire consequences, not just for Eleanor, but for himself as well. The line between ambition and morality blurred, and as he navigated the treacherous waters of the investigation, he found himself questioning how far he was willing to go to secure his place in the cutthroat world of journalism."
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
    "summary": "A coastal hotel with Art Deco elegance, shadowed by the whispers of a recent crime.",
    "visualDescription": "The Seabreeze Hotel stands with its striking geometric lines, gleaming chrome accents, and a grand lobby adorned with ornate chandeliers. Ocean-view balconies jut out like the sails of a ship, while the dining room features expansive windows framing the tumultuous sea.",
    "atmosphere": "Suspenseful and foreboding, as the echoes of war linger in the salty air.",
    "paragraphs": [
      "The Seabreeze Hotel, with its Art Deco charm, casts a long shadow over Brighton's pebble-strewn beach. The grand lobby, filled with the murmur of guests and the clinking of glasses, feels both inviting and oppressive. Outside, the ocean roars, matching the tension inside, as whispers of recent events ripple through the air. Chilly sea breezes sweep in through the open doors, carrying the scent of salt and something more sinister.",
      "As evening descends, the hotel's atmosphere shifts. Dim lighting casts elongated shadows across the marble floors, while the distant sound of waves crashing against the shore creates an unsettling rhythm. The hotel, once a glamorous retreat, now bears the weight of secrets, its corridors echoing with the footsteps of those who tread carefully, wary of what lies ahead.",
      "The dining room, with its panoramic views of the darkening sea, serves as both a gathering place and a stage for intrigue. Guests exchange glances over their meals, the tension palpable. Outside, the horizon blurs into a foggy abyss, reflecting the uncertainty that envelops the hotel and its inhabitants. Every corner holds the potential for discovery or danger, as the night stretches on."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Cool evening with a slight ocean breeze and overcast skies, typical of coastal regions.",
    "timeFlow": "A night filled with mounting dread and uncertainty.",
    "mood": "Tense and suspenseful, heightened by the lingering effects of war.",
    "eraMarkers": [
      "Art Deco architecture and furnishings",
      "Mechanical typewriters in the lobby",
      "Public radio broadcasting news updates"
    ],
    "sensoryPalette": {
      "dominant": "Salt air mixed with tension",
      "secondary": [
        "Dimly lit spaces filled with whispers",
        "Echoing footsteps on marble floors"
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of salt and secrets, the ocean's roar a constant reminder of nature's indifference to human affairs. Dim lights flicker in the lobby, casting shadows that seem to breathe with life. The distant sound of clinking glasses and hushed conversations intertwines with the crashing waves, creating a symphony of unease that envelops the hotel. Guests move through the space, their expressions a mix of anticipation and dread, each moment fraught with the possibility of revelation.",
      "As the night deepens, the hotel transforms into a labyrinth of uncertainty. The cool breeze carries whispers from the beach, where the tides lap against the shore, a reminder of the ebb and flow of life. Outside, the overcast sky looms like a heavy curtain, while inside, the tension is palpable, a collective breath held in anticipation of what is to come. The Seabreeze Hotel stands not just as a place of rest, but as a crucible for the unfolding mystery."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious area with high ceilings, adorned with ornate chandeliers and plush seating.",
      "sensoryDetails": {
        "sights": [
          "gleaming chrome accents",
          "ornate chandeliers",
          "geometric patterned carpets",
          "large potted palms"
        ],
        "sounds": [
          "murmurs of conversation",
          "clinking of glasses",
          "footsteps on marble",
          "the faint crackle of radio news"
        ],
        "smells": [
          "freshly polished wood",
          "cigarette smoke lingering",
          "salt and sea air",
          "blends of perfume"
        ],
        "tactile": [
          "smooth marble floors",
          "plush velvet upholstery",
          "cool metal of railings",
          "softness of draped curtains"
        ]
      },
      "accessControl": "Open to all guests; staff-only areas behind reception.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "raindrops on window panes"
          ],
          "sounds": [
            "steady drumming on the roof",
            "soft footsteps on wet floors"
          ],
          "smells": [
            "dampness in the air",
            "freshly brewed coffee",
            "wet stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dimming the colors",
            "shadows creeping across the floor"
          ],
          "sounds": [
            "the hum of conversations",
            "the distant ticking of a clock"
          ],
          "smells": [
            "dust in the air",
            "scent of old books",
            "wood polish"
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
            "laughter echoing from the dining room",
            "the distant crash of waves"
          ],
          "smells": [
            "candle wax melting",
            "freshly baked bread",
            "cooked seafood"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of the Seabreeze Hotel is a bustling hub, where guests gather under the shimmering chandeliers. The polished marble floors reflect the elegance of the Art Deco design, while plush seating invites weary travelers to pause. The air is filled with the mingling scents of perfume and salt, punctuated by the faint crackle of the radio broadcasting the latest news. Each conversation seems to carry an undercurrent of tension, as if the very walls are listening.",
        "As shadows lengthen, the atmosphere shifts. The once vibrant lobby transforms into a space thick with anticipation. Guests exchange furtive glances, their voices dropping to hushed tones. The distant sound of waves crashing against the beach becomes a haunting backdrop, as the hotel stands on the precipice of revealing its secrets. The lobby, alive with the pulse of life, now feels like a stage set for a drama yet to unfold."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Social gathering and dining",
      "visualDetails": "Elegantly set tables with ocean views, adorned with fine china and polished silverware.",
      "sensoryDetails": {
        "sights": [
          "expansive windows overlooking the sea",
          "elegantly set tables",
          "flickering candlelight",
          "decorative seafood-themed murals"
        ],
        "sounds": [
          "clinking of silverware",
          "soft music playing in the background",
          "murmurs of conversation",
          "the ocean waves crashing"
        ],
        "smells": [
          "rich aroma of seafood",
          "freshly baked bread",
          "scent of herbs and spices",
          "lingering perfume"
        ],
        "tactile": [
          "cool glass of the window",
          "smooth china plates",
          "soft linen napkins",
          "the warmth of candle flames"
        ]
      },
      "accessControl": "Open to all guests during meal times; reservations recommended.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light through rain-streaked windows",
            "cloudy reflections on the table"
          ],
          "sounds": [
            "soft patter of rain",
            "the rustle of newspapers"
          ],
          "smells": [
            "aroma of coffee brewing",
            "freshly baked pastries",
            "wet earth outside"
          ],
          "mood": "somber and reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "muted colors of the decor",
            "shadows pooling in corners"
          ],
          "sounds": [
            "soft jazz playing",
            "the distant sound of rolling thunder"
          ],
          "smells": [
            "scent of simmering sauces",
            "fresh herbs",
            "the tang of citrus"
          ],
          "mood": "mellow and contemplative"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset reflected in glassware",
            "glistening seafood platters"
          ],
          "sounds": [
            "laughter and chatter",
            "clinking glasses raised in toasts"
          ],
          "smells": [
            "savory roasted meats",
            "sweet desserts",
            "the scent of fine wine"
          ],
          "mood": "festive and charged with energy"
        }
      ],
      "paragraphs": [
        "The Dining Room of the Seabreeze Hotel offers a feast for both the eyes and palate. With its expansive windows framing the tumultuous sea, guests dine amidst the flickering candlelight, their meals accompanied by the sounds of waves crashing against the shore. The rich aromas of seafood and herbs fill the air, mingling with the laughter and chatter that reverberate off the walls. Yet beneath the festive atmosphere, a tension simmers, as each guest is acutely aware of the secrets that dwell within the hotel.",
        "As the evening progresses, the mood shifts. Conversations grow hushed, eyes darting toward the entrance as if waiting for a revelation. The dining room, once a vibrant gathering place, feels heavy with unspoken words. The scents of roasted meats and sweet desserts linger, but the air is thick with anticipation, as if the night itself holds its breath, waiting for the truth to emerge."
      ]
    },
    {
      "id": "kitchen",
      "name": "Kitchen",
      "type": "interior",
      "purpose": "Preparation of meals",
      "visualDetails": "A bustling space filled with stainless steel appliances and organized chaos.",
      "sensoryDetails": {
        "sights": [
          "steam rising from pots",
          "chefs moving swiftly",
          "colorful vegetables being chopped",
          "gleaming knife racks"
        ],
        "sounds": [
          "clanging pots and pans",
          "sizzling on the stove",
          "the chatter of kitchen staff",
          "the hum of refrigeration"
        ],
        "smells": [
          "aroma of garlic and onions",
          "freshly baked bread",
          "spicy herbs",
          "the scent of cleaning products"
        ],
        "tactile": [
          "smooth stainless steel countertops",
          "warmth from the ovens",
          "coolness of the refrigerator door",
          "texture of chopping boards"
        ]
      },
      "accessControl": "Staff-only access; no guests allowed.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dampness on the windows",
            "steam fogging glass surfaces"
          ],
          "sounds": [
            "raindrops hitting the roof",
            "the clatter of pots"
          ],
          "smells": [
            "freshly brewed coffee",
            "the scent of rain on earth",
            "baking pastries"
          ],
          "mood": "busy and industrious"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the countertops",
            "fading light from overhead fixtures"
          ],
          "sounds": [
            "the hum of the oven",
            "soft conversations among staff"
          ],
          "smells": [
            "scent of simmering sauces",
            "the freshness of herbs",
            "baking bread"
          ],
          "mood": "calm and focused"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glittering utensils catching the light",
            "plates being arranged for service"
          ],
          "sounds": [
            "the bustle of final preparations",
            "the clinking of serving dishes"
          ],
          "smells": [
            "savory spices filling the air",
            "the sweetness of desserts",
            "the warmth of cooked meats"
          ],
          "mood": "structured and energetic"
        }
      ],
      "paragraphs": [
        "The kitchen of the Seabreeze Hotel is a hive of activity, where chefs work with precision amid the organized chaos. The scent of garlic and onions sizzling fills the air, blending with the aroma of freshly baked bread. Steam rises from pots on the stove, and the rhythmic clanging of pots and pans creates a symphony of culinary artistry. Staff move swiftly, their expressions a mix of determination and camaraderie, all too aware of the importance of their craft amidst the growing tension outside.",
        "As evening approaches, the kitchen transforms into a place of high anticipation. The air is thick with the scents of savory dishes being prepared, and the staff's energy is palpable. Each dish is a step toward the evening's service, yet whispers of uncertainty drift through the space. The kitchen, a realm of creation, is also a site where secrets simmer just below the surface, waiting for the right moment to bubble over."
      ]
    },
    {
      "id": "beach",
      "name": "Beach",
      "type": "exterior",
      "purpose": "Crime scene and gathering space",
      "visualDetails": "A stretch of pebbled shoreline with crashing waves and a distant lighthouse.",
      "sensoryDetails": {
        "sights": [
          "dark, rolling waves crashing",
          "moonlight glinting off the water",
          "distant silhouette of a lighthouse",
          "scattered driftwood and seaweed"
        ],
        "sounds": [
          "roaring surf",
          "whispering winds",
          "distant calls of seagulls",
          "the crunch of pebbles underfoot"
        ],
        "smells": [
          "fresh ocean air",
          "scent of damp earth",
          "briny seaweed",
          "the sweetness of night-blooming flowers"
        ],
        "tactile": [
          "cool pebbles underfoot",
          "chill of ocean breeze",
          "smoothness of driftwood",
          "wetness of sea spray"
        ]
      },
      "accessControl": "Public access; restricted access after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey skies hanging low",
            "waves splashing against rocks"
          ],
          "sounds": [
            "steady rhythm of rain on the surface",
            "the roar of waves"
          ],
          "smells": [
            "damp earth",
            "fresh sea air",
            "wet stones"
          ],
          "mood": "gloomy and foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "muted colors of the sea",
            "clouds hanging heavy"
          ],
          "sounds": [
            "the crash of waves",
            "soft whisper of wind"
          ],
          "smells": [
            "salt in the air",
            "the scent of wet sand",
            "the tang of seaweed"
          ],
          "mood": "somber and reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the horizon",
            "silhouetted figures walking"
          ],
          "sounds": [
            "gentle lapping of waves",
            "laughter from nearby gatherings"
          ],
          "smells": [
            "fresh ocean breeze",
            "the scent of grilled food",
            "the sweetness of night air"
          ],
          "mood": "mysterious and charged"
        }
      ],
      "paragraphs": [
        "The beach stretches out before the Seabreeze Hotel, a pebbled shoreline where the ocean meets the land. Waves crash rhythmically, their roar mingling with the whispers of the wind. Moonlight glimmers on the water, casting an ethereal glow over the scene. Here, secrets lie beneath the surface, hidden among the driftwood and seaweed. The air is thick with the scent of salt and damp earth, a reminder of the mysteries that the night holds.",
        "As the evening unfolds, the beach transforms into a gathering space, where laughter and conversation mix with the sound of waves. Yet, the shadows cast by the setting sun hint at the tension beneath the surface, as guests share furtive glances. The beach, once a place of solace, now feels charged with the weight of unspoken truths, as the ocean continues its relentless dance with the shore."
      ]
    }
  ],
  "note": "",
  "cost": 0.0022858176,
  "durationMs": 29032
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "February",
    "day": 14,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "Cool evening with a slight ocean breeze",
      "Overcast skies typical of coastal regions",
      "Chilly temperatures ranging from 35°F to 45°F"
    ],
    "daylight": "Short winter days with sunset around 5:30 PM, leaving early evenings draped in darkness.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Valentine's Day"
    ],
    "seasonalActivities": [
      "Strolling by the beach wrapped in warm coats",
      "Attending local dances or parties in hotel ballrooms",
      "Gathering for intimate dinners in cozy restaurants"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Navy blue wool suit with wide lapels",
        "White dress shirt with a stiff collar",
        "Silk tie with geometric patterns"
      ],
      "casual": [
        "Tweed jacket with elbow patches",
        "Button-down flannel shirt",
        "Heavy wool sweater"
      ],
      "accessories": [
        "Leather gloves",
        "Fedora hat",
        "Pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea-length evening gown with a fitted bodice",
        "Faux fur stole",
        "String of pearls"
      ],
      "casual": [
        "Wool cardigan over a patterned dress",
        "High-waisted trousers with a tucked-in blouse",
        "Knee-length A-line skirt"
      ],
      "accessories": [
        "Cloche hat",
        "Seamed stockings",
        "Leather handbag"
      ]
    },
    "trendsOfTheMoment": [
      "Bold colors and patterns in evening wear",
      "Increased use of synthetic fabrics due to wartime shortages",
      "Heels that are both practical and stylish"
    ],
    "socialExpectations": [
      "Men expected to wear suits in public places",
      "Women encouraged to wear practical yet stylish clothing",
      "Formal social events often require evening attire"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Allied forces continue to plan for the D-Day invasion",
      "The Battle of Anzio is underway in Italy",
      "Rationing of food and materials continues across the UK and US"
    ],
    "politicalClimate": "The global focus is on the escalating war efforts, leading to heightened national pride but also anxiety about losses.",
    "economicConditions": "Wartime economy is strained with rationing affecting daily life, but there is a sense of resilience among the populace.",
    "socialIssues": [
      "Women in the workforce gain more recognition",
      "Discussions on post-war reconstruction begin to emerge",
      "Civil rights movements gain early traction amid wartime service"
    ],
    "internationalNews": [
      "Reports of resistance movements in occupied Europe",
      "Tensions rise with the Soviet Union as they push towards Eastern Europe",
      "Naval engagements in the Pacific continue to dominate headlines"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - 'Swinging on a Star'",
        "Glenn Miller - 'In the Mood'",
        "The Andrews Sisters - 'Boogie Woogie Bugle Boy'"
      ],
      "films": [
        "'To Have and Have Not'",
        "'Double Indemnity'",
        "'Since You Went Away'"
      ],
      "theater": [
        "'Oklahoma!'",
        "'The Glass Menagerie'"
      ],
      "radio": [
        "'The Shadow'",
        "'Jack Benny Show'",
        "'Suspense'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Thin Man' by Dashiell Hammett",
        "'The Glass Key' by Dashiell Hammett",
        "'The Stranger' by Albert Camus"
      ],
      "popularGenres": [
        "Mystery",
        "Romance",
        "War fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "Radar technology advances in military applications",
        "Development of early computing machines for war logistics",
        "Telephone technology expands with more households acquiring phones"
      ],
      "commonDevices": [
        "Mechanical typewriters",
        "Radio receivers",
        "Basic electrical appliances"
      ],
      "emergingTrends": [
        "Increased reliance on radio broadcasts for news",
        "Cinemas using newsreels to inform the public about the war",
        "The beginnings of television as a household item in urban areas"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pound of sugar: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "Gathering for tea with friends",
        "Participating in community fundraisers for the war effort",
        "Attending local dances or social clubs"
      ],
      "socialRituals": [
        "Saturday night dances at the local hall",
        "Sunday family dinners",
        "Exchanging Valentine's cards on February 14"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "A growing middle class with aspirations for the future",
      "Working-class solidarity as many men are away at war"
    ],
    "gender": [
      "Women taking on roles traditionally held by men",
      "Increased visibility of women's contributions to the workforce",
      "Struggles for equality in both the workplace and home"
    ],
    "race": [
      "Heightened awareness of civil rights issues as minorities serve in the military",
      "Tensions in urban centers as communities navigate wartime changes"
    ],
    "generalNorms": [
      "A strong sense of patriotism and duty to support the war effort",
      "Heightened communal living and cooperation due to rationing",
      "Expectations of resilience and strength in the face of adversity"
    ]
  },
  "atmosphericDetails": [
    "The sound of crashing waves mixing with the distant hum of radio broadcasts from nearby hotels.",
    "The chilly air carries the faint scent of salt and smoke from nearby chimneys, evoking a sense of warmth and togetherness indoors.",
    "Flickering lights from candlelit tables create an ambiance of intimacy and tension, where whispered conversations seem amplified against the quiet backdrop of the coastal night."
  ],
  "paragraphs": [
    "February 1944 presents a scene steeped in tension, where the coastal air is crisp and cool, and the overcast skies loom like heavy curtains over the small hotel. The scent of saltwater mingles with the faint aroma of meals prepared in the kitchen, creating an inviting yet suspenseful atmosphere. As guests gather to celebrate Valentine's Day, the air brims with anticipation, laughter, and an undercurrent of unease as the realities of war continue to cast a shadow over their lives. The evening is marked by the sound of jazz music escaping from the ballroom, where couples dance, oblivious to the world beyond their immediate joy.",
    "Fashion during this winter month reveals a blend of elegance and practicality. Men walk into the hotel wearing tailored navy suits, paired with crisp white shirts and patterned ties, while women don tea-length evening gowns that shimmer under the dim lights, completed with faux fur stoles draped over their shoulders. Accessories such as leather gloves and cloche hats are popular, highlighting the 1940s trend of mixing sophistication with wartime practicality. This attention to appearance is not merely for show; it serves as a form of defiance against the grim backdrop of rationing and uncertainty, where every outing feels like a statement of resilience.",
    "Daily life in February 1944 is marked by a rhythm of hope and hardship. With rations affecting everything from sugar to coal, families gather closely around their radios to stay informed about the war, sharing news and dreams of peace over cups of tea. The price of a loaf of bread is four pence, a reminder of the ongoing struggle to make ends meet. Social rituals like Saturday night dances and the exchange of Valentine's cards lend a sense of normalcy amid the chaos, fostering community and connection. Yet, the lingering effects of war are palpable, with conversations often shifting to the fate of loved ones serving overseas, intertwining personal stories with the broader narrative of a nation at war."
  ],
  "note": "",
  "cost": 0.00113652165,
  "durationMs": 65264
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A delayed-action poisoning during a tense gathering at a coastal hotel reveals the complex social dynamics shaped by WWII, as heirs and staff navigate shifting roles and hidden resentments.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has altered traditional class roles, with women increasingly in the workforce and societal pressures heightening as individuals cope with post-war trauma."
  },
  "setting": {
    "location": "A coastal hotel built in the 1920s, featuring Art Deco architecture.",
    "institution": "hotel",
    "weather": "Cool evening with a slight ocean breeze and overcast skies."
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
    "id": "brooch_weight",
    "value": "three ounces",
    "description": "the weight of the brooch, affecting its comfort and wear time"
  },
  {
    "id": "temperature_threshold",
    "value": "ninety-eight point six degrees Fahrenheit",
    "description": "the body temperature at which the poison activates"
  },
  {
    "id": "release_duration",
    "value": "two hours",
    "description": "the time it takes for the poison to start affecting the victim"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 8,
    "mid": 11,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 19,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "id": "clue_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
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
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_7",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_9",
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
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
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
