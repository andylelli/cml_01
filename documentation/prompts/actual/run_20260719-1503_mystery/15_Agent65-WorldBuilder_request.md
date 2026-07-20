# Actual Prompt Record

- Run ID: `mystery-1784473399797`
- Project ID: ``
- Timestamp: `2026-07-19T15:07:14.046Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `d7806e08de125146`

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
    "title": "The Clockwork Deception",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Byron Bay",
      "place": "Grand Seaside Hotel",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical clock tampering"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Insightful and determined",
      "private_secret": "Struggles with self-doubt",
      "motive_seed": "Seek justice for her friend",
      "motive_strength": "strong",
      "alibi_window": "11:00 PM - 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Lobby",
        "Dining Area"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Keen observer"
      ],
      "stakes": "Personal investment in the case",
      "evidence_sensitivity": [
        "High"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Reputable physician",
      "private_secret": "Had a conflict with a colleague",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "11:00 PM - 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "None",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Retired naval officer",
      "private_secret": "Resents being overlooked",
      "motive_seed": "Jealousy over Dr. Finch's accolades",
      "motive_strength": "moderate",
      "alibi_window": "11:15 PM - 11:45 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Clock Room",
        "Library"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Social standing",
      "evidence_sensitivity": [
        "Medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Hotel manager",
      "private_secret": "Struggling financially",
      "motive_seed": "Desire to eliminate competition",
      "motive_strength": "strong",
      "alibi_window": "11:00 PM - 11:45 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Lobby",
        "Office"
      ],
      "behavioral_tells": [
        "Nervous when corners are cut"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [
        "High"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Personal assistant",
      "private_secret": "In love with Dr. Finch",
      "motive_seed": "Fear of losing her chance with him",
      "motive_strength": "moderate",
      "alibi_window": "11:00 PM - 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining Area",
        "Kitchen"
      ],
      "behavioral_tells": [
        "Overly emotional"
      ],
      "stakes": "Personal attachment",
      "evidence_sensitivity": [
        "Medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Wealthy patron",
      "private_secret": "Involved in shady dealings",
      "motive_seed": "Desire to keep Dr. Finch quiet about his activities",
      "motive_strength": "strong",
      "alibi_window": "11:30 PM - 12:00 AM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Bar",
        "Lobby"
      ],
      "behavioral_tells": [
        "Irritable when pressed"
      ],
      "stakes": "Reputation",
      "evidence_sensitivity": [
        "High"
      ],
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
      "summary": "As the clock strikes ten minutes past eleven at a seaside hotel, Dr. Mallory Finch is discovered dead, seemingly killed during a party. However, the clock has been tampered with, leading Eleanor Voss to uncover a web of deceit among the guests, where time itself was manipulated to frame the murderer."
    },
    "accepted_facts": [
      "Dr. Mallory Finch was found dead at the hotel shortly after eleven o'clock.",
      "The clock in the lobby showed ten minutes past eleven at the time of death."
    ],
    "inferred_conclusions": [
      "The actual time of death must have been earlier than indicated by the clock."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, lobby, and minut to expose the false timing.",
      "delivery_path": [
        {
          "step": "Tampering with the clock in the clock room before the party started."
        },
        {
          "step": "Setting the clock to show a later time after the murder."
        }
      ]
    },
    "outcome": {
      "result": "The murder appears to happen during the party, creating a false narrative."
    }
  },
  "false_assumption": {
    "statement": "The murder of Dr. Mallory Finch occurred during the party as indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses recall seeing Finch just before the party ended, and the clock showed a time consistent with this.",
    "what_it_hides": "The clock has been tampered with to misrepresent the actual time of death."
  },
  "false_solution": {
    "accused_suspect": "Beatrice Quill",
    "supporting_points": [
      "Beatrice had access to all areas of the hotel, including the clock room.",
      "Witnesses saw her arguing with Dr. Finch earlier in the evening."
    ],
    "the_one_flaw": "Beatrice was in the dining area with multiple guests at the actual time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A letter threatening Dr. Finch was found in her room.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The letter was a routine warning following his business dealings, not directly related to Finch.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Witnesses reported seeing Captain Hale leave the party early.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was called away for an urgent matter regarding his old naval service.",
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
    "rationale": "All suspects were guests at the hotel and had access to the victim, while no outsiders were present."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The party ended at eleven o'clock.",
        "The clock was tampered with before the party started."
      ],
      "windows": [
        "The time of death is placed between 11:00 PM and 11:30 PM."
      ],
      "contradictions": [
        "Witnesses recall Dr. Finch being in the dining area at 11:05 PM when the clock shows 11:10 PM."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Sylvia Trent",
        "Hugo Vane"
      ],
      "objects": [
        "The main clock in the lobby",
        "The clock room"
      ],
      "permissions": [
        "All suspects had access to the clock room due to their roles."
      ]
    },
    "physical": {
      "laws": [],
      "traces": [
        "Fingerprints were found on the clock's surface.",
        "A clock repair tool was found near the clock room."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trusted each other due to shared experiences.",
        "There was a prevailing sense of camaraderie among the attendees."
      ],
      "authority_sources": []
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the lobby shows ten minutes past eleven.",
        "correction": "The clock's time does not match the actual time of death.",
        "effect": "Narrows the time of death to earlier than 11:10 PM.",
        "required_evidence": [
          "The clock in the lobby shows ten minutes past eleven.",
          "Witnesses recall the party ending at eleven o'clock."
        ],
        "reader_observable": true
      },
      {
        "observation": "A dusting of flour is found on the clock's surface.",
        "correction": "The presence of flour indicates recent tampering with the clock.",
        "effect": "Eliminates the possibility that the clock was left unmodified since the start of the party.",
        "required_evidence": [
          "The clock shows signs of recent tampering.",
          "Witnesses report hearing a ticking sound shortly before the murder."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses state Dr. Finch was last seen in the dining area at eleven.",
        "correction": "If Dr. Finch was in the dining area, the time of death being shown by the clock is false.",
        "effect": "Narrows the suspect pool to those who had access to the clock room.",
        "required_evidence": [
          "Witnesses recall Dr. Finch being in the dining area at 11:05 PM.",
          "The clock shows ten minutes past eleven."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, lobby, and minut against the claimed timeline.",
    "knowledge_revealed": "The tampering of the clock occurred before the party started, proving Hale's alibi false.",
    "pass_condition": "If Hale's alibi cannot account for the tampering timeline, he must be the culprit.",
    "evidence_clues": [
      "clue_4",
      "clue_culprit_direct_1",
      "clue_mechanism_visibility_core",
      "clue_culprit_direct_captain_ivor_hale"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock showing a false time (early) and the flour evidence (mid) lets the reader separate the actual time of death from the party timeline. Step 2: Witness accounts about Finch's last sighting (mid) contradict the clock's time, eliminating Hale's plausible alibi. Step 3: The comparison of timelines exposes Hale's guilt in the discriminating test."
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
      "test_type": "comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness testimony clears her by proving she was in the dining area.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by staff.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 11:00 PM - 11:30 PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 11:30 PM - 12:00 AM",
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
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
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_14",
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
        "delivery_method": "Direct evidence from the clock"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness report"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A traveling journalist with a penchant for uncovering the truth, Eleanor finds herself embroiled in a murder mystery that echoes her own hidden past.",
    "publicPersona": "Charming and well-connected, known for her insightful articles on social issues. Her ability to weave narratives makes her a sought-after guest at social gatherings, where she gathers information as deftly as she gathers compliments.",
    "privateSecret": "Hides a past affair with the victim's husband that ended badly, leaving her with a mix of guilt and longing.",
    "motiveSeed": "Eleanor was present at the hotel for a writing retreat when the murder occurred, making her an unwitting participant in a deadly game.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the hotel library from 8 PM until the murder was discovered at 9 PM, a detail that could either exonerate or implicate her.",
    "accessPlausibility": "easy",
    "stakes": "Personal redemption and uncovering the truth, as she grapples with her own past while seeking justice for the victim.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a fluid cadence, often punctuating her observations with sardonic remarks that reveal a sharper edge beneath her charm. She has a habit of trailing off slightly when reflecting on her past, as if reluctant to fully engage with it.",
    "signatureTic": "Well, isn't that just a twist?",
    "internalConflict": "Eleanor struggles with the weight of her past mistakes and the fear that they may resurface to undermine her credibility as a journalist.",
    "personalStakeInCase": "The murder forces her to confront her own failings while seeking to reclaim her professional integrity, which is at stake alongside the truth.",
    "paragraphs": [
      "Eleanor Voss had always been drawn to the stories hidden beneath the surface of polished façades. As a traveling journalist, she had cultivated a reputation for her insightful articles on social issues, charming her way into the hearts of her readers and the homes of those she interviewed. Yet, beneath that charming exterior lay a past riddled with shadows, none darker than the affair she had once indulged in with the husband of the very woman now lying dead. The thought of it haunted her as she walked the corridors of the hotel where the murder had taken place, a place she had thought would be a sanctuary for her writing retreat.",
      "As she sat in the hotel library, surrounded by the scent of aged paper and the muted whispers of guests, Eleanor found herself grappling with the duality of her existence. She was a seeker of truth, yet her own truths were marred by the deceptive allure of her past. The clock ticked ominously, and with each passing moment, she felt the weight of her decisions pressing down on her. She had been alone in the library when the murder occurred, a solitary figure buried in notes and thoughts, yet the proximity to the crime left her feeling vulnerable, as if the very walls were closing in on her secrets.",
      "Eleanor’s mind raced as she recalled the details of that fateful evening—the sounds of laughter drifting from the dining room, the smell of food wafting through the corridors, and the underlying tension that seemed to vibrate in the air. When the news of the murder broke, it was as if a dam had burst, releasing a torrent of suppressed emotions and memories. The affair had been a reckless escapade, a momentary lapse that now felt like a noose tightening around her neck. She had to find the truth, not just for the sake of the victim, but to redeem herself from the ghosts of her past.",
      "Her charm, once a tool of her trade, now felt like a mask she wore to hide her true self. With each interview and inquiry, Eleanor navigated the treacherous waters of suspicion and intrigue, her instincts guiding her as she pieced together the fragments of a story that was far from over. The stakes were high, and the realization that her own history was interwoven with the victim's fate left her both terrified and determined. She was not just a journalist anymore; she was an amateur sleuth, driven by a desperate need to uncover the truth while wrestling with the shadows of her past.",
      "As she moved through the hotel, Eleanor's resolve solidified. She would not allow her past to define her future. The clock was ticking, and with each tick, the urgency of the truth became clearer. This was her chance to reclaim her narrative, to write a story not just of tragedy but of redemption. The truth lurked in every corner, and she was determined to find it, even if it meant confronting the demons she had tried so hard to bury."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected physician with a hidden life, Dr. Finch’s world crumbles when her secret relationship and career are threatened by the murder of a colleague.",
    "publicPersona": "A well-respected doctor in the community known for her dedication to her patients. She is often praised for her selflessness, but her polished exterior masks the turmoil brewing beneath.",
    "privateSecret": "Has been in a secret relationship with Captain Hale, which she fears could jeopardize her career and reputation.",
    "motiveSeed": "Dr. Finch recently discovered the victim was spreading rumors about her relationship with Hale, a threat that pushed her to the brink.",
    "motiveStrength": "strong",
    "alibiWindow": "was in the patients' wing until 9:15 PM, a timeline that could either clear her or place her under suspicion.",
    "accessPlausibility": "possible",
    "stakes": "Her career and reputation are at risk, forcing her to confront the choices that led her to this moment.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks with a calm, measured tone, her words often laced with a sense of urgency when discussing her patients. Her dialogue reflects her medical training—precise and clinical, yet often betraying her emotional turmoil when the topic shifts to her private life.",
    "signatureTic": "Time waits for no one, especially in medicine.",
    "internalConflict": "Dr. Finch is torn between her dedication to her patients and the fear that her personal life will unravel her professional identity.",
    "personalStakeInCase": "The murder not only endangers her reputation but also forces her to confront the consequences of her hidden relationship with Hale.",
    "paragraphs": [
      "Dr. Mallory Finch had always been a healer, her life devoted to the well-being of others. As a physician in Byron Bay, she was admired for her commitment to her patients, often sacrificing her own needs for their care. Yet, the façade of the dedicated doctor hid a secret life riddled with complications—most notably her affair with Captain Ivor Hale. As the rumors began to swirl, she felt the ground beneath her shift, threatening the very foundation of her career.",
      "The night of the murder, Dr. Finch had been focused on her patients, tending to their needs with the same fervor she applied to her medical practice. But when she learned that the victim had been spreading whispers about her relationship with Hale, the air grew thick with tension. Her heart raced—not only for the safety of her career but for the stability of her life. She had always prided herself on her professionalism, yet here she was, ensnared in a web of deceit that could unravel everything she had built.",
      "As she moved through the patients' wing, Dr. Finch's thoughts were consumed by the implications of the murder. She had been seen in the hospital until 9:15 PM, a timeline that provided a sliver of hope for her innocence. Yet, as the whispers grew louder, she could feel the weight of suspicion settle on her shoulders. The clock was ticking, and she knew that each passing moment brought her closer to a reckoning she was not prepared for. Her career was at stake, and the very relationships she had fought to protect were now under scrutiny.",
      "The duality of her existence gnawed at her—how could she be both a respected doctor and a woman entangled in scandal? The pressure was suffocating, and Dr. Finch felt her carefully constructed world begin to crumble. Her relationship with Hale, once a source of solace, now felt like a ticking time bomb, ready to detonate at any moment. She needed to confront the truth, not only for her career but for her own peace of mind. Could she navigate the treacherous waters of suspicion and still emerge unscathed?",
      "In the days that followed, as the investigation unfolded, Dr. Finch realized she could no longer hide behind her reputation as a doctor. The truth would out, and she would have to face the consequences of her choices. The stakes were higher than ever, as the desire to maintain her professional identity clashed with the reality of her personal life. The clock was ticking, and time was not on her side."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A naval officer caught in a web of desire and guilt, Captain Hale finds himself facing the consequences of his choices when the victim is murdered.",
    "publicPersona": "Charismatic and charming, known for his bravery at sea. His reputation for gallantry masks the turmoil of his personal life, where conflicting loyalties threaten to unravel him.",
    "privateSecret": "Struggles with feelings of guilt over his affair with Dr. Finch while still being in love with the victim, creating a tangled web of emotions.",
    "motiveSeed": "Ivor was caught between two women and feared losing both if the victim exposed his affair.",
    "motiveStrength": "compelling",
    "alibiWindow": "was seen socializing in the dining room until 9 PM, a detail that could either exonerate or implicate him.",
    "accessPlausibility": "possible",
    "stakes": "His desire for a stable relationship clashes with his romantic entanglements, threatening to destroy everything he holds dear.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with an easy charm, his words flowing smoothly as if he were addressing an audience. He often leans into self-deprecating humor, using it as a shield against the weight of his choices.",
    "signatureTic": "Well, that’s just perfect, isn’t it?",
    "internalConflict": "Ivor is torn between his love for the victim and the guilt of his affair with Dr. Finch, leading to a deep sense of internal strife.",
    "personalStakeInCase": "The murder forces Ivor to confront his feelings and the consequences of his actions, as he grapples with the potential loss of both women in his life.",
    "paragraphs": [
      "Captain Ivor Hale was a man who wore his charm like a well-tailored suit, effortlessly captivating those around him with tales of bravery and adventure. As a naval officer, he had earned respect and admiration, yet beneath the surface, his heart was a battleground. Caught between two women, he felt the weight of his choices bearing down on him, each decision leading to a tangled web of desire and guilt. The night of the murder, he had been socializing in the dining room, laughter and conversation swirling around him, but inside, he was anything but at ease.",
      "The victim, a woman he had once loved, had become a ghost haunting his thoughts. Ivor’s affair with Dr. Finch was a secret he had guarded jealously, yet the very act of hiding it left him feeling exposed. When he learned of the murder, a chill raced through him—what if the victim had planned to expose their affair? The thought was unbearable, and as he navigated the delicate social waters of the hotel, he could feel the tension rising. His alibi placed him in the dining room until 9 PM, but the fear that he might lose both women loomed heavily over him.",
      "Ivor’s charm often masked the turmoil within, yet in the face of tragedy, the facade began to crack. The stakes were more than just romantic entanglements; they were a matter of identity. He felt torn between the love he had for the victim and the guilt that came from his betrayal. Every interaction felt fraught with danger, as he weighed his words carefully, conscious of the eyes that scrutinized his every move. The clock was ticking, and the investigation was closing in, threatening to unravel the carefully constructed life he had built.",
      "As the days passed, Ivor found himself wrestling with the ghosts of his choices. He was a man of action, yet now he felt paralyzed by indecision. The truth of his relationships felt like a ticking time bomb, waiting to explode at the worst possible moment. His heart raced at the thought of losing both women, each representing a different part of himself. The charismatic officer who had faced danger at sea was now adrift in a sea of emotional turmoil, and he knew he had to confront the reality of his situation.",
      "In the end, Ivor realized that he could no longer hide behind his charm or his reputation. The truth would come to light, and he would have to face the consequences of his actions. The stakes were higher than ever, and as he navigated the treacherous waters of love and guilt, he understood that his journey was just beginning. The clock was ticking, and time was not on his side."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A determined hotel waitress with dreams of grandeur, Beatrice finds herself embroiled in a scandal that threatens her ambitions and future.",
    "publicPersona": "Eager to impress, Beatrice is known for her hard work and aspirations to advance in the hotel industry. She is often seen hustling between tables, her ambition palpable.",
    "privateSecret": "Has been embezzling money from the hotel to fund her ambitions, a secret that weighs heavily on her conscience.",
    "motiveSeed": "Beatrice recently overheard the victim threaten to expose her theft, a moment that sent her spiraling into fear.",
    "motiveStrength": "moderate",
    "alibiWindow": "was serving dinner guests until 8:45 PM, a timeframe that raises questions about her involvement.",
    "accessPlausibility": "easy",
    "stakes": "Her future in the hotel industry hangs by a thread, and the threat of exposure looms large over her.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks with a nervous energy, her words tumbling out in a rush when she’s anxious. She often resorts to self-deprecating humor to deflect attention from her insecurities.",
    "signatureTic": "Just my luck, really.",
    "internalConflict": "Beatrice grapples with the moral implications of her actions and the fear of losing everything she has worked for.",
    "personalStakeInCase": "The murder not only threatens her job but also forces her to confront the consequences of her embezzlement.",
    "paragraphs": [
      "Beatrice Quill was a whirlwind of ambition in the hotel, her eagerness to impress evident in every hurried step she took. As a waitress, she had dreams that soared far beyond the confines of her current position, yet the reality of her situation was more complicated. With each passing day, she found herself teetering on the brink of a precipice, her secret life as an embezzler casting a long shadow over her aspirations. The night of the murder, she had been serving dinner guests, her hands shaking slightly as she balanced trays laden with food. It was a night like any other until she overheard the victim threatening to expose her theft, a moment that sent her heart racing.",
      "As the realization dawned on her, Beatrice felt the ground shift beneath her. The stakes had risen dramatically, and the fear of exposure loomed large. She had been embezzling money from the hotel, convinced that it was a means to an end, a way to fund her dreams of advancement. But now, with the murder casting a pall over the hotel, every glance felt like an accusation, every whisper a reminder of her precarious position. She had served dinner until 8:45 PM, a timeline that raised questions about her involvement in the crime, and the anxiety gnawed at her insides.",
      "Beatrice's mind raced as she navigated the aftermath of the murder. Her public persona as an eager, hardworking waitress was in stark contrast to the turmoil within. She often resorted to self-deprecating humor, a defense mechanism that allowed her to deflect attention from her insecurities. 'Just my luck, really,' she would say with a nervous laugh, masking the fear that threatened to engulf her. The clock was ticking, and with each passing moment, the walls seemed to close in on her secrets.",
      "As the investigation unfolded, Beatrice felt the pressure mount. She was determined to prove herself, yet the weight of her actions threatened to crush her. Her dreams of advancement now felt like a distant mirage, and the very foundation of her future hung in the balance. The murder had turned her world upside down, and she was faced with the reality of her choices. Would she be able to navigate the treacherous waters of suspicion and come out unscathed?",
      "In the end, Beatrice understood that she could no longer hide from her past. The truth would come to light, and she would have to confront the consequences of her actions. The stakes were higher than ever, and as she grappled with the moral implications of her choices, she realized that her journey was just beginning. The clock was ticking, and time was not on her side."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A society matron with a sharp tongue, Sylvia Trent’s envy of the victim’s success leads her down a dark path of jealousy and suspicion.",
    "publicPersona": "An established figure in society, often attending prominent events and known for her sharp tongue. She thrives on social gatherings, where her opinions cut through the air like a knife.",
    "privateSecret": "Sylvia is resentful of the victim's recent success and social standing, feeling overshadowed and threatened.",
    "motiveSeed": "Sylvia believed the victim was plotting to ruin her social status with a scandalous article, a fear that ignited her jealousy.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in her suite preparing for an event until 9:10 PM, a timeframe that raises eyebrows.",
    "accessPlausibility": "possible",
    "stakes": "Her reputation and standing in society are threatened, forcing her to confront the reality of her envy.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a polished eloquence, her words flowing like honey but often laced with a biting undertone. She has a habit of making pointed remarks that reveal her disdain for those she perceives as rivals.",
    "signatureTic": "Well, isn't that just delightful?",
    "internalConflict": "Sylvia grapples with her jealousy and the fear that her status is slipping away, leading to a deep-seated resentment against the victim.",
    "personalStakeInCase": "The murder threatens her carefully curated social standing, forcing her to confront her own insecurities and the lengths she would go to protect her reputation.",
    "paragraphs": [
      "Sylvia Trent was a force to be reckoned with in the world of high society, her sharp tongue and keen insight making her a revered figure at any event. With an effortless grace, she navigated the intricate dance of social gatherings, where her opinions often cut through the air like a knife. Yet behind the polished façade lay a simmering resentment, fueled by the recent success of the victim, a woman she believed threatened her carefully curated social standing. As the news of the murder rippled through the community, Sylvia felt the ground shift beneath her feet.",
      "In the days leading up to the murder, Sylvia had sensed a plot brewing against her. The victim had been spreading rumors, and Sylvia feared that a scandalous article could ruin her reputation. The jealousy that festered within her ignited a dark path, one that she had never anticipated. The clock ticked ominously in her suite as she prepared for an upcoming event, her mind racing with thoughts of how to protect her status. She had been in her suite until 9:10 PM, a timeframe that left her with little room for error.",
      "As the investigation unfolded, Sylvia’s polished demeanor began to crack. She was no longer just a society matron; she was a woman desperate to maintain her position at any cost. The stakes were higher than ever, and her envy threatened to consume her. With each passing moment, the weight of suspicion hung over her, and she found herself grappling with the reality of her emotions. The truth of the murder felt like a reflection of her own insecurities, and she realized that she could no longer ignore the lengths she would go to protect her reputation.",
      "Sylvia spoke with a polished eloquence that often masked her disdain for those she perceived as rivals. 'Well, isn't that just delightful?' she would say with a saccharine smile, laced with a biting undertone that revealed her true feelings. The clock was ticking, and as the investigation intensified, she felt the pressure mount. Would she be able to navigate the treacherous waters of suspicion and come out unscathed?",
      "In the end, Sylvia understood that she could no longer hide behind her social status. The truth would come to light, and she would have to confront the consequences of her jealousy. The stakes were higher than ever, and as she grappled with her own insecurities, she realized that her journey was just beginning. The clock was ticking, and time was not on her side."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A cynical private investigator with a sharp wit, Hugo Vane finds himself entangled in a web of deceit as he investigates the murder of a colleague.",
    "publicPersona": "A sharp-witted investigator who often critiques the motives of others, known for his keen insight into the human psyche. He carries an air of cynicism that colors his interactions.",
    "privateSecret": "Hugo was hired to investigate the victim's financial dealings, a task that has now become dangerously personal.",
    "motiveSeed": "He discovered that the victim was involved in illegal activities that could take him down as well, intertwining their fates.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the hotel bar until 8:55 PM, a timeframe that raises suspicions about his involvement.",
    "accessPlausibility": "easy",
    "stakes": "His own credibility and career are at risk, as he grapples with the fallout of his investigation.",
    "humourStyle": "deadpan",
    "humourLevel": 0.6,
    "speechMannerisms": "Hugo speaks with a dry, measured tone, his words often laced with sarcasm. He has a tendency to deliver his observations in a flat, matter-of-fact manner that highlights his cynicism.",
    "signatureTic": "Ah, the irony of it all.",
    "internalConflict": "Hugo struggles with the moral implications of his investigation and the fear that his own past failures will resurface.",
    "personalStakeInCase": "The murder not only threatens his investigation but also forces him to confront his own demons, as he grapples with the consequences of his choices.",
    "paragraphs": [
      "Hugo Vane was no stranger to the murky waters of deceit; as a private investigator, he had navigated the complexities of human nature with a sharp wit and a keen eye for detail. His reputation as a cynical observer often preceded him, and he wore it like a badge of honor. But when he was hired to investigate the financial dealings of the victim, a colleague whose life was cut short, he found himself entangled in a web of deceit that threatened to engulf him. The clock was ticking, and the stakes were higher than ever.",
      "The night of the murder, Hugo had been in the hotel bar until 8:55 PM, nursing a drink while contemplating the tangled threads of his investigation. The victim’s illegal activities had come to light, and the realization that their fates were intertwined sent a chill down his spine. As he sifted through the evidence, he couldn’t shake the feeling that he was being drawn into a dangerous game, one that could cost him his credibility and career. The irony of it all was not lost on him; he had been hired to uncover the truth, yet now he found himself facing the very darkness he sought to expose.",
      "Hugo’s speech was marked by a dry, measured tone, often laced with sarcasm that reflected his cynical view of the world. 'Ah, the irony of it all,' he would mutter under his breath, a habit that underscored his frustration with the unfolding investigation. With each passing moment, the pressure mounted, and he felt the weight of his past failures looming over him. The stakes were not just professional; they were deeply personal, forcing him to confront the demons he had tried to outrun.",
      "As the investigation progressed, Hugo found himself wrestling with the moral implications of his work. The clock was ticking, and with each tick, the reality of the situation grew clearer. He had to navigate the treacherous waters of suspicion, all while grappling with the fear that his own choices would come back to haunt him. The truth was a double-edged sword, one that could either set him free or seal his fate.",
      "In the end, Hugo understood that he could no longer distance himself from the case. The murder was not just a job; it was a reckoning, forcing him to confront the consequences of his choices and the darkness that lay within. The stakes were higher than ever, and as he delved deeper into the investigation, he realized that time was not on his side. The clock was ticking, and the truth awaited, lurking just out of reach."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Cliffside Grand Hotel",
    "type": "Hotel",
    "place": "Byron Bay",
    "country": "Australia",
    "summary": "A grand seaside hotel with stunning ocean vistas, blending Art Deco and Colonial Revival styles.",
    "visualDescription": "The hotel boasts polished marble floors, sweeping staircases, and expansive windows framing the crashing waves below. Its façade features intricate geometric patterns and vibrant colors that hint at its Art Deco roots, while wide verandas provide a colonial touch.",
    "atmosphere": "A tension-filled space where the echoes of the past linger in the salty air.",
    "paragraphs": [
      "The Cliffside Grand Hotel stands majestically against the rugged backdrop of Byron Bay, its architecture a testament to the elegance of a bygone era. The salty breeze carries the scent of the ocean, mingling with the rich aroma of freshly brewed coffee from the lobby café. Guests bustle about, their chatter punctuated by the distant crash of waves and the occasional blare of a radio broadcasting the day's news, a reminder of the world outside.",
      "As the sun begins to set, the hotel transforms, the warm glow of vintage sconces casting long shadows across the marble floors. The lobby, with its soaring ceilings and artfully arranged furniture, feels both inviting and oppressive, a space where secrets lurk in the corners. Guests steal glances at one another, their faces illuminated by flickering candlelight, each harboring their own fears and anxieties in the aftermath of the war.",
      "The narrow corridors of the hotel lead to secluded rooms and staff-only areas, where the sounds of clattering dishes and hushed whispers create an atmosphere thick with intrigue. The balconies, overlooking the tumultuous sea, serve as both refuge and prison, where guests find solace yet remain under the watchful eye of the hotel staff. Every creak of the floorboards and rustle of curtains heightens the sense of mystery that envelops the Cliffside Grand."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain showers, typical for coastal regions during this time of year.",
    "timeFlow": "The unfolding drama of a single stormy night, with tensions escalating as secrets are revealed.",
    "mood": "Tense and anxious, reflecting the lingering effects of the war and the uncertainty of the post-war era.",
    "eraMarkers": [
      "Art Deco and Colonial Revival architecture",
      "Radio broadcasting in the lobby",
      "Guests discussing rationed gasoline"
    ],
    "sensoryPalette": {
      "dominant": "Salty sea air and polished marble",
      "secondary": [
        "Flickering candlelight and shadows",
        "Distant crash of waves"
      ]
    },
    "paragraphs": [
      "The atmosphere in the Cliffside Grand Hotel is thick with the scent of salt and dampness, a reminder of the tumultuous sea below. The overcast sky casts a muted light, filtering through the grand windows, creating a somber ambiance that resonates with the weight of unspoken fears. The echoes of laughter and conversation mingle with the crashing waves, each sound a reminder of the world beyond the hotel’s walls.",
      "As evening descends, the lobby transforms into a labyrinth of shadows, with the flickering candlelight illuminating the faces of weary guests. The air is pregnant with tension; whispers of past traumas and uncertain futures linger like the scent of tobacco smoke. The hotel, an architectural marvel, becomes a character in its own right, holding secrets within its walls, waiting for the right moment to reveal them."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "A vast area with high ceilings, adorned with chandeliers and art deco motifs; plush seating areas invite conversation.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate chandeliers glittering",
          "art deco furnishings",
          "large windows framing the sea",
          "lush potted palms"
        ],
        "sounds": [
          "murmurs of conversation",
          "the distant crackle of radio",
          "footsteps echoing on marble",
          "clinking of glassware",
          "the rustle of newspapers"
        ],
        "smells": [
          "freshly brewed coffee",
          "tobacco smoke",
          "old leather and polish",
          "salt from the sea",
          "scent of damp wood"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft upholstery of sofas",
          "cool metal of doorknobs",
          "crisp pages of newspapers",
          "warmth of candlelight"
        ]
      },
      "accessControl": "Guests can enter freely; staff maintain a presence for service.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked marble floors",
            "grey light filtering through windows",
            "cloudy reflections on the floor"
          ],
          "sounds": [
            "rain pattering on the roof",
            "muffled conversations",
            "the creak of old timbers",
            "dripping water from eaves",
            "the distant crash of waves"
          ],
          "smells": [
            "dampness in the air",
            "freshly brewed coffee",
            "wet stone",
            "faint mildew",
            "salt from the sea"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light across the lobby",
            "shadows deepening on the floor",
            "glistening surfaces after rain"
          ],
          "sounds": [
            "silence punctuated by footsteps",
            "the ticking of a wall clock",
            "soft laughter from a corner",
            "a radio playing softly",
            "the rustle of curtains"
          ],
          "smells": [
            "beeswax from candleholders",
            "dust from old books",
            "the scent of polished wood",
            "freshly ironed linens",
            "the tang of salt air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight dancing on walls",
            "glimmers of brass fixtures",
            "long shadows stretching across floors"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "soft music from a gramophone",
            "the laughter of guests",
            "clinking glassware",
            "the distant sound of waves"
          ],
          "smells": [
            "warm candle wax",
            "the aroma of dinner being served",
            "tobacco smoke curling",
            "the scent of old leather",
            "freshly polished wood"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby is the heart of the Cliffside Grand Hotel, a magnificent space that invites guests to linger. High ceilings adorned with stunning chandeliers create an airy atmosphere, while plush seating areas beckon weary travelers to rest. The lobby is a hub of activity, with guests checking in and out, their conversations blending with the soft crackle of a radio playing the latest news. The scent of freshly brewed coffee wafts through the air, mingling with the salty tang of the ocean, creating an intoxicating blend of comfort and nostalgia.",
        "As evening approaches, the lobby takes on a different character, shadows deepening as candlelight flickers against the walls. The chatter of guests becomes hushed, replaced by the occasional clink of glassware as drinks are served. The atmosphere is thick with unspoken tension; each guest seems to carry their own secrets, their eyes darting to the entrance, waiting for someone—or something—to arrive."
      ]
    },
    {
      "id": "crime_scene",
      "name": "Seaside Balcony",
      "type": "exterior",
      "purpose": "Crime scene where the body was discovered",
      "visualDetails": "A narrow balcony with wrought-iron railings overlooking the turbulent sea; the waves crash against the cliffs below.",
      "sensoryDetails": {
        "sights": [
          "dark storm clouds gathering",
          "foamy waves crashing below",
          "flickering shadows on the balcony",
          "wet stone tiles glistening",
          "seagulls circling overhead"
        ],
        "sounds": [
          "howling wind through the railings",
          "crashing waves against rocks",
          "distant thunder rumbling",
          "the creak of the balcony",
          "the rustle of wet leaves"
        ],
        "smells": [
          "salt and sea spray",
          "damp earth and moss",
          "the metallic scent of blood",
          "wet wood from the railing",
          "the musty odor of decay"
        ],
        "tactile": [
          "cold iron of the railing",
          "smooth wet tiles underfoot",
          "chill of the sea breeze",
          "rough texture of stone",
          "moist air clinging to skin"
        ]
      },
      "accessControl": "Restricted access; staff monitor the area, and guests are discouraged from approaching.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-slicked balcony tiles",
            "grey sky blending with sea",
            "drops falling from the railing"
          ],
          "sounds": [
            "steady drumming of rain",
            "the crash of waves",
            "water trickling off edges",
            "the distant call of seagulls",
            "the whisper of wind"
          ],
          "smells": [
            "fresh rain on stone",
            "the scent of wet earth",
            "the tang of salt in the air",
            "mildew from dampness",
            "the faint odor of decay"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds looming",
            "waves crashing with fury",
            "shadows dancing on the balcony"
          ],
          "sounds": [
            "the roar of the ocean",
            "the creaking of the balcony wood",
            "wind howling through the railings",
            "distant thunder rumbling",
            "the call of distant gulls"
          ],
          "smells": [
            "scent of brine and decay",
            "wet stone and moss",
            "the metallic tang of blood",
            "cold dampness in the air",
            "hint of mildew"
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting orange hues",
            "serene waves lapping gently",
            "shadows lengthening on the balcony"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant laughter of guests",
            "the rustle of palm fronds",
            "the crackle of a nearby fire",
            "the whisper of evening breeze"
          ],
          "smells": [
            "fresh sea air",
            "the scent of blooming jasmine",
            "the lingering aroma of dinner",
            "wood smoke from fires",
            "the salty tang of the ocean"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Seaside Balcony, once a quiet refuge for guests, has become the focus of a chilling mystery. Its wrought-iron railings overlook the turbulent sea, where waves crash violently against the cliffs below. The air is thick with salt and dampness, the scent of decay mingling with the brine—a haunting reminder of what transpired here. Dark storm clouds gather overhead, casting an oppressive shadow over the space, while the howling wind seems to carry with it whispers of secrets long buried.",
        "As investigators scour the area for clues, the tension is palpable. The balcony, slick with rain, offers a precarious footing, each step echoing the uncertainty that hangs in the air. The metallic scent of blood lingers, a stark contrast to the fresh sea breeze, marking this site as one of grim significance. The crashing waves below seem to roar with accusation, as if the ocean itself is demanding justice for what has occurred."
      ]
    },
    {
      "id": "kitchen",
      "name": "Hotel Kitchen",
      "type": "interior",
      "purpose": "Staff-only area for food preparation",
      "visualDetails": "A bustling space with stainless steel counters, large ovens, and shelves filled with ingredients; the air is thick with the aroma of cooking.",
      "sensoryDetails": {
        "sights": [
          "gleaming stainless steel appliances",
          "hanging pots and pans",
          "fresh produce stacked high",
          "busy chefs in white uniforms",
          "steam rising from pots"
        ],
        "sounds": [
          "clattering of pots and pans",
          "sizzling on stovetops",
          "the hum of refrigerators",
          "shouted orders from chefs",
          "the chopping of vegetables"
        ],
        "smells": [
          "rich aroma of simmering sauces",
          "fresh herbs and spices",
          "smoky scent of grilled meats",
          "the tang of citrus",
          "the warmth of baked bread"
        ],
        "tactile": [
          "smoothness of stainless steel",
          "warmth from the ovens",
          "coolness of produce",
          "rough texture of burlap sacks",
          "the weight of a chef's knife"
        ]
      },
      "accessControl": "Staff only; entry is restricted to kitchen personnel during service hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water dripping from window sills",
            "chefs preparing breakfast",
            "cloudy light filtering in"
          ],
          "sounds": [
            "the sound of rain against windows",
            "the sizzle of bacon on the grill",
            "the chatter of staff",
            "clinking of utensils",
            "the hum of kitchen machinery"
          ],
          "smells": [
            "the scent of fresh coffee",
            "the aroma of pancakes cooking",
            "the dampness of rain",
            "the tang of citrus",
            "the scent of baked goods"
          ],
          "mood": "busy and industrious"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadowy light in the kitchen",
            "chefs prepping for dinner",
            "ingredients laid out for service"
          ],
          "sounds": [
            "the chopping of vegetables",
            "the roar of the oven",
            "the hum of the refrigerator",
            "the clatter of pots",
            "the faint sound of radio"
          ],
          "smells": [
            "the rich scent of stews",
            "fresh herbs being chopped",
            "the warmth of baked bread",
            "the tang of vinegar",
            "the scent of aged cheese"
          ],
          "mood": "tense and focused"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft glow of kitchen lights",
            "chefs plating elegant dishes",
            "the vibrant colors of fresh produce"
          ],
          "sounds": [
            "the sizzling of food",
            "the clinking of plates",
            "the murmur of staff conversations",
            "the hum of ovens",
            "the distant laughter from the dining area"
          ],
          "smells": [
            "the aroma of gourmet meals",
            "the scent of fresh herbs",
            "the sweetness of desserts",
            "the warmth of baked bread",
            "the tang of grilled meats"
          ],
          "mood": "energetic and anticipatory"
        }
      ],
      "paragraphs": [
        "The Hotel Kitchen is a whirlwind of activity, a hive of culinary creativity where staff bustle about, preparing meals for the guests. Stainless steel counters gleam under the harsh lights, while the rich aromas of simmering sauces and fresh herbs fill the air, creating a sensory feast. The sound of clattering pots and sizzling meat is punctuated by the shouts of chefs coordinating their efforts, each moment a testament to the chaos and precision of the culinary arts.",
        "As the day progresses, the kitchen transforms into a tense environment, the pressure mounting as dinner service approaches. Shadows deepen with the overcast skies outside, and the staff work with a focused intensity, each chop of a knife and stir of a pot echoing the urgency of their task. The air thickens with the scent of rich stews and baked bread, a comforting reminder of the warmth this space provides amidst the storm brewing outside."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Quiet space for reflection and reading",
      "visualDetails": "A cozy room lined with dark wooden shelves filled with books; comfortable armchairs invite guests to linger.",
      "sensoryDetails": {
        "sights": [
          "fading light from a single lamp",
          "plush armchairs in deep colors",
          "old maps on the walls",
          "dust motes dancing in the air"
        ],
        "sounds": [
          "soft rustling of pages turning",
          "the distant sound of waves",
          "the creak of wooden floors",
          "the ticking of a clock",
          "the whisper of wind outside"
        ],
        "smells": [
          "the musty scent of old books",
          "the aroma of polished wood",
          "the faint scent of tobacco",
          "the warmth of leather bindings",
          "the freshness of salt air"
        ],
        "tactile": [
          "rough texture of book covers",
          "softness of upholstered chairs",
          "coolness of glass windowpanes",
          "the weight of a thick novel",
          "the smoothness of polished wood"
        ]
      },
      "accessControl": "Guests may enter freely during the day; closed after dinner.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops trickling down windows",
            "dim light filtering through clouds",
            "shadows cast by bookshelves"
          ],
          "sounds": [
            "rain pattering on the roof",
            "the rustle of pages",
            "the creak of wood underfoot",
            "the distant crash of waves",
            "the whisper of wind"
          ],
          "smells": [
            "the scent of wet wood",
            "the musty odor of books",
            "the freshness of rain",
            "the aroma of polished furniture",
            "the tang of salt in the air"
          ],
          "mood": "reflective and serene"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light in the library",
            "shadows lengthening on the floor",
            "dust motes illuminated by light"
          ],
          "sounds": [
            "soft whispers of guests",
            "the ticking of a clock",
            "the rustle of pages",
            "the creak of old furniture",
            "the distant sound of waves"
          ],
          "smells": [
            "the scent of old paper",
            "the aroma of polished wood",
            "the faint scent of leather",
            "the freshness of salt air",
            "the musty odor of books"
          ],
          "mood": "melancholic and introspective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft glow of a reading lamp",
            "shadows dancing on the walls",
            "the flicker of candlelight"
          ],
          "sounds": [
            "the quiet rustle of pages",
            "the distant laughter of guests",
            "the ticking of a clock",
            "the crackle of a fire",
            "the soft whisper of wind"
          ],
          "smells": [
            "the warmth of leather bindings",
            "the scent of burning wood",
            "the aroma of freshly brewed tea",
            "the musty scent of old books",
            "the tang of salt air"
          ],
          "mood": "mysterious and contemplative"
        }
      ],
      "paragraphs": [
        "The Library offers a tranquil retreat from the bustle of the hotel, its dark wooden shelves lined with a treasure trove of books waiting to be explored. The scent of polished wood and old paper fills the air, creating an inviting atmosphere that encourages quiet reflection. Plush armchairs beckon guests to curl up with a novel, their deep colors contrasting against the warm glow of a solitary lamp illuminating the room.",
        "As shadows lengthen with the setting sun, the library transforms into a space of introspection, where the ticking of a clock and the distant sound of waves create a rhythmic backdrop to the quiet. The air is thick with secrets, each book a vessel of untold stories, while the scent of salt air drifts in through the open window, reminding guests of the world outside. Here, amidst the stillness, one can almost hear the whispers of history echoing within the pages."
      ]
    }
  ],
  "note": "",
  "cost": 0.00288086535,
  "durationMs": 30535
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1942,
    "month": "August",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "muggy air"
    ],
    "daylight": "Long summer days with daylight lingering until nearly eight-thirty in the evening, but heavy clouds often obscure the sun's warmth.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel guests settle in for the night.",
    "holidays": [
      "Victory over Japan Day (observed on August 15 in some areas)"
    ],
    "seasonalActivities": [
      "seaside strolls under the canopy of clouds",
      "attending local dances and social gatherings",
      "participating in charity events for war relief"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suit in navy blue",
        "lightweight linen dress shirt",
        "wingtip shoes"
      ],
      "casual": [
        "cotton short-sleeve shirt",
        "khaki trousers",
        "straw fedora"
      ],
      "accessories": [
        "silk tie",
        "pocket square",
        "leather belt"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a cinched waist",
        "satin gloves",
        "pearl necklace"
      ],
      "casual": [
        "floral print blouse",
        "high-waisted shorts",
        "canvas espadrilles"
      ],
      "accessories": [
        "wide-brimmed sun hat",
        "beaded clutch purse",
        "simple earrings"
      ]
    },
    "trendsOfTheMoment": [
      "utility clothing reflecting wartime rationing",
      "bold floral patterns",
      "emphasis on practicality and comfort"
    ],
    "socialExpectations": [
      "men expected to wear a hat in public",
      "women encouraged to maintain traditional feminine styles",
      "social gatherings often include dancing and light refreshments"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the Battle of Stalingrad intensifies",
      "the Allied forces make progress in the Pacific Theater",
      "rationing of various goods including clothing and food continues"
    ],
    "politicalClimate": "The political landscape is dominated by wartime measures and preparations for upcoming military campaigns, with public support for the war effort remaining strong.",
    "economicConditions": "Wartime economy leads to rationing and shortages, yet there is a sense of unity and determination among the population.",
    "socialIssues": [
      "displacement of families due to war",
      "increasing roles of women in the workforce",
      "racial tensions exacerbated by economic strain"
    ],
    "internationalNews": [
      "the United States implements conscription for the war effort",
      "news of Allied victories brings a mix of hope and caution",
      "growing concerns over potential threats from Axis powers"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - 'White Christmas'",
        "Glenn Miller - 'In the Mood'",
        "Doris Day - 'Sentimental Journey'"
      ],
      "films": [
        "Casablanca",
        "Mrs. Miniver",
        "The Maltese Falcon"
      ],
      "theater": [
        "Oklahoma!",
        "The Glass Menagerie"
      ],
      "radio": [
        "The Shadow",
        "Suspense",
        "The Lone Ranger"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Fountainhead by Ayn Rand",
        "The Robe by Lloyd C. Douglas",
        "The Little Prince by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "war fiction",
        "detective novels",
        "romantic dramas"
      ]
    },
    "technology": {
      "recentInventions": [
        "jet engine technology is being developed",
        "early computers start to take form",
        "advancements in radar technology"
      ],
      "commonDevices": [
        "radio sets in most households",
        "manual typewriters",
        "early model televisions in affluent homes"
      ],
      "emergingTrends": [
        "increased reliance on radio for news and entertainment",
        "growing interest in aviation technology",
        "development of automated production techniques"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "Movie ticket: one shilling",
        "Cigarettes: seven pence a pack"
      ],
      "commonActivities": [
        "gathering for picnics at the beach",
        "attending community dances",
        "volunteering for war-related charities"
      ],
      "socialRituals": [
        "evening card games among friends",
        "Sunday church services",
        "weekly dances hosted at local halls"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased solidarity across social classes due to shared wartime experiences",
      "growing resentment towards the wealthy who evade service"
    ],
    "gender": [
      "women are praised for contributing to the workforce",
      "traditional gender roles are challenged as women take on new jobs",
      "expectations remain for women to maintain familial duties"
    ],
    "race": [
      "racial segregation persists, but there are movements advocating for civil rights",
      "increased visibility of African American contributions to the war effort"
    ],
    "generalNorms": [
      "community engagement is valued, with social gatherings fostering unity",
      "discussions about the war dominate social interactions",
      "personal sacrifices for the greater good are seen as noble"
    ]
  },
  "atmosphericDetails": [
    "The smell of damp earth and briny sea air mingles as rain falls softly against the hotel's windows, creating a soothing yet eerie backdrop.",
    "The sound of jazz and swing music wafts through the hotel lobby, with couples swaying gently, their spirits lifted despite the clouded skies outside.",
    "Conversations are hushed and laden with the weight of uncertainty, punctuated by the occasional laughter that attempts to drown out the ever-looming specter of war."
  ],
  "paragraphs": [
    "In August 1942, the coastal hotel stands as a weary sentinel against the backdrop of an intensifying global conflict. The summer air hangs heavy with humidity, and rain showers intermittently drench the streets, giving rise to an ambiance both romantic and melancholic. Guests retreat to the warmth of the lobby where the sounds of jazz create a lively contrast to the tense atmosphere outside, where the echoes of war resonate in the minds of all who gather. The lingering effects of rationing are evident in the modest adornments of the attendees, but a sense of camaraderie pulls them together as they seek solace in shared experiences.",
    "Fashion during this summer reflects the duality of wartime necessity and lingering elegance. Men don tailored suits, often navy or charcoal, paired with light linen shirts, while women grace the space in tea-length dresses adorned with floral patterns, a nod to the vibrant spirit that persists amidst adversity. Accessories like silk ties and wide-brimmed hats complete their ensembles, allowing them to showcase a semblance of normalcy and style. The blending of practicality and aesthetics highlights the resilience of a society grappling with change yet yearning for beauty.",
    "Daily life unfolds against a backdrop of uncertainty, where the prices of goods like a loaf of bread remain relatively stable, yet the threat of scarcity looms large. Social rituals, such as gathering for evening card games or attending local dances, become lifelines for the residents, offering fleeting escapes from the harsh realities outside. As women step into roles traditionally held by men, the balance of society shifts, creating a new dynamic that challenges long-held norms. In this hotel, the laughter and whispered conversations mingle with the sound of rain, weaving a tapestry of hope and anxiety that defines this summer of 1942."
  ],
  "note": "",
  "cost": 0.00109168125,
  "durationMs": 11644
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense gathering at a grand seaside hotel for a business conference unites guests and staff under the strain of post-war anxieties and emerging social changes, all while a mechanical clock-tampering murder unfolds.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is shifting with more women taking roles traditionally held by men, creating tensions amidst lingering war trauma and the pressures of Cold War uncertainties."
  },
  "setting": {
    "location": "A grand seaside hotel on a cliffside with expansive ocean views.",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain showers, typical for coastal regions."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a mechanical clock-tampering method, where a rewound timepiece staged the apparent time of death."
}

### LOCKED_FACTS
[
  {
    "id": "time_of_death",
    "value": "ten minutes past eleven",
    "description": "The clock was set to this time when authorities arrived."
  },
  {
    "id": "party_end_time",
    "value": "eleven o'clock",
    "description": "The party officially concluded at this time."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 6,
    "mid": 13,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
    "supporting": 1,
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
      "category": "physical"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
      "criticality": "supporting",
      "category": "temporal"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_14",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
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
