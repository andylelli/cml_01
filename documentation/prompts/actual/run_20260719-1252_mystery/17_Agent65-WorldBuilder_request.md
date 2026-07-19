# Actual Prompt Record

- Run ID: `mystery-1784465540334`
- Project ID: ``
- Timestamp: `2026-07-19T12:56:43.506Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `f85e3049a2cbeaae`

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
    "title": "Tidal Deceit",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Quaint Seaside Hotel",
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
      "role_archetype": "Detective",
      "relationships": [
        "Dr. Mallory Finch (victim)",
        "Captain Ivor Hale (acquaintance)",
        "Beatrice Quill (friend)",
        "Sylvia Trent (acquaintance)",
        "Hugo Vane (acquaintance)"
      ],
      "public_persona": "A perceptive detective known for her analytical mind.",
      "private_secret": "Struggles with the weight of her own past cases.",
      "motive_seed": "Desire for justice.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel guest",
        "Access to all areas"
      ],
      "behavioral_tells": [
        "Intense focus",
        "Not easily distracted"
      ],
      "stakes": "Personal connection to the victim.",
      "evidence_sensitivity": [
        "High"
      ],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "Eleanor Voss (detective)",
        "Captain Ivor Hale (friend)",
        "Beatrice Quill (colleague)",
        "Sylvia Trent (acquaintance)",
        "Hugo Vane (rival)"
      ],
      "public_persona": "Respected physician and researcher.",
      "private_secret": "Conducting secret experiments on tide-related phenomena.",
      "motive_seed": "Hidden work on tidal research.",
      "motive_strength": "moderate",
      "alibi_window": "n/a",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Research reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Acquaintance",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (friend)",
        "Beatrice Quill (colleague)",
        "Sylvia Trent (acquaintance)",
        "Hugo Vane (rival)"
      ],
      "public_persona": "A retired naval officer with knowledge of maritime affairs.",
      "private_secret": "Has a history of rivalry with Hugo Vane.",
      "motive_seed": "Protecting reputation.",
      "motive_strength": "weak",
      "alibi_window": "8:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the beach"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Reputation at stake.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Friend",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (acquaintance)",
        "Sylvia Trent (colleague)",
        "Hugo Vane (acquaintance)"
      ],
      "public_persona": "An aspiring artist and friend of the victim.",
      "private_secret": "Had an unreciprocated crush on Dr. Finch.",
      "motive_seed": "Jealousy over attention received by Dr. Finch.",
      "motive_strength": "moderate",
      "alibi_window": "7:30 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the beach"
      ],
      "behavioral_tells": [
        "Nervous when discussing victim"
      ],
      "stakes": "Personal feelings involved.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Acquaintance",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (acquaintance)",
        "Captain Ivor Hale (acquaintance)",
        "Beatrice Quill (friend)",
        "Hugo Vane (rival)"
      ],
      "public_persona": "An influential socialite with a keen interest in local affairs.",
      "private_secret": "Had dealings with Hugo Vane that could harm reputation.",
      "motive_seed": "Protecting her social standing.",
      "motive_strength": "weak",
      "alibi_window": "8:15 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the beach"
      ],
      "behavioral_tells": [
        "Evasive about whereabouts"
      ],
      "stakes": "Social standing at risk.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Rival",
      "relationships": [
        "Eleanor Voss (acquaintance)",
        "Dr. Mallory Finch (rival)",
        "Captain Ivor Hale (acquaintance)",
        "Beatrice Quill (acquaintance)",
        "Sylvia Trent (acquaintance)"
      ],
      "public_persona": "A competitive scientist and rival of Dr. Finch.",
      "private_secret": "Attempting to discredit Dr. Finch's work.",
      "motive_seed": "Rivalry and jealousy over research.",
      "motive_strength": "strong",
      "alibi_window": "7:45 PM to 9:15 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the beach"
      ],
      "behavioral_tells": [
        "Overly eager to dismiss Finch's work"
      ],
      "stakes": "Career reputation.",
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
      "summary": "In a quaint seaside hotel, Dr. Mallory Finch is found drowned at high tide, but witness testimonies suggest she was inside during the party. Detective Eleanor Voss unravels a web of deceit shaped by the ocean's tides and the social tensions of the post-war era."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on inside, hotel, and witness to expose the false timing.",
      "delivery_path": [
        {
          "step": "The murderer altered the tide chart to mislead witnesses."
        }
      ]
    },
    "outcome": {
      "result": "The true timing of the victim's drowning contradicts alibis provided by the suspects."
    }
  },
  "false_assumption": {
    "statement": "The victim drowned during the party inside the hotel.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses claim to have seen Dr. Finch at the party, creating a false timeline.",
    "what_it_hides": "The tide rose earlier than reported, creating a narrow window for the murder."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Captain Hale was known to have a contentious relationship with Dr. Finch.",
      "Witnesses recall seeing him near the beach around the time of the incident."
    ],
    "the_one_flaw": "His alibi of being with guests at the hotel is confirmed by multiple witnesses.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A tide chart found in Dr. Finch's belongings seems to suggest she was aware of the rising tide.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The chart was part of her research, not a warning.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Witnesses recall hearing a loud argument between Dr. Finch and Hugo Vane shortly before her death.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The argument was about professional rivalry and not related to her death.",
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
    "rationale": "All suspects were present at the hotel during the party and had access to the beach."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "High tide schedule",
        "Witness statements"
      ],
      "windows": [
        "8:00 PM to 9:30 PM"
      ],
      "contradictions": [
        "Witnesses claim to have seen Dr. Finch inside the hotel during high tide."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Sylvia Trent",
        "Hugo Vane"
      ],
      "objects": [
        "Tide chart",
        "Beach access"
      ],
      "permissions": [
        "All guests had access to the beach."
      ]
    },
    "physical": {
      "laws": [
        "Tide rises predictably based on lunar cycles"
      ],
      "traces": [
        "Footprints leading to the beach"
      ]
    },
    "social": {
      "trust_channels": [
        "Social ties between guests",
        "Professional relationships"
      ],
      "authority_sources": [
        "Hotel management"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses state they heard rhythmic waves crashing at a specific time.",
        "correction": "This indicates that the tide was high earlier than the party's timeline suggests.",
        "effect": "Narrows the timeline of the incident, contradicting witness alibis.",
        "required_evidence": [
          "Witness statements about the waves",
          "Tide chart found in Dr. Finch's belongings"
        ],
        "reader_observable": true
      },
      {
        "observation": "A set of footprints leading to the beach was found, washed away by the tide.",
        "correction": "These footprints indicate someone accessed the beach before the party started.",
        "effect": "Eliminates the possibility that Dr. Finch was inside the hotel at the time of death.",
        "required_evidence": [
          "Footprints leading to the beach",
          "Timing of tide rise"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses confirm they saw Dr. Finch near the beach just before the party.",
        "correction": "This is inconsistent with her alleged presence inside the hotel.",
        "effect": "Narrows the suspect pool to those present near the beach.",
        "required_evidence": [
          "Witness statements about Dr. Finch's location",
          "Timeline of high tide"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Reenacting the timeline with a tide chart to prove the impossibility of the alibi provided.",
    "knowledge_revealed": "The actual tide timings contradict the witness statements.",
    "pass_condition": "If the reenactment shows that the tide would have risen before Dr. Finch could have drowned, the suspects' alibis will collapse.",
    "evidence_clues": [
      "clue_6",
      "clue_core_contradiction_chain",
      "clue_2"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements about the waves (early) and the tide chart (mid) allow the reader to see the contradiction in the timeline. Step 2: The footprints (mid) eliminate Dr. Finch's alibi. Step 3: Witnesses' confirmation of Dr. Finch near the beach (discriminating test) reveals the truth."
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
        "Observe the suspects' reactions"
      ],
      "test_type": "temporal"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi corroborated by hotel staff.",
        "supporting_clues": [
          "clue_3",
          "clue_4"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Social connections confirmed her whereabouts.",
        "supporting_clues": [
          "clue_5",
          "clue_6"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His argument with Dr. Finch was unrelated.",
        "supporting_clues": [
          "clue_7",
          "clue_8"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: n/a",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with prior evidence."
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
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
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Testimony from hotel staff"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Alibi confirmation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Social connections"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness confirmation of argument"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Argument details"
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
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a travel journalist with an adventurous spirit, but her charm masks a turbulent past and a desire to prove herself in a world that often overlooks her talents.",
    "publicPersona": "Charming and insightful writer known for her adventurous articles about travel.",
    "privateSecret": "Struggles with guilt over a love affair with a married man that complicates her social reputation.",
    "motiveSeed": "inheritance",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the hotel dining room during the incident.",
    "accessPlausibility": "easy",
    "stakes": "Wants to prove her worth as a serious journalist and solve the mystery.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with a measured tone, often punctuating her observations with a wry smile or a quip that hints at her underlying insecurities.",
    "signatureTic": "You know, it’s the little things that matter.",
    "internalConflict": "Eleanor grapples with her guilt over the affair, questioning whether her ambitions are worth the pain they cause to others.",
    "personalStakeInCase": "This crime matters to Eleanor as it offers her a chance to break free from her past and establish herself as a credible journalist.",
    "paragraphs": [
      "Eleanor Voss had always believed that adventure was just a pen stroke away. With her notepad tucked under her arm and a camera dangling from her neck, she navigated through the quaint seaside hotel like it was a foreign country. To the guests, she was a charming travel journalist, a woman who could spin tales of far-off lands and exotic cultures. But beneath that polished exterior lay a heart burdened by guilt and the weight of a scandalous affair that had left her reputation hanging by a thread.",
      "As she settled into the hotel dining room, Eleanor's keen eyes scanned the room, taking in the details of her fellow guests. She noticed the tension that hung in the air, the hushed whispers, and the furtive glances exchanged among the suspects. There was a mystery here, one that called to her like the siren song of the sea. She felt a thrill at the prospect of solving it, a chance to prove her worth beyond the confines of travel writing.",
      "Yet, as she delved deeper into the investigation, Eleanor found herself wrestling with her own demons. The guilt of her past affair loomed over her like a dark cloud, threatening to overshadow her every move. Could she really uncover the truth while her own life felt like a tangled web? Each clue she unearthed seemed to draw her closer to a revelation that could shatter her carefully curated image. She wondered if she was ready to face the consequences of her ambition, especially if it meant exposing her own flaws.",
      "Eleanor's determination to solve the mystery was fueled not only by her desire for professional validation but also by a need to reclaim her sense of self. She had always been the adventurous one, the one who took risks. Now, standing at the precipice of a scandal, she realized that perhaps the greatest adventure of all lay in confronting her own insecurities. With each step she took toward the truth, she felt the weight of her past lifting, if only just a little."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a compassionate physician whose dedication to her patients is threatened by financial pressures, leaving her vulnerable and desperate in the face of scandal.",
    "publicPersona": "Respected doctor known for her compassion and dedication to patients.",
    "privateSecret": "Fears losing her practice and status due to financial pressures from her failing clinic.",
    "motiveSeed": "Could gain a lucrative job opportunity if the victim's family scandal is exposed.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be treating patients in another wing of the hotel.",
    "accessPlausibility": "possible",
    "stakes": "Desperate to keep her clinic open and her reputation intact.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Her speech is precise and clinical, often punctuated by a slight tremor when discussing personal matters, revealing her underlying stress and fear.",
    "signatureTic": "It's all about priorities.",
    "internalConflict": "Mallory is torn between her professional integrity and the desperation of her financial situation, fearing that any scandal could ruin her.",
    "personalStakeInCase": "This crime matters to Mallory as it threatens not only her practice but her very identity as a doctor dedicated to her patients.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the edge of her professional life, peering into the abyss of financial ruin. In the world of medicine, where compassion was currency, she had always believed she could weather any storm. But as whispers of scandal enveloped the hotel, she felt her grip on her practice slipping away. The weight of her responsibilities pressed down on her shoulders like a leaden cloak, leaving her breathless and desperate.",
      "With her patients relying on her, Mallory had no choice but to maintain her facade of composure. She moved through the hotel with purpose, her white coat a stark contrast to the colorful chaos of the social scene around her. Yet, inside, she wrestled with a growing fear: what if the victim's family scandal became public? What if her clinic, already on shaky ground, crumbled under the weight of her association with the case?",
      "Mallory's alibi, claiming to be treating patients in another wing of the hotel, felt flimsy in the face of mounting suspicion. Each inquiry into her whereabouts made her heart race, the clinical precision of her speech faltering as she fought to maintain her credibility. She found herself questioning her motives—was she truly dedicated to her patients, or was survival driving her to consider the unthinkable? The financial pressures gnawed at her, twisting her integrity like a knife.",
      "As the investigation unfolded, Mallory realized that the stakes were higher than she had anticipated. The case was no longer just about the victim; it was a mirror reflecting her own fears and inadequacies. She needed to confront the truth, not only for her patients but for her own sense of self. In the darkest corners of her mind, she pondered whether the pursuit of survival might lead her to betray the very principles she had sworn to uphold."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer whose stern exterior hides a deeply rooted resentment toward the victim, complicating his role in the unfolding mystery.",
    "publicPersona": "A commanding presence with a strong sense of duty and honor.",
    "privateSecret": "Holds resentment towards the victim for undermining his position in the community.",
    "motiveSeed": "The victim threatened to expose his past misdeeds that could tarnish his reputation.",
    "motiveStrength": "compelling",
    "alibiWindow": "Reportedly on the deck watching the sea when the murder took place.",
    "accessPlausibility": "easy",
    "stakes": "Concerned about preserving his family's legacy and his tarnished honor.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks in a booming voice, often laced with sarcasm and punctuated by military jargon, reflecting his naval background.",
    "signatureTic": "Duty calls, but so does the past.",
    "internalConflict": "Ivor grapples with his outdated values and the realization that honor may not hold the same weight in the changing society around him.",
    "personalStakeInCase": "This crime matters to Ivor as it threatens not only his reputation but also the legacy he wishes to leave behind for his family.",
    "paragraphs": [
      "Captain Ivor Hale was a man of the sea, a man of honor—or so he believed. The retired naval officer wore his past like a badge of courage, his stern demeanor commanding respect and instilling fear. Yet, beneath that hardened exterior lay a simmering resentment toward the victim, a woman whose ambition had threatened to undermine his standing in the community. As the investigation unfolded, Ivor found himself at a crossroads, torn between duty and the ghosts of his past.",
      "On the night of the murder, Ivor claimed to be on the deck, gazing out at the tumultuous waves that mirrored the turmoil within him. The sea had always been his refuge, but now it felt like a prison, the salty air heavy with unspoken truths. He had long resented the victim for her threat to expose his past misdeeds—secrets that could tarnish the legacy he had fought so hard to build. With each inquiry, Ivor felt the walls closing in, the very honor he cherished slipping through his fingers.",
      "His speech, often laced with military jargon, betrayed a man grappling with his own obsolescence. 'Duty calls, but so does the past,' he would mutter, a sardonic edge creeping into his voice as he reflected on the shifting tides of society. Ivor's internal conflict was palpable; he was a relic of a bygone era, struggling to reconcile his values with the realities of a world that no longer revered them.",
      "As the investigation deepened, Ivor realized that the stakes extended beyond his reputation. It was about preserving his family's legacy, a legacy he believed was built on honor and integrity. But in a world where truth was malleable, he began to question whether his steadfast adherence to duty would lead him to redemption or ruin."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a glamorous socialite whose ambition drives her to seek wealth and status, but her insecurities about her own worth threaten to undermine her aspirations.",
    "publicPersona": "Young and glamorous, always seeking the spotlight and social prestige.",
    "privateSecret": "Desires to marry into wealth but feels overshadowed by the victim's status.",
    "motiveSeed": "Believed the victim was about to ruin her chances with a wealthy suitor.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be mingling with other guests in the lounge.",
    "accessPlausibility": "possible",
    "stakes": "Desires social elevation and fear of being left behind.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Her speech is bubbly and effusive, often punctuated by nervous laughter and quick interjections, revealing her underlying insecurities.",
    "signatureTic": "You know, darling, it’s all about timing.",
    "internalConflict": "Beatrice grapples with her ambition to rise socially while fearing that her insecurities may sabotage her efforts.",
    "personalStakeInCase": "This crime matters to Beatrice as it threatens her chances for social elevation and the life she desperately desires.",
    "paragraphs": [
      "Beatrice Quill floated through the hotel like a butterfly, her vibrant dress swirling around her as she sought the attention of the well-heeled guests. A young socialite with dreams of marrying into wealth, she was the embodiment of glamour and ambition. Yet, beneath the surface, Beatrice felt the sting of inadequacy, overshadowed by the victim's status and the looming threat of being left behind in the social race.",
      "In the lounge, she mingled with laughter and flirtation, her bubbly persona often punctuated by nervous giggles. 'You know, darling, it’s all about timing,' she would say, her voice laced with a self-deprecating edge that belied her confidence. Each interaction was a tightrope walk between charm and desperation, as she navigated the treacherous waters of social prestige while fearing that her ambitions would lead her to ruin.",
      "When the victim's presence threatened to derail her chances with a wealthy suitor, Beatrice felt the ground shift beneath her feet. Her alibi of mingling with guests felt flimsy, and as the investigation unfolded, she realized that her dreams of elevation were entangled in a web of suspicion. The fear of being overshadowed by the victim's scandal gnawed at her, fueling her insecurities and driving her to question her own worth.",
      "As the tension escalated, Beatrice found herself at a crossroads. Would she continue to chase the elusive dream of wealth and status, or would she confront the reality of her ambitions? The stakes were higher than she had anticipated, and as the investigation unfolded, she began to understand that true elevation might come from within, rather than from the fleeting approval of others."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a savvy hotel owner whose fierce ambition to save her business is complicated by the financial strain and the shadow of a recent scandal.",
    "publicPersona": "A savvy entrepreneur committed to her hotel and its reputation.",
    "privateSecret": "In deep financial trouble and desperate to save her business.",
    "motiveSeed": "Believed the victim was planning to withdraw funding that would cripple her hotel.",
    "motiveStrength": "weak",
    "alibiWindow": "Busy attending to guests and managing the hotel when the incident occurred.",
    "accessPlausibility": "possible",
    "stakes": "Fights to keep her hotel afloat amidst economic challenges.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks in a direct, no-nonsense manner, often using dry observations to deflect from her underlying anxiety about her business.",
    "signatureTic": "Business is business, after all.",
    "internalConflict": "Sylvia faces a moral dilemma between her ambition to save her hotel and the potential consequences of her actions on others.",
    "personalStakeInCase": "This crime matters to Sylvia as it threatens her livelihood and the future of her hotel, which she has poured her heart into.",
    "paragraphs": [
      "Sylvia Trent was a woman who understood the tides of business as well as the tides of the sea. As the owner of the quaint seaside hotel, she navigated her enterprise with the same determination she had once applied in her previous career as a corporate executive. But now, the weight of financial strain bore down on her like a storm cloud, threatening to wash away everything she had built. The recent scandal surrounding the victim only added to her anxiety, and she felt cornered, like a ship adrift in turbulent waters.",
      "With a direct and no-nonsense manner, Sylvia managed her hotel like a well-oiled machine, her speech often punctuated by dry observations that masked her growing unease. 'Business is business, after all,' she would say, her tone betraying a hint of irritation as she dealt with the demands of guests and the pressures of her dwindling resources. Each day felt like a battle, and as the investigation unfolded, she realized that the stakes were higher than she had anticipated.",
      "Sylvia's alibi of being busy attending to guests during the incident felt tenuous, and the victim's potential withdrawal of funding loomed over her like a guillotine. The fear of losing her hotel, her livelihood, gnawed at her insides, pushing her to consider actions she would have once deemed unthinkable. Would she sacrifice her integrity to save her business? The moral dilemma weighed heavily on her, forcing her to confront the consequences of her choices.",
      "As the investigation progressed, Sylvia found herself questioning not only her ambitions but the impact of her decisions on those around her. The hotel was more than a business; it was her heart and soul. In navigating the storm of suspicion and financial ruin, she realized that the true test of her character lay in how she faced the challenges ahead, both for her hotel and the people who depended on her."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is an eccentric artist whose recent emotional turmoil over unreciprocated feelings for the victim complicates his role in the investigation.",
    "publicPersona": "Eccentric artist known for his unorthodox views and provocative works.",
    "privateSecret": "Suffered a recent breakdown due to unreciprocated feelings for the victim.",
    "motiveSeed": "Felt deeply betrayed when the victim rejected his artistic collaboration proposal.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be sketching by the beach during the time of the murder.",
    "accessPlausibility": "unlikely",
    "stakes": "Desires to prove his worth as an artist and overcome his emotional turmoil.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks with a stream-of-consciousness style, often rambling and punctuated by abrupt shifts in tone, reflecting his chaotic thoughts.",
    "signatureTic": "Art is life, or is it the other way around?",
    "internalConflict": "Hugo struggles to transform his emotional pain into creative expression, fearing that his feelings for the victim may have led him astray.",
    "personalStakeInCase": "This crime matters to Hugo as it represents a chance to confront his feelings and prove himself as a serious artist.",
    "paragraphs": [
      "Hugo Vane was an artist in every sense of the word, and yet, he felt like a canvas splattered with chaos. His eccentricities were both his charm and his curse, a reflection of the tumultuous emotions that churned beneath the surface. Recently, he had suffered a breakdown, the result of unreciprocated feelings for the victim—a woman whose rejection had left him feeling vulnerable and exposed. As the investigation unfolded, Hugo found himself grappling with the very emotions that had once fueled his creativity.",
      "Claiming to have been sketching by the beach during the time of the murder, Hugo's alibi felt like a flimsy brushstroke on an unfinished canvas. His speech flowed in a stream-of-consciousness style, often punctuated by abrupt shifts in tone that revealed the chaos of his thoughts. 'Art is life, or is it the other way around?' he would muse, his blunt observations a façade for the turmoil that lay beneath. Each word felt like a brushstroke, but he struggled to create a coherent picture amid the swirling emotions.",
      "The victim's rejection of his artistic collaboration proposal had felt like a betrayal, and now, as the investigation deepened, Hugo found himself questioning the very foundation of his worth as an artist. Did his feelings for her cloud his judgment? As he confronted the fallout of his emotional turmoil, he realized that he needed to channel his pain into something productive rather than destructive. The stakes were high, and the possibility of being seen as a suspect weighed heavily on him.",
      "As the mystery unfolded, Hugo understood that this was not just about the crime; it was about confronting his own demons. Could he transform his emotional chaos into artistic expression? The investigation became a crucible, forcing him to face the truth of his feelings and the impact they had on his work and identity. In the end, it was a chance to prove himself—not just to others, but to the artist within."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Gulls' Perch",
    "type": "hotel",
    "place": "Whitstable",
    "country": "England",
    "summary": "A quaint seaside hotel frequented by vacationers and business travelers, offering a charming view of the turbulent ocean.",
    "visualDescription": "Victorian architecture with decorative gables, weathered wooden balconies overlooking the waves, and a weather-beaten sign creaking in the sea breeze.",
    "atmosphere": "Tension hangs in the air, thick with secrets and the sound of crashing waves.",
    "paragraphs": [
      "The Gulls' Perch stands resolute against the coastal winds, its Victorian facade a testament to a bygone era. The wooden balconies, peeling paint and all, overlook the tumultuous sea, where waves crash in a ceaseless rhythm. Inside, the narrow hallways twist like a labyrinth, echoing with whispers of guests and the distant crackle of a radio broadcasting news of the day. The atmosphere is thick with the scent of salt air and brewing coffee, punctuated by the occasional laughter of vacationers unaware of the brewing storm.",
      "Despite its quaint charm, the hotel carries an air of unease. The staff bustle about, their faces tense with the knowledge of secrets kept behind closed doors. The dimly lit common rooms are filled with mismatched furniture, each piece a witness to the lives that have passed through. The distant sound of thunder rumbles, mingling with the soft crackle of electricity from an early television set flickering in the corner. Outside, the ocean roars, a reminder of the isolation that comes with storms.",
      "As night descends, shadows lengthen, and the hotel transforms. The flickering candlelight casts eerie shapes on the walls, and the scent of dampness permeates the air. Guests retreat to their rooms, but the echoes of conversations linger, filled with hushed tones and nervous laughter. The rooftop terrace, accessible only to staff, remains silent, its view of the churning sea hidden from prying eyes. The tension is palpable, as if the hotel itself holds its breath, waiting for the storm to break."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with intermittent rain, typical of coastal climates",
    "timeFlow": "Days of growing tension, culminating in a stormy night",
    "mood": "tense and suspenseful, with an underlying sense of uncertainty",
    "eraMarkers": [
      "crackling radio broadcasts",
      "early television sets flickering",
      "military radar stations nearby",
      "wartime rationing of fuel",
      "increased presence of women in the workforce"
    ],
    "sensoryPalette": {
      "dominant": "salty breeze mixed with damp earth",
      "secondary": [
        "crackling fire in the hearth",
        "faint scent of brewing coffee"
      ]
    },
    "paragraphs": [
      "The atmosphere of The Gulls' Perch is steeped in the salty tang of the ocean, blending with the musty scent of age and neglect. Overhead, clouds hang heavy with the promise of rain, while the distant sound of thunder rumbles like an ominous portent. The hotel, once a refuge for the weary traveler, now feels more like a trap, with narrow hallways and dimly lit rooms creating a sense of claustrophobia. Each creak of the floorboards underfoot echoes with the weight of secrets best left unspoken.",
      "As evening approaches, the dim light of oil lamps flickers, casting long shadows across the well-worn carpets. The air is thick with the scent of damp wood and the faintest hint of mildew, a reminder of the storms that often lash the coast. Outside, the ocean churns, waves crashing violently against the rocks, their rhythm a constant backdrop to the unfolding drama within. In this quaint seaside hotel, every whisper, every glance, could hold the key to unraveling the mystery lurking just beneath the surface."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "Secluded rooftop with a weathered railing, overlooking a turbulent sea; scattered furniture covered in rain.",
      "sensoryDetails": {
        "sights": [
          "dark clouds swirling above",
          "waves crashing against rocks",
          "flickering lanterns casting shadows",
          "overturned chairs from the storm"
        ],
        "sounds": [
          "wind howling through the railings",
          "water splashing against stone",
          "distant thunder rumbling",
          "the creak of the terrace underfoot"
        ],
        "smells": [
          "salty sea air mixed with damp earth",
          "wet wood and rust",
          "faint scent of candle wax",
          "fresh rain on stone"
        ],
        "tactile": [
          "cold metal railing",
          "slick, wet tiles",
          "chill of the evening breeze",
          "rough texture of weathered wood"
        ]
      },
      "accessControl": "Restricted to staff during storms; guests may access during clear weather.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked tiles glistening",
            "grey light filtering through clouds",
            "mist rising from the sea",
            "drenched furniture scattered about"
          ],
          "sounds": [
            "steady patter of rain",
            "water pooling and trickling",
            "occasional clap of thunder",
            "the rustle of wind through leaves"
          ],
          "smells": [
            "freshly washed air",
            "damp grass and flowers",
            "decomposing seaweed nearby",
            "wet sand and salt"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey horizon blending into sea",
            "shadows creeping across the terrace",
            "distant gulls silhouetted against clouds",
            "drizzling rain blurring the view"
          ],
          "sounds": [
            "silence broken by seagulls' cries",
            "the soft thud of waves",
            "the whisper of wind",
            "the distant creaking of the hotel"
          ],
          "smells": [
            "brine and seaweed mingling",
            "wet stone and iron",
            "faint whiff of fish from the market",
            "cold, damp air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden light",
            "distant lights of boats on the water",
            "stars beginning to twinkle",
            "shadows lengthening across the terrace"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant laughter of guests",
            "the rustle of evening breezes",
            "the soft crackle of a lantern"
          ],
          "smells": [
            "freshly cut grass below",
            "woodsmoke from nearby homes",
            "the sweet scent of blooming night flowers",
            "cool, crisp air"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace, once a vibrant gathering place, now serves as the scene of a chilling crime. Rain-soaked and windswept, it offers a breathtaking view of the tumultuous sea, while its weathered furniture lies scattered, as if abandoned in haste. The air is thick with the scent of salt and dampness, mingling with the metallic tang of fear. Each gust of wind carries whispers of the past, echoing the secrets held within the hotel walls.",
        "As night falls, the terrace transforms into a place of shadows, the flickering lanterns casting eerie shapes against the stone. The roar of the ocean below drowns out the whispers of the guests, creating a sense of isolation that heightens the tension. Every creak of the wooden structure feels like a warning, urging the unwary to tread carefully, for danger lurks just beyond the flickering light."
      ]
    },
    {
      "id": "common_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Warmly decorated with plush armchairs and faded floral wallpaper, a large bay window overlooks the sea.",
      "sensoryDetails": {
        "sights": [
          "faded floral patterns on wallpaper",
          "glow of the fireplace",
          "dust motes dancing in sunlight",
          "antique books lining the shelves"
        ],
        "sounds": [
          "gentle crackle of the fire",
          "murmurs of conversation",
          "clinking of teacups",
          "soft rustle of newspaper pages"
        ],
        "smells": [
          "burning wood and smoke",
          "freshly brewed tea",
          "musty scent of old books",
          "subtle hint of lavender"
        ],
        "tactile": [
          "soft velvet upholstery",
          "warmth from the fire",
          "coolness of the window glass",
          "rough texture of aged book covers"
        ]
      },
      "accessControl": "Open to guests during the day, locked at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "rain streaking the window",
            "glossy surfaces reflecting light",
            "soft shadows in the corners"
          ],
          "sounds": [
            "steady rain tapping on glass",
            "fire crackling softly",
            "distant laughter from the kitchen",
            "the rustling of wet clothes"
          ],
          "smells": [
            "wet earth and foliage outside",
            "freshly baked bread",
            "strong aroma of coffee",
            "scent of damp wool"
          ],
          "mood": "cozy yet melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "the flicker of candlelight",
            "hints of color in the wallpaper",
            "the stillness of the furniture"
          ],
          "sounds": [
            "soft murmurs of conversation",
            "the ticking of an old clock",
            "the crackle of a fire",
            "the rustle of newspapers"
          ],
          "smells": [
            "scent of aged wood",
            "the aroma of herbal tea",
            "dust mingling with lavender",
            "the faint scent of tobacco"
          ],
          "mood": "quiet tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of lamps illuminating the room",
            "the last light of sunset",
            "reflections in the polished furniture",
            "the shadows of guests mingling"
          ],
          "sounds": [
            "laughter and chatter of guests",
            "the clinking of glasses",
            "the crackle of the fire",
            "the distant sound of waves"
          ],
          "smells": [
            "rich aroma of dinner cooking",
            "freshly polished wood",
            "the scent of flowers from the garden",
            "warmth of spiced cider"
          ],
          "mood": "inviting yet foreboding"
        }
      ],
      "paragraphs": [
        "The Drawing Room exudes an inviting warmth, with its plush armchairs and the soft glow of the fireplace. Guests gather here, sharing stories and laughter, the air thick with the aroma of freshly brewed tea and the faint scent of lavender from the garden. The large bay window offers a stunning view of the tumultuous sea, while the antique books lining the shelves seem to watch over the conversations like silent sentinels. Yet, beneath the cozy surface, a tension simmers, as whispers of secrets hang in the air.",
        "As evening descends, the atmosphere shifts. The flickering flames cast dancing shadows, creating an air of intimacy tinged with uncertainty. Conversations grow quieter, and the distant sound of the ocean lapping at the shore becomes a haunting backdrop. The Drawing Room, once a haven of comfort, transforms into a space where every glance, every hushed tone, feels charged with unspoken truths, and the sense that something is about to change hangs palpably in the air."
      ]
    },
    {
      "id": "kitchen",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Staff-only area",
      "visualDetails": "Functional space with industrial appliances, a large wooden table, and shelves filled with jars and ingredients.",
      "sensoryDetails": {
        "sights": [
          "gleaming pots and pans hanging",
          "flour-dusted countertops",
          "faded wooden shelves lined with jars",
          "steam rising from boiling pots"
        ],
        "sounds": [
          "clattering of utensils",
          "the hum of the refrigerator",
          "water boiling on the stove",
          "the crackling of frying food"
        ],
        "smells": [
          "rich aroma of simmering stew",
          "freshly baked pastries",
          "sharp scent of herbs and spices",
          "burnt toast lingering in the air"
        ],
        "tactile": [
          "smoothness of polished wood",
          "heat radiating from the stove",
          "coolness of metal utensils",
          "rough texture of flour bags"
        ]
      },
      "accessControl": "Restricted to kitchen staff during all hours; guests prohibited.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dampness on window panes",
            "clouds obscuring sunlight",
            "baking trays lined with pastries",
            "fresh herbs soaking in water"
          ],
          "sounds": [
            "soft patter of rain outside",
            "the bubbling of stew on the stove",
            "the rustle of aprons and clothing",
            "the clinking of dishes"
          ],
          "smells": [
            "rich scent of coffee brewing",
            "freshly baked bread",
            "scent of herbs mingling",
            "sharpness of citrus peels"
          ],
          "mood": "busy yet comforting"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through windows",
            "steam rising from pots",
            "the bustle of staff preparing meals",
            "jars lined neatly on shelves"
          ],
          "sounds": [
            "the rhythmic chopping of vegetables",
            "the sizzle of food on the stove",
            "the murmur of staff conversations",
            "the clattering of dishes being washed"
          ],
          "smells": [
            "aroma of herbs and spices",
            "the scent of roasting meat",
            "freshly made sauces",
            "the lingering smell of cleaning supplies"
          ],
          "mood": "hectic yet organized"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of the kitchen lights",
            "the last of the day's dishes stacked",
            "the reflection of staff moving about",
            "the warmth of the oven glowing"
          ],
          "sounds": [
            "the hum of the refrigerator",
            "the soft chatter of staff winding down",
            "the crackle of the last fire embers"
          ],
          "smells": [
            "scent of freshly baked cookies",
            "rich aroma of dinner leftovers",
            "the sweetness of dessert preparations",
            "the faint smell of cleaning products"
          ],
          "mood": "satisfied exhaustion"
        }
      ],
      "paragraphs": [
        "The Kitchen is a bustling hub of activity, filled with the aromas of rich stews and freshly baked pastries. Gleaming pots and pans hang from the ceiling, while the large wooden table in the center is laden with ingredients waiting to be transformed into meals. Staff move efficiently about the space, their chatter blending with the sounds of boiling water and sizzling food. The atmosphere is warm and inviting, a stark contrast to the tension brewing just outside the door.",
        "As evening approaches, the Kitchen begins to quiet, the staff wrapping up their tasks for the day. The air is thick with the lingering scents of dinner, and the soft glow of kitchen lights casts a warm hue across the room. Yet, even in this sanctuary of comfort, an undercurrent of anxiety lingers, as the staff can feel the weight of unspoken secrets creeping closer, ready to spill into their world."
      ]
    },
    {
      "id": "secluded_beach",
      "name": "The Secluded Beach",
      "type": "exterior",
      "purpose": "Crime scene and hidden meeting place",
      "visualDetails": "Secluded stretch of sand, bordered by rocky cliffs; waves crashing softly against the shore.",
      "sensoryDetails": {
        "sights": [
          "rocky cliffs towering above",
          "waves lapping at the shore",
          "driftwood scattered along the sand",
          "seagulls circling overhead"
        ],
        "sounds": [
          "gentle crashing of waves",
          "distant calls of seagulls",
          "the whisper of the wind",
          "the crunch of sand underfoot"
        ],
        "smells": [
          "fresh sea air mixed with salt",
          "the scent of damp sand",
          "the faint aroma of seaweed",
          "the earthy smell of wet rocks"
        ],
        "tactile": [
          "rough texture of sand",
          "coolness of the sea breeze",
          "smoothness of pebbles underfoot",
          "wetness of splashing waves"
        ]
      },
      "accessControl": "Accessible only through a narrow path; often overlooked by hotel guests.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "waves crashing more violently",
            "puddles forming in the sand",
            "driftwood glistening with moisture"
          ],
          "sounds": [
            "steady rain hitting the ground",
            "the roar of the ocean",
            "the wind howling through the cliffs",
            "the distant rumble of thunder"
          ],
          "smells": [
            "pungent scent of wet seaweed",
            "freshness of rain on sand",
            "the sharp tang of salt",
            "the earthy aroma of damp stones"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark sea blending with the sky",
            "distant storm clouds gathering",
            "waves crashing with increasing force",
            "the shoreline empty of footprints"
          ],
          "sounds": [
            "the low rumble of distant thunder",
            "waves crashing relentlessly",
            "the wind whipping through the cliffs",
            "the eerie silence of the beach"
          ],
          "smells": [
            "sharp brine of the ocean",
            "the scent of wet sand",
            "the musty smell of decaying seaweed",
            "the dampness of rocks"
          ],
          "mood": "tense and anxious"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the vibrant colors of sunset",
            "the last light reflecting off the waves",
            "silhouettes of cliffs against the sky",
            "the beach bathed in golden light"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant call of seabirds",
            "the soft rustle of grasses",
            "the peaceful hush of the evening"
          ],
          "smells": [
            "freshly caught fish from nearby boats",
            "the scent of salt in the air",
            "the sweetness of blooming flowers",
            "the coolness of evening dew"
          ],
          "mood": "calm yet suspicious"
        }
      ],
      "paragraphs": [
        "The Secluded Beach is a hidden gem, accessible only through a narrow path that winds through the cliffs. The soft sound of waves lapping against the shore creates a serene atmosphere, yet the isolation feels palpable. Rocky cliffs tower above, casting long shadows over the sand, while driftwood and shells tell tales of the tides. Here, secrets can be exchanged away from prying eyes, making it a perfect spot for clandestine meetings.",
        "As twilight descends, the beach transforms. The vibrant hues of sunset paint the sky, yet the tranquility belies the tension that simmers beneath the surface. The distant sound of waves crashing against the rocks echoes the unease that lingers, and the scent of salt air fills the lungs, mixing with the sweet aroma of nearby blooms. In this secluded spot, the calmness is but a veneer, hiding the secrets that the ocean holds close."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028531007999999997,
  "durationMs": 31126
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "December",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "December",
    "weather": [
      "overcast with intermittent rain",
      "chilly winds from the coast",
      "damp streets reflecting the grey skies"
    ],
    "daylight": "Short days with daylight fading by four o'clock in the afternoon, leaving a chill in the air as twilight descends quickly.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, where shadows deepen and the sound of rain taps against hotel windows.",
    "holidays": [
      "Christmas",
      "New Year's Eve"
    ],
    "seasonalActivities": [
      "visiting holiday markets",
      "attending local church services",
      "gathering for festive dinners with family and friends"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits",
        "tailored overcoats",
        "fedora hats"
      ],
      "casual": [
        "tweed jackets",
        "corduroy trousers",
        "cashmere sweaters"
      ],
      "accessories": [
        "silk ties",
        "leather gloves",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with cinched waists",
        "satin evening gowns",
        "faux fur stoles"
      ],
      "casual": [
        "tweed skirts",
        "knitted cardigans",
        "swing jackets"
      ],
      "accessories": [
        "cloche hats",
        "string pearls",
        "ankle boots"
      ]
    },
    "trendsOfTheMoment": [
      "bold colors in evening wear",
      "patterned fabrics featuring florals",
      "the rise of utilitarian fashion influenced by wartime needs"
    ],
    "socialExpectations": [
      "men are expected to be the primary breadwinners",
      "women are increasingly taking on roles in the workforce",
      "traditional family structures are under scrutiny"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the Blitz continues to affect British cities",
      "U.S. involvement in WWII is escalating",
      "news of the Atlantic Charter's signing spreads"
    ],
    "politicalClimate": "Tensions remain high in Europe as the war rages on, with Britain standing firm against Germany's advances.",
    "economicConditions": "Rationing continues to affect daily life, impacting food availability and prices.",
    "socialIssues": [
      "the role of women in the workforce is changing",
      "increasing anxieties about espionage and security at home",
      "discussions surrounding peace and war efforts dominate public discourse"
    ],
    "internationalNews": [
      "reports of German U-boats targeting Allied shipping",
      "updates on military strategies in North Africa",
      "the impact of the war on colonial territories"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "The Andrews Sisters' 'Boogie Woogie Bugle Boy'",
        "Glenn Miller's big band hits"
      ],
      "films": [
        "'Rebecca'",
        "'The Great Dictator'",
        "'His Girl Friday'"
      ],
      "theater": [
        "'The Glass Menagerie'",
        "'The Corn Is Green'",
        "'The Royal Family'"
      ],
      "radio": [
        "The Shadow",
        "Suspense",
        "Amos 'n' Andy"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Maltese Falcon' by Dashiell Hammett",
        "'For Whom the Bell Tolls' by Ernest Hemingway",
        "'The Grapes of Wrath' by John Steinbeck"
      ],
      "popularGenres": [
        "mystery",
        "war fiction",
        "social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first practical radar systems",
        "improvements in military communication technology",
        "early developments in television"
      ],
      "commonDevices": [
        "radio sets in most homes",
        "manual typewriters",
        "film cameras"
      ],
      "emergingTrends": [
        "increased interest in home entertainment",
        "the rise of war-related technological advancements",
        "a shift towards more accessible public broadcasting"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pound of sugar: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "listening to radio broadcasts",
        "participating in community air raid drills",
        "writing letters to soldiers overseas"
      ],
      "socialRituals": [
        "gathering for evening tea",
        "attending church services on Sundays",
        "celebrating Christmas with family gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing scrutiny of class distinctions due to wartime collaboration",
      "greater acceptance of working-class contributions to the war effort"
    ],
    "gender": [
      "women's roles are evolving, leading to a push for more rights",
      "traditional gender expectations are being challenged but remain prevalent",
      "increased visibility of women in professional roles"
    ],
    "race": [
      "racial tensions persist, but there are emerging dialogues about equality and civil rights",
      "the war fosters a sense of unity among diverse groups against a common enemy"
    ],
    "generalNorms": [
      "patriotism is a dominant sentiment",
      "support for the troops is widespread",
      "a sense of uncertainty about the future pervades daily life"
    ]
  },
  "atmosphericDetails": [
    "The sound of rain pattering against window panes, creating a rhythmic backdrop to the tension in the air.",
    "The smell of wet pavement mingling with the scent of roasted chestnuts from nearby vendors, evoking the holiday spirit amidst the gloom.",
    "The flickering glow of street lamps illuminating the damp streets, casting elongated shadows that seem to dance as figures hurry by."
  ],
  "paragraphs": [
    "On a chill December evening in 1940, the coastal town's hotel stood as a beacon against the darkening sky, its windows aglow with warm light. The rain fell intermittently, creating an atmosphere thick with tension as guests gathered within. Outside, the streets glistened, reflecting the overcast skies, while the sounds of holiday laughter drifted through the doors, mingling with the distant echoes of wartime news broadcasted over the radio. Each drop of rain seemed to heighten the suspense, as whispers of uncertainty surrounded the gathering of souls seeking refuge from the world beyond.",
    "Fashion reflected the era's dual nature of elegance and practicality. Men donned sharp, double-breasted wool suits complemented by tailored overcoats, while women embraced the festive season with tea-length dresses cinched at the waist and adorned with faux fur stoles. Cloche hats perched atop neatly coiffed hairdos, serving both style and warmth. The vibrant colors and patterned fabrics used in evening wear added a touch of brightness to the otherwise muted winter palette, offering a momentary escape from the harsh realities of life during wartime.",
    "In this time of uncertainty, daily life unfolded with a mix of routine and adaptation. The cost of living was dictated by rationing, with a loaf of bread fetching four pence and sugar sold at one shilling a pound. Families gathered for evening tea, sharing stories and letters from loved ones stationed abroad, while church services provided comfort and community. The festive spirit of Christmas approached, but the threat of the war loomed large in the minds of many, creating a blend of hope and anxiety as the new year beckoned with the promise of change."
  ],
  "note": "",
  "cost": 0.0010743446999999999,
  "durationMs": 13132
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense gathering at a seaside hotel, where the pressures of post-war society and the shifting tides of loyalty and suspicion converge around a mysterious drowning.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Class tensions rise as women enter the workforce and societal norms shift in the wake of WWII, creating a backdrop of uncertainty and competition among guests and staff."
  },
  "setting": {
    "location": "A quaint seaside hotel with Victorian architecture overlooking the ocean.",
    "institution": "hotel",
    "weather": "overcast with intermittent rain, typical of coastal climates"
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
    "value": "ten minutes past eight",
    "description": "the exact time of the high tide that negated the victim's chance of escape"
  },
  {
    "id": "party_time",
    "value": "half past eight",
    "description": "the claimed time when the victim was last seen alive"
  },
  {
    "id": "footprint_distance",
    "value": "twenty feet",
    "description": "the distance from the hotel to where the victim was found"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 15,
  "countsByPlacement": {
    "early": 5,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 14,
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
      "category": "physical"
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
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_5",
      "placement": "early",
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
      "category": "elimination"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
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
      "id": "clue_fp_contradiction_step_2",
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
