# Actual Prompt Record

- Run ID: `mystery-1784254332872`
- Project ID: ``
- Timestamp: `2026-07-17T02:16:15.655Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `b711745305365169`

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
    "title": "Masquerade of Authority",
    "author": "Your Name",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Mid-century seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "impersonation"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp-minded investigator known for her keen intuition.",
      "private_secret": "Has a hidden past as a con artist.",
      "motive_seed": "Desire for justice",
      "motive_strength": "strong",
      "alibi_window": "10 minutes",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel staff access",
        "Public areas"
      ],
      "behavioral_tells": [
        "Keen observer",
        "Tends to ask pointed questions"
      ],
      "stakes": "Solving the case to redeem her past.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "35-45",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Respected physician at the hotel.",
      "private_secret": "Involved in a questionable medical practice.",
      "motive_seed": "Fear of exposure",
      "motive_strength": "moderate",
      "alibi_window": "1 hour",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Medical supplies access",
        "Patient rooms"
      ],
      "behavioral_tells": [
        "Nervous around authority",
        "Defensive"
      ],
      "stakes": "Professional reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Charming naval officer.",
      "private_secret": "Involved in smuggling operations.",
      "motive_seed": "Desire to maintain his lifestyle",
      "motive_strength": "moderate",
      "alibi_window": "30 minutes",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to shipping manifest",
        "Port connections"
      ],
      "behavioral_tells": [
        "Overly confident",
        "Evasive when questioned"
      ],
      "stakes": "Freedom from legal scrutiny.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Socialite and friend of the victim.",
      "private_secret": "Had a romantic interest in the victim.",
      "motive_seed": "Jealousy",
      "motive_strength": "weak",
      "alibi_window": "45 minutes",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Social events",
        "Public areas"
      ],
      "behavioral_tells": [
        "Flirtatious",
        "Quick to anger"
      ],
      "stakes": "Emotional fallout from her relationship.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Hotel manager.",
      "private_secret": "Hiding debts from her past.",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "1 hour",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel records",
        "Staff access"
      ],
      "behavioral_tells": [
        "Stressed",
        "Avoids eye contact"
      ],
      "stakes": "Keeping the hotel operational.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Wealthy businessman.",
      "private_secret": "Involved in illegal dealings.",
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
      "Sylvia Trent"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a masquerade ball at a mid-century seaside hotel, Hugo Vane is found strangled in his room, which leads Eleanor Voss into a web of deception and mistaken identities. The masquerade allows for an intricate manipulation of authority as guests assume false roles, leading to a complex investigation where the truth unravels through clever deductions."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "Sylvia impersonated Hugo using a disguise and staged alibi involving the hotel staff, tricking witnesses into believing she was elsewhere.",
      "delivery_path": [
        {
          "step": "Eleanor discovers a coat in Hugo's room with unique fabric that matches Sylvia's dress."
        },
        {
          "step": "Witnesses recall seeing someone resembling Hugo at the hotel bar during the murder."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor deduces that Sylvia used her authority as hotel manager to manipulate the timeline and witness statements."
    }
  },
  "false_assumption": {
    "statement": "Sylvia Trent was at the hotel bar during the time of the murder.",
    "type": "authority",
    "why_it_seems_reasonable": "Sylvia's position as manager grants her credibility and authority, making witnesses trust her alibi.",
    "what_it_hides": "The truth that she was actually in Hugo's room disguised as him."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch had access to Hugo's room as his physician.",
      "Witnesses claimed to have seen her near the murder scene shortly before the body was found."
    ],
    "the_one_flaw": "Dr. Finch was in the hotel lobby attending to another guest during the time of the murder, as confirmed by multiple witnesses.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A note found in Hugo's pocket suggesting medical distress.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The note was written as a precaution and never acted upon.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A broken window in the victim's room.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The window was broken during the storm the night before.",
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
    "rationale": "All suspects are guests or staff at the hotel, eliminating the possibility of an outsider."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Masquerade ball start time",
        "Time of discovery of Hugo's body"
      ],
      "windows": [
        "8 PM to 9:30 PM"
      ],
      "contradictions": [
        "Witnesses claim Sylvia was at the bar at 9 PM, but the murder occurred at 9:15 PM"
      ]
    },
    "access": {
      "actors": [
        "Sylvia Trent",
        "Dr. Mallory Finch"
      ],
      "objects": [
        "Hugo's room",
        "Hotel records"
      ],
      "permissions": [
        "Staff access to guest rooms"
      ]
    },
    "physical": {
      "laws": [
        "Sound travels faster than the human brain can process"
      ],
      "traces": [
        "Fabric from Sylvia's dress found in Hugo's room"
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff trust in Sylvia's authority"
      ],
      "authority_sources": [
        "Sylvia's position as hotel manager"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "A coat found in Hugo's room has unique fabric matching Sylvia's dress.",
        "correction": "Sylvia was present in Hugo's room, indicating potential involvement.",
        "effect": "Narrows suspects to include Sylvia only.",
        "required_evidence": [
          "Coat found in Hugo's room",
          "Witness statements about the masquerade"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall seeing someone resembling Hugo at the hotel bar during the murder.",
        "correction": "The person identified is likely Sylvia in disguise.",
        "effect": "Eliminates the possibility of anyone else being at the bar.",
        "required_evidence": [
          "Witness statements about bar attendance",
          "Time of murder established at 9:15 PM"
        ],
        "reader_observable": true
      },
      {
        "observation": "The time of the murder overlaps with the masquerade schedule.",
        "correction": "The timeline indicates Sylvia had opportunity to create a false alibi.",
        "effect": "Tightens the timeline constraints around Sylvia's alibi.",
        "required_evidence": [
          "Masquerade ball schedule",
          "Witness accounts of the timeline"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares masquerade, unique, and fabric against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are witnes, statement, and unique.",
    "pass_condition": "If Sylvia can be proven to have created the false identity through her authority, she is guilty.",
    "evidence_clues": [
      "clue_1",
      "clue_3",
      "clue_6",
      "clue_culprit_direct_sylvia_trent"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The unique coat in Hugo's room (early) and witness statements (mid) indicate Sylvia's presence. Step 2: Witnesses seeing Sylvia at the bar (mid) conflicts with the murder timeline. Step 3: The masquerade schedule (discriminating test) proves her timeline manipulation."
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
        "clearance_method": "Alibi confirmed by multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Broken window confirmed to be from the storm.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm her whereabouts during the murder.",
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
        "clue_id": "clue_5",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_sylvia_trent",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_discriminating_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Reenactment observation"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_elimination_beatrice_quill",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Masquerade schedule"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a travel writer with a penchant for adventure, navigating the complexities of unrequited love and a murder mystery at a seaside hotel.",
    "publicPersona": "Charming, adventurous, and well-traveled, Eleanor is well-regarded in literary circles.",
    "privateSecret": "Struggles with unrequited love for Captain Hale, leading her to push for his affections despite his ties to Beatrice.",
    "motiveSeed": "Curiosity piqued after the murder occurs in the hotel she is staying at.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the hotel library at the time of the murder.",
    "accessPlausibility": "easy",
    "stakes": "Uncovering the truth as it could validate her career and personal aspirations.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a lilting cadence, often weaving literary references into her conversations. She has a tendency to punctuate her thoughts with a slight chuckle, which betrays her inner complexity.",
    "signatureTic": "‘Have you ever noticed how the past always seems to linger?’",
    "internalConflict": "Eleanor is torn between her desire for Ivor and her ambition to prove herself as a capable investigator, fearing that her feelings may cloud her judgment.",
    "personalStakeInCase": "This crime holds particular significance for her as it intersects with her personal feelings for Ivor and her professional aspirations in uncovering the truth.",
    "paragraphs": [
      "Eleanor Voss stood at the edge of the hotel library, her fingers trailing along the spines of dusty tomes. A travel writer by trade, she had often found solace in the written word, yet today, the words felt heavy with unspoken truths. The murder that had shattered the tranquility of the seaside hotel was a grim reminder that her life was not merely a series of enchanting escapades. It was real, raw, and painfully entangled with her feelings for Captain Ivor Hale, a man whose charm had captivated her heart yet remained forever out of reach.",
      "As she delved deeper into the investigation, Eleanor's curiosity morphed into a consuming fire. The thrill of piecing together the puzzle of Hugo Vane's death was intoxicating, yet each revelation about the victim and the suspects only reminded her of her own vulnerabilities. Ivor's ties to Beatrice Quill, the waitress whose innocence masked a simmering jealousy, gnawed at Eleanor. Did Ivor return her affections, or was he merely a pawn in a game she had yet to comprehend?",
      "Her alibi, being in the library at the time of the murder, offered her a convenient shield, yet Eleanor knew that appearances could be deceiving. She had access to all corners of the hotel, a privilege that could easily be misconstrued. Every guest, every staff member, became a potential suspect, and as she navigated the intricate web of their lives, Eleanor grappled with her own feelings. Could she truly be objective in her investigation, or was she simply chasing shadows of her heart's desire?",
      "In the shadows of her mind, the weight of her unrequited love for Ivor loomed large, creating a tempest of emotions that threatened to drown her rationality. As she pieced together the fragments of the mystery, Eleanor realized that uncovering the truth was not just about justice for Hugo; it was about her own validation as a writer and a woman in a world that often dismissed her passions. Would she emerge from this dark masquerade unscathed, or would the very truths she sought unravel her heart?",
      "With each passing day, Eleanor's resolve strengthened. She would confront her feelings for Ivor, but not before shining a light on the murky waters of deceit that surrounded them all. In the pursuit of truth, perhaps she would discover not only the murderer but also the courage to embrace her own desires. After all, the past may linger, but Eleanor was determined to carve out a future that was distinctly her own."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected psychiatrist with a hidden affair that complicates her involvement in a murder investigation.",
    "publicPersona": "Intelligent, composed, and a pioneer in her field, she commands respect.",
    "privateSecret": "Engaged in a secret affair with the victim, Eleanor's best friend, leading to potential complications.",
    "motiveSeed": "Fears her professional reputation will be ruined if the details of her affair are revealed.",
    "motiveStrength": "strong",
    "alibiWindow": "In a session with a patient during the time of the murder.",
    "accessPlausibility": "possible",
    "stakes": "Losing her job and professional credibility if her affair becomes public.",
    "humourStyle": "deadpan",
    "humourLevel": 0.2,
    "speechMannerisms": "Mallory speaks in a calm, measured tone, often punctuated by clinical terminology. She rarely allows emotion to seep into her words, maintaining an air of professionalism even in casual conversations.",
    "signatureTic": "‘In my professional experience, one must consider the underlying motivations.’",
    "internalConflict": "Mallory faces a profound moral dilemma, torn between her love for Eleanor's friend and the fear of losing everything she has worked for professionally.",
    "personalStakeInCase": "The murder investigation threatens to expose her affair, risking her career and her relationship with Eleanor, a close friend who deserves the truth.",
    "paragraphs": [
      "Dr. Mallory Finch sat in her office, the soft ticking of the clock echoing the anxious beat of her heart. A psychiatrist renowned for her composure, she was the epitome of professionalism, yet today, she felt more like a marionette tangled in strings of her own making. The murder of Hugo Vane, whose life was intertwined with hers through a web of secrets, had left her reeling. It was not merely the loss of a friend that haunted her; it was the specter of her hidden affair with the victim that threatened to unravel her carefully constructed life.",
      "As the investigation unfolded, Mallory found herself at a crossroads. The details of her relationship with Hugo were a ticking time bomb, one that could obliterate her reputation and the trust of those around her. In her clinical mind, she weighed the risks: the potential exposure of their affair versus the silence that could protect her. Yet, with every question posed by the detective, Eleanor, a pang of guilt pierced through her veneer of calm. How could she stand by while her friend, unaware of the truth, sought answers that could shatter them both?",
      "Her alibi, a patient session during the time of the murder, was a thin veil for her guilt. Could she truly convince herself that she was innocent? The irony of her situation was not lost on her; a psychiatrist, trained to dissect the complexities of the human mind, now found herself ensnared in her own emotional labyrinth. She had always prided herself on her ability to understand others, yet now she grappled with her own heart's desires, torn between love and loyalty.",
      "As the days passed, the weight of her secret grew heavier. Mallory could feel the eyes of the hotel guests upon her, each glance a reminder of the precariousness of her position. She had built a life on the foundation of respect and credibility, yet one misstep could send it all crumbling down. The stakes were higher than she had ever anticipated, and as the investigation progressed, she realized that truth had a way of surfacing, no matter how deeply it was buried.",
      "In the midst of this turmoil, Mallory knew she had to make a choice. Would she continue to hide behind the façade of her professional life, or would she confront the consequences of her actions? The path ahead was fraught with uncertainty, but one thing was clear: the masquerade of authority she had worn for so long was about to be challenged, and the truth would either set her free or ensnare her forever."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, finds himself embroiled in a murder investigation that threatens to expose his secrets and tarnish his reputation.",
    "publicPersona": "Gallant and charismatic, he has a reputation for bravery and honor.",
    "privateSecret": "Had a dispute with the victim over financial matters that he is unwilling to share.",
    "motiveSeed": "Could face social ruin if the public learns of the victim's threat to expose his involvement in a shady financial venture.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to be in the hotel bar speaking with guests during the murder.",
    "accessPlausibility": "possible",
    "stakes": "His honor and reputation are at stake if his dealings are revealed.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a commanding presence, often using grandiose language peppered with nautical metaphors. His voice carries a hint of bravado, masking deeper insecurities.",
    "signatureTic": "‘In my experience, the sea has a way of revealing the truth, whether we like it or not.’",
    "internalConflict": "Ivor is caught between his desire to protect his reputation and the guilt of his past actions, questioning whether he should seek redemption or maintain his façade.",
    "personalStakeInCase": "The murder investigation could expose his financial misdeeds, jeopardizing not only his reputation but also his relationship with Eleanor, whom he secretly admires.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, a glass of whiskey in hand, the amber liquid swirling like the turbulent waters of his past. A man revered for his gallantry, Ivor wore his charm like armor, yet beneath the surface lay a tempest of secrets. The murder of Hugo Vane, a man whose life had brushed against his own in ways that could spell disaster, had thrust Ivor into a perilous game of survival. With every passing moment, the threat of exposure loomed large, casting a dark shadow over his reputation.",
      "The dispute with Hugo over financial matters echoed in his mind, a bitter reminder of the choices he had made. The stakes were high; if the details of their dealings were revealed, Ivor would face not just social ruin but the scorn of those he had fought to protect. His alibi, a simple claim of being in the hotel bar, felt flimsy against the weight of his guilt. What if someone had seen him? What if someone had heard their argument? The ghosts of his past threatened to resurface, and Ivor was desperate to keep them buried.",
      "As he cast a glance around the bar, Ivor's thoughts drifted to Eleanor Voss, the enchanting travel writer who had captured his heart. Her determination to investigate the murder stirred something within him, an urge to protect her from the darkness that surrounded him. Yet, how could he shield her from the truth without revealing his own? The irony gnawed at him; here he was, a man known for his bravery, yet paralyzed by the fear of being unmasked. The very qualities that had earned him respect were now the chains that bound him.",
      "In the midst of this turmoil, Ivor found himself at a crossroads. Would he continue to hide behind the façade of honor, or would he confront the consequences of his actions? The sea had taught him many lessons about truth and deception, and now it was time to navigate the treacherous waters of his own life. As he pondered his next move, Ivor realized that the masquerade he had worn for so long was about to be challenged. The question remained: would he rise above the depths of his past, or would he be dragged down by the very secrets he sought to conceal?",
      "With determination coursing through him, Ivor vowed to face the truth, not only for his sake but for Eleanor's as well. The storm was brewing, and he would need every ounce of courage to weather it. In the end, perhaps the greatest battle he would face was not against the shadows of his past, but against the man he had become. The masquerade of authority was about to unravel, and Ivor was ready to embrace whatever truth awaited him."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a naive waitress, becomes embroiled in a murder investigation fueled by jealousy and unrequited love for Captain Ivor Hale.",
    "publicPersona": "Sweet and naive, Beatrice seems harmless yet deeply emotional.",
    "privateSecret": "Harbors deep resentment towards the victim, who she believes stole Ivor's affections from her.",
    "motiveSeed": "Her possessive feelings for Ivor may have driven her to extremes, viewing the victim as an obstacle to her happiness.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was on a break in the staff room at the time of the murder.",
    "accessPlausibility": "easy",
    "stakes": "Eager to build a life with Ivor and seeks to remove any hindrance to that goal.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Beatrice speaks with a youthful exuberance, her words often tumbling out in a rush. She has a tendency to second-guess herself, frequently apologizing and seeking validation from others.",
    "signatureTic": "‘Oh dear, I hope I didn’t say anything silly!’",
    "internalConflict": "Beatrice wrestles with her feelings of jealousy and inadequacy, torn between her desire for Ivor and the realization that her emotions could lead her down a dangerous path.",
    "personalStakeInCase": "The murder investigation threatens to expose her feelings for Ivor and the lengths she might go to protect her dream of a life with him.",
    "paragraphs": [
      "Beatrice Quill stood behind the counter of the hotel café, her heart racing as she watched the guests mingle, laughter and chatter filling the air. A waitress by trade, she wore a smile that masked the turmoil within. Her affection for Captain Ivor Hale was a secret she guarded fiercely, yet the arrival of Hugo Vane had thrown her world into disarray. The thought that this man could steal Ivor’s affections sent a wave of bitterness coursing through her veins, igniting a jealousy she struggled to contain.",
      "As news of the murder spread, Beatrice found herself in a whirlwind of emotions. She had been on her break in the staff room when it happened, a flimsy alibi that did little to ease her growing anxiety. What if someone suspected her? What if they connected the dots between her feelings for Ivor and her resentment towards the victim? The stakes were high, and the innocent façade she wore was beginning to crack under the pressure. ‘Oh dear, I hope I didn’t say anything silly!’ she would often murmur, seeking reassurance from those around her.",
      "Yet beneath her sweet exterior lay a tempest of longing and despair. Beatrice was acutely aware of her position in the hotel hierarchy; she was a mere waitress, while Ivor was a man of honor and stature. Did he even notice her? Or was she just another face in the crowd? As she navigated the murky waters of her emotions, Beatrice felt the pull of possessiveness overshadowing her better judgment. The idea of Hugo as an obstacle to her happiness festered within her, leading her to question how far she would go to rid herself of that threat.",
      "In her heart, Beatrice longed for a life with Ivor, one filled with love and companionship. Yet the thought of taking drastic measures to protect that dream terrified her. How could she reconcile her feelings of jealousy with the desire to be virtuous? As the investigation progressed, she found herself at a crossroads, torn between the woman she wanted to be and the darkness that beckoned her. Would she choose love or jealousy? Virtue or vice?",
      "As the tension mounted, Beatrice realized that she needed to confront her emotions. The murder investigation, while terrifying, offered her an opportunity for self-discovery. She could either succumb to the shadows of her jealousy or rise above them, proving that love, when tempered with integrity, could prevail. The masquerade of innocence was unraveling, and Beatrice would have to decide whether to embrace the light or succumb to the darkness within her."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, the cunning hotel manager, finds herself caught in a web of deceit as her embezzlement threatens to surface amidst a murder investigation.",
    "publicPersona": "Efficient and shrewd, Sylvia runs the hotel with a tight grip and is well-respected by guests.",
    "privateSecret": "Involved in embezzling funds from the hotel, potentially exposing the hotel to financial ruin if discovered.",
    "motiveSeed": "Could be implicated in the murder if the victim threatens to reveal her embezzlement.",
    "motiveStrength": "strong",
    "alibiWindow": "Insisted she was making rounds in the hotel at the murder time; however, no one can vouch for her.",
    "accessPlausibility": "easy",
    "stakes": "Financial security and her career depend on keeping her actions hidden.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Sylvia speaks with a sharp, controlled tone, often lacing her words with subtle sarcasm. Her sentences are precise, reflecting her meticulous nature, and she rarely allows emotion to cloud her judgment.",
    "signatureTic": "‘One must always be mindful of appearances, wouldn’t you agree?’",
    "internalConflict": "Sylvia grapples with the fear of exposure, torn between her ambition to maintain control of the hotel and the risk of losing everything she has built.",
    "personalStakeInCase": "The murder investigation could unravel her carefully curated life, exposing her embezzlement and jeopardizing her career and financial security.",
    "paragraphs": [
      "Sylvia Trent surveyed the hotel lobby with a hawk-like gaze, her presence commanding respect from both guests and staff alike. As the manager, she was known for her efficiency and shrewdness, qualities that had propelled her to the top of the hospitality industry. Yet beneath the surface of this polished exterior lay a labyrinth of secrets, one that had the potential to unravel at any moment. The murder of Hugo Vane was an unwelcome disruption, a reminder that her carefully curated world was more fragile than she had ever acknowledged.",
      "In the days following the murder, Sylvia felt the walls closing in. Her alibi, claiming she had been making rounds at the time, was a thin veil for her mounting anxiety. No one could vouch for her whereabouts, and the fear of being implicated in both the murder and her embezzlement gnawed at her. The stakes were higher than ever; if the truth emerged, it would not only tarnish her reputation but could also lead to the hotel’s financial ruin. ‘One must always be mindful of appearances, wouldn’t you agree?’ she would quip, her tone laced with a sardonic edge, masking the fear that lurked beneath.",
      "Sylvia's ambition had driven her to take risks, bending the rules to secure the hotel’s success. Yet now, those very choices threatened to consume her. The thought of exposure was a specter that haunted her every move, and as the investigation unfolded, she felt the pressure mounting. The guests, once her allies, now felt like potential adversaries, each one a ticking time bomb of information that could spell her doom. How could she maintain control in a situation spiraling beyond her grasp?",
      "As she navigated the complexities of the murder investigation, Sylvia found herself at a crossroads. Would she continue to manipulate the situation to protect her interests, or would she risk it all to come clean? The cunning opportunist was torn between self-preservation and the moral implications of her actions. The masquerade of authority she had so carefully constructed was beginning to fray, and with it, the foundation of her life.",
      "In the end, Sylvia realized that the choices she made would define her legacy. Would she emerge from this crisis stronger, or would the shadows of her past consume her? The stakes were not just financial; they were deeply personal, and as the truth threatened to surface, Sylvia knew she had to act swiftly. The masquerade was unraveling, and she would need every ounce of cunning to navigate the storm ahead."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a charismatic freelance photographer, becomes the murder victim whose debts and secrets reveal a tangled web of relationships.",
    "publicPersona": "Witty and adventurous, Hugo is a popular figure among hotel guests and has a knack for storytelling.",
    "privateSecret": "Has a gambling problem and owes money to dangerous people, which could expose him.",
    "motiveSeed": "Could have wanted the victim out of the way to gain social capital or leverage over Ivor and Beatrice.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be out taking photos during the murder, but could easily be lying.",
    "accessPlausibility": "possible",
    "stakes": "His finances and reputation are at stake if his debts come to light.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Hugo spoke with a confident bravado, often punctuating his stories with dramatic flair. He had a tendency to charm his audience, drawing them into his world of adventure and intrigue.",
    "signatureTic": "‘Life is but a series of snapshots, wouldn’t you say?’",
    "internalConflict": "Hugo struggled with the consequences of his gambling addiction, torn between the thrill of the game and the reality of his debts.",
    "personalStakeInCase": "His murder exposes the fragility of his life, revealing the depths of his gambling problem and the dangerous people he owed money to.",
    "paragraphs": [
      "Hugo Vane was a man of many faces, each one more captivating than the last. A freelance photographer with a penchant for adventure, he had the ability to charm anyone who crossed his path. Guests at the hotel adored him, drawn to his witty stories and charismatic demeanor. Yet beneath the surface lay a tumultuous reality, one that would ultimately lead to his demise. The murder that claimed his life was not merely an end but a culmination of secrets that had been festering beneath his charming façade.",
      "As he wandered the seaside, camera in hand, Hugo often mused, ‘Life is but a series of snapshots, wouldn’t you say?’ Yet, in truth, his life was a series of missteps, each one leading him deeper into a labyrinth of debt and danger. His gambling addiction had ensnared him in a web of obligations to individuals who did not take kindly to late payments. The thrill of the game had become a double-edged sword, and as the stakes rose, so did the pressure on Hugo to perform.",
      "On the fateful day of his murder, Hugo had claimed to be out taking photos, a convenient alibi that could easily be called into question. The truth was, he had been caught in a precarious situation, one that could expose him to more than just financial ruin. As he navigated the hotel, the tension in the air was palpable, and he could sense the eyes of those around him weighing his every move. Who among them would turn on him? Who would be the one to reveal the truth of his debts to the world?",
      "The intricacies of his relationships were as tangled as the web of lies he had woven. Ivor and Beatrice, two individuals whose lives had intersected with his, were now at the center of a storm that threatened to engulf them all. Hugo had sought social capital among the guests, but the very connections he had forged became his undoing. The whispers of jealousy, resentment, and ambition swirled around him, creating a perfect storm that culminated in his untimely death.",
      "In the end, Hugo's life was a tragic reminder of the consequences of one's choices. The allure of adventure had blinded him to the dangers lurking in the shadows, and as the investigation unfolded, the truth about his gambling problem and the debts he owed would come to light. His murder was not just a crime; it was a reflection of the fragility of life, the consequences of living on the edge, and the reality that sometimes, the snapshots we take can reveal more than we ever intended."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Cliffside Retreat",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A mid-century seaside hotel perched on a cliff, offering breathtaking ocean views and a touch of Art Deco elegance, attracting both vacationers and business travelers.",
    "visualDescription": "The hotel features a sweeping facade of gleaming white stucco with bold geometric lines, accented by polished brass and glass. Inside, the grand lobby boasts a high ceiling adorned with a crystal chandelier, while plush, sea-green upholstery invites guests to linger. The large windows frame the tumultuous sea, casting a moody light throughout the space.",
    "atmosphere": "A palpable tension fills the air, underscored by the salty tang of the ocean and the distant rumble of thunder, reflecting the unease of the times.",
    "paragraphs": [
      "The Cliffside Retreat stands defiantly against the crashing waves of the English Channel, its Art Deco lines a stark contrast to the rugged cliffs it clings to. Inside, the lobby hums with the quiet conversations of guests seeking solace from the outside world, their laughter tempered by the weight of recent wartime events. The scent of damp sea air mingles with the faint trace of cigarette smoke, a reminder of the heavy burdens many carry. Outside, the ocean roars, a constant reminder of nature's power and the isolation that this hotel provides.",
      "As guests filter in and out, the atmosphere thickens with unspoken words and furtive glances. The staff, moving with practiced efficiency, navigate the narrow hallways with an air of urgency. Closer inspection reveals the tension etched on their faces, a reflection of the precarious balance between hospitality and the secrets that lurk just beneath the surface. The hotel, while a refuge for some, is a stage for others, caught in a masquerade of authority and deception.",
      "The ocean-view rooms offer a breathtaking panorama, but the isolation of the cliffside location becomes evident as storm clouds gather overhead. With each clap of distant thunder, the hotel seems to hold its breath, as if anticipating the arrival of something—or someone—unwelcome. The sound of rain begins to patter against the windows, a steady reminder of the turmoil outside, while inside, the warmth of the lobby feels like a fragile cocoon, holding back the encroaching chill of the world beyond."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with intermittent rain, typical of coastal climates in the 1940s",
    "timeFlow": "A weekend of secrets unfolds beneath the watchful eye of the sea.",
    "mood": "tension in the air due to recent wartime events and ongoing political uncertainty",
    "eraMarkers": [
      "Radio broadcasts filling the air with news",
      "Early television sets flickering in the lounge",
      "Military radar equipment visible in the staff quarters"
    ],
    "sensoryPalette": {
      "dominant": "salty ocean air mixed with damp wood",
      "secondary": [
        "faint traces of cigarette smoke",
        "a hint of perfume from passing guests"
      ]
    },
    "paragraphs": [
      "The ambiance of The Cliffside Retreat is a complex tapestry woven from the threads of history, war, and human emotion. The salty tang of the ocean air melds with the damp wood of the hotel's structure, creating a unique scent that is both refreshing and oppressive. As news broadcasts crackle from radios in the corners, the weight of the world feels palpable, reminding all within of the uncertainty that lies ahead. The early evening light struggles to penetrate the thick clouds, casting a muted glow that enhances the feeling of isolation and introspection.",
      "Within this grand yet secluded establishment, time feels suspended, with each moment stretching as guests linger over drinks in the lounge, exchanging nervous glances and hushed whispers. The occasional laughter is quickly swallowed by the sound of rain drumming against the windows, a reminder of the tempest outside. This juxtaposition of warmth and cold, laughter and silence, creates an atmosphere charged with the potential for revelation and betrayal. The hotel, both a sanctuary and a trap, stands ready to unveil its secrets as night falls."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space, public interaction",
      "visualDetails": "A spacious area with high ceilings, adorned with Art Deco chandeliers and plush seating arrangements. Large windows provide views of the turbulent sea.",
      "sensoryDetails": {
        "sights": [
          "polished brass railings",
          "crystal chandelier casting reflections",
          "sea-green upholstery on armchairs",
          "large windows framing stormy seas"
        ],
        "sounds": [
          "murmurs of conversation",
          "clinking glasses",
          "distant radio broadcasts",
          "the crackle of firewood in the hearth"
        ],
        "smells": [
          "salty sea air",
          "freshly brewed coffee",
          "cigarette smoke lingering",
          "worn leather from armchairs"
        ],
        "tactile": [
          "smooth marble floor",
          "soft velvet upholstery",
          "cold brass handrails",
          "warmth from the fireplace"
        ]
      },
      "accessControl": "Guests and staff have access; restricted areas for staff only, monitored by security.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops racing down window panes",
            "grey light dimming the lobby",
            "wet umbrellas abandoned by guests",
            "shadows stretching across the floor"
          ],
          "sounds": [
            "steady rhythm of rain",
            "soft footsteps on wet floors",
            "muffled laughter from the bar",
            "the distant crash of waves"
          ],
          "smells": [
            "damp earth from outside",
            "freshly baked bread from the kitchen",
            "wood smoke from the fireplace",
            "wet wool from coats"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light through windows",
            "dimly lit corners of the lobby",
            "flickering shadows from the chandelier",
            "guests huddled in quiet conversation"
          ],
          "sounds": [
            "the ticking of an old clock",
            "the creak of floorboards",
            "soft whispers of gossip",
            "the rustle of newspapers"
          ],
          "smells": [
            "dust from the neglected corners",
            "lingering perfume from passing guests",
            "freshly polished wood",
            "cold stone from the entryway"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "glimmers of the sea under moonlight",
            "guests in evening attire"
          ],
          "sounds": [
            "the soft clinking of cutlery",
            "distant music from a gramophone",
            "laughter breaking the silence",
            "the whisper of waves below"
          ],
          "smells": [
            "rich tobacco from cigars",
            "sweet scent of dessert",
            "freshly cut flowers on the tables",
            "the crispness of night air"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The grand lobby of The Cliffside Retreat is a stunning testament to Art Deco design, with its high ceilings and sweeping lines that draw the eye towards the crystal chandelier overhead. Here, guests gather beneath the warm glow of polished brass fixtures, sharing stories and secrets as the ocean crashes below. The scent of salty air mixes with the rich aroma of freshly brewed coffee, creating an inviting yet charged atmosphere. Every corner buzzes with the whispers of intrigue, where every laugh may hide a deeper truth.",
        "As the day wanes and the shadows stretch, the lobby transforms into a space of hushed anticipation. Guests, clad in evening attire, sip cocktails while the distant sound of waves provides a rhythmic backdrop to their conversations. The flickering candlelight casts a warm glow, but the tension remains palpable, as if the very walls hold their breath, waiting for the night's revelations to unfold."
      ]
    },
    {
      "id": "ocean_view_room",
      "name": "Ocean View Room",
      "type": "interior",
      "purpose": "Private quarters for guests, crime scene",
      "visualDetails": "A spacious room with large windows overlooking the turbulent sea, decorated with elegant furnishings and dark wood accents.",
      "sensoryDetails": {
        "sights": [
          "stormy waves crashing against the cliffs",
          "heavy curtains drawn against the light",
          "elegant furnishings in muted colors",
          "framed photographs of past guests"
        ],
        "sounds": [
          "howling wind outside",
          "waves crashing violently",
          "the creak of the building settling",
          "distant thunder rumbling"
        ],
        "smells": [
          "scent of damp wood",
          "fresh linen sheets",
          "faint perfume lingering",
          "salt spray from the ocean"
        ],
        "tactile": [
          "soft cotton sheets",
          "cold glass of the window",
          "smooth wooden desk surface",
          "plush carpet beneath feet"
        ]
      },
      "accessControl": "Accessed via guest keycards; staff only allowed during cleaning hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain streaking down the window",
            "grey light filtering through curtains",
            "puddles forming outside",
            "damp towels hanging by the door"
          ],
          "sounds": [
            "steady patter of rain",
            "the rustle of sheets as someone stirs",
            "the distant sound of thunder",
            "the creak of water pipes"
          ],
          "smells": [
            "wet earth outside",
            "fresh coffee brewing in the hallway",
            "the mustiness of damp air",
            "the aroma of breakfast wafting up"
          ],
          "mood": "claustrophobic unease"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "ocean waves merging with the sky",
            "heavy clouds obscuring the sun",
            "the flicker of a radio light"
          ],
          "sounds": [
            "the soft hum of the radio",
            "the rustle of paper",
            "the distant sound of voices",
            "the crash of waves against the cliffs"
          ],
          "smells": [
            "the stale scent of closed windows",
            "faint traces of perfume",
            "the tang of salty air",
            "the musty smell of old books"
          ],
          "mood": "oppressive stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "moonlight dancing on the waves",
            "the room aglow with lamps",
            "shadows creeping along the walls",
            "the silhouette of a figure by the window"
          ],
          "sounds": [
            "the soft lapping of waves",
            "the distant laughter from the lobby",
            "the rustle of fabric as someone moves",
            "the tick of a clock in the background"
          ],
          "smells": [
            "the scent of fresh flowers on the table",
            "the lingering aroma of a recent meal",
            "the cool scent of night air",
            "the faint smell of tobacco"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Ocean View Room offers a breathtaking panorama of the turbulent sea, but within its walls lies a different kind of storm. The elegant furnishings and soft linens provide an illusion of comfort, yet the oppressive atmosphere speaks of secrets and unspoken words. As guests peer out at the crashing waves, the sound of the wind howling through the cliffs reminds them of their isolation, amplifying the tension that hangs in the air. Each creak of the building seems to whisper warnings of what lies ahead.",
        "As night descends, the room transforms into a cocoon of shadows and uncertainty. Moonlight spills through the windows, casting eerie patterns across the floor, while distant laughter from the lobby feels like a world away. The scent of fresh flowers mingles with the cool night air, but even that cannot mask the underlying tension. Here, in this seemingly serene space, the stage is set for revelations that will shake the foundations of The Cliffside Retreat."
      ]
    },
    {
      "id": "staff_quarters",
      "name": "Staff Quarters",
      "type": "interior",
      "purpose": "Private area for hotel staff",
      "visualDetails": "A modest, functional space with simple furnishings, including bunk beds and a communal area for staff to relax.",
      "sensoryDetails": {
        "sights": [
          "faded posters on the walls",
          "dim lighting from a single bulb",
          "clutter of personal belongings",
          "the small kitchenette area"
        ],
        "sounds": [
          "the chatter of staff during breaks",
          "the hum of the refrigerator",
          "the clatter of dishes being washed",
          "the distant sound of guests laughing"
        ],
        "smells": [
          "the scent of cleaning supplies",
          "the lingering aroma of last night's dinner",
          "the mustiness of unventilated space",
          "the faint smell of laundry detergent"
        ],
        "tactile": [
          "cold metal of bunk bed frames",
          "rough texture of worn blankets",
          "smooth surface of the kitchen counter",
          "the chill of the morning air"
        ]
      },
      "accessControl": "Restricted to staff only; monitored by head of housekeeping.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "drops of rain on the window",
            "grey light filtering through curtains",
            "staff members rushing to prepare for the day",
            "wet shoes left by the door"
          ],
          "sounds": [
            "the steady rhythm of rain",
            "the rustle of uniforms being put on",
            "the clatter of breakfast dishes",
            "the distant sound of thunder"
          ],
          "smells": [
            "the scent of wet earth outside",
            "freshly brewed coffee wafting from the kitchen",
            "the mustiness of damp air",
            "the aroma of toast and eggs"
          ],
          "mood": "frantic energy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "gloomy light casting shadows",
            "staff members taking breaks",
            "the clutter of everyday items",
            "the dim glow of a single bulb"
          ],
          "sounds": [
            "the quiet hum of conversation",
            "the clatter of dishes being cleaned",
            "the distant sound of guests",
            "the creak of the building settling"
          ],
          "smells": [
            "the stale scent of unventilated space",
            "the lingering aroma of lunch",
            "the faint smell of cleaning products",
            "the scent of damp clothing"
          ],
          "mood": "weary resignation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of lamps",
            "staff members unwinding after a long day",
            "the clutter of personal items",
            "the flickering light from a radio"
          ],
          "sounds": [
            "the laughter of staff sharing stories",
            "the distant sound of waves crashing",
            "the hum of the refrigerator",
            "the clinking of glasses in the lounge"
          ],
          "smells": [
            "the scent of dinner being prepared",
            "the warmth of freshly baked bread",
            "the aroma of herbal tea",
            "the tang of cleaning supplies"
          ],
          "mood": "relaxed camaraderie"
        }
      ],
      "paragraphs": [
        "The Staff Quarters of The Cliffside Retreat are a world apart from the elegance above, a modest space where the hardworking staff retreat after long shifts. The walls are adorned with faded posters and the air carries the scent of cleaning supplies mixed with the remnants of last night's dinner. The dim lighting casts a weary glow, as tired bodies collapse onto bunks after a day of service. Here, amidst the clutter of personal belongings, the staff share laughter and camaraderie, their voices a soothing balm against the storm outside.",
        "As evening settles in, the atmosphere shifts, with staff members unwinding and sharing stories of the day's events. The distant sound of crashing waves becomes a comforting backdrop, reminding them of their connection to the sea. The scent of freshly baked bread wafts in from the kitchen, mingling with the lingering aroma of herbal tea, creating a sense of warmth and community. In this small refuge, the burdens of the day fade, if only for a moment, as they prepare for whatever tomorrow may bring."
      ]
    },
    {
      "id": "cliffside_beach",
      "name": "Cliffside Beach",
      "type": "exterior",
      "purpose": "Outdoor area for guests, potential crime scene",
      "visualDetails": "A rugged beach with rocky outcrops, accessible only by a narrow path leading down the cliffside.",
      "sensoryDetails": {
        "sights": [
          "crashing waves against jagged rocks",
          "distant gulls soaring overhead",
          "dark clouds looming above",
          "scattered pebbles and driftwood"
        ],
        "sounds": [
          "the roar of the ocean",
          "the cries of seagulls",
          "the rustle of sea grass",
          "the wind whipping through the cliffs"
        ],
        "smells": [
          "salty sea breeze",
          "fresh seaweed and kelp",
          "the scent of damp earth",
          "the musty aroma of driftwood"
        ],
        "tactile": [
          "rough texture of rocky surfaces",
          "cold water lapping at bare feet",
          "softness of wet sand",
          "the chill of the wind on skin"
        ]
      },
      "accessControl": "Accessible via a narrow path; caution advised during storms.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain falling on the beach",
            "grey waves blending with the sky",
            "puddles forming in the sand",
            "dark clouds rolling in"
          ],
          "sounds": [
            "the steady rhythm of raindrops",
            "the crash of waves against rocks",
            "distant thunder rumbling",
            "the squawking of gulls seeking shelter"
          ],
          "smells": [
            "the scent of wet sand",
            "fresh rain mixing with sea air",
            "the earthy aroma of damp grass",
            "the briny smell of the ocean"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark waves rolling towards the shore",
            "the beach devoid of sunbathers",
            "gulls circling above",
            "the shoreline littered with debris"
          ],
          "sounds": [
            "the low rumble of the surf",
            "the wind howling through the cliffs",
            "the crackle of driftwood underfoot",
            "the distant sound of thunder"
          ],
          "smells": [
            "the salty tang of the ocean",
            "the dampness of the earth",
            "the mustiness of seaweed",
            "the faint scent of decay"
          ],
          "mood": "ominous"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden hues of sunset over the water",
            "long shadows stretching across the sand",
            "the silhouette of cliffs against the sky",
            "the gentle lapping of waves"
          ],
          "sounds": [
            "the rhythmic crash of waves",
            "the chirping of crickets",
            "the distant laughter of guests",
            "the whisper of the wind"
          ],
          "smells": [
            "the fresh scent of evening air",
            "the earthy aroma of damp sand",
            "the hint of smoke from a nearby fire",
            "the sweetness of wildflowers"
          ],
          "mood": "tranquil yet watchful"
        }
      ],
      "paragraphs": [
        "The Cliffside Beach, a rugged stretch of coastline, offers a dramatic contrast to the elegance of The Cliffside Retreat. Accessible only by a narrow path winding down the cliffs, this beach is a place of rugged beauty, where the roar of the ocean drowns out all other sounds. The salty breeze carries the scent of seaweed and damp earth, while the pebbles crunch underfoot. Here, guests may find solace or confrontation, as the looming cliffs bear witness to secrets whispered in the wind.",
        "As evening descends, the beach transforms into a canvas painted with the golden hues of sunset. The waves lap gently at the shore, and the shadows stretch long across the sand. Yet, beneath this tranquil facade lies an undercurrent of tension, as if the very air holds its breath, waiting for the night's revelations. The scent of wildflowers mingles with the briny sea air, creating a bittersweet reminder of beauty amidst the darkening skies."
      ]
    }
  ],
  "note": "",
  "cost": 0.00291475635,
  "durationMs": 43342
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "October",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "overcast skies with frequent rain showers",
      "cool breezes from the coast",
      "occasional bursts of sunlight"
    ],
    "daylight": "Days are growing shorter, with twilight settling in by 5:30 PM, making evenings feel particularly dark and heavy.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, shortly after dinner service concludes",
    "holidays": [
      "Halloween"
    ],
    "seasonalActivities": [
      "visiting local pumpkin patches",
      "attending Halloween costume parties",
      "collecting conkers in the park"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "crisp white dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed jacket with elbow patches",
        "knitted wool sweater",
        "corduroy trousers"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with floral prints",
        "tailored wool coat",
        "clutch purse"
      ],
      "casual": [
        "A-line skirt with a fitted blouse",
        "cardigan sweater",
        "tailored slacks"
      ],
      "accessories": [
        "wide-brimmed hat",
        "string of pearls",
        "silk scarf"
      ]
    },
    "trendsOfTheMoment": [
      "utility clothing reflecting wartime rationing",
      "bold patterns and colors in fabric",
      "the rise of the 'New Look' silhouette"
    ],
    "socialExpectations": [
      "women are increasingly expected to contribute to the workforce",
      "formal attire is a must during evening events",
      "social gatherings are marked by modesty and decorum"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Allied forces are advancing in Europe, with the liberation of Paris still fresh in public memory",
      "the U.S. is gearing up for the presidential election",
      "tensions are rising with the Soviet Union as the war draws to a close"
    ],
    "politicalClimate": "The political atmosphere is charged with discussions of post-war reconstruction and the looming presence of communism.",
    "economicConditions": "Wartime rationing is still in effect, affecting food and clothing availability; however, there are signs of economic recovery as production ramps up.",
    "socialIssues": [
      "debate over returning servicemen to civilian jobs",
      "discussions surrounding women's rights post-war",
      "racial tensions exacerbated by wartime segregation"
    ],
    "internationalNews": [
      "Reports of the Yalta Conference leaks stirring speculation about post-war Europe",
      "increased military action in the Pacific Theatre",
      "the establishment of the United Nations is on the horizon"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'I'll Be Home for Christmas'",
        "The Andrews Sisters' 'Boogie Woogie Bugle Boy'",
        "Glenn Miller's 'In the Mood'"
      ],
      "films": [
        "'Double Indemnity'",
        "'To Have and Have Not'",
        "'Meet Me in St. Louis'"
      ],
      "theater": [
        "'Oklahoma!'",
        "Broadway shows showcasing wartime morale"
      ],
      "radio": [
        "The Shadow",
        "Fibber McGee and Molly",
        "Suspense"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Glass Menagerie' by Tennessee Williams",
        "'Brave New World' by Aldous Huxley",
        "'The Great Gatsby' reissues"
      ],
      "popularGenres": [
        "mystery",
        "detective fiction",
        "war stories"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first working computer prototype (Colossus)",
        "advancements in radar technology",
        "the development of synthetic rubber"
      ],
      "commonDevices": [
        "wireless radios",
        "early television sets",
        "telephones with rotary dials"
      ],
      "emergingTrends": [
        "increased use of military technology in civilian applications",
        "a rise in home entertainment systems as people seek escape from the war",
        "the beginnings of consumer electronics markets"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Pound of sugar: two shillings"
      ],
      "commonActivities": [
        "socializing at local pubs",
        "listening to radio dramas",
        "attending community dances"
      ],
      "socialRituals": [
        "formal dinner parties with set courses",
        "Halloween costume gatherings",
        "weekend excursions to the countryside"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased visibility of the working class in social spheres",
      "class divisions remain, but wartime camaraderie blurs some lines"
    ],
    "gender": [
      "women's roles are evolving, with many taking on jobs traditionally held by men",
      "there is societal pressure on women to maintain traditional femininity while being active in the workforce",
      "growing discussions about gender equality post-war"
    ],
    "race": [
      "the civil rights movement is beginning to gain traction, but segregation and discrimination are still rampant",
      "increased awareness of racial injustices due to wartime experiences"
    ],
    "generalNorms": [
      "decorum and modesty are highly valued in social settings",
      "the war has fostered a sense of urgency and a desire for community",
      "patriotism influences daily life and social interactions"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and fallen leaves fills the air, a reminder of the recent rains.",
    "The sound of distant thunder echoes, mingling with the chatter of guests in the hotel lobby, where tension lingers like the humidity.",
    "Candles flicker in the dim light of the ballroom, casting shadows that dance across the faces of masked attendees, their secrets hidden beneath layers of fabric."
  ],
  "paragraphs": [
    "October 1944 brings a crisp chill to the coastal air, the kind that seeps into the bones, as overcast skies loom ominously overhead. Rain showers are frequent, punctuated by the occasional break of sunlight, offering fleeting moments of warmth. The days grow shorter, with darkness wrapping around the city by early evening, creating a sense of intimacy and isolation in the hotel where the mystery unfolds. Guests, adorned in their best attire for the evening masquerade, mingle beneath ornate chandeliers, their laughter echoing off the walls, masking the tension that holds the air hostage.",
    "Fashion during this time reflects the duality of wartime utility and post-war optimism. Men don double-breasted suits in rich navy, paired with crisp white shirts and ties featuring bold geometric patterns. Women, too, embrace the spirit of the season in tea-length dresses adorned with floral prints, layered beneath fitted wool coats. Accessories such as wide-brimmed hats and silk scarves serve not only as style statements but also as subtle nods to the changing social landscape as women step into roles once reserved for men.",
    "Life in October 1944 is punctuated by the realities of rationing and recovery, with the sounds of distant military actions echoing in the background of daily existence. The scent of freshly baked bread wafts through the streets, where a loaf can be had for just four pence, while the familiar chatter of neighbors fills the air. Social rituals entwine with the spirit of Halloween, as families venture to pumpkin patches or gather for costume parties, fostering a sense of community amidst the shadows of uncertainty. As the evening draws near, the hotel becomes a stage where secrets and ambitions collide, each masked figure harboring their own mysteries."
  ],
  "note": "",
  "cost": 0.0011133193499999999,
  "durationMs": 20311
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A masquerade ball at a seaside hotel draws a diverse group of guests, where the tensions of post-war society and emerging Cold War fears create a volatile atmosphere ripe for deception and intrigue.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The era sees an increased female workforce participation amidst post-war trauma, where class dynamics are influenced by both economic recovery and the need for social conformity in a climate of political uncertainty."
  },
  "setting": {
    "location": "A mid-century seaside hotel",
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
    "id": "room_change_time",
    "value": "ten minutes past eleven",
    "description": "The time when the victim was last seen alive."
  },
  {
    "id": "disguise_weight",
    "value": "two pounds",
    "description": "The weight of the disguise components found in the victim's room."
  },
  {
    "id": "ocean_distance",
    "value": "thirty yards",
    "description": "The distance from the hotel to the beach where the impersonation took place."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 23,
  "countsByPlacement": {
    "early": 6,
    "mid": 16,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 22,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "category": "spatial"
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
      "category": "behavioral"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "spatial"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_fp_elimination_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_elimination_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_elimination_beatrice_quill",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_sylvia_trent",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_early_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
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
      "id": "clue_discriminating_1",
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
