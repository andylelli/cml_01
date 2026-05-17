# Actual Prompt Record

- Run ID: `mystery-1779023763782`
- Project ID: ``
- Timestamp: `2026-05-17T13:18:39.648Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `c223abe1647a3bdb`

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
    "title": "The Clockwork Conundrum",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Country Estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical murder"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Wealthy heiress and host of the will reading",
      "private_secret": "Knew about the inheritance's contentious nature",
      "motive_seed": "Fear of losing wealth and status",
      "motive_strength": "strong",
      "alibi_window": "None; present at the scene",
      "access_plausibility": "high",
      "opportunity_channels": [
        "guest access",
        "staff access"
      ],
      "behavioral_tells": [
        "calm demeanor",
        "observant"
      ],
      "stakes": "High; potential loss of inheritance",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "medical expert",
      "relationships": [],
      "public_persona": "Respected local physician",
      "private_secret": "In financial trouble due to the Great Depression",
      "motive_seed": "Desire to secure financial stability",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "medical access",
        "guest access"
      ],
      "behavioral_tells": [
        "nervousness when questioned"
      ],
      "stakes": "Moderate; financial stability",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "military officer",
      "relationships": [],
      "public_persona": "Retired naval captain",
      "private_secret": "Has a gambling debt",
      "motive_seed": "Desperation for money",
      "motive_strength": "strong",
      "alibi_window": "8:30 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "guest access"
      ],
      "behavioral_tells": [
        "fidgeting with his pocket watch"
      ],
      "stakes": "High; potential loss of reputation",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "servant",
      "relationships": [],
      "public_persona": "Maid and assistant to Eleanor",
      "private_secret": "Has been stealing from the household",
      "motive_seed": "Need for money",
      "motive_strength": "moderate",
      "alibi_window": "7:45 PM to 8:45 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "servant access"
      ],
      "behavioral_tells": [
        "avoids eye contact"
      ],
      "stakes": "High; risk of being fired or arrested",
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
      "Dr. Mallory Finch"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During the reading of a wealthy benefactor's will at a grand country estate, Eleanor Voss is found dead. As tensions rise among the guests, Eleanor, now acting as the detective, uncovers the truth behind the mechanical tampering of a clock that misled everyone about the time of death."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "Dr. Mallory Finch rewound the clock to create an alibi for himself after murdering Eleanor.",
      "delivery_path": [
        {
          "step": "Rewind clock before will reading"
        },
        {
          "step": "Align time of death with rewound clock"
        }
      ]
    },
    "outcome": {
      "result": "Dr. Mallory Finch establishes a false timeline, implicating others."
    }
  },
  "false_assumption": {
    "statement": "The clock accurately shows the time of death.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock is a prominent feature in the manor, and all guests rely on it.",
    "what_it_hides": "The true time of death as manipulated by Dr. Mallory Finch."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "8:30 PM",
        "9:00 PM",
        "9:30 PM"
      ],
      "windows": [
        "8:45 PM to 9:15 PM"
      ],
      "contradictions": [
        "Dr. Finch claims he was with guests at 9:00 PM, but clock shows 9:15 PM during the murder."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Beatrice Quill"
      ],
      "objects": [
        "clock",
        "will document"
      ],
      "permissions": [
        "unrestricted access to study"
      ]
    },
    "physical": {
      "laws": [
        "Time cannot be rewound",
        "Clock mechanism must show consistent time"
      ],
      "traces": [
        "Scratch marks on clock case",
        "Unusual weight inside clock"
      ]
    },
    "social": {
      "trust_channels": [
        "reputation of Dr. Finch as a respected physician"
      ],
      "authority_sources": [
        "local police force"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall the clock striking at quarter past nine during the will reading.",
        "correction": "If the clock struck at quarter past nine, then the murder must have occurred shortly before.",
        "effect": "Narrows suspect timeline and eliminates Beatrice Quill since she was seen in the kitchen at that time.",
        "required_evidence": [
          "Witness statement about clock striking",
          "Beatrice Quill's alibi from kitchen staff"
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint scratch is visible on the clock case, suggesting tampering.",
        "correction": "The scratch indicates that the clock was likely manipulated.",
        "effect": "Narrows down the suspects to Dr. Mallory Finch, as only he had time alone in the study.",
        "required_evidence": [
          "Physical observation of scratch on clock",
          "Dr. Finch's access to the study during the event"
        ],
        "reader_observable": true
      },
      {
        "observation": "An unusual weight is found inside the clock that doesn't belong.",
        "correction": "The weight suggests that the clock was altered to mislead about the time.",
        "effect": "Eliminates Captain Ivor Hale, who had no reason to tamper with the clock mechanism.",
        "required_evidence": [
          "Inspection of the clock's internal components",
          "Testimony from the estate handyman"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, tamper, and witness against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, witness, and recall.",
    "pass_condition": "If the clock shows a time different from the accurate timepiece, Dr. Finch's alibi is disproven.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The witnesses' clock statement (early) allows the reader to place the murder time. Step 2: The visible scratch on the clock (mid) suggests tampering. Step 3: The unusual weight found in the clock (late) indicates further manipulation, leading to the discriminating test."
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
        "Observe the clock's time against an accurate timepiece",
        "Draw conclusion about Dr. Finch's guilt"
      ],
      "test_type": "comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified by kitchen staff",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No tampering motive found",
        "supporting_clues": [
          "clue_3"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Physical inspection"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Inspection of clock"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
    "summary": "A charming socialite with a flair for the extravagant, Eleanor Voss hides a troubling undercurrent of financial distress beneath her polished exterior.",
    "publicPersona": "Eleanor is the quintessential hostess of Little Middleton, known for her lavish soirées that draw the elite. With a radiant smile and a keen eye for detail, she enchants her guests, leaving them eager for more of her company. Her charm and wit make her a beloved figure in high society, yet her social standing hangs by a thread, threatened by her mounting gambling debts.",
    "privateSecret": "Eleanor's glamorous facade is marred by a secret battle with gambling addiction. She frequently finds herself entangled in games of chance, hoping to win back lost fortunes, but instead finds her debts spiraling out of control, putting her beloved family estate at risk.",
    "motiveSeed": "The thought of losing her home and the status it represents fills Eleanor with dread. She fears that should the estate be sold off to pay her debts, she will lose not only her financial security but also her place in the social hierarchy she has so carefully curated.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was hosting a dinner party from eight until ten, surrounded by guests who would attest to her presence.",
    "accessPlausibility": "easy",
    "stakes": "Eleanor's stakes are nothing short of devastating; her financial ruin would mean not only the loss of her estate but also her treasured social standing, which she has worked tirelessly to maintain.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with an air of refinement, her words often laced with playful irony. She has a tendency to punctuate her sentences with a light laugh, especially when discussing her social escapades, yet there is a sharp edge to her wit that reveals her underlying tension.",
    "internalConflict": "Eleanor grapples with the duality of her life; her desire for wealth and status clashes with her growing realization that these are not the true measures of her worth. She wrestles with guilt over her gambling, fearing that her need for approval will lead to her downfall.",
    "personalStakeInCase": "This crime matters deeply to Eleanor not just professionally, but personally; the estate is a symbol of her identity, and its loss would shatter her very sense of self.",
    "paragraphs": [
      "Eleanor Voss glided through the grand halls of her estate, her laughter ringing like a chime in the air. She was hosting yet another dinner party, a spectacle of elegance that would keep her guests enthralled. As the evening wore on, she expertly navigated conversations, her sharp wit and charm captivating everyone present. But beneath the surface, a tempest brewed. Each toast raised in her honor felt like a reminder of the debts that loomed over her, threatening to upend her carefully constructed world.",
      "In the quiet moments between laughter, Eleanor's mind raced. She had always been drawn to the thrill of the game, the allure of winning back what she had lost. Yet, as she glanced at the crystal chandeliers that illuminated her lavish home, she felt a pang of fear. What would happen if the estate was sold? The thought was unbearable, a dark shadow that loomed over her social gatherings. Each smile she wore felt more like a mask, hiding the desperation that clawed at her insides.",
      "The stakes had never felt higher. Eleanor's friends saw her as the epitome of grace and charm, blissfully unaware of the turmoil that lay beneath. She had to maintain her composure, for if they discovered her secret, it would mean not only her financial ruin but also a loss of respect, a fate worse than death in her world. Her heart raced at the thought of being ostracized, cast aside like a discarded invitation. She would do anything to prevent that fate, even if it meant bending the rules of propriety.",
      "As the evening drew to a close and her guests began to depart, Eleanor felt a sense of unease settle in the pit of her stomach. She had managed to keep her facade intact for another night, but the clock was ticking. With every passing day, her financial situation grew more precarious, and the walls of her carefully curated life began to close in. Eleanor knew she had to confront her obsession with status and find a way to rebuild her life on more solid ground, but for now, she would continue to play the part of the perfect hostess, even as her world threatened to crumble around her."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "As a respected physician, Dr. Mallory Finch is both a healer and a man divided by his secret affections, navigating the thin line between ambition and loyalty.",
    "publicPersona": "Dr. Finch is known as a benevolent figure in Little Middleton, often seen lending his expertise to those in need. His charitable work has earned him the trust and admiration of the community, allowing him to maintain a polished reputation as a dedicated physician who cares deeply for his patients.",
    "privateSecret": "Beneath his professional demeanor lies a hidden relationship with Eleanor Voss. Their connection is fraught with complications, as he struggles to balance his love for her with his ambitions surrounding her family estate.",
    "motiveSeed": "Dr. Finch dreams of opening a medical clinic that would serve the underprivileged, but to do so, he needs the funds that could come from inheriting Eleanor's estate. This ambition places him at a crossroads, torn between his affection for Eleanor and his personal aspirations.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claimed to be attending to a patient from seven until nine, a plausible cover but one that could be scrutinized.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Dr. Finch are significant; achieving his dream of opening a clinic would require resources he hopes to gain from Eleanor's estate, but at what cost to their relationship?",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a calm, measured tone, often punctuating his conversations with well-timed humor. He has a habit of using medical metaphors to lighten the mood, yet there is a seriousness in his eyes that betrays the weight of his internal conflict.",
    "internalConflict": "Dr. Finch is plagued by a moral dilemma; his affection for Eleanor conflicts with his ambitions, leaving him torn between love and aspiration. He fears that pursuing the estate could jeopardize their relationship, yet the prospect of a better future for his clinic is too enticing to ignore.",
    "personalStakeInCase": "This case is deeply personal for Dr. Finch, as it not only tests his ethical boundaries but also his commitment to Eleanor, whose fate is intertwined with his own dreams.",
    "paragraphs": [
      "Dr. Mallory Finch stood in his office, surrounded by medical texts and the faint scent of antiseptic. To the townsfolk, he was a pillar of the community, a man whose expertise was sought after in times of need. Yet, behind the facade of the caring doctor lay a tumult of emotions, particularly when it came to Eleanor Voss. Their relationship, born of mutual respect and admiration, had blossomed into something deeper, yet fraught with complications that gnawed at him.",
      "As he treated patients, his mind often wandered to Eleanor, her laughter echoing in his thoughts. He had always admired her strength and charm, but now he found himself ensnared by the duality of his feelings. The estate was not just a matter of financial gain; it represented a chance to fulfill his dream of opening a clinic that would serve the less fortunate. But to achieve that, he would need to navigate the treacherous waters of ambition and love, a task that felt increasingly daunting.",
      "The night of the dinner party, he had made certain to keep his alibi intact, attending to a patient while Eleanor entertained her guests. Yet, as he recalled the evening, he felt a pang of guilt. While she dazzled the elite, he was left with the knowledge that his motives might not be as pure as they seemed. The thought of inheriting the estate for personal gain loomed over him, casting a shadow on their relationship. Would Eleanor ever forgive him if she discovered his ulterior motives?",
      "Dr. Finch's stakes were high; the success of his clinic depended on resources he hoped to gain from Eleanor's estate, but the emotional cost weighed heavily on him. He had to choose between his dreams and the woman he cared for, a decision that threatened to unravel the very fabric of his life. As he prepared for the challenges ahead, he steeled himself for the confrontation that awaited, knowing that the outcome could change everything for both him and Eleanor."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired military officer with an air of dignity, Captain Ivor Hale is driven by a complex blend of ambition and resentment, seeking to restore his family's fortune.",
    "publicPersona": "In Little Middleton, Captain Hale is a respected figure, often regaling audiences with tales of his military exploits. His dignified presence commands attention, and he is seen as a man of honor, despite the whispers of his financial troubles that linger in the background.",
    "privateSecret": "Beneath his authoritative exterior, Captain Hale harbors a deep-seated resentment towards the wealthy elite, stemming from his own financial losses during the stock market crash. This bitterness fuels his desire to claim the estate as a means to restore his family's honor.",
    "motiveSeed": "Driven by a need to reclaim his family's lost prestige and wealth, Captain Hale sees the estate as his ticket to redemption. He believes that by acquiring the property, he can once again elevate his family's standing in society.",
    "motiveStrength": "moderate",
    "alibiWindow": "He was seen walking in the gardens from eight to nine-thirty, a plausible alibi but one that could be easily challenged.",
    "accessPlausibility": "unlikely",
    "stakes": "The stakes for Captain Hale are high; restoring his family's honor and financial security is paramount, yet he must confront the bitterness that clouds his judgment.",
    "humourStyle": "sardonic",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a commanding tone, often punctuating his statements with a sardonic edge. His speech is marked by a formal cadence, yet he occasionally slips into a more casual vernacular when recounting his war stories, revealing a hint of vulnerability beneath his bravado.",
    "internalConflict": "Captain Hale wrestles with feelings of inadequacy and resentment, struggling to reconcile his ambitions with the reality of his financial decline. He fears that his bitterness may lead him down a path of self-destruction, yet he remains fixated on reclaiming his family's legacy.",
    "personalStakeInCase": "This case matters deeply to Captain Hale, as it represents not only a chance to restore his family's name but also an opportunity to confront his own demons and redefine his values.",
    "paragraphs": [
      "Captain Ivor Hale stood in the garden, the moonlight casting shadows upon his weathered face. He was a man of dignity, once a proud military officer, now grappling with the remnants of his past glories. The tales he spun at social gatherings were filled with valor and honor, yet beneath that bravado lay a bitter truth: the stock market crash had stripped him of his fortune, leaving him to wander the halls of his memories, haunted by what once was.",
      "As he strolled through the manicured paths, Captain Hale's mind was consumed by thoughts of the Voss estate. To him, it represented more than just a property; it was a chance to reclaim his family's honor, to rise from the ashes of his financial ruin. He envisioned the lavish parties he would host, the respect he would garner, and the legacy he would restore. But that vision was clouded by a bitterness that festered within him, a resentment towards the wealthy elite who had thrived while he had fallen.",
      "The night of the dinner party, he had been seen walking in the gardens, a seemingly innocent alibi, but one that could be scrutinized. He felt the weight of scrutiny pressing upon him, knowing that suspicion could easily shift to his direction. He had to tread carefully, for the stakes were high. If he were to claim the estate, he would need to navigate the treacherous waters of ambition and resentment, a balancing act that felt increasingly precarious.",
      "Captain Hale's internal conflict raged within him; he was torn between the desire to restore his family's legacy and the bitterness that threatened to consume him. He feared that his obsession with reclaiming what was lost might lead him down a path of moral ambiguity, yet the allure of power and prestige was a siren's call he could not ignore. As he prepared for the challenges ahead, he knew that the journey would not only test his resolve but also force him to confront the very values he had once held dear."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A dutiful governess with a hidden lineage, Beatrice Quill navigates the complexities of identity and belonging, yearning for recognition in a world that has denied her.",
    "publicPersona": "Beatrice is seen as a devoted governess, dedicated to the children in her care. Her reserved demeanor and unwavering commitment have earned her the respect of the household, yet few know the depths of her aspirations and struggles.",
    "privateSecret": "Unbeknownst to those around her, Beatrice is the illegitimate daughter of the victim, driven by a desperate desire for recognition and a rightful claim to the estate she feels entitled to.",
    "motiveSeed": "Beatrice aims to expose her identity to secure her place in the family and inherit what she believes is rightfully hers. Her longing for acceptance drives her to seek the truth behind her lineage.",
    "motiveStrength": "compelling",
    "alibiWindow": "She was with the children from seven until nine, providing her with a solid alibi.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are deeply personal; her quest for acceptance and belonging hinges on the outcome of the investigation into the estate.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks softly, often choosing her words with care. Her tone is gentle, but her humor is tinged with self-deprecation, revealing her insecurities and longing for acceptance.",
    "internalConflict": "Beatrice wrestles with her identity as an outsider, feeling both a deep yearning for recognition and a fear of rejection. Her desire to claim her place in the family conflicts with the fear of disrupting the fragile relationships she has built.",
    "personalStakeInCase": "This case is profoundly personal for Beatrice; it represents her chance to confront her identity and claim the belonging she has always sought, transforming her life forever.",
    "paragraphs": [
      "Beatrice Quill sat in the nursery, surrounded by the laughter of children, yet her heart felt heavy with unspoken truths. As the governess, she had dedicated herself to nurturing the young minds in her care, yet within her lay a secret that had the power to alter her very existence. While she smiled and played the role of the devoted caretaker, her thoughts often drifted to the identity she had been denied, the lineage that was hers but remained shrouded in secrecy.",
      "In the quiet moments, Beatrice would reflect on her origins, the whispers of her mother's past echoing in her mind. To the world, she was merely a governess, dutiful and reserved, yet she longed for something more. The estate that housed her was not just a workplace; it was a symbol of the family she was a part of, yet apart from. The thought of exposing her true identity filled her with both hope and trepidation, as she wondered if the truth would bring acceptance or rejection.",
      "The night of the dinner party provided her with an alibi, a momentary shield against suspicion, but the stakes felt higher than ever. Beatrice's heart raced at the thought of the investigation into the estate; it was her chance to unveil her identity and claim her rightful place in a family that had unknowingly denied her. Yet, the fear of disrupting the fragile relationships she had built weighed heavily upon her. Would they accept her, or would she be cast aside as an interloper in their lives?",
      "As the investigation unfolded, Beatrice found herself torn between the desire for belonging and the fear of rejection. Her internal conflict raged within her; she sought recognition yet dreaded the implications of unveiling her truth. The stakes were personal and profound; this case was not just about the estate, it was about her identity, her place in the world, and the acceptance she had longed for. With each passing day, Beatrice knew she had to confront her fears and step into the light, for only then could she truly find her home."
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
    "summary": "A sprawling estate with grand architecture, hidden secrets, and a backdrop of creeping tension among its guests.",
    "visualDescription": "The manor stands proudly with its ivy-clad stone facade, large leaded windows reflecting the overcast sky, and a weathered entrance flanked by ornate stone gargoyles. The expansive gardens are meticulously landscaped but conceal winding paths that twist through thick hedgerows.",
    "atmosphere": "A sense of foreboding lingers in the air, underscored by whispers of discontent and the weight of unspoken truths.",
    "paragraphs": [
      "Little Middleton Manor looms over the estate like a watchful guardian, its stone walls steeped in centuries of history. The grand entrance hall, with its polished oak floors and sweeping staircase, echoes with footsteps, while the flickering shadows cast by gas lamps add an air of mystery. Outside, the sprawling gardens, lush yet foreboding, hide secrets beneath their manicured surface, with paths leading into the dense woodlands that surround the property.",
      "As the rain patters against the leaded glass windows, the manor seems to breathe, each creak of the floorboards a reminder of the lives once lived within these walls. The distant sound of thunder rumbles ominously, mirroring the growing tension among the guests gathered within. Conversations are punctuated by nervous laughter, a façade masking the underlying currents of distrust and resentment that simmer just below the surface.",
      "The atmosphere is thick with the scent of damp earth and blooming roses, mingling with the faint aroma of tobacco wafting from the drawing room where the guests gather. Outside, the gardens are shrouded in mist, the air cool and heavy, as if nature itself is holding its breath in anticipation of the revelations to come. The distant hills loom like silent sentinels, witnessing the drama unfold within the manor's walls.",
      "In this world of elegance and deceit, every corner of Little Middleton Manor holds potential for revelation or ruin. The locked study, with its vital documents, remains a tantalizing mystery, while the narrow staircases and hidden paths serve as both concealment and escape routes. As the clock ticks ominously, the guests are drawn into a web of intrigue where every glance and gesture may hold the key to unraveling the clockwork conundrum."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical for the season, creating a damp and moody environment.",
    "timeFlow": "The events unfold over a tense weekend, with each passing hour heightening the sense of dread and anticipation.",
    "mood": "Suspenseful and tense, as underlying social tensions and secrets begin to surface among the guests.",
    "eraMarkers": [
      "Typewriters clacking in the study",
      "Radio broadcasts filling the common rooms",
      "Early home telephones in private parlors"
    ],
    "sensoryPalette": {
      "dominant": "A pervasive dampness and earthy scent enveloping the manor",
      "secondary": [
        "The sharp tang of woodsmoke from the hearth",
        "The musty odor of old leather-bound books"
      ]
    },
    "paragraphs": [
      "The manor is steeped in a palpable tension, the air thick with the scent of wet earth and the occasional waft of woodsmoke. Shadows flicker across the grand hall, where the light from gas lamps dances upon the walls, creating an atmosphere of mystery. Outside, the gardens, lush yet overgrown, hide secrets within their winding paths, casting an eerie stillness that hints at hidden truths waiting to be uncovered.",
      "As guests move through the elegantly appointed rooms, laughter rings hollow against the backdrop of the rain's steady patter. The sound of a distant clock ticking away the minutes adds to the mounting suspense, each chime resonating with the weight of impending revelations. The manor's isolation amplifies the sense of entrapment, with the nearest village miles away, making escape seem a distant dream."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A dimly lit room lined with towering shelves of books, a single reading table in the center, and a large fireplace that crackles softly.",
      "sensoryDetails": {
        "sights": [
          "Dust motes dancing in the candlelight",
          "Shadows cast by tall bookshelves"
        ],
        "sounds": [
          "Crackling fire",
          "Pages turning in the silence",
          "The distant sound of rain"
        ],
        "smells": [
          "Old leather and parchment",
          "A hint of beeswax from candles"
        ],
        "tactile": [
          "Cool leather-bound books",
          "The warmth of the fireplace nearby"
        ]
      },
      "accessControl": "Restricted access after hours; only the family and select guests allowed; staff must knock before entering.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-streaked windows",
            "Grey light filtering through"
          ],
          "sounds": [
            "Steady drumming on the roof",
            "Water trickling in the gutters"
          ],
          "smells": [
            "Damp earth",
            "Cold stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light",
            "Shadows without edges"
          ],
          "sounds": [
            "Silence broken by a distant clock",
            "The creak of old timbers"
          ],
          "smells": [
            "Dust and old books",
            "A faint whiff of tobacco"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight catching brass fittings",
            "Long shadows across the floor"
          ],
          "sounds": [
            "The tick of a mantel clock",
            "Distant voices from below stairs"
          ],
          "smells": [
            "Candle wax",
            "Cold fireplace ash"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library is a repository of whispered secrets and hidden knowledge. Tall bookshelves loom over the single reading table, where the flickering light of candles casts dancing shadows across the spines of ancient tomes. The air is thick with the scent of old leather and parchment, mingling with the faint aroma of beeswax, creating an atmosphere ripe for revelation. On this particular evening, the library feels charged with a sense of foreboding, as if the very walls are holding their breath in anticipation of the truths that will soon come to light.",
        "In the quiet of the library, the only sounds are the crackling of the fire and the occasional rustle of pages being turned. A single chair sits by the hearth, inviting yet ominous, as if it were waiting for someone to reveal a long-buried secret. The rain outside creates a rhythmic backdrop, its steady patter against the windows adding to the sense of isolation. Here, in this sanctuary of knowledge, the threads of the mystery begin to unravel, twisting together like the intricate gears of a clockwork mechanism."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "An elegantly furnished room with plush sofas, a grand piano, and large windows overlooking the gardens.",
      "sensoryDetails": {
        "sights": [
          "Richly patterned wallpaper",
          "Sunlight filtering through lace curtains"
        ],
        "sounds": [
          "Laughter echoing off the walls",
          "The soft notes of a piano being played"
        ],
        "smells": [
          "Freshly brewed tea",
          "A hint of floral perfume"
        ],
        "tactile": [
          "Soft velvet upholstery",
          "Cool porcelain teacups"
        ]
      },
      "accessControl": "Open to all guests during the day; private gatherings in the evening require invitation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops sliding down the windows",
            "Soft grey light filling the room"
          ],
          "sounds": [
            "The gentle patter of rain",
            "Muffled voices from outside"
          ],
          "smells": [
            "Wet earth from the gardens",
            "The scent of blooming roses"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Dim light casting deep shadows",
            "A flickering fire in the hearth"
          ],
          "sounds": [
            "The soft murmur of conversations",
            "The rustle of silk dresses"
          ],
          "smells": [
            "A blend of tobacco and tea",
            "The faint scent of aging wood"
          ],
          "mood": "tense interactions"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight reflecting off polished surfaces",
            "Guests gathered in animated conversation"
          ],
          "sounds": [
            "The clinking of glasses",
            "The distant sound of music from the piano"
          ],
          "smells": [
            "A rich aroma of evening meal preparations",
            "The sweet scent of pastries"
          ],
          "mood": "festive yet strained"
        }
      ],
      "paragraphs": [
        "The drawing room is a hub of social activity, where laughter mingles with the clinking of teacups and the soft notes of a piano. Elegant sofas invite guests to recline and engage in spirited conversation, while the large windows offer a view of the gardens, where the rain creates a shimmering veil over the landscape. As the afternoon wears on, the atmosphere shifts, and the air becomes thick with unspoken tensions, each smile hiding a deeper story.",
        "In the evenings, the drawing room transforms into an intimate gathering space, where candlelight flickers against the richly patterned wallpaper, casting playful shadows on the faces of the guests. The scent of freshly brewed tea and sweet pastries fills the air, but beneath the surface, the conversations are laced with subtle undertones of rivalry and suspicion. It is here, amidst the elegance and charm, that alliances are formed and secrets are hinted at, setting the stage for the unraveling mystery."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A small, cluttered room filled with books, papers, and an imposing mahogany desk, with a locked cabinet in the corner.",
      "sensoryDetails": {
        "sights": [
          "Papers strewn across the desk",
          "A large globe standing in the corner"
        ],
        "sounds": [
          "The ticking of a clock",
          "The rustle of papers being shuffled"
        ],
        "smells": [
          "The musty odor of old books",
          "The sharp scent of ink"
        ],
        "tactile": [
          "Smooth surface of the desk",
          "The cold metal of the locked cabinet"
        ]
      },
      "accessControl": "Access is limited to the head of the household and select family members; locked after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Soft light filtering through heavy curtains",
            "Water droplets on the windowpane"
          ],
          "sounds": [
            "Raindrops pattering against glass",
            "The faint echo of distant thunder"
          ],
          "smells": [
            "Damp wood",
            "The earthy scent of rain"
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Dimly lit corners",
            "Shadows creeping across the desk"
          ],
          "sounds": [
            "The ticking of the clock",
            "The rustle of pages turning"
          ],
          "smells": [
            "Faint whiff of cigar smoke",
            "The mustiness of paper"
          ],
          "mood": "tense focus"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Warm light spilling from a desk lamp",
            "The glow of the fireplace"
          ],
          "sounds": [
            "The crackle of burning wood",
            "The soft thud of a book being closed"
          ],
          "smells": [
            "The scent of burning wood",
            "A hint of leather from the chair"
          ],
          "mood": "quiet contemplation"
        }
      ],
      "paragraphs": [
        "The study is a sanctuary of thought, a small room filled with the clutter of the mind. Papers are strewn across the imposing mahogany desk, while a large globe stands sentinel in the corner, its surface marked by the passage of time. The air is thick with the musty odor of old books and the sharp scent of ink, creating an atmosphere conducive to discovery. Here, amidst the disarray, clues await those brave enough to seek them out.",
        "As the minutes tick away, the study becomes a crucible of tension, where thoughts collide, and secrets are guarded fiercely. The faint echo of raindrops pattering against the window adds to the sense of isolation, while the clock's relentless ticking serves as a reminder of the urgency of the situation. In this space, the boundaries of trust are tested, and the unraveling of the mystery hinges on the revelations that may lie hidden within these walls."
      ]
    },
    {
      "id": "gardens",
      "name": "The Gardens",
      "type": "exterior",
      "purpose": "Concealment and escape",
      "visualDetails": "Lush gardens with winding paths, hidden alcoves, and dense hedgerows that obscure sightlines.",
      "sensoryDetails": {
        "sights": [
          "Vibrant flower beds",
          "Twisting paths disappearing into the foliage"
        ],
        "sounds": [
          "Birdsong in the trees",
          "The rustle of leaves in the breeze"
        ],
        "smells": [
          "Freshly cut grass",
          "The sweet scent of blooming flowers"
        ],
        "tactile": [
          "Soft petals brushing against skin",
          "Cool, damp earth underfoot"
        ]
      },
      "accessControl": "Open to all guests during the day; guests are discouraged from wandering after dark.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Glistening raindrops on leaves",
            "Misty pathways winding through the gardens"
          ],
          "sounds": [
            "The gentle patter of rain on petals",
            "Birds chirping in the damp air"
          ],
          "smells": [
            "The fresh scent of rain-soaked earth",
            "The fragrant aroma of wet flowers"
          ],
          "mood": "serene yet ominous"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Muted colors of the garden",
            "Shadows lengthening as the sun sets"
          ],
          "sounds": [
            "The distant sound of thunder",
            "The soft rustling of foliage"
          ],
          "smells": [
            "A blend of damp earth and flowers",
            "The faint scent of decay from fallen leaves"
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Long shadows stretching across the lawn",
            "Fireflies beginning to flicker in the dusk"
          ],
          "sounds": [
            "The soft buzz of insects",
            "The sound of rustling as nocturnal creatures stir"
          ],
          "smells": [
            "The sweet scent of evening blooms",
            "The coolness of night air"
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The gardens surrounding Little Middleton Manor are a verdant maze, lush with vibrant flower beds and winding paths that twist and turn, creating a sense of both beauty and concealment. Here, alcoves hidden behind dense hedgerows invite quiet reflection, while the rustle of leaves in the breeze hints at secrets waiting to be uncovered. The air is fragrant with the scent of freshly cut grass and blooming flowers, a stark contrast to the tension brewing within the manor's walls.",
        "As evening descends, the gardens transform into a shadowy realm where light and dark dance together. The soft buzz of insects fills the air, and the flicker of fireflies adds an ethereal glow to the twilight. Yet, the quiet beauty of the gardens belies the growing sense of foreboding, as the potential for escape or concealment lingers in the air, making them a pivotal setting in the unfolding mystery."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023809731,
  "durationMs": 25822
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1934,
    "month": "February",
    "day": 14,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "damp and chilly air"
    ],
    "daylight": "Short daylight hours; the sun rises around 7:30 AM and sets by 5:30 PM, leaving long, gloomy evenings.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, after guests have gathered for dinner.",
    "holidays": [
      "Valentine's Day"
    ],
    "seasonalActivities": [
      "attending local theater productions",
      "indoor games such as bridge and chess",
      "writing letters to distant relatives"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "dark wool suit",
        "white dress shirt",
        "silk tie"
      ],
      "casual": [
        "tweed jacket",
        "corduroy trousers",
        "knit sweater"
      ],
      "accessories": [
        "fedora hat",
        "pocket watch",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "long-sleeved evening gown",
        "beaded clutch purse",
        "pearl necklace"
      ],
      "casual": [
        "woolen skirt",
        "cashmere cardigan",
        "blouse with lace trim"
      ],
      "accessories": [
        "felt cloche hat",
        "silk scarf",
        "ankle boots"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "use of bold geometric patterns",
      "emphasis on elegance in evening wear"
    ],
    "socialExpectations": [
      "men should always wear hats outdoors",
      "women are expected to be modest yet stylish",
      "formal gatherings require adherence to strict etiquette"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "continued economic struggle due to the Great Depression",
      "growing concerns about the rise of fascism in Europe",
      "debates over the New Deal programs in the U.S."
    ],
    "politicalClimate": "A climate of uncertainty and tension, with political divisions growing deeper as social unrest rises.",
    "economicConditions": "Widespread unemployment and poverty remain prevalent, leading to increased class tensions and fears among the middle class.",
    "socialIssues": [
      "displacement of families due to economic hardship",
      "labor strikes in various industries",
      "racial disparities in economic recovery"
    ],
    "internationalNews": [
      "Hitler consolidating power in Germany",
      "increasing military actions by Japan in Asia",
      "growing tensions in Eastern Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Louis Armstrong's jazz tunes",
        "Duke Ellington's orchestral pieces"
      ],
      "films": [
        "'It Happened One Night'",
        "Charlie Chaplin's 'City Lights'",
        "'The Thin Man'"
      ],
      "theater": [
        "'The Front Page'",
        "musical revues featuring popular songs",
        "'Porgy and Bess'"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "news broadcasts covering national and international events"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Glass Key' by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "social realism",
        "jazz poetry"
      ]
    },
    "technology": {
      "recentInventions": [
        "commercially available electric refrigerators",
        "early versions of television",
        "the first practical use of plastic"
      ],
      "commonDevices": [
        "home radios",
        "typewriters",
        "electric lights"
      ],
      "emergingTrends": [
        "home automation gadgets",
        "the growing popularity of films with synchronized sound",
        "increasing use of mass media for information dissemination"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread: four pence",
        "A movie ticket: one shilling",
        "Coal scuttle refill: one shilling sixpence"
      ],
      "commonActivities": [
        "social gatherings for card games",
        "visiting local parks despite the cold",
        "attending neighborhood meetings"
      ],
      "socialRituals": [
        "formal dinner parties to display social status",
        "afternoon tea gatherings among women",
        "weekly church services"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing resentment between the upper and working classes",
      "increased solidarity among the working class"
    ],
    "gender": [
      "women gradually entering the workforce",
      "traditional family roles still persist",
      "emerging debates on women's rights"
    ],
    "race": [
      "racial tensions exacerbated by economic disparities",
      "growing awareness of racial injustices"
    ],
    "generalNorms": [
      "strict adherence to social etiquette in public gatherings",
      "expectation of politeness and decorum",
      "importance of appearances in social situations"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of damp earth, as rain patters softly against the windows, creating an intimate yet eerie ambiance.",
    "Flickering candlelight casts dancing shadows across the richly decorated walls of the manor, heightening the feeling of suspense and hidden secrets.",
    "The muffled sounds of distant thunder blend with the soft strains of a jazz record, wrapping the evening in a cloak of tension and anticipation."
  ],
  "paragraphs": [
    "February 1934 envelops the manor house in a damp chill, with overcast skies and intermittent rain creating an atmosphere ripe for intrigue. The winter season clings to the air, where daylight is scarce and evening gatherings take on a more intimate, yet suspenseful tone. Guests have gathered to celebrate Valentine's Day, but the festivities are overshadowed by underlying tensions that have been brewing amongst them. The sound of raindrops tapping against the windows seems almost to echo the secrets that each guest harbors, setting the stage for a night that promises both revelation and danger.",
    "Fashion in this period reflects the elegance and somber tone of the times, with men donning dark wool suits and women appearing in long-sleeved evening gowns adorned with intricate beadwork. Accessories such as pocket watches and pearl necklaces add a touch of sophistication, while cloche hats complete the looks of both genders. The Art Deco influences are evident in the geometric patterns and bold colors that many of the guests wear, hinting at a desire for beauty even amid the gloom of the Great Depression. As the clock ticks ominously toward dinner, the guests' attire serves as a reminder of their social standings and the delicate etiquette that governs their interactions.",
    "Daily life in February 1934 is marked by a mix of hardship and resilience. Families gather for formal dinner parties to showcase their status, yet many struggle with the realities of unemployment and social unrest. The evening's activities include playing bridge and enjoying the latest musical hits over the radio, a brief escape from the day-to-day struggles. Social rituals like afternoon tea provide a forum for gossip and speculation, revealing the fractures within their society. As the guests settle into the manor's drawing room, the atmosphere thickens with tension, each sip of tea accompanied by unspoken words, as the shadows of their lives loom larger with every tick of the clock."
  ],
  "note": "",
  "cost": 0.00106639335,
  "durationMs": 10492
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the manor for a wealthy benefactor's will reading becomes fraught with tension as class disparities and personal grievances surface amidst the backdrop of the Great Depression.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The upper class grapples with the consequences of the Great Depression, leading to rising tensions with the working class and fears of societal upheaval."
  },
  "setting": {
    "location": "A sprawling country estate surrounded by woodlands and rolling hills.",
    "institution": "Manor house",
    "weather": "Overcast with intermittent rain, creating a damp and moody environment."
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
      "id": "clue_1",
      "category": "temporal",
      "description": "Witnesses recall the clock striking at quarter past nine during the will reading.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time of the will reading is confirmed as quarter past nine.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "If the clock struck at quarter past nine, then the murder must have occurred shortly before.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This establishes a timeline for the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "physical",
      "description": "A faint scratch is visible on the clock case, suggesting tampering.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "The clock may have been tampered with.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The scratch indicates that the clock was likely manipulated.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This suggests a deliberate effort to mislead regarding the time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "An unusual weight is found inside the clock that doesn't belong.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This weight may have been added to alter the clock's function.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The weight suggests that the clock was altered to mislead about the time.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This reinforces the idea of tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "Dr. Mallory Finch rewound the clock to create an alibi for himself after murdering Eleanor.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This reveals the mechanism of the alibi.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "If the clock struck at quarter past nine, then the murder must have occurred shortly before.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This establishes a timeline for the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the pub during the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This confirms he could not have committed the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "behavioral",
      "description": "Dr. Mallory Finch expressed a desire to secure financial stability before the will reading.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "This indicates a motive for murder.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The accurately accurately shows the time of death, which aligns with the witnesses' accounts.",
      "supportsAssumption": "The clock accurately shows the time of death.",
      "misdirection": "This misleads by suggesting that the accurately's time is reliable, despite evidence of tampering."
    },
    {
      "id": "rh_2",
      "description": "Guests at the manor reported hearing the prominent chime at the exact time of the murder.",
      "supportsAssumption": "The clock accurately shows the time of death.",
      "misdirection": "This creates a false sense of certainty about the timeline, ignoring the possibility of tampering."
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
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_dr_mallory_finch"
    ],
    "mid": [
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_core_elimination_chain"
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
  "latencyMs": 10768,
  "cost": 0.00289051125
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
