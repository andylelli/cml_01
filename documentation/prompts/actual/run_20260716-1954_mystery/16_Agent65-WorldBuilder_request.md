# Actual Prompt Record

- Run ID: `mystery-1784231640128`
- Project ID: ``
- Timestamp: `2026-07-16T19:59:19.280Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `1d5d005b69fe249a`

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
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Cannes",
      "country": "France",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "impersonation"
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
      "private_secret": "Struggles with authority figures",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Reputable physician",
      "private_secret": "Knew too much about local espionage",
      "motive_seed": "inheritance",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Safety and reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority Figure",
      "relationships": [],
      "public_persona": "Naval officer",
      "private_secret": "Involved in smuggling",
      "motive_seed": "Financial gain",
      "motive_strength": "moderate",
      "alibi_window": "narrow",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Seaside promenade",
        "Hotel lobby"
      ],
      "behavioral_tells": [
        "Defensive about past"
      ],
      "stakes": "Reputation and financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Socialite",
      "relationships": [],
      "public_persona": "Charming hostess",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "narrow",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining room",
        "Hotel bar"
      ],
      "behavioral_tells": [
        "Flustered when questioned"
      ],
      "stakes": "Love and social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Maid",
      "relationships": [],
      "public_persona": "Hotel staff",
      "private_secret": "Witnessed too much",
      "motive_seed": "Fear for her safety",
      "motive_strength": "high",
      "alibi_window": "broad",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel rooms"
      ],
      "behavioral_tells": [
        "Nervous around authority"
      ],
      "stakes": "Job security and life",
      "evidence_sensitivity": [
        "low"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Businessman",
      "relationships": [],
      "public_persona": "Wealthy investor",
      "private_secret": "Has dealings with underworld",
      "motive_seed": "Covering up a crime",
      "motive_strength": "high",
      "alibi_window": "narrow",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel office",
        "Outside the hotel"
      ],
      "behavioral_tells": [
        "Evasive when discussing finances"
      ],
      "stakes": "Financial survival",
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
      "summary": "During a grand masquerade ball at a luxurious seaside hotel, Dr. Mallory Finch is found dead, leading Detective Eleanor Voss to uncover a web of deception where authority figures manipulate schedules and identities to conceal their crimes."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "Captain Hale impersonates a hotel authority figure, altering the event schedule to create a false alibi while secretly orchestrating the murder.",
      "delivery_path": [
        {
          "step": "Impersonation of hotel authority to gain trust"
        },
        {
          "step": "Alteration of the event schedule to provide cover"
        },
        {
          "step": "Execution of the murder during the distraction"
        }
      ]
    },
    "outcome": {
      "result": "Dr. Mallory Finch is eliminated as a threat to Captain Hale's smuggling operations."
    }
  },
  "false_assumption": {
    "statement": "Captain Hale was attending the official event at the time of the murder.",
    "type": "authority",
    "why_it_seems_reasonable": "He is a respected naval officer with an established alibi based on schedule.",
    "what_it_hides": "His manipulation of the event schedule to create an alibi."
  },
  "false_solution": {
    "accused_suspect": "Hugo Vane",
    "supporting_points": [
      "Hugo was seen arguing with Dr. Finch earlier in the evening.",
      "Hugo's financial dealings made him a likely suspect for motives related to jealousy."
    ],
    "the_one_flaw": "Hugo was found with an alibi from the hotel staff who confirmed he was in a meeting at the time of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken vase found near the victim's body.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The vase was accidentally knocked over during the chaos of the ball.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A witness claims to have seen Dr. Finch with Hugo Vane shortly before her death.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The witness misidentified the time, as Vane was in a meeting.",
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
        "Event schedule",
        "Murder time"
      ],
      "windows": [
        "10 PM to 10:30 PM"
      ],
      "contradictions": [
        "Event schedule shows Captain Hale was supposed to be at the event, but he was seen near the victim."
      ]
    },
    "access": {
      "actors": [
        "Captain Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "Event schedule",
        "Murder weapon"
      ],
      "permissions": [
        "Captain Hale had access to restricted areas"
      ]
    },
    "physical": {
      "laws": [
        "Sound reflections in the hotel"
      ],
      "traces": [
        "Fabric from Captain Hale's uniform found near the body."
      ]
    },
    "social": {
      "trust_channels": [
        "Authority figures perceived as trustworthy"
      ],
      "authority_sources": [
        "Captain Hale's naval status"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall seeing Captain Hale entering the event room shortly before the murder.",
        "correction": "This contradicts his later claim of attending the event.",
        "effect": "Narrows suspect pool to eliminate Dr. Mallory Finch.",
        "required_evidence": [
          "Witness statements about Hale's entry",
          "Event schedule indicating time of murder"
        ],
        "reader_observable": true
      },
      {
        "observation": "A handwritten note altering the event schedule is found in Hale's room.",
        "correction": "This indicates Hale manipulated the schedule to create his alibi.",
        "effect": "Eliminates the possibility that Hale was truly at the event.",
        "required_evidence": [
          "Altered event schedule",
          "Hale's fingerprints on the note"
        ],
        "reader_observable": true
      },
      {
        "observation": "Fabric matching Hale's uniform is discovered at the crime scene.",
        "correction": "This connects Hale directly to the murder scene.",
        "effect": "Eliminates Captain Hale's alibi regarding his presence.",
        "required_evidence": [
          "Fabric trace found near the victim",
          "Hale's uniform inspection results"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Reenact witnesses' accounts of Hale's alibi by coordinating testimonies with the altered schedule's timings.",
    "knowledge_revealed": "The mismatch between witness accounts and the altered schedule exposes Hale's manipulation.",
    "pass_condition": "If Hale's claimed presence at the event is proven false, he is revealed as the murderer.",
    "evidence_clues": [
      "clue_10",
      "clue_3",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements about Hale's entry (early) and the event schedule (mid) help eliminate Dr. Mallory Finch. Step 2: The altered schedule note (mid) reveals Hale's manipulation. Step 3: Fabric evidence (late) confirms Hale's presence at the crime scene."
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
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Victim confirmed dead at time of alibi",
        "supporting_clues": [
          "clue_mid_1",
          "clue_late_1"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness statements place her elsewhere",
        "supporting_clues": [
          "clue_mid_3",
          "clue_late_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her duties kept her in another part of the hotel",
        "supporting_clues": [
          "clue_early_2",
          "clue_mid_4"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed presence in a meeting",
        "supporting_clues": [
          "clue_early_3",
          "clue_late_3"
        ]
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
        "clue_id": "clue_8",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Fabric matching Hale's uniform"
      },
      {
        "clue_id": "clue_mid_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical evidence"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_13",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "clue_id": "clue_late_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Altered schedule note"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Document review"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness accounts"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A traveling journalist with a keen eye for detail, Eleanor Voss navigates the complexities of truth and deception while haunted by her brother's wartime death.",
    "publicPersona": "Charming and charismatic, known for her insightful articles about local coastal cultures.",
    "privateSecret": "Haunted by her brother's death in the war, which fuels her desire to uncover the truth.",
    "motiveSeed": "Not directly tied to the murder but driven by a personal quest for justice.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the hotel lobby when the crime occurred.",
    "accessPlausibility": "easy",
    "stakes": "Her reputation as a journalist is at stake; she wants to prove her skills.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks with a fluid, engaging rhythm, often using rhetorical questions to draw in her audience. Her dialogue is peppered with literary references, revealing her background and intellect.",
    "signatureTic": "Ah, but isn't that the question of the hour?",
    "internalConflict": "Eleanor grapples with feelings of inadequacy, haunted by her brother's death and driven to find justice not just for him, but for herself.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as it echoes her brother's unresolved fate, and she hopes to find closure through the investigation.",
    "paragraphs": [
      "Eleanor Voss moved through the hotel lobby like a whisper of wind, her presence both inviting and unsettling. A traveling journalist by trade, she had spent years honing her craft, weaving tales of coastal cultures and human resilience. Yet beneath the polished exterior lay a tumultuous sea of grief, a churning current stemming from her brother's death in the war. It was a loss that haunted her, driving her to seek justice not just for him, but for herself, as if each article she penned might somehow exorcise the demons of her past.",
      "On the surface, she appeared charming and charismatic, effortlessly engaging with guests and staff alike. However, the truth was far more complex. Eleanor's desire to uncover the truth about the murder was not merely professional; it was deeply personal. She often found herself reflecting on the fragility of life and the consequences of silence. Each time she caught a glimpse of the victim's lifeless form in her mind, she felt a pang of urgency. This was not just another story; it was her chance to reclaim a piece of herself lost in the fog of war.",
      "As she navigated the labyrinthine corridors of the hotel, Eleanor's instincts sharpened, her journalistic prowess igniting a fire within her. She was determined to prove her skills, to validate her worth as a journalist. Yet, lurking in the shadows of her mind was the nagging fear of inadequacy. What if she failed? What if her pursuit of truth led her to a revelation that shattered her already fragile sense of self? These questions haunted her, but she pushed them aside, driven by a need for resolution.",
      "Her dry wit often surfaced during tense moments, a defense mechanism that allowed her to mask her insecurities. 'Ah, but isn't that the question of the hour?' she would quip, her eyes glinting with determination as she engaged others in conversation. Eleanor understood the power of words, the way they could cut through deception and illuminate the truth. In this high-stakes game of murder and intrigue, she was determined to emerge not just as a journalist, but as a seeker of justice, reclaiming her brother's memory in the process."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected medical doctor grappling with the weight of her own secrets, Dr. Mallory Finch's life hangs in the balance as she faces the consequences of her choices.",
    "publicPersona": "Respected for her contributions to medical practice, particularly in wartime care.",
    "privateSecret": "Has withheld experimental treatment data that could benefit others for personal gain.",
    "motiveSeed": "Could lose her medical license if it comes to light.",
    "motiveStrength": "moderate",
    "alibiWindow": "In her clinic during the time of the murder.",
    "accessPlausibility": "unlikely",
    "stakes": "Her career and reputation are at risk of exposure.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Speaks in a clipped, professional manner, often using medical jargon that may alienate those outside her field. Her tone is serious, reflecting the gravity of her choices.",
    "signatureTic": "We mustn't lose sight of the facts.",
    "internalConflict": "Dr. Finch is torn between her ambition and the ethical implications of her actions, fearing that exposure will ruin her career and reputation.",
    "personalStakeInCase": "This crime matters to Dr. Finch because it threatens to expose her unethical decisions, jeopardizing everything she has worked for.",
    "paragraphs": [
      "Dr. Mallory Finch was a woman of science, a beacon of hope for many who had suffered in the throes of war. Her reputation as a respected medical doctor was built on years of dedication and sacrifice, yet beneath the surface lay a tempest of secrets that could unravel everything she had achieved. With each passing day, the weight of her choices grew heavier, and the fear of exposure loomed like a dark cloud over her career.",
      "In her clinic, where she typically commanded respect and authority, Mallory felt a growing sense of unease. She had withheld crucial experimental treatment data, believing that personal gain justified her actions. 'We mustn't lose sight of the facts,' she would tell herself, but the truth was that she had blurred the lines of ethics in her pursuit of success. The victim, a former patient, had threatened to expose her, and now she found herself ensnared in a web of deceit.",
      "As the news of the murder spread like wildfire, Mallory’s heart raced. She had been in her clinic at the time, yet the very thought of being implicated sent shivers down her spine. Her alibi was tenuous at best, and she knew that if her secrets came to light, her career would be irrevocably shattered. The stakes had never been higher, and the morality of her choices weighed heavily on her conscience.",
      "Dr. Finch's speech was devoid of humor; it was clinical, precise, and often cold. In the midst of chaos, she clung to her professionalism, believing that detachment would shield her from the consequences of her actions. But deep down, she grappled with the realization that her ambition had led her astray. As the investigation unfolded, she would have to confront the moral implications of her choices, facing the truth that the very foundation of her career might crumble under the weight of her secrets."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer with a commanding presence, Captain Ivor Hale struggles with the demons of his past, fearing exposure of his wartime secrets.",
    "publicPersona": "Known for his authoritative presence and stern demeanor; seen as a war hero.",
    "privateSecret": "Struggles with PTSD from his wartime experiences, which he masks with bravado.",
    "motiveSeed": "Fears that the victim might reveal details of his past that would undermine his public image.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be fishing during the timeframe of the murder.",
    "accessPlausibility": "possible",
    "stakes": "His entire reputation and standing in the community could be destroyed.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks in a booming voice, often laced with military jargon. His dialogue is punctuated by self-deprecating remarks that reveal a hidden vulnerability beneath his hardened exterior.",
    "signatureTic": "Well, that's the rub, isn't it?",
    "internalConflict": "Captain Hale battles with PTSD and the fear of being exposed, struggling to reconcile his public persona with the man he truly is.",
    "personalStakeInCase": "This crime matters to Captain Hale because it threatens to unravel the carefully constructed image of heroism he has upheld, exposing the truth of his wartime trauma.",
    "paragraphs": [
      "Captain Ivor Hale strode through the hotel with the gait of a man who once commanded ships and men, his presence both imposing and authoritative. A war hero in the eyes of many, he had earned respect through valor and sacrifice, yet beneath the surface lay a tumultuous struggle with the ghosts of his past. The weight of his experiences in combat pressed heavily on him, manifesting as a relentless PTSD that he masked with bravado and bluster.",
      "In the wake of the murder, his world began to fray at the edges. The victim had threatened to expose secrets from his past, details that could dismantle the carefully crafted image he had built over the years. 'Well, that's the rub, isn't it?' he would mutter to himself, grappling with the reality that his reputation was on the line. Fishing was supposed to be his escape, a chance to clear his mind, yet the act felt hollow in the face of impending crisis.",
      "Ivor’s alibi was flimsy, a mere claim that he had been fishing during the time of the murder. As the investigation progressed, he felt the walls closing in, a suffocating reminder that his past could catch up with him at any moment. The stakes were higher than ever; his entire standing in the community could be obliterated if the truth were to surface. A sense of urgency gnawed at him, compelling him to act, to protect the facade that had become his life.",
      "Despite his self-deprecating humor, which often surfaced in moments of tension, Ivor found it increasingly difficult to maintain his composure. The bravado he had relied upon for so long began to waver, revealing a man who was not just a captain but a human being grappling with vulnerability. As the truth of the murder unfolded, he would be forced to confront not only the specter of exposure but also the demons that had haunted him long before this crime had ever occurred."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A cheerful hotel staff member with a penchant for naivety, Beatrice Quill's world is turned upside down as her small embezzlements threaten to unravel her future.",
    "publicPersona": "Cheerful and eager, always willing to help guests at the hotel.",
    "privateSecret": "Has been embezzling small amounts from the hotel for her own personal expenses.",
    "motiveSeed": "Could be implicated if discovered, as the victim threatened to report her.",
    "motiveStrength": "moderate",
    "alibiWindow": "Busy serving guests in the dining area at the time of the murder.",
    "accessPlausibility": "easy",
    "stakes": "Her job and future could be at risk if her theft is exposed.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks in an upbeat, bubbly manner, often using exclamations and informal language. Her speech is punctuated by nervous laughter, reflecting her anxiety about her secrets.",
    "signatureTic": "Oh dear, what a predicament!",
    "internalConflict": "Beatrice struggles with guilt over her embezzlement, torn between her desire for financial security and the fear of losing her job.",
    "personalStakeInCase": "This crime matters to Beatrice because her small thefts could come to light, jeopardizing her job and her future.",
    "paragraphs": [
      "Beatrice Quill floated through the hotel like a ray of sunshine, her cheerful demeanor brightening the day for guests and staff alike. As a member of the hotel staff, she was eager to please, always ready with a smile and a helping hand. Yet beneath that bubbly exterior lay a secret that threatened to dim her light: she had been embezzling small amounts from the hotel, convinced that her actions were justified by her mounting personal expenses.",
      "In the wake of the murder, Beatrice found herself caught in a web of anxiety and fear. The victim had threatened to expose her, and the very thought sent shivers down her spine. 'Oh dear, what a predicament!' she would exclaim, her laughter tinged with nervousness as she served guests in the dining area, desperately trying to maintain her composure. Her alibi was solid—she had been busy during the murder—but the shadows of her actions loomed large, threatening to engulf her.",
      "Her self-deprecating humor often surfaced in moments of stress, a way to deflect attention from her inner turmoil. 'Well, I suppose I’ve always had a knack for getting myself into trouble,' she would chuckle, attempting to lighten the mood. Yet, the stakes were high, and each giggle felt more like a desperate plea than a genuine laugh. Beatrice was acutely aware of the consequences of her actions; if discovered, her job and future would be at risk, and the thought of facing that reality was unbearable.",
      "As the investigation unfolded, Beatrice grappled with her guilt and the fear of exposure. She was not a criminal by nature but a naive young woman trying to navigate a difficult world. This crime mattered to her not just as a potential scandal but as a chance to confront the choices she had made. In the depths of her heart, she longed for honesty and integrity, hoping to find a way to emerge from the shadows and reclaim her sense of self."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A cunning art dealer with a knack for manipulation, Sylvia Trent's carefully constructed empire teeters on the brink as her dark dealings threaten to unravel.",
    "publicPersona": "A savvy negotiator known for successful art deals and a keen eye for talent.",
    "privateSecret": "Has been involved in a black market scheme to sell forged artworks.",
    "motiveSeed": "The victim discovered her scheme and threatened to expose her unless she paid him off.",
    "motiveStrength": "strong",
    "alibiWindow": "Attending a gallery opening across town.",
    "accessPlausibility": "unlikely",
    "stakes": "Her entire livelihood and empire could collapse if exposed.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Speaks with a sharp, incisive tone, often using sarcasm to mask her unease. Her dialogue is laced with clever wordplay, reflecting her cunning nature.",
    "signatureTic": "After all, who doesn’t love a good scandal?",
    "internalConflict": "Sylvia grapples with the moral implications of her actions, fearing that exposure could lead to the collapse of her empire and the loss of her carefully curated identity.",
    "personalStakeInCase": "This crime matters deeply to Sylvia as it threatens to expose her black market dealings, jeopardizing her livelihood and the empire she has built.",
    "paragraphs": [
      "Sylvia Trent was a woman who thrived on the thrill of the deal, her keen eye for talent and negotiation skills propelling her to the upper echelons of the art world. A cunning art dealer, she had built an empire on the foundation of shrewd business practices and a penchant for manipulation. Yet, beneath the polished surface of her public persona lay a dark secret: she was involved in a black market scheme to sell forged artworks. The victim had discovered her scheme, and now the stakes were higher than ever.",
      "Attending a gallery opening across town at the time of the murder, Sylvia felt the tension in her chest tighten as she contemplated the implications of the crime. 'After all, who doesn’t love a good scandal?' she would smirk, her sardonic humor a mask for the unease that gnawed at her. The threat of exposure loomed large, a specter that could dismantle her carefully constructed empire, leaving her reputation in tatters.",
      "Her speech was sharp, incisive, and often laced with sarcasm, a reflection of her cunning nature. Sylvia had mastered the art of wordplay, using her wit to deflect attention from her vulnerabilities. Yet, as the investigation unfolded, her bravado began to waver. The moral implications of her actions weighed heavily on her conscience, forcing her to confront the reality of her choices. Would she continue to dance on the edge of deception, or would she be forced to reckon with the truth?",
      "As the pieces of the puzzle began to fit together, Sylvia found herself at a crossroads. This crime mattered deeply to her, not just as a potential scandal but as a reckoning of her own identity. The fear of exposure threatened to unravel everything she had worked for, and as the truth loomed closer, she would have to grapple with the consequences of her deceitful choices and the moral implications of her actions."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A private investigator with a reputation for unconventional methods, Hugo Vane's past catches up with him as he faces the consequences of his reckless behavior.",
    "publicPersona": "A known private investigator with a reputation for unconventional methods.",
    "privateSecret": "Struggles with gambling debts that could ruin him if unresolved.",
    "motiveSeed": "The victim was a previous client who caught wind of Hugo's unethical practices.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be working a case across town.",
    "accessPlausibility": "possible",
    "stakes": "His professional integrity and financial stability are on the line.",
    "humourStyle": "blunt",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks in a straightforward, no-nonsense manner, often cutting to the chase. His dialogue is peppered with blunt observations that reveal his cynical worldview.",
    "signatureTic": "Life’s a gamble, isn’t it?",
    "internalConflict": "Hugo grapples with the consequences of his reckless behavior and the impact of his choices on his professional integrity and financial stability.",
    "personalStakeInCase": "This crime matters to Hugo because it threatens to expose his unethical practices and gambling debts, jeopardizing his career and future.",
    "paragraphs": [
      "Hugo Vane was a private investigator with a reputation for unconventional methods, a man who thrived in the murky waters of moral ambiguity. With a penchant for blunt observations and a cynical worldview, he navigated the world of crime and deceit with a certain reckless abandon. Yet beneath the bravado lay a man grappling with the consequences of his choices, particularly his mounting gambling debts that threatened to unravel his life.",
      "When the news of the murder broke, Hugo felt the weight of his past closing in around him. The victim had been a previous client who had caught wind of his unethical practices, and now the stakes were higher than he could bear. 'Life’s a gamble, isn’t it?' he would quip, masking his anxiety with a sardonic edge. His alibi, claiming to be working a case across town, felt flimsy as the investigation began to unfold, and he knew that the truth could shatter the fragile facade he had built.",
      "His speech was straightforward and no-nonsense, a reflection of his personality. Hugo had never been one for flowery language or pleasantries; he cut to the chase, revealing the raw essence of his thoughts. Yet as the investigation progressed, he found himself grappling with the reality of his situation. His professional integrity was on the line, and the thought of exposure sent shivers down his spine.",
      "As the pieces of the puzzle began to fit together, Hugo faced the daunting prospect of confronting his reckless behavior. This crime mattered to him not just as a potential scandal but as a reckoning of his own choices. The truth loomed large, threatening to expose the man he had become and the consequences of his actions, forcing him to grapple with the reality that life was indeed a gamble, and he was running out of chips."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Azure Crest Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel with art deco elegance, overlooking the turbulent English Channel.",
    "visualDescription": "A striking facade of curved glass and chrome, adorned with nautical motifs that reflect the seaside theme. Inside, the lobby boasts polished marble floors, towering palm trees, and plush seating areas, all framed by large windows revealing the stormy sea beyond.",
    "atmosphere": "A blend of luxury and tension, with whispers of intrigue hanging in the salty air.",
    "paragraphs": [
      "The Azure Crest Hotel stands defiantly against the onslaught of the windswept English Channel, its art deco silhouette cutting a striking figure against the overcast sky. Nautical themes adorn the lobby, where polished marble floors gleam under the soft glow of retro lighting. Guests shuffle in and out, their voices a low murmur against the backdrop of crashing waves. Yet, beneath the veneer of elegance, a palpable tension simmers, fueled by rumors of espionage that flit through the corridors like restless spirits.",
      "As the sea-breeze carries the scent of salt and secrets, the hotel’s narrow hallways create an atmosphere of isolation, each door hiding its own mysteries. The elegant furnishings and decor, while inviting, seem to watch with judgement, as if they too are aware of the dark undercurrents swirling within the opulent walls. Every creak of the floorboards echoes the unspoken fears of the guests, all seeking refuge from a world fraught with uncertainty.",
      "The Azure Crest is more than a hotel; it is a stage for a masquerade of authority, where each guest plays their part in a drama of intrigue. Shadows gather in the corners, and whispers travel quickly, as the promise of escape collides with the reality of a cliffside prison, isolating them from the outside world. The air is thick with expectation, and the stakes rise with every passing hour, as the clock ticks down to a revelation that could shatter the calm facade."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional sea breezes and the smell of salt in the air",
    "timeFlow": "Three days of mounting tension culminating in a stormy revelation",
    "mood": "tense and suspenseful, heightened by recent local rumors of espionage",
    "eraMarkers": [
      "manual typewriters in the lobby",
      "early radio broadcasts in lounge",
      "rationed fuel limiting travel"
    ],
    "sensoryPalette": {
      "dominant": "Salt-tinged air with a hint of dread",
      "secondary": [
        "Soft whispers of suspicion",
        "Distant thunder of approaching storms"
      ]
    },
    "paragraphs": [
      "The atmosphere within The Azure Crest Hotel is thick with anticipation, as looming clouds roll across the horizon, casting a grey pall over the elegant surroundings. Guests, wrapped in layers of fine wool and silk, exchange furtive glances, their conversations punctuated by the crash of waves against the cliffs. The scent of salt mingles with the faint aroma of fresh pastries from the kitchen, a deceptive reminder of the comforts that exist within this turbulent world.",
      "As the day drifts toward dusk, the tension escalates. The distant rumble of thunder mirrors the unease in the air, while the flickering light from the ornate sconces casts long shadows across the marble floors. The sound of a manual typewriter clicks away in a corner, a solitary figure buried in correspondence, unaware of the danger lurking just beyond the walls. The hotel, with its grand architecture and whispers of luxury, becomes a labyrinth of secrets, where every corner may hold a clue—or a threat."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space, first impression",
      "visualDetails": "Polished marble floors, large nautical murals, palm trees in planters",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate art deco chandeliers",
          "nautical-themed murals",
          "dark wood reception desk",
          "large windows framing the sea"
        ],
        "sounds": [
          "soft murmurs of conversation",
          "clinking of glasses",
          "distant waves crashing",
          "the hum of a radio",
          "the rustle of silk dresses"
        ],
        "smells": [
          "freshly brewed coffee",
          "salt in the air",
          "polished wood",
          "citrus from the bar",
          "old leather"
        ],
        "tactile": [
          "cool marble underfoot",
          "soft fabric of armchairs",
          "smooth wood of the reception desk",
          "silk scarves brushing against skin",
          "stiffness of formal attire"
        ]
      },
      "accessControl": "Open to guests and visitors during lobby hours; restricted access to staff-only areas behind the reception.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "light rain",
          "sights": [
            "raindrops on window panes",
            "mist across the ocean",
            "damp umbrellas in use",
            "grey light filtering through clouds",
            "wet marble reflections"
          ],
          "sounds": [
            "steady patter of rain",
            "muffled voices from the bar",
            "soft music from a radio",
            "water trickling from gutters",
            "the rustle of newspapers"
          ],
          "smells": [
            "fresh rain on pavement",
            "damp fabric",
            "citrus from the bar",
            "coffee brewing",
            "salt mixed with rain"
          ],
          "mood": "oppressive and heavy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "soft grey light",
            "shadows lengthening",
            "clouds gathering overhead",
            "the flutter of curtains",
            "guests in dark attire"
          ],
          "sounds": [
            "silence punctuated by laughter",
            "the tick of a clock",
            "the rustle of newspapers",
            "clinking of glasses",
            "a radio crackling"
          ],
          "smells": [
            "old leather",
            "dust from the bookshelves",
            "beeswax from polished surfaces",
            "the scent of damp wool",
            "lingering tobacco"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "glimmer of polished silverware",
            "long shadows from the chandeliers",
            "guests in evening wear",
            "the last light of sunset"
          ],
          "sounds": [
            "soft piano music",
            "clinking of glasses",
            "laughter echoing",
            "the murmur of conversation",
            "distant waves crashing"
          ],
          "smells": [
            "candle wax",
            "fresh pastries",
            "the scent of perfume",
            "coffee brewing",
            "old books"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Azure Crest Hotel is a spectacle of elegance and charm, designed to impress guests upon their arrival. Polished marble floors glisten under the glow of ornate art deco chandeliers, while large nautical murals evoke the spirit of the sea. Guests lounge in plush armchairs, their conversations a soft murmur against the distant roar of the waves crashing below. Yet, despite the beauty surrounding them, an undercurrent of tension lingers in the air, as rumors of espionage stir unease among the patrons.",
        "As day transitions to evening, the lobby transforms into a stage for intrigue. Candlelight flickers on tables, casting dancing shadows across the marble. The scent of fresh pastries wafts from the café, mingling with the salt-tinged air. The atmosphere thickens as guests, dressed in their finest, exchange furtive glances, each one acutely aware that the next conversation could unveil secrets long kept hidden."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Oceanview Dining Room",
      "type": "interior",
      "purpose": "Dining and socializing space",
      "visualDetails": "Expansive windows overlooking the sea, elegantly set tables, nautical decor",
      "sensoryDetails": {
        "sights": [
          "expansive ocean views",
          "elegantly set tables",
          "polished silverware glinting",
          "fresh flowers at each table",
          "art deco light fixtures"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft music from a gramophone",
          "laughter echoing",
          "waitstaff moving quietly",
          "the murmur of conversation"
        ],
        "smells": [
          "freshly baked bread",
          "grilled fish",
          "butter and herbs",
          "the scent of citrus",
          "wine aging in barrels"
        ],
        "tactile": [
          "smooth tablecloths",
          "cool glassware",
          "firm wooden chairs",
          "soft linen napkins",
          "the warmth of freshly baked bread"
        ]
      },
      "accessControl": "Open to guests during meal times; private events may restrict access.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "light rain",
          "sights": [
            "raindrops on window glass",
            "clouds obscuring the horizon",
            "dim lighting from the fixtures",
            "wet tablecloths",
            "guests in raincoats"
          ],
          "sounds": [
            "soft patter of rain",
            "quiet conversations",
            "the rustle of newspapers",
            "clinking of coffee cups",
            "the hum of the kitchen"
          ],
          "smells": [
            "freshly brewed coffee",
            "buttery croissants",
            "the scent of the sea",
            "damp wool",
            "citrus fruit"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light filtering through clouds",
            "shadows on the tables",
            "guests in muted colors",
            "the flicker of candlelight",
            "dark clouds on the horizon"
          ],
          "sounds": [
            "the murmur of conversation",
            "clinking of glasses",
            "soft music from the gramophone",
            "the rustle of menus",
            "the sound of waves crashing"
          ],
          "smells": [
            "grilled fish",
            "fresh herbs",
            "the scent of wine",
            "buttery pastries",
            "the salty air"
          ],
          "mood": "melancholic anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting a golden glow",
            "candles flickering on tables",
            "guests in evening attire",
            "polished silverware shining",
            "the ocean reflecting the twilight"
          ],
          "sounds": [
            "laughter and conversation",
            "clinking of glasses",
            "the soft strains of music",
            "the distant sound of waves",
            "the rustle of evening gowns"
          ],
          "smells": [
            "fine wine",
            "freshly caught seafood",
            "the scent of spices",
            "the aroma of dessert",
            "the crispness of the evening air"
          ],
          "mood": "elegant celebration"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room offers a breathtaking panorama of the English Channel, with expansive windows framing the tumultuous sea. Elegantly set tables invite guests to indulge in culinary delights, while polished silverware glints under the soft glow of art deco light fixtures. The atmosphere is both refined and charged, as laughter mingles with the clinking of cutlery, masking the undercurrents of suspicion that weave through the conversations. Each meal feels like a performance, where hidden motives lurk just beneath the surface of polite discourse.",
        "As the evening unfolds, the dining room transforms into a haven of elegance. Candlelight flickers on tables, casting a warm glow over the guests in their finest attire. The scent of freshly caught seafood mixes with the aroma of fine wine, creating an intoxicating blend that heightens the senses. Yet, amidst the laughter and clinking glasses, an air of tension prevails, as each guest wonders who among them may hold secrets that could alter the course of their lives."
      ]
    },
    {
      "id": "library",
      "name": "The Hotel Library",
      "type": "interior",
      "purpose": "Quiet reading and contemplation space",
      "visualDetails": "Rows of bookshelves, comfortable armchairs, dim lighting",
      "sensoryDetails": {
        "sights": [
          "rows of leather-bound books",
          "faded armchairs",
          "dimly lit corners",
          "a globe in the corner",
          "the glow of a reading lamp"
        ],
        "sounds": [
          "soft rustle of pages",
          "distant whispers",
          "the creak of old wood",
          "the ticking of a clock",
          "the crackle of a fireplace"
        ],
        "smells": [
          "old paper and leather",
          "wood polish",
          "the scent of tobacco",
          "the aroma of fresh coffee",
          "dust motes in sunlight"
        ],
        "tactile": [
          "worn leather armchair",
          "smooth pages of books",
          "the coolness of a glass of whiskey",
          "the rough texture of an old spine",
          "the warmth of a blanket draped over a chair"
        ]
      },
      "accessControl": "Open to guests during the day; locked after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "light rain",
          "sights": [
            "soft light filtering through rain",
            "water droplets on window panes",
            "bookshelves glistening with moisture",
            "faded armchairs in shadows",
            "clouds obscuring the sun"
          ],
          "sounds": [
            "steady patter of rain",
            "the rustle of pages turning",
            "soft whispers",
            "the crackle of the fireplace",
            "the ticking of a clock"
          ],
          "smells": [
            "damp wood",
            "old leather",
            "the scent of rain",
            "fresh coffee brewing",
            "the aroma of wet paper"
          ],
          "mood": "reflective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim lighting casting shadows",
            "the glow of a reading lamp",
            "the dust floating in the air",
            "books stacked haphazardly",
            "the flicker of a candle"
          ],
          "sounds": [
            "the soft rustle of pages",
            "the ticking of a clock",
            "distant whispers from the lobby",
            "the creak of a chair",
            "the crackle of the fireplace"
          ],
          "smells": [
            "old paper and ink",
            "the scent of wood polish",
            "the aroma of tobacco",
            "the faint scent of coffee",
            "dust in the air"
          ],
          "mood": "quiet introspection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "shadows deepening in the corners",
            "the glow of a reading lamp",
            "guests reading by the fireplace",
            "the silhouette of a globe"
          ],
          "sounds": [
            "the crackle of the fireplace",
            "the soft rustle of pages turning",
            "the ticking of a clock",
            "distant laughter from the lobby",
            "the low hum of conversation"
          ],
          "smells": [
            "the scent of burning wood",
            "freshly brewed coffee",
            "the aroma of leather",
            "the faint scent of whiskey",
            "the mustiness of old books"
          ],
          "mood": "intimate gathering"
        }
      ],
      "paragraphs": [
        "The Hotel Library is a sanctuary of solitude, where the scent of old paper and leather mingles with the warm glow of dim lighting. Rows of leather-bound books line the shelves, beckoning guests to explore the worlds within their pages. Comfortable armchairs invite quiet contemplation, as whispers of conversation drift in from the lobby, interrupted only by the soft rustle of turning pages. In this refuge, secrets are kept and stories unfold, each book a vessel of hidden knowledge.",
        "As twilight descends, the library transforms into a haven of intimacy. Candlelight flickers softly, casting dancing shadows on the walls. The crackle of the fireplace provides a soothing backdrop, while the scent of freshly brewed coffee wafts gently through the air. Guests settle into the worn leather armchairs, their voices hushed as they share tales of adventure and intrigue. In this space, the lines between reality and fiction blur, and the mysteries of the hotel unfold like the pages of a well-loved novel."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Outdoor gathering and observation space",
      "visualDetails": "Panoramic views of the ocean, wrought iron railings, scattered tables and chairs",
      "sensoryDetails": {
        "sights": [
          "panoramic views of the English Channel",
          "wrought iron railings",
          "scattered tables with umbrellas",
          "the horizon meeting the sea",
          "clouds gathering ominously"
        ],
        "sounds": [
          "the roar of waves below",
          "the wind rustling through plants",
          "laughter from guests",
          "the distant sound of music",
          "the clinking of glasses"
        ],
        "smells": [
          "fresh sea air",
          "the scent of blooming flowers",
          "salt on the breeze",
          "the aroma of grilled food",
          "the faint scent of sunscreen"
        ],
        "tactile": [
          "the chill of the evening breeze",
          "cool metal of railings",
          "smooth texture of tabletops",
          "the warmth of the sun on skin",
          "the softness of cushions"
        ]
      },
      "accessControl": "Open to guests during the day, locked after sunset.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "light rain",
          "sights": [
            "mist over the ocean",
            "raindrops on the terrace",
            "grey clouds overhead",
            "the glistening of wet surfaces",
            "distant boats bobbing"
          ],
          "sounds": [
            "steady patter of rain",
            "the roar of waves crashing",
            "the rustle of umbrellas",
            "distant laughter",
            "the hum of the city below"
          ],
          "smells": [
            "damp earth",
            "fresh rain",
            "the scent of wet metal",
            "the saltiness of the sea",
            "the aroma of fresh coffee"
          ],
          "mood": "mournful solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds rolling in",
            "the churning sea below",
            "glistening wet surfaces",
            "hues of grey and blue",
            "guests huddled under umbrellas"
          ],
          "sounds": [
            "the wind howling",
            "the crash of waves",
            "laughter mingling with the wind",
            "the rustle of fabric",
            "the distant sound of conversation"
          ],
          "smells": [
            "the scent of salt and seaweed",
            "the aroma of grilled food",
            "the freshness of the ocean air",
            "the faint scent of sunscreen",
            "the smell of rain on pavement"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the sky",
            "twinkling lights from the hotel",
            "the ocean reflecting hues of orange",
            "guests silhouetted against the horizon",
            "stars beginning to appear"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "laughter and music from below",
            "the rustle of leaves in the breeze",
            "the clinking of glasses",
            "the distant sound of a saxophone"
          ],
          "smells": [
            "the scent of grilled seafood",
            "fresh sea air",
            "the aroma of cocktails",
            "the faint scent of flowers",
            "the warmth of the sun fading"
          ],
          "mood": "romantic intimacy"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers breathtaking panoramic views of the English Channel, where the horizon meets the turbulent sea. Wrought iron railings frame scattered tables beneath colorful umbrellas, inviting guests to enjoy the fresh sea air. Laughter mingles with the roar of waves below, creating a lively atmosphere that feels almost carefree. Yet, as clouds gather ominously, a sense of foreboding lingers, hinting at the secrets that may emerge from the depths of the ocean.",
        "As evening descends, the terrace transforms into a magical escape. The sunset paints the sky in shades of orange and pink, while twinkling lights from the hotel cast a warm glow over the guests. The air is filled with the scent of grilled seafood and cocktails, as laughter and music drift through the cooling breeze. In this enchanting space, guests find themselves drawn together, sharing stories and secrets as the stars begin to twinkle overhead, oblivious to the storm brewing just beyond the shoreline."
      ]
    }
  ],
  "note": "",
  "cost": 0.0027484297499999998,
  "durationMs": 54189
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1941,
    "month": "November",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast skies with sporadic drizzle",
      "cool sea breezes carrying the scent of salt",
      "occasional bursts of sunshine breaking through the clouds"
    ],
    "daylight": "Short days with twilight settling in around four o'clock in the afternoon",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Thanksgiving preparations begin, celebrated on the fourth Thursday of November"
    ],
    "seasonalActivities": [
      "gathering for seasonal fairs and local markets",
      "attending lectures or political debates at community centers",
      "enjoying warm drinks in cafés as the temperatures drop"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits in dark colors",
        "crisp white dress shirts with high collars",
        "silk ties in muted tones or subtle patterns"
      ],
      "casual": [
        "tweed jackets with elbow patches",
        "corduroy pants in earth tones",
        "knit sweaters worn over collared shirts"
      ],
      "accessories": [
        "fedora hats or flat caps",
        "leather gloves",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dresses with fitted waists",
        "long-sleeve blouses with high necklines",
        "fur-trimmed coats for evening wear"
      ],
      "casual": [
        "A-line skirts paired with fitted cardigans",
        "simple blouses in floral patterns",
        "tailored trousers for a more practical look"
      ],
      "accessories": [
        "string of pearls or simple gold chains",
        "felt hats with decorative ribbons",
        "stylish gloves"
      ]
    },
    "trendsOfTheMoment": [
      "the popularity of jazz and swing music",
      "increasing interest in detective novels and espionage themes",
      "utilization of bold prints and colors in evening wear"
    ],
    "socialExpectations": [
      "expectation for women to maintain traditional roles while entering the workforce",
      "men expected to uphold a stoic demeanor in public",
      "emphasis on community engagement and civic duty during wartime"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The attack on Pearl Harbor on December 7, 1941, looming on the horizon",
      "Increased military enlistment and preparation for war",
      "Growing tensions and espionage allegations amidst the Cold War climate"
    ],
    "politicalClimate": "A climate of uncertainty with rising fears of espionage and political betrayal as the U.S. inches closer to entering World War II.",
    "economicConditions": "Rationing of goods begins to take hold, affecting everything from food to clothing; inflation begins to rise due to wartime spending.",
    "socialIssues": [
      "Debates on women's roles in the workforce and society",
      "Discussions surrounding civil rights and racial equality",
      "Heightened suspicion toward foreigners and espionage-related concerns"
    ],
    "internationalNews": [
      "Reports of war atrocities in Europe and Asia",
      "Increased propaganda efforts to boost morale at home",
      "Updates on the progress of various military campaigns overseas"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Duke Ellington's 'Take the 'A' Train'",
        "Bing Crosby's renditions of classic tunes",
        "Glenn Miller's big band sound gaining popularity"
      ],
      "films": [
        "The Maltese Falcon released in October 1941",
        "Citizen Kane, an innovative cinematic masterpiece",
        "Suspicion, a thriller with a twist ending"
      ],
      "theater": [
        "Oklahoma!, a groundbreaking musical",
        "The Glass Menagerie, showcasing family dynamics",
        "Various vaudeville acts and performances in local theaters"
      ],
      "radio": [
        "The Shadow, a crime drama captivating audiences",
        "Fireside Chats by President Roosevelt connecting with citizens",
        "Amos 'n' Andy, a popular comedy show"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Thin Man by Dashiell Hammett",
        "The Postman Always Rings Twice by James M. Cain",
        "The Grapes of Wrath by John Steinbeck"
      ],
      "popularGenres": [
        "detective fiction and noir",
        "historical novels set during wartime",
        "romance reflecting the changing social dynamics"
      ]
    },
    "technology": {
      "recentInventions": [
        "The first electronic computer prototype begins development",
        "Advancements in radio technology for clearer broadcasts",
        "Early models of television sets becoming available"
      ],
      "commonDevices": [
        "Radios as a staple in most households",
        "Manual typewriters for correspondence and work",
        "Basic electrical appliances such as toasters and refrigerators"
      ],
      "emergingTrends": [
        "Increased reliance on radio for news and entertainment",
        "Shift towards more modernist designs in home interiors",
        "Growth of community centers for social and political engagement"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pound of butter: one shilling",
        "A movie ticket: one shilling sixpence"
      ],
      "commonActivities": [
        "Attending community meetings or local gatherings",
        "Participating in wartime efforts through volunteering",
        "Gathering for family dinners as a social ritual"
      ],
      "socialRituals": [
        "Evening gatherings for games and socializing",
        "Participating in church services or community events",
        "Sharing news and stories over coffee at local cafés"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "A growing divide between the wealthy and working-class citizens",
      "Increased awareness and activism around labor rights",
      "Skepticism towards authority figures and government"
    ],
    "gender": [
      "Women encouraged to take on jobs previously held by men",
      "Societal pressure for women to balance work and family life",
      "Expectations for men to return to traditional roles after the war"
    ],
    "race": [
      "Racial tensions simmering due to wartime propaganda",
      "Growing awareness of civil rights issues among black Americans",
      "Continued segregation in many parts of the country"
    ],
    "generalNorms": [
      "Norms of politeness and decorum in public settings",
      "An emphasis on community solidarity during wartime",
      "Increased scrutiny of personal and family loyalty"
    ]
  },
  "atmosphericDetails": [
    "The crisp air carries the briny scent of the nearby sea, mixing with the aromas of roasted chestnuts from street vendors.",
    "The muted sounds of jazz waft through the air, punctuated by the distant clatter of typewriters as patrons busy themselves in the hotel lounge.",
    "Flickering shadows dance on the walls, created by the dim light of lamps, as guests whisper rumors of espionage and intrigue."
  ],
  "paragraphs": [
    "In the midst of November 1941, the world feels heavy with anticipation. Overcast skies linger over the coastal hotel, where a chill in the air is matched only by the tension surrounding the guests. The scent of salt wafts in from the nearby sea, mingling with the warmth of roasted chestnuts from vendors setting up their stalls for the coming Thanksgiving holiday. As twilight descends, the dim light casts long shadows in the lounge, where hushed conversations reveal the growing paranoia about espionage, stirring suspicions amongst the patrons.",
    "Fashion during this time reflects both the era's elegance and the practicalities of wartime. Men don double-breasted wool suits in dark hues, accompanied by crisp white shirts and silk ties, projecting an air of authority even in uncertain times. Women, too, embrace sophistication with tea-length dresses cinched at the waist and fur-trimmed coats that flutter as they navigate the drafty halls. Accessories like pocket watches and stringed pearls complete their looks, embodying a sense of resilience and style amidst societal change.",
    "Daily life is punctuated by the rhythms of community engagement; people gather for lectures on pressing political issues, share news over coffee in bustling cafés, or attend church services, where discussions of faith intertwine with the pressing matters of the day. Prices reflect the strain of wartime, with a loaf of bread costing four pence, while movie tickets provide a modest escape for those seeking distraction. As the Cold War looms on the horizon, social expectations shift, compelling women into the workforce and redefining the roles of men, all while the jazz rhythms of the era provide a soundtrack to both celebration and anxiety."
  ],
  "note": "",
  "cost": 0.0012852509999999998,
  "durationMs": 20035
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A masquerade ball at a grand seaside hotel draws together a diverse group of guests, all under the scrutiny of Cold War tensions and local espionage rumors, creating an atmosphere ripe for deception and intrigue.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Post-WWII recovery with women entering the workforce, heightened suspicion among social classes due to the threat of espionage."
  },
  "setting": {
    "location": "A grand seaside hotel featuring art deco architecture with a view of the ocean.",
    "institution": "hotel",
    "weather": "overcast with occasional sea breezes and the smell of salt in the air."
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
    "id": "costume_identicality",
    "value": "two identical outfits",
    "description": "Two guests were seen wearing identical clothing just before the incident."
  },
  {
    "id": "fabric_location",
    "value": "the fabric was found near the scene",
    "description": "A piece of fabric that matched the costumes was located close to where the murder occurred."
  },
  {
    "id": "clock_time_discrepancy",
    "value": "ten minutes past eleven",
    "description": "The clock in the lobby showed a different time than noted by witnesses."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 22,
  "countsByPlacement": {
    "early": 7,
    "mid": 14,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 21,
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
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_4",
      "placement": "mid",
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
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_8",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_9",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_13",
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
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_mid_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_3",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_2",
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
