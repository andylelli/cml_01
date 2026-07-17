# Actual Prompt Record

- Run ID: `mystery-1784236058900`
- Project ID: ``
- Timestamp: `2026-07-16T21:13:05.613Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `54a373bf9b0abdb1`

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
    "title": "Beneath the Tidal Veil",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
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
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A dedicated investigator known for her keen observation skills.",
      "private_secret": "Struggling with the pressures of post-war society.",
      "motive_seed": "Desire to uphold justice.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel staff",
        "guest interactions"
      ],
      "behavioral_tells": [
        "calm under pressure",
        "insightful questioning"
      ],
      "stakes": "seeking truth in a murky situation",
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
      "role_archetype": "Medical Expert",
      "relationships": [
        "close friend of the victim"
      ],
      "public_persona": "Respected physician with a busy practice.",
      "private_secret": "Has been involved in questionable medical practices.",
      "motive_seed": "Fear of exposure.",
      "motive_strength": "moderate",
      "alibi_window": "between 8 PM and 9 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "consulting guests",
        "medication access"
      ],
      "behavioral_tells": [
        "fidgety when questioned",
        "evasive answers"
      ],
      "stakes": "reputation and career at stake",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority Figure",
      "relationships": [
        "former military officer"
      ],
      "public_persona": "Charismatic and commanding presence.",
      "private_secret": "Harbors secrets from his past.",
      "motive_seed": "Desire to protect his reputation.",
      "motive_strength": "weak",
      "alibi_window": "between 9 PM and 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel events",
        "staff oversight"
      ],
      "behavioral_tells": [
        "authoritative tone",
        "impatient"
      ],
      "stakes": "maintaining his status",
      "evidence_sensitivity": [
        "low"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "close friend of Sylvia"
      ],
      "public_persona": "Charming and sociable guest.",
      "private_secret": "Had a hidden rivalry with another guest.",
      "motive_seed": "Unintentional rivalry.",
      "motive_strength": "none",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [
        "sudden changes in mood"
      ],
      "stakes": "none - victim",
      "evidence_sensitivity": [
        "none"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Friend of Victim",
      "relationships": [
        "best friend of Beatrice"
      ],
      "public_persona": "Innocent and naive.",
      "private_secret": "Jealous of Beatrice's popularity.",
      "motive_seed": "Desire for attention.",
      "motive_strength": "moderate",
      "alibi_window": "between 8 PM and 9 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "shared accommodations"
      ],
      "behavioral_tells": [
        "nervous laughter",
        "avoids eye contact"
      ],
      "stakes": "need for validation",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Mysterious Guest",
      "relationships": [
        "acquaintance of Beatrice"
      ],
      "public_persona": "Charming, yet secretive.",
      "private_secret": "Involved in shady dealings.",
      "motive_seed": "Financial gain.",
      "motive_strength": "strong",
      "alibi_window": "between 7 PM and 9 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "mixing with guests"
      ],
      "behavioral_tells": [
        "quick to change subjects"
      ],
      "stakes": "financial stability",
      "evidence_sensitivity": [
        "high"
      ],
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
      "summary": "Amidst the coastal charm of a seaside hotel, a beloved guest is found dead, and the investigation reveals a web of jealousy, deception, and delayed-action poison that obscures the truth."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on poison, toxin, and cocktail to expose the false timing.",
      "delivery_path": [
        {
          "step": "The poison is mixed into Beatrice's favorite cocktail, which she unknowingly consumes."
        }
      ]
    },
    "outcome": {
      "result": "Beatrice suffers a fatal reaction hours after ingestion, leading to confusion about the time of poisoning."
    }
  },
  "false_assumption": {
    "statement": "Beatrice Quill died from a sudden illness caused by her pre-existing condition.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses noted her discussing her health recently, making the sudden death appear consistent with her past.",
    "what_it_hides": "The true cause was a carefully administered poison, exploiting her trust in a friend."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "As a physician, she had access to various substances.",
      "Witnesses recall her being nervous around the time of death."
    ],
    "the_one_flaw": "The poison's effects were inconsistent with any medication she could have administered.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Dr. Finch was seen leaving the victim's room shortly before her death.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "She was delivering a prescription for Beatrice's known health issues.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Hugo Vane was overheard arguing with Beatrice earlier in the day.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "They were discussing their mutual friend, not a conflict.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the time of the crime and had opportunities to poison Beatrice."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The tide schedule indicating low tide at 10 PM."
      ],
      "windows": [
        "8 PM to 10 PM - the time window for when Beatrice was poisoned."
      ],
      "contradictions": [
        "Beatrice's health diary indicates she felt well until shortly before her death."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Sylvia Trent",
        "Hugo Vane"
      ],
      "objects": [
        "Cocktail glass with poison residue",
        "Prescription bottle"
      ],
      "permissions": [
        "Hotel staff had unrestricted access to guest rooms."
      ]
    },
    "physical": {
      "laws": [
        "The poison's reaction is contingent on the acidity of the drink consumed."
      ],
      "traces": [
        "Residue found in the cocktail glass."
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor's role as an investigator led to trust among the staff."
      ],
      "authority_sources": [
        "Dr. Finch's medical reputation gave her credibility."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The cocktail glass in Beatrice's room shows residue of a plant toxin.",
        "correction": "The presence of toxin indicates foul play, contradicting the assumption of natural illness.",
        "effect": "Narrows suspect pool by suggesting the death was not due to her health.",
        "required_evidence": [
          "Cocktail glass with poison residue",
          "Beatrice's health diary indicating she felt well"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses confirm Beatrice was last seen drinking her favorite cocktail at 9 PM.",
        "correction": "Her drink was the last item she consumed before symptoms appeared, identifying the time of poisoning.",
        "effect": "Eliminates the possibility that she was poisoned earlier.",
        "required_evidence": [
          "Witness accounts of her drinking",
          "Time logs from the hotel"
        ],
        "reader_observable": true
      },
      {
        "observation": "A chemistry book in Dr. Finch's possession discusses the properties of the poison found in Beatrice's glass.",
        "correction": "Dr. Finch's knowledge of the poison indicates premeditation since she had access to the toxin.",
        "effect": "Narrows the suspect pool down to Dr. Finch.",
        "required_evidence": [
          "Chemistry book found in Dr. Finch's room",
          "Witness statements about her behavior"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares suspect, cocktail, and residue against the claimed timeline.",
    "knowledge_revealed": "Dr. Finch's inability to explain the presence of the toxin in relation to Beatrice's last drink proves her guilt.",
    "pass_condition": "Dr. Finch is unable to convincingly account for her knowledge of the poison and its effects.",
    "evidence_clues": [
      "clue_culprit_direct_1",
      "clue_mechanism_visibility_core",
      "clue_1",
      "clue_culprit_direct_dr_mallory_finch"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The cocktail glass residue and Beatrice's health diary reveal a discrepancy between her health and the cause of death. Step 2: Witness testimonies confirm the timeline of Beatrice's last drink, eliminating the possibility of an earlier poisoning. Step 3: The chemistry book establishes Dr. Finch's premeditated involvement, which is revealed during the discriminating test."
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
        "clearance_method": "Confirmed actions during the critical time frame.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm he was with another guest during the time.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi corroborated by other guests.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Chemistry book found"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
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
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_elimination_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_hugo_vane",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a traveling journalist whose insightful articles often delve into the depths of society's hidden truths. However, her connection to the victim weighs heavily on her conscience, pushing her to investigate a murder that reveals secrets she'd rather keep buried.",
    "publicPersona": "Eleanor is known for her insightful articles on social issues and the arts, often attending events to gather stories.",
    "privateSecret": "She once had a brief affair with the victim, which she kept hidden to protect her professional reputation.",
    "motiveSeed": "Eleanor feels compelled to uncover the truth about the victim's death, driven by her guilt over the past.",
    "motiveStrength": "strong",
    "alibiWindow": "was in the lobby when the murder occurred",
    "accessPlausibility": "easy",
    "stakes": "Her career and personal redemption depend on solving the case.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured tone, often weaving in sharp observations about the people around her. She has a tendency to use metaphors drawn from literature and art, which can sometimes obscure her point.",
    "signatureTic": "Ah, the irony of it all.",
    "internalConflict": "Eleanor grapples with the guilt of her past affair with the victim, fearing that her secrets may come to light and ruin her career.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it represents a chance for her to redeem herself and confront her past mistakes.",
    "paragraphs": [
      "Eleanor Voss stepped into the dimly lit hotel lobby, her heart racing with the weight of unspoken guilt. A traveling journalist by trade, she had always been adept at uncovering the truth, yet the truth surrounding Beatrice Quill's death was a tangled web of her own making. The irony was not lost on her; the very woman who had inspired her most profound articles was now lying cold, and Eleanor’s past with her cast a long shadow over her investigative instincts.",
      "As she mingled with guests, her sharp eyes scanned for clues, but the laughter and chatter felt suffocating, a stark contrast to the turmoil within her. 'Ah, the irony of it all,' she muttered under her breath, a phrase that had become her quiet lament. She had been in the lobby during the murder, an alibi made easy by her presence among the bustling crowd, yet the thought of her history with Beatrice gnawed at her conscience like a persistent tide eroding the shore.",
      "Eleanor felt compelled to solve this case, not just as a matter of professional duty, but as a means of confronting her own demons. The guilt of their brief affair haunted her, reminding her of the fragility of their relationship and the precarious nature of reputation in her field. She had kept their secret hidden, fearing that exposure would ruin her career, but now it was her chance to make amends, to bring justice to a life that had been cut short too soon.",
      "Navigating the complex relationships that intertwined the hotel guests, Eleanor found herself drawn into a world of secrets and lies. Each conversation was a dance, a careful step around the truth, and she was determined to lead. As she peeled back the layers of deception, she felt a mix of dread and exhilaration—a reminder that sometimes, the truth was as dangerous as it was liberating. In the end, Eleanor knew that solving this mystery was not just about uncovering the killer; it was about finding her own peace amidst the chaos."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated physician known for her unwavering compassion and work ethic, but beneath her professional facade lies a simmering resentment stemming from a financial dispute with the victim. Her moral compass is tested when her past confronts her in the present.",
    "publicPersona": "A dedicated doctor known for her compassion and unyielding work ethic, she has a steadfast reputation in the community.",
    "privateSecret": "Dr. Finch had a financial dispute with the victim over a failed investment in an experimental treatment.",
    "motiveSeed": "Financial loss and the victim's refusal to reimburse her led to a heated argument.",
    "motiveStrength": "strong",
    "alibiWindow": "was in her office attending to a patient at the time of the murder",
    "accessPlausibility": "possible",
    "stakes": "Her professional standing and financial stability are at risk.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks in a measured, clinical tone, often using medical jargon even in casual conversation. Her sentences are precise, reflecting her commitment to her profession, but there is an underlying tension in her voice when discussing the victim.",
    "signatureTic": "I’m afraid that’s not how the body works.",
    "internalConflict": "Dr. Finch struggles with the ethical implications of her financial disputes, fearing that her professional integrity may be compromised.",
    "personalStakeInCase": "The crime matters to Dr. Finch because her reputation and financial stability are at stake, and she fears exposure of her vulnerabilities.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her office, the sterile scent of antiseptic mingling with the weight of her thoughts. A physician revered for her dedication, she had built her life around healing others, yet the recent death of Beatrice Quill stirred a tempest of emotions within her. The public might see her as a paragon of virtue, but behind closed doors, she battled a financial dispute that threatened to unravel her carefully constructed world.",
      "The argument with Beatrice had been heated, a culmination of frustration over a failed investment in an experimental treatment. 'I’m afraid that’s not how the body works,' she often reminded her patients, but with Beatrice, the stakes had been personal. The victim’s refusal to reimburse her had ignited a fury that she had never anticipated; it was a conversation that haunted her, echoing in the recesses of her mind like a malpractice suit waiting to be filed.",
      "As she navigated the hotel’s dimly lit corridors, Dr. Finch felt the walls closing in. Her alibi, attending to a patient at the time of the murder, felt flimsy in the face of scrutiny. She couldn't shake the feeling that her financial woes were now intertwined with the tragedy, making her a suspect in a web of deception. The community had always relied on her, but now she feared that their trust might slip through her fingers like sand.",
      "The stakes were high; her professional standing and financial stability depended on the outcome of this investigation. Dr. Finch found herself at a crossroads, torn between her ethical obligations as a physician and the personal turmoil that threatened to consume her. Each day brought new revelations, and she knew that confronting the truth about Beatrice's death meant facing her own shortcomings—a battle she was not sure she was ready to fight."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer who embodies the values of honor and integrity, yet he harbors a dark secret that could tarnish his family's legacy. As the investigation unfolds, Ivor finds himself torn between loyalty and the truth.",
    "publicPersona": "A respected figure in the community, Ivor often shares stories of his service and has a strong moral compass.",
    "privateSecret": "Ivor has a long-buried secret about the victim's past that could ruin her reputation.",
    "motiveSeed": "Protecting his family's name, he felt he had to keep the victim silent about her past indiscretions.",
    "motiveStrength": "compelling",
    "alibiWindow": "was seen in the bar with witnesses during the time of the murder",
    "accessPlausibility": "possible",
    "stakes": "His family's honor and wealth are at stake.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks in a warm, booming voice that commands attention, often punctuating his stories with self-deprecating humor. He has a tendency to digress into naval anecdotes, making his conversations feel both nostalgic and lengthy.",
    "signatureTic": "There’s honor in the sea, and I’ve sailed through my share of storms.",
    "internalConflict": "Ivor is torn between protecting his family's honor and the moral obligation to reveal the truth about the victim's past.",
    "personalStakeInCase": "The case matters to Ivor as it threatens the family's legacy and the secrets he has kept for far too long.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, the dim light casting a shadow over his weathered face. A retired naval officer, he was the embodiment of honor, yet a storm brewed within him that threatened to capsize his carefully curated image. He had spent years navigating the treacherous waters of life, but now, with Beatrice Quill's death, he found himself at the helm of a moral dilemma that could ruin everything he had worked to protect.",
      "His public persona was one of respect and admiration; stories of his service and integrity flowed from his lips like the tide. 'There’s honor in the sea, and I’ve sailed through my share of storms,' he would often say, but the truth was more complicated. Ivor had harbored a secret about Beatrice, a detail from her past that, if revealed, could shatter her reputation and drag his family into disrepute. The weight of that knowledge bore down on him, a relentless current pulling him under.",
      "Surrounded by witnesses during the time of the murder, Ivor felt a flicker of relief, yet the nagging feeling of complicity gnawed at his conscience. He had always prided himself on his moral compass, but protecting his family's name came at a price. Each day, he wrestled with the ghosts of his past, questioning whether loyalty to those he loved outweighed the truth that needed to be told.",
      "As the investigation unfolded, Ivor realized that the stakes were higher than he had ever anticipated. The honor of his family and their wealth rested on a fragile foundation, and the truth of Beatrice's death could either solidify that legacy or bring it crashing down. Torn between loyalty and integrity, Ivor stood at a crossroads, knowing that the winds of change were about to sweep through his life, and he would have to choose his course wisely."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, the hotel receptionist, was known for her friendly demeanor and eagerness to please, but beneath her bubbly exterior lay a world of unrequited love and jealousy. Her tragic end leaves behind a tangled web of emotions and unresolved feelings.",
    "publicPersona": "Beatrice is friendly and eager to please, often going above and beyond in her job at the hotel.",
    "privateSecret": "Beatrice had a secret crush on the victim and was devastated by her sudden change in behavior.",
    "motiveSeed": "Jealousy arose after discovering the victim was involved with someone else, leading to a confrontation.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the courtyard making a phone call during the murder",
    "accessPlausibility": "easy",
    "stakes": "Her emotional state and job stability are on the line.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Beatrice speaks in a bright, cheerful tone, often using exclamations and eager phrases. She has a tendency to fidget with her hands while speaking, conveying her nervousness and eagerness to please.",
    "signatureTic": "Oh, dear! What a mess!",
    "internalConflict": "Beatrice struggles with feelings of jealousy and inadequacy, unsure of her worth in the eyes of those she admires.",
    "personalStakeInCase": "This crime matters to Beatrice because it reflects her own emotional turmoil and the need to find self-worth beyond her infatuation.",
    "paragraphs": [
      "Beatrice Quill stood in the courtyard, her phone pressed to her ear, the cheerful facade she wore at work slipping as she spoke in hushed tones. Known for her friendliness and eagerness to please, she had always gone above and beyond for the guests at the hotel, but behind her bright smile lay a heart heavy with unrequited love. The sudden change in Beatrice's relationship with the victim had left her reeling, and now, with the news of Beatrice Quill's death, her world felt irrevocably shattered.",
      "In her mind, she replayed the moments leading up to that fateful day, the jealousy that had consumed her when she discovered the victim involved with someone else. 'Oh, dear! What a mess!' she often exclaimed, even to herself, as she wrestled with her emotions. The confrontation they had shared echoed in her mind, a painful reminder of the vulnerability she had tried so hard to hide. The stakes had been high, and now, with Beatrice gone, she was left with a void that felt insurmountable.",
      "As she navigated the hotel’s corridors, Beatrice's bright tone masked the turmoil within her. Each encounter with guests felt like a performance, her eagerness to please a shield against the insecurities that threatened to engulf her. She had always believed that love could conquer all, but with the victim's death, she faced the harsh reality of her own inadequacies. The emotional state she had kept hidden was now on full display, and the world seemed to close in around her.",
      "The investigation into Beatrice's death would force the hotel staff and guests to confront their own feelings of loss and betrayal. For Beatrice, it was not just a matter of job stability; it was a quest for self-worth beyond her infatuation. As the truth began to unravel, she knew that her journey would be fraught with challenges, but perhaps it was time to face the tangled web of emotions she had woven and find a way to heal."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is an ambitious art dealer whose sharp eye for talent masks a web of deception. As the investigation into Beatrice's murder unfolds, Sylvia finds herself caught in a dangerous game of blackmail and ambition, where the stakes are higher than she ever imagined.",
    "publicPersona": "Sylvia is known for her keen eye for art and her connections to wealthy patrons.",
    "privateSecret": "She had been secretly blackmailing the victim over a forgery scandal.",
    "motiveSeed": "Sylvia feared exposure of her dealings and wanted the victim to pay a hefty sum to keep quiet.",
    "motiveStrength": "strong",
    "alibiWindow": "was at a local gallery opening when the murder took place",
    "accessPlausibility": "unlikely",
    "stakes": "Her career and reputation in the art world depend on her secrets remaining hidden.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Sylvia speaks with a polished, confident tone, often using sophisticated vocabulary. Her sentences are laced with sarcasm, and she has a knack for turning compliments into veiled insults.",
    "signatureTic": "Art is subjective, darling.",
    "internalConflict": "Sylvia wrestles with the fear that her ambition has led her down a treacherous path, questioning whether the price of success is worth the risk of exposure.",
    "personalStakeInCase": "This crime matters to Sylvia as it threatens to expose her dark dealings and jeopardize her standing in the art world.",
    "paragraphs": [
      "Sylvia Trent glided through the gallery opening, a vision of elegance and poise. Known for her keen eye for art and connections to wealthy patrons, she had built her career on the perception of sophistication. Yet, beneath the polished exterior lay a treacherous secret—one that tied her to Beatrice Quill in a way that could shatter her carefully crafted image. The murder of the victim had sent shockwaves through her world, and Sylvia felt the walls closing in around her.",
      "She had been blackmailing Beatrice over a forgery scandal, a desperate measure to protect her reputation and financial stability. 'Art is subjective, darling,' she would often quip, masking her insecurities with a veneer of confidence. But now, with Beatrice dead, the stakes had risen dramatically. Fear coursed through her veins; exposure could mean the end of everything she had worked for, a career built on the fragile foundation of deceit.",
      "As the investigation unfolded, Sylvia's charm and wit became her armor against the encroaching threat of discovery. She spoke with a polished tone, each word carefully chosen to deflect suspicion, but the sarcasm that laced her voice betrayed the tension bubbling beneath the surface. She had always prided herself on her ability to navigate the dangerous waters of the art world, but now she found herself caught in a game where the rules had changed, and the consequences were dire.",
      "Sylvia's internal conflict raged as she questioned the price of her ambition. Was it worth sacrificing her integrity for success? As the investigation drew closer to the truth, she felt the weight of her choices bearing down on her. The art world she had once dominated now felt like a cage, and the fear of exposure loomed large. In the end, Sylvia would have to confront the dangerous game she had played and decide whether to continue down the treacherous path or find a way to reclaim her integrity."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a wealthy businessman whose charm masks a ruthless ambition. As the investigation into Beatrice's murder unfolds, he finds himself grappling with the consequences of a shady deal that could bring his empire crashing down.",
    "publicPersona": "Hugo is a charismatic businessman with a public image of generosity and philanthropy.",
    "privateSecret": "He was involved in a shady business deal with the victim, which could ruin him if exposed.",
    "motiveSeed": "Hugo stood to lose a lucrative contract that the victim threatened to reveal.",
    "motiveStrength": "strong",
    "alibiWindow": "was out for a late-night walk by the beach during the murder",
    "accessPlausibility": "possible",
    "stakes": "His wealth and public image are on the line.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Hugo speaks with a smooth, charismatic tone, often punctuating his statements with sardonic humor. He has a flair for the dramatic, using grand gestures and a commanding presence to captivate his audience.",
    "signatureTic": "It’s all about the bottom line.",
    "internalConflict": "Hugo struggles with the fear that his ruthless ambition may lead to his downfall, questioning whether his wealth is worth the cost of his integrity.",
    "personalStakeInCase": "This crime matters to Hugo because it threatens his empire and the carefully crafted image he projects to the world.",
    "paragraphs": [
      "Hugo Vane strolled along the moonlit beach, the waves crashing rhythmically against the shore, a stark contrast to the turmoil brewing within him. As a wealthy businessman, he had always projected an image of charm and philanthropy, yet the shadows of his past dealings loomed large, particularly in the wake of Beatrice Quill's murder. The stakes had never been higher; his empire teetered on the brink of collapse, and the truth could unravel everything he had built.",
      "With a reputation for ruthlessness, Hugo had navigated the cutthroat world of business with a smooth, charismatic demeanor. 'It’s all about the bottom line,' he would often remind his associates, but now, that bottom line threatened to bury him. His involvement in a shady deal with Beatrice was a secret he had worked tirelessly to keep hidden, yet now it felt like a ticking time bomb, ready to explode at any moment.",
      "As the investigation progressed, Hugo's charm began to feel like a mask slipping away. The sardonic humor that had once captivated audiences now felt hollow, and he found himself grappling with the consequences of his ambition. Each question posed by the detective felt like a noose tightening around his neck, and the fear of exposure gnawed at him like an insatiable predator. Hugo had always believed he could outsmart anyone, but this time, the game felt different, the stakes too high.",
      "The murder of Beatrice Quill was not just a tragic event; it was a pivotal moment that could either solidify his empire or bring it crashing down. As he faced the impending storm, Hugo was forced to confront the reality of his choices and the lengths he had gone to maintain his status. In the end, he would have to decide whether to continue down the path of deception or find a way to reclaim his integrity before it was too late."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Tidal Veil Hotel",
    "type": "Hotel",
    "place": "Bournemouth",
    "country": "England",
    "summary": "A vintage seaside hotel with art deco charm, hosting anxious guests amid recent unsettling events.",
    "visualDescription": "The hotel boasts a grand entrance with sweeping staircases, polished marble floors, and intricate glass chandeliers. Narrow corridors lined with period photographs lead to cozy guest rooms, each with sea views, while the lobby is adorned with plush sofas and vibrant floral arrangements.",
    "atmosphere": "A blend of nostalgia and tension hangs in the air, as the echoes of past glamour clash with the present unease.",
    "paragraphs": [
      "The Tidal Veil Hotel, perched high on a coastal bluff in Bournemouth, exudes an air of faded elegance. Its art deco architecture, with curvaceous lines and geometric motifs, tells tales of glamorous summers long past. The grand lobby, with its polished marble floors and sweeping staircases, welcomes guests with an inviting warmth, yet an undercurrent of tension lingers, as whispers of recent events swirl among the visitors.",
      "Narrow corridors branch off from the lobby, each adorned with sepia-toned photographs of the hotel’s history. The dimly lit hallways echo with the muted sounds of footsteps, while the scent of salt air mingles with the faint perfume of aged wood. Guests pass each other with furtive glances, their anxious expressions reflecting the growing unease that has settled over the hotel like a thick fog.",
      "As the ocean crashes against the cliffs below, the sound of waves becomes a constant reminder of nature's power and unpredictability. Outside, the overcast sky threatens rain, casting a pall over the hotel’s vintage charm. Inside, the warmth of the lobby contrasts sharply with the cold draft that slips through the corridors, a reminder of the isolation that comes with this coastal retreat.",
      "Despite the hotel's inviting atmosphere, a sense of foreboding hangs heavy in the air. Staff members move discreetly, their access to the kitchen and maintenance rooms strictly controlled, while guests are confined to designated floors. The emergency exits, monitored and seldom used, add to the feeling of being trapped within the hotel’s walls, a microcosm where secrets lurk just beneath the surface."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates",
    "timeFlow": "Three days of mounting tension as secrets unfold",
    "mood": "tense and suspenseful, as guests are on edge due to recent events",
    "eraMarkers": [
      "art deco architecture",
      "vintage automobiles parked outside",
      "a radio playing in the lobby"
    ],
    "sensoryPalette": {
      "dominant": "tension and nostalgia",
      "secondary": [
        "salt-laden air",
        "the sound of crashing waves"
      ]
    },
    "paragraphs": [
      "The atmosphere within The Tidal Veil Hotel is thick with the scent of salt and dampness, mingling with the lingering aroma of old wood and polished furniture. The overcast sky casts a grey pall over the scene, while the occasional patter of rain against the windows adds a rhythmic tension, echoing the unease among the guests. Each moment stretches, laden with the weight of secrets waiting to be uncovered.",
      "As guests gather in the lobby, the crackle of a radio provides a backdrop of familiar tunes, a stark contrast to the whispers of uncertainty that flit through the air. The sound of distant waves crashing against the cliffs serves as a constant reminder of the isolation that surrounds the hotel, while the warmth from the grand fireplace struggles to dispel the chill creeping in from the coastal winds."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Oceanview Suite",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A lavishly furnished suite with a large bay window overlooking the turbulent sea. The decor features rich fabrics and antique furniture, but the room bears signs of a struggle.",
      "sensoryDetails": {
        "sights": [
          "tattered curtains blowing in the wind",
          "scattered belongings on the floor",
          "a broken vase on the marble table",
          "dark stains on the carpet"
        ],
        "sounds": [
          "howling wind outside",
          "the crash of waves below",
          "distant thunder rumbling",
          "the creak of floorboards"
        ],
        "smells": [
          "salt and damp air",
          "faint whiff of perfume",
          "old leather and varnish",
          "the metallic scent of blood"
        ],
        "tactile": [
          "cold marble underfoot",
          "rough fabric of the armchair",
          "chill from the window",
          "sticky residue on the floor"
        ]
      },
      "accessControl": "Restricted to investigators and hotel staff; guests may not enter without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "water droplets cascading down the window"
          ],
          "sounds": [
            "steady drumming of rain",
            "the distant roar of the ocean"
          ],
          "smells": [
            "fresh rain on stone",
            "mildew and dampness"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "clouds swirling ominously outside"
          ],
          "sounds": [
            "silence punctuated by the wind",
            "the occasional flap of the curtains"
          ],
          "smells": [
            "old wood and varnish",
            "the scent of decay"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting a golden hue",
            "shadows creeping across the room"
          ],
          "sounds": [
            "the distant call of seagulls",
            "the ticking of a clock"
          ],
          "smells": [
            "burning wood from the fireplace",
            "the faint scent of tobacco"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanview Suite, once a symbol of luxury, now stands as a chilling testament to violence. The lavish decor is marred by the remnants of chaos, with belongings strewn about and a broken vase lying shattered on the floor. The bay window, usually a portal to breathtaking vistas, now frames a turbulent sea that mirrors the turmoil within these walls.",
        "As the wind howls outside, the room is filled with an unsettling silence, save for the creaking of the old floorboards and the distant crash of waves. The air is thick with the scent of salt and dampness, mingling with the metallic tang of blood that lingers like a ghost. Investigators tread carefully, aware that every detail could hold the key to unraveling the mystery."
      ]
    },
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious lobby with high ceilings, adorned with chandeliers and plush seating areas. Art deco motifs embellish the walls, creating an inviting yet anxious atmosphere.",
      "sensoryDetails": {
        "sights": [
          "gleaming chandeliers overhead",
          "vibrant floral arrangements",
          "marble flooring reflecting light",
          "guests clustered in small groups"
        ],
        "sounds": [
          "murmurs of conversation",
          "the crackle of a radio",
          "footsteps echoing on the marble",
          "the rustle of newspapers"
        ],
        "smells": [
          "fresh flowers and polish",
          "old books and leather",
          "cigarette smoke lingering",
          "the scent of brewing coffee"
        ],
        "tactile": [
          "smooth marble underfoot",
          "plush upholstery of armchairs",
          "cool metal of the reception desk",
          "the warmth from the fireplace"
        ]
      },
      "accessControl": "Open to all guests; staff-only areas are behind the reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down the glass doors",
            "cloudy light dimming the lobby"
          ],
          "sounds": [
            "heavy rain pattering on the roof",
            "the faint sound of thunder"
          ],
          "smells": [
            "earthy scent of rain",
            "freshly brewed coffee",
            "the aroma of pastries from the kitchen"
          ],
          "mood": "somber yet cozy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows deepening in corners",
            "dim light filtering through windows"
          ],
          "sounds": [
            "the ticking of a clock",
            "occasional laughter from guests"
          ],
          "smells": [
            "dusty air",
            "the scent of old leather"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light from sconces",
            "guests mingling with drinks in hand"
          ],
          "sounds": [
            "clinking glasses",
            "lively conversation"
          ],
          "smells": [
            "the aroma of cocktails",
            "the scent of perfume"
          ],
          "mood": "festive yet anxious"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Tidal Veil Hotel serves as the heart of the establishment, where guests gather to exchange pleasantries and secrets alike. Its high ceilings soar above, adorned with shimmering chandeliers that cast a soft glow over the marble flooring. Plush seating areas invite conversation, yet the atmosphere feels charged, as whispers of the recent crime ripple through the crowd.",
        "As guests cluster in small groups, the sound of murmured conversations blends with the crackle of a radio playing in the background. The scent of fresh flowers mingles with the lingering aroma of cigarettes, creating a heady mix that fills the air. Despite the warmth from the fireplace, an undercurrent of tension persists, making every laughter feel forced and every glance more scrutinizing."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Dining and socializing space",
      "visualDetails": "An elegant dining area with tables set for meals, featuring crystal glassware and fine china. Large windows offer views of the ocean, while the decor reflects the hotel's art deco style.",
      "sensoryDetails": {
        "sights": [
          "elegantly laid tables",
          "glittering glassware",
          "ocean waves crashing outside",
          "soft candlelight flickering"
        ],
        "sounds": [
          "clattering of cutlery",
          "soft murmur of conversations",
          "the distant sound of waves",
          "the pop of a cork being opened"
        ],
        "smells": [
          "savory scents of roasted meats",
          "freshly baked bread",
          "the sweetness of dessert",
          "the aroma of brewed tea"
        ],
        "tactile": [
          "smooth tablecloths",
          "cool metal cutlery",
          "warmth from candle flames",
          "the weight of a glass in hand"
        ]
      },
      "accessControl": "Open during meal times; staff-only areas include the kitchen and pantry.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft light filtering through rain-streaked windows",
            "mist rising from the sea"
          ],
          "sounds": [
            "rain tapping against the roof",
            "the distant sound of thunder"
          ],
          "smells": [
            "the scent of fresh coffee",
            "the aroma of breakfast cooking"
          ],
          "mood": "calm yet subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows on tables",
            "clouds hanging low outside"
          ],
          "sounds": [
            "the low hum of conversation",
            "the clinking of glasses"
          ],
          "smells": [
            "the scent of spices",
            "the aroma of desserts cooling"
          ],
          "mood": "introspective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off glassware",
            "the setting sun casting golden hues"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "the soft strumming of a guitar"
          ],
          "smells": [
            "the scent of roasted meats",
            "the aroma of wine"
          ],
          "mood": "warm and inviting"
        }
      ],
      "paragraphs": [
        "The Dining Room at The Tidal Veil Hotel presents a scene of elegance, with tables meticulously set for the evening meal. Crystal glassware catches the flickering candlelight, while the scent of roasted meats wafts through the air, inviting guests to indulge. Large windows frame the tumultuous ocean outside, mirroring the emotional currents within the room.",
        "As guests settle in, the sounds of clattering cutlery and soft conversations create a symphony of social interaction. Yet, amid the clinking of glasses and the laughter that punctuates the air, a tension simmers just beneath the surface. Unspoken words hang heavy, creating an atmosphere that feels both inviting and fraught with unease."
      ]
    },
    {
      "id": "kitchen",
      "name": "Staff Kitchen",
      "type": "interior",
      "purpose": "Food preparation and staff area",
      "visualDetails": "A bustling kitchen with stainless steel surfaces and large ovens. The walls are lined with shelves of ingredients and utensils, while the air is thick with the scent of cooking.",
      "sensoryDetails": {
        "sights": [
          "steam rising from pots",
          "chefs bustling about",
          "colorful vegetables on counters",
          "shiny metal utensils"
        ],
        "sounds": [
          "clattering pots and pans",
          "the sizzle of food on hot surfaces",
          "voices of staff communicating",
          "the timer beeping"
        ],
        "smells": [
          "the aroma of herbs and spices",
          "freshly baked pastries",
          "the scent of frying onions",
          "the pungent smell of garlic"
        ],
        "tactile": [
          "warmth from the ovens",
          "smoothness of cutting boards",
          "the heft of a chef's knife",
          "the coolness of stainless steel"
        ]
      },
      "accessControl": "Restricted to kitchen staff; no guest access at any time.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked windows steaming up",
            "ingredients being prepped for breakfast"
          ],
          "sounds": [
            "the sound of rain hitting the roof",
            "the bubbling of pots"
          ],
          "smells": [
            "the scent of coffee brewing",
            "the aroma of breakfast cooking"
          ],
          "mood": "busy and industrious"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dull light filtering through windows",
            "staff preparing for dinner service"
          ],
          "sounds": [
            "the clatter of dishes being washed",
            "the sound of chopping"
          ],
          "smells": [
            "the scent of simmering sauces",
            "the aroma of baked goods cooling"
          ],
          "mood": "focused and tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the kitchen aglow with warm light",
            "final preparations for dinner"
          ],
          "sounds": [
            "the sizzle of meat on the grill",
            "the chatter of staff"
          ],
          "smells": [
            "the rich scent of roasted vegetables",
            "the aroma of fresh bread"
          ],
          "mood": "energetic and lively"
        }
      ],
      "paragraphs": [
        "The Staff Kitchen buzzes with activity, a whirlwind of culinary preparation that belies the tension lurking just outside these walls. Chefs move with purpose, their hands deftly chopping vegetables and stirring pots, while steam rises from bubbling sauces. The air is thick with the rich aromas of herbs and spices, creating an inviting yet charged atmosphere.",
        "As the rain patters against the windows, the sounds of clattering pots and sizzling food fill the air, creating a symphony of culinary chaos. Staff members communicate in quick, hushed tones, their eyes darting toward the door as if expecting unwelcome visitors. This bustling kitchen, a heart of nourishment, now bears witness to the undercurrents of anxiety that ripple throughout The Tidal Veil Hotel."
      ]
    }
  ],
  "note": "",
  "cost": 0.00227213085,
  "durationMs": 56614
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1941,
    "month": "July",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "July",
    "weather": [
      "overcast with occasional rain",
      "cool coastal breezes",
      "intermittent fog rolling in from the sea"
    ],
    "daylight": "Long days with sunlight piercing through the clouds, daylight stretching until nine in the evening.",
    "time_of_day_of_crime": "Late evening — between eight and ten o'clock at night, as the last summer light fades.",
    "holidays": [
      "Independence Day (July 4th)"
    ],
    "seasonalActivities": [
      "strolling along the beach",
      "attending outdoor concerts",
      "participating in community fairs"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy blazer",
        "lightweight wool trousers",
        "crisp white dress shirt"
      ],
      "casual": [
        "seersucker shorts",
        "polo shirts",
        "linen button-downs"
      ],
      "accessories": [
        "straw boater hat",
        "leather sandals",
        "silk ties with nautical motifs"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with floral prints",
        "fitted blazer in pastel shades",
        "pearl necklace"
      ],
      "casual": [
        "sleeveless blouse paired with high-waisted shorts",
        "light cotton sundress",
        "capri pants"
      ],
      "accessories": [
        "wide-brimmed sun hat",
        "canvas handbag",
        "colorful silk scarves"
      ]
    },
    "trendsOfTheMoment": [
      "nautical themes in clothing",
      "bright colors reflecting summer",
      "emphasis on tailored silhouettes"
    ],
    "socialExpectations": [
      "men expected to wear suits for evening events",
      "women encouraged to wear hats and gloves in public",
      "casual attire maintained for leisure activities"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Germany's invasion of the Soviet Union begins; tensions escalate across Europe",
      "increased military draft for young men in the U.S.",
      "debates in Congress regarding aid to British forces"
    ],
    "politicalClimate": "Heightened anxieties over global conflicts, with increasing calls for U.S. involvement in WWII.",
    "economicConditions": "Rationing of goods is becoming commonplace; inflation is impacting everyday prices.",
    "socialIssues": [
      "displacement of war refugees",
      "women's roles in the workforce are evolving",
      "racial tensions remain prevalent in various regions"
    ],
    "internationalNews": [
      "British forces face heavy bombing in London",
      "Japanese expansion in the Pacific raises alarms"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's 'In the Mood'",
        "Bing Crosby's 'White Christmas'",
        "Duke Ellington's 'Take the 'A' Train'"
      ],
      "films": [
        "'The Maltese Falcon'",
        "'That Hamilton Woman'",
        "'Sergeant York'"
      ],
      "theater": [
        "Broadway shows featuring wartime themes",
        "musicals celebrating American spirit"
      ],
      "radio": [
        "'The Shadow'",
        "'Amos 'n' Andy'",
        "'Jack Benny Program'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Grapes of Wrath' by John Steinbeck",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Catcher in the Rye' by J.D. Salinger"
      ],
      "popularGenres": [
        "detective fiction",
        "historical novels",
        "war stories"
      ]
    },
    "technology": {
      "recentInventions": [
        "synthesized rubber for military vehicles",
        "improvements in radar technology",
        "early developments in television broadcasting"
      ],
      "commonDevices": [
        "batteries for radios",
        "manual typewriters",
        "film cameras"
      ],
      "emergingTrends": [
        "increased use of radio for news",
        "development of war-related products",
        "growing interest in home entertainment systems"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "A pint of milk: six pence"
      ],
      "commonActivities": [
        "family picnics at the beach",
        "evening strolls along the boardwalk",
        "community dances in local halls"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "neighborhood block parties",
        "weekly visits to the local market"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing class mobility due to wartime jobs",
      "upper class maintaining old social customs"
    ],
    "gender": [
      "women entering the workforce in larger numbers",
      "traditional gender roles challenged by necessity",
      "growing advocacy for women's rights"
    ],
    "race": [
      "African American communities facing segregation",
      "increasing activism for civil rights"
    ],
    "generalNorms": [
      "patriotism at an all-time high",
      "community spirit emphasized through collective wartime efforts",
      "high value placed on family and home"
    ]
  },
  "atmosphericDetails": [
    "The scent of saltwater mingling with damp earth as rain occasionally patters on the hotel windows.",
    "Soft whispers of conversation and the clinking of glasses punctuating the tense atmosphere in the dimly lit lobby.",
    "The distant sound of a radio playing a popular tune, underscoring the emotional weight of the moment as guests navigate their fears."
  ],
  "paragraphs": [
    "In July 1941, the coastal hotel bustled with weary travelers, each carrying the weight of the world outside its doors. Overcast skies loomed, threatening rain, while the cool sea breeze offered a temporary respite from the summer heat. Long days persisted, but the mood was thick with tension, as whispers of war echoed in the halls, and guests exchanged glances fraught with unspoken concerns. The recent Independence Day celebrations felt distant, overshadowed by global unrest and the shadows of conflict creeping ever closer to home.",
    "Fashion in this summer of 1941 reflected a blend of practicality and the lingering elegance of a pre-war era. Men donned lightweight wool trousers paired with crisp white shirts, while tailored navy blazers offered a nod to the nautical themes favored by many. Women embraced bright cotton sundresses with floral prints, accessorized with wide-brimmed sun hats and silk scarves, all designed to evoke a sense of summer cheer amid the uncertainty. The streets buzzed with life, as people strolled along the beach, their attire a testament to the resilience of the spirit in the face of adversity.",
    "Daily life revolved around community and shared experiences, even as the specter of war loomed large. Families gathered for picnics on the beach, savoring simple pleasures such as freshly baked bread and cold milk, both rationed but still cherished. Sunday dinners became sacred rituals, while block parties filled the streets with laughter and music, echoing the hopeful spirit of the people. Yet, beneath the surface, social expectations shifted; women stepped confidently into roles traditionally held by men, their contributions to the workforce celebrated but also scrutinized. In this charged atmosphere, every interaction carried weight, every glance held potential for intrigue, as the undercurrents of a world changing irrevocably seeped into the very fabric of daily existence."
  ],
  "note": "",
  "cost": 0.00106378635,
  "durationMs": 17535
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of hotel guests and staff are trapped together during a storm, their secrets and tensions rising as they navigate the anxieties of post-war society and the looming threat of a mysterious death.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has led to shifting gender roles and increased workforce participation, creating a backdrop of social tension and competition among the upper class and service staff."
  },
  "setting": {
    "location": "A seaside hotel with art deco architecture",
    "institution": "Hotel",
    "weather": "overcast with occasional rain"
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
    "id": "victim_drink_acidity",
    "value": "five",
    "description": "The victim's drink had a pH level of five."
  },
  {
    "id": "time_of_death",
    "value": "ten minutes past nine",
    "description": "The victim died at ten minutes past nine in the evening."
  },
  {
    "id": "poison_dose_weight",
    "value": "two ounces",
    "description": "The amount of poison used was two ounces."
  },
  {
    "id": "time_of_poisoning",
    "value": "three hours before death",
    "description": "The poison was administered three hours before the victim's death."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 5,
    "mid": 11,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 16,
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
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "behavioral"
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
      "id": "clue_fp_elimination_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_fp_elimination_hugo_vane",
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
      "id": "clue_culprit_direct_dr_mallory_finch",
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
      "id": "clue_fp_contradiction_step_2",
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
