# Actual Prompt Record

- Run ID: `mystery-1784463065999`
- Project ID: ``
- Timestamp: `2026-07-19T12:14:14.798Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `c5a63be92b242697`

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
    "title": "The Delayed Toast",
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
      "institution": "seaside hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "delayed poisoning"
    }
  },
  "death_method": "poisoned",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Intelligent and observant",
      "private_secret": "Struggles with self-doubt",
      "motive_seed": "Desire for justice",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Investigating",
        "Social interactions"
      ],
      "behavioral_tells": [],
      "stakes": "Personal integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Professional",
      "relationships": [
        "Colleague of Hugo Vane"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Hides a past error in judgment",
      "motive_seed": "Professional rivalry",
      "motive_strength": "moderate",
      "alibi_window": "between 8 PM and 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical supplies",
        "Social gatherings"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Military Veteran",
      "relationships": [
        "Friend of Hugo Vane"
      ],
      "public_persona": "Charismatic and authoritative",
      "private_secret": "Financial troubles",
      "motive_seed": "Past debt owed by the victim",
      "motive_strength": "weak",
      "alibi_window": "between 8 PM and 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Social gatherings",
        "Shared drinks"
      ],
      "behavioral_tells": [],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Socialite",
      "relationships": [
        "Acquaintance of Hugo Vane"
      ],
      "public_persona": "Charming and sociable",
      "private_secret": "Infatuation with Hugo Vane",
      "motive_seed": "Jealousy over Hugo's affections",
      "motive_strength": "moderate",
      "alibi_window": "between 8 PM and 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Social gatherings"
      ],
      "behavioral_tells": [],
      "stakes": "Emotional stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Hotel Staff",
      "relationships": [
        "Works at the hotel, knows all guests"
      ],
      "public_persona": "Caring and attentive",
      "private_secret": "Knows too much about guests' secrets",
      "motive_seed": "Protecting a secret of a guest",
      "motive_strength": "weak",
      "alibi_window": "between 8 PM and 10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Staff access to all areas"
      ],
      "behavioral_tells": [],
      "stakes": "Job security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "Acquaintance of all suspects"
      ],
      "public_persona": "Wealthy and influential",
      "private_secret": "Involved in risky investments",
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
      "Dr. Mallory Finch"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a lavish celebration at a seaside hotel, Hugo Vane falls ill and dies from a delayed reaction to poison hidden in his tonic water. Detective Eleanor Voss must untangle the web of relationships and secrets among the guests to uncover the true culprit."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The poison was cleverly mixed into Hugo's tonic water during a social toast, exploiting his trust in the drink and the social atmosphere.",
      "delivery_path": [
        {
          "step": "Hugo Vane orders tonic water at the bar."
        },
        {
          "step": "One of the suspects, knowing his drink choice, adds poison to the tonic water."
        },
        {
          "step": "Hugo drinks the tonic water during a celebratory toast."
        }
      ]
    },
    "outcome": {
      "result": "Hugo dies three hours later, creating confusion about the time of poisoning."
    }
  },
  "false_assumption": {
    "statement": "Hugo Vane died due to natural causes as he was known to have health issues.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses recall Hugo appearing healthy and lively before the toast, and his known health issues make a health crisis seem plausible.",
    "what_it_hides": "The true cause of death was a delayed poisoning, obscured by the social setting."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch's medical knowledge gives her access to poisons.",
      "She had an argument with Hugo earlier about his health."
    ],
    "the_one_flaw": "Dr. Finch was in the kitchen serving drinks during the toast, confirmed by multiple witnesses.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A witness claims to have seen Dr. Finch near Hugo just before the toast.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "Dr. Finch was discussing medical supplies with the bartender, not Hugo.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Captain Hale had a heated conversation with Hugo earlier in the evening.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "They were arguing about a business deal, not a personal vendetta.",
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
    "rationale": "All suspects are guests or staff at the hotel, and there are no outsiders involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Time of the toast",
        "Time of death"
      ],
      "windows": [
        "between 8 PM and 10 PM"
      ],
      "contradictions": [
        "Witnesses saw Hugo at the toast, yet he died hours later."
      ]
    },
    "access": {
      "actors": [
        "All suspects"
      ],
      "objects": [
        "Tonic water bottle",
        "Bar"
      ],
      "permissions": [
        "Bartender's access to drinks"
      ]
    },
    "physical": {
      "laws": [
        "Poison acts within hours",
        "Social drinking patterns influence consumption"
      ],
      "traces": [
        "Poison residue on glass",
        "Tonic water bottle found at the scene"
      ]
    },
    "social": {
      "trust_channels": [
        "The camaraderie of the guests",
        "Familiarity with the bartender"
      ],
      "authority_sources": [
        "Hotel staff",
        "Medical credentials of Dr. Finch"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The bartender confirms that Hugo ordered tonic water shortly before the toast.",
        "correction": "This establishes that Hugo's drink was tampered with just prior to consumption.",
        "effect": "Narrows timeline of poisoning to just before the toast.",
        "required_evidence": [
          "Bartender's statement about Hugo's order",
          "Witnesses recalling the toast timing"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report that Hugo appeared healthy until just after the toast.",
        "correction": "This indicates that if Hugo was poisoned, it must have been immediately before the toast.",
        "effect": "Eliminates the possibility of natural causes leading to his death.",
        "required_evidence": [
          "Witness statements about Hugo's health",
          "Timing of symptoms reported by witnesses"
        ],
        "reader_observable": true
      },
      {
        "observation": "A residue test on the tonic water bottle reveals traces of poison.",
        "correction": "This provides concrete evidence of tampering in Hugo's drink.",
        "effect": "Narrows suspect list to those who had access to the bar area.",
        "required_evidence": [
          "Test results from the tonic water",
          "Access logs of the bar area"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares toast, poison, and bartender against the claimed timeline.",
    "knowledge_revealed": "The reaction of each suspect to the idea of the poisoned tonic water helps to identify the culprit based on their knowledge of the event.",
    "pass_condition": "The suspect who shows undue concern or knowledge about the poison will be identified as the culprit.",
    "evidence_clues": [
      "clue_1",
      "clue_culprit_direct_1",
      "clue_mechanism_visibility_core",
      "clue_culprit_direct_dr_mallory_finch"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The bartender's confirmation (early) and witness reports (mid) establish the timeline of the toast as crucial. Step 2: The health reports from witnesses (mid) allow the reader to see the contradiction in the false assumption of natural causes. Step 3: The residue test results (early act 3) reveal the tampering with the drink, allowing for the narrowing of the suspect pool."
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
        "Observe the suspect's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": "Behavioral observation"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness testimony places him elsewhere during the toast",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No access to the bar before the toast",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Access logs confirm she was in another area when the poison was administered",
        "supporting_clues": [
          "clue_id_7",
          "clue_id_8"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Bartender's statement"
      },
      {
        "clue_id": "clue_id_5",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_id_7",
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
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witnesses recalling health"
      },
      {
        "clue_id": "clue_id_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Residue test results"
      },
      {
        "clue_id": "clue_id_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statements about the timeline"
      },
      {
        "clue_id": "clue_id_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Access logs"
      },
      {
        "clue_id": "clue_id_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Access logs"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A traveling journalist with a flair for uncovering the truth, Eleanor carries the weight of her past mistakes as she investigates a murder that could redeem her.",
    "publicPersona": "Charismatic and insightful, known for her hard-hitting stories.",
    "privateSecret": "Struggles with guilt over a past article that ruined a family's reputation.",
    "motiveSeed": "Curiosity about the victim's shady dealings in the hotel.",
    "motiveStrength": "moderate",
    "alibiWindow": "Present at the hotel for an assignment.",
    "accessPlausibility": "easy",
    "stakes": "Redemption for her past mistakes.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a blend of journalistic precision and casual charm, often punctuating her observations with dry quips. She has a tendency to ask pointed questions, revealing her investigative instincts.",
    "signatureTic": "‘Let’s peel back the layers, shall we?’",
    "internalConflict": "Haunted by the repercussions of her previous work, Eleanor grapples with the fear that her pursuit of truth may lead to more ruin.",
    "personalStakeInCase": "The murder represents a chance to atone for the damage she caused, and perhaps restore a sense of integrity to her career.",
    "paragraphs": [
      "Eleanor Voss stepped into the seaside hotel with a practiced air of confidence, her notebook tucked under her arm like a shield against the world. The salty breeze tousled her hair, but she barely noticed, her mind already racing with questions. The murder of Hugo Vane was not just a story; it was a chance for redemption, a way to confront the guilt that had gnawed at her since that fateful article. She had once destroyed a family’s reputation with her words, and now, perhaps, she could rebuild something from the ashes.",
      "As she mingled with the hotel’s guests, her keen eyes observed the small gestures—the nervous twitches, the forced laughter, the glances that lingered just a moment too long. She had a knack for reading people, a skill honed by years of chasing leads and piecing together fragmented truths. Yet, beneath her charismatic exterior lay a tumultuous sea of self-doubt and remorse. What if her investigation led to another tragedy? What if she became the architect of someone else’s downfall?",
      "Eleanor’s curiosity about Vane’s shady dealings was more than just professional interest; it was deeply personal. She felt an almost magnetic pull towards the darker corners of the hotel, where secrets lingered like shadows. Each conversation she had with the suspects was laden with tension, and she couldn’t shake the feeling that she was walking a tightrope between justice and ruin. What she discovered could either free her from her past or bind her to it forever.",
      "In the quiet moments, when the din of the hotel faded into the background, Eleanor found herself reflecting on her choices. The pursuit of truth was often messy, and she wondered if she was prepared for the consequences. As she scribbled notes in her ever-present notebook, she could almost hear the echoes of her past mistakes. But this time, she was determined to get it right, to uncover the truth behind the delayed toast that had cost a man his life and perhaps set her free in the process."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected psychiatrist with a dark secret, Dr. Finch struggles to protect her career while facing the ghosts of her past that threaten to resurface.",
    "publicPersona": "Respected in her field, known for her empathetic approach.",
    "privateSecret": "Has a hidden history as a patient of the victim, who blackmailed her.",
    "motiveSeed": "Could lose her practice if the victim exposed her past.",
    "motiveStrength": "strong",
    "alibiWindow": "In her office during the murder, but unverified.",
    "accessPlausibility": "possible",
    "stakes": "Reputation and career on the line.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Dr. Finch speaks with a calm, measured tone, often punctuating her words with self-deprecating humor. She tends to over-explain her thoughts, revealing her inner turmoil and the weight of her secrets.",
    "signatureTic": "‘I suppose I should have seen that coming.’",
    "internalConflict": "Dr. Finch struggles with the shame of being blackmailed and the fear that her past will ruin her present.",
    "personalStakeInCase": "The murder could expose her hidden life, jeopardizing her career and her hard-earned reputation.",
    "paragraphs": [
      "Dr. Mallory Finch stood in front of her office mirror, adjusting her glasses as she practiced her calm demeanor. The seaside hotel was a far cry from her usual clinical setting, but today, she felt the weight of her secrets pressing down on her. Hugo Vane was not just a victim; he was a reminder of her vulnerability, a specter of her past that threatened to unravel everything she had worked for. She had once been his patient, and now the roles had reversed in the most disastrous way possible.",
      "As she navigated the hotel’s corridors, Dr. Finch maintained her professional facade, greeting guests with a warm smile that belied the turmoil inside. She was respected in her field, known for her empathetic approach, yet the thought of Vane’s blackmail sent shivers down her spine. If the truth came to light, her career would be in shambles, and her reputation—built painstakingly over years—would crumble like a house of cards.",
      "The murder investigation stirred a cocktail of anxiety and guilt within her. She had thought she was free of Vane’s grip, but now she felt the noose tightening. Each conversation with the other suspects felt like walking a tightrope; one wrong step, and she could fall into the abyss of her past. She often caught herself over-explaining her actions, a nervous habit that betrayed her inner conflict. ‘I suppose I should have seen that coming,’ she muttered to herself, the irony not lost on her.",
      "Dr. Finch’s journey through the case was not just about uncovering a murderer; it was a quest for personal redemption. She faced a dual battle—one against the shadows of her past and another against the societal expectations that defined her. As she delved deeper into the investigation, she knew that the truth could either liberate her or bind her in chains of shame. And as the stakes rose, she found herself wondering how far she was willing to go to protect her present."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer grappling with his family's past, Captain Hale must confront the shadows of his reputation as he navigates the treacherous waters of the murder investigation.",
    "publicPersona": "A decorated war hero with a stern demeanor.",
    "privateSecret": "Has a secret family connection to the victim's past scandals.",
    "motiveSeed": "Fear of his reputation being tarnished due to past associations.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the bar during the murder, but alone.",
    "accessPlausibility": "possible",
    "stakes": "Maintaining his family's honor.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Captain Hale speaks with a commanding presence, often using military jargon and a sardonic twist. His sentences are clipped, reflecting his no-nonsense attitude, but he occasionally allows a wry smile to break through his stern facade.",
    "signatureTic": "‘In my day, we handled things differently.’",
    "internalConflict": "Captain Hale is torn between his duty to protect his family's honor and the truth that could expose their past.",
    "personalStakeInCase": "The murder investigation threatens to unearth family secrets that could tarnish his legacy.",
    "paragraphs": [
      "Captain Ivor Hale surveyed the hotel lobby with a hawkish gaze, his military bearing evident in every stiff posture. The seaside breeze swirled around him, but he felt no comfort in its embrace. Hugo Vane’s murder was not just a matter of justice; it was a ticking clock that threatened to unravel a carefully constructed narrative of honor and duty. He had served his country with distinction, but now he faced a battle on a different front—one that could expose the dark undercurrents of his family’s history.",
      "In conversations with the other guests, Captain Hale maintained a stern demeanor, his words clipped and precise. He was a man of few words, but when he spoke, they carried the weight of authority. ‘In my day, we handled things differently,’ he often remarked, a sardonic edge to his tone. Yet, beneath that bravado lay a man grappling with the fear of what lay beneath the surface of his family’s past, a past that intertwined with Vane’s own scandals.",
      "As he sat alone in the bar, nursing a drink, Captain Hale reflected on the choices that had brought him to this moment. The shadows of his family’s reputation loomed large, and he felt the pressure to maintain their honor. The investigation threatened to expose connections he had long buried, and he wondered if he was prepared to face the fallout. Each suspect carried their own secrets, but Hale knew his was a ticking time bomb, ready to explode at the slightest provocation.",
      "His internal conflict was a storm he couldn’t ignore—a battle between loyalty to his family and the pursuit of truth. As he pieced together the fragments of the case, he found himself at a crossroads. Would he protect his family’s legacy at all costs, or would he allow the truth to surface, even if it meant tarnishing the name he had fought so hard to uphold? In the murky waters of the investigation, Captain Hale realized that honor was a fragile thing, easily shattered by the sharp edges of the past."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A charming socialite with ambitions as high as the waves crashing on the shore, Beatrice's desire for status and power leads her to the brink of desperation amid a murder investigation.",
    "publicPersona": "Charming and well-connected, always attending high-profile events.",
    "privateSecret": "In a secret affair with the victim, who threatened to end it.",
    "motiveSeed": "Fear of losing her social standing if the affair were revealed.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in the dining room with others, but no one remembers her.",
    "accessPlausibility": "easy",
    "stakes": "Her reputation and future prospects.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a fluid charm, often weaving in witty observations and polite yet cutting remarks. She has a tendency to laugh lightly, even at inappropriate moments, masking the tension beneath her surface.",
    "signatureTic": "‘Isn’t it just the most scandalous thing?’",
    "internalConflict": "Beatrice is torn between her ambition and the fear that her secrets will ruin her social standing.",
    "personalStakeInCase": "The murder investigation threatens to expose her affair and destroy her carefully cultivated reputation.",
    "paragraphs": [
      "Beatrice Quill glided through the hotel’s dining room with an effortless grace, her laughter ringing like chimes in the salty air. She was the very embodiment of charm, a socialite whose connections opened doors to the elite. Yet, beneath her polished exterior lay a tempest of ambition and fear. The murder of Hugo Vane was not just a tragedy; it was a threat to her carefully curated existence. ‘Isn’t it just the most scandalous thing?’ she quipped to a nearby guest, masking her anxiety with a practiced smile.",
      "As she mingled with the other guests, Beatrice’s laughter often danced around the edges of discomfort. Her words dripped with polite savagery, cutting through the pretense while maintaining her delicate facade. Yet, the truth hung heavily in the air—she had been involved with Vane, a secret affair that could unravel her social standing. Each time she caught a glimpse of the other suspects, she felt the walls closing in, her heart racing with the fear of exposure.",
      "The investigation felt like a high-stakes game, and Beatrice was determined to play it to her advantage. She had always known how to navigate the treacherous waters of social status, but this was a different kind of challenge. The stakes were higher than she had ever imagined, and with every passing moment, the threat of her secrets being unveiled loomed larger. Her alibi, a flimsy excuse wrapped in uncertainty, left her feeling vulnerable and exposed.",
      "With each interaction, Beatrice grappled with her internal conflict—her ambition clashed with the fear of losing everything she had worked for. The truth of her affair felt like a noose tightening around her neck, and she wondered how far she was willing to go to protect her reputation. As the investigation unfolded, Beatrice realized that the cost of ambition could be steep, and she would have to confront the truth if she wanted to survive the storm brewing on the horizon."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "The hotel manager with a charming smile, Sylvia hides a dark secret of embezzlement that threatens to unravel her career as she navigates the chaos of a murder investigation.",
    "publicPersona": "Well-regarded for her management skills and charm.",
    "privateSecret": "Struggles with embezzlement from the hotel funds, threatened by the victim.",
    "motiveSeed": "Desperate to keep her financial secrets hidden from the victim.",
    "motiveStrength": "moderate",
    "alibiWindow": "Busy managing guests during the murder with several witnesses.",
    "accessPlausibility": "easy",
    "stakes": "Her career and freedom at stake.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with a warm, engaging tone, using observational humor to connect with others. She has a tendency to make light of stressful situations, often using her charm to deflect deeper inquiries.",
    "signatureTic": "‘You know how it goes in hospitality!’",
    "internalConflict": "Sylvia is torn between her professional responsibilities and the fear of being discovered for her embezzlement.",
    "personalStakeInCase": "The murder investigation could expose her financial misdeeds, jeopardizing her career and freedom.",
    "paragraphs": [
      "Sylvia Trent moved through the hotel with the grace of a seasoned conductor, orchestrating the chaos of guests and staff with a smile that could light up the darkest corners. As the manager, she was well-regarded for her skills and charm, but beneath her polished exterior lay a brewing storm. The murder of Hugo Vane was an unwelcome disruption, one that threatened to expose her hidden financial struggles. ‘You know how it goes in hospitality!’ she often joked, but the laughter felt hollow in the face of her mounting fears.",
      "Every interaction with the guests was a delicate balancing act, a performance where one misstep could send her tumbling into chaos. Sylvia was busy managing the aftermath of the murder, surrounded by witnesses who could vouch for her whereabouts, yet she felt the weight of her secret pressing down on her. The irony of her situation was not lost on her; she had dedicated her life to maintaining order, and yet her world felt like it was spiraling out of control. The threat of exposure loomed large, and she could almost hear the clock ticking down.",
      "In conversations with the other suspects, Sylvia's observational humor served as both a shield and a sword. She deflected deeper inquiries with light-hearted remarks, masking her anxiety behind a facade of charm. Yet, as the investigation unfolded, she found herself grappling with her internal conflict—her professional responsibilities clashed with the fear of being discovered. Each time a suspect spoke of Vane's influence, she felt a chill run down her spine, the specter of her embezzlement hovering just out of sight.",
      "As the stakes rose and the investigation deepened, Sylvia realized that she was caught in a web of her own making. The murder investigation could unravel everything she had built, and she was left to wonder how far she would go to protect her career and her freedom. In the chaotic world of hospitality, she had always been the one holding the reins, but now she felt more like a marionette, dancing on strings that threatened to snap at any moment."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A wealthy businessman whose cutthroat tactics have earned him both admiration and animosity, Hugo’s unethical practices ultimately lead him to a tragic end.",
    "publicPersona": "Wealthy and influential, known for his cutthroat business strategies.",
    "privateSecret": "Was involved in unethical business practices that could ruin his reputation.",
    "motiveSeed": "If exposed, he stands to lose everything he built.",
    "motiveStrength": "compelling",
    "alibiWindow": "N/A",
    "accessPlausibility": "possible",
    "stakes": "His empire and legacy.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Hugo spoke with the authority of a man accustomed to getting what he wanted, his sentences often laced with condescension. He had a tendency to dismiss others with a wave of his hand, reflecting his belief in his own superiority.",
    "signatureTic": "‘This is how business is done.’",
    "internalConflict": "Hugo’s unethical practices weigh heavily on him, yet he believes he is above the consequences.",
    "personalStakeInCase": "His murder represents the end of a life built on questionable decisions, and the potential exposure of his misdeeds threatens to obliterate his empire.",
    "paragraphs": [
      "Hugo Vane was the epitome of wealth and influence, a man whose very presence commanded attention. With an air of superiority, he moved through the hotel as if it were an extension of his empire. Yet, beneath the polished surface lay a dark underbelly—his involvement in unethical business practices that could shatter the legacy he had built. ‘This is how business is done,’ he would often declare, but the truth was that his cutthroat tactics had earned him as many enemies as allies.",
      "In conversations with others, Hugo exuded an air of condescension, dismissing those he deemed beneath him with a wave of his hand. He was a master at asserting his dominance, but as the murder investigation unfolded, the walls began to close in. The very tactics that had brought him success now felt like a noose tightening around his neck. He had always believed he was above the consequences, but the reality of his situation was beginning to sink in.",
      "The stakes of his life were steep; if exposed, he stood to lose everything he had meticulously crafted. Each encounter with his suspects felt like a game of chess, with every move calculated yet fraught with danger. The irony of his situation was not lost on him; a man who had built his empire on the backs of others was now at the mercy of their secrets. He had always been in control, but now he found himself ensnared in a web of his own making.",
      "Hugo’s internal conflict was a silent storm; he felt the weight of his choices pressing down on him, yet he clung to the belief that he could navigate through the chaos unscathed. However, as the investigation deepened, he realized that the very empire he had built could crumble at the slightest revelation. The murder of Hugo Vane marked the end of a life defined by ambition and ruthlessness, leaving behind a legacy that would forever be shrouded in shadows."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Coral Crest Hotel",
    "type": "seaside hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A sprawling seaside hotel, The Coral Crest blends Art Deco elegance with Colonial Revival charm, perched on a secluded stretch of the Brighton coast.",
    "visualDescription": "The exterior showcases a pale blue façade with sweeping balconies, while the interior boasts polished wood and glass chandeliers reflecting the muted light of the overcast sky.",
    "atmosphere": "An atmosphere thick with tension, underscored by the echoes of wartime uncertainty.",
    "paragraphs": [
      "The Coral Crest Hotel stands resolute against the churning grey sea, its Art Deco lines softened by the salty air and the wear of time. The grand lobby welcomes guests with a sweeping staircase and plush sofas, while the scent of dampness mingles with the lingering aroma of waxed floors. Outside, the waves crash rhythmically, a constant reminder of the isolation that surrounds this coastal retreat. The hotel, with its ocean-view balconies, offers a sense of luxury, yet whispers of unease linger in the corners, hinting at secrets hidden within its walls.",
      "As the rain begins to patter against the windows, the atmosphere shifts, the light dimming to a muted glow. Guests huddle in the lounge, voices hushed, casting wary glances at each other. The distant sound of a radio crackles to life, broadcasting news of the world beyond their refuge, a world still grappling with the aftermath of war. The Coral Crest, while beautiful, becomes a crucible of tension where every creak of the floorboards and flicker of candlelight heightens the suspense of the unknown.",
      "In the evenings, the hotel transforms under the flickering glow of gas lamps, shadows dancing across the walls. The once vibrant chatter dims, replaced by the occasional clink of glass and the soft rustle of silk dresses. Outside, the ocean roars, an untamed beast, while inside, the guests’ secrets swirl like the mist outside, thickening the air with anticipation. Each room holds a mystery, each hallway an echo of past conversations, as the Coral Crest becomes a stage for the unfolding drama of human lives forever altered by conflict."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of the coastal climate, creating a moody and damp environment.",
    "timeFlow": "Three days of mounting tension, leading to a climactic revelation.",
    "mood": "Tense and uncertain, heightened by recent wartime experiences and the lingering effects of the conflict.",
    "eraMarkers": [
      "Radio broadcasting news updates",
      "Early television sets in the lounge",
      "Military radar equipment on the coast"
    ],
    "sensoryPalette": {
      "dominant": "Chill sea air mixed with damp wood",
      "secondary": [
        "Worn leather and polished brass",
        "Salty ocean breeze and candle wax"
      ]
    },
    "paragraphs": [
      "The Coral Crest Hotel envelops visitors in a world suspended between past elegance and present uncertainty. The air, thick with the scent of salt and dampness, carries whispers of secrets waiting to be uncovered. As guests navigate narrow hallways, each corner and shadow seems to hold a story, a piece of the puzzle that binds them together in this isolated haven. The echoes of wartime experiences linger, creating a palpable tension that dances in the air, urging them to uncover the truth that lies just beneath the surface.",
      "With every passing hour, the hotel morphs from a sanctuary into a stage where anxiety rises like the tide. The distant sound of waves crashing against the cliffs mirrors the turmoil within, as guests grapple with their own hidden fears and desires. The Coral Crest is not merely a backdrop; it is a living entity, absorbing their hopes and suspicions, waiting for the moment when the truth will finally surface amidst the stormy skies."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Oceanview Lounge",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Elegant furnishings with ocean views, dark wood paneling, and soft lighting create an intimate atmosphere.",
      "sensoryDetails": {
        "sights": [
          "glimmering crystal chandeliers",
          "ocean waves crashing outside",
          "polished mahogany bar",
          "plush velvet armchairs"
        ],
        "sounds": [
          "distant thunder rolling",
          "clinking of glasses",
          "soft jazz playing on the radio",
          "muffled conversations",
          "the crackle of a fire"
        ],
        "smells": [
          "cigar smoke and whiskey",
          "sea-salt air",
          "freshly polished wood",
          "soft leather upholstery",
          "candle wax melting"
        ],
        "tactile": [
          "smooth glass in hand",
          "soft velvet against skin",
          "chill from the open window",
          "cool marble tabletops",
          "warmth of the fire's glow"
        ]
      },
      "accessControl": "Accessible to all guests, but restricted to staff-only areas behind the bar; room keys required for private discussions.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down glass",
            "grey light filtering through clouds",
            "mist on the ocean surface",
            "wet umbrellas by the entrance",
            "dimly lit corners"
          ],
          "sounds": [
            "steady patter of rain",
            "distant foghorns",
            "soft rustling of newspapers",
            "quiet footsteps on wet floors",
            "the hum of the heating system"
          ],
          "smells": [
            "freshly brewed coffee",
            "damp wood and stone",
            "wet earth from the garden",
            "citrus from breakfast",
            "mildew on the window sills"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey clouds",
            "shadows creeping across the floor",
            "dust motes dancing in the air",
            "tattered curtains swaying",
            "faded photographs on the walls"
          ],
          "sounds": [
            "the creak of old floorboards",
            "the distant tick of a clock",
            "whispers of guests sharing secrets",
            "the wind rattling the windows",
            "the low hum of conversation"
          ],
          "smells": [
            "old books and dust",
            "the scent of polished furniture",
            "woodsmoke from an outside fire",
            "faint perfume lingering",
            "the tang of salt in the air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset over the ocean",
            "candle flames flickering",
            "glasses catching the light",
            "guests in evening attire",
            "the glow of the fireplace"
          ],
          "sounds": [
            "laughter ringing out",
            "the low murmur of voices",
            "the clink of ice in drinks",
            "music from the radio",
            "the gentle lapping of waves"
          ],
          "smells": [
            "freshly baked bread",
            "scent of jasmine from the garden",
            "cinnamon from dessert",
            "the rich aroma of coffee",
            "smoky embers from the fireplace"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanview Lounge, where the sea meets the elegance of the hotel, has now become the epicenter of intrigue. Guests once gathered here for leisure, but now the air is thick with suspicion and whispers. The elegant furnishings seem to absorb the tension, their plushness contrasting sharply with the cold reality of the crime that has unfolded. Outside, the waves crash relentlessly, mirroring the turmoil within, while the flickering candlelight casts long shadows over the faces of those present, each hiding their own secrets.",
        "As the rain begins to fall more heavily, the lounge transforms further, becoming a cocoon of conspiratorial glances and hushed tones. The distant sound of thunder echoes the unease within the room, as guests cling to their drinks, seeking comfort in the familiar while grappling with the unknown. Every creak of the floorboards and every clink of glass seems amplified, creating an atmosphere ripe for revelations and confrontations."
      ]
    },
    {
      "id": "library",
      "name": "The Grand Library",
      "type": "interior",
      "purpose": "Gathering space and clue discovery",
      "visualDetails": "A cavernous room lined with shelves of dusty books, leather armchairs, and a grand fireplace that dominates one wall.",
      "sensoryDetails": {
        "sights": [
          "dusty tomes with worn spines",
          "flickering firelight casting shadows",
          "rich mahogany paneling",
          "stacks of papers on the reading table",
          "an ornate globe in the corner"
        ],
        "sounds": [
          "crackling firewood",
          "pages turning softly",
          "the rustle of fabric as chairs shift",
          "the low hum of the wind outside",
          "distant footsteps echoing in the hall"
        ],
        "smells": [
          "old paper and leather bindings",
          "smoky wood from the fireplace",
          "the faint scent of pipe tobacco",
          "dust motes in the air",
          "the earthy aroma of the books"
        ],
        "tactile": [
          "rough texture of old book spines",
          "smooth leather armrests",
          "warmth from the fireplace",
          "cool marble tabletop",
          "the weight of a heavy book"
        ]
      },
      "accessControl": "Open to all guests during daylight hours; locked at night; staff-only area for rare books.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through rain-spattered windows",
            "shadows deepening in the corners",
            "wet newspapers on the table",
            "water droplets clinging to the glass",
            "the glow of the fireplace"
          ],
          "sounds": [
            "the steady drumming of rain on the roof",
            "the rustle of pages turning",
            "the crack of thunder in the distance",
            "the soft creak of chairs",
            "distant echoes of laughter"
          ],
          "smells": [
            "freshly brewed tea",
            "the scent of damp wood",
            "earthy notes from the garden",
            "the mustiness of old books",
            "the sweetness of pastries from the kitchen"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows stretching across the floor",
            "the flicker of firelight against walls",
            "dust motes swirling in the air",
            "the outline of a figure in the corner",
            "a half-open book lying on a table"
          ],
          "sounds": [
            "the low crackling of the fire",
            "the soft murmur of voices",
            "the rustle of paper",
            "the ticking of a clock",
            "a sudden gust of wind outside"
          ],
          "smells": [
            "the scent of polished wood",
            "the lingering aroma of tobacco",
            "the sweetness of old books",
            "the smell of rain on stone",
            "the faint hint of flowers from outside"
          ],
          "mood": "suspenseful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling in from the windows",
            "the glow of the fireplace",
            "shadows dancing on the walls",
            "the twinkle of stars outside",
            "the silhouette of a figure reading"
          ],
          "sounds": [
            "the crackling of the fire",
            "soft laughter from the lounge",
            "the distant sound of waves",
            "pages turning slowly",
            "the tick of a clock"
          ],
          "smells": [
            "the comforting scent of vanilla",
            "the warm aroma of baked goods",
            "the sharpness of ink on paper",
            "the freshness of the evening air",
            "the earthiness of the library's old books"
          ],
          "mood": "reflective"
        }
      ],
      "paragraphs": [
        "The Grand Library, a sanctuary of knowledge and secrets, stands as a testament to the hotel’s storied past. Shelves lined with dusty tomes whisper tales of adventure and intrigue, inviting guests to lose themselves in their pages. The grand fireplace crackles softly, casting a warm glow that contrasts with the chill of the coastal air. Here, amidst the rich mahogany and leather, guests gather to discuss matters of the heart and the mind, unaware that the shadows around them may conceal more than just forgotten stories.",
        "As night falls, the atmosphere shifts, the library transforming into a hushed haven for contemplation and speculation. The flickering firelight dances across the walls, creating an intimate setting for whispered conversations and furtive glances. In this secluded space, the tension mounts, as the weight of the past presses down on those who dare to uncover the truth hidden within the pages of the books that surround them. Each creak of the floorboards seems to echo the unspoken fears of the guests, binding them together in a shared quest for answers."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Crystal Dining Room",
      "type": "interior",
      "purpose": "Gathering space for meals and socializing",
      "visualDetails": "A grand room adorned with crystal chandeliers, white tablecloths, and views of the ocean through large windows.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on white tablecloths",
          "crystal chandeliers sparkling",
          "fresh flowers in centerpieces",
          "waves crashing against the shore",
          "elegantly dressed guests"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft music playing from a gramophone",
          "murmurs of conversation",
          "the rustle of napkins",
          "the distant thud of waves"
        ],
        "smells": [
          "aroma of roasted meats",
          "freshly baked bread",
          "scent of herbs and spices",
          "the sweetness of dessert",
          "the tang of sea air"
        ],
        "tactile": [
          "smooth porcelain plates",
          "the weight of a wine glass",
          "the coolness of silver cutlery",
          "soft linen napkins",
          "the warmth of freshly baked bread"
        ]
      },
      "accessControl": "Open to all guests during meal times, staff-only areas for kitchen access.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "cloudy skies reflected in windows",
            "water droplets on glass",
            "dim light filtering through",
            "the outline of the ocean in the distance",
            "empty tables awaiting breakfast"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "the clink of dishes being prepared",
            "the hum of conversation from the kitchen",
            "the rustle of newspapers",
            "the distant sound of thunder"
          ],
          "smells": [
            "fresh coffee brewing",
            "the scent of eggs frying",
            "the aroma of pastries",
            "the dampness of the air",
            "the hint of sea salt"
          ],
          "mood": "anticipatory"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light filtering through windows",
            "shadows creeping across tables",
            "the glint of silverware",
            "guests peering out at the ocean",
            "flowers wilting in the vase"
          ],
          "sounds": [
            "the soft murmur of conversation",
            "the clinking of glasses",
            "the rustle of menus being flipped",
            "the distant sound of waves",
            "the crackle of a fire in the corner"
          ],
          "smells": [
            "the aroma of simmering sauces",
            "freshly baked cookies cooling",
            "the scent of herbs wafting",
            "the tang of citrus from desserts",
            "the faint smell of rain"
          ],
          "mood": "uneasy"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "twinkling stars visible through windows",
            "the glow of candlelight",
            "elegantly dressed guests mingling",
            "the reflection of the ocean in glass",
            "fresh flowers brightening the tables"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "soft jazz from a gramophone",
            "the murmur of happy conversations",
            "the gentle lapping of waves",
            "the crackle of a fire in the corner"
          ],
          "smells": [
            "the rich aroma of roasted meats",
            "the scent of fresh herbs",
            "sweetness of desserts",
            "the tang of a fine wine",
            "the crispness of the sea air"
          ],
          "mood": "celebratory"
        }
      ],
      "paragraphs": [
        "The Crystal Dining Room, resplendent in its elegance, serves as the heart of the Coral Crest Hotel, where guests gather to indulge in sumptuous meals and share stories. Crystal chandeliers cast a warm glow over the tables, each adorned with pristine white linens and delicate flowers. The air is filled with the enticing aroma of roasted meats and fresh bread, enticing guests to savor the culinary delights prepared by the skilled kitchen staff. Yet, beneath the surface of this refined atmosphere lies an undercurrent of tension, as conversations take on a hushed tone, secrets simmering just beneath the surface.",
        "As evening descends, the dining room transforms into a haven of celebration, yet the lingering shadows remind all present that not everything is as it seems. The sounds of laughter and clinking glasses fill the space, but fleeting glances exchanged between guests hint at unspoken truths. The ocean, visible through the expansive windows, crashes against the shore, a reminder of the tumultuous world outside, while inside, the warmth of the gathering offers a brief respite from the storm of uncertainty that looms over the Coral Crest."
      ]
    },
    {
      "id": "the_beach",
      "name": "The Private Beach",
      "type": "exterior",
      "purpose": "Secluded area for reflection and discovery",
      "visualDetails": "A narrow stretch of sand bordered by jagged rocks, with crashing waves and a backdrop of cliffs.",
      "sensoryDetails": {
        "sights": [
          "foamy waves crashing against rocks",
          "seagulls circling overhead",
          "driftwood scattered along the shore",
          "distant cliffs shrouded in mist",
          "shadows stretching across the sand"
        ],
        "sounds": [
          "crashing waves echoing",
          "seagulls calling",
          "the whisper of the wind",
          "the crunch of sand underfoot",
          "the distant rumble of thunder"
        ],
        "smells": [
          "salty sea air",
          "the earthy scent of wet sand",
          "the fragrance of wildflowers",
          "the tang of seaweed",
          "the freshness of rain-soaked earth"
        ],
        "tactile": [
          "gritty sand between toes",
          "cool ocean water lapping at ankles",
          "the rough texture of driftwood",
          "the chill of the breeze",
          "smooth pebbles underfoot"
        ]
      },
      "accessControl": "Accessible to all guests, but secluded from the main road; requires a short walk through a narrow path.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds looming overhead",
            "waves crashing with more intensity",
            "wet sand reflecting light",
            "drizzle creating patterns on the surface",
            "pools of water forming in depressions"
          ],
          "sounds": [
            "the roar of waves amplified",
            "the patter of rain on sand",
            "the call of wet seagulls",
            "the rustle of wet grasses",
            "the distant rumble of thunder"
          ],
          "smells": [
            "the sharpness of rain on salt",
            "the scent of wet earth",
            "the fragrance of soaked wildflowers",
            "the tangy aroma of seaweed",
            "the freshness of the ocean"
          ],
          "mood": "brooding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "clouds hanging low on the horizon",
            "waves crashing with a dull thud",
            "puddles forming in the sand",
            "the outline of cliffs against the grey sky",
            "driftwood scattered like forgotten memories"
          ],
          "sounds": [
            "the steady rhythm of waves",
            "the soft calls of distant seagulls",
            "the rustle of sand in the breeze",
            "the low murmur of the ocean",
            "the creaking of rocks shifting"
          ],
          "smells": [
            "the mustiness of wet sand",
            "the saltiness of the sea",
            "the earthy scent of driftwood",
            "the tang of seaweed",
            "the freshness of rain in the air"
          ],
          "mood": "reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting orange hues on the water",
            "silhouettes of rocks against the sky",
            "stars beginning to twinkle above",
            "the last light glimmering on the waves",
            "the outline of guests strolling along the shore"
          ],
          "sounds": [
            "gentle lapping of waves",
            "seagulls settling for the night",
            "the laughter of guests nearby",
            "the crackle of a small fire",
            "the distant sound of music from the hotel"
          ],
          "smells": [
            "the scent of the ocean breeze",
            "the sweetness of flowers blooming",
            "the earthy aroma of sand",
            "the freshness of the evening air",
            "the faint hint of smoke from a fire"
          ],
          "mood": "serene"
        }
      ],
      "paragraphs": [
        "The Private Beach, a narrow stretch of sand bordered by jagged rocks, offers a secluded escape for the guests of the Coral Crest Hotel. Here, the sound of crashing waves mingles with the cries of seagulls, creating a symphony of nature that evokes both tranquility and introspection. The air is thick with the scent of salt and wet earth, an olfactory reminder of the ocean's power and beauty. Shadows stretch across the sand as the sun dips below the horizon, offering a moment of respite from the mounting tension inside the hotel.",
        "As the day transitions to night, the beach transforms into a canvas painted with the hues of twilight. The gentle lapping of waves becomes a lullaby, while the distant sounds of laughter from the hotel create a sense of connection to the world beyond the shore. Yet, the isolation of the beach also invites reflection, as guests ponder the mysteries that linger, both within and outside the walls of the Coral Crest. This tranquil setting belies the undercurrents of tension, creating a stark contrast to the secrets hidden within the hotel."
      ]
    }
  ],
  "note": "",
  "cost": 0.0031715458499999996,
  "durationMs": 34333
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1943,
    "month": "May",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool breezes from the sea"
    ],
    "daylight": "Days are gradually lengthening, with daylight lasting until about eight o'clock in the evening, though the coastal fog often rolls in early.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel dining area settles down after dinner service.",
    "holidays": [
      "May Day (May 1)",
      "Victory in Europe Day (expected May 8, 1945)"
    ],
    "seasonalActivities": [
      "seaside strolls along the damp beach",
      "outdoor picnics under cloudy skies",
      "flower planting in local gardens"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tweed blazers",
        "high-waisted trousers",
        "button-down shirts with narrow ties"
      ],
      "casual": [
        "lightweight cotton shirts",
        "khaki shorts",
        "canvas loafers"
      ],
      "accessories": [
        "fedora hats",
        "leather gloves",
        "suspenders"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with floral patterns",
        "tailored suits with peplum waistlines",
        "silk blouses with puffed sleeves"
      ],
      "casual": [
        "ankle-length skirts with fitted bodices",
        "light cardigans",
        "simple cotton blouses"
      ],
      "accessories": [
        "string of pearls",
        "wide-brimmed hats",
        "matching gloves"
      ]
    },
    "trendsOfTheMoment": [
      "utility clothing influenced by wartime rationing",
      "bold floral prints",
      "shorter hemlines for spring dresses"
    ],
    "socialExpectations": [
      "men are expected to be in uniform or smart attire",
      "women are contributing to the war effort while maintaining traditional roles",
      "courting is becoming more casual and less formal due to limited resources"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Allied forces prepare for the invasion of Sicily",
      "Tension rises as the Battle of the Atlantic continues",
      "Domestic rationing measures impact food and clothing supplies"
    ],
    "politicalClimate": "The political atmosphere is tense, with various factions advocating for different strategies in the ongoing war, while citizens grapple with the impact of rationing.",
    "economicConditions": "The economy is strained due to war expenditures, with limited supplies leading to higher prices and shortages of everyday goods.",
    "socialIssues": [
      "women's rights are slowly evolving as they take on roles traditionally held by men",
      "racial tensions are highlighted as minorities contribute to the war effort",
      "mental health issues stemming from wartime anxiety are becoming more recognized"
    ],
    "internationalNews": [
      "Reports of Allied victories in North Africa",
      "Increased bombing campaigns in Germany",
      "Diplomatic tensions with Axis powers intensifying"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Don't Sit Under the Apple Tree' by The Andrews Sisters",
        "'The White Cliffs of Dover' by Vera Lynn",
        "'I’ll Be Seeing You' by Bing Crosby"
      ],
      "films": [
        "Casablanca",
        "The More the Merrier",
        "Since You Went Away"
      ],
      "theater": [
        "Oklahoma!",
        "This is the Army",
        "The Glass Menagerie"
      ],
      "radio": [
        "Fibber McGee and Molly",
        "The Shadow",
        "The Lone Ranger"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Little Prince by Antoine de Saint-Exupéry",
        "The Glass Menagerie by Tennessee Williams",
        "The Grapes of Wrath by John Steinbeck"
      ],
      "popularGenres": [
        "war fiction",
        "mystery thrillers",
        "domestic dramas"
      ]
    },
    "technology": {
      "recentInventions": [
        "improved radar technology",
        "shortwave radios for better communication",
        "advancements in military vehicle design"
      ],
      "commonDevices": [
        "radio sets in homes",
        "early television sets in urban areas",
        "military communication devices"
      ],
      "emergingTrends": [
        "increased use of metal detectors in security",
        "development of synthetic materials for clothing",
        "advancements in medical technologies related to wartime injuries"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "Coal scuttle refill: one shilling sixpence",
        "Taxi across town: two shillings"
      ],
      "commonActivities": [
        "gathering for community events",
        "attending local dances",
        "participating in war bond drives"
      ],
      "socialRituals": [
        "evening gatherings to listen to the radio",
        "Sunday family dinners with rationed meals",
        "local fundraisers for war efforts"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "the upper class is viewed with suspicion for their wealth amidst wartime struggles",
      "working-class solidarity is emphasized as communities come together"
    ],
    "gender": [
      "women are increasingly stepping into roles traditionally held by men",
      "the notion of femininity is evolving with women in factories and military roles",
      "societal expectations for women to maintain domestic duties persist"
    ],
    "race": [
      "racial segregation persists, but wartime efforts are slowly fostering a sense of unity",
      "minority contributions to the war effort are beginning to gain recognition"
    ],
    "generalNorms": [
      "community support for the war is expected",
      "patriotism is prevalent, with symbols like the Union Jack prominently displayed",
      "efficiency and resourcefulness are highly valued due to rationing"
    ]
  },
  "atmosphericDetails": [
    "The salty breeze carries the scent of rain mingled with the tang of the ocean, creating a damp chill in the air.",
    "Soft whispers of conversation float through the air as guests at the seaside hotel share anxious glances, each lost in their own thoughts.",
    "The distant sound of waves crashing against the rocky shore blends with the occasional murmur of a radio broadcasting the latest war news, punctuating the tension in the atmosphere."
  ],
  "paragraphs": [
    "In May 1943, the seaside hotel stands as a weathered sentinel against the ever-changing skies. Overcast and moody, the air is thick with anticipation and the faint scent of rain that hints at the ever-looming storm. The beach stretches out before the hotel, damp and glistening, as guests wander along the shore, their footsteps muffled by the soft, wet sand. The long spring days are gradually stretching into evening, casting a dim light that shifts unnervingly, much like the uncertainty that clouds the minds of the patrons indoors. Conversations are hushed yet charged with the undercurrents of the war, each word fraught with hidden meanings and unspoken fears.",
    "Fashion in this era reflects the dual pressures of wartime and the desire for normalcy. Men wear tailored tweed blazers over high-waisted trousers, a nod to both style and functionality, while women don tea-length dresses adorned with bold floral prints, complemented by delicate accessories like pearls and wide-brimmed hats. The war has influenced utility clothing, and every piece is a calculated choice, reflecting both personal identity and societal expectations. At times, guests at the hotel can be seen adjusting their gloves or smoothing their skirts, each gesture a silent reminder of the elegance that persists in the face of hardship.",
    "Daily life is punctuated by the rhythms of rationing and wartime efforts; a loaf of bread costs four pence, and community gatherings often revolve around fundraising for war bonds. The atmosphere is thick with a sense of camaraderie, yet the strain of uncertainty looms large. Guests find solace in the familiar sounds of the radio, where news updates about the war intermingle with popular tunes. As the evening deepens, the hotel's dining area transforms into a space of intimate conversations, laughter, and the occasional nervous glance as individuals navigate their own secrets amid the backdrop of a world at war. The rituals of listening to the radio and attending local dances are lifelines, providing connection and respite in an otherwise tense reality."
  ],
  "note": "",
  "cost": 0.0011606364,
  "durationMs": 16279
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of guests and staff at a seaside hotel grapple with the tensions of post-war society while a mysterious death reveals hidden loyalties and the shadows of past conflicts.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII has shifted gender roles, creating new tensions among the upper class and staff, while economic adjustments and Cold War anxieties heighten social pressure and distrust."
  },
  "setting": {
    "location": "A sprawling seaside hotel on a secluded stretch of coastline.",
    "institution": "seaside hotel",
    "weather": "Overcast with occasional rain, typical of the coastal climate."
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
    "id": "tonic_water_id",
    "value": "eight ounces",
    "description": "The amount of tonic water consumed by the victim during the gathering."
  },
  {
    "id": "poison_amount_id",
    "value": "two milligrams",
    "description": "The lethal dose of the poison added to the tonic water."
  },
  {
    "id": "dinner_time_id",
    "value": "half past eight at night",
    "description": "The time the victim was last seen drinking the tonic water before symptoms appeared."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 23,
  "countsByPlacement": {
    "early": 8,
    "mid": 14,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 22,
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
      "category": "physical"
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
      "category": "behavioral"
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
      "category": "testimonial"
    },
    {
      "id": "clue_9",
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
      "id": "clue_id_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_id_5",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_7",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
