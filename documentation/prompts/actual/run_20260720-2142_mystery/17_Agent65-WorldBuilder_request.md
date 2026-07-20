# Actual Prompt Record

- Run ID: `mystery-1784583752603`
- Project ID: ``
- Timestamp: `2026-07-20T21:48:21.865Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `2250cb5fde90e1c9`

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
    "title": "The Masquerade of Authority",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A seaside hotel characterized by Art Deco architecture",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "poisoning"
    }
  },
  "death_method": "drowned",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "An observant guest and amateur sleuth",
      "private_secret": "keeps a secret",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "7:00 PM - 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel common areas",
        "oceanfront"
      ],
      "behavioral_tells": [
        "Keen observer",
        "Not easily distracted"
      ],
      "stakes": "Desire for justice",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Expert",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Has a past connection with the victim",
      "motive_seed": "Jealousy over past relationship",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM - 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "medical supplies",
        "hotel kitchen"
      ],
      "behavioral_tells": [
        "Nervous when questioned",
        "Defensive about past"
      ],
      "stakes": "Reputation at stake",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority Figure",
      "relationships": [],
      "public_persona": "Retired naval officer",
      "private_secret": "Knows secrets about the victim",
      "motive_seed": "Desire to protect someone's reputation",
      "motive_strength": "moderate",
      "alibi_window": "7:00 PM - 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel lobby",
        "oceanfront"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Evasive about the night"
      ],
      "stakes": "Loyalty to a friend",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Innocent Bystander",
      "relationships": [],
      "public_persona": "Socialite and partygoer",
      "private_secret": "Has a crush on the victim",
      "motive_seed": "inheritance",
      "motive_strength": "weak",
      "alibi_window": "7:00 PM - 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel dining area"
      ],
      "behavioral_tells": [
        "Excitable during conversations",
        "Giddy demeanor"
      ],
      "stakes": "Romantic aspirations",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Friend of the Victim",
      "relationships": [],
      "public_persona": "Close friend of the victim",
      "private_secret": "Knew about the victim's dark past",
      "motive_seed": "Protecting the victim's legacy",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM - 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel common areas",
        "oceanfront"
      ],
      "behavioral_tells": [
        "Emotional when speaking of the victim",
        "Quick to defend him"
      ],
      "stakes": "Friendship",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charismatic hotel guest",
      "private_secret": "Had secrets that could ruin others",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "evening",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel ballroom"
      ],
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
      "summary": "During a lavish masquerade ball at a seaside hotel, Hugo Vane is found drowned in the ocean. As tensions rise and guests are questioned, Eleanor Voss uncovers a web of deceit involving disguises and authority manipulation, revealing that the true murderer exploited a false identity to create an alibi."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murderer disguised themselves as the victim and used acoustic misdirection to create a false alibi.",
      "delivery_path": [
        {
          "step": "The murderer donned a disguise that closely resembled the victim."
        },
        {
          "step": "Utilized the sounds of the crashing waves to mask the act of murder."
        }
      ]
    },
    "outcome": {
      "result": "The victim was made to appear as though they had drowned accidentally."
    }
  },
  "false_assumption": {
    "statement": "The murderer was present at the ball throughout the evening.",
    "type": "authority",
    "why_it_seems_reasonable": "Multiple witnesses confirm seeing the murderer at the event.",
    "what_it_hides": "The murderer used a disguise to create an illusion of presence."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch had a motive due to a past relationship with the victim.",
      "Witnesses noted her being overly emotional when discussing the victim."
    ],
    "the_one_flaw": "Dr. Finch's hospital records show she was treating patients during the time of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A torn piece of clothing matching the victim's costume found near the water.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "Beatrice was helping the victim with his costume earlier in the evening.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Footprints leading away from the crime scene.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "Captain Hale was walking along the beach to clear his mind and check on the waves.",
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
    "rationale": "All suspects were present at the ball, and no outsiders were involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Time of the masquerade ball start: 7:00 PM",
        "Time of the body discovery: 8:45 PM"
      ],
      "windows": [
        "Murder occurred between 7:30 PM and 8:30 PM"
      ],
      "contradictions": [
        "Witnesses claim Hugo was seen moments before he drowned, but no one saw him leave the premises."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Sylvia Trent"
      ],
      "objects": [
        "Victim's costume",
        "Hotel service entrance"
      ],
      "permissions": [
        "All guests had access to the ballroom and beach."
      ]
    },
    "physical": {
      "laws": [
        "Sound travels differently in water than in air."
      ],
      "traces": [
        "Footprints leading to the ocean that do not match the victim."
      ]
    },
    "social": {
      "trust_channels": [
        "Witness testimonies are often taken at face value."
      ],
      "authority_sources": [
        "Hotel management's word is seen as final."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses describe a figure resembling the victim leaving the hotel shortly before the body was discovered.",
        "correction": "The figure could have been the murderer in disguise.",
        "effect": "Narrows suspect pool to those who could have disguised themselves.",
        "required_evidence": [
          "Witness statements about the figure's appearance",
          "Hotel security footage showing the figure's departure"
        ],
        "reader_observable": true
      },
      {
        "observation": "A torn piece of the victim's costume found near the water's edge.",
        "correction": "This indicates a struggle or deception involving the victim's clothing.",
        "effect": "Eliminates Beatrice Quill as a suspect since she was helping the victim.",
        "required_evidence": [
          "Description of the torn piece of clothing",
          "Beatrice's alibi confirming she was with the victim"
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints leading away from the crime scene do not match the victim's shoes.",
        "correction": "The footprints indicate someone else left the scene.",
        "effect": "Narrows suspects to those who could have escaped unnoticed.",
        "required_evidence": [
          "Footprint analysis report",
          "Witness statements about the victim's shoe size"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Eleanor Voss sets a controlled situation with the hotel management to compare the disguise used against known facts about the victim's appearance and timing of events.",
    "knowledge_revealed": "The revealed facts are disguise, witnes, and witness.",
    "pass_condition": "The comparison reveals discrepancies in the timeline and the disguise's authenticity.",
    "evidence_clues": [
      "clue_7",
      "clue_mechanism_visibility_core",
      "clue_4",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements and hotel footage establish a credible alibi. Step 2: The torn clothing and Beatrice's alibi eliminate her as a suspect. Step 3: The footprint evidence narrows down the suspects, leading to the final test comparing disguises."
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
        "clearance_method": "Confirmed she was assisting the victim before the incident",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness testimony confirming his location during the murder",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 7:00 PM - 8:30 PM",
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Footprint analysis"
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
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
    "summary": "Eleanor Voss, a diligent receptionist at a seaside hotel, navigates a web of intrigue as she uncovers a scandal that threatens to upend her world.",
    "publicPersona": "Efficient and friendly, known for her keen eye for details.",
    "privateSecret": "Recently discovered an affair involving the victim and plans to expose it.",
    "motiveSeed": "Curiosity about the victim's personal affairs",
    "motiveStrength": "moderate",
    "alibiWindow": "left the lobby for ten minutes around 9 PM",
    "accessPlausibility": "easy",
    "stakes": "Seeking to uncover truths about her workplace.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks in a measured tone, often punctuating her observations with wry comments. She has a habit of raising an eyebrow when skeptical.",
    "signatureTic": "Well, that’s a twist, isn’t it?",
    "internalConflict": "Fears that exposing the affair will disrupt her carefully curated life and relationships at the hotel.",
    "personalStakeInCase": "The victim's affair could tarnish her reputation and threaten her job stability.",
    "paragraphs": [
      "Eleanor Voss was the kind of receptionist who could spot a misplaced coat button from across the room. Efficient and friendly, she made it her mission to keep the seaside hotel running smoothly. Guests relied on her keen eye for detail, but beneath her polished exterior lay a growing curiosity—one that had recently turned into a dangerous obsession. She had stumbled upon a scandal involving the victim, Hugo Vane, and now she faced a moral quandary that could shatter her serene existence.",
      "The revelation of Hugo's affair gnawed at her conscience, a secret that could either protect or destroy her. Eleanor had always prided herself on her ability to maintain a professional distance, yet the allure of the truth was intoxicating. She had seen the victim's charming façade crack under the weight of secrets, and now she felt an unshakeable urge to expose him. However, she was acutely aware that this could lead to her own downfall; the hotel was her refuge, and any scandal could threaten her place within its walls.",
      "As she navigated the hotel lobby, Eleanor’s mind raced with thoughts of how to confront the intricate web of lies surrounding her. She had left the lobby for ten minutes around 9 PM, a seemingly innocuous absence that now felt loaded with implications. Did anyone see her? Did they notice the glint of determination in her eyes? Her access to the hotel’s inner workings made her a key player in this unfolding drama, yet the stakes were higher than she had anticipated. She had to tread carefully, her every move scrutinized by those who might seek to protect their own interests.",
      "Each encounter with her colleagues felt like a game of chess, where every word could be a pawn sacrificed for the sake of the truth. As she confronted individuals from her past, Eleanor's confidence began to bloom. She wanted to be the one to unveil the layers of deception, not just for her own sake but for the sake of those who deserved the truth. The hotel was not just a place of work; it was a stage where her character arc would unfold, and she was determined to play her part with unwavering resolve."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected psychiatrist, grapples with the demons of her past rivalry with the victim as the investigation unfolds.",
    "publicPersona": "Respected in her field, often seen as a voice of reason.",
    "privateSecret": "Harbored resentment over an old rivalry with the victim during medical school.",
    "motiveSeed": "Seeks revenge for a past humiliation at the victim's hands.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be at a conference, but cannot prove it.",
    "accessPlausibility": "possible",
    "stakes": "Personal vindication in the face of professional integrity.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks with a calm, measured tone, often laced with sarcasm. She tends to overanalyze situations, using clinical jargon that can obscure her emotions.",
    "signatureTic": "How fascinating, isn’t it?",
    "internalConflict": "Battles feelings of inadequacy and resentment stemming from her rivalry with Hugo, questioning her own professional integrity.",
    "personalStakeInCase": "The investigation could either redeem her reputation or expose her vulnerabilities.",
    "paragraphs": [
      "Dr. Mallory Finch was no stranger to the complexities of the human mind, yet she found herself ensnared in a web of her own making. A respected psychiatrist, she had spent years cultivating an image of reason and calm, but beneath the surface lay a tempest of resentment. The recent murder of Hugo Vane had reawakened old wounds, memories of a rivalry that had left her humiliated during their medical school days. Now, as the investigation unfurled, she felt the familiar sting of inadequacy creeping back.",
      "Her alibi, a flimsy excuse of attending a conference, hung over her like a dark cloud. Could she prove her innocence? Or was she destined to be swept up in a tide of suspicion? The stakes had never been higher for Mallory; her career was built on the foundation of her reputation. Yet the urge for revenge, for vindication, loomed larger than her fear of exposure. She had to confront the ghosts of her past, and Hugo was at the center of it all.",
      "In her interactions with the other suspects, Mallory's sardonic wit often pierced through the tension, a defense mechanism she had honed over the years. \"How fascinating, isn’t it?\" she would quip, even as her heart raced with anxiety. Each word was a carefully crafted façade, a mask she wore to hide her true feelings. The clinical jargon that flowed from her lips was a double-edged sword; while it lent her an air of authority, it also served to distance her from the emotional turmoil she was experiencing.",
      "As the investigation progressed, Mallory found herself at a crossroads. Would she succumb to the pressure of her past, allowing it to dictate her choices, or would she seize the opportunity to redefine herself? Healing required confronting her demons, and perhaps, in the process, she could achieve a sense of redemption. The hotel had become a crucible for her, a place where her professional and personal lives collided in a dramatic confrontation."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, struggles with his past as the investigation into the victim's murder reveals his hidden battles.",
    "publicPersona": "A decorated captain with a stern demeanor, known for his discipline.",
    "privateSecret": "Struggles with PTSD from the war and has been drinking heavily.",
    "motiveSeed": "Believes the victim was about to expose his struggles to the public.",
    "motiveStrength": "compelling",
    "alibiWindow": "Was in the bar during the murder but was alone.",
    "accessPlausibility": "possible",
    "stakes": "His reputation and mental stability are at stake.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Speaks in a deep, gravelly voice, often punctuated by long pauses as he gathers his thoughts. He uses military jargon, occasionally slipping into self-deprecation.",
    "signatureTic": "Just my luck, really.",
    "internalConflict": "Struggles with feelings of inadequacy and shame over his mental health issues, fearing exposure and judgment.",
    "personalStakeInCase": "The investigation could unravel his carefully hidden struggles, jeopardizing both his reputation and his recovery.",
    "paragraphs": [
      "Captain Ivor Hale was a man of discipline, a retired naval officer who had once commanded respect with a mere glance. Yet here he stood, a shell of his former self, haunted by the specters of war and the demons of his own mind. The murder of Hugo Vane had thrust him into a spotlight he had long avoided, and now he found himself grappling with the possibility that his hidden struggles would be laid bare for all to see. Just my luck, really, he thought, a sardonic humor creeping into his thoughts.",
      "His alibi was a fragile one—alone in the bar during the murder, nursing a drink that had become a crutch rather than a comfort. The weight of his PTSD pressed down on him, and the thought that Hugo might have exposed his vulnerabilities filled him with dread. The stakes were not merely about reputation; they were about his very sanity. Ivor had fought valiantly on the battlefield, but the battle within himself was an enemy he could not face alone.",
      "When he spoke, his voice was deep and gravelly, often punctuated by long pauses as he searched for the right words. In conversations, he would slip into military jargon, a remnant of a life he had once embraced fully. Yet there was an undercurrent of self-deprecation that colored his interactions, as if he felt unworthy of the very respect he once commanded. He often found himself questioning his worth, wondering if anyone could see beyond the façade he had built.",
      "As the investigation unfolded, Ivor faced a choice: to confront his past and seek the healing he desperately needed or to retreat further into the shadows. The hotel had become a battleground, and each conversation felt like a skirmish against the ghosts of his past. His journey was not just about clearing his name; it was about reclaiming his life from the clutches of fear and shame, a task that would require more courage than he had ever shown on the high seas."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a friendly waitress, finds herself caught in a storm of gossip and suspicion as the investigation into the victim's murder unfolds.",
    "publicPersona": "Friendly and chatty, known for her gossip.",
    "privateSecret": "Knew of the victim's unethical practices involving bribery.",
    "motiveSeed": "Motivated by loyalty to a colleague who was unfairly dismissed by the victim.",
    "motiveStrength": "weak",
    "alibiWindow": "Was working in the restaurant at the time, can confirm through coworkers.",
    "accessPlausibility": "easy",
    "stakes": "Her job security and reputation in the community.",
    "humourStyle": "observational",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks in a lively and animated manner, often punctuating her sentences with laughter. She has a tendency to embellish stories or facts for effect.",
    "signatureTic": "Can you believe it?",
    "internalConflict": "Struggles with the fear of being implicated in the investigation, caught between loyalty and self-preservation.",
    "personalStakeInCase": "The investigation could jeopardize her job security and reputation in the tight-knit community.",
    "paragraphs": [
      "Beatrice Quill was the heart of the hotel’s dining room, a friendly waitress who could brighten anyone's day with a smile and a well-timed quip. Known for her chatty nature and penchant for gossip, she had her fingers on the pulse of the hotel's social scene. Yet as the investigation into Hugo Vane's murder unfolded, Beatrice found herself caught in a storm of suspicion and intrigue. Can you believe it? she thought as she navigated the treacherous waters of rumor and speculation.",
      "Her public persona was one of vivacity, but beneath the surface, Beatrice harbored a secret that weighed heavily on her conscience. She knew of the victim's unethical practices involving bribery, a fact that could easily turn her from a friendly face into a suspect. While she felt loyalty to a colleague who had been unfairly dismissed by Hugo, the stakes were high. Her job security and reputation in the community were on the line, and the thought of being implicated sent shivers down her spine.",
      "In the bustling restaurant, her lively manner masked the turmoil within. Beatrice spoke in animated bursts, laughter bubbling up as she recounted tales of guest antics, often embellishing the details for dramatic effect. Yet even as she entertained her patrons, her mind raced with worry. What if someone discovered her knowledge? What if her loyalty to her colleague led to her own downfall? The balance between self-preservation and loyalty felt precarious, and each interaction with the other suspects was fraught with tension.",
      "As the investigation unfolded, Beatrice faced a pivotal moment in her life. Would she continue to hide behind her cheerful façade, or would she find the courage to reveal the truth? The hotel was not just a workplace; it was a community, and she longed to stand firm in her convictions. Perhaps this would be her chance to reveal the strength she had always kept hidden, to emerge from the shadows of gossip and into the light of honesty."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, an elegant socialite, grapples with her financial troubles as the investigation into the victim's murder threatens to expose her secrets.",
    "publicPersona": "Known for her elegance and charm, often a hostess at social events.",
    "privateSecret": "In debt due to extravagant spending, relied on the victim for financial favors.",
    "motiveSeed": "Fearing exposure of her financial troubles, she wanted the victim silenced.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to have been in her room but has no witnesses.",
    "accessPlausibility": "possible",
    "stakes": "Desperation for her social standing and financial security.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks in a refined, articulate manner, often using flowery language. She has a habit of laughing lightly, even when discussing serious matters.",
    "signatureTic": "How dreadfully inconvenient.",
    "internalConflict": "Fears the exposure of her financial troubles will lead to social ostracism and loss of status.",
    "personalStakeInCase": "The investigation could unravel her carefully curated image and jeopardize her financial security.",
    "paragraphs": [
      "Sylvia Trent was the epitome of elegance, a socialite who graced the halls of the hotel like a swan gliding across a still pond. Known for her charm and poise, she had mastered the art of hosting lavish soirées that dazzled the elite. Yet as the investigation into Hugo Vane's murder unfolded, Sylvia felt the ground beneath her feet begin to tremble. How dreadfully inconvenient, she mused, as the specter of her financial troubles loomed ever closer.",
      "In public, she projected an image of confidence and grace, but behind closed doors, Sylvia was drowning in debt, her extravagant lifestyle a facade that threatened to collapse. She had relied on Hugo for financial favors, a dangerous dance that now left her vulnerable. The stakes were high; exposure could lead to social ostracism, a fate she could scarcely imagine. The thought of losing her status sent chills down her spine, and she contemplated the lengths she might go to keep her secrets buried.",
      "Sylvia's speech was refined and articulate, her words often laced with a delicate politeness that belied the turmoil within. She had a habit of laughing lightly, even when discussing serious matters, a defense mechanism that masked her anxiety. Conversations with her were like navigating a maze of flowery language, where every compliment held a hidden edge. Yet as the investigation progressed, she found herself grappling with the reality of her situation, torn between maintaining her image and confronting the truth.",
      "As the walls closed in around her, Sylvia faced a critical decision. Would she continue to feign indifference, allowing her charm to deflect scrutiny, or would she confront the reality of her financial predicament? The hotel was both a sanctuary and a prison, a place where her dreams of grandeur could turn to ashes. In this moment of reckoning, Sylvia had the opportunity to redefine her relationships, to learn the value of humility and the strength found in honesty."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, an adventurous travel writer, becomes the tragic victim of a murder that unveils the hidden lives of those around him.",
    "publicPersona": "Adventurous and charming, a frequent traveler with tales to tell.",
    "privateSecret": "Was secretly documenting the illicit affairs occurring between guests.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "possible",
    "stakes": "N/A",
    "characterArcPotential": "N/A",
    "paragraphs": [
      "Hugo Vane was a man who relished the thrill of adventure, a travel writer whose tales captivated the hearts of many. With charm that could disarm even the most guarded of souls, he had built a reputation as a raconteur, spinning stories of distant lands and daring escapades. Yet beneath the surface of his charismatic public persona lay a secret that would ultimately lead to his demise. He had been documenting the illicit affairs occurring between guests at the hotel, an endeavor that would prove to be his undoing.",
      "As the investigation unfolded, it became increasingly clear that Hugo's life was far more complicated than anyone had imagined. His penchant for uncovering secrets had earned him both admirers and enemies, and those closest to him were soon revealed to be tangled in their own webs of deceit. The very charm that had drawn people to him now became a double-edged sword, as the truth about his secretive pursuits began to emerge.",
      "Though he was no longer able to weave his tales, Hugo's legacy lingered in the air like a ghostly echo, haunting the hotel and its guests. Each character left behind grappled with their own motivations and fears, their lives irrevocably altered by the tragedy that had befallen him. In the shadows, whispers of his exploits intertwined with the investigation, revealing the complexity of human relationships and the fragile nature of trust.",
      "Hugo's story, though cut short, served as a catalyst for change. As those left behind faced the consequences of their actions, they would be forced to confront their own truths, each revelation a step towards understanding the tangled web of their lives. The hotel, once a backdrop for his adventures, became a stage for a darker narrative, one where secrets could no longer remain hidden."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seaside Grand Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "An Art Deco seaside hotel, steeped in intrigue and shadowed by the waves crashing against the cliffs.",
    "visualDescription": "The hotel boasts a sweeping facade of white stucco with bold geometric patterns, its lobby adorned with polished marble floors and chrome accents. Narrow hallways lead to well-appointed rooms, each offering views of the churning sea beyond.",
    "atmosphere": "An air of suspense lingers beneath the polished surface, with whispers of secrets hidden among the guests.",
    "paragraphs": [
      "The Seaside Grand Hotel stands defiantly against the relentless waves of the English Channel, its Art Deco lines sharp against the overcast sky. Inside, the lobby glimmers under the soft glow of glass chandeliers, but the atmosphere is thick with tension. Guests exchange furtive glances, their laughter punctuated by the distant crash of surf, as if the ocean itself is a witness to their secrets.",
      "Narrow hallways wind like mazes through the hotel, adorned with intricate murals depicting maritime scenes. The scent of salt and dampness permeates the air, mingling with the faint aroma of wax polish on the furniture. The distant sound of a radio crackles, broadcasting news of the outside world, yet inside these walls, a profound isolation reigns. The heavy drapes drawn tight against the windows block the view, creating an unsettling sense of confinement.",
      "As evening approaches, the grand dining room fills with the muted clink of cutlery and the soft murmur of conversations, but the atmosphere is electric with unspoken fears. Guests cast wary glances toward the staff, who move silently about their tasks, eyes downcast, as if they too are part of the unfolding mystery. The ocean’s roar grows louder, a dark undercurrent to the evening’s elegance, hinting at the chaos that could erupt at any moment.",
      "In the secluded corners of the hotel, whispers travel faster than footsteps. The staff-only areas remain shrouded in secrecy, with narrow staircases leading to kitchens and storage rooms, where the scent of fresh bread competes with the musty air of old linens. After dark, the guests' movements are strictly monitored, the tension palpable as they retreat to their rooms, where shadows dance in the flickering candlelight, and the night holds its breath."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain squalls",
    "timeFlow": "Days of mounting tension as secrets unravel",
    "mood": "tense with underlying unease among guests",
    "eraMarkers": [
      "manual typewriters in the reception area",
      "early radio broadcasts in each room",
      "rationed fuel limiting travel",
      "post-war social adjustments"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and dampness",
      "secondary": [
        "warmth of polished wood",
        "crispness of fresh linens"
      ]
    },
    "paragraphs": [
      "The hotel stands resolute against the backdrop of a roiling sea, the salty air heavy with secrets and whispers. Guests move about with guarded expressions, their laughter echoing hollowly against the damp walls. Each room, a sanctuary of intrigue, offers a view of the restless waves, while the lobby, with its Art Deco elegance, becomes a stage for the unfolding drama.",
      "As shadows lengthen, the atmosphere shifts. The scent of wax and salt mingles with the distant sound of crashing waves, creating an oppressive weight that hangs in the air. Conversations drop to hushed tones, and the crackle of the radio becomes a haunting backdrop, reminding all that the world outside continues to spin, even as they remain ensnared in their own tumultuous web."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Ocean View Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A lavishly decorated room with a large window overlooking the tumultuous sea, adorned with Art Deco furnishings.",
      "sensoryDetails": {
        "sights": [
          "tattered curtains billowing",
          "broken glass on the floor",
          "dark stains on the carpet"
        ],
        "sounds": [
          "distant thunder",
          "waves crashing against the cliff",
          "rustle of fabric",
          "silence punctuated by gasps"
        ],
        "smells": [
          "salt air mixed with spilled perfume",
          "damp wood",
          "burnt candle wax",
          "lingering tobacco"
        ],
        "tactile": [
          "cold glass shards underfoot",
          "soft velvet upholstery",
          "chill of the ocean breeze",
          "rough texture of the carpet"
        ]
      },
      "accessControl": "Locked after sunset; staff must escort guests; management monitors visitor access.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "rain tapping against window panes"
          ],
          "sounds": [
            "steady rain on the roof",
            "soft sighs of the sea",
            "dripping water from eaves"
          ],
          "smells": [
            "fresh rain on stone",
            "damp linens",
            "mildew in corners"
          ],
          "mood": "oppressive uncertainty"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dulling colors",
            "clouded glass obscuring the view"
          ],
          "sounds": [
            "whispers of guests",
            "the creak of floorboards",
            "occasional thunder rumbling"
          ],
          "smells": [
            "faint scent of mildew",
            "old wood and dust",
            "cooked fish from the kitchen"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset reflected in the sea",
            "long shadows stretching across the room"
          ],
          "sounds": [
            "gentle waves lapping",
            "clinking of glasses from below",
            "soft laughter"
          ],
          "smells": [
            "candle smoke",
            "freshly brewed tea",
            "hint of salt in the air"
          ],
          "mood": "nervous anticipation"
        }
      ],
      "paragraphs": [
        "The Ocean View Room, once a haven of luxury, now bears the weight of tragedy. Broken glass glitters like stars against the dark carpet, the remnants of a struggle leaving behind a chilling silence. The scent of spilled perfume mingles with the salty air, as if the ocean mourns the events that transpired within these walls. Shadows flicker in the candlelight, hinting at the secrets that lie hidden in the corners.",
        "As the storm rages outside, the room feels both a refuge and a prison. The sound of waves crashing against the cliffs echoes through the air, a reminder of the chaos just beyond the threshold. Guests tread carefully, their hearts pounding with the knowledge that something terrible has occurred. Each creak of the floorboards sends a shiver down their spines, as they ponder who among them could have committed such a crime."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious area with high ceilings, adorned with geometric patterns and lavish furnishings.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "chrome accents reflecting light",
          "art deco murals on walls",
          "elegant chandeliers"
        ],
        "sounds": [
          "soft chatter of guests",
          "clinking of glasses",
          "the crackle of a radio",
          "the distant sound of waves"
        ],
        "smells": [
          "freshly polished wood",
          "subtle floral arrangements",
          "old leather from furniture",
          "the scent of tobacco smoke"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft upholstery against skin",
          "cool metal of railings",
          "the warmth of sunlight streaming in"
        ]
      },
      "accessControl": "Open to all guests during the day; staff monitors after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "raindrops on windows"
          ],
          "sounds": [
            "soft patter of rain",
            "muffled conversations",
            "the hum of the radio"
          ],
          "smells": [
            "dampness in the air",
            "freshly brewed coffee",
            "scent of wet pavement"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping along walls",
            "flickering lights from the radio"
          ],
          "sounds": [
            "the creak of furniture",
            "soft laughter echoing",
            "the ticking of a clock"
          ],
          "smells": [
            "dust settling",
            "old leather",
            "cooked meals wafting in"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from chandeliers",
            "glimmers of laughter around tables"
          ],
          "sounds": [
            "clinking of glasses",
            "soft music playing",
            "the murmur of guests"
          ],
          "smells": [
            "scent of fresh linen",
            "smoky wood from the fireplace",
            "the aroma of fine food"
          ],
          "mood": "vibrant energy"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the heart of the hotel, where guests congregate beneath the gleaming chandeliers. The polished marble floors reflect the elegance of the space, while soft murmurs of conversation mingle with the crackle of the radio. The scent of freshly polished wood fills the air, evoking a sense of warmth amidst the gathering storm outside.",
        "As the day progresses, the mood shifts with the weather. The dim light filtering through rain-laden clouds casts an air of somber reflection, while laughter and chatter ripple through the crowd. Guests exchange wary glances, each one aware that beneath the surface of their interactions lies an undercurrent of tension, a shared knowledge of the unseen threat lurking within the hotel."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Oceanfront Dining Room",
      "type": "interior",
      "purpose": "Dining and socializing space",
      "visualDetails": "A beautifully appointed room with large windows overlooking the ocean, featuring elegant tables and luxurious seating.",
      "sensoryDetails": {
        "sights": [
          "elegantly set tables",
          "crystal glassware catching light",
          "ocean waves visible through windows",
          "artful centerpieces"
        ],
        "sounds": [
          "soft clinking of cutlery",
          "murmurs of conversation",
          "the rustle of napkins",
          "the distant roar of the sea"
        ],
        "smells": [
          "aromatic herbs and spices",
          "freshly baked bread",
          "the scent of ocean air",
          "cooked seafood"
        ],
        "tactile": [
          "smooth table linens",
          "cool glass of water",
          "soft leather seats",
          "the warmth of freshly served dishes"
        ]
      },
      "accessControl": "Open to guests during meal times; staff manages entry outside of service hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "clouds hanging low over the ocean",
            "raindrops trickling down the glass"
          ],
          "sounds": [
            "the soft patter of rain",
            "the faint sound of waves crashing",
            "the hum of the kitchen"
          ],
          "smells": [
            "freshly brewed coffee",
            "warm pastries baking",
            "the scent of rain-soaked earth"
          ],
          "mood": "introspective calm"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light dulling colors",
            "shadows on the wall from the clouds"
          ],
          "sounds": [
            "the ticking of a clock",
            "the faint sound of dishes being washed",
            "muffled conversations"
          ],
          "smells": [
            "the aroma of simmering sauces",
            "freshly caught fish",
            "the scent of damp wood"
          ],
          "mood": "heavy anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting hues on the ocean",
            "glimmering candle flames on tables"
          ],
          "sounds": [
            "laughter echoing",
            "the clinking of glasses",
            "the sound of waves crashing"
          ],
          "smells": [
            "the scent of grilled seafood",
            "fresh herbs",
            "the aroma of dessert baking"
          ],
          "mood": "celebratory warmth"
        }
      ],
      "paragraphs": [
        "The Oceanfront Dining Room offers a breathtaking view of the sea, where elegantly set tables beckon guests to partake in the culinary delights prepared within. The aroma of freshly baked bread mingles with the salty air, creating an inviting atmosphere that is both luxurious and comforting. Laughter and the soft clinking of cutlery fill the room, but beneath the surface, a current of tension flows as guests remain acutely aware of the unfolding mystery.",
        "As evening descends, the room transforms into a haven of warmth and camaraderie. The glow from the candles dances across the tables, casting flickering shadows that seem to whisper secrets of their own. The distant sound of waves crashing against the shore serves as a reminder of the chaos outside, yet within these walls, a sense of celebration persists. Guests toast to the evening, oblivious to the shadows lurking just beyond their sight, as the night promises to unveil more than just the beauty of the ocean."
      ]
    },
    {
      "id": "beach",
      "name": "The Secluded Beach",
      "type": "exterior",
      "purpose": "Hidden escape and potential evidence site",
      "visualDetails": "A narrow stretch of beach bordered by steep cliffs, with hidden nooks and rocky outcrops.",
      "sensoryDetails": {
        "sights": [
          "waves crashing against rocks",
          "seagulls circling overhead",
          "footprints in wet sand",
          "hidden caves in the cliffs"
        ],
        "sounds": [
          "roaring surf",
          "whispers of the wind",
          "distant calls of seabirds",
          "the crunch of gravel underfoot"
        ],
        "smells": [
          "briny sea air",
          "the scent of wet sand",
          "wild grasses and seaweed",
          "the musk of damp earth"
        ],
        "tactile": [
          "cool wet sand beneath feet",
          "rough texture of rocks",
          "the chill of ocean spray",
          "the warmth of sun on skin"
        ]
      },
      "accessControl": "Difficult access due to steep cliffs; only known to select staff and adventurous guests.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "mist rising from the ocean",
            "grey clouds heavy in the sky"
          ],
          "sounds": [
            "soft patter of rain on sand",
            "distant thunder rumbling",
            "the crash of waves"
          ],
          "smells": [
            "fresh rain on earth",
            "the scent of wet seaweed",
            "damp driftwood"
          ],
          "mood": "mournful isolation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds looming",
            "distant flashes of lightning"
          ],
          "sounds": [
            "the roar of waves",
            "the rustle of grass",
            "soft whispers of wind"
          ],
          "smells": [
            "salt in the air",
            "wet stones",
            "the scent of decaying sea life"
          ],
          "mood": "foreboding tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden hues painting the horizon",
            "stars beginning to twinkle in the sky"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant sound of laughter from the hotel",
            "the rustling of leaves"
          ],
          "smells": [
            "warmth of the setting sun",
            "the scent of blooming wildflowers",
            "fresh ocean breeze"
          ],
          "mood": "serene yet watchful"
        }
      ],
      "paragraphs": [
        "The Secluded Beach lies hidden beneath the towering cliffs, its narrow stretch of sand a refuge for those seeking escape. The roar of the surf is a constant companion, mingling with the cries of seagulls circling above. Footprints in the wet sand hint at recent visitors, while rocky outcrops provide cover for secrets waiting to be uncovered.",
        "As the day unfolds, the beach transforms with the shifting light. In the morning, mist rises from the ocean, casting an ethereal glow over the landscape. The scent of wet seaweed and fresh rain permeates the air, creating an atmosphere of mournful isolation. Yet, as evening approaches, the setting sun bathes the beach in golden hues, offering a moment of serene beauty, even as the shadows deepen, reminding all that danger may lurk just beyond the horizon."
      ]
    }
  ],
  "note": "",
  "cost": 0.002364549,
  "durationMs": 26173
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1941,
    "month": "October",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "overcast skies",
      "occasional rain squalls",
      "a brisk chill in the air"
    ],
    "daylight": "Days grow shorter, with twilight descending by six o'clock in the evening, leading to longer, shadowy nights.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests unwind after dinner.",
    "holidays": [
      "Halloween (October 31)"
    ],
    "seasonalActivities": [
      "attending autumn fairs",
      "enjoying evening walks under falling leaves",
      "engaging in community charity events"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "white dress shirt with a thin tie",
        "polished leather oxfords"
      ],
      "casual": [
        "tweed jacket",
        "corduroy trousers",
        "knit sweater"
      ],
      "accessories": [
        "flat cap",
        "metal wristwatch",
        "silk handkerchief in the breast pocket"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with a cinched waist",
        "pearl necklace",
        "cloche hat"
      ],
      "casual": [
        "tweed skirt and blouse combination",
        "cardigan sweater",
        "ankle boots"
      ],
      "accessories": [
        "leather handbag",
        "silk scarf tied around the neck",
        "vintage brooch"
      ]
    },
    "trendsOfTheMoment": [
      "sartorial elegance with an emphasis on tailoring",
      "use of bold colors and patterns",
      "accessories that reflect individual style"
    ],
    "socialExpectations": [
      "men are expected to wear suits in public",
      "women should maintain a polished appearance",
      "formal dining etiquette is strictly observed"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The United States is deeply embroiled in World War II, with rising tensions and military mobilization",
      "The Lend-Lease Act is in effect, supporting Allied nations",
      "Public concern grows over food rationing and resource shortages"
    ],
    "politicalClimate": "The political atmosphere is charged, with citizens increasingly aware of wartime sacrifices and the need for national unity.",
    "economicConditions": "Wartime economy is in effect, leading to rationing of essentials and rising prices for luxury items.",
    "socialIssues": [
      "gender roles are shifting as women take on more jobs traditionally held by men",
      "racial tensions persist, especially in urban centers",
      "the impact of the war on daily life is palpable, with many families facing loss"
    ],
    "internationalNews": [
      "Germany continues its advances in Europe, creating anxiety about the war's reach",
      "Japan's actions in Asia raise concerns about U.S. interests in the Pacific"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's 'In the Mood'",
        "Duke Ellington's 'Take the 'A' Train'",
        "Bing Crosby's 'I'm Dreaming of a White Christmas'"
      ],
      "films": [
        "Citizen Kane",
        "The Maltese Falcon",
        "Sergeant York"
      ],
      "theater": [
        "The Skin of Our Teeth",
        "The Glass Menagerie"
      ],
      "radio": [
        "The Shadow",
        "Suspense",
        "The Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Catcher in the Rye by J.D. Salinger",
        "For Whom the Bell Tolls by Ernest Hemingway",
        "The Little Prince by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "detective and mystery fiction",
        "war literature",
        "social commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "the photoelectric cell",
        "the electronic computer (in early development)",
        "improvements in radio technology"
      ],
      "commonDevices": [
        "radio receivers in most homes",
        "manual typewriters in offices",
        "early television sets in public spaces"
      ],
      "emergingTrends": [
        "advancements in military technology",
        "increased use of consumer goods due to wartime production",
        "development of synthetic materials"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "Butter: one shilling",
        "A meal at a diner: two shillings"
      ],
      "commonActivities": [
        "visiting local markets for rationed goods",
        "participating in community gatherings",
        "listening to radio broadcasts in the evenings"
      ],
      "socialRituals": [
        "afternoon tea gatherings among women",
        "weekly church services",
        "community charity drives for war efforts"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing awareness of class disparities due to wartime efforts",
      "resentment towards the wealthy who evade service"
    ],
    "gender": [
      "greater acceptance of women in the workforce",
      "debate over traditional gender roles as women take on new responsibilities",
      "increased visibility of female empowerment"
    ],
    "race": [
      "persistent segregation in many areas",
      "growing movements for civil rights, albeit slowly",
      "increased visibility of African American contributions to the war effort"
    ],
    "generalNorms": [
      "community spirit is strong as citizens unite for the war effort",
      "formal behavior is expected in public spaces",
      "patriotism influences social gatherings"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth mingled with the crisp air, leaves crunching underfoot as guests navigate the hotel's lobby.",
    "A low murmur of conversations filled the room, punctuated by the occasional laughter or the clinking of glassware as patrons engaged in hushed discussions.",
    "The flickering light of early electric fixtures cast long shadows on the walls, where the tension of unspoken worries hung palpably in the air."
  ],
  "paragraphs": [
    "On the evening of October 15, 1941, the atmosphere in the hotel was thick with unease. An overcast sky loomed outside, with sporadic rain squalls lashing against the windows, mirroring the simmering tensions among its guests. With the war in Europe escalating, the implications of the conflict weighed heavily on the minds of those gathered, creating an undercurrent of anxiety that seeped into every conversation. Guests, dressed in the fashionable attire of the time, attempted to engage in polite discussions, but the specter of the war loomed larger than any social niceties.",
    "Men in double-breasted suits and women in elegant tea-length dresses mingled under the glow of antique chandeliers, each person trying to maintain appearances while grappling with their own fears. Accessories like silk scarves and polished leather shoes adorned their outfits, showcasing the era's emphasis on sartorial elegance even amidst the chaos of the outside world. The tension was palpable, yet guests were determined to uphold the social expectations of the day, engaging in the rituals of formal dining and evening entertainment, despite the war's shadow.",
    "As the clock ticked closer to midnight, the hotel buzzed with the sounds of laughter and clinking glasses, but beneath the surface, there were whispers of rationing and loss. Prices for basic goods were rising, and the impact of the war was a constant topic of discussion. Community spirit was strong, with many participating in charity drives and evening markets to support those in need. Yet, as guests sipped their drinks and shared stories, the feeling of dread and uncertainty lingered, amplified by the flickering radio broadcasts that filled the air with news from the front lines."
  ],
  "note": "",
  "cost": 0.00109741665,
  "durationMs": 22726
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A masquerade ball at a remote seaside hotel draws a diverse group of guests, where the tension of post-war societal shifts and class distinctions creates a volatile mix of ambition and deception.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Post-WWII adjustments with increased female workforce participation and rigid class distinctions affecting service expectations."
  },
  "setting": {
    "location": "A seaside hotel characterized by Art Deco architecture",
    "institution": "hotel",
    "weather": "overcast with occasional rain squalls"
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
    "id": "footprint_length",
    "value": "twelve inches",
    "description": "The footprints leading away from the scene were precisely twelve inches long."
  },
  {
    "id": "disguise_time",
    "value": "ten minutes past eleven",
    "description": "The murder occurred shortly after ten minutes past eleven, when witnesses last saw the victim."
  },
  {
    "id": "ocean_depth",
    "value": "six feet",
    "description": "The body was found in water that was six feet deep, making it difficult to ascertain the cause of death."
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
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "id": "clue_culprit_direct_dr_mallory_finch",
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
      "id": "clue_early_2",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
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
