# Actual Prompt Record

- Run ID: `mystery-1778698718990`
- Project ID: ``
- Timestamp: `2026-05-13T19:01:49.059Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `c4b9b70d816e9bfe`

## Message 1 (role=system)

```text
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
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
  - storyEmotionalArc.arcDescription MUST be at least 300 words across multiple paragraphs.
    A single-paragraph summary is insufficient regardless of word count — the emotional
    journey must unfold across clearly distinct paragraphs.
    Trace opening → rising tension → first turn → mid → second turn → climax → resolution.
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
    "author": "Unknown",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Country house estate (Manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical alibi"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "spouse of the victim"
      ],
      "public_persona": "socialite",
      "private_secret": "struggling with financial pressures",
      "motive_seed": "jealousy over financial mismanagement",
      "motive_strength": "moderate",
      "alibi_window": "during the family gathering",
      "access_plausibility": "high",
      "opportunity_channels": [
        "spouse's study",
        "garden"
      ],
      "behavioral_tells": [
        "nervous when discussing finances"
      ],
      "stakes": "preserving family reputation",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "expert witness",
      "relationships": [
        "family friend"
      ],
      "public_persona": "respected physician",
      "private_secret": "treating victim for a chronic illness",
      "motive_seed": "financial gain from life insurance",
      "motive_strength": "low",
      "alibi_window": "after dinner until late",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "study",
        "library"
      ],
      "behavioral_tells": [
        "anxiety when discussing the victim's health"
      ],
      "stakes": "reputation and practice",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "non-binary"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [
        "former lover of Eleanor"
      ],
      "public_persona": "military officer",
      "private_secret": "in love with Eleanor still",
      "motive_seed": "revenge for being spurned",
      "motive_strength": "high",
      "alibi_window": "during the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "garden",
        "study"
      ],
      "behavioral_tells": [
        "defensive about past relationship"
      ],
      "stakes": "personal redemption",
      "evidence_sensitivity": [
        "low"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "50-60",
      "role_archetype": "housekeeper",
      "relationships": [
        "servant to the family"
      ],
      "public_persona": "dedicated employee",
      "private_secret": "knows more than she lets on",
      "motive_seed": "protection of the family reputation",
      "motive_strength": "moderate",
      "alibi_window": "during the incident",
      "access_plausibility": "high",
      "opportunity_channels": [
        "study",
        "kitchen"
      ],
      "behavioral_tells": [
        "overly calm during investigation"
      ],
      "stakes": "job security",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Eleanor Voss"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "A lavish gathering at the Voss manor turns deadly when Eleanor Voss's spouse is found murdered, with a mechanical clock showing the wrong time as the key to the mystery."
    },
    "accepted_facts": [
      "The victim was found dead in the study.",
      "The clock in the study stopped at a specific time.",
      "Witnesses claim they last saw the victim alive at a different time."
    ],
    "inferred_conclusions": [
      "The clock's time discrepancy suggests tampering.",
      "Eleanor had the most access to the study."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock was wound back to create an alibi for Eleanor, making it appear she was elsewhere when the murder occurred.",
      "delivery_path": [
        {
          "step": "The clock was adjusted to show a false time."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor created a false timeline to evade suspicion."
    }
  },
  "false_assumption": {
    "statement": "The victim was alive when last seen by witnesses.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses confidently reported the time they last saw the victim.",
    "what_it_hides": "The clock was tampered with to mislead the investigation."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "dinner time",
        "time of death"
      ],
      "windows": [
        "between dinner and midnight"
      ],
      "contradictions": [
        "Clock shows ten minutes past ten, but witnesses claim they saw the victim at quarter past ten."
      ]
    },
    "access": {
      "actors": [
        "Eleanor",
        "Dr. Finch",
        "Captain Hale",
        "Beatrice"
      ],
      "objects": [
        "the clock",
        "the study door",
        "the weapon"
      ],
      "permissions": [
        "Eleanor had access to all areas of the house."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be wound back."
      ],
      "traces": [
        "Clock shows signs of tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor's reputation as a socialite"
      ],
      "authority_sources": [
        "Dr. Finch's medical authority."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past ten, but is found stopped.",
        "correction": "The clock's stopped position indicates it was tampered with just prior to the murder.",
        "effect": "Narrows suspicion towards Eleanor, who had access to the clock.",
        "required_evidence": [
          "The clock was found in a stopped position.",
          "Witnesses state they last saw the victim at quarter past ten."
        ],
        "reader_observable": true
      },
      {
        "observation": "A note is found on the mantelpiece indicating a meeting time of ten o'clock.",
        "correction": "This suggests the victim was expected to be alive at that time, contradicting the clock's position.",
        "effect": "Eliminates Dr. Finch's alibi, as he claims to have been with the victim at that time.",
        "required_evidence": [
          "A note indicating the time was left on the mantelpiece.",
          "Dr. Finch's alibi claims to have been with the victim."
        ],
        "reader_observable": true
      },
      {
        "observation": "Signs of tampering on the clock’s winding mechanism are observed.",
        "correction": "This indicates premeditated alteration to create an alibi.",
        "effect": "Confirms Eleanor's involvement, as she had the opportunity to tamper with the clock.",
        "required_evidence": [
          "Signs of tampering on the clock’s winding mechanism.",
          "Access records show Eleanor was alone in the study prior to the murder."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, study, and minut against the claimed timeline.",
    "knowledge_revealed": "Eleanor's explanation fails to account for the evidence of tampering on the clock.",
    "pass_condition": "If Eleanor cannot satisfactorily explain the tampering, her guilt becomes evident.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_8"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's stopped position (early) and witness statements (mid) reveal a tampering contradiction. Step 2: The note indicating the meeting time (mid) contradicts Dr. Finch's alibi. Step 3: The signs of tampering on the clock (discriminating test) identify Eleanor as the culprit."
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
        "clearance_method": "Proving that Dr. Finch's alibi is consistent with the timeline.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Establishing Hale's whereabouts during the murder.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirming Beatrice's presence elsewhere at the time of the murder.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
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
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "clue_id": "clue_core_contradiction_chain",
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
        "clue_id": "clue_culprit_direct_eleanor_voss",
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
    "summary": "Eleanor Voss, a local artist with a charming persona, hides a tumultuous secret that threatens to unravel her life.",
    "publicPersona": "Known for her vibrant paintings and charming demeanor, Eleanor is a beloved figure in Little Middleton. She hosts art exhibitions and is often seen engaging with the community, her laughter echoing through the galleries.",
    "privateSecret": "Beneath her cheerful exterior, Eleanor is entangled in a secret affair with the victim's spouse, a relationship that could ruin her reputation if exposed.",
    "motiveSeed": "The fear of her affair being revealed looms over her, threatening not only her reputation but also her budding career as an artist.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims she was in her studio from 8pm to 10pm, painting furiously, but the door was never locked, and interruptions were a mere brushstroke away.",
    "accessPlausibility": "possible",
    "stakes": "With her reputation and career on the line, Eleanor must navigate the treacherous waters of deceit and betrayal.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a gentle lilt, often punctuating her sentences with soft laughter. She has a habit of painting vivid imagery with her words, making even mundane topics seem enchanting.",
    "internalConflict": "Eleanor grapples with guilt and fear, torn between her affection for the victim's spouse and the looming consequences of her choices.",
    "personalStakeInCase": "This crime matters to Eleanor because it holds the potential to expose her secrets, threatening everything she has worked for in her artistic life.",
    "paragraphs": [
      "Eleanor Voss was no stranger to the vibrant colors of life, both on and off the canvas. In Little Middleton, she was the darling of the art scene, her paintings shimmering with the essence of the town. Yet, behind the easel, she was a woman caught in the throes of a clandestine affair, a dalliance with the spouse of the very victim whose murder now loomed over her. The charming façade she presented to the world felt increasingly fragile, like a fine layer of paint waiting to peel away.",
      "As she stood in her studio, brushes in hand, Eleanor found herself questioning the choices that had led her to this moment. The clock ticked ominously, each second a reminder of the peril she faced. What began as a simple attraction had spiraled into something far more complicated, leaving her with a gnawing fear that the truth would surface, unraveling the carefully woven tapestry of her life. 'What a tangled web we weave,' she mused, her humor tinged with an edge of irony, as she dabbed at the canvas, the colors mixing like the chaos in her heart.",
      "Eleanor's alibi was as shaky as her conscience—she had been in her studio, yes, but the door was hardly a fortress. Anyone could have interrupted her creative flow, and the thought gnawed at her. She had painted herself into a corner, both literally and metaphorically. What if someone had seen her? What if the whispers of her affair grew louder, drowning out the praises for her art? The stakes were high, and the pressure was mounting, forcing her to confront not just the murder but the reality of her own choices.",
      "Amidst the turmoil, Eleanor clung to her art as both a refuge and a reminder of her aspirations. But as the investigation unfolded, she realized that the brush strokes of her life were soon to be scrutinized under the harsh light of truth. Would she be able to face the consequences of her actions, or would she slip further into the shadows of deception? The answer lay just beyond the canvas, waiting to be revealed."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, is haunted by a grave mistake that could unravel their entire life.",
    "publicPersona": "As a dedicated doctor with a thriving practice, Dr. Finch is admired in Little Middleton for their commitment to patient care, often seen as a pillar of the community.",
    "privateSecret": "Beneath this façade lies a dark secret: a mistake in a patient's treatment led to their death, a fact that the victim had discovered and threatened to expose.",
    "motiveSeed": "Dr. Finch's desperation to keep this incident hidden drives them to consider drastic measures, fearing the loss of their medical license and freedom.",
    "motiveStrength": "compelling",
    "alibiWindow": "Dr. Finch asserts they were attending to a patient at the clinic from 7pm to 9:30pm, a statement that could be corroborated but also raises questions about their presence elsewhere.",
    "accessPlausibility": "possible",
    "stakes": "Their reputation, career, and freedom hang in the balance, creating a pressure cooker of anxiety and fear.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks in a measured tone, often pausing thoughtfully before responding. Their words are precise, reflecting a medical background, but a hint of dry humor occasionally slips through, especially when discussing the absurdities of life.",
    "internalConflict": "Dr. Finch is torn between the need to confront their past mistake and the instinct to bury it deeper, wrestling with guilt and the fear of exposure.",
    "personalStakeInCase": "This case strikes a personal chord for Dr. Finch as it threatens to expose the very secret that could dismantle their career and life as they know it.",
    "paragraphs": [
      "In the heart of Little Middleton, Dr. Mallory Finch was more than a physician; they were a trusted confidant, a healer whose hands had stitched together countless lives. Yet, beneath the surface of their respectable practice lay a haunting secret that threatened to unravel everything. A grave error—a miscalculation in treatment—had resulted in a patient's untimely death, a truth that the victim had discovered, sending ripples of dread through Finch's very being.",
      "Dr. Finch often observed the world with a keen eye, noting the intricacies of human behavior with both fascination and trepidation. 'Life is a delicate balance, much like surgery,' they would often say, a dry smile playing at the corners of their mouth. But now, that balance felt precarious, as if they were teetering on the edge of a precipice. The victim's death had become an albatross around their neck, and the fear of exposure gnawed at them relentlessly.",
      "Claiming to have been at the clinic during the critical hours, Dr. Finch knew their alibi could be tested, and the thought sent shivers down their spine. There were whispers in the corridors, questions that could lead back to the mistake they had worked so hard to bury. The stakes were not just professional; they were deeply personal, entwined with the very identity Finch had built over the years. Would they have the courage to face the truth, or would they retreat further into the shadows of deception?",
      "As the investigation unfolded, Finch felt the walls closing in, the weight of their secret pressing heavily upon their shoulders. They had dedicated their life to healing, yet now found themselves at the center of a storm of suspicion. The irony of their situation was not lost on them; a healer now haunted by the specter of death they had inadvertently caused. In the end, the question remained: could they confront their past, or would they allow it to consume them whole?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired military officer, grapples with old grudges that threaten to resurface amidst the murder investigation.",
    "publicPersona": "Respected for his military service, Captain Hale is seen as a gruff yet honorable figure, often regarded with a mix of admiration and wariness by the townsfolk.",
    "privateSecret": "Hale harbors a deep-seated grudge against the victim, stemming from a slight in their youth that has festered over the years.",
    "motiveSeed": "The desire for revenge against an old insult drives Hale's actions, a quest for closure over a past grievance.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claims to have been taking a walk in the gardens from 8pm to 9:30pm, a statement that seems innocuous but leaves room for doubt.",
    "accessPlausibility": "easy",
    "stakes": "Hale's personal honor is at stake, and the need for closure over past grievances weighs heavily on him.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Hale speaks in a gravelly tone, often punctuating his dialogue with dry observations. He has a tendency to chuckle at his own misfortunes, using humor as a shield against vulnerability.",
    "internalConflict": "Captain Hale wrestles with the bitterness of his past, torn between the desire for revenge and the realization that holding onto grudges only poisons the soul.",
    "personalStakeInCase": "This case matters to Hale as it brings forth the ghosts of his past, forcing him to confront the anger that has defined his life for too long.",
    "paragraphs": [
      "Captain Ivor Hale stood at the edge of the gardens, the twilight casting long shadows that mirrored the grudges he held close to his heart. A retired military officer, he was a man of honor in the eyes of many, yet beneath that gruff exterior lay a simmering resentment towards the victim. An old slight had festered over the years, becoming a wound that had never healed. 'Time may heal all wounds,' he would mutter to himself, 'but some scars just refuse to fade.'",
      "With every tick of the clock, Hale felt the weight of his past pressing down on him. He had claimed to be walking through the gardens during the time of the murder, a statement that seemed harmless enough, but doubt lingered in the air. Would the townsfolk see his gruff demeanor as a mask for something darker? The thought sparked a bitter chuckle, one that echoed in the silence of the evening. 'Ah, to be a man of mystery,' he mused, 'or just a man with too much time on his hands.'",
      "His reputation as a respected figure was at stake, yet Hale found himself grappling with a deeper conflict. The desire for vengeance danced tantalizingly close, whispering sweet nothings into his ear. But in the quiet moments, when the world fell silent, he questioned whether the pursuit of revenge was worth the toll it took on his soul. The past was a heavy burden, and he often wondered if letting go would free him or leave him adrift in a world without purpose.",
      "As the investigation unfolded, the specter of his old grudge loomed ever larger, threatening to consume him. Hale realized that the murder had become a catalyst, forcing him to confront the anger that had defined him for far too long. Would he find closure, or would he allow the bitterness to lead him down a path of self-destruction? The answer lay not in the shadows of the past but in the choices he made in the present."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a vivacious socialite, conceals a precarious secret that could shatter her glamorous world.",
    "publicPersona": "As the life of every party, Beatrice is charming and vivacious, adored by her peers for her infectious laughter and sparkling wit.",
    "privateSecret": "However, beneath her glamorous exterior lies a troubling truth: she is deeply in debt and relies heavily on the victim for financial support.",
    "motiveSeed": "The fear of losing her lavish lifestyle and social standing drives Beatrice to consider desperate measures.",
    "motiveStrength": "strong",
    "alibiWindow": "Beatrice was at the party until the murder was discovered, but she had slipped away briefly, creating a gap in her alibi.",
    "accessPlausibility": "possible",
    "stakes": "Her financial ruin and loss of social status are at stake, making her desperate to maintain appearances.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice's speech is animated and expressive, often punctuated by dramatic gestures. She has a penchant for witty remarks, frequently using sarcasm to navigate social situations.",
    "internalConflict": "Beatrice struggles with the tension between her desire for a glamorous life and the reality of her financial situation, caught in a web of lies and deception.",
    "personalStakeInCase": "This case is deeply personal for Beatrice as it threatens to expose her financial struggles, risking her entire way of life.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of charm, flitting through Little Middleton's social scene like a butterfly in a garden of delights. With her sparkling laughter and vibrant personality, she was adored by many, the life of every gathering. Yet, beneath the surface of her vivacity lay a precarious secret that threatened to unravel her carefully curated existence. Debt clung to her like a shadow, and the victim had been her lifeline, providing the financial support that kept her afloat in a sea of social obligations.",
      "At the party, Beatrice danced and laughed, her every movement radiating joy, but behind her dazzling smile lay a gnawing anxiety. She had slipped away briefly, a moment of panic that could prove catastrophic if anyone noticed her absence. The stakes were high; if her financial struggles were exposed, her lavish lifestyle and social standing would crumble like a house of cards. 'What a delightful mess I've made,' she often quipped to herself, her sardonic humor a thin veil over her desperation.",
      "As whispers of the murder filled the air, Beatrice felt the walls closing in, the pressure of her dual life becoming unbearable. The investigation was a stage, and she was both performer and audience, caught in a play of deception. Would her charm be enough to deflect suspicion, or would the truth come crashing down, revealing the financial ruin she had fought so hard to hide? The irony of her situation was not lost on her; the very party meant to celebrate life had turned into a harbinger of her downfall.",
      "In the days that followed, Beatrice faced the harsh reality of her choices, realizing that the façade she had maintained for so long was on the verge of collapse. As the investigation unfolded, she found herself at a crossroads: to continue manipulating those around her or to confront the truth of her situation head-on. The glamorous life she had coveted now felt like a gilded cage, and the question remained: would she break free or be consumed by the very lifestyle she had fought to uphold?"
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Little Middleton Manor",
    "type": "Country house estate (Manor house)",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Little Middleton Manor stands as a grand testament to a bygone era, its sprawling wings and formal gardens shrouded in an atmosphere thick with intrigue and secrets.",
    "visualDescription": "The manor is a sprawling edifice of weathered stone, adorned with ivy that climbs its walls, while ornate gables jut out against a slate-grey sky. Formal gardens, meticulously trimmed, flank the entrance, leading to a grand oak door that creaks ominously upon entry.",
    "atmosphere": "A palpable tension fills the air, with whispers of secrets lurking in every shadow cast by the overcast sky.",
    "paragraphs": [
      "Little Middleton Manor, with its sprawling wings and verdant gardens, is a relic of a more opulent time. The estate, nestled within a dense woodland, is enveloped by a sense of isolation, its grandeur marred by the oppressive weight of secrets. As one approaches the grand entrance, the path is lined with meticulously pruned hedges that seem to whisper warnings in the wind. The air is thick with the scent of damp earth and the faint trace of decaying leaves, remnants of the recent autumn.",
      "Inside, the manor is a labyrinth of dimly lit corridors and rooms adorned with dark paneling and heavy drapery. Gas lamps cast flickering shadows across the walls, illuminating portraits of stern ancestors whose painted eyes seem to follow every movement. The faint sound of rain pattering against the leaded windows creates a haunting melody, underscoring the feeling of suffocating pressure that hangs in the air. Each room holds its own mysteries, from the dusty library filled with tomes of forgotten knowledge to the drawing room where secrets are exchanged in hushed tones.",
      "The gardens outside, while beautiful, harbor their own mysteries. The scent of blooming roses mingles with the dampness of the earth, creating an intoxicating aroma that belies the tension within the manor. The sound of rustling leaves in the nearby woods feels almost conspiratorial, as if nature itself is complicit in the unfolding drama. As evening approaches, the shadows lengthen, and a chill creeps into the air, heightening the sense of urgency and fear that permeates the estate.",
      "As the clouds gather overhead, a feeling of foreboding settles upon Little Middleton Manor. Every creak of the floorboards and distant echo of thunder serves as a reminder of the storm brewing outside, while inside, the storm of human emotions rages on. The manor, with its secrets and lies, is a character in its own right, holding the key to revelations that could shatter lives and unveil the truth behind the clockwork deception."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical for the season",
    "timeFlow": "Days of mounting tension as secrets unfold over a single stormy weekend.",
    "mood": "Tense and secretive, with an underlying sense of urgency",
    "eraMarkers": [
      "Petrol touring cars parked in the gravel drive, their engines still warm from recent arrivals.",
      "A domestic telephone sits on a side table, its receiver heavy with unspoken words.",
      "Typewriters in the study, their rhythmic clacking echoing as correspondence is composed."
    ],
    "sensoryPalette": {
      "dominant": "The damp, earthy scent of the gardens mingled with the musty aroma of the manor's interiors.",
      "secondary": [
        "The soft, rhythmic patter of rain against the windows.",
        "The faint crackle of gas lamps flickering, casting dancing shadows."
      ]
    },
    "paragraphs": [
      "As the sun struggles to break through the thick clouds, the manor stands resolute, its stone facade absorbing the chill of the damp air. The gardens, once vibrant, now seem muted under the oppressive grey sky, their colors dulled as if reflecting the tension within. The sound of rain is a constant companion, a reminder of the storm brewing both outside and within the walls of Little Middleton Manor.",
      "The atmosphere is thick with secrets, each room holding its breath, waiting for the inevitable revelations that the weekend promises to bring. The distant rumble of thunder seems to echo the mounting anxiety of the guests, trapped in this isolated estate where every glance and whisper could hold the key to a hidden truth."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a cavernous room filled with towering shelves of dusty books, their spines cracked and faded. A heavy oak table, strewn with papers and an overturned chair, suggests a struggle that once took place amidst the quiet.",
      "sensoryDetails": {
        "sights": [
          "The dim light filters through the leaded glass windows, creating a patchwork of shadows on the floor.",
          "An ornate globe sits in the corner, its surface marred by time, hinting at distant lands and forgotten adventures."
        ],
        "sounds": [
          "The soft rustling of pages turning as the wind breathes through the open window, almost like a ghostly whisper.",
          "The creak of the old wooden floorboards beneath one's feet, echoing the secrets held within the room."
        ],
        "smells": [
          "The musty scent of old leather bindings mingles with the faint aroma of polished wood.",
          "A hint of dampness lingers in the air, reminding one of the rain-soaked grounds outside."
        ],
        "tactile": [
          "The coolness of the air contrasts sharply with the warmth of the sun filtering through the window, creating an unsettling chill.",
          "The textured surface of the worn leather chair feels rough against the fingertips, a reminder of countless hours spent in silent contemplation."
        ]
      },
      "accessControl": "The library is typically off-limits to guests unless invited by the owner, creating an air of exclusivity and secrecy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickling down the windowpanes, distorting the view of the outside world.",
            "The library appears darker, shadows deepening as the light struggles to penetrate the gloom."
          ],
          "sounds": [
            "The steady drumming of rain against the roof creates a rhythmic backdrop, almost like a heartbeat.",
            "Occasional bursts of thunder reverberate through the room, startling in their intensity."
          ],
          "smells": [
            "The scent of wet earth wafts in from the gardens, mixing with the mustiness of old pages.",
            "A faint whiff of mildew hints at the room's age, an unwelcome reminder of the dampness outside."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The flat light casts an eerie pallor over the room, making everything appear faded and ghostly.",
            "Dust motes float lazily in the air, illuminated by the rare shafts of light breaking through the clouds."
          ],
          "sounds": [
            "Silence reigns, broken only by the occasional rustle of leaves outside, creating an atmosphere of unease.",
            "The distant ticking of a clock echoes, each tick amplifying the feeling of time slipping away."
          ],
          "smells": [
            "A musty aroma envelops the room, underscored by the faint scent of polished wood, creating a sense of history.",
            "The faint whiff of pipe tobacco clings to the air, a reminder of past inhabitants lost in thought."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the dark wood, casting long shadows that dance across the walls.",
            "The rich colors of the bookshelves seem to come alive in the warm glow, inviting yet foreboding."
          ],
          "sounds": [
            "The soft crackle of the fire in the hearth provides a comforting backdrop to the growing tension.",
            "Distant voices can be heard from the drawing room, their tones low and conspiratorial."
          ],
          "smells": [
            "The sweet scent of burning candles mixes with the earthy aroma of the fireplace, creating an intimate atmosphere.",
            "A hint of leather from the books adds a touch of sophistication, yet feels ominous in the dim light."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, once a sanctuary of knowledge, now bears the weight of a recent crime. The overturned chair and scattered papers tell a story of violence interrupted, while the shadows loom large as if they conspire to keep the truth hidden. The air is thick with the scent of old books, but today it mingles with an unsettling aroma of fear, creating an atmosphere that is both claustrophobic and charged with tension.",
        "As the storm rages outside, the library stands as a silent witness to the chaos that has unfolded within its walls. Each creak of the floorboards seems to echo the unspoken secrets of those who have crossed its threshold, while the flickering light from the gas lamps casts an eerie glow, transforming familiar corners into darkened recesses of uncertainty and dread."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is elegantly appointed, with plush furnishings and delicate china displayed in glass cabinets. A grand piano sits silently in the corner, its keys covered in a fine layer of dust, hinting at forgotten melodies.",
      "sensoryDetails": {
        "sights": [
          "Richly embroidered drapes frame the large windows, their fabric a deep burgundy that absorbs the light.",
          "A large portrait of the manor's founder hangs above the fireplace, his gaze seemingly judging those who enter."
        ],
        "sounds": [
          "The soft rustling of fabric as guests shift nervously in their seats, the tension palpable in the air.",
          "The distant sound of a clock ticking, each tick resonating like a heartbeat in the silence."
        ],
        "smells": [
          "The faint scent of lavender lingers in the air, a remnant of the last gathering, sweet yet suffocating.",
          "A hint of polished wood dominates, mingling with the earthy aroma of the gardens outside."
        ],
        "tactile": [
          "The upholstery of the armchairs feels luxurious yet oppressive, as if the weight of expectation sits heavily upon the guests.",
          "The coolness of the marble fireplace contrasts sharply with the warmth of the room, creating an unsettling dichotomy."
        ]
      },
      "accessControl": "The drawing room is accessible to all guests during gatherings, but private conversations are often held behind closed doors, creating an air of secrecy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the windowpanes, blurring the view of the gardens outside.",
            "The drawing room appears dimmer, the rich colors muted under the cloud cover."
          ],
          "sounds": [
            "The steady rhythm of rain against the window provides a melancholic backdrop to the tense atmosphere.",
            "Occasional claps of thunder resonate, causing guests to jump in their seats."
          ],
          "smells": [
            "The scent of damp earth seeps in through the windows, mingling with the lavender and wood polish.",
            "A hint of smoke from the fireplace adds to the atmosphere, creating a sense of coziness that feels disjointed from the tension."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is awash in a grey light, softening the edges of the furniture and creating an almost dreamlike quality.",
            "Dust motes drift lazily through the air, illuminated by the muted light."
          ],
          "sounds": [
            "The hushed murmurs of conversation fill the air, punctuated by the occasional nervous laugh.",
            "The ticking of an ornate clock fills the silence, each tick amplifying the tension in the room."
          ],
          "smells": [
            "A mixture of lavender and dust hangs in the air, creating a nostalgic yet poignant aroma.",
            "The scent of polished wood is strong, a reminder of the room's elegance that now feels overshadowed by fear."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the walls, casting a warm glow that contrasts with the chill in the air.",
            "The reflections of the flames dance upon the polished surfaces, creating an intimate yet foreboding atmosphere."
          ],
          "sounds": [
            "The soft notes of a piano echo through the room, haunting in their beauty.",
            "The quiet exchange of whispers fills the space, each word heavy with unspoken meaning."
          ],
          "smells": [
            "The scent of burning candles mingles with the aroma of fresh flowers, creating an inviting yet tense atmosphere.",
            "A hint of tobacco smoke lingers, a reminder of conversations held in secret."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room is a space of elegance and tension, where guests gather to exchange pleasantries while veiled intentions linger just beneath the surface. Plush armchairs, upholstered in rich fabrics, invite comfort, yet the atmosphere is anything but relaxed. The large windows, framed by heavy drapes, overlook the gardens, but today, the view is obscured by the relentless rain, creating an insular environment where secrets thrive.",
        "As guests engage in polite conversation, the air is thick with unspoken words, and the distant ticking of the clock serves as a reminder of the time slipping away. The presence of the grand piano, dust-covered and silent, adds to the sense of lost opportunities and forgotten melodies, echoing the hidden stories that intertwine within the walls of Little Middleton Manor."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Gathering space for staff",
      "visualDetails": "The servants' hall is a stark contrast to the opulence of the drawing room, with simple wooden tables and mismatched chairs. The walls are adorned with utilitarian shelves filled with everyday items, and a large fireplace dominates one end of the room.",
      "sensoryDetails": {
        "sights": [
          "The flickering light from the fireplace casts shadows on the rough-hewn walls, creating a cozy yet somber atmosphere.",
          "A large wooden table is set for the staff's meals, its surface scarred from years of use and filled with the remnants of past gatherings."
        ],
        "sounds": [
          "The clatter of dishes and cutlery echoes through the hall as the staff prepares for the evening's meal.",
          "Laughter and low voices mingle in the air, creating a sense of camaraderie amidst the tension of the manor."
        ],
        "smells": [
          "The savory aroma of stew bubbles on the stove, filling the air with warmth and comfort.",
          "A hint of woodsmoke drifts from the fireplace, mingling with the scents of the meal being prepared."
        ],
        "tactile": [
          "The rough texture of the wooden table contrasts sharply with the softness of the worn linens laid across it.",
          "The warmth radiating from the fireplace provides a stark contrast to the chilly drafts that sometimes sweep through the hall."
        ]
      },
      "accessControl": "The servants' hall is accessible to all staff but remains off-limits to guests, creating a divide between the classes.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the windows, distorting the view of the gardens outside and casting a gloomy shadow over the room.",
            "The flickering light from the fireplace struggles against the grey light filtering through the clouds."
          ],
          "sounds": [
            "The sound of rain pattering against the roof adds a layer of comfort to the otherwise stark environment.",
            "The occasional crackle of the fire breaks the silence, providing a warm contrast to the dampness outside."
          ],
          "smells": [
            "The aroma of fresh bread baking in the oven mingles with the scent of rain-soaked earth, creating a homely atmosphere.",
            "A hint of mildew lingers in the corners, a reminder of the manor's age and the relentless weather."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The dim light creates a muted palette, casting the room in shades of grey that reflect the mood outside.",
            "Shadows linger in the corners, filled with the unspoken tensions of the household."
          ],
          "sounds": [
            "The sound of quiet conversation fills the air, punctuated by the clatter of dishes being washed.",
            "The distant sound of thunder rumbles, echoing the unease that hangs over the estate."
          ],
          "smells": [
            "The aroma of hearty stew wafts through the air, a comforting presence amidst the tension.",
            "The scent of damp wood and earth creeps in through the windows, creating a sense of melancholy."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The flickering candlelight creates a warm glow, illuminating the faces of the staff as they gather for their meal.",
            "The table is set with simple yet elegant dishes, a stark contrast to the grandeur of the drawing room."
          ],
          "sounds": [
            "Laughter and chatter bounce off the walls, creating a sense of intimacy and belonging.",
            "The crackle of the fire provides a comforting backdrop to the camaraderie shared among the staff."
          ],
          "smells": [
            "The smell of roasted meat fills the air, mingling with the scent of fresh herbs from the garden.",
            "The fragrance of woodsmoke adds warmth, enveloping the room in a cozy embrace."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The servants' hall is a world apart from the elegance of the drawing room, with its utilitarian furnishings and simple decor reflecting the lives of those who serve. The atmosphere is lively, filled with laughter and chatter as staff prepare for the evening's meal, yet an undercurrent of tension simmers just below the surface. The warmth from the fireplace casts flickering shadows on the walls, creating an intimate yet somber ambiance that belies the complexities of the manor above.",
        "As the rain continues to fall outside, the scent of hearty stew fills the air, providing a comforting contrast to the chill that seeps through the manor. Here, amidst the clatter of dishes and the camaraderie of the staff, the secrets of Little Middleton Manor seem distant, yet they are always present, lurking just beyond the threshold of the door."
      ]
    }
  ],
  "note": "",
  "cost": 0.0025654183499999998,
  "durationMs": 41676
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1930,
    "month": "July",
    "day": null,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "July",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool breezes"
    ],
    "daylight": "Long summer days with daylight lingering until nearly ten in the evening, though clouds often obscure the sun.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, just as the last light fades behind the clouds.",
    "holidays": [
      "Bastille Day (July 14) — a time of increased political discourse and celebrations in parts of Europe."
    ],
    "seasonalActivities": [
      "garden parties and picnics at country estates",
      "evening strolls under the fading light",
      "watching fireworks for Bastille Day celebrations"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suits in dark wool",
        "crisp white dress shirts",
        "polished leather Oxfords"
      ],
      "casual": [
        "lightweight linen trousers",
        "open-collared shirts",
        "flat caps"
      ],
      "accessories": [
        "silk pocket squares",
        "wristwatches with leather bands",
        "cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dresses with floral patterns",
        "cloche hats adorned with ribbons",
        "heavily beaded evening gowns"
      ],
      "casual": [
        "light cotton blouses",
        "ankle-length skirts",
        "broad-brimmed sun hats"
      ],
      "accessories": [
        "string pearls",
        "small leather handbags",
        "embroidered shawls"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "the rise of the flapper style",
      "increased use of pastel colors in summer fashions"
    ],
    "socialExpectations": [
      "politeness and decorum at social gatherings",
      "strict adherence to class distinctions",
      "women expected to maintain traditional roles, yet some pushing for independence"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the ongoing effects of the Great Depression affecting employment and social dynamics",
      "rising tensions in Europe with fascist movements gaining traction",
      "the United States experiencing a significant drought impacting agriculture"
    ],
    "politicalClimate": "A tense atmosphere with growing concerns about fascism in Europe, leading to debates about civil liberties and government intervention in the economy.",
    "economicConditions": "Widespread economic hardship with many families struggling to make ends meet; the stock market crash of 1929 still heavily influencing public sentiment.",
    "socialIssues": [
      "high unemployment rates",
      "class tensions exacerbated by economic struggles",
      "discussions around women's suffrage and rights in the workforce"
    ],
    "internationalNews": [
      "political unrest in Germany with the rise of the Nazi Party",
      "reports of protests against austerity measures across Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'My Blue Heaven' by Gene Austin",
        "'Ain't She Sweet' by Milton Ager",
        "'The Birth of the Blues' by Al Jolson"
      ],
      "films": [
        "'All Quiet on the Western Front'",
        "'The Love Parade'",
        "'The Big Parade'"
      ],
      "theater": [
        "'The Front Page'",
        "'The Royal Family'",
        "'The Cat and the Fiddle'"
      ],
      "radio": [
        "The Columbia Workshop",
        "The Radio City Music Hall broadcasts",
        "The Lux Radio Theater"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Great Gatsby' by F. Scott Fitzgerald"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "social commentary",
        "historical novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator",
        "the radio receiver",
        "the typewriter's evolving mechanisms"
      ],
      "commonDevices": [
        "domestic telephones",
        "petrol cars for travel",
        "standardized household appliances"
      ],
      "emergingTrends": [
        "increased radio broadcasting for entertainment",
        "the growing popularity of cinema",
        "early developments in sound recording technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: six pence",
        "Bottle of milk: three pence"
      ],
      "commonActivities": [
        "afternoon tea with friends",
        "visiting local markets for groceries",
        "attending summer fairs and village dances"
      ],
      "socialRituals": [
        "formal dinner parties showcasing culinary skills",
        "weekly church services followed by community gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "perception that the upper class is morally obligated to support the lower classes",
      "growing resentment among working-class individuals towards the wealthy elite"
    ],
    "gender": [
      "women increasingly advocating for their rights in the workforce",
      "traditional gender roles still prevalent in most households",
      "social stigma surrounding unmarried women"
    ],
    "race": [
      "growing awareness and activism around racial equality",
      "racial segregation and discrimination still common in many areas"
    ],
    "generalNorms": [
      "strict adherence to social etiquette and manners",
      "importance placed on family and community",
      "emphasis on modesty in dress and behavior"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of rain-soaked earth, mingling with the sweet notes of blooming flowers in the estate's gardens.",
    "The soft patter of rain against the windows creates a backdrop to whispered conversations and nervous glances, heightening the tension within the manor.",
    "A distant rumble of thunder echoes, as if the very sky reflects the mounting anxieties of the guests gathered for the evening."
  ],
  "paragraphs": [
    "In July 1930, the English countryside is lush yet burdened with the weight of overcast skies, the occasional rain shower dampening the spirits of those gathered at the grand manor house. The long summer evenings, typically filled with the laughter of garden parties and the sparkle of fireworks for Bastille Day, now carry a tense atmosphere, where unease hangs in the air. Guests arrive in finely tailored suits and elegant dresses, all while the looming specter of the Great Depression reminds them of the precariousness of their social standings.",
    "Fashion at this time reflects both the elegance and the shifting attitudes of the era. Men don dark wool suits with polished leather shoes, while women, adorned in floral tea dresses and cloche hats, navigate the line between tradition and the emerging flapper style. Accessories such as silk pocket squares and string pearls add a touch of glamour, yet beneath the surface, societal expectations press heavily, reminding all of their respective roles. The evening is one of decorum, yet the whispers of change are palpable, mingling with the soft music playing from the radio.",
    "Daily life is steeped in social rituals; formal dinner parties are a showcase of culinary prowess, while community gatherings after church services serve to reinforce class distinctions among guests. The market streets bustle with the exchange of goods, where a loaf of bread costs four pence and a cinema ticket draws eager patrons. The air is filled with the scent of rain and freshly cut grass, a reminder of the beauty surrounding the estate, yet the shadows of economic struggle and political unrest loom large, casting a pall over what should be a joyful summer gathering."
  ],
  "note": "",
  "cost": 0.0010834692,
  "durationMs": 11788
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense gathering at the manor for a family meeting is exacerbated by class tensions and the looming threat of economic instability, forcing the diverse cast into a web of suspicion and secrets.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression has strained the upper class's wealth and influence, while rising fascism stirs political discourse, creating a backdrop of class tensions and social pressure among the guests."
  },
  "setting": {
    "location": "A sprawling manor house set on extensive grounds, featuring formal gardens and surrounding woodlands.",
    "institution": "Country house estate (Manor house)",
    "weather": "Overcast with occasional rain, typical for the season."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "Golden Age country-house murder driven by a mechanical clock-tampering method."
}

### LOCKED_FACTS
[
  {
    "id": "clock_reading",
    "value": "ten minutes past eleven",
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "tamper_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  },
  {
    "id": "last_seen_time",
    "value": "a quarter past ten",
    "description": "The last time the victim was seen alive"
  },
  {
    "id": "witness_statement",
    "value": "twenty minutes past eleven",
    "description": "The time a witness claims to have heard the victim's last words"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past ten, but is found stopped.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This indicates a discrepancy in the timeline of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "A note is found on the mantelpiece indicating a meeting time of ten o'clock.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This suggests the victim was expected to be alive at that time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Signs of tampering on the clock’s winding mechanism are observed.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This indicates that the clock was manipulated to mislead the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The clock's stopped position indicates it was tampered with just prior to the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the timeline established by witnesses.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "This suggests the victim was expected to be alive at that time, contradicting the clock's position.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This reveals a planned deception regarding the time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "This indicates premeditated alteration to create an alibi.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This points to a deliberate attempt to mislead investigators.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "category": "spatial",
      "description": "Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he has a corroborated alibi at the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This narrows the suspect list towards Eleanor Voss.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was seen at the dinner party during the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This confirms she could not have committed the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "behavioral",
      "description": "Eleanor Voss displayed signs of jealousy over financial mismanagement.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[0]",
      "pointsTo": "This indicates a possible motive for the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "The discriminating test compares clock, study, and minut against the claimed timeline.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[0]",
      "pointsTo": "This will reveal inconsistencies in the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "Witnesses claim they saw the victim at quarter past ten.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[1]",
      "pointsTo": "This contradicts the clock's stopped time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "temporal",
      "description": "The time of death is established as shortly after ten o'clock.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[2]",
      "pointsTo": "This aligns with the timeline discrepancies.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Dinner time remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [],
  "status": "fail",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_1",
      "clue_2",
      "clue_4"
    ],
    "mid": [
      "clue_3",
      "clue_5",
      "clue_6",
      "clue_culprit_direct_eleanor_voss",
      "clue_core_elimination_chain",
      "clue_core_contradiction_chain",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10"
    ],
    "late": [
      "clue_late_optional_slot_1"
    ]
  },
  "fairPlayChecks": {
    "allEssentialCluesPresent": true,
    "noNewFactsIntroduced": true,
    "redHerringsDontBreakLogic": true
  },
  "latencyMs": 12497,
  "cost": 0.00483898305
}

---

## OUTPUT INSTRUCTIONS

Produce a single JSON object with ALL of the following fields.

Return the JSON object directly — no preamble, no markdown fences, no commentary.

MANDATORY FIELD LENGTHS:
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- storyEmotionalArc.arcDescription: MINIMUM 300 words, target 350 words. This is an emotional map
  of the full story journey — not a one-paragraph summary. It must trace the emotional register from
  opening chapter through rising tension to climax and resolution. Multiple paragraphs expected.
  A response shorter than 300 words will fail the quality gate. Count your words.
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
