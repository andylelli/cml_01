# Actual Prompt Record

- Run ID: `mystery-1778710297887`
- Project ID: ``
- Timestamp: `2026-05-13T22:15:12.479Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `retry 1`
- Prompt Hash: `bf7f1b7c36841d7d`

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
    "title": "The Clockwork Trap",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "grand manor house",
      "country": "England",
      "institution": "country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical manipulation"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Dr. Mallory Finch: acquaintance",
        "Captain Ivor Hale: colleague",
        "Beatrice Quill: friend"
      ],
      "public_persona": "Intelligent and composed detective.",
      "private_secret": "Struggles with self-doubt in her abilities.",
      "motive_seed": "Curiosity for solving the case.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Investigating the crime scene",
        "Interviews with suspects"
      ],
      "behavioral_tells": [
        "Sharp eye for detail",
        "Asks probing questions"
      ],
      "stakes": "Personal reputation and professional integrity.",
      "evidence_sensitivity": [
        "Eager to find truth",
        "Sensitive to emotional cues"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "medical expert",
      "relationships": [
        "Eleanor Voss: acquaintance",
        "Captain Ivor Hale: colleague",
        "Beatrice Quill: rival"
      ],
      "public_persona": "Respected physician with a calm demeanor.",
      "private_secret": "Harbors resentment towards the wealthy.",
      "motive_seed": "Desire for recognition.",
      "motive_strength": "moderate",
      "alibi_window": "10:00 to 11:00",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the victim's study",
        "Knowledge of medical conditions"
      ],
      "behavioral_tells": [
        "Inconsistent explanations about the victim's health",
        "Nervous when questioned about alibi"
      ],
      "stakes": "Reputation and possible financial gain.",
      "evidence_sensitivity": [
        "Defensive about medical opinions",
        "Eager to shift blame"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "military officer",
      "relationships": [
        "Eleanor Voss: colleague",
        "Dr. Mallory Finch: acquaintance",
        "Beatrice Quill: childhood friend"
      ],
      "public_persona": "Charming and confident officer.",
      "private_secret": "Has a hidden gambling problem.",
      "motive_seed": "Financial desperation.",
      "motive_strength": "strong",
      "alibi_window": "10:30 to 11:30",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Frequent visits to the estate",
        "Military connections"
      ],
      "behavioral_tells": [
        "Avoids eye contact when questioned",
        "Fidgets with money"
      ],
      "stakes": "Honor and financial stability.",
      "evidence_sensitivity": [
        "Sensitive about finances",
        "Defensive about personal life"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "socialite",
      "relationships": [
        "Eleanor Voss: friend",
        "Dr. Mallory Finch: rival",
        "Captain Ivor Hale: childhood friend"
      ],
      "public_persona": "Elegant and poised socialite.",
      "private_secret": "Desires to escape her life of privilege.",
      "motive_seed": "Desire for independence.",
      "motive_strength": "moderate",
      "alibi_window": "10:00 to 11:00",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the manor's common areas",
        "Knowledge of the household's routines"
      ],
      "behavioral_tells": [
        "Evasive when discussing her whereabouts",
        "Exaggerates social engagements"
      ],
      "stakes": "Personal freedom and social reputation.",
      "evidence_sensitivity": [
        "Sensitive to public perception",
        "Eager to please others"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "In the opulent manor of Little Middleton, a murder occurs under the ticking hands of a manipulated clock, leading to a complex web of alibis and motives as Detective Eleanor Voss seeks the truth amidst deception."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead in her study.",
      "The clock in the study was stopped at ten minutes past eleven.",
      "Witnesses heard the clock strike twelve just before the body was discovered."
    ],
    "inferred_conclusions": [
      "The time of death may have been manipulated.",
      "Captain Ivor Hale had access to the study.",
      "Dr. Mallory Finch's alibi is questionable."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was tampered with to create a false narrative of the murder timeline.",
      "delivery_path": [
        {
          "step": "The clock was wound back to mislead witnesses."
        }
      ]
    },
    "outcome": {
      "result": "Captain Ivor Hale is implicated due to evidence of tampering and false alibi."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss’s murder occurred at the time indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock was present in the room and appeared functional.",
    "what_it_hides": "The clock's hands were manipulated to create a misleading timeline."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The last time the clock was known to function correctly.",
        "Witness accounts of the clock striking."
      ],
      "windows": [
        "The time frame of the murder, as judged by the stopped clock."
      ],
      "contradictions": [
        "The clock striking twelve while the victim was already dead."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Dr. Mallory Finch",
        "Beatrice Quill"
      ],
      "objects": [
        "The clock",
        "The study",
        "Eleanor Voss's body"
      ],
      "permissions": [
        "Access to the study during the night."
      ]
    },
    "physical": {
      "laws": [
        "The principle of mechanical manipulation of clock mechanisms."
      ],
      "traces": [
        "Fingerprints on the clock's casing.",
        "Tampering marks on the clock's mechanism."
      ]
    },
    "social": {
      "trust_channels": [
        "Relationships among the suspects create misdirection."
      ],
      "authority_sources": [
        "Captain Hale's military background lends him credibility."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study was found stopped at ten minutes past eleven.",
        "correction": "The time discrepancy suggests the clock may not reflect the actual time of death.",
        "effect": "Narrows the window of opportunity for suspects to Captain Ivor Hale.",
        "required_evidence": [
          "The clock's hands appear stuck.",
          "Witnesses recall hearing the clock strike twelve."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witness statements indicate conflicting times regarding the murder.",
        "correction": "The inconsistencies in witness accounts suggest the murder time was manipulated.",
        "effect": "Eliminates Dr. Mallory Finch as a suspect due to her credible alibi.",
        "required_evidence": [
          "Witnesses heard the clock strike twelve.",
          "Dr. Finch was seen in the kitchen at the time."
        ],
        "reader_observable": true
      },
      {
        "observation": "Fingerprints on the clock's casing match Captain Ivor Hale.",
        "correction": "This indicates that Captain Hale had tampered with the clock.",
        "effect": "Narrows the suspect pool to Captain Ivor Hale as the primary suspect.",
        "required_evidence": [
          "Captain Hale's fingerprints found on the clock.",
          "Witness accounts confirm his presence in the study."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled reenactment of the clock's striking mechanism reveals the tampering.",
    "knowledge_revealed": "The revealed facts are clock, study, and stopp.",
    "pass_condition": "The clock fails to strike at the expected hour due to tampering.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_mechanism_visibility_core",
      "clue_5"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock being stopped (early) and witnesses hearing the clock strike twelve (mid) hint at a manipulated timeline. Step 2: Inconsistencies in witness accounts (mid) eliminate Dr. Mallory Finch. Step 3: Fingerprints on the clock (late) lead to Captain Ivor Hale."
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
        "Observe the clock's tampering evidence",
        "Draw conclusion about Captain Hale's guilt"
      ],
      "test_type": "mechanical manipulation"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified by kitchen staff.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 10:00 to 11:00",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence about clock tampering."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation of the clock."
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness testimonies in the drawing-room."
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Fingerprint examination."
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
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
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a retired schoolteacher, is a warm and nurturing figure in Little Middleton, known for her wisdom and kindness. Yet beneath this gentle exterior lies a simmering resentment towards her wealthy family, who neglected her after her husband's death.",
    "publicPersona": "Eleanor is the epitome of a nurturing figure, often found in the local library or tending to her beloved garden. She has a way of making everyone feel seen and valued, offering sage advice and a cup of tea to those in need. Her warm smile and gentle demeanor have earned her the affection of many, especially the young minds she once taught.",
    "privateSecret": "In the quiet moments of her life, Eleanor grapples with feelings of abandonment and resentment towards her affluent family. Their neglect after her husband's death has left her feeling like an outsider in her own lineage, a bitterness that she keeps hidden behind her kind eyes.",
    "motiveSeed": "Eleanor's intrigue in the murder stems from the whispers of family inheritance disputes. The thought of reclaiming her family's honor and possibly a place among them ignites a fire within her that she thought had long since extinguished.",
    "motiveStrength": "compelling",
    "alibiWindow": "Eleanor was in the library reading from 8:00 PM until 9:15 PM, a fact she is eager to share, hoping it might lend her some credibility amidst the chaos.",
    "accessPlausibility": "easy",
    "stakes": "Eleanor is determined to uncover the truth behind the murder, not just for justice but to reclaim her family's honor and, perhaps, her own place within it.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a soft, measured cadence, often punctuating her sentences with thoughtful pauses. She has a tendency to use literary references, drawing on her years as a teacher, and occasionally employs irony to highlight the absurdities of life.",
    "internalConflict": "Eleanor feels torn between her desire for familial acceptance and her deep-seated resentment towards those who have wronged her. This case forces her to confront these emotions head-on, questioning whether she truly wants to be a part of a family that has caused her so much pain.",
    "personalStakeInCase": "This crime matters to Eleanor on a deeply personal level; it is not only about justice for the victim but also about reclaiming her family's legacy and finding a sense of belonging.",
    "paragraphs": [
      "Eleanor Voss had always believed that knowledge was the greatest gift one could bestow upon another. As a retired schoolteacher, she had spent decades nurturing young minds, imparting wisdom and kindness in equal measure. Little Middleton knew her as a warm presence, always ready with a comforting word or a cup of tea. Yet, behind her gentle smile lay a heart burdened by the weight of neglect. After her husband's passing, Eleanor found herself adrift, abandoned by her wealthy family, who seemed more concerned with their own affairs than her well-being.",
      "The murder that had shocked the town was more than just a tragic headline for Eleanor; it was a catalyst that stirred a long-dormant desire within her. Whispers of inheritance disputes danced in her mind, igniting a spark of intrigue that she could not ignore. Eleanor felt a compelling urge to dive into the investigation, not merely out of curiosity but to reclaim a sense of dignity and purpose that had eluded her for far too long. The thought of uncovering family secrets both thrilled and terrified her, a reminder of the dark shadows that lingered in her past.",
      "As she spent her evenings in the library, her favorite sanctuary, Eleanor found solace in the pages of forgotten tomes, though they could not fill the void left by her family. Her alibi was solid; she had been reading from 8:00 PM until 9:15 PM, a detail she was eager to share with anyone who would listen. But it was not just about proving her innocence; it was about stepping into a role she had long shunned. This time, she would not be the passive observer but the active participant in her own story.",
      "Eleanor's internal conflict was palpable. She wanted to be part of her family once more, yet the thought of facing those who had neglected her filled her with trepidation. Would she find acceptance, or would the past engulf her once again? As the investigation unfolded, she would have to confront her feelings of resentment and betrayal, weighing her desire for connection against the pain of past wounds. The stakes were high, and Eleanor was ready to unearth the truth, not just about the murder, but about herself."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a compassionate physician whose dedication to her patients is well known in Little Middleton. However, beneath her professional facade lies a tangled web of emotions, as she struggles with guilt over her secret romantic relationship with the victim.",
    "publicPersona": "Dr. Finch is the town's trusted physician, revered for her unwavering commitment to the health and well-being of her patients. With her warm smile and attentive demeanor, she has built a reputation for compassion and care, often going above and beyond to ensure her patients feel valued and understood.",
    "privateSecret": "However, what few know is that Mallory harbors a deep secret; she was romantically involved with the victim, a relationship that, while passionate, was fraught with complications. The thought of losing not only her love but also her professional reputation weighs heavily on her.",
    "motiveSeed": "The potential fallout from the victim's estate, should it be passed to someone else, could leave Mallory financially compromised. The stakes of this investigation are personal and deeply entwined with her heart.",
    "motiveStrength": "moderate",
    "alibiWindow": "Mallory claims she was with patients until 9:00 PM, a statement that remains unverified and leaves room for doubt.",
    "accessPlausibility": "possible",
    "stakes": "Dr. Finch's desire to protect her career and the memory of her relationship with the victim drives her to tread carefully in the investigation, as she seeks to shield herself from the repercussions of her hidden life.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a brisk, confident tone, but occasionally slips into self-deprecating humor when discussing her own failings. She has a habit of punctuating her sentences with nervous laughter, especially when discussing her personal life.",
    "internalConflict": "Mallory is caught in a maelstrom of guilt and longing, struggling to reconcile her feelings for the victim with the realities of her professional life. The investigation forces her to confront her past decisions and the consequences of her choices.",
    "personalStakeInCase": "This case is of utmost importance to Mallory; it represents not only a chance to protect her career but also to honor the memory of her relationship with the victim, which she now realizes was more complicated than she ever acknowledged.",
    "paragraphs": [
      "Dr. Mallory Finch was the kind of physician that Little Middleton relied on, a beacon of compassion in times of need. Her patients adored her, often remarking on her ability to listen and empathize, qualities that made her a trusted confidant. She approached her work with a fervor that few could rival, often sacrificing her own needs for the sake of her patients. Yet, beneath the surface of her professional demeanor lay a tumultuous sea of emotions, particularly regarding her clandestine relationship with the victim.",
      "The murder had sent shockwaves through the community, and for Mallory, it was a personal crisis that she could not escape. The specter of their romance loomed large, casting shadows over her professional reputation. She found herself entangled in a web of guilt, questioning the very nature of her feelings. Had she been blinded by love, or had she simply ignored the warning signs? The stakes were high, as the victim's estate could easily fall into the hands of someone else, leaving her not only heartbroken but financially vulnerable.",
      "Claiming to have been with patients until 9:00 PM, Mallory found herself in a precarious position. Her alibi, while plausible, lacked the verification that could clear her name. It was a constant source of anxiety for her, gnawing at her as she navigated the investigation. There was a part of her that wanted to scream, to confess everything, yet the fear of losing her career held her back. How could she protect her reputation while wading through the murky waters of her own heart?",
      "As the investigation progressed, Mallory grappled with her internal conflict. She felt an overwhelming desire to honor the memory of her relationship while also confronting the guilt that accompanied it. The truth was, she had loved the victim deeply, but their connection had been fraught with complications. This case was not just about finding justice; it was about reconciling her feelings, about understanding that love could be both beautiful and painful. Mallory knew that the road ahead would be fraught with challenges, but she was determined to navigate it with grace, no matter the cost."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a stoic and disciplined retired military officer, known for his traditional values. However, beneath his composed exterior lies a deep-seated anger directed at the victim, whom he blames for his financial ruin.",
    "publicPersona": "Ivor is a figure of discipline and stoicism in Little Middleton, often seen as a traditionalist who values order and respect. His military background has shaped his demeanor, lending him an air of authority that commands respect from those around him.",
    "privateSecret": "However, Ivor harbors a secret resentment towards the victim, blaming him for a failed business venture that led to his financial ruin. This anger simmers just beneath the surface, threatening to boil over at any moment as he grapples with feelings of betrayal.",
    "motiveSeed": "The desire for revenge against the victim for what he perceives as a betrayal over family inheritance fuels Ivor's actions.",
    "motiveStrength": "strong",
    "alibiWindow": "Ivor claims he was outside tending to the garden from 8:30 PM on, a statement that could be corroborated by neighbors.",
    "accessPlausibility": "possible",
    "stakes": "For Ivor, this investigation is not just about seeking justice; it is about reclaiming his family's legacy and restoring his own dignity in the community.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks in a direct, no-nonsense manner, often cutting to the chase without much embellishment. His military training has instilled in him a sense of discipline that reflects in his speech, making him appear formidable and unyielding.",
    "internalConflict": "Ivor grapples with his feelings of anger and betrayal, struggling to navigate the fine line between seeking justice and allowing his emotions to cloud his judgment. He must confront the true value of family and the legacy he wishes to leave behind.",
    "personalStakeInCase": "This case is deeply personal for Ivor, as it represents not only a chance for revenge but also a path to reclaiming his family's legacy and his own sense of worth.",
    "paragraphs": [
      "Captain Ivor Hale was a man of discipline, his military background evident in every aspect of his life. In Little Middleton, he was known as a stalwart figure, a traditionalist who valued order and respect above all else. His stoic demeanor commanded respect, yet few could see the simmering anger that lay just beneath the surface. Ivor's life had taken a downturn after a failed business venture, and he blamed the victim for his financial ruin, a resentment that festered within him like a wound that refused to heal.",
      "The murder of the victim became a turning point for Ivor, igniting a desire for revenge that had been long suppressed. He felt betrayed, not just by the victim but by the very family that had once been his pride. The whispers of inheritance disputes only fueled his fury, as he believed his family's legacy had been stolen from him. Ivor's motive was strong, driven by a need to reclaim his dignity and restore the honor that had been stripped away from him. This was not merely an investigation; it was a quest for retribution.",
      "Claiming to have been outside tending to his garden from 8:30 PM on, Ivor's alibi was plausible, with neighbors who could corroborate his whereabouts. However, the weight of his anger clouded his judgment, making him reckless in his pursuit of the truth. Ivor was determined to uncover the secrets that lay beneath the surface, even if it meant confronting the very family he had once fought to protect. His stoic exterior masked a maelstrom of emotions, a battle between the desire for justice and the need for revenge.",
      "As the investigation unfolded, Ivor found himself at a crossroads. He had to confront his feelings of anger and betrayal, questioning whether revenge was truly the answer. Would it restore his family's legacy, or would it only serve to deepen the chasm that had formed between him and those he once held dear? The stakes were high, and Ivor knew that the path ahead would demand more than just discipline; it would require him to reevaluate what it meant to be a part of a family and the true value of legacy."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a free-spirited artist driven by passion and ideals, yet she finds herself disillusioned and financially strained. Secretly dependent on the victim for support, her fear of losing that safety net complicates her relationship with the investigation.",
    "publicPersona": "Beatrice is known in Little Middleton as a vibrant and passionate artist, her free spirit evident in her bold canvases and fervent advocacy for social change. She is a beloved figure among the youth, often inspiring them to pursue their dreams and challenge societal norms.",
    "privateSecret": "However, beneath her spirited exterior lies a troubling truth; Beatrice has been borrowing money from the victim, a financial lifeline that she fears could be severed with the murder. This dependency creates a complex emotional landscape for her as she navigates the investigation.",
    "motiveSeed": "Beatrice's fear of losing her financial support from the victim drives her actions, as she grapples with the implications of being cut off.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice claims to have been in her studio working on a painting from 8:00 PM to 9:30 PM, a time frame that could easily be verified but is not entirely reliable.",
    "accessPlausibility": "unlikely",
    "stakes": "For Beatrice, this investigation represents a chance to break free from her financial woes and pursue her artistic dreams without the burden of dependency.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice has a lively and animated way of speaking, often punctuating her sentences with expressive gestures. Her language is peppered with artistic metaphors and a playful sarcasm that reflects her sardonic view of the world.",
    "internalConflict": "Beatrice wrestles with her ideals and the reality of her circumstances, struggling to reconcile her passion for art with the financial burdens that threaten to stifle her creativity. The investigation forces her to confront her dependency and the fear of losing her support system.",
    "personalStakeInCase": "This case is particularly significant for Beatrice, as it represents not only a chance to escape her financial troubles but also a moment of reckoning with her own ideals and the need for true independence.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of a free spirit, her life a vibrant canvas splashed with passion and ideals. In Little Middleton, she was known as an artist who challenged the status quo, advocating for social change through her evocative works. Her animated presence drew people in, inspiring them to pursue their dreams and embrace their individuality. Yet, beneath the colorful exterior lay a stark reality that threatened to dim her light. Beatrice was secretly dependent on the victim for financial support, a safety net that had become her lifeline amidst the chaos of her artistic pursuits.",
      "The murder sent ripples through Beatrice's world, igniting a fear that gnawed at her very core. Losing the victim's support would mean facing her financial woes alone, a prospect that filled her with dread. The whispers of dependency and vulnerability echoed in her mind, complicating her feelings toward the investigation. She wanted to be free, to create without the weight of financial burdens, yet the thought of being cut off from her source of support loomed like a dark cloud over her aspirations.",
      "Claiming to have been in her studio working on a painting from 8:00 PM to 9:30 PM, Beatrice's alibi was both a comfort and a source of anxiety. It could be easily verified, yet the specter of doubt lingered. She found herself caught in a web of emotions, oscillating between the desire to protect her artistic freedom and the fear of losing the safety net that had allowed her to pursue her dreams. The stakes were high, and the investigation became a reflection of her internal struggle.",
      "As Beatrice navigated the complexities of the case, she wrestled with her ideals and the reality of her circumstances. The investigation forced her to confront her dependency on the victim and the implications of her choices. Would she find the courage to break free from the chains of financial reliance, or would she continue to allow her circumstances to dictate her path? This case was a turning point for Beatrice, a moment of reckoning that could either liberate her or bind her further to the past."
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
    "type": "country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Little Middleton Manor is a grand estate steeped in history, embodying a blend of Georgian elegance and Victorian opulence, set against the backdrop of the English countryside. Its sprawling grounds and labyrinthine layout create an atmosphere thick with mystery and tension.",
    "visualDescription": "The manor rises majestically from the rolling hills, its red brick façade adorned with white trim, while tall chimneys pierce the overcast sky. Intricate stone carvings frame the windows, and a sweeping staircase leads to the grand entrance, flanked by manicured hedges and vibrant flowerbeds that contrast with the somber skies above.",
    "atmosphere": "The estate radiates an air of unease, as the overcast sky looms like a shroud, casting long shadows across the manicured lawns and hidden corners of the property.",
    "paragraphs": [
      "Little Middleton Manor stands as a testament to the wealth and ambition of a bygone era, its sprawling wings and central courtyard enveloped by lush gardens and dense woodlands. The architecture, a harmonious blend of Georgian symmetry and Victorian embellishment, invites admiration while also hinting at the secrets contained within its walls. The overcast weather adds a weighty silence to the air, broken only by the occasional rustle of leaves or the distant call of a bird, echoing the tension that pervades the estate.",
      "As guests gather in the drawing room, the atmosphere thickens, a palpable tension settling among them. The aged oak furniture, polished to a high sheen, reflects the flickering light of the brass sconces, illuminating the faces of those present with a warm glow that belies the chill in the air. Outside, the gardens stretch into the distance, their beauty marred by the oppressive sky, while the looming trees stand like sentinels, guarding their secrets and casting eerie shadows across the manicured lawns.",
      "Within the manor's interior, the layout is a maze of corridors and locked doors, each room steeped in history yet brimming with potential for intrigue. The library, with its towering shelves filled with leather-bound tomes, remains a sanctuary for the owner, accessible only to those deemed worthy. The study, with its heavy oak desk and cluttered typewriter, serves as a hub of activity, where whispered conversations and furtive glances reveal the underlying social anxieties of the period. As the rain begins to fall, the sound of droplets against the windows adds a rhythmic backdrop to the mounting tension, creating an atmosphere ripe for unraveling the mystery that lies ahead.",
      "As night falls, the manor transforms, its once-warm glow dimming under the weight of the encroaching darkness. The shadows deepen, and the distant sound of the clock striking the hour reverberates through the halls, a reminder of time slipping away. The gardens, now cloaked in twilight, become a realm of uncertainty, where every rustle and whisper could signal danger. In this moment, the estate becomes a character in its own right, an intricate web of isolation and intrigue, where the past and present collide, and the truth lies hidden, waiting to be uncovered."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "overcast with occasional rain showers, typical for the English countryside",
    "timeFlow": "Three days of mounting tension, as secrets unfold and relationships fray within the estate.",
    "mood": "tense and foreboding, reflecting the underlying social anxieties of the period",
    "eraMarkers": [
      "Whispers of the Great Depression echo in conversations, highlighting class tensions among the guests.",
      "A vintage radio crackles with distant broadcasts, providing news of the outside world that feels increasingly far away.",
      "Typewriters clatter in the study, as letters and telegrams are penned, each missive carrying the weight of urgency."
    ],
    "sensoryPalette": {
      "dominant": "The damp, earthy scent of rain-soaked soil mingling with the musty aroma of old books.",
      "secondary": [
        "The faint, nostalgic smell of polished wood and beeswax from the antique furniture.",
        "The subtle whiff of tobacco smoke lingering in the air from the gentlemen's cigars."
      ]
    },
    "paragraphs": [
      "The overcast sky blankets the estate, casting a muted light that dulls the vibrant colors of the gardens and cloaks the manor in a shroud of mystery. The sound of rain pattering against the windows adds a rhythmic pulse to the atmosphere, harmonizing with the uneasy murmurs of the guests as they navigate the labyrinth of the manor’s rooms. Each corridor seems to stretch infinitely, leading to hidden corners where secrets lie in wait, heightening the sense of foreboding that hangs heavily in the air.",
      "As the day gives way to evening, the flickering candlelight casts dancing shadows across the walls, creating an illusion of movement that feels almost alive. The scent of damp earth from the gardens mingles with the warmth of the hearth inside, a juxtaposition that speaks to the duality of comfort and danger present within the estate. Tension builds with every tick of the mantel clock, marking the passage of time while simultaneously reminding the occupants of the impending doom that looms just beyond the manor’s imposing doors."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The East Wing Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a grand, high-ceilinged room lined with dark wood shelves that groan under the weight of countless leather-bound volumes. A large bay window overlooks the gardens, its glass streaked with rain, while a massive oak desk sits at the center, papers strewn across its surface, hinting at recent activity.",
      "sensoryDetails": {
        "sights": [
          "Rows of dusty tomes stand sentinel on the shelves, their spines cracked and faded, as if they hold untold stories waiting to be uncovered.",
          "A solitary armchair, upholstered in rich burgundy fabric, sits near the window, the fabric worn and frayed at the edges, suggesting it has been a favored spot for quiet contemplation."
        ],
        "sounds": [
          "The soft rustle of pages turning echoes in the stillness, punctuated by the occasional drip of rainwater from the window ledge onto the polished wooden floor.",
          "A clock ticks methodically in the corner, its sound amplifying the tension as it measures the passing moments of uncertainty."
        ],
        "smells": [
          "The musty scent of aged paper and leather fills the air, mingling with the faint aroma of dampness from the rain-soaked surroundings.",
          "A hint of wood polish lingers, a reminder of the care taken to maintain the elegance of the room, contrasting with the chaos of the recent events."
        ],
        "tactile": [
          "The coolness of the wooden desk contrasts sharply with the warmth of the armchair, inviting guests to linger while also reminding them of the discomfort of the situation.",
          "The texture of the thick, worn rug underfoot feels plush yet heavy, absorbing the sound of footsteps and adding to the air of secrecy."
        ]
      },
      "accessControl": "The library is typically accessible only to the owner and a select few guests, with access granted only during specific hours, such as after breakfast or before dinner. Staff must knock and await permission before entering, creating an air of exclusivity.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-streaked windows blur the view of the gardens, transforming the vibrant colors into a muted palette of greens and browns.",
            "The grey light filtering through the clouds casts an ethereal glow over the room, highlighting the dust motes dancing in the air."
          ],
          "sounds": [
            "The steady drumming of rain on the roof creates a soothing yet ominous backdrop, as if nature itself is warning of the events to come.",
            "Occasional thunder rumbles in the distance, creating a sense of urgency and foreboding."
          ],
          "smells": [
            "The scent of damp earth wafts in through the window, mingling with the musty aroma of the books, creating a heavy, oppressive atmosphere.",
            "A faint whiff of mildew hints at the library's lack of ventilation, adding to the sense of decay."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light fills the room, casting long shadows that stretch across the floor and create an unsettling play of light and dark.",
            "The silence is punctuated only by the occasional flutter of pages as a guest nervously peruses the titles on the shelves."
          ],
          "sounds": [
            "Silence reigns, broken only by the distant ticking of the clock, each tick echoing like a heartbeat in the tense atmosphere.",
            "The creak of the floorboards outside the library signals the approach of someone, heightening the sense of anticipation."
          ],
          "smells": [
            "The scent of beeswax from the polished furniture fills the room, a stark contrast to the heavy smell of dust that clings to the air.",
            "A hint of woodsmoke from the fireplace, now cold, lingers, suggesting a recent gathering that has since dispersed."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the dark wood, casting dancing shadows that create an illusion of movement among the bookshelves.",
            "The last rays of sunlight filter in, illuminating the dust particles in the air like tiny stars suspended in time."
          ],
          "sounds": [
            "The soft tick of the mantel clock marks the passage of time, each tick resonating in the stillness, amplifying the sense of urgency.",
            "Distant voices from below stairs echo softly, their laughter a stark contrast to the heavy atmosphere within the library."
          ],
          "smells": [
            "The warm scent of candle wax fills the air, mingling with the lingering aroma of tobacco from the earlier gathering.",
            "A faint whiff of cold fireplace ash suggests that the hearth has not been used recently, adding to the feeling of abandonment."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library stands as a sanctuary of knowledge, yet in the wake of recent events, it has transformed into a scene of unease. The air is thick with the weight of unspoken words, and the dim light casts an unsettling glow over the room. Each book on the shelf seems to hold a secret, and as guests enter, they are acutely aware of the tension that hangs in the air, a reminder that knowledge can both illuminate and obscure the truth.",
        "As the rain patters against the windows, the atmosphere shifts, a reminder of the world outside, where danger lurks just beyond the estate's borders. The library, with its rich history and hidden depths, becomes a crucible for the unfolding mystery, where every detail could be the key to unraveling the truth behind the clockwork trap that has ensnared them all."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Lavishly decorated with plush sofas and heavy drapes that frame large windows, the drawing room is a picture of elegance and comfort. The ornate fireplace, adorned with intricate carvings, serves as a focal point, while a grand piano sits silently in the corner, a testament to the refined tastes of the manor's inhabitants.",
      "sensoryDetails": {
        "sights": [
          "The rich colors of the upholstery, deep greens and burgundies, create a warm yet somber atmosphere, contrasting sharply with the gloom outside.",
          "Portraits of stern ancestors gaze down from the walls, their eyes seeming to follow visitors, adding to the room's sense of history and weight."
        ],
        "sounds": [
          "The soft crackle of the fire fills the room with a comforting sound, though it feels oddly out of place given the tension in the air.",
          "Occasional laughter from guests mingles with the clinking of glasses, yet the sound feels strained, as if everyone is putting on a brave face."
        ],
        "smells": [
          "The aroma of polished wood and fresh flowers from a vase on the mantelpiece fills the air, a fleeting reminder of beauty amidst the growing unease.",
          "Hints of cigar smoke linger, a reminder of the previous evening's gatherings, creating a layered scent that speaks to the manor's social life."
        ],
        "tactile": [
          "The plush fabric of the sofas invites guests to sink in, yet the tension in the air makes it difficult to relax fully.",
          "The cool marble of the fireplace surround contrasts with the warmth of the room, a reminder of the outside chill that permeates the estate."
        ]
      },
      "accessControl": "The drawing room is open to all guests and family members, serving as a central hub for social gatherings. Staff are allowed during specific hours to maintain the room, but must excuse themselves when guests are present.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops slide down the glass panes, distorting the view of the gardens and creating a sense of isolation.",
            "The muted light casts a grey hue over the room, softening the once-vibrant colors of the upholstery."
          ],
          "sounds": [
            "The sound of rain hitting the roof creates a soothing rhythm, yet the atmosphere feels heavy with unspoken tension.",
            "Occasional thunder rumbles in the distance, a reminder of the storm brewing outside."
          ],
          "smells": [
            "The scent of dampness seeps in through the windows, mingling with the floral notes from the vase, creating an odd juxtaposition.",
            "A hint of mildew from the damp air lingers, underscoring the manor's age and the weight of its history."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The afternoon light is subdued, casting long shadows across the floor and creating an atmosphere of melancholy.",
            "The portraits on the walls seem to loom larger in the dim light, their expressions more pronounced in the gloom."
          ],
          "sounds": [
            "The distant sound of rain pattering against the windows creates a steady backdrop, amplifying the feeling of confinement.",
            "The occasional murmur of conversation is punctuated by the clinking of glasses, though it feels forced rather than genuine."
          ],
          "smells": [
            "The aroma of fresh flowers persists, yet it feels overshadowed by the mustiness of the air, a reminder of the estate's age.",
            "The lingering scent of cigar smoke from the previous evening adds a layer of complexity to the atmosphere."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The room is aglow with the soft light of flickering candles, casting shadows that dance along the walls.",
            "The grand piano stands silent, its polished surface reflecting the warm light, yet it feels like a harbinger of secrets yet to be revealed."
          ],
          "sounds": [
            "The crackle of the fire in the fireplace creates a comforting sound, yet it feels like a fragile facade over the tension brewing beneath.",
            "Distant laughter from the dining room carries through the air, but it feels strained, a reminder of the underlying discord."
          ],
          "smells": [
            "The warm scent of the fire mingles with the sweet aroma of dessert being served, creating a sense of normalcy that feels almost deceptive.",
            "A faint whiff of tobacco smoke lingers, a reminder of the previous gatherings that have taken place in this space."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room is a space of elegance and comfort, yet the atmosphere is tinged with an unsettling tension. Guests gather in clusters, their conversations punctuated by nervous laughter that barely masks the underlying anxiety. The plush sofas and ornate furnishings invite relaxation, yet the weight of history and the recent events loom large, creating an environment that feels both inviting and suffocating.",
        "As the evening unfolds, the flickering candlelight casts an intimate glow, yet the shadows that dance across the walls seem to whisper of secrets best left unspoken. The air is thick with the scent of polished wood and fresh flowers, yet it is tinged with the lingering aroma of cigar smoke, a reminder of the social gatherings that have occurred within these walls. In this drawing room, the lines between comfort and discomfort blur, making it a perfect setting for intrigue and revelation."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A stark contrast to the grandeur of the drawing room, the servants' hall is functional and unadorned, with a long wooden table at its center surrounded by mismatched chairs. The dim lighting casts shadows across the stone walls, which are lined with hooks for coats and hats, and a small fireplace provides a meager warmth.",
      "sensoryDetails": {
        "sights": [
          "The rough-hewn table bears the marks of countless meals, its surface scarred and stained, telling stories of the lives of those who serve.",
          "Faded portraits of former staff hang on the walls, their expressions solemn, as if they bear witness to the secrets exchanged within these four walls."
        ],
        "sounds": [
          "The clatter of dishes and the soft murmur of voices fill the air, creating a stark contrast to the silence of the upper floors.",
          "The crackling fire in the small hearth offers a comforting sound, though it feels inadequate against the chill of the room."
        ],
        "smells": [
          "The scent of boiled potatoes and a hint of overcooked cabbage linger in the air, a reminder of the simple fare provided to the staff.",
          "A faint whiff of coal smoke from the fireplace mixes with the aromas of the kitchen, creating a homey yet harsh atmosphere."
        ],
        "tactile": [
          "The rough texture of the wooden table contrasts with the smoothness of the stone walls, creating an environment that feels both sturdy and unwelcoming.",
          "The chill in the air makes the wooden chairs feel cold against the skin, a reminder of the stark realities faced by those who keep the estate running."
        ]
      },
      "accessControl": "The servants' hall is accessible only to the staff and select family members during designated meal times. Guests are generally not permitted, creating a sense of separation between the upper and lower classes.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain drips down the small window, casting a gloomy light across the room and adding to the sense of dreariness.",
            "The shadows in the hall deepen as the clouds roll in, making the space feel even more confined and isolated."
          ],
          "sounds": [
            "The sound of rain pattering against the window creates a rhythmic backdrop, echoing the heavy atmosphere that permeates the estate.",
            "Occasional footsteps in the corridor outside remind the staff of their responsibilities, creating a constant sense of urgency."
          ],
          "smells": [
            "The smell of wet earth wafts in through the window, mingling with the lingering aromas of the previous evening's meal.",
            "A hint of dampness clings to the air, underscoring the lack of ventilation and the weight of the estate's history."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The afternoon light is dim, casting long shadows across the table and creating an atmosphere of melancholy.",
            "The flickering light from the small fire barely illuminates the room, adding to the sense of confinement."
          ],
          "sounds": [
            "The quiet murmurs of conversation among the staff create a low hum, punctuated by the clatter of dishes being cleaned.",
            "The occasional crack of the fire breaks the silence, providing a momentary warmth amidst the cold air."
          ],
          "smells": [
            "The scent of boiled vegetables lingers heavily, a reminder of the simple meals served to the staff, contrasting sharply with the lavish feasts enjoyed by the guests.",
            "A faint whiff of coal smoke from the fireplace adds a layer of complexity to the atmosphere, grounding it in the reality of their labor."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The flickering light from the fireplace casts a warm glow, creating a sense of camaraderie among the staff as they gather for their evening meal.",
            "The shadows dance along the walls, adding a layer of intimacy to the otherwise stark environment."
          ],
          "sounds": [
            "Laughter and chatter fill the air, a stark contrast to the silence of the upper floors, creating a sense of community among the staff.",
            "The sound of cutlery clinking against plates creates a comforting rhythm, underscoring the warmth of the moment."
          ],
          "smells": [
            "The aroma of freshly baked bread wafts through the air, mingling with the scents of the evening meal, creating a sense of home amidst the chaos.",
            "A hint of coal smoke from the fireplace adds warmth to the atmosphere, grounding the staff in their daily routines."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The servants' hall is a stark contrast to the opulence of the drawing room, its functional design reflecting the lives of those who work behind the scenes. Here, the air is thick with the aromas of simple fare and the sounds of soft chatter, creating an atmosphere that feels both homely and harsh. The long wooden table, scarred from years of use, stands as a testament to the camaraderie among the staff, yet the shadows that linger in the corners remind them of their place in the hierarchy of the estate.",
        "As the day wears on, the tension in the air grows palpable, a reminder that secrets are not confined to the upper floors. The flickering light from the fireplace casts dancing shadows across the stone walls, creating an air of intimacy that feels almost deceptive. In this hall, where the staff gather to share their lives, the whispers of the past echo, hinting at the mysteries that lie just beneath the surface, waiting to be uncovered."
      ]
    }
  ],
  "note": "",
  "cost": 0.0029577718499999997,
  "durationMs": 37983
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1932,
    "month": "September",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "September",
    "weather": [
      "overcast with occasional rain showers",
      "cool breezes",
      "mists rolling in from the countryside"
    ],
    "daylight": "Days are growing shorter, with sunset around six-thirty in the evening, and a chill in the air signaling the onset of autumn.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when shadows lengthen and the estate grows eerily quiet.",
    "holidays": [
      "Harvest Festival (September 24)"
    ],
    "seasonalActivities": [
      "apple picking in the orchards",
      "attending local harvest fairs",
      "hiking through the moors as leaves begin to change"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suit with a waistcoat",
        "bowler hat",
        "polished leather shoes"
      ],
      "casual": [
        "tweed blazer",
        "knitted vest",
        "flannel trousers"
      ],
      "accessories": [
        "silk handkerchief",
        "leather gloves",
        "watch chain"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with drop waist",
        "cloche hat",
        "string of pearls"
      ],
      "casual": [
        "knitted cardigan",
        "pleated skirt",
        "silk blouse"
      ],
      "accessories": [
        "feathered fascinator",
        "embroidered handbag",
        "ankle boots"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco design influences in clothing",
      "increased use of synthetic fabrics like rayon",
      "hats becoming more elaborate with feathers and decorations"
    ],
    "socialExpectations": [
      "men expected to wear hats outdoors",
      "women encouraged to maintain an air of modesty",
      "social gatherings often dictated by class and wealth"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "intensifying economic struggles leading to protests in major cities",
      "political discussions surrounding the rise of fascism in Europe",
      "the British government considering further cuts to welfare programs"
    ],
    "politicalClimate": "Increasingly unstable due to economic downturn, with rising tensions between different social classes and a growing fear of radical political movements.",
    "economicConditions": "Deepening effects of the Great Depression, with widespread unemployment and inflation impacting everyday life.",
    "socialIssues": [
      "class disparity becoming more pronounced",
      "debate over women's rights and suffrage continuing",
      "increased anti-Semitic sentiments emerging in Europe"
    ],
    "internationalNews": [
      "Nazi Party gaining traction in Germany",
      "political unrest in Spain with rising tensions between republicans and monarchists"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Birth of the Blues' by Al Jolson",
        "'Ain't She Sweet' by Milton Ager",
        "'Blue Moon' by Richard Rodgers"
      ],
      "films": [
        "'Scarface' directed by Howard Hawks",
        "'The Most Dangerous Game' directed by Ernest B. Schoedsack",
        "'The Sign of the Cross' directed by Cecil B. DeMille"
      ],
      "theater": [
        "'Of Mice and Men' by John Steinbeck",
        "'The Front Page' by Ben Hecht and Charles MacArthur",
        "'The Royal Family' by George S. Kaufman"
      ],
      "radio": [
        "'The Shadow' - a popular crime drama",
        "'Amos 'n' Andy' - a comedic program",
        "'The Green Hornet' - adventure series"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Brave New World' by Aldous Huxley",
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "social realist novels",
        "political commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator becoming popular in homes",
        "advancements in radio technology improving sound quality",
        "the introduction of affordable automobiles like the Ford Model B"
      ],
      "commonDevices": [
        "home radio sets",
        "typewriters for business correspondence",
        "early model telephones"
      ],
      "emergingTrends": [
        "increased use of household appliances",
        "growing popularity of cinema and film technology",
        "the expansion of consumer culture"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: four pence",
        "pint of milk: two pence",
        "cinema ticket: one shilling"
      ],
      "commonActivities": [
        "attending local fairs and markets",
        "gathering for tea in the afternoon",
        "visiting family on weekends"
      ],
      "socialRituals": [
        "afternoon tea with family and friends",
        "formal dinner parties showcasing wealth and status"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing resentment between upper and working classes",
      "increased solidarity among working-class communities",
      "upper classes retaining traditional privileges despite economic pressures"
    ],
    "gender": [
      "women increasingly seeking independence through work",
      "men expected to be the primary breadwinners",
      "gender roles becoming more rigid as economic stability wavers"
    ],
    "race": [
      "rising xenophobia in response to economic hardship",
      "discussions around racial equality gaining momentum in urban areas",
      "immigrant populations facing increased scrutiny and discrimination"
    ],
    "generalNorms": [
      "social gatherings dictated by class",
      "emphasis on propriety and decorum in public life",
      "a growing acceptance of leisure activities as a respite from hardship"
    ]
  },
  "atmosphericDetails": [
    "The distant sound of thunder rolls across the moors, with the scent of damp earth and decaying leaves filling the air.",
    "Soft whispers of the wind rustle through the trees, carrying with them the chill of approaching autumn and the tension of unspoken fears.",
    "The flickering light from oil lamps casts eerie shadows in the large country house, where the weight of secrets hangs heavy in the air."
  ],
  "paragraphs": [
    "In September 1932, the English countryside is cloaked in a veil of overcast skies, the air thick with the promise of rain. The days are shortening, casting a somber light over the sprawling country house estate, where the latest whispers of the Great Depression echo through the halls. As the Harvest Festival approaches, the estate’s occupants feel the weight of social anxieties, heightened by the economic struggles plaguing the nation. The tension is palpable, with the fear of what the future holds lurking in every shadow of the estate.",
    "Fashion reflects this climate of uncertainty, as men don tailored three-piece suits with polished leather shoes, while women embrace tea-length dresses adorned with pearls. The cloche hats worn by the ladies bob gently in the breeze, while men’s bowler hats cast a shadow over their furrowed brows. The colors of their clothing are muted, echoing the season’s transition and the collective unease felt across the social spectrum. As they prepare for gatherings and formal dinners, the underlying tensions of class divisions loom over every interaction.",
    "Daily life in this era is marked by both routine and upheaval. Afternoon teas are a sacred ritual for the upper class, while the working class grapples with rising prices and dwindling resources. Apples are harvested in the orchards, and families venture out to local markets, where the scent of fresh produce mingles with the dampness of the autumn air. Cinema tickets are a small escape from the harsh realities of life, with the latest films offering a temporary reprieve from the anxieties of the day. Yet, with each passing moment, the shadows of uncertainty creep closer to the heart of the estate, setting the stage for the clockwork trap that is to unfold."
  ],
  "note": "",
  "cost": 0.00112114035,
  "durationMs": 14798
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "The looming threat of financial ruin amidst the Great Depression unites the manor's residents and guests, each grappling with their own secrets while navigating the tensions of class and privilege.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class tensions, with the wealthy clinging to their status while the working class faces increasing hardship, all under the shadow of rising fascism influencing local politics."
  },
  "setting": {
    "location": "a grand manor house set in expansive grounds, displaying a mix of Georgian and Victorian architectural styles, with multiple wings and a central courtyard",
    "institution": "country house estate",
    "weather": "overcast with occasional rain showers, typical for the English countryside"
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
    "id": "temperature",
    "value": "ninety degrees Fahrenheit",
    "description": "The temperature of the clock casing at the time of the murder"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study was found stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This indicates a potential time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The time discrepancy suggests the clock may not reflect the actual time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This raises doubts about the reliability of the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Witness statements indicate conflicting times regarding the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This suggests that the timeline of events is unclear.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The inconsistencies in witness accounts suggest the murder time was manipulated.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This indicates potential foul play in the timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "Fingerprints on the clock's casing match Captain Ivor Hale.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This links Captain Hale to the tampering of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "This indicates that Captain Hale had tampered with the clock.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This suggests a motive for altering the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock was tampered with to create a false narrative of the murder timeline.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "This reveals the mechanism of how the murder timeline was altered.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The time discrepancy suggests the clock may not reflect the actual time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This raises doubts about the reliability of the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she has a corroborated alibi placing her away from the scene at the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This narrows the suspect list towards Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "behavioral",
      "description": "Captain Hale displayed signs of financial desperation leading up to the murder.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "This indicates a possible motive for the crime.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was seen at a public event during the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This confirms her innocence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because her alibi was corroborated by multiple witnesses.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This narrows the solution toward Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "temporal",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Eleanor Voss was known to have arguments with the victim shortly before the murder.",
      "supportsAssumption": "Eleanor Voss’s murder occurred at the time indicated by the clock.",
      "misdirection": "This could imply a motive, but it does not directly connect her to the crime."
    },
    {
      "id": "rh_2",
      "description": "Witnesses claim they saw Eleanor Voss near the study around the time of the murder.",
      "supportsAssumption": "Eleanor Voss’s murder occurred at the time indicated by the clock.",
      "misdirection": "This sighting is unreliable and does not confirm her involvement."
    }
  ],
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
      "clue_3",
      "clue_4",
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_captain_ivor_hale"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_core_elimination_chain",
      "clue_7",
      "clue_8"
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
  "latencyMs": 12268,
  "cost": 0.0031203183
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

## Message 3 (role=user)

```text
The previous response failed validation with this error:
Schema validation failed on attempt 1: validationConfirmations is required

Please correct the issues and return a valid JSON object. Mandatory checks:
- All required fields are present
- characterPortraits has one entry per cast member
- characterVoiceSketches has one entry per cast member
- characterPortraits and characterVoiceSketches preserve CASE.cast name order exactly
- humourPlacementMap has all 12 scene positions, each with a non-empty rationale string
- Every humourPlacementMap entry must have a "rationale" field — this is required even for "forbidden" entries
- humourPlacementMap must include each required scenePosition exactly once (no missing/duplicate positions)
- validationConfirmations all set to true
- storyEmotionalArc.arcDescription MUST be at least 300 words (target 350). Count every word before submitting. A single dense paragraph is not enough — write multiple paragraphs tracing the emotional journey from opening through climax to resolution.
- storyTheme MUST be at least 25 words — a complete sentence with a subject, main clause, and nuanced qualifier. Not a title or fragment.
- revealImplications MUST be at least 90 words
- Return only the JSON object, no preamble
```
