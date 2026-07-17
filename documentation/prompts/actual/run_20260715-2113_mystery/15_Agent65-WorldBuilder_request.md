# Actual Prompt Record

- Run ID: `mystery-1784149997051`
- Project ID: ``
- Timestamp: `2026-07-15T21:17:23.264Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `87dde1e3efd516ba`

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
    "title": "Reflections of Deceit",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A seaside hotel with Art Deco architecture",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "optical deception"
    }
  },
  "death_method": "struck with a heavy object",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "A well-respected investigator known for her sharp wit.",
      "private_secret": "Has a personal vendetta against the criminal underworld.",
      "motive_seed": "Seeks justice for a past wrong.",
      "motive_strength": "high",
      "alibi_window": "10 minutes before the incident",
      "access_plausibility": "high",
      "opportunity_channels": [
        "guest access",
        "staff access"
      ],
      "behavioral_tells": [
        "Keen observer",
        "Inquisitive nature"
      ],
      "stakes": "Her reputation as a detective.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A well-known physician in the area.",
      "private_secret": "Was investigating unethical practices in medicine.",
      "motive_seed": "Exposed secrets could ruin careers.",
      "motive_strength": "medium",
      "alibi_window": "unknown",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Protecting her career and integrity.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "witness",
      "relationships": [],
      "public_persona": "A retired naval officer with a commanding presence.",
      "private_secret": "Hides a history of gambling debts.",
      "motive_seed": "Desperation for money.",
      "motive_strength": "low",
      "alibi_window": "unknown",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "observed the incident"
      ],
      "behavioral_tells": [
        "Nervous under questioning"
      ],
      "stakes": "Maintaining his reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "An ambitious journalist.",
      "private_secret": "Was having an affair with Dr. Finch.",
      "motive_seed": "Jealousy and ambition.",
      "motive_strength": "high",
      "alibi_window": "unknown",
      "access_plausibility": "high",
      "opportunity_channels": [
        "guest access"
      ],
      "behavioral_tells": [
        "Evasive when questioned"
      ],
      "stakes": "Her career and reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "A charming socialite.",
      "private_secret": "Hides her true identity.",
      "motive_seed": "Desire for wealth.",
      "motive_strength": "medium",
      "alibi_window": "unknown",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "guest access"
      ],
      "behavioral_tells": [
        "Too friendly with everyone"
      ],
      "stakes": "Secure her future.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "A wealthy businessman.",
      "private_secret": "Involved in shady dealings.",
      "motive_seed": "Financial gain.",
      "motive_strength": "high",
      "alibi_window": "unknown",
      "access_plausibility": "high",
      "opportunity_channels": [
        "business connection"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Protecting his investments.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Beatrice Quill"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "When Dr. Mallory Finch is found dead in her hotel room, a complex web of deceit involving reflections and misdirection unfolds. Detective Eleanor Voss must navigate the shadows of the seaside hotel to uncover the truth."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The killer used a strategically positioned mirror to create a false sightline, making it appear that they were in another part of the room at the time of the murder.",
      "delivery_path": [
        {
          "step": "Mirror was adjusted to mislead witnesses."
        }
      ]
    },
    "outcome": {
      "result": "The true location of the murderer was concealed from the witnesses."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred when Dr. Finch was alone in her room with no one else present.",
    "type": "spatial",
    "why_it_seems_reasonable": "Witnesses reported seeing the doctor alone through a window.",
    "what_it_hides": "The killer was actually in a different part of the room, obscured by a mirror."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "He was the last person seen near Dr. Finch's room.",
      "His commanding presence made him seem capable of overpowering her."
    ],
    "the_one_flaw": "Witnesses saw him leave the hotel before the murder occurred.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken vase was found near the victim's body.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The vase was accidentally knocked over during a scuffle.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A threatening note was discovered in Dr. Finch's room.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The note was a prank from a disgruntled patient.",
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
    "rationale": "All suspects were guests at the hotel, and no outsiders had access."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The murder occurred shortly before 9 PM."
      ],
      "windows": [
        "The suspects were all in the hotel at the time."
      ],
      "contradictions": [
        "Witnesses say they saw Dr. Finch alone at 8:55 PM."
      ]
    },
    "access": {
      "actors": [
        "All suspects had access to Dr. Finch's room."
      ],
      "objects": [
        "The mirror was located in a corner of the room."
      ],
      "permissions": [
        "All guests could enter each other's rooms."
      ]
    },
    "physical": {
      "laws": [
        "Light travels in straight lines."
      ],
      "traces": [
        "Fingerprints found on the mirror."
      ]
    },
    "social": {
      "trust_channels": [
        "All suspects were friends of Dr. Finch."
      ],
      "authority_sources": [
        "Dr. Finch had a good reputation in the community."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses saw a reflection of a figure in the mirror that did not match the actual position of the person.",
        "correction": "This indicates that the person was not where they appeared to be.",
        "effect": "Narrows suspect pool to eliminate Captain Ivor Hale.",
        "required_evidence": [
          "Witness statements about the reflection.",
          "Position of the mirror in the room."
        ],
        "reader_observable": true
      },
      {
        "observation": "A scuff mark on the floor indicated the mirror had been moved recently.",
        "correction": "The movement of the mirror suggests intentional obstruction of sightlines.",
        "effect": "Narrows suspects further, suggesting premeditation.",
        "required_evidence": [
          "Physical evidence of the scuff mark.",
          "Testimony about the mirror's usual position."
        ],
        "reader_observable": true
      },
      {
        "observation": "Fingerprints on the mirror indicated recent handling.",
        "correction": "Only the culprit would have handled the mirror right before the murder.",
        "effect": "Eliminates Sylvia Trent, who has no access to the room.",
        "required_evidence": [
          "Fingerprint analysis results.",
          "Witness accounts of Sylvia's whereabouts."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares mirror, reflection, and witness against the claimed timeline.",
    "knowledge_revealed": "The reflection during the reenactment contradicts earlier witness statements.",
    "pass_condition": "If the witness positions match the setup, it proves the original sightline was manipulated.",
    "evidence_clues": [
      "clue_core_contradiction_chain",
      "clue_culprit_direct_1",
      "clue_mechanism_visibility_core",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness reflection reports (early) and mirror positioning (mid) establish doubt. Step 2: Scuff mark evidence (mid) emphasizes movement intent. Step 3: Fingerprint analysis (discriminating test) reveals handling inconsistency."
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
        "Observe the reflection results"
      ],
      "test_type": "optical deception"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by other guests.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Fingerprint analysis excludes her.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: unknown",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: unknown",
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
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
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical evidence"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
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
        "clue_id": "clue_fp_elimination_eleanor_voss",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_hugo_vane",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_sylvia_trent",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Reenactment observation"
      },
      {
        "clue_id": "clue_mid_1",
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
    "summary": "Eleanor Voss is a charming travel writer turned amateur sleuth, grappling with feelings of inadequacy after her recent divorce. She finds herself investigating a murder at a seaside hotel, hoping to prove her worth.",
    "publicPersona": "Charming and inquisitive, known for her captivating travel articles.",
    "privateSecret": "Struggles with feelings of inadequacy since her recent divorce.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "Present during the murder, investigating a story on the hotel.",
    "accessPlausibility": "easy",
    "stakes": "Desires to prove herself as a capable investigator.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Eleanor speaks with a melodic cadence, often weaving in thoughtful pauses as if searching for the right words. Her humor is subtle, often manifesting in a sardonic twist at the end of a well-placed observation.",
    "signatureTic": "Well, isn’t that just delightful?",
    "internalConflict": "Haunted by her recent divorce, Eleanor fears that her inadequacies may prevent her from succeeding in both love and her career.",
    "personalStakeInCase": "This murder investigation offers Eleanor a chance to reclaim her self-worth and prove that she is more than a failed marriage.",
    "paragraphs": [
      "Eleanor Voss stood at the edge of the hotel terrace, the salty breeze tugging at her hair while she surveyed the scene before her. The Art Deco architecture of the seaside hotel gleamed in the afternoon sun, but her heart felt heavy. Recently divorced and grappling with a profound sense of inadequacy, she had come here to write about the hotel’s storied past. Instead, she found herself embroiled in a murder investigation, a chance to prove herself as more than just a travel writer.",
      "With a charming smile that belied her inner turmoil, Eleanor approached the guests, her inquisitive nature guiding her through the crowd. As she mingled, she couldn’t shake the feeling that she was out of her depth. Each interaction brought a new wave of self-doubt crashing over her, whispering that perhaps she was meant to be a mere observer of life rather than a participant. Yet, the thrill of the investigation ignited a spark within her, a flicker of the confident woman she once was.",
      "As she delved deeper into the mystery, Eleanor’s keen instincts began to emerge. She picked up on subtle nuances in the guests’ conversations, the way Captain Hale’s eyes darted when Dr. Finch’s name was mentioned, or how Beatrice Quill’s smile faltered when the victim was brought up. These observations fueled her desire to uncover the truth, but with each revelation, the specter of her personal failures loomed larger. Would she be able to solve the case, or would she be left with nothing but the remnants of her shattered self-esteem?",
      "Determined to find her confidence, Eleanor pressed on, piecing together the fragments of a story that was as much about her as it was about the murder. With every clue she uncovered, she felt a sense of purpose returning to her life. She began to understand that this case was not merely a distraction; it was an opportunity for redemption. As she stepped into the shadows of the hotel, ready to confront the darkness that awaited, she whispered to herself, 'Well, isn’t that just delightful?'"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose jealousy of Eleanor Voss leads to a deadly confrontation. While she presents herself as dedicated to her patients, her private resentment towards Eleanor reveals a darker side.",
    "publicPersona": "Respected physician, known for her dedication to her patients.",
    "privateSecret": "Dislikes Eleanor for taking credit for a shared research project.",
    "motiveSeed": "Jealous of Eleanor's success; could gain funding for her own practice.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been in her room attending to a patient via phone.",
    "accessPlausibility": "possible",
    "stakes": "Wants to eliminate competition for a prestigious grant.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks in a clipped, precise manner, her voice carrying an air of authority. She avoids humor, her demeanor serious and focused, reflecting her dedication to her profession.",
    "signatureTic": "Time is of the essence.",
    "internalConflict": "Dr. Finch is torn between her professional ethics and her personal jealousy, questioning whether her ambition is worth the moral cost.",
    "personalStakeInCase": "The murder investigation threatens to expose her jealousy and unprofessional behavior, jeopardizing her chances for the grant she desperately needs.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her hotel room, the phone pressed to her ear as she feigned concern for a patient. Her voice was steady, authoritative, but her mind raced with thoughts of Eleanor Voss. The charming travel writer had eclipsed her in the field of research, taking credit for their shared project and basking in the glory that should have been hers. The bitterness festered within her, a poison that clouded her judgment.",
      "As a respected physician, Mallory had always prided herself on her dedication to her patients. However, the jealousy she felt towards Eleanor threatened to unravel her carefully constructed facade. 'Time is of the essence,' she reminded herself, gripping the phone tighter as she imagined the prestigious grant slipping away. The thought of Eleanor’s success gnawed at her, pushing her closer to a dark edge she never thought she would approach.",
      "When the news of Eleanor’s involvement in the murder investigation broke, Mallory felt a surge of panic. If anyone discovered her true feelings, it could ruin her career. She had been in her room during the murder, or so she claimed, but the truth was far more complicated. What if someone connected the dots? The stakes were higher than ever, and her desperation clawed at her insides, urging her to take drastic action to eliminate the competition.",
      "With each passing day, Mallory’s internal conflict grew, forcing her to confront the reality of her ambitions. As the investigation spiraled, she found herself grappling with the consequences of her jealousy. Would she continue down this treacherous path, or would she find a way to confront her feelings and embrace collaboration? The answer remained elusive, hidden beneath layers of resentment and fear."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer with a storied past, haunted by PTSD and a potential scandal involving the victim. His charm and tales of heroism mask a darker truth.",
    "publicPersona": "Admirable war hero, enjoys telling tales of his naval exploits.",
    "privateSecret": "Battles PTSD from his wartime experiences.",
    "motiveSeed": "Victim threatened to expose his shady business dealings post-war.",
    "motiveStrength": "compelling",
    "alibiWindow": "Says he was in the lobby discussing naval history with guests.",
    "accessPlausibility": "easy",
    "stakes": "Wants to safeguard his reputation and business.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Captain Hale's speech is punctuated by grand gestures and a booming voice that commands attention. He employs self-deprecating humor, often downplaying his naval exploits with a wink.",
    "signatureTic": "Aye, that was quite the adventure.",
    "internalConflict": "Ivor grapples with the ghosts of his past, torn between the hero he was and the man he has become, fearing that his reputation is built on shaky ground.",
    "personalStakeInCase": "The murder investigation threatens to unravel his carefully maintained reputation, forcing him to confront the truth about his past actions.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the lobby bar, a glass of whiskey in hand, recounting tales of bravery and valor to an enthralled audience. His booming voice filled the room, a sharp contrast to the shadows lurking within him. Though he wore the guise of a war hero, Ivor was haunted by the memories of his past, the scars of PTSD etched deeply into his psyche. 'Aye, that was quite the adventure,' he would say, but the truth was far more complex.",
      "As he regaled the guests with stories of naval exploits, Ivor felt a growing sense of unease. Dr. Mallory Finch had threatened to expose his shady business dealings, and the fear of scandal loomed like a storm cloud over his head. He had fought valiantly in battle, but now he found himself struggling against an enemy far more insidious: the truth. The stakes were high, and he was determined to protect what little remained of his reputation.",
      "Ivor’s charm was disarming, but it masked the turmoil within. He often turned to self-deprecating humor, using it as a shield against the scrutiny of those around him. Yet, as the investigation unfolded, he could feel the walls closing in. The whispers of his past echoed in his mind, and he wondered if he would be able to face the truth without shattering the illusion he had built.",
      "In the depths of his heart, Ivor knew that redemption would require confronting the demons that had haunted him for so long. The murder investigation offered him a chance to reclaim his honor, but it also forced him to reckon with the man he had become. Would he rise to the occasion, or would he succumb to the shadows that threatened to envelop him?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a hotel receptionist whose friendly demeanor hides a simmering resentment towards the victim. Her desire for recognition drives her to the edge as the investigation unfolds.",
    "publicPersona": "Friendly and approachable, she knows all the hotel guests.",
    "privateSecret": "Hides her resentment towards the victim for being favored by management.",
    "motiveSeed": "Believes the victim's favoritism cost her a promotion.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been sorting guest correspondence during the murder.",
    "accessPlausibility": "possible",
    "stakes": "Desires recognition and advancement in her career.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice’s speech is warm and welcoming, peppered with polite jabs that reveal her underlying resentment. She has a knack for turning compliments into veiled criticisms, her tone light yet pointed.",
    "signatureTic": "Oh, bless her heart.",
    "internalConflict": "Beatrice is torn between her ambition and her simmering resentment, questioning whether her desire for recognition will lead her to dark places.",
    "personalStakeInCase": "The investigation could expose her feelings of jealousy and inadequacy, forcing her to confront her own ambitions and the lengths she might go to achieve them.",
    "paragraphs": [
      "Beatrice Quill stood behind the reception desk, her smile radiant as she greeted guests with the warmth of a well-practiced routine. 'Oh, bless her heart,' she would say, referring to Dr. Finch, though the sweetness of her words dripped with disdain. While her public persona was one of friendliness and approachability, beneath the surface lay a simmering resentment that threatened to boil over. The favoritism shown to the doctor by management had cost her a promotion, and the bitterness lingered like a bad taste in her mouth.",
      "As the investigation unfolded, Beatrice found herself grappling with her feelings. She had always been the one to hold the hotel together, yet here was Eleanor Voss, a travel writer, stepping into the limelight as if she belonged there. It was infuriating. With each passing day, the jealousy grew more potent, mingling with her desire for recognition and advancement. The stakes were high, and she felt a compulsion to take matters into her own hands, even if it meant resorting to unsavory tactics.",
      "Beatrice’s speech was filled with polite savagery, her words often veiling her true feelings. Each compliment she offered carried an edge, a reminder of the competition that stood between her and her dreams. She was determined to rise above her circumstances, but the darkness of her ambitions threatened to cloud her judgment. Would she allow herself to be consumed by the very resentment she sought to escape?",
      "As the investigation continued, Beatrice faced a reckoning. The truth of her feelings lay bare, and she was forced to confront the lengths she might go to achieve her aspirations. Would she advocate for herself, or would she be swept away in the tide of jealousy? The choice loomed before her, a reflection of the woman she was and the woman she aspired to become."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a glamorous socialite attending a charity event at the hotel, hiding her financial troubles beneath a facade of elegance. Her desperation leads her to a dangerous crossroads.",
    "publicPersona": "Well-connected and glamorous, attends the hotel for a charity event.",
    "privateSecret": "In debt due to extravagant spending, hiding financial troubles.",
    "motiveSeed": "Victim knew about her financial troubles and threatened to expose them.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been mingling with other guests in the dining room.",
    "accessPlausibility": "unlikely",
    "stakes": "Wants to maintain her social reputation and avoid financial ruin.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a refined, theatrical flair, often using grand gestures and a dramatic tone. Her sardonic humor reveals the tension beneath her glamorous facade.",
    "signatureTic": "Darling, it's all about appearances.",
    "internalConflict": "Sylvia grapples with her extravagant lifestyle and the reality of her financial situation, torn between maintaining her image and facing the truth about her debts.",
    "personalStakeInCase": "The investigation threatens to expose her financial troubles, putting her social status and future at risk.",
    "paragraphs": [
      "Sylvia Trent floated through the hotel’s grand dining room, a vision of elegance in her evening gown, yet beneath her glamorous exterior lay a web of financial troubles that threatened to unravel her world. 'Darling, it's all about appearances,' she would declare with a playful smile, but the truth was far less delightful. Each extravagant purchase was a step deeper into debt, and the threat of exposure loomed large, especially with Dr. Mallory Finch aware of her secrets.",
      "As she mingled with the other guests, Sylvia exuded charm and sophistication, but her mind raced with anxiety. The victim had threatened to expose her precarious situation, and the stakes were impossibly high. If her financial troubles came to light, her social status—and her very identity—would be at risk. The pressure mounted, and she felt herself teetering on the edge of desperation, contemplating the unthinkable to protect her carefully constructed life.",
      "Sylvia’s speech was filled with theatrical flair, yet laced with sardonic humor that hinted at her inner turmoil. She often used grand gestures as a distraction, but the truth behind her words was heavy with the weight of her secrets. As the investigation progressed, she found herself grappling with the reality of her situation. Would she continue to uphold a façade of wealth and elegance, or would she be forced to confront the truth about her lifestyle?",
      "With each passing moment, Sylvia felt the walls closing in, and the investigation threatened to expose her vulnerabilities. In a world where reputation was everything, she faced a choice: to cling to her illusions or to confront the reality of her life. The outcome of the investigation would not only determine her future but would also force her to reckon with the choices that had led her to this perilous brink."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a sharp-witted journalist whose competitive nature drives him to the edge as the investigation unfolds. His resentment towards Eleanor complicates his pursuit of the truth.",
    "publicPersona": "A sharp-witted journalist always looking for his next big scoop.",
    "privateSecret": "Resents Eleanor for overshadowing him in the travel writing field.",
    "motiveSeed": "Thought the victim was about to expose a scandal he was involved in.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been interviewing other guests for a story.",
    "accessPlausibility": "possible",
    "stakes": "Aims to protect his reputation and career as a journalist.",
    "humourStyle": "blunt",
    "humourLevel": 0.6,
    "speechMannerisms": "Hugo speaks in a direct, often brusque manner, his words sharp and to the point. His humor is blunt, using sarcasm to mask his insecurities and frustrations.",
    "signatureTic": "What’s the story here?",
    "internalConflict": "Hugo struggles with his feelings of inadequacy and jealousy, torn between his ambition and the ethical dilemmas of his profession.",
    "personalStakeInCase": "The investigation could expose his involvement in a scandal, threatening his reputation and career.",
    "paragraphs": [
      "Hugo Vane leaned against the bar, scanning the room with the keen eyes of a journalist always on the lookout for his next big scoop. 'What’s the story here?' he would mutter under his breath, frustration bubbling just beneath the surface. The murder investigation had the potential to catapult him into the limelight, but the presence of Eleanor Voss complicated matters. Her success in the travel writing field gnawed at him, a constant reminder of his own perceived shortcomings.",
      "With a blunt approach to conversation, Hugo had a knack for cutting through the pleasantries that often masked the truth. He spoke with a brusque confidence, unafraid to challenge those around him. Yet, beneath his sharp exterior lay a simmering resentment towards Eleanor, the woman who had overshadowed him for far too long. The stakes were high, and he found himself questioning whether the pursuit of a story was worth the potential fallout.",
      "As the investigation unfolded, Hugo’s internal conflict grew more pronounced. He was torn between his ambition to protect his reputation and the ethical dilemmas that plagued him. The victim had threatened to expose a scandal he was involved in, and the thought of his secrets coming to light sent a chill down his spine. Would he sacrifice his integrity for a chance at glory, or would he rise above the competition and seek the truth?",
      "In the midst of the chaos, Hugo realized that the investigation was not merely a means to an end; it was an opportunity for self-reflection. As he navigated the tangled web of motives and secrets, he had to confront his own demons. Would he emerge as a journalist of integrity, or would he succumb to the darker impulses that threatened to consume him? The answer lay just beyond his grasp, hidden within the shadows of ambition."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Coastal Mirage Hotel",
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel with Art Deco flair, shrouded in mystery and tension.",
    "visualDescription": "The Coastal Mirage Hotel stands majestically against the backdrop of the grey sea, its streamlined façade adorned with geometric motifs. Inside, the lobby boasts polished marble floors, a sweeping staircase, and opulent chandeliers, while narrow corridors lead to guest rooms with muted pastel decor.",
    "atmosphere": "A place of beauty marred by secrets and unease.",
    "paragraphs": [
      "The Coastal Mirage Hotel rises like a beacon against the tumultuous sea, its Art Deco architecture a striking contrast to the overcast sky. Guests from the city flock here, drawn by the promise of escape, yet beneath the surface lies a current of tension. The echoes of past glories linger in the air, mingling with whispers of discontent, as the war's shadow continues to loom over everyday life.",
      "Inside, the lobby is a cacophony of soft murmurs and the clinking of glasses, where patrons gather beneath the opulent chandeliers that cast a warm glow on the marble floors. Narrow corridors snake away from the central hub, their dimly lit paths hinting at secrets hidden behind closed doors. Each guest room is a sanctuary, yet the atmosphere is thick with unspoken fears and anxieties, a reflection of a world still reeling from conflict.",
      "As rain patters against the windows, a sense of isolation creeps into the hearts of those within. The hotel stands alone, accessible only by winding coastal roads that twist perilously along the cliffs. With wartime blackouts still in effect, the flicker of a radio broadcast becomes a lifeline to the outside world, while the distant sound of crashing waves serves as a constant reminder of both beauty and danger."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates",
    "timeFlow": "Days of tension unfold with secrets lurking in every corner.",
    "mood": "tense and suspenseful, reflecting post-war anxieties",
    "eraMarkers": [
      "Art Deco architecture",
      "radio broadcasts in the lobby",
      "rationed fuel for travel",
      "increased roles for women in hospitality"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air mixed with damp wood",
      "secondary": [
        "faint perfume of cigarette smoke",
        "sharp tang of wet stone"
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of salt and rain, a reminder of the tumultuous sea just beyond the hotel's walls. Inside, the faded elegance of the décor speaks to a bygone era, yet the atmosphere crackles with unvoiced tension. Guests exchange furtive glances, their conversations laced with the weight of unsaid words, while the distant sound of waves crashing against the cliffs seems to echo the inner turmoil of each individual.",
      "As twilight descends, the hotel transforms. Shadows stretch along the corridors, and the flickering light from old sconces dances across the walls, casting an almost ghostly glow. The sound of a distant radio fills the air, its crackling voice a reminder of the world outside, while the scent of dampness lingers, mingling with the rich aroma of coffee from the lobby café. It is a place where past and present collide, each room a vessel of stories waiting to be uncovered."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Guest Room - 214",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A small, sparsely decorated room with a single window overlooking the cliffs. The bed is unmade, and the floor is cluttered with overturned furniture.",
      "sensoryDetails": {
        "sights": [
          "overturned chair",
          "crumpled bed linens",
          "dim light from the window",
          "scattered personal effects"
        ],
        "sounds": [
          "distant waves crashing",
          "soft ticking of a clock",
          "muffled voices in the corridor",
          "the rustle of fabric"
        ],
        "smells": [
          "musty air",
          "faint whiff of perfume",
          "salt from the sea",
          "burnt tobacco"
        ],
        "tactile": [
          "cold metal doorknob",
          "rough texture of the carpet",
          "smooth glass of the window",
          "chill from the open window"
        ]
      },
      "accessControl": "Accessible only to hotel staff and investigators; locked after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through rain",
            "water droplets on the window"
          ],
          "sounds": [
            "steady patter of rain",
            "distant thunder",
            "soft creaking of the building"
          ],
          "smells": [
            "damp wood",
            "wet earth",
            "faint scent of coffee"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "dull light from the window"
          ],
          "sounds": [
            "the ticking of a clock",
            "occasional footsteps in the hallway"
          ],
          "smells": [
            "stale air",
            "lingering perfume",
            "hint of mildew"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "fading light casting long shadows",
            "the glow of street lamps outside"
          ],
          "sounds": [
            "distant laughter from the bar",
            "the clinking of glasses"
          ],
          "smells": [
            "freshly lit candle",
            "scent of tobacco smoke",
            "cold sea air"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "Inside room 214, chaos reigns. The bed is a tangle of sheets, hastily discarded as if its occupant had fled in panic. An overturned chair lies in the middle of the floor, suggesting a struggle, while personal items are strewn about, hinting at the life of a guest now shrouded in mystery. The air feels thick with tension, a palpable reminder that something sinister has occurred within these walls.",
        "The single window offers a view of the crashing waves below, their rhythmic sound a stark contrast to the unease that fills the room. A faint perfume lingers in the air, mingling with the musty scent of dampness, as if the very essence of the occupant clings to the space. This is not simply a room; it is a stage for secrets waiting to be uncovered, a narrative that yearns for resolution."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious area with elegant Art Deco furnishings, marble floors, and a grand chandelier casting a warm glow.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate chandelier",
          "geometric-patterned carpets",
          "silhouettes of guests mingling"
        ],
        "sounds": [
          "soft chatter of guests",
          "clinking of glasses",
          "the rustle of newspapers",
          "the distant sound of a radio"
        ],
        "smells": [
          "freshly brewed coffee",
          "citrus from fruit baskets",
          "clean linen",
          "faint perfume"
        ],
        "tactile": [
          "smooth marble underfoot",
          "plush upholstery of chairs",
          "cool glass of a drink",
          "crisp pages of newspapers"
        ]
      },
      "accessControl": "Open to all guests and visitors; monitored by hotel staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "cloudy light filtering through windows",
            "puddles forming outside"
          ],
          "sounds": [
            "soft drips from umbrellas",
            "distant thunder",
            "muffled conversations"
          ],
          "smells": [
            "wet pavement",
            "fresh pastries",
            "coffee grounds"
          ],
          "mood": "melancholic warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "faded colors of the decor"
          ],
          "sounds": [
            "the ticking clock",
            "soft laughter",
            "shuffling of feet"
          ],
          "smells": [
            "old books",
            "cigarette smoke",
            "dust motes in sunlight"
          ],
          "mood": "nostalgic unease"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of the setting sun through windows",
            "twinkling lights of the chandelier"
          ],
          "sounds": [
            "lively music from the bar",
            "clinking of silverware",
            "laughter echoing"
          ],
          "smells": [
            "roasting meat",
            "baking bread",
            "citrus from cocktails"
          ],
          "mood": "vibrant anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby welcomes patrons with its lavish decor and inviting ambiance. Polished marble floors gleam under the warm glow of a grand chandelier, while guests mingle amidst plush seating areas adorned with Art Deco patterns. The air is filled with the aroma of freshly brewed coffee and citrus, creating an atmosphere of comfort and luxury.",
        "As the day unfolds, the lobby becomes a microcosm of life at The Coastal Mirage. The soft murmur of conversations blends harmoniously with the distant sound of a radio broadcasting news from the outside world. Here, the tension of the outside reflects within, as guests steal glances at one another, their expressions revealing the weight of their own secrets."
      ]
    },
    {
      "id": "staff_area",
      "name": "The Staff Quarters",
      "type": "interior",
      "purpose": "Restricted access for hotel employees",
      "visualDetails": "A utilitarian space with simple furnishings, a small kitchen area, and a bulletin board filled with notices.",
      "sensoryDetails": {
        "sights": [
          "functional furnishings",
          "faded notices on the bulletin board",
          "stacked linens",
          "dim overhead lighting"
        ],
        "sounds": [
          "clatter of dishes",
          "soft conversations among staff",
          "distant sounds from the lobby",
          "the hum of kitchen appliances"
        ],
        "smells": [
          "cleaning supplies",
          "leftover food",
          "freshly laundered linens",
          "faint hint of cigarettes"
        ],
        "tactile": [
          "rough texture of the table",
          "cool metal of kitchen utensils",
          "softness of linens",
          "hardwood floor beneathfoot"
        ]
      },
      "accessControl": "Restricted to hotel staff only; no guest access.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "gray light filtering through small windows",
            "steam rising from coffee cups"
          ],
          "sounds": [
            "raindrops tapping against windows",
            "distant thunder",
            "the bustle of morning preparations"
          ],
          "smells": [
            "freshly brewed coffee",
            "warm bread",
            "wet floor"
          ],
          "mood": "busy urgency"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flickering overhead lights"
          ],
          "sounds": [
            "soft murmurs of conversation",
            "the rustle of paper",
            "the clattering of dishes"
          ],
          "smells": [
            "cooking spices",
            "clean linens",
            "dampness from outside"
          ],
          "mood": "tense camaraderie"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of lamps",
            "staff preparing for the dinner rush"
          ],
          "sounds": [
            "clinking of glassware",
            "laughter in the distance",
            "the hum of conversation"
          ],
          "smells": [
            "grilled meats",
            "fresh herbs",
            "citrus zest"
          ],
          "mood": "anticipatory excitement"
        }
      ],
      "paragraphs": [
        "The Staff Quarters buzz with activity as employees prepare for the day's events. Simple furnishings and a small kitchen area create a sense of practicality, while a bulletin board filled with notices keeps everyone informed. The air is thick with the scent of cleaning supplies and freshly laundered linens, a stark contrast to the luxurious atmosphere of the guest areas.",
        "In this restricted space, camaraderie flourishes among the staff, their whispers and laughter punctuating the hum of daily routines. As they bustle about, the distant sounds of guests in the lobby serve as a reminder of the world outside, where secrets and tensions brew just beneath the surface."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Dining Room",
      "type": "interior",
      "purpose": "Dining area for guests",
      "visualDetails": "Elegant tables set with fine china, crystal glassware, and soft lighting creating an intimate atmosphere.",
      "sensoryDetails": {
        "sights": [
          "crystal chandeliers glimmering",
          "neatly arranged tables",
          "waitstaff in crisp uniforms",
          "colorful dishes being served"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft music playing",
          "murmurs of conversation",
          "occasional laughter"
        ],
        "smells": [
          "simmering sauces",
          "freshly baked bread",
          "aromatic herbs",
          "sweet dessert"
        ],
        "tactile": [
          "smooth tablecloths",
          "cool silverware",
          "soft upholstery of chairs",
          "warmth of a freshly served dish"
        ]
      },
      "accessControl": "Open to all guests during dining hours; reservation recommended.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light from cloudy skies",
            "raindrops on the windows"
          ],
          "sounds": [
            "soft chatter of breakfast patrons",
            "the pouring of coffee",
            "the rustle of napkins"
          ],
          "smells": [
            "freshly brewed coffee",
            "toasting bread",
            "citrus from fruit"
          ],
          "mood": "cozy warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "faded colors in the decor"
          ],
          "sounds": [
            "the clatter of plates",
            "conversations fading in and out",
            "the sound of a clock ticking"
          ],
          "smells": [
            "simmering soup",
            "sweet pastries",
            "freshly ground coffee"
          ],
          "mood": "quiet reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "glow of chandeliers illuminating faces"
          ],
          "sounds": [
            "lively conversation",
            "clinking of wine glasses",
            "soft music playing"
          ],
          "smells": [
            "grilled meats",
            "herbs and spices",
            "freshly baked desserts"
          ],
          "mood": "elegant celebration"
        }
      ],
      "paragraphs": [
        "The Dining Room offers a feast for the senses, elegantly adorned with crystal chandeliers and fine china. Tables are set with meticulous care, each detail exuding sophistication. The air is filled with the rich aromas of simmering sauces and freshly baked bread, inviting guests to indulge in the culinary delights prepared by the talented kitchen staff.",
        "As patrons gather for their meals, the sounds of clinking cutlery and soft music create a harmonious backdrop to the evening. Conversations flow, punctuated by laughter and the occasional toast, yet beneath the surface lies an undercurrent of tension, as secrets exchanged over dinner may carry more weight than the dishes served."
      ]
    }
  ],
  "note": "",
  "cost": 0.0022246834500000002,
  "durationMs": 41283
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
      "overcast skies with intermittent rain showers",
      "cool breezes from the nearby coast",
      "high humidity typical of summer in coastal regions"
    ],
    "daylight": "Long summer days, with daylight lingering until nearly nine o'clock, casting a dim glow even in the late evening.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel begins to settle after dinner service.",
    "holidays": [
      "Independence Day celebrations on July 4th, though overshadowed by the war"
    ],
    "seasonalActivities": [
      "Guests at the hotel enjoying evening dances in the ballroom",
      "Strolls along the beach, despite the occasional drizzle",
      "Picnics in nearby parks, with families gathering for outdoor meals"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suits with wide lapels",
        "lightweight linen dress shirts",
        "polished leather oxfords with a slight shine"
      ],
      "casual": [
        "cotton short-sleeved shirts paired with khaki trousers",
        "seersucker suits for afternoon events",
        "comfortable loafers for easy wear"
      ],
      "accessories": [
        "silk ties with geometric patterns",
        "fedoras or flat caps for added style",
        "brass cufflinks as a touch of elegance"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dresses with floral prints",
        "tailored jackets with padded shoulders",
        "pearl necklaces that add a touch of sophistication"
      ],
      "casual": [
        "light cotton blouses paired with high-waisted skirts",
        "capri pants as a trendy alternative for summer",
        "simple sandals or pumps for comfort"
      ],
      "accessories": [
        "broad-brimmed hats to shield from the sun",
        "colorful silk scarves tied at the neck",
        "stylish handbags made from light fabrics"
      ]
    },
    "trendsOfTheMoment": [
      "Emphasis on practicality in women's fashion due to wartime fabric rationing",
      "Popularity of bold, geometric patterns in menswear",
      "Revival of vintage styles as a nostalgic response to the war"
    ],
    "socialExpectations": [
      "Men expected to maintain a polished appearance, reflecting their roles in a tumultuous world",
      "Women increasingly stepping into roles of authority and independence in the workforce",
      "Social gatherings serving as outlets for both escapism and community solidarity"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The United States intensifying its military aid to Britain as the war escalates in Europe",
      "The Battle of the Atlantic reaching critical points with heightened submarine warfare",
      "Increased discussions around the establishment of a wartime economy and its implications for citizens"
    ],
    "politicalClimate": "Tension remains high with the ongoing war in Europe, creating a backdrop of uncertainty.",
    "economicConditions": "Rationing of consumer goods continues, affecting daily life and fashion choices.",
    "socialIssues": [
      "Debates surrounding women's roles in the workforce as they take on jobs left by men at war",
      "Racial tensions heightened due to military service and civil rights movements beginning to take shape",
      "Concerns over national security and espionage as fears of threats grow domestically"
    ],
    "internationalNews": [
      "Reports of heavy fighting on the Eastern Front as Nazi Germany invades the Soviet Union",
      "Increased Japanese aggression in the Pacific, raising concerns in the U.S. about its involvement in the war",
      "Growing alliances forming among the Allies as countries unite against Axis powers"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's 'In the Mood'",
        "Bing Crosby's rendition of 'White Christmas'",
        "Doris Day's 'Sentimental Journey'"
      ],
      "films": [
        "Casablanca, released earlier in the year, captivating audiences with its wartime romance",
        "The Maltese Falcon, drawing viewers into its world of intrigue and crime",
        "Sergeant York, presenting a story of heroism that resonates with the public"
      ],
      "theater": [
        "Broadway productions featuring wartime themes gaining popularity",
        "Revues and musicals providing light-hearted entertainment amidst the war",
        "Local theater groups staging plays that reflect the societal changes of the time"
      ],
      "radio": [
        "Suspenseful dramas and mystery shows captivating evening listeners",
        "News broadcasts providing updates on the war effort and home front initiatives",
        "Variety shows featuring popular singers and comedians to lift spirits"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Grapes of Wrath by John Steinbeck, exploring struggles amidst economic hardship",
        "The Maltese Falcon by Dashiell Hammett, a cornerstone of detective fiction",
        "For Whom the Bell Tolls by Ernest Hemingway, focusing on the Spanish Civil War and its implications"
      ],
      "popularGenres": [
        "Mystery and detective fiction, reflecting the public's thirst for escapism",
        "War literature capturing the realities and emotional toll of conflict",
        "Romance novels providing solace and distraction from turbulent times"
      ]
    },
    "technology": {
      "recentInventions": [
        "Advancements in radar technology aiding military operations",
        "Development of early computers for wartime logistics and calculations",
        "Innovations in synthetic rubber following material shortages"
      ],
      "commonDevices": [
        "Radio sets in homes providing news and entertainment",
        "Film projectors in community theaters showing the latest war films",
        "Basic home appliances like refrigerators becoming more common"
      ],
      "emergingTrends": [
        "Increased reliance on technology for war efforts influencing civilian life",
        "Shift towards modern styles in design as a response to wartime needs",
        "Growth of suburban living as families seek safety from urban areas"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pound of butter: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "Gatherings at local parks for picnics and music",
        "Volunteer work supporting the war effort through community organizations",
        "Participating in neighborhood watch groups for security"
      ],
      "socialRituals": [
        "Weekly family dinners as a staple of social life, often involving potluck gatherings",
        "Attendance at community events like dances or movie nights to foster camaraderie",
        "Sending letters and care packages to soldiers abroad as a show of support"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "The upper class showing resilience through social gatherings despite the tumultuous times",
      "Middle-class families banding together to support one another through rationing",
      "Working-class individuals increasingly vocal about their rights and needs"
    ],
    "gender": [
      "Women stepping into roles traditionally held by men, challenging societal norms",
      "A push for equal pay and recognition for women in the workforce",
      "Men returning from military service facing pressures to reclaim traditional roles"
    ],
    "race": [
      "Increased awareness of racial inequalities, particularly with African Americans serving in the military",
      "Growing calls for civil rights as racial segregation remains a contentious issue",
      "Diversity in labor force rising as women and minorities fill gaps left by men at war"
    ],
    "generalNorms": [
      "A spirit of solidarity among citizens as they rally for the war effort",
      "Suspicion and vigilance regarding foreign influences and espionage",
      "A sense of nostalgia for pre-war times influencing social interactions"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain-soaked earth mixing with salty ocean air as evening descends.",
    "The muffled sounds of laughter and music drifting from the hotel ballroom, punctuated by the occasional clap of thunder.",
    "Dim light filtering through heavy curtains, casting shadows that dance upon the walls."
  ],
  "paragraphs": [
    "In July 1941, the coastal hotel stands as a refuge amid the brewing storm of global conflict. Overcast skies loom above, with the scent of rain-soaked earth mixing with the salty air from the nearby ocean. As evening approaches, the hotel is filled with the sounds of laughter and music emanating from its ballroom, where guests dance beneath the dim light filtering through heavy curtains. The tension of the outside world feels palpable within these walls, where stories of war and sacrifice linger in hushed conversations.",
    "Fashion reflects the era's duality; while men don double-breasted navy suits, polished shoes glinting under the chandelier's glow, women adorn themselves in elegant tea-length dresses, their silhouettes accentuated by the summer breeze. Accessories such as silk ties and broad-brimmed hats serve not only as style statements but as reminders of the societal shifts occurring as women increasingly take on roles in the workforce. The evening's attire, a blend of practicality and elegance, mirrors the ongoing transformation of gender roles in a world at war.",
    "Daily life in this summer of 1941 is marked by the effects of rationing, with families gathering for potluck dinners, sharing what little they have in a spirit of solidarity. The typical prices of everyday items reflect the strain of wartime economy; a loaf of bread costs four pence, while taxi fares across town reach two shillings. Community events, like weekly dances and outdoor picnics, serve as much-needed respite from the pressures of life, allowing citizens to forge connections amidst uncertainty. As the evening unfolds, the hotel becomes a microcosm of a society wrestling with fear and hope, where every conversation could hold the key to secrets yet uncovered."
  ],
  "note": "",
  "cost": 0.0013904434499999998,
  "durationMs": 22111
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense inheritance dispute unfolds at a coastal hotel, drawing together a diverse group of individuals impacted by post-war societal shifts and the complexities of restricted access.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is shifting with women taking on new roles, while the lingering effects of WWII and early Cold War tensions create a backdrop of anxiety and competition among the social classes."
  },
  "setting": {
    "location": "A seaside hotel with Art Deco architecture",
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
  "theme": "Golden Age murder driven by an optical method, where a mirror-and-lens reflection falsified a witness's sightline across the room."
}

### LOCKED_FACTS
[
  {
    "id": "mirror_angle",
    "value": "forty-five degrees",
    "description": "The angle of the mirror that caused the deceptive reflection."
  },
  {
    "id": "witness_location",
    "value": "ten feet away",
    "description": "The distance from which the witness saw the reflection."
  },
  {
    "id": "murder_time",
    "value": "twenty minutes past nine",
    "description": "The time the murder was committed, according to the victim's watch."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 26,
  "countsByPlacement": {
    "early": 9,
    "mid": 16,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 25,
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
      "id": "clue_3",
      "placement": "early",
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
      "placement": "early",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
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
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_10",
      "placement": "mid",
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
      "category": "behavioral"
    },
    {
      "id": "clue_fp_elimination_eleanor_voss",
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
      "id": "clue_fp_elimination_sylvia_trent",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_elimination_hugo_vane",
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
      "id": "clue_culprit_direct_beatrice_quill",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
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
      "category": "physical"
    },
    {
      "id": "clue_late_1",
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
      "id": "clue_fp_contradiction_step_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
      "criticality": "essential",
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
