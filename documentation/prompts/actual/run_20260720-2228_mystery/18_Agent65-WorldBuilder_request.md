# Actual Prompt Record

- Run ID: `mystery-1784586490642`
- Project ID: ``
- Timestamp: `2026-07-20T22:33:19.458Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `d477d2f1fd8132e8`

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
      "subtype": "drowning"
    }
  },
  "death_method": "drowned",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "a curious and perceptive guest",
      "private_secret": "has a personal connection to the victim",
      "motive_seed": "seeking justice for a friend",
      "motive_strength": "strong",
      "alibi_window": "9:30-10:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "lobby",
        "beach"
      ],
      "behavioral_tells": [
        "observant",
        "questions others"
      ],
      "stakes": "personal investigation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [
        "friend of the victim"
      ],
      "public_persona": "a respected physician",
      "private_secret": "was romantically involved with the victim",
      "motive_seed": "jealousy over a recent breakup",
      "motive_strength": "moderate",
      "alibi_window": "9:40-10:10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "lobby",
        "hotel room"
      ],
      "behavioral_tells": [
        "defensive when questioned"
      ],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "suspect",
      "relationships": [
        "former acquaintance of the victim"
      ],
      "public_persona": "a retired sea captain",
      "private_secret": "has a gambling debt",
      "motive_seed": "financial desperation",
      "motive_strength": "strong",
      "alibi_window": "9:30-10:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "beach",
        "lobby"
      ],
      "behavioral_tells": [
        "nervous around money matters"
      ],
      "stakes": "debt repayment",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "suspect",
      "relationships": [
        "cousin of the victim"
      ],
      "public_persona": "a charming socialite",
      "private_secret": "jealous of the victim's popularity",
      "motive_seed": "envy",
      "motive_strength": "low",
      "alibi_window": "9:45-10:15 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "beach",
        "lobby"
      ],
      "behavioral_tells": [
        "flirtatious but evasive"
      ],
      "stakes": "family reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [
        "friend of the victim"
      ],
      "public_persona": "a local artist",
      "private_secret": "had a fight with the victim",
      "motive_seed": "dispute over an art piece",
      "motive_strength": "moderate",
      "alibi_window": "9:30-10:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "beach",
        "lobby"
      ],
      "behavioral_tells": [
        "emotional when discussing the victim"
      ],
      "stakes": "personal integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "friends with all suspects"
      ],
      "public_persona": "a wealthy gentleman",
      "private_secret": "hiding financial troubles",
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
      "summary": "In a foggy seaside hotel, the drowning of Hugo Vane is shrouded in deception as Eleanor Voss uncovers a web of lies and manipulations surrounding the tidal timings that could unveil the murderer."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on victim, trapp, and witness to expose the false timing.",
      "delivery_path": [
        {
          "step": "Captain Hale adjusted the tide schedule to create a false window for the drowning."
        }
      ]
    },
    "outcome": {
      "result": "The victim was drowned at a time that contradicts the actual tide schedule."
    }
  },
  "false_assumption": {
    "statement": "The victim drowned during high tide, which occurred at ten minutes past ten.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses confirm seeing the victim at the beach shortly before high tide.",
    "what_it_hides": "The actual tide schedule was manipulated by the murderer."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch had a motive due to his recent breakup with the victim.",
      "Witnesses saw him near the beach shortly before the incident."
    ],
    "the_one_flaw": "Dr. Finch was in the hotel lobby at the time of the actual drowning, verified by multiple witnesses.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses saw Dr. Mallory Finch near the beach shortly before the incident.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "He was simply walking back to the hotel after visiting the victim.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Footprints leading to a concealed area on the beach.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "Captain Hale was checking the tide levels for his boat.",
      "resolved_in_chapter": 7
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
    "rationale": "All suspects were present at the hotel during the murder and had opportunities to commit the crime."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "high tide at 10:10 PM",
        "victim seen at beach at 9:45 PM"
      ],
      "windows": [
        "alibi window of suspects from 9:30 to 10:30 PM"
      ],
      "contradictions": [
        "Witnesses' statements conflict with the manipulated tide schedule."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Dr. Mallory Finch"
      ],
      "objects": [
        "tide schedule",
        "beach"
      ],
      "permissions": [
        "Captain Hale's boat access"
      ]
    },
    "physical": {
      "laws": [
        "tide manipulation affects timing"
      ],
      "traces": [
        "footprints leading away from the tide-sensitive area"
      ]
    },
    "social": {
      "trust_channels": [
        "witness reliability in the fog"
      ],
      "authority_sources": [
        "local tide expert"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses saw Hugo Vane at the beach at quarter to ten.",
        "correction": "This indicates he was still alive shortly before the high tide.",
        "effect": "Narrows the window for the murder to between nine forty-five and ten.",
        "required_evidence": [
          "Witness statements confirming Hugo Vane's presence at beach",
          "Tide schedule showing high tide at ten minutes past ten"
        ],
        "reader_observable": true
      },
      {
        "observation": "The tide schedule was altered days before the incident.",
        "correction": "This suggests premeditated manipulation of the tidal information.",
        "effect": "Eliminates the possibility that the drowning was accidental.",
        "required_evidence": [
          "Maintenance records indicating schedule alteration",
          "Witnesses' accounts of unusual tides prior to the incident"
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints in the sand lead to a concealed area away from the main beach.",
        "correction": "This suggests the victim was lured or trapped away from safety.",
        "effect": "Narrows suspicion towards those who had access to that area.",
        "required_evidence": [
          "Footprint analysis indicating a struggle",
          "Witnesses confirming no one else was seen near the concealed area"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing tide tables with witness statements and footprints will expose the altered timeline.",
    "knowledge_revealed": "The actual timing of the high tide contradicts the witnesses' statements about the victim's presence.",
    "pass_condition": "If the timelines do not match, Captain Hale's alibi collapses.",
    "evidence_clues": [
      "clue_10",
      "clue_mechanism_visibility_core",
      "clue_5"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements (early) and tide schedule (mid) establish the victim's last known moments. Step 2: Maintenance records (mid) reveal tampering with the tide schedule. Step 3: Footprint evidence (discriminating test) clarifies the timing and location of the murder."
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
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Multiple witnesses confirm he was in the lobby.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm her alibi at a different event.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness statements clear her due to time conflicts.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening",
        "supporting_clues": [
          "witness_statement_1"
        ]
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
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
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
    "summary": "Eleanor Voss, a traveling journalist, finds herself entangled in a murder investigation while pursuing a feature piece at a seaside hotel. She struggles with the weight of her past and the desire to prove herself.",
    "publicPersona": "Charming and inquisitive, known for her insightful articles on local culture.",
    "privateSecret": "Struggles with guilt over a past romantic relationship that ended badly.",
    "motiveSeed": "Drawn to the hotel for a feature piece, she accidentally witnesses a heated argument before the murder.",
    "motiveStrength": "moderate",
    "alibiWindow": "Present at the hotel since the beginning of the week.",
    "accessPlausibility": "easy",
    "stakes": "Wants to make a name for herself in journalism.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a warm, engaging tone, often using rhetorical questions to draw people in. She has a tendency to intersperse her observations with dry humor, making her commentary both insightful and relatable.",
    "signatureTic": "You know, it’s funny how life turns out, isn’t it?",
    "internalConflict": "Eleanor is haunted by the memory of her last relationship, which ended in betrayal and left her with a lingering sense of unworthiness.",
    "personalStakeInCase": "This crime feels personal to Eleanor because she sees the potential for redemption through her investigation, a chance to prove herself in journalism and confront her own failures.",
    "paragraphs": [
      "Eleanor Voss arrived at the seaside hotel with the expectation of a quaint retreat for her latest article, but the atmosphere shifted dramatically when she stumbled upon a heated argument between the victim and a mysterious figure. The charm of the hotel dimmed as the tension thickened, and Eleanor felt an inexplicable pull towards the unfolding drama. With her reporter's instincts kicking in, she couldn't help but linger, her curiosity piqued, unaware that she was about to become an integral part of a chilling tale.",
      "As she navigated the intricate web of relationships within the hotel, Eleanor found herself grappling with her inner demons. The memory of her last romantic entanglement haunted her, the weight of guilt pressing heavily on her shoulders. She had always been the inquisitive type, diving headfirst into the lives of others, yet when it came to her own past, she found herself hesitating. The murder investigation became a mirror, reflecting her unresolved feelings about love and betrayal, forcing her to confront the fears she had buried deep within.",
      "Eleanor's charm and inquisitiveness won her the trust of the other hotel guests, but her underlying struggle for validation became evident. Each interview with a suspect felt like a step toward proving her worth, not just as a journalist, but as a person. She often caught herself wondering if this investigation was merely a distraction from her own failures or a genuine opportunity for redemption. The stakes were high; she needed this story to make a name for herself, yet the deeper she delved into the case, the more she realized it was about so much more than that.",
      "Her observational humor often lightened the mood during tense conversations, but beneath the surface, Eleanor wrestled with the moral implications of her findings. The secrets she uncovered were not just stories to be told; they were lives intertwined with her own. As the threads of the investigation began to unravel, Eleanor understood that the truth might not only bring justice for the victim but also force her to confront the truth about herself. The case had become personal, and she could no longer hide from her past."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected surgeon who finds himself under suspicion after the murder of his estranged family member. Beneath his philanthropic exterior lies a simmering resentment that could lead to dire consequences.",
    "publicPersona": "Respected physician, known for his philanthropic efforts in the community.",
    "privateSecret": "Harbors resentment towards the victim for inheriting the family estate.",
    "motiveSeed": "Believes the victim intended to change the will, cutting him out of the family fortune.",
    "motiveStrength": "strong",
    "alibiWindow": "In surgery during the time of the murder, but procedure length is uncertain.",
    "accessPlausibility": "possible",
    "stakes": "Financial security tied to family inheritance.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks in a measured and precise manner, often punctuating his statements with dry humor. His words are chosen carefully, revealing a sharp intellect but also a tendency to maintain emotional distance.",
    "signatureTic": "I suppose we all have our burdens to bear, don’t we?",
    "internalConflict": "Dr. Finch grapples with feelings of betrayal and inadequacy stemming from his family's dynamics, which complicate his professional demeanor.",
    "personalStakeInCase": "The murder not only threatens his financial security but also forces him to confront the family rifts that have shaped his life.",
    "paragraphs": [
      "Dr. Mallory Finch, a well-respected surgeon, had always prided himself on his contributions to the community. His philanthropic efforts painted him as a benefactor of the highest order, yet beneath this polished veneer lay a festering resentment towards the victim. The inheritance that had been promised to him was now at risk of slipping through his fingers, and the thought of being cast aside by his own family gnawed at him relentlessly. When the murder occurred, it felt as if the threads of his carefully constructed life were unraveling, leaving him exposed.",
      "In the sterile confines of the operating room, Dr. Finch felt in control. His hands deftly maneuvered through intricate procedures, a stark contrast to the chaos that awaited him outside those walls. However, the day of the murder, he found himself in a precarious position. While he claimed to be performing surgery, the length of the procedure was uncertain, casting doubt over his alibi. The irony was not lost on him; a man who had always been the epitome of reliability now stood on the precipice of suspicion.",
      "As the investigation unfolded, Dr. Finch's dry wit became a defense mechanism, allowing him to maintain a façade of composure amidst the rising tension. His conversations were laced with a sardonic edge, masking the turmoil roiling within. Yet, the more he deflected with humor, the more he felt the weight of his unexpressed bitterness. The victim’s plans to alter the will were a direct threat to his financial security, and the thought of being cut out of the family fortune was enough to ignite a darker side he had long buried.",
      "Navigating the intricate relationships within the family, Dr. Finch found himself at a crossroads. The murder investigation forced him to confront the unresolved issues that had plagued his family for years. Loyalty was tested, and the lines between love and resentment blurred. As he sought to protect his interests, he realized that the quest for justice could also lead to the unearthing of secrets that might shatter his carefully maintained reputation. The stakes were higher than he had ever anticipated, and the outcome of this investigation could determine not just his future but the very essence of who he was."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired Navy officer, grapples with his past as he becomes embroiled in a murder investigation tied to a secret romance. His sense of honor is tested as the truth threatens to emerge.",
    "publicPersona": "Chivalrous and honorable figure, a war hero turned hotel security consultant.",
    "privateSecret": "Secretly had a romantic involvement with the victim that he never disclosed.",
    "motiveSeed": "Was threatened by the victim’s plans to reveal their past relationship, which could ruin his reputation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be checking security footage, but the tapes are mysteriously missing.",
    "accessPlausibility": "easy",
    "stakes": "Protecting his honor and reputation.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks in a formal and authoritative tone, often punctuated by self-deprecating remarks. His sentences are carefully constructed, reflecting his military background, yet he occasionally reveals a softer side when discussing personal matters.",
    "signatureTic": "I suppose it was a matter of time before the past caught up with me.",
    "internalConflict": "Captain Hale is torn between his sense of duty and the guilt of a secret relationship that could tarnish his reputation.",
    "personalStakeInCase": "The murder investigation threatens to expose his hidden past and jeopardize the honor he has fought to uphold.",
    "paragraphs": [
      "Captain Ivor Hale stood tall, a figure of chivalry and honor, yet beneath his polished exterior lay a tumultuous past. A retired Navy officer turned hotel security consultant, he had dedicated his life to protecting others. However, when the murder occurred, his own secrets threatened to surface. The victim, a woman with whom he had shared a clandestine romance, had plans to expose their relationship, and the thought of his reputation crumbling was almost more than he could bear.",
      "In the wake of the murder, Ivor's demeanor shifted. He claimed to be reviewing security footage at the time of the crime, but the tapes had mysteriously vanished. The irony was not lost on him; a man who had spent his life safeguarding others now found himself in a precarious position. His self-deprecating humor often surfaced during conversations, a shield against the scrutiny he faced. Each quip was a reminder of the weight of his past, a burden he could no longer ignore.",
      "As he navigated the investigation, Ivor's sense of duty clashed with the guilt of his hidden relationship. The stakes were high; protecting his honor meant confronting the very truth he had sought to bury. He was caught in a maze of emotions, torn between the love he once felt and the need to uphold the principles he had fought for. The investigation became a battleground, one where his past decisions were laid bare, forcing him to question everything he believed about honor and loyalty.",
      "Ivor understood that the truth would eventually emerge, and with it, the possibility of ruin. As he faced the growing suspicions of those around him, he found solace in the knowledge that his intentions had always been noble. Yet, the irony of his situation was not lost on him; he had fought to protect others only to find himself in a position where he had to protect himself. The past had indeed caught up with him, and now, he had to decide what he was willing to sacrifice to preserve his reputation."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a socialite accustomed to luxury, finds herself entangled in a murder investigation that threatens her lavish lifestyle. With financial troubles looming, her ambition may lead her to darker paths.",
    "publicPersona": "Known for her lavish parties and connections, seeking a high-profile marriage.",
    "privateSecret": "Desperately in debt due to extravagant spending and was relying on the victim for financial support.",
    "motiveSeed": "Stands to inherit a significant amount from the victim, who was considering cutting her off.",
    "motiveStrength": "strong",
    "alibiWindow": "Was seen at a charity event, but exact timings are unclear.",
    "accessPlausibility": "possible",
    "stakes": "Financial stability and social status.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with a confident, almost theatrical flair, often using sarcasm to mask her insecurities. Her dialogue is laced with dramatic pauses and a hint of arrogance, reflecting her social standing.",
    "signatureTic": "Oh darling, isn’t life just a grand performance?",
    "internalConflict": "Beatrice is torn between her ambition for social elevation and the moral implications of her actions, leading to a constant battle between appearance and reality.",
    "personalStakeInCase": "The murder investigation jeopardizes her financial security and threatens to expose her extravagant lifestyle, forcing her to confront the truth of her situation.",
    "paragraphs": [
      "Beatrice Quill glided through the hotel lobby with the air of someone who owned the world. As a socialite renowned for her extravagant parties, she had always been the center of attention, her laughter echoing off the walls like music. But beneath her glamorous façade lay a tangled web of financial troubles. Desperately in debt due to her lavish spending, she relied heavily on the victim for financial support. When the murder occurred, it felt as if the ground beneath her was crumbling, and the stakes had never been higher.",
      "At the charity event she attended the night of the murder, Beatrice played the part of the concerned socialite flawlessly, yet the uncertainty of her alibi gnawed at her. She often masked her insecurities with a sardonic wit, using humor to deflect the probing questions of others. 'Oh darling, isn’t life just a grand performance?' she would quip, but inside, a storm was brewing. The specter of losing her financial backing loomed large, and the thought of being cut off sent chills down her spine.",
      "As the investigation unfolded, Beatrice's ambition clashed with her morality. She stood to inherit a significant amount from the victim, who had been contemplating severing ties with her. The realization that her financial stability hung by a thread sent her spiraling into a moral quandary. Would she do whatever it took to secure her future, even if it meant crossing a line she had never considered before? The pressure was mounting, and Beatrice felt the weight of her choices bearing down on her.",
      "Caught between her desire for social elevation and the reality of her situation, Beatrice was forced to confront the truth of her extravagant lifestyle. The murder investigation was not just a threat to her financial security; it was an examination of her very identity. As she navigated the treacherous waters of suspicion, she found herself questioning everything she had built her life upon. Would she emerge from the shadows of this tragedy, or would the truth bring her crashing down?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, the hotel manager, is a guardian of secrets who must confront her hidden past as the murder investigation unfolds. Her dedication to the hotel’s reputation is tested as she navigates loyalty and truth.",
    "publicPersona": "Professional and caring, dedicated to maintaining the hotel’s reputation.",
    "privateSecret": "Knows more about the family secrets than she lets on and is tied to the victim through a hidden past.",
    "motiveSeed": "Protecting the hotel’s reputation from the victim's plans to expose past scandals.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claims to have been in her office, but no one can corroborate.",
    "accessPlausibility": "easy",
    "stakes": "Her career and the integrity of the hotel.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with an air of professionalism, yet her words often carry a sharp edge. She has a tendency to deliver her observations with a polite savagery, revealing her keen insight into the human condition while maintaining a composed demeanor.",
    "signatureTic": "Ah, the lengths we go to protect our little secrets.",
    "internalConflict": "Sylvia is torn between her loyalty to the hotel and the need to confront the truth about her past connections with the victim.",
    "personalStakeInCase": "The murder investigation threatens not only her career but also the integrity of the hotel she has dedicated her life to, forcing her to reevaluate her values.",
    "paragraphs": [
      "Sylvia Trent, the hotel manager, carried the weight of countless secrets on her shoulders. Her professional demeanor masked a past intertwined with the victim, and as the murder investigation unfolded, she found herself at a crossroads. A guardian of the hotel’s reputation, she had always prided herself on maintaining its integrity, yet the specter of past scandals loomed large. The victim’s plans to expose these secrets threatened to unravel everything she had worked for, and the stakes had never felt higher.",
      "In the confines of her office, Sylvia claimed to have been working during the time of the murder, but the lack of corroboration made her alibi tenuous at best. Her polite savagery often surfaced in conversations, a sharp wit that revealed her keen understanding of human nature. 'Ah, the lengths we go to protect our little secrets,' she would remark, but inside, she felt the pressure mounting. Each day brought new challenges, and the tension in the hotel was palpable, heightening her anxiety.",
      "As the investigation progressed, Sylvia's internal conflict deepened. She was torn between loyalty to the hotel and the need to confront the truth about her past connections with the victim. The very foundation of her career was at stake, and the thought of losing everything she had built left her restless. It was a delicate balance; revealing the truth could save her but also expose her own hidden sins. The irony of her situation was not lost on her; the very secrets she had protected now threatened to consume her.",
      "Navigating the treacherous waters of the investigation, Sylvia realized that her choices would determine not only her future but also the fate of the hotel. The murder had unearthed buried truths, and as she grappled with her loyalty and the need for honesty, she found herself questioning her values. Would she continue to protect the hotel at all costs, or would she finally confront the realities of her past? The answers lay shrouded in darkness, and Sylvia knew that the light could only come from facing her demons head-on."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, the victim, was a wealthy investment banker entangled in shady dealings. His murder reveals the dark underbelly of wealth and ambition, leaving a trail of suspects behind.",
    "publicPersona": "Wealthy and influential, known for his business acumen and networking.",
    "privateSecret": "Involved in shady dealings that could ruin his reputation.",
    "motiveSeed": "The victim was about to expose his financial misdoings, threatening his career.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to be in a meeting, but no one can confirm.",
    "accessPlausibility": "possible",
    "stakes": "Maintaining his wealth and social standing.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Hugo spoke with authority and confidence, often using business jargon that reflected his status. His tone was commanding, leaving little room for ambiguity, but his words often lacked warmth, revealing a cold, calculating nature.",
    "signatureTic": "Let’s not beat around the bush.",
    "internalConflict": "Hugo’s ambition blinded him to the consequences of his actions, leading to a sense of isolation as he navigated a world of deceit.",
    "personalStakeInCase": "His murder exposes the fragility of his carefully crafted image and the potential downfall of his empire.",
    "paragraphs": [
      "Hugo Vane was a man who thrived in the world of wealth and influence, his every word dripping with the confidence of a seasoned investment banker. He commanded attention in every room he entered, yet beneath the polished exterior lay a dark underbelly of shady dealings that threatened to unravel his carefully curated life. The night of his murder, Hugo was at the center of a storm, his reputation hanging by a thread as he faced the impending exposure of his financial misdeeds.",
      "Claiming to be in a meeting at the time of his death, Hugo’s alibi was as flimsy as the trust he inspired in others. The irony of his situation was not lost on him; the very empire he had built was now his greatest liability. His speech was often laced with business jargon, a reflection of the world he inhabited, but the warmth of genuine connection was absent. 'Let’s not beat around the bush,' he would say, but the truth was that he had spent his life avoiding it.",
      "As the investigation unfolded, the stakes became painfully clear. Hugo’s ambition had blinded him to the consequences of his actions, leaving him isolated in a world where loyalty was scarce. The murder revealed the fragility of his carefully crafted image, and as the suspects emerged, it became evident that the very people he had relied upon could be his undoing. The darkness of his dealings cast a long shadow, and the truth threatened to emerge in ways he had never anticipated.",
      "In the end, Hugo’s life was a cautionary tale of ambition unchecked by morality. His murder served as a grim reminder that the pursuit of wealth could lead to a devastating downfall. As the investigation continued, the echoes of his past dealings reverberated through the lives of those he had left behind, each suspect grappling with their own motivations and secrets. In death, Hugo Vane became a symbol of the perils of ambition, a testament to the darkness that lurked beneath the surface of wealth and power."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Ocean Crest Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel perched on the cliffs of Brighton, offering stunning ocean views and a touch of Art Deco elegance.",
    "visualDescription": "The hotel boasts sweeping terraces, intricate mosaics, and large bay windows framing the turbulent sea below. A grand staircase spirals through the lobby, flanked by plush lounges and gleaming chandeliers.",
    "atmosphere": "A blend of elegance and tension, where the beauty of the sea contrasts with the unease of recent events.",
    "paragraphs": [
      "The Ocean Crest Hotel stands majestically atop the rugged cliffs of Brighton, its Art Deco facade a gleaming testament to the glamour of the 1940s. The salty breeze carries the faintest echo of laughter from the seaside promenade, but the hotel itself feels shrouded in an unsettling fog, as if harboring secrets beneath its opulent surface. Inside, the lobby is alive with the sound of muted conversations and the soft clinking of glasses, yet an undercurrent of tension hums in the air, suggesting all is not as serene as it appears.",
      "Guests drift through the expansive lobby, their footsteps muffled by the thick carpeting, while the distant crash of waves against the cliffs serves as a reminder of nature's relentless power. High ceilings adorned with geometric patterns loom overhead, casting long shadows in the flickering light of polished sconces. Outside, the ocean churns ominously, reflecting the uncertainty that hangs over the hotel like a heavy curtain.",
      "As the day wanes, the atmosphere thickens with the approach of evening. The flicker of gas lamps casts a warm glow, illuminating the faces of guests who linger over cocktails, unaware of the gathering storm both in the skies and within the hotel. Whispers of scandal swirl alongside the fog, and the once-familiar sound of laughter transforms into a distant memory, replaced by a palpable sense of dread that permeates the air.",
      "With each passing hour, the hotel becomes increasingly isolated from the outside world, as rain begins to patter against the windows, blurring the line between inside and out. The narrow hallways lead to hidden corners, where secrets await discovery, and the staff move with an air of quiet urgency, acutely aware of the tensions brewing beneath the surface. In this elegant yet oppressive setting, the stage is set for a mystery that promises to unravel with the rising tide."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Foggy with occasional rain, typical of coastal climates, affecting visibility and outdoor movement.",
    "timeFlow": "A tense evening unfolds, with night creeping in and secrets lurking in the shadows.",
    "mood": "Tense and mysterious, with an undercurrent of post-war anxiety and the lingering effects of recent events.",
    "eraMarkers": [
      "Art Deco architecture",
      "manual typewriters in the lobby",
      "early radio broadcasts in the lounge",
      "rationed fuel affecting travel",
      "women in workforce post-WWII"
    ],
    "sensoryPalette": {
      "dominant": "Salty sea air and damp fog",
      "secondary": [
        "Glimmering crystal and polished brass",
        "Muffled conversations and distant waves"
      ]
    },
    "paragraphs": [
      "The atmosphere of The Ocean Crest Hotel is thick with anticipation, as the salty sea air mingles with the damp fog that rolls in from the coast. The scent of rain-soaked earth and the briny tang of the ocean create a sensory tapestry that envelops guests as they enter. Flickering gas lamps cast a golden hue against the darkened walls, illuminating the intricate Art Deco details that define the hotel's character, while the distant sound of crashing waves serves as a reminder of the perilous cliffs upon which it stands.",
      "As evening descends, the mood shifts, with the once-vibrant chatter of guests becoming increasingly subdued. The soft clinking of glasses and the rustle of silk gowns are punctuated by the occasional crack of thunder, echoing the tension that seems to build within the hotel's confines. Shadows lengthen and deepen, creating a sense of claustrophobia, as if the walls themselves are closing in, harboring secrets that refuse to be spoken aloud."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space, guest check-in",
      "visualDetails": "High ceilings with geometric patterns, plush seating, and a grand staircase leading to upper floors.",
      "sensoryDetails": {
        "sights": [
          "gleaming brass chandeliers",
          "marble floors reflecting light",
          "richly patterned carpets",
          "large bay windows with ocean views"
        ],
        "sounds": [
          "muffled conversations",
          "clinking of glasses",
          "soft footsteps on carpet",
          "distant waves crashing"
        ],
        "smells": [
          "freshly polished wood",
          "wet stone from the rain",
          "lingering perfume",
          "the tang of salt air"
        ],
        "tactile": [
          "plush velvet upholstery",
          "cool marble underfoot",
          "smooth brass railings",
          "soft woolen blankets draped over chairs"
        ]
      },
      "accessControl": "Guests check in at the front desk; staff-only access to upper floors and service areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked marble floors",
            "grey light filtering through windows"
          ],
          "sounds": [
            "steady patter of rain on glass",
            "soft murmurs of breakfast chatter"
          ],
          "smells": [
            "fresh coffee brewing",
            "toasted bread",
            "wet earth from the garden"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "damp umbrellas in the foyer"
          ],
          "sounds": [
            "the ticking of an old clock",
            "the creak of the staircase"
          ],
          "smells": [
            "dusty old books",
            "mildew from the damp air",
            "the faint scent of flowers"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering in sconces",
            "long shadows from the staircase"
          ],
          "sounds": [
            "laughter from the bar",
            "the distant sound of waves"
          ],
          "smells": [
            "burning candles",
            "freshly mixed cocktails",
            "the scent of the sea"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Ocean Crest Hotel is a spectacle of Art Deco design, where high ceilings soar above guests, adorned with intricate geometric patterns that echo the elegance of the 1940s. Plush seating areas invite weary travelers to linger, while the grand staircase spirals upwards, leading to the mystery of the upper floors. Large bay windows frame the tumultuous sea, a constant reminder of the wild world outside, while the lobby hums with the soft murmur of conversations and the clinking of glasses, creating an atmosphere thick with anticipation.",
        "As the day transitions to evening, the ambiance shifts, the chatter of guests growing quieter, overshadowed by the growing tension in the air. The flickering gas lamps cast a warm glow, illuminating the faces of those gathered, while the distant crashing of waves serves as a haunting backdrop. Secrets linger just below the surface, waiting to be uncovered in this opulent yet uneasy gathering space."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Ocean View Dining Room",
      "type": "interior",
      "purpose": "Dining space for guests",
      "visualDetails": "Expansive windows overlooking the sea, elegant tables set with fine china, and muted tones of blue and gold.",
      "sensoryDetails": {
        "sights": [
          "elegant table settings",
          "sea view through large windows",
          "soft candlelight flickering",
          "artwork depicting maritime scenes"
        ],
        "sounds": [
          "soft clinking of cutlery",
          "subdued laughter",
          "whispers of conversation",
          "the gentle crash of waves"
        ],
        "smells": [
          "freshly baked bread",
          "grilled fish",
          "buttery sauces",
          "the scent of sea salt"
        ],
        "tactile": [
          "smooth linen tablecloths",
          "cold glassware",
          "textured ceramic plates",
          "soft leather chairs"
        ]
      },
      "accessControl": "Open to hotel guests during meal times; staff-only access to kitchen.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down windows",
            "misty ocean view"
          ],
          "sounds": [
            "gentle patter of rain",
            "quiet morning conversations"
          ],
          "smells": [
            "freshly brewed tea",
            "bacon sizzling",
            "the aroma of pastries"
          ],
          "mood": "serene and cozy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim lighting casting shadows",
            "clouded sea beyond the windows"
          ],
          "sounds": [
            "the rustle of napkins",
            "the clink of glasses"
          ],
          "smells": [
            "cooked vegetables",
            "roasted meats",
            "the hint of wine"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "twinkling candle flames",
            "glimmering silverware"
          ],
          "sounds": [
            "soft music from a radio",
            "cheers from nearby tables"
          ],
          "smells": [
            "grilled seafood",
            "herbs and spices",
            "the scent of dessert"
          ],
          "mood": "festive anticipation"
        }
      ],
      "paragraphs": [
        "The Ocean View Dining Room is a culinary haven, where guests are treated to exquisite meals against the backdrop of the crashing waves. Expansive windows allow for stunning views of the tumultuous sea, while elegantly set tables adorned with fine china and flickering candles create an inviting atmosphere. The soft clinking of cutlery and low murmurs of conversation fill the air, accompanied by the tantalizing aromas of fresh seafood and baked bread, drawing guests into a world of indulgence and relaxation.",
        "As the day progresses, the mood of the dining room shifts with the weather. On rainy mornings, the ambiance is cozy and serene, with the gentle patter of rain against the windows creating a comforting soundtrack. By afternoon, the overcast skies cast a somber shadow over the room, as guests reflect on the day, while the evening brings a festive spirit, with laughter and conversation rising in volume as the sun sets and the candles burn brightly."
      ]
    },
    {
      "id": "rooftop",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Outdoor space for relaxation and views",
      "visualDetails": "A spacious terrace with wrought-iron railings, potted plants, and panoramic views of the coastline.",
      "sensoryDetails": {
        "sights": [
          "panoramic ocean views",
          "potted flowers swaying gently",
          "storm clouds gathering on the horizon",
          "distant ships on the water"
        ],
        "sounds": [
          "howling wind",
          "distant thunder",
          "waves crashing against the cliffs",
          "the rustle of leaves"
        ],
        "smells": [
          "fresh sea air",
          "wet grass",
          "the scent of blooming flowers",
          "the earthy aroma of rain"
        ],
        "tactile": [
          "cool metal railings",
          "rough stone underfoot",
          "soft petals brushing against skin",
          "the chill of the wind"
        ]
      },
      "accessControl": "Restricted access; open only to guests after sunset and monitored by staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "cloudy skies",
            "rain-drenched flowers"
          ],
          "sounds": [
            "steady rainfall",
            "the drip of water from eaves"
          ],
          "smells": [
            "damp earth",
            "fresh blooms",
            "the scent of wet stone"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey clouds hanging low"
          ],
          "sounds": [
            "the whisper of the wind",
            "the distant sound of a foghorn"
          ],
          "smells": [
            "salty sea breeze",
            "the scent of rain-soaked earth",
            "the faint aroma of seaweed"
          ],
          "mood": "foreboding tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "twinkling stars above",
            "the moonlight reflecting on the water"
          ],
          "sounds": [
            "the soft lapping of waves",
            "laughter from below"
          ],
          "smells": [
            "night-blooming jasmine",
            "the cool scent of the ocean",
            "the faint smell of smoke from nearby chimneys"
          ],
          "mood": "whimsical tranquility"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers an unparalleled view of the tumultuous sea, framed by wrought-iron railings and adorned with vibrant potted plants that sway gently in the salty breeze. This outdoor oasis becomes a sanctuary for guests seeking to escape the tension that lurks within the hotel's walls. As storm clouds gather on the horizon, the howling wind carries with it a sense of foreboding, while the distant crash of waves against the cliffs serves as a reminder of nature's unpredictable power.",
        "Access to the terrace is limited, allowing guests to retreat into a world of solitude or camaraderie under the stars. In the morning rain, the terrace feels melancholic, with droplets cascading from the flowers, while the overcast afternoon brings an air of tension. Yet as evening falls and the skies clear, the terrace transforms into a whimsical haven, where laughter and whispers mingle with the sounds of the sea, creating an enchanting atmosphere that invites secrets to be shared."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Quiet space for reading and reflection",
      "visualDetails": "A cozy room lined with bookshelves, a large fireplace, and soft armchairs scattered throughout.",
      "sensoryDetails": {
        "sights": [
          "flickering firelight",
          "ornate rugs covering the floor",
          "comfortable armchairs with worn upholstery"
        ],
        "sounds": [
          "crackling firewood",
          "pages turning",
          "the whisper of fabric",
          "the distant sound of rain"
        ],
        "smells": [
          "old leather and paper",
          "smoky fireplace",
          "the scent of fresh coffee",
          "the hint of polished wood"
        ],
        "tactile": [
          "soft wool blankets",
          "rough book spines",
          "smooth wooden tables",
          "the warmth of the fire"
        ]
      },
      "accessControl": "Open to all guests; staff may enter for cleaning and maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on windowpanes",
            "dim light filtering through curtains"
          ],
          "sounds": [
            "gentle rain tapping",
            "soft murmurs of guests"
          ],
          "smells": [
            "freshly brewed coffee",
            "the scent of damp paper",
            "the aroma of baked goods"
          ],
          "mood": "calm reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows deepening in corners",
            "the glow of the fireplace"
          ],
          "sounds": [
            "the crackle of fire",
            "the rustle of turning pages"
          ],
          "smells": [
            "the scent of burning wood",
            "the mustiness of old books",
            "the aroma of tea"
          ],
          "mood": "introspective solitude"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight dancing on the walls",
            "candlelit corners"
          ],
          "sounds": [
            "the quiet of the night",
            "the soft ticking of a clock"
          ],
          "smells": [
            "the rich scent of tobacco",
            "the aroma of hot chocolate",
            "the freshness of cool night air"
          ],
          "mood": "serene comfort"
        }
      ],
      "paragraphs": [
        "The Library is a sanctuary for those seeking solace within the pages of a book. Tall bookshelves line the walls, each filled with leather-bound tomes that whisper the stories of the past. A large fireplace crackles warmly, casting flickering light across the room, while soft armchairs invite guests to settle in with a novel. The scent of old leather and polished wood mingles with the smoky aroma of the fire, creating an atmosphere of quiet reflection and tranquility, far removed from the tensions of the outside world.",
        "As the day unfolds, the Library serves as a refuge from the storm outside. In the morning rain, the dim light filtering through the curtains creates an intimate space for contemplation, while the overcast afternoon deepens the shadows, wrapping the room in introspective solitude. By evening, the clear skies allow the firelight to dance on the walls, inviting guests to linger a little longer in this serene comfort, where secrets can be shared and mysteries pondered."
      ]
    }
  ],
  "note": "",
  "cost": 0.0024096501,
  "durationMs": 29054
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "January",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "foggy with occasional rain",
      "temperatures hovering around freezing",
      "overcast skies limiting natural light"
    ],
    "daylight": "Short days with twilight settling in by four o'clock in the afternoon, leaving long, dim evenings",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner service has concluded",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "Coastal walks despite the chill, wrapped in heavy coats",
      "Community gatherings in local hotels for social dances",
      "Indoor games and reading by the fireplace"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits",
        "broad-brimmed felt hats",
        "polished leather shoes"
      ],
      "casual": [
        "tweed jackets",
        "corduroy trousers",
        "knit sweaters"
      ],
      "accessories": [
        "silk ties with geometric patterns",
        "leather gloves",
        "wool scarves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with fitted bodices and flared skirts",
        "tailored wool coats with padded shoulders",
        "heels with narrow toes"
      ],
      "casual": [
        "knitted cardigans",
        "high-waisted trousers",
        "blouses with Peter Pan collars"
      ],
      "accessories": [
        "clutch purses",
        "beret hats",
        "string of pearls"
      ]
    },
    "trendsOfTheMoment": [
      "bold patterns in textile designs",
      "utilitarian styles adapted from wartime clothing",
      "increased popularity of ready-to-wear fashions"
    ],
    "socialExpectations": [
      "men expected to maintain traditional roles as providers",
      "women increasingly taking on roles in the workforce",
      "social gatherings viewed as essential for morale"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Allied forces continue to strategize for the invasion of Europe",
      "The Battle of the Bulge is ongoing, impacting military morale and public sentiment",
      "Conversations around rationing are prevalent as commodities remain scarce"
    ],
    "politicalClimate": "Tension remains high as the war continues to shape policies and public consciousness across nations, with a focus on unity and resilience",
    "economicConditions": "Rationing persists, leading to shortages, but there is a sense of hope as industries begin gearing up for post-war recovery",
    "socialIssues": [
      "Housing shortages in urban areas due to returning soldiers",
      "Racial tensions as civil rights movements begin to stir",
      "Gender roles being redefined as women continue to work post-WWII"
    ],
    "internationalNews": [
      "Reports of war atrocities affecting public opinion",
      "Continued discussions on the formation of international organizations post-war"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'I'll Be Home for Christmas'",
        "Duke Ellington's jazz standards",
        "The Andrews Sisters' wartime hits"
      ],
      "films": [
        "'Meet Me in St. Louis'",
        "'The Song of Bernadette'",
        "'Going My Way'"
      ],
      "theater": [
        "Broadway performances of 'Oklahoma!'",
        "Local productions featuring wartime themes"
      ],
      "radio": [
        "'The Shadow'",
        "'Fibber McGee and Molly'",
        "'Jack Benny Program'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Little Prince' by Antoine de Saint-Exupéry",
        "'The Glass Menagerie' by Tennessee Williams",
        "'The Stranger' by Albert Camus"
      ],
      "popularGenres": [
        "war fiction",
        "mystery novels",
        "romantic dramas"
      ]
    },
    "technology": {
      "recentInventions": [
        "The first commercial microwave oven (though not widely available)",
        "Advancements in radio technology improving broadcasting quality",
        "Initial developments in jet propulsion"
      ],
      "commonDevices": [
        "manual typewriters",
        "early radio sets",
        "black-and-white television sets (still rare)"
      ],
      "emergingTrends": [
        "Increased use of rationing stamps in consumer goods",
        "Growth in the use of synthetic materials for clothing"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: three pence",
        "A newspaper: one penny"
      ],
      "commonActivities": [
        "Gathering at local pubs for community events",
        "Engaging in knitting circles for wartime charity",
        "Participating in local dances held in hotels"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "Saturday night cinema outings",
        "Seasonal holiday parties celebrating community resilience"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Increasingly egalitarian expectations among younger generations",
      "Continued class distinctions in urban settings"
    ],
    "gender": [
      "Women are celebrated for their contributions to the workforce",
      "Traditional gender roles are being challenged but still prevalent"
    ],
    "race": [
      "Greater awareness of racial injustices beginning to emerge",
      "Social attitudes are slowly shifting towards inclusivity"
    ],
    "generalNorms": [
      "Community resilience emphasized as a national value",
      "A sense of urgency and anxiety surrounding the war",
      "Expectations for decorum during social gatherings"
    ]
  },
  "atmosphericDetails": [
    "The salty, damp air clung to the skin, mingling with the faint aroma of smoke from coal fires burning in nearby homes.",
    "The muffled sounds of laughter and conversation filtered through the fog, punctuated by the distant crash of waves against the rocky shoreline.",
    "Streetlamps cast a hazy glow through the thick mist, creating an ethereal ambiance that cloaked the town in a veil of mystery."
  ],
  "paragraphs": [
    "In January 1944, the coastal town is enveloped in winter's chill, with fog obscuring the shoreline and rain occasionally drenching the streets. The atmosphere is tense, with whispers of the ongoing war pervading the community. Short days and long, dim evenings invite locals to seek refuge in the warmth of hotels, where dances and social gatherings offer a brief respite from the hardships of rationing and uncertainty. The fog, thick and oppressive, mirrors the weight of recent military events, leaving townsfolk anxious yet resilient, their spirits buoyed by camaraderie.",
    "Fashion reflects the era's duality, where utility meets emerging style. Men don double-breasted wool suits paired with polished leather shoes, while women embrace tea-length dresses with flared skirts, their outfits accentuated with pearls and tailored coats. The bold patterns of the time signal a departure from wartime drabness, allowing for self-expression amid the underlying tension. As couples twirl across the dance floor, the music of Bing Crosby and The Andrews Sisters fills the air, a soundtrack to both nostalgia and hope.",
    "Daily life is punctuated by the echoes of social rituals; families gather for Sunday dinners, while local pubs host community dances, fostering connections that transcend the hardships of war. Prices reflect the austerity of the times, with a loaf of bread costing four pence and a newspaper just a penny. Rationing has become a way of life, yet the spirit of resilience shines through as residents adapt, embracing knitting circles for charity and finding solace in shared experiences. Conversations often turn to the state of the war, but within the warmth of the hotel, the community weaves its own narrative of strength and unity."
  ],
  "note": "",
  "cost": 0.00108985635,
  "durationMs": 12903
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A grand seaside hotel hosts a diverse group of guests and staff, all drawn together by the tensions of post-war life and the impending inheritance of a wealthy patron, creating a pressure cooker of motives and secrets.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is reshaped by women stepping into roles traditionally held by men, while families navigate the complexities of returning soldiers and the societal push for community resilience."
  },
  "setting": {
    "location": "A grand seaside hotel on a cliffside",
    "institution": "hotel",
    "weather": "Foggy with occasional rain, typical of coastal climates, affecting visibility and outdoor movement."
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
    "value": "twenty minutes past ten",
    "description": "The precise time of high tide on the night of the murder."
  },
  {
    "id": "victim_last_seen",
    "value": "a quarter past ten",
    "description": "The time witnesses last saw the victim alive."
  },
  {
    "id": "footprint_count",
    "value": "three",
    "description": "The number of distinct footprints leading to the concealed area."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 16,
  "countsByPlacement": {
    "early": 4,
    "mid": 11,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 15,
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
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_7",
      "placement": "mid",
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
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "id": "clue_culprit_direct_captain_ivor_hale",
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
