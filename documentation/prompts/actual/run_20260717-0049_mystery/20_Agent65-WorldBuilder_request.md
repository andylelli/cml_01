# Actual Prompt Record

- Run ID: `mystery-1784249352400`
- Project ID: ``
- Timestamp: `2026-07-17T00:54:04.012Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `8ff32db9de66a974`

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
    "title": "Whispers of the Tide",
    "author": "Agent 8",
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
  "death_method": "poisoned with a rare toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "A sharp-witted investigator known for her keen insights.",
      "private_secret": "She struggles with self-doubt despite her successes.",
      "motive_seed": "Determined to prove her capabilities in a male-dominated field.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel staff",
        "guest interactions"
      ],
      "behavioral_tells": [
        "observant",
        "intuitive"
      ],
      "stakes": "Her reputation as a competent investigator.",
      "evidence_sensitivity": [
        "keenly aware of details"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "expert",
      "relationships": [],
      "public_persona": "A respected physician attending the gala.",
      "private_secret": "She is conducting secret research on toxic substances.",
      "motive_seed": "Protecting her research from scrutiny.",
      "motive_strength": "moderate",
      "alibi_window": "during the dinner",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "access to medical supplies"
      ],
      "behavioral_tells": [
        "nervous when discussing her work"
      ],
      "stakes": "Her professional integrity and future in medicine.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "authority figure",
      "relationships": [],
      "public_persona": "A retired naval captain, known for his charm.",
      "private_secret": "He has a dark past involving smuggling.",
      "motive_seed": "Fear of exposure regarding his past.",
      "motive_strength": "strong",
      "alibi_window": "during the toast",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel access",
        "naval contacts"
      ],
      "behavioral_tells": [
        "overly jovial during tense moments"
      ],
      "stakes": "His reputation and freedom.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "witness",
      "relationships": [],
      "public_persona": "A young artist, eager to impress.",
      "private_secret": "She had a past romantic interest in the victim.",
      "motive_seed": "Jealousy over the victim's new relationship.",
      "motive_strength": "moderate",
      "alibi_window": "during the gala",
      "access_plausibility": "low",
      "opportunity_channels": [
        "guest interactions"
      ],
      "behavioral_tells": [
        "anxious when discussing the victim"
      ],
      "stakes": "Her artistic career and personal reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "A wealthy socialite with a keen interest in toxicology.",
      "private_secret": "She is financially dependent on her social status.",
      "motive_seed": "Desperation to maintain her lifestyle.",
      "motive_strength": "strong",
      "alibi_window": "during the dinner",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel staff",
        "social connections"
      ],
      "behavioral_tells": [
        "dismissive towards the victim"
      ],
      "stakes": "Her wealth and social standing.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A successful businessman with a charming demeanor.",
      "private_secret": "He had many enemies due to shady business dealings.",
      "motive_seed": "N/A",
      "motive_strength": "none",
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
      "summary": "During a charity gala at a seaside hotel, Hugo Vane collapses and dies unexpectedly. Detective Eleanor Voss must unravel the mystery behind his death, discovering a web of deceit, jealousy, and hidden motives driven by the social dynamics of post-war society."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A rare toxin that only becomes lethal when mixed with a specific beverage served during the gala, exploiting the victim's rising body temperature to mask the timing of administration.",
      "delivery_path": [
        {
          "step": "The toxin is mixed into Hugo's drink at the bar."
        },
        {
          "step": "The toxin remains inactive until the drink is warmed by Hugo's body heat."
        }
      ]
    },
    "outcome": {
      "result": "Hugo dies from the delayed effects of the poison, leading to confusion about the timing of the administration."
    }
  },
  "false_assumption": {
    "statement": "Hugo Vane died from natural causes due to his known health issues.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses observed Hugo looking unwell before dinner, and his prior health history was common knowledge.",
    "what_it_hides": "The true cause of death was homicide by delayed-action poison."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "As a physician, she had access to various poisons and knowledge of their effects.",
      "Witnesses recalled her being in the vicinity during the critical moments."
    ],
    "the_one_flaw": "Dr. Finch was attending to another guest who was ill at the time of the murder, with multiple witnesses confirming her alibi.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Dr. Finch's constant presence near the victim.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "She was attending to another guest who required medical assistance.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Captain Hale's strange behavior during the toast.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was simply nervous about speaking in public.",
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
    "rationale": "All suspects were present at the gala, and no one else had access to the victim prior to his collapse."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The gala's start time at seven o'clock.",
        "The victim's last seen time at eight fifteen."
      ],
      "windows": [
        "The victim was served his last drink at eight thirty.",
        "The victim collapsed at eight forty-five."
      ],
      "contradictions": [
        "Witnesses claim Hugo was unwell before dinner, contradicting his sudden collapse."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Sylvia Trent",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The bar where drinks were prepared.",
        "The victim's drink."
      ],
      "permissions": [
        "Staff access to the bar.",
        "Doctor's access to medical supplies."
      ]
    },
    "physical": {
      "laws": [
        "The toxin requires specific temperature conditions to become lethal.",
        "The drink must be consumed within a certain time frame to be effective."
      ],
      "traces": [
        "The presence of the toxin can be detected in the victim's blood after death."
      ]
    },
    "social": {
      "trust_channels": [
        "Social dynamics of post-war society.",
        "Professional respect for doctors."
      ],
      "authority_sources": [
        "The hotel management's authority over staff access.",
        "Social status influencing witness perceptions."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The bar staff recalled mixing a special cocktail for Hugo just before dinner.",
        "correction": "This indicates the poison could have been added to this drink.",
        "effect": "Narrows opportunity to Dr. Mallory Finch and Sylvia Trent.",
        "required_evidence": [
          "The drink mixing log from the bar.",
          "Witness statements about the cocktail preparation."
        ],
        "reader_observable": true
      },
      {
        "observation": "The toxicology report shows the toxin only becomes lethal when warmed.",
        "correction": "This means the timing of consumption is crucial to the murder.",
        "effect": "Eliminates the possibility of natural causes.",
        "required_evidence": [
          "Toxicology report findings.",
          "Temperature requirements for the toxin's activation."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses state that Sylvia was seen near the bar shortly before Hugo's last drink.",
        "correction": "Her proximity to the bar during the critical time raises suspicions.",
        "effect": "Narrows opportunity to Sylvia Trent.",
        "required_evidence": [
          "Witness statements about Sylvia's whereabouts.",
          "The timeline of events from dinner to collapse."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares drink, temperature, and staff against the claimed timeline.",
    "knowledge_revealed": "The specific temperature at which the toxin becomes lethal is confirmed through testing.",
    "pass_condition": "If Sylvia is unable to replicate the safe drinking conditions, it confirms her knowledge of the poison's properties.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_2",
      "clue_culprit_direct_1",
      "clue_id_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The cocktail preparation log and witness statements point to the possibility of tampering. Step 2: The toxicology report confirms the toxin's activation conditions, eliminating natural causes. Step 3: Witness statements about Sylvia's presence tighten the suspect pool to her."
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
      "test_type": "temperature reaction test"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi with witnesses about her attending to another guest.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm he was busy at the toast during the incident.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness accounts confirm she was seated away from the victim.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
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
      "revelation_method": "Confrontation with evidence linking Sylvia to the poison."
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
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_sylvia_trent",
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
        "clue_id": "clue_id_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_id_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Toxicology report"
      },
      {
        "clue_id": "clue_id_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
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
        "clue_id": "clue_fp_elimination_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_id_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A charming art gallery owner with a keen eye for detail, Eleanor Voss finds herself drawn into a web of intrigue as she investigates the murder of a community member.",
    "publicPersona": "Charming and cultured, Eleanor is a well-respected figure in the local art scene.",
    "privateSecret": "She is struggling with debt due to an art investment gone wrong.",
    "motiveSeed": "Has an eye for detail and a network of contacts that could provide insights into the crime.",
    "motiveStrength": "moderate",
    "alibiWindow": "Present at the hotel for a gallery event; saw the victim earlier.",
    "accessPlausibility": "easy",
    "stakes": "Her reputation in the community depends on solving the case.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with an articulate cadence, often layering her observations with subtle irony. She enjoys using art-related metaphors to express her thoughts.",
    "signatureTic": "Ah, the brush strokes of life are often the most telling.",
    "internalConflict": "Eleanor grapples with the fear that her financial troubles might be exposed, tarnishing her carefully curated image.",
    "personalStakeInCase": "Eleanor's reputation as a cultured and astute art dealer is at stake, compelling her to solve the murder to restore her standing.",
    "paragraphs": [
      "Eleanor Voss is a woman who has mastered the art of deception, though not for nefarious purposes. With a smile that can disarm even the most cynical of critics, she operates a thriving art gallery in the heart of the seaside town. Yet beneath her polished exterior lies a tangled web of financial distress, stemming from a disastrous investment that threatens to unravel her life. She navigates the local art scene with grace, but her charm is a veneer hiding the pressure of mounting debts, each day a brushstroke in a portrait of desperation.",
      "When the news of Hugo Vane's murder reaches her, Eleanor feels an unsettling mix of shock and intrigue. She had seen him just hours before, his sharp wit and insightful comments about her latest exhibit still echoing in her ears. The murder, occurring within the very walls of the hotel hosting her gallery event, pulls her into a vortex of suspicion and secrets. Eleanor's natural curiosity compels her to investigate, not only to uncover the truth but to protect her reputation, which is intricately tied to her ability to navigate the social currents of her community.",
      "Eleanor's network of contacts, cultivated through years of mingling with artists and patrons, proves invaluable. She approaches her investigation with the same meticulous attention she gives to curating her gallery, dissecting conversations and piecing together fragments of information. However, as she delves deeper, the stakes become painfully clear: if her financial woes come to light, her credibility—and her gallery—may crumble. The irony is not lost on her; the very skills that once ensured her success now threaten to expose her vulnerabilities.",
      "As she interacts with other suspects, Eleanor's dry wit surfaces, often providing a moment of levity in an otherwise tense atmosphere. Her ability to weave humor into her observations allows her to probe others without raising their defenses. Yet, beneath her clever quips lies a woman grappling with the fear of failure. Can she maintain her carefully curated image while unearthing the truth? With each clue she uncovers, the line between her professional aspirations and personal demons blurs, forcing Eleanor to confront the shadows of her own life."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A dedicated physician with a hidden agenda, Dr. Mallory Finch's ambition threatens to unravel as she becomes embroiled in a murder investigation.",
    "publicPersona": "A dedicated doctor known for her compassionate care.",
    "privateSecret": "She has been embezzling funds from her practice to finance a failing investment in a local business.",
    "motiveSeed": "Would lose her practice's reputation if the victim exposed her financial activities.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been seeing patients during the time of the murder, but it's unverified.",
    "accessPlausibility": "possible",
    "stakes": "Her career and freedom are on the line.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory speaks in a precise, clinical manner, often using medical terminology even in casual conversations. Her tone is serious, reflecting the weight of her responsibilities as a physician.",
    "signatureTic": "We must consider the prognosis carefully.",
    "internalConflict": "Mallory is torn between her ambition to succeed and the fear of being exposed for her unethical actions.",
    "personalStakeInCase": "The murder investigation threatens to expose her embezzlement, jeopardizing her career and her freedom.",
    "paragraphs": [
      "Dr. Mallory Finch carries herself with the air of someone who has dedicated her life to the healing arts. Her patients trust her, and her colleagues respect her, but beneath this facade lies a precarious balance of ambition and desperation. The financial instability of her practice, exacerbated by her reckless investments, has led her to embezzle funds—an act that weighs heavily on her conscience, even as it fuels her aspirations. Mallory is acutely aware that the murder of Hugo Vane could unravel the threads of her carefully constructed life.",
      "When the news of the murder reaches her, Mallory is caught off guard. She had been in the midst of patient consultations, but the looming specter of Vane's potential revelations about her financial misdeeds fills her with dread. The stakes have never been higher; if her involvement comes to light, not only will her career be in jeopardy, but her freedom could be at risk as well. In this moment, her ambition feels like a double-edged sword, promising success but threatening to cut deep.",
      "As she navigates the investigation, Mallory's clinical demeanor remains intact, though inside she is a tempest of anxiety and guilt. Her alibi—seeing patients—feels tenuous, and she knows that the truth could surface at any moment. Every interaction with fellow suspects is fraught with tension; she must tread carefully, masking her fear behind a veneer of professionalism. The irony of her situation is not lost on her; a healer now entangled in a web of deception, her own life hanging in the balance.",
      "Mallory's journey through this investigation forces her to confront her moral failings head-on. Each clue that emerges from the shadows brings her closer to the truth, but it also compels her to reflect on the choices she has made. As the investigation unfolds, the lines between right and wrong blur, and she finds herself wrestling with the consequences of her actions. In a world where the stakes are life and death, can she reconcile her ambition with the ethical obligations of her profession?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Once a decorated naval officer, Captain Ivor Hale now grapples with the ghosts of his past as he faces suspicion in a murder case.",
    "publicPersona": "Once a decorated hero, now a bitter man embittered by the war's aftermath.",
    "privateSecret": "He has been hiding a scandal involving the victim's family that could tarnish his own legacy.",
    "motiveSeed": "Fears that the victim might expose his involvement in a wartime incident.",
    "motiveStrength": "compelling",
    "alibiWindow": "Was reportedly alone in his room arguing over the phone during the murder.",
    "accessPlausibility": "possible",
    "stakes": "His past dishonor could resurface, ruining his reputation.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor's speech is gruff and punctuated by a sense of resignation. He often reflects on his past with a sardonic edge, using humor to deflect from his inner turmoil.",
    "signatureTic": "Ah, the sea teaches you to weather storms, but not all storms are external.",
    "internalConflict": "Ivor struggles with the burden of his past decisions and the fear that they will come back to haunt him.",
    "personalStakeInCase": "The murder investigation threatens to expose his wartime actions, risking his hard-won reputation.",
    "paragraphs": [
      "Captain Ivor Hale stands as a monument to a bygone era, a once-decorated naval officer now weathered by the trials of life. The war left its mark on him, not just in the form of scars, but in a bitterness that seeps into his every interaction. He carries the weight of a past scandal involving the victim's family—a secret that, if unearthed, could shatter his already tenuous grip on respectability. Ivor's public persona is that of a hero, but internally he grapples with the ghosts of his decisions, haunted by the specters of honor and dishonor.",
      "When Hugo Vane is murdered, Ivor's world tilts dangerously. He fears the implications of Vane's death may bring to light his own wartime indiscretions, a truth he has carefully hidden beneath layers of bravado. Alone in his hotel room during the murder, he was caught in a heated argument over the phone, a detail that could easily become a liability. The irony of his situation gnaws at him: a man once celebrated for his bravery now stands at the precipice of disgrace, with the shadows of his past closing in.",
      "As the investigation unfolds, Ivor's self-deprecating humor surfaces, often as a shield against the scrutiny he faces. He reflects on his past with a sardonic edge, using wit to mask the pain of regret. Yet, the stakes are high; the truth could unravel the carefully constructed narrative of his life. Each encounter with the other suspects is a dance on a razor's edge, as he attempts to navigate their suspicions while harboring his own fears.",
      "Ivor's journey through this dark labyrinth forces him to confront the consequences of his past actions. Each revelation brings him closer to a reckoning, challenging him to reconcile the man he was with the man he has become. In a world rife with betrayal and secrets, can he find redemption, or will his past continue to haunt him, like a ghost ship lost at sea?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A glamorous socialite with cunning ambitions, Beatrice Quill plays a dangerous game as she navigates the treacherous waters of murder and intrigue.",
    "publicPersona": "Glamorous and charming, Beatrice is the life of the party.",
    "privateSecret": "She is manipulating various relationships for personal gain, digging into hidden family secrets.",
    "motiveSeed": "Aims to secure a favorable marriage by removing the victim, who posed a threat to her ambitions.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been speaking with friends in the lobby, but no one can recall specific details.",
    "accessPlausibility": "easy",
    "stakes": "Her social ambitions and family reputation are at stake.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an air of theatricality, often embellishing her stories with dramatic flair. She enjoys playful banter and has a penchant for pointed remarks that reveal her sharp wit.",
    "signatureTic": "Oh darling, life is but a stage, and we all play our parts.",
    "internalConflict": "Beatrice struggles with the conflict between her ambitions and the moral implications of her manipulative actions.",
    "personalStakeInCase": "The murder investigation threatens her social standing and the potential marriage she has been orchestrating.",
    "paragraphs": [
      "Beatrice Quill glides through the hotel like a shimmering mirage, a glamorous socialite with a knack for captivating her audience. Her laughter fills the air, a siren's call that draws attention and admiration. Yet, beneath the surface of her charm lies a calculated ambition, one that drives her to manipulate relationships with the precision of an artist wielding a brush. The murder of Hugo Vane disrupts her carefully curated world, forcing her to confront the consequences of her actions in a society that prizes reputation above all.",
      "When whispers of Vane's death ripple through the hotel, Beatrice's mind races, calculating the implications for her social aspirations. She had seen him as an obstacle, a threat to the advantageous marriage she was orchestrating. The irony of her situation is not lost on her; she had played a dangerous game, and now the stakes were higher than she had ever anticipated. The murder investigation could expose her manipulations, threatening to unravel the very fabric of the life she has painstakingly woven.",
      "As she interacts with the other suspects, Beatrice's polite savagery shines through. Her playful banter is laced with pointed remarks, each one a delicate dance around the truth. She knows how to wield her words like weapons, charming yet incisive. However, as the investigation deepens, Beatrice finds herself grappling with the moral implications of her ambitions. The thrill of manipulation is intoxicating, but at what cost? The line between ambition and ethics blurs, leaving her to question whether her desires are worth the potential fallout.",
      "Beatrice's journey through this dark narrative forces her to confront the woman she has become. Each clue unearthed reveals not just the secrets of others, but the hidden depths of her own soul. Can she navigate the treacherous waters of ambition without losing herself in the process? In a world where every relationship is a transaction, Beatrice must decide whether to continue playing her part or to risk everything for a chance at genuine connection."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A steadfast hotel manager, Sylvia Trent finds her personal and professional lives colliding in the wake of a murder investigation.",
    "publicPersona": "A reliable and dedicated manager known for her strict rules.",
    "privateSecret": "She is in an affair with someone tied to the victim, complicating her life.",
    "motiveSeed": "Wants to keep her affair hidden, fearing exposure could cost her job.",
    "motiveStrength": "moderate",
    "alibiWindow": "Busy managing the hotel events, but could have stepped away briefly.",
    "accessPlausibility": "easy",
    "stakes": "Her career and personal life depend on keeping her secrets safe.",
    "humourStyle": "deadpan",
    "humourLevel": 0.3,
    "speechMannerisms": "Sylvia speaks in a no-nonsense tone, often delivering her thoughts with a straightforward clarity. She avoids embellishments, preferring to get to the point without unnecessary elaboration.",
    "signatureTic": "Rules are rules, and I intend to follow them.",
    "internalConflict": "Sylvia struggles with the tension between her professional responsibilities and her personal desires, fearing the fallout of her choices.",
    "personalStakeInCase": "The murder investigation threatens to expose her affair, jeopardizing her career and her reputation.",
    "paragraphs": [
      "Sylvia Trent runs the hotel with an iron fist, her reputation as a steadfast manager built on years of dedication and unwavering commitment to her duties. She is known for her strict adherence to rules, ensuring that every event runs like a well-oiled machine. However, beneath her composed exterior lies a tumultuous personal life, one that is complicated by a secret affair with someone connected to the victim. The murder of Hugo Vane sends shockwaves through her carefully controlled world, forcing her to confront the precarious balance she has struck between her professional and personal lives.",
      "When news of the murder reaches her, Sylvia's mind races, calculating the potential fallout. Her affair, a source of both joy and guilt, now hangs in the balance. The irony of her situation is palpable; the very rules she has enforced could become her undoing. She is busy managing hotel events during the time of the murder, but the possibility of having stepped away briefly looms over her like a dark cloud. The stakes are high; exposure could cost her not only her job but also her dignity.",
      "As the investigation unfolds, Sylvia's deadpan demeanor remains intact, even as the tension in the hotel escalates. She speaks with a straightforward clarity, often cutting through the chaos with her no-nonsense attitude. However, internally, she wrestles with the fear of being discovered. Each interaction with fellow suspects is fraught with the potential for revelation, and she must navigate their inquiries with care, all while maintaining her composure.",
      "Sylvia's journey through this dark narrative forces her to confront the choices she has made. Each clue that emerges threatens to unravel the threads of her carefully curated life. Can she protect her career while grappling with the personal desires that complicate her existence? In a world where rules govern behavior, Sylvia must decide whether to uphold her principles or to risk everything for the sake of her heart."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "An acclaimed mystery writer whose life is cut short, Hugo Vane's secrets and blackmail schemes create a tangled web of motives among those he left behind.",
    "publicPersona": "An acclaimed mystery writer, known for his sharp wit and insight into human nature.",
    "privateSecret": "He was blackmailing several prominent members of the community, including some at the hotel.",
    "motiveSeed": "inheritance",
    "motiveStrength": "moderate",
    "alibiWindow": "evening",
    "accessPlausibility": "possible",
    "stakes": "reputation",
    "characterArcPotential": "discovers hidden resolve",
    "paragraphs": [
      "Hugo Vane was the kind of man who could charm a room with his wit and insight, his presence a magnetic force that drew admirers and critics alike. An acclaimed mystery writer, he had a knack for exposing the darkest corners of human nature, all while maintaining an air of playful detachment. Yet, behind his charming facade lay a tangled web of secrets, the most dangerous of which was his involvement in blackmailing several prominent members of the community, including those residing in the very hotel where he met his untimely end.",
      "When the news of his murder spreads, the shockwaves ripple through the town like a sudden storm. Hugo had been a fixture in their lives, his sharp observations often cutting through the mundane to reveal hidden truths. The irony is striking: a man who made a living from uncovering secrets now lies dead, his own life a mystery that begs to be solved. The potential motives for his murder are as varied as the characters in his novels, each suspect holding a piece of the puzzle that could lead to the truth.",
      "As the investigation unfolds, whispers of Hugo's blackmail schemes circulate among the suspects, casting a shadow over his legacy. The stakes are high; his reputation as a writer is now intertwined with the murky waters of deceit and betrayal. Each suspect has their own reasons for wanting him silenced, and the truth becomes increasingly elusive. In life, Hugo was adept at navigating the complexities of human interaction; in death, he has become a catalyst for revealing the very nature of those he left behind.",
      "Hugo's story is not just one of intrigue but of hidden resolve. As the investigation progresses, the layers of his character are peeled back, revealing a man who understood the consequences of his actions. The irony of his fate is not lost on those left to grapple with the aftermath; in seeking to expose others, he ultimately exposed himself. The legacy of Hugo Vane is one of complexity, leaving behind a trail of questions that will linger long after the answers have been unearthed."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Ocean's Whisper Hotel",
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand Art Deco hotel perched on the cliffs of Brighton, overlooking the tumultuous sea, where secrets linger in every shadow.",
    "visualDescription": "The hotel boasts sweeping curves and geometric patterns, with chrome accents glinting under the muted coastal light. A grand lobby with plush furnishings invites guests, while narrow hallways lead to secluded rooms, some with ocean views.",
    "atmosphere": "A blend of elegance and tension, reflecting the post-war unease and the whispers of the tide.",
    "paragraphs": [
      "The Ocean's Whisper Hotel stands defiantly against the crashing waves of the English Channel, its Art Deco facade a striking silhouette against the gray sky. Guests arrive with a sense of anticipation, greeted by the opulence of the lobby, where polished marble floors and gilded moldings evoke a bygone era. Yet, despite its grandeur, there is a palpable tension in the air, a feeling that not all is as serene as it seems.",
      "As the wind howls outside, rattling the windows, the sound of distant thunder rolls across the horizon, echoing the uncertainty of the times. Guests huddle around the radio in the lobby, listening to news bulletins that speak of unrest across the globe. The faint smell of salt and dampness seeps into the hotel, mingling with the scent of fresh coffee and pastries, creating an intoxicating yet unsettling atmosphere.",
      "With restricted access to certain floors and a watchful staff, the hotel possesses an air of secrecy. Narrow hallways twist and turn, leading to rooms where whispers can be heard through closed doors. The balconies overlooking the sea provide a breathtaking view, but also a sense of isolation, as waves crash against the cliffs below, mirroring the turmoil within the guests themselves."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of coastal climates in the fall",
    "timeFlow": "Three days of mounting tension and hidden truths",
    "mood": "Tense and suspenseful, reflecting the undercurrents of post-war anxiety",
    "eraMarkers": [
      "Early radio broadcasts filling the lobby",
      "Military-grade radar equipment in the vicinity",
      "Rationed wartime vehicles parked outside"
    ],
    "sensoryPalette": {
      "dominant": "Salty sea breeze and damp stone",
      "secondary": [
        "Faint scent of coffee and pastries",
        "Distant echoes of thunder"
      ]
    },
    "paragraphs": [
      "The hotel, with its Art Deco charm, stands as a sentinel against the relentless tide, embodying both beauty and a sense of foreboding. The air is thick with the smell of the ocean, mingled with the scent of old wood and fresh linen, creating a dichotomy of comfort and unease. Shadows dance in the corners of the lobby, hiding secrets that beg to be uncovered.",
      "Inside, the atmosphere shifts as guests move through the narrow hallways, their footsteps muffled by plush carpets. Conversations are hushed, punctuated by the occasional crackle of the radio, reminding everyone of the world outside. The hotel may be a refuge, but it is also a place where hidden motives and whispered lies lurk beneath the surface."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Clifftop Balcony",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A crumbling stone balcony overlooking the turbulent sea, surrounded by wrought iron railings.",
      "sensoryDetails": {
        "sights": [
          "crashing waves below",
          "dark clouds hanging low",
          "seagulls wheeling overhead",
          "faded floral patterns on the railing"
        ],
        "sounds": [
          "roaring surf",
          "howling wind",
          "distant thunder",
          "the creak of old iron"
        ],
        "smells": [
          "fresh sea salt",
          "wet stone",
          "damp foliage",
          "faint whiff of mildew"
        ],
        "tactile": [
          "cold iron railing",
          "rough stone underfoot",
          "chill of the sea breeze",
          "wetness of rain on skin"
        ]
      },
      "accessControl": "Restricted access; only guests with special permissions allowed; staff monitors closely.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "glossy stones glistening",
            "dripping foliage",
            "grey mist over the sea"
          ],
          "sounds": [
            "steady patter of rain",
            "distant crashing waves",
            "soft rustle of leaves"
          ],
          "smells": [
            "damp earth",
            "fresh rain",
            "overripe fruit"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "shadowy figures on the beach"
          ],
          "sounds": [
            "the wind's mournful wail",
            "the distant sound of a foghorn"
          ],
          "smells": [
            "cold stone",
            "wet wood",
            "seaweed"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "fiery sunset on the horizon",
            "silhouettes of seagulls against the sky"
          ],
          "sounds": [
            "gentle lapping of waves",
            "whispers of guests nearby"
          ],
          "smells": [
            "tobacco smoke",
            "grilled seafood from nearby stalls",
            "faint scent of jasmine"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Clifftop Balcony juts out precariously over the churning sea, a place where secrets may be whispered and shadows concealed. Its wrought iron railings, though sturdy, seem to shiver under the weight of the stormy sky. The air is filled with the scent of salt and dampness, a reminder of the relentless ocean that lies just below. It is here that fate intertwines with mystery, where the final moments of a life may have played out against the backdrop of crashing waves.",
        "In the afternoon, the balcony is shrouded in an oppressive gloom, the air thick with anticipation. The distant echoes of thunder rumble ominously, as if nature itself is warning of the storm to come. Guests, unaware of the dark events that have unfolded, walk past, their conversations hushed as they steal glances at the turbulent waters. The balcony, once a place of beauty, has become a stage for secrets too heavy to bear."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious lobby with high ceilings, adorned with Art Deco chandeliers and plush seating areas.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "gilded moldings",
          "large potted palms",
          "artistic murals on the walls"
        ],
        "sounds": [
          "murmurs of conversation",
          "clinking of cups",
          "the crackle of radio broadcasts",
          "footsteps on marble"
        ],
        "smells": [
          "fresh coffee brewing",
          "scent of polished wood",
          "light floral arrangements",
          "hint of cigarette smoke"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft upholstery of chairs",
          "warmth from the fireplace",
          "cool air from open windows"
        ]
      },
      "accessControl": "Open to all guests; monitored by staff for unauthorized access to restricted areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down windows",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady dripping from the awning",
            "soft whispers of guests"
          ],
          "smells": [
            "dampness in the air",
            "freshly baked pastries",
            "hint of wet stone"
          ],
          "mood": "cozy yet tense"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows flickering across the floor",
            "dim light from sconces"
          ],
          "sounds": [
            "the distant ticking of a clock",
            "low murmurs rising and falling"
          ],
          "smells": [
            "beeswax from candles",
            "dust motes in the air",
            "scent of old books"
          ],
          "mood": "suspenseful stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from the chandeliers",
            "guests mingling in evening attire"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "soft jazz music playing"
          ],
          "smells": [
            "rich scent of whiskey",
            "smoky aroma from cigars",
            "freshly polished wood"
          ],
          "mood": "elegant anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby is a bustling hub of activity, where guests gather to exchange stories and secrets. The air is filled with the rich aroma of coffee and pastries, enticing newcomers as they step through the door. Art Deco chandeliers cast a warm glow over the marble floors, while the sound of laughter and conversation creates a lively atmosphere. Yet, beneath the surface of conviviality, an undercurrent of tension lingers, as if every guest is guarding a hidden truth.",
        "As the day progresses, the lobby shifts from bright and inviting to a place of hushed whispers and knowing glances. The overcast sky casts shadows within, amplifying the mystery that pervades the hotel. Guests lean in closer, sharing tales of the sea and the strange occurrences that have plagued the area, their voices barely above a whisper, as if afraid to disturb the secrets that the waves hold."
      ]
    },
    {
      "id": "library",
      "name": "The Seaside Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A cozy, book-lined room with large windows that overlook the sea, filled with vintage furniture and warm lighting.",
      "sensoryDetails": {
        "sights": [
          "faded armchairs by the windows",
          "sea-themed artwork on the walls",
          "soft glow from table lamps"
        ],
        "sounds": [
          "pages turning softly",
          "distant sound of waves",
          "the crack of a fire in the hearth",
          "occasional gusts of wind"
        ],
        "smells": [
          "old paper and leather",
          "wood smoke from the fireplace",
          "hint of salt in the air",
          "freshly brewed tea"
        ],
        "tactile": [
          "smooth pages of books",
          "soft fabric of armchairs",
          "warmth from the fire",
          "cool breeze from the window"
        ]
      },
      "accessControl": "Access restricted to guests with library privileges; unlocked during specific hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through rain-soaked windows",
            "water droplets tracing paths down the glass"
          ],
          "sounds": [
            "steady rain against the glass",
            "soft crackling of the fire"
          ],
          "smells": [
            "damp paper",
            "freshly baked scones",
            "earthy scent of wet wood"
          ],
          "mood": "introspective and quiet"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "books stacked haphazardly on tables"
          ],
          "sounds": [
            "the ticking of a clock",
            "soft whispers of pages turning"
          ],
          "smells": [
            "dust mingling with old leather",
            "hint of lavender from potpourri",
            "scent of rain on dry ground"
          ],
          "mood": "suspenseful anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light streaming through the windows",
            "shadows stretching across the floor"
          ],
          "sounds": [
            "the crackle of the fire",
            "soft murmurs of guests"
          ],
          "smells": [
            "freshly brewed coffee",
            "light scent of cigar smoke",
            "the musty aroma of old books"
          ],
          "mood": "thoughtful reflection"
        }
      ],
      "paragraphs": [
        "The Seaside Library offers a refuge from the storm outside, its walls lined with books that hold tales of adventure and intrigue. Guests often find solace here, curling up in faded armchairs with a hot cup of tea. The warm glow of table lamps illuminates the pages, casting flickering shadows that seem to dance with the whispers of the sea. Yet, the library holds more than just stories; it is a treasure trove of secrets waiting to be uncovered.",
        "As the afternoon light fades, the atmosphere shifts, and the library becomes a place of hushed conversations and furtive glances. The sound of rain pattering against the windows adds to the tension, as guests pore over old volumes, searching for clues that may unravel the mysteries lurking in the hotel. The scent of old paper fills the air, mingling with the aroma of freshly brewed coffee, creating an intoxicating blend that draws in those seeking answers."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Ocean View Dining Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "An elegant dining room with large windows offering panoramic views of the ocean, adorned with nautical decor.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on crisp white tablecloths",
          "colorful floral centerpieces",
          "waves crashing against the cliffs outside",
          "soft candlelight flickering"
        ],
        "sounds": [
          "clinking of cutlery",
          "laughter and chatter of guests",
          "the distant roar of the ocean",
          "soft piano music"
        ],
        "smells": [
          "fresh seafood",
          "baked bread",
          "scent of herbs and spices",
          "hint of citrus"
        ],
        "tactile": [
          "smooth tablecloth under fingers",
          "warmth of candles",
          "softness of upholstered chairs",
          "cool glass of wine"
        ]
      },
      "accessControl": "Open to all guests during meal times; reservations required for special events.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through rain-streaked windows",
            "cloudy reflections on the table"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "muffled conversations"
          ],
          "smells": [
            "freshly baked pastries",
            "scent of brewing coffee",
            "hint of salt in the air"
          ],
          "mood": "cozy and intimate"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadowy figures moving about",
            "waves crashing in the distance"
          ],
          "sounds": [
            "the rustle of linens",
            "low murmur of voices"
          ],
          "smells": [
            "rich aroma of coffee",
            "scent of grilled fish",
            "hint of fresh herbs"
          ],
          "mood": "suspenseful anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "twinkling lights along the coast",
            "sunset painting the sky"
          ],
          "sounds": [
            "clinking glasses",
            "laughter echoing off the walls"
          ],
          "smells": [
            "scent of grilled steak",
            "freshly baked desserts",
            "hint of merlot"
          ],
          "mood": "celebratory warmth"
        }
      ],
      "paragraphs": [
        "The Ocean View Dining Room is a feast for the senses, with its panoramic windows framing the tumultuous sea beyond. Guests gather here not just to dine, but to exchange stories and share laughter, the air thick with the scent of fresh seafood and baked bread. Candlelight flickers across the tables, casting warm shadows that dance in time with the soft piano music playing in the corner. Yet, amid the clinking of glasses and the rustle of linens, there is an undercurrent of tension, as if everyone is waiting for something to unfold.",
        "As the evening progresses, the dining room transforms into a stage for secrets and revelations. The clear sky outside contrasts with the mysteries brewing within. Laughter and conversation fill the air, but fleeting glances and hushed tones hint at unspoken truths. The aroma of rich dishes wafts through the room, enticing guests while shrouding the atmosphere in an air of intrigue, where every bite could lead to a revelation."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023197086,
  "durationMs": 31408
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1945,
    "month": "November",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool winds from the ocean"
    ],
    "daylight": "Short days with darkness falling around five o'clock in the evening, leaving the twilight to linger before night fully descends.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests retreat to their rooms.",
    "holidays": [
      "Thanksgiving (in the U.S.)"
    ],
    "seasonalActivities": [
      "strolling along the beach with heavy coats",
      "attending local theater performances",
      "participating in charity events for veterans"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suit",
        "tweed sport coat",
        "cravat or tie"
      ],
      "casual": [
        "corduroy trousers",
        "knit sweater",
        "button-up flannel shirt"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a cinched waist",
        "peacoat with military-inspired tailoring",
        "silk scarf"
      ],
      "casual": [
        "A-line skirt",
        "cashmere sweater",
        "tweed blazer"
      ],
      "accessories": [
        "cloche hat",
        "string of pearls",
        "handbag with a clasp"
      ]
    },
    "trendsOfTheMoment": [
      "the popularity of Christian Dior's New Look",
      "increased use of synthetic fabrics",
      "adoption of casual yet stylish daywear"
    ],
    "socialExpectations": [
      "men expected to wear suits for social gatherings",
      "women encouraged to maintain a polished appearance",
      "a return to traditional gender roles post-war"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the establishment of the United Nations in October",
      "ongoing investigations into war crimes in Europe",
      "growing tensions due to the Iron Curtain speech by Winston Churchill"
    ],
    "politicalClimate": "A climate of uncertainty as nations grapple with the aftermath of the war, and new geopolitical alignments are forming.",
    "economicConditions": "Struggling economies transitioning from wartime production to peacetime, with inflation issues and rationing still affecting daily life.",
    "socialIssues": [
      "debate over returning veterans to civilian jobs",
      "discussion of women's roles in the workforce",
      "rising concerns about communism"
    ],
    "internationalNews": [
      "the Nuremberg Trials continue",
      "conflicts in Eastern Europe as borders are redrawn",
      "the onset of the Cold War tensions between the U.S. and the Soviet Union"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Frank Sinatra's 'I've Got a Crush on You'",
        "the Andrews Sisters' 'Boogie Woogie Bugle Boy'"
      ],
      "films": [
        "'The Lost Weekend'",
        "‘Mildred Pierce’",
        "'Brief Encounter'"
      ],
      "theater": [
        "‘The Glass Menagerie’",
        "‘Carousel’",
        "revivals of classic works"
      ],
      "radio": [
        "‘The Shadow’",
        "‘Suspense’",
        "news broadcasts from CBS and NBC"
      ]
    },
    "literature": {
      "recentPublications": [
        "‘The Catcher in the Rye’ by J.D. Salinger",
        "‘Animal Farm’ by George Orwell",
        "‘The Great Gatsby’ reprinted amid renewed interest"
      ],
      "popularGenres": [
        "mystery",
        "post-war fiction",
        "romantic dramas"
      ]
    },
    "technology": {
      "recentInventions": [
        "first commercial television broadcasts",
        "advancements in radar technology",
        "the use of jet engines in aviation"
      ],
      "commonDevices": [
        "radio sets in most households",
        "early television sets in affluent homes",
        "vacuum cleaners and washing machines becoming standard"
      ],
      "emergingTrends": [
        "increased consumerism as the war ends",
        "the rise of suburban living",
        "television becoming a new medium for entertainment"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "Movie ticket: one shilling",
        "A cup of coffee: sixpence"
      ],
      "commonActivities": [
        "gathering for community events",
        "volunteering for veterans' support organizations",
        "attending local dances and social clubs"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "weekly visits to the local church",
        "neighborhood gatherings to discuss current events"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "the upper class is seen as out of touch with the average citizen",
      "working-class solidarity is gaining traction"
    ],
    "gender": [
      "women are increasingly seen as competent in professional roles",
      "there's a nostalgia for traditional gender roles as men return from war",
      "debates on women's rights are emerging"
    ],
    "race": [
      "racial segregation remains prevalent in many areas",
      "there's a growing awareness of civil rights issues"
    ],
    "generalNorms": [
      "conformity is valued, particularly in suburban areas",
      "patriotism is strong, with many supporting veterans",
      "family structures are central to social life"
    ]
  },
  "atmosphericDetails": [
    "The salty scent of the ocean mingled with the dampness of the cool air, evoking memories of stormy seas.",
    "The distant sound of waves crashing against the shore creates a rhythmic backdrop, occasionally punctuated by the rustle of leaves in the chilly wind.",
    "The flickering light of candles in the hotel lobby casts dancing shadows on the walls, enhancing the tension of whispered conversations."
  ],
  "paragraphs": [
    "In November 1945, the air is thick with the unease of a world struggling to recover from the ravages of the Second World War. The coastal town, nestled against the crashing waves, is cloaked in overcast skies and intermittent rain, a reflection of the turbulent emotions felt by its inhabitants. As the sun sets by five o'clock, the once-vibrant streets grow quiet, with only the sound of distant waves punctuating the silence. Inside the dimly lit hotel, guests gather, their conversations hushed and tense, each person acutely aware of the shifting tides of history that have brought them here.",
    "Fashion in this post-war era is a blend of elegance and practicality. Men don double-breasted wool suits or tweed sport coats, while women opt for tea-length dresses cinched at the waist, embodying the New Look made popular by Christian Dior. Accessories like fedora hats and cloche hats complete the polished appearances as guests navigate the hotel’s corridors, creating an atmosphere steeped in nostalgia and the desire for normalcy amidst change. The polished floors reflect the careful attention to detail, from the shine of leather gloves to the delicate string of pearls worn by the women, each a reminder of the life they are attempting to reclaim.",
    "Daily life reflects a society in transition. Prices are modest, but rationing still lingers in the air, with a loaf of bread costing four pence and a movie ticket only a shilling. Community activities include charity events for returning veterans and local dances, fostering unity and a sense of purpose. Yet, the specter of the Cold War looms large, with conversations peppered by whispers of international tensions and the realities of racial segregation. As guests share stories of their wartime experiences, the weight of what has been lost and what is yet to come fills the air, creating an electrifying yet somber mood that makes every moment feel charged with unspoken possibilities."
  ],
  "note": "",
  "cost": 0.00111123375,
  "durationMs": 12500
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A high-stakes gathering at a seaside hotel for a charity gala draws together influential figures, each grappling with the societal shifts of the post-war era amidst rising tensions and hidden agendas.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has reshaped class dynamics, with increased women's workforce participation and a growing sense of unease due to Cold War tensions, creating a pressure cooker of social expectations and hidden resentments."
  },
  "setting": {
    "location": "A seaside hotel with Art Deco architecture",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain"
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
    "id": "victim_temperature",
    "value": "one hundred and one degrees Fahrenheit",
    "description": "The exact temperature at which the poison becomes lethal."
  },
  {
    "id": "poison_administered_time",
    "value": "twenty minutes past eight",
    "description": "The specific time the poison was administered."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 18,
  "countsByPlacement": {
    "early": 9,
    "mid": 8,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
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
      "category": "temporal"
    },
    {
      "id": "clue_2",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "behavioral"
    },
    {
      "id": "clue_fp_elimination_captain_ivor_hale",
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
      "category": "temporal"
    },
    {
      "id": "clue_id_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_3",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_4",
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
      "id": "clue_fp_contradiction_step_1",
      "placement": "early",
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
