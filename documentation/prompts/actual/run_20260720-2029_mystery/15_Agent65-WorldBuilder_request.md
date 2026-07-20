# Actual Prompt Record

- Run ID: `mystery-1784579381610`
- Project ID: ``
- Timestamp: `2026-07-20T20:33:27.777Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `05a714ef73a98fc8`

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
    "title": "The Clock's Deception",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Cannes",
      "place": "grand seaside hotel",
      "country": "France",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical deception"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A renowned investigator known for her sharp wit.",
      "private_secret": "Has a past connection with the victim.",
      "motive_seed": "A personal vendetta linked to the victim's past actions.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel staff access",
        "Guest interactions"
      ],
      "behavioral_tells": [
        "Calm demeanor",
        "Sharp observations"
      ],
      "stakes": "Uncovering the truth for personal closure.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "50-60",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A respected physician with a secretive side.",
      "private_secret": "Involved in unethical medical experiments.",
      "motive_seed": "Past grievances from former patients.",
      "motive_strength": "moderate",
      "alibi_window": "n/a",
      "access_plausibility": "n/a",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation and career.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A charming naval officer with a mysterious past.",
      "private_secret": "Has a hidden grudge against Dr. Finch.",
      "motive_seed": "Vengeance for a past medical mishap.",
      "motive_strength": "strong",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel access as a guest"
      ],
      "behavioral_tells": [
        "Nervous when discussing the victim"
      ],
      "stakes": "Avoiding exposure of his past.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A socialite and close friend of the victim.",
      "private_secret": "Knows about the victim's unethical practices.",
      "motive_seed": "Fear of her secrets being revealed.",
      "motive_strength": "moderate",
      "alibi_window": "8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Visited the victim's room"
      ],
      "behavioral_tells": [
        "Anxious around questioning"
      ],
      "stakes": "Protecting her social standing.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A young aspiring journalist.",
      "private_secret": "Has been investigating Dr. Finch's practices.",
      "motive_seed": "Desire for a big story.",
      "motive_strength": "weak",
      "alibi_window": "9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel access as a guest"
      ],
      "behavioral_tells": [
        "Eager to gather information"
      ],
      "stakes": "Career advancement.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A wealthy businessman.",
      "private_secret": "Involved in shady dealings with Dr. Finch.",
      "motive_seed": "Financial loss due to Finch's experiments.",
      "motive_strength": "strong",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Business meetings with the victim"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Financial reputation.",
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
      "summary": "In a grand seaside hotel, Dr. Mallory Finch is found strangled, and the apparent time of death is manipulated through clock tampering, leading to a complex investigation filled with deception."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock in Dr. Finch's room was rewound to misrepresent the time of death.",
      "delivery_path": [
        {
          "step": "The clock was tampered with before the murder to provide the murderer with an alibi."
        }
      ]
    },
    "outcome": {
      "result": "The murder appears to have happened later than it did, confusing witnesses and investigators."
    }
  },
  "false_assumption": {
    "statement": "Dr. Finch died at a time when Captain Hale was seen in the dining room.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses confirm Hale's presence at that time, making it seem impossible for him to be the murderer.",
    "what_it_hides": "The clock was intentionally set back to create a false alibi."
  },
  "false_solution": {
    "accused_suspect": "Beatrice Quill",
    "supporting_points": [
      "She had access to Dr. Finch's room and was seen leaving shortly before the body was discovered.",
      "Witnesses overheard her arguing with Finch about his practices."
    ],
    "the_one_flaw": "Her alibi is confirmed by the hotel staff who saw her in the lounge at the critical time.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Captain Hale's nervous behavior during questioning.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "Hale is anxious due to his past with Dr. Finch and the investigation.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Sylvia Trent's journal found in Dr. Finch's room.",
      "points_at_suspect": "Sylvia Trent",
      "innocent_explanation": "The journal contains her research notes and was left accidentally.",
      "resolved_in_chapter": 5
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
    "rationale": "All suspects were present at the hotel during the time of the murder, and no outsiders could have accessed the victim's room."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "8:00 PM",
        "9:00 PM"
      ],
      "windows": [
        "8:00 PM to 9:00 PM"
      ],
      "contradictions": [
        "Witnesses claim Hale was in the dining room at 8:30 PM while the clock shows time of death at 9:15 PM."
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
        "Dr. Finch's clock",
        "Victim's room"
      ],
      "permissions": [
        "Guest access to rooms"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical laws of clockwork manipulation"
      ],
      "traces": [
        "Faint scratches on the clock casing"
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff",
        "Guest interactions"
      ],
      "authority_sources": [
        "Hotel management"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in Dr. Finch's room shows the time as quarter past nine.",
        "correction": "This suggests that the murder took place later than it actually did.",
        "effect": "Narrows the timeline of the murder.",
        "required_evidence": [
          "Clock hands show quarter past nine",
          "Witnesses recall Finch's last meal at eight o'clock"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses confirm Captain Hale was in the dining room at eight-thirty.",
        "correction": "Hale could not have been in the room when Finch was murdered.",
        "effect": "Eliminates Captain Hale as a suspect.",
        "required_evidence": [
          "Witness statements about Hale's location",
          "Time of Finch's last meal"
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint scratch is found on the clock casing indicating tampering.",
        "correction": "This suggests the clock was manipulated to misrepresent the time.",
        "effect": "Narrows the scope of suspects who could have tampered with the clock.",
        "required_evidence": [
          "Scratch marks on the clock casing",
          "Hale's witness testimony about the clock"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, quarter, and suggest against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, witness, and quarter.",
    "pass_condition": "If Hale's alibi cannot be confirmed by the clock's time and witness statements, he is implicated.",
    "evidence_clues": [
      "clue_2",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock hands and last meal timing establish a timeline contradiction. Step 2: Hale's dining room alibi eliminates him as a suspect. Step 3: The scratch on the clock confirms tampering, leading to the conclusion of Hale's guilt."
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
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by hotel staff",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by hotel staff",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by hotel staff",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
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
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Physical evidence examination"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
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
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a respected local historian turned amateur sleuth, driven by a desire to unearth the hidden truths of the past while grappling with the shadows of her own failures.",
    "publicPersona": "A local historian, Eleanor is known for her extensive knowledge of the hotel’s history and its illustrious guests, often leading tours with a passion that captivates her audience.",
    "privateSecret": "Beneath her polished exterior lies a deep-seated resentment stemming from her inability to expose a scandal involving her own family, a failure that haunts her to this day.",
    "motiveSeed": "Eleanor believes that the truth about the hotel's past is intricately linked to the recent murder, and she is determined to uncover it to redeem herself.",
    "motiveStrength": "moderate",
    "alibiWindow": "At the time of the murder, Eleanor was engaged in a historical tour event within the hotel, surrounded by guests who could vouch for her presence.",
    "accessPlausibility": "easy",
    "stakes": "For Eleanor, this investigation represents not just a chance for redemption but also the potential to write a bestselling book about her findings, a project that could finally silence her inner critic.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her thoughts with historical anecdotes. She has a tendency to raise an eyebrow when skeptical, and her humor is laced with irony.",
    "signatureTic": "Ah, history has a way of repeating itself, doesn’t it?",
    "internalConflict": "Eleanor wrestles with the guilt of her past inaction, fearing that her attempts to uncover the truth may not only expose her family’s failings but also her own inadequacies.",
    "personalStakeInCase": "This crime matters to Eleanor not only as a historian but also as a chance to confront her past failures and reclaim her sense of purpose.",
    "paragraphs": [
      "Eleanor Voss stood at the front of the hotel lobby, her fingers brushing against the worn leather of an old ledger. To the casual observer, she was simply a historian sharing tales of glamour and intrigue. Yet, beneath her composed exterior, a storm brewed—a tempest of unresolved resentment and the pressing need for redemption. She had always been drawn to the truth, but the truth had a way of eluding her, especially when it came to her family's dark history.",
      "As she led a group of tourists through the hotel, her voice rang with authority, narrating stories of the glamorous guests who had graced its halls. But as she spoke, her mind drifted to the recent murder that had shaken the very foundation of her beloved establishment. Eleanor couldn't shake the feeling that the victim's death was a puzzle piece in a larger mosaic, one that could finally reveal the secrets she had long buried.",
      "Eleanor's private secret weighed heavily on her conscience. The scandal involving her family had been a black mark on her reputation, one she had tried desperately to erase. Now, as she delved into the mystery surrounding the murder, she felt the familiar pang of guilt. Would uncovering the truth bring her peace, or would it only serve to expose her own shortcomings?",
      "Her determination to solve the case intensified as she pieced together the clues. Each revelation brought her closer to a truth she had long sought, but it also threatened to unravel the carefully constructed narrative of her life. With every step, Eleanor found herself confronting not only the ghosts of the hotel's past but also the specters of her own failures, pushing her to redefine her purpose in a world that had once seemed so clear."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated physician entangled in a web of ethical dilemmas, her compassion overshadowed by desperation to maintain her career.",
    "publicPersona": "Known for her unwavering dedication to her patients, Dr. Finch is the heart of the local clinic, her gentle demeanor and skillful hands earning her the community's trust.",
    "privateSecret": "Behind her compassionate facade, Mallory has been conducting illegal drug trials, driven by the hope of securing much-needed funding for her clinic.",
    "motiveSeed": "The victim threatened to expose Mallory's unethical practices, putting her career and reputation at risk, a threat she could not afford to ignore.",
    "motiveStrength": "strong",
    "alibiWindow": "Dr. Finch claims she was at the clinic treating patients during the time of the murder, an alibi that seems plausible but remains unverified.",
    "accessPlausibility": "possible",
    "stakes": "With her medical license and reputation hanging by a thread, Mallory's desperation to protect herself leads her down a dark path.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory speaks softly, her words often laced with a sense of urgency. She tends to avoid eye contact when discussing her practices, her voice barely above a whisper when pressed.",
    "signatureTic": "I just want to help, really.",
    "internalConflict": "Mallory's moral compass is in turmoil as she grapples with the consequences of her actions, torn between her desire to help others and the lengths she has gone to secure funding.",
    "personalStakeInCase": "This crime matters deeply for Mallory as her entire career and identity as a physician are at stake, pushing her to confront the consequences of her choices.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her clinic, the sterile smell of antiseptic mingling with the faint scent of flowers from a nearby patient’s bouquet. She had spent years building a reputation as a compassionate physician, yet beneath this facade lay a troubling secret. The illegal drug trials she had conducted, driven by desperation for funding, had become a ticking time bomb, and the recent murder threatened to expose her.",
      "As she treated her patients, each smile and thank you only deepened her internal conflict. The very compassion that had drawn her to medicine now felt like a chain, binding her to decisions she regretted. The victim had discovered her secret, and the threat of exposure loomed like a dark cloud over her career, pressing her to act in ways she never thought possible.",
      "Mallory's alibi, though seemingly solid, was a fragile shield against the scrutiny that followed the murder. She had been at the clinic, treating patients, but the whispers of suspicion were growing louder. Each time she recalled the victim’s threats, her heart raced with fear. What if someone discovered the truth? What if her world crumbled around her, leaving her with nothing?",
      "As the investigation unfolded, Mallory found herself at a crossroads, forced to confront her choices and the moral implications of her actions. The stakes had never been higher, and the weight of her desperation bore down on her, threatening to unravel everything she had worked for. Would she find a way to redeem herself, or would her secrets consume her?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a charismatic retired naval officer whose bravado masks the deep scars of war and a gambling addiction that threatens to destroy him.",
    "publicPersona": "Known for his bravery and leadership during the war, Ivor is a charismatic figure who commands respect and admiration at social gatherings.",
    "privateSecret": "Behind his confident demeanor lies a man struggling with PTSD and a crippling gambling addiction that has left him deeply in debt.",
    "motiveSeed": "The victim had discovered Ivor's financial troubles and threatened to cut him off from the family fortune, a threat that struck at his very identity.",
    "motiveStrength": "strong",
    "alibiWindow": "Ivor was seen at the hotel bar, but his exact whereabouts during the murder remain unconfirmed, raising suspicions.",
    "accessPlausibility": "easy",
    "stakes": "Ivor's social standing and home are at risk, and the thought of losing everything he has fought to protect drives him to desperate measures.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a commanding presence, often punctuating his sentences with a self-deprecating humor. He tends to lean in when sharing stories, his voice rich with emotion yet tinged with vulnerability.",
    "signatureTic": "You should see the other guy—oh wait, that’s me.",
    "internalConflict": "Ivor faces the demons of his past, battling the effects of PTSD while grappling with the shame of his addiction, torn between the desire for redemption and the fear of exposure.",
    "personalStakeInCase": "For Ivor, this crime is not just a matter of reputation; it’s a fight for his home and the life he has built, pushing him to confront his vulnerabilities.",
    "paragraphs": [
      "Captain Ivor Hale stood at the bar, a glass of whiskey in hand, his charming smile masking the turmoil that raged within. The war had left him with scars that ran deeper than the eye could see, and now, as a retired officer, he found himself grappling with shadows of the past. The victim's recent threat to expose his financial troubles had sent a chill down his spine, igniting a fear that he could no longer ignore.",
      "Though he commanded respect, Ivor was acutely aware of the precariousness of his situation. The gambling addiction that had crept into his life like a thief in the night had left him in significant debt, and the thought of losing his home—the last remnant of his former glory—filled him with dread. He had fought valiantly in battles, but this new war felt far more insidious, one fought in the silence of his own mind.",
      "As whispers of suspicion began to swirl around him, Ivor's charm turned brittle, his laughter tinged with an edge of desperation. He was seen at the bar, but the truth of his whereabouts during the murder was shrouded in uncertainty. The very people who admired him now cast wary glances, and the walls of his carefully constructed facade threatened to crumble.",
      "Ivor knew he had to confront his demons, but the path to redemption was fraught with challenges. Each day was a struggle against the memories of war and the weight of his addiction. As he grappled with his past, he realized that the stakes were higher than he had ever anticipated—this was not just about his reputation, but a fight for his very existence."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a vibrant aspiring artist whose dreams of success are overshadowed by insecurities and a fear of losing her artistic identity.",
    "publicPersona": "A young artist with a passion for capturing the beauty of seaside life, Beatrice is known for her vibrant paintings that reflect her ambition and creativity.",
    "privateSecret": "Underneath her artistic bravado, Beatrice is terrified that her latest artwork, inspired by the victim, reveals too much about her personal insecurities and family history.",
    "motiveSeed": "She believed the victim was planning to steal her artistic ideas, a fear that ignited her jealousy and suspicion.",
    "motiveStrength": "weak",
    "alibiWindow": "At the time of the murder, Beatrice was attending an art exhibition in the hotel lobby, surrounded by potential witnesses.",
    "accessPlausibility": "possible",
    "stakes": "Beatrice is desperate for recognition and success, fearing that the loss of her artistic identity would mean the loss of herself.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a nervous energy, often punctuating her sentences with self-deprecating humor. She has a tendency to fidget and avoid direct eye contact when discussing her work.",
    "signatureTic": "Well, who doesn’t love a little drama in their life?",
    "internalConflict": "Beatrice grapples with her identity as an artist, torn between her desire for recognition and the fear that she is not good enough, leading her to question her worth.",
    "personalStakeInCase": "This crime matters deeply to Beatrice as it threatens her burgeoning career and the chance to prove herself in a competitive art world.",
    "paragraphs": [
      "Beatrice Quill stood in the hotel lobby, her heart racing as she mingled with the crowd at the art exhibition. Vibrant colors danced on the canvas before her, yet all she could see were the shadows of self-doubt creeping in. An aspiring artist, she had poured her soul into her work, but the recent murder had cast a pall over her dreams, igniting a fear that her artistic identity was on the line.",
      "The victim had threatened to steal her artistic ideas, a thought that gnawed at her insides. Beatrice had always been acutely aware of the competitive nature of the art world, and the fear of being overshadowed by a more established figure was paralyzing. In moments of vulnerability, she found herself questioning her worth, her talent, and whether she would ever make a name for herself.",
      "As she spoke to attendees, her sardonic humor emerged, a defense mechanism against the insecurities that threatened to consume her. \"Well, who doesn’t love a little drama in their life?\" she quipped, but the laughter that followed felt hollow. Each compliment felt like a double-edged sword, reminding her of the thin line between success and obscurity.",
      "In the wake of the murder, Beatrice felt the weight of her aspirations pressing down on her. This crime was not merely a tragedy; it was a threat to her identity as an artist. As she navigated the murky waters of suspicion and jealousy, she realized that the stakes were higher than she had imagined. This was her chance to prove herself, or risk fading into the background of a world that moved on without her."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a charming socialite whose envy of the victim’s wealth and status drives her to manipulate those around her in the pursuit of social power.",
    "publicPersona": "Admired for her grace and style, Sylvia is a prominent figure in high society, known for her ability to navigate social events with charm and poise.",
    "privateSecret": "Beneath her polished exterior lies a simmering envy of the victim’s connections and wealth, which she has been secretly plotting to improve her own status.",
    "motiveSeed": "The victim planned to cut Sylvia out of an important family event, a potential blow to her standing in society that she could not tolerate.",
    "motiveStrength": "moderate",
    "alibiWindow": "Sylvia claims to have been at a charity luncheon, but the lack of confirmation raises suspicions about her whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "Sylvia's social status is at risk, and the thought of losing her place among the elite drives her to consider drastic actions.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a smooth, polished tone, often lacing her conversations with subtle jabs and veiled insults. She has a knack for turning compliments into barbs, showcasing her sharp wit.",
    "signatureTic": "Isn’t it just delightful how the world works?",
    "internalConflict": "Sylvia grapples with her own insecurities, driven by a fear of being cast aside in the social hierarchy, forcing her to confront the lengths she will go to maintain her status.",
    "personalStakeInCase": "This crime matters to Sylvia as it threatens her carefully curated social standing and the façade of perfection she has built around herself.",
    "paragraphs": [
      "Sylvia Trent glided through the hotel ballroom, her laughter ringing like chimes in the air, a charming facade that masked the envy simmering beneath. A prominent socialite, she had cultivated a reputation for grace and style, but the recent murder had sent ripples through her carefully curated world. The victim's impending decision to cut Sylvia out of a significant family event felt like a dagger aimed straight at her heart.",
      "As she mingled with guests, her polished tone dripped with charm, yet each conversation felt tinged with a hint of desperation. \"Isn’t it just delightful how the world works?\" she would say, her words veiling the bitterness that lurked just beneath the surface. Sylvia had always been adept at manipulating those around her, turning compliments into subtle jabs, yet now she felt the ground shifting beneath her.",
      "The lack of confirmation regarding her alibi only added to her unease. She had claimed to be at a charity luncheon, but whispers of suspicion began to swirl, threatening to unravel her carefully constructed image. The thought of losing her status among the elite was unbearable, and the lengths she had gone to maintain that position now weighed heavily on her conscience.",
      "As the investigation progressed, Sylvia's internal conflict deepened. The envy she felt toward the victim was a bitter pill to swallow, pushing her to confront the darker aspects of her ambition. This crime was not just about the murder; it was about her very identity, and as the stakes grew higher, so did her desperation to protect the illusion she had so painstakingly crafted."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a wealthy businessman entangled in shady dealings, his empire built on questionable integrity that threatens to unravel with the victim's murder.",
    "publicPersona": "A respected businessman known for his sharp investments and community ties, Hugo presents himself as a pillar of the local economy.",
    "privateSecret": "Behind his successful facade lies a web of corrupt practices, and the victim's threat to expose him looms large over his empire.",
    "motiveSeed": "The victim had threatened to reveal Hugo's unethical business dealings to the press, an exposure that could lead to his downfall.",
    "motiveStrength": "compelling",
    "alibiWindow": "Hugo claims to have been in a meeting across town at the time of the murder, but his alibi remains unconfirmed, casting doubt on his innocence.",
    "accessPlausibility": "unlikely",
    "stakes": "Hugo's empire is built on a foundation of deceit, and the exposure of his corrupt practices could lead to the collapse of everything he has worked for.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks with a directness that brooks no nonsense, often using sharp, clipped sentences. He is unflinching when discussing business, but his humor is dry and often tinged with cynicism.",
    "signatureTic": "Let’s not kid ourselves, it’s all about the bottom line.",
    "internalConflict": "Hugo grapples with the moral complexities of his business practices, torn between the pursuit of success and the fear of losing everything he has built.",
    "personalStakeInCase": "This crime is of utmost importance to Hugo, as it threatens to expose his corrupt empire, pushing him to confront the consequences of his actions.",
    "paragraphs": [
      "Hugo Vane stood at the edge of the hotel terrace, the Mediterranean breeze tousling his hair as he surveyed the landscape of his empire. To the outside world, he was a successful businessman, a man of integrity. But behind closed doors, Hugo was entangled in a web of deceit, and the recent murder had pulled back the curtain on his carefully constructed facade. The victim's threat to expose his corrupt practices loomed like a storm cloud over him.",
      "His alibi, a meeting across town, felt flimsy at best. As whispers of suspicion began to circulate, Hugo's resolve hardened. \"Let’s not kid ourselves, it’s all about the bottom line,\" he would say, but the truth was that the bottom line was now at risk. The stakes had never been higher, and the thought of losing everything he had built sent a chill through his spine.",
      "Hugo's speech was often blunt, cutting through the pretense that surrounded him. He had learned early on that in business, vulnerability was a weakness, and he had perfected the art of detachment. Yet, as the investigation unfolded, he found himself grappling with the moral implications of his actions. The very empire he had built was now threatened by the very practices that had allowed him to rise to the top.",
      "As he navigated the treacherous waters of suspicion, Hugo realized that the time for complacency was over. The exposure of his corrupt dealings could lead to his downfall, and the fear of losing his empire pushed him to consider desperate measures. In the world he inhabited, loyalty was a rare commodity, and betrayal could come from the most unexpected places. As the investigation deepened, Hugo found himself caught in a battle for not just his reputation, but his very survival."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Hotel Le Rivage",
    "type": "hotel",
    "place": "Cannes",
    "country": "France",
    "summary": "A grand seaside hotel with Art Deco elegance, now weathered from years of wartime neglect.",
    "visualDescription": "The imposing facade of Hotel Le Rivage, adorned with scalloped motifs and geometric patterns, overlooks the tumultuous azure sea. Once-vibrant murals now fade beneath layers of salt and time, while the polished marble floors echo with the shallow whispers of guests. The grand lobby, with its sweeping staircase and crystal chandelier, hints at past opulence, yet the corners are darkened, shadows pooling like secrets.",
    "atmosphere": "A blend of elegance and decay, where beauty battles with the weight of history.",
    "paragraphs": [
      "As guests enter Hotel Le Rivage, they are greeted by the lingering scent of salt and dampness, a reminder of its coastal location. The grand lobby, with its sweeping staircase and crystal chandelier, offers a glimpse into a once-glorious past. Yet, the atmosphere is thick with tension, as whispers and furtive glances exchange among the guests. The Art Deco motifs, although stunning, show signs of wear and tear, much like the weary souls who occupy its halls.",
      "The sound of waves crashing against the cliffs fills the air, mingling with the muted chatter of guests in the lounge. An old radio crackles softly in the corner, broadcasting distant news from a world still healing from the scars of war. As the rain begins to patter against the windows, the dim lighting casts long shadows, creating an ambiance ripe for secrets and suspicions. The hotel, isolated from the nearest town, stands as a fortress of intrigue, holding its guests captive in more ways than one.",
      "In the evenings, the lobby transforms into a hub of activity, with guests congregating over cocktails, their laughter somewhat forced. The faint scent of tobacco smoke lingers in the air, mixing with the aroma of damp wood. Outside, the storm clouds gather, promising a tempest that echoes the brewing tensions within. Each corner of the hotel seems to harbor a story, a clue waiting to be uncovered, as the clock ticks inexorably towards an unforeseen climax."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain showers typical of coastal climates",
    "timeFlow": "Days of mounting tension leading to a fateful night",
    "mood": "tense, with an undercurrent of suspicion among guests",
    "eraMarkers": [
      "Art Deco architecture",
      "old radio broadcasting news",
      "rationed petrol and limited transport",
      "post-war societal shifts"
    ],
    "sensoryPalette": {
      "dominant": "the scent of damp wood and salt air",
      "secondary": [
        "the muted sound of crashing waves",
        "the faint crackle of an old radio"
      ]
    },
    "paragraphs": [
      "The Hotel Le Rivage stands as a testament to the glories of yesteryear, its Art Deco lines softened by the relentless sea air. The atmosphere is thick with the scent of damp stone and the crisp tang of salt, a reminder of the ocean's proximity. Inside, the flickering lights cast dancing shadows, hinting at secrets lurking just out of sight. As rain patters against the windows, the tension among the guests grows palpable, each heartbeat echoing in the silence.",
      "Conversations drift like wisps of smoke, punctuated by laughter that feels forced, as guests exchange wary glances. The sound of waves crashing against the cliffs is a constant reminder of the isolation of this grand hotel, a refuge from the outside world yet a prison of its own making. As the clock ticks on, the sense of unease deepens, blending the promise of revelation with the fear of betrayal."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Observation Deck",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A secluded platform overlooking the tumultuous sea, surrounded by wrought-iron railings painted in chipped black.",
      "sensoryDetails": {
        "sights": [
          "stormy waves crashing below",
          "dark clouds gathering overhead",
          "flickering lights from the hotel",
          "distant silhouettes of sailing boats",
          "the glint of glass shards on the floor"
        ],
        "sounds": [
          "howling wind through the railings",
          "distant thunder rumbling",
          "waves crashing against the rocks",
          "the creak of old metal",
          "the flutter of a trapped bird"
        ],
        "smells": [
          "briny sea spray",
          "wet stone and rust",
          "faint scent of eucalyptus",
          "decaying seaweed",
          "the metallic tang of blood"
        ],
        "tactile": [
          "cold metal railings",
          "rough stone underfoot",
          "the chill of the sea breeze",
          "moisture-laden air",
          "sharp glass shards"
        ]
      },
      "accessControl": "Restricted to staff during maintenance; guests allowed only during daylight hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked deck",
            "mist rising from the ocean",
            "grey clouds hanging low",
            "puddles reflecting the dark sky"
          ],
          "sounds": [
            "steady rain tapping on metal",
            "gulls crying in the distance",
            "the distant rumble of thunder",
            "water dripping from the railings"
          ],
          "smells": [
            "fresh rain on stone",
            "damp earth",
            "the scent of wet wood",
            "cold sea air"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light over the sea",
            "dark silhouettes of cliffs",
            "the glint of wet metal",
            "shadows stretching across the deck"
          ],
          "sounds": [
            "silence broken by distant waves",
            "the creaking of the deck",
            "soft rustling of leaves from nearby trees"
          ],
          "smells": [
            "salt and seaweed",
            "scent of damp air",
            "cold stone"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "stars beginning to twinkle",
            "glow of lights from the hotel",
            "shadows dancing across the deck"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant chatter of guests",
            "the soft hum of the wind",
            "the tick of a clock in the distance"
          ],
          "smells": [
            "warmth of the setting sun",
            "the sweet scent of blooming jasmine",
            "the faint aroma of dinner from the hotel"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Observation Deck, once a romantic vantage point for guests, now bears witness to something sinister. The jagged cliffs rise sharply below, the ocean roaring with ferocity. The air is heavy with the scent of salt and damp earth, a foreboding reminder of nature's power. As the wind howls, it carries whispers of secrets long kept, and the shadows seem to pulse with unspoken fears. This is no longer a place of solace but a stage for deception.",
        "On this deck, the remnants of a struggle are evident. Glass shards glimmer like fallen stars against the stone, and the distant thunder rumbles, echoing the tension that hangs in the air. As the sky darkens, the atmosphere thickens with dread, each gust of wind stirring the unease among the guests. The Observation Deck, isolated from the warmth of the hotel, has transformed into a crucible of mystery, where the past and present collide in a chilling embrace."
      ]
    },
    {
      "id": "the_lounge",
      "name": "The Grand Lounge",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Luxurious seating arrangements with faded velvet chairs, large bay windows overlooking the sea, and a grand piano in the corner.",
      "sensoryDetails": {
        "sights": [
          "faded elegance of velvet upholstery",
          "large bay windows framing stormy seas",
          "ornate chandelier casting soft light",
          "piano with dust collecting on keys",
          "floral arrangements wilting in vases"
        ],
        "sounds": [
          "soft piano melodies from distant corners",
          "murmurs of guests in hushed tones",
          "the crackle of the fireplace",
          "rain tapping against the windows",
          "the rustle of newspapers being read"
        ],
        "smells": [
          "faint scent of tobacco smoke",
          "lingering aroma of strong coffee",
          "the mustiness of old books",
          "the floral notes of wilting flowers",
          "the warm scent of wood burning"
        ],
        "tactile": [
          "soft velvet under fingertips",
          "the coolness of polished wood",
          "the warmth of a nearby fire",
          "the texture of aged leather armchairs",
          "the chill of rain-soaked air through the windows"
        ]
      },
      "accessControl": "Open to all guests, but restricted after midnight.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "raindrops racing down the glass",
            "faded floral patterns on the carpet",
            "the piano covered in droplets"
          ],
          "sounds": [
            "rain drumming on the roof",
            "soft chatter over breakfast",
            "the clink of porcelain cups",
            "the rustle of newspapers"
          ],
          "smells": [
            "freshly brewed coffee",
            "the scent of wet carpet",
            "the aroma of croissants",
            "damp air mixing with tobacco"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "the flicker of candlelight",
            "guests gathered, whispering conspiratorially",
            "the piano keys glinting in low light"
          ],
          "sounds": [
            "distant laughter from the bar",
            "the clinking of ice in glasses",
            "the soft melody of the piano",
            "the rustle of a newspaper being turned"
          ],
          "smells": [
            "the rich aroma of aged whiskey",
            "the scent of old leather",
            "the sweetness of pastries",
            "the mustiness of old books"
          ],
          "mood": "suspicious camaraderie"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling through the windows",
            "guests in elegant evening wear",
            "the shimmer of glass and crystal",
            "the piano player bathed in warm light"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "the soft strains of piano music",
            "the crackle of the fire",
            "the hum of conversation"
          ],
          "smells": [
            "the scent of fine wine",
            "the aroma of rich, hearty meals",
            "the fragrance of fresh flowers",
            "the warmth of burning logs"
          ],
          "mood": "festive yet tense"
        }
      ],
      "paragraphs": [
        "The Grand Lounge, with its faded velvet upholstery and grand chandelier, serves as the heart of the hotel. Guests gather here not only for warmth and comfort but also to exchange whispers and glances, each conversation laced with unspoken tension. The large bay windows provide a view of the stormy sea, where waves crash against the cliffs, mirroring the turmoil within. The piano stands in the corner, its keys untouched, as if it too senses the weight of the secrets in the air.",
        "As night falls, the atmosphere shifts, laughter mingling with the crackle of the fireplace. The scent of tobacco smoke and rich coffee wafts through the air, wrapping around guests like an embrace. Yet, beneath the surface, currents of suspicion run deep. The lounge becomes a stage for the drama unfolding, where every glance and whispered word may hold the key to unraveling the mystery."
      ]
    },
    {
      "id": "the_kitchen",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Staff-only area",
      "visualDetails": "A bustling kitchen filled with large stainless steel appliances, shelves lined with jars of preserved foods, and a large wooden table at the center.",
      "sensoryDetails": {
        "sights": [
          "gleaming steel countertops",
          "copper pots hanging from hooks",
          "jars of preserves lining the shelves",
          "the steam rising from pots",
          "staff moving quickly in white uniforms"
        ],
        "sounds": [
          "clattering dishes and cutlery",
          "the hiss of steam escaping",
          "the chopping of vegetables",
          "the sizzle of food on the stove",
          "the chatter of kitchen staff"
        ],
        "smells": [
          "aroma of freshly baked bread",
          "the scent of simmering sauces",
          "the tang of herbs and spices",
          "the warmth of baked pastries",
          "the sharpness of cleaning products"
        ],
        "tactile": [
          "smoothness of polished steel",
          "heat radiating from the stove",
          "the weight of heavy pots",
          "the texture of flour-dusted surfaces",
          "the coolness of tiled floors"
        ]
      },
      "accessControl": "Strictly staff-only, with guards during peak hours; guests prohibited at all times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on the windowpanes",
            "steam fogging up glass",
            "the glow of morning light"
          ],
          "sounds": [
            "the patter of rain on the roof",
            "the clanging of pots and pans",
            "the sound of orders being shouted"
          ],
          "smells": [
            "the scent of fresh pastries",
            "the aroma of brewing coffee",
            "the sharpness of citrus"
          ],
          "mood": "busy anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through the windows",
            "the bustle of staff preparing meals",
            "the steam rising from pots"
          ],
          "sounds": [
            "the hiss of food frying",
            "the chatter of staff planning menus",
            "the clatter of dishes being prepared"
          ],
          "smells": [
            "the rich aroma of roasting meats",
            "the scent of herbs wafting",
            "the warmth of baked goods"
          ],
          "mood": "frantic energy"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the soft glow of overhead lights",
            "the organized chaos of dinner prep",
            "the shine of polished utensils"
          ],
          "sounds": [
            "the bustle of servers preparing for dinner",
            "the clinking of glasses",
            "the soft chatter of staff discussing orders"
          ],
          "smells": [
            "the scent of rich sauces",
            "the warmth of freshly baked bread",
            "the aroma of spices"
          ],
          "mood": "focused intensity"
        }
      ],
      "paragraphs": [
        "The Kitchen serves as the beating heart of Hotel Le Rivage, a place where culinary magic unfolds amidst the chaos of daily operations. The gleaming steel appliances and the aroma of freshly baked bread create an inviting atmosphere, yet the tension is palpable as staff bustle about, their movements choreographed by necessity. The sound of clattering dishes and sizzling pans fills the air, a symphony of industry and urgency.",
        "As the day progresses, the Kitchen transforms into a hive of activity, each chef and server focused on their tasks. The scent of simmering sauces and the sharp tang of herbs blend together, creating an olfactory tapestry that entices the senses. But beneath the surface lies an undercurrent of pressure, as whispered conversations hint at secrets that may unravel the very fabric of the hotel, making the kitchen a crucial yet hidden player in the unfolding mystery."
      ]
    },
    {
      "id": "the_library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Quiet gathering space and clue discovery",
      "visualDetails": "A cozy room lined with dark wood shelves filled with books, a large fireplace, and plush armchairs scattered throughout.",
      "sensoryDetails": {
        "sights": [
          "the flickering flames in the fireplace",
          "plush armchairs inviting relaxation",
          "the soft glow of table lamps",
          "dust motes dancing in the light"
        ],
        "sounds": [
          "the crackle of the fireplace",
          "the rustle of pages turning",
          "the soft thud of books being placed on tables",
          "the distant sound of rain against the windows",
          "the creak of old floorboards"
        ],
        "smells": [
          "the mustiness of old books",
          "the warmth of burning wood",
          "the faint scent of leather bindings",
          "the aroma of fresh ink",
          "the sweetness of aged paper"
        ],
        "tactile": [
          "the softness of plush upholstery",
          "the coolness of leather-bound books",
          "the warmth radiating from the fire",
          "the texture of paper between fingers",
          "the smoothness of polished wood"
        ]
      },
      "accessControl": "Open to guests during the day; locked after sunset.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft light filtering through rain-drenched windows",
            "the library bathed in a muted glow",
            "drops of water on windowpanes"
          ],
          "sounds": [
            "the steady rhythm of rain",
            "the soft crackle of the fire",
            "the rustle of pages turning"
          ],
          "smells": [
            "freshly brewed coffee wafting in",
            "the scent of damp wood",
            "the mustiness of old pages"
          ],
          "mood": "contemplative solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "the flicker of the fireplace",
            "sunlight struggling through clouds"
          ],
          "sounds": [
            "the soft thump of books landing",
            "the distant murmur of guests",
            "the crackle of the fire"
          ],
          "smells": [
            "the aroma of fresh ink",
            "the scent of old leather",
            "the warmth of burning wood"
          ],
          "mood": "quiet reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling from lamps",
            "shadows dancing as the fire flickers"
          ],
          "sounds": [
            "the soft murmur of conversation",
            "the crackle of the fire",
            "the rustle of pages turning"
          ],
          "smells": [
            "the scent of fresh coffee",
            "the warmth of burning wood",
            "the sweet aroma of old books"
          ],
          "mood": "introspective gathering"
        }
      ],
      "paragraphs": [
        "The Library offers a refuge from the bustling hotel, a sanctuary where whispers of the past linger among the pages of forgotten tomes. Dark wood shelves line the walls, filled to the brim with books that hold the secrets of the ages. The flicker of the fireplace casts a warm glow, inviting guests to sink into plush armchairs and lose themselves in their thoughts. Yet, the air is thick with tension, as the quietude masks the brewing storm of suspicion.",
        "As guests browse the shelves, the sound of crackling wood and rustling pages creates an ambiance of contemplation. The musty scent of old books mingles with the warmth of the fire, wrapping around them like a comforting embrace. But beneath this serene surface lies the potential for discovery; a misplaced book, a forgotten note, or a lingering gaze may reveal the truth hidden within the shadows of the library, making it a crucial site in the unfolding mystery."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028309413,
  "durationMs": 32148
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1946,
    "month": "June",
    "day": null,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "overcast with brief sunbreaks",
      "occasional rain showers",
      "cool coastal breezes"
    ],
    "daylight": "Long summer days with daylight lasting into the evening, sunset around nine o'clock.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, just after dinner when guests gather.",
    "holidays": [
      "Father's Day (June 16)"
    ],
    "seasonalActivities": [
      "beach outings with picnics",
      "visits to local fairs and carnivals",
      "evening dances at community centers"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "lightweight linen suits",
        "dress shirts with short sleeves",
        "hats like fedoras or straw boater hats"
      ],
      "casual": [
        "khaki shorts",
        "button-up short-sleeved shirts",
        "comfortable loafers"
      ],
      "accessories": [
        "leather belts",
        "silk ties with geometric patterns",
        "wristwatches with leather bands"
      ]
    },
    "womensWear": {
      "formal": [
        "sundresses with floral patterns",
        "bolero jackets",
        "pearl necklaces"
      ],
      "casual": [
        "capri pants",
        "blouses with puff sleeves",
        "comfortable sandals"
      ],
      "accessories": [
        "wide-brimmed straw hats",
        "matching handbags",
        "delicate gloves"
      ]
    },
    "trendsOfTheMoment": [
      "emphasis on practicality in fashion",
      "bright, pastel colors becoming popular",
      "influence of Hollywood styles"
    ],
    "socialExpectations": [
      "men in suits expected for formal gatherings",
      "women encouraged to wear dresses even for casual outings",
      "hats considered essential for outdoor events"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Berlin Blockade begins, causing tensions among Allies",
      "Nuremberg Trials ongoing, spotlighting war crimes",
      "Labor strikes in various industries over post-war wages"
    ],
    "politicalClimate": "A period of uncertainty as nations grapple with the aftermath of WWII and the rise of the Cold War.",
    "economicConditions": "Inflation begins to rise as the economy transitions from wartime to peacetime, leading to increased prices.",
    "socialIssues": [
      "returning veterans facing unemployment",
      "women's rights and workforce reintegration",
      "racial tensions in urban areas"
    ],
    "internationalNews": [
      "U.S. and USSR relations deteriorate",
      "United Nations continues to establish its presence in global governance"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Rum and Coca-Cola' by The Andrews Sisters",
        "'The Old Piano Roll Blues' by The Bing Crosby",
        "'The Gypsy' by The Ink Spots"
      ],
      "films": [
        "'The Best Years of Our Lives'",
        "'It's a Wonderful Life'",
        "'The Killers'"
      ],
      "theater": [
        "'Annie Get Your Gun'",
        "'Carousel'",
        "'The Glass Menagerie'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Shadow'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Screaming Mimi' by Fredric Brown",
        "'The Glass Key' by Dashiell Hammett",
        "'The Postman Always Rings Twice' by James M. Cain"
      ],
      "popularGenres": [
        "mystery",
        "thriller",
        "romance"
      ]
    },
    "technology": {
      "recentInventions": [
        "transistor radio",
        "early commercial television sets",
        "jet engines for military aircraft"
      ],
      "commonDevices": [
        "vacuum cleaners",
        "cooking ranges",
        "refrigerators"
      ],
      "emergingTrends": [
        "growth of consumer goods market",
        "rise of automobile culture",
        "development of suburbs"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cigarettes (pack): one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "outdoor picnics",
        "community theater visits",
        "local dances at town halls"
      ],
      "socialRituals": [
        "Sunday family gatherings",
        "weekly movie nights",
        "afternoon tea parties"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing middle class with increased leisure time",
      "persistence of class distinctions"
    ],
    "gender": [
      "women increasingly entering the workforce",
      "traditional gender roles still prevalent"
    ],
    "race": [
      "racial segregation persists in many regions",
      "beginning of civil rights movements gaining traction"
    ],
    "generalNorms": [
      "emphasis on family values",
      "cautious optimism about the future",
      "suspicion towards communism"
    ]
  },
  "atmosphericDetails": [
    "The salty scent of the ocean mingles with the aroma of fresh rain on the pavement, creating a vivid coastal ambiance.",
    "The muted chatter of guests in the hotel lobby creates a tension-filled atmosphere, punctuated by distant thunder rumbling.",
    "The flicker of early electric lights casts shadows on the wallpaper, enhancing the air of mystery as guests navigate their secrets."
  ],
  "paragraphs": [
    "June 1946 unfolds under a blanket of grey clouds, with occasional rain showers sweeping through the coastal town. The air is thick with humidity, and the sound of rolling waves mingles with the soft patter of rain. As sunlight breaks through the clouds intermittently, guests of the hotel find themselves drawn into a world of uncertainty and tension, where every whispered conversation feels charged with suspicion. The long summer evenings stretch on, and the hotel, often a refuge, transforms into a hotbed of intrigue where the line between trust and betrayal blurs.",
    "In this post-war summer, fashion reflects both the optimism and practicality of the time. Men don lightweight linen suits paired with crisp short-sleeved dress shirts, while women opt for floral sundresses, their silhouettes accentuated by bolero jackets. Accessories abound, from fedoras to wide-brimmed hats, adding a touch of elegance to the casual gatherings in the hotel's gardens. The vibrant colors and patterns of the season evoke a sense of renewal, yet the guests' attire also hints at the underlying anxieties of a society still grappling with the aftermath of war.",
    "Life in June 1946 is punctuated by the sounds of laughter and music emanating from local dances, but beneath the surface lies a complex web of social issues. Prices are rising, and the economy transitions awkwardly from wartime rationing to peacetime abundance, leading to frustrations among citizens. The echoes of community theater performances and radio broadcasts fill the air, while the scent of fresh bread from local bakers signals a return to normalcy. Yet, the specter of labor strikes looms, as returning veterans and women seek their place in a changing world. Amid this backdrop, the hotel becomes a microcosm of society, where the aspirations and fears of its guests intertwine in the dim light of a tense summer."
  ],
  "note": "",
  "cost": 0.0010464498,
  "durationMs": 12163
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A grand seaside hotel hosts a gathering of influential guests, where post-war tensions and shifting social norms create an atmosphere ripe for intrigue and deception.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The emergence of a more diverse workforce and the lingering effects of WWII create class tensions, as traditional roles are challenged and secrets abound among the elite."
  },
  "setting": {
    "location": "A grand seaside hotel with Art Deco architecture",
    "institution": "hotel",
    "weather": "overcast with occasional rain showers"
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
    "id": "rewound_time",
    "value": "ten minutes past eight",
    "description": "The clock was set to ten minutes past eight, which was earlier than the actual time of death."
  },
  {
    "id": "actual_time_of_death",
    "value": "twenty minutes past nine",
    "description": "The actual time of death occurred twenty minutes past nine, contradicting the clock's display."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 13,
  "countsByPlacement": {
    "early": 3,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 12,
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
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "testimonial"
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
