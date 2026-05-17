# Actual Prompt Record

- Run ID: `mystery-1779007383099`
- Project ID: ``
- Timestamp: `2026-05-17T08:45:19.988Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `f4ccd0358bb5f95d`

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
    "title": "The Clock Strikes Guilt",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Voss Manor",
      "country": "England",
      "institution": "Manor house"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "timing manipulation"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Charming heiress and host",
      "private_secret": "Knows more about family secrets than she lets on.",
      "motive_seed": "Protecting her family's reputation.",
      "motive_strength": "high",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Household staff",
        "Personal connections"
      ],
      "behavioral_tells": [
        "Calm demeanor",
        "Intense gaze"
      ],
      "stakes": "Her family's honor.",
      "evidence_sensitivity": [
        "High"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss (friend)"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Has a hidden past with the victim.",
      "motive_seed": "Revenge for a ruined career.",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Library",
        "Study"
      ],
      "behavioral_tells": [
        "Fidgeting hands",
        "Avoids eye contact"
      ],
      "stakes": "Professional reputation.",
      "evidence_sensitivity": [
        "Moderate"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss (former suitor)"
      ],
      "public_persona": "Dashing military officer",
      "private_secret": "Harbors unrequited love for Eleanor.",
      "motive_seed": "Jealousy over the victim's influence.",
      "motive_strength": "high",
      "alibi_window": "7:30 PM to 8:15 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Garden",
        "Conservatory"
      ],
      "behavioral_tells": [
        "Clenching fists",
        "Tense posture"
      ],
      "stakes": "Winning Eleanor's affection.",
      "evidence_sensitivity": [
        "High"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss (cousin)"
      ],
      "public_persona": "Socialite and gossip",
      "private_secret": "Knew about the victim's secrets.",
      "motive_seed": "Financial gain from inheritance.",
      "motive_strength": "moderate",
      "alibi_window": "8:10 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Bedrooms",
        "Dining room"
      ],
      "behavioral_tells": [
        "Nervous laughter",
        "Frequent glances at clock"
      ],
      "stakes": "Inheritance.",
      "evidence_sensitivity": [
        "Moderate"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "At Voss Manor, Eleanor Voss must unravel the mystery of a murder steeped in deception, where the tampering of a clock leads to a tangled web of motives and secrets. The evening's events shift like the hands of a clock, revealing a truth hidden in time."
    },
    "accepted_facts": [
      "The victim was found dead in the library.",
      "The clock in the study was stopped at a specific time.",
      "Witnesses recall conflicting times for the murder."
    ],
    "inferred_conclusions": [
      "The murder timing has been manipulated.",
      "The suspect's alibi may be false.",
      "The tampering of the clock is central to understanding the crime."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was deliberately wound back to mislead witnesses about the murder's timing.",
      "delivery_path": [
        {
          "step": "The clock was tampered with before the murder."
        },
        {
          "step": "Witnesses were misled by the displayed time."
        },
        {
          "step": "The true time of death was obscured."
        }
      ]
    },
    "outcome": {
      "result": "Dr. Mallory Finch is exposed as the true culprit."
    }
  },
  "false_assumption": {
    "statement": "The murder's motive must be tied to the victim's recent actions and relationships.",
    "type": "temporal",
    "why_it_seems_reasonable": "The victim was disliked by many, leading to assumptions about immediate motives.",
    "what_it_hides": "The real motive is rooted in a past grievance."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "8:00 PM",
        "9:00 PM"
      ],
      "windows": [
        "7:30 PM to 9:00 PM"
      ],
      "contradictions": [
        "Dr. Mallory claims he was with Eleanor during the murder time but was seen elsewhere."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "The clock",
        "Murder weapon",
        "Library"
      ],
      "permissions": [
        "Access to the study",
        "Alibi checking"
      ]
    },
    "physical": {
      "laws": [
        "Time manipulation due to mechanical tampering."
      ],
      "traces": [
        "Fingerprints on the clock mechanism",
        "Chemical residue from tampering"
      ]
    },
    "social": {
      "trust_channels": [
        "Family loyalties",
        "Friendship bonds"
      ],
      "authority_sources": [
        "Household staff",
        "Local constabulary"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows the hands misaligned from the clock face.",
        "correction": "This indicates tampering occurred before the murder.",
        "effect": "Narrows evidence to the clock mechanism as central to the case.",
        "required_evidence": [
          "The clock in the study shows the hands misaligned from the clock face.",
          "Witnesses recall hearing the clock chime at an unusual hour."
        ],
        "reader_observable": true
      },
      {
        "observation": "A note near the clock indicates a specific time, contradicting witness statements.",
        "correction": "The note suggests the murder was planned to appear at a different time.",
        "effect": "Eliminates the possibility of random timing.",
        "required_evidence": [
          "The note found near the clock indicates a specific time.",
          "Witness statements show conflicting times."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory's alibi is that he was with Eleanor, but he was seen leaving the study at 8:15 PM.",
        "correction": "This time discrepancy indicates his alibi cannot hold.",
        "effect": "Eliminates Dr. Mallory Finch as a credible witness.",
        "required_evidence": [
          "Dr. Mallory's alibi is that he was with Eleanor.",
          "Witnesses saw him leaving the study at 8:15 PM."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Recreating the timeline with the clock's tampering evidence, proving that Dr. Mallory's alibi is impossible.",
    "knowledge_revealed": "The clock's timing was intentionally altered, affecting the murder timeline.",
    "pass_condition": "If Dr. Mallory's timeline cannot align with the evidence, he is guilty.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_9",
      "clue_6",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The misaligned clock hands and unusual chime (early) show tampering. Step 2: The note (mid) contradicts witness statements about timing. Step 3: Dr. Mallory's alibi conflicts with the established timeline (discriminating test)."
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
        "clearance_method": "Prove his alibi was solid during the critical time.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Demonstrate her presence was accounted for elsewhere.",
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
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
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
    "summary": "A retired schoolteacher turned amateur sleuth, Eleanor Voss possesses a nurturing demeanor and a sharp intellect, but beneath her calm exterior lies a simmering resentment from a past affair that derailed her career.",
    "publicPersona": "Eleanor is known in Little Middleton as a nurturing mentor, always ready to lend a listening ear to the town’s youth. Her keen mind for detail, often displayed in her meticulous garden, earns her the respect of the community, making her a beloved figure.",
    "privateSecret": "Though she presents herself as a guiding figure, Eleanor harbors deep resentment for a past affair with a fellow educator that not only ruined her career but also left her feeling betrayed and bitter. This secret festers within her, complicating her relationships with those who remind her of her lost potential.",
    "motiveSeed": "Upon discovering a diary that reveals the victim’s secret past, Eleanor realizes it implicates her in a scandal she thought long buried. The thought of the truth being unearthed drives her to seek justice, not only for the victim but also for herself.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was present at the estate during the entire evening, her presence noted by many, but this does not shield her from suspicion given her newfound motive.",
    "accessPlausibility": "easy",
    "stakes": "For Eleanor, this case represents an opportunity for personal redemption. By uncovering the truth, she hopes to confront her past and reclaim her sense of self-worth.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often pausing to consider her words carefully. She has a penchant for ironic observations, particularly about the follies of human nature, which she delivers with a gentle smile.",
    "internalConflict": "Eleanor grapples with the guilt of her past mistakes, particularly the affair that cost her career. This case forces her to confront her feelings of inadequacy and resentment, as she seeks to prove her worth.",
    "personalStakeInCase": "The murder strikes a personal chord for Eleanor, as she believes that solving it may finally free her from the shadows of her past and restore her sense of purpose.",
    "paragraphs": [
      "Eleanor Voss stood in her garden, the scent of blooming lilacs surrounding her like a comforting embrace. To the outside world, she was the quintessential retired schoolteacher, a nurturing figure whose wisdom was sought by the town’s youth. Yet, beneath her gentle exterior lay a heart burdened by the weight of past mistakes. The affair that had once ignited her spirit now smoldered in the ashes of her career, leaving only resentment in its wake. As she picked at the weeds in her flowerbeds, she couldn't shake the feeling that her life had been hijacked by a single, foolish choice.",
      "When the news of the murder spread through Little Middleton like wildfire, Eleanor felt a familiar flutter of intrigue. The victim, a person she had once considered an acquaintance, had led a life shrouded in secrets—secrets Eleanor had inadvertently stumbled upon. The discovery of a diary revealing the victim's hidden past had sent her heart racing, for it contained the very scandal that could unravel her carefully constructed facade. The urge to uncover the truth became a consuming fire, igniting her desire for redemption.",
      "Eleanor's mind raced with possibilities as she navigated the estate, her keen eye catching every detail. She observed the guests, noting their reactions and interactions, her instincts honed from years spent teaching. Her presence at the estate during the entire evening provided her with a sense of security, yet the shadows of her past loomed large. Could she truly step into the role of investigator without her own history clouding her judgment? The thought gnawed at her as she pieced together the puzzle before her.",
      "As the investigation unfolded, Eleanor found herself at a crossroads. The stakes were higher than she had anticipated; it was not just the truth of the murder that mattered but also her own quest for self-acceptance. Each clue brought her closer to the heart of the matter, and with each revelation, she felt the chains of her past beginning to loosen. In seeking justice for the victim, could she also find a way to forgive herself? The answer lay just beyond her reach, waiting for the clock to strike guilt."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "As the local physician, Dr. Mallory Finch is perceived as a compassionate healer, yet he wrestles with a hidden fear that his professional reputation is on the brink of collapse due to the victim's looming influence.",
    "publicPersona": "Dr. Finch is well-regarded in Little Middleton, known for his dedication to community health and his warm bedside manner. He often goes above and beyond for his patients, earning their trust and admiration, which he wears like a badge of honor.",
    "privateSecret": "Beneath his caring facade, Dr. Finch is plagued by anxiety over a malpractice issue that could spell disaster for his practice. The victim had threatened to expose him during an audit, leaving him feeling vulnerable and desperate.",
    "motiveSeed": "The victim's threat to unveil his malpractice during the upcoming audit created a chasm of fear within him. Dr. Finch felt cornered, believing that if the truth came to light, it would not only ruin his career but also damage the lives of those dependent on him.",
    "motiveStrength": "moderate",
    "alibiWindow": "He arrived late to the gathering, having been called away to attend to an emergency, which he hoped would provide him with a believable excuse.",
    "accessPlausibility": "possible",
    "stakes": "For Dr. Finch, the stakes are immense; his reputation and livelihood hang in the balance, and the thought of losing everything he has worked for drives him to the edge of desperation.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Dr. Finch speaks with a slight stammer when nervous, often punctuating his sentences with self-deprecating remarks. He tends to over-explain his medical terminology, as if trying to compensate for his insecurities.",
    "internalConflict": "Dr. Finch struggles with the fear of exposure and the moral implications of his past actions. He is torn between wanting to protect his reputation and the ethical duty he has to his patients, causing a constant inner turmoil.",
    "personalStakeInCase": "This case matters to Dr. Finch not just because of the threat to his practice, but also because he must confront the consequences of his past decisions and find a way to reconcile his professional integrity with his personal fears.",
    "paragraphs": [
      "Dr. Mallory Finch glanced at the clock on the wall of his office, the ticking sound echoing in the silence. He had long been the town's trusted physician, revered for his compassionate care and dedication to the community. Yet as he sat there, the weight of his own secrets pressed heavily on his chest. The victim's untimely death felt like a dark cloud looming over him, threatening to expose the malpractice he had tried so desperately to hide. Each tick of the clock reminded him that time was running out, and he was running out of options.",
      "Arriving late to the gathering at the estate, Dr. Finch forced a smile as he greeted the guests, but inside, he was a bundle of nerves. The emergency he had attended provided a convenient alibi, yet the gnawing fear that the victim would reveal his past missteps haunted him. He had always prided himself on being a healer, but now he felt like a fraud, teetering on the edge of ruin. The thought of losing his practice and the trust of his patients sent shivers down his spine.",
      "Conversations swirled around him, and as he mingled with the guests, his self-deprecating humor surfaced. 'You know, I always thought my biggest challenge would be treating a patient with a fear of needles, not dodging the truth about my own mistakes,' he quipped, attempting to mask his anxiety with levity. But as laughter erupted, he felt like an impostor, trapped in a charade that could unravel at any moment.",
      "As the investigation unfolded, Dr. Finch found himself at a crossroads. The stakes grew higher, and the consequences of his past began to catch up with him. He was torn between the desire to protect his reputation and the ethical duty he owed to his patients. Could he navigate the murky waters of his own conscience while confronting the murder? The question lingered like a specter, and with each passing moment, he felt the walls closing in."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired military officer with a commanding presence, Captain Ivor Hale is a man of strict moral codes, yet he is haunted by a past military decision that threatens to unravel his honor.",
    "publicPersona": "Captain Hale is viewed as a traditionalist authority figure in Little Middleton, known for his commanding presence and unwavering moral compass. He is often called upon for guidance and respected for his discipline and sense of duty.",
    "privateSecret": "Beneath the facade of a steadfast leader, Captain Hale grapples with the ghosts of his past—a military decision that led to civilian casualties. This secret weighs heavily on him, as he fears it will tarnish his legacy.",
    "motiveSeed": "Believing that the victim was on the verge of exposing his wartime actions, Captain Hale feels cornered and desperate to protect the honor he has fought so hard to uphold.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claimed to be inspecting the gardens during the time of the murder, a feeble excuse that left him vulnerable to scrutiny.",
    "accessPlausibility": "unlikely",
    "stakes": "For Captain Hale, the stakes are high; his honor and family legacy are on the line, and he must navigate the treacherous waters of truth and deception.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks in a direct, clipped manner, often using military jargon and expressions. He has a tendency to be overly serious, with little patience for frivolity.",
    "internalConflict": "Captain Hale is torn between the desire to maintain his honor and the dread of his past actions coming to light. This conflict creates a tension within him, as he grapples with the weight of his decisions.",
    "personalStakeInCase": "This case is pivotal for Captain Hale, as it forces him to confront the consequences of his past actions and determine whether he will be remembered as a hero or a villain.",
    "paragraphs": [
      "Captain Ivor Hale stood in the estate's garden, the evening air thick with tension. A retired military officer, he had always prided himself on his commanding presence and strict moral codes. To the residents of Little Middleton, he was a beacon of discipline and duty, a man whose word was his bond. Yet as he surveyed the surroundings, the shadows of his past loomed large, threatening to unravel everything he had fought for.",
      "The news of the murder sent ripples through Hale's mind, igniting memories he had tried to bury. He believed the victim was about to expose a wartime decision that had led to civilian casualties, a truth that would tarnish his honor and legacy. The thought of being unmasked filled him with dread, and as he claimed to be inspecting the gardens during the time of the murder, he felt the weight of guilt pressing down on him—a burden he could not escape.",
      "In conversations with the other guests, Hale's blunt demeanor often took center stage. 'In war, one must make difficult decisions,' he would say with an air of finality, as if justifying his past to himself. His words, however, were laced with an underlying tension, a fear that his past would not remain buried. The stakes were high, and he felt the walls closing in as whispers of suspicion surrounded him.",
      "As the investigation progressed, Captain Hale found himself at a crossroads. He could either cling to the honor he had built or confront the truth of his actions. The case forced him to grapple with the legacy he would leave behind—would he be remembered as a hero or a man haunted by his choices? In the quiet moments, he pondered whether the truth would set him free or condemn him to a life of disgrace."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A charming socialite and activist, Beatrice Quill is an idealist with a passion for social change, but her involvement in a scandalous relationship threatens to derail her aspirations.",
    "publicPersona": "Beatrice is known for her charm and fashionable presence in Little Middleton, where she captivates the attention of the social elite. As a fervent activist, she promotes social change with an infectious enthusiasm that inspires those around her.",
    "privateSecret": "Beneath her glamorous exterior, Beatrice is entangled in a scandalous relationship with the victim's estranged sibling. This secret threatens to jeopardize her activism and tarnish her reputation.",
    "motiveSeed": "The victim's threat to expose her relationship created a sense of urgency within Beatrice, as she feared that her activism and future would be jeopardized if the truth came to light.",
    "motiveStrength": "moderate",
    "alibiWindow": "Although she was seen mingling with guests, she remains unaccounted for during the murder, leaving her vulnerable to suspicion.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are high; her reputation and future in activism hang in the balance, and the thought of losing everything she has worked for drives her to desperate measures.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively rhythm, often punctuating her sentences with witty remarks. She has a tendency to use sarcasm as a defense mechanism, especially when discussing serious topics.",
    "internalConflict": "Beatrice grapples with the tension between her idealistic aspirations and the reality of her scandalous relationship. This internal conflict creates a sense of urgency as she navigates her choices in the face of potential exposure.",
    "personalStakeInCase": "This case is particularly important to Beatrice, as it not only threatens her activism but also forces her to confront the reality of her choices and the impact they have on her future.",
    "paragraphs": [
      "Beatrice Quill stood amidst the glimmering chandeliers of the estate, her presence commanding attention as she mingled with the guests. A socialite with a flair for fashion, she exuded charm and charisma, captivating the elite of Little Middleton. Yet beneath her glamorous exterior, a tempest brewed—a scandalous relationship with the victim's estranged sibling had cast a shadow over her aspirations for social change. The thought of exposure sent shivers down her spine, leaving her feeling both vulnerable and defiant.",
      "As the news of the murder spread, Beatrice felt a surge of panic. The victim had threatened to reveal her relationship, a disclosure that would jeopardize not only her reputation but also her efforts in activism. 'Ah, the joys of social reform,' she quipped to a friend, sarcasm dripping from her words. 'One must always be careful not to mix business with pleasure.' But behind her sardonic humor lay a genuine fear—what would happen if the truth came to light?",
      "Throughout the evening, Beatrice navigated the gathering with a lively rhythm, her laughter echoing in the halls. Yet, as conversations turned to the murder, the weight of her secret became increasingly palpable. She was seen mingling with guests, yet she remained unaccounted for during the critical moments of the crime. The stakes felt higher than ever, and with each passing moment, she sensed the walls closing in around her.",
      "As the investigation unfolded, Beatrice found herself at a crossroads. The case forced her to confront the reality of her choices and the potential consequences of her actions. Could she rise above the scandal and prove herself as a true activist, or would her past choices define her future? The answer lay tangled within the threads of the investigation, and with every tick of the clock, she felt the urgency of her situation pressing down upon her."
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
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A grand yet foreboding estate, steeped in mystery and isolation, where secrets linger in the shadows.",
    "visualDescription": "The manor's stone façade looms against the bleak sky, with heavy oak doors flanked by intricate carvings. Tall windows, draped in heavy velvet, reflect the dim light of overcast days. The expansive gardens, once vibrant, now appear wild and unkempt, bordered by high stone walls that offer both beauty and confinement.",
    "atmosphere": "An oppressive sense of isolation prevails, as the weight of the manor's history envelops its inhabitants and visitors alike.",
    "paragraphs": [
      "Little Middleton Manor stands as a testament to another era, its grand architecture casting long shadows across the sprawling grounds. The heavy stone walls, weathered by time and rain, whisper secrets of the family that dwells within. As one approaches the entrance, the air thickens with the scent of damp earth and decaying leaves, a reminder of both nature's relentless march and the manor's fading grandeur. Inside, the dimly lit corridors echo with the soft footfalls of those who tread cautiously, as if afraid to disturb the ghosts of the past.",
      "The gardens, once a source of joy and leisure, now appear forlorn, their wild growth mirroring the tumultuous emotions brewing within the manor's walls. Gnarled branches stretch towards the sky, and overgrown hedges obscure the view, creating a labyrinthine effect. With each gust of wind, the rustle of leaves and the distant caw of crows contribute to an atmosphere thick with tension. The isolation of the estate, several miles from the nearest village, amplifies the sense of entrapment, as if the world outside has forgotten the secrets held within.",
      "Within the manor, the drawing room serves as both a gathering space and a stage for the unfolding drama. The heavy drapes filter the feeble light, casting a muted glow over the sumptuous furnishings. The crackling fire in the hearth offers a momentary warmth against the chill that seeps through the walls. Yet, in the silence, one can almost hear the ticking of the mantel clock, each chime resonating with the unspoken truths that linger in the air, waiting to be uncovered.",
      "As evening descends, the atmosphere shifts, and the shadows deepen. The scent of beeswax from the flickering candles mingles with the lingering aroma of tobacco from the men’s evening cigars. Conversations drift and linger, punctuated by uncomfortable pauses, as if the very air is charged with suspicion. Outside, the rain begins again, tapping softly against the windows, a reminder of the storm brewing both within and without."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, contributing to a gloomy and tense ambiance.",
    "timeFlow": "Days of mounting suspicion and unspoken fears.",
    "mood": "Suspenseful and foreboding, amplified by the isolation and recent social unrest.",
    "eraMarkers": [
      "Typewriters clack in the study, letters sent with urgency.",
      "Early telephones ring with news of distant events.",
      "Faded photographs of family line the walls, capturing a bygone era."
    ],
    "sensoryPalette": {
      "dominant": "The scent of damp earth and decaying leaves.",
      "secondary": [
        "Flickering candlelight casting moving shadows.",
        "The crackle of a fire fighting against the chill."
      ]
    },
    "paragraphs": [
      "The atmosphere of Little Middleton Manor is thick with the weight of history, each room echoing with whispers of the past. The overcast skies loom overhead, casting a pall over the estate that feels almost oppressive. As rain begins to patter against the windows, the sound melds with the creaking of old timbers, creating a symphony of unease. Within these walls, secrets fester, and every gaze is scrutinized as if searching for hidden motives.",
      "As the days stretch on, time seems to warp within the manor. The ticking of the clock in the drawing room serves as a constant reminder of the mounting tension, each chime reverberating with the urgency of the unfolding mystery. The isolation of the estate, far removed from the bustling village, creates a sense of entrapment, where the only escape from the growing anxiety lies in the uncharted depths of the manor itself."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Richly decorated with heavy draperies and ornate furnishings; a large fireplace dominates one wall.",
      "sensoryDetails": {
        "sights": [
          "flickering candlelight",
          "deep green velvet drapes",
          "ornate gold-framed portraits"
        ],
        "sounds": [
          "crackling fire",
          "soft murmurs of conversation",
          "the ticking of a clock"
        ],
        "smells": [
          "beeswax candles",
          "old leather upholstery",
          "smoky tobacco"
        ],
        "tactile": [
          "smooth silk cushions",
          "cold marble mantelpiece",
          "soft Persian rug underfoot"
        ]
      },
      "accessControl": "Accessible to family and guests during social hours; staff may enter only for service.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "puddles forming on the floor"
          ],
          "sounds": [
            "steady drumming of rain",
            "distant rumble of thunder"
          ],
          "smells": [
            "damp wood",
            "fresh earth from the rain"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping along the walls",
            "light struggling to break through"
          ],
          "sounds": [
            "the creak of floorboards",
            "soft whispers"
          ],
          "smells": [
            "dusty books",
            "the faint scent of lemon polish"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft glow of candlelight",
            "long shadows cast by the fire"
          ],
          "sounds": [
            "the crackle of logs burning",
            "the clink of glasses"
          ],
          "smells": [
            "warm spices from dinner",
            "the lingering scent of smoke"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room is a grand yet intimate space, where the heavy drapes filter the light and the air is thick with the scent of beeswax candles. Ornate furnishings invite guests to linger, yet the atmosphere remains taut with unspoken tensions. The crackling fire offers warmth against the chill, while the ticking clock serves as a reminder that time is slipping away, and with it, the chance to uncover the truth hidden within these walls.",
        "As the day fades into evening, the room transforms, shadows lengthening and flickering with the light of the candles. Conversations grow hushed, and the air brims with anticipation, as if the very walls are listening. Every glance exchanged carries weight, and each moment stretches, filled with the unspoken dread of what lies ahead."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Restricted access for family and trusted guests",
      "visualDetails": "Lined with towering bookshelves, the library is dimly lit and filled with the scent of old paper and leather.",
      "sensoryDetails": {
        "sights": [
          "dust motes dancing in the air",
          "leather-bound tomes lining the shelves",
          "a large mahogany desk in the center"
        ],
        "sounds": [
          "the rustle of pages turning",
          "the creak of the wooden floor"
        ],
        "smells": [
          "musty books",
          "old leather",
          "scent of polished wood"
        ],
        "tactile": [
          "smooth book covers",
          "cold brass fixtures",
          "worn rug beneath feet"
        ]
      },
      "accessControl": "Access restricted to family and select guests; locked during the night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "drizzling rain outside the window",
            "soft light filtering through glass"
          ],
          "sounds": [
            "gentle patter of rain",
            "the whisper of pages turning"
          ],
          "smells": [
            "fresh rain mingling with old paper",
            "damp wood"
          ],
          "mood": "contemplative"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadowy corners filled with dust",
            "the glow of a single lamp"
          ],
          "sounds": [
            "the distant clock ticking",
            "the rustle of a chair being moved"
          ],
          "smells": [
            "the scent of ink and parchment",
            "old wood"
          ],
          "mood": "somber"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of lamp light",
            "shadows cast by the flickering flame"
          ],
          "sounds": [
            "the crackle of a fire in the hearth",
            "soft murmurs from nearby rooms"
          ],
          "smells": [
            "the scent of burning wood",
            "the lingering aroma of tea"
          ],
          "mood": "tense reflection"
        }
      ],
      "paragraphs": [
        "The library is a sanctuary of knowledge, yet it feels more like a tomb, where the weight of history presses down upon the visitor. Dust motes dance in the dim light, and the scent of old leather and paper fills the air. The towering shelves hold volumes of forgotten lore, and the large mahogany desk stands as a solitary island amidst the sea of books. Here, secrets are kept hidden, and every turn of a page could unveil a long-buried truth.",
        "As the afternoon light wanes, shadows creep into the library, and the atmosphere thickens with anticipation. The ticking clock serves as a reminder of the relentless passage of time, each tick echoing the urgency of the mystery unfolding just beyond the locked doors. The library, though a place of refuge, becomes a chamber of secrets, where the past and present collide in a tense dance."
      ]
    },
    {
      "id": "gardens",
      "name": "The Gardens",
      "type": "exterior",
      "purpose": "Secluded area for reflection and potential clue discovery",
      "visualDetails": "Overgrown paths wind through wildflower patches, bordered by high stone walls that offer a sense of confinement.",
      "sensoryDetails": {
        "sights": [
          "wildflowers blooming in disarray",
          "gnarled branches reaching overhead",
          "stone walls covered with moss"
        ],
        "sounds": [
          "rustling leaves in the wind",
          "the distant call of a crow"
        ],
        "smells": [
          "fresh earth after rain",
          "the scent of wildflowers",
          "damp moss"
        ],
        "tactile": [
          "rough stone of the walls",
          "soft petals brushing against skin",
          "chill of the evening air"
        ]
      },
      "accessControl": "Accessible to all during daylight; becomes eerie and isolated at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops clinging to flower petals",
            "grey skies overhead"
          ],
          "sounds": [
            "the gentle patter of rain on leaves",
            "soft squelch of mud underfoot"
          ],
          "smells": [
            "wet earth",
            "fresh blooms",
            "the scent of rain"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows cast by the stone walls",
            "the flicker of movement in the underbrush"
          ],
          "sounds": [
            "a sudden gust of wind",
            "the rustle of unseen creatures"
          ],
          "smells": [
            "the dampness of the earth",
            "the faint scent of decay"
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the last light of day fading",
            "stars beginning to twinkle"
          ],
          "sounds": [
            "chirping of crickets",
            "the whisper of leaves"
          ],
          "smells": [
            "the sweet scent of night-blooming flowers",
            "cool evening air"
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The gardens of Little Middleton Manor, though once a place of beauty, now resemble a forgotten wilderness. Overgrown paths wind through wildflower patches, bordered by high stone walls that seem to whisper secrets of confinement. The air is thick with the scent of damp earth and wildflowers, and the rustling leaves create a haunting symphony. Here, amongst the tangled foliage, the isolation becomes palpable, and every shadow seems to hold a hidden truth.",
        "In the fading light of evening, the garden transforms into a realm of mystery. The last rays of sunlight dance upon the petals, while the chirping of crickets fills the air with an eerie soundtrack. As darkness descends, the gardens become a place of potential discovery, where clues may be hidden within the foliage, awaiting the curious and the brave. The isolation of this space amplifies the tension, as the walls close in and the secrets of the manor beckon."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Private room for contemplation and decision-making",
      "visualDetails": "A small yet richly appointed space filled with books and personal effects, dominated by a large oak desk.",
      "sensoryDetails": {
        "sights": [
          "dark wooden paneling",
          "family photographs on the desk",
          "a globe in the corner"
        ],
        "sounds": [
          "the scratching of a pen on paper",
          "the rustle of a newspaper"
        ],
        "smells": [
          "the scent of polished wood",
          "fresh ink"
        ],
        "tactile": [
          "smooth surface of the desk",
          "soft leather chair",
          "coolness of a windowpane"
        ]
      },
      "accessControl": "Strictly off-limits to all but the family; locked during gatherings.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through rain-soaked glass",
            "dark outlines of furniture"
          ],
          "sounds": [
            "the steady patter of rain",
            "the soft thud of a book being closed"
          ],
          "smells": [
            "the fresh scent of rain",
            "the aroma of coffee brewing"
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows pooling in the corners",
            "light struggling to penetrate the gloom"
          ],
          "sounds": [
            "the distant sound of thunder",
            "pages turning slowly"
          ],
          "smells": [
            "the scent of damp paper",
            "the mustiness of old books"
          ],
          "mood": "introspective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of a desk lamp",
            "the reflection of light on polished wood"
          ],
          "sounds": [
            "the soft ticking of a clock",
            "the rustle of papers being sorted"
          ],
          "smells": [
            "the rich aroma of cigars",
            "the scent of leather"
          ],
          "mood": "tense focus"
        }
      ],
      "paragraphs": [
        "The study is a sanctuary of thought, filled with the weight of decisions yet to be made. Dark wooden paneling surrounds the space, creating an intimate atmosphere, while the large oak desk holds family photographs and a clutter of papers, each item telling a story of its own. The scent of polished wood and fresh ink fills the air, mingling with the electric tension that seems to permeate the room. Here, the occupant can reflect on the events unfolding beyond the confines of these walls.",
        "As the day progresses and the light dims, the study takes on a more somber tone. Shadows deepen in the corners, and the distant rumble of thunder serves as a reminder of the brewing storm outside. This room, though a place of refuge, becomes a crucible for the mind, where thoughts twist and turn, seeking clarity amidst the chaos of emotions. It is here that the true nature of guilt and suspicion may be laid bare."
      ]
    }
  ],
  "note": "",
  "cost": 0.0022559674499999997,
  "durationMs": 25211
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1937,
    "month": "May",
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "overcast with occasional rain",
      "cool breezes",
      "high humidity creating a damp atmosphere"
    ],
    "daylight": "Days are lengthening, with twilight stretching into the evening by eight o'clock, but the sun is often obscured by heavy clouds.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as shadows lengthen and the house grows darker.",
    "holidays": [
      "May Day (May 1)"
    ],
    "seasonalActivities": [
      "spring gardening with blooms in full display",
      "outdoor picnics, albeit under umbrellas",
      "attending local fairs featuring artisan crafts"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suits in dark colors",
        "bowler hats",
        "white dress shirts with wide collars"
      ],
      "casual": [
        "tweed jackets",
        "knit vests",
        "flat caps"
      ],
      "accessories": [
        "gold pocket watches",
        "silk ties",
        "cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with fitted bodices",
        "lightweight silk gloves",
        "cloche hats adorned with flowers"
      ],
      "casual": [
        "cotton blouses with floral patterns",
        "A-line skirts",
        "cardigans"
      ],
      "accessories": [
        "pearl necklaces",
        "handbags made of leather",
        "fashionable scarves"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "rising popularity of tailored clothing",
      "emphasis on practicality in fashion"
    ],
    "socialExpectations": [
      "men are expected to maintain a stoic demeanor",
      "women are expected to display grace and decorum",
      "strict adherence to social etiquette among the upper class"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "growing tensions in Europe with the rise of fascism",
      "the abdication crisis in Spain contributing to political instability",
      "the ongoing effects of the Great Depression influencing economic policies"
    ],
    "politicalClimate": "An undercurrent of fear and uncertainty pervades Europe as nations grapple with the threat of totalitarian regimes.",
    "economicConditions": "Despite signs of recovery, the lingering effects of the Great Depression are felt especially among the working class, causing increased class tensions.",
    "socialIssues": [
      "class disparity highlighted by wealth concentration",
      "debate over labor rights intensifying",
      "concerns about rising nationalism and fascism"
    ],
    "internationalNews": [
      "Germany's military rearmament",
      "the Spanish Civil War continuing to draw international attention",
      "diplomatic tensions between Britain and Italy over Mediterranean policies"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Benny Goodman and his big band sound",
        "the romantic ballads of Bing Crosby",
        "jazz music gaining popularity in urban centers"
      ],
      "films": [
        "‘A Star is Born’",
        "‘The Great Ziegfeld’",
        "‘The Life of Emile Zola’"
      ],
      "theater": [
        "‘The Barretts of Wimpole Street’",
        "‘The Royal Family’",
        "‘Pygmalion’"
      ],
      "radio": [
        "‘The Shadow’",
        "‘Amos 'n' Andy’",
        "news broadcasts covering world events"
      ]
    },
    "literature": {
      "recentPublications": [
        "‘Of Mice and Men’ by John Steinbeck",
        "‘Brave New World’ by Aldous Huxley",
        "‘Their Eyes Were Watching God’ by Zora Neale Hurston"
      ],
      "popularGenres": [
        "social realism",
        "mystery and detective stories",
        "political commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "the automatic washing machine",
        "the first commercial television broadcasts",
        "advancements in radio technology"
      ],
      "commonDevices": [
        "telephones in most households",
        "typewriters in offices",
        "electric lighting becoming standard"
      ],
      "emergingTrends": [
        "the rise of personal radios in homes",
        "increasing use of electric appliances",
        "developments in early film technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "A pint of beer: eight pence"
      ],
      "commonActivities": [
        "attending garden parties",
        "playing croquet on lawn",
        "visiting local tea rooms"
      ],
      "socialRituals": [
        "afternoon tea served promptly at four o'clock",
        "formal dinner parties with multiple courses",
        "weekly church services followed by social gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a rigid class structure remains dominant",
      "wealth is both respected and resented",
      "social mobility is viewed with skepticism"
    ],
    "gender": [
      "women are encouraged to be homemakers",
      "men are expected to be the financial providers",
      "emerging discussions about women's rights begin to stir"
    ],
    "race": [
      "racial tensions simmer under the surface",
      "minority groups face discrimination",
      "increased awareness of racial injustices is slowly gaining traction"
    ],
    "generalNorms": [
      "courtesy and politeness are highly valued",
      "public displays of emotion are frowned upon",
      "expectations of privacy in personal affairs are strong"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and blooming flowers hangs in the air, mingling with the musty aroma of the old manor.",
    "The soft patter of rain against the windows creates a rhythmic backdrop, heightening the tension within the house.",
    "The flickering of candlelight casts long shadows across the richly adorned walls, accentuating the sense of foreboding that lingers in the silence."
  ],
  "paragraphs": [
    "In May 1937, the manor house stands cloaked in an overcast sky, an oppressive blanket of gray that seems to seep into the very walls. Occasional rain showers contribute to a damp chill that permeates the air, compelling the inhabitants to huddle close to the flickering lights of oil lamps. The lengthening daylight offers a false sense of warmth, with twilight stretching into the evening, but the gloominess outside reflects the unease of the world beyond the estate's gates, where political tensions brew and social unrest is palpable.",
    "Fashion during this period embodies a blend of elegance and practicality. Men wear tailored three-piece suits, their crisp white shirts carefully pressed, while women don tea-length dresses that hug the waist and flounce at the hem, paired with cloche hats adorned with fresh blooms. Accessories are key; men sport gold pocket watches and silk ties, while women adorn themselves with pearl necklaces and leather handbags, all reflecting the social expectations of decorum and restraint that define their class.",
    "Daily life inside the manor is dictated by strict social rituals, from the prompt serving of afternoon tea at four o'clock to the lavish dinner parties that unfold as the sun sets. Prices for everyday goods remain modest, yet the shadow of the Great Depression lingers, reminding the household staff of their precarious positions. As they navigate the tension of class disparity, the air is thick with whispers of dissatisfaction, both within the manor's walls and the world outside, where the specter of fascism stirs unrest."
  ],
  "note": "",
  "cost": 0.0010735626,
  "durationMs": 10942
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the Voss estate for a tense family meeting amidst the Great Depression strains loyalties while the threat of fascism looms, binding the cast in a web of social obligation and hidden agendas.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class divisions and tensions within the aristocracy, as economic hardship forces the privileged to confront their declining status and the rising political unrest."
  },
  "setting": {
    "location": "Voss Manor",
    "institution": "Manor house",
    "weather": "Overcast with occasional rain"
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
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock was deliberately wound back to mislead witnesses about the murder's timing.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This reveals how the timing of the murder was manipulated.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "A note near the clock indicates a specific time, contradicting witness statements.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This shows that the witnesses may not be telling the truth.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the library during the murder time.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This narrows the suspects down to Dr. Mallory Finch and Beatrice Quill.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows the hands misaligned from the clock face.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This indicates that something was wrong with the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Dr. Mallory's alibi is that he was with Eleanor, but he was seen leaving the study at eight fifteen.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This raises questions about the validity of his alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "This time discrepancy indicates his alibi cannot hold.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This further complicates Dr. Mallory's defense.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "behavioral",
      "description": "Dr. Mallory Finch has been acting nervously since the murder.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "This behavior suggests he might be hiding something.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was at the dinner party during the murder time.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This confirms she could not have committed the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_6",
      "category": "physical",
      "description": "Fingerprints on the clock mechanism match Dr. Mallory Finch.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "This links him directly to the tampering of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "physical",
      "description": "Chemical residue from tampering was found on the clock.",
      "sourceInCML": "CASE.constraint_space.physical.traces[1]",
      "pointsTo": "This indicates that the clock was manipulated.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "The note suggests the murder was planned to appear at a different time.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This indicates premeditated actions.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "Recreating the timeline with the clock's tampering evidence shows inconsistencies.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This is critical for understanding the timing of events.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "behavioral",
      "description": "Dr. Mallory Finch has a motive of revenge for a ruined career.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "This indicates he had a reason to commit the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "testimonial",
      "description": "Witnesses claim they heard a loud argument before the murder.",
      "sourceInCML": "CASE.constraint_space.access.permissions[0]",
      "pointsTo": "This suggests a motive related to personal conflict.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "testimonial",
      "description": "Eleanor Voss states she was in the library during the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This provides her with an alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "eight o'clock in the evening remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "category": "temporal",
      "description": "The clock in the study shows the hands misaligned from the clock face.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This indicates tampering occurred before the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Captain Ivor Hale had a recent argument with the victim over business matters.",
      "supportsAssumption": "The murder's motive must be tied to the victim's recent actions and relationships.",
      "misdirection": "This suggests a personal motive that may not be related to the actual events."
    },
    {
      "id": "rh_2",
      "description": "Beatrice Quill was seen leaving the victim's office shortly before the murder.",
      "supportsAssumption": "The murder's motive must be tied to the victim's recent actions and relationships.",
      "misdirection": "This creates suspicion but does not connect to the actual timeline of the murder."
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
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_1",
      "clue_8",
      "clue_fp_contradiction_step_1"
    ],
    "mid": [
      "clue_core_elimination_chain",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_9",
      "clue_10",
      "clue_11",
      "clue_12",
      "clue_culprit_direct_dr_mallory_finch"
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
  "latencyMs": 14831,
  "cost": 0.00161229915
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
