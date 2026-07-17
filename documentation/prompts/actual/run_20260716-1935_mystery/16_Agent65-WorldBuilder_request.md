# Actual Prompt Record

- Run ID: `mystery-1784230510658`
- Project ID: ``
- Timestamp: `2026-07-16T19:40:25.177Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `0369ed5de3675235`

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
    "title": "Echoes of Identity",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A grand seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "acoustic manipulation"
    }
  },
  "death_method": "struck with a heavy object",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp-minded investigator known for her intuition.",
      "private_secret": "Struggles with self-doubt despite her success.",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "To solve the case and uphold her reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Witness",
      "relationships": [
        "Hugo Vane (colleague)"
      ],
      "public_persona": "A respected physician with a keen interest in acoustics.",
      "private_secret": "Harbors resentment towards Hugo for professional rivalry.",
      "motive_seed": "Jealousy over professional recognition.",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "was in the vicinity of the murder"
      ],
      "behavioral_tells": [],
      "stakes": "To protect her career and reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Beatrice Quill (friend)"
      ],
      "public_persona": "A retired naval officer, seen as authoritative and composed.",
      "private_secret": "Struggles with alcohol dependency.",
      "motive_seed": "Unresolved past conflict with Hugo.",
      "motive_strength": "moderate",
      "alibi_window": "9:15 PM to 9:45 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Had access to the victim's room"
      ],
      "behavioral_tells": [],
      "stakes": "To maintain his honor and reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Hugo Vane (colleague)"
      ],
      "public_persona": "A charming socialite with a keen interest in music.",
      "private_secret": "Has a history of romantic entanglements.",
      "motive_seed": "Desire to hide a past affair with Hugo.",
      "motive_strength": "high",
      "alibi_window": "9:00 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "To protect her reputation and social standing.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Hugo Vane (rival)"
      ],
      "public_persona": "An ambitious journalist with a flair for drama.",
      "private_secret": "Secretly gathered information for a scandalous article.",
      "motive_seed": "Desire to expose Hugo for personal gain.",
      "motive_strength": "high",
      "alibi_window": "9:15 PM to 9:45 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "To advance her career at any cost.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Dr. Mallory Finch (colleague)"
      ],
      "public_persona": "A charismatic businessman with a successful career.",
      "private_secret": "Had enemies due to his ruthless nature.",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "evening",
      "access_plausibility": "none",
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
      "Beatrice Quill"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a charity gala at a grand seaside hotel, Hugo Vane is found dead in his room, struck with a heavy object, and the investigation uncovers a web of deceit involving mistaken identities and concealed motives."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A gramophone recording is played in a soundproof room to create a false alibi for the murderer, masking the true time of death.",
      "delivery_path": [
        {
          "step": "Beatrice Quill plays a gramophone recording while committing the murder."
        },
        {
          "step": "Witnesses hear the music coming from the soundproof room, believing it to be an alibi."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is concealed, leading to misdirection regarding the identity of the murderer."
    }
  },
  "false_assumption": {
    "statement": "The gramophone recording was played at the time of the murder.",
    "type": "identity",
    "why_it_seems_reasonable": "Witnesses claim to hear the music from the room, leading them to believe it was played during the murder.",
    "what_it_hides": "The actual time of death and the identity of the murderer."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Captain Hale was known to have a conflict with Hugo Vane.",
      "Witnesses claim they saw him near the victim's room just before the murder."
    ],
    "the_one_flaw": "Witness accounts were misled by the acoustics of the hotel, and Hale had a strong alibi.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken gramophone needle found near the victim.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The needle broke during a previous use unrelated to the murder.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Witnesses recall a loud argument between Hugo and Beatrice.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The argument was a misunderstanding about a business deal.",
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
    "rationale": "All suspects were present at the hotel during the gala and had potential motives."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "9:00 PM",
        "9:30 PM"
      ],
      "windows": [
        "9:00 PM to 9:30 PM"
      ],
      "contradictions": [
        "Witnesses claim to have heard the music at 9:15 PM, but the murder occurred before that."
      ]
    },
    "access": {
      "actors": [
        "Beatrice Quill"
      ],
      "objects": [
        "gramophone",
        "heavy object"
      ],
      "permissions": [
        "Access to the soundproof room"
      ]
    },
    "physical": {
      "laws": [
        "Sound waves can be misdirected through architectural features."
      ],
      "traces": [
        "Broken needle found at the scene."
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses trust the sound they hear."
      ],
      "authority_sources": [
        "Captain Hale's status as a respected officer."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall hearing music from the soundproof room around quarter past nine.",
        "correction": "This suggests the murder occurred before the music started.",
        "effect": "Narrows opportunity window to before 9:15 PM.",
        "required_evidence": [
          "Witness statements about the music timing.",
          "Timeline of events leading to the murder."
        ],
        "reader_observable": true
      },
      {
        "observation": "The gramophone needle shows a unique scratch pattern.",
        "correction": "This indicates the gramophone was used recently and could have been tampered with.",
        "effect": "Eliminates Dr. Mallory Finch due to her alibi being confirmed during the time of the needle's use.",
        "required_evidence": [
          "Gramophone needle evidence.",
          "Dr. Finch's confirmed alibi."
        ],
        "reader_observable": true
      },
      {
        "observation": "An unusual echo pattern was noted by guests in the hallway near the victim's room.",
        "correction": "This reveals that voices could have been mislocalized, affecting witness accounts.",
        "effect": "Narrows suspect pool to Beatrice Quill and Sylvia Trent.",
        "required_evidence": [
          "Guest statements about the echo pattern.",
          "Hotel architectural layout."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Staging a reenactment of the events leading to the murder using the gramophone to test the sound direction based on physical evidence.",
    "knowledge_revealed": "The sound from the gramophone does not match the witness accounts, revealing the true time of death.",
    "pass_condition": "Beatrice Quill cannot reproduce the witness's sound direction during the reenactment.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_culprit_direct_1",
      "clue_10",
      "clue_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements (early) provide a timeline for the music. Step 2: The gramophone needle evidence (mid) confirms usage. Step 3: Echo patterns (mid) lead to suspect narrowing. Step 4: The reenactment (early Act III) disproves Beatrice's account."
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
      "test_type": "Acoustic reenactment"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi during the time of the needle's use.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 9:15 PM to 9:45 PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 9:15 PM to 9:45 PM",
        "supporting_clues": []
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
    "identity_rules": [
      {
        "character_name": "Beatrice Quill",
        "revealed_in_act": 3,
        "before_reveal_reference": "the charming socialite",
        "after_reveal_reference": "the murderer"
      }
    ],
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
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Cross-check contradiction"
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
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
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
    "summary": "Eleanor Voss is a vibrant local artist whose cheerful demeanor hides a tumultuous inner world filled with unrequited love and a thirst for truth.",
    "publicPersona": "An outgoing and charming artist known for her vibrant seaside landscapes, Eleanor captivates locals and tourists alike with her infectious energy and artistic talent.",
    "privateSecret": "Struggles with unrequited love for Captain Ivor Hale, which she hides beneath her cheerful demeanor, creating a facade that often leaves her feeling isolated.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "Was in her studio preparing for an exhibition when she heard the commotion, a perfect cover but one that leaves her feeling guilty for not being present.",
    "accessPlausibility": "easy",
    "stakes": "Determined to uncover the truth to gain closure for both herself and the community, she finds herself drawn into the shadows of a murder investigation that threatens to unravel her world.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Her speech is often punctuated by light-hearted jests, a habit of painting vivid pictures with her words, and a tendency to speak in a melodic, flowing rhythm.",
    "signatureTic": "‘Isn’t life just a canvas waiting for a brushstroke?’",
    "internalConflict": "Eleanor wrestles with her feelings for Ivor, torn between her admiration for him and the painful knowledge that he may never return her affections.",
    "personalStakeInCase": "The crime matters personally as it threatens the safety of her community and serves as a catalyst for her to confront her feelings for Ivor.",
    "paragraphs": [
      "Eleanor Voss stood in her studio, paintbrush in hand, staring at the canvas that reflected the vibrant hues of the seaside. To the casual observer, she was simply a local artist, vibrant and carefree, but beneath the surface, a tempest brewed. Her heart ached with unrequited love for Captain Ivor Hale, a man whose charm and heroism captivated her yet left her feeling invisible. As she painted, she poured her emotions onto the canvas, each stroke a silent cry for recognition and connection.",
      "The day of the murder began like any other, with the sound of waves crashing against the shore and the scent of salt in the air. Yet, when the news of the crime spread through the hotel like wildfire, Eleanor's peaceful world shattered. She felt an irresistible pull to uncover the truth, not just for the sake of justice but to find closure for herself and her community. As she stepped into the role of investigator, she found herself grappling with her feelings for Ivor, questioning whether her pursuit of truth would bring her closer to him or push him further away.",
      "Eleanor's charm and wit often masked her insecurities, and she relied on her artistic talent to connect with others. However, as the investigation unfolded, she realized that her cheerful demeanor was a facade. Her friends began to see through her painted smile, and the burden of her secret weighed heavily on her. With every clue she uncovered, she felt a rush of adrenaline and fear, knowing that the shadows of the truth could expose not only the murderer but also her own heart.",
      "As she delved deeper into the murky waters of the case, Eleanor found herself questioning the motivations of those around her. The hotel, once a sanctuary, became a stage for deception and ambition, and she could not help but wonder if Ivor's charm hid darker secrets. The stakes rose higher with each revelation, and Eleanor realized that uncovering the truth could mean losing everything she held dear, including the chance to win Ivor's heart. Yet, she pressed on, driven by a desire to illuminate the darkness that surrounded her, even if it meant confronting her own feelings in the process."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose compassionate exterior masks a desperate struggle with financial ruin and moral compromise.",
    "publicPersona": "Respected doctor, seen as compassionate and dedicated to her patients, Dr. Finch carries herself with a calm authority that commands respect.",
    "privateSecret": "Has been embezzling funds from her practice to fund her son’s costly education abroad, a decision she rationalizes as necessary for his future.",
    "motiveSeed": "Would inherit a significant portion of the family estate if Eleanor's father dies unexpectedly, which would ease financial strain and cover her misdeeds.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in the lobby speaking with a patient, a convenient excuse that may not hold up under scrutiny.",
    "accessPlausibility": "possible",
    "stakes": "Her professional reputation and her son’s future depend on maintaining financial stability, making her desperate to cover her tracks.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.3,
    "speechMannerisms": "Dr. Finch speaks with a measured tone, employing medical jargon that occasionally slips into sharp retorts when pressed, revealing her underlying tension.",
    "signatureTic": "‘I do what I must for the greater good, after all.’",
    "internalConflict": "Dr. Finch grapples with guilt over her embezzlement and the realization that her actions could destroy the very future she is trying to secure for her son.",
    "personalStakeInCase": "The crime holds personal significance as it could expose her financial mismanagement and jeopardize her son's future, forcing her to confront her own moral decay.",
    "paragraphs": [
      "Dr. Mallory Finch was the epitome of grace under pressure, her calm demeanor a comforting presence in the chaotic world of medicine. Yet, beneath her composed exterior lay a heart heavy with secrets. She had dedicated her life to her patients, but desperation had driven her to embezzle funds from her practice, a decision that gnawed at her conscience. Every time she looked at her son, she felt the weight of her choices pressing down on her, a constant reminder of the fine line she walked between ambition and morality.",
      "As the news of the murder spread, Dr. Finch's thoughts spiraled into a frenzy. The potential for scandal loomed over her like a dark cloud, threatening to expose her misdeeds. She had claimed to be in the lobby when the crime occurred, yet the lingering doubt in her mind made her question whether anyone would believe her. The inheritance that would come if Eleanor's father died unexpectedly could provide a lifeline, but the thought of achieving it through such nefarious means sickened her.",
      "In her interactions with others, Dr. Finch wielded her medical knowledge like a weapon, using her expertise to deflect attention from her own vulnerabilities. However, the stakes were higher than ever, and with each passing moment, she felt the walls closing in. Her professional reputation was on the line, and the thought of losing everything she had worked for sent shivers down her spine. She often found herself caught in a web of polite savagery, using her wit to mask the fear that threatened to consume her.",
      "As she navigated the treacherous waters of the investigation, Dr. Finch faced a moral reckoning. The secrets she had buried began to resurface, and the choice between honesty and deception loomed larger than ever. Would she sacrifice her integrity for a fleeting sense of security, or would she find the courage to confront her past and seek redemption? The answer lay in the shadows of the truth, and with each revelation, Dr. Finch knew she was running out of time."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a dashing naval officer whose charm conceals a dangerous gambling addiction and deep financial troubles.",
    "publicPersona": "A handsome and dashing officer, known for his heroic deeds during the war, Ivor is a man of action with a reputation for bravery.",
    "privateSecret": "Is secretly in debt to dangerous individuals after gambling and risks being exposed, putting his social standing and future at stake.",
    "motiveSeed": "Might kill Eleanor's father to avoid financial ruin by manipulating family inheritance matters, a desperate act born from desperation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was seen at the bar, claiming to be with other guests, a cover that could easily be challenged.",
    "accessPlausibility": "possible",
    "stakes": "His future and reputation are at stake, as well as his chance at a higher social standing, making him a man teetering on the edge.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with an easy charm, often punctuating his sentences with dry humor and a casual confidence that masks his inner turmoil.",
    "signatureTic": "‘Life’s a gamble, and I’ve always been a risk-taker.’",
    "internalConflict": "Ivor is torn between his ambition and morality, struggling with the knowledge that his choices could lead to ruin not just for himself but for those around him.",
    "personalStakeInCase": "The crime matters to Ivor as it could either ruin him or provide a way out of his financial troubles, forcing him to confront the consequences of his actions.",
    "paragraphs": [
      "Captain Ivor Hale was the embodiment of charm, effortlessly captivating those around him with his dashing smile and tales of heroism. Yet, beneath the polished exterior lay a man grappling with demons of his own making. A gambling addiction had ensnared him in a web of debt, and the dangerous individuals he owed were not the sort to be trifled with. As he navigated the social circles of the hotel, Ivor felt the weight of his choices pressing heavily upon him, a constant reminder of the risks he had taken.",
      "When the news of the murder reached him, Ivor's heart raced with a mix of fear and opportunity. If Eleanor's father were to die unexpectedly, the potential for inheritance loomed large, and with it, a chance to escape the clutches of his creditors. His alibi, claiming to have been at the bar with other guests, felt shaky at best, and the thought of being implicated in a crime sent shivers down his spine. He had always been a risk-taker, but this was a gamble with life-altering consequences.",
      "Ivor's sardonic humor often masked the turmoil within, allowing him to deflect attention from his mounting problems. He spoke with a casual confidence, weaving tales that entertained while concealing the truth of his desperation. As the investigation unfolded, he found himself drawn into a dangerous game, torn between the ambition that drove him and the morality that threatened to hold him back. With each interaction, he felt the stakes rising, and the line between right and wrong blurred further.",
      "As he grappled with his feelings for Eleanor, Ivor faced a reckoning that could change everything. Would he continue to chase the thrill of risk, or would he find the strength to seek help and confront the mess he had created? The truth of the murder could unravel not only the mystery but also the carefully constructed facade he had built. In the shadows of the case, Ivor Hale stood at a crossroads, forced to choose between ambition and integrity, love and destruction."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a sophisticated socialite whose charm masks an insatiable ambition for wealth and status, leading her to dark choices.",
    "publicPersona": "An elegant woman who makes a show of charitable works to gain acceptance within high society, Beatrice is the epitome of grace and poise.",
    "privateSecret": "Withholds knowledge that she has evidence against Dr. Finch’s embezzlement, a secret she guards closely as leverage for her own ambitions.",
    "motiveSeed": "Wants to eliminate Eleanor to gain access to her father’s wealth and advance her social standing, a cold calculation driven by desperation.",
    "motiveStrength": "weak",
    "alibiWindow": "Claims to have been in the spa area, though no witnesses can confirm, leaving her alibi hanging by a thread.",
    "accessPlausibility": "unlikely",
    "stakes": "Desperately wants to secure her position in society through wealth and connections, making her willing to sacrifice anything for status.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks with a refined accent, often lacing her words with subtle sarcasm and an air of superiority that hints at her true intentions.",
    "signatureTic": "‘One must do what’s necessary to secure one’s place in the world.’",
    "internalConflict": "Beatrice is torn between her desire for wealth and the realization that her ambitions may lead her to compromise her integrity beyond repair.",
    "personalStakeInCase": "The crime represents a chance for Beatrice to advance her social standing, but it also forces her to confront the lengths she’s willing to go to achieve her goals.",
    "paragraphs": [
      "Beatrice Quill glided through the hotel with an elegance that turned heads, her every movement calculated to project the image of a perfect socialite. Yet, beneath the surface, her ambition burned like a wildfire. She had mastered the art of charm, using her philanthropic efforts as a façade to gain acceptance among the elite. However, the truth was far more insidious; Beatrice harbored evidence of Dr. Finch’s embezzlement, a secret that could elevate her standing if wielded correctly.",
      "When the news of Eleanor's murder spread, Beatrice saw an opportunity to further her ambitions. Eleanor’s father was a source of wealth that could secure Beatrice's place in high society, and the thought of eliminating any obstacles in her path became increasingly appealing. Her alibi was flimsy at best, claiming to have been in the spa area with no witnesses to back her up. The stakes had never been higher, and the thrill of the game ignited a dark excitement within her.",
      "With every conversation, Beatrice employed her polite savagery, lacing her words with a subtle sarcasm that belied her true intentions. She reveled in the power dynamics at play, using her charm to manipulate those around her while hiding her ruthless ambition behind a veneer of graciousness. Yet, the deeper she delved into the investigation, the more she felt the weight of her choices pressing down on her. Was her pursuit of wealth worth the potential cost of her integrity?",
      "As Beatrice navigated the treacherous waters of the murder investigation, she faced a moral conundrum that could define her. Would she continue to play the game, sacrificing her values for the sake of status, or would she find the courage to confront the darkness of her ambitions? The echoes of her choices reverberated through the hotel, and Beatrice knew that the path she chose could lead to her ultimate downfall or a life of unparalleled luxury and acceptance."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is the stern hotel manager whose unwavering standards conceal a web of financial mismanagement and fear of exposure.",
    "publicPersona": "A stern yet fair manager of the hotel, known for her strict standards and dedication to maintaining the hotel's reputation.",
    "privateSecret": "Has been covering up financial mismanagement within the hotel to protect its reputation, a decision that weighs heavily on her conscience.",
    "motiveSeed": "Fears that if Eleanor's father investigates her practices, it could lead to her downfall, a fear that drives her actions.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was on the phone with suppliers when the murder occurred, an excuse that may not hold up under scrutiny.",
    "accessPlausibility": "easy",
    "stakes": "Her career and the future of the hotel are at risk if her secrets are unveiled, pushing her to desperate measures.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Sylvia speaks with a clipped, authoritative tone, her words precise and devoid of frivolity, reflecting her serious nature and the weight of her responsibilities.",
    "signatureTic": "‘We must uphold the standards expected of us.’",
    "internalConflict": "Sylvia grapples with guilt over her actions, torn between her dedication to the hotel and the realization that her secrets could lead to catastrophe.",
    "personalStakeInCase": "The crime threatens to expose her financial mismanagement, putting her career and the hotel's future at risk, forcing her to confront her past mistakes.",
    "paragraphs": [
      "Sylvia Trent stood like a sentinel at the helm of the hotel, her stern gaze scanning the bustling lobby as she ensured every detail met her unwavering standards. To the guests, she was the embodiment of authority, a manager dedicated to maintaining the hotel's reputation. However, behind her composed facade lay a heart burdened by the weight of secrets. Sylvia had been covering up financial mismanagement, a decision made in the name of preservation that now felt like a noose tightening around her neck.",
      "When the murder occurred, Sylvia's mind raced with the implications. If Eleanor's father were to investigate, her carefully constructed world could come crashing down. She had claimed to be on the phone with suppliers when the crime took place, but the doubt gnawed at her. The stakes were higher than she had ever anticipated, and the fear of exposure threatened to unravel everything she had worked for. She knew the truth was a dangerous thing, and she felt trapped in a web of her own making.",
      "Sylvia's speech was clipped and authoritative, her words precise and devoid of any hint of frivolity. She commanded respect, but her serious nature often alienated those around her. In a world filled with ambition and intrigue, she found little room for humor or lightness, her focus solely on the hotel and its future. Yet, as the investigation unfolded, she began to feel the pressure mounting, and the fear of losing everything forced her to confront the consequences of her actions.",
      "As she grappled with her choices, Sylvia faced a moral dilemma that could define her legacy. Would she continue to hide behind her facade, risking everything for the sake of preservation, or would she find the courage to face the truth and come clean? The echoes of her past mismanagement reverberated through the hotel, and Sylvia knew that the time for reckoning was drawing near. The shadows of her secrets loomed larger with every passing moment, and she stood at a crossroads, forced to decide between honesty and self-preservation."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a charismatic lawyer whose sharp wit conceals a secret longing for love and a complicated relationship with the family he serves.",
    "publicPersona": "A charismatic lawyer known for his sharp wit and negotiation skills, Hugo is well-liked and respected in his profession.",
    "privateSecret": "Is secretly in love with Eleanor and desires to protect her from family conflicts, a secret that complicates his professional integrity.",
    "motiveSeed": "Has a history with the family and stands to gain access to valuable estate details if Eleanor’s father is out of the picture, complicating his feelings further.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be consulting with clients in the library, an alibi that feels flimsy when examined closely.",
    "accessPlausibility": "possible",
    "stakes": "His feelings for Eleanor complicate his professional integrity and ambitions, leaving him torn between duty and desire.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with a smooth eloquence, often employing clever wordplay and a light-hearted tone that belies the seriousness of his situation.",
    "signatureTic": "‘Ah, the law is a fickle mistress, isn’t she?’",
    "internalConflict": "Hugo wrestles with conflicting emotions, torn between his affection for Eleanor and the ethical dilemmas that arise from his professional obligations to her family.",
    "personalStakeInCase": "The crime matters to him personally as it complicates his feelings for Eleanor and forces him to confront the blurred lines between love and duty.",
    "paragraphs": [
      "Hugo Vane was the kind of lawyer who could charm a jury with a flick of his wrist and a well-timed quip. His sharp wit and negotiation skills earned him the admiration of both clients and colleagues, yet beneath the charismatic exterior lay a heart burdened by unspoken desires. He was secretly in love with Eleanor, a feeling that complicated his professional integrity and left him in a constant state of conflict. As he navigated the complexities of the case, he found himself torn between his duty to the family he served and the emotions he could no longer suppress.",
      "When news of the murder reached him, Hugo's mind raced with implications. The access to valuable estate details that could arise from Eleanor's father's demise weighed heavily on him, and the thought of his feelings leading to ethical dilemmas made his heart race. He had claimed to be in the library consulting with clients when the crime occurred, but the alibi felt like a flimsy shield against the scrutiny that would inevitably follow. The stakes were higher than ever, and his affection for Eleanor threatened to cloud his judgment.",
      "In conversation, Hugo's dry wit often served as a defense mechanism, allowing him to navigate tense situations with a light-hearted tone that belied the seriousness of his circumstances. He employed clever wordplay to mask his inner turmoil, yet the truth clawed at him from the inside. Every interaction with Eleanor stirred a longing that he could no longer ignore, and the shadows of his feelings entwined with the investigation like a vine choking a tree.",
      "As the investigation unfolded, Hugo faced a reckoning that could redefine his future. Would he continue to hide behind the façade of professionalism, risking his relationship with Eleanor, or would he find the courage to confront his feelings and the ethical dilemmas that came with them? The echoes of love and duty collided within him, and Hugo Vane stood at a crossroads, forced to choose between the law and the heart, each path fraught with peril and promise."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Grand Seaside Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel built in the 1920s, now steeped in mystery and tension due to recent crimes.",
    "visualDescription": "Art Deco architecture with sweeping curves, large glass windows framing views of the turbulent sea; a sprawling lobby with polished marble floors and a grand staircase that spirals upwards, flanked by ornate brass railings.",
    "atmosphere": "An air of unease permeates the hotel, where shadows stretch across the marble and echoes of conversation linger in the corners.",
    "paragraphs": [
      "The Grand Seaside Hotel stands as a testament to the roaring twenties, its elegant Art Deco lines softened by the relentless ocean breeze. Guests from all walks of life converge in the lobby, a bustling hub where laughter mingles with hushed whispers, each corner hiding secrets untold. The grand staircase, a focal point of the lobby, spirals upward, beckoning guests to explore the mysteries that lie beyond. Yet, amid the glamour, an undercurrent of tension simmers, fueled by recent crime reports that have cast a pall over the hotel's inviting façade.",
      "As the sun dips below the horizon, the hotel's large windows reflect the brooding sky, the waves crashing against the cliffs creating a symphony of unease. The faint scent of salt and dampness mingles with the rich aroma of coffee and pastries from the lobby café, drawing guests into its warm embrace. However, whispers of a recent disappearance and the lurking presence of shadowy figures cast long shadows over what should be a carefree retreat. Each guest, while seemingly at ease, carries an unspoken weight, their secrets intertwining like the sea's tumultuous currents.",
      "Narrow hallways lead to guest rooms, each door a silent guardian of its inhabitant's identity. The walls, adorned with vintage photographs of the hotel's illustrious past, seem to watch, as if bearing witness to the unfolding drama. Outside, the cliffside location limits escape routes, a precarious position that heightens the sense of isolation. With the nearest town miles away, help may be slow to arrive, leaving the guests to navigate their own fates within the hotel's opulent yet confining embrace."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates",
    "timeFlow": "Three days of mounting tension as mysteries unfold.",
    "mood": "tense, with an underlying sense of unease due to recent local crime reports",
    "eraMarkers": [
      "Art Deco architecture from the 1920s",
      "Early radio broadcasts filling the lobby",
      "Post-war automobile boom evident in the parking lot"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and polished marble",
      "secondary": [
        "hushed conversations and distant waves",
        "the scent of damp wood and old leather"
      ]
    },
    "paragraphs": [
      "The atmosphere within the Grand Seaside Hotel is charged with tension, where the echoes of laughter are tinged with apprehension. Guests navigate the grand lobby, their footsteps muted against the marble floor, as the distant roar of the sea mingles with the low hum of early radio broadcasts. The scent of freshly brewed coffee wafts through the air, juxtaposed with the salty tang of the ocean, creating an intoxicating mix that masks the underlying dread of recent events.",
      "As the day fades into twilight, the hotel transforms. Shadows stretch across the polished floor, and the flickering glow of sconces casts an amber hue on the walls. The sound of rain begins to patter against the large windows, a rhythmic reminder of the storm brewing outside and within. Every corner of the hotel seems to harbor secrets, amplifying the sense of isolation as guests become unwitting participants in a mystery that unfolds with each passing moment."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "Spacious area adorned with Art Deco furnishings, large windows overlooking the sea, polished marble floors reflecting light.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate brass chandeliers",
          "ocean views framed by glass",
          "vintage photographs on walls",
          "guests in elegant attire"
        ],
        "sounds": [
          "hushed conversations",
          "clinking of teacups",
          "the rustle of newspapers",
          "the distant crash of waves",
          "soft music from a radio"
        ],
        "smells": [
          "freshly brewed coffee",
          "salt air from the ocean",
          "old leather from armchairs",
          "pastries from the café",
          "damp wood"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft leather of armchairs",
          "cool metal of railings",
          "textured fabric of drapes",
          "the chill of ocean air"
        ]
      },
      "accessControl": "Open to all guests during lobby hours; staff only access after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "damp marble tiles",
            "grey light filtering through windows",
            "shadows of guests huddled under umbrellas"
          ],
          "sounds": [
            "steady drumming of rain on glass",
            "whispers of concern",
            "soft footsteps on wet floors"
          ],
          "smells": [
            "damp earth from the gardens",
            "mildew on old books",
            "fresh pastries wafting"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dulling colors",
            "shadows creeping along walls",
            "guests with anxious expressions"
          ],
          "sounds": [
            "silence interrupted by distant thunder",
            "the creak of wooden furniture"
          ],
          "smells": [
            "beeswax from polished surfaces",
            "dust in the air",
            "a hint of smoke from the kitchen"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "the glow of city lights beyond"
          ],
          "sounds": [
            "the tick of a clock on the wall",
            "murmurs of conversation rising and falling"
          ],
          "smells": [
            "the rich scent of tobacco",
            "warmth of candle wax",
            "the lingering aroma of dinner"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the heartbeat of the hotel, where guests converge in a blend of excitement and apprehension. Its spacious design allows for movement yet feels confining under the weight of unseen tensions. The polished marble floors gleam underfoot, reflecting the elegant chandeliers that hang overhead. Guests drift in and out, their conversations punctuated by the distant crash of waves, each word heavy with unspoken fears.",
        "As evening descends, the lobby transforms into a realm of shadows and whispers. The flickering candlelight dances across the room, casting eerie shapes on the walls. The scent of freshly brewed coffee mingles with the salty air, creating an enticing yet unsettling atmosphere. Each guest becomes acutely aware of the space around them, as if the very walls are listening, holding secrets that could unravel at any moment."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "Guest Rooms",
      "type": "interior",
      "purpose": "Private spaces for guests",
      "visualDetails": "Narrow hallways lined with patterned wallpaper, doors adorned with brass nameplates, and dimly lit interiors that evoke a sense of intimacy.",
      "sensoryDetails": {
        "sights": [
          "dimly lit corridors",
          "ornate door handles",
          "faded floral wallpaper",
          "heavy drapes blocking light",
          "shadows of guests passing"
        ],
        "sounds": [
          "the creak of old floorboards",
          "soft whispers behind closed doors",
          "the distant sound of the sea",
          "the rustle of clothing",
          "the click of locks"
        ],
        "smells": [
          "dusty air and old wood",
          "the faint scent of perfume",
          "the lingering aroma of meals",
          "musty fabric from upholstery",
          "the hint of dampness"
        ],
        "tactile": [
          "rough texture of wallpaper",
          "cold metal door handles",
          "softness of a well-worn bedspread",
          "the chill of the evening air",
          "the warmth of a woolen blanket"
        ]
      },
      "accessControl": "Access limited to assigned guests; staff only for cleaning during the day.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets on window panes",
            "grey light seeping through curtains",
            "shadows of rain outside"
          ],
          "sounds": [
            "steady rain against rooftops",
            "dripping water from eaves",
            "the rustle of sheets"
          ],
          "smells": [
            "fresh linen",
            "the scent of wet earth",
            "a hint of mildew"
          ],
          "mood": "claustrophobic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through curtains",
            "cloudy shapes outside",
            "the stillness of closed doors"
          ],
          "sounds": [
            "silence broken by distant voices",
            "the creak of hinges",
            "the soft hum of the hotel"
          ],
          "smells": [
            "old books on shelves",
            "the faint aroma of food",
            "the scent of stale air"
          ],
          "mood": "oppressive isolation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light from bedside lamps",
            "the glow of the setting sun",
            "shadows dancing on walls"
          ],
          "sounds": [
            "the soft murmur of conversations",
            "the distant sound of laughter",
            "the ticking of a clock"
          ],
          "smells": [
            "the scent of tobacco",
            "the warmth of candle wax",
            "the lingering aroma of dinner"
          ],
          "mood": "intimate tension"
        }
      ],
      "paragraphs": [
        "The guest rooms, each a sanctuary of sorts, are tucked away behind narrow hallways that seem to stretch endlessly. The patterned wallpaper tells tales of elegance long past, while the dim light creates an atmosphere of intimacy, perfect for secrets to thrive. Heavy drapes block out the world, cocooning guests in their private spaces while the sounds of the bustling lobby fade into a distant murmur.",
        "As night falls, the rooms take on a life of their own, shadows creeping along the walls, echoing the tension that fills the hotel. The faint scent of perfume lingers in the air, mingling with the musty aroma of old wood and fabric. Each guest, isolated yet surrounded by others, feels the weight of their own secrets pressing down, as the whispers of the hotel seem to close in around them."
      ]
    },
    {
      "id": "kitchen",
      "name": "Staff Kitchen",
      "type": "interior",
      "purpose": "Culinary hub for hotel staff",
      "visualDetails": "Functional space with stainless steel appliances, large wooden tables, and shelves stocked with rationed supplies.",
      "sensoryDetails": {
        "sights": [
          "gleaming stainless steel surfaces",
          "wooden tables cluttered with ingredients",
          "shelves lined with rationed goods",
          "steam rising from pots",
          "staff bustling about"
        ],
        "sounds": [
          "clattering of pots and pans",
          "soft chatter among staff",
          "the hiss of frying food",
          "the whirring of mixers",
          "the distant sound of waves crashing"
        ],
        "smells": [
          "aroma of herbs and spices",
          "freshly baked bread",
          "the scent of frying onions",
          "the tang of vinegar",
          "the sweetness of pastries"
        ],
        "tactile": [
          "cool metal of appliances",
          "warmth of freshly baked bread",
          "rough texture of burlap sacks",
          "smooth wooden surfaces",
          "the chill of the refrigerator"
        ]
      },
      "accessControl": "Staff-only access; guests prohibited at all times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "steam rising in the humid air",
            "dull light filtering through windows",
            "staff preparing breakfast"
          ],
          "sounds": [
            "the steady drip of rain outside",
            "the sizzle of food on the stove",
            "the rustle of aprons"
          ],
          "smells": [
            "the rich scent of coffee",
            "the tang of citrus",
            "the warmth of baked goods"
          ],
          "mood": "busy urgency"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "stacks of dishes awaiting cleaning",
            "busy staff moving about"
          ],
          "sounds": [
            "the clatter of utensils",
            "the hum of the refrigerator",
            "the distant sound of thunder"
          ],
          "smells": [
            "the aroma of simmering sauces",
            "the scent of fresh vegetables",
            "the faint smell of smoke"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light illuminating the space",
            "freshly plated meals arranged on counters",
            "staff cleaning up after dinner"
          ],
          "sounds": [
            "the soft chatter of staff",
            "the clinking of dishes",
            "the ticking of a clock"
          ],
          "smells": [
            "the richness of roasted meat",
            "the sweetness of dessert",
            "the scent of fresh herbs"
          ],
          "mood": "calm after the storm"
        }
      ],
      "paragraphs": [
        "The staff kitchen is a bustling hub of activity, where the clattering of pots and pans fills the air with a symphony of culinary creation. Stainless steel surfaces gleam under the overhead lights, reflecting the busy hands of the kitchen staff as they prepare meals for the hotel's guests. Shelves stocked with rationed supplies tell the story of wartime limitations, while the aroma of fresh bread and simmering sauces wafts through the air, creating an enticing atmosphere amid the urgency of service.",
        "As evening approaches, the kitchen transforms into a space of calm, the sounds of the day fading into a soft hum. The warm light casts a comforting glow over the countertops, where freshly plated meals await their guests. Yet, beneath the surface, a tension remains palpable, as whispers of recent events linger like the lingering scent of herbs in the air. Each staff member navigates their tasks with a heightened sense of awareness, knowing that the hotel's secrets are not confined to the guest rooms."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "Rooftop Terrace",
      "type": "exterior",
      "purpose": "Outdoor space for guests to enjoy views and fresh air",
      "visualDetails": "Open space with wrought iron railings, potted plants, and stunning views of the ocean and cliffs.",
      "sensoryDetails": {
        "sights": [
          "expansive ocean views",
          "wrought iron railings glinting in sunlight",
          "potted plants swaying in the breeze",
          "clouds drifting overhead",
          "the edge of the cliff dropping away"
        ],
        "sounds": [
          "the roar of waves crashing below",
          "the rustle of leaves in the wind",
          "seagulls calling overhead",
          "distant laughter from below",
          "the soft hum of the breeze"
        ],
        "smells": [
          "fresh sea air",
          "the scent of blooming flowers",
          "the salty tang of the ocean",
          "the warmth of the sun on skin",
          "the hint of smoke from nearby barbecues"
        ],
        "tactile": [
          "cool metal of the railings",
          "the warmth of sunlight on skin",
          "the rough texture of potted soil",
          "the gentle breeze against the face",
          "the chill of evening air"
        ]
      },
      "accessControl": "Restricted access after sunset; guests must sign in to use the terrace.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "raindrops on railings",
            "puddles forming on the terrace"
          ],
          "sounds": [
            "the soft patter of rain",
            "the distant crash of waves",
            "the rustling of wet leaves"
          ],
          "smells": [
            "the fresh scent of rain-soaked earth",
            "the tang of salt in the air",
            "the aroma of wet foliage"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds looming",
            "the ocean churning below",
            "the terrace in shadow"
          ],
          "sounds": [
            "the roar of waves crashing",
            "the wind howling",
            "the distant sound of thunder"
          ],
          "smells": [
            "the heavy scent of rain",
            "the saltiness of the ocean",
            "the aroma of damp earth"
          ],
          "mood": "foreboding tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the sun setting on the horizon",
            "the sky painted in hues of orange and pink",
            "the ocean shimmering under twilight"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "the distant laughter of guests",
            "the soft rustle of evening breezes"
          ],
          "smells": [
            "the fresh scent of night-blooming flowers",
            "the salty tang of the ocean",
            "the warmth of the sun fading"
          ],
          "mood": "serene anticipation"
        }
      ],
      "paragraphs": [
        "The rooftop terrace offers a breathtaking escape, where guests can breathe in the salty air while gazing out at the endless ocean. Wrought iron railings frame the views, and potted plants add a touch of color to the stark landscape. The sound of waves crashing against the cliffs below creates a backdrop of nature's power, while laughter and conversation mingle in the air, temporarily masking the tension that lies within the hotel.",
        "As evening approaches, the terrace transforms into a haven of serenity. The sun dips below the horizon, painting the sky in brilliant hues. The soft breeze carries the scent of night-blooming flowers, inviting guests to linger a little longer. Yet, amid the beauty, an awareness of the darkness creeps in, reminding them of the secrets held within the hotel walls, and the weight of unspoken fears that linger in the air."
      ]
    }
  ],
  "note": "",
  "cost": 0.0025295721,
  "durationMs": 51726
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "March",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "March",
    "weather": [
      "overcast skies with intermittent rain",
      "cool breezes from the coast",
      "occasional bursts of sunshine"
    ],
    "daylight": "Days gradually lengthening with daylight lasting until about 6:30 PM.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, a time when shadows deepen and the hotel becomes quieter.",
    "holidays": [
      "St. Patrick's Day (March 17)"
    ],
    "seasonalActivities": [
      "Spring cleaning and home organizing",
      "Visits to local parks for early blooming flowers",
      "Preparation for Easter celebrations with crafts and decorations"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits in navy or charcoal",
        "white dress shirts with stiff collars",
        "silk ties in geometric patterns"
      ],
      "casual": [
        "tweed jackets paired with slacks",
        "woolen cardigans over button-up shirts",
        "flat caps or fedora hats"
      ],
      "accessories": [
        "pocket watches with chain",
        "leather gloves",
        "brimmed hats"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dresses with nipped waists",
        "tailored suits with shoulder pads",
        "silk blouses with Peter Pan collars"
      ],
      "casual": [
        "A-line skirts paired with fitted sweaters",
        "simple cotton blouses with floral patterns",
        "lightweight trench coats"
      ],
      "accessories": [
        "string of pearls or beaded necklaces",
        "hats adorned with ribbons",
        "canvas handbags"
      ]
    },
    "trendsOfTheMoment": [
      "Utility fashion focusing on practicality",
      "Bright lipstick colors as a morale booster",
      "Wartime styles emphasizing a blend of femininity and functionality"
    ],
    "socialExpectations": [
      "Men are expected to be the primary breadwinners",
      "Women are increasingly seen in roles traditionally held by men",
      "Social gatherings often centered around community support for the war effort"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Allied forces planning for the Normandy invasion",
      "The ongoing Battle of the Atlantic with heavy losses reported",
      "Civil defense drills becoming commonplace in urban areas"
    ],
    "politicalClimate": "Tension between the Allies and Axis powers remains high, with increasing discussions about post-war plans.",
    "economicConditions": "Rationing continues to affect daily life, with shortages of consumer goods causing frustration.",
    "socialIssues": [
      "Displacement of families due to war",
      "Rising crime rates in urban centers",
      "Strain on mental health due to wartime stress"
    ],
    "internationalNews": [
      "Reports of resistance movements gaining momentum in occupied Europe",
      "Growing concerns about the Soviet Union's post-war intentions"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'I'll Be Seeing You' by Bing Crosby",
        "'Swinging on a Star' by Bing Crosby",
        "'As Time Goes By' by Dooley Wilson"
      ],
      "films": [
        "'To Have and Have Not'",
        "'Double Indemnity'",
        "'The Song of Bernadette'"
      ],
      "theater": [
        "'Oklahoma!' begins its Broadway run",
        "'The Glass Menagerie' starts gaining popularity"
      ],
      "radio": [
        "'The Shadow' drama series",
        "'Suspense' anthology series",
        "'The Eddie Cantor Show'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Fountainhead' by Ayn Rand",
        "'The Little Prince' by Antoine de Saint-Exupéry",
        "'The Naked and the Dead' by Norman Mailer"
      ],
      "popularGenres": [
        "War fiction",
        "Mystery and detective novels",
        "Social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "Radar technology improving military tactics",
        "Advances in aircraft design for combat efficiency",
        "Early computing machines beginning development"
      ],
      "commonDevices": [
        "Radio sets as primary source of news and entertainment",
        "Basic television sets in affluent households",
        "Typewriters used widely in offices"
      ],
      "emergingTrends": [
        "Increased interest in home electronics",
        "Development of war-related technologies like synthetic rubber"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "A dozen eggs: one shilling",
        "Dairy milk pint: five pence"
      ],
      "commonActivities": [
        "Community potlucks to support local charities",
        "Neighborhood air raid drills",
        "Volunteering for war-related activities"
      ],
      "socialRituals": [
        "Regular attendance at church services",
        "Weekly gatherings for card games and socializing",
        "Participation in local charity drives"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Class distinctions remain prominent despite wartime unity",
      "Growing resentment towards the wealthy who evade rationing"
    ],
    "gender": [
      "Women's roles are evolving, with many entering the workforce",
      "Traditional expectations of femininity are being challenged"
    ],
    "race": [
      "Increased visibility of racial tensions due to wartime inequalities",
      "Continued segregation in many parts of the country"
    ],
    "generalNorms": [
      "Increased acceptance of mixed-gender social circles",
      "Collective efforts to support the war are valued",
      "Moral fortitude is emphasized as a national virtue"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth lingers in the air, as rain-soaked streets reflect the muted gray of the overcast skies.",
    "The distant sound of air raid sirens can be heard, a sobering reminder of the world beyond the hotel's walls.",
    "A tension fills the atmosphere, palpable as guests murmur anxiously about the latest crime reports while sipping their evening tea."
  ],
  "paragraphs": [
    "In March 1944, the coastal town experiences the early whispers of spring, with overcast skies and rain showers painting a somber backdrop to daily life. The days are gradually lengthening, but the tension in the air remains thick, amplified by the news of local crimes that have left residents on edge. With St. Patrick's Day approaching, the occasional burst of sunshine hints at the festivities that may momentarily lift spirits, but the underlying sense of unease is undeniable as shadows loom in the corners of the elegant hotel lobby.",
    "Fashion in this era reflects the complexities of wartime life; men don double-breasted wool suits, often accessorized with flat caps and leather gloves, while women showcase tea-length dresses with nipped waists paired with elegant pearls. The practicality of utility clothing is evident, yet there is an undeniable elegance that seeks to defy the grim realities of the time. As guests gather in the hotel, the clash between wartime austerity and the desire for beauty encapsulates the spirit of the 1940s.",
    "Life within the hotel is a microcosm of the broader societal shifts occurring outside its doors. Prices for basic goods remain a topic of conversation, with bread at four pence and eggs at one shilling, reflecting the ongoing rationing. Evening gatherings often revolve around radio programs, where the latest news is discussed amidst the backdrop of community potlucks. As women increasingly enter the workforce, traditional social norms are being reshaped, prompting lively debates among guests about the future of gender roles. In this charged atmosphere, the hotel stands as both a sanctuary and a stage for the evolving drama of human experience."
  ],
  "note": "",
  "cost": 0.0010876404,
  "durationMs": 20432
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a grand seaside hotel for a charity event draws a diverse group of guests, where the pressures of post-war society and rising tensions create an atmosphere ripe for deception and intrigue.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is shifting with women taking on new roles, while class distinctions are challenged by the aftermath of war and the looming specter of Cold War anxieties."
  },
  "setting": {
    "location": "A grand seaside hotel built in the 1920s overlooking the ocean",
    "institution": "hotel",
    "weather": "overcast with occasional rain, typical of coastal climates"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an acoustic method, where a gramophone recording played into a soundproofed room fabricates an alibi for the true moment of death."
}

### LOCKED_FACTS
[
  {
    "id": "record_play_time",
    "value": "ten minutes past eleven",
    "description": "The exact time the gramophone recording was initiated."
  },
  {
    "id": "victim_last_seen",
    "value": "twenty minutes past ten",
    "description": "The time the victim was last seen alive."
  },
  {
    "id": "soundproof_room_location",
    "value": "the second floor",
    "description": "The location of the soundproof room where the recording was played."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 4,
    "mid": 12,
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
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_7",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_core_elimination_chain",
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
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "category": "temporal"
    },
    {
      "id": "clue_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_2",
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
