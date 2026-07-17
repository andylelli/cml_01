# Actual Prompt Record

- Run ID: `mystery-1784233999360`
- Project ID: ``
- Timestamp: `2026-07-16T20:37:36.402Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `e1b14344c74aeab2`

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
    "title": "Shadows of Authority",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "poisoning"
    }
  },
  "death_method": "shot",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "sharp and observant",
      "private_secret": "a past scandal",
      "motive_seed": "justice",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "solving the case",
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
      "public_persona": "respected physician",
      "private_secret": "involved in a medical scandal",
      "motive_seed": "blackmail",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "personal reputation",
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
      "public_persona": "seasoned naval officer",
      "private_secret": "suffers from PTSD",
      "motive_seed": "loyalty",
      "motive_strength": "weak",
      "alibi_window": "limited",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation and honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "socialite",
      "private_secret": "in love with Dr. Finch",
      "motive_seed": "jealousy",
      "motive_strength": "strong",
      "alibi_window": "medium",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "emotional attachment",
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
      "public_persona": "new hotel employee",
      "private_secret": "involved in illegal activities",
      "motive_seed": "financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "limited",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "job security",
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
      "public_persona": "wealthy businessman",
      "private_secret": "involved in shady dealings",
      "motive_seed": "financial gain",
      "motive_strength": "strong",
      "alibi_window": "wide",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "financial empire",
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
      "summary": "In the glamorous setting of a seaside hotel, the murder of Dr. Mallory Finch reveals a web of deceit and impersonation. Detective Eleanor Voss uncovers the truth behind the masquerade that obscured the real killer's identity."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A cunning impersonation using a tailored outfit allows the killer to appear in two places, creating a false alibi.",
      "delivery_path": [
        {
          "step": "The killer uses a costume to impersonate Dr. Finch."
        },
        {
          "step": "The impersonator meets witnesses, establishing an alibi."
        }
      ]
    },
    "outcome": {
      "result": "The killer is able to escape suspicion while appearing to be in another location."
    }
  },
  "false_assumption": {
    "statement": "The killer was not present at the time of the murder due to their established alibi.",
    "type": "authority",
    "why_it_seems_reasonable": "Witnesses confirm seeing the killer at a different part of the hotel.",
    "what_it_hides": "The killer's use of impersonation to create a false alibi."
  },
  "false_solution": {
    "accused_suspect": "Hugo Vane",
    "supporting_points": [
      "He was seen arguing with Dr. Finch earlier, leading to a motive.",
      "His presence near the scene of the crime raises suspicions."
    ],
    "the_one_flaw": "Hugo Vane's alibi is confirmed by multiple witnesses who saw him in another location.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A strange, loud argument was heard near the victim's room.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was between two other guests, not involving Hale.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A piece of fabric matching the killer's costume was found in the courtyard.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "Beatrice was wearing a different costume entirely, which is confirmed by witnesses.",
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
    "rationale": "All suspects are guests or employees of the hotel, eliminating outsiders."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The murder occurs at ten minutes past nine."
      ],
      "windows": [
        "Witnesses claim to have seen the killer at nine."
      ],
      "contradictions": [
        "Witness statements conflict about who was seen at which time."
      ]
    },
    "access": {
      "actors": [
        "Only hotel staff and guests had access to the victim's room."
      ],
      "objects": [
        "The murder weapon was a revolver found near the beach."
      ],
      "permissions": [
        "Certain areas of the hotel are restricted to staff only."
      ]
    },
    "physical": {
      "laws": [
        "The hotel has strict security protocols for entry."
      ],
      "traces": [
        "Footprints found lead towards the beach."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust hotel staff to maintain order."
      ],
      "authority_sources": [
        "The hotel manager holds authority over operations."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses saw a man in a tailored suit near the victim's room shortly before the murder.",
        "correction": "The tailored suit indicates someone was impersonating Dr. Finch.",
        "effect": "Eliminates the possibility that the real Dr. Finch was present.",
        "required_evidence": [
          "Witness statements confirming the tailored suit.",
          "Footprints leading away from the scene."
        ],
        "reader_observable": true
      },
      {
        "observation": "A piece of fabric from the killer's costume was found near the victim's body.",
        "correction": "The fabric matches the costume used for impersonation.",
        "effect": "Narrows the suspect pool to those who had access to the costume.",
        "required_evidence": [
          "Fabric type identified as part of the killer's outfit.",
          "Witnesses recalling the appearance of the impersonator."
        ],
        "reader_observable": true
      },
      {
        "observation": "The hotel clock was found to be tampered with, showing a different time.",
        "correction": "This indicates the killer manipulated the timeline to create an alibi.",
        "effect": "Tightens the focus on suspects with the opportunity to alter the clock.",
        "required_evidence": [
          "Evidence of tampering found on the clock.",
          "Witness statements about the clock's unusual behavior."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Reenact witnesses to compare their accounts of seeing the tailored suit and the clock's time discrepancies.",
    "knowledge_revealed": "The revealed facts are timelin, present, and witness.",
    "pass_condition": "If the timelines match, the real killer's alibi collapses.",
    "evidence_clues": [
      "clue_1",
      "clue_6",
      "clue_11",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The tailored suit evidence (early) and witness accounts (mid) lead the reader to suspect impersonation. Step 2: The fabric clue (mid) underscores the impersonation method. Step 3: The tampered clock (discriminating test) proves the fabricated alibi."
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
        "Observe the witnesses' reactions",
        "Draw conclusion about guilt"
      ],
      "test_type": "witness reenactment"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed he was with another guest during the murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed she was in the staff area at the time.",
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
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: wide",
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_8",
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
        "clue_id": "clue_early_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Evidence reveal"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, the charming innkeeper, finds herself entangled in a web of regret and jealousy following the murder of a former lover.",
    "publicPersona": "Charming and resourceful, Eleanor runs a cozy seaside inn that attracts travelers and locals alike.",
    "privateSecret": "Eleanor had a brief affair with the victim, which ended in bitterness and jealousy.",
    "motiveSeed": "Fears that her past with the victim could ruin her inn's reputation if exposed.",
    "motiveStrength": "moderate",
    "alibiWindow": "was at the front desk during the incident, but no one can confirm her exact timing.",
    "accessPlausibility": "easy",
    "stakes": "Protecting her business and reputation.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks in a warm, inviting tone, often punctuating her sentences with gentle sarcasm. She has a tendency to ask rhetorical questions, leading her listeners to conclusions.",
    "signatureTic": "Well, isn’t that just the way of things?",
    "internalConflict": "Eleanor grapples with guilt over her affair and the fear that her past will overshadow her future.",
    "personalStakeInCase": "The murder threatens not only her reputation but the very foundation of her business, which she has built with love.",
    "paragraphs": [
      "Eleanor Voss stood behind the polished oak counter of her inn, her fingers tracing the familiar grooves of the wood as she watched the waves crash against the shore. The salty air filled her lungs, but it did little to soothe the storm brewing inside her. She was charming to her guests, a beacon of warmth amidst the chill of the coastal winds, but beneath her sunny exterior lay a tangled web of regret and bitterness — a past she desperately wished to bury.",
      "Her affair with the victim had been a brief but intense flame, igniting her heart with passion and then dousing it with jealousy. Eleanor had never expected to find herself captivated by someone like her, yet here she was, haunted by memories of stolen kisses and whispered promises. Now, with the woman dead and the whispers of scandal in the air, Eleanor feared the grip of her past would strangle her present. What would her guests think if they ever learned the truth?",
      "As she moved about the inn, greeting guests and arranging flowers, Eleanor's thoughts drifted to the investigation unfolding around her. She had taken it upon herself to uncover the truth, driven by a need to protect her business. If her past came to light, it would not only tarnish her reputation but also threaten the livelihood of her staff and the community she cherished. She could not allow that to happen, not while she still had breath in her lungs.",
      "But as she navigated the treacherous waters of suspicion and secrets, Eleanor found herself wrestling with her own demons. Could she truly be the hero of this tale, or was she destined to be the villain in her own story? Each step she took towards the truth felt like a step deeper into darkness, forcing her to confront the very feelings she had tried to suppress. Would she emerge unscathed, or would the revelations of the past consume her?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, struggles with jealousy and betrayal following the murder of her former lover.",
    "publicPersona": "Respected doctor known for her stern demeanor and high standards.",
    "privateSecret": "Malory was in love with the victim and was deeply hurt when she discovered the victim's affair with Eleanor.",
    "motiveSeed": "Believes the victim's betrayal undermined her professional reputation among peers.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in her office seeing patients, but records are incomplete.",
    "accessPlausibility": "possible",
    "stakes": "Restoring her status in the medical community.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory speaks with precision, her words deliberate and clipped. She tends to avoid small talk, preferring to get straight to the point, often using medical jargon that reflects her professional background.",
    "signatureTic": "We mustn't dwell on the past.",
    "internalConflict": "Mallory is tormented by feelings of inadequacy and jealousy, struggling with the impact of her emotions on her professional life.",
    "personalStakeInCase": "The murder threatens to expose her vulnerabilities and jeopardize her hard-earned reputation in the medical field.",
    "paragraphs": [
      "Dr. Mallory Finch sat in her office, the faint smell of antiseptic mixing with the weight of her thoughts. Her fingers tapped rhythmically against the polished surface of her desk, a nervous habit she had never quite managed to shake. She was a respected physician, known for her high standards and unyielding demeanor, yet the news of the victim's death had shattered her composure. Memories of their clandestine romance flooded her mind, each one tinged with bitterness and betrayal.",
      "Mallory had always prided herself on her professionalism, but the discovery of the victim's affair with Eleanor had cut deep. It was a wound that festered, gnawing at her confidence and leaving her questioning her worth in a male-dominated field. How could she possibly regain her standing among peers when the whispers of scandal loomed overhead? The thought was unbearable, and with each passing moment, her resolve to confront the truth weakened.",
      "As the investigation unfolded, Mallory found herself caught in a maelstrom of emotions. She had loved the victim fiercely, but that love had morphed into a bitter resentment, a toxic cocktail that clouded her judgment. She wanted to believe that the betrayal was merely a fleeting mistake, yet the reality was far more painful: the woman she had adored had chosen another. And now, with the specter of murder hanging over her, Mallory was left to confront the implications of her own jealousy.",
      "Determined to restore her reputation, Mallory resolved to uncover the truth behind the murder. But as she delved deeper into the investigation, she faced an unsettling question: was she willing to sacrifice everything she had built for the sake of revenge? The line between justice and vengeance blurred, and Mallory found herself at a crossroads, battling the demons of her own making. Would she emerge as a paragon of virtue or succumb to the darkness that threatened to consume her?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, grapples with the remnants of a past romance while navigating the complexities of betrayal and revenge.",
    "publicPersona": "Charming, with a storied past; Ivor is known for his naval heroics.",
    "privateSecret": "He has been harboring feelings for the victim since their brief romance ended.",
    "motiveSeed": "Believes the victim's betrayal with Eleanor shattered his dreams of rekindling their relationship.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was playing cards with other guests, but their accounts vary.",
    "accessPlausibility": "possible",
    "stakes": "Seeking closure and revenge for perceived betrayal.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a commanding presence, his words laced with a sardonic humor that often disarms his listeners. He has a tendency to weave nautical metaphors into his conversation, reflecting his naval background.",
    "signatureTic": "Ahoy there, my friend!",
    "internalConflict": "Ivor struggles to reconcile his lingering feelings for the victim with the reality of their broken relationship, leading to feelings of anger and betrayal.",
    "personalStakeInCase": "The murder of the victim threatens to leave him with unresolved emotions and a sense of loss that he cannot afford to ignore.",
    "paragraphs": [
      "Captain Ivor Hale leaned back in his chair, a half-finished glass of whiskey resting in his hand. The dim light of the inn flickered like the memories that danced in his mind — memories of a woman who had once captivated his heart. He had been a naval officer, a man of honor and valor, yet here he was, ensnared by the shadows of a past romance that refused to let him go.",
      "The victim had been his muse, a siren whose call had lured him into a tempest of passion and despair. Their brief affair had ended in turmoil, leaving Ivor with a bitter taste of betrayal as he watched her drift into the arms of another. Eleanor Voss, the charming innkeeper, had stolen what he believed was rightfully his. Now, with the victim dead, Ivor was left to grapple with the wreckage of his heart and the desire for revenge that simmered just beneath the surface.",
      "As the investigation unfolded, Ivor found himself drawn into a world of suspicion and intrigue. He had been playing cards with guests during the time of the murder, but the accounts of his alibi were as murky as the waters he once sailed. He felt like a ship adrift, caught in a storm of his own making, and the stakes were higher than ever. Closure was a distant shore, and he was determined to reach it, even if it meant confronting the ghosts of his past.",
      "Yet, as Ivor navigated the treacherous waters of jealousy and betrayal, he found himself questioning his own motives. Was he seeking justice for the victim, or was he merely trying to soothe his wounded pride? The line between vengeance and righteousness blurred, and Ivor realized that the only way to find peace was to confront the truth — both about the murder and about himself. Would he emerge from the shadows of authority as a man renewed, or would the weight of his past drag him down into the depths?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an aspiring writer, grapples with envy and ambition against the backdrop of a shocking murder.",
    "publicPersona": "Eager and bright, Beatrice is a young writer looking to make a name for herself.",
    "privateSecret": "She idolized the victim and felt overshadowed by her success, leading to resentment.",
    "motiveSeed": "Felt that the victim's death would allow her to claim the spotlight and a potential lucrative book deal.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be in her room writing but did not have anyone to confirm her story.",
    "accessPlausibility": "possible",
    "stakes": "A chance at literary fame and validation.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks with an eager enthusiasm, often punctuating her thoughts with self-deprecating humor. She has a tendency to ramble when excited, sometimes losing her train of thought.",
    "signatureTic": "I’m just a humble writer, after all.",
    "internalConflict": "Beatrice is torn between her admiration for the victim and her envy, struggling with the ethics of her ambitions.",
    "personalStakeInCase": "The murder presents a twisted opportunity for Beatrice to step into the limelight she has long desired, but at what cost?",
    "paragraphs": [
      "Beatrice Quill sat at her desk, surrounded by crumpled pages and ink-stained fingers, her mind racing with thoughts of fame and fortune. As an aspiring writer, she had always dreamed of crafting a novel that would capture the hearts of readers, yet the shadow of the victim loomed large over her aspirations. The woman had been a literary icon, a beacon of success that Beatrice had idolized — and resented — in equal measure.",
      "The news of the victim's murder struck Beatrice like a thunderclap, sending her thoughts spiraling into a tumultuous sea of ambition and guilt. Could it be that this tragedy might clear the way for her own success? She felt a pang of shame at the thought, but the notion of stepping into the spotlight, of finally being recognized, was intoxicating. The whispers of envy twisted in her mind, urging her to embrace the darkness lurking just beneath the surface.",
      "As the investigation unfolded, Beatrice found herself caught between admiration and resentment, struggling to navigate the murky waters of her own ambition. She had claimed to be writing in her room during the murder, but with no one to corroborate her story, doubts began to creep in. What if her desire for validation had clouded her judgment? Was she merely a bystander in this tragedy, or did her ambitions run deeper than she dared to admit?",
      "With each passing day, Beatrice felt the weight of her conscience pressing down on her. The murder had opened doors she had long thought were closed, but at what cost? As she grappled with her own motives, she realized that the true story lay not just in the murder itself, but in the ethical dilemmas that accompanied her ambitions. Would she seize the opportunity before her, or would she allow her conscience to guide her towards a more honorable path?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a wealthy socialite, navigates the delicate balance of manipulation and ambition in the wake of a shocking murder.",
    "publicPersona": "Wealthy and influential, Sylvia is known for her social prowess and charm.",
    "privateSecret": "She was using the victim's affair with Ivor to manipulate relationships for her own gain.",
    "motiveSeed": "Could benefit from the victim's absence in social circles to further her own ambitions.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was at a party nearby, but exact details are vague.",
    "accessPlausibility": "unlikely",
    "stakes": "Strengthening her social position and influence.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a polished eloquence, her words carefully chosen to convey both charm and manipulation. She often employs a subtle, cutting wit that keeps her listeners on their toes.",
    "signatureTic": "Well, that's simply delightful, isn't it?",
    "internalConflict": "Sylvia is torn between her desire for power and the consequences of her manipulative actions, questioning whether her ambitions are worth the cost.",
    "personalStakeInCase": "The murder presents an opportunity to solidify her position in social circles, but it also forces her to confront the ethics of her ambitions.",
    "paragraphs": [
      "Sylvia Trent glided through the opulent rooms of the inn, her presence commanding attention without uttering a word. A wealthy socialite with a keen understanding of power dynamics, she was known for her charm and strategic relationships. But beneath her polished exterior lay a web of manipulation that had ensnared many, including the victim — a pawn in Sylvia's game of social chess.",
      "The news of the murder sent ripples through the social circles Sylvia navigated with ease. She had been using the victim's affair with Captain Ivor Hale to manipulate relationships, positioning herself as the go-to confidante for both parties. Now, with the victim dead, Sylvia felt a mix of exhilaration and trepidation. The absence of the victim could open doors for her, allowing her to ascend to new heights in the social hierarchy.",
      "Yet, as she mingled with guests and orchestrated conversations, Sylvia wrestled with the consequences of her actions. Her alibi was flimsy, a party nearby that lacked concrete details, and the looming specter of suspicion cast a shadow over her ambitions. Was the price of power worth the risk of exposure? Each smile she offered felt like a mask, hiding the turmoil that brewed beneath the surface.",
      "As the investigation progressed, Sylvia found herself at a crossroads, forced to confront the ethics of her ambitions. The murder presented an opportunity to strengthen her position, but it also challenged her to reflect on the lengths she was willing to go for power. Would she continue to manipulate those around her, or would she embrace a more honorable path? The game of influence was treacherous, but Sylvia was determined to emerge victorious, no matter the cost."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a cynical journalist, faces a moral dilemma as he navigates the murky waters of truth and reputation in the wake of a murder.",
    "publicPersona": "Outspoken and critical, Hugo is known for his investigative reporting.",
    "privateSecret": "Hugo was secretly investigating the victim for a story on her past, which could have ruined her reputation.",
    "motiveSeed": "Could publish a damning story on the victim's past should she threaten him with exposure.",
    "motiveStrength": "strong",
    "alibiWindow": "Was interviewing another guest at the time, but the guest's account is shaky.",
    "accessPlausibility": "possible",
    "stakes": "Protecting his career and avoiding scandal.",
    "humourStyle": "blunt",
    "humourLevel": 0.7,
    "speechMannerisms": "Hugo speaks in a direct, no-nonsense manner, often cutting through pleasantries with sharp observations. He has a tendency to make biting remarks, often using sarcasm to express his cynicism.",
    "signatureTic": "Truth is a slippery fish.",
    "internalConflict": "Hugo grapples with the moral implications of his investigative pursuits, questioning whether the truth is worth the potential destruction of lives.",
    "personalStakeInCase": "The murder could expose his own secrets, putting his career and reputation on the line.",
    "paragraphs": [
      "Hugo Vane leaned against the bar, a glass of scotch in hand, his sharp gaze scanning the room for any sign of a story. As a journalist known for his unflinching investigations, he had built a reputation on exposing the truth, no matter the cost. But the murder of the victim had thrown him into a moral quandary, one that threatened to unravel everything he had worked for.",
      "He had been secretly investigating the victim for a story that could have tarnished her reputation, a piece that would have sent shockwaves through the community. Now, with her dead, the stakes were higher than ever. If anyone discovered his intentions, it could spell disaster for his career. The thought made his stomach churn, and he found himself questioning the very principles he had once held dear.",
      "As the investigation unfolded, Hugo's alibi was as shaky as a house of cards — he had been interviewing another guest at the time, but the details were murky at best. The pressure mounted as he navigated the delicate balance between seeking the truth and protecting his own interests. Would he be able to reconcile his journalistic integrity with the fear of exposure? Or would he succumb to the temptation to bury his secrets in the name of self-preservation?",
      "With each passing day, the weight of his choices pressed down on him. The murder was not just a story to be reported; it was a reflection of the moral decay he had witnessed in his own life. Hugo had to decide whether to pursue the truth, potentially costing him everything, or to protect his own interests at the expense of others. The slippery fish of truth was elusive, but he knew that the consequences of his next move could change everything."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Clifftop Haven",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand Art Deco hotel perched on the cliffs of Brighton, with sweeping views of the turbulent sea.",
    "visualDescription": "The hotel boasts a sleek silhouette, with large bay windows framed by chrome and glass, reflecting the moody skies. A central courtyard, lined with palm trees and vibrant flowers, contrasts with the stormy backdrop of the ocean.",
    "atmosphere": "A palpable tension wrapped in elegance, as guests navigate unspoken suspicions amidst the luxury.",
    "paragraphs": [
      "The Clifftop Haven stands defiantly against the crashing waves below, its Art Deco façade gleaming even under the overcast skies. Large windows overlook the tumultuous sea, offering a stark reminder of nature's power. Inside, the polished marble floors and plush velvet furnishings create an air of opulence, yet whispers of unease linger in the corners. Shadows dance along the walls, as the flicker of candlelight struggles against the encroaching gloom outside.",
      "In the central courtyard, palm trees sway gently, their fronds rustling in the chilly breeze that carries the scent of salt and damp earth. The sound of distant thunder rumbles ominously, echoing the growing tension among the guests. Conversations are hushed, glances exchanged furtively, as if each person is aware of the secrets that loom like a storm cloud over them. With the rain beginning to fall, the atmosphere grows thick with apprehension.",
      "As night falls, the hotel transforms. The glow of gas lamps casts a warm, inviting light, but the shadows deepen, creating pockets of isolation. The distant crash of waves mixes with the soft crackling of the fireplace, while the scent of tobacco and damp wood lingers in the air. Each guest feels the weight of suspicion, as unspoken truths hang just out of reach, waiting for the right moment to surface."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates",
    "timeFlow": "A weekend of mounting tension and hidden agendas",
    "mood": "tense and anxious, with underlying currents of suspicion among the guests",
    "eraMarkers": [
      "Art Deco architecture and design",
      "Early radio broadcasts in the lounge",
      "Rationed fuel affecting travel plans",
      "Women in the workforce as hotel staff"
    ],
    "sensoryPalette": {
      "dominant": "the briny scent of the sea",
      "secondary": [
        "soft rustle of palm leaves",
        "crackling of the fireplace"
      ]
    },
    "paragraphs": [
      "The atmosphere at The Clifftop Haven is thick with unspoken tension, as the guests navigate the opulent yet claustrophobic spaces. The distant sound of thunder adds to the weight of expectation, while the briny scent of the sea mingles with the aromas of fine dining and damp wool. Every creak of the floorboards feels amplified, a reminder that secrets lurk just beneath the surface.",
      "The hotel serves as both a refuge and a prison, isolated by its cliffside location. With stormy weather limiting access and creating a sense of entrapment, the guests are left to confront their suspicions and fears. The flicker of candlelight casts long shadows, creating a foreboding atmosphere that pervades every corner, as if the very walls are listening to their whispered confessions."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Rooftop Terrace",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "An open terrace with a panoramic view, surrounded by a low wrought-iron railing, with scattered chairs and a small table, now overturned.",
      "sensoryDetails": {
        "sights": [
          "overturned chair on the terrace",
          "dark clouds rolling in",
          "flickering lanterns",
          "crimson stains on the white stone",
          "jagged cliffs below"
        ],
        "sounds": [
          "distant thunder rumbling",
          "waves crashing against the rocks",
          "sudden gusts rattling the railing",
          "footsteps on wet stone"
        ],
        "smells": [
          "fresh rain mingling with salt",
          "blood and damp earth",
          "smoky remnants of a recent fire",
          "scent of wet metal",
          "faint perfume lingering"
        ],
        "tactile": [
          "cold iron railing",
          "smooth wet stone",
          "chill of the coastal breeze",
          "rough texture of the overturned chair",
          "dampness of the air"
        ]
      },
      "accessControl": "Restricted access; only staff with rooftop keys can enter at night; guests may access during daylight hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on the railing",
            "grey light filtering through clouds",
            "mist rising from the sea",
            "puddles forming on the stone",
            "blurred horizon"
          ],
          "sounds": [
            "steady drumming of rain",
            "distant gulls calling",
            "soft splashes on stone",
            "whispers of wind",
            "echoing footsteps"
          ],
          "smells": [
            "wet stone and seaweed",
            "fresh rain on sand",
            "damp foliage",
            "mildew from the corners",
            "scent of wet wool"
          ],
          "mood": "oppressive and heavy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey skies",
            "shadows lengthening across the terrace",
            "dark waves churning below",
            "faded furniture against the backdrop",
            "clouds threatening rain"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "the creak of the railing",
            "waves rhythmically crashing",
            "the flutter of loose papers",
            "a distant clock chiming"
          ],
          "smells": [
            "salt and damp wood",
            "decaying leaves",
            "smoky remnants of a fire",
            "old iron",
            "faint scent of bitter herbs"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting orange hues",
            "long shadows stretching across the terrace",
            "stars beginning to twinkle",
            "glimmering ocean under moonlight",
            "soft glow of lanterns"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "distant laughter from the courtyard",
            "the soft rustle of leaves",
            "the tick of a clock from inside",
            "footsteps echoing"
          ],
          "smells": [
            "freshly brewed coffee",
            "scent of jasmine in the air",
            "smoky wood from the fireplace",
            "citrus from cocktails",
            "the lingering scent of salt"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace, once a serene escape, has transformed into a scene of chaos. An overturned chair lies near the edge, the railing glistening with rain. The distant rumble of thunder rolls ominously, blending with the crash of waves against the jagged rocks below. The air is thick with the scent of salt and damp earth, a stark contrast to the vibrant hues of the sunset that struggles to break through the clouds. Shadows stretch across the cold stone, creeping ever closer to the edge.",
        "As the evening deepens, the atmosphere becomes charged with tension. The flickering lanterns cast dancing shadows, while the scent of freshly brewed coffee wafts from below, a reminder of the warmth that exists just out of reach. Each gust of wind carries whispers of secrets long buried, as guests peer nervously over the railing, glancing at the churning sea below, wondering what lies beneath the surface of their own carefully curated façades."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A grand room with Art Deco furnishings, featuring plush sofas and a large fireplace, adorned with intricate murals.",
      "sensoryDetails": {
        "sights": [
          "plush velvet armchairs",
          "gleaming brass fixtures",
          "murals depicting seaside scenes",
          "dark wood paneling",
          "flickering firelight"
        ],
        "sounds": [
          "soft jazz playing on the radio",
          "the crackle of the fireplace",
          "laughter echoing from guests",
          "clinking of glasses",
          "the rustle of newspaper pages"
        ],
        "smells": [
          "rich tobacco smoke",
          "warmth of burning wood",
          "scent of polished leather",
          "freshly brewed tea",
          "subtle perfume"
        ],
        "tactile": [
          "soft velvet upholstery",
          "warmth radiating from the fire",
          "smooth brass knobs",
          "cool marble tabletop",
          "textured wallpaper"
        ]
      },
      "accessControl": "Open to all guests; monitored by staff to maintain decorum.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through curtains",
            "drops sliding down window panes",
            "misty outlines of furniture",
            "faded colors in the daylight",
            "shadows shifting with the light"
          ],
          "sounds": [
            "soft patter of rain against glass",
            "muffled conversations",
            "the rustle of newspapers",
            "the hum of the radio",
            "the crackle of a fire"
          ],
          "smells": [
            "freshly brewed coffee",
            "damp fabric",
            "scent of pastry from the kitchen",
            "wood smoke",
            "the musty aroma of old books"
          ],
          "mood": "cozy yet melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "flickering flame in the fireplace",
            "guests huddled in corners",
            "tattered magazines on tables",
            "a clock ticking steadily"
          ],
          "sounds": [
            "the ticking of a grandfather clock",
            "low murmurs of conversation",
            "the crackle of the fire",
            "sudden laughter cutting through silence",
            "the sound of a tea service being prepared"
          ],
          "smells": [
            "warmth of baked goods",
            "scent of fresh tea",
            "dust motes in the air",
            "old wood",
            "the faintest hint of mildew"
          ],
          "mood": "tense and watchful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft glow of candlelight",
            "darkening sky outside",
            "guests gathered in clusters",
            "sparkling glassware",
            "the flicker of firelight"
          ],
          "sounds": [
            "laughter ringing out",
            "the clink of glasses",
            "soft strains of music",
            "the rustling of evening gowns",
            "whispers of intrigue"
          ],
          "smells": [
            "scent of fine whiskey",
            "freshly cut flowers",
            "the aroma of savory dishes",
            "warmth of the fire",
            "the lingering scent of tobacco"
          ],
          "mood": "luxurious yet charged"
        }
      ],
      "paragraphs": [
        "The Drawing Room exudes an air of elegance, with plush velvet armchairs arranged around a grand fireplace. The soft strains of jazz from the radio mingle with the crackling of the fire, creating a warm yet watchful atmosphere. Guests gather in small clusters, exchanging pleasantries, but the underlying tension is palpable. The scent of tobacco lingers in the air, a reminder of the secrets that have been shared and the ones yet to be uncovered.",
        "As the evening progresses, the Drawing Room transforms into a stage for intrigue. Candlelight dances across the walls, illuminating the intricate murals that depict scenes of a bygone era. The clinking of glasses and soft laughter serve as a backdrop to whispered conversations, as guests cast furtive glances at one another. With each passing moment, the stakes grow higher, and the sense of impending revelation hangs heavy in the air."
      ]
    },
    {
      "id": "kitchen",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A bustling kitchen filled with stainless steel appliances, large wooden tables, and shelves stocked with jars of preserves.",
      "sensoryDetails": {
        "sights": [
          "steam rising from pots",
          "gleaming stainless steel surfaces",
          "jars of colorful preserves",
          "busy chefs in white uniforms",
          "fresh herbs hanging to dry"
        ],
        "sounds": [
          "clattering of pots and pans",
          "sizzling on the stove",
          "shouting orders",
          "the hum of refrigeration",
          "water running in the sink"
        ],
        "smells": [
          "aroma of roasting meats",
          "freshly baked bread",
          "scent of herbs and spices",
          "hint of burnt sugar",
          "cleanliness of soap and bleach"
        ],
        "tactile": [
          "warmth from the oven",
          "smoothness of polished countertops",
          "rough texture of wooden cutting boards",
          "coolness of metal utensils",
          "sticky dough on hands"
        ]
      },
      "accessControl": "Staff-only access; guests are not permitted to enter without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on the window",
            "steam clouding glass panes",
            "chefs prepping ingredients",
            "shelves stocked with fresh produce",
            "light filtering through droplets"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "clanging of pots",
            "chopping sounds",
            "muffled voices",
            "the whistle of a kettle"
          ],
          "smells": [
            "freshly baked pastries",
            "scent of wet earth",
            "herbs being chopped",
            "the aroma of brewing coffee",
            "clean linens"
          ],
          "mood": "busy and invigorating"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light streaming through windows",
            "chefs moving with urgency",
            "trays of prepared dishes",
            "pans sizzling on the stove",
            "clouds casting shadows"
          ],
          "sounds": [
            "the rhythmic chopping of vegetables",
            "urgent calls between staff",
            "steam escaping from pots",
            "the hum of machinery",
            "the clattering of utensils"
          ],
          "smells": [
            "savory aromas filling the air",
            "scent of fried foods",
            "the tang of vinegar",
            "freshly chopped herbs",
            "the scent of cleaning supplies"
          ],
          "mood": "hectic and charged"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft glow of overhead lights",
            "plated dishes ready for service",
            "staff arranging tables",
            "the glimmer of polished silverware",
            "fresh ingredients laid out"
          ],
          "sounds": [
            "the clink of cutlery",
            "laughter among staff",
            "the sound of sizzling",
            "the bustle of preparation",
            "the rustle of table linens"
          ],
          "smells": [
            "the rich aroma of dinner",
            "scent of roasted vegetables",
            "fresh herbs just chopped",
            "the sweetness of dessert",
            "the scent of wine"
          ],
          "mood": "energetic and anticipatory"
        }
      ],
      "paragraphs": [
        "The Kitchen hums with activity, a whirlwind of motion and sound as chefs prepare for dinner service. Steam rises from pots, while the rich aroma of roasting meats fills the air. The stainless steel surfaces gleam under the overhead lights, a stark contrast to the chaotic energy of the staff. Jars of colorful preserves line the shelves, a reminder of the bounty of the season, while the scent of freshly baked bread wafts through the room, drawing attention to the warmth of the oven.",
        "As the evening approaches, the atmosphere shifts, becoming charged with anticipation. The clattering of pots and pans creates a symphony of preparation, while the scents of savory dishes and sweet desserts mingle in the air. Staff members move with urgency, their laughter echoing against the walls, but beneath it all lies the tension of the secrets that may be hidden among the ingredients, waiting to be uncovered."
      ]
    },
    {
      "id": "courtyard",
      "name": "The Central Courtyard",
      "type": "exterior",
      "purpose": "Gathering space",
      "visualDetails": "A beautifully landscaped courtyard featuring palm trees, colorful flower beds, and a fountain at its center.",
      "sensoryDetails": {
        "sights": [
          "vibrant flower beds",
          "swaying palm trees",
          "the glint of sunlight on water",
          "stone paths winding through greenery",
          "guests strolling leisurely"
        ],
        "sounds": [
          "birds chirping in the trees",
          "water bubbling in the fountain",
          "soft laughter",
          "the rustle of leaves in the breeze",
          "footsteps on stone"
        ],
        "smells": [
          "fragrant flowers",
          "freshly cut grass",
          "scent of citrus from nearby trees",
          "the salty sea air",
          "the warmth of sun-baked stone"
        ],
        "tactile": [
          "smooth stone pathways",
          "soft grass underfoot",
          "the warmth of the sun",
          "coolness of shaded areas",
          "rough bark of palm trees"
        ]
      },
      "accessControl": "Open to all guests; monitored by staff for safety.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "puddles forming on paths",
            "grey clouds hanging low",
            "damp flowers drooping",
            "leaves glistening with rain",
            "mist rising from the ground"
          ],
          "sounds": [
            "soft rain pattering on leaves",
            "the distant sound of thunder",
            "the rustling of wet grass",
            "birds calling in the rain",
            "the drip of water from branches"
          ],
          "smells": [
            "fresh rain on earth",
            "the scent of wet flowers",
            "damp wood",
            "the crispness of morning air",
            "the aroma of brewing coffee wafting from inside"
          ],
          "mood": "quiet and reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "shadows creeping across the courtyard",
            "guests huddled under umbrellas",
            "flowers wilting under the weight of rain",
            "puddles reflecting grey skies"
          ],
          "sounds": [
            "soft murmurs of conversation",
            "the rustle of umbrellas",
            "water dripping from leaves",
            "the faint sound of a clock chiming",
            "the creak of wooden benches"
          ],
          "smells": [
            "the scent of damp earth",
            "faded floral aromas",
            "the tang of sea salt in the air",
            "the mustiness of wet grass",
            "the faint smell of mildew"
          ],
          "mood": "melancholic and subdued"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of sunset casting warm hues",
            "guests gathered around the fountain",
            "shadows stretching across the paths",
            "twinkling stars beginning to appear",
            "the reflection of lights on water"
          ],
          "sounds": [
            "laughter echoing in the space",
            "the soft bubbling of the fountain",
            "the rustling of leaves in the evening breeze",
            "the distant sound of waves",
            "the clinking of glasses"
          ],
          "smells": [
            "the fragrance of night-blooming flowers",
            "the aroma of grilled food from nearby kitchens",
            "the scent of fresh herbs",
            "the cooling earth as night falls",
            "the sweetness of dessert"
          ],
          "mood": "relaxed yet charged with tension"
        }
      ],
      "paragraphs": [
        "The Central Courtyard is a vibrant oasis, filled with the colors of blooming flowers and the rustle of palm fronds. Guests stroll leisurely along the stone paths, pausing to admire the fountain that bubbles cheerfully at the center. The scent of fresh flowers mingles with the salty sea air, creating a refreshing ambiance. However, beneath the surface of this idyllic scene, the tension among the guests simmers, as they navigate the complexities of their intertwined lives.",
        "As evening descends, the courtyard transforms into a gathering place for whispered conversations and shared glances. The glow of sunset casts warm hues across the faces of the guests, yet shadows creep in as the stars begin to twinkle overhead. The air grows heavy with the scent of grilled food and the sweetness of night-blooming flowers, but the underlying currents of suspicion remain, reminding all that not everything is as it seems."
      ]
    }
  ],
  "note": "",
  "cost": 0.00274139085,
  "durationMs": 58213
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "November",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast skies with occasional rain",
      "cool winds off the coast",
      "damp air with a hint of salt"
    ],
    "daylight": "Shorter days with sunset around 4:30 PM, leaving an early darkness that brings a chill to the evening air.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after the dinner service in the hotel.",
    "holidays": [
      "Thanksgiving"
    ],
    "seasonalActivities": [
      "strolling along the beach wrapped in coats",
      "gathering for card games in the hotel's lounge",
      "attending local theater productions"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits",
        "tweed blazers",
        "fedoras"
      ],
      "casual": [
        "corduroy trousers",
        "button-up shirts with rolled sleeves",
        "woolen sweaters"
      ],
      "accessories": [
        "leather gloves",
        "silk ties",
        "pocket squares"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with cinched waists",
        "tailored suits with shoulder pads",
        "pencil skirts"
      ],
      "casual": [
        "knitted sweaters",
        "A-line skirts",
        "wide-brimmed hats"
      ],
      "accessories": [
        "pearl necklaces",
        "gloves",
        "stylish handbags"
      ]
    },
    "trendsOfTheMoment": [
      "the rise of the 'New Look' by Dior emphasizing femininity",
      "mixing patterns in clothing",
      "the popularity of tailored silhouettes"
    ],
    "socialExpectations": [
      "men are expected to wear suits in public settings",
      "women are increasingly seen in professional attire",
      "social gatherings are marked by formal etiquette"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the ongoing struggles in post-war Europe",
      "the beginnings of the Berlin Airlift's aftereffects",
      "the establishment of the United Nations' Universal Declaration of Human Rights"
    ],
    "politicalClimate": "A growing tension between the United States and the Soviet Union, as the Cold War begins to manifest in various international conflicts.",
    "economicConditions": "Post-war recovery is underway, but inflation and shortages are still causing concern; rationing is easing but still present for some goods.",
    "socialIssues": [
      "racial segregation remains a contentious issue",
      "women's rights are gaining attention as more enter the workforce",
      "veterans are seeking jobs and reintegration into society"
    ],
    "internationalNews": [
      "the establishment of Israel leads to regional conflicts",
      "India gains independence, setting a precedent for decolonization",
      "the Nuremberg Trials conclude, shaping international law"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Frank Sinatra's ballads",
        "the emergence of rhythm and blues",
        "Bing Crosby's holiday classics"
      ],
      "films": [
        "The Treasure of the Sierra Madre",
        "Key Largo",
        "The Red Shoes"
      ],
      "theater": [
        "Death of a Salesman",
        "A Streetcar Named Desire",
        "The King and I"
      ],
      "radio": [
        "The Shadow",
        "Suspense",
        "Lux Radio Theater"
      ]
    },
    "literature": {
      "recentPublications": [
        "1984 by George Orwell",
        "The Naked and the Dead by Norman Mailer",
        "The Catcher in the Rye by J.D. Salinger"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "science fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial jet airliner, the de Havilland Comet",
        "solid-state radios",
        "early versions of television sets"
      ],
      "commonDevices": [
        "radios in households",
        "film cameras",
        "television sets in urban homes"
      ],
      "emergingTrends": [
        "the spread of consumerism",
        "the introduction of suburban living",
        "increased availability of household appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "gathering for tea in the afternoons",
        "reading newspapers with breakfast",
        "participating in neighborhood watch groups"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "bridal showers and baby showers",
        "holiday parties leading up to Christmas"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a growing middle class due to post-war prosperity",
      "class distinctions are still marked but slowly eroding"
    ],
    "gender": [
      "women are increasingly valued in the workforce",
      "traditional gender roles are being questioned"
    ],
    "race": [
      "racial tensions simmer as African Americans push for civil rights",
      "discussions about integration and equality are becoming more frequent"
    ],
    "generalNorms": [
      "politeness and formality dominate social interactions",
      "expectations of propriety in public behavior are high"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and rain mingles with the salty air, creating a heavy atmosphere around the coastal hotel.",
    "The sound of distant waves crashing against the shore creates an unsettling background, as guests whisper and eye one another with suspicion.",
    "The flickering light of the hotel's old-fashioned lamps casts long shadows, enhancing the sense of mystery that permeates the dimly lit hallways."
  ],
  "paragraphs": [
    "In November 1948, the coastal hotel stood shrouded in mist, its overcast skies and occasional rains casting a gloomy pall over the premises. The scent of damp earth mixed with the salty tang of the sea, creating an ambiance thick with tension. Guests, many of whom had endured the trials of war, lingered in the lounge, their conversations hushed, as if sharing secrets with the shadows that danced beneath the flickering lights. The chill in the air, coupled with the early nightfall, heightened their sense of unease, as they navigated the hotel’s labyrinth of dark corridors, each turn potentially leading to confrontation or revelation.",
    "Fashion in November 1948 mirrored the complexity of the era, where men's attire was a blend of formal and casual styles, featuring double-breasted wool suits and fedoras, while women donned tea-length dresses and tailored suits that emphasized their newfound roles in the workforce. The air was thick with the fragrance of expensive perfumes, and the clinking of glasses echoed as patrons engaged in polite yet strained exchanges. As they gathered for card games and evening cocktails, the undercurrents of suspicion simmered just below the surface, reflected in the wary glances exchanged across the room.",
    "The daily life of the guests was punctuated by the remnants of war and the burgeoning post-war economy. Issues of inflation and rationing were still fresh in everyone’s minds, as they navigated the typical prices of everyday items, including a loaf of bread at four pence. Social rituals, such as Sunday family dinners and holiday parties, were anticipated yet tinged with the weight of history. The sounds of jazz and blues from the radio filled the air, creating a backdrop that both soothed and unsettled, as conversations turned to the future while grappling with the ghosts of the past."
  ],
  "note": "",
  "cost": 0.0010738233,
  "durationMs": 21580
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of guests at a coastal hotel, drawn together by a charity gala, must navigate the complexities of post-war social change and the tensions of the Cold War while a masquerade leads to deadly consequences.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has shifted class dynamics, with women entering the workforce and societal pressures mounting as Cold War anxieties permeate the elite social sphere."
  },
  "setting": {
    "location": "A seaside hotel perched on a cliff overlooking the ocean",
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
  "theme": "Golden Age murder driven by an impersonation method, where a masquerade of double identity — a disguise exploited to seem to be in two places — breaks the assumed alibi."
}

### LOCKED_FACTS
[
  {
    "id": "costume_fabric",
    "value": "one yard",
    "description": "The length of fabric used to create the killer's disguise."
  },
  {
    "id": "witness_count",
    "value": "three witnesses",
    "description": "The number of witnesses who saw the impersonation."
  },
  {
    "id": "makeup_kit_items",
    "value": "five items",
    "description": "The number of makeup items found in the killer's possession."
  },
  {
    "id": "time_of_murder",
    "value": "ten minutes past ten",
    "description": "The specific time noted when the victim was last seen alive."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 7,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 16,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
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
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "temporal"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_8",
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
      "id": "clue_10",
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
      "id": "clue_early_1",
      "placement": "mid",
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
      "category": "temporal"
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
