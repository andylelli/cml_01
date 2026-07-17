# Actual Prompt Record

- Run ID: `mystery-1784061663248`
- Project ID: ``
- Timestamp: `2026-07-14T20:45:52.758Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `80b4ecc7686a9adb`

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
    "title": "The Echoes of Identity",
    "author": "Detective Writer",
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
      "subtype": "acoustic manipulation"
    }
  },
  "death_method": "strangled with a silk scarf",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Respected investigator",
      "private_secret": "Struggles with past failures",
      "motive_seed": "Justice for victims",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal redemption",
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
      "public_persona": "Respected physician",
      "private_secret": "Involved in a controversial medical trial",
      "motive_seed": "Potential scandal exposure",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspicious guest",
      "relationships": [],
      "public_persona": "War hero",
      "private_secret": "Hiding a wartime secret",
      "motive_seed": "Fear of exposure",
      "motive_strength": "high",
      "alibi_window": "9:30 to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the victim's room"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Friend of the victim",
      "relationships": [],
      "public_persona": "Charming socialite",
      "private_secret": "In love with the victim's partner",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "9:45 to 10:15 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Love",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "35-45",
      "role_archetype": "Hotel staff",
      "relationships": [],
      "public_persona": "Dutiful maid",
      "private_secret": "Witnessed a confrontation",
      "motive_seed": "Loyalty to the victim",
      "motive_strength": "low",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Job security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "45-55",
      "role_archetype": "Business rival",
      "relationships": [],
      "public_persona": "Successful businessman",
      "private_secret": "Had financial dealings with the victim",
      "motive_seed": "Financial loss",
      "motive_strength": "high",
      "alibi_window": "9:30 to 10:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Wealth",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Hugo Vane"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a foggy evening at a seaside hotel, Dr. Mallory Finch is found dead in her room, her death masked by a gramophone recording playing at the moment of her murder. Detective Eleanor Voss must untangle a web of deceit that involves mistaken identities and hidden motives."
    },
    "accepted_facts": [
      "Dr. Mallory Finch was discovered dead in her room.",
      "A gramophone was found playing a recording at the time of the murder.",
      "The victim had a note suggesting a meeting at a specific time."
    ],
    "inferred_conclusions": [
      "The timing of the recording may have been used to fabricate an alibi.",
      "Multiple guests had reasons to be near the victim's room around the time of death."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on gramophone, murder, and needle to expose the false timing.",
      "delivery_path": [
        {
          "step": "The killer sets the gramophone to trigger at a precise time."
        },
        {
          "step": "The victim is confronted and killed during the playback."
        }
      ]
    },
    "outcome": {
      "result": "The killer's identity is obscured by the confusion created by the gramophone."
    }
  },
  "false_assumption": {
    "statement": "The victim was alone in her room at the time of death.",
    "type": "identity",
    "why_it_seems_reasonable": "Witnesses placed the victim in her room, and the gramophone's playback could mislead others about her interactions.",
    "what_it_hides": "The killer was present and used the recording to create a false narrative of isolation."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses reported seeing Captain Hale near the victim's room around the time of death.",
      "He had an argument with Dr. Finch earlier in the evening."
    ],
    "the_one_flaw": "Captain Hale was seen with several guests during the timeframe of the murder, which contradicts the timeline.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses heard a loud argument coming from the victim's room.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was actually from a previous encounter replayed on the gramophone.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A footprint was found outside the victim's window.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The footprint belonged to a hotel staff member who was cleaning the area earlier.",
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
    "rationale": "All suspects were present at the hotel during the murder, and no outsiders were involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The gramophone's recording started at precisely ten minutes past eight.",
        "Witnesses heard sounds from the victim's room at eight-thirty."
      ],
      "windows": [
        "The murder occurred between eight twenty and eight forty."
      ],
      "contradictions": [
        "Witness accounts of the argument conflict with the time the recording started."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Captain Ivor Hale",
        "Hugo Vane",
        "Beatrice Quill"
      ],
      "objects": [
        "The gramophone",
        "The victim's scarf"
      ],
      "permissions": [
        "All suspects had access to the victim's room."
      ]
    },
    "physical": {
      "laws": [
        "Sound travels differently in a soundproof environment."
      ],
      "traces": [
        "The gramophone needle was found in the last groove, indicating it hadn't been moved."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trusted Captain Hale due to his war hero status."
      ],
      "authority_sources": [
        "Dr. Finch was respected in her field, lending her words weight."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The gramophone's needle was found still in the groove of the last track.",
        "correction": "This indicates that the recording played continuously and was not interrupted.",
        "effect": "Narrows the timeline of the murder to the recording duration.",
        "required_evidence": [
          "The gramophone's position in the room.",
          "Witness statements about hearing the recording."
        ],
        "reader_observable": true
      },
      {
        "observation": "A handwritten note in the victim's room suggested a meeting at 'ten minutes past eight'.",
        "correction": "This note implies that someone was expected at that time, aligning with the gramophone's playback.",
        "effect": "Eliminates the possibility that the victim was alone.",
        "required_evidence": [
          "The note found in the victim's room.",
          "Witness accounts of the victim's plans."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall hearing a raised voice coinciding with the gramophone's playback.",
        "correction": "This suggests an argument took place, indicating the presence of another individual.",
        "effect": "Narrows the suspect pool to those who had access to the victim's room.",
        "required_evidence": [
          "Witness statements about the argument.",
          "The gramophone's playback timing."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "By playing the gramophone recording at a loud volume while interrogating the suspects, we can observe their reactions to the sound and the timeline.",
    "knowledge_revealed": "The inconsistencies in their alibis will be exposed when the timing of the recording is compared to their statements.",
    "pass_condition": "If any suspect's alibi contradicts the established timeline, they are proven guilty.",
    "evidence_clues": [
      "clue_2",
      "clue_mechanism_visibility_core",
      "clue_4",
      "clue_early_1",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The gramophone's needle position indicates it played continuously, and the note suggests a meeting at eight ten. Step 2: Witnesses heard an argument coinciding with the playback, eliminating the chance of isolation. Step 3: The trap test reveals contradictions in suspect statements."
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
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His alibi is corroborated by multiple witnesses who saw him elsewhere.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her whereabouts were confirmed by hotel staff.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "She was busy cleaning rooms during the time of death.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
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
    "identity_rules": [
      {
        "character_name": "Dr. Mallory Finch",
        "revealed_in_act": 3,
        "before_reveal_reference": "the doctor",
        "after_reveal_reference": "Dr. Finch"
      }
    ],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_hugo_vane",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_early_1",
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
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a travel writer caught in the web of her own romantic entanglements, finds herself embroiled in a murder investigation at a seaside hotel.",
    "publicPersona": "Charming and adventurous, Eleanor brings tales of distant lands to the local society.",
    "privateSecret": "Struggles with a secret affair with a married man whom she can't let go.",
    "motiveSeed": "Invited to the hotel for a seasonal writing retreat and to reconnect with the victim.",
    "motiveStrength": "moderate",
    "alibiWindow": "Present at the hotel during the murder.",
    "accessPlausibility": "easy",
    "stakes": "Cleansing her conscience and revealing the truth about her affair.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a lilting cadence, often punctuating her observations with a sardonic twist. She tends to use metaphors drawn from her travels, adding color to her conversations.",
    "signatureTic": "Well, isn’t that just the icing on the cake?",
    "internalConflict": "Eleanor grapples with guilt over her affair, questioning the moral implications of her choices while seeking redemption.",
    "personalStakeInCase": "The murder of the victim challenges Eleanor to confront her own ethical failings and the potential fallout of her secret life.",
    "paragraphs": [
      "Eleanor Voss stood on the balcony of her seaside hotel room, the salty breeze tousling her hair as she gazed out at the crashing waves. With a pen in hand, she often found inspiration in the tumultuous nature of the sea, but today, her thoughts were far from poetic. The recent murder of Dr. Mallory Finch loomed large in her mind, intertwining with the guilt of her own secret affair. She had come to the hotel hoping to reignite her writing career, but the specter of her choices now threatened to overshadow her ambitions.",
      "Charming and adventurous, Eleanor was used to being the center of attention, regaling friends with tales of far-off places. Yet, behind her captivating smile lay a heart entangled in a web of deceit. The affair with a married man was an intoxicating escape, but with every stolen moment came the bitter taste of guilt. She had hoped to reconnect with Dr. Finch, but instead, she found herself drawn into a murder investigation that forced her to confront the consequences of her actions.",
      "As she delved deeper into the mystery, Eleanor’s wit became both a shield and a sword. She navigated conversations with a dry humor that masked her inner turmoil, often deflecting inquiries about her personal life with clever quips. ‘Well, isn’t that just the icing on the cake?’ she would say whenever a situation turned absurdly complicated. This veneer of confidence, however, was a fragile facade, one that crumbled under the weight of her internal conflict. With each clue uncovered, Eleanor was faced with the duality of her existence: the charming writer and the woman ensnared by her own choices.",
      "Eleanor's investigation led her through the lives of the other suspects, each harboring their own secrets and motives. Captain Ivor Hale, a disillusioned veteran, carried the burden of loss, while Beatrice Quill, the ambitious socialite, clung to her dreams with desperation. As Eleanor pieced together the puzzle, she began to see reflections of her own struggles in their stories. The stakes were high—not just for the victim, but for Eleanor, who realized she had to cleanse her conscience and reveal the truth about her affair, regardless of the fallout.",
      "In the end, the journey became a crucible for Eleanor, forging her from a woman riddled with guilt into someone who could face her mistakes. The murder investigation was no longer just about solving a crime; it was about understanding herself. As the waves crashed below her, Eleanor Voss stood resolute, ready to confront the echoes of her identity."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a well-respected physician, harbors dark secrets that threaten to unravel her life as she becomes the murder victim.",
    "publicPersona": "A well-respected doctor known for her charitable works and calm demeanor.",
    "privateSecret": "Has been embezzling funds from a local charity to support a lavish lifestyle.",
    "motiveSeed": "Fears the victim will expose her financial wrongdoings.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in her office, but staff confirm she left earlier.",
    "accessPlausibility": "possible",
    "stakes": "Her professional reputation and freedom are at risk.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks with a measured tone, her words carefully chosen. She rarely indulges in humor, preferring to maintain a serious demeanor that reflects her professional life.",
    "signatureTic": "I have a duty to my patients.",
    "internalConflict": "Dr. Finch is torn between her commitment to her profession and the guilt of her embezzlement, fearing the consequences of her actions.",
    "personalStakeInCase": "Her life is at stake, as the investigation into her murder reveals the depths of her moral failings.",
    "paragraphs": [
      "Dr. Mallory Finch was a name synonymous with trust and care in the small seaside town. A physician revered for her charitable contributions, she was the epitome of a community leader. Yet beneath the polished exterior lay a tarnished soul, one riddled with guilt and fear. The embezzlement of funds from the very charity she championed had become a noose around her neck, tightening with every passing day. The fear of exposure loomed like a shadow, and as the whispers of her wrongdoings grew louder, so did her desperation.",
      "In her quiet office, Dr. Finch maintained a calm demeanor, her patients oblivious to the turmoil that swirled within her. ‘I have a duty to my patients,’ she would often remind herself, but the weight of her secret threatened to crush her resolve. The lavish lifestyle she had grown accustomed to was built on shaky foundations, and each moment spent in her pristine office felt like a ticking clock counting down to her inevitable downfall. She had hoped to escape the consequences, but fate had other plans.",
      "The day of the murder was a fateful one for Dr. Finch. She had claimed to be in her office, but staff members confirmed her departure earlier than expected. As the news of her murder spread through the hotel, a chilling realization washed over her: the very secrets she had fought to protect were now the catalysts for her demise. Fear gripped her heart; she had always believed she could control the narrative, but the specter of her financial misdeeds now threatened to unravel her carefully constructed life.",
      "In death, Dr. Finch became a symbol of the fragile nature of reputation and the consequences of unchecked ambition. The investigation into her murder would reveal the depths of her deception, exposing not only her financial crimes but the moral decay that had led her to this point. Her life, once defined by compassion and care, was now a cautionary tale—a reminder of the cost of ambition and the delusions that often accompany it.",
      "As the detectives sifted through the wreckage of her life, Dr. Finch’s legacy would haunt the very halls she once graced with dignity. Her story served as a poignant reminder that the choices we make, no matter how small, can echo through time, leaving a mark that is often indelible. And in the end, the truth would emerge, revealing the woman behind the mask, and the tragic consequences of her fall from grace."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, struggles with the ghosts of his past as he becomes embroiled in a murder investigation.",
    "publicPersona": "A hardened veteran who has seen much, holding onto a sense of lost honor.",
    "privateSecret": "Blames the victim for his son’s untimely death in the war, harboring deep resentment.",
    "motiveSeed": "The victim's words triggered memories of loss, making Ivor contemplate revenge.",
    "motiveStrength": "moderate",
    "alibiWindow": "In the garden during the murder but could have easily returned unnoticed.",
    "accessPlausibility": "possible",
    "stakes": "Redemption through avenging his son.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale's speech is often clipped and direct, with a hint of bitterness. He uses military jargon and occasionally softens his tone when reminiscing about his past.",
    "signatureTic": "It’s a hard life, isn’t it?",
    "internalConflict": "Captain Hale wrestles with the pain of his son's death, torn between seeking revenge and finding peace.",
    "personalStakeInCase": "The murder of Dr. Finch forces Ivor to confront his unresolved grief and the dangerous path of vengeance he contemplates.",
    "paragraphs": [
      "Captain Ivor Hale had seen the world through a different lens, one marred by the horrors of war and the weight of loss. A retired naval officer, he carried himself with the stoicism of a man who had weathered storms both literal and metaphorical. Yet beneath the hardened exterior lay a heart still raw from the wounds of his son's untimely death. Blaming Dr. Mallory Finch for the tragedy, Ivor found himself haunted by memories that refused to fade, each encounter with her a reminder of his pain.",
      "‘It’s a hard life, isn’t it?’ he would often mutter, a self-deprecating remark that belied the turmoil within. In the garden where he spent much of his time, Ivor sought solace among the flowers, but the beauty of nature could not mend the scars of his past. The day of the murder, he was present in the garden, a witness to the world moving on while he remained tethered to his grief. The whispers of the past echoed in his mind, and as the news of Dr. Finch's death reached him, a dark impulse stirred within.",
      "The memories of his son’s death were triggered by the victim's mere presence, her words igniting a fire of resentment that Ivor struggled to quench. He had always believed in honor, but in that moment, revenge whispered sweetly in his ear. The thought of confronting Dr. Finch, of making her feel the weight of his loss, became an intoxicating fantasy. As the investigation unfolded, Ivor found himself at a crossroads, torn between the desire for retribution and the hope for redemption.",
      "As the detectives closed in, Ivor's past became a double-edged sword. Each moment spent in the shadows of the investigation forced him to confront not only the murder but also the unresolved grief that had shaped his life. The stakes were high; he could either succumb to the darkness that beckoned him or find a way to honor his son’s memory through understanding and acceptance. The path to redemption was fraught with danger, and Ivor had to decide whether to continue the cycle of pain or break free from its grasp.",
      "In the end, Captain Ivor Hale's journey became a testament to the power of forgiveness and the struggle for peace. The murder investigation served as a catalyst for his transformation, forcing him to confront the demons of his past and choose a future not defined by vengeance but by the hope of healing. As he looked out at the horizon, Ivor understood that the echoes of his identity could either trap him in a cycle of despair or lead him toward the light of redemption."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a glamorous socialite, finds her ambitions tested as she becomes a suspect in the murder of her secret lover.",
    "publicPersona": "Bubbly and glamorous, always seeking to be at the center of attention.",
    "privateSecret": "Was in a secret romantic involvement with the victim, which she believed could elevate her social standing.",
    "motiveSeed": "Fears that the victim planned to end their affair, ruining her chances in high society.",
    "motiveStrength": "moderate",
    "alibiWindow": "Out shopping for a new dress with friends, but they can only partially confirm her whereabouts.",
    "accessPlausibility": "unlikely",
    "stakes": "Her dreams of social ascendancy depend on keeping her connections intact.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice’s speech is lively and effervescent, punctuated with dramatic flair. She often uses sarcasm to mask her insecurities and is prone to exaggeration.",
    "signatureTic": "Oh darling, life is just a stage, isn’t it?",
    "internalConflict": "Beatrice is torn between her desire for social elevation and the fear of losing everything due to her involvement with the victim.",
    "personalStakeInCase": "The murder investigation threatens to unravel her carefully constructed social facade and expose her secret affair.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of glamour, a socialite who thrived on the adoration of others. ‘Oh darling, life is just a stage, isn’t it?’ she would exclaim, her eyes sparkling with mischief. But beneath the bubbly exterior lay a heart filled with ambition and a yearning for acceptance. Her secret romantic involvement with Dr. Mallory Finch had been a tantalizing affair, one that she believed could catapult her into the upper echelons of society. Yet as the murder unfolded, that dream began to crumble.",
      "The day of the murder found Beatrice out shopping for a new dress, her laughter ringing through the boutique as she flaunted her latest finds. But the thrill of her shopping spree was quickly overshadowed by the news of Dr. Finch's death. The very woman who had promised to elevate Beatrice's standing was now gone, leaving her to grapple with the reality of their affair and the precariousness of her social ambitions. Her friends could only partially confirm her whereabouts, casting shadows of doubt over her innocence.",
      "As the investigation progressed, Beatrice's sardonic wit became both her armor and her Achilles' heel. She navigated the hotel halls with a dramatic flair, often exaggerating her reactions to deflect scrutiny. ‘Oh darling, it’s all so terribly tragic, isn’t it?’ she would say, masking her insecurities with humor. Yet, as whispers of her involvement began to circulate, the stakes grew higher, and the façade she had carefully constructed began to crack.",
      "Beatrice found herself at a crossroads, torn between her ambition and the fear of being exposed. The murder investigation was not merely a scandal; it threatened to unravel her entire existence. With each passing day, she faced the reality that her dreams of social ascendancy depended on keeping her connections intact, and now, those connections were under threat. The lighthearted socialite was forced to confront the darker side of her ambitions, realizing that the price of her desires might be higher than she was willing to pay.",
      "In the end, Beatrice’s journey became a reflection of the complexities of ambition and the consequences of living in the shadows of others. The murder investigation forced her to reevaluate her values and the lengths she would go to for acceptance. As she faced the possibility of losing everything she had fought for, Beatrice Quill learned that the stage of life was not just about the spotlight; it was also about the authenticity that lay behind the curtain."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a talented fashion designer, grapples with jealousy and betrayal as she becomes entangled in a murder investigation.",
    "publicPersona": "Talented and innovative, creating waves in the fashion industry.",
    "privateSecret": "Jealous of the victim's sudden fame and success, harboring feelings of betrayal.",
    "motiveSeed": "Sees the victim's death as a means to reclaim her lost reputation in the fashion world.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be in her room sketching designs; no one can confirm.",
    "accessPlausibility": "possible",
    "stakes": "The chance to reignite her career by stepping into the spotlight.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with an artistic flair, often using vivid imagery and metaphors. Her observations are sharp and insightful, revealing her keen eye for detail.",
    "signatureTic": "Fashion is a cruel mistress.",
    "internalConflict": "Sylvia struggles with feelings of jealousy and betrayal, torn between her desire for success and the integrity of her craft.",
    "personalStakeInCase": "The murder investigation threatens to derail her career and expose her insecurities as a designer.",
    "paragraphs": [
      "Sylvia Trent was a name whispered in the corridors of fashion, a designer whose talent was matched only by her ambition. ‘Fashion is a cruel mistress,’ she would often say, a sardonic acknowledgment of the industry’s fickle nature. Yet, behind her innovative designs lay a heart burdened by jealousy—a jealousy that festered as Dr. Mallory Finch's fame skyrocketed. The sudden spotlight on the victim felt like a betrayal, a reminder of Sylvia’s own struggles to reclaim her place in the fashion world.",
      "On the day of the murder, Sylvia claimed to be in her room sketching designs, but the truth was that her mind was a tumultuous sea of emotions. The news of Dr. Finch's death struck her like a bolt of lightning, igniting a whirlwind of conflicting feelings. The opportunity to step back into the spotlight was now tinged with darkness, as whispers of her involvement began to circulate. Her alibi was flimsy at best, and as the investigation unfolded, Sylvia felt the walls closing in around her.",
      "With an observational wit, Sylvia navigated the conversations at the hotel, her keen eye for detail allowing her to pick up on the subtle tensions among the guests. ‘Isn’t it fascinating how ambition can twist the heart?’ she would remark, her words dripping with irony. Yet, as the stakes grew higher, Sylvia found herself grappling with her own moral compass. The murder investigation was not just a scandal; it was a crucible that forced her to confront her insecurities and the lengths she had gone to for success.",
      "As the detectives probed deeper, Sylvia understood that her jealousy could either fuel her downfall or propel her to a new understanding of herself. The chance to reignite her career was within reach, but it came with a price. Would she sacrifice her integrity for a fleeting moment of glory, or would she embrace the lessons learned from her rivalry with the victim? The choice loomed large, and Sylvia was caught in the crossfire of ambition and authenticity.",
      "In the end, Sylvia Trent’s journey became a reflection of the complexities of creativity and the personal demons that often accompany it. The murder investigation forced her to reevaluate her values and the true meaning of success. As she faced the possibility of losing everything she had worked for, Sylvia understood that the path to reclaiming her reputation lay not in the shadows of jealousy but in the light of self-acceptance and honesty."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a cunning businessman, faces the consequences of his unscrupulous actions as he becomes a suspect in the murder of Dr. Mallory Finch.",
    "publicPersona": "Charismatic and persuasive, known for his influential connections.",
    "privateSecret": "Was on the verge of losing a lucrative deal due to the victim's interference.",
    "motiveSeed": "Believed the victim would ruin his business prospects if she continued to investigate his practices.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be at a business meeting which no one can verify.",
    "accessPlausibility": "unlikely",
    "stakes": "Maintaining a profitable business and reputation in society.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks with a directness that often borders on brusque. He is not one for pleasantries, preferring to get straight to the point, often laced with a hint of sarcasm.",
    "signatureTic": "Let’s not beat around the bush.",
    "internalConflict": "Hugo wrestles with the consequences of his greed and the fear of losing everything he has built.",
    "personalStakeInCase": "The murder investigation threatens to expose his unethical business practices and jeopardize his future.",
    "paragraphs": [
      "Hugo Vane was a name that commanded attention, a businessman whose charisma masked a ruthless ambition. ‘Let’s not beat around the bush,’ he would say, cutting through the niceties of conversation with a bluntness that left little room for misinterpretation. In the world of property development, Hugo had built a reputation for being persuasive, but behind the charm lay a web of deceit that threatened to ensnare him. The murder of Dr. Mallory Finch was a complication he could ill afford.",
      "As the investigation unfolded, Hugo found himself on shaky ground. He had been on the verge of losing a lucrative deal due to the victim's interference, and the thought of exposure sent shivers down his spine. His alibi—claimed to be at a business meeting—was as flimsy as the paper it was written on, and he knew that the detectives would soon be circling like vultures. The stakes were high; his business and reputation hung in the balance, and he would do anything to protect them.",
      "Hugo's speech was often laced with sarcasm, a defense mechanism that revealed his underlying anxiety. ‘Business is a tough game, isn’t it?’ he would remark, masking the fear of what lay ahead. As the walls began to close in, he felt the weight of his choices pressing down on him. The very practices that had brought him success were now the chains that bound him, and the murder investigation threatened to expose the truth behind his charming façade.",
      "The conflict within Hugo was palpable; he had built a life on ambition, but at what cost? The murder investigation forced him to confront the reality of his actions, and the fear of losing everything he had worked for loomed large. Would he continue to play the game of deceit, or would he be forced to reckon with the consequences of his greed? As the detectives dug deeper, Hugo realized that the price of ambition could be far greater than he had ever anticipated.",
      "In the end, Hugo Vane’s journey became a reflection of the moral complexities of ambition and the dangers of unchecked greed. The murder investigation was a catalyst for change, pushing him to reconsider the values that had guided his life. As he faced the possibility of losing everything, Hugo understood that true success required more than just cunning; it demanded integrity—a lesson he would need to learn before it was too late."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Ocean View Hotel",
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel boasting Art Deco elegance and sweeping ocean views, harboring secrets beneath its luxurious facade.",
    "visualDescription": "Art Deco architecture with curved lines and ornate details, large glass windows framing the turbulent sea, a grand lobby with polished marble floors and a sweeping staircase leading to the upper floors.",
    "atmosphere": "A palpable tension lingers in the air, echoing the post-war uncertainties that have seeped into every corner of the hotel.",
    "paragraphs": [
      "Perched dramatically on the cliffs of Brighton, The Ocean View Hotel stands as a testament to the opulence of a bygone era. Its Art Deco façade glistens beneath the fog, the gleaming windows offering tantalizing glimpses of the churning sea below. Inside, the grand lobby welcomes guests with its sweeping staircase and meticulously arranged seating areas, the polished marble floors reflecting the dim light of the chandeliers above. Yet, beneath this veneer of elegance lies a disquieting atmosphere, as whispers of uncertainty and hidden agendas swirl like the mist outside.",
      "The sound of crashing waves fills the air, mingling with the faint crackle of a distant radio broadcasting news from the outside world. The scent of salt and damp wood lingers, a reminder of the hotel’s precarious position on the cliffs. Guests navigate narrow hallways adorned with vintage photographs, each step echoing against the walls, a stark reminder of the isolation that envelops the hotel. Outside, the weather shifts unpredictably, a thick fog rolling in from the sea, cloaking the cliffs in a shroud of mystery and limiting access to the winding road that connects the hotel to the bustling town below.",
      "As evening descends, the flickering candlelight casts elongated shadows across the lobby, and the distant sound of laughter from the dining room contrasts sharply with the tension that hangs in the air. Guests retreat to their rooms, locking doors behind them, while the staff scurry about, their expressions a mix of concern and curiosity. The hotel feels alive yet haunted, each room holding its own secrets, its own stories of the past. In this suspended reality, time seems to stretch, and the echoes of identity resonate through the lavish halls, leaving a lingering sense of unease."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Foggy with occasional rain, typical of coastal climates in the 1940s",
    "timeFlow": "Three days of mounting tension and hidden truths",
    "mood": "Tense and suspenseful, reflecting post-war uncertainties",
    "eraMarkers": [
      "Art Deco architecture",
      "Distant radio news broadcasts",
      "Rationed wartime vehicles"
    ],
    "sensoryPalette": {
      "dominant": "Salt air and damp wood",
      "secondary": [
        "Flickering candlelight",
        "Distant laughter from the dining room"
      ]
    },
    "paragraphs": [
      "The Ocean View Hotel stands shrouded in fog, the salt air mingling with the scent of damp wood, creating an atmosphere thick with expectation. The fog rolls in from the churning sea, obscuring the cliffs and lending an air of mystery to the hotel’s surroundings. Inside, the ambiance shifts as the flickering candlelight casts playful shadows, illuminating the lavish Art Deco decor while obscuring the hidden tension that lingers just beneath the surface.",
      "As the day wears on, the distant sound of laughter from the dining room echoes through the narrow hallways, contrasting sharply with the palpable anxiety that fills the air. The hotel, though grand, feels isolated, a world unto itself, where secrets lie hidden behind locked doors. The atmosphere is charged, electric with possibilities, as each guest navigates the fine line between hospitality and suspicion."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "Expansive space with Art Deco chandeliers, polished marble floors, and a sweeping staircase.",
      "sensoryDetails": {
        "sights": [
          "gleaming chandeliers overhead",
          "polished marble reflecting light",
          "ornate Art Deco patterns",
          "large windows framing the sea",
          "vintage photographs on the walls"
        ],
        "sounds": [
          "crackling fireplace",
          "soft murmurs of conversation",
          "footsteps echoing on marble",
          "distant piano music",
          "the rustle of silk dresses"
        ],
        "smells": [
          "freshly polished wood",
          "salt air drifting in",
          "warmth of the fireplace",
          "subtle perfume of guests",
          "lingering scent of tea"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft upholstery of armchairs",
          "cool glass of window panes",
          "warmth from the fireplace",
          "the chill of sea air"
        ]
      },
      "accessControl": "Open to all guests and visitors; staff access for cleaning and maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked marble floors",
            "grey light filtering through windows",
            "misty view of the sea"
          ],
          "sounds": [
            "steady patter of rain",
            "soft shuffling of feet",
            "distant thunder rumbling"
          ],
          "smells": [
            "damp earth",
            "fresh rain on stone",
            "hint of coffee brewing"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "cloudy reflections on the floor",
            "quiet corners untouched by sunlight"
          ],
          "sounds": [
            "silence broken by a ticking clock",
            "soft chatter from guests",
            "the creak of old timbers"
          ],
          "smells": [
            "dust lingering in the air",
            "wood polish",
            "the faint scent of tobacco"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering warmly",
            "golden light spilling from the dining room",
            "shadows dancing on the walls"
          ],
          "sounds": [
            "clinking of glasses",
            "laughter echoing warmly",
            "the soft thud of chairs being moved"
          ],
          "smells": [
            "rich aromas of dinner",
            "freshly baked bread",
            "slightly charred wood"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Ocean View Hotel serves as the heart of the establishment, where guests gather to exchange pleasantries and secrets alike. With its soaring ceilings and elegant chandeliers, the lobby exudes a sense of grandeur, yet the atmosphere is fraught with an undercurrent of tension. The polished marble floors reflect the dim light, and the sounds of conversation mingle with the crackling of the fireplace, creating an inviting yet uneasy ambiance. Vintage photographs line the walls, each telling a story of the hotel’s illustrious past, while the large windows frame the tumultuous sea, a constant reminder of the isolation that envelops this cliffside retreat.",
        "As guests drift in and out, the lobby becomes a stage for hidden motives and whispered conversations. The scent of salt air mingles with the warmth of the fireplace, creating a sensory tapestry that envelops all who enter. Yet, the narrow hallways leading away from this central gathering space serve as a reminder of the hotel’s labyrinthine nature, where secrets can be easily concealed, and identities can be altered under the cover of fog and night."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Dining space for guests",
      "visualDetails": "Elegant dining room with ocean views, white tablecloths, and crystal glassware.",
      "sensoryDetails": {
        "sights": [
          "crystal chandeliers overhead",
          "white tablecloths adorned with silverware",
          "large windows revealing the ocean",
          "floral centerpieces on tables",
          "soft lighting creating a warm glow"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft murmur of conversations",
          "laughter ringing out",
          "the rustle of napkins",
          "distant sound of waves crashing"
        ],
        "smells": [
          "aromas of roasted meats",
          "freshly baked pastries",
          "hint of citrus from desserts",
          "scent of coffee brewing",
          "subtle fragrance of flowers"
        ],
        "tactile": [
          "cool porcelain plates",
          "smooth silverware in hand",
          "soft napkin against skin",
          "firm wooden chair backs",
          "the warmth of freshly cooked food"
        ]
      },
      "accessControl": "Open during meal times; staff-only access for kitchen and service areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light through rain-streaked windows",
            "cloudy reflections on the table",
            "wet outdoor garden visible"
          ],
          "sounds": [
            "soft rain pattering on the roof",
            "the hum of morning chatter",
            "occasional laughter"
          ],
          "smells": [
            "freshly brewed coffee",
            "baking bread",
            "the scent of wet earth"
          ],
          "mood": "calm yet introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows lengthening across tables",
            "fading light dimming the room",
            "condensation forming on glass"
          ],
          "sounds": [
            "the clatter of plates",
            "quiet conversations",
            "the creak of chairs being pushed back"
          ],
          "smells": [
            "the scent of herbs",
            "lingering aromas of previous meals",
            "citrus notes from desserts"
          ],
          "mood": "reflective unease"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight illuminating each table",
            "sparkling glassware catching the light",
            "the evening sky visible through the windows"
          ],
          "sounds": [
            "laughter echoing warmly",
            "the sound of wine being poured",
            "the soft strumming of a guitar in the background"
          ],
          "smells": [
            "rich aromas of dinner",
            "freshly baked bread",
            "the scent of wine"
          ],
          "mood": "suspenseful anticipation"
        }
      ],
      "paragraphs": [
        "The Dining Room of The Ocean View Hotel is a place where culinary delights meet the vastness of the ocean, creating a sensory experience that is both indulgent and intimate. Elegant chandeliers cast a warm glow over the tables, each adorned with crisp white linens and sparkling glassware. The sounds of laughter and clinking cutlery fill the air, mingling with the enticing aromas wafting from the kitchen. Yet, as guests savor their meals, a subtle tension lingers beneath the surface, as whispered conversations and sidelong glances hint at unspoken secrets among the diners.",
        "As the sun sets and the dining room fills with candlelight, the atmosphere becomes charged with anticipation. The large windows frame the ocean's tumultuous waves, a backdrop to the unfolding drama within. Guests exchange pleasantries while grappling with their own hidden agendas, each bite tasting of both sumptuous flavors and the bitterness of uncertainty. In this elegant space, the line between delight and dread blurs, setting the stage for the mysteries that lie ahead."
      ]
    },
    {
      "id": "guest_room",
      "name": "Guest Room 312",
      "type": "interior",
      "purpose": "Private space for guests",
      "visualDetails": "Cozy room with a view of the sea, vintage furnishings, and a writing desk.",
      "sensoryDetails": {
        "sights": [
          "soft pastel wallpaper",
          "framed seascape paintings",
          "plush armchair by the window",
          "antique writing desk",
          "ocean view through glass"
        ],
        "sounds": [
          "whispers of the wind",
          "distant crashing of waves",
          "soft ticking of a clock",
          "the rustle of fabric",
          "the creak of floorboards"
        ],
        "smells": [
          "fresh linen",
          "hint of lavender",
          "the scent of aging wood",
          "subtle perfume lingering in the air",
          "saltiness from the sea"
        ],
        "tactile": [
          "soft cotton sheets",
          "cool glass window panes",
          "the warmth of sunlight on skin",
          "rough texture of aged wood",
          "smooth surface of the writing desk"
        ]
      },
      "accessControl": "Locked when unoccupied; only accessible by the registered guest.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through curtains",
            "raindrops tracing patterns on glass",
            "misty view of the sea"
          ],
          "sounds": [
            "steady patter of rain",
            "soft sighs of the wind",
            "the hum of the hotel waking up"
          ],
          "smells": [
            "freshly brewed coffee from downstairs",
            "wet earth",
            "the scent of damp linen"
          ],
          "mood": "introspective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "cloudy reflections on the window",
            "faded colors of the room"
          ],
          "sounds": [
            "silence broken by distant laughter",
            "the creak of the building settling",
            "the hum of the heating system"
          ],
          "smells": [
            "dust in the air",
            "the scent of old books",
            "the faint aroma of tobacco"
          ],
          "mood": "melancholic reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling through the window",
            "shadows lengthening across the room",
            "the sea sparkling in the distance"
          ],
          "sounds": [
            "the distant sound of voices",
            "the soft rustle of the curtains",
            "the ticking of a clock"
          ],
          "smells": [
            "the scent of salt in the air",
            "the warmth of fresh linen",
            "a hint of perfume lingering"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "Guest Room 312 offers a sanctuary amid the chaos of The Ocean View Hotel, its vintage furnishings and pastel decor providing a sense of comfort. The plush armchair by the window invites guests to sit and gaze out at the ever-changing sea, while the antique writing desk stands ready for thoughts to be penned. Yet, despite its cozy appearance, the room holds an air of mystery, as if the walls harbor secrets waiting to be uncovered. The soft ticking of the clock echoes in the stillness, a reminder of time slipping away.",
        "In the evenings, the golden light spills into the room, casting long shadows that dance along the walls. The scent of salt and the distant sounds of laughter from the dining room filter in, creating an atmosphere that is both inviting and fraught with tension. The locked door provides a sense of safety, yet the whispers of the wind and the distant crashing of waves serve as a reminder that the outside world is never far away. In this intimate space, the line between solitude and suspense blurs, as the echoes of identity linger in the air."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "Rooftop Terrace",
      "type": "exterior",
      "purpose": "Observation and relaxation space for guests",
      "visualDetails": "Open terrace with panoramic ocean views, wrought iron railings, and scattered seating.",
      "sensoryDetails": {
        "sights": [
          "panoramic views of the sea",
          "white-capped waves crashing below",
          "clouds rolling over the horizon",
          "wrought iron railings",
          "faded deck chairs"
        ],
        "sounds": [
          "howling wind",
          "distant calls of seagulls",
          "waves crashing against the cliffs",
          "the rustle of fabric from guests' clothing",
          "the creaking of the terrace"
        ],
        "smells": [
          "salt air",
          "fresh sea breeze",
          "the scent of damp wood",
          "faint whiff of sunscreen",
          "the aroma of flowers from nearby gardens"
        ],
        "tactile": [
          "rough texture of wrought iron",
          "coolness of the sea breeze",
          "warmth of the sun on skin",
          "smooth surface of wooden benches",
          "the chill of the evening air"
        ]
      },
      "accessControl": "Restricted during inclement weather; accessible to guests when open.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "mist obscuring the view",
            "raindrops on the railings",
            "grey clouds overhead"
          ],
          "sounds": [
            "heavy rain drumming on the terrace",
            "soft whispers of guests huddled together",
            "the distant rumble of thunder"
          ],
          "smells": [
            "damp earth",
            "fresh rain on wood",
            "the scent of wet flowers"
          ],
          "mood": "gloomy isolation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "clouds hanging low",
            "dim light casting shadows",
            "the churning sea below"
          ],
          "sounds": [
            "the rustle of wind through the railings",
            "the muted sound of waves",
            "distant conversations from below"
          ],
          "smells": [
            "the scent of salt lingering",
            "the aroma of damp wood",
            "the faint smell of flowers"
          ],
          "mood": "reflective melancholy"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the sky",
            "stars beginning to twinkle",
            "the ocean shimmering in twilight"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the rustle of clothing in the wind"
          ],
          "smells": [
            "fresh sea air",
            "the scent of blooming flowers",
            "the warmth of the setting sun"
          ],
          "mood": "romantic tension"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace of The Ocean View Hotel offers a breathtaking vantage point over the turbulent sea, its wrought iron railings framing the panoramic views. Guests gather here to escape the confines of the hotel, but the open space also serves as a stage for whispered conversations and clandestine meetings. The scent of salt air mingles with the faint aroma of blooming flowers from the nearby gardens, creating a sensory experience that is both invigorating and fraught with tension. As the wind howls and the waves crash below, the terrace becomes a place where identities can shift and secrets can be shared under the cover of the vast sky.",
        "As evening settles in and the sun begins to dip below the horizon, the terrace transforms into a space of romantic tension. The sky is painted with hues of orange and pink, while the first stars begin to twinkle overhead. Laughter mingles with the sounds of the ocean, but there is an underlying current of unease, as guests exchange glances and half-formed thoughts. The chill of the evening air carries whispers of secrets yet to be unveiled, and the terrace, once a place of relaxation, becomes a backdrop for the unfolding mystery, where every shadow could conceal a truth waiting to be uncovered."
      ]
    }
  ],
  "note": "",
  "cost": 0.00260530545,
  "durationMs": 58715
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "February",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "Foggy mornings with low visibility",
      "Occasional drizzles and light rain",
      "Chilly winds coming off the coast"
    ],
    "daylight": "Short days with sunlight peeking through thick clouds, dusk settling around 5 PM",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the fog thickens",
    "holidays": [
      "Valentine's Day (February 14)"
    ],
    "seasonalActivities": [
      "Strolling through the coastal promenade, wrapped in winter coats",
      "Attending local theater performances indoors",
      "Gathering around radios for the latest news and entertainment programs"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Double-breasted wool suits in navy or charcoal",
        "White dress shirts with wide collars",
        "Fedoras and overcoats for evening outings"
      ],
      "casual": [
        "Tweed blazers paired with slacks",
        "Knitted sweaters with crew necks",
        "Chinos and loafers for a relaxed look"
      ],
      "accessories": [
        "Leather gloves and scarves for warmth",
        "Pocket watches",
        "Brimmed hats"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea-length dresses with cinched waists and full skirts",
        "Fur stoles and tailored jackets",
        "High-neck blouses under fitted cardigans"
      ],
      "casual": [
        "Wool skirts paired with turtlenecks",
        "Dresses with floral prints for daytime outings",
        "Practical ankle boots"
      ],
      "accessories": [
        "Wide-brimmed hats adorned with ribbons",
        "Elegant gloves",
        "Pearl necklaces or brooches"
      ]
    },
    "trendsOfTheMoment": [
      "Emphasis on tailored clothing reflecting post-war elegance",
      "Use of bold colors and patterns in fabrics",
      "Re-emergence of vintage styles from the 1920s and 1930s"
    ],
    "socialExpectations": [
      "Men expected to be career-focused and providers",
      "Women increasingly taking on roles in the workforce",
      "Social gatherings centered around home and community events"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Tensions rising in Eastern Europe with the onset of the Cold War",
      "The Marshall Plan continuing to shape European recovery",
      "The first session of the UN General Assembly taking place in New York"
    ],
    "politicalClimate": "A growing divide between the West and Soviet Union, marked by political maneuvering and propaganda",
    "economicConditions": "Post-war recovery is uneven, with inflation on the rise affecting daily life",
    "socialIssues": [
      "Struggles for civil rights gaining traction in the U.S.",
      "The role of women in society evolving as many continue to work post-war",
      "Concerns about housing shortages in urban areas"
    ],
    "internationalNews": [
      "The establishment of the state of Israel becoming a point of contention",
      "Growing conflicts in the Middle East as colonial powers withdraw",
      "Increased focus on anti-communism in U.S. domestic policy"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Nat King Cole's romantic ballads",
        "Doris Day's upbeat tunes",
        "Bing Crosby's classic standards"
      ],
      "films": [
        "The Treasure of the Sierra Madre (1948)",
        "The Red Shoes (1948)",
        "Hamlet (1948)"
      ],
      "theater": [
        "Broadway shows like 'Annie Get Your Gun'",
        "Local productions of classic plays",
        "Vaudeville-style performances in smaller venues"
      ],
      "radio": [
        "Suspense dramas captivating evening listeners",
        "Quiz shows gaining popularity",
        "News broadcasts providing updates on international affairs"
      ]
    },
    "literature": {
      "recentPublications": [
        "1984 by George Orwell (published in 1949)",
        "The Naked and the Dead by Norman Mailer (1948)",
        "The Catcher in the Rye by J.D. Salinger (published in 1951)"
      ],
      "popularGenres": [
        "Post-war fiction exploring human resilience",
        "Mystery and detective novels gaining traction",
        "Science fiction reflecting Cold War anxieties"
      ]
    },
    "technology": {
      "recentInventions": [
        "The transistor, paving the way for future electronics",
        "The development of early computers like ENIAC",
        "Advancements in aviation technology with jet propulsion"
      ],
      "commonDevices": [
        "Radios as central entertainment in homes",
        "Early television sets becoming more common in urban areas",
        "Basic household appliances like refrigerators and washing machines"
      ],
      "emergingTrends": [
        "Increased use of consumer electronics",
        "Growing interest in public health and hygiene",
        "Expansion of automobile ownership"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: three pence",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "Gathering at local pubs for drinks and conversation",
        "Attending community dances or social clubs",
        "Watching films at the local cinema"
      ],
      "socialRituals": [
        "Sunday family dinners as a tradition",
        "Community meetings addressing local issues",
        "Valentine's Day celebrations with cards and small gifts"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "A growing middle class emerging post-war",
      "Class distinctions still pronounced, particularly in urban settings"
    ],
    "gender": [
      "Women increasingly demanding equal rights in the workplace",
      "Traditional gender roles challenged but still prevalent",
      "Expectation of marriage and family for women remains strong"
    ],
    "race": [
      "Racial segregation and discrimination still a major issue in the U.S.",
      "Emerging voices advocating for civil rights and equality"
    ],
    "generalNorms": [
      "Conformity to social expectations while seeking personal identity",
      "Community and family values emphasized in public life",
      "Growing skepticism towards government and authority figures"
    ]
  },
  "atmosphericDetails": [
    "The sound of rain tapping against the fogged window panes adds a layer of tension to the air.",
    "The faint aroma of damp earth and woodsmoke mingles with the rich scent of cigars from the hotel's lounge.",
    "A distant radio crackles, broadcasting the latest news, punctuating the muffled conversations that linger in the smoke-filled rooms."
  ],
  "paragraphs": [
    "February 1948 in a coastal hotel finds the air thick with fog, the kind that wraps the world in a muted embrace. Rain drizzles intermittently, creating a glistening sheen on the streets and a chill in the air that prompts patrons to huddle closer in the dimly lit lounges. Valentine's Day has just passed, yet the atmosphere remains charged with unspoken fears and desires, a reflection of the post-war uncertainties that linger like the dense mist outside. The sound of rain is almost hypnotic, lulling some into a false sense of security while others remain on edge, their minds racing with thoughts of the shifting political landscape and the specter of the Cold War looming large.",
    "As the hotel bustles with life, fashion reflects the era's blend of elegance and practicality. Men don double-breasted suits in dark tones, their attire meticulously tailored, while women float through the halls in tea-length dresses adorned with floral patterns, their waists cinched by delicate belts. Fedoras and gloves are the order of the evening, adding to the sophistication of the scene, while the flicker of the overhead lights catches the sheen of well-polished shoes, creating a tableau of post-war style. The laughter and chatter of guests are punctuated by the occasional clinking of glasses, as couples gather to share stories and flirtations amid the shadows.",
    "Daily life in February 1948 is shaped by a complex fabric of social expectations and evolving norms. With inflation affecting everything from the price of bread to the cost of a taxi ride, the struggles of the working class are palpable in the conversations overheard in the hotel lobby. Yet, there is also a spirit of resilience, a determination to forge ahead in a world that feels both familiar and foreign. The rituals of life continue, from Sunday dinners spent with family to community gatherings discussing the pressing issues of the day. The air is thick with anticipation; people are adjusting to new realities, grappling with their identities in a rapidly changing world as they seek solace in the warmth of human connection."
  ],
  "note": "",
  "cost": 0.00127886385,
  "durationMs": 23425
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A seaside hotel hosts a gathering of war-weary guests and staff, where the tensions of post-war life and shifting gender roles create an environment ripe for intrigue and deception.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has led to women stepping into roles traditionally held by men, creating class tensions among the guests and staff, while the looming Cold War adds an air of paranoia."
  },
  "setting": {
    "location": "A classic seaside hotel perched on a cliffside overlooking the ocean.",
    "institution": "Hotel",
    "weather": "Foggy with occasional rain, typical of coastal climates in the 1940s."
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
    "value": "ten minutes past eight",
    "description": "The exact time the gramophone was set to play, masking the moment of death."
  },
  {
    "id": "door_thickness",
    "value": "two inches",
    "description": "The thickness of the soundproof door, critical for understanding the acoustic isolation."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 5,
    "mid": 13,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
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
      "placement": "mid",
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
      "placement": "mid",
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
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
