# Actual Prompt Record

- Run ID: `mystery-1784576119605`
- Project ID: ``
- Timestamp: `2026-07-20T19:39:41.948Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `82d7f3f13de7a166`

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
    "title": "Tides of Deceit",
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
      "subtype": "drowning"
    }
  },
  "death_method": "drowned",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp-witted investigator with a keen sense for detail.",
      "private_secret": "Struggles with her past failures in solving cases.",
      "motive_seed": "Desire to prove herself in a male-dominated field.",
      "motive_strength": "high",
      "alibi_window": "11:00 PM - 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel staff access",
        "Guest interactions"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Observant"
      ],
      "stakes": "Her reputation as a capable detective.",
      "evidence_sensitivity": [
        "Witness statements",
        "Tide schedules"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Expert",
      "relationships": [
        "Former mentor to Hugo Vane"
      ],
      "public_persona": "Respected physician known for her medical expertise.",
      "private_secret": "Experiencing a moral conflict over past decisions.",
      "motive_seed": "Protecting her reputation.",
      "motive_strength": "moderate",
      "alibi_window": "11:00 PM - 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to medical records",
        "Knowledge of tide timings"
      ],
      "behavioral_tells": [
        "Nervous when discussing Hugo"
      ],
      "stakes": "Her career and legacy.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Military Officer",
      "relationships": [
        "Friend of the victim"
      ],
      "public_persona": "Charismatic and authoritative figure.",
      "private_secret": "Harbors jealousy towards Hugo's achievements.",
      "motive_seed": "Professional rivalry.",
      "motive_strength": "moderate",
      "alibi_window": "11:00 PM - 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Military access to restricted areas"
      ],
      "behavioral_tells": [
        "Too eager to dismiss questions about Hugo"
      ],
      "stakes": "His standing in the military.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Socialite",
      "relationships": [
        "Acquaintance of the victim"
      ],
      "public_persona": "Charming and well-connected.",
      "private_secret": "In debt to an unsavory character.",
      "motive_seed": "Desperation to resolve her financial issues.",
      "motive_strength": "low",
      "alibi_window": "11:00 PM - 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Social events in the hotel"
      ],
      "behavioral_tells": [
        "Evasive when asked about her whereabouts"
      ],
      "stakes": "Her social standing and financial security.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Mysterious Guest",
      "relationships": [
        "Stranger to all"
      ],
      "public_persona": "Reserved and secretive.",
      "private_secret": "Searching for a missing relative.",
      "motive_seed": "Unclear intentions.",
      "motive_strength": "unknown",
      "alibi_window": "11:00 PM - 11:30 PM",
      "access_plausibility": "low",
      "opportunity_channels": [
        "Free access to hotel areas"
      ],
      "behavioral_tells": [
        "Fidgets when asked personal questions"
      ],
      "stakes": "Finding her relative and uncovering the truth.",
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
        "Friend to Captain Hale"
      ],
      "public_persona": "Well-liked and accomplished individual.",
      "private_secret": "Struggled with personal demons.",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "N/A",
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
      "Captain Ivor Hale"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In the midst of a stormy night at a coastal hotel, the body of Hugo Vane is discovered drowned just as the tide reached its peak. As tensions rise among the guests, Detective Eleanor Voss must untangle a web of lies and rivalries to uncover the truth behind the seemingly accidental death."
    },
    "accepted_facts": [
      "Hugo Vane was found drowned near the shore.",
      "The tide was at its highest during the time of death."
    ],
    "inferred_conclusions": [
      "Hugo's death was not an accident but a murder disguised by the timing of the tides."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "Hugo Vane was deliberately drowned during high tide to create the appearance of an accident, while the actual time of the murder was masked by a manipulated hotel clock.",
      "delivery_path": [
        {
          "step": "The murderer set the hotel clock forward before the murder."
        },
        {
          "step": "Hugo was lured to the shore under the pretense of safety."
        },
        {
          "step": "The murderer drowned Hugo as the tide peaked."
        }
      ]
    },
    "outcome": {
      "result": "The murder was disguised as a tragic accident due to the timing of the tides and the manipulated clock."
    }
  },
  "false_assumption": {
    "statement": "Hugo drowned due to an unfortunate accident caused by high tide.",
    "type": "temporal",
    "why_it_seems_reasonable": "The tidal schedule indicated high tide at the time of the incident, leading everyone to believe it was an accident.",
    "what_it_hides": "The manipulated clock and the true timeline of events."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Witnesses claimed she was seen near the shore shortly before Hugo was found.",
      "Her medical expertise made her seem capable of concealing a murder."
    ],
    "the_one_flaw": "Her alibi was verified by multiple guests who saw her in the dining area at the critical time.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Dr. Mallory Finch's presence near the shore just before the incident.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "She was checking on a guest who had fallen ill earlier.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Captain Ivor Hale's insistence that the tide was dangerous.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was genuinely concerned for everyone's safety, given the weather.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were guests at the hotel at the time of the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "High tide at 11:10 PM"
      ],
      "windows": [
        "11:00 PM - 11:30 PM"
      ],
      "contradictions": [
        "Witnesses claim the clock chimed at the wrong time, indicating it was tampered with."
      ]
    },
    "access": {
      "actors": [
        "All suspects are guests"
      ],
      "objects": [
        "Hotel clock",
        "Tide charts"
      ],
      "permissions": [
        "Access to the beach area"
      ]
    },
    "physical": {
      "laws": [
        "Tidal patterns are predictable and documented."
      ],
      "traces": [
        "Footprints leading to the water but none returning."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust each other due to shared experiences."
      ],
      "authority_sources": [
        "Hotel management's timeline of events."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Footprints leading to the water's edge but none returning.",
        "correction": "This indicates someone was taken to the shore and did not return.",
        "effect": "Narrows suspect list to those who had access to the beach.",
        "required_evidence": [
          "Footprints discovered near the shore.",
          "Witness statements confirming no one returned from the shore."
        ],
        "reader_observable": true
      },
      {
        "observation": "The hotel clock shows a time that does not match witness accounts.",
        "correction": "This suggests possible tampering to create confusion around the time of death.",
        "effect": "Eliminates the assumption that Hugo's death was purely accidental.",
        "required_evidence": [
          "Clock showing inaccurate time.",
          "Witness statements about the clock chiming incorrectly."
        ],
        "reader_observable": true
      },
      {
        "observation": "Tide charts indicate high tide at ten minutes past eleven.",
        "correction": "This confirms the timing of the tide coincided with the murder.",
        "effect": "Narrows the opportunity window for the murder to the high tide period.",
        "required_evidence": [
          "Tide schedules available in the hotel lobby.",
          "Witness accounts indicating the tide was high."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Reconstruct the timeline of events using tide charts and clock discrepancies to demonstrate how the murder was timed to occur during high tide, while the clock misled investigators.",
    "knowledge_revealed": "The manipulation of the hotel clock directly affected the perceived time of death.",
    "pass_condition": "Demonstrates that the time of death was manipulated by the clock, proving that the murder was premeditated.",
    "evidence_clues": [
      "clue_9",
      "clue_2",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "All clues regarding clock tampering, tide timings, and footprint evidence are presented before the solution, allowing the reader to deduce the true circumstances of the murder."
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
        "Observe the results of the timeline reconstruction",
        "Draw conclusion about the manipulation of events"
      ],
      "test_type": "timeline reconstruction"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi by multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proven to be in the dining area at the time of death.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No motive or opportunity linked to the murder.",
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
      "revelation_method": "Confrontation with evidence of clock manipulation and timeline discrepancies."
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
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation of tide charts."
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
        "delivery_method": "Witness statement about the clock."
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
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Footprints discovered near the crime scene."
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A travel writer with a penchant for adventure, Eleanor finds herself embroiled in a murder investigation that hits too close to home.",
    "publicPersona": "Charming and adventurous, known for her captivating travel articles.",
    "privateSecret": "Hides her romantic involvement with the victim's ex-fiance.",
    "motiveSeed": "Curiosity about the events surrounding the murder and personal ties to the victim.",
    "motiveStrength": "moderate",
    "alibiWindow": "was at the hotel bar from 6 PM until the murder was discovered around 9.",
    "accessPlausibility": "easy",
    "stakes": "Desires to uncover the truth for her own peace of mind and professional integrity.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a light, airy cadence, often punctuating her observations with a hint of irony. She has a tendency to ask rhetorical questions, drawing her audience into her thought process.",
    "signatureTic": "Well, that’s just charming, isn’t it?",
    "internalConflict": "Eleanor grapples with guilt over her affair and the fear that her involvement may cloud her judgment as she seeks the truth.",
    "personalStakeInCase": "The murder forces her to confront her own choices and the consequences of her romantic entanglements.",
    "paragraphs": [
      "Eleanor Voss had always been a woman of the world, her fingers stained with ink and the scents of distant lands. Yet here she was, in a coastal hotel, entangled in a web of secrets that felt all too personal. The vibrant tales she spun in her travel articles were now overshadowed by the chilling reality of murder, an ugly stain on her adventurous spirit. The irony was not lost on her; she was supposed to be the one uncovering stories, not living one fraught with such peril.",
      "As she perched on a barstool, the dim light casting shadows on her thoughtful face, Eleanor couldn’t help but reflect on how her past had collided with her present. Her heart ached not just for the victim but for the tangled emotions surrounding her illicit affair with the victim's ex-fiancé. The thrill of romance had turned sour, and now the stakes felt unbearably high. Could she truly remain objective as she sifted through the debris of betrayal and loss?",
      "Her curiosity was piqued by the murder, but there was more at play. The hotel, with its secrets and stories, whispered to her, beckoning her to investigate. Eleanor's instincts as a writer urged her to dig deeper, to expose the truth hidden beneath layers of deceit. Yet, every revelation felt like a dagger to her heart, reminding her of the choices she had made and the lives they had affected. How could she reconcile her personal ties to the victim with her pursuit of justice?",
      "Eleanor’s journey would not only involve uncovering the murderer but also confronting her own demons. The path to truth was fraught with peril, and with each step, she felt the weight of her choices pressing down on her. Could she emerge from this investigation unscathed, or would the tides of deceit pull her under, drowning her in guilt and despair?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected physician with a hidden affair, Dr. Finch finds herself caught in a web of scandal and suspicion after the murder of her lover.",
    "publicPersona": "Esteemed doctor, known for her charity work and dedication to the community.",
    "privateSecret": "Was having a clandestine affair with the victim and was under pressure to end it.",
    "motiveSeed": "Fears that the victim will reveal their relationship, jeopardizing her career and reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims she was attending a medical conference in the city from 5 PM onwards.",
    "accessPlausibility": "possible",
    "stakes": "Protecting her career and social standing as a respected physician.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a calm authority, often employing medical jargon and precision in her language. When under pressure, her sentences can tighten, revealing her anxiety beneath the composed exterior.",
    "signatureTic": "You know, the human body is a fascinating thing, isn’t it?",
    "internalConflict": "Mallory is torn between her professional reputation and her emotional desires, fearing the repercussions of her affair.",
    "personalStakeInCase": "The murder not only threatens her career but also forces her to confront the fragility of her personal life.",
    "paragraphs": [
      "Dr. Mallory Finch had built her life around precision and care, a trusted physician in a community that revered her. Yet, behind the polished exterior lay a tumultuous secret, one that threatened to unravel everything she had worked for. The affair with the victim had been intoxicating, a dangerous liaison that filled her otherwise regimented life with passion. But now, as she faced the aftermath of murder, that passion felt like a noose tightening around her neck.",
      "As she stood before her peers at the medical conference, Mallory's mind was far from the lectures on advanced surgical techniques. She was haunted by the fear that her clandestine relationship would come to light, shattering her reputation and career. The victim had hinted at revealing their affair, a threat that loomed over her like a dark cloud. How could she possibly navigate the storm that was brewing?",
      "In the sterile world of medicine, she had always prided herself on maintaining a moral compass. Yet, her heart had led her astray, and now the consequences were dire. The stakes had never been higher; she was not just a doctor but a woman caught in a scandal that could destroy her life. Each moment spent in the company of her colleagues felt like a ticking clock, reminding her of the impending doom that could descend at any moment.",
      "Mallory's character arc would take her through a labyrinth of guilt and self-discovery. She would have to confront her choices, the reasons behind her affair, and the impact it had on her life and those around her. The truth, however painful, was the only remedy she could rely on if she hoped to reclaim her life and career from the shadows of deceit."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A charismatic naval officer with a gambling problem, Ivor is torn between maintaining his reputation and confronting his financial ruin after the murder of the victim.",
    "publicPersona": "Dashing and charismatic, a well-regarded officer on leave.",
    "privateSecret": "In debt due to gambling and had been pressured by the victim for repayment.",
    "motiveSeed": "The victim threatened to reveal his financial woes if he didn’t pay back the money.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claims he was at a nearby pub from 7 PM to 9 PM.",
    "accessPlausibility": "possible",
    "stakes": "Losing his reputation and position within the Navy due to financial ruin.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a confident bravado, often peppering his dialogue with charming quips. When under stress, he may deflect with humour, masking his vulnerability beneath a layer of bravado.",
    "signatureTic": "Well, isn’t that just the way of it?",
    "internalConflict": "Ivor struggles with the weight of his financial failures and the fear of losing everything he has worked for.",
    "personalStakeInCase": "The murder forces him to confront his gambling addiction and the precariousness of his lifestyle.",
    "paragraphs": [
      "Captain Ivor Hale was the embodiment of charisma, a naval officer whose charm could disarm even the most stoic of souls. But beneath the polished surface lay a tempest of secrets, most notably a gambling addiction that threatened to sink his career. The murder of the victim had thrown his life into disarray, and the stakes had never felt higher. With debts piling up, Ivor found himself ensnared in a web of threats and desperation, one that could cost him everything.",
      "As he leaned against the bar at the nearby pub, Ivor tried to project an air of nonchalance, but the weight of his financial troubles loomed large. The victim had been a constant reminder of his failings, a figure who had pressured him for repayment, threatening to expose his secrets. The thought of losing his reputation within the Navy was a bitter pill to swallow, and Ivor’s bravado felt increasingly hollow as the truth of his situation sank in.",
      "His interactions were laced with sardonic humour, a defense mechanism against the reality he faced. Ivor had always been the life of the party, but the laughter felt forced, a mask he donned to hide his anxiety. Every quip was a reminder of the precariousness of his position, and the fear that someone would uncover the truth clawed at him. How long could he keep up the charade before it all came crashing down?",
      "Ivor’s character arc would force him to confront not only his gambling addiction but also the impact of his choices on those he cared about. The murder investigation would be a catalyst for change, a chance for Ivor to redefine himself beyond the charm and bravado. But first, he would need to face the consequences of his actions and the truth that lay beneath the surface."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An ambitious art student, Beatrice struggles between her artistic aspirations and the integrity of her craft after being rejected by the victim.",
    "publicPersona": "An aspiring artist known for her bold, experimental style.",
    "privateSecret": "Had been rejected by the victim for the gallery exhibition she desperately wanted.",
    "motiveSeed": "Believed that the victim's refusal would hinder her career and future opportunities.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been sketching on the beach from 6 PM until 8 PM.",
    "accessPlausibility": "possible",
    "stakes": "Her future in the art world hinged on being accepted by the elite, including the victim.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a fervent passion, her words often spilling forth in an excited rush. She tends to interject her thoughts with self-deprecating jabs, revealing her insecurities as an artist.",
    "signatureTic": "Oh, who am I kidding?",
    "internalConflict": "Beatrice battles with her ambition and the ethical dilemmas of her aspirations in the art world.",
    "personalStakeInCase": "The murder has forced her to reassess her artistic integrity and the lengths she is willing to go for success.",
    "paragraphs": [
      "Beatrice Quill was a whirlwind of creativity, her passion for art evident in every brushstroke and sketch she produced. Yet, ambition came with a price, and after being rejected by the victim for a coveted gallery exhibition, her dreams felt precariously out of reach. The murder had sent shockwaves through her small artistic community, and Beatrice couldn’t help but wonder if her disappointment had driven her to the brink of desperation. What would she do now that the victim was gone?",
      "As she sat on the beach, sketchbook in hand, Beatrice poured her emotions into her art, each stroke a reflection of her turmoil. The waves crashed around her, echoing her inner conflict. She longed for acceptance, for validation from the elite of the art world, but at what cost? The victim’s refusal to showcase her work had felt like a personal affront, and now, with their death, she was left grappling with a mixture of grief and resentment.",
      "Her self-deprecating humour often seeped into her conversations, a defense mechanism against the harsh realities of her aspirations. Beatrice would joke about her artistic failures, but beneath the laughter lay a deep-seated fear of inadequacy. She was torn between her ambition to succeed and the ethical implications of her pursuit. How far would she go to achieve her dreams, and would she be willing to compromise her integrity for the sake of recognition?",
      "The investigation into the murder would force Beatrice to confront her ambitions and the choices she had made. As she navigated the complexities of the art world, she would have to decide whether her future was worth sacrificing her values. The tides of deceit could either drown her aspirations or propel her to a new understanding of what it meant to be an artist."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A glamorous socialite with a bitter past, Sylvia struggles with unresolved feelings for the victim amidst a backdrop of high society intrigue.",
    "publicPersona": "A glamorous and influential socialite with a keen interest in the arts.",
    "privateSecret": "Once had a romantic relationship with the victim which ended bitterly.",
    "motiveSeed": "Resented the victim for publicly moving on and intended to sabotage her new ventures.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims she was hosting a dinner party across town during the murder.",
    "accessPlausibility": "unlikely",
    "stakes": "Preserving her status in society and dealing with unresolved feelings of jealousy.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Sylvia speaks with a sharp, incisive tone, often cutting through pleasantries with her blunt observations. She has an air of confidence that can turn icy when provoked.",
    "signatureTic": "Oh darling, let’s not pretend.",
    "internalConflict": "Sylvia grapples with jealousy and resentment towards the victim, torn between her past and her desire for social standing.",
    "personalStakeInCase": "The murder threatens to expose her unresolved feelings and jeopardize her carefully curated reputation in high society.",
    "paragraphs": [
      "Sylvia Trent was no stranger to the limelight, a socialite whose charm and elegance captivated those around her. But beneath the polished exterior lay a tumultuous sea of unresolved emotions, particularly towards the victim, with whom she once shared a passionate romance. Their relationship had ended bitterly, leaving Sylvia to grapple with feelings of jealousy and resentment that festered beneath her glamorous façade. The murder of the victim had reignited those feelings, forcing her to confront the ghosts of her past.",
      "As she hosted a dinner party across town, Sylvia felt the weight of her social obligations pressing down on her. Her guests were oblivious to the turmoil brewing beneath her composed exterior. The bitter irony of the situation was not lost on her – the very person she had wanted to sabotage was now dead, and the implications of that death loomed large over her carefully curated reputation. How could she maintain her status in society amidst such scandal?",
      "Sylvia's blunt observations often cut through the polite chatter of high society, revealing her sharp wit and unyielding confidence. Yet, her humour masked a deeper vulnerability, a fear of being exposed for the unresolved feelings she harbored. The victim’s public moving on had felt like a slap in the face, and now, with their murder, she was left grappling with the consequences of her past decisions. What would the truth reveal about her character and her motives?",
      "The investigation would force Sylvia to confront the impact of her choices, not just on her reputation but on her emotional well-being. She would need to navigate the treacherous waters of jealousy and resentment, ultimately deciding whether to embrace her past or let it drown her in a sea of deceit."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A cynical private investigator with a tarnished reputation, Hugo's financial troubles and questionable ethics come to light after his murder.",
    "publicPersona": "A cynical investigator known for his no-nonsense approach to crime.",
    "privateSecret": "Is in financial trouble and hoped to gain a lucrative case by exploiting the situation.",
    "motiveSeed": "Wanted to recover his lost income by publicly showcasing the hotel’s negligence in security.",
    "motiveStrength": "weak",
    "alibiWindow": "Claims he was observing the hotel staff from 6 PM onward for a private matter.",
    "accessPlausibility": "easy",
    "stakes": "Desperation to salvage his reputation as a successful investigator.",
    "humourStyle": "deadpan",
    "humourLevel": 0.2,
    "speechMannerisms": "Hugo speaks in a flat, monotone voice, often delivering his observations with a dry, sardonic edge. His dialogue is succinct, devoid of embellishments, reflecting his cynical worldview.",
    "signatureTic": "Life’s just a series of unfortunate events, isn’t it?",
    "internalConflict": "Hugo struggles with the ethical implications of his actions and the desperation that drives him to exploit situations.",
    "personalStakeInCase": "The murder threatens to expose his financial troubles and tarnish his already fragile reputation as a private investigator.",
    "paragraphs": [
      "Hugo Vane was a man of few words, his reputation as a private investigator marred by cynicism and a string of questionable ethics. He had once been a force to be reckoned with, but now, financial troubles loomed large, casting a shadow over his once-promising career. The murder that had taken place in the coastal hotel was more than just a crime; it was an opportunity – a chance to salvage his reputation by exposing the hotel’s negligence. But at what cost?",
      "As he observed the hotel staff from his inconspicuous perch, Hugo’s deadpan demeanor masked a whirlwind of thoughts. The irony of his situation was not lost on him; he was a man on the precipice, desperate to regain his footing. His dry observations cut through the chaos around him, but beneath the surface lay a man wrestling with his own demons. The financial desperation that drove him to exploit situations weighed heavily on his conscience.",
      "His speech was succinct, devoid of the embellishments that often clouded the truth. Hugo had learned the hard way that life was a series of unfortunate events, and he had become adept at navigating the murky waters of deception. Yet, as the investigation unfolded, he found himself questioning the very ethics that had guided his actions. Was it worth sacrificing his integrity for a fleeting chance at redemption?",
      "The investigation would force Hugo to confront not only his financial troubles but also the ethical implications of his choices. As the truth about the murder began to unravel, he would have to decide whether to cling to his cynical worldview or embrace the possibility of change. The tides of deceit could either drag him under or serve as a catalyst for a much-needed reckoning."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Mariner's Rest",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A coastal hotel with Art Deco elegance, frequented by vacationers and military personnel.",
    "visualDescription": "The Mariner's Rest boasts a striking façade of gleaming white stucco and geometric motifs, with large glass windows framing views of the tumultuous sea. Inside, the grand lobby features polished marble floors and ornate chandeliers, while soft, muted colors create a serene atmosphere amidst the stormy backdrop.",
    "atmosphere": "A palpable tension hangs in the air, underscored by the sounds and scents of the sea.",
    "paragraphs": [
      "The Mariner's Rest stands resolute against the crashing waves, its Art Deco lines a stark contrast to the wild, grey waters beyond. Inside, guests bustle through the grand lobby, their laughter and chatter echoing off the high ceilings, a fleeting refuge from the storms both outside and within. The scent of salt and dampness mingles with polished wood and fresh linens, a reminder of the coastal location's ever-present influence.",
      "The dining area, with its sweeping views of the churning sea, offers a momentary escape as patrons gaze out at the horizon. Flickering candlelight dances on the tables, illuminating faces marked by a mixture of joy and unease. Conversations flutter between topics of wartime memories and future dreams, yet an undercurrent of anxiety remains, a shared recognition of the shadows cast by recent history.",
      "As evening descends, the atmosphere shifts subtly; the once-lively lobby grows quieter, shadows lengthening with the dimming light. The sound of rain against the windows becomes a rhythmic companion to whispered secrets and hushed exchanges. Guests retreat to their rooms, cocooned in the hotel’s embrace, yet the air thickens with unspoken tension, a sense that not all is well within these walls."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of coastal climates in the fall.",
    "timeFlow": "Days unfold in a slow, suspenseful rhythm, each moment stretching with uncertainty.",
    "mood": "Tense and anxious, reflecting the uncertainty of post-war life and the lingering effects of WWII.",
    "eraMarkers": [
      "Art Deco architecture",
      "Military personnel on leave",
      "Wartime rationing of fuel",
      "Early radio broadcasts in the lobby",
      "Women in the workforce"
    ],
    "sensoryPalette": {
      "dominant": "Salt air mingled with damp wood",
      "secondary": [
        "Flickering candlelight",
        "Muted conversations",
        "Echoing footsteps on marble"
      ]
    },
    "paragraphs": [
      "The Mariner's Rest is a haven for the weary, yet it bears witness to the turbulent world outside. The sound of waves crashing against the shore creates a constant backdrop, punctuated by the occasional call of seagulls. Guests, drawn by the promise of relaxation, often find themselves caught in the web of their own concerns, the weight of uncertainty lingering in the air like the scent of rain on the sea.",
      "As the hotel comes alive with evening activity, the atmosphere thickens with intrigue. Shadows play tricks on the mind, and the flickering candlelight casts an otherworldly glow, illuminating faces marked by secrets. The conversations, once light and carefree, now carry an edge, each word laced with the tension of unspoken fears and hidden motives."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Oceanfront Suite",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Luxurious suite with ocean views, opulent furnishings, and a large, ornate bed.",
      "sensoryDetails": {
        "sights": [
          "dark waves crashing against rocks",
          "crimson stains on white linen",
          "shattered glass on polished floor",
          "dim light from a flickering lamp",
          "silhouetted figures in the doorway"
        ],
        "sounds": [
          "howling wind through cracks",
          "distant thunder rumbling",
          "soft footsteps on carpet",
          "muffled voices from the hallway",
          "the creaking of old furniture"
        ],
        "smells": [
          "damp fabric and sea salt",
          "faint scent of tobacco",
          "sour notes of spilled wine",
          "cold air from the open window",
          "the musty aroma of old books"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cold metal of a shattered frame",
          "smoothness of the glass shards",
          "the chill of the sea breeze",
          "textured wallpaper with peeling edges"
        ]
      },
      "accessControl": "Access restricted to hotel staff for cleaning; guests may enter but are discouraged after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "fog-shrouded ocean",
            "raindrops on window panes",
            "pools forming on the balcony",
            "wet footprints on the floor",
            "blurred outlines of furniture"
          ],
          "sounds": [
            "steady patter of rain",
            "waves crashing louder",
            "dripping water from eaves",
            "the rustle of wet curtains",
            "the distant sound of an engine"
          ],
          "smells": [
            "fresh rain on pavement",
            "damp wood and salt",
            "moldy upholstery",
            "wet earth from the garden",
            "the tang of ozone in the air"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light filtering through clouds",
            "shadows creeping across the floor",
            "dust motes dancing in the air",
            "faded photographs on the walls",
            "the silhouette of a figure at the window"
          ],
          "sounds": [
            "the ticking of a clock",
            "the faint hum of the radiator",
            "distant voices echoing in the hall",
            "the flutter of curtains in the breeze",
            "the creaking of old wood"
          ],
          "smells": [
            "faint scent of mildew",
            "dusty books and leather",
            "the lingering aroma of coffee",
            "musty air from the closed room",
            "the faint whiff of perfume"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting warm hues",
            "twinkling lights from the town below",
            "shadows stretching long in the room",
            "the reflection of stars on the water",
            "the glow of candlelight flickering"
          ],
          "sounds": [
            "the gentle lapping of the waves",
            "laughter from the dining area",
            "the distant call of a foghorn",
            "soft music from a radio",
            "the rustle of evening attire"
          ],
          "smells": [
            "the sweet scent of blooming jasmine",
            "freshly baked bread from the kitchen",
            "the crispness of the evening air",
            "the lingering aroma of whiskey",
            "the faint smell of salt and sea"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanfront Suite, once a romantic retreat for couples, now stands as a chilling reminder of the events that transpired within its walls. The elegance of its furnishings is marred by the chaos of the crime scene; crimson stains on the white linen sheets tell a story of violence. As the waves crash violently against the rocks below, the room remains eerily still, a stark contrast to the tumult outside.",
        "In the dim light, shadows flicker and dance, creating an unsettling atmosphere that seems to breathe with the memories of those who once inhabited this space. The scent of damp fabric mingles with the acrid smell of spilled wine, a reminder of the evening's ill-fated revelry. Each creak of the floorboards sends shivers down the spine, echoing the uncertainty that now lingers in the air."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Expansive lobby with high ceilings, marble floors, and Art Deco furnishings.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate chandeliers hanging low",
          "brightly colored murals on walls",
          "potted ferns lining the entrance",
          "bustling guests in period attire"
        ],
        "sounds": [
          "clinking glasses at the bar",
          "lively conversations and laughter",
          "the rustle of newspapers",
          "the distant hum of a radio",
          "footsteps echoing on marble"
        ],
        "smells": [
          "freshly brewed coffee",
          "sweet pastries from the café",
          "the faint scent of perfume",
          "polished wood and leather",
          "the tang of sea air"
        ],
        "tactile": [
          "coolness of marble underfoot",
          "smoothness of polished wood",
          "softness of velvet upholstery",
          "the weight of a newspaper",
          "the chill of the ocean breeze"
        ]
      },
      "accessControl": "Open to all guests; staff only areas are behind the reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dull light filtering through clouds",
            "raindrops on the entrance glass",
            "wet umbrellas resting by the door",
            "the reflection of light on wet floors",
            "muffled figures huddled under coats"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "the rustle of wet clothing",
            "clinking of cups on saucers",
            "the low murmur of conversation",
            "the distant rumble of thunder"
          ],
          "smells": [
            "freshly brewed tea",
            "the odor of wet earth",
            "the sweet scent of pastries",
            "the tang of salt in the air",
            "the warmth of baked goods"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "the glow of lamps in dim corners",
            "dust motes illuminated in the light",
            "faded photographs on the walls",
            "the silhouette of a couple at the bar"
          ],
          "sounds": [
            "the distant sound of waves crashing",
            "the ticking of a clock",
            "muffled laughter from the dining area",
            "the rustle of a newspaper being folded",
            "the hum of conversations blending"
          ],
          "smells": [
            "the lingering scent of coffee",
            "the aroma of fresh pastries",
            "the mustiness of old books",
            "the faint whiff of tobacco",
            "the salty breeze from the ocean"
          ],
          "mood": "reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "the glow of the setting sun",
            "glimmers of gold in the decor",
            "the silhouette of guests against the light",
            "tantalizing dishes being served"
          ],
          "sounds": [
            "the clink of silverware on china",
            "laughter rising above the din",
            "the soft music from a radio",
            "the sound of waves gently lapping",
            "the chatter of guests enjoying their evening"
          ],
          "smells": [
            "the rich aroma of coffee",
            "the scent of fresh seafood",
            "the sweetness of dessert pastries",
            "the tang of citrus from cocktails",
            "the warm smell of bread",
            "the salty sea air"
          ],
          "mood": "festive"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Mariner's Rest is a bustling hub of activity, its high ceilings and marble floors echoing with the sounds of laughter and conversation. Guests mingle under the ornate chandeliers, their faces illuminated by the warm glow of candlelight. The scent of freshly brewed coffee and sweet pastries wafts through the air, mingling with the salty tang of the sea, creating an inviting atmosphere.",
        "In the mornings, the lobby takes on a different character, the soft patter of rain against the roof creating a cozy cocoon for those seeking shelter. The dim light filters through the glass doors, casting a muted glow on the marble floors, while the aroma of baked goods fills the space, beckoning guests to gather around the café. Yet, beneath the surface cheer, an undercurrent of melancholy lingers, a reminder of the world outside."
      ]
    },
    {
      "id": "dining_area",
      "name": "The Ocean View Dining Room",
      "type": "interior",
      "purpose": "Dining space",
      "visualDetails": "Elegant dining room with large windows overlooking the sea, adorned with nautical-themed decor.",
      "sensoryDetails": {
        "sights": [
          "large windows framing the ocean",
          "elegant table settings with fine china",
          "colorful nautical decorations",
          "glimmering silverware under candlelight",
          "diners enjoying their meals"
        ],
        "sounds": [
          "clatter of dishes being served",
          "soft music playing in the background",
          "laughter and conversation",
          "the distant sound of waves",
          "the occasional pop of corks"
        ],
        "smells": [
          "the aroma of grilled fish",
          "freshly baked bread",
          "the scent of rich sauces",
          "the tang of lemon and herbs",
          "the sweetness of dessert"
        ],
        "tactile": [
          "smoothness of fine china",
          "warmth of freshly baked rolls",
          "the weight of silver utensils",
          "the coolness of glassware",
          "the softness of table linens"
        ]
      },
      "accessControl": "Open to all guests during dining hours; staff access restricted to kitchen and service areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down window panes",
            "dim light filtering through clouds",
            "wet tablecloths from morning dew",
            "the reflection of clouds in the glass",
            "huddled guests sipping coffee"
          ],
          "sounds": [
            "the patter of rain against glass",
            "soft conversations over breakfast",
            "the clink of cutlery on plates",
            "the rustle of newspapers being read",
            "the faint sound of a radio in the corner"
          ],
          "smells": [
            "the rich scent of brewed coffee",
            "the aroma of freshly baked pastries",
            "the tang of citrus in fruit bowls",
            "the scent of damp wood",
            "the sweetness of honey"
          ],
          "mood": "cozy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "clouds obscuring the sun",
            "shadows dancing on the walls",
            "guests peering out at the sea",
            "the flicker of candlelight",
            "the shimmer of silverware under dim light"
          ],
          "sounds": [
            "the soft murmur of conversation",
            "the clattering of dishes being cleared",
            "the sound of waves crashing",
            "the occasional laughter from patrons",
            "the gentle hum of the kitchen"
          ],
          "smells": [
            "the aroma of simmering sauces",
            "the scent of grilled seafood",
            "the sweetness of dessert pastries",
            "the earthy smell of fresh herbs",
            "the tang of salt in the air"
          ],
          "mood": "introspective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "dinner guests enjoying their meals",
            "candle flames flickering gently",
            "the ocean reflecting the twilight",
            "the glow of lamps creating ambiance"
          ],
          "sounds": [
            "the clink of glasses in toasts",
            "the laughter of friends gathered",
            "soft music playing in the background",
            "the distant roar of waves",
            "the sound of servers bustling"
          ],
          "smells": [
            "the rich aroma of roasted meats",
            "the fragrance of fresh herbs",
            "the scent of warm bread",
            "the sweetness of chocolate desserts",
            "the salty tang of the ocean air"
          ],
          "mood": "celebratory"
        }
      ],
      "paragraphs": [
        "The Ocean View Dining Room offers a feast not only for the palate but for the eyes as well, with large windows framing breathtaking views of the ocean. The elegant table settings, adorned with fine china and glimmering silverware, create an atmosphere of sophistication as guests enjoy their meals. The sounds of laughter and conversation blend harmoniously with the distant roar of waves, making each dining experience a memorable one.",
        "In the mornings, the dining room transforms into a cozy retreat, the rich scent of brewed coffee mingling with the aroma of freshly baked pastries. Guests huddle over their plates, the patter of rain against the windows creating a soothing backdrop. As the day progresses, the atmosphere shifts; dim lighting and flickering candles invite introspection, while the evening brings a celebratory air as diners toast to life and the promise of better days ahead."
      ]
    },
    {
      "id": "staff_quarters",
      "name": "Staff Quarters",
      "type": "interior",
      "purpose": "Restricted access area",
      "visualDetails": "Functional and modest living space for hotel staff, with basic furnishings and shared facilities.",
      "sensoryDetails": {
        "sights": [
          "plain wooden furniture",
          "faded photographs on the walls",
          "cluttered communal areas",
          "dim lighting from a single bulb",
          "the occasional glimpse of staff uniforms"
        ],
        "sounds": [
          "distant chatter from the lobby",
          "the rustle of laundry being folded",
          "the creaking of old floorboards",
          "the hum of a refrigerator",
          "the sound of running water"
        ],
        "smells": [
          "the scent of soap and cleaning supplies",
          "the aroma of shared meals",
          "the mustiness of old linens",
          "the faint smell of oil from machinery",
          "the tang of sweat after a long shift"
        ],
        "tactile": [
          "the roughness of worn fabrics",
          "the coolness of metal fixtures",
          "the softness of freshly laundered sheets",
          "the smoothness of a well-used table",
          "the chill of the evening air"
        ]
      },
      "accessControl": "Access limited to hotel staff; guests prohibited from entering.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water pooling on the floor",
            "dull light from the window",
            "staff huddled together",
            "the glow of a shared light bulb",
            "clothes hanging to dry"
          ],
          "sounds": [
            "the patter of rain on the roof",
            "the murmur of quiet conversations",
            "the rustle of wet clothing",
            "the clattering of dishes in the kitchen",
            "the distant sound of the lobby"
          ],
          "smells": [
            "the scent of wet fabric",
            "the aroma of breakfast cooking",
            "the musty smell of dampness",
            "the tang of cleaning supplies",
            "the sweetness of fresh fruit"
          ],
          "mood": "tense and hurried"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows lengthening in dim light",
            "faded uniforms hanging on hooks",
            "the flicker of a single bulb",
            "the clutter of personal items",
            "the glimpse of tired faces"
          ],
          "sounds": [
            "the ticking of a clock",
            "the sound of laundry being done",
            "the distant chatter from the lobby",
            "the creaking of old furniture",
            "the rustle of papers being sorted"
          ],
          "smells": [
            "the lingering scent of soap",
            "the aroma of cooking food",
            "the mustiness of the air",
            "the faint smell of oil",
            "the tang of sweat"
          ],
          "mood": "exhausted"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the glow of lights in the corridor",
            "staff gathering for a meal",
            "the sparkle of clean dishes",
            "the cozy arrangement of furniture",
            "the warmth of a shared space"
          ],
          "sounds": [
            "laughter echoing softly",
            "the clinking of utensils",
            "the distant sound of music from the lobby",
            "the hum of conversations",
            "the sound of water running"
          ],
          "smells": [
            "the aroma of shared meals",
            "the scent of clean linens",
            "the sweetness of baked goods",
            "the faint smell of perfume",
            "the tang of fresh vegetables"
          ],
          "mood": "community and camaraderie"
        }
      ],
      "paragraphs": [
        "The Staff Quarters, though modest, serve as a vital hub for the hotel workers, a place where camaraderie is forged amidst the demands of service. The functional space is cluttered with personal items and the hum of quiet conversations fills the air. Faded photographs on the walls tell stories of lives intertwined with the hotel, while the scent of shared meals wafts through the corridors, a reminder of the lives lived behind the scenes.",
        "In the mornings, the atmosphere is tense and hurried as staff prepare for the day ahead, rain pattering against the roof creating a sense of urgency. As afternoon settles in, the air becomes heavy with exhaustion, the dim light casting shadows on tired faces. Yet, as evening arrives, the quarters transform into a sanctuary of community, laughter echoing softly as staff gather for shared meals, their bonds strengthening over the warmth of camaraderie."
      ]
    }
  ],
  "note": "",
  "cost": 0.0030327231000000002,
  "durationMs": 36500
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
      "overcast skies",
      "occasional rain showers",
      "cool coastal breezes"
    ],
    "daylight": "Days are shorter, with twilight descending by around 6:30 PM, leaving a lingering chill in the air.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the hotel is quiet and the atmosphere tense.",
    "holidays": [
      "Halloween",
      "Columbus Day"
    ],
    "seasonalActivities": [
      "attending Halloween parties",
      "enjoying autumn harvest festivals",
      "visiting local pumpkin patches"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "white dress shirt",
        "silk tie"
      ],
      "casual": [
        "tweed jacket",
        "slacks",
        "button-down shirt"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with fitted waist",
        "satin gloves",
        "beret hat"
      ],
      "casual": [
        "sweater and skirt ensemble",
        "tailored trousers",
        "blouse"
      ],
      "accessories": [
        "string of pearls",
        "silk scarf",
        "medium-sized handbag"
      ]
    },
    "trendsOfTheMoment": [
      "war-inspired utilitarian fashion",
      "increased popularity of bold colors",
      "elegant evening wear for events"
    ],
    "socialExpectations": [
      "men are expected to be the primary breadwinners",
      "women are increasingly taking on roles in the workforce",
      "social gatherings are often formal and reserved"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Allied forces advancing in Europe",
      "discussions on post-war reconstruction in the UK",
      "increased tensions in the Pacific theater"
    ],
    "politicalClimate": "The political atmosphere is tense as the Allies push towards victory in Europe, but uncertainty looms regarding the post-war order.",
    "economicConditions": "Rationing continues, with goods becoming increasingly scarce. Prices for basic commodities remain high.",
    "socialIssues": [
      "returning veterans struggling to reintegrate",
      "women's rights gaining visibility",
      "racial tensions rising in urban areas"
    ],
    "internationalNews": [
      "UN formation discussions gathering momentum",
      "post-war planning debates gaining traction",
      "tensions between the US and the Soviet Union beginning to surface"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - 'I'll Be Home for Christmas'",
        "Ella Fitzgerald - 'It's Only a Paper Moon'",
        "The Ink Spots - 'I Don't Want to Set the World on Fire'"
      ],
      "films": [
        "'To Have and Have Not'",
        "'Double Indemnity'",
        "'The Fighting Lady'"
      ],
      "theater": [
        "'Oklahoma!'",
        "'The Glass Menagerie'",
        "'South Pacific'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Shadow'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Stranger' by Albert Camus",
        "'The Little Prince' by Antoine de Saint-Exupéry",
        "'The Diary of a Young Girl' by Anne Frank"
      ],
      "popularGenres": [
        "mystery",
        "war novels",
        "romantic fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the V-2 rocket",
        "improved military radar systems",
        "early portable radios"
      ],
      "commonDevices": [
        "radio sets",
        "hand-crank telephones",
        "early television sets in urban homes"
      ],
      "emergingTrends": [
        "the rise of consumer electronics",
        "the initial phases of jet propulsion technology",
        "advancements in medical treatments due to wartime research"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: four pence",
        "pint of milk: three pence",
        "movie ticket: one shilling"
      ],
      "commonActivities": [
        "gathering for wartime bond drives",
        "participating in local theater productions",
        "attending community dances"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "evening radio listening sessions",
        "organizing neighborhood gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing mobility for some classes due to war efforts",
      "class divisions still prominent despite economic strain"
    ],
    "gender": [
      "women entering the workforce seen as necessary but still controversial",
      "traditional gender roles challenged by necessity"
    ],
    "race": [
      "growing awareness of racial inequalities",
      "tensions surrounding civil rights beginning to surface in urban centers"
    ],
    "generalNorms": [
      "a sense of stoicism and resilience in the face of adversity",
      "community spirit heightened due to shared wartime experiences",
      "increased suspicion toward foreign influences post-war"
    ]
  },
  "atmosphericDetails": [
    "The damp chill of the coastal air lingers as rain patters gently against the hotel windows, a fitting backdrop for secrets waiting to unfold.",
    "The faint smell of burning leaves wafts through the streets, a reminder that autumn is in full swing, yet the tension inside the hotel is palpable.",
    "As shadows grow long in the dimly lit corridors, whispers of uncertainty echo through the hall, reflecting the unease of a world still healing from war."
  ],
  "paragraphs": [
    "On an overcast October evening in 1944, the coastal hotel stands as a bastion of light against the encroaching darkness. Rain drizzles intermittently, the sound a soft murmur against the windows, while the chill of the air seeps through the walls, wrapping the guests in a blanket of unease. The foliage outside is a tapestry of russet and gold, and the scent of damp earth rises as the leaves begin to gather, a reminder of the seasonal change that mirrors the uncertainties of post-war life. Halloween decorations begin to adorn the hotel, but the typical cheer is overshadowed by the shadows of war and the whispers of secrets yet to be uncovered.",
    "Fashion in October 1944 reflects the times, with men donning double-breasted navy suits paired with silk ties, while women elegantly wear tea-length dresses adorned with fitted waists and satin gloves. The utilitarian approach to clothing, born from necessity, has given way to a resurgence of bold colors and refined styles for evening engagements, as society seeks to reclaim joy amidst the chaos. Women, once relegated to domestic roles, now find themselves in tailored trousers and blouses, stepping into the workforce with poise and determination, challenging long-held social norms.",
    "Daily life in this coastal town is marked by the rhythm of wartime sacrifice and community resilience. Families gather for Sunday dinners, sharing stories of those away at war, while neighborhood gatherings foster a sense of solidarity. Prices reflect the rationing still in place, with a loaf of bread costing four pence and entertainment becoming a cherished respite, as the sounds of Bing Crosby and Ella Fitzgerald fill the airwaves. Yet, amidst the laughter, there lies an undercurrent of anxiety, as the shadows of returning soldiers and evolving social dynamics hint at a future fraught with challenges."
  ],
  "note": "",
  "cost": 0.00106769685,
  "durationMs": 22809
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A coastal hotel becomes a pressure cooker for vacationers and military personnel, as the rising tide of post-war anxiety and shifting loyalties leads to a deadly confrontation among its guests.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is shifting with women stepping into roles traditionally held by men, while the specter of the Cold War looms, creating a backdrop of tension and uncertainty that pressures social interactions."
  },
  "setting": {
    "location": "A coastal hotel featuring Art Deco architecture, overlooking the sea.",
    "institution": "hotel",
    "weather": "Overcast with occasional rain, typical of coastal climates in the fall."
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
    "value": "ten minutes past eleven",
    "description": "The exact time the tide peaked in relation to the murder"
  },
  {
    "id": "footprint_distance",
    "value": "twenty feet",
    "description": "The distance from the shore where the victim's footprints were found"
  },
  {
    "id": "murderer_watch_time",
    "value": "five minutes past eleven",
    "description": "The incorrect time set on the murderer's watch"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 21,
  "countsByPlacement": {
    "early": 8,
    "mid": 12,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 20,
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
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "behavioral"
    },
    {
      "id": "clue_8",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_10",
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
      "placement": "mid",
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
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
