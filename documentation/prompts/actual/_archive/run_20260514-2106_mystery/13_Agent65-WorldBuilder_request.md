# Actual Prompt Record

- Run ID: `mystery-1778792768943`
- Project ID: ``
- Timestamp: `2026-05-14T21:09:08.581Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `2958616cbc435df0`

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
    "title": "The Timed Deceit",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton, Yorkshire",
      "place": "Manor House",
      "country": "England",
      "institution": "Manor house"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "public_persona": "Socialite and keen observer",
      "private_secret": "Struggles with her past",
      "motive_seed": "A quest for justice",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "library",
        "study"
      ],
      "behavioral_tells": [
        "observant",
        "inquisitive"
      ],
      "stakes": "proving her investigative skills",
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
      "role_archetype": "medical expert",
      "relationships": [
        "Eleanor Voss",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Has a hidden financial motive",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "kitchen",
        "study"
      ],
      "behavioral_tells": [
        "nervous under pressure",
        "knowledgeable about poisons"
      ],
      "stakes": "his career and reputation",
      "evidence_sensitivity": [
        "moderate"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "military officer",
      "relationships": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Beatrice Quill"
      ],
      "public_persona": "Charming and brave",
      "private_secret": "In debt due to gambling",
      "motive_seed": "Desperation for money",
      "motive_strength": "moderate",
      "alibi_window": "9:30 PM to 10:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "entrance hall",
        "library"
      ],
      "behavioral_tells": [
        "overly confident",
        "defensive about finances"
      ],
      "stakes": "his financial security",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "housemaid",
      "relationships": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "public_persona": "Helpful and loyal servant",
      "private_secret": "Knows more than she lets on",
      "motive_seed": "Protecting her own position",
      "motive_strength": "weak",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "servants' quarters",
        "kitchen"
      ],
      "behavioral_tells": [
        "observant",
        "cautious"
      ],
      "stakes": "her livelihood",
      "evidence_sensitivity": [
        "low"
      ],
      "culprit_eligibility": "ineligible",
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
      "summary": "During a stormy evening at a grand Yorkshire manor, a wealthy patron is found dead in the library, and all eyes turn to the guests whose lives are intertwined with secrets and debts. Detective Eleanor Voss must unravel the truth behind the mechanical tampering of a clock that misleads the suspects about the time of death."
    },
    "accepted_facts": [
      "The victim was found dead in the library.",
      "The clock in the library shows time that contradicts witness statements.",
      "All guests were present at the manor during the incident."
    ],
    "inferred_conclusions": [
      "The time of death is misrepresented by the clock.",
      "The murderer manipulated the clock to create an alibi.",
      "The motive lies in financial desperation."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, library, and crack to expose the false timing.",
      "delivery_path": [
        {
          "step": "The murderer wound the clock back to create a false time of death."
        },
        {
          "step": "The tampering went unnoticed due to the clock's appearance."
        }
      ]
    },
    "outcome": {
      "result": "The murderer escapes suspicion until the truth is revealed."
    }
  },
  "false_assumption": {
    "statement": "The victim was alive at the time indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appears to function correctly and witnesses claim the victim was seen alive shortly before the time of death.",
    "what_it_hides": "The clock was actually tampered with, misrepresenting the true time of death."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "9:45 PM",
        "10:05 PM"
      ],
      "windows": [
        "9:30 PM to 10:30 PM"
      ],
      "contradictions": [
        "Clock shows 10:05 PM while witness saw victim at 9:45 PM"
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "the clock",
        "the winding key"
      ],
      "permissions": [
        "free access to the library"
      ]
    },
    "physical": {
      "laws": [
        "The clock's mechanism must be functional for it to keep accurate time."
      ],
      "traces": [
        "Fingerprints on the clock face",
        "Dust on the winding key"
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor Voss' investigative authority"
      ],
      "authority_sources": [
        "Dr. Mallory Finch's expert testimony"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the library is cracked and shows the time as ten minutes past ten.",
        "correction": "The clock's appearance suggests it had been tampered with, indicating potential foul play.",
        "effect": "This narrows the investigation to those who had access to the library.",
        "required_evidence": [
          "The clock's glass is slightly cracked.",
          "Witness statements about the time of death."
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint smudge on the clock face indicates it was recently handled.",
        "correction": "The smudge suggests someone tampered with the clock shortly before the murder.",
        "effect": "This eliminates Beatrice Quill, who was observed in the kitchen at that time.",
        "required_evidence": [
          "The smudge on the clock face.",
          "Beatrice Quill's alibi from the kitchen."
        ],
        "reader_observable": true
      },
      {
        "observation": "A half-open drawer contains a key that fits the clock mechanism.",
        "correction": "The presence of the key suggests that someone intentionally wound back the clock.",
        "effect": "This implicates Captain Ivor Hale, as he had the opportunity to access the library and tamper with the clock.",
        "required_evidence": [
          "The winding key found in the drawer.",
          "Captain Ivor Hale's access to the library."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A staged confrontation where Captain Hale is asked to explain the tampering of the clock using the key found.",
    "knowledge_revealed": "The key fits the clock and it was used to wind it back.",
    "pass_condition": "Captain Ivor Hale must explain the smudge and the timing discrepancy.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_6",
      "clue_5"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The cracked clock and witness statements (early) indicate tampering. Step 2: The smudge on the clock face and Beatrice's alibi (mid) eliminate her. Step 3: The key in the drawer implicates Ivor Hale (late), leading to the confrontation."
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
        "clearance_method": "Proving her alibi in the kitchen.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 9:00 PM to 10:00 PM",
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Key discovery"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_9",
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
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a devoted governess who has long harbored unrequited love for Captain Hale, complicating her role in a household rife with tension and secrets.",
    "publicPersona": "Eleanor presents herself as a diligent caretaker, always ready to attend to the needs of the household with a quiet grace and a steady hand. Her reputation as a respected member of the staff is well-earned; she is the sort of person to whom parents entrust their children without a second thought.",
    "privateSecret": "Beneath her composed exterior, Eleanor has been secretly in love with Captain Hale for years, a feeling that has only intensified since his engagement to Beatrice Quill. This unacknowledged affection is a source of both warmth and heartache for her.",
    "motiveSeed": "Eleanor feels abandoned and betrayed by Hale's engagement, which ignites a fierce desire to expose the truth behind the murder, hoping it will win back his affections.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims she was in the library from eight to nine studying for a teaching exam, a plausible cover that could be verified by a few stray book titles.",
    "accessPlausibility": "easy",
    "stakes": "The stakes for Eleanor are not merely professional; she desires to unmask the truth, not only to vindicate herself but to reclaim Hale's heart, a pursuit that weighs heavily on her conscience.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks in a measured, articulate manner, often punctuating her sentences with a thoughtful pause. She tends to use literary references, a nod to her scholarly pursuits, and occasionally lightens the mood with a sharp, observational comment that reveals her keen insight into the human heart.",
    "internalConflict": "Eleanor grapples with her feelings of inadequacy and jealousy, as well as the moral dilemma of whether to pursue her love for Hale at the expense of her integrity. She is torn between her duty to the household and her longing for a life where she is valued as more than just a governess.",
    "personalStakeInCase": "This crime matters deeply to Eleanor, as it intertwines with her unrequited love for Hale and her desire to establish her worth beyond her role in the household.",
    "paragraphs": [
      "In the dim light of the library, Eleanor Voss sat with a stack of dusty books, her fingers tracing the spines absentmindedly. The quiet of the room felt pervasive, yet her mind was anything but still. As she prepared for her teaching exam, her thoughts drifted to Captain Hale, whose charm had woven itself into her very being. Each laugh he shared with Beatrice Quill was like a dagger to her heart, a reminder of the affection she could never voice.",
      "Eleanor's public persona was that of a diligent governess, respected and dutiful. She found comfort in her routine, yet beneath that composed surface lay a tempest of emotions. She had watched Hale from afar, his laughter resonating in her mind long after he had departed. The household staff often remarked on her quiet devotion, but they had no inkling of the depth of her feelings nor the turbulent thoughts that accompanied them.",
      "With the murder casting a long shadow over Little Middleton, Eleanor felt compelled to act. The truth, she believed, was a path to Hale's heart, and she could not allow the veil of deceit to remain. The prospect of uncovering the murderer thrilled her, but it was the hope of reclaiming Hale's affection that propelled her forward. She was determined to expose the truth, even if it meant navigating the treacherous waters of love and betrayal.",
      "As she pieced together the clues, Eleanor's internal conflict deepened. Was she willing to risk everything for a man who was engaged to another? Yet, the thought of remaining silent while the truth languished was unbearable. Each day brought her closer to a decision, one that would force her to confront not only the murderer but her own heart. In doing so, Eleanor Voss would discover her own voice—a voice that had long been stifled by duty and unrequited love."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a local physician whose public reputation as a charitable doctor masks a troubling financial desperation, leading him to make unethical choices.",
    "publicPersona": "With a warm smile and a reassuring manner, Dr. Finch is known throughout Little Middleton for his dedication to the community. His charitable work has earned him the trust and admiration of many, making him a pillar of local society.",
    "privateSecret": "However, beneath this façade lies a man in financial distress, grappling with mounting debts from the Great Depression. To keep up appearances, he has resorted to accepting unapproved payments, a choice that weighs heavily on his conscience.",
    "motiveSeed": "His financial desperation has bred a quiet resentment towards the victim, who had funded a rival medical practice, leaving Finch feeling threatened and envious.",
    "motiveStrength": "weak",
    "alibiWindow": "Dr. Finch claims he was treating a patient during the time of the murder, but the patient is unreliable, leaving a shadow of doubt over his alibi.",
    "accessPlausibility": "possible",
    "stakes": "For Finch, the stakes are high; he must keep his financial troubles hidden to maintain his standing in the community, a precarious balance that could shatter with a single misstep.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Dr. Finch speaks with a gentle cadence, often punctuating his sentences with self-deprecating remarks about his own shortcomings. He has a tendency to chuckle softly at his own expense, using humour to diffuse the tension that often accompanies his financial struggles.",
    "internalConflict": "Dr. Finch is torn between his ethical obligations as a physician and the desperation of his financial situation. He wrestles with guilt over his choices, fearing that his actions could lead to professional ruin and loss of respect.",
    "personalStakeInCase": "The murder investigation hits close to home for Finch, as he fears that unearthing the truth could expose his financial misdeeds, jeopardizing his career and reputation.",
    "paragraphs": [
      "Dr. Mallory Finch often found solace in the familiar surroundings of his clinic, the scent of antiseptic mingling with the faint aroma of lavender from the garden outside. He had built a life here, a life rooted in service and care, yet as the Great Depression tightened its grip on Little Middleton, that life began to fray at the edges. Each patient he treated brought with them a reminder of his financial woes, a burden he bore in silence.",
      "In public, he was a beacon of hope, but in private, Finch wrestled with the gnawing fear of failure. He often joked about his inability to make ends meet, a self-deprecating defence against the judgment he felt from those around him. 'One must have a sense of humour about these things,' he would say, a forced chuckle escaping his lips as he concealed the truth behind his laughter.",
      "As the murder investigation unfolded, Finch found himself ensnared in a web of anxiety. The victim, a man whose success had always loomed over him, was now a source of bitter resentment. The thought that his financial desperation could be revealed was terrifying, and he felt a growing urge to protect himself at all costs, even if it meant compromising his integrity.",
      "With each passing day, the stakes grew higher. Finch's internal conflict deepened as he grappled with the knowledge that the truth could unravel everything he had worked for. The pressure was mounting, and he could feel the walls closing in around him. Would he be able to confront his moral compromises, or would his secrets consume him whole, leaving nothing but the ghost of a once-respected doctor?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a charming army officer caught in a love triangle, striving to balance societal expectations with his true affections.",
    "publicPersona": "Ivor Hale is the embodiment of charm and charisma, a figure admired by many in high society. His dashing presence and effortless grace make him the center of attention at every gathering.",
    "privateSecret": "Despite his engagement to Beatrice Quill, Hale harbors feelings for Eleanor Voss, creating a tumultuous inner conflict that threatens to upend his carefully curated life.",
    "motiveSeed": "Caught in the midst of a love triangle, Hale faces the risk of public scandal that could tarnish his reputation and strain his personal relationships.",
    "motiveStrength": "moderate",
    "alibiWindow": "Hale claims to have been in the garden from eight-thirty to nine, but with no witnesses to corroborate his story, doubts linger.",
    "accessPlausibility": "unlikely",
    "stakes": "For Hale, the stakes are profoundly personal; he must navigate the treacherous waters of love and loyalty while safeguarding his reputation from the fallout of a scandal.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Hale speaks with a confident flair, often employing a sardonic wit that disarms those around him. He has a tendency to punctuate his remarks with a knowing smile, a telltale sign of his playful nature, and he is adept at turning a serious conversation into light banter.",
    "internalConflict": "Hale grapples with the tension between societal expectations and his genuine feelings for Eleanor. Torn between duty and desire, he fears that following his heart could lead to ruin.",
    "personalStakeInCase": "The murder investigation holds particular significance for Hale, as it not only threatens his reputation but also forces him to confront the true nature of his feelings for Eleanor and the consequences of his choices.",
    "paragraphs": [
      "Captain Ivor Hale stood in the garden, the moonlight casting a silver glow on his sharp features. He was a man who thrived on attention, yet tonight, he felt the weight of the world pressing down on him. His engagement to Beatrice Quill should have been a source of joy; instead, it felt like a gilded cage, one that kept him from pursuing the heart he truly desired—Eleanor Voss.",
      "With every interaction at social events, Hale donned his charming mask, performing the role expected of him with grace. 'One mustn't let personal feelings interfere with duty,' he often quipped, a sardonic smile playing on his lips. But beneath the surface, the truth was a different matter entirely; it roiled within him like a tempest, threatening to break free.",
      "As the murder investigation began to unfold, Hale found himself in a precarious position. The whispers of scandal floated through the air like the scent of roses in bloom, and he felt the noose of societal expectation tighten around his throat. The very thought of losing his carefully cultivated reputation was enough to send shivers down his spine; yet, the prospect of remaining silent in the face of injustice gnawed at his conscience.",
      "Caught between love and loyalty, Hale faced an internal reckoning. The stakes had never been higher; he could either protect his name or embrace the truth of his affections for Eleanor. As he navigated the treacherous waters of love and obligation, Captain Ivor Hale stood on the precipice of a choice that would define him, one that would either bind him to his past or free him to pursue a future of his own making."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a poised socialite who, beneath her charming exterior, grapples with insecurities and fears of losing her fiancé to another.",
    "publicPersona": "Beatrice is the epitome of a wealthy heiress, known for her poise and charm at social gatherings. Her beauty and grace have made her a darling of high society, and she carries herself with an air of confidence that captivates those around her.",
    "privateSecret": "However, Beatrice harbors deep insecurities about her relationship with Captain Hale, sensing his affections for Eleanor Voss and fearing that her engagement is precarious.",
    "motiveSeed": "Her jealousy and desperation to secure her place in Hale's life drive her to consider drastic measures, as the thought of losing him to Eleanor is unbearable.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice claims to have been at a dinner party across town, but the timeline of the event is unclear, leaving room for doubt.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are high; she desires to maintain her engagement and secure her standing in society, fearing that the truth could unravel her carefully constructed world.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks with an elegant cadence, often employing a playful yet pointed wit. She has a knack for delivering compliments that carry a sharp edge, and her laughter often dances between genuine amusement and veiled criticism.",
    "internalConflict": "Beatrice struggles with her feelings of inadequacy and jealousy, caught between her desire for love and the fear of being overshadowed by Eleanor. This internal struggle fuels her actions as she navigates the complexities of her relationships.",
    "personalStakeInCase": "The murder investigation directly impacts Beatrice, as it threatens not only her engagement to Hale but also her status in the social hierarchy, forcing her to confront her own insecurities.",
    "paragraphs": [
      "Beatrice Quill glided through the opulent ballroom, her presence commanding attention as she moved with grace and confidence. To the outside world, she was the picture of perfection, a wealthy heiress engaged to the charming Captain Hale. Yet, beneath the surface, a tempest brewed within her, fueled by the nagging insecurities that haunted her every social interaction.",
      "Her laughter rang like music, yet each note carried the weight of unspoken fears. Beatrice often employed polite savagery in her conversations, delivering compliments that sparkled like diamonds but cut deeper than any blade. 'Oh, Eleanor, your dress is simply divine,' she would say, her smile widening. 'It must be difficult to find something so lovely in the back of the wardrobe.'",
      "As the murder investigation unfolded, Beatrice's anxieties reached a fever pitch. The whispers of danger and betrayal echoed through her mind, and the thought of losing Hale to Eleanor was a nightmare she could hardly bear. Her engagement felt like a fragile thread, one that could snap at any moment, and she was determined to do whatever it took to secure her place beside him.",
      "Caught in a web of jealousy and desperation, Beatrice faced an internal conflict that threatened to unravel her carefully constructed identity. The stakes had never been higher; the truth could expose her vulnerabilities and shatter her dreams. As she navigated the complexities of love and loyalty, Beatrice Quill stood at a crossroads, where every choice could lead her closer to the life she desired or plunge her into chaos."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Middleton Manor",
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Middleton Manor is a sprawling estate steeped in tradition and secrets, where the past lingers in the shadows of its grand halls.",
    "visualDescription": "The manor boasts a magnificent façade of weathered stone, framed by ivy-clad turrets and expansive gabled roofs. Inside, the entrance hall is adorned with a sweeping staircase and opulent chandeliers that cast flickering reflections on polished oak floors.",
    "atmosphere": "An air of mystery envelops the manor, with whispers of class tension and hidden truths echoing through its corridors.",
    "paragraphs": [
      "The imposing structure of Middleton Manor looms against the overcast sky, its weathered stones telling tales of generations past. Inside, the grand entrance hall features a sweeping staircase that spirals into shadow, guiding visitors into a world where elegance meets enigma. Gaslight sconces flicker against the dark oak paneling, casting ghostly shapes that dance along the walls, while the faint sound of rain pattering against the leaded glass windows heightens the sense of foreboding. The scent of polished wood and distant smoke from the fireplace intertwines with the dampness of the air, creating an atmosphere thick with unspoken secrets.",
      "As guests move through the multiple parlors, they find themselves enveloped in rich fabrics and antique furnishings, each piece a testament to the family's storied past. The library, a sanctuary of knowledge and whispers, is lined with towering shelves filled with leather-bound tomes, some dust-covered and forgotten. Here, the air is heavy with the scent of aged paper and the faint trace of tobacco smoke, remnants of late-night discussions that have long since faded into memory. The dim light from the electric sconces creates a cozy yet ominous ambiance, as if the very walls are eavesdropping on the secrets shared within.",
      "Outside, manicured gardens stretch out like a carefully curated painting, their vibrant colors muted by the gray sky. The sound of rustling leaves and the distant call of a solitary bird punctuate the stillness, while the scent of damp earth and blooming roses mingles in the air. However, the gardens hold their own mysteries, with hidden corners and overgrown paths that suggest more than mere beauty. The isolation of the estate, several miles from the nearest town, further deepens the sense of entrapment, as the looming trees seem to guard the secrets of those who dare to tread upon their grounds.",
      "As evening descends upon Middleton Manor, the atmosphere grows thick with tension. The flickering candlelight casts long, wavering shadows that seem to whisper of deceit and betrayal. In the drawing room, the ticking of an ornate clock punctuates the silence, each tick resonating with the weight of unspoken words. The smell of burning wax and the lingering scent of a recent fireplace fire create an air of intimacy, yet the palpable unease hints at the storm brewing beneath the manor’s polished surface. Here, amidst the grandeur, the truth is but a heartbeat away, cloaked in deception and class tensions that threaten to unravel."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical for the season",
    "timeFlow": "Three days of mounting tension as secrets unravel and motives are questioned",
    "mood": "Tense and foreboding, reflecting underlying class tensions and personal secrets",
    "eraMarkers": [
      "Domestic electric lighting illuminating the grand halls",
      "Early telephones connecting distant family members",
      "Typewriters clattering in the study as correspondence is crafted"
    ],
    "sensoryPalette": {
      "dominant": "The pervasive scent of damp wood and tobacco smoke fills the air, hinting at secrets long hidden.",
      "secondary": [
        "The sound of rain pattering against the windows, creating a rhythmic backdrop of unease.",
        "The flickering light of gas sconces casting shifting shadows that play tricks on the mind."
      ]
    },
    "paragraphs": [
      "The manor's ambiance is thick with the weight of history, each corner echoing with the whispers of its past. The overcast weather adds to the sense of confinement, as if the skies themselves conspire to keep the secrets within. Every creak of the floorboards and distant sound of thunder becomes a reminder that something is amiss, creating an atmosphere where trust is a fragile illusion.",
      "As guests navigate the corridors, they are enveloped in a sensory tapestry of rich textures and muted colors. The scent of polished wood mixes with the dampness of the air, while the soft rustle of silk curtains adds a delicate touch to the heavy atmosphere. In this world of contrasts, the luxurious decor stands in stark opposition to the underlying tension that simmers just below the surface, making every interaction fraught with potential betrayal."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_entrance_hall",
      "name": "Grand Entrance Hall",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The grand entrance hall features a sweeping staircase that spirals upward, flanked by dark oak paneling and adorned with opulent chandeliers that cast a warm glow over the polished floors.",
      "sensoryDetails": {
        "sights": [
          "The ornate plasterwork on the ceiling is intricately detailed, showcasing the craftsmanship of a bygone era.",
          "Heavy velvet drapes frame the tall windows, their deep burgundy hue contrasting with the pale stone walls."
        ],
        "sounds": [
          "The echo of footsteps reverberates against the high ceilings, creating an almost ghostly ambiance.",
          "Occasional whispers of the staff can be heard as they move about, their hushed tones blending into the atmosphere."
        ],
        "smells": [
          "The faint scent of beeswax polish lingers in the air, mingling with the mustiness of the old wood.",
          "Distant hints of smoke from the fireplace provide a comforting yet melancholic backdrop."
        ],
        "tactile": [
          "The coolness of the marble floor contrasts sharply with the warmth of the woodwork, creating a sensory dichotomy.",
          "The heavy drapes feel thick and luxurious against the skin, a reminder of the wealth that permeates the manor."
        ]
      },
      "accessControl": "Accessible to all guests upon arrival, but restricted to family and staff during private events.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain streaks the tall windows, distorting the view of the gardens beyond.",
            "Puddles form on the marble floor, reflecting the muted light from the chandeliers."
          ],
          "sounds": [
            "The steady drumming of rain on the roof creates a rhythmic backdrop to the morning's activities.",
            "Occasional thunder rumbles in the distance, adding a sense of urgency to the atmosphere."
          ],
          "smells": [
            "The scent of damp earth wafts in from the open doors, mingling with the mustiness of the old wood.",
            "Hints of mildew cling to the corners, a reminder of the manor's age."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light filters through the windows, casting a somber hue across the room.",
            "Shadows stretch across the floor, creating a sense of foreboding."
          ],
          "sounds": [
            "The silence is broken only by the distant ticking of a clock, each tick echoing like a heartbeat.",
            "The creak of the staircase adds to the sense of isolation, as if the house itself is alive."
          ],
          "smells": [
            "The scent of wax from the candles lingers in the air, mixing with the dust that has settled on the furniture.",
            "A whiff of burnt wood from the fireplace adds a layer of warmth to the otherwise cool atmosphere."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the walls, casting dancing shadows that seem to whisper secrets.",
            "The last rays of sunlight filter through the windows, creating a warm glow in the otherwise cool room."
          ],
          "sounds": [
            "The tick of a mantel clock punctuates the silence, each tick echoing in the stillness.",
            "The distant sound of laughter and conversation from the drawing room hints at the evening's gathering."
          ],
          "smells": [
            "The smell of candle wax and fresh flowers fills the air, creating an inviting atmosphere.",
            "Hints of tobacco smoke linger in the corners, a reminder of the evening's earlier discussions."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Entrance Hall serves as the heart of Middleton Manor, a space where guests are greeted and farewelled, yet also where secrets are exchanged in hushed tones. The soaring ceilings and grand staircase create a sense of openness, yet the shadows that cling to the corners hint at the hidden tensions that reside within the walls. As guests gather, the air thickens with the mingling scents of polished wood and the faintest trace of smoke, creating an ambiance that is both welcoming and unsettling.",
        "During the evening, the hall transforms into a stage for intrigue, where the flickering candlelight reveals glimpses of hidden motives. The clock's relentless ticking serves as a reminder that time is not on anyone's side, and the shadows seem to stretch longer, as if to conceal the truths that are just out of reach. Here, amidst the grandeur, the tension is palpable, each moment thick with the weight of unspoken words and the threat of revelations that could shatter the carefully maintained facade."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is a majestic room filled with towering bookshelves that touch the ceiling, each shelf crammed with leather-bound volumes and the scent of aged paper wafting through the air.",
      "sensoryDetails": {
        "sights": [
          "Rich mahogany furniture contrasts with the deep green wallpaper, creating an atmosphere of scholarly elegance.",
          "A large globe sits in one corner, its surface worn from years of curious hands tracing the paths of explorers."
        ],
        "sounds": [
          "The soft rustle of pages turning is a gentle reminder of the knowledge contained within these walls.",
          "Occasionally, the creak of the floorboards punctuates the silence, as if the books themselves are whispering secrets."
        ],
        "smells": [
          "The musty scent of old books fills the air, a comforting yet slightly oppressive reminder of time's passage.",
          "Hints of tobacco linger, remnants of discussions held in the flickering light of the hearth."
        ],
        "tactile": [
          "The smooth leather of the books feels cool to the touch, while the wooden shelves provide a sense of solidity and permanence.",
          "The warmth of the fireplace creates a cozy nook, inviting one to sink into a plush armchair and lose oneself in a world of words."
        ]
      },
      "accessControl": "Access is restricted to family members and select guests; staff are not permitted without prior approval.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the tall windows, distorting the view of the garden outside.",
            "The soft glow of early morning light filters through, casting a muted warmth over the room."
          ],
          "sounds": [
            "The steady patter of rain creates a rhythmic backdrop, mingling with the quiet rustle of turning pages.",
            "Occasional thunder rumbles softly in the distance, echoing the tension that hangs in the air."
          ],
          "smells": [
            "The scent of damp earth wafts in through the open windows, mingling with the mustiness of the books.",
            "Hints of mildew cling to the corners, a reminder of the manor's age and the secrets it holds."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is bathed in a soft, diffused light that creates an intimate yet somber atmosphere.",
            "Shadows stretch across the floor, hinting at the weight of unspoken truths lingering in the air."
          ],
          "sounds": [
            "The silence is punctuated by the occasional flutter of a bird outside, an intrusion on the otherwise still air.",
            "The distant ticking of a clock serves as a reminder of the passing time, echoing like a heartbeat."
          ],
          "smells": [
            "The scent of aged paper and leather mingles in the air, creating a heady atmosphere of knowledge.",
            "A faint whiff of smoke from the fireplace adds a layer of warmth to the otherwise cool room."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the spines of the books, casting dancing shadows along the walls.",
            "The last rays of sunlight filter through the windows, illuminating the dust motes that float lazily in the air."
          ],
          "sounds": [
            "The crackling of the fire adds a comforting warmth to the atmosphere, while the soft murmur of voices from the drawing room drifts in.",
            "The gentle turning of pages creates a soothing rhythm, a counterpoint to the excitement of the gathering."
          ],
          "smells": [
            "The aroma of burning wood fills the air, mingling with the scent of old books and leather.",
            "Hints of lavender from a nearby vase add a touch of freshness to the otherwise heavy atmosphere."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library is a treasure trove of knowledge and intrigue, where the scent of aged paper and leather creates an inviting yet somber atmosphere. Towering bookshelves, filled with volumes that have witnessed the passage of time, stand sentinel over whispered conversations and hidden truths. Here, the soft rustle of pages turning is accompanied by the creaking of floorboards, creating a symphony of secrets that reverberate through the air. Each book is a vessel of history, holding within it the potential for both discovery and deception.",
        "As evening falls, the library transforms into a sanctuary of tension, illuminated by the flickering light of candles. The shadows dance along the walls, creating an ambiance ripe for revelation. The distant sounds of laughter and conversation from the drawing room serve as a reminder of the world outside, while the warmth of the fireplace beckons one to delve deeper into the mysteries that lie within the pages. Here, amidst the tomes and the lingering scent of tobacco, the truth waits patiently, cloaked in layers of intrigue."
      ]
    },
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Social gathering space",
      "visualDetails": "The drawing room is elegantly furnished with plush sofas and ornate armchairs, all arranged around a grand fireplace that serves as the room's focal point.",
      "sensoryDetails": {
        "sights": [
          "Rich tapestries hang on the walls, their intricate patterns telling stories of the past.",
          "A grand piano stands in one corner, its polished surface reflecting the soft glow of the room's ambient lighting."
        ],
        "sounds": [
          "The sound of laughter and conversation fills the air, creating an atmosphere of camaraderie and tension.",
          "The crackling of the fire provides a comforting backdrop, punctuating the lively discussions with warmth."
        ],
        "smells": [
          "The scent of fresh flowers from a nearby vase mingles with the warmth of burning wood, creating an inviting aroma.",
          "Hints of perfume linger in the air, remnants of the evening's guests and their hidden agendas."
        ],
        "tactile": [
          "The plush fabric of the sofas feels luxurious against the skin, inviting guests to sink in and relax.",
          "The warmth radiating from the fireplace creates a cocoon of comfort amidst the underlying tension."
        ]
      },
      "accessControl": "Open to all guests during social gatherings; family members and staff have access at all times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops slide down the windows, creating a blurred view of the gardens outside.",
            "The muted light casts a soft glow over the room, enhancing the rich colors of the furnishings."
          ],
          "sounds": [
            "The steady patter of rain against the roof creates a soothing background, blending with the occasional creak of the house settling.",
            "The laughter of guests is muffled, as if the rain has wrapped the room in a cocoon of intimacy."
          ],
          "smells": [
            "The aroma of freshly brewed coffee wafts through the air, mingling with the scent of damp earth from outside.",
            "Hints of lavender from the garden outside add a touch of freshness to the otherwise cozy atmosphere."
          ],
          "mood": "intimate"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is awash in a soft, diffused light that creates an intimate yet melancholic atmosphere.",
            "Shadows gather in the corners, hinting at the secrets that lurk just out of sight."
          ],
          "sounds": [
            "The murmur of conversation creates a low hum, occasionally punctuated by bursts of laughter.",
            "The crackling of the fire provides a comforting backdrop, a reminder of the warmth within the otherwise cool room."
          ],
          "smells": [
            "The scent of burning wood mingles with the aroma of fresh flowers, creating a comforting yet tense atmosphere.",
            "Hints of tobacco smoke cling to the air, remnants of earlier discussions that linger like ghosts."
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the walls, casting dancing shadows that create an air of mystery.",
            "The last rays of sunlight filter in, illuminating the rich colors of the room."
          ],
          "sounds": [
            "The gentle clinking of glasses and the murmur of conversation fill the air, creating a lively ambiance.",
            "The crackling fire adds a comforting warmth, inviting guests to share their stories."
          ],
          "smells": [
            "The scent of wine mingles with the aroma of burning logs, creating a rich tapestry of smells.",
            "Hints of perfume linger in the air, a reminder of the guests and the secrets they carry."
          ],
          "mood": "lively yet tense"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the heart of social interaction within Middleton Manor, a space where laughter and conversation intertwine with the undercurrents of tension. Plush sofas and ornate armchairs invite guests to relax, while the grand fireplace crackles with warmth, casting a soft glow over the elegant furnishings. Here, the scent of fresh flowers mingles with the lingering traces of perfume, creating an inviting atmosphere that belies the secrets lurking just beneath the surface. As guests gather, the room becomes a stage for intrigue, where every laugh may mask a hidden agenda.",
        "In the evening, the drawing room transforms into a vibrant hub of activity, where the flickering candlelight dances along the walls, creating an ambiance ripe for revelations. The sound of clinking glasses and the murmur of conversation fill the air, while the warmth from the fire wraps around the guests like a comforting embrace. Yet, amidst the gaiety, the tension remains palpable, as unspoken truths hover in the air, waiting for the right moment to be unveiled. This is a space where every interaction is charged with possibility, and the air is thick with the promise of secrets waiting to be discovered."
      ]
    },
    {
      "id": "master_bedroom",
      "name": "Master Bedroom",
      "type": "interior",
      "purpose": "Restricted access area",
      "visualDetails": "The master bedroom is a sanctuary of opulence, featuring a grand four-poster bed draped in luxurious fabrics, with a private sitting area overlooking the estate grounds.",
      "sensoryDetails": {
        "sights": [
          "The rich colors of the bedding and drapes create a warm, inviting atmosphere, contrasting with the coolness of the polished wooden floors.",
          "A large mirror reflects the soft glow of the electric lamps, enhancing the sense of space and elegance."
        ],
        "sounds": [
          "The soft rustle of fabric as the bed linens shift creates a subtle symphony of intimacy.",
          "Occasionally, the distant sound of laughter from the drawing room can be heard, a reminder of the world outside."
        ],
        "smells": [
          "The scent of lavender and fresh linen fills the air, creating a calming and soothing atmosphere.",
          "Hints of tobacco smoke linger, a remnant of late-night conversations and thoughts shared in secrecy."
        ],
        "tactile": [
          "The softness of the bedding invites one to sink into the plush comfort, creating a cocoon of warmth and security.",
          "The coolness of the wooden floors contrasts with the inviting warmth of the rugs scattered about."
        ]
      },
      "accessControl": "Access is strictly controlled; only family members and select guests may enter, and staff are prohibited without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Soft light filters through the rain-streaked windows, casting a gentle glow across the room.",
            "The muted colors of the bedding appear even softer in the diffused light."
          ],
          "sounds": [
            "The steady sound of rain pattering against the window creates a soothing backdrop, lulling one into a sense of tranquility.",
            "Occasional thunder rumbles softly in the distance, a reminder of the world outside."
          ],
          "smells": [
            "The scent of fresh linen mingles with the dampness of the air, creating a refreshing atmosphere.",
            "Hints of lavender waft in from a nearby vase, adding a calming touch."
          ],
          "mood": "intimate"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is bathed in a soft, muted light that creates an air of introspection.",
            "Shadows stretch across the floor, hinting at the secrets held within these walls."
          ],
          "sounds": [
            "The distant sound of laughter from the drawing room serves as a reminder of the outside world.",
            "The soft rustle of fabric as one shifts in the bed creates an intimate atmosphere."
          ],
          "smells": [
            "The scent of tobacco smoke lingers in the air, a reminder of late-night conversations and shared secrets.",
            "A faint whiff of lavender persists, providing a calming presence."
          ],
          "mood": "reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers across the room, casting soft shadows that dance along the walls.",
            "The room glows warmly, inviting one to settle in for the evening."
          ],
          "sounds": [
            "The distant sound of music from the drawing room creates an inviting ambiance.",
            "The soft rustle of sheets as one prepares for the night adds to the intimate atmosphere."
          ],
          "smells": [
            "The scent of burning candles mingles with the aroma of fresh lavender, creating a soothing atmosphere.",
            "Hints of tobacco linger, a remnant of earlier discussions that echo in the quiet."
          ],
          "mood": "serene yet tense"
        }
      ],
      "paragraphs": [
        "The master bedroom is a sanctuary of elegance and comfort, a space where intimacy meets the weight of expectations. Rich fabrics drape the grand four-poster bed, creating an inviting atmosphere that contrasts with the coolness of the polished wooden floors. The soft glow of electric lamps casts a warm light over the room, enhancing its opulence and providing a sense of security. Yet, despite the beauty, an air of tension lingers, as if the walls themselves hold their breath, waiting for the secrets within to be revealed.",
        "As evening descends, the flickering candlelight creates a cozy yet charged atmosphere, inviting one to ponder the complexities of relationships and hidden motives. The distant laughter from the drawing room teases the senses, a reminder of the world outside while the scent of lavender and tobacco smoke intertwine, hinting at the conversations that have taken place. In this room, where comfort meets intrigue, the truth is but a whisper away, waiting for the right moment to emerge from the shadows."
      ]
    }
  ],
  "note": "",
  "cost": 0.0032201663999999997,
  "durationMs": 47704
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1936,
    "month": "December",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "December",
    "weather": [
      "overcast with frequent rain",
      "chilly temperatures around 35°F",
      "damp and foggy evenings"
    ],
    "daylight": "Short days with sunset around 4 PM; twilight settles in quickly, casting long shadows over the estate.",
    "time_of_day_of_crime": "Late evening — after dinner, around 10 PM, when most guests are settled into the drawing room.",
    "holidays": [
      "Christmas",
      "New Year's Eve"
    ],
    "seasonalActivities": [
      "preparing for Christmas festivities",
      "attending winter balls",
      "gathering for local church services"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece wool suit",
        "double-breasted overcoat",
        "bowler hat"
      ],
      "casual": [
        "tweed sports jacket",
        "corduroy trousers",
        "knitted sweater"
      ],
      "accessories": [
        "silver pocket watch",
        "leather gloves",
        "silk scarf"
      ]
    },
    "womensWear": {
      "formal": [
        "floor-length evening gown with sequins",
        "fur stole",
        "cloche hat"
      ],
      "casual": [
        "wool cardigan",
        "tea-length dress with a fitted waist",
        "ankle boots"
      ],
      "accessories": [
        "beaded clutch purse",
        "pearl necklace",
        "embroidered handkerchief"
      ]
    },
    "trendsOfTheMoment": [
      "art deco style in design",
      "emphasis on elegant evening wear",
      "use of synthetic fabrics like rayon"
    ],
    "socialExpectations": [
      "men expected to maintain a formal appearance",
      "women encouraged to wear elegant attire at social gatherings",
      "class distinctions emphasized in attire"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Hitler's reoccupation of the Rhineland intensifies fears of war",
      "The Spanish Civil War escalates, drawing international attention",
      "The United States establishes the Neutrality Act, limiting involvement in foreign conflicts"
    ],
    "politicalClimate": "Tensions are high across Europe with the rise of fascism, prompting concern among the British populace regarding their political stability.",
    "economicConditions": "The Great Depression continues to impact the working class, with rising unemployment and widespread poverty juxtaposed against the wealth of the upper classes.",
    "socialIssues": [
      "class divide between the wealthy elite and the struggling lower classes",
      "growing awareness of women's rights and suffrage",
      "racial discrimination affecting communities of color"
    ],
    "internationalNews": [
      "Italy's invasion of Ethiopia prompts international condemnation",
      "The League of Nations falters in its ability to maintain peace",
      "Concerns over the military buildup in Germany"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Pennies from Heaven' by Bing Crosby",
        "'The Way You Look Tonight' by Fred Astaire",
        "'Ain't She Sweet' by Milton Ager"
      ],
      "films": [
        "'Modern Times' directed by Charlie Chaplin",
        "'The Great Ziegfeld'",
        "'The Story of Louis Pasteur'"
      ],
      "theater": [
        "'Anything Goes' starring Ethel Merman",
        "'On Your Toes'",
        "'The Royal Family'"
      ],
      "radio": [
        "The Jack Benny Program",
        "The Shadow",
        "Amos 'n' Andy"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Gone with the Wind' by Margaret Mitchell",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'Of Mice and Men' by John Steinbeck"
      ],
      "popularGenres": [
        "mystery",
        "historical fiction",
        "social commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "first practical use of radar",
        "development of the electric refrigerator",
        "improvements in sound recording technology"
      ],
      "commonDevices": [
        "domestic telephones",
        "electric lighting in homes",
        "typewriters for correspondence"
      ],
      "emergingTrends": [
        "increased use of household electrical appliances",
        "adoption of radio in everyday life",
        "growing popularity of cinema as a primary entertainment source"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Butter: one shilling",
        "Movie ticket: one shilling"
      ],
      "commonActivities": [
        "attending holiday parties",
        "visiting local markets",
        "participating in community charity events"
      ],
      "socialRituals": [
        "afternoon tea gatherings among the elite",
        "Christmas caroling in neighborhoods",
        "New Year's Eve parties with fireworks"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing resentment towards the wealthy elite",
      "stereotypes about the working class prevalent in media"
    ],
    "gender": [
      "women increasingly taking on roles outside the home",
      "expectation for women to uphold traditional family roles",
      "discussions on women's suffrage gaining momentum"
    ],
    "race": [
      "racial tensions exacerbated by economic disparities",
      "increased visibility for civil rights movements among minority groups"
    ],
    "generalNorms": [
      "strict adherence to etiquette in social settings",
      "emphasis on family values and community support",
      "expectation for social gatherings to showcase wealth"
    ]
  },
  "atmosphericDetails": [
    "The air carries a chill, mingling the scent of damp earth with the faint aroma of burning coal from nearby homes.",
    "Soft flickers of candlelight illuminate the grand dining room, casting long shadows on the intricately patterned wallpaper.",
    "Outside, the distant sound of a church bell tolls, echoing through the misty evening as laughter and chatter rise from the drawing room."
  ],
  "paragraphs": [
    "In the stillness of December 1936, the manor house sits solemnly under a blanket of overcast skies, where dampness seeps into the very bones of its structure. The scent of rain lingers in the air, and the temperature hovers around a chilling 35°F. As twilight approaches, the flickering shadows from the grand chandelier dance eerily across the walls, heralding the arrival of Christmas festivities. Guests gather in the drawing room, their voices a low hum against the backdrop of a tense political climate that looms over their conversations.",
    "Fashion trends of the time reflect both an adherence to tradition and a subtle shift in societal norms. Men don three-piece wool suits paired with bowler hats, while women grace the room in elegant floor-length evening gowns adorned with sequins. Accessories such as silver pocket watches and beaded clutch purses add an air of sophistication, yet the undercurrents of class tensions are palpable, reminding all present of their social standings. The elegance of their attire contrasts sharply with the grim economic realities faced by many outside the manor's gates.",
    "As the evening progresses, the atmosphere thickens with unspoken secrets and hidden agendas. The echoes of laughter from the drawing room are juxtaposed with the distant tolling of church bells, signaling the community's rituals in the face of adversity. Guests engage in spirited discussions, but beneath the surface lies a growing resentment toward the affluent, as the Great Depression weighs heavily on the minds of many. Social norms dictate that the elite must maintain their decorum, yet the strains of the outside world seep into the warmth of their gatherings, casting a long shadow over their holiday celebrations."
  ],
  "note": "",
  "cost": 0.00107369295,
  "durationMs": 16573
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A family gathering at the manor for a will reading draws together heirs and staff, all under the strain of economic hardship and rising class tensions, creating a volatile atmosphere ripe for secrets and betrayal.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression has intensified class divides, with the wealthy clinging to their status while the working class faces increasing desperation, all amidst the backdrop of political unrest in Europe."
  },
  "setting": {
    "location": "A sprawling country estate featuring a grand entrance hall, multiple parlors, and a large library, surrounded by manicured gardens and woodlands.",
    "institution": "Manor house",
    "weather": "Overcast with occasional rain, typical for the season"
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
    "id": "drawer_position",
    "value": "half-open",
    "description": "The position of the drawer containing the winding key"
  },
  {
    "id": "crack_size",
    "value": "a quarter inch",
    "description": "The size of the crack on the clock's glass"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The mechanism relies on the clock, library, and crack to expose the false timing.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The clock's faulty timing mechanism is crucial to understanding the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock's appearance suggests it had been tampered with, indicating potential foul play.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the assumption that the clock was showing the correct time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she has a corroborated alibi, having been seen at the café at the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This narrows the suspect list towards Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the library is cracked and shows the time as ten minutes past ten.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This indicates the clock may not be reliable.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "A faint smudge on the clock face indicates it was recently handled.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This suggests tampering occurred shortly before the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "A half-open drawer contains a key that fits the clock mechanism.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This indicates someone had access to the clock's inner workings.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The smudge suggests someone tampered with the clock shortly before the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This contradicts the idea that the clock was untouched.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "behavioral",
      "description": "Captain Ivor Hale was seen acting nervously around the clock.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "This raises suspicion about his involvement.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "physical",
      "description": "Fingerprints on the clock face match those of Captain Ivor Hale.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "This links him directly to the tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "physical",
      "description": "Dust on the winding key indicates it had recently been used.",
      "sourceInCML": "CASE.constraint_space.physical.traces[1]",
      "pointsTo": "This suggests someone wound back the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "testimonial",
      "description": "Dr. Mallory Finch confirms that he saw the victim at nine forty-five, contradicting the clock's reading.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This further supports the idea that the clock was tampered with.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "The clock shows ten minutes past eleven while the witness saw the victim at nine forty-five.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "This indicates a significant time discrepancy.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "testimonial",
      "description": "Beatrice Quill states she heard a noise coming from the library shortly before the murder.",
      "sourceInCML": "CASE.cast[3].evidence_sensitivity[0]",
      "pointsTo": "This suggests someone was in the library around the time of the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "behavioral",
      "description": "Captain Ivor Hale was observed checking his watch frequently during the evening.",
      "sourceInCML": "CASE.cast[2].evidence_sensitivity[0]",
      "pointsTo": "This behavior raises suspicion about his knowledge of the time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "rh_1",
      "description": "Witnesses claim the victim was alive at the time indicated by the clock.",
      "supportsAssumption": "The victim was alive at the time indicated by the clock.",
      "misdirection": "This misleads by suggesting the clock was accurate.",
      "evidenceType": "observation",
      "sourceInCML": "CASE.inference_path.steps[0].observation"
    },
    {
      "id": "rh_2",
      "description": "The clock has been known to malfunction previously, leading to doubts about its reliability.",
      "supportsAssumption": "The victim was alive at the time indicated by the clock.",
      "misdirection": "This misleads by implying the clock's history negates its current reading.",
      "evidenceType": "observation",
      "sourceInCML": "CASE.inference_path.steps[0].observation"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "physical",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "nine forty five in the evening remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "A half-open drawer contains a key that fits the clock mechanism.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The presence of the key suggests that someone intentionally wound back the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
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
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_1",
      "clue_2"
    ],
    "mid": [
      "clue_core_elimination_chain",
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_11",
      "rh_1",
      "rh_2",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_fp_contradiction_step_3"
    ],
    "late": [
      "clue_late_optional_slot_1"
    ]
  },
  "fairPlayChecks": {
    "allEssentialCluesPresent": true,
    "noNewFactsIntroduced": false,
    "redHerringsDontBreakLogic": true
  },
  "latencyMs": 14513,
  "cost": 0.0015459509999999998
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
