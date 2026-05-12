# Actual Prompt Record

- Run ID: `mystery-1778552473163`
- Project ID: ``
- Timestamp: `2026-05-12T02:24:15.954Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `a234c67ff3b3834d`

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
    "title": "The Clockwork Conspiracy",
    "author": "A. I. Writer",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
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
        "victim"
      ],
      "public_persona": "A respected guest at the manor, known for her intelligence.",
      "private_secret": "She has a hidden connection to the victim's past.",
      "motive_seed": "Curiosity about the victim's hidden life.",
      "motive_strength": "moderate",
      "alibi_window": "during dinner party",
      "access_plausibility": "high",
      "opportunity_channels": [
        "main house",
        "garden"
      ],
      "behavioral_tells": [
        "observant",
        "inquisitive"
      ],
      "stakes": "solving the murder to protect her reputation",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "doctor",
      "relationships": [
        "acquaintance of victim"
      ],
      "public_persona": "A physician with a calm demeanor.",
      "private_secret": "Has a hidden grudge against the victim.",
      "motive_seed": "Desire for revenge.",
      "motive_strength": "strong",
      "alibi_window": "during the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "library",
        "study"
      ],
      "behavioral_tells": [
        "nervous when questioned"
      ],
      "stakes": "protecting his reputation as a doctor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "military officer",
      "relationships": [
        "friend of victim"
      ],
      "public_persona": "A charming officer with a military background.",
      "private_secret": "He is in love with the victim.",
      "motive_seed": "Jealousy over the victim's relationships.",
      "motive_strength": "moderate",
      "alibi_window": "during the dinner party",
      "access_plausibility": "high",
      "opportunity_channels": [
        "dining room",
        "kitchen"
      ],
      "behavioral_tells": [
        "defensive when asked about whereabouts"
      ],
      "stakes": "protecting his unrequited love",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "maid",
      "relationships": [
        "servant to victim"
      ],
      "public_persona": "A dutiful maid known for her loyalty.",
      "private_secret": "She witnessed something important.",
      "motive_seed": "Fear of losing her job.",
      "motive_strength": "weak",
      "alibi_window": "during the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "servants' quarters",
        "kitchen"
      ],
      "behavioral_tells": [
        "hesitant to speak about the victim"
      ],
      "stakes": "her job and reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
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
      "summary": "During a stormy evening at the grand manor, Eleanor Voss investigates the untimely death of a guest, uncovering a plot involving a tampered clock that alters the timeline of the murder."
    },
    "accepted_facts": [
      "Eleanor Voss is a guest at the manor.",
      "Dr. Mallory Finch was present during the murder."
    ],
    "inferred_conclusions": [
      "The clock was tampered with to mislead the investigation."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was wound back to create a false timeline for the murder, misleading investigators about the time of death.",
      "delivery_path": [
        {
          "step": "Dr. Mallory Finch enters the study and adjusts the clock."
        },
        {
          "step": "The clock shows a time that suggests the victim was alive longer than they were."
        }
      ]
    },
    "outcome": {
      "result": "Dr. Mallory Finch's alibi collapses when the true time of death is revealed."
    }
  },
  "false_assumption": {
    "statement": "The victim was alive much longer than they actually were.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appeared to show the correct time, leading everyone to believe the victim died later than the actual time.",
    "what_it_hides": "The tampering of the clock that indicates the false time of death."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "dinner started at half past seven",
        "first scream heard at ten minutes to eight"
      ],
      "windows": [
        "murder occurred between quarter to eight and twenty minutes past eight"
      ],
      "contradictions": [
        "clock shows quarter past eight while victim was declared dead at ten to eight"
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Eleanor Voss"
      ],
      "objects": [
        "the clock",
        "murder weapon"
      ],
      "permissions": [
        "all guests had access to the study"
      ]
    },
    "physical": {
      "laws": [
        "mechanical clock operations",
        "time perception"
      ],
      "traces": [
        "dust on the clock indicates no recent disturbance"
      ]
    },
    "social": {
      "trust_channels": [
        "relationship between guests",
        "service hierarchy"
      ],
      "authority_sources": []
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock shows a time of quarter past eight, but the victim was declared dead at ten to eight.",
        "correction": "This indicates the clock was tampered with to mislead the investigation.",
        "effect": "Narrows the suspect pool to Dr. Mallory Finch since he had access to the clock.",
        "required_evidence": [
          "clock shows quarter past eight",
          "victim declared dead at ten to eight"
        ],
        "reader_observable": true
      },
      {
        "observation": "Dust accumulation on the clock suggests it hasn't been disturbed recently.",
        "correction": "The clock being undisturbed contradicts the idea that it was adjusted by anyone else except the murderer.",
        "effect": "Eliminates other suspects who had no opportunity to tamper with the clock.",
        "required_evidence": [
          "dust accumulation on the clock",
          "no other guests reported near the clock"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall Dr. Mallory Finch being in the study right before the scream.",
        "correction": "His presence in the study during the critical time frame supports the possibility of him tampering with the clock.",
        "effect": "Narrows the timeline of access to Dr. Mallory Finch.",
        "required_evidence": [
          "witness statement placing Dr. Mallory Finch in the study",
          "time frame of the murder"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares tamper, clock, and quarter against the claimed timeline.",
    "knowledge_revealed": "The tampering of the clock was intentional to create a false timeline.",
    "pass_condition": "If the clock shows a time significantly later than expected based on the victim's actual death, it proves Dr. Mallory Finch's guilt.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_8",
      "clue_mechanism_visibility_core",
      "clue_10"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time shows a discrepancy with the death declaration. Step 2: Dust on the clock indicates it wasn't disturbed recently, eliminating other suspects. Step 3: Witnesses place Dr. Mallory Finch in the study, leading to his exposure."
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
        "Observe the clock's time against the known facts",
        "Draw conclusion about guilt"
      ],
      "test_type": "mechanical comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Eleanor was present at the dining room when the murder occurred, with multiple witnesses.",
        "supporting_clues": [
          "witness statement of Eleanor's whereabouts"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Captain Hale's alibi was confirmed by three guests who saw him in the dining room during the murder.",
        "supporting_clues": [
          "guest statements confirming Hale's location"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Beatrice was in the kitchen and has a solid alibi from the head cook.",
        "supporting_clues": [
          "head cook's testimony"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of tampering."
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
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Discussed among guests"
      },
      {
        "clue_id": "clue_6",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Found by Eleanor during her investigation"
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
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
    "summary": "Eleanor Voss, a local historian in her forties, is a respected authority on the heritage of Little Middleton, but harbors a scandalous secret tied to the victim's family.",
    "publicPersona": "Eleanor presents herself as a dedicated local historian, often seen in the library with a stack of dusty tomes and an air of authority that commands respect among the townsfolk. Her knowledge of the town's past is both impressive and indispensable.",
    "privateSecret": "Beneath her scholarly facade lies a scandalous past involving the victim's ancestors, a connection she dares not reveal for fear of tarnishing her reputation.",
    "motiveSeed": "Eleanor has unearthed damaging information about the victim’s ancestors that could rewrite the town's history, a discovery that places her in an ethically precarious position.",
    "motiveStrength": "strong",
    "alibiWindow": "She was in the library researching from eight to ten, a fact that might lend her some cover, but also raises questions about what she was truly seeking.",
    "accessPlausibility": "possible",
    "stakes": "If the truth about her past and the victim's lineage comes to light, her reputation as a historian will be irrevocably damaged.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her sentences with historical anecdotes. She has a tendency to quote obscure references, which can bewilder her audience.",
    "internalConflict": "Eleanor grapples with the weight of her past actions and the fear that exposing the truth could lead to her own downfall.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as it presents an opportunity for redemption and a chance to reconcile her past mistakes with her present integrity.",
    "paragraphs": [
      "Eleanor Voss had always been the keeper of Little Middleton's secrets, a custodian of its history, though she harbored a few of her own. The library was her sanctuary, where the musty scent of old paper mingled with the whispers of the past. As she meticulously cataloged the town's records, her fingers brushed against the very names that haunted her nights. The victim's family—once illustrious, now shrouded in scandal—was a tangled thread in her own life's tapestry, a connection she feared would unravel her carefully constructed persona.",
      "On the surface, Eleanor appeared to be the quintessential historian, her spectacles perched upon her nose as she lectured patrons about the town's founding. Yet, beneath that authoritative exterior lay a woman who had made choices she regretted. The discovery of the victim's ancestors' misdeeds had ignited a spark of ambition within her, one that threatened to consume her. The thought of revealing the truth both exhilarated and terrified her; it was a dangerous game, one that could strip her of the respect she had fought so hard to earn.",
      "As the clock ticked ominously, Eleanor found herself ensnared in a web of moral quandaries. The library, usually a place of solace, felt suffocating with the weight of her secret. She had been seen in the library from eight to ten, a time that could either exonerate her or bind her closer to the crime. The truth about the victim's family could rewrite the history of Little Middleton, yet it was Eleanor's own legacy that hung in the balance. Would she seize the opportunity to expose the past, or would she bury it deeper, preserving her reputation at any cost?",
      "Eleanor's dry wit often masked her inner turmoil, a defense mechanism honed over years of academic debate and public scrutiny. 'History,' she would quip, 'is merely the version of events that most agree upon.' Yet, as she stood on the precipice of revelation, she wondered if she could truly live with herself knowing the truth but choosing silence. This crime was no longer just a matter of scholarly interest; it was a test of her character, a chance to redeem herself in the eyes of the town and, perhaps, in her own heart."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is an ambitious physician in his thirties, eager to establish his practice while hiding a mountain of debt from failed investments.",
    "publicPersona": "Mallory is seen as a promising young doctor, always impeccably dressed, with a smile that could charm the most hardened of patients. His dedication to his practice is matched only by his desire for social elevation.",
    "privateSecret": "Beneath the polished exterior lies a man drowning in debt, his failed investments threatening to unravel his ambitions and reputation.",
    "motiveSeed": "Inheriting the victim's estate could provide the financial reprieve Mallory desperately needs to escape his mounting debts.",
    "motiveStrength": "strong",
    "alibiWindow": "He claimed to have been at a late-night consultation with a patient, a statement that could either validate his innocence or raise suspicions.",
    "accessPlausibility": "easy",
    "stakes": "Financial ruin looms over Mallory, and the prospect of losing his practice is a constant fear that drives his every decision.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Mallory's speech is punctuated by an air of bravado, often employing dry humor and a hint of sarcasm as a shield against the pressures of his circumstances.",
    "internalConflict": "Mallory struggles between his ambition and the moral implications of his desires, questioning how far he is willing to go for success.",
    "personalStakeInCase": "This crime is crucial for Mallory as it offers a potential escape from his financial woes and a chance to secure his future.",
    "paragraphs": [
      "Dr. Mallory Finch had mastered the art of appearances, a skill that served him well in the competitive landscape of medicine. With a practiced smile and a well-tailored coat, he navigated the social circles of Little Middleton, charming patients and peers alike. Yet behind the facade of the ambitious physician lay a man on the brink of financial collapse. The debts from his ill-fated investments loomed large, casting a shadow over his aspirations and driving him to desperate measures.",
      "The night of the murder, Mallory had claimed to be with a patient, a convenient alibi that provided him with a sliver of protection. But the truth was more complicated; he had been wrestling with his conscience, contemplating whether the victim's untimely demise might be his ticket to financial salvation. The thought sent a shiver down his spine, a moral ambiguity that gnawed at him. Could he truly consider such a dark path, or was it merely the desperation of a man cornered?",
      "Mallory's sardonic humor often masked the turmoil within. 'Ah, the noble pursuit of medicine,' he would jest, 'where one can save a life and bankrupt oneself in the same breath.' It was a joke that rang too close to home, a reminder of the precarious balance he walked between ambition and ethics. His mind raced with possibilities; inheriting the victim's estate could lift him from the abyss, yet it also risked his standing in the community, a gamble that kept him awake at night.",
      "As the investigation unfolded, Mallory found himself torn between loyalty to his profession and the lure of self-preservation. The stakes had never been higher, and the clock was ticking. His access to the victim was easy, yet every interaction felt like a trap, a reminder of the delicate web he was weaving. In the end, would he choose the path of integrity, or would the allure of wealth drive him to betray his own principles? The answers lay tangled in the shadows of Little Middleton, where ambition and morality danced a perilous tango."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer in his fifties, grapples with disillusionment and a desire for revenge against the victim who dishonored his family.",
    "publicPersona": "Ivor is a figure of dignity and honor, often seen in his garden tending to his prized roses, embodying the values of duty and respect that defined his naval career.",
    "privateSecret": "Deep down, Ivor harbors a simmering resentment towards the victim, stemming from past slights that have marred his family's legacy.",
    "motiveSeed": "He believes the victim's actions during the war dishonored his family, igniting a thirst for retribution that he struggles to contain.",
    "motiveStrength": "compelling",
    "alibiWindow": "Ivor was in the garden, seen by no one between nine and ten, a solitary witness to his own thoughts.",
    "accessPlausibility": "possible",
    "stakes": "The honor of his family hangs in the balance, and Ivor's sense of duty compels him to confront the past.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor's speech is formal and measured, often punctuated by nautical metaphors and a slight lilt of bitterness as he reflects on his past glories.",
    "internalConflict": "Ivor is torn between his ingrained sense of honor and the desire for vengeance, questioning whether he can find peace without confronting the past.",
    "personalStakeInCase": "This crime matters deeply to Ivor as it represents a chance to reclaim his family's honor and confront the demons of his past.",
    "paragraphs": [
      "Captain Ivor Hale had once sailed the high seas, a man of honor in a world that seemed to have forgotten its meaning. Now, in the quiet of his garden, he tended to roses that thrived under his careful hand, a stark contrast to the turmoil brewing within. The naval officer's public persona was one of dignity, yet beneath that facade lay a heart burdened by the weight of past grievances. The victim's family had dishonored his own during the war, a slight that had festered into a deep-seated resentment.",
      "Ivor's alibi was as solitary as his thoughts; he had been in the garden, unseen by any but the flowers he nurtured. The absence of witnesses was both a comfort and a curse, allowing him the freedom to ponder revenge without interruption. The notion of confronting the victim brought a thrill of anticipation, yet it also filled him with dread. Would avenging his family’s honor bring him peace, or would it only lead to deeper wounds?",
      "With a self-deprecating chuckle, he often remarked, 'Ah, the folly of a retired captain, lost in his own garden.' The humor was a mask, a way to deflect the bitterness that threatened to consume him. As he reflected on the past, Ivor found himself torn between the values he had upheld during his service and the desire to right the wrongs inflicted upon his family. The stakes were high, and the clock was ticking; he could no longer ignore the shadows that loomed over his life.",
      "This crime was not merely a matter of justice; it was a quest for redemption. Ivor understood that confronting the victim could either restore his family's honor or plunge him deeper into the abyss of vengeance. The choice weighed heavily on him, and as the investigation unfolded, he realized that the real battle lay not on the battlefield, but within his own heart. In the end, could he find a way to reconcile his past while forging a path toward a more honorable future?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a young socialite in her twenties, is a charming party organizer who secretly despises her affluent peers, driven by envy of the victim's wealth and status.",
    "publicPersona": "To the outside world, Beatrice is the epitome of charm and sophistication, known for her wit and ability to organize the most extravagant soirées in Little Middleton.",
    "privateSecret": "Beneath her polished exterior lies a simmering bitterness towards her affluent peers, particularly the victim, whose wealth and status she covets.",
    "motiveSeed": "Her envy of the victim's wealth and social standing fuels her desire to eliminate the competition in the social arena.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claimed to be in her room, preparing for a party, a statement that could either validate her innocence or raise eyebrows.",
    "accessPlausibility": "unlikely",
    "stakes": "If the victim remains alive, Beatrice's social ambitions could be thwarted, leaving her in the shadows of her peers.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with a light, airy tone, often employing sarcasm and clever quips to mask her true feelings, with a penchant for dramatic flair.",
    "internalConflict": "Beatrice struggles with her jealousy, torn between her desire for acceptance and her disdain for the very society she longs to be part of.",
    "personalStakeInCase": "This crime represents a pivotal moment for Beatrice, as it could either solidify her status or force her to confront the bitterness she harbors.",
    "paragraphs": [
      "Beatrice Quill was the darling of Little Middleton's social scene, a young socialite whose charm and sophistication captivated all. She floated through the town like a breath of fresh air, organizing lavish parties that drew the elite to her doorstep. Yet, beneath the polished veneer lay a heart riddled with envy, a jealousy that festered towards the victim, whose wealth and status seemed to eclipse her own ambitions.",
      "While she claimed to be in her room preparing for the evening's festivities, Beatrice often found herself reflecting on the cutthroat nature of her social circle. 'It’s all a game of thrones, darling,' she would quip with a wry smile, masking her bitterness with a layer of polite savagery. The truth was that she despised the very people she entertained, longing for their approval while secretly wishing to see them fall from grace.",
      "Her alibi was as flimsy as the gowns she wore, a statement that could easily raise eyebrows. The thought of the victim's continued existence was a dagger to her ambitions; if the victim remained alive, Beatrice's chances of climbing the social ladder would dwindle, leaving her stuck in the shadows of her peers. The stakes were high, and the tantalizing prospect of eliminating competition began to take root in her mind.",
      "As the investigation unfolded, Beatrice found herself torn between her desire for acceptance and the bitterness that clouded her heart. This crime was not just a matter of survival; it was a chance to confront her own insecurities and perhaps redefine her place within the very society she sought to dominate. Would she rise to the occasion and embrace her true self, or would she continue to dwell in the darkness of envy? The choice lay before her, and the clock was ticking."
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
    "summary": "Middleton Manor, an expansive country estate, stands as a testament to the opulence of the 1930s, its grandeur now shadowed by the tensions of the guests within.",
    "visualDescription": "The manor boasts a façade of weathered stone, with tall, arched windows framed by ornate woodwork and lush ivy creeping over the walls. Its sprawling gardens, once vibrant with color, now lie muted under the overcast sky, the carefully manicured hedges forming a labyrinthine structure around the house.",
    "atmosphere": "A heavy atmosphere filled with unspoken secrets and lingering glances, where every creak of the floorboards seems to echo the tension among the guests.",
    "paragraphs": [
      "Middleton Manor looms against the slate-grey sky, its once-vibrant gardens now dulled by the persistent drizzle. The grand entrance, flanked by stone gargoyles, invites visitors into a world of faded elegance, where the scent of damp earth mingles with the faintest hint of lavender from the herbaceous borders. Inside, the air is thick with anticipation, as the soft flicker of gas lamps casts dancing shadows across the walls, hinting at the secrets hidden within.",
      "As one steps into the drawing room, the atmosphere shifts palpably; the muted tones of the furniture, upholstered in rich burgundy velvet, absorb the light, creating an intimate yet foreboding space. The room is adorned with portraits of stern ancestors, their eyes seemingly following every movement, deepening the sense of unease. A grand piano stands silent in the corner, its polished surface reflecting the flickering light, an unplayed melody echoing the unresolved tensions swirling among the guests.",
      "The sound of distant thunder rumbles like an ominous warning outside, as storm clouds gather, casting a pall over the estate. In the library, the scent of old books and polished mahogany fills the air, a stark contrast to the storm brewing beyond the windows. Here, whispers of hushed conversations can be heard as guests speculate on the motives of one another, each word heavy with suspicion, each glance loaded with meaning.",
      "In the secluded gardens, paths lined with damp cobblestones twist away from the manor, leading to hidden corners where secrets may be unearthed. The gentle patter of rain on the leaves creates a rhythmic backdrop to the unfolding drama, while the sharp scent of rain-soaked soil and blooming roses intensifies the air. Each secluded alcove holds the promise of discovery, as the layers of deception begin to unravel, revealing the truth hidden beneath the surface."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical for the season, contributing to a somber mood.",
    "timeFlow": "Three days of mounting tension, where time seems to stretch as secrets are revealed and alliances shift.",
    "mood": "Tense and foreboding, as underlying class tensions and personal conflicts surface among the guests.",
    "eraMarkers": [
      "Domestic telephones with brass fittings, ringing sporadically in the background.",
      "Typewriters clacking away in the study, producing telegrams and letters filled with intrigue.",
      "The crackle of a radio broadcasting news of political unrest, heightening the sense of unease."
    ],
    "sensoryPalette": {
      "dominant": "The heavy scent of damp earth and wet foliage after the rain, mingled with the musky aroma of old wood.",
      "secondary": [
        "The distant rumble of thunder, a constant reminder of the storm brewing outside.",
        "The soft whisper of silk dresses brushing against each other as guests move through the rooms."
      ]
    },
    "paragraphs": [
      "The overcast sky looms heavily over Middleton Manor, casting a grey pallor across the estate that seems to seep into the very walls. The air is thick with moisture, a dampness that clings to the skin and enhances the musty scent of old books and polished furniture. As the rain begins to fall, the sound of droplets pattering against the windows creates a rhythmic backdrop, amplifying the tension that crackles in the air.",
      "Inside, the atmosphere is charged with unspoken words and lingering stares, as guests navigate their way through the labyrinthine halls. The flickering gas lamps cast eerie shadows that dance across the portraits of long-dead ancestors, their eyes seeming to judge the living. In the corners, hushed conversations fall silent as footsteps approach, each sound echoing with the weight of suspicion and intrigue."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a grand room, lined with dark oak shelves filled with leather-bound books. A large bay window overlooks the gardens, but the rain has blurred the view, adding to the room's somber mood.",
      "sensoryDetails": {
        "sights": [
          "Rows of dusty tomes line the shelves, their spines cracked and faded from years of neglect, while a large globe stands in the corner, its surface marked with the paths of explorers long past.",
          "The plush carpet, stained with age, muffles footsteps, creating an atmosphere of secrecy as one moves through the room."
        ],
        "sounds": [
          "The soft rustling of pages being turned, as if the books themselves are whispering secrets to those who dare to listen.",
          "Occasional creaks from the floorboards above, an unsettling reminder of the house's age and the presence of unseen eyes."
        ],
        "smells": [
          "The musty scent of old paper mingles with the faint aroma of tobacco smoke, remnants of past conversations held in hushed tones.",
          "A whiff of polished wood and leather fills the air, creating a sense of both comfort and foreboding."
        ],
        "tactile": [
          "The coolness of the marble fireplace contrasts with the warmth of the thick, velvet drapes that frame the window, creating a tactile dichotomy of comfort and unease.",
          "The texture of the worn leather armchair invites one to sit, yet it feels almost too intimate, as if it holds the weight of many unspoken confessions."
        ]
      },
      "accessControl": "Only family and select guests are allowed access after the evening meal, while staff must knock and wait for permission to enter.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cascade down the window panes, distorting the view of the garden beyond, turning vibrant colors into shades of grey.",
            "The soft glow of early morning light struggles to penetrate the heavy clouds, casting a dim light across the room."
          ],
          "sounds": [
            "The steady drumming of rain on the roof creates a soothing yet eerie ambiance, as if the house itself is breathing.",
            "The distant sound of thunder rumbles like a warning, reverberating through the walls."
          ],
          "smells": [
            "The fresh scent of rain-soaked earth wafts in through the window, mingling with the musty aroma of old books.",
            "A hint of mildew lingers in the corners, a reminder of the dampness that permeates the air."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The flat, grey light filters through the window, casting long shadows that stretch across the room.",
            "Dust motes float lazily in the air, illuminated by the rare glimpse of sunlight breaking through the clouds."
          ],
          "sounds": [
            "The silence is occasionally broken by the ticking of an antique clock, each tick echoing as if counting down to an unseen event.",
            "The creak of the old timbers overhead adds to the sense of foreboding, as if the house itself is alive and aware."
          ],
          "smells": [
            "The scent of beeswax from the candles mixes with the dust of the room, creating an olfactory memory of warmth and neglect.",
            "A faint whiff of woodsmoke from the fireplace lingers, reminding one of the comforts of home amidst the cold."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The flicker of candlelight casts a warm glow across the room, illuminating the faces of those gathered within.",
            "The polished brass fittings of the fireplace catch the light, adding a touch of elegance to the otherwise somber atmosphere."
          ],
          "sounds": [
            "The gentle tick of a mantel clock provides a steady rhythm, marking the passage of time as tensions rise.",
            "Distant voices from the dining room filter in, their laughter tinged with an undercurrent of anxiety."
          ],
          "smells": [
            "The rich scent of candle wax fills the air, mingling with the lingering aroma of dinner from the kitchen.",
            "A hint of tobacco smoke wafts through, adding to the sense of intimacy and secrecy."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary of knowledge, becomes a pivotal crime scene, where the very walls seem to absorb the whispers of betrayal. The flickering gas lamps cast long shadows, and the scent of old leather and parchment hangs heavily in the air, creating an atmosphere ripe for discovery. As guests gather to discuss the events of the evening, each glance exchanged carries the weight of suspicion, and the room's silence is thick with unspoken accusations.",
        "In this space, the secrets of the manor converge, as hidden passages and locked cabinets may reveal themselves to the astute observer. The soft rustle of papers and the creaking of the old oak floorboards create a symphony of tension, as each guest grapples with their own motives and alibis. The atmosphere is charged with the promise of revelation, as the clock ticks ominously, counting down to the moment when the truth will finally emerge."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is adorned with rich fabrics and opulent furnishings, with a grand chandelier hanging from the ceiling, its crystals glinting in the light. The walls are lined with portraits of the estate's ancestors, their gazes seemingly scrutinizing the guests.",
      "sensoryDetails": {
        "sights": [
          "The plush, deep-red velvet drapes frame the large windows, their heavy fabric pooling on the polished wooden floor beneath.",
          "A large fireplace dominates one wall, its mantel adorned with ornate candelabras and family heirlooms, casting flickering shadows on the walls."
        ],
        "sounds": [
          "The soft murmur of conversation fills the air, punctuated by the occasional clinking of glasses and laughter that masks the underlying tension.",
          "The rustle of silk dresses and the shuffle of polished shoes on the wooden floor create a constant backdrop of movement."
        ],
        "smells": [
          "The scent of rich tobacco smoke lingers in the air, mingling with the floral notes of fresh arrangements set on the mantel.",
          "A hint of brandy and dust wafts through, evoking a sense of indulgence and neglect."
        ],
        "tactile": [
          "The smooth, cool surface of the marble fireplace contrasts sharply with the soft, warm embrace of the velvet upholstery on the armchairs.",
          "The texture of the embroidered cushions invites one to sink in, yet feels almost too plush, as if hiding uncomfortable truths."
        ]
      },
      "accessControl": "Accessible to all guests after breakfast, but closed to staff during social hours to maintain privacy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "The muted light filters through the rain-streaked windows, casting a soft glow over the room's opulence.",
            "Raindrops race down the glass, distorting the view of the garden and contributing to the room's melancholic charm."
          ],
          "sounds": [
            "The gentle patter of rain against the window creates a rhythmic backdrop, soothing yet somber in its persistence.",
            "Occasional thunder rumbles in the distance, echoing the tension that simmers just below the surface."
          ],
          "smells": [
            "The smell of dampness lingers in the air, mingling with the faint scent of freshly brewed coffee from the kitchen.",
            "A whiff of wet earth seeps in through the open window, grounding the ethereal atmosphere."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat, grey light fills the room, dulling the vibrancy of the furnishings and casting long shadows across the floor.",
            "The flickering flames in the fireplace provide the only warmth, creating a stark contrast against the coolness of the air."
          ],
          "sounds": [
            "The low hum of conversation continues, but the underlying tension thickens as guests steal glances at one another.",
            "The crackle of the fire is a reminder of warmth, yet it feels almost out of place amidst the chill of the atmosphere."
          ],
          "smells": [
            "The scent of burning wood fills the air, mingling with the aroma of fresh pastries cooling on the side table.",
            "A hint of mustiness from the old books lining the shelves adds a layer of nostalgia to the scene."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight dances across the walls, casting flickering shadows that seem to breathe life into the portraits.",
            "The deep hues of the upholstery are enhanced by the warm glow, creating an inviting yet charged atmosphere."
          ],
          "sounds": [
            "The soft clinking of glassware accompanies laughter, though the smiles often mask deeper anxieties.",
            "The distant sound of a clock ticking serves as a reminder of the passing time and the secrets yet to be revealed."
          ],
          "smells": [
            "The aroma of rich food lingers, mingling with the scent of freshly polished furniture, creating an air of indulgence.",
            "A hint of perfume lingers in the air, a reminder of the guests' presence and the secrets they carry."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as a stage for the unfolding drama, where guests gather in a delicate dance of conversation and intrigue. The sumptuous surroundings, adorned with rich fabrics and family portraits, create a façade of comfort, yet the air is thick with unvoiced suspicions. As laughter rings out, it often feels forced, a mask for the underlying anxieties that lurk just beneath the surface.",
        "In this space, every glance exchanged is filled with meaning, as alliances shift and tensions rise. The fireplace crackles softly, providing warmth that contrasts with the chill of uncertainty in the air. This is a gathering space where secrets are whispered and truths remain hidden, each guest navigating the delicate web of social dynamics that govern their interactions."
      ]
    },
    {
      "id": "garden",
      "name": "The Gardens",
      "type": "exterior",
      "purpose": "Clue discovery",
      "visualDetails": "The gardens are a sprawling expanse of manicured hedges and flower beds, with a central fountain that has long ceased to flow. Pathways wind through the greenery, leading to secluded alcoves and hidden benches.",
      "sensoryDetails": {
        "sights": [
          "Once vibrant flower beds now appear wilted under the grey sky, their colors muted and lifeless, while the central fountain stands dry, a relic of better days.",
          "Overgrown ivy clings to the wrought iron gates, framing the entrance to the gardens, its tendrils reaching out like fingers grasping for escape."
        ],
        "sounds": [
          "The soft rustle of leaves in the breeze provides a gentle soundtrack, but it is occasionally interrupted by the distant sound of thunder rumbling ominously overhead.",
          "The chirping of birds has quieted, leaving an unsettling silence that amplifies the tension of the unfolding drama."
        ],
        "smells": [
          "The scent of damp earth and decaying leaves fills the air, a reminder of the recent rain and the neglected state of the gardens.",
          "A faint whiff of lavender lingers, a remnant of the once-thriving flower beds, now overshadowed by neglect."
        ],
        "tactile": [
          "The cool, damp air clings to the skin, sending a shiver down the spine, while the texture of the stone pathways is uneven underfoot, each step echoing in the silence.",
          "The rough bark of the gnarled trees offers a stark contrast to the softness of the grass, creating a tactile reminder of the natural world amidst the encroaching gloom."
        ]
      },
      "accessControl": "Guests are free to roam the gardens during the day, but access is restricted after dusk for safety reasons.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the petals of wilted flowers, glistening like diamonds against the dull backdrop of grey skies.",
            "The pathways are slick with rain, creating a reflective surface that distorts the surrounding greenery."
          ],
          "sounds": [
            "The rhythmic sound of rain pattering against leaves creates a soothing, yet melancholic atmosphere, as if nature itself is weeping.",
            "Occasional gusts of wind rustle through the branches, adding an eerie undertone to the otherwise tranquil setting."
          ],
          "smells": [
            "The fresh scent of rain-soaked earth mingles with the musty aroma of damp foliage, creating a heady mix that fills the lungs.",
            "A hint of decay wafts through the air, a reminder of the neglected state of the once-pristine gardens."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The muted colors of the flower beds appear even duller under the grey sky, their beauty lost in the shadows.",
            "The silhouette of the manor looms in the background, a constant reminder of the secrets held within its walls."
          ],
          "sounds": [
            "The quiet rustle of leaves is almost deafening in the absence of bird song, amplifying the sense of isolation.",
            "The distant rumble of thunder serves as a reminder of the storm brewing overhead, creating a palpable tension in the air."
          ],
          "smells": [
            "The musty aroma of damp soil fills the air, mingling with the scent of wilting flowers, creating a sense of decay.",
            "A faint hint of lavender clings to the breeze, a ghost of the garden's former glory."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The setting sun casts a warm glow over the gardens, illuminating the paths and creating long shadows that stretch across the ground.",
            "The flowers seem to come alive, their colors more vibrant against the darkening sky, yet the beauty feels overshadowed by the tension in the air."
          ],
          "sounds": [
            "The soft sound of crickets begins to fill the air as dusk settles, their chirping a stark contrast to the silence of earlier.",
            "The distant laughter of guests filters through the garden, a reminder of the life that continues despite the darkness closing in."
          ],
          "smells": [
            "The scent of blooming jasmine fills the air, mingling with the earthy notes of the garden, creating an intoxicating aroma.",
            "A hint of smoke from the kitchen wafts through, reminding one of the warmth and comfort of home."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The gardens, once a symbol of beauty and tranquility, now serve as a backdrop for the unfolding mystery, their overgrown paths and wilted flowers mirroring the tension among the guests. As the rain continues to fall, the air is thick with the scent of damp earth and decay, a reminder of the neglect that has settled over the estate. Each step taken through the gardens feels laden with purpose, as hidden clues may lie just out of sight, waiting to be discovered.",
        "In the dim light, the gardens take on an almost otherworldly quality, where shadows stretch and twist, obscuring the truth. The stillness is punctuated only by the occasional rustle of leaves, as if the very nature around them is holding its breath, anticipating the revelations that are sure to come. As the guests wander through this labyrinth of greenery, every corner turned could unveil a secret or a hidden danger, making the gardens a crucial element in the unraveling of the mystery."
      ]
    }
  ],
  "note": "",
  "cost": 0.0027621164999999995,
  "durationMs": 37734
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1935,
    "month": "April",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool temperatures averaging 50°F"
    ],
    "daylight": "Daylight hours are lengthening, with sunset around 7:30 PM, but the overcast weather dampens the brightness.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when guests gather in the drawing-room.",
    "holidays": [
      "Easter Sunday (April 21)"
    ],
    "seasonalActivities": [
      "spring cleaning in the manor",
      "garden planting preparations",
      "local fairs and markets featuring new produce"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suits with wide lapels",
        "bow ties in bold patterns",
        "fedora hats"
      ],
      "casual": [
        "tweed jackets",
        "knitted vests",
        "high-waisted trousers"
      ],
      "accessories": [
        "monocles",
        "cufflinks",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with floral prints",
        "fitted jackets with peplum waistlines",
        "cloche hats adorned with ribbons"
      ],
      "casual": [
        "lightweight cardigans",
        "A-line skirts",
        "blouses with puffed sleeves"
      ],
      "accessories": [
        "string of pearls",
        "handbags with beaded embellishments",
        "silk scarves"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in fashion",
      "increased use of bold prints",
      "the rise of casual elegance for social gatherings"
    ],
    "socialExpectations": [
      "strict adherence to class roles",
      "formal etiquette during meals",
      "gatherings centered around intellectual discussions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Debates in the British Parliament over the rising unemployment rates",
      "The rise of fascism in Europe causing concern among political leaders",
      "Increased tensions in the Middle East due to British colonial policies"
    ],
    "politicalClimate": "The political climate is fraught with anxiety as the threat of fascism looms large in Europe, and economic instability continues to impact Britain.",
    "economicConditions": "The Great Depression still casts a long shadow, leading to high unemployment rates and social unrest.",
    "socialIssues": [
      "class disparity exacerbated by economic conditions",
      "growing labor movements advocating for workers' rights",
      "racial tensions in urban centers"
    ],
    "internationalNews": [
      "The rise of Hitler and Nazi Germany's expansionist policies",
      "Civil War in Spain drawing international attention",
      "Ongoing negotiations regarding disarmament in Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'My Heart Stood Still'",
        "Duke Ellington's jazz compositions",
        "the Charleston dance craze"
      ],
      "films": [
        "'The 39 Steps'",
        "Fred Astaire and Ginger Rogers films",
        "'Top Hat'"
      ],
      "theater": [
        "'Pygmalion' by George Bernard Shaw",
        "'The Glass Menagerie' by Tennessee Williams"
      ],
      "radio": [
        "'Gunsmoke' radio show",
        "BBC news broadcasts",
        "popular musical variety shows"
      ]
    },
    "literature": {
      "recentPublications": [
        "'A Handful of Dust' by Evelyn Waugh",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Good Soldier' by Ford Madox Ford"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "social commentary novels",
        "escapist romance"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first electronic computer prototypes",
        "the introduction of the electric refrigerator",
        "advancements in radio technology"
      ],
      "commonDevices": [
        "domestic radios for home entertainment",
        "typewriters in offices",
        "early models of vacuum cleaners"
      ],
      "emergingTrends": [
        "increased reliance on domestic technologies for convenience",
        "the popularity of automobiles for middle-class families",
        "growth of public transportation systems in urban areas"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A dozen eggs: one shilling",
        "A pint of milk: three pence"
      ],
      "commonActivities": [
        "attending local markets for fresh produce",
        "socializing at tea gatherings",
        "participating in village fairs"
      ],
      "socialRituals": [
        "afternoon tea served promptly at four o'clock",
        "formal dinner parties with multiple courses",
        "weekly church services followed by community discussions"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "firm belief in the social hierarchy",
      "growing resentment among the lower classes towards the wealthy",
      "expectation of deference from lower classes to their betters"
    ],
    "gender": [
      "women expected to adhere to domestic roles",
      "men viewed as primary breadwinners",
      "increasing calls for women's rights and suffrage"
    ],
    "race": [
      "prejudice against immigrants and minorities",
      "racial segregation in some areas",
      "growing awareness of civil rights issues"
    ],
    "generalNorms": [
      "emphasis on propriety and decorum in social interactions",
      "conformity to traditional gender roles",
      "disdain for behavior considered 'vulgar' or 'improper'"
    ]
  },
  "atmosphericDetails": [
    "The damp scent of rain-soaked earth clings to the air, mingling with the aroma of blooming spring flowers in the manor's gardens.",
    "The soft, muted sounds of raindrops against the windowpanes create a melancholic backdrop, amplifying the tension among the guests gathered inside.",
    "Occasional flashes of lightning illuminate the darkened corridors of the manor, casting long shadows that seem to whisper secrets of the past."
  ],
  "paragraphs": [
    "In April 1935, the world outside the manor house is marked by a somber spring, characterized by overcast skies and a chill that clings to the air. The occasional rain drizzles down, soaking the freshly tilled earth outside, which contrasts with the tension brewing within the walls of the estate. Guests, gathered for a weekend retreat, find themselves increasingly aware of the class disparities that simmer just beneath the surface, heightened by the economic hardships of the Great Depression. The looming threat of fascism in Europe adds an unsettling layer of anxiety, casting a shadow over their otherwise genteel affairs.",
    "Fashion trends of the time reflect the elegance expected in such a setting, with men donning tailored three-piece suits featuring wide lapels and women adorned in tea-length dresses with floral prints, accessorized with cloche hats and strings of pearls. The atmosphere is one of understated sophistication, yet the choices of attire also hint at the social expectations of the day — an adherence to class and decorum, even as the world outside grows ever more chaotic. The guests' conversations, punctuated by the sounds of tinkling china and the soft strains of jazz from the radio, are laced with a sense of foreboding.",
    "Daily life in this moment is intricately tied to social rituals that reflect the era's norms. Afternoon tea is a sacred tradition, observed with meticulous precision, while formal dinner parties serve to reinforce the social hierarchy. Prices remain affordable, yet the economic reality weighs heavily on minds, with a loaf of bread costing just four pence. Amidst the backdrop of rising unemployment and social unrest, the manor's opulence stands in stark contrast to the struggles faced by many. The guests, though seemingly insulated from the outside world, find their interactions increasingly fraught with tension as underlying resentments and conflicts come to light."
  ],
  "note": "",
  "cost": 0.00111488355,
  "durationMs": 13839
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense inheritance gathering at the manor reveals deep-seated class tensions and personal rivalries among guests, exacerbated by the economic strain of the Great Depression.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression has intensified class divisions, with rising political tensions and strict hierarchies creating a charged atmosphere among the wealthy and their servants."
  },
  "setting": {
    "location": "An expansive country estate featuring grand architecture and extensive gardens.",
    "institution": "Manor house",
    "weather": "Overcast with occasional rain, contributing to a somber mood."
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
    "id": "victim_last_seen",
    "value": "a quarter past ten",
    "description": "The last known time the victim was seen alive"
  },
  {
    "id": "dinner_start_time",
    "value": "eight o'clock",
    "description": "The official start time of the dinner party"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock was wound back to create a false timeline for the murder, misleading investigators about the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Indicates the method used to mislead the investigation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock shows a time of quarter past eight, but the victim was declared dead at ten to eight.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Establishes a contradiction in the timeline of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the dinner table with multiple witnesses until ten minutes to eight.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Confirms Captain Ivor Hale's alibi and rules him out as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "Witnesses recall Dr. Mallory Finch being in the study right before the scream.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Links Dr. Mallory Finch to the critical time frame of the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Dust accumulation on the clock suggests it hasn't been disturbed recently.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Indicates that the clock was not adjusted by anyone else.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The clock being undisturbed contradicts the idea that it was adjusted by anyone else except the murderer.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Challenges the assumption that someone tampered with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "behavioral",
      "description": "Dr. Mallory Finch exhibited signs of nervousness when questioned about his whereabouts.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "Suggests possible guilt or premeditation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was accounted for by Eleanor Voss during the critical time.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "Further corroborates Captain Ivor Hale's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The first scream was heard at ten minutes to eight, shortly before the victim was declared dead.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Establishes the timeline of events leading to the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "This indicates the clock was tampered with to mislead the investigation.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Confirms the clock's manipulation as a key element of the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "The discriminating test compares tamper, clock, and quarter against the claimed timeline.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[0]",
      "pointsTo": "Sets up the basis for the final analysis of the evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "Dr. Mallory Finch was seen leaving the study shortly after the scream was heard.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Links Dr. Mallory Finch to the scene of the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "temporal",
      "description": "The victim was declared dead at ten to eight, while the clock shows a time of quarter past eight.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Highlights the discrepancy in the timeline of the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "temporal",
      "description": "Dust on the clock indicates no recent disturbance, supporting the idea that it was not adjusted after the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Further supports the timeline of events.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "temporal",
      "description": "The clock's position and condition suggest it was not manipulated after the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Reinforces the timeline and suggests premeditated actions.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Dinner started at half past seven remains a late texture detail in the case background.",
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
      "description": "The clock shows a time of quarter past eight, but the victim was declared dead at ten to eight.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This indicates the clock was tampered with to mislead the investigation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Witnesses recall Dr. Mallory Finch being in the study right before the scream.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "His presence in the study during the critical time frame supports the possibility of him tampering with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Witnesses initially believed the victim had been alive much longer due to the apparent time discrepancy.",
      "supportsAssumption": "The victim was alive much longer than they actually were.",
      "misdirection": "This misleads the investigation by creating doubt about the actual time of death."
    },
    {
      "id": "rh_2",
      "description": "Some guests claimed they heard noises coming from the study before the scream.",
      "supportsAssumption": "The victim was alive much longer than they actually were.",
      "misdirection": "This suggests that the victim may have been in distress for a longer period, complicating the timeline."
    }
  ],
  "status": "pass",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_2",
      "clue_6",
      "clue_fp_contradiction_step_1"
    ],
    "mid": [
      "clue_core_elimination_chain",
      "clue_1",
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_11",
      "clue_12",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_fp_contradiction_step_3"
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
  "latencyMs": 15367,
  "cost": 0.00161516685
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
